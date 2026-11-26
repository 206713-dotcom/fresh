/* Twistor — Ask Twistor: questions answered from the course itself.
   Type a question in your own words; the page searches every lesson's notes, the "why" of every derivation step, the
   equation sheets, the glossary, the worked problems and the model answers, and shows the passages that answer it best,
   each with the lesson it comes from. Nothing is generated or sent anywhere: if the course does not cover something,
   you see the nearest lessons instead of an invented answer.
   Ranking: BM25 over about 7000 short passages (k1 = 1.2, b = 0.75), with light stemming, a few physics abbreviations
   expanded (KE, GPE, emf, p.d., SHM …), a bonus for the lesson title and for words that appear together. */
(function () {
  const WL = (window.WL = window.WL || {}), $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const STOP = new Set('a an the of to in on at by for from with and or but is are was were be been being it its this that these those what which who whom whose why how when where does do did doing can could should would will shall may might must i you we they he she them his her our your their there here than then so if as into onto about over under not no yes very more most less least just also only same such some any each every both either neither me my mine us please explain tell show give find work works working mean means meaning happen happens happening get gets got make makes made thing things way ways need needs use used using difference differences between compare versus vs describe define definition calculate out value actually really'.split(' '));
  const ABBR = { ke: 'kinetic energy', gpe: 'gravitational potential energy', pe: 'potential energy', emf: 'electromotive force', pd: 'potential difference', shm: 'simple harmonic motion', ac: 'alternating current', dc: 'direct current', em: 'electromagnetic', uv: 'ultraviolet', ir: 'infrared', suvat: 'constant acceleration equations', shc: 'specific heat capacity', rms: 'root mean square', ldr: 'light dependent resistor', led: 'light emitting diode', cog: 'centre of mass', com: 'centre of mass', fma: 'force mass acceleration', ohms: 'ohm resistance', speed: 'speed velocity' };
  /* a light stemmer: charge, charges, charged, charging → charg; slowly → slow; waves → wav */
  const stem = (w) => {
    if (w.length > 4 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
    else if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
    else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
    else if (w.length > 4 && w.endsWith('es')) w = w.slice(0, -2);
    else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) w = w.slice(0, -1);
    if (w.length > 4 && w.endsWith('ly')) w = w.slice(0, -2);
    if (w.length >= 4 && w.endsWith('e')) w = w.slice(0, -1);
    return w;
  };
  const plain = (s) => String(s == null ? '' : s).replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}$^_\\]/g, ' ');
  function words(s, expand) {
    const out = [];
    String(plain(s)).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9²³½]+/).forEach((w) => {
      if (!w || STOP.has(w) || /^\d+$/.test(w)) return;
      if (expand && ABBR[w] !== undefined) { ABBR[w].split(' ').filter(Boolean).forEach((x) => out.push(stem(x))); return; }
      if (w.length < 2) return;
      out.push(stem(w));
    });
    return out;
  }

  /* ---------- the passages ---------- */
  let IDX = null;
  function build() {
    const A = WL.app; if (!A) return null;
    const N = A.nodes, P = [];
    const add = (id, kind, where, text, extra) => { text = String(text || '').trim(); if (!text) return; P.push(Object.assign({ id, kind, where, text }, extra || {})); };
    Object.keys(N).forEach((id) => {
      const n = N[id], no = (WL.notes || {})[id];
      if (no) {
        if (no.big) add(id, 'notes', 'The big idea', no.big);
        (no.sec || []).forEach((s) => add(id, 'notes', s.h || 'Notes', [].concat(s.p || [], s.list || [], s.box ? [s.box] : [], s.warn ? [s.warn] : [], s.after ? [s.after] : []).join(' ')));
        (no.eqs || []).forEach((e) => add(id, 'equation', 'Equation sheet', e[1] || '', { tex: e[0] }));
        if (no.how && no.how.length) add(id, 'method', 'How to solve problems', [].concat(no.how).join(' '));
        if (no.sum && no.sum.length) add(id, 'notes', 'Summary', [].concat(no.sum).join(' '));
        (no.probs || []).forEach((q, i) => { if (q && q.q) add(id, 'worked', 'Worked problem ' + (i + 1), q.q + ' ' + (q.s || []).join(' '), { q: q.q, a: q.a }); });
      }
      const steps = (WL.derive && WL.derive[id] && WL.derive[id].steps) || (n.steps && !n.stub ? n.steps : null) || n.steps;
      (steps || []).forEach((st, i) => { if (st && (st.say || st.why)) add(id, 'derivation', 'Derivation, step ' + (i + 1), (st.say || '') + ' ' + (st.why || ''), { tex: st.tex, why: st.why, say: st.say }); });
      ((WL.keyterms || {})[id] || []).forEach((k) => add(id, 'term', 'Key term', k[0] + ': ' + k[1], { term: k[0] }));
      ((WL.written || {})[id] || []).forEach((w) => add(id, 'answer', 'Explain in words', w.q + ' ' + w.a, { q: w.q, a: w.a }));
    });
    /* BM25 statistics */
    const df = new Map(); let total = 0;
    P.forEach((p) => {
      p.toks = words(p.text + ' ' + (p.term || ''), false); p.len = p.toks.length; total += p.len;
      p.tf = new Map(); p.toks.forEach((t) => p.tf.set(t, (p.tf.get(t) || 0) + 1));
      p.tf.forEach((v, t) => df.set(t, (df.get(t) || 0) + 1));
      p.titleToks = new Set(words(N[p.id].title, false));
    });
    return { P, df, avg: total / Math.max(1, P.length), n: P.length };
  }
  const KIND_W = { notes: 1.0, derivation: 1.12, term: 1.05, equation: 0.92, method: 0.95, worked: 0.82, answer: 1.0 };
  function search(q) {
    if (!IDX) IDX = build();
    if (!IDX) return { hits: [], q: [] };
    const qt = [...new Set(words(q, true))]; if (!qt.length) return { hits: [], q: [] };
    /* why and how questions want an explanation; what-is questions want a definition */
    const ql = String(q).toLowerCase().trim(), explain = /^(why|how)\b/.test(ql) || /\b(why|how come)\b/.test(ql), define = /^(what (is|are|does)|define|meaning of)\b/.test(ql) || qt.length === 1;
    const { P, df, avg, n } = IDX, k1 = 1.2, b = 0.75;
    const idf = new Map(qt.map((t) => [t, Math.log(1 + (n - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5))]));
    const scored = [];
    for (const p of P) {
      let s = 0, matched = 0;
      for (const t of qt) { const f = p.tf.get(t); if (!f) continue; matched++; s += idf.get(t) * (f * (k1 + 1)) / (f + k1 * (1 - b + b * p.len / avg)); }
      if (!s) continue;
      if (qt.length > 1) s *= 0.3 + 0.7 * Math.pow(matched / qt.length, 1.5);        // most of the question's words, not one of them many times
      if (explain) s *= p.kind === 'term' ? 0.55 : p.kind === 'notes' || p.kind === 'derivation' || p.kind === 'answer' ? 1.2 : 1;
      else if (define && p.kind === 'term') s *= 1.3;
      let tb = 0; qt.forEach((t) => { if (p.titleToks.has(t)) tb++; }); s *= 1 + 0.35 * (tb / qt.length);
      for (let i = 0; i + 1 < qt.length; i++) { const a = p.toks.indexOf(qt[i]); if (a >= 0 && p.toks[a + 1] === qt[i + 1]) s *= 1.15; }
      if (p.kind === 'term' && p.term && words(p.term, false).every((t) => qt.includes(t))) s *= 1.5;
      scored.push([s * (KIND_W[p.kind] || 1), p, matched]);
    }
    scored.sort((a, c) => c[0] - a[0]);
    const out = [], per = new Map();
    for (const [s, p, m] of scored) { const k = per.get(p.id) || 0; if (k >= 2) continue; per.set(p.id, k + 1); out.push({ s, p, cover: m / qt.length }); if (out.length >= 7) break; }
    /* a direct answer needs most of the question's words in one passage */
    const sure = !!out.length && (qt.length < 2 || out[0].cover >= 0.6);
    return { hits: out, q: qt, sure };
  }

  /* ---------- the panel ---------- */
  const KIND = { notes: 'From the notes', derivation: 'From a derivation', term: 'Key term', equation: 'Equation', method: 'Method', worked: 'Worked problem', answer: 'In words' };
  const EXAMPLES = ['Why don’t heavier objects fall faster?', 'What keeps the planets in orbit?', 'How does a transformer change the voltage?', 'What makes a wave stationary?', 'What is half-life?'];
  function snippet(text, qt, max = 260) {
    const sents = String(text).split(/(?<=[.!?])\s+/);
    let best = 0, bi = 0;
    sents.forEach((s, i) => { const w = words(s, false); const sc = w.filter((t) => qt.includes(t)).length + (i === 0 ? 0.2 : 0); if (sc > best) { best = sc; bi = i; } });
    let out = sents[bi] || ''; let j = bi + 1;
    while (j < sents.length && (out + ' ' + sents[j]).length <= max) out += ' ' + sents[j++];
    if (out.length < 90 && bi > 0) out = sents[bi - 1] + ' ' + out;
    return out.length > max + 40 ? out.slice(0, max) + '…' : out;
  }
  function mark(root, qt) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (nd) => (nd.parentNode.closest('mjx-container, mark, .ta-kind, .ta-go') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((nd) => {
      const parts = nd.nodeValue.split(/([A-Za-z]+)/); if (parts.length < 2) return;
      let any = false; const frag = document.createDocumentFragment();
      parts.forEach((part) => { if (/^[A-Za-z]+$/.test(part) && qt.includes(stem(part.toLowerCase())) && !STOP.has(part.toLowerCase())) { const m = document.createElement('mark'); m.textContent = part; frag.appendChild(m); any = true; } else frag.appendChild(document.createTextNode(part)); });
      if (any) nd.parentNode.replaceChild(frag, nd);
    });
  }
  const pr = (s) => (WL.app && WL.app.h && WL.app.h.pr ? WL.app.h.pr(s) : esc(s));
  function card(h, qt, best) {
    const p = h.p, N = WL.app.nodes, n = N[p.id], st = (WL.app.TR[n.track] || {}).stages || [], stage = (st.find((x) => x.id === n.stage) || {}).short || '';
    let body;
    if (p.kind === 'derivation') body = `${p.say ? `<p class="ta-say">${pr(p.say)}</p>` : ''}${p.tex ? `<div class="ta-tex">\\[${esc(p.tex)}\\]</div>` : ''}${p.why ? `<p class="ta-why"><b>Why?</b> ${pr(snippet(p.why, qt, 320))}</p>` : ''}`;
    else if (p.kind === 'equation') body = `<div class="ta-tex">\\[${esc(p.tex)}\\]</div><p>${pr(p.text)}</p>`;
    else if (p.kind === 'worked') body = `<p class="ta-q">${pr(p.q)}</p><p class="ta-a">Answer: ${pr(p.a)}</p>`;
    else if (p.kind === 'answer') body = `<p class="ta-q">${pr(p.q)}</p><p>${pr(snippet(p.a, qt, 320))}</p>`;
    else body = `<p>${pr(snippet(p.text, qt, best ? 380 : 260))}</p>`;
    return `<article class="ta-card${best ? ' best' : ''}"><p class="ta-kind"><span>${KIND[p.kind] || 'From the course'}</span> ${esc(n.title)}${stage ? ` <small>${esc(stage)}</small>` : ''}${p.where && p.kind !== 'term' ? ` <small>· ${esc(p.where)}</small>` : ''}</p>
      <div class="ta-body">${body}</div><a class="ta-go" href="#t-${esc(p.id)}" data-ta-go>Open the lesson</a></article>`;
  }
  let panel = null, lastQ = '';
  function ensure() {
    if (panel) return panel;
    panel = document.createElement('div'); panel.className = 'ta-overlay'; panel.id = 'tw-ask'; panel.hidden = true;
    panel.innerHTML = `<div class="ta-panel" role="dialog" aria-modal="true" aria-labelledby="ta-h">
      <div class="ta-top"><h2 id="ta-h">Ask Twistor</h2><button type="button" class="hbtn ta-x" data-ta-close aria-label="Close"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button></div>
      <form class="ta-form" autocomplete="off"><input id="ta-in" type="search" placeholder="Ask a question about physics or maths" aria-label="Your question" spellcheck="true"><button class="btn primary" type="submit">Ask</button></form>
      <div class="ta-out" id="ta-out" aria-live="polite"></div>
      <p class="ta-foot">Answers come from Twistor’s own lessons: notes, derivations, equation sheets, the glossary and worked problems. Nothing is made up, and nothing you type leaves this page.</p>
    </div>`;
    document.body.appendChild(panel);
    panel.addEventListener('click', (e) => {
      if (e.target === panel || e.target.closest('[data-ta-close]')) { close(); return; }
      const ex = e.target.closest('[data-ta-ex]'); if (ex) { $('#ta-in').value = ex.textContent; run(ex.textContent); return; }
      if (e.target.closest('[data-ta-go]')) close(true);
    });
    panel.querySelector('.ta-form').addEventListener('submit', (e) => { e.preventDefault(); run($('#ta-in').value); });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
    return panel;
  }
  function empty() {
    $('#ta-out').innerHTML = `<p class="ta-hint">Ask in your own words. Try one of these:</p><div class="ta-ex">${EXAMPLES.map((x) => `<button type="button" data-ta-ex>${esc(x)}</button>`).join('')}</div>`;
  }
  function run(q) {
    q = String(q || '').trim(); const out = $('#ta-out'); if (!q) { empty(); return; }
    lastQ = q;
    const t0 = performance.now(), r = search(q), ms = Math.round(performance.now() - t0);
    if (!r.hits.length) { out.innerHTML = `<p class="ta-none">Nothing in the course matches “${esc(q)}”. Try the key words of the topic, for example “refraction” or “half-life”, or look it up in the <a href="#glossary" data-ta-go>glossary</a>.</p>`; return; }
    if (!r.sure) {
      const best = r.hits[0].s, near = [...new Set(r.hits.filter((h) => h.s >= best * 0.75).map((h) => h.p.id))].slice(0, 3), N = WL.app.nodes;
      out.innerHTML = `<p class="ta-none">The lessons do not answer “${esc(q)}” directly, and Twistor does not guess. ${near.length === 1 ? 'The nearest lesson is:' : 'The nearest lessons are:'}</p><div class="ta-ex">${near.map((id) => `<a class="ta-near" href="#t-${esc(id)}" data-ta-go>${esc(N[id].title)}</a>`).join('')}</div><p class="ta-hint">Or ask with the words the topic uses, for example “refraction” or “half-life”, or look in the <a href="#glossary" data-ta-go>glossary</a>.</p>`;
      return;
    }
    const top = r.hits[0].s, good = r.hits.filter((h) => h.s >= top * 0.42);
    out.innerHTML = `<p class="ta-meta">${good.length === 1 ? 'The best match' : `The ${good.length} best matches`} in ${IDX.n.toLocaleString()} passages, found in ${ms} ms.</p>` + good.map((h, i) => card(h, r.q, i === 0)).join('');
    mark(out, r.q);
    if (WL.app && WL.app.h && WL.app.h.typeset) WL.app.h.typeset(out);
  }
  let prevFocus = null;
  function open(q) {
    ensure(); prevFocus = document.activeElement;
    panel.hidden = false; document.documentElement.classList.add('ta-open');
    requestAnimationFrame(() => panel.classList.add('on'));
    const i = $('#ta-in'); if (q != null) { i.value = q; run(q); } else if (!lastQ) empty();
    setTimeout(() => { i.focus(); i.select(); }, 60);
  }
  function close(nav) {
    if (!panel || panel.hidden) return;
    panel.classList.remove('on'); document.documentElement.classList.remove('ta-open');
    setTimeout(() => { panel.hidden = true; }, 220);
    if (!nav && prevFocus && prevFocus.focus) prevFocus.focus();
  }
  WL.ask = { open, close, search, build: () => (IDX = build()) };
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#tw-ask-open')) { e.preventDefault(); open(); } });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); if (panel && !panel.hidden) close(); else open(); }
  });
})();
