// "View object": a small 3D turntable of one piece of left-behind hardware, with a plain
// explanation of what it is and why it was left. It has its own tiny renderer that exists only
// while the window is open (the main scene stops drawing meanwhile, so it costs nothing extra).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildPart } from '../scene/models.js';
import { buildModel } from '../scene/probes.js';
import { esc } from './format.js';
import { EQUIPMENT } from '../../data/equipment.js';
import { ACHIEVEMENTS, onTheJob } from '../../data/achievements.js';

// What each kind of hardware is, and why it was left where it is.
const NOTES = {
  lm: ["Descent stage", "The bottom half of the Apollo Lunar Module.", "The crew launched home in the top half and used this half as their launch pad, so it stayed."],
  'lm-proc': ["Descent stage", "The bottom half of the Apollo Lunar Module.", "The crew launched home in the top half and used this half as their launch pad."],
  lrv: ["Lunar Roving Vehicle", "A battery-powered electric car that let astronauts drive kilometres away from their lander.", "It could not fly home, so it was left where the crew parked it."],
  alsep: ['Science station (ALSEP)', 'A set of experiments wired to a central box and powered by a small nuclear generator.', 'It was designed to stay and keep working for years after the crew left. NASA switched all the stations off in 1977.'],
  easep: ["Seismometer (EASEP)", "An early science package left by Apollo 11, with a seismometer to listen for moonquakes.", "It was set up to keep working after the crew left."],
  lrrr: ['Laser retroreflector', 'A tray of glass corner-cubes that bounces laser light straight back to Earth.', 'It has to stay on the Moon to work: scientists still fire lasers at it to measure the distance to the Moon.'],
  flag: ["Flag", "A flag planted by the astronauts.", "It was left behind as a marker of the landing."],
  surveyor: ["Surveyor lander", "A robot lander with a TV camera, sent ahead of the astronauts.", "It was a one-way robot with no way to take off again."],
  viking: ['Viking lander', 'A nuclear-powered lander with cameras, a weather station and a robot arm that scooped soil into a small laboratory.', 'It was a one-way mission. It kept working for years until contact was lost.'],
  pathfinder: ['Pathfinder lander', 'A lander that bounced down inside airbags and opened like a flower to release the small rover Sojourner.', 'It was a low-cost test of a new way to land. Neither lander nor rover could leave Mars.'],
  mer: ["Mars Exploration Rover", "A solar-powered rover sent to look for signs of past water.", "It was built for 90 Martian days and never meant to return."],
  phoenix: ['Phoenix lander', 'A lander with two round solar panels and a robot arm for digging into frozen ground.', 'It ran on sunlight. When the polar winter came there was not enough light to keep it alive.'],
  insight: ['InSight lander', 'A lander that set a seismometer on the ground to listen for marsquakes.', 'It stayed to listen for as long as it could. Dust slowly covered its solar panels until it lost power.'],
  ingenuity: ["Ingenuity helicopter", "A small helicopter, about four pounds, built to test powered flight on Mars.", "It was a flight test that rode to Mars with a rover. Its rotor blades were damaged on its 72nd flight, so it stays where it came down."],
  skycrane: ["Sky crane wreckage", "The rocket-powered descent stage that lowered the Perseverance rover on cables.", "After setting the rover down it flew away and crashed on purpose, a safe distance off."],
  lmfull: ['Lander as it arrived', 'The whole Apollo Lunar Module: the descent stage below and the crew cabin (the ascent stage) on top.', 'Only the bottom half is still at the landing site. The top half carried the crew back up to lunar orbit.'],
  ladee: ['Spacecraft before impact', 'LADEE as it flew: a body covered in solar cells with its science instruments on top.', 'Nothing this whole is left. The spacecraft hit the Moon at the end of its mission.'],
  msl: ['Curiosity rover', 'A car-sized, nuclear-powered rover that drills into rocks and analyses the powder in its on-board laboratory.', ''],
  m2020: ['Perseverance rover', 'A car-sized, nuclear-powered rover that looks for signs of ancient life and seals rock samples in tubes.', ''],
  impact: ['Impact site', 'A crater and scattered fragments: all that is left of a spacecraft that hit the surface at high speed.', 'The crash was planned. Hitting the ground was either the end of the mission or the experiment itself.'],
};
// ---- "From hardware to discovery": how a piece of engineering turned into knowledge.
// Step texts are NASA-sourced: the general ones reuse the checked story of each mission; the ones
// below are from NASA/JPL pages on the Apollo surface experiments and lunar laser ranging, the
// NSSDCA Mars 2020 record and the Mars Science Laboratory press kit.
const STEPS = ['The hardware', 'What it did', 'What we learned', 'Today'];
const CHAINS = {
  lrrr: (q) => [
    q.id === 'apollo11' ? 'A panel 46 cm square holding 100 glass "corner cubes". A corner cube sends light straight back to where it came from.' : 'A panel of glass "corner cubes". A corner cube sends light straight back to where it came from.',
    'Observatories on Earth fire laser pulses at it and time the round trip. That gives the distance between Earth and Moon very precisely. Only about one particle of light comes back every few seconds.',
    'The Moon is moving away from the Earth by about 3.8 cm every year, about as fast as fingernails grow. The measurements also give strong evidence that the Moon has a liquid core.',
    'It needs no power, so it still works: the only Apollo surface experiment still in use. Its data are also used to test Einstein\'s theory of gravity.'],
  easep: () => [
    'The Passive Seismic Experiment: a seismometer, powered by two solar panels.',
    'It was designed to detect "moonquakes", the Moon\'s version of earthquakes. Running on sunlight alone, the package lasted 21 Earth days.',
    'It gave the first information about the inside of the Moon. Better seismometers followed at the Apollo 12, 14, 15 and 16 sites.',
    'Data from those seismometers and from the LRO orbiter indicate that the Moon is slowly shrinking as its interior cools.'],
  alsep: () => [
    'A set of experiments wired to a central box and powered by a small nuclear generator, so it could work through the two-week lunar night.',
    'The seismometers left at the Apollo 12, 14, 15 and 16 sites worked together as a network and sent data to Earth until September 1977. Magnetometers measured the Moon\'s magnetic field.',
    'The network recorded more than 1,700 meteoroid impacts. Most moonquakes start 800 to 1,000 km deep and repeat every month at about 100 places: they are caused by the pull of tides as the Moon orbits the Earth.',
    'Scientists still study the recordings. Together with LRO pictures they indicate that the Moon is shrinking as it cools.'],
  lrv: (q) => [
    'A battery-powered electric car, carried to the Moon folded up.',
    `With it the crew could explore far beyond walking distance. ${q.chapters[1]}`,
    q.chapters[2],
    'It could not fly home, so it is still parked where the crew left it.'],
  flag: () => null,
};
const INSTRUMENTS = {
  m2020: [['Mastcam-Z and SuperCam', 'on top of the mast: cameras and three kinds of spectroscopy that study rocks from a distance and help choose which ones to visit'], ['PIXL, SHERLOC and WATSON', 'on the end of the robot arm: they study the chemistry and minerals of a rock up close, look for signs of past life and help decide where to take a sample'], ['MOXIE', 'inside the body: an experiment that makes oxygen'], ['MEDA', 'on the mast and deck: weather sensors for wind, temperature, pressure and dust'], ['RIMFAX', 'at the bottom rear: a radar that looks under the ground']],
  msl: [['Robot arm', 'drills into rocks, scoops up soil and delivers the samples to the instruments inside the body'], ['Ten science instruments', 'Mast Camera, ChemCam, APXS, MAHLI, CheMin, SAM, DAN, RAD, REMS and the descent camera MARDI: 75 kg in all']],
};
function chainFor(q, part, what, all) {
  const type = part ? part.type : q.model;
  if (part && CHAINS[type]) return CHAINS[type](q);
  // Surveyor 3 standing at the Apollo 12 site has its own story
  const src = (part && type === 'surveyor' && q.id === 'apollo12' && all.find((x) => x.id === 'surveyor3')) || q;
  return [what, src.chapters[1], src.chapters[2], src.chapters[4]];
}

/** Names of the separate parts an exhibit is shown in (used by the exhibition hall cards). */
export function partNames(q) {
  if (q.isProbe) return [q.name];
  const seen = new Set();
  for (const part of q.parts || []) { const n = NOTES[part.type]; if (n) seen.add(part.label || n[0]); }
  return [...seen];
}
const fmtLen = (m) => (m >= 1 ? `${m.toFixed(2)} m` : `${Math.round(m * 100)} cm`);
export const hasObject = (q) => !!q && (q.isProbe || !!(q.parts && q.parts.length));

export class ObjectViewer {
  constructor(root) {
    this.root = root; this.isOpen = false;
    root.innerHTML = `<div class="v-box instrument" role="dialog" aria-label="Object viewer">
      <button class="p-close v-close" aria-label="Close object viewer">×</button>
      <div class="v-stage"><canvas></canvas><span class="v-hint">Drag to turn · scroll to fly in · click a part to see what it is</span>
        <div class="v-tools">
          <label title="Pull every piece away from the centre">Explode <input type="range" class="t-explode" min="0" max="100" value="0"></label>
          <label title="Slice the model open to look inside">Cut open <input type="range" class="t-cut" min="0" max="100" value="0"></label>
          <button class="chip t-xray" aria-pressed="false" title="See through the outer skin">X-ray</button>
          <button class="chip t-wire" aria-pressed="false" title="Show how the model is built">Wireframe</button>
          <button class="chip t-human" aria-pressed="false" title="Stand a 1.8 m astronaut next to it">Astronaut for scale</button>
          <button class="chip t-spin" aria-pressed="true">Spin</button>
          <button class="chip t-reset">Reset</button>
        </div>
        <div class="v-piece" hidden><b></b><span></span><button class="chip t-iso">Show only this</button><button class="chip t-all">Show all</button></div>
        <span class="v-size"></span></div>
      <div class="v-text"><p class="v-kicker"></p><h2></h2><div class="v-tabs"></div><button class="chip v-achjump" hidden>↓ What it has achieved so far</button><h3>What it is</h3><p class="v-what"></p><div class="v-ach"></div><h3 class="v-whyh">Why it was left behind</h3><p class="v-why"></p><div class="v-chain"></div><dl class="v-facts"></dl>
      <div class="row"><button class="btn go v-go"></button></div></div></div>`;
    this.canvas = root.querySelector('canvas');
    root.querySelector('.v-close').addEventListener('click', () => this.close());
    root.addEventListener('pointerdown', (e) => { if (e.target === root) this.close(); });
    root.querySelector('.v-tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) this._show(+b.dataset.i); });
    root.querySelector('.v-go').addEventListener('click', () => { const fn = this.onGo; this.close(); if (fn) fn(); });
    root.querySelector('.v-achjump').addEventListener('click', () => { const a = root.querySelector('.v-ach'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    const q = (c) => root.querySelector(c);
    this.fx = { explode: 0, cut: 0, xray: false, wire: false, human: false, spin: true };
    q('.t-explode').addEventListener('input', (e) => { this.fx.explode = e.target.value / 100; this._applyFx(); });
    q('.t-cut').addEventListener('input', (e) => { this.fx.cut = e.target.value / 100; this._applyFx(); });
    const tog = (cls, k) => q(cls).addEventListener('click', () => { this.fx[k] = !this.fx[k]; q(cls).setAttribute('aria-pressed', this.fx[k] ? 'true' : 'false'); this._applyFx(); });
    tog('.t-xray', 'xray'); tog('.t-wire', 'wire'); tog('.t-human', 'human'); tog('.t-spin', 'spin');
    q('.t-reset').addEventListener('click', () => this._resetFx());
    q('.t-iso').addEventListener('click', () => { this.iso = this.sel; this._applyFx(); });
    q('.t-all').addEventListener('click', () => { this.iso = null; this._select(null); this._applyFx(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.isOpen) { e.stopPropagation(); this.close(); } }, true);
  }

  /** q: an equipment record or a probe. onGo: optional "fly there" action. */
  open(q, onGo, goLabel) {
    this.close();
    const items = [];
    if (q.isProbe) {
      items.push({ label: q.name, what: `${q.short}. ${q.chapters[1]}`, why: q.chapters[3], chain: chainFor(q, null, `${q.name}: ${q.short.charAt(0).toLowerCase()}${q.short.slice(1)}.`, EQUIPMENT), make: () => { const g = buildModel(q.model); g.rotation.x = g.userData.webbUp ? Math.PI / 2 - 0.12 : g.userData.studio ? -Math.PI / 2 + 0.1 : -0.25; return g; } });      // studio models stand dish-up, like NASA's own photographs
    } else {
      const seen = new Set();
      for (const part of q.parts) {
        const n = NOTES[part.type]; if (!n) continue;
        const label = part.label || n[0]; if (seen.has(label)) continue; seen.add(label);
        let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
        items.push({ label, what: n[1], why: n[2], chain: chainFor(q, part, n[1], EQUIPMENT), inst: INSTRUMENTS[part.type], make: () => { const o = buildPart({ ...part, e: 0, n: 0, heading: 0 }, rnd); return o; } });
      }
      // the general note on this kind of hardware, then this object's own story; the note is dropped when the story
      // already says the same thing (a lander that "ran on sunlight", then "too little sunlight for its solar panels")
      if (items[0]) {
        const words = (t) => new Set((t.toLowerCase().match(/[a-z]{4,}/g) || []));
        const a = words(items[0].why), b = words(q.chapters[3]);
        const shared = [...a].filter((w) => b.has(w)).length;
        items[0].why = !items[0].why || shared / Math.max(1, a.size) >= 0.2 ? q.chapters[3] : `${items[0].why} ${q.chapters[3]}`;
      }
    }
    if (!items.length) return;
    // still working: below "What it is" comes what it has achieved so far, instead of the hardware-to-discovery steps
    const ach = ACHIEVEMENTS[q.id];
    if (ach) { items[0].ach = ach; items[0].chain = null; }
    this.items = items; this.onGo = onGo; this.isOpen = true; this.q = q;
    const $ = (s) => this.root.querySelector(s);
    $('.v-kicker').textContent = (q.isProbe ? (ach ? 'Still working' : 'Probe in flight') : `${q.mission} · ${q.body === 'moon' ? 'the Moon' : 'Mars'}${ach ? ' · still working' : ''}`);
    $('h2').textContent = q.name;
    $('.v-whyh').textContent = ach ? (q.isProbe ? 'Why it will never come home' : 'What it has left behind so far') : q.isProbe ? 'Why it never came back' : 'Why it was left behind';
    $('.v-achjump').hidden = !ach;
    $('.v-tabs').innerHTML = items.length > 1 ? items.map((it, i) => `<button class="chip" data-i="${i}">${esc(it.label)}</button>`).join('') : '';
    const facts = [...(q.isProbe ? [['Launched', new Date(q.launch).toUTCString().slice(5, 16)]] : [['Mission', q.mission], ['Arrived', new Date(q.arrival).toUTCString().slice(5, 16)], ['Rests at', `${Math.abs(q.lat).toFixed(2)}°${q.lat >= 0 ? 'N' : 'S'}, ${Math.abs(q.lon > 180 ? q.lon - 360 : q.lon).toFixed(2)}°${(q.lon > 180 ? q.lon - 360 : q.lon) >= 0 ? 'E' : 'W'} on ${q.body === 'moon' ? 'the Moon' : 'Mars'}`]]),
      ...((q.exhibit && q.exhibit.facts) || [])];
    $('.v-facts').innerHTML = facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    $('.v-go').textContent = goLabel || 'Fly there'; $('.v-go').hidden = !onGo;
    this.root.hidden = false;
    this.root.querySelector('.v-text').scrollTop = 0; this.root.querySelector('.v-box').scrollTop = 0;   // a new object starts at the top

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(1);   // set from the real canvas size in the loop below
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.localClippingEnabled = true;
    this.clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e9);
    this.ray = new THREE.Raycaster(); this.saved = new Map(); this.pieces = []; this.sel = null; this.iso = null;
    {
      let d0 = null;
      this.canvas.addEventListener('pointerdown', (e) => { d0 = { x: e.clientX, y: e.clientY }; });
      this.canvas.addEventListener('pointerup', (e) => {
        if (!d0 || Math.hypot(e.clientX - d0.x, e.clientY - d0.y) > 5) return;
        const r = this.canvas.getBoundingClientRect();
        this.ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera);
        const hit = this.ray.intersectObjects(this.pieces.filter((m) => m.visible), false).find((h) => this.clip.distanceToPoint(h.point) >= 0);
        const o = hit && hit.object;
        this._select(o ? (o.parent && o.parent.name && o.parent.name === o.name ? o.parent : o) : null);       // a named part is picked whole
      });
    }
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a332c, 1.5));
    const key = this.key = new THREE.DirectionalLight(0xffffff, 3.0); key.position.set(4, 6, 5); this.scene.add(key, key.target);
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.012;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const rim = new THREE.DirectionalLight(0x9fb8ff, 1.2); rim.position.set(-5, 2, -4); this.scene.add(rim);
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.01, 2000);
    this.controls = new OrbitControls(this.camera, this.canvas);
    Object.assign(this.controls, { enableDamping: true, enablePan: true, screenSpacePanning: true, autoRotate: true, autoRotateSpeed: 1.6, rotateSpeed: 0.7, zoomToCursor: true });
    this._show(0);
    let last = performance.now();
    const loop = (now) => {
      if (!this.isOpen) return;
      this.raf = requestAnimationFrame(loop);
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) { this._w = w; this._h = h; this._dpr = dpr; this.renderer.setPixelRatio(Math.max(1, Math.min(dpr, Math.sqrt(3.2e6 / (w * h))))); this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
      this.fitT += (now - last) / 1000; last = now;
      this._collect();
      if (this.fitT < 6 && this.fx.explode === 0 && !this.iso) this._fit();            // NASA models arrive a moment later: keep framing until they have
      this.controls.autoRotate = this.fx.spin;
      if (this.selBox) this.selBox.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    this.raf = requestAnimationFrame(loop);
  }

  // ---- taking a model apart ------------------------------------------------------------
  /** List the separate pieces (meshes) of the model; models that load late are picked up too. */
  _collect() {
    if (!this.obj) return;
    let n = 0; this.obj.traverse((o) => { if (o.isMesh) n++; });
    if (n === this.pieceCount) return;
    for (const m of this.pieces) if (m.userData.p0) m.position.copy(m.userData.p0);      // measure in the assembled state
    this.pieceCount = n; this.pieces = [];
    this.obj.updateWorldMatrix(true, true);
    const all = new THREE.Box3().setFromObject(this.obj), c = all.getCenter(new THREE.Vector3());
    this.box = all; this.center = c;
    this.obj.traverse((o) => {
      if (!o.isMesh) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const wc = o.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(o.matrixWorld);
      o.userData.p0 = o.position.clone(); o.userData.out = wc.sub(c);
      this.pieces.push(o);
    });
    // the meshes of one named part move together when the model is pulled apart
    { const seen = new Map();
      for (const o of this.pieces) { const p = o.parent; if (!p || !p.name || p.name !== o.name) continue; if (!seen.has(p)) seen.set(p, new THREE.Box3().setFromObject(p).getCenter(new THREE.Vector3()).sub(c)); o.userData.out = seen.get(p); } }
    const sz = all.getSize(new THREE.Vector3());
    this.root.querySelector('.v-size').textContent = all.isEmpty() ? '' : `Model size ${sz.x.toFixed(1)} × ${sz.z.toFixed(1)} × ${sz.y.toFixed(1)} m · ${n} ${n === 1 ? 'piece' : 'pieces'}`;
    this.root.querySelector('.t-explode').disabled = n < 2;
    this._applyFx();
  }
  _applyFx() {
    if (!this.obj || !this.renderer) return;
    const fx = this.fx, _a = new THREE.Vector3(), _b = new THREE.Vector3();
    for (const m of this.pieces) {
      // explode: slide each piece straight out from the centre of the model
      if (m.userData.p0) {
        m.position.copy(m.userData.p0);
        if (fx.explode > 0 && m.parent) {
          m.parent.updateWorldMatrix(true, false);
          const inv = m.parent.matrixWorld.clone().invert();
          m.getWorldPosition(_a); _b.copy(_a).addScaledVector(m.userData.out, fx.explode * 1.6);
          m.position.add(_b.applyMatrix4(inv).sub(_a.applyMatrix4(inv)));
        }
      }
      m.visible = !this.iso || m === this.iso || m.parent === this.iso;
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
        if (!mat) continue;
        if (!this.saved.has(mat)) this.saved.set(mat, { transparent: mat.transparent, opacity: mat.opacity, wireframe: mat.wireframe, side: mat.side, depthWrite: mat.depthWrite, clippingPlanes: mat.clippingPlanes });
        const o = this.saved.get(mat);
        const mode = `${fx.wire}|${fx.xray}|${fx.cut > 0}`;
        if (mat.userData.fxMode === mode) continue;          // sliding Explode or Cut open never rebuilds a shader
        mat.userData.fxMode = mode;
        mat.wireframe = fx.wire;
        mat.transparent = fx.xray || o.transparent; mat.opacity = fx.xray ? Math.min(o.opacity, 0.28) : o.opacity; mat.depthWrite = fx.xray ? false : o.depthWrite;
        mat.clippingPlanes = fx.cut > 0 ? [this.clip] : null; mat.side = fx.cut > 0 ? THREE.DoubleSide : o.side;
        mat.needsUpdate = true;
      }
    }
    if (this.box && !this.box.isEmpty()) {
      const sx = this.box.max.x - this.box.min.x;
      this.clip.constant = fx.cut > 0 ? this.box.max.x + 0.01 - fx.cut * sx * 0.98 : 1e9;
      // a 1.8 m astronaut standing beside the model
      if (fx.human && !this.human) {
        const g = new THREE.Group(), hm = new THREE.MeshStandardMaterial({ color: 0xe9edf2, roughness: 0.8 });
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.75, 4, 10), hm); body.position.y = 1.02; g.add(body);
        const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.66, 10), hm); legs.position.y = 0.33; g.add(legs);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 10), hm); head.position.y = 1.62; g.add(head);
        const visor = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd9a441, metalness: 0.8, roughness: 0.25 })); visor.position.set(0, 1.63, 0.09); g.add(visor);
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.2), hm); pack.position.set(0, 1.15, -0.26); g.add(pack);
        this.human = g; this.scene.add(g);
      }
      if (this.human) { this.human.visible = fx.human; this.human.position.set(this.box.max.x + 0.9, this.box.min.y, this.center.z); }
    }
  }
  _select(m) {
    this.sel = m;
    if (this.selBox) { this.scene.remove(this.selBox); this.selBox.geometry.dispose(); this.selBox = null; }
    const box = this.root.querySelector('.v-piece');
    if (!m) { box.hidden = true; return; }
    this.selBox = new THREE.BoxHelper(m, 0xffd166); this.selBox.material.toneMapped = false; this.scene.add(this.selBox);
    const b = new THREE.Box3().setFromObject(m), sz = b.getSize(new THREE.Vector3());
    const k = this.pieces.indexOf(m) + 1, name = m.name && !/^(mesh|object|node)?[_\s\d.]*$/i.test(m.name) ? (/\s/.test(m.name) ? m.name : m.name.replace(/[_.]+/g, ' ')) : `Piece ${k}`;
    box.querySelector('b').textContent = name;
    const note = m.userData.note || (m.children[0] && m.children[0].userData.note);
    box.querySelector('span').textContent = note ? note : `${k} of ${this.pieces.length} · ${fmtLen(sz.x)} × ${fmtLen(sz.z)} × ${fmtLen(sz.y)}`;
    box.hidden = false;
  }
  _restore() {
    if (!this.saved) return;
    for (const [mat, o] of this.saved) { Object.assign(mat, o); delete mat.userData.fxMode; mat.needsUpdate = true; }     // these materials are shared with the main scene
    this.saved.clear();
    for (const m of this.pieces || []) { if (m.userData.p0) m.position.copy(m.userData.p0); m.visible = true; }
  }
  _resetFx() {
    Object.assign(this.fx, { explode: 0, cut: 0, xray: false, wire: false, human: false, spin: true });
    this.iso = null; this._select(null);
    const q = (c) => this.root.querySelector(c);
    q('.t-explode').value = 0; q('.t-cut').value = 0;
    for (const [c, k] of [['.t-xray', 'xray'], ['.t-wire', 'wire'], ['.t-human', 'human'], ['.t-spin', 'spin']]) q(c).setAttribute('aria-pressed', this.fx[k] ? 'true' : 'false');
    this._applyFx(); this._restore(); this.fitT = 0; this.fitKey = '';
  }

  _show(i) {
    const it = this.items[i]; if (!it) return;
    if (this.obj) { this._resetFx(); this.scene.remove(this.obj); }
    this.pieces = []; this.pieceCount = -1; this.box = null;
    this.obj = it.make(); this.scene.add(this.obj);
    this.root.querySelector('.v-what').textContent = it.what;
    this.root.querySelector('.v-why').textContent = it.why;
    const ac = this.root.querySelector('.v-ach'), A = it.ach;
    ac.innerHTML = A ? `<h3>What it has achieved so far</h3><p class="ach-live"><i></i>${esc(onTheJob(this.q))} <span>(real time, today)</span></p>`
      + `<ol class="ach-list">${A.items.map((x) => `<li class="${x.first ? 'first' : ''}${x.next ? ' next' : ''}"><b>${esc(x.y)}</b><span>${esc(x.t)}${x.first ? '<em>World first</em>' : ''}${x.next ? '<em>Coming up</em>' : ''}</span></li>`).join('')}</ol>`
      + `<p class="ach-src">From NASA: ${A.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label.replace(/^NASA[^:]*:\s*/, ''))}</a>`).join(' · ')}</p>` : '';
    const ch = this.root.querySelector('.v-chain');
    ch.innerHTML = (it.chain ? `<h3>From hardware to discovery</h3><ol>${it.chain.map((t, k) => t ? `<li><b>${STEPS[k]}</b><span>${esc(t)}</span></li>` : '').join('')}</ol>` : '')
      + (it.inst ? `<h3>Instruments on board</h3><ul>${it.inst.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul>` : '');
    [...this.root.querySelectorAll('.v-tabs button')].forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    this.fitT = 0; this.fitKey = '';
  }

  _fit() {
    this.obj.updateMatrixWorld(true);
    const box = this.obj.userData.fit ? this.obj.userData.fit.clone().applyMatrix4(this.obj.matrixWorld) : new THREE.Box3().setFromObject(this.obj);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const r = Math.max(size.x, size.y, size.z, 0.2), key = `${r.toFixed(2)}|${c.y.toFixed(2)}`;
    if (key === this.fitKey) return;
    this.fitKey = key;
    this.controls.target.copy(c);
    const d = (this.obj.userData.studio ? new THREE.Vector3(0.5, 0.06, 0.86) : new THREE.Vector3(0.75, 0.42, 0.9)).normalize().multiplyScalar(r * (this.obj.userData.studio ? 2.1 : 2.1));
    this.camera.position.copy(c).add(d);
    this.controls.minDistance = r * 0.02; this.controls.maxDistance = r * 6;   // close enough to fly inside and look at the parts within
    // studio models get real shadows: the lamp's shadow box is fitted around the body
    const st = !!this.obj.userData.studio; this.key.castShadow = st;
    if (st) { const sc = this.key.shadow.camera, R = r * 0.75; sc.left = sc.bottom = -R; sc.right = sc.top = R; sc.near = 0.5; sc.far = r * 6; sc.updateProjectionMatrix(); this.key.position.set(4, 6, 5).normalize().multiplyScalar(r * 2.5).add(c); this.key.target.position.copy(c); this.key.target.updateMatrixWorld(); }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf);
    this._resetFx(); this.human = null; this.selBox = null; this.pieces = [];
    this.controls.dispose(); this.renderer.dispose(); this.renderer.forceContextLoss();
    this.renderer = null; this.obj = null; this._w = 0;
    // a canvas whose context was lost cannot be reused: swap in a fresh one
    const fresh = this.canvas.cloneNode(false); this.canvas.replaceWith(fresh); this.canvas = fresh;
    this.root.hidden = true;
  }
}
