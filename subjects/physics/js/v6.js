/* Geodesic — numeric variants of worked problems.
   A problem is used only if the arithmetic written in its own solution, run again, gives its stated answer.
   Then the numbers given in the question are changed, the same arithmetic is run with them, and the question,
   the steps and the answer are rewritten. Small whole numbers (counts), percentages over 100 and angles are guarded. */
(function () {
  const WL = (window.WL = window.WL || {});
  const SUPD = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  const TOSUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const FRAC = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };
  /* a number as written: 2.0 · 1,200 · 3.0 × 10⁸ · 6.67 × 10^-11 · 2.5e3 */
  const NUM = /(?<![\w.⁰¹²³⁴⁵⁶⁷⁸⁹])([-−]?)(\d{1,3}(?:,\d{3})+|\d{1,3}(?:[  ]\d{3})+(?![\d.])|\d+(?:\.\d+)?|\.\d+)(?:\s*[×x]\s*10(?:\^\(?([-−]?\d+)\)?|([⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+))|e([-+]?\d+))?/g;
  function nums(s) {
    const out = []; NUM.lastIndex = 0; let m;
    while ((m = NUM.exec(s))) {
      const body = m[2].replace(/[,  ]/g, ''), e = m[3] != null ? +m[3].replace('−', '-') : m[4] != null ? +m[4].split('').map((c) => SUPD[c]).join('') : m[5] != null ? +m[5] : 0;
      const neg = m[1] ? -1 : 1, v = neg * parseFloat(body) * Math.pow(10, e);
      const dp = body.includes('.') ? body.split('.')[1].length : 0, sig = body.replace('.', '').replace(/^0+/, '').length || 1;
      out.push({ i: m.index, j: m.index + m[0].length, t: m[0], v, dp, sig, sci: m[3] != null || m[4] != null ? (m[4] != null ? 'sup' : 'caret') : m[5] != null ? 'e' : '', mant: neg * parseFloat(body), exp: e, comma: m[2].includes(',') ? ',' : /[  ]/.test(m[2]) ? ' ' : '', neg: !!m[1], unit: unitAfter(s, m.index + m[0].length) });
    }
    return out;
  }
  const UNITS = new Set('m cm mm km μm µm nm pm s ms μs µs ns min h hr hrs kg g mg t N kN MN J kJ MJ GJ eV keV MeV GeV TeV W kW MW GW V kV mV μV A mA μA µA Ω kΩ MΩ C mC μC µC nC pC F mF μF µF nF pF T mT μT Wb Hz kHz MHz GHz Pa kPa MPa GPa K °C ° mol Bq kBq MBq Gy Sv rad sr cd L l ml mL cm³ m³ mm³ m² cm² mm² km² N/kg m/s km/h mph m/s² kg/m³ g/cm³ J/kg J/kgK J/kg°C W/m² N/m N/m² Nm kWh kg/s m³/s rpm dB % au AU ly pc kpc Mpc u'.split(' '));
  function unitAfter(s, j) { const r = s.slice(j, j + 14).match(/^\s?(%|°C|°|[A-Za-zΩμµ]+[²³⁻¹]*(?:\/[A-Za-z°]+[²³]?)?)/); return r && UNITS.has(r[1]) ? r[1] : ''; }
  /* evaluate a purely numeric expression; returns null if it is not one */
  function evalExpr(src) {
    let s = src.trim().replace(/[−–]/g, '-').replace(/[·∙]/g, '×').replace(/\*/g, '×').replace(/÷/g, '/');
    s = s.replace(/(\d)\s*%/g, '$1/100').replace(/(\d|[⁰¹²³⁴⁵⁶⁷⁸⁹])\s*(?:°C|[A-Za-zΩμµ]{1,4}[²³⁻¹]*(?:\s*\/\s*(?:\([^)]*\)|[A-Za-zΩμµ°]{1,4}[²³⁻¹]*))?)(?![A-Za-z(])/g, (m, d) => (/^\s*[xX]\s/.test(m.slice(1)) ? m : d + ' '));
    s = s.replace(/\b(sin|cos|tan|ln|log|exp)\s*/g, (m, f) => ({ sin: 'Ş', cos: 'Ç', tan: 'Ť', ln: 'Ľ', log: 'Ĺ', exp: 'Ě' }[f])).replace(/°/g, '');
    if (!s || /[A-Za-zα-ωΑ-Ω]/.test(s.replace(/π/g, '').replace(/[×x]\s*10/g, '×10').replace(/×10/g, ''))) return null;
    const T = []; let k = 0;
    while (k < s.length) {
      const c = s[k];
      if (c === ' ') { k++; continue; }
      if (/[\d.]/.test(c)) { NUM.lastIndex = 0; const m = new RegExp(NUM.source, 'y'); m.lastIndex = k; const r = m.exec(s); if (!r) return null; const n = nums(r[0])[0]; T.push({ n: n ? Math.abs(n.v) : NaN, at: k, len: r[0].length }); k += r[0].length; continue; }
      if (FRAC[c] != null) { T.push({ n: FRAC[c], at: k, len: 1, fixed: true }); k++; continue; }
      if (c === 'π') { T.push({ n: Math.PI, at: k, len: 1, fixed: true }); k++; continue; }
      if (SUPD[c] != null) { let e = ''; while (k < s.length && SUPD[s[k]] != null) e += SUPD[s[k++]]; T.push({ op: '^', sup: +e }); continue; }
      if ('+-×x/()^√ŞÇŤĽĹĚ'.includes(c)) { T.push({ op: c === 'x' ? '×' : c }); k++; continue; }
      return null;
    }
    if (!T.length || !T.some((t) => t.n != null)) return null;
    let p = 0;
    const peek = () => T[p], take = () => T[p++];
    function prim() {
      const t = take(); if (!t) throw 0;
      if (t.op === '-') return -pw();
      if (t.op === '+') return pw();
      if (t.op === '√') return Math.sqrt(pw());
      if (t.op === 'Ş') return Math.sin((pw() * Math.PI) / 180);
      if (t.op === 'Ç') return Math.cos((pw() * Math.PI) / 180);
      if (t.op === 'Ť') return Math.tan((pw() * Math.PI) / 180);
      if (t.op === 'Ľ') return Math.log(pw());
      if (t.op === 'Ĺ') return Math.log10(pw());
      if (t.op === 'Ě') return Math.exp(pw());
      if (t.op === '(') { const v = add(); const c = take(); if (!c || c.op !== ')') throw 0; return v; }
      if (t.n != null) return t.n;
      throw 0;
    }
    function pw() { let v = prim(); for (;;) { const t = peek(); if (t && t.op === '^' && t.sup != null) { take(); v = Math.pow(v, t.sup); } else if (t && t.op === '^') { take(); v = Math.pow(v, prim()); } else break; } return v; }
    function mul() { let v = pw(); for (;;) { const t = peek(); if (t && (t.op === '×' || t.op === '/')) { take(); const r = pw(); v = t.op === '×' ? v * r : v / r; } else if (t && (t.n != null || t.op === '(' || '√ŞÇŤĽĹĚ'.includes(t.op || '#'))) { v *= pw(); } else break; } return v; }
    function add() { let v = mul(); for (;;) { const t = peek(); if (t && (t.op === '+' || t.op === '-')) { take(); const r = mul(); v = t.op === '+' ? v + r : v - r; } else break; } return v; }
    try { const v = add(); if (p !== T.length || !isFinite(v)) return null; return v; } catch (e) { return null; }
  }
  const JUDGE = /\b(close to|closer to|floats?|sinks?|safe|unsafe|so it (?:is|will|would|does)|greater than|less than|more than|fewer than|bigger than|smaller than|enough|exceeds?|over the limit|within the limit|faster than|slower than)\b|[<>≤≥]/i;
  const FACT = [1];
  const CONST = [9.8, 9.81, 1.6, 1.62, 3.6, 60, 100, 1000, 3600, 1e3, 1e6, 3e8, 2.998e8, 330, 340, 343, 6.63e-34, 6.6e-34, 6.626e-34, 1.6e-19, 1.602e-19, 9.11e-31, 1.67e-27, 8.31, 8.314, 6.67e-11, 6.02e23, 6.022e23, 1.38e-23, 8.85e-12, 8.99e9, 9.0e9, 1.26e-6, 5.67e-8, 2.9e-3, 4200, 4180, 0.5, 0.25, 1.5e11, 6.4e6, 6.37e6, 6.0e24, 5.97e24, 2.0e30, 1.99e30, 7.35e22, 3.84e8, 101325, 1.01e5, 273, 273.15, 1.05e-34, 931.5, 1.66e-27];
  const close = (a, b, tol) => (b === 0 ? Math.abs(a) < 1e-9 : Math.abs(a / b - 1) <= tol);
  /* the computations written in the steps: "... = EXPR = RESULT ..." */
  function comps(step) {
    const parts = step.split(/[=≈]/), out = [];
    let off = 0; const pos = parts.map((x) => { const o = off; off += x.length + 1; return o; });
    for (let i = 0; i + 1 < parts.length; i++) {
      let ex = parts[i], exAt = pos[i];
      if (evalExpr(ex) == null) { for (let k = 1; k < ex.length; k++) { if (!/[\s:,;(]/.test(ex[k - 1])) continue; const rest = ex.slice(k); if (/^\s*$/.test(rest)) break; if (evalExpr(rest) != null) { exAt += k; ex = rest; break; } } }
      const v = evalExpr(ex); if (v == null) continue;
      const nx = parts[i + 1].match(/^\s*([-−]?\s*\d[\d,]*(?:\.\d+)?(?:\s*[×x]\s*10(?:\^\(?[-−]?\d+\)?|[⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+))?(?:e[-+]?\d+)?)/);
      if (!nx) continue; const rn = nums(nx[1].replace(/^([-−])\s+/, '$1'))[0]; if (!rn) continue;
      if (!close(v, rn.v, 0.02) && !close(Math.abs(v), Math.abs(rn.v), 0.02)) continue;
      out.push({ ex, exAt, val: v, res: rn.v, resAt: pos[i + 1] + parts[i + 1].indexOf(nx[1].trim()), resText: nx[1].trim() });
    }
    return out;
  }
  /* analyse once: which numbers are inputs, which arithmetic leads to the answer */
  const CACHE = new WeakMap();
  function analyse(p) {
    if (CACHE.has(p)) return CACHE.get(p);
    let A = null;
    try { A = analyse0(p); } catch (e) { A = null; }
    CACHE.set(p, A); return A;
  }
  function analyse0(p) {
    if (!p || !p.q || !p.a || !Array.isArray(p.s) || !p.s.length) return null;
    const qn = nums(p.q).filter((n) => !/^\d{4}$/.test(n.t) || n.unit), an = nums(p.a);
    if (!qn.length || !an.length || an.length > 3) return null;
    const steps = p.s.map((st) => ({ text: st, comps: comps(st) }));
    const all = steps.flatMap((s, si) => s.comps.map((c) => Object.assign(c, { si })));
    if (!all.length) return null;
    // every answer number must be one of the computed results
    const ansMap = an.map((n) => { let best = null; all.forEach((c, ci) => { if (close(Math.abs(n.v), Math.abs(c.res), 0.025) && (!best || ci > best.ci)) best = { ci, c }; }); return best; });
    if (ansMap.some((x) => !x)) return null;
    // the inputs: question numbers that appear in some computation
    const used = new Set();
    all.forEach((c) => nums(c.ex).forEach((n) => { qn.forEach((q, qi) => { if (n.t.replace(/^[-−]/, '') === q.t.replace(/^[-−]/, '') || close(Math.abs(n.v), Math.abs(q.v), 1e-9)) used.add(qi); }); }));
    if (!used.size) return null;
    const vary = [...used].filter((qi) => { const q = qn[qi]; if (q.v === 0) return false; if (CONST.some((c) => close(Math.abs(q.v), c, 0.005))) return false; if (/\b[gcGhekR]\s*=\s*$|\b(?:speed of (?:light|sound)|latitude)\b[^.]{0,20}$/i.test(p.q.slice(Math.max(0, q.i - 24), q.i))) return false; if (/^\s*°\s*[NSEW]\b/.test(p.q.slice(q.j, q.j + 4))) return false; if (!q.dp && !q.sci && !q.unit) return false; if (/^\s*\(/.test(p.q.slice(Math.max(0, q.i - 2), q.i + 1).slice(0, 2)) && /\d\s*[A-Za-z]*\s*$/.test(p.q.slice(Math.max(0, q.i - 20), q.i - 1))) return false; if (!q.dp && !q.sci && Math.abs(q.v) <= 4) return false; return true; });
    if (!vary.length) return null;
    if (/\bP\s*\(|probabilit/i.test(p.q)) return null;
    if (/\b(Earth|Sun|Moon|Mars|Jupiter|Saturn|Venus|Mercury|Neptune|Uranus|Pluto|galaxy|Milky Way|ISS|Everest|London|Paris|Seoul|Tokyo|New York|Higgs|Halley|Andromeda|Proxima|Sirius|Betelgeuse|Titanic|Concorde|Usain|Bolt)\b/.test(p.q)) return null; // real objects: their numbers are facts
    const vv = vary.map((qi) => Math.abs(qn[qi].v)); if (new Set(vv.map((x) => x.toPrecision(6))).size !== vv.length) return null;
    if ([...used].some((qi) => !vary.includes(qi) && vary.some((vi) => close(Math.abs(qn[qi].v), Math.abs(qn[vi].v), 1e-9)))) return null;
    for (const c of all) for (const n of nums(c.ex)) {
      const isIn = qn.some((q) => n.t.replace(/^[-−]/, '') === q.t.replace(/^[-−]/, '') || close(Math.abs(n.v), Math.abs(q.v), 1e-9));
      const isRes = all.some((d) => d !== c && close(Math.abs(n.v), Math.abs(d.res), 0.012));
      const isK = (!n.dp && !n.sci && Math.abs(n.v) <= 4) || n.sci && /^1(\.0+)?$/.test(String(Math.abs(n.mant))) || CONST.some((k) => close(Math.abs(n.v), k, 0.005));
      if (!isIn && !isRes && !isK) return null;
    }
    if (JUDGE.test(p.a) || p.s.some((x) => JUDGE.test(x))) return null;
    if (all.some((c) => qn.some((q) => close(Math.abs(c.res), Math.abs(q.v), 0.012)))) return null; // a result equal to a given number would be ambiguous to rewrite
    const known = (v) => qn.some((q) => close(Math.abs(v), Math.abs(q.v), 1e-9)) || all.some((c) => FACT.some((f) => close(Math.abs(v), Math.abs(c.res * f), 0.02)));
    const fixedOK = (n) => (!n.dp && Math.abs(n.v) <= 12) || CONST.some((c) => close(Math.abs(n.v), c, 0.005));
    for (let si = 0; si < steps.length; si++) {
      const st = steps[si], cover = st.comps.flatMap((c) => [[c.exAt, c.exAt + c.ex.length], [c.resAt, c.resAt + c.resText.length]]);
      for (const n of nums(st.text)) { if (cover.some(([a0, a1]) => n.i >= a0 && n.j <= a1)) continue; if (!known(n.v) && !fixedOK(n)) return null; }
    }
    for (const n of an) if (!known(n.v) && !fixedOK(n)) return null;
    return { qn, an, steps, all, ansMap, vary };
  }
  /* format a new value the way the old one was written */
  function fmt(v, like) {
    const neg = v < 0, a = Math.abs(v);
    if (like.sci) {
      let e = a ? Math.floor(Math.log10(a)) : 0, m = a / Math.pow(10, e); let ms = m.toFixed(Math.max(like.dp, like.res ? 2 : 1));
      if (+ms >= 10) { e += 1; ms = (m / 10).toFixed(Math.max(like.dp, like.res ? 2 : 1)); }
      const es = like.sci === 'sup' ? String(e).split('').map((c) => TOSUP[c]).join('') : like.sci === 'caret' ? '^' + e : 'e' + e;
      return (neg ? '−' : '') + (like.sci === 'e' ? ms + es : `${ms} × 10${es}`);
    }
    let s;
    if (like.dp && !(like.res && a > 0 && a.toFixed(like.dp).replace('.', '').replace(/^0+/, '').length < 3)) s = a.toFixed(like.dp);
    else { const sig = Math.max(like.res ? 3 : 2, like.sig); s = a >= Math.pow(10, sig) ? String(Math.round(a)) : String(+a.toPrecision(sig)); if (/e/.test(s)) s = a.toFixed(0); }
    if (like.comma && !s.includes('.')) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, like.comma);
    return (neg ? '−' : '') + s;
  }
  /* a fresh set of inputs, rounded as written, inside sensible limits */
  function pick(q, R) {
    for (let k = 0; k < 20; k++) {
      const f = Math.exp((R() - 0.5) * 1.3); let v = q.v * f;
      if (q.unit === '%') v = Math.min(v, 95); if (q.unit === '°') v = Math.max(5, Math.min(v, 85));
      const s = fmt(v, q), back = nums(s)[0]; if (!back) continue;
      if (back.v === q.v) continue; if (q.v > 0 && back.v <= 0) continue;
      return { v: back.v, s };
    }
    return null;
  }
  function rng(seed) { let s = (seed >>> 0) || 0x9e3779b9; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  /* re-run the steps with new inputs; returns {q, a, s} or null */
  function make(p, seed) {
    const A = analyse(p); if (!A) return null;
    const R = rng(seed || 1);
    for (let attempt = 0; attempt < 6; attempt++) {
      const newIn = {}; let bad = false;
      A.vary.forEach((qi) => { if (R() < 0.15 && A.vary.length > 1) return; const r = pick(A.qn[qi], R); if (!r) bad = true; else newIn[qi] = r; });
      if (bad || !Object.keys(newIn).length) continue;
      const out = runChain(p, A, newIn); if (out && verify(A, out)) return out;
    }
    return null;
  }
  function runChain(p, A, newIn) {
    const map = []; // [old value, new value, kind] in order of discovery
    A.qn.forEach((q, qi) => { if (newIn[qi]) map.push({ old: q.v, nw: newIn[qi].v, like: q, kind: 'in', text: q.t }); });
    const look = (n) => { // what a number in a computation should become
      for (const m of map) if (m.kind === 'in' && (n.t.replace(/^[-−]/, '') === m.text.replace(/^[-−]/, ''))) return Math.abs(m.nw) * (n.v < 0 ? -1 : 1);
      for (let k = map.length - 1; k >= 0; k--) { const m = map[k]; if (m.kind === 'res' && close(Math.abs(n.v), Math.abs(m.old), 0.012)) return Math.abs(m.nw) * Math.sign(n.v || 1); }
      return null;
    };
    const edits = A.steps.map(() => []);
    for (const c of A.all) {
      const ns = nums(c.ex); let src = c.ex, shift = 0; const local = [];
      for (const n of ns) { const nv = look(n); if (nv == null) continue; const isIn = map.some((m) => m.kind === 'in' && n.t.replace(/^[-−]/, '') === m.text.replace(/^[-−]/, '')); const s = fmtKeep(nv, isIn ? n : Object.assign({}, n, { res: true })); local.push({ i: n.i, j: n.j, s }); }
      local.sort((a, b) => b.i - a.i).forEach((e) => { src = src.slice(0, e.i) + e.s + src.slice(e.j); });
      const v = evalExpr(src.replace(/−/g, '-')); if (v == null || !isFinite(v)) return null;
      const nv = v;
      if (!isFinite(nv) || (c.res > 0 && nv <= 0) || Math.abs(Math.log10(Math.abs(nv / (c.res || 1)) || 1)) > 3) return null;
      const like = Object.assign({}, nums(c.resText)[0], { res: true }); const ns2 = fmtKeep(nv, like);
      map.push({ old: c.res, nw: nums(ns2)[0] ? nums(ns2)[0].v : nv, like, kind: 'res', text: c.resText });
      edits[c.si].push({ at: c.exAt, len: c.ex.length, s: src }, { at: c.resAt, len: c.resText.length, s: ns2 });
    }
    const swap = (text, extra) => { // other mentions of inputs and results in free text
      const ns = nums(text), ed = (extra || []).slice();
      ns.forEach((n) => { if (ed.some((e) => n.i < e.at + e.len && n.j > e.at)) return; const nv = look(n); if (nv == null) return; const isIn = map.some((m) => m.kind === 'in' && n.t.replace(/^[-−]/, '') === m.text.replace(/^[-−]/, '')); ed.push({ at: n.i, len: n.j - n.i, s: fmtKeep(nv, isIn ? n : Object.assign({}, n, { res: true })) }); });
      ed.sort((a, b) => b.at - a.at); let s = text; for (const e of ed) s = s.slice(0, e.at) + e.s + s.slice(e.at + e.len); return s;
    };
    const q2 = (() => { const ed = []; A.qn.forEach((q, qi) => { if (newIn[qi]) ed.push({ at: q.i, len: q.j - q.i, s: (q.neg ? '' : '') + newIn[qi].s }); }); ed.sort((a, b) => b.at - a.at); let s = p.q; for (const e of ed) s = s.slice(0, e.at) + e.s + s.slice(e.at + e.len); return s; })();
    const s2 = A.steps.map((st, si) => swap(st.text, edits[si]));
    const a2 = swap(p.a);
    if (q2 === p.q || a2 === p.a) return null;
    return Object.assign({}, p, { q: q2, a: a2, s: s2, variant: true });
  }
  function verify(A, v) {
    const cs = v.s.flatMap((st) => comps(st)); if (cs.length < A.all.length) return false;
    const an = nums(v.a); if (an.length !== A.an.length) return false;
    return an.every((n) => cs.some((c) => close(Math.abs(n.v), Math.abs(c.res), 0.025)));
  }
  function fmtKeep(v, like) { return fmt(v, like || { dp: 0, sig: 3, sci: '' }); }
  WL.variants = { ok: (p) => !!analyse(p), make, _t: { nums, evalExpr, comps, analyse } };
})();
/* Geodesic — endless practice. Questions are generated from formula templates (numbers drawn on a grid, the answer
   computed by the formula itself) and from numeric variants of the worked problems (variants.js).
   Plain template:  [topic, question with {vars}, 'name=min..max/step …', 'x = js expression; y = …', unit, sig figs, condition?]
   Exam template:   [topic, stem with {vars}, vars, [[part question, 'x = expr', unit, sig figs], …], condition?] */
(function () {
  const WL = (window.WL = window.WL || {});
  const P = [], X = [];
  const TOSUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '.': '·' };
  function rng(seed) { let s = (seed >>> 0) || 0x9e3779b9; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function spec(str) { // 'u=0..15/1 m=0.2..2/0.1 q=1.6e-19' (a single value is fixed)
    const out = {};
    str.trim().split(/\s+/).forEach((w) => { const m = w.match(/^([A-Za-z_]\w*)=([-\d.e]+)(?:\.\.([-\d.e]+)\/([\d.e-]+))?$/); if (!m) throw new Error('bad var ' + w); out[m[1]] = m[3] == null ? { fix: +m[2] } : { lo: +m[2], hi: +m[3], st: +m[4] }; });
    return out;
  }
  const dpOf = (st) => { const s = String(st); if (/e-/.test(s)) return +s.split('e-')[1]; return s.includes('.') ? s.split('.')[1].length : 0; };
  function draw(V, R) {
    const v = {};
    for (const k in V) { const d = V[k]; if (!d) continue; if (d.fix != null) { v[k] = d.fix; continue; } const n = Math.round((d.hi - d.lo) / d.st); v[k] = +(d.lo + Math.floor(R() * (n + 1)) * d.st).toFixed(dpOf(d.st)); }
    return v;
  }
  /* numbers as a physicist writes them */
  function sf(x, n = 3) {
    if (!isFinite(x)) return '?'; if (x === 0) return '0';
    const a = Math.abs(x), e = Math.floor(Math.log10(a));
    if (e >= 5 || e <= -4) { const m = x / Math.pow(10, e); let ms = m.toFixed(Math.max(0, n - 1)); let ee = e; if (Math.abs(+ms) >= 10) { ee++; ms = (x / Math.pow(10, ee)).toFixed(Math.max(0, n - 1)); } return `${ms.replace('-', '−')} × 10${String(ee).split('').map((c) => TOSUP[c]).join('')}`; }
    let s = x.toPrecision(n); if (/e/.test(s)) s = String(+s); return s.replace('-', '−');
  }
  const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9 && Math.abs(x) < 1e9;
  const fmtIn = (x, d) => (d === 'c' ? (isInt(x) ? String(Math.round(x)).replace('-', '−') : sf(x, 3)) : d && d.st ? (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? sf(x, 3) : x.toFixed(dpOf(d.st))) : Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? sf(x, 3) : String(x)).replace('-', '−');
  /* a formula as JS for the computer, and as text for the student */
  const JSF = { floor: 'Math.floor', comb: 'COMB', fact: 'FACT', sqrt: 'Math.sqrt', sin: 'SIN', cos: 'COS', tan: 'TAN', asin: 'ASIN', acos: 'ACOS', atan: 'ATAN', ln: 'Math.log', log: 'Math.log10', exp: 'Math.exp', abs: 'Math.abs', pi: 'Math.PI', min: 'Math.min', max: 'Math.max' };
  const SIN = (d) => Math.sin((d * Math.PI) / 180), COS = (d) => Math.cos((d * Math.PI) / 180), TAN = (d) => Math.tan((d * Math.PI) / 180), ASIN = (x) => (Math.asin(x) * 180) / Math.PI, ACOS = (x) => (Math.acos(x) * 180) / Math.PI, ATAN = (x) => (Math.atan(x) * 180) / Math.PI;
  const FACT = (n) => { let r = 1; for (let i = 2; i <= Math.round(n); i++) r *= i; return r; }, COMB = (n, r) => FACT(n) / (FACT(r) * FACT(n - r));
  const FUNCTIONS = { floor: Math.floor, comb: COMB, fact: FACT, sqrt: Math.sqrt, sin: SIN,
    cos: COS, tan: TAN, asin: ASIN, acos: ACOS, atan: ATAN, ln: Math.log, log: Math.log10,
    exp: Math.exp, abs: Math.abs, min: Math.min, max: Math.max };
  const OPERATORS = {
    '||': [1, (a, b, vars) => a(vars) || b(vars)], '&&': [2, (a, b, vars) => a(vars) && b(vars)],
    '==': [3, (a, b, vars) => a(vars) === b(vars)], '!=': [3, (a, b, vars) => a(vars) !== b(vars)],
    '<': [4, (a, b, vars) => a(vars) < b(vars)], '<=': [4, (a, b, vars) => a(vars) <= b(vars)],
    '>': [4, (a, b, vars) => a(vars) > b(vars)], '>=': [4, (a, b, vars) => a(vars) >= b(vars)],
    '+': [5, (a, b, vars) => a(vars) + b(vars)], '-': [5, (a, b, vars) => a(vars) - b(vars)],
    '*': [6, (a, b, vars) => a(vars) * b(vars)], '/': [6, (a, b, vars) => a(vars) / b(vars)],
    '%': [6, (a, b, vars) => a(vars) % b(vars)], '^': [7, (a, b, vars) => a(vars) ** b(vars)]
  };
  const CACHE = new Map();
  // Formula templates use arithmetic, named maths functions and range checks.
  function compile(expr) {
    if (CACHE.has(expr)) return CACHE.get(expr);
    const tokens = expr.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[a-z_]\w*|[<>=!]=|&&|\|\||[^\s]/gi) || [];
    let cursor = 0;
    const accept = token => tokens[cursor] === token && (++cursor, true);
    const requireToken = token => { if (!accept(token)) throw new Error('Invalid practice formula: ' + expr); };
    function atom() {
      const token = tokens[cursor++];
      if (token === '(') {
        const value = expression(0);
        requireToken(')');
        return value;
      }
      if (token === '+' || token === '-') {
        const value = expression(7);
        return vars => token === '-' ? -value(vars) : +value(vars);
      }
      if (token === 'pi') return () => Math.PI;
      if (token && /^[0-9.]/.test(token)) return () => Number(token);
      if (token && /^[a-z_]\w*$/i.test(token)) {
        if (!accept('(')) return vars => vars[token];
        const fn = Object.hasOwn(FUNCTIONS, token) && FUNCTIONS[token];
        if (!fn) throw new Error('Unknown practice formula function: ' + token);
        const args = [expression(0)];
        while (accept(',')) args.push(expression(0));
        requireToken(')');
        return vars => fn(...args.map(arg => arg(vars)));
      }
      throw new Error('Invalid practice formula: ' + expr);
    }
    function expression(minimum) {
      let value = atom();
      while (Object.hasOwn(OPERATORS, tokens[cursor])) {
        const operator = tokens[cursor];
        const [precedence, apply] = OPERATORS[operator];
        if (precedence < minimum) break;
        cursor++;
        const left = value;
        const right = expression(operator === '^' ? precedence : precedence + 1);
        value = vars => apply(left, right, vars);
      }
      return value;
    }
    const run = expression(0);
    if (cursor !== tokens.length) throw new Error('Invalid practice formula: ' + expr);
    const result = { run };
    CACHE.set(expr, result);
    return result;
  }
  const NICE = { rho: 'ρ', lam: 'λ', theta: 'θ', th: 'θ', omega: 'ω', w: 'ω', mu: 'μ', eps: 'ε', phi: 'φ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'Δ', sigma: 'σ', tau: 'τ', nu: 'ν', eta: 'η', Dt: 'Δt', DT: 'ΔT', Dx: 'Δx', Dv: 'Δv', Dp: 'Δp', DE: 'ΔE', Dm: 'Δm', DQ: 'ΔQ', Dth: 'Δθ', Ek: 'Eₖ', Ep: 'Eₚ', v0: 'v₀', x0: 'x₀', N0: 'N₀', A0: 'A₀', I0: 'I₀', V0: 'V₀', Q0: 'Q₀', T0: 'T₀', t12: 't½', R1: 'R₁', R2: 'R₂', R3: 'R₃', C1: 'C₁', C2: 'C₂', m1: 'm₁', m2: 'm₂', u1: 'u₁', u2: 'u₂', v1: 'v₁', v2: 'v₂', n1: 'n₁', n2: 'n₂', p1: 'p₁', p2: 'p₂', V1: 'V₁', V2: 'V₂', T1: 'T₁', T2: 'T₂', F1: 'F₁', F2: 'F₂', d1: 'd₁', d2: 'd₂', Np: 'Nₚ', Ns: 'Nₛ', Vp: 'Vₚ', Vs: 'Vₛ', Ip: 'Iₚ', Is: 'Iₛ', f0: 'f₀', E0: 'E₀', B0: 'B₀', k_B: 'k_B', DU: 'ΔU', DS: 'ΔS', kappa: 'κ', hbar: 'ħ', me: 'mₑ', mn: 'mₙ', Ms: 'M☉', mc2: 'mc²', Ephot: 'E_photon', nmax: 'n_max', uy: 'u_y', dm: 'Δm', eps0: 'ε₀', H0: 'H₀', R0: 'R₀', lc: 'h/mₑc', Kb: 'K_before', Ka: 'K_after', Id: 'I_d', inv: '1/λ', vmax: 'v_max', amax: 'a_max', Tb: 'T_beat', sc: 'q/m', E1: 'E₁', E2: 'E₂', sb: 's_brake', pw: 'p_water', Pin: 'P_in', p0: 'p₀', hw: 'ħω', GM: 'GM', NA: 'Nₐ', n0: 'n₀', b: 'b', mc: 'mc', DG: 'ΔG', Dlam: 'Δλ', Df: 'Δf', DPhi: 'ΔΦ', Phi: 'Φ', lmax: 'λmax', rs: 'r_s', gam: 'γ', vrms: 'v_rms', Vrms: 'V_rms', Irms: 'I_rms', Vout: 'V_out', Vin: 'V_in', Ein: 'E_in', Eout: 'E_out', Eu: 'E_useful', R_T: 'R_T' };
  const nice = (n) => NICE[n] || n;
  function show(expr, v, D) { // the formula, then with numbers in
    const sym = expr.replace(/\b[A-Za-z_]\w*\b/g, (w) => (JSF[w] ? ({ floor: 'floor', comb: 'C', fact: 'fact', sqrt: '√', pi: 'π', ln: 'ln ', log: 'log ', exp: 'exp ', sin: 'sin ', cos: 'cos ', tan: 'tan ', asin: 'sin⁻¹ ', acos: 'cos⁻¹ ', atan: 'tan⁻¹ ', abs: '', min: 'min', max: 'max' }[w]) : nice(w)));
    const num = expr.replace(/\b[A-Za-z_]\w*\b/g, (w) => (JSF[w] ? ({ floor: 'floor', comb: 'C', fact: 'fact', sqrt: '√', pi: 'π', ln: 'ln ', log: 'log ', exp: 'exp ', sin: 'sin ', cos: 'cos ', tan: 'tan ', asin: 'sin⁻¹ ', acos: 'cos⁻¹ ', atan: 'tan⁻¹ ', abs: '', min: 'min', max: 'max' }[w]) : v[w] == null ? w : (() => { const t = fmtIn(v[w], D[w]); return v[w] < 0 || / × 10/.test(t) ? `(${t})` : t; })()));
    const tidy = (s) => s.replace(/fact\((\w+)\)/g, '$1!').replace(/\b(\d+(?:\.\d+)?)e(-?\d+)\b/g, (m, a, e) => (a === '1' ? '' : a + ' × ') + '10' + e.split('').map((c) => TOSUP[c]).join('')).replace(/\s*\*\s*/g, ' × ').replace(/\s*\/\s*/g, ' / ').replace(/\^\((-?[\w.]+)\)/g, '^$1').replace(/\^(-?[\d.]+)/g, (m, e) => (/^-?\d+$/.test(e) ? e.split('').map((c) => TOSUP[c]).join('') : '^' + e)).replace(/-/g, '−').replace(/\s+/g, ' ').trim();
    return [tidy(sym), tidy(num)];
  }
  const subst = (txt, v, D) => txt.replace(/\{(\+?)(\w+)\}/g, (mm, sg, w) => { if (v[w] == null) return mm; const t = fmtIn(Math.abs(v[w]), D[w]); return sg ? (v[w] < 0 ? '− ' + t : '+ ' + t) : fmtIn(v[w], D[w]); });
  function plainOf(T, seed) { // → {q, a, s, gen}
    const [topic, q, vs, f, unit, sig = 3, cond] = T, V = spec(vs), R = rng(seed);
    for (let k = 0; k < 40; k++) {
      const v = draw(V, R), v0 = Object.assign({}, v), D = Object.assign({}, V), lines = f.split(';').map((x) => x.trim()).filter(Boolean), steps = []; let last = null, name = null, ok = true;
      for (const ln of lines) {
        const m = ln.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/); if (!m) return null;
        const c = compile(m[2]), val = c.run(v); if (!isFinite(val)) { ok = false; break; }
        const [a, b] = show(m[2], v, D); v[m[1]] = val; D[m[1]] = 'c'; last = val; name = m[1];
        steps.push(`${nice(m[1])} = ${a} = ${b} = ${isInt(val) ? String(Math.round(val)).replace('-', '−') : sf(val, sig)}`);
      }
      if (!ok) continue;
      if (cond && !compile(cond).run(v)) continue;
      const txt = subst(q, v, D);
      const ans = `${isInt(last) ? String(Math.round(last)).replace('-', '−') : sf(last, sig)}${unit ? (unit === '°' ? '°' : ' ' + unit) : ''}`;
      steps[steps.length - 1] += unit ? (unit === '°' ? '°' : ' ' + unit) : '';
      return { l: lines.length > 1 ? 2 : 1, q: txt, a: ans, s: steps, gen: true, tq: q, v: v0 };   // tq and v let geometry templates draw a figure (geofig-q.js)
    }
    return null;
  }
  function examOf(T, seed) { // → {q, pts, a, marks, parts}
    const [topic, stem, vs, parts, cond] = T, V = spec(vs), R = rng(seed);
    for (let k = 0; k < 40; k++) {
      const v = draw(V, R), D = Object.assign({}, V); let ok = true; const out = [], pts = [];
      parts.forEach(([pq, f, unit, sig = 3], i) => {
        if (!ok) return; const lines = f.split(';').map((x) => x.trim()).filter(Boolean); let last = null;
        lines.forEach((ln, li) => { const m = ln.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/); const val = compile(m[2]).run(v); if (!isFinite(val)) { ok = false; return; } const [a, b] = show(m[2], v, D); v[m[1]] = val; D[m[1]] = 'c'; last = val;
          if (li === lines.length - 1) { pts.push(`(${String.fromCharCode(97 + i)}) ${nice(m[1])} = ${a}`); pts.push(`= ${b} = ${sf(val, sig)}${unit ? ' ' + unit : ''}`); } else pts.push(`(${String.fromCharCode(97 + i)}) ${nice(m[1])} = ${a} = ${sf(val, sig)}`); });
        out.push(`(${String.fromCharCode(97 + i)}) ${subst(pq, v, D)}`);
      });
      if (!ok) continue; if (cond && !compile(cond).run(v)) continue;
      const q = subst(stem, v, D) + '\n' + out.join('\n');
      return { q, pts, marks: pts.length, a: '', gen: true };
    }
    return null;
  }
  /* what each topic can generate */
  const byTopic = (L) => { const m = {}; L.forEach((T, i) => { (m[T[0]] = m[T[0]] || []).push(i); }); return m; };
  let PT = null, XT = null;
  const idxP = () => PT || (PT = byTopic(P)), idxX = () => XT || (XT = byTopic(X));
  function variantsOf(id) { const N = ((WL.notes || {})[id] || {}).probs || []; if (!WL.variants) return []; return N.map((p, i) => [i, p]).filter(([, p]) => WL.variants.ok(p)).map(([i]) => i); }
  const isExamQ = (q) => (q.l || 2) === 3 || ((q.l || 2) === 2 && (q.s || []).length >= 3);
  WL.qgen = {
    add(list) { list.forEach((T) => (Array.isArray(T[3]) ? X : P).push(T)); PT = XT = null; },
    count(id) { const V = variantsOf(id); return { plain: (idxP()[id] || []).length + V.length, exam: (idxX()[id] || []).length }; },
    /* a fresh plain question: key 'v<i>.<seed>' (variant of worked problem i) or 't<i>.<seed>' (template i) */
    plain(id, seed) {
      const T = idxP()[id] || [], V = variantsOf(id), n = T.length + V.length; if (!n) return null;
      const R = rng(seed); for (let k = 0; k < 8; k++) { const j = Math.floor(R() * n), s2 = Math.floor(R() * 1e9); const key = j < T.length ? `t${T[j]}.${s2}` : `v${V[j - T.length]}.${s2}`; const p = this.get(id, key); if (p) return Object.assign(p, { key }); }
      return null;
    },
    get(id, key) {
      const m = String(key).match(/^([tvx])(\d+)\.(\d+)$/); if (!m) return null;
      if (m[1] === 't') { const T = P[+m[2]]; return T && T[0] === id ? plainOf(T, +m[3]) : null; }
      if (m[1] === 'x') { const T = X[+m[2]]; return T && T[0] === id ? examOf(T, +m[3]) : null; }
      const base = (((WL.notes || {})[id] || {}).probs || [])[+m[2]]; if (!base || !WL.variants) return null; const v = WL.variants.make(base, +m[3]); return v ? Object.assign(v, { gen: true, exam: isExamQ(base) }) : null;
    },
    exam(id, seed) { const T = idxX()[id] || []; if (!T.length) return null; const R = rng(seed); const i = T[Math.floor(R() * T.length)], s2 = Math.floor(R() * 1e9), key = `x${i}.${s2}`; const p = this.get(id, key); return p ? Object.assign(p, { key }) : null; },
    _t: { plainOf, examOf, sf, show, P, X }
  };
})();
/* Endless-practice templates: KS3 and GCSE. Every answer is computed by its formula; ranges keep the numbers realistic. */
(function () {
  const Q = window.WL.qgen;
  Q.add([
    /* KS3 */
    ['ks3-energy', 'A motor takes in {Ein} J of electrical energy and transfers {Eu} J usefully. What is its efficiency?', 'Ein=200..2000/100 Eu=50..1500/50', 'efficiency = Eu/Ein*100', '%', 3, 'Eu<0.95*Ein'],
    ['ks3-energy', 'A lamp is supplied with {Ein} J and gives out {Eu} J as light. How much energy is wasted?', 'Ein=100..900/20 Eu=10..300/10', 'wasted = Ein - Eu', 'J', 3, 'Eu<Ein'],
    ['ks3-forces', 'Two forces act on a box along a line: {F1} N to the right and {F2} N to the left. What is the size of the resultant force?', 'F1=20..200/5 F2=5..150/5', 'F = F1 - F2', 'N', 3, 'F1>F2'],
    ['ks3-forces', 'What is the weight of a {m} kg rucksack on Earth, where g = 9.8 N/kg?', 'm=1.5..25/0.5 g=9.8', 'W = m*g', 'N', 3],
    ['ks3-speed', 'A cyclist travels {d} m in {t} s. What is her average speed?', 'd=100..3000/50 t=20..600/10', 'v = d/t', 'm/s', 3],
    ['ks3-speed', 'A train moves at a steady {v} m/s for {t} s. How far does it travel?', 'v=10..60/1 t=10..300/5', 'd = v*t', 'm', 3],
    ['ks3-speed', 'A runner covers {d} m at an average speed of {v} m/s. How long does it take?', 'd=100..5000/100 v=2..9/0.5', 't = d/v', 's', 3],
    ['ks3-moments', 'A force of {F} N pushes on a spanner {d} m from the bolt. What is the moment about the bolt?', 'F=20..300/10 d=0.10..0.60/0.05', 'M = F*d', 'N m', 3],
    ['ks3-moments', 'On a see-saw a {F1} N child sits {d1} m to the left of the pivot. Where must a {F2} N child sit, on the right, to balance it?', 'F1=200..600/20 d1=0.8..2.5/0.1 F2=250..700/10', 'd2 = F1*d1/F2', 'm', 3, 'd2<3'],
    ['ks3-pressure', 'A box of weight {F} N rests on an area of {A} m². What pressure does it exert on the floor?', 'F=50..2000/10 A=0.05..2.0/0.05', 'p = F/A', 'Pa', 3],
    ['ks3-pressure', 'A drawing pin is pushed with a force of {F} N. Its point has an area of {A} mm². Find the pressure in N/mm².', 'F=5..60/1 A=0.05..0.5/0.05', 'p = F/A', 'N/mm²', 3],
    ['ks3-density', 'A block has a mass of {m} g and a volume of {V} cm³. What is its density?', 'm=20..900/5 V=5..300/5', 'rho = m/V', 'g/cm³', 3],
    ['ks3-density', 'A stone of density {rho} g/cm³ has a volume of {V} cm³. What is its mass?', 'rho=1.5..8.0/0.1 V=10..200/5', 'm = rho*V', 'g', 3],
    ['ks3-heat', 'How much energy is needed to warm {m} kg of water by {dT} °C? The specific heat capacity of water is 4200 J/kg °C.', 'm=0.2..3.0/0.1 dT=5..60/1 c=4200', 'E = m*c*dT', 'J', 3],
    ['ks3-waves', 'A wave has a frequency of {f} Hz and a wavelength of {lam} m. What is its speed?', 'f=0.5..20/0.5 lam=0.1..5.0/0.1', 'v = f*lam', 'm/s', 3],
    ['ks3-sound', 'A ship’s sonar pulse returns {t} s after it is sent. Sound travels at 1500 m/s in sea water. How deep is the water?', 't=0.10..4.00/0.05 v=1500', 'd = v*t/2', 'm', 3],
    ['ks3-sound', 'A sound wave in air has a frequency of {f} Hz. Taking the speed of sound as 340 m/s, find its wavelength.', 'f=100..4000/50 v=340', 'lam = v/f', 'm', 3],
    ['ks3-light', 'A laser pulse travels to a mirror and back in {t} microseconds. Light travels at 3.0 × 10⁸ m/s. How far away is the mirror?', 't=0.2..20/0.2 c=3e8', 'd = c*t*1e-6/2', 'm', 3],
    ['ks3-circuits', 'A current of {I} A flows through a lamp for {t} s. How much charge passes through it?', 'I=0.1..3.0/0.1 t=10..600/10', 'Q = I*t', 'C', 3],
    ['ks3-circuits', 'There is a potential difference of {V} V across a resistor and a current of {I} A through it. What is its resistance?', 'V=1.5..24/0.5 I=0.05..2.0/0.05', 'R = V/I', 'Ω', 3],
    ['ks3-parallel', 'In a parallel circuit one branch carries {I1} A and the other {I2} A. What current flows from the cell?', 'I1=0.1..2.0/0.1 I2=0.1..2.0/0.1', 'I = I1 + I2', 'A', 3],
    ['ks3-parallel', 'A current of {I} A leaves a cell and splits between two branches. One branch carries {I1} A. What does the other carry?', 'I=0.5..4.0/0.1 I1=0.1..3.0/0.1', 'I2 = I - I1', 'A', 3, 'I1<I'],
    ['ks3-space', 'An astronaut of mass {m} kg stands on a planet where g = {g} N/kg. What is her weight there?', 'm=50..100/1 g=2.0..25/0.1', 'W = m*g', 'N', 3],
    ['ks3-solar-system', 'A space probe travels {d} million km at an average {v} km/s. How many days does the journey take?', 'd=50..1500/10 v=10..40/1', 'days = d*1e6/v/86400', 'days', 3],
    ['ks3-particles', 'A {m} g lump of wax is melted and poured into a measuring cylinder, where it fills {V} cm³. What is the density of the liquid wax?', 'm=10..80/1 V=12..100/1', 'rho = m/V', 'g/cm³', 3, 'rho<1.2 && rho>0.6'],
    ['ks3-climate', 'A house uses {E} kWh of gas a year. Burning gas releases about 0.18 kg of carbon dioxide per kWh. How many kilograms of carbon dioxide is that?', 'E=4000..20000/500 k=0.18', 'CO2 = E*k', 'kg', 3],
    ['ks3-colour', 'A filter lets through {p}% of the light falling on it. A second identical filter is placed behind it. What percentage of the original light gets through both?', 'p=20..90/5', 'through = p*p/100', '%', 3],
    ['ks3-earth', 'Seismic P waves travel at {v} km/s. How long do they take to reach a station {d} km from an earthquake?', 'v=5.0..8.0/0.1 d=200..3000/50', 't = d/v', 's', 3],
    ['ks3-tides-eclipses', 'High tides at a harbour are about 12.4 hours apart. If high tide is at {h} hours after midnight today, how many hours after midnight today is the next high tide?', 'h=0.5..11.5/0.5 T=12.4', 'next = h + T', 'hours', 3],
    /* GCSE */
    ['gcse-measurement', 'A length is measured as {L} cm with an uncertainty of ±{u} cm. What is the percentage uncertainty?', 'L=5.0..80/0.5 u=0.05..0.5/0.05', 'pct = u/L*100', '%', 2],
    ['gcse-measurement', 'Five students time the same swing: their mean is {t} s and the times range over {r} s. Estimate the uncertainty in the mean as half the range.', 't=1.20..3.00/0.01 r=0.04..0.40/0.02', 'u = r/2', 's', 2],
    ['gcse-suvat', 'A car speeds up uniformly from {u} m/s to {v} m/s in {t} s. Calculate its acceleration.', 'u=0..15/1 v=16..40/1 t=2..12/0.5', 'a = (v - u)/t', 'm/s²', 3],
    ['gcse-suvat', 'A cyclist accelerates uniformly from {u} m/s to {v} m/s in {t} s. How far does she travel in that time?', 'u=0..8/0.5 v=9..18/0.5 t=3..15/1', 's = (u + v)/2*t', 'm', 3],
    ['gcse-suvat', 'A stone is dropped from rest and falls {h} m. Ignoring air resistance and taking g = 9.8 m/s², how fast is it moving when it lands?', 'h=1.0..80/0.5 g=9.8', 'v = sqrt(2*g*h)', 'm/s', 3],
    ['gcse-suvat', 'A car travelling at {u} m/s brakes with a deceleration of {a} m/s². What is its braking distance?', 'u=8..35/1 a=3.0..9.0/0.5', 's = u^2/(2*a)', 'm', 3],
    ['gcse-mass-weight', 'A parcel weighs {W} N on Earth (g = 9.8 N/kg). What is its mass?', 'W=10..500/5 g=9.8', 'm = W/g', 'kg', 3],
    ['gcse-mass-weight', 'A {m} kg rover weighs {W} N on another planet. What is the gravitational field strength there?', 'm=100..1000/10 W=200..9000/50', 'g = W/m', 'N/kg', 3, 'g>0.5 && g<30'],
    ['gcse-forces', 'A {m} kg box is pulled along the floor by a {F} N force against {Ff} N of friction. What is its acceleration?', 'm=2..50/1 F=20..300/5 Ff=5..150/5', 'a = (F - Ff)/m', 'm/s²', 3, 'F>Ff'],
    ['gcse-forces', 'A spring stretches by {x} m when a force of {F} N is applied. Find its spring constant.', 'x=0.02..0.40/0.01 F=1..40/0.5', 'k = F/x', 'N/m', 3],
    ['gcse-forces', 'How much elastic potential energy is stored in a spring of spring constant {k} N/m stretched by {x} m?', 'k=20..800/10 x=0.02..0.30/0.01', 'E = 0.5*k*x^2', 'J', 3],
    ['gcse-moments', 'A uniform {L} m plank of weight {W} N rests on a pivot at its centre. A {F} N weight hangs {d} m from the pivot on one side. How far from the pivot on the other side must a {F2} N weight hang to balance it?', 'L=2..6/0.5 W=50..300/10 F=50..400/10 d=0.3..2.0/0.1 F2=60..500/10', 'd2 = F*d/F2', 'm', 3, 'd2<L/2'],
    ['gcse-newton', 'A resultant force of {F} N acts on a {m} kg trolley. What is its acceleration?', 'F=2..200/1 m=0.5..80/0.5', 'a = F/m', 'm/s²', 3],
    ['gcse-newton', 'What is the momentum of a {m} kg ball moving at {v} m/s?', 'm=0.05..8.0/0.05 v=1..40/0.5', 'p = m*v', 'kg m/s', 3],
    ['gcse-newton', 'A {m} kg trolley moving at {u} m/s hits a stationary {m2} kg trolley and they stick together. How fast do they move off?', 'm=0.5..4.0/0.1 u=0.5..6.0/0.1 m2=0.5..4.0/0.1', 'v = m*u/(m + m2)', 'm/s', 3],
    ['gcse-energy', 'Find the kinetic energy of a {m} kg cyclist and bike moving at {v} m/s.', 'm=50..120/1 v=2..15/0.5', 'Ek = 0.5*m*v^2', 'J', 3],
    ['gcse-energy', 'A {m} kg box is lifted {h} m onto a shelf. How much gravitational potential energy does it gain? (g = 9.8 N/kg)', 'm=0.5..40/0.5 h=0.2..3.0/0.1 g=9.8', 'Ep = m*g*h', 'J', 3],
    ['gcse-energy', 'A ball falls from rest through {h} m. If all its gravitational potential energy becomes kinetic energy, how fast is it moving? (g = 9.8 N/kg)', 'h=0.5..40/0.5 g=9.8', 'v = sqrt(2*g*h)', 'm/s', 3],
    ['gcse-work-power', 'A force of {F} N pushes a crate {d} m along the floor in the direction of the force. How much work is done?', 'F=10..500/5 d=0.5..20/0.5', 'W = F*d', 'J', 3],
    ['gcse-work-power', 'A motor transfers {E} J in {t} s. What is its power?', 'E=500..60000/500 t=5..300/5', 'P = E/t', 'W', 3],
    ['gcse-work-power', 'A {m} kg student runs up stairs {h} m high in {t} s. What is her useful power? (g = 9.8 N/kg)', 'm=40..90/1 h=2.0..12/0.5 t=3..20/0.5 g=9.8', 'P = m*g*h/t', 'W', 3],
    ['gcse-resources', 'A power station takes in {Ein} MJ of fuel energy each second and delivers {Eu} MJ of electrical energy. What is its efficiency?', 'Ein=500..3000/50 Eu=150..1800/50', 'efficiency = Eu/Ein*100', '%', 3, 'Eu<0.6*Ein'],
    ['gcse-resources', 'A wind turbine has an average power output of {P} kW. How much energy does it deliver in a day, in kWh?', 'P=50..3000/50', 'E = P*24', 'kWh', 3],
    ['gcse-pressure', 'What is the pressure due to the water at a depth of {h} m in a lake? (density of water 1000 kg/m³, g = 9.8 N/kg)', 'h=0.5..60/0.5 rho=1000 g=9.8', 'p = rho*g*h', 'Pa', 3],
    ['gcse-pressure', 'A {F} N force acts on a piston of area {A} m². What pressure does it produce in the fluid?', 'F=50..5000/50 A=0.002..0.05/0.001', 'p = F/A', 'Pa', 3],
    ['gcse-particles', 'A gas at {p1} kPa fills {V1} cm³. It is compressed slowly, at constant temperature, to {V2} cm³. What is its new pressure?', 'p1=80..200/5 V1=100..500/10 V2=40..400/10', 'p2 = p1*V1/V2', 'kPa', 3, 'V2<V1'],
    ['gcse-particles', 'A {m} kg block of metal has a volume of {V} m³. What is its density?', 'm=0.5..20/0.5 V=0.0002..0.003/0.0001', 'rho = m/V', 'kg/m³', 3],
    ['gcse-shc', 'How much energy is needed to raise the temperature of a {m} kg aluminium block by {dT} °C? (specific heat capacity of aluminium 900 J/kg °C)', 'm=0.2..5.0/0.1 dT=5..80/1 c=900', 'E = m*c*dT', 'J', 3],
    ['gcse-shc', 'Supplying {E} J to a {m} kg block raises its temperature by {dT} °C. What is the specific heat capacity of the metal?', 'E=2000..90000/500 m=0.5..2.0/0.1 dT=5..50/1', 'c = E/(m*dT)', 'J/kg °C', 3, 'c>100 && c<1500'],
    ['gcse-heat-transfer', 'How much energy is needed to melt {m} kg of ice at 0 °C? (specific latent heat of fusion of water 334 000 J/kg)', 'm=0.05..5.0/0.05 L=334000', 'E = m*L', 'J', 3],
    ['gcse-heat-transfer', 'How much energy turns {m} kg of water at 100 °C into steam? (specific latent heat of vaporisation 2.26 × 10⁶ J/kg)', 'm=0.05..2.0/0.05 L=2.26e6', 'E = m*L', 'J', 3],
    ['gcse-expansion', 'A gas is heated at constant volume from {T1} K to {T2} K. Its pressure was {p1} kPa. What is the new pressure?', 'T1=250..320/5 T2=330..600/10 p1=80..150/5', 'p2 = p1*T2/T1', 'kPa', 3],
    ['gcse-waves', 'A water wave has a frequency of {f} Hz and a wavelength of {lam} m. What is its speed?', 'f=0.2..8.0/0.1 lam=0.05..4.0/0.05', 'v = f*lam', 'm/s', 3],
    ['gcse-waves', 'A wave has a period of {T} s. What is its frequency?', 'T=0.002..0.5/0.002', 'f = 1/T', 'Hz', 3],
    ['gcse-reflection-refraction', 'Light passes from air into glass. The angle of incidence is {i}° and the angle of refraction is {r}°. Find the refractive index of the glass.', 'i=20..70/1 r=12..40/1', 'n = sin(i)/sin(r)', '', 3, 'n>1.3 && n<1.9'],
    ['gcse-reflection-refraction', 'Light enters a block of refractive index {n} at an angle of incidence of {i}°. What is the angle of refraction?', 'n=1.33..1.70/0.01 i=10..80/1', 'r = asin(sin(i)/n)', '°', 3],
    ['gcse-lenses', 'An object {ho} cm tall gives an image {hi} cm tall through a lens. What is the magnification?', 'ho=1.0..10/0.5 hi=0.5..30/0.5', 'M = hi/ho', '', 3],
    ['gcse-em-spectrum', 'A radio station broadcasts at {f} MHz. What is the wavelength of its waves? (speed of light 3.0 × 10⁸ m/s)', 'f=80..110/0.5 c=3e8', 'lam = c/(f*1e6)', 'm', 3],
    ['gcse-em-spectrum', 'Microwaves have a wavelength of {lam} cm. What is their frequency? (c = 3.0 × 10⁸ m/s)', 'lam=1.0..30/0.5 c=3e8', 'f = c/(lam/100)', 'Hz', 3],
    ['gcse-sound', 'You clap {d} m from a tall wall and hear the echo {t} s later. What is the speed of sound?', 'd=40..200/5 t=0.25..1.20/0.01', 'v = 2*d/t', 'm/s', 3, 'v>300 && v<380'],
    ['gcse-sound', 'Ultrasound of frequency {f} MHz travels through soft tissue at 1540 m/s. What is its wavelength?', 'f=1.0..15/0.5 v=1540', 'lam = v/(f*1e6)', 'm', 3],
    ['gcse-static', 'A charge of {Q} C flows off a charged dome in {t} s. What is the average current?', 'Q=0.000002..0.0001/0.000001 t=0.001..0.05/0.001', 'I = Q/t', 'A', 3],
    ['gcse-current-pd', 'A charge of {Q} C passes through a lamp and transfers {E} J of energy. What is the potential difference across the lamp?', 'Q=2..200/2 E=10..3000/10', 'V = E/Q', 'V', 3, 'V>0.5 && V<240'],
    ['gcse-current-pd', 'A current of {I} A flows for {t} minutes. How much charge flows?', 'I=0.2..10/0.1 t=1..60/1', 'Q = I*t*60', 'C', 3],
    ['gcse-circuits', 'What current flows through a {R} Ω resistor with {V} V across it?', 'R=2..470/1 V=1.5..24/0.5', 'I = V/R', 'A', 3],
    ['gcse-circuits', 'A thermistor has a resistance of {R} Ω and a current of {I} A through it. What is the potential difference across it?', 'R=50..5000/50 I=0.001..0.05/0.001', 'V = I*R', 'V', 3],
    ['gcse-power-cost', 'A {P} W kettle runs on the 230 V mains. What current does it draw?', 'P=500..3000/50 V=230', 'I = P/V', 'A', 3],
    ['gcse-power-cost', 'A {P} kW heater is on for {t} hours. Electricity costs {c}p per kWh. How much does that cost, in pence?', 'P=0.5..3.0/0.1 t=0.5..8.0/0.5 c=20..35/1', 'cost = P*t*c', 'p', 3],
    ['gcse-power-cost', 'A {R} Ω resistor carries a current of {I} A. At what rate does it transfer energy?', 'R=2..200/1 I=0.1..3.0/0.1', 'P = I^2*R', 'W', 3],
    ['gcse-series-parallel', 'A {R1} Ω and a {R2} Ω resistor are in series with a {V} V battery. What current flows?', 'R1=2..100/1 R2=2..100/1 V=1.5..24/0.5', 'I = V/(R1 + R2)', 'A', 3],
    ['gcse-series-parallel', 'A {R1} Ω and a {R2} Ω resistor are in series across {V} V. What is the potential difference across the {R1} Ω resistor?', 'R1=2..100/1 R2=2..100/1 V=3..24/0.5', 'V1 = V*R1/(R1 + R2)', 'V', 3],
    ['gcse-safety', 'A {P} W hairdryer runs on 230 V. What current does it draw, and so which of a 3 A, 5 A or 13 A fuse should its plug have? Give the current.', 'P=300..2500/50 V=230', 'I = P/V', 'A', 3],
    ['gcse-motor', 'A {L} m length of wire carrying {I} A lies at right angles to a magnetic field of {B} T. What force acts on it?', 'L=0.02..0.50/0.01 I=0.5..10/0.5 B=0.02..0.5/0.01', 'F = B*I*L', 'N', 3],
    ['gcse-electromagnets', 'A wire carrying {I} A at right angles to a magnetic field feels a force of {F} N on a {L} m length. What is the magnetic flux density?', 'I=1..10/0.5 F=0.01..0.5/0.01 L=0.05..0.40/0.01', 'B = F/(I*L)', 'T', 3, 'B<1.5'],
    ['gcse-transformer', 'A transformer steps {Vp} V down to {Vs} V. Its primary coil has {Np} turns. How many turns does its secondary have?', 'Vp=110..400/10 Vs=6..24/1 Np=500..4000/100', 'Ns = Np*Vs/Vp', 'turns', 3],
    ['gcse-transformer', 'A 100% efficient transformer has {Vp} V and {Ip} A in its primary coil and {Vs} V across its secondary. What current flows in the secondary?', 'Vp=100..400/10 Ip=0.1..2.0/0.1 Vs=5..50/1', 'Is = Vp*Ip/Vs', 'A', 3],
    ['gcse-induction', 'A generator coil gives a peak voltage of {V0} V when it turns {f} times a second. If the peak voltage is proportional to the rotation rate, what is it at {f2} turns a second?', 'V0=2..30/0.5 f=5..25/1 f2=10..60/1', 'V = V0*f2/f', 'V', 3],
    ['gcse-radioactivity', 'A sample has an activity of {A0} Bq. Its half-life is {t12} hours. What is its activity after {n} half-lives?', 'A0=400..8000/100 t12=2..12/1 n=1..5/1', 'A = A0/2^n', 'Bq', 3],
    ['gcse-radioactivity', 'A source has a half-life of {t12} days. What fraction of the original nuclei is left after {t} days? Give a decimal.', 't12=2..10/1 k=1..6/1', 't = k*t12; n = t/t12; fraction = 0.5^n', '', 3],
    ['gcse-atom', 'A nucleus has a mass number of {A} and an atomic number of {Z}. How many neutrons does it have?', 'A=12..240/1 Z=6..94/1', 'N = A - Z', '', 3, 'N>=Z && N<1.6*Z'],
    ['gcse-radiation', 'A worker receives {d} mSv a year at work. Over how many years would that add up to {D} mSv?', 'd=0.5..6.0/0.5 D=10..100/5', 'years = D/d', 'years', 3],
    ['gcse-orbits', 'A satellite moves in a circular orbit of radius {r} km and takes {T} minutes to go round once. What is its orbital speed?', 'r=6800..42000/100 T=90..1440/10', 'v = 2*pi*r*1000/(T*60)', 'm/s', 3, 'v>2500 && v<8200'],
    ['gcse-stars', 'A star’s light takes {t} years to reach us. How far away is it in metres? (1 light-year = 9.46 × 10¹⁵ m)', 't=4..2000/1 ly=9.46e15', 'd = t*ly', 'm', 3],
    ['gcse-solar-system', 'A comet is {d} AU from the Sun. How long does its light take to reach the Sun’s distance from it, in minutes? (1 AU = 1.50 × 10¹¹ m, c = 3.00 × 10⁸ m/s)', 'd=0.5..40/0.5 AU=1.5e11 c=3e8', 't = d*AU/c/60', 'min', 3],
    ['gcse-heat-transfer', 'A wall of area {A} m² loses heat at {P} W when the temperature difference across it is {dT} °C. What is the heat loss per square metre per degree (the U-value)?', 'A=4..30/1 P=100..2000/10 dT=5..25/1', 'U = P/(A*dT)', 'W/m² °C', 3, 'U>0.2 && U<6'],
  ]);
  /* GCSE exam-style, several parts */
  Q.add([
    ['gcse-suvat', 'A car starts from rest and accelerates uniformly at {a} m/s² for {t} s.', 'a=1.0..4.0/0.5 t=4..12/1 b=3..8/0.5', [['Calculate its final speed.', 'v = a*t', 'm/s'], ['Calculate the distance it travels in this time.', 's = 0.5*a*t^2', 'm'], ['It then brakes at {b} m/s². Calculate its braking distance.', 'sb = v^2/(2*b)', 'm']]],
    ['gcse-energy', 'A {m} kg skateboarder starts from rest at the top of a ramp {h} m high. Take g = 9.8 N/kg.', 'm=40..90/1 h=1.0..6.0/0.5 g=9.8', [['Calculate the gravitational potential energy she loses going down the ramp.', 'Ep = m*g*h', 'J'], ['Assuming no energy is wasted, calculate her speed at the bottom.', 'v = sqrt(2*Ep/m)', 'm/s'], ['Her actual speed at the bottom is 90% of this. Calculate the energy wasted.', 'wasted = Ep - 0.5*m*(0.9*v)^2', 'J']]],
    ['gcse-work-power', 'A crane lifts a {m} kg load through {h} m in {t} s at a steady speed. Take g = 9.8 N/kg.', 'm=200..2000/50 h=5..40/1 t=10..60/1 g=9.8 e=30..85/5', [['Calculate the work done on the load.', 'W = m*g*h', 'J'], ['Calculate the useful power output of the crane.', 'P = W/t', 'W'], ['The crane is {e}% efficient. Calculate the electrical power it takes in.', 'Pin = P/(e/100)', 'W']]],
    ['gcse-newton', 'A {m} kg trolley moving at {u} m/s collides with a stationary {m2} kg trolley. They stick together.', 'm=0.5..3.0/0.1 u=1.0..5.0/0.1 m2=0.5..3.0/0.1', [['Calculate the momentum of the first trolley before the collision.', 'p = m*u', 'kg m/s'], ['Calculate their speed just after the collision.', 'v = p/(m + m2)', 'm/s'], ['Calculate the kinetic energy lost in the collision.', 'lost = 0.5*m*u^2 - 0.5*(m + m2)*v^2', 'J']]],
    ['gcse-shc', 'An electric heater of power {P} W is used to heat a {m} kg block for {t} s. The temperature rises by {dT} °C.', 'P=20..60/2 m=0.5..2.0/0.1 t=300..900/30 dT=5..30/1', [['Calculate the energy supplied by the heater.', 'E = P*t', 'J'], ['Calculate the specific heat capacity of the block from these results.', 'c = E/(m*dT)', 'J/kg °C']], 'E/(m*dT)>300 && E/(m*dT)<2000'],
    ['gcse-circuits', 'A {R1} Ω resistor and a {R2} Ω resistor are connected in series to a {V} V battery.', 'R1=4..100/1 R2=4..100/1 V=3..24/1', [['Calculate the total resistance.', 'R = R1 + R2', 'Ω'], ['Calculate the current in the circuit.', 'I = V/R', 'A'], ['Calculate the power transferred in the {R1} Ω resistor.', 'P = I^2*R1', 'W']]],
    ['gcse-power-cost', 'A {P} W electric shower runs on the 230 V mains for {t} minutes a day.', 'P=7000..10500/500 t=5..20/1 V=230 c=20..35/1', [['Calculate the current it draws.', 'I = P/V', 'A'], ['Calculate the energy it transfers each day, in kWh.', 'E = P/1000*t/60', 'kWh'], ['Electricity costs {c}p per kWh. Calculate the cost of a year’s showers in pounds.', 'cost = E*c*365/100', 'pounds']]],
    ['gcse-waves', 'A wave on a rope has {n} complete waves along {L} m and the wave source vibrates {f} times per second.', 'n=2..8/1 L=2.0..12/0.5 f=1.0..6.0/0.5', [['Calculate the wavelength.', 'lam = L/n', 'm'], ['Calculate the wave speed.', 'v = f*lam', 'm/s'], ['Calculate the period of the wave.', 'T = 1/f', 's']]],
    ['gcse-pressure', 'A diver is {h} m below the surface of the sea. Sea water has density 1030 kg/m³; atmospheric pressure is 101 000 Pa; g = 9.8 N/kg.', 'h=2..40/1 rho=1030 g=9.8 p0=101000 A=0.010..0.040/0.002', [['Calculate the pressure due to the water above her.', 'pw = rho*g*h', 'Pa'], ['Calculate the total pressure on her.', 'p = pw + p0', 'Pa'], ['Her mask has a glass front of area {A} m². Calculate the force of the water on it.', 'F = p*A', 'N']]],
    ['gcse-radioactivity', 'A radioactive tracer has a half-life of {t12} hours. A patient is injected with a dose of activity {A0} MBq.', 't12=2..8/1 A0=100..800/20 k=2..4/1', [['Calculate the activity after {k} half-lives.', 'A = A0/2^k', 'MBq'], ['Calculate how many hours that is.', 't = k*t12', 'hours']]],
    ['gcse-transformer', 'A step-up transformer has {Np} turns on its primary and {Ns} turns on its secondary. The primary is connected to {Vp} V.', 'Np=100..500/10 Ns=1000..10000/100 Vp=12..230/1 Is=0.01..0.5/0.01', [['Calculate the output voltage.', 'Vs = Vp*Ns/Np', 'V'], ['The secondary current is {Is} A. Assuming 100% efficiency, calculate the primary current.', 'Ip = Vs*Is/Vp', 'A']]],
    ['gcse-forces', 'A spring of natural length {L0} cm is stretched to {L1} cm by a {F} N load, within its limit of proportionality.', 'L0=5..15/0.5 L1=8..30/0.5 F=1..20/0.5', [['Calculate the extension in metres.', 'x = (L1 - L0)/100', 'm'], ['Calculate the spring constant.', 'k = F/x', 'N/m'], ['Calculate the elastic potential energy stored.', 'E = 0.5*k*x^2', 'J']], 'L1>L0+2'],
  ]);
})();
/* Endless-practice templates: A-level and university physics. Constants: g 9.81, c 3.00e8, h 6.63e-34, e 1.60e-19, me 9.11e-31, G 6.67e-11, k 8.99e9, eps0 8.85e-12, mu0 4π×10⁻⁷, kB 1.38e-23, R 8.31, NA 6.02e23, sigma 5.67e-8. */
(function () {
  const Q = window.WL.qgen;
  Q.add([
    /* A-level */
    ['al-units', 'Express {x} kWh in joules.', 'x=0.5..50/0.5', 'E = x*3.6e6', 'J', 3],
    ['al-units', 'An electron is accelerated through {V} V. What energy does it gain, in joules? (e = 1.60 × 10⁻¹⁹ C)', 'V=50..20000/50 e=1.6e-19', 'E = e*V', 'J', 3],
    ['al-kinematics', 'A ball is thrown vertically upwards at {u} m/s. Taking g = 9.81 m/s², how high does it rise?', 'u=3..30/0.5 g=9.81', 'h = u^2/(2*g)', 'm', 3],
    ['al-kinematics', 'A car moving at {u} m/s accelerates at {a} m/s² for {t} s. How far does it travel in that time?', 'u=2..25/1 a=0.5..4.0/0.5 t=2..15/1', 's = u*t + 0.5*a*t^2', 'm', 3],
    ['al-projectile', 'A ball is kicked horizontally at {u} m/s off a cliff {h} m high. How far from the foot of the cliff does it land? (g = 9.81 m/s², no air resistance)', 'u=2..25/0.5 h=2..60/1 g=9.81', 't = sqrt(2*h/g); x = u*t', 'm', 3],
    ['al-projectile', 'A projectile is launched at {u} m/s at {th}° above the horizontal over level ground. What is its range? (g = 9.81 m/s²)', 'u=5..40/1 th=15..75/5 g=9.81', 'R = u^2*sin(2*th)/g', 'm', 3],
    ['al-projectile', 'A ball is thrown at {u} m/s at {th}° above the horizontal. What is its maximum height above the launch point? (g = 9.81 m/s²)', 'u=5..30/1 th=20..80/5 g=9.81', 'H = (u*sin(th))^2/(2*g)', 'm', 3],
    ['al-dynamics', 'A {m} kg block slides down a frictionless slope inclined at {th}° to the horizontal. What is its acceleration? (g = 9.81 m/s²)', 'm=0.5..10/0.5 th=10..60/1 g=9.81', 'a = g*sin(th)', 'm/s²', 3],
    ['al-dynamics', 'A {m} kg box is pushed across a floor by a horizontal {F} N force. The coefficient of friction is {mu}. Find its acceleration. (g = 9.81 m/s²)', 'm=2..40/1 F=20..300/5 mu=0.10..0.60/0.05 g=9.81', 'a = (F - mu*m*g)/m', 'm/s²', 3, 'F>mu*m*g*1.1'],
    ['al-momentum', 'A {m1} kg ball moving at {u1} m/s collides head-on with a {m2} kg ball moving at {u2} m/s in the opposite direction. They stick together. Find their common velocity, taking the first ball’s direction as positive.', 'm1=0.2..3.0/0.1 u1=1..8/0.5 m2=0.2..3.0/0.1 u2=1..8/0.5', 'v = (m1*u1 - m2*u2)/(m1 + m2)', 'm/s', 3],
    ['al-momentum', 'A {m} kg ball hits a wall at {u} m/s and rebounds at {v} m/s along the same line. The contact lasts {t} ms. Find the average force on the ball.', 'm=0.05..0.6/0.01 u=5..30/1 v=3..25/1 t=2..30/1', 'F = m*(u + v)/(t/1000)', 'N', 3],
    ['al-equilibrium', 'A {W} N picture hangs from two strings, each at {th}° to the vertical. Find the tension in each string.', 'W=5..200/5 th=10..70/5', 'T = W/(2*cos(th))', 'N', 3],
    ['al-equilibrium', 'A uniform {L} m beam of weight {W} N is supported at its ends. A {F} N load sits {d} m from the left end. Find the force from the right-hand support.', 'L=2..10/0.5 W=100..800/20 F=100..2000/50 d=0.5..9.5/0.5', 'R = (W*L/2 + F*d)/L', 'N', 3, 'd<L'],
    ['al-fluids', 'A {V} m³ block is fully submerged in water of density 1000 kg/m³. What upthrust acts on it? (g = 9.81 N/kg)', 'V=0.001..0.5/0.001 rho=1000 g=9.81', 'U = rho*V*g', 'N', 3],
    ['al-fluids', 'A steel ball of radius {r} mm falls at {v} cm/s through oil of viscosity {eta} Pa s. Find the viscous drag on it.', 'r=0.5..5.0/0.5 v=0.5..20/0.5 eta=0.10..1.50/0.05', 'F = 6*pi*eta*(r/1000)*(v/100)', 'N', 3],
    ['al-energy', 'A car’s engine provides a driving force of {F} N while it moves at a steady {v} m/s. What is the useful power output?', 'F=200..4000/50 v=5..35/1', 'P = F*v', 'W', 3],
    ['al-energy', 'A {m} kg cyclist freewheels down a {h} m drop and reaches {v} m/s at the bottom, starting from rest. How much energy was transferred to the surroundings? (g = 9.81 N/kg)', 'm=50..110/1 h=3..30/1 v=3..20/0.5 g=9.81', 'E = m*g*h - 0.5*m*v^2', 'J', 3, 'E>0'],
    ['al-materials', 'A wire {L} m long and {d} mm in diameter stretches by {x} mm under a {F} N load. Find the Young modulus.', 'L=0.5..3.0/0.1 d=0.2..1.0/0.05 x=0.2..3.0/0.1 F=10..200/5', 'A = pi*(d/2000)^2; E = F*L/(A*x/1000)', 'Pa', 3, 'E>5e10 && E<3e11'],
    ['al-materials', 'A rod of cross-sectional area {A} mm² carries a tension of {F} N. What is the stress in it?', 'A=0.5..50/0.5 F=10..5000/10', 'sigma = F/(A*1e-6)', 'Pa', 3],
    ['al-waves', 'Two points on a wave {dx} cm apart oscillate with a phase difference of {phi}°. The wave’s frequency is {f} Hz. Find its speed.', 'dx=2..40/1 phi=30..330/30 f=50..2000/50', 'lam = dx/100*360/phi; v = f*lam', 'm/s', 3],
    ['al-doppler', 'A galaxy’s spectral line, emitted at {l0} nm, is observed at {l} nm. Using Δλ/λ = v/c, find its recession speed. (c = 3.00 × 10⁸ m/s)', 'l0=400..700/1 l=401..760/1 c=3e8', 'v = (l - l0)/l0*c', 'm/s', 3, 'l>l0 && (l-l0)/l0<0.08'],
    ['al-polarisation', 'Polarised light of intensity {I0} W/m² passes through an analyser at {th}° to its plane of polarisation. What intensity gets through?', 'I0=10..500/10 th=0..90/5', 'I = I0*cos(th)^2', 'W/m²', 3],
    ['al-stationary', 'A string {L} m long under a tension of {T} N has a mass per unit length of {mu} kg/m. Find the frequency of its first harmonic.', 'L=0.3..2.0/0.05 T=10..200/5 mu=0.0005..0.01/0.0005', 'f = 1/(2*L)*sqrt(T/mu)', 'Hz', 3],
    ['al-interference', 'Light of wavelength {lam} nm passes through two slits {s} mm apart onto a screen {D} m away. What is the fringe spacing?', 'lam=400..700/10 s=0.1..1.0/0.05 D=0.5..4.0/0.1', 'w = lam*1e-9*D/(s/1000)', 'm', 3],
    ['al-interference', 'A diffraction grating has {N} lines per mm. At what angle is the {n}-order maximum for light of wavelength {lam} nm?', 'N=100..600/50 n=1..3/1 lam=400..700/10', 'd = 1e-3/N; th = asin(n*lam*1e-9/d)', '°', 3, 'n*lam*1e-9*N*1e3<0.98'],
    ['al-current', 'A copper wire of cross-section {A} mm² carries {I} A. Copper has 8.5 × 10²⁸ free electrons per m³. Find the drift velocity. (e = 1.60 × 10⁻¹⁹ C)', 'A=0.2..5.0/0.1 I=0.5..20/0.5 n=8.5e28 e=1.6e-19', 'v = I/(n*A*1e-6*e)', 'm/s', 3],
    ['al-resistivity', 'A wire {L} m long and {d} mm in diameter has a resistance of {R} Ω. Find the resistivity of its material.', 'L=0.2..2.0/0.1 d=0.20..1.00/0.05 R=0.5..20/0.5', 'A = pi*(d/2000)^2; rho = R*A/L', 'Ω m', 3, 'rho>1e-8 && rho<5e-6'],
    ['al-dc-circuits', 'A cell of emf {E} V and internal resistance {r} Ω is connected to a {R} Ω resistor. Find the current.', 'E=1.5..12/0.5 r=0.2..3.0/0.1 R=1..50/1', 'I = E/(R + r)', 'A', 3],
    ['al-dc-circuits', 'A cell of emf {E} V and internal resistance {r} Ω delivers {I} A. What is the terminal potential difference?', 'E=1.5..12/0.5 r=0.1..2.0/0.1 I=0.1..3.0/0.1', 'V = E - I*r', 'V', 3, 'V>0.3*E'],
    ['al-dc-circuits', 'A {R1} Ω and a {R2} Ω resistor are in parallel. What is their combined resistance?', 'R1=2..470/1 R2=2..470/1', 'R = 1/(1/R1 + 1/R2)', 'Ω', 3],
    ['al-potential-divider', 'A potential divider of {R1} Ω (top) and {R2} Ω (bottom) is connected across {Vin} V. What is the output across the bottom resistor?', 'R1=100..10000/100 R2=100..10000/100 Vin=3..15/0.5', 'Vout = Vin*R2/(R1 + R2)', 'V', 3],
    ['al-particles', 'Find the specific charge of a nucleus with {Z} protons and {A} nucleons. (e = 1.60 × 10⁻¹⁹ C, nucleon mass 1.67 × 10⁻²⁷ kg)', 'Z=1..92/1 A=1..238/1 e=1.6e-19 mn=1.67e-27', 'sc = Z*e/(A*mn)', 'C/kg', 3, 'A>=Z && A<=2.6*Z+2'],
    ['al-circular', 'A {m} kg mass moves in a circle of radius {r} m at {v} m/s. What centripetal force acts on it?', 'm=0.1..5.0/0.1 r=0.2..5.0/0.1 v=1..15/0.5', 'F = m*v^2/r', 'N', 3],
    ['al-circular', 'A wheel turns at {n} revolutions per minute. What is its angular speed?', 'n=10..3000/10', 'w = 2*pi*n/60', 'rad/s', 3],
    ['al-gravfields', 'A planet has mass {M} × 10²⁴ kg and radius {R} × 10⁶ m. What is the gravitational field strength at its surface? (G = 6.67 × 10⁻¹¹ N m² kg⁻²)', 'M=0.1..20/0.1 R=1.0..20/0.1 G=6.67e-11', 'g = G*M*1e24/(R*1e6)^2', 'N/kg', 3, 'g>0.5 && g<40'],
    ['al-gravfields', 'A satellite orbits a planet of mass {M} × 10²⁴ kg at a radius of {r} × 10⁶ m. Find its orbital period. (G = 6.67 × 10⁻¹¹ N m² kg⁻²)', 'M=0.5..10/0.5 r=4..50/1 G=6.67e-11', 'T = 2*pi*sqrt((r*1e6)^3/(G*M*1e24))', 's', 3],
    ['al-gravfields', 'What is the escape velocity from the surface of a planet of mass {M} × 10²⁴ kg and radius {R} × 10⁶ m? (G = 6.67 × 10⁻¹¹)', 'M=0.1..20/0.1 R=1..20/0.5 G=6.67e-11', 'v = sqrt(2*G*M*1e24/(R*1e6))', 'm/s', 3],
    ['al-temperature', 'A {P} W immersion heater warms {m} kg of water from {T1} °C to {T2} °C. Ignoring losses, how long does it take? (c = 4180 J/kg K)', 'P=500..3000/100 m=0.5..5.0/0.5 T1=10..25/1 T2=40..95/5 c=4180', 't = m*c*(T2 - T1)/P', 's', 3],
    ['al-ideal-gas', 'How many moles of gas are in a {V} m³ container at {p} kPa and {T} K? (R = 8.31 J/mol K)', 'V=0.001..0.5/0.001 p=50..500/10 T=250..600/10 R=8.31', 'n = p*1000*V/(R*T)', 'mol', 3],
    ['al-ideal-gas', 'What is the mean kinetic energy of a gas molecule at {T} K? (k = 1.38 × 10⁻²³ J/K)', 'T=100..1500/10 k=1.38e-23', 'E = 1.5*k*T', 'J', 3],
    ['al-ideal-gas', 'Find the root-mean-square speed of molecules of mass {m} × 10⁻²⁶ kg at {T} K. (k = 1.38 × 10⁻²³ J/K)', 'm=0.3..8.0/0.1 T=200..1200/10 k=1.38e-23', 'vrms = sqrt(3*k*T/(m*1e-26))', 'm/s', 3],
    ['al-thermodynamics', 'A gas absorbs {Q} J of heat and does {W} J of work on its surroundings. What is the change in its internal energy?', 'Q=50..2000/10 W=10..1500/10', 'DU = Q - W', 'J', 3],
    ['al-thermodynamics', 'A gas expands at a constant pressure of {p} kPa from {V1} L to {V2} L. How much work does it do?', 'p=50..400/10 V1=1..20/0.5 V2=2..40/0.5', 'W = p*1000*(V2 - V1)/1000', 'J', 3, 'V2>V1'],
    ['al-shm', 'A {m} kg mass oscillates on a spring of stiffness {k} N/m. What is its period?', 'm=0.05..5.0/0.05 k=5..500/5', 'T = 2*pi*sqrt(m/k)', 's', 3],
    ['al-shm', 'A simple pendulum is {L} m long. What is its period? (g = 9.81 m/s²)', 'L=0.1..5.0/0.05 g=9.81', 'T = 2*pi*sqrt(L/g)', 's', 3],
    ['al-shm', 'An oscillator has amplitude {A} cm and frequency {f} Hz. What is its maximum speed?', 'A=0.5..20/0.5 f=0.2..10/0.1', 'v = 2*pi*f*A/100', 'm/s', 3],
    ['al-damping', 'A damped oscillator’s amplitude falls by the same fraction each cycle: from {A0} mm to {A1} mm in one cycle. What will it be after {n} more cycles?', 'A0=10..100/1 A1=5..95/1 n=2..8/1', 'r = A1/A0; A = A1*r^n', 'mm', 3, 'A1<0.95*A0 && A1>0.4*A0'],
    ['al-efields', 'Two point charges of {q1} μC and {q2} μC are {r} cm apart. What force does each exert on the other? (k = 8.99 × 10⁹ N m² C⁻²)', 'q1=0.5..20/0.5 q2=0.5..20/0.5 r=1..50/1 k=8.99e9', 'F = k*q1*1e-6*q2*1e-6/(r/100)^2', 'N', 3],
    ['al-efields', 'Parallel plates {d} mm apart have {V} V between them. What is the field strength between them?', 'd=1..50/1 V=10..5000/10', 'E = V/(d/1000)', 'V/m', 3],
    ['al-capacitors', 'A {C} μF capacitor is charged to {V} V. How much energy does it store?', 'C=1..4700/1 V=1..50/0.5', 'E = 0.5*C*1e-6*V^2', 'J', 3],
    ['al-capacitors', 'A {C} μF capacitor charged to {V0} V discharges through a {R} kΩ resistor. What is the p.d. across it after {t} s?', 'C=10..2200/10 V0=3..24/0.5 R=1..100/1 t=0.5..30/0.5', 'tau = R*1000*C*1e-6; V = V0*exp(-t/tau)', 'V', 3, 't/tau<4'],
    ['al-capacitors', 'What is the time constant of a {C} μF capacitor discharging through a {R} kΩ resistor?', 'C=1..4700/1 R=0.5..470/0.5', 'tau = R*1000*C*1e-6', 's', 3],
    ['al-bfields', 'An electron moves at {v} × 10⁶ m/s at right angles to a {B} mT magnetic field. Find the radius of its circular path. (mₑ = 9.11 × 10⁻³¹ kg, e = 1.60 × 10⁻¹⁹ C)', 'v=0.5..20/0.5 B=0.5..20/0.5 me=9.11e-31 e=1.6e-19', 'r = me*v*1e6/(e*B/1000)', 'm', 3],
    ['al-bfields', 'A proton moves at {v} × 10⁵ m/s at right angles to a {B} T field. What force acts on it? (e = 1.60 × 10⁻¹⁹ C)', 'v=1..50/1 B=0.05..2.0/0.05 e=1.6e-19', 'F = B*e*v*1e5', 'N', 3],
    ['al-induction', 'A {L} m rod moves at {v} m/s at right angles to a {B} T field. What emf is induced across it?', 'L=0.05..2.0/0.05 v=0.5..20/0.5 B=0.01..1.5/0.01', 'emf = B*L*v', 'V', 3],
    ['al-induction', 'The flux through a {N}-turn coil falls uniformly from {P1} mWb to zero in {t} ms. What emf is induced?', 'N=10..500/10 P1=0.5..20/0.5 t=5..500/5', 'emf = N*P1/1000/(t/1000)', 'V', 3],
    ['al-ac', 'An alternating supply has a peak voltage of {V0} V. What is its rms voltage?', 'V0=5..400/5', 'Vrms = V0/sqrt(2)', 'V', 3],
    ['al-ac', 'An oscilloscope trace shows {n} complete cycles across {div} divisions at a timebase of {tb} ms/div. What is the frequency?', 'n=1..5/1 div=4..10/1 tb=0.1..10/0.1', 'T = div*tb/1000/n; f = 1/T', 'Hz', 3],
    ['al-photons', 'What is the energy of a photon of wavelength {lam} nm, in electronvolts? (h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m/s, e = 1.60 × 10⁻¹⁹ C)', 'lam=100..1000/10 h=6.63e-34 c=3e8 e=1.6e-19', 'E = h*c/(lam*1e-9)/e', 'eV', 3],
    ['al-photoelectric', 'Light of frequency {f} × 10¹⁴ Hz falls on a metal with a work function of {phi} eV. What is the maximum kinetic energy of the photoelectrons, in eV? (h = 6.63 × 10⁻³⁴ J s, e = 1.60 × 10⁻¹⁹ C)', 'f=5..15/0.1 phi=1.8..4.5/0.1 h=6.63e-34 e=1.6e-19', 'Ek = h*f*1e14/e - phi', 'eV', 3, 'Ek>0.05'],
    ['al-photoelectric', 'A metal has a work function of {phi} eV. What is its threshold frequency? (h = 6.63 × 10⁻³⁴ J s, e = 1.60 × 10⁻¹⁹ C)', 'phi=1.8..5.5/0.1 h=6.63e-34 e=1.6e-19', 'f0 = phi*e/h', 'Hz', 3],
    ['al-spectra', 'An electron drops between levels {E2} eV and {E1} eV in an atom. What wavelength of light is emitted? (h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m/s, e = 1.60 × 10⁻¹⁹ C)', 'E2=-5.0..-0.5/0.05 E1=-14..-2/0.1 h=6.63e-34 c=3e8 e=1.6e-19', 'DE = (E2 - E1)*e; lam = h*c/DE', 'm', 3, 'E2-E1>1'],
    ['al-nuclear', 'A nucleus has a mass defect of {dm} u. What is its binding energy in MeV? (1 u ≡ 931.5 MeV)', 'dm=0.002..2.0/0.001 k=931.5', 'E = dm*k', 'MeV', 3],
    ['al-nuclear', 'What is the radius of a nucleus of nucleon number {A}, using R = R₀A^(1/3) with R₀ = 1.2 fm?', 'A=1..250/1 R0=1.2', 'R = R0*A^(1/3)', 'fm', 3],
    ['al-decay', 'An isotope has a half-life of {t12} s. What is its decay constant?', 't12=1..10000/1', 'lam = ln(2)/t12', 's⁻¹', 3],
    ['al-decay', 'A sample contains {N0} × 10¹⁸ nuclei of an isotope with a half-life of {t12} hours. How many remain after {t} hours?', 'N0=1..50/1 t12=1..48/1 t=1..100/1', 'N = N0*1e18*exp(-ln(2)*t/t12)', 'nuclei', 3],
    ['al-medical', 'X-rays are attenuated in tissue with an attenuation coefficient of {mu} cm⁻¹. What fraction of the intensity passes through {x} cm?', 'mu=0.05..1.0/0.05 x=0.5..20/0.5', 'f = exp(-mu*x)', '', 3, 'f>0.001'],
    ['al-medical', 'An ultrasound pulse returns from an organ boundary {t} μs after it is sent. The speed of sound in tissue is 1540 m/s. How deep is the boundary?', 't=10..200/2 v=1540', 'd = v*t*1e-6/2', 'm', 3],
    ['al-astro', 'A star’s spectrum peaks at {lam} nm. What is its surface temperature? (Wien’s constant 2.90 × 10⁻³ m K)', 'lam=100..1500/10 b=2.9e-3', 'T = b/(lam*1e-9)', 'K', 3],
    ['al-astro', 'A star has radius {R} × 10⁸ m and surface temperature {T} K. What is its luminosity? (σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴)', 'R=0.5..50/0.5 T=3000..30000/500 sigma=5.67e-8', 'L = 4*pi*(R*1e8)^2*sigma*T^4', 'W', 3],
    ['al-cosmology', 'A galaxy recedes at {v} km/s. Using H₀ = 70 km s⁻¹ Mpc⁻¹, how far away is it?', 'v=500..30000/100 H0=70', 'd = v/H0', 'Mpc', 3],
    /* university, years 1–2 */
    ['y1-work-energy', 'A spring of stiffness {k} N/m is compressed by {x} cm and launches a {m} g puck across frictionless ice. How fast does the puck leave?', 'k=50..2000/10 x=1..20/0.5 m=10..500/10', 'v = x/100*sqrt(k/(m/1000))', 'm/s', 3],
    ['y1-systems', 'A {m1} kg and a {m2} kg mass sit on a line at x = {x1} m and x = {x2} m. Where is their centre of mass?', 'm1=0.5..10/0.5 m2=0.5..10/0.5 x1=-5..5/0.5 x2=-5..10/0.5', 'X = (m1*x1 + m2*x2)/(m1 + m2)', 'm', 3],
    ['y1-angular-momentum', 'A skater spins at {w1} rad/s with moment of inertia {I1} kg m². She pulls in her arms to {I2} kg m². What is her new angular speed?', 'w1=1..10/0.5 I1=2.0..6.0/0.1 I2=0.8..3.0/0.1', 'w2 = I1*w1/I2', 'rad/s', 3, 'I2<I1'],
    ['y1-rotation', 'A uniform disc of mass {M} kg and radius {R} m spins at {w} rad/s. What is its rotational kinetic energy?', 'M=0.5..50/0.5 R=0.05..1.0/0.05 w=1..300/1', 'I = 0.5*M*R^2; E = 0.5*I*w^2', 'J', 3],
    ['y1-rotation', 'A solid sphere rolls without slipping at {v} m/s. Its mass is {m} kg. What is its total kinetic energy?', 'v=0.5..10/0.5 m=0.1..10/0.1', 'E = 0.5*m*v^2*(1 + 2/5)', 'J', 3],
    ['y1-fluids', 'Water flows at {v1} m/s through a pipe of diameter {d1} cm, which narrows to {d2} cm. How fast does it flow in the narrow part?', 'v1=0.2..5.0/0.1 d1=2..20/0.5 d2=0.5..10/0.5', 'v2 = v1*(d1/d2)^2', 'm/s', 3, 'd2<d1'],
    ['y1-oscillators', 'A {m} kg mass on a spring of stiffness {k} N/m has a damping constant b = {b} kg/s. Find the quality factor Q = √(mk)/b.', 'm=0.1..5/0.1 k=10..500/10 b=0.01..2.0/0.01', 'Q = sqrt(m*k)/b', '', 3, 'Q>1'],
    ['y1-coupled', 'Two identical pendulums of length {L} m are coupled by a weak spring. One normal mode has period {T2} s; the in-phase mode has the pendulum period. What is the beat period? (g = 9.81 m/s²)', 'L=0.3..2.0/0.05 k=1.02..1.20/0.01 g=9.81', 'T1 = 2*pi*sqrt(L/g); T2 = T1/k; Tb = 1/(1/T2 - 1/T1)', 's', 3],
    ['y1-wave-eq', 'A rope of mass per unit length {mu} kg/m is under {T} N of tension. How fast do waves travel along it?', 'mu=0.01..2.0/0.01 T=5..500/5', 'v = sqrt(T/mu)', 'm/s', 3],
    ['y1-optics', 'Light of wavelength {lam} nm passes through a single slit {a} μm wide. At what angle is the first minimum?', 'lam=400..700/10 a=2..50/1', 'th = asin(lam*1e-9/(a*1e-6))', '°', 3],
    ['y1-optics', 'A telescope objective has diameter {D} cm. Using the Rayleigh criterion θ = 1.22λ/D, what is its angular resolution at {lam} nm, in radians?', 'D=5..400/5 lam=400..700/10', 'th = 1.22*lam*1e-9/(D/100)', 'rad', 3],
    ['y1-gauss', 'A long straight wire carries {lam} nC per metre. Use Gauss’s law to find the field {r} cm from it. (ε₀ = 8.85 × 10⁻¹² F/m)', 'lam=1..500/1 r=0.5..50/0.5 eps0=8.85e-12', 'E = lam*1e-9/(2*pi*eps0*r/100)', 'V/m', 3],
    ['y1-potential', 'What is the potential {r} cm from a point charge of {Q} nC? (k = 8.99 × 10⁹ N m² C⁻²)', 'r=1..100/1 Q=0.5..100/0.5 k=8.99e9', 'V = k*Q*1e-9/(r/100)', 'V', 3],
    ['y1-magnetostatics', 'A long straight wire carries {I} A. What is the magnetic field {r} cm from it? (μ₀ = 4π × 10⁻⁷ T m/A)', 'I=0.5..100/0.5 r=0.5..50/0.5', 'B = 4*pi*1e-7*I/(2*pi*r/100)', 'T', 3],
    ['y1-magnetostatics', 'A long solenoid has {n} turns per metre and carries {I} A. What is the field inside it? (μ₀ = 4π × 10⁻⁷ T m/A)', 'n=200..10000/100 I=0.1..10/0.1', 'B = 4*pi*1e-7*n*I', 'T', 3],
    ['y1-faraday', 'A {N}-turn coil of area {A} cm² spins at {f} Hz in a {B} T field. What is the peak emf?', 'N=10..500/10 A=5..400/5 f=5..60/1 B=0.01..1.0/0.01', 'emf = N*B*A*1e-4*2*pi*f', 'V', 3],
    ['y1-maxwell', 'A capacitor with circular plates of area {A} cm² has its field rising at {r} × 10¹² V m⁻¹ s⁻¹. What displacement current flows? (ε₀ = 8.85 × 10⁻¹² F/m)', 'A=1..500/1 r=0.1..10/0.1 eps0=8.85e-12', 'Id = eps0*A*1e-4*r*1e12', 'A', 3],
    ['y1-sr', 'What is the Lorentz factor for a speed of {b}c?', 'b=0.10..0.999/0.001', 'gam = 1/sqrt(1 - b^2)', '', 4],
    ['y1-sr', 'A muon lives {t0} μs in its own frame. How long does it live in the lab when moving at {b}c?', 't0=1..10/0.1 b=0.5..0.999/0.001', 'gam = 1/sqrt(1 - b^2); t = gam*t0', 'μs', 3],
    ['y1-sr', 'A rod is {L0} m long at rest. How long is it measured to be when it moves along its length at {b}c?', 'L0=0.5..100/0.5 b=0.3..0.99/0.01', 'L = L0*sqrt(1 - b^2)', 'm', 3],
    ['y1-rel-dynamics', 'An electron is accelerated through {V} kV. What is its Lorentz factor? (mₑc² = 0.511 MeV)', 'V=10..10000/10 mc2=0.511', 'gam = 1 + V/1000/mc2', '', 4],
    ['y1-rel-dynamics', 'A proton has kinetic energy {K} GeV. What is its total energy? (mₚc² = 0.938 GeV)', 'K=0.1..1000/0.1 mc2=0.938', 'E = K + mc2', 'GeV', 4],
    ['y1-thermo', 'A heat engine works between {Th} K and {Tc} K. What is its maximum (Carnot) efficiency?', 'Th=400..1500/10 Tc=250..400/5', 'eff = (1 - Tc/Th)*100', '%', 3, 'Tc<Th'],
    ['y1-entropy', 'A {m} kg block of water is heated from {T1} K to {T2} K. What is its entropy change? (c = 4180 J/kg K)', 'm=0.1..5.0/0.1 T1=273..320/1 T2=330..373/1 c=4180', 'DS = m*c*ln(T2/T1)', 'J/K', 3],
    ['y1-entropy', '{Q} J of heat flows reversibly into a reservoir at {T} K. What is the reservoir’s entropy change?', 'Q=10..10000/10 T=200..1000/10', 'DS = Q/T', 'J/K', 3],
    ['y1-old-quantum', 'In the Bohr model, what is the energy of hydrogen’s n = {n} level, in eV?', 'n=1..8/1', 'E = -13.6/n^2', 'eV', 3],
    ['y1-old-quantum', 'X-rays scatter from electrons through {th}°. What is the Compton shift in wavelength? (h/mₑc = 2.43 × 10⁻¹² m)', 'th=10..180/5 lc=2.43e-12', 'Dlam = lc*(1 - cos(th))', 'm', 3],
    ['y1-qm-intro', 'What is the de Broglie wavelength of an electron moving at {v} × 10⁶ m/s? (h = 6.63 × 10⁻³⁴ J s, mₑ = 9.11 × 10⁻³¹ kg)', 'v=0.1..20/0.1 h=6.63e-34 me=9.11e-31', 'lam = h/(me*v*1e6)', 'm', 3],
    ['y1-qm-intro', 'An electron is confined to a region {dx} nm wide. What is the minimum uncertainty in its momentum, from Δp ≥ ħ/(2Δx)? (ħ = 1.05 × 10⁻³⁴ J s)', 'dx=0.05..10/0.05 hbar=1.05e-34', 'Dp = hbar/(2*dx*1e-9)', 'kg m/s', 3],
    ['y2-central-force', 'A satellite in a circular orbit of radius {r} km round a body with GM = {GM} × 10¹⁴ m³ s⁻². What is its orbital speed?', 'r=6500..45000/100 GM=1..10/0.1', 'v = sqrt(GM*1e14/(r*1000))', 'm/s', 3],
    ['y2-boltzmann', 'Two energy levels are {dE} eV apart. At {T} K, what is the ratio of the upper population to the lower (equal degeneracies)? (k = 8.62 × 10⁻⁵ eV/K)', 'dE=0.01..0.5/0.01 T=50..3000/50 k=8.62e-5', 'ratio = exp(-dE/(k*T))', '', 3, 'ratio>1e-6'],
    ['y2-partition', 'A two-level system has levels 0 and {dE} meV. What is its partition function at {T} K? (k = 8.62 × 10⁻⁵ eV/K)', 'dE=1..100/1 T=10..1000/10 k=8.62e-5', 'Z = 1 + exp(-dE/1000/(k*T))', '', 4],
    ['y2-blackbody', 'What is the total power radiated per square metre by a black body at {T} K? (σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴)', 'T=200..6000/50 sigma=5.67e-8', 'P = sigma*T^4', 'W/m²', 3],
    ['y2-infinite-well', 'An electron is in an infinite well {L} nm wide. What is the energy of its n = {n} state, in eV? (h = 6.63 × 10⁻³⁴ J s, mₑ = 9.11 × 10⁻³¹ kg, e = 1.60 × 10⁻¹⁹ C)', 'L=0.1..5.0/0.1 n=1..5/1 h=6.63e-34 me=9.11e-31 e=1.6e-19', 'E = n^2*h^2/(8*me*(L*1e-9)^2)/e', 'eV', 3],
    ['y2-step-barrier', 'An electron with energy {E} eV meets a barrier {V} eV high and {a} nm thick. Estimate the transmission as T ≈ e^(−2κa). (mₑ = 9.11 × 10⁻³¹ kg, ħ = 1.05 × 10⁻³⁴ J s, e = 1.60 × 10⁻¹⁹ C)', 'E=0.5..5/0.1 V=2..10/0.5 a=0.1..1.5/0.05 me=9.11e-31 hbar=1.05e-34 e=1.6e-19', 'kappa = sqrt(2*me*(V - E)*e)/hbar; T = exp(-2*kappa*a*1e-9)', '', 3, 'V>E+0.5 && T>1e-8'],
    ['y2-qho', 'A quantum harmonic oscillator has ħω = {hw} meV. What is the energy of its n = {n} state, in meV?', 'hw=1..200/1 n=0..10/1', 'E = (n + 0.5)*hw', 'meV', 3],
    ['y2-em-waves', 'An electromagnetic wave in vacuum has an electric field amplitude of {E0} V/m. What is the amplitude of its magnetic field? (c = 3.00 × 10⁸ m/s)', 'E0=1..1000/1 c=3e8', 'B0 = E0/c', 'T', 3],
    ['y2-em-waves', 'A laser beam of power {P} mW has a cross-section of {A} mm². What is its intensity?', 'P=0.5..100/0.5 A=0.5..20/0.5', 'I = P/1000/(A*1e-6)', 'W/m²', 3],
    ['y2-4vectors', 'A particle has energy {E} GeV and momentum {p} GeV/c. What is its rest mass, in GeV/c²?', 'E=1..100/0.5 p=0.5..99/0.5', 'm = sqrt(E^2 - p^2)', 'GeV/c²', 3, 'E>p'],
    ['y2-multipoles', 'A dipole of moment {p} × 10⁻¹² C m. What is its potential {r} cm away along its axis? (k = 8.99 × 10⁹ N m² C⁻²)', 'p=0.1..10/0.1 r=1..50/1 k=8.99e9', 'V = k*p*1e-12/(r/100)^2', 'V', 3],
    /* years 3–4 */
    ['y3-hydrogen', 'What wavelength does hydrogen emit in the transition from n = {n2} to n = {n1}? (R∞ = 1.097 × 10⁷ m⁻¹)', 'n1=1..4/1 n2=2..8/1 R=1.097e7', 'inv = R*(1/n1^2 - 1/n2^2); lam = 1/inv', 'm', 4, 'n2>n1'],
    ['y3-spin', 'At what frequency do free electron spins resonate in a {B} T field? (g μ_B/h = 28.0 GHz/T)', 'B=0.01..10/0.01 k=28.0', 'f = k*B', 'GHz', 3],
    ['y3-spin', 'What is the energy splitting of a free electron’s spin states in a {B} T field, in μeV? (g μ_B = 1.16 × 10⁻⁴ eV/T)', 'B=0.01..10/0.01 k=1.16e-4', 'DE = k*B*1e6', 'μeV', 3],
    ['y3-tunnelling', 'An α particle tunnels with probability per attempt {P}. It hits the barrier {f} × 10²¹ times a second. What is the nucleus’s mean lifetime?', 'P=1e-38..1e-30/1e-38 f=0.5..5/0.5', 'tau = 1/(P*f*1e21)', 's', 3],
    ['y3-lasers', 'A {P} mW laser emits light of wavelength {lam} nm. How many photons does it emit each second? (h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m/s)', 'P=0.5..500/0.5 lam=400..1600/10 h=6.63e-34 c=3e8', 'N = P/1000*lam*1e-9/(h*c)', 's⁻¹', 3],
    ['y3-nuclear-particle', 'A resonance has a width of {G} MeV. What is its mean lifetime? (ħ = 6.58 × 10⁻²² MeV s)', 'G=0.001..500/0.001 hbar=6.58e-22', 'tau = hbar/G', 's', 3],
    ['y3-solids', 'An X-ray beam of wavelength {lam} nm reflects from crystal planes in first order at a glancing angle of {th}°. What is the plane spacing? (Bragg: 2d sin θ = nλ)', 'lam=0.05..0.25/0.005 th=5..60/0.5', 'd = lam/(2*sin(th))', 'nm', 3],
    ['y3-semiconductors', 'A semiconductor has a band gap of {Eg} eV. What is the longest wavelength of light it can absorb? (hc = 1240 eV nm)', 'Eg=0.2..3.5/0.05 hc=1240', 'lam = hc/Eg', 'nm', 3],
    ['y3-radiation', 'An electron accelerates at {a} × 10¹⁸ m/s². What power does it radiate (Larmor)? (P = e²a²/(6πε₀c³), e = 1.60 × 10⁻¹⁹ C, ε₀ = 8.85 × 10⁻¹², c = 3.00 × 10⁸ m/s)', 'a=0.1..100/0.1 e=1.6e-19 eps0=8.85e-12 c=3e8', 'P = e^2*(a*1e18)^2/(6*pi*eps0*c^3)', 'W', 3],
    ['y4-gr', 'What is the Schwarzschild radius of a black hole of {M} solar masses? (G = 6.67 × 10⁻¹¹, c = 3.00 × 10⁸ m/s, solar mass 1.99 × 10³⁰ kg)', 'M=1..1e9/1 G=6.67e-11 c=3e8 Ms=1.99e30', 'rs = 2*G*M*Ms/c^2', 'm', 3],
    ['y4-schwarzschild', 'A clock hovers at r = {k} r_s outside a black hole. By what factor does it run slow compared with a distant clock?', 'k=1.05..20/0.05', 'factor = sqrt(1 - 1/k)', '', 4],
    ['y4-friedmann', 'For a Hubble constant of {H} km s⁻¹ Mpc⁻¹, what is the critical density? (G = 6.67 × 10⁻¹¹, 1 Mpc = 3.09 × 10²² m)', 'H=50..100/1 G=6.67e-11 Mpc=3.09e22', 'H0 = H*1000/Mpc; rho = 3*H0^2/(8*pi*G)', 'kg/m³', 3],
    ['y4-early-universe', 'At what temperature is kT equal to {E} MeV? (k = 8.62 × 10⁻¹¹ MeV/K)', 'E=0.001..1000/0.001 k=8.62e-11', 'T = E/k', 'K', 3],
    ['y4-quantum-info', 'A qubit is in the state √{p}|0⟩ + √(1 − {p})|1⟩. Measured {N} times, how many 0 results do you expect?', 'p=0.05..0.95/0.05 N=100..10000/100', 'n0 = p*N', '', 3],
  ]);
  /* A-level exam-style */
  Q.add([
    ['al-projectile', 'A ball is projected from level ground at {u} m/s at {th}° above the horizontal. Ignore air resistance; g = 9.81 m/s².', 'u=8..30/1 th=20..70/5 g=9.81', [['Calculate the initial vertical component of velocity.', 'uy = u*sin(th)', 'm/s'], ['Calculate the time of flight.', 'T = 2*uy/g', 's'], ['Calculate the horizontal range.', 'R = u*cos(th)*T', 'm']]],
    ['al-momentum', 'A {m1} kg trolley moving at {u1} m/s collides with a stationary {m2} kg trolley. After the collision the first trolley moves on at {v1} m/s in the same direction.', 'm1=0.5..3.0/0.1 u1=2..8/0.5 m2=0.5..3.0/0.1 v1=0.0..1.5/0.1', [['Calculate the velocity of the second trolley after the collision.', 'v2 = m1*(u1 - v1)/m2', 'm/s'], ['Calculate the kinetic energy before the collision.', 'Kb = 0.5*m1*u1^2', 'J'], ['Calculate the kinetic energy after the collision.', 'Ka = 0.5*m1*v1^2 + 0.5*m2*v2^2', 'J']], 'Ka<Kb && v2>v1'],
    ['al-materials', 'A steel wire {L} m long and {d} mm in diameter hangs vertically. A {m} kg mass is hung on it. The Young modulus of steel is 2.0 × 10¹¹ Pa; g = 9.81 N/kg.', 'L=1.0..3.0/0.1 d=0.3..1.2/0.05 m=1..20/0.5 E=2.0e11 g=9.81', [['Calculate the stress in the wire.', 'sigma = m*g/(pi*(d/2000)^2)', 'Pa'], ['Calculate the strain.', 'strain = sigma/E', ''], ['Calculate the extension.', 'x = strain*L', 'm']]],
    ['al-dc-circuits', 'A battery of emf {E} V and internal resistance {r} Ω is connected to a {R} Ω resistor.', 'E=3..12/0.5 r=0.2..2.0/0.1 R=2..30/1', [['Calculate the current.', 'I = E/(R + r)', 'A'], ['Calculate the terminal p.d.', 'V = I*R', 'V'], ['Calculate the power wasted in the battery.', 'P = I^2*r', 'W']]],
    ['al-capacitors', 'A {C} μF capacitor is charged to {V0} V and then discharged through a {R} kΩ resistor.', 'C=100..2200/100 V0=5..24/1 R=1..50/1', [['Calculate the initial charge.', 'Q0 = C*1e-6*V0', 'C'], ['Calculate the time constant.', 'tau = R*1000*C*1e-6', 's'], ['Calculate the p.d. after one time constant has passed and then the energy still stored.', 'V1 = V0*exp(-1); E1 = 0.5*C*1e-6*V1^2', 'J']]],
    ['al-gravfields', 'A satellite of mass {m} kg is in a circular orbit {h} km above a planet of mass {M} × 10²⁴ kg and radius {R} km. G = 6.67 × 10⁻¹¹ N m² kg⁻².', 'm=100..5000/100 h=200..2000/50 M=1..10/0.5 R=3000..7000/100 G=6.67e-11', [['Calculate the radius of the orbit in metres.', 'r = (R + h)*1000', 'm'], ['Calculate the orbital speed.', 'v = sqrt(G*M*1e24/r)', 'm/s'], ['Calculate the orbital period.', 'T = 2*pi*r/v', 's']]],
    ['al-shm', 'A {m} kg mass on a spring oscillates vertically with amplitude {A} cm. The spring constant is {k} N/m.', 'm=0.1..2.0/0.1 A=1..10/0.5 k=10..200/5', [['Calculate the period.', 'T = 2*pi*sqrt(m/k)', 's'], ['Calculate the maximum speed.', 'vmax = 2*pi/T*A/100', 'm/s'], ['Calculate the maximum acceleration.', 'amax = (2*pi/T)^2*A/100', 'm/s²']]],
    ['al-ideal-gas', 'A sealed cylinder holds {V} × 10⁻³ m³ of an ideal gas at {p} kPa and {T} K. R = 8.31 J mol⁻¹ K⁻¹; Nₐ = 6.02 × 10²³ mol⁻¹.', 'V=1..50/1 p=80..300/10 T=250..400/5 T2=410..600/10 R=8.31 NA=6.02e23', [['Calculate the number of moles.', 'n = p*1000*V*1e-3/(R*T)', 'mol'], ['Calculate the number of molecules.', 'N = n*NA', ''], ['The gas is heated at constant volume to {T2} K. Calculate the new pressure.', 'p2 = p*T2/T', 'kPa']]],
    ['al-photoelectric', 'Ultraviolet light of wavelength {lam} nm falls on a metal with work function {phi} eV. h = 6.63 × 10⁻³⁴ J s; c = 3.00 × 10⁸ m/s; e = 1.60 × 10⁻¹⁹ C.', 'lam=150..350/10 phi=2.0..4.5/0.1 h=6.63e-34 c=3e8 e=1.6e-19', [['Calculate the photon energy in eV.', 'Ephot = h*c/(lam*1e-9)/e', 'eV'], ['Calculate the maximum kinetic energy of the photoelectrons in eV.', 'Ek = Ephot - phi', 'eV'], ['Calculate the stopping potential.', 'Vs = Ek', 'V']], 'Ek>0.2'],
    ['al-decay', 'A sample of an isotope with half-life {t12} days has an initial activity of {A0} kBq.', 't12=2..30/1 A0=10..900/10 t=1..60/1', [['Calculate the decay constant in s⁻¹.', 'lam = ln(2)/(t12*86400)', 's⁻¹'], ['Calculate the number of undecayed nuclei at the start.', 'N0 = A0*1000/lam', ''], ['Calculate the activity after {t} days.', 'A = A0*exp(-ln(2)*t/t12)', 'kBq']]],
    ['al-bfields', 'Electrons are accelerated from rest through {V} V and enter a uniform {B} mT magnetic field at right angles to it. mₑ = 9.11 × 10⁻³¹ kg; e = 1.60 × 10⁻¹⁹ C.', 'V=100..5000/100 B=0.5..10/0.5 me=9.11e-31 e=1.6e-19', [['Calculate the speed of the electrons.', 'v = sqrt(2*e*V/me)', 'm/s'], ['Calculate the radius of their path.', 'r = me*v/(e*B/1000)', 'm']]],
    ['al-interference', 'Light from a laser passes through a grating with {N} lines per mm. The second-order maxima are at {th}° to the straight-through direction.', 'N=100..600/50 th=10..60/0.5', [['Calculate the grating spacing.', 'd = 1e-3/N', 'm'], ['Calculate the wavelength.', 'lam = d*sin(th)/2', 'm'], ['Calculate the highest order that can be seen.', 'nmax = floor(d/lam)', '']], 'lam>4e-7 && lam<7e-7'],
  ]);
})();
/* Endless-practice templates: mathematics, from GCSE to university. */
(function () {
  const Q = window.WL.qgen;
  Q.add([
    ['m-number', 'Increase {x} by {p}%.', 'x=20..2000/10 p=1..60/1', 'y = x*(1 + p/100)', '', 4],
    ['m-number', 'A price falls from £{a} to £{b}. What is the percentage decrease?', 'a=20..500/5 b=10..480/5', 'pct = (a - b)/a*100', '%', 3, 'b<a'],
    ['m-fractions', 'Work out {a}/{b} of {x}.', 'a=1..7/1 b=2..9/1 x=12..360/12', 'y = a/b*x', '', 4, 'a<b'],
    ['m-indices', 'Evaluate {a}^{n} × {a}^{m} as a single number.', 'a=2..5/1 n=1..4/1 m=1..3/1', 'y = a^(n + m)', '', 6],
    ['m-estimation', 'A rectangle is {a} cm by {b} cm, each measured to the nearest centimetre. What is the largest possible area?', 'a=3..40/1 b=3..40/1', 'A = (a + 0.5)*(b + 0.5)', 'cm²', 4],
    ['m-rates', '£{P} is invested at {r}% compound interest per year. What is it worth after {n} years, in pounds?', 'P=100..10000/100 r=1..8/0.5 n=2..15/1', 'A = P*(1 + r/100)^n', '', 4],
    ['m-rates', 'A car travels {d} km in {t} hours. What is its average speed in km/h?', 'd=20..600/10 t=0.5..8/0.25', 'v = d/t', 'km/h', 3],
    ['m-algebra', 'Find the value of 3x² − 5x + 2 when x = {x}.', 'x=-6..6/0.5', 'y = 3*x^2 - 5*x + 2', '', 4],
    ['m-expressions', 'Expand and simplify (x + {a})(x + {b}), then give the constant term.', 'a=1..12/1 b=1..12/1', 'c = a*b', '', 3],
    ['m-equations', 'Solve {a}x + {b} = {c}.', 'a=2..12/1 b=1..40/1 c=41..200/1', 'x = (c - b)/a', '', 4],
    ['m-equations', 'Solve the simultaneous equations x + y = {s} and x − y = {d}. Give x.', 's=4..60/1 d=0..30/1', 'x = (s + d)/2', '', 4, 'd<s'],
    ['m-quadratics', 'Solve x² {+b}x {+c} = 0, giving the larger root to 3 significant figures.', 'b=-12..12/1 c=-30..20/1', 'x = (-b + sqrt(b^2 - 4*c))/2', '', 3, 'b^2-4*c>0 && b!=0 && c!=0'],
    ['m-quadratics', 'Find the minimum value of x² {+b}x {+c} by completing the square.', 'b=-12..12/2 c=-20..30/1', 'ymin = c - b^2/4', '', 4, 'b!=0 && c!=0'],
    ['m-inequalities', 'Solve {a}x − {b} > {c}. Give the boundary value of x.', 'a=2..9/1 b=1..30/1 c=1..60/1', 'x = (c + b)/a', '', 4],
    ['m-sequences', 'An arithmetic sequence starts {a}, {a2}, … with common difference {d}. Find the {n}th term.', 'a=-10..20/1 d=2..9/1 n=10..60/1', 'a2 = a + d; t = a + (n - 1)*d', '', 5],
    ['m-sequences', 'Find the sum of the first {n} terms of the arithmetic series with first term {a} and common difference {d}.', 'a=1..20/1 d=1..10/1 n=5..50/1', 'S = n/2*(2*a + (n - 1)*d)', '', 5],
    ['m-proportion', 'y is directly proportional to x². When x = {x1}, y = {y1}. Find y when x = {x2}.', 'x1=1..10/1 y1=2..200/2 x2=2..20/1', 'y = y1*(x2/x1)^2', '', 4],
    ['m-proportion', 'y is inversely proportional to x. When x = {x1}, y = {y1}. Find y when x = {x2}.', 'x1=1..20/1 y1=2..200/2 x2=2..40/1', 'y = y1*x1/x2', '', 4],
    ['m-graphs', 'Find the gradient of the line through ({x1}, {y1}) and ({x2}, {y2}).', 'x1=-8..8/1 y1=-10..10/1 x2=-8..12/1 y2=-10..15/1', 'm = (y2 - y1)/(x2 - x1)', '', 4, 'x2!=x1'],
    ['m-graphs', 'Find the distance between ({x1}, {y1}) and ({x2}, {y2}).', 'x1=-8..8/1 y1=-10..10/1 x2=-8..12/1 y2=-10..15/1', 'd = sqrt((x2 - x1)^2 + (y2 - y1)^2)', '', 4],
    ['m-curves', 'At what x does the turning point of y = x² − {b}x + {c} lie?', 'b=2..20/2 c=1..30/1', 'x = b/2', '', 3],
    ['m-geometry', 'The interior angles of a regular polygon with {n} sides are each how many degrees?', 'n=5..20/1', 'A = 180*(n - 2)/n', '°', 4],
    ['m-similarity', 'Two similar shapes have lengths in the ratio 1 : {k}. The smaller has area {A} cm². What is the area of the larger?', 'k=1.5..6/0.5 A=2..80/1', 'B = A*k^2', 'cm²', 4],
    ['m-mensuration', 'Find the volume of a cylinder of radius {r} cm and height {h} cm.', 'r=0.5..20/0.5 h=1..50/0.5', 'V = pi*r^2*h', 'cm³', 4],
    ['m-mensuration', 'Find the surface area of a sphere of radius {r} cm.', 'r=0.5..30/0.5', 'A = 4*pi*r^2', 'cm²', 4],
    ['m-mensuration', 'Find the volume of a cone of radius {r} cm and height {h} cm.', 'r=1..20/0.5 h=1..40/0.5', 'V = pi*r^2*h/3', 'cm³', 4],
    ['m-circle-theorems', 'An angle at the circumference is {a}°. What is the angle at the centre subtended by the same arc?', 'a=10..89/1', 'c = 2*a', '°', 3],
    ['m-trig', 'In a right-angled triangle the hypotenuse is {h} cm and one angle is {th}°. Find the side opposite that angle.', 'h=2..40/0.5 th=10..80/1', 'o = h*sin(th)', 'cm', 4],
    ['m-trig', 'A right-angled triangle has legs {o} cm (opposite) and {a} cm (adjacent). Find the angle.', 'o=1..30/0.5 a=1..30/0.5', 'th = atan(o/a)', '°', 4],
    ['m-trig-rules', 'A triangle has sides {a} cm and {b} cm with an included angle of {C}°. Find the third side.', 'a=2..30/0.5 b=2..30/0.5 C=10..170/1', 'c = sqrt(a^2 + b^2 - 2*a*b*cos(C))', 'cm', 4],
    ['m-trig-rules', 'Find the area of a triangle with sides {a} cm and {b} cm and an included angle of {C}°.', 'a=2..30/0.5 b=2..30/0.5 C=10..170/1', 'A = 0.5*a*b*sin(C)', 'cm²', 4],
    ['m-transformations', 'A shape of area {A} cm² is enlarged by scale factor {k}. What is the area of the image?', 'A=1..60/1 k=-4..4/0.5', 'B = A*k^2', 'cm²', 4, 'k!=0'],
    ['m-probability-gcse', 'A fair dice is rolled {n} times. What is the probability of getting no sixes?', 'n=1..12/1', 'P = (5/6)^n', '', 4],
    ['m-statistics', 'The mean of {n} numbers is {m}. One number, {x}, is removed. What is the mean of the rest?', 'n=5..40/1 m=10..90/1 x=1..100/1', 'mean = (n*m - x)/(n - 1)', '', 4],
    ['m-functions', 'f(x) = {a}x {+b} and g(x) = x². Find fg({x}).', 'a=2..9/1 b=-10..10/1 x=-5..6/1', 'y = a*x^2 + b', '', 4, 'b!=0'],
    ['m-circles', 'A circle has equation (x − {a})² + (y − {b})² = {r2}. What is its radius?', 'a=-9..9/1 b=-9..9/1 r2=4..169/1', 'r = sqrt(r2)', '', 4],
    ['m-radians', 'Find the length of an arc of a circle of radius {r} cm subtending {th} radians at the centre.', 'r=1..30/0.5 th=0.2..6.2/0.1', 's = r*th', 'cm', 4],
    ['m-radians', 'Find the area of a sector of radius {r} cm and angle {th} radians.', 'r=1..30/0.5 th=0.2..6.2/0.1', 'A = 0.5*r^2*th', 'cm²', 4],
    ['m-radians', 'Convert {d}° to radians.', 'd=5..355/5', 'r = d*pi/180', 'rad', 4],
    ['m-series', 'Find the sum to infinity of the geometric series with first term {a} and common ratio {r}.', 'a=1..100/1 r=-0.9..0.9/0.05', 'S = a/(1 - r)', '', 4, 'abs(r)>0.01'],
    ['m-series', 'Find the sum of the first {n} terms of the geometric series {a} + {a}×{r} + …', 'a=1..20/1 r=1.1..3/0.1 n=3..15/1', 'S = a*(r^n - 1)/(r - 1)', '', 4],
    ['m-exp-log', 'Solve {a}^x = {b}.', 'a=2..9/1 b=3..500/1', 'x = ln(b)/ln(a)', '', 4],
    ['m-exp-log', 'A population grows as P = {P0}e^({k}t). What is P when t = {t}?', 'P0=100..5000/100 k=0.01..0.5/0.01 t=1..30/1', 'P = P0*exp(k*t)', '', 4],
    ['m-differentiation', 'Find the gradient of y = {a}x^{n} at x = {x0}.', 'a=1..9/1 n=2..5/1 x0=-3..4/0.5', 'm = a*n*x0^(n - 1)', '', 4],
    ['m-differentiation', 'Find the gradient of y = {a}e^({k}x) at x = {x0}.', 'a=1..9/1 k=0.1..2/0.1 x0=0..3/0.5', 'm = a*k*exp(k*x0)', '', 4],
    ['m-integration', 'Evaluate the integral of {k}x^{n} from x = {a} to x = {b}.', 'k=1..9/1 n=1..4/1 a=0..3/1 b=1..6/1', 'I = k*(b^(n + 1) - a^(n + 1))/(n + 1)', '', 5, 'b>a'],
    ['m-integration', 'Find the area under y = {k}/x between x = {a} and x = {b}.', 'k=1..10/1 a=1..5/0.5 b=2..20/0.5', 'A = k*ln(b/a)', '', 4, 'b>a'],
    ['m-numerical-roots', 'Use one step of Newton–Raphson on f(x) = x² − {N}, starting from x₀ = {x0}. What is x₁?', 'N=2..99/1 x0=1..10/0.5', 'x1 = x0 - (x0^2 - N)/(2*x0)', '', 5],
    ['m-vectors', 'Find the magnitude of the vector ({x}, {y}, {z}).', 'x=-9..9/1 y=-9..9/1 z=-9..9/1', 'm = sqrt(x^2 + y^2 + z^2)', '', 4],
    ['m-vectors', 'Find the angle between ({a1}, {a2}) and ({b1}, {b2}).', 'a1=-6..6/1 a2=-6..6/1 b1=-6..6/1 b2=-6..6/1', 'th = acos((a1*b1 + a2*b2)/(sqrt(a1^2 + a2^2)*sqrt(b1^2 + b2^2)))', '°', 4, '(a1!=0||a2!=0)&&(b1!=0||b2!=0)'],
    ['m-ode1', 'dy/dt = {k}y with y(0) = {y0}. Find y when t = {t}.', 'k=-0.8..0.8/0.05 y0=1..100/1 t=0.5..10/0.5', 'y = y0*exp(k*t)', '', 4, 'k!=0'],
    ['m-statics', 'A block rests on a rough slope that is just on the point of slipping at {th}°. What is the coefficient of friction?', 'th=5..45/1', 'mu = tan(th)', '', 3],
    ['m-kinematics-calc', 'A particle has velocity v = {a}t² + {b}t m/s. How far does it travel from t = 0 to t = {T} s?', 'a=1..6/0.5 b=0..10/1 T=1..10/0.5', 's = a*T^3/3 + b*T^2/2', 'm', 4],
    ['m-newton-mech', 'A {m} kg particle is pulled by a {F} N force against a {R} N resistance. Find its acceleration.', 'm=0.5..20/0.5 F=5..200/5 R=1..150/1', 'a = (F - R)/m', 'm s⁻²', 3, 'F>R'],
    ['m-momentum-mech', 'A {m} kg particle moving at {u} m/s receives an impulse of {J} N s in its direction of motion. Find its new speed.', 'm=0.5..10/0.5 u=1..20/0.5 J=1..50/1', 'v = u + J/m', 'm s⁻¹', 3],
    ['m-work-energy-mech', 'A {m} kg particle slides {d} m down a smooth slope inclined at {th}°, from rest. Find its speed. (g = 9.8)', 'm=0.5..10/0.5 d=1..20/0.5 th=10..60/1 g=9.8', 'v = sqrt(2*g*d*sin(th))', 'm s⁻¹', 3],
    ['m-combinatorics', 'In how many ways can {r} people be chosen from {n}?', 'n=5..20/1 r=2..8/1', 'N = comb(n, r)', '', 6, 'r<n'],
    ['m-combinatorics', 'In how many ways can {n} different books be arranged on a shelf?', 'n=3..10/1', 'N = fact(n)', '', 7],
    ['m-probability-al', 'X ~ B({n}, {p}). Find P(X = {k}).', 'n=5..20/1 p=0.1..0.9/0.05 k=0..10/1', 'P = comb(n, k)*p^k*(1 - p)^(n - k)', '', 4, 'k<=n'],
    ['m-discrete-rv', 'X ~ B({n}, {p}). Find the variance of X.', 'n=5..100/1 p=0.05..0.95/0.05', 'V = n*p*(1 - p)', '', 4],
    ['m-normal', 'X ~ N({mu}, {s}²). Find the z-score of x = {x}.', 'mu=10..100/1 s=1..20/0.5 x=5..130/1', 'z = (x - mu)/s', '', 4],
    ['m-poisson', 'X ~ Po({lam}). Find P(X = {k}).', 'lam=0.5..10/0.5 k=0..10/1', 'P = exp(-lam)*lam^k/fact(k)', '', 4],
    ['m-sampling', 'A sample of {n} has a mean of {m} from a population with standard deviation {s}. What is the standard error of the mean?', 'n=4..400/4 m=10..100/1 s=1..30/0.5', 'se = s/sqrt(n)', '', 4],
    ['m-complex', 'Find the modulus of z = {a} + {b}i.', 'a=-9..9/1 b=-9..9/1', 'r = sqrt(a^2 + b^2)', '', 4, 'a!=0||b!=0'],
    ['m-complex', 'Find the argument of z = {a} + {b}i, in degrees, for a > 0.', 'a=1..9/1 b=-9..9/1', 'th = atan(b/a)', '°', 4],
    ['m-de-moivre', 'z has modulus {r}. What is the modulus of z^{n}?', 'r=0.5..3/0.1 n=2..8/1', 'R = r^n', '', 4],
    ['m-matrix-transforms', 'Find the determinant of the matrix with rows ({a}, {b}) and ({c}, {d}).', 'a=-9..9/1 b=-9..9/1 c=-9..9/1 d=-9..9/1', 'det = a*d - b*c', '', 4],
    ['m-matrices', 'A 2 × 2 matrix has trace {t} and determinant {d}. Find its larger eigenvalue.', 't=-10..10/1 d=-20..20/1', 'lam = (t + sqrt(t^2 - 4*d))/2', '', 4, 't^2-4*d>0'],
    ['m-eigen', 'A 2 × 2 symmetric matrix has diagonal entries {a} and {c} and off-diagonal entry {b}. Find its larger eigenvalue.', 'a=-5..9/1 b=-5..5/1 c=-5..9/1', 'lam = (a + c)/2 + sqrt(((a - c)/2)^2 + b^2)', '', 4],
    ['m-hyperbolic', 'Evaluate cosh({x}).', 'x=0..4/0.1', 'y = (exp(x) + exp(-x))/2', '', 4],
    ['m-summation', 'Evaluate the sum of r² from r = 1 to {n}.', 'n=3..100/1', 'S = n*(n + 1)*(2*n + 1)/6', '', 6],
    ['m-polar', 'Convert the polar point (r = {r}, θ = {th}°) to Cartesian and give x.', 'r=1..10/0.5 th=0..355/5', 'x = r*cos(th)', '', 4],
    ['m-taylor', 'Use the Maclaurin series to second order, eˣ ≈ 1 + x + x²/2, to estimate e^{x}.', 'x=-0.5..0.5/0.05', 'y = 1 + x + x^2/2', '', 5],
    ['m-limits', 'Evaluate (1 + 1/n)^n for n = {n}. (It tends to e as n grows.)', 'n=1..1000/1', 'y = (1 + 1/n)^n', '', 5],
    ['m-gamma', 'Evaluate Γ({n}).', 'n=1..12/1', 'G = fact(n - 1)', '', 8],
    ['m-fourier-series', 'The square wave of height ±1 has Fourier sine coefficients bₙ = 4/(nπ) for odd n. Find b_{n}.', 'k=0..10/1', 'n = 2*k + 1; b = 4/(n*pi)', '', 4],
    ['m-probability', 'Two independent events have probabilities {p} and {q}. What is the probability that at least one happens?', 'p=0.05..0.95/0.05 q=0.05..0.95/0.05', 'P = 1 - (1 - p)*(1 - q)', '', 4],
    ['m-random-walks', 'A symmetric random walk takes {N} steps of length {l} m. What is the root-mean-square distance from the start?', 'N=10..10000/10 l=0.1..2/0.1', 'r = l*sqrt(N)', 'm', 4],
    ['m-monte-carlo', 'A Monte Carlo estimate uses {N} samples. By what factor does its statistical error fall if the samples are increased to {M}?', 'N=100..10000/100 M=400..1000000/100', 'factor = sqrt(M/N)', '', 4, 'M>N'],
    ['m-numerical', 'Use the trapezium rule with one strip to estimate the integral of x² from {a} to {b}.', 'a=0..3/0.5 b=1..6/0.5', 'T = (b - a)*(a^2 + b^2)/2', '', 4, 'b>a'],
    ['m-finite-difference', 'Estimate the derivative of x³ at x = {x} using a central difference with h = {h}.', 'x=0.5..4/0.5 h=0.01..0.5/0.01', 'd = ((x + h)^3 - (x - h)^3)/(2*h)', '', 5],
    ['m-elastic', 'A {m} kg mass hangs at rest on an elastic string of natural length {l} m and modulus {lam} N. Find the extension. (g = 9.8)', 'm=0.1..5/0.1 l=0.2..2/0.1 lam=5..200/5 g=9.8', 'e = m*g*l/lam', 'm', 4],
    ['m-vertical-circle', 'A particle on a string of length {l} m moves in a vertical circle. What is the least speed at the top for the string to stay taut? (g = 9.8)', 'l=0.2..5/0.1 g=9.8', 'v = sqrt(g*l)', 'm s⁻¹', 4],
    ['m-restitution', 'A ball hits the ground at {u} m/s and rebounds with coefficient of restitution {e}. Find the rebound speed.', 'u=1..20/0.5 e=0.1..0.95/0.05', 'v = e*u', 'm s⁻¹', 3],
    ['m-fm-projectiles', 'A ball is thrown horizontally at {u} m/s from {h} m above level ground. How far does it travel horizontally before landing? (g = 9.8)', 'u=2..30/1 h=0.5..50/0.5 g=9.8', 't = sqrt(2*h/g); x = u*t', 'm', 4],
  ]);
})();
/* Key terms: KS3 and GCSE. Definitions in the wording exam mark schemes accept. */
(function () {
  const K = ((window.WL = window.WL || {}).keyterms = window.WL.keyterms || {});
  Object.assign(K, {
    'ks3-energy': [['Energy store', 'A way energy is held: kinetic, gravitational potential, elastic, thermal, chemical, nuclear.'], ['Conservation of energy', 'Energy cannot be created or destroyed, only transferred between stores.'], ['Dissipated', 'Spread out to the surroundings, usually as heating, so it is no longer useful.'], ['Efficiency', 'Useful energy output ÷ total energy input.'], ['Joule', 'The unit of energy, J.']],
    'ks3-forces': [['Force', 'A push or pull on an object, measured in newtons (N).'], ['Resultant force', 'The single force that has the same effect as all the forces acting.'], ['Balanced forces', 'Forces whose resultant is zero: the motion does not change.'], ['Weight', 'The force of gravity on a mass: W = mg.'], ['Friction', 'A force that opposes motion between surfaces in contact.']],
    'ks3-speed': [['Speed', 'Distance travelled per unit time: speed = distance ÷ time.'], ['Average speed', 'Total distance ÷ total time taken.'], ['Distance–time graph', 'A graph whose gradient is the speed.'], ['Relative motion', 'Motion measured from a chosen viewpoint, which may itself be moving.']],
    'ks3-moments': [['Moment', 'The turning effect of a force: force × perpendicular distance from the pivot.'], ['Pivot', 'The point about which an object turns.'], ['Principle of moments', 'In balance, total clockwise moment = total anticlockwise moment.'], ['Lever', 'A rigid bar turning about a pivot, used to multiply force.']],
    'ks3-pressure': [['Pressure', 'Force per unit area: p = F ÷ A, in pascals (Pa).'], ['Pascal', 'One newton per square metre.'], ['Atmospheric pressure', 'The pressure of the air above us, about 100 000 Pa at sea level.'], ['Liquid pressure', 'Increases with depth and acts in all directions.']],
    'ks3-density': [['Density', 'Mass per unit volume: ρ = m ÷ V.'], ['Displacement', 'Measuring the volume of an irregular object by the liquid it pushes aside.'], ['Float', 'An object floats if its density is less than that of the liquid.'], ['Volume', 'The space an object takes up, in cm³ or m³.']],
    'ks3-particles': [['Particle model', 'Matter is made of tiny particles in constant motion.'], ['Diffusion', 'The spreading of particles from high to low concentration.'], ['Melting point', 'The temperature at which a solid turns into a liquid.'], ['Brownian motion', 'The random jiggling of small particles hit by moving molecules.'], ['Change of state', 'Melting, freezing, boiling, condensing: mass is conserved.']],
    'ks3-heat': [['Temperature', 'How hot something is: a measure of the average energy of its particles.'], ['Conduction', 'Energy transfer through a solid by vibrating particles.'], ['Convection', 'Energy transfer by the movement of a heated fluid.'], ['Radiation', 'Energy transfer by infrared waves; needs no medium.'], ['Insulator', 'A material that transfers energy slowly by heating.']],
    'ks3-waves': [['Amplitude', 'The maximum displacement from the rest position.'], ['Wavelength', 'The distance from one point on a wave to the same point on the next.'], ['Frequency', 'The number of waves passing a point each second, in hertz (Hz).'], ['Transverse wave', 'Oscillations at right angles to the direction of travel.'], ['Longitudinal wave', 'Oscillations parallel to the direction of travel.']],
    'ks3-sound': [['Vibration', 'A rapid back-and-forth movement that makes sound.'], ['Pitch', 'How high or low a sound is; set by its frequency.'], ['Loudness', 'Set by the amplitude of the sound wave.'], ['Echo', 'A reflected sound.'], ['Vacuum', 'Empty space: sound cannot travel through it.']],
    'ks3-light': [['Reflection', 'Light bouncing off a surface: angle of incidence = angle of reflection.'], ['Refraction', 'The change of direction of light as it changes speed between materials.'], ['Normal', 'A line at right angles to a surface where a ray meets it.'], ['Luminous', 'Giving out its own light.'], ['Opaque', 'Letting no light through.']],
    'ks3-colour': [['Spectrum', 'The colours of white light spread out by a prism.'], ['Dispersion', 'The splitting of white light into colours because each refracts by a different amount.'], ['Filter', 'Lets through only some colours and absorbs the rest.'], ['Primary colours of light', 'Red, green and blue.']],
    'ks3-circuits': [['Current', 'The rate of flow of charge, in amperes (A).'], ['Potential difference', 'The energy transferred per unit charge, in volts (V).'], ['Resistance', 'Opposition to current: R = V ÷ I, in ohms (Ω).'], ['Series circuit', 'Components in one loop: the same current everywhere.'], ['Conductor', 'A material that lets charge flow easily.']],
    'ks3-parallel': [['Parallel circuit', 'Components on separate branches: each gets the full potential difference.'], ['Branch', 'One of the separate paths in a parallel circuit.'], ['Junction', 'A point where current splits or joins; current in = current out.'], ['Ammeter', 'Measures current; connected in series.'], ['Voltmeter', 'Measures potential difference; connected in parallel.']],
    'ks3-magnets': [['Magnetic field', 'The region around a magnet where a magnetic material feels a force.'], ['Field line', 'Shows the direction of the force on a north pole: from north to south.'], ['Electromagnet', 'A coil of wire that is magnetic only when current flows.'], ['Magnetic material', 'Iron, steel, nickel or cobalt.']],
    'ks3-space': [['Gravity', 'The attractive force between masses.'], ['Gravitational field strength', 'The weight per kilogram: g, in N/kg.'], ['Orbit', 'The curved path of a body around another, held by gravity.'], ['Satellite', 'An object that orbits a larger body.'], ['Light-year', 'The distance light travels in a year.']],
    'ks3-tides-eclipses': [['Tide', 'The rise and fall of the sea caused by the Moon’s and Sun’s gravity.'], ['Solar eclipse', 'The Moon passes between the Sun and Earth, blocking the Sun.'], ['Lunar eclipse', 'Earth passes between the Sun and Moon, so the Moon is in Earth’s shadow.'], ['Umbra', 'The region of total shadow.']],
    'ks3-solar-system': [['Solar System', 'The Sun and everything that orbits it.'], ['Planet', 'A large body orbiting a star that has cleared its orbit.'], ['Asteroid', 'A rocky body orbiting the Sun, smaller than a planet.'], ['Galaxy', 'A huge group of billions of stars held by gravity.']],
    'ks3-earth': [['Crust', 'The thin, solid outer layer of the Earth.'], ['Mantle', 'The hot, slowly flowing rock below the crust.'], ['Core', 'The iron–nickel centre of the Earth: liquid outer core, solid inner core.'], ['Seismic wave', 'A wave through the Earth from an earthquake.']],
    'ks3-climate': [['Greenhouse effect', 'Gases in the atmosphere absorb infrared from the Earth and re-emit it, warming the surface.'], ['Greenhouse gas', 'Carbon dioxide, methane, water vapour: they absorb infrared.'], ['Climate', 'The long-term pattern of weather in a region.'], ['Carbon footprint', 'The total greenhouse gas emitted by an activity or person.']],
    'gcse-measurement': [['Scalar', 'A quantity with size only, e.g. mass, speed, energy.'], ['Vector', 'A quantity with size and direction, e.g. velocity, force, displacement.'], ['Resolution', 'The smallest change an instrument can show.'], ['Random error', 'Unpredictable scatter in readings; reduced by repeating and averaging.'], ['Systematic error', 'A consistent offset in every reading, e.g. a zero error.'], ['Precision', 'How closely repeated readings agree.'], ['Accuracy', 'How close a result is to the true value.']],
    'gcse-suvat': [['Displacement', 'The distance moved in a stated direction; a vector.'], ['Velocity', 'Speed in a stated direction; a vector.'], ['Acceleration', 'The rate of change of velocity: a = Δv ÷ t.'], ['Uniform acceleration', 'Acceleration that stays constant.'], ['Free fall', 'Falling with gravity the only force: a = 9.8 m/s².']],
    'gcse-mass-weight': [['Mass', 'The amount of matter in an object, in kg; the same everywhere.'], ['Weight', 'The force of gravity on an object: W = mg, in newtons.'], ['Gravitational field strength', 'Weight per unit mass, g, in N/kg.'], ['Centre of mass', 'The point at which the weight may be taken to act.']],
    'gcse-forces': [['Resultant force', 'The single force equivalent to all the forces acting on an object.'], ['Free-body diagram', 'A diagram of one object showing every force on it as an arrow.'], ['Elastic deformation', 'A change of shape that is undone when the force is removed.'], ['Limit of proportionality', 'The point beyond which extension is no longer proportional to force.'], ['Spring constant', 'Force per unit extension: k = F ÷ x.']],
    'gcse-moments': [['Moment', 'Force × perpendicular distance from the pivot to the line of action of the force.'], ['Principle of moments', 'For balance, the sum of clockwise moments equals the sum of anticlockwise moments.'], ['Lever', 'A force multiplier that turns about a pivot.'], ['Gear', 'Toothed wheels that transmit the rotational effect of a force.']],
    'gcse-newton': [['Newton’s first law', 'An object stays at rest or at constant velocity unless a resultant force acts.'], ['Newton’s second law', 'Resultant force = mass × acceleration.'], ['Newton’s third law', 'When two objects interact they exert equal and opposite forces on each other.'], ['Inertia', 'The tendency of an object to keep its state of motion.'], ['Momentum', 'Mass × velocity; conserved in a closed system.']],
    'gcse-energy': [['Kinetic energy', 'Energy of a moving object: Eₖ = ½mv².'], ['Gravitational potential energy', 'Energy due to height in a field: Eₚ = mgh.'], ['Elastic potential energy', 'Energy stored in a stretched spring: Eₑ = ½kx².'], ['Closed system', 'A system with no net change in total energy.'], ['Efficiency', 'Useful output energy ÷ total input energy.']],
    'gcse-work-power': [['Work done', 'Energy transferred by a force: W = Fs, distance along the force.'], ['Power', 'The rate of energy transfer: P = E ÷ t, in watts.'], ['Watt', 'One joule per second.'], ['Joule', 'The work done when a 1 N force moves 1 m.']],
    'gcse-resources': [['Renewable', 'An energy resource that is replenished as it is used.'], ['Non-renewable', 'A resource that will run out: coal, oil, gas, nuclear fuel.'], ['Reliability', 'Whether a resource can supply energy whenever it is needed.'], ['Base load', 'The minimum demand that must be met at all times.']],
    'gcse-pressure': [['Pressure', 'Force per unit area: p = F ÷ A.'], ['Upthrust', 'The upward force of a fluid on an object, equal to the weight of fluid displaced.'], ['Pressure in a fluid', 'p = ρgh: it increases with depth and density.'], ['Atmospheric pressure', 'Pressure from the weight of the air above; falls with height.']],
    'gcse-particles': [['Internal energy', 'The total kinetic and potential energy of all the particles in a system.'], ['Gas pressure', 'Caused by particles colliding with the walls of their container.'], ['Absolute zero', '−273 °C, 0 K: the lowest possible temperature.'], ['Boyle’s law', 'At constant temperature, pV is constant for a fixed mass of gas.']],
    'gcse-expansion': [['Thermal expansion', 'The increase in size of a material when it is heated.'], ['Kelvin scale', 'Temperature from absolute zero: T(K) = θ(°C) + 273.'], ['Pressure law', 'At constant volume, p ∝ T in kelvin.']],
    'gcse-shc': [['Specific heat capacity', 'The energy needed to raise the temperature of 1 kg of a substance by 1 °C.'], ['Thermal energy', 'Energy that changes temperature: ΔE = mcΔθ.'], ['Temperature change', 'Δθ, in °C or K.']],
    'gcse-heat-transfer': [['Specific latent heat', 'The energy needed to change the state of 1 kg of a substance with no change in temperature.'], ['Latent heat of fusion', 'For melting or freezing.'], ['Latent heat of vaporisation', 'For boiling or condensing.'], ['Thermal conductivity', 'How quickly a material transfers energy by conduction.']],
    'gcse-waves': [['Amplitude', 'The maximum displacement of a point on a wave from its rest position.'], ['Wavelength', 'The distance from a point on one wave to the equivalent point on the next.'], ['Frequency', 'The number of waves passing a point each second.'], ['Period', 'The time for one complete wave: T = 1 ÷ f.'], ['Wave speed', 'The speed energy is transferred: v = fλ.']],
    'gcse-reflection-refraction': [['Angle of incidence', 'The angle between the incoming ray and the normal.'], ['Refraction', 'A change of direction because a wave changes speed at a boundary.'], ['Refractive index', 'n = sin i ÷ sin r = c ÷ v.'], ['Total internal reflection', 'All light reflected inside a denser medium when the angle exceeds the critical angle.'], ['Critical angle', 'The angle of incidence giving a refraction angle of 90°.']],
    'gcse-lenses': [['Focal length', 'The distance from the lens to the principal focus.'], ['Principal focus', 'Where rays parallel to the axis meet after a convex lens.'], ['Real image', 'An image formed where rays actually meet; can be on a screen.'], ['Virtual image', 'An image rays only appear to come from.'], ['Magnification', 'Image height ÷ object height.']],
    'gcse-em-spectrum': [['Electromagnetic wave', 'A transverse wave of electric and magnetic fields; all travel at c in a vacuum.'], ['Electromagnetic spectrum', 'Radio, microwave, infrared, visible, ultraviolet, X-ray, gamma, in order of frequency.'], ['Ionising radiation', 'Radiation that can remove electrons from atoms: UV, X-rays, gamma.'], ['Speed of light', '3.0 × 10⁸ m/s in a vacuum.']],
    'gcse-sound': [['Ultrasound', 'Sound above 20 kHz, beyond human hearing.'], ['Echo sounding', 'Measuring distance from the time for a reflected pulse.'], ['Range of hearing', 'About 20 Hz to 20 kHz for humans.'], ['Compression', 'A region of a longitudinal wave where particles are close together.'], ['Rarefaction', 'A region where particles are spread out.']],
    'gcse-magnetism': [['Magnetic field', 'A region where a magnetic material or moving charge feels a force.'], ['Induced magnet', 'A material that becomes magnetic when placed in a field.'], ['Permanent magnet', 'Produces its own magnetic field.'], ['Field line', 'Points from N to S; closer lines mean a stronger field.']],
    'gcse-static': [['Static electricity', 'Charge built up on an insulator by friction.'], ['Electron transfer', 'Charging happens when electrons move from one material to another.'], ['Electric field', 'A region where a charge feels a force.'], ['Earthing', 'Connecting to the ground so charge can flow away.']],
    'gcse-current-pd': [['Electric current', 'The rate of flow of charge: I = Q ÷ t.'], ['Charge', 'Measured in coulombs (C): Q = It.'], ['Potential difference', 'The work done per unit charge: V = E ÷ Q.'], ['Coulomb', 'The charge passing when 1 A flows for 1 s.']],
    'gcse-circuits': [['Resistance', 'V ÷ I: how much a component opposes current.'], ['Ohmic conductor', 'Current proportional to potential difference at constant temperature.'], ['Thermistor', 'Resistance falls as temperature rises.'], ['LDR', 'Light-dependent resistor: resistance falls as light intensity rises.'], ['Diode', 'Lets current flow in one direction only.']],
    'gcse-power-cost': [['Power', 'P = VI = I²R: the rate of energy transfer.'], ['Kilowatt-hour', 'The energy transferred by a 1 kW appliance in 1 hour: 3.6 MJ.'], ['National Grid', 'The network of cables and transformers linking power stations to consumers.'], ['Step-up transformer', 'Raises the voltage so less current, and less energy, is lost in the cables.']],
    'gcse-series-parallel': [['Series', 'Same current through each component; p.d.s add up.'], ['Parallel', 'Same p.d. across each branch; currents add up.'], ['Total resistance in series', 'R = R₁ + R₂ + …'], ['Parallel resistance', 'Adding resistors in parallel lowers the total resistance.']],
    'gcse-safety': [['Live wire', 'Brown: carries the alternating potential at 230 V.'], ['Neutral wire', 'Blue: completes the circuit, near 0 V.'], ['Earth wire', 'Green and yellow: a safety path to ground if the case becomes live.'], ['Fuse', 'Melts and breaks the circuit if the current is too high.'], ['Alternating current', 'Current that repeatedly reverses direction: 50 Hz in the UK.']],
    'gcse-electromagnets': [['Solenoid', 'A long coil of wire; its field inside is strong and uniform.'], ['Electromagnet', 'A solenoid with an iron core: magnetic only when current flows.'], ['Fleming’s left-hand rule', 'Gives the direction of the force on a current in a field.'], ['Magnetic flux density', 'The strength of a magnetic field, B, in teslas.']],
    'gcse-motor': [['Motor effect', 'A current-carrying wire in a magnetic field feels a force: F = BIL.'], ['Split-ring commutator', 'Reverses the current every half turn so a motor keeps turning.'], ['Tesla', 'The unit of magnetic flux density.']],
    'gcse-induction': [['Electromagnetic induction', 'A p.d. is induced when a conductor cuts magnetic field lines.'], ['Generator', 'Turns kinetic energy into electrical energy by induction.'], ['Alternator', 'A generator that produces alternating current.'], ['Lenz’s law', 'The induced current opposes the change that caused it.']],
    'gcse-transformer': [['Transformer', 'Changes the size of an alternating p.d. using two coils on an iron core.'], ['Turns ratio', 'Vₚ ÷ Vₛ = Nₚ ÷ Nₛ.'], ['Step-down transformer', 'Fewer turns on the secondary: lowers the voltage.'], ['Power in a transformer', 'For 100% efficiency, VₚIₚ = VₛIₛ.']],
    'gcse-atom': [['Nucleus', 'The tiny, dense centre of an atom: protons and neutrons.'], ['Atomic number', 'The number of protons, Z.'], ['Mass number', 'The number of protons plus neutrons, A.'], ['Isotope', 'Atoms of the same element with different numbers of neutrons.'], ['Ion', 'An atom that has gained or lost electrons.']],
    'gcse-radiation': [['Alpha particle', 'A helium nucleus: two protons and two neutrons; strongly ionising, short range.'], ['Beta particle', 'A fast electron from the nucleus.'], ['Gamma ray', 'High-frequency electromagnetic radiation from the nucleus.'], ['Irradiation', 'Exposure to radiation: the object does not become radioactive.'], ['Contamination', 'Unwanted radioactive atoms on or in a material.']],
    'gcse-radioactivity': [['Activity', 'The rate at which a source decays, in becquerels (Bq).'], ['Half-life', 'The time for the number of radioactive nuclei, or the activity, to halve.'], ['Random', 'You cannot predict which nucleus will decay next.'], ['Background radiation', 'Radiation around us all the time, from natural and man-made sources.']],
    'gcse-earth-moon': [['Natural satellite', 'A body like the Moon orbiting a planet.'], ['Lunar phase', 'The changing shape of the lit part of the Moon we see.'], ['Tidal force', 'The difference in the Moon’s pull across the Earth.']],
    'gcse-solar-system': [['Nebula', 'A cloud of dust and gas where stars form.'], ['Dwarf planet', 'Orbits the Sun but has not cleared its orbit, like Pluto.'], ['Orbit', 'The path of a body round another, kept by gravity.']],
    'gcse-stars': [['Main sequence', 'The stable stage of a star when fusion balances gravity.'], ['Red giant', 'A swollen star that has run out of hydrogen in its core.'], ['White dwarf', 'The hot dense core left after a Sun-like star ends.'], ['Supernova', 'The explosion of a massive star.'], ['Nuclear fusion', 'Light nuclei joining to make heavier ones, releasing energy.']],
    'gcse-orbits': [['Circular orbit', 'Gravity provides the centripetal force; speed is constant but velocity changes.'], ['Orbital speed', 'Speed along the orbit: v = 2πr ÷ T.'], ['Red-shift', 'Light from receding galaxies is shifted to longer wavelengths.'], ['Big Bang theory', 'The universe began from a very small, hot, dense region and is expanding.']],
  });
})();
/* Key terms: A-level physics. */
(function () {
  const K = ((window.WL = window.WL || {}).keyterms = window.WL.keyterms || {});
  Object.assign(K, {
    'al-units': [['SI base unit', 'One of the seven units all others are built from: m, kg, s, A, K, mol, cd.'], ['Homogeneous equation', 'Every term has the same base units.'], ['Order of magnitude', 'A value to the nearest power of ten.'], ['Prefix', 'A power-of-ten multiplier such as milli (10⁻³) or mega (10⁶).']],
    'al-kinematics': [['Displacement', 'The change in position, with direction.'], ['Instantaneous velocity', 'The gradient of the displacement–time graph at that moment.'], ['Acceleration', 'The rate of change of velocity.'], ['Area under a v–t graph', 'The displacement.'], ['Terminal velocity', 'The constant speed reached when drag balances the driving force.']],
    'al-projectile': [['Projectile', 'An object moving under gravity alone after launch.'], ['Independence of components', 'Horizontal and vertical motions are treated separately.'], ['Range', 'The horizontal distance travelled before landing.'], ['Trajectory', 'The path followed: a parabola without air resistance.']],
    'al-dynamics': [['Newton’s second law', 'Resultant force = rate of change of momentum; F = ma for constant mass.'], ['Normal contact force', 'The force perpendicular to a surface that stops objects passing through it.'], ['Coefficient of friction', 'Friction ÷ normal contact force at the point of slipping.'], ['Drag', 'The resistive force on an object moving through a fluid.']],
    'al-momentum': [['Linear momentum', 'Mass × velocity; a vector.'], ['Principle of conservation of momentum', 'In a closed system the total momentum is constant.'], ['Impulse', 'Force × time = change of momentum; the area under a force–time graph.'], ['Elastic collision', 'Total kinetic energy is conserved.'], ['Inelastic collision', 'Some kinetic energy is transferred to other stores.']],
    'al-equilibrium': [['Equilibrium', 'No resultant force and no resultant moment.'], ['Couple', 'Two equal, opposite, parallel forces that turn but do not translate.'], ['Torque', 'The moment of a couple: one force × perpendicular distance between them.'], ['Centre of gravity', 'The point where the whole weight may be taken to act.']],
    'al-fluids': [['Density', 'Mass per unit volume.'], ['Upthrust', 'Equal to the weight of fluid displaced (Archimedes).'], ['Viscosity', 'A fluid’s resistance to flow.'], ['Stokes’ law', 'Drag on a small sphere: F = 6πηrv, for slow (laminar) flow.'], ['Laminar flow', 'Smooth flow in layers, with no mixing.']],
    'al-energy': [['Work done', 'Force × distance moved in the direction of the force.'], ['Power', 'Rate of doing work: P = Fv for a constant force.'], ['Efficiency', 'Useful output ÷ total input.'], ['Conservation of energy', 'Energy cannot be created or destroyed.']],
    'al-materials': [['Stress', 'Force per unit cross-sectional area.'], ['Strain', 'Extension ÷ original length; no unit.'], ['Young modulus', 'Stress ÷ strain, in the region where Hooke’s law holds.'], ['Elastic limit', 'The point beyond which a material is permanently deformed.'], ['Ultimate tensile stress', 'The greatest stress a material can withstand.'], ['Brittle', 'Breaks with little or no plastic deformation.']],
    'al-waves': [['Progressive wave', 'A wave that transfers energy from one place to another.'], ['Phase difference', 'How far one oscillation is ahead of another, as a fraction of a cycle or an angle.'], ['Intensity', 'Power per unit area.'], ['Coherent', 'Same frequency and a constant phase difference.']],
    'al-doppler': [['Doppler effect', 'The change in observed frequency because of relative motion of source and observer.'], ['Red-shift', 'z = Δλ ÷ λ ≈ v ÷ c for a receding source.'], ['Blue-shift', 'A shift to shorter wavelength from an approaching source.']],
    'al-polarisation': [['Plane polarised', 'Oscillations in one plane only.'], ['Polarisation', 'Only transverse waves can be polarised.'], ['Malus’s law', 'I = I₀ cos²θ through an analyser.']],
    'al-stationary': [['Stationary wave', 'Formed by the superposition of two waves of equal frequency travelling in opposite directions.'], ['Node', 'A point of zero amplitude.'], ['Antinode', 'A point of maximum amplitude.'], ['Harmonic', 'A stationary-wave pattern; the first harmonic has the lowest frequency.'], ['Superposition', 'The resultant displacement is the sum of the individual displacements.']],
    'al-interference': [['Path difference', 'The difference in distance travelled by two waves.'], ['Constructive interference', 'Path difference a whole number of wavelengths: waves in phase.'], ['Destructive interference', 'Path difference a half-odd number of wavelengths: waves in antiphase.'], ['Diffraction', 'The spreading of a wave through a gap or round an obstacle.'], ['Diffraction grating', 'Many slits: d sin θ = nλ.']],
    'al-current': [['Current', 'Rate of flow of charge: I = ΔQ ÷ Δt.'], ['Drift velocity', 'The average speed of charge carriers along a conductor: I = nAvq.'], ['Charge carrier', 'A charged particle that moves to make a current.'], ['Elementary charge', '1.60 × 10⁻¹⁹ C.']],
    'al-resistivity': [['Resistivity', 'ρ = RA ÷ L: a property of the material.'], ['Superconductor', 'Zero resistivity below its critical temperature.'], ['Critical temperature', 'The temperature below which a material superconducts.'], ['Ohm’s law', 'V ∝ I for a metallic conductor at constant temperature.']],
    'al-dc-circuits': [['Electromotive force', 'The energy transferred to electrical energy per unit charge by a source.'], ['Internal resistance', 'The resistance inside a source, which wastes energy.'], ['Terminal p.d.', 'The p.d. across the source’s terminals: V = ε − Ir.'], ['Lost volts', 'Ir, the p.d. across the internal resistance.'], ['Kirchhoff’s first law', 'The sum of currents into a junction equals the sum out (conservation of charge).']],
    'al-potential-divider': [['Potential divider', 'Resistors in series sharing the supply p.d. in proportion to their resistances.'], ['Sensor circuit', 'A potential divider with a thermistor or LDR, giving a p.d. that depends on conditions.'], ['Potentiometer', 'A variable potential divider.']],
    'al-particles': [['Specific charge', 'Charge ÷ mass of a particle.'], ['Antiparticle', 'Same mass, opposite charge and quantum numbers.'], ['Annihilation', 'A particle and its antiparticle turn into photons.'], ['Pair production', 'A photon creates a particle–antiparticle pair.'], ['Hadron', 'A particle made of quarks that feels the strong force.'], ['Lepton', 'A fundamental particle that does not feel the strong force, e.g. the electron.']],
    'al-circular': [['Angular speed', 'The angle swept per second: ω = 2π ÷ T.'], ['Centripetal acceleration', 'a = v² ÷ r = ω²r, towards the centre.'], ['Centripetal force', 'The resultant force towards the centre that keeps an object on a circular path.'], ['Radian', 'The angle subtended by an arc equal in length to the radius.']],
    'al-gravfields': [['Gravitational field strength', 'Force per unit mass: g = GM ÷ r².'], ['Gravitational potential', 'Work done per unit mass to bring a mass from infinity: V = −GM ÷ r.'], ['Equipotential', 'A surface of constant potential; no work done moving along it.'], ['Escape velocity', 'The minimum speed to leave a body’s field entirely.'], ['Geostationary orbit', 'An equatorial orbit with a 24-hour period, moving with the Earth.']],
    'al-temperature': [['Absolute zero', 'The temperature at which the particles have minimum internal energy: 0 K.'], ['Thermal equilibrium', 'No net transfer of energy between bodies in contact.'], ['Specific heat capacity', 'Energy to raise 1 kg by 1 K.'], ['Specific latent heat', 'Energy to change the state of 1 kg at constant temperature.']],
    'al-ideal-gas': [['Ideal gas', 'Obeys pV = nRT at all pressures and temperatures.'], ['Mole', 'The amount of substance containing 6.02 × 10²³ particles.'], ['Boltzmann constant', 'k = R ÷ Nₐ = 1.38 × 10⁻²³ J/K.'], ['Root-mean-square speed', 'The square root of the mean of the squares of the molecular speeds.'], ['Brownian motion', 'Random motion of small particles, evidence for moving molecules.']],
    'al-thermodynamics': [['Internal energy', 'The sum of the random kinetic and potential energies of the molecules.'], ['First law of thermodynamics', 'ΔU = Q − W, with W the work done by the gas.'], ['Isothermal', 'At constant temperature.'], ['Adiabatic', 'With no heat transfer.']],
    'al-shm': [['Simple harmonic motion', 'Acceleration proportional to displacement and directed towards the equilibrium position.'], ['Amplitude', 'The maximum displacement.'], ['Period', 'The time for one complete oscillation.'], ['Isochronous', 'Period independent of amplitude.'], ['Angular frequency', 'ω = 2πf.']],
    'al-damping': [['Damping', 'The loss of energy from an oscillator, so the amplitude decreases.'], ['Critical damping', 'Returns to equilibrium in the shortest time without oscillating.'], ['Resonance', 'Large amplitude when the driving frequency equals the natural frequency.'], ['Forced oscillation', 'Oscillation driven by a periodic external force.'], ['Natural frequency', 'The frequency of free oscillation.']],
    'al-efields': [['Electric field strength', 'Force per unit positive charge: E = F ÷ Q.'], ['Coulomb’s law', 'F = kQ₁Q₂ ÷ r² between point charges.'], ['Uniform field', 'E = V ÷ d between parallel plates.'], ['Electric potential', 'Work done per unit charge to bring a positive charge from infinity.']],
    'al-capacitors': [['Capacitance', 'Charge stored per unit p.d.: C = Q ÷ V.'], ['Farad', 'One coulomb per volt.'], ['Time constant', 'τ = RC: the time to fall to 37% (1/e) during discharge.'], ['Dielectric', 'An insulator between the plates that increases the capacitance.'], ['Energy stored', 'E = ½QV = ½CV².']],
    'al-bfields': [['Magnetic flux density', 'B: force per unit current per unit length on a wire at right angles to the field.'], ['Tesla', 'The flux density giving 1 N on 1 m of wire carrying 1 A.'], ['Force on a moving charge', 'F = BQv, at right angles to v and B.'], ['Cyclotron', 'An accelerator using a magnetic field to bend charged particles into circles.']],
    'al-induction': [['Magnetic flux', 'Φ = BA for a field at right angles to an area.'], ['Flux linkage', 'NΦ: flux × number of turns.'], ['Faraday’s law', 'The induced emf equals the rate of change of flux linkage.'], ['Lenz’s law', 'The induced current flows to oppose the change that produces it.'], ['Weber', 'The unit of magnetic flux, T m².']],
    'al-ac': [['Root-mean-square value', 'The steady value giving the same heating: V_rms = V₀ ÷ √2.'], ['Peak value', 'The maximum value of an alternating quantity.'], ['Oscilloscope', 'Shows a p.d. against time; timebase and volts per division set the scales.']],
    'al-photons': [['Photon', 'A quantum of electromagnetic energy: E = hf.'], ['Planck constant', 'h = 6.63 × 10⁻³⁴ J s.'], ['Electronvolt', 'The energy an electron gains through 1 V: 1.60 × 10⁻¹⁹ J.'], ['Wave–particle duality', 'Light and matter show both wave and particle behaviour.']],
    'al-photoelectric': [['Photoelectric effect', 'Electrons emitted from a metal when light above a threshold frequency falls on it.'], ['Work function', 'The minimum energy needed to free an electron from the surface.'], ['Threshold frequency', 'The minimum frequency for emission: f₀ = φ ÷ h.'], ['Stopping potential', 'The p.d. that just stops the fastest photoelectrons.']],
    'al-spectra': [['Energy level', 'One of the discrete energies an electron in an atom can have.'], ['Excitation', 'Raising an electron to a higher level.'], ['Ionisation', 'Removing an electron completely from an atom.'], ['Line spectrum', 'Discrete wavelengths from transitions between levels: hf = E₁ − E₂.'], ['Ground state', 'The lowest energy level.']],
    'al-nuclear': [['Mass defect', 'The difference between the mass of the separate nucleons and the nucleus.'], ['Binding energy', 'The energy needed to separate a nucleus into its nucleons.'], ['Atomic mass unit', '1 u = 1.661 × 10⁻²⁷ kg ≡ 931.5 MeV.'], ['Fission', 'A heavy nucleus splitting into two smaller ones.'], ['Fusion', 'Light nuclei joining to form a heavier one.']],
    'al-decay': [['Decay constant', 'The probability per unit time that a nucleus decays: λ.'], ['Activity', 'A = λN, decays per second.'], ['Half-life', 'T½ = ln 2 ÷ λ.'], ['Exponential decay', 'N = N₀e^(−λt).']],
    'al-medical': [['Attenuation', 'The reduction in intensity as radiation passes through matter.'], ['Acoustic impedance', 'Z = ρc; reflection at a boundary depends on the change in Z.'], ['Tracer', 'A radioactive isotope followed through the body.'], ['Half-value thickness', 'The thickness that halves the intensity.']],
    'al-astro': [['Black body', 'An ideal absorber and emitter of all wavelengths.'], ['Wien’s law', 'λmax T = 2.9 × 10⁻³ m K.'], ['Stefan’s law', 'L = 4πr²σT⁴.'], ['Luminosity', 'The total power output of a star.'], ['Parsec', 'The distance at which 1 AU subtends 1 arcsecond.']],
    'al-cosmology': [['Hubble’s law', 'Recession speed is proportional to distance: v = H₀d.'], ['Cosmic microwave background', 'Radiation left from the hot early universe, now at about 2.7 K.'], ['Dark energy', 'The unknown cause of the accelerating expansion.'], ['Big Bang', 'The universe expanded from an extremely hot, dense state.']],
  });
})();
/* Key terms: university physics, years 1–4. */
(function () {
  const K = ((window.WL = window.WL || {}).keyterms = window.WL.keyterms || {});
  Object.assign(K, {
    'y1-work-energy': [['Work', 'W = ∫F·dr along the path.'], ['Conservative force', 'Work done is independent of path; it has a potential energy.'], ['Work–energy theorem', 'The net work done on a body equals its change in kinetic energy.'], ['Potential energy', 'U with F = −∇U.']],
    'y1-systems': [['Centre of mass', 'R = Σmᵢrᵢ ÷ M; it moves as if all external forces act there.'], ['Closed system', 'No external force: total momentum is conserved.'], ['Reduced mass', 'μ = m₁m₂ ÷ (m₁ + m₂) for a two-body problem.'], ['Variable mass', 'Rockets: thrust from the rate of change of momentum of ejected mass.']],
    'y1-angular-momentum': [['Angular momentum', 'L = r × p; conserved when the external torque is zero.'], ['Torque', 'τ = r × F = dL/dt.'], ['Moment of inertia', 'I = Σmr²: rotational inertia about an axis.'], ['Precession', 'Slow turning of the spin axis under a torque.']],
    'y1-rotation': [['Rigid body', 'An object whose particle separations do not change.'], ['Parallel-axis theorem', 'I = I_cm + Md².'], ['Rolling without slipping', 'v = ωR at the contact point condition.'], ['Rotational kinetic energy', 'E = ½Iω².']],
    'y1-fluids': [['Continuity equation', 'Av is constant for an incompressible fluid.'], ['Bernoulli’s equation', 'p + ½ρv² + ρgh is constant along a streamline (steady, inviscid, incompressible).'], ['Streamline', 'A line tangent to the velocity everywhere.'], ['Reynolds number', 'Re = ρvL ÷ η: inertial ÷ viscous forces; large Re means turbulence.']],
    'y1-oscillators': [['Damped oscillator', 'mẍ + bẋ + kx = 0.'], ['Quality factor', 'Q = ω₀ ÷ (decay rate of energy): high Q means low damping.'], ['Resonance', 'Maximum response near the natural frequency when driven.'], ['Phase lag', 'The driven oscillator lags the force by up to 180°.']],
    'y1-coupled': [['Normal mode', 'A motion in which every part oscillates at the same frequency.'], ['Normal coordinate', 'A combination of coordinates that oscillates independently.'], ['Beats', 'Slow amplitude variation at the difference of two frequencies.'], ['Degrees of freedom', 'The number of independent coordinates.']],
    'y1-wave-eq': [['Wave equation', '∂²y/∂t² = v²∂²y/∂x².'], ['Dispersion', 'Wave speed depends on frequency.'], ['Group velocity', 'dω/dk: the speed of a wave packet and its energy.'], ['Phase velocity', 'ω ÷ k: the speed of a single crest.']],
    'y1-optics': [['Huygens’ principle', 'Every point on a wavefront is a source of secondary wavelets.'], ['Rayleigh criterion', 'Two sources are just resolved when θ = 1.22λ ÷ D.'], ['Coherence length', 'The path difference over which interference fringes stay visible.'], ['Fraunhofer diffraction', 'Far-field diffraction, given by a Fourier transform of the aperture.']],
    'y1-gauss': [['Electric flux', 'Φ = ∮E·dA.'], ['Gauss’s law', '∮E·dA = Q_enc ÷ ε₀.'], ['Gaussian surface', 'A closed surface chosen to exploit symmetry.'], ['Permittivity of free space', 'ε₀ = 8.85 × 10⁻¹² F/m.']],
    'y1-potential': [['Electric potential', 'V with E = −∇V.'], ['Equipotential', 'A surface of constant V, at right angles to E.'], ['Poisson’s equation', '∇²V = −ρ ÷ ε₀.'], ['Capacitance', 'C = Q ÷ V.']],
    'y1-magnetostatics': [['Biot–Savart law', 'dB = (μ₀ ÷ 4π) I dl × r̂ ÷ r².'], ['Ampère’s law', '∮B·dl = μ₀I_enc.'], ['Permeability of free space', 'μ₀ = 4π × 10⁻⁷ T m/A.'], ['Magnetic dipole moment', 'm = IA for a current loop.']],
    'y1-faraday': [['Faraday’s law', 'emf = −dΦ/dt.'], ['Motional emf', 'emf from a conductor moving through a field: vBL.'], ['Self-inductance', 'L = NΦ ÷ I; emf = −L dI/dt.'], ['Eddy currents', 'Induced currents in bulk conductors that oppose motion.']],
    'y1-maxwell': [['Displacement current', 'ε₀ ∂Φ_E/∂t, which completes Ampère’s law.'], ['Maxwell’s equations', 'The four laws of electromagnetism in differential or integral form.'], ['Poynting vector', 'S = E × B ÷ μ₀: energy flux of the field.'], ['Electromagnetic wave', 'A self-sustaining wave of E and B travelling at c = 1 ÷ √(μ₀ε₀).']],
    'y1-sr': [['Postulates of relativity', 'The laws of physics, and c, are the same in every inertial frame.'], ['Lorentz factor', 'γ = 1 ÷ √(1 − v²/c²).'], ['Time dilation', 'A moving clock runs slow: t = γt₀.'], ['Length contraction', 'A moving rod is shorter along its motion: L = L₀ ÷ γ.'], ['Proper time', 'Time measured by a clock at rest relative to the events.']],
    'y1-rel-dynamics': [['Rest energy', 'E₀ = mc².'], ['Relativistic momentum', 'p = γmv.'], ['Energy–momentum relation', 'E² = (pc)² + (mc²)².'], ['Invariant mass', 'The mass found from E² − p²c², the same in every frame.']],
    'y1-thermo': [['Zeroth law', 'Bodies each in equilibrium with a third are in equilibrium with each other.'], ['State function', 'Depends only on the state, not the path: U, S, p, V, T.'], ['Carnot efficiency', '1 − T_c ÷ T_h, the maximum for any engine between those temperatures.'], ['Heat engine', 'A cyclic device turning heat into work.']],
    'y1-entropy': [['Entropy', 'dS = dQ_rev ÷ T; S = k ln Ω.'], ['Second law', 'The entropy of an isolated system never decreases.'], ['Reversible process', 'Can be run backwards with no net change; total entropy constant.'], ['Microstate', 'A complete specification of the state of every particle.']],
    'y1-old-quantum': [['Bohr model', 'Electrons in orbits with quantised angular momentum L = nħ.'], ['Compton effect', 'X-rays scattered from electrons gain wavelength: Δλ = (h/mc)(1 − cos θ).'], ['Blackbody radiation', 'Planck’s quantised oscillators explain its spectrum.'], ['Quantisation', 'A quantity restricted to discrete values.']],
    'y1-qm-intro': [['Wavefunction', 'ψ(x, t): |ψ|² is the probability density.'], ['de Broglie wavelength', 'λ = h ÷ p.'], ['Uncertainty principle', 'ΔxΔp ≥ ħ ÷ 2.'], ['Normalisation', '∫|ψ|² dx = 1.'], ['Superposition', 'A sum of allowed states is also an allowed state.']],
    'y2-lagrangian': [['Lagrangian', 'L = T − V.'], ['Generalised coordinate', 'Any set of independent coordinates describing the configuration.'], ['Euler–Lagrange equation', 'd/dt(∂L/∂q̇) − ∂L/∂q = 0.'], ['Principle of least action', 'The true path makes the action S = ∫L dt stationary.']],
    'y2-noether': [['Noether’s theorem', 'Every continuous symmetry of the action gives a conserved quantity.'], ['Cyclic coordinate', 'A coordinate absent from L: its conjugate momentum is conserved.'], ['Conjugate momentum', 'p = ∂L/∂q̇.'], ['Time translation', 'Symmetry that gives energy conservation.']],
    'y2-central-force': [['Central force', 'A force along the line to a fixed centre, depending only on distance.'], ['Effective potential', 'V_eff = V(r) + L² ÷ 2mr².'], ['Kepler’s laws', 'Elliptical orbits, equal areas in equal times, T² ∝ a³.'], ['Eccentricity', 'How elongated an orbit is: 0 for a circle.']],
    'y2-small-oscillations': [['Equilibrium', 'A point where the generalised forces vanish.'], ['Stable equilibrium', 'The potential is a minimum: small displacements oscillate.'], ['Normal mode frequencies', 'From det(K − ω²M) = 0.'], ['Zero mode', 'A mode with ω = 0, a free motion such as translation.']],
    'y2-rigid-body': [['Inertia tensor', 'Iᵢⱼ: relates angular velocity to angular momentum, L = Iω.'], ['Principal axes', 'Axes in which the inertia tensor is diagonal.'], ['Euler’s equations', 'The equations of motion of a rigid body in its principal frame.'], ['Tennis-racket theorem', 'Rotation about the intermediate axis is unstable.']],
    'y2-multipoles': [['Multipole expansion', 'Writing a far field as monopole + dipole + quadrupole + …'], ['Dipole moment', 'p = Σqᵢrᵢ.'], ['Quadrupole', 'The next term after the dipole; its potential falls as 1/r³.'], ['Legendre polynomials', 'The angular functions in the axial multipole expansion.']],
    'y2-matter-fields': [['Polarisation', 'Dipole moment per unit volume, P.'], ['Electric displacement', 'D = ε₀E + P.'], ['Magnetisation', 'Magnetic dipole moment per unit volume, M.'], ['Relative permittivity', 'εᵣ = ε ÷ ε₀.']],
    'y2-em-waves': [['Plane wave', 'E and B vary only along the direction of travel.'], ['Impedance of free space', 'Z₀ = √(μ₀/ε₀) ≈ 377 Ω.'], ['Skin depth', 'The depth over which a wave decays by 1/e in a conductor.'], ['Radiation pressure', 'Pressure from absorbing or reflecting light: I ÷ c when absorbed.']],
    'y2-em-relativity': [['Field tensor', 'Fμν combines E and B into one relativistic object.'], ['Four-current', 'Jμ = (cρ, J).'], ['Lorentz invariant', 'E² − c²B² and E·B are the same in every frame.'], ['Covariance', 'Equations keep their form under Lorentz transformations.']],
    'y2-fourier': [['Fourier series', 'A periodic function as a sum of sines and cosines.'], ['Fourier transform', 'f̃(k) = ∫f(x)e^(−ikx)dx.'], ['Convolution theorem', 'The transform of a convolution is the product of the transforms.'], ['Parseval’s theorem', 'Total power is the same in both domains.']],
    'y2-4vectors': [['Four-vector', 'A quantity transforming like (ct, x, y, z) under Lorentz transformations.'], ['Four-momentum', 'pμ = (E/c, p).'], ['Minkowski metric', 'η = diag(1, −1, −1, −1) (or the opposite sign convention).'], ['Spacetime interval', 's² = c²t² − x² − y² − z², invariant.']],
    'y2-boltzmann': [['Boltzmann factor', 'e^(−E/kT): relative probability of a state of energy E.'], ['Canonical ensemble', 'A system in contact with a heat bath at temperature T.'], ['Equipartition', 'Each quadratic degree of freedom has mean energy ½kT.'], ['Maxwell–Boltzmann distribution', 'The distribution of molecular speeds in a gas.']],
    'y2-partition': [['Partition function', 'Z = Σe^(−Eᵢ/kT).'], ['Free energy', 'F = −kT ln Z.'], ['Mean energy', '⟨E⟩ = −∂ ln Z/∂β.'], ['Heat capacity', 'C = ∂⟨E⟩/∂T.']],
    'y2-blackbody': [['Planck’s law', 'The spectral energy density of blackbody radiation.'], ['Stefan–Boltzmann law', 'Power per area = σT⁴.'], ['Wien displacement law', 'λmax T = 2.90 × 10⁻³ m K.'], ['Ultraviolet catastrophe', 'The classical prediction of infinite energy at short wavelengths.']],
    'y2-schrodinger': [['Schrödinger equation', 'iħ ∂ψ/∂t = Ĥψ.'], ['Stationary state', 'ψ = φ(x)e^(−iEt/ħ): |ψ|² does not change.'], ['Probability current', 'The flow of probability density.'], ['Hamiltonian', 'The energy operator, T̂ + V̂.']],
    'y2-infinite-well': [['Infinite square well', 'V = 0 inside, infinite outside.'], ['Energy levels', 'Eₙ = n²h² ÷ 8mL².'], ['Boundary conditions', 'ψ = 0 at the walls.'], ['Zero-point energy', 'The lowest energy is not zero.']],
    'y2-step-barrier': [['Reflection coefficient', 'The fraction of the probability current reflected.'], ['Tunnelling', 'Transmission through a region where E < V.'], ['Decay constant', 'κ = √(2m(V − E)) ÷ ħ inside a barrier.'], ['Evanescent wave', 'An exponentially decaying wavefunction in a forbidden region.']],
    'y2-qho': [['Harmonic oscillator', 'V = ½mω²x²: levels (n + ½)ħω.'], ['Ladder operators', 'â and â† lower and raise the energy by ħω.'], ['Hermite polynomials', 'The polynomial factors of the oscillator eigenfunctions.'], ['Zero-point motion', 'The ground state has energy ½ħω.']],
    'y2-operators': [['Hermitian operator', 'Equal to its adjoint: real eigenvalues, orthogonal eigenvectors.'], ['Commutator', '[Â, B̂] = ÂB̂ − B̂Â.'], ['Eigenvalue', 'The value a measurement can return.'], ['Expectation value', '⟨A⟩ = ⟨ψ|Â|ψ⟩.']],
    'y3-hamiltonian': [['Hamiltonian', 'H(q, p) = Σpq̇ − L.'], ['Hamilton’s equations', 'q̇ = ∂H/∂p, ṗ = −∂H/∂q.'], ['Phase space', 'The space of all (q, p).'], ['Poisson bracket', '{f, g} = Σ(∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q).'], ['Liouville’s theorem', 'Phase-space volume is conserved.']],
    'y3-fluid-dynamics': [['Navier–Stokes equations', 'Momentum conservation for a viscous fluid.'], ['Vorticity', 'ω = ∇ × v.'], ['Incompressible flow', '∇·v = 0.'], ['Boundary layer', 'The thin region near a wall where viscosity matters.']],
    'y3-dirac': [['Dirac notation', 'States as kets |ψ⟩ and their duals as bras ⟨ψ|.'], ['Completeness', 'Σ|n⟩⟨n| = 1.'], ['Inner product', '⟨φ|ψ⟩, a complex number.'], ['Projection operator', '|n⟩⟨n|.']],
    'y3-angular-momentum': [['Angular momentum operators', 'L̂ = r̂ × p̂ with [L̂ₓ, L̂ᵧ] = iħL̂_z.'], ['Quantum numbers l and m', 'L² = l(l + 1)ħ², L_z = mħ.'], ['Spherical harmonics', 'The angular eigenfunctions Yₗₘ(θ, φ).'], ['Addition of angular momentum', 'j runs from |j₁ − j₂| to j₁ + j₂.']],
    'y3-spin': [['Spin', 'Intrinsic angular momentum; electrons have s = ½.'], ['Pauli matrices', 'Ŝ = (ħ/2)σ for spin ½.'], ['Stern–Gerlach experiment', 'Splitting of a beam by an inhomogeneous field: quantised spin.'], ['Gyromagnetic ratio', 'Magnetic moment per unit angular momentum.']],
    'y3-hydrogen': [['Principal quantum number', 'n: sets the energy Eₙ = −13.6 eV ÷ n².'], ['Bohr radius', 'a₀ = 0.0529 nm.'], ['Degeneracy', 'Different states with the same energy: n² for hydrogen, ignoring spin.'], ['Rydberg formula', '1/λ = R(1/n₁² − 1/n₂²).']],
    'y3-tunnelling': [['Transmission coefficient', 'The probability of crossing a barrier.'], ['Alpha decay', 'An α particle tunnels out of the nucleus (Gamow).'], ['Scanning tunnelling microscope', 'Images surfaces using tunnelling current, very sensitive to the gap.'], ['WKB approximation', 'T ≈ exp(−2∫κ dx).']],
    'y3-identical': [['Identical particles', 'Cannot be distinguished, even in principle.'], ['Boson', 'Integer spin; symmetric wavefunction.'], ['Fermion', 'Half-integer spin; antisymmetric wavefunction.'], ['Pauli exclusion principle', 'No two identical fermions can be in the same state.']],
    'y3-entanglement': [['Entangled state', 'A state of two systems that is not a product of single-system states.'], ['Bell inequality', 'A bound obeyed by local hidden-variable theories, violated by quantum mechanics.'], ['Density matrix', 'ρ = Σpᵢ|ψᵢ⟩⟨ψᵢ|, for mixed states.'], ['Decoherence', 'Loss of quantum coherence through interaction with the environment.']],
    'y3-fine-structure': [['Fine structure', 'Small splittings from spin–orbit coupling and relativistic corrections.'], ['Spin–orbit coupling', 'The interaction between spin and orbital angular momentum.'], ['Zeeman effect', 'The splitting of lines in a magnetic field.'], ['Fine-structure constant', 'α = e² ÷ 4πε₀ħc ≈ 1/137.']],
    'y3-variational-wkb': [['Variational principle', 'Any trial state gives an energy at or above the true ground state.'], ['Trial wavefunction', 'A guessed form with adjustable parameters.'], ['WKB approximation', 'A semiclassical solution valid when the potential varies slowly.'], ['Turning point', 'Where E = V; the classical motion reverses.']],
    'y3-time-dependent': [['Time-dependent perturbation theory', 'Transition amplitudes to first order in a weak perturbation.'], ['Fermi’s golden rule', 'Transition rate = (2π/ħ)|⟨f|V|i⟩|²ρ(E_f).'], ['Selection rules', 'Which transitions have non-zero matrix elements.'], ['Rabi oscillation', 'Population cycling between two levels in a resonant field.']],
    'y3-scattering': [['Cross-section', 'The effective target area: rate = flux × σ.'], ['Differential cross-section', 'dσ/dΩ: scattering per unit solid angle.'], ['Born approximation', 'First-order scattering amplitude from the Fourier transform of the potential.'], ['Rutherford formula', 'dσ/dΩ ∝ 1/sin⁴(θ/2) for Coulomb scattering.']],
    'y3-landau': [['Landau levels', 'Quantised energies of a charge in a magnetic field: (n + ½)ħω_c.'], ['Cyclotron frequency', 'ω_c = qB ÷ m.'], ['Quantum Hall effect', 'Hall resistance quantised in units of h/e².'], ['Magnetic length', 'ℓ = √(ħ/eB).']],
    'y3-radiation': [['Larmor formula', 'Power radiated by an accelerated charge: P = q²a² ÷ 6πε₀c³.'], ['Electric dipole radiation', 'Radiation from an oscillating dipole; power ∝ ω⁴.'], ['Retarded potentials', 'Potentials evaluated at the retarded time t − r/c.'], ['Synchrotron radiation', 'Radiation from relativistic charges on curved paths.']],
    'y3-lasers': [['Stimulated emission', 'An incoming photon triggers emission of an identical photon.'], ['Population inversion', 'More atoms in the upper level than the lower.'], ['Einstein coefficients', 'A and B: rates of spontaneous and stimulated processes.'], ['Optical cavity', 'Mirrors that feed photons back through the gain medium.']],
    'y3-quantum-gases': [['Fermi energy', 'The highest occupied energy of a fermion gas at T = 0.'], ['Bose–Einstein condensate', 'Macroscopic occupation of the ground state below a critical temperature.'], ['Fermi–Dirac distribution', '1 ÷ (e^((E−μ)/kT) + 1).'], ['Degeneracy pressure', 'Pressure from the exclusion principle, holding up white dwarfs.']],
    'y3-solids': [['Crystal lattice', 'A periodic arrangement of points in space.'], ['Bragg’s law', '2d sin θ = nλ.'], ['Phonon', 'A quantum of lattice vibration.'], ['Band gap', 'An energy range with no electron states.'], ['Brillouin zone', 'The primitive cell of the reciprocal lattice.']],
    'y3-semiconductors': [['Intrinsic semiconductor', 'A pure semiconductor: equal electron and hole densities.'], ['Doping', 'Adding impurities to create n-type or p-type material.'], ['Hole', 'A missing electron that acts as a positive carrier.'], ['p–n junction', 'The basis of diodes, LEDs and solar cells.']],
    'y3-nuclear-particle': [['Quark', 'A fundamental fermion with fractional charge, bound into hadrons.'], ['Resonance width', 'Γ = ħ ÷ τ: a short lifetime means a broad peak.'], ['Conservation laws', 'Charge, baryon number and lepton number are conserved in every interaction.'], ['Invariant mass', 'Found from the total four-momentum of the decay products.']],
    'y3-equivalence': [['Equivalence principle', 'Locally, gravity is indistinguishable from acceleration.'], ['Inertial frame', 'A frame in which a free body moves in a straight line.'], ['Gravitational redshift', 'Light climbing out of a potential well loses frequency.'], ['Free fall', 'Motion under gravity alone: locally an inertial frame.']],
    'y4-perturbation': [['Perturbation theory', 'Corrections to known solutions in powers of a small parameter.'], ['First-order energy shift', 'E⁽¹⁾ = ⟨n|V|n⟩.'], ['Degenerate perturbation theory', 'Diagonalise V within the degenerate subspace first.'], ['Second-order shift', 'Σ|⟨m|V|n⟩|² ÷ (Eₙ − Eₘ): always lowers the ground state.']],
    'y4-chaos': [['Chaos', 'Deterministic motion with sensitive dependence on initial conditions.'], ['Lyapunov exponent', 'The average exponential rate of separation of nearby trajectories.'], ['Bifurcation', 'A qualitative change in behaviour as a parameter varies.'], ['Strange attractor', 'A fractal set to which chaotic trajectories are drawn.']],
    'y4-classical-fields': [['Field', 'A quantity defined at every point of spacetime.'], ['Lagrangian density', 'ℒ, with action S = ∫ℒ d⁴x.'], ['Euler–Lagrange field equations', '∂μ(∂ℒ/∂(∂μφ)) − ∂ℒ/∂φ = 0.'], ['Stress–energy tensor', 'The conserved current of spacetime translations.']],
    'y4-kg': [['Klein–Gordon equation', '(□ + m²c²/ħ²)φ = 0 for a spin-0 field.'], ['Negative-energy solutions', 'Reinterpreted as antiparticles.'], ['Relativistic invariance', 'The equation has the same form in every inertial frame.']],
    'y4-quantised-field': [['Creation operator', 'a†(k) adds a quantum of momentum ħk.'], ['Fock space', 'The space of states with any number of particles.'], ['Vacuum state', 'The state with no particles, |0⟩.'], ['Normal ordering', 'Annihilation operators to the right, removing the infinite zero-point energy.']],
    'y4-feynman': [['Feynman diagram', 'A pictorial term in the perturbation series for an amplitude.'], ['Propagator', 'The amplitude for a particle to travel between two points.'], ['Vertex', 'Where lines meet; carries a coupling constant.'], ['Virtual particle', 'An internal line, not on its mass shell.']],
    'y4-qed': [['Quantum electrodynamics', 'The quantum field theory of electrons and photons.'], ['Coupling constant', 'α ≈ 1/137 sets the strength of each vertex.'], ['Gauge invariance', 'Physics unchanged under local phase changes of the electron field.'], ['Anomalous magnetic moment', 'g − 2, predicted by QED to great precision.']],
    'y4-renormalisation': [['Renormalisation', 'Absorbing infinities into measured parameters.'], ['Running coupling', 'A coupling that changes with the energy scale.'], ['Cutoff', 'An upper limit on momenta used to regulate integrals.'], ['Beta function', 'The rate of change of a coupling with ln(energy).']],
    'y4-gauge': [['Gauge symmetry', 'Invariance under local transformations of the fields.'], ['Gauge field', 'The field needed to keep a local symmetry, e.g. the photon.'], ['Covariant derivative', 'D = ∂ + iqA (natural units; sign conventions vary).'], ['Yang–Mills theory', 'A gauge theory with a non-abelian group.']],
    'y4-higgs': [['Spontaneous symmetry breaking', 'The ground state has less symmetry than the laws.'], ['Higgs mechanism', 'Gauge bosons gain mass by absorbing Goldstone modes.'], ['Vacuum expectation value', 'The non-zero value of the Higgs field in the vacuum, about 246 GeV.'], ['Goldstone boson', 'A massless mode from a broken continuous symmetry.']],
    'y4-standard-model': [['Standard Model', 'The gauge theory SU(3) × SU(2) × U(1) of quarks, leptons and forces.'], ['Generation', 'One of three copies of quarks and leptons.'], ['Colour charge', 'The charge of the strong force.'], ['Weak mixing', 'The W and Z masses are related through the weak mixing angle.']],
    'y4-ising': [['Ising model', 'Spins ±1 on a lattice with nearest-neighbour coupling.'], ['Order parameter', 'A quantity zero in one phase and non-zero in the other, e.g. magnetisation.'], ['Mean-field theory', 'Replace neighbours by their average.'], ['Critical temperature', 'The temperature of the phase transition.']],
    'y4-phase-transitions': [['First-order transition', 'A discontinuous change with latent heat.'], ['Continuous transition', 'The order parameter goes smoothly to zero.'], ['Critical exponent', 'Describes power-law behaviour near the critical point.'], ['Universality', 'Systems with the same symmetry and dimension share critical exponents.']],
    'y4-superconductivity': [['Superconductivity', 'Zero resistance and flux expulsion below T_c.'], ['Meissner effect', 'Expulsion of magnetic flux from a superconductor.'], ['Cooper pair', 'Bound pair of electrons mediated by phonons.'], ['BCS theory', 'The microscopic theory of conventional superconductors.']],
    'y4-topological': [['Topological invariant', 'A quantity unchanged by smooth deformations, e.g. a Chern number.'], ['Berry phase', 'A geometric phase from slow cyclic change of parameters.'], ['Edge state', 'A state at the boundary protected by bulk topology.'], ['Topological insulator', 'Insulating bulk with conducting surface states.']],
    'y4-quantum-info': [['Qubit', 'A two-level quantum system.'], ['Quantum gate', 'A unitary operation on qubits.'], ['No-cloning theorem', 'An unknown quantum state cannot be copied.'], ['Quantum teleportation', 'Transfer of a state using entanglement and classical bits.']],
    'y4-gr': [['Metric tensor', 'g_μν: defines distances and times in spacetime.'], ['Geodesic', 'The straightest possible path in curved spacetime; free bodies follow it.'], ['Einstein field equations', 'G_μν = 8πG T_μν ÷ c⁴.'], ['Curvature', 'Measured by the Riemann tensor.']],
    'y4-schwarzschild': [['Schwarzschild metric', 'The vacuum spacetime outside a spherical mass.'], ['Event horizon', 'r_s = 2GM ÷ c²: nothing inside can escape.'], ['Gravitational time dilation', 'dτ = √(1 − r_s/r) dt for a static clock.'], ['Photon sphere', 'r = 1.5 r_s: unstable circular light orbits.']],
    'y4-gravitational-waves': [['Gravitational wave', 'A ripple in spacetime curvature travelling at c.'], ['Strain', 'h = ΔL ÷ L, the fractional length change.'], ['Quadrupole radiation', 'Gravitational waves need a changing mass quadrupole.'], ['Interferometer', 'LIGO-type detector measuring arm-length changes.']],
    'y4-friedmann': [['Scale factor', 'a(t): how distances grow with cosmic time.'], ['Friedmann equation', 'H² = 8πGρ/3 − kc²/a² (+ Λ term).'], ['Critical density', 'ρ_c = 3H² ÷ 8πG.'], ['Density parameter', 'Ω = ρ ÷ ρ_c.']],
    'y4-early-universe': [['Nucleosynthesis', 'Formation of light nuclei in the first minutes.'], ['Recombination', 'Electrons and nuclei form neutral atoms; the CMB is released.'], ['Inflation', 'A very rapid early expansion that explains flatness and horizon problems.'], ['Decoupling', 'When a particle species stops interacting fast enough to stay in equilibrium.']],
  });
})();
/* Key terms: mathematics. */
(function () {
  const K = ((window.WL = window.WL || {}).keyterms = window.WL.keyterms || {});
  const T = (id, L) => { K[id] = L; };
  [
    ['m-number', [['Prime', 'A whole number with exactly two factors, 1 and itself.'], ['Highest common factor', 'The largest number that divides each of the numbers.'], ['Lowest common multiple', 'The smallest number that is a multiple of each.'], ['Prime factorisation', 'Writing a number as a product of primes.']]],
    ['m-fractions', [['Numerator', 'The top of a fraction.'], ['Denominator', 'The bottom of a fraction.'], ['Reciprocal', '1 ÷ the number.'], ['Recurring decimal', 'A decimal with a repeating block of digits.']]],
    ['m-indices', [['Index', 'A power: aⁿ means n factors of a.'], ['Standard form', 'A × 10ⁿ with 1 ≤ A < 10.'], ['Negative index', 'a⁻ⁿ = 1 ÷ aⁿ.'], ['Surd', 'An irrational root such as √2, left in root form.']]],
    ['m-estimation', [['Significant figures', 'Digits that carry meaning, counted from the first non-zero digit.'], ['Upper bound', 'The largest value that rounds to the given value.'], ['Lower bound', 'The smallest value that rounds to the given value.'], ['Estimate', 'An answer found by rounding to easy values first.']]],
    ['m-rates', [['Compound interest', 'Interest added to the total each period: A = P(1 + r)ⁿ.'], ['Rate of change', 'How fast one quantity changes with another.'], ['Multiplier', 'The number you multiply by for a percentage change, e.g. 1.05.'], ['Depreciation', 'Loss of value over time.']]],
    ['m-algebra', [['Expression', 'A collection of terms with no equals sign.'], ['Equation', 'A statement that two expressions are equal, true for certain values.'], ['Identity', 'True for every value of the variable (≡).'], ['Substitute', 'Replace a letter with a number.']]],
    ['m-expressions', [['Expand', 'Multiply out brackets.'], ['Factorise', 'Write as a product, putting into brackets.'], ['Like terms', 'Terms with the same variables to the same powers.'], ['Coefficient', 'The number multiplying a variable.']]],
    ['m-equations', [['Linear equation', 'An equation whose highest power is 1.'], ['Simultaneous equations', 'Two or more equations satisfied by the same values.'], ['Elimination', 'Adding or subtracting equations to remove a variable.'], ['Substitution', 'Using one equation to replace a variable in another.']]],
    ['m-quadratics', [['Quadratic', 'An expression ax² + bx + c with a ≠ 0.'], ['Discriminant', 'b² − 4ac: the number of real roots.'], ['Completing the square', 'Writing a(x + p)² + q.'], ['Root', 'A value of x that makes the expression zero.']]],
    ['m-inequalities', [['Inequality', 'A statement using <, >, ≤ or ≥.'], ['Solution set', 'All values satisfying the inequality.'], ['Reversing the sign', 'Multiplying or dividing by a negative number flips the inequality.'], ['Region', 'The part of a graph satisfying inequalities.']]],
    ['m-sequences', [['Arithmetic sequence', 'A constant difference between terms.'], ['Geometric sequence', 'A constant ratio between terms.'], ['nth term', 'A formula for any term in terms of its position.'], ['Common difference', 'd, added each time in an arithmetic sequence.']]],
    ['m-proportion', [['Direct proportion', 'y = kx: doubling x doubles y.'], ['Inverse proportion', 'y = k ÷ x.'], ['Constant of proportionality', 'k.'], ['Ratio', 'A comparison of quantities, a : b.']]],
    ['m-graphs', [['Gradient', 'Change in y ÷ change in x.'], ['y-intercept', 'Where a line crosses the y-axis.'], ['Parallel lines', 'Equal gradients.'], ['Perpendicular lines', 'Gradients multiply to −1.']]],
    ['m-curves', [['Turning point', 'A maximum or minimum of a curve.'], ['Asymptote', 'A line a curve approaches but does not meet.'], ['Cubic', 'A polynomial of degree 3.'], ['Reciprocal graph', 'y = k ÷ x.']]],
    ['m-functions-gcse', [['Function', 'A rule giving exactly one output for each input.'], ['Inverse function', 'f⁻¹ undoes f.'], ['Composite function', 'fg(x) = f(g(x)).'], ['Domain', 'The set of allowed inputs.']]],
    ['m-geometry', [['Interior angle', 'An angle inside a polygon.'], ['Exterior angle', 'The angle between a side and the next side extended; they sum to 360°.'], ['Alternate angles', 'Equal angles on opposite sides of a transversal across parallel lines.'], ['Corresponding angles', 'Equal angles in matching positions at parallel lines.']]],
    ['m-similarity', [['Similar', 'Same shape: corresponding angles equal, sides in proportion.'], ['Congruent', 'Exactly the same shape and size.'], ['Scale factor', 'The ratio of corresponding lengths.'], ['Area factor', 'The square of the length scale factor.']]],
    ['m-circle-theorems', [['Tangent', 'A line touching a circle at one point; perpendicular to the radius there.'], ['Chord', 'A line joining two points on a circle.'], ['Cyclic quadrilateral', 'All four vertices on a circle; opposite angles sum to 180°.'], ['Angle in a semicircle', 'Is 90°.']]],
    ['m-mensuration', [['Perimeter', 'The distance round a shape.'], ['Surface area', 'The total area of all faces.'], ['Volume', 'The space inside a solid.'], ['Frustum', 'A cone with its top cut off parallel to the base.']]],
    ['m-trig', [['Sine', 'Opposite ÷ hypotenuse in a right-angled triangle.'], ['Cosine', 'Adjacent ÷ hypotenuse.'], ['Tangent', 'Opposite ÷ adjacent.'], ['Pythagoras’ theorem', 'a² + b² = c² in a right-angled triangle.']]],
    ['m-trig-rules', [['Sine rule', 'a ÷ sin A = b ÷ sin B = c ÷ sin C.'], ['Cosine rule', 'a² = b² + c² − 2bc cos A.'], ['Area of a triangle', '½ab sin C.'], ['Ambiguous case', 'The sine rule can give two possible angles.']]],
    ['m-transformations', [['Translation', 'A slide by a vector.'], ['Reflection', 'A mirror image in a line.'], ['Rotation', 'A turn about a centre by an angle.'], ['Enlargement', 'A change of size by a scale factor from a centre.']]],
    ['m-probability-gcse', [['Probability', 'A number from 0 to 1 giving how likely an event is.'], ['Mutually exclusive', 'Events that cannot happen together.'], ['Independent', 'One event does not affect the other: P(A and B) = P(A)P(B).'], ['Relative frequency', 'Number of successes ÷ number of trials.']]],
    ['m-statistics', [['Mean', 'Sum ÷ number of values.'], ['Median', 'The middle value in order.'], ['Interquartile range', 'Upper quartile − lower quartile.'], ['Outlier', 'A value far from the rest.']]],
    ['m-functions', [['Range', 'The set of outputs of a function.'], ['One-to-one', 'Each output comes from exactly one input; needed for an inverse.'], ['Modulus function', '|x|, the size without sign.'], ['Transformation of graphs', 'y = af(bx + c) + d shifts and stretches y = f(x).']]],
    ['m-circles', [['Equation of a circle', '(x − a)² + (y − b)² = r².'], ['Centre', 'The point (a, b).'], ['Radius', 'The distance from centre to circle.'], ['Normal to a circle', 'A line through the centre.']]],
    ['m-radians', [['Radian', 'The angle subtended by an arc equal to the radius; π rad = 180°.'], ['Arc length', 's = rθ.'], ['Sector area', 'A = ½r²θ.'], ['Small-angle approximation', 'sin θ ≈ θ, cos θ ≈ 1 − θ²/2 for small θ in radians.']]],
    ['m-trig-identities', [['Identity', 'An equation true for all values.'], ['Pythagorean identity', 'sin²θ + cos²θ = 1.'], ['Double-angle formula', 'sin 2θ = 2 sin θ cos θ.'], ['Compound-angle formula', 'sin(A ± B) = sin A cos B ± cos A sin B.']]],
    ['m-series', [['Series', 'The sum of the terms of a sequence.'], ['Sum to infinity', 'S = a ÷ (1 − r) for |r| < 1.'], ['Binomial expansion', '(1 + x)ⁿ = 1 + nx + n(n − 1)x²/2! + …'], ['Convergent', 'The partial sums approach a limit.']]],
    ['m-polynomials', [['Polynomial', 'A sum of terms axⁿ with whole-number n.'], ['Factor theorem', 'If f(a) = 0 then (x − a) is a factor.'], ['Remainder theorem', 'f(a) is the remainder on dividing by (x − a).'], ['Degree', 'The highest power.']]],
    ['m-exp-log', [['Exponential function', 'y = aˣ; eˣ is its own derivative.'], ['Logarithm', 'log_a b is the power a must be raised to give b.'], ['Natural logarithm', 'ln x = log_e x.'], ['Laws of logs', 'log(ab) = log a + log b; log(aⁿ) = n log a.']]],
    ['m-differentiation', [['Derivative', 'The gradient function dy/dx.'], ['Chain rule', 'dy/dx = dy/du × du/dx.'], ['Product rule', '(uv)′ = u′v + uv′.'], ['Stationary point', 'Where dy/dx = 0.']]],
    ['m-integration', [['Integral', 'The reverse of differentiation; a definite integral gives an area.'], ['Constant of integration', '+c in an indefinite integral.'], ['Integration by parts', '∫u dv = uv − ∫v du.'], ['Substitution', 'Changing the variable to simplify an integral.']]],
    ['m-numerical-roots', [['Change of sign', 'A root lies between a and b if f(a) and f(b) have opposite signs (f continuous).'], ['Newton–Raphson', 'xₙ₊₁ = xₙ − f(xₙ) ÷ f′(xₙ).'], ['Iteration', 'Repeating a rule to approach a solution.'], ['Convergence', 'Successive values approach a limit.']]],
    ['m-vectors', [['Vector', 'A quantity with magnitude and direction.'], ['Magnitude', '|v| = √(x² + y² + z²).'], ['Unit vector', 'A vector of magnitude 1.'], ['Scalar product', 'a·b = |a||b| cos θ.']]],
    ['m-ode1', [['Differential equation', 'An equation involving derivatives.'], ['Separation of variables', 'Collect y terms with dy and x terms with dx, then integrate.'], ['General solution', 'Includes an arbitrary constant.'], ['Particular solution', 'Fixed by an initial condition.']]],
    ['m-statics', [['Equilibrium', 'Resultant force zero (and resultant moment zero).'], ['Limiting friction', 'F = μR when about to slip.'], ['Resolving', 'Splitting forces into perpendicular components.'], ['Smooth', 'No friction.']]],
    ['m-kinematics-calc', [['Velocity', 'v = ds/dt.'], ['Acceleration', 'a = dv/dt.'], ['Displacement from velocity', 's = ∫v dt.'], ['Variable acceleration', 'Use calculus rather than suvat.']]],
    ['m-newton-mech', [['Newton’s second law', 'F = ma for a particle.'], ['Connected particles', 'Objects joined by a string moving with the same acceleration.'], ['Tension', 'The pulling force in a string.'], ['Light inextensible string', 'Massless and does not stretch: same tension, same acceleration.']]],
    ['m-momentum-mech', [['Momentum', 'mv.'], ['Impulse', 'Change in momentum: I = Ft.'], ['Conservation of momentum', 'Total momentum unchanged in a collision.'], ['Coalesce', 'Stick together after collision.']]],
    ['m-work-energy-mech', [['Work–energy principle', 'Work done by forces = change in kinetic energy.'], ['Power', 'Rate of doing work: P = Fv.'], ['Conservative', 'No energy lost to friction.'], ['Mechanical energy', 'Kinetic + potential energy.']]],
    ['m-data', [['Standard deviation', 'A measure of spread about the mean.'], ['Correlation', 'How closely two variables are linearly related.'], ['Regression line', 'The line of best fit used for prediction.'], ['Interpolation', 'Predicting within the range of the data.']]],
    ['m-combinatorics', [['Permutation', 'An ordered arrangement: ⁿPᵣ = n! ÷ (n − r)!.'], ['Combination', 'An unordered selection: ⁿCᵣ = n! ÷ (r!(n − r)!).'], ['Factorial', 'n! = n × (n − 1) × … × 1.'], ['Multiplication principle', 'Independent choices multiply.']]],
    ['m-probability-al', [['Conditional probability', 'P(A | B) = P(A ∩ B) ÷ P(B).'], ['Binomial distribution', 'X ~ B(n, p): number of successes in n independent trials.'], ['Independent events', 'P(A ∩ B) = P(A)P(B).'], ['Tree diagram', 'A diagram multiplying along branches.']]],
    ['m-discrete-rv', [['Random variable', 'A quantity whose value is decided by chance.'], ['Expectation', 'E(X) = Σx P(X = x).'], ['Variance', 'Var(X) = E(X²) − [E(X)]².'], ['Probability distribution', 'All values with their probabilities.']]],
    ['m-normal', [['Normal distribution', 'A symmetric bell-shaped continuous distribution N(μ, σ²).'], ['Standardise', 'z = (x − μ) ÷ σ.'], ['Points of inflection', 'At μ ± σ on the normal curve.'], ['68–95–99.7 rule', 'Fractions within 1, 2 and 3 standard deviations.']]],
    ['m-poisson', [['Poisson distribution', 'Counts of random events at a constant mean rate λ.'], ['Mean and variance', 'Both equal λ.'], ['Conditions', 'Events independent, singly and at a constant rate.'], ['Approximation', 'B(n, p) ≈ Po(np) for large n and small p.']]],
    ['m-linear-combinations', [['Linear combination', 'aX + bY.'], ['Expectation of a sum', 'E(aX + bY) = aE(X) + bE(Y).'], ['Variance of independent sum', 'Var(aX + bY) = a²Var(X) + b²Var(Y).'], ['Sum of normals', 'A sum of independent normals is normal.']]],
    ['m-continuous-rv', [['Probability density function', 'f(x) ≥ 0 with total area 1.'], ['Cumulative distribution function', 'F(x) = P(X ≤ x).'], ['Median', 'The value m with F(m) = 0.5.'], ['Mode', 'Where f(x) is greatest.']]],
    ['m-sampling', [['Population', 'The whole group being studied.'], ['Sample', 'A subset used to make inferences.'], ['Standard error', 'σ ÷ √n: the spread of the sample mean.'], ['Central limit theorem', 'Sample means are approximately normal for large n.']]],
    ['m-hypothesis', [['Null hypothesis', 'H₀: the default claim tested.'], ['Significance level', 'The probability of rejecting a true H₀.'], ['Critical region', 'Values of the test statistic that lead to rejecting H₀.'], ['p-value', 'The probability of a result at least as extreme as observed, if H₀ is true.']]],
    ['m-roots-poly', [['Roots of a polynomial', 'Values making it zero; sum and products relate to coefficients.'], ['Vieta’s formulas', 'For ax² + bx + c: α + β = −b/a, αβ = c/a.'], ['Complex conjugate roots', 'Real polynomials have non-real roots in conjugate pairs.']]],
    ['m-rational-graphs', [['Rational function', 'A ratio of polynomials.'], ['Vertical asymptote', 'Where the denominator is zero and the numerator is not.'], ['Oblique asymptote', 'A slanted asymptote when the numerator’s degree is one more.']]],
    ['m-summation', [['Sigma notation', 'Σ for a sum over an index.'], ['Standard results', 'Σr = n(n + 1)/2, Σr² = n(n + 1)(2n + 1)/6.'], ['Method of differences', 'Writing terms as f(r) − f(r + 1) so most cancel.']]],
    ['m-induction', [['Proof by induction', 'Prove a base case, then that case k implies case k + 1.'], ['Base case', 'The first value, usually n = 1.'], ['Inductive step', 'Assuming true for k and proving for k + 1.']]],
    ['m-matrix-transforms', [['Determinant', 'For a 2 × 2 matrix, ad − bc: the area scale factor.'], ['Inverse matrix', 'M⁻¹ with MM⁻¹ = I.'], ['Singular matrix', 'Determinant zero: no inverse.'], ['Invariant line', 'A line mapped to itself.']]],
    ['m-polar', [['Polar coordinates', '(r, θ): distance and angle from the origin.'], ['Conversion', 'x = r cos θ, y = r sin θ.'], ['Area in polar', '½∫r² dθ.']]],
    ['m-planes', [['Vector equation of a line', 'r = a + λd.'], ['Equation of a plane', 'r·n = d.'], ['Normal vector', 'Perpendicular to the plane.'], ['Skew lines', 'Neither parallel nor intersecting.']]],
    ['m-hyperbolic', [['cosh', '(eˣ + e⁻ˣ) ÷ 2.'], ['sinh', '(eˣ − e⁻ˣ) ÷ 2.'], ['Osborn’s rule', 'Turn trig identities into hyperbolic ones by flipping the sign of products of two sines.']]],
    ['m-reduction', [['Reduction formula', 'Relates Iₙ to Iₙ₋₁ or Iₙ₋₂.'], ['Integration by parts', 'The usual way to derive one.']]],
    ['m-de-moivre', [['De Moivre’s theorem', '(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ.'], ['Roots of unity', 'Solutions of zⁿ = 1, equally spaced on the unit circle.'], ['Exponential form', 'z = re^(iθ).']]],
    ['m-fm-projectiles', [['Projectile', 'A particle moving under gravity alone.'], ['Time of flight', 'The time until it lands.'], ['Trajectory equation', 'y in terms of x, eliminating t.']]],
    ['m-rigid-equilibrium', [['Rigid body', 'An object that does not deform.'], ['Moment', 'Force × perpendicular distance.'], ['Ladder problem', 'Equilibrium using forces and moments with friction.']]],
    ['m-vertical-circle', [['Vertical circle', 'Circular motion with gravity: speed varies round the circle.'], ['Condition to complete the circle', 'Tension (or reaction) must stay ≥ 0 at the top.'], ['Energy conservation', 'Relates speeds at different heights.']]],
    ['m-elastic', [['Hooke’s law', 'T = λx ÷ l.'], ['Modulus of elasticity', 'λ, in newtons.'], ['Elastic potential energy', 'λx² ÷ 2l.']]],
    ['m-variable-force', [['Variable force', 'A force depending on position, velocity or time.'], ['v dv/dx', 'Acceleration written to integrate with respect to x.'], ['Impulse integral', '∫F dt.']]],
    ['m-restitution', [['Coefficient of restitution', 'e = speed of separation ÷ speed of approach.'], ['Perfectly elastic', 'e = 1: no kinetic energy lost.'], ['Oblique impact', 'Only the normal component changes with e.']]],
    ['m-t-tests', [['t-distribution', 'Used for the mean when σ is estimated from a small sample.'], ['Degrees of freedom', 'n − 1 for a one-sample t-test.'], ['Paired t-test', 'Tests the mean of differences.']]],
    ['m-chi-squared', [['Chi-squared test', 'Compares observed and expected frequencies: Σ(O − E)² ÷ E.'], ['Contingency table', 'Counts classified by two factors.'], ['Expected frequency', 'Row total × column total ÷ grand total.']]],
    ['m-nonparametric', [['Non-parametric test', 'Makes no assumption about the distribution.'], ['Sign test', 'Uses only the signs of differences.'], ['Wilcoxon test', 'Uses ranks of differences.']]],
    ['m-pgf', [['Probability generating function', 'G(t) = E(tˣ).'], ['Mean from a PGF', 'E(X) = G′(1).'], ['Sum of independent variables', 'PGFs multiply.']]],
    ['m-limits', [['Limit', 'The value a function approaches.'], ['Continuity', 'The limit equals the value at the point.'], ['ε–δ definition', 'For every ε there is a δ that keeps f within ε.']]],
    ['m-convergence', [['Convergent series', 'Partial sums tend to a finite limit.'], ['Ratio test', 'Converges if lim|aₙ₊₁/aₙ| < 1.'], ['Absolute convergence', 'Σ|aₙ| converges.'], ['Radius of convergence', 'The power series converges for |x| < R.']]],
    ['m-complex', [['Imaginary unit', 'i with i² = −1.'], ['Modulus', '|z| = √(a² + b²).'], ['Argument', 'The angle of z from the positive real axis.'], ['Complex conjugate', 'z* = a − bi.'], ['Argand diagram', 'A plane plot of complex numbers.']]],
    ['m-taylor', [['Taylor series', 'f(a + h) = Σf⁽ⁿ⁾(a)hⁿ ÷ n!.'], ['Maclaurin series', 'A Taylor series about 0.'], ['Remainder', 'The error after truncating the series.']]],
    ['m-partial', [['Partial derivative', 'The derivative with respect to one variable, others held fixed.'], ['Total differential', 'df = (∂f/∂x)dx + (∂f/∂y)dy.'], ['Chain rule (several variables)', 'Sum over each path of dependence.']]],
    ['m-curvilinear', [['Curvilinear coordinates', 'Coordinates such as polar, cylindrical, spherical.'], ['Jacobian', 'The determinant that rescales area or volume elements.'], ['Scale factors', 'h_i giving lengths along coordinate lines.']]],
    ['m-multiple', [['Double integral', 'Integration over an area.'], ['Order of integration', 'Can be swapped with the limits redrawn (Fubini).'], ['Volume element', 'dV = r² sin θ dr dθ dφ in spherical coordinates.']]],
    ['m-line-integrals', [['Line integral', '∫F·dr along a curve.'], ['Conservative field', 'F = ∇φ: path-independent integrals.'], ['Circulation', '∮F·dr round a closed loop.']]],
    ['m-vector-spaces', [['Vector space', 'A set closed under addition and scalar multiplication.'], ['Basis', 'A linearly independent spanning set.'], ['Dimension', 'The number of vectors in a basis.'], ['Linear independence', 'No vector is a combination of the others.']]],
    ['m-matrices', [['Matrix', 'A rectangular array representing a linear map.'], ['Transpose', 'Rows and columns swapped.'], ['Trace', 'The sum of the diagonal entries.'], ['Rank', 'The number of independent rows or columns.']]],
    ['m-eigen', [['Eigenvalue', 'λ with Av = λv for a non-zero v.'], ['Eigenvector', 'A direction unchanged by the map.'], ['Characteristic equation', 'det(A − λI) = 0.'], ['Diagonalisation', 'A = PDP⁻¹.']]],
    ['m-svd', [['Singular value decomposition', 'A = UΣVᵀ.'], ['Singular values', 'Square roots of the eigenvalues of AᵀA.'], ['Low-rank approximation', 'Keep the largest singular values.']]],
    ['m-ode2', [['Second-order linear ODE', 'ay″ + by′ + cy = f(x).'], ['Auxiliary equation', 'am² + bm + c = 0.'], ['Complementary function', 'The general solution with f = 0.'], ['Particular integral', 'Any one solution with the forcing term.']]],
    ['m-ode-systems', [['System of ODEs', 'Coupled equations x′ = Ax.'], ['Phase portrait', 'Trajectories in the state plane.'], ['Fixed point', 'Where all derivatives vanish.']]],
    ['m-laplace', [['Laplace transform', 'F(s) = ∫₀^∞ f(t)e^(−st) dt.'], ['Transform of a derivative', 'L{f′} = sF(s) − f(0).'], ['Inverse transform', 'Recovers f(t), often by partial fractions.']]],
    ['m-divcurl', [['Gradient', '∇f: the direction of steepest increase.'], ['Divergence', '∇·F: net outflow per unit volume.'], ['Curl', '∇ × F: circulation per unit area.'], ['Laplacian', '∇²f = ∇·∇f.']]],
    ['m-theorems', [['Divergence theorem', '∮F·dA = ∫∇·F dV.'], ['Stokes’ theorem', '∮F·dr = ∫(∇ × F)·dA.'], ['Green’s theorem', 'The plane version of Stokes.']]],
    ['m-delta', [['Dirac delta', 'δ(x): zero except at 0, with ∫δ = 1.'], ['Sifting property', '∫f(x)δ(x − a)dx = f(a).'], ['Heaviside step', 'Its derivative is δ.']]],
    ['m-fourier-series', [['Fourier series', 'A periodic function as Σ(aₙ cos nx + bₙ sin nx).'], ['Gibbs phenomenon', 'An overshoot near a jump that does not vanish.'], ['Orthogonality', '∫ sin mx sin nx dx = 0 for m ≠ n over a period.']]],
    ['m-fourier-transform', [['Fourier transform', 'Decomposes a function into frequencies.'], ['Inverse transform', 'Rebuilds f from its spectrum.'], ['Uncertainty relation', 'Narrow in x means wide in k.']]],
    ['m-dft', [['Discrete Fourier transform', 'The transform of N samples.'], ['Fast Fourier transform', 'An O(N log N) algorithm for the DFT.'], ['Aliasing', 'High frequencies appearing as low ones when sampling is too slow.'], ['Nyquist frequency', 'Half the sampling rate.']]],
    ['m-pde', [['Partial differential equation', 'An equation in partial derivatives.'], ['Boundary conditions', 'Values fixed on the boundary.'], ['Elliptic, parabolic, hyperbolic', 'The three classes, e.g. Laplace, diffusion, wave.']]],
    ['m-separation', [['Separation of variables', 'Try u = X(x)T(t) to split a PDE into ODEs.'], ['Separation constant', 'The constant both sides must equal.'], ['Eigenfunction expansion', 'The solution as a sum of the separated modes.']]],
    ['m-variations', [['Functional', 'A map from functions to numbers, e.g. an integral.'], ['Euler–Lagrange equation', 'The condition for a functional to be stationary.'], ['Brachistochrone', 'The curve of fastest descent: a cycloid.']]],
    ['m-lagrange-mult', [['Lagrange multiplier', 'λ with ∇f = λ∇g at a constrained extremum.'], ['Constraint', 'g(x) = c restricting the variables.'], ['Lagrangian function', 'f − λ(g − c).']]],
    ['m-probability', [['Sample space', 'All possible outcomes.'], ['Bayes’ theorem', 'P(A | B) = P(B | A)P(A) ÷ P(B).'], ['Independence', 'P(A ∩ B) = P(A)P(B).']]],
    ['m-statistics-uni', [['Estimator', 'A rule for estimating a parameter from data.'], ['Bias', 'E(estimator) − true value.'], ['Maximum likelihood', 'Choose parameters that make the data most probable.'], ['Confidence interval', 'An interval that contains the parameter in a stated fraction of repeated samples.']]],
    ['m-random-walks', [['Random walk', 'A path of random steps.'], ['Diffusion', '⟨x²⟩ grows linearly with time.'], ['RMS displacement', '√N step lengths after N steps.']]],
    ['m-hilbert', [['Hilbert space', 'A complete inner-product space.'], ['Orthonormal basis', 'Unit vectors, mutually orthogonal, spanning the space.'], ['Self-adjoint operator', 'Equal to its adjoint.']]],
    ['m-complex-analysis', [['Analytic function', 'Complex-differentiable in a region.'], ['Cauchy–Riemann equations', 'uₓ = v_y, u_y = −vₓ.'], ['Residue', 'The coefficient of 1/(z − a) in the Laurent series.'], ['Contour integral', '∮f dz = 2πi Σ residues.']]],
    ['m-conformal', [['Conformal map', 'Preserves angles locally.'], ['Möbius transformation', '(az + b) ÷ (cz + d).'], ['Joukowski map', 'z + 1/z: turns circles into aerofoils.']]],
    ['m-branch-cuts', [['Branch point', 'A point round which a function changes value.'], ['Branch cut', 'A line removed to make a multivalued function single-valued.'], ['Principal value', 'The chosen branch.']]],
    ['m-green', [['Green’s function', 'The response to a point source: L G = δ.'], ['Superposition', 'u = ∫G(x, x′)f(x′)dx′.'], ['Boundary conditions', 'G must satisfy them too.']]],
    ['m-integral-equations', [['Fredholm equation', 'Fixed integration limits.'], ['Volterra equation', 'Variable upper limit.'], ['Kernel', 'The function K(x, t) inside the integral.']]],
    ['m-tensors', [['Tensor', 'An object transforming linearly under coordinate changes.'], ['Rank', 'The number of indices.'], ['Summation convention', 'A repeated index is summed.'], ['Metric', 'gᵢⱼ: converts between upper and lower indices.']]],
    ['m-nonlinear', [['Nonlinear system', 'Superposition fails.'], ['Linearisation', 'Approximating near a fixed point by the Jacobian.'], ['Limit cycle', 'An isolated closed orbit.']]],
    ['m-perturbation-methods', [['Regular perturbation', 'A power series in a small parameter works uniformly.'], ['Singular perturbation', 'The small parameter multiplies the highest derivative: boundary layers.'], ['Matched asymptotics', 'Join inner and outer solutions.']]],
    ['m-wkb', [['WKB approximation', 'ψ ≈ A(x)e^(iS(x)/ħ) for slowly varying potentials.'], ['Connection formulae', 'Join solutions across a turning point.'], ['Bohr–Sommerfeld rule', '∮p dx = (n + ½)h.']]],
    ['m-numerical', [['Truncation error', 'Error from cutting off an approximation.'], ['Round-off error', 'Error from finite precision arithmetic.'], ['Trapezium rule', 'Approximates an integral with straight-line segments.']]],
    ['m-finite-difference', [['Finite difference', 'A derivative replaced by differences of grid values.'], ['Central difference', '(f(x + h) − f(x − h)) ÷ 2h, error O(h²).'], ['Stability', 'Errors must not grow, e.g. the CFL condition.']]],
    ['m-monte-carlo', [['Monte Carlo method', 'Estimating results by random sampling.'], ['Statistical error', 'Falls as 1 ÷ √N.'], ['Importance sampling', 'Sample more where the integrand matters most.']]],
    ['m-special', [['Special function', 'A named solution of an important differential equation.'], ['Orthogonality', 'Integrals of products vanish with a weight function.'], ['Recurrence relation', 'Connects neighbouring members of a family.']]],
    ['m-frobenius', [['Frobenius method', 'A series solution xˢΣaₙxⁿ about a regular singular point.'], ['Indicial equation', 'The equation for the leading power s.'], ['Regular singular point', 'Where the coefficients blow up mildly.']]],
    ['m-gamma', [['Gamma function', 'Γ(z) = ∫₀^∞ t^(z−1)e^(−t) dt; Γ(n) = (n − 1)!.'], ['Reflection formula', 'Γ(z)Γ(1 − z) = π ÷ sin πz.'], ['Stirling’s approximation', 'n! ≈ √(2πn)(n/e)ⁿ.']]],
    ['m-erf', [['Error function', 'erf(x) = (2/√π)∫₀ˣ e^(−t²) dt.'], ['Complementary error function', 'erfc = 1 − erf.'], ['Gaussian integral', '∫e^(−x²)dx = √π over the whole line.']]],
    ['m-expint', [['Exponential integral', 'E₁(x) = ∫ₓ^∞ e^(−t)/t dt.'], ['Asymptotic expansion', 'A divergent series that is still useful when truncated.']]],
    ['m-legendre', [['Legendre polynomials', 'Pₙ(x): solutions of Legendre’s equation, orthogonal on [−1, 1].'], ['Rodrigues’ formula', 'Pₙ = (1/2ⁿn!) dⁿ/dxⁿ (x² − 1)ⁿ.'], ['Associated Legendre functions', 'Pₗᵐ, used in spherical harmonics.']]],
    ['m-bessel', [['Bessel functions', 'Jₙ(x), solutions of Bessel’s equation in cylindrical problems.'], ['Zeros of Bessel functions', 'Set the modes of a drum.'], ['Neumann function', 'Yₙ, the second solution, singular at 0.']]],
    ['m-bessel-modified', [['Modified Bessel functions', 'Iₙ and Kₙ: growing and decaying solutions.'], ['Imaginary argument', 'Iₙ(x) relates to Jₙ(ix).']]],
    ['m-spherical-bessel', [['Spherical Bessel functions', 'jₗ(x): radial solutions in spherical problems.'], ['Partial waves', 'Scattering expansions in jₗ and spherical harmonics.']]],
    ['m-hermite', [['Hermite polynomials', 'Hₙ(x), orthogonal with weight e^(−x²).'], ['Quantum oscillator', 'Eigenfunctions are Hₙ(ξ)e^(−ξ²/2).'], ['Generating function', 'e^(2xt − t²) = ΣHₙ(x)tⁿ/n!.']]],
    ['m-laguerre', [['Laguerre polynomials', 'Lₙ(x), orthogonal with weight e^(−x) on [0, ∞).'], ['Hydrogen radial functions', 'Built from associated Laguerre polynomials.']]],
    ['m-orthopoly', [['Orthogonal polynomials', 'Families orthogonal with a weight on an interval.'], ['Three-term recurrence', 'Every family satisfies one.'], ['Gaussian quadrature', 'Uses their zeros as integration points.']]],
    ['m-airy', [['Airy functions', 'Ai and Bi: solutions of y″ = xy.'], ['Turning point', 'Airy functions describe waves near one.']]],
    ['m-hypergeometric', [['Hypergeometric function', '₂F₁(a, b; c; z), solving the hypergeometric equation.'], ['Pochhammer symbol', '(a)ₙ = a(a + 1)…(a + n − 1).']]],
    ['m-confluent', [['Confluent hypergeometric function', '₁F₁(a; b; z), Kummer’s function.'], ['Kummer’s equation', 'zy″ + (b − z)y′ − ay = 0.']]],
    ['m-mathieu', [['Mathieu equation', 'y″ + (a − 2q cos 2x)y = 0.'], ['Stability chart', 'Regions of (a, q) with bounded or growing solutions.'], ['Parametric resonance', 'Instability from periodic variation of a parameter.']]],
    ['m-elliptic', [['Elliptic integral', 'An integral involving the square root of a cubic or quartic.'], ['Complete elliptic integral', 'K(k): gives the exact pendulum period.']]],
    ['m-jacobi', [['Jacobi elliptic functions', 'sn, cn, dn: inverses of elliptic integrals.'], ['Double periodicity', 'They repeat in two directions in the complex plane.']]],
    ['m-theta', [['Theta function', 'ϑ(z, τ): a quasi-periodic series.'], ['Modular transformation', 'Relates theta functions at τ and −1/τ.']]],
    ['m-zeta', [['Riemann zeta function', 'ζ(s) = Σn^(−s) for Re s > 1, continued elsewhere.'], ['Euler product', 'ζ(s) = Π(1 − p^(−s))⁻¹ over primes.'], ['Riemann hypothesis', 'Non-trivial zeros lie on Re s = ½.']]],
    ['m-diffgeo', [['Manifold', 'A space that looks locally like ℝⁿ.'], ['Tangent space', 'The vector space of directions at a point.'], ['Curvature', 'How a space deviates from flatness.']]],
    ['m-forms', [['Differential form', 'An antisymmetric object integrated over curves, surfaces, volumes.'], ['Exterior derivative', 'd, with d² = 0.'], ['Stokes’ theorem (general)', '∫_M dω = ∫_∂M ω.']]],
    ['m-topology', [['Topological space', 'A set with a notion of open sets.'], ['Homeomorphism', 'A continuous bijection with continuous inverse.'], ['Homotopy', 'A continuous deformation of one map into another.']]],
    ['m-bundles', [['Fibre bundle', 'A space that locally looks like a product of base and fibre.'], ['Connection', 'A rule for comparing fibres at nearby points.'], ['Section', 'A choice of a point in each fibre.']]],
    ['m-groups', [['Group', 'A set with an associative operation, identity and inverses.'], ['Subgroup', 'A subset that is itself a group.'], ['Homomorphism', 'A map preserving the operation.'], ['Abelian', 'Commutative.']]],
    ['m-representations', [['Representation', 'A homomorphism from a group to matrices.'], ['Irreducible representation', 'Has no non-trivial invariant subspace.'], ['Character', 'The trace of the representing matrix.']]],
    ['m-lie', [['Lie group', 'A group that is also a smooth manifold.'], ['Lie algebra', 'The tangent space at the identity, with the commutator bracket.'], ['Generator', 'An element of the Lie algebra; exponentiates to the group.']]],
    ['m-functional', [['Banach space', 'A complete normed vector space.'], ['Bounded operator', '‖Ax‖ ≤ C‖x‖.'], ['Spectrum', 'Values λ where A − λ is not invertible.']]],
    ['m-path-integral', [['Path integral', 'A sum over all paths weighted by e^(iS/ħ).'], ['Stationary phase', 'The classical path dominates when S ≫ ħ.'], ['Propagator', 'K(x_f, t_f; x_i, t_i), the amplitude to travel between points.']]],
    ['m-asymptotics', [['Asymptotic expansion', 'An approximation that improves as a parameter grows.'], ['Laplace’s method', 'Approximates ∫e^(Mf(x))dx near the maximum of f.'], ['Steepest descent', 'Deforms contours through saddle points.']]],
  ].forEach(([id, L]) => T(id, L));
})();
/* Geodesic — your activity, part 1 (always loaded): a small tracker. For the signed-in account, and only in this
   browser, it keeps per day: how long the site was in active use and in which area, which topic pages held that time,
   how many pages were opened, how many AI requests were made (counts only, never their text), and the day's rise in
   progress counts that have no dates of their own (competition problems, olympiad parts, lectures, Feynman chapters,
   practicals, study steps). Time counts only while the tab is visible and someone has used it in the last two minutes,
   or a film or narration is playing. The #activity page itself (js/activity.js) loads on demand. */
(function () {
  const WL = (window.WL = window.WL || {});
  const ukey = (b) => { const A = WL.auth; return b + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
  const day = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  /* every change reads the record afresh and writes it straight back, so two open tabs add to it rather than overwrite each other */
  const load = () => { const s = Object.assign({ v: 1, d: {}, last: null, sum: {}, since: 0 }, read(ukey('wl-act'), {}) || {}); if (!s.since) s.since = Date.now(); return s; };
  const write = (s) => { const keys = Object.keys(s.d).sort(); if (keys.length > 430) keys.slice(0, keys.length - 430).forEach((k) => delete s.d[k]); try { localStorage.setItem(ukey('wl-act'), JSON.stringify(s)); } catch (e) {} };
  const mutate = (fn) => { const s = load(); fn(s); write(s); return s; };
  const todayOf = (s) => { const k = day(); return s.d[k] || (s.d[k] = { t: 0, a: {}, n: 0, v: {}, ai: {}, tp: {}, m: {} }); };
  const on = () => !WL.auth || !!WL.auth.entered;
  const hash = () => { try { return decodeURIComponent((location.hash || '').slice(1)); } catch (e) { return ''; } };

  /* where a page belongs */
  const AREAS = [['physics', 'Physics'], ['maths', 'Maths'], ['lectures', 'Lectures'], ['feynman', 'Feynman'], ['practise', 'Review, tests and practicals'], ['olympiad', 'Olympiad'], ['compete', 'Maths competitions'], ['research', 'Research'], ['advanced', 'Advanced lessons'], ['syllabus', 'Syllabus'], ['other', 'Home and other pages']];
  function areaOf(h) {
    h = h || '';
    if (h.startsWith('t-')) { const n = WL.app && WL.app.nodes && WL.app.nodes[h.slice(2)]; return n && n.track === 'maths' ? 'maths' : 'physics'; }
    if (/^(physics|roadmap|stage-)/.test(h)) return 'physics';
    if (/^(maths|mstage-)/.test(h)) return 'maths';
    if (/^lecture/.test(h)) return 'lectures';
    if (/^feynman/.test(h)) return 'feynman';
    if (/^(review|test|practicals|prac-)/.test(h)) return 'practise';
    if (/^oly/.test(h)) return 'olympiad';
    if (/^(compete|cl-|cmock-)/.test(h)) return 'compete';
    if (/^(research|inv$|lab|rplan-)/.test(h)) return 'research';
    if (/^adv/.test(h)) return 'advanced';
    if (/^coverage/.test(h)) return 'syllabus';
    return 'other';
  }

  /* progress counts kept elsewhere without dates: the tracker notes how much each rose today */
  function metrics() {
    const cnt = (o, f) => Object.values(o || {}).filter(f).length;
    const L = read(ukey('wl-learn'), {}) || {}, comp = read(ukey('wl-comp'), {}) || {}, olyp = read(ukey('wl-olyp'), {}) || {}, oly = read(ukey('wl-oly'), {}) || {};
    const lec = read(ukey('wl-lec-p'), {}) || {}, fey = read(ukey('wl-flp'), []) || [], prac = read('wl-prac', {}) || {};
    return {
      comp: cnt(comp.p, (s) => s && (s.ok || s.self)),
      olyp: Object.values(olyp).reduce((n, P) => n + cnt((P || {}).parts, (s) => s && s.ok), 0),
      oly: cnt(oly.sk, (v) => v === 'correct'),
      lec: cnt(lec, (p) => p && p.done),
      fey: Array.isArray(fey) ? fey.length : 0,
      prac: cnt(prac, (r) => r && r.parts && Object.values(r.parts).some((p) => p && p.rows && p.rows.length)),
      study: Object.values(L.s || {}).reduce((n, x) => n + Object.keys(x || {}).length, 0)
    };
  }
  function deltas(s) {
    const m = metrics();
    if (s.last) { const D = todayOf(s); Object.keys(m).forEach((k) => { const d = m[k] - (s.last[k] || 0); if (d > 0) D.m[k] = (D.m[k] || 0) + d; }); }
    s.last = m;
  }

  /* active time, in 15-second steps */
  let lastIn = Date.now(), ticks = 0;
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'scroll', 'touchstart'].forEach((e) => addEventListener(e, () => { lastIn = Date.now(); }, { passive: true, capture: true }));
  const playing = () => [...document.querySelectorAll('video, audio')].some((v) => !v.paused && !v.ended) || !!(window.speechSynthesis && speechSynthesis.speaking);
  const STEP = 15;
  setInterval(() => {
    if (!on() || document.visibilityState !== 'visible') return;
    if (Date.now() - lastIn > 120000 && !playing()) return;
    const h = hash(), a = areaOf(h), dl = ++ticks % 4 === 0;
    mutate((s) => {
      const D = todayOf(s); D.t += STEP; D.a[a] = (D.a[a] || 0) + STEP;
      if (h.startsWith('t-')) { const id = h.slice(2); if (D.tp[id] != null || Object.keys(D.tp).length < 80) D.tp[id] = (D.tp[id] || 0) + STEP; }
      if (dl) deltas(s);
    });
  }, STEP * 1000);

  /* pages opened */
  function visit() { if (!on()) return; const a = areaOf(hash()); lastIn = Date.now(); mutate((s) => { const D = todayOf(s); D.n++; D.v[a] = (D.v[a] || 0) + 1; deltas(s); }); }
  addEventListener('hashchange', visit);
  if (WL.auth && WL.auth.onEnter) WL.auth.onEnter(visit); else visit();

  /* AI requests: counted by area, never their content */
  function hookAI() {
    if (!WL.ai || WL.ai.__act) return;
    const ask = WL.ai.ask;
    WL.ai.ask = function (system) {
      try { if (on() && !/^You are a connection test/.test(String(system || ''))) { const a = areaOf(hash()); mutate((s) => { const D = todayOf(s); D.ai[a] = (D.ai[a] || 0) + 1; }); } } catch (e) {}
      return ask.apply(this, arguments);
    };
    WL.ai.__act = 1;
  }
  hookAI(); addEventListener('load', hookAI);
  addEventListener('pagehide', () => { if (on()) mutate(deltas); });

  WL.act = { st: load, mutate, day, today: () => todayOf(load()), areaOf, AREAS, metrics, ukey, read, flush: () => { if (on()) mutate(deltas); } };

  /* the page */
  let pageP = null;
  const need = () => pageP || (pageP = new Promise((res, rej) => {
    if (WL.actPage) { res(); return; }
    const s = document.createElement('script'); s.src = 'js/activity.js'; s.async = true;
    s.onload = () => res(); s.onerror = () => { pageP = null; rej(new Error('load')); }; document.head.appendChild(s);
  }));
  WL.pages = WL.pages || {};
  WL.pages.activity = { match: (h) => h === 'activity', nav: '', render: (h, view) => {
    document.title = 'Your activity · Geodesic';
    view.innerHTML = '<section class="act"><p class="muted">Loading…</p></section>';
    need().then(() => { if (location.hash === '#activity') WL.actPage(view); }, () => { view.innerHTML = '<section class="act"><p>Your activity could not load. Check your connection and reload the page.</p></section>'; });
  } };
})();
/* Geodesic — "Teach me something advanced": routes only. #advanced is the start page, #adv-from-<topic id> starts from a
   topic page, #adv-<lesson id> is a lesson. The page code (js/advanced.js) loads on first visit. */
(function () {
  const WL = (window.WL = window.WL || {});
  WL.pages = WL.pages || {};
  let p = null;
  const need = () => p || (p = new Promise((res, rej) => {
    if (WL.adv) { res(); return; }
    const s = document.createElement('script'); s.src = 'js/advanced.js'; s.async = true;
    s.onload = () => res(); s.onerror = () => { p = null; rej(new Error('load')); }; document.head.appendChild(s);
  }));
  WL.pages.advanced = { match: (h) => h === 'advanced' || /^adv-/.test(h), nav: 'advanced', render: (h, view) => {
    document.title = 'Teach me something advanced · Geodesic';
    view.innerHTML = '<section class="adv"><p class="muted">Loading…</p></section>';
    need().then(() => { if (('#' + h) === decodeURIComponent(location.hash)) WL.adv.render(h, view); }, () => { view.innerHTML = '<section class="adv"><p>This page could not load. Check your connection and reload.</p></section>'; });
  } };
})();
/* Geodesic — the AI at work, made visible.
   Every request to WL.ai.ask becomes a job with a live status: which AI is being asked, whether it is still thinking or
   already writing, how many words have arrived, and the seconds so far. The status shows
   · as a thin line moving along the top of the window while any job runs;
   · as a spinner on the button that started the job;
   · beside the page's own waiting indicator (.dots, .spin or .aiw-orb), as "Claude is writing · 214 words · 9 s";
   · in a small pill in the corner whenever none of those is on screen; pressing it scrolls back to the work.
   The AI reports no percentage, so none is invented: only things that have really happened are shown.
   WL.aiw.row(text) gives a waiting line that the status attaches to; WL.aiw.strs and WL.aiw.keys read JSON while it
   is still arriving, so a page can show a plan's items as they are written. */
(function () {
  const WL = (window.WL = window.WL || {});
  const jobs = new Map(); let seq = 0, tick = 0, raf = 0, lastBtn = null, lastAt = 0;
  const now = () => Date.now();
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const words = (t) => (String(t || '').match(/\S+/g) || []).length;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SEL = '.dots, .spin, .aiw-orb';
  const NOBTN = '#chat-form, .rp-form, .cc-form, #aiw-pill, [data-aiw-skip]';   // send buttons that turn into Stop buttons
  const GENERIC = /^(send|start|go|ok|stop|retry|try again|again|ask|submit|yes|next|check|check it)$/i;

  /* the button the reader last pressed: the job it starts gets its spinner and its name */
  const press = (b) => { if (b && b.isConnected && !b.closest(NOBTN)) { lastBtn = b; lastAt = now(); } };
  addEventListener('pointerdown', (e) => press(e.target.closest && e.target.closest('button, .btn, [role="button"]')), true);
  addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') press(e.target.closest && e.target.closest('button, .btn, [role="button"]')); }, true);
  addEventListener('submit', (e) => press(e.submitter), true);
  const nameOf = (b) => { const t = String((b && b.textContent) || '').replace(/\s+/g, ' ').trim(); return t && t.length <= 60 && !GENERIC.test(t) ? t : ''; };

  /* ---------- the page furniture: the line along the top, the pill, and a quiet announcement for screen readers ---------- */
  let line = null, pill = null, sr = null;
  function furniture() {
    if (line) return;
    line = document.createElement('div'); line.id = 'aiw-line'; line.setAttribute('aria-hidden', 'true');
    pill = document.createElement('div'); pill.id = 'aiw-pill'; pill.hidden = true;
    pill.innerHTML = '<span class="aiw-orb" aria-hidden="true"></span><span class="aiw-pt"><b></b><span class="aiw-ps"></span></span>';
    sr = document.createElement('p'); sr.className = 'vh'; sr.setAttribute('role', 'status'); sr.setAttribute('aria-live', 'polite');
    document.body.append(line, pill, sr);
    const go = () => { const j = jobs.get(+pill.dataset.job), el = j && target(j); if (el) el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); };
    pill.addEventListener('click', go);
    pill.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  }
  const say = (t) => { if (sr && sr.textContent !== t) sr.textContent = t; };

  /* ---------- jobs ---------- */
  function bind(j) {
    if (j.done) return;
    document.querySelectorAll(SEL).forEach((el) => {
      if (el.dataset.aiw || !el.isConnected || el.closest('#aiw-pill')) return;
      const host = el.parentElement; if (!host) return;
      el.dataset.aiw = String(j.id);
      if (!j.task) { const t = host.textContent.replace(/\s+/g, ' ').trim().replace(/[.…:;]+$/, ''); if (t && t.length <= 90) j.task = t; }
      let m = host.querySelector(':scope > .aiw-meta');
      if (!m) { m = document.createElement('span'); m.className = 'aiw-meta'; m.setAttribute('aria-hidden', 'true'); host.appendChild(m); }
      j.metas.push(m); j.hosts.push(host);
    });
  }
  function begin(o) {
    furniture();
    const j = { id: ++seq, t0: now(), k: 'start', who: '', n: 0, w: 0, t1: 0, until: 0, note: '', noteTo: 0, task: o.task || '', metas: [], hosts: [], el: o.live || null, btn: null, done: false };
    if (lastBtn && now() - lastAt < 2500 && lastBtn.isConnected) {
      j.btn = lastBtn; if (!j.task) j.task = nameOf(lastBtn);
      lastBtn.classList.add('aiw-busy'); lastBtn.setAttribute('aria-busy', 'true');
    }
    lastBtn = null;                                   // one press, one spinner
    jobs.set(j.id, j); bind(j);
    requestAnimationFrame(() => { bind(j); paint(); });
    if (!tick) tick = setInterval(paint, 500);
    paint(); return j;
  }
  function status(j, e) {
    if (!e || j.done) return;
    if (e.k === 'try') { j.k = 'try'; if (e.who) j.who = e.who; say(`Asking ${j.who}.`); }
    else if (e.k === 'open') { j.k = 'open'; }
    else if (e.k === 'queue') { j.k = 'queue'; j.until = now() + (e.ms || 0); say('Waiting for the free AI.'); }
    else if (e.k === 'fallback') { j.note = `${e.who} ${e.why}; asking ${e.next}`; j.noteTo = now() + 3000; j.n = 0; j.w = 0; }
    paint();
  }
  function text(j, t) {
    if (j.done) return;
    const s = String(t || '');
    if (!j.n && s) { j.t1 = now(); say(`${j.who || 'The AI'} is writing.`); }
    j.n = s.length; j.w = words(s);
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); });
  }
  function end(j) {
    if (j.done) return;
    j.done = true; jobs.delete(j.id);
    if (j.btn) { j.btn.classList.remove('aiw-busy'); j.btn.removeAttribute('aria-busy'); }
    j.metas.forEach((m) => m.remove());
    if (!jobs.size) { clearInterval(tick); tick = 0; say(''); }
    paint();
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function phase(j) {
    const s = Math.floor((now() - j.t0) / 1000), who = j.who || 'the AI';
    let t;
    if (j.noteTo > now()) t = cap(j.note);
    else if (j.n) t = `${cap(who)} is writing · ${j.w} word${j.w === 1 ? '' : 's'}`;
    else if (j.k === 'queue') t = `In the free AI’s queue · ${Math.max(1, Math.ceil((j.until - now()) / 1000))} s to go`;
    else if (j.k === 'open') t = `${cap(who)} is thinking`;
    else if (j.k === 'try') t = `Asking ${who}`;
    else t = 'Getting ready';
    return `${t} · ${s} s`;
  }

  /* where the work is on the page, and whether the reader can see it */
  const seen = (el) => { if (!el || !el.isConnected) return false; const r = el.getBoundingClientRect(); return (r.width || r.height) && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const target = (j) => j.hosts.find((h) => h.isConnected) || (j.el && j.el.isConnected ? j.el : null) || (j.btn && j.btn.isConnected ? j.btn : null);
  function paint() {
    if (!line) return;
    let show = null, hidden = 0;
    for (const j of jobs.values()) {
      const txt = phase(j);
      j.metas.forEach((m) => { if (m.isConnected && m.textContent !== txt) m.textContent = txt; });
      if (!(j.hosts.some(seen) || seen(j.el))) { hidden++; if (!show || j.id > show.id) show = j; }
    }
    document.documentElement.classList.toggle('aiw-on', jobs.size > 0);
    if (!show) { pill.hidden = true; return; }
    const b = pill.querySelector('b'), ps = pill.querySelector('.aiw-ps');
    const task = show.task || 'The AI is working', ph = phase(show) + (hidden > 1 ? ` · and ${hidden - 1} more` : '');
    if (b.textContent !== task) b.textContent = task;
    if (ps.textContent !== ph) ps.textContent = ph;
    const go = !!target(show);
    pill.classList.toggle('go', go); pill.dataset.job = show.id;
    if (go) { pill.setAttribute('tabindex', '0'); pill.setAttribute('role', 'button'); pill.setAttribute('aria-label', `${task}: ${ph}. Show it`); }
    else { pill.removeAttribute('tabindex'); pill.removeAttribute('role'); pill.removeAttribute('aria-label'); }
    pill.hidden = false;
  }
  addEventListener('scroll', () => { if (jobs.size && !raf) raf = requestAnimationFrame(() => { raf = 0; paint(); }); }, { passive: true });

  /* ---------- the wrapper round WL.ai.ask ---------- */
  function install() {
    if (!WL.ai || WL.ai.__aiw) return;
    const inner = WL.ai.ask;
    WL.ai.ask = function (system, msgs, o) {
      o = o || {};
      const j = begin(o);
      const opts = Object.assign({}, o, {
        onText: (t) => { text(j, t); if (o.onText) o.onText(t); },
        onStatus: (e) => { status(j, e); if (o.onStatus) o.onStatus(e); }
      });
      delete opts.live; delete opts.task;
      let r;
      try { r = inner.call(this, system, msgs, opts); } catch (e) { end(j); throw e; }
      return Promise.resolve(r).then((v) => { end(j); return v; }, (e) => { end(j); throw e; });
    };
    WL.ai.__aiw = 1;
  }
  install(); addEventListener('load', install);

  /* ---------- for pages that show their own work in progress ---------- */
  const row = (t) => `<p class="aiw-row"><span class="aiw-orb" aria-hidden="true"></span><span class="aiw-lab">${esc(t)}</span></p>`;
  /* complete string values of one key in JSON that is still arriving */
  const strs = (t, key) => [...String(t || '').matchAll(new RegExp('"' + key + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"', 'g'))].map((m) => { try { return JSON.parse('"' + m[1] + '"'); } catch (e) { return m[1]; } });
  /* which of the keys have started, in the order they appear */
  const keys = (t, list) => list.map((k) => ({ k, at: String(t || '').search(new RegExp('"' + k + '"\\s*:')) })).filter((x) => x.at >= 0).sort((a, b) => a.at - b.at).map((x) => x.k);
  WL.aiw = { row, strs, keys, words, get busy() { return jobs.size; }, jobs };
})();
/* Geodesic — flashcards with spaced repetition (#cards, #cards-<topic>, #cards-due).
   Cards come from each topic's own material: key terms (term → definition), equations (what it says → the equation)
   and the guide's quick checks (question → answer). Scheduling is SM-2-like: Again brings a card back in this session
   and resets its gap; Hard, Good and Easy grow the gap by the card's ease. With an exam date set (#science or the
   planner), no gap runs past about 15 % of the time left. Stored in this browser, per account (wl-cards). */
(function () {
  const WL = (window.WL = window.WL || {});
  const DAY = 864e5, NEW_PER_DAY = 20;
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H().pr ? H().pr(s) : esc(s));
  const strip = (s) => String(s == null ? '' : s).replace(/\*\*(.+?)\*\*/g, '$1');
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  let D = null, DK = '';
  function load() {
    const k = 'wl-cards' + user(); if (D && DK === k) return D;
    let d = null; try { d = JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) {}
    DK = k; D = d && d.s ? d : { s: {}, day: '', fresh: 0 };
    if (D.day !== today()) { D.day = today(); D.fresh = 0; }
    return D;
  }
  const save = () => { try { localStorage.setItem(DK, JSON.stringify(D)); } catch (e) {} window.dispatchEvent(new Event('wl-cards')); };

  /* ---------- the cards of a topic ---------- */
  function syncCards(tid) {
    const out = [], kt = (WL.keyterms || {})[tid] || [], no = (WL.notes || {})[tid] || {};
    kt.forEach(([t, d], i) => out.push({ id: `k:${tid}:${i}`, tid, kind: 'Key term', front: `<p class="fc-big">${esc(t)}</p><p class="fc-ask">What does it mean?</p>`, back: `<p>${pr(d)}</p>` }));
    (no.eqs || []).forEach(([tex, m], i) => out.push({ id: `e:${tid}:${i}`, tid, kind: 'Equation', front: `<p class="fc-big">${pr(strip(m))}</p><p class="fc-ask">Write the equation.</p>`, back: `<div class="fc-eq">\\[${esc(tex)}\\]</div>` }));
    return out;
  }
  async function cardsOf(tid) {
    const out = syncCards(tid);
    const g = WL.guideLoad ? await WL.guideLoad(tid).catch(() => null) : null;
    ((g && g.s) || []).forEach(([h, , o], i) => { if (o && o.c) out.push({ id: `c:${tid}:${i}`, tid, kind: 'Quick check', front: `<p class="fc-big">${pr(strip(o.c[0]))}</p><p class="fc-ask">${esc(strip(h))}</p>`, back: `<p>${pr(strip(o.c[1]))}</p>` }); });
    return out;
  }
  async function cardById(id) {
    const [k, tid, i] = id.split(':'); if (!N()[tid]) return null;
    if (k === 'c') return (await cardsOf(tid)).find((c) => c.id === id) || null;
    return syncCards(tid).find((c) => c.id === id) || null;
  }
  const count = (tid) => syncCards(tid).length;

  /* ---------- scheduling ---------- */
  const gap = (days) => (WL.study && WL.study.gap ? WL.study.gap(days) : days);
  function next(st, g) {
    const s = Object.assign({ e: 2.5, i: 0, r: 0, l: 0 }, st || {});
    if (g === 0) { s.l = s.r ? s.l + 1 : s.l; s.e = Math.max(1.3, s.e - 0.2); s.i = 0; s.d = Date.now() + 60e3; }
    else {
      if (!s.r || !s.i) s.i = g === 1 ? 1 : g === 2 ? 2 : 4;
      else if (g === 1) { s.e = Math.max(1.3, s.e - 0.15); s.i = Math.max(1, Math.round(s.i * 1.2)); }
      else if (g === 2) s.i = Math.max(s.i + 1, Math.round(s.i * s.e));
      else { const good = Math.max(s.i + 1, Math.round(s.i * s.e)); s.e += 0.15; s.i = Math.max(good + 1, Math.round(s.i * s.e * 1.3)); }   // Easy: always longer than Good
      s.i = Math.max(1, gap(s.i)); s.d = Date.now() + s.i * DAY; s.r++;
    }
    s.s = Date.now(); return s;
  }
  const label = (st, g) => { const s = next(st, g); if (g === 0) return '< 1 min'; return s.i === 1 ? '1 day' : s.i < 31 ? `${s.i} days` : `${Math.round(s.i / 30)} mo`; };
  const started = () => Object.keys(load().s);
  const dueIds = () => { const S = load().s, t = Date.now(); return Object.keys(S).filter((id) => S[id].d <= t && N()[id.split(':')[1]]).sort((a, b) => S[a].d - S[b].d); };
  const countDue = () => dueIds().length;
  const newLeft = () => Math.max(0, NEW_PER_DAY - load().fresh);

  const whenDue = (t) => { const d0 = new Date(); d0.setHours(0, 0, 0, 0); const k = Math.floor((t - d0.getTime()) / DAY); return k <= 0 ? 'later today' : k === 1 ? 'tomorrow' : 'on ' + new Date(t).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }); };
  /* ---------- a study session ---------- */
  let KEYS = null;
  async function session(view, title, ids, back) {
    const S = load(), h = H();
    let Q = ids.slice(), k = 0, seen = 0, again = 0, flipped = false;
    const draw = async () => {
      if (!view.isConnected) return;
      if (k >= Q.length) {
        const nd = dueIds(), soon = Object.values(load().s).filter((x) => x.d > Date.now()).sort((a, b) => a.d - b.d)[0];
        view.querySelector('.fc-stage').innerHTML = `<div class="fc-done"><h2>${seen ? 'Done for now' : 'Nothing to study here yet'}</h2><p>${seen ? `You went through ${seen} card${seen === 1 ? '' : 's'}${again ? `, ${again} of them more than once` : ''}.` : 'Every card here is scheduled for later.'} ${nd.length ? `${nd.length} more are due.` : soon ? `The next card is due ${whenDue(soon.d)}.` : ''}</p><div class="row"><a class="btn primary" href="${back}">Back to the decks</a>${nd.length ? '<a class="btn" href="#cards-due">Review the due cards</a>' : ''}</div></div>`;
        return;
      }
      const c = await cardById(Q[k]); if (!c) { k++; return draw(); }
      const st = S.s[c.id], n = N()[c.tid];
      flipped = false;
      view.querySelector('.fc-count').textContent = `${Q.length - k} left`;
      view.querySelector('.fc-bar i').style.width = `${(k / Q.length) * 100}%`;
      view.querySelector('.fc-stage').innerHTML = `<article class="fc-card" aria-live="polite">
          <p class="fc-meta"><span>${esc(c.kind)}</span><a href="#t-${c.tid}">${esc(n.title)}</a>${st ? '' : '<span class="fc-new">New</span>'}</p>
          <div class="fc-front">${c.front}</div>
          <div class="fc-back" hidden>${c.back}</div>
        </article>
        <div class="fc-acts"><button type="button" class="btn primary fc-show" data-fc-flip>Show the answer <kbd>Space</kbd></button>
          <div class="fc-grades" hidden role="group" aria-label="How well did you know it?">${['Again', 'Hard', 'Good', 'Easy'].map((t, g) => `<button type="button" class="btn fc-g${g}" data-fc-g="${g}"><b>${t}</b><small>${label(st, g)}</small><kbd>${g + 1}</kbd></button>`).join('')}</div></div>`;
      if (h.typeset) h.typeset(view.querySelector('.fc-card'));
    };
    const flip = () => { if (flipped || k >= Q.length) return; flipped = true; const b = view.querySelector('.fc-back'); b.hidden = false; if (h.typeset) h.typeset(b); view.querySelector('[data-fc-flip]').hidden = true; view.querySelector('.fc-grades').hidden = false; view.querySelector('[data-fc-g="2"]').focus(); };
    const grade = (g) => {
      if (!flipped) return; const id = Q[k], st = S.s[id];
      if (!st) S.fresh++;
      S.s[id] = next(st, g); save(); seen++;
      if (g === 0) { again++; Q.splice(Math.min(Q.length, k + 4), 0, id); }
      k++; draw();
    };
    view.innerHTML = `<section class="fc-head"><p class="crumb"><a href="#cards">Flashcards</a></p><h1>${esc(title)}</h1>
        <div class="fc-prog"><span class="fc-count"></span><span class="fc-bar" aria-hidden="true"><i></i></span><span class="fc-keys"><kbd>Space</kbd> show · <kbd>1</kbd>–<kbd>4</kbd> grade</span></div></section>
      <div class="fc-stage"></div>`;
    view.onclick = (e) => { if (e.target.closest('[data-fc-flip]')) flip(); const g = e.target.closest('[data-fc-g]'); if (g) grade(+g.dataset.fcG); };
    const keys = (e) => {
      if (!view.isConnected || !view.querySelector('.fc-stage')) { document.removeEventListener('keydown', keys); return; }
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ' ' || e.key === 'Enter') { if (!flipped) { e.preventDefault(); flip(); } }
      else if (/^[1-4]$/.test(e.key) && flipped) { e.preventDefault(); grade(+e.key - 1); }
    };
    if (KEYS) document.removeEventListener('keydown', KEYS);
    KEYS = keys; document.addEventListener('keydown', keys);
    window.addEventListener('hashchange', () => document.removeEventListener('keydown', keys), { once: true });
    return draw();
  }
  /* new cards from a set of topics, up to today's limit, then any due ones from the same topics */
  async function deckIds(tids, withNew = true) {
    const S = load().s, t = Date.now(), due = [], fresh = [];
    for (const tid of tids) { (await cardsOf(tid)).forEach((c) => { const st = S[c.id]; if (st) { if (st.d <= t) due.push(c.id); } else fresh.push(c.id); }); }
    due.sort((a, b) => S[a].d - S[b].d);
    return due.concat(withNew ? fresh.slice(0, newLeft()) : []);
  }

  /* ---------- the decks page ---------- */
  function decks(view) {
    const h = H(), A = WL.app, S = load().s, LS = h.LS ? h.LS() : { u: {} };
    const known = Object.keys(LS.u || {}).filter((id) => N()[id]);
    const per = {}; Object.keys(S).forEach((id) => { const tid = id.split(':')[1]; const p = (per[tid] = per[tid] || { n: 0, due: 0 }); p.n++; if (S[id].d <= Date.now()) p.due++; });
    const knownNew = known.reduce((s, tid) => s + syncCards(tid).filter((c) => !S[c.id]).length, 0);
    document.title = 'Flashcards · Geodesic';
    const tracks = ['physics', 'maths'].map((k) => A.TR[k]).filter(Boolean);
    view.innerHTML = `<section class="fc-head"><h1>Flashcards</h1>
        <p class="lede">Short cards made from every topic’s key terms, equations and quick checks. Each one comes back just before you would forget it: “Again” brings it back in a minute, and the better you know it, the longer the gap. Twenty new cards a day keeps the daily reviews to a few minutes.</p></section>
      <div class="fc-start">
        <a class="fc-big-b${dueIds().length ? ' on' : ''}" href="#cards-due"><b>${dueIds().length}</b><span>cards due now</span><small>${started().length} cards started in all</small></a>
        <a class="fc-big-b" href="#cards-known"><b>${Math.min(knownNew, newLeft())}</b><span>new cards from topics you have marked understood</span><small>${newLeft()} of ${NEW_PER_DAY} new cards left today</small></a>
      </div>
      <h2 class="fc-h">Choose a topic</h2>
      ${tracks.map((tr) => `<h3 class="tl-tr">${esc(tr.name)}</h3>${tr.stages.map((st) => { const ids = tr.order.filter((id) => N()[id] && N()[id].stage === st.id); if (!ids.length) return ''; const dueS = ids.reduce((s, id) => s + ((per[id] || {}).due || 0), 0); return `<details class="tl-st"><summary><span>${esc(st.name)}</span><small>${ids.reduce((s, id) => s + count(id), 0)}+ cards${dueS ? ` · ${dueS} due` : ''}</small></summary><ol class="fc-tops">${ids.map((id) => `<li><a href="#cards-${id}">${esc(N()[id].title)}</a><small>${count(id)}+ cards${per[id] ? ` · ${per[id].n} started${per[id].due ? `, ${per[id].due} due` : ''}` : ''}</small></li>`).join('')}</ol></details>`; }).join('')}`).join('')}`;
  }
  /* the count beside the menu item */
  const badge = () => { const b = document.getElementById('fc-due'); if (!b) return; let k = 0; try { k = countDue(); } catch (e) {} b.textContent = k || ''; b.hidden = !k; };
  window.addEventListener('wl-cards', badge); window.addEventListener('hashchange', badge); setTimeout(badge, 1500);
  WL.pages = WL.pages || {};
  WL.pages.cards = {
    match: (h) => h === 'cards' || /^cards-[a-z0-9-]+$/.test(h), nav: 'cards',
    async render(h, view) {
      if (h === 'cards') return decks(view);
      const arg = h.slice(6);
      view.innerHTML = '<p class="muted" style="padding:40px 0">Shuffling the cards…</p>';
      if (arg === 'due') { document.title = 'Due cards · Flashcards · Geodesic'; return session(view, 'Cards due now', dueIds(), '#cards'); }
      if (arg === 'known') { const LS = H().LS ? H().LS() : { u: {} }; const ids = await deckIds(Object.keys(LS.u || {}).filter((id) => N()[id])); document.title = 'New cards · Flashcards · Geodesic'; return session(view, 'New cards from topics you know', ids, '#cards'); }
      const n = N()[arg]; if (!n) { view.innerHTML = '<section class="fc-head"><h1>Deck not found</h1><p><a href="#cards">Back to the flashcards</a></p></section>'; return; }
      document.title = `${n.title} · Flashcards · Geodesic`;
      const ids = await deckIds([arg]);
      if (!ids.length) {
        const all = (await cardsOf(arg)).map((c) => c.id);
        return session(view, n.title, [], '#cards').then(() => { const st = view.querySelector('.fc-done p'); if (st && all.length) st.insertAdjacentHTML('beforeend', ` <button type="button" class="linkbtn" data-fc-cram>Go through all ${all.length} anyway</button>`); view.addEventListener('click', (e) => { if (e.target.closest('[data-fc-cram]')) session(view, n.title, all, '#cards'); }); });
      }
      return session(view, n.title, ids, '#cards');
    }
  };
  /* for today's review (desk.js): grade one card outside a cards session */
  function rate(id, g) { const S = load(), st = S.s[id]; if (!st) S.fresh++; S.s[id] = next(st, g); save(); }
  const labelOf = (id, g) => label(load().s[id], g);
  const nextDue = () => { const t = Date.now(), S = load().s, L = Object.keys(S).filter((id) => N()[id.split(':')[1]]).map((id) => S[id].d).filter((d) => d > t); return L.length ? Math.min(...L) : 0; };
  WL.cards = { count, countDue, cardsOf, deckIds, dueIds, cardById, rate, label: labelOf, nextDue };
})();
/* Geodesic — competition maths: the UKMT Senior Mathematical Challenge, the AMC 10/12, the AIME and the British
   Mathematical Olympiad (rounds 1 and 2). Pages: #compete (hub), #compete-<tier>, #cl-<lesson>, #cmock-<tier>.
   Lessons and mock papers live in js/comp-l1.js, js/comp-l2.js and js/comp-papers.js, loaded on the first visit, through
   WL.cmL(lesson) and WL.cmP(paper). Every problem was written for this site (no past-paper text), and every numerical
   answer was checked by brute force (src/comp/verify.py). Competition facts were checked against the organisers' pages
   in November 2026; dates and thresholds change, so each tier page links to the official source. */
(function () {
  const WL = (window.WL = window.WL || {});
  const LES = (WL.cmLessons = WL.cmLessons || []), PAP = (WL.cmPapers = WL.cmPapers || {});
  WL.cmL = (x) => { if (!LES.find((y) => y.id === x.id)) LES.push(x); };
  WL.cmP = (x) => { PAP[x.tier] = x; };
  const H = () => WL.app && WL.app.h;
  const FILES = ['js/comp-l1.js', 'js/comp-l2.js', 'js/comp-papers.js'];
  let loading = null;
  const loadAll = () => loading || (loading = Promise.all(FILES.map((src) => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s);
  }))));
  const KEY = () => { const A = WL.auth; return 'wl-comp' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const get = () => { try { const o = JSON.parse(localStorage.getItem(KEY()) || '{}') || {}; o.p = o.p || {}; o.mock = o.mock || {}; o.hist = o.hist || {}; return o; } catch (e) { return { p: {}, mock: {}, hist: {} }; } };
  const put = (o) => { try { localStorage.setItem(KEY(), JSON.stringify(o)); } catch (e) {} };
  const AREAS = [['nt', 'Number theory'], ['al', 'Algebra'], ['co', 'Combinatorics'], ['ge', 'Geometry'], ['pr', 'Proof and strategy']];
  const LV = { 1: 'Warm-up', 2: 'Contest', 3: 'Hard', 4: 'Olympiad' };
  const FMT = { mc: 'Multiple choice', int: 'Whole-number answer', proof: 'Proof' };
  const LET = 'ABCDE';
  const dur = (m) => (m % 60 === 0 ? m / 60 + ' hours' : m % 60 === 30 && m > 60 ? Math.floor(m / 60) + '½ hours' : m + ' minutes');

  /* ---------- the competitions ---------- */
  const TIERS = [
    { id: 'smc', name: 'Senior Mathematical Challenge', short: 'SMC', org: 'UKMT', lane: 'uk', col: 0, mins: 90, line: '25 questions · 90 minutes',
      blurb: 'The UK’s first round: short, clever questions on school mathematics.',
      facts: [
        ['Who', 'Students in Year 13 or below (S6 in Scotland, Year 14 in Northern Ireland), at UK schools and at overseas schools that enter.'],
        ['When', 'Early October. In 2026 it was on Wednesday 7 October.'],
        ['Format', '90 minutes, 25 questions, no calculators or measuring instruments. In 2026 UKMT trialled 22 multiple-choice questions followed by three with three-digit answers (000 to 999).'],
        ['Scoring', 'Traditionally you start with 25 marks, gain 4 for a right answer, lose 1 for a wrong one and score 0 for a blank, so 125 is perfect. Read the rules printed on your paper: the 2026 format may score differently.'],
        ['What next', 'High scorers are invited to the Senior Kangaroo, and the top scorers to the British Mathematical Olympiad, Round 1.']],
      tests: 'GCSE and A-level mathematics used in unfamiliar ways: number, algebra, geometry, counting and logic. The first 15 questions are meant to be accessible; the last ten need a real idea each.',
      lessons: ['nt-divisors', 'nt-mod', 'al-poly', 'al-ineq', 'al-seq', 'co-count', 'co-prob', 'ge-angles', 'ge-lengths', 'pr-proof'],
      strategy: ['Get questions 1 to 15 right: for most candidates they carry most of the marks.', 'Under the traditional rule a blind guess is worth 0 on average (4/5 − 4/5); once you can rule out one option, guessing pays.', 'Use the options: substitute them back, or test a small case.', 'For the three-digit answers there is nothing to rule out, so work them through.'],
      links: [['UKMT: Senior Mathematical Challenge', 'https://ukmt.org.uk/senior-challenges/senior-mathematical-challenge'], ['UKMT: past papers', 'https://ukmt.org.uk/competition-papers']] },
    { id: 'amc', name: 'AMC 10 and AMC 12', short: 'AMC 10/12', org: 'MAA', lane: 'us', col: 0, mins: 75, line: '25 questions · 75 minutes',
      blurb: 'The US first round: 25 multiple-choice problems against the clock.',
      facts: [
        ['Who', 'AMC 10: grade 10 or below and under 17.5 years old on the day. AMC 12: grade 12 or below and under 19.5. You may not sit both on the same day.'],
        ['When', 'November, on an A date and a B date about a week apart.'],
        ['Format', '75 minutes, 25 multiple-choice questions, no calculators.'],
        ['Scoring', '6 points for a right answer, 1.5 for a blank and 0 for a wrong answer; 150 is perfect.'],
        ['Content', 'AMC 10: algebra, basic geometry, areas and volumes, elementary number theory and probability, with no trigonometry. AMC 12: the whole school curriculum, including trigonometry and advanced algebra, but no calculus.'],
        ['What next', 'The AIME. For 2026–27 the MAA moved to fixed qualifying scores, reported as 100 on the AMC 10 and 85 on the AMC 12; earlier years used percentiles (at least the top 2.5% on the AMC 10 and 5% on the AMC 12).']],
      tests: 'Fast, accurate problem solving across algebra, number theory, counting and probability, and geometry. Problems 1 to 10 are routine for a strong student; 21 to 25 are hard.',
      lessons: ['al-poly', 'nt-divisors', 'nt-mod', 'co-count', 'co-pie', 'co-prob', 'ge-angles', 'ge-lengths', 'ge-trig', 'al-seq', 'pr-proof'],
      strategy: ['Leave a question blank unless you can rule out at least one option: a blank is worth 1.5, a blind guess 1.2 on average, and a guess among three 2.', 'Use the answer choices: estimate, check parity, or test small cases.', '75 minutes for 25 questions is 3 minutes each; do not sink 15 minutes into one.', 'Be sure of the first 15 before you attempt the last 10.'],
      links: [['MAA: AMC 10/12', 'https://maa.org/student-programs/amc/'], ['AoPS wiki: past AMC problems', 'https://artofproblemsolving.com/wiki/index.php/AMC_Problems_and_Solutions']] },
    { id: 'aime', name: 'American Invitational Mathematics Examination', short: 'AIME', org: 'MAA', lane: 'us', col: 1, mins: 180, line: '15 questions · 3 hours',
      blurb: 'Fifteen hard problems, each with a whole-number answer from 0 to 999.',
      facts: [
        ['Who', 'By invitation, from AMC 10 and AMC 12 results.'],
        ['When', 'February.'],
        ['Format', '3 hours, 15 questions, no calculators. Every answer is an integer from 000 to 999.'],
        ['Scoring', '1 point per right answer, with no penalty for wrong answers; 15 is perfect.'],
        ['What next', 'The USAMO and USAJMO, for eligible students, selected using the AIME results. Check the MAA for the current rule.']],
      tests: 'The same areas as the AMC, but with longer chains of reasoning: number theory, counting and probability, algebra and polynomials, and geometry with some trigonometry. The first few problems are near AMC 12 level.',
      lessons: ['nt-mod', 'nt-fermat', 'nt-dioph', 'al-poly', 'al-seq', 'co-pie', 'co-prob', 'ge-lengths', 'ge-trig', 'pr-proof'],
      strategy: ['There is no penalty: write an answer for every question.', 'An answer that is not a whole number from 0 to 999 means a slip somewhere.', 'The early problems are near AMC 12 level: make sure of them before the hard ones.', 'Twelve minutes a problem on average; check each answer with a small case or an estimate.'],
      links: [['MAA: AIME', 'https://maa.org/student-programs/amc/'], ['AoPS wiki: past AIME problems', 'https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions']] },
    { id: 'bmo1', name: 'British Mathematical Olympiad, Round 1', short: 'BMO1', org: 'UKMT', lane: 'uk', col: 1, mins: 210, line: '6 problems · 3½ hours',
      blurb: 'Full written proofs, six problems, three and a half hours.',
      facts: [
        ['Who', 'Top SMC scorers who are eligible for the UK IMO team are entered automatically; teachers may also enter other students.'],
        ['When', 'November. In 2025 it was on Wednesday 19 November.'],
        ['Format', '3½ hours, 6 problems, full written solutions with complete proofs. The first problem is meant to be more accessible than the rest.'],
        ['Scoring', '10 marks per problem, 60 in all. The marks are for complete, rigorous arguments; a right answer alone earns little.'],
        ['Thresholds', 'Invitations to BMO2 depend on year group and on the paper: in 2024 they were 43 (Year 13), 40 (Year 12) and 38 (Year 11 or below); in 2025, a harder paper, 31, 30 and 27.'],
        ['What next', 'Round 2, by invitation.']],
      tests: 'Olympiad problems needing proof: number theory, algebra and inequalities, combinatorics (invariants, pigeonhole, extremal arguments) and Euclidean geometry.',
      lessons: ['pr-proof', 'nt-divisors', 'nt-mod', 'nt-dioph', 'al-ineq', 'al-fe', 'co-pigeon', 'co-pie', 'ge-angles', 'ge-lengths'],
      strategy: ['Write full solutions: the reasoning earns the marks, not the final answer.', 'Read all six problems first and try small cases before committing.', 'A few complete solutions usually score more than many fragments.', 'In a “find all” problem, prove that every answer works and that nothing else does.'],
      links: [['BMO: rounds 1 and 2, past papers', 'https://bmos.ukmt.org.uk/home/bmo'], ['UKMT: video solutions', 'https://ukmt.org.uk/video-solutions-list']] },
    { id: 'bmo2', name: 'British Mathematical Olympiad, Round 2', short: 'BMO2', org: 'UKMT', lane: 'uk', col: 2, mins: 210, line: '4 problems · 3½ hours',
      blurb: 'Four hard problems, and the route to UK IMO training.',
      facts: [
        ['Who', 'By invitation from BMO1: just over 100 students eligible for the UK IMO team, and a few high scorers at UK schools who are not. There are no discretionary entries.'],
        ['When', 'Late January. From January 2027 it is sat in person at the BMO National Final in London.'],
        ['Format', '3½ hours, 4 problems, full written solutions.'],
        ['Scoring', '10 marks per problem, 40 in all.'],
        ['What next', 'Top scorers are invited to UK IMO training and selection; BMO2 also feeds selection for the European Girls’ Mathematical Olympiad.']],
      tests: 'Deeper olympiad problems: each needs one or two genuine ideas and a careful write-up.',
      lessons: ['pr-proof', 'nt-fermat', 'nt-dioph', 'al-ineq', 'al-fe', 'co-pigeon', 'ge-angles', 'ge-lengths', 'ge-trig'],
      strategy: ['About 50 minutes a problem: think long before writing.', 'Look for the key idea: an invariant, an extremal choice, a factorisation, a hidden cyclic quadrilateral.', 'Rigour is expected: justify every step that is not completely standard.'],
      links: [['BMO: rounds 1 and 2, past papers', 'https://bmos.ukmt.org.uk/home/bmo']] }
  ];
  const tierOf = (id) => TIERS.find((t) => t.id === id);

  /* ---------- small helpers ---------- */
  const allProblems = () => LES.flatMap((L) => L.pr.map((p, i) => ({ ...p, id: L.id + '-p' + (i + 1), lesson: L.id })));
  const solved = (o, pid) => !!(o.p[pid] && (o.p[pid].ok || o.p[pid].self));
  const lessonDone = (o, L) => L.pr.filter((p, i) => solved(o, L.id + '-p' + (i + 1))).length;
  const intOf = (s) => { const t = String(s == null ? '' : s).trim().replace(/[−–]/g, '-').replace(/\s+/g, ''); return /^-?\d+$/.test(t) ? parseInt(t, 10) : NaN; };
  function crumbs(parts) { const h = H(); return `<p class="crumbs">${parts.map(([t, href]) => (href ? `<a href="${href}">${h.esc(t)}</a>` : `<span>${h.esc(t)}</span>`)).join(' <span aria-hidden="true">›</span> ')}</p>`; }
  const trackbar = () => `<nav class="trackbar" aria-label="Tracks"><a href="#physics">Physics</a><a href="#maths">Maths</a><a href="#compete" aria-current="page">Competition</a></nav>`;
  function loadingView(view) { view.innerHTML = `<section class="cm-page">${trackbar()}<p class="muted cm-loading">Loading competition maths…</p></section>`; }
  function failView(view) { view.innerHTML = `<section class="cm-page">${trackbar()}<p>The competition pages could not load. Check your connection and reload.</p></section>`; }

  /* the figure for a geometry item, if it has one (geo.js, geo-cm.js) */
  const FIG = (k) => (WL.geo ? WL.geo.fig(k) : '');
  /* a problem with an answer box, a hint and a solution */
  function qHTML(p, pid, o, opts = {}) {
    const h = H(), s = o.p[pid] || {}, ok = s.ok || s.self;
    const box = p.t === 'mc'
      ? `<form class="cm-ans cm-mc" data-pf="${pid}"><fieldset><legend class="vh">Choose an answer</legend>${p.ch.map((c, i) => `<label class="cm-opt"><input type="radio" name="o-${pid}" value="${i}"${s.a === String(i) ? ' checked' : ''}><b>${LET[i]}</b><span>${h.pr(c)}</span></label>`).join('')}</fieldset><button class="btn small" type="submit">Check</button></form>`
      : p.t === 'int'
        ? `<form class="cm-ans cm-int" data-pf="${pid}"><label class="vh" for="in-${pid}">Your answer</label><input id="in-${pid}" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="Whole number" value="${h.esc(s.a || '')}"><button class="btn small" type="submit">Check</button></form>`
        : `<p class="cm-proofnote">Write your proof on paper first. Then open the model solution and mark yourself honestly.</p><label class="cm-self"><input type="checkbox" data-self="${pid}"${s.self ? ' checked' : ''}> My proof is complete and correct</label>`;
    return `<div class="cm-q${ok ? ' ok' : s.tried ? ' no' : ''}" data-pid="${pid}" id="q-${pid}">
      <p class="cm-qmeta">${opts.n ? `<b class="cm-qn">${opts.n}</b>` : ''}<span class="cm-lv lv${p.lv}">${LV[p.lv]}</span><span>${FMT[p.t]}</span></p>
      <div class="cm-qtext">${h.pr(p.q)}</div>${FIG(pid)}${box}
      <p class="cm-fb" aria-live="polite">${s.ok ? 'Correct.' : s.tried ? 'Not yet. Try again, take the hint, or open the solution.' : ''}</p>
      <div class="cm-tools">${p.hint ? `<button type="button" class="btn small ghost" data-hint="${pid}" aria-expanded="false">Hint</button>` : ''}<button type="button" class="btn small ghost" data-sol="${pid}" aria-expanded="false">Solution</button></div>
      ${p.hint ? `<p class="cm-hint" hidden>${h.pr(p.hint)}</p>` : ''}
      <div class="cm-sol" hidden><p>${h.pr(p.sol)}</p>${p.t === 'mc' ? `<p class="cm-key">Answer: <b>${LET[p.a]}</b> (${h.pr(p.ch[p.a])})</p>` : p.t === 'int' ? `<p class="cm-key">Answer: <b>${p.a}</b></p>` : ''}</div></div>`;
  }
  /* answer checking, hints and solutions for any page that shows problems */
  function wireProblems(view, find) {
    view.onsubmit = (e) => {
      const f = e.target.closest && e.target.closest('form[data-pf]'); if (!f || !view.contains(f)) return; e.preventDefault();
      const pid = f.dataset.pf, p = find(pid); if (!p) return;
      const box = f.closest('.cm-q'), fb = box.querySelector('.cm-fb'), o = get(), s = (o.p[pid] = o.p[pid] || {});
      let ok = false, raw = '';
      if (p.t === 'mc') { const c = f.querySelector('input[type=radio]:checked'); if (!c) { fb.textContent = 'Choose one of A to E first.'; return; } raw = c.value; ok = +c.value === p.a; }
      else { raw = f.querySelector('input').value; const v = intOf(raw); if (isNaN(v)) { fb.textContent = 'Type a whole number, such as 42 or −7.'; return; } ok = v === p.a; }
      s.a = String(raw).slice(0, 20); s.tried = 1; if (ok) s.ok = 1; put(o);
      box.classList.toggle('ok', !!s.ok); box.classList.toggle('no', !s.ok);
      fb.textContent = ok ? 'Correct.' : 'Not yet. Try again, take the hint, or open the solution.';
    };
    view.onchange = (e) => {
      const c = e.target.closest && e.target.closest('input[data-self]'); if (!c) return;
      const o = get(), s = (o.p[c.dataset.self] = o.p[c.dataset.self] || {}); s.self = c.checked ? 1 : 0; put(o);
      c.closest('.cm-q').classList.toggle('ok', c.checked);
    };
    view.onclick = (e) => {
      const hb = e.target.closest('[data-hint]'); if (hb) { const q = hb.closest('.cm-q'), el = q.querySelector('.cm-hint'), open = el.hidden; el.hidden = !open; hb.setAttribute('aria-expanded', open); return; }
      const sb = e.target.closest('[data-sol]'); if (sb) { const q = sb.closest('.cm-q'), el = q.querySelector('.cm-sol'), open = el.hidden; el.hidden = !open; sb.setAttribute('aria-expanded', open); sb.textContent = open ? 'Hide the solution' : 'Solution'; if (open) H().typeset(el); return; }
      const xb = e.target.closest('[data-exsol]'); if (xb) { const el = xb.nextElementSibling, open = el.hidden; el.hidden = !open; xb.setAttribute('aria-expanded', open); xb.textContent = open ? 'Hide the solution' : 'Show the solution'; return; }
      const kb = e.target.closest('[data-hook]'); if (kb) { const el = kb.nextElementSibling, open = el.hidden; el.hidden = !open; kb.setAttribute('aria-expanded', open); kb.textContent = open ? 'Hide' : 'See the answer'; }
    };
  }

  /* ---------- #compete ---------- */
  function renderHub(view) {
    const h = H(), o = get();
    const stop = (t) => { const hist = (o.hist[t.id] || []).slice(-1)[0]; return `<a class="cm-stop" href="#compete-${t.id}"><span class="cm-org">${t.org}</span><b>${h.esc(t.short)}</b><span class="cm-sl">${h.esc(t.line)}</span>${hist ? `<span class="cm-last">Last mock ${hist.score}/${hist.max}</span>` : ''}</a>`; };
    const lane = (id, label, end) => `<div class="cm-lane" data-lane="${id}"><span class="cm-lane-n">${label}</span>${[0, 1, 2].map((c) => { const t = TIERS.find((x) => x.lane === id && x.col === c); return t ? stop(t) : c === 2 ? `<span class="cm-stop cm-off"><span class="cm-org">${end[0]}</span><b>${end[1]}</b><span class="cm-sl">${end[2]}</span></span>` : '<span class="cm-gap"></span>'; }).join('<span class="cm-arrow" aria-hidden="true"></span>')}</div>`;
    const lessonCard = (L) => { const d = lessonDone(o, L); return `<a class="cm-lcard${d === L.pr.length ? ' done' : ''}" href="#cl-${L.id}"><b>${h.esc(L.title)}</b><span class="cm-ldots" aria-label="${d} of ${L.pr.length} problems done">${L.pr.map((p, i) => `<i${solved(o, L.id + '-p' + (i + 1)) ? ' class="on"' : ''}></i>`).join('')}</span></a>`; };
    view.innerHTML = `<section class="cm-page cm-hub">${trackbar()}${WL.compSubjects ? WL.compSubjects('m') : ''}
      <header class="cm-head"><h1>Competition maths</h1>
        <p class="prlead">Contest problems ask you to use school mathematics in ways no exam does. This section prepares you for five competitions in the order most students meet them: lessons on the ideas that keep coming back, then a full mock paper for each competition, timed and marked by its own rules.</p></header>
      <h2 class="cm-h2">The competitions</h2>
      <div class="cm-ladder">${lane('uk', 'UK', ['', '', ''])}${lane('us', 'US', ['MAA', 'USAMO, USAJMO', 'proof olympiads, not covered here'])}
        <p class="cm-note">Columns are a rough guide to difficulty; the formats differ, and the BMO asks for proofs from the first round. Beyond these: the International Mathematical Olympiad for school students, and the Putnam for undergraduates.</p></div>
      <h2 class="cm-h2">Lessons</h2>
      <p class="sec-sub">Each lesson starts with a puzzle, explains the few ideas that solve most problems of its kind, works two examples, and ends with four problems of rising difficulty, usually including one to prove. Every problem was written for this site.</p>
      <div class="cm-areas">${AREAS.map(([a, name]) => { const ls = LES.filter((L) => L.area === a); return ls.length ? `<div class="cm-area"><h3>${name}</h3><div class="cm-lgrid">${ls.map(lessonCard).join('')}</div></div>` : ''; }).join('')}</div>
      <h2 class="cm-h2">How to use this</h2>
      <ol class="cm-how"><li><b>Learn the ideas.</b> Work through the lessons for your competition, attempting each problem before opening the solution.</li><li><b>Sit a mock.</b> Every competition page has a full paper, timed and scored by that competition’s rules.</li><li><b>Go to the real papers.</b> Past papers are linked from each competition page; they are the best practice of all.</li></ol>
    </section>`;
    document.title = 'Competition maths · Geodesic';
  }

  /* ---------- #compete-<tier> ---------- */
  function renderTier(view, id) {
    const h = H(), t = tierOf(id), o = get();
    if (!t) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That competition is not here</h1><p><a href="#compete">Competition maths</a></p></section>`; return; }
    const P = PAP[t.id], hist = o.hist[t.id] || [], run = o.mock[t.id];
    const lessonRow = (lid, i) => { const L = LES.find((x) => x.id === lid); if (!L) return ''; const d = lessonDone(o, L); return `<li><a href="#cl-${L.id}"><span class="cm-n">${i + 1}</span><span class="cm-lt">${h.esc(L.title)}</span><span class="cm-ld">${d}/${L.pr.length}</span></a></li>`; };
    view.innerHTML = `<section class="cm-page cm-tier">${trackbar()}${crumbs([['Competition maths', '#compete'], [t.short]])}
      <header class="cm-head"><p class="cm-orgline">${h.esc(t.org)} · ${h.esc(t.line)}</p><h1>${h.esc(t.name)}</h1><p class="prlead">${h.esc(t.blurb)}</p></header>
      <div class="cm-tgrid">
        <div>
          <dl class="cm-facts">${t.facts.map(([k, v]) => `<div><dt>${h.esc(k)}</dt><dd>${h.esc(v)}</dd></div>`).join('')}</dl>
          <p class="cm-src">Checked against the organisers’ pages in November 2026. Dates, formats and thresholds change: ${t.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${h.esc(n)}</a>`).join(' · ')}.</p>
          <h2 class="cm-h2">What it tests</h2><p>${h.esc(t.tests)}</p>
          <h2 class="cm-h2">Strategy</h2><ul class="cm-strat">${t.strategy.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul>
        </div>
        <aside class="cm-side">
          <div class="cm-mockbox"><h2>Mock paper</h2>${P ? `<p>${P.items.length} problems written in the style of the ${h.esc(t.short)}, ${dur(t.mins)}, ${P.kind === 'proof' ? 'with model solutions and marking notes so you can mark yourself out of ' + P.items.length * 10 : 'marked by the ' + h.esc(t.short) + ' rules'}.</p>
            <a class="btn primary" href="#cmock-${t.id}">${run && !run.done ? 'Resume the paper' : run && run.done ? 'See your last paper' : 'Sit the paper'}</a>
            ${hist.length ? `<ul class="cm-hist">${hist.slice(-4).reverse().map((x) => `<li><span>${new Date(x.at).toLocaleDateString()}</span><b>${x.score} / ${x.max}</b></li>`).join('')}</ul>` : ''}` : '<p class="muted">Not available.</p>'}</div>
          <div class="cm-prep"><h2>Lessons, in this order</h2><ol class="cm-lessonlist">${t.lessons.map(lessonRow).join('')}</ol></div>
        </aside>
      </div>
      <section class="cm-fresh" id="cm-fresh" aria-labelledby="cm-fresh-h">${freshHTML(t, o)}</section></section>`;
    document.title = t.short + ' · Competition maths · Geodesic';
    wireProblems(view, (pid) => freshFind(t.id, pid));
    const base = view.onclick;
    view.onclick = (e) => { if (!freshClick(e, view, t)) base(e); };
    freshCoach(view, t.id);
  }
  /* ---------- fresh problems: Einstein writes five more at this competition's standard ----------
     It is shown three problems from this page's mock paper (easy, middle, hard) and the competition's format, writes
     five new ones, then solves them again from the questions alone; any whose answers disagree are dropped. */
  const FKEY = () => { const A = WL.auth; return 'wl-cmfresh' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const fget = () => { try { return JSON.parse(localStorage.getItem(FKEY()) || '{}') || {}; } catch (e) { return {}; } };
  const fput = (x) => { try { localStorage.setItem(FKEY(), JSON.stringify(x)); } catch (e) {} };
  const KIND = { smc: 'mc', amc: 'mc', aime: 'int', bmo1: 'proof', bmo2: 'proof' };
  function freshFind(tid, pid) { const m = String(pid).match(/^fx-([a-z0-9]+)-([a-z0-9]+)-(\d+)$/); if (!m) return null; const set = (fget()[m[1]] || []).find((x) => x.id === m[2]); return set ? set.items[+m[3]] : null; }
  function freshHTML(t, o) {
    const h = H(), sets = fget()[t.id] || [], kind = KIND[t.id] || 'mc';
    const note = (g) => (!g ? '' : g.checked === false ? 'answers not double-checked' : g.dropped ? `${g.dropped} dropped after the check` : kind === 'proof' ? 'with marking notes' : 'answers double-checked');
    return `<div class="cm-fresh-h"><div><h2 id="cm-fresh-h">Fresh problems from Einstein</h2>
        <p>Einstein reads the ${h.esc(t.short)} mock paper on this page and the rules of the competition, then writes five new problems at the same standard${kind === 'proof' ? ', each with marking notes so you can mark your proof' : ', solves each one again from scratch, and drops any whose two answers disagree'}. They are new every time.</p></div>
        <button type="button" class="btn primary" data-cmfresh>${sets.length ? 'Five more' : 'Write five problems'}</button></div>
      <p class="cm-fresh-out" id="cm-fresh-out" aria-live="polite" hidden></p>
      ${sets.slice().reverse().map((set) => { const k = sets.indexOf(set); return `<div class="cm-fresh-set" data-fset="${set.id}"><h3>Set ${k + 1} <small>${new Date(set.at).toLocaleDateString()} · ${set.items.length} problems · ${note(set.gen)}</small><button type="button" class="btn small ghost" data-cmfdel="${set.id}">Remove</button></h3>
        ${set.items.map((p, i) => qHTML(p, `fx-${t.id}-${set.id}-${i}`, o, { n: i + 1 })).join('')}</div>`; }).join('')}`;
  }
  function freshCoach(view, tid) {
    if (!(WL.compAI && WL.compAI.coachBar)) return;
    view.querySelectorAll('.cm-fresh .cm-q[data-pid]').forEach((box) => WL.compAI.coachBar(box, freshFind(tid, box.dataset.pid), box.dataset.pid));
  }
  function freshClick(e, view, t) {
    const del = e.target.closest('[data-cmfdel]');
    if (del) {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Remove this set?'; return true; }
      const F = fget(); F[t.id] = (F[t.id] || []).filter((x) => x.id !== del.dataset.cmfdel); fput(F);
      const sec = view.querySelector('#cm-fresh'); sec.innerHTML = freshHTML(t, get()); H().typeset(sec); freshCoach(view, t.id); return true;
    }
    const b = e.target.closest('[data-cmfresh]'); if (!b) return false;
    if (!WL.forge) return true;
    const out = view.querySelector('#cm-fresh-out'), kind = KIND[t.id] || 'mc', items = (PAP[t.id] || {}).items || [];
    const like = items.length ? [items[0], items[Math.floor(items.length / 2)], items[items.length - 1]].filter((x) => x && x.t === kind) : [];
    const avoid = (fget()[t.id] || []).flatMap((x) => x.items.map((p) => p.q)).slice(-15);
    const fmt = (t.facts.find(([k]) => k === 'Format') || [])[1] || t.line;
    b.disabled = true; out.hidden = false; out.className = 'cm-fresh-out'; out.innerHTML = '<span class="spin" aria-hidden="true"></span><span id="cm-fresh-prog">Einstein is writing five problems</span>';
    WL.forge.contest({ subject: 'mathematics', tier: `${t.name} (${t.short}, run by the ${t.org})`, kind, n: 5, like, avoid, profile: `The competition: ${t.line}. ${fmt} What it tests: ${t.tests}` }, WL.forge.progress(view.querySelector('#cm-fresh-prog'), 'five problems', 5))
      .then((r) => {
        r.items.forEach((p) => { if (p.t === 'proof' && p.mark) p.sol = p.sol + ' Marking: ' + p.mark; });
        const F = fget(), id = Date.now().toString(36); F[t.id] = [...(F[t.id] || []), { id, at: Date.now(), gen: r.gen, items: r.items }].slice(-4); fput(F);
        const sec = view.querySelector('#cm-fresh'); if (!sec) return;
        sec.innerHTML = freshHTML(t, get()); H().typeset(sec); freshCoach(view, t.id);
        const el = sec.querySelector(`[data-fset="${id}"]`); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      })
      .catch((er) => { if (!out.isConnected) return; b.disabled = false; out.className = 'cm-fresh-out err'; out.textContent = (er && er.message) || 'Einstein could not write the problems just now. Try again.'; });
    return true;
  }

  /* ---------- #cl-<lesson> ---------- */
  function renderLesson(view, id) {
    const h = H(), L = LES.find((x) => x.id === id), o = get();
    if (!L) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That lesson is not here</h1><p><a href="#compete">Competition maths</a></p></section>`; return; }
    const i0 = LES.indexOf(L), prev = LES[i0 - 1], next = LES[i0 + 1], area = (AREAS.find((a) => a[0] === L.area) || [])[1];
    const tiers = TIERS.filter((t) => t.lessons.includes(L.id));
    view.innerHTML = `<article class="cm-page cm-lesson">${trackbar()}${crumbs([['Competition maths', '#compete'], [area]])}
      <header class="cm-head"><h1>${h.esc(L.title)}</h1><p class="cm-tierchips">Useful for ${tiers.map((t) => `<a href="#compete-${t.id}">${h.esc(t.short)}</a>`).join('')}</p></header>
      <section class="cm-hook"><h2>Start with a puzzle</h2><div class="cm-qtext">${h.pr(L.hook[0])}</div>${FIG(L.id + ':hook')}<button type="button" class="btn small ghost" data-hook aria-expanded="false">See the answer</button><div class="cm-hooka" hidden><p>${h.pr(L.hook[1])}</p>${FIG(L.id + ':hooka')}</div></section>
      <section class="cm-ideas"><h2 class="cm-h2">The ideas</h2>${L.ideas.map(([t, x], k) => `<div class="cm-idea"><h3>${h.esc(t)}</h3><p>${h.pr(x)}</p>${FIG(L.id + ':i' + (k + 1))}</div>`).join('')}</section>
      <section><h2 class="cm-h2">Worked examples</h2><p class="sec-sub">Try each one before you open the solution.</p>${L.ex.map((x, i) => `<div class="cm-ex"><p class="cm-exn">Example ${i + 1}</p><div class="cm-qtext">${h.pr(x.q)}</div>${FIG(L.id + ':ex' + (i + 1))}<button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><ol>${x.sol.map((s) => `<li>${h.pr(s)}</li>`).join('')}</ol><p class="cm-key">Answer: ${h.pr(x.a)}</p></div></div>`).join('')}</section>
      <section><h2 class="cm-h2">Problems</h2>${L.pr.map((p, i) => qHTML(p, L.id + '-p' + (i + 1), o, { n: i + 1 })).join('')}</section>
      <section class="cm-traps"><h2 class="cm-h2">Traps</h2><ul>${L.traps.map((x) => `<li>${h.pr(x)}</li>`).join('')}</ul></section>
      <nav class="prnext">${prev ? `<a href="#cl-${prev.id}">‹ ${h.esc(prev.title)}</a>` : '<a href="#compete">‹ All lessons</a>'}${next ? `<a href="#cl-${next.id}">${h.esc(next.title)} ›</a>` : '<a href="#compete">All lessons ›</a>'}</nav></article>`;
    document.title = L.title + ' · Competition maths · Geodesic';
    h.typeset(view);
    const find = (pid) => { const m = pid.match(/^(.*)-p(\d+)$/); return m && m[1] === L.id ? L.pr[+m[2] - 1] : null; };
    wireProblems(view, find);
  }

  /* ---------- #cmock-<tier>: a full paper, timed, then marked ---------- */
  let clock = 0;
  const fmt = (ms) => { const s = Math.max(0, Math.round(ms / 1000)), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60; return (hh ? hh + ':' + String(mm).padStart(2, '0') : mm) + ':' + String(ss).padStart(2, '0'); };
  function score(t, P, ans) {
    if (P.kind === 'proof') return null;
    let s = t.id === 'smc' ? 25 : 0, max = 0, right = 0, wrong = 0, blank = 0;
    P.items.forEach((p, i) => {
      const a = ans[i], has = a != null && a !== '';
      const ok = has && (p.t === 'mc' ? +a === p.a : intOf(a) === p.a);
      if (ok) right++; else if (has) wrong++; else blank++;
      if (t.id === 'amc') { max += 6; s += ok ? 6 : has ? 0 : 1.5; }
      else if (t.id === 'smc') { max += 4; s += ok ? 4 : has && p.t === 'mc' ? -1 : 0; }
      else { max += 1; s += ok ? 1 : 0; }
    });
    if (t.id === 'smc') max += 25;
    return { score: s, max, right, wrong, blank };
  }
  function renderMock(view, id) {
    const h = H(), t = tierOf(id), P = t && PAP[t.id];
    clearInterval(clock);
    if (!t || !P) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That paper is not here</h1><p><a href="#compete">Competition maths</a></p></section>`; return; }
    const o = get(), run = o.mock[t.id];
    const rules = t.id === 'smc' ? 'You start with 25 marks. Multiple choice: +4 right, −1 wrong, 0 blank (the traditional SMC rule). Questions 23 to 25 need a three-digit answer, as in the 2026 trial: we score them +4 if right and 0 otherwise.'
      : t.id === 'amc' ? '6 points for a right answer, 1.5 for a blank, 0 for a wrong answer.'
      : t.id === 'aime' ? 'Each answer is a whole number from 0 to 999. 1 point per right answer, no penalty.'
      : 'Write full solutions on paper. When you finish, you can compare your answers with the worked solutions.';
    const head = `${trackbar()}${crumbs([['Competition maths', '#compete'], [t.short, '#compete-' + t.id], ['Mock paper']])}<header class="cm-head"><p class="cm-orgline">Mock paper · ${h.esc(t.line)}</p><h1>${h.esc(t.short)} mock paper</h1></header>`;
    if (!run || (run.done && !run.review)) {
      view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-rules"><p>${P.items.length} problems written for this site in the style of the ${h.esc(t.name)}. You have ${dur(t.mins)}. ${h.esc(rules)}</p><p>No calculator. Work on paper. The clock keeps running if you leave the page, and the paper is marked when time runs out.</p><button type="button" class="btn primary" data-mstart>Start the clock</button></div></section>`;
      document.title = t.short + ' mock paper · Geodesic';
      view.onclick = (e) => { if (e.target.closest('[data-mstart]')) { const O = get(); O.mock[t.id] = { start: Date.now(), ans: {}, done: false }; put(O); renderMock(view, id); } };
      view.onsubmit = null; view.onchange = null; return;
    }
    if (run.done) { renderReview(view, t, P, run, head); return; }
    const end = run.start + t.mins * 60000;
    const item = (p, i) => {
      const a = run.ans[i];
      const box = p.t === 'mc' ? `<div class="cm-mc" role="radiogroup" aria-label="Answer to question ${i + 1}">${p.ch.map((c, k) => `<label class="cm-opt"><input type="radio" name="m-${i}" value="${k}" data-mi="${i}"${a === String(k) ? ' checked' : ''}><b>${LET[k]}</b><span>${h.pr(c)}</span></label>`).join('')}<button type="button" class="btn small ghost" data-mclear="${i}">Leave blank</button></div>`
        : p.t === 'int' ? `<label class="cm-int"><span class="vh">Answer to question ${i + 1}</span><input type="text" inputmode="numeric" maxlength="3" data-mi="${i}" value="${h.esc(a || '')}" placeholder="000–999"></label>`
        : '<p class="cm-proofnote">Write your solution on paper.</p>';
      return `<li class="cm-mq" id="mq-${i}"><p class="cm-qmeta"><b class="cm-qn">${i + 1}</b>${p.t === 'proof' ? '<span>10 marks</span>' : ''}</p><div class="cm-qtext">${h.pr(p.q)}</div>${FIG(t.id + ':' + (i + 1))}${box}</li>`;
    };
    view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-mbar"><span class="cm-clock" id="cm-clock">${fmt(end - Date.now())}</span><span class="cm-prog" id="cm-prog"></span><button type="button" class="btn small" data-mfinish>Finish practice</button></div><ol class="cm-paper">${P.items.map(item).join('')}</ol><div class="cm-mfoot"><button type="button" class="btn primary" data-mfinish>Finish practice</button></div></section>`;
    document.title = t.short + ' mock paper · Geodesic';
    h.typeset(view);
    const prog = () => { const n = P.items.filter((p, i) => p.t !== 'proof' && run.ans[i] != null && run.ans[i] !== '').length, all = P.items.filter((p) => p.t !== 'proof').length; const el = view.querySelector('#cm-prog'); if (el) el.textContent = all ? `${n} of ${all} answered` : ''; };
    prog();
    const finish = () => { const O = get(), R = O.mock[t.id]; if (!R || R.done) return; R.done = true; R.review = true; R.end = Date.now(); const sc = score(t, P, R.ans); if (sc) { O.hist[t.id] = (O.hist[t.id] || []).concat([{ at: Date.now(), score: sc.score, max: sc.max }]).slice(-20); } put(O); clearInterval(clock); renderMock(view, id); window.scrollTo(0, 0); };
    clock = setInterval(() => { const el = document.getElementById('cm-clock'); if (!el) { clearInterval(clock); return; } const left = end - Date.now(); el.textContent = fmt(left); el.classList.toggle('low', left < 5 * 60000); if (left <= 0) finish(); }, 1000);
    if (end - Date.now() <= 0) { finish(); return; }
    let armed = 0;
    view.onclick = (e) => {
      const fb = e.target.closest('[data-mfinish]'); if (fb) { if (Date.now() - armed < 4000) { finish(); return; } armed = Date.now(); view.querySelectorAll('[data-mfinish]').forEach((b) => (b.textContent = 'Press again to finish')); setTimeout(() => view.querySelectorAll('[data-mfinish]').forEach((b) => (b.textContent = 'Finish and mark')), 4000); return; }
      const cb = e.target.closest('[data-mclear]'); if (cb) { const i = +cb.dataset.mclear; view.querySelectorAll(`input[name="m-${i}"]`).forEach((r) => (r.checked = false)); const O = get(); delete O.mock[t.id].ans[i]; put(O); run.ans = O.mock[t.id].ans; prog(); }
    };
    view.onchange = view.oninput = (e) => {
      const inp = e.target.closest && e.target.closest('[data-mi]'); if (!inp) return; const i = +inp.dataset.mi, O = get(); if (!O.mock[t.id] || O.mock[t.id].done) return;
      let v = inp.value; if (inp.type === 'text') { v = v.replace(/[^0-9]/g, '').slice(0, 3); if (inp.value !== v) inp.value = v; }
      if (v === '') delete O.mock[t.id].ans[i]; else O.mock[t.id].ans[i] = v; put(O); run.ans = O.mock[t.id].ans; prog();
    };
    view.onsubmit = (e) => e.preventDefault();
  }
  function renderReview(view, t, P, run, head) {
    const h = H(), sc = score(t, P, run.ans), proof = P.kind === 'proof', o = get(), selfm = (run.self = run.self || {});
    const row = (p, i) => {
      const a = run.ans[i], has = a != null && a !== '', ok = has && (p.t === 'mc' ? +a === p.a : intOf(a) === p.a);
      const yours = p.t === 'mc' ? (has ? LET[+a] : 'blank') : p.t === 'int' ? (has ? String(intOf(a)) : 'blank') : '';
      const key = p.t === 'mc' ? `${LET[p.a]} (${h.pr(p.ch[p.a])})` : p.t === 'int' ? String(p.a) : '';
      return `<li class="cm-mq ${proof ? '' : ok ? 'ok' : has ? 'no' : 'blank'}"><p class="cm-qmeta"><b class="cm-qn">${i + 1}</b>${proof ? `<label class="cm-selfm">Your mark <input type="number" min="0" max="10" step="1" inputmode="numeric" data-selfm="${i}" value="${selfm[i] != null ? selfm[i] : ''}"> / 10</label>` : `<span>${ok ? 'Right' : has ? 'Wrong' : 'Blank'}: you put ${h.esc(yours)}, the answer is ${key}</span>`}</p>
        <div class="cm-qtext">${h.pr(p.q)}</div>${FIG(t.id + ':' + (i + 1))}
        <button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><p>${h.pr(p.sol)}</p>${p.mark ? `<p class="cm-marking"><b>How it might be marked</b> (our guide, not the organisers’ scheme): ${h.pr(p.mark)}</p>` : ''}</div></li>`;
    };
    const selfTotal = () => P.items.reduce((s, p, i) => s + (+selfm[i] || 0), 0);
    const summary = proof ? `<p class="cm-score" id="cm-selfsum">Your self-marked total: <b>${selfTotal()}</b> / ${P.items.length * 10}</p><p class="muted">For comparison, BMO1 invitations to Round 2 needed between 27 and 43 marks out of 60 in 2024 and 2025, depending on year group and paper. Mark strictly: an unjustified step usually costs most of the marks.</p>`
      : `<p class="cm-score">Score: <b>${sc.score}</b> / ${sc.max}</p><p class="muted">${sc.right} right, ${sc.wrong} wrong, ${sc.blank} blank.${t.id === 'amc' ? ' For 2026–27, AIME qualification was reported as 100 on the AMC 10 and 85 on the AMC 12.' : ''}</p>`;
    view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-result">${summary}<div class="cm-ractions"><a class="btn" href="#compete-${t.id}">Back to ${h.esc(t.short)}</a><button type="button" class="btn ghost" data-mreset>Sit it again</button></div></div><ol class="cm-paper cm-review">${P.items.map(row).join('')}</ol></section>`;
    document.title = t.short + ' mock: results · Geodesic';
    h.typeset(view);
    view.onclick = (e) => {
      const xb = e.target.closest('[data-exsol]'); if (xb) { const el = xb.nextElementSibling, open = el.hidden; el.hidden = !open; xb.setAttribute('aria-expanded', open); xb.textContent = open ? 'Hide the solution' : 'Show the solution'; return; }
      if (e.target.closest('[data-mreset]')) { const O = get(); delete O.mock[t.id]; put(O); renderMock(view, t.id); window.scrollTo(0, 0); }
    };
    view.onchange = view.oninput = (e) => {
      const inp = e.target.closest && e.target.closest('[data-selfm]'); if (!inp) return;
      const i = +inp.dataset.selfm, v = Math.max(0, Math.min(10, Math.round(+inp.value || 0)));
      const O = get(), R = O.mock[t.id]; if (!R) return; R.self = R.self || {}; if (inp.value === '') delete R.self[i]; else R.self[i] = v; selfm[i] = R.self[i];
      if (P.items.every((p, k) => R.self[k] != null)) { const tot = P.items.reduce((s, p, k) => s + R.self[k], 0), H2 = O.hist[t.id] = O.hist[t.id] || []; const last = H2[H2.length - 1]; if (last && last.run === R.start) last.score = tot; else H2.push({ at: Date.now(), score: tot, max: P.items.length * 10, run: R.start }); }
      put(O); const el = view.querySelector('#cm-selfsum b'); if (el) el.textContent = selfTotal();
    };
    view.onsubmit = (e) => e.preventDefault();
  }

  /* ---------- registration ---------- */
  const withData = (view, fn) => { if (LES.length >= 16 && Object.keys(PAP).length >= 5) { fn(); return; } loadingView(view); loadAll().then(fn, () => failView(view)); };
  WL.pages = WL.pages || {};
  WL.pages.compete = { match: (h) => h === 'compete', nav: 'maths', render: (h, view) => withData(view, () => renderHub(view)) };
  WL.pages.competeTier = { match: (h) => /^compete-[a-z0-9]+$/.test(h), nav: 'maths', render: (h, view) => withData(view, () => renderTier(view, h.slice(8))) };
  WL.pages.compLesson = { match: (h) => h.startsWith('cl-'), nav: 'maths', render: (h, view) => withData(view, () => renderLesson(view, h.slice(3))) };
  WL.pages.compMock = { match: (h) => h.startsWith('cmock-'), nav: 'maths', render: (h, view) => withData(view, () => renderMock(view, h.slice(6))) };
  WL.comp = { tiers: TIERS, lessons: LES, papers: PAP, load: loadAll, score, get };
})();
/* Competition maths, with the AI working beside the student. Loaded after comp.js (the file name sorts after it).
   On every lesson problem: AI hints in three levels (never the answer), "Check my working" (the first error or gap; a mark
   out of 10 for proofs), the key idea and when to spot it, and a new problem of the same kind. Every lesson gets a lecture:
   slides the AI writes from the lesson's own checked content, with lines that appear as you go and pauses to think; it is
   kept in this browser. The hub lists the lectures, and after a mock paper the AI gives a debrief with priorities.
   Nothing here runs during a timed paper. */
(function () {
  const WL = (window.WL = window.WL || {});
  const H = () => WL.app && WL.app.h, esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H() ? H().pr(s) : esc(s)), md = (t) => (WL.tutor && WL.tutor.md ? WL.tutor.md(t) : '<p>' + esc(t) + '</p>');
  const typeset = (el) => { const h = H(); if (h && h.typeset && el) h.typeset(el); };
  const LET = 'ABCDE', FMT = { mc: 'multiple choice, options A to E', int: 'whole-number answer', proof: 'a proof' };
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k + user())); return v == null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k + user(), JSON.stringify(v)); } catch (e) { /* storage full */ } } };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const words = (t) => (String(t || '').trim().match(/\S+/g) || []).length;
  const DOTS = '<span class="dots"><i></i><i></i><i></i></span>';
  const TAIL = 'Write maths in LaTeX between $…$ or $$…$$. Reply in the language the student writes in. Be concise and exact; do not invent facts about competitions.';
  const COACH = `You are the competition-maths coach on Geodesic, an educational website, helping a student with contest problems (UKMT, AMC 10/12, AIME, BMO). You see the problem and its checked model solution; the solution is for your eyes, to keep your help correct. ${TAIL}`;
  const probText = (p) => `${p.q}${p.t === 'mc' ? '\nOptions: ' + p.ch.map((c, i) => `${LET[i]}) ${c}`).join('   ') : ''}\nFormat: ${FMT[p.t] || p.t}.`;
  const keyText = (p) => `Model solution: ${p.sol}${p.t === 'mc' ? `\nAnswer: ${LET[p.a]}` : p.t === 'int' ? `\nAnswer: ${p.a}` : ''}${p.mark ? '\nMarking notes: ' + p.mark : ''}`;
  let busy = null;
  async function run(out, sys, user, o = {}) {
    if (busy) { busy.abort(); }
    if (!WL.ai) { out.innerHTML = '<p class="cm-ai-err">The AI is not available on this page.</p>'; return ''; }
    const ctl = (busy = new AbortController());
    out.hidden = false; out.innerHTML = `<p class="cm-ai-wait">${DOTS} ${esc(o.wait || 'Thinking…')}</p>`;
    try {
      const r = await WL.ai.ask(sys, [{ role: 'user', content: user }], { signal: ctl.signal, task: String(o.wait || '').replace(/…$/, ''), onText: o.stream === false ? undefined : (t) => { out.innerHTML = (o.render || md)(t); } });
      const t = String(r.text || '').trim(); out.innerHTML = (o.render || md)(t); typeset(out); return t;
    } catch (e) {
      if (e && e.name === 'AbortError') return '';
      out.innerHTML = '<p class="cm-ai-err">The AI could not answer just now. Try again in a moment.</p>'; return '';
    } finally { if (busy === ctl) busy = null; }
  }

  /* ---------------- the coach on each problem ---------------- */
  function coachBar(box, p, pid) {
    if (!p || box.querySelector('.cm-ai')) return;
    const st = () => store.get('wl-cmai', {}), lvl = () => ((st()[pid] || {}).h || 0);
    const bar = document.createElement('div'); bar.className = 'cm-ai';
    const hintLab = () => (lvl() >= 3 ? 'AI hint again' : `AI hint <small>${lvl() + 1} of 3</small>`);
    bar.innerHTML = `<div class="cm-ai-btns" role="group" aria-label="AI coach"><button type="button" class="cm-ai-b" data-ai="hint">${hintLab()}</button><button type="button" class="cm-ai-b" data-ai="work" aria-expanded="false">Check my working</button><button type="button" class="cm-ai-b" data-ai="idea">The key idea</button><button type="button" class="cm-ai-b" data-ai="similar">A similar problem</button></div>
      <div class="cm-ai-work" hidden><label class="vh" for="cw-${pid}">Your working</label><textarea id="cw-${pid}" rows="4" placeholder="${p.t === 'proof' ? 'Your proof, step by step' : 'Your working, step by step'}. Maths like $x^2 + 1$ if you like."></textarea><button type="button" class="btn small primary" data-ai="mark">Check it</button></div>
      <div class="cm-ai-out" aria-live="polite" hidden></div>`;
    box.appendChild(bar);
    const out = bar.querySelector('.cm-ai-out'), solved = () => box.classList.contains('ok');
    bar.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-ai]'); if (!b) return;
      const k = b.dataset.ai;
      if (k === 'work') { const w = bar.querySelector('.cm-ai-work'), open = w.hidden; w.hidden = !open; b.setAttribute('aria-expanded', open); if (open) w.querySelector('textarea').focus(); return; }
      if (k === 'hint') {
        const S = st(), n = Math.min(3, lvl() + 1); S[pid] = Object.assign({}, S[pid], { h: n }); store.set('wl-cmai', S); b.innerHTML = hintLab();
        await run(out, COACH + '\n\n' + keyText(p), `Problem:\n${probText(p)}\n\nGive me hint ${n} of 3. Level 1: a question that points at what to look at. Level 2: name the idea or technique that cracks it, and why it applies here. Level 3: work the first step, then stop and let me finish. Never state the final answer or the correct option.`, { wait: 'Writing a hint…' });
        return;
      }
      if (k === 'mark') {
        const w = bar.querySelector('textarea').value.trim(); if (words(w) < 3) { bar.querySelector('textarea').focus(); return; }
        await run(out, COACH + '\n\n' + keyText(p), `Problem:\n${probText(p)}\n\nMy working:\n"""${w.slice(0, 4000)}"""\n\nCheck it. Say first what is right. Then point to the first error or gap, quoting it, and say why it is wrong. ${p.t === 'proof' ? 'Judge it as an olympiad marker would: is every case covered, is each step justified? Give a mark out of 10 with one line on why.' : 'If the method is sound but unfinished, say what the next step should be.'} Do not write out the full solution.`, { wait: 'Reading your working…' });
        return;
      }
      if (k === 'idea') {
        await run(out, COACH + '\n\n' + keyText(p), `Problem:\n${probText(p)}\n\n${solved() ? 'I have solved it.' : 'I have not solved it yet, so do not give the answer.'} Explain the key idea: the technique, why it works here, how to spot that a problem needs it, and one other kind of contest problem where it works. About 150 words.`, { wait: 'Finding the key idea…' });
        return;
      }
      if (k === 'similar') {
        const t = await run(out, COACH + '\n\n' + keyText(p), `Problem:\n${probText(p)}\n\nWrite one new problem of the same kind and difficulty, with different numbers or a different setting, in the same format (${FMT[p.t]}). Check your own answer carefully. Give the problem first, then put the answer inside <answer>…</answer> and a short solution inside <solution>…</solution>.`, { wait: 'Writing a new problem…', stream: false, render: (x) => {
          const a = (x.match(/<answer>([\s\S]*?)<\/answer>/) || [])[1], s = (x.match(/<solution>([\s\S]*?)<\/solution>/) || [])[1], q = x.replace(/<answer>[\s\S]*?<\/answer>|<solution>[\s\S]*?<\/solution>/g, '').trim();
          return `<div class="cm-sim"><p class="cm-sim-k">A new problem, written by the AI. Its answer is the AI’s own: check it.</p>${md(q)}${a || s ? `<button type="button" class="btn small ghost" data-simsol aria-expanded="false">Show the answer</button><div class="cm-sim-sol" hidden>${a ? `<p><b>Answer:</b> ${pr(a.trim())}</p>` : ''}${s ? md(s.trim()) : ''}</div>` : ''}</div>`;
        } });
        void t; return;
      }
    });
    out.addEventListener('click', (e) => { const sb = e.target.closest('[data-simsol]'); if (!sb) return; const el = sb.nextElementSibling, open = el.hidden; el.hidden = !open; sb.setAttribute('aria-expanded', open); sb.textContent = open ? 'Hide the answer' : 'Show the answer'; if (open) typeset(el); });
  }

  /* ---------------- lectures, written from each lesson ---------------- */
  const LECV = 1;
  function lessonText(L) {
    return [`Lesson: ${L.title}`, `Opening puzzle: ${L.hook[0]}\nIts answer: ${L.hook[1]}`, 'Ideas:\n' + L.ideas.map(([t, x]) => `- ${t}: ${x}`).join('\n'),
      'Worked examples:\n' + L.ex.map((x, i) => `${i + 1}. ${x.q}\nSolution: ${x.sol || ''}${x.a != null && x.a !== '' ? ' Answer: ' + x.a : ''}`).join('\n'), 'Traps:\n' + L.traps.map((x) => '- ' + x).join('\n')].join('\n\n').slice(0, 9000);
  }
  const LEC_SYS = `You are a lecturer in competition mathematics on Geodesic. Turn the lesson below into a lecture of 10 to 14 slides that a student watches like a talk: open with the puzzle, build each idea with a small example, work the examples, and end with the traps and a summary. Stay faithful to the lesson: every number you state must come from it or be computed correctly. ${TAIL}
Write each slide exactly like this, with nothing outside the blocks:
<slide>
title: a short title
board: one line for the board (maths in $…$)
board: another line (two to five board lines in all)
say: what you say over this slide, two to four sentences
ask: optional: a question for the student to pause on
answer: the answer to that question, if you asked one
</slide>`;
  const parseSlides = (t) => [...String(t || '').matchAll(/<slide>([\s\S]*?)<\/slide>/g)].map((m) => {
    const o = { board: [] }; m[1].split('\n').forEach((ln) => { const r = ln.match(/^\s*(title|board|say|ask|answer)\s*:\s*(.*)$/i); if (!r) return; const k = r[1].toLowerCase(); if (k === 'board') o.board.push(r[2].trim()); else o[k] = ((o[k] ? o[k] + ' ' : '') + r[2].trim()); });
    return o;
  }).filter((s) => s.title || s.board.length);
  function lecture(sec, L) {
    const KEY = 'wl-cmlec-' + L.id;
    let S = null, i = 0, timer = 0, playing = false, shown = 0;
    const saved = store.get(KEY, null); if (saved && saved.v === LECV && saved.slides && saved.slides.length) S = saved.slides;
    const stop = () => { clearTimeout(timer); playing = false; const b = sec.querySelector('[data-lx="play"]'); if (b) b.textContent = 'Play'; };
    function paint(reveal) {
      const s = S[i], all = reveal === 'all' || reduced();
      shown = all ? s.board.length : Math.min(shown, s.board.length);
      sec.innerHTML = `<div class="clx" role="region" aria-label="Lecture: ${esc(L.title)}">
        <div class="clx-board"><p class="clx-k">Slide ${i + 1} of ${S.length}</p><h3 class="clx-t">${pr(s.title || '')}</h3><ul class="clx-lines">${s.board.map((b, k) => `<li class="${k < shown ? 'on' : ''}">${pr(b)}</li>`).join('')}</ul></div>
        <p class="clx-say">${pr(s.say || '')}</p>
        ${s.ask ? `<div class="clx-ask"><p><b>Pause and think.</b> ${pr(s.ask)}</p>${s.answer ? `<button type="button" class="btn small ghost" data-lx="ans" aria-expanded="false">Show the answer</button><p class="clx-a" hidden>${pr(s.answer)}</p>` : ''}</div>` : ''}
        <div class="clx-ctl"><button type="button" class="btn small ghost" data-lx="prev"${i ? '' : ' disabled'}>Back</button><button type="button" class="btn small primary" data-lx="play">${playing ? 'Pause' : 'Play'}</button><button type="button" class="btn small ghost" data-lx="next"${i < S.length - 1 ? '' : ' disabled'}>Next</button>
          <span class="clx-bar" aria-hidden="true"><i style="width:${Math.round(((i + 1) / S.length) * 100)}%"></i></span><button type="button" class="linkbtn" data-lx="redo">Write a new version</button></div>
      </div>`;
      typeset(sec);
    }
    const lines = () => sec.querySelectorAll('.clx-lines li');
    function step() {   // one tick of the lecture: the next board line, or the next slide once the talking is done
      if (!playing) return;
      const s = S[i];
      if (shown < s.board.length) { shown++; const li = lines()[shown - 1]; if (li) li.classList.add('on'); timer = setTimeout(step, 1400); return; }
      if (s.ask && !sec.querySelector('.clx-a:not([hidden])')) { stop(); const b = sec.querySelector('[data-lx="ans"]'); if (b) b.focus(); return; }   // wait for the student
      if (i >= S.length - 1) { stop(); return; }
      timer = setTimeout(() => { if (!playing) return; i++; shown = 0; paint(); playing = true; sec.querySelector('[data-lx="play"]').textContent = 'Pause'; timer = setTimeout(step, 700); }, Math.max(3500, (words(s.say) / 2.45) * 1000 - s.board.length * 1400));
    }
    async function make(again) {
      stop();
      /* the slides appear in a list as each one is finished; the lecture starts when the last is done */
      sec.innerHTML = `<div class="clx-making">${WL.aiw ? WL.aiw.row('Writing the lecture from this lesson: 10 to 14 slides') : `<p class="cm-ai-wait">${DOTS} Writing the lecture from this lesson</p>`}<ol class="clx-drafts aiw-prev"></ol></div>`;
      if (!WL.ai) { sec.innerHTML = '<p class="cm-ai-err">The AI is not available on this page.</p>'; return; }
      let n = 0;
      const onText = (t) => {
        const list = sec.querySelector('.clx-drafts'); if (!list) return;
        const sl = parseSlides(t);
        for (; n < sl.length; n++) { const s = sl[n], li = document.createElement('li'); li.className = 'aiw-item'; li.innerHTML = `<b>${pr(s.title || 'Slide ' + (n + 1))}</b><span>${s.board.length} line${s.board.length === 1 ? '' : 's'} on the board${s.ask ? ', a question to pause on' : ''}</span>`; list.appendChild(li); typeset(li); }
        let g = list.querySelector('.aiw-ghost'); const open = (String(t).match(/<slide>/g) || []).length > n;
        if (open) { if (!g) { g = document.createElement('li'); g.className = 'aiw-ghost'; } g.textContent = `Writing slide ${n + 1}…`; list.appendChild(g); } else if (g) g.remove();
      };
      try {
        const r = await WL.ai.ask(LEC_SYS, [{ role: 'user', content: lessonText(L) + (again ? '\n\nWrite a fresh version with different examples on the board.' : '') }], { onText, task: 'Writing the lecture: ' + L.title });
        const sl = parseSlides(r.text); if (sl.length < 3) throw new Error('short');
        S = sl.slice(0, 18); store.set(KEY, { v: LECV, at: Date.now(), slides: S }); i = 0; shown = 0; playing = true; paint(); timer = setTimeout(step, 700);   // asked to watch: it starts
      } catch (e) { sec.innerHTML = `<p class="cm-ai-err">The lecture could not be written just now.</p><button type="button" class="btn small" data-lx="make">Try again</button>`; }
    }
    sec.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lx]'); if (!b) return;
      const k = b.dataset.lx;
      if (k === 'make' || k === 'start') { if (S) { i = 0; shown = 0; paint(); playing = true; b.blur(); sec.querySelector('[data-lx="play"]').textContent = 'Pause'; timer = setTimeout(step, 600); } else make(false); return; }
      if (k === 'redo') { if (confirm('Write a new version of this lecture?')) make(true); return; }
      if (k === 'play') { if (playing) { stop(); return; } playing = true; b.textContent = 'Pause'; step(); return; }
      if (k === 'prev' || k === 'next') { stop(); i = Math.max(0, Math.min(S.length - 1, i + (k === 'next' ? 1 : -1))); shown = 0; paint('all'); return; }
      if (k === 'ans') { const a = b.nextElementSibling, open = a.hidden; a.hidden = !open; b.setAttribute('aria-expanded', open); b.textContent = open ? 'Hide the answer' : 'Show the answer'; if (open) { typeset(a); if (!playing && i < S.length - 1) { playing = true; const pb = sec.querySelector('[data-lx="play"]'); if (pb) pb.textContent = 'Pause'; timer = setTimeout(step, 2500); } } }
    });
    sec.innerHTML = `<div class="clx-intro"><div><h2>Lecture</h2><p>${S ? `${S.length} slides, about ${Math.max(5, Math.round(S.reduce((a, s) => a + words(s.say), 0) / 147 + S.length * 0.25))} minutes.` : 'About ten minutes of slides that the AI writes from this lesson, with pauses to think.'} The board fills in as you go.</p></div><button type="button" class="btn primary" data-lx="start">${S ? 'Watch the lecture' : 'Write and watch the lecture'}</button></div>`;
    return { open: () => sec.querySelector('[data-lx="start"]').click() };
  }

  /* ---------------- pages ---------------- */
  function lessonPage(view, id) {
    const L = (WL.cmLessons || []).find((x) => x.id === id), page = view.querySelector('.cm-lesson'); if (!L || !page || page.dataset.ai) return;
    page.dataset.ai = '1';
    const head = page.querySelector('.cm-head'), sec = document.createElement('section'); sec.className = 'cm-lec'; head.after(sec);
    const clx = lecture(sec, L);
    page.querySelectorAll('.cm-q[data-pid]').forEach((box) => { const m = box.dataset.pid.match(/-p(\d+)$/); coachBar(box, m && L.pr[+m[1] - 1], box.dataset.pid); });
    const ask = document.createElement('p'); ask.className = 'cm-askline';
    ask.innerHTML = '<button type="button" class="btn small" data-ask-coach>Ask the AI coach about this lesson</button>';
    page.querySelector('.cm-ideas').before(ask);
    ask.addEventListener('click', () => { if (WL.tutor) WL.tutor.open({ topic: { key: 'cm-' + L.id, title: L.title, system: COACH + '\n\nThe lesson the student is on:\n' + lessonText(L), context: '', suggestions: ['Explain the first idea with a new example', 'Give me a problem to try', 'Which competitions use this most?'] }, chip: null }); });
    if (sessionStorage.getItem('cm-lec-open') === id) { sessionStorage.removeItem('cm-lec-open'); setTimeout(() => { sec.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); clx.open(); }, 200); }
  }
  function hubPage(view) {
    const hub = view.querySelector('.cm-hub'), after = hub && hub.querySelector('.cm-areas'); if (!after || hub.dataset.ai) return;
    hub.dataset.ai = '1';
    const L = WL.cmLessons || [], made = (id) => !!store.get('wl-cmlec-' + id, null);
    const sec = document.createElement('section'); sec.className = 'cm-lecs';
    sec.innerHTML = `<h2 class="cm-h2">Lectures</h2><p class="sec-sub">Every lesson as a lecture: slides the AI writes from the lesson’s checked content, with the board filling in as you go and pauses to think. Problems on every lesson also have an AI coach: hints in three levels, a check of your working, the key idea, and new problems of the same kind.</p>
      <ul class="cm-leclist">${L.map((x) => `<li><a href="#cl-${x.id}" data-lecopen="${x.id}"><span class="cm-play" aria-hidden="true"></span><span>${esc(x.title)}</span>${made(x.id) ? '<small>ready</small>' : ''}</a></li>`).join('')}</ul>`;
    after.after(sec);
    sec.addEventListener('click', (e) => { const a = e.target.closest('[data-lecopen]'); if (a) sessionStorage.setItem('cm-lec-open', a.dataset.lecopen); });
  }
  function reviewPage(view, tid) {
    const page = view.querySelector('.cm-mock'), res = page && page.querySelector('.cm-result'); if (!res || page.dataset.ai) return;
    const C = WL.comp, t = C && C.tiers.find((x) => x.id === tid), P = C && C.papers[tid], o = C && C.get ? C.get() : {};
    if (!t || !P) return;
    page.dataset.ai = '1';
    const run_ = (o.mock || {})[tid] || {}, ans = run_.ans || {}, self = run_.self || {};
    const box = document.createElement('div'); box.className = 'cm-debrief';
    box.innerHTML = `<div class="cm-db-h"><div><h2>Debrief with the AI</h2><p>What your answers show, the three things to work on first, and a week’s plan using the lessons here.</p></div><button type="button" class="btn primary" data-debrief>Debrief me</button></div><div class="cm-ai-out" hidden aria-live="polite"></div>`;
    res.after(box);
    box.querySelector('[data-debrief]').addEventListener('click', () => {
      const lines = P.items.map((p, i) => { const a = ans[i], has = a != null && a !== ''; const v = P.kind === 'proof' ? `self-marked ${self[i] != null ? self[i] : '?'} / 10` : !has ? 'blank' : (p.t === 'mc' ? +a === p.a : parseInt(a, 10) === p.a) ? 'right' : 'wrong'; return `Q${i + 1} (${v}): ${String(p.q).slice(0, 220)}`; }).join('\n');
      const lessons = (WL.cmLessons || []).map((x) => `${x.id}: ${x.title}`).join('\n');
      run(box.querySelector('.cm-ai-out'), COACH, `I just sat the ${t.name} mock paper on Geodesic. My results, problem by problem:\n${lines}\n\nLessons on the site (id: title):\n${lessons}\n\nDebrief me: 1) what the pattern of right, wrong and blank answers shows (topics, problem types, timing); 2) the three things to work on first, each with the lesson to use (give the title); 3) a plan for the next seven days, about 30 minutes a day. Be honest and specific.`, { wait: 'Reading your paper…' });
    });
  }
  function install() {
    const view = document.getElementById('view'); if (!view) return;
    let t = 0;
    const go = () => { const h = location.hash.slice(1); try { if (/^cl-/.test(h)) lessonPage(view, h.slice(3)); else if (h === 'compete') hubPage(view); else if (/^cmock-/.test(h)) reviewPage(view, h.slice(6)); } catch (e) { /* the page is still being drawn */ } };
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(go, 60); }).observe(view, { childList: true, subtree: true });
    go();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else setTimeout(install, 0);
  WL.compAI = { parseSlides, lessonText, coachBar };
})();
/* Geodesic — Study (#study) and today's review (#today, #today-mix).
   Study is one page for everything about your own learning: what is due today, where you are, and what you have kept.
   Today's review is one round that mixes what is due in the three spaced queues: questions you missed (My mistakes),
   flashcards, and topics due for review. Each item keeps its own schedule (mistakes.js, cards.js, app.js reviewed());
   the round only decides the order, spread evenly across the three kinds, never the same topic twice in a row.
   One count of what is due sits on the Study link in the top bar. Nothing here leaves the browser. */
(function () {
  const WL = (window.WL = window.WL || {});
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H().pr ? H().pr(s) : esc(s));
  const DAY = 864e5;
  const CAP = { mk: 8, fc: 12, tp: 8 };   // most of each kind in one round: about a quarter of an hour
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + 's'}`;

  /* ---------- what is due ---------- */
  function dueCounts() {
    const h = H(); let mk = 0, fc = 0, tp = 0;
    try { mk = WL.mistakes ? WL.mistakes.countDue() : 0; } catch (e) {}
    try { fc = WL.cards ? WL.cards.countDue() : 0; } catch (e) {}
    try { tp = h.dueList ? h.dueList().filter((id) => h.nprobs(id)).length : 0; } catch (e) {}
    return { mk, fc, tp, all: mk + fc + tp };
  }
  /* a problem worked on paper takes about a minute; a flashcard about twelve seconds */
  const minutes = (c) => Math.max(1, Math.round(1.2 * (Math.min(c.mk, CAP.mk) + Math.min(c.tp, CAP.tp)) + Math.min(c.fc, CAP.fc) / 5));
  function nextDue() {
    const h = H(), t = [], now = Date.now();
    try { const LS = h.LS(); Object.keys(LS.r || {}).forEach((id) => { const r = LS.r[id]; if (LS.u[id] && N()[id] && r && r.due > now) t.push(r.due); }); } catch (e) {}
    try { const x = WL.mistakes && WL.mistakes.nextDue ? WL.mistakes.nextDue() : 0; if (x) t.push(x); } catch (e) {}
    try { const x = WL.cards && WL.cards.nextDue ? WL.cards.nextDue() : 0; if (x) t.push(x); } catch (e) {}
    return t.length ? Math.min(...t) : 0;
  }
  function when(t) {
    const d0 = new Date(); d0.setHours(0, 0, 0, 0);
    const k = Math.floor((t - d0.getTime()) / DAY);
    return k <= 0 ? 'later today' : k === 1 ? 'tomorrow' : k < 7 ? 'on ' + new Date(t).toLocaleDateString(undefined, { weekday: 'long' }) : `in ${k} days`;
  }
  function breakdown(c, sep = ' · ') {
    return [c.mk ? plural(c.mk, 'question') + ' you missed' : '', c.fc ? plural(c.fc, 'flashcard') : '', c.tp ? plural(c.tp, 'topic') + ' to check' : ''].filter(Boolean).join(sep);
  }
  function badge() {
    const b = document.getElementById('study-due'); if (!b) return;
    let c = { all: 0 }; try { c = dueCounts(); } catch (e) {}
    b.textContent = c.all ? (c.all > 99 ? '99+' : String(c.all)) : ''; b.hidden = !c.all;
    const a = b.closest('a'); if (a) a.setAttribute('aria-label', c.all ? `Study, ${c.all} due for review` : 'Study');
  }
  ['wl-mist', 'wl-cards', 'hashchange'].forEach((ev) => window.addEventListener(ev, () => setTimeout(badge, 0)));
  setTimeout(badge, 1200);

  /* the next lesson: today's planned topic if there is a plan, otherwise where the learner stopped or the next one */
  function nextLesson() {
    const h = H(), n = N(); let id = null;
    try { const T = WL.studyPlan && WL.studyPlan.todayIds ? WL.studyPlan.todayIds() : []; id = T.find((x) => n[x] && !h.done.has(x)) || null; } catch (e) {}
    if (!id) {
      try { const LS = h.LS(), last = LS.last && n[LS.last] ? LS.last : null; id = last && !h.done.has(last) ? last : h.nextUp(last ? n[last].track : 'physics'); } catch (e) {}
    }
    if (!id || !n[id]) return null;
    let mins = 0; try { mins = WL.tlec && WL.tlec.minsOf ? WL.tlec.minsOf(id) : 0; } catch (e) {}
    return { id, title: n[id].title, mins };
  }

  /* ---------- the round ---------- */
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function build(mixOnly) {
    const h = H(), n = N(), items = [], used = new Set();
    if (!mixOnly) {
      let k = 0;
      (WL.mistakes && WL.mistakes.due ? WL.mistakes.due() : []).forEach((e) => {
        if (k >= CAP.mk || !n[e.tid]) return; const p = h.getProb ? h.getProb(e.tid, e.key) : null; if (!p || !p.q) return;
        used.add(e.tid + '|' + e.key); items.push({ t: 'mk', tid: e.tid, key: String(e.key), p, e }); k++;
      });
      (WL.cards && WL.cards.dueIds ? WL.cards.dueIds() : []).slice(0, CAP.fc).forEach((id) => items.push({ t: 'fc', tid: id.split(':')[1], id, again: 0 }));
      (h.dueList ? h.dueList() : []).filter((id) => h.nprobs(id)).slice(0, CAP.tp).forEach((id) => {
        const x = h.reviewPick(id, used); if (x) { used.add(id + '|' + x.i); items.push({ t: 'tp', tid: id, i: x.i, p: x.p, due: true }); }
      });
    }
    /* a very short round, or mixed practice on request, is topped up from topics already understood */
    const want = mixOnly ? 6 : items.length && items.length < 4 ? 4 : 0;
    if (want) {
      const LS = h.LS(), pool = shuffle(Object.keys(LS.u || {}).filter((id) => n[id] && h.nprobs(id) && !items.some((x) => x.tid === id)));
      for (const id of pool) { if (items.length >= want) break; const x = h.reviewPick(id, used); if (x) { used.add(id + '|' + x.i); items.push({ t: 'tp', tid: id, i: x.i, p: x.p, due: false }); } }
    }
    return interleave(items);
  }
  /* each kind is spread evenly over the round (the j-th of n items sits near (j + ½)/n), then no topic twice in a row */
  function interleave(items) {
    const by = { mk: shuffle(items.filter((x) => x.t === 'mk')), fc: items.filter((x) => x.t === 'fc'), tp: shuffle(items.filter((x) => x.t === 'tp')) };
    const pos = [];
    Object.keys(by).forEach((k) => by[k].forEach((x, j) => pos.push([(j + 0.5) / by[k].length + Math.random() * 1e-3, x])));
    const Q = pos.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    for (let i = 1; i < Q.length; i++) if (Q[i].tid === Q[i - 1].tid) {
      const j = Q.findIndex((x, t) => t > i && x.tid !== Q[i - 1].tid && (!Q[t - 1] || t - 1 === i || Q[t - 1].tid !== Q[i].tid) && (!Q[t + 1] || Q[t + 1].tid !== Q[i].tid));
      if (j > 0) [Q[i], Q[j]] = [Q[j], Q[i]];
    }
    return Q;
  }

  const KIND = { mk: 'My mistakes', fc: 'Flashcard', tp: 'Topic check' };
  let R = null, KEYS = null;
  function round(view, mixOnly) {
    R = { Q: build(mixOnly), k: 0, res: [], mix: !!mixOnly, flipped: false };
    document.title = (mixOnly ? 'Mixed practice' : "Today's review") + ' · Geodesic';
    if (!R.Q.length) return empty(view);
    const c = dueCounts();
    view.innerHTML = `<section class="td">
      <div class="td-top"><a class="td-up" href="#study">Study</a><h1 class="td-h">${mixOnly ? 'Mixed practice' : "Today's review"}</h1><p class="td-count" aria-live="polite"></p></div>
      ${mixOnly ? '' : `<p class="td-sub">${esc(breakdown(c))}, mixed into one round.</p>`}
      <div class="td-bar" role="progressbar" aria-label="Round progress" aria-valuemin="0" aria-valuemax="${R.Q.length}" aria-valuenow="0"><i></i></div>
      <div class="td-stage"></div></section>`;
    view.onclick = (e) => {
      if (e.target.closest('[data-td-show]')) return show(view);
      const g = e.target.closest('[data-td]'); if (g) return mark(view, +g.dataset.td);
      if (e.target.closest('[data-td-again]')) return round(view, false);
    };
    bindKeys(view);
    draw(view);
  }
  async function draw(view) {
    const st = view.querySelector('.td-stage'); if (!st || !R) return;
    if (R.k >= R.Q.length) return finish(view);
    const it = R.Q[R.k], h = H(), n = N()[it.tid], s = (h.stageOf && h.stageOf(it.tid)) || {}, lane = h.strandOf ? h.strandOf(it.tid).colour : '#58C4DD';
    R.flipped = false;
    view.querySelector('.td-count').textContent = `${R.k + 1} of ${R.Q.length}`;
    const bar = view.querySelector('.td-bar'); bar.setAttribute('aria-valuenow', String(R.k)); bar.querySelector('i').style.width = `${(R.k / R.Q.length) * 100}%`;
    let kind = KIND[it.t], front = '', back = '', marks = '';
    if (it.t === 'fc') {
      const c = WL.cards ? await WL.cards.cardById(it.id) : null;
      if (!view.contains(st) || R.Q[R.k] !== it) return;
      if (!c) { R.Q.splice(R.k, 1); return draw(view); }
      kind = c.kind; front = c.front; back = c.back;
      marks = ['Again', 'Hard', 'Good', 'Easy'].map((t, g) => `<button type="button" class="btn td-g td-g${g}" data-td="${g}"><b>${t}</b><small>${esc(WL.cards.label(it.id, g))}</small><kbd>${g + 1}</kbd></button>`).join('');
    } else {
      const p = it.p;
      front = `<div class="td-q">${pr(p.q)}</div>${it.t === 'mk' && it.e && it.e.t ? `<details class="td-was"><summary>What you wrote last time</summary><p>${esc(it.e.t)}</p></details>` : ''}`;
      back = `${p.a ? `<p class="pans"><b>Answer</b> ${pr(p.a)}</p>` : ''}${p.s && p.s.length ? `<ol class="psol">${p.s.map((x) => `<li>${pr(x)}</li>`).join('')}</ol>` : ''}`;
      const up = it.t === 'mk' ? 'one step nearer fixed' : it.due ? 'a wider gap' : '';
      marks = `<button type="button" class="btn td-g td-g0" data-td="0"><b>Not yet</b><small>back tomorrow</small><kbd>1</kbd></button><button type="button" class="btn td-g td-g2" data-td="2"><b>I got it</b>${up ? `<small>${up}</small>` : ''}<kbd>2</kbd></button>`;
    }
    st.innerHTML = `<article class="td-card" style="--lane:${lane}">
        <p class="td-meta"><span class="td-kind td-k-${it.t}">${esc(kind)}</span><a href="#t-${it.tid}">${esc(n.title)}</a><span>${esc(s.short || '')}</span>${it.t === 'tp' && !it.due ? '<span>extra practice</span>' : ''}</p>
        <div class="td-front">${front}</div>
        <div class="td-back" hidden>${back || '<p class="muted">There is no written answer for this one. Check yourself against the topic notes.</p>'}</div>
      </article>
      <div class="td-acts">
        <div class="td-go"><button type="button" class="btn primary" data-td-show>Show the answer <kbd>Space</kbd></button><span class="td-hint">${it.t === 'fc' ? 'Say it or write it down before you look.' : 'Work it out on paper first: the effort of recalling is what makes it stick.'}</span></div>
        <div class="td-marks" hidden role="group" aria-label="${it.t === 'fc' ? 'How well did you know it?' : 'Did you get it?'}">${marks}</div>
      </div>`;
    if (h.typeset) h.typeset(st.querySelector('.td-front'));
    const go = st.querySelector('[data-td-show]'); if (go && R.k > 0) go.focus({ preventScroll: true });
  }
  function show(view) {
    if (!R || R.flipped || R.k >= R.Q.length) return;
    R.flipped = true;
    const b = view.querySelector('.td-card .td-back'); if (!b) return;
    b.hidden = false; if (H().typeset) H().typeset(b);
    view.querySelector('.td-go').hidden = true;
    const m = view.querySelector('.td-marks'); m.hidden = false;
    const f = m.querySelector('.td-g2'); if (f) f.focus({ preventScroll: true });
  }
  function mark(view, g) {
    if (!R || !R.flipped || R.k >= R.Q.length) return;
    const it = R.Q[R.k], h = H(); let ok = g >= 1;
    try {
      if (it.t === 'fc') {
        WL.cards.rate(it.id, g);
        /* “Again”: the card comes back about four items later, never next to a card or question from the same topic */
        if (g === 0 && it.again < 2) {
          let at = Math.min(R.Q.length, R.k + 4);
          for (let d = 4; d <= 8; d++) { const j = Math.min(R.Q.length, R.k + d), a = R.Q[j - 1], b = R.Q[j]; if ((!a || a.tid !== it.tid) && (!b || b.tid !== it.tid)) { at = j; break; } if (j === R.Q.length) break; }
          R.Q.splice(at, 0, Object.assign({}, it, { again: it.again + 1 }));
        }
      } else if (it.t === 'tp') {
        h.markP(it.tid, it.i, ok);
        if (WL.mistakes) WL.mistakes.note(it.tid, String(it.i), { v: ok ? 'correct' : 'incorrect', t: '', fb: '', via: 'self' }, it.p, 'review');
        if (it.due || !ok) { h.reviewed(it.tid, ok); h.saveLS(); }
      } else {
        const e = it.e || {};
        WL.mistakes.note(it.tid, it.key, { v: ok ? 'correct' : 'incorrect', t: e.t || '', fb: e.fb || '', note: e.note || '', via: e.via || 'self' }, it.p, e.src);
      }
    } catch (er) { /* a failed save must not stop the round */ }
    if (!it.again) R.res.push({ t: it.t, tid: it.tid, ok, g });   // the score counts each item once, at its first try
    R.k++;
    badge();
    draw(view);
  }
  function finish(view) {
    const res = R.res, ok = res.filter((r) => r.ok).length, c = dueCounts(), nx = nextDue(), L = nextLesson();
    const bar = view.querySelector('.td-bar'); if (bar) { bar.setAttribute('aria-valuenow', String(R.Q.length)); bar.querySelector('i').style.width = '100%'; }
    const cnt = view.querySelector('.td-count'); if (cnt) cnt.textContent = 'Done';
    const line = (t, lab, good, bad) => { const X = res.filter((r) => r.t === t); if (!X.length) return ''; const k = X.filter((r) => r.ok).length; return `<li><span class="td-kind td-k-${t}">${lab}</span><b>${k} of ${X.length}</b><small>${k === X.length ? good : bad}</small></li>`; };
    view.querySelector('.td-stage').innerHTML = `<div class="td-done">
      <p class="td-big">${ok} of ${res.length} right</p>
      <ul class="td-sum">${line('mk', 'My mistakes', 'Each moves a step nearer fixed: three right in a row and it leaves the list.', 'Not yet ones come back tomorrow; the rest move a step nearer fixed.')}${line('fc', 'Flashcards', 'Each one now waits longer before it comes back.', '“Again” cards come back within minutes; the rest wait longer.')}${line('tp', 'Topic checks', 'Those topics move to a wider gap.', 'Missed topics come back tomorrow; the rest move to a wider gap.')}</ul>
      <p class="td-next">${c.all ? `${plural(c.all, 'more item')} ${c.all === 1 ? 'is' : 'are'} due now.` : nx ? `Nothing else is due. The next review is ${when(nx)}.` : 'Nothing else is due.'}${ok < res.length ? ' Missing some is expected: the answers that were hard to bring back are the ones that stick.' : ''}</p>
      <div class="cta">${L ? `<a class="btn primary" href="#t-${L.id}">Next lesson: ${esc(L.title)}</a>` : ''}${c.all ? '<button type="button" class="btn" data-td-again>Another round</button>' : ''}<a class="btn ghost" href="#study">Back to Study</a></div>
    </div>`;
    const a = view.querySelector('.td-done .btn'); if (a) a.focus({ preventScroll: true });
  }
  function empty(view) {
    const h = H(), LS = h.LS(), und = Object.keys(LS.u || {}).filter((id) => N()[id] && h.nprobs(id)).length, nx = nextDue(), L = nextLesson();
    view.innerHTML = `<section class="td td-empty">
      <div class="td-top"><a class="td-up" href="#study">Study</a></div>
      <h1 class="td-h">${und || nx ? 'Nothing is due right now' : 'Nothing to review yet'}</h1>
      <p class="lede">${nx ? `The next review is ${when(nx)}. ` : ''}${und ? 'You can still do a short round of mixed practice from the topics you have understood.' : 'Three things come back here on a schedule: questions you get wrong in practice, flashcards you have started, and topics you mark understood. Each returns after a day, then after longer and longer gaps.'}</p>
      <div class="cta">${und ? '<a class="btn primary" href="#today-mix">Mixed practice</a>' : ''}${L ? `<a class="btn${und ? '' : ' primary'}" href="#t-${L.id}">Next lesson: ${esc(L.title)}</a>` : ''}<a class="btn ghost" href="#cards">Start some flashcards</a></div>
    </section>`;
  }
  function bindKeys(view) {
    if (KEYS) document.removeEventListener('keydown', KEYS);
    KEYS = (e) => {
      if (!R || !view.querySelector('.td-card')) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
      if (!R.flipped && (e.key === ' ' || (e.key === 'Enter' && !e.target.closest('a, button, summary')))) { e.preventDefault(); show(view); return; }
      if (R.flipped && /^[1-4]$/.test(e.key)) {
        const it = R.Q[R.k], g = +e.key - 1; if (!it) return;
        if (it.t === 'fc') { e.preventDefault(); mark(view, g); }
        else if (g <= 1) { e.preventDefault(); mark(view, g === 0 ? 0 : 2); }
      }
    };
    document.addEventListener('keydown', KEYS);
    window.addEventListener('hashchange', () => { if (KEYS) document.removeEventListener('keydown', KEYS); KEYS = null; }, { once: true });
  }

  /* ---------- the Study page ---------- */
  function desk(view) {
    const h = H(), n = N(), A = WL.app || {}, TR = A.TR || {}, LS = h.LS ? h.LS() : { u: {} };
    document.title = 'Study · Geodesic';
    const c = dueCounts(), nx = nextDue(), L = nextLesson();
    /* where you are */
    const lvl = (trId, lab) => {
      const r = WL.level ? WL.level.result(trId) : null, tr = TR[trId], st = r && tr ? tr.stages.find((x) => x.id === r.stage) : null;
      return st ? `${lab}: ${esc(st.short || st.name)}` : '';
    };
    const lv = [lvl('physics', 'Physics'), lvl('maths', 'Maths')].filter(Boolean).join(' · ');
    const und = Object.keys(LS.u || {}).filter((id) => n[id]).length;
    /* same rule as the knowledge map: not yet understood, and every topic it builds on understood */
    let ready = 0; try { const pre = A.prereq || {}; ready = Object.keys(n).filter((id) => !LS.u[id] && (pre[id] || []).filter((x) => n[x]).every((x) => LS.u[x])).length; } catch (e) {}
    let plan = ''; try { plan = WL.studyPlan ? WL.studyPlan.todayLine() : ''; } catch (e) {}
    /* library */
    let nb = { saved: 0, notes: 0, hl: 0 }; try { nb = WL.notebook && WL.notebook.counts ? WL.notebook.counts() : nb; } catch (e) {}
    const nbLine = nb.saved + nb.notes + nb.hl ? [nb.saved ? plural(nb.saved, 'saved topic') : '', nb.notes ? plural(nb.notes, 'note') : '', nb.hl ? plural(nb.hl, 'highlight') : ''].filter(Boolean).join(' · ') : 'Save topics, write notes, highlight lines as you read';
    let kt = 0; try { kt = Object.values(WL.keyterms || {}).reduce((s, a) => s + (a ? a.length : 0), 0); } catch (e) {}
    let mkOpen = 0; try { mkOpen = WL.mistakes ? WL.mistakes.open().length : 0; } catch (e) {}
    let rot = 0; try { rot = Object.keys(LS.r || {}).filter((id) => LS.u[id] && n[id]).length; } catch (e) {}
    let days = 0; try { const t0 = Date.now() - 6 * DAY, d = new Date(t0), k0 = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; days = (LS.days || []).filter((x) => x >= k0).length; } catch (e) {}
    const row = (href, title, line, extra = '') => `<li><a href="${href}"${extra}><b>${title}</b><span>${line}</span></a></li>`;
    const num = (k) => (k ? `<em class="dk-due">${k} due</em>` : '');
    view.innerHTML = `<section class="dk">
      <header class="dk-h"><h1>Study</h1><p class="lede">Your own learning in one place: what is due today, where you are, and everything you have kept.</p></header>
      <div class="dk-today">
        <div class="dk-rev">
          <p class="dk-k">Today's review</p>
          ${c.all ? `<p class="dk-n"><b>${c.all}</b><span>due · about ${plural(minutes(c), 'minute')}</span></p>
            <p class="dk-mix">${esc(breakdown(c))}, mixed into one round.</p>
            <a class="btn primary" href="#today">Start today's review</a>`
          : `<p class="dk-n"><b>0</b><span>due${nx ? ` · next ${when(nx)}` : ''}</span></p>
            <p class="dk-mix">${und ? 'Nothing is waiting. A short round of mixed practice still helps.' : 'Questions you miss, flashcards you start and topics you mark understood come back here on a schedule.'}</p>
            ${und ? '<a class="btn" href="#today-mix">Mixed practice</a>' : '<a class="btn" href="#cards">Start some flashcards</a>'}`}
        </div>
        <div class="dk-les">
          <p class="dk-k">Next lesson</p>
          ${L ? `<a class="dk-lesson" href="#t-${L.id}" style="--lane:${h.strandOf ? h.strandOf(L.id).colour : '#58C4DD'}"><b>${esc(L.title)}</b><span>${esc(((h.stageOf && h.stageOf(L.id)) || {}).short || '')}${L.mins ? ` · ${L.mins} min lecture` : ''}</span></a>` : ''}
          <p class="dk-plan">${plan ? esc(plan) : 'No study plan yet. <a href="#planner">Plan the days to your exam</a>'}</p>
        </div>
      </div>
      <div class="dk-cols">
        <section class="dk-col" aria-labelledby="dk-where"><h2 id="dk-where">Where you are</h2><ul>
          ${row('#map', 'Knowledge map', und ? `${und} understood · ${ready} ready to learn next` : 'Every topic and what it builds on')}
          ${row('#planner', 'Study planner', plan ? esc(plan) : 'Every day until your exam, topic by topic')}
          ${row('#activity', 'Your activity', days ? `${plural(days, 'day')} of study in the last seven · time, topics and records` : 'Time spent, topics finished and your records')}
        </ul></section>
        <section class="dk-col" aria-labelledby="dk-lib"><h2 id="dk-lib">Your library</h2><ul>
          ${row('#notebook', 'Notebook', esc(nbLine))}
          ${row('#formulas', 'Formula sheet', 'Every key equation, stage by stage, printable')}
          ${row('#glossary', 'Glossary', kt ? `${kt} key terms, in the words mark schemes accept` : 'Key terms in the words mark schemes accept')}
        </ul></section>
        <section class="dk-col" aria-labelledby="dk-one"><h2 id="dk-one">One kind at a time</h2><ul>
          ${row('#mistakes', `My mistakes ${num(c.mk)}`, mkOpen ? `${mkOpen} in the list · right three times and they leave` : 'Every wrong answer comes back until you get it')}
          ${row('#cards', `Flashcards ${num(c.fc)}`, 'Key terms, equations and quick checks, twenty new a day')}
          ${row('#review', `Topic review ${num(c.tp)}`, rot ? `${rot} topics in rotation: 1, 3, 7, 16, 35, 80 days` : 'Topics you mark understood return at widening gaps')}
        </ul></section>
      </div>
      <p class="dk-foot"><button type="button" class="linkbtn" data-read-open>Reading settings</button></p>
    </section>`;
    view.onclick = null;
  }

  WL.pages = WL.pages || {};
  WL.pages.study = { match: (h) => h === 'study', nav: 'study', render(h, view) { desk(view); } };
  WL.pages.today = { match: (h) => h === 'today' || h === 'today-mix', nav: 'study', render(h, view) { round(view, h === 'today-mix'); } };
  WL.desk = { badge, dueCounts, minutes, breakdown, nextDue, when, nextLesson, build, interleave };
})();
/* Feynman, a little at a time: for every topic, five short original pieces in Feynman's manner (not his words): what
   you notice, the physical picture behind it, why it has to be so, a rough number you can check in your head, and what
   the picture leaves out. They are no longer one block: each piece sits beside the part of the lesson and of the notes
   it belongs to (what you notice before the key ideas, the picture after them, why it has to be so after the
   derivation, the rough number after the worked example or the equation sheet, what it leaves out with the
   assumptions), and the last one links to the matching chapters of The Feynman Lectures at Caltech.
   Data: WL.fy(id, [notice, picture, why, estimate, leaves out]), one file per stage (js/fey-<stage>.js), loaded the
   first time a topic of that stage is opened. The page marks where they go with [data-fy="lesson"] and [data-fy="notes"]. */
(function () {
  const WL = (window.WL = window.WL || {});
  WL.fey = WL.fey || {};
  WL.fy = (id, d) => { WL.fey[id] = d; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* the text is written with x^(…) and x_(…) for powers and indices; the maths setter wants x^{…}, and a lone
     symbol such as ∞ after ^ needs braces too */
  const supFix = (s) => {
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      if ((c === '^' || c === '_') && s[i + 1] === '(') {
        let d = 0, j = i + 1;
        for (; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')' && --d === 0) break; }
        if (j < s.length) { out += c + '{' + s.slice(i + 2, j) + '}'; i = j + 1; continue; }
      }
      if (c === '^' && s[i + 1] && /[∞±∓√]/.test(s[i + 1])) { out += '^{' + s[i + 1] + '}'; i += 2; continue; }
      out += c; i++;
    }
    return out;
  };
  const pr = (s) => { const base = WL.texPretty || WL.pretty || esc; return supFix(String(s == null ? '' : s)).split(/\*\*(.+?)\*\*/).map((t, i) => (i % 2 ? '<b>' + base(t) + '</b>' : base(t))).join(''); };
  const node = (id) => (((WL.app || {}).nodes || {})[id]) || null;
  const loading = {};
  function loadFile(st) {
    if (!st) return Promise.reject(new Error('no stage'));
    return loading[st] || (loading[st] = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'js/fey-' + st + '.js'; s.async = true;
      s.onload = () => res(); s.onerror = () => rej(new Error('fey file'));
      document.head.appendChild(s);
    }));
  }
  WL.feyLoad = async (id) => { if (WL.fey[id]) return WL.fey[id]; const n = node(id); try { await loadFile(n && n.stage); } catch (e) { return null; } return WL.fey[id] || null; };

  const KEYS = ['notice', 'picture', 'why', 'estimate', 'leaves'];
  const HEADS = ['what you notice', 'the picture', 'why it has to be so', 'a rough number', 'what the picture leaves out'];
  const flpHTML = (id) => {
    const ch = WL.flp ? WL.flp.forTopic(id) : [];
    return ch.length ? `<p class="fyn-flp">Read Feynman on this, free at Caltech: ${ch.slice(0, 3).map((c) => `<a href="${esc(c.url)}" target="_blank" rel="noopener">Vol. ${c.v}, ch. ${c.n}, ${esc(c.t)}</a>`).join('; ')}.</p>` : '';
  };
  const aside = (d, i, extra) => `<aside class="fyn fyn-${KEYS[i]}" aria-label="Feynman: ${HEADS[i]}"><p class="fyn-k">Feynman: ${HEADS[i]}</p><p class="fyn-t">${pr(d[i])}</p>${extra || ''}</aside>`;

  /* where each piece goes. Each spot is an element to put the piece after; a missing spot falls back to the one before,
     so the five always keep their order */
  const isHead = (el, re) => el.matches('h2.sec') && re.test(el.textContent);
  const boundary = (el) => el.matches('h2.sec, section, aside.pretest, .fyn');
  function blockEnd(kids, i) { let j = i + 1; while (j < kids.length && !boundary(kids[j])) j++; return kids[j - 1]; }
  function lessonSpots(pane, slot) {
    const kids = [...pane.children], at = (re) => kids.findIndex((k) => isHead(k, re));
    const iKey = at(/key ideas/i), iDer = at(/derivation/i), iAs = at(/assumption|where it breaks/i), iW = kids.findIndex((k) => k.matches('section.worked'));
    return [slot, iKey >= 0 ? blockEnd(kids, iKey) : null, iDer >= 0 ? blockEnd(kids, iDer) : null, iW >= 0 ? kids[iW] : null, iAs >= 0 ? blockEnd(kids, iAs) : kids[kids.length - 1]];
  }
  function notesSpots(art, slot) {
    const kids = [...art.children], secs = kids.filter((k) => k.matches('section.nsec'));
    const title = (s) => ((s.querySelector('h3') || {}).textContent || '').trim();
    const extra = /^(key terms|equation sheet|how to attack|close the notes)/i;
    const S = secs.filter((s) => !extra.test(title(s))), m = S.length;
    const eqSheet = secs.find((s) => /^equation sheet/i.test(title(s))), howTo = secs.find((s) => /^how to attack/i.test(title(s)));
    const big = kids.find((k) => k.matches('p.nbig'));
    const withEq = S.slice(1).find((s) => s.querySelector('.tex'));
    return [big || slot, m ? S[0] : null, m ? (withEq || S[Math.min(1, m - 1)]) : null, eqSheet || (m ? S[m - 1] : null), howTo || (m ? S[m - 1] : null)];
  }
  function place(id, d, spots, slot) {
    let prev = slot, last = null;
    for (let i = 0; i < 5; i++) {
      if (!d[i]) continue;
      const spot = spots[i] && spots[i].isConnected ? spots[i] : prev;
      const holder = document.createElement('div'); holder.innerHTML = aside(d, i);
      const el = holder.firstElementChild;
      /* two pieces after the same spot keep their order: the second goes after the first */
      let after = spot; while (after.nextElementSibling && after.nextElementSibling.classList.contains('fyn')) after = after.nextElementSibling;
      after.after(el); prev = el; last = el;
    }
    if (last) last.insertAdjacentHTML('beforeend', flpHTML(id));
    slot.remove();
  }
  WL.feyFill = async (root, id) => {
    const slots = [...(root || document).querySelectorAll('[data-fy]')]; if (!slots.length) return;
    const d = await WL.feyLoad(id);
    slots.forEach((slot) => {
      if (!slot.isConnected) return;
      if (!d) { slot.remove(); return; }
      const box = slot.parentElement, where = slot.dataset.fy;
      const spots = where === 'notes' && box.matches('article.notes, .nm-revise') ? notesSpots(box, slot) : lessonSpots(box, slot);
      place(id, d, spots, slot);
      if (WL.mathify) box.querySelectorAll('.fyn').forEach((el) => WL.mathify(el));
    });
  };
})();
/* The chapters of The Feynman Lectures on Physics and the topics of this site that treat the same physics, so each topic
   can link to its chapters. Chapter titles and links only: the lectures are read free in Caltech's online edition
   (feynmanlectures.caltech.edu); none of their text is reproduced here. */
(function () {
  const WL = (window.WL = window.WL || {});
  WL.pages = WL.pages || {};
  const URL0 = 'https://www.feynmanlectures.caltech.edu/';
  /* [chapter, title, [site topics]] */
  const V = [
    { v: 'I', name: 'Mainly mechanics, radiation and heat', ch: [
      [1, 'Atoms in Motion', ['ks3-particles', 'gcse-particles', 'al-ideal-gas']],
      [2, 'Basic Physics', ['gcse-atom', 'al-particles', 'y4-standard-model']],
      [3, 'The Relation of Physics to Other Sciences', ['gcse-atom', 'gcse-stars', 'ks3-earth']],
      [4, 'Conservation of Energy', ['ks3-energy', 'gcse-energy', 'al-energy', 'y1-work-energy']],
      [5, 'Time and Distance', ['gcse-measurement', 'al-units', 'ks3-speed', 'al-cosmology']],
      [6, 'Probability', ['m-probability-gcse', 'm-probability', 'm-random-walks', 'al-decay']],
      [7, 'The Theory of Gravitation', ['ks3-space', 'gcse-solar-system', 'al-gravfields', 'y2-central-force']],
      [8, 'Motion', ['ks3-speed', 'gcse-suvat', 'al-kinematics', 'm-kinematics-calc']],
      [9, 'Newton’s Laws of Dynamics', ['ks3-forces', 'gcse-forces', 'al-dynamics', 'm-newton-mech']],
      [10, 'Conservation of Momentum', ['gcse-newton', 'al-momentum', 'y1-systems']],
      [11, 'Vectors', ['gcse-measurement', 'al-units', 'm-vectors']],
      [12, 'Characteristics of Force', ['ks3-forces', 'al-dynamics', 'al-materials', 'm-statics']],
      [13, 'Work and Potential Energy (A)', ['gcse-work-power', 'al-energy', 'y1-work-energy']],
      [14, 'Work and Potential Energy (conclusion)', ['y1-work-energy', 'm-line-integrals', 'al-efields']],
      [15, 'The Special Theory of Relativity', ['y1-sr']],
      [16, 'Relativistic Energy and Momentum', ['y1-rel-dynamics', 'al-nuclear']],
      [17, 'Space-Time', ['y2-4vectors', 'y1-sr']],
      [18, 'Rotation in Two Dimensions', ['ks3-moments', 'gcse-moments', 'al-equilibrium', 'al-circular']],
      [19, 'Center of Mass; Moment of Inertia', ['y1-rotation', 'y1-systems', 'm-rigid-equilibrium']],
      [20, 'Rotation in Space', ['y1-angular-momentum', 'y2-rigid-body']],
      [21, 'The Harmonic Oscillator', ['al-shm', 'm-ode2']],
      [22, 'Algebra', ['m-complex', 'm-exp-log', 'm-indices']],
      [23, 'Resonance', ['al-damping', 'y1-oscillators']],
      [24, 'Transients', ['y1-oscillators', 'al-capacitors', 'm-ode2']],
      [25, 'Linear Systems and Review', ['m-ode2', 'm-laplace', 'y1-coupled']],
      [26, 'Optics: The Principle of Least Time', ['ks3-light', 'gcse-reflection-refraction', 'y2-lagrangian']],
      [27, 'Geometrical Optics', ['gcse-lenses', 'gcse-reflection-refraction']],
      [28, 'Electromagnetic Radiation', ['gcse-em-spectrum', 'y2-em-waves', 'y3-radiation']],
      [29, 'Interference', ['al-interference', 'y1-optics']],
      [30, 'Diffraction', ['al-stationary', 'y1-optics', 'y2-fourier']],
      [31, 'The Origin of the Refractive Index', ['gcse-em-spectrum', 'ks3-colour', 'y2-matter-fields']],
      [32, 'Radiation Damping. Light Scattering', ['ks3-colour', 'y3-radiation']],
      [33, 'Polarization', ['al-polarisation']],
      [34, 'Relativistic Effects in Radiation', ['al-doppler', 'y2-em-relativity', 'y3-radiation']],
      [35, 'Color Vision', ['ks3-colour']],
      [36, 'Mechanisms of Seeing', ['ks3-light', 'gcse-lenses']],
      [37, 'Quantum Behavior', ['al-photons', 'y1-qm-intro']],
      [38, 'The Relation of Wave and Particle Viewpoints', ['y1-qm-intro', 'y2-operators', 'y2-infinite-well']],
      [39, 'The Kinetic Theory of Gases', ['gcse-particles', 'al-ideal-gas']],
      [40, 'The Principles of Statistical Mechanics', ['y2-boltzmann', 'y2-partition']],
      [41, 'The Brownian Movement', ['m-random-walks', 'y2-boltzmann']],
      [42, 'Applications of Kinetic Theory', ['al-ideal-gas', 'al-temperature', 'y2-boltzmann']],
      [43, 'Diffusion', ['m-random-walks', 'gcse-heat-transfer']],
      [44, 'The Laws of Thermodynamics', ['al-thermodynamics', 'y1-thermo']],
      [45, 'Illustrations of Thermodynamics', ['y1-entropy', 'y2-blackbody']],
      [46, 'Ratchet and pawl', ['y1-entropy', 'y1-thermo']],
      [47, 'Sound. The wave equation', ['ks3-sound', 'gcse-sound', 'y1-wave-eq']],
      [48, 'Beats', ['al-waves', 'al-interference', 'y1-wave-eq']],
      [49, 'Modes', ['al-stationary', 'y1-coupled', 'y2-small-oscillations']],
      [50, 'Harmonics', ['al-stationary', 'm-fourier-series']],
      [51, 'Waves', ['gcse-waves', 'al-waves', 'y1-fluids']],
      [52, 'Symmetry in Physical Laws', ['y2-noether', 'y4-gauge']]] },
    { v: 'II', name: 'Mainly electromagnetism and matter', ch: [
      [1, 'Electromagnetism', ['gcse-static', 'al-efields', 'al-bfields', 'y1-maxwell']],
      [2, 'Differential Calculus of Vector Fields', ['m-partial', 'm-divcurl']],
      [3, 'Vector Integral Calculus', ['m-line-integrals', 'm-theorems']],
      [4, 'Electrostatics', ['gcse-static', 'al-efields', 'y1-gauss']],
      [5, 'Application of Gauss’ Law', ['y1-gauss']],
      [6, 'The Electric Field in Various Circumstances', ['y1-potential', 'y2-multipoles']],
      [7, 'The Electric Field in Various Circumstances (Continued)', ['y2-multipoles', 'm-conformal']],
      [8, 'Electrostatic Energy', ['y1-potential', 'al-capacitors']],
      [9, 'Electricity in the Atmosphere', ['gcse-static', 'al-efields']],
      [10, 'Dielectrics', ['al-capacitors', 'y2-matter-fields']],
      [11, 'Inside Dielectrics', ['y2-matter-fields']],
      [12, 'Electrostatic Analogs', ['gcse-heat-transfer', 'y2-multipoles', 'm-pde']],
      [13, 'Magnetostatics', ['gcse-electromagnets', 'y1-magnetostatics']],
      [14, 'The Magnetic Field in Various Situations', ['al-bfields', 'y1-magnetostatics']],
      [15, 'The Vector Potential', ['y1-magnetostatics', 'y4-gauge']],
      [16, 'Induced Currents', ['gcse-induction', 'gcse-transformer', 'al-induction']],
      [17, 'The Laws of Induction', ['al-induction', 'y1-faraday']],
      [18, 'The Maxwell Equations', ['y1-maxwell']],
      [19, 'The Principle of Least Action', ['y2-lagrangian', 'm-variations']],
      [20, 'Solutions of Maxwell’s Equations in Free Space', ['y2-em-waves']],
      [21, 'Solutions of Maxwell’s Equations with Currents and Charges', ['y3-radiation']],
      [22, 'AC Circuits', ['al-ac', 'y1-faraday']],
      [23, 'Cavity Resonators', ['al-stationary']],
      [24, 'Waveguides', ['y2-em-waves']],
      [25, 'Electrodynamics in Relativistic Notation', ['y2-4vectors', 'y2-em-relativity']],
      [26, 'Lorentz Transformations of the Fields', ['y2-em-relativity']],
      [27, 'Field Energy and Field Momentum', ['y2-em-waves', 'y2-em-relativity']],
      [28, 'Electromagnetic Mass', ['y4-qed', 'y4-renormalisation']],
      [29, 'The Motion of Charges in Electric and Magnetic Fields', ['al-efields', 'al-bfields', 'y3-landau']],
      [30, 'The Internal Geometry of Crystals', ['y3-solids']],
      [31, 'Tensors', ['m-tensors']],
      [32, 'Refractive Index of Dense Materials', ['y2-matter-fields']],
      [33, 'Reflection from Surfaces', ['gcse-reflection-refraction', 'al-polarisation']],
      [34, 'The Magnetism of Matter', ['y2-matter-fields', 'y3-spin']],
      [35, 'Paramagnetism and Magnetic Resonance', ['y3-spin']],
      [36, 'Ferromagnetism', ['ks3-magnets', 'y4-ising']],
      [37, 'Magnetic Materials', ['ks3-magnets', 'gcse-electromagnets']],
      [38, 'Elasticity', ['gcse-forces', 'al-materials']],
      [39, 'Elastic Materials', ['al-materials']],
      [40, 'The Flow of Dry Water', ['y1-fluids', 'y3-fluid-dynamics']],
      [41, 'The Flow of Wet Water', ['y3-fluid-dynamics']],
      [42, 'Curved Space', ['y3-equivalence', 'y4-gr', 'm-diffgeo']]] },
    { v: 'III', name: 'Quantum mechanics', ch: [
      [1, 'Quantum Behavior', ['al-photons', 'y1-qm-intro']],
      [2, 'The Relation of Wave and Particle Viewpoints', ['y1-qm-intro', 'y2-operators']],
      [3, 'Probability Amplitudes', ['y3-dirac']],
      [4, 'Identical Particles', ['y3-identical', 'y3-quantum-gases']],
      [5, 'Spin One', ['y3-spin', 'y3-angular-momentum']],
      [6, 'Spin One-Half', ['y3-spin']],
      [7, 'The Dependence of Amplitudes on Time', ['y2-schrodinger', 'y3-time-dependent']],
      [8, 'The Hamiltonian Matrix', ['y3-dirac', 'm-eigen']],
      [9, 'The Ammonia Maser', ['y3-lasers', 'y3-time-dependent']],
      [10, 'Other Two-State Systems', ['y3-dirac', 'y3-fine-structure']],
      [11, 'More Two-State Systems', ['y3-spin', 'y3-entanglement']],
      [12, 'The Hyperfine Splitting in Hydrogen', ['y3-hydrogen', 'y3-fine-structure']],
      [13, 'Propagation in a Crystal Lattice', ['y3-solids']],
      [14, 'Semiconductors', ['y3-semiconductors']],
      [15, 'The Independent Particle Approximation', ['y3-solids', 'y3-identical']],
      [16, 'The Dependence of Amplitudes on Position', ['y2-schrodinger', 'y3-tunnelling']],
      [17, 'Symmetry and Conservation Laws', ['y2-noether', 'm-groups']],
      [18, 'Angular Momentum', ['y3-angular-momentum']],
      [19, 'The Hydrogen Atom and The Periodic Table', ['al-spectra', 'y3-hydrogen']],
      [20, 'Operators', ['y2-operators']],
      [21, 'The Schrödinger Equation in a Classical Context: A Seminar on Superconductivity', ['y4-superconductivity']]] }
  ];
  const url = (v, n) => `${URL0}${v}_${String(n).padStart(2, '0')}.html`;
  /* topic → the chapters that treat it */
  const BY = {};
  V.forEach((vol) => vol.ch.forEach(([n, t, ts]) => ts.forEach((id) => (BY[id] = BY[id] || []).push({ v: vol.v, n, t, url: url(vol.v, n) }))));
  WL.flp = { vols: V, url, forTopic: (id) => BY[id] || [] };

  /* the Feynman section has gone: each topic now carries Feynman beside its own notes (js/fey.js), with these chapter
     links. Old links to #feynman land on the physics topics. */
  WL.pages.feynman = {
    match: (h) => h === 'feynman' || /^feynman-(I|II|III)$/.test(h), nav: 'physics',
    render() { location.replace('#physics'); }
  };
})();
/* Geodesic — the problem forge. Einstein writes new competition problems in the style and at the difficulty of problems
   the site already has, then checks its own answers: it solves every question again from the question alone, and any
   question whose two answers disagree is dropped. Used by the physics olympiad problems (oly-probs.js), the maths
   competitions (comp.js) and the physics competitions (pcomp.js). Nothing about the reader goes into a request. */
(function () {
  const WL = (window.WL = window.WL || {});
  const LET = 'ABCDE';
  const jsonOf = (t) => { const s = String(t || ''), a = s.indexOf('{'), b = s.lastIndexOf('}'); if (a < 0 || b <= a) return null; try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; } };
  const close = (x, y, tol = 0.02) => isFinite(x) && isFinite(y) && (y === 0 ? Math.abs(x) < 1e-9 : Math.abs(x / y - 1) <= tol);
  const numOf = (v) => {
    if (typeof v === 'number') return v;
    const t = String(v == null ? '' : v).replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, '').replace(/[×x·*]10\^?\(?([-+]?\d+)\)?/, 'e$1')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (c) => ({ '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' })[c]);
    const m = t.match(/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/i); return m ? parseFloat(m[0]) : NaN;
  };
  const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const STYLE = 'Write maths as plain text with Unicode symbols, as in "v² = u² + 2as", "½mv²", "√(g/L)" or "6.0 × 10²⁴ kg". No LaTeX, no dollar signs, no Markdown.';
  async function ask(sys, user, prog, stage) {
    if (!WL.ai) throw new Error('Einstein is not available on this page.');
    const r = await WL.ai.ask(sys, [{ role: 'user', content: user }], { json: true, onText: prog ? (t) => prog(stage, t) : undefined });
    return { j: jsonOf(r.text), via: WL.ai.label ? WL.ai.label(r.p) : '' };
  }

  /* ---------- an olympiad problem: one situation followed through several parts, each with a numerical answer ---------- */
  const olyText = (P, withAns) => `Title: ${P.title}\nArea: ${P.area}\nSituation: ${P.stem}\n${P.parts.map((p, i) => `(${String.fromCharCode(97 + i)}) ${p.q}${withAns ? `\n    Answer: ${+Number(p.a).toPrecision(4)} ${p.u || ''}\n    Solution: ${p.sol}` : ''}`).join('\n')}`;
  async function olympiad(o, prog) {
    const { level, area, profile, like = [], avoid = [] } = o;
    const sys = `You set physics olympiad problems for Geodesic, a physics learning website. Write ONE new problem at this level: ${profile}.
${area ? `Area: ${area}.` : 'Choose any area of school or first-year university physics.'}
Here are problems from the site at this level. Match their length, structure and difficulty, but use a different physical situation:
${like.map((P, i) => `--- Example ${i + 1}\n${olyText(P, true)}`).join('\n')}
${avoid.length ? `Do not reuse these situations: ${avoid.join('; ')}.` : ''}
Rules:
- One physical situation, described in the "stem", with every value needed and its unit. Use SI units and realistic values.
- Each part asks for ONE number and says the unit to give it in. Its "a" is that number (a JSON number, at least 4 significant figures), "u" is the unit, and "sol" is a worked solution of two to four sentences that ends with the value.
- Later parts may build on earlier ones, but each must be answerable from the stem and the earlier parts.
- "hint" is one sentence that points at the key idea without giving the answer. "mins" is the time a strong student needs.
- Work every answer out carefully, then check it once more, before you write it down.
- ${STYLE}
Reply with JSON only: {"title":"…","area":"…","mins":25,"stem":"…","parts":[{"q":"…","a":1.234,"u":"m/s","sol":"…"}],"hint":"…"}`;
    const g = await ask(sys, 'Write the problem now.', prog, 'write');
    const j = g.j; if (!j || !j.stem || !Array.isArray(j.parts)) throw new Error('Einstein’s problem came back incomplete. Try again.');
    let parts = j.parts.map((p) => ({ q: str(p.q, 700), a: numOf(p.a), u: str(p.u, 24), tol: 0.02, sol: str(p.sol, 900) })).filter((p) => p.q && isFinite(p.a)).slice(0, 6);
    if (!parts.length) throw new Error('Einstein’s problem had no answer that could be checked. Try again.');
    const P = { title: str(j.title, 90) || 'A new problem', area: str(j.area, 40) || area || 'Mechanics', level, mins: Math.max(10, Math.min(60, Math.round(+j.mins || 20))), stem: str(j.stem, 1500), parts, hint: str(j.hint, 400) };
    /* the check: solve again from the problem alone */
    let dropped = 0, checked = true;
    try {
      if (prog) prog('check');
      const c = await ask(`Solve this physics problem carefully, part by part, as a strong olympiad student would. Give each answer as a number in the unit the part asks for. Reply with JSON only: {"answers":[number, …]}, one per part, in order.`, olyText(P, false), null);
      const ans = ((c.j || {}).answers || []).map(numOf);
      if (ans.length !== parts.length) throw new Error('count');
      const keep = parts.filter((p, i) => close(ans[i], p.a, 0.02));
      dropped = parts.length - keep.length;
      if (!keep.length || keep.length * 2 < parts.length) throw new Error('Einstein could not confirm enough of its own answers, so it threw the problem away. Try again.');
      P.parts = keep;
    } catch (e) { if (e && /threw the problem away/.test(e.message)) throw e; checked = false; dropped = 0; }
    P.gen = { at: Date.now(), via: g.via, dropped, checked };
    return P;
  }

  /* ---------- a contest set: short problems with a letter, a whole number or a numerical answer, or proofs ---------- */
  const FMT = { mc: 'multiple choice with five options A to E, exactly one right', int: 'a whole-number answer', num: 'a numerical answer, checked to 2 %', proof: 'a full written proof' };
  const qText = (p, withAns) => `${p.q}${p.t === 'mc' ? '\nOptions: ' + p.ch.map((c, i) => `${LET[i]}) ${c}`).join('   ') : ''}${withAns ? `\nAnswer: ${p.t === 'mc' ? LET[p.a] : p.t === 'proof' ? '(proof)' : p.a}${p.u ? ' ' + p.u : ''}\nSolution: ${p.sol}` : ''}`;
  async function contest(o, prog) {
    const { subject, tier, profile, n = 5, kind = 'mc', like = [], avoid = [] } = o;
    const sys = `You write ${subject} competition problems for Geodesic, a learning website. Write ${n} NEW problems for practice towards the ${tier}. ${profile}
Each problem's format: ${FMT[kind]}.
Here are problems from the site's own mock paper for this competition. Match their difficulty and style, from the easier to the harder end, but do not reuse their ideas or numbers:
${like.map((p, i) => `--- Example ${i + 1}\n${qText(p, true)}`).join('\n')}
${avoid.length ? `Do not repeat these: ${avoid.map((x) => '"' + String(x).slice(0, 80) + '"').join('; ')}.` : ''}
Rules:
- Order the ${n} problems from easiest to hardest. "lv" is 1 (warm-up), 2 (contest), 3 (hard) or 4 (olympiad).
${kind === 'mc' ? '- "ch" holds five options as short strings; "a" is the index (0 to 4) of the right one. Make the wrong options the answers of likely mistakes.' : kind === 'int' ? '- "a" is the answer as a JSON integer.' : kind === 'num' ? '- "a" is the answer as a JSON number and "u" its unit; give every value needed in the question.' : '- "mark" lists, in one or two sentences, what a complete proof must contain, for self-marking out of 10.'}
- "hint" is one sentence that points the way without giving the answer. "sol" is a complete solution of two to six sentences.
- Work out every answer carefully and check it once more before you write it down.
- ${STYLE}
Reply with JSON only: {"problems":[{"lv":2,"q":"…",${kind === 'mc' ? '"ch":["…","…","…","…","…"],"a":2,' : kind === 'int' ? '"a":42,' : kind === 'num' ? '"a":1.23,"u":"m/s",' : '"mark":"…",'}"hint":"…","sol":"…"}]}`;
    const g = await ask(sys, `Write the ${n} problems now.`, prog, 'write');
    const raw = ((g.j || {}).problems || []).slice(0, n + 2);
    let items = raw.map((p) => {
      const it = { t: kind, lv: [1, 2, 3, 4].includes(+p.lv) ? +p.lv : 2, q: str(p.q, 1200), hint: str(p.hint, 400), sol: str(p.sol, 1600) };
      if (!it.q) return null;
      if (kind === 'mc') { if (!Array.isArray(p.ch) || p.ch.length !== 5) return null; it.ch = p.ch.map((c) => str(c, 160)); it.a = +p.a; if (!(it.a >= 0 && it.a <= 4)) return null; }
      else if (kind === 'int') { it.a = Math.round(numOf(p.a)); if (!isFinite(it.a)) return null; }
      else if (kind === 'num') { it.a = numOf(p.a); it.u = str(p.u, 24); if (!isFinite(it.a)) return null; }
      else it.mark = str(p.mark, 500);
      return it;
    }).filter(Boolean);
    if (!items.length) throw new Error('Einstein’s problems came back incomplete. Try again.');
    let dropped = 0, checked = kind !== 'proof';
    if (kind !== 'proof') {
      try {
        if (prog) prog('check');
        const c = await ask(`Solve each numbered ${subject} problem below on your own, carefully. ${kind === 'mc' ? 'Give the letter of the right option.' : kind === 'int' ? 'Give the whole-number answer.' : 'Give the number in the unit asked for.'} Reply with JSON only: {"answers":[…]}, one per problem, in order.`, items.map((p, i) => `${i + 1}. ${qText(p, false)}`).join('\n\n'), null);
        const ans = (c.j || {}).answers || [];
        if (ans.length !== items.length) throw new Error('count');
        const keep = items.filter((p, i) => (kind === 'mc' ? String(ans[i]).trim().toUpperCase().charAt(0) === LET[p.a] : kind === 'int' ? Math.round(numOf(ans[i])) === p.a : close(numOf(ans[i]), p.a, 0.02)));
        dropped = items.length - keep.length;
        if (!keep.length) throw new Error('Einstein could not confirm any of its own answers, so it threw the set away. Try again.');
        items = keep;
      } catch (e) { if (e && /threw the set away/.test(e.message)) throw e; checked = false; dropped = 0; }
    }
    return { items, gen: { at: Date.now(), via: g.via, dropped, checked } };
  }
  /* progress text while Einstein writes: count the questions as they stream in */
  const progress = (el, what, n) => (stage, t) => {
    if (!el || !el.isConnected) return;
    if (stage === 'check') { el.textContent = 'Checking: Einstein is solving every question again from scratch'; return; }
    const k = (String(t || '').match(/"q"\s*:/g) || []).length;
    el.textContent = `Einstein is writing ${what}${n && k ? `: ${Math.min(k, n)} of ${n}` : ''}`;
  };
  WL.forge = { olympiad, contest, progress, numOf, close };
})();
/* Geodesic — full screen that survives the voice.
   Some viewers take a page out of full screen as soon as it starts (or stops) speaking, so that their own audio
   controls stay in view, and some refuse full screen outright. The players (lectures, live scenes, films) ask for
   real full screen first. If it is refused or unavailable, or it is closed within a moment of the voice starting
   or stopping, the player fills the window instead (CSS, class wl-fullwin) and keeps playing with the voice; for the
   rest of the visit, full screen with the voice on goes straight to that. Esc, the player's own button, or × leaves. */
(function () {
  const WL = (window.WL = window.WL || {});
  const KEY = 'wl-fswin';
  let kicked = false; try { kicked = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  let cur = null, winEl = null, ours = -1e9, entered = -1e9;
  const now = () => performance.now();
  const voiceOn = () => !!(WL.narrate && WL.narrate.pref && WL.narrate.pref.on);
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  const can = (el) => !!((document.fullscreenEnabled || document.webkitFullscreenEnabled) && (el.requestFullscreen || el.webkitRequestFullscreen));
  const target = (el) => (el && el.tagName === 'VIDEO' ? el.closest('.vwrap') || el.parentElement || el : el);
  const X = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function exitFs() { ours = now(); try { const p = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  function note(el, text) {
    let n = el.querySelector(':scope > .wl-fwnote');
    if (!n) { n = document.createElement('p'); n.className = 'wl-fwnote'; n.setAttribute('role', 'status'); el.appendChild(n); }
    n.textContent = text; n.classList.add('on'); clearTimeout(n._t); n._t = setTimeout(() => n.classList.remove('on'), 6500);
  }
  function win(el, on, why) {
    if (!el) return;
    if (on) {
      if (winEl && winEl !== el) win(winEl, false);
      winEl = el; el.classList.add('wl-fullwin'); document.documentElement.classList.add('wl-fw');
      // a film has no button of its own for this mode, so it gets a ×
      if (el.classList.contains('vwrap') && !el.querySelector(':scope > .wl-fwx')) {
        const x = document.createElement('button'); x.type = 'button'; x.className = 'wl-fwx'; x.title = 'Leave full window (Esc)'; x.setAttribute('aria-label', 'Leave full window'); x.innerHTML = X;
        x.addEventListener('click', (e) => { e.stopPropagation(); win(el, false); }); el.appendChild(x);
      }
      if (why) note(el, why);
    } else {
      el.classList.remove('wl-fullwin'); if (winEl === el) winEl = null;
      if (!winEl) document.documentElement.classList.remove('wl-fw');
      el.querySelectorAll(':scope > .wl-fwx, :scope > .wl-fwnote').forEach((x) => x.remove());
    }
    try { el.dispatchEvent(new CustomEvent('wl-fullwin', { detail: !!on })); } catch (e) {}
    window.dispatchEvent(new Event('resize'));
  }
  function toggle(el) {
    if (!el) return false;
    if (winEl) { const w = winEl; win(w, false); if (w === el) return false; }
    if (fsEl()) { exitFs(); return false; }
    if (!can(el)) { win(el, true); return true; }
    if (kicked && voiceOn()) { win(el, true); return true; }
    try {
      const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      if (p && p.catch) p.catch(() => { if (!fsEl() && winEl !== el) win(el, true); });
    } catch (e) { win(el, true); }
    return true;
  }
  function onChange() {
    const el = fsEl();
    if (el) { cur = el; entered = now(); return; }
    const was = cur; cur = null;
    if (!was || !was.isConnected || now() - ours < 900) return;      // our own button closed it
    const T = (WL.narrate && WL.narrate.speakT) || {}, t = now();
    // the voice was just asked to speak, began or stopped (some platforms leave full screen when audio starts)
    const nearVoice = Math.min(t - (T.req || -1e9), t - (T.start || -1e9), t - (T.end || -1e9)) < 1200;
    if (voiceOn() && (nearVoice || t - entered < 1500)) {
      kicked = true; try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      win(target(was), true, 'Full screen closed when the voice started, so the player now fills the window. Press Esc to leave.');
    }
  }
  function onErr(e) { const el = e.target && e.target.nodeType === 1 ? e.target : null; if (el && !winEl && !fsEl()) win(target(el), true); }
  document.addEventListener('fullscreenchange', onChange); document.addEventListener('webkitfullscreenchange', onChange);
  document.addEventListener('fullscreenerror', onErr); document.addEventListener('webkitfullscreenerror', onErr);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && winEl) { e.preventDefault(); e.stopPropagation(); win(winEl, false); } }, true);
  window.addEventListener('hashchange', () => { if (winEl) win(winEl, false); });
  WL.fs = { toggle, win, on: (el) => fsEl() === el || winEl === el, get kicked() { return kicked; } };
})();
/* Geodesic — geometry figures. WL.geo.svg(spec) draws a figure from a small description in which every point is
   computed, so a figure is exact: lengths and angles are drawn as the problem states them.
   Coordinates are in the figure's own units with y up. A spec can hold
     P    named points {A: [x, y]};             seg  'AB BC' or ['AB', …] (a token of 3+ names is a path: 'ABCA');
     dash dashed segments;                      line / ray  infinite lines through two points / rays from the first;
     hi   segments to look for (accent);         poly [{p: 'ABCD', fill: 1, dash: 0}];
     circ [{c: 'O' or [x, y], r} | {c, thru: 'A'} | {thru: 'ABC'}, dash, fill];
     arc  [{c, r, a0, a1} | {c, from: 'A', to: 'B'}] anticlockwise;  sector [{c, r, a0, a1}];
     ell  [{c, rx, ry, back: 'dash'}] (the far half dashed, for solids);
     ang  [['BAC', '50°', n, r]] the angle at the middle point, with a label and n arcs;  rt ['ADB'] right angles at D;
     tick {1: 'AB AC', 2: 'BD'} equal lengths;  len [['AB', '13', side]] a length written beside a segment;
     vec  ['OA'] arrows;  dot 'O P' marked points;  hide 'X' points left unnamed;  lab {A: 'nw' | degrees};
     axes {x: [a, b], y: [c, d], grid: 1, step: 1, every: 1, names: ['x', 'y']};  txt [[x, y, 'text', 'class']];
     alt  what the figure shows, for screen readers;  cap a caption;  size the longer side in pixels.
   WL.geo.fig(key) draws a figure registered with WL.geo.add({key: spec or (…) => spec}); WL.geo.h holds the
   constructions the figures are built with. */
(function () {
  const WL = (window.WL = window.WL || {});
  const D2R = Math.PI / 180, esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const nm = (n) => String(n).replace(/(\D)(\d+)$/, (m, a, d) => a + d.split('').map((c) => SUB[c]).join(''));
  const f = (x) => Math.round(x * 10) / 10;
  const cl = (c) => String(c == null ? '' : c).replace(/[^a-z0-9 _-]/gi, '').slice(0, 40);

  /* ---------- vectors and constructions ---------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const len = (a) => Math.hypot(a[0], a[1]), dist = (a, b) => len(sub(a, b)), unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const rot = (a, deg, c = [0, 0]) => { const t = deg * D2R, x = a[0] - c[0], y = a[1] - c[1]; return [c[0] + x * Math.cos(t) - y * Math.sin(t), c[1] + x * Math.sin(t) + y * Math.cos(t)]; };
  const H = {
    add, sub, mul, len, dist, unit, dot, cross, rot,
    mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
    pol: (r, deg, c = [0, 0]) => [c[0] + r * Math.cos(deg * D2R), c[1] + r * Math.sin(deg * D2R)],
    angOf: (v, c = [0, 0]) => Math.atan2(v[1] - c[1], v[0] - c[0]) / D2R,
    /* the angle at V between VA and VB, in degrees */
    angle: (A, V, B) => { const a = sub(A, V), b = sub(B, V); return Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (len(a) * len(b))))) / D2R; },
    foot: (P, A, B) => { const d = sub(B, A), t = dot(sub(P, A), d) / dot(d, d); return add(A, mul(d, t)); },
    refl: (P, A, B) => { const F = H.foot(P, A, B); return sub(mul(F, 2), P); },
    inter: (A, B, C, E) => { const r = sub(B, A), s = sub(E, C), d = cross(r, s); if (Math.abs(d) < 1e-12) return null; const t = cross(sub(C, A), s) / d; return add(A, mul(r, t)); },
    circ3: (A, B, C) => { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])), a2 = dot(A, A), b2 = dot(B, B), c2 = dot(C, C);
      const c = [(a2 * (B[1] - C[1]) + b2 * (C[1] - A[1]) + c2 * (A[1] - B[1])) / d, (a2 * (C[0] - B[0]) + b2 * (A[0] - C[0]) + c2 * (B[0] - A[0])) / d]; return { c, r: dist(c, A) }; },
    inc: (A, B, C) => { const a = dist(B, C), b = dist(C, A), c = dist(A, B), p = a + b + c, I = [(a * A[0] + b * B[0] + c * C[0]) / p, (a * A[1] + b * B[1] + c * C[1]) / p]; return { c: I, r: Math.abs(cross(sub(B, A), sub(C, A))) / p }; },
    ortho: (A, B, C) => H.inter(A, H.foot(A, B, C), B, H.foot(B, C, A)),
    cent: (...P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length],
    /* a triangle with BC = a, CA = b, AB = c: B at the origin, C on the positive x-axis, A above */
    tri: (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(Math.max(0, c * c - x * x)); return { A: [x, y], B: [0, 0], C: [a, 0] }; },
    /* sides b, c with the angle A between them: A at the origin, AB along the x-axis */
    sas: (b, c, Adeg) => ({ A: [0, 0], B: [c, 0], C: H.pol(b, Adeg) }),
    reg: (n, r, start = 90, c = [0, 0]) => Array.from({ length: n }, (_, i) => H.pol(r, start + (360 * i) / n, c)),
    /* the points where the tangents from P touch the circle (c, r) */
    tangents: (P, c, r) => { const d = dist(P, c), a = Math.acos(r / d) / D2R, base = H.angOf(P, c); return [H.pol(r, base + a, c), H.pol(r, base - a, c)]; },
    /* where the line through A and B meets the circle (c, r), nearest A first */
    lineCirc: (A, B, c, r) => { const d = sub(B, A), f0 = sub(A, c), a = dot(d, d), b = 2 * dot(f0, d), q = dot(f0, f0) - r * r, D = b * b - 4 * a * q; if (D < 0) return []; const s = Math.sqrt(D); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].map((t) => add(A, mul(d, t))); },
    /* an oblique view of a point in space: x across, y up, z into the page */
    p3: (x, y, z, k = 0.42, deg = 35) => [x + z * k * Math.cos(deg * D2R), y + z * k * Math.sin(deg * D2R)]
  };

  /* ---------- reading a spec ---------- */
  /* a run of point names, such as 'ABC' or 'kvko': at each place the longest name that the figure has */
  const names = (tok, P) => {
    if (Array.isArray(tok)) return tok; const t = String(tok); if (P[t]) return [t];
    const keys = Object.keys(P).sort((x, y) => y.length - x.length), out = []; let i = 0;
    while (i < t.length) { const k = keys.find((x) => t.startsWith(x, i)); if (k) { out.push(k); i += k.length; continue; } const m = /^[A-Z][a-z0-9']*|^[a-z][0-9']*/.exec(t.slice(i)); if (m) { out.push(m[0]); i += m[0].length; } else i++; }
    return out;
  };
  const list = (x) => (x == null ? [] : Array.isArray(x) ? x : String(x).trim().split(/\s+/).filter(Boolean));
  const DIR = { e: 0, ne: 45, n: 90, nw: 135, w: 180, sw: 225, s: 270, se: 315 };

  let gid = 0;
  function svg(S) {
    const P = Object.assign({}, S.P || {});
    const pt = (x) => (Array.isArray(x) ? x : P[x]);
    const has = (...ns) => ns.every((n) => { const p = pt(n); return Array.isArray(p) && isFinite(p[0]) && isFinite(p[1]); });
    /* every place the figure reaches, for its size */
    const ext = [];
    Object.values(P).forEach((p) => ext.push(p));
    const circs = (S.circ || []).filter((c) => (c.c ? has(c.c) : true) && (!c.thru || names(c.thru, P).every((n) => has(n)))).map((c) => { let cc, r; if (c.thru && !c.c && String(c.thru).length >= 3) { const [a, b, d] = names(c.thru, P).map(pt); const o = H.circ3(a, b, d); cc = o.c; r = o.r; } else { cc = pt(c.c); r = c.r != null ? c.r : dist(cc, pt(names(c.thru, P)[0])); } return Object.assign({}, c, { cc, r }); });
    circs.forEach(({ cc, r }) => { ext.push([cc[0] - r, cc[1] - r], [cc[0] + r, cc[1] + r]); });
    (S.ell || []).filter((e) => has(e.c)).forEach((e) => { const c = pt(e.c); ext.push([c[0] - e.rx, c[1] - e.ry], [c[0] + e.rx, c[1] + e.ry]); });
    const arcs = (S.arc || []).concat((S.sector || []).map((x) => Object.assign({ sector: 1 }, x))).filter((a) => has(a.c) && (!a.from || has(a.from, a.to))).map((a) => { const c = pt(a.c); let r = a.r, a0 = a.a0, a1 = a.a1; if (a.from) { const A = pt(a.from), B = pt(a.to); r = r || dist(A, c); a0 = H.angOf(A, c); a1 = H.angOf(B, c); } while (a1 < a0) a1 += 360; return Object.assign({}, a, { cc: c, r, a0, a1 }); });
    arcs.forEach((a) => { for (let t = a.a0; t <= a.a1; t += 5) ext.push(H.pol(a.r, t, a.cc)); ext.push(H.pol(a.r, a.a1, a.cc)); });
    if (S.axes) { ext.push([S.axes.x[0], S.axes.y[0]], [S.axes.x[1], S.axes.y[1]]); }
    (S.txt || []).forEach((t) => ext.push([t[0], t[1]]));
    (S.curve || []).forEach((c) => (c.pts || c).forEach((p) => ext.push(p)));
    (S.bounds || []).forEach((b) => ext.push(b));
    let x0 = Math.min(...ext.map((p) => p[0])), x1 = Math.max(...ext.map((p) => p[0])), y0 = Math.min(...ext.map((p) => p[1])), y1 = Math.max(...ext.map((p) => p[1]));
    if (!isFinite(x0 + x1 + y0 + y1)) return '';
    const dx = Math.max(x1 - x0, 1e-6), dy = Math.max(y1 - y0, 1e-6), size = S.size || 250;
    const k = Math.min(size / dx, size / dy, S.maxk || Infinity), pad = S.pad != null ? S.pad : 26;
    const W = Math.round(dx * k + 2 * pad), Hh = Math.round(dy * k + 2 * pad);
    const X = (p) => [pad + (p[0] - x0) * k, pad + (y1 - p[1]) * k];
    const px = (n) => X(pt(n));
    const out = { fill: [], back: [], line: [], mark: [], dot: [], text: [] }, boxes = [];
    const tbox = (x, y, t, size = 13, anchor = 'middle') => { const w = String(t).length * size * 0.56; boxes.push([anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2, y - size * 0.7, anchor === 'end' ? x : anchor === 'start' ? x + w : x + w / 2, y + size * 0.7]); };
    const seg = (a, b, cls) => { const A = X(a), B = X(b); out.line.push(`<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}" class="${cls}"/>`); };
    const path = (pts, cls, close) => `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join('')}${close ? 'Z' : ''}" class="${cls}"/>`;
    const tokens = (x) => list(x).map((t) => names(t, P));
    /* which points are joined, for placing their names */
    const nbr = {}; const join = (a, b) => { (nbr[a] = nbr[a] || []).push(b); (nbr[b] = nbr[b] || []).push(a); };

    /* fills */
    (S.poly || []).forEach((o) => { const ns = names(o.p, P).filter((n) => has(n)); if (ns.length < 2) return; const pts = ns.map(px); if (o.fill) out.fill.push(path(pts, 'gf' + (o.fill === 2 ? ' gf2' : ''), true)); out.line.push(path(pts, o.dash ? 'gd' : o.hi ? 'gh' : 'gl', true)); ns.forEach((n, i) => join(n, ns[(i + 1) % ns.length])); });
    arcs.filter((a) => a.sector).forEach((a) => { const pts = [X(a.cc)]; for (let t = a.a0; t < a.a1; t += 3) pts.push(X(H.pol(a.r, t, a.cc))); pts.push(X(H.pol(a.r, a.a1, a.cc))); out.fill.push(path(pts, 'gf', true)); out.line.push(path(pts, 'gl', true)); });
    circs.filter((c) => c.fill).forEach((c) => { const C = X(c.cc); out.fill.push(`<circle cx="${f(C[0])}" cy="${f(C[1])}" r="${f(c.r * k)}" class="gf"/>`); });
    /* axes and grid */
    if (S.axes) {
      const A = S.axes, st = A.step || 1, ev = A.every || st, g = [], tx = [];
      if (A.grid) { for (let x = Math.ceil(A.x[0] / st) * st; x <= A.x[1] + 1e-9; x += st) { const a = X([x, A.y[0]]), b = X([x, A.y[1]]); g.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`); } for (let y = Math.ceil(A.y[0] / st) * st; y <= A.y[1] + 1e-9; y += st) { const a = X([A.x[0], y]), b = X([A.x[1], y]); g.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`); } }
      out.back.push(`<g class="gg">${g.join('')}</g>`);
      const oy = Math.max(A.y[0], Math.min(A.y[1], 0)), ox = Math.max(A.x[0], Math.min(A.x[1], 0));
      const ax0 = X([A.x[0], oy]), ax1 = X([A.x[1], oy]), ay0 = X([ox, A.y[0]]), ay1 = X([ox, A.y[1]]), id = 'ga' + ++gid;
      out.back.push(`<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" class="gar"/></marker></defs><line x1="${f(ax0[0])}" y1="${f(ax0[1])}" x2="${f(ax1[0] + 8)}" y2="${f(ax1[1])}" class="gx" marker-end="url(#${id})"/><line x1="${f(ay0[0])}" y1="${f(ay0[1])}" x2="${f(ay1[0])}" y2="${f(ay1[1] - 8)}" class="gx" marker-end="url(#${id})"/>`);
      const [xn, yn] = A.names || ['x', 'y'];
      tx.push(`<text x="${f(ax1[0] + 6)}" y="${f(ax1[1] + 16)}" class="gt gax">${esc(xn)}</text><text x="${f(ay1[0] + 9)}" y="${f(ay1[1] - 2)}" class="gt gax">${esc(yn)}</text>`);
      if (A.xt || A.yt) {
        (A.xt || []).forEach(([x, t]) => { const a = X([x, oy]); tx.push(`<line x1="${f(a[0])}" y1="${f(a[1] - 3)}" x2="${f(a[0])}" y2="${f(a[1] + 3)}" class="gx"/><text x="${f(a[0])}" y="${f(a[1] + 15)}" class="gt gn" text-anchor="middle">${esc(t)}</text>`); });
        (A.yt || []).forEach(([y, t]) => { const a = X([ox, y]); tx.push(`<line x1="${f(a[0] - 3)}" y1="${f(a[1])}" x2="${f(a[0] + 3)}" y2="${f(a[1])}" class="gx"/><text x="${f(a[0] - 6)}" y="${f(a[1] + 4)}" class="gt gn" text-anchor="end">${esc(t)}</text>`); });
      } else if (A.labels !== 0) {
        for (let x = Math.ceil(A.x[0] / ev) * ev; x <= A.x[1] - ev / 2; x += ev) { if (Math.abs(x) < 1e-9) continue; const a = X([x, oy]); tx.push(`<line x1="${f(a[0])}" y1="${f(a[1] - 3)}" x2="${f(a[0])}" y2="${f(a[1] + 3)}" class="gx"/><text x="${f(a[0])}" y="${f(a[1] + 15)}" class="gt gn" text-anchor="middle">${String(+x.toFixed(2)).replace('-', '−')}</text>`); }
        for (let y = Math.ceil(A.y[0] / ev) * ev; y <= A.y[1] - ev / 2; y += ev) { if (Math.abs(y) < 1e-9) continue; const a = X([ox, y]); tx.push(`<line x1="${f(a[0] - 3)}" y1="${f(a[1])}" x2="${f(a[0] + 3)}" y2="${f(a[1])}" class="gx"/><text x="${f(a[0] - 6)}" y="${f(a[1] + 4)}" class="gt gn" text-anchor="end">${String(+y.toFixed(2)).replace('-', '−')}</text>`); }
        const o = X([ox, oy]); if (A.x[0] < 0 && A.y[0] < 0 || A.o) tx.push(`<text x="${f(o[0] - 6)}" y="${f(o[1] + 15)}" class="gt gn" text-anchor="end">0</text>`);
      }
      out.text.push(tx.join(''));
    }
    /* circles, arcs, ellipses */
    circs.forEach((c) => { const C = X(c.cc); out.line.push(`<circle cx="${f(C[0])}" cy="${f(C[1])}" r="${f(c.r * k)}" class="${c.dash ? 'gd' : c.hi ? 'gh' : 'gl'}" fill="none"/>`); });
    arcs.filter((a) => !a.sector).forEach((a) => { const pts = []; for (let t = a.a0; t < a.a1; t += 3) pts.push(X(H.pol(a.r, t, a.cc))); pts.push(X(H.pol(a.r, a.a1, a.cc))); out.line.push(path(pts, a.dash ? 'gd' : a.hi ? 'gh' : 'gl')); });
    (S.ell || []).filter((e) => has(e.c)).forEach((e) => {
      const c = X(pt(e.c)), rx = e.rx * k, ry = e.ry * k;
      if (e.back) { out.line.push(`<path d="M${f(c[0] - rx)} ${f(c[1])}A${f(rx)} ${f(ry)} 0 0 0 ${f(c[0] + rx)} ${f(c[1])}" class="gl"/><path d="M${f(c[0] - rx)} ${f(c[1])}A${f(rx)} ${f(ry)} 0 0 1 ${f(c[0] + rx)} ${f(c[1])}" class="gd"/>`); }
      else out.line.push(`<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" class="${e.dash ? 'gd' : 'gl'}"/>`);
    });
    /* curves, such as the graph of a function */
    (S.curve || []).forEach((c) => { const pts = (c.pts || c).map(X); if (c.fill) out.fill.push(path(pts, 'gf' + (c.fill === 2 ? ' gf2' : ''), true)); if (!c.nostroke) out.line.push(path(pts, c.dash ? 'gd' : c.hi ? 'gh' : cl(c.cls) || 'gl', !!c.close)); });
    /* straight lines */
    const clip = (A, d) => { // the part of the line A + t d inside the drawing, in pixels
      const ts = []; const L = [0, W], T = [0, Hh];
      if (Math.abs(d[0]) > 1e-9) L.forEach((xx) => ts.push((xx - A[0]) / d[0]));
      if (Math.abs(d[1]) > 1e-9) T.forEach((yy) => ts.push((yy - A[1]) / d[1]));
      const ins = ts.map((t) => [t, add(A, mul(d, t))]).filter(([, p]) => p[0] >= -0.5 && p[0] <= W + 0.5 && p[1] >= -0.5 && p[1] <= Hh + 0.5).map(([t]) => t);
      return [Math.min(...ins), Math.max(...ins)];
    };
    const inset = (A, B, m) => { const u = unit(sub(B, A)); return [add(A, mul(u, m)), sub(B, mul(u, m))]; };
    tokens(S.line).filter((ns) => ns.length >= 2 && has(ns[0], ns[1])).forEach((ns) => { const A = px(ns[0]), B = px(ns[1]), d = sub(B, A), [t0, t1] = clip(A, d); const [a, b] = inset(add(A, mul(d, t0)), add(A, mul(d, t1)), 6); out.line.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" class="gl"/>`); join(ns[0], ns[1]); });
    tokens(S.ray).filter((ns) => ns.length >= 2 && has(ns[0], ns[1])).forEach((ns) => { const A = px(ns[0]), B = px(ns[1]), d = sub(B, A), [, t1] = clip(A, d); const e = sub(add(A, mul(d, t1)), mul(unit(d), 6)); out.line.push(`<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(e[0])}" y2="${f(e[1])}" class="gl"/>`); join(ns[0], ns[1]); });
    const segs = (x, cls) => tokens(x).forEach((ns) => { for (let i = 0; i + 1 < ns.length; i++) { if (!has(ns[i], ns[i + 1])) continue; seg(pt(ns[i]), pt(ns[i + 1]), cls); join(ns[i], ns[i + 1]); } });
    segs(S.seg, 'gl'); segs(S.dash, 'gd'); segs(S.hi, 'gh'); segs(S.thick, 'gl gk');
    /* arrows */
    if (S.vec) { const id = 'gv' + ++gid; out.back.push(`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1L10 5L0 9z" class="gva"/></marker></defs>`);
      tokens(S.vec).filter((ns) => ns.length >= 2 && has(ns[0], ns[1])).forEach((ns) => { const A = px(ns[0]), B = px(ns[1]); out.line.push(`<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}" class="gl gvl" marker-end="url(#${id})"/>`); join(ns[0], ns[1]); }); }
    /* angle marks */
    (S.ang || []).forEach((a) => {
      const [tri, t, n = 1, r0, cls, dir] = Array.isArray(a) ? a : [a.p, a.t, a.n, a.r, a.c, a.dir];
      const ns = names(tri, P); if (ns.length < 3 || !has(ns[0], ns[1], ns[2])) return; const V = px(ns[1]), A = px(ns[0]), B = px(ns[2]);
      let a1 = Math.atan2(-(A[1] - V[1]), A[0] - V[0]), a2 = Math.atan2(-(B[1] - V[1]), B[0] - V[0]), d = a2 - a1;
      while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
      if (dir === 'ccw' && d < 0) d += 2 * Math.PI; if (dir === 'cw' && d > 0) d -= 2 * Math.PI;
      const span = Math.abs(d), r = r0 || Math.max(15, Math.min(30, 15 + 30 * (1 - Math.min(span, Math.PI) / Math.PI) * 0.6));
      for (let j = 0; j < n; j++) { const rr = r + j * 4, pts = [], m = Math.max(24, Math.round(span * 12)); for (let s = 0; s <= m; s++) { const th = a1 + (d * s) / m; pts.push([V[0] + rr * Math.cos(th), V[1] - rr * Math.sin(th)]); } out.mark.push(path(pts, 'gm' + (cls ? ' ' + cl(cls) : ''))); }
      if (t) { const mid = a1 + d / 2, rr = r + (n - 1) * 4 + (span < 0.6 ? 16 : 12) + Math.max(0, String(t).length - 3) * 3.2, tp = [V[0] + rr * Math.cos(mid), V[1] - rr * Math.sin(mid)]; tbox(tp[0], tp[1], t, 12.5); out.text.push(`<text x="${f(tp[0])}" y="${f(tp[1])}" class="gt ga${cls ? ' ' + cl(cls) : ''}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`); }
    });
    (S.rt || []).forEach((a) => { const ns = names(a, P); if (ns.length < 3 || !has(ns[0], ns[1], ns[2])) return; const V = px(ns[1]), u = unit(sub(px(ns[0]), V)), w = unit(sub(px(ns[2]), V)), s = 9; out.mark.push(path([add(V, mul(u, s)), add(add(V, mul(u, s)), mul(w, s)), add(V, mul(w, s))], 'gm gr')); });
    /* equal lengths */
    Object.entries(S.tick || {}).forEach(([n, x]) => tokens(x).filter((ns) => ns.length >= 2 && has(ns[0], ns[1])).forEach((ns) => { const A = px(ns[0]), B = px(ns[1]), M = H.mid(A, B), u = unit(sub(B, A)), nn = [-u[1], u[0]]; for (let j = 0; j < +n; j++) { const c = add(M, mul(u, (j - (+n - 1) / 2) * 4)); const a = add(c, mul(nn, 5)), b = sub(c, mul(nn, 5)); out.mark.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" class="gm gtk"/>`); } }));
    /* the middle of the figure, for putting labels outside it */
    const all = Object.keys(P).filter((n) => !list(S.free).includes(n)).map(px), Cn = all.length ? H.cent(...all) : [W / 2, Hh / 2];
    (S.len || []).forEach(([s, t, side, cls]) => {
      const ns = names(s, P); if (ns.length < 2 || !has(ns[0], ns[1])) return; const A = px(ns[0]), B = px(ns[1]), M = H.mid(A, B), u = unit(sub(B, A)); let nn = [-u[1], u[0]];
      if (side) nn = mul(nn, side); else if (dot(nn, sub(M, Cn)) < 0) nn = mul(nn, -1);
      const tw = String(t).length * 13 * 0.56, off = Math.max(13, Math.abs(nn[0]) * tw / 2 + Math.abs(nn[1]) * 7 + 5), tp = add(M, mul(nn, off)); tbox(tp[0], tp[1], t); out.text.push(`<text x="${f(tp[0])}" y="${f(tp[1])}" class="gt gln${cls ? ' ' + cl(cls) : ''}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`);
    });
    /* points: dots, then names */
    list(S.dot).filter((n) => has(n)).forEach((n) => { const p = px(n); out.dot.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.8" class="gp"/>`); });
    const hide = new Set(list(S.hide)), L = S.lab || {};
    Object.keys(P).forEach((n) => {
      if (hide.has(n) || /^_/.test(n)) return;
      const p = px(n); let d;
      if (L[n] != null) { const deg = typeof L[n] === 'number' ? L[n] : DIR[L[n]]; d = [Math.cos(deg * D2R), -Math.sin(deg * D2R)]; }
      else {
        let s = [0, 0]; (nbr[n] || []).forEach((m) => { if (P[m]) s = add(s, unit(sub(px(m), p))); });
        circs.forEach((c) => { if (Math.abs(dist(pt(n), c.cc) - c.r) < 1e-6 * (1 + c.r)) s = add(s, unit(sub(X(c.cc), p))); });
        d = len(s) > 0.2 ? unit(mul(s, -1)) : unit(sub(p, Cn)); if (!len(d)) d = [0.7, -0.7];
      }
      const tp = add(p, [d[0] * (13 + Math.abs(d[0]) * 2), d[1] * 13]);
      const nt = (S.name || {})[n], tw = nt ? String(nt).length * 3.4 : 0, tq = nt ? add(tp, [d[0] * tw, 0]) : tp;
      tbox(tq[0], tq[1], nt || nm(n), nt ? 12.5 : 15.5);
      out.text.push(`<text x="${f(tq[0])}" y="${f(tq[1])}" class="gt ${nt && !/^[A-Z]/.test(nt) ? 'gco' : 'gpl'}" text-anchor="middle" dominant-baseline="central">${esc(nt || nm(n))}</text>`);
    });
    (S.txt || []).forEach(([x, y, t, cls]) => { const p = X([x, y]); tbox(p[0], p[1], t); out.text.push(`<text x="${f(p[0])}" y="${f(p[1])}" class="gt ${cl(cls) || 'gln'}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`); });
    const alt = (S.alt || 'A geometry figure') + (S.nts ? '. Not drawn to scale.' : '');
    if (S.nts && !S.cap) S.cap = 'Not drawn to scale.';
    /* grow the drawing to hold any text that reaches past its edge */
    let vx0 = 0, vy0 = 0, vx1 = W, vy1 = Hh;
    boxes.forEach((b) => { vx0 = Math.min(vx0, b[0] - 3); vy0 = Math.min(vy0, b[1] - 3); vx1 = Math.max(vx1, b[2] + 3); vy1 = Math.max(vy1, b[3] + 3); });
    const VW = Math.round(vx1 - vx0), VH = Math.round(vy1 - vy0);
    return `<figure class="geo-fig${S.cls ? ' ' + cl(S.cls) : ''}"><svg viewBox="${f(vx0)} ${f(vy0)} ${VW} ${VH}" width="${VW}" height="${VH}" style="max-width:100%;height:auto" role="img" aria-label="${esc(alt)}">${out.back.join('')}${out.fill.join('')}${out.line.join('')}${out.mark.join('')}${out.dot.join('')}${out.text.join('')}</svg>${S.cap ? `<figcaption>${esc(S.cap)}</figcaption>` : ''}</figure>`;
  }

  /* ---------- figures by key ---------- */
  const REG = {}, CACHE = {};
  function fig(key, arg) {
    const F = REG[key]; if (!F) return '';
    if (arg == null && CACHE[key] != null) return CACHE[key];
    let html = '';
    try { const S = typeof F === 'function' ? F(H, arg) : F; html = S ? svg(S) : ''; } catch (e) { html = ''; }
    if (arg == null) CACHE[key] = html;
    return html;
  }
  /* figures for generated questions: matched by the template's own text, drawn from its numbers */
  const QF = [];
  function qfig(p) {
    if (!p || !p.tq) return '';
    const q = QF.find((x) => x[0] === p.tq); if (!q) return '';
    try { const S = q[1](H, p.v || {}); return S ? svg(S) : ''; } catch (e) { return ''; }
  }
  WL.geo = { svg, h: H, fig, qfig, has: (k) => !!REG[k], add(o) { Object.assign(REG, o); }, addQ(list) { list.forEach((x) => QF.push(x)); }, keys: () => Object.keys(REG) };
  /* figure files may load before this one: they wait in WL.geoWait */
  (WL.geoWait || []).forEach((fn) => { try { fn(WL.geo); } catch (e) { /* a broken figure file must not stop the page */ } });
  WL.geoWait = { push: (fn) => fn(WL.geo) };
})();
/* Geodesic — figures for competition geometry: the three geometry lessons (puzzle, ideas, worked examples, problems)
   and the geometry questions in the mock papers. A problem's figure shows only what its statement says: the unknown is
   marked "?", and nothing the solution has to find or construct is drawn. Where an accurate figure would not fit
   the page, it is drawn schematically and says so. */
((window.WL = window.WL || {}).geoWait = window.WL.geoWait || []).push(function (G) {
  const q = 'q';   // the unknown, in the accent colour

  /* figures used more than once */
  const semicircle = (h, withO) => { const P = h.pol(1, 62); return { P: { A: [-1, 0], B: [1, 0], O: [0, 0], P }, circ: [{ c: 'O', r: 1 }], seg: 'AB APB' + (withO ? ' PO' : ''), dot: 'O' }; };
  const tangentsFrom = (h, deg, withRadii) => {
    const d = 1 / Math.sin((deg / 2) * Math.PI / 180), Pp = [-d, 0], [A, B] = h.tangents(Pp, [0, 0], 1), C = h.pol(1, 15);
    return { P: { P: Pp, A, B, C, O: [0, 0] }, circ: [{ c: 'O', r: 1 }], seg: 'PA PB CA CB' + (withRadii ? ' OA OB' : ''), dot: 'O', lab: { P: 'w' } };
  };
  const polyFrag = (h, n, inner) => {   // five consecutive vertices of a regular n-gon, the rest of it dashed
    const P = {}, step = 360 / n; for (let j = -3; j <= 3; j++) P['V' + (j + 3)] = h.pol(1, 270 + j * step);
    return { P, seg: 'V1V2V3V4V5', dash: 'V0V1 V5V6', ang: [['V2V3V4', inner, 1, 22]], hide: Object.keys(P).join(' '), size: 260 };
  };
  const medians = (h, names) => {
    const A = [1, 3.2], B = [0, 0], C = [4.4, 0.3], Ma = h.mid(B, C), Mb = h.mid(C, A), Mc = h.mid(A, B), Gc = h.cent(A, B, C);
    return { P: { A, B, C, Ma, Mb, Mc, G: Gc }, poly: [{ p: 'ABC' }], dash: 'AMa BMb CMc', dot: 'G', tick: { 1: 'BMa MaC', 2: 'CMb MbA', 3: 'AMc McB' }, hide: 'Ma Mb Mc' + (names ? '' : ' A B C'), lab: { G: 'se' } };
  };
  const lattice = (x, y, n = 1, labels) => ({ x, y, grid: 1, step: 1, every: n, labels });

  G.add({
    /* ---------------- Angles and circles ---------------- */
    'ge-angles:hook': (h) => Object.assign(semicircle(h), { ang: [['APB', '?', 1, 20, q]], alt: 'A circle with centre O and diameter AB. P is a point on the circle; the angle APB is marked with a question mark.' }),
    'ge-angles:hooka': (h) => Object.assign(semicircle(h, true), { ang: [['PAO', 'x', 1, 24], ['APO', 'x', 1, 30], ['OBP', 'y', 2, 24], ['OPB', 'y', 2, 22]], tick: { 1: 'OA OB OP' }, alt: 'The same circle with the radius OP drawn. Triangles AOP and BOP are isosceles: the angles at A and P marked x, the angles at B and P marked y.' }),
    'ge-angles:i1': () => ({ P: { A: [1.1, 2.2], B: [0, 0], C: [3, 0], D: [4.6, 0] }, poly: [{ p: 'ABC' }], seg: 'CD', ang: [['BAC', 'a', 1, 22], ['CBA', 'b', 2, 20], ['ACD', 'a + b', 1, 26]], alt: 'Triangle ABC with BC extended to D. The angles at A and B are a and b; the exterior angle ACD is a + b.' }),
    'ge-angles:i2': (h) => ({ P: { A: h.pol(1, 215), B: h.pol(1, 325), P: h.pol(1, 105), O: [0, 0] }, circ: [{ c: 'O', r: 1 }], seg: 'APB AOB', dot: 'O', ang: [['APB', 'θ', 1, 26], ['AOB', '2θ', 1, 18]], alt: 'A circle with centre O. The arc AB makes an angle θ at P on the circle and 2θ at the centre.' }),
    'ge-angles:i3': (h) => ({ P: { A: h.pol(1, 200), B: h.pol(1, 285), C: h.pol(1, 10), D: h.pol(1, 115) }, circ: [{ c: [0, 0], r: 1 }], poly: [{ p: 'ABCD' }], ang: [['DAB', 'α', 1, 22], ['BCD', '180° − α', 1, 22]], alt: 'A cyclic quadrilateral ABCD. The angle at A is α and the opposite angle at C is 180° − α.' }),
    'ge-angles:i4': (h) => ({ P: { A: [0, -1], B: h.pol(1, 25), C: h.pol(1, 150), L: [-1.55, -1], T: [1.65, -1] }, circ: [{ c: [0, 0], r: 1 }], seg: 'LT AB CA CB', hide: 'L', ang: [['TAB', 'θ', 1, 22], ['ACB', 'θ', 1, 24]], lab: { A: 's', T: 's' }, alt: 'A circle with a tangent TA at A and a chord AB. The angle between the tangent and the chord is θ, and so is the angle ACB at a point C in the other segment.' }),
    'ge-angles:ex1': (h) => ({ P: { A: h.pol(1, 250), B: h.pol(1, 295), C: h.pol(1, 80), D: h.pol(1, 205) }, circ: [{ c: [0, 0], r: 1 }], poly: [{ p: 'ABCD' }], ang: [['DAB', '3x', 1, 18], ['BCD', 'x', 1, 26]], alt: 'A cyclic quadrilateral ABCD with the angle at A marked 3x and the angle at C marked x.' }),
    'ge-angles:ex2': (h) => Object.assign(tangentsFrom(h, 50), { ang: [['APB', '50°', 1, 34], ['ACB', '?', 1, 26, q]], alt: 'Tangents from P touch the circle with centre O at A and B; the angle APB is 50°. C is on the major arc; the angle ACB is marked with a question mark.' }),
    'ge-angles-p1': (h) => Object.assign(polyFrag(h, 15, '156°'), { alt: 'Part of a regular polygon: five consecutive vertices with one interior angle of 156°; the rest of the polygon is dashed.' }),
    'ge-angles-p2': (h) => ({ P: { A: h.pol(1, 200), B: h.pol(1, 310), C: h.pol(1, 40), D: h.pol(1, 130) }, circ: [{ c: [0, 0], r: 1 }], poly: [{ p: 'ABCD' }], seg: 'BD', ang: [['ABD', '35°', 1, 30], ['DBC', '45°', 2, 22], ['ADC', '?', 1, 22, q]], alt: 'A, B, C and D on a circle in that order, with BD drawn. The angle ABD is 35° and DBC is 45°; the angle ADC is marked with a question mark.' }),
    'ge-angles-p3': (h) => { const A = h.pol(1, 90), B = h.pol(1, 260), C = h.pol(1, 0), T = h.inter(B, C, [-1, 1], [1, 1]);
      return { P: { A, B, C, T, L: [-1.35, 1], R: [h.add(T, [0.45, 0])[0], 1] }, circ: [{ c: [0, 0], r: 1 }], poly: [{ p: 'ABC' }], seg: 'LR CT', hide: 'L R', ang: [['BAC', '50°', 1, 24], ['CBA', '60°', 1, 22], ['ATB', '?', 1, 28, q]], lab: { T: 'ne', A: 'n' }, nts: 1, alt: 'Triangle ABC in its circumcircle, with angle A 50° and angle B 60°. The tangent at A meets the line BC extended at T; the angle ATB is marked with a question mark.' }; },
    'ge-angles-p4': (h) => { const A = [1.2, 3], B = [0, 0], C = [4, 0]; return { P: { A, B, C, E: h.foot(B, A, C), F: h.foot(C, A, B) }, poly: [{ p: 'ABC' }], seg: 'BE CF', rt: ['CEB', 'BFC'], alt: 'Triangle ABC with the altitudes BE and CF: E on AC and F on AB, with right angles at E and F.' }; },

    /* ---------------- Lengths, similar triangles and the power of a point ---------------- */
    'ge-lengths:hook': (h) => { const X = [0, 0], u = h.pol(1, 15), v = h.pol(1, 105), A = h.mul(u, 4), C = h.mul(u, -6), B = h.mul(v, 3), D = h.mul(v, -8);
      return { P: { A, B, C, D, X }, circ: [{ thru: 'ABC' }], seg: 'AC BD', dot: 'X', hide: 'A B C D X', len: [['XA', '4', -1], ['XC', '6', 1], ['XB', '3', 1], ['XD', '?', -1, q]], alt: 'Two chords of a circle crossing. One is cut into pieces 4 and 6; the other into 3 and an unknown piece marked with a question mark.' }; },
    'ge-lengths:i1': (h) => { const A = [1.2, 3], B = [0, 0], C = [4, 0]; return { P: { A, B, C, D: h.lerp(A, B, 0.45), E: h.lerp(A, C, 0.45) }, poly: [{ p: 'ABC' }], seg: 'DE', ang: [['ADE', '', 1, 16], ['ABC', '', 1, 16], ['DEA', '', 2, 16], ['BCA', '', 2, 16]], lab: { D: 'w', E: 'e' }, alt: 'Triangle ABC with DE parallel to BC. The angles at D and B are equal, and so are the angles at E and C: triangles ADE and ABC are similar.' }; },
    'ge-lengths:i2': () => { const s = 1.5, t = 1.1; return { P: { P1: [0, 0], Q1: [s, 0], R1: [0, s], P2: [2.3, 0], Q2: [2.3 + t, 0], R2: [2.3, t * Math.sqrt(3)] }, poly: [{ p: 'P1Q1R1' }, { p: 'P2Q2R2' }], rt: ['Q1P1R1', 'Q2P2R2'], hide: 'P1 Q1 R1 P2 Q2 R2',
      ang: [['R1Q1P1', '45°', 1, 22], ['P1R1Q1', '45°', 1, 22], ['R2Q2P2', '60°', 1, 18], ['P2R2Q2', '30°', 1, 26]], len: [['P1Q1', '1'], ['P1R1', '1'], ['Q1R1', '√2'], ['P2Q2', '1'], ['P2R2', '√3'], ['Q2R2', '2']], alt: 'The 45–45–90 triangle with sides 1, 1 and √2, and the 30–60–90 triangle with sides 1, √3 and 2.' }; },
    'ge-lengths:i3': (h) => { const K1 = [0, 0], P1 = [0.22, -0.18], d1 = h.pol(1, 20), d2 = h.pol(1, 115), [A1, B1] = h.lineCirc(h.add(P1, d1), h.sub(P1, d1), K1, 1), [C1, D1] = h.lineCirc(h.add(P1, d2), h.sub(P1, d2), K1, 1);
      const K2 = [3.3, 0], P2 = [5.6, 0.35], [A2, B2] = h.lineCirc(P2, [3.1, -0.45], K2, 1), T2 = h.tangents(P2, K2, 1)[0];
      return { P: { A1, B1, C1, D1, P1, A2, B2, P2, T2 }, circ: [{ c: K1, r: 1 }, { c: K2, r: 1 }], seg: 'A1B1 C1D1 P2B2 P2T2', dot: 'P1 P2', name: { A1: 'A', B1: 'B', C1: 'C', D1: 'D', P1: 'P', A2: 'A', B2: 'B', P2: 'P', T2: 'T' }, lab: { P1: 'e', A2: 'ne' },
        txt: [[0, -1.45, 'PA × PB = PC × PD'], [4.1, -1.45, 'PA × PB = PT²']], size: 400, alt: 'Left: two chords crossing at P inside a circle, PA × PB = PC × PD. Right: from P outside a circle, a line through A and B and a tangent PT, PA × PB = PT².' }; },
    'ge-lengths:i4': (h) => { const A = [1.5, 3], B = [0, 0], C = [5, 0], c = h.dist(A, B), b = h.dist(A, C); return { P: { A, B, C, D: h.lerp(B, C, c / (b + c)) }, poly: [{ p: 'ABC' }], seg: 'AD', ang: [['BAD', '', 1, 26], ['DAC', '', 1, 30]], alt: 'Triangle ABC with the bisector of angle A meeting BC at D; the two halves of angle A are marked equal. BD/DC = AB/AC.' }; },
    'ge-lengths:i5': (h) => { const A = [1.4, 3.2], B = [0, 0], C = [5, 0], I = h.inc(A, B, C); return { P: { A, B, C, I: I.c, M: h.foot(I.c, B, C) }, poly: [{ p: 'ABC' }], circ: [{ c: I.c, r: I.r }], dash: 'IM', dot: 'I', hide: 'M', rt: ['IMC'], ang: [['ACB', 'C', 1, 24]], len: [['BC', 'a', 1], ['CA', 'b'], ['IM', 'r', 1]], lab: { I: 'n' }, alt: 'Triangle ABC with its inscribed circle of radius r; sides a and b meet at the angle C.' }; },
    'ge-lengths:ex1': (h) => { const P = [-15, 0], phi = Math.acos(13 / 15), u = [Math.cos(phi), Math.sin(phi)], A = h.add(P, h.mul(u, 8)), B = h.add(P, h.mul(u, 18)), T = h.tangents(P, [0, 0], 9)[1][1] < 0 ? h.tangents(P, [0, 0], 9)[1] : h.tangents(P, [0, 0], 9)[0];
      return { P: { P, A, B, T }, circ: [{ c: [0, 0], r: 9 }], seg: 'PB PT', len: [['PT', '12', 1], ['PA', '8', -1], ['AB', '?', -1, q]], lab: { P: 'w' }, alt: 'From P outside a circle, a tangent PT of length 12 and a line meeting the circle at A and then B, with PA = 8; AB is marked with a question mark.' }; },
    'ge-lengths:ex2': (h) => { const t = h.tri(14, 15, 13); return { P: { A: t.A, B: t.B, C: t.C, H: [5, 0] }, poly: [{ p: 'ABC' }], dash: 'AH', rt: ['AHC'], hide: 'H', len: [['AB', '13'], ['AC', '15'], ['BC', '14', 1], ['AH', 'h', 1]], alt: 'Triangle ABC with sides 13, 14 and 15; the altitude h from A to the side of length 14 is dashed.' }; },
    'ge-lengths-p1': (h) => { const C = [0, 0], A = [0, 9], B = [12, 0], F = h.foot(C, A, B); return { P: { A, B, C, F }, poly: [{ p: 'ABC' }], dash: 'CF', rt: ['ACB', 'CFB'], hide: 'A B C F', len: [['CA', '9', 1], ['CB', '12', 1], ['CF', '?', -1, q]], alt: 'A right-angled triangle with legs 9 and 12; the altitude to the hypotenuse is dashed and marked with a question mark.' }; },
    'ge-lengths-p2': (h) => { const t = h.tri(15, 15, 10); return { P: { A: t.A, B: t.B, C: t.C, D: [6, 0] }, poly: [{ p: 'ABC' }], seg: 'AD', ang: [['BAD', '', 1, 28], ['DAC', '', 1, 32]], len: [['AB', '10'], ['AC', '15'], ['BD', '6', -1], ['BC', '?', 1, q]], alt: 'Triangle ABC with AB = 10 and AC = 15. The bisector of angle A meets BC at D with BD = 6; BC is marked with a question mark.' }; },
    'ge-lengths-p3': () => ({ P: { A: [0, 0], B: [8, 0], C: [8, 8], D: [0, 8], O: [4, 3], M: [4, 8] }, poly: [{ p: 'ABCD' }], circ: [{ c: 'O', r: 5 }], dash: 'OM', dot: 'O', hide: 'A B C D M', len: [['AB', '8', 1], ['OM', '?', 1, q]], lab: { O: 'w' }, alt: 'A square of side 8. A circle passes through its two bottom corners and touches the top side; the radius to the point of contact is marked with a question mark.' }),
    'ge-lengths-p4': (h) => { const A = h.pol(1, 160), C = h.pol(1, 325), B = h.pol(1, 65), D = h.pol(1, 245); return { P: { A, B, C, D, X: h.inter(A, C, B, D) }, circ: [{ c: [0, 0], r: 1 }], seg: 'AC BD', dot: 'X', lab: { X: 'e' }, alt: 'Two chords AC and BD of a circle meeting at X.' }; },

    /* ---------------- Trigonometry, coordinates and vectors ---------------- */
    'ge-trig:hook': (h) => { const t = h.sas(5, 8, 60); return { P: t, poly: [{ p: 'ABC' }], hide: 'A B C', ang: [['BAC', '60°', 1, 24]], len: [['AB', '8', 1], ['AC', '5'], ['BC', '?', 0, q]], alt: 'A triangle with sides 5 and 8 and an angle of 60° between them; the third side is marked with a question mark.' }; },
    'ge-trig:i1': (h) => { const A = h.pol(1, 100), B = h.pol(1, 215), C = h.pol(1, 330); return { P: { A, B, C, O: [0, 0] }, circ: [{ c: 'O', r: 1 }], poly: [{ p: 'ABC' }], dash: 'OC', dot: 'O', ang: [['CAB', '', 1, 18], ['ABC', '', 1, 18], ['BCA', '', 1, 18]], len: [['BC', 'a', 1], ['CA', 'b'], ['AB', 'c'], ['OC', 'R', -1]], lab: { O: 'w' }, alt: 'Triangle ABC in its circumcircle of radius R, with the sides a, b and c opposite the angles A, B and C.' }; },
    'ge-trig:i3': () => ({ P: { A: [1, 1], B: [5, 2], C: [2, 4] }, axes: lattice([0, 6], [0, 5]), poly: [{ p: 'ABC', fill: 1 }], dot: 'A B C', name: { A: '(x₁, y₁)', B: '(x₂, y₂)', C: '(x₃, y₃)' }, lab: { A: 's', B: 'e', C: 'n' }, alt: 'A triangle on a coordinate grid with vertices (x₁, y₁), (x₂, y₂) and (x₃, y₃), taken in order.' }),
    'ge-trig:i4': (h) => Object.assign(medians(h, 1), { alt: 'Triangle ABC with its three medians dashed, meeting at the centroid G; the midpoints of the sides are marked by equal ticks.' }),
    'ge-trig:i5': (h) => { const Z = [2.4, 1], W = h.rot(Z, 60); return { P: { O: [0, 0], Z, W }, axes: { x: [-0.6, 3.2], y: [-0.4, 3], names: ['Re', 'Im'], labels: 0 }, vec: 'OZ OW', ang: [['ZOW', 'θ', 1, 26]], name: { Z: 'z', W: 'z(cos θ + i sin θ)' }, lab: { W: 'w', O: 'sw', Z: 'e' }, hide: 'O', alt: 'In the complex plane, z and z(cos θ + i sin θ): the second is the first turned through θ about the origin.' }; },
    'ge-trig:ex1': () => ({ P: { A: [1, 2], B: [4, 6], C: [7, 1] }, axes: lattice([0, 8], [0, 7], 1, 0), poly: [{ p: 'ABC', fill: 1 }], dot: 'A B C', name: { A: '(1, 2)', B: '(4, 6)', C: '(7, 1)' }, lab: { A: 's', B: 'n', C: 'e' }, alt: 'The triangle with vertices (1, 2), (4, 6) and (7, 1) on a grid.' }),
    'ge-trig:ex2': (h) => { const t = h.tri(13, 7, 8); return { P: t, poly: [{ p: 'ABC' }], hide: 'A B C', ang: [['CAB', '?', 1, 18, q]], len: [['BC', '13', 1], ['CA', '7'], ['AB', '8']], alt: 'A triangle with sides 7, 8 and 13; the angle opposite the side 13 is marked with a question mark.' }; },
    'ge-trig-p1': (h) => { const t = h.tri(7, 5, 8); return { P: t, poly: [{ p: 'ABC' }], hide: 'A B C', ang: [['CAB', '?', 1, 22, q]], len: [['BC', '7', 1], ['CA', '5'], ['AB', '8']], alt: 'A triangle with sides 5, 7 and 8; the angle opposite the side 7 is marked with a question mark.' }; },
    'ge-trig-p2': () => ({ P: { A: [0, 0], B: [6, 0], C: [8, 5], D: [2, 7] }, axes: lattice([0, 9], [0, 8], 1, 0), poly: [{ p: 'ABCD', fill: 1 }], dot: 'A B C D', name: { A: '(0, 0)', B: '(6, 0)', C: '(8, 5)', D: '(2, 7)' }, lab: { A: 'sw', B: 's', C: 'e', D: 'n' }, alt: 'The quadrilateral with vertices (0, 0), (6, 0), (8, 5) and (2, 7) on a grid.' }),
    'ge-trig-p3': (h) => { const t = h.sas(8, 5, 60), o = h.circ3(t.A, t.B, t.C); return { P: { A: t.A, B: t.B, C: t.C, O: o.c }, circ: [{ c: 'O', r: o.r }], poly: [{ p: 'ABC' }], dash: 'OA', dot: 'O', ang: [['BAC', '60°', 1, 22]], len: [['AB', '5', 1], ['AC', '8'], ['OA', 'R', -1]], lab: { O: 'e' }, alt: 'Triangle ABC with AB = 5, AC = 8 and angle A = 60°, in its circumcircle of radius R.' }; },
    'ge-trig-p4': (h) => Object.assign(medians(h, 1), { alt: 'Triangle ABC with its three medians dashed, meeting at G.' }),

    /* ---------------- mock papers ---------------- */
    'smc:3': () => ({ P: { A: [0, 0], B: [4, 0], C: [4, 2], D: [0, 2] }, poly: [{ p: 'ABCD' }], hide: 'A B C D', len: [['AB', '2w', 1], ['BC', 'w', 1]], size: 220, alt: 'A rectangle whose length is twice its width w.' }),
    'smc:7': (h) => { const V = h.reg(10, 1), P = {}; V.forEach((v, i) => (P['V' + i] = v)); return { P, poly: [{ p: V.map((_, i) => 'V' + i) }], hi: 'V0V3', hide: Object.keys(P).join(' '), dot: Object.keys(P).join(' '), txt: [[0.05, 0.62, 'a diagonal', 'gln']], size: 230, alt: 'A regular decagon with one of its diagonals highlighted.' }; },
    'smc:8': (h) => { const P = { O: [0, 0], Hh: h.pol(0.42, 90 - 105), Mm: h.pol(0.6, -90) }, T = [], tx = [];
      for (let k = 0; k < 12; k++) { const a = 90 - 30 * k; P['a' + k] = h.pol(0.9, a); P['b' + k] = h.pol(1, a); T.push('a' + k + 'b' + k); if (k % 3 === 0) { const p = h.pol(0.76, a); tx.push([p[0], p[1], String(k || 12), 'gln']); } }
      return { P, circ: [{ c: 'O', r: 1 }], seg: T.join(' '), thick: 'OHh OMm', dot: 'O', hide: Object.keys(P).join(' '), ang: [['HhOMm', '?', 1, 20, q]], txt: tx, size: 220, alt: 'A clock face at 3:30: the minute hand points at 6 and the hour hand halfway between 3 and 4; the angle between the hands is marked with a question mark.' }; },
    'smc:13': () => ({ P: { A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] }, poly: [{ p: 'ABCD' }], seg: 'AC', hide: 'A B C D', len: [['AC', '10 cm', -1]], size: 200, alt: 'A square with a diagonal of 10 cm.' }),
    'smc:16': (h) => { const p = (x, y, z) => h.p3(x, y, z, 0.5), P = { A: p(0, 0, 0), B: p(1, 0, 0), C: p(1, 1, 0), D: p(0, 1, 0), E: p(0, 0, 1), F: p(1, 0, 1), Gg: p(1, 1, 1), Hh: p(0, 1, 1) };
      return { P, seg: 'ABCDA DHh HhGg GgC BF FGg', dash: 'AE EF EHh', hi: 'AGg', hide: Object.keys(P).join(' '), len: [['AGg', '?', -1, q]], size: 210, alt: 'A cube with the diagonal from one corner to the opposite corner highlighted and marked with a question mark.' }; },
    'smc:19': (h) => { const A = [5, 12], B = [0, 0], C = [10, 0], I = h.inc(A, B, C); return { P: { A, B, C, I: I.c, M: [5, 0] }, poly: [{ p: 'ABC' }], circ: [{ c: I.c, r: I.r }], dash: 'IM', dot: 'I', hide: 'I M', tick: { 1: 'AB AC' }, len: [['AB', '13'], ['AC', '13'], ['BC', '10', 1], ['IM', '?', -1, q]], alt: 'Triangle ABC with AB = AC = 13 and BC = 10, and its inscribed circle; the radius is marked with a question mark.' }; },
    'smc:21': () => ({ P: { A: [-1, -1], B: [1, -1], C: [1, 1], D: [-1, 1], E: [0, -1], F: [1, 0], Gg: [0, 1], Hh: [-1, 0] }, poly: [{ p: 'ABCD' }, { p: ['E', 'F', 'Gg', 'Hh'], fill: 1 }], circ: [{ c: [0, 0], r: 1 }], hide: 'A B C D E F Gg Hh', size: 210, alt: 'A square with the circle inside it touching all four sides, and a smaller square inside the circle with its corners on the circle; the small square is shaded.' }),
    'amc:7': (h) => { const A = [0, 0], B = [8, 0], C = [3, 6]; return { P: { A, B, C, L: h.mid(A, B), M: h.mid(B, C), N: h.mid(C, A) }, axes: lattice([0, 9], [0, 7], 1, 0), poly: [{ p: 'ABC' }, { p: 'LMN', fill: 1 }], dot: 'A B C L M N', hide: 'L M N', name: { A: '(0, 0)', B: '(8, 0)', C: '(3, 6)' }, lab: { A: 'sw', B: 's', C: 'n' }, alt: 'The triangle with vertices (0, 0), (8, 0) and (3, 6), and the shaded triangle whose vertices are the midpoints of its sides.' }; },
    'amc:11': () => ({ P: { A: [-1, 4], B: [5, 2] }, axes: lattice([-3, 7], [-2, 6]), dot: 'A B', name: { A: '(−1, 4)', B: '(5, 2)' }, lab: { A: 'n', B: 'n' }, cap: 'The centre of the circle is somewhere on the x-axis.', alt: 'The points (−1, 4) and (5, 2) on a grid. The circle through them has its centre on the x-axis.' }),
    'amc:16': (h) => { const A = [0, 0], B = [12, 0], C = [12, 5], D = [0, 5]; return { P: { A, B, C, D, E: h.foot(B, A, C) }, poly: [{ p: 'ABCD' }], seg: 'AC BE', hi: 'AE', rt: ['BEC'], len: [['AB', '12', 1], ['BC', '5', 1], ['AE', '?', -1, q]], lab: { E: 'n' }, alt: 'Rectangle ABCD with AB = 12 and BC = 5. The perpendicular from B meets the diagonal AC at E; AE is marked with a question mark.' }; },
    'amc:18': (h) => { const V = h.reg(8, 1, 90 + 22.5), P = {}; V.forEach((v, i) => (P['V' + i] = v)); return { P, poly: [{ p: V.map((_, i) => 'V' + i) }], dot: Object.keys(P).join(' '), hide: Object.keys(P).join(' '), size: 200, alt: 'A regular octagon with its eight vertices marked.' }; },
    'amc:20': () => ({ P: { A: [-1, -1], B: [1, -1], C: [1, 1], D: [-1, 1], O: [0, 0], R: [Math.SQRT1_2, Math.SQRT1_2] }, poly: [{ p: 'ABCD' }], circ: [{ c: 'O', r: 1, dash: 1 }], seg: 'OR', dot: 'O', hide: 'A B C D R', len: [['AB', '2', 1], ['OR', '1', 1]], lab: { O: 'sw' }, size: 210, alt: 'A square of side 2 with its centre O, and the dashed circle of radius 1 about O.' }),
    'aime:4': (h) => { const t = h.tri(14, 15, 13), I = h.inc(t.A, t.B, t.C); return { P: { A: t.A, B: t.B, C: t.C, P: [6, 0] }, poly: [{ p: 'ABC' }], circ: [{ c: I.c, r: I.r }], dot: 'P', len: [['AB', '13'], ['AC', '15'], ['BC', '14', 1]], lab: { P: 'sw' }, alt: 'Triangle ABC with AB = 13, BC = 14 and CA = 15, and its inscribed circle touching BC at P.' }; },
    'aime:8': () => ({ P: { A: [0, 0], B: [12, 0], K: [0, 4], M: [12, 9], L: [-6, 0], R: [19, 0] }, circ: [{ c: 'K', r: 4 }, { c: 'M', r: 9 }], seg: 'LR', hi: 'AB', dot: 'A B', hide: 'K M L R', len: [['AB', '?', 1, q]], txt: [[0, 4, 'radius 4'], [12, 9, 'radius 9']], lab: { A: 'sw', B: 'se' }, alt: 'Two circles of radii 4 and 9 touching each other, both touching a straight line, at A and B; AB is marked with a question mark.' }),
    'aime:11': (h) => { const t = h.tri(14, 15, 13), A = t.A, B = t.B, C = t.C, Hc = h.ortho(A, B, C); return { P: { A, B, C, H: Hc, D: h.foot(A, B, C), E: h.foot(B, C, A), F: h.foot(C, A, B) }, poly: [{ p: 'ABC' }], dash: 'HD BE CF', hi: 'AH', dot: 'H', hide: 'D E F', len: [['AB', '13'], ['AC', '15'], ['BC', '14', 1], ['AH', '?', -1, q]], lab: { H: 'e' }, alt: 'Triangle ABC with sides 13, 14 and 15, its altitudes dashed and meeting at the orthocentre H; AH is marked with a question mark.' }; },
    'aime:12': (h) => { const V = h.reg(14, 1), P = {}; V.forEach((v, i) => (P['V' + i] = v)); return { P, poly: [{ p: V.map((_, i) => 'V' + i) }], dot: Object.keys(P).join(' '), hide: Object.keys(P).join(' '), size: 210, alt: 'A regular 14-gon with its vertices marked.' }; },
    'bmo1:4': (h) => { const A = h.pol(1, 90), B = h.pol(1, 190), C = h.pol(1, 310), a = h.dist(B, C), b = h.dist(C, A), c = h.dist(A, B), E = h.lerp(A, C, c / (a + c)), F = h.lerp(A, B, b / (a + b));
      return { P: { A, B, C, E, F, I: h.inc(A, B, C).c }, poly: [{ p: 'ABC' }], seg: 'BE CF', ang: [['BAC', '60°', 1, 22], ['ABE', '', 1, 30], ['EBC', '', 1, 34], ['ACF', '', 2, 30], ['FCB', '', 2, 34]], lab: { I: 's' }, alt: 'Triangle ABC with angle A = 60°. The bisectors of the angles at B and C meet the opposite sides at E and F and meet each other at I.' }; },
    'bmo1:5': () => { const P = {}, S = []; for (let i = 0; i <= 5; i++) { P['h' + i] = [0, i]; P['k' + i] = [5, i]; P['v' + i] = [i, 0]; P['w' + i] = [i, 5]; S.push('h' + i + 'k' + i, 'v' + i + 'w' + i); }
      P.r0 = [0, 2]; P.r1 = [5, 2]; P.r2 = [5, 3]; P.r3 = [0, 3];
      return { P, seg: S.join(' '), poly: [{ p: 'r0r1r2r3', fill: 2 }], hide: Object.keys(P).join(' '), txt: [[6.4, 2.5, 'one move']], size: 210, alt: 'A 5 × 5 board; one row is shaded to show one move.' }; }
  });
});
/* Geodesic — figures for the maths notes, part 1: angle facts and polygons, circle theorems, trigonometry,
   the sine and cosine rules, and similarity. "<topic>:s<i>" goes with section i of the notes; "<topic>:q<i>"
   with practice problem i, drawn from the numbers in the problem's own text, so a variant with new numbers gets
   its own figure (and a figure that cannot be built from them is left out). Unknowns are marked "?". */
((window.WL = window.WL || {}).geoWait = window.WL.geoWait || []).push(function (G) {
  const q = 'q', D = Math.PI / 180;
  const N = (t) => (String(t || '').replace(/(\d)[,\u00a0\u2009\u202f ](\d{3})(?!\d)/g, '$1$2').match(/\d+(?:\.\d+)?/g) || []).map(Number);
  const ok = (...x) => x.every((v) => isFinite(v) && v > 0);
  const brg = (h, P, deg, d) => [P[0] + d * Math.sin(deg * D), P[1] + d * Math.cos(deg * D)];     // a bearing, clockwise from north
  /* a cuboid in an oblique view: w across, ht up, dp into the page; returns points and edges */
  const box = (h, w, ht, dp, k = 0.5) => { const p = (x, y, z) => h.p3(x, y, z, k), P = { A: p(0, 0, 0), B: p(w, 0, 0), C: p(w, ht, 0), Dd: p(0, ht, 0), E: p(0, 0, dp), F: p(w, 0, dp), Gg: p(w, ht, dp), Hh: p(0, ht, dp) };
    return { P, seg: 'ABCDdA DdHh HhGg GgC BF FGg', dash: 'AE EF EHh', hide: Object.keys(P).join(' ') }; };
  const exact = () => { const s = 1.5, t = 1.1; return { P: { P1: [0, 0], Q1: [s, 0], R1: [0, s], P2: [2.3, 0], Q2: [2.3 + t, 0], R2: [2.3, t * Math.sqrt(3)] }, poly: [{ p: 'P1Q1R1' }, { p: 'P2Q2R2' }], rt: ['Q1P1R1', 'Q2P2R2'], hide: 'P1 Q1 R1 P2 Q2 R2',
    ang: [['R1Q1P1', '45°', 1, 22], ['P1R1Q1', '45°', 1, 22], ['R2Q2P2', '60°', 1, 18], ['P2R2Q2', '30°', 1, 26]], len: [['P1Q1', '1'], ['P1R1', '1'], ['Q1R1', '√2'], ['P2Q2', '1'], ['P2R2', '√3'], ['Q2R2', '2']], alt: 'Half a square: a 45–45–90 triangle with sides 1, 1 and √2. Half an equilateral triangle: a 30–60–90 triangle with sides 1, √3 and 2.' }; };
  const unitCircle = (h) => { const P = h.pol(1, 50); return { P: { O: [0, 0], P, F: [P[0], 0], E: [1, 0] }, axes: { x: [-1.3, 1.4], y: [-1.3, 1.3], labels: 0 }, circ: [{ c: 'O', r: 1 }], seg: 'OP', dash: 'PF', dot: 'P', hide: 'O F E', name: { P: '(cos θ, sin θ)' }, lab: { P: 'ne' }, ang: [['EOP', 'θ', 1, 22]], len: [['OF', 'cos θ', 1], ['PF', 'sin θ', 1], ['OP', '1', -1]], alt: 'The unit circle: the point at angle θ has coordinates (cos θ, sin θ).' }; };
  const fragment = (h, ext, label) => { const P = {}; for (let j = -3; j <= 3; j++) P['V' + (j + 3)] = h.pol(1, 270 + j * ext); return { P, seg: 'V1V2V3V4V5', dash: 'V0V1 V5V6', ang: [['V2V3V4', label, 1, 22]], hide: Object.keys(P).join(' '), size: 260 }; };
  const sinGraph = (h, extra) => { const s = [], c = []; for (let x = 0; x <= 360; x += 2) { s.push([x / 90, Math.sin(x * D)]); c.push([x / 90, Math.cos(x * D)]); }
    return Object.assign({ P: {}, axes: { x: [0, 4.3], y: [-1.35, 1.35], xt: [[1, '90°'], [2, '180°'], [3, '270°'], [4, '360°']], yt: [[1, '1'], [-1, '−1']] }, curve: [{ pts: s, cls: 'gh' }], size: 330 }, extra || {}); };

  G.add({
    /* ---------------- angle facts, polygons, bearings ---------------- */
    'm-geometry:s0': () => { const T1 = [1, -0.6], T2 = [3.6, 2.2], d = [2.6, 2.8], X1 = [1 + d[0] * (0.6 / 2.8), 0], X2 = [1 + d[0] * (2.2 / 2.8), 1.6];
      return { P: { L1: [0, 0], R1: [5, 0], L2: [0, 1.6], R2: [5, 1.6], T1, T2, X1, X2 }, seg: 'L1R1 L2R2 T1T2', hide: 'L1 R1 L2 R2 T1 T2 X1 X2', ang: [['T1X2R2', 'a', 1, 16], ['T2X1L1', 'a', 1, 16], ['R1X1T2', '180° − a', 2, 22]], txt: [[5.35, 1.6, '›'], [5.35, 0, '›']], alt: 'Two parallel lines cut by a transversal. The angle a at the top crossing equals its alternate angle a at the bottom (the Z shape); the co-interior angle at the bottom is 180° − a (the C shape).' }; },
    'm-geometry:s1': () => ({ P: { A: [1.6, 2.2], B: [0, 0], C: [4, 0], L: [-0.6, 2.2], R: [4.4, 2.2] }, poly: [{ p: 'ABC' }], dash: 'LR', hide: 'L R', ang: [['CBA', 'α', 1, 22], ['ACB', 'β', 2, 20], ['BAC', 'γ', 1, 20], ['LAB', 'α', 1, 18], ['CAR', 'β', 2, 18]], alt: 'A triangle with a line through the top vertex parallel to the base. The angles there are α and β, alternate to the base angles, so α + β + γ make a straight line.' }),
    'm-geometry:s2': (h) => { const V = h.reg(5, 1, 90), P = {}; V.forEach((v, i) => (P['V' + i] = v)); const c = (a, b, d) => h.cent(V[a], V[b], V[d]);
      return { P, poly: [{ p: 'V0V1V2V3V4' }], dash: 'V0V2 V0V3', hide: Object.keys(P).join(' '), txt: [[...c(0, 1, 2), '1'], [...c(0, 2, 3), '2'], [...c(0, 3, 4), '3']], size: 220, alt: 'A pentagon split into 3 triangles by the diagonals from one vertex: its angles add up to 3 × 180°.' }; },
    'm-geometry:s3': () => { const r = 2.8, y = Math.sqrt(r * r - 4); return { P: { A: [0, 0], B: [4, 0], M: [2, 0], U: [2, y], W: [2, -y] }, seg: 'AB', dash: 'UW', dot: 'A B', hide: 'U W', arc: [{ c: 'A', r, a0: 30, a1: 58, dash: 1 }, { c: 'A', r, a0: -58, a1: -30, dash: 1 }, { c: 'B', r, a0: 122, a1: 150, dash: 1 }, { c: 'B', r, a0: 210, a1: 238, dash: 1 }], rt: ['BMU'], tick: { 1: 'AM MB' }, lab: { M: 'sw' }, alt: 'Constructing the perpendicular bisector of AB: arcs of equal radius from A and B cross above and below, and the line through the crossings meets AB at right angles at its midpoint M.' }; },
    'm-geometry:s4': (h) => { const A = [0, 0], B = brg(h, A, 70, 3); return { P: { A, B, N: [0, 2], Nb: [B[0], B[1] + 2] }, seg: 'AB', vec: 'AN BNb', hide: 'N Nb', ang: [['NAB', '070°', 1, 26], { p: 'NbBA', t: '250°', r: 20, dir: 'cw' }], txt: [[0, 2.25, 'N'], [B[0], B[1] + 2.25, 'N']], alt: 'The bearing of B from A is 070°, measured clockwise from north; the bearing of A from B is 250°, which is 180° more.' }; },
    'm-geometry:s5': (h) => { const V = h.reg(6, 1, 90), P = {}, D2 = []; V.forEach((v, i) => (P['V' + i] = v)); for (let k = 0; k < 6; k++) { P['a' + k] = h.pol(1.3, 90 + 30 * k); P['b' + k] = h.pol(1.3, 270 + 30 * k); D2.push('a' + k + 'b' + k); }
      return { P, poly: [{ p: 'V0V1V2V3V4V5', fill: 1 }], dash: D2.join(' '), hide: Object.keys(P).join(' '), size: 220, alt: 'A regular hexagon with its six lines of symmetry dashed.' }; },
    'm-geometry:q0': (h, t) => { const m = /(\d+)x and (\d+)x \+ (\d+)/.exec(t || ''); if (!m) return null;
      return { P: { L: [-2, 0], R: [2, 0], O: [0, 0], T: h.pol(2, 68) }, seg: 'LR OT', hide: 'L R O T', ang: [['ROT', `${m[1]}x`, 1, 26], ['TOL', `${m[2]}x + ${m[3]}°`, 1, 22]], nts: 1, alt: `Two angles on a straight line, ${m[1]}x and ${m[2]}x + ${m[3]}°.` }; },
    'm-geometry:q1': (h) => { const V = h.reg(8, 1, 90 + 22.5), P = {}; V.forEach((v, i) => (P['V' + i] = v)); P.E = h.add(V[5], h.mul(h.unit(h.sub(V[5], V[4])), 0.75));
      return { P, poly: [{ p: 'V0V1V2V3V4V5V6V7' }], dash: 'V5E', hide: Object.keys(P).join(' '), ang: [['EV5V6', '?', 1, 18, q], ['V6V7V0', '?', 2, 16, q]], size: 230, alt: 'A regular octagon with one side extended: the exterior angle and an interior angle are marked with question marks.' }; },
    'm-geometry:q2': (h, t) => { const b = N(t)[0]; if (!(b > 0 && b < 180)) return null; const A = [0, 0], B = brg(h, A, b, 3);
      return { P: { A, B, N: [0, 1.8], Nb: [B[0], B[1] + 1.8] }, seg: 'AB', vec: 'AN BNb', hide: 'N Nb', ang: [['NAB', String(b).padStart(3, '0') + '°', 1, 24], { p: 'NbBA', t: '?', r: 20, dir: 'cw', c: q }], txt: [[0, 2.05, 'N'], [B[0], B[1] + 2.05, 'N']], alt: `The bearing of B from A is ${b}°; the bearing of A from B is marked with a question mark.` }; },
    'm-geometry:q3': (h, t) => { const i = N(t)[0]; if (!(i > 60 && i < 178)) return null; return Object.assign(fragment(h, 180 - i, i + '°'), { alt: `Part of a regular polygon with one interior angle of ${i}° marked.` }); },
    'm-geometry:q4': (h, t) => { const [cbd, a] = N(t); if (!(cbd > a && cbd < 180)) return null; const A = [0, 0], B = [3, 0], C = h.inter(A, h.pol(1, a), B, h.add(B, h.pol(1, cbd)));
      return { P: { A, B, C, D: [4.6, 0] }, poly: [{ p: 'ABC' }], seg: 'BD', ang: [['BAC', a + '°', 1, 24], ['DBC', cbd + '°', 1, 20], ['ACB', '?', 1, 22, q]], alt: `Triangle ABC with AB extended to D: angle CBD is ${cbd}° and angle A is ${a}°; angle C is marked with a question mark.` }; },
    'm-geometry:q6': (h, t) => { const [d1, b1, d2, b2] = N(t); if (!ok(d1, d2)) return null; const S = [0, 0], P1 = brg(h, S, b1, d1), P2 = brg(h, P1, b2, d2);
      return { P: { S, P1, P2, N0: [0, 4], N1: [P1[0], P1[1] + 4] }, seg: 'SP1 P1P2', dash: 'SP2', vec: 'SN0 P1N1', hide: 'N0 N1 P1', name: { S: 'Start', P2: 'End' }, lab: { S: 'sw', P2: 'e' }, ang: [['N0SP1', String(b1).padStart(3, '0') + '°', 1, 30], ['N1P1P2', b2 + '°', 1, 22]], len: [['SP1', d1 + ' km'], ['P1P2', d2 + ' km'], ['SP2', '?', 0, q]], alt: `A ship sails ${d1} km on a bearing of ${b1}°, then ${d2} km on a bearing of ${b2}°; the straight line back to the start is marked with a question mark.` }; },
    'm-geometry:q7': (h) => { const V = [[0, 0], [3, -0.3], [4.2, 1.6], [2.2, 3], [-0.4, 1.8]], P = {}, E = [], A = []; V.forEach((v, i) => { P['V' + i] = v; const nx = V[(i + 1) % 5], e = h.add(nx, h.mul(h.unit(h.sub(nx, v)), 0.9)); P['E' + i] = e; E.push('V' + ((i + 1) % 5) + 'E' + i); A.push(['E' + i + 'V' + ((i + 1) % 5) + 'V' + ((i + 2) % 5), 'e' + '₁₂₃₄₅'[i], 1, 16]); });
      return { P, poly: [{ p: 'V0V1V2V3V4' }], dash: E.join(' '), hide: Object.keys(P).join(' '), ang: A, alt: 'A convex pentagon with each side extended: the five exterior angles e₁ to e₅ are marked.' }; },

    /* ---------------- circle theorems ---------------- */
    'm-circle-theorems:s0': (h) => ({ P: { A: h.pol(1, 215), B: h.pol(1, 325), P: h.pol(1, 100), O: [0, 0], Q: h.pol(1, 280) }, circ: [{ c: 'O', r: 1 }], seg: 'APB AOB', dash: 'PQ', dot: 'O', hide: 'Q', ang: [['APB', 'θ', 1, 26], ['AOB', '2θ', 1, 18]], lab: { O: 'w' }, alt: 'The arc AB makes the angle θ at P on the circle and 2θ at the centre O. The dashed line is PO extended, used in the proof.' }),
    'm-circle-theorems:s1': (h) => { const c2 = [2.7, 0], c3 = [5.4, 0], ad = (c, r, a) => h.pol(r, a, c);
      return { P: { A1: [-1, 0], B1: [1, 0], P1: h.pol(1, 118), A2: ad(c2, 1, 210), B2: ad(c2, 1, 330), P2: ad(c2, 1, 65), Q2: ad(c2, 1, 120), A3: ad(c3, 1, 200), B3: ad(c3, 1, 285), C3: ad(c3, 1, 10), D3: ad(c3, 1, 115) },
        circ: [{ c: [0, 0], r: 1 }, { c: c2, r: 1 }, { c: c3, r: 1 }], seg: 'A1B1 A1P1B1 A2P2B2 A2Q2B2', poly: [{ p: 'A3B3C3D3' }], hide: 'A1 B1 P1 A2 B2 P2 Q2 A3 B3 C3 D3', rt: ['A1P1B1'], ang: [['A2P2B2', '', 1, 18], ['A2Q2B2', '', 1, 18], ['D3A3B3', 'α', 1, 18], ['B3C3D3', '180° − α', 1, 18]],
        txt: [[0, -1.35, 'semicircle: 90°'], [2.7, -1.35, 'same segment: equal'], [5.4, -1.35, 'cyclic: add to 180°']], size: 440, alt: 'Three circles: the angle in a semicircle is a right angle; two angles standing on the same arc are equal; opposite angles of a cyclic quadrilateral are α and 180° − α.' }; },
    'm-circle-theorems:s2': (h) => { const A = h.pol(1, 200), B = h.pol(1, 340), M = h.mid(A, B), K = [3.2, 0], Pp = [5.7, 0], [T1, T2] = h.tangents(Pp, K, 1);
      return { P: { O: [0, 0], A, B, M, K, P: Pp, T1, T2 }, circ: [{ c: 'O', r: 1 }, { c: 'K', r: 1 }], seg: 'AB PT1 PT2', dash: 'OM KT1 KT2', dot: 'O K', hide: 'A B M K T1 T2', rt: ['OMB', 'KT1P', 'PT2K'], tick: { 1: 'AM MB', 2: 'PT1 PT2' }, lab: { O: 'n', P: 'e' }, size: 400, alt: 'Left: the perpendicular from the centre O to a chord bisects it. Right: the two tangents from P are equal, each at right angles to the radius.' }; },
    'm-circle-theorems:s3': (h) => ({ P: { A: [0, -1], B: h.pol(1, 25), C: h.pol(1, 150), L: [-1.55, -1], T: [1.65, -1] }, circ: [{ c: [0, 0], r: 1 }], seg: 'LT AB CA CB', hide: 'L', ang: [['TAB', 'θ', 1, 22], ['ACB', 'θ', 1, 24]], lab: { A: 's', T: 's' }, alt: 'The alternate segment theorem: the angle θ between the tangent at A and the chord AB equals the angle ACB in the other segment.' }),
    'm-circle-theorems:q0': (h, t) => { const c = N(t)[0]; if (!(c > 0 && c < 180)) return null;
      return { P: { A: h.pol(1, 270 - c / 2), B: h.pol(1, 270 + c / 2), P: h.pol(1, 95), O: [0, 0] }, circ: [{ c: 'O', r: 1 }], seg: 'APB AOB', dot: 'O', ang: [['AOB', c + '°', 1, 18], ['APB', '?', 1, 26, q]], lab: { O: 'n' }, alt: `The arc AB makes ${c}° at the centre O; the angle it makes at P on the major arc is marked with a question mark.` }; },
    'm-circle-theorems:q1': (h, t) => { const a = N(t)[0]; if (!(a > 0 && a < 180)) return null; const B = h.pol(1, 300), Dd = h.pol(1, 300 + 2 * a);
      return { P: { A: h.pol(1, 300 + a + 180), B, C: h.pol(1, 300 + a), D: Dd }, circ: [{ c: [0, 0], r: 1 }], poly: [{ p: 'ABCD' }], ang: [['DAB', a + '°', 1, 20], ['BCD', '?', 1, 20, q]], alt: `A cyclic quadrilateral with one angle ${a}°; the opposite angle is marked with a question mark.` }; },
    'm-circle-theorems:q2': (h, t) => { const [d, r] = N(t); if (!ok(d, r) || d <= r) return null; const O = [0, 0], Pp = [d, 0], T = h.tangents(Pp, O, r)[0];
      return { P: { O, P: Pp, T }, circ: [{ c: 'O', r }], seg: 'PT OT', dash: 'OP', dot: 'O', len: [['OP', d + ' cm', 1], ['OT', r + ' cm', -1], ['PT', '?', -1, q]], lab: { O: 'w' }, alt: `A tangent from P, ${d} cm from the centre O of a circle of radius ${r} cm, touches it at T; PT is marked with a question mark.` }; },
    'm-circle-theorems:q3': (h, t) => { const [c, r] = N(t); if (!ok(c, r) || c >= 2 * r) return null; const y = -Math.sqrt(r * r - c * c / 4), A = [-c / 2, y], B = [c / 2, y], M = [0, y];
      return { P: { O: [0, 0], A, B, M }, circ: [{ c: 'O', r }], seg: 'AB OA', dash: 'OM', dot: 'O', hide: 'A B M', rt: ['OMB'], len: [['AB', c + ' cm', 1], ['OA', r + ' cm', 0], ['OM', '?', 1, q]], lab: { O: 'n' }, alt: `A chord of ${c} cm in a circle of radius ${r} cm; its distance from the centre is marked with a question mark.` }; },
    'm-circle-theorems:q4': (h, t) => { const [d, ac] = N(t); if (!ok(d, ac) || ac >= d) return null; const r = d / 2, A = [-r, 0], c = ac / d, C = [-r + ac * c, ac * Math.sqrt(1 - c * c)];
      return { P: { A, B: [r, 0], C, O: [0, 0] }, circ: [{ c: 'O', r }], seg: 'AB', poly: [{ p: 'ABC' }], dot: 'O', len: [['AB', d + ' cm', 1], ['AC', ac + ' cm'], ['BC', '?', 0, q]], lab: { O: 'n' }, alt: `AB is a diameter of ${d} cm and C is on the circle with AC = ${ac} cm; BC is marked with a question mark.` }; },
    'm-circle-theorems:q5': (h, t) => { const a = N(t)[0]; if (!(a > 0 && a < 180)) return null; const A = [0, -1], u = h.pol(1, a), B = h.lineCirc(A, h.add(A, u), [0, 0], 1)[1];
      return { P: { A, B, C: h.pol(1, a > 90 ? 20 : 160), L: [-1.6, -1], T: [1.6, -1] }, circ: [{ c: [0, 0], r: 1 }], seg: 'LT AB CA CB', hide: 'L', ang: [['TAB', a + '°', 1, 22], ['ACB', '?', 1, 24, q]], lab: { A: 's', T: 's' }, alt: `The tangent at A makes ${a}° with the chord AB; the angle ACB in the alternate segment is marked with a question mark.` }; },
    'm-circle-theorems:q6': (h) => ({ P: { A: [-1, 0], B: [1, 0], O: [0, 0], P: h.pol(1, 62) }, circ: [{ c: 'O', r: 1 }], seg: 'AB APB', dot: 'O', ang: [['APB', '?', 1, 20, q]], alt: 'A circle with centre O and diameter AB, and a point P on the circle: prove that angle APB is a right angle.' }),
    'm-circle-theorems:q7': (h, t) => { const a = N(t)[0]; if (!(a > 0 && a < 180)) return null; const d = 1 / Math.sin(a / 2 * D), Pp = [-d, 0], [A, B] = h.tangents(Pp, [0, 0], 1);
      return { P: { P: Pp, A, B, C: h.pol(1, 15), O: [0, 0] }, circ: [{ c: 'O', r: 1 }], seg: 'PA PB CA CB OA OB', dot: 'O', ang: [['APB', a + '°', 1, 34], ['AOB', '?', 1, 16, q], ['ACB', '?', 2, 22, q]], lab: { P: 'w', O: 'w' }, alt: `Tangents from P touch the circle at A and B with angle APB = ${a}°; angles AOB and ACB are marked with question marks.` }; },
    'm-circle-theorems:q8': (h) => ({ P: { A: h.pol(1, 200), B: h.pol(1, 290), C: h.pol(1, 15), D: h.pol(1, 110), O: [0, 0] }, circ: [{ c: 'O', r: 1 }], poly: [{ p: 'ABCD' }], dash: 'OB OD', dot: 'O', ang: [['DAB', '', 1, 18], ['BCD', '', 2, 18]], lab: { O: 'e' }, alt: 'A cyclic quadrilateral ABCD with centre O; prove that the angles at A and C add up to 180°.' }),

    /* ---------------- trigonometry and Pythagoras ---------------- */
    'm-trig:s0': () => { const a = 1.2, b = 2, s = a + b; return { P: { O1: [0, 0], O2: [s, 0], O3: [s, s], O4: [0, s], Q1: [a, 0], Q2: [s, a], Q3: [b, s], Q4: [0, b] }, poly: [{ p: 'O1O2O3O4' }, { p: 'Q1Q2Q3Q4', fill: 1 }], hide: 'O1 O2 O3 O4 Q1 Q2 Q3 Q4',
      len: [['O1Q1', 'a', 1], ['Q1O2', 'b', 1], ['O2Q2', 'a', 1], ['Q2O3', 'b', 1], ['Q1Q2', 'c', -1]], txt: [[s / 2, s / 2, 'c²', 'gpl']], size: 230, alt: 'A square of side a + b holding four copies of a right-angled triangle with legs a and b; the tilted square left over has area c².' }; },
    'm-trig:s1': () => ({ P: { A: [0, 0], B: [4, 0], C: [4, 2.6] }, poly: [{ p: 'ABC' }], rt: ['ABC'], hide: 'A B C', ang: [['BAC', 'θ', 1, 30]], len: [['AC', 'hypotenuse', -1], ['BC', 'opposite', 1], ['AB', 'adjacent', 1]], alt: 'A right-angled triangle with the angle θ: the hypotenuse, the side opposite θ and the side adjacent to it.' }),
    'm-trig:s2': (h) => unitCircle(h),
    'm-trig:s3': () => exact(),
    'm-trig:s4': (h) => { const F = h.pol(3, 35); return { P: { O: [0, 0], F, X: [F[0], 0] }, vec: 'OF', dash: 'OX XF', hide: 'O F X', ang: [['XOF', 'θ', 1, 30]], len: [['OX', 'F cos θ', 1], ['XF', 'F sin θ', 1], ['OF', 'F', -1]], rt: ['OXF'], alt: 'A force F at angle θ to the horizontal, with its components F cos θ and F sin θ.' }; },
    'm-trig:q0': (h, t) => { const [a, b] = N(t); if (!ok(a, b)) return null; return { P: { A: [0, b], B: [a, 0], C: [0, 0] }, poly: [{ p: 'ABC' }], rt: ['ACB'], hide: 'A B C', len: [['CB', a + ' cm', 1], ['CA', b + ' cm', -1], ['AB', '?', 0, q]], alt: `A right-angled triangle with legs ${a} cm and ${b} cm; the hypotenuse is marked with a question mark.` }; },
    'm-trig:q1': (h, t) => { const [l, f] = N(t); if (!ok(l, f) || f >= l) return null; const ht = Math.sqrt(l * l - f * f);
      return { P: { W0: [0, 0], W1: [0, ht * 1.12], G0: [-0.12 * l, 0], G1: [f * 1.35, 0], F: [f, 0], T: [0, ht] }, seg: 'FT', thick: 'W0W1 G0G1', hide: 'W0 W1 G0 G1 F T', len: [['TF', l + ' m', -1], ['W0F', f + ' m', 1], ['W0T', '?', -1, q]], alt: `A ladder ${l} m long leans against a wall with its foot ${f} m out; the height it reaches is marked with a question mark.` }; },
    'm-trig:q2': (h, t) => { const [hyp, s] = N(t); if (!ok(hyp, s) || s >= 1) return null; const th = Math.asin(s), A = [0, 0], B = [hyp * Math.cos(th), 0], C = [B[0], hyp * s];
      return { P: { A, B, C }, poly: [{ p: 'ABC' }], rt: ['ABC'], hide: 'A B C', ang: [['BAC', 'θ', 1, 30]], len: [['AC', hyp + ' cm', -1], ['BC', '?', 1, q], ['AB', '?', 1, q]], alt: `A right-angled triangle with hypotenuse ${hyp} cm and sin θ = ${s}; the other two sides are marked with question marks.` }; },
    'm-trig:q3': (h, t) => { const [r, d] = N(t); if (!ok(r, d)) return null; return { P: { A: [0, 0], B: [5, 0], C: [5, 1.1] }, poly: [{ p: 'ABC' }], rt: ['ABC'], hide: 'A B C', ang: [['BAC', '?', 1, 44, q]], len: [['AB', d + ' m', 1], ['BC', r + ' m', 1]], nts: 1, alt: `A road rising ${r} m over a horizontal distance of ${d} m; its angle to the horizontal is marked with a question mark.` }; },
    'm-trig:q4': () => ({ P: { A: [1, Math.sqrt(3)], B: [0, 0], C: [2, 0], M: [1, 0] }, poly: [{ p: 'ABC' }], dash: 'AM', rt: ['AMC'], tick: { 1: 'BM MC', 2: 'AB AC' }, ang: [['CBA', '60°', 1, 22], ['BAM', '30°', 1, 30]], len: [['AB', '2'], ['BM', '1', 1]], lab: { M: 's' }, alt: 'An equilateral triangle of side 2 cut in half by its altitude AM: each half has sides 1 and 2, with angles 60° and 30°.' }),
    'm-trig:q5': (h, t) => { const [f, a] = N(t); if (!ok(f, a) || a >= 90) return null; const F = h.pol(3, a); return { P: { O: [0, 0], F, X: [F[0], 0] }, vec: 'OF', dash: 'OX XF', hide: 'O F X', rt: ['OXF'], ang: [['XOF', a + '°', 1, 30]], len: [['OF', f + ' N', -1], ['OX', '?', 1, q], ['XF', '?', 1, q]], alt: `A ${f} N force at ${a}° above the horizontal; its horizontal and vertical components are marked with question marks.` }; },
    'm-trig:q6': (h) => unitCircle(h),
    'm-trig:q7': (h, t) => { const n = N(t); if (n.length < 3 || !ok(...n.slice(0, 3))) return null; const [a, b, c] = n, s = 4 / Math.max(a, b, c), S = box(h, c * s, a * s, b * s);
      return Object.assign(S, { hi: 'AGg', len: [['AB', c + ' cm', 1], ['BC', a + ' cm', 1], ['BF', b + ' cm', 1], ['AGg', '?', -1, q]], alt: `A box ${a} × ${b} × ${c} cm with the longest diagonal marked with a question mark.` }); },

    /* ---------------- sine and cosine rules ---------------- */
    'm-trig-rules:s0': () => exact(),
    'm-trig-rules:s1': (h) => { const c = []; for (let x = 0; x <= 360; x += 2) c.push([x / 90, Math.cos(x * D)]); const g = sinGraph(h); g.curve.push({ pts: c, dash: 1 }); g.txt = [[1.05, 1.18, 'sin x'], [0.2, 1.18, 'cos x']]; g.alt = 'The graphs of sin x (solid) and cos x (dashed) from 0° to 360°.'; return g; },
    'm-trig-rules:s2': (h) => { const A = [0, 0], B = [5, 0], C = [1.7, 2.6], F = h.foot(C, A, B); return { P: { A, B, C, F }, poly: [{ p: 'ABC' }], dash: 'CF', rt: ['CFB'], hide: 'F', len: [['BC', 'a'], ['CA', 'b'], ['AB', 'c', 1], ['CF', 'h', -1]], alt: 'Triangle ABC with the perpendicular h from C to AB: h = b sin A = a sin B.' }; },
    'm-trig-rules:s3': (h) => { const C = [0, 0], B = [4, 0], A = h.pol(3, 55); return { P: { C, B, A }, axes: { x: [-0.4, 4.6], y: [-0.4, 3], labels: 0 }, poly: [{ p: 'ABC' }], ang: [['BCA', 'C', 1, 22]], name: { A: 'A (b cos C, b sin C)', B: 'B (a, 0)' }, lab: { A: 'n', B: 's', C: 'sw' }, len: [['CA', 'b', 0], ['CB', 'a', -1], ['AB', 'c', 0]], alt: 'C at the origin and B at (a, 0); A is at (b cos C, b sin C). The side c joins A and B.' }; },
    'm-trig-rules:s4': (h) => { const B = [0, 0], C = [5, 0], A = [2.7, 2.5], F = h.foot(A, B, C); return { P: { A, B, C, F }, poly: [{ p: 'ABC' }], dash: 'AF', rt: ['AFB'], hide: 'F', ang: [['ACB', 'C', 1, 20]], len: [['BC', 'a', 1], ['CA', 'b', 0], ['AF', 'b sin C', -1]], alt: 'The height onto side a is b sin C, so the area is ½ab sin C.' }; },
    'm-trig-rules:s5': (h) => { const S = box(h, 4, 2.2, 2.6); return Object.assign(S, { hi: 'AGg', dash: S.dash + ' AF', ang: [['FAGg', 'θ', 1, 26]], len: [['AGg', '√(a² + b² + c²)', 1]], alt: 'A cuboid with a space diagonal and its shadow on the base; the angle θ between them is the angle between the diagonal and the base.' }); },
    'm-trig-rules:q1': (h, t) => { const k = N(t)[0]; if (!(k > 0 && k < 1)) return null; const g = sinGraph(h); g.P = { L0: [0, -k], L1: [4.2, -k], X1: [(180 + Math.asin(k) / D) / 90, -k], X2: [(360 - Math.asin(k) / D) / 90, -k] }; g.dash = 'L0L1'; g.dot = 'X1 X2'; g.hide = 'L0 L1'; g.name = { X1: '?', X2: '?' }; g.lab = { X1: 's', X2: 's' }; g.txt = [[0.5, -k + 0.16, 'y = −' + k]]; g.alt = `The graph of sin x from 0° to 360° and the line y = −${k}; the two crossings are marked with question marks.`; return g; },
    'm-trig-rules:q2': (h, t) => { const [b, c, a] = N(t); if (!ok(a, b, c) || a >= 180) return null; const T = h.sas(b, c, a); return { P: T, poly: [{ p: 'ABC', fill: 1 }], hide: 'A B C', ang: [['BAC', a + '°', 1, 22]], len: [['AB', c + ' cm', 1], ['AC', b + ' cm', 0]], txt: [[...h.cent(T.A, T.B, T.C), '?', 'gln q']], alt: `A triangle with sides ${b} cm and ${c} cm and an angle of ${a}° between them; its area is marked with a question mark.` }; },
    'm-trig-rules:q3': (h, t) => { const [A, B, a] = N(t); if (!ok(A, B, a) || A + B >= 180) return null; const C = 180 - A - B, s = a / Math.sin(A * D), b = s * Math.sin(B * D), c = s * Math.sin(C * D), P = { A: [0, 0], B: [c, 0], C: h.pol(b, A) };
      return { P, poly: [{ p: 'ABC' }], ang: [['BAC', A + '°', 1, 22], ['CBA', B + '°', 1, 22]], len: [['BC', 'a = ' + a + ' cm'], ['AC', '?', 0, q]], alt: `Triangle ABC with A = ${A}°, B = ${B}° and a = ${a} cm; side b is marked with a question mark.` }; },
    'm-trig-rules:q4': (h, t) => { const [b, c, A] = N(t); if (!ok(b, c, A) || A >= 180) return null; return { P: h.sas(b, c, A), poly: [{ p: 'ABC' }], ang: [['BAC', A + '°', 1, 22]], len: [['AB', 'c = ' + c + ' cm', 1], ['AC', 'b = ' + b + ' cm', 0], ['BC', 'a = ?', 0, q]], alt: `Triangle ABC with b = ${b} cm, c = ${c} cm and A = ${A}°; side a is marked with a question mark.` }; },
    'm-trig-rules:q5': (h, t) => { const s = N(t).slice(0, 3).sort((x, y) => x - y); if (s.length < 3 || !ok(...s) || s[0] + s[1] <= s[2]) return null; const T = h.tri(s[2], s[1], s[0]);
      return { P: T, poly: [{ p: 'ABC' }], hide: 'A B C', ang: [['CAB', '?', 1, 20, q]], len: [['BC', s[2] + ' cm', 1], ['CA', s[1] + ' cm'], ['AB', s[0] + ' cm']], alt: `A triangle with sides ${s.join(', ')} cm; its largest angle is marked with a question mark.` }; },
    'm-trig-rules:q6': (h, t) => { const [a, b, A] = N(t); if (!ok(a, b, A)) return null; const C = h.pol(b, A), x0 = C[0], disc = a * a - C[1] * C[1]; if (disc <= 0 || x0 - Math.sqrt(disc) <= 0) return null; const B1 = [x0 - Math.sqrt(disc), 0], B2 = [x0 + Math.sqrt(disc), 0];
      return { P: { A: [0, 0], C, B1, B2, E: [B2[0] + 0.8, 0] }, seg: 'AE AC CB2', dash: 'CB1', hide: 'E', arc: [{ c: 'C', r: a, a0: 230, a1: 320, dash: 1 }], dot: 'B1 B2', name: { B1: 'B₁', B2: 'B₂' }, lab: { B1: 's', B2: 's' }, ang: [['B2AC', A + '°', 1, 22]], len: [['AC', 'b = ' + b + ' cm', 0], ['CB2', 'a = ' + a + ' cm', -1], ['CB1', a + ' cm', 1]], alt: `With A = ${A}°, b = ${b} cm and a = ${a} cm, the side a can reach the base line at two points, B₁ and B₂: two different triangles.` }; },
    'm-trig-rules:q7': (h, t) => { const [d1, b1, d2, b2] = N(t); if (!ok(d1, d2)) return null; const S = [0, 0], P1 = brg(h, S, b1, d1), P2 = brg(h, P1, b2, d2);
      return { P: { S, P1, P2, N0: [0, 7], N1: [P1[0], P1[1] + 7] }, seg: 'SP1 P1P2', dash: 'SP2', vec: 'SN0 P1N1', hide: 'N0 N1 P1', name: { S: 'Start', P2: 'End' }, lab: { S: 'sw', P2: 'e' }, ang: [['N0SP1', String(b1).padStart(3, '0') + '°', 1, 28], ['N1P1P2', b2 + '°', 1, 22]], len: [['SP1', d1 + ' km'], ['P1P2', d2 + ' km'], ['SP2', '?', 0, q]], alt: `A boat sails ${d1} km on a bearing of ${b1}°, then ${d2} km on a bearing of ${b2}°; its distance from the start is marked with a question mark.` }; },
    'm-trig-rules:q8': (h, t) => { const n = N(t); if (n.length < 3 || !ok(...n.slice(0, 3))) return null; const [a, b, c] = n, s = 4 / Math.max(a, b, c), S = box(h, a * s, c * s, b * s);
      return Object.assign(S, { hi: 'AGg', dash: S.dash + ' AF', ang: [['FAGg', '?', 1, 26, q]], len: [['AB', a + ' cm', 1], ['BF', b + ' cm', 1], ['BC', c + ' cm', 1], ['AGg', '?', -1, q]], alt: `A cuboid ${a} × ${b} × ${c} cm with a space diagonal and its shadow on the base; the diagonal and its angle with the base are marked with question marks.` }); },
    'm-trig-rules:q9': (h, t) => { const [e1, d, e2] = N(t); if (!ok(e1, d, e2) || e2 <= e1) return null; const x = d * Math.tan(e1 * D) / (Math.tan(e2 * D) - Math.tan(e1 * D)), H = x * Math.tan(e2 * D);
      return { P: { P: [-(x + d), 0], Q: [-x, 0], F: [0, 0], T: [0, H], E: [x * 0.25, 0] }, seg: 'PE PT QT', dash: 'FT', hide: 'F E', rt: ['TFQ'], ang: [['FPT', e1.toFixed(1) + '°', 1, 40], ['FQT', e2.toFixed(1) + '°', 1, 30]], len: [['PQ', d.toFixed(1) + ' km', 1], ['FT', '?', 1, q]], lab: { P: 's', Q: 's', T: 'n' }, alt: `The top T of a mountain seen at ${e1}° from P and at ${e2}° from Q, ${d} km nearer; the height is marked with a question mark.` }; },

    /* ---------------- similarity ---------------- */
    'm-similarity:s0': () => { const k = 1.6, a = [[0, 0], [2, 0], [0.6, 1.4]], b = a.map((p) => [3 + p[0] * k, p[1] * k]); return { P: { A1: a[0], B1: a[1], C1: a[2], A2: b[0], B2: b[1], C2: b[2] }, poly: [{ p: 'A1B1C1' }, { p: 'A2B2C2' }], hide: 'A1 B1 C1 A2 B2 C2',
      ang: [['B1A1C1', '', 1, 14], ['B2A2C2', '', 1, 14], ['C1B1A1', '', 2, 14], ['C2B2A2', '', 2, 14], ['A1C1B1', '', 3, 12], ['A2C2B2', '', 3, 12]], alt: 'Two similar triangles: matching angles are marked alike, and every side of the larger is 1.6 times the matching side of the smaller.' }; },
    'm-similarity:s1': (h) => { const A = [1.2, 3], B = [0, 0], C = [4, 0]; return { P: { A, B, C, D: h.lerp(A, B, 0.45), E: h.lerp(A, C, 0.45) }, poly: [{ p: 'ABC' }], seg: 'DE', ang: [['ADE', '', 1, 16], ['ABC', '', 1, 16], ['DEA', '', 2, 16], ['BCA', '', 2, 16]], lab: { D: 'w', E: 'e' }, alt: 'DE parallel to BC: triangle ADE is similar to triangle ABC.' }; },
    'm-similarity:s2': () => ({ P: { a: [0, 0], b: [1, 0], c: [1, 1], d: [0, 1], e: [1.8, 0], f: [3.8, 0], g: [3.8, 2], k: [1.8, 2], m: [2.8, 0], n: [2.8, 2], o: [1.8, 1], p: [3.8, 1] }, poly: [{ p: 'abcd', fill: 1 }, { p: 'efgk' }], dash: 'mn op', hide: 'a b c d e f g k m n o p', len: [['ab', '1', 1], ['ef', '2', 1]], txt: [[0.5, 0.5, '1'], [2.3, 0.5, '1'], [3.3, 0.5, '2'], [2.3, 1.5, '3'], [3.3, 1.5, '4']], alt: 'Doubling the sides of a square makes four copies of it: lengths × 2, area × 4.' }),
    'm-similarity:q0': (h, t) => { const [x, y, z, w] = N(t); if (!ok(x, y, z, w) || x + y <= z) return null; const k = w / x, T1 = h.tri(z, y, x), T2 = h.tri(z * k, y * k, x * k), off = z + 1.2;
      return { P: { A1: T1.A, B1: T1.B, C1: T1.C, A2: [T2.A[0] + off, T2.A[1]], B2: [T2.B[0] + off, 0], C2: [T2.C[0] + off, 0] }, poly: [{ p: 'A1B1C1' }, { p: 'A2B2C2' }], hide: 'A1 B1 C1 A2 B2 C2', len: [['A1B1', x + ''], ['A1C1', y + ''], ['B1C1', z + '', 1], ['A2B2', w + ''], ['A2C2', '?', 0, q], ['B2C2', '?', 1, q]], size: 340, alt: `A triangle with sides ${x}, ${y} and ${z} cm, and a similar one whose shortest side is ${w} cm; its other sides are marked with question marks.` }; },
    'm-similarity:q1': (h, t) => { const [h1, h2] = N(t); if (!ok(h1, h2)) return null; const k = h2 / h1, r1 = 0.32 * h1, r2 = r1 * k, x2 = r1 + r2 + 0.45 * h1;
      return { P: { a: [-r1, 0], b: [-r1, h1], c: [r1, 0], d: [r1, h1], e: [x2 - r2, 0], f: [x2 - r2, h2], g: [x2 + r2, 0], k: [x2 + r2, h2] }, seg: 'ab cd ef gk', ell: [{ c: [0, 0], rx: r1, ry: 0.3 * r1, back: 'dash' }, { c: [0, h1], rx: r1, ry: 0.3 * r1 }, { c: [x2, 0], rx: r2, ry: 0.3 * r2, back: 'dash' }, { c: [x2, h2], rx: r2, ry: 0.3 * r2 }], hide: 'a b c d e f g k', len: [['cd', h1 + ' cm', 1], ['gk', h2 + ' cm', 1]], alt: `Two similar cylinders of heights ${h1} cm and ${h2} cm.` }; },
    'm-similarity:q3': (h, t) => { const [ad, db, de] = N(t); if (!ok(ad, db, de)) return null; const A = [1.6, 4], B = [0, 0], C = [5, 0], r = ad / (ad + db);
      return { P: { A, B, C, D: h.lerp(A, B, r), E: h.lerp(A, C, r) }, poly: [{ p: 'ABC' }], seg: 'DE', lab: { D: 'w', E: 'e' }, len: [['AD', ad + ' cm'], ['DB', db + ' cm'], ['DE', de + ' cm', 1], ['BC', '?', 1, q]], alt: `Triangle ABC with DE parallel to BC, AD = ${ad} cm, DB = ${db} cm and DE = ${de} cm; BC is marked with a question mark.` }; },
    'm-similarity:q5': (h, t) => { const [p, s1, s2] = N(t); if (!ok(p, s1, s2)) return null; const tree = p * s2 / s1, m = 0.45 * s2 / s1, x0 = s1 * m + 2;
      return { P: { a: [0, 0], b: [0, p * m], c: [s1 * m, 0], d: [x0, 0], e: [x0, tree], f: [x0 + s2, 0] }, nts: 1, thick: 'ab de', seg: 'ac df', dash: 'bc ef', hide: 'a b c d e f', len: [['ab', p + ' m', -1], ['ac', s1 + ' m', 1], ['df', s2 + ' m', 1], ['de', '?', -1, q]], alt: `A person ${p} m tall with a shadow of ${s1} m, and a tree with a shadow of ${s2} m; the Sun's rays (dashed) are parallel; the tree's height is marked with a question mark.` }; },
    'm-similarity:q6': () => ({ P: { A: [2, 3.4], B: [0, 0], C: [4, 0] }, poly: [{ p: 'ABC' }], tick: { 1: 'AB AC' }, ang: [['CBA', '', 1, 24, q], ['ACB', '', 1, 24, q]], alt: 'An isosceles triangle with AB = AC: prove that the base angles at B and C are equal.' })
  });
});
/* Geodesic — figures for the maths notes, part 2: areas and volumes, coordinate geometry of lines and circles,
   radians, vectors and transformations. Keys and rules as in geofig-notes1.js. */
((window.WL = window.WL || {}).geoWait = window.WL.geoWait || []).push(function (G) {
  const q = 'q', D = Math.PI / 180;
  const N = (t) => (String(t || '').replace(/(\d)[,\u00a0\u2009\u202f ](\d{3})(?!\d)/g, '$1$2').match(/\d+(?:\.\d+)?/g) || []).map(Number);
  const ok = (...x) => x.every((v) => isFinite(v) && v > 0);
  const E = 0.3;   // how flat a circle looks when seen from a little above
  /* solids: a cylinder, a cone and a sphere standing at x = cx */
  const cyl = (cx, r, ht, tag = 'c') => ({ P: { [tag + 'a']: [cx - r, 0], [tag + 'b']: [cx - r, ht], [tag + 'd']: [cx + r, 0], [tag + 'e']: [cx + r, ht] }, seg: `${tag}a${tag}b ${tag}d${tag}e`, ell: [{ c: [cx, 0], rx: r, ry: E * r, back: 'dash' }, { c: [cx, ht], rx: r, ry: E * r }] });
  const cone = (cx, r, ht, tag = 'k') => ({ P: { [tag + 'a']: [cx - r, 0], [tag + 'd']: [cx + r, 0], [tag + 'v']: [cx, ht], [tag + 'o']: [cx, 0] }, seg: `${tag}a${tag}v ${tag}d${tag}v`, ell: [{ c: [cx, 0], rx: r, ry: E * r, back: 'dash' }] });
  const merge = (...S) => { const o = { P: {}, seg: '', dash: '', ell: [], hide: '' }; S.forEach((s) => { Object.assign(o.P, s.P); o.seg += ' ' + (s.seg || ''); o.dash += ' ' + (s.dash || ''); o.ell.push(...(s.ell || [])); o.hide += ' ' + Object.keys(s.P).join(' '); }); return o; };
  const box = (h, w, ht, dp, k = 0.5) => { const p = (x, y, z) => h.p3(x, y, z, k), P = { A: p(0, 0, 0), B: p(w, 0, 0), C: p(w, ht, 0), Dd: p(0, ht, 0), E: p(0, 0, dp), F: p(w, 0, dp), Gg: p(w, ht, dp), Hh: p(0, ht, dp) };
    return { P, seg: 'ABCDdA DdHh HhGg GgC BF FGg', dash: 'AE EF EHh', hide: Object.keys(P).join(' ') }; };
  const grid = (x, y, labels) => ({ x, y, grid: 1, step: 1, every: Math.max(1, Math.round((x[1] - x[0]) / 10)), labels });
  const arcPts = (h, c, r, a0, a1) => { const o = []; for (let t = a0; t <= a1 + 1e-9; t += (a1 - a0) / 40) o.push(h.pol(r, t, c)); return o; };

  G.add({
    /* ---------------- areas and volumes ---------------- */
    'm-mensuration:s0': () => ({ P: { A: [0, 0], B: [5, 0], C: [3.8, 2.2], D: [1.2, 2.2], F: [1.2, 0] }, poly: [{ p: 'ABCD', fill: 1 }], dash: 'DF', rt: ['DFB'], hide: 'A B C D F', len: [['DC', 'a', -1], ['AB', 'b', 1], ['DF', 'h', 1]], alt: 'A trapezium with parallel sides a and b and height h: area ½(a + b)h.' }),
    'm-mensuration:s1': (h) => ({ P: { O: [0, 0], A: h.pol(2, 20), B: h.pol(2, 95) }, sector: [{ c: 'O', r: 2, a0: 20, a1: 95 }], arc: [{ c: 'O', r: 2, a0: 20, a1: 95, hi: 1 }], dot: 'O', hide: 'A B', ang: [['AOB', 'θ', 1, 22]], len: [['OA', 'r', 1]], txt: [[...h.pol(2.3, 57.5), 's']], lab: { O: 'sw' }, alt: 'A sector of radius r and angle θ; its arc s is highlighted.' }),
    'm-mensuration:s2': () => { const r = 0.6, ht = 2.2, x0 = 1.4, w = 2 * Math.PI * r, S = merge(cyl(0, r, ht));
      return Object.assign(S, { P: Object.assign(S.P, { o: [0, ht], m: [r, ht], R1: [x0, 0], R2: [x0 + w, 0], R3: [x0 + w, ht], R4: [x0, ht] }), dash: S.dash + ' om', poly: [{ p: ['R1', 'R2', 'R3', 'R4'], fill: 1 }], circ: [{ c: [x0 + w / 2, ht + r + 0.1], r }, { c: [x0 + w / 2, -r - 0.1], r }], hide: S.hide + ' o m R1 R2 R3 R4', len: [['om', 'r', -1], ['R1R2', '2πr', 1], ['R2R3', 'h', 1]], alt: 'A cylinder of radius r and height h, and its net: the curved side unrolls into a rectangle 2πr by h, with two circles for the ends.' }); },
    'm-mensuration:s3': () => { const S = merge(cone(0, 1, 2.2));
      return Object.assign(S, { P: Object.assign(S.P, { so: [3.2, 1], sr: [4.2, 1] }), dash: S.dash + ' kvko sosr', circ: [{ c: [3.2, 1], r: 1 }], ell: S.ell.concat([{ c: [3.2, 1], rx: 1, ry: E, back: 'dash' }]), seg: S.seg, rt: ['kvkokd'], hide: S.hide + ' so sr', len: [['kvko', 'h', -1], ['kdkv', 'l', 1], ['sosr', 'r', -1]], alt: 'A cone with base radius r, height h and slant height l, and a sphere of radius r.' }); },
    'm-mensuration:q0': (h, t) => { const [a, b, ht] = N(t); if (!ok(a, b, ht)) return null; const off = (b - a) / 2;
      return { P: { A: [0, 0], B: [b, 0], C: [off + a, ht], D: [off, ht], F: [off, 0] }, poly: [{ p: 'ABCD', fill: 1 }], dash: 'DF', rt: ['DFB'], hide: 'A B C D F', len: [['DC', a + ' cm', -1], ['AB', b + ' cm', 1], ['DF', ht + ' cm', 1]], txt: [[b / 2, ht / 2, '?', 'gln q']], alt: `A trapezium with parallel sides ${a} cm and ${b} cm and height ${ht} cm; its area is marked with a question mark.` }; },
    'm-mensuration:q1': (h, t) => { const [r, a] = N(t); if (!ok(r, a) || a >= 360) return null; const a0 = 90 - a / 2, a1 = 90 + a / 2;
      return { P: { O: [0, 0], A: h.pol(r, a0), B: h.pol(r, a1) }, sector: [{ c: 'O', r, a0, a1 }], arc: [{ c: 'O', r, a0, a1, hi: 1 }], dot: 'O', hide: 'A B', ang: [['AOB', a + '°', 1, 20]], len: [['OA', r + ' cm', -1]], txt: [[...h.pol(r * 1.12, 90), '?', 'gln q']], alt: `A sector of radius ${r} cm and angle ${a}°; its arc length and area are asked for.` }; },
    'm-mensuration:q2': (h, t) => { const [r, ht] = N(t); if (!ok(r, ht)) return null; const s = 2.4 / Math.max(r, ht), S = merge(cyl(0, r * s, ht * s));
      return Object.assign(S, { P: Object.assign(S.P, { o: [0, ht * s], m: [r * s, ht * s] }), dash: S.dash + ' om', hide: S.hide + ' o m', len: [['om', r + ' cm', -1], ['cdce', ht + ' cm', 1]], alt: `A closed cylinder of radius ${r} cm and height ${ht} cm.` }); },
    'm-mensuration:q3': (h, t) => { const [r, ht] = N(t); if (!ok(r, ht)) return null; const s = 2.4 / Math.max(r, ht), S = merge(cone(0, r * s, ht * s));
      return Object.assign(S, { dash: S.dash + ' kvko kokd', rt: ['kvkokd'], len: [['kvko', ht + ' cm', -1], ['kokd', r + ' cm', 1], ['kdkv', '?', 1, q]], alt: `A cone with base radius ${r} cm and height ${ht} cm; the slant height is marked with a question mark.` }); },
    'm-mensuration:q5': (h, t) => { const [l, w, d] = N(t); if (!ok(l, w, d)) return null; const L = l * 100, s = 4 / Math.max(L, w, d); return Object.assign(box(h, L * s, d * s, w * s), { len: [['AB', l + ' m', 1], ['BC', d + ' cm', 1], ['BF', w + ' cm', 1]], alt: `A tank ${l} m by ${w} cm by ${d} cm.` }); },
    'm-mensuration:q6': (h, t) => { const [L, W] = N(t); if (!ok(L, W)) return null; const r = W / 2;
      return { P: { A: [0, 0], B: [L, 0], C: [L, W], Dd: [0, W] }, seg: 'AB CDd', dash: 'BC DdA', arc: [{ c: [L, r], r, a0: -90, a1: 90 }, { c: [0, r], r, a0: 90, a1: 270 }], hide: 'A B C Dd', len: [['AB', L + ' m', 1], ['BC', W + ' m', -1]], alt: `A running track: a ${L} m by ${W} m rectangle with a semicircle on each ${W} m side.` }; },
    'm-mensuration:q7': (h, t) => { const [r, ht] = N(t); if (!ok(r, ht)) return null; const s = 2.6 / Math.max(r, ht), R = r * s, H = ht * s, S = merge(cone(0, R, H));
      return Object.assign(S, { P: Object.assign(S.P, { ua: [-R / 2, H / 2], ud: [R / 2, H / 2] }), seg: 'kaua kdud', dash: 'uakv udkv kvko', ell: S.ell.concat([{ c: [0, H / 2], rx: R / 2, ry: E * R / 2 }]), hide: S.hide + ' ua ud', len: [['kokd', r + ' cm', 1], ['kvko', ht + ' cm', -1]], alt: `A cone of radius ${r} cm and height ${ht} cm cut parallel to its base halfway up; the top (dashed) is removed, leaving a frustum.` }); },
    'm-mensuration:q8': () => { const S = merge(cyl(0, 1, 2)); return Object.assign(S, { circ: [{ c: [0, 1], r: 1 }], ell: S.ell.concat([{ c: [0, 1], rx: 1, ry: E, back: 'dash' }]), alt: 'A sphere inside the smallest cylinder that contains it: the cylinder has the same radius, and height equal to the diameter.' }); },

    /* ---------------- lines and circles in coordinates ---------------- */
    'm-circles:s0': () => ({ P: { A: [1, 1], B: [4, 3], C: [4, 1], L: [-0.3, 1 - 1.3 * 2 / 3], R: [5.2, 3 + 1.2 * 2 / 3] }, axes: grid([-0.5, 5.5], [-0.5, 4.5], 0), seg: 'LR', dash: 'AC CB', dot: 'A B', hide: 'C L R', name: { A: '(x₁, y₁)', B: '(x₂, y₂)' }, lab: { A: 'nw', B: 'nw' }, len: [['AC', 'Δx', 1], ['CB', 'Δy', 1]], txt: [[2.4, 3.6, 'm = Δy / Δx']], alt: 'A straight line through two points, with the run Δx and the rise Δy dashed: the gradient is m = Δy/Δx.' }),
    'm-circles:s1': (h) => { const C = [2, 1.6], P = h.pol(1.5, 40, C); return { P: { C, P }, axes: grid([-0.5, 4.2], [-0.4, 3.6], 0), circ: [{ c: 'C', r: 1.5 }], dash: 'CP', dot: 'C P', name: { C: '(a, b)', P: '(x, y)' }, lab: { C: 'sw', P: 'ne' }, len: [['CP', 'r', -1]], alt: 'A circle with centre (a, b) and radius r; a point (x, y) on it.' }; },
    'm-circles:s2': (h) => { const O = [0, 0], P = h.pol(2, 40), u = h.unit(h.rot(P, 90)), A = h.pol(2, 160), B = h.pol(2, 250), M = h.mid(A, B), far = h.add(O, h.mul(h.unit(h.sub(O, M)), 2.4));
      return { P: { O, P, T1: h.add(P, h.mul(u, 1.6)), T2: h.sub(P, h.mul(u, 1.6)), A, B, M, Z: far }, circ: [{ c: 'O', r: 2 }], seg: 'T1T2 OP AB', dash: 'MZ', dot: 'O', hide: 'T1 T2 A B Z', rt: ['OPT1', 'OMB'], tick: { 1: 'AM MB' }, lab: { O: 'sw', M: 'w' }, alt: 'The tangent at P is perpendicular to the radius OP; the perpendicular bisector of the chord AB passes through the centre O.' }; },
    'm-circles:s3': () => { const r = 1.5, m = 0.5, ct = r * Math.sqrt(1 + m * m), L = (c, k) => ({ ['a' + k]: [-2.6, m * -2.6 + c], ['b' + k]: [2.6, m * 2.6 + c] });
      return { P: Object.assign({}, L(0, 1), L(ct, 2), L(2.7, 3)), circ: [{ c: [0, 0], r }], seg: 'a1b1 a2b2 a3b3', hide: 'a1 b1 a2 b2 a3 b3', txt: [[3.2, 1.3, 'two points'], [3.2, 2.98, 'tangent'], [3.2, 4.0, 'misses']], alt: 'Three parallel lines and a circle: one cuts it at two points, one touches it (a tangent) and one misses it.' }; },
    'm-circles:s4': () => { const a = 2.2, b = 1.6, e = Math.sqrt(1 - (b * b) / (a * a)); return { P: { O: [0, 0], S: [a * e, 0], V: [a, 0], W: [0, b] }, ell: [{ c: [0, 0], rx: a, ry: b }], dash: 'OV OW', dot: 'O S', hide: 'V W', name: { S: 'Sun' }, lab: { S: 's', O: 's' }, len: [['OV', 'a', -1], ['OW', 'b', -1]], alt: 'An ellipse with semi-major axis a and semi-minor axis b; the Sun is at a focus, a distance ae from the centre.' }; },
    'm-circles:q0': (h, t) => { const m = /\((−?-?\d+),\s*(−?-?\d+)\)\s*and\s*\((−?-?\d+),\s*(−?-?\d+)\)/.exec(String(t).replace(/−/g, '-')); if (!m) return null; const [x1, y1, x2, y2] = m.slice(1).map(Number); const A = [x1, y1], B = [x2, y2], d = h.sub(B, A);
      const xs = [x1, x2, 0], ys = [y1, y2, 0];
      return { P: { A, B, L: h.sub(A, h.mul(d, 0.25)), R: h.add(B, h.mul(d, 0.25)) }, axes: grid([Math.min(...xs) - 1, Math.max(...xs) + 2], [Math.min(...ys) - 2, Math.max(...ys) + 2]), seg: 'LR', dot: 'A B', hide: 'L R', name: { A: `(${x1}, ${y1})`.replace(/-/g, '−'), B: `(${x2}, ${y2})`.replace(/-/g, '−') }, lab: { A: 'e', B: 'e' }, alt: `The line through (${x1}, ${y1}) and (${x2}, ${y2}).` }; },
    'm-circles:q2': () => ({ P: { A: [-0.3, -1.9], B: [2.2, 5.6], P: [3, 4] }, axes: grid([-1, 6], [-2, 6]), seg: 'AB', dot: 'P', hide: 'A B', name: { P: '(3, 4)' }, lab: { P: 'e' }, txt: [[2.5, 6.1, 'y = 3x − 1']], alt: 'The line y = 3x − 1 and the point (3, 4).' }),
    'm-circles:q3': () => ({ P: { A: [-1, 2], B: [5, 10] }, axes: grid([-4, 8], [0, 12]), dash: 'AB', circ: [{ c: [2, 6], r: 5 }], dot: 'A B', name: { A: '(−1, 2)', B: '(5, 10)' }, lab: { A: 'w', B: 'e' }, alt: 'The circle whose diameter runs from (−1, 2) to (5, 10).' }),
    'm-circles:q4': () => ({ P: { O: [0, 0], P: [3, 4] }, axes: grid([-6, 6], [-6, 6]), circ: [{ c: 'O', r: 5 }], dash: 'OP', dot: 'P', hide: 'O', name: { P: '(3, 4)' }, lab: { P: 'ne' }, txt: [[-3.3, 5.3, 'x² + y² = 25']], alt: 'The circle x² + y² = 25 and the point (3, 4) on it.' }),
    'm-circles:q5': () => ({ P: { A: [-4.6, -3.6], B: [3.6, 4.6] }, axes: grid([-5, 5], [-5, 5]), circ: [{ c: [0, 0], r: Math.sqrt(13) }], seg: 'AB', hide: 'A B', txt: [[3.4, 3.4, 'y = x + 1', 'gln'], [-2.4, 4.3, 'x² + y² = 13']], alt: 'The line y = x + 1 and the circle x² + y² = 13; where they meet is asked for.' }),
    'm-circles:q6': () => { const P = {}, S = []; [-5, -1, 3, 6].forEach((c, i) => { const x0 = Math.max(-3.8, (-3.8 - c) / 2), x1 = Math.min(3.8, (3.8 - c) / 2); P['a' + i] = [x0, 2 * x0 + c]; P['b' + i] = [x1, 2 * x1 + c]; S.push('a' + i + 'b' + i); });
      return { P, axes: grid([-4, 4], [-4, 4]), circ: [{ c: [0, 0], r: Math.sqrt(5) }], dash: S.join(' '), hide: Object.keys(P).join(' '), txt: [[2.6, -3.4, 'y = 2x + c']], alt: 'The circle x² + y² = 5 and several lines of gradient 2: which of them are tangents?' }; },
    'm-circles:q7': (h) => { const L1 = [-1, 6], L2 = [7, 0], P = [1, 2], F = h.foot(P, L1, L2); return { P: { L1, L2, P, F }, axes: grid([-1.5, 7.5], [-0.5, 6.5]), seg: 'L1L2', dash: 'PF', rt: ['PFL2'], dot: 'P', hide: 'L1 L2 F', name: { P: '(1, 2)' }, lab: { P: 'sw' }, len: [['PF', '?', 1, q]], txt: [[6.0, 3.3, '3x + 4y − 21 = 0']], alt: 'The point (1, 2) and the line 3x + 4y − 21 = 0; the perpendicular distance between them is marked with a question mark.' }; },
    'm-circles:q8': () => ({ P: { A: [0, 0], B: [4, 0], C: [0, 6] }, axes: grid([-1.5, 5.5], [-1, 7], 0), dot: 'A B C', name: { A: '(0, 0)', B: '(4, 0)', C: '(0, 6)' }, lab: { A: 'sw', B: 's', C: 'e' }, alt: 'The three points (0, 0), (4, 0) and (0, 6), through which the circle passes.' }),

    /* ---------------- radians ---------------- */
    'm-radians:s0': (h) => ({ P: { O: [0, 0], A: h.pol(1.6, 0), B: h.pol(1.6, 180 / Math.PI) }, circ: [{ c: 'O', r: 1.6, dash: 1 }], seg: 'OA OB', arc: [{ c: 'O', r: 1.6, a0: 0, a1: 180 / Math.PI, hi: 1 }], dot: 'O', hide: 'A B', ang: [['AOB', '1 rad', 1, 24]], len: [['OA', 'r', 1], ['OB', 'r', 0]], txt: [[...h.pol(1.85, 28.6), 'r']], alt: 'One radian: the angle at the centre when the arc is as long as the radius r.' }),
    'm-radians:s1': (h) => { const A = h.pol(2, 30), B = h.pol(2, 130); return { P: { O: [0, 0], A, B }, curve: [{ pts: arcPts(h, [0, 0], 2, 30, 130), fill: 2, close: 1, nostroke: 1 }], arc: [{ c: [0, 0], r: 2, a0: 30, a1: 130 }], seg: 'OA OB AB', dot: 'O', hide: 'A B', ang: [['AOB', 'θ', 1, 22]], len: [['OA', 'r', 1]], txt: [[0, 1.82, 'segment']], alt: 'A sector of angle θ split by the chord AB into a triangle and a segment (shaded): the segment is the sector minus the triangle.' }; },
    'm-radians:s2': () => ({ P: { O: [0, 0], T1: [6, 0.5], T2: [6, -0.5], M: [6, 0] }, seg: 'OT1 OT2', thick: 'T1T2', dash: 'OM', dot: 'O', hide: 'T1 T2 M O', ang: [['T2OT1', 'θ', 1, 60]], len: [['OM', 'D', 1], ['T1T2', 'd', -1]], nts: 1, alt: 'An object of size d at distance D subtends a small angle θ ≈ d/D.' }),
    'm-radians:s3': (h) => { const a = 40, P = h.pol(1, a), T = [1, Math.tan(a * D)], F = [P[0], 0]; return { P: { O: [0, 0], A: [1, 0], P, T, F }, arc: [{ c: [0, 0], r: 1, a0: 0, a1: 90 }], seg: 'OA OT AT', dash: 'PF', hide: 'F', dot: 'P', ang: [['AOP', 'h', 1, 22]], len: [['PF', 'sin h', -1], ['AT', 'tan h', 1]], lab: { O: 'sw', A: 's' }, alt: 'In a circle of radius 1: the triangle OAP has area ½ sin h, the sector OAP has area ½h and the triangle OAT has area ½ tan h, so sin h < h < tan h.' }; },
    'm-radians:s4': (h) => { const P = h.pol(1.6, 35), v = h.add(P, h.mul(h.unit(h.rot(P, 90)), 1.3)); return { P: { O: [0, 0], P, V: v }, circ: [{ c: 'O', r: 1.6, dash: 1 }], seg: 'OP', vec: 'PV', dot: 'O P', hide: 'V', len: [['OP', 'r', 1], ['PV', 'v = rω', 1]], txt: [[0.55, 0.28, 'ω']], lab: { O: 'sw' }, alt: 'A point P moving round a circle of radius r with angular velocity ω has speed v = rω along the tangent.' }; },
    'm-radians:q1': (h, t) => { const [r, th] = N(t); if (!ok(r, th) || th >= 2 * Math.PI) return null; const a = th / D, a0 = 90 - a / 2;
      return { P: { O: [0, 0], A: h.pol(r, a0), B: h.pol(r, a0 + a) }, sector: [{ c: 'O', r, a0, a1: a0 + a }], arc: [{ c: 'O', r, a0, a1: a0 + a, hi: 1 }], dot: 'O', hide: 'A B', ang: [['AOB', th + ' rad', 1, 22]], len: [['OA', r + ' cm', -1]], txt: [[...h.pol(r * 1.13, 90), '?', 'gln q']], alt: `A sector of radius ${r} cm and angle ${th} rad; the arc length and area are asked for.` }; },
    'm-radians:q3': (h, t) => { const r = N(t).pop(); if (!ok(r)) return null; const A = h.pol(r, 60), B = h.pol(r, 120);
      return { P: { O: [0, 0], A, B }, circ: [{ c: 'O', r, dash: 1 }], curve: [{ pts: arcPts(h, [0, 0], r, 60, 120), fill: 2, close: 1, nostroke: 1 }], arc: [{ c: [0, 0], r, a0: 60, a1: 120 }], seg: 'OA OB AB', dot: 'O', hide: 'A B', ang: [['AOB', 'π/3', 1, 22]], len: [['OA', r + ' cm', 1]], txt: [[0, r * 0.93, '?', 'gln q']], alt: `A chord subtending π/3 at the centre of a circle of radius ${r} cm; the area of the segment it cuts off is marked with a question mark.` }; },
    'm-radians:q4': (h, t) => { const [d, Dd] = N(t); if (!ok(d, Dd)) return null; const C = [6, 0], R = 1.1, [T1, T2] = h.tangents([0, 0], C, R);
      return { P: { E: [0, 0], C, T1, T2 }, circ: [{ c: 'C', r: R }], seg: 'ET1 ET2', dash: 'EC', hide: 'C T1 T2', name: { E: 'eye' }, lab: { E: 'w' }, ang: [['T2ET1', '?', 1, 70, q]], len: [['EC', Dd.toLocaleString('en-GB').replace(/,/g, ' ') + ' km', 1]], txt: [[6, 1.45, d + ' km across']], nts: 1, alt: `The Moon, ${d} km across, seen from ${Dd} km away; its angular diameter is marked with a question mark.` }; },
    'm-radians:q5': (h, t) => { const [r, rpm] = N(t); if (!ok(r, rpm)) return null; const P = h.pol(1.5, 50), V = h.add(P, h.mul(h.unit(h.rot(P, 90)), 1.2));
      return { P: { O: [0, 0], P, V }, circ: [{ c: 'O', r: 1.5 }], seg: 'OP', vec: 'PV', dot: 'O', hide: 'P V', len: [['OP', r + ' m', 1], ['PV', 'v = ?', 1, q]], txt: [[0, -1.85, rpm + ' rpm']], lab: { O: 'sw' }, alt: `A wheel of radius ${r} m turning at ${rpm} rpm; the speed of its rim is marked with a question mark.` }; },
    'm-radians:q6': (h, t) => { const [r, A] = N(t); if (!ok(r, A)) return null; const th = 2 * A / (r * r); if (th >= 2 * Math.PI) return null; const a = th / D, a0 = 90 - a / 2;
      return { P: { O: [0, 0], A: h.pol(r, a0), B: h.pol(r, a0 + a) }, sector: [{ c: 'O', r, a0, a1: a0 + a }], dot: 'O', hide: 'A B', ang: [['AOB', '?', 1, 22, q]], len: [['OA', r + ' cm', -1]], txt: [[...h.pol(r * 0.62, 90), A + ' cm²']], alt: `A sector of radius ${r} cm and area ${A} cm²; its angle is marked with a question mark.` }; },

    /* ---------------- vectors ---------------- */
    'm-vectors:s0': (h) => { const p = (x, y, z) => h.p3(x, z, y, 0.55), V = p(2.2, 1.6, 2);
      return { P: { O: p(0, 0, 0), X: p(3, 0, 0), Y: p(0, 2.6, 0), Z: p(0, 0, 2.8), A: p(2.2, 0, 0), B: p(2.2, 1.6, 0), V }, vec: 'OX OY OZ OV', dash: 'OA AB BV', hide: 'O A B', name: { X: 'x', Y: 'y', Z: 'z', V: 'v' }, len: [['OA', 'x', 1], ['AB', 'y', 1], ['BV', 'z', 1]], alt: 'A vector v in three dimensions, reached by going x along, y across and z up.' }; },
    'm-vectors:s1': () => ({ P: { O: [0, 0], A: [2.4, 0.7], B: [3.2, 2.6] }, vec: 'OA AB OB', dot: 'O', len: [['OA', 'a', 1], ['AB', 'b', 1], ['OB', 'a + b', -1]], lab: { O: 'sw' }, alt: 'Adding vectors tip to tail: a then b gives a + b.' }),
    'm-vectors:s2': () => ({ P: { O: [0, 0], A: [3.2, 0.6], B: [1.2, 2.4] }, vec: 'OA OB BA', ang: [['AOB', 'θ', 1, 26]], len: [['OA', 'a', 1], ['OB', 'b', -1], ['BA', 'a − b', -1]], lab: { O: 'sw' }, alt: 'Vectors a and b with the angle θ between them; a − b closes the triangle, which gives a · b = |a||b| cos θ.' }),
    'm-vectors:s3': (h) => { const A = [2.4, 2], B = [4.2, 0], F = h.foot(A, [0, 0], B); return { P: { O: [0, 0], A, B, F }, vec: 'OA OB', dash: 'AF', hi: 'OF', rt: ['AFO'], hide: 'F', len: [['OA', 'a', -1], ['OF', 'a · b̂', 1]], txt: [[4.45, 0.25, 'b']], lab: { O: 'sw' }, alt: 'The component of a along b is the length of its shadow a · b̂ on the direction of b.' }; },
    'm-vectors:s4': (h) => { const A = [1.6, 2], d = [1.4, 0.5]; return { P: { O: [0, 0], A, D1: h.add(A, d), P1: h.add(A, h.mul(d, 2)), L0: h.sub(A, h.mul(d, 1.1)), L1: h.add(A, h.mul(d, 3)) }, seg: 'L0L1', vec: 'OA AD1', dot: 'O P1', hide: 'L0 L1 D1', name: { P1: 'λ = 2' }, lab: { P1: 'se', O: 'sw' }, len: [['OA', 'a', 1], ['AD1', 'd', -1]], alt: 'The line r = a + λd: start at the point with position vector a and move λ times the direction d.' }; },

    /* ---------------- transformations and column vectors ---------------- */
    'm-transformations:s0': (h) => {
      const P = {}, put = (k, pts) => pts.forEach((p, i) => (P[k + i] = p)), T = (o) => [[o[0], o[1]], [o[0] + 1.2, o[1]], [o[0], o[1] + 1]];
      put('a', T([0, 0.2])); put('b', T([1.8, 1.2]));                                              // translation
      put('c', T([4.8, 0.4])); put('d', [0, 1, 2].map((i) => [13.2 - P['c' + i][0], P['c' + i][1]]));      // reflection in x = 6.6
      const C = [1.8, -2.4]; put('e', T([0.4, -3.6])); put('f', [0, 1, 2].map((i) => h.rot(P['e' + i], 90, C)));   // rotation by 90° about C
      const O = [4.4, -4.4]; put('g', [[5.2, -3.9], [5.8, -3.9], [5.2, -3.4]]); put('k', [0, 1, 2].map((i) => h.add(O, h.mul(h.sub(P['g' + i], O), 2))));   // enlargement by 2 from O
      Object.assign(P, { M0: [6.6, 0], M1: [6.6, 2.1], Cc: C, Oo: O });
      return { P, poly: [{ p: 'a0a1a2' }, { p: 'b0b1b2', fill: 1 }, { p: 'c0c1c2' }, { p: 'd0d1d2', fill: 1 }, { p: 'e0e1e2' }, { p: 'f0f1f2', fill: 1 }, { p: 'g0g1g2' }, { p: 'k0k1k2', fill: 1 }],
        vec: 'a0b0', dash: 'M0M1 Ook0 Ook1 Ook2', dot: 'Cc Oo', ang: [['e1Ccf1', '90°', 1, 16]], hide: Object.keys(P).join(' '),
        txt: [[1.5, -0.45, 'translation', 'gln'], [6.6, -0.45, 'reflection', 'gln'], [1.7, -4.6, 'rotation', 'gln'], [6.1, -4.75, 'enlargement', 'gln']], size: 400,
        alt: 'The four transformations: a translation along a vector, a reflection in a mirror line, a rotation of 90° about a centre, and an enlargement by 2 from a centre. Each image is shaded.' }; },
    'm-transformations:s1': (h) => { const T = [[1, 1], [3, 1], [1, 2.5]], P = {}; T.forEach((p, i) => { P['t' + i] = p; P['u' + i] = [p[0], -p[1]]; P['v' + i] = [-p[0], -p[1]]; });
      return { P, axes: grid([-4, 4], [-3.5, 3.5], 0), poly: [{ p: 't0t1t2', fill: 1 }, { p: 'u0u1u2', dash: 1 }, { p: 'v0v1v2', fill: 2 }], hide: Object.keys(P).join(' '), txt: [[1.7, 1.45, 'T'], [1.7, -1.45, 'T₁'], [-1.7, -1.45, 'T₂']], alt: 'T reflected in the x-axis gives T₁ (dashed); T₁ reflected in the y-axis gives T₂, which is T turned through 180° about the origin.' }; },
    'm-transformations:s2': () => ({ P: { O: [0, 0], A: [3, 1], B: [4, 3] }, axes: grid([-0.5, 5], [-0.5, 3.6], 0), vec: 'OA AB OB', hide: 'O A B', len: [['OA', '(3, 1)', 1], ['AB', '(1, 2)', 1], ['OB', '(4, 3)', -1]], alt: 'Column vectors add component by component: (3, 1) + (1, 2) = (4, 3).' }),
    'm-transformations:s3': () => ({ P: { O: [0, 0], P: [4, 3], F: [4, 0] }, axes: grid([-0.5, 5], [-0.5, 3.6], 0), vec: 'OP', dash: 'OF FP', rt: ['OFP'], hide: 'O P F', ang: [['FOP', 'θ', 1, 30]], len: [['OF', 'x', 1], ['FP', 'y', 1], ['OP', '√(x² + y²)', -1]], alt: 'The vector (x, y): its length is √(x² + y²) and it makes the angle θ = arctan(y/x) with the x-axis.' }),
    'm-transformations:s4': (h) => { const A = [3.2, 0.4], B = [1, 2.6], M = h.mid(A, B); return { P: { O: [0, 0], A, B, M }, vec: 'OA OB', seg: 'AB', dash: 'OM', dot: 'M', tick: { 1: 'AM MB' }, len: [['OA', 'a', 1], ['OB', 'b', -1], ['OM', '½(a + b)', 1]], lab: { O: 'sw', M: 'ne' }, alt: 'The midpoint M of AB has position vector ½(a + b).' }; },
    'm-transformations:q0': () => ({ P: { A: [1, 2], B: [4, 2], C: [1, 5], V: [4, -2] }, axes: grid([-1, 8], [-3, 6]), poly: [{ p: 'ABC', fill: 1 }], vec: 'AV', hide: 'V', name: { A: 'A(1, 2)', B: 'B(4, 2)', C: 'C(1, 5)' }, lab: { A: 'w', B: 'e', C: 'n' }, len: [['AV', '(3, −4)', -1]], alt: 'Triangle A(1, 2), B(4, 2), C(1, 5) and the translation vector (3, −4); the image is to be found.' }),
    'm-transformations:q1': () => ({ P: { P: [3, -1], L0: [-3.6, -3.6], L1: [3.6, 3.6] }, axes: grid([-4, 4], [-4, 4]), dash: 'L0L1', dot: 'P', hide: 'L0 L1', name: { P: '(3, −1)' }, lab: { P: 'e' }, txt: [[3.4, 3.0, 'y = x']], alt: 'The point (3, −1) and the mirror line y = x.' }),
    'm-transformations:q2': () => ({ P: { O: [0, 0], A: [3, 4], B: [1, -2] }, axes: grid([-1, 5], [-3, 5]), vec: 'OA OB', hide: 'O A B', len: [['OA', 'a = (3, 4)', -1], ['OB', 'b = (1, −2)', 1]], alt: 'The vectors a = (3, 4) and b = (1, −2) drawn from the origin.' }),
    'm-transformations:q3': () => ({ P: { P: [5, 2], O: [0, 0], C: [1, 1] }, axes: grid([-3, 6], [-1, 6]), dot: 'P O C', name: { P: '(5, 2)', C: '(1, 1)' }, lab: { P: 'e', C: 'n', O: 'sw' }, alt: 'The point (5, 2), with the two centres of rotation: the origin and (1, 1).' }),
    'm-transformations:q6': (h) => { const A = [3.4, 0.6], B = [1, 2.8]; return { P: { O: [0, 0], A, B, M: h.mid(A, B), P: h.lerp(A, B, 1 / 3) }, vec: 'OA OB', seg: 'AB', dash: 'OM OP', dot: 'M P', len: [['OA', 'a', 1], ['OB', 'b', -1]], lab: { O: 'sw', M: 'ne', P: 'ne' }, alt: 'OA = a and OB = b; M is the midpoint of AB and P divides AB in the ratio 1 : 2.' }; },
    'm-transformations:q7': (h) => { const A = [0, 0], B = [4.4, 0], C = [1.4, 2.8]; return { P: { A, B, C, M: h.mid(A, C), N: h.mid(B, C) }, poly: [{ p: 'ABC' }], seg: 'MN', tick: { 1: 'AM MC', 2: 'BN NC' }, lab: { M: 'w', N: 'e' }, alt: 'Triangle ABC with M and N the midpoints of AC and BC, joined by MN.' }; },
    'm-transformations:q8': (h) => { const a = [2.2, 0.4], b = [1.4, 1.4], C = h.sub(h.mul(b, 3), h.mul(a, 2)); return { P: { O: [0, 0], A: a, B: b, C }, vec: 'OA OB', dash: 'AC', dot: 'A B C', len: [['OA', 'a', 1], ['OB', 'b', 1]], lab: { O: 'sw', C: 'n' }, alt: 'OA = a, OB = b and OC = 3b − 2a: are A, B and C on one straight line?' }; }
  });
});
/* Geodesic — figures for the generated practice questions (qt-maths.js). Each is matched by the template's own text
   and drawn from the numbers drawn for that question, never from its answer. */
((window.WL = window.WL || {}).geoWait = window.WL.geoWait || []).push(function (G) {
  const q = 'q', D = Math.PI / 180, E = 0.3;
  const n = (x) => String(+(+x).toFixed(2)).replace('-', '−');
  const fit = (...x) => 2.6 / Math.max(...x.map(Math.abs));
  G.addQ([
    ['A rectangle is {a} cm by {b} cm, each measured to the nearest centimetre. What is the largest possible area?', (h, v) => { const s = fit(v.a, v.b); return { P: { A: [0, 0], B: [v.a * s, 0], C: [v.a * s, v.b * s], Dd: [0, v.b * s] }, poly: [{ p: 'ABCDd' }], hide: 'A B C Dd', len: [['AB', n(v.a) + ' cm', 1], ['BC', n(v.b) + ' cm', 1]], size: 220, alt: `A rectangle ${v.a} cm by ${v.b} cm.` }; }],
    ['The interior angles of a regular polygon with {n} sides are each how many degrees?', (h, v) => { const V = h.reg(v.n, 1, 90 + 180 / v.n), P = {}; V.forEach((p, i) => (P['V' + i] = p)); return { P, poly: [{ p: V.map((_, i) => 'V' + i) }], hide: Object.keys(P).join(' '), ang: [['V' + (v.n - 1) + 'V0V1', '?', 1, 18, q]], size: 220, alt: `A regular polygon with ${v.n} sides; one interior angle is marked with a question mark.` }; }],
    ['Two similar shapes have lengths in the ratio 1 : {k}. The smaller has area {A} cm². What is the area of the larger?', (h, v) => { const k = Math.min(v.k, 3.5), t = [[0, 0], [1, 0], [0.35, 0.8]], u = t.map((p) => [1.6 + p[0] * k, p[1] * k]); return { P: { a: t[0], b: t[1], c: t[2], d: u[0], e: u[1], f: u[2] }, poly: [{ p: 'abc', fill: 1 }, { p: 'def', fill: 2 }], hide: 'a b c d e f', len: [['ab', '1', 1], ['de', n(v.k), 1]], txt: [[0.45, -0.55, 'area ' + v.A + ' cm²'], [1.6 + 0.45 * k, 0.3 * k, '?', 'gln q']], nts: v.k > 3.5 ? 1 : 0, alt: `Two similar triangles with lengths in the ratio 1 : ${k}; the smaller has area ${v.A} cm².` }; }],
    ['Find the volume of a cylinder of radius {r} cm and height {h} cm.', (h, v) => { const s = fit(v.r * 1.2, v.h), r = v.r * s, H = v.h * s; return { P: { a: [-r, 0], b: [-r, H], c: [r, 0], d: [r, H], o: [0, H] }, seg: 'ab cd', dash: 'od', ell: [{ c: [0, 0], rx: r, ry: E * r, back: 'dash' }, { c: [0, H], rx: r, ry: E * r }], hide: 'a b c d o', len: [['od', n(v.r) + ' cm', -1], ['cd', n(v.h) + ' cm', 1]], alt: `A cylinder of radius ${v.r} cm and height ${v.h} cm.` }; }],
    ['Find the surface area of a sphere of radius {r} cm.', (h, v) => ({ P: { O: [0, 0], R: [1, 0] }, circ: [{ c: 'O', r: 1 }], ell: [{ c: [0, 0], rx: 1, ry: E, back: 'dash' }], dash: 'OR', dot: 'O', hide: 'O R', len: [['OR', n(v.r) + ' cm', -1]], size: 180, alt: `A sphere of radius ${v.r} cm.` })],
    ['Find the volume of a cone of radius {r} cm and height {h} cm.', (h, v) => { const s = fit(v.r * 1.2, v.h), r = v.r * s, H = v.h * s; return { P: { a: [-r, 0], c: [r, 0], t: [0, H], o: [0, 0] }, seg: 'at ct', dash: 'to oc', rt: ['toc'], ell: [{ c: [0, 0], rx: r, ry: E * r, back: 'dash' }], hide: 'a c t o', len: [['oc', n(v.r) + ' cm', 1], ['to', n(v.h) + ' cm', -1]], alt: `A cone of radius ${v.r} cm and height ${v.h} cm.` }; }],
    ['An angle at the circumference is {a}°. What is the angle at the centre subtended by the same arc?', (h, v) => ({ P: { A: h.pol(1, 270 - v.a), B: h.pol(1, 270 + v.a), P: h.pol(1, 90), O: [0, 0] }, circ: [{ c: 'O', r: 1 }], seg: 'APB AOB', dot: 'O', ang: [['APB', v.a + '°', 1, 24], ['AOB', '?', 1, 16, q]], lab: { O: 'w' }, alt: `An angle of ${v.a}° at the circumference; the angle at the centre on the same arc is marked with a question mark.` })],
    ['In a right-angled triangle the hypotenuse is {h} cm and one angle is {th}°. Find the side opposite that angle.', (h, v) => { const A = [0, 0], B = [Math.cos(v.th * D), 0], C = [B[0], Math.sin(v.th * D)]; return { P: { A, B, C }, poly: [{ p: 'ABC' }], rt: ['ABC'], hide: 'A B C', ang: [['BAC', v.th + '°', 1, 26]], len: [['AC', n(v.h) + ' cm', -1], ['BC', '?', 1, q]], alt: `A right-angled triangle with hypotenuse ${v.h} cm and an angle of ${v.th}°; the opposite side is marked with a question mark.` }; }],
    ['A right-angled triangle has legs {o} cm (opposite) and {a} cm (adjacent). Find the angle.', (h, v) => ({ P: { A: [0, 0], B: [v.a, 0], C: [v.a, v.o] }, poly: [{ p: 'ABC' }], rt: ['ABC'], hide: 'A B C', ang: [['BAC', '?', 1, 26, q]], len: [['AB', n(v.a) + ' cm', 1], ['BC', n(v.o) + ' cm', 1]], alt: `A right-angled triangle with legs ${v.o} cm opposite and ${v.a} cm adjacent to the angle marked with a question mark.` })],
    ['A triangle has sides {a} cm and {b} cm with an included angle of {C}°. Find the third side.', (h, v) => ({ P: { C: [0, 0], B: [v.a, 0], A: h.pol(v.b, v.C) }, poly: [{ p: 'ABC' }], hide: 'A B C', ang: [['BCA', v.C + '°', 1, 22]], len: [['CB', n(v.a) + ' cm', 1], ['CA', n(v.b) + ' cm', 0], ['AB', '?', 0, q]], alt: `A triangle with sides ${v.a} cm and ${v.b} cm and an angle of ${v.C}° between them; the third side is marked with a question mark.` })],
    ['Find the area of a triangle with sides {a} cm and {b} cm and an included angle of {C}°.', (h, v) => { const A = h.pol(v.b, v.C); return { P: { C: [0, 0], B: [v.a, 0], A }, poly: [{ p: 'ABC', fill: 1 }], hide: 'A B C', ang: [['BCA', v.C + '°', 1, 22]], len: [['CB', n(v.a) + ' cm', 1], ['CA', n(v.b) + ' cm', 0]], txt: [[...h.cent([0, 0], [v.a, 0], A), '?', 'gln q']], alt: `A triangle with sides ${v.a} cm and ${v.b} cm and an angle of ${v.C}° between them; its area is marked with a question mark.` }; }],
    ['Find the length of an arc of a circle of radius {r} cm subtending {th} radians at the centre.', (h, v) => { const a = v.th / D, a0 = 90 - a / 2; return { P: { O: [0, 0], A: h.pol(1, a0), B: h.pol(1, a0 + a) }, circ: [{ c: 'O', r: 1, dash: 1 }], seg: 'OA OB', arc: [{ c: 'O', r: 1, a0, a1: a0 + a, hi: 1 }], dot: 'O', hide: 'A B', ang: [['AOB', n(v.th) + ' rad', 1, 20, '', 'ccw']], txt: [[...h.pol(1.18, 90), '?', 'gln q'], [...h.add(h.pol(0.55, a0), h.pol(0.17, a0 - 90)), n(v.r) + ' cm']], size: 220, alt: `An arc of a circle of radius ${v.r} cm subtending ${v.th} radians at the centre; its length is marked with a question mark.` }; }],
    ['Find the area of a sector of radius {r} cm and angle {th} radians.', (h, v) => { const a = v.th / D, a0 = 90 - a / 2; return { P: { O: [0, 0], A: h.pol(1, a0), B: h.pol(1, a0 + a) }, sector: [{ c: 'O', r: 1, a0, a1: a0 + a }], dot: 'O', hide: 'A B', ang: [['AOB', n(v.th) + ' rad', 1, 20, '', 'ccw']], txt: [[...h.pol(0.62, 90), '?', 'gln q'], [...h.add(h.pol(0.55, a0), h.pol(0.17, a0 - 90)), n(v.r) + ' cm']], size: 220, alt: `A sector of radius ${v.r} cm and angle ${v.th} radians; its area is marked with a question mark.` }; }],
    ['Find the angle between ({a1}, {a2}) and ({b1}, {b2}).', (h, v) => { const xs = [v.a1, v.b1, 0], ys = [v.a2, v.b2, 0]; return { P: { O: [0, 0], A: [v.a1, v.a2], B: [v.b1, v.b2] }, axes: { x: [Math.min(...xs) - 1, Math.max(...xs) + 1], y: [Math.min(...ys) - 1, Math.max(...ys) + 1], grid: 1, step: 1, labels: 0 }, vec: 'OA OB', hide: 'O', name: { A: `(${n(v.a1)}, ${n(v.a2)})`, B: `(${n(v.b1)}, ${n(v.b2)})` }, ang: [['AOB', '?', 1, 18, q]], alt: `The vectors (${v.a1}, ${v.a2}) and (${v.b1}, ${v.b2}) from the origin; the angle between them is marked with a question mark.` }; }],
    ['A particle on a string of length {l} m moves in a vertical circle. What is the least speed at the top for the string to stay taut? (g = 9.8)', (h, v) => ({ P: { O: [0, 0], T: [0, 1], V: [0.9, 1] }, circ: [{ c: 'O', r: 1, dash: 1 }], seg: 'OT', vec: 'TV', dot: 'O T', hide: 'O T V', len: [['OT', n(v.l) + ' m', -1], ['TV', 'v = ?', -1, q]], size: 200, alt: `A particle on a string of length ${v.l} m at the top of a vertical circle; its least speed there is marked with a question mark.` })]
  ]);
});
/* Geodesic — step-by-step guides, written for someone meeting a topic for the first time.
   Data: WL.gd(id, { h: hook, s: [[heading, [paragraphs], { e: display TeX, x: [question, [working], answer],
   c: [check question, answer], n: index of the notes section it explains }]], m: [[mistake, what to do instead]] }).
   One file per stage (js/guide-<stage>.js), loaded the first time a topic of that stage is opened.
   Shown three ways: a "Start here" panel on the lesson, the full guide at the top of Notes, and
   (in narrate.js) the film's "Explain more" mode, which pauses the film to read it. */
(function () {
  const WL = (window.WL = window.WL || {});
  WL.guide = WL.guide || {};
  WL.gd = (id, g) => { WL.guide[id] = g; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // **bold** is split out before the maths converter sees it (it would read the asterisks as multiplication)
  const pr = (s) => { const base = WL.texPretty || WL.pretty || esc; return String(s == null ? '' : s).split(/\*\*(.+?)\*\*/).map((t, i) => (i % 2 ? '<b>' + base(t) + '</b>' : base(t))).join(''); };
  const node = (id) => (((WL.app || {}).nodes || {})[id]) || null;
  const fileOf = (id) => { const n = node(id); return n && n.stage ? n.stage : null; };
  const loading = {};
  function loadFile(st) {
    if (!st) return Promise.reject(new Error('no stage'));
    return loading[st] || (loading[st] = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'js/guide-' + st + '.js'; s.async = true;
      s.onload = () => res(); s.onerror = () => rej(new Error('guide file'));   // a stage with no guide file yet is asked for once per visit
      document.head.appendChild(s);
    }));
  }
  WL.guideLoad = async (id) => { if (WL.guide[id]) return WL.guide[id]; try { await loadFile(fileOf(id)); } catch (e) { return null; } return WL.guide[id] || null; };
  const words = (g) => { let n = (g.h || '').split(/\s+/).length; (g.s || []).forEach(([h, ps, o]) => { n += (h + ' ' + (ps || []).join(' ')).split(/\s+/).length; if (o && o.x) n += (o.x[0] + ' ' + (o.x[1] || []).join(' ') + ' ' + o.x[2]).split(/\s+/).length; if (o && o.c) n += (o.c[0] + ' ' + o.c[1]).split(/\s+/).length; }); (g.m || []).forEach(([a, b]) => (n += (a + ' ' + b).split(/\s+/).length)); return n; };
  const mins = (g) => Math.max(3, Math.round(words(g) / 170));

  function startHTML(id, g) {
    const steps = g.s || [];
    return `<section class="gd-start" aria-labelledby="gd-start-h">
      <h2 class="gd-kick" id="gd-start-h">Rather read it? The same ideas, step by step</h2>
      ${g.h ? `<p class="gd-hook">${pr(g.h)}</p>` : ''}
      <ol class="gd-mini">${steps.map(([h]) => `<li>${pr(h)}</li>`).join('')}</ol>
      <div class="gd-go"><button type="button" class="btn small primary" data-go="read" data-gd-open>Read it step by step</button><span>${steps.length} steps, about ${mins(g)} minutes, with worked examples and quick checks</span></div>
    </section>`;
  }
  function fullHTML(id, g) {
    const steps = g.s || [];
    return `<section class="gd" id="gd" aria-labelledby="gd-h">
      <div class="gd-head"><h2 id="gd-h">Step by step</h2><p>For when this topic is new: one idea at a time, each with a worked example and a quick check. About ${mins(g)} minutes.</p></div>
      ${g.h ? `<p class="gd-hook">${pr(g.h)}</p>` : ''}
      <ol class="gd-steps">${steps.map(([h, ps, o], i) => { o = o || {}; return `<li class="gd-step" id="gd-s${i + 1}">
        <h3><span class="gd-n" aria-hidden="true">${i + 1}</span>${pr(h)}</h3>
        ${(ps || []).map((p) => `<p>${pr(p)}</p>`).join('')}
        ${o.e ? `<div class="tex gd-eq">\\[${esc(o.e)}\\]</div>` : ''}
        ${o.x ? `<div class="gd-ex"><p class="gd-exh">Worked example</p><p class="gd-exq">${pr(o.x[0])}</p><ol class="gd-exs">${(o.x[1] || []).map((t) => `<li>${pr(t)}</li>`).join('')}</ol>${o.x[2] ? `<p class="gd-exa"><b>Answer</b> ${pr(o.x[2])}</p>` : ''}</div>` : ''}
        ${o.c ? `<details class="gd-ck"><summary><span class="gd-ckh">Quick check</span> ${pr(o.c[0])}</summary><p>${pr(o.c[1])}</p></details>` : ''}
      </li>`; }).join('')}</ol>
      ${(g.m || []).length ? `<section class="gd-mis"><h3>Common mistakes</h3><ul>${g.m.map(([a, b]) => `<li><b>${pr(a)}</b> ${pr(b)}</li>`).join('')}</ul></section>` : ''}
      <p class="gd-next">Next: the summary notes below, then the Practice tab.</p>
    </section>`;
  }
  // fill the guide slots on a topic page once the stage's file has loaded
  WL.guideFill = async (root, id) => {
    const slots = [...(root || document).querySelectorAll('[data-gd]')]; if (!slots.length) return;
    const g = await WL.guideLoad(id);
    slots.forEach((el) => {
      if (!el.isConnected) return;
      if (!g) { el.remove(); return; }
      el.innerHTML = el.dataset.gd === 'start' ? startHTML(id, g) : fullHTML(id, g);
      el.removeAttribute('data-gd');
      if (WL.mathify) WL.mathify(el);
      const ts = WL.app && WL.app.h && WL.app.h.typeset; if (ts && el.querySelector('.tex')) ts(el);
    });
  };
  WL.guideText = { words, mins };
})();
/* Geodesic — exam command words and key terms, highlighted wherever a question appears; key terms listed on each topic. */
(function () {
  const WL = (window.WL = window.WL || {});
  const CMD = ['Show that', 'Write down', 'Work out', 'Explain why', 'Explain how', 'Calculate', 'Determine', 'Estimate', 'Explain', 'Describe', 'Suggest', 'Compare', 'Evaluate', 'Justify', 'Sketch', 'Draw', 'Plot', 'Predict', 'Deduce', 'Derive', 'Prove', 'Discuss', 'Define', 'Outline', 'Complete', 'State', 'Name', 'Give', 'Identify', 'Find', 'Solve', 'Simplify', 'Expand', 'Factorise', 'Hence', 'Use', 'Convert', 'Express', 'Verify', 'Assess', 'Analyse', 'Interpret'];
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const CMD_RE = new RegExp(`\\b(${CMD.sort((a, b) => b.length - a.length).map(escRe).join('|')})\\b`, 'g');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON', 'SELECT', 'CODE', 'MARK', 'SVG', 'MJX-CONTAINER']);
  const terms = (tid) => (WL.keyterms || {})[tid] || [];
  const RE = new Map();
  function termRe(tid) {
    if (RE.has(tid)) return RE.get(tid);
    const L = terms(tid).map(([t]) => t).filter((t) => t && t.length > 2).sort((a, b) => b.length - a.length);
    const r = L.length ? new RegExp(`(?<![\\w-])(${L.map((t) => escRe(t).replace(/\\ /g, '[\\s-]')).join('|')})(?:s|es)?(?![\\w-])`, 'gi') : null;
    RE.set(tid, r); return r;
  }
  const defOf = (tid, word) => { const w = word.toLowerCase(); const hit = terms(tid).find(([t]) => w.startsWith(t.toLowerCase()) || t.toLowerCase().startsWith(w.replace(/e?s$/, ''))); return hit ? hit[1] : ''; };
  function highlight(el, tid) {
    if (!el || el.dataset.hl === '1') return; el.dataset.hl = '1';
    const tr = tid ? termRe(tid) : null, walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { for (let p = n.parentNode; p && p !== el; p = p.parentNode) { if (SKIP.has(p.nodeName.toUpperCase()) || (p.classList && (p.classList.contains('mx') || p.classList.contains('tex')))) return NodeFilter.FILTER_REJECT; } return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    let seenCmd = 0;
    for (const n of nodes) {
      const s = n.nodeValue, hits = [];
      CMD_RE.lastIndex = 0; let m;
      while ((m = CMD_RE.exec(s))) { const before = s.slice(0, m.index); if (m.index === 0 || /[.:;?!)\n]\s*$|^\s*$|\(\w\)\s*$/.test(before)) hits.push({ i: m.index, j: m.index + m[0].length, k: 'cmd' }); }
      if (tr) { tr.lastIndex = 0; while ((m = tr.exec(s))) { if (!hits.some((h) => m.index < h.j && m.index + m[0].length > h.i)) hits.push({ i: m.index, j: m.index + m[0].length, k: 'term' }); } }
      if (!hits.length) continue;
      hits.sort((a, b) => a.i - b.i);
      const frag = document.createDocumentFragment(); let at = 0;
      for (const h of hits) {
        if (h.i < at) continue;
        if (h.i > at) frag.appendChild(document.createTextNode(s.slice(at, h.i)));
        const mk = document.createElement('mark'); mk.className = h.k === 'cmd' ? 'kw-cmd' : 'kw-term'; mk.textContent = s.slice(h.i, h.j);
        if (h.k === 'term') { const d = defOf(tid, mk.textContent); if (d) mk.title = d; } else { mk.title = CMDDEF[mk.textContent] || 'Command word: it tells you what kind of answer earns the marks.'; seenCmd++; }
        frag.appendChild(mk); at = h.j;
      }
      if (at < s.length) frag.appendChild(document.createTextNode(s.slice(at)));
      n.parentNode.replaceChild(frag, n);
    }
  }
  const CMDDEF = { State: 'State: give a short answer, no explanation needed.', Name: 'Name: a single word or phrase.', Give: 'Give: a short answer recalled from memory.', Describe: 'Describe: say what happens, step by step; no reasons needed.', Explain: 'Explain: give the reasons why, linking cause and effect.', 'Explain why': 'Explain why: give the physical reasons.', 'Explain how': 'Explain how: describe the mechanism, step by step.', Calculate: 'Calculate: work out a number; show the equation, substitution, answer and unit.', 'Work out': 'Work out: find a value, showing working.', Determine: 'Determine: find a value, often from data or a graph.', Estimate: 'Estimate: use sensible approximate values; one or two significant figures.', 'Show that': 'Show that: prove the stated result; every step must be shown, give one more figure than stated.', Suggest: 'Suggest: apply your knowledge to an unfamiliar case; there may be several right answers.', Compare: 'Compare: give similarities and differences, side by side.', Evaluate: 'Evaluate: weigh up the evidence and give a judgement.', Justify: 'Justify: give evidence or reasons for an answer.', Sketch: 'Sketch: a freehand graph with the right shape and key points labelled.', Draw: 'Draw: an accurate diagram or graph.', Plot: 'Plot: mark points accurately on a grid.', Predict: 'Predict: say what will happen, from a pattern or theory.', Deduce: 'Deduce: reach a conclusion from the information given.', Derive: 'Derive: start from basic principles and show every step to the result.', Prove: 'Prove: a rigorous argument from accepted facts.', Discuss: 'Discuss: set out arguments and evidence on more than one side.', Define: 'Define: give the precise meaning, as in a glossary.', Outline: 'Outline: the main points only.', Complete: 'Complete: fill in the missing parts.', Identify: 'Identify: pick out the right item from information given.', Find: 'Find: obtain a value or expression.', Solve: 'Solve: find the values that satisfy the equation.', Hence: 'Hence: use the previous result to answer this part.', Use: 'Use: the answer must be based on the information given.' };
  /* every question on screen gets highlighted once */
  const SEL = '.pcq-q, .exq-q, .pqq, .pq .pqq, .shres label, .olyq-q, .tq-q';
  const tidOf = (el) => { const t = el.closest('[data-tid]'); if (t && t.dataset.tid) return t.dataset.tid; const h = decodeURIComponent((location.hash || '').slice(1)); return h.startsWith('t-') ? h.slice(2) : ''; };
  let queued = false;
  function sweep() { queued = false; document.querySelectorAll(SEL).forEach((el) => { if (el.dataset.hl !== '1') highlight(el, tidOf(el)); }); }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(sweep); } }
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.addEventListener) {
    const start = () => { new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches(SEL) || n.querySelector(SEL))) { queue(); return; } }).observe(document.body, { childList: true, subtree: true }); queue(); };
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  }
  /* the key-terms box for a topic page */
  function termsHTML(tid, esc, pr) {
    const L = terms(tid); if (!L.length) return '';
    return `<section class="nsec kterms" data-kterms><div class="kt-h"><h3>Key terms</h3><button type="button" class="btn small ghost" data-ktcover aria-pressed="false">Cover the definitions</button></div>
      <p class="kt-sub">Learn these word for word: definitions earn marks on their own. In questions on this topic they are underlined in teal, and command words such as <mark class="kw-cmd">Explain</mark> are marked in gold.</p>
      <dl class="kt-list">${L.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${pr(d)}</dd></div>`).join('')}</dl></section>`;
  }
  if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-ktcover]'); if (!b) return; const box = b.closest('.kterms'), on = !box.classList.contains('covered'); box.classList.toggle('covered', on); b.setAttribute('aria-pressed', on); b.textContent = on ? 'Show the definitions' : 'Cover the definitions'; });
  WL.kw = { highlight, termsHTML, terms, sweep };
})();
/* Geodesic — the knowledge map (#map, #map-maths). Every topic of a track, a column per stage and a band per strand,
   joined to the topics it builds on, and coloured by what you have done: understood, practised, due for review, with
   mistakes waiting, or not started. Topics whose prerequisites you have all understood are marked "ready": that is
   the edge of what you know, the best place to go next. Point at a topic to see the chain it rests on and what it
   leads to. */
(function () {
  const WL = (window.WL = window.WL || {});
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const NW = 168, NH = 26, GAPY = 6, COLW = 210, TOP = 62, PADX = 16;
  const mc = document.createElement('canvas').getContext('2d');
  const fit = (t, w) => { mc.font = '12px "Jost", system-ui, sans-serif'; if (mc.measureText(t).width <= w) return t; let s = t; while (s.length > 3 && mc.measureText(s + '…').width > w) s = s.slice(0, -1); return s.trimEnd() + '…'; };

  function stateOf(id, LS, mk, pre) {
    const u = !!LS.u[id], p = LS.p[id] || {}, tried = Object.keys(p).length, due = u && LS.r[id] && LS.r[id].due <= Date.now();
    const ready = !u && (pre[id] || []).filter((x) => N()[x]).every((x) => LS.u[x]);
    return { u, tried, due, mk: mk[id] || 0, ready, cls: u ? 'km-u' : ready ? 'km-r' : tried ? 'km-p' : 'km-n' };
  }
  function render(view, trId) {
    const A = WL.app, tr = A && A.TR[trId]; if (!tr) return;
    const h = H(), LS = h.LS ? h.LS() : { u: {}, p: {}, r: {} }, pre = A.prereq || tr.pre || {};   // the same links as a topic's "Builds on"
    const mk = {}; (WL.mistakes ? WL.mistakes.open() : []).forEach((e) => (mk[e.tid] = (mk[e.tid] || 0) + 1));
    const strands = tr.strands || [], sIdx = {}; strands.forEach((s, i) => (sIdx[s.id] = i));
    const cols = tr.stages.map((st) => ({ st, ids: tr.order.filter((id) => N()[id] && N()[id].stage === st.id).sort((a, b) => (sIdx[N()[a].strand] ?? 99) - (sIdx[N()[b].strand] ?? 99) || tr.order.indexOf(a) - tr.order.indexOf(b)) })).filter((c) => c.ids.length);
    const pos = {}; let maxY = 0;
    cols.forEach((c, ci) => { let y = TOP, last = null; c.ids.forEach((id) => { const s = N()[id].strand; if (last && s !== last) y += 10; last = s; pos[id] = { x: PADX + ci * COLW, y, ci }; y += NH + GAPY; }); maxY = Math.max(maxY, y); });
    const W = PADX * 2 + cols.length * COLW - (COLW - NW), Hh = maxY + 20;
    const S = {}; tr.order.forEach((id) => { if (pos[id]) S[id] = stateOf(id, LS, mk, pre); });
    const colour = (id) => (h.strandOf ? h.strandOf(id).colour : '#58C4DD');
    /* the links: from each prerequisite's right edge to the topic's left edge */
    const edges = []; tr.order.forEach((id) => (pre[id] || []).forEach((p) => { if (pos[p] && pos[id]) edges.push([p, id]); }));
    const path = ([a, b]) => { const A1 = pos[a], B1 = pos[b]; const x1 = A1.x + NW, y1 = A1.y + NH / 2, x2 = B1.x, y2 = B1.y + NH / 2; if (A1.ci === B1.ci) { const xl = A1.x - 8 - Math.min(40, Math.abs(y2 - y1) / 6); return `M${A1.x},${y1} C${xl},${y1} ${xl},${y2} ${x2},${y2}`; } const dx = Math.max(30, (x2 - x1) / 2); return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`; };
    const ready = tr.order.filter((id) => S[id] && S[id].ready).slice(0, 10);
    const und = tr.order.filter((id) => S[id] && S[id].u).length, tot = Object.keys(pos).length;
    document.title = `Knowledge map · ${tr.name} · Geodesic`;
    view.innerHTML = `<section class="mk-head"><p class="crumb"><a href="#${trId}">${esc(tr.name)}</a></p><h1>Knowledge map</h1>
        <p class="lede">Every ${esc(tr.name.toLowerCase())} topic, a column for each stage, joined to the topics it builds on. Colours show what you have done. Topics marked <b>ready</b> have all their prerequisites understood: that is the edge of what you know, and the best place to go next. Point at a topic, or tab to it, to light up the chain it rests on and what it leads to.</p>
        <div class="km-trk" role="tablist" aria-label="Track"><a role="tab" href="#map" aria-selected="${trId === 'physics'}">Physics</a><a role="tab" href="#map-maths" aria-selected="${trId === 'maths'}">Maths</a></div>
        <p class="mk-stats"><span><b>${und}</b> of ${tot} understood</span><span><b>${tr.order.filter((id) => S[id] && S[id].ready).length}</b> ready to learn</span><span><b>${Object.keys(mk).filter((id) => S[id]).length}</b> with mistakes waiting</span></p></section>
      ${ready.length ? `<div class="km-ready"><h2 class="mk-h">Ready to learn next</h2><ul>${ready.map((id) => `<li style="--lane:${colour(id)}"><a href="#t-${id}">${esc(N()[id].title)}</a><small>${esc((h.stageOf(id) || {}).short || '')}</small></li>`).join('')}</ul></div>` : ''}
      <ul class="km-key" aria-label="Key"><li><i class="km-u"></i>Understood</li><li><i class="km-r"></i>Ready: everything it builds on is understood</li><li><i class="km-p"></i>Practised, not yet understood</li><li><i class="km-n"></i>Not started</li><li><i class="km-dot due"></i>Due for review</li><li><i class="km-dot mk"></i>Mistakes waiting</li></ul>
      <div class="km-wrap" tabindex="0" aria-label="Knowledge map: scroll sideways to see every stage">
        <svg class="km" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" role="group" aria-label="${esc(tr.name)} topics by stage">
          ${cols.map((c, ci) => { const k = c.ids.filter((id) => S[id].u).length; return `<g class="km-col"><text x="${PADX + ci * COLW}" y="24" class="km-st">${esc(c.st.short || c.st.name)}</text><text x="${PADX + ci * COLW}" y="44" class="km-stn">${k} of ${c.ids.length} understood</text></g>`; }).join('')}
          <g class="km-edges">${edges.map((e) => `<path d="${path(e)}" data-a="${e[0]}" data-b="${e[1]}"/>`).join('')}</g>
          <g class="km-nodes">${Object.keys(pos).map((id) => { const p = pos[id], s = S[id], t = N()[id].title; return `<a href="#t-${id}" data-id="${id}" class="km-node ${s.cls}" aria-label="${esc(t)}: ${s.u ? 'understood' : s.ready ? 'ready to learn' : s.tried ? 'practised' : 'not started'}${s.due ? ', due for review' : ''}${s.mk ? `, ${s.mk} mistakes waiting` : ''}"><title>${esc(t)}</title><rect x="${p.x}" y="${p.y}" width="${NW}" height="${NH}" rx="6" style="--lane:${colour(id)}"/><rect x="${p.x}" y="${p.y}" width="4" height="${NH}" rx="2" class="km-lane" style="fill:${colour(id)}"/><text x="${p.x + 11}" y="${p.y + NH / 2 + 4}">${esc(fit(t, NW - (s.due || s.mk ? 30 : 16)))}</text>${s.due ? `<circle cx="${p.x + NW - (s.mk ? 20 : 10)}" cy="${p.y + NH / 2}" r="4" class="km-due"/>` : ''}${s.mk ? `<circle cx="${p.x + NW - 10}" cy="${p.y + NH / 2}" r="4" class="km-mk"/>` : ''}</a>`; }).join('')}</g>
        </svg></div>`;
    const svg = view.querySelector('svg.km'), up = {}, down = {};
    edges.forEach(([a, b]) => { (up[b] = up[b] || []).push(a); (down[a] = down[a] || []).push(b); });
    const closure = (id, M) => { const out = new Set(), st = [id]; while (st.length) { const x = st.pop(); (M[x] || []).forEach((y) => { if (!out.has(y)) { out.add(y); st.push(y); } }); } return out; };
    const lit = (id) => {
      if (!id) { svg.classList.remove('hot'); svg.querySelectorAll('.on, .anc, .des').forEach((x) => x.classList.remove('on', 'anc', 'des')); return; }
      const a = closure(id, up), d = closure(id, down); svg.classList.add('hot');
      svg.querySelectorAll('.km-node').forEach((n) => { const k = n.dataset.id; n.classList.toggle('on', k === id); n.classList.toggle('anc', a.has(k)); n.classList.toggle('des', d.has(k)); });
      svg.querySelectorAll('.km-edges path').forEach((p) => { const A1 = p.dataset.a, B1 = p.dataset.b; p.classList.toggle('anc', B1 === id || a.has(B1)); p.classList.toggle('des', A1 === id || d.has(A1)); });
    };
    svg.addEventListener('pointerover', (e) => { const n = e.target.closest('.km-node'); lit(n ? n.dataset.id : null); });
    svg.addEventListener('pointerleave', () => lit(null));
    svg.addEventListener('focusin', (e) => { const n = e.target.closest('.km-node'); if (n) lit(n.dataset.id); });
    svg.addEventListener('focusout', () => lit(null));
  }
  WL.pages = WL.pages || {};
  WL.pages.kmap = { match: (h) => h === 'map' || h === 'map-maths', nav: 'map', render(h, view) { render(view, h === 'map-maths' ? 'maths' : 'physics'); } };
})();
/* generated by src/lec/meta.js — do not edit */
WL.lecMeta = [{"id":"calculus","title":"Calculus: the derivative and the integral","sub":"Two ideas, one theorem, and why they are the same idea seen from two sides","level":"A-level → Year 1 maths","topics":["m-differentiation","m-integration"],"secs":1910,"words":4092,"chapters":[["Before we start",0],["The area of a circle",184],["The paradox of the derivative",374],["Derivatives you can see",566],["Product and chain rules",835],["What derivatives are for",1020],["The integral: adding up tiny pieces",1253],["The fundamental theorem",1416],["Mistakes, limits, and a summary",1649]],"refs":[["3Blue1Brown","The essence of calculus (chapter 1 of the series)","https://www.3blue1brown.com/lessons/essence-of-calculus/"],["3Blue1Brown","All calculus lessons: derivatives, integrals, the fundamental theorem","https://3blue1brown.com/topics/calculus"],["MIT OCW 18.01 (David Jerison)","Lecture 1: Derivatives, slope, velocity, rate of change","https://www.ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/resources/lecture-1-derivatives"],["MIT OCW 18.01SC","Single Variable Calculus: lectures, worked examples and problem sets","https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010"]],"order":1},{"id":"shm","title":"Simple harmonic motion","sub":"Why so much of the universe wobbles, and how to calculate it","level":"A-level → Year 1","topics":["al-shm","y1-oscillators","al-damping"],"secs":1872,"words":3966,"chapters":[["Before we start",0],["Why everything wobbles",165],["The equation of motion",368],["The circle behind the wave",708],["Energy: where the motion goes",924],["Worked examples",1051],["The same equation everywhere",1398],["Where the model breaks",1615]],"refs":[["MIT OCW 8.03SC (Yen-Jie Lee)","Lecture 1: Periodic oscillations, harmonic oscillators","https://www.ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/lecture-1-video-1/"],["MIT OCW 8.03SC","Vibrations and Waves: all lectures and notes","https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/resource-index/"],["3Blue1Brown","Differential equations, studying the unsolvable (the pendulum and phase space)","https://www.3blue1brown.com/lessons/differential-equations"]],"order":2},{"id":"waves","title":"Waves: the wave equation and standing waves","sub":"How a shape travels, why it travels at √(T/μ), and why strings and pipes play only certain notes","level":"A-level → Year 1","topics":["y1-wave-eq","al-stationary","al-interference"],"secs":2004,"words":4208,"chapters":[["Before we start",0],["What a wave is",162],["The wave equation",322],["Numbers: strings and sound",543],["Sound, and a famous mistake",653],["Superposition",802],["Beats and the Doppler effect",949],["Standing waves",1112],["An exam classic: Melde's experiment",1360],["Pipes, and a worked comparison",1486],["Spreading out: intensity and decibels",1644],["Energy, reflection, and where it breaks",1770]],"refs":[["MIT OCW 8.03SC (Yen-Jie Lee)","Vibrations and Waves: travelling waves, standing waves, all lectures and notes","https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/resource-index/"],["MIT OCW 8.03SC","Course syllabus: from oscillators to waves and optics","https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/syllabus"],["3Blue1Brown","But what is a partial differential equation? and the heat-equation lessons","https://3blue1brown.com/topics/differential-equations"]],"order":3},{"id":"gauss","title":"Electric flux and Gauss's law","sub":"Counting field lines through a closed surface — and getting the field of a charge, a wire and a plate in one line each","level":"A-level → Year 1","topics":["y1-gauss","al-efields","gcse-static"],"secs":2001,"words":4203,"chapters":[["Before we start",0],["Fields and field lines",177],["Flux",340],["Gauss's law",509],["Two traps",684],["Spherical symmetry",813],["Cylindrical symmetry",1015],["Planar symmetry and the capacitor",1178],["Voltage, and gravity's version",1342],["Conductors",1532],["Gauss's law at a point: divergence",1662],["How sure are we?",1774]],"refs":[["MIT 8.02 (Walter Lewin)","Lecture 3: Electric flux, Gauss's law, examples (list of the 2002 lectures)","https://web.mit.edu/smcs/8.02/"],["MIT OCW 8.02 (Spring 2019)","Physics II: Electricity and Magnetism — course materials","https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"],["3Blue1Brown","Divergence and curl: the language of Maxwell's equations","https://www.3blue1brown.com/lessons/divergence-and-curl"]],"order":4},{"id":"faraday","title":"Faraday's law of induction","sub":"How a changing magnetic field makes a voltage — the idea behind every generator, transformer and wireless charger","level":"A-level → Year 1","topics":["al-induction","y1-faraday","gcse-induction"],"secs":1943,"words":4087,"chapters":[["Before we start",0],["Faraday's discovery",161],["Magnetic flux",258],["Faraday's law and Lenz's law",361],["Moving wires: motional EMF",568],["Reading the graphs: an exam favourite",719],["The generator",912],["Transformers and power lines",1078],["Motors, hobs and chargers",1269],["Self-inductance",1395],["The deep version: a curling electric field",1520],["Subtleties and a summary",1717]],"refs":[["MIT 8.02 (Walter Lewin)","Lecture 16: Electromagnetic induction, Faraday's law, Lenz's law; Lecture 17: motional EMF, dynamos, eddy currents","https://web.mit.edu/smcs/8.02/"],["MIT OCW 8.02 (Spring 2019)","Physics II: Electricity and Magnetism — course materials","https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"],["3Blue1Brown","Divergence and curl: the language of Maxwell's equations","https://www.3blue1brown.com/lessons/divergence-and-curl"]],"order":5},{"id":"relativity","title":"Special relativity","sub":"Two simple postulates, and why they force time to stretch, lengths to shrink, and E = mc²","level":"Year 1","topics":["y1-sr","y1-rel-dynamics"],"secs":1926,"words":4044,"chapters":[["Before we start",0],["Two postulates",174],["The light clock and time dilation",352],["The muon experiment",528],["Simultaneity is relative",748],["A paradox: the pole and the barn",857],["The Lorentz transformation",988],["Spacetime diagrams",1109],["Adding velocities",1283],["E = mc²",1456],["Your phone uses relativity",1712]],"refs":[["MIT OCW 8.20 (Markus Klute)","Introduction to Special Relativity: video lectures","https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2021/pages/video-lectures/"],["MIT OCW 8.20","Syllabus and reading list (French; Resnick)","https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2021/pages/syllabus/"]],"order":6},{"id":"schrodinger","title":"The Schrödinger equation","sub":"How matter waves are guessed, what ψ means, and how confinement creates energy levels","level":"Year 1 → Year 2","topics":["y2-schrodinger","y1-qm-intro","y2-qho"],"secs":1948,"words":4083,"chapters":[["Before we start",0],["Matter behaves like a wave",170],["Guessing the equation",306],["What ψ means",499],["Stationary states",628],["The particle in a box",744],["Uncertainty, and why atoms do not collapse",1052],["Leaky walls and real atoms",1193],["Tunnelling",1308],["The quantum harmonic oscillator",1478],["From quantum to classical",1610],["What the equation does not tell you",1733]],"refs":[["MIT OCW 8.04 (Allan Adams, 2013)","Quantum Physics I, Lecture 1 and the full video course","https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/resources/lecture-1/"],["MIT OCW 8.04 (Barton Zwiebach, 2016)","Quantum Physics I: video lectures, one-dimensional potentials","https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/video-lectures/"],["MIT OCW 8.05 (Zwiebach)","Lecture 1: Wave mechanics, the Schrödinger equation and stationary states","https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/resources/lecture-1-wave-mechanics"],["3Blue1Brown","Some light quantum mechanics (with minutephysics)","https://www.3blue1brown.com/lessons/light-quantum-mechanics"]],"order":7},{"id":"fourier","title":"Fourier: building anything from waves","sub":"Series, transforms, and why every sound, image and signal can be split into pure frequencies","level":"Year 1 → Year 2 maths","topics":["m-fourier-series","m-fourier-transform","y2-fourier"],"secs":1873,"words":3964,"chapters":[["Before we start",0],["Heat, and an outrageous claim",175],["Adding sine waves",397],["Finding the coefficients",548],["Two worked examples",680],["Circles: the complex form",1050],["Listening to frequencies",1207],["The Fourier transform",1337],["Uncertainty, again",1500],["Fourier everywhere, and its fine print",1622]],"refs":[["3Blue1Brown","But what is a Fourier series? From heat flow to drawing with circles","https://3blue1brown.com/lessons/fourier-series"],["3Blue1Brown","Solving the heat equation (the problem Fourier series were invented for)","https://www.3blue1brown.com/lessons/heat-equation"],["MIT OCW 18.03 (Arthur Mattuck)","Lecture 15: Introduction to Fourier series; basic formulas for period 2π","https://www.ocw.mit.edu/courses/18-03-differential-equations-spring-2010/resources/lecture-15-introduction-to-fourier-series"],["MIT OCW 18.03","Lecture 17: Particular solutions via Fourier series; hearing musical sounds","https://www.ocw.mit.edu/courses/18-03-differential-equations-spring-2010/resources/lecture-17-finding-particular-solutions-via-fourier-series"]],"order":8}];
/* Lectures: the #lectures list and the #lecture-<id> pages, plus a banner on matching topic pages.
   The player and the lecture texts (js/lectures.js, ~0.3 MB) load only when a lecture page opens. */
(function () {
  const WL = (window.WL = window.WL || {});
  WL.pages = WL.pages || {};
  const META = () => WL.lecMeta || [];
  const H = () => (WL.app && WL.app.h) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mins = (s) => Math.max(1, Math.round(s / 60));
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const pkey = () => { const A = WL.auth; return 'wl-lec-p' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const prog = (id) => { try { return (JSON.parse(localStorage.getItem(pkey()) || '{}') || {})[id] || null; } catch (e) { return null; } };
  let loadP = null;
  const load = () => {
    if (WL.lec && WL.lec.Player) return Promise.resolve();
    if (!loadP) loadP = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'js/lectures.js'; s.onload = () => res(); s.onerror = () => { loadP = null; rej(new Error('load')); }; document.head.appendChild(s); });
    return loadP;
  };
  const texWait = () => new Promise((res) => { const t0 = Date.now(); const go = () => (WL.texReady && WL.texReady()) || Date.now() - t0 > 10000 ? res() : setTimeout(go, 150); go(); });
  const byTopic = (tid) => META().filter((L) => (L.topics || []).includes(tid));
  const progBar = (L) => { const p = prog(L.id); if (!p) return ''; const f = p.done ? 1 : Math.min(1, (p.g || 0) / L.secs); return `<span class="lec-pg" title="${p.done ? 'Watched' : `${Math.round(f * 100)}% watched`}"><i style="width:${(f * 100).toFixed(0)}%"></i></span>`; };

  WL.lecIndex = {
    load,
    banner(tid) {
      return byTopic(tid).map((L) => `<a class="lec-banner" href="#lecture-${L.id}"><span class="lec-bk">Lecture · ${mins(L.secs)} min</span><b>${esc(L.title)}</b><span class="lec-bs">${esc(L.sub)}</span>${progBar(L)}</a>`).join('');
    }
  };

  /* a still from each lecture, drawn by the same engine */
  async function thumbs(root) {
    try { await load(); await texWait(); } catch (e) { return; }
    const draw = () => root.querySelectorAll('canvas[data-th]').forEach((cv) => {
      const spec = WL.lec.all[cv.dataset.th]; if (!spec || !cv.isConnected) return;
      const P = WL.lec.plan(spec), [si, tt] = spec.thumb || [1, 6], s = P.scenes[Math.min(si, P.scenes.length - 1)];
      const r = new WL.R(cv.getContext('2d'), { W: 960, H: 540, draw() {} }), c = cv.getContext('2d');
      c.setTransform(cv.width / 960, 0, 0, cv.height / 540, 0, 0); r.bg(); r.t = Math.min(tt, s.dur - 0.05); r.dt = 0;
      try { s.sc.draw(r, WL.lec.ctxS(s, r.t, r.t)); } catch (e) {}
    });
    draw(); setTimeout(draw, 900); setTimeout(draw, 2500);   // TeX is built on first use, so draw again once it is ready
  }

  WL.pages.lectures = {
    match: (h) => h === 'lectures', nav: 'lectures',
    render(h, view) {
      document.title = 'Lectures · Geodesic';
      const L = META(), total = L.reduce((n, x) => n + x.secs, 0);
      view.innerHTML = `<section class="lec-head">
          <h1>Lectures</h1>
          <p class="lede">Long lessons of about half an hour, drawn live and narrated, and built the way Feynman taught: each one opens with a puzzle about something you can see, and every chapter starts with the question it answers. Then come the words and symbols, a picture, a proper derivation, examples with real numbers and where the model breaks. Every chapter closes with a question to check yourself and a short recap, and the lecture ends by answering the opening puzzle. The style follows 3Blue1Brown's animations and MIT OpenCourseWare's lectures; both are linked at the end of every lecture.</p>
          <p class="lec-meta">${L.length} featured lectures · ${Math.round(total / 60)} minutes, and a lecture of ten minutes or more for every topic below</p></section>
        <h2 class="lec-sh">Featured lectures</h2>
        <div class="lec-grid">${L.map((x) => `<a class="lec-card" href="#lecture-${x.id}">
            <canvas class="lec-th" width="480" height="270" data-th="${x.id}" aria-hidden="true"></canvas>
            <span class="lec-cb"><b>${esc(x.title)}</b><span>${esc(x.sub)}</span><small>${mins(x.secs)} min · ${esc(x.level)} · ${x.chapters.length} chapters</small>${progBar(x)}</span></a>`).join('')}</div>${WL.tlec ? WL.tlec.indexHTML() : ''}`;
      thumbs(view);
    }
  };

  WL.pages.lecture = {
    match: (h) => /^lecture-[a-z0-9-]+$/.test(h), nav: 'lectures',
    render(h, view) {
      const id = h.slice(8), M = META().find((x) => x.id === id);
      if (!M) { view.innerHTML = `<section class="lec-head"><p class="crumb"><a href="#lectures">Lectures</a></p><h1>Lecture not found</h1><p>Choose one from the <a href="#lectures">list of lectures</a>.</p></section>`; return; }
      document.title = `${M.title} · Lectures · Geodesic`;
      const nodes = H().nodes || {};
      const topics = (M.topics || []).filter((t) => nodes[t]);
      view.innerHTML = `<section class="lec-head lec-head-p"><p class="crumb"><a href="#lectures">Lectures</a></p><h1>${esc(M.title)}</h1><p class="lede">${esc(M.sub)}</p>
          <p class="lec-meta">${mins(M.secs)} min · ${esc(M.level)} · ${M.chapters.length} chapters</p></section>
        <div class="lec-host" id="lec-host"><div class="lec-loading">Loading the lecture…</div></div>
        <div class="lec-cols">
          <section class="lec-chs"><h2>Chapters</h2><ol>${M.chapters.map(([t, g], i) => `<li><button type="button" data-g="${g}" data-ci="${i}"><span>${mmss(g)}</span>${esc(t)}</button></li>`).join('')}</ol></section>
          <aside class="lec-aside">
            ${topics.length ? `<h2>On this site</h2><ul class="lec-tops">${topics.map((t) => `<li><a href="#t-${t}">${esc(nodes[t].title)}</a></li>`).join('')}</ul>` : ''}
            <h2>Further watching</h2><ul class="lec-refs">${(M.refs || []).map(([who, title, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a><small>${esc(who)}</small></li>`).join('')}</ul>
            <h2>Keys</h2><p class="lec-keys"><kbd>Space</kbd> play or pause<br><kbd>←</kbd> <kbd>→</kbd> 10 seconds back or on<br><kbd>[</kbd> <kbd>]</kbd> previous or next chapter<br><kbd>C</kbd> captions, <kbd>F</kbd> full screen</p>
          </aside>
        </div>
        <details class="lec-tr"><summary>Transcript</summary><div id="lec-tr"><p class="muted">The transcript appears once the lecture has loaded.</p></div></details>`;
      const host = view.querySelector('#lec-host');
      load().then(() => {
        const spec = WL.lec.all[id]; if (!spec) throw new Error('missing');
        if (!view.contains(host)) return;
        let cur = -1;
        const P = new WL.lec.Player(host, spec, {
          onTime(g) {
            let ci = 0; M.chapters.forEach(([, g0], i) => { if (g >= g0 - 0.01) ci = i; });
            if (ci !== cur) { cur = ci; view.querySelectorAll('.lec-chs [data-ci]').forEach((b) => b.setAttribute('aria-current', +b.dataset.ci === ci ? 'true' : 'false')); }
          }
        });
        const keys = (e) => { if (!document.body.contains(host)) return; if (e.altKey || e.ctrlKey || e.metaKey) return; if (P.key(e)) e.preventDefault(); };
        document.addEventListener('keydown', keys);
        window.addEventListener('hashchange', () => { P.kill(); document.removeEventListener('keydown', keys); }, { once: true });
        view.onclick = (e) => { const b = e.target.closest('[data-g]'); if (b) { P.seekG(+b.dataset.g); P.play(); host.scrollIntoView({ block: 'nearest', behavior: WL.reduced ? 'auto' : 'smooth' }); } };
        const PL = WL.lec.plan(spec);
        view.querySelector('#lec-tr').innerHTML = PL.chapters.map((c, i) => `<h3>${i + 1}. ${esc(c.title)}</h3><p>${PL.scenes.slice(c.s0, i + 1 < PL.chapters.length ? PL.chapters[i + 1].s0 : PL.scenes.length).map((s) => s.T.filter(Boolean).map(esc).join(' ')).join('</p><p>')}</p>`).join('');
      }).catch(() => { host.innerHTML = '<p class="lec-err">The lecture could not be loaded. Check your connection, then reload the page.</p>'; });
    }
  };
})();
/* Geodesic — My mistakes (#mistakes). Every practice question answered wrongly or only partly right is kept, with what
   was written and the feedback. Each one comes back after a day; got right, it comes back after 3 days, then 7; right
   three times in a row, it is fixed. Answering it correctly on the topic page counts too.
   Stored in this browser, per account (wl-mist). Nothing here is sent anywhere except the answer being checked. */
(function () {
  const WL = (window.WL = window.WL || {});
  const DAY = 864e5, GAPS = [1, 3, 7], FIX = 3;
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H().pr ? H().pr(s) : esc(s));
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const KEY = () => 'wl-mist' + user();
  let cache = null, cacheK = '';
  function load() {
    const k = KEY(); if (cache && cacheK === k) return cache;
    let d = null; try { d = JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) {}
    cacheK = k; cache = d && d.m ? d : { v: 1, m: {}, seeded: 0 };
    if (!cache.seeded) seed();
    return cache;
  }
  const save = () => { try { localStorage.setItem(cacheK, JSON.stringify(cache)); } catch (e) {} window.dispatchEvent(new Event('wl-mist')); };
  /* the first time: take the mistakes already in the practice record */
  function seed() {
    cache.seeded = Date.now();
    const LS = H().LS ? H().LS() : null, A = (LS && LS.a) || {}, now = Date.now();
    Object.keys(A).forEach((tid) => { if (!N()[tid]) return; Object.entries(A[tid] || {}).forEach(([key, rec]) => {
      if (!rec || !rec.v || rec.v === 'correct' || /^(pre|recall|endless)$/.test(key)) return;
      const p = H().getProb ? H().getProb(tid, key) : null; if (!p || !p.q) return;
      cache.m[tid + '|' + key] = { tid, key, q: String(p.q).slice(0, 600), t: rec.t || '', v: rec.v, fb: rec.fb || '', note: rec.note || '', via: rec.via || '', at: rec.at || now, last: rec.at || now, due: Math.max(now, (rec.at || now) + DAY), n: 0, miss: 1, fixed: 0, src: 'practice' };
    }); });
    save();
  }
  const gapDays = (n) => (WL.study && WL.study.gap ? WL.study.gap(GAPS[Math.min(n, GAPS.length - 1)]) : GAPS[Math.min(n, GAPS.length - 1)]);
  /* called whenever an answer is checked */
  function note(tid, key, rec, p, src) {
    if (!rec || !tid || key == null) return; key = String(key);
    const D = load(), id = tid + '|' + key, e = D.m[id], now = Date.now();
    if (rec.v === 'correct') {
      if (!e || e.fixed) return;
      e.n = (e.n || 0) + 1; e.last = now;
      if (e.n >= FIX) e.fixed = now; else e.due = now + gapDays(e.n) * DAY;
      save(); return;
    }
    const q = p && p.q ? String(p.q).slice(0, 600) : (e && e.q) || '';
    D.m[id] = Object.assign(e || { tid, key, at: now, miss: 0 }, { q, t: rec.t || '', v: rec.v, fb: rec.fb || '', note: rec.note || '', via: rec.via || '', last: now, due: now + DAY, n: 0, fixed: 0, src: src || 'practice' });
    D.m[id].miss = (D.m[id].miss || 0) + 1;
    save();
  }
  const all = () => Object.values(load().m).filter((e) => N()[e.tid]);
  const open = () => all().filter((e) => !e.fixed);
  const dueNow = () => open().filter((e) => e.due <= Date.now());
  const countDue = () => dueNow().length;
  function topicLine(tid) {
    const L = open().filter((e) => e.tid === tid); if (!L.length) return '';
    const d = L.filter((e) => e.due <= Date.now()).length;
    return `<a class="mk-line" href="#mistakes-${tid}"><b>${L.length} question${L.length === 1 ? '' : 's'} from this topic ${L.length === 1 ? 'is' : 'are'} in your mistakes notebook</b><span>${d ? `${d} ready to try again now` : 'They come back when they are due'}</span></a>`;
  }
  const ago = (t) => { const d = Math.round((Date.now() - t) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
  const inDays = (t) => { const d = Math.ceil((t - Date.now()) / DAY); return d <= 0 ? 'now' : d === 1 ? 'tomorrow' : `in ${d} days`; };

  function card(e) {
    const n = N()[e.tid], h = H(), st = h.stageOf ? h.stageOf(e.tid) || {} : {}, p = h.getProb ? h.getProb(e.tid, e.key) : null;
    const q = p && p.q ? p.q : e.q, kind = p && WL.grade ? WL.grade.kind(p) : 'written';
    const was = e.t || e.fb ? `<details class="mk-was"><summary>What you wrote ${ago(e.last)}</summary>${e.t ? `<p class="mk-t">${esc(e.t)}</p>` : '<p class="mk-t muted">You marked it “Not yet” in a review.</p>'}${h.fbHTML && e.v ? `<div class="mk-oldfb">${h.fbHTML({ v: e.v, fb: e.fb, note: e.note, via: e.via })}</div>` : ''}</details>` : '';
    const sol = p ? `${p.a ? `<p class="pans"><b>Answer</b> ${pr(p.a)}</p>` : ''}${p.s && p.s.length ? `<ol class="psol">${p.s.map((x) => `<li>${pr(x)}</li>`).join('')}</ol>` : ''}` : '';
    return `<article class="mk-card" data-mk="${esc(e.tid + '|' + e.key)}" style="--lane:${h.strandOf ? h.strandOf(e.tid).colour : '#58C4DD'}">
      <p class="mk-top"><a href="#t-${e.tid}">${esc(n.title)}</a><span>${esc(st.short || '')}</span><span>missed ${e.miss || 1}×</span>${e.n ? `<span class="mk-streak">${e.n} of ${FIX} right since</span>` : ''}</p>
      <div class="mk-q">${pr(q)}</div>${was}
      ${p ? `<label class="vh" for="mk-${esc(e.tid + e.key)}">Your new answer</label><textarea id="mk-${esc(e.tid + e.key)}" rows="${kind === 'written' ? 3 : 1}" placeholder="${kind === 'written' ? 'Try it again in your own words' : 'Try it again, with units'}"></textarea>
      <div class="mk-act"><button type="button" class="btn small primary" data-mk-check>Check</button>${sol ? '<button type="button" class="btn small ghost" data-mk-sol aria-expanded="false">Show the solution</button>' : ''}<a class="btn small ghost" href="#t-${e.tid}">Open the topic</a><button type="button" class="linkbtn mk-drop" data-mk-drop>Remove from the notebook</button></div>
      <div class="mk-fb" role="status" aria-live="polite" hidden></div><div class="mk-sol" hidden>${sol}</div>` : `<p class="muted">This question is no longer on the site. <button type="button" class="linkbtn" data-mk-drop>Remove it</button></p>`}
    </article>`;
  }
  function render(view, only) {
    const h = H();
    const L = all().filter((e) => !only || e.tid === only), now = Date.now();
    const due = L.filter((e) => !e.fixed && e.due <= now).sort((a, b) => a.due - b.due), later = L.filter((e) => !e.fixed && e.due > now).sort((a, b) => a.due - b.due), fixed = L.filter((e) => e.fixed).sort((a, b) => b.fixed - a.fixed);
    const n = only ? N()[only] : null;
    document.title = (n ? `Mistakes: ${n.title}` : 'My mistakes') + ' · Geodesic';
    view.innerHTML = `<section class="mk-head"><p class="crumb">${n ? `<a href="#mistakes">My mistakes</a> › ${esc(n.title)}` : '<a href="#home">Home</a>'}</p><h1>${n ? esc(n.title) + ': mistakes' : 'My mistakes'}</h1>
        <p class="lede">Every question you got wrong or only partly right is kept here with what you wrote. It comes back after a day; get it right and it comes back after 3 days, then 7. Right three times in a row and it moves to Fixed. Mistakes you return to are among the quickest things to learn from.</p>
        <p class="mk-stats"><span><b>${due.length}</b> ready now</span><span><b>${later.length}</b> coming back later</span><span><b>${fixed.length}</b> fixed</span></p></section>
      ${due.length ? `<h2 class="mk-h">Ready to try again</h2><div class="mk-list">${due.map(card).join('')}</div>` : `<div class="mk-empty"><b>${L.length ? 'Nothing is due right now.' : 'No mistakes yet.'}</b><span>${L.length ? 'The next one comes back ' + (later[0] ? inDays(later[0].due) : 'later') + '.' : 'Answer practice questions on any topic: the ones you miss are collected here automatically.'}</span>${L.length ? '' : '<a class="btn small primary" href="#physics">Choose a topic</a>'}</div>`}
      ${later.length ? `<h2 class="mk-h">Coming back later</h2><ul class="mk-later">${later.map((e) => `<li><a href="#t-${e.tid}">${esc(N()[e.tid].title)}</a><span class="mk-snip">${esc(String(e.q).replace(/\$[^$]*\$/g, '…').slice(0, 110))}${String(e.q).length > 110 ? '…' : ''}</span><small>${inDays(e.due)}</small><button type="button" class="linkbtn" data-mk-now="${esc(e.tid + '|' + e.key)}">Try it now</button></li>`).join('')}</ul>` : ''}
      ${fixed.length ? `<details class="mk-fixed"><summary>Fixed (${fixed.length})</summary><ul class="mk-later">${fixed.map((e) => `<li><a href="#t-${e.tid}">${esc(N()[e.tid].title)}</a><span class="mk-snip">${esc(String(e.q).replace(/\$[^$]*\$/g, '…').slice(0, 110))}</span><small>fixed ${ago(e.fixed)}</small></li>`).join('')}</ul></details>` : ''}`;
    if (h.typeset) h.typeset(view);
    view.onclick = async (ev) => {
      const t = ev.target, c = t.closest('.mk-card'), id = c && c.dataset.mk;
      const nowB = t.closest('[data-mk-now]'); if (nowB) { const e = load().m[nowB.dataset.mkNow]; if (e) { e.due = Date.now(); save(); render(view, only); } return; }
      if (!c) return;
      const e = load().m[id]; if (!e) return;
      if (t.closest('[data-discuss]') && WL.tutor && h.tutorTopic) { const p = h.getProb(e.tid, e.key); if (p) WL.tutor.open({ topic: h.tutorTopic(N()[e.tid]), chip: h.probChip ? h.probChip(p, 'from your mistakes notebook', { t: e.t, v: e.v, fb: e.fb }) : null }); return; }
      if (t.closest('[data-mk-drop]')) { delete load().m[id]; save(); c.remove(); return; }
      if (t.closest('[data-mk-sol]')) { const b = t.closest('[data-mk-sol]'), s = c.querySelector('.mk-sol'), o = s.hidden; s.hidden = !o; b.setAttribute('aria-expanded', o); b.textContent = o ? 'Hide the solution' : 'Show the solution'; if (o && h.typeset) h.typeset(s); return; }
      if (t.closest('[data-mk-check]')) {
        const ta = c.querySelector('textarea'), ans = ta.value.trim(), fb = c.querySelector('.mk-fb'), btn = t.closest('[data-mk-check]'); if (!ans) { ta.focus(); return; }
        const p = h.getProb(e.tid, e.key); if (!p || !WL.grade) return;
        btn.disabled = true; btn.textContent = 'Checking'; fb.hidden = false; fb.innerHTML = '<div class="fbh"><span class="spin" aria-hidden="true"></span><b>Checking your answer</b></div>';
        let rec;
        try { const r = await WL.grade.check(p, ans, { topic: N()[e.tid].title + ' (' + ((h.stageOf(e.tid) || {}).name || '') + ')' }); rec = { t: ans.slice(0, 2000), v: r.verdict, fb: r.feedback || '', note: r.note || '', found: r.found || [], missing: r.missing || [], via: r.via, at: Date.now() }; }
        catch (er) { rec = { t: ans.slice(0, 2000), v: 'incorrect', fb: '', note: (er && er.message) || 'Could not check the answer.', found: [], missing: [], via: 'keywords', at: Date.now() }; }
        if (!h.isGenKey(e.key)) { h.saveAns(e.tid, e.key, rec); if (!h.isMoreKey(e.key)) h.markP(e.tid, e.key, rec.v === 'correct'); }
        note(e.tid, e.key, rec, p, e.src);
        const x = load().m[id], next = x.fixed ? 'Fixed: three right in a row. It moves out of the notebook.' : rec.v === 'correct' ? `Right. It comes back ${inDays(x.due)} to make sure it sticks.` : 'Not yet. It comes back tomorrow. Open the solution and compare it with yours line by line.';
        fb.innerHTML = (h.fbHTML ? h.fbHTML(rec) : '') + `<p class="mk-next">${next}</p>`; if (h.typeset) h.typeset(fb);
        c.classList.add(rec.v === 'correct' ? 'is-correct' : 'is-' + rec.v);
        btn.disabled = false; btn.textContent = 'Check';
      }
    };
  }
  /* the count beside the menu item */
  const badge = () => { const b = document.getElementById('mk-due'); if (!b) return; let k = 0; try { k = countDue(); } catch (e) {} b.textContent = k || ''; b.hidden = !k; };
  window.addEventListener('wl-mist', badge); window.addEventListener('hashchange', badge); setTimeout(badge, 1500);
  WL.pages = WL.pages || {};
  WL.pages.mistakes = { match: (h) => h === 'mistakes' || /^mistakes-[a-z0-9-]+$/.test(h), nav: 'mistakes', render(h, view) { render(view, h.startsWith('mistakes-') ? h.slice(9) : null); } };
  const nextDue = () => { const t = Date.now(), L = open().filter((e) => e.due > t).map((e) => e.due); return L.length ? Math.min(...L) : 0; };
  WL.mistakes = { note, countDue, open, all, topicLine, load, due: () => dueNow().sort((a, b) => a.due - b.due), nextDue };
})();
/* Geodesic — entrance music. A short orchestral swell, synthesised live with the Web Audio API (no audio files and no
   AI audio). It plays when the visitor enters from the black hole screen: a low drone, strings in D minor, heartbeat
   thumps and a rising whoosh build while the camera falls towards the hole; as the site appears, a deep impact and a
   low brass hit open into a bright D-major chord with choir and shimmer, and a long reverberant tail (about 12 s).
   Browsers allow sound only after a click or key press, which is exactly when it starts. The speaker button on the
   black hole screen turns it off, remembered in this browser. WL.music.compose also renders offline, for previews. */
(function () {
  const WL = (window.WL = window.WL || {});
  const KEY = 'geo-music', AC = window.AudioContext || window.webkitAudioContext;
  const isOn = () => { try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } };
  let ctx = null;
  function unlock() {
    if (!AC || !isOn()) return null;
    if (!ctx) { try { ctx = new AC({ latencyHint: 'playback' }); } catch (e) { return null; } }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function noiseBuf(c, secs) { const n = Math.max(1, Math.round(c.sampleRate * secs)), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
  function hall(c, secs, decay) {
    const n = Math.round(c.sampleRate * secs), b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay) * (i < c.sampleRate * 0.012 ? i / (c.sampleRate * 0.012) : 1); }
    return b;
  }
  function softClip(k) { const n = 2048, cv = new Float32Array(n); for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; cv[i] = Math.tanh(k * x) / Math.tanh(k); } return cv; }

  /* the score: c is an AudioContext or OfflineAudioContext, T0 the start time, hit the seconds until the site appears */
  function compose(c, T0, hit, out, vol = 0.8) {
    const H = T0 + hit, END = H + 9.2, ramp = (p, pts) => { p.setValueAtTime(pts[0][1], pts[0][0]); pts.slice(1).forEach(([t, v, lin]) => (lin ? p.linearRampToValueAtTime(v, t) : p.exponentialRampToValueAtTime(Math.max(v, 1e-4), t))); };
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.35;
    const master = c.createGain(); ramp(master.gain, [[T0, vol], [END - 1.5, vol, 1], [END, 1e-4]]); comp.connect(master); master.connect(out);
    const verb = c.createConvolver(); verb.buffer = hall(c, 4.2, 2.4); const wet = c.createGain(); wet.gain.value = 0.5; verb.connect(wet); wet.connect(comp);
    const lane = (send = 0.5, pan = 0) => { const g = c.createGain(), dry = c.createGain(), s = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null; dry.gain.value = 1; s.gain.value = send; if (p) { p.pan.value = pan; g.connect(p); p.connect(dry); p.connect(s); } else { g.connect(dry); g.connect(s); } dry.connect(comp); s.connect(verb); return g; };
    const osc = (type, f, t0, t1, dest, det = 0) => { const o = c.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.connect(dest); o.start(t0); o.stop(t1); return o; };
    const noise = (t0, t1, dest) => { const s = c.createBufferSource(); s.buffer = noiseBuf(c, t1 - t0 + 0.1); s.connect(dest); s.start(t0); s.stop(t1); return s; };
    const vib = c.createOscillator(); vib.frequency.value = 4.6; const vibG = c.createGain(); vibG.gain.value = 5; vib.connect(vibG); vib.start(T0); vib.stop(END);
    const long = hit >= 2;

    /* 1. sub drone on D, from the click to the end */
    const sub = lane(0.15); ramp(sub.gain, [[T0, 1e-4], [T0 + Math.min(2, hit), 0.26, 1], [H + 4, 0.2, 1], [END - 0.5, 1e-4]]);
    osc('sine', hz(26), T0, END, sub); osc('sine', hz(38), T0, END, sub);
    /* 2. strings in D minor, the filter opening as the camera falls */
    const sf = c.createBiquadFilter(); sf.type = 'lowpass'; sf.Q.value = 0.7; ramp(sf.frequency, [[T0, 320], [H, long ? 2800 : 1400]]);
    const sg = lane(0.55); sf.connect(sg); ramp(sg.gain, [[T0, 1e-4], [T0 + 0.15, 0.012, 1], [H - 0.05, long ? 0.15 : 0.08], [H + 0.35, 1e-4]]);
    [50, 53, 57, 62].forEach((m, i) => { [-9, 9].forEach((d, j) => { const pn = c.createStereoPanner ? c.createStereoPanner() : null; const o = osc('sawtooth', hz(m), T0, H + 0.4, pn || sf, d + (i - 1.5) * 2); vibG.connect(o.detune); if (pn) { pn.pan.value = j ? 0.45 : -0.45; pn.connect(sf); } }); });
    /* 3. heartbeat thumps and 4. a rising whoosh, only when there is time to build */
    if (long) {
      [0.28, 0.55, 0.8].forEach((f, i) => { const t = T0 + hit * f; const g = lane(0.25); ramp(g.gain, [[t, 1e-4], [t + 0.012, 0.42 + 0.14 * i, 1], [t + 0.5, 1e-4]]); const o = osc('sine', 62, t, t + 0.6, g); ramp(o.frequency, [[t, 64], [t + 0.3, 36]]); });
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.5; ramp(bp.frequency, [[T0 + 0.3, 260], [H - 0.02, 5200]]);
      const rg = lane(0.6); bp.connect(rg); ramp(rg.gain, [[T0 + 0.3, 1e-4], [H - 0.06, 0.16], [H + 0.04, 1e-4]]); noise(T0 + 0.3, H + 0.1, bp);
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5200; const cg = lane(0.5); hp.connect(cg); ramp(cg.gain, [[H - 1.4, 1e-4], [H - 0.02, 0.07], [H + 0.03, 1e-4]]); noise(H - 1.4, H + 0.05, hp);
    }
    /* 5. the impact as the site appears: a falling boom and a burst of low noise */
    const bg = lane(0.35); ramp(bg.gain, [[H, 1e-4], [H + 0.008, 0.95, 1], [H + 2.4, 1e-4]]); const bo = osc('sine', 120, H, H + 2.5, bg); ramp(bo.frequency, [[H, 125], [H + 0.75, 41]]);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; const ng = lane(0.4); lp.connect(ng); ramp(ng.gain, [[H, 1e-4], [H + 0.005, 0.45, 1], [H + 0.45, 1e-4]]); noise(H, H + 0.5, lp);
    /* 6. low brass hit, gently distorted */
    const ws = c.createWaveShaper(); ws.curve = softClip(2.6); ws.oversample = '2x';
    const bf = c.createBiquadFilter(); bf.type = 'lowpass'; bf.Q.value = 1.1; ramp(bf.frequency, [[H, 380], [H + 0.16, 1500], [H + 3.2, 620]]);
    const brg = lane(0.5); ws.connect(bf); bf.connect(brg); ramp(brg.gain, [[H, 1e-4], [H + 0.04, 0.2, 1], [H + 2.6, 0.09], [H + 6.5, 1e-4]]);
    [[38, -6], [38, 6], [45, 0], [50, -4], [50, 4]].forEach(([m, d]) => osc('sawtooth', hz(m), H, H + 6.6, ws, d));
    /* 7. the bright D-major chord: brass and strings, with a slow vibrato */
    const cf = c.createBiquadFilter(); cf.type = 'lowpass'; cf.Q.value = 0.5; ramp(cf.frequency, [[H, 900], [H + 1.2, 2600], [END, 1500]]);
    const cg2 = lane(0.6); cf.connect(cg2); ramp(cg2.gain, [[H, 1e-4], [H + 0.7, 0.13, 1], [H + 4.6, 0.11, 1], [END - 0.3, 1e-4]]);
    [50, 57, 62, 66, 69, 74].forEach((m, i) => { [-7, 7].forEach((d, j) => { const pn = c.createStereoPanner ? c.createStereoPanner() : null; const o = osc('sawtooth', hz(m), H, END, pn || cf, d); vibG.connect(o.detune); if (pn) { pn.pan.value = (j ? 1 : -1) * (0.2 + 0.08 * i); pn.connect(cf); } }); });
    /* 8. choir-like air and 9. a high shimmer, mostly in the reverb */
    const ch = lane(0.9, 0); ramp(ch.gain, [[H + 0.2, 1e-4], [H + 1.8, 0.05, 1], [H + 5.5, 0.04, 1], [END - 0.2, 1e-4]]);
    [74, 78, 81].forEach((m, i) => { const o = osc('triangle', hz(m), H + 0.2, END, ch, (i - 1) * 5); vibG.connect(o.detune); });
    const sh = lane(1, 0); ramp(sh.gain, [[H + 0.8, 1e-4], [H + 2.2, 0.016, 1], [END - 1, 1e-4]]);
    const trem = c.createOscillator(); trem.frequency.value = 6.2; const tg = c.createGain(); tg.gain.value = 0.006; trem.connect(tg); tg.connect(sh.gain); trem.start(H + 0.8); trem.stop(END);
    [86, 93].forEach((m) => osc('sine', hz(m), H + 0.8, END, sh));
    return END;
  }
  let playing = null;
  function entrance(hit) {
    const c = unlock(); if (!c) return;
    if (playing) { try { playing.gain.setTargetAtTime(0, c.currentTime, 0.1); } catch (e) {} }
    const out = c.createGain(); out.connect(c.destination); playing = out;
    try { compose(c, c.currentTime + 0.05, Math.max(0.4, hit || 3.6), out); } catch (e) {}
    setTimeout(() => { try { out.disconnect(); } catch (e) {} if (playing === out) playing = null; }, (hit + 11) * 1000);
  }
  /* the speaker button on the black hole screen */
  function wire() {
    const b = document.getElementById('gate-sound'); if (!b || b.dataset.w) return; b.dataset.w = '1';
    const show = () => { const on = isOn(); b.setAttribute('aria-pressed', on); b.title = on ? 'Music when you enter: on' : 'Music when you enter: off'; b.classList.toggle('off', !on); };
    b.addEventListener('click', () => { try { localStorage.setItem(KEY, isOn() ? 'off' : 'on'); } catch (e) {} if (!isOn() && playing && ctx) { try { playing.gain.setTargetAtTime(0, ctx.currentTime, 0.08); } catch (e) {} } show(); });
    show();
  }
  /* create the audio context inside the visitor's own click or key press, so that it is allowed to play */
  document.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest('#gate') && !e.target.closest('#gate-sound')) unlock(); }, true);
  document.addEventListener('submit', (e) => { if (e.target && e.target.id === 'gate-form') unlock(); }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
  WL.music = { entrance, compose, isOn, unlock };
})();
/* Geodesic — narration extras: equations read aloud (TeX to words), and the derivation read step by step. */
(function () {
  const WL = (window.WL = window.WL || {});
  const GREEK = { alpha: 'alpha', beta: 'beta', gamma: 'gamma', Gamma: 'capital gamma', delta: 'delta', Delta: 'delta', epsilon: 'epsilon', varepsilon: 'epsilon', zeta: 'zeta', eta: 'eta', theta: 'theta', vartheta: 'theta', Theta: 'capital theta', iota: 'iota', kappa: 'kappa', lambda: 'lambda', Lambda: 'capital lambda', mu: 'mu', nu: 'nu', xi: 'xi', Xi: 'capital xi', pi: 'pi', Pi: 'capital pi', rho: 'rho', varrho: 'rho', sigma: 'sigma', Sigma: 'capital sigma', tau: 'tau', upsilon: 'upsilon', phi: 'phi', varphi: 'phi', Phi: 'capital phi', chi: 'chi', psi: 'psi', Psi: 'capital psi', omega: 'omega', Omega: 'capital omega', ell: 'l', hbar: 'h-bar', infty: 'infinity', partial: 'partial', nabla: 'del' };
  const REL = { '=': ' equals ', '\\approx': ' is approximately ', '\\simeq': ' is approximately ', '\\sim': ' is of order ', '\\ne': ' is not equal to ', '\\neq': ' is not equal to ', '\\le': ' is at most ', '\\leq': ' is at most ', '\\ge': ' is at least ', '\\geq': ' is at least ', '<': ' is less than ', '>': ' is greater than ', '\\propto': ' is proportional to ', '\\equiv': ' is defined as ', '\\to': ' tends to ', '\\rightarrow': ' goes to ', '\\Rightarrow': ', which gives ', '\\Longrightarrow': ', which gives ', '\\implies': ', which gives ', '\\iff': ' exactly when ', '\\times': ' times ', '\\cdot': ' times ', '\\pm': ' plus or minus ', '\\mp': ' minus or plus ', '+': ' plus ', '-': ' minus ', '−': ' minus ' };
  const FN = { sin: 'sine', cos: 'cos', tan: 'tan', sinh: 'shine', cosh: 'cosh', tanh: 'than', ln: 'log', log: 'log', exp: 'exp', det: 'the determinant of', max: 'max', min: 'min', lim: 'the limit', arcsin: 'arc sine', arccos: 'arc cos', arctan: 'arc tan' };
  function group(s, i) { // the {...} or single token starting at s[i]; returns [content, next index]
    while (s[i] === ' ') i++;
    if (s[i] === '{') { let d = 0, j = i; for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } } return [s.slice(i + 1, j), j + 1]; }
    if (s[i] === '\\') { const m = s.slice(i).match(/^\\[A-Za-z]+/); if (m) return [m[0], i + m[0].length]; return [s.slice(i, i + 2), i + 2]; }
    return [s[i] || '', i + 1];
  }
  const POW = (p) => { const t = p.trim(); if (t === '2') return ' squared'; if (t === '3') return ' cubed'; if (t === '-1' || t === '−1') return ' inverse'; if (t === '\\prime' || t === "'") return ' prime'; if (t === '1/2' || t === '\\frac{1}{2}' || t === '\\tfrac12' || t === '\\tfrac{1}{2}') return ' to the half'; return ' to the ' + conv(t); };
  function conv(s) {
    s = String(s || '');
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === '\\') {
        const m = s.slice(i).match(/^\\([A-Za-z]+|.)/), cmd = m[1]; i += m[0].length;
        if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
          let a, b; [a, i] = group(s, i); [b, i] = group(s, i);
          if (/^\s*(d|\\partial)/.test(a) && /^\s*(d|\\partial)/.test(b)) { out += ` ${conv(a)} by ${conv(b)} `; continue; }
          const A = conv(a).trim(), B = conv(b).trim(); if (A === '1' && B === '2') { out += ' a half '; continue; }
          out += (A.split(' ').length + B.split(' ').length <= 4) ? ` ${A} over ${B} ` : ` the fraction ${A}, over ${B}, `; continue;
        }
        if (cmd === 'sqrt') { let n = null; if (s[i] === '[') { const j = s.indexOf(']', i); n = s.slice(i + 1, j); i = j + 1; } let a; [a, i] = group(s, i); out += n ? ` the ${conv(n).trim()}th root of ${conv(a)} ` : ` the square root of ${conv(a)} `; continue; }
        if (cmd === 'text' || cmd === 'mathrm' || cmd === 'textrm' || cmd === 'operatorname' || cmd === 'mathbf' || cmd === 'boldsymbol' || cmd === 'vec' || cmd === 'mathcal' || cmd === 'mathit' || cmd === 'bm') { let a; [a, i] = group(s, i); out += ' ' + (cmd === 'text' || cmd === 'textrm' ? a : conv(a)) + ' '; continue; }
        if (cmd === 'hat' || cmd === 'bar' || cmd === 'dot' || cmd === 'ddot' || cmd === 'tilde' || cmd === 'overline') { let a; [a, i] = group(s, i); out += ` ${conv(a)} ${{ hat: 'hat', bar: 'bar', dot: 'dot', ddot: 'double-dot', tilde: 'tilde', overline: 'bar' }[cmd]} `; continue; }
        if (cmd === 'int' || cmd === 'oint' || cmd === 'iint') { let lo = '', hi = ''; for (let k = 0; k < 2; k++) { if (s[i] === '_') [lo, i] = group(s, i + 1); else if (s[i] === '^') [hi, i] = group(s, i + 1); } out += lo || hi ? ` the integral from ${conv(lo)} to ${conv(hi)} of ` : cmd === 'oint' ? ' the closed integral of ' : ' the integral of '; continue; }
        if (cmd === 'sum' || cmd === 'prod') { let lo = '', hi = ''; for (let k = 0; k < 2; k++) { if (s[i] === '_') [lo, i] = group(s, i + 1); else if (s[i] === '^') [hi, i] = group(s, i + 1); } out += ` the ${cmd === 'sum' ? 'sum' : 'product'}${lo ? ' over ' + conv(lo) : ''}${hi ? ' to ' + conv(hi) : ''} of `; continue; }
        if (cmd === 'langle') { out += ' the average of '; continue; }
        if (cmd === 'rangle') { out += ' '; continue; }
        if (GREEK[cmd]) { out += ' ' + GREEK[cmd] + ' '; continue; }
        if (FN[cmd]) { out += ' ' + FN[cmd] + ' '; continue; }
        if (REL['\\' + cmd]) { out += REL['\\' + cmd]; continue; }
        if (/^(left|right|big|Big|bigg|Bigg|displaystyle|quad|qquad|,|;|:|!| |limits|nolimits|mathstrut|phantom)$/.test(cmd)) { out += cmd === 'quad' || cmd === 'qquad' ? ', ' : ' '; continue; }
        if (cmd === '\\') { out += ', '; continue; }
        if (cmd === 'cdots' || cmd === 'ldots' || cmd === 'dots') { out += ' and so on '; continue; }
        out += ' '; continue;
      }
      if (c === '^') { let a; [a, i] = group(s, i + 1); out += POW(a); continue; }
      if (c === '_') { let a; [a, i] = group(s, i + 1); const raw = a.trim(), t = conv(a).trim(); out += raw === '0' ? ' nought' : /^\d+$/.test(raw) ? ' ' + t : /^[A-Za-z]$/.test(raw) ? ' sub ' + t : ' ' + t; continue; }
      if (c === '{' || c === '}') { i++; continue; }
      if (c === '(') { out += ' '; i++; continue; }
      if (c === ')') { out += ' '; i++; continue; }
      if (c === '/') { out += ' over '; i++; continue; }
      if (REL[c]) { out += REL[c]; i++; continue; }
      if (c === ',') { out += ', '; i++; continue; }
      if (c === '&') { i++; continue; }
      if (c === "'") { out += ' prime '; i++; continue; }
      if (c === '!') { out += ' factorial '; i++; continue; }
      if (/[0-9.]/.test(c)) { const m = s.slice(i).match(/^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)/); if (!m) { out += ' '; i++; continue; } out += ' ' + m[0] + ' '; i += m[0].length; continue; }
      if (/[A-Za-z]/.test(c)) { out += ' ' + c + ' '; i++; continue; }
      out += ' '; i++;
    }
    return out;
  }
  /* an equation as a sentence; long ones are cut at the first natural break */
  function texSpeak(tex, maxWords = 36) {
    let s = conv(String(tex || '').replace(/(?<![\\A-Za-z])([A-Za-z]|\\[A-Za-z]+)\(([A-Za-z])\)/g, '$1\\text{ of }$2').replace(/\\(?:begin|end)\{[a-z*]+\}/g, ' ').replace(/\\\\/g, ', ').replace(/\\tfrac\s*12|\\frac\s*12/g, '\\frac{1}{2}').replace(/\\nabla\s*\\cdot/g, ' \\text{the divergence of} ').replace(/\\nabla\s*\\times/g, ' \\text{the curl of} '));
    s = s.replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').replace(/,\s*,/g, ',').trim();
    const w = s.split(' ');
    if (w.length > maxWords) { const cut = s.slice(0, s.split(' ').slice(0, maxWords).join(' ').length); const k = Math.max(cut.lastIndexOf(', '), cut.lastIndexOf(' equals ')); s = (k > 40 ? cut.slice(0, k) : cut) + ', and the rest is on screen'; }
    return s.replace(/^,\s*/, '').replace(/[,\s]+$/, '');
  }
  WL.texSpeak = texSpeak;
  /* the derivation, read aloud: each step, its equation and why it holds */
  let run = 0;
  window.addEventListener('hashchange', () => { run++; });   // leaving the page ends a reading (the film code hushes the voice)
  async function readSteps(btn, id) {
    const N = WL.narrate, V = N && N.voice; if (!V) return;
    const box = btn.closest('section, .lesson, article') || document; const steps = [...box.querySelectorAll('ol.steps > li.step')]; if (!steps.length) return;
    const node = (WL.app && WL.app.nodes && WL.app.nodes[id]) || {}; const data = node.steps || ((WL.derive || {})[id] || {}).steps || [];
    document.querySelectorAll('video').forEach((v) => { try { v.pause(); } catch (e) {} });
    await V.ready();
    const span = btn.querySelector('span');
    if (V.kind() === 'none') { span.textContent = 'No voice in this browser'; setTimeout(() => { span.textContent = 'Read the derivation aloud'; }, 2600); return; }
    const my = ++run, owner = { engaged: () => my === run, lostVoice: () => { if (my === run) stopReading(btn); } };
    V.claim(owner, true); V.clear();
    btn.setAttribute('aria-pressed', 'true'); span.textContent = 'Stop reading';
    // one reading for the whole derivation (one line per step), each step lit as the voice reaches it
    const lines = steps.map((li, k) => {
      const st = data[k] || {};
      const say = N.speakable ? N.speakable(st.say || (li.querySelector('.say') || li).textContent) : (st.say || '');
      const text = `Step ${k + 1}. ${say} ${st.tex ? 'In symbols: ' + texSpeak(st.tex) + '.' : ''} ${st.why ? 'Why? ' + (N.speakable ? N.speakable(st.why) : st.why) : ''}`;
      const l = V.say(text, { rate: 0.95, owner });
      l.onStart(() => { if (my !== run) return; steps.forEach((x) => x.classList.toggle('reading', x === li)); li.scrollIntoView({ behavior: WL.reduced ? 'auto' : 'smooth', block: 'center' }); });
      return l;
    });
    await new Promise((res) => lines[lines.length - 1].onEnd(res));
    if (my === run) { steps.forEach((x) => x.classList.remove('reading')); btn.setAttribute('aria-pressed', 'false'); span.textContent = 'Read the derivation aloud'; run++; V.release(owner); }
  }
  function stopReading(b) { run++; b.setAttribute('aria-pressed', 'false'); b.querySelector('span').textContent = 'Read the derivation aloud'; document.querySelectorAll('li.step.reading').forEach((x) => x.classList.remove('reading')); }
  if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-readsteps]'); if (!b) return;
    if (b.getAttribute('aria-pressed') === 'true') { stopReading(b); if (WL.narrate && WL.narrate.hush) WL.narrate.hush(); return; }
    readSteps(b, b.dataset.readsteps);
  });
})();
/* Geodesic — your own notebook: saved topics, notes on each topic, highlights made in the lessons and notes, and the
   notes added in lectures, gathered on #notebook with what is due today, and downloadable as a text file.
   Topic pages get a "Your study" card (save, notes, links to the topic's lecture, flashcards and formula sheet).
   Everything stays in this browser, per account; nothing here is sent anywhere. */
(function () {
  const WL = (window.WL = window.WL || {});
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H().pr ? H().pr(s) : esc(s));
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k + user()) || 'null') || d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k + user(), JSON.stringify(v)); } catch (e) {} };
  const fmtDate = (t) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  /* ---------- saved topics and topic notes ---------- */
  const bms = () => get('wl-bm', {});
  const isSaved = (id) => !!bms()[id];
  const toggleSaved = (id) => { const b = bms(); if (b[id]) delete b[id]; else b[id] = Date.now(); put('wl-bm', b); return !!b[id]; };
  const notes = () => get('wl-mynotes', {});
  const noteOf = (id) => (notes()[id] || {}).t || '';
  const setNote = (id, t) => { const o = notes(); if (t.trim()) o[id] = { t: t.slice(0, 20000), at: Date.now() }; else delete o[id]; put('wl-mynotes', o); };

  /* ---------- highlights ---------- */
  const hls = () => get('wl-hl', {});
  const SKIPH = 'mjx-container, script, style, textarea, input, button, select, .sel-ask, .uhl-x, .lec-host, canvas, svg, .nbcard';
  function textNodes(root) {
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { const p = n.parentElement; return !p || p.closest(SKIPH) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    let x; while ((x = w.nextNode())) out.push(x); return out;
  }
  function wrap(pieces, hid) {
    pieces.forEach(([node, a, b]) => {
      if (b <= a) return; let mid = node;
      if (b < mid.data.length) mid.splitText(b);
      if (a > 0) mid = mid.splitText(a);
      if (!mid.data.trim()) return;
      const m = document.createElement('mark'); m.className = 'uhl'; m.dataset.h = hid; m.title = 'Your highlight: select it to remove';
      mid.parentNode.insertBefore(m, mid); m.appendChild(mid);
    });
  }
  /* the parts of a selection to wrap, and its plain text without the maths */
  function piecesOf(range) {
    const root = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentNode;
    const out = []; let text = '';
    textNodes(root).forEach((n) => { if (!range.intersectsNode(n)) return; const a = n === range.startContainer ? range.startOffset : 0, b = n === range.endContainer ? range.endOffset : n.data.length; if (b > a) { out.push([n, a, b]); text += n.data.slice(a, b); } });
    if (range.startContainer.nodeType === 3 && !out.length) { const n = range.startContainer; out.push([n, range.startOffset, range.endContainer === n ? range.endOffset : n.data.length]); text = n.data.slice(out[0][1], out[0][2]); }
    return { out, text };
  }
  function add(tid, range, where, shown) {
    const { out, text } = piecesOf(range), key = text.replace(/\s+/g, '');
    if (key.length < 3) return null;
    const hid = 'h' + Date.now().toString(36), o = hls();
    (o[tid] = o[tid] || []).push({ id: hid, t: text.replace(/\s+/g, ' ').trim().slice(0, 1200), q: (shown || text).replace(/\s+/g, ' ').trim().slice(0, 1500), where: where || '', at: Date.now() });
    put('wl-hl', o); wrap(out, hid); return hid;
  }
  /* put saved highlights back: match the saved text, ignoring white space, against the page's text */
  function paint(root, tid) {
    const L = (hls()[tid] || []); if (!L.length || !root) return;
    const todo = L.filter((h) => !root.querySelector(`mark.uhl[data-h="${h.id}"]`)); if (!todo.length) return;
    const nodes = textNodes(root), map = []; let flat = '';
    nodes.forEach((n) => { for (let i = 0; i < n.data.length; i++) { const c = n.data[i]; if (!/\s/.test(c)) { flat += c; map.push([n, i]); } } });
    todo.forEach((h) => {
      const k = String(h.t).replace(/\s+/g, ''); if (k.length < 3) return;
      const at = flat.indexOf(k); if (at < 0) return;
      const pieces = new Map();
      for (let j = at; j < at + k.length; j++) { const [n, i] = map[j], p = pieces.get(n); if (p) p[1] = i + 1; else pieces.set(n, [i, i + 1]); }
      wrap([...pieces.entries()].map(([n, [a, b]]) => [n, a, b]).reverse(), h.id);
    });
  }
  function removeHL(tid, hid) {
    const o = hls(); o[tid] = (o[tid] || []).filter((h) => h.id !== hid); if (!o[tid].length) delete o[tid]; put('wl-hl', o);
    document.querySelectorAll(`mark.uhl[data-h="${hid}"]`).forEach((m) => { const p = m.parentNode; while (m.firstChild) p.insertBefore(m.firstChild, m); p.removeChild(m); p.normalize(); });
  }
  /* a small button to remove a highlight, shown when one is selected */
  let xBtn = null;
  function showX(m) {
    if (!xBtn) { xBtn = document.createElement('button'); xBtn.type = 'button'; xBtn.className = 'uhl-x'; xBtn.textContent = 'Remove highlight'; document.body.appendChild(xBtn); xBtn.addEventListener('click', () => { const t = /^#t-(.+)$/.exec(location.hash); if (t && xBtn.dataset.h) removeHL(t[1], xBtn.dataset.h); xBtn.hidden = true; }); window.addEventListener('scroll', () => { if (xBtn) xBtn.hidden = true; }, { passive: true }); window.addEventListener('hashchange', () => { if (xBtn) xBtn.hidden = true; }); }
    const r = m.getBoundingClientRect(); xBtn.dataset.h = m.dataset.h; xBtn.hidden = false;
    xBtn.style.top = Math.max(64, r.top - 40) + 'px'; xBtn.style.left = Math.max(10, Math.min(innerWidth - 170, r.left)) + 'px';
  }
  document.addEventListener('click', (e) => {
    const m = e.target.closest && e.target.closest('mark.uhl');
    if (m && !(window.getSelection() && !window.getSelection().isCollapsed)) { showX(m); return; }
    if (xBtn && !e.target.closest('.uhl-x')) xBtn.hidden = true;
  });

  /* ---------- the card on a topic page ---------- */
  function asideCard(id) {
    const n = N()[id]; if (!n) return '';
    const st = (H().stageOf && H().stageOf(id)) || {}, nc = WL.cards ? WL.cards.count(id) : 0, saved = isSaved(id);
    return `<div class="card nbcard"><h3>Your study</h3>
      <button type="button" class="nb-bm" data-nb-bm aria-pressed="${saved}">${saved ? '★ Saved in your notebook' : '☆ Save this topic'}</button>
      <label class="nb-l" for="nb-note">Your notes on this topic</label>
      <textarea id="nb-note" data-nb-note rows="4" placeholder="Anything you want to remember. Saved as you type, in this browser.">${esc(noteOf(id))}</textarea>
      <p class="nb-saved" aria-live="polite"></p>
      <ul class="nb-links"><li><a href="#tl-${id}">Full lecture</a></li>${nc ? `<li><a href="#cards-${id}">Flashcards <small>${nc}+</small></a></li>` : ''}<li><a href="#formulas-${esc(n.stage)}">Formula sheet <small>${esc(st.short || '')}</small></a></li></ul>
      <p class="nb-hint">Select words in the lesson or the notes and choose <b>Highlight</b> to keep them here and in your <a href="#notebook">notebook</a>.</p></div>`;
  }
  function bind(view, id) {
    const card = view.querySelector('.nbcard'); if (!card) return;
    const ta = card.querySelector('[data-nb-note]'), msg = card.querySelector('.nb-saved'); let t = 0;
    ta.addEventListener('input', () => { clearTimeout(t); msg.textContent = ''; t = setTimeout(() => { setNote(id, ta.value); msg.textContent = 'Saved'; }, 400); });
    card.querySelector('[data-nb-bm]').addEventListener('click', (e) => { const on = toggleSaved(id), b = e.currentTarget; b.setAttribute('aria-pressed', on); b.textContent = on ? '★ Saved in your notebook' : '☆ Save this topic'; });
    const art = view.querySelector('.topic article') || view;
    paint(art, id); setTimeout(() => { if (art.isConnected) paint(art, id); }, 1500);
  }

  /* ---------- the notebook page ---------- */
  function lectureNotes() { const o = get('wl-tlnotes', {}); return Object.entries(o).map(([sid, L]) => ({ sid, tid: sid.replace(/^t-/, ''), L: (L || []).slice().sort((a, b) => a.g - b.g) })).filter((x) => x.L.length); }
  function markdown() {
    const n = N(), B = bms(), M = notes(), HL = hls(), LN = lectureNotes();
    let s = `# My Geodesic notebook\n\nExported ${new Date().toLocaleString()}\n`;
    const saved = Object.keys(B).filter((id) => n[id]);
    if (saved.length) s += `\n## Saved topics\n\n${saved.map((id) => `- ${n[id].title} (${((H().stageOf && H().stageOf(id)) || {}).name || ''})`).join('\n')}\n`;
    const mine = Object.keys(M).filter((id) => n[id]);
    if (mine.length) s += `\n## My notes\n${mine.map((id) => `\n### ${n[id].title}\n\n${M[id].t}\n`).join('')}`;
    const hl = Object.keys(HL).filter((id) => n[id] && HL[id].length);
    if (hl.length) s += `\n## Highlights\n${hl.map((id) => `\n### ${n[id].title}\n\n${HL[id].map((h) => `> ${h.q}${h.where ? `\n> (${h.where})` : ''}\n`).join('\n')}`).join('')}`;
    if (LN.length) s += `\n## Lecture notes\n${LN.map((x) => `\n### ${(n[x.tid] || {}).title || x.sid} (lecture)\n\n${x.L.map((z) => `- [${mmss(z.g)}] ${z.t}`).join('\n')}\n`).join('')}`;
    return s;
  }
  function page(view) {
    const h = H(), n = N(), B = bms(), M = notes(), HL = hls(), LN = lectureNotes(), LS = h.LS ? h.LS() : { u: {}, r: {} };
    document.title = 'My notebook · Geodesic';
    const saved = Object.keys(B).filter((id) => n[id]).sort((a, b) => B[b] - B[a]);
    const mine = Object.keys(M).filter((id) => n[id]).sort((a, b) => M[b].at - M[a].at);
    const hl = Object.keys(HL).filter((id) => n[id] && HL[id].length);
    const rev = Object.keys(LS.r || {}).filter((id) => LS.u[id] && n[id] && LS.r[id].due <= Date.now()).length;
    const mk = WL.mistakes ? WL.mistakes.countDue() : 0, fc = WL.cards ? WL.cards.countDue() : 0, plan = WL.studyPlan ? WL.studyPlan.todayLine() : '';
    const empty = !saved.length && !mine.length && !hl.length && !LN.length;
    view.innerHTML = `<section class="mk-head"><h1>My notebook</h1>
        <p class="lede">Everything you have kept in one place: the topics you saved, your own notes, your highlights and the notes you added in lectures. It stays in this browser; download it to keep a copy.</p></section>
      <div class="nb-due">
        <a href="#mistakes"><b>${mk}</b><span>mistakes ready to try again</span></a>
        <a href="#cards-due"><b>${fc}</b><span>flashcards due</span></a>
        <a href="#review"><b>${rev}</b><span>topics due for review</span></a>
        <a href="#planner"><b>${plan ? '✓' : '+'}</b><span>${plan ? esc(plan) : 'Make a study plan for your exam'}</span></a>
      </div>
      ${empty ? '' : `<div class="nb-tools"><button type="button" class="btn small" data-nb-dl>Download as a text file</button><button type="button" class="btn small ghost" data-nb-text aria-expanded="false">Show as text to copy</button></div><textarea class="nb-md" readonly hidden aria-label="Your notebook as text"></textarea>`}
      ${empty ? `<div class="mk-empty"><b>Your notebook is empty.</b><span>On any topic page, save the topic, write notes in “Your study”, or select words in the lesson and choose Highlight. Notes you add in lectures appear here too.</span><a class="btn small primary" href="#physics">Choose a topic</a></div>` : ''}
      ${saved.length ? `<h2 class="mk-h">Saved topics (${saved.length})</h2><ul class="nb-saved-l">${saved.map((id) => `<li style="--lane:${h.strandOf ? h.strandOf(id).colour : '#58C4DD'}"><i></i><a href="#t-${id}">${esc(n[id].title)}</a><small>${esc(((h.stageOf && h.stageOf(id)) || {}).short || '')}${LS.u[id] ? ' · understood' : ''}</small><button type="button" class="linkbtn" data-nb-unsave="${id}">Remove</button></li>`).join('')}</ul>` : ''}
      ${mine.length ? `<h2 class="mk-h">My notes (${mine.length})</h2><div class="nb-notes">${mine.map((id) => `<article><h3><a href="#t-${id}">${esc(n[id].title)}</a><small>${fmtDate(M[id].at)}</small></h3><p>${esc(M[id].t)}</p></article>`).join('')}</div>` : ''}
      ${hl.length ? `<h2 class="mk-h">Highlights (${hl.reduce((s, id) => s + HL[id].length, 0)})</h2>${hl.map((id) => `<section class="nb-hls"><h3><a href="#t-${id}">${esc(n[id].title)}</a></h3>${HL[id].map((x) => `<blockquote><p>${pr(x.q)}</p><footer>${x.where ? esc(x.where) + ' · ' : ''}${fmtDate(x.at)} <button type="button" class="linkbtn" data-nb-hlx="${id}|${x.id}">Remove</button></footer></blockquote>`).join('')}</section>`).join('')}` : ''}
      ${LN.length ? `<h2 class="mk-h">Lecture notes (${LN.reduce((s, x) => s + x.L.length, 0)})</h2>${LN.map((x) => `<section class="nb-hls"><h3><a href="#tl-${x.tid}">${esc((n[x.tid] || {}).title || x.sid)}</a> <small>lecture</small></h3><ul class="tl-notes">${x.L.map((z) => `<li><button type="button" data-nb-seek="${x.tid}|${z.g.toFixed(1)}">${mmss(z.g)}</button><span>${esc(z.t)}</span></li>`).join('')}</ul></section>`).join('')}` : ''}`;
    if (h.typeset) h.typeset(view);
    view.onclick = (e) => {
      const t = e.target;
      const un = t.closest('[data-nb-unsave]'); if (un) { toggleSaved(un.dataset.nbUnsave); page(view); return; }
      const hx = t.closest('[data-nb-hlx]'); if (hx) { const [tid, hid] = hx.dataset.nbHlx.split('|'); removeHL(tid, hid); page(view); return; }
      const sk = t.closest('[data-nb-seek]'); if (sk) { const [tid, g] = sk.dataset.nbSeek.split('|'); try { sessionStorage.setItem('wl-tlseek', JSON.stringify({ id: tid, g: +g })); } catch (er) {} location.hash = '#tl-' + tid; return; }
      if (t.closest('[data-nb-dl]')) {
        const blob = new Blob([markdown()], { type: 'text/markdown' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'geodesic-notebook.md'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); return;
      }
      const tx = t.closest('[data-nb-text]'); if (tx) { const ta = view.querySelector('.nb-md'), open = ta.hidden; ta.hidden = !open; tx.setAttribute('aria-expanded', open); tx.textContent = open ? 'Hide the text' : 'Show as text to copy'; if (open) { ta.value = markdown(); ta.focus(); ta.select(); } }
    };
  }
  WL.pages = WL.pages || {};
  WL.pages.notebook = { match: (h) => h === 'notebook', nav: 'notebook', render(h, view) { page(view); } };
  const counts = () => ({ saved: Object.keys(bms()).length, notes: Object.keys(notes()).length, hl: Object.values(hls()).reduce((s, a) => s + ((a && a.length) || 0), 0) });
  WL.notebook = { asideCard, bind, add, paint, removeHL, isSaved, toggleSaved, noteOf, markdown, counts };
})();
/* Geodesic — olympiad-style problems: multi-part, numerical answers checked to a tolerance, hints, full solutions, a clock.
   Every answer was computed from the stated data by a script (see PLAN.md). */
(function () {
  const WL = (window.WL = window.WL || {});
  const PROBS = [{"id":"hoop","title":"A bead on a spinning hoop","area":"Mechanics","level":2,"mins":25,"stem":"A small bead slides without friction on a vertical circular hoop of radius R = 0.2 m. The hoop spins about its vertical diameter at a constant angular speed ω. Take g = 9.81 m s⁻².","parts":[{"q":"Below what angular speed is the bottom of the hoop the only stable position? Give ω_c in rad s⁻¹.","a":7.00357,"u":"rad/s","tol":0.02,"sol":"In the rotating frame the bead feels gravity and a centrifugal force mω²R sin θ. Off the bottom, equilibrium needs cos θ = g/(ω²R), which exists only if ω² > g/R. So ω_c = √(g/R) = √(9.81/0.2) = 7.00 rad/s."},{"q":"At ω = 10.0 rad s⁻¹, at what angle θ from the bottom does the bead sit in stable equilibrium? Give θ in degrees.","a":60.6265,"u":"°","tol":0.02,"sol":"cos θ = g/(ω²R) = 9.81/(10.0² × 0.2) = 0.491, so θ = 60.6°. For ω > ω_c this off-axis point is stable and the bottom becomes unstable."}],"hint":"Work in the rotating frame and balance the components along the hoop: gravity pulls the bead down the hoop, the centrifugal force pushes it outwards."},{"id":"rolling","title":"The rolling race","area":"Mechanics","level":1,"mins":20,"stem":"A solid sphere, a solid cylinder and a thin hoop are released together from rest and roll without slipping down a slope 2.0 m long inclined at 30° to the horizontal. Take g = 9.81 m s⁻².","parts":[{"q":"Find the time the solid sphere takes to reach the bottom.","a":1.0685,"u":"s","tol":0.02,"sol":"For rolling with I = kmr², a = g sin θ/(1 + k). Sphere: k = 2/5, so a = 9.81 × 0.5/1.4 = 3.50 m/s² and t = √(2L/a) = 1.07 s."},{"q":"Find the time the solid cylinder takes.","a":1.106,"u":"s","tol":0.02,"sol":"Cylinder: k = 1/2, a = 3.27 m/s², t = 1.11 s."},{"q":"By how much does the hoop lose to the sphere? Give the difference in seconds.","a":0.208602,"u":"s","tol":0.02,"sol":"Hoop: k = 1, a = 2.453 m/s², t = 1.28 s, so it arrives 0.21 s after the sphere. Mass and radius do not matter: only the shape factor k."}],"hint":"Use energy: mgh = ½mv² + ½Iω² with v = ωr, or Newton’s law for translation and rotation together."},{"id":"rocket","title":"Burning to orbit","area":"Mechanics","level":2,"mins":25,"stem":"A single-stage rocket in free space ejects gas at 3000 m s⁻¹ relative to itself. Its initial mass is 5e+05 kg, of which 3.75e+05 kg is fuel.","parts":[{"q":"Find the speed gained when all the fuel is burnt.","a":4158.88,"u":"m/s","tol":0.02,"sol":"Momentum conservation for each small burn gives m dv = −u dm, so Δv = u ln(m₀/m₁) = 3000 ln(4) = 4159 m/s (the Tsiolkovsky equation)."},{"q":"What fraction of the initial mass must be fuel for the rocket to reach 7.8 km s⁻¹ (low-orbit speed), ignoring gravity and drag?","a":0.925726,"u":"","tol":0.02,"sol":"m₁/m₀ = e^(−Δv/u) = e^(−2.6) = 0.074, so the fuel fraction is 0.926. This is why real launchers use stages."}],"hint":"Write momentum conservation for a short time dt in which mass dm is ejected, then integrate."},{"id":"hohmann","title":"From low orbit to geostationary","area":"Gravitation","level":3,"mins":40,"stem":"A satellite moves in a circular orbit 300 km above the Earth (Earth’s radius 6371 km, GM = 3.986 × 10¹⁴ m³ s⁻²). It is to be moved to the geostationary orbit, radius 42 160 km, by a Hohmann transfer: one burn to enter an ellipse touching both circles, and a second burn at the far point.","parts":[{"q":"Find the speed in the low circular orbit.","a":7729.89,"u":"m/s","tol":0.02,"sol":"v = √(GM/r₁) = 7730 m/s."},{"q":"Find the first speed increase Δv₁.","a":2427.7,"u":"m/s","tol":0.02,"sol":"Transfer ellipse: a = (r₁ + r₂)/2. Vis-viva at perigee: v_p = √(GM(2/r₁ − 1/a)) = 10158 m/s, so Δv₁ = 2428 m/s."},{"q":"Find the second speed increase Δv₂.","a":1467.57,"u":"m/s","tol":0.02,"sol":"At apogee v_a = √(GM(2/r₂ − 1/a)) = 1607 m/s; the circular speed there is 3075 m/s, so Δv₂ = 1468 m/s."},{"q":"How long does the transfer take, in hours?","a":5.27324,"u":"h","tol":0.02,"sol":"Half the period of the ellipse: t = π√(a³/GM) = 5.27 h."}],"hint":"Use the vis-viva equation v² = GM(2/r − 1/a) and Kepler’s third law for the ellipse."},{"id":"rodpend","title":"A swinging rod","area":"Mechanics","level":1,"mins":15,"stem":"A uniform rod of length 0.8 m swings in a vertical plane about a horizontal axis through one end. Take g = 9.81 m s⁻².","parts":[{"q":"Find the period of small oscillations.","a":1.46502,"u":"s","tol":0.02,"sol":"I = mL²/3 about the end, and the restoring torque is mg(L/2)θ. So T = 2π√(I/(mgL/2)) = 2π√(2L/3g) = 1.465 s."},{"q":"How long would a simple pendulum with the same period be?","a":0.533333,"u":"m","tol":0.02,"sol":"The equivalent length is 2L/3 = 0.533 m."}],"hint":"Use τ = Iα with I about the pivot, then compare with θ̈ = −ω²θ."},{"id":"torricelli","title":"Emptying a tank","area":"Fluids","level":2,"mins":25,"stem":"A cylindrical tank of cross-sectional area 0.5 m² is filled with water to a depth of 1.2 m. A small hole of area 2.0 cm² is opened in the bottom. Ignore viscosity and assume the flow is steady at each moment. g = 9.81 m s⁻².","parts":[{"q":"With what speed does the water first leave the hole?","a":4.85222,"u":"m/s","tol":0.02,"sol":"Bernoulli from the surface to the jet: v = √(2gH) = 4.85 m/s (Torricelli)."},{"q":"How long does the tank take to empty, in seconds?","a":1236.55,"u":"s","tol":0.02,"sol":"A dh/dt = −a√(2gh). Integrating, t = (A/a)√(2H/g) = 2500 × √(2 × 1.2/9.81) = 1237 s. Note that half the time empties three quarters of the water."}],"hint":"Write volume conservation: the rate the level falls times A equals the outflow a·v."},{"id":"diesel","title":"Lighting a diesel","area":"Thermal physics","level":1,"mins":15,"stem":"In a diesel engine air at 300 K is compressed quickly to 1/18 of its volume. Treat the air as an ideal diatomic gas (γ = 1.4) and the compression as adiabatic.","parts":[{"q":"Find the final temperature.","a":953.301,"u":"K","tol":0.02,"sol":"TV^(γ−1) is constant, so T₂ = 300 × 18^0.4 = 953 K, hot enough to ignite the injected fuel."},{"q":"By what factor does the pressure rise?","a":57.1981,"u":"","tol":0.02,"sol":"pV^γ is constant, so p₂/p₁ = 18^1.4 = 57.2."}],"hint":"Adiabatic: pV^γ = constant; combine with pV = nRT."},{"id":"meanfree","title":"How far between collisions?","area":"Thermal physics","level":2,"mins":20,"stem":"Model nitrogen molecules (molar mass 28 g mol⁻¹) as hard spheres of diameter 3.7 × 10⁻¹⁰ m in air at 293 K and 1.013e+05 Pa. Boltzmann constant 1.381 × 10⁻²³ J K⁻¹; 1 u = 1.661 × 10⁻²⁷ kg.","parts":[{"q":"Find the mean free path, in nanometres.","a":65.6725,"u":"nm","tol":0.02,"sol":"λ = kT/(√2 π d² p) = 66 nm. The √2 comes from the motion of the other molecules."},{"q":"Find the mean speed of the molecules.","a":470.692,"u":"m/s","tol":0.02,"sol":"v̄ = √(8kT/πm) = 471 m/s."},{"q":"Roughly how many collisions does one molecule make each second? Give the number in units of 10⁹ s⁻¹.","a":7.16726,"u":"× 10⁹ /s","tol":0.03,"sol":"f = v̄/λ = 7.17e+09 s⁻¹, about 7.2 × 10⁹ per second."}],"hint":"A molecule sweeps out a cylinder of radius d; count the molecules inside per unit length of path."},{"id":"ladder","title":"An infinite ladder of resistors","area":"Electricity","level":2,"mins":20,"stem":"An infinite ladder network has a 10 Ω resistor in each rung and a 10 Ω resistor in each section of both rails (so each section adds a resistor on the top rail, one on the bottom rail and one rung).","parts":[{"q":"Find the resistance between the two input terminals.","a":27.3205,"u":"Ω","tol":0.02,"sol":"Adding one more section leaves the resistance unchanged: R = 2r + rR/(r + R). This gives R² − 2rR − 2r² = 0, so R = r(1 + √3) = 27.32 Ω."}],"hint":"An infinite ladder looks the same after you add one more section in front of it."},{"id":"railrod","title":"A rod sliding on magnetic rails","area":"Electromagnetism","level":2,"mins":30,"stem":"Two smooth parallel rails 0.4 m apart run down a slope at 30° to the horizontal and are joined at the top by a 2.0 Ω resistor. A magnetic field of 0.8 T acts perpendicular to the plane of the rails. A 50 g rod slides down across the rails. Ignore the resistance of the rod and rails. g = 9.81 m s⁻².","parts":[{"q":"Find the terminal speed of the rod.","a":4.79004,"u":"m/s","tol":0.02,"sol":"At speed v the emf is BLv, the current BLv/R and the retarding force B²L²v/R. Terminal speed when this equals mg sin θ: v = mgR sin θ/(BL)² = 4.79 m/s."},{"q":"Find the power dissipated in the resistor at terminal speed.","a":1.17476,"u":"W","tol":0.02,"sol":"P = (mg sin θ)v = 1.175 W: the gravitational energy lost each second all becomes heat in the resistor."}],"hint":"Faraday’s law gives the emf; the current in the field gives a force on the rod opposing its motion."},{"id":"crossed","title":"A velocity selector","area":"Electromagnetism","level":1,"mins":15,"stem":"Electrons pass undeflected through a region where an electric field of 2.0e+04 V m⁻¹ and a magnetic field of 0.05 T are perpendicular to each other and to the beam. Electron mass 9.109 × 10⁻³¹ kg, charge 1.602 × 10⁻¹⁹ C.","parts":[{"q":"Find the speed of the electrons.","a":400000.0,"u":"m/s","tol":0.02,"sol":"Undeflected: eE = evB, so v = E/B = 4.00e+05 m/s."},{"q":"The electric field is switched off. Find the radius of the electrons’ path, in millimetres.","a":0.0454881,"u":"mm","tol":0.02,"sol":"r = mv/(eB) = 0.045 mm."}],"hint":"Balance the electric and magnetic forces."},{"id":"coating","title":"An antireflection coating","area":"Optics","level":1,"mins":15,"stem":"A camera lens (n = 1.52) is coated with a thin layer of magnesium fluoride (n = 1.38) to cut reflection of green light of wavelength 550 nm at normal incidence.","parts":[{"q":"Find the minimum thickness of the coating, in nanometres.","a":99.6377,"u":"nm","tol":0.02,"sol":"Both reflections (air→coating and coating→glass) have the same phase change, so destructive interference needs a path difference 2nt = λ/2: t = λ/(4n) = 99.6 nm."},{"q":"Find the next thickness that also works, in nanometres.","a":298.913,"u":"nm","tol":0.02,"sol":"2nt = 3λ/2 gives t = 3λ/(4n) = 299 nm."}],"hint":"Check whether each reflection has a half-wavelength phase change."},{"id":"doppler","title":"A passing train","area":"Waves","level":1,"mins":15,"stem":"A train sounding a 500 Hz horn passes a person standing by the track at 30 m s⁻¹. The speed of sound is 340 m s⁻¹.","parts":[{"q":"What frequency does the person hear as the train approaches?","a":548.387,"u":"Hz","tol":0.02,"sol":"f = f₀v/(v − v_s) = 548 Hz."},{"q":"What frequency as it moves away?","a":459.459,"u":"Hz","tol":0.02,"sol":"f = f₀v/(v + v_s) = 459 Hz."},{"q":"The person measures both frequencies. Show how to recover the train’s speed: compute v_s from your two answers.","a":30.0,"u":"m/s","tol":0.02,"sol":"v_s = v(f_a − f_r)/(f_a + f_r) = 30.0 m/s, as expected."}],"hint":"The source moves, so the wavelength in front is squashed and the one behind is stretched."},{"id":"alpha","title":"The recoil of an alpha decay","area":"Nuclear","level":2,"mins":20,"stem":"Uranium-238 at rest decays to thorium-234 by emitting an α particle. The energy released is Q = 4.27 MeV. Treat both products non-relativistically with masses in proportion to their nucleon numbers.","parts":[{"q":"Find the kinetic energy of the α particle.","a":4.19824,"u":"MeV","tol":0.02,"sol":"Equal and opposite momenta share the energy in inverse ratio of mass: E_α = Q × 234/238 = 4.198 MeV."},{"q":"Find the recoil energy of the thorium nucleus, in keV.","a":71.7647,"u":"keV","tol":0.02,"sol":"E_Th = Q × 4/238 = 72 keV."}],"hint":"Momentum is conserved, so p_α = p_Th; then use E = p²/2m."},{"id":"star","title":"Sizing a star from its colour","area":"Astrophysics","level":2,"mins":20,"stem":"A star’s spectrum peaks at 290 nm and its luminosity is 10000 times the Sun’s (L☉ = 3.83 × 10²⁶ W). Wien’s constant 2.898 × 10⁻³ m K; σ = 5.670 × 10⁻⁸ W m⁻² K⁻⁴; R☉ = 6.96 × 10⁸ m.","parts":[{"q":"Find its surface temperature.","a":9993.1,"u":"K","tol":0.02,"sol":"T = b/λ_max = 9993 K."},{"q":"Find its radius in units of the Sun’s radius.","a":33.3575,"u":"R☉","tol":0.02,"sol":"L = 4πR²σT⁴ gives R = √(L/(4πσT⁴)) = 2.322e+10 m = 33.36 R☉."}],"hint":"Wien gives the temperature; Stefan–Boltzmann links luminosity, radius and temperature."},{"id":"sail","title":"Pushed by light","area":"Modern physics","level":1,"mins":15,"stem":"A 1000 W laser beam falls at normal incidence on a perfectly reflecting sail of mass 1.0 kg in space. c = 2.998 × 10⁸ m s⁻¹.","parts":[{"q":"Find the force on the sail, in micronewtons.","a":6.67111,"u":"μN","tol":0.02,"sol":"Each photon’s momentum is reversed, so F = 2P/c = 6.67 μN."},{"q":"How fast is the sail moving after one day, in mm s⁻¹?","a":576.384,"u":"mm/s","tol":0.02,"sol":"a = F/m = 6.67e-06 m/s²; after 86 400 s, v = 576.38 mm/s."}],"hint":"Light carries momentum p = E/c."},{"id":"eradius","title":"How big is an electron, classically?","area":"Electromagnetism","level":3,"mins":30,"stem":"Suppose the electron’s rest energy were the electrostatic energy of its charge, spread over a sphere of radius r. ε₀ = 8.854 × 10⁻¹² F m⁻¹, e = 1.602 × 10⁻¹⁹ C, mₑ = 9.109 × 10⁻³¹ kg, c = 2.998 × 10⁸ m s⁻¹.","parts":[{"q":"For charge on a thin shell the energy is e²/(8πε₀r). Find the radius that makes this equal to mₑc², in femtometres.","a":1.40868,"u":"fm","tol":0.02,"sol":"r = e²/(8πε₀mₑc²) = 1.409 fm."},{"q":"The conventional classical electron radius drops the factor ½: r_e = e²/(4πε₀mₑc²). Find it in femtometres.","a":2.81736,"u":"fm","tol":0.02,"sol":"r_e = 2.817 fm. Experiments show no structure down to 10⁻³ fm or smaller, so this picture is wrong: the electron is point-like as far as we can tell."}],"hint":"The energy of a charged shell is Q²/(8πε₀r)."},{"id":"drop","title":"Why a raindrop wobbles","area":"Methods","level":2,"mins":20,"stem":"A small water drop oscillates in shape. Its frequency can depend only on the surface tension σ (N m⁻¹), the density ρ and the radius r. The exact result (Rayleigh) for the lowest mode is ω² = 8σ/(ρr³).","parts":[{"q":"By dimensional analysis f ∝ σ^a ρ^b r^c. Find c.","a":-1.5,"u":"","tol":0.001,"sol":"σ has units kg s⁻², ρ kg m⁻³, r m. Matching s⁻¹: a = ½; kg: a + b = 0 so b = −½; m: −3b + c = 0 so c = −3/2. So f ∝ √(σ/ρr³)."},{"q":"Find the frequency for a drop of radius 1.0 mm (σ = 0.072 N m⁻¹, ρ = 1000 kg m⁻³).","a":120.79,"u":"Hz","tol":0.02,"sol":"ω = √(8σ/ρr³) = 759 rad/s, so f = 121 Hz."}],"hint":"Write the units of each quantity in kg, m and s and match the powers."},{"id":"rcloss","title":"Half the energy always goes missing","area":"Electricity","level":2,"mins":20,"stem":"A 100 μF capacitor, initially uncharged, is charged through a resistor R from a 12 V battery.","parts":[{"q":"How much energy does the battery supply by the time the capacitor is fully charged, in millijoules?","a":14.4,"u":"mJ","tol":0.02,"sol":"The battery moves charge Q = CV through V, so it supplies QV = CV² = 14.4 mJ."},{"q":"How much energy is stored in the capacitor, in millijoules?","a":7.2,"u":"mJ","tol":0.02,"sol":"½CV² = 7.2 mJ."},{"q":"How much is dissipated in the resistor, in millijoules? (Does it depend on R?)","a":7.2,"u":"mJ","tol":0.02,"sol":"7.2 mJ, exactly half, whatever the value of R: ∫I²R dt with I = (V/R)e^(−t/RC) gives ½CV²."}],"hint":"Compare the work done by the battery with the energy stored."},{"id":"gps","title":"Why GPS needs relativity","area":"Modern physics","level":3,"mins":35,"stem":"GPS satellites orbit at radius 26 560 km with speed 3874 m s⁻¹. Earth’s radius is 6371 km and GM = 3.986 × 10¹⁴ m³ s⁻². c = 2.998 × 10⁸ m s⁻¹. Compare a satellite clock with one on the ground (ignore the ground clock’s own rotation).","parts":[{"q":"Special relativity: by how many microseconds per day does the satellite clock lose? Give a positive number.","a":7.2134,"u":"μs","tol":0.02,"sol":"Δt/t ≈ ½v²/c² = 8.349e-11; over a day that is 7.21 μs slow."},{"q":"General relativity: by how many microseconds per day does it gain from sitting higher in the potential?","a":45.7159,"u":"μs","tol":0.02,"sol":"Δt/t ≈ (GM/c²)(1/R_E − 1/r) = 5.291e-10; over a day 45.7 μs fast."},{"q":"What is the net gain per day in microseconds, and so roughly the ranging error in kilometres per day (multiply by c)? Give the net gain in μs.","a":38.5025,"u":"μs","tol":0.02,"sol":"Net 38.5 μs per day. Times c that is about 12 km of position error each day if it were not corrected."}],"hint":"Use the weak-field results: moving clocks run slow by ½v²/c², higher clocks run fast by Δφ/c²."}];
  const H = () => WL.app && WL.app.h;
  const KEY = () => { const A = WL.auth; return 'wl-olyp' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY()) || '{}') || {}; } catch (e) { return {}; } };
  const save = (o) => { try { localStorage.setItem(KEY(), JSON.stringify(o)); } catch (e) {} };
  const stars = (n) => '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n);
  const LEVEL = { 1: 'Warm-up', 2: 'National round', 3: 'International' };
  const num = (s) => { const t = String(s || '').trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/[−–]/g, '-').replace(/[×xX*·]10\^?\(?([-+]?\d+)\)?$/, 'e$1').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (c) => ({ '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' }[c])); return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(t) ? parseFloat(t) : NaN; };
  const ok = (v, p) => isFinite(v) && (p.a === 0 ? Math.abs(v) < 1e-9 : Math.abs(v / p.a - 1) <= (p.tol || 0.02));
  const stateOf = (o, id) => (o[id] = o[id] || { parts: {} });
  /* Problems Einstein writes on request, kept in this browser per account. */
  const GKEY = () => { const A = WL.auth; return 'wl-olygen' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const gload = () => { try { const a = JSON.parse(localStorage.getItem(GKEY()) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const gsave = (a) => { try { localStorage.setItem(GKEY(), JSON.stringify(a.slice(-30))); } catch (e) {} };
  const findP = (id) => PROBS.find((x) => x.id === id) || gload().find((x) => x.id === id);
  /* What each level asks for, from reading the problems on this page against the real papers they imitate.
     The forge gives Einstein this description and two or three of the problems at that level as examples. */
  const PROFILE = {
    1: { like: 'BPhO Round 1, Section 1, or the middle of the F = ma exam', parts: '2 or 3 short parts', time: 'about 15 minutes', hard: 'One principle applied cleanly. Each part is one or two lines of working with A-level maths.' },
    2: { like: 'the long questions of BPhO Round 1, or a USAPhO problem', parts: '2 to 4 parts that build on each other', time: '20 to 30 minutes', hard: 'Two principles combined, such as energy with momentum or a rotating frame with equilibrium, often with one approximation. Calculus is allowed.' },
    3: { like: 'one section of an IPhO or APhO theory problem', parts: '3 to 5 linked parts', time: '35 to 45 minutes', hard: 'The student has to build the model: a non-obvious idea, an approximation (small oscillations, a weak field, a perturbation) and a chain in which each part feeds the next.' }
  };
  const profileText = (lv) => { const f = PROFILE[lv]; return `${LEVEL[lv]} (${stars(lv)}), in the style of ${f.like}: ${f.parts}, ${f.time}. ${f.hard}`; };
  function examplesFor(lv, area, first) {
    const same = PROBS.filter((P) => P.level === lv), pick = [];
    if (first) pick.push(first);
    same.filter((P) => P.area === area && P !== first).forEach((P) => pick.length < 2 && pick.push(P));
    same.filter((P) => !pick.includes(P)).sort(() => Math.random() - 0.5).forEach((P) => pick.length < 3 && pick.push(P));
    return pick;
  }
  async function forge(lv, area, first, out, tier) {
    if (!WL.forge) throw new Error('The problem writer is not available.');
    const avoid = [...PROBS, ...gload()].map((P) => P.title);
    const P = await WL.forge.olympiad({ level: lv, area, profile: profileText(lv), like: examplesFor(lv, area, first), avoid }, WL.forge.progress(out, 'a new ' + LEVEL[lv].toLowerCase() + ' problem'));
    P.id = 'g' + Date.now().toString(36); P.level = lv; if (area) P.area = area; if (tier) P.tier = tier;
    const all = gload(); all.push(P); gsave(all);
    return P;
  }
  const solvedParts = (o, P) => P.parts.filter((_, i) => (((o[P.id] || {}).parts || {})[i] || {}).ok).length;
  function homeHTML() {
    const o = load(), h = H(); if (!h) return '';
    const done = PROBS.filter((P) => solvedParts(o, P) === P.parts.length).length;
    return `<section class="block olyp-home"><div class="section-h"><h2>Olympiad-style problems</h2><a href="#olyproblems">All ${PROBS.length} problems</a></div>
      <p class="sec-sub">Multi-part problems in the style of national rounds and the IPhO. Work on paper, then enter each numerical answer: it is checked to 2 %. Hints and full solutions are there when you need them. You have solved ${done} of ${PROBS.length}.</p>
      <div class="olyp-grid">${PROBS.slice(0, 6).map((P) => card(P, o)).join('')}</div></section>`;
  }
  function card(P, o) {
    const n = solvedParts(o, P), all = n === P.parts.length, h = H();
    return `<a class="olyp-card${all ? ' done' : ''}${P.gen ? ' gen' : ''}" href="#olyp-${P.id}"><span class="olyp-area">${h.esc(P.area)}${P.gen ? ' · Einstein' : ''}</span><b>${h.esc(P.title)}</b><span class="olyp-meta"><span class="olyp-stars" title="${LEVEL[P.level]}">${stars(P.level)}</span>${P.parts.length} parts · about ${P.mins} min</span><span class="olyp-prog">${all ? 'Solved' : n ? `${n} of ${P.parts.length} parts` : 'Not started'}</span></a>`;
  }
  function renderList(view) {
    const h = H(), o = load(); h.setNav && h.setNav('olympiad');
    const areas = [...new Set(PROBS.map((P) => P.area))];
    view.innerHTML = `<section class="olyp-page"><p class="crumbs"><a href="#olympiad">Olympiad pathway</a></p>
      <header class="olyp-head"><h1>Olympiad-style problems</h1><p class="prlead">Each problem is one physical situation followed through several parts, as in a real olympiad paper. Give yourself the suggested time, work it out on paper, then type each answer. Answers are checked to 2 % (they were computed from the data, so a different rounding of g is fine).</p></header>
      ${forgeHTML(areas)}
      <h2 class="olyp-h2">The problem set</h2>
      <div class="olyp-filter" role="group" aria-label="Filter by area"><button type="button" data-oa="" aria-pressed="true">All</button>${areas.map((a) => `<button type="button" data-oa="${h.esc(a)}" aria-pressed="false">${h.esc(a)}</button>`).join('')}</div>
      <div class="olyp-grid">${PROBS.map((P) => card(P, o).replace('<a class="olyp-card', `<a data-area="${h.esc(P.area)}" class="olyp-card`)).join('')}</div>
      <p class="olyp-legend"><span>★☆☆ Warm-up</span><span>★★☆ National round</span><span>★★★ International</span></p></section>`;
    document.title = 'Olympiad-style problems · Geodesic';
    let lv = 2;
    view.onclick = (e) => {
      const lb = e.target.closest('[data-flv]'); if (lb) { lv = +lb.dataset.flv; view.querySelectorAll('[data-flv]').forEach((x) => x.setAttribute('aria-pressed', x === lb)); return; }
      const gb = e.target.closest('[data-forge]');
      if (gb) {
        const out = view.querySelector('#forge-out'), area = view.querySelector('#forge-area').value;
        gb.disabled = true; out.hidden = false; out.className = 'olyp-forge-out'; out.innerHTML = '<span class="spin" aria-hidden="true"></span><span id="forge-prog">Einstein is writing a new problem</span>';
        forge(lv, area, null, view.querySelector('#forge-prog')).then((P) => { location.hash = '#olyp-' + P.id; })
          .catch((er) => { if (!out.isConnected) return; gb.disabled = false; out.className = 'olyp-forge-out err'; out.textContent = (er && er.message) || 'Einstein could not write a problem just now. Try again.'; });
        return;
      }
      const b = e.target.closest('[data-oa]'); if (!b) return; view.querySelectorAll('[data-oa]').forEach((x) => x.setAttribute('aria-pressed', x === b)); view.querySelectorAll('.olyp-grid:not(.olyp-mine) .olyp-card').forEach((c) => { c.hidden = b.dataset.oa && c.dataset.area !== b.dataset.oa; });
    };
  }
  function forgeHTML(areas) {
    const h = H(), o = load(), mine = gload().slice().reverse(), cnt = (lv) => PROBS.filter((P) => P.level === lv);
    const avg = (a, f) => (a.length ? Math.round(a.reduce((x, P) => x + f(P), 0) / a.length) : 0);
    return `<section class="olyp-forge" aria-labelledby="forge-h">
      <div class="olyp-forge-main"><h2 id="forge-h">A new problem, whenever you want one</h2>
        <p>Pick a level. Einstein reads the problems on this page at that level, writes a new one in the same style, then solves every part again from scratch. A part whose two answers differ by more than 2 % is removed before you see it.</p>
        <div class="olyp-forge-row"><div class="olyp-lvpick" role="group" aria-label="Level">${[1, 2, 3].map((lv) => `<button type="button" data-flv="${lv}" aria-pressed="${lv === 2}"><span class="olyp-stars">${stars(lv)}</span>${LEVEL[lv]}</button>`).join('')}</div>
          <label class="vh" for="forge-area">Area</label><select id="forge-area"><option value="">Any area</option>${areas.map((a) => `<option>${h.esc(a)}</option>`).join('')}</select>
          <button type="button" class="btn primary" data-forge>Write a problem</button></div>
        <p class="olyp-forge-out" id="forge-out" aria-live="polite" hidden></p></div>
      <details class="olyp-levels"><summary>How the three levels differ</summary>
        <table><thead><tr><th scope="col">Level</th><th scope="col">Like</th><th scope="col">Shape</th><th scope="col">What makes it hard</th></tr></thead>
        <tbody>${[1, 2, 3].map((lv) => { const g = cnt(lv), f = PROFILE[lv]; return `<tr><th scope="row"><span class="olyp-stars">${stars(lv)}</span> ${LEVEL[lv]}<small>${g.length} problems here, about ${avg(g, (P) => P.mins)} min and ${(g.reduce((x, P) => x + P.parts.length, 0) / (g.length || 1)).toFixed(1)} parts each</small></th><td>${h.esc(f.like)}</td><td>${h.esc(f.parts)}, ${h.esc(f.time)}</td><td>${h.esc(f.hard)}</td></tr>`; }).join('')}</tbody></table>
        <p class="olyp-levels-note">Real international problems are longer than any here: an IPhO theory paper is three problems in five hours. The International level matches one section of such a problem, not a whole one.</p></details>
      ${mine.length ? `<h2 class="olyp-h2">Written for you by Einstein</h2><div class="olyp-grid olyp-mine">${mine.map((P) => card(P, o)).join('')}</div>` : ''}
    </section>`;
  }
  let clock = 0;
  function renderProb(view, id) {
    const h = H(), P = findP(id); h.setNav && h.setNav('olympiad');
    if (!P) { view.innerHTML = '<section class="olyp-page"><h1>That problem is not here</h1><p><a href="#olyproblems">All problems</a></p></section>'; return; }
    const o = load(), st = stateOf(o, P.id), LIST = P.gen ? gload() : PROBS, i0 = LIST.findIndex((x) => x.id === P.id), prev = LIST[i0 - 1], next = LIST[i0 + 1];
    const partHTML = (p, i) => { const s = st.parts[i] || {}; return `<li class="olyp-part${s.ok ? ' ok' : s.tried ? ' no' : ''}" data-pi="${i}">
        <p class="olyq-q">${h.pr(p.q)}</p>
        <form class="olyp-ans" data-pf="${i}" novalidate><label class="vh" for="opa-${i}">Answer to part ${String.fromCharCode(97 + i)}</label><input id="opa-${i}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${h.esc(s.a || '')}" placeholder="Your answer"><span class="olyp-u">${h.esc(p.u || '')}</span><button type="submit" class="btn small primary">Check</button><button type="button" class="btn small ghost" data-osol="${i}" aria-expanded="${s.shown ? 'true' : 'false'}">${s.shown ? 'Hide the solution' : 'Solution'}</button></form>
        <p class="olyp-fb" aria-live="polite">${s.ok ? 'Correct.' : s.tried ? 'Not within 2 % yet. Check your working, or open the solution.' : ''}</p>
        <div class="olyp-sol"${s.shown ? '' : ' hidden'}><p>${h.pr(p.sol)}</p><p class="olyp-key">Answer: <b>${h.esc(String(+p.a.toPrecision(4)))}</b> ${h.esc(p.u || '')}</p></div></li>`; };
    view.innerHTML = `<article class="olyp-page olyp-one" data-tid="">
      <p class="crumbs"><a href="#olympiad">Olympiad pathway</a> <span aria-hidden="true">›</span> <a href="#olyproblems">Problems</a></p>
      <header class="olyp-head"><p class="olyp-k">${h.esc(P.area)} · <span title="${LEVEL[P.level]}">${stars(P.level)} ${LEVEL[P.level]}</span></p><h1>${h.esc(P.title)}</h1>
        ${P.gen ? `<p class="olyp-genline"><span class="emark" aria-hidden="true">E</span>Written by Einstein on ${new Date(P.gen.at).toLocaleDateString()}. ${P.gen.checked ? `It solved every part again to check its answers${P.gen.dropped ? `, and removed ${P.gen.dropped} part${P.gen.dropped === 1 ? '' : 's'} where they disagreed` : ''}. A wrong answer is still possible: if yours disagrees and you are sure, trust your working and open the solution.` : 'It could not double-check these answers, so treat them with care.'} <button type="button" class="btn small ghost" data-ogdel>Remove this problem</button></p>` : ''}</header>
      <div class="olyp-bar"><span class="olyp-clock" id="olyp-clock">${P.mins}:00</span><button type="button" class="btn small" data-oclock>Start the clock (${P.mins} min)</button><button type="button" class="btn small ghost" data-ohint aria-expanded="false">A hint</button></div>
      <p class="olyp-hint" hidden>${h.pr(P.hint)}</p>
      <p class="olyp-stem olyq-q">${h.pr(P.stem)}</p>
      <ol class="olyp-parts" type="a">${P.parts.map(partHTML).join('')}</ol>
      <div class="olyp-more"><button type="button" class="btn" data-olike>Einstein, write another like this</button><span class="olyp-forge-out" id="forge-out" aria-live="polite" hidden></span></div>
      <nav class="prnext">${prev ? `<a href="#olyp-${prev.id}">‹ ${h.esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="#olyp-${next.id}">${h.esc(next.title)} ›</a>` : '<a href="#olyproblems">All problems ›</a>'}</nav></article>`;
    document.title = P.title + ' · Olympiad problems · Geodesic';
    h.typeset(view);
    clearInterval(clock);
    view.onsubmit = (e) => {
      const f = e.target.closest && e.target.closest('form[data-pf]'); if (!f || !view.contains(f)) return; e.preventDefault();
      const i = +f.dataset.pf, p = P.parts[i], raw = f.querySelector('input').value, v = num(raw), li = f.closest('.olyp-part'), fb = li.querySelector('.olyp-fb');
      if (!isFinite(v)) { fb.textContent = 'Type a number, e.g. 4.2e3 or 4200, without the unit.'; return; }
      const O = load(), S = stateOf(O, P.id); const s = (S.parts[i] = S.parts[i] || {}); s.a = raw.slice(0, 40); s.tried = 1; s.ok = ok(v, p) ? 1 : s.ok || 0; save(O);
      li.classList.toggle('ok', !!s.ok); li.classList.toggle('no', !s.ok);
      fb.textContent = ok(v, p) ? 'Correct.' : (p.a !== 0 && Math.abs(Math.log10(Math.abs(v / p.a)) - Math.round(Math.log10(Math.abs(v / p.a)))) < 0.01 && Math.round(Math.log10(Math.abs(v / p.a))) !== 0 ? 'The digits are right; the power of ten is not. Check the units asked for.' : 'Not within 2 % yet. Check your working, or open the solution.');
    };
    view.onclick = (e) => {
      const t = e.target;
      const lk = t.closest('[data-olike]');
      if (lk) {
        const out = view.querySelector('#forge-out'); lk.disabled = true; out.hidden = false; out.className = 'olyp-forge-out'; out.innerHTML = '<span class="spin" aria-hidden="true"></span><span id="forge-prog">Einstein is writing a new problem</span>';
        forge(P.level, P.area, P.gen ? null : P, view.querySelector('#forge-prog')).then((Q) => { location.hash = '#olyp-' + Q.id; })
          .catch((er) => { if (!out.isConnected) return; lk.disabled = false; out.className = 'olyp-forge-out err'; out.textContent = (er && er.message) || 'Einstein could not write a problem just now. Try again.'; });
        return;
      }
      const gd = t.closest('[data-ogdel]');
      if (gd) { if (!gd.dataset.sure) { gd.dataset.sure = '1'; gd.textContent = 'Remove it for good?'; return; } gsave(gload().filter((x) => x.id !== P.id)); location.hash = '#olyproblems'; return; }
      const sb = t.closest('[data-osol]'); if (sb) { const i = +sb.dataset.osol, box = view.querySelector(`[data-pi="${i}"] .olyp-sol`), open = box.hidden; box.hidden = !open; sb.setAttribute('aria-expanded', open); sb.textContent = open ? 'Hide the solution' : 'Solution'; const O = load(), S = stateOf(O, P.id); (S.parts[i] = S.parts[i] || {}).shown = open ? 1 : 0; save(O); if (open) h.typeset(box); return; }
      const hb = t.closest('[data-ohint]'); if (hb) { const p = view.querySelector('.olyp-hint'), open = p.hidden; p.hidden = !open; hb.setAttribute('aria-expanded', open); return; }
      const cb = t.closest('[data-oclock]'); if (cb) { const end = Date.now() + P.mins * 60000, el = view.querySelector('#olyp-clock'); cb.disabled = true; cb.textContent = 'Clock running'; clearInterval(clock); clock = setInterval(() => { if (!el.isConnected) { clearInterval(clock); return; } const left = Math.max(0, end - Date.now()), m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000); el.textContent = `${m}:${String(s).padStart(2, '0')}`; if (!left) { clearInterval(clock); el.classList.add('up'); el.textContent = 'Time'; } }, 250); return; }
    };
  }
  WL.pages = WL.pages || {};
  WL.pages.olyprobs = { match: (h) => h === 'olyproblems', nav: 'olympiad', render: (h, view) => renderList(view) };
  WL.pages.olyprob = { match: (h) => h.startsWith('olyp-'), nav: 'olympiad', render: (h, view) => renderProb(view, h.slice(5)) };
  WL.olyp = { list: PROBS, homeHTML, forge, mine: gload };
})();
/* Geodesic — competition physics: BPhO Rounds 0, 1 and 2, the US F = ma exam and USAPhO, and the IPhO.
   Pages: #pcompete (hub), #pcompete-<tier>, #pl-<lesson>, #pmock-<tier>. Lessons and mock papers live in js/pcomp-l1.js and
   js/pcomp-papers.js, written by src/pcomp/build.py, which computes every numerical answer from the data in the question;
   they load on the first visit through WL.pcL(lesson) and WL.pcP(paper). Long problems in the papers can also come from the
   olympiad set in oly-probs.js. Competition facts were checked against the organisers' pages in November 2026. */
(function () {
  const WL = (window.WL = window.WL || {});
  const LES = (WL.pcLessons = WL.pcLessons || []), PAP = (WL.pcPapers = WL.pcPapers || {});
  WL.pcL = (x) => { if (!LES.find((y) => y.id === x.id)) LES.push(x); };
  WL.pcP = (x) => { PAP[x.tier] = x; };
  const H = () => WL.app && WL.app.h;
  const FILES = ['js/pcomp-l1.js', 'js/pcomp-papers.js'];
  let loading = null;
  const loadAll = () => loading || (loading = Promise.all(FILES.map((src) => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = () => { loading = null; rej(new Error(src)); }; document.head.appendChild(s);
  }))));
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const KEY = () => 'wl-pcomp' + user();
  const get = () => { try { const o = JSON.parse(localStorage.getItem(KEY()) || '{}') || {}; o.p = o.p || {}; o.mock = o.mock || {}; o.hist = o.hist || {}; return o; } catch (e) { return { p: {}, mock: {}, hist: {} }; } };
  const put = (o) => { try { localStorage.setItem(KEY(), JSON.stringify(o)); } catch (e) {} };
  const AREAS = [['to', 'Tools of the trade'], ['me', 'Mechanics'], ['th', 'Thermal physics'], ['em', 'Electricity and magnetism'], ['wo', 'Waves, light and modern physics']];
  const LV = { 1: 'Warm-up', 2: 'Contest', 3: 'Hard', 4: 'Olympiad' };
  const FMT = { mc: 'Multiple choice', num: 'Numerical answer' };
  const LET = 'ABCDE';
  const dur = (m) => (m % 60 === 0 ? (m === 60 ? '1 hour' : m / 60 + ' hours') : m > 60 && m % 30 === 0 ? Math.floor(m / 60) + '½ hours' : m + ' minutes');
  const numOf = (s) => (WL.forge ? WL.forge.numOf(s) : parseFloat(s));
  const near = (v, p) => isFinite(v) && (p.a === 0 ? Math.abs(v) < 1e-9 : Math.abs(v / p.a - 1) <= (p.tol || 0.02));
  const sig = (x) => String(+Number(x).toPrecision(4));
  const decadeOff = (v, p) => p.a !== 0 && isFinite(v) && v !== 0 && Math.abs(Math.log10(Math.abs(v / p.a)) - Math.round(Math.log10(Math.abs(v / p.a)))) < 0.01 && Math.round(Math.log10(Math.abs(v / p.a))) !== 0;
  const bank = (id) => ((WL.olyp && WL.olyp.list) || []).find((x) => x.id === id);
  const resolve = (p) => (p && p.bank ? Object.assign({ t: 'long', fromBank: true }, bank(p.bank) || { title: 'Missing problem', stem: '', parts: [] }) : p);

  /* ---------- the competitions ---------- */
  const TIERS = [
    { id: 'r0', name: 'British Physics Olympiad, Round 0', short: 'BPhO Round 0', org: 'BPhO', lane: 'uk', col: 0, mins: 60, line: '25 multiple-choice questions · 1 hour',
      blurb: 'The way in to the British Physics Olympiad: quick problems on AS-level physics, without a calculator.',
      facts: [
        ['Who', 'Students in Year 13, Year 12 or below, entered by a teacher at a registered school.'],
        ['When', 'Early October. In 2026 it is on Thursday 1 October; international schools sit the BPhO papers after the UK.'],
        ['Format', '1 hour, 25 multiple-choice questions, no calculator. One mark for each right answer, with no negative marking.'],
        ['What next', 'Students above a threshold set each year by the BPhO are invited to Round 1.']],
      tests: 'AS-level physics used quickly and cleverly: mechanics, materials, electricity, waves, thermal and nuclear physics. Many questions reward estimation, units and elimination more than long calculation.',
      lessons: ['est', 'kin', 'dyn', 'con', 'em', 'wave', 'thermo'],
      strategy: ['There is no penalty for a wrong answer: answer every question.', 'Without a calculator, carry powers of ten and round early; the options are usually far apart.', 'Check units and extreme cases to cross out options before you calculate.', 'You have 2.4 minutes a question. Leave a slow one and come back to it.'],
      links: [['BPhO: competition dates', 'https://www.bpho.org.uk/Competitions/'], ['BPhO home page and past papers', 'https://www.bpho.org.uk/']] },
    { id: 'r1', name: 'British Physics Olympiad, Round 1', short: 'BPhO Round 1', org: 'BPhO', lane: 'uk', col: 1, mins: 120, line: 'Short problems, then long ones · 2 hours',
      blurb: 'The main UK round: a section of short problems, then longer questions that follow one situation.',
      facts: [
        ['Who', 'Year 13 or below, entered through school after qualifying; Round 0 is the usual route in.'],
        ['When', 'November. In 2026 it is on Thursday 12 November.'],
        ['Format', '2 hours on the BPhO competition platform. Section 1 is many short, independent problems, from which you choose up to a set number of marks; Section 2 is longer, multi-part questions.'],
        ['Awards', 'Top Gold, Gold, Silver and Bronze certificates. The highest scorers are invited to Round 2.']],
      tests: 'A-level physics pushed hard, with some calculus: mechanics and gravitation, fields and circuits, waves and optics, thermal, nuclear and quantum physics. Each long question builds a model of one situation.',
      lessons: ['est', 'kin', 'dyn', 'con', 'rot', 'osc', 'grav', 'thermo', 'em', 'wave'],
      strategy: ['In Section 1 you choose: spend the first minutes picking the problems you can finish.', 'Write the physics before the numbers. A right method with a slip still earns marks.', 'Keep symbols until the end, then substitute: it lets you check units and limiting cases.', 'In Section 2 the later parts often do not need earlier answers: read every part before you start.'],
      links: [['BPhO: competition dates', 'https://www.bpho.org.uk/Competitions/'], ['BPhO home page and past papers', 'https://www.bpho.org.uk/']] },
    { id: 'r2', name: 'British Physics Olympiad, Round 2', short: 'BPhO Round 2', org: 'BPhO', lane: 'uk', col: 2, mins: 180, line: 'Long problems · 3 hours',
      blurb: 'By invitation: long problems in the olympiad style, and the route to the UK IPhO team.',
      facts: [
        ['Who', 'By invitation, from the Round 1 results.'],
        ['When', 'February in recent years. Check the dates sheet on the BPhO site each year.'],
        ['Format', '3 hours of long problems with full written solutions.'],
        ['What next', 'Top scorers are invited to a training camp, from which the UK team for the International Physics Olympiad is chosen.']],
      tests: 'Olympiad physics: a situation you have not met before, a model you must build, and a chain of parts in which each result feeds the next. Calculus, approximations and careful algebra throughout.',
      lessons: ['est', 'con', 'rot', 'osc', 'grav', 'thermo', 'em', 'wave'],
      strategy: ['Read every problem first and start with the one whose physics you can see.', 'Draw the situation and name every quantity before writing equations.', 'Look for a conserved quantity: energy, momentum, angular momentum, charge.', 'If you are stuck, take the result a part asks you to show and use it for the next part.'],
      links: [['BPhO home page', 'https://www.bpho.org.uk/']] },
    { id: 'fma', name: 'F = ma exam', short: 'F = ma', org: 'AAPT', lane: 'us', col: 0, mins: 75, line: '25 multiple-choice questions · 75 minutes',
      blurb: 'The first round of the US Physics Team selection: mechanics only, against the clock.',
      facts: [
        ['Who', 'High-school students at registered schools. Only US citizens and permanent residents located in the US can go on to the USAPhO.'],
        ['When', 'February. In 2026 it was on 12 February, taken online.'],
        ['Format', '75 minutes, 25 multiple-choice questions on mechanics.'],
        ['What next', 'About 400 students are invited to the USAPhO. In 2026 the cut-off was 16 out of 25, and 440 students qualified.']],
      tests: 'Mechanics at the level of a strong first course, with algebra and a little calculus: kinematics, forces, energy and momentum, rotation, oscillations and gravitation.',
      lessons: ['est', 'kin', 'dyn', 'con', 'rot', 'osc', 'grav'],
      strategy: ['Three minutes a question on average: do not sink ten minutes into one.', 'Use the options: check units and limiting cases, and estimate before you compute.', 'Questions on one diagram often share work: reuse what you found.', 'A free-body diagram for every body, even under time pressure.'],
      links: [['AAPT: U.S. Physics Team', 'https://aapt.org/physicsteam/PT-students.cfm'], ['AAPT: 2026 F = ma results', 'https://aapt.org/physicsteam/2026/upload/2026_F_ma_results.pdf']] },
    { id: 'usapho', name: 'United States Physics Olympiad', short: 'USAPhO', org: 'AAPT', lane: 'us', col: 1, mins: 90, line: '6 problems · 3 hours',
      blurb: 'Free-response problems across all of physics; the top scorers join the US Physics Team camp.',
      facts: [
        ['Who', 'By invitation from the F = ma exam, for US citizens and permanent residents located in the US.'],
        ['When', 'Spring. In 2026 it was on 10 April, moved from 2 April.'],
        ['Format', '3 hours in two parts of 90 minutes, three free-response problems in each. Full justified solutions, with calculus.'],
        ['What next', 'About 20 students join the US Physics Team camp at the University of Maryland, where five are chosen for the IPhO.']],
      tests: 'All of high-school physics and some beyond: mechanics, electricity and magnetism, thermodynamics, fluids, waves, optics, relativity, nuclear and atomic physics.',
      lessons: ['con', 'rot', 'osc', 'grav', 'thermo', 'em', 'wave'],
      strategy: ['30 minutes a problem: budget, and move on when a part stalls.', 'Answers must be justified: write the principle you use for each step.', 'Check every final expression for units and for a limiting case.', 'Partial credit is real: a clear setup earns marks even without the final number.'],
      links: [['AAPT: U.S. Physics Team', 'https://aapt.org/physicsteam/PT-students.cfm'], ['AAPT: 2026 news, exam and solutions', 'https://www.aapt.org/physicsteam/2026/News.cfm']] },
    { id: 'ipho', name: 'International Physics Olympiad', short: 'IPhO', org: 'IPhO', lane: 'top', col: 3, mins: 75, line: 'Theory and experiment · 5 hours each',
      blurb: 'The summit: up to five students from each country, a five-hour theory exam and a five-hour experiment.',
      facts: [
        ['Who', 'Up to five secondary-school students per country, chosen by each national olympiad: the BPhO in the UK, the AAPT in the US.'],
        ['When', 'July. The 56th IPhO was held in Bucaramanga, Colombia, from 4 to 12 July 2026, with nearly 400 students from 84 countries. Saudi Arabia is to host in 2027.'],
        ['Format', 'A theory exam of three problems in five hours, and an experimental exam of five hours, on separate days.'],
        ['Medals', 'Gold, silver and bronze medals and honourable mentions, awarded on the combined score.']],
      tests: 'Physics beyond the school syllabus, built up inside each problem: every theory problem takes one situation from a simple model to a surprising result over many linked parts.',
      lessons: ['est', 'osc', 'grav', 'thermo', 'em', 'wave'],
      strategy: ['Each problem is about 100 minutes. The early parts are easier: secure them.', 'Later parts often give you an expression to use: you can go on even if you could not derive it.', 'Approximations are expected; say which you make and check the size of what you drop.', 'Units, signs and limiting cases at every step.'],
      links: [['IPhO: statutes and syllabus', 'https://ipho-new.org/'], ['Physics Today: the 2026 olympiads', 'https://physicstoday.aip.org/news/high-schoolers-compete-in-european-and-international-physics-olympiads']] }
  ];
  const tierOf = (id) => TIERS.find((t) => t.id === id);

  /* ---------- small helpers ---------- */
  const solved = (o, pid) => !!(o.p[pid] && o.p[pid].ok);
  const lessonDone = (o, L) => L.pr.filter((p, i) => solved(o, L.id + '-p' + (i + 1))).length;
  function crumbs(parts) { const h = H(); return `<p class="crumbs">${parts.map(([t, href]) => (href ? `<a href="${href}">${h.esc(t)}</a>` : `<span>${h.esc(t)}</span>`)).join(' <span aria-hidden="true">›</span> ')}</p>`; }
  const trackbar = () => `<nav class="trackbar" aria-label="Tracks"><a href="#physics">Physics</a><a href="#maths">Maths</a><a href="#pcompete" aria-current="page">Competition</a></nav>`;
  const subjects = (cur) => `<nav class="cm-subj" aria-label="Competition subject"><a href="#pcompete"${cur === 'p' ? ' aria-current="page"' : ''}>Physics competitions</a><a href="#compete"${cur === 'm' ? ' aria-current="page"' : ''}>Maths competitions</a></nav>`;
  WL.compSubjects = subjects;
  const loadingView = (view) => { view.innerHTML = `<section class="cm-page">${trackbar()}<p class="muted cm-loading">Loading competition physics…</p></section>`; };
  const failView = (view) => { view.innerHTML = `<section class="cm-page">${trackbar()}<p>The competition pages could not load. Check your connection and reload.</p></section>`; };

  /* ---------- a problem with an answer box, a hint, a solution and Einstein ---------- */
  function qHTML(p, pid, o, opts = {}) {
    const h = H(), s = o.p[pid] || {}, ok = s.ok;
    const box = p.t === 'mc'
      ? `<form class="cm-ans cm-mc" data-pf="${pid}"><fieldset><legend class="vh">Choose an answer</legend>${p.ch.map((c, i) => `<label class="cm-opt"><input type="radio" name="o-${pid}" value="${i}"${s.a === String(i) ? ' checked' : ''}><b>${LET[i]}</b><span>${h.pr(c)}</span></label>`).join('')}</fieldset><button class="btn small" type="submit">Check</button></form>`
      : `<form class="cm-ans cm-int pc-num" data-pf="${pid}"><label class="vh" for="in-${pid}">Your answer${p.u ? ' in ' + h.esc(p.u) : ''}</label><input id="in-${pid}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Your answer" value="${h.esc(s.a || '')}">${p.u ? `<span class="pc-unit">${h.esc(p.u)}</span>` : ''}<button class="btn small" type="submit">Check</button></form>`;
    return `<div class="cm-q${ok ? ' ok' : s.tried ? ' no' : ''}" data-pid="${pid}" id="q-${pid}">
      <p class="cm-qmeta">${opts.n ? `<b class="cm-qn">${opts.n}</b>` : ''}<span class="cm-lv lv${p.lv}">${LV[p.lv] || ''}</span><span>${FMT[p.t]}${p.t === 'num' ? ', checked to 2 %' : ''}</span></p>
      <div class="cm-qtext">${h.pr(p.q)}</div>${box}
      <p class="cm-fb" aria-live="polite">${s.ok ? 'Correct.' : s.tried ? 'Not yet. Try again, take the hint, or open the solution.' : ''}</p>
      <div class="cm-tools">${p.hint ? `<button type="button" class="btn small ghost" data-hint="${pid}" aria-expanded="false">Hint</button>` : ''}<button type="button" class="btn small ghost" data-sol="${pid}" aria-expanded="false">Solution</button><button type="button" class="btn small ghost" data-pcask="${pid}">Ask Einstein</button></div>
      ${p.hint ? `<p class="cm-hint" hidden>${h.pr(p.hint)}</p>` : ''}
      <div class="cm-sol" hidden><p>${h.pr(p.sol)}</p>${p.t === 'mc' ? `<p class="cm-key">Answer: <b>${LET[p.a]}</b> (${h.pr(p.ch[p.a])})</p>` : `<p class="cm-key">Answer: <b>${sig(p.a)}</b> ${h.esc(p.u || '')}</p>`}</div></div>`;
  }
  const COACH = 'You are the competition-physics coach on Geodesic, an educational website, helping a student with olympiad and contest problems (BPhO, F = ma, USAPhO, IPhO). You see the problem and its checked answer: keep your help correct, and do not give the final answer unless the student asks for it. Prefer a question or the next idea to a full solution. Write maths in LaTeX between $…$. Reply in the language the student writes in.';
  function askAbout(p, label, title) {
    if (!WL.tutor) return;
    const key = p.t === 'mc' ? `${LET[p.a]} (${p.ch[p.a]})` : `${sig(p.a)} ${p.u || ''}`;
    WL.tutor.open({ topic: { key: 'pc-' + title, title, system: COACH, context: '' },
      chip: { label, suggestions: ['Give me a hint, not the answer', 'Which principle should I use here?', 'Check my approach', 'Explain the model solution'],
        text: `${label}: ${p.q}${p.t === 'mc' ? '\nOptions: ' + p.ch.map((c, i) => `${LET[i]}) ${c}`).join('   ') : ''}\nChecked answer (do not reveal unless asked): ${key}\nModel solution: ${p.sol}` } });
  }
  function wireProblems(view, find, title) {
    view.onsubmit = (e) => {
      const f = e.target.closest && e.target.closest('form[data-pf]'); if (!f || !view.contains(f)) return; e.preventDefault();
      const pid = f.dataset.pf, p = find(pid); if (!p) return;
      const box = f.closest('.cm-q'), fb = box.querySelector('.cm-fb'), o = get(), s = (o.p[pid] = o.p[pid] || {});
      let good = false, raw = '', note = '';
      if (p.t === 'mc') { const c = f.querySelector('input[type=radio]:checked'); if (!c) { fb.textContent = 'Choose one of A to E first.'; return; } raw = c.value; good = +c.value === p.a; }
      else { raw = f.querySelector('input').value; const v = numOf(raw); if (!isFinite(v)) { fb.textContent = 'Type a number, such as 4.2e3 or 4200, without the unit.'; return; } good = near(v, p); if (!good && decadeOff(v, p)) note = 'The digits are right but the power of ten is not: check the unit asked for.'; }
      s.a = String(raw).slice(0, 24); s.tried = 1; if (good) s.ok = 1; put(o);
      box.classList.toggle('ok', !!s.ok); box.classList.toggle('no', !s.ok);
      fb.textContent = good ? 'Correct.' : note || 'Not yet. Try again, take the hint, or open the solution.';
    };
    view.onchange = null;
    view.onclick = (e) => {
      const hb = e.target.closest('[data-hint]'); if (hb) { const q = hb.closest('.cm-q'), el = q.querySelector('.cm-hint'), open = el.hidden; el.hidden = !open; hb.setAttribute('aria-expanded', open); return; }
      const sb = e.target.closest('[data-sol]'); if (sb) { const q = sb.closest('.cm-q'), el = q.querySelector('.cm-sol'), open = el.hidden; el.hidden = !open; sb.setAttribute('aria-expanded', open); sb.textContent = open ? 'Hide the solution' : 'Solution'; if (open) H().typeset(el); return; }
      const ab = e.target.closest('[data-pcask]'); if (ab) { const p = find(ab.dataset.pcask), n = ab.closest('.cm-q').querySelector('.cm-qn'); if (p) askAbout(p, 'Problem ' + (n ? n.textContent : ''), title || 'Competition physics'); return; }
      const xb = e.target.closest('[data-exsol]'); if (xb) { const el = xb.nextElementSibling, open = el.hidden; el.hidden = !open; xb.setAttribute('aria-expanded', open); xb.textContent = open ? 'Hide the solution' : 'Show the solution'; if (open) H().typeset(el); return; }
      const kb = e.target.closest('[data-hook]'); if (kb) { const el = kb.nextElementSibling, open = el.hidden; el.hidden = !open; kb.setAttribute('aria-expanded', open); kb.textContent = open ? 'Hide' : 'See the answer'; if (open) H().typeset(el); }
    };
  }

  /* ---------- #pcompete ---------- */
  function renderHub(view) {
    const h = H(), o = get();
    const stop = (t) => { const hist = (o.hist[t.id] || []).slice(-1)[0]; return `<a class="cm-stop" href="#pcompete-${t.id}"><span class="cm-org">${t.org}</span><b>${h.esc(t.short)}</b><span class="cm-sl">${h.esc(t.line)}</span>${hist ? `<span class="cm-last">Last mock ${hist.score}/${hist.max}</span>` : ''}</a>`; };
    const lane = (id, label, end) => `<div class="cm-lane" data-lane="${id}"><span class="cm-lane-n">${label}</span>${[0, 1, 2].map((c) => { const t = TIERS.find((x) => x.lane === id && x.col === c); return t ? stop(t) : `<span class="cm-stop cm-off"><span class="cm-org">${end[0]}</span><b>${end[1]}</b><span class="cm-sl">${end[2]}</span></span>`; }).join('<span class="cm-arrow" aria-hidden="true">→</span>')}</div>`;
    const lessonCard = (L) => { const d = lessonDone(o, L); return `<a class="cm-lcard${d === L.pr.length ? ' done' : ''}" href="#pl-${L.id}"><b>${h.esc(L.title)}</b><span class="cm-ldots" aria-label="${d} of ${L.pr.length} problems done">${L.pr.map((p, i) => `<i${solved(o, L.id + '-p' + (i + 1)) ? ' class="on"' : ''}></i>`).join('')}</span></a>`; };
    const ip = tierOf('ipho');
    view.innerHTML = `<section class="cm-page cm-hub">${trackbar()}${subjects('p')}
      <header class="cm-head"><h1>Competition physics</h1>
        <p class="prlead">Olympiad physics asks you to build a model of a situation you have never seen, using physics you mostly know. This section prepares you for the British and US olympiads and the IPhO: lessons on the methods that keep coming back, a mock paper for every round, timed and marked, and new problems from Einstein whenever you want them.</p></header>
      <h2 class="cm-h2">The competitions</h2>
      <div class="cm-ladder">${lane('uk', 'UK', ['', '', ''])}${lane('us', 'US', ['AAPT', 'US Physics Team camp', 'about 20 students, by invitation'])}
        <a class="pc-summit" href="#pcompete-ipho"><span class="cm-org">${h.esc(ip.org)}</span><b>${h.esc(ip.name)}</b><span class="cm-sl">${h.esc(ip.blurb)}</span></a>
        <p class="cm-note">Both national routes lead to the IPhO. Columns are a rough guide to difficulty. Beyond these: the PhysicsBowl, open to high schools anywhere (40 questions in 45 minutes), and the Asian, European and other regional olympiads.</p></div>
      <h2 class="cm-h2">Lessons</h2>
      <p class="sec-sub">Each lesson starts with a puzzle, explains the few ideas that solve most problems of its kind, works two examples, and ends with four problems of rising difficulty. Every problem was written for this site, and every number in its answer was computed from the data you are given.</p>
      <div class="cm-areas">${AREAS.map(([a, name]) => { const ls = LES.filter((L) => L.area === a); return ls.length ? `<div class="cm-area"><h3>${name}</h3><div class="cm-lgrid">${ls.map(lessonCard).join('')}</div></div>` : ''; }).join('')}</div>
      <h2 class="cm-h2">Olympiad problems</h2>
      <p class="sec-sub">Twenty multi-part problems in the style of national rounds and the IPhO, and as many new ones as you like from Einstein, at the level you choose. <a href="#olyproblems">Go to the problems</a>.</p>
      <h2 class="cm-h2">How to use this</h2>
      <ol class="cm-how"><li><b>Learn the methods.</b> Work through the lessons for your competition, trying each problem before you open the solution.</li><li><b>Sit a mock.</b> Every competition page has a paper in its format, timed and marked.</li><li><b>Go to the real papers.</b> Past papers are linked from each competition page; they are the best practice of all.</li></ol>
    </section>`;
    document.title = 'Competition physics · Geodesic';
  }

  /* ---------- #pcompete-<tier> ---------- */
  function renderTier(view, id) {
    const h = H(), t = tierOf(id), o = get();
    if (!t) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That competition is not here</h1><p><a href="#pcompete">Competition physics</a></p></section>`; return; }
    const P = PAP[t.id], hist = o.hist[t.id] || [], run = o.mock[t.id];
    const lessonRow = (lid, i) => { const L = LES.find((x) => x.id === lid); if (!L) return ''; const d = lessonDone(o, L); return `<li><a href="#pl-${L.id}"><span class="cm-n">${i + 1}</span><span class="cm-lt">${h.esc(L.title)}</span><span class="cm-ld">${d}/${L.pr.length}</span></a></li>`; };
    const count = P ? P.sections.reduce((a, s) => a + s.items.length, 0) : 0;
    view.innerHTML = `<section class="cm-page cm-tier">${trackbar()}${crumbs([['Competition physics', '#pcompete'], [t.short]])}
      <header class="cm-head"><p class="cm-orgline">${h.esc(t.org)} · ${h.esc(t.line)}</p><h1>${h.esc(t.name)}</h1><p class="prlead">${h.esc(t.blurb)}</p></header>
      <div class="cm-tgrid">
        <div>
          <dl class="cm-facts">${t.facts.map(([k, v]) => `<div><dt>${h.esc(k)}</dt><dd>${h.esc(v)}</dd></div>`).join('')}</dl>
          <p class="cm-src">Checked against the organisers’ pages in November 2026. Dates, formats and thresholds change: ${t.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${h.esc(n)}</a>`).join(' · ')}.</p>
          <h2 class="cm-h2">What it tests</h2><p>${h.esc(t.tests)}</p>
          <h2 class="cm-h2">Strategy</h2><ul class="cm-strat">${t.strategy.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul>
        </div>
        <aside class="cm-side">
          <div class="cm-mockbox"><h2>Mock paper</h2>${P ? `<p>${count} ${P.kind === 'mc' ? 'questions' : 'problems'} in the style of ${h.esc(t.short)}, ${dur(P.mins)}, marked as you finish.${t.id === 'ipho' ? ' Two sections of an IPhO-style theory problem, not a whole paper.' : ''}</p>
            <a class="btn primary" href="#pmock-${t.id}">${run && !run.done ? 'Resume the paper' : run && run.done ? 'See your last paper' : 'Sit the paper'}</a>
            ${hist.length ? `<ul class="cm-hist">${hist.slice(-4).reverse().map((x) => `<li><span>${new Date(x.at).toLocaleDateString()}</span><b>${x.score} / ${x.max}</b></li>`).join('')}</ul>` : ''}` : '<p class="muted">Not available.</p>'}</div>
          <div class="cm-prep"><h2>Lessons, in this order</h2><ol class="cm-lessonlist">${t.lessons.map(lessonRow).join('')}</ol></div>
        </aside>
      </div>
      <section class="cm-fresh" id="pc-fresh" aria-labelledby="pc-fresh-h">${freshHTML(t, o)}</section></section>`;
    document.title = t.short + ' · Competition physics · Geodesic';
    wireProblems(view, (pid) => freshFind(t.id, pid), t.short);
    const base = view.onclick;
    view.onclick = (e) => { if (!freshClick(e, view, t)) base(e); };
    H().typeset(view);
  }

  /* ---------- fresh problems from Einstein, in the tier's own format ---------- */
  const FKEY = () => 'wl-pcfresh' + user();
  const fget = () => { try { return JSON.parse(localStorage.getItem(FKEY()) || '{}') || {}; } catch (e) { return {}; } };
  const fput = (x) => { try { localStorage.setItem(FKEY(), JSON.stringify(x)); } catch (e) {} };
  const KIND = { r0: 'mc', fma: 'mc', r1: 'num', r2: 'long', usapho: 'long', ipho: 'long' };
  const LONGLV = { r2: 2, usapho: 2, ipho: 3 };
  function freshFind(tid, pid) { const m = String(pid).match(/^px-([a-z0-9]+)-([a-z0-9]+)-(\d+)$/); if (!m) return null; const set = (fget()[m[1]] || []).find((x) => x.id === m[2]); return set ? set.items[+m[3]] : null; }
  function freshHTML(t, o) {
    const h = H(), kind = KIND[t.id];
    if (kind === 'long') {
      const mine = ((WL.olyp && WL.olyp.mine && WL.olyp.mine()) || []).filter((P) => P.tier === t.id).reverse();
      return `<div class="cm-fresh-h"><div><h2 id="pc-fresh-h">A new long problem from Einstein</h2>
          <p>Einstein reads the long problems in the ${h.esc(t.short)} mock and the olympiad set at the same level, writes a new one in the same style, then solves every part again from scratch and removes any part whose two answers differ by more than 2 %.</p></div>
          <button type="button" class="btn primary" data-pcforge>Write a long problem</button></div>
        <p class="cm-fresh-out" id="pc-fresh-out" aria-live="polite" hidden></p>
        ${mine.length ? `<div class="olyp-grid">${mine.map((P) => `<a class="olyp-card gen" href="#olyp-${P.id}"><span class="olyp-area">${h.esc(P.area)} · Einstein</span><b>${h.esc(P.title)}</b><span class="olyp-meta">${P.parts.length} parts · about ${P.mins} min</span></a>`).join('')}</div>` : ''}`;
    }
    const sets = fget()[t.id] || [];
    const note = (g) => (!g ? '' : g.checked === false ? 'answers not double-checked' : g.dropped ? `${g.dropped} dropped after the check` : 'answers double-checked');
    return `<div class="cm-fresh-h"><div><h2 id="pc-fresh-h">Fresh problems from Einstein</h2>
        <p>Einstein reads the ${h.esc(t.short)} mock paper on this page and the format of the competition, then writes five new ${kind === 'mc' ? 'questions' : 'problems'} at the same standard, solves each one again from scratch, and drops any whose two answers disagree.</p></div>
        <button type="button" class="btn primary" data-pcfresh>${sets.length ? 'Five more' : 'Write five problems'}</button></div>
      <p class="cm-fresh-out" id="pc-fresh-out" aria-live="polite" hidden></p>
      ${sets.slice().reverse().map((set) => { const k = sets.indexOf(set); return `<div class="cm-fresh-set" data-fset="${set.id}"><h3>Set ${k + 1} <small>${new Date(set.at).toLocaleDateString()} · ${set.items.length} problems · ${note(set.gen)}</small><button type="button" class="btn small ghost" data-pcfdel="${set.id}">Remove</button></h3>
        ${set.items.map((p, i) => qHTML(p, `px-${t.id}-${set.id}-${i}`, o, { n: i + 1 })).join('')}</div>`; }).join('')}`;
  }
  function freshClick(e, view, t) {
    const del = e.target.closest('[data-pcfdel]');
    if (del) {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Remove this set?'; return true; }
      const F = fget(); F[t.id] = (F[t.id] || []).filter((x) => x.id !== del.dataset.pcfdel); fput(F);
      const sec = view.querySelector('#pc-fresh'); sec.innerHTML = freshHTML(t, get()); H().typeset(sec); return true;
    }
    const lb = e.target.closest('[data-pcforge]');
    if (lb) {
      if (!(WL.olyp && WL.olyp.forge)) return true;
      const out = view.querySelector('#pc-fresh-out'), P = PAP[t.id], longs = P ? P.sections.flatMap((s) => s.items).filter((x) => x.t === 'long' && !x.bank) : [];
      lb.disabled = true; out.hidden = false; out.className = 'cm-fresh-out'; out.innerHTML = '<span class="spin" aria-hidden="true"></span><span id="pc-fresh-prog">Einstein is writing a new problem</span>';
      WL.olyp.forge(LONGLV[t.id] || 2, '', longs[Math.floor(Math.random() * longs.length)] || null, view.querySelector('#pc-fresh-prog'), t.id)
        .then((Q) => { location.hash = '#olyp-' + Q.id; })
        .catch((er) => { if (!out.isConnected) return; lb.disabled = false; out.className = 'cm-fresh-out err'; out.textContent = (er && er.message) || 'Einstein could not write a problem just now. Try again.'; });
      return true;
    }
    const b = e.target.closest('[data-pcfresh]'); if (!b) return false;
    if (!WL.forge) return true;
    const out = view.querySelector('#pc-fresh-out'), kind = KIND[t.id], items = PAP[t.id] ? PAP[t.id].sections.flatMap((s) => s.items).filter((x) => x.t === kind) : [];
    const like = items.length ? [items[0], items[Math.floor(items.length / 2)], items[items.length - 1]] : [];
    const avoid = (fget()[t.id] || []).flatMap((x) => x.items.map((p) => p.q)).slice(-15);
    const fmt = (t.facts.find(([k]) => k === 'Format') || [])[1] || t.line;
    b.disabled = true; out.hidden = false; out.className = 'cm-fresh-out'; out.innerHTML = '<span class="spin" aria-hidden="true"></span><span id="pc-fresh-prog">Einstein is writing five problems</span>';
    WL.forge.contest({ subject: 'physics', tier: `${t.name} (${t.short})`, kind, n: 5, like, avoid, profile: `The competition: ${t.line}. ${fmt} What it tests: ${t.tests}${t.id === 'r0' ? ' No calculator is allowed, so choose numbers that work out by hand, and use g = 10 N kg⁻¹.' : t.id === 'fma' ? ' Mechanics only; use g = 10 m/s².' : ''}` }, WL.forge.progress(view.querySelector('#pc-fresh-prog'), 'five problems', 5))
      .then((r) => {
        r.items.forEach((p) => { if (p.t === 'num') p.tol = 0.02; });
        const F = fget(), sid = Date.now().toString(36); F[t.id] = [...(F[t.id] || []), { id: sid, at: Date.now(), gen: r.gen, items: r.items }].slice(-4); fput(F);
        const sec = view.querySelector('#pc-fresh'); if (!sec) return;
        sec.innerHTML = freshHTML(t, get()); H().typeset(sec);
        const el = sec.querySelector(`[data-fset="${sid}"]`); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      })
      .catch((er) => { if (!out.isConnected) return; b.disabled = false; out.className = 'cm-fresh-out err'; out.textContent = (er && er.message) || 'Einstein could not write the problems just now. Try again.'; });
    return true;
  }

  /* ---------- #pl-<lesson> ---------- */
  function renderLesson(view, id) {
    const h = H(), L = LES.find((x) => x.id === id), o = get();
    if (!L) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That lesson is not here</h1><p><a href="#pcompete">Competition physics</a></p></section>`; return; }
    const i0 = LES.indexOf(L), prev = LES[i0 - 1], next = LES[i0 + 1], area = (AREAS.find((a) => a[0] === L.area) || [])[1];
    const tiers = TIERS.filter((t) => t.lessons.includes(L.id));
    view.innerHTML = `<article class="cm-page cm-lesson">${trackbar()}${crumbs([['Competition physics', '#pcompete'], [area]])}
      <header class="cm-head"><h1>${h.esc(L.title)}</h1><p class="cm-tierchips">Useful for ${tiers.map((t) => `<a href="#pcompete-${t.id}">${h.esc(t.short)}</a>`).join('')}</p></header>
      <section class="cm-hook"><h2>Start with a puzzle</h2><div class="cm-qtext">${h.pr(L.hook[0])}</div><button type="button" class="btn small ghost" data-hook aria-expanded="false">See the answer</button><div class="cm-hooka" hidden><p>${h.pr(L.hook[1])}</p></div></section>
      <section class="cm-ideas"><h2 class="cm-h2">The ideas</h2>${L.ideas.map(([t, x]) => `<div class="cm-idea"><h3>${h.esc(t)}</h3><p>${h.pr(x)}</p></div>`).join('')}</section>
      <section><h2 class="cm-h2">Worked examples</h2><p class="sec-sub">Try each one before you open the solution.</p>${L.ex.map((x, i) => `<div class="cm-ex"><p class="cm-exn">Example ${i + 1}</p><div class="cm-qtext">${h.pr(x.q)}</div><button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><ol>${x.sol.map((s) => `<li>${h.pr(s)}</li>`).join('')}</ol><p class="cm-key">Answer: ${h.pr(x.a)}</p></div></div>`).join('')}</section>
      <section><h2 class="cm-h2">Problems</h2>${L.pr.map((p, i) => qHTML(p, L.id + '-p' + (i + 1), o, { n: i + 1 })).join('')}</section>
      <section class="cm-traps"><h2 class="cm-h2">Traps</h2><ul>${L.traps.map((x) => `<li>${h.pr(x)}</li>`).join('')}</ul></section>
      <nav class="prnext">${prev ? `<a href="#pl-${prev.id}">‹ ${h.esc(prev.title)}</a>` : '<a href="#pcompete">‹ All lessons</a>'}${next ? `<a href="#pl-${next.id}">${h.esc(next.title)} ›</a>` : '<a href="#pcompete">All lessons ›</a>'}</nav></article>`;
    document.title = L.title + ' · Competition physics · Geodesic';
    h.typeset(view);
    wireProblems(view, (pid) => { const m = pid.match(/^(.*)-p(\d+)$/); return m && m[1] === L.id ? L.pr[+m[2] - 1] : null; }, L.title);
  }

  /* ---------- #pmock-<tier>: a paper in the competition's format, timed, then marked ---------- */
  let clock = 0;
  const fmtT = (ms) => { const s = Math.max(0, Math.round(ms / 1000)), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60; return (hh ? hh + ':' + String(mm).padStart(2, '0') : mm) + ':' + String(ss).padStart(2, '0'); };
  /* every answer box in the paper, in order: [key, item, part index or -1, marks] */
  function slots(P) {
    const out = [];
    P.sections.forEach((s, si) => s.items.forEach((it0, ii) => {
      const it = resolve(it0);
      if (it.t === 'long') it.parts.forEach((pt, pi) => out.push([`${si}.${ii}.${pi}`, Object.assign({ t: 'num' }, pt), pi, 5]));
      else out.push([`${si}.${ii}`, it, -1, it.t === 'mc' ? 1 : 5]);
    }));
    return out;
  }
  const right = (p, a) => a != null && a !== '' && (p.t === 'mc' ? +a === p.a : near(numOf(a), p));
  function score(P, ans) {
    let s = 0, max = 0, r = 0, w = 0, b = 0;
    slots(P).forEach(([k, p, , m]) => { max += m; const has = ans[k] != null && ans[k] !== ''; if (right(p, ans[k])) { s += m; r++; } else if (has) w++; else b++; });
    return { score: s, max, right: r, wrong: w, blank: b };
  }
  function itemHTML(it0, si, ii, n, run, review) {
    const h = H(), it = resolve(it0), a = run.ans;
    const numBox = (k, p, label) => {
      const v = a[k], ok = review && right(p, v), has = v != null && v !== '';
      return `<div class="pc-mnum${review ? (ok ? ' ok' : has ? ' no' : ' blank') : ''}"><label class="vh" for="m-${k}">${label}</label><input id="m-${k}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-mk="${k}" value="${h.esc(v || '')}" placeholder="Your answer"${review ? ' readonly' : ''}>${p.u ? `<span class="pc-unit">${h.esc(p.u)}</span>` : ''}${review ? `<span class="pc-mres">${ok ? 'Right' : has ? 'Not within 2 %' : 'Blank'}: <b>${sig(p.a)}</b> ${h.esc(p.u || '')}</span>` : ''}</div>`;
    };
    if (it.t === 'long') {
      return `<li class="cm-mq pc-long" id="mq-${si}-${ii}"><p class="cm-qmeta"><b class="cm-qn">${n}</b><span>${h.esc(it.title)}</span><span>${it.parts.length * 5} marks${it.fromBank ? ' · from the olympiad problem set' : ''}</span></p>
        <div class="cm-qtext">${h.pr(it.stem)}</div>
        <ol class="pc-parts" type="a">${it.parts.map((pt, pi) => `<li><div class="cm-qtext">${h.pr(pt.q)}</div>${numBox(`${si}.${ii}.${pi}`, pt, `Answer to ${n}(${String.fromCharCode(97 + pi)})`)}${review ? `<button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><p>${h.pr(pt.sol)}</p></div>` : ''}</li>`).join('')}</ol></li>`;
    }
    const k = `${si}.${ii}`;
    if (it.t === 'mc') {
      const v = a[k], has = v != null && v !== '', ok = review && right(it, v);
      return `<li class="cm-mq${review ? (ok ? ' ok' : has ? ' no' : ' blank') : ''}" id="mq-${si}-${ii}"><p class="cm-qmeta"><b class="cm-qn">${n}</b>${review ? `<span>${ok ? 'Right' : has ? `You chose ${LET[+v]}` : 'Blank'} · answer ${LET[it.a]}</span>` : ''}</p><div class="cm-qtext">${h.pr(it.q)}</div>
        <div class="cm-mc" role="radiogroup" aria-label="Answer to question ${n}">${it.ch.map((c, j) => `<label class="cm-opt${review && j === it.a ? ' key' : ''}"><input type="radio" name="m-${k}" value="${j}" data-mk="${k}"${v === String(j) ? ' checked' : ''}${review ? ' disabled' : ''}><b>${LET[j]}</b><span>${h.pr(c)}</span></label>`).join('')}${review ? '' : `<button type="button" class="btn small ghost" data-mclear="${k}">Clear</button>`}</div>
        ${review ? `<button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><p>${h.pr(it.sol)}</p></div>` : ''}</li>`;
    }
    return `<li class="cm-mq" id="mq-${si}-${ii}"><p class="cm-qmeta"><b class="cm-qn">${n}</b><span>5 marks</span></p><div class="cm-qtext">${h.pr(it.q)}</div>${numBox(k, it, `Answer to question ${n}`)}
      ${review ? `<button type="button" class="btn small ghost" data-exsol aria-expanded="false">Show the solution</button><div class="cm-exsol" hidden><p>${h.pr(it.sol)}</p></div>` : ''}</li>`;
  }
  function paperHTML(P, run, review) {
    const h = H(); let n = 0;
    return P.sections.map((s, si) => `${s.name ? `<h2 class="cm-h2 pc-sec">${h.esc(s.name)}</h2>` : ''}${s.note ? `<p class="sec-sub">${h.esc(s.note)}</p>` : ''}<ol class="cm-paper${review ? ' cm-review' : ''}">${s.items.map((it, ii) => itemHTML(it, si, ii, ++n, run, review)).join('')}</ol>`).join('');
  }
  function renderMock(view, id) {
    const h = H(), t = tierOf(id), P = t && PAP[t.id];
    clearInterval(clock);
    if (!t || !P) { view.innerHTML = `<section class="cm-page">${trackbar()}<h1>That paper is not here</h1><p><a href="#pcompete">Competition physics</a></p></section>`; return; }
    const o = get(), run = o.mock[t.id], count = slots(P).length;
    const head = `${trackbar()}${crumbs([['Competition physics', '#pcompete'], [t.short, '#pcompete-' + t.id], ['Mock paper']])}<header class="cm-head"><p class="cm-orgline">Mock paper · ${dur(P.mins)}</p><h1>${h.esc(t.short)} mock paper</h1></header>`;
    if (!run) {
      view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-rules"><p>Written for this site in the style of ${h.esc(t.name)}. You have ${dur(P.mins)}. ${h.esc(P.rules)}</p><p>Work on paper and type each answer as you go: numbers only, in the unit shown. The clock keeps running if you leave the page, and the paper is marked when time runs out or when you finish.</p><button type="button" class="btn primary" data-mstart>Start the clock</button></div></section>`;
      document.title = t.short + ' mock paper · Geodesic';
      view.onclick = (e) => { if (e.target.closest('[data-mstart]')) { const O = get(); O.mock[t.id] = { start: Date.now(), ans: {}, done: false }; put(O); renderMock(view, id); window.scrollTo(0, 0); } };
      view.onsubmit = null; view.onchange = view.oninput = null; return;
    }
    if (run.done) { renderReview(view, t, P, run, head); return; }
    const end = run.start + P.mins * 60000;
    view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-mbar"><span class="cm-clock" id="cm-clock">${fmtT(end - Date.now())}</span><span class="cm-prog" id="cm-prog"></span><button type="button" class="btn small" data-mfinish>Finish practice</button></div>${paperHTML(P, run, false)}<div class="cm-mend"><button type="button" class="btn primary" data-mfinish>Finish practice</button></div></section>`;
    document.title = t.short + ' mock paper · Geodesic';
    h.typeset(view);
    const prog = () => { const k = Object.keys(run.ans).filter((x) => run.ans[x] !== '').length, el = view.querySelector('#cm-prog'); if (el) el.textContent = `${k} of ${count} answered`; };
    prog();
    const finish = () => { const O = get(), R = O.mock[t.id]; if (!R || R.done) return; R.done = true; R.end = Date.now(); const sc = score(P, R.ans); O.hist[t.id] = (O.hist[t.id] || []).concat([{ at: Date.now(), score: sc.score, max: sc.max }]).slice(-20); put(O); clearInterval(clock); renderMock(view, id); window.scrollTo(0, 0); };
    clock = setInterval(() => { const el = document.getElementById('cm-clock'); if (!el) { clearInterval(clock); return; } const left = end - Date.now(); el.textContent = fmtT(left); el.classList.toggle('low', left < 5 * 60000); if (left <= 0) finish(); }, 1000);
    if (end - Date.now() <= 0) { finish(); return; }
    let armed = 0;
    view.onclick = (e) => {
      const fb = e.target.closest('[data-mfinish]'); if (fb) { if (Date.now() - armed < 4000) { finish(); return; } armed = Date.now(); view.querySelectorAll('[data-mfinish]').forEach((b) => (b.textContent = 'Press again to finish')); setTimeout(() => view.querySelectorAll('[data-mfinish]').forEach((b) => (b.textContent = 'Finish and mark')), 4000); return; }
      const cb = e.target.closest('[data-mclear]'); if (cb) { const k = cb.dataset.mclear; view.querySelectorAll(`input[name="m-${k}"]`).forEach((r) => (r.checked = false)); const O = get(); delete O.mock[t.id].ans[k]; put(O); run.ans = O.mock[t.id].ans; prog(); }
    };
    view.onchange = view.oninput = (e) => {
      const inp = e.target.closest && e.target.closest('[data-mk]'); if (!inp) return; const k = inp.dataset.mk, O = get(); if (!O.mock[t.id] || O.mock[t.id].done) return;
      const v = String(inp.value).slice(0, 24);
      if (v === '') delete O.mock[t.id].ans[k]; else O.mock[t.id].ans[k] = v; put(O); run.ans = O.mock[t.id].ans; prog();
    };
    view.onsubmit = (e) => e.preventDefault();
  }
  function renderReview(view, t, P, run, head) {
    const h = H(), sc = score(P, run.ans);
    const extra = t.id === 'fma' ? ' For comparison, the 2026 cut-off for the USAPhO was 16 out of 25.' : t.id === 'r0' ? ' The real Round 0 threshold for Round 1 is set by the BPhO each year.' : '';
    view.innerHTML = `<section class="cm-page cm-mock">${head}<div class="cm-result"><p class="cm-score">Score: <b>${sc.score}</b> / ${sc.max}</p><p class="muted">${sc.right} right, ${sc.wrong} wrong, ${sc.blank} blank.${extra}</p><div class="cm-ractions"><a class="btn" href="#pcompete-${t.id}">Back to ${h.esc(t.short)}</a><button type="button" class="btn ghost" data-mreset>Sit it again</button></div></div>${paperHTML(P, run, true)}</section>`;
    document.title = t.short + ' mock: results · Geodesic';
    h.typeset(view);
    view.onclick = (e) => {
      const xb = e.target.closest('[data-exsol]'); if (xb) { const el = xb.nextElementSibling, open = el.hidden; el.hidden = !open; xb.setAttribute('aria-expanded', open); xb.textContent = open ? 'Hide the solution' : 'Show the solution'; if (open) h.typeset(el); return; }
      if (e.target.closest('[data-mreset]')) { const O = get(); delete O.mock[t.id]; put(O); renderMock(view, t.id); window.scrollTo(0, 0); }
    };
    view.onchange = view.oninput = null; view.onsubmit = (e) => e.preventDefault();
  }

  /* ---------- registration ---------- */
  const withData = (view, fn) => { if (LES.length >= 10 && Object.keys(PAP).length >= 6) { fn(); return; } loadingView(view); loadAll().then(fn, () => failView(view)); };
  WL.pages = WL.pages || {};
  WL.pages.pcompete = { match: (h) => h === 'pcompete', nav: 'pcompete', render: (h, view) => withData(view, () => renderHub(view)) };
  WL.pages.pcompeteTier = { match: (h) => /^pcompete-[a-z0-9]+$/.test(h), nav: 'pcompete', render: (h, view) => withData(view, () => renderTier(view, h.slice(9))) };
  WL.pages.pcLesson = { match: (h) => h.startsWith('pl-'), nav: 'pcompete', render: (h, view) => withData(view, () => renderLesson(view, h.slice(3))) };
  WL.pages.pcMock = { match: (h) => h.startsWith('pmock-'), nav: 'pcompete', render: (h, view) => withData(view, () => renderMock(view, h.slice(6))) };
  WL.pcomp = { TIERS, load: loadAll };
})();
/* Geodesic — the study planner (#planner) and the "Your study" band on the home page.
   Choose what the exam covers (a syllabus or a stage), the exam date, the days you can study and for how long. The
   plan spreads the topics you have not yet marked understood over the days before the exam, in teaching order, and
   keeps the last fifth of the time for revision (mixed tests, your mistakes, flashcards). It is worked out afresh from
   today every time it is opened, so a missed day simply moves the rest along. The exam date is the same one that
   shortens the review gaps (study.js). Stored in this browser, per account (wl-plan). */
(function () {
  const WL = (window.WL = window.WL || {});
  const DAY = 864e5;
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const getPlan = () => { try { return JSON.parse(localStorage.getItem('wl-plan' + user()) || 'null'); } catch (e) { return null; } };
  const putPlan = (p) => { try { if (p) localStorage.setItem('wl-plan' + user(), JSON.stringify(p)); else localStorage.removeItem('wl-plan' + user()); } catch (e) {} };
  const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const day0 = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const wdOf = (t) => (new Date(t).getDay() + 6) % 7;
  const fmt = (t, o) => new Date(t).toLocaleDateString(undefined, o || { weekday: 'short', day: 'numeric', month: 'short' });
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const tracks = () => ['physics', 'maths'].map((k) => WL.app && WL.app.TR[k]).filter(Boolean);
  const orderIdx = () => { const m = {}; let i = 0; tracks().forEach((tr) => tr.order.forEach((id) => (m[id] = i++))); return m; };

  /* what an exam can cover */
  function scopes() {
    const out = [];
    (WL.syllabi || []).forEach((S) => { const ids = new Set(); (S.items || []).forEach(([, , t]) => String(t || '').split(' ').forEach((x) => x && N()[x] && ids.add(x))); if (ids.size) out.push({ key: 'syl:' + S.id, name: S.name, ids: [...ids] }); });
    tracks().forEach((tr) => tr.stages.forEach((st) => { const ids = tr.order.filter((id) => N()[id] && N()[id].stage === st.id); if (ids.length) out.push({ key: 'st:' + st.id, name: `${tr.name}: ${st.name} (every topic)`, ids }); }));
    return out;
  }
  const scopeOf = (key) => scopes().find((s) => s.key === key) || null;
  /* minutes a topic needs: its lecture (measured), five minutes with the notes, and about four minutes for each of
     up to six practice questions */
  function minsFor(id) {
    const lec = (WL.tlec && WL.tlec.minsOf && WL.tlec.minsOf(id)) || 16, q = (((WL.notes || {})[id] || {}).probs || []).length;
    return lec + 5 + 4 * Math.min(6, q || 4);
  }

  /* ---------- the schedule, from today ---------- */
  function build(p) {
    const exam = WL.study && WL.study.examDate ? WL.study.examDate() : 0, S = scopeOf(p.scope), LS = H().LS ? H().LS() : { u: {} };
    if (!exam || !S) return null;
    const t0 = day0(Date.now()), tE = day0(exam), days = [];
    for (let t = t0; t < tE; t += DAY) { const d = day0(t + 3 * 36e5); if (p.days.includes(wdOf(d))) days.push(d); }
    const O = orderIdx(), all = S.ids.slice().sort((a, b) => (O[a] ?? 1e9) - (O[b] ?? 1e9));
    const todo = all.filter((id) => !LS.u[id]), doneToday = all.filter((id) => LS.u[id] && day0(LS.u[id]) === t0);
    const revN = days.length >= 5 ? Math.max(2, Math.round(days.length * 0.2)) : days.length >= 2 ? 1 : 0;
    const learn = days.slice(0, days.length - revN), rev = days.slice(days.length - revN);
    const plan = learn.map((d) => ({ d, items: [], used: 0 })); let di = 0; const left = [];
    todo.forEach((id) => {
      let need = minsFor(id), first = true;
      while (need > 0) {
        if (di >= plan.length) { left.push(id); break; }
        const day = plan[di], room = p.mins - day.used;
        if (room < 15 && day.used > 0) { di++; continue; }
        const take = Math.min(need, Math.max(room, 15));
        day.items.push({ id, m: take, part: first ? (take < need ? 1 : 0) : take < need ? 2 : 3 }); day.used += take; need -= take; first = false;
        if (day.used >= p.mins) di++;
      }
    });
    const needMins = todo.reduce((s, id) => s + minsFor(id), 0);
    const perDay = learn.length ? Math.ceil(needMins / learn.length) : needMins;
    const lastLearn = plan.filter((x) => x.items.length).slice(-1)[0];
    return { exam, S, all, todo, doneToday, learn: plan, rev, left: [...new Set(left)], needMins, perDay, lastLearn, days };
  }
  function todayItems() {
    const p = getPlan(); if (!p) return null; const B = build(p); if (!B) return null;
    const t0 = day0(Date.now()), L = B.learn.find((x) => x.d === t0), R = B.rev.includes(t0);
    return { B, items: L ? L.items : [], rev: R };
  }
  function todayLine() {
    const T = todayItems(); if (!T) return '';
    const left = Math.round((day0(T.B.exam) - day0(Date.now())) / DAY);
    if (T.rev) return `Today: revision · ${left} day${left === 1 ? '' : 's'} to the exam`;
    if (!T.items.length) return `No study planned today · ${left} days to the exam`;
    return `Today: ${T.items.map((x) => N()[x.id].title).join(', ')}`;
  }

  /* ---------- the page ---------- */
  const itemHTML = (x, LS) => { const n = N()[x.id], ok = LS.u[x.id]; return `<li class="${ok ? 'pl-ok' : ''}"><a href="#t-${x.id}">${esc(n.title)}</a>${x.part ? ` <small>(${['', 'start', 'continue', 'finish'][x.part]})</small>` : ''}<span class="pl-m">${x.m} min</span><span class="pl-go"><a href="#tl-${x.id}">lecture</a><a href="#t-${x.id}" data-pane-go="practice">practice</a></span>${ok ? '<span class="pl-tick" aria-label="understood">✓</span>' : ''}</li>`; };
  function render(view) {
    const p = getPlan(), h = H(), LS = h.LS ? h.LS() : { u: {} }, exam = WL.study && WL.study.examDate ? WL.study.examDate() : 0, S = scopes();
    const cur = p || { scope: (S.find((x) => x.key === 'syl:0625') || S[0] || {}).key, days: [0, 1, 2, 3, 4, 6], mins: 45 };
    const B = p ? build(p) : null, t0 = day0(Date.now());
    document.title = 'Study planner · Geodesic';
    const form = `<form class="pl-form">
        <div class="pl-f"><label for="pl-scope">What your exam covers</label><select id="pl-scope">${S.map((s) => `<option value="${esc(s.key)}"${s.key === cur.scope ? ' selected' : ''}>${esc(s.name)} · ${s.ids.length} topics</option>`).join('')}</select></div>
        <div class="pl-f"><label for="pl-exam">Exam date</label><input id="pl-exam" type="date" min="${iso(Date.now() + DAY)}" value="${exam ? iso(exam) : ''}" required></div>
        <fieldset class="pl-f pl-days"><legend>Days you can study</legend>${WD.map((w, i) => `<label><input type="checkbox" value="${i}"${cur.days.includes(i) ? ' checked' : ''}> ${w}</label>`).join('')}</fieldset>
        <div class="pl-f"><label for="pl-mins">Time on a study day</label><select id="pl-mins">${[20, 30, 45, 60, 90, 120].map((m) => `<option value="${m}"${m === cur.mins ? ' selected' : ''}>${m < 60 ? m + ' minutes' : m / 60 + (m === 60 ? ' hour' : ' hours')}</option>`).join('')}</select></div>
        <div class="pl-act"><button type="submit" class="btn primary">${p ? 'Update the plan' : 'Make my plan'}</button>${p ? '<button type="button" class="btn ghost" data-pl-del>Delete the plan</button>' : ''}</div>
        <p class="pl-err" role="alert" hidden></p></form>`;
    let body = '';
    if (B) {
      const daysLeft = Math.round((day0(B.exam) - t0) / DAY), doneN = B.all.length - B.todo.length;
      const ok = !B.left.length;
      const weeks = []; const all = B.learn.map((x) => ({ d: x.d, items: x.items })).concat(B.rev.map((d) => ({ d, rev: 1 })));
      all.forEach((x) => { const wk = day0(x.d - wdOf(x.d) * DAY); let w = weeks.find((y) => y.wk === wk); if (!w) weeks.push((w = { wk, days: [] })); w.days.push(x); });
      const wkName = (wk) => { const k = Math.round((wk - day0(t0 - wdOf(t0) * DAY)) / (7 * DAY)); return k === 0 ? 'This week' : k === 1 ? 'Next week' : `Week of ${fmt(wk, { day: 'numeric', month: 'short' })}`; };
      body = `<div class="pl-sum${ok ? '' : ' warn'}">
          <p class="pl-count"><b>${daysLeft}</b> day${daysLeft === 1 ? '' : 's'} to your exam on ${fmt(B.exam, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <p>${esc(B.S.name)}: <b>${doneN}</b> of ${B.all.length} topics marked understood. ${B.todo.length ? (ok ? `At ${p.mins} minutes on ${p.days.length} day${p.days.length === 1 ? '' : 's'} a week you finish the new topics ${B.lastLearn ? 'on ' + fmt(B.lastLearn.d, { weekday: 'long', day: 'numeric', month: 'short' }) : 'soon'}, with ${B.rev.length} day${B.rev.length === 1 ? '' : 's'} left for revision.` : `There is not enough time at this pace: ${B.left.length} topic${B.left.length === 1 ? '' : 's'} do not fit. The new topics need about <b>${B.perDay} minutes</b> on each study day, or more study days.`) : 'Every topic is understood: the plan is all revision now.'}</p>
          ${B.doneToday.length ? `<p class="pl-today-done">Understood today: ${B.doneToday.map((id) => esc(N()[id].title)).join(', ')} ✓</p>` : ''}</div>
        <div class="pl-weeks">${weeks.map((w) => `<section><h2 class="mk-h">${wkName(w.wk)}</h2><ol class="pl-days-l">${w.days.map((x) => `<li class="pl-day${x.d === t0 ? ' today' : ''}${x.rev ? ' rev' : ''}"><p class="pl-date">${x.d === t0 ? '<b>Today</b>' : fmt(x.d)}</p>${x.rev ? `<ul class="pl-items pl-rev"><li><a href="#test">A timed test on the whole course</a></li><li><a href="#mistakes">Your mistakes notebook</a></li><li><a href="#cards-due">Flashcards due</a></li><li><a href="#formulas">The formula sheet</a></li></ul>` : `<ul class="pl-items">${x.items.map((it) => itemHTML(it, LS)).join('')}</ul>`}</li>`).join('')}</ol></section>`).join('')}</div>
        ${B.left.length ? `<h2 class="mk-h">Not yet in the plan</h2><p class="pl-left">${B.left.map((id) => `<a href="#t-${id}">${esc(N()[id].title)}</a>`).join(', ')}</p>` : ''}`;
    }
    view.innerHTML = `<section class="mk-head"><h1>Study planner</h1>
        <p class="lede">Tell it what your exam covers and when it is, and it spreads the topics you still need over the days you have, in the order they are taught, keeping the last fifth of the time for revision. Each day links to the topic’s lecture and practice. Miss a day and the rest simply moves along: the plan is worked out again from today every time you open it.</p></section>
      ${B ? body + `<details class="pl-edit"><summary>Change the plan</summary>${form}</details>` : `<h2 class="mk-h">Make your plan</h2>${form}`}`;
    const f = view.querySelector('.pl-form');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const ex = f.querySelector('#pl-exam').value, days = [...f.querySelectorAll('.pl-days input:checked')].map((x) => +x.value), err = f.querySelector('.pl-err');
      if (!ex || new Date(ex + 'T09:00:00').getTime() <= Date.now()) { err.hidden = false; err.textContent = 'Choose an exam date after today.'; return; }
      if (!days.length) { err.hidden = false; err.textContent = 'Tick at least one day of the week.'; return; }
      if (WL.study && WL.study.setExamDate) WL.study.setExamDate(ex);
      putPlan({ scope: f.querySelector('#pl-scope').value, days, mins: +f.querySelector('#pl-mins').value, created: (p && p.created) || Date.now() });
      render(view); window.scrollTo(0, 0);
    });
    const del = view.querySelector('[data-pl-del]'); if (del) del.addEventListener('click', () => { putPlan(null); render(view); });
    view.querySelectorAll('[data-pane-go]').forEach((a) => a.addEventListener('click', () => { try { localStorage.setItem('wl-pane', a.dataset.paneGo); } catch (e) {} }));
  }

  /* ---------- the band on the home page ---------- */
  function homeBand() {
    const T = todayItems(), mk = WL.mistakes ? WL.mistakes.countDue() : 0, fc = WL.cards ? WL.cards.countDue() : 0;
    const left = T ? Math.round((day0(T.B.exam) - day0(Date.now())) / DAY) : 0;
    const today = T ? (T.rev ? '<li><a href="#test">Revision: a timed test, your mistakes and your flashcards</a></li>' : T.items.length ? T.items.map((x) => `<li><a href="#t-${x.id}">${esc(N()[x.id].title)}</a><small>${x.m} min · <a href="#tl-${x.id}">lecture</a></small></li>`).join('') : '<li class="muted">No study planned today.</li>') : '';
    const tile = (href, b, t, s) => `<a class="st-tile" href="${href}"><b>${b}</b><span>${t}</span><small>${s}</small></a>`;
    return `<section class="block stband" aria-labelledby="st-h">
      <div class="section-h"><h2 id="st-h">Your study</h2><a href="#notebook">My notebook</a></div>
      <div class="st-row">
        ${T ? `<div class="st-plan"><p class="st-k">${left} day${left === 1 ? '' : 's'} to your exam</p><b>Today’s plan</b><ul>${today}</ul><a class="btn small" href="#planner">Open the planner</a></div>` : `<a class="st-plan st-plan-new" href="#planner"><p class="st-k">Study planner</p><b>Plan the weeks before your exam</b><span>Choose the syllabus and the date: every day gets its topics, lectures and practice, with time left for revision.</span><span class="btn small primary">Make a plan</span></a>`}
        <div class="st-tiles">
          ${tile('#cards', fc || '', 'Flashcards', fc ? 'cards due now' : 'key terms and equations, spaced')}
          ${tile('#mistakes', mk || '', 'My mistakes', mk ? 'ready to try again' : 'missed questions come back')}
          ${tile('#map', '', 'Knowledge map', 'what you know, and what is ready next')}
          ${tile('#formulas', '', 'Formula sheet', 'every key equation, printable')}
          ${tile('#glossary', '', 'Glossary', 'key terms in mark-scheme wording')}
          ${tile('#lectures', '', 'Lectures', 'a lecture for every topic')}
        </div>
      </div></section>`;
  }
  WL.pages = WL.pages || {};
  WL.pages.planner = { match: (h) => h === 'planner', nav: 'planner', render(h, view) { render(view); } };
  const todayIds = () => { const T = todayItems(); return T && !T.rev ? T.items.map((x) => x.id) : []; };
  WL.studyPlan = { todayLine, todayIds, homeBand, build: () => { const p = getPlan(); return p ? build(p) : null; }, scopes };   // not WL.planner: that is the research planner (research.js)
})();
/* Geodesic — exact, smooth curves for drawn sketches, the way a graphing calculator draws them.
   WL.plot.compile("20t - 4.9t^2", ['t']) turns a formula into a function without eval: numbers, + − × ÷ ^, implicit
   multiplication (2x, 3(x+1), 2πr), unary minus, |x|, √, degrees (30°), pi π e, and the usual functions.
   WL.plot.graph(el) turns a <graph> block from the AI's drawing into ordinary SVG: axes with arrowheads, "nice"
   ticks (or multiples of π), a light grid, and each curve sampled hundreds of times across the box, broken at
   asymptotes and clipped to the box, so curves are smooth and exactly where their equations put them.
   WL.plot.smooth(el) turns a polyline or straight-segment path that is plainly meant as a curve (no sharp turns)
   into a smooth cubic Bézier path; zigzags such as springs keep their corners. */
(function () {
  const WL = (window.WL = window.WL || {});
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- formulas ---------- */
  const FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x), cosec: (x) => 1 / Math.sin(x), cot: (x) => 1 / Math.tan(x),
    asin: Math.asin, acos: Math.acos, atan: Math.atan, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
    ln: Math.log, log: (x, b) => (b == null ? Math.log10(x) : Math.log(x) / Math.log(b)),
    floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign, sgn: Math.sign, min: Math.min, max: Math.max, pow: Math.pow
  };
  const TRIG = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cosec', 'cot']), ATRIG = new Set(['asin', 'acos', 'atan', 'arcsin', 'arccos', 'arctan']);
  const CONST = { pi: Math.PI, e: Math.E, tau: 2 * Math.PI };
  function tokens(s) {
    s = String(s).replace(/[−–]/g, '-').replace(/[×·⋅]/g, '*').replace(/÷/g, '/').replace(/π/g, ' pi ').replace(/θ/g, ' theta ').replace(/φ/g, ' phi ').replace(/ω/g, ' omega ').replace(/²/g, '^2').replace(/³/g, '^3').replace(/\*\*/g, '^');
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      const num = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.slice(i));
      if (num) { out.push({ t: 'n', v: parseFloat(num[0]) }); i += num[0].length; continue; }
      const id = /^[A-Za-z_]+/.exec(s.slice(i));
      if (id) { out.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
      if ('+-*/^(),|°√!'.includes(c)) { out.push({ t: c }); i++; continue; }
      throw new Error('bad character ' + c);
    }
    return out;
  }
  /* an identifier the parser does not know, such as "xt", is read as a product of known names, "x·t" */
  function split(name, vars) {
    if (FN[name] || CONST[name] != null || vars.includes(name)) return [name];
    const out = []; let r = name;
    while (r) { const k = [...vars, ...Object.keys(CONST), ...Object.keys(FN)].filter((n) => r.startsWith(n)).sort((a, b) => b.length - a.length)[0]; if (!k) throw new Error('unknown name ' + name); out.push(k); r = r.slice(k.length); }
    return out;
  }
  function compile(src, vars = ['x'], deg = false) {
    let T;
    try { T = tokens(src); } catch (e) { return null; }
    // expand compound identifiers
    const X = []; try { T.forEach((t) => { if (t.t === 'id') split(t.v, vars).forEach((v) => X.push({ t: 'id', v })); else X.push(t); }); } catch (e) { return null; }
    let p = 0; const peek = () => X[p], take = (t) => (X[p] && X[p].t === t ? X[p++] : null);
    const D = Math.PI / 180;
    const startsPrimary = (k) => k && (k.t === 'n' || k.t === 'id' || k.t === '(' || k.t === '√' || (k.t === '|' && false));
    function expr() { let a = term(); for (;;) { if (take('+')) { const l = a, r = term(); a = (e) => l(e) + r(e); } else if (take('-')) { const l = a, r = term(); a = (e) => l(e) - r(e); } else return a; } }
    function term() {
      let a = unary();
      for (;;) {
        if (take('*')) { const l = a, r = unary(); a = (e) => l(e) * r(e); }
        else if (take('/')) { const l = a, r = unary(); a = (e) => l(e) / r(e); }
        else if (startsPrimary(peek())) { const l = a, r = power(); a = (e) => l(e) * r(e); }   // implicit: 2x, 3(x+1), x sin x
        else return a;
      }
    }
    function unary() { if (take('-')) { const a = unary(); return (e) => -a(e); } if (take('+')) return unary(); return power(); }
    function power() { const b = postfix(); if (take('^')) { const x = unary(); return (e) => Math.pow(b(e), x(e)); } return b; }
    function postfix() { let a = primary(); for (;;) { if (take('°')) { if (!deg) { const l = a; a = (e) => l(e) * D; } } else if (take('!')) { const l = a; a = (e) => gamma(l(e) + 1); } else return a; } }
    function primary() {
      const k = X[p++]; if (!k) throw new Error('end');
      if (k.t === 'n') return () => k.v;
      if (k.t === '(') { const a = expr(); if (!take(')')) throw new Error(')'); return a; }
      if (k.t === '|') { const a = expr(); if (!take('|')) throw new Error('|'); return (e) => Math.abs(a(e)); }
      if (k.t === '√') { const a = power(); return (e) => Math.sqrt(a(e)); }
      if (k.t === 'id') {
        const n = k.v;
        if (FN[n]) {
          let args;
          if (take('(')) { args = [expr()]; while (take(',')) args.push(expr()); if (!take(')')) throw new Error(')'); }
          else if (take('^')) { const ex = unary(); const a = power(); const f = FN[n]; return (e) => Math.pow(call(n, f, [a(e)]), ex(e)); }   // sin^2 x
          else { let a = power(); while (X[p] && (X[p].t === 'n' || (X[p].t === 'id' && !FN[X[p].v]))) { const l = a, r = power(); a = (e) => l(e) * r(e); } args = [a]; }   // sin x, sin 2x
          const f = FN[n]; return (e) => call(n, f, args.map((a) => a(e)));
        }
        if (CONST[n] != null) return () => CONST[n];
        if (vars.includes(n) || n === 'theta' || n === 'phi' || n === 'omega') return (e) => e[n];
        throw new Error('name ' + n);
      }
      throw new Error('token ' + k.t);
    }
    const call = (n, f, a) => (deg && TRIG.has(n) ? f(a[0] * D) : deg && ATRIG.has(n) ? f(...a) / D : f(...a));
    try { const f = expr(); if (p !== X.length) return null; return f; } catch (e) { return null; }
  }
  function gamma(z) { if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z)); z -= 1; const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x; }
  const value = (s, d) => { if (s == null || s === '') return d; const f = compile(s, []); const v = f ? f({}) : NaN; return isFinite(v) ? v : d; };

  /* ---------- axes, ticks and curves ---------- */
  const r1 = (v) => Math.round(v * 10) / 10;
  const nice = (span, want) => { const raw = span / Math.max(1, want), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
  const fmt = (v, step) => { const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9)); return (Math.abs(v) < 1e-12 ? 0 : v).toFixed(Math.min(d, 4)).replace(/^-/, '−'); };
  const piFmt = (v) => { const k = v / Math.PI; for (const d of [1, 2, 3, 4, 6]) { const n = Math.round(k * d); if (Math.abs(k * d - n) < 1e-6) { if (n === 0) return '0'; const g = gcd(Math.abs(n), d), nn = n / g, dd = d / g, s = nn < 0 ? '−' : '', a = Math.abs(nn); return s + (a === 1 ? '' : a) + 'π' + (dd === 1 ? '' : '/' + dd); } } return fmt(v, 0.01); };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const COLORS = ['#0a62bd', '#c8640a', '#1b7a43', '#7a3fb0', '#c62f2f'];
  const colorOf = (s, i) => (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(s || '').trim()) ? String(s).trim() : COLORS[i % COLORS.length]);
  let gid = 0;

  function graph(el) {
    const doc = el.ownerDocument, mk = (tag, attrs, text) => { const n = doc.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => v != null && n.setAttribute(k, String(v))); if (text != null) n.textContent = text; return n; };
    const A = (k) => el.getAttribute(k);
    const bx = value(A('x'), 60), by = value(A('y'), 30), bw = Math.max(40, value(A('w'), 560)), bh = Math.max(40, value(A('h'), 300));
    let x0 = value(A('xmin'), -5), x1 = value(A('xmax'), 5), y0 = value(A('ymin'), -5), y1 = value(A('ymax'), 5);
    if (!(x1 > x0)) [x0, x1] = [-5, 5]; if (!(y1 > y0)) [y0, y1] = [-5, 5];
    const deg = /^deg/i.test(A('angle') || ''), axes = A('axes') !== '0', grid = A('grid') === '1' || A('grid') === 'true';
    const X = (v) => bx + ((v - x0) / (x1 - x0)) * bw, Y = (v) => by + bh - ((v - y0) / (y1 - y0)) * bh;
    const id = 'pg' + ++gid, g = mk('g', { class: 'vz-graph' }), defs = mk('defs');
    defs.appendChild(mk('clipPath', { id: id + 'c' })).appendChild(mk('rect', { x: r1(bx - 1), y: r1(by - 1), width: r1(bw + 2), height: r1(bh + 2) }));
    const markers = {}; const arrowFor = (c) => { if (markers[c]) return markers[c]; const mid = id + 'm' + Object.keys(markers).length; const m = mk('marker', { id: mid, viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }); m.appendChild(mk('path', { d: 'M0 0L10 5L0 10z', fill: c })); defs.appendChild(m); return (markers[c] = `url(#${mid})`); };
    g.appendChild(defs);
    const halo = { stroke: '#fff', 'stroke-width': 5, 'paint-order': 'stroke', 'stroke-linejoin': 'round' };
    /* ticks: given, or about one per 80 drawing units */
    const stepOf = (s, span, len) => { const v = value(s, NaN); return isFinite(v) && v > 0 && span / v <= 60 ? v : nice(span, len / 80); };
    const xs = stepOf(A('xstep'), x1 - x0, bw), ys = stepOf(A('ystep'), y1 - y0, bh);
    const xpi = /pi|π/.test(A('xstep') || '') || /pi|π/.test(A('xmax') || ''), ypi = /pi|π/.test(A('ystep') || '');
    const ticks = (a, b, s) => { const o = []; for (let k = Math.ceil(a / s - 1e-9); k * s <= b + 1e-9 && o.length < 80; k++) o.push(k * s); return o; };
    const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);   // where the axes cross
    if (grid) { const gg = mk('g', { stroke: '#e3e8f0', 'stroke-width': 1 }); ticks(x0, x1, xs).forEach((v) => gg.appendChild(mk('line', { x1: r1(X(v)), y1: r1(by), x2: r1(X(v)), y2: r1(by + bh) }))); ticks(y0, y1, ys).forEach((v) => gg.appendChild(mk('line', { x1: r1(bx), y1: r1(Y(v)), x2: r1(bx + bw), y2: r1(Y(v)) }))); g.appendChild(gg); }
    if (axes) {
      const ac = '#3a4456', arr = arrowFor(ac);
      g.appendChild(mk('line', { x1: r1(bx), y1: r1(Y(ax)), x2: r1(bx + bw + 10), y2: r1(Y(ax)), stroke: ac, 'stroke-width': 1.6, 'marker-end': arr }));
      g.appendChild(mk('line', { x1: r1(X(ay)), y1: r1(by + bh), x2: r1(X(ay)), y2: r1(by - 10), stroke: ac, 'stroke-width': 1.6, 'marker-end': arr }));
      if (A('ticks') !== '0') {
        const tk = mk('g', { 'font-size': 14, fill: '#5b6577' });
        ticks(x0, x1, xs).forEach((v) => { if (Math.abs(v - ay) < xs / 1e6) return; const px = X(v); g.appendChild(mk('line', { x1: r1(px), y1: r1(Y(ax) - 4), x2: r1(px), y2: r1(Y(ax) + 4), stroke: ac, 'stroke-width': 1.2 })); tk.appendChild(mk('text', Object.assign({ x: r1(px), y: r1(Y(ax) + 20), 'text-anchor': 'middle' }, halo), xpi ? piFmt(v) : fmt(v, xs))); });
        ticks(y0, y1, ys).forEach((v) => { if (Math.abs(v - ax) < ys / 1e6) return; const py = Y(v); g.appendChild(mk('line', { x1: r1(X(ay) - 4), y1: r1(py), x2: r1(X(ay) + 4), y2: r1(py), stroke: ac, 'stroke-width': 1.2 })); tk.appendChild(mk('text', Object.assign({ x: r1(X(ay) - 8), y: r1(py + 5), 'text-anchor': 'end' }, halo), ypi ? piFmt(v) : fmt(v, ys))); });
        if (x0 < 0 && x1 > 0 && y0 < 0 && y1 > 0) tk.appendChild(mk('text', Object.assign({ x: r1(X(0) - 8), y: r1(Y(0) + 18), 'text-anchor': 'end' }, halo), '0'));
        g.appendChild(tk);
      }
      const xn = A('xname'), yn = A('yname');
      if (xn) g.appendChild(mk('text', Object.assign({ x: r1(bx + bw + 14), y: r1(Y(ax) + 5), 'font-size': 17, 'font-style': 'italic', fill: '#1d2533' }, halo), xn.slice(0, 24)));
      if (yn) g.appendChild(mk('text', Object.assign({ x: r1(X(ay) + 8), y: r1(by - 14), 'font-size': 17, 'font-style': 'italic', fill: '#1d2533' }, halo), yn.slice(0, 24)));
    }
    const curves = mk('g', { 'clip-path': `url(#${id}c)`, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const over = mk('g');
    const N = Math.max(300, Math.min(1400, Math.round(bw * 1.6)));
    /* sample a curve; break it where it leaves to infinity or jumps across the box */
    const trace = (pt, a, b, n = N) => { const segs = []; let cur = []; let prev = null;
      for (let i = 0; i <= n; i++) { const t = a + ((b - a) * i) / n, q = pt(t); const ok = q && isFinite(q[0]) && isFinite(q[1]) && Math.abs(q[1]) < 1e7 && Math.abs(q[0]) < 1e7; if (!ok) { if (cur.length > 1) segs.push(cur); cur = []; prev = null; continue; }
        const P = [X(q[0]), Y(q[1])]; if (prev && (Math.abs(P[1] - prev[1]) > bh * 1.2 || Math.abs(P[0] - prev[0]) > bw * 1.2)) { if (cur.length > 1) segs.push(cur); cur = []; }
        cur.push([Math.max(bx - bw, Math.min(bx + 2 * bw, P[0])), Math.max(by - bh, Math.min(by + 2 * bh, P[1]))]); prev = P; }
      if (cur.length > 1) segs.push(cur); return segs; };
    const dOf = (segs) => segs.map((s) => { let d = '', last = ''; s.forEach((p, i) => { const k = r1(p[0]) + ' ' + r1(p[1]); if (k !== last) d += (i ? 'L' : 'M') + k; last = k; }); return d; }).join('');
    /* a curve's name goes about four fifths of the way along its visible part, clear of the axes' ends */
    const lastIn = (segs) => { const vis = []; segs.forEach((s) => s.forEach((p) => { if (p[0] >= bx + 6 && p[0] <= bx + bw - 6 && p[1] >= by + 6 && p[1] <= by + bh - 6) vis.push(p); })); return vis.length ? vis[Math.floor(vis.length * 0.8)] : null; };
    const label = (p, text, c) => { if (!p || !text) return; const right = p[0] > bx + bw * 0.72; over.appendChild(mk('text', Object.assign({ x: r1(p[0] + (right ? -8 : 8)), y: r1(Math.max(by + 16, p[1] - 12)), 'font-size': 17, 'text-anchor': right ? 'end' : 'start', fill: c }, halo), text.slice(0, 40))); };
    let ci = 0;
    [...el.children].forEach((c) => {
      const k = c.localName.toLowerCase(), C = (n) => c.getAttribute(n), col = colorOf(C('color'), ci), dash = C('dash') === '1' ? '7 6' : null;
      const style = { stroke: col, 'stroke-width': value(C('width'), 2.6), 'stroke-dasharray': dash };
      if (k === 'fn' || k === 'area') {
        const v = (C('var') || 'x').replace(/[^A-Za-z]/g, '').slice(0, 6) || 'x', f = compile(C('y') || '', [v, 'x'], deg); if (!f) return;
        const a = value(C('from'), x0), b = value(C('to'), x1), segs = trace((t) => [t, f({ [v]: t, x: t })], Math.max(a, x0 - (x1 - x0)), Math.min(b, x1 + (x1 - x0)));
        if (k === 'area') { const base = Y(Math.min(Math.max(0, y0), y1)); segs.forEach((s) => curves.appendChild(mk('path', { d: `M${r1(s[0][0])} ${r1(base)}L` + s.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + `L${r1(s[s.length - 1][0])} ${r1(base)}Z`, fill: col, 'fill-opacity': 0.16, stroke: 'none' }))); ci++; return; }
        curves.appendChild(mk('path', Object.assign({ d: dOf(segs) }, style))); label(lastIn(segs), C('label'), col); ci++;
      } else if (k === 'param' || k === 'polar') {
        const v = k === 'polar' ? 'theta' : (C('var') || 't').replace(/[^A-Za-z]/g, '').slice(0, 6) || 't';
        const t0 = value(C('t0') || C('from'), 0), t1 = value(C('t1') || C('to'), k === 'polar' ? 2 * Math.PI : 1);
        let pt;
        if (k === 'polar') { const r = compile(C('r') || '', ['theta', 't', 'x'], deg); if (!r) return; pt = (t) => { const e = { theta: t, t, x: t }, rr = r(e), a = deg ? t * Math.PI / 180 : t; return [rr * Math.cos(a), rr * Math.sin(a)]; }; }
        else { const fx = compile(C('x') || '', [v, 't'], deg), fy = compile(C('y') || '', [v, 't'], deg); if (!fx || !fy) return; pt = (t) => { const e = { [v]: t, t }; return [fx(e), fy(e)]; }; }
        const segs = trace(pt, t0, t1, Math.max(N, 600)); curves.appendChild(mk('path', Object.assign({ d: dOf(segs) }, style))); label(lastIn(segs), C('label'), col); ci++;
      } else if (k === 'point') {
        const px = X(value(C('x'), 0)), py = Y(value(C('y'), 0)); if (!isFinite(px + py)) return;
        over.appendChild(mk('circle', { cx: r1(px), cy: r1(py), r: 5, fill: colorOf(C('color'), 4), stroke: '#fff', 'stroke-width': 2 }));
        if (C('label')) over.appendChild(mk('text', Object.assign({ x: r1(px + 9), y: r1(py - 9), 'font-size': 16, fill: colorOf(C('color'), 4) === '#c62f2f' ? '#c62f2f' : '#1d2533' }, halo), C('label').slice(0, 40)));
      } else if (k === 'vline' || k === 'hline') {
        const v = value(C(k === 'vline' ? 'x' : 'y'), NaN); if (!isFinite(v)) return; const c2 = colorOf(C('color'), 1);
        if (k === 'vline') { const px = X(v); curves.appendChild(mk('line', { x1: r1(px), y1: r1(by), x2: r1(px), y2: r1(by + bh), stroke: c2, 'stroke-width': 1.6, 'stroke-dasharray': '6 5' })); if (C('label')) over.appendChild(mk('text', Object.assign({ x: r1(px + 6), y: r1(by + 16), 'font-size': 16, fill: c2 }, halo), C('label').slice(0, 30))); }
        else { const py = Y(v); curves.appendChild(mk('line', { x1: r1(bx), y1: r1(py), x2: r1(bx + bw), y2: r1(py), stroke: c2, 'stroke-width': 1.6, 'stroke-dasharray': '6 5' })); if (C('label')) over.appendChild(mk('text', Object.assign({ x: r1(bx + bw - 4), y: r1(py - 8), 'font-size': 16, 'text-anchor': 'end', fill: c2 }, halo), C('label').slice(0, 30))); }
      } else if (k === 'seg') {
        const a = [X(value(C('x1'), 0)), Y(value(C('y1'), 0))], b = [X(value(C('x2'), 0)), Y(value(C('y2'), 0))]; if (![...a, ...b].every(isFinite)) return; const c2 = colorOf(C('color'), 0);
        over.appendChild(mk('line', { x1: r1(a[0]), y1: r1(a[1]), x2: r1(b[0]), y2: r1(b[1]), stroke: c2, 'stroke-width': 2.4, 'stroke-dasharray': dash, 'marker-end': C('arrow') === '1' ? arrowFor(c2) : null }));
        if (C('label')) over.appendChild(mk('text', Object.assign({ x: r1((a[0] + b[0]) / 2 + 8), y: r1((a[1] + b[1]) / 2 - 8), 'font-size': 16, fill: c2 }, halo), C('label').slice(0, 30)));
      } else if (k === 'mtext') {
        const px = X(value(C('x'), 0)), py = Y(value(C('y'), 0)); if (!isFinite(px + py)) return;
        over.appendChild(mk('text', Object.assign({ x: r1(px), y: r1(py), 'font-size': 16, 'text-anchor': /^(start|middle|end)$/.test(C('anchor') || '') ? C('anchor') : 'middle', fill: colorOf(C('color'), 0) === '#0a62bd' && !C('color') ? '#1d2533' : colorOf(C('color'), 0) }, halo), (c.textContent || '').trim().slice(0, 60)));
      }
    });
    g.appendChild(curves); g.appendChild(over);
    return g;
  }

  /* ---------- curves drawn as straight pieces, made smooth ---------- */
  function pointsOf(el) {
    const k = el.localName.toLowerCase();
    if (k === 'polyline') { const n = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number); if (n.length % 2 || n.some((v) => !isFinite(v))) return null; const o = []; for (let i = 0; i < n.length; i += 2) o.push([n[i], n[i + 1]]); return o; }
    if (k === 'path') {
      const d = el.getAttribute('d') || ''; if (/[^MmLl0-9eE.,\s+-]/.test(d)) return null;   // only straight pieces
      const t = d.match(/[MmLl]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []; const o = []; let cmd = 'M', i = 0, x = 0, y = 0;
      while (i < t.length) { if (/[MmLl]/.test(t[i])) { cmd = t[i++]; if (o.length && /M/i.test(cmd)) return null; continue; } const a = +t[i], b = +t[i + 1]; if (!isFinite(a) || !isFinite(b)) return null; i += 2; if (cmd === 'm' || cmd === 'l') { x += a; y += b; } else { x = a; y = b; } o.push([x, y]); if (cmd === 'M') cmd = 'L'; if (cmd === 'm') cmd = 'l'; }
      return o;
    }
    return null;
  }
  function smooth(el) {
    const P = pointsOf(el); if (!P || P.length < 5 || P.length > 2000) return false;
    let maxTurn = 0;
    for (let i = 1; i + 1 < P.length; i++) { const a = [P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]], b = [P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]], la = Math.hypot(...a), lb = Math.hypot(...b); if (!la || !lb) continue; const c = (a[0] * b[0] + a[1] * b[1]) / (la * lb); maxTurn = Math.max(maxTurn, Math.acos(Math.max(-1, Math.min(1, c)))); }
    if (maxTurn > (40 * Math.PI) / 180) return false;   // a corner on purpose: a zigzag spring, a triangle
    let d = `M${r1(P[0][0])} ${r1(P[0][1])}`;
    for (let i = 0; i + 1 < P.length; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]; d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`; }
    const n = el.ownerDocument.createElementNS(NS, 'path');
    [...el.attributes].forEach((a) => { if (!/^(points|d)$/i.test(a.name)) n.setAttribute(a.name, a.value); });
    n.setAttribute('d', d); if (!n.getAttribute('fill')) n.setAttribute('fill', 'none');
    el.replaceWith(n); return true;
  }
  WL.plot = { compile, graph, smooth, value };
})();
/* Geodesic — reading settings: text size, an easy-read typeface with wider spacing, and relaxed line spacing.
   The "Aa" button in the header opens them; they apply at once and are kept for this device (wl-read). A one-line
   script in the page head applies them before the page draws, so the text never jumps. */
(function () {
  const WL = (window.WL = window.WL || {});
  const get = () => { try { return JSON.parse(localStorage.getItem('wl-read') || '{}') || {}; } catch (e) { return {}; } };
  const put = (o) => { try { localStorage.setItem('wl-read', JSON.stringify(o)); } catch (e) {} };
  function apply(o) {
    const c = document.documentElement.classList;
    c.remove('rs-z1', 'rs-z2', 'rs-z3', 'rs-easy', 'rs-loose');
    if (o.z) c.add('rs-z' + o.z); if (o.f) c.add('rs-easy'); if (o.l) c.add('rs-loose');
  }
  apply(get());
  let pop = null;
  const OPTS = [['z', 'Text size', [['0', 'Standard'], ['1', 'Larger'], ['2', 'Largest'], ['3', 'Huge']]], ['f', 'Typeface', [['0', 'Standard'], ['1', 'Easy to read']]], ['l', 'Line spacing', [['0', 'Standard'], ['1', 'Relaxed']]]];
  function build() {
    pop = document.createElement('div'); pop.className = 'rs-pop'; pop.id = 'rs-pop'; pop.hidden = true;
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Reading settings');
    const o = get();
    pop.innerHTML = `<h2>Reading settings</h2>${OPTS.map(([k, lab, ch]) => `<fieldset><legend>${lab}</legend><div class="rs-seg">${ch.map(([v, t]) => `<label><input type="radio" name="rs-${k}" value="${v}"${String(o[k] || 0) === v ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`).join('')}
      <p class="rs-note">The easy-read typeface uses wider letter and word spacing, which many readers with dyslexia find easier. These settings stay on this device.</p>
      <div class="rs-act"><button type="button" class="btn small ghost" data-rs-reset>Reset</button><button type="button" class="btn small primary" data-rs-close>Done</button></div>`;
    pop.addEventListener('change', (e) => { const i = e.target; if (!i.name || !i.name.startsWith('rs-')) return; const o = get(); o[i.name.slice(3)] = +i.value; put(o); apply(o); });
    pop.addEventListener('click', (e) => {
      if (e.target.closest('[data-rs-close]')) close();
      if (e.target.closest('[data-rs-reset]')) { put({}); apply({}); pop.querySelectorAll('input[value="0"]').forEach((x) => (x.checked = true)); }
    });
    document.body.appendChild(pop);
  }
  function open(btn) {
    if (!pop) build();
    pop.hidden = false; const r = btn.getBoundingClientRect();
    if (!r.width || r.bottom < 10) { pop.style.top = '70px'; pop.style.right = '8px'; }
    else { pop.style.top = Math.round(r.bottom + 8) + 'px'; pop.style.right = Math.max(8, Math.round(innerWidth - r.right)) + 'px'; }
    btn.setAttribute('aria-expanded', 'true'); const f = pop.querySelector('input:checked'); if (f) f.focus();
  }
  function close() { if (!pop || pop.hidden) return; pop.hidden = true; const b = document.getElementById('read-btn'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); } }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('#read-btn, [data-read-open]');
    if (b) { e.preventDefault(); if (pop && !pop.hidden) close(); else open(document.getElementById('read-btn') && getComputedStyle(document.getElementById('read-btn')).display !== 'none' ? document.getElementById('read-btn') : b); return; }
    if (pop && !pop.hidden && !e.target.closest('.rs-pop')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pop && !pop.hidden) close(); });
  window.addEventListener('hashchange', () => { if (pop) pop.hidden = true; });
  /* on a phone the menu row scrolls sideways: fade its right edge while there is more to see */
  (function navHint() {
    const nav = document.querySelector('header.top .nav'), top = document.querySelector('header.top'); if (!nav || !top) return;
    const upd = () => { const more = nav.scrollWidth > nav.clientWidth + 2 && nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4; top.classList.toggle('nav-more', more); };
    nav.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); setTimeout(upd, 400); upd();
  })();
  WL.readPrefs = { get, apply };
})();
/* Geodesic — the formula sheet (#formulas, #formulas-<stage>) and the glossary (#glossary).
   Both are built from the topics' own checked material: every topic's key equations and its result, and every key
   term with the definition exam mark schemes accept. Searchable, and laid out to print cleanly. */
(function () {
  const WL = (window.WL = window.WL || {});
  const H = () => (WL.app && WL.app.h) || {};
  const N = () => (WL.app && WL.app.nodes) || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pr = (s) => (H().pr ? H().pr(s) : esc(s));
  const GR = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'theta', κ: 'kappa', λ: 'lambda', μ: 'mu', ν: 'nu', ξ: 'xi', π: 'pi', ρ: 'rho', σ: 'sigma', τ: 'tau', φ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega' };
  const norm = (s) => String(s || '').toLowerCase().replace(/[α-ω]/g, (c) => ' ' + (GR[c] || c) + ' ').replace(/\\([a-z]+)/g, ' $1 ').replace(/[$\\{}^_]/g, ' ').replace(/\s+/g, ' ');
  const tracks = () => ['physics', 'maths'].map((k) => WL.app && WL.app.TR[k]).filter(Boolean);
  const stagesAll = () => tracks().flatMap((tr) => tr.stages.map((st) => ({ tr, st, ids: tr.order.filter((id) => N()[id] && N()[id].stage === st.id) })).filter((x) => x.ids.length));
  const debounce = (f, ms) => { let t = 0; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
  const LAST = () => { try { return localStorage.getItem('wl-fstage') || ''; } catch (e) { return ''; } };

  /* ---------- formula sheet ---------- */
  function formulas(view, sid) {
    const S = stagesAll(); if (!S.length) return;
    const cur = S.find((x) => x.st.id === sid) || S.find((x) => x.st.id === LAST()) || S[0];
    try { localStorage.setItem('wl-fstage', cur.st.id); } catch (e) {}
    document.title = `Formula sheet · ${cur.st.name} · Geodesic`;
    const blocks = cur.ids.map((id) => {
      const n = N()[id], E = ((WL.notes || {})[id] || {}).eqs || [];
      const rows = E.map(([t, m]) => ({ t, m })); if (n.result && !E.some(([t]) => t === n.result)) rows.push({ t: n.result, m: 'The result of the derivation' });
      return { id, n, rows };
    }).filter((b) => b.rows.length);
    const total = blocks.reduce((s, b) => s + b.rows.length, 0);
    view.innerHTML = `<section class="rf-head"><h1>Formula sheet</h1>
        <p class="lede">Every key equation of a stage, topic by topic, with what each one says. Search by name or symbol, or print it: it prints on clean pages without the site around it.</p>
        <div class="rf-stages" role="tablist" aria-label="Stage">${tracks().map((tr) => `<span class="rf-trk">${esc(tr.name)}</span>${S.filter((x) => x.tr === tr).map((x) => `<a role="tab" href="#formulas-${x.st.id}" aria-selected="${x === cur}">${esc(x.st.short || x.st.name)}</a>`).join('')}`).join('')}</div>
        <div class="rf-tools"><label class="vh" for="rf-q">Search the formulas</label><input id="rf-q" type="search" placeholder="Search: e.g. momentum, Snell, \\lambda" autocomplete="off"><button type="button" class="btn small" data-rf-print>Print</button><span class="rf-n" aria-live="polite">${total} equations in ${blocks.length} topics</span></div></section>
      <h2 class="rf-print-h">${esc(cur.tr.name)} · ${esc(cur.st.name)} · formula sheet</h2>
      <div class="rf-sheet">${blocks.map((b) => `<section class="rf-topic" data-k="${esc(norm(b.n.title + ' ' + b.rows.map((r) => r.m + ' ' + r.t).join(' ')))}"><h3><a href="#t-${b.id}">${esc(b.n.title)}</a></h3>
          <dl>${b.rows.map((r) => `<div class="rf-row" data-k="${esc(norm(r.m + ' ' + r.t + ' ' + b.n.title))}"><dt>\\(${esc(r.t)}\\)</dt><dd>${pr(r.m)}</dd></div>`).join('')}</dl></section>`).join('')}</div>`;
    if (H().typeset) H().typeset(view);
    const q = view.querySelector('#rf-q'), out = view.querySelector('.rf-n');
    q.addEventListener('input', debounce(() => {
      const w = norm(q.value).trim().split(' ').filter(Boolean); let n = 0;
      view.querySelectorAll('.rf-topic').forEach((sec) => { let k = 0; sec.querySelectorAll('.rf-row').forEach((r) => { const ok = !w.length || w.every((x) => r.dataset.k.includes(x)) || w.every((x) => sec.dataset.k.includes(x) && norm(sec.querySelector('h3').textContent).includes(x)); r.hidden = !ok; if (ok) k++; }); sec.hidden = !k; n += k; });
      out.textContent = w.length ? `${n} equation${n === 1 ? '' : 's'} match` : `${total} equations in ${blocks.length} topics`;
    }, 120));
    view.querySelector('[data-rf-print]').addEventListener('click', () => window.print());
  }

  /* ---------- glossary ---------- */
  function glossary(view) {
    document.title = 'Glossary · Geodesic';
    const K = WL.keyterms || {}, h = H(), map = new Map();
    tracks().forEach((tr) => tr.order.forEach((id) => (K[id] || []).forEach(([t, d]) => {
      const key = t.trim().toLowerCase(); if (!map.has(key)) map.set(key, { t: t.trim(), defs: [] });
      const e = map.get(key), st = h.stageOf ? h.stageOf(id) || {} : {};
      const same = e.defs.find((x) => x.d === d); if (same) same.ids.push(id); else e.defs.push({ d, ids: [id], st: st.short || '' });
    })));
    const list = [...map.values()].sort((a, b) => a.t.localeCompare(b.t, 'en', { sensitivity: 'base' }));
    const first = (t) => { const c = t.replace(/^[^A-Za-z0-9]+/, '')[0] || '#'; return /[A-Za-z]/.test(c) ? c.toUpperCase() : '#'; };
    const groups = {}; list.forEach((e) => (groups[first(e.t)] = groups[first(e.t)] || []).push(e));
    const letters = Object.keys(groups).sort((a, b) => (a === '#') - (b === '#') || a.localeCompare(b));
    view.innerHTML = `<section class="rf-head"><h1>Glossary</h1>
        <p class="lede">${list.length} key terms from every topic, each in the wording exam mark schemes accept. Where a term means something slightly different at different levels, each version is given with its topic.</p>
        <div class="rf-tools"><label class="vh" for="gl-q">Search the glossary</label><input id="gl-q" type="search" placeholder="Search a term or a word in its definition" autocomplete="off"><button type="button" class="btn small" data-rf-print>Print</button><span class="rf-n" aria-live="polite"></span></div>
        <nav class="gl-az" aria-label="Jump to a letter">${letters.map((l) => `<a href="#glossary" data-gl-l="${l}">${l}</a>`).join('')}</nav></section>
      <div class="gl-list">${letters.map((l) => `<section class="gl-sec" id="gl-${l}" data-l="${l}"><h2>${l}</h2><dl>${groups[l].map((e) => `<div class="gl-e" data-k="${esc(norm(e.t + ' ' + e.defs.map((x) => x.d).join(' ')))}"><dt>${esc(e.t)}</dt>${e.defs.map((x) => `<dd><span class="gl-d">${pr(x.d)}</span><span class="gl-src">${x.ids.slice(0, 4).map((id) => `<a href="#t-${id}">${esc(N()[id].title)}</a>`).join('')}${x.st ? `<small>${esc(x.st)}</small>` : ''}</span></dd>`).join('')}</div>`).join('')}</dl></section>`).join('')}</div>`;
    const lazy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting && !en.target.dataset.ts) { en.target.dataset.ts = 1; if (h.typeset) h.typeset(en.target); } }), { rootMargin: '600px 0px' });
    view.querySelectorAll('.gl-sec').forEach((s) => lazy.observe(s));
    window.addEventListener('hashchange', () => lazy.disconnect(), { once: true });
    const q = view.querySelector('#gl-q'), out = view.querySelector('.rf-n');
    q.addEventListener('input', debounce(() => {
      const w = norm(q.value).trim().split(' ').filter(Boolean); let n = 0;
      view.querySelectorAll('.gl-sec').forEach((sec) => { let k = 0; sec.querySelectorAll('.gl-e').forEach((e) => { const ok = !w.length || w.every((x) => e.dataset.k.includes(x)); e.hidden = !ok; if (ok) k++; }); sec.hidden = !k; n += k; if (k && w.length && !sec.dataset.ts) { sec.dataset.ts = 1; if (h.typeset) h.typeset(sec); } });
      out.textContent = w.length ? `${n} term${n === 1 ? '' : 's'} match` : '';
    }, 120));
    view.addEventListener('click', (e) => {
      const a = e.target.closest('[data-gl-l]'); if (a) { e.preventDefault(); const s = view.querySelector('#gl-' + a.dataset.glL); if (s) s.scrollIntoView({ block: 'start' }); return; }
      if (e.target.closest('[data-rf-print]')) { view.querySelectorAll('.gl-sec').forEach((s) => { if (!s.dataset.ts) { s.dataset.ts = 1; if (h.typeset) h.typeset(s); } }); setTimeout(() => window.print(), 600); }
    });
  }

  WL.pages = WL.pages || {};
  WL.pages.formulas = { match: (h) => h === 'formulas' || /^formulas-[a-z0-9-]+$/.test(h), nav: 'formulas', render(h, view) { formulas(view, h.slice(9)); } };
  WL.pages.glossary = { match: (h) => h === 'glossary', nav: 'glossary', render(h, view) { glossary(view); } };
  WL.refs = { stageOfTopic: (id) => (N()[id] || {}).stage };
})();
/* Select any text in a lesson, the notes, a problem or a competition page, and a small "Ask Einstein about this" button
   appears beside it. Pressing it opens Einstein with the passage attached (maths goes as its LaTeX source, not as the
   drawn picture) and asks him to explain it. Nothing is sent until the button is pressed, and it does not appear while
   a timed test or mock paper is running. (To picture a problem, press the problem itself: viz.js.) */
(function () {
  const WL = (window.WL = window.WL || {});
  const MAXC = 1500;
  let btn = null, last = null, hideT = 0;
  const SKIP = 'input, textarea, select, [contenteditable], #chat, header, nav, .iq-coach, .sel-ask, .chat, .modal';

  /* the TeX behind each drawn formula, from MathJax's own list */
  function texMap() {
    const m = new Map();
    try { const doc = window.MathJax && MathJax.startup && MathJax.startup.document; if (doc && doc.math) for (const it of doc.math) if (it.typesetRoot) m.set(it.typesetRoot, it.math); } catch (e) { /* no maths drawn yet */ }
    return m;
  }
  function selText(range) {
    const tex = texMap(), anc = range.commonAncestorContainer, root = anc.nodeType === 1 ? anc : anc.parentNode;
    const inMath = root.closest && root.closest('mjx-container'); if (inMath) return '$' + (tex.get(inMath) || inMath.textContent) + '$';
    let out = '';
    const walk = (node) => {
      if (!range.intersectsNode(node)) return;
      if (node.nodeType === 3) {
        let a = 0, b = node.data.length;
        if (node === range.startContainer) a = range.startOffset;
        if (node === range.endContainer) b = range.endOffset;
        out += node.data.slice(a, b); return;
      }
      if (node.nodeType !== 1) return;
      if (node.matches('mjx-container')) { out += ' $' + (tex.get(node) || node.textContent || '') + '$ '; return; }
      if (node.matches('script, style, mjx-assistive-mml, button, .sel-ask')) return;
      for (const c of node.childNodes) walk(c);
      if (/^(P|DIV|LI|H[1-6]|TR|SECTION|ARTICLE|ASIDE|BR|DT|DD)$/.test(node.tagName)) out += '\n';
    };
    walk(root);
    return out.replace(/[ \t]+/g, ' ').replace(/ *\n\s*/g, '\n').trim();
  }
  /* where the passage came from, in words, for Einstein */
  function whereOf(el) {
    const head = (sel) => { const s = el.closest(sel); return s && s.querySelector('h3, h2'); };
    let h;
    if ((h = head('section.nsec'))) return 'the notes, section "' + h.textContent.trim() + '"';
    if (el.closest('.fyn')) return 'a short note in Feynman’s manner';
    if (el.closest('.pcq, .pq, .exq')) return 'a practice problem';
    if (el.closest('.cm-page')) return 'a competition maths page';
    if (el.closest('.ol-page, .oly')) return 'an olympiad problem';
    if (el.closest('#pane-lesson, .pane')) {
      let p = el.closest('.pane > *') || el; while (p && !(p.matches && p.matches('h2.sec'))) p = p.previousElementSibling;
      return 'the lesson' + (p ? ', section "' + p.textContent.trim() + '"' : '');
    }
    return 'the page "' + document.title.replace(/\s*·\s*Geodesic$/, '') + '"';
  }
  function ensure() {
    if (btn) return btn;
    btn = document.createElement('div');
    btn.className = 'sel-ask'; btn.hidden = true; btn.setAttribute('role', 'group'); btn.setAttribute('aria-label', 'Ask Einstein');
    btn.innerHTML = '<button type="button" class="sa-b" data-sa="ask"><span class="emark" aria-hidden="true">E</span><span class="sa-l">Ask Einstein about this</span></button><button type="button" class="sa-b sa-hl" data-sa="hl" hidden><span class="sa-hlm" aria-hidden="true"></span><span class="sa-l">Highlight</span></button>';
    btn.addEventListener('mousedown', (e) => e.preventDefault());   // keep the selection visible while pressing
    btn.addEventListener('click', (e) => { const a = e.target.closest('[data-sa]'); if (!a) return; if (a.dataset.sa === 'hl') mark(); else go(); });
    document.body.appendChild(btn);
    return btn;
  }
  function hide() { if (!btn || btn.hidden) return; btn.classList.remove('in'); clearTimeout(hideT); hideT = setTimeout(() => { if (!btn.classList.contains('in')) btn.hidden = true; }, 160); }
  function check(e) {
    const s = window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) { hide(); return; }
    const r = s.getRangeAt(0), anc = r.commonAncestorContainer, el = anc.nodeType === 1 ? anc : anc.parentNode;
    const view = document.getElementById('view');
    if (!el || !view || !view.contains(el) || el.closest(SKIP) || (WL.viz && WL.viz.timed())) { hide(); return; }
    const raw = s.toString().trim();
    if (raw.replace(/\s/g, '').length < 2) { hide(); return; }
    let t = selText(r); if (!t) t = raw;
    if (t.length > MAXC) t = t.slice(0, MAXC) + '…';
    last = { text: t, where: whereOf(el), range: r.cloneRange() };
    const b = ensure(), rc = r.getBoundingClientRect();
    b.querySelector('[data-sa=hl]').hidden = !(WL.notebook && /^#t-/.test(location.hash) && el.closest('.topic article'));
    const touch = e && (e.pointerType === 'touch' || /^touch/.test(e.type));
    b.hidden = false; const w = b.offsetWidth || 220, h = b.offsetHeight || 36;
    let top = touch || rc.top < 70 ? rc.bottom + 10 : rc.top - h - 10;
    top = Math.max(64, Math.min(innerHeight - h - 10, top));
    const left = Math.max(10, Math.min(innerWidth - w - 10, rc.left + rc.width / 2 - w / 2));
    b.style.top = top + 'px'; b.style.left = left + 'px';
    requestAnimationFrame(() => b.classList.add('in'));
  }
  function go() {
    if (!last || !WL.tutor) return;
    const m = /^#t-(.+)$/.exec(location.hash), topic = m && WL.app && WL.app.tutorTopicFor ? WL.app.tutorTopicFor(m[1]) : null;
    const chip = { label: 'Selected text', text: `The student selected this passage from ${last.where} (maths in LaTeX between $ signs):\n"""${last.text}"""`,
      suggestions: ['Explain it in simpler words', 'Why is it true?', 'Give me an example', 'What does each symbol mean?'] };
    hide();
    try { window.getSelection().removeAllRanges(); } catch (e) { /* nothing selected */ }
    WL.tutor.open(Object.assign(topic ? { topic } : {}, { chip, say: 'Explain the part I selected: what it says, why it is true, and how it fits the topic.' }));
  }
  /* keep the selected words as a highlight on this topic (notebook.js) */
  function mark() {
    const m = /^#t-(.+)$/.exec(location.hash); if (!m || !last || !last.range || !WL.notebook) return;
    WL.notebook.add(m[1], last.range, last.where, last.text);
    hide(); try { window.getSelection().removeAllRanges(); } catch (e) { /* nothing selected */ }
  }
  let t0 = 0;
  const soon = (e) => { clearTimeout(t0); t0 = setTimeout(() => check(e), e && e.type === 'keyup' ? 250 : 30); };
  document.addEventListener('pointerup', soon);
  document.addEventListener('keyup', (e) => { if (e.key === 'Escape') { hide(); return; } if (e.shiftKey || e.key === 'Shift') soon(e); });
  document.addEventListener('selectionchange', () => { const s = window.getSelection(); if (!s || s.isCollapsed) hide(); });
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
  window.addEventListener('hashchange', hide);
})();
/* Geodesic — a lecture for every topic. The site's live lecture engine (js/lectures.js) draws and narrates a lecture
   compiled from the topic's own checked material: the question it answers, the experiment (the live animation, or the
   "See it" part of the topic's film), each idea with its equation, a worked example and a quick check, the derivation
   on the board with the reason for every line, why it has to be so, where it breaks, common mistakes, problems with a
   pause to try them, and a summary. Every lecture runs at least ten minutes; if the material is short, more problems
   are added. Page: #tl-<topic id>.
   Nothing about the reader goes into a lecture. "Ask Einstein about this moment" sends only the lecture's own words,
   and the notes a reader adds stay in this browser. */
(function () {
  const WL = (window.WL = window.WL || {});
  const SERIF = '"STIX Two Text", "Times New Roman", serif', SANS = '"IBM Plex Sans", system-ui, sans-serif';
  const MIN_SECS = 600, WPS = 2.45, MIN_BEAT = 2.3, GAP = 0.72;   // the engine's speaking rate (js/lectures.js)
  const H = () => (WL.app && WL.app.h) || {};
  const nodes = () => (WL.app && WL.app.nodes) || {};
  const col = (k) => (WL.C || {})[k] || k;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const strip = (s) => String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\$([^$]+)\$/g, '$1').replace(/\s+/g, ' ').trim();
  const sents = (p) => { const s = strip(p); return s ? s.split(/(?<=[.!?])\s+(?=[A-Z0-9“"'(ΔΣΩΦΨΓΛΘ√∫])/).map((x) => x.trim()).filter(Boolean) : []; };
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const tSpeak = (t) => (WL.texSpeak ? WL.texSpeak(t) : t);
  const nwords = (s) => (s ? String(s).trim().split(/\s+/).length : 0);
  const beatLen = (text) => { const n = nwords(text); return n ? Math.max(MIN_BEAT, n / WPS + GAP) : 0; };
  /* the engine's timeline sums, so a lecture's length is known before the engine loads */
  function secsOf(chapters) {
    let G = 0;
    chapters.forEach(([, list]) => list.forEach((sc) => {
      let t = sc.lead == null ? 0.35 : sc.lead;
      (sc.say || []).forEach((b) => { t += typeof b === 'number' ? b : Array.isArray(b) ? beatLen(b[0]) + (b[1] || 0) : beatLen(b); });
      G += t + (sc.tail == null ? 0.9 : sc.tail);
    }));
    return G;
  }
  /* plain text on the board: _x and ^x become Unicode where Unicode has the characters */
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ', r: 'ᵣ', i: 'ᵢ', j: 'ⱼ', u: 'ᵤ', v: 'ᵥ', '+': '₊', '-': '₋', '−': '₋', '(': '₍', ')': '₎', '=': '₌' };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ', i: 'ⁱ', '+': '⁺', '-': '⁻', '−': '⁻', '(': '⁽', ')': '⁾', '=': '⁼' };
  const conv = (str, M) => (str && [...str].every((c) => M[c]) ? [...str].map((c) => M[c]).join('') : null);
  const uni = (s) => String(s)
    .replace(/_\{([^{}]{1,14})\}/g, (m, a) => conv(a, SUB) || '_' + a)
    .replace(/_([A-Za-z0-9]{1,4})(?![A-Za-z0-9])/g, (m, a) => conv(a, SUB) || m)
    .replace(/\^\{([^{}]{1,14})\}/g, (m, a) => conv(a, SUP) || '^(' + a + ')')
    .replace(/\^([−-]?[0-9]+)(?![.,]?[0-9])/g, (m, a) => conv(a, SUP) || m)
    .replace(/\^n(?![A-Za-z])/g, 'ⁿ');
  const mc = document.createElement('canvas').getContext('2d');
  function wrap(text, size, maxW, font = SERIF) {
    mc.font = `${size}px ${font}`; const out = []; let cur = '';
    String(text).split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (cur && mc.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); return out;
  }
  const fitTxt = (str, size, maxW, font = SERIF) => { mc.font = `${size}px ${font}`; const w = mc.measureText(str).width; return w > maxW ? Math.max(18, Math.floor(size * maxW / w)) : size; };
  const fitTex = (r, src, size, maxW) => { const z = r.texSize(src, size); return z && z.w > maxW ? Math.max(14, size * maxW / z.w) : size; };
  const DIM = 'rgba(236,236,236,0.62)';

  /* ---------- pieces of a board ---------- */
  function head(r, S, kick, title) {
    const C = WL.C, a = S.in(0.05, 0.6), t = uni(title);
    if (kick) r.txt(kick, 60, 44, { size: 15, sans: true, c: C.yellow, a });
    r.txt(t, 60, 82, { size: fitTxt(t, 30, 840), c: C.ink, a });
    r.line(60, 106, 60 + 120 * S.in(0.2, 0.8), 106, { c: C.blue, w: 2 });
  }
  /* a ring that fills while the lecture waits for you to think */
  function pauseRing(r, S, k, x, y, label) {
    if (k >= S.B.length) return;
    const C = WL.C, a = S.at(k, 0.5) * (k + 1 < S.B.length ? 1 - S.at(k + 1, 0.4) : 1); if (a <= 0.01) return;
    const f = Math.max(0, Math.min(1, S.since(k) / (S.D[k] || 6)));
    r.circle(x, y, 13, { c: C.yellow, w: 3, p: f, a: a * 0.9 });
    r.txt(label, x + 26, y + 1, { size: 18, sans: true, c: C.yellow, a });
  }

  /* ---------- scenes ---------- */
  function titleScene(n, stage) {
    const T = uni(strip(n.title)), sub = wrap(uni(strip(n.summary)), 22, 760).slice(0, 3);
    return { say: [`${strip(n.title)}.`, `A lecture at ${stage || 'this'} level. ${strip(n.summary)}`], tail: 0.6,
      draw(r, S) {
        const C = WL.C, b = 0.35 + 0.65 * S.in(0.3, 1.2);
        r.txt(stage ? `Lecture · ${stage}` : 'Lecture', 480, 168, { size: 16, sans: true, align: 'center', c: C.yellow });
        r.txt(T, 480, 228, { size: fitTxt(T, 46, 860), align: 'center' });
        r.line(480 - 210 * b, 268, 480 + 210 * b, 268, { c: C.blue, w: 2.5 });
        sub.forEach((L, i) => r.txt(L, 480, 314 + i * 31, { size: 22, align: 'center', c: C.greyB }));
      } };
  }
  /* sentences on the board, the one being read in full ink; a long passage runs over several boards */
  function textScenes(kick, title, list, o = {}) {
    const size = 23, lh = 33, maxW = 840, cap = o.tex ? 6 : 9;
    const blocks = list.map((s) => ({ s, lines: wrap(uni(s), size, maxW) }));
    const groups = []; let cur = [], n = 0;
    blocks.forEach((b) => { if (cur.length && n + b.lines.length > cap) { groups.push(cur); cur = []; n = 0; } cur.push(b); n += b.lines.length; });
    if (cur.length) groups.push(cur);
    return groups.map((grp, gi) => {
      const last = gi === groups.length - 1, texK = last && o.tex ? grp.length : -1;
      const say = grp.map((x) => x.s);
      if (texK >= 0) say.push(o.texSay || `In symbols: ${tSpeak(o.tex)}.`);
      return { nocap: true, say,
        draw(r, S) {
          const C = WL.C, K = WL.lec.K;
          head(r, S, kick, title + (gi ? ', continued' : ''));
          let y = 140;
          grp.forEach((x, k) => {
            const a = S.at(k, 0.55);
            if (a > 0) { const c = S.b === k ? C.ink : DIM; x.lines.forEach((L, i) => r.txt(L, 60, y + i * lh + (1 - a) * 5, { size, c, a })); }
            y += x.lines.length * lh + 9;
          });
          if (texK >= 0) {
            const a = S.at(texK, 0.6); if (a > 0) {
              const sz = fitTex(r, o.tex, 34, 790), yy = Math.min(Math.max(y + 46, 330), 452);
              r.rr(80, yy - 50, 800, 100, 12, { c: C.blue, w: 1.6, fill: '#0f141c', fa: 0.9, a });
              K.tex(r, S, texK, o.tex, 480, yy, { size: sz });
            }
          }
        } };
    });
  }
  function listScenes(kick, title, items, o = {}) {
    const size = 21, lh = 29, maxW = 800;
    const blocks = items.map((s) => ({ s: strip(s), lines: wrap(uni(strip(s)), size, maxW) })), groups = []; let cur = [], n = 0;
    blocks.forEach((b) => { if (cur.length && n + b.lines.length > 10) { groups.push(cur); cur = []; n = 0; } cur.push(b); n += b.lines.length + 0.4; });
    if (cur.length) groups.push(cur);
    return groups.map((grp, gi) => {
      const off = gi === 0 && o.intro ? 1 : 0;
      return { nocap: true, say: (off ? [o.intro] : []).concat(grp.map((x) => x.s)),
        draw(r, S) {
          const C = WL.C;
          head(r, S, kick, title + (gi ? ', continued' : ''));
          let y = 146;
          grp.forEach((x, k) => {
            const a = S.at(k + off, 0.55);
            if (a > 0) { r.dot(66, y, { r: 4.5, c: col(o.dot || 'blue'), a }); const c = S.b === k + off ? C.ink : DIM; x.lines.forEach((L, i) => r.txt(L, 86, y + i * lh, { size, c, a })); }
            y += x.lines.length * lh + 12;
          });
        } };
    });
  }
  /* a worked example or a problem: the question, a pause to try it, the working line by line, the answer boxed */
  function exampleScenes(kick, ex, o = {}) {
    const q = strip(ex[0]), steps = (ex[1] || []).map(strip).filter(Boolean), ans = strip(ex[2] || '');
    const qL = wrap(uni(q), 23, 840), sL = steps.map((s) => wrap(uni(s), 21, 790)), aL = ans ? wrap(uni('Answer: ' + ans), 21, 760) : [];
    const parts = []; let cur = [], used = 0, budget = Math.max(3, 9 - qL.length - (o.pause ? 1 : 0));
    sL.forEach((L, i) => { if (cur.length && used + L.length > budget) { parts.push(cur); cur = []; used = 0; budget = 8; } cur.push(i); used += L.length; });
    parts.push(cur);
    if (aL.length && cur.length && used + aL.length + 1 > budget) parts.push([]);
    const prompt = o.prompt || 'Try it yourself before I go on.';
    return parts.map((idx, pi) => {
      const first = pi === 0, last = pi === parts.length - 1, say = [];
      if (first) { say.push(`${o.say || 'A worked example.'} ${q}`); if (o.pause) say.push([prompt, o.pause]); }
      const s0 = say.length; idx.forEach((i) => say.push(steps[i]));
      const ak = last && ans ? say.length : -1; if (ak >= 0) say.push(`So the answer is: ${ans}`);
      const sc = { nocap: true, say,
        draw(r, S) {
          const C = WL.C;
          head(r, S, kick, o.title || 'Worked example');
          let y = 140;
          if (first) qL.forEach((L) => { r.txt(L, 60, y, { size: 23, c: C.ink, a: S.at(0, 0.6) }); y += 33; });
          else wrap(uni(q), 17, 840, SANS).slice(0, 2).forEach((L) => { r.txt(L, 60, y, { size: 17, sans: true, c: C.dim }); y += 24; });
          y += 16;
          if (first && o.pause) { pauseRing(r, S, 1, 80, y + 4, 'Pause here and try it yourself'); if (S.b <= 1) return; }
          idx.forEach((i, k) => {
            const kk = s0 + k, a = S.at(kk, 0.55);
            if (a > 0) { r.txt(String(i + 1), 64, y, { size: 16, sans: true, c: C.teal, a }); sL[i].forEach((l, j) => r.txt(l, 92, y + j * 30, { size: 21, c: S.b === kk ? C.ink : 'rgba(236,236,236,0.72)', a })); }
            y += sL[i].length * 30 + 8;
          });
          if (ak >= 0) {
            const a = S.at(ak, 0.6);
            if (a > 0) { r.rr(70, y + 2, 820, 20 + aL.length * 30, 10, { c: C.yellow, w: 1.8, fill: '#16140c', fa: 0.6, a }); aL.forEach((l, j) => r.txt(l, 88, y + 26 + j * 30, { size: 21, c: C.ink, a })); }
          }
        } };
      if (first && o.pause) sc.stop = { k: 1, off: beatLen(prompt) };
      return sc;
    });
  }
  function checkScene(kick, c) {
    const q = strip(c[0]), a = strip(c[1]), qL = wrap(uni(q), 25, 780), aL = wrap(uni(a), 21, 760);
    const prompt = 'Think about it for a moment.';
    return { nocap: true, stop: { k: 1, off: beatLen(prompt) }, say: [`Quick check. ${q}`, [prompt, 4.5], `Here is the answer. ${a}`],
      draw(r, S) {
        const C = WL.C;
        head(r, S, kick, 'Quick check');
        qL.forEach((L, i) => r.txt(L, 480, 176 + i * 36, { size: 25, align: 'center', a: S.at(0, 0.6) }));
        const y0 = 176 + qL.length * 36 + 30;
        pauseRing(r, S, 1, 380, y0 + 6, 'Think, then answer');
        const e = S.at(2, 0.6);
        if (e > 0) { r.rr(110, y0 - 22, 740, aL.length * 30 + 30, 10, { c: C.green, w: 1.6, fill: '#0e1610', fa: 0.6, a: e }); aL.forEach((L, i) => r.txt(L, 480, y0 - 4 + i * 30 + 8, { size: 21, align: 'center', a: e })); }
      } };
  }
  /* the derivation, two lines of working to a board: what the step does, the equation, and why it is allowed */
  function derivationScenes(n) {
    const all = (n.steps || []).map((s, i) => [s, i]).filter(([s]) => s && s.tex), out = [];
    for (let i0 = 0; i0 < all.length; i0 += 2) {
      const grp = all.slice(i0, i0 + 2).map(([s]) => s), idx = all.slice(i0, i0 + 2).map(([, i]) => i), say = [], bk = [];
      grp.forEach((s, k) => { const ks = say.length; say.push(`Step ${i0 + k + 1}. ${strip(s.say || '')}`); let kw = -1; if (s.why) { kw = say.length; say.push(`Why? ${strip(s.why)}`); } bk.push([ks, kw]); });
      const sayL = grp.map((s) => wrap(uni(strip(s.say || '')), 18, 800, SANS).slice(0, 2));
      const whyL = grp.map((s) => (s.why ? wrap(uni('Why? ' + strip(s.why)), 16, 790, SANS).slice(0, 3) : []));
      out.push({ nocap: true, say, dsteps: idx.map((i, k) => [i, bk[k][0]]),
        draw(r, S) {
          const C = WL.C, K = WL.lec.K;
          head(r, S, 'The derivation', i0 ? 'The derivation, continued' : 'Deriving it on the board');
          grp.forEach((s, k) => {
            const y = 148 + k * 184, [ks, kw] = bk[k], a = S.at(ks, 0.5); if (a <= 0) return;
            r.txt(String(i0 + k + 1), 64, y, { size: 16, sans: true, c: C.teal, a });
            sayL[k].forEach((L, j) => r.txt(L, 92, y + j * 24, { size: 18, sans: true, c: S.b === ks ? C.ink : C.greyB, a }));
            const ty = y + sayL[k].length * 24 + 30;
            K.tex(r, S, ks, s.tex, 92, ty, { size: fitTex(r, s.tex, 30, 790), align: 'left', dl: 0.3 });
            if (kw >= 0) {
              const w = S.at(kw, 0.5);
              if (w > 0) whyL[k].forEach((L, j) => r.txt(L, 92, ty + 42 + j * 21, { size: 16, sans: true, c: C.teal, a: w }));
              if (S.b === kw) K.hl(r, S, kw, 84, ty - 27, 812, 54, { c: C.yellow });
            }
          });
        } });
    }
    if (n.result) out.push({ nocap: true, say: [`Putting it together: ${tSpeak(n.result)}.`, 'That is the result. Everything else in this topic is a way of using it.'],
      draw(r, S) {
        const C = WL.C, K = WL.lec.K, a = S.at(0, 0.6);
        head(r, S, 'The derivation', 'The result');
        if (a > 0) { r.rr(70, 206, 820, 130, 14, { c: C.yellow, w: 2.2, fill: '#16140c', fa: 0.5, a }); K.tex(r, S, 0, n.result, 480, 271, { size: fitTex(r, n.result, 36, 760) }); }
        const b = S.at(1, 0.6); if (b > 0) r.txt('Everything else in this topic is a way of using it.', 480, 388, { size: 20, sans: true, align: 'center', c: C.greyB, a: b });
      } });
    return out;
  }
  /* the topic's own live animation, its timeline kept in step with the narration */
  function demoScene(n) {
    const A = n.anim; if (!A || typeof A.draw !== 'function') return null;
    const dur = A.duration || 12, beats = (A.beats || []).filter((b) => b && strip(b[1]));
    const P = {}; (A.params || []).forEach((p) => (P[p.id] = p.value));
    const say = ['Before any equations, watch it happen.'], seg = [[0, 0]];
    beats.forEach((b, i) => { const t0 = +b[0] || 0, t1 = i + 1 < beats.length ? +beats[i + 1][0] : dur, len = Math.max(0.5, t1 - t0), x = strip(b[1]); say.push([x, Math.max(0, len - beatLen(x))]); seg.push([t0, len]); });
    if (!beats.length) { say.push(dur); seg.push([0, dur]); }
    const pl = (A.params || [])[0];
    say.push(pl ? `On the topic page you can change the ${strip(pl.label).toLowerCase()} yourself and watch what follows.` : 'Keep this picture in mind: everything that follows explains it.');
    seg.push([dur, 0]);
    return { say, tail: 0.5,
      draw(r, S) {
        const C = WL.C, k = Math.max(0, S.b); let at = 0;
        if (k >= 1 && k < seg.length - 1) at = seg[k][0] + Math.min(seg[k][1], Math.max(0, S.t - S.B[k]));
        else if (k >= seg.length - 1) at = Math.min(dur - 0.01, seg[k - 1][0] + seg[k - 1][1] + Math.max(0, S.t - S.B[k]));
        const t0 = r.t; r.p = P; r.t = at;
        if (r._dfor !== n.id || at < (r._dlast || 0) - 0.25) { r.state = {}; if (A.setup) try { A.setup(r); } catch (e) {} }
        r._dfor = n.id; r._dlast = at;
        try { A.draw(r, at, r.dt || 0); (A.texs || []).forEach((q) => r.texAt(q[1], q[2], q[3], q[0], { size: q[4] || 30, c: q[5] || C.ink, t1: q[6], align: q[7] })); } catch (e) { if (!this._err) { this._err = 1; console.warn('lecture demo', n.id, e && e.message); } }
        r.t = t0;
        r.txt('The experiment', 24, 26, { size: 14, sans: true, c: C.yellow, a: S.in(0.1, 0.6) });
      } };
  }
  /* the "See it" part of the topic's film, played inside the lecture */
  const FILM = { v: null, src: '', sc: null, dog: 0 };
  function filmEl(src, sc) {
    if (FILM.src !== src) {
      if (FILM.v) try { FILM.v.pause(); FILM.v.removeAttribute('src'); FILM.v.load(); } catch (e) {}
      const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto'; v.src = src;
      FILM.v = v; FILM.src = src;
    }
    FILM.sc = sc;
    if (!FILM.dog) FILM.dog = setInterval(() => {
      const P = WL.lec && WL.lec.current, cur = P && P.alive ? P.P.scenes[P.si] : null;
      if (FILM.v && !FILM.v.paused && (!cur || cur.sc !== FILM.sc || !P.playing)) FILM.v.pause();
      if (!P || !P.alive) { clearInterval(FILM.dog); FILM.dog = 0; if (FILM.v) try { FILM.v.pause(); FILM.v.removeAttribute('src'); FILM.v.load(); } catch (e) {} FILM.v = null; FILM.src = ''; }
    }, 300);
    return FILM.v;
  }
  function filmScene(id) {
    const clip = WL.spots?.find((spot) => spot.topic === id);
    const sv = (WL.svideos || {})[id];
    const i = sv?.ch?.findIndex((chapter) => /^see it/i.test(chapter[1])) ?? -1;
    if (!clip && i < 0) return null;
    const t0 = clip ? 0 : +sv.ch[i][0];
    const t1 = clip ? clip.seconds : i + 1 < sv.ch.length ? +sv.ch[i + 1][0] : +sv.dur;
    const len = Math.max(3, t1 - t0 - 0.15);
    const src = clip ? 'spot/' + id + '.mp4' :
      'https://b8313b41-06f1-4a6a-a5c8-cd5647ea5ea8.frame.claudeusercontent.com/_f/1795426252-2985/svideos/' + id + '.mp4';
    const sc = { say: ['Before any equations, watch it happen. The film has its own words, so read along.', len], tail: 0.4,
      draw(r, S) {
        const C = WL.C, c = r.ctx, local = S.b >= 1 ? Math.min(len, Math.max(0, S.t - S.B[1])) : 0, want = t0 + local;
        if (!c || c.canvas.width < 320) return;                       // the engine's small warm-up canvas
        const v = filmEl(src, sc), P = WL.lec && WL.lec.current, run = !!(P && P.playing && !P.hold && S.b >= 1 && local < len - 0.05);
        try { v.playbackRate = P ? P.speed : 1; } catch (e) {}
        if (run) { if (v.paused) v.play().catch(() => {}); if (!v.seeking && Math.abs(v.currentTime - want) > 0.45) v.currentTime = want; }
        else { if (!v.paused) v.pause(); if (!v.seeking && Math.abs(v.currentTime - want) > 0.1) try { v.currentTime = want; } catch (e) {} }
        if (v.readyState >= 2) { const ga = c.globalAlpha; c.globalAlpha = r._a; c.drawImage(v, 0, 0, 960, 540); c.globalAlpha = ga; }
        else r.txt(v.error ? 'This clip is unavailable. Continue to the next chapter.' : 'Loading the film…', 480, 270, { size: 22, sans: true, align: 'center', c: C.dim });
      } };
    return sc;
  }
  function problemScenes(p, k) {
    return exampleScenes('Practice', [p.q, p.s, p.a], { title: `Problem ${k}`, say: `Problem ${k}.`, pause: 6, prompt: 'Pause the lecture and try it. Press play when you want the solution.' });
  }

  /* ---------- the lecture for one topic ---------- */
  const cache = {}, SECS = {}, KEPT = [];
  const fontsReady = () => (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve());
  async function compile(id) {
    if (cache[id]) return cache[id];
    const n = nodes()[id]; if (!n) return null;
    await fontsReady();
    const g = WL.guideLoad ? await WL.guideLoad(id).catch(() => null) : null;
    const fy = WL.feyLoad ? await WL.feyLoad(id).catch(() => null) : null;
    const notes = (WL.notes || {})[id] || null;
    const st = H().stageOf ? H().stageOf(id) || {} : {};
    const steps = (g && g.s) || [], chapters = [];
    /* 1. the question */
    const hook = g && g.h ? sents(g.h) : sents(n.idea || n.summary);
    const ch1 = [titleScene(n, st.name || '')];
    ch1.push(...textScenes('The question', 'Where this begins', hook.concat(fy && fy[0] ? sents(fy[0]) : [])));
    if (steps.length) ch1.push(...listScenes('The plan', 'By the end of this lecture you will be able to explain', steps.map(([h]) => strip(h)), { intro: 'Here is the plan for this lecture.' }));
    chapters.push(['The question', ch1]);
    /* 2. the experiment */
    const demo = demoScene(n) || filmScene(id); if (demo) chapters.push(['See it happen', [demo]]);
    /* 3. the ideas, a chapter each */
    if (steps.length) steps.forEach(([h, ps, o]) => {
      o = o || {}; const sc = [], name = strip(h);
      sc.push(...textScenes('The idea', name, (ps || []).flatMap(sents), { tex: o.e }));
      if (o.x) sc.push(...exampleScenes(name, o.x, { pause: 4 }));
      if (o.c) sc.push(checkScene(name, o.c));
      chapters.push([name, sc]);
    });
    else if (notes && notes.sec) notes.sec.forEach((x) => chapters.push([strip(x.h), textScenes('The idea', strip(x.h), (x.p || []).flatMap(sents).concat(x.box ? sents(x.box) : []), { tex: x.eq })]));
    /* 4. the derivation */
    chapters.push(['The derivation', derivationScenes(n)]);
    /* 5. why it has to be so */
    const why = [];
    if (fy && fy[1]) why.push(...textScenes('Why it has to be so', 'The picture', sents(fy[1])));
    if (fy && fy[2]) why.push(...textScenes('Why it has to be so', 'Why it must be so', sents(fy[2])));
    if (fy && fy[3]) why.push(...textScenes('Why it has to be so', 'A rough number', sents(fy[3])));
    chapters.push(['Why it has to be so', why]);
    /* 6. where it breaks */
    const brk = [], asm = (n.assumptions || n.dassume || []).map(strip).filter(Boolean);
    if (asm.length) brk.push(...listScenes('Where it breaks', 'What we assumed', asm, { intro: 'Every result rests on assumptions. Here are the ones this one needs.', dot: 'gold' }));
    if (fy && fy[4]) brk.push(...textScenes('Where it breaks', 'What the picture leaves out', sents(fy[4])));
    chapters.push(['Where it breaks', brk]);
    /* 7. common mistakes */
    chapters.push(['Common mistakes', g && g.m && g.m.length ? listScenes('Common mistakes', 'Mistakes to avoid', g.m.map(([a, b]) => `${strip(a)} ${strip(b)}`), { intro: 'Now the mistakes students make most often here, and what to do instead.', dot: 'red' }) : []]);
    /* 8. solving problems: medium ones first, then hard, then the rest */
    const solve = [];
    if (notes && notes.how && notes.how.length) solve.push(...listScenes('Solving problems', 'How to attack a problem', notes.how, { intro: 'When you meet a problem on this topic, work through these steps.' }));
    const rank = (l) => (l === 2 ? 0 : l === 3 ? 1 : 2);
    const probs = ((notes && notes.probs) || []).filter((p) => p && p.q && p.a && (p.s || []).length).map((p, i) => [p, i]).sort((a, b) => rank(a[0].l) - rank(b[0].l) || a[1] - b[1]).map((x) => x[0]);
    let pk = 0; const addProblem = () => { const p = probs[pk++]; if (p) solve.push(...problemScenes(p, pk)); return !!p; };
    addProblem(); addProblem();
    chapters.push(['Solving problems', solve]);
    /* 9. summary */
    const sum = [];
    if (notes && notes.sum && notes.sum.length) sum.push(...listScenes('Summary', 'The lecture in one minute', notes.sum, { intro: 'To finish, here is the whole lecture in one minute.', dot: 'green' }));
    if (notes && notes.eqs && notes.eqs.length) {
      const E = notes.eqs.slice(0, 6);
      sum.push({ nocap: true, say: ['The equations to keep.', ...E.map(([t, m]) => `${strip(m)}: ${tSpeak(t)}.`), 'Close the lecture now and try to write these down from memory. Then check.'],
        draw(r, S) {
          const C = WL.C, K = WL.lec.K;
          head(r, S, 'Summary', 'The equations to keep');
          E.forEach(([t, m], i) => {
            const x = 70 + (i % 2) * 420, y = 172 + Math.floor(i / 2) * 112, a = S.at(i + 1, 0.55); if (a <= 0) return;
            r.rr(x, y - 44, 400, 96, 10, { c: S.b === i + 1 ? C.yellow : C.blueE, w: 1.4, fill: '#0f141c', fa: 0.7, a });
            K.tex(r, S, i + 1, t, x + 200, y - 8, { size: fitTex(r, t, 26, 370) });
            r.txt(wrap(uni(strip(m)), 14, 370, SANS)[0] || '', x + 200, y + 32, { size: 14, sans: true, align: 'center', c: C.dim, a });
          });
        } });
    }
    sum.push({ say: [`That is ${strip(n.title)}.`, 'Next, open Practice on the topic page. The first questions are checked as soon as you answer, and when you have done them, Einstein can write ten more at the level you choose.', 1.5],
      draw(r, S) {
        const C = WL.C, a = S.in(0.15, 1);
        r.txt('Now practise', 480, 236, { size: 44, align: 'center', a });
        r.line(480 - 180 * S.in(0.8, 1), 274, 480 + 180 * S.in(0.8, 1), 274, { c: C.green, w: 2.5 });
        r.txt('Open the topic page and choose Practice', 480, 318, { size: 22, align: 'center', c: C.greyB, a: S.in(1.2, 1) });
      } });
    chapters.push(['Summary', sum]);
    /* at least ten minutes: more problems until it is long enough */
    let secs = secsOf(chapters), guard = 0;
    while (secs < MIN_SECS && guard++ < 12 && addProblem()) secs = secsOf(chapters);
    const spec = { id: 't-' + id, title: strip(n.title), sub: strip(n.summary), level: st.name || '', topics: [id], thumb: [0, 3], refs: [], chapters: chapters.filter(([, l]) => l.length) };
    spec.secs = secsOf(spec.chapters);
    cache[id] = spec; SECS[id] = spec.secs; KEPT.push(id);
    while (KEPT.length > 6) delete cache[KEPT.shift()];   // keep the last few lectures; building one again takes milliseconds
    return spec;
  }

  /* ---------- storage: progress (the engine's), the reader's notes and the stop-at-problems switch ---------- */
  const user = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  const jget = (k, d) => { try { return JSON.parse(localStorage.getItem(k + user()) || 'null') || d; } catch (e) { return d; } };
  const jput = (k, v) => { try { localStorage.setItem(k + user(), JSON.stringify(v)); } catch (e) {} };
  const prog = (sid) => (jget('wl-lec-p', {}) || {})[sid] || null;
  const nget = () => jget('wl-tlnotes', {});
  const nput = (o) => jput('wl-tlnotes', o);
  const stopOn = () => !!jget('wl-tlstop', false);

  /* ---------- the topic page banner and the list on #lectures ---------- */
  function banner(id) {
    const n = nodes()[id]; if (!n) return '';
    const p = prog('t-' + id), f = p ? (p.done ? 1 : Math.min(1, (p.g || 0) / Math.max(1, p.total || 600))) : 0;
    return `<a class="lec-banner tl-banner" href="#tl-${id}" data-tlb="${id}"><span class="lec-bk">Full lecture · <span data-tlmin>10+ min</span></span><b>The whole topic, taught on the board</b><span class="lec-bs">The question, the experiment, each idea with a worked example, the derivation line by line, where it breaks, and problems to try. Narrated, with a transcript.</span>${p ? `<span class="lec-pg" title="${p.done ? 'Watched' : `${Math.round(f * 100)}% watched`}"><i style="width:${(f * 100).toFixed(0)}%"></i></span>` : ''}</a>`;
  }
  function fillBanner(root, id) {
    const el = root && root.querySelector(`[data-tlb="${id}"] [data-tlmin]`); if (!el) return;
    compile(id).then((s) => { if (s && el.isConnected) el.textContent = `${Math.round(s.secs / 60)} min`; }).catch(() => {});
  }
  function indexHTML() {
    const A = WL.app; if (!A || !A.TR) return '';
    const N = nodes(), tracks = ['physics', 'maths'].map((k) => A.TR[k]).filter(Boolean);
    const total = tracks.reduce((s, tr) => s + tr.order.length, 0);
    return `<section class="tl-index" aria-labelledby="tl-ih"><h2 id="tl-ih">A lecture for every topic</h2>
      <p class="tl-il">All ${total} topics have their own narrated lecture of at least ten minutes, built from the topic’s checked notes, derivation and problems. Choose a stage, then a topic.</p>
      ${tracks.map((tr) => `<h3 class="tl-tr">${esc(tr.name)}</h3>${(tr.stages || []).map((st) => { const ids = tr.order.filter((id) => N[id] && N[id].stage === st.id); if (!ids.length) return ''; return `<details class="tl-st"><summary><span>${esc(st.name)}</span><small>${ids.length} lectures</small></summary><ol>${ids.map((id) => { const p = prog('t-' + id); return `<li><a href="#tl-${id}">${esc(strip(N[id].title))}</a>${p ? `<small>${p.done ? 'watched' : `${mmss(p.g || 0)} in`}</small>` : ''}</li>`; }).join('')}</ol></details>`; }).join('')}`).join('')}
    </section>`;
  }

  /* ---------- the page ---------- */
  WL.pages = WL.pages || {};
  WL.pages.topicLecture = {
    match: (h) => /^tl-[a-z0-9-]+$/.test(h), nav: 'lectures',
    render(h, view) {
      const id = h.slice(3), n = nodes()[id], hh = H();
      if (!n) { document.title = 'Lecture not found · Geodesic'; view.innerHTML = '<section class="lec-head"><p class="crumb"><a href="#lectures">Lectures</a></p><h1>Lecture not found</h1><p>Choose one from the <a href="#lectures">list of lectures</a>.</p></section>'; return; }
      const st = (hh.stageOf && hh.stageOf(id)) || {};
      document.title = `${strip(n.title)} · Lecture · Geodesic`;
      view.innerHTML = `<section class="lec-head lec-head-p"><p class="crumb"><a href="#lectures">Lectures</a> › <a href="#t-${id}">${esc(strip(n.title))}</a></p><h1>${esc(strip(n.title))}</h1><p class="lede">${esc(strip(n.summary))}</p>
          <p class="lec-meta" id="tl-meta">${esc(st.name || '')} · building the lecture…</p></section>
        <div class="lec-host" id="lec-host"><div class="lec-loading">Building the lecture from this topic…</div></div>
        <div class="tl-tools">
          <button type="button" class="btn small" data-tl-ask><span class="emark" aria-hidden="true">E</span>Ask Einstein about this moment</button>
          <button type="button" class="btn small ghost" data-tl-note>Add a note here</button>
          <label class="tl-stop"><input type="checkbox" data-tl-stop${stopOn() ? ' checked' : ''}> Stop at each problem so I can try it</label>
          <a class="btn small ghost" href="#t-${id}">Open the topic page</a>
        </div>
        <p class="tl-paused" role="status" hidden></p>
        <form class="tl-noteform" hidden><label for="tl-nt">Your note at <span data-tl-at>0:00</span></label><textarea id="tl-nt" rows="2" maxlength="1000" placeholder="What you want to remember from this moment"></textarea><div class="row"><button type="submit" class="btn small primary">Save the note</button><button type="button" class="btn small ghost" data-tl-cancel>Cancel</button></div></form>
        <div class="lec-cols">
          <section class="lec-chs"><h2>Chapters</h2><ol id="tl-chs"></ol></section>
          <aside class="lec-aside">
            <h2>Your notes</h2><ul class="tl-notes" id="tl-notes"></ul>
            <h2>Keys</h2><p class="lec-keys"><kbd>Space</kbd> play or pause<br><kbd>←</kbd> <kbd>→</kbd> 10 seconds back or on<br><kbd>[</kbd> <kbd>]</kbd> previous or next chapter<br><kbd>C</kbd> captions, <kbd>F</kbd> full screen</p>
          </aside>
        </div>
        <details class="lec-tr" open><summary>Transcript</summary><p class="tl-trh">Select a time to jump there.</p><div id="lec-tr"><p class="muted">The transcript appears once the lecture is built.</p></div></details>`;
      const host = view.querySelector('#lec-host');
      (WL.lecIndex ? WL.lecIndex.load() : Promise.reject(new Error('no engine'))).then(() => compile(id)).then((spec) => {
        if (!spec || !view.contains(host)) return;
        const PL = WL.lec.plan(spec);
        view.querySelector('#tl-meta').textContent = `${st.name || ''} · ${Math.round(PL.total / 60)} min · ${PL.chapters.length} chapters · built from this topic’s notes, derivation and problems`;
        view.querySelector('#tl-chs').innerHTML = PL.chapters.map((c, i) => `<li><button type="button" data-g="${c.g0.toFixed(1)}" data-ci="${i}"><span>${mmss(c.g0)}</span>${esc(c.title)}</button></li>`).join('');
        view.querySelector('#lec-tr').innerHTML = PL.chapters.map((c, i) => `<h3>${i + 1}. ${esc(c.title)}</h3>${PL.scenes.slice(c.s0, i + 1 < PL.chapters.length ? PL.chapters[i + 1].s0 : PL.scenes.length).map((s) => { const t = s.T.filter(Boolean); return t.length ? `<p><button type="button" class="tl-ts" data-g="${s.g0.toFixed(1)}" aria-label="Jump to ${mmss(s.g0)}">${mmss(s.g0)}</button> ${t.map((x) => esc(x)).join(' ')}</p>` : ''; }).join('')}`).join('');
        /* where to stop when "stop at each problem" is on: just after the "try it" prompt */
        const stops = []; PL.scenes.forEach((s) => { if (s.sc.stop) stops.push(s.g0 + s.B[s.sc.stop.k] + s.sc.stop.off); });
        const paused = view.querySelector('.tl-paused');
        let cur = -1, lastG = 0;
        const P = new WL.lec.Player(host, spec, { onTime(g, pl) {
          let ci = 0; PL.chapters.forEach((c, i) => { if (g >= c.g0 - 0.01) ci = i; });
          if (ci !== cur) { cur = ci; view.querySelectorAll('#tl-chs [data-ci]').forEach((b) => b.setAttribute('aria-current', +b.dataset.ci === ci ? 'true' : 'false')); }
          if (pl.playing && stopOn() && g > lastG && g - lastG < 1.5 && stops.some((x) => lastG < x && x <= g)) { pl.pause(); paused.hidden = false; paused.textContent = 'Paused so you can try it. Press play when you want the solution.'; }
          else if (pl.playing && !paused.hidden) paused.hidden = true;
          lastG = g;
        } });
        /* opened from a note in the notebook: go to that moment */
        try { const sk = JSON.parse(sessionStorage.getItem('wl-tlseek') || 'null'); if (sk && sk.id === id) { sessionStorage.removeItem('wl-tlseek'); const go = () => { if (!P.alive) return; if (P.ready) P.seekG(sk.g); else setTimeout(go, 200); }; go(); } } catch (e) {}
        const drawNotes = () => {
          const L = (nget()[spec.id] || []).slice().sort((a, b) => a.g - b.g);
          view.querySelector('#tl-notes').innerHTML = L.length ? L.map((x) => `<li><button type="button" data-g="${x.g.toFixed(1)}" aria-label="Jump to ${mmss(x.g)}">${mmss(x.g)}</button><span>${esc(x.t)}</span><button type="button" class="linkbtn" data-tl-del="${x.at}">Delete</button></li>`).join('') : '<li class="muted">Pause anywhere and add a note. It is saved at that moment, in this browser.</li>';
        };
        drawNotes();
        const keys = (e) => { if (!document.body.contains(host)) return; if (e.altKey || e.ctrlKey || e.metaKey) return; if (P.key(e)) e.preventDefault(); };
        document.addEventListener('keydown', keys);
        window.addEventListener('hashchange', () => { P.kill(); document.removeEventListener('keydown', keys); }, { once: true });
        const form = view.querySelector('.tl-noteform'), ta = view.querySelector('#tl-nt');
        let noteG = 0;
        form.addEventListener('submit', (e) => {
          e.preventDefault(); const t = ta.value.trim(); if (!t) { ta.focus(); return; }
          const o = nget(); (o[spec.id] = o[spec.id] || []).push({ g: noteG, t: t.slice(0, 1000), at: Date.now(), tid: id, title: spec.title }); nput(o);
          form.hidden = true; drawNotes();
        });
        view.addEventListener('change', (e) => { if (e.target.matches('[data-tl-stop]')) jput('wl-tlstop', e.target.checked); });
        view.onclick = (e) => {
          const b = e.target.closest('[data-g]'); if (b) { P.seekG(+b.dataset.g); P.play(); host.scrollIntoView({ block: 'nearest', behavior: WL.reduced ? 'auto' : 'smooth' }); return; }
          if (e.target.closest('[data-tl-note]')) { P.pause(); noteG = P.g; form.hidden = false; ta.value = ''; view.querySelector('[data-tl-at]').textContent = mmss(noteG); ta.focus(); return; }
          if (e.target.closest('[data-tl-cancel]')) { form.hidden = true; return; }
          const del = e.target.closest('[data-tl-del]'); if (del) { const o = nget(); o[spec.id] = (o[spec.id] || []).filter((x) => String(x.at) !== del.dataset.tlDel); nput(o); drawNotes(); return; }
          if (e.target.closest('[data-tl-ask]') && WL.tutor) {
            const s = PL.scenes[P.si], ch = PL.chapters[s.ci];
            WL.tutor.open({ topic: hh.tutorTopic ? hh.tutorTopic(n) : { key: id, title: spec.title }, chip: { label: `the lecture at ${mmss(P.g)}`, suggestions: ['Explain this part another way', 'Why is this step true?', 'Give me a simpler example', 'What should I remember from this part?'],
              text: `The student is watching the lecture on "${spec.title}" (${spec.level}), chapter "${ch.title}", at ${mmss(P.g)}. What the lecture says at this point:\n${s.T.filter(Boolean).join(' ')}` } });
          }
        };
      }).catch(() => { host.innerHTML = '<p class="lec-err">The lecture could not be built. Check your connection, then reload the page.</p>'; });
    }
  };
  /* the lecture inside a topic's lesson, in place of the short film */
  async function embed(host, id, o = {}) {
    if (!WL.lecIndex) throw new Error('no engine');
    await WL.lecIndex.load(); const spec = await compile(id);
    if (!spec || !host.isConnected) return null;
    const PL = WL.lec.plan(spec);
    const P = new WL.lec.Player(host, spec, { onTime(g, pl) { if (o.onTime) o.onTime(g, pl, PL); } });
    host.addEventListener('keydown', (e) => { if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return; if (P.key(e)) e.preventDefault(); });
    return { P, PL, spec };
  }
  /* the time in a lecture where derivation step k (counted from 0, as on the topic page) is explained */
  const stepG = (PL, k) => { for (const s of PL.scenes) { const d = (s.sc.dsteps || []).find(([i]) => i === k); if (d) return s.g0 + (s.B[d[1]] || 0); } return null; };
  /* each lecture's length in minutes when the site was built (a lecture compiled on this page replaces the figure) */
  const LECM = {"al-ac":14,"al-astro":15,"al-bfields":16,"al-capacitors":17,"al-circular":17,"al-cosmology":15,"al-current":14,"al-damping":14,"al-dc-circuits":16,"al-decay":14,"al-doppler":14,"al-dynamics":17,"al-efields":19,"al-energy":16,"al-equilibrium":17,"al-fluids":16,"al-gravfields":18,"al-ideal-gas":17,"al-induction":18,"al-interference":16,"al-kinematics":16,"al-materials":16,"al-medical":16,"al-momentum":17,"al-nuclear":16,"al-particles":16,"al-photoelectric":15,"al-photons":15,"al-polarisation":13,"al-potential-divider":15,"al-projectile":18,"al-resistivity":13,"al-shm":21,"al-spectra":14,"al-stationary":15,"al-temperature":15,"al-thermodynamics":15,"al-units":18,"al-waves":15,"gcse-atom":15,"gcse-circuits":18,"gcse-current-pd":14,"gcse-earth-moon":14,"gcse-electromagnets":13,"gcse-em-spectrum":17,"gcse-energy":18,"gcse-expansion":14,"gcse-forces":21,"gcse-heat-transfer":13,"gcse-induction":14,"gcse-lenses":15,"gcse-magnetism":16,"gcse-mass-weight":14,"gcse-measurement":16,"gcse-moments":15,"gcse-motor":15,"gcse-newton":17,"gcse-orbits":16,"gcse-particles":14,"gcse-power-cost":14,"gcse-pressure":15,"gcse-radiation":15,"gcse-radioactivity":16,"gcse-reflection-refraction":14,"gcse-resources":14,"gcse-safety":14,"gcse-series-parallel":15,"gcse-shc":17,"gcse-solar-system":14,"gcse-sound":14,"gcse-stars":14,"gcse-static":14,"gcse-suvat":18,"gcse-transformer":14,"gcse-waves":14,"gcse-work-power":14,"ks3-circuits":18,"ks3-climate":14,"ks3-colour":13,"ks3-density":16,"ks3-earth":13,"ks3-energy":16,"ks3-forces":16,"ks3-heat":14,"ks3-light":18,"ks3-magnets":12,"ks3-moments":17,"ks3-parallel":15,"ks3-particles":15,"ks3-pressure":18,"ks3-solar-system":14,"ks3-sound":15,"ks3-space":17,"ks3-speed":18,"ks3-tides-eclipses":14,"ks3-waves":15,"m-airy":19,"m-algebra":16,"m-asymptotics":17,"m-bessel":18,"m-bessel-modified":17,"m-branch-cuts":16,"m-bundles":17,"m-chi-squared":16,"m-circle-theorems":15,"m-circles":16,"m-combinatorics":14,"m-complex":16,"m-complex-analysis":15,"m-confluent":17,"m-conformal":16,"m-continuous-rv":15,"m-convergence":15,"m-curves":16,"m-curvilinear":17,"m-data":15,"m-de-moivre":15,"m-delta":16,"m-dft":15,"m-differentiation":18,"m-diffgeo":18,"m-discrete-rv":15,"m-divcurl":16,"m-eigen":15,"m-elastic":15,"m-elliptic":18,"m-equations":15,"m-erf":18,"m-estimation":16,"m-exp-log":16,"m-expint":17,"m-expressions":15,"m-finite-difference":18,"m-fm-projectiles":16,"m-forms":17,"m-fourier-series":15,"m-fourier-transform":15,"m-fractions":16,"m-frobenius":18,"m-functional":17,"m-functions":16,"m-functions-gcse":14,"m-gamma":18,"m-geometry":17,"m-graphs":16,"m-green":16,"m-groups":17,"m-hermite":19,"m-hilbert":15,"m-hyperbolic":16,"m-hypergeometric":16,"m-hypothesis":17,"m-indices":16,"m-induction":16,"m-inequalities":15,"m-integral-equations":16,"m-integration":18,"m-jacobi":17,"m-kinematics-calc":16,"m-lagrange-mult":15,"m-laguerre":18,"m-laplace":15,"m-legendre":18,"m-lie":17,"m-limits":18,"m-line-integrals":16,"m-linear-combinations":15,"m-mathieu":17,"m-matrices":16,"m-matrix-transforms":17,"m-mensuration":16,"m-momentum-mech":16,"m-monte-carlo":17,"m-multiple":16,"m-newton-mech":17,"m-nonlinear":18,"m-nonparametric":17,"m-normal":15,"m-number":16,"m-numerical":17,"m-numerical-roots":16,"m-ode-systems":15,"m-ode1":16,"m-ode2":16,"m-orthopoly":17,"m-partial":16,"m-path-integral":18,"m-pde":16,"m-perturbation-methods":19,"m-pgf":14,"m-planes":17,"m-poisson":14,"m-polar":15,"m-polynomials":16,"m-probability":16,"m-probability-al":14,"m-probability-gcse":16,"m-proportion":16,"m-quadratics":16,"m-radians":15,"m-random-walks":16,"m-rates":15,"m-rational-graphs":16,"m-reduction":15,"m-representations":18,"m-restitution":16,"m-rigid-equilibrium":16,"m-roots-poly":15,"m-sampling":16,"m-separation":16,"m-sequences":16,"m-series":16,"m-similarity":16,"m-special":18,"m-spherical-bessel":18,"m-statics":16,"m-statistics":16,"m-statistics-uni":15,"m-summation":16,"m-svd":15,"m-t-tests":16,"m-taylor":16,"m-tensors":17,"m-theorems":16,"m-theta":17,"m-topology":17,"m-transformations":15,"m-trig":16,"m-trig-identities":16,"m-trig-rules":17,"m-variable-force":16,"m-variations":15,"m-vector-spaces":16,"m-vectors":15,"m-vertical-circle":16,"m-wkb":18,"m-work-energy-mech":16,"m-zeta":17,"y1-angular-momentum":17,"y1-coupled":16,"y1-entropy":17,"y1-faraday":17,"y1-fluids":16,"y1-gauss":18,"y1-magnetostatics":15,"y1-maxwell":15,"y1-old-quantum":15,"y1-optics":17,"y1-oscillators":16,"y1-potential":16,"y1-qm-intro":17,"y1-rel-dynamics":17,"y1-rotation":18,"y1-sr":18,"y1-systems":18,"y1-thermo":18,"y1-wave-eq":17,"y1-work-energy":19,"y2-4vectors":16,"y2-blackbody":17,"y2-boltzmann":18,"y2-central-force":16,"y2-em-relativity":18,"y2-em-waves":16,"y2-fourier":16,"y2-infinite-well":17,"y2-lagrangian":19,"y2-matter-fields":19,"y2-multipoles":17,"y2-noether":15,"y2-operators":17,"y2-partition":17,"y2-qho":16,"y2-rigid-body":16,"y2-schrodinger":18,"y2-small-oscillations":14,"y2-step-barrier":18,"y3-angular-momentum":18,"y3-dirac":16,"y3-entanglement":18,"y3-equivalence":18,"y3-fine-structure":19,"y3-fluid-dynamics":19,"y3-hamiltonian":19,"y3-hydrogen":18,"y3-identical":17,"y3-landau":17,"y3-lasers":17,"y3-nuclear-particle":19,"y3-quantum-gases":18,"y3-radiation":17,"y3-scattering":17,"y3-semiconductors":18,"y3-solids":18,"y3-spin":19,"y3-time-dependent":17,"y3-tunnelling":17,"y3-variational-wkb":18,"y4-chaos":18,"y4-classical-fields":17,"y4-early-universe":19,"y4-feynman":16,"y4-friedmann":17,"y4-gauge":16,"y4-gr":18,"y4-gravitational-waves":17,"y4-higgs":17,"y4-ising":17,"y4-kg":17,"y4-perturbation":17,"y4-phase-transitions":17,"y4-qed":16,"y4-quantised-field":16,"y4-quantum-info":17,"y4-renormalisation":17,"y4-schwarzschild":19,"y4-standard-model":17,"y4-superconductivity":17,"y4-topological":18};
  const minsOf = (id) => (SECS[id] ? Math.round(SECS[id] / 60) : LECM[id] || null);
  WL.tlec = { compile, banner, fillBanner, indexHTML, notes: nget, secsOf, embed, stepG, mmss, minsOf };
})();
