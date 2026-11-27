// The galaxy catalogue: every galaxy with a measured distance out to 30 Mpc.
// data/galaxies.json is built by tools/build-galaxies.py from the Local Volume
// Galaxy catalogue (Karachentsev et al.), Cosmicflows-3 and HyperLEDA.
//
// Positions are supergalactic, in megaparsecs, with the Sun at the origin.
// In the scene the supergalactic plane is the floor: x = SGX, y = SGZ, z = -SGY.

export const MPC_LY = 3.2616e6;          // light-years in one megaparsec
export const KPC_LY = 3261.6;

// Equatorial (J2000) -> supergalactic, as a rotation matrix.
const EQ2SG = [
  [0.3750154778, 0.3413589618, 0.8618801834],
  [-0.8983204556, -0.0957271407, 0.4287851135],
  [0.2288749668, -0.9350456533, 0.2707505787],
];
const sg = (x, y, z) => [
  EQ2SG[0][0] * x + EQ2SG[0][1] * y + EQ2SG[0][2] * z,
  EQ2SG[1][0] * x + EQ2SG[1][1] * y + EQ2SG[1][2] * z,
  EQ2SG[2][0] * x + EQ2SG[2][1] * y + EQ2SG[2][2] * z,
];
const toScene = ([x, y, z]) => [x, z, -y];
const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** A repeatable random number from a name, so each galaxy always looks the same. */
export function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/** Hubble class from the numerical type T (de Vaucouleurs). */
export function classOf(T, type = '') {
  if (T === null || T === undefined) return { key: 'irr', label: 'Galaxy' };
  if (T <= -3.5) return { key: 'ell', label: 'Elliptical galaxy' };
  if (T <= 0.4) return { key: 's0', label: 'Lenticular galaxy' };
  if (T < 7.6) return { key: 'spiral', label: /B/.test(type.replace(/^SA/, '')) ? 'Barred spiral galaxy' : 'Spiral galaxy' };
  return { key: 'irr', label: T < 9.5 ? 'Magellanic irregular galaxy' : 'Irregular galaxy' };
}

const METHODS = {
  TRGB: 'Tip of the red-giant branch', Cep: 'Cepheid variable stars', SBF: 'Surface brightness fluctuations',
  TF: 'Tully–Fisher relation', BTF: 'Baryonic Tully–Fisher relation', SN: 'Supernovae', mem: 'Membership of a group with a known distance',
  h: 'Hubble flow (from its speed of recession)', HB: 'Horizontal-branch stars', BS: 'Brightest stars', CMD: 'Colour–magnitude diagram',
  CF3: 'Cosmicflows-3 (average of the measured distances)', geom: 'Geometry', RR: 'RR Lyrae variable stars', PL: 'Planetary nebulae',
  FP: 'Fundamental plane', txt: 'Texture of the galaxy image', me: 'Group membership (estimate)', mem2: 'Group membership',
};
export const methodName = m => METHODS[m] || (m ? m : 'Not given');

/**
 * @returns {Promise<{list: object[], meta: object}>}
 * Each galaxy: { i, name, common, pos:[x,y,z] (scene, Mpc), dist, T, type, cls, radius (Mpc), diam (kpc),
 *                ba, M, lum (1 = absolute magnitude -20), normal:[x,y,z], flat, src, method, ra, dec, seed }
 */
export async function loadCatalogue(url = 'data/galaxies.json') {
  const d = await (await fetch(url)).json();
  const list = [];
  const push = g => { g.i = list.length; list.push(g); return g; };

  // The Milky Way is not in a catalogue of other galaxies. Its centre is 8.2 kpc from the Sun,
  // towards Sagittarius, and its disc is tipped almost at right angles to the supergalactic plane.
  const gc = toScene([-0.7357425748, -0.0745537784, 0.6731453021]);
  push({
    name: 'Milky Way', common: 'Our galaxy', pos: gc.map(v => v * 0.0082), dist: 0, T: 4, type: 'SBbc', cls: classOf(4, 'SBbc'),
    radius: 0.016, diam: 32, ba: null, M: -20.8, lum: Math.pow(10, -0.4 * (-20.8 + 20)),
    normal: toScene([0, 0.9939225904, 0.1100812622]), flat: 0.14, src: 2, method: 'geom', ra: 266.4, dec: -29.0, seed: hash('Milky Way'), home: true,
  });

  for (let k = 0; k < d.name.length; k++) {
    const name = d.name[k], T = d.T[k], type = d.type[k] || '';
    const cls = classOf(T, type);
    const dist = d.dist[k];
    // No measured size: assume a small dwarf, which is what almost all of these are.
    const diam = d.diam[k] ?? 1.5;
    const M = d.M[k] ?? -11;
    const seed = hash(name);
    const pos = toScene([d.x[k], d.y[k], d.z[k]]);
    const los = norm(pos);

    // Orientation as seen from Earth: the inclination comes from the axis ratio, the
    // twist on the sky from the position angle. Which edge is nearer is not known,
    // so that one choice is made from the name.
    const ra = d.ra[k] * Math.PI / 180, dec = d.dec[k] * Math.PI / 180;
    const north = toScene(sg(-Math.sin(dec) * Math.cos(ra), -Math.sin(dec) * Math.sin(ra), Math.cos(dec)));
    const east = toScene(sg(-Math.sin(ra), Math.cos(ra), 0));
    const pa = (d.pa[k] ?? seed * 180) * Math.PI / 180;
    const major = norm([north[0] * Math.cos(pa) + east[0] * Math.sin(pa), north[1] * Math.cos(pa) + east[1] * Math.sin(pa), north[2] * Math.cos(pa) + east[2] * Math.sin(pa)]);
    const minor = norm(cross(los, major));
    const q = Math.min(1, Math.max(0.12, d.ba[k] ?? 0.4 + 0.5 * seed));
    let normal, flat;
    if (cls.key === 'ell' || (cls.key === 'irr' && diam < 2.5)) {
      // Spheroids: the catalogue's flattening is used as it is, seen side-on.
      flat = Math.max(0.35, q);
      normal = minor;
    } else {
      const q0 = cls.key === 'irr' ? 0.3 : 0.15;                     // how thick a disc is, edge-on
      flat = q0;
      const cosi = Math.sqrt(Math.max(0, (q * q - q0 * q0) / (1 - q0 * q0)));
      const sini = Math.sqrt(1 - cosi * cosi) * (seed > 0.5 ? 1 : -1);
      normal = norm([los[0] * cosi + minor[0] * sini, los[1] * cosi + minor[1] * sini, los[2] * cosi + minor[2] * sini]);
    }
    push({
      name, common: d.common[k] || '', pos, dist, T, type, cls, radius: diam / 2000, diam, ba: d.ba[k], M,
      lum: Math.pow(10, -0.4 * (M + 20)), normal, flat, src: d.src[k], method: d.method[k], ra: d.ra[k], dec: d.dec[k], seed,
      measured: d.diam[k] !== null,
    });
  }
  const byName = new Map(list.map(g => [g.name, g]));
  return { list, byName, meta: d.meta };
}
