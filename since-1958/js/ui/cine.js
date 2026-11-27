// The cinema layer shared by all the films: bloom on everything bright (engines, the Sun's glint, city lights),
// film tone mapping, a gentle camera shake at lift-off, letterbox bars, a vignette and fine grain, and a quick
// fade at every cut. It only changes how the picture is finished, never what the film shows.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Some graphics cards write a broken number (NaN or infinity) into a pixel now and then. The bloom would smear that
// one pixel over the whole picture and turn it black, so every pixel is checked and repaired before the bloom.
export const CLEAN = { uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); if (!(c.r >= 0.0 && c.r < 4096.0)) c.r = 0.0; if (!(c.g >= 0.0 && c.g < 4096.0)) c.g = 0.0; if (!(c.b >= 0.0 && c.b < 4096.0)) c.b = 0.0; gl_FragColor = vec4(min(c.rgb, vec3(48.0)), 1.0); }' };

const RIM_V = /* glsl */`varying vec3 vN; varying vec3 vV; varying vec3 vW;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * mv; }`;
const RIM_F = /* glsl */`uniform vec3 uSun; uniform vec3 uColor; uniform float uK; varying vec3 vN; varying vec3 vV; varying vec3 vW;
void main() { float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.6); float day = smoothstep(-0.25, 0.45, dot(normalize(vW), uSun));
  gl_FragColor = vec4(uColor * f * day * uK, 1.0); }`;

/** Give a plain textured Earth its night lights, its clouds and the thin blue line of its air. */
export function dressEarth(earth, R, sun) {
  const tl = new THREE.TextureLoader(), night = tl.load('textures/earth_night.jpg'); night.colorSpace = THREE.SRGBColorSpace;
  earth.material.emissiveMap = night; earth.material.emissive = new THREE.Color(1.0, 0.82, 0.55); earth.material.emissiveIntensity = 0.9;
  // city lights only on the night side: fade them out where the Sun is up
  const sunW = sun.clone().normalize(), uSunV = { value: new THREE.Vector3() }, prev = earth.material.onBeforeCompile;
  earth.material.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uSunV = uSunV;
    sh.fragmentShader = sh.fragmentShader.replace('uniform vec3 diffuse;', 'uniform vec3 diffuse;\nuniform vec3 uSunV;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  totalEmissiveRadiance *= 1.0 - smoothstep(-0.14, 0.16, dot(normalize(normal), uSunV));');
  };
  earth.material.needsUpdate = true;
  const before = earth.onBeforeRender;
  earth.onBeforeRender = function (r, sc, cam, ...rest) { uSunV.value.copy(sunW).transformDirection(cam.matrixWorldInverse); if (before) before.call(this, r, sc, cam, ...rest); };
  const ct = tl.load('textures/earth_clouds.jpg');
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(R * 1.0035, 128, 64), new THREE.MeshLambertMaterial({ color: new THREE.Color(0.46, 0.46, 0.47), alphaMap: ct, transparent: true, depthWrite: false }));
  clouds.renderOrder = 1; earth.add(clouds);
  const rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.013, 128, 64), new THREE.ShaderMaterial({ vertexShader: RIM_V, fragmentShader: RIM_F,
    uniforms: { uSun: { value: sun.clone().normalize() }, uColor: { value: new THREE.Color(0.30, 0.56, 1.0) }, uK: { value: 1.25 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  rim.renderOrder = 2; earth.add(rim);
  return { clouds, rim };
}
/** The same thin glowing edge for another world (Mars is dusty orange, the giants pale). */
export function rimLight(mesh, R, sun, color, k = 1.2) {
  const rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.01, 96, 48), new THREE.ShaderMaterial({ vertexShader: RIM_V, fragmentShader: RIM_F,
    uniforms: { uSun: { value: sun.clone().normalize() }, uColor: { value: new THREE.Color(...color) }, uK: { value: k } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  mesh.add(rim); return rim;
}

export class Cine {
  constructor(renderer, root, bg, bgCam, fg, cam) {
    this.renderer = renderer; this.cam = cam; this.t = 0;
    try {
      const c = this.composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));   // 4x smoothing of edges, or thin lattice work would shimmer
      this.p1 = new RenderPass(bg, bgCam); this.p2 = new RenderPass(fg, cam); this.p2.clear = false; this.p2.clearDepth = true;
      this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.5, 0.62, 1.22);
      c.addPass(this.p1); c.addPass(this.p2); c.addPass(new ShaderPass(CLEAN)); c.addPass(this.bloom); c.addPass(new OutputPass());
    } catch (e) { console.warn('cinema layer off', e); this.composer = null; }
    this.bg = bg; this.bgCam = bgCam; this.fg = fg;
    const d = this.dom = document.createElement('div'); d.className = 'cine';
    d.innerHTML = '<i class="cine-vig"></i><i class="cine-grain"></i><i class="cine-bar t"></i><i class="cine-bar b"></i><i class="cine-cut"></i>';
    root.querySelector('canvas').after(d);
    this.cutEl = d.querySelector('.cine-cut');
    this.frames = 0; this.plain = false;
    // a switch for the effects, in case a graphics card does not get on with them
    const right = root.querySelector('.a-right');
    if (right) {
      const b = this.fxBtn = document.createElement('button'); b.className = 'a-skip a-fx'; b.title = 'Film effects (glow) on or off. Turn them off if the picture is black or slow.';
      const paint = () => { b.textContent = this.plain ? 'Effects off' : 'Effects on'; };
      b.addEventListener('click', (e) => { e.stopPropagation(); this.plain = !this.plain; this.user = true; paint(); });
      paint(); this._paint = paint; right.prepend(b);
    }
  }
  setSize(w, h, pr) { if (this.composer) { this.composer.setPixelRatio(pr); this.composer.setSize(w, h); } }
  /** A cut to a new shot: a very short dip to black. */
  cut() { const e = this.cutEl; e.classList.remove('go'); void e.offsetWidth; e.classList.add('go'); }
  /** shake 0..1: how hard the camera trembles (lift-off, engine burns close by). */
  render(ready, shake = 0, dt = 1 / 60) {
    this.t += dt;
    if (shake > 0.001 && ready) {
      const t = this.t, a = shake * 0.55;
      this.cam.position.x += (Math.sin(t * 61.3) + Math.sin(t * 37.1 + 1.3)) * a * 0.5;
      this.cam.position.y += (Math.sin(t * 53.7 + 0.7) + Math.sin(t * 29.9 + 2.1)) * a * 0.5;
      this.cam.rotation.z += Math.sin(t * 43.3) * shake * 0.0035;
    }
    if (this.composer && !this.plain) {
      try {
        this.p2.enabled = !!ready; this.composer.render(dt);
        // self-check: if the finished picture is pure black where the plain picture is not, switch the effects off
        if (ready && !this.user && (++this.frames === 45 || this.frames === 200)) {
          const gl = this.renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4);
          const sum = () => { let s = 0; for (const [x, y] of [[0.5, 0.5], [0.3, 0.4], [0.7, 0.6], [0.5, 0.25], [0.62, 0.8], [0.2, 0.7], [0.8, 0.3]]) { gl.readPixels(Math.floor(w * x), Math.floor(h * y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); s += px[0] + px[1] + px[2]; } return s; };
          const withFx = sum();
          if (withFx === 0) {
            const r = this.renderer; r.setRenderTarget(null); r.clear(); r.render(this.bg, this.bgCam); r.clearDepth(); r.render(this.fg, this.cam);
            if (sum() > 0) { this.plain = true; if (this._paint) this._paint(); console.warn('film effects switched off: they came out black on this graphics card'); }
          }
        }
        return;
      } catch (e) { console.warn('cinema layer failed, plain picture', e); this.composer = null; this.plain = true; if (this._paint) this._paint(); }
    }
    const r = this.renderer; r.setRenderTarget(null); r.clear(); r.render(this.bg, this.bgCam); r.clearDepth(); if (ready) r.render(this.fg, this.cam);
  }
  dispose() { if (this.composer) { for (const p of this.composer.passes) if (p.dispose) p.dispose(); this.composer.dispose(); } this.dom.remove(); }
}
