// GLSL for the planets. Lighting is computed in each body's own (mesh-local) frame, with the
// Sun direction, camera position and eclipse occluder passed as uniforms computed on the CPU
// in double precision. No world-space positions ever reach the GPU.

const ECLIPSE = /* glsl */`
// Fraction of the solar disc visible from point p. occ = (centre, radius) of an occluding body,
// L = unit direction to the Sun, sunAng = angular radius of the Sun (rad).
float sunVisible(vec3 p, vec3 L, float sunAng, vec4 occ) {
  vec3 d = occ.xyz - p;
  float dist = length(d);
  if (occ.w <= 0.0 || dist <= occ.w) return 1.0;
  vec3 dn = d / dist;
  float c = dot(L, dn);
  if (c <= 0.0) return 1.0;
  float th = atan(length(cross(L, dn)), c);
  float ao = asin(clamp(occ.w / dist, 0.0, 1.0));
  float inner = abs(sunAng - ao), outer = sunAng + ao;
  float full = ao >= sunAng ? 0.0 : 1.0 - (ao * ao) / (sunAng * sunAng);
  return mix(full, 1.0, smoothstep(inner, outer, th));
}
`;

export const bodyVertex = /* glsl */`
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  vUv = uv;
  vN = normal;
  vP = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}
`;

export const earthFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uSpec;
uniform sampler2D uClouds;
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform vec4 uOcc;
uniform float uSunAng;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
${ECLIPSE}
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN);
  vec3 L = normalize(uSunL);
  vec3 V = normalize(uCamL - vP);
  float ndl = dot(N, L);
  // which way the Sun lies across the map from here (east, north), to throw the cloud shadows the right way
  vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), N) + vec3(1e-5, 0.0, 0.0)), north = cross(N, east);
  vec2 toSun = vec2(dot(L, east) / (6.2832 * max(sqrt(1.0 - N.y * N.y), 0.25)), dot(L, north) / 3.1416);
  float slant = clamp(1.0 / max(ndl, 0.12), 1.0, 6.0);                       // long shadows when the Sun is low
  float cloudHere = texture2D(uClouds, vUv).r;
  float cloudShadow = texture2D(uClouds, vUv + toSun * 0.0042 * slant).r;
  float vis = sunVisible(vP, L, uSunAng, uOcc);
  vec3 day = texture2D(uDay, vUv).rgb;
  float ocean = texture2D(uSpec, vUv).r;
  float lit = clamp(ndl, 0.0, 1.0) * vis;
  float dayMix = smoothstep(-0.10, 0.20, ndl) * mix(0.25, 1.0, vis);
  // Open ocean seen from space is a deep, dark navy: water absorbs most of the light that falls on
  // it. The colour maps paint every sea one flat bright blue, so the water colour is made here
  // instead: dark navy in the open ocean, lighter and greener over the shallow shelves near the
  // coasts (found by blurring the land/sea mask), and sea ice and bright painted shallows kept.
  float lum = dot(day, vec3(0.2126, 0.7152, 0.0722));
  float o = smoothstep(0.35, 0.65, ocean) * (1.0 - smoothstep(0.16, 0.42, lum));
  float coast = 1.0 - texture2D(uSpec, vUv, 3.5).r;
  vec3 deep = vec3(0.0026, 0.0090, 0.0330);
  vec3 shelf = vec3(0.0055, 0.0265, 0.0440);
  vec3 water = mix(deep, shelf, smoothstep(0.04, 0.5, coast));
  day = mix(day, water, o);
  // the relief of the land: a little lighter on slopes that face the Sun, darker behind them (read from the map itself)
  float lumS = dot(texture2D(uDay, vUv + toSun * 0.0016).rgb, vec3(0.2126, 0.7152, 0.0722));
  float relief = clamp((lum - lumS) * 2.2, -0.22, 0.22) * (1.0 - o) * smoothstep(0.0, 0.5, ndl) * (1.0 - smoothstep(0.55, 0.9, lum));
  vec3 col = day * (0.012 + 1.15 * lit * (1.0 + relief));
  col *= 1.0 - 0.52 * smoothstep(0.18, 0.75, cloudShadow) * smoothstep(-0.05, 0.25, ndl);      // cloud shadows on land and sea
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float ndv = max(dot(N, V), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
  // water reflects the sky more at a grazing angle, and the Sun as a soft silvery glint
  col += vec3(0.07, 0.12, 0.22) * fres * o * lit;
  col += vec3(1.0, 0.96, 0.88) * (pow(nh, 260.0) * 0.22 + pow(nh, 40.0) * 0.035) * (0.4 + fres) * o * lit;
  float tw = smoothstep(-0.09, 0.0, ndl) * (1.0 - smoothstep(0.0, 0.13, ndl));
  col += vec3(0.95, 0.40, 0.16) * tw * 0.010;
  vec3 night = texture2D(uNight, vUv).rgb;
  col += night * pow(1.0 - dayMix, 2.0) * vec3(1.0, 0.80, 0.52) * 1.75 * (1.0 - 0.72 * smoothstep(0.25, 0.8, cloudHere));      // city lights, dimmed under cloud
  // a thin, pale blue haze that thickens toward the edge of the disc (a longer path through the air)
  float rim = pow(1.0 - ndv, 2.6);
  col = mix(col, vec3(0.32, 0.47, 0.78) * (0.15 + 0.85 * lit), rim * smoothstep(-0.25, 0.5, ndl) * 0.5);
  col += vec3(0.010, 0.020, 0.046) * lit * (0.55 + 0.45 * (1.0 - ndv));   // blue light scattered by the air over the whole sunlit side
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const cloudFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D uClouds;
uniform vec3 uSunL;
uniform vec4 uOcc;
uniform float uSunAng;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
${ECLIPSE}
float chash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float cnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(chash(i), chash(i + vec2(1.0, 0.0)), f.x), mix(chash(i + vec2(0.0, 1.0)), chash(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN);
  vec3 L = normalize(uSunL);
  float ndl = dot(N, L);
  float vis = sunVisible(vP, L, uSunAng, uOcc);
  float a = texture2D(uClouds, vUv).r;
  vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), N) + vec3(1e-5, 0.0, 0.0)), north = cross(N, east);
  vec2 toSun = vec2(dot(L, east) / (6.2832 * max(sqrt(1.0 - N.y * N.y), 0.25)), dot(L, north) / 3.1416);
  // thick cloud between here and the Sun shades this bit of cloud: that is what makes cloud tops look heaped up
  float aSun = texture2D(uClouds, vUv + toSun * 0.0028).r;
  float body = clamp(1.0 - (aSun - a) * 2.4, 0.55, 1.25);
  // fine curdled detail so the edges stay crisp close up
  float d1 = cnoise(vUv * vec2(520.0, 260.0)), d2 = cnoise(vUv * vec2(1700.0, 850.0) + 7.3);
  a = clamp(a * (0.80 + 0.40 * d1) + (d2 - 0.5) * 0.10 * smoothstep(0.05, 0.4, a), 0.0, 1.0);
  float dens = smoothstep(0.06, 0.82, a);
  float lit = clamp(ndl * 1.15 + 0.06, 0.0, 1.0) * vis;
  // low Sun: the light has crossed a lot of air and turned orange-pink
  float low = smoothstep(0.22, 0.0, ndl) * smoothstep(-0.12, 0.02, ndl);
  vec3 tint = mix(vec3(1.0), vec3(1.0, 0.62, 0.42), low * 0.7);
  vec3 c = tint * lit * body * (0.86 + 0.24 * dens) + vec3(0.016, 0.019, 0.027) * (1.0 - smoothstep(-0.2, 0.1, ndl));      // a breath of light on the night side
  float alpha = dens * (0.90 * smoothstep(-0.30, 0.10, ndl) + 0.07) * uOpacity;
  gl_FragColor = vec4(c, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Rocky bodies: blend of Lambert and Lommel-Seeliger (the regolith law that makes the full
// Moon look flat instead of limb-darkened).
export const rockyFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D uMap;
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform vec4 uOcc;
uniform float uSunAng;
uniform float uLS;
uniform float uGain;
uniform vec3 uRim;
uniform float uAmbient;
uniform vec3 uEarthL;
uniform float uShine;
uniform sampler2D uDetail;
uniform float uDetailScale;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
${ECLIPSE}
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN);
  vec3 L = normalize(uSunL);
  vec3 V = normalize(uCamL - vP);
  // Two octaves of regolith detail fade in as the camera gets closer, so the surface keeps
  // looking cratered between orbit and the close-up patch (the global map is ~10 km/pixel).
  float dist = length(uCamL - vP) / uDetailScale;
  float w1 = 1.0 - smoothstep(700.0, 4500.0, dist);
  float w2 = 1.0 - smoothstep(50.0, 420.0, dist);
  float d1 = texture2D(uDetail, vUv * vec2(512.0, 256.0)).r / 0.78;
  float d2 = texture2D(uDetail, vUv * vec2(4096.0, 2048.0)).r / 0.78;
  float detail = mix(1.0, d1, 0.6 * w1) * mix(1.0, d2, 0.55 * w2);
  float mu0 = max(dot(N, L), 0.0);
  float mu = max(dot(N, V), 0.0);
  float ls = min(2.0 * mu0 / (mu0 + mu + 1e-4), 1.4);
  float shade = mix(mu0, ls, uLS);
  float vis = sunVisible(vP, L, uSunAng, uOcc);
  vec3 albedo = texture2D(uMap, vUv).rgb * detail;
  // earthshine: sunlight bounced off the Earth faintly lights the Moon's night side (zero on Mars)
  float shine = uShine * max(dot(N, normalize(uEarthL)), 0.0);
  vec3 col = albedo * (shade * vis * uGain + uAmbient + shine * vec3(0.78, 0.86, 1.0));
  float rim = pow(1.0 - mu, 4.0) * smoothstep(-0.2, 0.4, dot(N, L));
  col += uRim * rim;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const haloFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform vec3 uColor;
uniform float uPower;
uniform float uStrength;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN);
  vec3 V = normalize(uCamL - vP);
  float f = pow(1.0 - abs(dot(N, V)), uPower);
  float day = smoothstep(-0.35, 0.35, dot(N, normalize(uSunL)));
  gl_FragColor = vec4(uColor * f * day * uStrength, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// The air of the Earth seen edge-on: a thin bright line right at the horizon, fading to deep blue above it,
// and turning orange where the Sun is rising or setting.
export const earthAirFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uSunL;
uniform vec3 uCamL;
uniform float uStrength;
uniform float uLimb;        // where on this shell the solid planet's edge falls (0..1)
varying vec2 vUv;
varying vec3 vN;
varying vec3 vP;
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN), V = normalize(uCamL - vP), L = normalize(uSunL);
  float edge = 1.0 - abs(dot(N, V));
  float inner = pow(clamp(edge / uLimb, 0.0, 1.0), 4.5);                 // builds up toward the horizon ...
  float outer = pow(1.0 - smoothstep(uLimb, 1.0, edge), 2.2);            // ... and thins out above it
  float line = exp(-pow((edge - uLimb) / 0.022, 2.0));                   // the bright thin line of the horizon itself
  float ndl = dot(N, L);
  float day = smoothstep(-0.32, 0.30, ndl);
  float dusk = smoothstep(-0.34, -0.02, ndl) * (1.0 - smoothstep(-0.02, 0.36, ndl));
  vec3 col = mix(vec3(0.36, 0.62, 1.0), vec3(0.08, 0.24, 0.95), smoothstep(uLimb - 0.05, 1.0, edge));
  col = mix(col, vec3(1.0, 0.42, 0.14), dusk * 0.7 * smoothstep(uLimb - 0.16, uLimb, edge));      // sunrise and sunset colour, at the horizon only
  float f = inner * outer * 0.8 + line * 0.3;
  gl_FragColor = vec4(col * f * day * uStrength, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const starVertex = /* glsl */`
#include <common>
#include <logdepthbuf_pars_vertex>
attribute float size;
attribute vec3 color;
uniform float uPixelRatio;
varying vec3 vColor;
void main() {
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  #include <logdepthbuf_vertex>
}
`;

export const starFragment = /* glsl */`
#include <common>
#include <logdepthbuf_pars_fragment>
varying vec3 vColor;
uniform float uFade;
void main() {
  #include <logdepthbuf_fragment>
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  gl_FragColor = vec4(vColor * a * a * uFade, 1.0);
}
`;
