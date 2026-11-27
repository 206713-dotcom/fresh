// Camera flight planner.
//
// A flight has up to three phases, all precomputed in world coordinates (km, JS doubles):
//   0  lift-off   log-polar about the start target: rise from a surface / close orbit
//   A  cruise     centripetal Catmull-Rom through detour points around obstacle spheres
//   B  approach   log-polar about the destination target: descend onto the site / orbit
// Progress is parametrised by a scale-free "effort":
//   log-polar phases:  E = sqrt( ln(r1/r0)^2 + theta^2 )        (metric ds^2 = (dr/r)^2 + dtheta^2)
//   cruise:            E = integral dl / h(l),  h = altitude above the nearest body
// so every decade of distance takes about the same screen time. Sim time is frozen during a
// flight (bodies do not move), so the precomputed path stays valid.

import * as THREE from 'three';

const K = 900;               // samples along the whole flight
const NA = 3000;             // samples used to integrate the cruise effort

const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** Spherical interpolation of unit vectors with a stable fallback for opposite vectors. */
export function slerpVec(a, b, s, out = new THREE.Vector3(), fallbackAxis = null) {
  const d = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  const th = Math.acos(d);
  if (th < 1e-7) return out.copy(a);
  if (Math.PI - th < 1e-5) {
    const axis = new THREE.Vector3();
    if (fallbackAxis) axis.copy(fallbackAxis).addScaledVector(a, -fallbackAxis.dot(a));
    if (axis.lengthSq() < 1e-10) axis.set(1, 0, 0).addScaledVector(a, -a.x);
    if (axis.lengthSq() < 1e-10) axis.set(0, 1, 0).addScaledVector(a, -a.y);
    axis.normalize();
    // rotate a about (a x axis) by s*pi: goes through 'axis' half way
    const k = new THREE.Vector3().crossVectors(a, axis).normalize();
    return out.copy(a).applyAxisAngle(k, s * Math.PI);
  }
  const sin = Math.sin(th);
  const wa = Math.sin((1 - s) * th) / sin, wb = Math.sin(s * th) / sin;
  return out.set(a.x * wa + b.x * wb, a.y * wa + b.y * wb, a.z * wa + b.z * wb);
}

class LogPolar {
  constructor(center, from, to, fallbackAxis) {
    this.c = center.clone();
    const a = from.clone().sub(center), b = to.clone().sub(center);
    this.r0 = Math.max(a.length(), 1e-9); this.r1 = Math.max(b.length(), 1e-9);
    this.d0 = a.divideScalar(this.r0); this.d1 = b.divideScalar(this.r1);
    this.fb = fallbackAxis;
    const th = Math.acos(THREE.MathUtils.clamp(this.d0.dot(this.d1), -1, 1));
    this.effort = Math.hypot(Math.log(this.r1 / this.r0), th);
  }
  at(s, out) {
    const r = this.r0 * Math.pow(this.r1 / this.r0, s);
    slerpVec(this.d0, this.d1, s, out, this.fb);
    return out.multiplyScalar(r).add(this.c);
  }
}

/** The way down to a landing site: a long, shallow glide that follows the curve of the body, as a lander's descent
 *  does, instead of a straight drop from above. Height above the surface shrinks evenly in log scale; the distance still
 *  to go along the surface shrinks with it, so the path bends down onto the site. */
class SurfaceArc {
  constructor(center, radius, from, to, fallbackAxis) {
    this.c = center.clone(); this.R = radius; this.fb = fallbackAxis;
    const a = from.clone().sub(center), b = to.clone().sub(center);
    this.hA = Math.max(a.length() - radius, 1e-4); this.h1 = Math.max(b.length() - radius, 1e-5);
    this.dA = a.normalize(); this.d1 = b.normalize();
    this.th = Math.acos(THREE.MathUtils.clamp(this.dA.dot(this.d1), -1, 1));
    this.effort = Math.hypot(Math.log(this.hA / this.h1), this.th);
  }
  at(s, out) {
    const h = this.hA * Math.pow(this.h1 / this.hA, s);
    const left = Math.pow(Math.max(0, (h - this.h1) / (this.hA - this.h1)), 0.55);    // share of the way along the surface still to go
    slerpVec(this.dA, this.d1, 1 - left, out, this.fb);
    return out.multiplyScalar(this.R + h).add(this.c);
  }
}

function closestOnSegment(p, q, c, out) {
  const d = q.clone().sub(p);
  const len2 = d.lengthSq();
  const t = len2 > 0 ? THREE.MathUtils.clamp(c.clone().sub(p).dot(d) / len2, 0, 1) : 0;
  return out.copy(p).addScaledVector(d, t);
}

/** Recursively insert detour points so straight segments avoid the obstacle spheres. */
function detours(p, q, obstacles, margin, worldUp, depth = 0) {
  if (depth > 3) return [];
  let worst = null, worstPen = 0;
  const tmp = new THREE.Vector3();
  for (const o of obstacles) {
    if (p.distanceTo(o.center) < o.radius || q.distanceTo(o.center) < o.radius) continue;
    const c = closestOnSegment(p, q, o.center, tmp).clone();
    const pen = o.radius - c.distanceTo(o.center);
    if (pen > worstPen) { worstPen = pen; worst = { o, c }; }
  }
  if (!worst) return [];
  const { o, c } = worst;
  const n = c.clone().sub(o.center);
  if (n.lengthSq() < 1e-12 * o.radius * o.radius) {
    // segment passes exactly through the centre: go over the top (ecliptic north)
    const seg = q.clone().sub(p).normalize();
    n.copy(worldUp).addScaledVector(seg, -worldUp.dot(seg));
    if (n.lengthSq() < 1e-10) n.set(1, 0, 0).addScaledVector(seg, -seg.x);
  }
  const D = o.center.clone().addScaledVector(n.normalize(), o.radius * margin);
  return [...detours(p, D, obstacles, margin, worldUp, depth + 1), D,
          ...detours(D, q, obstacles, margin, worldUp, depth + 1)];
}

function altitude(x, bodies) {
  let h = Infinity;
  for (const b of bodies) h = Math.min(h, x.distanceTo(b.center) - b.radius);
  return Math.max(h, 1e-3);
}

function buildCruise(Pa, Pb, obstacles, bodies, worldUp) {
  let margin = 1.6, curve = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const pts = [Pa.clone(), ...detours(Pa, Pb, obstacles, margin, worldUp), Pb.clone()];
    curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    let ok = true;
    const x = new THREE.Vector3();
    for (let i = 0; i <= 400 && ok; i++) {
      curve.getPoint(i / 400, x);
      for (const o of obstacles) {
        if (Pa.distanceTo(o.center) < o.radius || Pb.distanceTo(o.center) < o.radius) continue;
        if (x.distanceTo(o.center) < o.radius * 0.999) { ok = false; break; }
      }
    }
    if (ok) break;
    margin *= 1.4;
  }
  // Cumulative effort table with adaptive steps: every step is short compared with the
  // altitude there, so the integral and the interpolation stay accurate from AU scale
  // down to a few hundred km (a fixed step would be ~1e5 km on an interplanetary leg).
  const pos = [curve.getPoint(0)], cumArr = [0];
  let t = 0, dt = 1 / NA, guard = 0;
  while (t < 1 && guard++ < 200000) {
    const last = pos[pos.length - 1];
    const tn = Math.min(1, t + dt);
    const pn = curve.getPoint(tn);
    const len = pn.distanceTo(last);
    const h = altitude(last, bodies);
    if (len > 0.04 * h && dt > 1e-12) { dt *= 0.5; continue; }
    const mid = pn.clone().add(last).multiplyScalar(0.5);
    cumArr.push(cumArr[cumArr.length - 1] + len / altitude(mid, bodies));
    pos.push(pn);
    t = tn;
    if (len < 0.015 * h) dt *= 1.6;
  }
  const n = pos.length - 1;
  const cum = Float64Array.from(cumArr);
  return {
    effort: cum[n],
    at(e, out) {   // position at cumulative effort e
      let lo = 0, hi = n;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < e) lo = m; else hi = m; }
      const span = cum[hi] - cum[lo];
      const f = span > 0 ? (e - cum[lo]) / span : 0;
      return out.copy(pos[lo]).lerp(pos[hi], f);
    },
  };
}

/**
 * Plan a flight.
 * @param o.P0,o.q0      start camera world position and orientation
 * @param o.T0           start look-at point (world)
 * @param o.lift         optional {center, to}: phase 0 from P0 to 'to', log-polar about 'center'
 * @param o.cruiseLook   world point the camera turns toward while cruising (destination body centre)
 * @param o.A            approach point (end of cruise)
 * @param o.P1,o.T1      final camera position and look-at point
 * @param o.upFinal      up vector OrbitControls will use at the destination
 * @param o.bodies       [{center, radius}] for altitude and obstacle tests
 * @param o.worldUp      ecliptic north
 */
export function planFlight(o) {
  const worldUp = o.worldUp || new THREE.Vector3(0, 1, 0);
  const obstacles = o.bodies.map((b) => ({ center: b.center, radius: b.radius * (b.exclusion || 1.25) }));

  const lift = o.lift ? new LogPolar(o.lift.center, o.P0, o.lift.to, worldUp) : null;
  const cruiseStart = o.lift ? o.lift.to : o.P0;
  // An end of the cruise inside a planet's keep-out zone (a probe a few hundred km up, Voyager 1 just after
  // launch) used to switch that planet off as an obstacle, and the camera could fly straight through it.
  // Shrink the zone to just inside that end instead, but never below the planet itself.
  const cruiseObs = [];
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i], R = o.bodies[i].radius;
    const dEnd = Math.min(cruiseStart.distanceTo(ob.center), o.A.distanceTo(ob.center));
    if (dEnd >= ob.radius) cruiseObs.push(ob);
    else if (dEnd * 0.97 > R * 1.004) cruiseObs.push({ center: ob.center, radius: dEnd * 0.97 });
    else cruiseObs.push(ob);                                  // an end on (or under) the surface: as before
  }
  const cruise = buildCruise(cruiseStart, o.A, cruiseObs, o.bodies, worldUp);
  const approach = o.arc ? new SurfaceArc(o.arc.center, o.arc.radius, o.A, o.P1, worldUp) : new LogPolar(o.T1, o.A, o.P1, worldUp);

  const E0 = lift ? lift.effort : 0;
  const EA = cruise.effort;
  const EB = approach.effort;
  const E = Math.max(E0 + EA + EB, 1e-6);

  const f0 = new THREE.Vector3(0, 0, -1).applyQuaternion(o.q0);
  const up0 = new THREE.Vector3(0, 1, 0).applyQuaternion(o.q0);

  const positions = new Array(K), quats = new Array(K);
  const p = new THREE.Vector3(), f = new THREE.Vector3(), fa = new THREE.Vector3(), fb = new THREE.Vector3();
  let up = up0.clone();
  const right = new THREE.Vector3(), m = new THREE.Matrix4(), want = new THREE.Vector3();

  for (let k = 0; k < K; k++) {
    const e = (k / (K - 1)) * E;
    // --- position and the phase's natural look direction
    if (lift && e < E0) {
      lift.at(e / E0, p);
      f.copy(o.T0).sub(p).normalize();
    } else if (e < E0 + EA || EB === 0) {
      const ea = Math.min(Math.max(e - E0, 0), EA);
      cruise.at(ea, p);
      const sA = EA > 0 ? ea / EA : 1;
      fa.copy(o.T0).sub(p).normalize();
      fb.copy(o.cruiseLook).sub(p).normalize();
      slerpVec(fa, fb, smoothstep(0, 0.4, sA), f, up);
    } else {
      approach.at(Math.min(1, (e - E0 - EA) / EB), p);
      f.copy(o.T1).sub(p).normalize();
    }
    if (k === K - 1) { p.copy(o.P1); f.copy(o.T1).sub(o.P1).normalize(); }
    // continuity with the camera's actual initial forward direction
    const g = smoothstep(0, 0.06, e / E);
    if (g < 1) slerpVec(f0, f.clone(), g, f, up);

    // --- up: parallel transport, then blend into the destination's up near the end
    up.addScaledVector(f, -up.dot(f));
    if (up.lengthSq() < 1e-10) up.copy(worldUp).addScaledVector(f, -worldUp.dot(f));
    if (up.lengthSq() < 1e-10) up.set(1, 0, 0).addScaledVector(f, -f.x);
    up.normalize();
    const b = smoothstep(0.45, 1.0, e / E);
    if (b > 0) {
      want.copy(o.upFinal).addScaledVector(f, -o.upFinal.dot(f));
      if (want.lengthSq() > 1e-10) {
        want.normalize();
        if (k === K - 1) up.copy(want);
        else {
          right.crossVectors(f, up);
          slerpVec(up.clone(), want, 0.035 * b, up, right);
          up.addScaledVector(f, -up.dot(f)).normalize();
        }
      }
    }

    right.crossVectors(f, up).normalize();
    const upOrtho = new THREE.Vector3().crossVectors(right, f);
    m.makeBasis(right, upOrtho, f.clone().negate());
    positions[k] = p.clone();
    quats[k] = new THREE.Quaternion().setFromRotationMatrix(m);
  }

  const duration = THREE.MathUtils.clamp(1.8 + 0.28 * E, 2.5, 9.0);
  return {
    duration, effort: E, phases: { E0, EA, EB },
    positions, quats,
    sample(u, outP, outQ) {
      const x = smootherstep(THREE.MathUtils.clamp(u, 0, 1)) * (K - 1);
      const i = Math.min(K - 2, Math.floor(x)), t = x - i;
      outP.copy(positions[i]).lerp(positions[i + 1], t);
      outQ.copy(quats[i]).slerp(quats[i + 1], t);
    },
  };
}
