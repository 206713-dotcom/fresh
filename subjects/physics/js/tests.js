/* Geodesic — the test builder.
   #test        choose topics you have learned, the number and kind of questions and a time limit, then sit a timed paper.
                Nothing is marked until you finish (or the time runs out). Then Einstein marks every answer, you get a score
                with a breakdown by topic, and each topic's spaced-review schedule moves: weak topics come back sooner.
   #test-<id>   a test you sat before. */
(function () {
  'use strict';
  const WL = (window.WL = window.WL || {});
  WL.tests = WL.tests || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const A = () => WL.app, H = () => WL.app.h;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pr = (s) => H().pr(String(s || '')), typeset = (el) => H().typeset(el);
  const ukey = () => { const a = WL.auth; return 'wl-tests' + (a && a.username && !a.isOwner ? ':' + a.username : ''); };
  const load = () => { try { return JSON.parse(localStorage.getItem(ukey()) || '{}') || {}; } catch (e) { return {}; } };
  const save = (o) => { try { localStorage.setItem(ukey(), JSON.stringify(o)); } catch (e) {} };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const mmss = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const KIND = { core: 'Short answer', exam: 'Exam style', prac: 'Practical' };
  let tick = 0;

  /* ---------- what can be asked about a topic ---------- */
  function pool(tid, withPrac) {
    const b = A().qbank(tid), out = [];
    b.core.forEach((c) => out.push({ k: `${tid}|c|${c.key}`, tid, kind: 'core', q: c.p.q, a: c.p.a || '', s: c.p.s || [], keys: c.p.k || [], marks: (c.p.l || 2) >= 2 ? 2 : 1, ans: WL.grade.kind(c.p) }));
    b.exam.forEach((x) => out.push({ k: `${tid}|x|${x.key}`, tid, kind: 'exam', q: x.q, a: x.a || '', pts: x.pts, marks: x.marks }));
    if (WL.qgen) {
      const C = WL.qgen.count(tid), seed = (Date.now() >>> 0) ^ (tid.length * 7919);
      for (let j = 0; j < Math.min(6, C.plain * 2); j++) { const p = WL.qgen.plain(tid, (seed + j * 104729) >>> 0); if (p) out.push({ k: `${tid}|g|${p.key}`, tid, kind: 'core', q: p.q, a: p.a || '', s: p.s || [], keys: [], marks: (p.l || 1) >= 2 ? 2 : 1, ans: 'numeric', gen: 1 }); }
      for (let j = 0; j < Math.min(3, C.exam * 3); j++) { const x = WL.qgen.exam(tid, (seed + j * 15485863) >>> 0); if (x) out.push({ k: `${tid}|gx|${x.key}`, tid, kind: 'exam', q: x.q, a: '', pts: x.pts, marks: x.marks, gen: 1 }); }
    }
    if (withPrac && WL.labs) WL.labs.bank().filter((q) => q.topics.includes(tid)).forEach((q) => out.push({ k: `${tid}|p|${q.key}`, tid, kind: 'prac', q: q.q, a: q.a, pts: q.pts, marks: q.m, prac: q.title }));
    return out;
  }
  function buildPaper(o) {
    const topics = shuffle(o.topics), pools = {}; topics.forEach((t) => { pools[t] = shuffle(pool(t, o.prac)); });
    const want = (it) => o.mix === 'mixed' || (o.mix === 'core' ? it.kind === 'core' : it.kind !== 'core');
    const items = (o.extra || []).slice(0, o.n); let guard = 0, turn = 0;
    while (items.length < o.n && guard++ < 5000) {
      const live = topics.filter((t) => pools[t].some(want)); if (!live.length) break;
      const t = live[turn++ % live.length], P = pools[t];
      // in a mixed paper alternate short answers and exam questions so each topic gets both
      let i = -1; if (o.mix === 'mixed') { const pref = items.filter((x) => x.tid === t).length % 2 ? 'exam' : 'core'; i = P.findIndex((x) => (pref === 'core' ? x.kind === 'core' : x.kind !== 'core')); }
      if (i < 0) i = P.findIndex(want); if (i < 0) continue;
      items.push(P.splice(i, 1)[0]);
    }
    // order: by topic order on the site, so the paper reads like a real one
    const order = [...A().TR.physics.order, ...A().TR.maths.order]; items.sort((a, b) => order.indexOf(a.tid) - order.indexOf(b.tid) || (a.kind === 'core' ? -1 : 1) - (b.kind === 'core' ? -1 : 1));
    const marks = items.reduce((s, x) => s + x.marks, 0);
    const exam = Math.ceil(items.reduce((s, x) => s + x.marks * A().MPM(x.tid), 0));
    const mins = o.time === 'exam' ? Math.max(5, exam) : o.time === 'none' ? 0 : Math.max(1, Math.min(300, +o.mins || exam));
    return { id: Date.now().toString(36), made: Date.now(), topics: [...new Set(items.map((x) => x.tid))], items, marks, mins, examMins: exam, state: 'ready', ans: {}, flag: {}, opts: o };
  }

  /* ---------- the builder ---------- */
  function topicPicker(sel) {
    const app = A(), nodes = app.nodes, LS = H().LS();
    const tracks = ['physics', 'maths'].map((tk) => {
      const tr = app.TR[tk], byStage = {};
      tr.order.forEach((id) => { const st = H().stageOf(id); (byStage[st.id] = byStage[st.id] || { st, ids: [] }).ids.push(id); });
      return `<section class="tbtrack"><h3>${esc(tr.name)}</h3>${Object.values(byStage).map(({ st, ids }) => {
        const n = ids.filter((id) => sel.has(id)).length, nq = ids.reduce((a, id) => a + (app.qbank(id).core.length + app.qbank(id).exam.length > 0 ? 1 : 0), 0);
        return `<details class="tbstage"${n ? ' open' : ''}><summary><span class="tbsn">${esc(st.name || st.short)}</span><small data-tcount="${esc(st.id)}|${tk}">${n ? `${n} of ${ids.length} chosen` : `${ids.length} topics`}</small></summary>
          <label class="tball"><input type="checkbox" data-tstage="${esc(st.id)}|${tk}"${n === ids.length ? ' checked' : ''}> Every topic in ${esc(st.short || st.name)}</label>
          <div class="tbtopics">${ids.map((id) => { const has = app.qbank(id); const q = has.core.length + has.exam.length; return `<label class="tbt${LS.u[id] ? ' known' : ''}${q ? '' : ' none'}" data-title="${esc(nodes[id].title.toLowerCase())}"><input type="checkbox" data-tt="${id}" data-stage="${esc(st.id)}|${tk}"${sel.has(id) ? ' checked' : ''}${q ? '' : ' disabled'}><span>${esc(nodes[id].title)}</span>${LS.u[id] ? '<i title="You marked this as understood">✓</i>' : ''}</label>`; }).join('')}</div></details>`;
      }).join('')}</section>`;
    });
    return tracks.join('');
  }
  function renderBuilder(view, msg) {
    const D = load(), LS = H().LS(), app = A();
    const learned = Object.keys(LS.u || {}).filter((id) => app.nodes[id]);
    const due = Object.keys(LS.r || {}).filter((id) => app.nodes[id] && LS.u[id] && LS.r[id].due <= Date.now());
    let pre = null; try { pre = JSON.parse(localStorage.getItem('wl-tb-pre') || 'null'); localStorage.removeItem('wl-tb-pre'); } catch (e) {}
    const o = Object.assign({ n: 10, mix: 'mixed', time: 'exam', mins: 30, prac: true, fresh: false }, D.opts || {}, pre ? { mix: pre.mix || 'exam', time: pre.time || 'exam', fresh: !!pre.fresh, n: 5 } : {});
    const sel = new Set(((pre && pre.topics) || (D.sel && D.sel.length ? D.sel : learned)).filter((id) => app.nodes[id]));
    const cur = D.cur && (D.cur.state === 'running' || D.cur.state === 'ready') ? D.cur : null;
    view.innerHTML = `<section class="tb">
      <header class="tbhead"><p class="prk">Test yourself</p><h1>Build a test</h1>
        <p class="prlead">Choose the topics you have learned, how many questions and how long. You sit it against the clock with no hints and no marking until the end, like the real thing. Afterwards you can review your saved answers alongside the worked solutions.</p></header>
      ${cur ? `<div class="tbresume"><p><b>${cur.state === 'running' ? 'You have a test in progress.' : 'Your last test is ready to start.'}</b> ${cur.items.length} questions, ${cur.marks} marks${cur.mins ? `, ${cur.mins} minutes` : ''}.</p><button type="button" class="btn primary" data-tgo="${cur.state === 'running' ? 'resume' : 'cover'}">${cur.state === 'running' ? 'Go back to it' : 'Open it'}</button><button type="button" class="btn ghost" data-tdiscard>Discard it</button></div>` : ''}
      ${msg ? `<p class="tbmsg">${esc(msg)}</p>` : ''}
      <div class="tbgrid">
        <div class="tbpick">
          <div class="tbpickhead"><h2 class="prh2">1. Topics</h2>
            <div class="tbquick"><button type="button" class="btn small" data-tsel="learned">Topics I understand <small>${learned.length}</small></button><button type="button" class="btn small" data-tsel="due">Due for review <small>${due.length}</small></button><button type="button" class="btn small ghost" data-tsel="none">Clear</button></div>
            <input type="search" class="tbsearch" placeholder="Filter topics" aria-label="Filter topics"></div>
          <div class="tbtracks">${topicPicker(sel)}</div>
        </div>
        <aside class="tbopts"><h2 class="prh2">2. The paper</h2>
          <fieldset><legend>Questions</legend><div class="tbchips">${[5, 10, 15, 20, 30].map((n) => `<label><input type="radio" name="tn" value="${n}"${o.n === n ? ' checked' : ''}><span>${n}</span></label>`).join('')}</div></fieldset>
          <fieldset><legend>Kind</legend><div class="tbchips">${[['mixed', 'Mixed'], ['core', 'Short answers'], ['exam', 'Exam style']].map(([v, l]) => `<label><input type="radio" name="tmix" value="${v}"${o.mix === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>
          <fieldset><legend>Time</legend><div class="tbchips">${[['exam', 'Exam timing'], ['custom', 'My own'], ['none', 'Untimed']].map(([v, l]) => `<label><input type="radio" name="ttime" value="${v}"${o.time === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
            <label class="tbmins"${o.time === 'custom' ? '' : ' hidden'}>Minutes <input type="number" name="tmins" min="1" max="300" value="${o.mins}"></label>
            <p class="tbnote">Exam timing allows about a minute per mark at GCSE, 1.3 minutes at A-level (the boards range from about 1.2 to 1.5) and 1.8 at university, where papers vary most.</p></fieldset>
          <label class="tbck"><input type="checkbox" name="tprac"${o.prac ? ' checked' : ''}> Include required-practical questions</label>
          <p class="tbsum" aria-live="polite"></p>
          <button type="button" class="btn primary tbbuild" data-tbuild>Build the test</button>
        </aside>
      </div>
      ${historyHTML(D)}
    </section>`;
    document.title = 'Build a test · Geodesic';
    const readOpts = () => ({ n: +($('input[name=tn]:checked', view) || { value: 10 }).value, mix: ($('input[name=tmix]:checked', view) || { value: 'mixed' }).value, time: ($('input[name=ttime]:checked', view) || { value: 'exam' }).value, mins: +$('input[name=tmins]', view).value || 30, prac: $('input[name=tprac]', view).checked, fresh: !!($('input[name=tfresh]', view) || {}).checked });
    const chosen = () => $$('[data-tt]:checked', view).map((x) => x.dataset.tt);
    function summary() {
      const ids = chosen(), o2 = readOpts(); let nq = 0; ids.forEach((id) => { nq += pool(id, o2.prac).filter((x) => o2.mix === 'mixed' || (o2.mix === 'core' ? x.kind === 'core' : x.kind !== 'core')).length; });
      $('.tbsum', view).innerHTML = ids.length ? `<b>${ids.length}</b> topic${ids.length > 1 ? 's' : ''} chosen, with <b>${nq}</b> questions of this kind between them. Your test will have <b>${Math.min(o2.n, nq)}</b>.` : 'Choose at least one topic.';
      $('[data-tbuild]', view).disabled = !ids.length || !nq;
      $$('[data-tcount]', view).forEach((el) => { const k = el.dataset.tcount, all = $$(`[data-tt][data-stage="${k}"]`, view), n = all.filter((x) => x.checked).length; el.textContent = n ? `${n} of ${all.length} chosen` : `${all.length} topics`; const box = $(`[data-tstage="${k}"]`, view); if (box) { box.checked = n === all.filter((x) => !x.disabled).length && n > 0; box.indeterminate = n > 0 && !box.checked; } });
      const D2 = load(); D2.sel = ids; D2.opts = o2; save(D2);
    }
    summary();
    view.onchange = (e) => {
      const t = e.target;
      if (t.matches('[data-tstage]')) { $$(`[data-tt][data-stage="${t.dataset.tstage}"]`, view).forEach((x) => { if (!x.disabled) x.checked = t.checked; }); }
      if (t.name === 'ttime') $('.tbmins', view).hidden = t.value !== 'custom';
      summary();
    };
    view.oninput = (e) => { if (e.target.matches('.tbsearch')) { const q = e.target.value.trim().toLowerCase(); $$('.tbt', view).forEach((l) => { l.hidden = q && !l.dataset.title.includes(q); }); if (q) $$('.tbstage', view).forEach((d) => { d.open = $$('.tbt:not([hidden])', d).length > 0; }); } if (e.target.name === 'tmins') summary(); };
    view.onclick = (e) => {
      const t = e.target;
      const q = t.closest('[data-tsel]'); if (q) { const k = q.dataset.tsel, set = new Set(k === 'learned' ? learned : k === 'due' ? due : []); $$('[data-tt]', view).forEach((x) => { x.checked = set.has(x.dataset.tt) && !x.disabled; }); $$('.tbstage', view).forEach((d) => { d.open = $$('[data-tt]:checked', d).length > 0; }); summary(); return; }
      if (t.closest('[data-tbuild]')) { const o2 = readOpts(), ids = chosen(); const P = buildPaper(Object.assign({ topics: ids }, o2)); if (!P.items.length) { renderBuilder(view, 'Those topics have no questions of that kind yet. Choose more topics or another kind.'); return; } const D2 = load(); D2.cur = P; save(D2); renderCover(view); window.scrollTo(0, 0); return; }
      const go = t.closest('[data-tgo]'); if (go) { const D2 = load(); if (go.dataset.tgo === 'resume') renderSit(view); else renderCover(view); window.scrollTo(0, 0); return; }
      if (t.closest('[data-tdiscard]')) { const D2 = load(); delete D2.cur; save(D2); renderBuilder(view); return; }
    };
  }
  function historyHTML(D) {
    const L = (D.hist || []).slice().reverse(); if (!L.length) return '';
    return `<section class="tbhist"><h2 class="prh2">Your tests</h2><table class="rtab tbhtab"><thead><tr><th scope="col">Date</th><th scope="col">Questions</th><th scope="col">Topics</th><th scope="col">Time used</th><th></th></tr></thead><tbody>
      ${L.map((h) => `<tr><td>${new Date(h.made).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td><td>${h.n}</td><td>${h.topics}</td><td>${h.used ? mmss(h.used) : '–'}</td><td><a href="#test-${h.id}">Review</a></td></tr>`).join('')}</tbody></table></section>`;
  }

  /* ---------- the cover, the paper, the clock ---------- */
  function renderCover(view, note) {
    const D = load(), P = D.cur; if (!P) { renderBuilder(view); return; }
    const app = A(), byT = {}; P.items.forEach((x) => { byT[x.tid] = (byT[x.tid] || 0) + x.marks; });
    view.innerHTML = `<section class="tb tcover">
      <p class="crumbs"><a href="#test">Build a test</a></p>
      <header class="tbhead"><p class="prk">Your paper</p><h1>${P.items.length} questions · ${P.marks} marks</h1>
        <p class="prlead">${P.mins ? `You have <b>${P.mins} minutes</b>. The clock keeps running if you leave this page, and the paper closes when the time is up.` : 'There is no time limit. Take it as a calm practice paper.'} Answer in full sentences or with working, as in a real exam: the marks are for the steps, not only the answer.</p></header>
      ${note ? `<p class="tbmsg">${esc(note)}</p>` : ''}${P.items.some((x) => x.fresh) ? `<p class="tbnote">${P.items.filter((x) => x.fresh).length} of these questions were written by Einstein for this paper, inside the syllabus. AI-written questions can contain mistakes: if one looks wrong, say so in your answer.</p>` : ''}
      <ul class="tcovt">${Object.entries(byT).map(([t, m]) => `<li><span>${esc(app.nodes[t].title)}</span><small>${esc(H().stageOf(t).short)} · ${m} mark${m > 1 ? 's' : ''}</small></li>`).join('')}</ul>
      <div class="pqact"><button type="button" class="btn primary" data-tstart>Start the clock</button><button type="button" class="btn ghost" data-tback>Change the choices</button></div>
    </section>`;
    view.onclick = (e) => { if (e.target.closest('[data-tstart]')) { const D2 = load(); D2.cur.state = 'running'; D2.cur.start = Date.now(); D2.cur.end = D2.cur.mins ? Date.now() + D2.cur.mins * 60000 : 0; save(D2); renderSit(view); window.scrollTo(0, 0); } if (e.target.closest('[data-tback]')) renderBuilder(view); };
    view.onchange = null; view.oninput = null;
  }
  function renderSit(view) {
    const D = load(), P = D.cur; if (!P || P.state !== 'running') { renderBuilder(view); return; }
    if (P.end && Date.now() >= P.end) { finish(view, true); return; }
    const app = A();
    view.innerHTML = `<section class="tb tsit">
      <header class="tphead"><div><p class="prk">Test in progress</p><b>${P.items.length} questions · ${P.marks} marks</b></div>
        <div class="tpclockw">${P.mins ? `<span class="tpclock" id="tp-clock" aria-live="off">${mmss((P.end - Date.now()) / 1000)}</span><small>left</small>` : '<small>Untimed</small>'}</div>
        <button type="button" class="btn primary" data-tfinish>Finish practice</button></header>
      <nav class="tpnav" aria-label="Questions">${P.items.map((x, i) => `<a href="#tq-${i}" data-tq="${i}" class="${(P.ans[i] || '').trim() ? 'done' : ''}${P.flag[i] ? ' flag' : ''}">${i + 1}</a>`).join('')}</nav>
      <ol class="tpqs">${P.items.map((x, i) => `<li class="tpq" id="tq-${i}">
        <header><span class="pqn">${i + 1}</span><span class="tpmeta">${esc(app.nodes[x.tid].title)} · ${KIND[x.kind]}${x.prac ? ': ' + esc(x.prac) : ''}</span><span class="pqm">${x.marks} mark${x.marks > 1 ? 's' : ''}</span><button type="button" class="tpflag" data-tflag="${i}" aria-pressed="${!!P.flag[i]}" title="Flag this question to come back to">Flag</button></header>
        <p class="pqq" data-tid="${esc(x.tid)}">${pr(x.q)}</p>
        <textarea data-ta="${i}" rows="${x.marks > 2 ? 5 : 3}" placeholder="${x.kind === 'core' && x.ans !== 'written' ? 'Your answer, with working and units' : 'Your answer'}" aria-label="Your answer to question ${i + 1}">${esc(P.ans[i] || '')}</textarea></li>`).join('')}</ol>
      <div class="tpend"><button type="button" class="btn primary" data-tfinish>Finish practice</button><span class="muted">${P.items.filter((_, i) => !(P.ans[i] || '').trim()).length} unanswered</span></div>
    </section>`;
    typeset($('.tpqs', view));
    document.title = 'Test in progress · Geodesic';
    let saveT = 0;
    const flush = () => { clearTimeout(saveT); const D2 = load(); if (D2.cur && D2.cur.id === P.id) { D2.cur.ans = P.ans; D2.cur.flag = P.flag; save(D2); } };
    window.removeEventListener('pagehide', WL.tests._flush || (() => {})); WL.tests._flush = flush; window.addEventListener('pagehide', flush);
    view.oninput = (e) => { const t = e.target; if (!t.matches('[data-ta]')) return; const i = +t.dataset.ta; P.ans[i] = t.value.slice(0, 5000); clearTimeout(saveT); saveT = setTimeout(flush, 250); const a = $(`[data-tq="${i}"]`, view); if (a) a.classList.toggle('done', !!t.value.trim()); const un = $('.tpend .muted', view); if (un) un.textContent = `${P.items.filter((_, k) => !(P.ans[k] || '').trim()).length} unanswered`; };
    view.onchange = null;
    view.onclick = (e) => {
      const t = e.target;
      const f = t.closest('[data-tflag]'); if (f) { const i = +f.dataset.tflag; P.flag[i] = !P.flag[i]; f.setAttribute('aria-pressed', P.flag[i]); $(`[data-tq="${i}"]`, view).classList.toggle('flag', P.flag[i]); flush(); return; }
      const q = t.closest('[data-tq]'); if (q) { e.preventDefault(); const el = $('#tq-' + q.dataset.tq); el.scrollIntoView({ behavior: WL.reduced ? 'auto' : 'smooth', block: 'start' }); const ta = el.querySelector('textarea'); if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 300); return; }
      const fin = t.closest('[data-tfinish]'); if (fin) {
        const un = P.items.filter((_, i) => !(P.ans[i] || '').trim()).length;
        if (un && !fin.dataset.armed) { $$('[data-tfinish]', view).forEach((b) => { b.dataset.armed = '1'; b.textContent = `${un} unanswered: press again to finish`; }); setTimeout(() => $$('[data-tfinish]', view).forEach((b) => { delete b.dataset.armed; b.textContent = 'Finish practice'; }), 4000); return; }
        flush(); finish(view, false);
      }
    };
    clearInterval(tick);
    if (P.mins) tick = setInterval(() => {
      const el = $('#tp-clock'); if (!el || !el.isConnected) { clearInterval(tick); return; }
      const left = (P.end - Date.now()) / 1000; el.textContent = mmss(left); el.classList.toggle('late', left < 300);
      if (left <= 0) { clearInterval(tick); const D2 = load(); D2.cur.ans = P.ans; save(D2); finish(view, true); }
    }, 1000);
  }

  /* ---------- saved papers and worked answers ---------- */
  function finish(view, timeUp) {
    clearInterval(tick);
    const data = load();
    const paper = data.cur;
    if (!paper) return;
    paper.state = 'done';
    paper.fin = Date.now();
    paper.used = paper.start ? Math.round(((paper.end ? Math.min(paper.fin, paper.end) : paper.fin) - paper.start) / 1000) : 0;
    data.tests ||= {};
    data.tests[paper.id] = paper;
    const ids = Object.keys(data.tests).sort();
    while (ids.length > 15) delete data.tests[ids.shift()];
    data.hist = (data.hist || []).filter(entry => entry.id !== paper.id && data.tests[entry.id]);
    data.hist.push({ id: paper.id, made: paper.made, n: paper.items.length, topics: paper.topics.length, used: paper.used });
    delete data.cur;
    save(data);
    history.replaceState(null, '', '#test-' + paper.id);
    renderResult(view, paper.id, timeUp);
  }

  function renderResult(view, id, timeUp = false) {
    const paper = (load().tests || {})[id];
    if (!paper) {
      view.innerHTML = '<section class="tb"><h1>That test is not saved here</h1><p><a href="#test">Build a test</a></p></section>';
      return;
    }
    view.innerHTML = `<section class="tb tres">
      <p class="crumbs"><a href="#test">Build a test</a></p>
      <header class="tbhead"><div><h1>${timeUp ? 'Time is up' : 'Practice complete'}</h1>
      <p class="prlead">Your answers are saved in this browser. Open the worked answers below to review your practice.</p></div></header>
      <ol class="tpqs trqs">${paper.items.map((question, i) => `<li class="tpq">
        <header><span class="pqn">${i + 1}</span><span class="tpmeta">${esc(A().nodes[question.tid].title)} · ${KIND[question.kind]}</span></header>
        <p class="pqq">${pr(question.q)}</p>
        <div class="trans"><small>Your answer</small><p>${paper.ans[i] ? esc(paper.ans[i]).replace(/\n/g, '<br>') : '<i>No answer</i>'}</p></div>
        <details class="trms"><summary>Worked answer</summary>
          ${question.pts?.length ? `<ol>${question.pts.map(point => `<li>${pr(point)}</li>`).join('')}</ol>` : ''}
          ${question.a ? `<p><b>Answer</b> ${pr(question.a)}</p>` : ''}
          ${question.s?.length ? `<ol>${question.s.map(step => `<li>${pr(step)}</li>`).join('')}</ol>` : ''}
        </details>
      </li>`).join('')}</ol>
    </section>`;
    typeset(view);
    document.title = 'Saved practice · Geodesic';
    view.onclick = null;
    view.oninput = null;
    view.onchange = null;
  }

  WL.pages = WL.pages || {};
  WL.pages.test = { match: (h) => h === 'test', nav: 'test', render: (h, view) => { const D = load(); if (D.cur && D.cur.state === 'running') renderSit(view); else if (D.cur && D.cur.state === 'marking') finish(view, false); else if (D.cur && D.cur.state === 'ready' && D.cur.show === 'cover') { delete D.cur.show; save(D); renderCover(view); } else renderBuilder(view); } };
  WL.pages.testres = { match: (h) => h.startsWith('test-'), nav: 'test', render: (h, view) => renderResult(view, h.slice(5)) };
  WL.tests = Object.assign(WL.tests || {}, { pool, buildPaper });
})();
