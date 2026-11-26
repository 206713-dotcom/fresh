/* Twistor — the picture the site is named after, drawn live: Roger Penrose's image of a single (non-null) twistor.
   A twistor of this kind is a family of light rays that twist around each other, the Robinson congruence. At one
   instant, the directions of its rays line up along circles: the fibres of the Hopf map S³ → S², projected
   stereographically into ordinary space. The circles lie on nested tori around one round core circle, a single
   straight line runs through them all (the circle that passes through infinity), and every circle is linked once with
   every other.
   How it is drawn. A point of the 3-sphere is (cos η e^{i(t + a)}, sin η e^{i(t + b)}): η picks the torus, a − b
   the circle on it, t the place along the circle. Projection from (0, 0, 0, 1) sends x to (x₁, x₂, x₃)/(1 − x₄).
   The pattern is turned slowly about its axis to show depth; a slow rotation in the (x₃, x₄) plane slides each circle
   along its torus into the place of the next (it maps circles to circles, so the family is unchanged); the bright
   points run along the circles, one way, like the light the circles stand for.
   Colours are labels, not physics: hue follows a circle's place around its torus.
   Canvas 2D only (no WebGL), so it runs everywhere. Smoothness: before anything shows, one full frame is timed and the
   detail (and, on a slow machine, the resolution) is chosen from that, so the picture never changes quality while it
   is on screen; the clock advances by at most 1/24 s per frame, so a busy moment slows the motion for a frame instead
   of making it jump; the home picture waits while the start screen covers it. With reduced motion it draws one still
   frame.
   API: WL.twistor.start(canvas, opts) → { stop(), outro(done), supported }   (the start screen)
        WL.twistor.hero(canvas) → { destroy() }                              (the home page) */
(function () {
  const WL = (window.WL = window.WL || {});
  const TAU = Math.PI * 2;
  const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const STOPS = [[92, 214, 255], [122, 146, 255], [196, 116, 255], [255, 118, 200], [255, 184, 122], [255, 226, 150], [92, 214, 255]];
  const HB = 28, DB = 7;                                   // hue buckets × depth buckets
  function mix(u) {
    u -= Math.floor(u);
    const x = u * (STOPS.length - 1), i = Math.min(STOPS.length - 2, Math.floor(x)), f = x - i, a = STOPS[i], b = STOPS[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  const STYLE = [], CORE = [];
  for (let h = 0; h < HB; h++) {
    const c = mix(h / HB); STYLE.push([]); CORE.push(c);
    for (let d = 0; d < DB; d++) {
      const k = (d + 1) / DB, a = 0.1 + 0.78 * Math.pow(k, 1.5);
      STYLE[h].push(`rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a.toFixed(3)})`);
    }
  }
  /* one glowing point, drawn once and stamped */
  function sprite(rgb, size) {
    const s = document.createElement('canvas'); s.width = s.height = size; const g = s.getContext('2d'), r = size / 2;
    const gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.12, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.95)`);
    gr.addColorStop(0.38, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.28)`); gr.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, size, size); return s;
  }
  let SPR = null;
  const sprites = () => SPR || (SPR = CORE.filter((c, i) => i % 4 === 0).map((c) => sprite(c, 48)));

  /* the circles: η from near the core circle out to wide tori; the middle tori carry more circles */
  const LEVELS = [{ tori: 3, base: 11, seg: 84, glow: 1 }, { tori: 3, base: 14, seg: 120, glow: 1 }, { tori: 3, base: 17, seg: 168, glow: 2 }];
  function geometry(L, etaMax, shells, scale) {
    const C = [], tori = shells ? shells.length : L.tori, k1 = Math.max(1, tori - 1);
    for (let k = 0; k < tori; k++) {
      const eta = shells ? shells[k][0] : 0.26 + (k / k1) * (etaMax - 0.26);
      const n = shells ? Math.max(4, Math.round(shells[k][1] * (scale || 1))) : Math.max(6, Math.round(L.base * (0.6 + 0.6 * Math.sin(2 * eta))));
      for (let j = 0; j < n; j++) {
        /* hue: mostly which torus (inner cyan, outer amber), with a little drift around it */
        const a = (j / n) * TAU + k * 0.41, u = (0.02 + 0.62 * (k / k1) + 0.07 * Math.sin((j / n) * TAU) + 1) % 1;
        C.push({ k, ce: Math.cos(eta), se: Math.sin(eta), ca: Math.cos(a), sa: Math.sin(a), hb: Math.floor(u * HB) % HB, u, w: 1 - 0.28 * (k / k1), ph: (j * 2.399 + k * 1.3) % TAU, s0: (j * 37 + k * 11) % L.seg, delay: 0.5 + k * 0.55 + (j / n) * 1.3 });
      }
    }
    const ct = new Float32Array(L.seg + 1), st = new Float32Array(L.seg + 1);
    for (let i = 0; i <= L.seg; i++) { ct[i] = Math.cos((i / L.seg) * TAU); st[i] = Math.sin((i / L.seg) * TAU); }
    return { C, ct, st, seg: L.seg, glow: L.glow };
  }

  function make(cv, o) {
    o = Object.assign({ shells: [[0.34, 36], [0.62, 52], [0.9, 64]], etaMax: 0.9, dist: 7.6, pitch: 0.28, yaw0: 0.6, spin: 0.022, slide: 0.026, flow: 0.42, zoom: 1, cx: 0.5, cy: 0.5, intro: true, level: 2, photons: 1, axis: true, glow: 0.85, ink: 0.62, auto: true, hold: null }, o || {});
    const ctx = cv.getContext('2d', { alpha: true });
    const c1 = document.createElement('canvas'), g1 = c1.getContext('2d'), c2 = document.createElement('canvas'), g2 = c2.getContext('2d');
    const weak = (navigator.hardwareConcurrency || 4) < 4 || !!(window.matchMedia && matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820);
    if (weak && o.level > 1) o.level = 1;
    let W = 0, H = 0, dpr = 1, raf = 0, alive = true, visible = true, level = o.level, G = geometry(LEVELS[level], o.etaMax, o.shells, [0.5, 0.75, 1][level]);
    let last = -1, clock = 0, outroAt = 0, outroDone = null, fade = 1, budget = 2.4e6;
    const X = new Float32Array(LEVELS[2].seg + 1), Y = new Float32Array(LEVELS[2].seg + 1), Z = new Float32Array(LEVELS[2].seg + 1);
    function resize() {
      const r = cv.getBoundingClientRect(); const px = Math.max(1, r.width * r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(budget / px));
      W = Math.max(2, Math.round(r.width * dpr)); H = Math.max(2, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c1.width = Math.max(2, W >> 2); c1.height = Math.max(2, H >> 2); c2.width = Math.max(2, W >> 3); c2.height = Math.max(2, H >> 3);
      if (REDUCED || !alive) draw(performance.now());
    }
    const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
    function draw(now, Tfix, Qfix) {
      const T = Tfix != null ? Tfix : REDUCED ? 40 : clock / 1000;
      let dist = o.dist, zoom = o.zoom, alpha = fade, cx = o.cx, cyy = o.cy;
      if (outroAt || Qfix != null) {
        const q = Qfix != null ? Qfix : Math.min(1, (now - outroAt) / 2600), e = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
        dist = o.dist * (1 - 0.9 * e); zoom = o.zoom * (1 + 0.6 * e); alpha = fade * (1 - ease((q - 0.6) / 0.4));
        const m = ease(q * 1.4); cx = o.cx + (0.5 - o.cx) * m; cyy = o.cy + (0.5 - o.cy) * m;   // fly towards the middle of the screen
        if (Qfix == null && q >= 0.7 && outroDone) { const f = outroDone; outroDone = null; f(); }
        if (Qfix == null && q >= 1) { alive = false; }
      }
      const yaw = o.yaw0 + T * o.spin, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
      const beta = T * o.slide, cb = Math.cos(beta), sb = Math.sin(beta);
      const F = Math.min(W, H) * 0.92 * zoom, ox = W * cx, oy = H * cyy, near = 0.12;
      const reveal = o.intro && !REDUCED ? T : 99;
      if (o.intro && !REDUCED && !outroAt && Tfix == null) alpha *= Math.min(1, T / 1.4);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
      if (alpha <= 0.001) return;
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha; ctx.lineCap = 'butt'; ctx.lineJoin = 'bevel';
      const paths = new Array(HB * DB), seg = G.seg, ct = G.ct, st = G.st, dNear = Math.max(0.6, dist - 3.6), dFar = dist + 3.6;
      const lw = [0.7, 0.8, 0.95, 1.1, 1.3, 1.55, 1.9].map((w) => w * dpr * (W < 900 ? 0.9 : 1));
      const photons = [];
      for (const c of G.C) {
        const v0 = Math.min(1, Math.max(0, (reveal - c.delay) / 2.6)), vis = v0 * v0 * (3 - 2 * v0); if (vis <= 0) continue;
        const n = Math.max(2, Math.round(vis * seg));
        /* the circle at this moment, in camera space */
        for (let i = 0; i <= seg; i++) {
          const ca = c.ca * ct[i] - c.sa * st[i], sa = c.sa * ct[i] + c.ca * st[i];
          const x1 = c.ce * ca, x2 = c.ce * sa, x3 = c.se * (ct[i] * cb - st[i] * sb), x4 = c.se * (st[i] * cb + ct[i] * sb);
          const den = 1 / (1 - x4), px = x1 * den, py = x2 * den, pz = x3 * den;
          const Xw = px * cyw - py * syw, Yw = px * syw + py * cyw;
          X[i] = Xw; Y[i] = Yw * sp + pz * cp; Z[i] = dist + Yw * cp - pz * sp;
        }
        let prevB = -1, path = null, pxs = 0, pys = 0, have = false;
        for (let m = 0; m <= n; m++) {
          const i = (c.s0 + m) % seg, z = Z[i];
          if (z < near) { have = false; prevB = -1; continue; }
          const sx = ox + (F * X[i]) / z, sy = oy - (F * Y[i]) / z;
          const db = Math.max(0, Math.min(DB - 1, Math.floor(((dFar - z) / (dFar - dNear)) * DB * c.w)));
          if (have) {
            if (db !== prevB) { const key = c.hb * DB + db; path = paths[key] || (paths[key] = new Path2D()); path.moveTo(pxs, pys); prevB = db; }
            path.lineTo(sx, sy);
          } else { const key = c.hb * DB + db; path = paths[key] || (paths[key] = new Path2D()); path.moveTo(sx, sy); prevB = db; }
          pxs = sx; pys = sy; have = true;
        }
        if (o.photons && vis >= 1) {
          for (let p = 0; p < o.photons; p++) {
            const tt = ((c.ph + p * Math.PI + T * o.flow) % TAU + TAU) % TAU, i = Math.floor((tt / TAU) * seg) % seg, z = Z[i];
            if (z > near) photons.push([ox + (F * X[i]) / z, oy - (F * Y[i]) / z, z, c.hb]);
          }
        }
      }
      const small = Math.min(1, 0.5 + 0.5 * (Math.min(W, H) / dpr) / 760);
      ctx.globalAlpha = alpha * o.ink * small;
      for (let h = 0; h < HB; h++) for (let d = 0; d < DB; d++) {
        const p = paths[h * DB + d]; if (!p) continue;
        ctx.strokeStyle = STYLE[h][d]; ctx.lineWidth = lw[d]; ctx.stroke(p);
      }
      ctx.globalAlpha = alpha;
      /* the straight member of the family: the circle through infinity, seen as the axis */
      if (o.axis) {
        const pts = []; for (let k = -24; k <= 24; k++) { const zz = k * 0.16, z = dist - zz * sp; if (z > near) pts.push([ox, oy - (F * (zz * cp)) / z, Math.abs(k)]); }
        for (let k = 1; k < pts.length; k++) { const a = 0.3 * Math.pow(Math.max(0, 1 - pts[k][2] / 24), 2.2); if (a <= 0.004) continue; ctx.strokeStyle = `rgba(206,222,255,${a.toFixed(3)})`; ctx.lineWidth = 1 * dpr; ctx.beginPath(); ctx.moveTo(pts[k - 1][0], pts[k - 1][1]); ctx.lineTo(pts[k][0], pts[k][1]); ctx.stroke(); }
      }
      if (photons.length) {
        const S = sprites();
        for (const [x, y, z, hb] of photons) {
          const k = Math.max(0.25, Math.min(1, (dFar - z) / (dFar - dNear))), r = (4 + 8 * k * k) * dpr;
          ctx.globalAlpha = alpha * (0.35 + 0.65 * k); ctx.drawImage(S[Math.floor(hb / 4) % S.length], x - r, y - r, 2 * r, 2 * r);
        }
        ctx.globalAlpha = alpha;
      }
      /* bloom: the frame, shrunk twice and laid back over itself */
      if (o.glow && G.glow) {
        g1.globalCompositeOperation = 'copy'; g1.drawImage(cv, 0, 0, c1.width, c1.height);
        g2.globalCompositeOperation = 'copy'; g2.drawImage(c1, 0, 0, c2.width, c2.height);
        ctx.globalCompositeOperation = 'lighter';
        const gs = Math.min(1, 0.45 + 0.55 * (Math.min(W, H) / dpr) / 760);
        ctx.globalAlpha = 0.5 * o.glow * gs; ctx.drawImage(c1, 0, 0, W, H);
        if (G.glow > 1) { ctx.globalAlpha = 0.6 * o.glow * gs; ctx.drawImage(c2, 0, 0, W, H); }
        ctx.globalAlpha = 1;
      }
    }
    function loop(now) {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const dt = last < 0 ? 0 : now - last; last = now;
      if (!visible || (o.hold && o.hold())) return;         // hidden, scrolled away or covered: no drawing, no time passes
      clock += Math.min(dt, 1000 / 24);                      // a long frame slows the motion a little instead of jumping it
      draw(now);
    }
    /* time one whole frame before anything is shown, and choose the detail from it: about 12 ms of drawing at most */
    function choose() {
      const t = [];
      for (let i = 0; i < 3; i++) { const a = performance.now(); draw(0, 30); t.push(performance.now() - a); }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
      const c = Math.min(t[1], t[2]), share = [0.25, 0.54, 1], at = share[level];
      let pick = level; while (pick > 0 && (c * share[pick]) / at > 12) pick--;
      if (pick !== level) { level = pick; G = geometry(LEVELS[level], o.etaMax, o.shells, [0.5, 0.75, 1][level]); }
      if ((c * share[pick]) / at > 12) { budget = 1.2e6; resize(); }   // still slow: draw at a lower resolution as well
      return Math.round(c * 10) / 10;
    }
    const onVis = () => { visible = !document.hidden && inView; };
    let inView = true, io = null;
    if ('IntersectionObserver' in window) { io = new IntersectionObserver((es) => { inView = es[0].isIntersecting; onVis(); }); io.observe(cv); }
    document.addEventListener('visibilitychange', onVis);
    addEventListener('resize', resize);
    resize();
    let cost = null;
    if (!REDUCED && o.auto) { try { cost = choose(); } catch (e) {} }
    if (REDUCED) draw(performance.now()); else raf = requestAnimationFrame(loop);
    return {
      supported: true,
      get detail() { return { level, dpr: Math.round(dpr * 100) / 100, cost }; },
      stop() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVis); if (io) io.disconnect(); },
      /* fly in through the core circle; done() runs part-way, while the picture is still fading */
      outro(done) {
        if (REDUCED || !alive) { done(); return; }
        outroDone = done; outroAt = performance.now();
        setTimeout(() => { if (outroDone) { const f = outroDone; outroDone = null; f(); } }, 3400);
      },
      set(k, v) { o[k] = v; if (k === 'etaMax' || k === 'level') { level = o.level; G = geometry(LEVELS[level], o.etaMax, o.shells, [0.5, 0.75, 1][level]); } if (k === 'budget') { budget = v; resize(); } },
      /* draw one frame at a chosen time (seconds) and fly-in progress (0–1, or null): for films and still pictures */
      renderAt(T, q) { cancelAnimationFrame(raf); alive = false; resize(); draw(performance.now(), T, q == null ? null : q); }
    };
  }

  /* the start screen: big, close, slowly turning, drawn on as it appears */
  function start(cv, opts) {
    const wide = (cv.clientWidth || innerWidth) > (cv.clientHeight || innerHeight) * 1.15;
    return make(cv, Object.assign({ cx: wide ? 0.7 : 0.5, cy: wide ? 0.5 : 0.34, dist: wide ? 7.4 : 8.6, zoom: wide ? 1.22 : 1.05, level: 2 }, opts || {}));
  }
  /* the home hero: further away, quieter, no draw-on */
  function hero(cv) {
    if (!cv) return { destroy() {} };
    /* while the start screen covers the page, the home picture waits, so only one twistor is ever being drawn */
    const covered = () => { const g = document.getElementById('gate'); return !!(g && !g.hidden && !g.classList.contains('gone')); };
    /* wide: the twistor to the right of the words. Narrower: under them, sized to the space the hero leaves at its foot.
       Worked out again whenever the hero changes size, so a window that opens narrow and then widens is never left
       with the drawing behind the text. */
    const place = () => {
      const w = cv.clientWidth || innerWidth, h = cv.clientHeight || innerHeight;
      if (w > 1060) return w < 1300 ? { cx: 0.77, cy: 0.52, zoom: 1 } : { cx: 0.73, cy: 0.52, zoom: 1.12 };   // 1060–1300: a little smaller and further right, clear of the words
      const inn = cv.parentNode && cv.parentNode.querySelector('.hh-in');
      const pad = (inn && parseFloat(getComputedStyle(inn).paddingBottom)) || 300;
      return { cx: 0.5, cy: Math.min(0.86, 1 - (pad * 0.46) / h), zoom: Math.min(1.3, Math.max(0.5, (pad * 1.32) / (Math.min(w, h) * 0.92))) };
    };
    let p = place(), tm = 0;
    const s = make(cv, { cx: p.cx, cy: p.cy, dist: 8.2, zoom: p.zoom, intro: false, level: (cv.clientWidth || innerWidth) > 760 ? 2 : 1, spin: 0.016, slide: 0.02, flow: 0.32, glow: 0.5, hold: covered });
    const ro = window.ResizeObserver ? new ResizeObserver(() => { clearTimeout(tm); tm = setTimeout(() => { p = place(); s.set('cx', p.cx); s.set('cy', p.cy); s.set('zoom', p.zoom); }, 60); }) : null;
    if (ro) ro.observe(cv);
    return { destroy() { clearTimeout(tm); if (ro) ro.disconnect(); s.stop(); } };
  }
  WL.twistor = { start, hero, make };
  WL.heroGalaxy = hero;                                    // the home page asks for its hero by this name
})();
