/* Twistor — a Manim-style animation engine for the browser (v2).
   Logical canvas is spec.W × spec.H (default 960×540).
   Features: LaTeX written with Manim's Write effect (MathJax → canvas paths), 3D camera with shaded
   surfaces, vector fields, flow particles, fading trails, braces, Circumscribe / Flash, chapter timeline,
   and off-screen snapshots for thumbnails. */
(function () {
  const WL = (window.WL = window.WL || {});
  const C = {
    bg: '#0c0e12', ink: '#ECECEC', dim: '#8A8F98', faint: 'rgba(236,236,236,0.07)',
    blue: '#58C4DD', blueA: '#C7E9F1', blueD: '#29ABCA', blueE: '#236B8E',
    teal: '#5CD0B3', tealE: '#49A88F', green: '#83C167', greenE: '#699C52',
    yellow: '#F4D345', yellowC: '#FFFF00', gold: '#F0AC5F', goldE: '#C78D46',
    red: '#FC6255', redE: '#CF5044', maroon: '#C55F73', purple: '#9A72AC', purpleA: '#CAA3E8',
    orange: '#FF862F', pink: '#D147BD', lightPink: '#DC75CD', grey: '#888888', greyB: '#BBBBBB', greyD: '#444444', white: '#FFFFFF'
  };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const smooth = (t) => { t = clamp(t); const a = sig(-5), b = sig(5); return (sig(10 * (t - 0.5)) - a) / (b - a); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const rate = {
    smooth, linear: (t) => clamp(t),
    thereAndBack: (t) => { t = clamp(t); return smooth(t < 0.5 ? 2 * t : 2 - 2 * t); },
    rushInto: (t) => 2 * smooth(clamp(t) / 2),
    rushFrom: (t) => 2 * smooth(clamp(t) / 2 + 0.5) - 1,
    doubleSmooth: (t) => { t = clamp(t); return t < 0.5 ? 0.5 * smooth(2 * t) : 0.5 * (1 + smooth(2 * t - 1)); }
  };
  const reduced = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  const SERIF = '"STIX Two Text", "Times New Roman", serif';
  const SANS = '"IBM Plex Sans", system-ui, sans-serif';

  /* ---------- colour ---------- */
  function rgb(c) {
    if (Array.isArray(c)) return c;
    if (c && c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.replace(/./g, (x) => x + x); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
    const m = String(c).match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
  }
  const css = (a, al) => (al == null ? `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})` : `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`);
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return css([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]); };
  const alphaC = (c, a) => css(rgb(c), a);
  const STOPS = ['#236B8E', '#58C4DD', '#83C167', '#F4D345', '#FC6255'];
  function cmap(t, stops = STOPS) { t = clamp(t) * (stops.length - 1); const i = Math.min(stops.length - 2, Math.floor(t)); return mix(stops[i], stops[i + 1], t - i); }
  // signed map: −1 → blue, 0 → background, +1 → yellow
  function dmap(v, neg = '#58C4DD', pos = '#F4D345', mid = '#0c0e12') { v = clamp(v, -1, 1); return v < 0 ? mix(mid, neg, -v) : mix(mid, pos, v); }

  /* ---------- small maths utilities ---------- */
  function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function gauss(r) { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
  function plen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function along(pts, d) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    d = ((d % L) + L) % L;
    for (let i = 1; i < pts.length; i++) { if (d <= seg[i - 1]) { const f = seg[i - 1] ? d / seg[i - 1] : 0; return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; } d -= seg[i - 1]; }
    return pts[pts.length - 1];
  }
  function resample(pts, n) { const L = plen(pts), out = []; for (let i = 0; i < n; i++) { const q = along(pts, (L * i) / (n - 1) - (i === n - 1 ? 1e-9 : 0)); out.push(q); } return out; }
  const morph = (a, b, t) => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
  function ticks(lo, hi, n = 5) {
    const raw = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    const st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
    return [Math.ceil(lo / st) * st, Math.floor(hi / st) * st, st];
  }
  // marching squares: g is row-major nx×ny, returns segments in grid coordinates
  function contour(g, nx, ny, lev) {
    const out = [];
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = g[j * nx + i], b = g[j * nx + i + 1], c = g[(j + 1) * nx + i + 1], d = g[(j + 1) * nx + i];
      let k = 0; if (a > lev) k |= 1; if (b > lev) k |= 2; if (c > lev) k |= 4; if (d > lev) k |= 8;
      if (k === 0 || k === 15) continue;
      const e = (p, q) => (lev - p) / (q - p || 1e-12);
      const T = [i + e(a, b), j], Rr = [i + 1, j + e(b, c)], B = [i + e(d, c), j + 1], L = [i, j + e(a, d)];
      const add = (p, q) => out.push([p[0], p[1], q[0], q[1]]);
      switch (k) {
        case 1: case 14: add(L, T); break;
        case 2: case 13: add(T, Rr); break;
        case 3: case 12: add(L, Rr); break;
        case 4: case 11: add(Rr, B); break;
        case 5: add(L, T); add(Rr, B); break;
        case 10: add(T, Rr); add(L, B); break;
        case 6: case 9: add(T, B); break;
        case 7: case 8: add(L, B); break;
      }
    }
    return out;
  }

  /* ---------- TeX → canvas paths (MathJax SVG output, fontCache 'none') ---------- */
  const TEX = new Map(); let texHost = null;
  const texOK = () => !!(window.__mjReady && window.MathJax && window.MathJax.tex2svg);
  const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
  function parseT(s) {
    let m = [1, 0, 0, 1, 0, 0]; const re = /(matrix|translate|scale|rotate)\s*\(([^)]*)\)/g; let r;
    while ((r = re.exec(s))) {
      const v = r[2].split(/[\s,]+/).filter(Boolean).map(Number); let t;
      if (r[1] === 'matrix') t = v;
      else if (r[1] === 'translate') t = [1, 0, 0, 1, v[0] || 0, v[1] || 0];
      else if (r[1] === 'scale') t = [v[0], 0, 0, v[1] == null ? v[0] : v[1], 0, 0];
      else { const a = ((v[0] || 0) * Math.PI) / 180, c = Math.cos(a), s2 = Math.sin(a); t = [c, s2, -s2, c, 0, 0]; if (v.length === 3) t = mul(mul([1, 0, 0, 1, v[1], v[2]], t), [1, 0, 0, 1, -v[1], -v[2]]); }
      m = mul(m, t);
    }
    return m;
  }
  function texBuild(src, disp) {
    const key = (disp ? 'D|' : 'I|') + src;
    let o = TEX.get(key); if (o) return o;
    if (!texOK()) return null;
    try {
      const node = MathJax.tex2svg(src, { display: disp });
      const svg = node.querySelector('svg'); if (!svg) throw new Error('no svg');
      if (!texHost) { texHost = document.createElement('div'); texHost.setAttribute('aria-hidden', 'true'); texHost.style.cssText = 'position:absolute;left:-10000px;top:0;width:10px;height:10px;overflow:hidden;visibility:hidden;pointer-events:none'; document.body.appendChild(texHost); }
      texHost.appendChild(svg);
      const vb = (svg.getAttribute('viewBox') || '0 0 1000 1000').split(/[\s,]+/).map(Number), items = [];
      const pathItem = (el, m, c) => { const d = el.getAttribute('d'); if (!d) return; let len = 600; try { len = el.getTotalLength() || 600; } catch (e) {} items.push({ k: 'p', p: new Path2D(d), m, len, c }); };
      const walk = (el, m, col) => {
        for (const ch of el.children) {
          const tag = ch.tagName.toLowerCase(); if (tag === 'defs' || tag === 'title' || tag === 'desc') continue;
          let mm = m, c = col;
          const f = ch.getAttribute('fill'); if (f && f !== 'currentColor' && f !== 'none') c = f;
          const tr = ch.getAttribute('transform'); if (tr) mm = mul(mm, parseT(tr));
          if (tag === 'g' || tag === 'a') walk(ch, mm, c);
          else if (tag === 'svg') {
            let m2 = mul(mm, [1, 0, 0, 1, parseFloat(ch.getAttribute('x')) || 0, parseFloat(ch.getAttribute('y')) || 0]);
            const v = ch.getAttribute('viewBox');
            if (v) { const q = v.split(/[\s,]+/).map(Number), w = parseFloat(ch.getAttribute('width')), h = parseFloat(ch.getAttribute('height')); if (w > 0 && h > 0 && q[2] > 0 && q[3] > 0) m2 = mul(m2, [w / q[2], 0, 0, h / q[3], 0, 0]); m2 = mul(m2, [1, 0, 0, 1, -q[0], -q[1]]); }
            walk(ch, m2, c);
          } else if (tag === 'path') pathItem(ch, mm, c);
          else if (tag === 'use') {
            const href = ch.getAttribute('href') || ch.getAttribute('xlink:href');
            const ref = href && (svg.querySelector(href) || document.querySelector(href));
            if (ref && ref.tagName.toLowerCase() === 'path') pathItem(ref, mul(mm, [1, 0, 0, 1, parseFloat(ch.getAttribute('x')) || 0, parseFloat(ch.getAttribute('y')) || 0]), c);
          } else if (tag === 'rect') {
            const x = +ch.getAttribute('x') || 0, y = +ch.getAttribute('y') || 0, w = +ch.getAttribute('width') || 0, h = +ch.getAttribute('height') || 0;
            const p = new Path2D(); p.rect(x, y, w, h); items.push({ k: 'p', p, m: mm, len: 2 * (w + h) + 1, c });
          } else if (tag === 'line') {
            const p = new Path2D(); p.moveTo(+ch.getAttribute('x1') || 0, +ch.getAttribute('y1') || 0); p.lineTo(+ch.getAttribute('x2') || 0, +ch.getAttribute('y2') || 0);
            items.push({ k: 'l', p, m: mm, len: 200, c, sw: parseFloat(ch.getAttribute('stroke-width')) || 40 });
          } else if (tag === 'text') {
            items.push({ k: 't', s: ch.textContent, m: mm, fs: parseFloat(ch.getAttribute('font-size')) || 1000, ff: ch.getAttribute('font-family') || 'serif', fw: ch.getAttribute('font-weight') || '', fst: ch.getAttribute('font-style') || '', c });
          }
        }
      };
      walk(svg, [1, 0, 0, 1, 0, 0], null);
      texHost.removeChild(svg);
      o = { vb, items };
    } catch (e) { o = { bad: true }; }
    TEX.set(key, o); if (TEX.size > 700) TEX.delete(TEX.keys().next().value);
    return o;
  }

  /* ---------- renderer: all drawing helpers ---------- */
  class R {
    constructor(ctx, spec, o = {}) {
      this.ctx = ctx; this.spec = spec || {}; this.W = this.spec.W || 960; this.H = this.spec.H || 540; this.C = C;
      this.p = {}; (this.spec.params || []).forEach((q) => (this.p[q.id] = q.value));
      this.t = 0; this.dt = 0; this._a = 1; this.state = {}; this.cam3 = null; this.snap = !!o.snap;
    }
    frame(dt) {
      const c = this.ctx, cv = c.canvas;
      c.setTransform(cv.width / this.W, 0, 0, cv.height / this.H, 0, 0);
      c.globalAlpha = 1; c.setLineDash([]); c.lineDashOffset = 0;
      this.dt = dt || 0; this._a = 1; this.bg();
      try {
        this.spec.draw(this, this.t, this.dt);
        if (this.spec.texs) this.spec.texs.forEach((q) => this.texAt(q[1], q[2], q[3], q[0], { size: q[4] || 30, c: q[5] || C.ink, t1: q[6], align: q[7] }));
      } catch (e) { if (!this._err) { console.error(e); this._err = 1; } }
      c.globalAlpha = 1; c.setLineDash([]); c.lineDashOffset = 0;
    }
    bg() {
      const c = this.ctx, W = this.W, H = this.H;
      c.fillStyle = this.spec.bg || C.bg; c.fillRect(0, 0, W, H);
      if (this.spec.vignette === false) return;
      if (!this._vg) { const g = c.createRadialGradient(W * 0.5, H * 0.42, Math.min(W, H) * 0.08, W * 0.5, H * 0.5, Math.max(W, H) * 0.75); g.addColorStop(0, 'rgba(60,100,130,0.12)'); g.addColorStop(0.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.42)'); this._vg = g; }
      c.fillStyle = this._vg; c.fillRect(0, 0, W, H);
    }
    in(t, a, d = 1) { return smooth((t - a) / d); }
    out(t, a, d = 1) { return 1 - smooth((t - a) / d); }
    win(t, a, b, d = 0.6) { return Math.min(smooth((t - a) / d), 1 - smooth((t - b) / d)); }
    alpha(a, fn) { const p = this._a; this._a *= clamp(a); if (this._a > 0.002) fn(); this._a = p; }
    pulse(t, a, d = 0.8, k = 0.25) { const q = (t - a) / d; return q <= 0 || q >= 1 ? 1 : 1 + k * rate.thereAndBack(q); }
    _st(o) {
      const c = this.ctx;
      c.strokeStyle = o.c || C.ink; c.fillStyle = o.fill || o.c || C.ink;
      c.lineWidth = o.w == null ? 3 : o.w; c.lineCap = o.cap || 'round'; c.lineJoin = 'round';
      c.globalAlpha = clamp((o.a == null ? 1 : o.a) * this._a); c.setLineDash(o.dash || []); c.lineDashOffset = o.dashOff || 0;
    }
    grid(o = {}) {
      const c = this.ctx, st = o.step || 60; this._st({ c: o.c || 'rgba(88,196,221,0.10)', w: 1 });
      c.beginPath();
      for (let x = (o.x0 || 0) % st; x <= this.W; x += st) { c.moveTo(x, 0); c.lineTo(x, this.H); }
      for (let y = (o.y0 || 0) % st; y <= this.H; y += st) { c.moveTo(0, y); c.lineTo(this.W, y); }
      c.stroke();
    }
    line(x1, y1, x2, y2, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0) return; this._st(o);
      const c = this.ctx; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lerp(x1, x2, p), lerp(y1, y2, p)); c.stroke();
    }
    poly(pts, o = {}) {
      if (!pts || pts.length < 2) return;
      const p = o.p == null ? 1 : o.p; if (p <= 0) return;
      const c = this.ctx;
      if (o.fill && p >= 1) {
        this._st({ ...o, a: (o.a == null ? 1 : o.a) * (o.fa == null ? 0.35 : o.fa) }); c.fillStyle = o.fill;
        c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill();
      }
      if (o.stroke === false) return;
      this._st(o); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      if (p >= 1) { for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); if (o.close) c.closePath(); c.stroke(); return; }
      let L = 0; const seg = [];
      for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
      let rem = L * p;
      for (let i = 1; i < pts.length; i++) {
        const d = seg[i - 1];
        if (rem >= d) { c.lineTo(pts[i][0], pts[i][1]); rem -= d; }
        else { const f = d ? rem / d : 0; c.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); break; }
      }
      c.stroke();
    }
    fade(pts, o = {}) {
      const n = pts.length; if (n < 2) return; const c = this.ctx;
      c.lineCap = 'round'; c.lineJoin = 'round'; c.setLineDash([]); c.lineWidth = o.w || 3;
      const col = rgb(o.c || C.yellow), a0 = (o.a == null ? 1 : o.a) * this._a, pw = o.pow || 1.3, step = Math.max(1, Math.floor(n / 70));
      c.globalAlpha = 1;
      for (let i = 0; i < n - 1; i += step) {
        const j = Math.min(n - 1, i + step), f = Math.pow(j / (n - 1), pw);
        c.strokeStyle = css(col, clamp(f * a0)); c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); for (let k = i + 1; k <= j; k++) c.lineTo(pts[k][0], pts[k][1]); c.stroke();
      }
    }
    gpoly(pts, colFn, o = {}) {
      const n = pts.length; if (n < 2) return; const c = this.ctx; this._st(o);
      for (let i = 0; i < n - 1; i++) { c.strokeStyle = colFn(i / (n - 2 || 1)); c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.stroke(); }
    }
    arrow(x1, y1, x2, y2, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0) return;
      const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), L = Math.hypot(ex - x1, ey - y1); if (L < 0.5) return;
      const hs = Math.min(o.head || 14, L * 0.45), ux = (ex - x1) / L, uy = (ey - y1) / L;
      this._st(o); const c = this.ctx;
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(ex - ux * hs * 0.75, ey - uy * hs * 0.75); c.stroke();
      c.setLineDash([]); c.fillStyle = o.c || C.ink;
      const tri = (tx, ty, dx, dy) => { c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx - dx * hs - dy * hs * 0.48, ty - dy * hs + dx * hs * 0.48); c.lineTo(tx - dx * hs + dy * hs * 0.48, ty - dy * hs - dx * hs * 0.48); c.closePath(); c.fill(); };
      tri(ex, ey, ux, uy); if (o.both) tri(x1, y1, -ux, -uy);
    }
    arcArrow(cx, cy, r, a0, a1, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0) return;
      const ae = a0 + (a1 - a0) * p; this._st(o); const c = this.ctx;
      c.beginPath(); c.arc(cx, cy, r, a0, ae, a1 < a0); c.stroke();
      const dir = a1 > a0 ? 1 : -1, tx = -Math.sin(ae) * dir, ty = Math.cos(ae) * dir;
      const ex = cx + r * Math.cos(ae), ey = cy + r * Math.sin(ae), hs = o.head || 12;
      c.setLineDash([]); c.fillStyle = o.c || C.ink; c.beginPath(); c.moveTo(ex + tx * hs * 0.6, ey + ty * hs * 0.6);
      c.lineTo(ex - tx * hs * 0.6 - ty * hs * 0.5, ey - ty * hs * 0.6 + tx * hs * 0.5);
      c.lineTo(ex - tx * hs * 0.6 + ty * hs * 0.5, ey - ty * hs * 0.6 - tx * hs * 0.5); c.closePath(); c.fill();
    }
    circle(x, y, r, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0 || !(r > 0)) return; const c = this.ctx;
      if (o.fill) { this._st({ ...o, a: (o.a == null ? 1 : o.a) * (o.fa == null ? 1 : o.fa) }); c.fillStyle = o.fill; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * p); if (p >= 1) c.closePath(); else c.lineTo(x, y); c.fill(); }
      if (o.stroke === false) return; this._st(o); c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * p); c.stroke();
    }
    dot(x, y, o = {}) { const c = this.ctx; this._st(o); c.fillStyle = o.c || C.ink; c.beginPath(); c.arc(x, y, o.r || 6, 0, 2 * Math.PI); c.fill(); if (o.ring) { c.strokeStyle = o.ring; c.lineWidth = 2; c.stroke(); } }
    glow(x, y, r, col = C.yellow, a = 0.45) {
      if (!(r > 0)) return; const c = this.ctx, g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, alphaC(col, clamp(a * this._a))); g.addColorStop(1, alphaC(col, 0));
      c.globalAlpha = 1; c.setLineDash([]); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 2 * Math.PI); c.fill();
    }
    rect(x, y, w, h, o = {}) {
      const c = this.ctx;
      if (o.fill) { this._st({ ...o, a: (o.a == null ? 1 : o.a) * (o.fa == null ? 1 : o.fa) }); c.fillStyle = o.fill; c.fillRect(x, y, w, h); }
      if (o.stroke !== false) { this._st(o); c.strokeRect(x, y, w, h); }
    }
    rr(x, y, w, h, r, o = {}) {
      const c = this.ctx, path = () => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
      if (o.fill) { this._st({ ...o, a: (o.a == null ? 1 : o.a) * (o.fa == null ? 1 : o.fa) }); c.fillStyle = o.fill; path(); c.fill(); }
      if (o.stroke !== false) { this._st(o); path(); c.stroke(); }
    }
    spring(x1, y1, x2, y2, o = {}) {
      const n = o.coils || 10, amp = o.amp || 10, L = Math.hypot(x2 - x1, y2 - y1); if (L < 1) return;
      const ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux, lead = Math.min(14, L * 0.12);
      const pts = [[x1, y1], [x1 + ux * lead, y1 + uy * lead]];
      for (let i = 0; i < 2 * n; i++) { const f = (i + 0.5) / (2 * n), d = lead + f * (L - 2 * lead), s = i % 2 ? -1 : 1; pts.push([x1 + ux * d + nx * amp * s, y1 + uy * d + ny * amp * s]); }
      pts.push([x2 - ux * lead, y2 - uy * lead], [x2, y2]);
      this.poly(pts, { w: 2, ...o });
    }
    txt(str, x, y, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0) return; const c = this.ctx, size = o.size || 22;
      c.font = `${o.italic ? 'italic ' : ''}${o.bold ? '600 ' : ''}${size}px ${o.sans ? SANS : SERIF}`;
      c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'middle';
      c.globalAlpha = clamp((o.a == null ? 1 : o.a) * this._a); c.fillStyle = o.c || C.ink;
      const s = String(str), n = Math.ceil(s.length * p); c.fillText(p >= 1 ? s : s.slice(0, n), x, y);
    }
    // small math typesetter for labels: _x, _{..}, ^x, ^{..}. Letters italic.
    math(str, x, y, o = {}) {
      const p = o.p == null ? 1 : o.p; if (p <= 0) return; const c = this.ctx, size = o.size || 24, toks = []; let i = 0;
      const grab = () => { if (str[i] === '{') { let d = 1, j = i + 1; while (j < str.length && d) { if (str[j] === '{') d++; else if (str[j] === '}') d--; j++; } const s = str.slice(i + 1, j - 1); i = j; return s; } return str[i++]; };
      while (i < str.length) { const ch = str[i]; if (ch === '_' || ch === '^') { i++; toks.push({ s: grab(), k: ch }); } else { toks.push({ s: ch, k: '' }); i++; } }
      const fontFor = (ch, sz) => `${/[A-Za-z]/.test(ch) && !o.upright ? 'italic ' : ''}${sz}px ${SERIF}`;
      const meas = (t) => { const sz = t.k ? size * 0.68 : size; let w = 0; for (const ch of t.s) { c.font = fontFor(ch, sz); w += c.measureText(ch).width; } return w + (t.k ? 1 : 0); };
      let total = 0; toks.forEach((t) => (total += meas(t)));
      let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
      const n = Math.ceil(toks.length * p);
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.globalAlpha = clamp((o.a == null ? 1 : o.a) * this._a); c.fillStyle = o.c || C.ink;
      toks.slice(0, n).forEach((t) => {
        const sz = t.k ? size * 0.68 : size, dy = t.k === '_' ? size * 0.28 : t.k === '^' ? -size * 0.36 : 0;
        for (const ch of t.s) { c.font = fontFor(ch, sz); c.fillText(ch, cx, y + dy); cx += c.measureText(ch).width; }
        if (t.k) cx += 1;
      });
    }
    /* LaTeX, written with Manim's DrawBorderThenFill. Returns size info or null while MathJax loads. */
    tex(src, x, y, o = {}) {
      const T = texBuild(src, !o.inline);
      if (!T || T.bad) { if (o.alt) this.txt(o.alt, x, y, { c: o.c, size: (o.size || 34) * 0.7, align: o.align || 'center', a: o.a, p: o.p }); return null; }
      const p = o.p == null ? 1 : o.p, A = clamp((o.a == null ? 1 : o.a) * this._a);
      const size = o.size || 34, k = size / 1000, [vx, vy, vw, vh] = T.vb;
      const info = { w: vw * k * (o.scale || 1), h: vh * k * (o.scale || 1) };
      if (p <= 0 || A <= 0.002) return info;
      const ax = o.align === 'left' ? 0 : o.align === 'right' ? vw : vw / 2, ay = vh / 2;
      const c = this.ctx; c.save(); c.setLineDash([]);
      c.translate(x, y); if (o.scale) c.scale(o.scale, o.scale); if (o.rot) c.rotate(o.rot); c.scale(k, k); c.translate(-vx - ax, -vy - ay);
      const n = T.items.length, Wn = clamp(4 / Math.max(1, n), 0.22, 1);
      for (let i = 0; i < n; i++) {
        const it = T.items[i]; let q = 1;
        if (p < 1) { q = clamp((p - ((1 - Wn) * i) / Math.max(1, n - 1)) / Wn); if (q <= 0) continue; }
        const col = (o.mono ? null : it.c) || o.c || C.ink;
        c.save(); c.transform(it.m[0], it.m[1], it.m[2], it.m[3], it.m[4], it.m[5]);
        if (it.k === 't') { c.globalAlpha = A * q; c.fillStyle = col; c.font = `${it.fst} ${it.fw} ${it.fs}px ${it.ff}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(it.s, 0, 0); }
        else if (it.k === 'l') { c.globalAlpha = A * q; c.strokeStyle = col; c.lineWidth = it.sw; c.stroke(it.p); }
        else {
          const fa = q >= 1 ? 1 : clamp((q - 0.45) / 0.55);
          if (fa > 0) { c.globalAlpha = A * fa; c.fillStyle = col; c.fill(it.p); }
          if (q < 1) {
            const sm = Math.sqrt(Math.abs(it.m[0] * it.m[3] - it.m[1] * it.m[2])) || 1;
            c.globalAlpha = A * (1 - fa * 0.85); c.strokeStyle = col; c.lineWidth = 1.7 / (k * sm * (o.scale || 1));
            c.setLineDash([it.len * clamp(q / 0.6), it.len * 2]); c.stroke(it.p); c.setLineDash([]);
          }
        }
        c.restore();
      }
      c.restore(); return info;
    }
    texAt(src, x, y, t0, o = {}) {
      const d = o.dur || Math.min(2, 0.6 + src.length * 0.018);
      let a = o.a == null ? 1 : o.a; if (o.t1 != null) a *= 1 - smooth((this.t - o.t1) / 0.5);
      return this.tex(src, x, y, { ...o, a, p: (this.t - t0) / d });
    }
    texSize(src, size = 34, inline) { const T = texBuild(src, !inline); if (!T || T.bad) return null; return { w: T.vb[2] * size / 1000, h: T.vb[3] * size / 1000 }; }
    // Manim's Brace between two points; side = +1 puts it to the left of the direction (x1,y1)→(x2,y2)
    brace(x1, y1, x2, y2, o = {}) {
      const L = Math.hypot(x2 - x1, y2 - y1); if (L < 4) return; const side = o.side || 1, h = o.h || 12, ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = uy * side, ny = -ux * side;
      const P = (u, v) => [x1 + ux * u + nx * v, y1 + uy * u + ny * v], e = Math.min(10, L * 0.12), c = this.ctx;
      this._st({ w: 2.4, ...o }); c.beginPath();
      let q = P(0, 0); c.moveTo(q[0], q[1]);
      const qc = (a, b) => { const A = P(...a), B = P(...b); c.quadraticCurveTo(A[0], A[1], B[0], B[1]); };
      qc([0, h / 2], [e, h / 2]); q = P(L / 2 - e, h / 2); c.lineTo(q[0], q[1]); qc([L / 2, h / 2], [L / 2, h]); qc([L / 2, h / 2], [L / 2 + e, h / 2]);
      q = P(L - e, h / 2); c.lineTo(q[0], q[1]); qc([L, h / 2], [L, 0]); c.stroke();
      const lp = P(L / 2, h + (o.gap || 20));
      if (o.tex) this.tex(o.tex, lp[0], lp[1], { size: o.size || 26, c: o.lc || o.c, a: o.a, p: o.lp });
      else if (o.label) this.txt(o.label, lp[0], lp[1], { size: o.size || 18, c: o.lc || o.c, align: 'center', a: o.a });
      return lp;
    }
    // angle arc in maths convention (anticlockwise from +x, y up)
    angle(cx, cy, r, a0, a1, o = {}) {
      const n = 24, pts = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + r * Math.cos(a), cy - r * Math.sin(a)]); }
      this.poly(pts, { w: 2, ...o });
      if (o.tex || o.label) { const am = (a0 + a1) / 2, rr = r + (o.gap || 16); if (o.tex) this.tex(o.tex, cx + rr * Math.cos(am), cy - rr * Math.sin(am), { size: o.size || 22, c: o.lc || o.c, a: o.a }); else this.txt(o.label, cx + rr * Math.cos(am), cy - rr * Math.sin(am), { size: o.size || 17, c: o.lc || o.c, align: 'center', a: o.a }); }
    }
    right(x, y, a, s = 12, o = {}) { const u = [Math.cos(a), -Math.sin(a)], v = [Math.cos(a + Math.PI / 2), -Math.sin(a + Math.PI / 2)]; this.poly([[x + u[0] * s, y + u[1] * s], [x + u[0] * s + v[0] * s, y + u[1] * s + v[1] * s], [x + v[0] * s, y + v[1] * s]], { w: 1.6, ...o }); }
    // Manim's Circumscribe: a rectangle that draws round the target then un-draws
    circum(x, y, w, h, q, o = {}) {
      if (q <= 0 || q >= 1) return; const pad = o.pad || 8, X = x - pad, Y = y - pad, Wd = w + 2 * pad, Hd = h + 2 * pad, per = 2 * (Wd + Hd);
      const a = per * clamp(2 * q - 1) , b = per * clamp(2 * q), pts = [[X, Y], [X + Wd, Y], [X + Wd, Y + Hd], [X, Y + Hd], [X, Y]];
      const seg = []; for (let s = a; s <= b; s += 6) seg.push(along(pts, s)); seg.push(along(pts, b));
      this.poly(seg, { c: o.c || C.yellow, w: o.w || 3 });
    }
    // Manim's Flash: short lines radiating out
    flash(x, y, q, o = {}) {
      if (q <= 0 || q >= 1) return; const n = o.n || 10, r0 = o.r || 14, R2 = o.R || 34;
      const a = r0 + R2 * clamp(2 * q - 1), b = r0 + R2 * clamp(2 * q);
      for (let i = 0; i < n; i++) { const t = (2 * Math.PI * i) / n; this.line(x + a * Math.cos(t), y + a * Math.sin(t), x + b * Math.cos(t), y + b * Math.sin(t), { c: o.c || C.yellow, w: o.w || 3 }); }
    }
    numberLine(x0, y, w, lo, hi, step, o = {}) {
      const X = (v) => x0 + ((v - lo) / (hi - lo)) * w; this.arrow(x0 - 8, y, x0 + w + 16, y, { c: o.c || C.dim, w: 2, head: 10, both: true, a: o.a });
      for (let v = lo; v <= hi + 1e-9; v += step) { this.line(X(v), y - 6, X(v), y + 6, { c: o.c || C.dim, w: 1.5, a: o.a }); if (o.labels !== false) this.txt(fmtn(v), X(v), y + 20, { c: o.c || C.dim, size: 14, align: 'center', sans: true, a: o.a }); }
      return X;
    }
    axes(o) {
      const A = { ...o };
      A.X = (x) => o.x0 + ((x - o.xr[0]) / (o.xr[1] - o.xr[0])) * o.w;
      A.Y = (y) => o.y0 - ((y - o.yr[0]) / (o.yr[1] - o.yr[0])) * o.h;
      A.draw = (p = 1, d = {}) => {
        if (p <= 0) return; const col = d.c || C.dim;
        const yAt = A.Y(clamp(0, Math.min(o.yr[0], o.yr[1]), Math.max(o.yr[0], o.yr[1]))), xAt = A.X(clamp(0, o.xr[0], o.xr[1]));
        if (o.grid) this.alpha(p, () => {
          const gc = o.gc || 'rgba(88,196,221,0.14)';
          if (o.xt) for (let v = o.xt[0]; v <= o.xt[1] + 1e-9; v += o.xt[2]) this.line(A.X(v), o.y0, A.X(v), o.y0 - o.h, { c: gc, w: 1 });
          if (o.yt) for (let v = o.yt[0]; v <= o.yt[1] + 1e-9; v += o.yt[2]) this.line(o.x0, A.Y(v), o.x0 + o.w, A.Y(v), { c: gc, w: 1 });
        });
        this.arrow(o.x0, yAt, o.x0 + o.w + 14, yAt, { c: col, w: 2, p, head: 10 });
        this.arrow(xAt, o.y0, xAt, o.y0 - o.h - 14, { c: col, w: 2, p, head: 10 });
        this.alpha(clamp(p * 2 - 1), () => {
          if (o.xt) for (let v = o.xt[0]; v <= o.xt[1] + 1e-9; v += o.xt[2]) { const X = A.X(v); this.line(X, yAt - 5, X, yAt + 5, { c: col, w: 1.5 }); if (o.xtl !== false) this.txt(o.xfmt ? o.xfmt(v) : fmtn(v), X, yAt + 18, { c: col, size: 14, align: 'center', sans: true }); }
          if (o.yt) for (let v = o.yt[0]; v <= o.yt[1] + 1e-9; v += o.yt[2]) { const Y = A.Y(v); this.line(xAt - 5, Y, xAt + 5, Y, { c: col, w: 1.5 }); if (o.ytl !== false) this.txt(o.yfmt ? o.yfmt(v) : fmtn(v), xAt - 10, Y, { c: col, size: 14, align: 'right', sans: true }); }
          if (o.xl) { if (o.xtex) this.tex(o.xl, o.x0 + o.w + 30, yAt + (o.xlDy || 0), { size: 24, c: o.lc || C.ink }); else this.math(o.xl, o.x0 + o.w + 20, yAt + (o.xlDy || 0), { c: o.lc || C.ink, size: 20 }); }
          if (o.yl) { if (o.ytex) this.tex(o.yl, xAt, o.y0 - o.h - 30, { size: 24, c: o.lc || C.ink }); else this.math(o.yl, xAt - 6, o.y0 - o.h - 28, { c: o.lc || C.ink, size: 20, align: 'center' }); }
        });
      };
      A.fn = (f, a, b, d = {}) => {
        const n = d.n || 200, pts = [], lo = Math.min(o.yr[0], o.yr[1]) - (o.h ? (o.yr[1] - o.yr[0]) * 2 : 1e3), hi = Math.max(o.yr[0], o.yr[1]) + (o.yr[1] - o.yr[0]) * 2;
        for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n, y = f(x); if (isFinite(y)) pts.push([A.X(x), A.Y(clamp(y, lo, hi))]); }
        this.poly(pts, d); return pts;
      };
      A.pt = (x, y) => [A.X(x), A.Y(y)];
      return A;
    }
    /* ---------- 3D ---------- */
    cam(o = {}) {
      const c = { th: o.th || 0, ph: o.ph == null ? 0.4 : o.ph, d: o.d || 0, s: o.s || 100, cx: o.cx == null ? this.W / 2 : o.cx, cy: o.cy == null ? this.H / 2 : o.cy };
      c.ct = Math.cos(c.th); c.st = Math.sin(c.th); c.cp = Math.cos(c.ph); c.sp = Math.sin(c.ph); this.cam3 = c; return c;
    }
    P(x, y, z) {
      const c = this.cam3 || this.cam(); const x1 = x * c.ct - y * c.st, y1 = x * c.st + y * c.ct;
      const z2 = y1 * c.sp + z * c.cp, dep = y1 * c.cp - z * c.sp, f = c.d ? c.d / (c.d + dep) : 1;
      return [c.cx + c.s * x1 * f, c.cy - c.s * z2 * f, dep];
    }
    line3(a, b, o) { const p = this.P(a[0], a[1], a[2]), q = this.P(b[0], b[1], b[2]); this.line(p[0], p[1], q[0], q[1], o); }
    arrow3(a, b, o) { const p = this.P(a[0], a[1], a[2]), q = this.P(b[0], b[1], b[2]); this.arrow(p[0], p[1], q[0], q[1], o); }
    poly3(pts, o) { this.poly(pts.map((v) => this.P(v[0], v[1], v[2])), o); }
    dot3(v, o) { const p = this.P(v[0], v[1], v[2]); this.dot(p[0], p[1], o); return p; }
    axes3(L = 1.4, o = {}) {
      const col = o.c || C.greyB, labs = o.labels || ['x', 'y', 'z'];
      [[L, 0, 0], [0, L, 0], [0, 0, L]].forEach((v, i) => { this.arrow3([0, 0, 0], v, { c: col, w: 2, head: 10, a: o.a }); const q = this.P(v[0] * 1.12, v[1] * 1.12, v[2] * 1.12); if (labs[i]) { if (o.tex) this.tex(labs[i], q[0], q[1], { size: 24, c: col, a: o.a }); else this.math(labs[i], q[0], q[1], { size: 20, c: col, align: 'center', a: o.a }); } });
    }
    surfaceP(fn, u0, u1, v0, v1, nu, nv, o = {}) {
      const pts = []; let zmin = Infinity, zmax = -Infinity;
      for (let i = 0; i <= nu; i++) { const row = []; for (let j = 0; j <= nv; j++) { const u = u0 + ((u1 - u0) * i) / nu, v = v0 + ((v1 - v0) * j) / nv, w = fn(u, v), pr = this.P(w[0], w[1], w[2]); row.push([w[0], w[1], w[2], pr[0], pr[1], pr[2], w[3]]); if (w[2] < zmin) zmin = w[2]; if (w[2] > zmax) zmax = w[2]; } pts.push(row); }
      const quads = [], Lt = o.light || [-0.42, -0.55, 0.72];
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const a = pts[i][j], b = pts[i + 1][j], c2 = pts[i + 1][j + 1], d = pts[i][j + 1];
        const ux = c2[0] - a[0], uy = c2[1] - a[1], uz = c2[2] - a[2], wx = d[0] - b[0], wy = d[1] - b[1], wz = d[2] - b[2];
        const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx, nn = Math.hypot(nx, ny, nz) || 1;
        const sh = 0.38 + 0.62 * Math.abs((nx * Lt[0] + ny * Lt[1] + nz * Lt[2]) / nn);
        const val = a[6] != null ? (a[6] + b[6] + c2[6] + d[6]) / 4 : ((a[2] + b[2] + c2[2] + d[2]) / 4 - zmin) / (zmax - zmin || 1);
        quads.push([(a[5] + b[5] + c2[5] + d[5]) / 4, a, b, c2, d, sh, val]);
      }
      quads.sort((p, q) => q[0] - p[0]);
      const c = this.ctx, fa = clamp((o.fa == null ? 0.92 : o.fa) * this._a); c.setLineDash([]); c.globalAlpha = 1;
      for (const q of quads) {
        const base = rgb(o.colour ? o.colour(q[6]) : cmap(q[6], o.stops)), sh = o.flat ? 1 : q[5];
        c.fillStyle = css([base[0] * sh, base[1] * sh, base[2] * sh], fa);
        c.beginPath(); c.moveTo(q[1][3], q[1][4]); c.lineTo(q[2][3], q[2][4]); c.lineTo(q[3][3], q[3][4]); c.lineTo(q[4][3], q[4][4]); c.closePath(); c.fill();
        if (o.wire) { c.strokeStyle = o.wire; c.lineWidth = o.ww || 0.8; c.stroke(); } else if (fa > 0.85) { c.strokeStyle = c.fillStyle; c.lineWidth = 0.7; c.stroke(); }
      }
      return pts;
    }
    surface(f, x0, x1, y0, y1, n, o = {}) { return this.surfaceP((u, v) => [u, v, f(u, v)], x0, x1, y0, y1, n, o.ny || n, o); }
    sphere(r = 1, o = {}) {
      const col = o.c || C.blue, n = o.n || 12, a = o.a == null ? 0.35 : o.a;
      for (let i = 1; i < n; i++) { const th = (Math.PI * i) / n, pts = []; for (let k = 0; k <= 48; k++) { const ph = (2 * Math.PI * k) / 48; pts.push([r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)]); } this.poly3(pts, { c: col, w: 1, a }); }
      for (let i = 0; i < n; i++) { const ph = (Math.PI * i) / n, pts = []; for (let k = 0; k <= 48; k++) { const th = (2 * Math.PI * k) / 48; pts.push([r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)]); } this.poly3(pts, { c: col, w: 1, a }); }
    }
    /* ---------- fields ---------- */
    field(fn, o = {}) {
      const x0 = o.x0 || 0, y0 = o.y0 || 0, x1 = o.x1 == null ? this.W : o.x1, y1 = o.y1 == null ? this.H : o.y1, st = o.step || 40, items = []; let mx = 1e-12;
      for (let x = x0 + st / 2; x < x1; x += st) for (let y = y0 + st / 2; y < y1; y += st) { const v = fn(x, y); if (!v) continue; const m = Math.hypot(v[0], v[1]); if (!isFinite(m) || m === 0) continue; items.push([x, y, v[0], v[1], m]); if (m > mx) mx = m; }
      const ref = o.max || mx;
      for (const [x, y, vx, vy, m] of items) {
        const f = clamp(m / ref), len = st * (o.len || 0.82) * (o.uniform ? 1 : Math.tanh(2.4 * f)); if (len < 2.5) continue;
        const ux = vx / m, uy = vy / m;
        this.arrow(x - (ux * len) / 2, y - (uy * len) / 2, x + (ux * len) / 2, y + (uy * len) / 2, { c: o.c || cmap(o.log ? Math.log1p(9 * f) / Math.log(10) : f, o.stops), w: o.w || 2, head: Math.min(9, len * 0.42), a: o.a });
      }
    }
    flow(key, fn, o = {}) {
      const k = '_fl_' + key, x0 = o.x0 || 0, y0 = o.y0 || 0, x1 = o.x1 == null ? this.W : o.x1, y1 = o.y1 == null ? this.H : o.y1, n = o.n || 200, life = o.life || 3, tl = o.trail || 12;
      const r = this._rng || (this._rng = rng(7));
      const spawn = (q) => { const sp = o.spawn ? o.spawn(r) : [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)]; q.x = sp[0]; q.y = sp[1]; q.age = 0; q.life = life * (0.5 + r()); q.tr = []; return q; };
      let F = this.state[k];
      if (!F || F.length !== n) { F = this.state[k] = []; for (let i = 0; i < n; i++) { const q = spawn({}); q.age = r() * q.life; F.push(q); } }
      const dt = this.dt * (o.speed || 1);
      for (const q of F) {
        if (dt > 0) {
          const v = fn(q.x, q.y) || [0, 0]; q.x += v[0] * dt; q.y += v[1] * dt; q.age += this.dt; q.tr.push([q.x, q.y]); if (q.tr.length > tl) q.tr.shift();
          if (q.age > q.life || q.x < x0 || q.x > x1 || q.y < y0 || q.y > y1 || (o.kill && o.kill(q.x, q.y))) spawn(q);
        }
        const fa = clamp(Math.min(q.age / 0.4, (q.life - q.age) / 0.4)), v = fn(q.x, q.y) || [0, 0], m = Math.hypot(v[0], v[1]);
        const col = o.c || cmap(clamp(m / (o.max || 120)), o.stops);
        if (q.tr.length > 1) this.fade(q.tr, { c: col, w: o.w || 2, a: fa * (o.a || 0.9) }); else this.dot(q.x, q.y, { c: col, r: 1.5, a: fa });
      }
    }
    /* ---------- raster images (for fields rendered per pixel) ---------- */
    pix(key, nx, ny) {
      const S = (this._pix = this._pix || {}); let o = S[key];
      if (!o || o.nx !== nx || o.ny !== ny) { const cv = document.createElement('canvas'); cv.width = nx; cv.height = ny; const cx = cv.getContext('2d'); o = S[key] = { nx, ny, cv, cx, img: cx.createImageData(nx, ny) }; o.d = o.img.data; }
      return o;
    }
    blit(o, x, y, w, h, smoothImg = true) { o.cx.putImageData(o.img, 0, 0); const c = this.ctx; c.imageSmoothingEnabled = smoothImg; c.globalAlpha = this._a; c.drawImage(o.cv, x, y, w, h); c.imageSmoothingEnabled = true; }
  }

  /* ---------- interactive scene ---------- */
  class Scene extends R {
    constructor(host, spec, opts = {}) {
      super(null, spec); this.host = host; this.opts = opts; this.dur = spec.duration || 12; this.speed = WL.narrate && !opts.bare ? WL.narrate.scene.speed() : 1;
      this.playing = !reduced || !!opts.forcePlay; this.visible = true; this._last = null; this._beat = -1;
      this._build(); this.reset();
      if (reduced && !opts.bare) { this.t = spec.stateful ? 0 : this.dur; this.frame(0); this._ui(); }
      this._loop = this._loop.bind(this); this._raf = requestAnimationFrame(this._loop);
      try { this._io = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; }, { threshold: 0.02 }); this._io.observe(this.canvas); } catch (e) {}
    }
    _build() {
      const s = this.spec, host = this.host, bare = this.opts.bare; host.innerHTML = '';
      const wrap = document.createElement('div'); wrap.className = 'mscene' + (bare ? ' bare' : ''); this.wrap = wrap;
      const stage = document.createElement('div'); stage.className = 'mstage'; stage.style.aspectRatio = `${this.W} / ${this.H}`;
      const cv = document.createElement('canvas'), dpr = Math.min(2, Math.max(1.25, window.devicePixelRatio || 1)) * (bare ? 0.9 : 1);
      cv.width = Math.round(this.W * dpr); cv.height = Math.round(this.H * dpr);
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', s.alt || 'Physics animation');
      stage.appendChild(cv); wrap.appendChild(stage); host.appendChild(wrap);
      this.canvas = cv; this.ctx = cv.getContext('2d');
      if (bare) return;
      const cap = document.createElement('div'); cap.className = 'mcap'; cap.setAttribute('aria-live', 'polite'); wrap.appendChild(cap); this.capEl = cap;
      const beats = s.beats || [[0, '']], uid = 'sc' + Math.random().toString(36).slice(2, 8);
      const segs = beats.map((b, i) => { const t0 = b[0], t1 = i + 1 < beats.length ? beats[i + 1][0] : this.dur; return { t0, t1: Math.max(t1, t0 + 0.5), cap: b[1] }; });
      this._segs = segs;
      const bar = document.createElement('div'); bar.className = 'mctl';
      bar.innerHTML = `
        <button type="button" class="mbtn" data-act="play" aria-label="Play or pause">${this.playing ? '❚❚' : '▶'}</button>
        <button type="button" class="mbtn" data-act="restart" aria-label="Restart">↺</button>
        <div class="mtl" role="slider" tabindex="0" aria-label="Timeline: arrow keys jump between chapters" aria-valuemin="0" aria-valuemax="${this.dur}" aria-valuenow="0">
          ${segs.map((g, i) => `<div class="mseg" style="flex:${(g.t1 - g.t0).toFixed(2)}" title="${String(i + 1)}. ${escA(g.cap)}"><i></i></div>`).join('')}
        </div>
        <span class="mtime" data-el="time">0.0 s</span>
        <label class="mspeed" for="${uid}-speed"><span class="vh">Speed</span><select id="${uid}-speed">${[0.5, 0.75, 1, 1.5, 2].map((v) => `<option value="${v}"${v === this.speed ? ' selected' : ''}>${v}×</option>`).join('')}</select></label>
        <button type="button" class="mbtn" data-act="fs" aria-label="Full screen">⤢</button>`;
      wrap.appendChild(bar);
      if (WL.narrate) WL.narrate.scene.bar(this, bar);
      if ((s.params || []).length) {
        const pbox = document.createElement('div'); pbox.className = 'mparams';
        s.params.forEach((q) => {
          const id = `${uid}-${q.id}`, row = document.createElement('div'); row.className = 'mparam';
          if (q.toggle) {
            row.innerHTML = `<label for="${id}">${pretty(q.label)}</label><button type="button" id="${id}" class="mtoggle" aria-pressed="${!!q.value}">${q.value ? 'On' : 'Off'}</button>`;
            const b = row.querySelector('button');
            b.addEventListener('click', () => { const v = this.p[q.id] ? 0 : 1; this.p[q.id] = v; b.textContent = v ? 'On' : 'Off'; b.setAttribute('aria-pressed', !!v); this._param(q); });
          } else {
            row.innerHTML = `<label for="${id}">${pretty(q.label)}</label><input type="range" id="${id}" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.value}"><output for="${id}">${fmt(q.value, q.step)}${q.unit ? ' ' + q.unit : ''}</output>`;
            const inp = row.querySelector('input'), out = row.querySelector('output');
            inp.addEventListener('input', () => { const v = parseFloat(inp.value); this.p[q.id] = v; out.textContent = fmt(v, q.step) + (q.unit ? ' ' + q.unit : ''); this._param(q); });
          }
          pbox.appendChild(row);
        });
        wrap.appendChild(pbox);
      }
      if (s.try || this.opts.try) { const tr = document.createElement('p'); tr.className = 'mtry'; tr.innerHTML = `<b>Try this</b> ${pretty(s.try || this.opts.try)}`; wrap.appendChild(tr); }
      this.btnPlay = bar.querySelector('[data-act=play]');
      this.btnPlay.addEventListener('click', () => this.toggle());
      bar.querySelector('[data-act=restart]').addEventListener('click', () => { if (WL.narrate) WL.narrate.scene.seek(this); this.reset(); this.playing = true; this.btnPlay.textContent = '❚❚'; });
      bar.querySelector('select').addEventListener('change', (e) => (this.speed = parseFloat(e.target.value)));
      const fsb = bar.querySelector('[data-act=fs]');
      if (!WL.fs && !(document.fullscreenEnabled && wrap.requestFullscreen)) fsb.hidden = true;
      fsb.addEventListener('click', () => { if (WL.fs) { WL.fs.toggle(wrap); return; } try { if (document.fullscreenElement) document.exitFullscreen(); else wrap.requestFullscreen().catch(() => (fsb.hidden = true)); } catch (e) { fsb.hidden = true; } });
      const tl = bar.querySelector('.mtl'); this.tl = tl; this.segEls = [...tl.querySelectorAll('.mseg i')]; this.timeEl = bar.querySelector('[data-el=time]');
      const seekAt = (e) => { const r = tl.getBoundingClientRect(); this.seek(clamp((e.clientX - r.left) / r.width) * this.dur); };
      tl.addEventListener('pointerdown', (e) => { try { tl.setPointerCapture(e.pointerId); } catch (er) {} this._scrubbing = true; seekAt(e); });
      tl.addEventListener('pointermove', (e) => { if (this._scrubbing) seekAt(e); });
      const end = () => (this._scrubbing = false); tl.addEventListener('pointerup', end); tl.addEventListener('pointercancel', end);
      tl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { this.jump(1); e.preventDefault(); } else if (e.key === 'ArrowLeft') { this.jump(-1); e.preventDefault(); }
        else if (e.key === 'Home') { this.seek(0); e.preventDefault(); } else if (e.key === ' ') { this.toggle(); e.preventDefault(); }
      });
      cv.addEventListener('click', () => this.toggle());
    }
    _param(q) { if ((this.spec.stateful || q.reset) && !q.noReset) this.reset(true); if (this.spec.onParam) this.spec.onParam(this, q.id); }
    toggle() { this.playing = !this.playing; if (this.btnPlay) this.btnPlay.textContent = this.playing ? '❚❚' : '▶'; if (WL.narrate) WL.narrate.scene.toggle(this); }
    seek(t) { if (WL.narrate) WL.narrate.scene.seek(this); if (this.spec.stateful) this.reset(); this.t = clamp(t, 0, this.dur); this.frame(0); this._ui(); }
    jump(dir) { const segs = this._segs || []; let i = 0; segs.forEach((g, k) => { if (this.t >= g.t0 - 1e-6) i = k; }); const j = clamp(i + dir, 0, segs.length - 1); if (dir < 0 && this.t - segs[i].t0 > 1) this.seek(segs[i].t0); else this.seek(segs[j].t0); }
    reset(keepTime) {
      if (!keepTime) this.t = 0;
      this.state = {}; if (this.spec.setup) this.spec.setup(this);
      if (!keepTime) this._beat = -1;
      if (this.ctx) { this.frame(0); this._ui(); }
    }
    destroy() { if (WL.narrate) WL.narrate.scene.gone(this); cancelAnimationFrame(this._raf); this._dead = true; try { this._io.disconnect(); } catch (e) {} }
    _loop(ts) {
      if (this._dead) return;
      const dt = this._last == null ? 0 : Math.min(0.05, (ts - this._last) / 1000); this._last = ts;
      if (this.visible && !document.hidden) {
        let d = this.playing && !this._scrubbing ? dt * this.speed : 0;
        if (d > 0 && WL.narrate && WL.narrate.scene.limit && !this.opts.bare) d = WL.narrate.scene.limit(this, d);   // the voice leads
        if (d > 0) { this.t += d; if (this.spec.step) this.spec.step(this, d); }
        this.frame(d); this._ui();
      }
      this._raf = requestAnimationFrame(this._loop);
    }
    _ui() {
      if (!this.capEl) return;
      const beats = this.spec.beats || []; let bi = -1; for (let i = 0; i < beats.length; i++) if (this.t >= beats[i][0]) bi = i;
      if (bi !== this._beat) { this._beat = bi; this.capEl.innerHTML = bi >= 0 ? `<span class="mnum">${bi + 1}/${beats.length}</span>${pretty(beats[bi][1])}` : ''; this.capEl.classList.remove('in'); void this.capEl.offsetWidth; this.capEl.classList.add('in'); if (WL.narrate) WL.narrate.scene.beat(this, bi); }
      if (this.segEls) this._segs.forEach((g, i) => { const f = clamp((this.t - g.t0) / (g.t1 - g.t0)); const el = this.segEls[i]; const w = (f * 100).toFixed(1) + '%'; if (el._w !== w) { el.style.width = w; el._w = w; } });
      if (this.tl) this.tl.setAttribute('aria-valuenow', Math.min(this.t, this.dur).toFixed(1));
      if (this.timeEl) this.timeEl.textContent = (this.t > this.dur && !this.spec.stateful ? 'live · ' : '') + this.t.toFixed(1) + ' s';
    }
  }

  /* ---------- snapshot: render one frame of a spec into any canvas ---------- */
  function snapshot(spec, canvas, o = {}) {
    const W = spec.W || 960, H = spec.H || 540, w = o.w || 480;
    canvas.width = w; canvas.height = Math.round((w * H) / W);
    const r = new R(canvas.getContext('2d'), spec, { snap: true });
    if (o.params) Object.assign(r.p, o.params);
    const T = o.t != null ? o.t : spec.thumb != null ? spec.thumb : (spec.duration || 12) * 0.92, fps = 30;
    if (spec.setup) spec.setup(r);
    if (spec.stateful) { const n = Math.min(o.maxWarm || 700, Math.round(T * fps)); for (let k = 0; k < n; k++) { r.t = k / fps; if (spec.step) spec.step(r, 1 / fps); } r.t = T; r.frame(1 / fps); }
    else for (let k = 18; k >= 0; k--) { r.t = T - k / fps; r.frame(1 / fps); }
    return r;
  }

  function escA(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function pretty(str) {
    return String(str).split(/(\$[^$]+\$)/).map((seg, i) => {
      const e = escA(seg); if (i % 2) return e;
      return e.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/_\{([^}]*)\}/g, '<sub>$1</sub>')
        .replace(/\^([A-Za-z0-9α-ωΑ-Ω])/g, '<sup>$1</sup>').replace(/_([A-Za-z0-9α-ωΑ-Ω])/g, '<sub>$1</sub>');
    }).join('');
  }
  function fmt(v, step) { const d = step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3; return Number(v).toFixed(d); }
  function fmtn(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : Math.abs(v) < 1 ? v.toFixed(2).replace(/0$/, '') : v.toFixed(1); }
  function cyc(t, len, gap = 1) { const P = len + gap; return Math.min(len, ((t % P) + P) % P); }
  function specColour(f) {
    const nm = 3000 / f;
    if (nm > 750) return '#8a3b3b'; if (nm < 380) return '#b48cff';
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else { r = 1; }
    return `rgb(${Math.round(255 * r)},${Math.round(255 * g)},${Math.round(255 * b)})`;
  }
  const nmColour = (nm) => specColour(3000 / nm);

  WL.util = { ticks, along, plen };
  Object.assign(WL, { C, R, Scene, snapshot, smooth, rate, clamp, lerp, cyc, rng, gauss, plen, along, resample, morph, ticks, contour, mix, alphaC, rgb, cmap, dmap, specColour, nmColour, pretty, reduced, texReady: texOK, topics: WL.topics || {} });
  WL.topic = (t) => { WL.topics[t.id] = t; };
})();
