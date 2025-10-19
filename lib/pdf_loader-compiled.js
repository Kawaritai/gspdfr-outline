(function () {
  /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
  var m = this || self,
    p = function (a) {
      var b = typeof a;
      return b != "object" ? b : a ? (Array.isArray(a) ? "array" : b) : "null";
    },
    aa = function (a) {
      var b = typeof a;
      return (b == "object" && a != null) || b == "function";
    };
  var ba, ca;
  a: {
    for (var da = ["CLOSURE_FLAGS"], ea = m, fa = 0; fa < da.length; fa++)
      if (((ea = ea[da[fa]]), ea == null)) {
        ca = null;
        break a;
      }
    ca = ea;
  }
  var ha = ca && ca[748402147];
  ba = ha != null ? ha : !0;
  function ia(a, b = new Set()) {
    if (b.has(a)) return "(Recursive reference)";
    switch (typeof a) {
      case "object":
        if (a) {
          var c = Object.getPrototypeOf(a);
          switch (c) {
            case Map.prototype:
            case Set.prototype:
            case Array.prototype:
              b.add(a);
              var d = `[${Array.from(a, (e) => ia(e, b)).join(", ")}]`;
              b.delete(a);
              c !== Array.prototype && (d = `${ja(c.constructor)}(${d})`);
              return d;
            case Object.prototype:
              return (
                b.add(a),
                (c = `{${Object.entries(a)
                  .map(([e, f]) => `${e}: ${ia(f, b)}`)
                  .join(", ")}}`),
                b.delete(a),
                c
              );
            default:
              return (
                (d = "Object"),
                c && c.constructor && (d = ja(c.constructor)),
                typeof a.toString === "function" &&
                a.toString !== Object.prototype.toString
                  ? `${d}(${String(a)})`
                  : `(object ${d})`
              );
          }
        }
        break;
      case "function":
        return `function ${ja(a)}`;
      case "number":
        if (!Number.isFinite(a)) return String(a);
        break;
      case "bigint":
        return `${a.toString(10)}n`;
      case "symbol":
        return a.toString();
    }
    return JSON.stringify(a);
  }
  function ja(a) {
    var b = a.displayName;
    return (b && typeof b === "string") ||
      ((b = a.name) && typeof b === "string")
      ? b
      : (a = /function\s+([^\(]+)/m.exec(String(a)))
      ? a[1]
      : "(Anonymous)";
  }
  function ka(a, b) {
    const c = la,
      d = [];
    ma(b, a, d) ||
      na(void 0, c, `Guard ${b.F().trim()} failed:`, ...d.reverse());
  }
  function oa(a, b) {
    a.O = !0;
    a.F = typeof b === "function" ? b : () => b;
    return a;
  }
  function ma(a, b, c) {
    const d = a(b, c);
    d ||
      pa(c, () => {
        let e = "";
        e.length > 0 && (e += ": ");
        return `${e}Expected ${a.F().trim()}, got ${ia(b)}`;
      });
    return d;
  }
  function pa(a, b) {
    a == null || a.push((typeof b === "function" ? b() : b).trim());
  }
  let la = void 0;
  function qa(a) {
    return typeof a === "function" ? a() : a;
  }
  function na(...a) {
    throw Error(a.map(qa).filter(Boolean).join("\n").trim().replace(/:$/, ""));
  }
  var ra = oa((a) => typeof a === "string", "string"),
    sa = oa((a) => typeof a === "bigint", "bigint");
  var ta = typeof m.BigInt === "function" && typeof m.BigInt(0) === "bigint";
  var za = oa((a) => {
    if (ta) return ka(ua, sa), ka(va, sa), (a = BigInt(a)), a >= ua && a <= va;
    ka(a, ra);
    return a[0] === "-" ? wa(a, xa) : wa(a, ya);
  }, "isSafeInt52");
  const xa = Number.MIN_SAFE_INTEGER.toString(),
    ua = ta ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
    ya = Number.MAX_SAFE_INTEGER.toString(),
    va = ta ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
  function wa(a, b) {
    if (a.length > b.length) return !1;
    if (a.length < b.length || a === b) return !0;
    for (var c = 0; c < a.length; c++) {
      const d = a[c],
        e = b[c];
      if (d > e) return !1;
      if (d < e) return !0;
    }
    c = la;
    na(
      "Assertion fail:",
      `isInRange weird case. Value was: ${a}. Boundary was: ${b}.` || c
    );
  }
  var Aa = function (a) {
    Aa[" "](a);
    return a;
  };
  Aa[" "] = function () {};
  var Ba = typeof Symbol === "function" && typeof Symbol() === "symbol";
  function Ca(a, b, c = !1) {
    return typeof Symbol === "function" && typeof Symbol() === "symbol"
      ? c && Symbol.for && a
        ? Symbol.for(a)
        : a != null
        ? Symbol(a)
        : Symbol()
      : b;
  }
  var Da = Ca("jas", void 0, !0),
    Ea = Ca("defaultInstance", "0di"),
    Fa = Ca("m_m", "P", !0),
    Ga = Ca("validPivotSelector", "vps");
  const Ha = {
      J: { value: 0, configurable: !0, writable: !0, enumerable: !1 },
    },
    Ia = Object.defineProperties,
    q = Ba ? Da : "J";
  var r;
  const Ja = [];
  t(Ja, 7);
  r = Object.freeze(Ja);
  function v(a, b) {
    Ba || q in a || Ia(a, Ha);
    a[q] |= b;
  }
  function t(a, b) {
    Ba || q in a || Ia(a, Ha);
    a[q] = b;
  }
  function w(a) {
    v(a, 34);
    return a;
  }
  function Ka(a) {
    v(a, 8192);
    return a;
  }
  function Ma(a) {
    v(a, 32);
    return a;
  }
  const Na = Object.getOwnPropertyDescriptor(Array.prototype, "K");
  Object.defineProperties(Array.prototype, {
    K: {
      get() {
        const a = Oa(this);
        return Na ? Na.get.call(this) + "|" + a : a;
      },
      configurable: !0,
      enumerable: !1,
    },
  });
  function Oa(a) {
    function b(e, f) {
      e & c && d.push(f);
    }
    const c = a[q] | 0,
      d = [];
    b(1, "IS_REPEATED_FIELD");
    b(2, "IS_IMMUTABLE_ARRAY");
    b(4, "IS_API_FORMATTED");
    b(512, "STRING_FORMATTED");
    b(1024, "GBIGINT_FORMATTED");
    b(1024, "BINARY");
    b(8, "ONLY_MUTABLE_VALUES");
    b(16, "UNFROZEN_SHARED");
    b(32, "MUTABLE_REFERENCES_ARE_OWNED");
    b(64, "CONSTRUCTED");
    b(128, "HAS_MESSAGE_ID");
    b(256, "FROZEN_ARRAY");
    b(2048, "HAS_WRAPPER");
    b(4096, "MUTABLE_SUBSTRUCTURES");
    b(8192, "KNOWN_MAP_ARRAY");
    c & 64 &&
      ((a = (c >> 14) & 1023 || 536870912),
      a !== 536870912 && d.push(`pivot: ${a}`));
    return d.join(",");
  }
  const x = Ba && Math.random() < 0.5,
    z = x ? Symbol() : void 0,
    Pa = typeof Fa === "symbol";
  var Qa = {};
  function Ra(a) {
    a = a[Fa];
    const b = a === Qa;
    if (Pa && a && !b) throw Error("multiple jspb runtimes detected");
    return b;
  }
  function A(a, b) {
    return b === void 0
      ? a.g !== B && !!(2 & ((x ? a[z] : a.j)[q] | 0))
      : !!(2 & b) && a.g !== B;
  }
  const B = {};
  var Sa = Symbol("exempted jspb subclass");
  function Ta() {}
  class Ua {
    constructor(a, b, c) {
      this.g = a;
      this.h = b;
      this.i = c;
    }
    next() {
      const a = this.g.next();
      a.done || (a.value = this.h.call(this.i, a.value));
      return a;
    }
    [Symbol.iterator]() {
      return this;
    }
  }
  function Va(a) {
    return a;
  }
  Va[Ga] = {};
  function Wa(a) {
    a = Error(a);
    a.__closure__error__context__984382 ||
      (a.__closure__error__context__984382 = {});
    a.__closure__error__context__984382.severity = "warning";
    return a;
  }
  function C(a) {
    return Array.prototype.slice.call(a);
  }
  const Xa = Number.isFinite;
  function Ya(a) {
    if (typeof a !== "number")
      throw Error(
        `Value of float/double field must be a number, found ${typeof a}: ${a}`
      );
    return a;
  }
  function Za(a) {
    if (a == null || typeof a === "number") return a;
    if (a === "NaN" || a === "Infinity" || a === "-Infinity") return Number(a);
  }
  function $a(a) {
    return `Expected int32 as finite number but got ${p(a)}: ${a}`;
  }
  function ab(a) {
    if (a == null) return a;
    if (typeof a === "string" && a) a = +a;
    else if (typeof a !== "number") return;
    return Xa(a) ? a | 0 : void 0;
  }
  function bb(a, b, c, d) {
    if (a != null && Ra(a)) return a;
    if (!Array.isArray(a))
      return (
        c
          ? d & 2
            ? ((a = b[Ea]) ||
                ((a = new b()), w(x ? a[z] : a.j), (a = b[Ea] = a)),
              (b = a))
            : (b = new b())
          : (b = void 0),
        b
      );
    c = a[q] | 0;
    d = c | (d & 32) | (d & 2);
    d !== c && t(a, d);
    return new b(a);
  }
  function cb(a, b, c) {
    if (b) {
      if (typeof a !== "string")
        throw Error(`Expected a string but got ${a} a ${p(a)}`);
      return a;
    }
    let d;
    return (d = a == null || typeof a === "string" ? a : void 0) != null
      ? d
      : c
      ? ""
      : void 0;
  }
  const db = {};
  let eb = (function () {
    try {
      return (
        Aa(
          new (class extends Map {
            constructor() {
              super();
            }
          })()
        ),
        !1
      );
    } catch (a) {
      return !0;
    }
  })();
  class fb {
    constructor() {
      this.g = new Map();
    }
    get(a) {
      return this.g.get(a);
    }
    set(a, b) {
      this.g.set(a, b);
      this.size = this.g.size;
      return this;
    }
    delete(a) {
      a = this.g.delete(a);
      this.size = this.g.size;
      return a;
    }
    clear() {
      this.g.clear();
      this.size = this.g.size;
    }
    has(a) {
      return this.g.has(a);
    }
    entries() {
      return this.g.entries();
    }
    keys() {
      return this.g.keys();
    }
    values() {
      return this.g.values();
    }
    forEach(a, b) {
      return this.g.forEach(a, b);
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  }
  const gb = (() =>
    eb
      ? (Object.setPrototypeOf(fb.prototype, Map.prototype),
        Object.defineProperties(fb.prototype, {
          size: { value: 0, configurable: !0, enumerable: !0, writable: !0 },
        }),
        fb)
      : class extends Map {
          constructor() {
            super();
          }
        })();
  function hb(a) {
    return a;
  }
  var ib = function (a) {
      if (a.v & 2) throw Error("Cannot mutate an immutable Map");
    },
    E = class extends gb {
      constructor(a, b, c = hb, d = hb) {
        super();
        this.v = a[q] | 0;
        this.u = b;
        this.A = c;
        this.G = this.u ? jb : d;
        for (let e = 0; e < a.length; e++) {
          const f = a[e],
            g = c(f[0], !1, !0);
          let h = f[1];
          b
            ? h === void 0 && (h = null)
            : (h = d(f[1], !1, !0, void 0, void 0, this.v));
          super.set(g, h);
        }
      }
      D(a) {
        return Ka(Array.from(super.entries(), a));
      }
      clear() {
        ib(this);
        super.clear();
      }
      delete(a) {
        ib(this);
        return super.delete(this.A(a, !0, !1));
      }
      entries() {
        if (this.u) {
          var a = super.keys();
          a = new Ua(a, kb, this);
        } else a = super.entries();
        return a;
      }
      values() {
        if (this.u) {
          var a = super.keys();
          a = new Ua(a, E.prototype.get, this);
        } else a = super.values();
        return a;
      }
      forEach(a, b) {
        this.u
          ? super.forEach((c, d, e) => {
              a.call(b, e.get(d), d, e);
            })
          : super.forEach(a, b);
      }
      set(a, b) {
        ib(this);
        a = this.A(a, !0, !1);
        return a == null
          ? this
          : b == null
          ? (super.delete(a), this)
          : super.set(a, this.G(b, !0, !0, this.u, !1, this.v));
      }
      has(a) {
        return super.has(this.A(a, !1, !1));
      }
      get(a) {
        a = this.A(a, !1, !1);
        const b = super.get(a);
        if (b !== void 0) {
          var c = this.u;
          return c
            ? ((c = this.G(b, !1, !0, c, this.H, this.v)),
              c !== b && super.set(a, c),
              c)
            : b;
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
    };
  E.prototype.toJSON = void 0;
  function jb(a, b, c, d, e, f) {
    a = bb(a, d, c, f);
    e && (a = lb(a));
    return a;
  }
  function kb(a) {
    return [a, this.get(a)];
  }
  let mb;
  function nb() {
    return mb || (mb = new E(w([]), void 0, void 0, void 0, db));
  }
  function ob(a, b, c, d, e) {
    var f = d !== void 0;
    d = !!d;
    const g = [];
    var h = a.length;
    let k,
      l = 4294967295,
      n = !1;
    const u = !!(b & 64),
      y = u ? (b & 128 ? 0 : -1) : void 0;
    if (
      !(
        b & 1 ||
        ((k = h && a[h - 1]),
        k != null && typeof k === "object" && k.constructor === Object
          ? (h--, (l = h))
          : (k = void 0),
        !u || b & 128 || f)
      )
    ) {
      n = !0;
      var F;
      l = ((F = pb) != null ? F : Va)(l - y, y, a, k, e) + y;
    }
    b = void 0;
    for (e = 0; e < h; e++)
      if (((f = a[e]), f != null && (f = c(f, d)) != null))
        if (u && e >= l) {
          F = e - y;
          let D;
          ((D = b) != null ? D : (b = {}))[F] = f;
        } else g[e] = f;
    if (k)
      for (let D in k) {
        a = k[D];
        if (a == null || (a = c(a, d)) == null) continue;
        h = +D;
        let J;
        if (u && !Number.isNaN(h) && (J = h + y) < l) g[J] = a;
        else {
          let R;
          ((R = b) != null ? R : (b = {}))[D] = a;
        }
      }
    b && (n ? g.push(b) : (g[l] = b));
    return g;
  }
  function qb(a) {
    a[0] = rb(a[0]);
    a[1] = rb(a[1]);
    return a;
  }
  function rb(a) {
    switch (typeof a) {
      case "number":
        return Number.isFinite(a) ? a : "" + a;
      case "bigint":
        return za(a) ? Number(a) : "" + a;
      case "boolean":
        return a ? 1 : 0;
      case "object":
        if (Array.isArray(a)) {
          const b = a[q] | 0;
          return a.length === 0 && b & 1 ? void 0 : ob(a, b, rb);
        }
        if (a != null && Ra(a)) return G(a);
        if (a instanceof E) return (a = a.size !== 0 ? a.D(qb) : void 0), a;
        return;
    }
    return a;
  }
  let pb;
  function G(a) {
    const b = x ? a[z] : a.j;
    return ob(b, b[q] | 0, rb, void 0, a.constructor);
  }
  typeof Proxy !== "undefined" &&
    new Proxy(
      {},
      {
        getPrototypeOf: H,
        setPrototypeOf: H,
        isExtensible: H,
        preventExtensions: H,
        getOwnPropertyDescriptor: H,
        defineProperty: H,
        has: H,
        get: H,
        set: H,
        deleteProperty: H,
        apply: H,
        construct: H,
      }
    );
  function H() {
    throw Error(
      "this array or object is owned by JSPB and should not be reused, did you mean to copy it with copyJspbArray? See go/jspb-api-gotchas#construct_from_array"
    );
  }
  function sb(a) {
    if (a != null) for (var b = 0; b < a.length; b++);
    if (a == null) {
      var c = 32;
      a = [];
    } else {
      if (!Array.isArray(a))
        throw Error(
          `data passed to JSPB constructors must be an Array, got '${JSON.stringify(
            a
          )}' a ${p(a)}`
        );
      c = a[q] | 0;
      if (ba && 1 & c)
        throw Error(
          "Array passed to JSPB constructor is a repeated field array that belongs to another proto instance."
        );
      2048 & c && !(2 & c) && tb();
      if (Object.isFrozen(a) || !Object.isExtensible(a) || Object.isSealed(a))
        throw Error("data passed to JSPB constructors must be mutable");
      if (c & 256) throw Error("farr");
      if (c & 64) return c & 2048 || t(a, c | 2048), a;
      b = a;
      c |= 64;
      var d = b.length;
      if (d) {
        var e = d - 1;
        d = b[e];
        if (d != null && typeof d === "object" && d.constructor === Object) {
          const f = c & 128 ? 0 : -1;
          e -= f;
          if (e >= 1024)
            throw Error(
              `Found a message with a sparse object at fieldNumber ${e} is >= the limit ${1024}`
            );
          for (const g in d) {
            const h = +g;
            h < e && ((b[h + f] = d[g]), delete d[g]);
          }
          c = (c & -16760833) | ((e & 1023) << 14);
        }
      }
    }
    t(a, c | 2112);
    return a;
  }
  function tb() {
    if (ba)
      throw Error(
        "Array passed to JSPB constructor already belongs to another JSPB proto instance"
      );
  }
  function ub(a, b) {
    if (typeof a !== "object") return a;
    if (Array.isArray(a)) {
      var c = a[q] | 0;
      return a.length === 0 && c & 1 ? void 0 : vb(a, c, b);
    }
    if (a != null && Ra(a)) return wb(a);
    if (a instanceof E) {
      c = a.v;
      if (c & 2) return a;
      if (a.size) {
        b = w(a.D());
        if (a.u)
          for (a = 0; a < b.length; a++) {
            const d = b[a];
            let e = d[1];
            e == null || typeof e !== "object"
              ? (e = void 0)
              : e != null && Ra(e)
              ? (e = wb(e))
              : Array.isArray(e)
              ? (e = vb(e, e[q] | 0, !!(c & 32)))
              : (e = void 0);
            d[1] = e;
          }
        return b;
      }
    }
  }
  function vb(a, b, c) {
    if (b & 2) return a;
    !c || 4096 & b || 16 & b
      ? (a = I(a, b, !1, c && !(b & 16)))
      : (v(a, 34), b & 4 && Object.freeze(a));
    return a;
  }
  function yb(a, b, c) {
    a = new a.constructor(b);
    c && (a.g = B);
    a.h = B;
    return a;
  }
  function wb(a) {
    const b = x ? a[z] : a.j,
      c = b[q] | 0;
    return A(a, c) ? a : zb(a, b, c) ? yb(a, b) : I(b, c);
  }
  function I(a, b, c, d) {
    d != null || (d = !!(34 & b));
    a = ob(a, b, ub, d);
    d = 32;
    c && (d |= 2);
    b = (b & 16769217) | d;
    t(a, b);
    return a;
  }
  function lb(a) {
    const b = x ? a[z] : a.j,
      c = b[q] | 0;
    return A(a, c)
      ? zb(a, b, c)
        ? yb(a, b, !0)
        : new a.constructor(I(b, c, !1))
      : a;
  }
  function Ab(a) {
    if (a.g !== B) return !1;
    var b = x ? a[z] : a.j;
    b = I(b, b[q] | 0);
    v(b, 2048);
    x ? (a[z] = b) : (a.j = b);
    a.g = void 0;
    a.h = void 0;
    return !0;
  }
  function Bb(a) {
    if (!Ab(a) && A(a, (x ? a[z] : a.j)[q] | 0))
      throw Error("Cannot mutate an immutable Message");
  }
  function K(a, b) {
    b === void 0 && (b = a[q] | 0);
    b & 32 && !(b & 4096) && t(a, b | 4096);
  }
  function zb(a, b, c) {
    return Sa && a[Sa]
      ? !1
      : c & 2
      ? !0
      : c & 32 && !(c & 4096)
      ? (t(b, c | 2), (a.g = B), !0)
      : !1;
  }
  var Db = function (a, b, c, d) {
      a = Cb(x ? a[z] : a.j, b, c, d);
      if (a !== null) return a;
    },
    Cb = function (a, b, c, d) {
      if (b === -1) return null;
      const e = b + (c ? 0 : -1),
        f = a.length - 1;
      let g, h;
      if (!(f < 1 + (c ? 0 : -1))) {
        if (e >= f)
          if (
            ((g = a[f]),
            g != null && typeof g === "object" && g.constructor === Object)
          )
            (c = g[b]), (h = !0);
          else if (e === f) c = g;
          else return;
        else c = a[e];
        if (d && c != null) {
          d = d(c);
          if (d == null) return d;
          if (!Object.is(d, c)) return h ? (g[b] = d) : (a[e] = d), d;
        }
        return c;
      }
    },
    M = function (a, b, c) {
      Bb(a);
      const d = x ? a[z] : a.j;
      L(d, d[q] | 0, b, c);
      return a;
    };
  function L(a, b, c, d) {
    const e = c + -1;
    var f = a.length - 1;
    if (f >= 0 && e >= f) {
      const g = a[f];
      if (g != null && typeof g === "object" && g.constructor === Object)
        return (g[c] = d), b;
    }
    if (e <= f) return (a[e] = d), b;
    if (d !== void 0) {
      let g;
      f = (((g = b) != null ? g : (b = a[q] | 0)) >> 14) & 1023 || 536870912;
      c >= f ? d != null && (a[f + -1] = { [c]: d }) : (a[e] = d);
    }
    return b;
  }
  function N(a) {
    return (!!(2 & a) && !!(4 & a)) || !!(256 & a);
  }
  function Eb(a, b, c, d, e, f) {
    !d && Ab(a) && ((b = x ? a[z] : a.j), (c = b[q] | 0));
    var g = Cb(b, e);
    a = !1;
    if (g == null) {
      if (d) return nb();
      g = [];
    } else if (g.constructor === E)
      if (g.v & 2 && !d) g = g.D();
      else return g;
    else Array.isArray(g) ? (a = !!((g[q] | 0) & 2)) : (g = []);
    if (d) {
      if (!g.length) return nb();
      a || ((a = !0), w(g));
    } else if (a) {
      a = !1;
      Ka(g);
      d = C(g);
      for (g = 0; g < d.length; g++) {
        const h = (d[g] = C(d[g]));
        Array.isArray(h[1]) && (h[1] = w(h[1]));
      }
      g = Ka(d);
    }
    !a && c & 32 && Ma(g);
    f = new E(g, f, cb, void 0);
    c = L(b, c, e, f);
    a || K(b, c);
    return f;
  }
  function Fb(a, b, c) {
    const d = x ? a[z] : a.j,
      e = d[q] | 0;
    return Eb(a, d, e, A(a, e), b, c);
  }
  function Gb(a) {
    var b = Hb;
    let c;
    const d = x ? a[z] : a.j,
      e = d[q] | 0;
    c = A(a, e);
    a = Eb(a, d, e, c, 2, b);
    !c && b && (a.H = !0);
    return a;
  }
  function Ib(a, b, c, d) {
    let e = !1;
    d = Cb(a, d, void 0, (f) => {
      const g = bb(f, c, !1, b);
      e = g !== f && g != null;
      return g;
    });
    if (d != null) return e && !A(d) && K(a, b), d;
  }
  var Jb = function (a, b, c) {
      let d = x ? a[z] : a.j,
        e = d[q] | 0;
      b = Ib(d, e, b, c);
      if (b == null) return b;
      e = d[q] | 0;
      if (!A(a, e)) {
        const f = lb(b);
        f !== b &&
          (Ab(a) && ((d = x ? a[z] : a.j), (e = d[q] | 0)),
          (b = f),
          (e = L(d, e, c, b)),
          K(d, e));
      }
      return b;
    },
    Kb = function (a, b, c) {
      c == null && (c = void 0);
      M(a, b, c);
      c && !A(c) && K(x ? a[z] : a.j);
    };
  function Lb(a, b) {
    return (a = (2 & b ? a | 2 : a & -3) & -273);
  }
  function Mb(a, b, c, d) {
    Bb(a);
    const e = x ? a[z] : a.j;
    var f = e,
      g = e[q] | 0,
      h = A(a, g) ? 1 : 2;
    h === 2 && Ab(a) && ((f = x ? a[z] : a.j), (g = f[q] | 0));
    a = Cb(f, b);
    var k = Array.isArray(a) ? a : r,
      l = k === r ? 7 : k[q] | 0;
    a = l;
    2 & g && (a |= 2);
    var n = a | 1;
    if ((a = !(4 & n))) {
      var u = g;
      const y = !!(2 & n);
      y && (u |= 2);
      let F = !y,
        D = !0,
        J = 0,
        R = 0;
      for (; J < k.length; J++) {
        const La = bb(k[J], c, !1, u);
        if (La instanceof c) {
          if (!y) {
            const xb = A(La);
            F && (F = !xb);
            D && (D = xb);
          }
          k[R++] = La;
        }
      }
      R < J && (k.length = R);
      n |= 4;
      n = D ? n & -4097 : n | 4096;
      n = F ? n | 8 : n & -9;
    }
    n !== l && (t(k, n), 2 & n && Object.freeze(k));
    n = l = n;
    h === 1 || (h !== 4 ? 0 : 2 & l || (!(16 & l) && 32 & g))
      ? N(l) ||
        ((l |=
          !k.length || (a && !(4096 & l)) || (32 & g && !(4096 & l || 16 & l))
            ? 2
            : 256),
        l !== n && t(k, l),
        Object.freeze(k))
      : (h === 2 &&
          N(l) &&
          ((k = C(k)), (n = 0), (l = Lb(l, g)), (g = L(f, g, b, k))),
        N(l) || (l !== n && t(k, l)));
    2 & l || !(4096 & l || 16 & l) || K(f, g);
    b = k;
    d = d != null ? d : new c();
    b.push(d);
    h = c = b === r ? 7 : b[q] | 0;
    (d = A(d)) ? ((c &= -9), b.length === 1 && (c &= -4097)) : (c |= 4096);
    c !== h && t(b, c);
    d || K(e);
  }
  var Nb = function (a, b) {
      a = Db(a, b);
      a =
        a == null || typeof a === "boolean"
          ? a
          : typeof a === "number"
          ? !!a
          : void 0;
      return a != null ? a : !1;
    },
    O = function (a, b) {
      a = ab(Db(a, b));
      return a != null ? a : 0;
    },
    Ob = function (a) {
      a = Db(a, 1, void 0, Za);
      return a != null ? a : 0;
    },
    Pb = function (a, b) {
      a = Db(a, b);
      a = a == null ? a : Xa(a) ? a | 0 : void 0;
      return a != null ? a : 0;
    },
    P = function (a, b, c) {
      if (c != null && typeof c !== "boolean")
        throw Error(`Expected boolean but got ${p(c)}: ${c}`);
      return M(a, b, c);
    },
    Q = function (a, b, c) {
      if (c != null) {
        if (typeof c !== "number") throw Wa($a(c));
        if (!Xa(c)) throw Wa($a(c));
        c |= 0;
      }
      return M(a, b, c);
    },
    S = function (a, b, c) {
      return M(a, b, c == null ? c : Ya(c));
    },
    T = function (a, b, c) {
      if (c != null && typeof c !== "string")
        throw Error(
          `Expected a string or null or undefined but got ${c} a ${p(c)}`
        );
      return M(a, b, c);
    },
    Qb = function (a, b, c) {
      {
        Bb(a);
        const h = x ? a[z] : a.j;
        let k = h[q] | 0;
        if (c == null) L(h, k, b);
        else {
          var d = c === r ? 7 : c[q] | 0,
            e = d,
            f = N(d),
            g = f || Object.isFrozen(c);
          f || (d = 0);
          g || ((c = C(c)), (e = 0), (d = Lb(d, k)), (g = !1));
          d |= 5;
          for (f = 0; f < c.length; f++) {
            const l = c[f],
              n = Ya(l);
            Object.is(l, n) ||
              (g && ((c = C(c)), (e = 0), (d = Lb(d, k)), (g = !1)),
              (c[f] = n));
          }
          d !== e && (g && ((c = C(c)), (d = Lb(d, k))), t(c, d));
          L(h, k, b, c);
        }
      }
      return a;
    };
  var U = class {
    constructor(a) {
      this.preventPassingToStructuredClone = Ta;
      a = sb(a);
      x ? (this[z] = a) : (this.j = a);
    }
    toJSON() {
      return G(this);
    }
    clone() {
      const a = x ? this[z] : this.j,
        b = a[q] | 0;
      return zb(this, a, b)
        ? yb(this, a, !0)
        : new this.constructor(I(a, b, !1));
    }
  };
  U.prototype[Fa] = Qa;
  U.prototype.toString = function () {
    return (x ? this[z] : this.j).toString();
  };
  function Rb(a) {
    if (a instanceof U) return a.constructor.g;
  }
  (function () {
    const a = m.jspbGetTypeName;
    m.jspbGetTypeName = a ? (b) => a(b) || Rb(b) : Rb;
  })();
  /[?&]tc=([01])/.exec(location.search || "") ||
    (navigator.userAgent || "").indexOf("Android") >= 0 ||
    (window.matchMedia &&
      window.matchMedia("(pointer)").matches &&
      window.matchMedia("(pointer:coarse)"));
  var Sb = new (class {
    constructor(a) {
      this.g = a;
    }
  })("A");
  var Tb = class extends U {};
  Tb.g = "scholar.reader.PdfDestination";
  var Ub = class extends U {
    getDestination() {
      return Jb(this, Tb, 8);
    }
  };
  Ub.g = "scholar.reader.Annotation";
  var Vb = class extends U {};
  Vb.g = "scholar.reader.FontInfo";
  var Wb = class extends U {};
  Wb.g = "scholar.reader.FontMap";
  var Xb = class extends U {};
  Xb.g = "scholar.reader.NamedDestinationMap";
  var Yb = class extends U {};
  Yb.g = "scholar.reader.TextContentItem";
  var Hb = class extends U {};
  Hb.g = "scholar.reader.TextStyle";
  var Zb = class extends U {};
  Zb.g = "scholar.reader.TextContent";
  var $b = class extends U {};
  $b.g = "scholar.reader.Viewport";
  var ac = class extends U {
    getViewport() {
      return Jb(this, $b, 1);
    }
  };
  ac.g = "scholar.reader.LoadResult";
  var cc = function (a) {
      var b = new bc();
      return Q(b, 1, a);
    },
    dc = function (a, b) {
      return Q(a, 2, b);
    },
    bc = class extends U {};
  bc.g = "scholar.reader.PageSize";
  var fc = function (a) {
      var b = new ec();
      return T(b, 1, a);
    },
    hc = function (a, b) {
      return T(a, 2, b);
    },
    ic = function (a, b) {
      return T(a, 3, b);
    },
    jc = function (a, b) {
      return T(a, 4, b);
    },
    kc = function (a, b) {
      return T(a, 5, b);
    },
    lc = function (a, b) {
      return T(a, 6, b);
    },
    mc = function (a, b) {
      return T(a, 7, b);
    },
    nc = function (a, b) {
      return T(a, 8, b);
    },
    oc = function (a, b) {
      return T(a, 9, b);
    },
    pc = function (a, b) {
      return T(a, 10, b);
    },
    qc = function (a, b) {
      return T(a, 11, b);
    },
    rc = function (a, b) {
      return Q(a, 12, b);
    },
    sc = function (a, b) {
      Mb(a, 13, bc, b);
    },
    tc = function (a, b) {
      return P(a, 14, b);
    },
    uc = function (a, b) {
      return P(a, 15, b);
    },
    vc = function (a) {
      return Nb(a, 16);
    },
    wc = function (a, b) {
      return P(a, 16, b);
    },
    ec = class extends U {};
  ec.g = "scholar.reader.PdfMetadata";
  var xc = class extends U {};
  xc.g = "scholar.reader.RenderParams";
  var yc = 96 / 72;
  function zc() {
    let a, b;
    return {
      promise: new Promise((c, d) => {
        a = c;
        b = d;
      }),
      resolve: a,
      reject: b,
    };
  }
  function Ac(a) {
    return a ? (a.toLowerCase().endsWith(".pdf") ? a : a + ".pdf") : "";
  }
  function Bc(a) {
    a = a.split(/[#?]/)[0].split("/");
    let b = (a = a[a.length - 1]);
    try {
      b = decodeURIComponent(a);
    } catch (c) {}
    return (a = b) ? Ac(a) : "document.pdf";
  }
  var Cc = class {
      constructor() {
        this.i =
          this.annotations =
          this.text =
          this.h =
          this.l =
          this.m =
          this.viewport =
          this.g =
            null;
      }
      transfer() {
        const a = [];
        var b = new ac();
        if (this.viewport) {
          var c = this.viewport;
          var d = new $b();
          d = Qb(d, 1, c.viewBox);
          d = S(d, 2, c.rotation);
          d = S(d, 3, c.offsetX);
          d = S(d, 4, c.offsetY);
          d = S(d, 5, c.width);
          d = S(d, 6, c.height);
          d = S(d, 7, c.scale);
          c = Qb(d, 8, c.transform);
          Kb(b, 1, c);
        }
        this.m && Q(b, 6, this.m);
        this.l && Kb(b, 2, this.l);
        this.text && Kb(b, 3, this.text);
        if (this.annotations) {
          {
            c = this.annotations;
            Bb(b);
            const n = x ? b[z] : b.j;
            let u = n[q] | 0;
            if (c == null) L(n, u, 4);
            else {
              var e = (d = c === r ? 7 : c[q] | 0),
                f = N(d),
                g = f || Object.isFrozen(c),
                h = !0,
                k = !0;
              for (let y = 0; y < c.length; y++) {
                var l = c[y];
                f || ((l = A(l)), h && (h = !l), k && (k = l));
              }
              f || ((d = h ? 13 : 5), (d = k ? d & -4097 : d | 4096));
              (g && d === e) || ((c = C(c)), (e = 0), (d = Lb(d, u)));
              d !== e && t(c, d);
              u = L(n, u, 4, c);
              2 & d || !(4096 & d || 16 & d) || K(n, u);
            }
          }
        }
        this.i && Kb(b, 5, this.i);
        b = { p: JSON.stringify(G(b)) };
        if ((c = this.h && this.h.transferToImageBitmap()))
          (b.c = c), a.push(c);
        return { L: b, M: a };
      }
    },
    Dc = class {
      constructor(a) {
        this.promise = a;
        this.g = !1;
      }
      cancel() {
        this.g = !0;
      }
    };
  var Ec = class extends U {},
    Fc = (function (a) {
      return (b) => {
        if (b == null || b == "") b = new a();
        else {
          b = JSON.parse(b);
          if (!Array.isArray(b))
            throw Error(
              "Expected to deserialize an Array but got " + p(b) + ": " + b
            );
          b = new a(Ma(b));
        }
        return b;
      };
    })(Ec);
  Ec.g = "scholar.reader.LoadRequest";
  function Gc() {
    this.g = [];
    this.h = [];
  }
  var Hc = function (a) {
      a.g.length === 0 && ((a.g = a.h), a.g.reverse(), (a.h = []));
      return a.g.pop();
    },
    Ic = function (a) {
      return a.g.length === 0 && a.h.length === 0;
    };
  Gc.prototype.clear = function () {
    this.g = [];
    this.h = [];
  };
  function V(a) {
    return typeof a === "string" ? a : "";
  }
  function Jc(a) {
    return (a = pdfjsLib.PDFDateString.toDateObject(a))
      ? `${a.toLocaleDateString()}, ${a.toLocaleTimeString()}`
      : "";
  }
  function Kc(a, b, c) {
    const d = a.getViewport({ scale: b }).rotation;
    return a.getViewport({ scale: b, rotation: (c + d) % 360 });
  }
  function Lc(a) {
    var b = new Tb(),
      c = a[0];
    if (!c) return null;
    if (typeof c === "object") {
      c = c.num;
      if (typeof c !== "number") return null;
      Q(b, 1, c);
    } else if (typeof c === "number" && Number.isInteger(c) && c >= 0)
      Q(b, 2, c);
    else return null;
    if (!a[1] || typeof a[1] !== "object") return null;
    c = a[1].name;
    if (typeof c !== "string") return null;
    T(b, 3, c);
    let d, e;
    switch (c) {
      case "XYZ":
        [, , d, a, c] = a;
        if (
          (d !== null && typeof d !== "number") ||
          (a !== null && typeof a !== "number") ||
          (c !== null && typeof c !== "number")
        )
          return null;
        d !== null && S(b, 4, d);
        a !== null && S(b, 5, a);
        c !== null && S(b, 8, c);
        return b;
      case "FitV":
      case "FitBV":
        return (
          (d = a[2]), d === null ? b : typeof d === "number" ? S(b, 4, d) : null
        );
      case "FitH":
      case "FitBH":
        return (
          (a = a[2]), a === null ? b : typeof a === "number" ? S(b, 5, a) : null
        );
      case "FitR":
        return (
          ([, , d, e, c, a] = a),
          typeof d !== "number" ||
          typeof e !== "number" ||
          typeof c !== "number" ||
          typeof a !== "number"
            ? (b = null)
            : ((b = S(b, 4, d)),
              (b = S(b, 7, e)),
              (b = S(b, 6, c)),
              (b = S(b, 5, a))),
          b
        );
      default:
        return b;
    }
  }
  class Mc {
    constructor(a, b, c, d, e) {
      this.type = a;
      this.o = b;
      this.h = c;
      this.m = !1;
      this.i = this.l = null;
      this.resolve = d;
      this.reject = e;
      this.g = new Cc();
    }
    cancel() {
      this.m = !0;
      this.l && this.l.cancel();
    }
  }
  class Nc extends Dc {
    constructor(a, b) {
      super(a);
      this.h = b;
    }
    cancel() {
      this.g = !0;
      this.h.cancel();
    }
  }
  var Oc = function (a) {
      return a.C.then((b) => b.promise);
    },
    W = function (a) {
      a.o ||
        (a.o = setTimeout(() => {
          a.o = 0;
          Pc(a);
        }));
    },
    X = function (a) {
      a.g.resolve(a.g.g);
      a.g = null;
      a.h = null;
      W(a);
    },
    Y = function (a, b) {
      a.g.reject(b);
      a.g = null;
      a.h = null;
      W(a);
    },
    Qc = function (a, b) {
      return Oc(a)
        .then((c) => c.getPage(b.o))
        .then((c) => {
          b.g.g = c;
          b.g.viewport = Kc(c, yc * (Ob(b.h) || 1), O(b.h, 3) || 0);
          b.g.m = b.g.g.ref.num;
        });
    },
    Rc = function (a) {
      const b = a.g.g.getTextContent().then((c) => {
        const d = (a.g.text = new Zb());
        for (var e of c.items) {
          var f = new Yb();
          f = T(f, 1, e.str);
          f = Qb(f, 2, e.transform);
          f = S(f, 3, e.width);
          f = S(f, 4, e.height);
          f = T(f, 5, e.dir);
          f = T(f, 6, e.fontName);
          f = P(f, 7, e.hasEOL);
          Mb(d, 1, Yb, f);
        }
        for (const g in c.styles)
          (e = c.styles[g]),
            (f = new Hb()),
            (f = S(f, 1, e.ascent)),
            (f = S(f, 2, e.descent)),
            (f = P(f, 3, e.vertical)),
            (f = T(f, 4, e.fontFamily)),
            (e = g),
            Fb(d, 2, Hb).set(e, f);
      });
      return Nb(a.h, 4)
        ? b
            .then(() => a.g.g.getOperatorList({ intent: "getFonts" }))
            .then(() => {
              a.g.l = new Wb();
              const c = a.g.g.commonObjs;
              for (const f of Gb(a.g.text).keys())
                if (c.has(f)) {
                  var d = c.get(f);
                  var e = new Vb();
                  e = T(e, 1, d.name);
                  e = P(e, 2, d.isBolded);
                  d = f;
                  Fb(a.g.l, 1, Vb).set(d, e);
                }
            })
        : b;
    },
    Sc = function (a) {
      return a.g.g.getAnnotations().then((b) => {
        const c = (a.g.annotations = []);
        if (b)
          for (const d of b) {
            b = new Ub();
            b = T(b, 1, d.subtype);
            b = Qb(b, 2, d.rect);
            b = T(b, 3, d.url);
            b = P(b, 4, d.newWindow);
            b = T(b, 5, d.action);
            b = T(b, 6, d.id);
            if (typeof d.dest === "string") T(b, 7, d.dest);
            else if (d.dest instanceof Array) {
              const e = Lc(d.dest);
              if (!e) continue;
              Kb(b, 8, e);
            }
            c.push(b);
          }
      });
    },
    Tc = function (a, b) {
      return Oc(a)
        .then((c) => c.getDestinations())
        .then((c) => {
          const d = (b.g.i = new Xb());
          for (const f in c) {
            var e = c[f];
            e instanceof Array && (e = Lc(e)) && Fb(d, 1, Tb).set(f, e);
          }
        });
    },
    Uc = function (a, b) {
      const c = b.g.g;
      var d = O(b.h, 2)
        ? O(b.h, 2) /
          Math.max(c.view[2], c.view[3]) /
          window.devicePixelRatio /
          yc
        : Ob(b.h) || 1;
      const e = O(b.h, 3) || 0;
      d = Kc(c, yc * d * window.devicePixelRatio, e);
      d = {
        canvasContext: (b.g.h = new OffscreenCanvas(
          d.width,
          d.height
        )).getContext("2d", { alpha: !1 }),
        viewport: d,
      };
      b.l = c.render(d);
      let f = 0;
      b.l.onContinue = (g) => {
        f++;
        b.i = g;
        W(a);
      };
      return b.l.promise
        .then(() => (b.i = null))
        .catch((g) => {
          if (!(g instanceof pdfjsLib.RenderingCancelledException)) throw g;
        });
    },
    Pc = function (a) {
      if (!a.g || a.h != 1)
        if (!Ic(a.m)) a.g && (a.i = a.g), (a.g = Hc(a.m)), (a.h = 1);
        else if (!a.g)
          if (a.i) (a.g = a.i), (a.h = 2), (a.i = null);
          else {
            if (Ic(a.l)) return;
            a.g = Hc(a.l);
            a.h = 2;
          }
      const b = a.g;
      if (b.m) X(a);
      else {
        switch (b.type) {
          case 6:
            if (!b.g.g) {
              Qc(a, b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
            break;
          case 1:
            if (!b.g.g) {
              Qc(a, b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (!b.g.text) {
              Rc(b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
            break;
          case 2:
            if (!b.g.g) {
              Qc(a, b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (!b.g.annotations) {
              Sc(b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
            break;
          case 3:
            if (!b.g.i) {
              Tc(a, b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
            break;
          case 4:
            if (!b.g.g) {
              Qc(a, b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (!b.g.h) {
              Uc(a, b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (b.i) {
              b.i();
              return;
            }
            break;
          case 5:
            if (!b.g.g) {
              Qc(a, b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (!b.g.h) {
              Uc(a, b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (b.i) {
              b.i();
              return;
            }
            if (!b.g.text) {
              Rc(b)
                .then(() => W(a))
                .catch((c) => Y(a, c));
              return;
            }
            if (!b.g.annotations) {
              Sc(b)
                .then(() => X(a))
                .catch((c) => Y(a, c));
              return;
            }
        }
        console.error("Unknown task type/state:", a.g);
        Y(a, "Unknown task type/state");
        W(a);
      }
    },
    Vc = function (a, b) {
      const c = !(a.g || a.i || !Ic(a.m) || !Ic(a.l)),
        d = Pb(b, 3) === 1 ? a.m : a.l,
        { promise: e, resolve: f, reject: g } = zc();
      b = new Mc(Pb(b, 2), O(b, 4), Jb(b, xc, 5) || new xc(), f, g);
      d.h.push(b);
      c && W(a);
      return new Nc(e, b);
    };
  class Wc {
    constructor(a) {
      this.C = a;
      this.m = new Gc();
      this.l = new Gc();
      this.i = this.h = this.g = null;
      this.o = 0;
    }
  }
  var Xc = async function (a, b) {
      if (!a.i && b && typeof b === "string") {
        a.i = b;
        try {
          const { I: c, B: d } = await a.C(a.i);
          a.o(c);
          c.onPassword = (f, g) => {
            a.m = f;
            Z(5, g);
          };
          c.onProgress = (f) => {
            Z(2, f);
          };
          Z(1, d);
          const e = await c.promise;
          Z(3, e.numPages);
        } catch (c) {
          Z(4);
        }
      }
    },
    Yc = function (a, b) {
      if (b && typeof b === "string") {
        b = Fc(b);
        var c = O(b, 1),
          d = Vc(a.N, b);
        a.l.set(c, d);
        d.promise.then((e) => {
          if (!d.g) {
            a.l.delete(c);
            var { L: f, M: g } = e.transfer();
            Z(6, { id: c, result: f }, g);
          }
        });
      }
    },
    Zc = async function (a, b) {
      typeof b === "number" &&
        ((a = await a.getMetadata()),
        Z(7, { id: b, metadata: JSON.stringify(G(a)) }));
    },
    $c = async function (a, b) {
      typeof b === "number" &&
        ((a = await (await (await a.g).promise).getData()),
        Z(8, { id: b, buffer: a.buffer }, [a.buffer]));
    },
    ad = async function (a, b) {
      if (
        typeof b === "string" &&
        ((a = await (await (await a.g).promise).getData()),
        window.origin === "null")
      ) {
        var c = URL.createObjectURL(
            new Blob([a.buffer], { type: "application/pdf" })
          ),
          d = document.createElement(Sb.g);
        d.href = c;
        d.download = b;
        document.body.appendChild(d);
        d.click();
        setTimeout(() => {
          d.remove();
          URL.revokeObjectURL(c);
        }, 250);
      }
    },
    bd = async function (a, b) {
      if (typeof b === "object") {
        var c = b.id;
        if (typeof c === "number" && ((b = b.destId), typeof b === "string"))
          if (
            ((a = await (await a.g).promise), (b = await a.getDestination(b)))
          ) {
            var d = Lc(b);
            if (d) {
              if (typeof b[0] === "object") {
                let e;
                try {
                  e = await a.getPageIndex(b[0]);
                } catch (f) {
                  Z(9, { id: c });
                  return;
                }
                M(d, 1);
                Q(d, 2, e);
              }
              Z(9, { id: c, destination: JSON.stringify(G(d)) });
            } else Z(9, { id: c });
          } else Z(9, { id: c });
      }
    },
    dd = async function (a, b) {
      typeof b === "number" && Z(10, { id: b, hasVisibleForm: await cd(a) });
    },
    Z = function (a, b, c) {
      window.parent.postMessage({ type: a, val: b }, "*", c);
    },
    ed = function (a) {
      if (window.origin !== "null" && window.origin !== window.parent.origin)
        throw Error(
          "PDF loader cannot run within a cross-origin iframe unless it is in a sandboxed origin"
        );
      window.addEventListener("message", (b) => {
        if (
          b.source === window.parent &&
          b.data &&
          typeof b.data === "object" &&
          "type" in b.data
        ) {
          var c = b.data.val;
          switch (b.data.type) {
            case 4:
              Xc(a, c);
              break;
            case 5:
              a.m && typeof c === "string" && a.m(c);
              break;
            case 0:
              Yc(a, c);
              break;
            case 1:
              typeof c === "number" &&
                (b = a.l.get(c)) &&
                (b.cancel(), a.l.delete(c));
              break;
            case 2:
              Zc(a, c);
              break;
            case 3:
              $c(a, c);
              break;
            case 6:
              ad(a, c);
              break;
            case 7:
              bd(a, c);
              break;
            case 8:
              dd(a, c);
          }
        }
      });
      Z(0);
    },
    cd = async function (a) {
      var b = await (await a.g).promise;
      if (vc(await a.getMetadata())) return !0;
      a = await b.getFieldObjects();
      if (!a) return !1;
      for (const c in a)
        if (
          (b = a[c]) &&
          b.find((d) => {
            const e = d.rect;
            d = d.type;
            if (
              !e ||
              !Array.isArray(e) ||
              e.length !== 4 ||
              !e.every((l) => typeof l === "number" && l > 0) ||
              d === "button"
            )
              return !1;
            const [f, g, h, k] = e;
            return f !== h && g !== k;
          })
        )
          return !0;
      return !1;
    },
    fd = class {
      constructor(a) {
        this.C = a;
        this.i = "";
        this.o = null;
        this.g = new Promise((b) => {
          this.o = b;
        });
        this.m = null;
        this.N = new Wc(this.g);
        this.l = new Map();
        this.h = null;
      }
      async getMetadata() {
        if (this.h) return this.h;
        var a = Bc(this.i),
          b = fc(a),
          c = null;
        try {
          c = await (await this.g).promise;
        } catch (k) {
          return b;
        }
        const d = c.numPages;
        let e;
        var f;
        let g;
        try {
          const k = c.getMetadata(),
            l = [];
          for (let n = 1; n <= Math.min(d, 20); ++n)
            l.push(
              c
                .getPage(n)
                .then((u) => {
                  u = u.getViewport({ scale: 1 });
                  return { width: u.width, height: u.height };
                })
                .catch(() => ({ width: 0, height: 0 }))
            );
          [{ info: e, contentDispositionFilename: f, contentLength: h }, ...g] =
            await Promise.all([k, ...l]);
        } catch (k) {
          return b;
        }
        if (!(aa(e) && g instanceof Array)) return b;
        a = (f = Ac(f)) || a;
        var h = Number.isInteger(h) ? Math.max(h, 0) / 1024 / 1024 : 0;
        b = Jc(e.CreationDate);
        c = Jc(e.ModDate);
        f = !!e.IsLinearized;
        this.h = wc(
          uc(
            tc(
              rc(
                qc(
                  pc(
                    oc(
                      nc(
                        mc(
                          lc(
                            kc(
                              jc(
                                ic(hc(fc(a), `${h.toFixed(2)} MB`), V(e.Title)),
                                V(e.Author)
                              ),
                              V(e.Subject)
                            ),
                            V(e.Keywords)
                          ),
                          V(b)
                        ),
                        V(c)
                      ),
                      V(e.Creator)
                    ),
                    V(e.Producer)
                  ),
                  V(e.PDFFormatVersion)
                ),
                d
              ),
              f
            ),
            !!e.IsAcroFormPresent
          ),
          !!e.IsXFAPresent
        );
        for (const { width: k, height: l } of g) sc(this.h, dc(cc(k), l));
        return this.h;
      }
    };
  async function gd(a) {
    var b = a.getReader(),
      c = 0;
    for (a = []; ; ) {
      const { done: d, value: e } = await b.read();
      if (d || !e) break;
      c += e.length;
      a.push(e);
    }
    b = new Uint8Array(new ArrayBuffer(c));
    c = 0;
    for (const d of a) b.set(d, c), (c += d.length);
    return b;
  }
  function ensureReadableStreamFromBody(a) {
    return typeof ReadableStream !== "undefined" && a instanceof ReadableStream
      ? a
      : null;
  }
  function ensureUint8ArrayFromBody(a) {
    if (!a || typeof Uint8Array === "undefined") return null;
    if (a instanceof Uint8Array) return a;
    if (
      typeof ArrayBuffer !== "undefined" &&
      ArrayBuffer.isView &&
      ArrayBuffer.isView(a)
    )
      return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    if (typeof ArrayBuffer !== "undefined" && a instanceof ArrayBuffer)
      return new Uint8Array(a);
    if (Array.isArray(a)) return Uint8Array.from(a);
    return null;
  }
  function getPdfTransportPayload(a) {
    const b = ensureReadableStreamFromBody(a);
    if (b) return { stream: b, bytes: null };
    const c = ensureUint8ArrayFromBody(a);
    return c ? { stream: null, bytes: c } : null;
  }
  function hd() {
    return new Promise((a, b) => {
      const c = new MessageChannel();
      c.port1.addEventListener("message", (d) => {
        if (d.data && typeof d.data === "object" && d.data.type === "pdf") {
          var e = d.data.body;
          // console.log(
          //   "[Loader iframe] received base payload",
          //   e instanceof ReadableStream
          //     ? { kind: "stream" }
          //     : e instanceof Uint8Array
          //     ? { kind: "uint8array", length: e.byteLength }
          //     : { kind: typeof e }
          // );
          const f = getPdfTransportPayload(e);
          f && !d.data.error
            ? f.stream
              ? gd(f.stream).then((g) => {
                  a(new pdfjsLib.PDFDataRangeTransport(g.length, g, !0, ""));
                })
              : a(
                  new pdfjsLib.PDFDataRangeTransport(
                    f.bytes.length,
                    f.bytes,
                    !0,
                    ""
                  )
                )
            : b(Error("Failed to fetch the PDF headers."));
        }
      });
      c.port1.start();
      // console.log("[Loader iframe] posting fetch request (local)");
      window.parent.postMessage({ type: "fetch" }, "*", [c.port2]);
    });
  }
  var kd = async function (a) {
      return new Promise((b, c) => {
        const d = new MessageChannel();
        d.port1.addEventListener("message", async (e) => {
          if (e.data && typeof e.data === "object" && e.data.type === "pdf") {
            const f = getPdfTransportPayload(e.data.body);
            // console.log(
            //   "[Loader iframe] received main pdf payload",
            //   f
            //     ? f.stream
            //       ? { kind: "stream" }
            //       : { kind: "uint8array", length: f.bytes.length }
            //     : { kind: "unknown" }
            // );
            if (f && !e.data.error) {
              var g = Number(e.data.length) || 0,
                h = e.data.encoding;
              e = e.data.filename;
              e = typeof e === "string" ? e : "";
              if (f.stream) {
                if (g <= 0 || h !== "")
                  (g = await gd(f.stream)), b(new id(d.port1, a, g.length, g, e));
                else {
                  const k = f.stream.getReader();
                  var { done: l, value: n } = await k.read();
                  g = new id(d.port1, a, Math.max(g, n.length), n, e, !0);
                  l || jd(g, k);
                  b(g);
                }
              } else {
                const k = f.bytes;
                g = g > 0 ? g : k.length;
                b(new id(d.port1, a, g, k, e));
              }
            } else c(Error("Failed to fetch the PDF headers."));
          }
        });
        d.port1.start();
        // console.log("[Loader iframe] posting fetch request", { url: a });
        try {
          window.parent.parent.postMessage({ type: "fetch", url: a }, "*", [
            d.port2,
          ]);
        } catch (error) {
          // console.error(
          //   "[Loader iframe] postMessage to parent.parent failed",
          //   error
          // );
          c(error);
        }
      });
    },
    jd = async function (a, b) {
      b.read().then(({ done: c, value: d }) => {
        if (c) a.onDataProgressiveDone();
        else if (d) {
          a.g += d.length;
          a.onDataProgressiveRead(d);
          if (a.g <= a.i) a.onDataProgress(a.g, a.i);
          else a.onDataProgress(a.g);
          jd(a, b);
        }
      });
    },
    ld = async function (a, b, c) {
      const d = getPdfTransportPayload(c);
      if (!d) return;
      let e;
      if (d.stream) e = await gd(d.stream);
      else e = d.bytes;
      if (!e) return;
      a.onDataProgress(e.length);
      a.onDataRange(b, e);
    };
  class id extends pdfjsLib.PDFDataRangeTransport {
    constructor(a, b, c, d, e, f = !1) {
      super(c, d, c === d.length, e);
      this.h = a;
      this.l = b;
      this.g = d.length;
      this.i = c;
      this.B = f;
      this.h.addEventListener("message", (g) => {
        if (g.data && typeof g.data === "object") {
          var h = g.data.body,
            k = Number(g.data.begin);
          // console.log(
          //   "[Loader iframe] range payload",
          //   h instanceof ReadableStream
          //     ? { kind: "stream", id: k }
          //     : h instanceof Uint8Array
          //     ? { kind: "uint8array", length: h.byteLength, id: k }
          //     : { kind: typeof h, id: k }
          // );
          g.data.type === "pdfrange" &&
            !g.data.error &&
            k >= 0 &&
            ld(this, k, h);
        }
      });
    }
    requestDataRange(a, b) {
      this.h.postMessage({ type: "fetchrange", url: this.l, begin: a, end: b });
    }
  }
  (async () => {
    const a = await (await fetch("./pdf.worker.min.js")).blob();
    pdfjsLib.GlobalWorkerOptions.workerSrc = (0, URL.createObjectURL)(a);
    ed(
      new fd(async (b) => {
        let c, d;
        new URL(b).protocol === "file:"
          ? ((c = await hd()), (d = !1))
          : ((c = await kd(b)), (d = c.B));
        return {
          I: pdfjsLib.getDocument({
            url: b,
            cMapUrl: "/bcmaps/",
            cMapPacked: !0,
            range: c,
          }),
          B: d,
        };
      })
    );
  })();
}).call(this);
