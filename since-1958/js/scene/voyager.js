// Voyager 1 and 2, rebuilt by hand to their real sizes, with every main part given the look of the
// material it is really made of. Metres; the big dish looks along +z (toward the Earth and the Sun),
// the science boom lies along +x and the three RTG power units along -x.
//
// Sizes and materials (NASA NSSDCA, NASA Science, NASA/JPL reports):
//   dish            3.66 m across, f/D 0.338; aluminium honeycomb with graphite-epoxy skins, painted white
//   subreflector    Kevlar-epoxy, lets S-band radio through and reflects X-band
//   bus             ten-sided, 1.78 m across the flats, 47 cm high
//   RTGs            three in a row, each 40.6 cm across and 50.8 cm long, in a beryllium case
//   magnetometer    13 m glass-fibre/epoxy lattice boom, sensors at 7 m and 13 m, from an aluminium can
//   radio antennas  two 10 m beryllium-copper tubes at right angles
//   Golden Record   30 cm gold-plated copper record under an aluminium cover
// The exact placing of small fittings, and the finish of parts no document describes, follow NASA photographs.
// No photograph is used as a texture: every surface pattern is drawn here.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0), DEG = Math.PI / 180;
const lcg = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const P = (aDeg, r, z) => V(Math.cos(aDeg * DEG) * r, Math.sin(aDeg * DEG) * r, z);     // a point around the z axis

const F = 1.237, RD = 1.83;                       // focal length and radius of the dish
const zd = (r) => r * r / (4 * F);                // height of the dish surface above its centre
const APO = 0.89, RC = APO / Math.cos(18 * DEG);  // bus: centre to a flat side, centre to a corner
const ZT = -0.30, ZB = -0.77, ZM = (ZT + ZB) / 2, BH = ZT - ZB;

// ---------------------------------------------------------------- drawn surface patterns
const TEX = {};
function tex(key, w, h, draw, { srgb = true, rx = 1, ry = 1 } = {}) {
  if (TEX[key]) return TEX[key];
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return (TEX[key] = t);
}
/** What the metal reflects: a dark studio with a few soft lamps, as in NASA's own photographs of the spacecraft. */
export function studio() {
  if (TEX.studio) return TEX.studio;
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d');
  const bg = x.createLinearGradient(0, 0, 0, 512); bg.addColorStop(0, '#454b57'); bg.addColorStop(0.45, '#1c1e23'); bg.addColorStop(0.55, '#141518'); bg.addColorStop(1, '#2c2c2e');
  x.fillStyle = bg; x.fillRect(0, 0, 1024, 512);
  const lamp = (cx, cy, w, h, col, a) => {
    for (let k = 0; k < 6; k++) { const s = 1 + (5 - k) * 0.28; x.globalAlpha = a * (k === 5 ? 1 : 0.16); x.fillStyle = col; x.fillRect(cx - w * s / 2, cy - h * s / 2, w * s, h * s); }
    x.globalAlpha = 1;
  };
  lamp(300, 70, 330, 80, '#ffffff', 1); lamp(770, 95, 190, 60, '#eef3ff', 0.85);                 // overhead soft boxes
  lamp(80, 250, 46, 190, '#ffffff', 0.9); lamp(560, 240, 34, 150, '#dfe8ff', 0.55);              // tall strip lights
  lamp(905, 265, 70, 110, '#fff0dc', 0.5);                                                       // a warm fill
  lamp(512, 495, 1024, 34, '#5a5a5c', 0.5);                                                      // the floor
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  return (TEX.studio = t);
}
/** crumpled blanket: tilted flat facets of every size with sharp creases between them, and a stitched seam along two edges */
export const crinkle = (key, rx, ry) => tex(key, 512, 512, (x, w, h) => {
  const r = lcg(23); x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 520; i++) {
    const cx = r() * w, cy = r() * h, s = 14 + r() * r() * 90, a0 = r() * 6.283, n = 3 + Math.floor(r() * 3), t = r() * 6.283, lo = Math.round(70 + r() * 50), hi = Math.round(140 + r() * 50);
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      if (cx + dx < -s || cx + dx > w + s || cy + dy < -s || cy + dy > h + s) continue;
      const g = x.createLinearGradient(cx + dx - Math.cos(t) * s, cy + dy - Math.sin(t) * s, cx + dx + Math.cos(t) * s, cy + dy + Math.sin(t) * s);
      g.addColorStop(0, `rgba(${lo},${lo},${lo},0.7)`); g.addColorStop(1, `rgba(${hi},${hi},${hi},0.7)`);
      x.fillStyle = g; x.beginPath();
      for (let k = 0; k < n; k++) { const a = a0 + k * 6.283 / n + (r() - 0.5) * 0.5; x.lineTo(cx + dx + Math.cos(a) * s, cy + dy + Math.sin(a) * s); }
      x.closePath(); x.fill();
    }
  }
  x.fillStyle = 'rgba(40,40,40,0.55)'; x.fillRect(0, 0, w, 4); x.fillRect(0, 0, 4, h);
  x.fillStyle = 'rgba(215,215,215,0.5)'; for (let i = 6; i < w; i += 14) { x.fillRect(i, 6, 7, 2); x.fillRect(6, i, 2, 7); }
}, { srgb: false, rx, ry });
/** the same blanket seen in plain light: every facet a slightly different dark grey */
export const blanket = (key, rx, ry) => tex(key, 256, 256, (x, w, h) => {
  const r = lcg(23); x.fillStyle = '#b4b4b4'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 420; i++) {
    const cx = r() * w, cy = r() * h, s = 7 + r() * r() * 45, a0 = r() * 6.283, n = 3 + Math.floor(r() * 3), v = Math.round(110 + r() * 145);
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      if (cx + dx < -s || cx + dx > w + s || cy + dy < -s || cy + dy > h + s) continue;
      x.fillStyle = `rgba(${v},${v},${Math.min(255, v + 6)},0.6)`; x.beginPath();
      for (let k = 0; k < n; k++) { const a = a0 + k * 6.283 / n; x.lineTo(cx + dx + Math.cos(a) * s, cy + dy + Math.sin(a) * s); }
      x.closePath(); x.fill();
    }
  }
}, { rx, ry });
/** uneven shine: soft blotches, so that no metal or paint is perfectly even (green channel = roughness) */
export const smudge = (scuffs = true) => tex(scuffs ? 'smudge' : 'smudge0', 256, 256, (x, w, h) => {
  const r = lcg(41); x.fillStyle = 'rgb(214,214,214)'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 160; i++) {
    const cx = r() * w, cy = r() * h, s = 10 + r() * 46, v = Math.round(150 + r() * 105);
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) { const g = x.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, s); g.addColorStop(0, `rgba(${v},${v},${v},0.5)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); x.fillStyle = g; x.fillRect(cx + dx - s, cy + dy - s, s * 2, s * 2); }
  }
  if (scuffs) for (let i = 0; i < 500; i++) { const v = Math.round(170 + r() * 85); x.fillStyle = `rgba(${v},${v},${v},0.35)`; x.fillRect(r() * w, r() * h, 1 + r() * 26, 1); }   // fine scuffs
}, { srgb: false, rx: 2, ry: 2 });
/** the white dish: twelve faint panel joints and a few rings */
const dishMap = () => tex('dishMap', 1024, 256, (x, w, h) => {
  const r = lcg(3); x.fillStyle = '#f6f5f1'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) { const cx = r() * w, cy = r() * h, s = 30 + r() * 90, g = x.createRadialGradient(cx, cy, 0, cx, cy, s); g.addColorStop(0, 'rgba(226,224,216,0.35)'); g.addColorStop(1, 'rgba(226,224,216,0)'); x.fillStyle = g; x.fillRect(cx - s, cy - s, s * 2, s * 2); }
  x.fillStyle = 'rgba(170,170,166,0.4)'; for (let i = 0; i < 12; i++) x.fillRect(Math.round(i * w / 12), 0, 1.5, h);
  x.fillStyle = 'rgba(150,150,146,0.35)'; for (const v of [0.42, 0.74]) x.fillRect(0, Math.round(h * v), w, 1.2);
});
/** a radiator shutter: a frame of thin polished blades */
const louverMap = (bump) => tex(bump ? 'louverB' : 'louver', 256, 256, (x, w, h) => {
  x.fillStyle = bump ? '#404040' : '#8d9198'; x.fillRect(0, 0, w, h);
  for (let j = 14; j < h - 14; j += 19) {
    const g = x.createLinearGradient(0, j, 0, j + 17);
    if (bump) { g.addColorStop(0, '#f0f0f0'); g.addColorStop(1, '#505050'); } else { g.addColorStop(0, '#f4f6f9'); g.addColorStop(0.7, '#c5c9d0'); g.addColorStop(1, '#6f747c'); }
    x.fillStyle = g; x.fillRect(16, j, w - 32, 17);
  }
  x.fillStyle = bump ? '#b0b0b0' : '#aeb2b9'; x.fillRect(w / 2 - 5, 8, 10, h - 16);                // the centre bar that turns the blades
  x.strokeStyle = bump ? '#d8d8d8' : '#c9ccd2'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
}, { srgb: !bump });
/** the engraved cover of the Golden Record: how to play it, the pulsar map and the hydrogen atom (NASA's own design) */
const recordMap = (bump) => tex(bump ? 'recordB' : 'record', 512, 512, (x, w, h) => {
  x.fillStyle = bump ? '#c8c8c8' : '#ffcf73'; x.fillRect(0, 0, w, h);
  if (!bump) { const r = lcg(8); for (let i = 0; i < 1400; i++) { const a = r() * 6.283, d = r() * 250, v = 236 + r() * 19; x.fillStyle = `rgba(${v},${v * 0.8},${v * 0.42},0.25)`; x.fillRect(256 + Math.cos(a) * d, 256 + Math.sin(a) * d, 12, 1); } }
  x.strokeStyle = bump ? '#3a3a3a' : '#7a5a16'; x.fillStyle = x.strokeStyle; x.lineWidth = 2.2; x.lineCap = 'round';
  const circ = (cx, cy, r) => { x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.stroke(); };
  const line = (a, b, c, d) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
  // the record seen from above, with the time of one turn written around it in binary
  circ(165, 150, 64); circ(165, 150, 22); circ(165, 150, 4);
  for (let k = 0; k < 44; k++) { const a = -2.6 + k * 0.118, r0 = 72, r1 = k % 3 ? 79 : 84; line(165 + Math.cos(a) * r0, 150 + Math.sin(a) * r0, 165 + Math.cos(a) * r1, 150 + Math.sin(a) * r1); }
  line(205, 96, 238, 78); x.fillRect(232, 70, 14, 10);
  // the record seen from the side, with the needle
  x.strokeRect(100, 246, 130, 9); line(214, 246, 226, 232); x.fillRect(222, 224, 12, 8);
  for (let k = 0; k < 14; k++) line(104 + k * 9, 262, 104 + k * 9, k % 2 ? 268 : 272);
  // how the pictures are stored: the wave, the scan lines, the first picture (a circle)
  x.strokeRect(292, 78, 150, 44); x.beginPath(); x.moveTo(296, 100); for (let k = 0; k <= 36; k++) x.lineTo(296 + k * 4, 100 + Math.sin(k * 0.9) * (6 + 8 * Math.sin(k * 0.21))); x.stroke();
  x.strokeRect(292, 138, 150, 104); for (let k = 0; k < 13; k++) line(300 + k * 11.2, 144, 300 + k * 11.2, 236);
  line(300, 144, 311, 236); line(311, 144, 322, 236);
  x.strokeRect(330, 258, 76, 76); circ(368, 296, 26);
  for (let k = 0; k < 16; k++) line(296 + k * 9, 128, 296 + k * 9, k % 2 ? 132 : 135);
  // where the Sun is: 14 pulsars, each line marked with its own pulse time
  const px = 150, py = 372, r = lcg(14);
  for (let k = 0; k < 14; k++) {
    const a = k * 0.449 + r() * 0.3, L = 34 + r() * 78, ex = px + Math.cos(a) * L, ey = py + Math.sin(a) * L * 0.86; line(px, py, ex, ey);
    for (let t = 0.5; t < 0.98; t += 0.07) { const tx = px + (ex - px) * t, ty = py + (ey - py) * t, nx = -(ey - py) / L, ny = (ex - px) / L, s = r() < 0.5 ? 2 : 4; line(tx - nx * s, ty - ny * s, tx + nx * s, ty + ny * s); }
  }
  line(px, py, px + 152, py);
  // the hydrogen atom in its two states: the clock used for every time on the cover
  circ(350, 410, 15); circ(412, 410, 15); line(365, 410, 397, 410); line(350, 395, 350, 380); line(412, 395, 412, 380); x.beginPath(); x.arc(350, 410, 3, 0, 6.283); x.arc(412, 410, 3, 0, 6.283); x.fill(); line(378, 404, 378, 416);
}, { srgb: !bump });
/** the subreflector: a pale composite shell printed with a fine grid of tiny metal crosses */
const fssMap = () => tex('fss', 256, 256, (x, w, h) => {
  x.fillStyle = '#cdbf9a'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(120,108,78,0.8)'; x.lineWidth = 1.4;
  for (let i = 8; i < w; i += 16) for (let j = 8; j < h; j += 16) { x.beginPath(); x.moveTo(i - 5, j); x.lineTo(i + 5, j); x.moveTo(i, j - 5); x.lineTo(i, j + 5); x.stroke(); }
}, { rx: 6, ry: 2 });
/** glass-fibre rod: straw-coloured, with the fibres running along it */
const fibreMap = () => tex('fibre', 64, 64, (x, w, h) => { const r = lcg(6); x.fillStyle = '#d9c47c'; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,100,50' : '255,244,200'},0.3)`; x.fillRect(r() * w, 0, 1, h); } });

// ---------------------------------------------------------------- materials
const MAT = {};
const mat = (key, o) => MAT[key] || (MAT[key] = new THREE.MeshStandardMaterial({ envMap: studio(), envMapIntensity: 1.25, ...o }));
const M = {
  paint: () => mat('paint', { color: 0xffffff, map: dishMap(), metalness: 0, roughness: 0.6, roughnessMap: smudge(false), side: THREE.DoubleSide, envMapIntensity: 0.7 }),
  paintBack: () => mat('paintBack', { color: 0xe9e6dc, metalness: 0, roughness: 0.72, roughnessMap: smudge(false), side: THREE.DoubleSide, envMapIntensity: 0.6 }),
  white: () => mat('white', { color: 0xf1f0ea, metalness: 0, roughness: 0.55, roughnessMap: smudge(), envMapIntensity: 0.7 }),
  mli: () => mat('mli', { color: 0x2c2c31, map: blanket('blanket', 1, 1), metalness: 0.25, roughness: 0.33, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 2.6, envMapIntensity: 1.6 }),
  mli2: () => mat('mli2', { color: 0x2c2c31, map: blanket('blanket3', 3, 3), metalness: 0.25, roughness: 0.33, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 2.2, side: THREE.DoubleSide, envMapIntensity: 1.15 }),
  goldFoil: () => mat('goldFoil', { color: 0xd9a441, metalness: 0.9, roughness: 0.3, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 1.2, envMapIntensity: 1.5 }),
  alu: () => mat('alu', { color: 0xd3d6db, metalness: 1, roughness: 0.42, roughnessMap: smudge() }),
  aluDark: () => mat('aluDark', { color: 0x8a8e96, metalness: 1, roughness: 0.5, roughnessMap: smudge() }),
  polished: () => mat('polished', { color: 0xe6e8ec, metalness: 1, roughness: 0.16, map: louverMap(false), bumpMap: louverMap(true), bumpScale: 1 }),
  titanium: () => mat('titanium', { color: 0x9c9892, metalness: 1, roughness: 0.4, roughnessMap: smudge() }),
  gold: () => mat('gold', { color: 0xffffff, map: recordMap(false), bumpMap: recordMap(true), bumpScale: 1.6, metalness: 1, roughness: 0.24, envMapIntensity: 1.6 }),
  goldPlain: () => mat('goldPlain', { color: 0xffc766, metalness: 1, roughness: 0.26, roughnessMap: smudge(), envMapIntensity: 1.6 }),
  goldMirror: () => mat('goldMirror', { color: 0xf2b36a, metalness: 1, roughness: 0.07, side: THREE.DoubleSide, envMapIntensity: 1.8 }),
  rtg: () => mat('rtg', { color: 0x1d1e21, metalness: 0.75, roughness: 0.5, roughnessMap: smudge(), envMapIntensity: 1.3 }),
  rtgCap: () => mat('rtgCap', { color: 0x4a4d53, metalness: 1, roughness: 0.45, roughnessMap: smudge() }),
  graphite: () => mat('graphite', { color: 0x1b1b1e, metalness: 0.15, roughness: 0.36, envMapIntensity: 1.4 }),
  fibre: () => mat('fibre', { color: 0xffffff, map: fibreMap(), metalness: 0, roughness: 0.45 }),
  becu: () => mat('becu', { color: 0xd49a5a, metalness: 1, roughness: 0.28 }),
  fss: () => mat('fss', { color: 0xffffff, map: fssMap(), metalness: 0.1, roughness: 0.6, side: THREE.DoubleSide }),
  glass: () => mat('glass', { color: 0x0a0f1c, metalness: 0.2, roughness: 0.04, envMapIntensity: 2.4 }),
  blackMatte: () => mat('blackMatte', { color: 0x0c0c0e, metalness: 0, roughness: 0.85, side: THREE.DoubleSide, envMapIntensity: 0.4 }),
  nozzle: () => mat('nozzle', { color: 0x6a6660, metalness: 1, roughness: 0.38, side: THREE.DoubleSide }),
  cable: () => mat('cable', { color: 0x1a1a1c, metalness: 0, roughness: 0.6, envMapIntensity: 0.6 }),
};

// ---------------------------------------------------------------- shape helpers
function mk(geo, material, p) { const o = new THREE.Mesh(geo, material); if (p) o.position.copy(p); return o; }
/** a round tube from a to b */
function tube(a, b, r, material, seg = 8) {
  const d = new THREE.Vector3().subVectors(b, a), o = mk(new THREE.CylinderGeometry(r, r, d.length(), seg), material);
  o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize()); return o;
}
/** a cylinder or cone centred on c, with its axis along dir (rTop is the radius at the dir end) */
function can(rTop, rBase, len, material, c, dir, seg = 28, open = false) { const o = mk(new THREE.CylinderGeometry(rTop, rBase, len, seg, 1, open), material, c); o.quaternion.setFromUnitVectors(UP, dir.clone().normalize()); return o; }
/** a box centred on c with its height along dir */
function slab(w, hgt, d, material, c, dir) { const o = mk(new THREE.BoxGeometry(w, hgt, d), material, c); if (dir) o.quaternion.setFromUnitVectors(UP, dir.clone().normalize()); return o; }
/** a shape turned on a lathe: profile [[radius, height], ...] measured from origin along dir */
function turned(profile, material, origin, dir, seg = 40) { const o = mk(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-4), y)), seg), material, origin); o.quaternion.setFromUnitVectors(UP, dir.clone().normalize()); return o; }
const Z = V(0, 0, 1);
const latheZ = (profile, material, seg = 48) => turned(profile, material, V(0, 0, 0), Z, seg);
function pipe(pts, r, material, seg = 6) { return mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), pts.length * 10, r, seg, false), material); }
function ring(R, r, material, c, dir, seg = 48) { const o = mk(new THREE.TorusGeometry(R, r, 8, seg), material, c); o.quaternion.setFromUnitVectors(Z, dir.clone().normalize()); return o; }
/** a group whose own x runs along a bus side, y along the spacecraft axis and z straight out of bay k */
function bay(k) {
  const a = k * 36 * DEG, g = new THREE.Group();
  g.applyMatrix4(new THREE.Matrix4().makeBasis(V(-Math.sin(a), Math.cos(a), 0), V(0, 0, 1), V(Math.cos(a), Math.sin(a), 0)).setPosition(Math.cos(a) * APO, Math.sin(a) * APO, ZM));
  return g;
}

/** Fuse one finished part into a single mesh per material and give it its name (and what it is made of),
 *  so that it draws fast and the 3D viewer can name it when it is clicked. */
function part(name, note, g) {
  g.updateWorldMatrix(true, true);
  const by = new Map();
  g.traverse((o) => { if (o.isMesh) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); } });
  const out = new THREE.Group(); out.name = name;
  for (const [material, list] of by) {
    const geos = list.map((o) => { const ge = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); ge.applyMatrix4(o.matrixWorld); for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') ge.deleteAttribute(k); return ge; });
    const merged = mergeGeometries(geos, false); if (!merged) continue;
    for (const ge of geos) ge.dispose();
    const m = new THREE.Mesh(merged, material); m.name = name; m.userData.note = note; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; out.add(m);
  }
  return out;
}

// ================================================================= the parts
function highGain() {
  const g = new THREE.Group();
  const prof = (off) => { const p = []; for (let i = 0; i <= 30; i++) { const r = 0.12 + (RD - 0.12) * i / 30; p.push([r, zd(r) + off]); } return p; };
  g.add(latheZ(prof(0), M.paint(), 120), latheZ(prof(-0.026), M.paintBack(), 120));
  g.add(latheZ([[RD, zd(RD) - 0.026], [RD + 0.014, zd(RD) - 0.022], [RD + 0.014, zd(RD) + 0.004], [RD, zd(RD)]], M.paintBack(), 120));       // the rim
  g.add(latheZ([[0.66, ZT], [0.7, ZT + 0.02], [0.74, ZT + 0.2], [0.8, zd(0.8) - 0.028]], M.paint(), 72));                                                // the white ring the dish stands on
  g.add(ring(0.74, 0.012, M.alu(), V(0, 0, ZT + 0.2), Z, 72), ring(0.68, 0.016, M.alu(), V(0, 0, ZT + 0.01), Z, 60));
  for (let k = 0; k < 10; k++) g.add(tube(P(36 * k + 18, RC, ZT), P(36 * k + 18, 0.7, ZT + 0.02), 0.012, M.alu()));                                          // spokes across the top of the bus
  for (let k = 0; k < 10; k++) {                                                                                                          // the outer struts, from every corner of the bus
    const c = P(36 * k + 18, RC, ZT);
    g.add(tube(c, P(36 * k, 1.42, zd(1.42) - 0.03), 0.011, M.alu()), tube(c, P(36 * k + 36, 1.42, zd(1.42) - 0.03), 0.011, M.alu()));
    g.add(mk(new THREE.SphereGeometry(0.02, 10, 8), M.alu(), P(36 * k, 1.42, zd(1.42) - 0.035)));
  }
  // the Sun sensor looks through a hole in the dish
  { const s = P(205, 1.22, 0); g.add(can(0.05, 0.05, 0.2, M.blackMatte(), V(s.x, s.y, zd(1.22) - 0.04), Z, 20), can(0.036, 0.036, 0.006, M.glass(), V(s.x, s.y, zd(1.22) + 0.062), Z, 20)); }
  return part('High-gain antenna (3.7 m dish)', 'Aluminium honeycomb between graphite-epoxy skins, painted white', g);
}

function feeds() {
  const g = new THREE.Group(), W = M.white(), A = M.alu();
  // X-band feed horn in the middle of the dish
  g.add(latheZ([[0.12, zd(0.12) - 0.026], [0.14, -0.05], [0.14, 0.014], [0.12, 0.014]], A, 40));
  g.add(latheZ([[0.045, 0.0], [0.05, 0.06], [0.112, 0.36], [0.124, 0.36], [0.124, 0.39], [0.108, 0.39], [0.05, 0.1]], W, 40));
  g.add(can(0.105, 0.105, 0.004, M.blackMatte(), V(0, 0, 0.3), Z, 32));
  // the subreflector, bulging toward the dish, on three two-legged supports
  { const p = []; for (let i = 0; i <= 12; i++) { const r = 0.29 * i / 12; p.push([r, 0.985 + 0.075 * (r / 0.29) * (r / 0.29)]); } g.add(latheZ(p, M.fss(), 64)); }
  g.add(ring(0.29, 0.013, A, V(0, 0, 1.06), Z, 64));
  for (const a of [30, 150, 270]) {
    const top = P(a, 0.3, 1.06);
    for (const s of [-13, 13]) { const r = 1.2, foot = P(a + s, r, zd(r)); g.add(tube(foot, top, 0.0125, W, 10), can(0.03, 0.036, 0.03, A, V(foot.x, foot.y, foot.z + 0.012), Z, 12)); }
    g.add(tube(top, P(a, 0.1, 1.15), 0.009, A));
  }
  // the S-band feed sits behind the subreflector; the low-gain antenna rides on top
  g.add(can(0.1, 0.1, 0.17, W, V(0, 0, 1.155), Z, 32), can(0.104, 0.104, 0.012, A, V(0, 0, 1.24), Z, 32));
  for (let k = 0; k < 4; k++) g.add(tube(P(45 + 90 * k, 0.29, 1.06), P(45 + 90 * k, 0.07, 1.45), 0.008, A));
  g.add(latheZ([[0.0, 1.44], [0.08, 1.44], [0.08, 1.47], [0.052, 1.63], [0.0, 1.63]], M.goldPlain(), 32));
  g.add(can(0.012, 0.012, 0.05, A, V(0, 0, 1.655), Z, 10));
  return part('Subreflector, feeds and low-gain antenna', 'Kevlar-epoxy mirror: S-band radio passes through it, X-band bounces off', g);
}

function bus() {
  const g = new THREE.Group(), A = M.alu();
  for (let k = 0; k < 10; k++) {
    const b = bay(k);
    b.add(mk(new THREE.BoxGeometry(2 * RC * Math.sin(18 * DEG) - 0.012, BH - 0.012, 0.03), M.mli(), V(0, 0, -0.016)));
    if ([1, 2, 4, 6, 7].includes(k)) {                                    // radiator shutters
      b.add(mk(new THREE.PlaneGeometry(0.4, 0.33), M.polished(), V(0, 0, 0.021)), mk(new THREE.BoxGeometry(0.43, 0.36, 0.02), M.aluDark(), V(0, 0, 0.009)));
    } else if (k !== 8) {                                                 // an access cover with its row of plugs
      b.add(mk(new THREE.BoxGeometry(0.44, 0.34, 0.012), M.mli(), V(0, 0, 0.006)));
      for (let i = 0; i < 3; i++) { const c = mk(new THREE.CylinderGeometry(0.016, 0.016, 0.03, 12), A, V(-0.12 + i * 0.12, -0.2, 0.012)); c.rotation.x = Math.PI / 2; b.add(c); }
    }
    g.add(b);
    const c0 = P(36 * k + 18, RC, ZB), c1 = P(36 * k + 18, RC, ZT);
    g.add(tube(c0, c1, 0.017, A, 10), tube(c1, P(36 * k + 54, RC, ZT), 0.012, A), tube(c0, P(36 * k + 54, RC, ZB), 0.012, A));
  }
  // top and bottom covers, open in the middle around the fuel tank
  const sh = new THREE.Shape(); for (let k = 0; k < 10; k++) { const c = P(36 * k + 18, RC - 0.006, 0); if (k) sh.lineTo(c.x, c.y); else sh.moveTo(c.x, c.y); } sh.closePath();
  const hole = new THREE.Path(); hole.absarc(0, 0, 0.375, 0, Math.PI * 2, true); sh.holes.push(hole);
  g.add(mk(new THREE.ShapeGeometry(sh, 40), M.mli2(), V(0, 0, ZT)), mk(new THREE.ShapeGeometry(sh, 40), M.mli2(), V(0, 0, ZB)));
  g.add(ring(0.375, 0.012, A, V(0, 0, ZB), Z, 48));
  return part('Electronics bus (10 bays)', 'Ten-sided box of electronics, 1.78 m across and 47 cm high, under black thermal blankets', g);
}

function record() {
  const b = bay(8);
  const cover = mk(new THREE.CylinderGeometry(0.156, 0.156, 0.018, 72), M.goldPlain(), V(0, 0, 0.03)); cover.rotation.x = Math.PI / 2; b.add(cover);
  b.add(mk(new THREE.CircleGeometry(0.153, 72), M.gold(), V(0, 0, 0.0395)));
  { const r = mk(new THREE.TorusGeometry(0.156, 0.005, 8, 72), M.goldPlain(), V(0, 0, 0.038)); b.add(r); }
  for (let k = 0; k < 3; k++) {                                            // three mounting lugs and their bolts
    const a = (90 + 120 * k) * DEG, x = Math.cos(a) * 0.172, y = Math.sin(a) * 0.172;
    b.add(mk(new THREE.BoxGeometry(0.045, 0.045, 0.02), M.alu(), V(x, y, 0.014)));
    const bolt = mk(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 6), M.aluDark(), V(x, y, 0.03)); bolt.rotation.x = Math.PI / 2; b.add(bolt);
  }
  b.add(mk(new THREE.BoxGeometry(0.05, 0.03, 0.022), M.goldPlain(), V(0.19, -0.17, 0.014)));                                             // the cartridge and needle, stored beside it
  return part('Golden Record', '30 cm gold-plated copper record under an aluminium cover engraved with how to play it', b);
}

function tankAndThrusters() {
  const g = new THREE.Group(), T = M.titanium(), N = M.nozzle();
  g.add(mk(new THREE.SphereGeometry(0.355, 48, 32), T, V(0, 0, ZM)), ring(0.3555, 0.006, M.aluDark(), V(0, 0, ZM), Z, 64));
  g.add(can(0.03, 0.04, 0.05, M.aluDark(), V(0, 0, ZM - 0.37), Z, 16));
  const noz = (o, d, s = 1) => g.add(turned([[0.007 * s, 0], [0.011 * s, 0.018 * s], [0.027 * s, 0.07 * s]], N, o, d, 16), can(0.012 * s, 0.012 * s, 0.03 * s, M.aluDark(), o.clone().addScaledVector(d.clone().normalize(), -0.012 * s), d, 10));
  for (const a of [54, 126, 234, 306]) {                                    // four clusters of small steering jets on the lower corners
    const c = P(a, RC + 0.045, ZB - 0.01), rad = P(a, 1, 0), tan = P(a + 90, 1, 0);
    g.add(slab(0.07, 0.07, 0.07, M.mli(), c, rad), tube(P(a, RC, ZB), c, 0.012, M.alu()));
    noz(c.clone().addScaledVector(Z, -0.04), V(0, 0, -1)); noz(c.clone().addScaledVector(tan, 0.04), tan); noz(c.clone().addScaledVector(tan, -0.04), tan.clone().negate());
    g.add(pipe([c, P(a, 0.7, ZB - 0.03), P(a, 0.4, ZB - 0.02), V(0, 0, ZM - 0.38)], 0.005, M.aluDark(), 5));                              // its fuel line
  }
  for (let k = 0; k < 4; k++) noz(P(45 + 90 * k, 0.56, ZB - 0.025), V(0, 0, -1), 1.7);                                                    // four larger jets for changing course
  return part('Hydrazine tank and 16 thrusters', 'One ball of fuel in the middle of the bus feeds every jet', g);
}

function sensors() {
  const g = new THREE.Group();
  for (const a of [142, 158]) {                                             // two star trackers on the rim of the bus
    const rad = P(a, 1, 0), c = P(a, RC + 0.1, ZT + 0.085);
    g.add(slab(0.13, 0.24, 0.13, M.mli(), c, rad), can(0.055, 0.045, 0.13, M.blackMatte(), c.clone().addScaledVector(rad, 0.185), rad, 20, true), can(0.04, 0.04, 0.004, M.glass(), c.clone().addScaledVector(rad, 0.125), rad, 20));
    g.add(tube(P(a, RC - 0.05, ZT), c, 0.012, M.alu()));
  }
  return part('Star trackers', 'They watch one bright star to keep the dish aimed at the Earth', g);
}

const SB0 = V(0.89, 0, -0.47), SB1 = V(2.75, 0, -0.37);                     // the science boom: where it starts and ends
const onBoom = (t) => SB0.clone().lerp(SB1, t);
function scienceBoom() {
  const g = new THREE.Group(), G = M.graphite();
  const A = [V(0.9, 0.27, -0.33), V(0.9, -0.27, -0.33), V(0.9, 0, -0.74)], B = [V(2.75, 0.11, -0.3), V(2.75, -0.11, -0.3), V(2.75, 0, -0.48)], N = 5;
  const at = (i, n) => A[i].clone().lerp(B[i], n / N);
  for (let i = 0; i < 3; i++) {
    g.add(tube(A[i], B[i], 0.019, G, 10), mk(new THREE.SphereGeometry(0.03, 10, 8), M.alu(), A[i]));
    for (let n = 0; n <= N; n++) { if (n) g.add(tube(at(i, n), at((i + 1) % 3, n), 0.011, G)); if (n < N) g.add(tube(at(i, n), at((i + 1) % 3, n + 1), 0.009, G)); }
    for (let n = 1; n <= N; n++) g.add(can(0.024, 0.024, 0.04, M.alu(), at(i, n), B[i].clone().sub(A[i]), 10));
  }
  g.add(slab(0.26, 0.02, 0.24, M.alu(), V(2.76, 0, -0.37), V(1, 0, 0)));
  g.add(pipe([V(0.92, 0.2, -0.4), onBoom(0.3).add(V(0, 0.12, 0.02)), onBoom(0.6).add(V(0, 0.09, 0.03)), V(2.74, 0.08, -0.33)], 0.014, M.cable(), 6));       // the cable harness
  g.add(pipe([V(0.92, -0.2, -0.42), onBoom(0.35).add(V(0, -0.1, 0.0)), onBoom(0.7).add(V(0, -0.08, 0.02)), V(2.74, -0.07, -0.34)], 0.009, M.goldFoil(), 6));
  return part('Science boom', 'A light 2.3 m truss that holds the instruments well away from the bus', g);
}

function cosmicRay() {
  const g = new THREE.Group(), c = onBoom(0.34).add(V(0, -0.24, 0.02));
  g.add(slab(0.21, 0.2, 0.22, M.mli(), c, V(0, 1, 0)), tube(onBoom(0.34), c, 0.014, M.alu()));
  for (const d of [V(0, -1, 0.35), V(0.6, -0.8, 0), V(-0.6, -0.8, 0), V(0, -0.45, 0.9), V(0.3, -0.5, -0.8), V(-0.3, -0.5, -0.8)]) {
    const n = d.clone().normalize(), o = c.clone().addScaledVector(n, 0.15);
    g.add(can(0.034, 0.03, 0.11, M.goldPlain(), o, n, 16), can(0.027, 0.027, 0.004, M.blackMatte(), o.clone().addScaledVector(n, 0.056), n, 16));
  }
  return part('Cosmic ray instrument', 'A cluster of small telescopes that count very fast particles from the Sun and the galaxy', g);
}

function lecp() {
  const g = new THREE.Group(), c = onBoom(0.52).add(V(0, 0.25, 0.03));
  g.add(slab(0.17, 0.2, 0.18, M.mli(), c, V(0, 1, 0)), tube(onBoom(0.52), c, 0.014, M.alu()));
  g.add(can(0.085, 0.085, 0.03, M.alu(), c.clone().add(V(0, 0, 0.105)), Z, 28), can(0.075, 0.075, 0.16, M.goldFoil(), c.clone().add(V(0, 0, 0.2)), Z, 28));   // the head that turns in steps
  g.add(can(0.03, 0.026, 0.09, M.alu(), c.clone().add(V(0, 0.1, 0.22)), V(0, 1, 0.2), 14), can(0.03, 0.026, 0.09, M.alu(), c.clone().add(V(0.08, -0.03, 0.24)), V(1, -0.3, 0.3), 14));
  g.add(slab(0.3, 0.008, 0.26, M.white(), c.clone().add(V(-0.02, 0, 0.3)), Z));                                                                                 // its sunshade
  return part('Low-energy charged particle instrument', 'Its detector head turns on a small stepper motor to scan the whole sky', g);
}

function plasma() {
  const g = new THREE.Group(), base = onBoom(0.76), c = base.clone().add(V(0, 0.04, 0.36));
  g.add(tube(base, c, 0.02, M.graphite(), 10), tube(base.clone().add(V(0.14, 0, 0)), c, 0.011, M.graphite()), tube(base.clone().add(V(-0.14, 0, 0)), c, 0.011, M.graphite()));
  g.add(can(0.16, 0.16, 0.11, M.goldFoil(), c.clone().add(V(0, 0, 0.055)), Z, 36));
  for (let k = 0; k < 3; k++) {                                              // three cups look toward the Earth, tilted apart
    const a = (90 + 120 * k) * DEG, n = V(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 1).normalize(), o = c.clone().add(V(Math.cos(a) * 0.082, Math.sin(a) * 0.082, 0.125));
    g.add(can(0.064, 0.064, 0.05, M.alu(), o, n, 24), can(0.054, 0.054, 0.004, M.blackMatte(), o.clone().addScaledVector(n, 0.026), n, 24));
  }
  { const n = V(0.25, -1, 0.05).normalize(), o = c.clone().add(V(0.04, -0.19, 0.05)); g.add(can(0.058, 0.058, 0.08, M.alu(), o, n, 24), can(0.048, 0.048, 0.004, M.blackMatte(), o.clone().addScaledVector(n, 0.041), n, 24)); }   // the fourth looks sideways
  return part('Plasma instrument', 'Four cups that catch the thin wind of charged gas from the Sun', g);
}

function scanPlatform() {
  const g = new THREE.Group(), b = V(0, -1, 0), A = M.alu(), Y = V(0, 1, 0);
  g.add(can(0.075, 0.075, 0.28, A, V(2.87, 0, -0.37), Y, 28), can(0.07, 0.07, 0.2, M.aluDark(), V(3.0, 0, -0.37), Z, 28));                         // the two motors that point it
  g.add(can(0.08, 0.08, 0.012, M.aluDark(), V(2.87, 0.146, -0.37), Y, 28), can(0.08, 0.08, 0.012, M.aluDark(), V(2.87, -0.146, -0.37), Y, 28));
  g.add(slab(0.3, 0.26, 0.42, M.mli(), V(3.27, 0.1, -0.44), Y));                                                                                    // the frame everything is bolted to
  for (const z of [-0.22, -0.66]) g.add(tube(V(3.1, 0.1, z), V(3.6, 0.1, z), 0.012, A), tube(V(3.1, -0.04, z), V(3.6, -0.04, z), 0.012, A));
  for (const x of [3.1, 3.6]) g.add(tube(V(x, 0.1, -0.22), V(x, 0.1, -0.66), 0.012, A), tube(V(x, -0.04, -0.22), V(x, -0.04, -0.66), 0.012, A));
  const scope = (x, z, r, y0, len, hood, name) => {
    g.add(can(r, r, len, M.mli2(), V(x, y0 - len / 2, z), b, 36));
    for (const t of [0.02, 0.5, 0.98]) g.add(can(r * 1.07, r * 1.07, 0.016, A, V(x, y0 - len * t, z), b, 36));
    g.add(can(r * 1.16, r * 1.04, hood, M.blackMatte(), V(x, y0 - len - hood / 2, z), b, 36, true), can(r * 1.19, r * 1.19, 0.012, A, V(x, y0 - len - hood + 0.004, z), b, 36, true));
    g.add(can(r * 0.9, r * 0.9, 0.006, M.glass(), V(x, y0 - len - 0.012, z), b, 36), can(r * 0.94, r * 0.94, 0.02, M.blackMatte(), V(x, y0 - len - 0.004, z), b, 36, true));
  };
  scope(3.13, -0.2, 0.088, -0.02, 0.62, 0.14);                             // narrow-angle camera: a telescope with a 1.5 m focal length
  scope(3.35, -0.18, 0.056, -0.05, 0.27, 0.09);                            // wide-angle camera
  scope(3.52, -0.56, 0.048, -0.06, 0.2, 0.07);                             // photopolarimeter
  g.add(slab(0.2, 0.16, 0.19, M.goldFoil(), V(3.13, 0.07, -0.2), Y), slab(0.13, 0.12, 0.13, M.goldFoil(), V(3.35, 0.03, -0.18), Y));              // their electronics, wrapped in gold foil
  g.add(slab(0.24, 0.006, 0.34, M.white(), V(3.13, -0.26, -0.085), Z), slab(0.16, 0.006, 0.2, M.white(), V(3.36, -0.16, -0.1), Z));               // white plates that shed the cameras' heat
  // infrared spectrometer: a 50 cm gold-coated telescope
  { const o = V(3.27, -0.14, -0.72), p = []; for (let i = 0; i <= 12; i++) { const r = 0.045 + 0.21 * i / 12; p.push([r, 0.07 * (r / 0.255) * (r / 0.255)]); }
    g.add(turned(p, M.goldMirror(), o, b, 64), ring(0.257, 0.011, A, o.clone().addScaledVector(b, 0.07), b, 64), turned([[0.05, -0.012], [0.262, 0.058]], M.aluDark(), o, b, 64), can(0.11, 0.14, 0.2, M.mli2(), o.clone().addScaledVector(b, -0.1), b, 28));
    const sec = o.clone().addScaledVector(b, 0.3); g.add(can(0.05, 0.05, 0.03, A, sec, b, 24), can(0.045, 0.045, 0.004, M.goldMirror(), sec.clone().addScaledVector(b, -0.017), b, 24));
    for (let k = 0; k < 3; k++) { const a = (90 + 120 * k) * DEG, rim = o.clone().addScaledVector(b, 0.07).add(V(Math.cos(a) * 0.255, 0, Math.sin(a) * 0.255)); g.add(tube(rim, sec, 0.005, A, 6)); }
    g.add(slab(0.3, 0.006, 0.2, M.white(), V(3.27, 0.12, -0.9), Z)); }                                                                              // its radiator, kept in shadow
  // ultraviolet spectrometer: a long box with a slotted opening
  g.add(slab(0.12, 0.46, 0.14, M.mli(), V(3.56, -0.2, -0.3), Y), slab(0.09, 0.012, 0.1, M.blackMatte(), V(3.56, -0.436, -0.3), Y), slab(0.14, 0.03, 0.16, A, V(3.56, -0.42, -0.3), Y));
  g.add(pipe([V(3.0, 0.1, -0.3), V(3.1, 0.22, -0.3), V(3.3, 0.24, -0.35), V(3.5, 0.16, -0.4)], 0.01, M.cable(), 6), pipe([V(3.2, 0.2, -0.5), V(3.28, 0.26, -0.6), V(3.27, 0.14, -0.7)], 0.008, M.cable(), 6));
  return part('Scan platform: cameras and spectrometers', 'Turns on two motors to aim two cameras and three other instruments', g);
}

const RTG_H = V(-1.55, 0, -0.6), RTG_D = V(-1, 0, -0.1).normalize();
function rtgs() {
  const g = new THREE.Group(), S = M.aluDark();
  for (const [a, z] of [[162, ZT - 0.03], [198, ZT - 0.03], [162, ZB + 0.03], [198, ZB + 0.03]]) g.add(tube(P(a, RC, z), RTG_H, 0.016, M.alu(), 10));          // the outrigger it hinges on
  g.add(tube(P(162, RC, ZT - 0.03), P(198, RC, ZB + 0.03), 0.01, M.alu()), can(0.05, 0.05, 0.16, S, RTG_H, V(0, 1, 0), 20));
  const q = new THREE.Quaternion().setFromUnitVectors(UP, RTG_D);
  for (let i = 0; i < 3; i++) {
    const u = new THREE.Group(), C = M.rtg(), K = M.rtgCap();
    u.add(mk(new THREE.CylinderGeometry(0.125, 0.125, 0.44, 40), C, V(0, 0.254, 0)));
    u.add(mk(new THREE.LatheGeometry([[0.06, 0], [0.105, 0.01], [0.125, 0.034]].map(([r, y]) => new THREE.Vector2(r, y)), 40), K), mk(new THREE.LatheGeometry([[0.125, 0.474], [0.105, 0.498], [0.06, 0.508]].map(([r, y]) => new THREE.Vector2(r, y)), 40), K));
    u.add(mk(new THREE.CylinderGeometry(0.06, 0.06, 0.002, 24), K, V(0, 0.001, 0)), mk(new THREE.CylinderGeometry(0.06, 0.06, 0.002, 24), K, V(0, 0.507, 0)));
    for (const y of [0.04, 0.254, 0.468]) u.add(mk(new THREE.CylinderGeometry(0.137, 0.137, y === 0.254 ? 0.008 : 0.014, 40), K, V(0, y, 0)));
    for (let k = 0; k < 6; k++) { const f = mk(new THREE.BoxGeometry(0.082, 0.42, 0.005), C); f.position.set(Math.cos(k * 60 * DEG) * 0.162, 0.254, -Math.sin(k * 60 * DEG) * 0.162); f.rotation.y = k * 60 * DEG; u.add(f); }
    u.add(mk(new THREE.CylinderGeometry(0.014, 0.014, 0.05, 10), M.alu(), V(0.09, 0.52, 0.05)));                                           // gas valve
    for (let k = 0; k < 4; k++) u.add(mk(new THREE.CylinderGeometry(0.009, 0.009, 0.056, 8), M.alu(), V(Math.cos(k * 1.5708 + 0.5) * 0.085, -0.027, Math.sin(k * 1.5708 + 0.5) * 0.085)));
    u.quaternion.copy(q); u.position.copy(RTG_H).addScaledVector(RTG_D, 0.14 + i * 0.564); g.add(u);
  }
  const side = V(0, 1, 0).multiplyScalar(0.115).add(V(0, 0, 0.09));
  g.add(pipe([P(180, RC, ZM), RTG_H.clone().add(V(0.1, 0.05, 0.06)), RTG_H.clone().addScaledVector(RTG_D, 0.5).add(side), RTG_H.clone().addScaledVector(RTG_D, 1.75).add(side)], 0.011, M.cable(), 6));   // the power cable
  return part('Three RTG power units', 'Heat from plutonium-238 turned straight into electricity; each one sits in a beryllium case', g);
}

const MAG0 = V(-1.05, 0.42, -0.42), MAG_D = V(-0.8, 0.18, 0.57).normalize(), MAG_L = 13;
function magBoom() {
  const g = new THREE.Group(), A = M.alu(), Fb = M.fibre(), W = M.white();
  g.add(can(0.13, 0.13, 0.55, A, MAG0.clone().addScaledVector(MAG_D, 0.275), MAG_D, 36), ring(0.132, 0.008, M.aluDark(), MAG0.clone().addScaledVector(MAG_D, 0.55), MAG_D, 40), ring(0.132, 0.008, M.aluDark(), MAG0.clone().addScaledVector(MAG_D, 0.02), MAG_D, 40));
  for (const [a, z] of [[144, ZT], [180, ZT], [162, ZB]]) g.add(tube(P(a, RC, z), MAG0.clone().addScaledVector(MAG_D, a === 162 ? 0.05 : 0.3), 0.012, A));     // three supports from the bus
  const u = new THREE.Vector3().crossVectors(MAG_D, Z).normalize(), v = new THREE.Vector3().crossVectors(MAG_D, u), NB = 87, bayL = MAG_L / NB, S = MAG0.clone().addScaledVector(MAG_D, 0.55);
  const pt = (n, i) => S.clone().addScaledVector(MAG_D, n * bayL).addScaledVector(u, Math.cos(i * 2.0944) * 0.115).addScaledVector(v, Math.sin(i * 2.0944) * 0.115);
  for (let i = 0; i < 3; i++) g.add(tube(pt(0, i), pt(NB, i), 0.0048, Fb, 6));                                                                                  // three long rods
  for (let n = 0; n <= NB; n++) for (let i = 0; i < 3; i++) {
    g.add(mk(tubeGeo(pt(n, i), pt(n, (i + 1) % 3), 0.003, 4), Fb));                                                                                             // the triangles between them
    if (n < NB) g.add(mk(n % 2 ? tubeGeo(pt(n, i), pt(n + 1, (i + 1) % 3), 0.0018, 3) : tubeGeo(pt(n, (i + 1) % 3), pt(n + 1, i), 0.0018, 3), M.aluDark()));    // the thin cross-wires
  }
  for (const d of [7, MAG_L]) {                                                                                                                                 // the two sensors, at 7 m and at the very end
    const c = S.clone().addScaledVector(MAG_D, d === MAG_L ? d + 0.05 : d);
    g.add(can(0.118, 0.118, 0.006, W, S.clone().addScaledVector(MAG_D, d), MAG_D, 3), can(0.045, 0.045, 0.1, W, c.clone().addScaledVector(u, d === MAG_L ? 0 : 0.17), d === MAG_L ? MAG_D : u, 20), can(0.02, 0.02, 0.05, M.blackMatte(), c.clone().addScaledVector(u, d === MAG_L ? 0 : 0.24).addScaledVector(MAG_D, d === MAG_L ? 0.07 : 0), d === MAG_L ? MAG_D : u, 12));
  }
  g.add(pipe([S, S.clone().addScaledVector(MAG_D, 4), S.clone().addScaledVector(MAG_D, 9), S.clone().addScaledVector(MAG_D, MAG_L)], 0.0035, M.cable(), 4));   // the sensor cable down the middle
  return part('Magnetometer boom (13 m)', 'Glass-fibre lattice that sprang out of its aluminium can after launch; nothing magnetic is allowed in it', g);
}
function tubeGeo(a, b, r, seg) {
  const d = new THREE.Vector3().subVectors(b, a), ge = new THREE.CylinderGeometry(r, r, d.length(), seg, 1, true);
  ge.applyMatrix4(new THREE.Matrix4().compose(a.clone().addScaledVector(d, 0.5), new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()), V(1, 1, 1)));
  return ge;
}

function radioAntennas() {
  const g = new THREE.Group(), m0 = V(-0.62, 0, ZB - 0.07);
  g.add(slab(0.13, 0.11, 0.13, M.mli(), m0, Z), tube(P(180, 0.7, ZB), m0, 0.012, M.alu()));
  for (const d of [V(-0.5, 0.7071, -0.5), V(-0.5, -0.7071, -0.5)]) {
    g.add(tube(m0, m0.clone().addScaledVector(d, 10), 0.0075, M.becu(), 8), can(0.016, 0.02, 0.26, M.alu(), m0.clone().addScaledVector(d, 0.16), d, 14));
  }
  return part('Radio and plasma-wave antennas (10 m each)', 'Two thin beryllium-copper tubes at right angles to each other', g);
}

function calTarget() {
  const g = new THREE.Group(), c = V(0.74, -0.52, -1.1), n = V(0.45, -0.35, -0.82).normalize();
  g.add(slab(0.44, 0.012, 0.44, M.white(), c, n), slab(0.46, 0.006, 0.46, M.alu(), c.clone().addScaledVector(n, -0.009), n));
  for (const a of [-18, -54]) g.add(tube(P(a, RC, ZB), c.clone().add(P(a, 0.12, 0.05)), 0.01, M.alu()));
  g.add(tube(P(-36, 0.5, ZB), c, 0.01, M.alu()));
  return part('Calibration plate and radiator', 'A plain white plate the cameras can look at to check their colours', g);
}

let proto = null;
/** The whole spacecraft. Built once; every later call gets a light copy that shares the same shapes and materials. */
export function voyager() {
  if (!proto) {
    proto = new THREE.Group(); proto.name = 'Voyager';
    proto.add(highGain(), feeds(), bus(), record(), tankAndThrusters(), sensors(), scienceBoom(), cosmicRay(), lecp(), plasma(), scanPlatform(), rtgs(), magBoom(), radioAntennas(), calTarget());
  }
  const g = proto.clone(true);
  g.userData.fit = new THREE.Box3(V(-3.9, -2.0, -1.45), V(3.9, 2.0, 1.75));       // frame the body, not the 13 m boom
  g.userData.studio = true;
  return g;
}
