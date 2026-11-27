// The featured animations (played by ui/showcase.js). Each show: how to build its scene, and its shots.
// A shot: a/b = camera from/to, la/lb = where it looks from/to, d = seconds, k = small heading, t = the big idea,
// l = the explanation, labels = notes pinned to the model, on/up = what the scene does during the shot.
// Facts: NASA Science (Webb fact sheet, Webb spacecraft diagram), NASA NSSDCA and NASA/JPL (Voyager).

import * as THREE from 'three';
import { buildModel } from '../scene/probes.js';
import { webb, deploy, heatLayers, SEGMENTS, WEBB } from '../scene/webb.js';
import { skyDome, turnSky } from '../scene/sky.js';
import { loadGLB } from '../scene/models.js';
import { descentStage, aeroshell, parachute, ENGINES } from '../scene/edl.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const soft = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const seg = (u, a, b) => Math.max(0, Math.min(1, (u - a) / (b - a)));
const AU = 149597870.7;
const KEEP = {};          // models built once and kept between showings (building one takes a noticeable moment)

// ================================================================= Voyager 1, up close
const voyager = {
  id: 'voyager', name: 'Voyager 1, up close', liveShadow: () => false, centre: V(0.4, 0, -0.3), clear: 3.2,
  sun: { dir: V(0.3, -0.55, 0.78), intensity: 4.4, shadow: 4.6, dist: 30 },
  build({ scene }) { const craft = KEEP.voyager || (KEEP.voyager = buildModel('voyager')); scene.add(craft); return { craft }; },
  release: (st) => st.craft.removeFromParent(),
  end: { title: "Built from NASA's own sizes and materials", text: 'Open it in 3D to take it apart and click any part to see what it is made of, or ride along with it out in interstellar space.', buttons: [['Watch its launch film', 'film', 'voyager1'], ['Take it apart in 3D', 'object', 'voyager1'], ['Ride along with it', 'ride', 'voyager1']] },
  shots: [
    { a: V(10.5, 3.6, 12.5), b: V(7.4, 2.4, 9.2), la: V(0.6, 0, -0.4), lb: V(0.4, 0, -0.3), d: 9, k: 'Voyager 1 · today', t: 'The farthest machine ever built',
      l: (i) => (i.dist ? `About ${(i.dist / 1e9).toFixed(1)} billion km from the Sun (${Math.round(i.dist / AU)} times as far as the Earth). Its radio signal takes about ${Math.round((i.distE || i.dist) / 299792.458 / 3600)} hours to reach the Earth.` : 'Farther from the Sun than anything else people have built. It is still sending data home.') },
    { a: V(3.1, 1.3, 3.6), b: V(-2.0, 1.5, 3.7), la: V(0, 0, 0.45), lb: V(0, 0.1, 0.45), d: 8, k: 'High-gain antenna', t: 'A dish 3.7 m across', l: 'Aluminium honeycomb between graphite-epoxy skins, painted white. Every picture Voyager ever sent came home through it.' },
    { a: V(0.95, -2.25, -0.2), b: V(0.55, -1.75, -0.45), la: V(0.29, -0.88, -0.52), lb: V(0.29, -0.88, -0.54), d: 8, k: 'Bolted to the side', t: 'The Golden Record', l: 'A 30 cm disc of gold-plated copper under an aluminium cover, with sounds and pictures of Earth for whoever finds it.' },
    { a: V(-1.7, -1.35, 0.25), b: V(-2.7, -1.15, -0.05), la: V(-2.3, 0, -0.72), lb: V(-2.6, 0, -0.76), d: 8, k: 'Power', t: 'Three nuclear generators', l: 'The heat of plutonium-238, turned straight into electricity. They sit on a boom, away from the instruments.' },
    { a: V(3.9, -1.55, 0.75), b: V(4.25, -1.05, 0.2), la: V(3.3, -0.28, -0.42), lb: V(3.3, -0.22, -0.42), d: 8, k: 'Scan platform', t: 'The cameras', l: 'Two cameras on a platform that turns. They watched volcanoes erupt on Io, and on 14 February 1990 took the Pale Blue Dot.' },
    { a: V(0.9, 1.5, -1.9), b: V(0.1, 1.85, -2.1), la: V(-3.2, 0.9, 1.1), lb: V(-4.6, 1.2, 2.1), d: 8, k: 'Magnetometer', t: 'A boom 13 m long', l: 'Made of glass fibre, not metal, so the spacecraft’s own magnetism stays far from its sensors.' },
    { a: V(6.5, 2.2, 8.5), b: V(34, 10, 52), la: V(0, 0, 0), lb: V(0, 0, 0), d: 11, k: 'Launched 5 September 1977', t: 'Still talking to Earth', l: 'On 25 August 2012 it became the first spacecraft to enter interstellar space. It still sends data home.' },
  ],
};

// ================================================================= James Webb: how it works
const { YC, ZM } = WEBB, MC = V(0, YC, ZM);
const segPos = (n, dx = 0, dy = 0) => { const [x0, y0] = SEGMENTS[n], x = x0 + dx, y = y0 + dy; return V(x, y + YC, ZM + (x * x + y * y) / (2 * WEBB.RC)); };
/** many thin rays of light in one piece. Each path is a list of points; set(head) draws every ray up to `head` metres
 *  from its start, so they all advance together like a wave front, and small pulses keep running along them. */
function rayBundle(c, paths, o = {}) {
  const pos = [], aS = [], idx = [], r = o.r || 0.011, N = 5; let maxL = 0;
  paths.forEach((pts, pi) => {
    let s = o.s0 ? o.s0[pi] : 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], L = a.distanceTo(b), d = b.clone().sub(a).normalize(), u = (Math.abs(d.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)).cross(d).normalize(), v = d.clone().cross(u), base = pos.length / 3;
      for (let k = 0; k < N; k++) { const an = k / N * 6.2832, off = u.clone().multiplyScalar(Math.cos(an) * r).addScaledVector(v, Math.sin(an) * r); pos.push(a.x + off.x, a.y + off.y, a.z + off.z, b.x + off.x, b.y + off.y, b.z + off.z); aS.push(s, s + L); }
      for (let k = 0; k < N; k++) { const k2 = (k + 1) % N; idx.push(base + 2 * k, base + 2 * k + 1, base + 2 * k2, base + 2 * k2, base + 2 * k + 1, base + 2 * k2 + 1); }
      s += L;
    }
    maxL = Math.max(maxL, s);
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(aS, 1)); g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: { uHead: { value: 0 }, uT: { value: 0 }, uK: { value: o.k || 1 }, uTip: { value: 1 }, uColor: { value: new THREE.Color(o.color || 0xffe2a8) } },
    vertexShader: 'attribute float aS; varying float vS; void main() { vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying float vS; uniform float uHead, uT, uK, uTip; uniform vec3 uColor; void main() { if (vS > uHead) discard; float tip = exp(-(uHead - vS) * 1.5) * uTip; float pulse = pow(0.5 + 0.5 * sin(vS * 1.9 - uT * 9.0), 8.0); gl_FragColor = vec4(uColor * (uK * (0.55 + 1.6 * pulse) + tip * 1.1), 1.0); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: o.depthTest !== false, side: THREE.DoubleSide }));
  m.frustumCulled = false; m.userData.own = true; m.visible = false; if (o.order) m.renderOrder = o.order; c.scene.add(m);
  return { mesh: m, maxL, set(head, t = 0) { m.visible = head > 0.001; m.material.uniforms.uHead.value = head; m.material.uniforms.uT.value = t; m.material.uniforms.uTip.value = head < maxL ? 1 : Math.max(0, 1 - (head - maxL) * 0.5); } };
}
/** the picture a single star makes in Webb: a bright core with six long points and two short ones */
function starImage() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.translate(128, 128); x.globalCompositeOperation = 'lighter';
  const g = x.createRadialGradient(0, 0, 0, 0, 0, 60); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.12, 'rgba(255,240,210,0.85)'); g.addColorStop(0.4, 'rgba(255,200,140,0.16)'); g.addColorStop(1, 'rgba(255,190,120,0)'); x.fillStyle = g; x.fillRect(-128, -128, 256, 256);
  const spike = (an, len, w) => { x.save(); x.rotate(an); const s = x.createLinearGradient(0, 0, len, 0); s.addColorStop(0, 'rgba(255,245,225,0.95)'); s.addColorStop(0.3, 'rgba(255,215,160,0.4)'); s.addColorStop(1, 'rgba(255,200,140,0)'); x.fillStyle = s; x.beginPath(); x.moveTo(0, -w); x.lineTo(len, 0); x.lineTo(0, w); x.closePath(); x.fill(); x.restore(); };
  for (let k = 0; k < 6; k++) spike(Math.PI / 6 + k * Math.PI / 3, 124, 3.2); spike(0, 70, 1.6); spike(Math.PI, 70, 1.6);
  return new THREE.CanvasTexture(c);
}
function webbReset(st) {
  st.c.setSun(V(0.5, 0.85, 0.8), 3.0); st.real.intensity = 3.8; st.rays.mesh.material.uniforms.uK.value = 0.3;
  deploy(st.w, 1); st.rays.set(0); st.inner.set(0); st.sunRays.set(0); st.xray.visible = false; st.img.visible = false; heatLayers(st.w, 0);
  st.wave.visible = false; st.dots.forEach((d) => { d.visible = false; });
  st.w.userData.segs.forEach((s) => { s.rotation.set(0, 0, 0); s.position.set(0, 0, 0); });
}
const webbShow = {
  id: 'webb', name: 'James Webb: how it works', liveShadow: (i) => i === 4 || i === 7,      // the segments line up; it folds and unfolds
  centre: V(0, 2.5, 0), clear: 13, fov: 36, far: 9000, noStars: true, bloom: { strength: 0.34, radius: 0.32, threshold: 2.1 },
  // lit from above so the telescope can be seen (in reality that side is always dark); the real Sun shines from underneath
  sun: { dir: V(0.5, 0.85, 0.8), intensity: 3.0, shadow: 14, dist: 45, normalBias: 0.04, map: 4096 }, hemi: [0x8a98b8, 0x3a3a44, 0.4],
  build(c) {
    c.scene.add(skyDome(0.9, 0.6));
    const sunS = c.sprite(0xfff6e8, 110); sunS.position.copy(V(0.3, -1, 0.22).normalize().multiplyScalar(2500));
    const w = KEEP.webb || (KEEP.webb = webb()); c.scene.add(w);          // built once, kept for the next time
    const real = new THREE.DirectionalLight(0xfff4e2, 3.8); real.position.set(6, -20, 4.4); c.scene.add(real);
    const { SEC, AOS, TM, FSM, FP } = w.userData;
    // starlight: in along the axis, off the big mirror, to the small one, and back into the black nose
    const outer = [], inner = [], s0 = [];
    SEGMENTS.forEach((sg, n) => { for (const [dx, dy] of [[0.22, 0.18], [-0.22, -0.2]]) {
      const p = segPos(n, dx, dy), x = p.x, y = p.y - YC, q = SEC.clone().add(V(x * 0.1, y * 0.1, 0)), path = [p.clone().add(V(0, 0, 34)), p, q, AOS];
      outer.push(path); s0.push(34 + p.distanceTo(q) + q.distanceTo(AOS));
      inner.push([AOS, TM.clone().add(V(-x * 0.035, -y * 0.035, 0)), FSM.clone().add(V(x * 0.012, y * 0.012, 0)), FP]);
    } });
    const rays = rayBundle(c, outer, { color: 0xffdfa6, k: 0.3, r: 0.008 });
    const innerB = rayBundle(c, inner, { color: 0xffd28a, k: 0.34, r: 0.005, s0, depthTest: false, order: 6 });
    // what is inside, drawn so that it shows through the black tube: the third mirror, the steering mirror, the cameras
    const xray = new THREE.Group(); xray.visible = false; c.scene.add(xray);
    const xm = (geo, col, op) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthTest: false, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); m.renderOrder = 5; m.userData.own = true; xray.add(m); return m; };
    { const tm = xm(new THREE.CircleGeometry(0.26, 32), 0xffc050, 0.95); tm.scale.set(1, 0.72, 1); tm.position.copy(TM); tm.lookAt(AOS.clone().lerp(FSM, 0.5));
      const tr = xm(new THREE.RingGeometry(0.27, 0.29, 32), 0xfff0c8, 1); tr.scale.copy(tm.scale); tr.position.copy(TM); tr.quaternion.copy(tm.quaternion);
      const fs = xm(new THREE.CircleGeometry(0.1, 24), 0xffc050, 0.95); fs.position.copy(FSM); fs.lookAt(TM.clone().lerp(FP, 0.5));
      const fr = xm(new THREE.RingGeometry(0.105, 0.12, 24), 0xfff0c8, 1); fr.position.copy(FSM); fr.quaternion.copy(fs.quaternion);
      const fp = xm(new THREE.PlaneGeometry(0.36, 0.36), 0x9fd0ff, 0.5); fp.position.copy(FP); fp.lookAt(FSM);
      const fo = xm(new THREE.RingGeometry(0.25, 0.265, 4), 0xbfe0ff, 1); fo.position.copy(FP); fo.quaternion.copy(fp.quaternion); fo.rotateZ(Math.PI / 4); }
    const img = new THREE.Sprite(new THREE.SpriteMaterial({ map: starImage(), transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); img.userData.own = true; img.renderOrder = 7; img.visible = false; c.scene.add(img);
    // sunlight: up from below onto the first layer, and thrown back
    const sd = V(-0.3, 1, -0.22).normalize(), back = V(-0.42, -1, -0.1).normalize(), sunP = [];
    for (let i = 0; i < 26; i++) { const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 26), x = Math.cos(a) * q * 5.6, z = Math.sin(a) * q * 8.6 + 0.6, hit = V(x, -1.25 + 0.05 * Math.abs(x) + (z > 0 ? 0.011 : 0.02) * z * z, z); sunP.push([hit.clone().addScaledVector(sd, -19), hit, hit.clone().addScaledVector(back, 12).add(V(x * 0.25, 0, z * 0.2))]); }
    const sunRays = rayBundle(c, sunP, { color: 0xffe4a8, k: 0.3, r: 0.012 });
    // old light, stretched on its way here
    const NW = 520, wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NW * 3), 3)); wg.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(NW * 3), 3));
    const wave = new THREE.Points(wg, new THREE.PointsMaterial({ map: c.glow, size: 0.2, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); wave.userData.own = true; wave.frustumCulled = false; c.scene.add(wave);
    // 18 separate pictures of one star, until the segments are lined up
    const dots = SEGMENTS.map(() => c.sprite(0xffe9c0, 0.3));
    let s = 77; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const mis = SEGMENTS.map(() => [(rnd() - 0.5) * 0.11, (rnd() - 0.5) * 0.11, (rnd() - 0.5) * 0.16]);
    const st = { c, real, w, rays, inner: innerB, sunRays, xray, img, wave, NW, dots, mis }; webbReset(st); return st;
  },
  tick(st, T) { turnSky(T); },
  release: (st) => st.w.removeFromParent(),
  end: { title: 'The most powerful space telescope ever built', text: 'Every size and material here comes from NASA’s Webb fact sheet. Watch its launch and unfolding as a film, or ride along with it at L2.', buttons: [['Watch its launch film', 'film', 'jwst'], ['Ride along with it', 'ride', 'jwst']] },
  shots: [
    { a: V(17, 10, 24), b: V(12, 8, 18), la: V(0, 2.5, 0), lb: V(0, 2.5, 0), d: 9, big: 1, k: 'James Webb Space Telescope', t: 'A telescope built to see heat',
      l: 'Webb collects infrared light, from 0.6 to 28.5 microns: light our eyes cannot see, and our skin feels as warmth. To catch the faintest of it, the telescope itself must be extremely cold.', on: webbReset },
    { a: V(7.5, 8.2, 9.5), b: V(-7, 7.4, 9), la: MC, lb: MC, d: 11, big: 1, k: 'The primary mirror · 6.5 m', t: '18 mirrors of beryllium, coated in gold',
      l: 'Beryllium is light and strong and keeps its shape in deep cold. The gold on top is only 100 nanometres thick: all of it together weighs about 48 g, as much as a golf ball.', on: webbReset,
      labels: [{ p: segPos(15), text: 'One segment', sub: '1.32 m across · 20 kg of beryllium' }, { p: segPos(8), text: 'Gold coating', sub: '100 nm thick', at: 0.3 }] },
    { a: V(13.5, 7.4, 9.5), b: V(11.0, 6.6, 5.6), la: V(0, YC, 3.0), lb: V(0, YC, 3.0), d: 13, big: 1, k: 'The path of the light', t: 'Three mirrors fold the light',
      l: 'Starlight lands on the big mirror, bounces to the small mirror out in front, and comes back into the black nose in the middle, where a third mirror is waiting.', on: webbReset,
      up(st, u, t) { st.rays.set(47 * soft(seg(u, 0.04, 0.7)), t); },
      labels: [{ p: segPos(1), text: '1 · Primary mirror', sub: 'gathers the light', at: 0.42 }, { p: (st) => st.w.userData.SEC, text: '2 · Secondary mirror', sub: 'sends it back', at: 0.58 }, { p: (st) => st.w.userData.AOS, text: 'Into the nose', sub: 'to the third mirror', at: 0.72 }] },
    { a: V(10.5, YC + 2.2, ZM + 3.4), b: V(8.6, YC + 1.3, ZM + 1.3), la: V(0, YC - 0.05, ZM + 0.3), lb: V(0, YC - 0.1, ZM - 0.2), centre: V(0, YC, 1), d: 14, big: 1, k: 'Inside the telescope', t: 'A mirror that holds the picture still',
      l: 'Inside, the third mirror straightens the picture. Then a small flat mirror makes tiny, quick corrections, so the picture stays perfectly still on the cameras behind the big mirror.',
      on: (st) => { webbReset(st); st.xray.visible = true; },
      up(st, u, t) {
        const dim = soft(seg(u, 0, 0.14)); st.c.setSun(V(0.5, 0.85, 0.8), 3.0 - 2.1 * dim); st.real.intensity = 3.8 - 2.6 * dim; st.rays.mesh.material.uniforms.uK.value = 0.3 - 0.2 * dim;
        st.rays.set(60, t); st.xray.visible = true; st.inner.set(43 + 9.5 * soft(seg(u, 0.14, 0.62)), t);
        const k = soft(seg(u, 0.62, 0.8)); st.img.visible = k > 0; st.img.position.copy(st.w.userData.FP); st.img.scale.setScalar(0.3 + 0.8 * k); st.img.material.opacity = k;
      },
      done: (st) => { st.xray.visible = false; st.inner.set(0); st.img.visible = false; },
      labels: [{ p: (st) => st.w.userData.AOS, text: 'The light comes in here', at: 0.12, to: 0.4 }, { p: (st) => st.w.userData.TM, text: '3 · Third mirror', sub: 'straightens the picture', at: 0.3 }, { p: (st) => st.w.userData.FSM, text: 'Fine steering mirror', sub: 'holds the picture still', at: 0.46 }, { p: (st) => st.w.userData.FP, text: 'Cameras and spectrographs', sub: 'the picture forms here', at: 0.68 }] },
    { a: V(0.6, 5.2, 15.5), b: V(0, 4.95, 11.8), la: MC, lb: MC, d: 11, big: 1, k: 'Alignment', t: 'Eighteen mirrors that act as one',
      l: 'At first every segment makes its own picture of a star: 18 dots. Small motors behind each one nudge it, to within 1/10,000 of the thickness of a hair, until the 18 pictures become one.', on: webbReset,
      up(st, u) {
        const k = 1 - soft(seg(u, 0.22, 0.8));
        st.w.userData.segs.forEach((s, i) => { const m = st.mis[i]; s.rotation.set(m[0] * k, m[1] * k, 0); s.position.z = m[2] * k; });
        st.dots.forEach((d, i) => { const [x, y] = SEGMENTS[i]; d.visible = k > 0.01; d.position.set(-4.7 + x * 0.34 * k + st.mis[i][0] * 9 * k, YC + 1.4 + y * 0.34 * k + st.mis[i][1] * 9 * k, ZM + 3); d.scale.setScalar(0.3); });
        st.img.visible = k <= 0.01; st.img.position.set(-4.7, YC + 1.4, ZM + 3); st.img.scale.setScalar(1.7); st.img.material.opacity = 1;
      },
      done: (st) => { st.img.visible = false; },
      labels: [{ p: (st) => V(-5.6, YC + 2.9, ZM + 3), text: 'What the camera sees', sub: '18 pictures of one star', at: 0.05, to: 0.75 }, { p: (st) => V(-5.6, YC + 2.9, ZM + 3), text: 'What the camera sees', sub: 'one sharp star', at: 0.8 }] },
    { a: V(15, -6.5, 10), b: V(17.5, 0.8, 9), la: V(0, -0.3, 0), lb: V(0, 0.4, 0), d: 14, big: 1, k: 'The sunshield · 21.2 m × 14.2 m', t: 'A parasol the size of a tennis court',
      l: 'Five layers of Kapton film coated with aluminium; the two that face the Sun also carry silicon. They throw the Sun’s heat back into space, and the empty gaps between them let what is left escape sideways.', on: webbReset,
      up(st, u, t) { st.sunRays.set(34 * soft(seg(u, 0.06, 0.5)), t); const k = soft(seg(u, 0.4, 0.72)); heatLayers(st.w, k); st.real.intensity = 3.8 - 2.4 * k; },
      done: (st) => { heatLayers(st.w, 0); st.sunRays.set(0); },
      labels: [{ p: V(5.5, -2.6, 3), text: 'Hot side', sub: 'about 85 °C', cls: 'hot', at: 0.4 }, { p: V(3.5, 3.4, 2), text: 'Cold side', sub: 'about −233 °C', cls: 'cold', at: 0.6 }, { p: V(7.0, -0.7, 1.2), text: '5 layers', sub: 'each one colder than the last', at: 0.74 }] },
    { a: V(10.5, 8.2, 17.5), b: V(8.5, 7.6, 15.5), la: V(0, 5, 7), lb: V(0, 5, 6), d: 11, big: 1, k: 'Why infrared', t: 'The oldest light arrives stretched',
      l: 'Light from the first galaxies has travelled for more than 13 billion years. All that time space itself was expanding and stretching its waves, from visible light into infrared. Only an infrared telescope can see it.', on: (st) => { webbReset(st); st.wave.visible = true; },
      up(st, u, t) {
        const p = st.wave.geometry.attributes.position, c = st.wave.geometry.attributes.color, N = st.NW; let ph = -t * 5.5;
        for (let i = 0; i < N; i++) { const f = i / (N - 1), z = ZM + 1 + (1 - f) * 34, lam = 0.45 + f * f * 2.3; ph += (34 / N) / lam * 6.283; p.setXYZ(i, -1.14 + 0, YC + 0.66 + Math.sin(ph) * 0.42, z); c.setXYZ(i, 0.35 + 0.65 * f, 0.55 - 0.3 * f, 1 - 0.85 * f); }
        p.needsUpdate = true; c.needsUpdate = true;
      },
      labels: [{ p: V(-1.14, YC + 1.6, ZM + 30), text: 'Leaves as visible light', cls: 'cold', at: 0.15 }, { p: V(-1.14, YC + 1.7, ZM + 5), text: 'Arrives as infrared', cls: 'hot', at: 0.35 }] },
    { a: V(17, 11, 22), b: V(19, 9.5, 16.5), la: V(0, 4, 0), lb: V(0, 3.4, 0), d: 17, big: 1, k: 'Launched 25 December 2021', t: 'Folded to fit inside a rocket',
      l: 'No rocket is wide enough for Webb. It was folded for launch and opened in space, step by step: first the sunshield, then the tripod that holds the small mirror (5 January 2022), then the two wings of the big mirror (7 and 8 January).', on: webbReset,
      up(st, u) { deploy(st.w, u < 0.12 ? 1 - soft(u / 0.12) : soft(seg(u, 0.2, 0.9))); }, done: (st) => deploy(st.w, 1),
      labels: [{ p: V(6.5, -0.9, 1.5), text: '1 · Sunshield', sub: 'five layers unfold', at: 0.24, to: 0.5 }, { p: (st) => st.w.userData.smss.sec, text: '2 · Secondary mirror tripod', sub: 'three struts, 7.6 m long', at: 0.52, to: 0.7 }, { p: () => V(4.2, YC, ZM - 0.4), text: '3 · Mirror wings', sub: 'three segments each', at: 0.72 }] },
    { a: V(15, 8.5, 15.5), b: V(75, 36, 95), la: V(0, 2, 0), lb: V(0, 2, 0), d: 11, big: 1, k: 'Where it lives', t: '1.5 million km from Earth',
      l: 'Webb circles a point called L2, where the Sun, the Earth and the Moon always stay behind its shield. In that shade it runs colder than −223 °C.', on: webbReset },
  ],
};


// ================================================================= shared: flames, smoke, ground
const lerp = (a, b, k) => a + (b - a) * k;
function gradTex(stops, w = 8, h = 256) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, h); for (const [o, col] of stops) g.addColorStop(o, col); x.fillStyle = g; x.fillRect(0, 0, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function puffTex() { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); let s = 4; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 26; i++) { const cx = 64 + (r() - 0.5) * 56, cy = 64 + (r() - 0.5) * 56, q = 16 + r() * 26, g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, 'rgba(255,255,255,0.33)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); } const g2 = x.createRadialGradient(64, 64, 30, 64, 64, 64); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = g2; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }
function noiseTex(base, spots, n, rep) { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, 512, 512); let s = 21; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) { const cx = r() * 512, cy = r() * 512, q = 4 + r() * r() * 60, col = spots[Math.floor(r() * spots.length)]; for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) { const g = x.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, q); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(cx + dx - q, cy + dy - q, q * 2, q * 2); } } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
/** a rocket flame: a bright core inside a wider, softer plume, both fading along their length (mouth at y = 0, pointing down) */
function flame(r, len, hot, soft2) {
  const g = new THREE.Group(), mk = (r1, r2, L, tex, op) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, L, 24, 1, true), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, fog: false })); m.position.y = -L / 2; m.userData.own = true; m.frustumCulled = false; g.add(m); return m; };
  g.userData.outer = mk(r, r * 2.1, len, soft2, 0.75); g.userData.core = mk(r * 0.7, r * 0.5, len * 0.62, hot, 1);
  return g;
}
function emit(st, pos, vel, life, size, grow, grey) { const p = st.puffs[st.next = (st.next + 1) % st.puffs.length]; p.pos.copy(pos); p.vel.copy(vel); p.age = 0; p.life = life; p.size = size; p.grow = grow; p.grey = grey; p.sp.material.rotation = Math.random() * 6.28; }

// ================================================================= Perseverance: seven minutes to land
/** the glowing gas round the capsule as it hits the air: brightest in front of the heat shield, streaming away behind */
function plasmaShell() {
  const pts = [], N = 44;
  for (let i = 0; i <= N; i++) { const t = i / N; let r, y; if (t < 0.25) { const q = t / 0.25; r = 2.7 * Math.sin(q * Math.PI / 2); y = -3.95 + 1.45 * (1 - Math.cos(q * Math.PI / 2)); } else { const q = (t - 0.25) / 0.75; r = 2.7 + 0.5 * Math.pow(q, 0.8); y = -2.5 + 9 * q; } pts.push(new THREE.Vector2(Math.max(r, 0.001), y)); }
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 56), new THREE.ShaderMaterial({ uniforms: { uK: { value: 1 }, uT: { value: 0 } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec2 vU; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; vU = uv; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; varying vec2 vU; uniform float uK, uT; void main() { float t = vU.y; float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.5); float st = 0.86 + 0.14 * sin(vU.x * 310.0 + sin(vU.x * 71.0) * 5.0) * sin(t * 60.0 - uT * 22.0 + sin(vU.x * 43.0) * 3.0); float fade = t < 0.25 ? 1.0 : pow(1.0 - (t - 0.25) / 0.75, 4.0); vec3 col = mix(vec3(1.0, 0.8, 0.55), vec3(1.0, 0.3, 0.06), smoothstep(0.05, 0.4, t)); gl_FragColor = vec4(col * (pow(rim, 2.2) * 1.1 + 0.02) * fade * st * uK, 1.0); }' }));
  m.userData.own = true; m.frustumCulled = false; return m;
}
const ROVER_TOP = 2.2;          // the rover's height on its wheels
function percyState(st, o) {
  const d = { alt: 0, chute: 0, chuteOn: false, heat: 0, back: 0, fire: 0, plasma: 0, drop: 0, cords: false, away: 0, dust: 0, ...o };
  Object.assign(st, d);
  st.puffs.forEach((p) => { p.life = 0; p.sp.visible = false; });
}
const percy = {
  id: 'percy', name: 'Perseverance: seven minutes to land', liveShadow: () => true,      // it is always falling: shadows every frame
  centre: V(0, 0, 0), clear: 9, fov: 36, near: 0.2, far: 4e6, logDepth: true, noStars: true, exposure: 1.0, bloom: { strength: 0.3, radius: 0.35, threshold: 1.9 },
  sun: { dir: V(-0.5, 0.6, 0.62), intensity: 3.6, shadow: 9, dist: 60, normalBias: 0.03 }, hemi: [0xeed3b0, 0x8a6648, 0.85],
  shadowFollow: (st) => st.focus,
  build(c) {
    const st = { c, next: 0, focus: V(0, 0, 0) }, sc = c.scene;
    { const g = new THREE.SphereGeometry(1.8e6, 32, 24), p = g.attributes.position, col = new Float32Array(p.count * 3), lo = new THREE.Color(0xe2c29a), hi = new THREE.Color(0xb48c66), k = new THREE.Color();
      for (let i = 0; i < p.count; i++) { const t = Math.max(0, p.getY(i) / 1.8e6); k.copy(lo).lerp(hi, Math.pow(t, 0.45)); col.set([k.r, k.g, k.b], i * 3); }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); st.dome = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false })); st.dome.userData.own = true; st.dome.renderOrder = -5; sc.add(st.dome); }
    st.fog = new THREE.Fog(0xd6b48e, 4000, 260000);
    // Mars: the whole curve of the planet for the high shots, and a patch of Jezero's floor for the landing
    { const g = new THREE.PlaneGeometry(2.4e6, 2.4e6, 96, 96); g.rotateX(-Math.PI / 2); const p = g.attributes.position, col = new Float32Array(p.count * 3); let s = 8; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < p.count; i++) { p.setY(i, -(p.getX(i) ** 2 + p.getZ(i) ** 2) / (2 * 3389500) - 0.4); }
      const mt = new THREE.TextureLoader().load('textures/mars_4k.jpg'); mt.colorSpace = THREE.SRGBColorSpace; mt.anisotropy = 8; mt.repeat.set(0.1185, 0.2249); mt.offset.set(0.715 - 0.0593, 0.6024 - 0.1124);      // the real surface for 1,200 km round Jezero Crater (18.4° N, 77.5° E)
      const far = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: mt, color: 0xd9c2ae, roughness: 1 })); far.userData.own = true; far.receiveShadow = false; sc.add(far);
      const near = new THREE.Mesh(new THREE.CircleGeometry(900, 64), new THREE.MeshStandardMaterial({ map: noiseTex('#a8663e', ['rgba(110,62,36,0.45)', 'rgba(205,150,105,0.35)', 'rgba(80,45,28,0.4)', 'rgba(160,100,62,0.5)'], 1600, 220), roughness: 1 })); near.rotation.x = -Math.PI / 2; near.receiveShadow = true; near.userData.own = true; sc.add(near);
      const rk = new THREE.MeshStandardMaterial({ color: 0x7c4c32, roughness: 1, flatShading: true }); for (let i = 0; i < 160; i++) { const a = r() * 6.283, d = 5 + r() * 90, q = 0.04 + r() ** 3 * 0.55, m = new THREE.Mesh(new THREE.DodecahedronGeometry(q, 0), rk); m.position.set(Math.cos(a) * d, q * 0.3, Math.sin(a) * d); m.rotation.set(a, a * 2, a * 3); m.scale.y = 0.55; m.castShadow = m.receiveShadow = true; m.userData.own = true; sc.add(m); } }
    // the spacecraft
    st.craft = new THREE.Group(); sc.add(st.craft);
    st.stage = descentStage(); st.craft.add(st.stage);
    const sh = aeroshell(); st.backG = new THREE.Group(); st.backG.add(sh.back); st.craft.add(st.backG); st.heatM = sh.heat; st.craft.add(st.heatM);
    st.chuteG = parachute(); st.backG.add(st.chuteG);
    st.rover = new THREE.Group(); sc.add(st.rover); loadGLB('m2020').then((m) => { m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); st.rover.add(m); }).catch(() => {});
    const ft = gradTex([[0, 'rgba(255,235,210,0.95)'], [0.25, 'rgba(255,190,140,0.4)'], [1, 'rgba(255,170,120,0)']]);
    st.fl = ENGINES.map(([p, d]) => { const f = flame(0.11, 4.2, ft, ft); f.position.copy(p).addScaledVector(d, 0.34); f.quaternion.setFromUnitVectors(V(0, -1, 0), d); st.stage.add(f); return f; });
    st.plasmaF = plasmaShell(); st.craft.add(st.plasmaF);
    st.hotL = new THREE.PointLight(0xff7a30, 0, 40, 1.4); st.hotL.position.set(0, -5.5, 0); st.craft.add(st.hotL);
    st.plasmaS = c.sprite(0xffb070, 1);
    { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(18), 3)); st.cordL = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xf2efe6 })); st.cordL.frustumCulled = false; st.cordL.userData.own = true; st.craft.add(st.cordL); }
    const pt = puffTex(); st.puffs = [];
    for (let i = 0; i < 110; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: pt, transparent: true, depthWrite: false, fog: false })); sp.visible = false; sp.userData.own = true; sc.add(sp); st.puffs.push({ sp, pos: V(0, 0, 0), vel: V(0, 0, 0), age: 0, life: 0 }); }
    percyState(st, { alt: 60000, plasma: 1 }); return st;
  },
  tick(st, T, dt) {
    const sc = st.c.scene, flick = 0.92 + 0.08 * Math.sin(T * 51) * Math.sin(T * 19);
    st.craft.position.set(st.away * st.away * 5, st.alt + st.away * st.away * 3.2, 0); st.craft.rotation.z = -Math.min(0.5, st.away * 0.25);
    st.focus.set(0, st.away ? 1 : st.alt - (st.drop > 0 ? st.drop * 0.5 : 0), 0);
    const k = soft(1 - st.alt / 90000); st.dome.material.color.setRGB(lerp(0.22, 1, k), lerp(0.2, 1, k), lerp(0.24, 1, k));   // a sunlit afternoon sky (it landed at about 3:50 pm Mars time), thinner and darker high up sc.fog = st.alt < 15000 ? st.fog : null;
    // the parts that come off: the heat shield falls, the backshell and parachute are left above
    st.heatM.visible = st.heat < 60; st.heatM.position.y = -st.heat; st.heatM.rotation.z = st.heat * 0.012;
    st.backG.visible = st.back < 400; st.backG.position.set(st.back * 0.25, st.back, 0);
    st.chuteG.visible = st.chuteOn; const cs = 0.06 + 0.94 * soft(st.chute); st.chuteG.userData.canopy.scale.set(cs * (1 + 0.02 * Math.sin(T * 7)), 1, cs * (1 + 0.02 * Math.cos(T * 6.3)));
    // the rover: tucked under the stage, then lowered on three cords
    const ry = -0.55 - ROVER_TOP - st.drop; if (st.away) st.rover.position.set(0, 0, 0); else st.rover.position.set(0, st.alt + ry, 0);
    st.cordL.visible = st.cords; if (st.cords) { const p = st.cordL.geometry.attributes.position, top = ry + ROVER_TOP * 0.52; [[0.35, 0.5], [-0.35, 0.5], [0, -0.6]].forEach(([x, z], i) => { p.setXYZ(i * 2, x * 0.4, -0.45, z * 0.4); p.setXYZ(i * 2 + 1, x * 2.2, top, z * 1.6); }); p.needsUpdate = true; }
    for (const f of st.fl) { f.visible = st.fire > 0.01; f.scale.y = st.fire * flick; f.userData.outer.material.opacity = 0.5 * st.fire; f.userData.core.material.opacity = 0.9 * st.fire; }
    st.plasmaF.visible = st.plasma > 0.01; st.plasmaF.material.uniforms.uK.value = st.plasma * flick; st.plasmaF.material.uniforms.uT.value = T;
    st.hotL.intensity = 260 * st.plasma * flick; st.heatM.children.forEach((m) => { m.material.emissive.setRGB(1.0 * st.plasma, 0.3 * st.plasma, 0.06 * st.plasma); });
    st.plasmaS.visible = st.plasma > 0.01; st.plasmaS.position.set(0, st.alt - 3.9, 0); st.plasmaS.scale.setScalar(7 * st.plasma * flick);
    if (st.dust) { st.acc = (st.acc || 0) + dt * 16 * st.dust; while (st.acc > 1) { st.acc -= 1; const a = Math.random() * 6.283, sp = 9 + Math.random() * 12; emit(st, V(Math.cos(a) * 2.2, 0.15, Math.sin(a) * 2.2), V(Math.cos(a) * sp, 0.15 + Math.random() * 0.5, Math.sin(a) * sp), 1.6 + Math.random() * 1.2, 0.9, 1.5, 0.8); } }
    for (const p of st.puffs) { if (p.life <= 0) continue; p.age += dt; if (p.age >= p.life) { p.life = 0; p.sp.visible = false; continue; } p.pos.addScaledVector(p.vel, dt); p.vel.multiplyScalar(1 - dt * 0.7); const q = p.age / p.life; p.sp.visible = true; p.sp.position.copy(p.pos); { const z = p.size + p.grow * p.age; p.sp.scale.set(z * 2.1, z * 0.55, 1); } p.sp.material.color.setRGB(0.72 * p.grey, 0.5 * p.grey, 0.34 * p.grey); p.sp.material.opacity = Math.min(1, q * 8) * (1 - q) * 0.3; }
  },
  end: { title: 'Earth’s fifth rover on Mars', text: 'The rover is NASA’s own 3D model; the sky crane, capsule and parachute are built by hand to the figures in NASA’s landing press kit. Watch the whole mission as a film, or go to Jezero Crater.', buttons: [['Watch the whole mission', 'film', 'perseverance'], ['Go to Jezero Crater', 'site', 'perseverance']] },
  shots: [
    { anchor: (st) => st.craft.position, a: V(9, 4, 13), b: V(7, -3, 11), la: V(0, -1.6, 0), lb: V(0, -1.6, 0), d: 10, big: 1, k: '18 February 2021 · above Jezero Crater', t: 'Seven minutes to land',
      l: 'Perseverance hits the top of the Martian air at almost 20,000 km/h, folded inside a capsule. Rubbing against the air slows it down, and heats the shield in front to about 1,300 °C.', on: (st) => percyState(st, { alt: 60000, plasma: 1 }),
      labels: [{ p: V(1.6, -3.1, 1.2), text: 'Heat shield', sub: 'about 1,300 °C', cls: 'hot', at: 0.3 }, { p: V(1.5, -0.6, 1.2), text: 'Backshell', sub: 'the rover is inside', at: 0.5 }] },
    { anchor: (st) => st.craft.position, a: V(48, 2, 74), b: V(58, 16, 84), la: V(0, 25, 0), lb: V(0, 25, 0), centre: V(0, 25, 0), d: 10, big: 1, k: 'About 240 seconds after entry · 11 km up', t: 'A parachute 21.5 m wide',
      l: 'Still going about 1,500 km/h, faster than sound, the capsule throws out the biggest parachute ever sent to Mars. It slows the capsule to about 320 km/h.', on: (st) => percyState(st, { alt: 11000, chuteOn: true }), up: (st, u) => { st.chute = seg(u, 0.08, 0.34); st.chuteOn = true; }, done: (st) => { st.chute = 1; },
      labels: [{ p: V(9, 46, 0), text: 'Parachute', sub: '21.5 m across', at: 0.4 }] },
    { anchor: (st) => st.craft.position, a: V(8, -9, 11), b: V(11, -11, 6), la: V(0, -2.4, 0), lb: V(0, -2.6, 0), d: 9, big: 1, k: '20 seconds later', t: 'The heat shield falls away',
      l: 'Its job is done. With it gone, a radar and a camera under the rover can see the ground for the first time, and the computer on board picks the safest place to land by itself.', on: (st) => percyState(st, { alt: 9000, chute: 1, chuteOn: true }), up: (st, u, t) => { const tt = Math.max(0, t - 1.2); st.heat = 2.2 * tt * tt; st.chute = 1; st.chuteOn = true; }, done: (st) => { st.heat = 99; },
      labels: [{ p: V(0.5, -2.7, 0.8), text: 'The rover', sub: 'held under the descent stage', at: 0.45 }] },
    { anchor: (st) => st.craft.position, a: V(10, 3, 14), b: V(12, -2, 10), la: V(0, -1.2, 0), lb: V(0, -1.4, 0), d: 11, big: 1, k: '2.1 km above the ground', t: 'Eight rocket engines',
      l: 'The parachute cannot slow it enough in such thin air. The descent stage drops out of the backshell with the rover held underneath, lights eight engines and steers away from the falling parachute.', on: (st) => percyState(st, { alt: 2100, chute: 1, chuteOn: true, heat: 99 }),
      up: (st, u, t) => { const tt = Math.max(0, t - 1.3); st.back = 9 * tt * tt; st.fire = soft(seg(u, 0.14, 0.26)); st.heat = 99; st.chute = 1; st.chuteOn = true; }, done: (st) => { st.back = 999; st.fire = 1; },
      labels: [{ p: V(1.5, 0.3, 0.4), text: 'Descent stage', sub: 'eight engines, three fuel tanks', at: 0.4 }] },
    { anchor: (st) => st.craft.position, a: V(18, -11, 23), b: V(15, -9, 18), la: V(0, -6, 0), lb: V(0, -6.5, 0), centre: V(0, -6, 0), d: 13, big: 1, k: '20 m above the ground · 12 seconds to go', t: 'The sky crane',
      l: 'The stage hovers and lets the rover down on three nylon cords 6.4 m long. On the way down the rover unfolds its wheels. No spacecraft had landed this way before Curiosity in 2012.', on: (st) => percyState(st, { alt: 21, heat: 99, back: 999, fire: 1, cords: true }),
      up: (st, u) => { st.fire = 1; st.heat = 99; st.back = 999; st.cords = true; st.drop = 6.4 * soft(seg(u, 0.12, 0.6)); st.alt = lerp(21, 0.55 + ROVER_TOP + 6.4 + 1.2, soft(seg(u, 0.3, 1))); st.dust = st.alt < 16 ? 0.5 : 0; }, done: (st) => { st.drop = 6.4; },
      labels: [{ p: V(1.2, -4.2, 0.6), text: 'Three nylon cords', sub: '6.4 m long', at: 0.55 }] },
    { cut: 1, a: V(10, 2.4, 13), b: V(7.5, 1.9, 10), la: V(0, 1.6, 0), lb: V(0, 1.3, 0), centre: V(0, 1.5, 0), d: 12, big: 1, k: 'The news reached Earth at 20:55 UTC', t: 'Touchdown',
      l: 'The wheels touch at about 2.7 km/h. The rover cuts the cords, and the descent stage flies away to crash at a safe distance, so that its engines do not blow dust over the rover.', on: (st) => percyState(st, { alt: 0.55 + ROVER_TOP + 6.4 + 1.2, heat: 99, back: 999, fire: 1, cords: true, drop: 6.4, dust: 1 }),
      up: (st, u, t) => { st.heat = 99; st.back = 999; st.drop = 6.4; const top = 0.55 + ROVER_TOP + 6.4; if (u < 0.3) { st.alt = lerp(top + 1.2, top, soft(u / 0.3)); st.cords = true; st.fire = 1; st.dust = 1; } else { st.cords = false; st.away = (u - 0.3) * 12 * 0.62; st.alt = top; st.fire = 1; st.dust = Math.max(0, 1 - (u - 0.3) * 5); } }, shake: (st, u) => (u < 0.4 ? 0.02 : 0), done: (st) => { st.away = 30; } },
    { a: V(6.5, 1.7, 8.5), b: V(-5.5, 2.3, 7.5), la: V(0, 1.1, 0), lb: V(0, 1.1, 0), centre: V(0, 1.1, 0), d: 11, big: 1, k: 'Jezero Crater, Mars', t: 'Perseverance is on Mars',
      l: 'Seven minutes after it hit the air, the rover stands on the floor of an ancient lake. It took about 11 more minutes for the news to reach the Earth.', on: (st) => percyState(st, { alt: 0.55 + ROVER_TOP + 6.4, heat: 99, back: 999, drop: 6.4, away: 30 }), up: (st) => { st.away = 30; st.heat = 99; st.back = 999; } },
  ],
};

export const SHOWS = { voyager, webb: webbShow, percy };     // the fourth featured animation, Apollo 11, is a film (ui/apollo11.js)
