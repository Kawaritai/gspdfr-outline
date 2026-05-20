/**
 * Spins up an isolated iframe to run the compiled proto reader and exposes
 * helpers for queuing, decoding, and replaying analyzer byte streams.
 */
import { MSG_TYPE, DEBUG } from "./constants.js";
import { state } from "./state.js";

const log = (...args) => DEBUG ? console.log("[Analyzer]", ...args) : null;

/**
 * Manages the proto decoder iframe and decoding operations
 */
class ProtoDecoderManager {
  constructor() {
    this.window = this.decoder = this.readyPromise = null;
  }

  async initialize() {
    if (this.window) return this.window;
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = this.createDecoderFrame();
    return this.readyPromise;
  }

  createDecoderFrame() {
    return new Promise((resolve) => {
      const frame = document.createElement("iframe");
      frame.style.display = "none";
      const base = new URL("./", window.location.href).href;

      frame.srcdoc = this.buildFrameContent(base);
      document.body.appendChild(frame);

      const handleMessage = (event) => {
        if (event.source !== frame.contentWindow) return;
        const data = event.data;
        if (!data || typeof data !== "object") return;

        if (data.type === MSG_TYPE.PROTO_ERROR) {
          console.error(
            "[Analyzer] proto iframe error:",
            data.message || "",
            data.stack || ""
          );
          return;
        }

        if (data.type !== MSG_TYPE.PROTO_READY) return;

        window.removeEventListener("message", handleMessage);
        this.window = frame.contentWindow;

        try {
          if (!data.hasQp) {
            console.error("[Analyzer] proto decoder missing Qp export");
          }

          this.decoder = {
            decode: this.window.Qp?.bind(this.window),
            toArray: this.window.ed?.bind(this.window),
          };

          if (!this.decoder.decode) {
            console.warn("[Analyzer] proto decoder missing Qp");
          } else {
            console.log("[Analyzer] proto decoder ready");
          }
        } catch (err) {
          console.error("[Analyzer] failed to prepare proto decoder:", err);
        }

        resolve(this.window);
      };

      window.addEventListener("message", handleMessage);
    });
  }

  buildFrameContent(base) {
    return `
<!doctype html>
<html>
  <head>
    <base href="${base}">
    <script>
      (() => {
        const parentWindow = window.parent || window;
        const noop = () => {};
        const forward = (payload) => parentWindow.postMessage(payload, "*");
        window.__PROTO_ONLY__ = true;
        window.chrome =
          parentWindow.chrome || {
            runtime: {
              getManifest: () => ({ version: "0.0.0" }),
              id: "proto",
              sendMessage: noop,
              onMessage: { addListener: noop, removeListener: noop },
              onMessageExternal: { addListener: noop, removeListener: noop },
              getURL: (path) => path,
              connect: () => ({
                postMessage: noop,
                onDisconnect: { addListener: noop },
                onMessage: { addListener: noop },
              }),
            },
            i18n: { getMessage: () => "" },
            storage: {
              local: { get: noop, set: noop },
              sync: { get: noop, set: noop },
            },
            bookmarks: {},
            tabs: {},
          };
        if (!window.navigator) window.navigator = {};
        if (!window.navigator.language && parentWindow.navigator) {
          window.navigator.language = parentWindow.navigator.language;
        }
        if (!window.fetch && parentWindow.fetch) {
          window.fetch = (...args) => parentWindow.fetch(...args);
        }
        if (!window.AbortSignal && parentWindow.AbortSignal) {
          window.AbortSignal = parentWindow.AbortSignal;
        }
        if (!window.Response && parentWindow.Response) {
          window.Response = parentWindow.Response;
        }
        if (!window.ReadableStream && parentWindow.ReadableStream) {
          window.ReadableStream = parentWindow.ReadableStream;
        }
        if (!window.OffscreenCanvas && parentWindow.OffscreenCanvas) {
          window.OffscreenCanvas = parentWindow.OffscreenCanvas;
        }
        if (!window.ImageBitmap && parentWindow.ImageBitmap) {
          window.ImageBitmap = parentWindow.ImageBitmap;
        }
        window.addEventListener("error", (event) => {
          forward({
            type: "proto_error",
            message: event.message,
            stack: event.error && event.error.stack ? event.error.stack : "",
          });
        });
        window.addEventListener("unhandledrejection", (event) => {
          forward({
            type: "proto_error",
            message: String(event.reason || "Unhandled rejection"),
          });
        });
      })();
    </script>
    <script src="lib/reader-compiled.js" onload="window.parent.postMessage({ type: 'proto_ready', hasQp: typeof window.Qp === 'function' }, '*')"></script>
  </head>
  <body></body>
</html>`;
  }

  decode(bytes, kind) {
    if (!this.decoder?.decode) return null;

    try {
      // Wrap bytes in proto decoder iframe's Uint8Array for cross-iframe compatibility
      let frameBytes = bytes;
      if (this.window?.Uint8Array && !(bytes instanceof this.window.Uint8Array)) {
        frameBytes = new this.window.Uint8Array(bytes);
      }

      const proto = this.decoder.decode(frameBytes);
      if (!proto) return null;

      const data = this.decoder.toArray
        ? this.decoder.toArray(proto)
        : proto.toJSON?.() ?? proto;

      return { proto, data, kind };
    } catch (err) {
      console.error(`Failed to decode ${kind}:`, err);
      return null;
    }
  }

  processBytes(kind, bytes, onOutlineUpdate) {
    if (!(bytes instanceof Uint8Array)) return;

    const copy = new Uint8Array(bytes);
    state.setPendingDecode(kind, copy);
    this.decoder?.decode
      ? this.decodeAndStore(kind, copy, onOutlineUpdate)
      : log(`${kind} bytes cached awaiting proto decoder`);
  }

  decodeAndStore(kind, bytes, onOutlineUpdate) {
    if (!bytes || !this.decoder?.decode) return;

    const decoded = this.decode(bytes, kind);
    if (!decoded) {
      console.error(`Failed to decode ${kind} bytes`);
      return;
    }

    state.setDecodedState(kind, decoded.data, decoded.proto);
    log(`${kind} decoded via proto`);

    if (kind === "outline" && decoded.proto?.getTitle) {
      try {
        log("outline title:", decoded.proto.getTitle());
      } catch (_) {}
    }

    if (kind === "outline" && onOutlineUpdate) {
      void onOutlineUpdate(state.getOutline());
    }
  }

  flushPendingDecodes(onOutlineUpdate) {
    ["outline", "aux", "config"].forEach((kind) => {
      const bytes = state.pendingDecodes[kind];
      if (bytes) {
        this.decodeAndStore(kind, bytes, onOutlineUpdate);
        state.pendingDecodes[kind] = null;
      }
    });
  }

  isReady() {
    return !!this.decoder?.decode;
  }
}

export const protoDecoder = new ProtoDecoderManager();
