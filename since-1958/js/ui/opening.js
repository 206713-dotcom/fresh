// The opening film (a 5-second fall to the Moon, then 40 seconds, after the Earth has turned to the Milky Way). It states the whole idea before the
// visitor touches anything:
//   0-6 s   Tranquility Base today: the Apollo 11 descent stage, standing where it was left in 1969
//   6-12 s  the camera rises; the laser reflector beside it is still in use
//   12-24 s the view pulls back: Moon, Earth, Mars, the Solar System. One light per thing left behind, and a counter
//   24-29 s the silent ones turn grey; the ones still working or still in use stay lit
//   29-38 s "Their achievements are not.", then the title
//   38-40 s the year runs back to 1958, and the tutorial takes over
// The first part is a small 3D scene of its own, built from the same models and the same site layout as the app.
// The second part is a drawn map: directions from the Sun are real for today's date, sizes and distances are
// compressed so that everything fits (the map says so). The counts are counted from the app's own data.

import * as THREE from 'three';
import * as A from '../../vendor/astronomy.js';
import { buildPart, loadGLB } from '../scene/models.js';
import { EQUIPMENT } from '../../data/equipment.js';
import { PROBES } from '../../data/probes.js';
import { AU_KM } from '../config.js';

const PRE = 5.5, LEN = 40, GOLD = '#ffd27a', GREY = '#56606e';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (t, a, b) => ease((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const RF = (au) => 1300 * Math.pow(Math.max(au, 0.05), 0.3);        // compressed distance from the Sun, map units
const stateAt = (q, ms) => { let s = 'left'; for (const e of q.timeline || []) if (Date.parse(e.t) <= ms) s = e.state; return s; };

const CAPS = [
  [2.6, 6.3, 'This has been here since 1969.'],
  [6.7, 11.4, 'Its mirror still answers lasers from Earth.'],
  [24.4, 28.9, 'Most of them are silent.'],
];

// The worlds on the map are the real ones: each disc is the same surface map the 3D view uses, wrapped on a sphere
// and lit from the side that faces the Sun. Baked once into a small picture; a plain disc stands in until it is ready.
const SPR = {};
const TEX = { earth: ['earth_day.jpg', 320, 0.35], moon: ['moon.jpg', 640, 0], mars: ['mars.jpg', 256, 0], mercury: ['mercury.jpg', 96, 0], venus: ['venus_clouds.jpg', 96, 0],
  jupiter: ['jupiter.jpg', 160, 0], saturn: ['saturn.jpg', 160, 0], uranus: ['uranus.jpg', 96, 0], neptune: ['neptune.jpg', 96, 0] };
function bake(img, size, lx, ly, lon0) {
  const tw = 1024, th = 512, tc = document.createElement('canvas'); tc.width = tw; tc.height = th;
  const tg = tc.getContext('2d', { willReadFrequently: true }); tg.drawImage(img, 0, 0, tw, th); const T = tg.getImageData(0, 0, tw, th).data;
  const out = document.createElement('canvas'); out.width = out.height = size; const og = out.getContext('2d'), o = og.createImageData(size, size), D = o.data;
  const ln = Math.hypot(lx, ly, 1.0), Lx = lx / ln, Ly = ly / ln, Lz = 1.0 / ln;
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    const x = (px + 0.5) / size * 2 - 1, y = (py + 0.5) / size * 2 - 1, r2 = x * x + y * y; if (r2 > 1) continue;
    const z = Math.sqrt(1 - r2), lat = Math.asin(-y), lon = Math.atan2(x, z) + lon0;
    const u = (((0.5 + lon / 6.2832) % 1) + 1) % 1, v = 0.5 - lat / Math.PI;
    const ti = (Math.min(th - 1, Math.floor(v * th)) * tw + Math.min(tw - 1, Math.floor(u * tw))) * 4, i = (py * size + px) * 4;
    const k = Math.min(1.2, 0.3 + 1.05 * Math.max(0, x * Lx + y * Ly + z * Lz));
    D[i] = T[ti] * k; D[i + 1] = T[ti + 1] * k; D[i + 2] = T[ti + 2] * k; D[i + 3] = 255 * Math.min(1, (1 - Math.sqrt(r2)) * size * 0.5);
  }
  og.putImageData(o, 0, 0); return out;
}
function loadWorlds(m) {
  const where = { earth: m.earth, moon: m.moon, mars: m.mars }; for (const pl of m.planets) where[pl.n.toLowerCase()] = where[pl.n.toLowerCase()] || pl.p;
  for (const [key, [file, size, lon0]] of Object.entries(TEX)) {
    if (SPR[key] !== undefined) continue; SPR[key] = null;
    const p = where[key], d = Math.hypot(p[0], p[1]) || 1, img = new Image();
    img.onload = () => { try { SPR[key] = bake(img, size, -p[0] / d, -p[1] / d, lon0); } catch (e) { console.warn('world map failed', key, e); } };
    img.src = `textures/${file}`;
  }
}

export function setupOpening() {
  const el = document.createElement('div'); el.id = 'opening'; el.hidden = true;
  el.innerHTML = `<canvas class="op-3d"></canvas><canvas class="op-map"></canvas><div class="op-film"></div>
    <p class="op-place"><b>Tranquility Base, the Moon</b><span></span></p>
    <p class="op-count" hidden></p>
    <p class="op-cap"></p>
    <div class="op-title"><p class="op-t1">Their achievements are not.</p><h1>Since 1958:<em>Beyond</em></h1><p class="op-t2"><b class="op-year">2026</b><span>Now it’s your turn.</span></p></div>
    <p class="op-fine">Directions from the Sun are real for today. Sizes and distances are compressed.</p>
    <button class="op-skip" title="Skip ( Tab )">Skip ▸▸</button>`;
  document.body.appendChild(el);
  const $ = (s) => el.querySelector(s);
  const c3 = $('.op-3d'), cm = $('.op-map'), g = cm.getContext('2d');
  const moonTex = new THREE.TextureLoader().load('textures/moon_4k.jpg'); moonTex.colorSpace = THREE.SRGBColorSpace;
  setTimeout(() => { loadGLB('lm').catch(() => {}); }, 2500);   // NASA's descent stage: fetched early, so it is standing there when the film arrives
  let hold = null;
  let raf = 0, t0 = 0, done = null, R = null, map = null, open = false, capI = -2, cntHtml = '';

  // ---------------------------------------------------------------- part 1: Tranquility Base, in 3D
  function build3d() {
    const renderer = new THREE.WebGLRenderer({ canvas: c3, antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 6000);
    let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const site = EQUIPMENT.find((q) => q.id === 'apollo11');

    // ---- the way in: the real Moon, and a slow fall towards the Sea of Tranquility (the site's real latitude and longitude)
    const sceneA = new THREE.Scene(); sceneA.background = new THREE.Color(0x000000);
    const la = site.lat * Math.PI / 180, lo = site.lon * Math.PI / 180, RMOON = 1737.4;
    const U = new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
    const E = new THREE.Vector3(-Math.sin(lo), 0, -Math.cos(lo)), N = new THREE.Vector3().crossVectors(E, U).negate().normalize();
    const SUN_E = 80, SUN_U = 26, SUN_N = 60;                                 // the same low morning Sun in both scenes
    const sunA = new THREE.DirectionalLight(0xffffff, 3.4); sunA.position.copy(E).multiplyScalar(SUN_E).addScaledVector(U, SUN_U + 30).addScaledVector(N, SUN_N); sceneA.add(sunA, new THREE.AmbientLight(0xffffff, 0.02));
    moonTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    sceneA.add(new THREE.Mesh(new THREE.SphereGeometry(RMOON, 128, 64), new THREE.MeshStandardMaterial({ map: moonTex, roughness: 1, metalness: 0 })));
    { const n = 1600, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const z = Math.random() * 2 - 1, a = Math.random() * 6.2832, r = Math.sqrt(1 - z * z); pos.set([r * Math.cos(a) * 9e4, z * 9e4, r * Math.sin(a) * 9e4], i * 3); }
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sceneA.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xcfd8e6, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.8 }))); }

    // ---- Tranquility Base
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
    const sunDir = new THREE.Vector3(SUN_E, SUN_U, -SUN_N).normalize();
    const sun = new THREE.DirectionalLight(0xffffff, 3.9); sun.position.copy(sunDir).multiplyScalar(110); sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025;
    Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 300 }); sun.shadow.camera.updateProjectionMatrix();
    scene.add(sun, sun.target, new THREE.HemisphereLight(0x000000, 0x8a857c, 0.16));
    // what the foil has to reflect: a black sky, the Sun, and the sunlit ground all around. Without it metal foil is just black.
    { const pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene(); es.background = new THREE.Color(0x000000);
      es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16, 0, 6.2832, Math.PI * 0.52, Math.PI * 0.48), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.49, 0.47), side: THREE.BackSide })));
      const sd = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(90, 88, 84) })); sd.position.copy(sunDir).multiplyScalar(45); es.add(sd);
      scene.environment = pm.fromScene(es, 0.015).texture; pm.dispose(); }

    // the ground: fine grey dust, gentle swells, craters of every size, scattered stones
    const craters = Array.from({ length: 46 }, () => { const a = rnd() * 6.283, d = 14 + rnd() * rnd() * 420; return [Math.cos(a) * d, Math.sin(a) * d, 1.5 + rnd() * rnd() * 16]; });
    for (let i = 0; i < 110; i++) { const a = rnd() * 6.283, d = 7 + rnd() * 75, x = Math.cos(a) * d, z = Math.sin(a) * d; if (Math.hypot(x - 7, z + 5.5) > 11) craters.push([x, z, 0.5 + rnd() * rnd() * 2.6]); }   // (none between the camera and the lander)
    const hAt = (x, z) => {
      let y = Math.sin(x * 0.021 + 1.3) * Math.cos(z * 0.017) * 1.1 + Math.sin(x * 0.11 + z * 0.07) * 0.09 + Math.sin(x * 0.63 + 2) * Math.sin(z * 0.71) * 0.025;
      const near = Math.hypot(x, z); if (near < 60) y *= Math.pow(near / 60, 2);                      // level where the hardware stands
      for (const [cx, cz, r] of craters) { const d = Math.hypot(x - cx, z - cz) / r; if (d < 1.5) y += d < 1 ? -r * 0.13 * (1 - d * d) : r * 0.025 * (1 - (d - 1) / 0.5); }
      return y;
    };
    const SEG = 380, geo = new THREE.PlaneGeometry(2, 2, SEG, SEG); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position, UV = geo.attributes.uv;
    for (let i = 0; i < P.count; i++) {                                         // the mesh is finest under the lander and coarser far away
      const u = P.getX(i), w = P.getZ(i), x = Math.sign(u) * Math.pow(Math.abs(u), 2.2) * 800, z = Math.sign(w) * Math.pow(Math.abs(w), 2.2) * 800;
      P.setXYZ(i, x, hAt(x, z), z); UV.setXY(i, x / 1600 + 0.5, z / 1600 + 0.5);
    }
    geo.computeVertexNormals();
    const noiseTex = (size, rep, fn) => { const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'), im = x.createImageData(size, size); fn(im.data, size); x.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
    const grain = noiseTex(256, 520, (d) => { for (let i = 0; i < d.length; i += 4) { const v = 168 + Math.random() * 80; d[i] = v; d[i + 1] = v * 0.985; d[i + 2] = v * 0.96; d[i + 3] = 255; } }); grain.colorSpace = THREE.SRGBColorSpace;
    // the dust is not smooth: clods, pebbles and tiny pits, as a height map (it tiles)
    const lumps = noiseTex(1024, 200, (d, n) => {
      const h = new Float32Array(n * n);
      for (const [cell, amp] of [[128, 0.3], [32, 0.25], [8, 0.2], [2, 0.12]]) { const gN = n / cell, gv = Float32Array.from({ length: gN * gN }, () => Math.random());
        for (let y = 0; y < n; y++) { const fy = y / cell, y0 = Math.floor(fy), ty = fy - y0, sy = ty * ty * (3 - 2 * ty), r0 = (y0 % gN) * gN, r1 = ((y0 + 1) % gN) * gN;
          for (let x = 0; x < n; x++) { const fx = x / cell, x0 = Math.floor(fx), tx = fx - x0, sx = tx * tx * (3 - 2 * tx), c0 = x0 % gN, c1 = (x0 + 1) % gN;
            h[y * n + x] += amp * ((gv[r0 + c0] * (1 - sx) + gv[r0 + c1] * sx) * (1 - sy) + (gv[r1 + c0] * (1 - sx) + gv[r1 + c1] * sx) * sy); } } }
      for (let k = 0; k < 5200; k++) { const cx = Math.random() * n, cy = Math.random() * n, r = 1.2 + Math.pow(Math.random(), 3) * 11, up = Math.random() < 0.6 ? 0.3 : -0.24;     // pebbles, clods and tiny pits
        for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const q = Math.hypot(x, y) / r; if (q < 1) h[(((cy + y) | 0) + n) % n * n + (((cx + x) | 0) + n) % n] += up * (up > 0 ? Math.sqrt(1 - q * q) : 1 - q * q); } }
      for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, h[i] * 240)); d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; }
    });
    const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x8d8983, map: grain, bumpMap: lumps, bumpScale: 0.32, roughness: 1, metalness: 0, envMapIntensity: 0 })); ground.receiveShadow = true; scene.add(ground);
    { // stones, most of them small
      const rg = new THREE.IcosahedronGeometry(1, 2), rp = rg.attributes.position;
      for (let i = 0; i < rp.count; i++) { const x = rp.getX(i), y = rp.getY(i), z = rp.getZ(i), f = 1 + 0.2 * Math.sin(x * 5.1 + y * 7.3 + z * 3.7) + 0.1 * Math.sin(x * 12.9 + y * 18.2 + z * 15.7); rp.setXYZ(i, x * f, y * f, z * f); }
      rg.computeVertexNormals();
      const NR = 650, rocks = new THREE.InstancedMesh(rg, new THREE.MeshStandardMaterial({ color: 0x66635e, roughness: 1, metalness: 0, envMapIntensity: 0 }), NR), o = new THREE.Object3D();
      for (let i = 0; i < NR; i++) { const a = rnd() * 6.283, d = 4.5 + Math.pow(rnd(), 1.7) * 120, x = Math.cos(a) * d, z = Math.sin(a) * d, sc = 0.015 + Math.pow(rnd(), 5) * 0.22;
        if (Math.hypot(x - 10, z + 8) < 3.5) { o.scale.setScalar(0); o.updateMatrix(); rocks.setMatrixAt(i, o.matrix); continue; }
        o.position.set(x, hAt(x, z) - sc * 0.3, z); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.set(sc, sc * (0.5 + rnd() * 0.4), sc * (0.7 + rnd() * 0.5)); o.updateMatrix(); rocks.setMatrixAt(i, o.matrix); }
      rocks.castShadow = true; rocks.receiveShadow = true; scene.add(rocks);
    }
    { // around the lander the dust is darker: it was churned up by the engine and by two pairs of boots
      const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), gr = x.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, 'rgba(0,0,0,0.2)'); gr.addColorStop(0.35, 'rgba(0,0,0,0.12)'); gr.addColorStop(0.7, 'rgba(0,0,0,0.04)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
      const dk = new THREE.Mesh(new THREE.CircleGeometry(24, 48), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); dk.rotation.x = -Math.PI / 2; dk.position.set(-1, 0.03, 6); dk.renderOrder = 1;   // (left out: its edge showed)
    }

    { // Bootprints. Nothing has disturbed them since 1969: trails from the ladder to the flag and out to the experiments, and a trampled ring round the lander.
      const c = document.createElement('canvas'); c.width = 32; c.height = 64; const x = c.getContext('2d');
      x.fillStyle = 'rgba(0,0,0,0.55)'; x.beginPath(); x.ellipse(16, 32, 12, 29, 0, 0, 6.2832); x.fill();
      x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,0.6)'; for (let y = 8; y < 58; y += 6) x.fillRect(3, y, 26, 2.2);            // the tread bars of the overshoe
      const bt = new THREE.CanvasTexture(c), NB = 1700, prints = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.15, 0.33).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: bt, color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), NB), o = new THREE.Object3D();
      let nb = 0; const step = (px, pz, hd, side) => { if (nb >= NB) return; const sx = px + Math.cos(hd) * side * 0.11, sz = pz - Math.sin(hd) * side * 0.11; if (Math.hypot(sx, sz) < 2.6) return; o.position.set(sx, hAt(sx, sz) + 0.012, sz); o.rotation.set(0, hd + (rnd() - 0.5) * 0.5, 0); o.scale.setScalar(0.9 + rnd() * 0.2); o.updateMatrix(); prints.setMatrixAt(nb++, o.matrix); };
      const fl = site.parts.find((q) => q.type === 'flag'), ea = site.parts.find((q) => q.type === 'easep'), lrp = site.parts.find((q) => q.type === 'lrrr');
      const LAD = [-5.2, 0], FLAG = [fl.e, -fl.n], LRP = [lrp.e, -lrp.n], EAS = [ea.e, -ea.n];
      for (const [A, B, passes] of [[LAD, FLAG, 5], [LAD, [-4, 7], 5], [[-4, 7], LRP, 5], [LRP, EAS, 4], [LAD, [-3.5, -6.5], 3], [[-3.5, -6.5], [5, -6], 3], [[5, -6], [6.5, 2], 3], [[6.5, 2], [-4, 7], 3]])
        for (let k = 0; k < passes; k++) { const ox = (rnd() - 0.5) * 1.3, oz = (rnd() - 0.5) * 1.3, L = Math.hypot(B[0] - A[0], B[1] - A[1]), hd = Math.atan2(B[0] - A[0], B[1] - A[1]) + (k % 2 ? Math.PI : 0);
          for (let q = 0, i = 0; q < L; q += 0.42 + rnd() * 0.12, i++) { const f = q / L; step(A[0] + (B[0] - A[0]) * f + ox + (rnd() - 0.5) * 0.25, A[1] + (B[1] - A[1]) * f + oz + (rnd() - 0.5) * 0.25, hd, i % 2 ? 1 : -1); } }
      for (let k = 0; k < 420; k++) { const a = rnd() * 6.283, r = 3.2 + rnd() * 5.5; step(Math.cos(a) * r, Math.sin(a) * r, rnd() * 6.283, rnd() < 0.5 ? 1 : -1); }                     // milling about at the lander
      for (const P of [FLAG, LRP, EAS]) for (let k = 0; k < 60; k++) { const a = rnd() * 6.283, r = 0.6 + rnd() * 1.6; step(P[0] + Math.cos(a) * r, P[1] + Math.sin(a) * r, rnd() * 6.283, 1); }
      prints.count = nb; prints.renderOrder = 1; scene.add(prints);
    }
    // the hardware, laid out as at the real site (the same record the app flies to)
    for (const part of site.parts) if (!part.exhibitOnly) scene.add(buildPart(part, rnd));
    // The descent stage is NASA's own 3D model. Here it gets its real skin back: the stage was wrapped in blankets of
    // aluminised Kapton and Mylar foil (gold and orange), with black-painted panels on the sides that faced the engine
    // plume and the Sun. Foil is a crumpled mirror, so each material is a metal with a crinkle map and reflects the scene.
    // crumpled foil as a height map: shallow dents at three sizes, with a sharp crease wherever two dents meet
    const dents = (n, count) => { const pts = Array.from({ length: count }, () => [Math.random() * n, Math.random() * n]), far = n / Math.sqrt(count) * 0.85;
      return (x, y) => { let b = 1e9; for (const [px, py] of pts) { let dx = Math.abs(x - px), dy = Math.abs(y - py); if (dx > n / 2) dx = n - dx; if (dy > n / 2) dy = n - dy; const q = dx * dx + dy * dy; if (q < b) b = q; } return Math.min(1, Math.sqrt(b) / far); }; };
    const crk = noiseTex(256, 1, (d, n) => { const A = dents(n, 12), B = dents(n, 55), C = dents(n, 240);
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = 255 * (0.5 * A(x, y) + 0.32 * B(x, y) + 0.18 * C(x, y)), i = (y * n + x) * 4; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } });
    // the blankets were cut from many sheets and taped together: each sheet a slightly different gold, with a darker seam
    const sheets = noiseTex(256, 0.2, (d, n) => { const pts = Array.from({ length: 11 }, () => [Math.random() * n, Math.random() * n, 0.7 + 0.3 * Math.random(), Math.random()]);
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let b1 = 1e9, b2 = 1e9, c = null;
        for (const pt of pts) { let dx = Math.abs(x - pt[0]), dy = Math.abs(y - pt[1]); if (dx > n / 2) dx = n - dx; if (dy > n / 2) dy = n - dy; const q = dx * dx + dy * dy; if (q < b1) { b2 = b1; b1 = q; c = pt; } else if (q < b2) b2 = q; }
        const seam = Math.sqrt(b2) - Math.sqrt(b1) < 1.5 ? 0.55 : 1, r = 255 * c[2] * seam, i = (y * n + x) * 4; d[i] = r; d[i + 1] = r * (0.86 + 0.14 * c[3]); d[i + 2] = r * (0.7 + 0.3 * c[3]); d[i + 3] = 255; } });
    sheets.colorSpace = THREE.SRGBColorSpace;
    const foil = (color, roughness, bumpScale, env = 1.5, map = sheets) => new THREE.MeshStandardMaterial({ color, map, metalness: 1, roughness, bumpMap: crk, bumpScale, envMapIntensity: env });
    const SKIN = {
      'blinn1SG.002': foil(0xf0a233, 0.24, 1.25),            // gold Kapton blankets
      'blinn9SG.001': foil(0xd4661e, 0.26, 1.25),           // the deeper orange Kapton
      'blinn10SG.001': foil(0xf2d28c, 0.26, 1.1),           // pale gold foil
      'blinn4SG.002': foil(0xcfd1d5, 0.5, 0.7, 1.0, null),      // aluminised Mylar and bare aluminium
      'blinn3SG.001': foil(0xc4c7cc, 0.52, 0.6, 1.0, null),
      'blinn6SG.001': new THREE.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0.6, roughness: 0.42, bumpMap: crk, bumpScale: 1.0, envMapIntensity: 0.8 }),   // black thermal shielding
      'blinn2SG.002': new THREE.MeshStandardMaterial({ color: 0x2c2c2f, metalness: 0.8, roughness: 0.55, envMapIntensity: 0.9 }),
      'initialShadingGr.001': new THREE.MeshStandardMaterial({ color: 0x8f9094, metalness: 0.8, roughness: 0.5, envMapIntensity: 1 }),
    };
    // The NASA model carries no texture coordinates. Each triangle gets its own, laid flat on its own face (along it
    // and up it), so the foil pattern is never stretched. This works on a copy: the app's own model is left as it is.
    const uvCache = new Map();
    const faceUV = (g0) => { if (g0.attributes.uv) return g0; if (uvCache.has(g0)) return uvCache.get(g0);
      const g2 = g0.index ? g0.toNonIndexed() : g0.clone(), p = g2.attributes.position, uv = new Float32Array(p.count * 2), P3 = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], n = new THREE.Vector3(), e = new THREE.Vector3();
      for (let i = 0; i + 2 < p.count; i += 3) { for (let k = 0; k < 3; k++) P3[k].fromBufferAttribute(p, i + k);
        n.subVectors(P3[1], P3[0]).cross(e.subVectors(P3[2], P3[0])); const ln = n.length(); if (ln > 1e-12) n.multiplyScalar(1 / ln);
        const l = Math.hypot(n.x, n.z); let tx = 1, tz = 0, bx = 0, by = 0, bz = 1;
        if (ln > 1e-12 && Math.abs(n.y) < 0.9 && l > 1e-6) { tx = n.z / l; tz = -n.x / l; bx = n.y * tz; by = n.z * tx - n.x * tz; bz = -n.y * tx; }
        for (let k = 0; k < 3; k++) { const v = P3[k]; uv[(i + k) * 2] = (v.x * tx + v.z * tz) * 2.6; uv[(i + k) * 2 + 1] = (v.x * bx + v.y * by + v.z * bz) * 2.6; } }
      g2.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); uvCache.set(g0, g2); return g2; };
    let skinned = false;
    const skin = () => { scene.traverse((o) => { if (!o.isMesh || !o.material || Array.isArray(o.material)) return; const m2 = SKIN[o.material.name]; if (m2) { o.geometry = faceUV(o.geometry); o.material = m2; skinned = true; } }); };

    const lr = site.parts.find((p) => p.type === 'lrrr'), LR = new THREE.Vector3(lr.e, 0.05, -lr.n);
    // a soft ring around the reflector, and the laser light it sends back the way it came
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.72, 64), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    ring.rotation.x = -Math.PI / 2; ring.position.copy(LR); ring.renderOrder = 2; scene.add(ring);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 900, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0x7dffb0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const up = new THREE.Vector3(-0.32, 1, 0.1).normalize(); beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up); beam.position.copy(LR).addScaledVector(up, 450); scene.add(beam);
    const H0 = new THREE.Vector3(60, 520, -50), A0 = new THREE.Vector3(10.8, 1.5, -8.7), A1 = new THREE.Vector3(9.5, 1.62, -7.6), B1 = new THREE.Vector3(17, 12.5, -22);
    const L0 = new THREE.Vector3(0, 2.2, 0), L1 = new THREE.Vector3(lr.e * 0.5, 0.6, -lr.n * 0.5);
    const pos = new THREE.Vector3(), look = new THREE.Vector3(), W = E.clone().negate(), tgt = U.clone().multiplyScalar(RMOON);
    let w = 0, h = 0;
    return {
      draw(raw) {
        const Wd = c3.clientWidth, Hd = c3.clientHeight;
        if (Wd !== w || Hd !== h) { w = Wd; h = Hd; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); renderer.setSize(Wd, Hd, false); camera.aspect = Wd / Hd; camera.fov = Wd < Hd ? 54 : 38; }
        if (raw < PRE) {                                                         // falling towards the Moon
          const k = ease(raw / PRE), alt = 16000 * Math.pow(420 / 16000, k), a = 0.6 * (1 - k);
          pos.copy(U).multiplyScalar(Math.cos(a)).addScaledVector(W, Math.sin(a) * 0.8).addScaledVector(N, Math.sin(a) * 0.6).normalize().multiplyScalar(RMOON + alt);
          camera.near = Math.max(1, alt * 0.05); camera.far = 3e5; camera.updateProjectionMatrix();
          camera.up.copy(N); camera.position.copy(pos); camera.lookAt(tgt);
          renderer.render(sceneA, camera); return;
        }
        const t = raw - PRE;
        if (!skinned) skin();
        camera.near = 0.1; camera.far = 6000; camera.updateProjectionMatrix(); camera.up.set(0, 1, 0);
        const k = seg(t, 5.6, 12), dk = ease(ease(t / 3.4));
        pos.lerpVectors(A0, A1, clamp((t - 3) / 3.4)); pos.lerpVectors(H0, pos, dk).lerp(B1, k); look.lerpVectors(L0, L1, k);
        camera.position.copy(pos); camera.lookAt(look);
        if (window.__opCam) { const c = window.__opCam; camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); }   // (for checking the model from any side)
        ring.material.opacity = 0.75 * seg(t, 7.2, 8.4) * (0.75 + 0.25 * Math.sin(t * 4)); ring.scale.setScalar(1 + 0.06 * Math.sin(t * 4));
        beam.material.opacity = 0.55 * seg(t, 8.6, 9.6);
        renderer.render(scene, camera);
      },
      dispose() { renderer.dispose(); for (const g2 of uvCache.values()) g2.dispose(); for (const sc of [scene, sceneA]) sc.traverse((o) => { if (o.isInstancedMesh || o.isPoints || o === ground) o.geometry.dispose(); }); },
    };
  }

  // ---------------------------------------------------------------- part 2: the map of everything left behind
  function buildMap() {
    const now = Date.now(), date = new Date(now), rad = Math.PI / 180;
    const at = (au, lonDeg) => { const r = RF(au); return [r * Math.cos(lonDeg * rad), -r * Math.sin(lonDeg * rad)]; };
    const helio = (body) => { const v = A.HelioVector(body, date); return [Math.hypot(v.x, v.y, v.z), A.EclipticLongitude(body, date)]; };
    const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map((n) => { const [au, lon] = n === 'Earth' ? (() => { const v = A.HelioVector(A.Body.Earth, date); const e = A.Rotation_EQJ_ECL(); const p = A.RotateVector(e, v); return [Math.hypot(p.x, p.y, p.z), Math.atan2(p.y, p.x) / rad]; })() : helio(A.Body[n]); return { n, au, p: at(au, lon) }; });
    const earth = planets[2].p, mars = planets[3].p;
    const ml = A.EclipticGeoMoon(date).lon * rad, moon = [earth[0] + 215 * Math.cos(ml), earth[1] - 215 * Math.sin(ml)];
    const RM = 26, RE = 62, RMA = 44;
    const lights = [];
    const wrap = (l) => ((l + 540) % 360) - 180;
    for (const q of EQUIPMENT) {
      const lon = wrap(q.lon) * rad, lat = q.lat * rad, onMoon = q.body === 'moon';
      const u = onMoon ? [0.93 * Math.cos(lat) * Math.sin(lon), -0.93 * Math.sin(lat)] : [0.9 * Math.cos(lat) * Math.sin(lon / 2), -0.9 * Math.sin(lat)];
      lights.push({ body: onMoon ? 'moon' : 'mars', u, when: Date.parse(q.arrival), grp: onMoon ? 0 : 1, lit: ['active', 'in-use'].includes(stateAt(q, now)) });
    }
    const v = new THREE.Vector3(); let nearE = 0;
    for (const q of PROBES) {
      q.at(now, v); const au = v.length() / AU_KM, lon = Math.atan2(-v.z, v.x) / rad; let p = at(au, lon);
      let near = null;
      if (Math.hypot(p[0] - earth[0], p[1] - earth[1]) < 150) { const a = (40 + 115 * nearE++) * rad; near = [Math.cos(a), -Math.sin(a)]; }   // Hubble, Webb, Kepler: beside the Earth
      lights.push({ p, near, when: q.launchMs, grp: 2, lit: ['active', 'in-use'].includes(stateAt(q, now)) });
    }
    // each group lights up in the order things really happened, while its part of the map is on screen
    const win = [[12.4, 16.2], [17.2, 19.8], [20.4, 23.6]];
    for (let gi = 0; gi < 3; gi++) { const L = lights.filter((l) => l.grp === gi).sort((a, b) => a.when - b.when); L.forEach((l, i) => { l.on = lerp(win[gi][0], win[gi][1], L.length > 1 ? i / (L.length - 1) : 0); }); }
    lights.sort((a, b) => a.on - b.on);
    const silent = lights.filter((l) => !l.lit); silent.forEach((l, i) => { l.off = 24.6 + 3.6 * i / Math.max(1, silent.length - 1); });
    const far = Math.max(...lights.filter((l) => l.p).map((l) => Math.hypot(l.p[0], l.p[1])));
    const stars = Array.from({ length: 260 }, () => [Math.random(), Math.random(), 0.2 + Math.random() * 0.6]);
    return { ml, planets, earth, mars, moon, RM, RE, RMA, lights, far, stars, total: lights.length, working: lights.length - silent.length };
  }

  function drawMap(t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), W = cm.clientWidth, H = cm.clientHeight;
    if (cm.width !== Math.round(W * dpr) || cm.height !== Math.round(H * dpr)) { cm.width = Math.round(W * dpr); cm.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const m = map, min = Math.min(W, H);
    // the camera: close on the Moon, then Earth and Moon, then out to Mars, then everything
    const mid = [(m.earth[0] + m.moon[0]) / 2, (m.earth[1] + m.moon[1]) / 2], inner = [(m.earth[0] + m.mars[0]) / 4, (m.earth[1] + m.mars[1]) / 4];
    const keys = [[12, m.moon, 0.33 * min / m.RM], [16.6, mid, 0.3 * min / 215], [20.2, inner, 0.44 * min / (RF(1.7) + 60)], [24, [0, 0], 0.46 * min / m.far]];
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const a = keys[i], b = keys[i + 1], k = seg(t, a[0], b[0]);
    const sc = Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), k)), kc = (1 / sc - 1 / a[2]) / (1 / b[2] - 1 / a[2]);
    const cx = lerp(a[1][0], b[1][0], kc), cy = lerp(a[1][1], b[1][1], kc);
    const X = (p) => W / 2 + (p[0] - cx) * sc, Y = (p) => H / 2 + (p[1] - cy) * sc;
    const dim = 1 - 0.5 * seg(t, 28.6, 30);                                   // the map steps back for the title
    g.globalAlpha = dim;
    for (const [x, y, br] of m.stars) { g.fillStyle = `rgba(190,210,240,${br * 0.5})`; g.fillRect(x * W, y * H, 1.2, 1.2); }
    // orbits and planets
    g.lineWidth = 1;
    for (const pl of m.planets) { g.strokeStyle = 'rgba(140,165,200,0.16)'; g.beginPath(); g.arc(X([0, 0]), Y([0, 0]), RF(pl.au) * sc, 0, 6.2832); g.stroke(); }
    // far out, the three worlds that carry lights keep a readable size (the map is a diagram by then)
    const rM = Math.max(m.RM * sc, 13), rE = Math.max(m.RE * sc, 12), rMa = Math.max(m.RMA * sc, 17);
    const E = [X(m.earth), Y(m.earth)], MA = [X(m.mars), Y(m.mars)], dM = Math.max(215 * sc, 36), MO = [E[0] + dM * Math.cos(m.ml), E[1] - dM * Math.sin(m.ml)];
    const disc = (p, r, c0, c1, glow, px) => {
      const x = px ? p[0] : X(p), y = px ? p[1] : Y(p), rr = px ? r : Math.max(r * sc, 1.6);
      if (x < -rr - 80 || x > W + rr + 80 || y < -rr - 80 || y > H + rr + 80) return;
      if (glow) { const gg = g.createRadialGradient(x, y, rr * 0.4, x, y, rr * 3.2); gg.addColorStop(0, glow); gg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gg; g.beginPath(); g.arc(x, y, rr * 3.2, 0, 6.2832); g.fill(); }
      const gr = g.createRadialGradient(x - rr * 0.35, y - rr * 0.35, rr * 0.1, x, y, rr); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 6.2832); g.fill();
    };
    disc([0, 0], 70, '#fff6d8', '#ffb44a', 'rgba(255,190,90,0.35)');
    const col = { Mercury: ['#b9b2a8', '#6f6a63'], Venus: ['#f0d9a4', '#a98a52'], Jupiter: ['#e6cba6', '#96714a'], Saturn: ['#ecd9a6', '#9c8552'], Uranus: ['#bfe9ee', '#5c9aa3'], Neptune: ['#9db6ff', '#3c57b0'] };
    const spr = (key, x, y, rr, c0, c1, glow) => {
      const sp = SPR[key];
      if (!sp) { disc([x, y], rr, c0, c1, glow, true); return; }
      if (x < -rr * 3 || x > W + rr * 3 || y < -rr * 3 || y > H + rr * 3) return;
      if (glow) { const gg = g.createRadialGradient(x, y, rr * 0.6, x, y, rr * 2.6); gg.addColorStop(0, glow); gg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gg; g.beginPath(); g.arc(x, y, rr * 2.6, 0, 6.2832); g.fill(); }
      g.drawImage(sp, x - rr, y - rr, rr * 2, rr * 2);
    };
    const ringArc = (x, y, rr, a0, a1) => { g.save(); g.translate(x, y); g.rotate(-0.4); g.strokeStyle = 'rgba(222,205,160,0.62)'; g.lineWidth = rr * 0.4; g.beginPath(); g.ellipse(0, 0, rr * 1.95, rr * 0.6, 0, a0, a1); g.stroke(); g.restore(); };
    const MINR = { Mercury: 4, Venus: 5.5, Jupiter: 14, Saturn: 11, Uranus: 8, Neptune: 8 };
    for (const pl of m.planets) if (col[pl.n]) {
      const x = X(pl.p), y = Y(pl.p), rr = Math.max((pl.au > 4 ? 46 : 22) * sc, MINR[pl.n]), ring = pl.n === 'Saturn';
      if (ring) ringArc(x, y, rr, Math.PI, 2 * Math.PI);                       // the far half of the rings, behind the planet
      spr(pl.n.toLowerCase(), x, y, rr, col[pl.n][0], col[pl.n][1]);
      if (ring) ringArc(x, y, rr, 0, Math.PI);
    }
    spr('earth', E[0], E[1], rE, '#a8d8ff', '#1f5fa8', 'rgba(90,160,255,0.2)');
    spr('mars', MA[0], MA[1], rMa, '#f0a070', '#8a3b1c');
    spr('moon', MO[0], MO[1], rM, '#e4e2de', '#77736d');
    // names, once each world is small enough to need one
    g.font = '600 12px "Archivo Narrow", system-ui, sans-serif'; g.textAlign = 'center';
    const name = (c, r, s, a) => { if (a <= 0.02) return; g.fillStyle = `rgba(170,190,215,${a})`; g.fillText(s, c[0], c[1] + r + 15); };
    name(MO, rM, 'MOON', seg(t, 13.5, 15)); name(E, rE, 'EARTH', seg(t, 15.5, 17)); name(MA, rMa, 'MARS', seg(t, 17.5, 19));
    // the lights
    let n = 0;
    for (const l of m.lights) {
      if (t < l.on) continue; n++;
      const br = l.body === 'moon' ? rM : l.body === 'mars' ? rMa : 0, c = l.body === 'moon' ? MO : MA;
      const x = l.body ? c[0] + l.u[0] * br : l.near ? E[0] + l.near[0] * Math.max(110 * sc, rE + 13) : X(l.p), y = l.body ? c[1] + l.u[1] * br : l.near ? E[1] + l.near[1] * Math.max(110 * sc, rE + 13) : Y(l.p);
      const gl = l.body ? clamp(br * 0.42, 3.2, 15) : 13, dot = l.body ? clamp(br * 0.1, 1.25, 3.1) : 2.8;
      const born = t - l.on, gone = l.off ? clamp((t - l.off) / 0.9) : 0;
      const pulse = l.lit && t > 24 ? 0.75 + 0.25 * Math.sin(t * 3.2 + l.on * 9) : 1;
      if (gone < 1) { const R1 = gl * pulse * (l.lit && t > 30 ? 1.3 : 1), gg = g.createRadialGradient(x, y, 0, x, y, R1); gg.addColorStop(0, `rgba(255,205,110,${0.55 * (1 - gone)})`); gg.addColorStop(1, 'rgba(255,205,110,0)'); g.fillStyle = gg; g.beginPath(); g.arc(x, y, R1, 0, 6.2832); g.fill(); }
      if (born < 0.9) { g.strokeStyle = `rgba(255,220,150,${0.8 * (1 - born / 0.9)})`; g.lineWidth = 1.4; g.beginPath(); g.arc(x, y, dot + born * gl * 1.7, 0, 6.2832); g.stroke(); }
      g.fillStyle = gone > 0 ? (gone >= 1 ? GREY : `rgba(${Math.round(lerp(255, 86, gone))},${Math.round(lerp(210, 96, gone))},${Math.round(lerp(122, 110, gone))},1)`) : GOLD;
      g.beginPath(); g.arc(x, y, gone >= 1 ? dot * 0.8 : dot, 0, 6.2832); g.fill();
    }
    g.globalAlpha = 1;
    return n;
  }

  // ---------------------------------------------------------------- the 40 seconds
  function frame(nowMs) {
    if (!open) return;
    raf = requestAnimationFrame(frame);
    const raw = hold != null ? hold : (nowMs - t0) / 1000, t = raw - PRE;                          // t: the film proper, after the fall to the Moon
    if (t >= LEN + 0.9) { finish(); return; }
    const fadeIn = seg(raw, 0, 1.4), cross = seg(t, 11.2, 12.4), dip = 1 - 0.92 * Math.max(0, 1 - Math.abs(raw - PRE) / 0.45);
    c3.style.opacity = (fadeIn * dip * (1 - cross)).toFixed(3); cm.style.opacity = cross.toFixed(3);
    if (t < 12.5 && R) R.draw(raw); else if (R) { R.dispose(); R = null; }
    let n = 0; if (t > 11) n = drawMap(Math.max(12, t));
    // words
    let ci = -1; CAPS.forEach((c, i) => { if (t >= c[0] && t < c[1]) ci = i; });
    if (ci !== capI) { capI = ci; const cap = $('.op-cap'); cap.classList.remove('on'); if (ci >= 0) { cap.textContent = CAPS[ci][2]; cap.style.animationDuration = `${CAPS[ci][1] - CAPS[ci][0]}s`; void cap.offsetWidth; cap.classList.add('on'); } }
    $('.op-place').classList.toggle('on', t > 2.2 && t < 10.8);
    $('.op-film').style.opacity = (seg(t, 2.6, 3.6) * (1 - cross)).toFixed(3);
    const cnt = $('.op-count'); cnt.hidden = t < 12.2 || t > 37.6; cnt.style.opacity = (1 - seg(t, 28.6, 30) * 0.45).toFixed(2);
    const ch = t < 26.5 ? `Left behind <b>${n}</b><em>sites and probes</em>` : `Left behind <b>${map.total}</b><em>sites and probes</em><i>still working or in use <b>${map.working}</b></i>`;
    if (ch !== cntHtml) { cntHtml = ch; cnt.innerHTML = ch; }
    $('.op-fine').classList.toggle('on', t > 21 && t < 28.6);
    const title = $('.op-title'); title.classList.toggle('on', t > 29); title.classList.toggle('h', t > 31.4); title.classList.toggle('turn', t > 38);
    if (t > 38) $('.op-year').textContent = Math.round(lerp(new Date().getUTCFullYear(), 1958, ease((t - 38) / 1.7)));
    el.style.opacity = (1 - seg(t, LEN, LEN + 0.9)).toFixed(3);
  }

  function finish() {
    if (!open) return;
    open = false; cancelAnimationFrame(raf); if (R) { R.dispose(); R = null; }
    el.hidden = true; el.style.opacity = ''; map = null;
    const fn = done; done = null; if (fn) fn();
  }
  $('.op-skip').addEventListener('click', finish);
  window.addEventListener('keydown', (e) => { if (open && e.key === 'Escape') { e.stopPropagation(); finish(); } }, true);

  return {
    get isOpen() { return open; },
    /** plays the film once; onDone runs when it ends or is skipped */
    play(onDone) {
      if (open) return;
      done = onDone;
      try { map = buildMap(); loadWorlds(map); R = build3d(); } catch (e) { console.warn('opening film failed', e); R = null; map = null; done = null; onDone(); return; }
      open = true; hold = null; capI = -2; cntHtml = ''; el.hidden = false; el.style.opacity = '1'; c3.style.opacity = '0'; cm.style.opacity = '0';
      $('.op-place span').textContent = new Date().getUTCFullYear(); $('.op-year').textContent = new Date().getUTCFullYear();
      ['.op-title', '.op-cap', '.op-place', '.op-fine'].forEach((s) => $(s).classList.remove('on', 'h', 'turn'));
      t0 = performance.now(); raf = requestAnimationFrame(frame);
    },
    skip: finish,
    eventTitle() {},
    seek(sec) { t0 = performance.now() - sec * 1000; },
    freeze(sec) { hold = sec; },                        // (for checking one moment of the film)
  };
}
