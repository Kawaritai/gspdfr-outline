/**
 * Central location for loader/analyzer message identifiers and runtime flags
 * shared across the extension’s modules.
 */
export const ANALYZER_SOURCE = "../lib/analyzer_worker_bin.js";
export const LOADER_SOURCE = "../lib/pdf_loader_iframe.html";
export const DEBUG = false;

// Message type constants for loader messages
export const MSG_TYPE = {
  LOADER_READY: 0,
  LOADER_STREAMING: 1,
  LOADER_PROGRESS: 2,
  PAGE_COUNT: 3,
  LOADER_INIT_FAILED: 4,
  PASSWORD_PROTECTED: 5,
  QUERY_RESULT: 6,
  METADATA: 7,
  LOADER_FETCH: "fetch",
  PROTO_ERROR: "proto_error",
  PROTO_READY: "proto_ready",
};

// Message type constants for sending to loader
export const TO_LOADER = {
  QUERY: 0,
  SET_URL: 4,
};
