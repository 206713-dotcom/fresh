// The James Webb Space Telescope, built by hand to NASA's published sizes, in the look of its real materials.
// Metres. y is up (the cold side); the mirror looks along +z; the sunshield lies below it; the Sun is underneath.
//   primary mirror   6.5 m, 18 hexagonal beryllium segments 1.32 m across, coated with 100 nm of gold
//   secondary mirror 0.74 m, on three folding struts; the black nose in the middle of the mirror holds the third
//                    mirror and the fine steering mirror
//   sunshield        21.2 m x 14.2 m, five layers of Kapton film coated with aluminium (and silicon on the two sunward layers),
//                    a shallow V that rises toward both ends, the layers fanning apart at the six corners
//   bus, solar array and antenna hang below the shield, on the hot side
// Sources: NASA Science Webb fact sheet and spacecraft diagram; shape checked against NASA drawings and renders.
// Small fittings (bolts, cable runs, blanket seams, thruster pods) are placed by eye from NASA photographs.
// The parts a film needs to move are kept separate: every mirror segment, both mirror wings, every shield layer.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { studio, crinkle, smudge, blanket } from './voyager.js';
import { addStars, milkyTexture } from './sky.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0), ZA = V(0, 0, 1);
export const WEBB = { YC: 4.75, ZM: -0.4, RC: 15.88, SEC: 7.1, R: 0.762 };       // mirror centre height, mirror plane, its radius of curvature, distance to the secondary, segment corner radius
const { YC, ZM, RC, R } = WEBB;
const sag = (x, y) => (x * x + y * y) / (2 * RC);

// Every plain material carries the same set of maps (a blank one where it has none), so the graphics card
// compiles one shader for all of them instead of one per combination: the film opens much sooner.
const px = (v) => { const t = new THREE.DataTexture(new Uint8Array([v, v, v, 255]), 1, 1); t.needsUpdate = true; return t; };
const BLANK = { map: px(255), bumpMap: px(128), bumpScale: 0, roughnessMap: px(255) };
const MAT = {};
const mat = (key, o) => MAT[key] || (MAT[key] = new THREE.MeshStandardMaterial({ envMap: studio(), envMapIntensity: 1.3, ...BLANK, ...o }));
function canvasTex(w, h, draw, rx = 1, ry = 1, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 16; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
let _film, _cells, _room, _iso, _weave, _osr, _rad, _seam;
/** what the gold mirror reflects besides the stars: deep space, the glow of the Milky Way, and one wide soft light so the gold keeps its colour */
function room() {
  if (_room) return _room;
  const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#05060b'; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'lighter'; x.drawImage(milkyTexture().image, 0, 0, W, H); x.globalAlpha = 0.8; x.drawImage(milkyTexture().image, 0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  const blob = (u, v, q, col, al) => { for (const dx of [-W, 0, W]) { const g = x.createRadialGradient(u * W + dx, v * H, 0, u * W + dx, v * H, q); g.addColorStop(0, `rgba(${col},${al})`); g.addColorStop(0.5, `rgba(${col},${al * 0.45})`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.fillRect(u * W + dx - q, v * H - q, q * 2, q * 2); } };
  x.globalCompositeOperation = 'lighter';
  blob(0.75, 0.56, 330, '255,246,230', 0.36); blob(0.75, 0.3, 200, '200,215,255', 0.16); blob(0.2, 0.42, 240, '255,235,210', 0.2); blob(0.45, 0.7, 180, '150,170,230', 0.1);
  _room = new THREE.CanvasTexture(c); _room.mapping = THREE.EquirectangularReflectionMapping; _room.colorSpace = THREE.SRGBColorSpace; return _room;
}
/** the shield film: a fine grid of seams welded into the membrane so that a tear cannot run, and a reinforced edge */
const filmMap = () => _film || (_film = canvasTex(2048, 512, (x, w, h) => {
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); const r = rng(5);
  for (let i = 0; i < 420; i++) { const cx = r() * w, cy = r() * h, q = 20 + r() * 110, v = 222 + r() * 33, g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, `rgba(${v},${v},${v},0.5)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); }
  x.fillStyle = 'rgba(140,142,152,0.34)'; for (let i = 0; i < 216; i++) x.fillRect(i * w / 216, 0, 1, h); for (let j = 1; j < 30; j++) x.fillRect(0, j * h / 30, w, 1);
  x.fillStyle = 'rgba(110,112,122,0.5)'; for (let i = 0; i < 36; i++) x.fillRect(i * w / 36, 0, 2, h); for (let j = 1; j < 6; j++) x.fillRect(0, j * h / 6, w, 2);
  x.fillStyle = 'rgba(70,72,80,0.75)'; x.fillRect(0, 0, w, 7); x.fillStyle = 'rgba(235,236,240,0.9)'; x.fillRect(0, 7, w, 2);          // v = 1 is the rim: a doubled, taped edge
}));
const cellMap = () => _cells || (_cells = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#b3bac8'; x.fillRect(0, 0, w, h); const r = rng(9); for (let i = 0; i < 16; i++) for (let j = 0; j < 10; j++) { const k = 0.8 + r() * 0.4; x.fillStyle = `rgb(${10 * k | 0},${17 * k | 0},${52 * k | 0})`; x.fillRect(i * w / 16 + 1.5, j * h / 10 + 1.5, w / 16 - 3, h / 10 - 3); x.fillStyle = 'rgba(200,208,235,0.35)'; x.fillRect(i * w / 16 + w / 32, j * h / 10 + 2, 1, h / 10 - 4); x.fillRect(i * w / 16 + 3, j * h / 10 + h / 20, w / 16 - 6, 0.7); } }));
/** the back of a beryllium segment: most of the metal is machined away, leaving a grid of thin triangular ribs */
const isoMap = (bump) => { if (!_iso) { const draw = (b) => canvasTex(512, 512, (x, w, h) => { x.fillStyle = b ? '#303030' : '#3c3e43'; x.fillRect(0, 0, w, h); x.strokeStyle = b ? '#ffffff' : '#8d9097'; x.lineWidth = b ? 5 : 4; const st = w / 9; for (const an of [0, Math.PI / 3, -Math.PI / 3]) { x.save(); x.translate(w / 2, h / 2); x.rotate(an); for (let k = -12; k <= 12; k++) { x.beginPath(); x.moveTo(-w, k * st * 0.866); x.lineTo(w, k * st * 0.866); x.stroke(); } x.restore(); } }, 1, 1, !b); _iso = [draw(false), draw(true)]; } return _iso[bump ? 1 : 0]; };
/** woven carbon fibre */
const weaveMap = () => _weave || (_weave = canvasTex(64, 64, (x, w, h) => { x.fillStyle = '#6a6a6a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const a = (i + j) % 2; x.fillStyle = a ? '#9a9a9a' : '#444444'; x.fillRect(i * 8 + (a ? 0 : 1), j * 8 + (a ? 1 : 0), a ? 8 : 6, a ? 6 : 8); } }, 1, 1, false));
/** radiator tiles: small second-surface mirrors glued edge to edge */
const osrMap = () => _osr || (_osr = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#7d8088'; x.fillRect(0, 0, w, h); const r = rng(3); for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { const v = 222 + r() * 30; x.fillStyle = `rgb(${v},${v},${v + 3})`; x.fillRect(i * w / 10 + 1, j * h / 10 + 1, w / 10 - 2, h / 10 - 2); } }));
const radMap = () => _rad || (_rad = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#17181c'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(120,124,135,0.35)'; for (let i = 0; i <= 8; i++) { x.fillRect(i * w / 8 - 1, 0, 2, h); x.fillRect(0, i * h / 8 - 1, w, 2); } x.fillStyle = 'rgba(200,205,215,0.55)'; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { x.beginPath(); x.arc(i * w / 8, j * h / 8, 3, 0, 7); x.fill(); } }));
/** blanket seams: stitched lines and the small tape patches that hold a blanket down */
const seamMap = () => _seam || (_seam = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); const r = rng(17); x.strokeStyle = 'rgba(60,45,20,0.55)'; x.lineWidth = 2; x.setLineDash([7, 5]); for (const p of [0.02, 0.5, 0.98]) { x.beginPath(); x.moveTo(p * w, 0); x.lineTo(p * w, h); x.stroke(); x.beginPath(); x.moveTo(0, p * h); x.lineTo(w, p * h); x.stroke(); } x.setLineDash([]); for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${150 + r() * 60},${105 + r() * 40},${30 + r() * 30},0.55)`; x.fillRect(r() * w, r() * h, 18 + r() * 22, 9 + r() * 6); } }));
const M = {
  gold: () => MAT.gold || (MAT.gold = addStars(new THREE.MeshStandardMaterial({ color: 0xffc35a, metalness: 1, roughness: 0.05, envMap: room(), envMapIntensity: 1.3 }), 9.0, 1.6)),
  beryl: () => mat('beryl', { color: 0x55575c, metalness: 0.9, roughness: 0.45, roughnessMap: smudge() }),
  berylBack: () => mat('berylBack', { color: 0xb9bcc4, map: isoMap(false), bumpMap: isoMap(true), bumpScale: 3, metalness: 0.9, roughness: 0.42 }),
  black: () => mat('black', { color: 0x101013, metalness: 0.15, roughness: 0.5, envMapIntensity: 1.0 }),
  cfrp: () => mat('cfrp', { color: 0x131316, metalness: 0.45, roughness: 0.36, bumpMap: weaveMap(), bumpScale: 0.6, roughnessMap: weaveMap(), envMapIntensity: 1.5 }),
  frill: () => mat('frill', { color: 0x0b0b0d, metalness: 0.2, roughness: 0.4, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 1.4, side: THREE.DoubleSide, envMapIntensity: 1.2 }),
  blackMli: () => mat('blackMli', { color: 0x26262b, map: blanket('blanket', 1, 1), metalness: 0.25, roughness: 0.35, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 2.4, envMapIntensity: 1.5 }),
  goldMli: () => mat('goldMli', { color: 0xd8a03a, map: seamMap(), metalness: 0.9, roughness: 0.3, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 1.8, envMapIntensity: 1.5 }),
  silverMli: () => mat('silverMli', { color: 0xdde1e8, map: seamMap(), metalness: 0.95, roughness: 0.28, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 1.8, envMapIntensity: 1.5 }),
  tape: () => mat('tape', { color: 0xc98a2a, metalness: 0.7, roughness: 0.32, envMapIntensity: 1.4 }),
  alu: () => mat('alu', { color: 0xd3d6db, metalness: 1, roughness: 0.4, roughnessMap: smudge() }),
  bolt: () => mat('bolt', { color: 0xe6e8ec, metalness: 1, roughness: 0.25, envMapIntensity: 1.6 }),
  invar: () => mat('invar', { color: 0x74777d, metalness: 1, roughness: 0.34, roughnessMap: smudge(), envMapIntensity: 1.3 }),
  white: () => mat('white', { color: 0xf0efe9, metalness: 0, roughness: 0.6 }),
  radiator: () => mat('radiator', { color: 0xffffff, map: radMap(), metalness: 0.45, roughness: 0.28, envMapIntensity: 1.5 }),
  osr: () => mat('osr', { color: 0xffffff, map: osrMap(), metalness: 1, roughness: 0.12, envMapIntensity: 1.7 }),
  cells: () => mat('cells', { map: cellMap(), metalness: 0.5, roughness: 0.2, envMapIntensity: 1.7 }),
  glass: () => mat('glass', { color: 0x0a0d18, metalness: 0.9, roughness: 0.08, envMapIntensity: 2.0 }),
  // the two sunward layers carry a silicon coating that looks pink-violet; the others are bare aluminium on the film
  film: (i) => MAT['film' + i] || (MAT['film' + i] = addStars(new THREE.MeshStandardMaterial({ envMap: studio(), color: i < 2 ? 0xf3a8dc : 0xeef1f8, map: filmMap(), metalness: 1, roughness: i < 2 ? 0.2 : 0.16, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 0.5, side: THREE.DoubleSide, envMapIntensity: i < 2 ? 0.95 : 1.0, emissive: 0x000000 }), 2.4, 0)),
};
function mk(geo, material, p) { const o = new THREE.Mesh(geo, material); if (p) o.position.copy(p); o.castShadow = true; o.receiveShadow = true; return o; }
function tube(a, b, r, material, seg = 8) { const d = new THREE.Vector3().subVectors(b, a), o = mk(new THREE.CylinderGeometry(r, r, d.length(), seg), material); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize()); return o; }
/** a square-section beam from a to b; its texture repeats every `tile` metres */
function bar(a, b, w, d, material, tile = 0.12) {
  const v = new THREE.Vector3().subVectors(b, a), L = v.length(), geo = new THREE.BoxGeometry(w, L, d), uv = geo.attributes.uv, dim = [[d, L], [d, L], [w, d], [w, d], [w, L], [w, L]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dim[f][0] / tile, uv.getY(i) * dim[f][1] / tile); }
  const o = mk(geo, material); o.position.copy(a).addScaledVector(v, 0.5); o.quaternion.setFromUnitVectors(UP, v.normalize()); return o;
}
const box = (w, h, d, material, x, y, z) => mk(new THREE.BoxGeometry(w, h, d), material, V(x, y, z));
const cylY = (r1, r2, h, material, x, y, z, seg = 24, open = false) => mk(new THREE.CylinderGeometry(r1, r2, h, seg, 1, open), material, V(x, y, z));
/** a bolt head at p, standing along n */
const BOLT = new THREE.CylinderGeometry(1, 1, 1, 6);
function bolt(grp, p, n = UP, r = 0.014, h = 0.012) { const o = mk(BOLT, M.bolt(), p); o.scale.set(r, h, r); o.quaternion.setFromUnitVectors(UP, n); grp.add(o); }
/** bolts round a circle of radius rad about c, in the plane across n */
function boltRing(grp, c, n, rad, count, r = 0.014, h = 0.012) { const q = new THREE.Quaternion().setFromUnitVectors(UP, n); for (let k = 0; k < count; k++) { const a = k / count * Math.PI * 2; bolt(grp, V(Math.cos(a) * rad, 0, Math.sin(a) * rad).applyQuaternion(q).add(c), n, r, h); } }
/** a panel lying in the plane across n, with a thin frame and a bolt in every corner: radiators, covers, doors */
function panel(grp, c, w, h, n, material, t = 0.03, frame = true) {
  const q = new THREE.Quaternion().setFromUnitVectors(ZA, n), g = new THREE.Group(); g.position.copy(c); g.quaternion.copy(q);
  g.add(mk(new THREE.BoxGeometry(w, h, t), material));
  if (frame) { const A = M.alu(); for (const s of [-1, 1]) g.add(mk(new THREE.BoxGeometry(w + 0.03, 0.03, t + 0.012), A, V(0, s * h / 2, 0)), mk(new THREE.BoxGeometry(0.03, h + 0.03, t + 0.012), A, V(s * w / 2, 0, 0))); const nx = Math.max(2, Math.round(w / 0.3)), ny = Math.max(2, Math.round(h / 0.3)); for (let i = 0; i <= nx; i++) for (const s of [-1, 1]) bolt(g, V(-w / 2 + i * w / nx, s * h / 2, t / 2 + 0.006), ZA, 0.011, 0.01); for (let j = 1; j < ny; j++) for (const s of [-1, 1]) bolt(g, V(s * w / 2, -h / 2 + j * h / ny, t / 2 + 0.006), ZA, 0.011, 0.01); }
  grp.add(g); return g;
}
function fuse(g) {
  g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert(), by = new Map();
  g.traverse((o) => { if (o.isMesh) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); } });
  const out = new THREE.Group(); out.position.copy(g.position); out.quaternion.copy(g.quaternion); out.scale.copy(g.scale);
  for (const [material, list] of by) { const geos = list.map((o) => { const ge = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); ge.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)); for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') ge.deleteAttribute(k); return ge; }); const m = new THREE.Mesh(mergeGeometries(geos, false), material); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; out.add(m); }
  return out;
}

/** the 18 segment centres, in the mirror's own plane: [x, y, isWing (-1, 0, 1)] */
export const SEGMENTS = (() => { const a = [], h = 1.32, c = 1.5 * R; for (const y of [-2 * h, -h, h, 2 * h]) a.push([0, y, 0]); for (const sx of [-1, 1]) { for (const y of [-1.5 * h, -0.5 * h, 0.5 * h, 1.5 * h]) a.push([sx * c, y, 0]); for (const y of [-h, 0, h]) a.push([sx * 2 * c, y, sx]); } return a; })();

let segProto = null;
/** one mirror segment with everything behind it: the ribbed beryllium body, the triangular frame it hangs from,
 *  six motors that tip and shift it, and a seventh in the middle that bends it to the right curve */
function segment() {
  if (!segProto) {
    const g = new THREE.Group(), A = M.alu(), K = M.black(), I = M.invar();
    const hex = new THREE.CylinderGeometry(R * 0.988, R * 0.972, 0.052, 6); hex.rotateY(Math.PI / 6); hex.rotateX(Math.PI / 2);
    g.add(mk(hex, M.beryl(), V(0, 0, -0.027)), mk(new THREE.CircleGeometry(R * 0.982, 6), M.gold(), V(0, 0, 0.0005)));
    const back = new THREE.CircleGeometry(R * 0.968, 6); back.rotateY(Math.PI); g.add(mk(back, M.berylBack(), V(0, 0, -0.0535)));
    // the triangular frame, 20 cm behind
    const zf = -0.235, P = [0, 1, 2].map((k) => { const a = k * 2.0944 + Math.PI / 2; return V(Math.cos(a) * 0.5, Math.sin(a) * 0.5, zf); });
    for (let k = 0; k < 3; k++) { g.add(bar(P[k], P[(k + 1) % 3], 0.045, 0.03, K), bar(P[k], V(0, 0, zf), 0.035, 0.03, K)); g.add(mk(new THREE.BoxGeometry(0.1, 0.1, 0.035), I, P[k])); bolt(g, P[k].clone().add(V(0, 0, -0.02)), V(0, 0, -1), 0.016, 0.014); }
    // six motors in three pairs; each pushes a thin rod that ends in a flexure glued to the beryllium
    for (let k = 0; k < 3; k++) for (const s of [-1, 1]) {
      const a = k * 2.0944 + Math.PI / 2, t = V(-Math.sin(a), Math.cos(a), 0), base = P[k].clone().addScaledVector(t, s * 0.075), pad = V(Math.cos(a + s * 0.62) * 0.47, Math.sin(a + s * 0.62) * 0.47, -0.058);
      const m = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12); const mo = mk(m, A, base.clone().add(V(0, 0, 0.055))); mo.rotation.x = Math.PI / 2; g.add(mo);
      const cap = mk(new THREE.CylinderGeometry(0.034, 0.034, 0.02, 12), K, base.clone().add(V(0, 0, -0.005))); cap.rotation.x = Math.PI / 2; g.add(cap);
      g.add(tube(base.clone().add(V(0, 0, 0.11)), pad, 0.008, I, 6), mk(new THREE.BoxGeometry(0.06, 0.06, 0.012), I, pad));
    }
    // the middle motor and its six thin struts to the corners
    const cen = new THREE.CylinderGeometry(0.042, 0.042, 0.17, 14); cen.rotateX(Math.PI / 2); g.add(mk(cen, A, V(0, 0, -0.145)));
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.add(tube(V(Math.cos(a) * 0.04, Math.sin(a) * 0.04, -0.2), V(Math.cos(a) * 0.66, Math.sin(a) * 0.66, -0.06), 0.006, I, 5)); }
    // a small electronics box and its cable
    g.add(mk(new THREE.BoxGeometry(0.12, 0.07, 0.04), M.tape(), V(0.16, -0.12, zf - 0.03)), tube(V(0.16, -0.12, zf - 0.03), V(0.42, -0.3, zf - 0.02), 0.009, M.tape(), 5));
    segProto = fuse(g);
  }
  return segProto.clone(true);
}

/** the outline of the shield seen from above, as a distance from the centre for every direction (a = 0 is forward, +z) */
const OUT = [[-3.1, 10.6], [3.1, 10.6], [7.08, 1.2], [4.6, -10.6], [-4.6, -10.6], [-7.08, 1.2]];
function rim(a) {
  const dx = Math.sin(a), dz = Math.cos(a); let best = 1e9;
  for (let i = 0; i < OUT.length; i++) { const [x1, z1] = OUT[i], [x2, z2] = OUT[(i + 1) % OUT.length], ex = x2 - x1, ez = z2 - z1, den = dx * ez - dz * ex; if (Math.abs(den) < 1e-9) continue; const t = (x1 * ez - z1 * ex) / den, u = (x1 * dz - z1 * dx) / den; if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, t); }
  return best;
}
/** height of layer i (0 = sunward) at its edge, in direction a: the shield rises toward both ends and a little to the sides, and the layers fan apart */
const rimY = (i, a, s = 1) => { const c = Math.cos(a), f = Math.max(0, c), b = Math.max(0, -c), sd = Math.sin(a); return -1.75 + s * (1.05 * f * f + 2.0 * b * b + 0.5 * sd * sd) + i * 0.34 * s + 0.5 * (1 - s); };
const midY = (i, s = 1) => -1.2 + i * 0.1 * (0.3 + 0.7 * s);
function layer(i) {
  const NA = 216, NT = 18, pos = [], uv = [], idx = [], shrink = 1 - i * 0.02;
  for (let j = 0; j <= NT; j++) for (let k = 0; k <= NA; k++) {
    const a = k / NA * Math.PI * 2, t = j / NT, r = rim(a) * shrink * t;
    pos.push(Math.sin(a) * r, 0, Math.cos(a) * r); uv.push(k / NA, t);
    if (j < NT && k < NA) { const p = j * (NA + 1) + k; idx.push(p, p + NA + 1, p + 1, p + 1, p + NA + 1, p + NA + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new THREE.Mesh(g, M.film(i)); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.userData.i = i; m.name = `Sunshield layer ${i + 1}`;
  return m;
}
/** shape the layers (s = 1 flying, 0 packed flat). Each layer is pulled taut from its six corners, so long shallow folds run out from the middle. */
export function spreadLayers(layers, s) {
  for (const m of layers) {
    const i = m.userData.i, p = m.geometry.attributes.position, u = m.geometry.attributes.uv, y0 = midY(i, s);
    for (let k = 0; k < p.count; k++) {
      const a = u.getX(k) * Math.PI * 2, t = u.getY(k), y1 = rimY(i, a, s);
      const fold = (Math.sin(a * 6 + i * 0.7) * 0.05 + Math.sin(a * 17 + i * 1.9) * 0.022 + Math.sin(a * 41 + i) * 0.008 + Math.sin(a * 83 + i * 2.3) * 0.004) * t * (1 - 0.35 * t) * (0.4 + 0.6 * s);
      p.setY(k, y0 + (y1 - y0) * Math.pow(t, 1.7) + fold);
    }
    p.needsUpdate = true; m.geometry.computeVertexNormals();
  }
}

export function webb() {
  const g = new THREE.Group(); g.name = 'James Webb Space Telescope';
  const K = M.black(), A = M.alu(), C = M.cfrp(), I = M.invar(), c = 1.5 * R, h = 1.32;
  // ---- the telescope: the mirror on its black frame
  const tel = new THREE.Group(); g.add(tel);
  const wings = { '-1': new THREE.Group(), '1': new THREE.Group() }, hingeX = c + R * 0.5 + 0.19;
  for (const s of [-1, 1]) { wings[s].position.set(s * hingeX, YC, ZM - 0.3); tel.add(wings[s]); }
  const segs = [], centre = new THREE.Group(), wingFix = { '-1': new THREE.Group(), '1': new THREE.Group() };
  const frillGeo = new THREE.CircleGeometry(R * 1.2, 6);
  SEGMENTS.forEach(([x, y, wing], n) => {
    const sgm = segment(), home = V(x, y + YC, ZM + sag(x, y)), q = new THREE.Quaternion().setFromUnitVectors(ZA, V(-x / RC, -y / RC, 1).normalize());
    const holder = new THREE.Group(); holder.add(sgm); holder.quaternion.copy(q);
    const parent = wing ? wings[wing] : tel, off = wing ? wings[wing].position : V(0, 0, 0);
    parent.add(holder); holder.position.copy(home).sub(off);
    sgm.userData = { n, home: home.clone(), x, y }; sgm.name = `Mirror segment ${n + 1}`; segs.push(sgm);
    const fr = mk(frillGeo, M.frill(), home.clone().add(V(0, 0, -0.09)).sub(off)); fr.quaternion.copy(q); (wing ? wingFix[wing] : centre).add(fr);          // the black edging that shows round every segment
  });
  // the frame: a honeycomb of carbon-fibre trusses behind the segments. Each is two long tubes joined by a zig-zag of thin ones,
  // with a metal fitting bolted on wherever trusses meet.
  const ZF = ZM - 0.36, ZB = ZM - 0.92, nodes = new Map();
  const truss = (grp, x1, y1, x2, y2, off) => {
    const a = V(x1, y1 + YC, 0).sub(V(off.x, off.y, 0)), b = V(x2, y2 + YC, 0).sub(V(off.x, off.y, 0)), L = a.distanceTo(b), n = Math.max(2, Math.round(L / 0.42));
    const zf = ZF - off.z, zb = ZB - off.z, at = (t, z) => a.clone().lerp(b, t).setZ(z);
    grp.add(bar(at(0, zf), at(1, zf), 0.075, 0.075, C), bar(at(0, zb), at(1, zb), 0.075, 0.075, C));
    for (let k = 0; k < n; k++) grp.add(bar(at(k / n, k % 2 ? zb : zf), at((k + 1) / n, k % 2 ? zf : zb), 0.04, 0.04, C, 0.06));
    for (const [x, y, p] of [[x1, y1, at(0, zb)], [x2, y2, at(1, zb)]]) { const key = `${grp.uuid}|${x.toFixed(2)}|${y.toFixed(2)}`; if (nodes.has(key)) continue; nodes.set(key, 1); grp.add(mk(new THREE.BoxGeometry(0.15, 0.15, 0.1), I, p), mk(new THREE.BoxGeometry(0.13, 0.13, 0.08), I, p.clone().setZ(zf))); for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) bolt(grp, p.clone().add(V(dx * 0.05, dy * 0.05, -0.056)), V(0, 0, -1), 0.013, 0.012); }
  };
  const Z0 = V(0, 0, 0);
  for (const x of [-c, 0, c]) truss(centre, x, -2.6 * h + (x ? 0.66 : 0), x, 2.6 * h - (x ? 0.66 : 0), Z0);
  for (const y of [-2 * h, -h, 0, h, 2 * h]) { truss(centre, -c - 0.55, y, c + 0.55, y, Z0); if (y) { truss(centre, -c, y, 0, y - Math.sign(y) * 0.66, Z0); truss(centre, c, y, 0, y - Math.sign(y) * 0.66, Z0); } }
  for (const s of [-1, 1]) {
    truss(centre, s * (c + 0.55), -2 * h, s * (c + 0.55), 2 * h, Z0);
    for (const y of [-h, 0, h]) truss(wingFix[s], s * (hingeX + 0.1), y, s * (2 * c + 0.6), y, wings[s].position);
    truss(wingFix[s], s * (2 * c + 0.1), -1.5 * h, s * (2 * c + 0.1), 1.5 * h, wings[s].position);
    for (const y of [-h, h]) { const p = V(s * hingeX, y + YC, ZM - 0.62).sub(wings[s].position); wingFix[s].add(mk(new THREE.CylinderGeometry(0.085, 0.085, 0.52, 16), A, p), mk(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16), I, p.clone().add(V(0, 0.2, 0))), mk(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16), I, p.clone().add(V(0, -0.2, 0)))); bolt(wingFix[s], p.clone().add(V(0, 0.27, 0)), UP, 0.03, 0.02); }      // the hinges the wings fold on
  }
  // the black nose in the middle of the mirror: a tapered tube with the third mirror and the steering mirror inside
  const AOS = V(0, YC, ZM + 1.62);
  { const KD = mat('blackD', { color: 0x0d0d10, metalness: 0.15, roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 1.0 });
    const t = new THREE.CylinderGeometry(0.3, 0.44, 1.55, 36, 1, true); t.rotateX(Math.PI / 2); centre.add(mk(t, KD, V(0, YC, ZM + 0.85)));
    const lip = new THREE.TorusGeometry(0.3, 0.022, 8, 36); centre.add(mk(lip, K, AOS));
    const mask = new THREE.RingGeometry(0.2, 0.3, 6, 1); centre.add(mk(mask, KD, AOS.clone().add(V(0, 0, -0.02))));                             // the entrance stop
    for (const z of [0.35, 0.9, 1.35]) { const rr = 0.44 - (z - 0.075) / 1.55 * 0.14 + 0.008, b = new THREE.TorusGeometry(rr, 0.012, 6, 36); centre.add(mk(b, I, V(0, YC, ZM + z))); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; bolt(centre, V(Math.cos(a) * (rr + 0.012), YC + Math.sin(a) * (rr + 0.012), ZM + z), V(Math.cos(a), Math.sin(a), 0), 0.009, 0.01); } }
    centre.add(box(0.34, 0.5, 0.9, K, 0.5, YC - 0.05, ZM + 0.5), box(1.0, 1.0, 0.12, K, 0, YC, ZM + 0.06));
    const sk = new THREE.CylinderGeometry(0.46, 0.66, 0.2, 6, 1, true); sk.rotateX(Math.PI / 2); centre.add(mk(sk, M.frill(), V(0, YC, ZM + 0.14)));
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.6, d = mk(new THREE.CircleGeometry(0.018, 10), M.white(), V(Math.cos(a) * 0.335, YC + Math.sin(a) * 0.335, ZM + 1.3)); d.lookAt(V(Math.cos(a) * 3, YC + Math.sin(a) * 3, ZM + 1.3)); centre.add(d); } }
  // the instrument module behind the mirror: a box wrapped in black film inside its support frame, with radiators
  const iz = ZM - 1.85;
  centre.add(box(2.3, 2.9, 1.8, M.blackMli(), 0, YC - 0.3, iz));
  for (const s of [-1, 1]) { panel(centre, V(s * 1.17, YC - 0.3, iz), 1.5, 2.5, V(s, 0, 0), M.radiator()); for (const y of [-1.2, 0.6]) centre.add(box(0.012, 0.03, 1.74, M.tape(), s * 1.153, YC + y, iz)); }
  panel(centre, V(0, YC - 1.0, ZM - 2.77), 2.1, 1.25, V(0, 0, -1), M.radiator()); panel(centre, V(0, YC + 0.42, ZM - 2.77), 2.1, 1.3, V(0, 0, -1), M.osr());
  for (const y of [-1.66, -0.3, 1.1]) centre.add(box(2.3, 0.03, 0.012, M.tape(), 0, YC + y, ZM - 0.945));
  // its support frame
  for (const s of [-1, 1]) {
    for (const [y1, y2] of [[-2.9, 1.9], [1.9, -2.9]]) centre.add(bar(V(s * 1.35, YC + y1, ZM - 0.95), V(s * 1.35, YC + y2, ZM - 2.8), 0.08, 0.08, C));
    centre.add(bar(V(s * 1.35, YC - 2.9, ZM - 2.8), V(s * 1.35, YC + 1.9, ZM - 2.8), 0.09, 0.09, C), bar(V(s * 1.35, YC + 1.9, ZM - 0.95), V(s * 1.35, YC + 1.9, ZM - 2.8), 0.09, 0.09, C), bar(V(s * 1.35, YC - 2.9, ZM - 0.95), V(s * 1.35, YC - 2.9, ZM - 2.8), 0.09, 0.09, C));
    for (const [y, z] of [[-2.9, ZM - 2.8], [1.9, ZM - 2.8], [-2.9, ZM - 0.95], [1.9, ZM - 0.95]]) { const p = V(s * 1.35, YC + y, z); centre.add(mk(new THREE.BoxGeometry(0.16, 0.16, 0.16), I, p)); for (const [dy, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) bolt(centre, p.clone().add(V(s * 0.086, dy * 0.05, dz * 0.05)), V(s, 0, 0), 0.014, 0.012); }
  }
  for (const y of [-2.9, 1.9]) centre.add(bar(V(-1.35, YC + y, ZM - 2.8), V(1.35, YC + y, ZM - 2.8), 0.09, 0.09, C));
  centre.add(bar(V(-1.35, YC - 2.9, ZM - 2.8), V(1.35, YC + 1.9, ZM - 2.8), 0.05, 0.05, C), bar(V(1.35, YC - 2.9, ZM - 2.8), V(-1.35, YC + 1.9, ZM - 2.8), 0.05, 0.05, C));
  { const r = panel(centre, V(0, YC + 2.45, ZM - 2.4), 2.2, 1.5, V(0, 0.878, -0.479), M.radiator(), 0.04); r.position.y += 0; centre.add(bar(V(-0.8, YC + 1.9, ZM - 2.2), V(-0.8, YC + 2.4, ZM - 2.4), 0.05, 0.05, C), bar(V(0.8, YC + 1.9, ZM - 2.2), V(0.8, YC + 2.4, ZM - 2.4), 0.05, 0.05, C)); }      // the radiator that folds out at the back
  // the electronics box under the instruments, with slanted plates that throw its heat out to the side
  centre.add(box(1.7, 0.62, 0.95, M.silverMli(), 0, YC - 2.42, ZM - 1.95));
  for (let k = 0; k < 6; k++) { const b = box(1.6, 0.012, 0.3, M.osr(), 0, YC - 2.68 + k * 0.1, ZM - 2.55); b.rotation.x = 0.5; centre.add(b); }
  centre.add(tube(V(0.35, YC - 2.7, ZM - 1.6), V(0.35, 1.8, ZM - 1.05), 0.022, M.tape(), 8), tube(V(-0.3, YC - 2.7, ZM - 1.6), V(-0.3, 1.8, ZM - 1.05), 0.015, I, 8));         // the helium lines of the cryocooler
  // a black skirt of film below the mirror keeps stray light out
  { const bib = new THREE.PlaneGeometry(4.6, 1.5, 12, 4), p = bib.attributes.position; for (let k = 0; k < p.count; k++) p.setZ(k, Math.sin(p.getX(k) * 2.2) * 0.05 + Math.sin(p.getY(k) * 5) * 0.03); bib.computeVertexNormals(); centre.add(mk(bib, M.frill(), V(0, YC - 3.9, ZM - 0.2))); }
  // the secondary mirror, far out in front on three folding struts. For launch the whole tripod was folded up over the
  // mirror: it turns about the feet of its two lower struts, and the upper strut bends at a knee in its middle.
  const SEC = V(0, YC, ZM + WEBB.SEC), PIV = V(0, YC - 2.95, ZM - 0.25), sm = new THREE.Group();
  { const d = new THREE.SphereGeometry(1.6, 48, 10, 0, Math.PI * 2, 0, 0.233); d.rotateX(-Math.PI / 2); sm.add(mk(d, M.gold(), V(0, YC, SEC.z + 1.6 - 0.02)));
    const can = new THREE.CylinderGeometry(0.4, 0.31, 0.3, 40); can.rotateX(Math.PI / 2); sm.add(mk(can, K, V(0, YC, SEC.z + 0.18)));
    const shade = new THREE.CylinderGeometry(0.43, 0.43, 0.3, 40, 1, true); shade.rotateX(Math.PI / 2); sm.add(mk(shade, M.frill(), V(0, YC, SEC.z + 0.02)));
    const hub = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 6); hub.rotateX(Math.PI / 2); sm.add(mk(hub, I, V(0, YC, SEC.z + 0.62)));
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, a2 = a + (k % 2 ? 0.5 : -0.5); sm.add(tube(V(Math.cos(a) * 0.3, YC + Math.sin(a) * 0.3, SEC.z + 0.33), V(Math.cos(a2) * 0.17, YC + Math.sin(a2) * 0.17, SEC.z + 0.6), 0.014, A, 6)); }
    boltRing(sm, V(0, YC, SEC.z + 0.335), ZA, 0.36, 18, 0.012, 0.012);
    for (const [x, y] of [[-2.1, -2.95], [2.1, -2.95]]) {
      const a = V(x, YC + y, ZM - 0.25), b = V(x * 0.1, YC + y * 0.075, SEC.z + 0.62), dir = b.clone().sub(a).normalize();
      sm.add(tube(a, b, 0.052, C, 12), tube(a.clone().addScaledVector(dir, 0.3).add(V(0.07, 0, 0)), b.clone().addScaledVector(dir, -0.4).add(V(0.07, 0, 0)), 0.008, M.tape(), 5));
      for (const t of [0.02, 0.985]) { const p = a.clone().lerp(b, t), f = tube(p.clone().addScaledVector(dir, -0.09), p.clone().addScaledVector(dir, 0.09), 0.07, I, 12); sm.add(f); }
      const mid = a.clone().lerp(b, y > 0 ? 0.5 : 0.62); sm.add(tube(mid.clone().addScaledVector(dir, -0.14), mid.clone().addScaledVector(dir, 0.14), 0.068, I, 12), tube(mid.clone().add(V(-0.1, 0, 0)), mid.clone().add(V(0.1, 0, 0)), 0.05, A, 12));          // the hinge it folds at
      sm.add(mk(new THREE.SphereGeometry(0.11, 14, 10), I, a), tube(b, V(x * 0.03, YC + y * 0.02, SEC.z + 0.62), 0.03, I, 8));
    } }
  // the upper strut: its foot sits on a bracket above the top of the mirror (so the strut clears the top segment),
  // its head on the hub. It is two halves joined at a knee; deploy() places them.
  const UPB = V(0, YC + 3.85, ZM - 0.3), UPT = V(0, YC + 0.29, SEC.z + 0.62);
  centre.add(mk(new THREE.SphereGeometry(0.11, 14, 10), I, UPB), bar(V(0, YC + 3.38, ZM - 0.64), UPB, 0.12, 0.12, C), bar(V(-0.3, YC + 3.38, ZM - 0.64), UPB, 0.06, 0.06, C), bar(V(0.3, YC + 3.38, ZM - 0.64), UPB, 0.06, 0.06, C));
  sm.add(mk(new THREE.SphereGeometry(0.09, 12, 8), I, UPT), tube(UPT, V(0, YC + 0.02, SEC.z + 0.62), 0.03, I, 8));
  const smF = fuse(sm); smF.position.copy(PIV).negate(); const smP = new THREE.Group(); smP.position.copy(PIV); smP.add(smF); smP.name = 'Secondary mirror and its tripod'; tel.add(smP);
  const halfGeo = new THREE.CylinderGeometry(0.052, 0.052, 1, 12); halfGeo.translate(0, 0.5, 0);
  const up1 = mk(halfGeo, C), up2 = mk(halfGeo, C), knee = mk(new THREE.CylinderGeometry(0.075, 0.075, 0.24, 14), I); knee.rotation.z = Math.PI / 2;
  tel.add(up1, up2, knee);
  const smss = { piv: smP, P: PIV, B: UPB, T0: UPT.clone().sub(PIV), S0: SEC.clone().sub(PIV), L: UPB.distanceTo(UPT) / 2, up1, up2, knee, sec: SEC.clone() };
  tel.add(fuse(centre)); for (const s of [-1, 1]) wings[s].add(fuse(wingFix[s]));
  // ---- the tower that lifts the telescope clear of the shield, and the struts that steady it
  const fixed = new THREE.Group(), tz = ZM - 1.3;
  fixed.add(cylY(0.4, 0.4, 1.9, M.goldMli(), 0, -0.6, tz, 32), cylY(0.34, 0.34, 1.5, M.goldMli(), 0, 0.95, tz, 32), cylY(0.52, 0.52, 0.14, A, 0, 1.72, tz, 32), cylY(0.44, 0.44, 0.07, I, 0, 0.33, tz, 32), cylY(0.5, 0.46, 0.25, A, 0, -1.55, tz, 32));
  boltRing(fixed, V(0, 1.795, tz), UP, 0.47, 24, 0.016, 0.014); boltRing(fixed, V(0, 0.37, tz), UP, 0.41, 20, 0.012, 0.012); boltRing(fixed, V(0, -1.42, tz), UP, 0.47, 24, 0.014, 0.012);
  fixed.add(box(0.16, 3.2, 0.03, M.tape(), 0, 0.1, tz + 0.41), box(0.1, 3.2, 0.03, I, 0.22, 0.1, tz + 0.36));                                                       // flat cable harnesses up the tower
  for (const s of [-1, 1]) fixed.add(bar(V(s * 1.3, 1.85, ZM - 0.95), V(s * 0.3, 1.72, tz), 0.07, 0.07, C), bar(V(s * 1.3, 1.85, ZM - 2.8), V(s * 0.3, 1.72, tz - 0.2), 0.07, 0.07, C));
  // ---- the bus, on the hot side
  const bz = tz, G = M.goldMli(), S = M.silverMli();
  fixed.add(box(2.5, 1.45, 2.7, G, 0, -2.6, bz), box(2.56, 0.42, 2.76, S, 0, -2.05, bz), box(2.3, 0.06, 2.4, A, 0, -3.36, bz));
  for (const y of [-2.28, -2.95]) for (const s of [-1, 1]) fixed.add(box(2.52, 0.025, 0.012, M.tape(), 0, y, bz + s * 1.357), box(0.012, 0.025, 2.72, M.tape(), s * 1.257, y, bz));
  for (const s of [-1, 1]) {
    panel(fixed, V(s * 1.27, -2.7, bz), 1.6, 1.0, V(s, 0, 0), M.osr(), 0.03);                                                                     // radiators of small mirror tiles
    const sh = box(0.02, 1.2, 1.7, S, s * 1.62, -2.35, bz); sh.rotation.z = s * 0.62; fixed.add(sh, tube(V(s * 1.27, -2.05, bz - 0.7), V(s * 1.9, -2.72, bz - 0.7), 0.012, A, 6), tube(V(s * 1.27, -2.05, bz + 0.7), V(s * 1.9, -2.72, bz + 0.7), 0.012, A, 6));      // and the shades that keep the Sun off them
    for (const e of [-1, 1]) {                                                                                                                    // thruster pods on the four lower corners
      const p = V(s * 1.18, -3.38, bz + e * 1.22); fixed.add(mk(new THREE.BoxGeometry(0.22, 0.14, 0.22), S, p));
      for (const [dx, dz] of [[s * 0.08, 0], [0, e * 0.08]]) { const n = new THREE.CylinderGeometry(0.018, 0.05, 0.11, 12, 1, true), nz = mk(n, mat('nozzle', { color: 0x8a6f5a, metalness: 1, roughness: 0.35, side: THREE.DoubleSide }), p.clone().add(V(dx, -0.12, dz))); fixed.add(nz); }
      fixed.add(box(0.26, 0.012, 0.26, A, p.x, p.y + 0.075, p.z));
    }
    fixed.add(box(0.07, 0.07, 0.07, K, s * 0.9, -1.8, bz + 1.3), box(0.07, 0.07, 0.07, K, s * 0.9, -1.8, bz - 1.3));                              // sun sensors
  }
  // three star trackers look out of the back
  for (const [x, tilt] of [[-0.55, -0.3], [0, 0], [0.55, 0.3]]) { const st = new THREE.Group(); st.position.set(x, -2.1, bz - 1.42); st.rotation.set(-0.9, 0, tilt); const tb = new THREE.CylinderGeometry(0.085, 0.06, 0.26, 20, 1, true); st.add(mk(tb, mat('trk', { color: 0x15151a, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide }), V(0, 0.13, 0)), mk(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 20), A, V(0, 0.26, 0)), mk(new THREE.BoxGeometry(0.16, 0.12, 0.16), S, V(0, -0.05, 0)), mk(new THREE.CircleGeometry(0.058, 16), M.glass(), V(0, 0.02, 0)).rotateX(-Math.PI / 2)); fixed.add(st); }
  // the ring that held it on the rocket
  fixed.add(cylY(1.1, 1.22, 0.3, A, 0, -3.54, bz, 48, true), cylY(1.24, 1.24, 0.05, I, 0, -3.7, bz, 48)); boltRing(fixed, V(0, -3.73, bz), V(0, -1, 0), 1.17, 48, 0.016, 0.014);
  fixed.add(mk(new THREE.CircleGeometry(1.1, 48), mat('busFloor', { color: 0x3a3b40, metalness: 0.8, roughness: 0.5 }), V(0, -3.5, bz)).rotateX(Math.PI / 2));
  // five solar panels in a row, on a yoke
  { const p = new THREE.Group(); p.position.set(0, -3.2, bz - 1.35); p.rotation.x = 0.36;
    for (let k = 0; k < 5; k++) { const z = -0.6 - k * 1.17; p.add(box(2.25, 0.03, 1.12, M.cells(), 0, 0, z), box(2.3, 0.018, 1.15, A, 0, -0.028, z), box(2.2, 0.01, 1.08, K, 0, -0.045, z)); for (const x of [-0.8, 0.8]) { const hg = new THREE.CylinderGeometry(0.022, 0.022, 0.16, 10); hg.rotateZ(Math.PI / 2); p.add(mk(hg, I, V(x, -0.03, z + 0.585))); } p.add(box(0.02, 0.012, 1.1, M.tape(), 0.4, -0.055, z)); }
    p.add(tube(V(-1.0, 0, 0), V(1.0, 0, 0), 0.05, A), tube(V(-0.6, 0.1, 0.35), V(-0.9, 0, 0), 0.03, C), tube(V(0.6, 0.1, 0.35), V(0.9, 0, 0), 0.03, C)); fixed.add(p); }
  // the antenna that talks to the Earth: a 60 cm dish and a small one beside it, on an arm that points them
  { const hx = 0.7, hz = bz + 1.75, WD = mat('dishW', { color: 0xf0efe9, metalness: 0, roughness: 0.6, side: THREE.DoubleSide });
    fixed.add(box(0.26, 0.2, 0.26, G, hx, -3.42, bz + 1.36), tube(V(hx, -3.5, bz + 1.4), V(hx, -3.95, hz), 0.035, A, 10));
    const mo = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16); mo.rotateZ(Math.PI / 2); fixed.add(mk(mo, I, V(hx, -3.97, hz)), cylY(0.06, 0.06, 0.14, I, hx, -3.88, hz, 16));
    const d = new THREE.SphereGeometry(0.75, 40, 10, 0, Math.PI * 2, 0, 0.4); d.rotateX(Math.PI); fixed.add(mk(d, WD, V(hx, -3.27, hz)));
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; fixed.add(tube(V(hx, -4.0, hz), V(hx + Math.cos(a) * 0.27, -3.975, hz + Math.sin(a) * 0.27), 0.008, A, 5)); }
    for (let k = 0; k < 3; k++) { const a = k * 2.0944 + 0.4; fixed.add(tube(V(hx + Math.cos(a) * 0.25, -3.985, hz + Math.sin(a) * 0.25), V(hx, -4.33, hz), 0.006, A, 5)); }
    fixed.add(cylY(0.055, 0.055, 0.02, A, hx, -4.33, hz, 16), cylY(0.02, 0.035, 0.1, A, hx, -4.07, hz, 12));
    const d2 = new THREE.SphereGeometry(0.3, 24, 8, 0, Math.PI * 2, 0, 0.36); d2.rotateX(Math.PI); fixed.add(mk(d2, WD, V(hx + 0.42, -3.72, hz)), tube(V(hx + 0.1, -3.97, hz), V(hx + 0.42, -4.0, hz), 0.012, A, 6), cylY(0.012, 0.012, 0.1, A, hx + 0.42, -4.07, hz, 8)); }
  g.add(fuse(fixed));
  // ---- the sunshield: five layers, the two long pallets they unroll from, the two side booms, and a spreader at each of the six corners
  const shield = new THREE.Group(); g.add(shield);
  const layers = []; for (let i = 0; i < 5; i++) { const m = layer(i); layers.push(m); shield.add(m); }
  spreadLayers(layers, 1);
  const fr = new THREE.Group();
  for (const [z1, a] of [[10.45, 0], [-10.45, Math.PI]]) {
    const s = Math.sign(z1), y1 = rimY(0, a) - 0.22, p0 = V(0, -1.62, s * 1.3), p1 = V(0, y1, z1), d = p1.clone().sub(p0), L = d.length(), u = d.clone().normalize(), n = V(0, u.z, -u.y).multiplyScalar(Math.sign(u.z) || 1);
    fr.add(bar(p0, p1, 2.3, 0.2, G, 0.9), bar(V(0, -1.74, s * 1.3), V(0, y1 - 0.12, z1), 2.5, 0.07, C));
    for (const x of [-1.2, 1.2]) { fr.add(bar(V(x, -1.5, s * 1.3), V(x, y1 + 0.14, z1), 0.1, 0.1, C), tube(V(x * 1.12, -1.48, s * 1.3), V(x * 1.12, y1 + 0.16, z1), 0.075, G, 12)); }                // the covers that were rolled back along each side
    for (let k = 1; k < 9; k++) fr.add(bar(p0.clone().addScaledVector(u, L * k / 9).add(V(-1.25, 0.11, 0)), p0.clone().addScaledVector(u, L * k / 9).add(V(1.25, 0.11, 0)), 0.05, 0.03, C));           // ribs across the pallet
    for (let k = 0; k < 26; k++) for (const x of [-0.75, 0, 0.75]) { const p = p0.clone().addScaledVector(u, L * (k + 0.5) / 26).add(V(x + (k % 2 ? 0.12 : -0.12), 0, 0)).addScaledVector(n, 0.115); const pin = mk(BOLT, A, p); pin.scale.set(0.022, 0.035, 0.022); pin.quaternion.setFromUnitVectors(UP, n); fr.add(pin); }      // the pins that held the folded layers down for launch
  }
  OUT.forEach(([x, z]) => {
    const a = Math.atan2(x, z), y0 = rimY(0, a), y1 = rimY(4, a) * 0.98, lo = V(x, y0 - 0.2, z), hi = V(x * 0.96, y1 + 0.2, z * 0.96);
    fr.add(bar(lo, hi, 0.07, 0.1, C), mk(new THREE.BoxGeometry(0.14, 0.1, 0.14), I, lo));
    for (let i = 0; i < 5; i++) { const tip = V(x * (1 - i * 0.02), rimY(i, a), z * (1 - i * 0.02)), at = lo.clone().lerp(hi, (i + 0.6) / 5.2); fr.add(tube(at, tip, 0.012, A, 6), mk(new THREE.SphereGeometry(0.035, 10, 8), I, tip)); }
  });
  for (const s of [-1, 1]) {            // the side booms: tubes that slid out of each other
    const a0 = V(s * 0.8, -1.45, 1.1), a1 = V(s * 7.05, rimY(0, s * Math.PI / 2) - 0.15, 1.2);
    for (let k = 0; k < 5; k++) { const p = a0.clone().lerp(a1, k / 5), q = a0.clone().lerp(a1, (k + 1) / 5); fr.add(tube(p, q, 0.085 - k * 0.011, C, 14), tube(q.clone().lerp(p, 0.04), q, 0.1 - k * 0.011, I, 14)); }
    fr.add(mk(new THREE.BoxGeometry(0.3, 0.22, 0.3), G, a0));
  }
  fr.add(bar(V(-3.1, rimY(0, 0) - 0.2, 10.6), V(3.1, rimY(0, 0) - 0.2, 10.6), 0.1, 0.1, C), bar(V(-4.6, rimY(0, Math.PI) - 0.2, -10.6), V(4.6, rimY(0, Math.PI) - 0.2, -10.6), 0.1, 0.1, C));
  { const y = rimY(0, Math.PI) - 0.3, f = panel(fr, V(0, y - 0.75, -11.3), 2.4, 2.0, V(0, 0.657, -0.754), S, 0.025); fr.add(bar(V(-0.9, y, -10.6), V(-0.9, y - 0.3, -10.9), 0.05, 0.05, C), bar(V(0.9, y, -10.6), V(0.9, y - 0.3, -10.9), 0.05, 0.05, C)); void f; }        // the trim flap at the back
  const frame = fuse(fr); g.add(frame);
  g.userData = { segs, wings, layers, shield, frame, tel, smss, SEC, AOS, ISIM: V(0, YC - 0.3, ZM - 1.6), TM: V(0, YC - 0.16, ZM - 0.78), FSM: V(0, YC + 0.1, ZM + 1.12), FP: V(0, YC - 0.42, ZM - 2.05), studio: true };
  deploy(g, 1);
  return g;
}
/** fold or unfold: s = 0 packed for launch, 1 open in space. The order is the real one (NASA, January 2022): first the
 *  sunshield, then the tripod of the secondary mirror (5 January), then the two wings of the main mirror (7 and 8 January). */
const XA = V(1, 0, 0);
function placeHalf(m, a, b) { const d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(UP, d.divideScalar(L || 1)); }
export function deploy(w, s) {
  const d = w.userData, k = Math.max(0, Math.min(1, s)), ks = Math.min(1, k / 0.5), km = Math.max(0, Math.min(1, (k - 0.52) / 0.18)), kw = Math.max(0, (k - 0.72) / 0.28);
  const e = (x) => x * x * (3 - 2 * x);
  d.shield.scale.set(0.16 + 0.84 * e(Math.max(0, (ks - 0.45) / 0.55)), 1, 0.3 + 0.7 * e(Math.min(1, ks / 0.5)));
  d.frame.scale.copy(d.shield.scale);
  const sp = e(Math.max(0, (ks - 0.7) / 0.3)); if (d._s !== sp) { d._s = sp; spreadLayers(d.layers, sp); }
  // the tripod swings down from over the mirror; the upper strut's knee straightens as it comes
  const t = d.smss, ang = -1.01 * (1 - e(km)); t.piv.rotation.x = ang;
  const tip = t.T0.clone().applyAxisAngle(XA, ang).add(t.P), bv = tip.clone().sub(t.B), dist = bv.length(), dir = bv.divideScalar(dist);
  const h = Math.sqrt(Math.max(0, t.L * t.L - dist * dist / 4)), kn = t.B.clone().addScaledVector(dir, dist / 2).add(V(0, dir.z, -dir.y).multiplyScalar(h));
  placeHalf(t.up1, t.B, kn); placeHalf(t.up2, kn, tip); t.knee.position.copy(kn);
  t.sec.copy(t.S0).applyAxisAngle(XA, ang).add(t.P);
  for (const sg of [-1, 1]) d.wings[sg].rotation.y = sg * (1 - e(kw)) * 1.72;
}
/** colour the five layers by how hot they are (k = 0 off, 1 full): the sunward one glows, the last is cold */
export function heatLayers(w, k) { const cols = [[1.0, 0.33, 0.08], [0.85, 0.2, 0.05], [0.5, 0.08, 0.1], [0.14, 0.05, 0.3], [0.02, 0.1, 0.5]]; w.userData.layers.forEach((m, i) => { m.material.emissive.setRGB(cols[i][0] * k, cols[i][1] * k, cols[i][2] * k); m.material.emissiveIntensity = 0.5; }); }
