/**
 * Grabs key DOM elements, keeps status/progress indicators in sync, and bridges
 * file input events to the analysis pipeline.
 */
import { DEBUG } from "./constants.js";

/**
 * Manages UI elements and user interactions
 */
class UIManager {
  constructor() {
    this.fileInput = this.statusElement = this.downloadLink = null;
    this.progressContainer = this.progressFill = this.progressText = null;
    this.progressCallback = this.onFileSelectedCallback = null;
  }

  initialize() {
    if (typeof document === "undefined") return;

    const byId = (id) => document.getElementById(id);
    Object.assign(this, {
      fileInput: byId("pdf-input"),
      statusElement: byId("status"),
      downloadLink: byId("outline-download"),
      progressContainer: byId("progress-container"),
      progressFill: byId("progress-fill"),
      progressText: byId("progress-text"),
    });

    this.fileInput?.addEventListener("change", async ({ currentTarget }) => {
      const file = currentTarget?.files?.[0];
      if (!file) return this.updateStatus("No file selected.");
      try {
        await this.onFileSelectedCallback?.(file);
      } catch (err) {
        console.error("Failed to load selected PDF:", err);
        this.updateStatus("Failed to load selected PDF.");
        this.hideProgress();
      } finally {
        if (currentTarget) currentTarget.value = "";
      }
    });

    this.updateStatus("Select a PDF to analyze.");

    if (typeof window !== "undefined") {
      window.setProgressCallback = (callback) => {
        this.progressCallback = callback;
      };
    }
  }

  updateStatus(message) {
    this.statusElement
      ? (this.statusElement.textContent = message)
      : DEBUG && console.log("[Status]", message);
  }

  updateProgress(percent) {
    const clamped = Math.max(0, Math.min(100, Math.floor(percent)));

    this.progressContainer && (this.progressContainer.style.display = "block");
    this.progressFill && (this.progressFill.style.width = `${clamped}%`);
    this.progressText && (this.progressText.textContent = `${clamped}%`);
    this.progressCallback?.(clamped);
  }

  hideProgress() {
    this.progressContainer && (this.progressContainer.style.display = "none");
    this.progressFill && (this.progressFill.style.width = "0%");
    this.progressText && (this.progressText.textContent = "0%");
  }

  setDownloadLink(url, filename) {
    if (!this.downloadLink) return;
    Object.assign(this.downloadLink, { href: url, download: filename });
    this.downloadLink.style.display = "inline";
    if (typeof window !== "undefined") window.__outlinedPdfName = filename;
  }

  clearDownloadLink() {
    if (!this.downloadLink) return;
    this.downloadLink.style.display = "none";
    this.downloadLink.removeAttribute("href");
  }

  setFileSelectedCallback(callback) {
    this.onFileSelectedCallback = callback;
  }

  getDownloadFilename() {
    return this.downloadLink?.download ?? window.__outlinedPdfName ?? null;
  }
}

export const ui = new UIManager();
