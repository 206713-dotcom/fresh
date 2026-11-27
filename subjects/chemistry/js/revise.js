/* Quilio: your record, the welcome-back revision window, and "More example questions".
   - Record (#record): every lecture you spend time on, answer a question in, or mark as done is saved in this browser.
   - Welcome back: on your next visit, a window asks a few questions on what you studied before. Nothing behind it can be
     clicked until it is closed with the × button. (The Periodic Table tab stays in reach, because the questions need it.)
   - More example questions: under a lecture's questions, one button lays out past paper questions, the rest of the
     topic's questions and Level Test questions.
   Nothing leaves the browser: the record lives in localStorage under "gc.rec". */
(function () {
  'use strict';
  const GC = window.GC; if (!GC || !GC.stageData || !GC.num) return;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = GC.esc, il = s => GC.inline(s), store = GC.store, view = $('#view'), html = document.documentElement;
  const plural = GC.plural || ((n, w) => `${n} ${w}${n === 1 ? '' : 's'}`);
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
  const KEY = 'gc.rec', LV = { 1: 'Entry', 2: 'Intermediate', 3: 'Advanced' };
  const dayOf = t => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const hue = L => `--hue:var(--${L.stage.id})`;

  /* ================= the record ================= */
  // R.L[lecture id] = { a: first time, t: last time, n: visits, s: seconds spent, q: { question key: [last answer right? 1/0, tries, time] } }
  function read() { const r = store.get(KEY, null); return r && r.v === 1 && r.L ? r : { v: 1, L: {}, days: [] }; }
  let R = read();
  const BEFORE = new Set(Object.keys(R.L));   // what had been studied before this visit began
  const save = () => store.set(KEY, R);
  function touch(id, visit) {
    const t = Date.now(); let e = R.L[id]; if (!e) e = R.L[id] = { a: t, t, n: 0, s: 0, q: {} };
    e.t = t; if (visit) e.n++; const d = dayOf(t); if (R.days[R.days.length - 1] !== d) { R.days.push(d); if (R.days.length > 400) R.days.shift(); }
    return e;
  }
  // a lecture counts as studied after ten seconds on it, or as soon as a question is answered or it is marked as done
  let cur = null, lastAct = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'pointermove'].forEach(ev => window.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true, capture: true }));
  function count() { if (!cur || cur.counted) return; cur.counted = true; const e = touch(cur.id, true); e.s += cur.sec; save(); }
  setInterval(() => {
    if (!cur || document.hidden || M || Date.now() - lastAct > 120000) return;
    cur.sec += 5; if (!cur.counted) { if (cur.sec >= 10) count(); } else { touch(cur.id).s += 5; save(); }
  }, 5000);
  function answer(id, key, ok) {
    if (cur && cur.id === id) count(); const e = touch(id), p = e.q[key] || [0, 0, 0];
    e.q[key] = [ok ? 1 : 0, p[1] + 1, Date.now()]; save();
  }
  window.addEventListener('gc-view', () => {
    const c = GC.cur(); cur = c ? { id: c.L.id, sec: 0, counted: false } : null;
    if (c) setTimeout(() => addMore(c.L), 0);
  });
  // answers in a lecture's own questions: app.js marks them, and this reads the result off the page afterwards
  view.addEventListener('click', e => {
    const c = GC.cur(); if (!c) return;
    if (e.target.closest('[data-act="done"]')) { count(); return; }
    const el = e.target.closest('.quiz .q'); if (!el || el.dataset.src) return; const fb = $('.fb', el); if (!fb || fb.hidden) return;
    const k = el.dataset.k, act = e.target.closest('[data-act]'), hasOk = fb.classList.contains('ok'), hasNo = fb.classList.contains('no'); let ok = null;
    if (k === 'c' && e.target.closest('[data-o]')) ok = hasOk;
    else if (k === 'n' && act && act.dataset.act === 'check' && (hasOk || hasNo)) ok = hasOk;
    else if (k === 'q' && act && act.dataset.act === 'mark' && $('textarea', el).value.trim()) ok = hasOk;
    if (ok !== null) answer(c.L.id, k + el.dataset.i, ok);
  });

  /* ================= question cards (used by the window and by "More example questions") ================= */
  const REG = new Map(), PP = new Map();
  const itemsOf = (L, rec) => { const out = []; if (!rec) return out; rec.c.forEach((q, i) => out.push({ src: L.id, k: 'c', i, q })); rec.n.forEach((q, i) => out.push({ src: L.id, k: 'n', i, q })); rec.q.forEach((q, i) => out.push({ src: L.id, k: 'q', i, q })); return out; };
  const ltItems = () => ((window.LevelTest || {}).Q || []).map((q, i) => ({ src: q.lec, k: 'lt', i, q })).filter(x => GC.BY[x.src]);
  function card(it, tag) {
    const L = GC.BY[it.src], q = it.q, mc = it.k === 'c' || (it.k === 'lt' && q.o), marks = it.k === 'n' || it.k === 'q' ? q.k : 1;
    REG.set(it.src + '|' + it.k + '|' + it.i, it);
    const src = `<a class="q-src" href="#${L.id}" style="${hue(L)}">${tag ? `<b>${esc(tag)}</b>` : ''}${L.stage.label} ${L.code} · ${esc(L.title)}</a>`;
    const body = mc ? `<div class="opts">${q.o.map((o, k) => `<button type="button" data-o="${k}">${il(o)}</button>`).join('')}</div>`
      : it.k === 'q' ? `<textarea aria-label="Your answer" placeholder="Write your answer, then have it marked."></textarea><div class="q-in"><button type="button" class="btn small" data-rv="mark">Mark my answer</button><button type="button" class="chip" data-rv="model">Show mark scheme</button></div>`
        : `<div class="q-in"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer, as a number" placeholder="your answer${q.u ? ' in ' + esc(q.u) : ''}"><button type="button" class="btn small" data-rv="check">Check</button><button type="button" class="chip" data-rv="work">Show working</button></div>`;
    return `<div class="q xq" data-src="${it.src}" data-k="${it.k}" data-i="${it.i}">${src}<div class="q-top"><p>${il(q.q)}</p><i>${plural(marks, 'mark')}</i></div>${body}<div class="fb" hidden></div></div>`;
  }
  function reward(it, amount, label) { try { if (window.FreshPoints && it.k !== 'lt') void window.FreshPoints.earn('Chemistry', amount, label, 'practice:' + it.src + ':' + it.k + ':' + it.i); } catch (e) { } }
  function onCard(e) {
    const el = e.target.closest('.q[data-src]'), it = REG.get(el.dataset.src + '|' + el.dataset.k + '|' + el.dataset.i); if (!it) return;
    const q = it.q, fb = $('.fb', el), o = e.target.closest('[data-o]'), act = e.target.closest('[data-rv]'), a = act && act.dataset.rv;
    const show = (cls, h) => { fb.hidden = false; fb.className = 'fb' + (cls ? ' ' + cls : ''); fb.innerHTML = h; };
    let ok = null, seen = false;
    if (o && !o.disabled) {
      const pick = +o.dataset.o; ok = pick === q.a; $$('.opts button', el).forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('is-right'); else if (k === pick) b.classList.add('is-wrong'); });
      show(ok ? 'ok' : 'no', `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${il(it.k === 'lt' ? q.w : q.y)}`); if (ok) reward(it, 3, 'Correct quiz answer');
    } else if (a && it.k === 'n') {
      const steps = `<ol class="steps">${q.st.map(s => `<li>${il(s.replace(/^[A-Z]\d\s+/, ''))}</li>`).join('')}</ol>`;
      if (a === 'work') { show('', `<b>Working</b>${steps}<b>Answer: ${esc(q.a[0])}</b>`); seen = true; }
      else { const u = GC.num($('input', el).value); if (isNaN(u)) show('', 'Type a number first, for example 0.25 or 2.4 × 10^3.'); else { ok = q.a.some(x => { const v = GC.num(x); return Math.abs(u - v) <= Math.abs(v) * 0.011 + 1e-12; }); show(ok ? 'ok' : 'no', ok ? `<b>Correct: ${esc(q.a[0])}.</b> ${plural(q.k, 'mark')}.${steps}` : '<b>Not yet.</b> Check your working and the sign, then try again, or press Show working.'); if (ok) reward(it, 5, 'Calculation solved'); } }
    } else if (a && it.k === 'lt') {
      const ans = `<b>Answer: ${esc(String(q.a))}${q.u ? ' ' + esc(q.u) : ''}.</b> ${il(q.w)}`;
      if (a === 'work') { show('', ans); seen = true; }
      else { const v = $('input', el).value; if (isNaN(GC.num(v))) show('', 'Type a number first.'); else { ok = window.LevelTest.isRight(q, v); show(ok ? 'ok' : 'no', ok ? `<b>Correct.</b> ${il(q.w)}` : '<b>Not yet.</b> Try again, or press Show working.'); } }
    } else if (a && it.k === 'q') {
      const txt = $('textarea', el).value.trim(), model = `<p style="margin-top:8px"><b>Model answer.</b> ${il(q.a)}</p>`;
      if (a === 'model' || !txt) { show('', `<b>Mark scheme${q.p.length > q.k ? `: any ${q.k} from` : ''}</b><ul class="pts">${q.p.map(p => `<li>${il(p[0])}</li>`).join('')}</ul>${model}`); seen = true; }
      else { const t = GC.norm(txt), hits = q.p.map(p => GC.hit(t, p[1])), score = Math.min(q.k, hits.filter(Boolean).length); ok = score === q.k;
        show(ok ? 'ok' : score ? '' : 'no', `<b>${score} out of ${q.k}.</b>${q.p.length > q.k ? ` Any ${q.k} of these points score.` : ''}<ul class="pts">${q.p.map((p, k) => `<li class="${hits[k] ? 'hit' : 'miss'}">${il(p[0])}</li>`).join('')}</ul>${model}<p style="margin-top:6px;color:var(--ink-3);font-size:14px">Marked by looking for key words, so check your answer against the model as well.</p>`); if (score > 0) reward(it, 10, 'Written practice marked'); }
    }
    if (ok !== null) { answer(it.src, it.k + it.i, ok); el.dataset.res = ok ? '1' : '0'; } else if (seen && !el.dataset.res) el.dataset.res = 's';
    if (ok !== null || seen) el.dispatchEvent(new CustomEvent('rv-answer', { bubbles: true }));
  }
  // in the capture phase, so that app.js (which would mark the card against the open lecture) never sees these clicks
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.q[data-src]')) { e.stopPropagation(); onCard(e); } }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('.q[data-src] input')) { e.preventDefault(); const b = $('[data-rv="check"]', e.target.closest('.q')); if (b) b.click(); } });

  /* ================= choosing questions to revise ================= */
  async function build(ids, n) {
    const Ls = ids.map(id => GC.BY[id]).filter(Boolean); if (!Ls.length) return [];
    const G = {}; await Promise.all([...new Set(Ls.map(L => L.stage))].map(S => GC.stageData(S).then(g => { G[S.id] = g; })));
    const lt = ltItems(), used = new Set();
    // wrong last time first, then never tried, then right last time; quick questions before long ones
    const rank = it => { const p = ((R.L[it.src] || {}).q || {})[it.k + it.i]; return (p ? (p[0] ? 1 : 3) : 2) + (it.k === 'c' ? .6 : it.k === 'lt' ? .5 : it.k === 'n' ? .4 : 0) + Math.random() * .5; };
    const pools = Ls.map(L => {
      let p = itemsOf(L, G[L.stage.id][L.id]).concat(lt.filter(x => x.src === L.id));
      if (!p.length) L.topic.lectures.forEach(l => { if (l !== L) p = p.concat(itemsOf(l, G[L.stage.id][l.id])); });
      return p.map(it => [rank(it), it]).sort((a, b) => b[0] - a[0]).map(x => x[1]);
    });
    const out = []; let moved = true;
    while (out.length < n && moved) { moved = false; for (const p of pools) { while (p.length && used.has(p[0].src + p[0].k + p[0].i)) p.shift(); if (p.length && out.length < n) { const it = p.shift(); used.add(it.src + it.k + it.i); out.push(it); moved = true; } } }
    return out;
  }

  /* ================= the revision window ================= */
  let M = null;
  function openWindow(items, o) {
    if (M || !items.length) return;
    const Ls = [...new Set(items.map(it => it.src))].map(id => GC.BY[id]);
    const d = document.createElement('div'); d.className = 'rv';
    d.innerHTML = `<div class="rv-card" role="dialog" aria-modal="true" aria-labelledby="rvH" tabindex="-1">
      <header class="rv-head"><p class="rv-kick">${esc(o.kick)}</p><h2 id="rvH">${o.title}</h2><p class="rv-sub">${esc(o.sub)}</p><div class="rv-from">${Ls.map(L => `<span>${L.stage.label} ${L.code} · ${esc(L.title)}</span>`).join('')}</div>
        <button type="button" class="rv-x" aria-label="Close the revision questions">×</button></header>
      <div class="rv-body"><div class="quiz">${items.map(it => card(it)).join('')}</div><div class="rv-end" hidden></div></div>
      <footer class="rv-foot"><span class="rv-score" aria-live="polite"></span><span class="rv-hint">Press <b>×</b> to close</span></footer></div>`;
    const held = []; [...document.body.children].forEach(c => { if (!c.matches('.qpt, .qpt-tab, script, style') && !c.inert) { c.inert = true; held.push(c); } });
    document.body.appendChild(d); html.classList.add('rv-on');
    const prev = document.activeElement, x = $('.rv-x', d), cardEl = $('.rv-card', d);
    const tally = () => {
      const qs = $$('.q', d), done = qs.filter(q => q.dataset.res), right = qs.filter(q => q.dataset.res === '1');
      $('.rv-score', d).innerHTML = `<b>${done.length}</b> of ${qs.length} answered · <b>${right.length}</b> correct`;
      if (done.length === qs.length) {
        const miss = [...new Set(qs.filter(q => q.dataset.res !== '1').map(q => q.dataset.src))].map(id => GC.BY[id]), end = $('.rv-end', d), all = right.length === qs.length;
        end.hidden = false; end.innerHTML = `<p class="rv-end-big">${right.length} out of ${qs.length}</p><p>${all ? 'All correct. It has stuck.' : right.length >= qs.length / 2 ? 'Most of it has stuck.' : 'This needs another look.'}${miss.length ? ' Worth reading again: ' + miss.map(L => `<a href="#${L.id}">${L.stage.label} ${L.code} ${esc(L.title)}</a>`).join(', ') + '.' : ''}</p><p class="rv-end-x">Press × at the top to carry on.</p>`;
        x.classList.add('is-go');
      }
    };
    const close = () => {
      if (!M) return; M = null; d.classList.remove('in'); html.classList.remove('rv-on'); held.forEach(c => { c.inert = false; }); window.removeEventListener('hashchange', close);
      setTimeout(() => d.remove(), 260); R.pop = Date.now(); save(); try { if (prev && prev.focus && prev.isConnected) prev.focus({ preventScroll: true }); } catch (e) { }
      if (location.hash === '#record') page(view);
    };
    d.addEventListener('rv-answer', tally); x.addEventListener('click', close);
    // a click on the dimmed background does nothing except point at the ×
    d.addEventListener('pointerdown', e => { if (e.target === d) { x.classList.remove('nudge'); void x.offsetWidth; x.classList.add('nudge'); } });
    window.addEventListener('hashchange', close);   // a link inside the window was followed
    M = { close }; tally(); requestAnimationFrame(() => { d.classList.add('in'); try { cardEl.focus({ preventScroll: true }); } catch (e) { } });
  }
  const recent = (ids, n) => { const s = ids.filter(id => GC.BY[id] && R.L[id]).sort((a, b) => R.L[b].t - R.L[a].t), out = s.slice(0, n); if (s.length > n) out.push(s[n + (Math.random() * (s.length - n) | 0)]); return out; };

  // the next visit: once per browser session, after the entrance film, if anything was studied before
  let tried = false;
  async function welcome() {
    if (tried || M || !GC.IDX) return; const loading = document.getElementById('science-loading'), h = location.hash.slice(1);
    if (html.classList.contains('intro') || (window.GCIntro && window.GCIntro.playing) || (loading && !loading.hidden) || $('.lt-pop') || h === 'level-test' || h === 'record') return;
    tried = true; let seen = false; try { seen = sessionStorage.getItem('gc.rv') === '1'; sessionStorage.setItem('gc.rv', '1'); } catch (e) { }
    const ids = recent([...BEFORE], 3); if (seen || !ids.length) return;
    html.classList.add('rv-pending');
    try {
      const items = await build(ids, 5); if (!items.length) return;
      if (html.classList.contains('intro') || $('.lt-pop')) return;
      openWindow(items, { kick: 'Welcome back', title: 'Do you still <b>remember</b> this?', sub: `${plural(items.length, 'quick question')} on what you studied last time. Answer them before you carry on.` });
    } catch (e) { } finally { html.classList.remove('rv-pending'); }
  }
  const later = ms => setTimeout(welcome, ms);
  window.addEventListener('gc-intro-done', () => later(700)); window.addEventListener('fresh-science-ready', () => later(900)); window.addEventListener('gc-view', () => later(900)); later(1300);
  async function reviseNow(ids, sub) {
    const items = await build(ids, 5);
    if (items.length) openWindow(items, { kick: 'Revision', title: 'Quick <b>revision</b>', sub: sub || `${plural(items.length, 'question')} from your record.` });
    return items.length;
  }

  /* ================= the record page ================= */
  function page(v) {
    document.title = 'Your record · Quilio';
    const ids = Object.keys(R.L).filter(id => GC.BY[id]).sort((a, b) => R.L[b].t - R.L[a].t);
    let asked = 0, right = 0, secs = 0; ids.forEach(id => { const e = R.L[id]; secs += e.s; Object.values(e.q).forEach(p => { asked++; if (p[0]) right++; }); });
    const days = new Set(R.days), today = dayOf(Date.now()); let streak = 0, t = Date.now(); if (!days.has(today)) t -= 864e5; while (days.has(dayOf(t))) { streak++; t -= 864e5; }
    const mins = s => s < 60 ? 'under 1 min' : Math.round(s / 60) + ' min';
    const label = d => d === today ? 'Today' : d === dayOf(Date.now() - 864e5) ? 'Yesterday' : new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const groups = []; ids.forEach(id => { const d = dayOf(R.L[id].t); let g = groups[groups.length - 1]; if (!g || g.d !== d) groups.push(g = { d, ids: [] }); g.ids.push(id); });
    const row = id => {
      const L = GC.BY[id], e = R.L[id], qs = Object.values(e.q), ok = qs.filter(p => p[0]).length, isDone = GC.done.has(id);
      return `<div class="rec-row panel" style="${hue(L)}"><a class="rec-main" href="#${id}"><span class="tag">${L.stage.label} ${L.code}</span><b>${esc(L.title)}</b><small>Topic ${L.topic.n} · ${esc(L.topic.title)}</small></a>
        <div class="rec-nums"><span>${e.n ? mins(e.s) : 'practised'}</span><span>${qs.length ? `${ok} of ${qs.length} correct` : 'no questions yet'}</span>${e.n > 1 ? `<span>${e.n} visits</span>` : ''}${isDone ? '<span class="rec-done">Done ✓</span>' : ''}</div>
        <button type="button" class="chip" data-rv="revise" data-id="${id}">Revise</button></div>`;
    };
    v.innerHTML = `<div class="page rec"><nav class="crumbs" aria-label="Breadcrumb"><a href="#chemistry">Chemistry</a><span>Your record</span></nav>
      <header class="page-head"><p class="kicker">Saved in this browser only</p><h1>Your record</h1><p>Every lecture you study is saved here. The next time you open Quilio, it asks you a few questions on what you studied last time.</p></header>
      ${ids.length ? `<div class="rec-stats"><div class="panel"><b>${ids.length}</b><span>${ids.length === 1 ? 'lecture' : 'lectures'} studied</span></div><div class="panel"><b>${asked}</b><span>${asked === 1 ? 'question' : 'questions'} answered</span></div><div class="panel"><b>${asked ? Math.round(right / asked * 100) + '%' : '–'}</b><span>correct, last try</span></div><div class="panel"><b>${streak}</b><span>${streak === 1 ? 'day' : 'days'} in a row</span></div><div class="panel"><b>${secs < 3600 ? Math.round(secs / 60) : (secs / 3600).toFixed(1)}</b><span>${secs < 3600 ? 'minutes' : 'hours'} of study</span></div></div>
      <div class="rec-go"><button type="button" class="btn" data-rv="revise-all">Revise now ${ARROW}</button><span>Five questions from what you studied most recently.</span></div>
      ${groups.map(g => `<section class="rec-day"><h2>${label(g.d)}</h2>${g.ids.map(row).join('')}</section>`).join('')}
      <div class="rec-clear"><button type="button" class="chip" data-rv="clear">Clear my record</button></div>`
      : `<div class="panel rec-empty"><h2>Nothing here yet</h2><p>Open any lecture. Once you have spent a little time on it, answered a question or marked it as done, it is saved here.</p><a class="btn" href="#chemistry">Go to the lectures ${ARROW}</a></div>`}</div>`;
  }
  view.addEventListener('click', async e => {
    const b = e.target.closest('[data-rv]'); if (!b || b.closest('.q[data-src]')) return; const a = b.dataset.rv;
    if (a === 'revise-all') { if (!(await reviseNow(recent(Object.keys(R.L), 3)))) b.nextElementSibling.textContent = 'There are no questions for these lectures yet.'; }
    else if (a === 'revise') { const L = GC.BY[b.dataset.id]; if (!(await reviseNow([L.id], `Questions on ${L.stage.label} ${L.code}, ${L.title}.`))) b.textContent = 'No questions'; }
    else if (a === 'clear') { if (b.dataset.sure) { R = { v: 1, L: {}, days: [] }; BEFORE.clear(); save(); page(view); } else { b.dataset.sure = '1'; b.textContent = 'Press again to clear everything'; b.classList.add('is-warn'); setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.textContent = 'Clear my record'; b.classList.remove('is-warn'); } }, 4000); } }
    else if (a === 'more') toggleMore(b);
    else if (a === 'pp-h' || a === 'pp-w') { const li = b.closest('li'), p = (PP.get(b.closest('.pp').dataset.pp) || { p: [] }).p[+b.dataset.k], fb = $('.fb', li); if (!p) return; const on = fb.dataset.on === a; fb.hidden = on; fb.dataset.on = on ? '' : a; fb.className = 'fb' + (a === 'pp-w' ? ' ok' : ''); fb.innerHTML = a === 'pp-h' ? `<b>Hint.</b> ${il(p.h)}` : `<b>Answer.</b> ${il(p.w)}`; }
  });

  /* ================= More example questions ================= */
  const fam = d => !d ? '' : d.startsWith('org') ? 'org' : d.startsWith('inorg') ? 'inorg' : d;
  let MORE = null;
  async function addMore(L) {
    const body = $('#lectBody'); if (!body || $('.more-q', body)) return; const at = $('.done-row', body); if (!at) return;
    const sec = document.createElement('section'); sec.className = 'more-q';
    sec.innerHTML = `<button type="button" class="more-btn" data-rv="more" aria-expanded="false" aria-controls="moreList"><span class="more-kick">Want more practice?</span><span class="more-big">More example <b>questions</b></span><span class="more-meta">Finding questions…</span><span class="more-go">${DOWN}</span></button><div class="more-list" id="moreList" hidden></div>`;
    at.parentNode.insertBefore(sec, at); MORE = null;
    let pool; try { pool = await gather(L); } catch (e) { pool = null; }
    const c = GC.cur(); if (!c || c.L !== L || !sec.isConnected) return;
    if (!pool || !pool.total) { sec.remove(); return; }
    MORE = pool; $('.more-meta', sec).innerHTML = `<b>${pool.total}</b> more ${pool.total === 1 ? 'question' : 'questions'} · ${pool.groups.map(g => g.short).filter(Boolean).map(esc).join(' · ')}`;
  }
  async function gather(L) {
    const T = L.topic, S = L.stage, f = fam(T.domain), G = {}; G[S.id] = await GC.stageData(S);
    const sibs = T.lectures.filter(l => l !== L), kin = GC.ALL.filter(l => l.topic !== T && fam(l.topic.domain) === f);
    await Promise.all([...new Set(kin.map(l => l.stage))].map(s => GC.stageData(s).then(g => { G[s.id] = g; }).catch(() => { })));
    const all = []; (window.OLY_PAST || []).forEach(P => P.qs.forEach(q => { if (q.s && q.p && q.p.length) all.push({ P, q }); }));
    const byLv = (a, b) => a.q.lv - b.q.lv || b.P.y - a.P.y;
    const direct = all.filter(x => (x.q.lec || []).includes(L.id)).sort(byLv).slice(0, 6);
    const near = new Set(sibs.concat(kin).map(l => l.id));
    const stretch = direct.length >= 3 ? [] : all.filter(x => !direct.includes(x) && (x.q.lec || []).some(id => near.has(id))).sort(byLv).slice(0, 3);
    const topic = sibs.flatMap(l => itemsOf(l, G[S.id][l.id])).slice(0, 24);
    const order = ['ks3', 'igcse', 'as', 'a2'], dist = l => Math.abs(order.indexOf(l.stage.id) - order.indexOf(S.id));
    const other = kin.slice().sort((a, b) => dist(a) - dist(b)).flatMap(l => itemsOf(l, (G[l.stage.id] || {})[l.id]).slice(0, 2)).slice(0, Math.max(6, 16 - topic.length));
    const ids = new Set([L.id].concat(sibs.map(l => l.id))), lt = ltItems().filter(x => ids.has(x.src)).slice(0, 5);
    const groups = [];
    if (direct.length) groups.push({ short: 'past papers', h: 'From past papers', sub: 'Real olympiad questions on this lecture, remade with new numbers. Easiest first.', pp: direct });
    if (topic.length) groups.push({ short: 'this topic', h: `More from Topic ${T.n}: ${T.title}`, sub: 'Exam-style questions from the other lectures in this topic, marked here on your device.', q: topic });
    if (lt.length) groups.push({ short: 'Level Test', h: 'Level Test questions', sub: 'The Level Test questions that check this topic.', q: lt });
    if (other.length) groups.push({ short: 'other levels', h: 'The same idea at other levels', sub: 'The same chemistry asked at the stages before and after this one.', q: other });
    if (stretch.length) groups.push({ short: 'past papers', h: direct.length ? 'More past papers on this theme' : 'Stretch: past papers on this theme', sub: 'Olympiad questions that build on this chemistry. Harder than this lecture: use the hints.', pp: stretch });
    const seen = new Set(); groups.forEach(g => { g.short = seen.has(g.short) ? '' : (seen.add(g.short), g.short); });
    return { total: groups.reduce((n, g) => n + (g.pp || g.q).length, 0), groups };
  }
  function ppCard(x) {
    const { P, q } = x, show = q.p.slice(0, 4); PP.set(q.id, q);
    return `<article class="pp panel" data-pp="${q.id}"><header><span class="pp-comp">${esc(P.comp)} · ${P.y}${P.round ? ' · ' + esc(P.round) : ''}</span><span class="ol-lv l${q.lv}">${LV[q.lv] || ''}</span></header><h4>Question ${q.n}: ${esc(q.t)}</h4><div class="pp-stem">${il(q.s)}</div>
      <ol class="pp-parts">${show.map((p, k) => `<li><p>${il(p.q)}</p><div class="pp-tools">${p.h ? `<button type="button" class="chip" data-rv="pp-h" data-k="${k}">Hint</button>` : ''}<button type="button" class="chip" data-rv="pp-w" data-k="${k}">Answer</button></div><div class="fb" hidden></div></li>`).join('')}</ol>
      <a class="pp-open" href="#olympiad-p-${q.id}">${q.p.length > show.length ? `${plural(q.p.length - show.length, 'more part')} in the full question` : 'Open the full question'}, with answer checking ${ARROW}</a></article>`;
  }
  function toggleMore(btn) {
    const list = $('#moreList'); if (!MORE || !list) return; const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open)); btn.classList.toggle('is-open', open); $('.more-kick', btn).textContent = open ? 'Here they come' : 'Want more practice?';
    if (!open) { list.hidden = true; return; }
    let i = 0; const cas = h => h.replace(/^<(\w+) class="/, (m, tag) => `<${tag} style="--i:${i++}" class="cas `);
    list.innerHTML = MORE.groups.map(g => cas(`<div class="more-h"><h3>${esc(g.h)}</h3><p>${esc(g.sub)}</p></div>`) + (g.pp ? g.pp.map(x => cas(ppCard(x))).join('') : `<div class="quiz">${g.q.map(it => cas(card(it))).join('')}</div>`)).join('');
    list.hidden = false; const c = GC.cur(); if (c) { cur && cur.id === c.L.id && count(); }
    const top = list.getBoundingClientRect().top; if (top > innerHeight * .7) window.scrollBy({ top: top - innerHeight * .45, behavior: 'smooth' });
  }

  window.Revise = { page, open: ids => reviseNow(ids && ids.length ? ids : recent(Object.keys(R.L), 3)), welcome: () => { tried = false; try { sessionStorage.removeItem('gc.rv'); } catch (e) { } return welcome(); }, record: () => R };
})();
