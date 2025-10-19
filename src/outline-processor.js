/**
 * Translates analyzer output into PDF outline nodes and mutates PDFs with
 * bookmark dictionaries, filenames, and downloadable blobs.
 */
import {
  PDFDocument,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFString,
} from "../lib/pdf-lib.esm.js";

/**
 * Handles outline conversion and PDF manipulation
 */
class OutlineProcessor {
  constructor() {
    this.downloadUrl = null;
    this.lastDataRef = null;
  }

  sanitizeText(value) {
    if (typeof value !== "string") return "";
    const sanitized = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    return sanitized.replace(/\s+/g, " ").trim();
  }

  escapePdfString(text) {
    // Escape special PDF string characters
    return text
      .replace(/\\/g, "\\\\")  // Backslash must be first
      .replace(/\(/g, "\\(")   // Left paren
      .replace(/\)/g, "\\)")   // Right paren
      .replace(/\r/g, "\\r")   // Carriage return
      .replace(/\n/g, "\\n");  // Newline
  }

  createPdfString(pdfContext, text) {
    if (!text) return PDFString.of("");

    const sanitized = this.sanitizeText(text);
    const hasNonAscii = /[^\x20-\x7E]/.test(sanitized);

    if (hasNonAscii) {
      let hexStr = "FEFF"; // BOM

      for (let i = 0; i < sanitized.length; i++) {
        const code = sanitized.charCodeAt(i);
        hexStr += code.toString(16).padStart(4, "0");
      }

      // Use hex string notation: <FEFF...>
      return pdfContext.obj(`<${hexStr}>`);
    } else {
      // ASCII - escape special chars and use PDFString
      const escaped = this.escapePdfString(sanitized);
      return PDFString.of(escaped);
    }
  }

  convertToNodes(outline) {
    const nodes = [];
    if (!Array.isArray(outline)) return { nodes, totalCount: 0 };

    const children = Array.isArray(outline[1]) ? outline[1] : [];
    for (const entry of children) {
      const node = this.convertEntry(entry);
      if (node) nodes.push(node);
    }

    const totalCount = this.computeCounts(nodes);
    return { nodes, totalCount };
  }

  convertEntry(entry) {
    if (!Array.isArray(entry)) return null;

    const label = this.sanitizeText(entry[0]);
    const name = this.sanitizeText(entry[1]);
    let pageIndex = Number(entry[2]);

    if (!Number.isFinite(pageIndex) || pageIndex < 0) {
      pageIndex = 0;
    } else {
      pageIndex = Math.floor(pageIndex);
    }

    const page = pageIndex + 1;
    const position = (() => {
      const raw = Number(entry[3]);
      if (!Number.isFinite(raw)) return null;
      return Math.min(Math.max(raw, 0), 1);
    })();

    const titleParts = [];
    if (label) titleParts.push(label);
    if (name && name !== label) titleParts.push(name);
    const title = titleParts.join(" ").trim() || "Untitled section";

    let childArray = null;
    for (let i = entry.length; i--; ) {
      if (Array.isArray(entry[i])) {
        childArray = entry[i];
        break;
      }
    }

    const children = Array.isArray(childArray)
      ? childArray
          .map((child) => this.convertEntry(child))
          .filter(Boolean)
      : [];

    return { title, page, position, children, descendantCount: 0 };
  }

  computeCounts(nodes) {
    let total = 0;
    for (const node of nodes) {
      total += 1 + (node.descendantCount = this.computeNodeDescendants(node));
    }
    return total;
  }

  computeNodeDescendants(node) {
    const children = Array.isArray(node.children)
      ? node.children
      : (node.children = []);
    let total = 0;
    for (const child of children) {
      total += 1 + (child.descendantCount = this.computeNodeDescendants(child));
    }
    return total;
  }

  async buildPdfWithOutline(originalBytes, outlineData) {
    const pdfDoc = await PDFDocument.load(originalBytes, {
      updateMetadata: false,
      ignoreEncryption: true,
    });

    const pages = pdfDoc.getPages();
    if (!pages.length) {
      throw new Error("Unable to locate PDF page objects.");
    }

    const pageInfos = pages.map((page) => {
      const { x, y, width, height } = page.getCropBox();
      return {
        ref: page.ref,
        box: {
          left: x,
          bottom: y,
          right: x + width,
          top: y + height,
          width,
          height,
        },
      };
    });

    const pdfContext = pdfDoc.context;
    const outlineRootDict = PDFDict.withContext(pdfContext);
    outlineRootDict.set(PDFName.of("Type"), PDFName.of("Outlines"));
    const outlineRootRef = pdfContext.register(outlineRootDict);

    const outlineContext = {
      pageInfos,
      pdfContext,
    };

    const topInfo = this.createOutlineObjects(
      outlineData.nodes,
      outlineRootRef,
      outlineContext
    );

    if (topInfo.firstRef) {
      outlineRootDict.set(PDFName.of("First"), topInfo.firstRef);
      outlineRootDict.set(PDFName.of("Last"), topInfo.lastRef);
      if (outlineData.totalCount > 0) {
        outlineRootDict.set(
          PDFName.of("Count"),
          PDFNumber.of(outlineData.totalCount)
        );
      }
    }

    const catalog = pdfDoc.catalog;
    catalog.set(PDFName.of("Outlines"), outlineRootRef);
    catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));

    return pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
    });
  }

  createOutlineObjects(nodes, parentRef, context) {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return { firstRef: null, lastRef: null };
    }

    const { pageInfos, pdfContext } = context;

    const entries = nodes.map((node) => {
      const dict = PDFDict.withContext(pdfContext);
      const ref = pdfContext.register(dict);
      return { node, dict, ref };
    });

    entries.forEach((entry, index) => {
      const { node, dict, ref } = entry;
      const prevRef = index > 0 ? entries[index - 1].ref : null;
      const nextRef = index < entries.length - 1 ? entries[index + 1].ref : null;
      const pageIndex = Math.min(
        Math.max((node.page || 1) - 1, 0),
        pageInfos.length - 1
      );
      const pageInfo = pageInfos[pageIndex] || pageInfos[0];
      const pageRef = pageInfo?.ref || pageInfos[0]?.ref;
      const top = this.computeDestTop(pageInfo, node.position);
      const childInfo = this.createOutlineObjects(node.children, ref, context);

      dict.set(PDFName.of("Title"), this.createPdfString(pdfContext, node.title));
      dict.set(PDFName.of("Parent"), parentRef);

      if (pageRef)
        dict.set(
          PDFName.of("Dest"),
          this.buildDestinationArray(pdfContext, pageRef, top)
        );

      prevRef && dict.set(PDFName.of("Prev"), prevRef);
      nextRef && dict.set(PDFName.of("Next"), nextRef);

      if (childInfo.firstRef) {
        dict.set(PDFName.of("First"), childInfo.firstRef);
        dict.set(PDFName.of("Last"), childInfo.lastRef);
      }

      if (node.descendantCount > 0) {
        dict.set(PDFName.of("Count"), PDFNumber.of(node.descendantCount));
      }
    });

    return {
      firstRef: entries[0]?.ref ?? null,
      lastRef: entries[entries.length - 1]?.ref ?? null,
    };
  }

  buildDestinationArray(pdfContext, pageRef, top) {
    return top === null
      ? pdfContext.obj([pageRef, "Fit"])
      : pdfContext.obj([pageRef, "XYZ", null, Number(top.toFixed(2)), null]);
  }

  computeDestTop(pageInfo, position) {
    const box = pageInfo?.box;
    if (!box || !Number.isFinite(box.height)) return null;
    if (position === null || !Number.isFinite(position)) return null;

    const clamped = Math.min(Math.max(position, 0), 1);
    const top = box.top - clamped * box.height;

    if (!Number.isFinite(top)) return null;
    return top;
  }

  makeOutlinedFilename(originalName) {
    if (!originalName) return "document-outlined.pdf";
    const dotIndex = originalName.toLowerCase().lastIndexOf(".pdf");
    return dotIndex !== -1
      ? `${originalName.slice(0, dotIndex)}-outlined.pdf`
      : `${originalName}-outlined.pdf`;
  }

  clearDownloadUrl() {
    if (this.downloadUrl) {
      URL.revokeObjectURL(this.downloadUrl);
      this.downloadUrl = null;
    }
  }

  createDownloadUrl(pdfBytes) {
    this.clearDownloadUrl();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    this.downloadUrl = URL.createObjectURL(blob);
    return this.downloadUrl;
  }

  getDownloadUrl() {
    return this.downloadUrl;
  }

  async getDownloadBytes() {
    if (!this.downloadUrl) return null;
    const buffer = await (await fetch(this.downloadUrl)).arrayBuffer();
    return Array.from(new Uint8Array(buffer));
  }

  shouldProcessOutline(outline) {
    if (!Array.isArray(outline) || outline === this.lastDataRef) return false;
    this.lastDataRef = outline;
    return true;
  }

  reset() {
    this.clearDownloadUrl();
    this.lastDataRef = null;
  }
}

export const outlineProcessor = new OutlineProcessor();
