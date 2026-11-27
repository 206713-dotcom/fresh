// The Saturn V of Apollo 11 and its launch tower, built by hand. Metres; y is up; the rocket stands with the
// mouths of its F-1 engines at y = 0 and its escape tower tip at 110.6 m.
//   first stage S-IC   10.06 m across, five F-1 engines (each 5.5 m tall, 3.7 m across the mouth)
//   second stage S-II  10.06 m across, five J-2 engines;  third stage S-IVB 6.6 m across, one J-2
//   on top: the adapter that hides the lunar module, the service and command modules (3.9 m across), the escape tower
// Sizes: NASA Saturn V fact pages (363 ft tall, 33 ft across; F-1 18 ft by 12 ft). Paint pattern and small
// fittings follow NASA photographs of the Apollo 11 vehicle. The stages are separate groups, so a film can stage them.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { studio, crinkle, smudge } from './voyager.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0), RAD = 5.03;
// Every plain material carries the same set of maps (a blank one where it has none), so the graphics card
// compiles one shader for all of them instead of one per combination: the film opens much sooner.
const px = (v) => { const t = new THREE.DataTexture(new Uint8Array([v, v, v, 255]), 1, 1); t.needsUpdate = true; return t; };
const BLANK = { map: px(255), bumpMap: px(128), bumpScale: 0, roughnessMap: px(255) };
const MAT = {};
const mat = (key, o) => MAT[key] || (MAT[key] = new THREE.MeshStandardMaterial({ envMap: studio(), envMapIntensity: 0.55, ...BLANK, ...o }));
function canvasTex(w, h, draw, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.anisotropy = 16; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }
/** paint for one stage. bands: [v0, v1, kind] with kind 'rib' (corrugated skin), 'q' (black quarter stripes), 'alt' (black and white blocks); words: letters stacked down the side */
function stageSkin(key, { bands = [], words = null, wordV = [0.6, 0.9], wordAt = [0.125, 0.625], frost = null, n = 8 }) {
  const W = 2048, H = 1024, Y = (v) => (1 - v) * H;
  const map = canvasTex(W, H, (x) => {
    x.fillStyle = '#f3f2ee'; x.fillRect(0, 0, W, H);
    let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '200,198,190' : '255,255,255'},0.12)`; x.fillRect(r() * W, r() * H, 2 + r() * 40, 30 + r() * 220); }      // streaks down the paint
    for (const [v0, v1, kind] of bands) {
      if (kind === 'q') { x.fillStyle = '#131314'; for (let k = 0; k < 4; k++) x.fillRect((k * 0.25 + 0.0625) * W, Y(v1), 0.125 * W, Y(v0) - Y(v1)); }
      if (kind === 'alt') { x.fillStyle = '#131314'; for (let k = 0; k < n; k += 2) x.fillRect(k / n * W, Y(v1), W / n, Y(v0) - Y(v1)); }
      if (kind === 'black') { x.fillStyle = '#131314'; x.fillRect(0, Y(v1), W, Y(v0) - Y(v1)); }
      if (kind === 'rib' || kind === 'alt') { x.fillStyle = 'rgba(0,0,0,0.13)'; for (let i = 0; i < 216; i++) x.fillRect(i * W / 216, Y(v1), 2, Y(v0) - Y(v1)); x.fillStyle = 'rgba(60,60,60,0.5)'; x.fillRect(0, Y(v1) - 1, W, 3); x.fillRect(0, Y(v0) - 1, W, 3); }
    }
    if (frost) { const g = x.createLinearGradient(0, Y(frost[1]), 0, Y(frost[0])); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.2, 'rgba(255,255,255,0.75)'); g.addColorStop(0.8, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, Y(frost[1]), W, Y(frost[0]) - Y(frost[1])); }
    if (words) { x.fillStyle = '#b01f2a'; x.textAlign = 'center'; x.textBaseline = 'middle'; const hgt = Y(wordV[0]) - Y(wordV[1]), step = hgt / words.length; x.font = `700 ${Math.min(150, step * 0.92)}px Arial, Helvetica, sans-serif`;
      for (const u of wordAt) [...words].forEach((ch, i) => { x.save(); x.translate(u * W, Y(wordV[1]) + step * (i + 0.5)); x.scale(0.62, 1); x.fillText(ch, 0, 0); x.restore(); }); }
    x.fillStyle = 'rgba(90,90,90,0.35)'; for (let k = 1; k < 6; k++) x.fillRect(0, k * H / 6, W, 1.5);                    // weld lines round the tanks
  });
  const bump = canvasTex(W / 2, H / 2, (x) => { x.fillStyle = '#808080'; x.fillRect(0, 0, W / 2, H / 2); for (const [v0, v1, kind] of bands) if (kind === 'rib' || kind === 'alt') for (let i = 0; i < 216; i++) { x.fillStyle = '#e8e8e8'; x.fillRect(i * W / 432, Y(v1) / 2, 2.4, (Y(v0) - Y(v1)) / 2); } }, false);
  return mat(key, { map, bumpMap: bump, bumpScale: 2.5, color: 0xffffff, metalness: 0, roughness: 0.5, roughnessMap: smudge(false) });
}
const M = {
  white: () => mat('white', { color: 0xf3f2ee, metalness: 0, roughness: 0.5 }),
  black: () => mat('black', { color: 0x131314, metalness: 0.1, roughness: 0.6 }),
  foil: () => mat('foil', { color: 0xd4d7dc, metalness: 0.95, roughness: 0.32, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 2.2, envMapIntensity: 1.4 }),
  steel: () => mat('steel', { color: 0x8b8e94, metalness: 1, roughness: 0.42, roughnessMap: smudge(), envMapIntensity: 1.1 }),
  dark: () => mat('darkMetal', { color: 0x3a3936, metalness: 0.9, roughness: 0.5, side: THREE.DoubleSide, envMapIntensity: 0.9 }),
  silver: () => mat('silver', { color: 0xdfe2e8, metalness: 1, roughness: 0.18, envMapIntensity: 1.5 }),
  grey: () => mat('padGrey', { color: 0x8e9196, metalness: 0.3, roughness: 0.7 }),
  red: () => mat('towerRed', { color: 0xa33a2a, metalness: 0.2, roughness: 0.65 }),
  concrete: () => mat('concrete', { color: 0xa9a59c, metalness: 0, roughness: 0.95 }),
  goldFoil: () => mat('goldFoil', { color: 0xc9953a, metalness: 0.9, roughness: 0.34, bumpMap: crinkle('crinkle3', 3, 3), bumpScale: 2.0, envMapIntensity: 1.3 }),
  galv: () => mat('galv', { color: 0xb9bcc0, metalness: 0.85, roughness: 0.5, roughnessMap: smudge(), envMapIntensity: 0.9 }),
  pipe: () => mat('pipeW', { color: 0xe6e6e0, metalness: 0.2, roughness: 0.5 }),
  hose: () => mat('hose', { color: 0x1b1b1d, metalness: 0.2, roughness: 0.6 }),
  yellow: () => mat('yellow', { color: 0xd8b02a, metalness: 0.1, roughness: 0.6 }),
};
function mk(geo, material, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, material); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; }
const cyl = (r1, r2, h, material, y, seg = 96, open = true) => mk(new THREE.CylinderGeometry(r1, r2, h, seg, 1, open), material, 0, y + h / 2, 0);
function tube(a, b, r, material, seg = 6) { const d = new THREE.Vector3().subVectors(b, a), o = mk(new THREE.CylinderGeometry(r, r, d.length(), seg), material); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize()); return o; }
const lathe = (pts, material, seg = 48) => mk(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), material);
/** fuse a finished group into one mesh per material */
function fuse(g) {
  g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert(), by = new Map();
  g.traverse((o) => { if (o.isMesh) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); } });
  const out = new THREE.Group(); out.position.copy(g.position); out.quaternion.copy(g.quaternion); out.name = g.name;
  for (const [material, list] of by) { const geos = list.map((o) => { const ge = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); ge.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)); for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') ge.deleteAttribute(k); return ge; }); const m = new THREE.Mesh(mergeGeometries(geos, false), material); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; out.add(m); }
  return out;
}

/** one F-1 engine, mouth at y = 0, 5.6 m tall */
function f1() {
  const g = new THREE.Group(), p = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14; p.push([0.46 + (1.83 - 0.46) * Math.pow(1 - t, 0.62), t * 4.3]); }
  g.add(lathe(p.slice(0, 9), M.dark(), 48), lathe(p.slice(8), M.foil(), 48));                                     // the bare nozzle extension, then the foil-wrapped upper nozzle
  const tor = mk(new THREE.TorusGeometry(p[8][0] + 0.11, 0.17, 12, 48), M.foil(), 0, p[8][1], 0); tor.rotation.x = Math.PI / 2; g.add(tor);    // turbine exhaust wraps round the nozzle here
  g.add(mk(new THREE.CylinderGeometry(0.5, 0.52, 0.75, 32), M.foil(), 0, 4.65, 0), mk(new THREE.SphereGeometry(0.5, 32, 12, 0, 6.283, 0, 1.57), M.steel(), 0, 5.0, 0));
  g.add(mk(new THREE.CylinderGeometry(0.42, 0.42, 1.5, 24), M.foil(), 0.95, 3.9, 0), mk(new THREE.SphereGeometry(0.42, 24, 12), M.steel(), 0.95, 4.7, 0));       // the turbopump beside the chamber
  g.add(tube(V(0.95, 3.2, 0), V(p[8][0] + 0.1, p[8][1], 0.25), 0.2, M.foil(), 10));
  for (const a of [0.9, 2.4, 3.9, 5.4]) g.add(tube(V(Math.cos(a) * 0.5, 4.6, Math.sin(a) * 0.5), V(Math.cos(a) * 1.35, 5.75, Math.sin(a) * 1.35), 0.07, M.steel()));
  for (const a of [0.2, 3.3]) g.add(tube(V(Math.cos(a) * 0.3, 5.3, Math.sin(a) * 0.3), V(Math.cos(a) * 0.45, 6.1, Math.sin(a) * 0.45), 0.2, M.foil(), 10));         // fuel and oxygen feed pipes
  return g;
}
/** one J-2 engine, mouth at y = 0 */
function j2() { const g = new THREE.Group(), p = []; for (let i = 0; i <= 10; i++) { const t = i / 10; p.push([0.2 + 0.82 * Math.pow(1 - t, 0.6), t * 2.3]); } g.add(lathe(p, mat('j2', { color: 0x9a9da3, metalness: 1, roughness: 0.35, side: THREE.DoubleSide, envMapIntensity: 1.1 }), 36), mk(new THREE.CylinderGeometry(0.3, 0.26, 0.7, 20), M.steel(), 0, 2.6, 0), mk(new THREE.SphereGeometry(0.34, 16, 10), M.foil(), 0.45, 2.7, 0.1)); return g; }

export const SV = { s1Top: 42, ringTop: 47.5, s2Top: 66.5, coneTop: 72.3, s3Top: 84.3, iuTop: 85.2, slaTop: 93.7, smTop: 97.6, cmTop: 100.8, top: 110.6, engR: 3.72, j2Y: 43.6, j2R: 2.85, j2Top: 68.0 };

/** The Saturn V in the seven pieces that come apart in flight: userData = { s1, ring, s2, s4b, sla, csm, les }. */
export function saturnV() {
  const rocket = new THREE.Group(); rocket.name = 'Saturn V';
  // ---- first stage
  const s1 = new THREE.Group();
  s1.add(cyl(RAD, RAD, 37, stageSkin('s1c', { bands: [[0, 0.11, 'rib'], [0, 0.36, 'q'], [0.42, 0.535, 'alt'], [0.93, 1, 'rib'], [0.955, 1, 'alt']], words: 'USA', wordV: [0.58, 0.86], frost: [0.56, 0.92] }), 5));
  s1.add(mk(new THREE.CircleGeometry(RAD, 64), M.dark(), 0, 5.02, 0).rotateX(Math.PI / 2), mk(new THREE.CylinderGeometry(RAD * 0.98, RAD * 0.9, 0.5, 64), M.foil(), 0, 4.8, 0));      // the heat shield across the base
  s1.add(mk(new THREE.SphereGeometry(RAD, 48, 12, 0, 6.283, 0, 1.0), M.steel(), 0, 42 - RAD * 0.54, 0));
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4, c = Math.cos(a), s = Math.sin(a), e = f1(); e.position.set(c * SV.engR, 0, s * SV.engR); e.rotation.y = -a; s1.add(e);
    const fair = mk(new THREE.CylinderGeometry(0.35, 2.2, 7.4, 28, 1, true, 0, Math.PI), mat('fairing', { color: 0xf3f2ee, metalness: 0, roughness: 0.5, side: THREE.DoubleSide }), c * (RAD - 0.5), 8.6, s * (RAD - 0.5)); fair.rotation.y = -a + Math.PI / 2 + Math.PI; s1.add(fair);
    const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(2.6, 0); fs.lineTo(2.6, 0.9); fs.lineTo(0, 4.6); fs.closePath();
    const fin = mk(new THREE.ExtrudeGeometry(fs, { depth: 0.22, bevelEnabled: false }), k % 2 ? M.black() : M.white(), c * (RAD + 1.0), 4.9, s * (RAD + 1.0)); fin.rotation.y = -a; fin.geometry.translate(0, 0, -0.11); s1.add(fin);
    s1.add(mk(new THREE.BoxGeometry(0.5, 30, 0.9), M.white(), Math.cos(a + 0.6) * (RAD + 0.2), 22, Math.sin(a + 0.6) * (RAD + 0.2)).rotateY(-(a + 0.6)));                 // a cable tunnel up the side
    for (const b of [0.35, -0.35]) s1.add(tube(V(Math.cos(a + b) * 2.6, 5.0, Math.sin(a + b) * 2.6), V(c * SV.engR + Math.cos(a + b * 3) * 0.6, 3.6, s * SV.engR + Math.sin(a + b * 3) * 0.6), 0.09, M.steel()));
    for (const y of [16.5, 27.5]) s1.add(mk(new THREE.BoxGeometry(0.7, 1.6, 1.1), M.white(), Math.cos(a - 0.5) * (RAD + 0.25), y, Math.sin(a - 0.5) * (RAD + 0.25)).rotateY(-(a - 0.5)));        // retro-rocket and camera pods
  }
  s1.add(f1());
  for (const y of [5.05, 9.1, 18.2, 24.9, 39.4, 41.9]) s1.add(mk(new THREE.TorusGeometry(RAD + 0.02, 0.05, 6, 96), M.white(), 0, y, 0).rotateX(Math.PI / 2));                                // stiffening rings
  const S1 = fuse(s1); S1.name = 'First stage (S-IC)'; rocket.add(S1);
  // ---- the ring between the first and second stage
  const ring = new THREE.Group();
  ring.add(cyl(RAD, RAD, 5.5, stageSkin('ring', { bands: [[0, 1, 'rib'], [0.55, 1, 'black']] }), 42));
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + 0.2; ring.add(mk(new THREE.CylinderGeometry(0.2, 0.28, 2.6, 12), M.white(), Math.cos(a) * (RAD + 0.25), 44.6, Math.sin(a) * (RAD + 0.25)), mk(new THREE.ConeGeometry(0.2, 0.5, 12), M.white(), Math.cos(a) * (RAD + 0.25), 46.15, Math.sin(a) * (RAD + 0.25))); }     // small rockets that settle the fuel
  const RING = fuse(ring); RING.name = 'Interstage ring'; rocket.add(RING);
  // ---- second stage, with the cone that narrows to the third
  const s2 = new THREE.Group();
  s2.add(cyl(RAD, RAD, 19, stageSkin('s2', { bands: [[0, 0.1, 'rib'], [0.9, 1, 'rib']], words: 'UNITED STATES', wordV: [0.14, 0.86], wordAt: [0.25, 0.75], frost: [0.12, 0.88] }), 47.5));
  s2.add(mk(new THREE.SphereGeometry(RAD, 48, 10, 0, 6.283, Math.PI - 0.9, 0.9), M.foil(), 0, 47.5 + RAD * 0.62, 0), mk(new THREE.SphereGeometry(RAD * 0.99, 48, 10, 0, 6.283, 0, 0.95), M.steel(), 0, 66.5 - RAD * 0.58, 0));
  for (let k = 0; k < 5; k++) { const e = j2(), a = k * Math.PI / 2 + Math.PI / 4, r = k < 4 ? SV.j2R : 0; e.position.set(Math.cos(a) * r, SV.j2Y, Math.sin(a) * r); s2.add(e); s2.add(tube(V(Math.cos(a) * r, 46.3, Math.sin(a) * r), V(Math.cos(a) * r * 0.8, 47.6, Math.sin(a) * r * 0.8), 0.14, M.steel())); }
  s2.add(mk(new THREE.CylinderGeometry(4.4, 4.4, 0.12, 48), M.goldFoil(), 0, 46.0, 0));                                                                                             // the heat shield round the engines
  s2.add(mk(new THREE.BoxGeometry(0.45, 17, 0.8), M.white(), RAD + 0.18, 57, 0));
  for (let k = 0; k < 5; k++) { const a = k * 1.2566 + 0.5; s2.add(mk(new THREE.BoxGeometry(0.34, 14, 0.5), M.white(), Math.cos(a) * (RAD + 0.14), 55.5, Math.sin(a) * (RAD + 0.14)).rotateY(-a)); }      // the five hydrogen feed lines down the outside
  s2.add(cyl(3.3, RAD, 5.8, stageSkin('cone', { bands: [[0, 1, 'rib'], [0, 0.4, 'alt']], n: 8 }), 66.5));
  for (const y of [47.5, 49.4, 64.6, 66.5]) s2.add(mk(new THREE.TorusGeometry(RAD + 0.02, 0.05, 6, 96), M.white(), 0, y, 0).rotateX(Math.PI / 2));
  const S2 = fuse(s2); S2.name = 'Second stage (S-II)'; rocket.add(S2);
  // ---- third stage and the ring of instruments that steers the whole rocket
  const s4 = new THREE.Group();
  s4.add(cyl(3.3, 3.3, 12, stageSkin('s4b', { bands: [[0, 0.09, 'rib'], [0.88, 1, 'alt'], [0.88, 1, 'rib']], n: 8, frost: [0.15, 0.8] }), 72.3));
  for (const s of [-1, 1]) s4.add(mk(new THREE.BoxGeometry(0.9, 2.4, 1.3), M.white(), s * 3.55, 73.6, 0), mk(new THREE.BoxGeometry(0.4, 9, 0.6), M.white(), 0, 79, s * 3.42), mk(new THREE.ConeGeometry(0.5, 0.9, 12), M.white(), s * 3.55, 75.25, 0));
  for (const s of [-1, 1]) for (const d of [-0.5, 0.5]) s4.add(mk(new THREE.CylinderGeometry(0.05, 0.11, 0.3, 10), M.dark(), s * 4.05, 73.6 + d * 1.2, d * 0.5).rotateZ(s * Math.PI / 2));                 // small steering thrusters
  s4.add(cyl(3.3, 3.3, 0.9, M.black(), SV.s3Top));
  s4.add(cyl(3.3, 1.15, 2.4, M.foil(), 69.9, 48), mk(new THREE.SphereGeometry(3.25, 40, 10, 0, 6.283, 0, 1.0), M.goldFoil(), 0, SV.iuTop - 3.25 * 0.56 - 0.4, 0));
  { const e = j2(); e.position.set(0, SV.j2Top, 0); s4.add(e); for (let k = 0; k < 3; k++) { const a = k * 2.094; s4.add(mk(new THREE.SphereGeometry(0.42, 16, 12), M.goldFoil(), Math.cos(a) * 2.1, 71.3, Math.sin(a) * 2.1)); } }    // its single J-2 engine and helium bottles
  for (const y of [72.3, 84.3, 85.2]) s4.add(mk(new THREE.TorusGeometry(3.32, 0.04, 6, 72), M.white(), 0, y, 0).rotateX(Math.PI / 2));
  const S4 = fuse(s4); S4.name = 'Third stage (S-IVB)'; rocket.add(S4);
  // ---- the four panels that hide the lunar module
  const sla = new THREE.Group(), slaM = mat('slaW', { color: 0xf3f2ee, metalness: 0, roughness: 0.5, side: THREE.DoubleSide });
  for (let k = 0; k < 4; k++) { const ge = new THREE.CylinderGeometry(1.95, 3.3, 8.5, 16, 1, true, k * Math.PI / 2, Math.PI / 2); ge.translate(0, 4.25, 0); const G2 = new THREE.Group(); G2.add(mk(ge, slaM)); G2.position.y = SV.iuTop; G2.userData.a = k * Math.PI / 2 + Math.PI / 4; sla.add(G2); }
  sla.name = 'Lunar module adapter'; rocket.add(sla);
  // ---- the Apollo spacecraft: service module and command module
  const csm = new THREE.Group();
  csm.add(cyl(1.95, 1.95, 3.9, mat('sm', { color: 0xdfe2e8, metalness: 1, roughness: 0.2, envMapIntensity: 1.5, map: canvasTex(1024, 256, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#f5f5f2'; for (let k = 0; k < 8; k++) if (k % 2) x.fillRect(k * w / 8 + 14, 30, w / 8 - 28, h - 70); x.fillStyle = 'rgba(70,70,76,0.6)'; for (let k = 0; k < 8; k++) x.fillRect(k * w / 8, 0, 2, h); }) }), SV.slaTop, 64));
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4, c = Math.cos(a), s = Math.sin(a); csm.add(mk(new THREE.BoxGeometry(0.5, 0.6, 0.14), M.silver(), c * 2.0, 96.3, s * 2.0).rotateY(-a + Math.PI / 2)); for (const d of [[0, 0.35], [0, -0.35], [0.35, 0], [-0.35, 0]]) csm.add(mk(new THREE.CylinderGeometry(0.03, 0.07, 0.2, 8), M.dark(), c * 2.12 - s * d[0], 96.3 + d[1], s * 2.12 + c * d[0])); }       // four clusters of small thrusters
  csm.add(lathe([[0.3, 93.75], [0.5, 93.2], [0.95, 92.0], [1.22, 91.1]], M.dark(), 36), mk(new THREE.CircleGeometry(1.95, 48), M.goldFoil(), 0, SV.slaTop + 0.01, 0).rotateX(Math.PI / 2));                 // its main engine, hidden until the panels open
  csm.add(lathe([[1.94, 97.6], [1.19, 99.88], [0.44, 100.72], [0.3, 100.78]], M.silver(), 64));                                                                                  // the command module, mirror-bright under its launch cover
  const CSM = fuse(csm); CSM.name = 'Apollo spacecraft'; rocket.add(CSM);
  // ---- the escape tower and the white cover it pulls off the command module
  const les = new THREE.Group();
  les.add(lathe([[1.975, 97.6], [1.225, 99.9], [0.47, 100.75], [0.3, 100.8]], M.white(), 64));
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, lo = V(Math.cos(a) * 0.62, 100.5, Math.sin(a) * 0.62), hi = V(Math.cos(a) * 0.4, 103.6, Math.sin(a) * 0.4), a2 = a + Math.PI / 2; les.add(tube(lo, hi, 0.045, M.steel()), tube(lo, V(Math.cos(a2) * 0.4, 103.6, Math.sin(a2) * 0.4), 0.025, M.steel()), tube(hi, V(Math.cos(a2) * 0.5, 102.1, Math.sin(a2) * 0.5), 0.025, M.steel())); les.add(mk(new THREE.CylinderGeometry(0.1, 0.2, 0.5, 10), M.dark(), Math.cos(a) * 0.42, 103.45, Math.sin(a) * 0.42)); }
  les.add(lathe([[0.42, 103.6], [0.33, 104.0], [0.33, 108.9], [0.26, 109.4], [0.1, 110.3], [0.001, 110.6]], M.white(), 28));
  const LES = fuse(les); LES.name = 'Launch escape tower'; rocket.add(LES);
  rocket.userData = { s1: S1, ring: RING, s2: S2, s4b: S4, sla, csm: CSM, les: LES };
  return rocket;
}

// ------------------------------------------------------------------------------------------- Launch Complex 39A
/** posts and two rails from a to b */
function rail(grp, a, b, material, h = 1.1) { const L = a.distanceTo(b), n = Math.max(1, Math.round(L / 2.4)); for (let i = 0; i <= n; i++) { const p = a.clone().lerp(b, i / n); grp.add(tube(p, p.clone().add(V(0, h, 0)), 0.035, material, 5)); } grp.add(tube(a.clone().add(V(0, h, 0)), b.clone().add(V(0, h, 0)), 0.035, material, 5), tube(a.clone().add(V(0, h * 0.5, 0)), b.clone().add(V(0, h * 0.5, 0)), 0.025, material, 5)); }
const padTex = {};
function tex(key, w, h, rx, ry, draw) { if (!padTex[key]) { padTex[key] = canvasTex(w, h, draw); padTex[key].wrapT = THREE.RepeatWrapping; padTex[key].repeat.set(rx, ry); } return padTex[key]; }
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const PM = {
  mlSide: () => mat('mlSide', { color: 0xffffff, metalness: 0.25, roughness: 0.7, map: tex('mlSide', 1024, 256, 1, 1, (x, w, h) => { const r = rnd(8); x.fillStyle = '#868a90'; x.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '60,62,66' : '170,172,176'},0.1)`; x.fillRect(r() * w, r() * h, 4 + r() * 30, 20 + r() * 120); } x.fillStyle = 'rgba(40,42,46,0.55)'; for (let i = 0; i <= 24; i++) x.fillRect(i * w / 24, 0, 2, h); x.fillRect(0, h * 0.5, w, 3); x.fillRect(0, 4, w, 3); for (let i = 0; i < 24; i++) { if (r() < 0.4) { x.fillStyle = '#2a2c30'; x.fillRect(i * w / 24 + 10, h * 0.62, 16, 60); } if (r() < 0.3) { x.fillStyle = '#1c1e22'; x.fillRect(i * w / 24 + 8, h * 0.14, 24, 16); } if (r() < 0.25) { x.fillStyle = 'rgba(120,70,40,0.35)'; x.fillRect(i * w / 24 + r() * 20, 0, 5, h * (0.3 + r() * 0.6)); } } }) }),
  deck: () => mat('mlDeck', { color: 0xffffff, metalness: 0.3, roughness: 0.75, map: tex('mlDeck', 1024, 1024, 1, 1, (x, w, h) => { const r = rnd(4); x.fillStyle = '#7b7f85'; x.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '50,50,52' : '160,160,164'},0.12)`; x.fillRect(r() * w, r() * h, 6 + r() * 60, 6 + r() * 60); } x.strokeStyle = 'rgba(40,42,46,0.6)'; x.lineWidth = 2; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * w / 16, 0); x.lineTo(i * w / 16, h); x.stroke(); x.beginPath(); x.moveTo(0, i * h / 16); x.lineTo(w, i * h / 16); x.stroke(); } x.strokeStyle = '#c9a227'; x.lineWidth = 7; x.strokeRect(14, 14, w - 28, h - 28); }) }),
  concrete: () => mat('padConc', { color: 0xffffff, metalness: 0, roughness: 0.95, map: tex('padConc', 1024, 1024, 6, 6, (x, w, h) => { const r = rnd(12); x.fillStyle = '#b3aea3'; x.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { const v = r() < 0.5 ? '120,116,108' : '205,200,190'; x.fillStyle = `rgba(${v},${0.05 + r() * 0.1})`; const q = 4 + r() * r() * 90; x.beginPath(); x.arc(r() * w, r() * h, q, 0, 7); x.fill(); } x.strokeStyle = 'rgba(70,66,60,0.55)'; x.lineWidth = 2.5; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * w / 4, 0); x.lineTo(i * w / 4, h); x.stroke(); x.beginPath(); x.moveTo(0, i * h / 4); x.lineTo(w, i * h / 4); x.stroke(); } for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(40,38,36,${0.08 + r() * 0.12})`; x.lineWidth = 3 + r() * 5; x.beginPath(); const y = r() * h; x.moveTo(0, y); x.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 120, w * 0.7, y + (r() - 0.5) * 120, w, y + (r() - 0.5) * 60); x.stroke(); } }) }),
  brick: () => mat('padBrick', { color: 0xffffff, metalness: 0, roughness: 0.9, map: tex('padBrick', 512, 512, 30, 3, (x, w, h) => { const r = rnd(2); x.fillStyle = '#5b3a2c'; x.fillRect(0, 0, w, h); for (let j = 0; j < 16; j++) for (let i = 0; i < 9; i++) { const v = 0.75 + r() * 0.5; x.fillStyle = `rgb(${120 * v | 0},${70 * v | 0},${52 * v | 0})`; x.fillRect(i * 64 - (j % 2) * 32 + 2, j * 32 + 2, 60, 28); } x.fillStyle = 'rgba(15,12,10,0.45)'; x.fillRect(0, 0, w, h * 0.35); }) }),
  grass: () => mat('padGrass', { color: 0xffffff, metalness: 0, roughness: 1, map: tex('padGrass', 512, 512, 40, 40, (x, w, h) => { const r = rnd(31); x.fillStyle = '#6a7350'; x.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { const g = 78 + r() * 64; x.fillStyle = `rgba(${g * 0.7 | 0},${g | 0},${g * 0.45 | 0},0.35)`; x.fillRect(r() * w, r() * h, 2 + r() * 5, 2 + r() * 7); } for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(150,140,95,${0.1 + r() * 0.15})`; x.beginPath(); x.arc(r() * w, r() * h, 8 + r() * 30, 0, 7); x.fill(); } }) }),
  gravel: () => mat('padGravel', { color: 0xffffff, metalness: 0, roughness: 1, map: tex('padGravel', 256, 256, 3, 80, (x, w, h) => { const r = rnd(5); x.fillStyle = '#b6a68a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { const g = 140 + r() * 80; x.fillStyle = `rgba(${g | 0},${g * 0.92 | 0},${g * 0.78 | 0},0.5)`; x.fillRect(r() * w, r() * h, 2, 2); } x.fillStyle = 'rgba(90,80,62,0.25)'; x.fillRect(w * 0.2, 0, w * 0.12, h); x.fillRect(w * 0.68, 0, w * 0.12, h); }) }),
  scrub: () => mat('padScrub', { color: 0xffffff, metalness: 0, roughness: 1, map: tex('padScrub', 1024, 1024, 90, 90, (x, w, h) => { const r = rnd(77); x.fillStyle = '#5f6b49'; x.fillRect(0, 0, w, h); const blob = (cx, cy, q, col) => { for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) { const g = x.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, q); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(cx + dx - q, cy + dy - q, q * 2, q * 2); } }; for (let i = 0; i < 520; i++) blob(r() * w, r() * h, 6 + r() * r() * 70, [`rgba(52,74,44,0.5)`, `rgba(140,138,96,0.4)`, `rgba(84,100,60,0.5)`, `rgba(40,58,40,0.45)`, `rgba(170,160,120,0.3)`][Math.floor(r() * 5)]); for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(30,44,28,${0.2 + r() * 0.3})`; x.fillRect(r() * w, r() * h, 2 + r() * 3, 2 + r() * 3); } }) }),
  water: () => mat('padWater', { color: 0x2f5068, metalness: 0.75, roughness: 0.16, envMapIntensity: 1.5 }),
  sea: () => mat('padSea', { color: 0x1f4f6e, metalness: 0.7, roughness: 0.3, envMapIntensity: 1.3, bumpMap: crinkle('crinkle3', 220, 220), bumpScale: 3 }),
  sand: () => mat('padSand', { color: 0xd8c9a2, metalness: 0, roughness: 1 }),
  vab: () => mat('padVab', { color: 0xffffff, metalness: 0.1, roughness: 0.8, map: tex('padVab', 512, 512, 1, 1, (x, w, h) => { x.fillStyle = '#d8d9d6'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(120,124,128,0.35)'; for (let i = 0; i < 40; i++) x.fillRect(i * w / 40, 0, 1.5, h); x.fillStyle = '#3d4046'; for (const u of [0.14, 0.38, 0.62, 0.86]) x.fillRect(u * w - 22, h * 0.14, 44, h * 0.86); x.fillStyle = '#9a9da1'; x.fillRect(0, 0, w, h * 0.05); }) }),
};
/** a flat patch seen from above, with a wobbly outline: a pond, a lagoon, a sand flat */
function patch(cx, cz, rx, rz, seed, material, y) { const r = rnd(seed), sh = new THREE.Shape(), n = 26, ph = [r() * 6, r() * 6, r() * 6]; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, k = 1 + 0.22 * Math.sin(a * 2 + ph[0]) + 0.14 * Math.sin(a * 3 + ph[1]) + 0.08 * Math.sin(a * 5 + ph[2]); const px = Math.cos(a) * rx * k, pz = Math.sin(a) * rz * k; if (i) sh.lineTo(px, pz); else sh.moveTo(px, pz); } const m = mk(new THREE.ShapeGeometry(sh, 4), material, cx, y, cz); m.rotation.x = -Math.PI / 2; m.castShadow = false; return m; }

/** The mobile launcher (deck at y = 0, the rocket stands over the hole at the origin) and its red tower with nine swing arms.
 *  userData: arms (swing away at lift-off, each about its own hinge), masts (the three tail service masts, which tip back). */
export function launchTower() {
  const g = new THREE.Group(), fixed = new THREE.Group(), G = M.grey(), Rd = M.red(), K = M.black(), Gv = M.galv(), TX = -24, hw = 6, H = 116, L = 20, dy = H / L;
  // ---- the mobile launcher: a two-storey steel box 49 m by 41 m and 7.6 m deep, with a square hole for the flames
  const side = PM.mlSide(), deckM = PM.deck();
  for (const [w, d, x, z] of [[23.65, 41, -18.675, 0], [11.65, 41, 12.675, 0], [13.7, 13.65, 0, -13.675], [13.7, 13.65, 0, 13.675]]) { const b = mk(new THREE.BoxGeometry(w, 7.6, d), side, x, -3.8, z); fixed.add(b, mk(new THREE.BoxGeometry(w, 0.06, d), deckM, x, 0.03, z)); }
  for (const s of [-1, 1]) { rail(fixed, V(-30.4, 0, s * 20.4), V(18.4, 0, s * 20.4), M.yellow()); rail(fixed, V(s < 0 ? -30.4 : 18.4, 0, -20.4), V(s < 0 ? -30.4 : 18.4, 0, 20.4), M.yellow()); rail(fixed, V(-6.9, 0, s * 6.9), V(6.9, 0, s * 6.9), M.yellow()); rail(fixed, V(s * 6.9, 0, -6.9), V(s * 6.9, 0, 6.9), M.yellow()); }
  for (const [x, z] of [[-27, -17.5], [-27, 17.5], [15, -17.5], [15, 17.5], [-6, -18.5], [-6, 18.5]]) fixed.add(mk(new THREE.BoxGeometry(3.2, 6.7, 3.2), M.concrete(), x, -10.95, z), mk(new THREE.BoxGeometry(3.8, 0.5, 3.8), G, x, -7.85, z));       // the six pedestals it rests on
  for (let k = 0; k < 4; k++) {                                                                                                                                   // the four arms that hold the rocket down until the engines are at full power
    const a = k * Math.PI / 2, hd = new THREE.Group(); hd.position.set(Math.cos(a) * 7.0, 0, Math.sin(a) * 7.0); hd.rotation.y = -a;
    hd.add(mk(new THREE.BoxGeometry(2.6, 1.5, 2.0), G, 0.4, 0.75, 0), mk(new THREE.BoxGeometry(1.5, 1.9, 1.5), G, -0.6, 2.2, 0), mk(new THREE.BoxGeometry(1.7, 0.7, 1.0), M.steel(), -1.3, 3.3, 0), mk(new THREE.CylinderGeometry(0.28, 0.28, 1.7, 12), M.steel(), 0.7, 1.9, 0).rotateZ(0.5));
    fixed.add(hd);
  }
  for (const [x, z] of [[-9.6, -5.5], [-9.6, 5.5]]) fixed.add(mk(new THREE.BoxGeometry(2.4, 0.8, 2.4), G, x, 0.4, z));
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, q = V(Math.cos(a) * 9.6, 0.5, Math.sin(a) * 9.6); fixed.add(tube(q, q.clone().add(V(-Math.cos(a) * 1.4, 1.6, -Math.sin(a) * 1.4)), 0.12, Gv, 6)); }                         // water nozzles round the hole
  fixed.add(mk(new THREE.TorusGeometry(9.6, 0.16, 6, 48), Gv, 0, 0.5, 0).rotateX(Math.PI / 2));
  for (const [x, z, w, d, h2] of [[-27, -14, 5, 8, 3], [-27, 13, 5, 9, 2.4], [14, -15, 6, 7, 2.6], [15, 14, 4, 8, 3.2], [-14, -17, 7, 4, 2.2]]) fixed.add(mk(new THREE.BoxGeometry(w, h2, d), side, x, h2 / 2, z));                    // equipment houses on the deck
  // ---- the tower: four columns, a floor every 5.8 m, cross-braces on every face, lifts and stairs inside, pipes up the side
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) fixed.add(mk(new THREE.BoxGeometry(0.8, H, 0.8), Rd, TX + sx * hw, H / 2, sz * hw));
  for (let i = 0; i <= L; i++) {
    const y = i * dy;
    for (const s of [-1, 1]) {
      fixed.add(mk(new THREE.BoxGeometry(hw * 2, 0.4, 0.4), Rd, TX, y, s * hw), mk(new THREE.BoxGeometry(0.4, 0.4, hw * 2), Rd, TX + s * hw, y, 0));
      if (i < L) { fixed.add(tube(V(TX - hw, y, s * hw), V(TX + hw, y + dy, s * hw), 0.13, Rd), tube(V(TX + hw, y, s * hw), V(TX - hw, y + dy, s * hw), 0.13, Rd), tube(V(TX + s * hw, y, -hw), V(TX + s * hw, y + dy, hw), 0.13, Rd), tube(V(TX + s * hw, y, hw), V(TX + s * hw, y + dy, -hw), 0.13, Rd)); }
      if (i && i < L) { rail(fixed, V(TX - hw + 0.3, y, s * (hw - 0.3)), V(TX + hw - 0.3, y, s * (hw - 0.3)), Gv); rail(fixed, V(TX + s * (hw - 0.3), y, -hw + 0.3), V(TX + s * (hw - 0.3), y, hw - 0.3), Gv); }
    }
    fixed.add(mk(new THREE.BoxGeometry(hw * 2 - 0.6, 0.1, hw * 2 - 0.6), mat('grate', { color: 0x55585e, metalness: 0.7, roughness: 0.6 }), TX, y, 0));
    if (i < L) { const z0 = i % 2 ? -4.6 : -1.2; fixed.add(mk(new THREE.BoxGeometry(1.1, 0.12, 6.8), Gv, TX - 4.6, y + dy / 2, z0 + 3.4 - (i % 2 ? 0 : 3.4) + (i % 2 ? 0 : 0)).rotateX((i % 2 ? 1 : -1) * Math.atan2(dy, 6.2))); }       // flights of stairs
  }
  fixed.add(mk(new THREE.BoxGeometry(3.2, H + 3, 3.2), G, TX + 1.2, H / 2 + 1.5, -2.2), mk(new THREE.BoxGeometry(3.2, H + 3, 3.2), G, TX + 1.2, H / 2 + 1.5, 2.2));                                  // two lift shafts
  [[5.2, 0.32, M.silver()], [4.2, 0.2, M.pipe()], [3.4, 0.24, M.silver()], [-3.6, 0.16, M.pipe()], [-4.6, 0.3, M.pipe()], [-5.3, 0.12, K]].forEach(([z, r, m2], k) => { fixed.add(tube(V(TX + hw + 0.5, -2, z), V(TX + hw + 0.5, H - 8 - k * 9, z), r, m2, 10)); for (let y = 6; y < H - 10 - k * 9; y += 11.6) fixed.add(mk(new THREE.BoxGeometry(0.7, 0.3, r * 2 + 0.3), Rd, TX + hw + 0.25, y, z)); });     // fuel, oxygen and gas lines
  // the hammerhead crane on top, and a lightning rod above it
  fixed.add(mk(new THREE.CylinderGeometry(3.2, 3.6, 2.2, 20), Rd, TX, H + 1.1, 0), mk(new THREE.BoxGeometry(7, 4.2, 5), G, TX - 3, H + 4.3, 0));
  { const bx = (x0, x1) => { for (const sy of [0, 2.6]) for (const sz of [-1.3, 1.3]) fixed.add(tube(V(x0, H + 3.2 + sy, sz), V(x1, H + 3.2 + sy, sz), 0.16, Rd)); for (let x = x0; x < x1 - 0.1; x += 2.9) { const x2 = Math.min(x1, x + 2.9); for (const sz of [-1.3, 1.3]) fixed.add(tube(V(x, H + 3.2, sz), V(x2, H + 5.8, sz), 0.09, Rd), tube(V(x2, H + 3.2, sz), V(x2, H + 5.8, sz), 0.07, Rd)); fixed.add(tube(V(x, H + 5.8, -1.3), V(x2, H + 5.8, 1.3), 0.07, Rd), tube(V(x, H + 3.2, 1.3), V(x2, H + 3.2, -1.3), 0.07, Rd)); } };
    bx(TX - 12, TX + 23); fixed.add(mk(new THREE.BoxGeometry(4, 3, 3.4), M.concrete(), TX - 12, H + 3.9, 0), mk(new THREE.BoxGeometry(1.6, 1.2, 2.2), M.yellow(), TX + 18, H + 2.5, 0), tube(V(TX + 18, H + 2, 0), V(TX + 18, H - 9, 0), 0.05, K, 5), mk(new THREE.BoxGeometry(0.8, 1.4, 0.5), M.yellow(), TX + 18, H - 9.6, 0));
    fixed.add(tube(V(TX, H + 6, 0), V(TX, H + 13, 0), 0.5, Rd, 8), tube(V(TX, H + 13, 0), V(TX, H + 26, 0), 0.12, M.white(), 6)); for (const [dx, dz] of [[9, 0], [-7, 0]]) fixed.add(tube(V(TX, H + 12.5, 0), V(TX + dx, H + 5.8, dz), 0.05, K, 4)); }
  g.add(fuse(fixed));
  // ---- nine swing arms. Each carries pipes and cables across to the rocket and swings clear as it rises; the top one is the crew's walkway
  const arms = [];
  [[17, 5.3], [30, 5.3], [44, 5.3], [53, 5.3], [63, 5.3], [75, 3.6], [82, 3.6], [91, 2.6], [98.5, 2.3]].forEach(([y, r], i) => {
    const a = new THREE.Group(), len = -TX - hw - r - 0.3, t = new THREE.Group(), w = i === 8 ? 1.1 : 1.3;
    for (const sy of [-w, w]) for (const sz of [-w, w]) t.add(tube(V(0, sy, sz), V(len, sy, sz), 0.13, Rd));
    for (let x = 0; x < len - 0.05; x += 2.2) { const x2 = Math.min(len, x + 2.2); t.add(tube(V(x, -w, -w), V(x2, w, -w), 0.07, Rd), tube(V(x, -w, w), V(x2, w, w), 0.07, Rd), tube(V(x, w, -w), V(x2, w, w), 0.07, Rd), tube(V(x2, -w, -w), V(x2, w, -w), 0.05, Rd), tube(V(x2, -w, w), V(x2, w, w), 0.05, Rd), tube(V(x2, w, -w), V(x2, w, w), 0.05, Rd)); }
    t.add(mk(new THREE.BoxGeometry(len, 0.08, w * 2 - 0.2), mat('grate', {}), len / 2, -w + 0.1, 0)); rail(t, V(0.3, -w + 0.14, -w + 0.2), V(len - 0.3, -w + 0.14, -w + 0.2), Gv, 1.0); rail(t, V(0.3, -w + 0.14, w - 0.2), V(len - 0.3, -w + 0.14, w - 0.2), Gv, 1.0);
    t.add(mk(new THREE.CylinderGeometry(0.5, 0.5, w * 2 + 1.2, 12), G, -0.2, 0, w), mk(new THREE.BoxGeometry(1.4, w * 2 + 0.6, 1.2), G, -0.6, 0, w));          // the hinge
    if (i === 8) t.add(mk(new THREE.BoxGeometry(3.4, 2.9, 3.2), M.white(), len - 1.3, 0.25, 0), mk(new THREE.BoxGeometry(3.5, 0.12, 3.3), G, len - 1.3, 1.76, 0));   // the white room the crew walked through
    else {
      t.add(mk(new THREE.BoxGeometry(1.5, 2.0, 2.0), G, len - 0.75, 0, 0), mk(new THREE.BoxGeometry(0.25, 1.5, 1.6), M.steel(), len + 0.1, 0, 0));                 // the plate that plugs into the rocket
      for (const [z, rr, m2] of [[-0.6, 0.14, M.hose()], [0, 0.2, M.silver()], [0.6, 0.11, M.hose()]]) { const pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(V(u * (len - 0.8), w - 0.2 + (0.3 - 1.9 * 4 * u * (1 - u)) * (z ? 1 : 0.4), z)); } const cg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, rr, 6); t.add(mk(cg, m2)); }      // hoses hanging along it
    }
    a.add(fuse(t)); a.position.set(TX + hw, y, hw * 0.75 - 0.4); a.userData.i = i; g.add(a); arms.push(a);
  });
  // ---- three tail service masts at the rocket's foot, which tip back at lift-off
  const masts = [];
  for (const [x, z, ang] of [[-8.6, -4.6, -0.5], [-8.6, 4.6, 0.5], [8.6, 0, Math.PI]]) {
    const m = new THREE.Group(), t = new THREE.Group(); t.add(mk(new THREE.BoxGeometry(2.0, 6.6, 2.2), G, 0, 3.3, 0), mk(new THREE.BoxGeometry(3.0, 1.6, 1.8), G, 1.0, 6.0, 0), mk(new THREE.BoxGeometry(0.3, 1.2, 1.4), M.steel(), 2.6, 6.0, 0), tube(V(0.6, 6.6, 0.5), V(0.6, 1, 0.9), 0.12, M.hose(), 6), tube(V(0.6, 6.6, -0.5), V(0.6, 1, -0.9), 0.1, M.silver(), 6));
    m.add(fuse(t)); m.position.set(x, 0, z); m.rotation.y = ang; m.userData.tip = 0; g.add(m); masts.push(m);
  }
  g.userData = { arms, masts };
  return g;
}

/** The pad itself and the land round it: the concrete hill split by the flame trench, the ramp the crawler climbed, the fuel
 *  tanks at the edge, ponds and scrub, the Atlantic to the east, and the assembly building 5.5 km away. The pad's surface is at y = -14.3. */
export function padSite() {
  const g = new THREE.Group(), fixed = new THREE.Group(), YT = -14.3, YG = -27.3, conc = PM.concrete(), grass = PM.grass();
  // ---- the hill, in two halves with the trench between them
  for (const s of [-1, 1]) {
    const top = [[9, -150], [110, -150], [150, -110], [150, 110], [110, 150], [9, 150]].map(([x, z]) => V(s * x, YT, z)), bot = [[9, -410], [150, -410], [215, -140], [215, 140], [140, 205], [9, 205]].map(([x, z]) => V(s * x, YG, z));
    const sh = new THREE.Shape(); top.forEach((p, i) => (i ? sh.lineTo(p.x, -p.z) : sh.moveTo(p.x, -p.z)));
    const tg = new THREE.ShapeGeometry(sh); tg.rotateX(-Math.PI / 2); const uv = tg.attributes.uv, tp = tg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, tp.getX(i) / 300, tp.getZ(i) / 300); const tm = mk(tg, conc, 0, YT, 0); fixed.add(tm);
    // the sides: grass slopes, a brick wall along the trench
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6, a = top[i], b = top[j], c2 = bot[j], d = bot[i], wall = i === 5, ge = new THREE.BufferGeometry();
      const P = s > 0 ? [a, d, c2, a, c2, b] : [a, c2, d, a, b, c2], L = a.distanceTo(b), Hh = a.distanceTo(d), U = { a: [0, 1], b: [L / 40, 1], c: [L / 40, 0], d: [0, 0] }, uvs = (s > 0 ? ['a', 'd', 'c', 'a', 'c', 'b'] : ['a', 'c', 'd', 'a', 'b', 'c']).flatMap((k) => [U[k][0] * (wall ? 0.1 : 1), U[k][1] * (wall ? 1 : Hh / 40)]);
      ge.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap((p) => [p.x, p.y, p.z]), 3)); ge.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); ge.computeVertexNormals();
      const m = mk(ge, wall ? PM.brick() : (i === 0 ? conc : grass)); m.material.side = THREE.DoubleSide; fixed.add(m);
    }
    // the crawler's two tracks: up the ramp and across the top
    const lane = (pa, pb, w) => { const d = pb.clone().sub(pa), L = d.length(), m = mk(new THREE.PlaneGeometry(w, L), PM.gravel()); m.geometry.rotateX(-Math.PI / 2); m.position.copy(pa).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V(0, 0, 1), d.normalize()); m.position.y += 0.06; m.castShadow = false; return m; };
    fixed.add(lane(V(s * 15.5, YG, -410), V(s * 15.5, YT, -150), 12), lane(V(s * 15.5, YT, -150), V(s * 15.5, YT, -24), 12), lane(V(s * 15.5, YG, -410), V(s * 15.5, YG, -3200), 12));
    rail(fixed, V(s * 9.2, YT, -148), V(s * 9.2, YT, -22), M.yellow()); rail(fixed, V(s * 9.2, YT, 22), V(s * 9.2, YT, 148), M.yellow());
  }
  fixed.add(mk(new THREE.BoxGeometry(18, 0.4, 720), mat('trenchFloor', { color: 0x2c2a28, roughness: 1, metalness: 0 }), 0, YG + 0.2, -100));
  { const sh = new THREE.Shape(); sh.moveTo(-9, 0); sh.lineTo(0, 10.5); sh.lineTo(9, 0); sh.closePath(); const d = mk(new THREE.ExtrudeGeometry(sh, { depth: 17.6, bevelEnabled: false }), mat('deflector', { color: 0x4a4744, metalness: 0.6, roughness: 0.6 }), 8.8, YG, 0); d.rotation.y = -Math.PI / 2; d.position.set(8.8, YG, 0); d.rotation.y = Math.PI / 2; d.position.set(-8.8, YG, 0); fixed.add(d); }         // the steel wedge that splits the flames to both sides
  // ---- round the pad: fuel spheres, pipes, light masts, a ring road
  const sphere = (x, z, r, material) => { fixed.add(mk(new THREE.SphereGeometry(r, 40, 24), material, x, YG + r + 3, z)); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; fixed.add(tube(V(x + Math.cos(a) * r * 0.82, YG, z + Math.sin(a) * r * 0.82), V(x + Math.cos(a) * r * 0.7, YG + r + 2, z + Math.sin(a) * r * 0.7), 0.3, M.grey(), 8)); } fixed.add(mk(new THREE.CylinderGeometry(0.7, 0.7, 3, 12), M.grey(), x, YG + 2 * r + 4, z)); };
  sphere(-330, 300, 11, M.pipe()); sphere(330, 310, 10.5, M.pipe());                                                                              // liquid oxygen (north-west) and liquid hydrogen (north-east)
  fixed.add(tube(V(-320, YG + 1.2, 290), V(-150, YG + 1.2, 120), 0.45, M.silver(), 10), tube(V(-150, YG + 1.2, 120), V(-60, YT + 0.8, 40), 0.45, M.silver(), 10), tube(V(-60, YT + 0.8, 40), V(-30, YT + 0.8, 8), 0.45, M.silver(), 10));
  fixed.add(tube(V(320, YG + 1.2, 300), V(150, YG + 1.2, 120), 0.35, M.pipe(), 10), tube(V(150, YG + 1.2, 120), V(40, YT + 0.8, 30), 0.35, M.pipe(), 10));
  for (let k = 0; k < 3; k++) { const c2 = mk(new THREE.CylinderGeometry(3.4, 3.4, 22, 24), M.pipe(), 300 + k * 10, YG + 4.6, -250); c2.rotation.x = Math.PI / 2; fixed.add(c2, mk(new THREE.BoxGeometry(1.2, 2.4, 3), M.concrete(), 300 + k * 10, YG + 1.2, -258), mk(new THREE.BoxGeometry(1.2, 2.4, 3), M.concrete(), 300 + k * 10, YG + 1.2, -242)); }     // kerosene tanks
  for (const [x, z] of [[-140, -120], [140, -120], [-140, 120], [140, 120], [0, 146], [-146, 0], [146, 0]]) { fixed.add(tube(V(x, YT, z), V(x, YT + 30, z), 0.35, M.galv(), 6), mk(new THREE.BoxGeometry(5, 3, 0.8), M.dark(), x, YT + 31, z)); for (let k = 0; k < 5; k++) fixed.add(tube(V(x - 1, YT + k * 6, z), V(x + 1, YT + k * 6 + 6, z), 0.08, M.galv(), 4), tube(V(x + 1, YT + k * 6, z), V(x - 1, YT + k * 6 + 6, z), 0.08, M.galv(), 4)); }       // floodlight masts
  for (const [x, z, w, h2, d] of [[-120, -60, 14, 5, 9], [110, 70, 10, 4, 16], [-90, 110, 18, 4, 8], [60, -110, 9, 6, 9], [-40, 128, 8, 3, 6]]) fixed.add(mk(new THREE.BoxGeometry(w, h2, d), mat('hut', { color: 0xc9c8c2, roughness: 0.8, metalness: 0.05 }), x, YT + h2 / 2, z));      // small buildings on the pad
  { const ringR = new THREE.RingGeometry(470, 482, 96); ringR.rotateX(-Math.PI / 2); const m = mk(ringR, PM.sand(), 0, YG + 0.08, 0); m.castShadow = false; fixed.add(m); }
  g.add(fuse(fixed));
  // ---- the land: scrub, ponds and lagoons, the beach and the ocean to the east, the assembly building far to the south-west
  const far = new THREE.Group();
  { const gr = mk(new THREE.CircleGeometry(40000, 64), PM.scrub(), 0, YG, 0); gr.rotation.x = -Math.PI / 2; gr.castShadow = false; far.add(gr); }
  const W = PM.water();
  for (const [x, z, rx, rz, sd] of [[-900, 500, 420, 260, 3], [-1700, -600, 700, 380, 5], [-600, 1500, 520, 300, 7], [-2800, 900, 1100, 700, 9], [-1200, -2100, 600, 420, 11], [-3600, -1800, 1500, 900, 13], [300, 1900, 300, 520, 15], [-5200, 600, 1800, 2600, 17], [-420, -760, 130, 90, 19], [280, 760, 110, 150, 21]]) far.add(patch(x, z, rx, rz, sd, W, YG + 0.12));
  for (const [x, z, rx, rz, sd] of [[-700, -300, 160, 90, 23], [500, -700, 140, 200, 25], [-1500, 300, 240, 130, 27], [200, 1200, 150, 100, 29]]) far.add(patch(x, z, rx, rz, sd, PM.sand(), YG + 0.1));
  { const beach = mk(new THREE.PlaneGeometry(130, 80000), PM.sand(), 765, YG + 0.15, 0); beach.rotation.x = -Math.PI / 2; beach.castShadow = false; const sea = mk(new THREE.PlaneGeometry(40000, 80000), PM.sea(), 830 + 20000, YG + 0.2, 0); sea.rotation.x = -Math.PI / 2; sea.castShadow = false; const surf = mk(new THREE.PlaneGeometry(9, 80000), mat('surf', { color: 0xf4f6f4, roughness: 0.9, metalness: 0 }), 832, YG + 0.26, 0); surf.rotation.x = -Math.PI / 2; surf.castShadow = false; far.add(beach, sea, surf); }
  { const vab = PM.vab(), vx = -1500, vz = -5300; far.add(mk(new THREE.BoxGeometry(218, 160, 158), vab, vx, YG + 80, vz), mk(new THREE.BoxGeometry(130, 64, 80), vab, vx - 30, YG + 32, vz - 120), mk(new THREE.BoxGeometry(110, 24, 55), mat('lcc', { color: 0xd9d9d4, roughness: 0.8 }), vx + 190, YG + 12, vz + 30));
    const road = mk(new THREE.PlaneGeometry(30, 2700), PM.gravel(), -750, YG + 0.07, -4250); road.rotation.x = -Math.PI / 2; road.rotation.z = -0.59; road.castShadow = false; far.add(road); }
  g.add(far);
  g.userData = { far, YT, YG };
  return g;
}
