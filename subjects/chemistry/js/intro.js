/* Quilio: the entrance film, about three and a half seconds.
   The periodic table you clicked is made of dots. The dots let go and become electron clouds: 1s, 2p, 3d, 4f, each one
   sampled from |psi|^2 of hydrogen, then the camera falls through the 4f cloud and comes out on the home screen's 2p orbital.
   Click, tap or press a key to skip. It does not play for people who ask for reduced motion. */
(function () {
  'use strict';
  const root = document.documentElement, el = document.getElementById('intro');
  const I = (window.GCIntro = { playing: root.classList.contains('intro'), done: false });
  let ended = false;
  function finish(fast) {
    if (ended) return; ended = true;
    el.style.transition = `opacity ${fast ? 0.18 : 0.42}s ease`; el.style.opacity = '0'; el.style.pointerEvents = 'none';
    setTimeout(() => { root.classList.remove('intro'); el.remove(); I.playing = false; I.done = true; window.dispatchEvent(new Event('gc-intro-done')); }, fast ? 200 : 440);
  }
  if (!I.playing || !el) { if (el) el.remove(); I.playing = false; I.done = true; return; }
  try { sessionStorage.setItem('gc.intro', '1'); } catch (e) { }
  const c = document.getElementById('introGL'), sky = document.getElementById('introSky'), flash = document.getElementById('introFlash'), cap = document.getElementById('introCap');
  let gl = null; try { gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' }); } catch (e) { gl = null; }
  if (!gl || !window.Orbital) { setTimeout(() => finish(true), 250); return; }

  const wide = window.innerWidth >= 980, N = window.innerWidth < 700 ? 12000 : 24000;
  const VS = `attribute vec3 aFrom; attribute vec3 aTo; attribute float aSF; attribute float aST; attribute float aSeed;
uniform float uMix, uYaw, uPitch, uAspect, uSize, uZoom, uGrow, uBurst; uniform vec2 uCentre;
varying float vSign; varying float vDepth; varying float vHot;
void main(){
  float t = clamp(uMix*1.5 - aSeed*0.5, 0.0, 1.0); t = t*t*(3.0-2.0*t);
  vec3 p = mix(aFrom, aTo, t);
  float arc = sin(t*3.14159);
  p += arc*0.55*vec3(-p.z - p.y*0.4, sin(aSeed*40.0)*0.7 + p.x*0.4, p.x);
  p *= 1.0 + arc*uBurst*(0.35 + aSeed);
  float cy = cos(uYaw), sy = sin(uYaw), cp = cos(uPitch), sp = sin(uPitch);
  vec3 q = vec3(cy*p.x + sy*p.z, p.y, -sy*p.x + cy*p.z);
  q = vec3(q.x, cp*q.y - sp*q.z, sp*q.y + cp*q.z);
  float k = 1.0/max(0.4, 3.1 - q.z);
  gl_Position = vec4(uCentre.x + q.x*k*uZoom/uAspect, uCentre.y + q.y*k*uZoom, 0.0, 1.0);
  gl_PointSize = uSize*k*uGrow*(1.0 + arc*0.9);
  vSign = mix(aSF, aST, t); vDepth = q.z; vHot = arc;
}`;
  const FS = `precision mediump float;
varying float vSign; varying float vDepth; varying float vHot;
uniform vec3 uPos; uniform vec3 uNeg; uniform vec3 uTintCol; uniform float uAlpha, uHalo, uTint;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = dot(c,c); if (d > 0.25) discard;
  float a = smoothstep(0.25, 0.01, d) * uAlpha * (0.5 + 0.5*smoothstep(-1.1, 1.1, vDepth));
  vec3 col = mix(uNeg, uPos, smoothstep(-0.3, 0.3, vSign));
  col = mix(col, uTintCol, uTint); col = mix(col, vec3(1.0, 0.97, 0.9), vHot*0.35*(1.0-uTint));
  col = mix(col, vec3(1.0), uHalo);
  gl_FragColor = vec4(col*a, a);
}`;
  const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = mk(gl.VERTEX_SHADER, VS), fs = mk(gl.FRAGMENT_SHADER, FS), prog = gl.createProgram();
  if (!vs || !fs) { finish(true); return; }
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { finish(true); return; }
  gl.useProgram(prog); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
  const U = {}, A = {}, B = {};
  ['uMix', 'uYaw', 'uPitch', 'uAspect', 'uSize', 'uZoom', 'uGrow', 'uBurst', 'uCentre', 'uPos', 'uNeg', 'uTintCol', 'uAlpha', 'uHalo', 'uTint'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  ['aFrom', 'aTo', 'aSF', 'aST', 'aSeed'].forEach(n => { A[n] = gl.getAttribLocation(prog, n); B[n] = gl.createBuffer(); });
  const up = (name, arr, size) => { gl.bindBuffer(gl.ARRAY_BUFFER, B[name]); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(A[name]); gl.vertexAttribPointer(A[name], size, gl.FLOAT, false, 0, 0); };
  const seed = new Float32Array(N); for (let i = 0; i < N; i++) seed[i] = Math.random(); up('aSeed', seed, 1);

  /* the periodic table as dots: 118 cells, each dot dropped at random inside one of them */
  function tableCloud() {
    const cells = [];
    const row = (r, cols) => cols.forEach(cc => cells.push([cc, r]));
    row(1, [1, 18]); [2, 3].forEach(r => row(r, [1, 2, 13, 14, 15, 16, 17, 18]));
    [4, 5, 6, 7].forEach(r => row(r, Array.from({ length: 18 }, (_, i) => i + 1)));
    [8.6, 9.6].forEach(r => row(r, Array.from({ length: 14 }, (_, i) => i + 4)));
    const pos = new Float32Array(N * 3), sg = new Float32Array(N), s = wide ? 0.172 : 0.118, g = 0.14;
    for (let i = 0; i < N; i++) {
      const [cc, r] = cells[i % cells.length];
      pos[i * 3] = (cc - 9.5 + (Math.random() - 0.5) * (1 - g)) * s; pos[i * 3 + 1] = (5.3 - r + (Math.random() - 0.5) * (1 - g)) * s; pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      sg[i] = cc <= 2 || cc >= 13 ? 1 : -1;
    }
    return { pos, sg };
  }
  const LABEL = { '1s': ['1s', 'one electron, one sphere'], '2p': ['2p', 'a dumbbell, three ways round'], '3dz2': ['3d', 'lobes and a ring'], '4f': ['4f', 'the lanthanoids live here'] };
  const SEQ = [{ to: '1s', d: 0.8, burst: 1.5 }, { to: '2p', d: 0.5, burst: 0.25 }, { to: '3dz2', d: 0.5, burst: 0.25 }, { to: '4f', d: 0.52, burst: 0.3 }, { to: '2p', d: 0.85, burst: 0.9, last: true }];
  const HOLD = 0.34, clouds = { table: tableCloud() };
  SEQ.forEach(s => { if (!clouds[s.to]) clouds[s.to] = window.Orbital.sample(s.to, N); });
  let acc = HOLD; SEQ.forEach(s => { s.t0 = acc; acc += s.d; }); const END = acc;
  const heroZoom = wide ? 1.95 : 1.5, heroCen = wide ? [0.38, 0.07] : [0, 0.6];
  let seg = -1, t0 = 0;
  function setSeg(i) {
    seg = i; const from = i === 0 ? clouds.table : clouds[SEQ[i - 1].to], to = clouds[SEQ[i].to];
    up('aFrom', from.pos, 3); up('aTo', to.pos, 3); up('aSF', from.sg, 1); up('aST', to.sg, 1);
    const L = SEQ[i].last ? ['', ''] : LABEL[SEQ[i].to]; cap.classList.remove('on'); setTimeout(() => { cap.firstChild.textContent = L[0]; cap.lastChild.textContent = L[1]; if (L[0]) cap.classList.add('on'); }, 70);
  }
  function size() { const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(c.clientWidth * dpr)), h = Math.max(1, Math.round(c.clientHeight * dpr)); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } gl.viewport(0, 0, w, h); }
  const ease = x => x * x * (3 - 2 * x), clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  up('aFrom', clouds.table.pos, 3); up('aTo', clouds.table.pos, 3); up('aSF', clouds.table.sg, 1); up('aST', clouds.table.sg, 1);
  const FREEZE = /[?&]introT=([\d.]+)/.exec(location.search);   // for checking a single frame: ?introT=1.4
  function frame(now) {
    if (ended) return; if (!t0) t0 = now; const t = FREEZE ? +FREEZE[1] : (now - t0) / 1000;
    if (t >= END + 0.1) { finish(false); draw(END, 1); return; }
    let i = -1; for (let k = 0; k < SEQ.length; k++) if (t >= SEQ[k].t0) i = k;
    if (i !== seg && i >= 0) setSeg(i);
    draw(t, i < 0 ? 0 : clamp((t - SEQ[i].t0) / SEQ[i].d, 0, 1)); requestAnimationFrame(frame);
  }
  function draw(t, mix) {
    size(); const w = c.width, h = c.height, asp = w / h, S = seg < 0 ? null : SEQ[seg], fit = Math.min(1, asp * 1.15);
    // the camera: steady, then falling into the 4f cloud, then coming to rest where the home screen keeps its orbital
    let zoom = 2.25 * fit * (1 + 0.1 * clamp((t - HOLD) / 2, 0, 1)), cen = [0, 0], yaw = 0, pitch = 0, tint = 1, burst = 0;
    const tA = SEQ[0].t0, t4 = SEQ[3].t0, tL = SEQ[4].t0;
    if (t > tA) { const u = clamp((t - tA) / 0.55, 0, 1); tint = 1 - ease(u); yaw = (t - tA) * 1.5; pitch = 0.3 * ease(clamp((t - tA) / 0.6, 0, 1)); }
    if (t > t4 + 0.2 && t < tL) { const u = (t - t4 - 0.2) / (tL - t4 - 0.2); zoom *= 1 + 7 * u * u * u; }
    if (t >= tL) { const u = ease(clamp((t - tL) / SEQ[4].d, 0, 1)), v = 1 - Math.pow(1 - clamp((t - tL) / SEQ[4].d, 0, 1), 3); zoom = (0.5 + (heroZoom - 0.5) * v) * fit; cen = [heroCen[0] * u, heroCen[1] * u]; yaw = (tL - tA) * 1.5 + (t - tL) * (1.5 - 1.1 * u); pitch = 0.3; }
    if (S) burst = S.burst;
    sky.style.opacity = String(ease(clamp((t - tA) / 0.7, 0, 1)));
    flash.style.opacity = String(Math.exp(-Math.pow((t - tL) / 0.13, 2)) * 0.96);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.uMix, mix); gl.uniform1f(U.uYaw, yaw); gl.uniform1f(U.uPitch, pitch); gl.uniform1f(U.uAspect, asp); gl.uniform1f(U.uZoom, zoom); gl.uniform1f(U.uBurst, burst);
    gl.uniform2f(U.uCentre, cen[0], cen[1]); gl.uniform1f(U.uSize, h * 0.0125 * Math.sqrt(24000 / N)); gl.uniform1f(U.uTint, tint);
    gl.uniform3f(U.uPos, 0.035, 0.235, 0.6); gl.uniform3f(U.uNeg, 0.93, 0.43, 0.06); gl.uniform3f(U.uTintCol, 0.753, 0.075, 0.42);
    gl.uniform1f(U.uHalo, 1); gl.uniform1f(U.uGrow, 3.4); gl.uniform1f(U.uAlpha, 0.028 * (1 - tint)); gl.drawArrays(gl.POINTS, 0, N);
    gl.uniform1f(U.uHalo, 0); gl.uniform1f(U.uGrow, 1 + 0.25 * tint); gl.uniform1f(U.uAlpha, 0.5 + 0.35 * tint); gl.drawArrays(gl.POINTS, 0, N);
  }
  const skip = () => finish(true);
  el.addEventListener('pointerdown', skip); window.addEventListener('keydown', skip, { once: true });
  if (!FREEZE) setTimeout(() => finish(true), 9000);   // a tab that was hidden, or a very slow machine: never leave the film in the way
  draw(0, 0); requestAnimationFrame(frame);
})();
