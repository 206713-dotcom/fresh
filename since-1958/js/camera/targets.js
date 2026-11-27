// Destination poses for camera flights (pure functions of the ephemeris; no DOM).

import * as THREE from 'three';
import { BODIES, DEG } from '../config.js';

export const WORLD_UP = new THREE.Vector3(0, 1, 0);   // ecliptic north
export const SITE_ALT_KM = 0.001;                     // equipment ground level above the sphere
export const SITE_LOOK_H_KM = 0.0015;                 // orbit the hardware 1.5 m above ground

/** Orbit view of a body: lit from the side, seen from roughly where we came from. */
export function orbitPose(eph, bodyId, fromWorld, distFactor) {
  const b = eph[bodyId];
  const sunDir = b.pos.clone().negate().normalize();
  const fromDir = fromWorld.clone().sub(b.pos);
  const d = fromDir.lengthSq() > 0 ? fromDir.normalize().multiplyScalar(0.55) : new THREE.Vector3();
  d.addScaledVector(sunDir, 0.45);
  if (d.lengthSq() < 1e-6) d.copy(sunDir);
  d.normalize().addScaledVector(WORLD_UP, 0.18).normalize();
  let r1 = b.radius * (distFactor || BODIES[bodyId].orbitView);
  if (b.isProbe && b.def && b.def.model === 'voyager' && !distFactor) {
    // arrive beside and a little below it, on the sunlit side: the dish, the bus with the Golden Record and both booms in one look
    const x = new THREE.Vector3().crossVectors(WORLD_UP, sunDir).normalize(), y = new THREE.Vector3().crossVectors(sunDir, x);
    d.copy(x).multiplyScalar(0.6).addScaledVector(y, -0.52).addScaledVector(sunDir, 0.5).normalize(); r1 = 0.0118;
  }
  if (b.isProbe) nearWorldView(eph, b, d);
  return {
    kind: 'orbit', bodyId,
    P1: b.pos.clone().addScaledVector(d, r1),
    T1: b.pos.clone(),
    A: b.pos.clone().addScaledVector(d, r1 * 2.4),
    upFinal: WORLD_UP.clone(),
    cruiseLook: b.pos.clone(),
  };
}

/** A probe right next to a planet (Voyager 1 minutes after launch): with the usual framing the planet's
 *  night side can fill the whole picture as a black wall. Here the camera direction d (unit, from the
 *  probe) is turned so that the planet behind the probe shows its sunlit side, or its lit edge beside it,
 *  while the probe itself stays lit from the camera's side. Changes d in place; does nothing far out. */
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _n = new THREE.Vector3(), _c = new THREE.Vector3(), _k = new THREE.Vector3();
function nearWorldView(eph, b, d) {
  let near = null, best = Infinity;
  for (const o of eph.list) {
    if (o.id === 'sun') continue;
    const k = o.pos.distanceTo(b.pos) / o.radius;
    if (k < best) { best = k; near = o; }
  }
  if (!near || best > 15) return;
  const s = b.pos.clone().negate().normalize();                       // toward the Sun
  const dist = near.pos.distanceTo(b.pos), R = near.radius, angR = Math.asin(Math.min(1, R / dist));
  _w.copy(near.pos).sub(b.pos).normalize();                           // toward the planet
  const d0 = d.clone(), N = 400, GA = Math.PI * (3 - Math.sqrt(5));
  let top = -Infinity;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = GA * i;
    _k.set(Math.cos(th) * r, y, Math.sin(th) * r);                     // candidate: camera on this side of the probe
    const lamp = _k.dot(s);
    if (lamp < 0.15) continue;                                         // the probe must face the light toward us
    _v.copy(_k).negate();                                               // the way the camera looks
    const a = Math.acos(Math.max(-1, Math.min(1, _v.dot(_w))));
    let score;
    if (a < angR) {                                                     // the planet is right behind the probe
      const tc = dist * Math.cos(a), h = Math.sqrt(Math.max(0, R * R - (dist * Math.sin(a)) ** 2));
      _c.copy(b.pos).addScaledVector(_v, tc - h); _n.copy(_c).sub(near.pos).normalize();
      score = 1.6 * _n.dot(s);
    } else {                                                            // the planet beside it: its edge in the picture
      const m = (a - angR) / DEG;
      _n.copy(_v).addScaledVector(_w, -_v.dot(_w)).normalize().negate(); // normal at the nearest edge point
      score = m < 28 ? 0.9 * _n.dot(s) + 0.5 * (1 - m / 28) : -0.2;
    }
    score += 0.35 * _k.dot(d0) + 0.2 * lamp;
    if (score > top) { top = score; d.copy(_k); }
  }
}

/** Close-up of a piece of hardware on the surface. eq = equipment record. */
export function sitePose(eph, eq) {
  const b = eph[eq.body];
  const E = new THREE.Vector3(), U = new THREE.Vector3(), N = new THREE.Vector3();
  b.siteFrame(eq.lat, eq.lon, E, U, N);
  const S = b.surfacePoint(eq.lat, eq.lon, SITE_ALT_KM);
  const view = eq.view || {};
  const dist = (view.dist ?? 60) / 1000;
  const el = (view.el ?? 24) * DEG;
  let az;
  if (view.az != null) az = view.az * DEG;
  else {
    const s = S.clone().negate().normalize();              // toward the Sun
    az = Math.atan2(s.dot(E), s.dot(N)) + 65 * DEG;         // three-quarter light from the camera's side
  }
  const horiz = N.clone().multiplyScalar(Math.cos(az)).addScaledVector(E, Math.sin(az));
  const c = view.center || [0, 0];                          // metres east, north of the site point
  const lookH = Math.min(SITE_LOOK_H_KM, Math.max(0.0002, dist * 0.06));   // small hardware: look lower
  const T1 = S.clone().addScaledVector(E, c[0] / 1000).addScaledVector(N, c[1] / 1000).addScaledVector(U, lookH);
  const P1 = T1.clone().addScaledVector(horiz, dist * Math.cos(el)).addScaledVector(U, dist * Math.sin(el));
  return {
    kind: 'site', bodyId: eq.body, eq,
    P1, T1, S, E, U, N,
    // the way down starts 40 degrees around the body, a quarter of a radius up, on the side the camera ends on,
    // and glides in along the curve of the surface
    A: b.pos.clone().addScaledVector(U.clone().multiplyScalar(Math.cos(40 * DEG)).addScaledVector(horiz, Math.sin(40 * DEG)).normalize(), b.radius * 1.25),
    arc: { center: b.pos.clone(), radius: b.radius },
    upFinal: U.clone(),
    cruiseLook: b.pos.clone(),
  };
}

/** Optional lift-off phase so a flight never starts by diving into the ground. */
export function liftFor(eph, start, P0) {
  if (start.kind === 'site') {
    const b = eph[start.bodyId];
    return { center: start.T1.clone(), to: start.S.clone().addScaledVector(start.U, b.radius * 0.6) };
  }
  if (start.kind === 'orbit') {
    const b = eph[start.bodyId];
    const r = P0.distanceTo(b.pos);
    if (r < b.radius * 1.6) {
      const d = P0.clone().sub(b.pos).normalize();
      return { center: b.pos.clone(), to: b.pos.clone().addScaledVector(d, b.radius * 1.6) };
    }
  }
  return null;
}

export function bodySpheres(eph) {
  return eph.list.map((b) => ({ id: b.id, center: b.pos, radius: b.radius, exclusion: b.id === 'sun' ? 5.0 : 1.25 }));
}
