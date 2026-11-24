/* Geodesic — sixth layer of behaviour: formulas in running text set in TeX, and narration for the films and live animations.
   Loaded after manim.js (which it extends) and before app.js (which uses it). */
(function () {
"use strict";
const WL = (window.WL = window.WL || {});
/* ---------- formulas in running text, set in TeX ----------
   The notes, problems and solutions write maths in plain Unicode ("T = 2v₀sin θ/g"). texSegs() finds the formula spans
   in a sentence and rewrites each in TeX ("T = 2v_0\sin\theta/g"). texPretty() returns HTML in which each span is
   <span class="mx" data-tex="…">plain text</span>: the plain text stays until mathify() swaps in the TeX for MathJax,
   so text that is never typeset still reads correctly, and a span MathJax rejects falls back to its plain text.
   Rules of thumb: a span needs a relation or an operator between mathematical things; English words end it;
   inline fractions keep their slash (as printed physics does); numbers keep their units, set upright. */
const TX = (() => {
  const GREEK = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'varepsilon', ϵ: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'theta', ϑ: 'vartheta', ι: 'iota', κ: 'kappa', λ: 'lambda', μ: 'mu', µ: 'mu', ν: 'nu', ξ: 'xi', π: 'pi', ϖ: 'varpi', ρ: 'rho', ϱ: 'varrho', σ: 'sigma', ς: 'varsigma', τ: 'tau', υ: 'upsilon', φ: 'phi', ϕ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega', Γ: 'Gamma', Δ: 'Delta', Θ: 'Theta', Λ: 'Lambda', Ξ: 'Xi', Π: 'Pi', Σ: 'Sigma', Υ: 'Upsilon', Φ: 'Phi', Ψ: 'Psi', Ω: 'Omega', 'ħ': 'hbar', 'ℏ': 'hbar', 'ℓ': 'ell', '∂': 'partial', '∇': 'nabla', '∞': 'infty' };
  const GREEK_LATIN = { Α: 'A', Β: 'B', Ε: 'E', Ζ: 'Z', Η: 'H', Ι: 'I', Κ: 'K', Μ: 'M', Ν: 'N', Ο: 'O', Ρ: 'P', Τ: 'T', Χ: 'X', ο: 'o' };
  const SUPC = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁿ': 'n', 'ⁱ': 'i', 'ᵀ': 'T', '˟': '\\times' };
  const SUBC = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-', '₌': '=', '₍': '(', '₎': ')', 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₕ': 'h', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₚ': 'p', 'ₛ': 's', 'ₜ': 't', 'ᵢ': 'i', 'ⱼ': 'j', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v', 'ᵦ': '\\beta', 'ᵧ': '\\gamma', 'ᵨ': '\\rho', 'ᵩ': '\\phi', 'ᵪ': '\\chi' };
  const DOT = { 'ȧ': 'a', 'ḃ': 'b', 'ċ': 'c', 'ḋ': 'd', 'ė': 'e', 'ḟ': 'f', 'ġ': 'g', 'ḣ': 'h', 'ṁ': 'm', 'ṅ': 'n', 'ȯ': 'o', 'ṗ': 'p', 'ṙ': 'r', 'ṡ': 's', 'ṫ': 't', 'ẇ': 'w', 'ẏ': 'y', 'ż': 'z', 'Ṙ': 'R', 'Ṗ': 'P', 'Ẋ': 'X', 'Ṫ': 'T', 'Ṡ': 'S', 'Ḣ': 'H', 'Ė': 'E', 'Ṁ': 'M', 'Ṅ': 'N' };
  const BARL = { 'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u', 'ȳ': 'y', 'Ā': 'A', 'Ē': 'E', 'Ū': 'U' };
  const HATL = { 'Ĥ': 'H', 'Ĵ': 'J', 'Ŝ': 'S', 'Ĝ': 'G', 'Ĉ': 'C', 'Ŵ': 'W', 'Ŷ': 'Y', 'ĥ': 'h', 'ĵ': 'j', 'ŝ': 's', 'ĝ': 'g', 'ĉ': 'c', 'ŵ': 'w', 'ŷ': 'y' };
  const FRAC = { '½': '\\tfrac12', '⅓': '\\tfrac13', '⅔': '\\tfrac23', '¼': '\\tfrac14', '¾': '\\tfrac34', '⅕': '\\tfrac15', '⅙': '\\tfrac16', '⅛': '\\tfrac18' };
  const REL = { '=': '=', '≈': '\\approx', '≃': '\\simeq', '≅': '\\cong', '≠': '\\neq', '≡': '\\equiv', '∝': '\\propto', '<': '<', '>': '>', '≤': '\\le', '≥': '\\ge', '≪': '\\ll', '≫': '\\gg', '→': '\\to', '⟶': '\\to', '←': '\\leftarrow', '↔': '\\leftrightarrow', '⇒': '\\Rightarrow', '⟹': '\\Rightarrow', '⇔': '\\Leftrightarrow', '∼': '\\sim', '∈': '\\in', '∉': '\\notin', '⊂': '\\subset', '⊆': '\\subseteq', '↦': '\\mapsto' };
  const BIN = { '+': '+', '−': '-', '×': '\\times', '·': '\\cdot', '⋅': '\\cdot', '÷': '\\div', '±': '\\pm', '∓': '\\mp', '/': '/', '∪': '\\cup', '∩': '\\cap', '⊗': '\\otimes', '⊕': '\\oplus', '∘': '\\circ', '∗': '\\ast' };
  const PRE = { '∫': '\\int', '∮': '\\oint', '∑': '\\sum', '∏': '\\prod', '√': '\\sqrt', '∛': '\\sqrt[3]', '∜': '\\sqrt[4]', '∠': '\\angle', '¬': '\\neg' };
  const POST = { '°': '^{\\circ}', '′': "'", '″': "''", '†': '^{\\dagger}', '!': '!', '%': '\\%', '‰': '\\permil', '⊥': '\\perp', '∥': '\\parallel' };
  const FUN = new Set('sin cos tan sec csc cot sinh cosh tanh coth arcsin arccos arctan ln log exp lim max min det sup inf sgn arg deg gcd dim ker Re Im erf tr Tr'.split(' '));
  const UNIT = new Set(('m s kg g mg µg N kN MN mN J kJ MJ GJ mJ W kW MW GW mW Pa kPa MPa GPa hPa V mV kV MV µV A mA µA kA nA Ω kΩ MΩ mΩ Hz kHz MHz GHz THz K C mC µC nC pC F mF µF nF pF T mT µT nT G Wb H mH µH mol mmol L l ml mL cm mm km nm µm pm fm dm ms µs ns ps fs min h hr hrs yr yrs dB rad mrad sr cd lm lx Bq kBq MBq Gy mGy Sv mSv µSv u eV meV keV MeV GeV TeV atm bar mbar Torr mmHg cal kcal kWh Wh rpm Ci Ma ly pc kpc Mpc AU Da kDa').split(' '));
  const STOP = new Set(('vs etc eg ie cf al a an as at be by do go he if in is it me my no of on or so to up us we am and are but can did for get got had has her him his how its let may new nor not now off old one our out own per put say see set she the too two use was way who why yet you all any few via each then than when with from into only also both does this that same half more most less take what will just once over very much many some such even well here there they them were been being would could should about after again before where which while with within without these those other another every first second third last next times time ' +
    'where gives give given means mean makes make made used uses using find found shows show shown since because therefore hence thus so its it like near far large small big tiny high low long short wide total net both either neither between under above below each per cent percent about around equal equals constant ratio factor sum mass speed energy force field charge current power work heat length area volume time rate value number').split(' '));
  const isUp = (c) => c >= 'A' && c <= 'Z';
  // classify a run of Latin letters
  function wordKind(w, prev, next) {
    if (FUN.has(w)) return 'fn';
    if (w.length === 1) return 'sym';
    const lw = w.toLowerCase();
    if (STOP.has(lw)) return 'word';
    if (w.length <= 4 && /^[A-Za-z]+$/.test(w)) {
      // products of symbols: mg, ma, mv², dp, dx, GMm, kT, hf, pV, nRT, mgh, BIL, ρgh. Mixed case or no vowels is a strong sign.
      const vowels = (lw.match(/[aeiou]/g) || []).length;
      if (/[A-Z]/.test(w.slice(1)) || (vowels === 0 && w.length <= 4) || (w.length === 2 && /^[a-z][A-Z]$|^[A-Z][a-z]$/.test(w) && !/^(Hz|Pa|Wb|Bq|Gy|Sv|eV|Da|cd|lx|lm)$/.test(w))) return 'prod';
      if (w.length === 2 && vowels === 1 && /^(ma|mc|mv|av|ab|ac|ad|ae|ax|ay|az|ex|ey|ez|ux|uy|vx|vy|ix|iy|ka|ke|ki|ko|ku|ma|me|mi|mo|mu|pa|pe|qa|qe|qv|xa|xe|ya|ye|za|ze)$/.test(w) && prev === 'math') return 'prod';
      if (/^(mgh|ρgh|mgL|mvr|mvL|kxe|kxa|mgd|qvB|qBv|BIL|BQv|BIl|IRt|nRT|NkT|VIt|ItV|GMm|qEd|mcΔ)$/.test(w)) return 'prod';
    }
    return 'word';
  }
  /* tokenizer */
  function tokens(s) {
    const T = []; let i = 0;
    const push = (t, v, raw) => T.push({ t, v, raw: raw == null ? v : raw });
    while (i < s.length) {
      const c = s[i], rest = s.slice(i);
      let m;
      if (/\s/.test(c)) { m = rest.match(/^\s+/); push('ws', m[0]); i += m[0].length; continue; }
      if ((m = rest.match(/^\d{1,3}(?:[   ]\d{3})+(?![\d])(?:\.\d+)?/)) && /\d{3}$|\.\d+$/.test(m[0])) { push('num', m[0].replace(/[   ]/g, '\\,'), m[0]); i += m[0].length; continue; }
      if ((m = rest.match(/^(?:\d+(?:\.\d+)?|\.\d+)/))) { push('num', m[0]); i += m[0].length; continue; }
      if ((m = rest.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]+/)) && !/^[ȧḃċḋėḟġḣṁṅȯṗṙṡṫẇẋẏż]/.test(m[0])) { push('let', m[0]); i += m[0].length; continue; }
      if (DOT[c]) { push('acc', `\\dot{${DOT[c]}}`, c); i++; continue; }
      if (BARL[c]) { push('acc', `\\bar{${BARL[c]}}`, c); i++; continue; }
      if (HATL[c]) { push('acc', `\\hat{${HATL[c]}}`, c); i++; continue; }
      if (GREEK[c] || GREEK_LATIN[c]) { push('grk', c); i++; continue; }
      if ((m = rest.match(/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵀ]+/))) { push('sup', [...m[0]].map((x) => SUPC[x]).join(''), m[0]); i += m[0].length; continue; }
      if ((m = rest.match(/^[₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥᵦᵧᵨᵩᵪ]+/))) { push('sub', [...m[0]].map((x) => SUBC[x]).join(''), m[0]); i += m[0].length; continue; }
      if (c === '^' || c === '_') {
        if ((m = rest.match(/^[\^_]\{([^{}]*)\}/))) { push(c === '^' ? 'sup' : 'sub', m[1], m[0]); i += m[0].length; continue; }
        if ((m = rest.match(/^[\^_](?:[−-]?\d+(?:\.\d+)?|[A-Za-z]+|[α-ωΑ-Ω])/))) { let w = m[0]; if (/^[\^_][A-Za-z]{2,}$/.test(w) && /^[\u0300-\u036f\u20d7]*[_^₀-₉⁰-⁹ₐ-ₜ]/.test(rest.slice(w.length))) w = w.slice(0, 2); push(c === '^' ? 'sup' : 'sub', w.slice(1).replace('−', '-'), w); i += w.length; continue; }
        push('oth', c); i++; continue;
      }
      if (FRAC[c]) { push('frac', FRAC[c], c); i++; continue; }
      if (c === 'ẋ' || c === 'ẍ' || c === 'ẏ' || c === 'ÿ') { push('acc', c === 'ẋ' ? '\\dot{x}' : c === 'ẍ' ? '\\ddot{x}' : c === 'ẏ' ? '\\dot{y}' : '\\ddot{y}', c); i++; continue; }
      if (/[̀-ͯ⃗]/.test(c)) { push('comb', c); i++; continue; }
      if (REL[c]) { push('rel', REL[c], c); i++; continue; }
      if (BIN[c]) { push('bin', BIN[c], c); i++; continue; }
      if (c === '-') { push('dash', '-', c); i++; continue; }
      if (PRE[c]) { push('pre', PRE[c], c); i++; continue; }
      if (POST[c]) { push('post', POST[c], c); i++; continue; }
      if ('([{'.includes(c)) { push('open', c === '{' ? '\\{' : c, c); i++; continue; }
      if (')]}'.includes(c)) { push('close', c === '}' ? '\\}' : c, c); i++; continue; }
      if (c === '⟨' || c === '⟩') { push('bar', c === '⟨' ? '\\langle ' : '\\rangle ', c); i++; continue; }
      if (c === '|' || c === '‖') { push('bar', c === '|' ? '|' : '\\|', c); i++; continue; }
      if (c === ',' || c === ';' || c === ':') { push('punct', c); i++; continue; }
      if (c === '.' || c === '?' || c === '“' || c === '”' || c === '"' || c === '‘' || c === '’' || c === "'" || c === '–' || c === '—' || c === '…') { push('punct', c); i++; continue; }
      if (c === '$') { const j = s.indexOf('$', i + 1); if (j > i) { push('tex', s.slice(i, j + 1)); i = j + 1; continue; } }
      push('oth', c); i++;
    }
    return T;
  }
  const UNIT_START = /^(?:[a-zA-ZµΩ°%‰]|°C)/;
  /* find formula spans: returns [[i0, i1], ...] inclusive token ranges */
  function spans(T) {
    // classify letter runs with context
    for (let k = 0; k < T.length; k++) {
      const t = T[k]; if (t.t !== 'let') continue;
      const prevT = prevSig(T, k), nextT = nextSig(T, k);
      const prevMath = prevT && /^(rel|bin|num|sup|sub|open|grk|pre)$/.test(prevT.t);
      t.k = wordKind(t.v, prevMath ? 'math' : '', nextT);
      // a number followed by a unit: "25 m/s", "9.81 m s⁻²", "50 N"
      const qty = prevT && (prevT.t === 'num' || (prevT.t === 'sup' && (() => { const pp = prevSig(T, T.indexOf(prevT)); return pp && pp.t === 'num'; })()) || prevT.t === 'post' && prevT.raw === '°');
      if (qty && T[k - 1] && T[k - 1].t === 'ws' && (UNIT.has(t.v) || (t.v.length > 2 && UNIT.has(t.v.replace(/s$/, '')))) && (!nextT || nextT.t !== 'let' || UNIT.has(nextT.v) || nextT.k === 'word' || !nextT.k)) t.k = 'unit';
      const pu = prevT && (prevT.k === 'unit' || (prevT.t === 'sup' && (() => { const pp = prevSig(T, T.indexOf(prevT)); return pp && pp.k === 'unit'; })()));
      if (pu && UNIT.has(t.v) && T[k - 1] && T[k - 1].t === 'ws' && T[k - 1].v === ' ') t.k = 'unit';
      if (prevT && prevT.t === 'bin' && prevT.raw === '/' && T[k - 1] === prevT) { const pp = prevSig(T, k - 1); if (pp && pp.k === 'unit' && UNIT.has(t.v)) t.k = 'unit'; }
      if (t.k === 'sym' && /^[aAI]$/.test(t.v)) { // articles and "I": only a symbol when next to an operator or index
        const near = (x) => x && /^(rel|bin|sup|sub|open|close|num|pre|post)$/.test(x.t) && !(x.t === 'open' && x === nextT && T[k + 1] && T[k + 1].t === 'ws');
        const adjNext = T[k + 1] && /^(sup|sub|post|comb|grk|acc)$/.test(T[k + 1].t);
        if (!(near(prevT) && prevT.t !== 'close') && !(nextT && /^(rel|bin)$/.test(nextT.t)) && !adjNext) t.k = 'word';
      }
    }
    for (let k = 0; k < T.length - 1; k++) { const t = T[k], n = T[k + 1], p = prevSig(T, k); if (t.t === 'grk' && (t.v === 'µ' || t.v === 'μ') && n.t === 'let' && /^(m|s|F|A|C|g|J|T|V|W|H|L|l|mol|Sv|Gy|Pa)$/.test(n.v) && p && (p.t === 'num' || p.t === 'sup') && T[k - 1] && T[k - 1].t === 'ws') { t.k = 'unit'; n.k = 'unit'; n.mu = 1; } }
    const isMathTok = (t) => (t.t === 'let' ? t.k !== 'word' : /^(num|grk|sup|sub|frac|acc|comb|rel|bin|pre|post|open|close|bar|tex)$/.test(t.t));
    const out = []; let k = 0;
    while (k < T.length) {
      if (!isMathTok(T[k]) || T[k].t === 'close' || T[k].t === 'rel' && T[k].raw === '>' ) { k++; continue; }
      let j = k, depth = 0, last = k;
      for (; j < T.length; j++) {
        const t = T[j];
        if (t.t === 'ws') { if (t.v.length > 2 || /\n/.test(t.v)) break; continue; }
        if (t.t === 'open') { depth++; last = j; continue; }
        if (t.t === 'close') { if (depth <= 0) break; depth--; last = j; continue; }
        if (t.t === 'punct' && t.v === ',' && depth > 0) { last = j; continue; }
        if (t.t === 'dash') { const a = prevSig(T, j), b = nextSig(T, j); const spaced = T[j - 1] && T[j - 1].t === 'ws' && T[j + 1] && T[j + 1].t === 'ws'; if ((spaced && a && b && isMathTok(a) && isMathTok(b)) || (a && /^(rel|open)$/.test(a.t) && b && (b.t === 'num' || b.t === 'grk' || (b.t === 'let' && b.k !== 'word')))) { t.t = 'bin'; t.v = '-'; last = j; continue; } break; }
        if (!isMathTok(t)) break;
        last = j;
      }
      emit(T, k, last, out);
      k = Math.max(last + 1, k + 1);
    }
    return out;
  }

  const SIG = /^(let|num|grk|sup|sub|close|post|acc|frac|tex|bar)$/;
  function emit(T, a, b, out, depth = 0) {
    if (depth > 4 || a > b) return;
    for (let again = true; again;) { again = false;
      while (b > a && (!SIG.test(T[b].t) || (T[b].t === 'let' && T[b].k === 'fn'))) { b--; again = true; }
      while (a < b && (/^(close|ws|punct)$/.test(T[a].t) || (T[a].t === 'bin' && /^[\/×·⋅÷∪∩∘]$/.test(T[a].raw)))) { a++; again = true; } }
    if (!bal(T, a, b)) { // split round the first bracket that never closes (or the first stray closing one)
      let d = 0, cut = -1; for (let i = a; i <= b; i++) { if (T[i].t === 'open') { if (d === 0) cut = i; d++; } else if (T[i].t === 'close') { if (d === 0) { cut = i; break; } d--; if (d === 0) cut = -1; } }
      if (cut < 0) return;
      emit(T, a, cut - 1, out, depth + 1); emit(T, cut + 1, b, out, depth + 1); return;
    }
    // inside brackets a comma may have joined two separate formulas: (g = 10 m/s², level …) is handled above
    const sl = T.slice(a, b + 1), lets = sl.filter((t) => t.t === 'let');
    const unitOnly = lets.length && lets.every((t) => UNIT.has(t.v)) && !sl.some((t) => t.t === 'rel' || t.t === 'num' || t.t === 'grk' || t.t === 'pre') && sl.some((t) => t.t === 'sup' || (t.t === 'bin' && t.raw === '/'));
    if (unitOnly || !anchor(T, a, b)) {
      // a top-level comma can separate two formulas: try each side
      let d = 0; for (let i = a; i <= b; i++) { if (T[i].t === 'open') d++; if (T[i].t === 'close') d--; if (d === 0 && T[i].t === 'punct' && T[i].v === ',') { emit(T, a, i - 1, out, depth + 1); emit(T, i + 1, b, out, depth + 1); return; } }
      return;
    }
    out.push([a, b]);
  }
  const prevSig = (T, k) => { for (let i = k - 1; i >= 0; i--) if (T[i].t !== 'ws') return T[i]; return null; };
  const nextSig = (T, k) => { for (let i = k + 1; i < T.length; i++) if (T[i].t !== 'ws') return T[i]; return null; };
  function bal(T, a, b) { let d = 0; for (let i = a; i <= b; i++) { if (T[i].t === 'open') d++; if (T[i].t === 'close') { d--; if (d < 0) return false; } } return d === 0; }
  function anchor(T, a, b) {
    let ops = 0, syms = 0, idx = 0, words = 0;
    for (let i = a; i <= b; i++) {
      const t = T[i];
      if (t.t === 'rel' || (t.t === 'bin' && t.raw !== '/') || t.t === 'pre') ops++;
      if (t.t === 'bin' && t.raw === '/') { const p = prevSig(T, i), n = nextSig(T, i); if (p && n && (p.t !== 'let' || p.k !== 'unit')) ops++; }
      if (t.t === 'grk' || (t.t === 'let' && (t.k === 'sym' || t.k === 'prod' || t.k === 'fn'))) syms++;
      if ((t.t === 'sup' || t.t === 'sub' || t.t === 'acc' || t.t === 'comb') && i > a) idx++;
      if (t.t === 'let' && t.k === 'unit') words++;
    }
    if (ops && (syms || T.slice(a, b + 1).filter((t) => t.t === 'num').length >= 2)) return true;
    if (idx && syms) return true; // v₀, x², E_k
    if (syms && T.slice(a, b + 1).some((t) => t.t === 'grk') && b > a) return true;
    return false;
  }
  /* convert a token range to TeX */
  function toTex(T, a, b) {
    let s = '', i = a;
    const cmd = (c) => { s += c + (/[a-zA-Z]$/.test(c) ? ' ' : ''); };
    for (; i <= b; i++) {
      const t = T[i];
      switch (t.t) {
        case 'ws': { const p = T[i - 1], n = T[i + 1]; if (n && (n.k === 'unit' || (n.t === 'grk' && n.v === 'Ω')) && p && (p.t === 'num' || p.t === 'sup')) { s += '\\,'; break; } if (n && n.t === 'let' && n.k === 'unit' && p && (p.t === 'num' || p.t === 'sup' || p.t === 'post' || p.t === 'let' && p.k === 'unit')) s += p.t === 'num' || p.t === 'sup' && p.k !== 'u' ? '\\,' : '\\,'; else if (n && n.t === 'let' && n.k !== 'fn' && n.k !== 'unit' && p && ((p.t === 'let' && p.k !== 'unit' && p.k !== 'fn') || p.t === 'num')) s += '\\,'; else if (n && n.t === 'let' && /^d[a-zA-Z]?$/.test(n.v) && T[i + 2] && (T[i + 2].t === 'grk' || n.v.length === 2)) s += '\\,'; else s += ' '; break; }
        case 'num': s += t.v; break;
        case 'let':
          if (t.k === 'fn') cmd(/^(Re|Im|Tr|tr|erf|sgn)$/.test(t.v) ? `\\operatorname{${t.v}}` : '\\' + t.v);
          else if (t.k === 'unit') { s += `\\mathrm{${t.v}}`; t.u = 1; }
          else if (t.k === 'word') s += `\\text{${t.v}}`;
          else s += t.v;
          break;
        case 'grk': if (t.k === 'unit') { s += '\\mu '; break; } cmd(GREEK[t.v] ? '\\' + GREEK[t.v] : GREEK_LATIN[t.v]); break;
        case 'sup': { const v = inner(t.v); s += `^{${v}}`; break; }
        case 'sub': { const v = inner(t.v); s += `_{${/^[A-Za-z]{2,}$/.test(v) && !/^(xy|xx|yy|zz|ij|ji|nm|mn|ab|μν|xz|yz)$/.test(v) ? `\\mathrm{${v}}` : v}}`; break; }
        case 'frac': s += t.v; break;
        case 'acc': s += t.v; break;
        case 'comb': { const m = { '̇': 'dot', '̈': 'ddot', '̂': 'hat', '̄': 'bar', '⃗': 'vec', '̃': 'tilde' }[t.v]; if (m) s = s.replace(/(\\[a-zA-Z]+ ?|[A-Za-z])$/, (x) => `\\${m}{${x.trim()}}`); break; }
        case 'rel': cmd(t.v); break;
        case 'bin': cmd(t.v); break;
        case 'dash': s += '-'; break;
        case 'pre': {
          if (t.raw === '√' || t.raw === '∛' || t.raw === '∜') { // the radicand: a bracket group, or a run of letters/numbers/greek
            const n = T[i + 1];
            if (n && n.t === 'open') { let d = 0, j = i + 1; for (; j <= b; j++) { if (T[j].t === 'open') d++; if (T[j].t === 'close') { d--; if (!d) break; } } s += t.v + '{' + toTex(T, i + 2, j - 1) + '}'; i = j; }
            else { let j = i + 1; while (j <= b && /^(num|grk|let|sub|comb)$/.test(T[j].t) && !(T[j].t === 'let' && T[j].k === 'unit')) j++; s += t.v + '{' + toTex(T, i + 1, j - 1) + '}'; i = j - 1; }
          } else cmd(t.v);
          break;
        }
        case 'post': s += t.v === '^{\\circ}' && T[i + 1] && T[i + 1].t === 'let' && T[i + 1].v === 'C' && (T[i + 1].k = 'unit') ? '^{\\circ}' : t.v; break;
        case 'open': case 'close': cmd(t.v); break;
        case 'bar': s += t.v; break;
        case 'punct': s += t.v === ',' ? ',\\ ' : t.v; break;
        case 'tex': s += t.v.slice(1, -1); break;
        default: s += t.v;
      }
    }
    return s.replace(/\s+/g, ' ').replace(/ ([_^])/g, '$1').replace(/\^\{([^{}]*)\}\^\{([^{}]*)\}/g, '^{$1 $2}').replace(/_\{([^{}]*)\}_\{([^{}]*)\}/g, '_{$1$2}').trim();
  }
  function inner(v) { // superscript or subscript contents may themselves hold Unicode maths: −2κa, 1/2, rms
    if (/^[A-Za-z0-9+\-=().,]*$/.test(v)) return v.replace(/−/g, '-');
    const T = tokens(v); T.forEach((t) => { if (t.t === 'let') t.k = FUN.has(t.v) ? 'fn' : 'sym'; }); return toTex(T, 0, T.length - 1);
  }
  /* split a sentence into text and TeX pieces */
  function segs(str) {
    // "[S]" marks Cambridge Supplement content in syllabus statements: a label, never part of a formula
    if (/\[S\](?=\s)/.test(String(str))) { const out = []; String(str).split(/(\[S\])(?=\s)/).forEach((part, i) => { if (!part) return; if (i % 2) out.push({ t: part }); else out.push(...segs(part)); }); return out; }
    const s = String(str); if (/\\[a-zA-Z]{2,}/.test(s.replace(/\$[^$]*\$/g, ''))) return [{ t: s }];
    if (!/[=≈≠≤≥<>∝→⇒×÷·±−+/^_²³⁰¹⁴-⁹₀-₉√∫∑αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΠΣΦΨΩħℏ∂∇ẋẍ½¼¾°′]/.test(s)) return [{ t: s }];
    const T = tokens(s), S = spans(T), out = []; let pos = 0, ti = 0;
    // map token index → string offset
    const off = []; let o = 0; T.forEach((t) => { off.push(o); o += t.raw.length; });
    S.forEach(([a, b]) => {
      const st = off[a], en = off[b] + T[b].raw.length;
      if (st > pos) out.push({ t: s.slice(pos, st) });
      const raw = s.slice(st, en);
      if (/^(?:[A-Z][a-z]?[₀-₉]*)+$/.test(raw) && /[₀-₉]/.test(raw)) { out.push({ t: raw }); pos = en; return; }
      const cuts = [a]; let d = 0, since = 0;
      for (let i = a; i <= b; i++) { const t = T[i]; if (t.t === 'open') d++; if (t.t === 'close') d--; if (t.t === 'rel' && d === 0 && i > a && T[i - 1].t === 'ws' && since >= 22) { cuts.push(i); since = 0; } since += t.raw.length; }
      cuts.forEach((c0, j) => { const c1 = j + 1 < cuts.length ? cuts[j + 1] - 2 : b; if (j) out.push({ t: T[cuts[j] - 1].raw }); out.push({ m: toTex(T, c0, c1), t: s.slice(off[c0], off[c1] + T[c1].raw.length) }); });
      pos = en;
    });
    if (pos < s.length) out.push({ t: s.slice(pos) });
    return out;
  }
  return { segs, tokens, spans, toTex };
})();

  /* HTML for running text: text pieces go through the old formatter; formula pieces become .mx spans */
  const escA = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function texPretty(str) {
    const base = WL.pretty || escA;
    if (str == null) return '';
    const sg = TX.segs(String(str));
    if (sg.length === 1 && !sg[0].m) return base(sg[0].t);
    return sg.map((g) => (g.m ? `<span class="mx" data-tex="${escA(g.m)}">${base(g.t)}</span>` : base(g.t))).join('');
  }
  /* swap .mx spans for TeX as they come near the screen, and typeset them in small batches */
  const SKIP = 'button, select, textarea, option, code, pre, svg, title, [data-nomx], .bench, .sres';
  let io = null, pend = new Set(), sched = 0;
  const ready = () => !!(window.__mjReady && window.MathJax && MathJax.typesetPromise);
  /* inline maths wider than its line (long formulas on a phone): give it a line of its own that scrolls sideways,
     instead of running past the edge of the page where it would be cut off */
  function fitMx(list) {
    list.forEach((sp) => {
      if (!sp.isConnected || !sp.querySelector('mjx-container')) return;
      sp.classList.remove('mx-wide');
      const box = sp.parentElement && (sp.parentElement.closest('p, li, dd, td, blockquote, figcaption, div') || sp.parentElement);
      const r = sp.getBoundingClientRect();
      if (r.width && ((box && r.width > box.clientWidth + 1) || r.right > document.documentElement.clientWidth - 4)) sp.classList.add('mx-wide');
    });
  }
  window.__fitMx = (root) => fitMx([...(root || document).querySelectorAll('.mx')]);
  let fitMxT = 0;
  window.addEventListener('resize', () => { clearTimeout(fitMxT); fitMxT = setTimeout(() => window.__fitMx(document.getElementById('view')), 250); });
  function conv(sp) { if (sp.dataset.raw != null || !sp.dataset.tex) return; sp.dataset.raw = sp.innerHTML; sp.textContent = '\\(' + sp.dataset.tex + '\\)'; pend.add(sp); }
  function restore(sp) { if (sp.dataset.raw != null) { sp.innerHTML = sp.dataset.raw; sp.removeAttribute('data-tex'); } }
  function flush() {
    sched = 0; if (!pend.size) return;
    if (!ready()) { window.addEventListener('wl-tex-ready', flush, { once: true }); return; }
    const L = [...pend].filter((x) => x.isConnected); pend.clear(); if (!L.length) return;
    const run = () => MathJax.typesetPromise(L).then(() => { L.forEach((sp) => { if (sp.querySelector('mjx-merror, [data-mjx-error]') || /\\\(/.test(sp.textContent)) restore(sp); }); fitMx(L); }).catch(() => L.forEach(restore));
    MathJax.startup.promise = (MathJax.startup.promise || Promise.resolve()).then(run, run);
  }
  const later = () => { if (!sched) sched = requestAnimationFrame(flush); };
  function mathify(el) {
    if (!el || !el.querySelectorAll) return;
    if (!io && 'IntersectionObserver' in window) io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); conv(e.target); } }); later(); }, { rootMargin: '700px 0px' });
    el.querySelectorAll('.mx[data-tex]:not([data-mq])').forEach((sp) => {
      if (sp.closest(SKIP)) { sp.removeAttribute('data-tex'); return; }
      sp.dataset.mq = '1'; if (io) io.observe(sp); else conv(sp);
    });
    if (!io) later();
  }
  WL.texPretty = texPretty; WL.mathify = mathify; WL.TX = TX;
  WL.mathifyAll = (el) => { (el || document).querySelectorAll('.mx[data-tex]').forEach((sp) => { if (!sp.closest(SKIP)) conv(sp); }); later(); };

  /* ---------- narration: films, lectures and live animations read aloud, in step with the picture ----------
     The voice leads: each player hands its lines to one shared queue a little ahead of time and holds its own clock
     at the next line until the voice has started it, so captions, picture and voice move together. Narration is on
     unless the viewer turns it off; the choice is remembered. */
  const NK = 'wl-narr2'; // narration is on unless the reader turns it off (older 'wl-narr' choices are not carried over)
  const npref = (() => { try { return Object.assign({ on: true, more: true, rate: 0.85, srate: 0.75, voice: 'rounded' }, JSON.parse(localStorage.getItem(NK) || '{}')); } catch (e) { return { on: false, more: true, rate: 0.85, srate: 0.75, voice: 'rounded' }; } })();
  const nsave = () => { try { localStorage.setItem(NK, JSON.stringify(npref)); } catch (e) {} };
  /* reading maths aloud: "F = −kx" → "F equals minus k x" */
  const SAY_REL = { '=': ' equals ', '≈': ' is approximately ', '≃': ' is approximately ', '≠': ' is not equal to ', '≡': ' is defined as ', '∝': ' is proportional to ', '<': ' is less than ', '>': ' is greater than ', '≤': ' is at most ', '≥': ' is at least ', '≪': ' is much less than ', '≫': ' is much greater than ', '→': ' goes to ', '⟶': ' goes to ', '⇒': ', so ', '∼': ' is of order ', '∈': ' in ' };
  const SAY_BIN = { '+': ' plus ', '−': ' minus ', '-': ' minus ', '×': ' times ', '·': ' dot ', '⋅': ' times ', '÷': ' divided by ', '±': ' plus or minus ', '/': ' over ' };
  const SAY_GRK = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'theta', ι: 'iota', κ: 'kappa', λ: 'lambda', μ: 'mu', µ: 'mu', ν: 'nu', ξ: 'xi', π: 'pi', ρ: 'rho', σ: 'sigma', τ: 'tau', υ: 'upsilon', φ: 'phi', ϕ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega', Γ: 'gamma', Δ: 'delta', Θ: 'theta', Λ: 'lambda', Π: 'pi', Σ: 'sigma', Φ: 'phi', Ψ: 'psi', Ω: 'omega', 'ħ': 'h bar', 'ℏ': 'h bar', 'ℓ': 'l', '∂': 'partial', '∇': 'del', '∞': 'infinity' };
  const SAY_UNIT = { m: 'metres', s: 'seconds', kg: 'kilograms', g: 'grams', N: 'newtons', J: 'joules', kJ: 'kilojoules', MJ: 'megajoules', W: 'watts', kW: 'kilowatts', Pa: 'pascals', kPa: 'kilopascals', V: 'volts', mV: 'millivolts', A: 'amps', mA: 'milliamps', Ω: 'ohms', Hz: 'hertz', kHz: 'kilohertz', K: 'kelvin', C: 'coulombs', F: 'farads', T: 'tesla', mol: 'moles', cm: 'centimetres', mm: 'millimetres', km: 'kilometres', nm: 'nanometres', ms: 'milliseconds', min: 'minutes', h: 'hours', eV: 'electronvolts', MeV: 'mega electronvolts', GeV: 'giga electronvolts', rad: 'radians', ly: 'light years', AU: 'astronomical units', u: 'atomic mass units', L: 'litres', dB: 'decibels', Bq: 'becquerels', Sv: 'sieverts' };
  const SAY_FN = { sin: 'sine', cos: 'cos', tan: 'tan', ln: 'log', log: 'log', exp: 'exp', sinh: 'shine', cosh: 'cosh', tanh: 'than', max: 'max', min: 'min', lim: 'limit', det: 'determinant', arcsin: 'arc sine', arccos: 'arc cos', arctan: 'arc tan' };
  function sayPow(v) { v = String(v).replace(/−/g, '-'); if (v === '2') return ' squared'; if (v === '3') return ' cubed'; if (v === '-1') return ' to the minus one'; if (v === '1/2') return ' to the half'; if (v === '−2' || v === '-2') return ' to the minus two'; return ' to the ' + v.replace(/^-/, 'minus ').replace(/\//g, ' over '); }
  function saySub(v) { v = String(v); if (v === '0') return ' nought'; return ' ' + v.split('').join(' '); }
  function speakable(str) {
    let s = String(str).replace(/\*\*/g, '').replace(/\$([^$]+)\$/g, '$1').replace(/e\.g\./g, 'for example').replace(/i\.e\./g, 'that is').replace(/≈/g, ' ≈ ');
    const out = [];
    TX.segs(s).forEach((g) => {
      if (!g.m) { out.push(g.t.replace(/°C/g, ' degrees Celsius').replace(/°/g, ' degrees').replace(/%/g, ' percent').replace(/½/g, ' half ').replace(/[–—]/g, ', ')); return; }
      const T = TX.tokens(g.t); TX.spans(T); let w = '';
      T.forEach((t, i) => {
        const prev = T[i - 1];
        switch (t.t) {
          case 'ws': w += ' '; break;
          case 'num': w += ' ' + t.raw.replace(/[   ]/g, '') + ' '; break;
          case 'let': w += ' ' + (t.k === 'unit' ? SAY_UNIT[t.v] || t.v : t.k === 'fn' ? SAY_FN[t.v] || t.v : t.k === 'word' ? t.v : t.v.length <= 4 ? t.v.split('').join(' ') : t.v) + ' '; break;
          case 'grk': w += ' ' + (t.k === 'unit' ? 'micro' : SAY_GRK[t.v] || '') + ' '; break;
          case 'sup': w += prev && prev.k === 'unit' ? (t.v.replace('−', '-') === '-1' ? ' per ' : t.v === '2' ? ' squared ' : t.v === '3' ? ' cubed ' : sayPow(t.v)) : sayPow(t.v.replace(/[{}]/g, '')) + ' '; break;
          case 'sub': w += saySub(t.v.replace(/[{}]/g, '')) + ' '; break;
          case 'frac': w += { '½': ' a half ', '⅓': ' a third ', '¼': ' a quarter ', '¾': ' three quarters ' }[t.raw] || ' '; break;
          case 'rel': w += SAY_REL[t.raw] || ' '; break;
          case 'bin': w += (t.raw === '/' && prev && prev.k === 'unit') ? ' per ' : SAY_BIN[t.raw] || ' '; break;
          case 'dash': w += ' minus '; break;
          case 'pre': w += t.raw === '√' ? ' root ' : t.raw === '∫' ? ' the integral of ' : t.raw === '∑' ? ' the sum of ' : ' '; break;
          case 'post': w += t.raw === '°' ? ' degrees ' : t.raw === '%' ? ' percent ' : t.raw === '′' ? ' prime ' : ' '; break;
          case 'acc': w += ' ' + (t.raw === 'ẋ' ? 'x dot' : t.raw === 'ẍ' ? 'x double dot' : 'dot') + ' '; break;
          case 'open': case 'close': w += ' '; break;
          case 'punct': w += t.v === ',' ? ', ' : ' '; break;
          default: w += ' ' + t.raw + ' ';
        }
      });
      out.push(w);
    });
    return out.join('').replace(/\s+/g, ' ').replace(/ ,/g, ',').trim();
  }

  /* ---------- the voice: one queue for every player ----------
     A player hands each line over a little before it is due (by the voice's own measured start-up delay), watches
     when the line really starts and ends, and holds its own clock at the next line until the voice gets there, so
     the words on screen are the words being spoken. Claude's voice where the page offers it: lines are added to one
     reading, as the platform asks. Else the browser's own, fed one short piece at a time with watchdogs, because on
     phones its events are unreliable. Else none, and the players show the words for as long as they take to read. */
  const speakT = { start: 0, end: 0, req: 0 };   // when the voice was last asked to speak, started and stopped (read by WL.fs)
  const ttsGet = () => Promise.resolve(null);
  /* text in pieces of at most n characters: at sentence ends where possible, then at a semicolon, comma or space;
     never inside $…$ */
  function pieces(s, n = 190) {
    s = String(s || '').replace(/\s+/g, ' ').trim(); if (!s) return []; if (s.length <= n) return [s];
    const keep = [], p = s.replace(/\$[^$]+\$/g, (m) => '\u0001' + (keep.push(m) - 1) + '\u0002');
    const back = (x) => x.replace(/\u0001(\d+)\u0002/g, (m, i) => keep[+i]);
    const out = []; let cur = '';
    const push = (x) => { x = x.trim(); if (!x) return; if (!cur) cur = x; else if (cur.length + 1 + x.length <= n) cur += ' ' + x; else { out.push(cur); cur = x; } };
    p.split(/(?<=[.!?])\s+(?=[A-Z“"(0-9\u0001])/).forEach((x) => {
      let rest = x;
      while (rest.length > n) {
        let k = rest.lastIndexOf('; ', n); if (k < n * 0.4) k = rest.lastIndexOf(', ', n); if (k < n * 0.4) k = rest.lastIndexOf(' ', n);
        if (k < 1) break; push(rest.slice(0, k + 1)); rest = rest.slice(k + 1);
      }
      push(rest);
    });
    if (cur) out.push(cur);
    return out.map(back);
  }
  const VQ = (() => {
    let eng = '', T = null, readyP = null, seq = 0, owner = null, paused = false, cool = 0, gesture = false, upErr = 0, bFail = 0, note = '';
    let chain = Promise.resolve(), bCur = null, bTok = 0, unlocked = false, bVoiceC = null, dog = 0;
    /* seen: the platform has reported a line's first sound at least once; blind: it seems not to, so starts are inferred */
    let seen = false, blind = false;
    const act = [], byId = new Map(), lat = [], subs = new Set();
    const now = () => performance.now();
    const emit = (what) => subs.forEach((f) => { try { f(what); } catch (e) {} });
    /* how long a line takes, in seconds: from the voice's measured speed once a few lines have been timed */
    const cps = [];
    const est = (text, rate) => { let c = 14.5; if (cps.length >= 3) { const o = cps.slice().sort((a, b) => a - b); c = o[o.length >> 1]; } return Math.max(0.8, String(text).length / c / Math.max(0.5, rate || 1)); };
    const clampR = (r) => Math.max(0.7, Math.min(1.5, +r || 0.95));
    function setEng(e, why) { if (eng === e) return; eng = e; lat.length = 0; cps.length = 0; note = why || note; emit('engine'); }
    function ready() {
      if (!readyP) readyP = ttsGet().then((t) => {
        if (t) {
          T = t; eng = 'claude';
          try { T.onLine((e) => { const L = byId.get(e && e.id); if (L) { seen = true; blind = false; started(L); } }); } catch (e) {}
          try { T.onState((e) => { if (!e) return; if (e.state === 'speaking') { if (soloCur && soloCur.st === 'queued') { seen = true; blind = false; started(soloCur); } else if (!act.some((x) => x.st === 'on')) { const h = act.find((x) => x.st === 'queued'); if (h) started(h); } }   /* a reading has begun: its first line is sounding */ if (e.state !== 'idle') return; if (e.reason === 'viewer_stopped') viewerStopped(); else if (e.reason === 'not_granted') { setEng('none', 'off'); clear(); } }); } catch (e) {}
        } else eng = window.speechSynthesis && window.SpeechSynthesisUtterance ? 'browser' : 'none';
        emit('engine'); return eng;
      });
      return readyP;
    }
    function mk(text, o) {
      const L = { id: 'v' + ++seq, text: String(text || '').replace(/\s+/g, ' ').trim(), rate: clampR(o.rate), owner: o.owner || null, st: 'new', tq: 0, t0: 0, t1: 0, code: '', idle: false, _s: [], _e: [] };
      L.onStart = (f) => { if (L.st === 'on' || L.st === 'done') f(L); else if (L.st !== 'fail') L._s.push(f); return L; };
      L.onEnd = (f) => { if (L.st === 'done' || L.st === 'fail') f(L); else L._e.push(f); return L; };
      return L;
    }
    function started(L) {
      if (L.st !== 'queued') return;
      L.st = 'on'; L.t0 = now(); speakT.start = L.t0;
      if (L.idle && L.tq) { lat.push((L.t0 - L.tq) / 1000); if (lat.length > 9) lat.shift(); }
      const f = L._s; L._s = []; f.forEach((g) => { try { g(L); } catch (e) {} });
    }
    function ended(L, code) {
      if (L.st === 'done' || L.st === 'fail') return;
      if (!code && L.st === 'queued') { L.guess = true; if (eng === 'claude' && !seen) blind = true; started(L); }   // read through without a first-sound report: infer starts from now on
      L.st = code ? 'fail' : 'done'; L.code = code || ''; L.t1 = now(); speakT.end = L.t1;
      if (!code && L.t0 && !L.guess && !L.pz && L.text.length > 40) { const d = (L.t1 - L.t0) / 1000; if (d > 1) { cps.push(Math.max(8, Math.min(30, L.text.length / d / L.rate))); if (cps.length > 15) cps.shift(); } }
      const i = act.indexOf(L); if (i >= 0) act.splice(i, 1); byId.delete(L.id);
      clearTimeout(L._w1); clearTimeout(L._w2);
      const f = L._e; L._e = []; L._s = []; f.forEach((g) => { try { g(L); } catch (e) {} });
      if (eng === 'browser') bPump();
      else if (eng === 'claude' && blind && !code) { const h = act.find((x) => x.st === 'queued'); if (h) { h.idle = false; h.guess = true; started(h); } }   // the reading runs straight on
    }
    /* hand a line over; it starts when the lines before it have been read */
    function say(text, o = {}) {
      const L = mk(text, o);
      L.st = 'queued'; L.tq = now(); L.idle = !act.some((x) => x.st === 'queued' || x.st === 'on');
      if (!L.text) { ended(L, 'empty'); return L; }
      act.push(L); watch();
      if (eng) feed(L); else ready().then(() => feed(L));
      if (blind && L.idle) setTimeout(() => { if (blind && L.st === 'queued' && !act.some((x) => x.st === 'on')) { L.idle = false; L.guess = true; started(L); } }, lead() * 1000);
      return L;
    }
    function feed(L) {
      if (L.st !== 'queued') return;
      if (eng === 'none') return ended(L, 'none');
      if (gesture) return ended(L, 'no_gesture');
      if (now() < cool) return ended(L, 'cool');
      if (eng === 'claude') return cFeed(L);
      bPump();
    }
    const P = (x) => (x && typeof x.then === 'function' ? x : Promise.resolve(x));
    /* Claude's voice: every line goes on the end of one reading */
    function cFeed(L) {
      byId.set(L.id, L);
      chain.then(() => {
        if (L.st !== 'queued') return;
        if (typeof T.add !== 'function') return cSolo();            // an older platform build: one line per reading
        let p; L.sent = true; speakT.req = now(); try { p = T.add([{ text: L.text.slice(0, 1990), id: L.id }], { voice: npref.voice, rate: L.rate, language: 'en' }); } catch (e) { return cErr(L, e); }
        P(p).then(() => { upErr = 0; ended(L); }, (e) => cErr(L, e));
      });
    }
    let soloCur = null;
    function cSolo() {
      if (soloCur && soloCur.st !== 'done' && soloCur.st !== 'fail') return;
      const L = act.find((x) => !x.sent && (x.st === 'queued' || x.st === 'on')); if (!L) { soloCur = null; return; }   // (an inferred start may come before it is sent)
      soloCur = L; L.sent = true; let p;
      const next = () => { if (soloCur === L) soloCur = null; cSolo(); };
      speakT.req = now(); try { p = T.speak(L.text.slice(0, 1990), { voice: npref.voice, rate: L.rate, language: 'en' }); } catch (e) { cErr(L, e); return next(); }
      P(p).then(() => { upErr = 0; ended(L); next(); }, (e) => { cErr(L, e); next(); });
    }
    function cErr(L, e) {
      const code = (e && e.code) || 'upstream_error', why = (e && e.reason) || '';
      if (code === 'no_gesture') gesture = true;
      else if (code === 'busy') cool = now() + 2500;
      else if (code === 'rate_limited') { cool = now() + Math.max(5000, (e && e.retryAfterMs) || 20000); note = 'rest'; emit('note'); }
      else if (code === 'not_granted') { setEng('none', 'off'); }
      else if (code === 'unavailable') setEng(window.speechSynthesis ? 'browser' : 'none');
      else if (code === 'upstream_error') { if (++upErr >= 3) setEng(window.speechSynthesis ? 'browser' : 'none'); }
      else if (code === 'stopped' && why === 'viewer_stopped') viewerStopped();
      ended(L, code === 'stopped' ? why || 'stopped' : code);
    }
    function viewerStopped() {
      // the viewer pressed Stop (or Esc): narration goes off everywhere until they turn it back on
      npref.on = false; nsave(); clear(); emit('off');
    }
    /* the browser's voice: one line at a time, in pieces short enough not to be cut off */
    function bVoice() {
      if (bVoiceC || !window.speechSynthesis) return bVoiceC; const V = speechSynthesis.getVoices().filter(voice => voice.localService) || [];
      bVoiceC = V.find((v) => /en-GB/i.test(v.lang) && /Google|Daniel|Serena|Kate|Arthur|Martha/i.test(v.name)) || V.find((v) => /en-GB/i.test(v.lang)) || V.find((v) => /^en/i.test(v.lang)) || null; return bVoiceC;
    }
    if (window.speechSynthesis) try { speechSynthesis.addEventListener('voiceschanged', () => { bVoiceC = null; bVoice(); }); } catch (e) {}
    function bPump() {
      if (eng !== 'browser' || paused || bCur) return;
      const L = act.find((x) => x.st === 'queued'); if (!L) return;
      if (gesture || now() < cool) return ended(L, gesture ? 'no_gesture' : 'cool');
      const parts = pieces(L.text, 180), tok = ++bTok; bCur = L; let i = 0;
      const next = () => {
        if (tok !== bTok) return;
        if (i >= parts.length) { bCur = null; bFail = 0; ended(L); return; }
        const text = parts[i++]; let fired = false;
        const fin = () => { if (fired || tok !== bTok) return; fired = true; clearTimeout(L._w2); next(); };
        const u = new SpeechSynthesisUtterance(text), vv = bVoice(); if (vv) u.voice = vv; u.lang = (vv && vv.lang) || 'en-GB'; u.rate = L.rate;
        u.onstart = () => { if (tok !== bTok) return; clearTimeout(L._w1); if (L.st === 'queued') started(L); };
        u.onend = () => { if (tok === bTok && L.st === 'queued') started(L); fin(); };
        u.onerror = (ev) => { const er = ev && ev.error; if (er === 'interrupted' || er === 'canceled') return; fin(); };
        L._w2 = setTimeout(() => { if (fired || tok !== bTok) return; try { speechSynthesis.cancel(); } catch (e) {} fin(); }, (est(text, L.rate) * 1.8 + 2.5) * 1000);
        speakT.req = now(); try { speechSynthesis.speak(u); } catch (e) { fired = true; bCur = null; ended(L, 'browser'); }
      };
      // no sound within three seconds: count it as failed (some phones never start, or never say so)
      L._w1 = setTimeout(() => {
        if (tok !== bTok || L.st !== 'queued') return;
        if (window.speechSynthesis && speechSynthesis.speaking) { started(L); return; }
        bTok++; bCur = null; try { speechSynthesis.cancel(); } catch (e) {}
        if (++bFail >= 2) setEng('none', 'none'); ended(L, 'nostart');
      }, 3000);
      next();
    }
    /* a stalled voice must never stall a player */
    function watch() {
      if (dog) return;
      dog = setInterval(() => {
        if (!act.length) { clearInterval(dog); dog = 0; return; }
        if (paused) return;
        const on = act.find((x) => x.st === 'on'), t = now();
        if (on && t - on.t0 > (est(on.text, on.rate) * 3 + 10) * 1000) ended(on);
        const head = act.find((x) => x.st === 'queued');
        if (eng === 'claude' && !seen && !on && head) {
          // no first-sound report yet: a line that follows a finished one has surely begun after 1.5 s, the first of a
          // reading after three start-up delays; from then on starts are inferred (and a real report turns this off)
          const follow = speakT.end > head.tq, since = t - (follow ? speakT.end : head.tq);
          if (since > (follow ? 1500 : Math.max(3000, 3000 * lead()))) { blind = true; head.idle = false; head.guess = true; started(head); return; }
        }
        if (!on && head && t - Math.max(head.tq, speakT.end) > 10000) { const all = act.slice(); all.forEach((x) => ended(x, 'stall')); if (eng === 'claude' && T) { try { chain = P(T.stop()).catch(() => {}); } catch (e) {} } }
      }, 250);
    }
    function clear() {
      paused = false; bTok++; bCur = null;
      const all = act.slice(); act.length = 0; byId.clear();
      all.forEach((x) => ended(x, 'cleared'));
      soloCur = null;
      if (eng === 'claude' && T && (all.length || (T.active && T.active()))) { try { chain = P(T.stop()).catch(() => {}); } catch (e) {} }
      try { if (eng === 'browser' && window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel(); } catch (e) {}
    }
    function pause() {
      if (paused || !act.length) return; paused = true; act.forEach((x) => (x.pz = true));
      if (eng === 'claude' && T) { try { P(T.pause()).catch(() => {}); } catch (e) {} return; }
      if (eng === 'browser' && bCur) { const L = bCur; bTok++; bCur = null; clearTimeout(L._w1); clearTimeout(L._w2); try { speechSynthesis.cancel(); } catch (e) {} if (L.st === 'on') { L.st = 'queued'; L.idle = false; } }
    }
    function resume() {
      if (!paused) return; paused = false;
      if (eng === 'claude' && T) { try { P(T.resume()).catch(() => {}); } catch (e) {} return; }
      act.forEach((x) => { if (x.st === 'queued') x.tq = now(); }); bPump();
    }
    /* the start-up delay players allow for: a low quantile of what this voice has shown, so it is rarely early */
    function lead() {
      const d = eng === 'claude' ? 0.75 : eng === 'browser' ? 0.25 : eng === 'none' ? 0 : 0.5; if (lat.length < 2) return d;
      const s = lat.slice().sort((a, b) => a - b), q = s[Math.floor((s.length - 1) * 0.35)];
      return eng === 'claude' ? Math.min(1.6, Math.max(0.2, q)) : Math.min(0.8, Math.max(0.05, q));
    }
    /* one player speaks at a time: the one the viewer last started keeps the voice while it plays */
    function claim(who, force) {
      if (owner === who) return true;
      if (owner && !force && owner.engaged && owner.engaged()) return false;
      const old = owner; owner = who;
      if (old) { clear(); try { if (old.lostVoice) old.lostVoice(); } catch (e) {} }
      return true;
    }
    /* phones: the first touch unlocks the browser's voice, and clears a wait for the viewer's press */
    const onGesture = () => {
      gesture = false;
      if (!unlocked && npref.on && eng !== 'claude' && window.speechSynthesis && window.SpeechSynthesisUtterance) { unlocked = true; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {} }
    };
    ['click', 'touchend', 'keydown'].forEach((ev) => document.addEventListener(ev, onGesture, true));
    return {
      say, clear, pause, resume, lead, claim, ready, est,
      kind: () => eng, owner: () => owner, release: (who) => { if (owner === who) owner = null; },
      waiting: () => act.reduce((n, x) => n + (x.st === 'queued' ? 1 : 0), 0),
      isPaused: () => paused, busy: () => act.length > 0, note: () => (now() < cool ? 'rest' : note), sub: (f) => { subs.add(f); return () => subs.delete(f); }
    };
  })();
  setTimeout(() => VQ.ready(), 0);
  /* the old one-line interface: resolves true once the line has been read */
  function say(text, rate) { return new Promise((res) => VQ.say(text, { rate }).onEnd((l) => res(l.st === 'done'))); }
  function hush() { VQ.clear(); return Promise.resolve(); }
  /* every narration switch on the page shows the same state */
  function syncSwitches() {
    document.querySelectorAll('.nbtn[data-n=on]').forEach((b) => { b.setAttribute('aria-pressed', npref.on); const s = b.querySelector('span'); if (s) s.textContent = npref.on ? 'Narration on' : 'Listen with narration'; });
    document.querySelectorAll('.mnarr, .lx-bar [data-a=voice]').forEach((b) => b.setAttribute('aria-pressed', npref.on));
    try { window.dispatchEvent(new CustomEvent('wl-narr', { detail: npref.on })); } catch (e) {}
  }
  VQ.sub((w) => { if (w === 'off') syncSwitches(); });
  /* the captions, loaded only when narration is first used */
  let narrP = null;
  const narrData = () => { if (WL.narr) return Promise.resolve(WL.narr); if (!narrP) narrP = new Promise((res) => { const s = document.createElement('script'); s.src = 'js/narration.js'; s.onload = () => res(WL.narr || {}); s.onerror = () => res({}); document.head.appendChild(s); }); return narrP; };
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* words for the screen: $…$ set in TeX, the rest as running text */
  const dispHTML = (s) => String(s || '').split(/\$([^$]+)\$/).map((p, i) => (i % 2 ? `<span class="mx" data-tex="${escH(p)}">${escH(p.replace(/\\[,;:! ]/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim())}</span>` : texPretty(p))).join('');
  /* words for the voice */
  const spokenOf = (s) => speakable(String(s || '').replace(/\$([^$]+)\$/g, (m, t) => (WL.texSpeak ? WL.texSpeak(t) : t)));

  /* ---------- a film: the bar under it, the transcript, and the voice-led loop ----------
     The film's own captions are burned into the picture. Each is read as the film reaches it, and the film waits at
     the next caption until the voice has started it, so picture, caption and voice move together. Lines added for
     listening (equations read aloud, the problem to try, where the model breaks) are shown over the caption band
     while they are read. With Explain more, the film pauses at the end of each idea, once its animation has played,
     and the plain-words explanation is read and shown there. */
  let curFilm = null;
  /* Explain more: where the film's own narration is brief, add the step-by-step guide in plain words.
     The hook after the title; each guide step after the caption that reads the notes section it explains
     (or, if the film does not read that section, at the end of "See it"); the worked solution after "The answer is";
     two common mistakes at the end of "Where it breaks"; and a pointer to the full guide at the end. */
  function explain(tid, caps, G) {
    const N = (WL.notes || {})[tid] || {}, V = (WL.videos || {})[tid] || (WL.svideos || {})[tid] || {}, ch = V.ch || [];
    const add = {}, put = (i, s) => { if (!s) return; i = Math.max(0, Math.min(caps.length - 1, i)); (add[i] = add[i] || []).push(s); };
    const lastBefore = (t) => { let k = -1; caps.forEach((c, i) => { if (c.t < t - 0.05) k = i; }); return k; };
    const groupEnd = (i) => { let j = i; while (j + 1 < caps.length && caps[j + 1].t - caps[i].t < 0.25) j++; return j; };
    const si = ch.findIndex((x) => /^see it$/i.test(x[1]));
    const seeEnd = si >= 0 && ch[si + 1] ? lastBefore(ch[si + 1][0]) : 0;
    if (G.h) put(0, G.h);
    (G.s || []).forEach(([h, ps, o]) => {
      let at = -1; const sec = o && o.n != null ? (N.sec || [])[o.n] : null;
      if (sec && sec.p && sec.p[0]) { const key = String(sec.p[0]).slice(0, 40); at = caps.findIndex((c) => c.s.startsWith(key)); }
      put(at >= 0 ? groupEnd(at) : Math.max(seeEnd, 0), [String(h).replace(/[.:]?$/, '.'), ...(ps || [])].join(' '));
    });
    const ans = caps.findIndex((c) => /^The answer is/i.test(c.s));
    if (ans > 0) {
      const tq = caps[ans - 1].s.replace(/^Try one\.\s*/, '');
      const p = (N.probs || []).find((q) => q && q.q && tq.startsWith(String(q.q).replace(/\*\*/g, '').slice(0, 30)));
      if (p && (p.s || []).length) put(ans, 'Here is the working. ' + p.s.join(' '));
    }
    const wb = ch.findIndex((x) => /where it breaks/i.test(x[1]));
    if (wb >= 0) { const k = lastBefore(ch[wb + 1] ? ch[wb + 1][0] : 1e9); (G.m || []).slice(0, 2).forEach(([a, b]) => put(k, 'A common mistake: ' + String(a).replace(/[.]?$/, '.') + ' ' + b)); }
    put(caps.length - 1, 'The full step-by-step guide, with a worked example and a quick check for each idea, is in the Notes tab.');
    const out = [];
    caps.forEach((c, i) => { out.push(c); (add[i] || []).forEach((s, j) => out.push({ t: +(c.t + 0.002 * (j + 1)).toFixed(3), s, x: true })); });
    return out;
  }
  /* the lines in reading order. kind: 'cap' (burned into the film), 'aug' (added for listening) or 'x' (Explain
     more). A follower is read straight after the line before it, while the film plays on; an x line waits for the
     end of its idea and holds the film while it is read. */
  /* the first moment after t (by more than 0.3 s) at which the film starts moving on to new content */
  const nextMove = (moves, t) => { for (const m of moves) if (m > t + 0.3) return m; return Infinity; };
  function filmPlan(c, dur, moves) {
    const out = [];
    c.forEach((x, i) => {
      const kind = x.x ? 'x' : x.aug ? 'aug' : 'cap';
      let T = x.t;
      if (kind === 'x') { let j = i + 1; while (j < c.length && (c[j].x || c[j].t - x.t < 0.3)) j++; T = Math.max(x.t, Math.min(j < c.length ? c[j].t - MOVE : dur - 0.3, nextMove(moves, x.t) - 0.05)); }
      const follow = kind === 'aug' && i > 0 && !c[i - 1].x && x.t - c[i - 1].t < 0.3;
      const parts = kind === 'cap' ? [x.s] : pieces(x.d || x.s, 190);
      parts.forEach((d, k) => out.push({ T: T + k * 0.001, d, s: kind === 'cap' ? speakable(x.s) : x.d ? spokenOf(d) : speakable(d), kind, follow: k > 0 ? kind !== 'x' : follow, ci: i, st: 'pend' }));
    });
    return out.sort((a, b) => a.T - b.T || a.ci - b.ci);
  }
  const MOVE = 1.0;   // the films spend about a second fading one idea out and the next one's heading in, before its caption
  const vrate = () => ({ 0.7: 0.85, 0.85: 0.95, 1: 1.05 }[npref.rate] || 0.95);
  function film(tid, v, host) {
    if (curFilm) curFilm.kill(); if (!v || !host) return;
    const wrap = v.closest('.vwrap') || v.parentElement;
    const bar = document.createElement('div'); bar.className = 'nbar';
    bar.innerHTML = `<button type="button" class="nbtn" data-n="on" aria-pressed="${npref.on}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8v4h3l4 3V5L6 8z" fill="currentColor"/><path class="nw" d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>${npref.on ? 'Narration on' : 'Listen with narration'}</span></button>
      <label class="nrate">Pace <select data-n="rate">${[[0.7, 'Slow'], [0.85, 'Follow along'], [1, 'Normal']].map(([r, l]) => `<option value="${r}"${npref.rate === r ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
      <button type="button" class="nbtn ghost nmore" data-n="more" aria-pressed="${!!npref.more}" title="At the end of each idea, pause the film to explain it in plain words, then read the worked solution">Explain more</button>
      <button type="button" class="nbtn ghost" data-n="tr" aria-expanded="false">Transcript</button>
      <span class="nstat" aria-live="polite"></span><button type="button" class="nbtn ghost nskip" data-n="skip" hidden>Skip this line</button>`;
    host.appendChild(bar);
    const tr = document.createElement('ol'); tr.className = 'ntr'; tr.hidden = true; host.appendChild(tr);
    // over the film's caption band: the line being read, when it is not one burned into the film
    const ov = document.createElement('div'); ov.className = 'ncap'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="ncap-in"><span class="ncap-tag">Explaining</span><p class="ncap-t"></p></div>'; wrap.appendChild(ov);
    const ovT = ov.querySelector('.ncap-t');
    // on a phone the film's captions are tiny: the line being read, in readable type, under the film
    const nowEl = document.createElement('p'); nowEl.className = 'nnow'; nowEl.hidden = true; wrap.after(nowEl);
    const stat = bar.querySelector('.nstat'), skipB = bar.querySelector('.nskip');
    let caps = null, L = null, moves = [], q = 0, gi = 0, alive = true, raf = 0, holding = '', holdAt = 0, ourT = 0, boost = 0, shown = null, wasHolding = false, slowed = false;
    const me = { engaged: () => alive && npref.on && (!v.paused || !!holding), lostVoice: () => { if (!v.paused || holding) { holding = ''; ourT = performance.now(); v.pause(); } } };
    const setRate = () => { slowed = false; try { v.playbackRate = npref.rate; v.defaultPlaybackRate = npref.rate; } catch (e) {} };
    setRate();
    const meta = () => new Promise((res) => { if (isFinite(v.duration) && v.duration > 0) return res(); v.addEventListener('loadedmetadata', () => res(), { once: true }); setTimeout(res, 2500); });
    const load = async () => {
      if (caps) return caps;
      const D = await narrData(); let c = (D[tid] || []).map(([t, s, a]) => ({ t, s, aug: a != null, d: typeof a === 'string' ? a : null }));
      if (npref.more && c.length && WL.guideLoad) { try { const G = await WL.guideLoad(tid); if (G) c = explain(tid, c, G); } catch (e) {} }
      await meta(); if (!alive) return [];
      const dur = isFinite(v.duration) && v.duration > 0 ? v.duration : (c.length ? c[c.length - 1].t + 4 : 0);
      moves = (WL.narrMove || {})[tid] || []; caps = c; L = filmPlan(c, dur, moves); q = gi = 0;
      const T0 = {}; L.forEach((x) => { if (T0[x.ci] == null) T0[x.ci] = x.T; });
      tr.innerHTML = caps.length ? caps.map((c, i) => `<li${c.x ? ' class="nx"' : ''}><div class="ntrl" role="button" tabindex="0" data-seek-n="${Math.max(0, (T0[i] != null ? T0[i] : c.t) - 0.05).toFixed(2)}" data-i="${i}"><small>${c.x ? 'more' : mmss(c.t)}</small><span>${dispHTML(c.d || c.s)}</span></div></li>`).join('') : '<li class="muted">This film has no narration yet.</li>';
      if (WL.mathify) WL.mathify(tr); return caps;
    };
    const mark = (k) => { tr.querySelectorAll('[data-i]').forEach((b) => b.classList.toggle('on', +b.dataset.i === k)); };
    const at = (t) => { let k = -1; (caps || []).forEach((c, i) => { if (!c.x && c.t <= t + 0.08) k = i; }); return k; };
    function show(x) {
      shown = x; mark(x.ci);
      const html = dispHTML(x.d); nowEl.innerHTML = html; nowEl.hidden = false; if (WL.mathify) WL.mathify(nowEl);
      if (x.kind === 'cap') { ov.classList.remove('on'); return; }
      ovT.innerHTML = html; ov.classList.toggle('x', x.kind === 'x'); ov.classList.add('on'); if (WL.mathify) WL.mathify(ovT);
    }
    const hideAll = () => { ov.classList.remove('on'); nowEl.hidden = true; shown = null; };
    /* hand a line to the voice */
    function speak(x) {
      x.st = 'queued';
      if (!VQ.claim(me)) return silent(x, 'owner');
      const l = VQ.say(x.s, { rate: vrate(), owner: me }); x.vl = l;
      l.onStart(() => { if (x.vl !== l) return; x.st = 'on'; show(x); catchUp(x); });
      l.onEnd((y) => { if (x.vl !== l) return; if (y.st === 'done') x.st = 'done'; else silent(x, y.code); });
    }
    /* no voice for this line: a caption is in the film already; an added line is shown for its reading time */
    function silent(x, code) { x.code = code; x.st = x.kind === 'cap' ? 'done' : 'silent'; }
    const readTime = (x) => Math.max(2, Math.min(12, x.d.length / 16)) / (npref.rate / 0.85);
    /* the voice began a line before the film reached it: let the film catch up, a little faster */
    function catchUp(x) {
      if (x.kind === 'x' || x.follow || v.paused) return;
      const ahead = x.T - v.currentTime;
      if (ahead > 0.15 && ahead < 3) { boost = x.T; try { v.playbackRate = npref.rate * Math.min(1.75, 1 + ahead / 0.8); } catch (e) {} }
    }
    function hold(why) {
      if (why) {
        if (!holding) { if (v.paused || v.ended) return; holding = why; holdAt = performance.now(); ourT = holdAt; v.pause(); }
        holding = why;
        const long = performance.now() - holdAt > 900;
        stat.textContent = why === 'x' ? 'Explaining. The film carries on afterwards.' : !long ? '' : why === 'read' ? 'Pausing so you can read the line…' : 'Waiting for the voice…';
        skipB.hidden = !(why === 'x' || long); skipB.textContent = why === 'x' ? 'Continue' : 'Skip this line';
      } else if (holding) {
        holding = ''; stat.textContent = ''; skipB.hidden = true; ourT = performance.now();
        if (npref.on && !v.ended) v.play().catch(() => { stat.textContent = 'Press play to carry on.'; });
      }
    }
    const doneSt = (s) => s === 'done' || s === 'skip';
    function tick() {
      if (!alive) return; raf = requestAnimationFrame(tick);
      // lift the band above the player's controls when the viewer has paused (not while the film waits for the voice)
      const up = v.paused && !holding; if (up !== wrap._vp) { wrap._vp = up; wrap.classList.toggle('vp', up); }
      if (!npref.on || !L || !L.length) { if (holding) hold(''); return; }
      const ct = v.currentTime, now = performance.now();
      if (boost && (ct >= boost - 0.03 || v.paused)) { boost = 0; setRate(); }
      // hand lines over a little before they are due; never more than two waiting ahead
      if (!v.paused || holding) {
        const ld = VQ.lead() * (v.playbackRate || 1);
        while (q < L.length) {
          const x = L[q];
          if (x.st !== 'pend') { q++; continue; }
          const due = x.follow ? q === 0 || L[q - 1].st !== 'pend' : ct >= x.T - Math.max(ld, 0.12) - 0.02;   // always before the hold point
          if (!due || (!x.follow && VQ.waiting() >= 2)) break;
          speak(x); q++;
        }
      }
      // the film may not pass a line that has not started, nor play on while an explanation is read
      while (gi < L.length && doneSt(L[gi].st)) gi++;
      let why = '', clear = true;
      for (let i = gi; i < L.length; i++) {
        const x = L[i];
        if (x.T > ct + 0.6) break;
        if (doneSt(x.st)) continue;
        if (x.st === 'silent') {
          if (clear && ct >= x.T - 0.08) { x.st = 'read'; x.until = now + readTime(x) * 1000; show(x); }
          else if (ct >= x.T - 0.04) { why = 'read'; break; }
        }
        if (x.st === 'read') { if (now >= x.until) { x.st = 'done'; continue; } clear = false; if (x.kind === 'x') { why = 'x'; break; } continue; }
        clear = false;
        if (x.kind === 'x') { if (ct >= x.T - 0.04) { why = 'x'; break; } continue; }
        if (x.follow) continue;
        if ((x.st === 'pend' || x.st === 'queued') && ct >= x.T - 0.04) { why = 'wait'; break; }
      }
      // the idea on screen now: its leading line, the lines read after it, and the moment the film moves on
      let li = -1, j = -1, busy = false, end = Infinity;
      for (let i = Math.max(0, gi - 12); i < L.length && L[i].T <= ct + 0.05; i++) if (L[i].kind !== 'x' && !L[i].follow) li = i;
      if (li >= 0) {
        for (j = li; j < L.length && (j === li || L[j].follow); j++) if (!doneSt(L[j].st)) busy = true;
        let k = j; while (k < L.length && (L[k].kind === 'x' || L[k].follow)) k++;
        end = Math.max(L[li].T + 0.2, Math.min(k < L.length ? L[k].T - MOVE : Infinity, nextMove(moves, L[li].T) - 0.05));
        // nor begin moving to the next idea while this one is still being read
        if (!why && busy && ct >= end - 0.02) why = L[li].st === 'read' ? 'read' : 'wait';
      }
      hold(why);
      // rather than stop dead at the end of an idea, play it more slowly when the voice will need longer (to 0.6 times)
      let want = 0;
      if (!why && busy && !v.paused && !boost && ct < end) {
        let need = 0;
        for (let i = li; i < j; i++) {
          const x = L[i]; if (doneSt(x.st)) continue;
          if (x.st === 'on') need += Math.max(0, VQ.est(x.s, vrate()) - (now - ((x.vl && x.vl.t0) || now)) / 1000);
          else if (x.st === 'read') need += Math.max(0, (x.until - now) / 1000);
          else if (x.st !== 'silent' || x.kind !== 'cap') need += (x.st === 'silent' ? readTime(x) : VQ.est(x.s, vrate())) + 0.15;
        }
        const have = (end - ct) / npref.rate;
        if (need > have + 0.15) want = npref.rate * Math.max(0.6, have / need);
      }
      if (want) { if (Math.abs(v.playbackRate - want) > 0.04) { try { v.playbackRate = want; } catch (e) {} } slowed = true; }
      else if (slowed && !boost) setRate();
      // a caption with no voice (none here, or this line failed): the copy under the film and the transcript follow the film
      const ci = at(ct);
      if (ci >= 0 && (!shown || shown.ci !== ci)) { const x = L.find((y) => y.ci === ci && y.kind === 'cap'); if (x && (x.code || VQ.kind() === 'none') && doneSt(x.st)) show(x); }
      // a finished added line comes off the film once the film reaches its next caption
      if (shown && shown.kind !== 'cap' && doneSt(shown.st) && ov.classList.contains('on')) { const nx = L.find((x) => x.T > shown.T + 0.01 && x.kind === 'cap'); if (nx && ct >= nx.T - 0.02) ov.classList.remove('on'); }
    }
    raf = requestAnimationFrame(tick);
    /* after a jump: forget what was queued and read on from here (a line just started is read again) */
    function resync(ct) {
      if (!L) return;
      L.forEach((x) => (x.vl = null));
      if (VQ.owner() === me) VQ.clear();
      L.forEach((x) => { x.st = x.T < ct - (x.kind === 'x' ? 0.1 : 0.6) ? 'skip' : 'pend'; });
      L.forEach((x, i) => { if (x.follow && i && L[i - 1].st === 'skip') x.st = 'skip'; });
      q = gi = 0; boost = 0; setRate(); ov.classList.remove('on'); mark(at(ct));
      if (holding) { holding = ''; stat.textContent = ''; skipB.hidden = true; }
    }
    /* the viewer chose not to wait: drop what is being read and go on */
    function skipNow() {
      const ct = v.currentTime;
      L.forEach((x) => (x.vl = null)); if (VQ.owner() === me) VQ.clear();
      L.forEach((x, i) => { if (!doneSt(x.st) && (x.T <= ct + 0.05 || (x.follow && i && L[i - 1].st === 'skip'))) x.st = 'skip'; else if (x.st !== 'skip' && x.st !== 'done') x.st = 'pend'; });
      q = gi = 0; ov.classList.remove('on'); holding = ''; stat.textContent = ''; skipB.hidden = true;
    }
    const onSeek = () => { if (!L) return; wasHolding = !!holding || wasHolding; resync(v.currentTime); };
    const onSeeked = () => { if (wasHolding && npref.on) { wasHolding = false; ourT = performance.now(); v.play().catch(() => {}); } wasHolding = false; };
    const onPause = () => {
      if (holding || performance.now() - ourT < 400) return;      // our own hold
      if (VQ.owner() === me) VQ.pause(); stat.textContent = ''; skipB.hidden = true;
    };
    const onPlay = () => {
      if (!holding && performance.now() - ourT < 400) return;     // our own release
      if (boost) { boost = 0; } setRate();
      if (!npref.on || !L) return;
      if (holding) { skipNow(); return; }                          // pressing play while the film waits means: go on
      VQ.claim(me, true); if (VQ.isPaused()) VQ.resume();
    };
    const onEnd = () => { holding = ''; stat.textContent = ''; skipB.hidden = true; };
    const onVis = () => { if (document.hidden && npref.on && !v.paused && !holding) v.pause(); };
    v.addEventListener('seeking', onSeek); v.addEventListener('seeked', onSeeked); v.addEventListener('pause', onPause); v.addEventListener('play', onPlay); v.addEventListener('ended', onEnd);
    document.addEventListener('visibilitychange', onVis);
    const unsub = VQ.sub((w) => {
      if (!alive || !npref.on) { if (w === 'off') { hideAll(); if (holding) hold(''); } return; }
      const k = VQ.kind(), n = VQ.note();
      if (k === 'none') stat.textContent = n === 'off' ? 'Reading aloud is turned off for this page (its Permissions menu turns it back on). Added lines appear on the film.' : 'No voice in this browser: added lines appear on the film as text.';
      else if (n === 'rest' && w === 'note') stat.textContent = 'The voice is resting for a moment; the captions carry on.';
    });
    bar.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-n]'); if (!b) return;
      if (b.dataset.n === 'on') {
        npref.on = !npref.on; nsave(); syncSwitches();
        if (npref.on) {
          VQ.claim(me, true); await load(); if (!alive) return;
          if (!caps.length) { stat.textContent = 'No narration for this film yet.'; return; }
          resync(v.currentTime); if (v.paused) v.play().catch(() => {});
          if (VQ.kind() === 'none') stat.textContent = 'No voice in this browser: added lines appear on the film as text.';
        } else { if (VQ.owner() === me) VQ.clear(); hideAll(); if (holding) { holding = ''; ourT = performance.now(); v.play().catch(() => {}); } boost = 0; setRate(); stat.textContent = ''; skipB.hidden = true; }
      }
      if (b.dataset.n === 'more') {
        npref.more = !npref.more; nsave(); b.setAttribute('aria-pressed', npref.more);
        const was = !!holding; caps = null; L = null; if (VQ.owner() === me) VQ.clear(); holding = ''; ov.classList.remove('on');
        await load(); if (!alive) return; resync(v.currentTime); if (was) { ourT = performance.now(); v.play().catch(() => {}); }
        stat.textContent = npref.more ? 'At the end of each idea the film will pause to explain it.' : '';
        return;
      }
      if (b.dataset.n === 'skip') { const was = !!holding; skipNow(); if (was) { ourT = performance.now(); v.play().catch(() => {}); } return; }
      if (b.dataset.n === 'tr') { await load(); tr.hidden = !tr.hidden; b.setAttribute('aria-expanded', !tr.hidden); if (!tr.hidden) mark(shown ? shown.ci : at(v.currentTime)); }
    });
    bar.addEventListener('change', (e) => { if (e.target.dataset.n === 'rate') { npref.rate = +e.target.value; nsave(); setRate(); } });
    const go = (b) => { v.currentTime = +b.dataset.seekN; v.play().catch(() => {}); };
    tr.addEventListener('click', (e) => { const b = e.target.closest('[data-seek-n]'); if (b) go(b); });
    tr.addEventListener('keydown', (e) => { const b = e.target.closest('[data-seek-n]'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(b); } });
    if (npref.on) load();
    // Each film kills only itself. (The router renders the next page, and with it the next film, before this listener
    // runs, so "kill whatever film is current" here used to silence the new film after every page change.)
    me.kill = () => {
      if (!alive) return; alive = false; cancelAnimationFrame(raf);
      if (VQ.owner() === me) { VQ.clear(); VQ.release(me); }
      v.removeEventListener('seeking', onSeek); v.removeEventListener('seeked', onSeeked); v.removeEventListener('pause', onPause); v.removeEventListener('play', onPlay); v.removeEventListener('ended', onEnd);
      document.removeEventListener('visibilitychange', onVis); unsub(); ov.remove(); nowEl.remove();
      if (curFilm === me) curFilm = null;
    };
    me.state = () => ({ holding, q, gi, lines: L ? L.map((x) => [x.T, x.kind, x.follow ? 1 : 0, x.st, x.vl ? x.vl.id : '', x.s.slice(0, 30)]) : null, shown: shown ? shown.d : '' });
    curFilm = me; WL.narrate.cur = me;
    window.addEventListener('hashchange', () => me.kill(), { once: true });
    return me;
  }

  /* ---------- live animations: the clock waits at each beat until the voice has started it ----------
     manim.js asks scene.limit(sc, d) how far its clock may move this frame. Each beat's caption is handed to the
     voice a little ahead; the clock holds at a beat until its line starts (the caption changes as the clock crosses
     the beat, so it appears with the voice), and at the end of the timeline until the last line has been read. A
     scene that starts by itself never takes the voice from a film or lecture that is playing. */
  const sceneOwner = (sc) => sc._vo || (sc._vo = { engaged: () => !sc._vo.dead && sc.playing && sc.visible && !document.hidden && sc.t < sc.dur + 0.3, lostVoice: () => {} });
  function sceneVoice(sc) {
    if (sc._nv && sc._nv.spec === sc.spec) return sc._nv;
    const s = (sc.spec.beats || []).map((b, k) => ({ k, t0: b[0], text: b[1] ? speakable(b[1]) : '', st: 'pend', vl: null })).filter((x) => x.text);
    return (sc._nv = { spec: sc.spec, s, q: 0, dirty: true });
  }
  const scene = {
    speed: () => npref.srate,
    bar(sc, bar) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mbtn mnarr'; b.setAttribute('aria-pressed', npref.on); b.title = 'Narration'; b.setAttribute('aria-label', 'Narration');
      b.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8v4h3l4 3V5L6 8z" fill="currentColor"/><path d="M13 7.2a4 4 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      b.addEventListener('click', () => {
        npref.on = !npref.on; nsave(); syncSwitches();
        const o = sceneOwner(sc), V = sceneVoice(sc);
        if (!npref.on) { if (VQ.owner() === o) VQ.clear(); sc._hold = false; }
        else { VQ.claim(o, true); V.dirty = true; }
      });
      const fs = bar.querySelector('[data-act=fs]'); bar.insertBefore(b, fs || null);
    },
    limit(sc, d) {
      const beats = sc.spec.beats || [];
      if (!npref.on || !beats.length || VQ.kind() === 'none') { sc._hold = false; return d; }
      const V = sceneVoice(sc), o = sceneOwner(sc), t = sc.t;
      if (!VQ.claim(o)) { sc._hold = false; return d; }       // another player has the voice: run on silently
      if (V.dirty) { V.dirty = false; V.q = 0; V.s.forEach((x) => { x.vl = null; x.st = x.t0 < t - 0.3 ? 'skip' : 'pend'; }); }
      const ld = VQ.lead() * (sc.speed || 1);
      while (V.q < V.s.length) {
        const x = V.s[V.q]; if (x.st !== 'pend') { V.q++; continue; }
        if (t + d < x.t0 - ld || VQ.waiting() >= 2) break;
        x.st = 'queued'; const l = VQ.say(x.text, { rate: 0.95, owner: o }); x.vl = l;
        l.onStart(() => { if (x.vl !== l) return; x.st = 'on'; if (!sc.spec.stateful && sc.t < x.t0 && x.t0 - sc.t < 2) sc.t = x.t0; });
        l.onEnd((y) => { if (x.vl !== l) return; x.st = y.st === 'done' ? 'done' : 'fail'; });
        V.q++;
      }
      let lim = Infinity;
      for (const x of V.s) if (x.st === 'pend' || x.st === 'queued') { lim = x.t0 - 0.005; break; }
      if (V.s.some((x) => x.st === 'on' || x.st === 'queued')) lim = Math.min(lim, sc.dur - 0.005);
      const nd = Math.max(0, Math.min(d, lim - t)); sc._hold = nd < d - 1e-6;
      return nd;
    },
    beat() {},
    toggle(sc) { const o = sceneOwner(sc); if (sc.playing) { VQ.claim(o, true); if (VQ.owner() === o && VQ.isPaused()) VQ.resume(); } else if (VQ.owner() === o) VQ.pause(); },
    seek(sc) { const o = sceneOwner(sc); sceneVoice(sc).dirty = true; if (VQ.owner() === o) VQ.clear(); },
    gone(sc) { const o = sc._vo; if (!o) return; o.dead = true; if (VQ.owner() === o) { VQ.clear(); VQ.release(o); } }
  };
  WL.narrate = { film, scene, speakable, say, hush, pref: npref, speakT, voice: VQ, pieces, syncSwitches, dispHTML };

})();
