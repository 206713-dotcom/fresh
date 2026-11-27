// Hardware models in metres (y up, x east, z south, ground at y = 0).
// Where NASA publishes a 3D model (NASA 3D Resources) we load it; everything else is built by hand,
// to the real dimensions, in hardware.js. (The simple shapes further down are only fallbacks.)

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as HW from './hardware.js';

const M = {
  gold: new THREE.MeshStandardMaterial({ color: 0xc9a046, metalness: 0.85, roughness: 0.33 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xd2d4d8, metalness: 0.9, roughness: 0.28 }),
  black: new THREE.MeshStandardMaterial({ color: 0x1b1b1d, metalness: 0.3, roughness: 0.6 }),
  white: new THREE.MeshStandardMaterial({ color: 0xe6e4df, metalness: 0.05, roughness: 0.65 }),
  gray: new THREE.MeshStandardMaterial({ color: 0x8c8c8c, metalness: 0.4, roughness: 0.5 }),
  solar: new THREE.MeshStandardMaterial({ color: 0x1d2b4f, metalness: 0.6, roughness: 0.25 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xc8692c, metalness: 0.2, roughness: 0.6 }),
  cloth: new THREE.MeshStandardMaterial({ color: 0xf2f0ea, metalness: 0.0, roughness: 0.9, side: THREE.DoubleSide }),
  scorched: new THREE.MeshStandardMaterial({ color: 0x3a3532, metalness: 0.5, roughness: 0.7 }),
};

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/** A thin cylinder from point a to point b. */
function strut(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), 6), mat);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}

// ---------------------------------------------------------------- procedural parts

function lmDescent() {
  const g = new THREE.Group();
  const body = mesh(new THREE.CylinderGeometry(2.1, 2.1, 1.65, 8), M.gold, 0, 1.55, 0);
  body.rotation.y = Math.PI / 8;
  g.add(body);
  g.add(mesh(new THREE.ConeGeometry(0.75, 1.0, 16, 1, true), M.black, 0, 0.65, 0));
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    const foot = new THREE.Vector3(Math.cos(a) * 4.4, 0.08, Math.sin(a) * 4.4);
    g.add(mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.16, 16), M.gold, foot.x, 0.08, foot.z));
    const top = new THREE.Vector3(Math.cos(a) * 2.0, 2.2, Math.sin(a) * 2.0);
    g.add(strut(foot.clone().setY(0.2), top, 0.09, M.silver));
    for (const s of [-1, 1]) {
      const side = new THREE.Vector3(Math.cos(a + s * 0.55) * 2.0, 1.0, Math.sin(a + s * 0.55) * 2.0);
      g.add(strut(new THREE.Vector3(foot.x * 0.75, 1.3, foot.z * 0.75), side, 0.04, M.silver));
    }
  }
  // ladder on the forward (west, -x) leg
  for (let k = 0; k < 9; k++) g.add(mesh(new THREE.BoxGeometry(0.06, 0.04, 0.5), M.silver, -2.6 - k * 0.15, 0.35 + k * 0.2, 0));
  return g;
}

function lrv() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(3.1, 0.12, 1.3), M.gray, 0, 0.62, 0));
  for (const [x, z] of [[1.15, 0.92], [1.15, -0.92], [-1.15, 0.92], [-1.15, -0.92]]) {
    const w = mesh(new THREE.TorusGeometry(0.33, 0.1, 8, 20), M.gray, x, 0.41, z);
    g.add(w);
    g.add(mesh(new THREE.BoxGeometry(0.9, 0.04, 0.35), M.orange, x, 0.86, z * 0.95)); // fender
  }
  for (const z of [-0.33, 0.33]) {   // seats
    g.add(mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), M.silver, -0.15, 0.78, z));
    g.add(mesh(new THREE.BoxGeometry(0.06, 0.5, 0.5), M.silver, -0.42, 1.0, z));
  }
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.45, 0.6), M.silver, 1.25, 0.95, 0));       // LCRU
  const mast = strut(new THREE.Vector3(1.25, 1.15, 0), new THREE.Vector3(1.3, 2.05, 0), 0.025, M.silver);
  g.add(mast);
  const dish = mesh(new THREE.SphereGeometry(0.45, 20, 8, 0, Math.PI * 2, 0, 0.55), M.silver, 1.3, 2.0, 0);
  dish.rotation.z = -0.9; g.add(dish);
  g.add(mesh(new THREE.BoxGeometry(0.18, 0.18, 0.28), M.white, 1.55, 1.35, 0));      // TV camera
  return g;
}

function alsep() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(0.6, 0.35, 0.45), M.silver, 0, 0.3, 0));
  const sun = mesh(new THREE.BoxGeometry(0.62, 0.02, 0.5), M.gold, 0, 0.62, 0);
  g.add(sun);
  g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.45, 12), M.black, 2.6, 0.32, 0.5));      // RTG
  const sei = mesh(new THREE.SphereGeometry(0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.silver, -3.5, 0.0, -1.5);
  g.add(sei);
  g.add(mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.01, 24), M.silver, -3.5, 0.01, -1.5));  // seismometer skirt
  return g;
}

function easep() {
  // Apollo 11's early package: the solar-powered Passive Seismic Experiment
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), M.silver, 0, 0.25, 0));
  for (const s of [-1, 1]) {
    const w = mesh(new THREE.BoxGeometry(0.9, 0.02, 0.55), M.solar, s * 0.75, 0.42, 0);
    w.rotation.z = s * 0.12; g.add(w);
  }
  return g;
}

function lrrr(big) {
  const g = new THREE.Group();
  const w = big ? 1.05 : 0.46, d = big ? 0.64 : 0.46;
  const panel = mesh(new THREE.BoxGeometry(w, 0.08, d), M.silver, 0, 0.42, 0);
  panel.rotation.z = 0.35;
  g.add(panel);
  const face = mesh(new THREE.PlaneGeometry(w * 0.92, d * 0.92), M.solar, 0, 0.465, 0);
  face.rotation.x = -Math.PI / 2; face.rotation.y = 0.35; g.add(face);
  g.add(strut(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.38, 0), 0.03, M.silver));
  return g;
}

function flag(fallen) {
  const g = new THREE.Group();
  if (fallen) {
    // Apollo 11's flag was blown over by the ascent engine: pole and cloth lie on the ground
    g.add(strut(new THREE.Vector3(0, 0.03, 0), new THREE.Vector3(2.1, 0.03, 0), 0.02, M.white));
    const cloth = mesh(new THREE.PlaneGeometry(1.5, 0.9), M.cloth, 1.35, 0.035, 0.45);
    cloth.rotation.x = -Math.PI / 2;
    g.add(cloth);
    return g;
  }
  g.add(strut(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.1, 0), 0.02, M.white));
  g.add(strut(new THREE.Vector3(0, 2.05, 0), new THREE.Vector3(1.5, 2.05, 0), 0.012, M.white));   // top bar
  g.add(mesh(new THREE.PlaneGeometry(1.5, 0.9), M.cloth, 0.75, 1.6, 0));
  return g;
}

function surveyor() {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    const foot = new THREE.Vector3(Math.cos(a) * 2.1, 0.05, Math.sin(a) * 2.1);
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.1, 12), M.white, foot.x, 0.05, foot.z));
    g.add(strut(foot.clone().setY(0.1), new THREE.Vector3(Math.cos(a) * 0.5, 0.8, Math.sin(a) * 0.5), 0.05, M.silver));
  }
  g.add(mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 3), M.silver, 0, 0.85, 0));
  g.add(strut(new THREE.Vector3(0, 0.9, 0), new THREE.Vector3(0, 3.0, 0), 0.05, M.silver));
  const panel = mesh(new THREE.BoxGeometry(0.85, 0.02, 0.85), M.solar, 0.2, 2.9, 0); panel.rotation.z = 0.5; g.add(panel);
  const ant = mesh(new THREE.BoxGeometry(0.95, 0.02, 0.95), M.white, -0.2, 2.6, 0); ant.rotation.z = -0.7; g.add(ant);
  g.add(mesh(new THREE.BoxGeometry(0.35, 0.3, 0.35), M.white, 0.5, 1.05, 0.3));
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.45, 12), M.white, -0.3, 1.25, 0.35));    // TV camera
  return g;
}

function pathfinder() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.35, 0.55, 0.45, 3), M.silver, 0, 0.25, 0));
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3 + Math.PI / 6;
    const petal = mesh(new THREE.CylinderGeometry(0.0, 1.05, 0.04, 3, 1), M.solar, Math.cos(a) * 0.95, 0.03, Math.sin(a) * 0.95);
    petal.rotation.y = -a + Math.PI / 2;
    g.add(petal);
    const bag = mesh(new THREE.IcosahedronGeometry(0.45, 1), M.cloth, Math.cos(a + Math.PI / 3) * 1.6, 0.18, Math.sin(a + Math.PI / 3) * 1.6);
    bag.scale.set(1.2, 0.35, 0.9);
    g.add(bag);
  }
  g.add(strut(new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, 1.5, 0), 0.03, M.silver));
  g.add(mesh(new THREE.BoxGeometry(0.22, 0.14, 0.14), M.white, 0, 1.55, 0));                // IMP camera
  // Sojourner a few metres away
  const s = new THREE.Group();
  s.add(mesh(new THREE.BoxGeometry(0.63, 0.06, 0.48), M.solar, 0, 0.3, 0));
  s.add(mesh(new THREE.BoxGeometry(0.5, 0.15, 0.35), M.silver, 0, 0.2, 0));
  for (const x of [-0.25, 0, 0.25]) for (const z of [-0.22, 0.22]) s.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.07, 12), M.gray, x, 0.065, z).rotateX(Math.PI / 2));
  s.position.set(3.2, 0, -1.5); s.rotation.y = 0.6;
  g.add(s);
  return g;
}

function phoenix() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.25, 10), M.silver, 0, 1.0, 0));
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    g.add(strut(new THREE.Vector3(Math.cos(a) * 0.6, 0.9, Math.sin(a) * 0.6), new THREE.Vector3(Math.cos(a) * 1.1, 0.05, Math.sin(a) * 1.1), 0.05, M.silver));
  }
  for (const s of [-1, 1]) {
    const arr = mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.03, 10), M.solar, s * 1.85, 1.0, 0);
    if (s > 0) { arr.rotation.z = 0.55; arr.position.y = 0.55; }   // 2010 orbital images suggest a broken array
    g.add(arr);
  }
  g.add(strut(new THREE.Vector3(0.3, 1.1, 0.3), new THREE.Vector3(0.9, 1.6, 1.5), 0.04, M.white));   // arm
  g.add(strut(new THREE.Vector3(0, 1.1, -0.3), new THREE.Vector3(0, 2.0, -0.3), 0.04, M.silver));     // mast
  g.add(mesh(new THREE.BoxGeometry(0.25, 0.15, 0.15), M.white, 0, 2.05, -0.3));
  return g;
}

function skycraneDebris(rnd) {
  const g = new THREE.Group();
  const scorch = mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshStandardMaterial({ color: 0x241c18, roughness: 1, transparent: true, opacity: 0.55 }), 0, 0.02, 0);
  scorch.rotation.x = -Math.PI / 2; scorch.receiveShadow = true; scorch.castShadow = false;
  g.add(scorch);
  for (let i = 0; i < 26; i++) {
    const s = 0.2 + rnd() * 1.4;
    const p = mesh(new THREE.BoxGeometry(s, s * 0.25, s * (0.3 + rnd())), rnd() < 0.5 ? M.scorched : M.silver,
      (rnd() - 0.5) * 16, s * 0.1, (rnd() - 0.5) * 16);
    p.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    g.add(p);
  }
  return g;
}

function craterDecal(diam, rays) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  const grd = x.createRadialGradient(256, 256, 0, 256, 256, 256);
  grd.addColorStop(0, 'rgba(20,18,16,0.85)');
  grd.addColorStop(0.32, 'rgba(40,36,32,0.65)');
  grd.addColorStop(0.42, 'rgba(235,230,220,0.55)');
  grd.addColorStop(0.55, 'rgba(210,205,195,0.22)');
  grd.addColorStop(1, 'rgba(200,200,200,0)');
  x.fillStyle = grd; x.fillRect(0, 0, 512, 512);
  if (rays) {
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2, l = 140 + Math.random() * 110;
      x.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`;
      x.lineWidth = 2 + Math.random() * 7;
      x.beginPath(); x.moveTo(256 + Math.cos(a) * 70, 256 + Math.sin(a) * 70); x.lineTo(256 + Math.cos(a) * l, 256 + Math.sin(a) * l); x.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(diam * 3, diam * 3),
    new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, roughness: 1, metalness: 0 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.03;
  m.receiveShadow = true;
  return m;
}

function impact(opts, rnd) {
  const g = new THREE.Group();
  g.add(craterDecal(opts.crater || 20, true));
  // a ring of rim boulders and a few fragments
  const n = Math.round(10 + (opts.crater || 20));
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = (opts.crater || 20) * (0.5 + rnd() * 0.5);
    const s = 0.08 + rnd() * 0.35;
    const b = mesh(new THREE.DodecahedronGeometry(s, 0), M.gray, Math.cos(a) * r, s * 0.4, Math.sin(a) * r);
    b.material = new THREE.MeshStandardMaterial({ color: 0x8a867f, roughness: 0.95 });
    g.add(b);
  }
  return g;
}

// ---------------------------------------------------------------- NASA 3D Resources models

const GLB = {
  lm:        { url: 'models/lm.glb',        scale: 9.4 / 6.43, keepBelowY: 2.42 },   // descent stage only
  viking:    { url: 'models/viking.glb',    height: 2.1 },
  mer:       { url: 'models/mer.glb',       height: 1.5 },
  insight:   { url: 'models/insight.glb',   scale: 1.0 },
  ingenuity: { url: 'models/ingenuity.glb', scale: 1.0 },
  // the two big rovers that are still driving (NASA 3D Resources; Curiosity converted from NASA's .blend file)
  msl:       { url: 'models/msl.glb', scale: 1.0, dropBelowY: 0.15, straight: /^(wheel_0[123]_[LR]|suspension_steer_[FB]_[LR])$/ },   // its wheels are stored turned and tilted: set them straight, as Curiosity drives   // the source file has a display stand under the rover
  m2020:     { url: 'models/m2020.glb', scale: 1.0 },
  // the whole Lunar Module as it stood on the surface before the crew left (same NASA model, nothing hidden)
  lmfull:    { file: 'lm', url: 'models/lm.glb', scale: 9.4 / 6.43 },
  // LADEE as it flew: 2.37 m tall (NASA 3D Resources)
  ladee:     { url: 'models/ladee.glb', height: 2.37 },
  // deep-space probes (NASA 3D Resources). `raw` models are in metres, centred on their own origin.
  // for the Apollo 11 film: the Saturn V, and the Apollo-Soyuz model (its Apollo half is the command and service module)
  saturnv:     { url: 'models/saturnv.glb', raw: true, scale: 1.0 },
  apollosoyuz: { url: 'models/apollosoyuz.glb', raw: true, scale: 1.0 },
  // the two great space telescopes, and the shuttle stack that launched Hubble (NASA 3D Resources)
  dawn:      { url: 'models/dawn.glb', raw: true, scale: 1.0 },
  kepler:    { url: 'models/kepler.glb', raw: true, scale: 1.0 },
  near:      { url: 'models/near.glb', raw: true, scale: 1.0 },
  hst:       { url: 'models/hst.glb', raw: true, scale: 13.2 / 525.5 },
  jwst:      { url: 'models/jwst.glb', raw: true, scale: 1.0 },
  shuttle:   { url: 'models/shuttle.glb', raw: true, scale: 1.0 },
  voyager:   { url: 'models/voyager.glb', raw: true, scale: 3.7 / 3.81, rot: [Math.PI / 2, 0, 0] },
  pioneer:   { url: 'models/pioneer.glb', raw: true, scale: 1.0, rot: [0, Math.PI, 0] },
  cassini:   { url: 'models/cassini.glb', raw: true, scale: 1.0, rot: [Math.PI / 2, 0, 0] },
};
const loader = new GLTFLoader();
const cache = new Map();

// Models ship as models/<name>.glb.js (base64 in a JS module) because some static hosts,
// including the one this prototype is published on, refuse to serve .glb files. If the module
// is missing we fall back to the plain .glb (handy when you drop in a new model locally).
async function fetchModel(key) {
  try {
    const mod = await import(`../../models/${GLB[key].file || key}.glb.js`);
    const bin = atob(mod.default);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return await loader.parseAsync(bytes.buffer, '');
  } catch (e) {
    return loader.loadAsync(GLB[key].url);
  }
}

export async function loadGLB(key) {
  const file = GLB[key].file || key;
  if (!cache.has(file)) cache.set(file, fetchModel(key));
  const gltf = await cache.get(file);
  const cfg = GLB[key];
  const root = gltf.scene.clone(true);
  if (cfg.straight) root.traverse((o) => { if (cfg.straight.test(o.name)) o.quaternion.identity(); });
  root.updateMatrixWorld(true);
  if (cfg.keepBelowY != null) {
    // Leave only the parts below the ascent-stage line: on the Moon only the descent stage remains.
    const box = new THREE.Box3(), c = new THREE.Vector3();
    // The hidden parts are taken out of the model completely, so no viewer tool can bring them back.
    const drop = [];
    root.traverse((o) => {
      if (o.isMesh) { box.setFromObject(o); box.getCenter(c); if (c.y > cfg.keepBelowY) drop.push(o); }
    });
    for (const o of drop) o.removeFromParent();
  }
  if (cfg.dropBelowY != null) {
    const box = new THREE.Box3(), drop = [];
    root.traverse((o) => { if (o.isMesh) { box.setFromObject(o); if (box.max.y < cfg.dropBelowY) drop.push(o); } });
    for (const o of drop) o.removeFromParent();
  }
  if (cfg.keepY) {
    const box = new THREE.Box3(), drop = [];
    root.traverse((o) => { if (o.isMesh) { box.setFromObject(o); if (box.min.y < cfg.keepY[0] || box.max.y > cfg.keepY[1]) drop.push(o); } });
    for (const o of drop) o.removeFromParent();
  }
  // stray unit cubes left in some source files (not part of the spacecraft)
  { const drop = []; root.traverse((o) => { if (o.isMesh && /^Cube\d+$/.test(o.name)) drop.push(o); }); for (const o of drop) o.removeFromParent(); }
  if (cfg.raw) {
    const wrap = new THREE.Group();
    root.scale.setScalar(cfg.scale || 1);
    if (cfg.rot) root.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    root.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
    wrap.add(root);
    return wrap;
  }
  const box = new THREE.Box3();
  root.traverse((o) => { if (o.isMesh && o.visible) box.expandByObject(o); });
  const s = cfg.height ? cfg.height / (box.max.y - box.min.y) : cfg.scale;
  const wrap = new THREE.Group();
  root.scale.setScalar(s);
  root.position.y = -box.min.y * s;
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true; o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) if (m && m.isMeshBasicMaterial) { /* unlit parts stay unlit */ }
    }
  });
  wrap.add(root);
  return wrap;
}

/** Build one part. Returns an Object3D immediately; GLB parts fill in asynchronously. */
export function buildPart(part, rnd) {
  const holder = new THREE.Group();
  const add = (o) => holder.add(o);
  switch (part.type) {
    case 'lm':
      loadGLB('lm').then(add).catch(() => add(lmDescent()));
      break;
    case 'lm-proc': add(lmDescent()); break;
    case 'lrv': add(HW.lrv()); break;
    case 'alsep': add(HW.alsep(part)); break;
    case 'easep': add(HW.easep()); break;
    case 'lrrr': add(HW.lrrr(part.big)); break;
    case 'flag': add(HW.flag(part.fallen)); break;
    case 'surveyor': add(HW.surveyor(part)); break;
    case 'pathfinder': add(HW.pathfinder()); break;
    case 'phoenix': add(HW.phoenix(part)); break;
    case 'skycrane': add(HW.skycraneDebris(rnd)); break;
    case 'impact': add(impact(part, rnd)); break;
    case 'viking': case 'mer': case 'insight': case 'ingenuity': case 'lmfull': case 'ladee': case 'msl': case 'm2020':
      loadGLB(part.type).then(add).catch((e) => { console.warn('model failed', part.type, e); add(lmDescent()); });
      break;
    default: break;
  }
  holder.position.set(part.e || 0, 0, -(part.n || 0));
  holder.rotation.y = (part.heading || 0) * Math.PI / 180;
  return holder;
}
