// The exhibition hall: a 3D room you walk through, with every piece of hardware of this
// simulation standing on its own plinth at true scale. It is a virtual hall, set at NASA's
// Kennedy Space Center in Florida (the real machines are still on the Moon, on Mars or in deep
// space: these are our 3D models). Click an exhibit, or press E next to it, to take it apart in
// the object viewer.
//
// Light on the graphics card by design: its own small renderer runs only while the hall is open
// (the Solar System stops drawing meanwhile), there are no shadows, models are built only when
// you come near them, and only the ones near you are drawn.

import * as THREE from 'three';
import { EQUIPMENT } from '../../data/equipment.js';
import { PROBES } from '../../data/probes.js';
import { buildPart } from '../scene/models.js';
import { buildModel } from '../scene/probes.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { esc } from './format.js';
import { partNames } from './objectviewer.js';

export const KSC = { name: 'Kennedy Space Center', place: 'Merritt Island, Florida, USA', lat: 28.5729, lon: -80.6490 };

// Besides one exhibit for every landing site, the Moon hall shows every different piece the Apollo crews left around
// their landers: [part type, name on the sign, line under the name, how near the visitor stops, the height looked at]. Identical pieces (the three rovers, the five
// standing flags) are shown once, with the flights they belong to on the sign.
const PIECES = {
  apollo11: [['lrrr', 'Laser reflector', 'Apollo 11 and 14: 100 glass corner-cubes', 2.3, 0.3], ['easep', 'Apollo 11 seismometer', 'Solar-powered; it worked for 21 days', 3.4, 0.6]],
  apollo12: [['alsep', 'Apollo 12 science station', 'Seismometer, magnetometer, solar wind, ions', 9.5, 0.4]],
  apollo14: [['alsep', 'Apollo 14 science station', 'Seismometer, ion detector, mortar box', 9.5, 0.4]],
  apollo15: [['lrv', 'Lunar Roving Vehicle', 'Driven on Apollo 15, 16 and 17', 6.5, 1.0], ['alsep', 'Apollo 15 science station', 'Seismometer, magnetometer, solar wind, heat flow', 9.5, 0.4], ['lrrr', 'Large laser reflector', 'Apollo 15: 300 glass corner-cubes', 2.8, 0.35]],
  apollo16: [['alsep', 'Apollo 16 science station', 'Seismometer, magnetometer, mortar box, heat flow', 9.5, 0.4]],
  apollo17: [['alsep', 'Apollo 17 science station', 'Gravimeter, dust detector, heat flow, seismic antenna', 9.5, 0.4]],
};
let MOON = null;
function moonList() {
  if (MOON) return MOON;
  MOON = [];
  for (const q of EQUIPMENT.filter((x) => x.body === 'moon')) {
    // no flags anywhere in the hall: the landing-site exhibits are shown without theirs
    MOON.push(q.parts.some((p) => p.type === 'flag') ? { ...q, parts: q.parts.filter((p) => p.type !== 'flag'), of: q } : q);
    for (const [type, name, short, stand, lookY] of PIECES[q.id] || []) { const part = q.parts.find((p) => p.type === type); if (part) MOON.push({ ...q, name, short, parts: [part], of: q, stand, lookY }); }
  }
  return MOON;
}
const HALLS = [
  { id: 'moon', title: 'Moon hall', color: 0xcfd6e2, list: moonList },
  { id: 'mars', title: 'Mars hall', color: 0xe08a5a, list: () => EQUIPMENT.filter((q) => q.body === 'mars') },
  { id: 'deep', title: 'Deep space hall', color: 0xb79cff, list: () => PROBES },
];
/** Exhibits in all three halls: every lander, rover and probe, plus the instruments astronauts set up. */
export const exhibitCount = () => HALLS.reduce((n, h) => n + h.list().length, 0);
const SIDE = 12, STEP = 17, PLINTH_R = 6.5, EYE = 1.7;
/** An impact site has no machine left to show: a scale model of its crater on the plinth instead. */
function craterExhibit(diam) {
  const g = new THREE.Group(), R = PLINTH_R - 0.9, k = R / (diam / 2);
  // profile of a fresh small crater: bowl about a fifth as deep as it is wide, raised rim, ejecta sloping away
  const pts = [[0, -0.2 * R], [0.35 * R, -0.17 * R], [0.7 * R, -0.08 * R], [0.9 * R, 0.03 * R], [R, 0.06 * R], [1.08 * R, 0.03 * R], [1.16 * R, 0]]
    .map(([x, y]) => new THREE.Vector2(x, 0.5 * (y + 0.2 * R) + 0.02));
  const geo = new THREE.LatheGeometry(pts, 96), P = geo.attributes.position, col = new Float32Array(P.count * 3);
  // paint the light: the bowl darker toward its floor, one inner wall in shadow, the rim catching the light
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), z = P.getZ(i), r = Math.hypot(x, z) / R, side = r > 0.01 ? (x * 0.7 - z * 0.7) / (r * R) : 0;
    let c = r < 1 ? 0.55 + 0.4 * r - 0.25 * Math.max(0, side) * (1 - r * 0.5) : 1.0 - 0.12 * (r - 1) / 0.16;
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = c;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const bowl = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x9a968e, roughness: 1, side: THREE.DoubleSide, vertexColors: true }));
  g.add(bowl);
  let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 22; i++) {
    const a = rnd() * Math.PI * 2, r = R * (0.92 + rnd() * 0.22), sz = 0.05 + rnd() * 0.16;
    const b = new THREE.Mesh(new THREE.DodecahedronGeometry(sz, 0), new THREE.MeshStandardMaterial({ color: 0x7c7973, roughness: 0.95 }));
    b.position.set(Math.cos(a) * r, 0.02 + 0.5 * (0.2 * R + 0.06 * R * Math.max(0, 1 - Math.abs(r / R - 1) * 6)) + sz * 0.4, Math.sin(a) * r); g.add(b);
  }
  g.userData.scale = k;
  return g;
}
const SHARED = new Set(['lm', 'viking', 'mer', 'insight', 'ingenuity', 'ladee', 'msl', 'm2020']);

function signTexture(lines, w = 768, h = 256) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#0d141f'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#e0ae3f'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
  g.textBaseline = 'top';
  g.fillStyle = '#e0ae3f'; g.font = '600 30px system-ui, sans-serif'; g.fillText(lines[0], 28, 24);
  g.fillStyle = '#f1f4f8'; g.font = '600 62px system-ui, sans-serif'; g.fillText(lines[1], 28, 68, w - 56);
  g.fillStyle = '#aab4c2'; g.font = '400 30px system-ui, sans-serif'; g.fillText(lines[2] || '', 28, 158, w - 56);
  g.fillStyle = '#7ee0a1'; g.font = '600 26px system-ui, sans-serif'; g.fillText(lines[3] || '', 28, 204, w - 56);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}
/** The welcome board at the entrance: each problem crossed out, with our answer beside it. */
const WHY_ROWS = [['Stories lost in archives', 'One clock, 1958 to today'], ['Hard to picture', 'Watch each one land'], ['Far away', 'Walk right up to it'], ['"Left behind" = gone?', 'Some still work today']];
/** the flag of the United States: 13 stripes, and 50 stars in 9 rows on the blue field (proportions of the official flag) */
function flagTexture() {
  const W = 1900, H = 1000, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#b22234'; g.fillRect(0, i * H / 13, W, H / 13 + 1); }
  const cw = W * 0.76 / 1.9, ch = H * 7 / 13; g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, cw, ch);
  const star = (x, y, r) => { g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.382 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); };
  g.fillStyle = '#ffffff'; const sx = cw / 12, sy = ch / 10, r = H * 0.0616 / 2 * 1.0;
  for (let row = 0; row < 9; row++) { const n = row % 2 ? 5 : 6; for (let k = 0; k < n; k++) star(sx * (row % 2 ? 2 + 2 * k : 1 + 2 * k), sy * (row + 1), r); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function whyTexture() {
  const w = 2048, h = 1280, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0e1a17'); bg.addColorStop(1, '#080c12'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#57f287'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  g.textBaseline = 'middle';
  g.fillStyle = '#e0ae3f'; g.font = '700 64px system-ui, sans-serif'; g.fillText('WHY THIS EXHIBITION EXISTS', 90, 120);
  g.font = '700 42px system-ui, sans-serif'; g.fillStyle = '#ff9b85'; g.fillText('THE PROBLEM', 90, 240); g.fillStyle = '#7ef0a8'; g.fillText('OUR ANSWER', 1060, 240);
  WHY_ROWS.forEach(([a, b], i) => {
    const y = 380 + i * 225;
    g.fillStyle = 'rgba(205,218,238,0.12)'; g.fillRect(90, y - 112, w - 180, 3);
    g.font = '400 64px system-ui, sans-serif'; g.fillStyle = '#aeb7c4'; g.fillText(a, 90, y, 860);
    const tw = Math.min(860, g.measureText(a).width); g.fillStyle = 'rgba(255,130,105,0.85)'; g.fillRect(86, y - 3, tw + 8, 7);   // crossed out
    g.fillStyle = '#57f287'; g.font = '700 76px system-ui, sans-serif'; g.fillText('→', 965, y);
    g.fillStyle = '#ffffff'; g.font = '700 80px system-ui, sans-serif'; g.fillText(b, 1060, y, 900);
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}
/** The name of the place in tall letters, for the walls. */
function nameTexture() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 256;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 150px system-ui, -apple-system, "Segoe UI", sans-serif';
  g.fillStyle = '#0b2a5b'; g.fillText('KENNEDY SPACE CENTER', 1024, 132, 1980);      // dark blue letters on the light wall
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
/** You, in a white spacesuit with a gold visor (seen in 3rd person). About 1.85 m tall, facing -z. */
function makeAvatar() {
  const g = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0xf1f0ea, roughness: 0.78, metalness: 0 });
  const joint = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.6, metalness: 0.3 });
  const visor = new THREE.MeshStandardMaterial({ color: 0xd8a83c, roughness: 0.08, metalness: 1 });
  const add = (geo, mat, x, y, z, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
  const limb = (x, y, r, len, boot) => {
    const p = new THREE.Group(); p.position.set(x, y, 0); g.add(p);
    add(new THREE.CapsuleGeometry(r, len, 4, 12), suit, 0, -len / 2 - r * 0.6, 0, p);
    add(new THREE.TorusGeometry(r * 1.05, r * 0.25, 8, 16), joint, 0, -len * 0.55, 0, p).rotation.x = Math.PI / 2;
    if (boot) add(new THREE.BoxGeometry(r * 2.3, r * 1.4, r * 3.2), joint, 0, -len - r * 1.6, -r * 0.6, p);
    else add(new THREE.SphereGeometry(r * 1.25, 12, 10), joint, 0, -len - r * 1.4, 0, p);
    return p;
  };
  g.userData.legL = limb(-0.13, 0.95, 0.105, 0.72, true); g.userData.legR = limb(0.13, 0.95, 0.105, 0.72, true);
  g.userData.armL = limb(-0.34, 1.5, 0.075, 0.55, false); g.userData.armR = limb(0.34, 1.5, 0.075, 0.55, false);
  add(new THREE.CapsuleGeometry(0.25, 0.42, 6, 16), suit, 0, 1.28, 0).scale.set(1, 1, 0.78);
  add(new THREE.BoxGeometry(0.46, 0.58, 0.24), suit, 0, 1.32, 0.26);                     // backpack
  add(new THREE.BoxGeometry(0.22, 0.14, 0.05), joint, 0, 1.3, -0.21);                    // chest control box
  add(new THREE.SphereGeometry(0.19, 20, 16), suit, 0, 1.77, 0);
  const vz = add(new THREE.SphereGeometry(0.17, 20, 12, Math.PI * 0.18, Math.PI * 0.64, Math.PI * 0.25, Math.PI * 0.42), visor, 0, 1.77, -0.035); vz.rotation.y = Math.PI;
  g.traverse((o) => { o.frustumCulled = false; });
  return g;
}
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** The filter wall: a grid of white filter panels in grey frames, each with fine vertical pleats. */
function hepaTexture() {
  return canvasTex(512, 1024, (g, w, h) => {
    g.fillStyle = '#9ca3ad'; g.fillRect(0, 0, w, h);
    const cols = 4, rows = 6, cw = w / cols, rh = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const x = i * cw + 6, y = j * rh + 6, ww = cw - 12, hh = rh - 12;
      g.fillStyle = '#e9ecf0'; g.fillRect(x, y, ww, hh);
      for (let k = 0; k < ww; k += 4) { g.fillStyle = k % 8 ? 'rgba(150,158,170,0.35)' : 'rgba(255,255,255,0.6)'; g.fillRect(x + k, y + 4, 1.5, hh - 8); }
      g.strokeStyle = '#7c838d'; g.lineWidth = 2; g.strokeRect(x, y, ww, hh);
    }
  });
}
function grilleTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#eef1f4'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#b9c0c9'; g.fillRect(20, 40, w - 40, h - 80);
    for (let y = 46; y < h - 46; y += 9) { g.fillStyle = '#7f8792'; g.fillRect(24, y, w - 48, 3); }
    g.fillStyle = '#d4d9df'; g.fillRect(0, 0, 3, h);
  });
}
function panelTexture() {
  return canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f1f3f6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9ced5'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, w - 3, h - 3); g.fillStyle = '#dfe3e8'; for (const [x, y] of [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]]) { g.beginPath(); g.arc(x, y, 3, 0, 6.283); g.fill(); } });
}
/** The ceiling: white tiles with a round downlight in the middle of each (also used as the glow map). */
function lightsTexture(glow) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = glow ? '#000000' : '#eceff2'; g.fillRect(0, 0, w, h);             // white tiles; only the round lights glow
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 34); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.6, '#fffaf0'); gr.addColorStop(1, 'rgba(255,250,240,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, 34, 0, 6.283); g.fill();
    if (!glow) { g.strokeStyle = '#c5cad1'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); }
  });
}
function floorTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 256);            // plain floor: large slabs with a hairline joint
  g.strokeStyle = '#d9dbe0'; g.lineWidth = 3; g.strokeRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}

/** Fuse the many small pieces of a finished model into one mesh per material. It looks exactly
 *  the same, but a lander goes from about 130 draw calls to about a dozen. */
function fuse(root) {
  root.updateWorldMatrix(true, true);
  const inv = root.matrixWorld.clone().invert(), groups = new Map(), m4 = new THREE.Matrix4(), n3 = new THREE.Matrix3(), v = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isMesh || !o.visible || Array.isArray(o.material) || o.isSkinnedMesh || !o.geometry.attributes.position) return;
    for (let p = o.parent; p && p !== root.parent; p = p.parent) if (!p.visible) return;
    if (!groups.has(o.material)) groups.set(o.material, []);
    groups.get(o.material).push(o);
  });
  for (const [mat, meshes] of groups) {
    if (meshes.length < 2) continue;
    const geos = [];
    for (const o of meshes) {
      const src = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry, n = src.attributes.position.count;
      m4.multiplyMatrices(inv, o.matrixWorld); n3.getNormalMatrix(m4);
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
      const P = src.attributes.position, N = src.attributes.normal, U = src.attributes.uv;
      for (let i = 0; i < n; i++) {
        v.fromBufferAttribute(P, i).applyMatrix4(m4); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
        if (N) { v.fromBufferAttribute(N, i).applyMatrix3(n3).normalize(); nor[i * 3] = v.x; nor[i * 3 + 1] = v.y; nor[i * 3 + 2] = v.z; }
        if (U) { uv[i * 2] = U.getX(i); uv[i * 2 + 1] = U.getY(i); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      if (N) g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); else { g.computeVertexNormals(); }
      geos.push(g);
    }
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    // texture transforms that the loader put on the UVs of quantized models stay with the material's maps
    const mesh = new THREE.Mesh(merged, mat); mesh.castShadow = false; mesh.receiveShadow = false;
    for (const o of meshes) o.removeFromParent();
    root.add(mesh);
  }
}

export class Museum {
  /** root: the #museum element. onOpenExhibit(q): take one exhibit apart in the object viewer. */
  constructor(root, { onOpenExhibit, isInspecting }) {
    this.root = root; this.onOpenExhibit = onOpenExhibit; this.isInspecting = isInspecting || (() => false);
    this.isOpen = false; this.hall = 'moon'; this.keys = new Set();
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'close') this.close();
      else if (act === 'hall') this._setHall(b.dataset.id);
      else if (act === 'prev') this._step(-1);
      else if (act === 'next') this._step(1);
      else if (act === 'inspect') this._inspect();
      else if (act === 'view') this._setView(!this.third);
    });
    const KEYS = new Set(['w', 'a', 's', 'd', 'shift', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ']);
    const key = (e, down) => {
      if (!this.isOpen || this.isInspecting()) return;
      const k = e.key.toLowerCase();
      if (down && e.key === 'Escape') { e.stopPropagation(); this.close(); return; }
      if (down && (k === 'e' || k === 'enter')) { e.preventDefault(); this._inspect(); return; }
      if (down && k === 'v') { this._setView(!this.third); return; }
      if (down && (k === 'q' || k === ',')) { this._step(-1); return; }
      if (down && (k === 'r' || k === '.')) { this._step(1); return; }
      if (!KEYS.has(k)) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (down) { this.keys.add(k); this.glide = null; if (k === ' ') this.jumpReq = true; } else this.keys.delete(k);
    };
    window.addEventListener('keydown', (e) => key(e, true), true);
    window.addEventListener('keyup', (e) => key(e, false), true);
    window.addEventListener('blur', () => this.keys.clear());
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true; this.root.hidden = false; this.fusedCache = new Map();
    this._w = this._h = this._dpr = 0; this._key = null;      // a new canvas each time: size it again, or it stays at 300 x 150 and looks blurry
    this.root.innerHTML = `<canvas class="m-canvas"></canvas>
      <header class="m-top">
        <div><p class="m-kicker">Virtual exhibition · ${exhibitCount()} exhibits at true size</p><h2>Clean-room exhibition hall</h2></div>
        <nav class="m-halls">${HALLS.map((h) => `<button data-act="hall" data-id="${h.id}">${h.title}<b>${h.list().length}</b></button>`).join('')}</nav>
        <button class="m-view" data-act="view" aria-pressed="false" title="See yourself from behind, or look through your own eyes ( V )">3rd person</button>
        <button class="m-exit" data-act="close" aria-label="Leave the exhibition and go back to space" title="Back to space ( Esc )">✕</button>
      </header>
      <footer class="m-bar">
        <button data-act="prev" title="Previous exhibit ( Q )">◀︎</button>
        <div class="m-now"><b class="m-name"></b><span class="m-parts"></span></div>
        <button class="m-inspect" data-act="inspect">Take it apart ( E )</button>
        <button data-act="next" title="Next exhibit ( R )">▶︎</button>
      </footer>
      <p class="m-keys"><b>W A S D</b> walk · <b>Space</b> jump · drag to look · <b>V</b> 3rd person · click an exhibit to take it apart</p>`;
    const canvas = this.canvas = this.root.querySelector('canvas');
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(1);   // set properly in _tick, from the real size of the canvas
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1;
    r.autoClear = false;
    // Two scenes, drawn one after the other: first the Earth and stars far outside, then the hall.
    // Each gets its own depth range, so walls and pillars never flicker through one another.
    this.sky = new THREE.Scene(); this.sky.background = new THREE.Color(0x000004);
    this.skyCam = new THREE.PerspectiveCamera(60, 1, 200, 20000);
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(0xcfd5dc, 85, 260);      // the faint haze of a very big, very bright room
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.12, 420);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8f96a0, 1.25));                    // light from the white ceiling, bounced off the floor
    const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(3, 16, 5); this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.8); fill.position.set(-8, 6, -6); this.scene.add(fill);
    // ---- outside the windows: the Earth turning below and the stars
    const R = 3000;
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 48), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/earth_day.jpg', (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; this.wake = performance.now() / 1000 + 2; }), fog: false, toneMapped: false }));
    this.earth.position.set(-5600, -900, -60);             // out of the left-hand windows and below: far enough to see the whole curve, the continents and the clouds
    this.earth.rotation.z = 0.41;                            // tilt, so the ground slides past at an angle
    this.sky.add(this.earth);
    const air = new THREE.Mesh(new THREE.SphereGeometry(R * 1.012, 96, 48), new THREE.MeshBasicMaterial({ color: 0x5aa6ff, transparent: true, opacity: 0.16, side: THREE.BackSide, fog: false, depthWrite: false }));
    this.earth.add(air);
    const sp = new Float32Array(1800 * 3);
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 1800; i++) { const u = rnd() * 2 - 1, a = rnd() * Math.PI * 2, r = Math.sqrt(1 - u * u); sp[i * 3] = r * Math.cos(a) * 7000; sp[i * 3 + 1] = u * 7000; sp[i * 3 + 2] = r * Math.sin(a) * 7000; }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.sky.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false })));
    this.hallGroup = new THREE.Group(); this.scene.add(this.hallGroup);
    // Real materials: the hall reflects itself (one snapshot of the room per hall, not every frame, so walking costs nothing extra)
    this.avatar = makeAvatar(); this.avatar.visible = false; this.scene.add(this.avatar);
    this.third = false; this.bodyYaw = 0; this.walkPh = 0;
    this.mats = {
      plaster: new THREE.MeshStandardMaterial({ color: 0xd6dbe2, roughness: 0.92, metalness: 0 }),
      wallWhite: new THREE.MeshStandardMaterial({ color: 0xdfe3e8, roughness: 0.82, metalness: 0 }),
      panel: new THREE.MeshStandardMaterial({ color: 0xe8ebef, roughness: 0.7, metalness: 0, map: panelTexture() }),
      hepa: new THREE.MeshStandardMaterial({ color: 0xe9ecf0, roughness: 0.9, metalness: 0, map: hepaTexture() }),
      grille: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0.1, map: grilleTexture() }),
      lights: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0, map: lightsTexture(false), emissiveMap: lightsTexture(true), emissive: 0xffffff, emissiveIntensity: 1.3, side: THREE.DoubleSide }),
      blue: new THREE.MeshStandardMaterial({ color: 0x2448a8, roughness: 0.42, metalness: 0.45 }),
      whiteSteel: new THREE.MeshStandardMaterial({ color: 0xe6e9ed, roughness: 0.4, metalness: 0.35 }),
      grating: new THREE.MeshStandardMaterial({ color: 0x8a9099, roughness: 0.5, metalness: 0.7 }),
      yellow: new THREE.MeshStandardMaterial({ color: 0xe8c22a, roughness: 0.45, metalness: 0.2 }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.9, metalness: 0 }),
      alu: new THREE.MeshStandardMaterial({ color: 0x9aa2ad, roughness: 0.3, metalness: 0.85 }),
      frame: new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.32, metalness: 0.8 }),
      steel: new THREE.MeshStandardMaterial({ color: 0xc4c9d0, roughness: 0.22, metalness: 0.95 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 1 }),
      floor: new THREE.MeshStandardMaterial({ color: 0xaab0b9, roughness: 0.24, metalness: 0.08 }),
      ceiling: new THREE.MeshStandardMaterial({ color: 0x2c333e, roughness: 0.55, metalness: 0.6 }),
      blackGlass: new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.14, metalness: 0.2 }),
      glassTint: new THREE.MeshBasicMaterial({ color: 0x8fb4d8, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }),
      glassShine: new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.03, metalness: 1, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    };
    this.ray = new THREE.Raycaster();
    // look around by dragging; a short click picks an exhibit
    let drag = null;
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      this.yaw -= (e.clientX - drag.x) * 0.0038; this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch - (e.clientY - drag.y) * 0.0038));
      drag.x = e.clientX; drag.y = e.clientY; this.glide = null;
    });
    canvas.addEventListener('pointerup', (e) => {
      if (!drag) return;
      const moved = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0); drag = null;
      if (moved < 6) this._pick(e.clientX, e.clientY);
    });
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); this._move(-e.deltaY * 0.026, 0); this.glide = null; }, { passive: false });
    this._setHall(this.hall);
    let last = performance.now();
    const loop = (now) => {
      if (!this.isOpen) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.isInspecting()) return;                     // the object viewer has the screen
      this._tick(dt, now / 1000);
    };
    this.raf = requestAnimationFrame(loop);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf); this.keys.clear();
    this.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); this.sky.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    for (const k of ['pmrem', 'cubeRT', 'envRT']) { if (this[k]) this[k].dispose(); this[k] = null; }
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer = null;
    this.root.hidden = true; this.root.innerHTML = '';
  }

  /** One picture of the whole room in all directions (the view through the windows included), used for every reflection. */
  _captureEnv(z) {
    const r = this.renderer; if (!r) return;
    try {
      if (!this.cubeRT) { this.cubeRT = new THREE.WebGLCubeRenderTarget(512, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter }); this.cubeCam = new THREE.CubeCamera(0.3, 9000, this.cubeRT); this.pmrem = new THREE.PMREMGenerator(r); }
      this.cubeCam.position.set(0, 5.5, z); this.cubeCam.updateMatrixWorld(true);
      const auto = r.autoClear;
      r.autoClear = true; this.cubeCam.update(r, this.sky);                                        // the Earth and stars first
      r.autoClear = false; this.scene.environment = null; this.cubeCam.update(r, this.scene);     // then the hall on top
      r.autoClear = auto;
      const env = this.pmrem.fromCubemap(this.cubeRT.texture);
      if (this.envRT) this.envRT.dispose();
      this.envRT = env; this.scene.environment = env.texture; this.scene.environmentIntensity = 0.6;
    } catch (e) { console.warn('hall reflections unavailable', e); }
  }

  _setHall(id) {
    this.hall = id;
    const hall = HALLS.find((h) => h.id === id);
    this.root.querySelectorAll('.m-halls button').forEach((b) => b.setAttribute('aria-current', b.dataset.id === id ? 'true' : 'false'));
    this.hallGroup.clear();
    const list = hall.list();
    const plinthGeo = new THREE.CylinderGeometry(PLINTH_R, PLINTH_R + 0.3, 0.45, 48);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x232b38, roughness: 0.5, metalness: 0.3 });
    const glowMat = new THREE.MeshBasicMaterial({ color: hall.color, transparent: true, opacity: 0.5, toneMapped: false });
    const ringGeo = new THREE.RingGeometry(PLINTH_R + 0.35, PLINTH_R + 0.6, 64);
    this.exhibits = list.map((q, i) => {
      const side = i % 2 ? 1 : -1, x = side * SIDE, z = -Math.floor(i / 2) * STEP;
      const g = new THREE.Group(); g.position.set(x, 0, z); this.hallGroup.add(g);
      const parts = partNames(q);
      const when = q.isProbe ? `Launched ${new Date(q.launch).getUTCFullYear()}` : `Arrived ${new Date(q.arrival).getUTCFullYear()}`;
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.4), new THREE.MeshBasicMaterial({ map: signTexture([`EXHIBIT ${String(i + 1).padStart(2, '0')} · ${when.toUpperCase()}`, q.name, q.short, parts.length > 1 ? `${parts.length} parts to take apart` : 'Click to take it apart']), toneMapped: false }));
      sign.position.set(-side * PLINTH_R * 0.82, 1.35, PLINTH_R * 0.82); sign.rotation.y = -side * Math.PI / 4; g.add(sign);   // at the front corner, never in front of the exhibit
      const back = new THREE.Mesh(sign.geometry, sign.material); back.rotation.y = Math.PI; back.position.z = -0.08; sign.add(back);     // the same text on the back, so it reads from behind too
      const frame = new THREE.Mesh(new THREE.BoxGeometry(4.32, 1.52, 0.07), this.mats.frame); frame.position.z = -0.04; sign.add(frame);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), this.mats.steel); post.position.set(-side * PLINTH_R * 0.82, 0.35, PLINTH_R * 0.82); g.add(post);
      // invisible click target, tall enough for any model
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(PLINTH_R, PLINTH_R, 12, 12), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 6; hit.userData.i = i; g.add(hit);
      return { q, i, g, hit, x, z, side, model: null };
    });
    const depth = Math.ceil(list.length / 2) * STEP;
    // ---- the room: a bright clean-room high bay, like the halls where spacecraft are assembled. A wall of air
    // filters on the left, two steel galleries with stairs on the right, blue steel beams and rows of round lights
    // above, a glossy epoxy floor. Every piece that shares a material is merged into one mesh, so the whole room is
    // a handful of draw calls.
    const WX = SIDE + PLINTH_R + 5.5, WH = 18, zBack = -depth + STEP - PLINTH_R - 9, zFront = 26, len = zFront - zBack, zMid = (zFront + zBack) / 2;
    const M = this.mats, T = 0.6, DEEP = 0;
    const accent = new THREE.MeshBasicMaterial({ color: hall.color, toneMapped: false });
    const parts = new Map();
    const put = (geo, mat, x, y, z, ry = 0, rz = 0) => { if (ry) geo.rotateY(ry); if (rz) geo.rotateZ(rz); geo.translate(x, y, z); if (!parts.has(mat)) parts.set(mat, []); parts.get(mat).push(geo.index ? geo.toNonIndexed() : geo); };
    const bx = (w, h, d, x, y, z, mat, ry = 0, rz = 0) => put(new THREE.BoxGeometry(w, h, d), mat, x, y, z, ry, rz);
    const plane = (w, h, mat, x, y, z, ry, rep) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.y = ry; m.matrixAutoUpdate = false; m.updateMatrix(); this.hallGroup.add(m); return m; };
    // floor: light grey epoxy, polished
    M.floor.map = this.floorTex || (this.floorTex = floorTexture()); this.floorTex.repeat.set(WX * 2 / 6, len / 6);
    const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(WX * 2, len), M.floor); hallFloor.rotation.x = -Math.PI / 2; hallFloor.position.set(0, 0, zMid); this.hallGroup.add(hallFloor);
    for (const sx of [-1, 1]) bx(0.12, 0.012, len - 4, sx * (SIDE + PLINTH_R + 0.9), 0.006, zMid, M.yellow);     // yellow walkway lines
    // end walls, white, with a blue band
    for (const [z, ry] of [[zBack, 0], [zFront, Math.PI]]) { bx(WX * 2, WH, T, 0, WH / 2, z + (ry ? T / 2 : -T / 2), M.wallWhite); bx(WX * 2, 0.9, 0.1, 0, WH - 4, z + (ry ? -0.05 : 0.05), M.blue); }
    // left: the filter wall (the clean air comes in through it), over a white wainscot with return-air grilles
    M.hepa.map.repeat.set(len / 4.8, 1);
    plane(len, WH - 3, M.hepa, -WX, 3 + (WH - 3) / 2, zMid, Math.PI / 2);
    M.grille.map.repeat.set(len / 2.4, 1);
    plane(len, 3, M.grille, -WX, 1.5, zMid, Math.PI / 2);
    bx(0.3, 0.5, len, -WX + 0.15, 3, zMid, M.blue);                                   // blue steel ledger along the top of the wainscot
    bx(0.3, 0.6, len, -WX + 0.15, WH - 3, zMid, M.blue);
    // right: a white panelled wall with two steel galleries, posts, rails and stairs
    M.panel.map.repeat.set(len / 3, WH / 3);
    plane(len, WH, M.panel, WX, WH / 2, zMid, -Math.PI / 2);
    const GD = 2.8, gx = WX - GD / 2, ex = WX - GD;
    for (const gy of [5.2, 10.4]) {
      bx(GD, 0.1, len, gx, gy, zMid, M.grating);                                       // grating floor
      bx(0.25, 0.42, len, ex, gy - 0.16, zMid, M.blue);                                // blue edge beam
      bx(0.06, 0.06, len, ex + 0.05, gy + 1.08, zMid, M.whiteSteel);                   // top rail
      bx(0.04, 0.04, len, ex + 0.05, gy + 0.55, zMid, M.whiteSteel);                   // mid rail
      bx(0.03, 0.15, len, ex + 0.05, gy + 0.12, zMid, M.whiteSteel);                   // toe board
      for (let z = zBack + 1; z < zFront; z += 2.2) bx(0.06, 1.08, 0.06, ex + 0.05, gy + 0.55, z, M.whiteSteel);
    }
    for (let z = zFront - 2; z > zBack; z -= STEP / 2) bx(0.36, 10.4, 0.36, ex, 5.2, z, M.whiteSteel);   // columns under the galleries
    // stairs: up to the first gallery and on to the second, three sets along the hall
    const stair = (x0, y0, z0, dir, rise) => {
      const n = Math.round(rise / 0.2), run = n * 0.27;
      for (let k = 0; k < n; k++) bx(1.1, 0.05, 0.3, x0, y0 + (k + 1) * (rise / n), z0 + dir * (k + 0.5) * 0.27, M.grating);
      const L = Math.hypot(run, rise), ang = Math.atan2(rise, run) * dir;
      for (const o of [-0.58, 0.58]) {
        bx(0.08, 0.3, L, x0 + o, y0 + rise / 2, z0 + dir * run / 2, M.blue, 0, 0); const g = parts.get(M.blue); const last = g.pop();
        const sg = new THREE.BoxGeometry(0.08, 0.3, L).toNonIndexed(); sg.rotateX(-ang); sg.translate(x0 + o, y0 + rise / 2, z0 + dir * run / 2); g.push(sg);
        const rg = new THREE.BoxGeometry(0.05, 0.05, L).toNonIndexed(); rg.rotateX(-ang); rg.translate(x0 + o, y0 + rise / 2 + 1.0, z0 + dir * run / 2); parts.get(M.whiteSteel).push(rg);
      }
    };
    for (let z = zFront - 12; z > zBack + 30; z -= 60) { stair(ex - 0.7, 0, z, -1, 5.2); stair(ex - 0.7, 5.2, z - 26, 1, 5.2); }
    // ceiling: white, with rows of round lights, crossed by blue beams, and a travelling crane near the far end
    M.lights.map.repeat.set(WX * 2 / 6, len / 6); M.lights.emissiveMap.repeat.copy(M.lights.map.repeat);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(WX * 2, len), M.lights); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, WH, zMid); this.hallGroup.add(ceil);
    for (let z = zFront - 1; z > zBack; z -= STEP) bx(WX * 2, 0.9, 0.45, 0, WH - 0.45, z, M.blue);
    for (const x of [-WX / 2, WX / 2]) bx(0.45, 0.7, len, x, WH - 1.25, zMid, M.whiteSteel);
    { const cz = zBack + 22; bx(WX * 2 - 2, 1.1, 1.2, 0, WH - 2.2, cz, M.whiteSteel); bx(1.6, 1.0, 1.6, 4, WH - 3.2, cz, M.yellow);
      bx(0.05, 6, 0.05, 4, WH - 6.7, cz, M.whiteSteel); bx(0.5, 0.35, 0.3, 4, WH - 9.8, cz, M.yellow); }
    // a few scissor lifts parked by the filter wall
    const lift = (x, z, h) => {
      bx(2.4, 0.5, 1.2, x, 0.45, z, M.blue);
      for (const [dx, dz] of [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]]) { const w = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 14); w.rotateX(Math.PI / 2); put(w, M.rubber, x + dx, 0.2, z + dz * 1.08); }
      const segs = 3, sh = (h - 0.7) / segs, L = Math.hypot(2.1, sh);
      for (let k = 0; k < segs; k++) for (const s2 of [-1, 1]) for (const side of [-0.5, 0.5]) bx(L, 0.08, 0.06, x, 0.7 + sh * (k + 0.5), z + side, M.whiteSteel, 0, s2 * Math.atan2(sh, 2.1));
      bx(2.6, 0.12, 1.3, x, h, z, M.whiteSteel);
      for (const [dx, dz] of [[-1.25, -0.6], [1.25, -0.6], [-1.25, 0.6], [1.25, 0.6]]) bx(0.05, 1.05, 0.05, x + dx, h + 0.55, z + dz, M.yellow);
      for (const dz of [-0.6, 0.6]) bx(2.55, 0.05, 0.05, x, h + 1.08, z + dz, M.yellow);
      for (const dx of [-1.25, 1.25]) bx(0.05, 0.05, 1.25, x + dx, h + 1.08, z, M.yellow);
    };
    for (let z = zFront - 20, k = 0; z > zBack + 10; z -= 3 * STEP, k++) lift(-WX + 2.8, z, 3 + (k % 3) * 1.3);
    // merge: one mesh per material
    for (const [mat, geos] of parts) { const g = mergeGeometries(geos, false); if (!g) continue; const m = new THREE.Mesh(g, mat); m.matrixAutoUpdate = false; this.hallGroup.add(m); }
    for (const sx of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, len), accent); b.position.set(sx * (WX - (sx > 0 ? GD + 0.05 : 0.05)), 0.07, zMid); this.hallGroup.add(b); }   // the hall's colour along the foot of each side
    const title = new THREE.Mesh(new THREE.PlaneGeometry(13, 4.3), new THREE.MeshBasicMaterial({ map: signTexture(['VIRTUAL EXHIBITION', hall.title, `${list.length} exhibits at true size`, ''], 1536, 512), toneMapped: false }));
    title.position.set(0, 6, zBack + 0.08); title.scale.setScalar(1.6); this.hallGroup.add(title);
    { const m = new THREE.Mesh(new THREE.BoxGeometry(13 * 1.6 + 0.8, 4.3 * 1.6 + 0.8, 0.12), M.blackGlass); m.position.set(0, 6, zBack + 0.02); this.hallGroup.add(m); }      // a polished black glass panel behind the title
    {   // the welcome board, front right of where you come in, turned to face you; it reads from both sides
      const tex = this.whyTex || (this.whyTex = whyTexture()), W = 4.8, H = 3.0;
      const b = new THREE.Group(); b.position.set(3.1, 0, 4.2); b.rotation.y = Math.atan2(-3.1, 8.8); this.hallGroup.add(b);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); face.position.set(0, 2.0, 0.045); b.add(face);
      const back = new THREE.Mesh(face.geometry, face.material); back.rotation.y = Math.PI; back.position.set(0, 2.0, -0.045); b.add(back);
      const fr = new THREE.Mesh(new THREE.BoxGeometry(W + 0.16, H + 0.16, 0.08), M.blackGlass); fr.position.y = 2.0; b.add(fr);
      for (const x of [-W * 0.36, W * 0.36]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), M.steel); leg.position.set(x, 0.25, 0); b.add(leg); const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.7), M.steel); foot.position.set(x, 0.02, 0); b.add(foot); }
    }
    {   // the flag of the United States on a tall pole, front left of where you come in: a symbol, not an exhibit
      const tex = this.flagTex || (this.flagTex = flagTexture()), g = new THREE.Group(); g.position.set(-3.4, 0, 4.6); g.rotation.y = Math.atan2(3.4, 8.4); this.hallGroup.add(g);
      const PH = 4.6, pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, PH, 16), M.steel); pole.position.y = PH / 2; g.add(pole);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd9ab45, metalness: 1, roughness: 0.25 })); ball.position.y = PH + 0.06; g.add(ball);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.12, 24), M.steel); base.position.y = 0.06; g.add(base);
      const geo = new THREE.PlaneGeometry(1.9, 1.0, 28, 14); geo.translate(0.95 + 0.045, 0, 0);
      const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.85, metalness: 0 }));
      cloth.position.y = PH - 0.58; cloth.castShadow = false; g.add(cloth);
      this.flag = { geo, base: Float32Array.from(geo.attributes.position.array) };
    }
    this._captureEnv((zFront + zBack) / 2);
    this.roomX = WX; this.roomZ = [zBack, zFront]; this.roomH = WH;
    // you stop short of the filter wall and of the stairs under the galleries
    this.wallX = WX - GD - 2.2; this.zFront = zFront - 1.2;
    this.zMin = zBack + 1.2;
    this.pos = new THREE.Vector3(0, EYE, 13); this.baseY = EYE; this.jumpY = 0; this.vy = 0; this.yaw = 0; this.pitch = -0.05; this.glide = null; this.near = -1; this._key = ''; this.wake = performance.now() / 1000 + 4;
    this._label(-1);
  }

  _build(ex) {
    const q = ex.q; let m;
    // every Apollo lander is the same NASA model: build and fuse it once, then reuse it
    const part = q.isProbe ? null : (q.parts.find((p) => p.hall) || q.parts[0]);
    ex.kind = q.isProbe ? `probe:${q.model}` : (SHARED.has(part.type) ? part.type : null);
    const ready = ex.kind && this.fusedCache.get(ex.kind);
    if (ready) {
      m = ready.clone(true); m.position.y = q.isProbe ? 4.2 : 0; m.rotation.y = ex.side * 0.6; ex.fused = true; ex.model = m; ex.g.add(m);
      if (q.isProbe) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 8), new THREE.MeshStandardMaterial({ color: 0x556070, metalness: 0.6, roughness: 0.4 })); pole.position.y = 2.2; ex.g.add(pole); }
      return;
    }
    if (q.isProbe) { m = buildModel(q.model); m.position.y = 4.2; if (m.userData.webbUp) m.children[0].rotation.x = 0; const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 8), new THREE.MeshStandardMaterial({ color: 0x556070, metalness: 0.6, roughness: 0.4 })); pole.position.y = 2.2; ex.g.add(pole); }
    else if (q.parts[0].type === 'impact') m = craterExhibit(q.parts[0].crater || 13);
    else { let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; m = buildPart({ ...(q.parts.find((p) => p.hall) || q.parts[0]), e: 0, n: 0, heading: 0 }, rnd); m.position.y = 0; }      // straight on the floor, no plinth
    m.rotation.y = ex.side * 0.6;      // turned a little toward the aisle; it stands still
    // In the hall the floor is the museum's, not the Moon's: hide the flat dark ground marks
    // (blast scorch, ejecta streaks) that some models carry, because here they read as shadows.
    m.updateWorldMatrix(true, true);
    m.traverse((o) => {
      o.castShadow = false; o.receiveShadow = false;
      if (!o.isMesh || !o.geometry) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld), sz = bb.getSize(new THREE.Vector3());
      if (sz.y < 0.06 && Math.max(sz.x, sz.z) > 1.5 && bb.min.y - ex.g.position.y < 0.2) o.visible = false;
    });
    ex.model = m; ex.g.add(m);
  }

  _move(fwd, right) {
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    const p = this.pos;
    p.x += -sy * fwd + cy * right; p.z += -cy * fwd - sy * right;
    p.x = Math.max(-this.wallX, Math.min(this.wallX, p.x)); p.z = Math.max(this.zMin, Math.min(this.zFront, p.z));   // stay inside the hall
    // No glass and no rope: you can step onto a plinth and walk right up to (or into) the exhibit.
    this.floorY = 0;
  }

  _step(dir) {
    if (!this.exhibits.length) return;
    const i = this.near < 0 ? (dir > 0 ? 0 : this.exhibits.length - 1) : (this.near + dir + this.exhibits.length) % this.exhibits.length;
    this._goTo(i);
  }
  _goTo(i) {
    const ex = this.exhibits[i]; if (!ex) return;
    const d = ex.q.stand || PLINTH_R + 4.5;              // small pieces are looked at from close by
    const to = new THREE.Vector3(ex.x - ex.side * d, EYE, ex.z - 1.5 * d / (PLINTH_R + 4.5));
    const yaw = Math.atan2(-(ex.x - to.x), -(ex.z - to.z));
    this.glide = { from: this.pos.clone(), to, yaw0: this.yaw, yaw1: yaw, p0: this.pitch, p1: ex.q.stand ? Math.atan2(ex.q.lookY - EYE, d) : ex.q.parts[0].type === 'impact' ? -0.22 : 0.08, t: 0 };
    this.near = i; this._label(i);
  }
  _pick(x, y) {
    const r = this.canvas.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1), this.camera);
    const hit = this.ray.intersectObjects(this.exhibits.map((e) => e.hit), false)[0];
    if (hit) { this.near = hit.object.userData.i; this._label(this.near); this._inspect(); }
  }
  _setView(third) {
    this.third = third; this.avatar.visible = third;
    if (third && this.pitch > -0.15) this.pitch = -0.28;      // from behind and a little above
    if (!third && this.pitch < -0.4) this.pitch = -0.08;
    this.bodyYaw = this.yaw; this._lx = this._lz = undefined; this.wake = performance.now() / 1000 + 1;
    const b = this.root.querySelector('.m-view'); if (b) { b.setAttribute('aria-pressed', String(third)); b.textContent = third ? '1st person' : '3rd person'; }
  }
  _inspect() { const ex = this.exhibits[this.near]; if (ex) { this.keys.clear(); this.onOpenExhibit(ex.q); } }
  _label(i) {
    if (this._shown === i && i !== -1) return; this._shown = i;
    const ex = this.exhibits && this.exhibits[i], $ = (s) => this.root.querySelector(s);
    $('.m-name').textContent = ex ? ex.q.name : 'Walk up to an exhibit';
    $('.m-parts').textContent = ex ? partNames(ex.q).join(' · ') : 'or use the arrows to visit them one by one';
    $('.m-inspect').disabled = !ex;
  }

  _tick(dt, now) {
    if (this.flag) {           // the flag ripples gently: a slow wave running out from the pole, growing toward the free edge
      const { geo, base } = this.flag, p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], k = Math.max(0, x - 0.045) / 1.9; p.setZ(i, (Math.sin(x * 3.1 - now * 2.2 + y * 0.8) * 0.07 + Math.sin(x * 7.3 - now * 3.4) * 0.018) * k); p.setY(i, y - k * k * 0.05); }
      p.needsUpdate = true; geo.computeVertexNormals();
    }
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) {
      // always the screen's own pixels (up to 3.2 million), whatever the browser zoom: never blurry
      this._w = w; this._h = h; this._dpr = dpr;
      this.renderer.setPixelRatio(Math.max(1, Math.min(dpr, Math.sqrt(4.2e6 / (w * h)))));
      this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    }
    const K = this.keys;
    if (this.glide) {
      const gl = this.glide; gl.t = Math.min(1, gl.t + dt / 0.9); const e = gl.t * gl.t * (3 - 2 * gl.t);
      const yNow = this.pos.y; this.pos.lerpVectors(gl.from, gl.to, e); this.pos.y = yNow; this.floorY = 0;
      let dy = gl.yaw1 - gl.yaw0; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      this.yaw = gl.yaw0 + dy * e; this.pitch = gl.p0 + (gl.p1 - gl.p0) * e;
      if (gl.t >= 1) this.glide = null;
    } else {
      const sp = (K.has('shift') ? 13 : 6.5) * dt;
      const f = (K.has('w') || K.has('arrowup') ? 1 : 0) - (K.has('s') || K.has('arrowdown') ? 1 : 0), r = (K.has('d') ? 1 : 0) - (K.has('a') ? 1 : 0);
      this.yaw += ((K.has('arrowleft') ? 1 : 0) - (K.has('arrowright') ? 1 : 0)) * 1.45 * dt;
      if (f || r) this._move(f * sp / Math.hypot(f, r), r * sp / Math.hypot(f, r));
      // the nearest exhibit within reach becomes the current one
      let best = -1, bd = 16;
      for (const ex of this.exhibits) { const d = Math.hypot(this.pos.x - ex.x, this.pos.z - ex.z); if (d < bd) { bd = d; best = ex.i; } }
      if (best !== this.near) { this.near = best; this._label(best); }
    }
    if (this.baseY == null) this.baseY = this.pos.y;
    this.baseY += ((EYE + (this.floorY || 0)) - this.baseY) * Math.min(1, dt * 10);      // step up onto a plinth smoothly
    // Space: jump. Earth gravity (9.8 m/s²), take-off at 4.2 m/s, so about 0.9 m up and 0.86 s in the air
    if ((K.has(' ') || this.jumpReq) && !(this.jumpY > 0) && !this.glide) this.vy = 4.2;
    this.jumpReq = false;
    if (this.vy || this.jumpY > 0) {
      this.vy -= 9.8 * dt; this.jumpY = (this.jumpY || 0) + this.vy * dt;
      if (this.jumpY <= 0) { this.jumpY = 0; this.vy = 0; }
      this.wake = now + 0.3;
    }
    this.pos.y = this.baseY + (this.jumpY || 0);
    this.camera.quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
    if (this.third) {
      // you, seen from behind and above: the camera keeps the same offset from you, so it moves exactly as you move;
      // dragging turns it around you
      const A = this.avatar, feetY = this.pos.y - EYE;
      const dx = this.pos.x - (this._lx ?? this.pos.x), dz = this.pos.z - (this._lz ?? this.pos.z), v = Math.hypot(dx, dz) / Math.max(dt, 1e-3);
      this._lx = this.pos.x; this._lz = this.pos.z;
      if (v > 0.3) { const head = Math.atan2(-dx, -dz); let d = head - this.bodyYaw; d = Math.atan2(Math.sin(d), Math.cos(d)); this.bodyYaw += d * Math.min(1, dt * 10); this.wake = now + 0.6; }
      const stride = Math.min(1, v / 6.5);
      this.walkPh += dt * Math.max(v, 0) * 1.7;
      this._swing = (this._swing || 0) + ((v > 0.3 ? stride : 0) - (this._swing || 0)) * Math.min(1, dt * 8);
      const sw = Math.sin(this.walkPh) * 0.55 * this._swing;
      A.userData.legL.rotation.x = sw; A.userData.legR.rotation.x = -sw; A.userData.armL.rotation.x = -sw * 0.8; A.userData.armR.rotation.x = sw * 0.8;
      A.position.set(this.pos.x, feetY + Math.abs(Math.sin(this.walkPh)) * 0.04 * this._swing, this.pos.z); A.rotation.y = this.bodyYaw;
      const head = new THREE.Vector3(this.pos.x, feetY + 1.6, this.pos.z);
      const fwd = new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
      const cam = head.clone().addScaledVector(fwd, -5.2); cam.y += 0.35;
      cam.x = Math.max(-this.roomX + 0.4, Math.min(this.roomX - 0.4, cam.x)); cam.z = Math.max(this.roomZ[0] + 0.4, Math.min(this.roomZ[1] - 0.4, cam.z)); cam.y = Math.max(0.4, Math.min(this.roomH - 0.6, cam.y));
      this.camera.position.copy(cam);
    } else this.camera.position.copy(this.pos);
    // build models as you come near, draw only the ones around you, and turn them slowly
    // Models are built as you come near and only the ones around you are drawn (a lander is
    // more than 150 separate pieces, so every extra one on screen costs real time). The fog
    // hides the rest. Nothing moves on its own, so a still view is not redrawn at all.
    // The Earth turns below: about one turn every 12 minutes here, so you can watch the continents go by.
    if (this.earth) this.earth.rotation.y += dt * 0.0087;
    let vis = '';
    for (const ex of this.exhibits) {
      const d = Math.hypot(this.pos.x - ex.x, this.pos.z - ex.z);
      if (!ex.model && d < 42) { this._build(ex); this.wake = now + 4; }      // NASA models finish loading a moment later
      if (ex.model) {
        ex.model.visible = d < 75; if (ex.model.visible) vis += ex.i + ',';
        // once a model has finished arriving (its piece count stops changing), fuse its pieces
        if (!ex.fused) {
          let n = 0; ex.model.traverse((o) => { if (o.isMesh) n++; });
          if (n !== ex.count) { ex.count = n; ex.stable = now; }
          else if (n > 0 && now - ex.stable > 1.2) { ex.fused = true; if (n > 12) { try { fuse(ex.model); } catch (e) { console.warn('fuse failed', ex.q.id, e); } } if (ex.kind) this.fusedCache.set(ex.kind, ex.model); this.wake = now + 1; }
        }
      }
    }
    const key = `${this.pos.x.toFixed(3)},${this.pos.y.toFixed(3)},${this.pos.z.toFixed(3)},${this._dpr},${this.yaw.toFixed(4)},${this.pitch.toFixed(4)},${vis},${this._w}x${this._h}`;
    // Still view: nothing but the slow Earth moves, so a few frames a second are plenty.
    const moving = key !== this._key || now < this.wake;
    this._key = key;
    if (!moving && now - (this._drawn || 0) < 0.2) return;
    this._drawn = now;
    // always full sharpness in the hall: the resolution is never lowered here
    this.skyCam.quaternion.copy(this.camera.quaternion); this.skyCam.position.copy(this.camera.position);
    if (this.skyCam.aspect !== this.camera.aspect) { this.skyCam.aspect = this.camera.aspect; this.skyCam.updateProjectionMatrix(); }
    this.renderer.clear();
    this.renderer.render(this.sky, this.skyCam);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  }
}
