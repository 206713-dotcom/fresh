// Two events, both run on textbook physics only.
//
//  1. A Type Ia supernova in the galaxy being visited. Its brightness follows
//     the standard light curve of a Type Ia (peak absolute magnitude -19.3,
//     fading 1.1 magnitudes in the first 15 days), compared with the galaxy's
//     own catalogued brightness.
//
//  2. Two black holes spiralling together, with the masses of GW150914, the
//     first merger ever detected (LIGO, 14 September 2015). The orbit shrinks
//     by the quadrupole formula for gravitational-wave energy loss (Peters
//     1964), and the background stars are bent by the point-lens equation.
//     Nothing glows: a pair of black holes in empty space gives off no light,
//     only gravitational waves.
import * as THREE from '../three.js';
import { SN, supernovaMagnitude, MERGER } from './physics.js';

const C = 299792458;                 // m s^-1

const glareVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
uniform float uSize;
varying vec2 vUv;
void main() {
  vUv = position.xy;
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  mv.xy += position.xy * uSize;
  gl_Position = projectionMatrix * mv;
  #include <logdepthbuf_vertex>
}
`;
const glareFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform float uGain;
uniform vec3 uTint;
varying vec2 vUv;
void main() {
  #include <logdepthbuf_fragment>
  float r = length(vUv);
  float core = exp(-r * r * 900.0) * 14.0;
  float halo = 0.0016 / (r * r + 0.0016) * (1.0 - smoothstep(0.1, 1.0, r));
  // Spikes, as a telescope's mirror supports draw them around any bright point.
  float spikes = exp(-abs(vUv.y) * 240.0) * exp(-abs(vUv.x) * 5.0) * 0.9
               + exp(-abs(vUv.x) * 240.0) * exp(-abs(vUv.y) * 5.0) * 0.9;
  gl_FragColor = vec4(uTint * (core + halo + spikes) * uGain, 1.0);
}
`;

export function createSupernova() {
  const material = new THREE.ShaderMaterial({
    vertexShader: glareVertex,
    fragmentShader: glareFragment,
    uniforms: { uSize: { value: 1 }, uGain: { value: 0 }, uTint: { value: new THREE.Color(1, 1, 1) } },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 10;
  mesh.visible = false;
  return {
    mesh,
    day: SN.start,
    running: false,
    start() { this.day = SN.start; this.running = true; mesh.visible = true; },
    stop() { this.running = false; mesh.visible = false; material.uniforms.uGain.value = 0; },
    /** @returns {number|null} absolute magnitude now */
    update(dt, distance, tanHalfFov) {
      if (this.running) this.day = Math.min(SN.end, this.day + dt * SN.daysPerSecond);
      const M = supernovaMagnitude(this.day);
      const rel = M === null ? 0 : Math.pow(10, -0.4 * (M - SN.peak));     // 1 at maximum
      material.uniforms.uSize.value = distance * tanHalfFov * 0.42;        // a constant size on screen
      material.uniforms.uGain.value = 1.35 * Math.pow(rel, 0.75);
      // Blue-white at maximum, turning yellow and then red as the debris cools.
      const age = Math.min(1, Math.max(0, this.day / 60));
      material.uniforms.uTint.value.setRGB(1.0, 0.94 - 0.30 * age, 1.0 - 0.62 * age);
      return M;
    },
  };
}

const lensVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
// Each black hole bends the light of the stars behind it. For a star far
// beyond a lens of Schwarzschild radius Rs at distance D, the image at angle
// theta from the lens comes from true direction  beta = theta - thetaE^2/theta,
// with Einstein angle thetaE = sqrt(2 Rs / D). Inside 2.6 Rs no light escapes.
const lensFragment = /* glsl */ `
uniform sampler2D tSky;
uniform float uAspect, uTanHalf;
uniform vec4 uLens[2];      // xy: position on the image plane (tangent units), z: thetaE^2, w: shadow radius
varying vec2 vUv;
void main() {
  vec2 q = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0) * uTanHalf;
  vec2 src = q;
  float dark = 1.0;
  for (int i = 0; i < 2; i++) {
    if (uLens[i].z <= 0.0) continue;
    vec2 d = q - uLens[i].xy;
    float r2 = max(dot(d, d), 1e-7);
    src -= uLens[i].z * d / r2;
    dark *= smoothstep(uLens[i].w * 0.985, uLens[i].w * 1.02, sqrt(r2));
  }
  vec2 uv = src / (vec2(uAspect, 1.0) * uTanHalf) * 0.5 + 0.5;
  uv = 1.0 - abs(1.0 - mod(uv, 2.0));                 // mirror anything that falls outside the picture
  vec3 sky = texture2D(tSky, uv).rgb;
  // The star map's nebulae are strongly blue; pull them towards the pale glow the eye would see.
  float grey = dot(sky, vec3(0.3, 0.5, 0.2));
  sky = mix(vec3(grey) * vec3(1.0, 0.93, 0.82), sky, 0.3);
  gl_FragColor = vec4(sky * dark, 1.0);
}
`;

const sheetVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
uniform float uT, uTau, uW0, uTm, uPhiM, uAmpM, uC, uFrd, uTauRd, uHeight, uEdge, uDrop;
varying float vGlow;
void main() {
  float r = length(position.xz);
  float th = atan(position.z, position.x);
  // The ripple seen at radius r left the black holes r/c ago.
  float tr = uT - r / uC;
  float amp, phi;
  if (tr < uTm) {
    float x = max(1.0 - tr / uTau, 1e-4);
    phi = 1.6 * uW0 * uTau * (1.0 - pow(x, 0.625));
    amp = pow(x, -0.25);
  } else {
    float dt = tr - uTm;
    phi = uPhiM + 3.14159265 * uFrd * dt;
    amp = uAmpM * exp(-dt / uTauRd);
  }
  // Two crests per orbit (a quadrupole), fading as 1/r.
  float h = amp * cos(2.0 * (phi - th)) * 14.0 / max(r, 14.0) * smoothstep(8.0, 36.0, r);
  vec3 p = vec3(position.x, h * uHeight - uDrop, position.z);
  vGlow = (0.022 + 0.30 * max(h, 0.0) + 0.05 * abs(h)) * (1.0 - smoothstep(uEdge * 0.5, uEdge, r));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  #include <logdepthbuf_vertex>
}
`;
const sheetFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
varying float vGlow;
void main() {
  #include <logdepthbuf_fragment>
  gl_FragColor = vec4(vec3(0.57, 0.75, 0.89) * vGlow, 1.0);
}
`;

/**
 * The merger stage: its own small scene (stars behind, two black holes, a sheet
 * that shows the gravitational waves).
 * @param {THREE.WebGLRenderer} renderer
 * @param {object} sky  the star sky from shaders/sky.js
 */
export function createMerger(renderer, sky) {
  const root = new THREE.Group();
  root.visible = false;
  // The Milky Way's glow is drawn into a texture that the lens then bends; the stars are
  // sharp points, so each one is moved to its bent position instead (see shaders/sky.js).
  const skyScene = new THREE.Scene();
  skyScene.add(sky.glow);
  root.add(sky.stars);
  const skyTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: true });
  skyTarget.texture.minFilter = skyTarget.texture.magFilter = THREE.LinearFilter;

  const lens = new THREE.ShaderMaterial({
    vertexShader: lensVertex,
    fragmentShader: lensFragment,
    uniforms: {
      tSky: { value: skyTarget.texture }, uAspect: { value: 1 }, uTanHalf: { value: 0.34 },
      uLens: { value: [new THREE.Vector4(), new THREE.Vector4()] },
    },
    depthTest: false,
    depthWrite: false,
  });
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lens);
  backdrop.frustumCulled = false;
  backdrop.renderOrder = -1000;
  root.add(backdrop);

  // The event horizons: plain black spheres, so the wave sheet passes behind them correctly.
  const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const holes = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), black); root.add(m); return m; });

  // The wave sheet: rings and spokes in the orbital plane.
  const EDGE = 420, pts = [];
  for (let r = 3; r <= EDGE; r += r < 120 ? 3 : 6) {
    const seg = 220;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2, b = ((i + 1) / seg) * Math.PI * 2;
      pts.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(b) * r, 0, Math.sin(b) * r);
    }
  }
  for (let k = 0; k < 32; k++) {
    const a = (k / 32) * Math.PI * 2;
    for (let r = 4; r < EDGE; r += 3) pts.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(a) * (r + 3), 0, Math.sin(a) * (r + 3));
  }
  const sheetGeo = new THREE.BufferGeometry();
  sheetGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const sheetMat = new THREE.ShaderMaterial({
    vertexShader: sheetVertex,
    fragmentShader: sheetFragment,
    uniforms: {
      uT: { value: 0 }, uTau: { value: MERGER.tau }, uW0: { value: MERGER.w0 }, uTm: { value: MERGER.tMerge },
      uPhiM: { value: MERGER.phaseMerge }, uAmpM: { value: MERGER.a0 / MERGER.aM }, uC: { value: C / 1e5 },
      uFrd: { value: MERGER.fMerge }, uTauRd: { value: MERGER.ringdown }, uHeight: { value: 1.9 }, uEdge: { value: EDGE }, uDrop: { value: 11 },
    },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const sheet = new THREE.LineSegments(sheetGeo, sheetMat);
  sheet.frustumCulled = false;
  root.add(sheet);

  const proj = new THREE.Vector3(), size = new THREE.Vector2();
  const shadow = m => 2.598 * MERGER.rs(m) / 1e5;          // radius of a black hole's shadow, scene units
  return {
    root, sky, lens,
    time: 0,              // real seconds since the binary entered the detector's band
    running: false,
    get duration() { return MERGER.tMerge + MERGER.after; },
    start() { this.time = 0; this.running = true; },
    /** Advance, place everything, and draw the stars into the texture the lens bends. */
    update(dt, camera, pixelScale) {
      if (this.running) this.time = Math.min(this.duration, this.time + dt / MERGER.slow);
      const s = MERGER.at(this.time);
      sheetMat.uniforms.uT.value = this.time;
      const a = s.a / 1e5;                                  // separation in scene units
      const p1 = [Math.cos(s.phi) * a * MERGER.m2 / MERGER.M, 0, Math.sin(s.phi) * a * MERGER.m2 / MERGER.M];
      const p2 = [-Math.cos(s.phi) * a * MERGER.m1 / MERGER.M, 0, -Math.sin(s.phi) * a * MERGER.m1 / MERGER.M];
      // Once merged, the two shadows settle into the single larger one.
      const blend = s.merged ? 1 - Math.min(1, s.a / MERGER.aM) : 0;
      const massScale = s.merged ? MERGER.mFinal / MERGER.M : 1;
      const tanHalf = Math.tan(camera.fov * Math.PI / 360);
      lens.uniforms.uTanHalf.value = tanHalf;
      lens.uniforms.uAspect.value = camera.aspect;
      [[p1, MERGER.m1], [p2, MERGER.m2]].forEach(([p, m], i) => {
        const r = shadow(m) + (shadow(MERGER.mFinal) - shadow(m)) * blend;
        holes[i].position.set(p[0], p[1], p[2]);
        holes[i].scale.setScalar(r * 0.97);
        proj.set(p[0], p[1], p[2]).applyMatrix4(camera.matrixWorldInverse);
        const u = lens.uniforms.uLens.value[i];
        if (proj.z > -0.5) { u.set(0, 0, 0, 0); sky.lenses[i].copy(u); return; }   // behind the camera
        const D = proj.length();
        const rsUnits = MERGER.rs(m * massScale) / 1e5;
        u.set(proj.x / -proj.z, proj.y / -proj.z, 2 * rsUnits / D, r / D);
        sky.lenses[i].copy(u);
      });

      renderer.getDrawingBufferSize(size);
      if (skyTarget.width !== size.x || skyTarget.height !== size.y) skyTarget.setSize(size.x, size.y);
      sky.setPixelScale(pixelScale * 1.5);
      const before = renderer.getRenderTarget();
      renderer.setRenderTarget(skyTarget);
      renderer.clear();
      renderer.render(skyScene, camera);
      renderer.setRenderTarget(before);
      return s;
    },
  };
}
