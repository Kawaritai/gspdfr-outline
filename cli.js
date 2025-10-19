#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const puppeteer = require("puppeteer");

// Configuration
const TIMEOUT_MS = 120000; // 2 minutes
const LOCALHOST = "127.0.0.1";

function printUsage() {
  console.log(`Usage: node cli.js <input.pdf> [output.pdf]

Arguments:
  <input.pdf>    Path to the source PDF to annotate with outline bookmarks.
  [output.pdf]   Optional output path. Defaults to '<input>-outlined.pdf'.

Options:
  --help, -h     Show this help message and exit.
`);
}

function createStaticServer(rootDir) {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".map": "application/json",
    ".wasm": "application/wasm",
  };

  return http.createServer((req, res) => {
    const parsed = url.parse(req.url);
    let pathname = parsed.pathname || "/";
    if (pathname === "/") pathname = "/index.html";
    
    const filePath = path.join(rootDir, pathname);
    
    // Security check
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
}

class ProgressBar {
  constructor(width = 40) {
    this.width = width;
    this.lastPercent = -1;
    this.isComplete = false;
    this.isActive = false;
  }

  update(percent) {
    if (this.isComplete) return;
    
    const p = Math.max(0, Math.min(100, Math.floor(percent)));
    
    // Only update if changed
    if (p === this.lastPercent) return;
    this.lastPercent = p;
    this.isActive = true;
    
    const filled = Math.floor((p / 100) * this.width);
    const empty = this.width - filled;
    
    const bar = "█".repeat(filled) + "░".repeat(empty);
    const line = `Progress: [${bar}] ${p}%`;
    
    // Clear line and write new progress
    process.stdout.write(`\r${line}`);
    
    if (p >= 100) {
      this.complete();
    }
  }

  complete() {
    if (this.isComplete) return;

    if (this.isActive) {
      if (this.lastPercent < 100) {
        const filled = this.width;
        const bar = "█".repeat(filled);
        const line = `Progress: [${bar}] 100%`;
        process.stdout.write(`\r${line}`);
        this.lastPercent = 100;
      }
      process.stdout.write("\n");
    }

    this.isComplete = true;
  }

  clear() {
    if (!this.isComplete && this.isActive) {
      // Clear the progress line
      process.stdout.write("\r" + " ".repeat(this.width + 20) + "\r");
    }
  }
}

async function run() {
  const args = process.argv.slice(2);
  
  // Handle help
  if (!args.length || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(!args.length ? 1 : 0);
  }

  const [inputArg, outputArg] = args;
  const inputPath = path.resolve(process.cwd(), inputArg);
  
  // Validate input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const rootDir = path.resolve(__dirname);
  const server = createStaticServer(rootDir);
  let browser = null;
  let exitCode = 0;
  const progressBar = new ProgressBar(40);

  try {
    // Start server
    await new Promise((resolve, reject) => {
      server.listen(0, LOCALHOST, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const address = server.address();
    const baseUrl = `http://${LOCALHOST}:${address.port}/index.html`;

    // Launch browser
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Enable console logging if DEBUG is set
    if (process.env.DEBUG) {
      page.on("console", msg => console.log("[Browser]", msg.text()));
      page.on("pageerror", err => console.error("[Browser Error]", err.message));
    }

    // Navigate to page
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    
    // Wait for the file input
    await page.waitForSelector("#pdf-input");
    
    // Set up a promise to track completion
    let resolveProcessing;
    const processingComplete = new Promise(resolve => {
      resolveProcessing = resolve;
    });
    
    // Expose functions that the browser can call
    await page.exposeFunction("reportStatusChange", (status, isTerminal, isError) => {
      // Print and clear progress for terminal messages
      if (isTerminal) {
        if (isError) {
          progressBar.clear();
        } else {
          progressBar.update(100);
        }
        console.log(status);
        resolveProcessing({ status, isError });
      } else if (status.includes("Reading") || status.includes("Decoding outline") || 
                 status.includes("Embedding outline") ||
                 status.includes("Failed to initialize") || status.includes("Password-protected")) {
        // Print important non-terminal messages
        // Clear progress bar first if it was active, so message appears cleanly
        if (status.includes("Embedding")) {
          progressBar.clear();
        }
        console.log(status);
      }
    });

    await page.exposeFunction("reportProgress", (percent) => {
      progressBar.update(percent);
    });
    
    // Set up progress and status monitoring before uploading
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const statusEl = document.getElementById("status");
        if (!statusEl) {
          throw new Error("Status element not found");
        }
        
        // Wait for main.js to load and set up progress callback
        const setupProgress = () => {
          if (typeof window.setProgressCallback === "function") {
            window.setProgressCallback((percent) => {
              // Call the exposed Node function
              if (typeof window.reportProgress === "function") {
                window.reportProgress(percent);
              }
            });
            return true;
          }
          return false;
        };
        
        // Try immediately, otherwise wait for it
        if (setupProgress()) {
          resolve();
        } else {
          const checkInterval = setInterval(() => {
            if (setupProgress()) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 10);
          // Stop checking after 5 seconds and resolve anyway
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 5000);
        }
        
        let lastStatus = "";
        
        // Create a MutationObserver to watch for status changes
        const observer = new MutationObserver(async (mutations) => {
          const currentStatus = statusEl.textContent || "";
          
          // Skip "No file selected" and duplicates
          if (currentStatus === "No file selected." || currentStatus === lastStatus) {
            return;
          }
          
          lastStatus = currentStatus;
          
          // Check if we've reached a terminal state
          const isError = currentStatus.includes("Failed to") || 
                         currentStatus.includes("not supported") ||
                         currentStatus.includes("no entries were found");
          
          const isSuccess = currentStatus.includes("Outline ready");
          const isTerminal = isError || isSuccess;
          
          // Report to Node via the exposed function
          if (typeof window.reportStatusChange === "function") {
            await window.reportStatusChange(currentStatus, isTerminal, isError);
          }
        });
        
        // Start observing
        observer.observe(statusEl, { 
          childList: true, 
          characterData: true, 
          subtree: true 
        });
      });
    });
    
    // Upload the file
    const inputHandle = await page.$("#pdf-input");
    if (!inputHandle) {
      throw new Error("Upload input not found on page.");
    }
    
    await inputHandle.uploadFile(inputPath);
    
    // Wait for processing to complete (with timeout)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Processing timeout after ${TIMEOUT_MS / 1000} seconds`)), TIMEOUT_MS);
    });
    
    const result = await Promise.race([processingComplete, timeoutPromise]);
    
    // Handle errors
    if (result.isError) {
      if (result.status.includes("no entries")) {
        exitCode = 4;
      } else if (result.status.includes("Password-protected")) {
        exitCode = 3;
      } else {
        exitCode = 1;
      }
      return; // Jump to finally block
    }
    
    // Extract the outlined PDF
    const pdfData = await page.evaluate(async () => {
      if (typeof window.getOutlinedPdfBytes !== "function") {
        return null;
      }
      const bytes = await window.getOutlinedPdfBytes();
      const name = typeof window.getOutlinedPdfName === "function" 
        ? window.getOutlinedPdfName() 
        : null;
      return { bytes, name };
    });

    if (!pdfData || !pdfData.bytes) {
      console.error("Failed to retrieve outlined PDF bytes from page");
      exitCode = 1;
      return; // Jump to finally block
    }

    // Write output file  
    const outputPath = outputArg
      ? path.resolve(process.cwd(), outputArg)
      : path.resolve(process.cwd(), pdfData.name || makeDefaultOutputName(inputPath));
    
    fs.writeFileSync(outputPath, Buffer.from(pdfData.bytes));
    console.log(`Outlined PDF written to ${outputPath}`);

  } catch (err) {
    progressBar.clear();
    if (err.name === "TimeoutError") {
      console.error(`Processing timeout after ${TIMEOUT_MS / 1000} seconds`);
    } else {
      console.error("Error:", err.message || err);
    }
    exitCode = 1;
  } finally {
    // Cleanup
    progressBar.complete();
    
    if (browser) {
      await browser.close();
    }
    
    // Properly close the server
    await new Promise((resolve) => {
      server.close(resolve);
    });
    
    // Explicitly exit with the appropriate code
    process.exit(exitCode);
  }
}

function makeDefaultOutputName(inputPath) {
  const base = path.basename(inputPath);
  const idx = base.toLowerCase().lastIndexOf(".pdf");
  if (idx !== -1) {
    return `${base.slice(0, idx)}-outlined.pdf`;
  }
  return `${base}-outlined.pdf`;
}

// Run the CLI
run().catch((err) => {
  console.error("Fatal error:", err.message || err);
  process.exit(1);
});
