// Short animated scenes at a surface site: the hardware arriving, and the moment it stops
// working (or, for Apollo, the crew leaving). They are simple drawings on top of the existing
// site models, in the site's local metres (x east, y up, z south), and they never change the
// models themselves. While a machine is still working, a small green lamp and radio rings
// show it is "alive"; when it falls silent they fade out.

import * as THREE from 'three';
import { stateAt } from '../../data/equipment.js';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const easeOut = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const lerp = (a, b, t) => a + (b - a) * t;

const LAND_STYLE = {
  lm: 'rocket', 'lm-proc': 'rocket', surveyor: 'rocket', viking: 'chute', phoenix: 'chute', insight: 'chute',
  pathfinder: 'bounce', mer: 'bounce', impact: 'impact', skycrane: 'impact', ingenuity: 'fly',
};
const LAND_WORDS = {
  rocket: 'touches down', chute: 'lands under a parachute', bounce: 'bounces to a stop on airbags', impact: 'hits the surface', fly: 'lifts off for the first time',
};
const HAZE = { spirit: 'dust', opportunity: 'dust', insight: 'dust', phoenix: 'frost' };
const DURATION = { surveyor: 19.5, rocket: 8, chute: 9, bounce: 9, impact: 4.5, fly: 9, liftoff: 8, silent: 6.5 };
const LIVE = new Set(['active', 'in-use']);

function glow(rgb) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.35, `rgba(${rgb},0.45)`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let TEX = null;

/** Which scenes exist for a piece of hardware: index into its timeline (0 = arrival). */
export function scenesFor(eq) {
  const type = eq.parts && eq.parts[0] ? eq.parts[0].type : null;
  const land = LAND_STYLE[type] || null;
  let end = null;
  if (type === 'lm' && eq.timeline[1]) end = { i: 1, label: 'Watch the crew leave' };
  else if (land !== 'impact') {
    const i = eq.timeline.findIndex((e, k) => k > 0 && (e.state === 'silent' || e.state === 'ended' || e.state === 'left'));
    if (i > 0) end = { i, label: 'Watch it fall silent' };
  }
  return { land, end };
}

export class SiteScenes {
  constructor(site, onCaption) {
    this.site = site; this.onCaption = onCaption;
    this.anchor = null; this.fx = null; this.scene = null; this.box = { h: 3, w: 4, ok: false }; this.measureT = 0;
  }

  /** (Re)build the effect objects when the site on show changes. */
  _attach() {
    const cur = this.site.current;
    if (!cur) { this.anchor = null; this.fx = null; this.scene = null; return false; }
    if (cur.anchor === this.anchor) return true;
    if (!TEX) TEX = { warm: glow('255,214,150'), dust: glow('206,160,112'), frost: glow('236,244,255') };
    this.anchor = cur.anchor; this.scene = null; this.box.ok = false;
    const fx = this.fx = { root: new THREE.Group() };
    const basic = (color, opts = {}) => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, toneMapped: false, ...opts });
    const main = cur.parts.children[0];
    fx.root.position.copy(main ? main.position : new THREE.Vector3());
    cur.anchor.add(fx.root);
    fx.mover = new THREE.Group(); fx.root.add(fx.mover);      // follows the lander during a scene
    fx.flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 14, 1, true), basic(0xffb347, { blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    fx.flame.rotation.x = Math.PI; fx.mover.add(fx.flame);
    fx.bag = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xe6dcc6, roughness: 0.9, flatShading: true }));
    fx.bag.castShadow = true; fx.mover.add(fx.bag);
    fx.canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 8, 0, Math.PI * 2, 0, 1.25), new THREE.MeshStandardMaterial({ color: 0xd9743a, roughness: 0.9, side: THREE.DoubleSide, transparent: true }));
    fx.mover.add(fx.canopy);
    // Apollo ascent stage: a plain stand-in that sits on the descent stage while the crew is there
    fx.ascent = new THREE.Group();
    const am = new THREE.MeshStandardMaterial({ color: 0xd9dbe0, metalness: 0.1, roughness: 0.55 });
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 2.3, 8), am); cab.position.y = 1.15; cab.castShadow = true; fx.ascent.add(cab);
    const face = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, 1.3), am); face.position.set(-1.9, 1.2, 0); fx.ascent.add(face);
    const tank = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd9b25a, metalness: 0.2, roughness: 0.5 })); tank.position.set(0.3, 1.0, 1.9); fx.ascent.add(tank);
    fx.ascFlame = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3.2, 14, 1, true), basic(0xffc874, { blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    fx.ascFlame.rotation.x = Math.PI; fx.ascFlame.position.y = -1.6; fx.ascent.add(fx.ascFlame);
    fx.root.add(fx.ascent);
    fx.dust = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 48), basic(0xd9cfbf, { side: THREE.DoubleSide }));
    fx.dust.rotation.x = -Math.PI / 2; fx.dust.position.y = 0.06; fx.root.add(fx.dust);
    fx.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.warm, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); fx.root.add(fx.flash);
    fx.streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.warm, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); fx.root.add(fx.streak);
    fx.haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.dust, transparent: true, depthWrite: false, toneMapped: false })); fx.root.add(fx.haze);
    fx.lamp = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), basic(0x7ee0a1, { transparent: false })); fx.root.add(fx.lamp);
    fx.rings = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), basic(0x7ee0a1, { side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
      r.rotation.x = -Math.PI / 2; fx.root.add(r); fx.rings.push(r);
    }
    for (const o of [fx.flame, fx.bag, fx.canopy, fx.ascent, fx.dust, fx.flash, fx.streak, fx.haze, fx.lamp, ...fx.rings]) o.visible = false;
    if (cur.eq.id === 'surveyor1') fx.sv = buildSurveyorFx(fx, (cur.eq.parts[0].heading || 0) * Math.PI / 180);
    return true;
  }

  /** Height and width (m) of the main model, once it has loaded. */
  _measure() {
    const cur = this.site.current, main = cur && cur.parts.children[0];
    if (!main) return;
    const b = new THREE.Box3(); let any = false;
    main.updateWorldMatrix(true, true);
    main.traverse((o) => { if (o.isMesh && o.visible && o.geometry) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); b.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)); any = true; } });
    if (!any) return;
    const inv = cur.anchor.matrixWorld.clone().invert();
    b.applyMatrix4(inv);
    const type = cur.eq.parts[0].type, flat = type === 'impact' || type === 'skycrane';
    this.box.h = flat ? 2.5 : Math.min(8, Math.max(0.5, b.max.y - main.position.y));   // height of the model itself, wherever it is right now
    this.box.w = flat ? 5 : Math.min(12, Math.max(0.8, Math.max(b.max.x - b.min.x, b.max.z - b.min.z)));
    this.box.ok = true;
  }

  /** Start a scene for the site on show. i = index into eq.timeline (0 = arrival). */
  play(eq, i) {
    if (!this._attach() || this.site.current.eq !== eq) return false;
    const sc = scenesFor(eq), entry = eq.timeline[i];
    if (!entry) return false;
    let style;
    if (i === 0) style = eq.id === 'surveyor1' ? 'surveyor' : sc.land;
    else if (eq.parts[0].type === 'lm' && i === 1) style = 'liftoff';
    else if (eq.id === 'ingenuity' && i === 1) style = 'fly';
    else style = 'silent';
    if (!style) return false;
    this._measure();
    this.scene = { eq, i, style, t: 0, dur: DURATION[style], haze: i > 0 ? HAZE[eq.id] : null, cap: -1 };
    const when = new Date(entry.t).toUTCString().slice(5, 16);
    if (style === 'surveyor') {
      // the camera keeps the side it was looking from, but comes down to the ground
      const cam = this.site.current && this.camDir ? this.camDir() : null;
      this.scene.h = cam && cam.lengthSq() > 1e-6 ? cam.setY(0).normalize() : new THREE.Vector3(0.8, 0, 0.6);
      return true;
    }
    this.onCaption(when, i === 0 ? `${eq.name} ${LAND_WORDS[style]}` : entry.label, this.scene.dur + 1.5);
    return true;
  }

  get playing() { return !!this.scene; }

  update(dt, now, ms) {
    if (!this._attach()) return;
    const cur = this.site.current, eq = cur.eq, fx = this.fx, parts = cur.parts.children, main = parts[0];
    if (!main) return;
    this.measureT += dt; if (!this.scene && (!this.box.ok || this.measureT > 2)) { this.measureT = 0; this._measure(); }   // never re-measure in mid-flight
    const H = this.box.h, W = this.box.w, type = eq.parts[0].type, isLM = type === 'lm' || type === 'lm-proc';
    const landed = ms >= Date.parse(eq.arrival);
    const st = stateAt(eq, ms);
    // resting values from the mission clock
    let alive = landed && st && LIVE.has(st.state) ? 1 : 0;
    let y = 0, x = 0, yaw = 0, mainVis = true, others = 1, flame = 0, dust = -1, flash = 0, bag = 0, canopy = 0, canopyUp = 0, streak = null, haze = 0, hazeTex = TEX.dust;
    let ascVis = isLM && landed && eq.timeline[1] && ms < Date.parse(eq.timeline[1].t), ascY = 0, ascFlame = 0, tilt = 0;
    const sc = this.scene;
    this.cam = null;
    if (fx.sv) fx.sv.root.visible = false;
    if (sc && sc.eq === eq) {
      sc.t += dt; const u = Math.min(1, sc.t / sc.dur);
      switch (sc.style) {
        case 'rocket': { const d = Math.min(1, u / 0.86); y = 190 * Math.pow(1 - d, 1.5); x = 150 * Math.pow(1 - d, 2.4); tilt = -0.42 * Math.pow(1 - d, 1.3); /* a curved approach, as a lander flies one: in from the side and high, tilted back to brake, upright and straight down for the last metres */ flame = d < 1 ? 0.55 + 0.45 * d : 0; dust = u > 0.7 ? (u - 0.7) / 0.3 : -1; others = smooth(0.9, 1, u); alive = u > 0.92 ? 1 : 0; if (isLM) ascVis = true; break; }
        case 'chute': { const d = Math.min(1, u / 0.88); y = d < 0.62 ? lerp(230, 45, d / 0.62) : 45 * Math.pow(1 - (d - 0.62) / 0.38, 1.6); x = Math.sin(u * 8) * 4 * (1 - d); canopy = d < 0.62 ? 1 : Math.max(0, 1 - (d - 0.62) / 0.2); canopyUp = d < 0.62 ? 0 : (d - 0.62) * 260; flame = d >= 0.62 && d < 1 ? 1 : 0; dust = u > 0.78 ? (u - 0.78) / 0.22 : -1; alive = u > 0.94 ? 1 : 0; break; }
        case 'bounce': { const d = Math.min(1, u / 0.8); bag = u < 0.82 ? 1 : Math.max(0, 1 - (u - 0.82) / 0.1); mainVis = u > 0.84; x = -110 * (1 - d); y = Math.abs(Math.sin(d * Math.PI * 4.5)) * 32 * Math.pow(1 - d, 1.7) + 120 * Math.pow(Math.max(0, 1 - d * 5), 2); yaw = d * 10; dust = d < 1 ? (d * 4.5) % 1 : -1; alive = u > 0.95 ? 1 : 0; break; }
        case 'impact': { const d = Math.min(1, u / 0.42); mainVis = u >= 0.42; streak = d < 1 ? [-650 * (1 - d), 820 * (1 - d) + 2] : null; flash = u >= 0.42 ? Math.max(0, 1 - (u - 0.42) / 0.3) : 0; dust = u >= 0.42 ? (u - 0.42) / 0.58 : -1; alive = 0; break; }
        case 'fly': { y = u < 0.28 ? 5 * smooth(0, 0.28, u) : u < 0.7 ? 5 + 0.15 * Math.sin(u * 30) : 5 * (1 - smooth(0.7, 1, u)); yaw = smooth(0.28, 0.7, u) * Math.PI * 2; dust = u < 0.18 ? u / 0.18 : u > 0.86 ? (u - 0.86) / 0.14 : -1; break; }
        case 'liftoff': { ascVis = true; const d = Math.max(0, (u - 0.18) / 0.82); ascY = 520 * d * d; ascFlame = u > 0.18 ? 1 : 0; dust = u > 0.18 && u < 0.5 ? (u - 0.18) / 0.32 : -1; if (u >= 1) ascVis = false; break; }
        case 'surveyor': { const r = updateSurveyor(this, sc, fx, dt, now); y = r.y; x = r.x; tilt = r.tilt; others = 1; alive = r.alive; break; }
        case 'silent': { alive = 1 - smooth(0.3, 0.85, u); if (sc.haze) { haze = Math.sin(Math.min(1, u / 0.85) * Math.PI) * 0.7 + 0.1 * u; hazeTex = sc.haze === 'frost' ? TEX.frost : TEX.dust; } break; }
      }
      if (u >= 1) this.scene = null;
    }
    // apply to the site's own hardware (always restored when no scene is running)
    main.position.y = y; main.position.x = (eq.parts[0].e || 0) + x; main.rotation.y = (eq.parts[0].heading || 0) * Math.PI / 180 + yaw; main.rotation.z = tilt;
    fx.mover.rotation.z = tilt;
    main.visible = mainVis;
    for (let k = 1; k < parts.length; k++) parts[k].scale.setScalar(Math.max(0.001, others));
    fx.mover.position.set(x, y, 0);
    const flick = 0.85 + 0.3 * Math.sin(now * 47);
    fx.flame.visible = flame > 0; if (flame > 0) { const len = (H * 1.6 + 1.5) * flame * flick; fx.flame.scale.set(W * 0.28, len, W * 0.28); fx.flame.position.y = H * 0.12 - len / 2; }
    fx.bag.visible = bag > 0; fx.bag.scale.setScalar(Math.max(0.01, bag) * Math.max(1.6, W * 0.85)); fx.bag.position.y = Math.max(1.6, W * 0.85) * 0.9; fx.bag.rotation.set(yaw * 0.7, yaw, 0);
    fx.canopy.visible = canopy > 0; fx.canopy.material.opacity = canopy; const cs = Math.max(4, W * 2.4); fx.canopy.scale.set(cs, cs * 0.75, cs); fx.canopy.position.set(canopyUp * 0.5, H + cs * 2.2 + canopyUp, 0);
    fx.ascent.visible = !!ascVis && mainVis; fx.ascent.position.set(x + ascY * 0.05, y + H + ascY, 0); fx.ascent.scale.setScalar(ascY > 300 ? Math.max(0.05, 1 - (ascY - 300) / 220) : 1);
    fx.ascFlame.visible = ascFlame > 0; fx.ascFlame.scale.set(1, flick, 1);
    fx.dust.visible = dust >= 0; if (dust >= 0) { fx.dust.material.opacity = (1 - dust) * 0.32; fx.dust.scale.setScalar(Math.min(W, 6) * (0.7 + dust * 3)); }
    fx.flash.visible = flash > 0; fx.flash.material.opacity = flash; fx.flash.scale.setScalar(W * (6 + (1 - flash) * 30)); fx.flash.position.y = 1;
    fx.streak.visible = !!streak; if (streak) { fx.streak.position.set(streak[0], streak[1], 0); fx.streak.scale.setScalar(16); }
    fx.haze.visible = haze > 0.01; if (fx.haze.material.map !== hazeTex) { fx.haze.material.map = hazeTex; fx.haze.material.needsUpdate = true; }
    fx.haze.material.opacity = haze; fx.haze.scale.setScalar(W * 9); fx.haze.position.y = H * 0.6;
    // "alive" lamp and radio rings
    const onGround = y < 0.3 && mainVis && type !== 'impact' && type !== 'skycrane';
    const blink = alive > 0.9 ? Math.sin(now * 5) > -0.6 : alive > 0.03 && Math.sin(now * 5 * alive + 1) > 0.3;
    fx.lamp.visible = onGround && blink; fx.lamp.scale.setScalar(Math.max(0.05, W * 0.022)); fx.lamp.position.set(x, H + (isLM && ascVis ? 2.6 : 0) + W * 0.06, 0);
    fx.rings.forEach((r, k) => {
      const p = (now * 0.4 + k / 3) % 1;
      r.visible = onGround && alive > 0.01; r.material.opacity = alive * (1 - p) * 0.5;
      r.position.set(x, H + (isLM && ascVis ? 2.6 : 0) + p * (2 + H * 1.5), 0); r.scale.setScalar(W * (0.08 + p * 0.5));
    });
  }
}


// ============================================================== Surveyor 1, 2 June 1966: the landing in detail
// The sequence and the numbers are NASA's (NSSDCA Surveyor 1 record, JPL mission report): the solid main
// retro-rocket fired 75.3 km up at 2,612 m/s and burned for 40 s; at about 11 km, now at 110 m/s, its empty
// case was dropped; three throttled vernier engines, steered by radar, brought the craft down; they were switched
// off 3.4 m above the ground and it fell freely, touching down at about 3 m/s at 06:17:36 UTC.
// Heights and times are shortened so it fits in 20 seconds; the order of events and the last 3.4 m are real
// (the free fall runs in real time, under the Moon's gravity). There is no air: dust flies in straight lines and
// falls back, it never billows.
const G_MOON = 1.62;
const SV = { ret0: 560, retEnd: 300, tBurn: 4.2, tSep: 4.9, tCut: 13.2, vFall: 1.5, hCut: 3.4 };
SV.tDown = SV.tCut + (-SV.vFall + Math.sqrt(SV.vFall * SV.vFall + 2 * G_MOON * SV.hCut)) / G_MOON;   // ~1.32 s of free fall
const SV_CAPS = [
  [0.0, '75 km up, at 2.6 km/s: the main retro-rocket fires for 40 seconds'],
  [SV.tBurn + 0.3, 'About 11 km up and slowed to 110 m/s, the empty retro-rocket case drops away'],
  [6.9, 'Three small throttled engines, steered by radar, take it the rest of the way down'],
  [SV.tCut - 0.05, '3.4 m above the ground the engines switch off. It falls the last bit freely'],
  [SV.tDown + 0.15, '06:17:36 UTC: touchdown at about 3 m/s. The first US soft landing on another world'],
];

function gradTex(stops, w = 16, h = 256) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, h);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function buildSurveyorFx(fx, heading) {
  const root = new THREE.Group(); root.rotation.y = heading; fx.mover.add(root);
  const add = (o) => { root.add(o); return o; };
  const plumeMat = (tex, op) => new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: op, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  // the main retro-rocket: a 91 cm steel sphere with its nozzle, in the middle under the frame
  const retro = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x8d9097, metalness: 0.7, roughness: 0.38 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.455, 28, 18), steel); ball.position.y = 0.62; ball.castShadow = true; retro.add(ball);
  const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.24, 0.34, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x3b3d42, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }));
  noz.position.y = 0.06; retro.add(noz);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 36), steel); band.rotation.x = Math.PI / 2; band.position.y = 0.62; retro.add(band);
  for (let k = 0; k < 3; k++) { const a = k * 2.0944 + 1.0472; const s = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.62, 6), steel); s.position.set(Math.cos(a) * 0.62, 0.86, Math.sin(a) * 0.62); s.lookAt(0, 0.62, 0); s.rotateX(Math.PI / 2); retro.add(s); }
  add(retro);
  // its exhaust: aluminised solid propellant burns white-hot, and in vacuum the plume opens very wide
  const pt = gradTex([[0, 'rgba(255,250,235,1)'], [0.08, 'rgba(255,222,165,0.8)'], [0.3, 'rgba(255,160,80,0.22)'], [0.7, 'rgba(255,130,60,0.05)'], [1, 'rgba(255,120,40,0)']]);
  const ct = gradTex([[0, 'rgba(255,255,245,1)'], [0.25, 'rgba(255,236,190,0.75)'], [1, 'rgba(255,190,110,0)']]);
  const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 5, 18, 32, 1, true), plumeMat(pt, 0.5)); plume.position.y = -0.11 - 9; retro.add(plume);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.75, 4.5, 24, 1, true), plumeMat(ct, 1)); core.position.y = -0.11 - 2.25; retro.add(core);
  const retroGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.warm, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  retroGlow.scale.setScalar(5); retroGlow.position.y = -0.5; retro.add(retroGlow);
  // the three vernier engines: hypergolic propellants give a faint, see-through flame
  const vt = gradTex([[0, 'rgba(255,240,220,0.95)'], [0.25, 'rgba(255,190,140,0.45)'], [1, 'rgba(160,170,255,0)']]);
  const verns = [];
  for (let k = 0; k < 3; k++) {
    const a = k * 2.0944 + 0.42, g = new THREE.Group();
    g.position.set(Math.cos(a) * 0.86, 0.41, Math.sin(a) * 0.86);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.5, 2.2, 18, 1, true), plumeMat(vt, 0.7)); f.position.y = -1.1; g.add(f);
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.warm, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0.8 })); gl.scale.setScalar(0.9); gl.position.y = -0.1; g.add(gl);
    add(g); verns.push({ g, f, gl });
  }
  // light from the engines, on the craft and on the ground
  const light = new THREE.PointLight(0xffc58a, 0, 0, 2); light.position.y = -0.3; add(light);
  // dust thrown out by the exhaust (a point cloud in the site frame, not attached to the lander)
  const N = 2600, pos = new Float32Array(N * 3), alpha = new Float32Array(N), size = new Float32Array(N);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1)); geo.setAttribute('psize', new THREE.BufferAttribute(size, 1));
  const dmat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(0xd8d6d0) } },
    // (the main view uses a logarithmic depth buffer, so the shader has to write depth the same way)
    vertexShader: '#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute float alpha; attribute float psize; varying float vA; void main(){ vA = alpha; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = clamp(psize * 1100.0 / (-mvPosition.z * 1000.0), 1.2, 5.0); gl_Position = projectionMatrix * mvPosition;\n#include <logdepthbuf_vertex>\n}',
    fragmentShader: '#include <common>\n#include <logdepthbuf_pars_fragment>\nuniform vec3 uColor; varying float vA; void main(){\n#include <logdepthbuf_fragment>\nvec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0; if (r > 1.0) discard; gl_FragColor = vec4(uColor, vA * (1.0 - r)); }',
  });
  const dust = new THREE.Points(geo, dmat); dust.frustumCulled = false; fx.root.add(dust);
  const parts = Array.from({ length: N }, () => ({ live: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 1, s: 0.05 }));
  return { root, retro, plume, core, retroGlow, verns, light, dust, parts, next: 0, emitAcc: 0 };
}

function emitDust(sv, n, rMax, speed, lift, life, cx = 0, cz = 0) {
  for (let k = 0; k < n; k++) {
    const p = sv.parts[sv.next]; sv.next = (sv.next + 1) % sv.parts.length;
    const a = Math.random() * Math.PI * 2, r = Math.random() * rMax, v = speed[0] + Math.random() * (speed[1] - speed[0]);
    p.live = true; p.x = cx + Math.cos(a) * r; p.z = cz + Math.sin(a) * r; p.y = 0.03;
    p.vx = Math.cos(a) * v; p.vz = Math.sin(a) * v; p.vy = lift[0] + Math.random() * (lift[1] - lift[0]);
    p.age = 0; p.life = life * (0.6 + Math.random() * 0.6); p.s = 0.03 + Math.random() * 0.07;
  }
}

function updateSurveyor(scn, sc, fx, dt, now) {
  const sv = fx.sv, t = sc.t; if (!sv) return { y: 0, x: 0, tilt: 0, alive: 1 };
  sv.root.visible = true;
  // captions, one after another
  while (sc.cap + 1 < SV_CAPS.length && t >= SV_CAPS[sc.cap + 1][0]) { sc.cap++; scn.onCaption(sc.cap === SV_CAPS.length - 1 ? '2 June 1966' : 'Surveyor 1 · 2 June 1966', SV_CAPS[sc.cap][1], sc.cap === SV_CAPS.length - 1 ? 7 : 4.5); }
  let y, tilt = 0, retroOn = 0, vern = 0, attached = true;
  if (t < SV.tBurn) { const u = t / SV.tBurn; y = SV.ret0 - (SV.ret0 - SV.retEnd) * (1 - Math.pow(1 - u, 1.6)); retroOn = 1; vern = 0.55; }
  else if (t < SV.tCut) { const u = (t - SV.tBurn) / (SV.tCut - SV.tBurn); y = SV.hCut + (SV.retEnd - SV.hCut) * Math.pow(1 - u, 2.3); retroOn = Math.max(0, 1 - (t - SV.tBurn) / 0.35); vern = 0.6 + 0.4 * smooth(0.5, 1, u); }
  else if (t < SV.tDown) { const tau = t - SV.tCut; y = Math.max(0, SV.hCut - SV.vFall * tau - 0.5 * G_MOON * tau * tau); vern = Math.max(0, 1 - tau / 0.12); }
  else { const tau = t - SV.tDown; y = -0.085 * Math.exp(-5 * tau) * Math.sin(13 * tau); }      // the shock absorbers take the blow and settle
  if (t >= SV.tSep) attached = false;
  tilt = (6 * Math.PI / 180) * (1 - smooth(1.5, 9, t));                                       // it came in 6 degrees off the vertical
  const x = -Math.sin(6 * Math.PI / 180) * Math.max(0, y - 40) * 0.6 * (1 - smooth(1.5, 9, t));
  // the retro-rocket: on the craft, then falling away and tumbling
  const R = sv.retro;
  if (attached) { if (R.parent !== sv.root) { sv.root.add(R); } R.position.set(0, 0, 0); R.rotation.set(0, 0, 0); R.visible = true; }
  else {
    if (!sc.sep) { sc.sep = { y: y, x: x }; }
    const tau = t - SV.tSep;
    // relative to the lander, which keeps braking, the empty case drops away fast
    R.position.set(1.4 * tau, -(9 * tau + 7 * tau * tau), 0.6 * tau); R.rotation.set(tau * 1.3, 0, tau * 2.1);
    R.visible = tau < 4;
  }
  sv.plume.visible = sv.core.visible = sv.retroGlow.visible = retroOn > 0.01 && attached;
  const fl = 0.9 + 0.1 * Math.sin(now * 61) + 0.06 * Math.sin(now * 97);
  sv.plume.material.opacity = 0.45 * retroOn * fl; sv.core.material.opacity = retroOn * fl; sv.retroGlow.material.opacity = retroOn;
  sv.plume.scale.set(1, 0.95 + 0.05 * fl, 1);
  for (const [k, v] of sv.verns.entries()) {
    const th = vern * (0.85 + 0.15 * Math.sin(now * (37 + k * 11) + k));
    v.g.visible = th > 0.02; v.f.scale.set(0.8 + 0.3 * th, 0.6 + 0.6 * th, 0.8 + 0.3 * th); v.f.position.y = -1.1 * (0.6 + 0.6 * th); v.f.material.opacity = 0.55 * th; v.gl.material.opacity = 0.8 * th;
  }
  sv.light.intensity = (retroOn * 60 + vern * 9 * fl) * 1e-6;     // candela; the site is drawn in km, so 1 m = 0.001 units and light falls off with that
  // dust: the vernier exhaust starts to scour the ground below about 18 m; one burst at touchdown
  if (vern > 0.05 && y < 18) { sv.emitAcc += dt * 2600 * (1 - y / 18) * vern; const n = Math.min(600, Math.floor(sv.emitAcc)); sv.emitAcc -= n; emitDust(sv, n, 0.4 + y * 0.12, [6, 20], [0.05, 0.9], 1.5); }
  // the engines were already off at touchdown: only the three footpads kick up a little dust
  if (t >= SV.tDown && !sc.puff) { sc.puff = true; for (let k = 0; k < 3; k++) { const a = k * 2.0944 + (fx.sv.root.rotation.y || 0); emitDust(sv, 45, 0.25, [0.4, 1.6], [0.2, 0.9], 1.4, Math.cos(a) * 2.15, Math.sin(a) * 2.15); } }
  const P = sv.dust.geometry.attributes.position.array, A = sv.dust.geometry.attributes.alpha.array, S = sv.dust.geometry.attributes.psize.array;
  sv.parts.forEach((p, k) => {
    if (p.live) { p.age += dt; p.vy -= G_MOON * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if (p.y < 0) { p.y = 0; p.vx *= 0.3; p.vz *= 0.3; p.vy = 0; } if (p.age > p.life) p.live = false; }
    P[k * 3] = p.x; P[k * 3 + 1] = p.y; P[k * 3 + 2] = p.z; A[k] = p.live ? 0.42 * (1 - p.age / p.life) : 0; S[k] = p.s;
  });
  sv.dust.geometry.attributes.position.needsUpdate = true; sv.dust.geometry.attributes.alpha.needsUpdate = true; sv.dust.geometry.attributes.psize.needsUpdate = true;
  // camera: alongside the craft while it is high, then down on the ground for the last metres
  const L = fx.root.position, h = sc.h, side = new THREE.Vector3(-h.z, 0, h.x);
  const lander = new THREE.Vector3(L.x + x, y + 1.2, L.z);
  const chase = lander.clone().addScaledVector(h, 26).addScaledVector(side, 6).add(new THREE.Vector3(0, -5, 0));
  const ang = smooth(SV.tDown, SV.tDown + 6, t) * 0.35;                                             // a slow turn around it after touchdown
  const hh = h.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), ang), sd = new THREE.Vector3(-hh.z, 0, hh.x);
  const ground = new THREE.Vector3(L.x, 0, L.z).addScaledVector(hh, 15 - 2 * smooth(SV.tDown, SV.tDown + 6, t)).addScaledVector(sd, 3.5).add(new THREE.Vector3(0, 3.2, 0));
  const b = smooth(70, 12, y) * (t > SV.tBurn ? 1 : 0);
  const pos = chase.lerp(ground, b);
  const look = lander.clone().lerp(new THREE.Vector3(L.x, 1.1, L.z).lerp(lander, 0.5), b);
  if (t >= SV.tDown && t < SV.tDown + 0.5) { const k = (1 - (t - SV.tDown) / 0.5) * 0.06; pos.x += (Math.random() - 0.5) * k; pos.y += (Math.random() - 0.5) * k; }   // a small jolt
  pos.y = Math.max(pos.y, 1.6);
  scn.cam = { pos: pos.multiplyScalar(0.001), look: look.multiplyScalar(0.001) };
  const alive = t > SV.tDown + 1 ? 1 : 0;
  if (t >= sc.dur - 0.02) { sv.parts.forEach((p) => { p.live = false; }); }
  return { y, x, tilt, alive };
}
