// The night sky: every star down to magnitude 8 from the Hipparcos catalogue,
// drawn as a sharp point at its true position, brightness and colour, over a
// soft Milky Way glow.
//
// Stars are kept at their real brightness relative to sunlit planets. They
// are faint, so they only show when the camera's exposure rises (see the
// auto-exposure in main.js). That is why photographs of the daylit Earth
// have a black sky.
import * as THREE from '../three.js';
import { eqToScene } from '../solar/ephemeris.js';

const glowVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  // Rotation only (the sky is infinitely far away); pushed out past the near plane.
  gl_Position = projectionMatrix * vec4(mat3(viewMatrix) * position * FAR, 1.0);
}
`;

const glowFragment = /* glsl */ `
uniform sampler2D uMap;      // galactic coordinates, galactic centre in the middle
uniform vec3 uGalPole;
uniform vec3 uGalCentre;
uniform float uGain;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  vec3 gy = cross(uGalPole, uGalCentre);
  float b = asin(clamp(dot(d, uGalPole), -1.0, 1.0));
  float l = atan(dot(d, gy), dot(d, uGalCentre));
  // In this map galactic longitude grows to the left and galactic south is up.
  vec2 uv = vec2(0.5 - l / 6.28318530718, 0.5 - b / 3.14159265);
  vec3 s = textureLod(uMap, uv, 0.0).rgb;
  s *= s;                              // stored with a square-root curve
  vec3 lin = pow(s, vec3(2.2));        // display values -> linear light
  gl_FragColor = vec4(lin * uGain, 1.0);
}
`;

const starVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 aColor;
attribute float aSize;
uniform float uPx;
#ifdef LENS
uniform vec4 uLens[2];     // gravitational lenses: position on the image plane (xy), Einstein angle squared, shadow radius
#endif
varying vec3 vColor;
void main() {
  vColor = aColor;
  vec3 v = mat3(viewMatrix) * position;
  #ifdef LENS
  // A star behind a black hole is seen displaced: its image at angle theta satisfies
  // theta = beta + sum of thetaE^2 (theta - c) / |theta - c|^2 (the lens equation),
  // solved here by a few damped steps. Only the main image is drawn.
  if (v.z < -0.02) {
    vec2 beta = v.xy / -v.z;
    vec2 th = beta + vec2(1e-4);
    for (int k = 0; k < 10; k++) {
      vec2 bend = vec2(0.0);
      for (int i = 0; i < 2; i++) { vec2 e = th - uLens[i].xy; bend += uLens[i].z * e / max(dot(e, e), 1e-7); }
      th = mix(th, beta + bend, 0.5);
    }
    for (int i = 0; i < 2; i++) { if (uLens[i].z > 0.0) vColor *= step(uLens[i].w, length(th - uLens[i].xy)); }
    v = vec3(th * -v.z, v.z);
  }
  #endif
  // Far behind everything else, so planets hide the stars behind them.
  gl_Position = projectionMatrix * vec4(v * FAR, 1.0);
  gl_PointSize = aSize * uPx;
  #include <logdepthbuf_vertex>
}
`;

const starFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform float uGain;
varying vec3 vColor;
void main() {
  #include <logdepthbuf_fragment>
  vec2 d = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(d, d);
  if (r2 > 1.0) discard;
  // A tight core with a faint skirt, like a point of light through a lens.
  float psf = exp(-r2 * 9.0) + exp(-r2 * 2.6) * 0.10;
  gl_FragColor = vec4(vColor * psf * uGain, 1.0);
}
`;

// Colour of a star from its B-V index (blue-white through yellow to orange).
const BV_RAMP = [
  [-0.40, [0.61, 0.71, 1.00]], [-0.10, [0.74, 0.82, 1.00]], [0.15, [0.90, 0.93, 1.00]],
  [0.40, [1.00, 0.98, 0.95]], [0.65, [1.00, 0.94, 0.84]], [1.00, [1.00, 0.84, 0.64]],
  [1.50, [1.00, 0.72, 0.45]], [2.00, [1.00, 0.60, 0.33]],
];
function bvColour(bv) {
  let i = 0;
  while (i < BV_RAMP.length - 2 && bv > BV_RAMP[i + 1][0]) i++;
  const [b0, c0] = BV_RAMP[i], [b1, c1] = BV_RAMP[i + 1];
  const t = Math.min(1, Math.max(0, (bv - b0) / (b1 - b0)));
  return [0, 1, 2].map(k => c0[k] + (c1[k] - c0[k]) * t);
}

/**
 * @param {ArrayBuffer} catalogue Int16 records: RA*182, Dec*364, magnitude*1000, B-V*1000 (brightest first)
 * @param {number} far distance at which the sky is drawn, in scene units
 */
export function createSky({ catalogue, galPole, galCentre, far, lens = false }) {
  const group = new THREE.Group();
  const defines = { FAR: far.toFixed(1) };
  const starDefines = lens ? { ...defines, LENS: 1 } : defines;

  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: glowVertex,
    fragmentShader: glowFragment,
    defines,
    uniforms: { uMap: { value: null }, uGalPole: { value: galPole }, uGalCentre: { value: galCentre }, uGain: { value: 1 } },
    side: THREE.DoubleSide,   // we are always inside this sphere
    depthTest: false,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), glowMaterial);
  glow.frustumCulled = false;
  glow.renderOrder = -1000;
  glow.visible = false;
  group.add(glow);

  const records = new Int16Array(catalogue);
  const total = records.length / 4;
  const pos = new Float32Array(total * 3), col = new Float32Array(total * 3), size = new Float32Array(total);
  const mags = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const ra = records[i * 4] / 182, dec = records[i * 4 + 1] / 364;
    const mag = records[i * 4 + 2] / 1000, bv = records[i * 4 + 3] / 1000;
    pos.set(eqToScene(ra, dec), i * 3);
    mags[i] = mag;
    // Each magnitude is a factor of 2.512 in light. The exponent is halved so
    // that the range from Sirius to magnitude 8 fits what a screen can show.
    const lum = Math.pow(10, -0.2 * mag);
    const c = bvColour(bv);
    const sat = 0.75;
    col.set(c.map(v => (1 + (v - 1) * sat) * lum), i * 3);
    size[i] = 1.7 + 2.9 * Math.max(0, (3.6 - mag) / 5.0);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

  const starMaterial = new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    defines: starDefines,
    uniforms: { uPx: { value: 1 }, uGain: { value: 1 }, uLens: { value: [new THREE.Vector4(), new THREE.Vector4()] } },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
  const stars = new THREE.Points(geometry, starMaterial);
  stars.frustumCulled = false;
  stars.renderOrder = -999;
  group.add(stars);

  return {
    group, glow, stars,
    lenses: starMaterial.uniforms.uLens.value,
    count: total,
    /** Fainter stars are skipped on lower quality tiers (the list is sorted brightest first). */
    setLimit(magnitude) {
      let n = total;
      while (n > 0 && mags[n - 1] > magnitude) n--;
      geometry.setDrawRange(0, n);
    },
    setGlow(texture) {
      glowMaterial.uniforms.uMap.value = texture;
      glow.visible = true;
    },
    setPixelScale(px) { starMaterial.uniforms.uPx.value = px; },
    /** Brightness in the same units as sunlit surfaces. */
    setGain(starGain, glowGain) {
      starMaterial.uniforms.uGain.value = starGain;
      glowMaterial.uniforms.uGain.value = glowGain;
    },
  };
}
