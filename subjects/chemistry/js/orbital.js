/* Quilio: atomic orbitals as point clouds.
   Every dot is one sample drawn from |psi|^2 of a hydrogen orbital. Colour is the sign of psi.
   WebGL when available, Canvas 2D otherwise. */
(function () {
  'use strict';
  const ex = Math.exp;
  // R: radial part (a0 = 1, unnormalised). A: real angular part on a unit vector. up: which orbital axis points up on screen.
  const ORBS = {
    '1s': { label: '1s', R: r => ex(-r), A: () => 1, rmax: 7, up: 'z', say: 'A sphere. The single electron of a hydrogen atom lives here.' },
    '2s': { label: '2s', R: r => (2 - r) * ex(-r / 2), A: () => 1, rmax: 17, up: 'z', say: 'A sphere inside a sphere. The gap between the two colours is a node: the electron is never found there.' },
    '2p': { label: '2p', R: r => r * ex(-r / 2), A: (x, y, z) => z, rmax: 17, up: 'z', say: 'A dumbbell. Three of these at right angles hold up to six electrons.' },
    '3s': { label: '3s', R: r => (27 - 18 * r + 2 * r * r) * ex(-r / 3), A: () => 1, rmax: 31, up: 'z', say: 'Three nested shells of one sphere, with two nodes between them.' },
    '3p': { label: '3p', R: r => (6 - r) * r * ex(-r / 3), A: (x, y, z) => z, rmax: 31, up: 'z', say: 'A dumbbell with a small inner lobe of the opposite sign inside each half.' },
    '3dz2': { label: '3d', sub: 'z²', R: r => r * r * ex(-r / 3), A: (x, y, z) => 3 * z * z - 1, rmax: 31, up: 'z', say: 'Two lobes along one axis with a ring round the waist.' },
    '3dxy': { label: '3d', sub: 'xy', R: r => r * r * ex(-r / 3), A: (x, y) => x * y, rmax: 31, up: 'y', say: 'Four lobes like a clover leaf. Five d orbitals hold up to ten electrons.' },
    '4f': { label: '4f', sub: 'z³', R: r => r * r * r * ex(-r / 4), A: (x, y, z) => z * (5 * z * z - 3), rmax: 46, up: 'z', say: 'An f orbital: two lobes and two rings. You will not need to draw this one.' },
  };
  const ORDER = ['1s', '2s', '2p', '3s', '3p', '3dz2', '3dxy', '4f'];
  const cache = {};

  function sample(id, N) {
    const key = id + ':' + N; if (cache[key]) return cache[key];
    const o = ORBS[id]; const pos = new Float32Array(N * 3), sg = new Float32Array(N), rr = new Float32Array(N);
    let pmax = 0; for (let i = 1; i <= 800; i++) { const r = o.rmax * i / 800, v = r * r * o.R(r) ** 2; if (v > pmax) pmax = v; }
    let amax = 0; for (let i = 0; i < 4000; i++) {
      const z = (i / 3999) * 2 - 1, ph = i * 2.399963, s = Math.sqrt(1 - z * z), v = o.A(s * Math.cos(ph), s * Math.sin(ph), z) ** 2; if (v > amax) amax = v;
    }
    pmax *= 1.02; amax *= 1.02;
    for (let i = 0; i < N; i++) {
      let r, Rv; do { r = Math.random() * o.rmax; Rv = o.R(r); } while (Math.random() * pmax > r * r * Rv * Rv);
      let x, y, z, Av; do {
        z = Math.random() * 2 - 1; const ph = Math.random() * 6.2831853, s = Math.sqrt(1 - z * z); x = s * Math.cos(ph); y = s * Math.sin(ph); Av = o.A(x, y, z);
      } while (Math.random() * amax > Av * Av);
      // screen axes: X right, Y up, Z towards the viewer
      if (o.up === 'z') { pos[i * 3] = x * r; pos[i * 3 + 1] = z * r; pos[i * 3 + 2] = y * r; }
      else { pos[i * 3] = x * r; pos[i * 3 + 1] = y * r; pos[i * 3 + 2] = z * r; }
      sg[i] = Rv * Av >= 0 ? 1 : -1; rr[i] = r;
    }
    const sorted = Array.from(rr).sort((a, b) => a - b), k = 0.92 / sorted[Math.floor(N * 0.93)];
    for (let i = 0; i < N * 3; i++) pos[i] *= k;
    return (cache[key] = { pos, sg });
  }

  const VS = `attribute vec3 aFrom; attribute vec3 aTo; attribute float aSF; attribute float aST; attribute float aSeed;
uniform float uMix, uYaw, uPitch, uAspect, uSize, uZoom, uGrow; uniform vec2 uCentre;
varying float vSign; varying float vDepth;
void main(){
  float t = clamp(uMix*1.4 - aSeed*0.4, 0.0, 1.0); t = t*t*(3.0-2.0*t);
  vec3 p = mix(aFrom, aTo, t);
  float sw = sin(t*3.14159)*0.22; p += sw*vec3(-p.z, sin(aSeed*40.0)*0.6, p.x);
  float cy = cos(uYaw), sy = sin(uYaw), cp = cos(uPitch), sp = sin(uPitch);
  vec3 q = vec3(cy*p.x + sy*p.z, p.y, -sy*p.x + cy*p.z);
  q = vec3(q.x, cp*q.y - sp*q.z, sp*q.y + cp*q.z);
  float k = 1.0/(3.1 - q.z);
  gl_Position = vec4(uCentre.x + q.x*k*uZoom/uAspect, uCentre.y + q.y*k*uZoom, 0.0, 1.0);
  gl_PointSize = uSize*k*uGrow;
  vSign = mix(aSF, aST, t); vDepth = q.z;
}`;
  const FS = `precision mediump float;
varying float vSign; varying float vDepth; uniform vec3 uPos; uniform vec3 uNeg; uniform float uAlpha; uniform float uHalo;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = dot(c,c); if (d > 0.25) discard;
  float a = smoothstep(0.25, 0.01, d) * uAlpha * (0.5 + 0.5*smoothstep(-1.1, 1.1, vDepth));
  vec3 col = mix(mix(uNeg, uPos, smoothstep(-0.3, 0.3, vSign)), vec3(1.0), uHalo);
  gl_FragColor = vec4(col*a, a);
}`;

  class View {
    constructor(canvas, opts) {
      this.c = canvas; this.o = Object.assign({ n: 24000, zoom: 2.35, centre: [0, 0], spin: true, onChange: null }, opts || {});
      this.reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.yaw = 0.5; this.pitch = 0.3; this.vy = 0; this.mix = 1; this.mixT0 = 0; this.cur = null; this.run = false; this.drag = null; this.t0 = performance.now();
      this.gl = null;
      try { this.gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' }); } catch (e) { this.gl = null; }
      if (this.gl && !this._initGL()) this.gl = null;
      if (!this.gl) { this.ctx = canvas.getContext('2d'); this.o.n = Math.min(this.o.n, 6500); }
      this.N = this.o.n;
      this.from = new Float32Array(this.N * 3); this.to = new Float32Array(this.N * 3); this.sf = new Float32Array(this.N).fill(1); this.st = new Float32Array(this.N).fill(1);
      this._resize = this._resize.bind(this); this._frame = this._frame.bind(this);
      if (window.ResizeObserver) { this.ro = new ResizeObserver(this._resize); this.ro.observe(canvas); }
      this._resize(); this._pointer();
    }
    _initGL() {
      const gl = this.gl, mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
      const vs = mk(gl.VERTEX_SHADER, VS), fs = mk(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return false;
      const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return false;
      gl.useProgram(p); this.p = p; this.loc = {}; this.buf = {};
      ['uMix', 'uYaw', 'uPitch', 'uAspect', 'uSize', 'uZoom', 'uGrow', 'uCentre', 'uPos', 'uNeg', 'uAlpha', 'uHalo'].forEach(n => this.loc[n] = gl.getUniformLocation(p, n));
      ['aFrom', 'aTo', 'aSF', 'aST', 'aSeed'].forEach(n => { this.loc[n] = gl.getAttribLocation(p, n); this.buf[n] = gl.createBuffer(); });
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      const seed = new Float32Array(this.o.n); for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
      this._up('aSeed', seed, 1);
      return true;
    }
    _up(name, arr, size) { const gl = this.gl; gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[name]); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(this.loc[name]); gl.vertexAttribPointer(this.loc[name], size, gl.FLOAT, false, 0, 0); }
    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(this.c.clientWidth * dpr)), h = Math.max(1, Math.round(this.c.clientHeight * dpr));
      if (this.c.width !== w || this.c.height !== h) { this.c.width = w; this.c.height = h; }
      if (this.gl) this.gl.viewport(0, 0, w, h);
      if (!this.run) this._draw(performance.now());
    }
    _pointer() {
      const c = this.c; c.style.touchAction = 'pan-y';
      c.addEventListener('pointerdown', e => { this.drag = { x: e.clientX, y: e.clientY }; try { c.setPointerCapture(e.pointerId); } catch (x) { } c.classList.add('is-drag'); });
      c.addEventListener('pointermove', e => {
        if (!this.drag) return; const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y; this.drag = { x: e.clientX, y: e.clientY };
        this.yaw += dx * 0.008; this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch + dy * 0.006)); this.vy = dx * 0.008; if (!this.run) this._draw(performance.now());
      });
      const end = () => { this.drag = null; c.classList.remove('is-drag'); };
      c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    }
    set(id, instant) {
      if (!ORBS[id] || id === this.cur && this.mix >= 1) return;
      const s = sample(id, this.N);
      this.from.set(this.to); this.sf.set(this.st); this.to.set(s.pos); this.st.set(s.sg);
      if (this.cur === null || instant || this.reduce) { this.from.set(this.to); this.sf.set(this.st); this.mix = 1; if (ORBS[id].up === 'y') this.yaw = 0.35; } else { this.mix = 0; this.mixT0 = performance.now(); }
      // an orbital that lies in a vertical plane is turned to face the viewer while the dots rearrange
      this.steer = null; if (ORBS[id].up === 'y' && this.mix < 1) this.steer = [this.yaw, Math.round(this.yaw / Math.PI) * Math.PI];
      this.cur = id;
      if (this.gl) { this._up('aFrom', this.from, 3); this._up('aTo', this.to, 3); this._up('aSF', this.sf, 1); this._up('aST', this.st, 1); }
      if (this.o.onChange) this.o.onChange(id, ORBS[id]);
      if (!this.run) this._draw(performance.now());
    }
    next(dir) { const i = ORDER.indexOf(this.cur); this.set(ORDER[(i + (dir || 1) + ORDER.length) % ORDER.length]); }
    start() { if (this.run) return; this.run = true; this.last = performance.now(); requestAnimationFrame(this._frame); }
    stop() { this.run = false; }
    destroy() { this.stop(); if (this.ro) this.ro.disconnect(); }
    _frame(now) {
      if (!this.run) return;
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      if (this.mix < 1) this.mix = Math.min(1, (now - this.mixT0) / 2100);
      if (this.drag) this.steer = null;
      else if (this.steer) { const e = this.mix * this.mix * (3 - 2 * this.mix); this.yaw = this.steer[0] + (this.steer[1] - this.steer[0]) * e; if (this.mix >= 1) this.steer = null; }
      else { if (this.o.spin && !this.reduce) this.yaw += dt * 0.22; this.yaw += this.vy; this.vy *= 0.94; }
      this._draw(now); requestAnimationFrame(this._frame);
    }
    _draw(now) {
      const w = this.c.width, h = this.c.height, asp = w / h, zoom = this.o.zoom * Math.min(1, asp * 1.15), cen = this.o.centre;
      const pitch = this.pitch + (this.reduce || this.drag ? 0 : Math.sin((now - this.t0) / 5200) * 0.07);
      if (this.gl) {
        const gl = this.gl, L = this.loc; gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); if (this.cur === null) return;
        gl.uniform1f(L.uMix, this.mix); gl.uniform1f(L.uYaw, this.yaw); gl.uniform1f(L.uPitch, pitch); gl.uniform1f(L.uAspect, asp); gl.uniform1f(L.uZoom, zoom);
        gl.uniform2f(L.uCentre, cen[0], cen[1]); gl.uniform1f(L.uSize, h * 0.0125 * Math.sqrt(24000 / this.N));
        gl.uniform3f(L.uPos, 0.035, 0.235, 0.6); gl.uniform3f(L.uNeg, 0.93, 0.43, 0.06);
        gl.uniform1f(L.uHalo, 1); gl.uniform1f(L.uGrow, 3.4); gl.uniform1f(L.uAlpha, 0.028); gl.drawArrays(gl.POINTS, 0, this.N);
        gl.uniform1f(L.uHalo, 0); gl.uniform1f(L.uGrow, 1); gl.uniform1f(L.uAlpha, 0.5); gl.drawArrays(gl.POINTS, 0, this.N);
        return;
      }
      const g = this.ctx; if (!g) return; g.clearRect(0, 0, w, h); if (this.cur === null) return;
      let t0 = this.mix; const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), F = this.from, T = this.to;
      const cx = (0.5 + cen[0] / 2) * w, cyy = (0.5 - cen[1] / 2) * h, sc = zoom * h / 2, e = t0 * t0 * (3 - 2 * t0);
      for (let pass = 0; pass < 2; pass++) {
        g.fillStyle = pass ? 'rgba(9,60,153,0.5)' : 'rgba(237,110,15,0.5)';
        for (let i = 0; i < this.N; i++) {
          if ((this.st[i] > 0) !== (pass === 1)) continue;
          const j = i * 3, x = F[j] + (T[j] - F[j]) * e, y = F[j + 1] + (T[j + 1] - F[j + 1]) * e, z = F[j + 2] + (T[j + 2] - F[j + 2]) * e;
          const x1 = cy * x + sy * z, z1 = -sy * x + cy * z, y2 = cp * y - sp * z1, z2 = sp * y + cp * z1, k = 1 / (3.1 - z2), s = Math.max(1.2, h * 0.007 * k * 2);
          g.fillRect(cx + x1 * k * sc - s / 2, cyy - y2 * k * sc - s / 2, s, s);
        }
      }
    }
  }
  window.Orbital = { ORBS, ORDER, View, sample };
})();
