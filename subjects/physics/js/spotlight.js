/* Twistor — the home page spotlight: "You might be interested in…".
   One short video at a time. Most are the "See it" passage of a topic's own video; a few are stand-alone clips in spot/.
   Each one plays through, then the next appears. The viewer can pause, step back and forth, or open the lesson. */
(function () {
  const WL = (window.WL = window.WL || {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  WL.spots = [
    { topic: 'y4-qed', src: 'spot/dirac.mp4', title: 'The most beautiful equation', hook: 'Dirac asked quantum mechanics to respect relativity. The equation answered with spin and antimatter, which nobody had asked for.' },
    { topic: 'y4-chaos', title: 'Three equations nobody can predict', hook: 'The Lorenz system is completely deterministic, yet two starts a hair apart end in different places. Watch them part on the butterfly.' },
    { topic: 'y4-schwarzschild', title: 'Where light runs out of road', hook: 'Near a black hole light bends, then circles, then cannot leave at all. The shadow in the famous images is the edge of that capture.' },
    { topic: 'y3-tunnelling', title: 'Through the wall', hook: 'A particle meets a barrier it has no energy to climb, and part of it arrives on the far side anyway. It is why the Sun can shine.' },
    { topic: 'y4-gravitational-waves', title: 'The sound of two black holes', hook: 'A passing wave stretches space one way and squeezes it the other. In 2015 LIGO caught one that moved its mirrors by a fraction of a proton’s width.' },
    { topic: 'm-complex', title: 'Why e^{iπ} is −1', hook: 'e^{iθ} is a point walking round the unit circle. Half a turn lands on −1, and Euler’s identity stops being a mystery.' },
    { topic: 'y1-sr', title: 'Why moving clocks run slow', hook: 'One light clock, one moving train and one stubborn fact: everybody measures the same speed of light.' },
    { topic: 'y3-entanglement', title: 'The experiment that ruled out common sense', hook: 'Bell found a number that every local hidden-variable theory keeps below 2. Entangled particles reach about 2.8.' },
    { topic: 'y4-higgs', title: 'Mass from a symmetric law', hook: 'The Higgs potential is perfectly symmetric, but its lowest point is not at the centre. The field rolls off, and the W and Z gain mass.' },
    { topic: 'y4-ising', title: 'How a magnet makes up its mind', hook: 'Each spin feels only its neighbours, yet at one exact temperature the whole lattice organises on every scale at once.' },
    { topic: 'm-fourier-series', title: 'Every shape is a sum of waves', hook: 'Add sines of the right sizes and a square wave appears, apart from a stubborn 9% overshoot beside each jump.' },
    { topic: 'y3-hydrogen', title: 'The shape of an atom', hook: 'Solve Schrödinger’s equation for one electron and one proton, and the orbitals of chemistry fall out with the right energies.' },
    { topic: 'y4-gr', title: 'Gravity is geometry', hook: 'Mass tells spacetime how to curve, and spacetime tells mass how to move. A falling body is following the straightest path there is.' },
    { topic: 'y2-em-waves', title: 'Light, predicted on paper', hook: 'Maxwell combined his equations and found a wave whose speed he could calculate. It matched the measured speed of light.' },
    { topic: 'y3-spin', title: 'Two spots, not a smear', hook: 'Silver atoms sent through a magnet should spread into a band. They land in exactly two places: spin is quantised.' },
    { topic: 'y4-friedmann', title: 'The universe has a size history', hook: 'Two assumptions, the same everywhere and the same in every direction, reduce cosmology to one function of time.' }
  ];

  const sup = (s) => esc(s).replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
  function source(sp) {                                  // → { src, a, b } : file and the passage to play
    if (sp.src) return { src: sp.src, a: 0, b: null };
    const full = (WL.videos || {})[sp.topic], stub = (WL.svideos || {})[sp.topic], v = full || stub; if (!v) return null;
    const i = v.ch.findIndex((c) => c[1] === 'See it'); if (i < 0) return null;
    return { src: (full ? 'videos/' : 'svideos/') + sp.topic + '.mp4', a: v.ch[i][0] + 0.05, b: (v.ch[i + 1] || [v.dur])[0] - 0.15 };
  }

  /* mount(host, { nodes, stageShort }) → { destroy } */
  WL.spotlight = function (host, o) {
    const list = WL.spots.map((sp) => Object.assign({}, sp, { play: source(sp), node: o.nodes[sp.topic] })).filter((sp) => sp.play && sp.node);
    if (!list.length) { host.hidden = true; return { destroy() {} }; }
    let i = 0; try { i = (parseInt(localStorage.getItem('wl-spot') || '0', 10) || 0) % list.length; } catch (e) {}
    let alive = true, userPaused = reduced, inView = false, timer = 0;
    host.innerHTML = `
      <div class="spot-media">
        <div class="spot-stage">
          <video muted playsinline preload="auto" aria-label="Spotlight video"></video>
          <button type="button" class="spot-play" data-spot="toggle" aria-label="Pause"><svg viewBox="0 0 20 20" aria-hidden="true"></svg></button>
        </div>
        <div class="spot-bars" aria-hidden="true">${list.map(() => '<i><b></b></i>').join('')}</div>
      </div>
      <div class="spot-copy">
        <p class="spot-eyebrow" id="spot-h">You might be interested in…</p>
        <div class="spot-text"></div>
        <div class="spot-nav"><button type="button" class="hbtn" data-spot="prev" aria-label="Previous video"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4.5L6.5 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="spot-count"></span><button type="button" class="hbtn" data-spot="next" aria-label="Next video"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4.5l5.5 5.5L8 15.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      </div>`;
    const v = host.querySelector('video'), text = host.querySelector('.spot-text'), bars = [...host.querySelectorAll('.spot-bars b')], count = host.querySelector('.spot-count'), tog = host.querySelector('.spot-play');
    const ICON = { pause: '<rect x="5.5" y="4.5" width="3.2" height="11" rx="1" fill="currentColor"/><rect x="11.3" y="4.5" width="3.2" height="11" rx="1" fill="currentColor"/>', play: '<path d="M7 4.5v11l8.5-5.5z" fill="currentColor"/>' };
    const setIcon = () => { const p = v.paused; tog.querySelector('svg').innerHTML = p ? ICON.play : ICON.pause; tog.setAttribute('aria-label', p ? 'Play' : 'Pause'); tog.classList.toggle('show', p); };
    const want = () => inView && !userPaused && !document.hidden;
    const sync = () => { if (!alive) return; if (want()) v.play().catch(() => {}); else v.pause(); };

    function show(k, user) {
      i = (k + list.length) % list.length; const sp = list[i], n = sp.node;
      try { localStorage.setItem('wl-spot', String((i + 1) % list.length)); } catch (e) {}
      host.classList.add('swap');
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!alive) return;
        text.innerHTML = `<h2 class="spot-title">${sup(sp.title)}</h2><p class="spot-hook">${esc(sp.hook)}</p>
          <p class="spot-meta">${esc(o.stageShort(sp.topic))} · ${esc(n.title)}</p>
          <div class="spot-act"><a class="btn primary" href="#t-${sp.topic}">Open the lesson</a><button type="button" class="btn ghost" data-spot="next">Show me another</button></div>`;
        count.textContent = `${i + 1} / ${list.length}`;
        bars.forEach((b, j) => { b.style.width = j < i ? '100%' : '0%'; });
        v.src = sp.play.src + (sp.play.b ? `#t=${sp.play.a.toFixed(2)},${sp.play.b.toFixed(2)}` : '');
        v.load();
        if (user) userPaused = reduced;
        host.classList.remove('swap'); sync(); setIcon();
      }, host.querySelector('.spot-title') ? 220 : 0);
    }
    const next = (user) => show(i + 1, user), prev = () => show(i - 1, true);

    const onTime = () => {
      const p = list[i].play, end = p.b || v.duration || 0; if (!end) return;
      bars[i].style.width = Math.max(0, Math.min(100, ((v.currentTime - p.a) / (end - p.a)) * 100)) + '%';
      if (p.b && v.currentTime >= p.b - 0.05) { v.pause(); if (!userPaused) { clearTimeout(timer); timer = setTimeout(() => alive && next(false), 900); } }
    };
    const onEnded = () => { if (!userPaused) { clearTimeout(timer); timer = setTimeout(() => alive && next(false), 900); } };
    const onMeta = () => { const p = list[i].play; if (p.a > 0.2 && v.currentTime < p.a - 0.3) { try { v.currentTime = p.a; } catch (e) {} } };
    const onErr = () => { clearTimeout(timer); timer = setTimeout(() => alive && next(false), 400); };
    const onClick = (e) => {
      const b = e.target.closest('[data-spot]');
      if (b) { const k = b.dataset.spot; if (k === 'next') next(true); else if (k === 'prev') prev(); else { userPaused = !v.paused; sync(); if (!userPaused && list[i].play.b && v.currentTime >= list[i].play.b - 0.1) { v.currentTime = list[i].play.a; v.play().catch(() => {}); } } return; }
      if (e.target === v) { userPaused = !v.paused; sync(); }
    };
    const onKey = (e) => { if (e.target.closest('a, input, textarea')) return; if (e.key === 'ArrowRight') next(true); else if (e.key === 'ArrowLeft') prev(); };
    const onVis = () => sync();
    v.addEventListener('timeupdate', onTime); v.addEventListener('ended', onEnded); v.addEventListener('loadedmetadata', onMeta); v.addEventListener('error', onErr, true);
    v.addEventListener('play', setIcon); v.addEventListener('pause', setIcon);
    host.addEventListener('click', onClick); host.addEventListener('keydown', onKey); document.addEventListener('visibilitychange', onVis);
    let io = null;
    if ('IntersectionObserver' in window) { io = new IntersectionObserver((es) => { inView = es[0].isIntersecting && es[0].intersectionRatio > 0.35; sync(); }, { threshold: [0, 0.35, 0.7] }); io.observe(host.querySelector('.spot-stage')); } else inView = true;
    show(i, false);
    return { destroy() { alive = false; clearTimeout(timer); try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} if (io) io.disconnect(); document.removeEventListener('visibilitychange', onVis); } };
  };
})();
