/* Quilio: tools for classes.
   - For teachers (#teach): build a homework link from any lectures, and (#teach-results) read the class's results.
   - Homework (#hw=...): the student page a homework link opens. Finishing it gives a completion code.
   - Mistakes (#mistakes): every question answered wrongly, to retry or print.
   - Mark scheme feedback: after a written answer is marked, the key words examiners look for, and the ones the answer used.
   Fresh has no server, so nothing is uploaded. A homework link carries the whole homework; a completion code carries a
   student's results. The teacher pastes the class's codes into Class results to see the dashboard. */
(function () {
  'use strict';
  const GC = window.GC, RV = window.Revise; if (!GC || !RV || !RV.card) return;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = GC.esc, il = s => GC.inline(s), store = GC.store, plural = GC.plural, view = $('#view'), html = document.documentElement;
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const hue = L => `--hue:var(--${L.stage.id})`;
  const STAGE_ORDER = () => GC.IDX.stages;
  const KIND = { c: 'Multiple choice', n: 'Calculation', q: 'Written', lt: 'Level Test' };

  /* ---------- small helpers ---------- */
  const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64 = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))));
  const sum4 = s => { let h = 2166136261; for (const ch of 'quilio·' + s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 4); };
  const rid = () => Math.random().toString(36).slice(2, 8);
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fmtDay = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '';
  const mins = s => s < 60 ? '< 1 min' : Math.round(s / 60) + ' min';
  const pc = (a, b) => b ? Math.round(a / b * 100) : 0;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  async function copy(text, btn) {
    let ok = false; try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { }
    if (!ok) { const t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (e) { } t.remove(); }
    if (btn) { const was = btn.dataset.label || btn.textContent; btn.dataset.label = was; btn.textContent = ok ? 'Copied ✓' : 'Select and copy it'; setTimeout(() => { if (btn.isConnected) btn.textContent = was; }, 1800); }
  }
  // a question reference is "lecture~kind~index"; it resolves to the card item revise.js understands
  const ref = it => `${it.src}~${it.k}~${it.i}`;
  async function resolve(refs) {
    const Ls = [...new Set(refs.map(r => r.split('~')[0]))].map(id => GC.BY[id]).filter(Boolean), G = {};
    await Promise.all([...new Set(Ls.map(L => L.stage))].map(S => GC.stageData(S).then(g => { G[S.id] = g; }).catch(() => { })));
    const lt = (window.LevelTest || {}).Q || [];
    return refs.map(r => { const [src, k, i] = r.split('~'), L = GC.BY[src]; if (!L) return null;
      const q = k === 'lt' ? lt[+i] : (((G[L.stage.id] || {})[src] || {})[k] || [])[+i]; return q ? { src, k, i: +i, q } : null; });
  }
  const marksOf = it => it.k === 'n' || it.k === 'q' ? it.q.k : 1;
  const qText = it => GC.plain(it.q.q).replace(/\s+/g, ' ').trim();
  const isMC = it => it.k === 'c' || (it.k === 'lt' && it.q.o);
  // read the result of an answered card off the page: [marks scored, marks available, extra (the option picked)]
  function readCard(el, it) {
    const res = el.dataset.res, m = marksOf(it);
    if (isMC(it)) { const btns = $$('.opts button', el), pick = btns.findIndex(b => b.classList.contains('is-wrong')); return [res === '1' ? 1 : 0, 1, res === '1' ? it.q.a : pick]; }
    if (it.k === 'q' && res !== 's') { const hits = $$('.fb .pts li.hit', el).length; return [Math.min(m, hits), m, '']; }
    return [res === '1' ? m : 0, m, res === 's' ? 's' : ''];
  }

  /* ---------- the little tab bar shared by Tracker pages ---------- */
  window.GCNav = active => `<nav class="cr-nav" aria-label="Your study"><a href="#record" class="${active === 'record' ? 'is-on' : ''}">Record &amp; tracker</a><a href="#mistakes" class="${active === 'mistakes' ? 'is-on' : ''}">Mistakes notebook${(() => { const n = mistakes().filter(m => !m.fixed).length; return n ? ` <b>${n}</b>` : ''; })()}</a></nav>`;
  const teachNav = active => `<nav class="cr-nav" aria-label="For teachers"><a href="#teach" class="${active === 'teach' ? 'is-on' : ''}">1 · Set homework</a><a href="#teach-results" class="${active === 'teach-results' ? 'is-on' : ''}">2 · Class results</a></nav>`;
  const crumbs = parts => `<nav class="crumbs" aria-label="Breadcrumb"><a href="#chemistry">Chemistry</a>${parts.map(p => `<span>${p}</span>`).join('')}</nav>`;

  /* =====================================================================
     MISTAKES NOTEBOOK
     ===================================================================== */
  function mistakes() {
    const R = RV.record(), out = [];
    Object.entries(R.L || {}).forEach(([id, e]) => { if (!GC.BY[id]) return; Object.entries(e.q || {}).forEach(([key, p]) => {
      const wrongs = p[3] != null ? p[3] : (p[0] ? 0 : 1); if (!wrongs && p[0]) return;
      const m = /^(lt|c|n|q)(\d+)$/.exec(key); if (!m) return; out.push({ ref: `${id}~${m[1]}~${m[2]}`, id, fixed: !!p[0], wrongs: Math.max(1, wrongs), t: p[2] || e.t }); }); });
    return out.sort((a, b) => (a.fixed - b.fixed) || b.t - a.t);
  }
  let mkFilter = 'open', mkStage = 'all';
  async function vMistakes(v) {
    document.title = 'Mistakes notebook · Quilio';
    const all = mistakes(), open = all.filter(m => !m.fixed), fixed = all.filter(m => m.fixed);
    v.innerHTML = `<div class="page cr">${crumbs(['Mistakes notebook'])}${GCNav('mistakes')}
      <header class="page-head"><p class="kicker">Saved in this browser only</p><h1>Mistakes notebook</h1><p>Every question you got wrong, collected for you. Answer one correctly and it moves to <b>Fixed</b>. Print the lot as a worksheet with an answer page at the back.</p></header>
      ${all.length ? `<div class="rec-stats"><div class="panel"><b>${open.length}</b><span>still to fix</span></div><div class="panel"><b>${fixed.length}</b><span>fixed</span></div><div class="panel"><b>${[...new Set(open.map(m => m.id))].length}</b><span>${open.length === 1 ? 'lecture' : 'lectures'} to look at again</span></div></div>
      <div class="cr-tools panel"><div class="cr-seg" role="group" aria-label="Show">${[['open', `Still wrong (${open.length})`], ['fixed', `Fixed (${fixed.length})`], ['all', `All (${all.length})`]].map(([k, l]) => `<button type="button" class="chip${mkFilter === k ? ' is-on' : ''}" data-mk="f" data-v="${k}">${l}</button>`).join('')}</div>
        <div class="cr-seg" role="group" aria-label="Stage"><button type="button" class="chip${mkStage === 'all' ? ' is-on' : ''}" data-mk="s" data-v="all">Every stage</button>${STAGE_ORDER().filter(S => all.some(m => GC.BY[m.id].stage === S)).map(S => `<button type="button" class="chip${mkStage === S.id ? ' is-on' : ''}" data-mk="s" data-v="${S.id}" style="--hue:var(--${S.id})">${S.label}</button>`).join('')}</div>
        <span class="grow"></span><button type="button" class="btn small ghost" data-mk="print">Print as a worksheet</button></div>
      <div id="mkList"><p class="cr-wait">Loading your questions…</p></div>`
      : `<div class="panel cr-empty"><h2>Nothing here yet 🎉</h2><p>When you answer a question wrongly, anywhere on Quilio, it lands here so you can come back to it.</p><a class="btn" href="#chemistry">Go to the lectures ${ARROW}</a></div>`}</div>`;
    if (!all.length) return;
    const show = all.filter(m => (mkFilter === 'all' || (mkFilter === 'open') !== m.fixed) && (mkStage === 'all' || GC.BY[m.id].stage.id === mkStage));
    const items = await resolve(show.map(m => m.ref)), box = $('#mkList'); if (!box || !box.isConnected) return;
    const byL = new Map(); show.forEach((m, k) => { if (!items[k]) return; if (!byL.has(m.id)) byL.set(m.id, []); byL.get(m.id).push([m, items[k]]); });
    box.innerHTML = byL.size ? [...byL].map(([id, list]) => { const L = GC.BY[id];
      return `<section class="mk-group" style="${hue(L)}"><h2><a href="#${id}"><span class="tag">${L.stage.label} ${L.code}</span>${esc(L.title)}</a><small>${plural(list.length, 'question')}</small></h2><div class="quiz">${list.map(([m, it]) => `<div class="mk-item"><span class="mk-st ${m.fixed ? 'ok' : 'no'}">${m.fixed ? 'Fixed ✓' : m.wrongs > 1 ? `Wrong ${m.wrongs} times` : 'Wrong last time'}</span>${RV.card(it)}</div>`).join('')}</div></section>`; }).join('')
      : `<div class="panel cr-empty"><h2>${mkFilter === 'open' ? 'All fixed 🎉' : 'Nothing to show'}</h2><p>${mkFilter === 'open' ? 'Every mistake in this view has been answered correctly since.' : 'Try another filter.'}</p></div>`;
  }
  function printMistakes() {
    const all = mistakes().filter(m => (mkFilter === 'all' || (mkFilter === 'open') !== m.fixed) && (mkStage === 'all' || GC.BY[m.id].stage.id === mkStage));
    resolve(all.map(m => m.ref)).then(items => {
      const list = items.filter(Boolean); if (!list.length) return;
      printSheet('My mistakes notebook', `${plural(list.length, 'question')} · printed ${fmtDay(today())}`, list);
    });
  }
  // a printable worksheet: the questions, space to answer, and the answers on a separate page at the back
  function printSheet(title, sub, list, head) {
    const qHtml = (it, n) => { const L = GC.BY[it.src], q = it.q;
      return `<li class="ps-q"><div class="ps-src">${L.stage.label} ${L.code} · ${esc(L.title)} · ${plural(marksOf(it), 'mark')}</div><div class="ps-text">${il(q.q)}</div>
        ${isMC(it) ? `<ol class="ps-opts" type="A">${q.o.map(o => `<li>${il(o)}</li>`).join('')}</ol>` : `<div class="ps-lines" style="--n:${it.k === 'q' ? Math.max(3, q.k * 2) : 3}"></div>`}</li>`; };
    const aHtml = (it) => { const q = it.q;
      if (isMC(it)) return `<li><b>${String.fromCharCode(65 + q.a)}</b> ${il(q.o[q.a])}${q.y || q.w ? `<div class="ps-why">${il(q.y || q.w)}</div>` : ''}</li>`;
      if (it.k === 'n') return `<li><b>${esc(q.a[0])}</b><ol class="ps-steps">${q.st.map(s => `<li>${il(s)}</li>`).join('')}</ol></li>`;
      if (it.k === 'lt') return `<li><b>${esc(String(q.a))}${q.u ? ' ' + esc(q.u) : ''}</b><div class="ps-why">${il(q.w || '')}</div></li>`;
      return `<li>${q.p.length > q.k ? `<i>Any ${q.k} from:</i>` : ''}<ul>${q.p.map(p => `<li>${il(p[0])}</li>`).join('')}</ul></li>`; };
    const sheet = document.createElement('div'); sheet.className = 'print-sheet';
    sheet.innerHTML = `<header><h1>${esc(title)}</h1><p>${esc(sub)}</p>${head || '<p class="ps-name">Name: ______________________ &nbsp; Class: ________</p>'}</header>
      <ol class="ps-list">${list.map(qHtml).join('')}</ol><section class="ps-answers"><h2>Answers and mark scheme</h2><ol>${list.map(aHtml).join('')}</ol></section>`;
    document.body.appendChild(sheet); html.classList.add('printing');
    const done = () => { html.classList.remove('printing'); sheet.remove(); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done); setTimeout(() => window.print(), 60);
  }
  window.addEventListener('gc-answer', () => { const n = $('.cr-nav a[href="#mistakes"] b'); if (n) { const k = mistakes().filter(m => !m.fixed).length; n.textContent = k; } });

  /* =====================================================================
     HOMEWORK (the student's page)
     ===================================================================== */
  const readHW = code => { try { const o = JSON.parse(unb64(code)); return o && o.v === 1 && Array.isArray(o.it) ? o : null; } catch (e) { return null; } };
  const hwLink = P => location.origin + location.pathname + '#hw=' + b64(JSON.stringify(P));
  let HW = null;
  async function vHW(v, code) {
    const P = readHW(code); document.title = 'Homework · Quilio';
    if (!P) { v.innerHTML = `<div class="page cr"><div class="panel cr-empty"><h2>This homework link is broken</h2><p>Part of the link is missing. Copy the whole link from your teacher again.</p><a class="btn" href="#chemistry">Go to the lectures ${ARROW}</a></div></div>`; return; }
    document.title = P.t + ' · Quilio';
    const KEY = 'gc.hw.' + P.id, S = store.get(KEY, null) || { start: Date.now(), r: {} }; if (!S.start) S.start = Date.now(); store.set(KEY, S);
    const due = P.due, late = due && today() > due;
    v.innerHTML = `<div class="page cr hw"><header class="hw-head panel"><p class="kicker">Homework${P.cl ? ' · ' + esc(P.cl) : ''}${P.by ? ' · from ' + esc(P.by) : ''}</p><h1>${esc(P.t)}</h1>
      <div class="hw-meta">${due ? `<span class="hw-due${late ? ' is-late' : ''}">${late ? 'Was due' : 'Due'} ${fmtDay(due)}</span>` : ''}<span>${plural(P.it.length, 'question')}</span><span>about ${Math.max(5, Math.round(P.it.length * 2.5))} min</span></div>
      <p class="hw-how">Answer every question. Your <b>first try</b> is what counts, but you can keep trying afterwards to learn. At the end you get a <b>completion code</b>: hand it in where your teacher asked.</p>
      <div class="hw-bar" aria-hidden="true"><i></i></div><p class="hw-count" aria-live="polite"></p></header>
      <div id="hwBody"><p class="cr-wait">Loading the questions…</p></div><div id="hwEnd"></div></div>`;
    const items = await resolve(P.it); if (!$('#hwBody')) return;
    HW = { P, S, KEY, items };
    $('#hwBody').innerHTML = `<div class="quiz">${items.map((it, n) => it ? `<div class="hw-item" data-n="${n}">${RV.card(it, 'Q' + (n + 1))}${S.r[n] ? `<p class="hw-first">First try saved: ${S.r[n][0]} of ${S.r[n][1]} ${S.r[n][1] === 1 ? 'mark' : 'marks'}</p>` : ''}</div>` : `<div class="panel cr-miss">Q${n + 1}: this question is no longer on Quilio. Skip it.</div>`).join('')}</div>`;
    hwTally();
  }
  function hwTally() {
    if (!HW || !$('#hwBody')) return; const { P, S, items } = HW, total = items.filter(Boolean).length, done = Object.keys(S.r).length;
    $('.hw-bar i').style.width = pc(done, total) + '%'; $('.hw-count').innerHTML = `<b>${done}</b> of ${total} answered`;
    const end = $('#hwEnd'); if (done < total) { end.innerHTML = ''; return; }
    const got = Object.values(S.r).reduce((a, r) => a + r[0], 0), max = Object.values(S.r).reduce((a, r) => a + r[1], 0);
    if (!S.fin) { S.fin = Date.now(); store.set(HW.KEY, S); }
    const name = S.name || store.get('gc.name', '');
    end.innerHTML = `<section class="hw-end panel"><p class="kicker">All done</p><h2>${got} out of ${max} <small>(${pc(got, max)}%)</small></h2><p>Time taken: ${mins((S.fin - S.start) / 1000)}.</p>
      <label class="hw-name">Your name, as your teacher knows you<input id="hwName" type="text" autocomplete="name" value="${esc(name)}" placeholder="e.g. Semin Cheon"></label>
      <button type="button" class="btn" data-hw="code">Get my completion code ${ARROW}</button><div id="hwCode">${S.code ? codeBox(S.code) : ''}</div>
      ${got < max ? `<p class="hw-next">The ones you got wrong are now in your <a href="#mistakes">Mistakes notebook</a>, ready to try again.</p>` : ''}</section>`;
  }
  const codeBox = c => `<div class="hw-code"><p>Your completion code. Copy it and hand it in, for example as a private comment on the Google Classroom assignment.</p><code>${esc(c)}</code><div class="hw-code-btns"><button type="button" class="btn small" data-hw="copy">Copy code</button></div></div>`;
  function makeCode() {
    const { P, S, items } = HW, name = ($('#hwName').value || '').trim(); if (!name) { $('#hwName').focus(); $('#hwName').classList.add('is-bad'); return; }
    store.set('gc.name', name); S.name = name;
    const body = { h: P.id, ti: P.t, cl: P.cl || '', due: P.due || '', n: name, s: Math.round((S.fin - S.start) / 1000), f: Math.round(S.fin / 60000), it: P.it, r: items.map((it, n) => S.r[n] || null) };
    const data = b64(JSON.stringify(body)); S.code = `QH1.${data}.${sum4(data)}`; store.set(HW.KEY, S);
    $('#hwCode').innerHTML = codeBox(S.code); copy(S.code);
  }
  // answers in a homework card: keep the first try
  view.addEventListener('rv-answer', e => {
    if (!HW || !e.target.closest) return; const box = e.target.closest('.hw-item'); if (!box) return; const n = +box.dataset.n, it = HW.items[n]; if (!it || HW.S.r[n]) return;
    HW.S.r[n] = readCard(e.target.closest('.q'), it); store.set(HW.KEY, HW.S);
    box.insertAdjacentHTML('beforeend', `<p class="hw-first">First try saved: ${HW.S.r[n][0]} of ${HW.S.r[n][1]} ${HW.S.r[n][1] === 1 ? 'mark' : 'marks'}</p>`); hwTally();
  });

  /* =====================================================================
     FOR TEACHERS: set homework
     ===================================================================== */
  const T = { lec: new Set(), mode: 'auto', n: 10, pick: new Set(), stage: null, q: '' };
  const myHW = () => store.get('gc.teach.hw', []);
  async function vTeach(v) {
    document.title = 'Set homework · Quilio';
    if (!T.stage) T.stage = (STAGE_ORDER().find(S => S.id === 'igcse') || STAGE_ORDER()[0]).id;
    const prof = store.get('gc.teach.me', {});
    v.innerHTML = `<div class="page cr teach">${crumbs(['For teachers'])}${teachNav('teach')}
      <header class="page-head"><p class="kicker">For teachers · no sign-up</p><h1>Set homework in three steps</h1><p>Pick the lectures, choose the questions, and send one link. Students answer on any device and hand back a code; paste the codes into <a href="#teach-results">Class results</a> to see the whole class.</p></header>
      <ol class="t-steps">
        <li class="panel t-step"><h2><i>1</i>Choose the lectures</h2>
          <div class="filterbar"><input id="tSearch" type="search" placeholder="Search lectures" aria-label="Search lectures" autocomplete="off" value="${esc(T.q)}">${STAGE_ORDER().map(S => `<button type="button" class="chip${T.stage === S.id ? ' is-on' : ''}" data-t="stage" data-v="${S.id}">${S.label}</button>`).join('')}</div>
          <div id="tLec" class="t-lec"></div><p class="t-sel" id="tSel"></p></li>
        <li class="panel t-step"><h2><i>2</i>Choose the questions</h2>
          <div class="cr-seg"><button type="button" class="chip${T.mode === 'auto' ? ' is-on' : ''}" data-t="mode" data-v="auto">Let Quilio pick a mix</button><button type="button" class="chip${T.mode === 'pick' ? ' is-on' : ''}" data-t="mode" data-v="pick">Pick them myself</button></div>
          <div id="tQ"></div></li>
        <li class="panel t-step"><h2><i>3</i>Name it and send it</h2>
          <div class="t-form"><label>Title<input id="tTitle" type="text" placeholder="e.g. Atomic structure homework"></label>
            <label>Class<input id="tClass" type="text" placeholder="e.g. 10M" value="${esc(prof.cl || '')}"></label>
            <label>Your name<input id="tBy" type="text" placeholder="e.g. Mr Lee" value="${esc(prof.by || '')}"></label>
            <label>Due date<input id="tDue" type="date" min="${today()}"></label></div>
          <button type="button" class="btn" data-t="make">Make the homework link ${ARROW}</button><div id="tOut"></div></li></ol>
      ${myHW().length ? `<section class="t-mine"><h2>Homework you have set</h2><p class="sub">Saved in this browser.</p><div class="t-mine-list">${myHW().slice().reverse().map(h => `<div class="panel t-mine-row"><div><b>${esc(h.P.t)}</b><small>${h.P.cl ? esc(h.P.cl) + ' · ' : ''}${plural(h.P.it.length, 'question')}${h.P.due ? ' · due ' + fmtDay(h.P.due) : ''}</small></div><button type="button" class="chip" data-t="copylink" data-id="${h.P.id}">Copy link</button><a class="chip" href="#teach-results" data-t="results" data-id="${h.P.id}">Results</a><button type="button" class="chip" data-t="print" data-id="${h.P.id}">Print</button></div>`).join('')}</div></section>` : ''}
      <details class="panel t-help"><summary>How does it work without accounts?</summary><p>The homework link holds the whole homework, so there is nothing to set up. When a student finishes, Quilio gives them a completion code that holds their answers and time. They hand the code in (a private comment on the Google Classroom assignment works well). You paste all the codes into <b>Class results</b>, and Quilio shows the class at a glance and every question's results. Nothing is stored on a server. The code is checked for tampering, but it is not exam-proof security: use it for homework, not for tests that count.</p></details></div>`;
    renderLec(); await renderQ();
  }
  function renderLec() {
    const box = $('#tLec'); if (!box) return; const q = T.q.trim().toLowerCase();
    const stages = q ? STAGE_ORDER() : STAGE_ORDER().filter(S => S.id === T.stage);
    box.innerHTML = stages.map(S => S.topics.map(Tp => { const ls = Tp.lectures.filter(L => L.q && (!q || `${L.code} ${L.title} ${Tp.title}`.toLowerCase().includes(q))); if (!ls.length) return '';
      const on = ls.filter(L => T.lec.has(L.id)).length;
      return `<details class="t-topic" style="--hue:var(--${S.id})"${q || on ? ' open' : ''}><summary><span>${q ? S.label + ' · ' : ''}Topic ${Tp.n} · ${esc(Tp.title)}</span>${on ? `<b>${on} chosen</b>` : ''}</summary><div>${ls.map(L => `<label class="t-l"><input type="checkbox" data-t="lec" value="${L.id}"${T.lec.has(L.id) ? ' checked' : ''}><span><b>${L.code}</b> ${esc(L.title)}</span><small>${plural(L.q, 'question')}</small></label>`).join('')}</div></details>`; }).join('')).join('') || '<p class="cr-wait">No lecture matches.</p>';
    const n = T.lec.size; $('#tSel').innerHTML = n ? `<b>${plural(n, 'lecture')} chosen:</b> ${[...T.lec].map(id => GC.BY[id]).map(L => `<button type="button" class="chip small-x" data-t="unlec" data-v="${L.id}">${L.stage.label} ${L.code} ×</button>`).join(' ')}` : 'Tick one or more lectures. You can mix stages.';
  }
  async function poolFor(ids) {
    const Ls = ids.map(id => GC.BY[id]), G = {}; await Promise.all([...new Set(Ls.map(L => L.stage))].map(S => GC.stageData(S).then(g => { G[S.id] = g; })));
    const lt = RV.ltItems(); return Ls.map(L => RV.itemsOf(L, G[L.stage.id][L.id]).concat(lt.filter(x => x.src === L.id)));
  }
  async function renderQ() {
    const box = $('#tQ'); if (!box) return; if (!T.lec.size) { box.innerHTML = '<p class="cr-wait">Choose at least one lecture first.</p>'; return; }
    const pools = await poolFor([...T.lec]), total = pools.reduce((a, p) => a + p.length, 0); if (!$('#tQ')) return;
    if (T.mode === 'auto') { T.n = Math.min(T.n, total) || Math.min(10, total);
      box.innerHTML = `<div class="t-auto"><label>How many questions?<select id="tN">${[5, 8, 10, 12, 15, 20, 25, 30].filter(x => x <= total).concat(total).filter((x, i, a) => a.indexOf(x) === i).map(x => `<option value="${x}"${x === T.n ? ' selected' : ''}>${x}${x === total ? ' (all)' : ''}</option>`).join('')}</select></label>
        <p>Quilio shares them out across your ${plural(T.lec.size, 'lecture')} and mixes multiple choice, calculations and written answers. ${total} available.</p></div>`; return; }
    box.innerHTML = `<p class="t-picknote"><b id="tPickN">${T.pick.size}</b> chosen. Tick the questions you want, in the order you want them.</p>${pools.map((p, k) => { const L = GC.BY[[...T.lec][k]];
      return `<div class="t-qgroup"><h3><span class="tag" style="${hue(L)}">${L.stage.label} ${L.code}</span> ${esc(L.title)}</h3>${p.map(it => `<label class="t-qrow"><input type="checkbox" data-t="pick" value="${ref(it)}"${T.pick.has(ref(it)) ? ' checked' : ''}><span class="t-kind k-${it.k}">${KIND[it.k]}${it.k !== 'c' && it.k !== 'lt' ? ' · ' + plural(marksOf(it), 'mark') : ''}</span><span class="t-qt">${il(it.q.q)}</span></label>`).join('')}</div>`; }).join('')}`;
  }
  async function makeHW() {
    let refs;
    if (!T.lec.size) { $('#tOut').innerHTML = '<p class="t-err">Choose at least one lecture in step 1.</p>'; return; }
    if (T.mode === 'pick') { refs = [...T.pick]; if (!refs.length) { $('#tOut').innerHTML = '<p class="t-err">Tick at least one question in step 2.</p>'; return; } }
    else { const pools = (await poolFor([...T.lec])).map(p => { const by = { c: [], n: [], q: [], lt: [] }; shuffle(p).forEach(it => by[it.k].push(it)); const mix = []; while (mix.length < p.length) ['c', 'n', 'c', 'q', 'lt'].forEach(k => { if (by[k].length) mix.push(by[k].shift()); }); return mix; });
      const out = []; let more = true; while (out.length < T.n && more) { more = false; pools.forEach(p => { if (p.length && out.length < T.n) { out.push(p.shift()); more = true; } }); } refs = out.map(ref); }
    const Ls = [...T.lec].map(id => GC.BY[id]), t = $('#tTitle').value.trim() || (Ls.length === 1 ? `${Ls[0].stage.label} ${Ls[0].code} ${Ls[0].title}` : `${Ls[0].stage.label} ${Ls[0].code} to ${Ls[Ls.length - 1].code}`) + ' homework';
    const P = { v: 1, id: rid(), t, by: $('#tBy').value.trim(), cl: $('#tClass').value.trim(), due: $('#tDue').value || '', it: refs };
    store.set('gc.teach.me', { by: P.by, cl: P.cl }); const mine = myHW(); mine.push({ P, made: Date.now() }); store.set('gc.teach.hw', mine.slice(-60));
    const link = hwLink(P), share = 'https://classroom.google.com/share?url=' + encodeURIComponent(link) + '&title=' + encodeURIComponent(P.t);
    $('#tOut').innerHTML = `<div class="t-done"><p class="kicker">Ready ✓</p><h3>${esc(P.t)}</h3><p>${plural(refs.length, 'question')}${P.due ? ' · due ' + fmtDay(P.due) : ''}. Send this link to your class:</p>
      <div class="t-link"><input type="text" readonly value="${esc(link)}" aria-label="Homework link"><button type="button" class="btn small" data-t="copyout">Copy link</button></div>
      <div class="t-share"><a class="btn small ghost" href="${esc(share)}" target="_blank" rel="noopener">Share to Google Classroom</a><a class="btn small ghost" href="${esc(link)}" target="_blank" rel="noopener">Preview as a student</a><button type="button" class="btn small ghost" data-t="print" data-id="${P.id}">Print a paper copy</button></div>
      <p class="t-tell">Tell the class: <i>“Do the questions, then hand in your completion code as a private comment.”</i> Then open <a href="#teach-results">Class results</a>.</p></div>`;
  }
  async function printHW(id) { const h = myHW().find(x => x.P.id === id); if (!h) return; const items = (await resolve(h.P.it)).filter(Boolean); printSheet(h.P.t, `${h.P.cl ? h.P.cl + ' · ' : ''}${plural(items.length, 'question')}${h.P.due ? ' · due ' + fmtDay(h.P.due) : ''}${h.P.by ? ' · ' + h.P.by : ''}`, items); }

  /* =====================================================================
     FOR TEACHERS: class results
     ===================================================================== */
  let RS = { hw: null, sort: 'name', qsort: 'order' };
  function parseCodes(text) {
    const out = [], bad = []; (text.match(/QH1\.[A-Za-z0-9_-]+\.[0-9a-f]{4}/g) || []).forEach(c => { const [, d, s] = c.split('.');
      try { const o = JSON.parse(unb64(d)); if (sum4(d) !== s) { bad.push(o.n || '?'); return; } out.push(o); } catch (e) { bad.push('?'); } });
    return { out, bad, found: (text.match(/QH1\./g) || []).length };
  }
  function vResults(v) {
    document.title = 'Class results · Quilio';
    const mine = myHW(), saved = store.get('gc.teach.codes', '');
    v.innerHTML = `<div class="page cr teach">${crumbs(['For teachers', 'Class results'])}${teachNav('teach-results')}
      <header class="page-head"><p class="kicker">For teachers</p><h1>Class results</h1><p>Paste every completion code your students handed in. You can paste a whole column from a spreadsheet or all the Classroom comments at once: Quilio finds the codes in the text.</p></header>
      <div class="panel t-paste"><textarea id="rsIn" placeholder="Paste the codes here (they start with QH1.)" spellcheck="false">${esc(saved)}</textarea><div class="t-paste-row"><button type="button" class="btn" data-r="go">Show the results ${ARROW}</button><button type="button" class="chip" data-r="clear">Clear</button><span id="rsMsg" class="t-msg"></span></div></div>
      <div id="rsOut"></div></div>`;
    if (saved) showResults();
  }
  async function showResults() {
    const text = $('#rsIn').value; store.set('gc.teach.codes', text);
    const { out, bad, found } = parseCodes(text), msg = $('#rsMsg'), box = $('#rsOut');
    if (!found) { msg.textContent = 'No codes found yet. They start with QH1.'; box.innerHTML = ''; return; }
    const groups = {}; out.forEach(o => { (groups[o.h] = groups[o.h] || []).push(o); });
    const ids = Object.keys(groups); if (!RS.hw || !groups[RS.hw]) RS.hw = ids.sort((a, b) => groups[b].length - groups[a].length)[0];
    msg.innerHTML = `${plural(out.length, 'code')} read${bad.length ? ` · <b class="t-warn">${plural(bad.length, 'code')} edited by hand, left out${bad.filter(n => n !== '?').length ? ': ' + bad.filter(n => n !== '?').map(esc).join(', ') : ''}</b>` : ''}`;
    // latest code per student wins
    const byName = new Map(); groups[RS.hw].forEach(o => { const k = o.n.trim().toLowerCase(), was = byName.get(k); if (!was || o.f > was.f) byName.set(k, o); });
    const S = [...byName.values()], P = S[0], items = await resolve(P.it), nQ = items.length;
    const got = o => o.r.reduce((a, r) => a + (r ? r[0] : 0), 0), max = items.reduce((a, it) => a + (it ? marksOf(it) : 0), 0);
    const late = o => o.due && new Date(o.f * 60000).toISOString().slice(0, 10) > o.due;
    const avg = S.length ? Math.round(S.reduce((a, o) => a + pc(got(o), max), 0) / S.length) : 0, times = S.map(o => o.s).sort((a, b) => a - b), med = times[times.length >> 1] || 0;
    // per question
    const Q = items.map((it, k) => { if (!it) return null; const rs = S.map(o => o.r[k]).filter(Boolean), m = marksOf(it), right = rs.filter(r => r[0] === r[1]).length, marks = rs.reduce((a, r) => a + r[0], 0), peeked = rs.filter(r => r[2] === 's').length;
      const picks = isMC(it) ? it.q.o.map((_, j) => rs.filter(r => r[2] === j).length) : null; return { k, it, n: rs.length, right, p: rs.length ? Math.round(marks / (rs.length * m) * 100) : 0, picks, peeked }; });
    // per lecture
    const byL = {}; Q.forEach(x => { if (!x) return; const id = x.it.src; (byL[id] = byL[id] || []).push(x.p); });
    const weak = Object.entries(byL).map(([id, ps]) => [id, Math.round(ps.reduce((a, b) => a + b, 0) / ps.length)]).sort((a, b) => a[1] - b[1]);
    const rows = S.slice().sort(RS.sort === 'score' ? (a, b) => got(b) - got(a) : RS.sort === 'low' ? (a, b) => got(a) - got(b) : (a, b) => a.n.localeCompare(b.n));
    const cell = (r, it) => !r ? '<td class="c-x">–</td>' : r[2] === 's' ? '<td class="c-s" title="Looked at the answer first">👁</td>' : r[0] === r[1] ? '<td class="c-ok">✓</td>' : r[0] ? `<td class="c-part">${r[0]}/${r[1]}</td>` : `<td class="c-no">${isMC(it) && r[2] !== '' && r[2] >= 0 ? String.fromCharCode(65 + r[2]) : '✗'}</td>`;
    const qOrder = Q.filter(Boolean).slice().sort(RS.qsort === 'hard' ? (a, b) => a.p - b.p : (a, b) => a.k - b.k);
    box.innerHTML = `${ids.length > 1 ? `<div class="cr-seg t-hwpick">${ids.map(id => `<button type="button" class="chip${id === RS.hw ? ' is-on' : ''}" data-r="hw" data-v="${id}">${esc(groups[id][0].ti)} (${groups[id].length})</button>`).join('')}</div>` : ''}
      <section class="r-sum"><h2>${esc(P.ti)}${P.cl ? ` <small>${esc(P.cl)}</small>` : ''}</h2><div class="rec-stats"><div class="panel"><b>${S.length}</b><span>${S.length === 1 ? 'student' : 'students'} handed in</span></div><div class="panel"><b>${avg}%</b><span>class average</span></div><div class="panel"><b>${mins(med)}</b><span>typical time</span></div>${P.due ? `<div class="panel"><b>${S.filter(late).length}</b><span>handed in late</span></div>` : ''}</div>
        ${weak.length ? `<div class="panel r-weak"><h3>Reteach first</h3><ol>${weak.slice(0, 3).map(([id, p]) => { const L = GC.BY[id]; return `<li style="${hue(L)}"><a href="#${id}"><span class="tag">${L.stage.label} ${L.code}</span>${esc(L.title)}</a><span class="r-bar"><i style="width:${p}%"></i></span><b>${p}%</b></li>`; }).join('')}</ol></div>` : ''}</section>
      <section class="r-grid-sec"><div class="r-head"><h2>The class at a glance</h2><div class="cr-seg">${[['name', 'A–Z'], ['score', 'Highest first'], ['low', 'Lowest first']].map(([k, l]) => `<button type="button" class="chip${RS.sort === k ? ' is-on' : ''}" data-r="sort" data-v="${k}">${l}</button>`).join('')}<button type="button" class="chip" data-r="csv">Download CSV</button></div></div>
        <div class="panel r-grid-wrap"><table class="r-grid"><thead><tr><th>Student</th><th>Score</th><th>Time</th>${items.map((it, k) => `<th><a href="#teach-results" data-r="jump" data-v="${k}" title="${esc(it ? qText(it).slice(0, 120) : '')}">Q${k + 1}</a></th>`).join('')}</tr></thead>
        <tbody>${rows.map(o => `<tr><th>${esc(o.n)}${late(o) ? ' <em class="r-late">late</em>' : ''}</th><td class="r-score"><b>${pc(got(o), max)}%</b><small>${got(o)}/${max}</small></td><td>${mins(o.s)}</td>${items.map((it, k) => it ? cell(o.r[k], it) : '<td class="c-x">–</td>').join('')}</tr>`).join('')}</tbody>
        <tfoot><tr><th>Class</th><td></td><td></td>${Q.map(x => x ? `<td class="r-pc ${x.p >= 70 ? 'ok' : x.p >= 40 ? 'mid' : 'no'}">${x.p}%</td>` : '<td></td>').join('')}</tr></tfoot></table></div>
        <p class="r-key"><span class="c-ok">✓</span> right first time <span class="c-no">✗</span> wrong (a letter is the option they chose) <span class="c-part">1/3</span> some marks <span class="c-s">👁</span> looked at the answer first</p></section>
      <section class="r-qs"><div class="r-head"><h2>Question by question</h2><div class="cr-seg">${[['order', 'In order'], ['hard', 'Hardest first']].map(([k, l]) => `<button type="button" class="chip${RS.qsort === k ? ' is-on' : ''}" data-r="qsort" data-v="${k}">${l}</button>`).join('')}</div></div>
        ${qOrder.map(x => { const L = GC.BY[x.it.src], q = x.it.q, top = x.picks ? x.picks.map((c, j) => [c, j]).filter(([c, j]) => j !== q.a).sort((a, b) => b[0] - a[0])[0] : null;
          return `<article class="panel r-q" id="rq-${x.k}" style="${hue(L)}"><header><b>Q${x.k + 1}</b><span class="tag">${L.stage.label} ${L.code}</span><span class="t-kind k-${x.it.k}">${KIND[x.it.k]}</span><span class="r-qp ${x.p >= 70 ? 'ok' : x.p >= 40 ? 'mid' : 'no'}">${x.p}% ${x.it.k === 'q' ? 'of the marks' : 'right'}</span></header>
            <div class="r-qt">${il(q.q)}</div>
            ${x.picks ? `<ul class="r-opts">${q.o.map((o, j) => `<li class="${j === q.a ? 'is-right' : top && j === top[1] && top[0] ? 'is-trap' : ''}"><span class="r-l">${String.fromCharCode(65 + j)}</span><span class="r-ot">${il(o)}</span><span class="r-bar"><i style="width:${pc(x.picks[j], x.n)}%"></i></span><b>${x.picks[j]}</b></li>`).join('')}</ul>
              ${top && top[0] ? `<p class="r-note"><b>Most common wrong answer: ${String.fromCharCode(65 + top[1])}</b> (${plural(top[0], 'student')}). Worth talking through why it is tempting.</p>` : ''}`
            : x.it.k === 'q' ? `<p class="r-note">Mark scheme points: ${q.p.map(p => il(p[0])).join(' · ')}</p>` : `<p class="r-note">Answer: <b>${esc(String(x.it.k === 'lt' ? q.a : q.a[0]))}</b>. ${x.right} of ${x.n} got it on the first try.</p>`}
            ${x.peeked ? `<p class="r-note r-peek">👁 ${plural(x.peeked, 'student')} looked at the working before answering.</p>` : ''}</article>`; }).join('')}</section>`;
    RS.data = { S: rows, items, max, got, P, late };
  }
  function csv() {
    const D = RS.data; if (!D) return; const q = s => `"${String(s).replace(/"/g, '""')}"`;
    const lines = [['Student', 'Score', 'Out of', 'Percent', 'Minutes', 'Late', ...D.items.map((_, k) => 'Q' + (k + 1))].map(q).join(',')];
    D.S.forEach(o => lines.push([o.n, D.got(o), D.max, pc(D.got(o), D.max), Math.round(o.s / 60), D.late(o) ? 'yes' : '', ...o.r.map(r => r ? (r[2] === 's' ? 'looked' : r[0]) : '')].map(q).join(',')));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' })); a.download = (D.P.ti || 'results').replace(/[^\w\- ]+/g, '') + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- clicks and inputs ---------- */
  view.addEventListener('click', async e => {
    const b = e.target.closest('[data-mk],[data-hw],[data-t],[data-r]'); if (!b) return;
    if (b.dataset.mk) { const a = b.dataset.mk; if (a === 'f') { mkFilter = b.dataset.v; vMistakes(view); } else if (a === 's') { mkStage = b.dataset.v; vMistakes(view); } else if (a === 'print') printMistakes(); return; }
    if (b.dataset.hw) { if (b.dataset.hw === 'code') makeCode(); else if (b.dataset.hw === 'copy') copy(HW.S.code, b); return; }
    if (b.dataset.t) { const a = b.dataset.t;
      if (a === 'stage') { T.stage = b.dataset.v; T.q = ''; $('#tSearch').value = ''; $$('[data-t="stage"]').forEach(x => x.classList.toggle('is-on', x === b)); renderLec(); }
      else if (a === 'unlec') { T.lec.delete(b.dataset.v); renderLec(); renderQ(); }
      else if (a === 'mode') { T.mode = b.dataset.v; $$('[data-t="mode"]').forEach(x => x.classList.toggle('is-on', x === b)); renderQ(); }
      else if (a === 'make') makeHW();
      else if (a === 'copyout') copy($('.t-link input').value, b);
      else if (a === 'copylink') { const h = myHW().find(x => x.P.id === b.dataset.id); if (h) copy(hwLink(h.P), b); }
      else if (a === 'results') RS.hw = b.dataset.id;
      else if (a === 'print') printHW(b.dataset.id);
      return; }
    if (b.dataset.r) { const a = b.dataset.r;
      if (a === 'go') showResults(); else if (a === 'clear') { $('#rsIn').value = ''; store.set('gc.teach.codes', ''); $('#rsOut').innerHTML = ''; $('#rsMsg').textContent = ''; }
      else if (a === 'sort') { RS.sort = b.dataset.v; showResults(); } else if (a === 'qsort') { RS.qsort = b.dataset.v; showResults(); } else if (a === 'hw') { RS.hw = b.dataset.v; showResults(); }
      else if (a === 'csv') csv(); else if (a === 'jump') { e.preventDefault(); RS.qsort = 'order'; const t = $('#rq-' + b.dataset.v); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
  });
  view.addEventListener('change', e => { const t = e.target;
    if (t.dataset.t === 'lec') { t.checked ? T.lec.add(t.value) : T.lec.delete(t.value); [...T.pick].forEach(r => { if (!T.lec.has(r.split('~')[0])) T.pick.delete(r); }); renderLec(); renderQ(); }
    else if (t.dataset.t === 'pick') { t.checked ? T.pick.add(t.value) : T.pick.delete(t.value); const n = $('#tPickN'); if (n) n.textContent = T.pick.size; }
    else if (t.id === 'tN') T.n = +t.value; });
  view.addEventListener('input', e => { if (e.target.id === 'tSearch') { T.q = e.target.value; renderLec(); } if (e.target.id === 'hwName') e.target.classList.remove('is-bad'); });

  /* =====================================================================
     MARK SCHEME FEEDBACK: after a written answer is marked, show what examiners look for
     ===================================================================== */
  const groupsOf = keys => String(keys || '').split(' & ').map(g => g.trim()).filter(g => g && g[0] !== '!').map(g => g.split('|').map(k => k.trim().replace(/^=/, '')).filter(Boolean));
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function markUp(text, words) {
    let h = esc(text); const ws = [...new Set(words)].filter(w => w.length > 1).sort((a, b) => b.length - a.length); if (!ws.length) return h;
    const re = new RegExp('([A-Za-z]*(?:' + ws.map(w => reEsc(esc(w)).replace(/\s+/g, '\\s+')).join('|') + ')[A-Za-z]*)', 'gi'); return h.replace(re, '<mark>$1</mark>');
  }
  function enhance(fb) {
    if (fb.hidden || $('.msx', fb) || !$('.pts li', fb) || !/out of/.test(fb.textContent)) return;
    const el = fb.closest('.q'); if (!el || el.dataset.k !== 'q') return;
    let q = null; if (el.dataset.src) { const it = RV.item(el); q = it && it.q; } else { const c = GC.cur(); q = c && c.rec.q[+el.dataset.i]; }
    if (!q || !q.p) return; const ta = $('textarea', el), txt = ta ? ta.value : '', norm = GC.norm(txt);
    const lis = $$('.pts li', fb), used = [], missed = [];
    q.p.forEach((p, k) => { const gs = groupsOf(p[1]), hit = lis[k] && lis[k].classList.contains('hit');
      gs.forEach(alts => { const found = alts.filter(a => norm.includes(GC.norm(a).trim())); if (found.length) used.push(...found); });
      if (!hit && gs.length) missed.push([p[0], gs]); });
    const box = document.createElement('div'); box.className = 'msx';
    box.innerHTML = `${missed.length ? `<p class="msx-h">To score the points you missed, examiners look for:</p><ul class="msx-list">${missed.map(([t, gs]) => `<li><span class="msx-pt">${il(t)}</span><span class="msx-keys">${gs.map(alts => alts.map(a => `<mark>${esc(a)}</mark>`).join(' <i>or</i> ')).join(' <b>+</b> ')}</span></li>`).join('')}</ul>` : '<p class="msx-h">Every mark scheme point was there. 🎯</p>'}
      ${txt.trim() ? `<p class="msx-h">Your answer, with the words that scored highlighted:</p><blockquote class="msx-yours">${markUp(txt, used)}</blockquote>` : ''}`;
    fb.appendChild(box);
  }
  new MutationObserver(ms => { ms.forEach(m => { const fb = m.target.nodeType === 1 && (m.target.classList.contains('fb') ? m.target : null); if (fb) enhance(fb); }); })
    .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });

  window.Classroom = { teach: (v, h) => h === 'teach-results' ? vResults(v) : vTeach(v), hw: vHW, mistakes: vMistakes, leave: () => { HW = null; } };
  // the router may have run before this file loaded: if the address is one of these pages, show it now
  if (/^#(teach|teach-results|mistakes|hw=)/.test(location.hash) && GC.IDX) window.dispatchEvent(new HashChangeEvent('hashchange'));
})();
