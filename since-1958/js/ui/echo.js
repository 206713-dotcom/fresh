// "The echo": in 1969 the Apollo 11 crew left a mirror on the Moon, and observatories still bounce laser
// pulses off it. Press Fire: a pulse leaves a telescope on Earth, reaches the mirror and comes back, at the
// real speed of light, with the Earth and the Moon at true size and at today's real distance (computed by
// astronomy-engine for this very moment). The small window shows the mirror itself.
// Facts: NASA Goddard (round trip about 2.5 s; the Moon recedes 3.8 cm a year, about as fast as fingernails
// grow), NASA JPL (the experiment still returns data), NASA eclipse site / LPI (Apollo 11 panel 46 cm square,
// 100 corner cubes; the beam is about 4 miles, 6 km, wide at the Moon).
// It has its own small renderer that exists only while it is open; the main view stops drawing meanwhile.

import * as THREE from 'three';
import * as A from '../../vendor/astronomy.js';
import { AU_KM } from '../config.js';
import { buildPart } from '../scene/models.js';

const C = 299792.458;               // speed of light, km/s
const RE = 6371.0, RM = 1737.4;     // mean radii, km
const U = 1000;                     // the wide view is drawn in units of 1000 km
const TILT = 0.42;                  // the mirror tray leans this far toward the Earth (see hardware.js lrrr)
const GREEN = 0x57f287;
const fmtKm = (km) => Math.round(km).toLocaleString('en-US');

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,0.75)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function regolithTexture() {
  // fine grey dust: many soft specks at three sizes and a few shallow dimples, no hard rings (it tiles every 2.5 m)
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  g.fillStyle = '#7d7b78'; g.fillRect(0, 0, N, N);
  const blob = (x, y, r, col) => { for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2); } };
  for (let i = 0; i < 90; i++) blob(rnd() * N, rnd() * N, 30 + rnd() * 70, rnd() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)');
  for (let i = 0; i < 14; i++) { const x = rnd() * N, y = rnd() * N, r = 6 + rnd() * 16; blob(x - r * 0.25, y - r * 0.25, r, 'rgba(0,0,0,0.16)'); blob(x + r * 0.3, y + r * 0.3, r * 0.8, 'rgba(255,255,255,0.10)'); }
  const img = g.getImageData(0, 0, N, N), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * 34; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export class Echo {
  constructor(root) {
    this.root = root; this.isOpen = false;
    root.innerHTML = `<div class="e-wrap" role="dialog" aria-label="The echo from 1969: fire a laser at the mirror Apollo 11 left on the Moon">
      <canvas></canvas>
      <div class="e-inset" aria-hidden="true"><span>At the mirror</span></div>
      <span class="e-lb e-earth" aria-hidden="true">Earth</span><span class="e-lb e-moon" aria-hidden="true">Moon</span>
      <span class="e-lb e-dist" aria-hidden="true"></span>
      <div class="e-cap"><p class="e-k"></p><h2 class="e-t"></h2></div>
      <div class="e-hud" aria-live="polite"><span class="e-hk">Time for the light</span><b class="e-time">0.000 s</b></div>
      <div class="e-end">
        <p class="e-k">The echo came back after</p><b class="e-big"></b>
        <p class="e-calc"></p>
        <ul class="e-facts">
          <li><b>3.8 cm a year.</b> Measured this way since 1969: the Moon is slowly drifting away from us, about as fast as your fingernails grow.</li>
          <li><b>Still working.</b> Apollo 11, 14 and 15 each left a mirror, and observatories still aim lasers at them.</li>
        </ul>
        <p class="e-tag">Left behind in 1969. Still doing science today.</p>
        <p class="e-src">Facts: NASA Goddard and NASA JPL. Distance computed for this moment; the Earth and the Moon are drawn at true size and distance.</p>
      </div>
      <div class="e-row"><button class="e-fire">Fire the laser</button><button class="e-again">Fire again</button><button class="e-close">Close</button></div>
      <button class="p-close e-x" aria-label="Close">×</button>
    </div>`;
    this.$ = (s) => root.querySelector(s);
    this.canvas = this.$('canvas');
    this.$('.e-fire').addEventListener('click', () => this._fire());
    this.$('.e-again').addEventListener('click', () => this._fire());
    this.$('.e-close').addEventListener('click', () => this.close());
    this.$('.e-x').addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
      else if ((e.key === ' ' || e.key === 'Enter') && (this.stage === 'ready' || this.stage === 'result')) { e.preventDefault(); e.stopPropagation(); this._fire(); }
    }, true);
  }

  /** The real distance between the centres of the Earth and the Moon right now, in km. */
  _dist() { const v = A.GeoMoon(new Date()); return Math.hypot(v.x, v.y, v.z) * AU_KM; }

  open() {
    if (this.isOpen) return;
    this.isOpen = true; this.root.hidden = false;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    r.toneMapping = THREE.ACESFilmicToneMapping; r.autoClear = false;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.glow = this.glow || glowTexture();
    this._buildWide(); this._buildMirror();
    this.D = this._dist(); this._placeMoon();
    this.stage = 'intro'; this.t = 0; this.ft = 0; this._w = 0; this._said2 = false;
    this._setStage('intro');
    this._caption('Apollo 11 · Sea of Tranquility · July 1969', 'The crew left a mirror on the Moon.');
    let last = performance.now();
    const loop = (now) => {
      if (!this.isOpen) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      this._tick(dt);
    };
    this.raf = requestAnimationFrame(loop);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf);
    for (const s of [this.wide, this.mir]) s.traverse((o) => { if (o.geometry && !o.userData.shared) o.geometry.dispose(); });
    if (this.regolith) { this.regolith.dispose(); this.regolith = null; }
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer = null;
    const fresh = this.canvas.cloneNode(false); this.canvas.replaceWith(fresh); this.canvas = fresh;   // a lost context cannot be reused
    this.root.hidden = true;
    if (this.onClose) this.onClose();
  }

  _setStage(s) {
    this.stage = s;
    for (const k of ['intro', 'ready', 'fire', 'result']) this.root.classList.toggle(k, k === s);
    if (s === 'ready') this.root.classList.add('intro');
  }
  _caption(k, t, t2) {
    this.$('.e-cap .e-k').textContent = k;
    const h = this.$('.e-cap .e-t'); h.innerHTML = '';
    const a = document.createElement('span'); a.textContent = t; h.appendChild(a);
    if (t2) { const b = document.createElement('span'); b.className = 'e-t2'; b.textContent = t2; h.appendChild(b); }
    const cap = this.$('.e-cap'); cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
  }

  // ---------------------------------------------------------------- the wide view: Earth and Moon at true scale
  _buildWide() {
    const s = this.wide = new THREE.Scene();
    const L = new THREE.TextureLoader();
    const tex = (f) => { const t = L.load(f); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
    this.texE = this.texE || tex('textures/earth_day.jpg'); this.texM = this.texM || tex('textures/moon.jpg');
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(RE / U, 96, 64), new THREE.MeshStandardMaterial({ map: this.texE, roughness: 0.8, metalness: 0 }));
    this.earth.rotation.set(0.25, -1.75, -0.4); s.add(this.earth);          // Africa and Europe toward us
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(RM / U, 64, 48), new THREE.MeshStandardMaterial({ map: this.texM, roughness: 1, metalness: 0 }));
    this.moon.rotation.y = Math.PI;                     // the near side (longitude 0 is +x on the sphere) faces the Earth
    s.add(this.moon);
    const sun = new THREE.DirectionalLight(0xffffff, 4.2); sun.position.set(0.1, 0.25, 1); s.add(sun);
    s.add(new THREE.AmbientLight(0x8899bb, 0.1));
    const spr = (color, opacity) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); s.add(m); return m; };
    this.atmo = spr(0x5f9cff, 0.75); this.atmo.scale.setScalar(RE / U * 3.4);
    this.moonGlow = spr(0xd8dde6, 0.35); this.moonGlow.scale.setScalar(RM / U * 5);
    // stars, far behind
    { const n = 1600, p = new Float32Array(n * 3); let k = 5; const rnd = () => { k = (k * 16807) % 2147483647; return k / 2147483647; };
      for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.283, q = Math.sqrt(1 - u * u); p[i * 3] = 190 + q * Math.cos(a) * 3000; p[i * 3 + 1] = u * 3000; p[i * 3 + 2] = q * Math.sin(a) * 3000 - 1200; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      s.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbfcbe0, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false }))); }
    // the pulse: a thin beam behind it and a glowing head, going out and coming back
    const beamGeo = new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0);
    const beam = () => { const m = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); m.visible = false; s.add(m); return m; };
    this.beamOut = beam(); this.beamBack = beam(); this.beamBack.userData.shared = true;
    this.head = spr(GREEN, 1); this.core = spr(0xffffff, 0.95); this.head.visible = this.core.visible = false;
    this.station = spr(GREEN, 0); this.hitW = spr(GREEN, 0);
    this.camW = new THREE.PerspectiveCamera(26, 1, 1, 20000);
  }
  _placeMoon() {
    const x = this.D / U;
    this.moon.position.set(x, 0, 0); this.moonGlow.position.set(x, 0, 0); this.hitW.position.set((this.D - RM) / U, 0, 0); this.station.position.set(RE / U, 0, 0);
    this.L = this.D - RE - RM; this.T1 = this.L / C;
    this.$('.e-dist').textContent = `${fmtKm(this.D)} km between centres, right now`;
  }
  _fitWide(w, h) {
    const cam = this.camW, x0 = -RE / U * 2.2, x1 = (this.D + RM * 4) / U, cx = (x0 + x1) / 2;
    const vf = cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * w / h);
    const dist = ((x1 - x0) / 2 / 0.88) / Math.tan(hf / 2);
    cam.position.set(cx, dist * 0.1, dist); cam.lookAt(cx, 0, 0); cam.updateMatrixWorld();
    this.wpp = 2 * dist * Math.tan(vf / 2) / h;           // kilometres (x1000) per screen pixel, at the Earth–Moon line
  }

  // ---------------------------------------------------------------- the mirror itself, on the ground at Tranquility Base
  _buildMirror() {
    const s = this.mir = new THREE.Scene(); s.background = new THREE.Color(0x000000);
    let k = 7; const rnd = () => { k = (k * 16807) % 2147483647; return k / 2147483647; };
    this.regolith = regolithTexture(); this.regolith.repeat.set(72, 72);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(90, 72), new THREE.MeshStandardMaterial({ map: this.regolith, color: 0xc9c6c2, roughness: 1, metalness: 0 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; s.add(ground);
    const shadowy = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
    s.add(shadowy(buildPart({ type: 'lrrr' }, rnd)));
    s.add(shadowy(buildPart({ type: 'lm', e: 1.2, n: 21.5 }, rnd)));       // the lander stood 21.5 m north of the mirror
    const rockM = new THREE.MeshStandardMaterial({ color: 0x8d8984, roughness: 1, flatShading: true });
    for (let i = 0; i < 40; i++) {
      const a = rnd() * 6.283, d = 1.2 + rnd() * 14, r = 0.03 + rnd() * rnd() * 0.22;
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rockM); m.position.set(Math.cos(a) * d, r * 0.4, Math.sin(a) * d); m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); m.scale.y = 0.6; m.castShadow = m.receiveShadow = true; s.add(m);
    }
    const sun = new THREE.DirectionalLight(0xfff3e6, 3.4); sun.position.set(-3, 4.2, 4); sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 20 }); sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0006; s.add(sun);
    s.add(new THREE.HemisphereLight(0x405070, 0x403b35, 0.45));
    // the laser light, from where the Earth hangs in the sky (23.5 degrees west of overhead, the way the tray leans)
    this.greenL = new THREE.DirectionalLight(GREEN, 0); this.greenL.position.set(-Math.sin(TILT) * 10, Math.cos(TILT) * 10, 0); s.add(this.greenL);
    const tray = new THREE.Group(); tray.position.set(0, 0.16 + Math.sin(TILT) * 0.23, 0); tray.rotation.z = TILT; s.add(tray);
    this.trayGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), new THREE.MeshBasicMaterial({ color: 0x9dffbc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    this.trayGlow.rotation.x = -Math.PI / 2; this.trayGlow.position.y = 0.04; tray.add(this.trayGlow);
    this.trayHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color: GREEN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    this.trayHalo.position.set(0, 0.06, 0); this.trayHalo.scale.setScalar(1.4); tray.add(this.trayHalo);
    this.camM = new THREE.PerspectiveCamera(40, 1, 0.05, 400);
    this.flash = 0;
  }
  _mirrorCam(t, close) {
    const a = -1.05 + Math.sin(t * 0.12) * 0.32, R = close ? 1.45 : 2.5, H = close ? 1.05 : 1.15;
    this.camM.position.set(Math.sin(a) * R, H, Math.cos(a) * R); this.camM.lookAt(0, close ? 0.22 : 0.32, 0);
  }

  // ---------------------------------------------------------------- the show
  _fire() {
    if (this.stage === 'fire') return;
    this.D = this._dist(); this._placeMoon();
    this.ft = 0; this.hit = false; this.home = false; this.flash = 0; this.homeFlash = 0;
    this._setStage('fire');
    this.$('.e-time').textContent = '0.000 s';
    this._caption('True scale · the Earth and the Moon right now', 'Light travels 300,000 km every second.', `About 30 Earths would fit in the gap.`);
  }

  _tick(dt) {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) {
      this._w = w; this._h = h; this._dpr = dpr;
      this.renderer.setPixelRatio(Math.max(1, Math.min(dpr, Math.sqrt(3.2e6 / (w * h))))); this.renderer.setSize(w, h, false);
      this.camW.aspect = w / h; this.camW.updateProjectionMatrix(); this._fitWide(w, h);
    }
    if (!w || !h) return;
    this.t += dt;
    const r = this.renderer;
    if (this.stage === 'intro' || this.stage === 'ready') {
      if (this.stage === 'intro' && this.t > 2.6 && !this._said2) { this._said2 = true; this._caption('Apollo 11 · Sea of Tranquility · July 1969', 'The crew left a mirror on the Moon.', 'Scientists still fire lasers at it today.'); }
      if (this.stage === 'intro' && this.t > 3.8) this._setStage('ready');
      this._mirrorCam(this.t, false);
      this.camM.aspect = w / h; this.camM.updateProjectionMatrix();
      r.setScissorTest(false); r.setViewport(0, 0, w, h); r.clear(); r.render(this.mir, this.camM);
      return;
    }
    // ---- fire / result: the wide view, with the mirror in a small window
    this.ft += dt;
    const pre = 0.9, tp = this.ft - pre, T1 = this.T1, c = C / U;          // c in world units per second
    const x0 = RE / U, x1 = (RE + this.L) / U, wpp = this.wpp;
    const thick = 2.4 * wpp;
    let headX = null;
    if (tp >= 0 && tp < T1) { headX = x0 + c * tp; }
    else if (tp >= T1 && tp < 2 * T1) { headX = x1 - c * (tp - T1); }
    if (tp >= T1 && !this.hit) { this.hit = true; this.flash = 1; this._caption('It hits the mirror', 'By now the beam is about 6 km wide.', 'The mirror is 46 cm across. Only a tiny bit of the light makes it back.'); }
    if (tp >= 2 * T1 && !this.home) { this.home = true; this.homeFlash = 1; this.doneAt = this.ft; this._caption('Back at the telescope', 'The echo is home.'); }
    if (this.home && this.stage === 'fire' && this.ft - this.doneAt > 1.3) this._showResult();
    // beams
    const bo = this.beamOut, bb = this.beamBack;
    bo.visible = tp >= 0; bo.position.set(x0, 0, 0);
    const outEnd = tp < T1 ? Math.max(x0 + 1e-3, headX ?? x0) : x1;
    bo.scale.set(Math.max(1e-3, outEnd - x0), thick, 1);
    bo.material.opacity = tp < T1 ? 0.55 : Math.max(0.12, 0.55 - (tp - T1) * 0.6);
    bb.visible = tp >= T1;
    if (bb.visible) { const e = tp < 2 * T1 ? headX : x0; bb.position.set(e, 0, 0); bb.scale.set(Math.max(1e-3, x1 - e), thick * 1.3, 1); bb.material.opacity = 0.7; }
    this.head.visible = this.core.visible = headX != null;
    if (headX != null) { this.head.position.set(headX, 0, 0); this.core.position.set(headX, 0, 0); this.head.scale.setScalar(34 * wpp); this.core.scale.setScalar(10 * wpp); }
    this.flash = Math.max(0, this.flash - dt * 1.1); this.homeFlash = Math.max(0, this.homeFlash - dt * 1.2);
    this.hitW.material.opacity = this.flash; this.hitW.scale.setScalar((22 + 30 * this.flash) * wpp);
    this.station.material.opacity = tp < 0 ? 0.5 + 0.5 * Math.sin(this.ft * 9) : Math.max(0.25, this.homeFlash); this.station.scale.setScalar((16 + 30 * this.homeFlash) * wpp);
    // timer: the real time the light has been travelling
    if (this.stage === 'fire') this.$('.e-time').textContent = `${Math.max(0, Math.min(tp, 2 * T1)).toFixed(3)} s`;
    // labels
    const lab = (el, x, y) => { const v = new THREE.Vector3(x, y, 0).project(this.camW); el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`; };
    lab(this.$('.e-earth'), 0, RE / U * 2.4); lab(this.$('.e-moon'), this.D / U, RE / U * 1.6); lab(this.$('.e-dist'), this.D / U / 2, -RE / U * 1.9);
    // mirror: the green flash when the pulse arrives
    const f = this.flash;
    this.greenL.intensity = f * 3.2; this.trayGlow.material.opacity = Math.min(1, f * 1.4); this.trayHalo.material.opacity = f * 0.9; this.trayHalo.scale.setScalar(1.0 + f * 0.9);
    // draw: the wide view full screen, the mirror in its window
    r.setScissorTest(false); r.setViewport(0, 0, w, h); r.clear(); r.render(this.wide, this.camW);
    const box = this.$('.e-inset').getBoundingClientRect(), cr = this.canvas.getBoundingClientRect();
    if (box.width > 10 && this.stage === 'fire') {
      const ix = box.left - cr.left, iy = cr.bottom - box.bottom, iw = box.width, ih = box.height;
      this._mirrorCam(this.t, true); this.camM.aspect = iw / ih; this.camM.updateProjectionMatrix();
      r.setScissorTest(true); r.setScissor(ix, iy, iw, ih); r.setViewport(ix, iy, iw, ih); r.clear(); r.render(this.mir, this.camM); r.setScissorTest(false);
    }
  }

  _showResult() {
    const t = 2 * this.T1;
    this.$('.e-big').textContent = `${t.toFixed(3)} s`;
    this.$('.e-calc').innerHTML = `Half of that time × the speed of light ≈ <b>${fmtKm(this.L)} km</b>. That is how scientists measure the distance to the Moon, to within millimetres.`;
    this._setStage('result');
    this._caption('', '');
  }
}
