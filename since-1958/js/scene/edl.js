// The hardware that landed Perseverance, built by hand (the rover itself is NASA's own 3D model).
// Metres, y up. descentStage(): the rocket-powered "sky crane", about 2.7 m across, with eight landing engines
// in four pairs, three fuel tanks and the landing radar. aeroshell(): the 4.5 m capsule, as a backshell and a
// separate heat shield. parachute(): the 21.5 m supersonic parachute (a disc, a gap, then a band) on its lines.
// Sizes from the NASA/JPL Mars 2020 landing press kit; the placing of small fittings follows NASA illustrations.
// The parachute's orange-and-white pattern here is our own, not the coded message on the real one.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { studio, crinkle, smudge, blanket } from './voyager.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z), UP = V(0, 1, 0);
// Every plain material carries the same set of maps (a blank one where it has none), so the graphics card
// compiles one shader for all of them instead of one per combination: the film opens much sooner.
const px = (v) => { const t = new THREE.DataTexture(new Uint8Array([v, v, v, 255]), 1, 1); t.needsUpdate = true; return t; };
const BLANK = { map: px(255), bumpMap: px(128), bumpScale: 0, roughnessMap: px(255) };
const MAT = {};
const mat = (key, o) => MAT[key] || (MAT[key] = new THREE.MeshStandardMaterial({ envMap: studio(), envMapIntensity: 1.0, ...BLANK, ...o }));
const M = {
  alu: () => mat('alu', { color: 0xcfd2d7, metalness: 1, roughness: 0.42, roughnessMap: smudge() }),
  dark: () => mat('dark', { color: 0x3b3a38, metalness: 0.9, roughness: 0.5, side: THREE.DoubleSide }),
  black: () => mat('black', { color: 0x141416, metalness: 0.2, roughness: 0.55 }),
  goldMli: () => mat('goldMli', { color: 0xd39b38, metalness: 0.9, roughness: 0.32, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 2.0, envMapIntensity: 1.4 }),
  blackMli: () => mat('blackMli', { color: 0x26262b, map: blanket('blanket', 1, 1), metalness: 0.25, roughness: 0.36, bumpMap: crinkle('crinkle', 1, 1), bumpScale: 2.2, envMapIntensity: 1.3 }),
  tank: () => mat('tank', { color: 0xb9b3a6, metalness: 1, roughness: 0.3, roughnessMap: smudge(), envMapIntensity: 1.3 }),
  white: () => mat('white', { color: 0xeeece4, metalness: 0, roughness: 0.6, roughnessMap: smudge(false) }),
  shell: () => mat('shell', { color: 0xffffff, metalness: 0, roughness: 0.62, roughnessMap: smudge(false), map: (() => { const c = document.createElement('canvas'); c.width = 2048; c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#e9e5da'; x.fillRect(0, 0, 2048, 512); let s = 6; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '190,180,160' : '255,255,250'},0.1)`; x.fillRect(r() * 2048, r() * 512, 20 + r() * 160, 10 + r() * 90); } x.fillStyle = 'rgba(70,64,56,0.55)'; for (let i = 0; i < 16; i++) x.fillRect(i * 128, 0, 2, 512); for (const v of [60, 150, 330, 430]) x.fillRect(0, v, 2048, 2); x.fillStyle = 'rgba(40,38,34,0.75)'; for (let i = 0; i < 16; i++) for (const v of [60, 150, 330, 430]) { x.beginPath(); x.arc(i * 128 + 14, v + 12, 3.2, 0, 7); x.fill(); x.beginPath(); x.arc(i * 128 + 114, v + 12, 3.2, 0, 7); x.fill(); } for (let i = 0; i < 8; i++) { x.fillStyle = '#2b2a28'; x.fillRect(i * 256 + 90, 215, 34, 26); x.fillStyle = '#b9b3a2'; x.fillRect(i * 256 + 94, 219, 26, 18); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; })() }),
  shellIn: () => mat('shellIn', { color: 0xbfb9a8, metalness: 0.3, roughness: 0.6, side: THREE.BackSide }),
  tan: () => mat('tan', { color: 0xb08a5e, metalness: 0, roughness: 0.9, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 0.6 }),
};
function mk(geo, material, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, material); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; }
function tube(a, b, r, material, seg = 6) { const d = new THREE.Vector3().subVectors(b, a), o = mk(new THREE.CylinderGeometry(r, r, d.length(), seg), material); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize()); return o; }
function fuse(g) {
  g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert(), by = new Map();
  g.traverse((o) => { if (o.isMesh) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); } });
  const out = new THREE.Group();
  for (const [material, list] of by) { const geos = list.map((o) => { const ge = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); ge.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)); for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') ge.deleteAttribute(k); return ge; }); const m = new THREE.Mesh(mergeGeometries(geos, false), material); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; out.add(m); }
  return out;
}

/** where the eight engines sit and which way they blow: [position, direction of the flame] */
export const ENGINES = (() => { const a = []; for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const k of [-1, 1]) a.push([V(sx * 1.22, -0.2, sz * (0.72 + k * 0.17)), V(sx * 0.42, -1, sz * 0.12 + k * 0.06).normalize()]); return a; })();

export function descentStage() {
  const g = new THREE.Group(), A = M.alu();
  g.add(mk(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 6), A, 0, 0.12, 0), mk(new THREE.CylinderGeometry(0.62, 0.62, 0.46, 6), M.blackMli(), 0, -0.12, 0));
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3, c = Math.cos(a), s = Math.sin(a), c2 = Math.cos(a + Math.PI / 3), s2 = Math.sin(a + Math.PI / 3); g.add(tube(V(c * 0.6, 0.1, s * 0.6), V(c * 1.35, 0.05, s * 1.35), 0.04, A), tube(V(c * 1.35, 0.05, s * 1.35), V(c2 * 1.35, 0.05, s2 * 1.35), 0.03, A), tube(V(c * 0.6, -0.33, s * 0.6), V(c * 1.35, 0.05, s * 1.35), 0.025, A)); }
  for (let k = 0; k < 3; k++) { const a = k * 2.0944 + Math.PI / 2, c = Math.cos(a), s = Math.sin(a); g.add(mk(new THREE.SphereGeometry(0.34, 28, 18), M.tank(), c * 0.86, 0.36, s * 0.86), mk(new THREE.CylinderGeometry(0.345, 0.345, 0.05, 28), A, c * 0.86, 0.36, s * 0.86), tube(V(c * 0.86, 0.04, s * 0.86), V(c * 0.86, 0.12, s * 0.86), 0.1, A, 10)); const a2 = a + 1.047; g.add(mk(new THREE.SphereGeometry(0.2, 20, 14), M.goldMli(), Math.cos(a2) * 0.95, 0.3, Math.sin(a2) * 0.95)); }
  g.add(mk(new THREE.BoxGeometry(0.5, 0.3, 0.4), M.goldMli(), 0, 0.33, 0), mk(new THREE.BoxGeometry(0.36, 0.22, 0.3), M.blackMli(), 0.25, 0.3, -0.42));
  for (const [p, d] of ENGINES) {                                            // eight landing engines, each a small bell under a foil-wrapped valve block
    const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(0.045 + 0.1 * Math.pow(t, 0.7), -t * 0.34)); }
    const n = mk(new THREE.LatheGeometry(pts, 20), M.dark(), p.x, p.y, p.z); n.quaternion.setFromUnitVectors(V(0, -1, 0), d); g.add(n);
    const b = mk(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12), M.goldMli(), p.x - d.x * 0.1, p.y - d.y * 0.1, p.z - d.z * 0.1); b.quaternion.setFromUnitVectors(V(0, -1, 0), d); g.add(b, tube(p.clone().addScaledVector(d, -0.2), V(p.x * 0.5, 0.08, p.z * 0.6), 0.012, A));
  }
  for (const sx of [-1, 1]) g.add(tube(V(sx * 1.0, 0.05, -0.95), V(sx * 1.0, 0.05, 0.95), 0.035, A), tube(V(sx * 1.0, 0.05, 0.75), V(sx * 1.26, -0.12, 0.75), 0.03, A), tube(V(sx * 1.0, 0.05, -0.75), V(sx * 1.26, -0.12, -0.75), 0.03, A));
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + 0.5, d = mk(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 20), M.white(), Math.cos(a) * 0.52, -0.37, Math.sin(a) * 0.52); d.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); g.add(d); }       // the landing radar's six antennas
  { const pts = [[0.2, 0], [0.24, -0.1], [0.1, -0.34], [0.07, -0.36]].map(([r, y]) => new THREE.Vector2(r, y)); g.add(mk(new THREE.LatheGeometry(pts, 20), M.black(), 0, -0.34, 0)); }                                                                   // the spool the cords unwind from
  return fuse(g);
}

export function aeroshell() {
  const back = new THREE.Group(), heat = new THREE.Group();
  const bp = [[2.25, -2.6], [2.25, -2.45], [1.62, 0.2], [1.5, 0.75], [0.8, 1.25], [0.36, 1.45]].map(([r, y]) => new THREE.Vector2(r, y));
  back.add(mk(new THREE.LatheGeometry(bp, 64), M.shell()), mk(new THREE.LatheGeometry(bp.map((v) => new THREE.Vector2(v.x - 0.03, v.y)), 64), M.shellIn()), mk(new THREE.CylinderGeometry(0.36, 0.36, 0.5, 24), M.alu(), 0, 1.7, 0), mk(new THREE.TorusGeometry(2.25, 0.03, 8, 64), M.alu(), 0, -2.6, 0).rotateX(Math.PI / 2));
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; back.add(mk(new THREE.BoxGeometry(0.16, 0.1, 0.16), M.black(), Math.cos(a) * 1.72, -1.15, Math.sin(a) * 1.72)); }
  const hp = []; for (let i = 0; i <= 14; i++) { const t = i / 14, r = 2.25 * t; hp.push(new THREE.Vector2(Math.max(r, 1e-3), -3.5 + 0.9 * Math.pow(t, 1.5))); }
  heat.add(mk(new THREE.LatheGeometry(hp, 64), mat('tanD', { color: 0xa8845c, metalness: 0, roughness: 0.92, side: THREE.DoubleSide, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 0.5, emissive: 0x000000 })));
  return { back: fuse(back), heat: fuse(heat) };
}

export function parachute() {
  const g = new THREE.Group(), R = 10.75, tex = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const x = c.getContext('2d'); let s = 14; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 80; i++) for (let j = 0; j < 4; j++) { x.fillStyle = r() < 0.5 ? '#e8e4da' : '#d5562a'; x.fillRect(i * 12.8, j * 64, 12.9, 64.5); } x.fillStyle = 'rgba(60,50,40,0.5)'; for (let i = 0; i < 80; i++) x.fillRect(i * 12.8, 0, 1, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();
  const cloth = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0, side: THREE.DoubleSide });
  const dp = []; for (let i = 0; i <= 16; i++) { const t = i / 16, a = t * 1.15; dp.push(new THREE.Vector2(Math.max(0.5, Math.sin(a) / Math.sin(1.15) * R * 0.74), 46 + 3.6 * Math.cos(a) - 3.6 * Math.cos(1.15))); }
  const disc = new THREE.LatheGeometry(dp, 80), band = new THREE.CylinderGeometry(R * 0.78, R * 0.8, 2.6, 80, 1, true); band.translate(0, 43.6, 0);
  { const p = disc.attributes.position; for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), r = Math.hypot(p.getX(i), p.getZ(i)), k = 1 + 0.035 * Math.abs(Math.sin(a * 40)) * (r / R); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } disc.computeVertexNormals(); }
  const canopy = new THREE.Group(); const d = new THREE.Mesh(disc, cloth), b = new THREE.Mesh(band, cloth); d.castShadow = b.castShadow = true; d.frustumCulled = b.frustumCulled = false; canopy.add(d, b); g.add(canopy);
  const lines = [], lm = new THREE.LineBasicMaterial({ color: 0xe8e2d2, transparent: true, opacity: 0.75 });
  for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; lines.push(Math.cos(a) * R * 0.8, 42.3, Math.sin(a) * R * 0.8, 0, 6.5, 0, Math.cos(a) * R * 0.8, 42.3, Math.sin(a) * R * 0.8, Math.cos(a) * R * 0.75, 44.9, Math.sin(a) * R * 0.75); }
  lines.push(0, 6.5, 0, 0, 1.9, 0);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3)); const ln = new THREE.LineSegments(lg, lm); ln.frustumCulled = false; canopy.add(ln);
  g.userData.canopy = canopy;
  return g;
}
