/* Quilio: Olympiad Training, a full preparation course inside the Olympiad section.
   #olympiad-train (your plan) · #olympiad-m-<id> (one module) · #olympiad-review (spaced review) · #olympiad-sprint (timed mixed quiz)
   Each module: Learn (three concepts, each with a quick check) → a worked example revealed one step at a time, with a
   "think first" question before every step → a three-rung problem ladder with two hints, smart feedback and a
   step-by-step solution → flashcards. Anything missed comes back in Review after growing gaps (spaced repetition).
   Content lives in train-data.js. Progress is kept in this browser only. */
(function () {
  'use strict';
  const GC = () => window.GC || {};
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const il = s => (GC().inline ? GC().inline(s) : esc(s));
  const md = s => (window.QuilioFormat ? window.QuilioFormat.md(s) : '<p>' + il(s) + '</p>');
  const flat = s => String(s || '').replace(/\$/g, '');
  const M = window.TRAIN_MODS || [], BY = Object.fromEntries(M.map(m => [m.id, m]));
  const DAY = 864e5, LV = { 1: 'Entry', 2: 'Intermediate', 3: 'Advanced' };
  const PH = { 1: 'Foundations', 2: 'Olympiad core', 3: 'Beyond A Level' };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------------- progress ---------------- */
  const KEY = 'gc.train';
  let S = (() => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } })();
  ['chk', 'lad', 'ex', 'card', 'rev'].forEach(k => { if (!S[k] || typeof S[k] !== 'object') S[k] = {}; });
  if (!Array.isArray(S.sprints)) S.sprints = [];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  // spaced repetition: good → the gap grows (1, 2.5, 6, 16 … days); again → due now; later → due tomorrow, gap reset
  function schedule(key, grade) {
    const r = S.rev[key] || { iv: 0 }, now = Date.now();
    if (grade === 'good') { r.iv = r.iv ? Math.min(90, r.iv * 2.5) : 1; r.due = now + r.iv * DAY; }
    else if (grade === 'later') { r.iv = 0; r.due = now + 0.75 * DAY; }
    else { r.iv = 0; r.due = now; }
    S.rev[key] = r; save();
  }
  function item(key) {
    const [t, mid, n] = String(key).split(':'), m = BY[mid], i = +n; if (!m) return null;
    if (t === 'q' && m.learn[i]) return { t, m, i, key, q: m.learn[i].q };
    if (t === 'l' && m.lad[i]) return { t, m, i, key, r: m.lad[i] };
    if (t === 'c' && m.cards[i]) return { t, m, i, key, c: m.cards[i] };
    return null;
  }
  const dueKeys = () => Object.keys(S.rev).filter(k => S.rev[k].due <= Date.now() && item(k)).sort((a, b) => S.rev[a].due - S.rev[b].due);
  function mastery(m) {
    const ch = m.learn.filter((l, i) => S.chk[`q:${m.id}:${i}`]).length / m.learn.length;
    const ex = Math.min(1, (S.ex[m.id] || 0) / m.ex.steps.length);
    const ld = m.lad.reduce((a, r, i) => { const s = S.lad[`l:${m.id}:${i}`]; return a + (!s || !s.ok ? 0 : s.sol ? 0.5 : s.h ? 0.8 : 1); }, 0) / m.lad.length;
    const cd = m.cards.filter((c, i) => S.card[`c:${m.id}:${i}`]).length / m.cards.length;
    return 0.2 * ch + 0.15 * ex + 0.45 * ld + 0.2 * cd;
  }
  const started = m => mastery(m) > 0 || Object.keys(S.rev).some(k => k.split(':')[1] === m.id);
  const pct = x => Math.round(x * 100);
  const status = x => x >= 0.85 ? ['Strong', 'is-strong'] : x > 0 ? ['In progress', 'is-going'] : ['Not started', ''];
  function when(t) {
    const d = t - Date.now(); if (d <= 0) return 'now';
    const h = d / 36e5; if (h < 1) return 'within the hour'; if (h < 20) return `in about ${Math.round(h)} hour${Math.round(h) === 1 ? '' : 's'}`;
    const days = Math.round(d / DAY); return days <= 1 ? 'tomorrow' : `in ${days} days`;
  }

  /* ---------------- targets ---------------- */
  const TARGETS = {
    c3l6: { name: 'C3L6', full: 'Cambridge Chemistry Challenge (Lower Sixth)', core: 8,
      blurb: 'Two long questions in 90 minutes. It rewards secure A Level chemistry used in unfamiliar settings, so the foundations come first; the last modules are stretch.',
      order: ['moles', 'titrations', 'energy', 'equilibrium', 'acids', 'organic', 'spectro', 'kinetics', 'gibbs', 'electro', 'ksp', 'crystal', 'steady'],
      week: ['Two modules a week, in plan order', 'Review for 5 to 10 minutes on every day you study', 'One sprint at the weekend', 'From week 3: a past-paper question every other day from the Past papers tab'] },
    ukcho: { name: 'UKChO', full: 'UK Chemistry Olympiad, Round 1', core: 11,
      blurb: 'Two hours, five or six long questions. Calculations, organic chemistry and structure determination appear every year; crystal field theory and steady-state kinetics turn up in the harder parts.',
      order: ['moles', 'titrations', 'energy', 'equilibrium', 'acids', 'organic', 'spectro', 'kinetics', 'electro', 'gibbs', 'ksp', 'crystal', 'steady'],
      week: ['Three modules a week, in plan order', 'Daily review, 10 minutes', 'A sprint every weekend', 'From week 3: one recreated Round 1 paper a week from the Past papers tab, newest first, timed at 2 hours'] },
    usnco: { name: 'USNCO', full: 'US National Chemistry Olympiad', core: 11,
      blurb: 'The Local Exam is 60 multiple-choice questions, so breadth and speed matter most. This order follows the exam’s spread of topics; sprints train the pace you need.',
      order: ['moles', 'energy', 'equilibrium', 'acids', 'ksp', 'kinetics', 'electro', 'gibbs', 'organic', 'spectro', 'titrations', 'steady', 'crystal'],
      week: ['Three modules a week, in plan order', 'Daily review, 10 minutes', 'Two sprints a week: aim for under 1 minute 50 seconds a question', 'From week 2: past-paper questions on the topics you have finished'] },
    icho: { name: 'IChO track', full: 'National finals and the IChO', core: 13,
      blurb: 'All thirteen modules, ending with the Beyond A Level topics that national finals and the IChO preparatory problems use.',
      order: ['moles', 'energy', 'equilibrium', 'acids', 'titrations', 'gibbs', 'ksp', 'kinetics', 'electro', 'organic', 'spectro', 'steady', 'crystal'],
      week: ['Three modules a week until all thirteen are strong', 'Daily review; sprints keep the basics fast', 'Then IChO preparatory problems on the Beyond topics from the IChO syllabus tab', 'Recreated past papers under exam conditions, one a week'] },
  };
  const target = () => TARGETS[S.target] ? S.target : 'ukcho';
  const plan = () => TARGETS[target()].order.filter(id => BY[id]);

  /* ---------------- small builders ---------------- */
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  function order(key, n) { // a fixed shuffle per question, so the right answer is not always in the same place
    const a = [...Array(n).keys()]; let x = hash(key) || 7;
    for (let i = n - 1; i > 0; i--) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const rnd = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const opts = (q, ord, sel) => `<div class="tr-opts" role="group" aria-label="Answers">${ord.map((i, n) => `<button type="button" class="tr-opt${sel === i ? ' is-sel' : ''}" data-o="${i}"><i>${'ABCDEF'[n]}</i><span>${il(q.o[i])}</span></button>`).join('')}</div>`;
  function concept(m, c) {
    if (typeof c === 'string') { const [mid, i] = c.split(':'), mm = BY[mid]; return mm && mm.learn[+i] ? { m: mm, i: +i, l: mm.learn[+i] } : null; }
    return m.learn[c] ? { m, i: c, l: m.learn[c] } : null;
  }
  // one worked step: the working, a chip that opens the concept it uses, and a way to ask for another explanation
  function stepHTML(m, st, ctx) {
    const c = concept(m, st.c);
    return `<div class="tr-wtext">${il(st.w)}</div><div class="tr-wtools">${c ? `<button type="button" class="chip wrap tr-cc" data-act="peek" data-c="${c.m.id}:${c.i}">Concept: ${esc(c.l.h)}${c.m !== m ? ` · ${esc(c.m.t)}` : ''}</button>` : ''}</div><div class="tr-peek" hidden></div>`;
  }
  function peek(b) {
    const box = b.closest('.tr-wtools').nextElementSibling, [mid, i] = b.dataset.c.split(':'), mm = BY[mid], l = mm && mm.learn[+i]; if (!l) return;
    if (!box.hidden) { box.hidden = true; b.classList.remove('is-on'); return; }
    const here = location.hash.slice(1) === 'olympiad-m-' + mid;
    box.innerHTML = `<p class="tr-peek-h">${esc(l.h)}</p><div class="tr-md">${md(l.b)}</div>${here ? '' : `<a class="tr-peek-go" href="#olympiad-m-${mid}">Open ${esc(mm.t)} ${ARROW}</a>`}`;
    box.hidden = false; b.classList.add('is-on');
  }

  // mistakes worth naming: a factor of 1000, a sign, a power of ten, a mole ratio, rounding
  function diagnose(r, v) {
    if (r.abs != null || !r.a || !isFinite(v) || !v) return '';
    const q = v / r.a, near = x => Math.abs(q - x) <= Math.abs(x) * 0.025;
    if (near(-1)) return 'Right size, wrong sign. Check which way round you subtracted, or whether the change gives out or takes in energy.';
    if (near(1000) || near(0.001)) return 'Out by a factor of 1000: check kJ against J, or cm³ against dm³.';
    if ([10, 0.1, 100, 0.01, 1e4, 1e-4].some(near)) return 'Out by a power of ten: check your units and the powers in your calculation.';
    if ([2, 0.5, 3, 1 / 3, 4, 0.25, 5, 0.2, 6, 1 / 6, 2.5, 0.4, 7].some(near)) return 'Out by a small whole-number factor: check the mole ratio from the equation, or how many ions each formula unit gives.';
    if (Math.abs(q - 1) < 0.05) return 'Very close. Keep more significant figures until the last step, then round.';
    return '';
  }
  const numOf = s => (window.Olympiad && window.Olympiad.num ? window.Olympiad.num(s) : parseFloat(s));
  function right(r, v) {
    if (window.Olympiad && window.Olympiad.ok) return window.Olympiad.ok(r, v);
    return r.abs != null ? Math.abs(v - r.a) <= r.abs + 1e-12 : Math.abs(v - r.a) <= Math.abs(r.a) * ((r.tol || 0.01) + 1e-9);
  }

  /* ---------------- the plan ---------------- */
  function home(head) {
    const T = TARGETS[target()], ids = plan(), core = ids.slice(0, T.core), due = dueKeys().length;
    const next = ids.map(id => BY[id]).find(m => mastery(m) < 0.85), coreM = core.reduce((a, id) => a + mastery(BY[id]), 0) / core.length;
    const best = S.sprints.length ? Math.max(...S.sprints.map(s => Math.round(s.score / s.n * 100))) : null;
    const soon = Object.values(S.rev).filter(r => r.due > Date.now()).sort((a, b) => a.due - b.due)[0];
    let phase = 0;
    return `<div class="page ol tr">${head('olympiad-train', 'Training', 'A complete preparation course, built to be studied, not just read. Every module teaches one big idea, tests it straight away, walks you through a worked example one question at a time, then gives you a ladder of problems with hints and full solutions. What you miss comes back for review until it sticks.')}
      <section class="tr-target panel" aria-label="Your target"><div><p class="kicker">What are you training for?</p><div class="seg tr-seg" role="group" aria-label="Target competition">${Object.entries(TARGETS).map(([k, t]) => `<button type="button" data-target="${k}" class="${k === target() ? 'is-on' : ''}" aria-pressed="${k === target()}">${esc(t.name)}</button>`).join('')}</div></div>
        <div class="tr-tblurb"><h2>${esc(T.full)}</h2><p>${esc(T.blurb)}</p></div>
        <div class="tr-overall"><b>${pct(coreM)}%</b><span>of your ${core.length} core modules</span><div class="meter"><i style="--v:${pct(coreM)}%"></i></div></div></section>
      <div class="tr-today">
        <a class="tr-tcard panel${due ? ' is-due' : ''}" href="#olympiad-review"><span class="kicker">Review</span><b class="tr-big">${due}</b><p>${due ? `item${due === 1 ? '' : 's'} due now. Clear these first: it takes a few minutes and it is where the remembering happens.` : soon ? `Nothing due. Next review ${when(soon.due)}.` : 'Nothing to review yet. Anything you miss in a module will appear here.'}</p><span class="go">${due ? 'Start review' : 'Open review'} ${ARROW}</span></a>
        ${next ? `<a class="tr-tcard panel" href="#olympiad-m-${next.id}"><span class="kicker">Next up · module ${ids.indexOf(next.id) + 1}</span><h3>${esc(next.t)}</h3><div class="meter"><i style="--v:${pct(mastery(next))}%"></i></div><p>${started(next) ? `${pct(mastery(next))}% there. Pick up where you stopped.` : `About ${next.m} minutes. ${esc(PH[next.ph])}.`}</p><span class="go">${started(next) ? 'Continue' : 'Start'} ${ARROW}</span></a>`
          : `<div class="tr-tcard panel"><span class="kicker">Next up</span><h3>Every module is strong.</h3><p>Keep your reviews going, and move on to full past papers.</p><a class="go" href="#olympiad-papers">Past papers ${ARROW}</a></div>`}
        <a class="tr-tcard panel" href="#olympiad-sprint"><span class="kicker">Sprint</span><h3>12 questions · 20 minutes</h3><p>Mixed topics against the clock, like a multiple-choice paper. ${best != null ? `Your best: ${best}%.` : 'Find out what you really know.'}</p><span class="go">Start a sprint ${ARROW}</span></a>
      </div>
      <section class="tr-plan" aria-label="Your plan"><h2>Your ${esc(T.name)} plan</h2>
        <ol class="tr-rows">${ids.map((id, k) => { const m = BY[id], x = mastery(m), [st, sc] = status(x); const cut = k === T.core ? '<li class="tr-stretch">Stretch: beyond what this competition usually needs</li>' : ''; return `${cut}<li><a class="tr-row panel${k >= T.core ? ' is-stretch' : ''}" href="#olympiad-m-${id}"><b class="tr-n">${String(k + 1).padStart(2, '0')}</b><div class="tr-rmain"><h3>${esc(m.t)}</h3><small><span class="tr-ph p${m.ph}">${esc(PH[m.ph])}</span> ${m.m} min · ${m.learn.length} concepts · worked example · ${m.lad.length}-rung ladder · ${m.cards.length} cards</small></div><div class="tr-rmeter"><div class="meter"><i style="--v:${pct(x)}%"></i></div><span class="tr-st ${sc}">${st}${x > 0 && x < 0.85 ? ` · ${pct(x)}%` : ''}</span></div></a></li>`; }).join('')}</ol></section>
      <section class="tr-how" aria-label="How a module works"><h2>How every module works</h2>
        <ol class="tr-flow">
          <li><b>Learn</b><span>Three short concepts. Each ends with a quick check, because answering a question fixes an idea far better than reading it again.</span></li>
          <li><b>Worked example</b><span>Every step starts with a question. Answer it in your head first, then reveal. Each step links to the concept it uses.</span></li>
          <li><b>Problem ladder</b><span>Entry, Intermediate, Advanced. Two hints before the solution; feedback that spots unit slips, sign errors and wrong ratios.</span></li>
          <li><b>Flashcards</b><span>The facts and equations you should never have to stop and think about.</span></li>
          <li><b>Review</b><span>Anything you missed, or needed the solution for, comes back tomorrow, then after longer and longer gaps.</span></li>
        </ol>
        <div class="tr-why panel"><h3>Why it is built like this</h3><ul>
          <li><b>Retrieval:</b> testing yourself builds memory more than rereading does.</li>
          <li><b>Spacing:</b> reviewing just as you start to forget makes knowledge last for the exam, not just for tomorrow.</li>
          <li><b>Worked examples, then fading:</b> you see an expert solve one, then solve harder ones yourself with less help each rung.</li>
          <li><b>Mixing:</b> sprints jumble the topics, so you practise recognising what kind of problem you are facing, as you must in a real paper.</li></ul></div></section>
      <section class="ol-sec"><h2>A week of ${esc(T.name)} training</h2><ul class="ol-list">${T.week.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
        <p class="ol-note">Progress is saved in this browser. The modules are original, written for Quilio, and every number in them has been checked by calculation.</p></section></div>`;
  }

  /* ---------------- one module ---------------- */
  function module(id, head) {
    const m = BY[id], ids = plan(), k = ids.indexOf(id), nextM = BY[ids[k + 1]], T = TARGETS[target()];
    const P = (window.Olympiad && window.Olympiad.P) || [], more = m.more.map(pid => P.find(p => p.id === pid)).filter(Boolean);
    const lecs = m.lec.map(lid => { const L = (GC().BY || {})[lid]; return L ? `<a class="ol-lec" href="#${lid}">${L.stage.label} ${L.code} ${esc(L.title)}</a>` : ''; }).filter(Boolean);
    return `<div class="page ol tr">${head('olympiad-m-' + id, m.t, '')}
      <header class="tr-mhead panel"><div class="tr-mtop"><span class="tr-ph p${m.ph}">Phase ${m.ph} · ${esc(PH[m.ph])}</span>${k >= 0 ? `<span>Module ${k + 1} of ${ids.length} in your ${esc(T.name)} plan</span>` : ''}<span>about ${m.m} min</span>${m.comps.map(c => `<span class="ol-tag">${esc(c)}</span>`).join('')}</div>
        <p class="tr-whyline"><b>Why it matters.</b> ${esc(m.why)}</p>
        ${lecs.length ? `<p class="ol-learn">Shaky on the basics? Read first: ${lecs.join(' ')}</p>` : ''}
        <div class="tr-mm"><div class="meter"><i style="--v:${pct(mastery(m))}%"></i></div><span><b>${pct(mastery(m))}%</b> mastered</span></div></header>
      <nav class="tr-nav" aria-label="Module sections">${[['tr-learn', '1', 'Learn'], ['tr-ex', '2', 'Worked example'], ['tr-lad', '3', 'Problem ladder'], ['tr-cards', '4', 'Flashcards']].map(([t, n, l]) => `<button type="button" data-go="${t}"><i>${n}</i>${l}<s data-tick="${t}"></s></button>`).join('')}</nav>
      <section class="tr-sec" id="tr-learn"><h2><i>1</i>Learn</h2>
        ${m.learn.map((l, i) => { const key = `q:${m.id}:${i}`; return `<article class="tr-con panel"><h3><span>${i + 1}</span>${esc(l.h)}</h3><div class="tr-md">${md(l.b)}</div>
          <div class="tr-check${S.chk[key] ? ' was-right' : ''}" data-key="${key}"><p class="tr-qk">Quick check${S.chk[key] ? ' <em>· answered before</em>' : ''}</p><p class="tr-qtext">${il(l.q.q)}</p>${opts(l.q, order(key, l.q.o.length))}<div class="fb" hidden></div></div></article>`; }).join('')}</section>
      <section class="tr-sec" id="tr-ex"><h2><i>2</i>Worked example: ${esc(m.ex.t)}</h2><p class="tr-tip">Before each step, answer the question yourself: in your head, out loud, or on paper. Then reveal and compare. That moment of comparing is where you learn.</p><div class="tr-exbody">${exBody(m)}</div></section>
      <section class="tr-sec" id="tr-lad"><h2><i>3</i>Problem ladder</h2><p class="tr-tip">Three rungs, each harder. Try without help first; take a hint before you take the solution. If you need the solution, that rung returns in your review tomorrow so you can do it on your own.</p>
        ${m.lad.map((r, j) => rung(m, r, j)).join('')}</section>
      <section class="tr-sec" id="tr-cards"><h2><i>4</i>Flashcards</h2><p class="tr-tip">Say the answer before you flip. Be honest: “Again” brings the card back sooner, which is exactly what you want.</p>
        <div class="tr-fcs">${m.cards.map((c, i) => { const key = `c:${m.id}:${i}`; return `<div class="tr-fc${S.card[key] ? ' is-known' : ''}" data-key="${key}"><button type="button" class="tr-fc-in" data-act="flip" aria-label="Flip the card"><span class="tr-face tr-front">${il(c[0])}</span><span class="tr-face tr-back">${il(c[1])}</span></button><div class="tr-fc-rate"><button type="button" class="chip" data-act="again">Again</button><button type="button" class="chip" data-act="got">Got it</button></div></div>`; }).join('')}</div></section>
      <section class="tr-end panel"><div><h2>Finished this module?</h2><p>${more.length ? 'Test it on full olympiad-style problems:' : 'Keep it fresh with your reviews.'}</p>${more.length ? `<p class="tr-more">${more.map(p => `<a class="chip wrap" href="#olympiad-p-${p.id}">${esc(p.t)}</a>`).join('')}</p>` : ''}</div>
        <div class="tr-endgo"><a class="btn small ghost" href="#olympiad-review">Review (<span data-due>${dueKeys().length}</span> due)</a>${nextM ? `<a class="btn small" href="#olympiad-m-${nextM.id}">Next: ${esc(nextM.t)} ${ARROW}</a>` : `<a class="btn small" href="#olympiad-sprint">Take a sprint ${ARROW}</a>`}</div></section>
      <nav class="lect-nav" aria-label="Plan"><a href="#olympiad-train"><small>Back to</small><b>Your ${esc(T.name)} plan</b></a>${nextM ? `<a href="#olympiad-m-${nextM.id}"><small>Next module</small><b>${esc(nextM.t)}</b></a>` : '<span></span>'}</nav></div>`;
  }
  function exBody(m) {
    const n = m.ex.steps.length, shown = Math.min(S.ex[m.id] || 0, n);
    return `<div class="ol-stem">${il(m.ex.s)}</div>
      <ol class="tr-ws">${m.ex.steps.map((st, k) => k > shown ? '' : `<li class="tr-w${k < shown ? ' is-shown' : ' is-next'}"><p class="tr-think"><b>Think first.</b> ${il(st.p)}</p>
        ${k < shown ? stepHTML(m, st, `${m.ex.s}\n\nStep: ${st.w}`) : `<div class="tr-wact"><button type="button" class="btn small" data-act="reveal">Reveal step ${k + 1} of ${n}</button><button type="button" class="chip" data-act="revealall">Show every step</button></div>`}</li>`).join('')}</ol>
      ${shown >= n ? `<div class="tr-ans"><b>Answer.</b> <span>${il(m.ex.ans)}</span><button type="button" class="chip" data-act="exreset">Hide the steps and try it cold</button></div>` : ''}`;
  }
  function rungState(key) { const s = S.lad[key]; if (!s) return ['', '']; if (s.ok) return s.sol ? ['Solved after the solution', 'is-sol'] : s.h ? ['Solved with hints', 'is-hint'] : ['Solved', 'is-ok']; if (s.sol) return ['Solution seen · back tomorrow', 'is-sol']; if (s.tries) return ['Not yet', '']; return ['', '']; }
  function rung(m, r, j) {
    const key = `l:${m.id}:${j}`, [st, sc] = rungState(key);
    return `<article class="tr-rung panel${S.lad[key] && S.lad[key].ok ? ' is-done' : ''}" data-key="${key}">
      <div class="tr-rtop"><span class="tr-rn">Rung ${j + 1}</span><span class="ol-lv l${r.lv}">${LV[r.lv]}</span><h3>${esc(r.t)}</h3><span class="tr-pill ${sc}">${st}</span></div>
      <div class="tr-rstem">${il(r.s)}</div>
      ${r.a != null ? `<div class="q-in"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer to rung ${j + 1}" placeholder="your answer${r.u ? ' in ' + esc(r.u) : ''}"><button type="button" class="btn small" data-act="check">Check</button>${r.u ? `<span class="ol-unit">${esc(r.u)}</span>` : ''}</div>`
        : `<textarea class="tr-txt" rows="3" aria-label="Your answer to rung ${j + 1}" placeholder="Write your answer and your reasons, then compare."></textarea><div><button type="button" class="btn small" data-act="model">Compare with the model answer</button></div>`}
      <div class="ol-tools"><button type="button" class="chip" data-act="hint">Hint 1 of ${r.h.length}</button><button type="button" class="chip" data-act="sol">Solution, step by step</button></div>
      <div class="fb" hidden></div><div class="tr-hints"></div><ol class="tr-sol" hidden></ol></article>`;
  }
  function refresh(view, m) {
    const x = mastery(m), mm = $('.tr-mm', view); if (mm) { $('i', mm).style.setProperty('--v', pct(x) + '%'); $('b', mm).textContent = pct(x) + '%'; }
    const done = { 'tr-learn': m.learn.every((l, i) => S.chk[`q:${m.id}:${i}`]), 'tr-ex': (S.ex[m.id] || 0) >= m.ex.steps.length, 'tr-lad': m.lad.every((r, i) => S.lad[`l:${m.id}:${i}`] && S.lad[`l:${m.id}:${i}`].ok), 'tr-cards': m.cards.every((c, i) => S.card[`c:${m.id}:${i}`]) };
    $$('[data-tick]', view).forEach(s => s.parentElement.classList.toggle('is-done', !!done[s.dataset.tick]));
    $$('[data-due]', view).forEach(s => { s.textContent = dueKeys().length; });
  }
  function pick(box, q, o, after) { // mark a multiple-choice answer; returns whether it was right
    const ok = o === q.a; $$('.tr-opt', box).forEach(b => { b.disabled = true; const i = +b.dataset.o; b.classList.toggle('is-ok', i === q.a); b.classList.toggle('is-no', i === o && !ok); });
    const fb = $('.fb', box); fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = `<b>${ok ? 'Right.' : 'Not quite.'}</b> ${il(q.x)}${after || ''}`;
    return ok;
  }
  function bindModule(view, m) {
    refresh(view, m);
    view.onclick = e => {
      const go = e.target.closest('[data-go]'); if (go) { const t = document.getElementById(go.dataset.go); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const o = e.target.closest('.tr-opt'); if (o && !o.disabled) {
        const box = o.closest('.tr-check'), key = box.dataset.key, it = item(key), ok = pick(box, it.q, +o.dataset.o, '');
        if (ok) S.chk[key] = 1; schedule(key, ok ? 'good' : 'again');
        if (!ok) $('.fb', box).insertAdjacentHTML('beforeend', ' <em class="tr-later">This question will come back in your review.</em>');
        refresh(view, m); return;
      }
      const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act;
      if (act === 'peek') return peek(b);
      if (act === 'reveal' || act === 'revealall' || act === 'exreset') {
        S.ex[m.id] = act === 'exreset' ? 0 : act === 'revealall' ? m.ex.steps.length : Math.min(m.ex.steps.length, (S.ex[m.id] || 0) + 1); save();
        const body = $('.tr-exbody', view); body.innerHTML = exBody(m); refresh(view, m);
        if (act === 'reveal') { const last = $$('.tr-w', body).pop(); if (last && last.getBoundingClientRect().bottom > innerHeight) last.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        if (act === 'exreset') $('#tr-ex').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const fc = b.closest('.tr-fc'); if (fc) {
        if (act === 'flip') { fc.classList.toggle('is-flipped'); return; }
        const good = act === 'got'; if (good) S.card[fc.dataset.key] = 1; schedule(fc.dataset.key, good ? 'good' : 'again');
        fc.classList.toggle('is-known', !!S.card[fc.dataset.key]); fc.classList.remove('is-flipped'); fc.classList.add(good ? 'rated-good' : 'rated-again'); setTimeout(() => fc.classList.remove('rated-good', 'rated-again'), 700);
        refresh(view, m); return;
      }
      const card = b.closest('.tr-rung'); if (card) { rungAct(view, m, card, act); refresh(view, m); }
    };
    view.onkeydown = e => { if (e.key === 'Enter' && e.target.matches('.tr-rung input')) { e.preventDefault(); rungAct(view, m, e.target.closest('.tr-rung'), 'check'); refresh(view, m); } };
  }
  function rungAct(view, m, card, act) {
    const key = card.dataset.key, it = item(key), r = it.r, st = S.lad[key] || (S.lad[key] = { tries: 0, h: 0, sol: false, ok: false });
    const fb = $('.fb', card), sol = $('.tr-sol', card), pill = $('.tr-pill', card);
    const setPill = () => { const [t, c] = rungState(key); pill.className = 'tr-pill ' + c; pill.textContent = t; card.classList.toggle('is-done', !!st.ok); };
    const say = (cls, html) => { fb.hidden = false; fb.className = 'fb ' + cls; fb.innerHTML = html; };
    const solStep = n => `<li>${stepHTML(m, r.steps[n], `${r.s}\n\nStep: ${r.steps[n].w}`)}</li>`;
    const solFinal = () => `<li class="tr-final"><b>Answer:</b> ${il(r.ans)}</li>`;
    const openSol = all => {
      if (!st.sol) { st.sol = true; if (!st.ok) schedule(key, 'later'); }
      sol.hidden = false; const shown = $$(':scope > li:not(.tr-final):not(.tr-more-step)', sol).length;
      const upto = all ? r.steps.length : Math.min(r.steps.length, shown + 1);
      sol.innerHTML = r.steps.slice(0, upto).map((s, n) => solStep(n)).join('') + (upto < r.steps.length ? `<li class="tr-more-step"><button type="button" class="btn small" data-act="solnext">Next step</button><button type="button" class="chip" data-act="solall">Show the rest</button></li>` : solFinal());
      save(); setPill();
    };
    if (act === 'check') {
      const v = numOf($('input', card).value);
      if (isNaN(v)) { say('', 'Type a number, for example 0.0883 or 1.6 × 10^37.'); return; }
      if (right(r, v)) {
        const first = !st.ok; st.ok = true; if (first) schedule(key, st.sol ? 'later' : 'good'); save(); setPill();
        say('ok', `<b>${st.sol ? 'Correct.' : st.h ? 'Correct, with a little help.' : 'Correct, on your own.'}</b> ${il(r.ans)}${st.sol ? ' This rung still comes back tomorrow, so you can do it without the solution.' : sol.hidden ? ' <button type="button" class="chip" data-act="solall">Compare with the full solution</button>' : ''}`);
      } else {
        st.tries = (st.tries || 0) + 1; save(); setPill();
        const d = diagnose(r, v);
        say('no', `<b>Not yet.</b> ${d || (st.tries >= 2 && st.h < r.h.length ? 'Take the next hint: it points at the key idea without giving the answer away.' : 'Check your units and significant figures, then try again.')}`);
      }
      return;
    }
    if (act === 'hint') {
      if (st.h >= r.h.length) return; const box = $('.tr-hints', card), n = $$('.tr-hint', box).length;
      if (n >= r.h.length) return; box.insertAdjacentHTML('beforeend', `<p class="tr-hint"><b>Hint ${n + 1}.</b> ${il(r.h[n])}</p>`);
      st.h = Math.max(st.h, n + 1); save(); setPill();
      const hb = $('[data-act="hint"]', card); if (n + 1 >= r.h.length) { hb.disabled = true; hb.textContent = 'No more hints'; } else hb.textContent = `Hint ${n + 2} of ${r.h.length}`;
      return;
    }
    if (act === 'sol' || act === 'solnext') return openSol(false);
    if (act === 'solall') return openSol(true);
    if (act === 'model') { openSol(true); say('', `<b>Compare honestly.</b> Did you get the answer, for the right reasons? <span class="tr-self"><button type="button" class="chip" data-act="self-ok">Yes, I had it</button><button type="button" class="chip" data-act="self-no">Not quite</button></span>`); return; }
    if (act === 'self-ok' || act === 'self-no') {
      const good = act === 'self-ok'; if (good) { st.ok = true; st.sol = false; } schedule(key, good ? 'good' : 'later'); save(); setPill();
      say(good ? 'ok' : '', good ? '<b>Good.</b> It will come back in a few days to make sure it sticks.' : '<b>No problem.</b> It comes back in your review tomorrow.');
    }
  }

  /* ---------------- review ---------------- */
  let RV = null;
  function buildReview(keys) { RV = { q: keys.slice(), i: 0, first: 0, seen: new Set(), again: {}, done: 0, total: keys.length, anyway: false }; }
  const TYPE = { q: 'Quick check', l: 'Problem', c: 'Flashcard' };
  function review(head) {
    if (!RV) buildReview(dueKeys().slice(0, 25));
    const top = head('olympiad-review', 'Review', 'Only what is due: the questions you missed, the problems you needed help with, and your flashcards, each brought back just as you are likely to forget it.');
    if (!RV.q.length) {
      const fut = Object.values(S.rev).filter(r => r.due > Date.now()).sort((a, b) => a.due - b.due), any = Object.keys(S.rev).filter(item).length;
      return `<div class="page ol tr">${top}<section class="tr-empty panel"><h2>Nothing is due right now.</h2><p>${fut.length ? `You have ${fut.length} item${fut.length === 1 ? '' : 's'} scheduled. The next one is due ${when(fut[0].due)}.` : 'Work through a module: anything you miss there will appear here, ready for review.'}</p>
        <div class="tr-endgo">${any ? '<button type="button" class="btn small" data-act="anyway">Practise 10 anyway</button>' : ''}<button type="button" class="btn small ${any ? 'ghost' : ''}" data-act="warm">10 random flashcards from the whole course</button><a class="btn small ghost" href="#olympiad-train">Back to your plan</a></div></section></div>`;
    }
    if (RV.i >= RV.q.length) {
      const fut = Object.values(S.rev).filter(r => r.due > Date.now()).sort((a, b) => a.due - b.due);
      return `<div class="page ol tr">${top}<section class="tr-empty panel tr-donebox"><p class="kicker">Session complete</p><h2>${RV.done} reviewed, ${RV.first} right first time.</h2><p>${RV.done && RV.first === RV.done ? 'A clean sweep. ' : ''}${fut.length ? `Your next review is due ${when(fut[0].due)}.` : ''} Little and often beats one long session.</p>
        <div class="tr-endgo"><a class="btn small" href="#olympiad-train">Back to your plan</a><a class="btn small ghost" href="#olympiad-sprint">Take a sprint</a></div></section></div>`;
    }
    const it = item(RV.q[RV.i]);
    return `<div class="page ol tr">${top}<div class="tr-rev"><div class="tr-revbar"><span>${RV.i + 1} of ${RV.q.length}${RV.anyway ? ' · extra practice' : ''}</span><div class="meter"><i style="--v:${Math.round(RV.i / RV.q.length * 100)}%"></i></div></div>
      <article class="tr-ritem panel" data-key="${it.key}"><p class="tr-rk">${TYPE[it.t]} · <a href="#olympiad-m-${it.m.id}">${esc(it.m.t)}</a></p>${revBody(it)}<div class="fb" hidden></div><ol class="tr-sol" hidden></ol><div class="tr-rnext" hidden><button type="button" class="btn small" data-act="next">Next ${ARROW}</button></div></article></div></div>`;
  }
  function revBody(it) {
    if (it.t === 'c') return `<div class="tr-rcard"><p class="tr-rfront">${il(it.c[0])}</p><div class="tr-rback" hidden>${il(it.c[1])}</div></div><div class="tr-ract"><button type="button" class="btn small" data-act="show">Show the answer</button><span class="tr-rate" hidden><button type="button" class="chip" data-act="again">Again</button><button type="button" class="chip" data-act="got">Got it</button></span></div>`;
    if (it.t === 'q') return `<div class="tr-check"><p class="tr-qtext">${il(it.q.q)}</p>${opts(it.q, rnd(it.q.o.length))}</div>`;
    const r = it.r;
    return `<h3 class="tr-rtitle">${esc(r.t)} <span class="ol-lv l${r.lv}">${LV[r.lv]}</span></h3><div class="tr-rstem">${il(r.s)}</div>${r.a != null ? `<div class="q-in"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer" placeholder="your answer${r.u ? ' in ' + esc(r.u) : ''}"><button type="button" class="btn small" data-act="check">Check</button>${r.u ? `<span class="ol-unit">${esc(r.u)}</span>` : ''}</div>` : '<textarea class="tr-txt" rows="3" aria-label="Your answer" placeholder="Write your answer, then compare."></textarea>'}
      <div class="ol-tools"><button type="button" class="chip" data-act="hint">A hint</button><button type="button" class="chip" data-act="show">${r.a != null ? 'Show the solution' : 'Compare with the model answer'}</button></div><div class="tr-hints"></div>`;
  }
  function bindReview(view, head) {
    const again = key => { RV.again[key] = (RV.again[key] || 0) + 1; if (RV.again[key] <= 1) RV.q.push(key); };
    const grade = (key, g) => { const fresh = !RV.seen.has(key); RV.seen.add(key); if (fresh) { RV.done++; if (g === 'good') RV.first++; } schedule(key, g); if (g !== 'good') again(key); };
    const next = () => { RV.i++; view.innerHTML = review(head); bindReview(view, head); scrollTo({ top: 0, behavior: 'smooth' }); };
    const box = $('.tr-ritem', view);
    view.onclick = e => {
      const b = e.target.closest('[data-act], .tr-opt'); if (!b) return;
      if (b.dataset.act === 'anyway' || b.dataset.act === 'warm') {
        let pool = b.dataset.act === 'anyway' ? Object.keys(S.rev).filter(item) : M.flatMap(m => m.cards.map((c, i) => `c:${m.id}:${i}`));
        pool = rnd(pool.length).map(i => pool[i]).slice(0, 10); buildReview(pool); RV.anyway = true; view.innerHTML = review(head); bindReview(view, head); return;
      }
      if (!box) return; const key = box.dataset.key, it = item(key), fb = $('.fb', box), nx = $('.tr-rnext', box);
      const say = (cls, html) => { fb.hidden = false; fb.className = 'fb ' + cls; fb.innerHTML = html; };
      if (b.dataset.act === 'next') return next();
      if (it.t === 'c') {
        if (b.dataset.act === 'show') { $('.tr-rback', box).hidden = false; b.hidden = true; $('.tr-rate', box).hidden = false; return; }
        if (b.dataset.act === 'got' || b.dataset.act === 'again') { const g = b.dataset.act === 'got'; if (g) S.card[key] = 1; grade(key, g ? 'good' : 'again'); return next(); }
      }
      if (it.t === 'q' && b.classList.contains('tr-opt') && !b.disabled) { const ok = pick(box, it.q, +b.dataset.o, ''); if (ok) S.chk[key] = 1; grade(key, ok ? 'good' : 'again'); nx.hidden = false; $('button', nx).focus(); return; }
      if (it.t === 'l') {
        const r = it.r;
        if (b.dataset.act === 'hint') { const hb = $('.tr-hints', box), n = $$('.tr-hint', hb).length; if (n < r.h.length) hb.insertAdjacentHTML('beforeend', `<p class="tr-hint"><b>Hint ${n + 1}.</b> ${il(r.h[n])}</p>`); if (n + 1 >= r.h.length) { b.disabled = true; b.textContent = 'No more hints'; } return; }
        if (b.dataset.act === 'check') { const v = numOf($('input', box).value); if (isNaN(v)) { say('', 'Type a number.'); return; } if (right(r, v)) { const st = S.lad[key] || (S.lad[key] = { tries: 0, h: 0, sol: false }); st.ok = true; save(); grade(key, 'good'); say('ok', `<b>Correct.</b> ${il(r.ans)}`); nx.hidden = false; $('button', nx).focus(); } else say('no', `<b>Not yet.</b> ${diagnose(r, v) || 'Try again, or take a hint.'}`); return; }
        if (b.dataset.act === 'show') { const sol = $('.tr-sol', box); sol.hidden = false; sol.innerHTML = r.steps.map(s => `<li>${stepHTML(it.m, s, `${r.s}\n\nStep: ${s.w}`)}</li>`).join('') + `<li class="tr-final"><b>Answer:</b> ${il(r.ans)}</li>`; b.disabled = true;
          if (r.a == null) { say('', '<b>Compare honestly.</b> Did you have it, for the right reasons? <span class="tr-self"><button type="button" class="chip" data-act="self-ok">Yes, I had it</button><button type="button" class="chip" data-act="self-no">Not quite</button></span>'); return; }
          if (!fb.classList.contains('ok')) grade(key, 'later'); say('', 'Work through each step. It comes back tomorrow for you to do on your own.'); nx.hidden = false; return; }
        if (b.dataset.act === 'self-ok' || b.dataset.act === 'self-no') { const g = b.dataset.act === 'self-ok'; grade(key, g ? 'good' : 'later'); say(g ? 'ok' : '', g ? '<b>Good.</b> It will come back after a longer gap.' : '<b>No problem.</b> It comes back tomorrow.'); nx.hidden = false; $('button', nx).focus(); return; }
      }
      if (b.dataset.act === 'peek') return peek(b);
    };
    view.onkeydown = e => {
      if (e.key === 'Enter' && e.target.matches('.tr-ritem input')) { e.preventDefault(); const c = $('[data-act="check"]', box); if (c) c.click(); }
      else if (e.key === 'Enter' && box && !$('.tr-rnext', box).hidden && !e.target.matches('input, textarea, button, a')) next();
    };
  }

  /* ---------------- sprint ---------------- */
  let SP = null, spClock = 0, spSet = { n: 12, scope: 'all' };
  const SPLEN = { 12: 20, 24: 40 };
  function sprintPool(scope) { return M.filter(m => scope === 'all' || started(m)).flatMap(m => m.learn.map((l, i) => `q:${m.id}:${i}`)); }
  function startSprint() {
    const pool = sprintPool(spSet.scope), pickN = rnd(pool.length).slice(0, spSet.n).map(i => pool[i]);
    SP = { keys: pickN, ords: pickN.map(k => rnd(item(k).q.o.length)), ans: pickN.map(() => null), i: 0, t0: Date.now(), dur: SPLEN[spSet.n] * 60 * pickN.length / spSet.n * 1000, done: false };
  }
  function sprint(head) {
    const top = head('olympiad-sprint', 'Sprint', 'Mixed questions from the whole course against the clock, one paper’s worth of pressure in twenty minutes. A multiple-choice olympiad paper gives you a little under two minutes a question.');
    if (!SP) {
      const mine = M.filter(started).length, hist = S.sprints.slice(-6).reverse();
      return `<div class="page ol tr">${top}<section class="tr-spintro panel"><h2>Set up your sprint</h2>
        <div class="tr-spset"><div><p class="kicker">Length</p><div class="seg" role="group" aria-label="Length">${[12, 24].map(n => `<button type="button" data-n="${n}" class="${spSet.n === n ? 'is-on' : ''}">${n} questions · ${SPLEN[n]} min</button>`).join('')}</div></div>
          <div><p class="kicker">Questions from</p><div class="seg" role="group" aria-label="Scope"><button type="button" data-scope="all" class="${spSet.scope === 'all' ? 'is-on' : ''}">Every module</button><button type="button" data-scope="mine" class="${spSet.scope === 'mine' ? 'is-on' : ''}"${mine < 2 ? ' disabled title="Start at least two modules first"' : ''}>Modules I have started (${mine})</button></div></div></div>
        <ul class="ol-list"><li>Answer in any order: the numbers at the top jump between questions. Keys 1 to 4 choose an answer; arrow keys move.</li><li>No feedback until the end, as in a real paper. Then every answer is explained.</li><li>Anything you get wrong goes into your review.</li></ul>
        <button type="button" class="btn" data-act="go">Start the clock ${ARROW}</button></section>
        ${hist.length ? `<section class="ol-sec"><h2>Your recent sprints</h2><table class="tr-hist"><thead><tr><th>When</th><th>Score</th><th>Time</th></tr></thead><tbody>${hist.map(s => `<tr><td>${new Date(s.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td><td>${s.score} / ${s.n} (${Math.round(s.score / s.n * 100)}%)</td><td>${Math.floor(s.sec / 60)}:${String(s.sec % 60).padStart(2, '0')}</td></tr>`).join('')}</tbody></table></section>` : ''}</div>`;
    }
    if (SP.done) return `<div class="page ol tr">${top}${results()}</div>`;
    return `<div class="page ol tr">${top}<section class="tr-sp panel" aria-label="Sprint">${spBody()}</section></div>`;
  }
  function spBody() {
    const n = SP.keys.length, it = item(SP.keys[SP.i]), left = Math.max(0, SP.dur - (Date.now() - SP.t0)) / 1000;
    return `<div class="tr-sptop"><span class="tr-spclock" id="spClock">${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}</span><div class="tr-pal" role="group" aria-label="Questions">${SP.keys.map((k, j) => `<button type="button" data-j="${j}" class="${j === SP.i ? 'is-cur' : ''}${SP.ans[j] != null ? ' is-ans' : ''}" aria-label="Question ${j + 1}${SP.ans[j] != null ? ', answered' : ''}">${j + 1}</button>`).join('')}</div><button type="button" class="btn small ghost" data-act="finish">Finish</button></div>
      <div class="tr-spq"><p class="tr-rk">Question ${SP.i + 1} of ${n}</p><p class="tr-qtext">${il(it.q.q)}</p>${opts(it.q, SP.ords[SP.i], SP.ans[SP.i])}</div>
      <div class="tr-spnav"><button type="button" class="chip" data-act="prev"${SP.i ? '' : ' disabled'}>Previous</button><span>${SP.ans.filter(a => a != null).length} of ${n} answered</span>${SP.i < n - 1 ? `<button type="button" class="btn small" data-act="nextq">Next ${ARROW}</button>` : '<button type="button" class="btn small" data-act="finish">Finish and mark</button>'}</div>`;
  }
  function finish() {
    if (!SP || SP.done) return; clearInterval(spClock); SP.done = true; SP.sec = Math.min(Math.round((Date.now() - SP.t0) / 1000), Math.round(SP.dur / 1000));
    SP.score = SP.keys.filter((k, j) => SP.ans[j] === item(k).q.a).length;
    SP.keys.forEach((k, j) => { const ok = SP.ans[j] === item(k).q.a; if (ok) { S.chk[k] = 1; if (S.rev[k]) schedule(k, 'good'); } else schedule(k, 'again'); });
    S.sprints.push({ at: Date.now(), n: SP.keys.length, score: SP.score, sec: SP.sec }); S.sprints = S.sprints.slice(-30); save();
  }
  function results() {
    const n = SP.keys.length, p = Math.round(SP.score / n * 100), by = {};
    SP.keys.forEach((k, j) => { const it = item(k), b = by[it.m.id] || (by[it.m.id] = { m: it.m, ok: 0, n: 0 }); b.n++; if (SP.ans[j] === it.q.a) b.ok++; });
    const msg = p >= 85 ? 'Excellent: that is olympiad pace.' : p >= 65 ? 'Solid. The modules marked below are where your next marks are.' : p >= 40 ? 'A good baseline. Work through the modules below, then sprint again.' : 'This is your starting point. The modules below will move it fast.';
    return `<section class="tr-spres panel"><p class="kicker">Sprint marked</p><h2><b>${SP.score}</b> / ${n} <span>(${p}%) in ${Math.floor(SP.sec / 60)}:${String(SP.sec % 60).padStart(2, '0')}</span></h2><p>${msg} Every wrong answer is now in your review.</p>
      <div class="tr-bymod">${Object.values(by).sort((a, b) => a.ok / a.n - b.ok / b.n).map(b => `<a class="chip wrap ${b.ok === b.n ? 'is-good' : 'is-weak'}" href="#olympiad-m-${b.m.id}">${esc(b.m.t)} · ${b.ok}/${b.n}</a>`).join('')}</div>
      <div class="tr-endgo"><button type="button" class="btn small" data-act="again-sprint">Another sprint</button><a class="btn small ghost" href="#olympiad-review">Review (${dueKeys().length} due)</a><a class="btn small ghost" href="#olympiad-train">Your plan</a></div></section>
      <ol class="tr-spans">${SP.keys.map((k, j) => { const it = item(k), mine = SP.ans[j], ok = mine === it.q.a; return `<li class="panel ${ok ? 'is-ok' : 'is-no'}"><p class="tr-rk">${ok ? 'Right' : mine == null ? 'Not answered' : 'Wrong'} · <a href="#olympiad-m-${it.m.id}">${esc(it.m.t)}</a></p><p class="tr-qtext">${il(it.q.q)}</p>
        ${mine != null && !ok ? `<p class="tr-yours"><span>Your answer</span> ${il(it.q.o[mine])}</p>` : ''}<p class="tr-correct"><span>Answer</span> ${il(it.q.o[it.q.a])}</p><p class="tr-x">${il(it.q.x)}</p></li>`; }).join('')}</ol>`;
  }
  function bindSprint(view, head) {
    clearInterval(spClock);
    const redraw = () => { const box = $('.tr-sp', view); if (box) box.innerHTML = spBody(); };
    const full = () => { view.innerHTML = sprint(head); bindSprint(view, head); };
    if (SP && !SP.done) spClock = setInterval(() => {
      const el = $('#spClock'); if (!el || !el.isConnected) { clearInterval(spClock); return; }
      const left = SP.dur - (Date.now() - SP.t0); if (left <= 0) { finish(); full(); scrollTo({ top: 0 }); return; }
      const s = Math.ceil(left / 1000); el.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); el.classList.toggle('low', s <= 120);
    }, 500);
    view.onclick = e => {
      const n = e.target.closest('[data-n]'); if (n) { spSet.n = +n.dataset.n; return full(); }
      const sc = e.target.closest('[data-scope]'); if (sc && !sc.disabled) { spSet.scope = sc.dataset.scope; return full(); }
      const j = e.target.closest('[data-j]'); if (j && SP) { SP.i = +j.dataset.j; return redraw(); }
      const o = e.target.closest('.tr-opt'); if (o && SP && !SP.done) { SP.ans[SP.i] = +o.dataset.o; return redraw(); }
      const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act;
      if (a === 'go') { startSprint(); full(); scrollTo({ top: 0 }); }
      else if (a === 'prev' && SP.i > 0) { SP.i--; redraw(); }
      else if (a === 'nextq' && SP.i < SP.keys.length - 1) { SP.i++; redraw(); }
      else if (a === 'finish') { const un = SP.ans.filter(x => x == null).length; if (un && !b.dataset.sure) { b.dataset.sure = '1'; b.textContent = `${un} unanswered: finish anyway?`; return; } finish(); full(); scrollTo({ top: 0 }); }
      else if (a === 'again-sprint') { SP = null; full(); }
    };
    view.onkeydown = null;
  }
  // keys work wherever the focus is, so the handler lives on the document and checks that a sprint is running
  document.addEventListener('keydown', e => {
    if (!SP || !document.querySelector('.tr-sp') || SP.done || e.ctrlKey || e.metaKey || e.altKey || (e.target.matches && e.target.matches('input, textarea, select'))) return;
    const view = document.getElementById('view'), redraw = () => { const box = $('.tr-sp', view); if (box) box.innerHTML = spBody(); };
    {
      const k = e.key.toLowerCase(), idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
      if (idx >= 0 && idx < SP.ords[SP.i].length) { SP.ans[SP.i] = SP.ords[SP.i][idx]; redraw(); }
      else if (e.key === 'ArrowRight' && SP.i < SP.keys.length - 1) { SP.i++; redraw(); }
      else if (e.key === 'ArrowLeft' && SP.i > 0) { SP.i--; redraw(); }
    }
  });

  /* ---------------- routing ---------------- */
  const owns = h => h === 'olympiad-train' || h === 'olympiad-review' || h === 'olympiad-sprint' || (h.startsWith('olympiad-m-') && !!BY[h.slice(11)]);
  function render(view, h, head) {
    view.onclick = view.onkeydown = null;
    if (h === 'olympiad-review') { document.title = 'Review · Olympiad Training'; view.innerHTML = review(head); bindReview(view, head); return; }
    if (h === 'olympiad-sprint') { document.title = 'Sprint · Olympiad Training'; view.innerHTML = sprint(head); bindSprint(view, head); return; }
    if (h.startsWith('olympiad-m-')) { const m = BY[h.slice(11)]; document.title = m.t + ' · Olympiad Training'; view.innerHTML = module(m.id, head); bindModule(view, m); return; }
    document.title = 'Training · Olympiad · Quilio'; view.innerHTML = home(head);
    view.onclick = e => { const t = e.target.closest('[data-target]'); if (t) { S.target = t.dataset.target; save(); view.innerHTML = home(head); } };
  }
  function leave() { clearInterval(spClock); RV = null; if (SP && !SP.done) { /* a running sprint keeps its clock: coming back resumes it */ } }
  window.Training = { owns, render, leave, mods: M, targets: TARGETS, mastery, dueKeys, item, count: M.length, _state: () => S, _reset() { S = { chk: {}, lad: {}, ex: {}, card: {}, rev: {}, sprints: [] }; save(); RV = null; SP = null; } };
})();
