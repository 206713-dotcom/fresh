// A deep-space sky for the featured animations: sharp stars computed in the shader (so they stay sharp however
// close a mirror shows them), a painted Milky Way, and the same stars added to the reflection of polished metal.
// The star field is a picture for the eye (bright, dense, coloured), not a catalogue of real stars.

import * as THREE from 'three';

export const SKY_U = { uSkyT: { value: 0 }, uSkyRot: { value: new THREE.Matrix3() } };

export const STAR_GLSL = /* glsl */`
uniform float uSkyT; uniform mat3 uSkyRot;
vec3 skH3(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
// one layer of stars on the faces of a cube round the viewer: N cells along a face, dens of them hold a star
vec3 skLayer(vec3 d, float N, float dens, float size, float seed, float spike) {
  vec3 a = abs(d); vec2 uv; float face;
  if (a.x >= a.y && a.x >= a.z) { uv = d.yz / a.x; face = d.x > 0.0 ? 0.0 : 1.0; }
  else if (a.y >= a.z) { uv = d.xz / a.y; face = d.y > 0.0 ? 2.0 : 3.0; }
  else { uv = d.xy / a.z; face = d.z > 0.0 ? 4.0 : 5.0; }
  vec2 g = (uv * 0.5 + 0.5) * N, ip = floor(g), fp = fract(g);
  vec3 r = skH3(vec3(ip, face * 17.0 + seed)), r2 = skH3(vec3(ip.yx + 3.7, face * 5.0 + seed * 1.7));
  if (r.z > dens) return vec3(0.0);
  vec2 dv = (fp - (0.2 + 0.6 * r.xy)) / N * 2.0 * pow(1.0 / (1.0 + dot(uv, uv)), 0.75);      // roughly an angle
  float q = dot(dv, dv), mag = 0.25 + 2.6 * pow(r2.x, 5.0), tw = 0.8 + 0.2 * sin(uSkyT * (1.5 + 4.0 * r2.y) + r2.z * 40.0);
  float b = exp(-q / (size * size)) * mag * tw;
  if (spike > 0.0 && r2.x > 0.55) {                                                              // the brightest get Webb's own six points
    float s = 0.0; for (int k = 0; k < 3; k++) { float an = 0.5236 + float(k) * 1.0472; vec2 dir = vec2(cos(an), sin(an)); float al = abs(dot(dv, dir)), pe = abs(dot(dv, vec2(-dir.y, dir.x))); s += exp(-pe / (size * 0.16)) * exp(-al / (size * 5.0)); }
    b += s * mag * 0.55 * spike;
  }
  vec3 col = mix(vec3(0.62, 0.76, 1.0), vec3(1.0, 0.74, 0.5), smoothstep(0.25, 0.95, r2.y)); col = mix(col, vec3(1.0), 0.45);
  return col * b;
}
vec3 skStars(vec3 d, float spike) { d = uSkyRot * d; float w = max(1.0, spike); return skLayer(d, 58.0, 0.6, 0.00085 * w, 1.0, 0.0) * 0.7 + skLayer(d, 21.0, 0.42, 0.0013 * w, 7.0, 0.0) * 1.2 + skLayer(d, 6.0, 0.3 * w, 0.002 * w, 13.0, spike) * 2.4; }
vec2 skEq(vec3 d) { return vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5); }
`;

let _mw = null;
/** the Milky Way, painted as a wide picture of the whole sky: a glowing band with dark dust lanes and a few coloured clouds */
export function milkyTexture() {
  if (_mw) return _mw;
  const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#020308'; x.fillRect(0, 0, W, H);
  let s = 41; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // the band follows a tilted great circle: y(u) on the picture
  const yb = (u) => H / 2 + Math.sin(u / W * Math.PI * 2 + 1.1) * H * 0.2;
  const blob = (cx, cy, q, col, al) => { for (const dx of [-W, 0, W]) { const g = x.createRadialGradient(cx + dx, cy, 0, cx + dx, cy, q); g.addColorStop(0, `rgba(${col},${al})`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.fillRect(cx + dx - q, cy - q, q * 2, q * 2); } };
  x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 900; i++) { const u = r() * W, k = Math.pow(r(), 1.6) * (r() < 0.5 ? -1 : 1), core = Math.exp(-Math.pow(((u / W + 0.62) % 1 - 0.5) * 3.2, 2)); blob(u, yb(u) + k * (60 + 90 * core), 26 + r() * 90, r() < 0.3 ? '150,170,255' : r() < 0.7 ? '255,225,190' : '255,190,150', 0.018 + 0.05 * core * r()); }
  for (let i = 0; i < 60; i++) { const u = r() * W; blob(u, yb(u) + (r() - 0.5) * 160, 18 + r() * 44, r() < 0.5 ? '255,120,150' : '110,170,255', 0.05 + r() * 0.06); }       // glowing gas clouds
  x.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 260; i++) { const u = r() * W; blob(u, yb(u) + (r() - 0.5) * 70, 10 + r() * 50, '2,3,8', 0.1 + r() * 0.28); }                                      // dust lanes
  _mw = new THREE.CanvasTexture(c); _mw.colorSpace = THREE.SRGBColorSpace; _mw.wrapS = THREE.RepeatWrapping; return _mw;
}

/** the sky itself: a huge ball round the camera. k = brightness of the stars, mw = of the Milky Way */
export function skyDome(k = 1, mw = 1) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.ShaderMaterial({
    uniforms: { ...SKY_U, uMW: { value: milkyTexture() }, uK: { value: k }, uM: { value: mw } }, side: THREE.BackSide, depthWrite: false, depthTest: false, toneMapped: false,
    vertexShader: 'varying vec3 vD; void main() { vD = position; vec4 p = modelViewMatrix * vec4(position, 0.0); gl_Position = projectionMatrix * vec4(p.xyz, 1.0); gl_Position.z = gl_Position.w; }',
    fragmentShader: `${STAR_GLSL} uniform sampler2D uMW; uniform float uK, uM; varying vec3 vD;
      void main() { vec3 d = normalize(vD); vec3 c = skStars(d, 1.0) * uK + texture2D(uMW, skEq(uSkyRot * d)).rgb * uM; gl_FragColor = vec4(c, 1.0); }`,
  }));
  m.renderOrder = -10; m.frustumCulled = false; m.userData.own = true; return m;
}

/** let a polished metal show the stars too. k = how strongly (more than is true, on purpose) */
export function addStars(material, k = 2.5, spike = 1) {
  material.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, SKY_U, { uStarK: { value: k }, uStarSp: { value: spike } });
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n${STAR_GLSL}\nuniform float uStarK, uStarSp;`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
        { vec3 skR = inverseTransformDirection(reflect(-normalize(vViewPosition), normal), viewMatrix);
          reflectedLight.indirectSpecular += material.specularColor * skStars(skR, uStarSp) * uStarK * (1.0 - 0.6 * material.roughness); }`);
  };
  material.customProgramCacheKey = () => `stars${k}${spike}`;
  return material;
}

/** turn the whole sky slowly (call every frame) */
export function turnSky(t) { SKY_U.uSkyT.value = t; const a = t * 0.004, c = Math.cos(a), s = Math.sin(a); SKY_U.uSkyRot.value.set(c, 0, s, 0, 1, 0, -s, 0, c); }
