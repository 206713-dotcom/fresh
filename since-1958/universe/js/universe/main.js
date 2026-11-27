// Since 1958 · Beyond: the galaxies. Start-up, navigation and the frame loop.
import * as THREE from '../three.js';
import { Engine } from '../core/engine.js';
import { OrbitRig } from '../core/camera.js';
import { TextureStore } from '../core/textures.js';
import { createSky } from '../shaders/sky.js';
import { eqToScene } from '../solar/ephemeris.js';
import { loadCatalogue, methodName, MPC_LY, KPC_LY } from './catalogue.js';
import { createField, createRings } from './field.js';
import { createGalaxyModel } from './galaxy.js';
import { createSupernova, createMerger } from './events.js';
import { supernovaMagnitude, sunsFromMagnitude, SN, MERGER } from './physics.js';

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = $('view');
const nextFrame = () => new Promise(r => requestAnimationFrame(r));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const smoother = t => t * t * t * (t * (t * 6 - 15) + 10);
const nf = (x, d = 0) => x.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
const sig = (x, n = 2) => Number(x.toPrecision(n));
const sci = x => { const [m, e] = x.toExponential(2).split('e'); return `${m} × 10<sup>${+e}</sup>`; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const RINGS = [1, 5, 10, 20, 30];                       // Mpc
const OVERVIEW = 84;                                    // camera distance that frames 30 Mpc
const MODEL_POINTS = { low: 26000, medium: 52000, high: 96000, ultra: 150000 };
const MODEL_GAIN = 0.055;                               // brightness of one point in a 96,000-point galaxy
const MYR_PER_SECOND = 2.2;                             // how fast a visited galaxy turns
const H0 = 70;                                          // km/s per Mpc, the value used in exam questions

// Galaxies that get a name on the map, most important first.
const NAMED = ['Milky Way', 'M31', 'M87', 'NGC 5128', 'M81', 'M33', 'LMC', 'M101', 'M51', 'M104', 'NGC 1316', 'NGC 253', 'M83',
  'M106', 'IC 342', 'M94', 'M74', 'M77', 'M66', 'M96', 'M63', 'M64', 'SMC', 'NGC 4038', 'M82', 'NGC 1365', 'NGC 6822', 'M49', 'M60', 'M100'];
const DOCK = ['Milky Way', 'LMC', 'M31', 'M33', 'M81', 'NGC 5128', 'M101', 'M51', 'M104', 'M87', 'NGC 1316'];
const SHORT = { 'Milky Way': 'Milky Way', LMC: 'LMC', M31: 'Andromeda', M33: 'Triangulum', M81: 'M81', 'NGC 5128': 'Cen A', M101: 'Pinwheel',
  M51: 'Whirlpool', M104: 'Sombrero', M87: 'M87', 'NGC 1316': 'Fornax A' };
const GROUPS = [['M87', 'Virgo Cluster'], ['NGC 1399', 'Fornax Cluster'], ['NGC 3992', 'Ursa Major Cluster']];

const state = { limit: 30, guides: true, stage: 'map', event: null };

boot().catch(err => {
  console.error('[Since 1958 · Beyond]', err);
  $('intro')?.remove();
  $('fallback').hidden = false;
});

async function boot() {
  const intro = (f, text) => { $('intro-bar').style.transform = `scaleX(${f})`; if (text) $('intro-status').textContent = text; };
  const engine = new Engine(canvas);
  const { scene, camera, renderer } = engine;
  const gl = renderer.getContext();
  const maxPoint = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
  intro(0.15);
  await nextFrame();

  const rig = new OrbitRig(camera, canvas);
  rig.drift = !reducedMotion;
  rig.az = 0.9; rig.pol = 1.02;
  rig.dist = rig.targetDist = OVERVIEW * 2.6;
  rig.minDist = 0.02; rig.maxDist = 260;

  // ------------------------------------------------------------ the map ----
  const cat = await loadCatalogue();
  const galaxies = cat.list;
  intro(0.55, 'Growing the Milky Way…');
  const mapRoot = new THREE.Group();
  scene.add(mapRoot);
  const field = createField(galaxies, maxPoint);
  mapRoot.add(field.points);
  const rings = createRings(RINGS);
  mapRoot.add(rings.group);
  const modelRoot = new THREE.Group();
  mapRoot.add(modelRoot);
  const supernova = createSupernova();
  mapRoot.add(supernova.mesh);
  await nextFrame();

  // ----------------------------------------------------------- navigation ----
  // The scene is always centred on "origin"; flights move the origin.
  const nav = { focus: null, origin: new THREE.Vector3(), from: new THREE.Vector3(), to: new THREE.Vector3(), t: 1, duration: 1, d0: 1, d1: 1, dMid: 1 };
  const fit = () => Math.max(1, 1.25 / camera.aspect);
  const framing = g => Math.max(g.radius * 3.1, 0.003) * fit();
  let model = null, modelTime = 0;

  function ensureModel(g) {
    if (model && model.galaxy === g) return;
    if (model) { modelRoot.remove(model.points); model.dispose(); model = null; }
    if (!g) return;
    model = createGalaxyModel(g, MODEL_POINTS[engine.tierName] ?? 52000);
    modelRoot.add(model.points);
  }
  function flyTo(g, { instant = false } = {}) {
    if (state.stage !== 'map') return;
    if (state.event === 'supernova' && g !== nav.focus) closeEvent();
    nav.from.copy(nav.origin);
    nav.to.set(...(g ? g.pos : [0, 0, 0]));
    nav.focus = g;
    nav.d0 = rig.dist;
    nav.d1 = g ? framing(g) : OVERVIEW * fit();
    nav.dMid = Math.max(nav.d0, nav.d1, nav.from.distanceTo(nav.to) * 0.9);
    const span = Math.log10(Math.max(nav.dMid / Math.min(nav.d0, nav.d1), 1));
    nav.duration = reducedMotion || instant ? 0.01 : clamp(1.6 + 0.5 * span, 1.6, 4.4);
    nav.t = 0;
    rig.locked = true;
    rig.vAz = rig.vPol = 0;
    ensureModel(g);
    showPanel(g);
    setActive(g);
    history.replaceState(null, '', g ? '#' + encodeURIComponent(g.name.replace(/ /g, '_')) : '#map');
  }
  function updateNav(dt) {
    if (nav.t < 1) {
      nav.t = Math.min(1, nav.t + dt / nav.duration);
      const e = smoother(nav.t);
      const l0 = Math.log(nav.d0), lm = Math.log(nav.dMid), l1 = Math.log(nav.d1);
      rig.dist = rig.targetDist = Math.exp((1 - e) * (1 - 2 * e) * l0 + 4 * e * (1 - e) * lm + e * (2 * e - 1) * l1);
      const g = smoother(clamp((nav.t - 0.08) / 0.84, 0, 1));
      nav.origin.lerpVectors(nav.from, nav.to, g);
      if (nav.t >= 1) rig.locked = false;
    }
    rig.minDist = nav.focus ? nav.focus.radius * 0.55 : 0.05;
  }

  // -------------------------------------------------------------- labels ----
  const labelLayer = $('labels');
  const makeLabel = (text, colour, onClick, cls = '') => {
    const e = document.createElement(onClick ? 'button' : 'span');
    if (onClick) { e.type = 'button'; e.tabIndex = -1; e.addEventListener('click', onClick); }
    e.className = `label is-off ${cls}`;
    e.style.setProperty('--c', colour);
    e.innerHTML = `<i></i><span>${esc(text)}</span>`;
    labelLayer.append(e);
    return e;
  };
  const labels = [];
  NAMED.forEach((name, rank) => {
    const g = cat.byName.get(name);
    if (!g) return;
    const text = g.home ? 'Milky Way' : g.common && g.common.length < 22 ? g.common : g.name;
    labels.push({ g, rank, el: makeLabel(text, g.home ? '#d9ab45' : '#d3e2ee', () => flyTo(g)), on: false });
  });
  GROUPS.forEach(([name, text]) => {
    const g = cat.byName.get(name);
    if (g) labels.push({ g, rank: -1, group: true, el: makeLabel(text, '#92bfe3', null, 'label-group'), on: false });
  });
  const ringLabels = RINGS.map(r => ({ r, el: makeLabel(`${r} Mpc · ${nf(sig(r * MPC_LY / 1e6, 2), r < 5 ? 1 : 0)} million ly`, '#9aa69f', null, 'label-ring') }));
  const focusLabel = { el: makeLabel('', '#d9ab45', null, 'label-focus') };
  labels.sort((a, b) => a.rank - b.rank);

  const proj = new THREE.Vector3();
  const toScreen = p => {
    proj.set(p[0] - nav.origin.x, p[1] - nav.origin.y, p[2] - nav.origin.z).project(camera);
    return proj.z < 1 ? [(proj.x * 0.5 + 0.5) * engine.width, (0.5 - proj.y * 0.5) * engine.height] : null;
  };
  function updateLabels() {
    const show = state.guides && state.stage === 'map';
    labelLayer.style.opacity = show ? 1 : 0;
    if (!show) return;
    const taken = [];
    const place = (l, xy, text = true) => {
      const ok = xy && xy[0] > -40 && xy[0] < engine.width + 40 && xy[1] > 60 && xy[1] < engine.height - 20;
      let on = !!ok;
      if (on && text) {
        const box = [xy[0] - 12, xy[1] - 11, xy[0] + (l.el.offsetWidth || 90), xy[1] + 11];
        if (taken.some(b => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) on = false;
        else taken.push(box);
      }
      if (on) l.el.style.transform = `translate(${xy[0].toFixed(1)}px, ${xy[1].toFixed(1)}px)`;
      if (on !== l.on) { l.on = on; l.el.classList.toggle('is-off', !on); }
    };
    // The galaxy being visited always keeps its name.
    if (nav.focus) {
      const g = nav.focus;
      const xy = toScreen(g.pos);
      const app = g.radius / Math.max(rig.dist, 1e-6) * engine.height / (2 * Math.tan(camera.fov * Math.PI / 360));
      if (focusLabel.g !== g) { focusLabel.g = g; focusLabel.el.lastChild.textContent = g.common && !g.home ? `${g.name} · ${g.common}` : g.name; }
      place(focusLabel, xy && app < 160 ? [xy[0], xy[1]] : null);
    } else place(focusLabel, null);
    for (const l of labels) {
      const hidden = l.g === nav.focus || l.g.dist > state.limit + 0.3;
      // Names only appear once a galaxy is close enough to matter at this zoom.
      const far = Math.hypot(l.g.pos[0] - nav.origin.x, l.g.pos[1] - nav.origin.y, l.g.pos[2] - nav.origin.z) > rig.dist * 1.1 + 1;
      place(l, hidden || (far && l.rank > 12) ? null : toScreen(l.g.pos));
    }
    ringLabels.forEach(l => {
      const a = rig.az + 0.55;                                   // keep the ring names on the near side
      place(l, l.r > state.limit + 0.3 || l.r < rig.dist * 0.04 || l.r > rig.dist * 1.5 ? null : toScreen([Math.cos(a) * l.r, 0, Math.sin(a) * l.r]));
    });
  }

  // -------------------------------------------------------------- picking ----
  function pick(x, y, reach) {
    let best = null, bestScore = Infinity;
    const pxPerRad = engine.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    for (const g of galaxies) {
      if (g.dist > state.limit + 0.3) continue;
      const xy = toScreen(g.pos);
      if (!xy) continue;
      const d = Math.hypot(xy[0] - x, xy[1] - y);
      const camDist = Math.hypot(g.pos[0] - nav.origin.x - camera.position.x, g.pos[1] - nav.origin.y - camera.position.y, g.pos[2] - nav.origin.z - camera.position.z);
      const size = Math.max(reach, g.radius / camDist * pxPerRad);
      if (d > size) continue;
      const score = d / size - 0.04 * Math.log10(g.lum + 1e-6);    // brighter galaxies win a tie
      if (score < bestScore) { bestScore = score; best = g; }
    }
    return best;
  }
  rig.onTap = (x, y) => {
    if (state.stage !== 'map') return;
    const g = pick(x, y, matchMedia('(pointer: coarse)').matches ? 26 : 16);
    if (g && g !== nav.focus) flyTo(g);
  };
  const tip = $('hover-tip');
  let hoverAt = null;
  canvas.addEventListener('pointermove', e => { hoverAt = e.pointerType === 'mouse' ? [e.clientX, e.clientY] : null; });
  canvas.addEventListener('pointerleave', () => { hoverAt = null; });
  function updateHover() {
    const g = hoverAt && state.stage === 'map' && !rig.dragging() && nav.t >= 1 ? pick(hoverAt[0], hoverAt[1], 14) : null;
    const show = g && g !== nav.focus;
    canvas.style.cursor = show ? 'pointer' : '';
    tip.hidden = !show;
    if (show) {
      tip.textContent = `${g.common && !g.home ? g.common : g.name} · ${g.home ? 'home' : nf(g.dist, g.dist < 10 ? 2 : 1) + ' Mpc'}`;
      tip.style.transform = `translate(${hoverAt[0] + 14}px, ${hoverAt[1] + 16}px)`;
    }
  }

  // ---------------------------------------------------------------- panel ----
  const row = (k, v, small = '') => `<div><dt>${k}</dt><dd>${v}${small ? `<small>${small}</small>` : ''}</dd></div>`;
  const live = (k, v, small = '') => `<div class="live-item"><span>${k}</span><b>${v}</b><small>${small}</small></div>`;
  const li = (tag, text) => `<li><b>${tag}</b>${text}</li>`;
  const REAL = [
    li('Real', 'Every galaxy’s position, distance, size, tilt, type and brightness come from published catalogues.'),
    li('Grown here', 'The stars inside a galaxy are not real stars. Each point stands for millions of them, placed by Brownian motion along the arms, so nothing has to be downloaded and the site stays light.'),
    li('Enlarged', 'On the wide map galaxies are drawn larger than life. At true size all of them would be smaller than one pixel.'),
  ].join('');
  function showPanel(g) {
    $('p-real').innerHTML = REAL;
    if (!g) {
      const within = galaxies.filter(x => x.dist <= state.limit).length;
      $('p-kicker').textContent = 'Out to 30 megaparsecs';
      $('p-name').textContent = 'The Local Universe';
      $('p-tagline').textContent = 'Every galaxy with a measured distance within about 98 million light-years of Earth. The flat ring pattern is the supergalactic plane; the dense knot is the Virgo Cluster.';
      $('p-live').innerHTML = live('Galaxies shown', nf(within), `within ${state.limit} Mpc`) + live('Edge of the map', '30 Mpc', '98 million light-years') + live('Light from the edge', '98 million yr', 'on its way to us');
      $('p-facts').innerHTML = row('Local Volume catalogue', nf(cat.meta.local_volume), 'Karachentsev et al., mostly within 11 Mpc')
        + row('Cosmicflows-3', nf(cat.meta.count - cat.meta.local_volume), 'measured distances, out to 30 Mpc')
        + row('1 megaparsec', '3.26 million light-years', '3.09 × 10²² m')
        + row('Nearest big cluster', 'Virgo, 16.5 Mpc', 'about 1,300 galaxies');
      $('p-exam').innerHTML = li('The idea', 'A galaxy is a group of billions of stars. The Milky Way is one of many billions of galaxies in the Universe.')
        + li('The idea', 'A light-year is the distance light travels in one year, about 9.5 × 10¹⁵ m. Distances between galaxies are millions of light-years.')
        + li('Hubble', 'The Hubble Space Telescope, which you can visit in Since 1958, measured Cepheid stars in galaxies tens of millions of light-years away. Those stars pin down distances like the ones on this map.')
        + li('Going further', 'Hubble’s law: a galaxy’s speed of recession is proportional to its distance, v = H₀d. Close to home it is blurred by galaxies’ own motions.');
      $('p-work').innerHTML = work('How long does light take to cross this map?', 'time = distance ÷ speed', '30 Mpc = 30 × 3.26 million ly', '≈ 98 million years');
      return;
    }
    const ly = g.dist * MPC_LY;
    const lum = Math.pow(10, -0.4 * (g.M - 5.48));          // Suns, in blue light (the Sun's absolute B magnitude is 5.48)
    const v = H0 * g.dist;
    $('p-kicker').textContent = g.home ? 'Barred spiral galaxy · you are here' : `${g.cls.label}${g.type ? ' · ' + g.type : ''}`;
    $('p-name').textContent = g.name;
    $('p-tagline').textContent = g.home
      ? 'Our own galaxy. The Sun is 8.2 kiloparsecs from the centre and takes about 230 million years to go round once.'
      : `${g.common ? g.common + '. ' : ''}${g.src === 0 ? 'A neighbour in the Local Volume' : 'Beyond the Local Volume'}, ${nf(sig(ly / 1e6, 3), ly < 1e7 ? 2 : 1)} million light-years away.`;
    $('p-live').innerHTML = g.home
      ? live('Diameter', '32 kpc', '≈ 105,000 light-years') + live('Stars', '100–400 billion', 'estimate') + live('Sun’s orbit', '230 million yr', 'at 220 km/s')
      : live('Distance', `${nf(g.dist, g.dist < 10 ? 2 : 1)} Mpc`, `${nf(sig(ly / 1e6, 3), ly < 1e7 ? 2 : 1)} million ly`)
        + live('Light left it', `${nf(sig(ly / 1e6, 3), ly < 1e7 ? 2 : 1)} million years ago`, ly < 3e5 ? 'in the Stone Age' : ly < 6.6e7 ? 'after the dinosaurs died out' : 'when dinosaurs lived')
        + live('Diameter', `${nf(g.diam, g.diam < 10 ? 1 : 0)} kpc`, `${nf(sig(g.diam * KPC_LY, 2))} ly${g.measured === false ? ' (assumed)' : ''}`);
    $('p-facts').innerHTML = (g.home ? '' : row('Distance', `${nf(g.dist, 2)} Mpc`, `${sci(g.dist * 3.0857e22)} m`))
      + (g.home ? '' : row('Measured by', methodName(g.method)))
      + row('Type', g.type || g.cls.label, g.T !== null && g.T !== undefined ? `Hubble stage T = ${g.T}` : '')
      + row('Absolute magnitude', `${nf(g.M, 1)}`, 'in blue light')
      + row('Luminosity', `${sig(lum, 2) >= 1e9 ? nf(sig(lum / 1e9, 2), lum < 1e10 ? 1 : 0) + ' billion' : nf(sig(lum / 1e6, 2), lum < 1e7 ? 1 : 0) + ' million'} Suns`)
      + (g.home ? '' : row('Sky position', `RA ${nf(g.ra / 15, 2)} h, Dec ${g.dec >= 0 ? '+' : '−'}${nf(Math.abs(g.dec), 1)}°`));
    $('p-exam').innerHTML = li('The idea', 'Light from this galaxy left it long ago. We see it as it was, not as it is now.')
      + li('Going further', 'A standard candle is an object of known luminosity. Comparing that with how bright it looks gives the distance: this is how Cepheids and Type Ia supernovae measure galaxies.')
      + li('Going further', `Hubble’s law would predict v = H₀d ≈ ${nf(sig(v, 2))} km/s for this distance.${g.dist < 3 ? ' So near, gravity inside the Local Group wins and it does not apply.' : ''}`);
    $('p-work').innerHTML = g.home
      ? work('How fast does the Sun orbit the galaxy?', 'v = 2πr ÷ T', 'r = 8.2 kpc = 2.53 × 10²⁰ m, T = 230 million years = 7.26 × 10¹⁵ s', '≈ 220 km/s')
      : work('How bright does it look from Earth?', 'm − M = 5 log₁₀(d ÷ 10 pc)', `M = ${nf(g.M, 1)}, d = ${nf(g.dist, 2)} Mpc`, `m ≈ ${nf(g.M + 5 * Math.log10(g.dist * 1e5), 1)}`);
  }
  const work = (q, rule, sub, ans) => `<div class="work"><p class="work-top">${q}</p><p class="eq">${rule}</p><p class="line">${sub}</p><p class="answer">${ans}</p></div>`;

  // ---------------------------------------------------------------- dock ----
  const dock = $('dock');
  const dockItems = [];
  const addDock = (g, name, colour) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dock-item' + (g ? '' : ' dock-system');
    b.innerHTML = `<i style="--c:${colour}" class="${g ? 'gal-' + g.cls.key : ''}"></i><span>${esc(name)}</span>`;
    b.addEventListener('click', () => flyTo(g));
    dock.append(b);
    dockItems.push({ g, b });
  };
  addDock(null, 'Map', '#d3e2ee');
  for (const name of DOCK) {
    const g = cat.byName.get(name);
    if (g) addDock(g, SHORT[name] || name, g.cls.key === 'ell' || g.cls.key === 's0' ? '#f2c48f' : '#bcd0ff');
  }
  function setActive(g) { for (const d of dockItems) d.b.classList.toggle('is-active', d.g === g); }

  // --------------------------------------------------------------- tools ----
  const panel = $('panel');
  const sheet = matchMedia('(max-width: 820px)');
  const layout = () => {
    const open = !panel.classList.contains('is-hidden');
    rig.shiftTargetX = sheet.matches ? 0 : open ? 190 : state.event ? -170 : 0;
    rig.shiftTargetY = open && sheet.matches ? engine.height * 0.16 : state.event && sheet.matches ? engine.height * 0.12 : 0;
  };
  const togglePanel = (open = panel.classList.contains('is-hidden')) => {
    panel.classList.toggle('is-hidden', !open);
    $('btn-panel').setAttribute('aria-pressed', String(open));
    layout();
  };
  $('btn-panel').addEventListener('click', () => togglePanel());
  $('panel-close').addEventListener('click', () => togglePanel(false));
  sheet.addEventListener('change', layout);
  const setGuides = v => { state.guides = v; $('btn-guides').setAttribute('aria-pressed', String(v)); };
  $('btn-guides').addEventListener('click', () => setGuides(!state.guides));
  const quality = $('quality');
  quality.value = engine.mode;
  quality.addEventListener('change', () => engine.setMode(quality.value));
  engine.onQualityChange(() => { if (nav.focus) { const g = nav.focus; if (model) { modelRoot.remove(model.points); model.dispose(); model = null; } ensureModel(g); } });
  const full = $('btn-full');
  if (!document.documentElement.requestFullscreen) full.hidden = true;
  full.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); });

  // How far out to show.
  const range = $('r-range');
  const setLimit = v => {
    state.limit = v;
    const n = galaxies.filter(g => g.dist <= v).length;
    $('r-count').textContent = `${nf(n)} galaxies`;
    $('r-sub').textContent = `${nf(sig(v * MPC_LY / 1e6, 2), v < 5 ? 1 : 0)} million ly`;
    $('r-label').textContent = `Out to ${v} Mpc`;
    if (!nav.focus) showPanel(null);
  };
  range.addEventListener('input', () => setLimit(+range.value));
  setLimit(30);

  // The controls fade out when nothing is touched, as on the Solar System page.
  let idleTimer = 0;
  const wake = () => {
    document.body.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (panel.classList.contains('is-hidden') && !state.event) document.body.classList.add('is-idle'); }, 7000);
  };
  for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']) addEventListener(type, wake, { passive: true });
  wake();

  // --------------------------------------------------------------- events ----
  const eventCard = $('event'), plot = $('e-plot'), pg = plot.getContext('2d');
  let merger = null, savedView = null, eventDone = false;
  const setEventText = (kicker, title, note, caption) => { $('e-kicker').textContent = kicker; $('e-title').textContent = title; $('e-note').textContent = note; $('e-caption').textContent = caption; };
  function openEvent(kind) {
    state.event = kind;
    eventDone = false;
    eventCard.hidden = false;
    document.body.classList.add('has-event');
    document.body.classList.toggle('is-merger', kind === 'merger');
    togglePanel(false);
    wake();
    layout();
  }
  function closeEvent() {
    if (!state.event) return;
    if (state.event === 'merger') leaveMerger();
    supernova.stop();
    state.event = null;
    eventCard.hidden = true;
    document.body.classList.remove('has-event', 'is-merger');
    layout();
  }
  $('event-close').addEventListener('click', closeEvent);
  $('event-done').addEventListener('click', closeEvent);
  $('event-replay').addEventListener('click', () => { eventDone = false; if (state.event === 'merger') merger.start(); else supernova.start(); });

  // ---- supernova
  const snSpot = new THREE.Vector3();
  let snHost = null, snPending = false;
  function startSupernova() {
    if (state.stage !== 'map') closeEvent();
    // It needs a galaxy big enough to see: the one being visited, or the Pinwheel (which had a real one in 2011).
    let host = nav.focus;
    if (!host) host = cat.byName.get('M101') || cat.byName.get('M31');
    if (host !== nav.focus) flyTo(host);
    snHost = host;
    snPending = true;
    openEvent('supernova');
    setEventText('Type Ia supernova', `A white dwarf explodes in ${host.common && !host.home ? host.common.replace(/ Galaxy$/, '') : host.name}`,
      'A white dwarf star pulls gas from a companion until it nears 1.4 solar masses, then burns up in a runaway nuclear explosion. Every one peaks at almost the same brightness, which makes them standard candles.',
      'Typical Type Ia light curve: absolute magnitude against days from maximum. The glow comes from radioactive nickel-56 decaying to cobalt-56 and then iron-56.');
  }
  function drawSupernovaPlot(day) {
    const W = plot.width, H = plot.height, x = d => 34 + (d - SN.start) / (SN.end - SN.start) * (W - 46), y = M => 14 + (M - (SN.peak - 0.4)) / 6.2 * (H - 40);
    pg.clearRect(0, 0, W, H);
    pg.strokeStyle = 'rgba(211,226,238,0.14)'; pg.lineWidth = 1; pg.fillStyle = 'rgba(154,166,159,0.9)'; pg.font = '18px system-ui, sans-serif';
    for (const M of [-19, -17, -15]) { pg.beginPath(); pg.moveTo(34, y(M)); pg.lineTo(W - 12, y(M)); pg.stroke(); pg.fillText(String(M).replace('-', '−'), 0, y(M) + 6); }
    for (const d of [0, 30, 60, 90]) pg.fillText(d === 0 ? 'peak' : `+${d} d`, x(d) - 16, H - 4);
    const curve = (to, style, width) => {
      pg.beginPath();
      let first = true;
      for (let d = -SN.rise + 0.2; d <= to; d += 0.5) { const M = supernovaMagnitude(d); if (M === null || M > SN.peak + 5.6) continue; first ? pg.moveTo(x(d), y(M)) : pg.lineTo(x(d), y(M)); first = false; }
      pg.strokeStyle = style; pg.lineWidth = width; pg.stroke();
    };
    curve(SN.end, 'rgba(211,226,238,0.25)', 2);
    curve(day, '#d9ab45', 3.5);
    const M = supernovaMagnitude(day);
    if (M !== null && M < SN.peak + 5.6) { pg.fillStyle = '#f2f7fb'; pg.beginPath(); pg.arc(x(day), y(M), 6, 0, 6.2832); pg.fill(); }
  }
  function updateSupernova(dt) {
    if (state.event !== 'supernova') return;
    const g = snHost;
    if (snPending && nav.t >= 1 && model && model.galaxy === g) { snPending = false; supernova.start(); snSpot.copy(model.spot(0.3 + 0.2 * g.seed)); }
    if (snPending || !model) { $('e-live').innerHTML = live('Day', '—') + live('Brightness', '—') + live('From Earth', '—'); drawSupernovaPlot(SN.start); return; }
    // The star sits on an arm, so it turns with the arm pattern.
    const ang = -model.uniforms.uSpin.value * modelTime * (0.0125 / 0.75);
    const c = Math.cos(ang), s = Math.sin(ang);
    proj.set(c * snSpot.x - s * snSpot.z, snSpot.y, s * snSpot.x + c * snSpot.z).multiplyScalar(g.radius).applyQuaternion(model.points.quaternion);
    supernova.mesh.position.set(g.pos[0] - nav.origin.x + proj.x, g.pos[1] - nav.origin.y + proj.y, g.pos[2] - nav.origin.z + proj.z);
    const M = supernova.update(dt, supernova.mesh.position.distanceTo(camera.position), Math.tan(camera.fov * Math.PI / 360));
    const day = supernova.day;
    const share = M === null ? 0 : Math.pow(10, -0.4 * (M - g.M));
    $('e-live').innerHTML = live('Day', day < -SN.rise ? 'Before' : `${day < 0 ? '−' : '+'}${nf(Math.abs(day), 0)}`, day < -SN.rise ? 'still a white dwarf' : 'days from maximum')
      + live('Brightness', M === null ? '—' : `${sig(sunsFromMagnitude(M), 2) >= 1e9 ? nf(sunsFromMagnitude(M) / 1e9, 1) + ' billion' : nf(sunsFromMagnitude(M) / 1e6, 0) + ' million'} Suns`, M === null ? '' : `M = ${nf(M, 1).replace('-', '−')}`)
      + live('Against its galaxy', M === null ? '—' : share >= 1 ? `${nf(sig(share, 2), share < 10 ? 1 : 0)}× brighter` : `${nf(sig(share * 100, 2), share < 0.1 ? 1 : 0)}% of it`, M === null || g.home ? '' : `from Earth: mag ${nf(M + 5 * Math.log10(g.dist * 1e5), 1)}`);
    drawSupernovaPlot(day);
    if (day >= SN.end && !eventDone) eventDone = true;
  }

  // ---- black hole merger
  async function startMerger() {
    if (state.event) closeEvent();
    openEvent('merger');
    setEventText('Black hole merger · GW150914', 'Two black holes become one',
      `The first merger ever detected (LIGO, 14 September 2015): black holes of ${MERGER.m1} and ${MERGER.m2} solar masses, 410 Mpc away, far beyond this map. Slowed down ${MERGER.slow} times: the real event lasted a fifth of a second.`,
      'The gravitational-wave signal, a “chirp”: it rises in pitch and strength as the orbit shrinks. The sheet below the black holes shows the same ripples spreading at the speed of light (their height is exaggerated).');
    if (!merger) {
      $('e-live').innerHTML = live('Loading', 'the night sky…');
      const store = new TextureStore(renderer);
      const catalogue = await (await fetch('data/stars.bin')).arrayBuffer();
      const sky = createSky({
        catalogue,
        galPole: new THREE.Vector3(...eqToScene(192.85948, 27.12825)),
        galCentre: new THREE.Vector3(...eqToScene(266.40499, -28.93617)),
        far: 5000,
        lens: true,
      });
      sky.setLimit(engine.tier.starMag);
      sky.setGlow(await store.load(`milkyway_${engine.tier.glow}.webp`, { mipmaps: false }));
      sky.setGain(5, 18);
      merger = createMerger(renderer, sky);
      scene.add(merger.root);
      // The whole signal, sampled once for the plot.
      merger.wave = Array.from({ length: 900 }, (_, i) => MERGER.strain(i / 899 * merger.duration));
      if (state.event !== 'merger') return;                      // closed while loading
    }
    state.stage = 'merger';
    savedView = { az: rig.az, pol: rig.pol, dist: rig.dist, min: rig.minDist, max: rig.maxDist };
    mapRoot.visible = false;
    merger.root.visible = true;
    rig.locked = false;
    // Stand so that the Milky Way's bright centre lies behind the black holes.
    const gc = eqToScene(266.40499, -28.93617);
    rig.az = Math.atan2(-gc[2], -gc[0]) + 0.1; rig.pol = 1.36; rig.dist = rig.targetDist = 52 * fit();
    merger.start();
  }
  function leaveMerger() {
    if (state.stage !== 'merger') return;
    state.stage = 'map';
    merger.root.visible = false;
    mapRoot.visible = true;
    if (savedView) { rig.az = savedView.az; rig.pol = savedView.pol; rig.dist = rig.targetDist = savedView.dist; }
  }
  function drawMergerPlot(t) {
    const W = plot.width, H = plot.height, w = merger.wave, top = Math.max(...w.map(Math.abs));
    pg.clearRect(0, 0, W, H);
    const x = i => 8 + i / (w.length - 1) * (W - 16), y = v => H / 2 - 8 - v / top * (H / 2 - 22);
    const upto = Math.floor(t / merger.duration * (w.length - 1));
    const path = (a, b, style, width) => { pg.beginPath(); for (let i = a; i <= b; i++) i === a ? pg.moveTo(x(i), y(w[i])) : pg.lineTo(x(i), y(w[i])); pg.strokeStyle = style; pg.lineWidth = width; pg.stroke(); };
    path(0, w.length - 1, 'rgba(211,226,238,0.22)', 1.5);
    path(0, upto, '#92bfe3', 3);
    pg.fillStyle = '#f2f7fb'; pg.beginPath(); pg.arc(x(upto), y(w[upto]), 6, 0, 6.2832); pg.fill();
    pg.fillStyle = 'rgba(154,166,159,0.9)'; pg.font = '18px system-ui, sans-serif';
    pg.fillText('0 ms', 8, H - 4);
    const xm = 8 + MERGER.tMerge / merger.duration * (W - 16);
    pg.fillText('merger', xm - 30, H - 4);
    pg.strokeStyle = 'rgba(217,171,69,0.5)'; pg.lineWidth = 1; pg.setLineDash([4, 5]); pg.beginPath(); pg.moveTo(xm, 8); pg.lineTo(xm, H - 26); pg.stroke(); pg.setLineDash([]);
  }
  function updateMerger(dt) {
    rig.minDist = 9; rig.maxDist = 900;
    const s = merger.update(dt, camera, engine._pixelScale);
    const left = (MERGER.tMerge - merger.time) * 1000;
    if (!s.merged) {
      $('e-live').innerHTML = live('To merger', `${nf(Math.max(0, left), left < 10 ? 1 : 0)} ms`, 'real time')
        + live('Apart', `${nf(s.a / 1000, 0)} km`, `speed ≈ ${nf(s.v, 2)} c`)
        + live('Wave pitch', `${nf(s.f, 0)} Hz`, 'twice the orbit rate');
    } else {
      $('e-live').innerHTML = live('Result', `${MERGER.mFinal} solar masses`, 'one black hole')
        + live('Mass lost', `${MERGER.M - MERGER.mFinal} solar masses`, 'all as gravitational waves')
        + live('Energy, E = mc²', `${(MERGER.energy / 1e47).toFixed(1)} × 10⁴⁷ J`, 'no light at all');
    }
    drawMergerPlot(merger.time);
  }
  $('ev-supernova').addEventListener('click', startSupernova);
  $('ev-merger').addEventListener('click', startMerger);

  // ------------------------------------------------------------- keyboard ----
  addEventListener('keydown', e => {
    if (e.target.closest?.('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'escape') closeEvent();
    else if (k === 'm' || k === '0') { closeEvent(); flyTo(null); }
    else if (k >= '1' && k <= '9' && dockItems[+k]) { closeEvent(); flyTo(dockItems[+k].g); }
    else if (k === 'g' || k === 'l') setGuides(!state.guides);
    else if (k === 'i') togglePanel();
    else if (k === 'h') document.body.classList.toggle('is-idle');
    else if (k === 'f') full.click();
    else if (k === '+' || k === '=') rig.zoomBy(0.8);
    else if (k === '-' || k === '_') rig.zoomBy(1.25);
    else if (k === 's') startSupernova();
    else if (k === 'b') startMerger();
  });

  // --------------------------------------------------------------- start ----
  intro(0.9);
  const wanted = decodeURIComponent(location.hash.slice(1)).replace(/_/g, ' ');
  const first = cat.byName.get(wanted) || null;
  showPanel(null);
  flyTo(first);
  if (!first) { nav.d0 = OVERVIEW * 2.6; nav.duration = reducedMotion ? 0.01 : 3.6; }
  const hint = $('hint');
  hint.textContent = matchMedia('(pointer: coarse)').matches
    ? 'Drag to look around · pinch to zoom · tap a galaxy to fly there'
    : 'Drag to look around · scroll to zoom · click a galaxy to fly there';
  const hideHint = () => hint.classList.add('is-gone');
  canvas.addEventListener('pointerdown', hideHint, { once: true });
  setTimeout(hideHint, 14000);

  let last = performance.now(), time = 0, started = false, exposure = 1;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    time += dt;
    const tanHalf = Math.tan(camera.fov * Math.PI / 360);
    const pxPerRad = engine.height * engine._pixelScale / (2 * tanHalf);

    if (state.stage === 'map') {
      updateNav(dt);
      rig.maxDist = 260;
      rig.update(dt, engine.width, engine.height);
      camera.near = Math.max(1e-5, rig.dist * 0.02);
      camera.far = 2000;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      field.uniforms.uShift.value.copy(nav.origin);
      field.uniforms.uPxPerRad.value = pxPerRad;
      field.uniforms.uLimit.value += (state.limit - field.uniforms.uLimit.value) * (1 - Math.exp(-dt * 6));
      rings.group.position.copy(nav.origin).multiplyScalar(-1);
      rings.material.opacity += ((state.guides ? 0.16 : 0) - rings.material.opacity) * (1 - Math.exp(-dt * 5));
      rings.setStalk(nav.focus && !nav.focus.home ? nav.focus.pos : null);

      if (model) {
        const g = model.galaxy;
        if (!reducedMotion) modelTime += dt * MYR_PER_SECOND;
        const camDist = Math.hypot(g.pos[0] - nav.origin.x - camera.position.x, g.pos[1] - nav.origin.y - camera.position.y, g.pos[2] - nav.origin.z - camera.position.z);
        const appPx = g.radius / camDist * pxPerRad / engine._pixelScale;
        const fade = smooth(appPx, 10, 46);
        model.points.position.set(g.pos[0] - nav.origin.x, g.pos[1] - nav.origin.y, g.pos[2] - nav.origin.z);
        model.uniforms.uTime.value = modelTime;
        model.uniforms.uPxPerRad.value = pxPerRad;
        model.uniforms.uFade.value = fade;
        model.uniforms.uGain.value = MODEL_GAIN * 96000 / model.count;
        model.points.visible = fade > 0.002;
        field.uniforms.uFocus.value = g.i;
        field.uniforms.uFocusFade.value = fade;
        // Close up, a galaxy is a faint thing: open the exposure as a camera would.
        exposure += ((1 + 0.9 * fade) - exposure) * (1 - Math.exp(-dt * 2));
      } else {
        field.uniforms.uFocus.value = -1;
        exposure += (1 - exposure) * (1 - Math.exp(-dt * 2));
      }
      updateSupernova(dt);
      updateLabels();
      updateHover();
    } else {
      rig.update(dt, engine.width, engine.height);
      camera.near = 0.5;
      camera.far = 20000;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      updateMerger(dt);
      exposure += (1 - exposure) * (1 - Math.exp(-dt * 2));
      labelLayer.style.opacity = 0;
      tip.hidden = true;
    }
    engine.setExposure(exposure);
    engine.render(dt, time);
    if (!started) {
      started = true;
      const i = $('intro');
      i.classList.add('is-done');
      setTimeout(() => i.remove(), 1600);
      setTimeout(() => hint.classList.add('is-in'), 2600);
    }
  }
  requestAnimationFrame(frame);

  // For tests and screenshots.
  window.__universe = { state, engine, rig, nav, galaxies, cat, flyTo, startSupernova, startMerger, closeEvent, supernova, get merger() { return merger; }, get model() { return model; }, setLimit, togglePanel };
}
