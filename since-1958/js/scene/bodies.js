// Meshes for the Sun, Earth (+clouds, halo), Moon, Mars (+halo) and the star field.

import * as THREE from 'three';
import { BODIES, DEG, EXTRA_IDS } from '../config.js';
import { regolithDetail } from './site.js';
import { STARS } from '../../data/stars.js';
import { makeDeepSky } from './galaxy.js';
import { FAINT } from '../../data/stars_faint.js';
import {
  bodyVertex, earthFragment, cloudFragment, rockyFragment, haloFragment, starVertex, starFragment,
 earthAirFragment,
} from './shaders.js';

const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _v2 = new THREE.Vector3();

// Simple lit sphere for the planets nobody landed on (no close-up detail needed).
// One shader for the seven other worlds. Two physically motivated looks:
//   airless rock (Mercury, Pluto): Lommel-Seeliger + Lambert mix, like the Moon. The disc stays
//     bright right up to its edge and the terminator is sharp, because there is no air.
//   deep atmosphere (Venus and the giants): limb darkening, a terminator softened and tinted by
//     scattering, and a thin sunlit haze at the edge.
// Saturn also receives the shadow of its rings.
const planetFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D uMap;
uniform sampler2D uRingTex;
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform float uAmbient;
uniform float uAir;        // 0 = airless rock, 1 = deep atmosphere
uniform float uLimb;       // limb-darkening exponent
uniform float uWrap;       // how far light creeps past the terminator
uniform vec3 uTwilight;    // colour of the light at the terminator
uniform vec3 uHaze;        // colour of the sunlit edge haze
uniform float uGain;
uniform vec3 uRing;        // inner radius, outer radius, 1 if the planet has rings
uniform float uDetail;     // strength of fine cloud-band texture
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN), L = normalize(uSunL), V = normalize(uCamL - vP);
  float c0 = dot(N, L), mu0 = max(c0, 0.0), mu = max(dot(N, V), 0.0);
  vec3 albedo = texture2D(uMap, vUv).rgb;
  vec3 col;
  if (uAir < 0.5) {
    float ls = 2.0 * mu0 / (mu0 + mu + 1e-4);
    col = albedo * (mu0 * 0.4 + min(ls, 1.4) * 0.6 * step(0.0, c0)) * uGain;
  } else {
    // fine streaks along the cloud bands, so the giants hold up when you fly close
    float fine = vnoise(vec2(vUv.x * 90.0, vUv.y * 900.0)) * 0.6 + vnoise(vec2(vUv.x * 260.0, vUv.y * 2600.0)) * 0.4;
    albedo *= 1.0 + (fine - 0.5) * uDetail;
    float wrap = clamp((c0 + uWrap) / (1.0 + uWrap), 0.0, 1.0);
    float diffuse = pow(wrap, 0.9);
    float limb = pow(max(mu, 0.02), uLimb);
    vec3 light = mix(uTwilight, vec3(1.0), smoothstep(0.0, 0.32, c0));
    col = albedo * light * diffuse * limb * uGain;
    float edge = pow(1.0 - mu, 3.5) * smoothstep(-0.05, 0.3, c0);
    col += uHaze * edge;
  }
  // shadow of the rings on the cloud tops
  if (uRing.z > 0.5 && abs(L.y) > 1e-4) {
    float t = -vP.y / L.y;
    if (t > 0.0) {
      vec3 hit = vP + L * t;
      float r = length(hit.xz);
      float ru = (r - uRing.x) / (uRing.y - uRing.x);
      float inside = smoothstep(0.0, 0.02, ru) * (1.0 - smoothstep(0.98, 1.0, ru));
      col *= 1.0 - 0.88 * inside * textureLod(uRingTex, vec2(clamp(ru, 0.0, 1.0), 0.5), 3.0).a;
    }
  }
  col += albedo * uAmbient;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Saturn's rings: lit by the Sun, darkened where the planet's shadow falls across them, and
// seen in transmitted light (dense parts dark, thin parts glowing) from the unlit side.
const ringFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D uRingTex;
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform float uR;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  #include <logdepthbuf_fragment>
  vec4 tex = texture2D(uRingTex, vec2(vUv.x, 0.5));
  vec3 L = normalize(uSunL);
  float b = dot(vP, L), disc = b * b - (dot(vP, vP) - uR * uR);
  float shadow = b < 0.0 ? smoothstep(0.0, uR * uR * 0.012, disc) : 0.0;
  float litSide = step(0.0, L.y * uCamL.y);
  float bright = mix(0.07 + 0.55 * (1.0 - tex.a) * tex.a * 2.2, 1.0, litSide);
  bright *= mix(0.6, 1.0, smoothstep(0.0, 0.3, abs(L.y)));
  vec3 col = tex.rgb * bright * 1.35 * (1.0 - 0.97 * shadow);
  gl_FragColor = vec4(col, tex.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const marsSkyFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uUp;
uniform vec3 uSun;
uniform float uK;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  #include <logdepthbuf_fragment>
  vec3 d = normalize(vP), U = normalize(uUp), S = normalize(uSun);
  float e = dot(d, U), se = dot(S, U), ca = dot(d, S);
  float day = smoothstep(-0.10, 0.22, se);                    // the Sun's height above the horizon sets the brightness
  float h = clamp(e, 0.0, 1.0);
  vec3 sky = mix(vec3(0.50, 0.33, 0.21), vec3(0.33, 0.21, 0.14), smoothstep(0.0, 0.7, h));   // butterscotch: dust in the air
  sky *= 0.55 + 0.45 * day;
  float near = pow(max(ca, 0.0), 14.0), wide = pow(max(ca, 0.0), 3.0);
  vec3 blue = vec3(0.42, 0.56, 0.80);                          // fine dust scatters blue light forward, around the Sun
  float dusk = smoothstep(0.45, -0.02, se) * smoothstep(-0.22, 0.0, se);
  vec3 col = sky * day + blue * (near * (0.35 + 1.4 * dusk) + wide * 0.25 * dusk);
  col += vec3(0.62, 0.45, 0.31) * exp(-max(e, 0.0) * 9.0) * 0.15 * day;          // brighter haze at the horizon
  float a = clamp(max(day, (near + wide * 0.4) * dusk * 1.6), 0.0, 1.0) * uK;
  gl_FragColor = vec4(col, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// The Sun's visible surface: limb darkening (cooler, redder edge) and fine granulation.
const sunFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uCamL;
uniform float uTime;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float n3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1, 0, 0)), f.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), f.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN), V = normalize(uCamL - vP);
  float mu = max(dot(N, V), 0.0);
  float limb = 1.0 - 0.62 * (1.0 - sqrt(mu));                       // measured solar limb darkening
  float g = n3(N * 46.0 + uTime * 0.05) * 0.55 + n3(N * 140.0 - uTime * 0.09) * 0.45;
  vec3 hot = vec3(1.0, 0.93, 0.78), cool = vec3(1.0, 0.55, 0.22);
  vec3 col = mix(cool, hot, smoothstep(0.0, 0.75, mu)) * limb * (0.78 + 0.44 * g) * 1.02;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// look of each world: [air, limb, wrap, twilight rgb, haze rgb, gain, detail, halo rgb, halo strength]
const LOOK = {
  mercury: { air: 0, gain: 1.1 },
  pluto:   { air: 0, gain: 1.1 },
  venus:   { air: 1, limb: 0.22, wrap: 0.22, twilight: [1.0, 0.78, 0.50], haze: [0.30, 0.26, 0.16], gain: 0.98, detail: 0.025, halo: [1.0, 0.86, 0.55], haloK: 0.6 },
  jupiter: { air: 1, limb: 0.42, wrap: 0.10, twilight: [1.0, 0.70, 0.48], haze: [0.10, 0.08, 0.06], gain: 1.0, detail: 0.10, halo: [0.95, 0.80, 0.62], haloK: 0.18 },
  saturn:  { air: 1, limb: 0.42, wrap: 0.10, twilight: [1.0, 0.74, 0.50], haze: [0.10, 0.09, 0.06], gain: 0.95, detail: 0.07, halo: [0.98, 0.88, 0.66], haloK: 0.16 },
  uranus:  { air: 1, limb: 0.55, wrap: 0.14, twilight: [0.55, 0.90, 1.0], haze: [0.05, 0.12, 0.14], gain: 1.05, detail: 0.02, halo: [0.55, 0.92, 1.0], haloK: 0.35 },
  neptune: { air: 1, limb: 0.55, wrap: 0.14, twilight: [0.40, 0.60, 1.0], haze: [0.04, 0.08, 0.18], gain: 1.1, detail: 0.04, halo: [0.35, 0.55, 1.0], haloK: 0.45 },
};

function ringTexture() {
  // Radial profile of Saturn's main rings from the inner edge of C (74,500 km) to the outer
  // edge of A (137,000 km): faint C, bright dense B, the dark Cassini Division, A with the
  // narrow Encke Gap. Fine ringlets come from a fixed pseudo-random sequence.
  const W = 2048, c = document.createElement('canvas');
  c.width = W; c.height = 4;
  const g = c.getContext('2d');
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const fine = new Float32Array(W); let v = 0.5;
  const raw = new Float32Array(W);
  for (let x = 0; x < W; x++) { v += (rnd() - 0.5) * 0.35; v = Math.max(0, Math.min(1, v * 0.9 + 0.05)); raw[x] = v; }
  for (let x = 0; x < W; x++) { let t = 0; for (let k = -4; k <= 4; k++) t += raw[Math.max(0, Math.min(W - 1, x + k))]; fine[x] = t / 9; }   // ringlets a few texels wide: no shimmer
  const km = (r) => (r - 74500) / (137000 - 74500);
  const C1 = km(92000), B1 = km(117580), CD1 = km(122170), EN0 = km(133420), EN1 = km(133750);
  for (let x = 0; x < W; x++) {
    const u = x / W, f = fine[x], f2 = fine[W - 1 - x];
    let a, col;
    if (u < C1) { a = 0.10 + 0.10 * f + 0.05 * u / C1; col = [150, 138, 122]; }                 // C ring
    else if (u < B1) { const t = (u - C1) / (B1 - C1); a = 0.72 + 0.22 * f * (0.5 + t) ; a = Math.min(0.97, a + 0.08 * f2); col = [226, 206, 170]; }   // B ring
    else if (u < CD1) { a = 0.05 + 0.06 * f; col = [140, 128, 112]; }                             // Cassini Division
    else { a = 0.52 + 0.16 * f + 0.06 * f2; col = [214, 198, 168]; if (u > EN0 && u < EN1) a = 0.02; }   // A ring, Encke Gap
    if (u < 0.012) a *= u / 0.012;
    if (u > 0.985) a *= (1 - u) / 0.015;
    const k = 0.9 + 0.2 * f;
    g.fillStyle = `rgba(${Math.round(col[0] * k)},${Math.round(col[1] * k)},${Math.round(col[2] * k)},${Math.max(0, Math.min(0.97, a)).toFixed(3)})`;
    g.fillRect(x, 0, 1, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function loadTex(loader, url, srgb = true) {
  const t = loader.load(url);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 16;
  return t;
}

function shaderMat(fragmentShader, uniforms, extra = {}) {
  return new THREE.ShaderMaterial({ vertexShader: bodyVertex, fragmentShader, uniforms, ...extra });
}

function glowTexture(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Seeded RNG so the sky is the same on every load.
function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Galactic -> J2000 equatorial (transpose of the IAU/Hipparcos equatorial -> galactic matrix).
const GAL = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.4448296300, 0.7469822445],
  [-0.8676661490, -0.1980763734, 0.4559837762],
];

export class SolarSystemView {
  constructor(scene, renderer, eqjToWorld, onTexturesLoaded) {
    this.scene = scene;
    const manager = new THREE.LoadingManager(onTexturesLoaded);
    const L = new THREE.TextureLoader(manager);
    this.textures = {
      earthDay: loadTex(L, 'textures/earth_day.jpg'),
      earthNight: loadTex(L, 'textures/earth_night.jpg'),
      earthSpec: loadTex(L, 'textures/earth_spec.jpg', false),
      earthClouds: loadTex(L, 'textures/earth_clouds.jpg', false),
      moon: loadTex(L, 'textures/moon.jpg'),
      mars: loadTex(L, 'textures/mars.jpg'),
    };
    for (const id of EXTRA_IDS) this.textures[id] = loadTex(L, `textures/${BODIES[id].tex}`);
    this.meshes = {};
    this.renderer = renderer;

    // --- Earth
    const RE = BODIES.earth.radius;
    this.earthU = {
      uDay: { value: this.textures.earthDay }, uNight: { value: this.textures.earthNight },
      uSpec: { value: this.textures.earthSpec }, uClouds: { value: this.textures.earthClouds }, uSunL: { value: new THREE.Vector3(1, 0, 0) },
      uCamL: { value: new THREE.Vector3() }, uOcc: { value: new THREE.Vector4() }, uSunAng: { value: 0.00465 },
    };
    const earth = new THREE.Mesh(new THREE.SphereGeometry(RE, 192, 96), shaderMat(earthFragment, this.earthU));
    this.cloudU = {
      uClouds: { value: this.textures.earthClouds }, uSunL: this.earthU.uSunL, uOcc: this.earthU.uOcc,
      uSunAng: this.earthU.uSunAng, uOpacity: { value: 1 },
    };
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(RE * 1.0045, 160, 80),
      shaderMat(cloudFragment, this.cloudU, { transparent: true, depthWrite: false }));
    clouds.renderOrder = 1;
    earth.add(clouds);
    const AIR = 1.022;                                           // the shell of air drawn around the Earth (about 140 km: exaggerated a little so it shows)
    this.earthHaloU = {
      uSunL: this.earthU.uSunL, uCamL: { value: new THREE.Vector3() }, uStrength: { value: 1.0 },
      uLimb: { value: 1 - Math.sqrt(1 - 1 / (AIR * AIR)) },
    };
    const earthHalo = new THREE.Mesh(new THREE.SphereGeometry(RE * AIR, 192, 96),
      shaderMat(earthAirFragment, this.earthHaloU, { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    earthHalo.renderOrder = 2;
    earth.add(earthHalo);
    this.meshes.earth = earth;

    // --- Moon and Mars (fine meshes: facet sag stays < ~40 m so surface patches sit flush)
    this.moonU = this._rockyUniforms(this.textures.moon, 0.62, 1.25, new THREE.Color(0, 0, 0), 0.006);
    this.meshes.moon = new THREE.Mesh(new THREE.SphereGeometry(BODIES.moon.radius, 512, 256), shaderMat(rockyFragment, this.moonU));
    this.marsU = this._rockyUniforms(this.textures.mars, 0.28, 1.2, new THREE.Color(0.22, 0.10, 0.06), 0.004);
    this.marsU.uDetailScale.value = 1.6;   // Mars is about twice the Moon's size
    this.meshes.mars = new THREE.Mesh(new THREE.SphereGeometry(BODIES.mars.radius, 512, 256), shaderMat(rockyFragment, this.marsU));
    this.marsHaloU = {
      uSunL: this.marsU.uSunL, uCamL: { value: new THREE.Vector3() }, uColor: { value: new THREE.Color(0.95, 0.55, 0.35) },
      uPower: { value: 5.0 }, uStrength: { value: 0.32 },
    };
    const marsHalo = new THREE.Mesh(new THREE.SphereGeometry(BODIES.mars.radius * 1.012, 128, 64),
      shaderMat(haloFragment, this.marsHaloU, { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    marsHalo.renderOrder = 2;
    this.meshes.mars.add(marsHalo);

    // --- Sun: emissive disc plus a screen-filling glow sprite
    this.sunU = { uCamL: { value: new THREE.Vector3() }, uTime: { value: 0 } };
    this.meshes.sun = new THREE.Mesh(new THREE.SphereGeometry(BODIES.sun.radius, 96, 48), shaderMat(sunFragment, this.sunU));
    this.sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture([[0, 'rgba(255,250,235,1)'], [0.06, 'rgba(255,236,190,0.9)'], [0.2, 'rgba(255,200,120,0.28)'], [0.5, 'rgba(255,170,90,0.06)'], [1, 'rgba(0,0,0,0)']]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
    }));
    this.sunGlow.renderOrder = 3;

    // --- the other planets and Pluto
    this.planetU = {};
    const ringTex = ringTexture();
    for (const id of EXTRA_IDS) {
      const def = BODIES[id], k = LOOK[id];
      const u = this.planetU[id] = {
        uMap: { value: this.textures[id] }, uRingTex: { value: ringTex },
        uSunL: { value: new THREE.Vector3(1, 0, 0) }, uCamL: { value: new THREE.Vector3() }, uAmbient: { value: 0.004 },
        uAir: { value: k.air }, uLimb: { value: k.limb || 0 }, uWrap: { value: k.wrap || 0 },
        uTwilight: { value: new THREE.Color(...(k.twilight || [1, 1, 1])) }, uHaze: { value: new THREE.Color(...(k.haze || [0, 0, 0])) },
        uGain: { value: k.gain }, uDetail: { value: k.detail || 0 },
        uRing: { value: new THREE.Vector3(def.ring ? def.ring[0] : 0, def.ring ? def.ring[1] : 0, def.ring ? 1 : 0) },
      };
      if (this.textures[id]) this.textures[id].anisotropy = 8;
      const m = new THREE.Mesh(new THREE.SphereGeometry(def.radius, 128, 64), shaderMat(planetFragment, u));
      if (k.halo) {
        // thin sunlit atmosphere seen edge-on
        const hu = { uSunL: u.uSunL, uCamL: u.uCamL, uColor: { value: new THREE.Color(...k.halo) }, uPower: { value: 3.2 }, uStrength: { value: k.haloK } };
        const halo = new THREE.Mesh(new THREE.SphereGeometry(def.radius * 1.012, 96, 48),
          shaderMat(haloFragment, hu, { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
        halo.renderOrder = 2; halo.frustumCulled = false; m.add(halo);
      }
      if (def.ring) {
        const [r0, r1] = def.ring;
        const geo = new THREE.RingGeometry(r0, r1, 256, 1);
        const pos = geo.attributes.position, uv = geo.attributes.uv;
        for (let i = 0; i < pos.count; i++) uv.setXY(i, (Math.hypot(pos.getX(i), pos.getY(i)) - r0) / (r1 - r0), 0.5);
        geo.rotateX(-Math.PI / 2);           // into the planet's equatorial plane (positions stay planet-local)
        const ring = new THREE.Mesh(geo, shaderMat(ringFragment,
          { uRingTex: { value: ringTex }, uSunL: u.uSunL, uCamL: u.uCamL, uR: { value: def.radius } },
          { transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        ring.frustumCulled = false; ring.renderOrder = 1;
        m.add(ring);
      }
      this.meshes[id] = m;
    }

    // Sharper maps for the three worlds you can fly down to. They are loaded only for the world
    // in focus and released again afterwards, so the graphics card never holds more than one.
    const maxTex = renderer.capabilities.maxTextureSize;
    this.hiTier = maxTex >= 4096 ? '4k' : null;      // 8K is opt-in (the "8K maps" button): it needs a strong graphics card
    this.hi = {
      earth: { u: this.earthU.uDay, base: this.textures.earthDay, file: 'earth_day' },
      moon: { u: this.moonU.uMap, base: this.textures.moon, file: 'moon' },
      mars: { u: this.marsU.uMap, base: this.textures.mars, file: 'mars' },
    };
    this.hiLoader = new THREE.TextureLoader();

    for (const m of Object.values(this.meshes)) { m.frustumCulled = false; scene.add(m); }
    scene.add(this.sunGlow);

    // --- Stars + a Milky Way band (galactic latitude ~ N(0, 7 deg)), fixed in J2000
    this.stars = this._makeStars(eqjToWorld, renderer.getPixelRatio());
    scene.add(this.stars, this.milkyWay);
    // The sky of Mars, seen from the ground: butterscotch by day, blue around the Sun at sunset (as the rovers photograph it).
    this.marsSkyU = { uUp: { value: new THREE.Vector3(0, 1, 0) }, uSun: { value: new THREE.Vector3(1, 0, 0) }, uK: { value: 0 } };
    this.marsSky = new THREE.Mesh(new THREE.SphereGeometry(0.8e9, 64, 32), new THREE.ShaderMaterial({
      vertexShader: bodyVertex, fragmentShader: marsSkyFragment, uniforms: this.marsSkyU, side: THREE.BackSide, transparent: true, depthWrite: false,
    }));
    this.marsSky.frustumCulled = false; this.marsSky.renderOrder = -9; this.marsSky.visible = false;
    scene.add(this.marsSky);

    // Light for standard materials (hardware models, surface patches) near the focus body.
    this.sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    const sc = this.sunLight.shadow.camera;
    sc.left = -0.09; sc.right = 0.09; sc.top = 0.09; sc.bottom = -0.09; sc.near = 0.01; sc.far = 2;
    this.sunLight.shadow.bias = -0.00002;
    this.sunLight.shadow.normalBias = 0.00002;
    scene.add(this.sunLight, this.sunLight.target);
    this.fill = new THREE.HemisphereLight(0x9fb4d8, 0x2a2622, 0.06);
    scene.add(this.fill);
  }

  _rockyUniforms(map, ls, gain, rim, ambient) {
    return {
      uMap: { value: map }, uSunL: { value: new THREE.Vector3(1, 0, 0) }, uCamL: { value: new THREE.Vector3() },
      uOcc: { value: new THREE.Vector4() }, uSunAng: { value: 0.00465 }, uLS: { value: ls }, uGain: { value: gain },
      uRim: { value: rim }, uAmbient: { value: ambient },
      uEarthL: { value: new THREE.Vector3(1, 0, 0) }, uShine: { value: 0 },
      uDetail: { value: regolithDetail() }, uDetailScale: { value: 1.0 },
    };
  }

  _makeStars(eqjToWorld, pixelRatio) {
    // The real sky: every star of the Yale Bright Star Catalogue (data/stars.js) at its J2000 position,
    // sized and coloured by its brightness and colour; behind them the real Milky Way (see _makeMilkyWay).
    // ... and about 144,000 fainter real stars (to roughly magnitude 10, from NASA's Hipparcos and Tycho star maps):
    // what a camera shows when the exposure is long enough for the Milky Way to look this bright.
    const fb = Uint8Array.from(atob(FAINT), (c) => c.charCodeAt(0)), nf = fb.length / 5;
    const nb = STARS.length / 4, n = nb + nf;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n);
    const R = 1e9, tmp = new THREE.Vector3();
    const TINT = [[1.0, 0.80, 0.62], [1.0, 0.95, 0.86], [0.78, 0.86, 1.0]];
    for (let i = 0; i < nb; i++) {
      const ra = STARS[i * 4] * DEG, dec = STARS[i * 4 + 1] * DEG, mag = STARS[i * 4 + 2], t = TINT[STARS[i * 4 + 3]];
      eqjToWorld(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), R, tmp);
      pos.set([tmp.x, tmp.y, tmp.z], i * 3);
      const k = Math.max(0, Math.min(1.25, (7.2 - mag) / 7.0));             // 0 = faintest, ~1 = first magnitude, more for Sirius
      const bright = 0.55 + 1.9 * Math.pow(k, 1.4);
      col.set([t[0] * bright, t[1] * bright, t[2] * bright], i * 3);
      size[i] = 1.9 + 4.4 * Math.pow(k, 1.3);
    }
    for (let j = 0; j < nf; j++) {
      const i = nb + j, o = j * 5, ra = ((fb[o] << 8) | fb[o + 1]) / 65535 * 2 * Math.PI, dec = (((fb[o + 2] << 8) | fb[o + 3]) / 65535 - 0.5) * Math.PI;
      const step = fb[o + 4] & 252, t = TINT[fb[o + 4] & 3], k = 1 - step / 250;          // 1 = brightest of the faint ones
      eqjToWorld(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), R, tmp);
      pos.set([tmp.x, tmp.y, tmp.z], i * 3);
      const bright = 0.34 + 0.56 * k * k;
      col.set([t[0] * bright, t[1] * bright, t[2] * bright], i * 3);
      size[i] = 1.45 + 0.8 * k;
    }
    this.milkyWay = makeDeepSky(this.renderer, GAL, eqjToWorld);      // the Milky Way and the naked-eye galaxies (scene/galaxy.js)
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: starVertex, fragmentShader: starFragment, uniforms: { uPixelRatio: { value: pixelRatio }, uFade: { value: 1 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = -10;
    return pts;
  }

  /** Change map quality ('4k' | '8k') and reload the map of the world in focus. */
  setHiTier(tier) {
    if (tier === this.hiTier) return;
    this.hiTier = tier;
    for (const h of Object.values(this.hi)) { if (h.state === 'on') { h.u.value = h.base; if (h.tex.userData.bitmap) h.tex.userData.bitmap.close(); h.tex.dispose(); h.tex = null; } h.state = null; }
    this._gen = (this._gen || 0) + 1;
    this._hiRes(this._focus);
  }

  /** Swap in the high-resolution map of the focused world; drop the others. */
  // The sharp maps (4K, or 8K on request) of the Earth, the Moon and Mars load for the world in focus. A big JPEG
  // used to stop the whole page for half a second when it reached the graphics card, because the photo was unpacked
  // right then. Now it is unpacked in the background (createImageBitmap), handed to the graphics card while nothing
  // else is happening, and only then swapped in; and once loaded it is kept, so flying back costs nothing.
  _hiRes(focusId) {
    if (!this.hiTier) return;
    const keep = this.hiTier === '8k' ? 1 : 3;                // 8K maps are huge: only the world in focus keeps one
    this._loadHi(focusId, keep);
    const h = this.hi[focusId];
    if (h && h.state === 'on') { h.u.value = h.tex; h.used = performance.now(); }
    // the other worlds keep their sharp map (up to `keep` in all), but the world in focus always shows its own
    for (const [id, o] of Object.entries(this.hi)) if (id !== focusId && o.state === 'on' && o.u.value !== o.tex) o.u.value = o.tex;
  }
  /** load a world's sharp map in the background, even when it is not in focus (used to fetch them before they are needed) */
  prefetchHi(id) { if (this.hiTier === '4k') this._loadHi(id, 3); }
  _loadHi(id, keep) {
    const h = this.hi[id];
    if (h && !h.state) {
      h.state = 'loading';
      const gen = this._gen || 0, url = `textures/${h.file}_${this.hiTier}.jpg`;
      const done = (t) => {
        if (gen !== (this._gen || 0)) { t.dispose(); h.state = null; return; }
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
        const swap = () => { if (gen !== (this._gen || 0)) { t.dispose(); h.state = null; return; } try { this.renderer.initTexture(t); } catch (e) { /* uploaded on first use instead */ } h.tex = t; h.u.value = t; h.state = 'on'; h.used = performance.now(); this._trimHi(keep); };
        (window.requestIdleCallback || ((f) => setTimeout(f, 60)))(swap, { timeout: 1500 });
      };
      if (typeof createImageBitmap === 'function') {
        fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
          .then((b) => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
          .then((bmp) => { const t = new THREE.Texture(bmp); t.flipY = false; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.wrapS = h.base.wrapS; t.wrapT = h.base.wrapT; t.needsUpdate = true; t.userData.bitmap = bmp; done(t); })
          .catch(() => { this.hiLoader.load(url, done, undefined, () => { h.state = 'failed'; }); });      // an older browser: the plain way
      } else this.hiLoader.load(url, done, undefined, () => { h.state = 'failed'; });
    }
  }
  /** let go of the least recently used sharp maps beyond `keep` */
  _trimHi(keep) {
    const on = Object.values(this.hi).filter((o) => o.state === 'on').sort((a, b) => b.used - a.used);
    for (const o of on.slice(keep)) { o.u.value = o.base; if (o.tex.userData.bitmap) o.tex.userData.bitmap.close(); o.tex.dispose(); o.tex = null; o.state = null; }
  }

  /** Per-frame update: positions, orientations and lighting uniforms. */
  update(eph, rig, camera, focusId) {
    const sunWorld = eph.sun.pos;
    const place = (id) => {
      const b = eph[id], m = this.meshes[id];
      rig.toRender(b.pos, m.position);
      m.quaternion.copy(rig.qv).multiply(b.quat);
    };
    place('earth'); place('moon'); place('mars');
    // Level of detail with no visible change: the 512-segment spheres exist so close-up surface
    // patches sit flush. When the body is small on screen, a 128-segment sphere differs from it
    // by far less than a tenth of a pixel, and spares the GPU about half a million triangles.
    const pxPerRad = (window.innerHeight / 2) / Math.tan(camera.fov * Math.PI / 360);
    for (const id of ['moon', 'mars']) {
      const m = this.meshes[id], b = eph[id];
      if (!m.userData.hi) { m.userData.hi = m.geometry; m.userData.lo = new THREE.SphereGeometry(b.radius, 128, 64); }
      const rpx = b.radius / Math.max(rig.camWorld.distanceTo(b.pos) - b.radius, 1e-6) * pxPerRad;
      const want = rpx < 110 ? m.userData.lo : m.userData.hi;
      if (m.geometry !== want) m.geometry = want;
    }
    for (const id of EXTRA_IDS) {
      place(id);
      // the same for the other planets and their thin air: a dot a few pixels wide needs far fewer triangles
      { const m = this.meshes[id], b = eph[id], h = m.children.find((c) => c.geometry && c.geometry.type === 'SphereGeometry');
        if (!m.userData.hi) { m.userData.hi = m.geometry; m.userData.lo = new THREE.SphereGeometry(b.radius, 32, 16); if (h) { h.userData.hi = h.geometry; h.userData.lo = new THREE.SphereGeometry(b.radius * 1.012, 32, 16); } }
        const rpx = b.radius / Math.max(rig.camWorld.distanceTo(b.pos) - b.radius, 1e-6) * pxPerRad, lo = rpx < 40;
        const want = lo ? m.userData.lo : m.userData.hi; if (m.geometry !== want) m.geometry = want;
        if (h) { const wh = lo ? h.userData.lo : h.userData.hi; if (h.geometry !== wh) h.geometry = wh; } }
      this.planetU[id].uSunL.value.copy(sunWorld).sub(eph[id].pos).applyMatrix4(eph[id].inv).normalize();
      this.planetU[id].uCamL.value.copy(rig.camWorld).sub(eph[id].pos).applyMatrix4(eph[id].inv);
    }
    if (this._focus !== focusId) { this._focus = focusId; this._hiRes(focusId); }
    rig.toRender(sunWorld, this.meshes.sun.position);
    this.sunU.uCamL.value.copy(camera.position).sub(this.meshes.sun.position);
    this.sunU.uTime.value = performance.now() / 1000;

    const local = (b, worldPoint, out) => out.copy(worldPoint).sub(b.pos).applyMatrix4(b.inv);
    const sunL = (b, u) => local(b, sunWorld, u.value).normalize();
    const camL = (b, u) => local(b, rig.camWorld, u.value);
    const occ = (b, other, u) => { local(b, other.pos, _v); u.value.set(_v.x, _v.y, _v.z, other.radius); };
    const sunAng = (b) => eph.sun.radius / b.pos.distanceTo(sunWorld);

    sunL(eph.earth, this.earthU.uSunL); camL(eph.earth, this.earthU.uCamL);
    this.earthHaloU.uCamL.value.copy(this.earthU.uCamL.value);
    occ(eph.earth, eph.moon, this.earthU.uOcc); this.earthU.uSunAng.value = sunAng(eph.earth);

    sunL(eph.moon, this.moonU.uSunL); camL(eph.moon, this.moonU.uCamL);
    occ(eph.moon, eph.earth, this.moonU.uOcc); this.moonU.uSunAng.value = sunAng(eph.moon);
    // earthshine is strongest near new Moon, when the Earth seen from the Moon is nearly full
    local(eph.moon, eph.earth.pos, this.moonU.uEarthL.value).normalize();
    _v.copy(sunWorld).sub(eph.earth.pos).normalize();
    const earthFull = 0.5 + 0.5 * _v.dot(_w.copy(eph.moon.pos).sub(eph.earth.pos).normalize());
    this.moonU.uShine.value = 0.006 + 0.028 * earthFull;

    sunL(eph.mars, this.marsU.uSunL); camL(eph.mars, this.marsU.uCamL);
    this.marsHaloU.uCamL.value.copy(this.marsU.uCamL.value);
    this.marsU.uOcc.value.set(0, 0, 0, 0); this.marsU.uSunAng.value = sunAng(eph.mars);

    // Sun glow: angular size never below ~3.5 deg so it reads as a star from Mars too.
    const dSun = rig.camWorld.distanceTo(sunWorld);
    this.sunGlow.position.copy(this.meshes.sun.position);
    const s = Math.max(BODIES.sun.radius * 22, dSun * 0.06);
    this.sunGlow.scale.set(s, s, 1);
    // close to the Sun the glow would wash out its surface: fade it as the disc grows
    this.sunGlow.material.opacity = Math.max(0.22, Math.min(1, 1 - (BODIES.sun.radius / dSun - 0.01) / 0.08));

    // Stars ride with the camera (infinitely far) and turn with the view frame.
    this.stars.position.copy(camera.position);
    this.stars.quaternion.copy(rig.qv);
    this.milkyWay.position.copy(camera.position); this.milkyWay.quaternion.copy(rig.qv);
    { // Moon by day: near the sunlit ground the eye (or a camera) is set for the bright surface, so the black sky
      // shows no Milky Way and almost no stars, as in the Apollo photographs. At night, or higher up, they come back.
      const moon = eph.moon, up = _w.copy(rig.camWorld).sub(moon.pos), h = up.length() - moon.radius;
      up.normalize();
      const sunUp = up.dot(_v2.copy(sunWorld).sub(rig.camWorld).normalize());
      const k = THREE.MathUtils.smoothstep(sunUp, -0.03, 0.06) * (1 - THREE.MathUtils.smoothstep(h, 20, 120));
      this.stars.material.uniforms.uFade.value = 1 - 0.92 * k;
      this.milkyWay.visible = k < 0.98;
      if (this.milkyWay.visible) for (const m of this.milkyWay.children) {
        const g = m.material.userData.gain ?? (m.material.userData.gain = m.material.color.r);
        m.material.color.setScalar(g * (1 - k));
      }
    }
    { // Mars sky: on near the ground of Mars, fading out on the way up (gone above ~100 km)
      const mars = eph.mars, h = rig.camWorld.distanceTo(mars.pos) - mars.radius;
      const k = 1 - THREE.MathUtils.smoothstep(h, 15, 110);
      this.marsSky.visible = k > 0.001;
      if (this.marsSky.visible) {
        this.marsSky.position.copy(camera.position);
        this.marsSkyU.uUp.value.copy(rig.camWorld).sub(mars.pos).normalize().applyMatrix4(rig.R).normalize();
        this.marsSkyU.uSun.value.copy(sunWorld).sub(rig.camWorld).normalize().applyMatrix4(rig.R).normalize();
        this.marsSkyU.uK.value = k;
      }
    }

    // Directional light for standard materials near the focus body.
    const focus = eph[focusId] || eph.earth;
    const dir = _w.copy(sunWorld).sub(focus.pos).normalize().applyMatrix4(rig.R);
    const tgt = rig.mode === 'site' ? _v.set(0, 0, 0) : rig.toRender(focus.pos, _v);
    this.sunLight.target.position.copy(tgt);
    this.sunLight.position.copy(tgt).addScaledVector(dir, 1.0);
    this.sunLight.target.updateMatrixWorld();
    this.sunLight.castShadow = rig.mode === 'site' && !rig.flying;
  }
}
