/**
 * Tracks active PDF sources, caches fetched or uploaded documents, and slices
 * byte ranges for the loader’s streaming requests.
 */
import { DEBUG } from "./constants.js";

const log = (...args) => DEBUG ? console.log("[Loader]", ...args) : null;

/**
 * Manages PDF resources including caching, fetching, and uploading
 */
class PdfResourceManager {
  constructor() {
    this.activeSource = null;
    this.uploadedResource = this.uploadedObjectUrl = null;
    this.resourceCache = this.fetchPromise = this.fetchingUrl = null;
  }

  normalizePdfUrl(url) {
    try {
      return new URL(url, window.location.href).href;
    } catch {
      return url;
    }
  }

  setActiveUrl(rawUrl) {
    const loaderUrl = rawUrl ? this.normalizePdfUrl(rawUrl) : null;
    this.activeSource = loaderUrl ? { rawUrl, loaderUrl } : null;
    return loaderUrl;
  }

  getActiveUrl() {
    return this.activeSource?.loaderUrl || null;
  }

  async prepareUploadedFile(file) {
    const displayName = file.name || "uploaded.pdf";
    const buffer = await file.arrayBuffer();

    if (this.uploadedObjectUrl) URL.revokeObjectURL(this.uploadedObjectUrl);

    this.uploadedObjectUrl = URL.createObjectURL(file);
    const loaderUrl = this.setActiveUrl(this.uploadedObjectUrl);

    log("uploaded resource prepared", {
      displayName,
      loaderUrl,
      size: buffer.byteLength,
    });

    const resource = (this.uploadedResource = {
      url: loaderUrl,
      buffer,
      length: buffer.byteLength,
      encoding: "",
      filename: displayName,
    });

    this.resourceCache = resource;
    this.fetchPromise = this.fetchingUrl = null;

    return { displayName, loaderUrl, buffer };
  }

  async getResource(url) {
    if (!url) return null;

    const cached =
      this.resourceCache?.url === url
        ? this.resourceCache
        : this.uploadedResource?.url === url
        ? (this.resourceCache = this.uploadedResource)
        : null;
    if (cached) {
      log("getResource cache hit", { url, length: cached.length });
      return cached;
    }

    if (!this.fetchPromise || this.fetchingUrl !== url) {
      this.fetchingUrl = url;
      this.fetchPromise = this.fetchFromNetwork(url);
    }
    return this.fetchPromise;
  }

  async fetchFromNetwork(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch PDF (${response.status})`);

      const buffer = await response.arrayBuffer();
      const length = buffer.byteLength;
      const encoding = response.headers.get("content-encoding") ?? "";
      const filename =
        response.headers
          .get("content-disposition")
          ?.match(/filename="?([^";]+)"?/)?.[1] ||
        url.split("/").pop() ||
        "document.pdf";

      this.resourceCache = { url, buffer, length, encoding, filename };
      log("cached PDF bytes", length);
      return this.resourceCache;
    } finally {
      this.fetchPromise = this.fetchingUrl = null;
    }
  }

  sliceToUint8(buffer, begin, end) {
    const total = buffer.byteLength;
    const start = Number.isFinite(begin)
      ? Math.max(0, Math.min(total, Math.floor(begin)))
      : 0;
    const rawEnd = Number.isFinite(end) ? Math.floor(end) : total;
    const finish = Math.max(start, Math.min(total, rawEnd));
    return new Uint8Array(buffer, start, finish - start);
  }

  getUploadedResource() {
    return this.uploadedResource;
  }
}

export const pdfResource = new PdfResourceManager();
