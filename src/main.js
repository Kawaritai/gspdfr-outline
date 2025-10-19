/**
 * Boots the extension UI, wires analyzers, loader, and proto decoder together,
 * and coordinates messages so uploaded PDFs receive generated outline metadata.
 */
/**
 * Main application orchestrator
 * Coordinates all modules to handle PDF outline analysis and embedding
 */

import { MSG_TYPE, TO_LOADER, DEBUG } from "./constants.js";
import { state } from "./state.js";
import { loader } from "./loader.js";
import { protoDecoder } from "./proto-decoder.js";
import { pdfResource } from "./pdf-resource.js";
import { analyzer } from "./analyzer.js";
import { outlineProcessor } from "./outline-processor.js";
import { ui } from "./ui.js";

const log = (...args) => DEBUG ? console.log("[Analyzer]", ...args) : null;

/**
 * Application coordinator class
 */
class Application {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Initialize UI
    ui.initialize();
    ui.setFileSelectedCallback((file) => this.handleFileUpload(file));

    // Setup analyzer callbacks
    analyzer.setCallbacks({
      onProgress: (percent) => ui.updateProgress(percent),
      onBytes: (kind, bytes) => this.handleAnalyzerBytes(kind, bytes),
      onQuery: (type, query) => loader.postMessage(type, query),
    });

    // Setup loader frame
    loader.ensureFrame();

    // Initialize proto decoder
    await protoDecoder.initialize();

    // Setup window message listeners
    this.setupMessageListeners();

    // Expose window API
    this.setupWindowAPI();

    this.initialized = true;
  }

  setupMessageListeners() {
    // Debug window messages
    if (typeof window !== "undefined" && DEBUG) {
      window.addEventListener("message", (event) => {
        const type =
          event.data && typeof event.data === "object" && "type" in event.data
            ? event.data.type
            : null;
        console.log("[Window message]", {
          origin: event.origin || event.originalEvent?.origin || "",
          hasData: event.data !== undefined,
          type,
        });
      });
    }

    // Loader frame messages
    window.addEventListener("message", (event) => {
      if (!loader.isSource(event.source)) return;
      this.handleLoaderMessage(event);
    });
  }

  setupWindowAPI() {
    if (typeof window === "undefined") return;

    window.getOutlinedPdfBytes = () => outlineProcessor.getDownloadBytes();
    window.getOutlinedPdfName = () => ui.getDownloadFilename();
  }

  handleLoaderMessage(event) {
    const data = event.data;
    if (!data || typeof data !== "object" || !("type" in data)) return;

    const { type, val } = data;

    if (type === MSG_TYPE.PROTO_ERROR) {
      console.error("[Proto] error", data.message || val, data.stack || "");
      return;
    }

    const handlers = {
      [MSG_TYPE.LOADER_READY]: () => {
        loader.setReady(event.source);
        const url = pdfResource.getActiveUrl();
        if (url) loader.postMessage(TO_LOADER.SET_URL, url);
      },
      [MSG_TYPE.LOADER_STREAMING]: () =>
        log("loader streaming mode:", val),
      [MSG_TYPE.LOADER_PROGRESS]: () => {
        if (val?.loaded !== undefined && val?.total !== undefined) {
          log("loader progress", val.loaded, "/", val.total);
        }
      },
      [MSG_TYPE.PAGE_COUNT]: () => analyzer.setPageCount(val),
      [MSG_TYPE.LOADER_INIT_FAILED]: () => {
        console.error("Loader failed to initialize PDF");
        ui.updateStatus("Loader failed to initialize PDF.");
        ui.hideProgress();
      },
      [MSG_TYPE.PASSWORD_PROTECTED]: () => {
        console.warn("Password-protected PDFs are not supported.");
        ui.updateStatus("Password-protected PDFs are not supported.");
        ui.hideProgress();
      },
      [MSG_TYPE.QUERY_RESULT]: () => analyzer.forwardResult(val),
      [MSG_TYPE.METADATA]: () => log("metadata received"),
      [MSG_TYPE.LOADER_FETCH]: () => this.handleLoaderFetch(event),
      __default: () => console.log("[Loader] unknown message type", type, val),
    };

    (handlers[type] || handlers.__default)();
  }

  handleAnalyzerBytes(kind, bytes) {
    protoDecoder.processBytes(kind, bytes, (outline) =>
      this.handleOutlineUpdate(outline)
    );
  }

  async handleOutlineUpdate(outline) {
    ui.hideProgress();

    if (!outlineProcessor.shouldProcessOutline(outline)) return;

    const uploadedResource = pdfResource.getUploadedResource();
    if (!uploadedResource?.buffer) {
      console.warn("Outline decoded but no uploaded PDF available.");
      return;
    }

    try {
      const { nodes, totalCount } = outlineProcessor.convertToNodes(outline);
      if (!nodes.length) {
        ui.updateStatus("Outline decoded, but no entries were found.");
        return;
      }

      ui.updateStatus("Embedding outline into PDF...");

      const originalBytes = new Uint8Array(uploadedResource.buffer);
      const outlinedPdf = await outlineProcessor.buildPdfWithOutline(
        originalBytes,
        { nodes, totalCount }
      );

      const downloadUrl = outlineProcessor.createDownloadUrl(outlinedPdf);
      const downloadName = outlineProcessor.makeOutlinedFilename(
        uploadedResource.filename || "document.pdf"
      );

      ui.setDownloadLink(downloadUrl, downloadName);
      ui.updateStatus(`Outline ready. Download "${downloadName}".`);
    } catch (err) {
      console.error("Failed to embed PDF outline bookmarks:", err);
      ui.updateStatus(
        "Failed to embed outline into PDF. Check console for details."
      );
    }
  }

  async handleFileUpload(file) {
    const { displayName, loaderUrl } = await pdfResource.prepareUploadedFile(
      file
    );

    log("loadUploadedPdf invoked", { displayName });

    [state, outlineProcessor].forEach((mod) => mod.reset());
    ui.clearDownloadLink();
    ui.hideProgress();
    ["Reading", "Decoding outline for"].forEach((stage) =>
      ui.updateStatus(`${stage} "${displayName}"...`)
    );
    loader.ensureFrame(true);
    log("loader frame ensured");

    await protoDecoder.initialize().catch((err) => {
      console.error("Proto decoder failed to initialize:", err);
      ui.updateStatus("Failed to initialize decoder.");
      ui.hideProgress();
      throw err;
    });

    log("proto decoder ready, initializing analyzer worker");
    analyzer.initialize();

    // Flush any pending decodes now that decoder is ready
    protoDecoder.flushPendingDecodes((outline) =>
      this.handleOutlineUpdate(outline)
    );
  }

  handleLoaderFetch(event) {
    const port = event.ports?.[0];
    if (!port) {
      console.log("[Loader] fetch request without message port");
      return;
    }

    port.start?.();

    const url =
      (event.data?.url && typeof event.data.url === "string"
        ? event.data.url
        : null) || pdfResource.getActiveUrl();

    if (!url) {
      console.log("[Loader] fetch request without active PDF url");
      port.postMessage({ type: "pdf", error: "No active PDF" });
      return;
    }

    console.log("[Loader] fetch requested", { url });
    void this.providePdfToPort(port, url);
  }

  async providePdfToPort(port, url) {
    console.log("[Loader] providePdfToPort invoked", { hasPort: !!port, url });

    try {
      const resource = await pdfResource.getResource(url);
      if (!resource) throw new Error("No PDF resource available");

      console.log("[Loader] pdf resource ready", {
        url,
        length: resource.length,
        encoding: resource.encoding,
      });

      port.onmessage = ({ data: msg }) => {
        if (!msg || typeof msg !== "object" || msg.type !== "fetchrange")
          return;

        const begin = Number.isFinite(msg.begin) ? msg.begin : 0;
        const end = Number.isFinite(msg.end) ? msg.end : Number(msg.end);
        const chunk = pdfResource.sliceToUint8(resource.buffer, begin, end);

        console.log("[Loader] sending range chunk", {
          length: chunk.byteLength,
          begin,
        });

        port.postMessage({ type: "pdfrange", begin, body: chunk });
      };

      const view = new Uint8Array(resource.buffer);
      console.log("[Loader] sending base pdf payload", {
        length: view.byteLength,
      });

      port.postMessage({
        type: "pdf",
        body: view,
        length: resource.length,
        encoding: resource.encoding,
        filename: resource.filename,
      });
    } catch (error) {
      console.error("Failed to supply PDF to loader:", error);
      port.postMessage({ type: "pdf", error: String(error?.message ?? error) });
    }
  }
}

// Initialize application
const app = new Application();
app.initialize();
