// The Milky Way and the galaxies you can see with the naked eye, painted once at start-up.
// The fine structure is fractional Brownian motion (layered noise). The large structure follows the real sky:
// the bright bulge toward Sagittarius, the Great Rift of dust from Cygnus to Centaurus, the Coalsack,
// the star clouds of Scutum, Cygnus and Carina, and the red glow of the big nebulae, each at its real place.
// It is a picture, not a measurement: the real stars drawn on top (data/stars.js) are the measured part.
import * as THREE from 'three';

const NOISE = /* glsl */`
float h31(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float n3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(mix(h31(i), h31(i + vec3(1, 0, 0)), f.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), f.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 7; i++) { s += a * n3(p); p = p * 2.03 + vec3(17.1, 9.2, 5.3); a *= 0.5; } return s; }
float ridged(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 6; i++) { s += a * (1.0 - abs(2.0 * n3(p) - 1.0)); p = p * 2.07 + vec3(3.1, 27.2, 11.3); a *= 0.5; } return s; }
`;

const QUAD_VERT = /* glsl */`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const MILKY_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform float uBmax;
${NOISE}
const float D2R = 0.017453292519943295;
vec3 gdir(float l, float b) { l *= D2R; b *= D2R; return vec3(cos(b) * cos(l), cos(b) * sin(l), sin(b)); }
float gauss(float x, float s) { return exp(-x * x / (s * s)); }
float wrapd(float a) { return mod(a + 180.0, 360.0) - 180.0; }
float segd(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
// angular distance in degrees
float sep(vec3 d, float l, float b) { return acos(clamp(dot(d, gdir(l, b)), -1.0, 1.0)) / D2R; }
void main() {
  float l = vUv.x * 360.0, b = (vUv.y - 0.5) * 2.0 * uBmax;
  float lc = wrapd(l);                                   // longitude from the galactic centre, -180..180
  vec3 d = gdir(l, b);
  // domain warp: gives the clouds their curled look
  vec3 w = vec3(fbm(d * 6.0 + 1.7), fbm(d * 6.0 + 11.3), fbm(d * 6.0 + 23.9)) - 0.5;
  vec3 q = d + w * 0.07;
  float inner = gauss(lc, 62.0);
  // ---- light of the disc: how bright along the plane, how thick
  float A = 0.10 + 0.90 * inner;
  A += 0.34 * gauss(lc + 73.0, 15.0);                     // Carina
  A += 0.30 * gauss(lc - 74.0, 14.0);                     // Cygnus star cloud
  A += 0.24 * gauss(lc + 32.0, 14.0);                     // Norma and Centaurus
  A += 0.10 * gauss(lc - 135.0, 20.0);                    // Cassiopeia and Perseus
  float hgt = mix(3.4, 6.6, inner);
  float warpB = b - 1.2 * sin((lc + 20.0) * D2R) * (1.0 - inner);   // the plane is not perfectly flat
  float disc = A * exp(-pow(abs(warpB) / hgt, 1.5));
  float thin = A * exp(-pow(abs(warpB) / (hgt * 0.42), 1.6));        // the bright thin spine
  float bulge = 1.2 * exp(-(lc * lc / (13.0 * 13.0) + pow(abs(b), 1.8) / pow(7.5, 1.8)));
  bulge += 0.8 * exp(-(lc * lc / 30.0 + b * b / 16.0));
  float scutum = 0.9 * gauss(sep(d, 27.0, -2.5), 3.4);              // the Scutum star cloud
  float sgr = 1.0 * gauss(sep(d, 13.5, -3.6), 2.2);                 // the small Sagittarius star cloud (M24)
  // ---- star clouds: clumpy on several scales
  float c1 = fbm(q * 11.0), c2 = fbm(q * 34.0 + 4.0), c3 = fbm(q * 95.0 + 9.0);
  float clump = (0.20 + 1.9 * smoothstep(0.30, 0.70, c1)) * (0.35 + 1.3 * smoothstep(0.30, 0.72, c2)) * (0.6 + 0.8 * smoothstep(0.3, 0.7, c3));
  float stars = (disc * 0.42 + thin * 0.62) * clump + (scutum + sgr) * (0.6 + 0.8 * c2);
  float light = stars + bulge;
  // ---- dust: clouds and filaments of noise, concentrated where the real dark lanes are
  float n1 = fbm(q * 9.0 + 31.0), n2 = ridged(q * 21.0 + 2.0), n3 = fbm(q * 58.0 + 7.0);
  float cloud = smoothstep(0.50, 0.74, n1 * 0.62 + n2 * 0.42 + n3 * 0.16);
  float wisp = smoothstep(0.62, 0.9, n2) * (0.4 + n3);
  vec2 lb = vec2(lc, b) + w.xy * vec2(26.0, 13.0);                                       // wavy, never ruler-straight
  float rift = smoothstep(-100.0, -50.0, lc) * (1.0 - smoothstep(80.0, 98.0, lc));      // from Centaurus to Cygnus
  float bd = mix(-0.6, 3.4, smoothstep(-45.0, 60.0, lc));                                // drifts north toward Cygnus
  float wd = 1.7 + 2.0 * inner + 2.0 * gauss(lc - 36.0, 15.0);                           // widest in Aquila
  float dust = rift * gauss(lb.y - bd, wd) * (0.10 + 2.6 * cloud + 0.9 * wisp);
  dust += (0.35 + 1.15 * inner) * gauss(warpB + (n1 - 0.5) * 7.0, 2.6) * smoothstep(0.60, 0.80, n1 * 0.62 + n2 * 0.34 + n3 * 0.14);            // small dark clouds all along the plane
  dust += smoothstep(4.2, 0.4, segd(lb, vec2(7.0, 3.0), vec2(-7.0, 18.0))) * (0.15 + 2.2 * cloud + wisp);         // the Pipe and Ophiuchus clouds
  dust += smoothstep(3.6, 0.4, segd(lb, vec2(-13.0, 1.5), vec2(-22.0, 13.0))) * (0.1 + 1.6 * cloud + wisp);       // toward Lupus
  dust += smoothstep(5.0, 0.5, segd(lb, vec2(30.0, 3.5), vec2(48.0, -2.0))) * (0.1 + 1.5 * cloud);                // the fork in Aquila
  dust += 3.0 * smoothstep(3.6, 1.2, sep(d, 303.0, -0.6) * (0.7 + 0.7 * n1));                                     // the Coalsack
  dust += 1.3 * smoothstep(4.5, 1.0, sep(d, 84.0, -1.5) * (0.6 + 0.8 * n1));                                      // the Northern Coalsack in Cygnus
  dust += 0.9 * smoothstep(8.0, 1.5, sep(d, 172.0, -15.0) * (0.5 + 1.0 * n1)) * cloud;                            // the Taurus clouds
  float T = exp(-4.2 * dust);
  // ---- colour: warm old stars in the bulge, bluer young stars in the arms, reddened where dust thins the light
  vec3 colDisc = mix(vec3(0.55, 0.72, 1.0), vec3(1.0, 0.86, 0.66), clamp(inner * 0.85 + (c1 - 0.5) * 0.5, 0.0, 1.0));
  vec3 col = colDisc * stars * 0.80 + vec3(1.0, 0.74, 0.44) * bulge * (0.7 + 0.6 * c2) * 0.95;
  vec3 red = mix(vec3(1.0), vec3(0.95, 0.42, 0.30), smoothstep(0.02, 0.6, dust));
  col *= red * T;
  // ---- the red glow of hydrogen: the big nebulae at their real places (galactic longitude, latitude, size in degrees)
  vec3 hii = vec3(1.0, 0.24, 0.36);
  float neb = 0.0;
  neb += 1.6 * gauss(sep(d, 287.6, -0.6), 1.5);     // Carina Nebula
  neb += 1.1 * gauss(sep(d, 6.0, -1.2), 0.8);       // Lagoon
  neb += 0.9 * gauss(sep(d, 7.0, -0.3), 0.5);       // Trifid
  neb += 0.9 * gauss(sep(d, 15.1, -0.7), 0.7);      // Omega
  neb += 0.8 * gauss(sep(d, 17.0, 0.8), 0.7);       // Eagle
  neb += 1.0 * gauss(sep(d, 85.0, -0.8), 1.2);      // North America
  neb += 0.7 * gauss(sep(d, 78.2, 1.8), 1.6);       // Gamma Cygni
  neb += 0.7 * gauss(sep(d, 294.6, -1.6), 1.0);     // Lambda Centauri
  neb += 0.7 * gauss(sep(d, 134.8, 1.0), 1.4);      // Heart and Soul
  neb += 0.6 * gauss(sep(d, 206.3, -2.1), 0.8);     // Rosette
  neb += 1.2 * gauss(sep(d, 209.0, -19.4), 0.6);    // Orion Nebula
  neb += 0.5 * gauss(sep(d, 353.2, 0.7), 1.0);      // Cat's Paw and Lobster
  neb += 0.5 * gauss(sep(d, 160.6, -12.1), 1.3);    // California
  neb += 0.35 * gauss(sep(d, 99.3, 3.7), 1.4);      // IC 1396
  col += hii * neb * pow(fbm(q * 70.0 + 3.0) * 1.7, 2.0) * 0.50 * (0.35 + 0.65 * T);
  // ---- grain: the brightest clouds break up into countless faint stars
  vec2 px = floor(vUv * vec2(textureSize0()));
  float g = h31(vec3(px, 3.0)), g2 = h31(vec3(floor(px * 0.5), 9.0));
  float star = pow(g, 60.0) * 2.4 + pow(g2, 90.0) * 2.0;
  col += mix(colDisc, vec3(1.0), 0.5) * star * (light * T) * 1.6;
  // faint, wide halo so the band does not end in a hard edge
  col *= smoothstep(uBmax, uBmax * 0.82, abs(b));
  { float m = max(max(col.r, col.g), max(col.b, 1e-4)); col *= (1.0 - exp(-m * 1.5)) / m; }   // soft shoulder, like film, keeping the colour
  col = pow(col, vec3(1.22));                            // deeper blacks between the clouds
  col = max(mix(vec3(dot(col, vec3(0.3, 0.6, 0.1))), col, 1.32), 0.0);   // richer colour
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

const GALAXY_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform int uType;       // 0 Andromeda, 1 Triangulum, 2 Large Magellanic Cloud, 3 Small Magellanic Cloud
${NOISE}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float eg(vec2 p, vec2 c, vec2 s, float a) { vec2 q = rot(a) * (p - c); return exp(-(q.x * q.x / (s.x * s.x) + q.y * q.y / (s.y * s.y))); }
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec3 P = vec3(p * 3.0, float(uType) * 7.0);
  vec2 wv = vec2(fbm(P + 3.1), fbm(P + 19.7)) - 0.5;
  vec3 col = vec3(0.0);
  vec3 warm = vec3(1.0, 0.86, 0.64), blue = vec3(0.70, 0.82, 1.0), pink = vec3(1.0, 0.30, 0.45);
  if (uType == 0 || uType == 1) {
    // a tilted spiral disc: squash the minor axis back out to get the face-on radius and angle
    float tilt = uType == 0 ? 0.27 : 0.62, turns = uType == 0 ? 7.5 : 4.2;
    vec2 q = vec2(p.x, p.y / tilt) + wv * (uType == 0 ? 0.05 : 0.14);
    float r = length(q), th = atan(q.y, q.x);
    float f1 = fbm(vec3(q * 6.0, 2.0 + float(uType))), f2 = fbm(vec3(q * 22.0, 5.0));
    float arm = 0.5 + 0.5 * cos(2.0 * th - turns * log(r + 0.04) + (f1 - 0.5) * (uType == 0 ? 2.0 : 5.0));
    float disc = exp(-r * (uType == 0 ? 5.6 : 5.2));
    float arms = pow(arm, uType == 0 ? 1.6 : 1.2) * disc * (0.3 + 1.5 * smoothstep(0.3, 0.7, f2));
    if (uType == 0) {
      float ring = exp(-pow((r - 0.46) / 0.08, 2.0)) * 0.42 + exp(-pow((r - 0.72) / 0.10, 2.0)) * 0.16;   // Andromeda's rings of young stars
      float bulge = 1.9 * exp(-pow(length(vec2(p.x, p.y / 0.62)) * 9.0, 0.9)) + 2.5 * exp(-length(p) * 60.0);
      float lane = pow(1.0 - arm, 3.0) * smoothstep(0.08, 0.3, r) * smoothstep(1.0, 0.4, r);
      float near = smoothstep(0.25, -0.25, p.y / tilt * 0.6);                    // dust lanes show best on the near side
      float T = exp(-(1.6 + 1.6 * near) * lane * (0.5 + f2));
      col = warm * (disc * 0.55 + bulge) * T + blue * (arms * 1.5 + ring * (0.5 + f2)) * (0.6 + 0.4 * T);
      col += pink * pow(f2, 6.0) * ring * 5.0;
      col += warm * 1.5 * eg(p, vec2(0.02, -0.135), vec2(0.022, 0.018), 0.0);     // companion M32
      col += warm * 0.55 * eg(p, vec2(-0.20, 0.27), vec2(0.075, 0.042), 0.5);     // companion M110
      col *= smoothstep(0.98, 0.30, r) * 0.55;
    } else {
      float core = 1.1 * exp(-r * 16.0);
      col = blue * (arms * 2.4 + disc * 0.35) + warm * core;
      col += pink * pow(f2, 5.0) * disc * 4.0 * arm;
      col += pink * 1.2 * eg(q, vec2(0.38, 0.30), vec2(0.03, 0.03), 0.0);         // NGC 604
      col *= smoothstep(0.95, 0.15, r) * 0.60;
    }
  } else if (uType == 2) {
    vec2 q = p + wv * 0.55; q.x *= 1.12;
    float f1 = fbm(vec3(q * 3.2, 1.0)), f2 = fbm(vec3(q * 11.0, 4.0)), f3 = fbm(vec3(q * 34.0, 8.0));
    float body = exp(-dot(q, q) * 5.5) * (0.15 + 2.2 * smoothstep(0.3, 0.72, f1)) * (0.4 + 1.2 * smoothstep(0.3, 0.7, f2));
    float bar = eg(q, vec2(-0.03, -0.05), vec2(0.36, 0.085), 0.42) * (0.75 + 0.5 * f3);
    float armN = eg(q, vec2(0.05, 0.34), vec2(0.42, 0.10), -0.25) * f2 * 1.3;    // the ragged northern arm
    col = blue * (body * 1.1 + armN * 0.7) + mix(warm, vec3(1.0), 0.45) * bar * 1.25;
    col += pink * 2.4 * eg(q, vec2(0.30, 0.16), vec2(0.035, 0.035), 0.0);        // Tarantula Nebula
    col += pink * 0.8 * eg(q, vec2(0.30, 0.16), vec2(0.10, 0.08), 0.6) * f3;
    col += pink * pow(f3, 7.0) * body * 5.0;
    col += vec3(1.0) * pow(h31(vec3(floor(vUv * 512.0), 2.0)), 70.0) * (body + bar) * 4.0;
    col *= smoothstep(0.95, 0.25, length(p)) * 0.60;
  } else {
    vec2 q = p + wv * 0.45;
    float f1 = fbm(vec3(q * 3.6, 12.0)), f2 = fbm(vec3(q * 13.0, 15.0));
    float body = eg(q, vec2(-0.05, -0.05), vec2(0.36, 0.19), 0.0) * (0.15 + 2.0 * smoothstep(0.3, 0.72, f1)) * (0.4 + 1.2 * smoothstep(0.3, 0.7, f2));
    float head = eg(q, vec2(-0.22, -0.08), vec2(0.20, 0.14), 0.2) * (0.7 + 0.6 * f2);   // brighter south-west end
    float wing = eg(q, vec2(0.42, 0.06), vec2(0.22, 0.09), -0.35) * f1 * 1.1;           // the wing, toward the Large Cloud
    col = blue * (body * 0.9 + wing * 0.6) + mix(blue, vec3(1.0), 0.5) * head * 0.9;
    col += pink * pow(f2, 7.0) * body * 4.0;
    col += vec3(1.0) * pow(h31(vec3(floor(vUv * 512.0), 5.0)), 70.0) * body * 4.0;
    col *= smoothstep(0.95, 0.25, length(p)) * 0.58;
  }
  col = col * col / (col + 0.11);                        // faint outskirts sink into the black sky, as in a real photograph
  col = 1.0 - exp(-col * 1.6);
  col = max(mix(vec3(dot(col, vec3(0.3, 0.6, 0.1))), col, 1.5), 0.0);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

function bake(renderer, frag, w, h, uniforms) {
  const rt = new THREE.WebGLRenderTarget(w, h, { depthBuffer: false, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
  rt.texture.colorSpace = THREE.SRGBColorSpace; rt.texture.anisotropy = 8;
  const mat = new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: frag.replace('textureSize0()', `${w}.0, ${h}.0`), uniforms, depthTest: false, depthWrite: false });
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  quad.frustumCulled = false; scene.add(quad);
  const prev = renderer.getRenderTarget(), tm = renderer.toneMapping;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setRenderTarget(rt); renderer.render(scene, cam); renderer.setRenderTarget(prev);
  renderer.toneMapping = tm;
  mat.dispose(); quad.geometry.dispose();
  return rt;
}

// naked-eye galaxies: right ascension and declination (deg, J2000), size of the picture on the sky (deg), position angle of the long axis (deg, north through east)
const GALAXIES = [
  { name: 'Andromeda Galaxy (M31)', type: 0, ra: 10.685, dec: 41.269, size: 3.7, pa: 35, gain: 1.0 },
  { name: 'Triangulum Galaxy (M33)', type: 1, ra: 23.462, dec: 30.660, size: 1.5, pa: 23, gain: 0.7 },
  { name: 'Large Magellanic Cloud', type: 2, ra: 80.894, dec: -69.756, size: 12.5, pa: 100, gain: 0.72 },
  { name: 'Small Magellanic Cloud', type: 3, ra: 13.187, dec: -72.829, size: 6.5, pa: 45, gain: 0.7 },
];

/** Returns a group (in the same frame as the stars) holding the Milky Way band and the galaxies.
 *  galToEq: 3x3 rows used as in bodies.js (galactic -> equatorial), eqjToWorld: equatorial unit vector -> scene. */
export function makeDeepSky(renderer, GAL, eqjToWorld) {
  const group = new THREE.Group(), R = 0.9e9, tmp = new THREE.Vector3(), DEG = Math.PI / 180;
  const big = renderer.capabilities.maxTextureSize >= 4096, BMAX = 45;
  const rt = bake(renderer, MILKY_FRAG, big ? 4096 : 2048, big ? 1024 : 512, { uBmax: { value: BMAX } });
  // the band: a strip of the sky sphere laid out in galactic longitude and latitude
  const NU = 180, NV = 24, pos = new Float32Array((NU + 1) * (NV + 1) * 3), uv = new Float32Array((NU + 1) * (NV + 1) * 2), idx = [];
  for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
    const u = i / NU, v = j / NV, l = u * 2 * Math.PI, b = (v - 0.5) * 2 * BMAX * DEG, k = j * (NU + 1) + i;
    const gx = Math.cos(b) * Math.cos(l), gy = Math.cos(b) * Math.sin(l), gz = Math.sin(b);
    eqjToWorld(GAL[0][0] * gx + GAL[1][0] * gy + GAL[2][0] * gz, GAL[0][1] * gx + GAL[1][1] * gy + GAL[2][1] * gz, GAL[0][2] * gx + GAL[1][2] * gy + GAL[2][2] * gz, R, tmp);
    pos.set([tmp.x, tmp.y, tmp.z], k * 3); uv.set([u, v], k * 2);
    if (i < NU && j < NV) idx.push(k, k + 1, k + NU + 1, k + 1, k + NU + 2, k + NU + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
  rt.texture.wrapS = THREE.RepeatWrapping;
  const mk = (map, gain) => new THREE.MeshBasicMaterial({ map, color: new THREE.Color(gain, gain, gain), side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const band = new THREE.Mesh(geo, mk(rt.texture, 0.46)); band.frustumCulled = false; band.renderOrder = -12; group.add(band);
  group.userData.milkyRT = rt;
  group.userData.galDir = (lDeg, bDeg) => { const l = lDeg * DEG, b = bDeg * DEG, gx = Math.cos(b) * Math.cos(l), gy = Math.cos(b) * Math.sin(l), gz = Math.sin(b);
    return eqjToWorld(GAL[0][0] * gx + GAL[1][0] * gy + GAL[2][0] * gz, GAL[0][1] * gx + GAL[1][1] * gy + GAL[2][1] * gz, GAL[0][2] * gx + GAL[1][2] * gy + GAL[2][2] * gz, 1, new THREE.Vector3()); };
  // the galaxies: small pictures set on the sky at their real place, size and tilt
  const eq = (ra, dec) => new THREE.Vector3(Math.cos(dec * DEG) * Math.cos(ra * DEG), Math.cos(dec * DEG) * Math.sin(ra * DEG), Math.sin(dec * DEG));
  const toWorld = (v) => eqjToWorld(v.x, v.y, v.z, 1, new THREE.Vector3());
  group.userData.galaxies = []; group.userData.galRT = [];
  for (const g of GALAXIES) {
    const grt = bake(renderer, GALAXY_FRAG, 512, 512, { uType: { value: g.type } }), tex = grt.texture; group.userData.galRT.push(grt);
    const d = eq(g.ra, g.dec), east = new THREE.Vector3(0, 0, 1).cross(d).normalize(), north = d.clone().cross(east).normalize();
    const major = north.clone().multiplyScalar(Math.cos(g.pa * DEG)).addScaledVector(east, Math.sin(g.pa * DEG));
    const minor = d.clone().cross(major).normalize(), half = Math.tan(g.size / 2 * DEG);
    const P = new Float32Array(12), corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    corners.forEach(([x, y], k) => { const v = toWorld(d.clone().addScaledVector(major, x * half).addScaledVector(minor, y * half)).multiplyScalar(R * 0.99); P.set([v.x, v.y, v.z], k * 3); });
    const qg = new THREE.BufferGeometry();
    qg.setAttribute('position', new THREE.BufferAttribute(P, 3)); qg.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2)); qg.setIndex([0, 1, 2, 0, 2, 3]);
    const m = new THREE.Mesh(qg, mk(tex, g.gain)); m.frustumCulled = false; m.renderOrder = -11; group.add(m);
    group.userData.galaxies.push({ name: g.name, dir: toWorld(d) });
  }
  return group;
}
