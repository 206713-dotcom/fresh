// Real positions and orientations of the Sun, Earth, Moon and Mars.
//
// World frame: heliocentric, ecliptic J2000, kilometres, mapped to three.js axes as
//   three.x = ecl.x,  three.y = ecl.z (ecliptic north is "up"),  three.z = -ecl.y
// (a proper rotation, det = +1).
//
// Body orientation follows the IAU WGCCRE model as implemented by astronomy-engine:
//   pole (alpha0, delta0), prime-meridian angle W measured eastward along the body equator
//   from the ascending node Q of the body equator on the ICRF equator (Q at RA alpha0 + 90 deg).
// Body-fixed axes: X -> (lat 0, lon 0), Y -> (lat 0, lon 90E), P -> north pole.
// Mesh-local axes (three.js SphereGeometry convention, texture u = 0.5 at lon 0):
//   local +x = X, local +y = P, local +z = -Y.

import * as THREE from 'three';
import * as A from '../../vendor/astronomy.js';
import { AU_KM, DEG, BODIES, EXTRA_IDS } from '../config.js';

const ROT = A.Rotation_EQJ_ECL().rot;   // astronomy-engine layout: v'_j = sum_i rot[i][j] * v_i

export function eqjToWorld(x, y, z, scale, out) {
  const ex = ROT[0][0] * x + ROT[1][0] * y + ROT[2][0] * z;
  const ey = ROT[0][1] * x + ROT[1][1] * y + ROT[2][1] * z;
  const ez = ROT[0][2] * x + ROT[1][2] * y + ROT[2][2] * z;
  return out.set(ex * scale, ez * scale, -ey * scale);
}

/** Mesh-local position for planetocentric latitude/longitude (deg, east-positive). */
export function localFromLatLon(latDeg, lonDeg, r, out = new THREE.Vector3()) {
  const la = latDeg * DEG, lo = lonDeg * DEG;
  const c = Math.cos(la);
  return out.set(r * c * Math.cos(lo), r * Math.sin(la), -r * c * Math.sin(lo));
}

/** Inverse of localFromLatLon for a direction in mesh-local coordinates. */
export function latLonFromLocal(v) {
  const r = v.length();
  return { lat: Math.asin(v.y / r) / DEG, lon: Math.atan2(-v.z, v.x) / DEG };
}

const _v = new THREE.Vector3();
const _w = new THREE.Vector3();

/** The Earth's position (world frame, km from the Sun) at any moment, without touching the shared state. */
export function earthAt(ms, out = new THREE.Vector3()) {
  const e = A.HelioVector(A.Body.Earth, A.MakeTime(new Date(ms)));
  return eqjToWorld(e.x, e.y, e.z, AU_KM, out), out;
}

export class BodyState {
  constructor(id) {
    this.id = id;
    this.radius = BODIES[id].radius;
    this.pos = new THREE.Vector3();      // world, km (JS doubles)
    this.X = new THREE.Vector3(1, 0, 0); // world direction of lon 0 on the equator
    this.Y = new THREE.Vector3(0, 0, -1);// world direction of lon 90E on the equator
    this.P = new THREE.Vector3(0, 1, 0); // world direction of the north pole
    this.matrix = new THREE.Matrix4();   // mesh-local -> world rotation
    this.quat = new THREE.Quaternion();
    this.inv = new THREE.Matrix4();      // world -> mesh-local rotation
    this.spinDeg = 0;
  }

  /** World direction (unit) of a point at lat/lon on this body. */
  dir(latDeg, lonDeg, out = new THREE.Vector3()) {
    const la = latDeg * DEG, lo = lonDeg * DEG, c = Math.cos(la);
    return out.copy(this.X).multiplyScalar(c * Math.cos(lo))
      .addScaledVector(this.Y, c * Math.sin(lo))
      .addScaledVector(this.P, Math.sin(la));
  }

  /** World position of a point at lat/lon and altitude above the mean sphere (km). */
  surfacePoint(latDeg, lonDeg, altKm = 0, out = new THREE.Vector3()) {
    this.dir(latDeg, lonDeg, out);
    return out.multiplyScalar(this.radius + altKm).add(this.pos);
  }

  /** Local east/up/north unit vectors (world) at a site. */
  siteFrame(latDeg, lonDeg, E, U, N) {
    this.dir(latDeg, lonDeg, U);
    E.crossVectors(this.P, U);
    if (E.lengthSq() < 1e-12) E.copy(this.X); // exactly at a pole
    E.normalize();
    N.crossVectors(U, E).normalize();
  }

  /** Planetocentric lat/lon (deg) of a world direction as seen from the body centre. */
  latLonOfDir(dirWorld) {
    _v.copy(dirWorld).normalize();
    const lat = Math.asin(THREE.MathUtils.clamp(_v.dot(this.P), -1, 1)) / DEG;
    const lon = Math.atan2(_v.dot(this.Y), _v.dot(this.X)) / DEG;
    return { lat, lon };
  }

  /** Sun elevation (deg) above the local horizon at a site, Sun at the world origin. */
  sunElevation(latDeg, lonDeg) {
    const site = this.surfacePoint(latDeg, lonDeg, 0, _v);
    const up = this.dir(latDeg, lonDeg, _w);
    const toSun = site.negate().normalize();
    return Math.asin(THREE.MathUtils.clamp(toSun.dot(up), -1, 1)) / DEG;
  }

  /** Local solar time (hours of a local day) at a longitude: 12 h when the Sun is overhead. */
  localSolarTime(lonDeg) {
    const sub = this.latLonOfDir(_v.copy(this.pos).negate());   // sub-solar point
    let h = 12 + (lonDeg - sub.lon) / 15;
    return ((h % 24) + 24) % 24;
  }
}

const BODY_ENUM = {
  earth: A.Body.Earth, moon: A.Body.Moon, mars: A.Body.Mars, mercury: A.Body.Mercury, venus: A.Body.Venus,
  jupiter: A.Body.Jupiter, saturn: A.Body.Saturn, uranus: A.Body.Uranus, neptune: A.Body.Neptune, pluto: A.Body.Pluto,
};

export class Ephemeris {
  constructor() {
    this.sun = new BodyState('sun');
    this.earth = new BodyState('earth');
    this.moon = new BodyState('moon');
    this.mars = new BodyState('mars');
    this.list = [this.sun, this.earth, this.moon, this.mars];
    for (const id of EXTRA_IDS) { this[id] = new BodyState(id); this.list.push(this[id]); }
    this.onUpdate = null;          // hook for things that move with time but are not planets (probes)
    this.earthSpinOffsetDeg = 0;   // used only by the time-lapse display (see main.js)
    this.ms = NaN;
    this._tmp = new THREE.Vector3();
  }

  get(id) { return this[id]; }

  update(ms) {
    this.ms = ms;
    const time = A.MakeTime(new Date(ms));
    const e = A.HelioVector(A.Body.Earth, time);
    eqjToWorld(e.x, e.y, e.z, AU_KM, this.earth.pos);
    const m = A.GeoVector(A.Body.Moon, time, false);
    eqjToWorld(m.x, m.y, m.z, AU_KM, this._tmp);
    this.moon.pos.copy(this.earth.pos).add(this._tmp);
    const r = A.HelioVector(A.Body.Mars, time);
    eqjToWorld(r.x, r.y, r.z, AU_KM, this.mars.pos);
    this.sun.pos.set(0, 0, 0);
    this.orientEarth(this.earth, time, this.earthSpinOffsetDeg);
    this.orient(this.moon, time, 0);
    this.orient(this.mars, time, 0);
    for (const id of EXTRA_IDS) {
      const v = A.HelioVector(BODY_ENUM[id], time);
      eqjToWorld(v.x, v.y, v.z, AU_KM, this[id].pos);
      this.orient(this[id], time, 0);
    }
    if (this.onUpdate) this.onUpdate(ms, this);
  }

  // Earth: equator-of-date frame rotated by Greenwich apparent sidereal time, then
  // precessed/nutated back to J2000. (The IAU alpha0/delta0/W form is ill-conditioned for
  // Earth because its pole sits at delta ~ 90 deg: before J2000 the pole RA flips by 180 deg.)
  orientEarth(b, time, extraDeg) {
    const g = (A.SiderealTime(time) * 15 + extraDeg) * DEG;
    const r = A.Rotation_EQD_EQJ(time).rot;
    const map = (x, y, z, out) => eqjToWorld(
      r[0][0] * x + r[1][0] * y + r[2][0] * z,
      r[0][1] * x + r[1][1] * y + r[2][1] * z,
      r[0][2] * x + r[1][2] * y + r[2][2] * z, 1, out);
    const c = Math.cos(g), s = Math.sin(g);
    map(c, s, 0, b.X);
    map(-s, c, 0, b.Y);
    map(0, 0, 1, b.P);
    b.spinDeg = g / DEG;
    b.matrix.makeBasis(b.X, b.P, this._tmp.copy(b.Y).negate());
    b.quat.setFromRotationMatrix(b.matrix);
    b.inv.copy(b.matrix).transpose();
  }

  orient(b, time, extraDeg) {
    const ax = A.RotationAxis(BODY_ENUM[b.id], time);
    const ra = ax.ra * 15 * DEG, dec = ax.dec * DEG, W = (ax.spin + extraDeg) * DEG;
    const cd = Math.cos(dec);
    const px = cd * Math.cos(ra), py = cd * Math.sin(ra), pz = Math.sin(dec);   // pole (EQJ)
    const qx = -Math.sin(ra), qy = Math.cos(ra), qz = 0;                        // node Q (EQJ)
    const cx = py * qz - pz * qy, cy = pz * qx - px * qz, cz = px * qy - py * qx; // P x Q
    const cw = Math.cos(W), sw = Math.sin(W);
    const xx = qx * cw + cx * sw, xy = qy * cw + cy * sw, xz = qz * cw + cz * sw; // prime meridian
    const yx = py * xz - pz * xy, yy = pz * xx - px * xz, yz = px * xy - py * xx; // P x X
    eqjToWorld(xx, xy, xz, 1, b.X);
    eqjToWorld(yx, yy, yz, 1, b.Y);
    eqjToWorld(px, py, pz, 1, b.P);
    b.spinDeg = ax.spin + extraDeg;
    b.matrix.makeBasis(b.X, b.P, this._tmp.copy(b.Y).negate());
    b.quat.setFromRotationMatrix(b.matrix);
    b.inv.copy(b.matrix).transpose();
  }
}
