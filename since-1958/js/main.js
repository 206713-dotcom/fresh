// Since 1958: wiring of simulation, scene, camera and interface.

import * as THREE from 'three';
import { SPIN_ALIAS_LIMIT, BODIES, WORLD_IDS } from './config.js';
import { Ephemeris, eqjToWorld, earthAt } from './sim/ephemeris.js';
import { SimClock } from './sim/clock.js';
import { CameraRig } from './camera/rig.js';
import { SolarSystemView } from './scene/bodies.js';
import { SiteView } from './scene/site.js';
import { EVENTS } from '../data/events.js';
import { EQUIPMENT } from '../data/equipment.js';
import { ClockUI } from './ui/clockui.js';
import { Panel, CREWED } from './ui/panel.js';
import { Apollo11Film } from './ui/apollo11.js';
import { MissionFilm, FILMS } from './ui/missionfilm.js';
import { CLIP_AT } from './ui/clips.js';
import { perf } from './ui/perf.js';
import { leftBehind } from './ui/leftbehind.js';
import { setupVoyagerMessage, homeLines, useClock } from './ui/voyagermsg.js';
import { setupJoystick } from './ui/joystick.js';
import { setupLearned } from './ui/learned.js';
import { Ambient } from './audio/ambient.js';
import { Museum, KSC, exhibitCount } from './ui/museum.js';
import { Alerts } from './ui/alerts.js';
import { News } from './ui/news.js';
import { setupGuide } from './ui/guide.js';
import { setupTutorial } from './ui/tutorial.js';
import { setupOpening } from './ui/opening.js';
import { Indicators } from './ui/indicators.js';
import { Timeline } from './ui/timeline.js';
import { EventList } from './ui/eventlist.js';
import { ObjectViewer, hasObject } from './ui/objectviewer.js';
import { Echo } from './ui/echo.js';
import { Showcase } from './ui/showcase.js';
import { SHOWS } from './ui/shows.js';
import { ProbeFleet, OrbitLines } from './scene/probes.js';
import { SiteScenes, scenesFor } from './scene/scenes.js';
import { PROBES } from '../data/probes.js';
import { WORLD_UP } from './camera/targets.js';

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const loadingEl = $('loading');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true, powerPreference: 'high-performance' });
} catch (err) {
  loadingEl.textContent = 'This page needs WebGL. Try a recent version of Chrome, Edge, Firefox or Safari.';
  throw err;
}
// Performance first: start at a modest resolution and step down automatically if frames are slow.
// Sharpness that does not depend on browser zoom or window size. A fixed ratio (like 1.25) turns
// blurry as soon as the page is zoomed in, because the browser then reports a much higher device
// pixel ratio. Instead the picture always gets the same number of real pixels: the screen's own
// resolution, up to a budget. It is never lowered automatically.
const PIXEL_BUDGET = 2.4e6;
function sharpRatio(w, h, budget = PIXEL_BUDGET) {
  const dpr = window.devicePixelRatio || 1;
  return Math.max(Math.min(1, dpr), Math.min(dpr, Math.sqrt(budget * (typeof budgetScale === 'number' ? budgetScale : 1) / Math.max(1, w * h))));
}
let budgetScale = 1;          // lowered step by step when frames are slow (see adaptResolution)
let pixelRatio = sharpRatio(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(pixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;   // redrawn only when the Sun, the site or an animation changed (see shadowTick)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(45, 1, 1e-5, 1e12);   // far enough to see the Sun from Voyager 1

const eph = new Ephemeris();
const clock = new SimClock(EVENTS);
eph.update(clock.ms);

let texturesReady = false;
const views = new SolarSystemView(scene, renderer, eqjToWorld, () => {
  texturesReady = true;
  loadingEl.classList.add('gone');
  openFromHash();
});
const site = new SiteView(views);
const fleet = new ProbeFleet(scene, eph);
const orbits = new OrbitLines(scene, eph);
const scenes = new SiteScenes(site, showCaption);
scenes.camDir = () => (rig.mode === 'site' ? rig.viewDir() : null);
const rig = new CameraRig(camera, canvas, eph, clock);
// The first view (behind the intro): the Earth turning against plain stars, looking toward the south galactic
// pole so that no part of the Milky Way is in the picture. Press Start and the camera backs away, then swings
// round until the bright centre of the Milky Way rises behind the Earth (FINAL_*).
const GC_DIR = eqjToWorld(-0.0548755604, -0.8734370902, -0.4838350155, 1, new THREE.Vector3());   // galactic centre
const NGP_DIR = eqjToWorld(-0.8676661, -0.1980764, 0.4559838, 1, new THREE.Vector3());            // north galactic pole
const FINAL_DIST_R = 4.5;
rig.initView('earth', NGP_DIR, 3.15);
const FINAL_TURN = -12.5 * Math.PI / 180;     // a little further round, so the dark rift runs down beside the Earth
// While it moves the screen is clean, as with H; the windows fade in as the Milky Way arrives.
// Returns false if there was nothing to play (the view was already somewhere else).
let wantFilm = false;
function openingSwing(onReveal) {
  if (rig.mode !== 'orbit' || rig.bodyId !== 'earth' || rig.flying || rig.photo) return false;
  const dir = rig.orbitDir('earth', GC_DIR).applyAxisAngle(new THREE.Vector3(0, 1, 0), FINAL_TURN);
  if (!rig.swingTo(dir, FINAL_DIST_R, 5.2)) return false;
  document.body.classList.add('shot', 'opening');
  let shown = false;
  const watch = () => {
    const w = rig.swing;
    if (!shown && !w) {                                // the swing has fully stopped: wait a breath, then show the windows
      shown = true;
      setTimeout(reveal, 500);
    }
    if (!shown) requestAnimationFrame(watch);
  };
  const show = () => {
    document.body.classList.remove('shot', 'opening'); document.body.classList.add('ui-in');
    setTimeout(() => document.body.classList.remove('ui-in'), 1200);
    onReveal();
  };
  // after Start the opening film plays first (time stands still meanwhile); the windows come in when it ends
  const reveal = () => {
    const calm = rig.mode === 'orbit' && rig.bodyId === 'earth' && !rig.flying && !rig.photo && !viewer.isOpen && !museum.isOpen && !anyFilm() && !news.isOpen;
    if (!wantFilm || !calm) { show(); return; }
    wantFilm = false; clock.holds++;
    opening.play(() => { clock.holds = Math.max(0, clock.holds - 1); show(); });
  };
  requestAnimationFrame(watch);
  return true;
}
canvas.addEventListener('pointerdown', () => rig.stopSwing(), { capture: true });
canvas.addEventListener('wheel', () => rig.stopSwing(), { passive: true });

// ------------------------------------------------------------------ interface
const alerts = new Alerts($('alerts'), $('toasts'));
const panel = new Panel($('panel'), {
  onObj: (act, q) => {                                   // the panel's search: 3D view, its day, or its page
    closeIntro();
    if (act === 'obj3d') { if (hasObject(q)) viewObject(q); else if (q.isProbe) goProbe(q); else goSite(q); }
    else if (act === 'objgo') { if (q.isProbe) { clock.jumpTo(q.launchMs + 60e3); goProbe(q); } else jumpForArrival(Date.parse(q.arrival), q); }
    else if (q.isProbe) goProbe(q); else goSite(q);
  },
  onSelect: (eq) => goSite(eq),
  onEcho: () => openEcho(),
  onFeatured: (id) => openFeatured(id),
  onMessage: () => openMessage(),
  onFilms: () => $('goFilms').click(),
  onLearned: () => learned.open(),
  onBody: (id) => goBody(id),
  onClose: () => {},
  onJump: (ms, eq) => jumpForArrival(ms, eq),
  onSunrise: (eq) => jumpToSunrise(eq),
  onPart: (eq, part) => lookAtPart(eq, part),
  onScene: (eq, i) => watchScene(eq, i),
  onRide: (def) => goProbe(def),
  onNextEvent: () => nextEvent(),
  onEvent: (e) => jumpToEvent(e),
  onWalk: (eq) => startWalk(eq),
  onDrive: (eq) => startDrive(eq),
  onLanding: (id) => watchScene(eqById(id), 0),
  onFilm: (id) => openFilm(id || 'apollo11'),
  onObject: (q) => viewObject(q),
  onFlyby: (def, i) => flyPast(def, i),
});

const PART_VIEW = { lm: 30, lrv: 10, alsep: 13, lrrr: 4, flag: 6, easep: 6, surveyor: 11 };   // metres
function lookAtPart(eq, part) {
  const target = new THREE.Vector3((part.e || 0) / 1000, 0.0012, -(part.n || 0) / 1000);
  const dist = (part.look || PART_VIEW[part.type] || 12) / 1000;
  if (rig.mode === 'site' && rig.eq === eq && !rig.flying) rig.focusLocal(target, dist);
}
const indicators = new Indicators($('overlay'), { onBody: (id) => { if (!scenes.playing) goBody(id); }, onMarker: (eq) => { if (!scenes.playing) goSite(eq); } });
const timeline = new Timeline($('timeline'), EVENTS, {
  start: Date.UTC(1957, 0, 1), end: Date.UTC(2027, 0, 1),
  onJump: (ms) => clock.jumpTo(ms),
  onEvent: (e) => jumpToEvent(e),
});
const clockUI = new ClockUI(clock, { onNext: nextEvent, onPrev: prevEvent });
const eventList = new EventList($('evlist'), $('tlToggle'), clock.events, { onEvent: (e) => { closeIntro(); jumpToEvent(e); } });

const eqById = (id) => EQUIPMENT.find((q) => q.id === id);

const probeById = (id) => PROBES.find((q) => q.id === id);

// "View object": a 3D turntable of the hardware with a short explanation.
const viewer = new ObjectViewer($('viewer'));
// Exhibition hall (virtual, set at Kennedy Space Center): all hardware, part by part.
const museum = new Museum($('museum'), { onOpenExhibit: (q) => viewObject(q, true), isInspecting: () => viewer.isOpen });
function openMuseum() { closeIntro(); if (rig.photo) { if (rig.photo.walk) setWalk(false); else setPhoto(false); } museum.open(); }   // the hall shows where each machine stands today
$('goMuseum').addEventListener('click', openMuseum);
$('goHome').addEventListener('click', goHome);
const film = new Apollo11Film();
const films = { apollo11: film };
for (const id in FILMS) {
  const f = films[id] = new MissionFilm(FILMS[id]);
  // when one of these films ends, the simulation carries on from where the film stopped
  f.onFinish = (def) => {
    const fin = def.finish || {};
    if (fin.t) clock.jumpTo(fin.t);
    if (fin.eq) goSite(eqById(fin.eq)); else if (fin.probe) goProbe(probeById(fin.probe));
    newsCatchUp();
  };
}
const echo = new Echo($('echo'));                     // the finale: fire a laser at the mirror Apollo 11 left
const showcase = new Showcase($('showcase'));         // "Voyager 1, up close": the hand-built Voyager, part by part
showcase.actions = { ride: (id) => { closeIntro(); goProbe(probeById(id)); }, object: (id) => viewObject(probeById(id) || eqById(id)), film: (id) => openFilm(id), site: (id) => { closeIntro(); goSite(eqById(id)); },
  walk: (id) => { closeIntro(); startWalk(eqById(id)); }, echo: () => openEcho() };
showcase.leftBehind = (id) => leftBehind(id);
// ---- the "Left behind" card after the Apollo 11 film (the other three featured animations show it on their own end screen)
const lbCard = document.createElement('div'); lbCard.id = 'leftCard'; lbCard.hidden = true; document.body.appendChild(lbCard);
function showLeftBehind(id) {
  const lb = leftBehind(id); if (!lb) return;
  lbCard.innerHTML = `<button class="lc-x" data-a="close" title="Close">✕</button>${lb.html}<div class="lc-row">${lb.buttons.map(([t, a, arg]) => `<button data-a="${a}" data-arg="${arg}">${t}</button>`).join('')}<button data-a="close">Close</button></div>`;
  lbCard.hidden = false;
}
lbCard.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  lbCard.hidden = true;
  const a = b.dataset.a; if (a !== 'close' && showcase.actions[a]) showcase.actions[a](b.dataset.arg);
});
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lbCard.hidden) { lbCard.hidden = true; } });
// Tab = Skip: the opening film, a film suggestion, a film or the featured animations (their Skip / Next button)
{
  const shown = (el) => el && !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.disabled;
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const b = [document.querySelector('#opening .op-skip'), $('filmAsk').hidden ? null : $('faNo'),
      ...document.querySelectorAll('.a-skip[data-act="skip"]'), document.querySelector('#showcase .sc-skip')].find(shown);
    if (!b) return;                                     // nothing to skip: Tab moves between buttons as usual
    e.preventDefault(); e.stopPropagation(); b.click();
  }, true);
}
// ---- "Message to Voyager": write to Voyager 1 as 30,000 people did through NASA in 2017, and follow the message out
const vDist = (ms = Date.now()) => { const p = probeById('voyager1'), v = new THREE.Vector3(); p.at(ms, v); return v.distanceTo(earthAt(ms)); };
const vHelio = (ms = Date.now()) => probeById('voyager1').at(ms, new THREE.Vector3()).length();
useClock(() => clock.ms);                            // Message to Voyager runs on the simulation's clock, like everything else
const vmsg = setupVoyagerMessage({ distanceNow: vDist, helioNow: vHelio, onRide: () => { closeIntro(); goProbe(probeById('voyager1')); }, onJump: (ms) => { closeIntro(); clock.jumpTo(ms); } });
function openMessage() { if (viewer.isOpen || museum.isOpen || anyFilm()) return; closeIntro(); vmsg.open(); }
setInterval(() => { const l = document.querySelector('#panel .vm-live'); if (l) l.textContent = homeLines(); }, 1000);
// ---- "What we learned": the team's notes; each lesson can take you to the place in the app where it happened
const learned = setupLearned({ run: (a, arg, t) => {
  closeIntro();
  if (a === 'echo') openEcho();
  else if (a === 'vmsg') openMessage();
  else if (a === 'about') $('goAbout').click();
  else if (a === 'tutorial') school.start();
  else if (a === 'object') viewObject(eqById(arg) || probeById(arg));
  else if (a === 'site') { const q = eqById(arg); if (clock.ms < Date.parse(q.arrival)) clock.jumpTo(Date.parse(q.arrival) + 60e3); goSite(q); }
  else if (a === 'probe') { const p = probeById(arg); clock.jumpTo(t ? Date.parse(t) : Date.now()); goProbe(p); }
} });
$('goLearned').addEventListener('click', () => { if (window.__menu) window.__menu(false); learned.open(); });
// Developers: who made this
{
  const card = $('devCard'), show = (on) => { card.hidden = !on; };
  $('goDevs').addEventListener('click', () => { if (window.__menu) window.__menu(false); show(true); });
  card.addEventListener('click', (e) => { if (e.target === card || e.target.closest('.dv-x')) show(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !card.hidden) { e.stopPropagation(); show(false); } }, true);
}
const opening = setupOpening();                      // the 40-second opening film, after Start
const anyFilm = () => Object.values(films).some((f) => f.isOpen) || echo.isOpen || showcase.isOpen || opening.isOpen;
function openShowcase(id = 'voyager') {
  perf.doing('open ' + id);
  if (viewer.isOpen || museum.isOpen || anyFilm() || !SHOWS[id]) return; closeIntro();
  const info = {}, def = probeById('voyager1');
  if (id === 'voyager' && def && def.at) { try { const v = new THREE.Vector3(); def.at(Date.now(), v); if (v.length() > 1e9) { info.dist = v.length(); info.distE = v.distanceTo(earthAt(Date.now())); } } catch (e) { /* keep the plain sentence */ } }
  scPaused = clock.paused; clock.paused = true;                 // the simulation waits while it plays
  showcase.open(SHOWS[id], info);
}
let scPaused = false;
showcase.onClose = () => { clock.paused = scPaused; };
// the four featured animations (right-hand panel, and the end of flight school)
// The four featured animations each belong to a moment in the story. Choosing one travels there in time first (out
// past the Earth, facing the Milky Way while the years roll by, then back to the Earth), and it starts on arrival.
// When the clock reaches that moment by itself, it slows down and the animation plays (as the Apollo 11 film always did).
const FEATURED = {
  voyager: { t: '1977-09-05T12:56:00Z', label: '→ 5 September 1977 · Voyager 1 launches' },
  apollo: { t: '1969-07-16T13:32:00Z', label: '→ 16 July 1969 · Apollo 11' },
  percy: { t: '2021-02-18T20:55:00Z', label: '→ 18 February 2021 · Perseverance lands' },
  webb: { t: '2021-12-25T12:20:00Z', label: '→ 25 December 2021 · James Webb launches' },
};
function playFeatured(id) { if (id === 'apollo') openFilm('apollo11'); else openShowcase(id); }
function openFeatured(id) {
  const f = FEATURED[id]; if (!f || museum.isOpen || anyFilm() || warping) return;
  if (viewer.isOpen) viewer.close();
  closeIntro(); if (school.active() && school.stepId() !== 'feat') school.quit();      // (the tutorial's "Watch the films" step waits for it)
  // the clock stands still from the click until the animation is closed: the only time that passes is the jump itself
  const keep = clock.paused; clock.paused = true;
  const after = () => { playFeatured(id); if (showcase.isOpen) scPaused = keep; else if (anyFilm()) filmPaused = keep; else clock.paused = keep; };
  const go = () => timeWarp(Date.parse(f.t) + 1000, f.label, after);     // one second after the moment, so its event does not start it a second time
  if (rig.mode === 'orbit' && rig.bodyId === 'earth' && !rig.flying && !rig.photo) { go(); return; }
  goHome();                                                   // fly back to the Earth first, then travel in time
  const wait = setInterval(() => { if (!rig.flying) { clearInterval(wait); setTimeout(go, 400); } }, 200);
}
function openEcho() { if (viewer.isOpen || museum.isOpen || anyFilm()) return; closeIntro(); echo.open(); }
let filmPaused = false;
function openFilm(id = 'apollo11') {
  perf.doing('open film ' + id);
  if (viewer.isOpen || museum.isOpen || anyFilm() || !films[id]) return;
  $('filmAsk').hidden = true;
  filmPaused = clock.paused; clock.paused = true;            // the simulation waits while the film runs
  films[id].open();
}
for (const f of Object.values(films)) f.onClose = () => { clock.paused = filmPaused; };
// At the moment of a launch the simulation stops and asks: watch the film, or carry on?
let askFor = null, askPaused = false;
function askFilm(e) {
  if (anyFilm() || viewer.isOpen || museum.isOpen) return;
  askFor = e.film; askPaused = clock.paused; clock.paused = true;
  $('faTitle').textContent = e.title; $('faText').textContent = `${new Date(e.ms).toUTCString().slice(5, 22)} UTC. ${e.text} Watch how it happened, scene by scene?`;
  $('filmAsk').hidden = false;
}
$('faYes').addEventListener('click', () => { const id = askFor; $('filmAsk').hidden = true; clock.paused = askPaused; openFilm(id); });
$('faNo').addEventListener('click', () => { $('filmAsk').hidden = true; clock.paused = askPaused; });
// When the film ends (or is skipped) the simulation continues at the moment it ends: the landing.
film.onFinish = () => { const eq = eqById('apollo11'); clock.jumpTo(Date.parse('1969-07-20T20:17:40Z') + 2000); goSite(eq); newsCatchUp(); showLeftBehind('apollo'); };
// (the Apollo 11 film is opened from the list of all films)
// ---- news: the biggest moments pop up as a headline; clicking it opens the story with its photos
let newsPaused = false;
const newsSubject = (n) => (n.eq ? eqById(n.eq) : probeById(n.probe));
const news = new News({
  subject: (n) => { const q = newsSubject(n); return q ? { name: q.name, short: q.short, sources: q.sources, hasObject: hasObject(q) } : {}; },
  onGo: (n) => { const q = newsSubject(n); if (clock.ms < n.ms) clock.jumpTo(n.ms + 60e3); if (n.eq) goSite(q); else goProbe(q); },
  onObject: (n) => viewObject(newsSubject(n)),
  onFilm: (n) => openFilm(n.film),
  onOpen: () => { newsPaused = clock.paused; clock.paused = true; },
  onClose: () => { clock.paused = newsPaused; },
});
// a film ends by jumping the clock to its last moment: if a news story happened right then, announce it now
function newsCatchUp() { const n = news.latest(clock.ms); if (n && n.ms <= clock.ms && clock.ms - n.ms < 15 * 60e3) setTimeout(() => news.toast(n), 600); }
const guide = setupGuide({ $, clock, goSite, goProbe, eqById, probeById, busy: () => viewer.isOpen || museum.isOpen || anyFilm() || news.isOpen, onFinale: () => openEcho() });
// ---- time travel, filmed like a flashback: the camera is pulled up and away from the Earth until only stars are
// left, turns slowly to the Milky Way while the clock winds, then dives back down to the Earth of that day
let warping = false;
const warpFx = document.createElement('canvas'); warpFx.id = 'warpFx'; document.body.appendChild(warpFx);
function timeWarp(targetMs, label, onDone) {
  if (warping) return;
  if (rig.photo) { if (rig.photo.walk) setWalk(false); else setPhoto(false); }
  const from = clock.ms, wasPaused = clock.paused;
  if (rig.flying || !rig.enterPhoto()) { clock.jumpTo(targetMs); if (onDone) onDone(); return; }
  warping = true; clock.paused = true; document.body.classList.add('warping');
  const ph = rig.photo, fov0 = camera.fov, pos0 = camera.position.clone(), t0 = performance.now();
  const A = 2.8, B = 3.2, C = 4.2, Dn = 3.0, TOTAL = A + B + C + Dn;          // pull away, turn, watch the years go by, dive back
  let yawS = ph.yaw, pitchS = ph.pitch, lastT = 0;
  const galDir = views.milkyWay.userData.galDir, v = new THREE.Vector3(), e = new THREE.Vector3(), up = new THREE.Vector3();
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const io = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };      // slow, fast, slow: a pull you can feel
  const soft = (x) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const aim = (dir) => [Math.atan2(-dir.x, -dir.z), Math.asin(Math.max(-1, Math.min(1, dir.y)))];
  const mixAng = (a, b2, k) => a + Math.atan2(Math.sin(b2 - a), Math.cos(b2 - a)) * k;
  // where we are pulled to: straight up out of the plane of the planets, 1.6 million km away, where the Earth is a dot
  rig.toRender(eph.earth.pos, e);
  up.set(0, 1, 0).applyMatrix4(rig.R).normalize();
  const away = pos0.clone().sub(e), d0 = away.length(), FAR = 1.6e6;
  const dirOut = up.clone().multiplyScalar(0.92).addScaledVector(away.clone().normalize(), 0.4).normalize();
  const posAt = (k) => e.clone().addScaledVector(away.clone().normalize().lerp(dirOut, soft(Math.min(1, k * 1.6))).normalize(), d0 * Math.pow(FAR / d0, k));
  const fx = warpFx.getContext('2d'), seeds = Array.from({ length: 130 }, () => [Math.random() * 6.2832, Math.random(), 0.4 + Math.random() * 0.6]);
  const streaks = (speed, inward, t) => {
    const w = warpFx.clientWidth, h = warpFx.clientHeight, R = Math.hypot(w, h) / 2;
    if (warpFx.width !== w || warpFx.height !== h) { warpFx.width = w; warpFx.height = h; } else fx.clearRect(0, 0, w, h);
    if (speed < 0.02) return;
    fx.lineCap = 'round';
    for (const [a, r, q] of seeds) {
      let rr = (r + t * 0.9 * q * (inward ? -1 : 1)) % 1; if (rr < 0) rr += 1;
      const r1 = (0.10 + rr * 0.95) * R, len = speed * (30 + 190 * rr) * q, c = Math.cos(a), s2 = Math.sin(a);
      fx.strokeStyle = `rgba(205,225,255,${(0.05 + 0.4 * rr) * Math.min(1, speed * 1.3)})`; fx.lineWidth = 0.8 + rr * 1.6;
      fx.beginPath(); fx.moveTo(w / 2 + c * r1, h / 2 + s2 * r1); fx.lineTo(w / 2 + c * (r1 + len), h / 2 + s2 * (r1 + len)); fx.stroke();
    }
  };
  showCaption('Time travel', label, TOTAL - 1.2);
  const finish = () => { clock.jumpTo(targetMs); if (rig.photo) rig.exitPhoto(); camera.fov = fov0; camera.updateProjectionMatrix(); warping = false; clock.paused = wasPaused; document.body.classList.remove('warping'); fx.clearRect(0, 0, warpFx.width, warpFx.height); if (onDone) onDone(); };
  const step = () => {
    const t = (performance.now() - t0) / 1000;
    if (!rig.photo || t >= TOTAL) { finish(); return; }
    rig.toRender(eph.earth.pos, e);
    // --- where the camera is
    const kOut = io(t / A), kBack = io((t - A - B - C) / Dn), k = kOut * (1 - kBack);
    camera.position.copy(posAt(k));
    // --- where it looks: at the Earth while leaving and arriving, at the Milky Way in between (drifting slowly along it).
    // The turn is one single arc across the sky (a slerp between the two directions), eased at both ends, and then
    // passed through a soft follow so that nothing in it can ever jerk.
    const toE = e.clone().sub(camera.position).normalize();
    v.copy(galDir(74 + 14 * clamp01((t - A) / (B + C)), 1.5)).applyMatrix4(rig.R).normalize();
    const look = soft((t - A * 0.7) / B) * (1 - soft((t - A - B - C + 0.4) / (Dn * 0.7)));
    const ang = Math.acos(Math.max(-1, Math.min(1, toE.dot(v)))), sn = Math.sin(ang) || 1;
    const dir = toE.clone().multiplyScalar(Math.sin((1 - look) * ang) / sn).addScaledVector(v, Math.sin(look * ang) / sn).normalize();
    const [yT, pT] = aim(dir), dt = Math.min(0.05, t - lastT), f = 1 - Math.exp(-dt * 9); lastT = t;
    yawS = mixAng(yawS, yT, f); pitchS += (pT - pitchS) * f;
    const sp = Math.max(Math.sin(Math.PI * clamp01(t / A)), Math.sin(Math.PI * clamp01((t - A - B - C) / Dn)));     // how fast we are moving, 0..1
    ph.yaw = yawS; ph.pitch = pitchS;
    camera.fov = fov0 + 22 * sp * sp + 6 * look; camera.updateProjectionMatrix();                // the picture stretches as we accelerate
    streaks(sp * sp, t < A + B, t);
    // --- the clock winds only while the Earth is out of the picture, so it is never seen spinning
    const wind = soft((t - (A + B * 0.85)) / (C + B * 0.15 - 0.6));
    clock.ms = from + (targetMs - from) * wind;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const school = setupTutorial({ $, clock, rig, viewer, museum, canvas, busy: () => anyFilm() || news.isOpen, scenePlaying: () => scenes.playing, introGone: () => $('intro').classList.contains('gone'),
  onFinal: () => { if (!panel.view || panel.view.kind !== 'home') panel.showHome(clock.ms); const p = $('panel'); if (p) p.scrollTop = 0; },
  onFeatured: (id) => openFeatured(id || 'voyager'),
  onApollo: () => {
    if (viewer.isOpen) viewer.close();
    const keep = clock.paused; clock.paused = true;            // time stands still except for the jump itself
    const go = () => timeWarp(Date.parse('1969-07-16T13:32:01Z'), '→ 16 July 1969 · Apollo 11', () => { openFilm('apollo11'); if (anyFilm()) filmPaused = keep; else clock.paused = keep; });   // one second after lift-off, so the lift-off event does not open the film a second time when it is closed
    if (rig.mode === 'orbit' && rig.bodyId === 'earth' && !rig.flying) { go(); return; }
    goHome();                                                   // fly back to the Earth first, then travel in time
    const wait = setInterval(() => { if (!rig.flying) { clearInterval(wait); setTimeout(go, 400); } }, 200);
  } });
for (const e of clock.events) if (CLIP_AT[e.t] && !e.film) e.film = CLIP_AT[e.t];      // thirty film moments in all: about one every two years
for (const e of clock.events) for (const id in FEATURED) if (e.t === FEATURED[id].t) e.show = id;
// ---- the list of all the films
{
  const fl = document.createElement('div'); fl.id = 'filmList'; fl.hidden = true; document.body.appendChild(fl);
  const b = document.createElement('button'); b.id = 'goFilms'; b.className = 'tool'; b.title = 'Every film and clip, in order of time'; $('goTour').after(b);   // in the main row, so nobody misses them
  const list = clock.events.filter((e) => e.film);
  b.textContent = `All ${list.length} films`;
  panel.filmCount = list.length; panel.exhibitCount = exhibitCount(); if (panel.view && panel.view.kind === 'home') panel.showHome(clock.ms);
  b.addEventListener('click', () => {
    fl.innerHTML = `<div class="ab-page fl-page" role="dialog" aria-label="All films"><button class="ab-x" aria-label="Close">✕</button><h2>${list.length} films, 1964 to 2022</h2><p class="ab-lead">The big moments, as short films. Each one also offers itself when the clock reaches its day.</p><div class="fl-grid">${list.map((e, k) => `<button data-k="${k}"><b>${new Date(e.ms).getUTCFullYear()}</b><span>${e.title}</span><i>${films[e.film] && films[e.film].def && films[e.film].def.clip ? 'clip' : 'film'}</i></button>`).join('')}</div></div>`;
    fl.hidden = false;
  });
  // open film number k of the list, with "previous film" and "next film" buttons inside it
  const openAt = (k) => {
    const e = list[k]; if (!e) return;
    for (const f of Object.values(films)) if (f.isOpen) f.close();
    closeIntro(); clock.jumpTo(e.ms + 1000);            // just after the moment, so its event does not ask about the film again afterwards
    openFilm(e.film);
    const f = films[e.film], ctl = f.isOpen && f.root && f.root.querySelector('.a-ctl'); if (!ctl) return;
    const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const box = document.createElement('span'); box.className = 'a-films';
    box.innerHTML = `<button data-film="-1" ${k > 0 ? `title="${esc(new Date(list[k - 1].ms).getUTCFullYear() + ': ' + list[k - 1].title)}"` : 'disabled'}>‹ Previous film</button><b>Film ${k + 1} of ${list.length}</b><button data-film="1" ${k < list.length - 1 ? `title="${esc(new Date(list[k + 1].ms).getUTCFullYear() + ': ' + list[k + 1].title)}"` : 'disabled'}>Next film ›</button>`;
    box.addEventListener('click', (ev) => { const b = ev.target.closest('[data-film]'); ev.stopPropagation(); if (b && !b.disabled) openAt(k + (+b.dataset.film)); });
    ctl.appendChild(box);
  };
  fl.addEventListener('click', (ev) => {
    if (ev.target === fl || ev.target.closest('.ab-x')) { fl.hidden = true; return; }
    const k = ev.target.closest('[data-k]'); if (!k) return;
    fl.hidden = true; openAt(+k.dataset.k);
  });
}
for (const e of clock.events) if (news.byTime(e.t)) e.news = true;      // the clock slows for these whatever the settings
$('goNews').addEventListener('click', () => { if (!viewer.isOpen && !museum.isOpen && !anyFilm()) { closeIntro(); news.open(news.latest(clock.ms)); } });
$('kscPin').addEventListener('click', openMuseum);
const _ksc = new THREE.Vector3(), _kscN = new THREE.Vector3(), _kscR = new THREE.Vector3();
function updateKscPin() {
  const pin = $('kscPin');
  if (!pin.hidden) pin.hidden = true;
  return;      // the exhibition hall is in orbit now: no pin on the ground
  let show = rig.bodyId === 'earth' && rig.mode === 'orbit' && !rig.flying && !rig.photo && intro.classList.contains('gone');
  if (show) {
    eph.earth.surfacePoint(KSC.lat, KSC.lon, 1, _ksc); eph.earth.dir(KSC.lat, KSC.lon, _kscN);
    show = _kscN.dot(_kscR.copy(rig.camWorld).sub(_ksc)) > 0 && rig.camWorld.distanceTo(eph.earth.pos) < eph.earth.radius * 12;
    if (show) {
      rig.toRender(_ksc, _kscR).project(camera);
      show = Math.abs(_kscR.x) < 1 && Math.abs(_kscR.y) < 1 && _kscR.z < 1;
      if (show) { pin.style.left = `${((_kscR.x + 1) / 2 * window.innerWidth).toFixed(1)}px`; pin.style.top = `${((1 - _kscR.y) / 2 * window.innerHeight).toFixed(1)}px`; }
    }
  }
  if (pin.hidden === show) pin.hidden = !show;
}
function viewObject(q, fromMuseum) {
  if (!hasObject(q)) return;
  const there = !fromMuseum && (q.isProbe ? rig.bodyId === q.id : rig.mode === 'site' && rig.eq === q);
  const real = q.of || q;                              // a single piece shown in the exhibition belongs to its landing site
  viewer.open(q, there ? null : () => { museum.close(); if (q.isProbe) goProbe(q); else jumpForArrivalIfNeeded(real); }, q.isProbe ? `Ride with ${q.name}` : 'Fly to where it rests');
}
// Switches for measuring what the main view costs (only work while the frame meter shows; see ui/perf.js)
{
  const E = views.meshes.earth;
  perf.toggle1('1', 'milky way', (v) => { views.milkyWay.visible = v; });
  perf.toggle1('2', 'stars', (v) => { views.stars.visible = v; });
  perf.toggle1('3', 'earth clouds+air', (v) => { E.children.forEach((c) => { c.visible = v; }); });
  perf.toggle1('4', 'earth', (v) => { E.visible = v; });
  perf.toggle1('5', 'moon', (v) => { views.meshes.moon.visible = v; });
  perf.toggle1('6', 'labels', (v) => { indicators.hiddenForPerf = !v; document.body.classList.toggle('perf-nolabels', !v); });
  perf.toggle1('7', 'full res', (v) => { budgetScale = v ? 1 : 0.35; resize(); });
  // and for the featured animations and the Apollo 11 film
  const live = () => (showcase.isOpen ? showcase : film.isOpen ? film : null);
  perf.toggle1('8', 'glow', (v) => { if (showcase.isOpen) showcase.plain = !v; if (film.isOpen && film.cine) film.cine.plain = !v; });
  perf.toggle1('9', 'shadows', (v) => { const x = live(); if (!x || !x.renderer) return; x.renderer.shadowMap.enabled = v; for (const sc of [x.scene, x.fg].filter(Boolean)) sc.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); });
  perf.toggle1('0', 'anim full res', (v) => { const x = live(); if (!x || !x.adapt) return; x.adapt.k = v ? 1 : 0.4; x.adapt.hold = v ? 0 : 1e9; x._w = 0; });
}
// The buttons at the top left fold away behind one ☰ button; pressing it lets them drop down one after another.
{
  const tools = $('tools'), mb = $('menuBtn');
  const setMenu = (on) => {
    tools.classList.toggle('open', on); mb.setAttribute('aria-expanded', on ? 'true' : 'false'); mb.innerHTML = on ? '<span>✕</span>' : '<i></i><i></i><i></i>';
    if (on) [...tools.querySelectorAll(':scope > .tool:not(#menuBtn), :scope > #moreBox > .tool')].forEach((b, i) => b.style.setProperty('--i', i));
    if (!on) { $('gomenu').hidden = true; }
  };
  setMenu(false);
  mb.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!tools.classList.contains('open')); });
  document.addEventListener('pointerdown', (e) => { if (tools.classList.contains('open') && !e.target.closest('#tools') && !e.target.closest('#gomenu') && !e.target.closest('#tut') && !(school.active() && innerWidth > 0 && e.target.closest('#tutRing'))) setMenu(false); }, true);
  window.__menu = setMenu;
}
// ---- Find: every machine in the story by name. A click opens it in 3D with its story beside it (or, for the few
// without a 3D model, flies to it and opens its page).
{
  const btn = $('objFind'), box = $('objSearch'), ALL = [...EQUIPMENT, ...PROBES];
  const sub = (q) => q.isProbe ? `Probe · launched ${new Date(q.launchMs).getUTCFullYear()}` : `${q.body === 'moon' ? 'The Moon' : 'Mars'} · ${new Date(q.arrival).getUTCFullYear()}`;
  const esc2 = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  box.innerHTML = `<div class="os-top"><input type="search" placeholder="Search ${ALL.length} machines: Apollo, Voyager, rover…" aria-label="Search machines" autocomplete="off"><button class="os-x" aria-label="Close">✕</button></div><ul class="os-list"></ul>`;
  const input = box.querySelector('input'), list = box.querySelector('.os-list');
  const render = () => {
    const w = input.value.trim().toLowerCase();
    const score = (q) => { const n = q.name.toLowerCase(); return n.startsWith(w) ? 0 : n.includes(w) ? 1 : 2; };      // names that match come first
    const hits = ALL.filter((q) => !w || [q.name, q.mission, q.short, q.isProbe ? 'probe' : q.body].some((t) => t && String(t).toLowerCase().includes(w))).sort((a, b) => (w ? score(a) - score(b) : 0));
    list.innerHTML = hits.length ? hits.map((q) => `<li><button data-id="${q.id}"><b>${esc2(q.name)}</b><span>${esc2(sub(q))}</span>${hasObject(q) ? '<em>3D</em>' : ''}<i>${esc2(q.short || '')}</i></button></li>`).join('') : '<li class="os-none">Nothing by that name. Try "Apollo", "Mars" or "Voyager".</li>';
  };
  const show = (on) => { box.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false'); if (on) { render(); setTimeout(() => input.focus(), 30); } };
  btn.addEventListener('click', () => show(box.hidden));
  box.querySelector('.os-x').addEventListener('click', () => show(false));
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') show(false); if (e.key === 'Enter') { const b = list.querySelector('button'); if (b) b.click(); } });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    const q = ALL.find((x) => x.id === b.dataset.id); if (!q) return;
    show(false); closeIntro();
    if (hasObject(q)) viewObject(q); else if (q.isProbe) goProbe(q); else jumpForArrivalIfNeeded(q);
  });
}
function jumpForArrivalIfNeeded(eq) {
  if (clock.ms < Date.parse(eq.arrival)) clock.jumpTo(Date.parse(eq.arrival) + 60e3);
  goSite(eq);
}

function showPanelFor(id) {
  if (id === 'earth') panel.showLog(clock.ms);
  else if (id === 'moon' || id === 'mars') panel.showBody(id, clock.ms);
  else if (eph[id].isProbe) panel.showProbe(eph[id].def, clock.ms, eph);
  else panel.showPlanet(id, clock.ms, eph);
}

function goBody(id) {
  if (eph[id].isProbe) { goProbe(eph[id].def); return; }
  rig.flyToBody(id);
  showPanelFor(id);
  setHash(id);
}

// ------------------------------------------------------------------ probes: ride along and flybys
/** Fly to a probe and stay with it. If it is not in flight on this date, go to a date when it is. */
function goProbe(def) {
  if (clock.ms < def.launchMs) clock.jumpTo(def.launchMs + 6 * 3600e3);
  else if (def.endMs && clock.ms >= def.endMs) clock.jumpTo(def.endMs - 21 * 86400e3);
  rig.flyToBody(def.id);
  panel.showProbe(def, clock.ms, eph);
  setHash(def.id);
}

/** Jump to shortly before a flyby and ride the probe past the planet, camera on the far side
 *  of the probe so the planet fills the background. */
function flyPast(def, i) {
  const f = def.fly[i];
  if (!f) return;
  // Start as early as possible while the planet is already big in the picture (within 45 of its
  // own radii). Fast probes and small worlds (New Horizons at Pluto) need a much later start.
  let lead = 6, found = false;
  for (const h of [22, 16, 12, 8, 6, 4, 3, 2, 1.5, 1, 0.75, 0.5]) {
    eph.update(f.t - h * 3600e3);
    const sep = eph[def.id].pos.distanceTo(eph[f.body].pos) / eph[f.body].radius;
    if (sep <= 45) { lead = h; found = true; break; }
    if (h === 0.5 && sep < 90) { lead = h; found = true; }
  }
  if (!found) lead = 6;                    // a distant flyby (Cassini at Jupiter): the planet never gets big
  clock.jumpTo(f.t - lead * 3600e3);
  clock.setSpeedIndex(lead >= 12 ? 4 : lead >= 4 ? 3 : lead >= 1.5 ? 2 : 1);     // the planet sweeps past in roughly 10 to 25 seconds
  clock.paused = false;
  eph.update(clock.ms);
  rig.syncWorldPose();
  const pr = eph[def.id], pl = eph[f.body];
  const away = pr.pos.clone().sub(pl.pos).normalize();
  const side = new THREE.Vector3().crossVectors(away, WORLD_UP).normalize();
  const d = away.multiplyScalar(0.9).addScaledVector(side, 0.3).addScaledVector(WORLD_UP, 0.22).normalize();
  rig._fly({
    kind: 'orbit', bodyId: def.id,
    P1: pr.pos.clone().addScaledVector(d, 0.034), T1: pr.pos.clone(),
    A: pr.pos.clone().addScaledVector(d, 0.09), upFinal: WORLD_UP.clone(), cruiseLook: pr.pos.clone(),
  });
  panel.showProbe(def, clock.ms, eph);
  setHash(def.id);
  planetLock = { probe: def.id, body: f.body };
  showCaption(new Date(f.t).toUTCString().slice(5, 16), `${def.name} flies past ${BODIES[f.body].name}`, 7);
}

// During a flyby the camera keeps the probe between itself and the planet, so the planet stays
// in the picture as it sweeps past. Dragging the view hands control back to the user.
let planetLock = null;
const _away = new THREE.Vector3(), _side = new THREE.Vector3();
function applyPlanetLock() {
  if (!planetLock) return;
  if (rig.flying) return;
  if (rig.mode !== 'orbit' || rig.bodyId !== planetLock.probe) { planetLock = null; return; }
  const pr = eph[planetLock.probe], pl = eph[planetLock.body];
  const sep = pr.pos.distanceTo(pl.pos);
  if (sep > pl.radius * 90) { planetLock = null; return; }
  _away.copy(pr.pos).sub(pl.pos).normalize();
  _side.crossVectors(_away, WORLD_UP).normalize();
  _away.multiplyScalar(0.9).addScaledVector(_side, 0.3).addScaledVector(WORLD_UP, 0.22).normalize();
  const dist = camera.position.length() || 0.034;       // orbit mode: render origin is the probe
  camera.position.copy(_away).multiplyScalar(dist);
}
canvas.addEventListener('pointerdown', () => { planetLock = null; });

// ------------------------------------------------------------------ scenes at a site
let pendingScene = null;
function watchScene(eq, i) {
  // Go to the moment itself, so the Sun stands where it really stood when this happened.
  const t = Date.parse(eq.timeline[i].t);
  if (Math.abs(clock.ms - t) > 6 * 3600e3 || clock.ms < t) clock.jumpTo(t + 2000);
  if (rig.mode === 'site' && rig.eq === eq && !rig.flying) startScene(eq, i);
  else { pendingScene = { eq, i }; goSite(eq); }
}
function startScene(eq, i) {
  site.show(eq, eph);
  if (!scenes.play(eq, i)) return;
  if (i === 0 && scenesFor(eq).land !== 'fly' && !(scenes.scene && scenes.scene.style === 'surveyor')) {       // pull back so the descent fits in the frame (Surveyor 1 has its own camera)
    const wide = Math.max(45, ((eq.view && eq.view.dist) || 60) * 2.6);
    rig.focusLocal(new THREE.Vector3((eq.parts[0].e || 0) / 1000, 0.006, -(eq.parts[0].n || 0) / 1000), wide / 1000);
  }
}
/** Which timeline entry of a piece of hardware an event belongs to (-1: none). */
function sceneIndexFor(eq, ms) {
  return eq.timeline.findIndex((en) => Math.abs(Date.parse(en.t) - ms) < 86400e3);
}

function goSite(eq) {
  if (pendingScene && pendingScene.eq !== eq) pendingScene = null;
  site.show(eq, eph);
  rig.flyToSite(eq);
  panel.showEquipment(eq, clock.ms, eph);
  setHash(eq.id);
}

// Lead time so that, after a jump, the event happens a couple of seconds later on screen.
const leadSeconds = () => Math.min(2 * 86400, Math.max(60, clock.userSpeed * 2.5));

function jumpToEvent(e) {
  if (clock.paused) { clock.jumpTo(e.ms + 1000); onEvent(e); }
  else clock.jumpTo(e.ms - leadSeconds() * 1000);
}
function nextEvent() {
  const e = clock.nextEvent(clock.ms + 1000);
  if (e) jumpToEvent(e);
}
function prevEvent() {
  const e = clock.prevEvent(clock.ms - leadSeconds() * 1000 - 1000);
  if (e) jumpToEvent(e);
}
function jumpForArrival(ms, eq) {
  if (clock.paused) clock.jumpTo(ms + 60e3);
  else clock.jumpTo(ms - leadSeconds() * 1000);
  if (eq) goSite(eq);
}

function onEvent(e) {
  // one of the featured animations belongs to this moment: it plays now, in place of the news, the film offer and the flight
  const feat = e.show && e.show !== 'apollo' && autoFly.checked && $('intro').classList.contains('gone') && !anyFilm() && !viewer.isOpen && !museum.isOpen && !warping;
  if (feat) playFeatured(e.show);
  { const n = news.byTime(e.t); if (!feat && n && $('intro').classList.contains('gone') && !anyFilm() && !viewer.isOpen && !museum.isOpen) news.toast(n); }
  if (e.film && !feat && $('intro').classList.contains('gone')) {
    if (e.film === 'apollo11') { if (autoFly.checked) openFilm('apollo11'); }   // Apollo 11 lifts off: the film starts by itself
    else if (e.eq && scenesFor(eqById(e.eq)).land) {
      // a landing scene plays first; the offer of the film waits until it is over, so nothing covers the landing
      const later = (n) => { if (n > 0 && (scenes.playing || pendingScene || rig.flying)) setTimeout(() => later(n - 1), 500); else askFilm(e); };
      setTimeout(() => later(80), 900);
    } else askFilm(e);
  }
  const eq = e.eq ? eqById(e.eq) : null;
  let go = null;
  const probe = e.probe ? probeById(e.probe) : null;
  if (eq) go = { label: `Go to ${eq.name}`, fn: () => goSite(eq) };
  else if (probe) go = { label: `Ride with ${probe.name}`, fn: () => goProbe(probe) };
  else if (e.body !== 'earth') go = { label: e.body === 'moon' ? 'Go to the Moon' : 'Go to Mars', fn: () => goBody(e.body) };
  const obj = eq || probe;
  alerts.push(e, go, hasObject(obj) ? { label: 'View object', fn: () => viewObject(obj) } : null);
  if (eq) indicators.pop(eq.id);
  // Play the matching scene: straight away if we are already there, after the flight otherwise.
  if (eq && !feat) {
    const i = sceneIndexFor(eq, e.ms), sc = scenesFor(eq);
    const has = i === 0 ? !!sc.land : i > 0 && (i === (sc.end && sc.end.i) || eq.id === 'ingenuity' || eq.timeline[i].state !== 'active');
    if (has) {
      if (rig.mode === 'site' && rig.eq === eq && !rig.flying) startScene(eq, i);
      else if (autoFly.checked && !eph[rig.bodyId].isProbe && $('intro').classList.contains('gone')) { pendingScene = { eq, i }; goSite(eq); }
    }
  }
}
rig.on('arrive', (dest) => {
  if (pendingScene && dest.kind === 'site' && dest.eq === pendingScene.eq) {
    const p = pendingScene; pendingScene = null;
    setTimeout(() => { if (rig.mode === 'site' && rig.eq === p.eq) startScene(p.eq, p.i); }, 350);
  }
});
clock.on('event', onEvent);
// A probe that loses contact on a day that is not on the timeline (Pioneer 11, NEAR Shoemaker) still gets a notification
// when the clock runs past that moment, taken from its own record. (Not added to the timeline: its marks stay as they are.)
{
  const onTimeline = new Set(EVENTS.map((e) => `${e.probe || e.eq}|${Date.parse(e.t)}`));
  const LOST = [];
  for (const p of PROBES) for (const s of p.timeline || []) {
    const ms = Date.parse(s.t);
    if ((s.state === 'silent' || s.state === 'ended') && !onTimeline.has(`${p.id}|${ms}`)) LOST.push({ ms, p, s });
  }
  let last = clock.ms;
  clock.on('jump', () => { last = clock.ms; });
  setInterval(() => {
    const now = clock.ms;
    if (now > last && now - last < 400 * 86400e3 && $('intro').classList.contains('gone')) {
      for (const L of LOST) if (L.ms > last && L.ms <= now) {
        const ev = { ms: L.ms, t: L.s.t, body: 'space', probe: L.p.id, title: `${L.p.name}: ${L.s.label}`, text: `Contact with ${L.p.name} is lost here. It is still out there, silent.` };
        alerts.push(ev, { label: `Ride with ${L.p.name}`, fn: () => goProbe(L.p) }, hasObject(L.p) ? { label: 'View object', fn: () => viewObject(L.p) } : null);
      }
    }
    last = now;
  }, 250);
}
clock.on('jump', () => eph.update(clock.ms));   // keep positions in step with any time jump

// Deep links: #apollo11 opens that site (only plain #names are used).
function setHash(id) {
  const want = `#${id}`;
  if (!id || location.hash === want) return;
  suppressHash = true;
  try { history.replaceState(null, '', want); } catch { location.hash = want; }
}
let suppressHash = false;
function openFromHash() {
  const id = location.hash.replace('#', '');
  const eq = eqById(id);
  const probe = probeById(id);
  if (probe) { closeIntro(); goProbe(probe); return; }
  if (!eq && WORLD_IDS.includes(id) && id !== 'earth') { closeIntro(); goBody(id); return; }
  if (!eq) return;
  if (Date.parse(eq.arrival) > clock.ms) clock.jumpTo(Date.parse(eq.arrival) + 3600e3);
  closeIntro();
  goSite(eq);
}
window.addEventListener('hashchange', () => { if (suppressHash) { suppressHash = false; return; } openFromHash(); });

// ------------------------------------------------------------------ next sunrise at a site
const scratch = new Ephemeris();
function nextSunrise(eq, ms) {
  const step = eq.body === 'moon' ? 2 * 3600e3 : 15 * 60e3;
  const limit = eq.body === 'moon' ? 31 * 86400e3 : 2 * 86400e3;
  for (let t = ms; t < ms + limit; t += step) {
    scratch.update(t);
    if (scratch[eq.body].sunElevation(eq.lat, eq.lon) > 4) return t;
  }
  return null;
}
function jumpToSunrise(eq) {
  const t = nextSunrise(eq, clock.ms);
  if (t) clock.jumpTo(t);
}

// ------------------------------------------------------------------ picking bodies with a click
const raycaster = new THREE.Raycaster();
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; hideHint(); });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), held = performance.now() - down.t;
  down = null;
  if (rig.photo) return;   // photo / walk mode: a click only looks around, it never selects a world
  if (moved < 6 && held < 450) pick(e.clientX, e.clientY);
});
const _hit = new THREE.Vector3();
function pick(x, y) {
  if (rig.flying || scenes.playing) return;      // while an arrival scene plays, a click never flies anywhere
  const W = window.innerWidth, H = window.innerHeight;
  raycaster.setFromCamera(new THREE.Vector2((x / W) * 2 - 1, -(y / H) * 2 + 1), camera);
  let best = null;
  for (const id of WORLD_IDS) {
    if (id === 'sun') continue;
    const m = views.meshes[id];
    const hit = raycaster.ray.intersectSphere(new THREE.Sphere(m.position, eph[id].radius), _hit);
    if (hit) {
      const d = hit.distanceTo(camera.position);
      if (!best || d < best.d) best = { id, d };
    }
  }
  if (!best) return;
  if (rig.mode === 'site' && rig.eq && best.id === rig.eq.body) return;   // a click on the ground you stand on
  if (best.id === rig.bodyId && rig.mode === 'orbit') showPanelFor(best.id);
  else goBody(best.id);
}

// ------------------------------------------------------------------ Earth spin time-lapse
// Above SPIN_ALIAS_LIMIT the true spin would strobe (more than ~12 deg per frame), so the
// displayed spin is decoupled and runs at a sixth of a turn per second; it eases back into the
// true orientation when the clock slows down.
let spinOffset = 0, timelapse = false;
function updateSpin(dt) {
  const k = clock.running ? clock.effective : 0;
  if (k > SPIN_ALIAS_LIMIT) {
    const trueDeg = 360.9856 * (k * dt) / 86400;
    spinOffset = (spinOffset + 60 * dt - trueDeg) % 360;
    timelapse = true;
  } else {
    let o = ((spinOffset % 360) + 540) % 360 - 180;
    o *= Math.exp(-dt / 0.35);
    spinOffset = Math.abs(o) < 0.01 ? 0 : o;
    timelapse = Math.abs(o) > 1;
  }
  eph.earthSpinOffsetDeg = spinOffset;
}

// ------------------------------------------------------------------ site lighting
// The ground patch and hardware use standard materials; their light is set so that a flat
// patch matches the planet shader (Lambert / Lommel-Seeliger blend) at the site.
const _cam = new THREE.Vector3();
function updateSiteLighting() {
  const L = views.sunLight;
  if (rig.mode === 'site' && rig.eq) {
    const q = rig.eq, b = eph[q.body];
    const el = b.sunElevation(q.lat, q.lon);
    const mu0 = Math.max(0, Math.sin(el * Math.PI / 180));
    const mu = Math.max(0.05, _cam.copy(camera.position).normalize().y);
    const w = q.body === 'moon' ? 0.62 : 0.28, gain = q.body === 'moon' ? 1.25 : 1.2;
    const ls = Math.min(2 * mu0 / (mu0 + mu + 1e-4), 1.4);
    const shade = (mu0 * (1 - w) + ls * w) * gain;
    // q.dark: the floor of a permanently shadowed crater (our sphere has no crater walls)
    L.intensity = mu0 > 0.01 && !q.dark ? Math.min(Math.PI * shade / mu0, 6) : 0;
    // fit the shadow map to the framed area so small hardware gets crisp shadows
    const half = Math.max(0.006, ((q.view && q.view.dist) || 60) * 1.3 / 1000);
    const sc = L.shadow.camera;
    if (Math.abs(sc.right - half) > 1e-6) {
      sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half;
      sc.updateProjectionMatrix();
    }
    views.fill.intensity = (q.dark || el < 0.5) ? 1.7 : 0.10;
  } else {
    L.intensity = 3.0;
    views.fill.intensity = 0.06;
  }
}

// ------------------------------------------------------------------ intro and hint
// ------------------------------------------------------------------ caption, "Go to" menu, layers, ride bar
let capTimer = 0;
function showCaption(small, big, secs) {
  $('capSmall').textContent = small; $('capBig').textContent = big;
  $('caption').classList.add('on');
  clearTimeout(capTimer); capTimer = setTimeout(() => $('caption').classList.remove('on'), secs * 1000);
}
const autoFly = $('autofly');
{
  const menu = $('gomenu'), btn = $('goBtn');
  document.body.appendChild(menu);      // its own layer: never clipped by the scrolling ☰ list, in any browser
  const dot = (c) => `<i style="background:${c}"></i>`;
  $('goWorlds').innerHTML = WORLD_IDS.map((id) => `<button data-id="${id}">${dot(BODIES[id].color)}${BODIES[id].name}</button>`).join('');
  $('goProbes').innerHTML = PROBES.map((q) => `<button data-id="${q.id}">${dot(q.color)}${q.name}</button>`).join('');
  // the ☰ list scrolls, so the "Go to…" box is placed on the screen next to its button instead of inside the list
  const place = () => {
    if (menu.hidden) return;
    const b = btn.getBoundingClientRect(), t = $('tools').getBoundingClientRect();
    if (!$('tools').classList.contains('open')) { menu.style.left = `${Math.max(8, b.left)}px`; menu.style.top = `${b.bottom + 6}px`; return; }
    if (innerWidth <= 760) { menu.style.left = '12px'; menu.style.top = `${b.bottom + 6}px`; }
    else { menu.style.left = `${t.right + 6}px`; menu.style.top = `${Math.max(8, Math.min(b.top, innerHeight - menu.offsetHeight - 12))}px`; }
  };
  const open = (on) => { menu.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false'); place(); };
  $('tools').addEventListener('scroll', place, { passive: true }); window.addEventListener('resize', place);
  btn.addEventListener('click', () => open(menu.hidden));
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    open(false); closeIntro(); goBody(b.dataset.id);
  });
  window.addEventListener('pointerdown', (e) => { if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) open(false); });
  const toggle = (id, fn) => $(id).addEventListener('click', () => { const on = $(id).getAttribute('aria-pressed') !== 'true'; $(id).setAttribute('aria-pressed', on ? 'true' : 'false'); fn(on); });
  toggle('lyOrbits', (on) => orbits.setVisible(on));
  toggle('lyPaths', (on) => fleet.setPathsVisible(on));
  toggle('lyLabels', (on) => { indicators.showLabels = on; });
  toggle('lyHD', (on) => views.setHiTier(on ? '8k' : '4k'));
  if (renderer.capabilities.maxTextureSize < 8192) $('lyHD').hidden = true;
  $('rideLeave').addEventListener('click', () => goBody('earth'));
}

// ------------------------------------------------------------------ walk mode (first person, crewed sites only)
const GRAVITY = { moon: 1.62, mars: 3.71 };   // m/s²
let pendingWalk = null;
// ------------------------------------------------------------------ rovers: stay with them, and drive their real routes
const follow = { eq: null, last: null, focused: false };
/** At the site of a rover that has a route, the camera stays with the rover, wherever it is on that date. */
function followRover() {
  const cur = site.current;
  if (rig.mode !== 'site' || !cur || !cur.route || rig.eq !== cur.eq || rig.flying || rig.photo) { if (rig.mode !== 'site') follow.eq = null; return; }
  const p = site.roverKm;
  if (follow.eq !== cur.eq) { follow.eq = cur.eq; follow.focused = false; follow.last = null; }
  if (!follow.focused) {
    rig.focusLocal(new THREE.Vector3(p.x, p.y + 0.0015, p.z), ((cur.eq.view && cur.eq.view.dist) || 9) / 1000 * 2.2);
    follow.focused = true; follow.last = p.clone(); return;
  }
  if (rig.tween) return;
  if (follow.last) { _siteP.copy(p).sub(follow.last); rig.controls.target.add(_siteP); camera.position.add(_siteP); }
  follow.last = follow.last ? follow.last.copy(p) : p.clone();
}
let drive = null;
function startDrive(eq) {
  if (rig.photo) { if (rig.photo.walk) setWalk(false); else setPhoto(false); }
  if (clock.ms < Date.parse(eq.arrival)) clock.jumpTo(Date.parse(eq.arrival) + 1000);
  drive = { eq, m: 0, playing: true, speed: 1 };
  $('drivebar').hidden = false; $('dvPlay').textContent = '⏸︎'; $('dvSpeed').textContent = '1×';
  if (!(rig.mode === 'site' && rig.eq === eq)) goSite(eq);
}
function stopDrive() { drive = null; site.driveM = null; $('drivebar').hidden = true; }
function paintDrive() {
  const r = site.routeNow; if (!r || !site.current || site.current.eq !== drive.eq) return;
  const d = new Date(r.sol0 + r.sol * r.solMs);
  const txt = `Sol ${Math.floor(r.sol)} · ${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]} ${d.getUTCFullYear()} · ${(r.m / 1000).toFixed(2)} of ${(r.total / 1000).toFixed(2)} km`;
  if (drive.txt !== txt) { drive.txt = txt; $('dvInfo').textContent = txt; }
  const v = Math.round(r.m / r.total * 1000);
  if (!drive.scrub && +$('dvSlider').value !== v) $('dvSlider').value = v;
  const pl = drive.playing ? '⏸︎' : '▶︎'; if ($('dvPlay').textContent !== pl) $('dvPlay').textContent = pl;
}
$('dvPlay').addEventListener('click', () => { if (!drive) return; const t = site.current && site.current.route ? site.current.route.def.total : 0; if (drive.m >= t) drive.m = 0; drive.playing = !drive.playing; });
$('dvSpeed').addEventListener('click', () => { if (!drive) return; drive.speed = drive.speed === 1 ? 3 : drive.speed === 3 ? 10 : drive.speed === 10 ? 0.3 : 1; $('dvSpeed').textContent = `${drive.speed}×`; });
$('dvSlider').addEventListener('input', (e) => { if (!drive || !site.current || !site.current.route) return; drive.scrub = true; drive.m = +e.target.value / 1000 * site.current.route.def.total; });
$('dvSlider').addEventListener('change', () => { if (drive) drive.scrub = false; });
$('dvStop').addEventListener('click', stopDrive);

/** Home: back to the starting view, the Earth, with the main panel. */
function goHome() {
  if (rig.photo) { if (rig.photo.walk) setWalk(false); else setPhoto(false); }
  planetLock = null;
  rig.flyToBody('earth');
  panel.showHome(clock.ms);
  setHash('earth');
}
function startWalk(eq) {
  if (clock.ms < Date.parse(eq.arrival)) return;
  if (rig.photo) setPhoto(false);
  if (rig.mode === 'site' && rig.eq === eq && !rig.flying) setWalk(true);
  else { pendingWalk = eq; goSite(eq); }
}
function setWalk(on) {
  if (on) { if (!rig.eq || !rig.enterWalk(GRAVITY[rig.eq.body] || 1.62)) return; }
  else rig.exitPhoto();
  const w = !!(rig.photo && rig.photo.walk);
  document.body.classList.toggle('photo', w);
  document.body.classList.remove('shot');
  $('walkbar').hidden = !w;
  if (w) { hideHint(); canvas.focus?.(); $('wkSpeed').textContent = '1× real speed'; }
}
{
  const KEYS = new Set(['w', 'a', 's', 'd', ' ', 'shift', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown']);
  const key = (e, down) => {
    const w = rig.photo && rig.photo.walk; if (!w) return;
    if (e.target.closest?.('input,textarea,select')) return;
    const k = e.key.toLowerCase(); if (!KEYS.has(k)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (down) w.keys.add(k); else w.keys.delete(k);
  };
  window.addEventListener('keydown', (e) => key(e, true), true);
  window.addEventListener('keyup', (e) => key(e, false), true);
  window.addEventListener('blur', () => { const w = rig.photo && rig.photo.walk; if (w) w.keys.clear(); });
  $('wkDone').addEventListener('click', () => setWalk(false));
  $('wkZoomIn').addEventListener('click', () => rig.photoZoom(1 / 1.25));
  $('wkZoomOut').addEventListener('click', () => rig.photoZoom(1.25));
  // Fast-forward while walking: the clock's speed buttons (and + / -) speed up the walk itself.
  const WALK_SPEEDS = [1, 2, 4, 8, 16];
  const walkSpeed = (step) => {
    const w = rig.photo && rig.photo.walk; if (!w) return false;
    const i = Math.max(0, Math.min(WALK_SPEEDS.length - 1, WALK_SPEEDS.indexOf(w.scale) + step));
    w.scale = WALK_SPEEDS[i];
    $('wkSpeed').textContent = w.scale === 1 ? '1× real speed' : `${w.scale}× fast-forward`;
    return true;
  };
  $('wkSlow').addEventListener('click', () => walkSpeed(-1));
  $('wkFast').addEventListener('click', () => walkSpeed(1));
  for (const [id, step] of [['slower', -1], ['faster', 1]]) {
    $(id).addEventListener('click', (e) => { if (walkSpeed(step)) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  }
  window.addEventListener('keydown', (e) => {
    if (!(rig.photo && rig.photo.walk) || e.target.closest?.('input,textarea,select')) return;
    if (e.key === 'z' || e.key === 'Z') rig.photoZoom(1 / 1.15);
    else if (e.key === 'x' || e.key === 'X') rig.photoZoom(1.15);
    else if (e.key === '+' || e.key === '=' || e.key === ']') walkSpeed(1);
    else if (e.key === '-' || e.key === '_' || e.key === '[') walkSpeed(-1);
  });
  $('wkEarth').addEventListener('click', () => { rig.photoAim('earth'); rig.camera.fov = Math.max(rig.camera.fov, 62); rig.camera.updateProjectionMatrix(); });
  rig.on('arrive', (dest) => { const q = pendingWalk; pendingWalk = null; if (q && dest.kind === 'site' && dest.eq === q) setTimeout(() => setWalk(true), 300); });
  rig.on('depart', () => { $('walkbar').hidden = true; document.body.classList.remove('photo'); });
}

// ------------------------------------------------------------------ photo mode (free look for screenshots)
function setPhoto(on) {
  if (on && !rig.enterPhoto()) return;
  if (!on) rig.exitPhoto();
  document.body.classList.toggle('photo', !!rig.photo);
  document.body.classList.remove('shot');
  $('photobar').hidden = !rig.photo;
  $('lyPhoto').setAttribute('aria-pressed', rig.photo ? 'true' : 'false');
  $('phStand').hidden = rig.mode !== 'site';
}
{
  const el = renderer.domElement;
  let drag = null;
  el.addEventListener('pointerdown', (e) => { if (!rig.photo) return; drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => { if (!rig.photo || !drag) return; rig.photoLook(e.clientX - drag.x, e.clientY - drag.y); drag.x = e.clientX; drag.y = e.clientY; });
  const end = () => { drag = null; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('wheel', (e) => {
    if (!rig.photo) return;
    e.preventDefault();
    // Walking: a two-finger swipe / scroll only turns the head. It never zooms, so the view cannot
    // seem to slide forward or back. Pinch (or Ctrl + scroll) and the Z / X keys zoom instead.
    if (rig.photo.walk && !e.ctrlKey) { rig.photoLook(e.deltaX * 0.6, e.deltaY * 0.6); return; }
    rig.photoZoom(e.deltaY > 0 ? 1.08 : 1 / 1.08);
  }, { passive: false });
  $('lyPhoto').addEventListener('click', () => { if (rig.photo && rig.photo.walk) setWalk(false); setPhoto(!rig.photo); });
  $('phDone').addEventListener('click', () => setPhoto(false));
  $('phStand').addEventListener('click', () => rig.photoStand());
  $('phEarth').addEventListener('click', () => rig.photoAim(rig.bodyId === 'earth' && rig.mode !== 'site' ? 'moon' : 'earth'));
  $('phSun').addEventListener('click', () => rig.photoAim('sun'));
  $('phHide').addEventListener('click', () => document.body.classList.add('shot'));
  // the H key, as buttons: "Hide UI" in the menu, and a small button to bring it back (a phone has no H key)
  $('lyHide').addEventListener('click', () => { document.body.classList.add('shot'); if (window.__menu) window.__menu(false); });
  { const back = document.createElement('button'); back.id = 'uiBack'; back.type = 'button'; back.textContent = 'Show UI'; back.title = 'Bring back the buttons (H)'; document.body.appendChild(back);
    back.addEventListener('click', () => document.body.classList.remove('shot')); }
  window.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input,textarea,select') || viewer.isOpen || museum.isOpen || anyFilm()) return;
    if (e.key === 'h' || e.key === 'H') document.body.classList.toggle('shot');   // works in every mode: hide everything but the view
  });
  window.addEventListener('dblclick', () => document.body.classList.remove('shot'));
  rig.on('depart', () => { if ($('lyPhoto').getAttribute('aria-pressed') === 'true') setPhoto(false); });
}
let rideKey = '';
function updateRide() {
  const b = eph[rig.bodyId], on = !!b.isProbe && rig.mode === 'orbit' && !rig.flying;
  $('ride').classList.toggle('on', on);
  if (!on) { rideKey = ''; return; }
  if (!b.active) { goBody(b.def.orbit ? b.def.orbit.body : 'earth'); return; }      // the probe is gone on this date
  let near = null, nd = Infinity;
  for (const w of eph.list) { if (w.id === 'sun') continue; const d = w.pos.distanceTo(b.pos) / w.radius; if (d < nd) { nd = d; near = w; } }
  const km = b.pos.length();
  const txt = `Riding ${b.def.name} · ${(km / 149597870.7).toFixed(km > 1.5e9 ? 1 : 2)} AU from the Sun${near && nd < 60 ? ` · ${Math.max(0, Math.round(near.pos.distanceTo(b.pos) - near.radius)).toLocaleString('en-US')} km above ${BODIES[near.id].name}` : ''}`;
  if (txt !== rideKey) { rideKey = txt; $('rideTxt').textContent = txt; }
}

const intro = $('intro'), hint = $('hint');
let hintTimer = 0;
function closeIntro(viaStart) {
  if (intro.classList.contains('gone')) return;
  wantFilm = viaStart === true;                       // only the Start button plays the opening film
  intro.classList.add('gone');
  if (!panel.view) panel.showHome(clock.ms);
  
  const after = () => {
    setTimeout(() => school.start(), 900);            // flight school opens by itself; ✕ closes it
    // fetch the sharp maps of the Moon and Mars while the visitor reads, so that flying there later never stalls
    const pre = (id, t) => setTimeout(() => { if (rig.flying || warping || anyFilm()) pre(id, 3000); else views.prefetchHi(id); }, t);
    pre('moon', 7000); pre('mars', 15000);
    hint.hidden = false; hint.style.opacity = '1';
    hintTimer = setTimeout(hideHint, 9000);
  };
  if (!openingSwing(after)) after();
}

function hideHint() { clearTimeout(hintTimer); hint.style.opacity = '0'; }
$('begin').addEventListener('click', () => closeIntro(true));

// The intro states the problem first: one line types itself out, the real counts from our data
// count up, then the answer and the Start button appear. A click or key press shows it all at once.
// playIntro() can run again: "Restart" (top left) brings the opening screen back.
let introFinish = () => {};
function playIntro(first) {
  const PROB = 'Most of the machines we sent into space never came home.';
  const N = { moon: EQUIPMENT.filter((q) => q.body === 'moon').length, mars: EQUIPMENT.filter((q) => q.body === 'mars').length, probes: PROBES.length };
  const type = intro.querySelector('.i-type'), nums = [...intro.querySelectorAll('.i-stats b')];
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  introFinish();                                           // stop a run that is still going
  let done = false, timers = [];
  type.textContent = ''; nums.forEach((b) => { b.textContent = '0'; }); intro.classList.remove('st1', 'st2');
  const finish = () => {
    if (done) return; done = true; timers.forEach(clearTimeout);
    type.textContent = PROB; nums.forEach((b) => { b.textContent = N[b.dataset.n]; });
    intro.classList.add('st1', 'st2');
  };
  introFinish = finish;
  const count = () => {
    intro.classList.add('st1');
    const t0 = performance.now();
    const step = (now) => {
      if (done) return;
      const k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      nums.forEach((b) => { b.textContent = Math.round(N[b.dataset.n] * e); });
      if (k < 1) requestAnimationFrame(step); else timers.push(setTimeout(finish, 350));
    };
    requestAnimationFrame(step);
  };
  const run = () => {
    if (done) return;
    if (calm) { finish(); return; }
    // typed by the clock, not per frame, so a slow computer still finishes in about two seconds
    const t0 = performance.now() + 350;
    const tick = (now) => {
      if (done) return;
      const i = Math.max(0, Math.min(PROB.length, Math.floor((now - t0) / 32)));
      if (type.textContent.length !== i) type.textContent = PROB.slice(0, i);
      if (i < PROB.length) requestAnimationFrame(tick); else timers.push(setTimeout(count, 380));
    };
    requestAnimationFrame(tick);
  };
  if (!first) { run(); return; }
  // start once the 3D view has drawn its first picture, so the line is not typed behind the loading screen
  const t0 = performance.now();
  const wait = () => { if (window.__frames > 0 || performance.now() - t0 > 8000) run(); else requestAnimationFrame(wait); };
  requestAnimationFrame(wait);
}
intro.addEventListener('pointerdown', (e) => { if (!e.target.closest('#begin')) introFinish(); });
window.addEventListener('keydown', () => { if (!intro.classList.contains('gone')) introFinish(); });
playIntro(true);

/** Restart: back to the very first screen. The Earth turns in front of plain stars again, and Start plays the opening once more. */
function reopenIntro() {
  if (viewer.isOpen || museum.isOpen || anyFilm() || news.isOpen) return;
  if (rig.photo) { if (rig.photo.walk) setWalk(false); else setPhoto(false); }
  if (school.active()) school.quit();
  hideHint(); hint.hidden = true; planetLock = null;
  document.body.classList.remove('shot', 'opening', 'ui-in');
  rig.resetView('earth', NGP_DIR, 3.15);
  panel.showHome(clock.ms); setHash('earth');
  intro.classList.remove('gone'); playIntro(false);
}
$('goIntro').addEventListener('click', reopenIntro);

// ------------------------------------------------------------------ calm background music
const ambient = new Ambient();
let musicWanted = true;
try { musicWanted = localStorage.getItem('anf-music') !== 'off'; } catch (e) { /* storage may be blocked */ }
$('lyMusic').setAttribute('aria-pressed', musicWanted ? 'true' : 'false');
$('lyMusic').addEventListener('click', () => {
  musicWanted = !musicWanted;
  if (musicWanted) ambient.start(); else ambient.stop();
  $('lyMusic').setAttribute('aria-pressed', musicWanted ? 'true' : 'false');
  try { localStorage.setItem('anf-music', musicWanted ? 'on' : 'off'); } catch (e) { /* ignore */ }
});
// browsers only allow sound after a click or key press, so start on the first one
const FIRST = ['pointerdown', 'keydown', 'click'];
const firstTouch = () => { if (musicWanted) ambient.start(); for (const t of FIRST) window.removeEventListener(t, firstTouch, true); };
for (const t of FIRST) window.addEventListener(t, firstTouch, true);
document.addEventListener('visibilitychange', () => { if (!ambient.ctx) return; if (document.hidden) ambient.ctx.suspend(); else if (ambient.on) ambient.ctx.resume(); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.querySelector('.wheel')) {
    if (document.body.classList.contains('shot')) { document.body.classList.remove('shot'); return; }
    if (rig.photo && rig.photo.walk) { setWalk(false); return; }
    if (rig.photo) { setPhoto(false); return; }
    if (rig.mode === 'site' && rig.eq) goBody(rig.eq.body);
    else if (panel.open) panel.hide();
  }
});

// ------------------------------------------------------------------ main loop
let viewShift = -1;
function resize() {
  const W = window.innerWidth, H = window.innerHeight;
  pixelRatio = sharpRatio(W, H);                       // zooming the page fires a resize too
  renderer.setPixelRatio(pixelRatio);
  if (views && views.stars) views.stars.material.uniforms.uPixelRatio.value = pixelRatio;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  viewShift = -1;
  applyViewShift();
}
// When the side panel is open, shift the projection centre so the subject sits in the
// middle of the free part of the screen instead of under the panel.
// The shift glides rather than jumps (after a resize it is set at once).
let shiftX = 0, shiftY = 0, shiftT = 0;
function applyViewShift() {
  const W = window.innerWidth, H = window.innerHeight;
  // desktop: panel on the right, shift left; phone: panel at the bottom, shift up
  const tx = panel.open && W > 760 ? 180 : 0;
  const ty = panel.open && W <= 760 ? Math.round(H * 0.24) : 0;
  const now = performance.now(), dt = Math.min(0.1, (now - (shiftT || now)) / 1000); shiftT = now;
  const k = viewShift === -1 ? 1 : 1 - Math.exp(-dt * 3.2);
  shiftX += (tx - shiftX) * k; shiftY += (ty - shiftY) * k;
  if (Math.abs(tx - shiftX) < 0.25) shiftX = tx;
  if (Math.abs(ty - shiftY) < 0.25) shiftY = ty;
  const want = Math.round(shiftX * 4) * 100000 + Math.round(shiftY * 4);
  if (want === viewShift) return;
  viewShift = want;
  if (shiftX || shiftY) camera.setViewOffset(W, H, shiftX, shiftY, W, H); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let last = performance.now(), uiT = 0, panelT = 0, frames = 0;
// Adaptive resolution: if the last second averaged under 32 fps, render fewer pixels (never during a flight).
let fpsT = 0, fpsN = 0, slowRuns = 0;
// Shadows look the same whether the shadow map is redrawn every frame or only when something
// that casts or lights has changed. Moving the camera changes neither, so most frames skip it.
const _shDir = new THREE.Vector3(), _shNow = new THREE.Vector3();
let shOn = false, shEq = null, shHalf = 0, shT = 0, shMs = 0;
function shadowTick(dt) {
  const L = views.sunLight;
  if (!L.castShadow) { shOn = false; return; }
  _shNow.copy(L.position).sub(L.target.position).normalize();
  const eq = site.current ? site.current.eq : null, half = L.shadow.camera.right;
  shT += dt;
  if (!shOn || scenes.playing || eq !== shEq || half !== shHalf || shT > 0.25
      || Math.abs(clock.ms - shMs) > 3.6e6 || _shNow.angleTo(_shDir) > 2e-4) {
    renderer.shadowMap.needsUpdate = true;
    shOn = true; shEq = eq; shHalf = half; shT = 0; shMs = clock.ms; _shDir.copy(_shNow);
  }
}
function adaptResolution(dt) {
  fpsT += dt; fpsN++;
  if (fpsT < 1) return;
  const fps = fpsN / fpsT; fpsT = 0; fpsN = 0;
  if (document.hidden || !texturesReady) return;
  // Slow frames: give the picture a little fewer real pixels, one step at a time, never below
  // about half the budget. This is counted in real screen pixels, so browser zoom cannot make
  // it blurry the way the old fixed ratio did.
  slowRuns = fps < 30 ? slowRuns + 1 : 0;
  if (slowRuns >= 3 && budgetScale > 0.52) {
    slowRuns = 0;
    budgetScale = Math.max(0.5, budgetScale * 0.8);
    resize();
  }
}
// on a touch screen: a thumb joystick wherever a keyboard would walk (the exhibition, and walking at a landing site)
const joy = setupJoystick();
function joyFor() {
  if (museum.isOpen && !viewer.isOpen) joy.attach(museum.keys, { canJump: true });
  else if (rig.photo && rig.photo.walk && !viewer.isOpen && !museum.isOpen) joy.attach(rig.photo.walk.keys, { canJump: true });
  else joy.attach(null);
}
const _siteP = new THREE.Vector3();
const SEC = (n) => perf.sec(n);
function frame(now) {
  requestAnimationFrame(frame);
  joyFor();
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  // A film, a featured animation, the exhibition or the 3D viewer has the whole screen: the Solar System behind it
  // is neither drawn nor updated (its labels, orbits, panel and timeline wait), only the clock keeps its time.
  if (perf.on) perf.doing(showcase.isOpen ? `${showcase.def.id}${showcase.ready ? '' : ' loading'}` : film.isOpen ? `apollo film${film.ready ? '' : ' loading'}` : viewer.isOpen ? '3D view' : museum.isOpen ? 'exhibition' : anyFilm() ? 'film' : warping ? 'time travel' : rig.flying ? 'flying' : 'main');
  if (viewer.isOpen || museum.isOpen || anyFilm()) {
    fpsT = 0; fpsN = 0; slowRuns = 0;                      // and its speed is not judged by what someone else draws
    clock.tick(dt); updateSpin(dt);
    window.__frames = ++frames; return;
  }
  adaptResolution(dt);
  perf.frame(dt, renderer, 'main view');
  const tJ = performance.now(); perf.secStart(tJ);
  clock.tick(dt);
  updateSpin(dt);
  eph.update(clock.ms); SEC('time');
  applyPlanetLock();
  rig.update(dt);
  applyViewShift(); SEC('camera');
  views.update(eph, rig, camera, rig.bodyId); SEC('planets');
  let siteDist = Infinity;
  if (site.current) {
    const q = site.current.eq;
    eph[q.body].surfacePoint(q.lat, q.lon, 0.001, _siteP);
    siteDist = rig.camWorld.distanceTo(_siteP);
  }
  if (drive) {
    if (rig.mode === 'site' && rig.eq === drive.eq && site.current && site.current.route) {
      const total = site.current.route.def.total;
      if (drive.playing && !rig.flying) drive.m = Math.min(total, drive.m + dt * total / 80 * drive.speed);
      if (drive.m >= total) drive.playing = false;
      site.driveM = drive.m;
    } else if (!rig.flying && rig.eq !== drive.eq) stopDrive();
  }
  site.update(siteDist, clock.ms); SEC('site');
  followRover();
  if (drive) paintDrive();
  scenes.update(dt, now / 1000, clock.ms); SEC('scenes');
  if (scenes.cam && rig.mode === 'site' && !rig.flying) rig.setLook(scenes.cam.pos, scenes.cam.look);
  if (!scenes.playing) site.applyRoute();
  fleet.update(rig, clock.ms); SEC('probes');
  orbits.update(rig); SEC('orbits');
  updateSiteLighting();
  shadowTick(dt); SEC('light');
  const W = window.innerWidth, H = window.innerHeight;
  if (!indicators.hiddenForPerf) indicators.update(camera, rig, eph, clock.ms, W, H); SEC('labels');
  uiT += dt; panelT += dt;
  if (uiT > 0.05) { uiT = 0; clockUI.update({ timelapse, flying: rig.flying }); SEC('clock ui'); timeline.update(clock.ms); eventList.update(clock.ms); SEC('timeline'); }
  if (panelT > 0.3) { panelT = 0; panel.refresh(clock.ms, eph); SEC('panel'); updateRide(); SEC('ride'); }
  updateKscPin(); SEC('pin');
  const tD = performance.now();
  perf.gpuBegin(renderer);
  if (!viewer.isOpen && !museum.isOpen && !anyFilm()) renderer.render(scene, camera);     // the object viewer has the screen: no need to draw behind it
  perf.gpuEnd(renderer); SEC('render');
  perf.cpu(tD - tJ, performance.now() - tD);
  window.__frames = ++frames;
  if (frames === 3 && texturesReady) window.__done = true;
  if (frames > 3 && texturesReady && !window.__done) window.__done = true;
}
requestAnimationFrame(frame);

// Handy for debugging in the console and for automated screenshots.
window.__app = { opening, showcase, openShowcase, openFeatured, echo, openEcho, scenes, timeWarp, school, guide, news, films, openFilm, startDrive, film, museum, openMuseum, ambient, setPhoto, setWalk, startWalk, viewer, viewObject, THREE, clock, eph, rig, views, site, panel, goSite, goBody, eqById, closeIntro, renderer, scene, camera, fleet, orbits, scenes, watchScene, flyPast, goProbe, probeById };
