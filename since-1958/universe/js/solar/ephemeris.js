// Where everything is at a given time.
//
// Scene axes: x and z lie in the plane of Earth's orbit (the ecliptic) and
// +y points to its north, so planets orbit anticlockwise seen from above.
// Time is counted in days from J2000 (1 January 2000, 12:00).
import { AU_KM, GM_SUN } from './data.js';

const DEG = Math.PI / 180;
const OBLIQUITY = 23.4392911 * DEG;
const COS_E = Math.cos(OBLIQUITY), SIN_E = Math.sin(OBLIQUITY);

export const daysFromMs = ms => ms / 86400000 + 2440587.5 - 2451545.0;
export const msFromDays = d => (d + 2451545.0 - 2440587.5) * 86400000;

// Ecliptic x,y,z -> scene x,y,z
const eclToScene = (x, y, z) => [x, z, -y];

// Right ascension / declination (degrees) -> unit vector in scene axes.
export function eqToScene(raDeg, decDeg) {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  const x = Math.cos(dec) * Math.cos(ra), y = Math.cos(dec) * Math.sin(ra), z = Math.sin(dec);
  return eclToScene(x, y * COS_E + z * SIN_E, -y * SIN_E + z * COS_E);
}

/**
 * Heliocentric position from Keplerian elements.
 * Returns scene-axis coordinates in au plus the values the HUD needs.
 */
export function planetState(body, days) {
  const T = days / 36525;
  const [a0, e0, I0, L0, p0, n0] = body.el;
  const [ar, er, Ir, Lr, pr, nr] = body.rate;
  const a = a0 + ar * T, e = e0 + er * T;
  const I = (I0 + Ir * T) * DEG;
  const peri = p0 + pr * T, node = n0 + nr * T;
  const w = (peri - node) * DEG, O = node * DEG;
  let M = (((L0 + Lr * T - peri) % 360) + 540) % 360 - 180;
  M *= DEG;
  // Kepler's equation M = E - e sin E, solved by Newton's method.
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const [x, y, z] = orbitToScene(xp, yp, w, O, I);
  const r = Math.hypot(xp, yp);
  return {
    x, y, z, r, a, e,
    phase: ((E / (2 * Math.PI)) % 1 + 1) % 1,
    // vis-viva: v^2 = GM (2/r - 1/a)
    speed: Math.sqrt(GM_SUN * (2 / (r * AU_KM) - 1 / (a * AU_KM))),
  };
}

function orbitToScene(xp, yp, w, O, I) {
  const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I), sI = Math.sin(I);
  return eclToScene(
    (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    (sw * sI) * xp + (cw * sI) * yp);
}

// Points around a planet's orbit (au, scene axes), evenly spaced in eccentric anomaly.
export function orbitPath(body, days, count) {
  const T = days / 36525;
  const a = body.el[0] + body.rate[0] * T, e = body.el[1] + body.rate[1] * T;
  const I = (body.el[2] + body.rate[2] * T) * DEG;
  const peri = body.el[4] + body.rate[4] * T, node = body.el[5] + body.rate[5] * T;
  const w = (peri - node) * DEG, O = node * DEG;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const E = (i / count) * 2 * Math.PI;
    out.set(orbitToScene(a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E), w, O, I), i * 3);
  }
  return out;
}

// Direction from the Earth to the Moon (unit vector) and the orbit's pole.
// A circular, inclined orbit is plenty for showing phases.
export function moonState(days) {
  const L = (218.316 + 13.176396 * days) * DEG;
  const node = (125.08 - 0.0529538 * days) * DEG;
  const inc = 5.145 * DEG;
  const u = L - node;
  const dir = eclToScene(
    Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.sin(u) * Math.cos(inc),
    Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.sin(u) * Math.cos(inc),
    Math.sin(u) * Math.sin(inc));
  const pole = eclToScene(Math.sin(node) * Math.sin(inc), -Math.cos(node) * Math.sin(inc), Math.cos(inc));
  return { dir, pole };
}

/**
 * Orientation of a spinning body.
 * Returns the body's axes in scene coordinates: Y is the north pole and X is
 * the reference direction that the prime meridian is measured from.
 */
export function bodyFrame(body) {
  const [ra, dec] = body.pole;
  const Y = eqToScene(ra, dec);
  const X = eqToScene(ra + 90, 0);
  const Z = [X[1] * Y[2] - X[2] * Y[1], X[2] * Y[0] - X[0] * Y[2], X[0] * Y[1] - X[1] * Y[0]];
  return { X, Y, Z };
}

// Prime meridian angle in radians.
export const spinAngle = (body, days) => ((body.spin[0] + body.spin[1] * days) % 360) * DEG;
