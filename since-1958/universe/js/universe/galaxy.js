// A close-up galaxy, grown on the spot instead of downloaded.
//
// A real galaxy holds around a hundred billion stars, so no site can ship
// them. Here each galaxy is built from a few tens of thousands of points, and
// every point stands for millions of stars:
//
//   * Spiral arms and the patches of irregular galaxies are laid down by
//     BROWNIAN MOTION. A "walker" travels out along the arm; at every step it
//     is jostled by a random kick and pulled gently back towards the arm's
//     centre line (a random walk with a restoring pull, the Ornstein-Uhlenbeck
//     process), and it drops a star wherever it stands. Several walkers per arm
//     braid together into the clumpy, ragged arms real star formation makes.
//   * The smooth parts use the standard measured light profiles: an
//     exponential disc and a centrally concentrated bulge (Hernquist profile).
//
// The shape follows the galaxy's catalogued type: bulge size, how tightly the
// arms are wound, whether there is a bar. The same name always grows the same
// galaxy, because the random numbers are seeded from it.
import * as THREE from '../three.js';

/** Small repeatable random generator (mulberry32) with a Gaussian helper. */
function makeRandom(seed) {
  let a = Math.floor(seed * 4294967296) >>> 0 || 1;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare = null;
  const gauss = () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    let u = 0, v = 0;
    while (u === 0) u = next();
    v = next();
    const m = Math.sqrt(-2 * Math.log(u));
    spare = m * Math.sin(2 * Math.PI * v);
    return m * Math.cos(2 * Math.PI * v);
  };
  return { next, gauss };
}

// Star colours by population (linear light).
const OLD = [1.0, 0.74, 0.46];       // bulge and elliptical stars: old, cool, yellow-orange
const DISC = [1.0, 0.86, 0.66];      // the ordinary disc
const YOUNG = [0.62, 0.78, 1.0];     // hot young stars along the arms
const HII = [1.0, 0.30, 0.42];       // glowing hydrogen around newborn stars (H-alpha red)

/**
 * @param {object} g      a catalogue entry
 * @param {number} count  how many points to use
 * @returns {{positions, colors, sizes, kinds}} in units of the galaxy's radius, disc in the xz plane
 */
export function growGalaxy(g, count) {
  const rnd = makeRandom(g.seed);
  const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count), kinds = new Float32Array(count);
  let n = 0;
  const put = (x, y, z, c, bright, size, kind) => {
    if (n >= count) return;
    positions.set([x, y, z], n * 3);
    const v = bright * (0.55 + 0.9 * Math.pow(rnd.next(), 3));       // most stars faint, a few bright
    colors.set([c[0] * v, c[1] * v, c[2] * v], n * 3);
    sizes[n] = size;
    kinds[n] = kind;
    n++;
  };
  // A centrally concentrated ball of old stars (Hernquist profile), squashed by "q".
  const spheroid = (num, scale, q, colour, bright, cut = 1.25) => {
    for (let i = 0; i < num; i++) {
      let r;
      do { const s = Math.sqrt(rnd.next()); r = scale * s / (1 - s + 1e-4); } while (r > cut);
      const ct = rnd.next() * 2 - 1, st = Math.sqrt(1 - ct * ct), ph = rnd.next() * 6.2832;
      put(r * st * Math.cos(ph), r * ct * q, r * st * Math.sin(ph), colour, bright, 1, 0);
    }
  };
  // A thin disc whose light falls off exponentially with radius.
  const disc = (num, h, thick, colour, bright) => {
    for (let i = 0; i < num; i++) {
      let r;
      do { r = -h * Math.log(rnd.next() * rnd.next()); } while (r > 1.15);   // radius of an exponential disc
      const ph = rnd.next() * 6.2832;
      put(r * Math.cos(ph), rnd.gauss() * thick, r * Math.sin(ph), colour, bright, 1, 0);
    }
  };
  // A burst of young stars around one spot: an association, sometimes lit pink by its gas.
  const cluster = (x, y, z, spread, kind) => {
    const pink = rnd.next() < 0.13;
    const m = 6 + Math.floor(rnd.next() * 16);
    for (let i = 0; i < m; i++) {
      put(x + rnd.gauss() * spread, y + rnd.gauss() * spread * 0.5, z + rnd.gauss() * spread, pink ? HII : YOUNG, pink ? 1.0 : 1.2, pink ? 1.4 : 1.15, kind);
    }
  };

  const key = g.cls.key;
  if (key === 'ell') {
    spheroid(count, 0.16, g.flat, OLD, 1.0);
  } else if (key === 's0') {
    spheroid(Math.floor(count * 0.45), 0.10, 0.6, OLD, 1.0, 0.8);
    disc(count - n, 0.24, 0.02, DISC, 0.85);
  } else if (key === 'spiral') {
    const T = Math.min(7.5, Math.max(1, g.T));
    const k = (T - 1) / 6.5;                                   // 0 = Sa, 1 = Sd
    const bulge = 0.20 - 0.18 * k;                             // Sa: big bulge. Sd: almost none.
    const pitch = (9 + 3.2 * (T - 1)) * Math.PI / 180;         // Sa arms wound tight, Sd arms open
    const barred = /B/.test((g.type || '').replace(/^SA/, ''));
    const weakBar = /^SAB/.test(g.type || '');
    const barLen = barred ? 0.26 : weakBar ? 0.16 : 0;
    const arms = T > 6.2 ? 4 : 2;
    const armShare = 0.36 + 0.08 * k;

    spheroid(Math.floor(count * bulge), 0.07 + 0.05 * (1 - k), 0.7, OLD, 0.6, 0.6);
    if (barLen) {
      const num = Math.floor(count * 0.07);
      for (let i = 0; i < num; i++) put(rnd.gauss() * barLen * 0.5, rnd.gauss() * 0.02, rnd.gauss() * barLen * 0.13, OLD, 0.6, 1, 1);
    }
    disc(Math.floor(count * (1 - bulge - armShare - (barLen ? 0.07 : 0))), 0.24, 0.018, DISC, 0.5);

    // ---- the arms: Brownian walkers following a logarithmic spiral
    const start = Math.max(0.10, barLen * 0.5 + 0.02);
    const walkersPerArm = 5;
    const budget = Math.floor((count - n) / (arms * walkersPerArm));
    for (let arm = 0; arm < arms; arm++) {
      const base = (arm / arms) * 6.2832 + (arms > 2 ? rnd.gauss() * 0.25 : 0);
      for (let w = 0; w < walkersPerArm; w++) {
        let across = rnd.gauss() * 0.02, up = 0;               // the walker's offsets from the arm's centre line
        const reach = arms > 2 ? 0.6 + 0.4 * rnd.next() : 1;   // flocculent arms are shorter and patchier
        let placed = 0;
        const steps = Math.floor(budget * 1.5);
        for (let s = 0; s < steps && placed < budget; s++) {
          // Even steps outward; the angle follows from the logarithmic spiral r = r0 exp(theta tan(pitch)).
          const r = start + (reach - start) * Math.pow(s / steps, 0.85);
          const th = Math.log(r / start) / Math.tan(pitch);
          const width = 0.022 + 0.05 * r;
          // One step of Brownian motion with a pull back to the centre line.
          const dt = 0.06;
          across += -across * dt * 1.6 + rnd.gauss() * width * Math.sqrt(dt) * 1.9;
          up += -up * dt * 3.0 + rnd.gauss() * 0.012 * Math.sqrt(dt);
          const rr = r + across;
          const a = base + th;
          const x = rr * Math.cos(a), z = rr * Math.sin(a);
          const fade = Math.exp(-r * 1.9);                      // arms thin out towards the rim
          if (rnd.next() < 0.12 + 0.88 * fade) { put(x, up, z, YOUNG, 0.72, 1, 1); placed++; }
          if (rnd.next() < 0.035) { const before = n; cluster(x, up, z, 0.006 + 0.012 * rnd.next(), 1); placed += n - before; }
        }
      }
    }
    disc(count - n, 0.28, 0.02, DISC, 0.45);                    // whatever is left joins the disc
  } else {
    // Irregular galaxies have no arms: star formation wanders. Free Brownian
    // walkers (no centre line to return to) scatter young stars in patches.
    const magellanic = g.T !== null && g.T < 9.5;
    spheroid(Math.floor(count * 0.18), 0.16, 0.5, DISC, 0.7, 1.0);
    disc(Math.floor(count * 0.30), 0.28, 0.07, DISC, 0.6);
    for (let i = 0; i < n; i++) kinds[i] = 1;                  // small galaxies turn almost as one piece
    if (magellanic) {
      // An off-centre bar, as in the Large Magellanic Cloud.
      const num = Math.floor(count * 0.12);
      for (let i = 0; i < num; i++) put(0.06 + rnd.gauss() * 0.2, rnd.gauss() * 0.03, -0.04 + rnd.gauss() * 0.055, DISC, 1.0, 1, 1);
    }
    const walkers = 6 + Math.floor(rnd.next() * 5);
    const each = Math.floor((count - n) / walkers);
    for (let w = 0; w < walkers; w++) {
      const r0 = Math.sqrt(rnd.next()) * 0.55, a0 = rnd.next() * 6.2832;
      let x = r0 * Math.cos(a0), y = rnd.gauss() * 0.03, z = r0 * Math.sin(a0);
      for (let s = 0, placed = 0; placed < each; s++) {
        x += rnd.gauss() * 0.014; y += rnd.gauss() * 0.004 - y * 0.05; z += rnd.gauss() * 0.014;
        const d = Math.hypot(x, z);
        if (d > 0.95) { x *= 0.9; z *= 0.9; }                   // stay inside the galaxy
        put(x, y, z, YOUNG, 1.0, 1, 1); placed++;
        if (rnd.next() < 0.03) { const before = n; cluster(x, y, z, 0.008 + 0.014 * rnd.next(), 1); placed += n - before; }
      }
    }
    { const from = n; disc(count - n, 0.3, 0.07, DISC, 0.55); for (let i = from; i < n; i++) kinds[i] = 1; }
  }
  return { positions, colors, sizes, kinds, used: n };
}

const vertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 aColor;
attribute float aSize;
attribute float aKind;     // 0 = an ordinary star on its own orbit, 1 = part of the spiral pattern
uniform float uTime;       // millions of years
uniform float uRadius;     // the galaxy's radius, scene units
uniform float uPxPerRad;
uniform float uFade;
uniform float uGain;
uniform float uSpin;       // +1 or -1: which way the galaxy turns
varying vec3 vColor;
void main() {
  // Stars orbit at much the same speed at every radius (a flat rotation curve),
  // so inner stars lap outer ones. The arm pattern turns more slowly, as one piece.
  float r = max(length(position.xz), 0.035);
  float orbit = 0.0125 / r;                        // radians per million years at radius r
  float pattern = 0.0125 / 0.75;
  float ang = -uSpin * uTime * mix(orbit, pattern, aKind);
  float c = cos(ang), s = sin(ang);
  vec3 p = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = length(mv.xyz);
  float px = aSize * 0.011 * uRadius / dist * uPxPerRad;
  float size = max(px, 1.6);
  float energy = min(1.0, (px * px) / (size * size));       // a point smaller than a pixel keeps its total light
  vColor = aColor * uGain * uFade * energy;
  gl_PointSize = min(size, 48.0);
  gl_Position = projectionMatrix * mv;
  #include <logdepthbuf_vertex>
}
`;
const fragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
varying vec3 vColor;
void main() {
  #include <logdepthbuf_fragment>
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);
  if (r2 > 1.0) discard;
  gl_FragColor = vec4(vColor * exp(-r2 * 3.2), 1.0);
}
`;

/** Builds the drawable model for one galaxy. Dispose it when another is visited. */
export function createGalaxyModel(g, count) {
  const grown = growGalaxy(g, count);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(grown.positions, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(grown.colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(grown.sizes, 1));
  geo.setAttribute('aKind', new THREE.BufferAttribute(grown.kinds, 1));
  geo.setDrawRange(0, grown.used);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 }, uRadius: { value: g.radius }, uPxPerRad: { value: 1000 },
      uFade: { value: 0 }, uGain: { value: 1 }, uSpin: { value: g.seed > 0.5 ? 1 : -1 },
    },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  points.scale.setScalar(g.radius);
  // Stand the disc up the way the real galaxy is tilted, then turn it about its own axis.
  const tilt = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...g.normal));
  const twist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), g.seed * 6.2832);
  points.quaternion.copy(tilt).multiply(twist);
  points.renderOrder = 2;
  return {
    galaxy: g, points, uniforms: material.uniforms, count: grown.used,
    /** A point on an arm, in scene units from the galaxy's centre (used to place a supernova). */
    spot(pick = 0.37) {
      const i = Math.floor(grown.used * pick);
      for (let k = i; k < grown.used; k++) {
        const x = grown.positions[k * 3], z = grown.positions[k * 3 + 2];
        const r = Math.hypot(x, z);
        if (grown.kinds[k] > 0.5 && r > 0.42 && r < 0.7) return new THREE.Vector3(x, grown.positions[k * 3 + 1], z);
      }
      return new THREE.Vector3(0.3, 0, 0.1);
    },
    dispose() { geo.dispose(); material.dispose(); },
  };
}
