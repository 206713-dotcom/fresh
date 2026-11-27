// Surface close-up for one selected site: a curved ground patch that blends into the global
// map, scattered rocks, and the hardware models. Everything is a child of the body mesh, so it
// rotates with the body; vertex coordinates are local metres, so they stay precise.

import * as THREE from 'three';
import { localFromLatLon, latLonFromLocal } from '../sim/ephemeris.js';
import { SITE_ALT_KM } from '../camera/targets.js';
import { routeOf } from '../../data/routes.js';
import { buildPart } from './models.js';

const PATCH_RADIUS_M = 15000;
const RINGS = [0, 0.6, 1.5, 3, 5, 8, 12, 18, 26, 38, 55, 80, 115, 165, 240, 340, 480, 680, 950, 1300, 1800, 2500, 3400, 4600, 6200, 8200, 10500, 12800, 15000];
const SEGS = 128;

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h |= 0; h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

const samplers = new Map();
function albedoSampler(tex) {
  if (samplers.has(tex)) return samplers.get(tex);
  const img = tex.image;
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const { data, width: w, height: h } = g.getImageData(0, 0, c.width, c.height);
  const px = (x, y, k) => data[((y * w) + x) * 4 + k] / 255;
  const fn = (lat, lon) => {
    const u = ((lon + 180) / 360) * w - 0.5, v = ((90 - lat) / 180) * h - 0.5;
    const x0 = Math.floor(u), y0 = Math.max(0, Math.min(h - 1, Math.floor(v)));
    const fx = u - x0, fy = Math.min(1, Math.max(0, v - y0));
    const xa = ((x0 % w) + w) % w, xb = (xa + 1) % w, yb = Math.min(h - 1, y0 + 1);
    const out = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      const a = px(xa, y0, k) * (1 - fx) + px(xb, y0, k) * fx;
      const b = px(xa, yb, k) * (1 - fx) + px(xb, yb, k) * fx;
      out[k] = a * (1 - fy) + b * fy;
    }
    return out;
  };
  samplers.set(tex, fn);
  return fn;
}

// Tileable regolith detail (albedo multiplier, linear, mean ~0.78).
let detailTex = null;
export function regolithDetail() {
  if (detailTex) return detailTex;
  const S = 512, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const rnd = seeded('regolith');
  // periodic value noise
  const N = 32, grid = Array.from({ length: N * N }, () => rnd());
  const img = g.createImageData(S, S);
  const val = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const at = (i, j) => grid[(((j % N) + N) % N) * N + (((i % N) + N) % N)];
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return (at(xi, yi) * (1 - sx) + at(xi + 1, yi) * sx) * (1 - sy) + (at(xi, yi + 1) * (1 - sx) + at(xi + 1, yi + 1) * sx) * sy;
  };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let v = 0, amp = 0.5, f = N / S;
    for (let o = 0; o < 4; o++) { v += amp * val(x * f, y * f); amp *= 0.5; f *= 2; }
    const n = 0.62 + 0.32 * v + (rnd() - 0.5) * 0.10;
    const i = (y * S + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, n * 255));
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // small craters and pebbles, drawn wrapped so the tile stays seamless
  const wrapDraw = (fn) => { for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) fn(dx, dy); };
  for (let i = 0; i < 70; i++) {
    const x = rnd() * S, y = rnd() * S, r = 3 + Math.pow(rnd(), 3) * 26;
    wrapDraw((dx, dy) => {
      const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      gr.addColorStop(0, 'rgba(0,0,0,0.16)'); gr.addColorStop(0.75, 'rgba(0,0,0,0.05)');
      gr.addColorStop(0.9, 'rgba(255,255,255,0.10)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x + dx, y + dy, r, 0, Math.PI * 2); g.fill();
    });
  }
  for (let i = 0; i < 900; i++) {
    const x = rnd() * S, y = rnd() * S, r = 0.4 + rnd() * 1.4;
    g.fillStyle = `rgba(255,255,255,${0.10 + rnd() * 0.25})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  detailTex = new THREE.CanvasTexture(c);
  detailTex.wrapS = detailTex.wrapT = THREE.RepeatWrapping;
  detailTex.colorSpace = THREE.NoColorSpace;
  detailTex.anisotropy = 8;
  return detailTex;
}

export class SiteView {
  constructor(views) {
    this.views = views;
    this.current = null;     // { eq, anchor, patch, parts, rocks }
  }

  clear() {
    if (!this.current) return;
    const { anchor } = this.current;
    anchor.parent?.remove(anchor);
    anchor.traverse((o) => { if (o.geometry && o.userData.disposable) o.geometry.dispose(); });
    this.current = null;
  }

  show(eq, eph) {
    if (this.current && this.current.eq === eq) return;
    this.clear();
    const bodyMesh = this.views.meshes[eq.body];
    const R = eph[eq.body].radius;
    const tex = eq.body === 'moon' ? this.views.textures.moon : this.views.textures.mars;
    const sample = tex.image ? albedoSampler(tex) : () => [0.5, 0.5, 0.5];

    // Anchor: mesh-local frame at the site (x east, y up, z south), scaled metres -> km.
    const anchor = new THREE.Group();
    const up = localFromLatLon(eq.lat, eq.lon, 1).normalize();
    const east = new THREE.Vector3(0, 1, 0).cross(up);
    if (east.lengthSq() < 1e-12) east.set(1, 0, 0);
    east.normalize();
    const north = up.clone().cross(east).normalize();
    const basis = new THREE.Matrix4().makeBasis(east, up, north.clone().negate());
    anchor.quaternion.setFromRotationMatrix(basis);
    anchor.position.copy(up).multiplyScalar(R + SITE_ALT_KM);
    anchor.scale.setScalar(0.001);
    bodyMesh.add(anchor);
    anchor.updateMatrix();

    // --- ground patch
    const Rm = R * 1000;
    const nV = RINGS.length * (SEGS + 1);
    const pos = new Float32Array(nV * 3), nor = new Float32Array(nV * 3), uv = new Float32Array(nV * 2), col = new Float32Array(nV * 4);
    const v = new THREE.Vector3(), boost = eq.body === 'moon' ? 1.08 : 1.28;      // the Moon's dust is dark (about 12% reflectance): keep high Sun from washing it white
    let k = 0;
    for (let i = 0; i < RINGS.length; i++) {
      const r = RINGS[i];
      const drop = Rm - Math.sqrt(Rm * Rm - r * r);
      const alpha = 1 - THREE.MathUtils.smoothstep(r, PATCH_RADIUS_M * 0.45, PATCH_RADIUS_M);
      for (let j = 0; j <= SEGS; j++, k++) {
        const a = (j / SEGS) * Math.PI * 2;
        const x = r * Math.cos(a), z = r * Math.sin(a), y = -drop;
        pos.set([x, y, z], k * 3);
        v.set(x, y + Rm, z).normalize();
        nor.set([v.x, v.y, v.z], k * 3);
        uv.set([x / 90, z / 90], k * 2);
        // colour from the global map at this vertex's lat/lon
        v.set(x, y, z).applyMatrix4(anchor.matrix);
        const ll = latLonFromLocal(v);
        const [cr, cg, cb] = sample(ll.lat, ll.lon);
        const c = new THREE.Color().setRGB(cr, cg, cb, THREE.SRGBColorSpace);
        col.set([c.r * boost, c.g * boost, c.b * boost, alpha], k * 4);
      }
    }
    const idx = [];
    for (let i = 0; i < RINGS.length - 1; i++) for (let j = 0; j < SEGS; j++) {
      const a = i * (SEGS + 1) + j, b = a + SEGS + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
    geo.setIndex(idx);
    const patchMat = new THREE.MeshStandardMaterial({
      vertexColors: true, map: regolithDetail(), roughness: 1, metalness: 0, transparent: true,
    });
    const patch = new THREE.Mesh(geo, patchMat);
    patch.receiveShadow = true;
    patch.userData.disposable = true;
    anchor.add(patch);

    // --- rocks
    const rnd = seeded(eq.id);
    const nRocks = eq.body === 'mars' ? 1100 : 420;
    // irregular rocks: a lumpy, flat-bottomed stone instead of a perfect polyhedron
    const rockGeo = new THREE.IcosahedronGeometry(1, 1), rp = rockGeo.attributes.position, rv = new THREE.Vector3();
    const lump = (x, y, z) => { const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return h - Math.floor(h); };
    for (let i = 0; i < rp.count; i++) {
      rv.fromBufferAttribute(rp, i);
      const f = 0.72 + 0.5 * lump(Math.round(rv.x * 1e3), Math.round(rv.y * 1e3), Math.round(rv.z * 1e3));
      rv.multiplyScalar(f); rv.y = Math.max(rv.y, -0.35);
      rp.setXYZ(i, rv.x, rv.y, rv.z);
    }
    rockGeo.computeVertexNormals();
    const rockMat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, nRocks);
    rocks.castShadow = true; rocks.receiveShadow = true;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const keepOut = eq.keepOut ?? 7;
    const [br, bg, bb] = sample(eq.lat, eq.lon);
    const base = new THREE.Color().setRGB(br, bg, bb, THREE.SRGBColorSpace).multiplyScalar(boost);
    for (let i = 0; i < nRocks; i++) {
      let x, z;
      do { const a = rnd() * Math.PI * 2, r = keepOut + Math.pow(rnd(), 0.7) * 140; x = Math.cos(a) * r; z = Math.sin(a) * r; }
      while (Math.hypot(x, z) < keepOut);
      const sz = 0.03 + Math.pow(rnd(), 7) * (eq.body === 'mars' ? 0.9 : 0.6);
      p.set(x, sz * 0.25, z);
      q.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
      s.set(sz * (0.8 + rnd() * 0.5), sz * (0.5 + rnd() * 0.4), sz * (0.8 + rnd() * 0.5));
      rocks.setMatrixAt(i, m4.compose(p, q, s));
      rocks.setColorAt(i, base.clone().multiplyScalar(0.75 + rnd() * 0.35));
    }
    anchor.add(rocks);

    // --- hardware
    const parts = new THREE.Group();
    for (const part of eq.parts || []) if (!part.exhibitOnly) parts.add(buildPart(part, rnd));   // exhibitOnly: shown in the 3D viewer, not left at the site
    anchor.add(parts);

    // --- the real route of a rover or of the helicopter (NASA waypoints), drawn on the ground
    let route = null;
    const R0 = eq.route && routeOf(eq.route);
    if (R0) {
      const n = R0.pts.length, X = new Float32Array(n), Yv = new Float32Array(n), Z = new Float32Array(n), M = new Float32Array(n), SOL = new Float32Array(n);
      const d2r = Math.PI / 180, c0 = Math.cos(eq.lat * d2r), line = new Float32Array(n * 3);
      R0.pts.forEach((p, i) => {
        const e = Rm * c0 * (p.lon - eq.lon) * d2r, nn = Rm * (p.lat - eq.lat) * d2r, r2 = e * e + nn * nn;
        X[i] = e; Z[i] = -nn; Yv[i] = -(Rm - Math.sqrt(Rm * Rm - r2)); M[i] = p.m; SOL[i] = p.sol;
        line.set([e, Yv[i] + 0.5, -nn], i * 3);
      });
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(line, 3));
      const color = eq.route === 'ingenuity' ? 0xc9b3ff : 0x7fdcff;
      const all = new THREE.Line(lg, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }));
      const done = new THREE.Line(lg.clone(), new THREE.LineBasicMaterial({ color }));
      all.frustumCulled = done.frustumCulled = false; all.userData.disposable = done.userData.disposable = true;
      anchor.add(all); anchor.add(done);
      route = { X, Y: Yv, Z, M, SOL, n, all, done, def: R0, hop: eq.route === 'ingenuity' };
    }
    this.roverKm = new THREE.Vector3(); this.routeNow = null; this.driveM = null;

    this.current = { eq, anchor, patch, rocks, parts, route };
  }

  /** Fade the patch with distance and hide small things when far away. */
  update(distKm, ms) {
    if (!this.current) return;
    const { patch, rocks, parts, eq } = this.current;
    const near = distKm < 4;
    rocks.visible = near;
    parts.visible = distKm < 25 && ms >= Date.parse(eq.arrival);   // nothing there before it lands
    patch.material.opacity = 1 - THREE.MathUtils.smoothstep(distKm, 40, 110);
    patch.visible = patch.material.opacity > 0.01;
    const rt = this.current.route;
    if (rt) {
      const arrived = ms >= Date.parse(eq.arrival);
      rt.all.visible = rt.done.visible = arrived && distKm < 600;
      const solNow = (ms - rt.def.sol0) / rt.def.solMs;
      const m = this.driveM != null ? this.driveM : this._metresAtSol(rt, solNow);
      // which stretch of the route are we on?
      let i = 0; while (i < rt.n - 2 && rt.M[i + 1] < m) i++;
      const span = rt.M[i + 1] - rt.M[i], f = span > 0 ? Math.max(0, Math.min(1, (m - rt.M[i]) / span)) : 1;
      const x = rt.X[i] + (rt.X[i + 1] - rt.X[i]) * f, z = rt.Z[i] + (rt.Z[i + 1] - rt.Z[i]) * f;
      let y = rt.Y[i] + (rt.Y[i + 1] - rt.Y[i]) * f;
      if (rt.hop && f > 0 && f < 1) y += Math.sin(Math.PI * f) * 10;             // the helicopter flies its hops about 10 m up
      const main = parts.children[0];
      const dx = rt.X[i + 1] - rt.X[i], dz = rt.Z[i + 1] - rt.Z[i];
      if (dx * dx + dz * dz > 1) rt.yaw = Math.atan2(dx, dz) + (eq.routeYaw || 0);
      rt.pose = [x, y, z];
      this.applyRoute();
      this.roverKm.set(x / 1000, y / 1000, z / 1000);
      this.routeNow = { m, sol: this.driveM != null ? rt.SOL[i] + (rt.SOL[i + 1] - rt.SOL[i]) * f : Math.min(solNow, rt.def.lastSol), total: rt.def.total, sol0: rt.def.sol0, solMs: rt.def.solMs, lastSol: rt.def.lastSol };
      rt.done.geometry.setDrawRange(0, Math.min(rt.n, i + 2));
    }
  }

  /** Put the rover where the route says. Called again after the scene player, which otherwise parks every model at its landing spot. */
  applyRoute() {
    const cur = this.current, rt = cur && cur.route, main = cur && cur.parts.children[0];
    if (!rt || !rt.pose || !main) return;
    main.position.set(rt.pose[0], rt.pose[1], rt.pose[2]);
    if (rt.yaw != null) main.rotation.y = rt.yaw;
  }

  /** How far along its route the rover was on a given sol: it stays parked, then drives on the sol the next waypoint is dated. */
  _metresAtSol(rt, sol) {
    if (sol <= rt.SOL[0]) return rt.M[0];
    if (sol >= rt.SOL[rt.n - 1]) return rt.M[rt.n - 1];
    let i = 0; while (i < rt.n - 2 && rt.SOL[i + 1] <= sol) i++;
    const f = Math.max(0, Math.min(1, sol - (rt.SOL[i + 1] - 1)));
    return rt.M[i] + (rt.M[i + 1] - rt.M[i]) * f;
  }
}
