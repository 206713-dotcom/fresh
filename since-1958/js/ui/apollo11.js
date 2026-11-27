// "Apollo 11: Earth to the Moon" — a short film, shot by shot, from the launch pad to touchdown.
//
// Times, speeds and orbits in the captions are from NASA: the Apollo 11 timeline and summary in
// "Apollo by the Numbers" (NASA SP-4029), the Apollo 11 Mission Report (MSC-00171), the Apollo 11
// press kit and the NSSDCA record of the mission. The Saturn V, its launch tower and Launch Complex 39A
// are built by hand (scene/saturnv.js) to NASA's published sizes; the command and service module and the
// lunar module are the models of NASA 3D Resources; the Earth and the Moon wear NASA's own maps.
// The picture itself is a staging of those facts: camera positions, flames, smoke and clouds are ours.
//
// It has its own small renderer and runs only while it is open (the Solar System stops drawing).

import * as THREE from 'three';
import { Cine, dressEarth } from './cine.js';
import { perf, AdaptiveRatio } from './perf.js';
import { loadGLB } from '../scene/models.js';
import { saturnV, launchTower, padSite, SV } from '../scene/saturnv.js';

const RE = 6371, RM = 1737.4, MOON = new THREE.Vector3(384400, 0, 0);
const SUN = new THREE.Vector3(0.6, 0.6, 0.5).normalize();
// at touchdown the Sun stood 10.8° above the eastern horizon, so every shadow was long
const LOW_SUN = new THREE.Vector3(-Math.cos(10.8 * Math.PI / 180) * 0.77, Math.sin(10.8 * Math.PI / 180), -Math.cos(10.8 * Math.PI / 180) * 0.64).normalize();
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const seg = (u, a, b) => clamp((u - a) / (b - a));
const pad = (n) => String(Math.floor(n)).padStart(2, '0');
const fmtGET = (s) => { const neg = s < 0; s = Math.abs(s); return `T${neg ? '−' : '+'}${pad(s / 3600).padStart(3, '0')}:${pad((s % 3600) / 60)}:${pad(s % 60)}`; };
const LAUNCH = Date.UTC(1969, 6, 16, 13, 32, 0);
const fmtUTC = (s) => { const d = new Date(LAUNCH + s * 1000); return `${d.getUTCDate()} Jul 1969 · ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`; };
// the middle of each piece of the rocket (metres above the engine mouths): what it turns about when it tumbles away
const CY = { sic: 21, ring: 44.7, sii: 58, sivb: 78, sla: 89, csm: 96, les: 104 };
const KEEP = {};          // the rocket, the tower and the pad, built once and kept between showings
const altAt = (t) => (t > 0 ? 0.5 * 2.2 * t * t : 0);          // the first seconds of the climb: a gentle start, as the real thing

// ---- the shots: [id, chip label, seconds of film, mission time at start, at end (s), title, text, facts]
const H = 3600;
const SHOTS = [
  ['pad', 'On the pad', 12, -200, -10, 'Launch Complex 39A', 'The Saturn V stands on its mobile launcher at Kennedy Space Center, Florida, held by four arms and fed through nine swing arms from the red tower. Neil Armstrong, Michael Collins and Buzz Aldrin are in the small capsule at the very top. Cold oxygen boils off the tanks as white vapour.', ['Saturn V: 110.6 m (363 ft) tall', 'Launch tower: 116 m above the deck', 'Mobile launcher: 49 m by 41 m']],
  ['ignite', 'Lift-off', 15, -9, 22, 'Lift-off', 'The five engines of the first stage start 8.9 seconds before lift-off. At 13:32:00 UTC the Saturn V leaves Launch Complex 39A at Kennedy Space Center with Neil Armstrong, Michael Collins and Buzz Aldrin on board.', ['16 July 1969, 9:32 a.m. local time', 'Saturn V: 110.6 m tall']],
  ['climb', 'Climb', 11, 22, 150, 'Climbing east over the Atlantic', 'The rocket rolls onto its flight path and leans over as it climbs. The centre engine of the first stage shuts down at 2 min 15 s.', ['Roll to flight azimuth 72° finished at T+31 s']],
  ['sic', 'Stage 1 off', 13, 150, 185, 'First stage separation', 'The four outer engines cut off at 2 min 41.6 s, about 67 km up. The empty first stage (S-IC) drops away and the five engines of the second stage (S-II) light at 2 min 44 s.', ['S-IC cutoff T+02:41.6', 'S-II ignition T+02:44']],
  ['les', 'Tower off', 11, 185, 215, 'Interstage ring and escape tower', 'The ring between the stages is dropped at 3 min 12 s. Five seconds later the launch escape tower, no longer needed, is fired away from the tip of the spacecraft.', ['Interstage jettison T+03:12.3', 'Escape tower jettison T+03:17.9']],
  ['sii', 'Stage 2 off', 13, 520, 712, 'Second stage separation, into orbit', 'The second stage shuts down at 9 min 8 s and falls away. The single engine of the third stage (S-IVB) fires and, at 11 min 50 s, Apollo 11 is in orbit around the Earth.', ['S-II cutoff T+09:08', 'S-IVB ignition T+09:12', 'Parking orbit 100.7 × 99.2 nautical miles']],
  ['orbit', 'Earth orbit', 12, 712, 2 * H + 44 * 60, 'One and a half times around the Earth', 'For about two and a half hours the crew and Mission Control check every system. The third stage is still attached: it has one more job to do.', ['1.5 orbits of the Earth']],
  ['tli', 'To the Moon', 13, 2 * H + 44 * 60 + 16, 2 * H + 50 * 60 + 13, 'Translunar injection', 'At 2 h 44 min 16 s the third stage fires again, for 5 minutes 47 seconds. It pushes Apollo 11 out of Earth orbit and onto a path to the Moon.', ['Burn: 346.83 s', 'Speed at injection: 35,545.6 ft/s (10.8 km/s)']],
  ['tde', 'Docking', 26, 3 * H + 15 * 60 + 23, 3 * H + 30 * 60, 'Transposition and docking', 'The command and service module Columbia separates from the third stage, and the four panels that covered the lunar module are thrown off. Columbia drifts about 70 feet away, turns around, and docks nose-first with the lunar module Eagle at 3 h 24 min. Then it pulls Eagle free of the empty stage.', ['CSM separation T+003:15:23', 'Docking T+003:24:03.7']],
  ['coast', 'Coast', 14, 4 * H + 40 * 60, 75 * H + 49 * 60, 'Three days of coasting', 'The engines are off. Earth shrinks behind and the Moon grows ahead. Only one small course correction is needed, about 27 hours into the flight.', ['Translunar coast: 73 h 5 min 35 s']],
  ['loi', 'Lunar orbit', 13, 75 * H + 49 * 60 + 50, 75 * H + 55 * 60 + 48, 'Lunar orbit insertion', 'Behind the Moon, out of contact with Earth, Columbia fires its main engine against the direction of flight for 357.5 seconds. Apollo 11 is now in orbit around the Moon.', ['19 July 1969, 17:21:50 UTC', 'First orbit: 169.7 × 60.0 nautical miles']],
  ['undock', 'Undocking', 12, 100 * H + 12 * 60, 100 * H + 40 * 60, 'Eagle undocks', 'Armstrong and Aldrin are in the lunar module. At 100 h 12 min Eagle separates from Columbia, where Collins stays behind in orbit.', ['Undocking T+100:12:00', 'Altitude 62.9 nautical miles']],
  ['descent', 'Descent', 15, 101 * H + 36 * 60 + 14, 102 * H + 44 * 60, 'Powered descent', 'A 30-second burn drops the low point of Eagle\'s orbit to 7.8 nautical miles. From there, at 102 h 33 min 5 s, the descent engine fires for the landing: a burn of 756 seconds.', ['Descent orbit insertion T+101:36:14', 'Powered descent start T+102:33:05']],
  ['land', 'Landing', 17, 102 * H + 44 * 60 + 5, 102 * H + 45 * 60 + 50, 'The Eagle has landed', 'Armstrong flies the last part by hand to clear a crater. Eagle touches down in the Sea of Tranquility at 20:17:39 UTC on 20 July 1969, 102 hours 45 minutes 39.9 seconds after lift-off. The descent stage you see here is still there today.', ['Landing T+102:45:39.9', '"Houston, Tranquility Base here - the Eagle has landed."']],
];

function canvasTexture(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return new THREE.CanvasTexture(c); }
function glowTexture() {
  return canvasTexture(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
}
/** a soft, lumpy puff of smoke */
let _puff = null, _mt = {};
function puffTexture() {
  return _puff || (_puff = canvasTexture(128, 128, (x) => { let s = 4; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 26; i++) { const cx = 64 + (r() - 0.5) * 56, cy = 64 + (r() - 0.5) * 56, q = 16 + r() * 26, g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, 'rgba(255,255,255,0.33)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); } const g2 = x.createRadialGradient(64, 64, 30, 64, 64, 64); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = g2; x.fillRect(0, 0, 128, 128); }));
}
function gradTexture(stops) { const t = canvasTexture(8, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); for (const [o, col] of stops) g.addColorStop(o, col); x.fillStyle = g; x.fillRect(0, 0, w, h); }); t.colorSpace = THREE.SRGBColorSpace; return t; }
/** the Moon's ground: grey dust, a scatter of craters lit from one side, small stones. fine = the close-up version */
function moonTexture(fine) {
  if (_mt[fine]) return _mt[fine];
  const t = _mt[fine] = canvasTexture(1024, 1024, (g, w) => {
    let s = fine ? 15 : 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.fillStyle = '#827f7a'; g.fillRect(0, 0, w, w);
    for (let i = 0; i < 900; i++) { const cx = rnd() * w, cy = rnd() * w, q = 20 + rnd() * 120, v = rnd() < 0.5 ? '70,68,65' : '165,162,156'; for (const dx of [-w, 0, w]) for (const dy of [-w, 0, w]) { const gr = g.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, q); gr.addColorStop(0, `rgba(${v},0.14)`); gr.addColorStop(1, `rgba(${v},0)`); g.fillStyle = gr; g.fillRect(cx + dx - q, cy + dy - q, q * 2, q * 2); } }
    const n = fine ? 420 : 2200;
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * w, r = fine ? 2 + rnd() * rnd() * 15 : 1 + rnd() * rnd() * 24;
      g.fillStyle = `rgba(38,36,34,${0.16 + rnd() * 0.2})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      g.fillStyle = `rgba(20,19,18,${0.2 + rnd() * 0.2})`; g.beginPath(); g.arc(x - r * 0.22, y, r * 0.72, 0, 7); g.fill();                    // the shadowed inner wall, on the side the Sun comes from
      g.strokeStyle = `rgba(222,218,210,${0.16 + rnd() * 0.2})`; g.lineWidth = Math.max(1, r * 0.2); g.beginPath(); g.arc(x, y, r, -1.1, 1.1); g.stroke();   // the lit far rim
    }
    for (let i = 0; i < (fine ? 5000 : 1500); i++) { const v = rnd() < 0.5 ? 40 : 200; g.fillStyle = `rgba(${v},${v},${v - 4},${0.12 + rnd() * 0.25})`; g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}

// Clouds drawn by the graphics card itself, so they stay sharp however close the camera flies: a thin shell just above the sea.
const CLOUD_V = /* glsl */`varying vec3 vP; varying vec3 vW; void main() { vP = position; vW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const CLOUD_F = /* glsl */`uniform vec3 uSun; uniform float uFade; varying vec3 vP; varying vec3 vW;
float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1, 0, 0)), f.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), f.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }
void main() { vec3 p = normalize(vP); float big = fbm(p * 34.0), n = fbm(p * 210.0 + big * 2.0), fine = fbm(p * 1700.0 + n);
  float d = smoothstep(0.47, 0.7, n * 0.78 + big * 0.36 + fine * 0.2 - 0.07);
  float day = smoothstep(-0.15, 0.3, dot(normalize(vW), uSun));
  vec3 col = mix(vec3(0.6, 0.65, 0.72), vec3(1.0), smoothstep(0.15, 0.9, d)) * (0.012 + 1.25 * day);
  gl_FragColor = vec4(col, d * uFade * 0.96); }`;
// The daytime sky over the pad: pale at the horizon, deep blue overhead, a bright Sun with a soft glare round it.
const SKY_F = /* glsl */`uniform vec3 uSun; uniform float uK; varying vec3 vD;
void main() { vec3 d = normalize(vD); float h = max(d.y, 0.0); vec3 hor = vec3(0.72, 0.84, 0.96), zen = vec3(0.1, 0.3, 0.72);
  vec3 c = mix(hor, zen, pow(h, 0.5)); c = mix(c, hor * 0.92, smoothstep(0.0, -0.06, d.y));
  float s = max(dot(d, normalize(uSun)), 0.0); c += vec3(1.0, 0.92, 0.75) * (pow(s, 900.0) * 14.0 + pow(s, 40.0) * 0.5 + pow(s, 5.0) * 0.14);
  gl_FragColor = vec4(c, uK); }`;

export class Apollo11Film {
  constructor() { this.isOpen = false; this.t = 0; this.speed = 1; this.playing = true; }

  open() {
    if (this.isOpen) return;
    this.isOpen = true; this.t = 0; this.playing = true; this.speed = 1; this.ready = false; this.loaded = false; this.warming = false; this._shown = -1; this.endT = 0;
    this._w = this._h = this._dpr = 0;   // a fresh canvas every time: size it and build the cinema layer again
    const root = this.root = document.createElement('div'); root.id = 'a11';
    root.innerHTML = `<canvas></canvas>
      <header class="a-top"><div><p class="a-kicker">Apollo 11 · 16 to 20 July 1969</p><h2>Earth to the Moon</h2></div>
        <span class="a-right"><button class="a-skip" data-act="skip" title="Skip to the landing ( Tab )">Skip</button><button class="a-exit" data-act="close" aria-label="Close the film" title="Close ( Esc )">✕</button></span></header>
      <button class="a-capx" data-act="cap" aria-label="Hide the text" title="Hide the text ( T )">×</button><section class="a-cap"><button class="a-capx in" data-act="cap" aria-label="Hide the text" title="Hide the text ( T )">×</button><p class="a-clock"><b class="a-get"></b><span class="a-utc"></span></p><h3></h3><p class="a-text"></p><ul class="a-facts"></ul></section>
      <footer class="a-bar">
        <div class="a-ctl"><button data-act="prev" title="Previous scene ( ← )">⏮︎</button><button data-act="play" class="a-play" title="Play or pause ( Space )">⏸︎</button><button data-act="next" title="Next scene ( → )">⏭︎</button>
          <button data-act="speed" class="a-speed" title="Film speed">1×</button><span class="a-load">Building the rocket and the pad…</span></div>
        <div class="a-chips">${SHOTS.map((s, i) => `<button data-act="go" data-i="${i}">${i + 1}. ${s[1]}</button>`).join('')}</div>
        <div class="a-prog"><i></i></div>
      </footer>`;
    document.body.appendChild(root);
    try { if (localStorage.getItem('anf-nocap') === '1') root.classList.add('nocap'); } catch (er) { /* ignore */ }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'cap') { this.root.classList.toggle('nocap'); try { localStorage.setItem('anf-nocap', this.root.classList.contains('nocap') ? '1' : '0'); } catch (er) { /* ignore */ } return; } if (a === 'close') this.close(); else if (a === 'skip') this._finish(); else if (a === 'play') this._toggle(); else if (a === 'prev') this._jump(-1); else if (a === 'next') this._jump(1);
      else if (a === 'go') this._seek(this.starts[+b.dataset.i]); else if (a === 'speed') { this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 0.5 : 1; b.textContent = `${this.speed}×`; }
    });
    root.querySelector('.a-prog').addEventListener('pointerdown', (e) => { const r = e.currentTarget.getBoundingClientRect(); this._seek(clamp((e.clientX - r.left) / r.width) * this.total); });
    this._key = (e) => {
      if (!this.isOpen) return;
      const k = e.key;
      if (k === 't' || k === 'T') { this.root.classList.toggle('nocap'); } else if (k === 'Escape') this.close(); else if (k === ' ') this._toggle(); else if (k === 'ArrowRight') this._jump(1); else if (k === 'ArrowLeft') this._jump(-1); else return;
      e.preventDefault(); e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', this._key, true);
    this.starts = []; let acc = 0; for (const s of SHOTS) { this.starts.push(acc); acc += s[2]; } this.total = acc;
    // Building the rocket and the pad takes a moment of the page's time: let the "Building…" note reach the screen first.
    const ticket = this.ticket = {};
    requestAnimationFrame(() => requestAnimationFrame(() => { if (this.isOpen && this.ticket === ticket) { this._build(); this._loop(); } }));
  }
  _loop() {
    let last = performance.now();
    const r = this.renderer;
    const loop = (now) => {
      if (!this.isOpen || this.renderer !== r) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now; this._dt = dt;
      if (this.ready && this.playing) this.t = Math.min(this.total - 0.001, this.t + dt * this.speed);
      // the last picture stays for a moment, then the film hands over to the simulation
      if (this.ready && this.playing && this.t >= this.total - 0.002) { this.endT = (this.endT || 0) + dt; if (this.endT > 2.5) { this._finish(); return; } } else this.endT = 0;
      this._frame(now / 1000);
    };
    this.raf = requestAnimationFrame(loop);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf); window.removeEventListener('keydown', this._key, true); this.ticket = null;
    if (this.renderer) {                                   // (it may be closed before it was ever built)
      for (const k of ['rocket', 'tower', 'site']) if (KEEP[k]) KEEP[k].removeFromParent();      // kept for next time
      for (const sc of [this.fg, this.bg]) sc.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      if (this.cine) { this.cine.dispose(); this.cine = null; }
      this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer = null;
    }
    this.root.remove();
    if (this.onClose) this.onClose();
  }
  /** The film is over (or was skipped): close it and tell the page, which goes to the landing. */
  _finish() { const f = this.onFinish; this.finishing = true; this.close(); this.finishing = false; if (f) f(); }
  _toggle() { this.playing = !this.playing; if (this.t >= this.total - 0.01 && this.playing) this.t = 0; this.root.querySelector('.a-play').textContent = this.playing ? '⏸︎' : '▶︎'; }
  _seek(t) { this.t = clamp(t, 0, this.total - 0.001); }
  _jump(d) { const i = this._index(); this._seek(this.starts[clamp(d > 0 ? i + 1 : (this.t - this.starts[i] > 1.5 ? i : i - 1), 0, SHOTS.length - 1)]); }
  _index() { let i = SHOTS.length - 1; while (i > 0 && this.t < this.starts[i]) i--; return i; }

  // ------------------------------------------------------------------ the set
  _build() {
    const canvas = this.root.querySelector('canvas');
    // edges are smoothed inside the film layer's own buffer (4 samples), so the screen buffer itself needs none
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    r.autoClear = false; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.shadowMap.autoUpdate = false; r.info.autoReset = false; this.adapt = new AdaptiveRatio(); this.shF = 4;      // shadows: see _frame
    // far things (Earth, Moon, stars) in kilometres; near things (the spacecraft, the pad) in metres
    const bg = this.bg = new THREE.Scene(); bg.background = new THREE.Color(0x000000);
    this.bgCam = new THREE.PerspectiveCamera(50, 1, 0.5, 3e6);
    const fg = this.fg = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(50, 1, 0.5, 90000);
    const tl = new THREE.TextureLoader(), tex = (u) => { const t = tl.load(u); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; };
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(RE, 192, 96), new THREE.MeshPhongMaterial({ map: tex('textures/earth_day_4k.jpg'), specularMap: tl.load('textures/earth_spec.jpg'), specular: new THREE.Color(0x4a4a44), shininess: 26 }));
    // turn the globe so that Kennedy Space Center (28.6° N, 80.6° W) is straight "up" under the pad
    const la = 28.6 * Math.PI / 180, lo = -80.6 * Math.PI / 180;
    this.earth.quaternion.setFromUnitVectors(new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)), new THREE.Vector3(0, 1, 0));
    bg.add(this.earth);
    this.dress = dressEarth(this.earth, RE, SUN);
    this.cloud = new THREE.Mesh(new THREE.SphereGeometry(RE * 1.0008, 192, 96), new THREE.ShaderMaterial({ vertexShader: CLOUD_V, fragmentShader: CLOUD_F, uniforms: { uSun: { value: SUN.clone() }, uFade: { value: 1 } }, transparent: true, depthWrite: false }));
    this.cloud.renderOrder = 1; this.earth.add(this.cloud);
    this.air = new THREE.Mesh(new THREE.SphereGeometry(RE * 1.012, 96, 48), new THREE.MeshBasicMaterial({ color: 0x6fb0ff, transparent: true, opacity: 0.22, side: THREE.BackSide, depthWrite: false })); bg.add(this.air);
    // the Moon: NASA's map, with a finer grain of craters added so that it holds up from low orbit
    { const det = moonTexture(false), mm = new THREE.MeshLambertMaterial({ map: tex('textures/moon_4k.jpg') });
      mm.onBeforeCompile = (sh) => { sh.uniforms.uDet = { value: det }; sh.fragmentShader = sh.fragmentShader.replace('uniform vec3 diffuse;', 'uniform vec3 diffuse; uniform sampler2D uDet;').replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb *= (0.6 + 0.8 * texture2D(uDet, vMapUv * vec2(40.0, 20.0)).g) * (0.8 + 0.4 * texture2D(uDet, vMapUv * vec2(331.0, 167.0)).g);'); };
      this.moon = new THREE.Mesh(new THREE.SphereGeometry(RM, 192, 96), mm); this.moon.position.copy(MOON); bg.add(this.moon); }
    const sunB = new THREE.DirectionalLight(0xffffff, 3.2); sunB.position.copy(SUN); bg.add(sunB); bg.add(new THREE.AmbientLight(0xffffff, 0.05));
    let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    { const N = 5200, sp = new Float32Array(N * 3), sc = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.2832, q = Math.sqrt(1 - u * u), b = 0.12 + Math.pow(rnd(), 4) * 0.9, w = rnd(); sp[i * 3] = q * Math.cos(a); sp[i * 3 + 1] = u; sp[i * 3 + 2] = q * Math.sin(a); sc[i * 3] = b * (w < 0.2 ? 1 : 0.88); sc[i * 3 + 1] = b * 0.92; sc[i * 3 + 2] = b * (w > 0.75 ? 1 : 0.86); }
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
      this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ vertexColors: true, size: 1.7, sizeAttenuation: false, transparent: true, depthTest: false })); this.stars.scale.setScalar(2e6); bg.add(this.stars); }
    // the near world: one Sun that casts shadows, and light from the sky
    this.sunF = new THREE.DirectionalLight(0xfff6e8, 3.0); fg.add(this.sunF); fg.add(this.sunF.target);
    this.sunF.castShadow = true; this.sunF.shadow.mapSize.set(4096, 4096); this.sunF.shadow.bias = -0.0004; Object.assign(this.sunF.shadow.camera, { near: 50, far: 1400 });
    this.hemi = new THREE.HemisphereLight(0xbfd4ff, 0x39342c, 0.55); fg.add(this.hemi);
    this.fog = new THREE.Fog(0xb9cfe6, 1800, 52000); fg.fog = this.fog;
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(70000, 32, 16), new THREE.ShaderMaterial({ uniforms: { uSun: { value: SUN.clone() }, uK: { value: 1 } }, vertexShader: 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: SKY_F, side: THREE.BackSide, transparent: true, depthWrite: false, fog: false }));
    this.dome.renderOrder = -10; this.dome.frustumCulled = false; fg.add(this.dome);
    // a few far clouds low on the horizon
    const pt = this.puffT = puffTexture();
    this.skyClouds = new THREE.Group(); fg.add(this.skyClouds);
    for (let i = 0; i < 26; i++) { const a = rnd() * 6.283, d = 9000 + rnd() * 22000, sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: pt, color: 0xffffff, transparent: true, opacity: 0.2 + rnd() * 0.22, depthWrite: false, fog: false })); sp.position.set(Math.cos(a) * d, 1400 + rnd() * 2600, Math.sin(a) * d); sp.scale.set(3600 + rnd() * 5200, 420 + rnd() * 420, 1); this.skyClouds.add(sp); }
    // ---- Launch Complex 39A
    this.padG = new THREE.Group(); fg.add(this.padG);
    const tower = KEEP.tower || (KEEP.tower = launchTower()); this.padG.add(tower); this.arms = tower.userData.arms; this.masts = tower.userData.masts;
    const site = KEEP.site || (KEEP.site = padSite()); this.padG.add(site); this.YG = site.userData.YG;
    for (const m of [...site.userData.far.children]) if (m.material && m !== site.userData.far.children[0]) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -8; }
    // ---- the Moon's ground for the last seconds: a wide plain, a sharper patch under the lander, stones
    this.moonG = new THREE.Group(); fg.add(this.moonG);
    { const wide = new THREE.Mesh(new THREE.CircleGeometry(30000, 64), new THREE.MeshStandardMaterial({ map: moonTexture(false), roughness: 1, metalness: 0 })); wide.material.map.repeat.set(170, 170); wide.rotation.x = -Math.PI / 2; wide.receiveShadow = true; this.moonG.add(wide);
      const ft = moonTexture(true); ft.repeat.set(7, 7); ft.rotation = 0.5; const near = new THREE.Mesh(new THREE.CircleGeometry(220, 64), new THREE.MeshStandardMaterial({ map: ft, bumpMap: ft, bumpScale: 1.6, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -6 })); near.rotation.x = -Math.PI / 2; near.receiveShadow = true; this.moonG.add(near);
      const rk = new THREE.MeshStandardMaterial({ color: 0x7d7a75, roughness: 1, flatShading: true });
      for (let i = 0; i < 150; i++) { const a = rnd() * 6.283, d = 6 + rnd() * 80, q = 0.05 + Math.pow(rnd(), 3) * 0.7, m = new THREE.Mesh(new THREE.DodecahedronGeometry(q, 0), rk); m.position.set(Math.cos(a) * d, q * 0.3, Math.sin(a) * d); m.rotation.set(a, a * 2, a * 3); m.scale.y = 0.6; m.castShadow = m.receiveShadow = true; this.moonG.add(m); } }
    // ---- flames
    const glow = this.glow = glowTexture();
    const hot = gradTexture([[0, 'rgba(60,26,10,0.9)'], [0.06, 'rgba(255,160,60,1)'], [0.2, 'rgba(255,244,205,1)'], [0.55, 'rgba(255,190,90,0.8)'], [1, 'rgba(255,120,30,0)']]), soft = gradTexture([[0, 'rgba(60,25,10,0.5)'], [0.1, 'rgba(255,150,50,0.9)'], [0.5, 'rgba(255,120,40,0.5)'], [1, 'rgba(200,80,20,0)']]);
    const blue = gradTexture([[0, 'rgba(200,225,255,0.9)'], [0.12, 'rgba(140,180,255,0.4)'], [1, 'rgba(120,160,255,0)']]), pale = gradTexture([[0, 'rgba(255,240,220,0.8)'], [0.3, 'rgba(255,200,170,0.25)'], [1, 'rgba(255,180,150,0)']]);
    this.flames = {};
    /** a flame under `parent` at height y: one plume per [x, z] in `at`, each a bright core inside a wider, softer one */
    const flame = (name, parent, y, at, rad, len, core, outer, gain, glowCol) => {
      const g = new THREE.Group(); g.position.y = y; g.userData.isFlame = true;
      const cone = (r1, r2, L, t, op, k) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, L, 20, 1, true), new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(k, k, k), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.position.y = -L / 2; m.frustumCulled = false; return m; };
      for (const [x, z] of at) { const p = new THREE.Group(); p.position.set(x, 0, z); p.add(cone(rad, rad * 2.2, len, outer, 0.7, gain), cone(rad * 0.7, rad * 0.5, len * 0.62, core, 1, gain * 1.6)); g.add(p); }
      if (at.length > 1) { const R0 = Math.max(...at.map(([x, z]) => Math.hypot(x, z))) + rad; g.add(cone(R0, R0 * 2.3, len * 1.7, outer, 0.3, gain * 0.55)); }        // the plumes merge into one
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: glowCol, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.scale.setScalar(rad * 9); s.position.y = -rad; g.add(s);
      parent.add(g); this.flames[name] = g; return g;
    };
    // ---- smoke, steam and dust: soft puffs moved by the clock, so the film can be played from any point
    this.puffs = []; for (let i = 0; i < 190; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: pt, transparent: true, depthWrite: false, fog: false, rotation: rnd() * 6.28 })); sp.visible = false; fg.add(sp); this.puffs.push({ sp, r: [rnd(), rnd(), rnd(), rnd(), rnd(), rnd()] }); }
    { const N = 420, g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); this.iceSeed = []; for (let i = 0; i < N; i++) this.iceSeed.push([rnd() * 6.283, 18 + rnd() * 66, rnd() * 7 - 1.5, 5.1 + rnd() * 0.6, rnd()]);
      this.ice = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.55, transparent: true, opacity: 0.95, fog: false })); this.ice.frustumCulled = false; this.ice.visible = false; fg.add(this.ice); }
    this.glowL = new THREE.PointLight(0xffa860, 0, 0, 2); this.glowL.position.set(0, -6, 0); fg.add(this.glowL);
    // ---- the vehicles: the Saturn V built by hand, in the pieces that come apart; the spacecraft from NASA 3D Resources
    this.stack = new THREE.Group(); fg.add(this.stack);
    const rocket = KEEP.rocket || (KEEP.rocket = saturnV()), d = rocket.userData; this.stack.add(rocket);
    for (const k of ['s1', 's2', 's4b']) for (const c of [...d[k].children]) if (c.userData.isFlame) d[k].remove(c);      // last showing's flames
    this.sec = { sic: d.s1, ring: d.ring, sii: d.s2, sivb: d.s4b, sla: d.sla, csm: d.csm, les: d.les };
    const five = (r) => [0, 1, 2, 3, 4].map((k) => { const a = k * Math.PI / 2 + Math.PI / 4, q = k < 4 ? r : 0; return [Math.cos(a) * q, Math.sin(a) * q]; });
    flame('f1', this.sec.sic, 0.3, five(SV.engR), 1.8, 78, hot, soft, 1.9, 0xffb060);
    flame('f2', this.sec.sii, SV.j2Y, five(SV.j2R), 1.0, 30, blue, blue, 1.2, 0x9fc8ff);
    flame('f3', this.sec.sivb, SV.j2Top, [[0, 0]], 1.0, 30, blue, blue, 1.4, 0x9fc8ff);
    this.csm = new THREE.Group(); this.lm = new THREE.Group(); this.ship = new THREE.Group(); fg.add(this.ship);
    const shadows = (o) => o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    Promise.all([loadGLB('apollosoyuz'), loadGLB('lmfull'), loadGLB('lm')]).then(([as, lmFull, lmDesc]) => {
      if (!this.isOpen) return;
      // Columbia: the Apollo half of NASA's Apollo-Soyuz model. Nose at the origin, engine toward -y.
      const keep = []; as.updateWorldMatrix(true, true); const bb = new THREE.Box3();
      as.traverse((o) => { if (o.isMesh) { bb.setFromObject(o); if (bb.max.x > -0.4) keep.push(o); } });
      for (const o of keep) o.removeFromParent();
      as.scale.setScalar(0.93); as.rotation.z = Math.PI / 2; as.position.y = 0.42 * 0.93; this.csm.add(as); shadows(as);
      flame('sps', this.csm, -11.2, [[0, 0]], 0.9, 16, pale, pale, 1.1, 0xbfd8ff);
      this.lmFull = lmFull; this.lmDesc = lmDesc; this.lm.add(lmFull); this.lm.add(lmDesc); lmDesc.visible = false; shadows(lmFull);
      flame('dps', this.lm, 1.2, [[0, 0]], 0.55, 9, pale, pale, 0.9, 0xffd9a0);
      this.loaded = true;
    }).catch((e) => { console.warn('Apollo 11 film: models failed', e); const l = this.root.querySelector('.a-load'); if (l) l.textContent = 'The 3D models could not be loaded.'; });
  }

  // ------------------------------------------------------------------ one frame
  _frame(now) {
    const canvas = this.renderer.domElement, w = canvas.clientWidth, h = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) {
      this._w = w; this._h = h; this._dpr = dpr;
      this.prFull = Math.max(1, Math.min(dpr, Math.sqrt(2.6e6 / (w * h)))); this.renderer.setPixelRatio(this.adapt.ratio(this.prFull)); this.renderer.setSize(w, h, false);
      if (!this.cine) { this.cine = new Cine(this.renderer, this.root, this.bg, this.bgCam, this.fg, this.cam); if (this.cine.bloom) { this.cine.bloom.threshold = 1.55; this.cine.bloom.strength = 0.42; this.cine.bloom.radius = 0.5; } }
      this.cine.setSize(w, h, this.renderer.getPixelRatio());
      // the caption sits on the left, so the picture is centred a little to the right of the middle
      for (const c of [this.cam, this.bgCam]) { c.aspect = w / h; if (w > 900) c.setViewOffset(w, h, -w * 0.11, 0, w, h); else c.clearViewOffset(); c.updateProjectionMatrix(); }
    }
    // once the models are in and the picture has a size, let the graphics card prepare every material in the background
    if (this.loaded && !this.ready && !this.warming && this.cine) {
      this.warming = true; const r = this.renderer, shown = [];
      for (const sc of [this.fg, this.bg]) sc.traverse((o) => { if (!o.visible) { shown.push(o); o.visible = true; } });
      const go = () => { if (this.renderer !== r || this.ready) return; this.ready = true; const l = this.root.querySelector('.a-load'); if (l) l.remove(); };
      try { if (this.cine.composer) r.setRenderTarget(this.cine.composer.renderTarget1); const p = Promise.all([r.compileAsync(this.fg, this.cam), r.compileAsync(this.bg, this.bgCam)]); r.setRenderTarget(null);
        // then the pictures go to the graphics card a few at a time, so the page never stops for long
        const up = () => { const tex = new Set(); for (const sc of [this.fg, this.bg]) sc.traverse((o) => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of ms) { for (const k of ['map', 'bumpMap', 'roughnessMap', 'specularMap', 'emissiveMap', 'alphaMap']) if (m[k] && m[k].isTexture) tex.add(m[k]); if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u && u.value && u.value.isTexture) tex.add(u.value); } });
          const list = [...tex], step = () => { if (this.renderer !== r) return; const t0 = performance.now(); while (list.length && performance.now() - t0 < 12) { try { r.initTexture(list.pop()); } catch (er) { /* on first use instead */ } } if (list.length) requestAnimationFrame(step); else go(); }; requestAnimationFrame(step); };
        p.then(up, up); setTimeout(go, 30000); } catch (e) { r.setRenderTarget(null); go(); }
      for (const o of shown) o.visible = false;
    }
    if (this.ready && this.cine && w && h && this.adapt.tick(this._dt || 0)) { this.renderer.setPixelRatio(this.adapt.ratio(this.prFull)); this.renderer.setSize(w, h, false); this.cine.setSize(w, h, this.renderer.getPixelRatio()); }
    const i = this._index(), shot = SHOTS[i], u = clamp((this.t - this.starts[i]) / shot[2]);
    if (this._shown !== i) {
      this._shown = i; this.shF = 4; const $ = (s) => this.root.querySelector(s);
      { const cp = this.root.querySelector('.a-cap'); cp.classList.remove('swap'); void cp.offsetWidth; cp.classList.add('swap'); if (this.cine) this.cine.cut(); }
      $('.a-cap h3').textContent = shot[5]; $('.a-text').textContent = shot[6]; $('.a-facts').innerHTML = shot[7].map((f) => `<li>${f.replace(/</g, '&lt;')}</li>`).join('');
      this.root.querySelectorAll('.a-chips button').forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    }
    const get = lerp(shot[3], shot[4], u);
    this.root.querySelector('.a-get').textContent = fmtGET(get); this.root.querySelector('.a-utc').textContent = fmtUTC(get);
    this.root.querySelector('.a-prog i').style.width = `${(this.t / this.total * 100).toFixed(2)}%`;
    if (this.ready) this._stage(shot[0], u, get, now);
    // the camera trembles while the big engines burn close by
    const sh = shot[0] === 'ignite' ? Math.min(1, Math.max(0, (u - 0.25) * 4)) * (1 - u * 0.5) : shot[0] === 'climb' ? 0.25 : (shot[0] === 'tli' || shot[0] === 'loi' || shot[0] === 'descent') ? 0.08 : 0;
    // Shadows are redrawn only while something moves that casts one: on the pad nothing does until the engines light.
    if (this.shF > 0 || shot[0] !== 'pad') { this.renderer.shadowMap.needsUpdate = true; if (this.shF > 0) this.shF--; }
    this.renderer.info.reset(); perf.gpuBegin(this.renderer);
    if (this.cine) this.cine.render(this.ready, sh, this._dt);
    perf.gpuEnd(this.renderer);
    perf.frame(this._dt || 0, this.renderer, 'apollo 11 film');
  }

  /** Put everything where it belongs for shot `id` at fraction u (0..1). A pure function of u, so the film can be scrubbed. */
  _stage(id, u, get, now) {
    const { sec, stack, csm, lm, ship, cam } = this, F = this.flames, fl = 0.9 + 0.1 * Math.sin(now * 47) + 0.06 * Math.sin(now * 91);
    // ---- defaults: everything attached, everything quiet
    for (const k in sec) { sec[k].visible = true; sec[k].position.set(0, 0, 0); sec[k].rotation.set(0, 0, 0); }
    for (const p of sec.sla.children) { p.position.set(0, SV.iuTop, 0); p.rotation.set(0, 0, 0); p.visible = true; }
    for (const k in F) F[k].visible = false;
    stack.visible = true; stack.position.set(0, 0, 0); stack.rotation.set(0, 0, 0);
    ship.visible = false; this.ice.visible = false; this.glowL.intensity = 0; this.pn = 0; this.ventOn = false;
    this.padG.visible = false; this.dome.visible = false; this.skyClouds.visible = false; this.moonG.visible = false;
    this.lmFull.visible = true; this.lmDesc.visible = false;
    if (csm.parent !== ship) ship.add(csm); if (lm.parent !== ship) ship.add(lm);
    csm.position.set(0, 0, 0); csm.rotation.set(0, 0, 0); lm.position.set(0, 0, 0); lm.rotation.set(0, 0, 0); ship.position.set(0, 0, 0); ship.rotation.set(0, 0, 0);
    const burn = (name, k = 1, wide = 1) => { const f = F[name]; f.visible = k > 0.01; const w = wide * (0.92 + 0.08 * fl); f.scale.set(w, k * fl, w); };
    // a piece falls d metres, drifts `side` and tumbles about its own middle
    const drop = (name, d, tumble = 0, side = 0, up = 0) => { const cy = CY[name]; sec[name].rotation.z = tumble; sec[name].position.set(side + cy * Math.sin(tumble), up - d + cy * (1 - Math.cos(tumble)), 0); };
    const docked = () => { ship.visible = true; lm.position.set(0, 0, 0); csm.rotation.z = Math.PI; csm.position.y = 7.25; };   // Eagle below, Columbia nose-down on top of it
    // where the camera's "local" frame sits among the Earth and Moon: P (km) and its tilt th around z
    let P = new THREE.Vector3(0, RE, 0), th = 0, camPos = new THREE.Vector3(0, 60, 400), look = new THREE.Vector3(0, 55, 0), fov = 50, sky = 1, body = 'earth', tilt = 0;
    let shR = 60, shC = null, near = 0.5;                     // how wide the shadows reach, and round what
    let lowSun = false;                                       // Tranquility Base: the Sun only 10.8° above the horizon
    const orbitAt = (alt, a, c = RE) => { th = a; P.set(Math.sin(a), Math.cos(a), 0).multiplyScalar(c + alt); };
    const onPad = (alt, t) => {
      this.padG.visible = true; this.padG.position.y = -alt; this.dome.visible = this.skyClouds.visible = true; this.skyClouds.position.y = -alt;
      this.arms.forEach((a) => { a.rotation.y = a.userData.i === 8 ? 1.25 : 1.25 * ease(t / 2.6); });           // the crew's walkway is already back; the rest swing clear as the rocket moves
      this.masts.forEach((m) => { m.children[0].rotation.z = 1.05 * ease(t / 1.3); });
      this._vent(now, alt, t); shR = 150; near = 1;
    };

    if (id === 'pad') {
      onPad(0, get); const a = ease(u);
      camPos.set(lerp(205, 122, a), lerp(-9.5, 66, a), lerp(250, 150, a)); look.set(-7, lerp(36, 60, a), 0); fov = lerp(44, 38, a); P.set(0, RE, 0); sky = 1; shC = V(0, 45, 0);
    } else if (id === 'ignite') {
      const alt = altAt(get);
      onPad(alt, get);
      const thr = get < -6 ? 0 : clamp((get + 6) / 3);
      burn('f1', thr * lerp(0.45, 1.05, clamp(alt / 300)), 1); this.glowL.intensity = thr * 5.5e4 * fl * (1 - clamp(alt / 400));
      this._smoke(get, alt, thr); this._ice(get, alt);
      const a = ease(seg(u, 0, 1));
      camPos.set(lerp(260, 520, a), lerp(-alt + 6, 40, a), lerp(330, 420, a)); look.set(0, lerp(52, 30, a), 0); fov = lerp(46, 40, a);
      P.set(0, RE + alt / 1000, 0); sky = 1; shC = V(0, 50, 0);
    } else if (id === 'climb') {
      const alt = lerp(600, 60000, u * u), tip = lerp(0.02, 0.9, ease(u)); stack.rotation.z = -tip;
      burn('f1', 1.15 + u * 0.9, 1 + u * 1.6);
      this.padG.visible = alt < 9000; this.padG.position.y = -alt; this.dome.visible = true; this.skyClouds.visible = alt < 9000; this.skyClouds.position.y = -alt;
      this._trail(tip, u);
      camPos.set(lerp(240, 420, u), lerp(-160, -60, u), lerp(360, 300, u)); look.set(30, 40, 0); fov = 44;
      orbitAt(alt / 1000, u * 0.012); sky = clamp(1 - alt / 45000); shR = 90; shC = V(30, 40, 0);
    } else if (id === 'sic') {
      stack.rotation.z = -1.0; orbitAt(67 + u * 6, 0.02 + u * 0.004); sky = 0;
      const s = seg(u, 0.3, 1);
      burn('f1', u < 0.26 ? 1.9 * (1 - seg(u, 0.2, 0.26)) : 0, 2.6);
      drop('sic', s * s * 420, s * 0.35, s * 30);
      burn('f2', seg(u, 0.42, 0.5), 1.5);
      camPos.set(120, -40, 300 - 60 * u); look.set(lerp(-10, -60, s), lerp(10, -40, s), 0); fov = 46; shR = 120; shC = V(-20, 0, 0);
    } else if (id === 'les') {
      stack.rotation.z = -1.1; orbitAt(92 + u * 8, 0.03 + u * 0.004); sky = 0;
      sec.sic.visible = false; burn('f2', 1, 1.6);
      const a = seg(u, 0.15, 0.7), b = seg(u, 0.5, 1);
      drop('ring', a * a * 260, a * 0.5, a * 12);
      drop('les', 0, b * 0.9, -b * b * 160, b * 240); sec.les.position.z = b * 40;
      camPos.set(lerp(80, 150, u), lerp(40, 90, u), 240); look.set(lerp(-10, 30, b), lerp(20, 70, b), 0); fov = 46; shR = 110; shC = V(40, 30, 0);
    } else if (id === 'sii') {
      stack.rotation.z = -1.5; orbitAt(lerp(176, 186, u), 0.18 + u * 0.05); sky = 0;
      sec.sic.visible = sec.ring.visible = sec.les.visible = false;
      const s = seg(u, 0.25, 1);
      burn('f2', u < 0.2 ? 1 - seg(u, 0.14, 0.2) : 0, 1.6); drop('sii', s * s * 300, s * 0.25, -s * 20);
      burn('f3', seg(u, 0.32, 0.4) * (1 - seg(u, 0.9, 0.97)), 1.5);
      camPos.set(60, 120, 230); look.set(47, 0, 0); fov = 46; shR = 110; shC = V(60, 0, 0);
    } else if (id === 'orbit') {
      stack.rotation.z = -Math.PI / 2; orbitAt(186, 0.4 + u * 4.6); sky = 0;
      sec.sic.visible = sec.ring.visible = sec.les.visible = sec.sii.visible = false;
      const a = u * 1.2; camPos.set(88 + Math.sin(a) * 90, 60 + 30 * u, Math.cos(a) * 120); look.set(86, 0, 0); fov = 50; shC = V(80, 0, 0); shR = 40;
    } else if (id === 'tli') {
      stack.rotation.z = -Math.PI / 2; const k = ease(u); orbitAt(lerp(186, 2600, k * k), 5.1 + k * 0.6); sky = 0;
      sec.sic.visible = sec.ring.visible = sec.les.visible = sec.sii.visible = false;
      burn('f3', seg(u, 0.06, 0.12) * (1 - seg(u, 0.9, 0.96)));
      camPos.set(lerp(150, 86, k), lerp(20, 50, k), lerp(90, 150, k)); look.set(lerp(70, 86, k), 0, 0); fov = 50; shC = V(80, 0, 0); shR = 40;
    } else if (id === 'tde') {
      stack.rotation.z = -Math.PI / 2; orbitAt(lerp(9000, 16000, u), 6.0); sky = 0;
      for (const k of ['sic', 'ring', 'les', 'sii', 'csm']) sec[k].visible = false;
      // S-IVB with Eagle on top; Columbia leaves, turns round, comes back and pulls Eagle out
      const base = SV.iuTop, top = base + 7.25;
      const o = seg(u, 0.03, 0.4);
      for (const g of sec.sla.children) { const a = g.userData.a; g.rotation.set(0, 0, 0); g.position.set(Math.sin(a) * o * 140, SV.iuTop + o * 60, Math.cos(a) * o * 140); g.rotateOnAxis(new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)), o * 2.2); g.visible = o < 0.98; }
      const out = ease(seg(u, 0.02, 0.2)) * 22, turn = ease(seg(u, 0.22, 0.5)) * Math.PI, back = ease(seg(u, 0.52, 0.78)), pull = ease(seg(u, 0.84, 1)) * 45; tilt = -1.15;
      stack.add(lm); stack.add(csm); ship.visible = false;
      lm.position.y = base + pull;
      // Columbia turns about its own centre (5.5 m behind the nose), then slides back in nose-first
      const cy = lerp(SV.slaTop + 2.3 + out, top + 5.5, back) + pull;
      csm.rotation.z = turn; csm.position.set(-Math.sin(turn) * 5.5, cy + Math.cos(turn) * 5.5, 0);
      const a = u * 0.9; camPos.set(base + 14 + Math.sin(a) * 30, 36 - 10 * u, 62 + 26 * Math.cos(a * 1.4)); look.set(base + 12 + pull * 0.6, 0, 0); fov = 48;
    } else if (id === 'coast') {
      stack.visible = false; docked(); sky = 0;
      const k = ease(u), A = new THREE.Vector3(16000, 6000, 5000), B = MOON.clone().add(new THREE.Vector3(-9000, 2600, 1500));
      P.lerpVectors(A, B, k); th = 0;
      ship.rotation.set(0, 0, -Math.PI / 2 + 0.12);
      const a = lerp(0.45, 2.7, k); camPos.set(9 + Math.cos(a) * 52, 12, Math.sin(a) * 52); look.set(9, 0, 0); fov = 46; body = 'none';
    } else if (id === 'loi') {
      stack.visible = false; docked(); sky = 0; body = 'moon';
      const a = lerp(1.3, 0.9, u); orbitAt(lerp(260, 111, ease(u)), a, RM); P.add(MOON);
      ship.rotation.z = Math.PI / 2;                         // engine (top of the pair) pointing the way it flies: a braking burn
      F.sps.rotation.z = 0; burn('sps', seg(u, 0.12, 0.2) * (1 - seg(u, 0.82, 0.9)));
      camPos.set(-34 + 14 * u, 15, 50); look.set(-14, 0, 0); fov = 48;
    } else if (id === 'undock') {
      stack.visible = false; docked(); sky = 0; body = 'moon';
      orbitAt(111, lerp(0.9, 0.5, u), RM); P.add(MOON);
      ship.rotation.z = Math.PI / 2;
      const d = ease(seg(u, 0.15, 0.9)); lm.position.y = -d * 32; lm.rotation.y = d * 1.6;
      camPos.set(lerp(-6, 6, d), lerp(10, 14, d), lerp(40, 60, d)); look.set(lerp(-9, 4, d), 0, 0); fov = 48;
    } else if (id === 'descent') {
      stack.visible = false; ship.visible = true; csm.visible = false; sky = 0; body = 'moon';
      const alt = lerp(111, 2.2, ease(u)); orbitAt(alt, lerp(0.5, -0.435, u), RM); P.add(MOON);
      ship.rotation.z = -lerp(1.45, 0.75, u);                 // engine first, slowly coming upright
      burn('dps', (u > 0.04 && u < 0.1) || u > 0.42 ? 1 : 0);
      camPos.set(lerp(-20, 16, u), lerp(8, 14, u), lerp(34, 30, u)); look.set(0, 3.5, 0); fov = 48;
    } else {   // land
      stack.visible = false; ship.visible = true; csm.visible = false; sky = 0; body = 'moon';
      const d = seg(u, 0, 0.72), alt = 150 * Math.pow(1 - d, 1.7), down = u >= 0.72, away = seg(u, 0.82, 1);
      orbitAt(alt / 1000, -0.45, RM); P.add(MOON);
      this.moonG.visible = true; this.moonG.position.y = -alt; shR = 26; shC = V(ship.position.x, 2, 0);
      ship.rotation.z = -lerp(0.16, 0, seg(u, 0, 0.6)); ship.position.x = lerp(60, 0, ease(seg(u, 0, 0.7)));
      burn('dps', down ? 0 : 0.32);                           // in vacuum the descent engine's flame is almost invisible
      lowSun = true; shR = 48;
      this._dust(alt, down ? seg(u, 0.72, 0.8) : 0, now);
      const lo = Math.min(alt, 40); camPos.set(ship.position.x * 0.8 + lerp(30, 17, ease(u)) + away * 6, lerp(9, 2.4, ease(seg(u, 0, 0.75))) - lo * 0.12, lerp(40, 22, ease(u))); look.set(ship.position.x * 0.8, 3.2 - lo * 0.06, 0); fov = 46;
    }
    if (id !== 'descent' && id !== 'land') csm.visible = true;
    for (let i = this.pn; i < this.puffs.length - (this.ventOn ? 20 : 0); i++) this.puffs[i].sp.visible = false;                // puffs nobody asked for this frame
    // ---- cameras: the near camera in metres, the far one in kilometres, looking the same way
    cam.near = near; cam.position.copy(camPos); cam.fov = fov; cam.lookAt(look); cam.updateProjectionMatrix();
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -th).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tilt));
    this.bgCam.fov = fov; this.bgCam.updateProjectionMatrix();
    this.bgCam.position.copy(camPos).multiplyScalar(0.001).applyQuaternion(q).add(P);
    this.bgCam.quaternion.copy(q).multiply(cam.quaternion);
    // ---- the Sun: the same direction in both worlds; its shadows are kept tight round the subject
    const sunL = lowSun ? LOW_SUN.clone() : SUN.clone().applyQuaternion(q.clone().invert()), c0 = shC || look;
    this.sunF.target.position.copy(c0); this.sunF.position.copy(c0).addScaledVector(sunL, 700);
    const sc = this.sunF.shadow.camera; if (sc.right !== shR) { sc.left = sc.bottom = -shR; sc.right = sc.top = shR; sc.updateProjectionMatrix(); this.sunF.shadow.normalBias = shR * 0.0011; }
    // ---- sky: blue on the ground, black in space
    this.dome.position.copy(camPos); this.dome.material.uniforms.uK.value = sky; this.dome.material.uniforms.uSun.value.copy(sunL);
    if (this.padG.visible && sky > 0.5) { this.fog.near = 1800; this.fog.far = 52000; } else { this.fog.near = 1e8; this.fog.far = 1e9; }        // (always present, so no material is ever compiled twice)
    const hKm = this.bgCam.position.length() - RE;
    this.earth.visible = sky < 0.999; this.air.visible = hKm > 90; this.stars.material.opacity = lowSun ? 0 : 1 - sky;      // on the sunlit Moon, as in the Apollo photographs, no stars show        // (inside the shell of air it would tint the whole sky)
    this.stars.position.copy(this.bgCam.position);
    const fade = 1 - clamp((hKm - 700) / 2600);                // near the Earth the drawn clouds take over from the photographed ones
    this.cloud.material.uniforms.uFade.value = fade; this.dress.clouds.material.opacity = 1 - 0.8 * fade;
    this.hemi.intensity = 0.25 + 0.6 * sky + (body === 'moon' ? 0.15 : 0);
  }

  /** one puff of smoke for this frame */
  _puff(x, y, z, size, r, g, b, alpha, flat = 1) {
    const p = this.puffs[this.pn]; if (!p) return; this.pn++;
    p.sp.visible = alpha > 0.004; p.sp.position.set(x, y, z); p.sp.scale.set(size, size * flat, 1); p.sp.material.color.setRGB(r, g, b); p.sp.material.opacity = Math.min(1, alpha);
  }
  /** lift-off: fire and steam burst out of both ends of the flame trench, fire licks round the foot of the rocket, and a column of smoke follows it up */
  _smoke(get, alt, thr) {
    const t = get + 6, YG = this.YG;
    if (t <= 0) return;
    for (let i = 0; i < 120; i++) {                                                   // the trench
      const [r1, r2, r3, r4, r5] = this.puffs[i].r, L = 9 + 6 * r1, ph = r2 * L; if (t < ph) continue;
      const age = (t - ph) % L, born = t - age, pw = clamp(born / 3) * (1 - clamp((born - 17) / 6)); if (pw <= 0.01) continue;
      const side = i % 2 ? 1 : -1, k = 1 - Math.exp(-age * 0.36), dist = 22 + (60 + 150 * r3) * k, hot = Math.exp(-age * 0.9) * pw, a = Math.min(1, age * 1.6) * Math.pow(1 - age / L, 1.6) * pw, v = 0.8 + 0.14 * r5;
      this._puff((r4 - 0.5) * (14 + age * 7), YG + 6 + (1.5 + r5 * 5.5) * Math.pow(age, 1.12) - alt, side * dist, (22 + 8.5 * age) * (0.6 + 0.4 * pw), v + hot * 0.9, v * (1 - hot * 0.1) + hot * 0.35, v * (1 - hot * 0.5), a);
    }
    for (let i = 120; i < 146; i++) {                                                 // fire round the foot of the rocket, until it has climbed away
      const [r1, r2, r3, r4] = this.puffs[i].r, L = 0.7 + 0.5 * r1, age = (t + r2 * L) % L, k = age / L, an = r3 * 6.283, pw = thr * (1 - clamp(alt / 70)); if (pw <= 0.01) continue;
      const rad = 5 + 13 * k * (0.5 + r4);
      this._puff(Math.cos(an) * rad, -2 + 8 * k * r4 - alt * 0.9, Math.sin(an) * rad, 6 + 11 * k, 1.7, 0.95 - 0.35 * k, 0.3 - 0.2 * k, (1 - k) * 0.7 * pw);
    }
    if (get > 0) for (let i = 146; i < 190; i++) {                                    // the column under the climbing rocket
      const [r1, r2, r3, r4, r5] = this.puffs[i].r, tb = r1 * 24; if (get < tb) continue;
      const age = get - tb, L = 11 + 5 * r2; if (age > L) continue;
      const y0 = altAt(tb) - 45 - 95 * (1 - Math.exp(-age * 0.5)), y = Math.max(-12 + r5 * 10, y0), spread = y > y0 ? 1 : 0, an = r3 * 6.283, rad = (4 + age * (spread ? 9 : 2.2)) * (0.4 + r4), hot = Math.exp(-age * 1.1), v = 0.9;
      this._puff(Math.cos(an) * rad, y - alt, Math.sin(an) * rad, 14 + 5.5 * age, v + hot * 0.8, v + hot * 0.25, v * (1 - hot * 0.5), Math.min(1, age * 2) * Math.pow(1 - age / L, 1.6) * 0.8);
    }
  }
  /** before lift-off, cold oxygen boils off and drifts away from the tanks as white vapour */
  _vent(now, alt, get) {
    if (get > 0) return;
    const VENT = [[40.5, 5.2], [65.5, 5.2], [83.5, 3.5], [28, 5.2]];
    for (let i = 0; i < 20; i++) { const p = this.puffs[189 - i]; if (this.pn > 189 - i) break; const [r1, r2, r3] = p.r, v = VENT[i % 4], L = 3.5 + 2 * r1, age = (now * 0.8 + r2 * L) % L, k = age / L;
      p.sp.visible = true; p.sp.position.set(v[1] + 1 + age * 2.2, v[0] - age * (1.2 + r3) - alt, 1 + age * (3.5 + 2 * r3)); p.sp.scale.set(2.5 + 6 * k, 2.5 + 6 * k, 1); p.sp.material.color.setRGB(1, 1, 1); p.sp.material.opacity = Math.min(1, k * 6) * (1 - k) * 0.5; }
    this.ventOn = true;
  }
  /** ice shaken off the cold tanks as the engines light */
  _ice(get, alt) {
    if (get < -2 || get > 14) return; this.ice.visible = true;
    const p = this.ice.geometry.attributes.position;
    this.iceSeed.forEach(([a, y, tb, r, k], i) => { const age = get - tb; if (age < 0) { p.setXYZ(i, 0, -9999, 0); return; } const yy = y + altAt(tb) - alt - 4.9 * age * age * 0.5 - 2 * age, rr = r + age * (0.4 + k * 2.2); p.setXYZ(i, Math.cos(a) * rr, yy, Math.sin(a) * rr); });
    p.needsUpdate = true;
  }
  /** the trail the rocket leaves as it climbs and leans over */
  _trail(tip, u) {
    for (let i = 0; i < 70; i++) { const [r1, r2, r3] = this.puffs[i].r, s = 190 + i * 62 + r1 * 40, th = Math.max(0, tip - s * 0.00012), fade = 1 - i / 70;
      this._puff(-Math.sin(th) * s + (r2 - 0.5) * (20 + s * 0.03), -Math.cos(th) * s + (r3 - 0.5) * 20, (r1 - 0.5) * (20 + s * 0.03), 40 + s * 0.085, 1.0, 0.97, 0.93, 0.5 * fade * (1 - u * 0.75)); }
  }
  /** the descent engine blows the Moon's dust away in flat sheets: no air, so it flies straight and low */
  _dust(alt, settle, now) {
    const k = clamp(1 - alt / 30) * (1 - settle); if (k < 0.02) return;
    for (let i = 0; i < 70; i++) { const [r1, r2, r3, r4] = this.puffs[i].r, f = (now * (0.5 + r1 * 0.6) + r2 * 9) % 1, an = r3 * 6.283, rad = 2 + f * (26 + 30 * r4);
      this._puff(Math.cos(an) * rad, -alt + 0.25 + rad * 0.012, Math.sin(an) * rad, 3 + f * 7, 0.74, 0.72, 0.69, Math.min(1, f * 5) * (1 - f) * 0.34 * k, 0.3); }
  }
}
