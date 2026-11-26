/* First-visit tours. A short walk round the site the first time someone enters, and round a topic page the
   first time one opens. Each tour is remembered per account on this device, can be skipped at any step with
   Esc or "Skip tour", and can be replayed from the footer. */
(function () {
  'use strict';
  const WL = (window.WL = window.WL || {});
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const key = () => { const A = WL.auth; return 'wl-tour' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const seen = () => {
    try { if (localStorage.getItem('wl-tour-skip') === '1') return { home: 1, topic: 1 }; return JSON.parse(localStorage.getItem(key()) || '{}') || {}; }
    catch (e) { return { home: 1, topic: 1 }; }
  };
  const mark = (name) => { try { const s = seen(); s[name] = Date.now(); localStorage.setItem(key(), JSON.stringify(s)); } catch (e) {} };

  const NAV = (h) => `header.top nav.nav a[href="#${h}"]`;
  const TOURS = {
    home: [
      { title: 'Welcome to Twistor', body: 'Physics and the maths it is written in, from Key Stage 3 to A-Level. This short tour shows you where everything is. It takes about thirty seconds.', next: 'Show me around' },
      { at: [NAV('physics'), NAV('maths')], title: 'Two tracks', body: 'Physics, and the maths it needs. Each track is laid out in stages. Open one and start at the stage that matches where you are.' },
      { at: [NAV('study')], title: 'Study', body: 'Everything about your own learning, on one page. Today’s review mixes the questions you got wrong, your flashcards and the topics due for review into one round, and the number beside Study says how many are waiting. Your notebook, formula sheet, planner and knowledge map are there too.' },
      { at: ['header.top .navddb[aria-controls=dd-practise]'], title: 'Practise', body: WL.ai ? 'Timed tests and practicals for exams. When you want more: olympiad problems, competition papers, and lessons Einstein writes one step beyond what you know. Whenever you finish a set of questions, Einstein can write ten more at the level you choose.' : 'Timed tests and practicals for exams, and competition papers when you want more.' },
      { at: ['#search', '#msearch-btn'], title: 'Search', body: 'Find any topic, formula or lecture by name. On a computer, press <kbd>/</kbd> to jump here from any page.' },
      { at: ['#tw-ask-open'], title: 'Ask Twistor', body: 'Ask a question in your own words. The answer comes from the lessons themselves: the notes, the why of each derivation step, the glossary and worked problems, each with a link to its lesson. Press <kbd>Ctrl</kbd> + <kbd>K</kbd> from any page.' },
      ...(WL.tutor ? [{ at: ['#ai-open'], title: 'Einstein', body: 'An AI tutor that can see the topic you are reading. Ask it why a step works or how to start a problem. It can be wrong, so check what it says against the derivation.' }] : []),
      { at: ['header.top .actbtn'], title: 'Your activity', body: 'Time spent, topics finished and your records, by week, month or year' + (WL.ai ? ', with a short summary from Einstein' : '') + '.' },
      { title: 'You are ready', body: 'Not sure where to start? A few quick questions find your level in about three minutes. Or pick a track yourself. Each topic has a lecture of ten minutes or more, notes, a derivation and practice. You can replay this tour from the bottom of any page.', end: [['Find my level', '#level'], ['Physics', '#physics'], ['Maths', '#maths']] }
    ],
    topic: [
      { at: ['.glance ol.study'], title: 'Every topic in four steps', body: 'Watch the lecture, read the notes, follow the derivation, then practise. Press a step to jump to it. Each line of a derivation has a <b>Why?</b> button' + (WL.tutor ? ' that asks Einstein about that line' : ' that explains it') + '.' },
      { at: ['#tt-practice'], title: 'Practice that keeps going', body: 'Core questions are checked as soon as you answer. ' + (WL.ai ? 'When you have finished them, ask Einstein for ten more at the difficulty you choose.' : 'When you have finished them, the endless practice below writes new numbers every time.') },
      { at: ['.nbcard'], title: 'Your study', body: 'Save the topic, keep your own notes, and open its full lecture, flashcards and formula sheet. Select words in the lesson to highlight them.' },
      { at: ['.glance .ustate'], title: 'Mark it understood', body: 'When you can do the Core questions without opening the solutions, mark the topic. It comes back for a short review the next day, then at widening gaps.', last: 'Got it' }
    ]
  };

  /* an edition can bring its own tours (Twistor does): WL.tourSteps({ NAV }) → { home: [...], topic: [...] } */
  if (typeof WL.tourSteps === 'function') { try { Object.assign(TOURS, WL.tourSteps({ NAV, ai: !!WL.ai, tutor: !!WL.tutor })); } catch (e) { /* keep the built-in tours */ } }

  let cur = null;   // { name, steps, i, el, prevFocus, raf }
  function rectOf(st) {
    if (!st || !st.at) return null;
    let r = null;
    st.at.forEach((s) => document.querySelectorAll(s).forEach((el) => {
      const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return;
      r = r ? { l: Math.min(r.l, b.left), t: Math.min(r.t, b.top), r: Math.max(r.r, b.right), b: Math.max(r.b, b.bottom), el: r.el } : { l: b.left, t: b.top, r: b.right, b: b.bottom, el };
    }));
    return r;
  }
  const usable = (st) => !st.at || !!rectOf(st);
  function place() {
    if (!cur) return;
    const st = cur.steps[cur.i], root = cur.el, card = $('.tour-card', root), spot = $('.tour-spot', root), r = rectOf(st);
    const W = innerWidth, H = innerHeight, M = 12, pad = 6, gap = 14, narrow = W <= 600;
    root.classList.toggle('tour-center', !r); card.classList.remove('up', 'down');
    if (!r) { spot.style.cssText = ''; card.style.left = Math.max(M, (W - card.offsetWidth) / 2) + 'px'; card.style.top = Math.max(M, (H - card.offsetHeight) / 2) + 'px'; return; }
    spot.style.left = r.l - pad + 'px'; spot.style.top = r.t - pad + 'px'; spot.style.width = r.r - r.l + 2 * pad + 'px'; spot.style.height = r.b - r.t + 2 * pad + 'px';
    const cw = card.offsetWidth, ch = card.offsetHeight, cx = (r.l + r.r) / 2;
    if (narrow) { card.style.left = M + 'px'; card.style.top = ((r.t + r.b) / 2 < H / 2 ? H - ch - M : M) + 'px'; return; }   // on a phone the card sits at the far edge from its target
    const left = Math.min(Math.max(M, cx - cw / 2), W - cw - M); let top;
    if (r.b + pad + gap + ch < H - M) { top = r.b + pad + gap; card.classList.add('up'); }
    else if (r.t - pad - gap - ch > M) { top = r.t - pad - gap - ch; card.classList.add('down'); }
    else top = Math.max(M, H - ch - M);
    card.style.left = left + 'px'; card.style.top = top + 'px';
    card.style.setProperty('--ax', Math.min(Math.max(20, cx - left), cw - 20) + 'px');
  }
  const queue = () => { if (!cur) return; cancelAnimationFrame(cur.raf); cur.raf = requestAnimationFrame(place); };

  function show(i, dir = 1) {
    const steps = cur.steps;
    while (i >= 0 && i < steps.length && !usable(steps[i])) i += dir;   // a target hidden at this width is skipped
    if (i < 0) i = 0;
    if (i >= steps.length) return close();
    cur.i = i;
    const st = steps[i], n = steps.length, root = cur.el, card = $('.tour-card', root), first = i === 0, last = i === n - 1;
    const dots = steps.map((_, k) => `<i${k === i ? ' class="on"' : ''}></i>`).join('');
    const acts = st.end
      ? `<button type="button" class="btn small ghost" data-tour-act="done">Done</button><span class="tour-sp"></span>${st.end.map(([t, h], k) => `<a class="btn small${k === 0 ? ' primary' : ''}" href="${h}" data-tour-act="go">${esc(t)}</a>`).join('')}`
      : `<button type="button" class="btn small ghost tour-skip" data-tour-act="skip">${first ? 'Skip' : 'Skip tour'}</button><span class="tour-sp"></span>${first ? '' : '<button type="button" class="btn small ghost" data-tour-act="back">Back</button>'}<button type="button" class="btn small primary" data-tour-act="next">${esc(st.next || (last ? st.last || 'Done' : 'Next'))}</button>`;
    card.innerHTML = `<p class="tour-dots" aria-label="Step ${i + 1} of ${n}">${dots}<span class="tour-n" aria-hidden="true">${i + 1} / ${n}</span></p>${st.art ? `<div class="tour-art" aria-hidden="true">${st.art}</div>` : ''}<h2 id="tour-t">${esc(st.title)}</h2><p class="tour-b" id="tour-b">${st.body}</p><div class="tour-act">${acts}</div>`;
    card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
    const r = rectOf(st);
    if (r && (r.t < 64 || r.b > innerHeight - 24) && r.el) {   // bring a target below the fold into view first
      r.el.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
      setTimeout(place, REDUCED ? 30 : 420);
    }
    place();
    const b = card.querySelector('[data-tour-act="next"], [data-tour-act="go"]'); if (b) b.focus({ preventScroll: true });
  }
  function close() {
    if (!cur) return;
    const c = cur; cur = null; mark(c.name);
    removeEventListener('resize', queue); removeEventListener('scroll', queue, true); document.removeEventListener('keydown', onKey, true);
    c.el.classList.add('out'); setTimeout(() => c.el.remove(), REDUCED ? 0 : 220);
    if (c.prevFocus && c.prevFocus.focus && document.contains(c.prevFocus)) c.prevFocus.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (!cur) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'ArrowRight' && !cur.steps[cur.i].end) { e.preventDefault(); show(cur.i + 1, 1); return; }
    if (e.key === 'ArrowLeft' && cur.i > 0) { e.preventDefault(); show(cur.i - 1, -1); return; }
    if (e.key === 'Tab') {   // keep focus inside the card while the tour is open
      const f = [...cur.el.querySelectorAll('.tour-card button, .tour-card a')]; if (!f.length) return;
      const k = f.indexOf(document.activeElement), nx = e.shiftKey ? (k <= 0 ? f.length - 1 : k - 1) : (k + 1) % f.length;
      e.preventDefault(); f[nx].focus();
    }
  }
  function start(name) {
    if (cur || !TOURS[name]) return false;
    const steps = TOURS[name]; if (!steps.some(usable)) return false;
    const el = document.createElement('div'); el.className = 'tour'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'tour-t'); el.setAttribute('aria-describedby', 'tour-b');
    el.innerHTML = '<div class="tour-block"></div><div class="tour-spot"></div><div class="tour-card"></div>';
    document.body.appendChild(el);
    cur = { name, steps, i: 0, el, prevFocus: document.activeElement, raf: 0 };
    el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-tour-act]'); if (!a || !cur) return;
      const act = a.dataset.tourAct;
      if (act === 'next') show(cur.i + 1, 1);
      else if (act === 'back') show(cur.i - 1, -1);
      else if (act === 'skip' || act === 'done') close();
      else if (act === 'go') close();   // the link itself navigates
    });
    addEventListener('resize', queue); addEventListener('scroll', queue, true); document.addEventListener('keydown', onKey, true);
    show(0, 1);
    return true;
  }
  /* wait until the start screen and its motto have gone, then give the page a moment to settle */
  function ready(fn) {
    const settle = (tries = 40) => {
      const g = $('#gate'), mo = $('#motto');
      if ((!g || g.hidden) && (!mo || mo.hidden) && !document.body.classList.contains('locked')) return setTimeout(fn, 900);
      if (tries > 0) setTimeout(() => settle(tries - 1), 400);
    };
    const A = WL.auth; if (A && A.onEnter) A.onEnter(() => settle()); else settle();
  }
  function maybe(name) {
    if (seen()[name] || cur) return;
    const page = name === 'topic' ? 'topic' : 'home';
    ready(() => { if (!cur && !seen()[name] && document.body.dataset.page === page) start(name); });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-tour]'); if (!b) return;
    e.preventDefault(); start(document.body.dataset.page === 'topic' ? 'topic' : 'home');
  });
  WL.tour = { start, maybe, seen, close, get open() { return !!cur; } };
})();
