// Probes in flight (Pioneer, Voyager, Cassini, New Horizons) and the optional orbit lines.
//
// Each probe is registered on the ephemeris as a tiny pseudo-body (eph[id]), so the existing
// camera rig can fly to it and orbit it exactly like a planet: that is the "ride along" view.
// Positions are world kilometres at true scale, like everything else.

import * as THREE from 'three';
import * as A from '../../vendor/astronomy.js';
import { AU_KM, DEG, BODIES } from '../config.js';
import { BodyState, eqjToWorld } from '../sim/ephemeris.js';
import { PROBES } from '../../data/probes.js';
import { loadGLB } from './models.js';
import { newHorizons } from './hardware.js';
import { voyager } from './voyager.js';
import { webb } from './webb.js';

const DAY = 86400e3;
const ENUM = {
  mercury: A.Body.Mercury, venus: A.Body.Venus, earth: A.Body.Earth, mars: A.Body.Mars, jupiter: A.Body.Jupiter,
  saturn: A.Body.Saturn, uranus: A.Body.Uranus, neptune: A.Body.Neptune, pluto: A.Body.Pluto,
};
const UP = new THREE.Vector3(0, 1, 0);
const ZERO = new THREE.Vector3();

for (const p of PROBES) BODIES[p.id] = { id: p.id, name: p.name, radius: 0.004, color: p.color, orbitView: 5.5, probe: true };

function helio(bodyId, ms, out) {
  const v = A.HelioVector(ENUM[bodyId], A.MakeTime(new Date(ms)));
  return eqjToWorld(v.x, v.y, v.z, AU_KM, out);
}
const toPolar = (v) => { const r = v.length(); return { lon: Math.atan2(-v.z, v.x), lat: Math.asin(v.y / r), r }; };
const fromPolar = (lon, lat, r, out) => out.set(r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), -r * Math.cos(lat) * Math.sin(lon));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

/** Simplified flight path: right planet on the right day, interpolated in between. */
function makePath(p) {
  const TAU = Math.PI * 2, BUMP = 12 * DAY;
  const e0 = helio('earth', p.launchMs, new THREE.Vector3());
  const wps = [{ t: p.launchMs, ...toPolar(e0) }];
  const bumps = [{ t: p.launchMs, off: e0.clone().normalize().multiplyScalar(7000) }];   // start above Earth, not inside it
  const fly = [];
  for (const [body, iso, ca] of p.flybys) {
    const t = Date.parse(iso), c = helio(body, t, new THREE.Vector3());
    const w = { t, ...toPolar(c) };
    while (w.lon < wps[wps.length - 1].lon) w.lon += TAU;          // always travel prograde
    wps.push(w);
    // pass beside the planet at the real closest-approach distance (mostly "above" it, a little outward)
    const off = c.clone().normalize().multiplyScalar(0.35).addScaledVector(UP, 0.94).normalize().multiplyScalar(ca);
    bumps.push({ t, off });
    fly.push({ body, t, ca });
  }
  const last = wps[wps.length - 1];
  let lonF = p.lonF * DEG; while (lonF < last.lon) lonF += TAU;
  const dist = [[last.t, last.r], ...p.dist.map(([iso, au]) => [Date.parse(iso), au * AU_KM])];
  const at = (ms, out) => {
    if (ms <= last.t) {
      let i = 0; while (i < wps.length - 2 && ms > wps[i + 1].t) i++;
      const a = wps[i], b = wps[i + 1], f = Math.min(1, Math.max(0, (ms - a.t) / (b.t - a.t)));
      fromPolar(lerp(a.lon, b.lon, f), lerp(a.lat, b.lat, f), lerp(a.r, b.r, Math.pow(f, 1.25)), out);
    } else {
      let i = 0; while (i < dist.length - 2 && ms > dist[i + 1][0]) i++;
      const r = dist[i][1] + (dist[i + 1][1] - dist[i][1]) * (ms - dist[i][0]) / (dist[i + 1][0] - dist[i][0]);
      if (p.turns) {
        // it stays with a small world that keeps circling the Sun: so many turns by the end of 2035
        fromPolar(last.lon + TAU * p.turns * (ms - last.t) / (Date.UTC(2035, 11, 31) - last.t), last.lat * Math.max(0, 1 - (ms - last.t) / (400 * DAY)), r, out);
      } else {
      const f = smooth((ms - last.t) / (7 * 365.25 * DAY));
      fromPolar(lerp(last.lon, lonF, f), lerp(last.lat, p.latF * DEG, f), r, out);
      }
    }
    for (const b of bumps) { const w = Math.exp(-Math.pow((ms - b.t) / BUMP, 2)); if (w > 1e-4) out.addScaledVector(b.off, w); }
    return out;
  };
  return { at, fly };
}

// ---------------------------------------------------------------- simple models (metres)
const NASA_MODEL = { voyager: 'voyager', pioneer: 'pioneer', cassini: 'cassini', hst: 'hst', jwst: 'jwst', dawn: 'dawn', kepler: 'kepler', near: 'near' };

export function buildModel(type) {
  if (type === 'voyager') return voyager();       // rebuilt by hand, part by part, in its real materials (scene/voyager.js)
  if (type === 'jwst') {
    // Webb everywhere is the same hand-built model as in its featured animation (scene/webb.js). Turned so that its
    // sunshield faces the Sun: a probe's +z points at the Sun, and Webb's Sun is under the shield (-y).
    const g = new THREE.Group(), w = webb(); w.rotation.x = -Math.PI / 2; g.add(w); g.userData.webbUp = true; return g;
  }
  const g = new THREE.Group();
  if (NASA_MODEL[type]) {
    // The real spacecraft from NASA 3D Resources; the simple stand-in below is only used if it fails to load.
    loadGLB(NASA_MODEL[type]).then((m) => g.add(m)).catch((e) => { console.warn('probe model failed', type, e); g.add(buildSimple(type)); });
    return g;
  }
  if (type === 'nh' || type === 'newhorizons') return newHorizons();
  return buildSimple(type);
}

function buildSimple(type) {
  const g = new THREE.Group();
  const mat = (c, metal = 0.35, rough = 0.55) => new THREE.MeshStandardMaterial({ color: c, metalness: metal, roughness: rough, emissive: c, emissiveIntensity: 0.035 });
  const add = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.frustumCulled = false; g.add(o); return o; };
  const rod = (len, x, y, z, rz, c = 0xb9bcc4, r = 0.02) => { const o = add(new THREE.CylinderGeometry(r, r, len, 6), mat(c), x, y, z); o.rotation.z = rz; return o; };
  const dish = (radius) => {            // opens toward +z (toward the Sun and Earth)
    const m = mat(0xeeeae0, 0.1, 0.5); m.side = THREE.DoubleSide;
    const d = add(new THREE.SphereGeometry(radius * 1.25, 36, 10, 0, Math.PI * 2, 0, 0.93), m, 0, 0, radius * 0.9);
    d.rotation.x = -Math.PI / 2;
    add(new THREE.CylinderGeometry(0.03, 0.03, radius * 0.9, 6), mat(0xb9bcc4), 0, 0, radius * 0.55).rotation.x = Math.PI / 2;
    return d;
  };
  if (type === 'voyager') {
    dish(1.85);
    add(new THREE.CylinderGeometry(0.9, 0.9, 0.47, 10), mat(0xc79a3a, 0.7, 0.35), 0, 0, -0.5).rotation.x = Math.PI / 2;
    rod(2.6, 2.0, 0.5, -0.5, Math.PI / 2 - 0.25); add(new THREE.BoxGeometry(0.5, 0.7, 0.4), mat(0xd8d8d8), 3.2, 0.85, -0.5);
    add(new THREE.CylinderGeometry(0.2, 0.2, 1.6, 10), mat(0x3a3f4a), -2.0, -0.9, -0.5).rotation.z = Math.PI / 2 + 0.45;
    rod(13, -5.5, 3.2, -0.5, Math.PI / 2 + 0.55, 0x9aa3b2, 0.03);                    // magnetometer boom
    rod(10, 0, -0.5, -0.9, 0.55, 0xc9962e, 0.012); rod(10, 0, -0.5, -0.9, -0.55, 0xc9962e, 0.012);
  } else if (type === 'pioneer') {
    dish(1.37);
    add(new THREE.CylinderGeometry(0.7, 0.7, 0.36, 6), mat(0xc79a3a, 0.7, 0.35), 0, 0, -0.4).rotation.x = Math.PI / 2;
    rod(3.0, 1.7, 0.7, -0.4, Math.PI / 2 - 0.4); rod(3.0, -1.7, 0.7, -0.4, Math.PI / 2 + 0.4);
    add(new THREE.CylinderGeometry(0.15, 0.15, 0.7, 8), mat(0x3a3f4a), 3.1, 1.3, -0.4).rotation.z = Math.PI / 2 - 0.4;
    add(new THREE.CylinderGeometry(0.15, 0.15, 0.7, 8), mat(0x3a3f4a), -3.1, 1.3, -0.4).rotation.z = Math.PI / 2 + 0.4;
    rod(6.6, 0, -3.4, -0.4, 0, 0x9aa3b2, 0.03);
  } else if (type === 'nh') {
    dish(1.05);
    add(new THREE.CylinderGeometry(1.1, 1.1, 0.7, 3), mat(0xd6a531, 0.75, 0.3), 0, 0, -0.5).rotation.x = Math.PI / 2;
    add(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 10), mat(0x2a2d35), 0, -1.6, -0.5);
    add(new THREE.BoxGeometry(0.4, 0.4, 0.7), mat(0xd8d8d8), 0.7, 0.3, 0.0);
  } else {   // cassini
    dish(2.0);
    add(new THREE.CylinderGeometry(0.95, 0.95, 4.6, 12), mat(0xc9962e, 0.75, 0.3), 0, 0, -2.6).rotation.x = Math.PI / 2;
    rod(11, 3.5, 0.4, -2.0, Math.PI / 2, 0x9aa3b2, 0.03);
    add(new THREE.CylinderGeometry(1.3, 0.9, 1.0, 16), mat(0xb08a5a, 0.5, 0.4), -1.6, 0, -2.4).rotation.z = Math.PI / 2;   // Huygens
    add(new THREE.CylinderGeometry(0.35, 0.6, 0.9, 10), mat(0x6a6f7a), 0, 0, -5.3).rotation.x = Math.PI / 2;
  }
  return g;
}

export class ProbeFleet {
  constructor(scene, eph) {
    this.eph = eph;
    this.list = [];
    this.pathsVisible = false;
    const m4 = new THREE.Matrix4(), tmp = new THREE.Vector3();
    for (const def of PROBES) {
      const st = new BodyState(def.id);
      st.isProbe = true; st.def = def; st.active = false; st.vel = new THREE.Vector3(1, 0, 0);
      const path = makePath(def);
      def.fly = path.fly; def.at = path.at;
      const orbit = def.orbit ? { ...def.orbit, fromMs: Date.parse(def.orbit.from) } : null;
      st.place = (ms, e) => {
        st.active = ms >= def.launchMs && !(def.endMs && ms >= def.endMs);
        if (ms < def.launchMs) { st.pos.copy(e.earth.pos).addScaledVector(tmp.copy(e.earth.pos).normalize(), 7000); return; }
        const t = def.endMs ? Math.min(ms, def.endMs) : ms;
        if (orbit && t >= orbitFromMs(orbit)) {
          const b = e[orbit.body], a = ((t - orbit.fromMs) / (orbit.periodDays * DAY)) * Math.PI * 2;
          // spiral in during the final days (the "Grand Finale")
          const fin = def.endMs ? smooth((t - (def.endMs - 3 * DAY)) / (3 * DAY)) : 0;
          const r = lerp(orbit.radius, b.radius * 1.0, fin);
          st.pos.set(Math.cos(a) * r, Math.sin(a) * r * 0.3, Math.sin(a) * r).add(b.pos);
        } else if (def.trail) {
          // an orbit a little slower than the Earth's: it follows the Earth around the Sun and slowly falls behind
          const lag = 2 * Math.PI * (1 / 365.256 - 1 / def.trail.periodDays) * (t - def.launchMs) / DAY;
          st.pos.copy(e.earth.pos).applyAxisAngle(UP, -lag).multiplyScalar(1.006);
          if (t - def.launchMs < 30 * DAY) st.pos.lerp(tmp.copy(e.earth.pos).addScaledVector(tmp.clone().normalize(), 7000), 1 - (t - def.launchMs) / (30 * DAY));
        } else if (def.l2) {
          // travels straight out from the Earth, away from the Sun, then stays there (the L2 point)
          const k = Math.pow(Math.min(1, Math.max(0, (t - def.launchMs) / (Date.parse(def.l2.arrive) - def.launchMs))), 0.45);      // fast at first, slowing all the way out, as it really did
          st.pos.copy(e.earth.pos).addScaledVector(tmp.copy(e.earth.pos).normalize(), lerp(7000, def.l2.km, k));
        } else path.at(t, st.pos);
        // dish faces the Sun (and so, from out here, the Earth)
        m4.lookAt(ZERO, st.pos, UP); st.quat.setFromRotationMatrix(m4);
        st.matrix.makeRotationFromQuaternion(st.quat); st.inv.copy(st.matrix).transpose();
      };
      const orbitFromMs = (o) => o.fromMs;
      st.distSunKm = () => st.pos.length();
      eph[def.id] = st;

      const group = new THREE.Group(); group.frustumCulled = false;
      const model = buildModel(def.model); model.scale.setScalar(0.001);    // metres -> km
      group.add(model); scene.add(group);

      // flight path: dense near launch, sparse far out
      const tEnd = def.l2 ? Date.parse(def.l2.arrive) : orbit ? orbit.fromMs : Date.UTC(2035, 11, 31), N = 1600;
      const pos = new Float32Array((N + 1) * 3), v = new THREE.Vector3();
      for (let i = 0; i <= N; i++) { if (def.l2 || !def.flybys.length) break; path.at(def.launchMs + (tEnd - def.launchMs) * Math.pow(i / N, 2), v); pos.set([v.x, v.y, v.z], i * 3); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mk = (g, opacity) => { const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity, depthWrite: false })); l.frustumCulled = false; l.visible = false; scene.add(l); return l; };
      const future = mk(geo, 0.28), past = mk(geo.clone(), 1.0);
      this.list.push({ def, st, group, past, future, N, tEnd });
    }
    eph.onUpdate = (ms, e) => { for (const p of this.list) p.st.place(ms, e); };
    eph.onUpdate(eph.ms, eph);
  }

  setPathsVisible(on) { this.pathsVisible = on; }

  /** Per-frame: put models and path lines into render space. */
  update(rig, ms) {
    for (const p of this.list) {
      p.group.visible = p.st.active;
      if (p.st.active) { rig.toRender(p.st.pos, p.group.position); p.group.quaternion.copy(rig.qv).multiply(p.st.quat); }
      // a little life: the Pioneers really spin (about 5 turns a minute, around the dish axis, to stay steady);
      // the others hold their aim and drift very slightly inside it, as real spacecraft do
      const m = p.st.active && p.group.children[0];
      if (m) {
        const t = performance.now() / 1000, ph = p.def.launchMs % 7;
        if (p.def.model === 'pioneer') m.rotation.z = t * 0.5;
        else { m.rotation.x = Math.sin(t * 0.21 + ph) * 0.012; m.rotation.y = Math.sin(t * 0.17 + ph * 2.0) * 0.012; }
      }
      const show = this.pathsVisible;
      p.future.visible = show; p.past.visible = show && ms >= p.def.launchMs;
      if (!show) continue;
      for (const l of [p.future, p.past]) { rig.toRender(ZERO, l.position); l.quaternion.copy(rig.qv); }
      const f = Math.min(1, Math.max(0, (ms - p.def.launchMs) / (p.tEnd - p.def.launchMs)));
      p.past.geometry.setDrawRange(0, Math.max(2, Math.floor(Math.sqrt(f) * p.N) + 1));
    }
  }
}

/** Orbit lines of the planets (around the Sun) and of the Moon (around the Earth). Built on first use. */
export class OrbitLines {
  constructor(scene, eph) {
    this.scene = scene; this.eph = eph; this.visible = false; this.lines = null;
  }

  _build() {
    this.lines = [];
    const J2000 = Date.UTC(2000, 0, 1, 12), v = new THREE.Vector3();
    for (const id of Object.keys(ENUM)) {
      const def = BODIES[id], N = id === 'pluto' ? 240 : 720, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { helio(id, J2000 + (i / N) * def.period * DAY, v); pos.set([v.x, v.y, v.z], i * 3); }
      this.lines.push({ line: this._line(pos, def.color, 0.6), around: null });
    }
    const N = 256, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const m = A.GeoVector(A.Body.Moon, A.MakeTime(new Date(this.eph.ms + (i / N) * 27.3217 * DAY)), false);
      eqjToWorld(m.x, m.y, m.z, AU_KM, v); pos.set([v.x, v.y, v.z], i * 3);
    }
    this.moon = { line: this._line(pos, BODIES.moon.color, 0.5), around: 'earth' };
    this.lines.push(this.moon); this.moonMs = this.eph.ms;
  }

  /** The Moon's orbit slowly turns, so its line is redrawn when the date has moved on. */
  _refreshMoon() {
    const N = 256, a = this.moon.line.geometry.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < N; i++) {
      const m = A.GeoVector(A.Body.Moon, A.MakeTime(new Date(this.eph.ms + (i / N) * 27.3217 * DAY)), false);
      eqjToWorld(m.x, m.y, m.z, AU_KM, v); a.setXYZ(i, v.x, v.y, v.z);
    }
    a.needsUpdate = true; this.moonMs = this.eph.ms;
  }

  _line(pos, color, opacity) {
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const l = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    l.frustumCulled = false; this.scene.add(l); return l;
  }

  setVisible(on) { this.visible = on; if (on && !this.lines) this._build(); if (this.lines) for (const o of this.lines) o.line.visible = on; }

  update(rig) {
    if (!this.visible || !this.lines) return;
    if (Math.abs(this.eph.ms - this.moonMs) > 40 * DAY) this._refreshMoon();
    for (const o of this.lines) { rig.toRender(o.around ? this.eph[o.around].pos : ZERO, o.line.position); o.line.quaternion.copy(rig.qv); }
  }
}
