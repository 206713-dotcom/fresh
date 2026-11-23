/* Geodesic — generative stage banners and the home hero scene. */
(function () {
  const WL = window.WL, C = WL.C;
  WL.banners = {};
  const B = (id, draw, extra = {}) => (WL.banners[id] = { W: 960, H: 300, draw, ...extra });
  const R1 = WL.rng(11), STARS = Array.from({ length: 90 }, () => [R1() * 960, R1() * 300, R1()]);
  const stars = (s, t, a = 0.5) => STARS.forEach(([x, y, k]) => s.dot(x, y, { c: C.ink, r: 0.6 + k, a: a * (0.3 + 0.7 * Math.abs(Math.sin(t * (0.5 + k) + k * 9))) }));

  // KS3: bouncing projectiles with ticker-tape dots
  B('ks3', (s, t) => {
    s.line(0, 262, 960, 262, { c: C.dim, w: 2, a: 0.5 });
    [[0, 2.2, C.teal, 120, 90], [0.9, 1.7, C.blue, 150, 70], [1.6, 2.6, C.yellow, 95, 150], [0.4, 1.4, C.red, 175, 55]].forEach(([ph, T, col, vx, hgt]) => {
      const pos = (tt) => { const x = ((((tt + ph * 3) * vx) % 1180) + 1180) % 1180 - 110, tau = (((tt + ph) % T) + T) % T; return [x, 262 - (4 * hgt * tau * (T - tau)) / (T * T) - 9]; };
      const tr = []; for (let k = 40; k >= 0; k--) { const q = pos(t - k * 0.03); if (tr.length && Math.abs(q[0] - tr[tr.length - 1][0]) > 50) tr.length = 0; tr.push(q); }
      s.fade(tr, { c: col, w: 3, a: 0.7 }); const p = pos(t); s.dot(p[0], p[1], { c: col, r: 9 }); s.glow(p[0], p[1], 26, col, 0.25);
    });
    for (let x = 30; x < 960; x += 46) s.dot(x, 278, { c: C.dim, r: 2, a: 0.5 });
  });
  // GCSE: circuit board with flowing current
  const loops = [
    [[40, 50], [330, 50], [330, 230], [40, 230], [40, 50]],
    [[290, 90], [620, 90], [620, 260], [450, 260], [450, 160], [290, 160], [290, 90]],
    [[560, 40], [920, 40], [920, 210], [700, 210], [700, 130], [560, 130], [560, 40]]
  ];
  B('gcse', (s, t) => {
    loops.forEach((L, i) => {
      s.poly(L, { c: C.ink, w: 2.5, a: 0.28 });
      const len = WL.plen(L); for (let d = (t * (50 + 25 * i)) % 34; d < len; d += 34) { const q = WL.along(L, d); s.dot(q[0], q[1], { c: i === 1 ? C.orange : C.yellow, r: 3.2, a: 0.9 }); }
    });
    [[185, 50], [455, 90], [740, 40]].forEach(([x, y]) => s.rr(x - 30, y - 11, 60, 22, 4, { c: C.blue, w: 2.5, fill: C.bg, fa: 1 }));
    const b = 0.6 + 0.4 * Math.sin(t * 2.2); s.glow(920, 125, 70 * b, C.yellow, 0.35); s.circle(920, 125, 16, { c: C.yellow, w: 2.5, fill: C.bg, fa: 1 });
  });
  // A-Level: dipole field lines with travelling pulses, and an orbit
  const dipole = (() => {
    const q = [[300, 150, 1], [420, 150, -1]], lines = [];
    for (let i = 0; i < 16; i++) {
      const a = (2 * Math.PI * i) / 16 + 0.1; let x = 300 + 12 * Math.cos(a), y = 150 + 12 * Math.sin(a); const pts = [[x, y]];
      for (let k = 0; k < 500; k++) {
        let ex = 0, ey = 0; q.forEach(([qx, qy, s2]) => { const dx = x - qx, dy = y - qy, r3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; ex += (s2 * dx) / r3; ey += (s2 * dy) / r3; });
        const m = Math.hypot(ex, ey) || 1; x += (4 * ex) / m; y += (4 * ey) / m; pts.push([x, y]);
        if (Math.hypot(x - 420, y - 150) < 10 || x < -20 || x > 980 || y < -20 || y > 320) break;
      }
      lines.push(pts);
    }
    return lines;
  })();
  B('alevel', (s, t) => {
    dipole.forEach((L, i) => { s.poly(L, { c: C.blue, w: 1.6, a: 0.35 }); s.poly(L, { c: C.yellow, w: 2.4, a: 0.8, dash: [6, 60], dashOff: -t * 60 - i * 9 }); });
    s.circle(300, 150, 13, { c: C.red, fill: C.red, fa: 0.7, w: 2 }); s.circle(420, 150, 13, { c: C.blue, fill: C.blue, fa: 0.7, w: 2 });
    s.txt('+', 300, 151, { c: C.ink, size: 18, align: 'center' }); s.txt('−', 420, 151, { c: C.ink, size: 18, align: 'center' });
    s.circle(780, 150, 14, { c: C.orange, fill: C.yellow, fa: 0.9, w: 2 }); s.glow(780, 150, 60, C.yellow, 0.3);
    const pts = []; for (let k = 0; k <= 80; k++) { const a = (2 * Math.PI * k) / 80; pts.push([780 + 130 * Math.cos(a), 150 + 55 * Math.sin(a)]); } s.poly(pts, { c: C.dim, w: 1.2, a: 0.5, dash: [4, 6] });
    const a = t * 0.9; s.dot(780 + 130 * Math.cos(a), 150 + 55 * Math.sin(a), { c: C.teal, r: 7 });
  });
  // Y1: two-source interference
  B('y1', (s, t) => {
    const nx = 128, ny = 40, im = s.pix('y1', nx, ny), d = im.d, k = 0.1, w = 2.4;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = i * 7.5, y = j * 7.5, r1 = Math.hypot(x - 140, y - 105), r2 = Math.hypot(x - 140, y - 195);
      const v = (Math.cos(k * r1 - w * t) + Math.cos(k * r2 - w * t)) / 2, col = WL.rgb(WL.dmap(v * 0.7, '#1f5a74', '#c9a92e', '#0c0e12')), o = 4 * (j * nx + i);
      d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
    }
    s.blit(im, 0, 0, 960, 300); s.dot(140, 105, { c: C.ink, r: 5 }); s.dot(140, 195, { c: C.ink, r: 5 });
  }, { vignette: true });
  // Y2: phase-space orbits and a damped spiral
  B('y2', (s, t) => {
    const cx = 480, cy = 150;
    for (let E = 1; E <= 6; E++) { const pts = []; for (let k = 0; k <= 90; k++) { const a = (2 * Math.PI * k) / 90; pts.push([cx + 70 * E * Math.cos(a), cy + 20 * E * Math.sin(a)]); } s.poly(pts, { c: C.purple, w: 1.4, a: 0.45 }); const a = -t * 0.8 + E; s.dot(cx + 70 * E * Math.cos(a), cy + 20 * E * Math.sin(a), { c: WL.cmap(E / 6), r: 4.5 }); }
    const sp = []; for (let k = 0; k <= 300; k++) { const u = k / 30, r = 6.2 * Math.exp(-0.18 * u); sp.push([cx + 70 * r * Math.cos(-u * 1.3 - t), cy + 20 * r * Math.sin(-u * 1.3 - t)]); } s.fade(sp.reverse(), { c: C.pink, w: 2.2, a: 0.8 });
  });
  // Y3: a 2p-like probability cloud and atomic levels
  const cloud = (() => { const r = WL.rng(5), pts = []; while (pts.length < 1400) { const x = (r() - 0.5) * 8, y = (r() - 0.5) * 8, rr = Math.hypot(x, y), p = y * y * Math.exp(-rr) / 1.2; if (r() < p) pts.push([x, y, r()]); } return pts; })();
  B('y3', (s, t) => {
    cloud.forEach(([x, y, k]) => s.dot(330 + x * 32, 150 + y * 32, { c: y > 0 ? C.blue : C.red, r: 1.4, a: 0.35 + 0.35 * Math.sin(t * 1.5 + k * 20) ** 2 }));
    s.dot(330, 150, { c: C.ink, r: 4 });
    [1, 4, 9, 16].forEach((n2, i) => { const y = 260 - 200 * (1 - 1 / n2); s.line(620, y, 900, y, { c: C.dim, w: 2, a: 0.7 }); });
    const q = (t * 0.5) % 1, y3 = 260 - 200 * (1 - 1 / 9), y2 = 260 - 200 * (1 - 1 / 4);
    s.arrow(700, y3, 700, WL.lerp(y3, y2, WL.smooth(q)), { c: C.red, w: 2.5 });
    const wv = []; for (let k = 0; k <= 60; k++) wv.push([720 + k * 3, (y3 + y2) / 2 + 7 * Math.sin(k * 0.5 - t * 8)]); s.poly(wv, { c: C.red, w: 2, a: WL.smooth(q) });
  });
  // Y4: warped spacetime grid with bending light
  B('y4', (s, t) => {
    const cx = 480, cy = 150, warp = (x, y) => { const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy) + 1, f = 2600 / (r + 60); return [x - (dx / r) * f * 0.5, y - (dy / r) * f * 0.5]; };
    for (let x = -40; x <= 1000; x += 40) { const pts = []; for (let y = -20; y <= 320; y += 8) pts.push(warp(x, y)); s.poly(pts, { c: C.blue, w: 1, a: 0.28 }); }
    for (let y = -20; y <= 320; y += 40) { const pts = []; for (let x = -40; x <= 1000; x += 8) pts.push(warp(x, y)); s.poly(pts, { c: C.blue, w: 1, a: 0.28 }); }
    [60, 95, 130].forEach((b, i) => { [1, -1].forEach((sg) => { const pts = []; for (let x = 0; x <= 960; x += 8) { const u = (x - cx) / b, y = cy + sg * (b - (1800 / b) * (1 / Math.sqrt(1 + u * u) - 0.15)); pts.push([x, y]); } s.poly(pts, { c: C.yellow, w: 1.8, a: 0.5 }); const hx = ((t * 160 + i * 300) % 1100) - 70; s.dot(hx, pts[Math.max(0, Math.min(pts.length - 1, Math.round(hx / 8)))][1], { c: C.yellow, r: 3.5 }); }); });
    s.glow(cx, cy, 70, C.orange, 0.45); s.circle(cx, cy, 26, { fill: '#000', fa: 1, c: C.orange, w: 2.5 });
  });

  /* maths stage banners */
  B('mf', (s, t) => {
    const A = s.axes({ x0: 80, y0: 260, w: 800, h: 230, xr: [-4, 6], yr: [-1, 6], grid: true, xt: [-4, 6, 1], yt: [-1, 6, 1], xtl: false, ytl: false });
    A.draw(1); const m = Math.tan(0.6 * Math.sin(t * 0.7)), c = 2.2;
    A.fn((x) => m * x + c, -4, 6, { c: C.blue, w: 3 }); A.fn((x) => 0.25 * (x - 1) ** 2 + 0.3, -4, 6, { c: C.yellow, w: 3, a: 0.8 });
    s.line(A.X(1), A.Y(m + c), A.X(3), A.Y(m + c), { c: C.green, w: 2.5 }); s.line(A.X(3), A.Y(m + c), A.X(3), A.Y(3 * m + c), { c: C.red, w: 2.5 });
  });
  B('ma', (s, t) => {
    const A = s.axes({ x0: 80, y0: 260, w: 800, h: 220, xr: [0, 10], yr: [0, 5], xt: [0, 10, 1], yt: [0, 5, 1], xtl: false, ytl: false }), f = (x) => 2.4 + 1.6 * Math.sin(x * 0.7) + 0.08 * x;
    A.draw(1); const n = 6 + Math.round(18 * (0.5 + 0.5 * Math.sin(t * 0.6))), dx = 4 / n;
    for (let i = 0; i < n; i++) { const x = 1 + i * dx; s.rect(A.X(x), A.Y(f(x)), A.X(x + dx) - A.X(x), A.Y(0) - A.Y(f(x)), { c: C.blue, fill: C.blue, fa: 0.25, w: 1, a: 0.8 }); }
    A.fn(f, 0, 10, { c: C.yellow, w: 3 }); const x0 = 7, h = 0.2 + 1.8 * (0.5 + 0.5 * Math.cos(t * 0.8)), sl = (f(x0 + h) - f(x0)) / h;
    A.fn((x) => f(x0) + sl * (x - x0), 5.5, 9.8, { c: C.red, w: 2.5 }); s.dot(A.X(x0), A.Y(f(x0)), { c: C.ink, r: 5 }); s.dot(A.X(x0 + h), A.Y(f(x0 + h)), { c: C.ink, r: 5 });
  });
  B('m1', (s, t) => {
    const cx = 300, cy = 150, R = 100;
    for (let i = -6; i <= 6; i++) { s.line(cx + i * 50, 0, cx + i * 50, 300, { c: C.blueE, w: 1, a: 0.4 }); s.line(0, cy + i * 50, 960, cy + i * 50, { c: C.blueE, w: 1, a: 0.4 }); }
    s.circle(cx, cy, R, { c: C.blue, w: 2 }); const a = t * 0.8;
    s.arrow(cx, cy, cx + R * Math.cos(a), cy - R * Math.sin(a), { c: C.yellow, w: 3 });
    const n = 3 + Math.floor(((t * 0.5) % 1) * 12), pts = [[cx + R, cy]]; let zr = 1, zi = 0; const th = Math.PI * 0.8;
    for (let k = 0; k < n; k++) { const ar = 1, ai = th / n; const nr = zr * ar - zi * ai, ni = zr * ai + zi * ar; zr = nr; zi = ni; pts.push([cx + R * zr, cy - R * zi]); }
    s.poly(pts, { c: C.red, w: 2.5 }); pts.forEach((p) => s.dot(p[0], p[1], { c: C.red, r: 3 }));
    const M = [[1, 0.5 * Math.sin(t * 0.5)], [0.3 * Math.sin(t * 0.4), 1]];
    for (let i = -3; i <= 3; i++) { const P = (u, v) => [700 + 40 * (M[0][0] * u + M[0][1] * v), 150 - 40 * (M[1][0] * u + M[1][1] * v)]; const a1 = P(i, -3), b1 = P(i, 3), a2 = P(-3, i), b2 = P(3, i); s.line(a1[0], a1[1], b1[0], b1[1], { c: C.teal, w: 1.2, a: 0.6 }); s.line(a2[0], a2[1], b2[0], b2[1], { c: C.teal, w: 1.2, a: 0.6 }); }
  });
  B('m2', (s, t) => {
    const cx = 210, cy = 150, ns = [1, 3, 5, 7, 9]; let x = cx, y = cy;
    ns.forEach((n) => { const r = 80 / n, a = n * t * 1.2; s.circle(x, y, r, { c: C.blue, w: 1.2, a: 0.5 }); const nx = x + r * Math.cos(a), ny = y - r * Math.sin(a); s.line(x, y, nx, ny, { c: C.ink, w: 1.8 }); x = nx; y = ny; });
    s.line(x, y, 420, y, { c: C.yellow, w: 1, dash: [4, 5], a: 0.6 });
    const pts = []; for (let k = 0; k <= 260; k++) { const tt = t - k * 0.02; let yy = 0; ns.forEach((n) => (yy += (80 / n) * Math.sin(n * tt * 1.2))); pts.push([420 + k * 2, cy - yy]); }
    s.poly(pts, { c: C.yellow, w: 3 });
  });
  B('m3', (s, t) => {
    const P = [(x) => 1, (x) => x, (x) => 0.5 * (3 * x * x - 1), (x) => 0.5 * (5 * x ** 3 - 3 * x), (x) => (35 * x ** 4 - 30 * x * x + 3) / 8];
    const cols = [C.blue, C.teal, C.yellow, C.orange, C.red];
    P.forEach((f, i) => { const pts = []; for (let k = 0; k <= 100; k++) { const x = -1 + k / 50; pts.push([90 + (x + 1) * 220, 150 - 100 * f(x)]); } s.poly(pts, { c: cols[i], w: 2.5, a: 0.85, p: WL.clamp((t * 0.4 - i * 0.1) % 1.6) * 1.4 }); });
    const cx = 720, cy = 150; s.dot(cx, cy, { c: C.red, r: 6 }); s.glow(cx, cy, 30, C.red, 0.4);
    const R = 70 + 10 * Math.sin(t); s.circle(cx, cy, R, { c: C.yellow, w: 2, dash: [8, 6], dashOff: -t * 30 });
    s.arcArrow(cx, cy, R, -0.3, 0.3, { c: C.yellow, w: 2 });
  });
  B('m4', (s, t) => {
    s.cam({ th: t * 0.15, ph: 0.35, s: 110, cx: 480, cy: 150 }); s.sphere(1, { c: C.blue, n: 10, a: 0.25 });
    const tri = [[0, 0, 1], [1, 0, 0], [0, 1, 0]], arc = (a, b) => { const pts = []; for (let k = 0; k <= 30; k++) { const u = k / 30, v = a.map((x, i) => x * (1 - u) + b[i] * u), m = Math.hypot(...v); pts.push(v.map((x) => (x / m) * 1.001)); } return pts; };
    [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => s.poly3(arc(tri[i], tri[j]), { c: C.yellow, w: 3 }));
    const q = (t * 0.25) % 1, k = Math.floor(q * 3), u = (q * 3) % 1, a = tri[k], b = tri[(k + 1) % 3], v = a.map((x, i) => x * (1 - u) + b[i] * u), m = Math.hypot(...v), p = v.map((x) => x / m);
    s.dot3(p, { c: C.red, r: 6 });
  });

  B('mfm', (s, t) => {
    const cx = 250, cy = 150, sc = 40, a = 1 + 0.25 * Math.sin(t * 0.7), b = 0.6 * Math.sin(t * 0.5), c = 0.35 * Math.sin(t * 0.43 + 1), d = 1 + 0.2 * Math.cos(t * 0.6);
    const T = (x, y) => [cx + sc * (a * x + b * y), cy - sc * (c * x + d * y)];
    for (let k = -5; k <= 5; k++) { s.line(...T(k, -5), ...T(k, 5), { c: 'rgba(79,176,174,0.3)', w: 1 }); s.line(...T(-5, k), ...T(5, k), { c: 'rgba(79,176,174,0.3)', w: 1 }); }
    s.poly([T(0, 0), T(1, 0), T(1, 1), T(0, 1)], { c: C.yellow, fill: C.yellow, fa: 0.16, close: true, w: 1.5 });
    s.arrow(...T(0, 0), ...T(1, 0), { c: C.yellow, w: 3 }); s.arrow(...T(0, 0), ...T(0, 1), { c: C.pink, w: 3 });
    const px = 720, py = 150, R = 118, k = 3 + 1.5 * Math.sin(t * 0.2), pts = [];
    for (let i = 0; i <= 900; i++) { const th = (i / 900) * 4 * Math.PI, r = R * Math.cos(k * th); pts.push([px + r * Math.cos(th), py - r * Math.sin(th)]); }
    s.poly(pts, { c: '#4FB0AE', w: 2.2 });
    const th = t * 0.6, r = R * Math.cos(k * th); s.line(px, py, px + R * Math.cos(th), py - R * Math.sin(th), { c: 'rgba(236,236,236,0.25)', w: 1 }); s.dot(px + r * Math.cos(th), py - r * Math.sin(th), { c: C.yellow, r: 5 });
  });
  const BJ = []; for (let n = 0; n < 4; n++) { const row = []; for (let i = 0; i <= 260; i++) row.push(WL.sf ? WL.sf.besselJ(n, (i / 260) * 27) : 0); BJ.push(row); }
  B('msf', (s, t) => {
    const x0 = 24, w = 912, y0 = 168, cols = [C.yellow, C.teal, C.pink, C.blue];
    for (let i = 0; i <= 27; i += 3) s.line(x0 + (i / 27) * w, y0 - 120, x0 + (i / 27) * w, y0 + 120, { c: 'rgba(232,193,28,0.08)', w: 1 });
    s.line(x0, y0, x0 + w, y0, { c: 'rgba(236,236,236,0.18)', w: 1 });
    BJ.forEach((row, n) => {
      s.poly(row.map((v, i) => [x0 + (i / 260) * w, y0 - 118 * v]), { c: cols[n], w: 2.4 });
      const i = Math.floor(((t * 22 + n * 40) % 260)), v = row[i]; s.glow(x0 + (i / 260) * w, y0 - 118 * v, 16, cols[n], 0.45); s.dot(x0 + (i / 260) * w, y0 - 118 * v, { c: cols[n], r: 4.5 });
    });
  });

  /* home hero: a gravity well with an orbit (a geodesic) */
  const well = (r) => -0.95 / Math.sqrt(r * r + 0.22);
  WL.hero = {
    W: 960, H: 620, alt: 'A curved gravity well with a particle orbiting on it.',
    draw(s, t) {
      stars(s, t, 0.6);
      s.cam({ th: -0.5 + t * 0.06, ph: 0.62, s: 150, cx: 480, cy: 330, d: 9 });
      s.surfaceP((r, a) => [r * Math.cos(a), r * Math.sin(a), well(r), 1 - r / 3], 0.12, 3, 0, 2 * Math.PI, 26, 56, { stops: ['#10283a', '#1C758A', '#58C4DD', '#C7E9F1'], wire: 'rgba(199,233,241,0.16)', fa: 0.88 });
      const orb = (ph) => { const p = 1.25, e = 0.42, r = p / (1 + e * Math.cos(0.82 * ph)); return [r * Math.cos(ph), r * Math.sin(ph), well(r) + 0.02]; };
      const ph = t * 1.15, tr = []; for (let k = 120; k >= 0; k--) tr.push(s.P(...orb(ph - k * 0.045)));
      s.fade(tr, { c: C.yellow, w: 3.5 }); const q = s.P(...orb(ph)); s.glow(q[0], q[1], 34, C.yellow, 0.5); s.dot(q[0], q[1], { c: C.yellow, r: 7 });
      const c0 = s.P(0, 0, well(0.12)); s.glow(c0[0], c0[1], 60, C.orange, 0.35);
    }
  };
})();
