/**
 * Orchestrates the analyzer worker lifecycle and routes progress, bytes, and
 * query messages between the worker, loader iframe, and shared application state.
 */
import { ANALYZER_SOURCE, TO_LOADER, DEBUG } from "./constants.js";
import { state } from "./state.js";

const log = (...args) => DEBUG ? console.log("[Analyzer]", ...args) : null;

/**
 * Manages the analyzer web worker and request tracking
 */
class AnalyzerManager {
  constructor() {
    this.worker = null;
    this.pendingRequests = new Map();
    this.onProgressCallback = this.onBytesCallback = this.onQueryCallback = null;
  }

  initialize() {
    try {
      this.worker?.terminate();
    } catch (err) {
      console.warn("Failed to terminate previous analyzer worker", err);
    }

    this.worker = new Worker(ANALYZER_SOURCE);
    this.worker.onerror = (event) => console.error("[Analyzer error]", event);
    this.worker.onmessageerror = (event) =>
      console.error("[Analyzer messageerror]", event);
    this.worker.addEventListener("message", (event) =>
      this.handleMessage(event)
    );

    this.pendingRequests.clear();
    this.worker.postMessage({ m: 0 });
    this.worker.postMessage({ k: "", l: "", kl: 0 });
  }

  handleMessage(event) {
    const msg = event.data;
    if (!msg) return;

    if (typeof msg.p === "number") {
      this.onProgressCallback?.(msg.p);
      return;
    }

    if ("hk" in msg) return log("handshake ack:", !!msg.hk);

    for (const [key, kind] of [
      ["o", "outline"],
      ["c", "config"],
      ["a", "aux"],
    ]) {
      const bytes = msg[key];
      if (bytes instanceof Uint8Array) {
        log(`${kind} bytes received:`, bytes.byteLength);
        this.onBytesCallback?.(kind, bytes);
        return;
      }
    }

    if (typeof msg.q === "string") {
      this.handleQuery(msg.q);
      return;
    }

    log("unhandled message", msg);
  }

  handleQuery(queryString) {
    let payload;
    try {
      payload = JSON.parse(queryString);
    } catch (err) {
      console.error("Failed to parse analyzer query", err, queryString);
      return;
    }

    if (!Array.isArray(payload) || payload.length < 4) {
      console.error("Unexpected analyzer query format", payload);
      return;
    }

    const [requestId, op, , page] = payload;
    this.pendingRequests.set(requestId, { op, page });

    this.onQueryCallback?.(TO_LOADER.QUERY, queryString);
  }

  forwardResult(payload) {
    if (!this.worker) return;
    if (!payload || typeof payload !== "object") return;

    const { id, result } = payload;
    const pending = this.pendingRequests.get(id);

    if (!pending) {
      console.warn("Received loader response for unknown request", id);
      return;
    }

    this.pendingRequests.delete(id);

    // Store raw data if available
    if (result && typeof result === "object" && typeof result.p === "string") {
      try {
        const parsedArray = JSON.parse(result.p);
        state.setRawData(parsedArray);
      } catch (err) {
        log("Failed to parse loader JSON payload:", err);
      }
    }

    // Prepare transferables
    const transferables = [];
    if (
      result &&
      typeof result === "object" &&
      typeof ImageBitmap !== "undefined" &&
      result.c instanceof ImageBitmap
    ) {
      transferables.push(result.c);
    }

    this.worker.postMessage(
      {
        r: {
          i: id,
          t: pending.op,
          p: pending.page,
          r: result,
        },
      },
      transferables
    );
  }

  setPageCount(count) {
    if (this.worker && Number.isFinite(count)) {
      this.worker.postMessage({ n: Math.max(0, Math.floor(count)) });
    }
  }

  setCallbacks({ onProgress, onBytes, onQuery }) {
    this.onProgressCallback = onProgress;
    this.onBytesCallback = onBytes;
    this.onQueryCallback = onQuery;
  }
}

export const analyzer = new AnalyzerManager();
