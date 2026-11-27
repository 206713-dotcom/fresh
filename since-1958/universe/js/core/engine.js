// Renderer, post-processing and the quality system.
//
// The scene is drawn into a floating-point (HDR) buffer, because the Sun is
// thousands of times brighter than a planet's night side. A final pass then
// behaves like a camera: it applies the exposure, lets the very brightest
// pixels bloom a little as a real lens does, and maps the result to the
// screen with a neutral tone curve, so the photographic maps keep the colours
// they were shot with.
import * as THREE from '../three.js';

// detail: sharpest map loaded for the body being visited. starMag: faintest stars drawn.
export const TIERS = {
  low:    { label: 'Low',    dpr: 1.0, msaa: 0, steps: 6,  detail: '2k', starMag: 6.5, glow: '2k' },
  medium: { label: 'Medium', dpr: 1.5, msaa: 2, steps: 8,  detail: '4k', starMag: 7.3, glow: '2k' },
  high:   { label: 'High',   dpr: 2.0, msaa: 2, steps: 12, detail: '8k', starMag: 8.0, glow: '4k' },
  ultra:  { label: 'Ultra',  dpr: 2.5, msaa: 4, steps: 16, detail: '8k', starMag: 8.0, glow: '4k' },
};
export const TIER_ORDER = ['low', 'medium', 'high', 'ultra'];
const STORE_KEY = 'since1958:universe:quality';

const copyShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() { gl_FragColor = texture2D(tDiffuse, vUv); }
  `,
};

const finalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uExposure: { value: 1.0 },
    uVignette: { value: 0.22 },
    uGrain: { value: 0.010 },
    uTime: { value: 0 },
    uAspect: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uExposure, uVignette, uGrain, uTime, uAspect;
    varying vec2 vUv;

    // Khronos PBR Neutral tone curve: leaves ordinary colours exactly as they
    // are and only rolls off the highlights, so nothing looks graded.
    vec3 neutral(vec3 c) {
      const float start = 0.76;
      const float desat = 0.15;
      float x = min(c.r, min(c.g, c.b));
      float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
      c -= offset;
      float peak = max(c.r, max(c.g, c.b));
      if (peak < start) return c;
      float d = 1.0 - start;
      float newPeak = 1.0 - d * d / (peak + d - start);
      c *= newPeak / peak;
      float g = 1.0 - 1.0 / (desat * (peak - newPeak) + 1.0);
      return mix(c, vec3(newPeak), g);
    }
    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c * vec2(uAspect, 1.0), c * vec2(uAspect, 1.0));
      vec3 col = max(texture2D(tDiffuse, vUv).rgb, 0.0) * uExposure;
      col *= 1.0 - uVignette * smoothstep(0.25, 1.1, r2);
      col = toSRGB(clamp(neutral(col), 0.0, 1.0));
      // A trace of sensor noise, and dithering so dark gradients do not band.
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col += (hash(gl_FragCoord.xy + fract(uTime) * 311.0) - 0.5) * uGrain * (1.0 - 0.7 * lum);
      col += (hash(gl_FragCoord.xy * 1.7 + 19.0) - 0.5) / 255.0;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,   // one scene spans a millionth of a unit to thousands
    });
    this.renderer.setPixelRatio(1);   // resolution is managed by hand, see resize()
    this.renderer.autoClear = true;
    this.renderer.setClearColor(0x000000, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1e5);

    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch { /* storage may be unavailable */ }
    this.mode = TIERS[saved] ? saved : 'auto';
    this.tierName = this.mode === 'auto' ? this._guessTier() : this.mode;
    this.resScale = 1;        // extra dynamic-resolution factor used in Auto
    this.listeners = [];
    this._frames = 0;
    this._acc = 0;
    this._slow = 0;
    this._settle = 2.5;       // seconds to ignore after any change (shader compiles)

    this._buildComposer();
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  // A first guess for Auto: phones and integrated graphics start one tier lower.
  // The governor below corrects it either way once real frame times are known.
  _guessTier() {
    const coarse = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 600;
    let gpu = '';
    try {
      const gl = this.renderer.getContext();
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    } catch { /* not available: fall through */ }
    const modest = /Intel|Iris|UHD|HD Graphics|Mali|Adreno|PowerVR|SwiftShader|llvmpipe|Basic Render/i.test(gpu);
    return coarse || modest ? 'medium' : 'high';
  }

  get tier() { return TIERS[this.tierName]; }
  get pixelScale() { return this._pixelScale; }

  onQualityChange(fn) { this.listeners.push(fn); }

  setMode(mode) {
    this.mode = mode;
    try { localStorage.setItem(STORE_KEY, mode); } catch { /* fine */ }
    if (mode !== 'auto') this._applyTier(mode);
    this.resScale = 1;
    this.resize();
  }

  _applyTier(name) {
    if (name === this.tierName) return;
    this.tierName = name;
    this._buildComposer();
    this.resize();
    this._settle = 2.5;
    for (const fn of this.listeners) fn(this.tier, name);
  }

  _buildComposer() {
    this.composer?.dispose();
    this.bloom?.dispose();
    this.sceneTarget?.dispose();
    // Only the scene itself needs depth and anti-aliasing. Keeping the
    // post-processing buffers plain saves a lot of graphics memory.
    this.sceneTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: this.tier.msaa, depthBuffer: true });
    const buffer = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false });
    this.composer = new THREE.EffectComposer(this.renderer, buffer);
    const copy = new THREE.ShaderPass(copyShader, 'unused');
    copy.uniforms.tDiffuse.value = this.sceneTarget.texture;
    this.composer.addPass(copy);
    // Bloom works on the raw HDR picture, so its threshold follows the exposure (see setExposure).
    this.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(4, 4), 0.30, 0.55, 1.05);
    this.composer.addPass(this.bloom);
    this.final = new THREE.ShaderPass(finalShader);
    this.composer.addPass(this.final);
    this.setExposure(this.exposure ?? 1);
  }

  resize() {
    const w = Math.max(1, this.canvas.clientWidth), h = Math.max(1, this.canvas.clientHeight);
    const scale = Math.min(devicePixelRatio || 1, this.tier.dpr) * this.resScale;
    const bw = Math.max(2, Math.round(w * scale)), bh = Math.max(2, Math.round(h * scale));
    this._pixelScale = bw / w;
    this.renderer.setSize(bw, bh, false);
    this.sceneTarget.setSize(bw, bh);
    this.composer.setSize(bw, bh);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.final.uniforms.uAspect.value = w / h;
    this.width = w;
    this.height = h;
  }

  /** How much light the "camera" gathers: 1 suits a sunlit planet, higher brings out stars and city lights. */
  setExposure(e) {
    this.exposure = e;
    this.final.uniforms.uExposure.value = e;
    this.bloom.threshold = 1.05 / e;
  }

  /** Call once per frame with the real frame time in seconds. */
  render(dt, time) {
    this.final.uniforms.uTime.value = time;
    this.renderer.setRenderTarget(this.sceneTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.composer.render(dt);
    this._govern(dt);
  }

  // Auto quality, checked about once a second: if frames are slow, first lower
  // the render resolution a little, and if that is not enough step down a tier.
  _govern(dt) {
    if (this.mode !== 'auto' || document.hidden) return;
    if (this._settle > 0) { this._settle -= dt; this._frames = 0; this._acc = 0; return; }
    this._frames++;
    this._acc += Math.min(dt, 1);
    if (this._acc < 1 || this._frames < 4) return;
    const fps = this._frames / this._acc;
    this._frames = 0; this._acc = 0;
    const lower = () => {
      const i = TIER_ORDER.indexOf(this.tierName);
      if (i > 0) { this.resScale = 0.9; this._applyTier(TIER_ORDER[i - 1]); return true; }
      return false;
    };
    if (fps < 24) {
      // Far too slow: do not creep, drop a whole tier now.
      if (!lower() && this.resScale > 0.62) { this.resScale = 0.6; this.resize(); this._settle = 0.6; }
      this._slow = 0;
    } else if (fps < 43) {
      this._slow++;
      if (this.resScale > 0.72) { this.resScale = Math.max(0.7, this.resScale * 0.88); this.resize(); this._settle = 0.6; }
      else if (this._slow >= 2) { lower(); this._slow = 0; }
    } else {
      this._slow = 0;
      if (fps > 57 && this.resScale < 1) { this.resScale = Math.min(1, this.resScale * 1.06); this.resize(); this._settle = 0.6; }
    }
  }
}
