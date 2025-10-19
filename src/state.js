/**
 * Provides shared mutable state for analyzer outputs and pending decodes,
 * exposing helpers to reset and access the most recent outline data.
 */
const SHARED_DEFAULTS = {
  lastConfig: null,
  lastOutline: null,
  lastAux: null,
  lastRaw: null,
  lastOutlineProto: null,
  lastAuxProto: null,
  lastConfigProto: null,
  lastOutlineBytes: null,
  lastAuxBytes: null,
  lastConfigBytes: null,
};

const PENDING_DEFAULTS = { outline: null, aux: null, config: null };
const KIND_KEYS = {
  outline: ["lastOutline", "lastOutlineProto", "lastOutlineBytes"],
  aux: ["lastAux", "lastAuxProto", "lastAuxBytes"],
  config: ["lastConfig", "lastConfigProto", "lastConfigBytes"],
};

class State {
  constructor() {
    // Shared analysis state
    this.textDecoder = new TextDecoder("utf-8");
    this.sharedState = { ...SHARED_DEFAULTS };
    this.pendingDecodes = { ...PENDING_DEFAULTS };

    // Expose state to window for debugging
    if (typeof window !== "undefined") {
      window.analyzerState = this.sharedState;
    }
  }

  reset() {
    Object.assign(this.sharedState, SHARED_DEFAULTS);
    Object.assign(this.pendingDecodes, PENDING_DEFAULTS);
  }

  setDecodedState(kind, data, proto) {
    const keys = KIND_KEYS[kind];
    if (!keys) return;
    const [dataKey, protoKey] = keys;
    this.sharedState[dataKey] = data ?? null;
    this.sharedState[protoKey] = proto ?? null;
  }

  setPendingDecode(kind, bytes) {
    this.pendingDecodes[kind] = bytes;

    const bytesKey = KIND_KEYS[kind]?.[2];
    if (bytesKey) this.sharedState[bytesKey] = bytes;
  }

  setRawData(data) {
    this.sharedState.lastRaw = data;
  }

  getOutline() {
    return this.sharedState.lastOutline;
  }

  getPendingDecodes() {
    return { ...this.pendingDecodes };
  }
}

export const state = new State();
