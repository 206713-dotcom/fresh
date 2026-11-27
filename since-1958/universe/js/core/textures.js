// Loads the photographic maps.
//
// Every map exists at several widths (1k = 1024 px ... 8k = 8192 px). The page
// starts with the small ones so it opens quickly, then swaps in sharper
// versions for whichever body the camera is visiting and drops them again
// afterwards, so graphics memory stays bounded.
import * as THREE from '../three.js';

export const LEVELS = ['1k', '2k', '4k', '8k'];

export class TextureStore {
  constructor(renderer, base = 'textures/') {
    this.base = base;
    this.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // Decoding off the main thread avoids a stutter when a big map arrives.
    this.bitmaps = typeof createImageBitmap === 'function';
    if (this.bitmaps) {
      this.bitmapLoader = new THREE.ImageBitmapLoader();
      this.bitmapLoader.setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
    }
    this.imageLoader = new THREE.TextureLoader();
  }

  /**
   * @param {string} file  e.g. "earth_day_4k.webp"
   * @param {object} kind  { srgb, channels: 1|2|4, repeat, mipmaps }
   * @returns {Promise<THREE.Texture>}
   */
  async load(file, kind = {}) {
    const url = this.base + file;
    let tex;
    if (this.bitmaps) {
      try {
        const bitmap = await this.bitmapLoader.loadAsync(url);
        tex = new THREE.Texture(bitmap);
        tex.flipY = false;   // already flipped while decoding
      } catch {
        this.bitmaps = false;   // older browser: fall back to plain images
      }
    }
    if (!tex) tex = await this.imageLoader.loadAsync(url);
    tex.colorSpace = kind.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    // Single-channel maps (clouds, water mask, height) take a quarter of the memory this way.
    if (kind.channels === 1) tex.format = THREE.RedFormat;
    else if (kind.channels === 2) tex.format = THREE.RGFormat;
    tex.wrapS = kind.repeat === false ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    const mips = kind.mipmaps !== false;
    tex.generateMipmaps = mips;
    tex.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = mips ? this.anisotropy : 1;
    tex.needsUpdate = true;
    return tex;
  }
}

// A 1x1 texture to stand in until a real one arrives.
export function pixel(r, g, b, a = 255) {
  const t = new THREE.DataTexture(new Uint8Array([r, g, b, a]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.needsUpdate = true;
  return t;
}

/**
 * One map slot on a body: knows which files exist and which one is showing.
 * `caps` limits the level per quality tier, e.g. { medium: '2k', high: '4k' }.
 */
export class MapSlot {
  constructor(store, uniform, name, levels, kind = {}, caps = {}) {
    this.store = store;
    this.uniform = uniform;   // the shader uniform object { value }
    this.name = name;
    this.levels = levels;
    this.kind = kind;
    this.caps = caps;
    this.ext = kind.ext ?? 'webp';
    this.base = null;         // the smallest map, kept for the whole session
    this.detail = null;       // the sharper map, while this body is being visited
    this.shown = -1;
    this.wanted = -1;
  }

  file(i) { return `${this.name}_${this.levels[i]}.${this.ext}`; }

  async loadBase() {
    this.base = await this.store.load(this.file(0), this.kind);
    this.uniform.value = this.base;
    this.shown = this.wanted = 0;
  }

  /** Ask for the best level not above `limit` (a level name) for this tier. */
  async want(limit, tierName) {
    const cap = this.caps[tierName] ?? limit;
    const max = Math.min(LEVELS.indexOf(limit), LEVELS.indexOf(cap));
    let i = 0;
    for (let k = 0; k < this.levels.length; k++) if (LEVELS.indexOf(this.levels[k]) <= max) i = k;
    if (i === this.wanted) return;
    this.wanted = i;
    if (i === 0) return this._show(this.base, 0);
    const tex = await this.store.load(this.file(i), this.kind);
    if (this.wanted !== i) { tex.dispose(); tex.source.data?.close?.(); return; }   // superseded while loading
    this._show(tex, i);
  }

  _show(tex, i) {
    const old = this.detail;
    this.uniform.value = tex;
    this.detail = i === 0 ? null : tex;
    this.shown = i;
    if (old && old !== tex) { old.dispose(); old.source.data?.close?.(); }
  }
}
