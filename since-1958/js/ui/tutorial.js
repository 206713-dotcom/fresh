// "Flight school": a hands-on tutorial. It points at one real control at a time, waits until you have
// actually used it, and gives a star for each. It only watches; it never changes how anything works.
const homeShown = () => !!document.querySelector('#panel .home-h');
const FEAT = [['apollo', 'Apollo 11'], ['voyager', 'Voyager 1, up close'], ['percy', 'Perseverance'], ['webb', 'James Webb']];
const STEPS = [
  { id: 'look', icon: '🖱️', title: 'Look around', text: 'Press and drag anywhere on the picture to turn your view.', hint: 'Drag the Earth.', target: null , gesture: 'drag', gestureText: 'Press and drag' },
  { id: 'zoom', icon: '🔍', title: 'Zoom in on a planet', text: 'Scroll (or pinch on a touch screen) to fly a little closer to any planet. The Earth is right here, or pick another world first with "Go to…".', hint: 'Zoom in a little.', target: null , gesture: 'scroll', gestureText: 'Scroll to zoom in' },
  { id: 'play', icon: '⏯️', title: 'Stop and start time', text: 'This is a time machine: the clock up here is running from 1958. The yellow button stops time. Press it again and time goes on.', hint: 'Press the yellow button twice.', target: '#play' , arrows: 'Stop / start time' },
  { id: 'goto', icon: '🌙', title: 'Fly to the Moon', text: 'Open "Go to…" and choose the Moon. Hold tight: you really fly there.', hint: 'Go to… → Moon.', target: '#goBtn' , arrows: 'Open Go to…' },
  { id: 'site', icon: '📍', title: 'Land at a site', text: 'The list shows every machine NASA left on the Moon. Click Surveyor 1, the first American lander: the clock jumps to its landing day and you fly down to it.', hint: 'Click Surveyor 1.', target: '#panel li > button[data-id="surveyor1"]', arrows: 'Click Surveyor 1' },
  { id: 'arrival', icon: '🛬', title: 'Watch it land', text: 'Keep watching: Surveyor 1 comes down on its rockets, step by step, with NASA\'s real numbers. You can watch it again any time with "The arrival".', hint: 'Watch the landing, or press The arrival.', target: '#panel [data-act="scene"][data-i="0"]', arrows: 'Watch the landing' },
  { id: 'object', icon: '🔧', title: 'Take it apart', text: 'Press "View object in 3D" to turn the real NASA model around and see what every part was for.', hint: 'Press View object in 3D.', target: '#panel [data-act="object"]' , arrows: 'Open the 3D view' },
  { id: 'walk', icon: '🚶', title: 'Walk here', text: 'Close the 3D view (✕), then press Walk here: you stand on the Moon right beside Surveyor 1, in the Moon’s real gravity. Walk with W A S D or the arrow keys, then press Stop walking to come back.', hint: 'Press Walk here, look around, then press Stop walking.', target: '#panel [data-act="walk"]', arrows: 'Walk here' },
  { id: 'exhibit', icon: '🏛️', title: 'The Exhibition', text: 'Every machine in this story stands side by side in one big hall. Open the Exhibition, walk around, and come back out with ✕.', hint: 'Open the Exhibition, then close it.', target: '#goMuseum' , arrows: 'Open the Exhibition' },
  { id: 'home', icon: '🏠', title: 'This is the home panel', text: 'Press Home whenever you get lost: you fly back to the Earth and this panel comes back. It holds the four featured films, a message to Voyager 1, all 30 films, and a search for every machine.', hint: () => (homeShown() ? 'This is it. Press Got it.' : 'Press Home.'), target: () => (homeShown() ? '#panel' : '#goHome'), arrows: () => (homeShown() ? 'The home panel' : 'Press Home'), ok: 'Got it', okWhen: homeShown },
  { id: 'timeline', icon: '📅', title: 'The bar at the bottom', text: 'This bar is the whole story, from 1958 to today. Every little mark is something that happened: click one to jump to that day. The "Events" button on the left lists them all by name.', hint: 'Click a mark on the bar, or open Events.', target: '#timeline' , arrows: 'Click a mark' },
  { id: 'search', icon: '🔎', title: 'Search for a machine', text: 'Looking for one machine? Type its name here: Apollo 11, Voyager, Curiosity… Every result can be turned around in 3D, visited on its landing day, or read about.', hint: 'Type a name, for example "Apollo".', target: '#panel .ps-in', arrows: 'Type a name', reveal: true, home: true },
  { id: 'feat', icon: '🎬', title: 'Watch the featured animations', text: 'This is the best part, so please do not miss it. We built these four films in full 3D. Start with number 1, Apollo 11: its whole flight, from the launch pad to the Moon. Then Voyager 1 up close in its real materials, Perseverance’s seven minutes to land, and how James Webb works. Click one to watch it, then close it to come back here.', hint: () => featHint(), target: '#panel .featbox', arrows: 'Watch these 4', ok: 'Next', okWhen: () => watched.size > 0, noSkip: true, home: true },
  { id: 'films', icon: '🎞️', title: 'There are 30 more films', text: 'Every big moment from 1964 to 2022 is also told as a short animated film: 30 in all. Press All 30 films to pick one. Inside a film you can step to the next or the previous one.', hint: 'Press All 30 films, or Got it.', target: '#panel .filmsbtn', arrows: 'All 30 films', ok: 'Got it', reveal: true, home: true },
  { id: 'done', icon: '🚀', title: 'Enjoy your journey!', text: 'That is everything. The whole story, from 1958 to today, is yours to explore.', hint: '', target: () => (watched.size < FEAT.length ? '#panel .featbox' : null), arrows: 'Watch these 4', home: true },
];
// the featured films watched during the tutorial (a film counts once it has been opened and closed again)
const watched = new Set((() => { try { return JSON.parse(localStorage.getItem('anf-feat-seen') || '[]'); } catch (e) { return []; } })());
const featHint = () => (watched.size ? `Watched ${watched.size} of 4: ${FEAT.filter(([id]) => watched.has(id)).map(([, n]) => n).join(', ')}. Watch all four of them.` : 'Watch all four of them.');
const val = (x) => (typeof x === 'function' ? x() : x);

export function setupTutorial({ $, clock, rig, viewer, museum, canvas, busy, introGone, onApollo, onFinal = () => {}, onFeatured = () => {}, scenePlaying = () => false }) {
  const el = document.createElement('div'); el.id = 'tut'; el.hidden = true; document.body.appendChild(el);
  const ring = document.createElement('div'); ring.id = 'tutRing'; ring.hidden = true; document.body.appendChild(ring);
  const ring2 = document.createElement('div'); ring2.id = 'tutRing2'; ring2.hidden = true; document.body.appendChild(ring2);   // for a step that points at two things
  // two bobbing arrows that point at one button, with a label on the first
  const arrows = document.createElement('div'); arrows.id = 'tutArrows'; arrows.hidden = true; document.body.appendChild(arrows);
  const ARROW = '<svg width="92" height="28" viewBox="0 0 92 28"><path d="M90 14H12" stroke="#ffd35a" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M2 14L20 3v22z" fill="#ffd35a"/></svg>';
  arrows.innerHTML = `<div class="tu-arrow a1"><i>${ARROW}</i></div><div class="tu-arrow a2"><i>${ARROW}</i></div><b class="tu-lbl"></b>`;
  const placeArrow = (a, x, y, deg) => { a.style.left = `${x}px`; a.style.top = `${y - 14}px`; a.style.transform = `rotate(${deg}deg)`; };
  let marked = null;
  const hideArrows = () => { arrows.hidden = true; document.body.classList.remove('tut-spot'); if (marked) { marked.classList.remove('tut-target'); marked = null; } };
  // the arrows come from the side of the button with the most room: from the right for buttons on the
  // left of the screen, from the left for buttons on the right, from above for a wide bar
  const pointAt = (t, text) => {
    const r = t.getBoundingClientRect(), W = innerWidth, cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
    const a1 = arrows.querySelector('.a1'), a2 = arrows.querySelector('.a2'), lb = arrows.querySelector('.tu-lbl');
    let x, y, ang, x2, y2, ang2;
    if (r.width > W * 0.4) { x = cx; y = r.top - 10; ang = -90; x2 = cx + 34; y2 = r.top - 6; ang2 = -56; }
    else if (cx < W / 2) { x = r.right + 12; y = cy; ang = 0; x2 = r.right + 6; y2 = r.bottom + 4; ang2 = 34; }
    else { x = r.left - 12; y = cy; ang = 180; x2 = r.left - 6; y2 = r.bottom + 4; ang2 = 146; }
    placeArrow(a1, x, y, ang); placeArrow(a2, x2, y2, ang2);
    const tx = x + Math.cos(ang * Math.PI / 180) * 100, ty = y + Math.sin(ang * Math.PI / 180) * 100;
    lb.textContent = text; lb.style.left = `${tx}px`; lb.style.top = `${ty}px`;
    lb.style.transform = ang === 0 ? 'translate(0, -50%)' : ang === 180 ? 'translate(-100%, -50%)' : 'translate(-50%, -100%)';
    arrows.hidden = false;
    if (marked !== t) { if (marked) marked.classList.remove('tut-target'); marked = t; t.classList.add('tut-target'); }
    document.body.classList.toggle('tut-spot', !!t.closest('#tools'));     // dim the other toolbar buttons
  };
  // a mouse that shows the gesture, for the steps that are not about a button
  const gest = document.createElement('div'); gest.id = 'tutGesture'; gest.hidden = true; document.body.appendChild(gest);
  gest.innerHTML = '<svg width="46" height="66" viewBox="0 0 46 66"><rect x="3" y="3" width="40" height="60" rx="20" fill="rgba(10,14,22,.55)" stroke="#ffd35a" stroke-width="3"/><path class="lb" d="M23 4.5A18.5 18.5 0 0 0 4.5 23V26H23Z" fill="#ffd35a"/><line x1="23" y1="4" x2="23" y2="26" stroke="#ffd35a" stroke-width="2"/><rect class="wh" x="20" y="10" width="6" height="11" rx="3" fill="#ffd35a"/></svg><b></b>';
  const offer = document.createElement('div'); offer.id = 'tutOffer'; offer.hidden = true; document.body.appendChild(offer);
  let i = -1, raf = 0, st = null, t0 = 0;
  // "it is up here": shown when the pointed-at button has been scrolled out of its list. A click scrolls back to it.
  const away = document.createElement('button'); away.id = 'tutAway'; away.hidden = true; away.innerHTML = '<span></span>'; document.body.appendChild(away);
  let awayT = null;
  away.addEventListener('click', () => { if (awayT) awayT.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
  const scroller = (n) => { for (let p = n.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight + 2) return p; } return null; };
  const side = (n, p) => { const r = n.getBoundingClientRect(), c = p.getBoundingClientRect(), m = Math.min(16, r.height / 2); return r.bottom < c.top + m ? -1 : r.top > c.bottom - m ? 1 : 0; };

  // what each step needs to see before it is done
  const ratio = () => (rig.mode === 'orbit' && !rig.flying && rig.eph[rig.bodyId] ? rig.camera.position.distanceTo(rig.controls.target) / rig.eph[rig.bodyId].radius : 99);
  const begin = () => ({ r0: ratio(), dragged: 0, wheel: 0, speed: clock.speedIndex, ms: clock.ms, viewerWas: viewer.isOpen, down: null, paused: clock.paused, toggles: 0, sawMuseum: false, jumps: 0 });
  const done = (s) => {
    const id = STEPS[i].id;
    if (id === 'look') return s.dragged > 120;
    if (id === 'zoom') { const r = ratio(); if (r > s.r0) s.r0 = r; return r < s.r0 * 0.88 || s.wheel >= 4; }      // a little closer to any world is enough
    if (id === 'play') { if (clock.paused !== s.paused) { s.paused = clock.paused; s.toggles++; } return s.toggles >= 2; }
    if (id === 'goto') return rig.bodyId === 'moon' && !rig.flying && rig.mode === 'orbit';
    if (id === 'site') return rig.mode === 'site' && !rig.flying;
    if (id === 'object') return viewer.isOpen;
    if (id === 'exhibit') { if (museum.isOpen) s.sawMuseum = true; return s.sawMuseum && !museum.isOpen; }
    if (id === 'timeline') return s.jumps > 0 || !$('evlist').hidden;
    if (id === 'arrival') { if (scenePlaying()) s.saw = true; return !!s.saw && !scenePlaying(); }
    if (id === 'films') { const fl = document.getElementById('filmList'); return !!fl && !fl.hidden; }
    if (id === 'walk') { if (rig.photo && rig.photo.walk) s.walked = true; return !!s.walked && !(rig.photo && rig.photo.walk); }
    if (id === 'search') return !!document.querySelector('#panel .ps-card') && s.typed > 0 && performance.now() - s.typed > 2500;
    if (id === 'feat') return watched.size >= FEAT.length && !filmOpen();
    return false;
  };
  canvas.addEventListener('pointerdown', (e) => { if (st) st.down = [e.clientX, e.clientY]; }, true);
  window.addEventListener('pointermove', (e) => { if (st && st.down) { st.dragged += Math.abs(e.clientX - st.down[0]) + Math.abs(e.clientY - st.down[1]); st.down = [e.clientX, e.clientY]; } }, true);
  window.addEventListener('pointerup', () => { if (st) st.down = null; }, true);
  clock.on('jump', (j) => { if (st && Math.abs(j.to - j.from) > 86400e3) st.jumps++; });
  canvas.addEventListener('wheel', () => { if (st) st.wheel++; }, { capture: true, passive: true });
  document.addEventListener('input', (e) => { if (st && e.target.matches && e.target.matches('#panel .ps-in') && e.target.value.trim().length >= 2) st.typed = performance.now(); }, true);
  // which featured film is being watched
  const filmOpen = () => { const sc = document.getElementById('showcase'); return !!((sc && !sc.hidden) || document.getElementById('a11')); };
  let pend = null, sawOpen = false;
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-act="feat"]'); if (b) pend = b.dataset.id; }, true);
  const trackFilms = () => {
    if (filmOpen()) sawOpen = true; else if (sawOpen) { sawOpen = false; if (pend) { watched.add(pend); try { localStorage.setItem('anf-feat-seen', JSON.stringify([...watched])); } catch (e) { /* ignore */ } } }
    const fb = document.querySelector('#panel .featbox'); if (fb) fb.classList.toggle('a-seen', watched.has('apollo'));
    for (const b of document.querySelectorAll('#panel .featbox [data-act="feat"]')) b.classList.toggle('seen', watched.has(b.dataset.id));
  };
  document.addEventListener('click', (e) => { if (st && i >= 0 && STEPS[i].id === 'arrival' && e.target.closest && e.target.closest('[data-act="scene"]')) st.clicked = performance.now(); }, true);

  const stars = () => STEPS.slice(0, -1).map((s, k) => `<i class="${k < i ? 'on' : k === i ? 'now' : ''}">★</i>`).join('');
  const show = (k) => {
    i = k; st = begin(); t0 = performance.now(); const s = STEPS[k], last = k === STEPS.length - 1;
    el.className = last ? 'fin' : '';
    el.innerHTML = `<div class="tu-top"><span class="tu-k">Flight school</span><span class="tu-stars">${stars()}</span><button class="tu-x" data-a="quit" title="Leave flight school">✕</button></div>
      <div class="tu-body"><span class="tu-ico">${s.icon}</span><div><h3>${s.title}</h3><p class="tu-text">${s.text}</p><p class="tu-hint"></p></div></div>
      <div class="tu-row"></div>${last ? '<div class="tu-burst">' + '<b>★</b>'.repeat(14) + '</div>' : ''}`;
    rowKey = ''; refresh();
    el.hidden = false; document.body.classList.add('tut-on');
    if (s.home) onFinal();                                // (these steps are about the home panel)
  };
  // the hint and the buttons can change while a step is open (a film watched, the home panel reached)
  let rowKey = '';
  const refresh = () => {
    if (i < 0) return;
    const s = STEPS[i], last = i === STEPS.length - 1, hint = val(s.hint) || '', okOn = s.ok && (!s.okWhen || s.okWhen());
    const left = FEAT.filter(([id]) => !watched.has(id));
    const key = `${i}|${hint}|${okOn}|${left.length}`; if (key === rowKey) return; rowKey = key;
    const h = el.querySelector('.tu-hint'); h.textContent = hint ? `👉 ${hint}` : ''; h.hidden = !hint;
    el.querySelector('.tu-row').innerHTML = last
      ? (left.length ? `<button data-a="feat" data-id="${left[0][0]}" class="primary">Watch: ${left[0][1]}</button>` : '') + '<button data-a="quit">Explore on my own</button>'
      : okOn ? `<button data-a="skip" class="primary">${s.ok}</button>` : s.noSkip ? '' : '<button data-a="skip">Skip this step</button>';
    if (last) el.querySelector('.tu-text').textContent = left.length && left.length < FEAT.length ? `That is everything. You still have ${left.length} featured film${left.length > 1 ? 's' : ''} to see, right here; then the whole story, from 1958 to today, is yours to explore.` : left.length ? 'That is everything. Start with the four featured films, right here; then the whole story, from 1958 to today, is yours to explore.' : s.text;
  };
  const quit = () => { el.hidden = true; document.body.classList.remove('tut-on'); ring.hidden = true; ring2.hidden = true; away.hidden = true; hideArrows(); gest.hidden = true; i = -1; st = null; try { localStorage.setItem('anf-flight-school', '1'); } catch (e) { /* storage may be unavailable */ } };
  const advance = () => {
    el.classList.add('ok');
    const k = i; setTimeout(() => { if (i === k) show(k + 1); }, 850);
    i = -2; st = null;                                   // pause checks during the little celebration
    setTimeout(() => { if (i === -2) i = k; }, 0);
  };
  const tick = () => {
    raf = requestAnimationFrame(tick);
    trackFilms();
    if (i < 0 || el.hidden) { ring.hidden = true; ring2.hidden = true; away.hidden = true; hideArrows(); gest.hidden = true; return; }
    if (innerWidth <= 760) {                              // on a phone: between the buttons at the top and the panel at the bottom
      const tb = document.getElementById('tools'), rt = document.getElementById('right'), top = tb ? tb.getBoundingClientRect().bottom + 8 : 120, bot = rt ? rt.getBoundingClientRect().top - 8 : innerHeight - 60;
      el.style.top = `${top}px`; el.style.bottom = 'auto'; el.style.maxHeight = `${Math.max(150, bot - top)}px`;
    } else if (el.style.top) { el.style.top = ''; el.style.bottom = ''; el.style.maxHeight = ''; }
    refresh();
    const s = STEPS[i], ts = val(s.target), t = ts && document.querySelector(ts), t2 = s.target2 && document.querySelector(s.target2);
    if (s.reveal && t && st && !st.revealed && !busy()) { st.revealed = true; t.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    if (t && t.closest('#tools') && !t.getClientRects().length && window.__menu) window.__menu(true);
    // a target inside a scrolled list (the right panel) can be scrolled out of sight: then the ring and the
    // arrows must not float over the page; a little sign at the edge of the list says which way it is
    const sc = t && scroller(t), off = sc ? side(t, sc) : 0;
    const put = (rg, tg, shown) => {
      if (!shown) { rg.hidden = true; return; }
      const r = tg.getBoundingClientRect(), pad = 7, c = tg === t && sc ? sc.getBoundingClientRect() : null;
      const top = c ? Math.max(r.top - pad, c.top + 1) : r.top - pad, bot = c ? Math.min(r.bottom + pad, c.bottom - 1) : r.bottom + pad;
      rg.hidden = false; rg.style.left = `${r.left - pad}px`; rg.style.top = `${top}px`; rg.style.width = `${r.width + pad * 2}px`; rg.style.height = `${Math.max(0, bot - top)}px`;
    };
    put(ring, t, t && t.offsetParent !== null && !busy() && !off);
    put(ring2, t2, t2 && t2.getClientRects().length > 0 && !busy());   // (this one may be a fixed button, which has no offsetParent)
    if (s.arrows && t && t.getClientRects().length > 0 && !busy() && !off && !(s.id === 'arrival' && scenePlaying())) pointAt(t, val(s.arrows)); else hideArrows();
    if (off && !busy() && t.offsetParent !== null) {
      const c = sc.getBoundingClientRect();
      away.firstChild.textContent = off < 0 ? '\u25b2 It\u2019s up here! Scroll up' : '\u25bc It\u2019s down here! Scroll down';
      away.className = off < 0 ? 'up' : 'down'; away.hidden = false; awayT = t;
      away.style.left = `${(c.left + c.right) / 2}px`; away.style.top = off < 0 ? `${c.top + 10}px` : `${c.bottom - 10}px`;
    } else away.hidden = true;
    if (s.gesture && !busy()) { gest.className = s.gesture; gest.querySelector('b').textContent = s.gestureText; gest.hidden = false; } else gest.hidden = true;
    if (st && performance.now() - t0 > 500 && done(st)) advance();
  };
  if (!raf) raf = requestAnimationFrame(tick);
  const start = () => { offer.hidden = true; if (!introGone()) return; show(0); if (!raf) raf = requestAnimationFrame(tick); };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'quit') quit(); else if (b.dataset.a === 'apollo') { quit(); onApollo(); } else if (b.dataset.a === 'feat') { quit(); onFeatured(b.dataset.id); } else if (b.dataset.a === 'skip' && i >= 0) show(i + 1);
  });

  // a small invitation the first time; the button is always there
  const btn = document.createElement('button'); btn.id = 'goSchool'; btn.className = 'tool school'; btn.textContent = 'Start guidance'; btn.title = 'A short, hands-on lesson in how to use this';
  $('tools').insertBefore(btn, $('moreBox'));
  btn.addEventListener('click', () => { if (i >= 0 || !el.hidden) quit(); else start(); });
  offer.innerHTML = `<span class="to-ico">🎓</span><div><b>First time here?</b><p>Take the flight school and learn the controls by using them.</p><div class="tu-row"><button data-a="yes" class="primary">Let's go</button><button data-a="no">No thanks</button></div></div>`;
  offer.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (!b) return; offer.hidden = true; if (b.dataset.a === 'yes') start(); else { try { localStorage.setItem('anf-flight-school', '1'); } catch (er) { /* ignore */ } } });
  return {
    invite() { let seen = false; try { seen = localStorage.getItem('anf-flight-school') === '1'; } catch (e) { /* ignore */ } if (!seen && i < 0) { offer.hidden = false; setTimeout(() => { offer.hidden = true; }, 20000); } },
    start, quit, active: () => i >= 0 || i === -2,
    stepId: () => (i >= 0 ? STEPS[i].id : null),
    step(k) { show(k); if (!raf) raf = requestAnimationFrame(tick); },   // (for testing)
  };
}
