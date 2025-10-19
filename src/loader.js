/**
 * Owns the hidden loader iframe, buffering outbound messages until it is ready
 * and ensuring communication stays scoped to the expected frame origin.
 */
import { LOADER_SOURCE, TO_LOADER, DEBUG } from "./constants.js";

const log = (...args) => DEBUG ? console.log("[Loader]", ...args) : null;

/**
 * Manages the PDF loader iframe, message queue, and communication
 */
class LoaderManager {
  constructor() {
    this.frame = this.window = null;
    this.frameOrigin = "*";
    this.ready = false;
    this.queuedMessages = [];
  }

  ensureFrame(forceReload = false) {
    if (!document.body) return;

    log("ensureFrame", { forceReload, existing: !!this.frame });

    if (!forceReload && this.frame) return;

    this.frame?.remove?.();

    this.reset();
    this.createFrame();
  }

  createFrame() {
    const frame = document.createElement("iframe");
    frame.id = "pdf-loader-frame";
    frame.style.display = "none";
    const versionSuffix = `v=${Date.now()}`;
    frame.src = `${LOADER_SOURCE}${LOADER_SOURCE.includes("?") ? "&" : "?"}${versionSuffix}`;

    frame.addEventListener("load", () => {
      log("loader iframe load event fired");
      this.window = frame.contentWindow;

      try {
        const parsed = new URL(frame.src, window.location.href);
        this.frameOrigin = parsed.origin;
      } catch {
        this.frameOrigin = "*";
      }

      log("loader frame origin resolved", { origin: this.frameOrigin });
      this.flushQueue();
    });

    document.body.appendChild(frame);
    this.frame = frame;
  }

  reset() {
    this.ready = false;
    this.window = null;
    this.frameOrigin = "*";
    this.queuedMessages = [];
  }

  setReady(sourceWindow) {
    this.ready = true;
    if (!this.window) this.window = sourceWindow;
    this.flushQueue();
  }

  flushQueue() {
    if (!this.window || !this.ready) return;

    while (this.queuedMessages.length) {
      const next = this.queuedMessages.shift();
      try {
        this.window.postMessage(
          { type: next.type, val: next.val },
          this.frameOrigin,
          next.transfer
        );
      } catch (err) {
        log("flushQueue failed", {
          type: next.type,
          error: String(err),
        });
      }
    }
  }

  postMessage(type, val, transfer = []) {
    if (type === TO_LOADER.SET_URL && !val) return;

    log("postMessage", {
      type,
      ready: this.ready,
      queued: !this.window,
    });

    if (!this.window || !this.ready) {
      this.queuedMessages.push({ type, val, transfer });
      return;
    }

    try {
      this.window.postMessage({ type, val }, this.frameOrigin, transfer);
    } catch (err) {
      log("postMessage failed", { type, error: String(err) });
      this.queuedMessages.push({ type, val, transfer });
    }
  }

  isSource(source) {
    return this.frame && source === this.frame.contentWindow;
  }
}

export const loader = new LoaderManager();
