/* Geodesic: the background void (static stars + a faint spacetime horizon) and the home hero's two galaxies passing. */
(function () {
  const WL = (window.WL = window.WL || {});
  const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---------- static background: drawn once per resize ---------- */
  function drawVoid() {
    const cv = document.getElementById('void'); if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = innerWidth, H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    const hy = H * 0.64, vx = W * 0.5;
    c.lineWidth = 1;
    for (let k = -30; k <= 30; k++) { c.strokeStyle = `rgba(124,170,255,${(0.055 * (1 - Math.abs(k) / 32)).toFixed(3)})`; c.beginPath(); c.moveTo(vx + k * 5, hy); c.lineTo(vx + k * W * 0.075, H + 4); c.stroke(); }
    for (let j = 1; j <= 16; j++) { const t = Math.pow(j / 16, 2.3), y = hy + (H - hy) * t; c.strokeStyle = `rgba(124,170,255,${(0.012 + 0.05 * t).toFixed(3)})`; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    const g = c.createLinearGradient(0, hy - 10, 0, hy + 140); g.addColorStop(0, 'rgba(3,6,13,1)'); g.addColorStop(1, 'rgba(3,6,13,0)');
    c.fillStyle = g; c.fillRect(0, hy - 10, W, 150);
    const r = rng(11), n = Math.round((W * H) / 4600);
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = r() * H * 0.98, m = Math.pow(r(), 3.2), a = 0.12 + 0.6 * m, s = 0.35 + 1.15 * m, w = r();
      c.fillStyle = `rgba(${Math.round(205 + 50 * w)},${Math.round(218 + 30 * w)},255,${a.toFixed(3)})`; c.beginPath(); c.arc(x, y, s, 0, 6.2832); c.fill();
      if (m > 0.55) { const gl = c.createRadialGradient(x, y, 0, x, y, 7 * s); gl.addColorStop(0, `rgba(170,205,255,${(0.18 * m).toFixed(3)})`); gl.addColorStop(1, 'rgba(170,205,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y, 7 * s, 0, 6.2832); c.fill(); }
    }
  }
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawVoid, 120); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawVoid); else drawVoid();

  /* ---------- hero: two galaxies passing ----------
     Toomre and Toomre's restricted three-body picture (1972). Two galactic cores of equal mass fly past each other on a
     parabolic orbit, and each star is a test particle that feels only the two cores. Every star starts on a circular
     orbit in its own disk, tilted to the orbit; gravity alone then draws out the long tidal tails and the bridge.
     Units G = 1, core mass 1, pericentre 1; cores softened; leapfrog steps of 0.01. Each pass uses new disk tilts. */
  WL.heroGalaxy = function (cv) {
    const small = matchMedia('(max-width: 700px)').matches, N = small ? 900 : 2100, M = 2 * N;
    const DT = 0.01, TB = 3.6, TEND = TB + 8.8, RATE = 1.05, E2 = 0.08 * 0.08, C2 = 0.06 * 0.06;
    const c = cv.getContext('2d'); let W = 0, H = 0, dpr = 1, raf = 0, last = 0, visible = true, alive = true, t = 0, fading = 0, seed = 1;
    const X = new Float32Array(3 * M), Vv = new Float32Array(3 * M), A = new Float32Array(3 * M), K = new Uint8Array(M);
    const core = [{ p: [0, 0, 0], v: [0, 0, 0], a: [0, 0, 0] }, { p: [0, 0, 0], v: [0, 0, 0], a: [0, 0, 0] }];
    const rng = (s) => () => { s = (s + 0x6d2b79f5) | 0; let q = Math.imul(s ^ (s >>> 15), 1 | s); q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q; return ((q ^ (q >>> 14)) >>> 0) / 4294967296; };
    function coreAcc() {
      const d = [0, 1, 2].map((k) => core[0].p[k] - core[1].p[k]), r2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] + C2, f = 1 / (r2 * Math.sqrt(r2));
      for (let k = 0; k < 3; k++) { core[0].a[k] = -d[k] * f; core[1].a[k] = d[k] * f; }
    }
    function starAcc() {
      const a = core[0].p, b = core[1].p;
      for (let i = 0, j = 0; i < M; i++, j += 3) {
        let dx = X[j] - a[0], dy = X[j + 1] - a[1], dz = X[j + 2] - a[2], r2 = dx * dx + dy * dy + dz * dz + E2, f = 1 / (r2 * Math.sqrt(r2));
        let ax = -dx * f, ay = -dy * f, az = -dz * f;
        dx = X[j] - b[0]; dy = X[j + 1] - b[1]; dz = X[j + 2] - b[2]; r2 = dx * dx + dy * dy + dz * dz + E2; f = 1 / (r2 * Math.sqrt(r2));
        A[j] = ax - dx * f; A[j + 1] = ay - dy * f; A[j + 2] = az - dz * f;
      }
    }
    function setup() {
      const R = rng(seed++);
      /* the cores: start at pericentre and run the relative orbit back TB, so they meet TB into the pass */
      let x = 1, y = 0, vx = 0, vy = 2, h = -0.005;
      const ra = (x, y) => { const r2 = x * x + y * y + C2, r3 = r2 * Math.sqrt(r2); return [-2 * x / r3, -2 * y / r3]; };
      let [ax, ay] = ra(x, y);
      for (let s = 0; s < TB / 0.005; s++) { vx += ax * h / 2; vy += ay * h / 2; x += vx * h; y += vy * h; [ax, ay] = ra(x, y); vx += ax * h / 2; vy += ay * h / 2; }
      core[0].p = [x / 2, y / 2, 0]; core[0].v = [vx / 2, vy / 2, 0]; core[1].p = [-x / 2, -y / 2, 0]; core[1].v = [-vx / 2, -vy / 2, 0];
      /* the disks: tilted to the orbit and turning the same way as it (prograde), which gives the strongest tails */
      const tilt = [0.12 + 0.45 * R(), 0.75 + 0.55 * R()], node = [6.283 * R(), 6.283 * R()];
      for (let i = 0; i < M; i++) {
        const g = i < N ? 0 : 1, r = 0.1 + 0.62 * Math.sqrt(R()), th = 6.2832 * R(), vc = Math.sqrt((r * r) / Math.pow(r * r + E2, 1.5));
        let px = r * Math.cos(th), py = r * Math.sin(th), pz = 0, qx = -vc * Math.sin(th), qy = vc * Math.cos(th), qz = 0;
        const ci = Math.cos(tilt[g]), si = Math.sin(tilt[g]), cn = Math.cos(node[g]), sn = Math.sin(node[g]);
        [py, pz] = [py * ci, py * si]; [qy, qz] = [qy * ci, qy * si];
        [px, py] = [px * cn - py * sn, px * sn + py * cn]; [qx, qy] = [qx * cn - qy * sn, qx * sn + qy * cn];
        const j = 3 * i, C = core[g];
        X[j] = C.p[0] + px; X[j + 1] = C.p[1] + py; X[j + 2] = C.p[2] + pz; Vv[j] = C.v[0] + qx; Vv[j + 1] = C.v[1] + qy; Vv[j + 2] = C.v[2] + qz;
        K[i] = g * 2 + (r < 0.24 ? 1 : 0);
      }
      t = 0; coreAcc(); starAcc();
    }
    function step() {
      for (const C of core) for (let k = 0; k < 3; k++) C.v[k] += C.a[k] * DT / 2;
      for (let j = 0; j < 3 * M; j++) Vv[j] += A[j] * DT / 2;
      for (const C of core) for (let k = 0; k < 3; k++) C.p[k] += C.v[k] * DT;
      for (let j = 0; j < 3 * M; j++) X[j] += Vv[j] * DT;
      coreAcc(); starAcc();
      for (const C of core) for (let k = 0; k < 3; k++) C.v[k] += C.a[k] * DT / 2;
      for (let j = 0; j < 3 * M; j++) Vv[j] += A[j] * DT / 2;
      t += DT;
    }
    const COL = ['150,196,255', '214,232,255', '255,190,130', '255,232,205'];
    function draw(trail) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (trail) { c.globalCompositeOperation = 'destination-out'; c.fillStyle = `rgba(0,0,0,${fading ? 0.3 : 0.2})`; c.fillRect(0, 0, W, H); }
      else c.clearRect(0, 0, W, H);
      const wide = W > 700, sep = Math.hypot(core[0].p[0] - core[1].p[0], core[0].p[1] - core[1].p[1]);
      const cx = wide ? W * 0.71 : W * 0.5, cy = wide ? H * 0.52 : H - Math.min(150, H * 0.18), room = wide ? W * 0.46 : W * 0.95;
      const S = Math.min(wide ? H * 0.3 : H * 0.13, room / (sep + 2.8)), az = 0.5 + 0.012 * t, ca = Math.cos(az), sa = Math.sin(az), ct = Math.cos(1.02), st = Math.sin(1.02);
      const P = (x, y, z) => { const u = x * ca - y * sa, w = x * sa + y * ca; return [cx + u * S, cy - (w * ct - z * st) * S]; };
      c.globalCompositeOperation = 'lighter';
      const dim = fading ? Math.max(0, 1 - fading) : Math.min(1, t / 0.6);
      for (let k = 0; k < 4; k++) {
        c.fillStyle = `rgba(${COL[k]},${((k % 2 ? 0.55 : 0.42) * dim).toFixed(3)})`;
        const sz = k % 2 ? 1.7 : 1.4;
        for (let i = 0, j = 0; i < M; i++, j += 3) if (K[i] === k) { const [sx, sy] = P(X[j], X[j + 1], X[j + 2]); if (sx > -4 && sx < W + 4 && sy > -4 && sy < H + 4) c.fillRect(sx - sz / 2, sy - sz / 2, sz, sz); }
      }
      for (const C of core) {
        const [sx, sy] = P(C.p[0], C.p[1], C.p[2]), g = c.createRadialGradient(sx, sy, 0, sx, sy, 22);
        g.addColorStop(0, `rgba(255,246,228,${(0.9 * dim).toFixed(3)})`); g.addColorStop(0.25, `rgba(255,214,160,${(0.35 * dim).toFixed(3)})`); g.addColorStop(1, 'rgba(255,200,140,0)');
        c.fillStyle = g; c.beginPath(); c.arc(sx, sy, 22, 0, 6.2832); c.fill();
      }
      c.globalCompositeOperation = 'source-over';
    }
    const resize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); W = cv.clientWidth || 1; H = cv.clientHeight || 1; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); draw(false); };
    const loop = (now) => {
      if (!alive) return; raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (!visible || document.hidden) return;
      if (fading) { fading += dt / 1.2; if (fading >= 1) { fading = 0; setup(); } draw(true); return; }
      for (let n = Math.min(6, Math.round((dt * RATE) / DT)); n > 0; n--) step();
      if (t > TEND) fading = 0.001;
      draw(true);
    };
    setup();
    if (reduced) { while (t < TB + 6.2) step(); }
    resize(); addEventListener('resize', resize);
    let io = null; if ('IntersectionObserver' in window) { io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; last = 0; }); io.observe(cv); }
    if (!reduced) raf = requestAnimationFrame(loop);
    return { destroy() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); if (io) io.disconnect(); } };
  };
})();
