// Detailed hand-built models for the hardware NASA has not published a 3D model of
// (Surveyor, the lunar rover, the Apollo science stations, the flags, Mars Pathfinder and
// Sojourner, Phoenix, the sky-crane wreck, New Horizons). Built from simple shapes to the real
// dimensions (metres; y up, x east, z south, ground at y = 0). No photographs are used:
// every surface pattern is drawn here.

import * as THREE from 'three';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const lcg = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// ---------------------------------------------------------------- surface patterns (drawn once, shared)
const TEX = {};
function tex(key, w, h, draw, { srgb = true, rx = 1, ry = 1 } = {}) {
  if (TEX[key]) return TEX[key];
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return (TEX[key] = t);
}
/** crumpled foil: many small flat facets, each a slightly different brightness */
function facets(x, w, h, lo, hi, n, seed) {
  const r = lcg(seed); x.fillStyle = `rgb(${(lo + hi) >> 1},${(lo + hi) >> 1},${(lo + hi) >> 1})`; x.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const cx = r() * w, cy = r() * h, s = 6 + r() * 26, v = Math.round(lo + r() * (hi - lo));
    x.fillStyle = `rgba(${v},${v},${v},0.55)`; x.beginPath();
    for (let k = 0; k < 3; k++) { const a = r() * 6.283; x.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); }
    x.closePath(); x.fill();
  }
}
const foilBump = () => tex('foilBump', 256, 256, (x, w, h) => facets(x, w, h, 40, 215, 1100, 11), { srgb: false, rx: 2, ry: 2 });
const foilMap = () => tex('foilMap', 256, 256, (x, w, h) => facets(x, w, h, 165, 255, 1100, 11), { rx: 2, ry: 2 });
const clothBump = () => tex('clothBump', 256, 256, (x, w, h) => {
  const r = lcg(5); x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {              // long soft creases
    const y0 = r() * h, a = (r() - 0.5) * 0.9, v = r() < 0.5 ? 40 : 215; x.strokeStyle = `rgba(${v},${v},${v},0.22)`; x.lineWidth = 3 + r() * 9;
    x.beginPath(); x.moveTo(-10, y0); x.bezierCurveTo(w * 0.3, y0 + a * 60, w * 0.6, y0 - a * 60, w + 10, y0 + a * 90); x.stroke();
  }
  for (let y = 0; y < h; y += 2) { x.fillStyle = `rgba(0,0,0,${0.05 + 0.05 * (y % 4 === 0)})`; x.fillRect(0, y, w, 1); }   // weave
}, { srgb: false });
function solarCells(key, cols, rows, base = [18, 30, 74]) {
  return tex(key, 512, 512, (x, w, h) => {
    const r = lcg(cols * 31 + rows); x.fillStyle = '#9aa3b4'; x.fillRect(0, 0, w, h);
    const cw = w / cols, ch = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const k = 0.82 + r() * 0.36; x.fillStyle = `rgb(${Math.round(base[0] * k)},${Math.round(base[1] * k)},${Math.round(base[2] * k)})`;
      x.fillRect(i * cw + 1, j * ch + 1, cw - 2, ch - 2);
      x.fillStyle = 'rgba(190,200,225,0.28)'; x.fillRect(i * cw + cw * 0.5 - 0.5, j * ch + 1, 1, ch - 2);       // the fine collector line on every cell
    }
  });
}
/** a plate full of round glass corner-cubes */
function cubeGrid(key, nx, ny) {
  return tex(key, nx * 48, ny * 48, (x, w, h) => {
    x.fillStyle = '#b7babf'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const cx = i * 48 + 24, cy = j * 48 + 24;
      x.fillStyle = '#6d7076'; x.beginPath(); x.arc(cx, cy, 19.5, 0, 6.283); x.fill();
      const g = x.createRadialGradient(cx - 5, cy - 6, 2, cx, cy, 17); g.addColorStop(0, '#dfe9f5'); g.addColorStop(0.5, '#5d7088'); g.addColorStop(1, '#141b26');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 16.5, 0, 6.283); x.fill();
      x.strokeStyle = 'rgba(235,242,255,0.5)'; x.lineWidth = 1.2;                                               // the three edges of the cube corner
      for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.5; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16); x.stroke(); }
    }
  });
}
/** the lunar rover tyre: an open wire mesh with titanium chevrons riveted on (alpha-tested) */
const tyreTex = () => tex('tyre', 256, 128, (x, w, h) => {
  x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(150,152,156,1)'; x.lineWidth = 1.6;
  for (let i = -h; i < w + h; i += 9) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h, h); x.stroke(); x.beginPath(); x.moveTo(i + h, 0); x.lineTo(i, h); x.stroke(); }
  x.strokeStyle = 'rgba(96,98,104,1)'; x.lineWidth = 15; x.lineJoin = 'miter';
  for (let i = 0; i < 4; i++) { const x0 = i * 64 + 14; x.beginPath(); x.moveTo(x0, 6); x.lineTo(x0 + 26, h / 2); x.lineTo(x0, h - 6); x.stroke(); }
}, { rx: 6, ry: 1 });
/** a gold wire mesh (the rover's umbrella antenna) */
const goldMesh = () => tex('goldMesh', 128, 128, (x, w, h) => {
  x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(214,170,74,1)'; x.lineWidth = 1.5;
  for (let i = 0; i <= w; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
}, { rx: 10, ry: 3 });
const webbing = () => tex('webbing', 128, 128, (x, w, h) => {
  x.fillStyle = '#b9b3a2'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < w; i += 16) { x.fillStyle = 'rgba(70,64,52,0.55)'; x.fillRect(i, 0, 3, h); x.fillRect(0, i, w, 3); x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(i + 3, 0, 5, h); }
}, { rx: 3, ry: 3 });
const dials = () => tex('dials', 256, 256, (x, w, h) => {
  x.fillStyle = '#1a1b1e'; x.fillRect(0, 0, w, h); x.strokeStyle = '#c9ccd2'; x.fillStyle = '#c9ccd2';
  for (const [cx, cy, r] of [[64, 62, 44], [176, 50, 32], [200, 120, 22]]) { x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.stroke(); x.lineWidth = 2; for (let k = 0; k < 12; k++) { const a = k * 0.5236; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8); x.lineTo(cx + Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95); x.stroke(); } x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + r * 0.6, cy - r * 0.45); x.stroke(); }
  for (let i = 0; i < 4; i++) { x.fillRect(22 + i * 28, 140, 16, 44); x.fillRect(150 + i * 24, 168, 12, 12); }
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { x.beginPath(); x.arc(30 + i * 38, 212 + j * 26, 7, 0, 6.283); x.fill(); }
});
const mirrorTiles = () => tex('mirrorTiles', 128, 128, (x, w, h) => {
  const r = lcg(3); x.fillStyle = '#8f949c'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const v = 205 + Math.round(r() * 45); x.fillStyle = `rgb(${v},${v + 2},${v + 6})`; x.fillRect(i * 16 + 1, j * 16 + 1, 14, 14); }
});
/** a fan-fold round solar array: wedge-shaped gores, rows of cells in each */
const goreTex = () => tex('gores', 512, 512, (x, w, h) => {
  const r = lcg(9), cx = w / 2, cy = h / 2; x.fillStyle = '#b08a5c'; x.fillRect(0, 0, w, h);
  for (let g = 0; g < 10; g++) {
    const a0 = g * 0.6283, a1 = a0 + 0.6283;
    for (let k = 14; k > 1; k--) {
      const R1 = (k / 14) * 250, v = 0.8 + r() * 0.4;
      x.fillStyle = `rgb(${Math.round(22 * v)},${Math.round(26 * v)},${Math.round(62 * v)})`;
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a0 + 0.012) * R1, cy + Math.sin(a0 + 0.012) * R1); x.lineTo(cx + Math.cos(a1 - 0.012) * R1, cy + Math.sin(a1 - 0.012) * R1); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(160,170,200,0.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(cx + Math.cos(a0) * R1, cy + Math.sin(a0) * R1); x.lineTo(cx + Math.cos(a1) * R1, cy + Math.sin(a1) * R1); x.stroke();
    }
    x.strokeStyle = '#c9a36c'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a0) * 256, cy + Math.sin(a0) * 256); x.stroke();
  }
  x.fillStyle = '#c8ccd4'; x.beginPath(); x.arc(cx, cy, 22, 0, 6.283); x.fill();
});
const slots = () => tex('slots', 256, 256, (x, w, h) => {              // the slotted face of a flat "planar array" antenna
  x.fillStyle = '#d9d7d0'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(70,72,78,0.85)';
  for (let j = 0; j < 12; j++) for (let i = 0; i < 6; i++) x.fillRect(14 + i * 40 + (j % 2) * 14, 12 + j * 20, 20, 3);
  x.strokeStyle = 'rgba(90,92,98,0.6)'; x.lineWidth = 2; x.strokeRect(3, 3, w - 6, h - 6);
});
const louvers = () => tex('louvers', 128, 128, (x, w, h) => { x.fillStyle = '#d4d6da'; x.fillRect(0, 0, w, h); for (let j = 4; j < h; j += 12) { x.fillStyle = '#8b8f97'; x.fillRect(4, j, w - 8, 3); x.fillStyle = '#f4f5f7'; x.fillRect(4, j + 3, w - 8, 2); } });

// ---------------------------------------------------------------- materials (no reflections are available, so nothing is a pure mirror)
const MAT = {};
const std = (key, o) => MAT[key] || (MAT[key] = new THREE.MeshStandardMaterial(o));
const m = {
  alu: () => std('alu', { color: 0xb9bcc2, metalness: 0.55, roughness: 0.42 }),
  aluDark: () => std('aluDark', { color: 0x74777d, metalness: 0.55, roughness: 0.5 }),
  steel: () => std('steel', { color: 0x9a9da3, metalness: 0.6, roughness: 0.35 }),
  white: () => std('white', { color: 0xe8e6e0, metalness: 0.0, roughness: 0.62 }),
  black: () => std('black', { color: 0x17171a, metalness: 0.2, roughness: 0.6 }),
  rubber: () => std('rubber', { color: 0x2a2a2d, metalness: 0.0, roughness: 0.9 }),
  gold: () => std('gold', { color: 0xd0a040, metalness: 0.55, roughness: 0.36, map: foilMap(), bumpMap: foilBump(), bumpScale: 2.2 }),
  silverFoil: () => std('silverFoil', { color: 0xd6d9de, metalness: 0.55, roughness: 0.32, map: foilMap(), bumpMap: foilBump(), bumpScale: 2.2, side: THREE.DoubleSide }),
  goldFoil2: () => std('goldFoil2', { color: 0xd0a040, metalness: 0.55, roughness: 0.36, map: foilMap(), bumpMap: foilBump(), bumpScale: 2.2, side: THREE.DoubleSide }),
  tan: () => std('tan', { color: 0xb9a57c, metalness: 0, roughness: 0.95, bumpMap: clothBump(), bumpScale: 2.5 }),
  cloth: () => std('cloth', { color: 0xf1efe9, metalness: 0, roughness: 0.92, bumpMap: clothBump(), bumpScale: 1.6, side: THREE.DoubleSide }),
  fender: () => std('fender', { color: 0xa9743c, metalness: 0.05, roughness: 0.72, side: THREE.DoubleSide }),
  copper: () => std('copper', { color: 0xb87333, metalness: 0.6, roughness: 0.4 }),
  rtg: () => std('rtg', { color: 0x2b2c30, metalness: 0.45, roughness: 0.55 }),
  scorched: () => std('scorched', { color: 0x3a3532, metalness: 0.45, roughness: 0.7 }),
  redAno: () => std('redAno', { color: 0xa43a2a, metalness: 0.5, roughness: 0.4 }),
  goldAno: () => std('goldAno', { color: 0xc9a455, metalness: 0.55, roughness: 0.38 }),
  lens: () => std('lens', { color: 0x0a0c12, metalness: 0.3, roughness: 0.12 }),
  cells: (key = 'cells8', c = 8, r = 8) => std('m' + key, { map: solarCells(key, c, r), metalness: 0.35, roughness: 0.3 }),
};

// ---------------------------------------------------------------- shape helpers
function mesh(geo, mat, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; }
const box = (w, h, d, mat, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
const cyl = (r1, r2, h, mat, x, y, z, seg = 16, open = false) => mesh(new THREE.CylinderGeometry(r1, r2, h, seg, 1, open), mat, x, y, z);
const ball = (r, mat, x, y, z, seg = 20) => mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg >> 1)), mat, x, y, z);
/** a round tube from point a to point b */
function strut(a, b, r, mat, seg = 7) {
  const d = new THREE.Vector3().subVectors(b, a), o = mesh(new THREE.CylinderGeometry(r, r, d.length(), seg), mat);
  o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize()); return o;
}
/** a bent tube or a cable through several points */
function pipe(pts, r, mat, seg = 6, steps = 0) { const c = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); return mesh(new THREE.TubeGeometry(c, steps || pts.length * 8, r, seg, false), mat); }
/** a shape turned on a lathe around the y axis: profile is [[radius, y], ...] */
function lathe(profile, mat, seg = 24) { return mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat); }
/** a dish (paraboloid) opening toward +y */
function dish(R, depth, mat, seg = 32, rings = 8) { const p = []; for (let i = 0; i <= rings; i++) { const r = R * i / rings; p.push([Math.max(r, 0.0001), depth * (r / R) * (r / R)]); } return lathe(p, mat, seg); }
/** a coil (helical antenna) around the y axis */
function helix(r, h, turns, wire, mat) { const p = []; const n = turns * 14; for (let i = 0; i <= n; i++) { const a = i / n * turns * 6.283; p.push(V(Math.cos(a) * r, i / n * h, Math.sin(a) * r)); } return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), n, wire, 5, false), mat); }
/** point o along the direction (dx, dy, dz) instead of straight up */
function aim(o, dx, dy, dz) { o.quaternion.setFromUnitVectors(UP, V(dx, dy, dz).normalize()); return o; }
/** a lumpy ball: crumpled fabric, a dented tank, a rock */
function lump(r, detail, amount, seed, mat) {
  const g = new THREE.IcosahedronGeometry(r, detail), p = g.attributes.position, rr = lcg(seed), n = V(0, 0, 0);
  const f = [rr() * 9, rr() * 9, rr() * 9];
  for (let i = 0; i < p.count; i++) { n.fromBufferAttribute(p, i); const k = 1 + amount * (Math.sin(n.x * 9 / r + f[0]) * Math.sin(n.y * 7 / r + f[1]) + 0.6 * Math.sin(n.z * 13 / r + f[2])); p.setXYZ(i, n.x * k, n.y * k, n.z * k); }
  { const nn = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { n.fromBufferAttribute(p, i).normalize(); nn[i * 3] = n.x; nn[i * 3 + 1] = n.y; nn[i * 3 + 2] = n.z; } g.setAttribute('normal', new THREE.BufferAttribute(nn, 3)); }   // smooth, like a ball
  return mesh(g, mat);
}
const polar = (r, a, y = 0) => V(Math.cos(a) * r, y, Math.sin(a) * r);

// ================================================================= Surveyor (1966 to 1968)
// 3 m to the top of the mast, footpads 4.3 m apart. opts.scoop: the soil-digging arm (Surveyor 3 and 7).
// opts.visited: Surveyor 3 as it stands today; the Apollo 12 crew cut off its TV camera and scoop and took them home.
export function surveyor(opts = {}) {
  const g = new THREE.Group(), A = m.alu(), LO = [], UPc = [];
  for (let i = 0; i < 3; i++) { const a = i * 2.0944; LO.push(polar(1.0, a, 0.72)); UPc.push(polar(0.62, a, 1.32)); }
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3, a = i * 2.0944;
    g.add(strut(LO[i], LO[j], 0.028, A), strut(UPc[i], UPc[j], 0.025, A), strut(LO[i], UPc[i], 0.028, A), strut(LO[i], UPc[j], 0.018, A), strut(LO[j], UPc[i], 0.018, A));
    // landing leg: an A-frame, a telescoping shock absorber, and a crushable footpad
    const ankle = polar(2.15, a, 0.17);
    g.add(strut(polar(0.98, a - 0.3, 0.72), ankle, 0.03, A), strut(polar(0.98, a + 0.3, 0.72), ankle, 0.03, A));
    const top = polar(0.7, a, 1.36), knee = polar(1.86, a, 0.42), mid = top.clone().lerp(knee, 0.55);
    g.add(strut(top, mid, 0.05, m.white(), 10), strut(mid, knee, 0.028, m.steel(), 8), strut(knee, ankle, 0.03, A));
    const pad = lathe([[0.001, 0], [0.16, 0], [0.2, 0.045], [0.185, 0.1], [0.12, 0.13], [0.001, 0.13]], m.aluDark(), 20); pad.position.set(ankle.x, 0, ankle.z); g.add(pad);
    g.add(cyl(0.085, 0.085, 0.2, m.aluDark(), ...polar(0.8, a, 0.56).toArray(), 12));                           // crushable block under the frame
    // one of the three small steering engines
    const ve = polar(0.86, a + 0.42, 0.6); g.add(cyl(0.05, 0.05, 0.13, m.steel(), ve.x, ve.y + 0.02, ve.z, 10));
    const noz = lathe([[0.028, 0.14], [0.04, 0.08], [0.075, 0]], m.aluDark(), 14); noz.material = std('nozzle', { color: 0x5a5d63, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }); noz.position.set(ve.x, ve.y - 0.19, ve.z); g.add(noz);
    // propellant tanks, two beside every leg
    for (const s of [-1, 1]) { const tp = polar(0.6, a + s * 0.5, 0.98); g.add(ball(0.165, s > 0 ? m.silverFoil() : m.white(), tp.x, tp.y, tp.z, 18)); }
  }
  g.add(ball(0.2, m.silverFoil(), 0.12, 1.02, -0.08), ball(0.1, m.alu(), -0.2, 0.92, 0.22, 14));                 // helium and nitrogen
  // two insulated electronics boxes with mirror-tile tops
  for (const [a, w] of [[1.047, 0.52], [3.1416, 0.46]]) {
    const b = new THREE.Group(), p = polar(0.78, a, 1.08);
    b.add(box(0.44, 0.44, w, m.silverFoil(), 0, 0, 0)); const lid = box(0.47, 0.025, w + 0.03, std('mirrorTiles', { map: mirrorTiles(), metalness: 0.4, roughness: 0.25 }), 0, 0.232, 0); b.add(lid);
    b.add(cyl(0.02, 0.02, 0.06, m.black(), 0.1, -0.24, 0.1, 8), cyl(0.02, 0.02, 0.06, m.black(), -0.1, -0.24, -0.1, 8));
    b.position.copy(p); b.rotation.y = -a; g.add(b);
  }
  // landing radar: two flat antennas looking down
  for (const a of [5.24, 4.3]) { const p = polar(0.74, a, 0.6), o = cyl(0.3, 0.3, 0.035, m.white(), p.x, p.y, p.z, 24); o.rotation.set(0.12, 0, 0.1); g.add(o); g.add(strut(p, polar(0.7, a, 0.74), 0.015, A)); }
  // mast, with the solar panel on one side and the flat high-gain antenna on the other
  g.add(strut(V(0, 1.32, 0), V(0, 2.62, 0), 0.045, A, 10));
  for (let i = 0; i < 3; i++) g.add(strut(UPc[i], V(0, 1.86, 0), 0.016, A));
  g.add(cyl(0.075, 0.075, 0.16, m.aluDark(), 0, 2.62, 0, 14), strut(V(-0.5, 2.62, 0), V(0.5, 2.62, 0), 0.03, A));
  const sp = new THREE.Group(); sp.add(box(0.95, 0.02, 0.98, m.cells('cells9x10', 9, 10), 0, 0.012, 0), box(0.97, 0.014, 1.0, A, 0, -0.004, 0));
  for (const z of [-0.3, 0, 0.3]) sp.add(box(0.93, 0.03, 0.02, A, 0, -0.024, z));
  sp.position.set(0.56, 2.62, 0); sp.rotation.z = 0.96; g.add(sp);
  const pa = new THREE.Group(); pa.add(box(0.97, 0.03, 0.97, std('slots', { map: slots(), metalness: 0.1, roughness: 0.6 }), 0, 0.016, 0), box(0.99, 0.02, 0.99, A, 0, -0.008, 0));
  for (const x of [-0.3, 0.3]) pa.add(box(0.02, 0.04, 0.95, A, x, -0.036, 0));
  pa.position.set(-0.54, 2.56, 0); pa.rotation.z = -1.12; g.add(pa);
  // two small all-round antennas on long booms
  for (const [i, s] of [[1, 1], [2, -1]]) { const e = polar(1.95, i * 2.0944 + s * 0.55, 2.05); g.add(strut(UPc[i], e, 0.014, A)); const c = cyl(0.03, 0.065, 0.15, m.white(), e.x, e.y + 0.07, e.z, 12); g.add(c); }
  // television camera: an upright tube looking into a tilting mirror under a hood
  const cb = polar(0.8, 0.52, 1.02);
  g.add(strut(polar(0.7, 0.3, 1.25), cb, 0.02, A), strut(polar(0.8, 0.9, 1.05), cb, 0.02, A));
  if (!opts.visited) {
    const cam = new THREE.Group();
    cam.add(cyl(0.08, 0.08, 0.5, m.white(), 0, 0.25, 0, 16), cyl(0.095, 0.095, 0.17, m.white(), 0, 0.58, 0, 16), box(0.13, 0.11, 0.04, m.lens(), 0, 0.58, 0.085), cyl(0.1, 0.1, 0.02, m.aluDark(), 0, 0.675, 0, 16), box(0.12, 0.1, 0.1, m.silverFoil(), 0.1, 0.12, 0));
    cam.position.copy(cb); cam.rotation.set(0.28, 0.52, 0); g.add(cam);
  } else g.add(cyl(0.03, 0.03, 0.06, m.aluDark(), cb.x, cb.y + 0.03, cb.z, 8));                                 // only the cut bracket is left
  // the digging arm: a folding lattice with a small scoop
  if (opts.scoop) {
    const base = polar(0.92, -0.75, 0.86), dir = polar(1, -0.75, 0), side = V(-dir.z, 0, dir.x), n = 5, L = 1.35;
    let pu = base.clone().addScaledVector(side, 0.07), pl = base.clone().addScaledVector(side, -0.07);
    for (let k = 1; k <= n; k++) {
      const c = base.clone().addScaledVector(dir, L * k / n); c.y = 0.86 - 0.72 * (k / n);
      const w = 0.07 * (k % 2 ? -1 : 1), nu = c.clone().addScaledVector(side, w), nl = c.clone().addScaledVector(side, -w);
      g.add(strut(pu, nu, 0.009, A), strut(pl, nl, 0.009, A)); pu = nu; pl = nl;
    }
    const tip = base.clone().addScaledVector(dir, L + 0.06); tip.y = 0.12;
    if (!opts.visited) { const sc = box(0.13, 0.07, 0.06, m.steel(), tip.x, tip.y, tip.z); sc.rotation.y = 0.75; g.add(sc); }
    g.add(box(0.1, 0.1, 0.12, m.white(), base.x, base.y, base.z));
  }
  return g;
}

// ================================================================= Lunar Roving Vehicle (Apollo 15, 16, 17)
// 3.1 m long, 2.3 m wheelbase, 1.83 m track, wire-mesh wheels 81 cm across. The front is +x.
export function lrv() {
  const g = new THREE.Group(), A = m.alu(), WX = 1.15, WZ = 0.915, WR = 0.405;
  // chassis: three hinged aluminium frames
  for (const z of [-0.5, 0.5]) g.add(box(3.0, 0.07, 0.06, A, 0, 0.6, z));
  for (const x of [-1.5, -0.76, 0, 0.76, 1.5]) g.add(box(0.06, 0.07, 1.06, A, x, 0.6, 0));
  g.add(box(1.5, 0.018, 1.0, std('floor', { color: 0xa4a7ad, metalness: 0.45, roughness: 0.55 }), 0, 0.645, 0));
  g.add(box(0.7, 0.014, 1.0, m.aluDark(), -1.13, 0.642, 0));
  // forward frame: two batteries and the drive electronics under white thermal covers
  for (const z of [-0.27, 0.27]) { g.add(box(0.5, 0.22, 0.42, m.white(), 1.1, 0.76, z)); g.add(box(0.46, 0.012, 0.38, std('mirrorTiles', { map: mirrorTiles(), metalness: 0.4, roughness: 0.25 }), 1.1, 0.877, z)); }
  g.add(box(0.2, 0.2, 0.9, m.silverFoil(), 0.82, 0.75, 0));
  // wheels
  const tyreMat = std('tyre', { map: tyreTex(), alphaTest: 0.45, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 });
  for (const sx of [1, -1]) for (const sz of [1, -1]) {
    const w = new THREE.Group();
    const tyre = lathe([[0.3, -0.115], [0.35, -0.118], [0.39, -0.085], [WR, -0.03], [WR, 0.03], [0.39, 0.085], [0.35, 0.118], [0.3, 0.115]], tyreMat, 40); w.add(tyre);
    w.add(cyl(0.29, 0.29, 0.15, std('bump', { color: 0x8d9097, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }), 0, 0, 0, 28, true));   // inner bump-stop frame
    w.add(cyl(0.2, 0.2, 0.02, A, 0, 0.03, 0, 24), cyl(0.085, 0.085, 0.16, m.aluDark(), 0, 0.02, 0, 16), cyl(0.3, 0.3, 0.012, A, 0, 0.03, 0, 28, true));
    for (let k = 0; k < 8; k++) { const a = k * 0.7854; w.add(strut(V(Math.cos(a) * 0.19, 0.03, Math.sin(a) * 0.19), V(Math.cos(a) * 0.3, 0.03, Math.sin(a) * 0.3), 0.009, A, 5)); }
    w.rotation.x = sz * Math.PI / 2; w.position.set(sx * WX, WR, sz * WZ); g.add(w);
    // suspension: two wishbones and a damper
    for (const y of [0.3, 0.52]) for (const dx of [-0.13, 0.13]) g.add(strut(V(sx * WX + dx, y + 0.1, sz * 0.5), V(sx * WX, y, sz * 0.78), 0.016, A));
    g.add(strut(V(sx * WX, 0.66, sz * 0.5), V(sx * WX, 0.36, sz * 0.74), 0.024, m.aluDark(), 8));
    // fender: an arc over the top of the wheel, with a flat flap on the outside end
    const f = mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.3, 22, 1, true, Math.PI - 0.95 - sx * 0.12, 1.9), m.fender()); f.rotation.x = Math.PI / 2; f.position.set(sx * WX, WR, sz * WZ); g.add(f);
    g.add(strut(V(sx * WX, 0.66, sz * 0.52), V(sx * WX, WR + 0.47, sz * (WZ - 0.14)), 0.012, A));               // fender stay
  }
  // seats: aluminium tube frames with woven nylon webbing
  const web = std('webbing', { map: webbing(), roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
  for (const z of [-0.36, 0.36]) {
    g.add(box(0.46, 0.02, 0.5, web, -0.28, 0.86, z));
    for (const [x0, x1] of [[-0.51, -0.05]]) for (const dz of [-0.25, 0.25]) g.add(strut(V(x0, 0.86, z + dz), V(x1, 0.86, z + dz), 0.014, A));
    for (const x of [-0.51, -0.05]) { g.add(strut(V(x, 0.86, z - 0.25), V(x, 0.86, z + 0.25), 0.014, A)); for (const dz of [-0.25, 0.25]) g.add(strut(V(x, 0.645, z + dz), V(x, 0.86, z + dz), 0.012, A)); }
    const back = new THREE.Group(); back.add(box(0.02, 0.5, 0.48, web, 0, 0.27, 0));
    for (const dz of [-0.25, 0.25]) back.add(strut(V(0, 0, dz), V(0, 0.54, dz), 0.014, A)); back.add(strut(V(0, 0.54, -0.25), V(0, 0.54, 0.25), 0.014, A));
    back.position.set(-0.52, 0.87, z); back.rotation.z = 0.26; g.add(back);
    g.add(box(0.36, 0.14, 0.44, m.cloth(), -0.3, 0.73, z));                                                        // stowage bag under the seat
    const foot = box(0.3, 0.012, 0.36, A, 0.52, 0.72, z); foot.rotation.z = 0.5; g.add(foot);
    // outboard handhold
    const hz = z + Math.sign(z) * 0.3; g.add(pipe([V(0.02, 0.645, hz), V(0.04, 1.0, hz), V(0.2, 1.08, hz), V(0.34, 1.0, hz), V(0.36, 0.645, hz)], 0.013, A, 6, 30));
  }
  // control console on its post, and the T-shaped hand controller between the seats
  g.add(strut(V(0.36, 0.645, 0), V(0.4, 1.0, 0), 0.03, A, 8));
  const con = new THREE.Group(); con.add(box(0.2, 0.26, 0.34, m.aluDark(), 0, 0, 0)); const face = mesh(new THREE.PlaneGeometry(0.32, 0.24), std('dials', { map: dials(), roughness: 0.6, metalness: 0.1 }), -0.101, 0, 0); face.rotation.y = -Math.PI / 2; con.add(face);
  con.position.set(0.42, 1.1, 0); con.rotation.z = -0.35; g.add(con);
  g.add(box(0.5, 0.05, 0.1, m.aluDark(), -0.2, 0.98, 0), strut(V(-0.3, 0.645, 0), V(-0.3, 0.96, 0), 0.02, A), strut(V(-0.02, 0.99, 0), V(-0.02, 1.1, 0), 0.012, m.black()), strut(V(-0.02, 1.1, -0.06), V(-0.02, 1.1, 0.06), 0.014, m.black()));
  // communications relay box at the front
  g.add(box(0.16, 0.42, 0.56, m.white(), 1.42, 1.02, 0), box(0.14, 0.012, 0.52, std('mirrorTiles', { map: mirrorTiles(), metalness: 0.4, roughness: 0.25 }), 1.42, 1.237, 0), strut(V(1.42, 0.6, 0), V(1.42, 0.82, 0), 0.02, A));
  // high-gain antenna: a gold-mesh umbrella aimed at the Earth
  g.add(strut(V(1.36, 0.6, 0.5), V(1.36, 1.72, 0.5), 0.018, A, 8));
  const hga = new THREE.Group(), hm = std('goldMesh', { map: goldMesh(), transparent: true, alphaTest: 0.08, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.45 });
  hga.add(dish(0.485, 0.17, hm, 24, 6));
  for (let k = 0; k < 12; k++) { const a = k * 0.5236; hga.add(pipe([V(0, 0, 0), V(Math.cos(a) * 0.25, 0.045, Math.sin(a) * 0.25), V(Math.cos(a) * 0.485, 0.17, Math.sin(a) * 0.485)], 0.004, m.goldAno(), 4, 8)); }
  hga.add(strut(V(0, 0, 0), V(0, 0.3, 0), 0.01, A), cyl(0.03, 0.03, 0.05, m.white(), 0, 0.31, 0, 10), box(0.07, 0.05, 0.07, m.aluDark(), 0, -0.03, 0));
  hga.position.set(1.36, 1.76, 0.5); aim(hga, -0.25, 1, 0.3); g.add(hga);
  // television camera on its remote-controlled mount
  g.add(strut(V(1.4, 0.6, -0.48), V(1.4, 1.34, -0.48), 0.018, A, 8), box(0.15, 0.17, 0.15, m.goldFoil2(), 1.4, 1.42, -0.48));
  const tv = new THREE.Group(); tv.add(box(0.36, 0.14, 0.1, m.white(), 0, 0, 0), cyl(0.045, 0.05, 0.1, m.black(), 0.23, 0, 0, 14), box(0.1, 0.012, 0.13, m.white(), 0.23, 0.065, 0)); tv.children[1].rotation.z = Math.PI / 2;
  tv.position.set(1.42, 1.58, -0.48); tv.rotation.set(0, -0.35, -0.12); g.add(tv);
  // low-gain antenna (a short coil) beside the left seat
  g.add(strut(V(0.2, 1.06, 0.66), V(0.2, 1.42, 0.66), 0.01, A)); const lg = new THREE.Group(); lg.add(cyl(0.022, 0.022, 0.3, m.white(), 0, 0.15, 0, 10), helix(0.03, 0.28, 5, 0.004, m.copper()), cyl(0.06, 0.06, 0.01, A, 0, 0, 0, 14)); lg.position.set(0.2, 1.42, 0.66); aim(lg, -0.3, 1, 0.2); g.add(lg);
  // rear pallet: the tool gate with tongs, rake, scoop and hammer, and the sample bags
  for (const z of [-0.42, 0.42]) g.add(strut(V(-1.45, 0.64, z), V(-1.5, 1.5, z), 0.016, A));
  for (const y of [0.95, 1.5]) g.add(strut(V(-1.48, y, -0.42), V(-1.5 + (1.5 - y) * 0.04, y, 0.42), 0.014, A));
  g.add(strut(V(-1.53, 0.7, -0.3), V(-1.55, 1.52, -0.28), 0.008, A), box(0.02, 0.1, 0.14, m.steel(), -1.53, 0.68, -0.3));                       // scoop
  g.add(strut(V(-1.53, 0.72, -0.1), V(-1.55, 1.5, -0.1), 0.008, A), strut(V(-1.53, 0.72, -0.14), V(-1.53, 0.72, -0.06), 0.006, m.steel()));    // tongs
  g.add(strut(V(-1.53, 0.76, 0.1), V(-1.55, 1.5, 0.1), 0.008, A), box(0.03, 0.12, 0.2, m.steel(), -1.53, 0.72, 0.1));                         // rake
  g.add(strut(V(-1.53, 1.02, 0.3), V(-1.55, 1.42, 0.3), 0.012, A), box(0.04, 0.05, 0.14, m.steel(), -1.55, 1.44, 0.3));                       // hammer
  for (const z of [-0.26, 0.26]) g.add(box(0.3, 0.3, 0.36, m.cloth(), -1.2, 0.8, z));
  g.add(box(0.24, 0.2, 0.3, m.goldFoil2(), -0.92, 0.75, 0));
  return g;
}

// ================================================================= Apollo science station (ALSEP)
// A central station that radioed the data home, a small nuclear generator, and the experiments wired to them.
// The set of experiments was different on every mission: opts.kit is the Apollo flight number (12, 14, 15, 16 or 17).
export function alsep(opts = {}) {
  const g = new THREE.Group(), A = m.alu(), kit = opts.kit || 12, has = (...k) => k.includes(kit);
  const ribbon = std('ribbon', { color: 0xd9d6cc, metalness: 0.1, roughness: 0.7 });
  const cable = (a, b, seed) => { const r = lcg(seed), pts = [a]; for (let k = 1; k < 5; k++) { const p = a.clone().lerp(b, k / 5); p.x += (r() - 0.5) * 0.35; p.z += (r() - 0.5) * 0.35; p.y = 0.012; pts.push(p); } pts.push(b); const c = pipe(pts, 0.014, ribbon, 5, 40); c.scale.y = 0.45; c.castShadow = false; g.add(c); };
  // central station: the lid is raised on springs, with foil curtains hanging round the electronics
  const cs = new THREE.Group();
  cs.add(box(0.68, 0.16, 0.6, m.white(), 0, 0.1, 0), box(0.74, 0.025, 0.66, m.white(), 0, 0.72, 0), box(0.6, 0.5, 0.52, m.silverFoil(), 0, 0.44, 0));
  for (const [x, z] of [[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.26], [0.3, 0.26]]) cs.add(strut(V(x, 0.18, z), V(x * 1.14, 0.71, z * 1.18), 0.008, A, 5));
  cs.add(box(0.12, 0.1, 0.12, m.aluDark(), 0, 0.78, 0), strut(V(0, 0.83, 0), V(0, 0.92, 0), 0.016, A));
  const ant = new THREE.Group(); ant.add(cyl(0.075, 0.075, 0.012, A, 0, 0, 0, 16), cyl(0.019, 0.019, 0.58, m.white(), 0, 0.29, 0, 10), helix(0.03, 0.56, 9, 0.004, m.copper()));
  ant.position.set(0, 0.93, 0); aim(ant, 0.3, 1, -0.35); cs.add(ant);
  cs.add(box(0.1, 0.06, 0.1, m.white(), 0.26, 0.76, 0.22), box(0.2, 0.012, 0.16, std('mirrorTiles', { map: mirrorTiles(), metalness: 0.4, roughness: 0.25 }), -0.2, 0.739, -0.18));
  g.add(cs);
  // the nuclear generator: a finned cylinder on its carrying pallet
  const rt = new THREE.Group(), R = m.rtg();
  rt.add(box(0.58, 0.03, 0.5, A, 0, 0.1, 0)); for (const [x, z] of [[-0.25, -0.2], [0.25, -0.2], [-0.25, 0.2], [0.25, 0.2]]) rt.add(cyl(0.015, 0.015, 0.1, A, x, 0.05, z, 6));
  rt.add(cyl(0.125, 0.125, 0.4, R, 0, 0.33, 0, 20), cyl(0.14, 0.14, 0.03, R, 0, 0.13, 0, 20), lathe([[0.001, 0.07], [0.07, 0.06], [0.125, 0]], R, 20));
  rt.children[rt.children.length - 1].position.y = 0.53;
  for (let k = 0; k < 8; k++) { const f = box(0.085, 0.38, 0.012, R, 0, 0.33, 0); f.position.set(Math.cos(k * 0.7854) * 0.165, 0.33, Math.sin(k * 0.7854) * 0.165); f.rotation.y = -k * 0.7854; rt.add(f); }
  rt.position.set(2.8, 0, 0.6); g.add(rt); cable(V(0.3, 0.02, 0.1), V(2.55, 0.02, 0.55), 21);
  // seismometer: a drum under a wide foil skirt spread on the ground
  if (has(12, 14, 15, 16)) {
    const s = new THREE.Group(), geo = new THREE.CircleGeometry(0.76, 40, 0, 6.2832), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y), a = Math.atan2(y, x); p.setZ(i, 0.012 + 0.05 * Math.max(0, 1 - r / 0.76) + 0.012 * Math.sin(a * 9) * (r / 0.76) + 0.006 * Math.sin(a * 23 + r * 30)); }
    geo.computeVertexNormals(); const skirt = mesh(geo, m.silverFoil()); skirt.rotation.x = -Math.PI / 2; s.add(skirt);
    s.add(cyl(0.15, 0.17, 0.24, m.silverFoil(), 0, 0.17, 0, 20), cyl(0.155, 0.155, 0.015, m.white(), 0, 0.297, 0, 20), strut(V(0, 0.3, 0), V(0, 0.4, 0), 0.006, A, 5), cyl(0.03, 0.03, 0.012, m.lens(), 0.08, 0.31, 0, 12));
    s.position.set(-3.4, 0, -1.6); g.add(s); cable(V(-0.3, 0.02, -0.1), V(-3.25, 0.02, -1.55), 22);
  }
  // magnetometer: three arms with a gold-wrapped sensor at each tip
  if (has(12, 15, 16)) {
    const s = new THREE.Group(); s.add(box(0.24, 0.2, 0.24, m.goldFoil2(), 0, 0.48, 0), box(0.3, 0.012, 0.3, m.white(), 0, 0.59, 0));
    for (let k = 0; k < 3; k++) { const a = k * 2.0944 + 0.4; s.add(strut(polar(0.1, a, 0.4), polar(0.42, a, 0.0), 0.012, A)); const tip = polar(0.72, a + 1.047, 0.98); s.add(strut(polar(0.1, a + 1.047, 0.56), tip, 0.012, m.white())); const sb = box(0.1, 0.1, 0.1, m.goldFoil2(), tip.x, tip.y + 0.03, tip.z); sb.rotation.y = a; s.add(sb); }
    s.position.set(-1.5, 0, 3.2); g.add(s); cable(V(-0.1, 0.02, 0.3), V(-1.45, 0.02, 3.0), 23);
  }
  // solar-wind instrument: a box on four legs with seven cups under a louvred top
  if (has(12, 15)) {
    const s = new THREE.Group(); s.add(box(0.28, 0.26, 0.3, m.white(), 0, 0.42, 0), box(0.3, 0.02, 0.32, std('louvers', { map: louvers(), metalness: 0.3, roughness: 0.4 }), 0, 0.56, 0));
    for (const [x, z] of [[-0.14, -0.15], [0.14, -0.15], [-0.14, 0.15], [0.14, 0.15]]) s.add(strut(V(x, 0.3, z), V(x * 1.7, 0, z * 1.7), 0.008, A, 5));
    for (let k = 0; k < 7; k++) s.add(cyl(0.035, 0.035, 0.03, m.goldAno(), k ? Math.cos(k * 1.047) * 0.09 : 0, 0.585, k ? Math.sin(k * 1.047) * 0.09 : 0, 10));
    s.position.set(2.0, 0, -2.6); g.add(s); cable(V(0.2, 0.02, -0.3), V(1.9, 0.02, -2.45), 24);
  }
  // ion detector on a wire ground screen, with its small pressure gauge on a short cable
  if (has(12, 14, 15)) {
    const s = new THREE.Group(); s.add(box(0.3, 0.38, 0.24, m.white(), 0, 0.3, 0), cyl(0.33, 0.33, 0.004, std('goldMesh2', { map: goldMesh(), transparent: true, alphaTest: 0.08, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 }), 0, 0.01, 0, 24), box(0.1, 0.06, 0.02, m.lens(), 0, 0.42, 0.125));
    for (const a of [0.5, 2.6, 4.7]) s.add(strut(polar(0.12, a, 0.14), polar(0.3, a, 0), 0.008, A, 5));
    s.add(box(0.1, 0.12, 0.1, m.silverFoil(), 0.9, 0.07, 0.4), pipe([V(0.15, 0.02, 0.05), V(0.5, 0.012, 0.35), V(0.86, 0.02, 0.4)], 0.008, ribbon, 5, 16));
    s.position.set(-4.5, 0, 1.8); g.add(s); cable(V(-0.3, 0.02, 0.15), V(-4.3, 0.02, 1.75), 25);
  }
  // mortar box that fired four small charges for the seismic experiment
  if (has(14, 16)) {
    const s = new THREE.Group(), bx = new THREE.Group(); bx.add(box(0.4, 0.26, 0.3, m.white(), 0, 0, 0)); for (let k = 0; k < 4; k++) bx.add(cyl(0.035, 0.035, 0.2, m.aluDark(), -0.15 + k * 0.1, 0.2, 0, 10));
    bx.position.y = 0.3; bx.rotation.z = 0.78; s.add(bx, box(0.5, 0.03, 0.36, A, 0.02, 0.05, 0), strut(V(-0.2, 0.06, 0), V(-0.12, 0.2, 0), 0.01, A));
    s.position.set(3.5, 0, 3.0); g.add(s); cable(V(0.3, 0.02, 0.3), V(3.35, 0.02, 2.9), 26);
  }
  // heat-flow experiment: an electronics box and two probes down drilled holes
  if (has(15, 16, 17)) {
    const s = new THREE.Group(); s.add(box(0.26, 0.16, 0.2, m.white(), 0, 0.12, 0), box(0.28, 0.012, 0.22, m.silverFoil(), 0, 0.207, 0));
    for (const z of [-2.4, 2.4]) { s.add(cyl(0.013, 0.013, 0.34, m.white(), 0.9, 0.17, z, 8), cyl(0.02, 0.02, 0.03, m.redAno(), 0.9, 0.34, z, 8), pipe([V(0.1, 0.02, z * 0.05), V(0.5, 0.012, z * 0.55), V(0.88, 0.05, z)], 0.007, ribbon, 5, 16)); }
    s.position.set(4.2, 0, -1.2); g.add(s); cable(V(0.34, 0.02, -0.1), V(4.05, 0.02, -1.15), 27);
  }
  // Apollo 17 only: the gravimeter under its tilted sunshade, the dust detector, and the seismic charges' antenna
  if (has(17)) {
    const s = new THREE.Group(); s.add(box(0.28, 0.38, 0.28, m.white(), 0, 0.3, 0), box(0.26, 0.012, 0.26, m.silverFoil(), 0, 0.497, 0)); const sh = box(0.44, 0.012, 0.4, m.white(), 0.05, 0.66, 0); sh.rotation.z = 0.45; s.add(sh);
    for (const [x, z] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]]) s.add(strut(V(x, 0.12, z), V(x * 1.5, 0, z * 1.5), 0.008, A, 5)); s.add(strut(V(-0.1, 0.5, 0), V(-0.12, 0.6, 0), 0.006, A), strut(V(0.12, 0.5, 0), V(0.22, 0.72, 0), 0.006, A));
    s.position.set(-3.2, 0, -1.4); g.add(s); cable(V(-0.3, 0.02, -0.1), V(-3.05, 0.02, -1.35), 28);
    const d = new THREE.Group(); d.add(box(0.3, 0.26, 0.3, m.goldFoil2(), 0, 0.3, 0), box(0.14, 0.14, 0.012, m.lens(), 0, 0.32, 0.151), box(0.14, 0.012, 0.14, m.lens(), 0, 0.431, 0)); for (const [x, z] of [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]]) d.add(strut(V(x, 0.17, z), V(x * 1.4, 0, z * 1.4), 0.008, A, 5));
    d.position.set(2.0, 0, -2.6); g.add(d); cable(V(0.2, 0.02, -0.3), V(1.9, 0.02, -2.45), 29);
    g.add(strut(V(-1.5, 0, 3.2), V(-1.5, 1.7, 3.2), 0.008, A, 5), box(0.14, 0.1, 0.14, m.white(), -1.5, 0.05, 3.2), cyl(0.012, 0.03, 0.08, m.redAno(), -1.5, 1.74, 3.2, 8)); cable(V(-0.1, 0.02, 0.3), V(-1.45, 0.02, 3.05), 30);
  }
  return g;
}

// ================================================================= Apollo 11's early science package (the solar-powered seismometer)
export function easep() {
  const g = new THREE.Group(), A = m.alu();
  g.add(box(0.66, 0.035, 0.62, A, 0, 0.05, 0), box(0.56, 0.3, 0.52, m.silverFoil(), 0, 0.22, 0), box(0.6, 0.02, 0.56, m.white(), 0, 0.38, 0));
  g.add(cyl(0.14, 0.14, 0.2, m.silverFoil(), 0, 0.49, 0.04, 20), cyl(0.145, 0.145, 0.015, m.white(), 0, 0.597, 0.04, 20), strut(V(0, 0.6, 0.04), V(0, 0.68, 0.04), 0.005, A, 5));
  for (const s of [-1, 1]) {                                                         // two solar-cell wings, one facing the morning Sun and one the evening Sun
    const w = new THREE.Group();
    for (const z of [-0.145, 0.145]) w.add(box(0.9, 0.012, 0.275, m.cells('cells12x4', 12, 4), 0.45, 0.01, z));
    w.add(box(0.93, 0.012, 0.6, A, 0.45, -0.003, 0)); for (const x of [0.02, 0.45, 0.9]) w.add(box(0.02, 0.03, 0.6, A, x, -0.02, 0));
    w.position.set(s * 0.3, 0.42, 0); w.rotation.z = s > 0 ? 0.42 : Math.PI - 0.42; if (s < 0) w.scale.y = -1;
    g.add(w); g.add(strut(V(s * 0.3, 0.2, 0.2), V(s * 0.95, 0.66, 0.2), 0.008, A, 5), strut(V(s * 0.3, 0.2, -0.2), V(s * 0.95, 0.66, -0.2), 0.008, A, 5));
  }
  // carrying handle, which is also the antenna mast, with a coil antenna aimed at the Earth
  g.add(strut(V(0, 0.39, -0.22), V(0, 0.98, -0.22), 0.013, A, 8));
  const ant = new THREE.Group(); ant.add(cyl(0.07, 0.07, 0.012, A, 0, 0, 0, 16), cyl(0.018, 0.018, 0.5, m.white(), 0, 0.25, 0, 10), helix(0.028, 0.48, 8, 0.004, m.copper())); ant.position.set(0, 0.99, -0.22); aim(ant, 0.25, 1, -0.3); g.add(ant);
  g.add(box(0.09, 0.07, 0.09, m.white(), 0.2, 0.425, -0.18), cyl(0.05, 0.05, 0.05, m.aluDark(), -0.2, 0.415, 0.18, 12), cyl(0.05, 0.05, 0.05, m.aluDark(), -0.2, 0.415, -0.05, 12));
  return g;
}

// ================================================================= laser retroreflector
// A tray of glass corner-cubes tilted to face the Earth: 100 of them on Apollo 11 and 14, 300 on Apollo 15 (opts big).
export function lrrr(big) {
  const g = new THREE.Group(), A = m.alu(), tilt = 0.42;
  const panels = big ? [[0.69, 0.64, 17, 12, -0.19], [0.36, 0.64, 8, 12, 0.345]] : [[0.46, 0.46, 10, 10, 0]];
  const W = big ? 1.06 : 0.46, D = big ? 0.64 : 0.46, tray = new THREE.Group();
  for (const [w, d, nx, ny, x] of panels) {
    tray.add(box(w, 0.07, d, A, x, 0, 0));
    const top = mesh(new THREE.PlaneGeometry(w * 0.96, d * 0.96), std(`cubes${nx}x${ny}`, { map: cubeGrid(`cubes${nx}x${ny}`, nx, ny), metalness: 0.35, roughness: 0.25 }), x, 0.0362, 0); top.rotation.x = -Math.PI / 2; tray.add(top);
  }
  const hy = 0.16 + Math.sin(tilt) * W / 2;
  tray.position.set(0, hy, 0); tray.rotation.z = tilt; g.add(tray);
  // support pallet on the ground, the rear prop that sets the tilt, and the alignment handle
  g.add(box(W * 0.95, 0.025, D * 1.05, A, 0, 0.03, 0));
  for (const z of [-D * 0.42, D * 0.42]) { g.add(strut(V(-W * 0.45, 0.04, z), V(-Math.cos(tilt) * W / 2, hy - Math.sin(tilt) * W / 2 - 0.03, z), 0.012, A, 6), strut(V(W * 0.4, 0.04, z), V(Math.cos(tilt) * W / 2 - 0.02, hy + Math.sin(tilt) * W / 2 - 0.04, z), 0.012, A, 6), strut(V(-W * 0.2, 0.04, z), V(Math.cos(tilt) * W / 2 - 0.02, hy + Math.sin(tilt) * W / 2 - 0.04, z), 0.008, A, 5)); }
  { const hx = Math.cos(tilt) * W / 2 + 0.02, hy2 = hy + Math.sin(tilt) * W / 2; g.add(pipe([V(hx - 0.04, hy2 - 0.02, -0.09), V(hx + 0.05, hy2 + 0.08, -0.09), V(hx + 0.07, hy2 + 0.1, 0), V(hx + 0.05, hy2 + 0.08, 0.09), V(hx - 0.04, hy2 - 0.02, 0.09)], 0.007, A, 6, 24)); }   // small aiming handle on the high edge
  g.add(cyl(0.035, 0.035, 0.012, m.white(), -W * 0.36, 0.05, D * 0.6, 14), strut(V(-W * 0.36, 0.05, D * 0.6), V(-W * 0.36, 0.13, D * 0.6), 0.004, A, 5));   // the little sundial used to point it
  return g;
}

// ================================================================= flag
// A 0.9 x 1.5 m nylon flag on a two-piece gold-anodised pole, held out by a rod sewn into its top hem.
// Decades of unfiltered sunlight have very probably bleached the colours away, so it is shown white.
export function flag(fallen) {
  const g = new THREE.Group(), P = m.goldAno(), W = 1.52, H = 0.91;
  const sheet = (amp, seed) => {
    const geo = new THREE.PlaneGeometry(W, H, 44, 26), p = geo.attributes.position, r = lcg(seed), f = [r() * 6, r() * 6, r() * 6];
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) / W + 0.5, v = 0.5 - p.getY(i) / H;                    // u: from the pole outward, v: from the top down
      const free = u * (0.25 + 0.75 * v);                                        // the pole and the top rod hold it; the far lower corner hangs free
      const z = amp * free * (Math.sin(u * 9 + v * 4 + f[0]) * 0.5 + Math.sin(u * 17 - v * 9 + f[1]) * 0.22 + Math.sin(v * 13 + u * 5 + f[2]) * 0.3);
      p.setZ(i, z); p.setX(i, p.getX(i) - 0.06 * free * free * W);               // the creases use up a little of its width
    }
    geo.computeVertexNormals(); return mesh(geo, m.cloth());
  };
  if (fallen) {
    // Apollo 11's flag was blown over by the blast of the ascent engine: pole and cloth lie on the ground
    g.add(strut(V(0, 0.016, 0), V(1.05, 0.016, 0.02), 0.0145, P, 8), strut(V(1.0, 0.014, 0.02), V(2.2, 0.014, 0.06), 0.0115, P, 8), cyl(0.019, 0.019, 0.03, m.redAno(), 1.02, 0.016, 0.02, 10));
    g.children[2].rotation.z = Math.PI / 2;
    g.add(strut(V(2.18, 0.014, 0.06), V(2.1, 0.02, 1.55), 0.008, P, 6));
    const c = sheet(0.12, 4); c.rotation.x = -Math.PI / 2; c.rotation.z = -1.52; c.position.set(1.7, 0.035, 0.82); c.scale.z = 0.5; g.add(c);
    return g;
  }
  g.add(strut(V(0, 0, 0), V(0, 1.0, 0), 0.0145, P, 10), strut(V(0, 0.95, 0), V(0, 2.12, 0), 0.0115, P, 10), cyl(0.019, 0.019, 0.035, m.redAno(), 0, 0.99, 0, 12), cyl(0.016, 0.016, 0.03, m.steel(), 0, 2.12, 0, 10));
  g.add(strut(V(0, 2.1, 0), V(W + 0.02, 2.1, 0), 0.008, P, 8), cyl(0.011, 0.011, 0.02, m.steel(), W + 0.02, 2.1, 0, 8));
  g.children[g.children.length - 1].rotation.z = Math.PI / 2;
  const c = sheet(0.11, 2); c.position.set(W / 2 + 0.012, 2.1 - H / 2, 0); g.add(c);
  return g;
}

// ================================================================= Mars Pathfinder and Sojourner (1997)
// The lander is a tetrahedron that opened like a flower: a base and three petals covered in solar cells, lying on
// its deflated airbags. Sojourner, 65 cm long, drove down a ramp and stopped a few metres away.
export function pathfinder() {
  const g = new THREE.Group(), A = m.alu(), S = 1.45, Rv = S / Math.sqrt(3), rin = S / (2 * Math.sqrt(3)), BY = 0.3;
  const cellM = std('pfCells', { map: solarCells('cells6', 6, 6), metalness: 0.35, roughness: 0.3 }); cellM.map = cellM.map.clone(); cellM.map.repeat.set(1.6, 1.6); cellM.map.needsUpdate = true;
  const tri = (pts, depth) => { const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]); sh.lineTo(pts[1][0], pts[1][1]); sh.lineTo(pts[2][0], pts[2][1]); sh.closePath(); const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); return geo; };
  // base petal
  const bp = [0, 1, 2].map((k) => { const a = Math.PI / 2 + k * 2.0944; return [Math.cos(a) * Rv, Math.sin(a) * Rv]; });
  g.add(mesh(tri(bp, 0.05), [cellM, A], 0, BY, 0));
  // three side petals, hinged on the edges and drooping to the ground
  for (let k = 0; k < 3; k++) {
    const an = -Math.PI / 6 + k * 2.0944, p = new THREE.Group();                 // outward direction of this edge
    p.add(mesh(tri([[0, -S / 2 + 0.02], [0, S / 2 - 0.02], [S * 0.866 - 0.03, 0]], 0.04), [cellM, A]));
    p.add(strut(V(0, 0.02, -S / 2 + 0.05), V(0, 0.02, S / 2 - 0.05), 0.022, m.aluDark(), 8));
    p.position.set(Math.cos(an) * rin, BY + 0.01, -Math.sin(an) * rin); p.rotation.y = an; p.rotation.order = 'YZX'; p.rotation.z = -0.13;
    g.add(p);
  }
  // deflated airbags, pulled in under the petals
  const r = lcg(41);
  for (let k = 0; k < 22; k++) { const a = k / 22 * 6.283 + r() * 0.2, d = 0.95 + r() * 0.75, s = 0.3 + r() * 0.22; const b = lump(s, 2, 0.16, 50 + k, m.tan()); b.scale.set(1.25, 0.34 + r() * 0.2, 1.0); b.position.set(Math.cos(a) * d, 0.1 + r() * 0.04, Math.sin(a) * d); b.rotation.y = r() * 6; b.castShadow = false; g.add(b); }
  // electronics box, antennas, and the camera on its pop-up lattice mast
  g.add(box(0.56, 0.3, 0.44, m.gold(), 0, BY + 0.2, 0.02), box(0.5, 0.012, 0.38, m.white(), 0, BY + 0.356, 0.02));
  g.add(strut(V(0.2, BY + 0.36, -0.1), V(0.2, BY + 0.98, -0.1), 0.008, A, 5), cyl(0.02, 0.02, 0.12, m.white(), 0.2, BY + 1.04, -0.1, 8));     // low-gain antenna
  g.add(strut(V(-0.22, BY + 0.36, -0.12), V(-0.22, BY + 0.56, -0.12), 0.012, A)); const hg = cyl(0.15, 0.15, 0.015, m.white(), -0.22, BY + 0.6, -0.12, 24); hg.rotation.set(0.5, 0, 0.35); g.add(hg);
  const mb = V(0.02, BY + 0.36, 0.14), mt = V(0.02, 1.42, 0.14);
  for (let k = 0; k < 3; k++) { const o = polar(0.035, k * 2.0944); g.add(strut(mb.clone().add(o), mt.clone().add(o), 0.004, A, 4)); }
  for (let k = 0; k < 7; k++) { const y = mb.y + (mt.y - mb.y) * k / 6; g.add(cyl(0.037, 0.037, 0.004, A, 0.02, y, 0.14, 3)); }
  const imp = new THREE.Group(); imp.add(cyl(0.055, 0.055, 0.2, m.gold(), 0, 0, 0, 14), cyl(0.022, 0.022, 0.012, m.lens(), 0.035, 0.1, 0.0, 10), cyl(0.022, 0.022, 0.012, m.lens(), -0.035, 0.1, 0.0, 10), box(0.08, 0.05, 0.08, m.aluDark(), 0, -0.03, -0.06));
  imp.rotation.set(Math.PI / 2 - 0.15, 0, 0); imp.position.set(0.02, 1.5, 0.14); const impW = new THREE.Group(); impW.add(imp); impW.rotation.y = 0.9; impW.position.set(0, 0, 0); g.add(impW);
  // weather mast with three little wind socks, at the tip of a petal
  const wm = V(Math.cos(-Math.PI / 6) * 1.5, 0.16, -Math.sin(-Math.PI / 6) * 1.5); g.add(strut(wm, wm.clone().setY(1.2), 0.007, A, 5));
  for (const y of [0.5, 0.82, 1.14]) { const c = mesh(new THREE.ConeGeometry(0.014, 0.07, 8), m.white(), wm.x + 0.02, y, wm.z); c.rotation.z = 2.6; g.add(c); g.add(strut(V(wm.x, y + 0.03, wm.z), V(wm.x + 0.02, y + 0.03, wm.z), 0.003, A, 4)); }
  // the two rover ramps, unrolled off the rover petal
  const ra = Math.PI / 2;                                                           // the rover petal is the one toward -z
  for (const s of [-1, 1]) {
    const rp = new THREE.Group(), geo = new THREE.PlaneGeometry(1.25, 0.46, 12, 1), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i) / 1.25 + 0.5; p.setZ(i, 0.2 * (1 - u) * (1 - u) + 0.012); }
    geo.rotateX(-Math.PI / 2); geo.computeVertexNormals(); rp.add(mesh(geo, std('ramp', { color: 0xc6c8cc, metalness: 0.5, roughness: 0.45, side: THREE.DoubleSide })));
    for (const z of [-0.23, 0.23]) rp.add(pipe([V(-0.625, 0.215, z), V(-0.2, 0.07, z), V(0.625, 0.02, z)], 0.012, m.steel(), 5, 14));
    rp.position.set(Math.cos(ra + s * 0.75) * 1.5, 0.0, -Math.sin(ra + s * 0.75) * 1.5 * 0.9 - 0.25); rp.rotation.y = ra + s * 0.95; g.add(rp);
  }
  const so = sojourner(); so.position.set(3.2, 0, -1.5); so.rotation.y = 0.6; g.add(so);
  return g;
}

function sojourner() {
  const s = new THREE.Group(), A = m.alu();
  // six cleated wheels on a rocker-bogie
  const wg = new THREE.CylinderGeometry(0.065, 0.065, 0.07, 28, 1), wp = wg.attributes.position;
  for (let i = 0; i < wp.count; i++) { const x = wp.getX(i), z = wp.getZ(i), a = Math.atan2(z, x); if (Math.hypot(x, z) > 0.01 && Math.round(a / 0.2244) % 2 === 0) { wp.setX(i, x * 0.94); wp.setZ(i, z * 0.94); } }
  wg.computeVertexNormals(); wg.rotateX(Math.PI / 2);
  const wm = std('sojWheel', { color: 0x8f9298, metalness: 0.55, roughness: 0.45 });
  for (const z of [-0.215, 0.215]) {
    for (const x of [-0.24, 0.0, 0.24]) { s.add(mesh(wg, wm, x, 0.065, z)); s.add(cyl(0.022, 0.022, 0.072, m.aluDark(), x, 0.065, z, 10).rotateX(Math.PI / 2)); }
    const zi = z * 0.82;
    s.add(strut(V(-0.24, 0.07, zi), V(-0.12, 0.17, zi), 0.01, A), strut(V(0, 0.07, zi), V(-0.12, 0.17, zi), 0.01, A));                          // bogie
    s.add(strut(V(-0.12, 0.17, zi), V(0.04, 0.2, zi), 0.011, A), strut(V(0.04, 0.2, zi), V(0.24, 0.1, zi), 0.011, A), strut(V(0.24, 0.1, zi), V(0.24, 0.07, z), 0.01, A));
  }
  s.add(box(0.44, 0.15, 0.3, m.gold(), 0, 0.215, 0));                                 // warm electronics box
  s.add(box(0.6, 0.012, 0.42, m.cells('cells13x9', 13, 9), 0, 0.305, 0), box(0.62, 0.008, 0.44, A, 0, 0.296, 0));
  s.add(strut(V(-0.26, 0.31, 0.17), V(-0.3, 0.72, 0.19), 0.004, A, 4));               // radio antenna
  for (const z of [-0.09, 0.09]) s.add(cyl(0.017, 0.017, 0.03, m.lens(), 0.232, 0.24, z, 10).rotateZ(Math.PI / 2));   // the two front cameras
  s.add(box(0.03, 0.03, 0.2, m.black(), 0.225, 0.19, 0));
  const ap = cyl(0.028, 0.028, 0.08, m.aluDark(), -0.28, 0.2, 0.05, 12); ap.rotation.z = Math.PI / 2; s.add(ap); s.add(strut(V(-0.22, 0.22, 0.05), V(-0.26, 0.2, 0.05), 0.008, A));   // the rock-chemistry sensor at the back
  return s;
}

// ================================================================= Phoenix (2008)
// A deck 1.5 m across on three legs, two round fan-fold solar arrays 5.5 m from tip to tip, a 2.35 m digging arm.
// opts.intact: as it landed. Otherwise as it most likely is today: orbiter pictures taken in 2010 suggest the
// winter ice broke at least one array.
export function phoenix(opts = {}) {
  const g = new THREE.Group(), A = m.alu(), DY = 1.02;
  g.add(cyl(0.76, 0.76, 0.06, std('deck', { color: 0xc9c7c0, metalness: 0.2, roughness: 0.6 }), 0, DY, 0, 8));
  g.add(cyl(0.62, 0.5, 0.36, m.gold(), 0, DY - 0.2, 0, 16));
  for (const a of [0.9, 4.0]) { const p = polar(0.36, a, DY - 0.42); g.add(ball(0.2, m.goldFoil2(), p.x, p.y, p.z, 18)); }
  g.add(ball(0.13, m.alu(), 0, DY - 0.5, -0.3, 14));
  const nozM = std('nozzle', { color: 0x5a5d63, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide });
  for (let k = 0; k < 12; k++) { const a = Math.floor(k / 4) * 2.0944 + 1.047 + (k % 4 - 1.5) * 0.13, p = polar(0.57, a, DY - 0.46); const n = lathe([[0.012, 0.07], [0.02, 0.04], [0.035, 0]], nozM, 10); n.position.copy(p); g.add(n); }
  for (let k = 0; k < 3; k++) {
    const a = k * 2.0944, foot = polar(1.14, a, 0.07);
    g.add(strut(polar(0.56, a, DY - 0.1), foot, 0.035, A, 8), strut(polar(0.52, a - 0.55, DY - 0.34), foot, 0.02, A), strut(polar(0.52, a + 0.55, DY - 0.34), foot, 0.02, A));
    const pad = lathe([[0.001, 0.02], [0.1, 0], [0.15, 0.025], [0.155, 0.06], [0.1, 0.05], [0.001, 0.05]], m.aluDark(), 18); pad.position.set(foot.x, 0, foot.z); g.add(pad);
  }
  // the two solar arrays
  const top = std('gores', { map: goreTex(), metalness: 0.3, roughness: 0.35 }), under = std('goreBack', { color: 0xb08a5c, metalness: 0.1, roughness: 0.7 });
  for (const s of [-1, 1]) {
    const arr = new THREE.Group(); arr.add(mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.012, 10), [under, top, under]));
    for (let k = 0; k < 10; k++) arr.add(strut(V(0, -0.012, 0), polar(1.04, k * 0.6283, -0.012), 0.006, A, 4));
    arr.add(cyl(0.07, 0.07, 0.05, A, 0, -0.02, 0, 12));
    const broken = s > 0 && !opts.intact;
    arr.position.set(s * 1.72, broken ? 0.58 : DY + 0.02, 0); if (broken) arr.rotation.z = 0.55;
    g.add(arr); g.add(strut(V(s * 0.74, DY, 0), V(s * (broken ? 1.3 : 1.72), broken ? 0.8 : DY, 0), 0.022, A, 8));
  }
  // camera mast, weather mast, antenna, and the two laboratories on the deck
  g.add(strut(V(-0.15, DY, -0.46), V(-0.15, 2.0, -0.46), 0.028, A, 10)); const cam = new THREE.Group(); cam.add(box(0.22, 0.13, 0.13, m.white(), 0, 0, 0), cyl(0.028, 0.028, 0.02, m.lens(), -0.06, 0, 0.07, 10).rotateX(Math.PI / 2), cyl(0.028, 0.028, 0.02, m.lens(), 0.06, 0, 0.07, 10).rotateX(Math.PI / 2)); cam.position.set(-0.15, 2.06, -0.46); cam.rotation.y = 0.5; g.add(cam);
  g.add(strut(V(0.36, DY, -0.5), V(0.36, 2.16, -0.5), 0.008, A, 5), box(0.2, 0.26, 0.16, m.goldFoil2(), 0.36, DY + 0.16, -0.36), cyl(0.012, 0.012, 0.05, m.lens(), 0.36, 2.19, -0.5, 8));
  for (const y of [1.4, 1.75, 2.1]) g.add(box(0.05, 0.012, 0.012, m.white(), 0.385, y, -0.5));
  const uhf = new THREE.Group(); uhf.add(cyl(0.045, 0.045, 0.3, m.white(), 0, 0.15, 0, 12), helix(0.055, 0.28, 4, 0.005, m.copper())); uhf.position.set(0.52, DY + 0.03, -0.18); g.add(uhf);
  const tega = new THREE.Group(); tega.add(box(0.44, 0.22, 0.34, m.white(), 0, 0.11, 0)); const roof = box(0.46, 0.02, 0.36, A, 0, 0.27, 0); roof.rotation.x = 0.3; tega.add(roof);
  for (let k = 0; k < 4; k++) for (const sz of [-1, 1]) { const d = box(0.09, 0.006, 0.12, m.silverFoil(), -0.165 + k * 0.11, 0.3 + sz * -0.02, sz * 0.07); d.rotation.x = 0.3 + (k % 2 ? sz * 0.9 : 0); tega.add(d); }
  tega.position.set(-0.36, DY + 0.03, 0.2); tega.rotation.y = 0.3; g.add(tega);
  g.add(box(0.34, 0.22, 0.28, m.gold(), 0.08, DY + 0.14, -0.06)); for (let k = 0; k < 4; k++) g.add(cyl(0.03, 0.03, 0.03, m.white(), -0.03 + k * 0.075, DY + 0.265, -0.06, 10));
  g.add(cyl(0.06, 0.06, 0.004, std('dvd', { color: 0xdfe3ea, metalness: 0.6, roughness: 0.2 }), -0.5, DY + 0.034, -0.15, 20));
  // the robot arm, reaching down to the trench it dug
  const sh = V(0.42, DY + 0.1, 0.5), el = V(0.78, 1.82, 1.05), wr = V(1.02, 0.3, 1.86);
  g.add(cyl(0.06, 0.06, 0.12, m.aluDark(), sh.x, sh.y - 0.03, sh.z, 12), strut(sh, el, 0.03, m.white(), 10), strut(el, wr, 0.026, m.white(), 10), ball(0.045, m.aluDark(), el.x, el.y, el.z, 12), ball(0.04, m.aluDark(), wr.x, wr.y, wr.z, 12));
  const scoop = box(0.1, 0.09, 0.16, m.steel(), wr.x + 0.03, wr.y - 0.1, wr.z + 0.06); scoop.rotation.set(0.5, 0.4, 0); g.add(scoop); g.add(box(0.07, 0.07, 0.1, m.black(), wr.x - 0.03, wr.y + 0.08, wr.z - 0.04));
  return g;
}

// ================================================================= sky-crane wreck
// The rocket stage that lowered a rover on cables, then flew off and crashed at an angle: a dark scorch, a fan of
// torn panels, tanks, engine bells and struts.
export function skycraneDebris(rnd) {
  const g = new THREE.Group();
  const st = tex('scorch', 512, 512, (x, w, h) => {
    const r = lcg(77), gr = x.createRadialGradient(256, 256, 0, 256, 256, 256); gr.addColorStop(0, 'rgba(18,13,10,0.75)'); gr.addColorStop(0.3, 'rgba(26,19,15,0.42)'); gr.addColorStop(1, 'rgba(30,22,18,0)');
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const a = -0.5 + (r() - 0.5) * 2.2, l = 90 + r() * 160; x.strokeStyle = `rgba(16,11,9,${0.08 + r() * 0.18})`; x.lineWidth = 3 + r() * 14; x.beginPath(); x.moveTo(256 + Math.cos(a) * 20, 256 + Math.sin(a) * 20); x.lineTo(256 + Math.cos(a) * l, 256 + Math.sin(a) * l); x.stroke(); }
  });
  const scorch = mesh(new THREE.PlaneGeometry(22, 22), new THREE.MeshStandardMaterial({ map: st, transparent: true, depthWrite: false, roughness: 1 }), 0, 0.02, 0); scorch.rotation.x = -Math.PI / 2; scorch.castShadow = false; g.add(scorch);
  const mats = [m.scorched(), m.aluDark(), m.alu(), std('char', { color: 0x1f1c1b, metalness: 0.3, roughness: 0.8 })];
  const pick = () => mats[Math.floor(rnd() * mats.length)];
  const place = (o, spread, y) => { const a = -0.5 + (rnd() - 0.5) * 2.0, d = Math.pow(rnd(), 0.7) * spread; o.position.set(Math.cos(a) * d + (rnd() - 0.5) * 2, y, Math.sin(a) * d + (rnd() - 0.5) * 2); return o; };
  // torn structural panels: plates bent out of flat
  for (let i = 0; i < 16; i++) {
    const w = 0.4 + rnd() * 1.3, d = 0.3 + rnd() * 0.9, geo = new THREE.PlaneGeometry(w, d, 6, 5), p = geo.attributes.position, f = [rnd() * 6, rnd() * 6, 0.1 + rnd() * 0.25];
    for (let k = 0; k < p.count; k++) p.setZ(k, f[2] * (Math.sin(p.getX(k) * 4 + f[0]) + Math.sin(p.getY(k) * 5 + f[1])) * 0.5);
    geo.computeVertexNormals(); const o = mesh(geo, pick()); o.material = o.material.clone(); o.material.side = THREE.DoubleSide; o.rotation.set(-Math.PI / 2 + (rnd() - 0.5) * 1.2, rnd() * 6, (rnd() - 0.5) * 0.8); g.add(place(o, 9, 0.12 + rnd() * 0.25));
  }
  // propellant and helium tanks, dented
  for (let i = 0; i < 5; i++) { const r = i < 3 ? 0.36 : 0.2, o = lump(r, 2, 0.07, 90 + i, i < 3 ? m.alu() : m.scorched()); o.scale.set(1, 0.8 + rnd() * 0.2, 0.9 + rnd() * 0.15); o.rotation.set(rnd() * 3, rnd() * 3, 0); g.add(place(o, 7, r * 0.72)); }
  // the eight landing-engine bells
  const nozM = std('nozzle', { color: 0x5a5d63, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) { const o = lathe([[0.045, 0.34], [0.055, 0.2], [0.1, 0.08], [0.15, 0]], nozM, 14); o.rotation.set(1.2 + rnd() * 0.8, rnd() * 6, rnd()); g.add(place(o, 8, 0.1)); const c = cyl(0.06, 0.06, 0.16, m.scorched(), 0, 0.4, 0, 10); o.add(c); }
  // bent struts and a length of the bridle cable
  for (let i = 0; i < 14; i++) { const l = 0.5 + rnd() * 1.4, o = pipe([V(0, 0, 0), V(l * 0.4, rnd() * 0.25, (rnd() - 0.5) * 0.4), V(l, rnd() * 0.12, (rnd() - 0.5) * 0.5)], 0.018 + rnd() * 0.014, pick(), 5, 10); o.rotation.y = rnd() * 6; g.add(place(o, 9, 0.03)); }
  g.add(pipe([V(-1, 0.03, 1), V(0.5, 0.03, 2.2), V(2.5, 0.03, 1.6), V(3.6, 0.03, 3.0), V(5.5, 0.03, 2.6)], 0.012, m.white(), 5, 50));
  // small fragments
  for (let i = 0; i < 46; i++) { const s = 0.05 + rnd() * 0.22, o = box(s, s * (0.15 + rnd() * 0.5), s * (0.4 + rnd()), pick(), 0, 0, 0); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); g.add(place(o, 11, s * 0.2)); }
  return g;
}

// ================================================================= New Horizons (launched 2006)
// A gold-blanketed triangular body 0.7 m thick, a 2.1 m dish, and the nuclear generator on the pointed end.
// Built like the probe models: the dish looks toward +z, the generator points toward -y.
export function newHorizons() {
  const g = new THREE.Group(), A = m.alu(), G = m.gold(), Z0 = -0.86, T = 0.7;
  const sh = new THREE.Shape(); const outline = [[-0.3, -0.95], [0.3, -0.95], [1.3, 0.55], [1.3, 0.85], [-1.3, 0.85], [-1.3, 0.55]];
  sh.moveTo(outline[0][0], outline[0][1]); for (let k = 1; k < outline.length; k++) sh.lineTo(outline[k][0], outline[k][1]); sh.closePath();
  const body = mesh(new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 }), G, 0, 0, Z0); g.add(body);
  // launch ring on the back, and the dish on the front
  g.add(cyl(0.52, 0.56, 0.12, A, 0, 0.1, Z0 - 0.08, 32).rotateX(Math.PI / 2), cyl(0.5, 0.5, 0.1, m.white(), 0, 0.1, Z0 + T + 0.07, 28).rotateX(Math.PI / 2));
  const dm = std('dishWhite', { color: 0xecebe6, metalness: 0.05, roughness: 0.6, side: THREE.DoubleSide });
  const d = dish(1.05, 0.3, dm, 40, 10); d.rotation.x = Math.PI / 2; d.position.set(0, 0.1, Z0 + T + 0.1); g.add(d);
  const cone = mesh(new THREE.CylinderGeometry(0.11, 0.4, 0.62, 24, 1, true), dm, 0, 0.1, Z0 + T + 0.45); cone.rotation.x = Math.PI / 2; g.add(cone);
  g.add(cyl(0.16, 0.16, 0.03, m.white(), 0, 0.1, Z0 + T + 0.77, 20).rotateX(Math.PI / 2)); const mga = dish(0.15, 0.05, dm, 20, 4); mga.rotation.x = Math.PI / 2; mga.position.set(0, 0.1, Z0 + T + 0.79); g.add(mga);
  g.add(strut(V(0, 0.1, Z0 + T + 0.79), V(0, 0.1, Z0 + T + 0.98), 0.014, A), cyl(0.03, 0.03, 0.05, m.white(), 0, 0.1, Z0 + T + 1.0, 10).rotateX(Math.PI / 2));
  // nuclear generator on its four-legged mount, behind a gold heat shield
  const zc = Z0 + T / 2, R = m.rtg();
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) g.add(strut(V(x, -0.98, zc + z), V(x * 0.4, -1.22, zc + z * 0.4), 0.014, A));
  g.add(cyl(0.3, 0.3, 0.02, G, 0, -1.2, zc, 20), cyl(0.11, 0.11, 1.1, R, 0, -1.79, zc, 18), cyl(0.13, 0.13, 0.05, R, 0, -1.25, zc, 18), cyl(0.13, 0.13, 0.05, R, 0, -2.34, zc, 18));
  for (let k = 0; k < 8; k++) { const f = box(0.1, 1.02, 0.012, R, Math.cos(k * 0.7854) * 0.16, -1.79, zc + Math.sin(k * 0.7854) * 0.16); f.rotation.y = -k * 0.7854; g.add(f); }
  // instruments
  g.add(cyl(0.125, 0.125, 0.2, m.aluDark(), 1.36, 0.3, zc - 0.05, 20).rotateZ(Math.PI / 2), cyl(0.105, 0.105, 0.02, m.lens(), 1.465, 0.3, zc - 0.05, 20).rotateZ(Math.PI / 2));            // long-range telescope camera
  { const dr = cyl(0.13, 0.13, 0.012, A, 1.5, 0.44, zc - 0.05, 20); dr.rotation.z = Math.PI / 2 - 0.9; g.add(dr); }                                                                       // its opened door
  g.add(box(0.3, 0.34, 0.4, m.silverFoil(), 1.0, 0.98, zc), box(0.16, 0.04, 0.2, m.lens(), 1.0, 1.155, zc), box(0.5, 0.012, 0.44, m.white(), 1.0, 0.95, zc - 0.3));                      // colour camera and its radiator
  g.add(box(0.14, 0.16, 0.5, G, -1.0, 0.95, zc), box(0.1, 0.1, 0.02, m.lens(), -1.0, 0.95, zc + 0.26));                                                                                  // ultraviolet spectrometer
  g.add(cyl(0.11, 0.11, 0.1, m.silverFoil(), -1.18, 0.72, Z0 + T + 0.08, 16).rotateX(Math.PI / 2), box(0.12, 0.1, 0.1, G, 1.18, 0.75, Z0 + T + 0.08));                                    // solar-wind and particle sensors
  g.add(box(0.46, 0.32, 0.02, m.aluDark(), -0.55, 0.2, Z0 - 0.04));                                                                                                                      // dust counter (built by students)
  for (const [x, y] of [[-0.75, 0.6], [0.2, 0.62]]) g.add(box(0.36, 0.26, 0.012, std('louvers', { map: louvers(), metalness: 0.3, roughness: 0.4 }), x, y, Z0 - 0.036));
  for (const x of [-0.5, 0.5]) { const s = mesh(new THREE.ConeGeometry(0.07, 0.2, 14, 1, true), std('baffle', { color: 0x1a1a1d, roughness: 0.7, side: THREE.DoubleSide }), x, 0.92, Z0 - 0.02); s.rotation.x = -Math.PI / 2 - 0.5; g.add(s); }   // star trackers
  for (const [x, y] of [[-1.3, 0.7], [1.3, 0.7], [-0.36, -0.9], [0.36, -0.9]]) for (const dz of [0.06, T - 0.06]) { g.add(box(0.1, 0.1, 0.1, G, x, y, Z0 + dz)); const n = lathe([[0.01, 0.05], [0.025, 0]], std('nozzle', { color: 0x5a5d63, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }), 8); n.position.set(x + Math.sign(x) * 0.07, y, Z0 + dz); n.rotation.z = Math.sign(x) * Math.PI / 2; g.add(n); }
  g.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  return g;
}
