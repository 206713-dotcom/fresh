// Every galaxy in the catalogue, drawn in one go. From far away each one is a
// small tilted smudge of light with its real position, colour class, tilt and
// relative brightness. Only the galaxy being visited is swapped for a detailed
// model (see galaxy.js); this layer then stays underneath as its soft glow.
import * as THREE from '../three.js';

const vertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 aNormal;
attribute vec4 aInfo;      // radius (Mpc), flattening, brightness, index
attribute vec3 aColor;
uniform float uPxPerRad;   // pixels per radian at the centre of the view
uniform float uLimit;      // galaxies farther than this from the Sun are hidden (Mpc)
uniform float uFocus;      // index of the galaxy shown as a detailed model, or -1
uniform float uFocusFade;  // 1 = that galaxy's smudge fully faded to a faint glow
uniform float uMaxPoint;
uniform float uGain;
uniform vec3 uShift;       // the point the camera is centred on
varying vec3 vColor;
varying vec3 vShape;       // major axis direction (xy) and apparent axis ratio
varying float vCore;
void main() {
  vec3 p = position - uShift;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = length(mv.xyz);
  float projPx = aInfo.x / dist * uPxPerRad;            // real radius, in pixels
  float lum = aInfo.z;
  // Far away a galaxy is smaller than a pixel, so it is drawn as a small dot
  // whose size and brightness follow how luminous it really is.
  float minPx = 1.5 + 2.6 * pow(lum, 0.22);
  float sizePx = max(projPx * 2.6, minPx * 2.0);
  float cover = clamp(projPx * 2.6 / sizePx, 0.0, 1.0);
  float bright = pow(lum, 0.30) * mix(1.0, 0.26, cover);

  // Apparent shape: a disc of thickness "flat" seen at this angle.
  vec3 nv = normalize(mat3(modelViewMatrix) * aNormal);
  vec3 dir = mv.xyz / dist;
  float cosi = abs(dot(nv, dir));
  float ratio = sqrt(aInfo.y * aInfo.y * (1.0 - cosi * cosi) + cosi * cosi);
  vec2 tilt = nv.xy - dir.xy * dot(nv, dir);
  vec2 major = length(tilt) > 1e-4 ? normalize(vec2(-tilt.y, tilt.x)) : vec2(1.0, 0.0);
  vShape = vec3(major, mix(1.0, ratio, smoothstep(0.0, 1.0, cover * 3.0 + 0.35)));
  vCore = cover;

  float home = length(position);                        // distance from the Sun
  float shown = 1.0 - smoothstep(uLimit, uLimit + 0.6, home);
  float isFocus = step(abs(aInfo.w - uFocus), 0.5);
  bright *= mix(1.0, 0.32, isFocus * uFocusFade);
  // Fade a galaxy out when the camera is about to pass through it.
  bright *= smoothstep(aInfo.x * 0.6, aInfo.x * 2.2, dist) * (1.0 - isFocus) + isFocus;
  vColor = aColor * bright * shown * uGain;
  gl_PointSize = min(sizePx, uMaxPoint);
  gl_Position = projectionMatrix * mv;
  if (shown < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <logdepthbuf_vertex>
}
`;

const fragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
varying vec3 vColor;
varying vec3 vShape;
varying float vCore;
void main() {
  #include <logdepthbuf_fragment>
  vec2 p = vec2(gl_PointCoord.x * 2.0 - 1.0, 1.0 - gl_PointCoord.y * 2.0);
  float a = dot(p, vShape.xy);
  float b = dot(p, vec2(-vShape.y, vShape.x)) / max(vShape.z, 0.08);
  float r = sqrt(a * a + b * b);
  // Light falls away smoothly from the centre, as it does in real galaxies,
  // with a brighter core once the galaxy is large enough to show one.
  float disc = exp(-r * 4.2);
  float core = exp(-r * r * 60.0) * 1.6 * vCore;
  float edge = 1.0 - smoothstep(0.82, 1.0, r);
  gl_FragColor = vec4(vColor * (disc + core) * edge, 1.0);
}
`;

// Colour by class: old stars make ellipticals yellow-orange, young stars make
// spiral arms and irregular galaxies blue-white.
const COLOURS = { ell: [1.0, 0.80, 0.58], s0: [1.0, 0.84, 0.64], spiral: [0.90, 0.92, 1.0], irr: [0.72, 0.84, 1.0] };

export function createField(galaxies, maxPointSize) {
  const n = galaxies.length;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), info = new Float32Array(n * 4), col = new Float32Array(n * 3);
  galaxies.forEach((g, i) => {
    pos.set(g.pos, i * 3);
    nor.set(g.normal, i * 3);
    info.set([g.radius, g.flat, Math.min(g.lum, 8), i], i * 4);
    let c = COLOURS[g.cls.key];
    if (g.cls.key === 'spiral') {
      // Early spirals (Sa) have big yellow bulges, late ones (Sd) are bluer.
      const k = Math.min(1, Math.max(0, (g.T - 1) / 6));
      c = [1.0 - 0.14 * k, 0.88 + 0.04 * k, 0.76 + 0.24 * k];
    }
    col.set(c, i * 3);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aNormal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uPxPerRad: { value: 1000 },
      uLimit: { value: 30 },
      uFocus: { value: -1 },
      uFocusFade: { value: 0 },
      uMaxPoint: { value: maxPointSize },
      uGain: { value: 1 },
      uShift: { value: new THREE.Vector3() },
    },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  return { points, uniforms: material.uniforms };
}

/** Distance rings on the supergalactic plane, centred on the Sun. */
export function createRings(radii) {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x92bfe3, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
  for (const r of radii) {
    const pts = [];
    for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; pts.push(Math.cos(a) * r, 0, Math.sin(a) * r); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const line = new THREE.Line(geo, material);
    line.frustumCulled = false;
    group.add(line);
  }
  // A cross through the Sun, so the plane reads as a floor.
  const cross = new THREE.BufferGeometry();
  const R = radii[radii.length - 1];
  cross.setAttribute('position', new THREE.Float32BufferAttribute([-R, 0, 0, R, 0, 0, 0, 0, -R, 0, 0, R], 3));
  const lines = new THREE.LineSegments(cross, material);
  lines.frustumCulled = false;
  group.add(lines);

  // A stalk from the visited galaxy down to the plane, to show its height.
  const stalkGeo = new THREE.BufferGeometry();
  stalkGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
  const stalk = new THREE.Line(stalkGeo, new THREE.LineBasicMaterial({ color: 0xd9ab45, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }));
  stalk.frustumCulled = false;
  group.add(stalk);
  return {
    group, material,
    setStalk(p) {
      const a = stalkGeo.attributes.position;
      if (p) { a.setXYZ(0, p[0], p[1], p[2]); a.setXYZ(1, p[0], 0, p[2]); a.needsUpdate = true; }
      stalk.visible = !!p;
    },
  };
}
