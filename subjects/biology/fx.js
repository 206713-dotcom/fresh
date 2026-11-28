// Fresh Biology visuals. Decorative only: no lesson, question, label or saved progress is touched.
//
// The Biology app draws itself inside a shadow root and rewrites its own markup on every screen
// change. This file never edits the app's files. It adds, next to the app:
//
//   1. Stage     one WebGL canvas behind the top of every screen: living cells that drift, divide
//                and merge, drifting organelles, a pointer "microscope lamp", click ripples and,
//                on the dashboard, a turning DNA double helix
//   2. Chips     topic names orbiting the helix (dashboard only); each one opens its topic
//   3. Tapes     two slanted tapes of topic names along the bottom of the dashboard stage
//   4. Dressing  after each screen is drawn: headline letters, on-dark text over the stage,
//                topic colours and glyphs, the sliding menu highlight, card light and tilt
//
// One animation frame drives everything. It stops when the stage is off screen or the tab is
// hidden, lowers its own resolution when frames run slow, and draws a single still frame when
// "reduce motion" is on. Without WebGL the dark stage is simply a still gradient.
import { topics, lessons, questions, cards } from './src/content.js';

const host = document.querySelector('#biology-section');
if (host) whenReady(start);

function whenReady(run) {
  const tryNow = () => host.shadowRoot && host.shadowRoot.querySelector('.bio-root') ? (run(), true) : false;
  if (tryNow()) return;
  let tries = 0;
  const timer = setInterval(() => { if (tryNow() || ++tries > 200) clearInterval(timer); }, 50);
}

function start() {
  const root = host.shadowRoot;
  const app = root.querySelector('.bio-root');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const make = (tag, cls, parent) => { const n = document.createElement(tag); n.className = cls; n.setAttribute('aria-hidden', 'true'); if (parent) parent.append(n); return n; };

  // ---------------------------------------------------------------- page-side styles
  const pageStyle = document.createElement('style');
  pageStyle.textContent = `
    html, body { overflow-x: clip; }
    #biology-section { position: relative; }
    @media (min-width: 601px) { .biology-host > .back { margin-left: 52px; } }`;
  document.head.append(pageStyle);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = new URL('./fx.css?v=3', import.meta.url).href;
  root.insertBefore(sheet, app);

  // ---------------------------------------------------------------- 1. Stage
  const stage = make('div', 'fx-stage');
  root.insertBefore(stage, app);
  const canvas = make('canvas', 'fx-canvas', stage);
  const chipLayer = make('div', 'fx-chips', stage);
  const tapes = make('div', 'fx-tapes', stage);
  for (const cls of ['fx-tape back', 'fx-tape front']) {
    const band = make('div', cls, tapes), track = make('div', 'fx-tape-track', band);
    const list = cls.includes('back') ? [...topics].reverse() : topics;
    for (let k = 0; k < 3; k++) for (const t of list) { make('span', 'fx-tape-word', track).textContent = t.title; make('i', 'fx-tape-dot', track); }
  }

  // ---- 2. Chips: every topic, on three tilted orbits round the helix
  const chips = topics.map((t, i) => {
    const a = document.createElement('a');
    a.className = 'fx-chip';
    a.href = `#/topics/${t.id}`;
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b><span></span>`;
    a.lastChild.textContent = t.title;
    chipLayer.append(a);
    const ring = i % 2;
    return { el: a, ring, phase: (Math.floor(i / 2) / Math.ceil(topics.length / 2)) * Math.PI * 2 + ring * 0.29 };
  });
  const RINGS = [{ rx: 1.28, ry: 0.86, tilt: -0.18, speed: 0.05 }, { rx: 0.9, ry: 0.62, tilt: 0.3, speed: -0.04 }];

  // ---- WebGL
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  const N = 10;                                            // cells
  const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime, uPx;
uniform vec3 uPtr;                 // pointer x, y (px) and strength
uniform vec3 uCell[${N}];          // x, y, radius (px)
uniform vec3 uRip[4];              // x, y, start time
uniform vec4 uDna;                 // centre x, y, half length, radius (px); radius 0 = none
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx;        // CSS pixels, origin top-left
  vec2 size = uRes / uPx;
  float t = uTime;
  vec3 LIME = vec3(0.89, 0.93, 0.70), PEACH = vec3(0.96, 0.73, 0.51), TEAL = vec3(0.47, 0.84, 0.69);

  // cytoplasm: slow flowing currents on Fresh's deep green
  vec2 q = p / 520.0;
  float flow = fbm(q * 1.5 + vec2(t * 0.025, -t * 0.018) + fbm(q * 2.3 - t * 0.02));
  vec3 col = mix(vec3(0.040, 0.098, 0.082), vec3(0.075, 0.190, 0.150), flow);
  col += vec3(0.02, 0.07, 0.05) * smoothstep(0.55, 0.9, flow);

  // cells: one smooth field, so neighbours fuse and pull apart like dividing cells
  float f = 0.0, nuc = 0.0;
  for (int i = 0; i < ${N}; i++) {
    vec2 d = p - uCell[i].xy; float r = uCell[i].z, d2 = dot(d, d);
    f += r * r / (d2 + 1.0);
    nuc += exp(-d2 / (r * r * 0.085));
  }
  float inside = smoothstep(0.92, 1.12, f);
  float wall = 1.0 - smoothstep(0.0, 0.085, abs(f - 1.0) / max(f, 0.4));
  float grainy = noise(p / 7.0 + t * 0.08);
  col += inside * vec3(0.018, 0.060, 0.046) * (0.7 + 0.6 * grainy);
  col += wall * LIME * 0.20;
  col += wall * wall * LIME * 0.14;
  col += min(nuc, 1.0) * inside * PEACH * 0.085;

  // organelles: specks carried along by the currents
  vec2 g = p / 96.0 + vec2(t * 0.020, t * 0.012);
  vec2 id = floor(g), fr = fract(g);
  float h = hash(id);
  vec2 c = 0.5 + 0.34 * vec2(sin(t * 0.3 + h * 40.0), cos(t * 0.24 + h * 70.0));
  float speck = (1.0 - smoothstep(0.0, 0.075, length(fr - c))) * step(0.45, h);
  col += speck * mix(TEAL, PEACH, step(0.82, h)) * 0.20;

  // DNA: two strands and their base pairs, turning about its axis
  if (uDna.w > 0.0) {
    vec2 d = p - uDna.xy;
    float ca = cos(0.30), sa = sin(0.30);
    vec2 l = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
    float H = uDna.z, R = uDna.w, pitch = R * 3.3, k = 6.2831853 / pitch;
    float ends = 1.0 - smoothstep(H * 0.72, H, abs(l.y));
    if (ends > 0.0 && abs(l.x) < R * 1.5) {
      float ph = l.y * k + t * 0.55;
      float xa = R * sin(ph), za = cos(ph);
      float da = abs(l.x - xa), db = abs(l.x + xa);
      float wa = mix(2.0, 5.2, za * 0.5 + 0.5), wb = mix(2.0, 5.2, -za * 0.5 + 0.5);
      float sA = (1.0 - smoothstep(wa * 0.25, wa, da)) * mix(0.35, 1.0, za * 0.5 + 0.5) + exp(-da / 9.0) * 0.10;
      float sB = (1.0 - smoothstep(wb * 0.25, wb, db)) * mix(0.35, 1.0, -za * 0.5 + 0.5) + exp(-db / 9.0) * 0.10;
      float sp = pitch / 9.0, yi = (floor(l.y / sp) + 0.5) * sp, pr = yi * k + t * 0.55;
      float xr = R * sin(pr);
      float rung = (1.0 - smoothstep(0.5, 2.1, abs(l.y - yi))) * step(abs(l.x), abs(xr) - 2.0) * (0.25 + 0.5 * abs(sin(pr)));
      vec3 pair = l.x * xr > 0.0 ? LIME : PEACH;
      col += ends * (sA * LIME + sB * TEAL) * 0.85;
      col += ends * rung * pair * 0.55;
    }
    col += vec3(0.05, 0.11, 0.08) * exp(-dot(d, d) / (H * H * 0.5)) * 0.9;     // soft lamp behind it
  }

  // the pointer is the microscope lamp
  float lamp = exp(-dot(p - uPtr.xy, p - uPtr.xy) / 52000.0) * uPtr.z;
  col += lamp * vec3(0.060, 0.105, 0.070);
  col += lamp * wall * LIME * 0.45;

  // ripples from a click
  for (int i = 0; i < 4; i++) {
    float age = t - uRip[i].z;
    if (age > 0.0 && age < 2.6) {
      float ring = exp(-pow((length(p - uRip[i].xy) - age * 380.0) / 16.0, 2.0)) * exp(-age * 1.5);
      col += ring * LIME * 0.42;
    }
  }

  // eyepiece: darker edges, a little grain
  vec2 e = (p - size * 0.5) / size;
  col *= 1.0 - 0.55 * smoothstep(0.25, 0.85, length(e * vec2(1.0, 1.25)));
  col += (hash(p + fract(t) * 91.0) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}`;
  let prog = null, U = {};
  if (gl) {
    try {
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uTime', 'uPx', 'uPtr', 'uCell', 'uRip', 'uDna']) U[n] = gl.getUniformLocation(prog, n);
    } catch (err) { console.warn('Biology visuals: still background only.', err); prog = null; }
  }
  if (!prog) stage.classList.add('fx-still');

  // ---- the cells: free ones, and pairs that keep pulling apart and fusing (division)
  let W = 1, H = 1, quality = 1, px = 1;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cells = Array.from({ length: N }, (_, i) => ({ x: Math.random(), y: Math.random(), vx: rnd(-1, 1), vy: rnd(-1, 1), r: rnd(0.55, 1), mate: i % 2 ? i - 1 : -1, ph: rnd(0, 6.28) }));
  const cellData = new Float32Array(N * 3), ripData = new Float32Array(12).fill(-99);
  let ripAt = 0;
  const ptr = { x: -999, y: -999, k: 0, tx: -999, ty: -999, on: 0 };
  const dna = { x: 0, y: 0, h: 0, r: 0 };

  function sizeCanvas() {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    px = Math.min(devicePixelRatio || 1, 1.5) * quality;
    const w = Math.round(W * px), h = Math.round(H * px);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; if (gl) gl.viewport(0, 0, w, h); }
  }

  let t0 = 0, last = 0, raf = 0, visible = true, slow = 0, frames = 0, skip = false, flip = false;
  function frame(now, once) {
    if (!once) raf = visible && !document.hidden && !reduce.matches ? requestAnimationFrame(frame) : 0;
    if (!t0) t0 = now;
    if (!once && skip && (flip = !flip)) return;              // half rate on slow machines
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    // governor: if frames are slow, first draw fewer pixels, then draw every other frame
    if (!once && last) {
      slow += now - last > (skip ? 44 : 22) ? 1 : 0;
      if (++frames >= 50) { if (slow > 25) { if (quality > 0.55) { quality *= 0.8; sizeCanvas(); } else skip = true; } frames = slow = 0; }
    }
    last = now;
    const t = reduce.matches ? 12 : (now - t0) / 1000;
    ptr.k += (ptr.on - ptr.k) * 0.08; ptr.x += (ptr.tx - ptr.x) * 0.18; ptr.y += (ptr.ty - ptr.y) * 0.18;

    const unit = Math.min(Math.max(H, 260), 620) * 0.16;      // cell size follows the stage's height
    cells.forEach((c, i) => {
      if (c.mate >= 0) {                                      // a daughter cell: rides beside its mate
        const m = cells[c.mate], gap = (0.15 + 1.75 * (0.5 + 0.5 * Math.sin(t * 0.16 + c.ph))) * unit * m.r;
        c.x = m.x + Math.cos(c.ph + t * 0.05) * gap / W; c.y = m.y + Math.sin(c.ph + t * 0.05) * gap / H; c.r = m.r * 0.92;
      } else {
        c.x += c.vx * dt * 9 / W; c.y += c.vy * dt * 9 / H;
        if (c.x < 0.02 || c.x > 0.98) c.vx *= -1;
        if (c.y < 0.05 || c.y > 0.95) c.vy *= -1;
        c.x = Math.min(0.99, Math.max(0.01, c.x)); c.y = Math.min(0.97, Math.max(0.03, c.y));
        const dx = c.x * W - ptr.x, dy = c.y * H - ptr.y, d = Math.hypot(dx, dy);      // cells edge away from the lamp
        if (d < 190 && ptr.k > 0.2) { c.x += dx / (d + 1) * dt * 26 / W; c.y += dy / (d + 1) * dt * 26 / H; }
      }
      cellData[i * 3] = c.x * W; cellData[i * 3 + 1] = c.y * H; cellData[i * 3 + 2] = c.r * unit * (1 + 0.04 * Math.sin(t * 0.9 + i));
    });

    // chips ride their orbits round the helix
    if (dna.r) {
      const base = dna.h * 0.92;
      for (const ch of chips) {
        const o = RINGS[ch.ring], a = ch.phase + t * o.speed;
        const ex = Math.cos(a) * base * o.rx, ey = Math.sin(a) * base * o.ry;
        ch.depth = Math.sin(a);
        ch.x = dna.x + ex * Math.cos(o.tilt) - ey * Math.sin(o.tilt); ch.y = dna.y + ex * Math.sin(o.tilt) + ey * Math.cos(o.tilt);
      }
      // nearest first; a chip that would sit on top of a nearer one steps back until there is room
      const shown = [];
      for (const ch of [...chips].sort((p, q) => q.depth - p.depth)) {
        const front = ch.depth * 0.5 + 0.5, s = 0.7 + 0.3 * front;
        let op = front < 0.42 ? 0 : Math.min(1, (front - 0.42) * 2.6);
        if (op > 0) {
          if (shown.some(q => Math.abs(q.x - ch.x) < 168 && Math.abs(q.y - ch.y) < 34)) op = 0; else shown.push(ch);
        }
        ch.el.style.transform = `translate3d(${ch.x.toFixed(1)}px, ${ch.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        ch.el.style.opacity = op.toFixed(2);
        ch.el.style.pointerEvents = op < 0.5 ? 'none' : '';
        ch.el.style.zIndex = ch.depth > 0 ? 2 : 0;
      }
    }
    if (!prog) return;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uPx, px);
    gl.uniform1f(U.uTime, t);
    gl.uniform3f(U.uPtr, ptr.x, ptr.y, ptr.k);
    gl.uniform3fv(U.uCell, cellData);
    gl.uniform3fv(U.uRip, ripData);
    gl.uniform4f(U.uDna, dna.x, dna.y, dna.h, dna.r);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ripT = t;
  }
  let ripT = 0;
  const run = () => { if (!raf && visible && !document.hidden && !reduce.matches) { last = 0; raf = requestAnimationFrame(frame); } };
  const still = () => requestAnimationFrame(n => frame(n, true));
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }).observe(stage);
  if ('ResizeObserver' in window) new ResizeObserver(() => { sizeCanvas(); if (!raf) still(); }).observe(stage);
  document.addEventListener('visibilitychange', run);
  reduce.addEventListener?.('change', () => { run(); still(); });

  // pointer lamp and ripples (listening on the page, so the app's own controls are never in the way)
  addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top;
    ptr.on = fine.matches && e.clientY < r.bottom && e.clientY > r.top ? 1 : 0;
  }, { passive: true });
  addEventListener('pointerdown', e => {
    const r = stage.getBoundingClientRect();
    if (e.clientY > r.bottom || e.clientY < r.top || reduce.matches) return;
    ripData.set([e.clientX - r.left, e.clientY - r.top, ripT], (ripAt++ % 4) * 3);
  }, { passive: true });

  // ---------------------------------------------------------------- 4. Dressing
  const GLYPH = {
    tree: 'M12 21v-7m0 0-4-4m4 4 4-4m-4-1V5m0 4L9 6m3 3 3-3M6 10 4 8m14 2 2-2',
    cell: 'M12 3c5 0 9 3.6 9 9s-4 9-9 9-9-3.6-9-9 4-9 9-9Zm1 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM7.5 9h.01M8 15h.01M16 7.500h.01',
    swap: 'M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3',
    hex: 'M12 3l7.5 4.3v8.600L12 20.3l-7.500-4.400V7.300L12 3Zm0 5.200v7.600M8.700 10l6.600 3.800',
    leaf: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19 14 10',
    heart: 'M12 20s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.300a4.300 4.300 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20Z',
    lungs: 'M12 4v7m0 0c-1.500 0-2.500 1-3.500 2.500C7 15.500 5 16 5 19c0 1.500 5 1.500 5-1.500V9.500M12 11c1.500 0 2.500 1 3.500 2.500 1.500 2 3.500 2.500 3.500 5.500 0 1.500-5 1.500-5-1.500V9.500',
    shield: 'M12 3l7.500 3v5.500c0 4.800-3.200 8-7.500 9.500-4.300-1.500-7.500-4.700-7.500-9.500V6L12 3Zm-3 9 2.200 2.200L15.500 10',
    bolt: 'M13 3 5 13.500h6L10 21l9-11h-6.500L13 3Z',
    drop: 'M12 3s6.500 6.700 6.500 11.500a6.500 6.500 0 0 1-13 0C5.500 9.700 12 3 12 3Z',
    pill: 'M8.500 20a5 5 0 0 1-3.500-8.500L11.500 5a5 5 0 0 1 7 7L12 18.500A5 5 0 0 1 8.500 20ZM8.300 8.300l7.400 7.400',
    dna: 'M7 3c0 6 10 6 10 12 0 2-1 4-1 6M17 3c0 6-10 6-10 12 0 2 1 4 1 6M8 6.500h8M8.500 17.500h7M9.500 12h5',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.500 2.500 3.800 5.500 3.800 9S14.500 18.500 12 21c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3Z',
  };
  const TOPIC_LOOK = ['tree', 'cell', 'swap', 'hex', 'hex', 'leaf', 'drop', 'leaf', 'heart', 'shield', 'lungs', 'bolt', 'drop', 'bolt', 'pill', 'dna', 'dna', 'tree', 'globe', 'globe', 'dna'];
  // ---------- what each tool is for (used by the launcher, the search box and the step strips) ----------
const TOOL_GROUPS = [
  ['Learn', 152, [
    ['/topics', 'Topics & lessons', 'Read the notes topic by topic', `${topics.length} topics · ${lessons.length} lessons`],
    ['/diagrams', 'Diagrams', 'Labelled drawings you can hide and recall', ''],
    ['/glossary', 'Glossary & calculators', 'Key terms, command words, magnification and % change', ''],
  ]],
  ['Test yourself', 205, [
    ['/practice', 'Practice questions', 'Build a set by topic, type and difficulty', `${questions.length} questions`],
    ['/flashcards', 'Flashcards', 'Recall, flip, rate — cards come back when due', `${cards.length} cards`],
    ['/practicals', 'Practicals', 'Investigations, virtual lab and Paper 6 practice', ''],
    ['/exams', 'Exams', 'Timed mini mocks for each paper', ''],
  ]],
  ['Track', 32, [
    ['/progress', 'Progress', 'Lessons read, accuracy and past attempts', ''],
    ['/mistakes', 'Mistakes', 'Every wrong answer, ready to retry', ''],
    ['/planner', 'Planner', 'Exam date, daily minutes and today’s tasks', ''],
  ]],
  ['Set up', 268, [
    ['/settings', 'Settings', 'Core or Extended, Paper 5 or 6, backup your data', ''],
    ['/coverage', 'Syllabus coverage', 'Which objectives the notes cover so far', ''],
    ['/about', 'About', 'What is in Fresh Biology and how to report an error', ''],
  ]],
];
const HOW = {
  practice: ['Choose a topic, question type and difficulty.', 'Test mode marks everything at the end. Learn mode lets you reveal feedback on each question.', 'Anything you get wrong is saved in Mistakes so you can retry it.'],
  flashcards: ['Say the answer in your head first.', 'Click the card (or press Space on it) to flip.', 'Rate it: Again brings it straight back; Hard, Good and Easy push the next review further away.'],
  exams: ['Pick the paper you sit — the list follows your Core or Extended route.', 'A mini mock is timed and submits itself when the clock runs out.', 'Written answers are self-marked against the mark scheme afterwards.'],
  mistakes: ['Choose why it went wrong and write a short reflection.', 'Retry the question without seeing the answer.', 'Mark it resolved once you can get it right.'],
  planner: ['Set your exam date and how many minutes you have each day.', 'Generate today’s plan.', 'Tick tasks off as you finish; edit any task to fit your day.'],
  diagrams: ['Pick a diagram.', 'Study the labels.', 'Hide the labels and recall each one.'],
  practicals: ['Experiment Library: every investigation with method, sample data and exam practice.', 'Virtual Laboratory: take simulated readings and record your own results.', 'Paper 6 Question Bank and Timed Mocks: written practice you self-mark.'],
  progress: ['Lessons count when you press “Mark as read”.', 'Accuracy uses marked questions only; written answers stay pending until you self-mark.', 'Open any past attempt to review it.'],
  settings: ['Route changes which lessons and questions you see.', 'Everything is saved in this browser only.', 'Export a backup before clearing browser data or switching device.'],
};

const HUES = [152, 76, 174, 28, 265, 204];
  const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${path.replace(/(\d)00(?=\D|$)/g, '$1')}"/></svg>`;

  let lastRoute = null, working = false, queued = false;

  let lastSide = '';
  const toolIcon = path => app.querySelector(`.side .nav a[data-bio-route="${path}"] svg`)?.outerHTML || '';
  // search also finds the tools themselves, not only lessons and terms
  const enrichSearch = () => {
    const box = app.querySelector('#search-results'), input = app.querySelector('#search-input');
    if (!box || !input || box.querySelector('.fx-hit, .fx-sep')) return;
    const q = input.value.trim().toLowerCase();
    const hits = TOOL_GROUPS.flatMap(g => g[2]).filter(t => !q || (t[1] + ' ' + t[2]).toLowerCase().includes(q));
    if (!hits.length) return;
    working = true;
    if (box.firstElementChild?.tagName === 'P' && !box.querySelector('a')) box.textContent = '';
    const had = box.children.length;
    const frag = document.createDocumentFragment();
    make('div', 'fx-sep', frag).textContent = 'Tools';
    for (const [path, title, text] of hits) {
      const a = make('a', 'btn fx-hit', frag);
      a.href = '#' + path;
      a.innerHTML = `<i>${toolIcon(path)}</i>${title}<small>${text}</small>`;
    }
    if (had) make('div', 'fx-sep', frag).textContent = 'Lessons and terms';
    for (const n of frag.children) n.removeAttribute('aria-hidden');
    box.prepend(frag);
    working = false;
  };
  app.addEventListener('input', ev => { if (ev.target.id === 'search-input') enrichSearch(); });
  app.addEventListener('click', ev => { if (ev.target.closest('[data-action="search"]')) setTimeout(enrichSearch, 0); });
  addEventListener('keydown', ev => { if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') setTimeout(enrichSearch, 30); });

  function dress() {
    queued = false;
    working = true;
    const main = app.querySelector('main#main');
    const side = app.querySelector('.side');
    const head = app.querySelector('.main > header');
    if (!main) { working = false; return; }
    const route = (location.hash || '#/').split('?')[0];
    const dash = !!main.querySelector(':scope > section.hero');
    const entering = route !== lastRoute;
    lastRoute = route;
    stage.dataset.mode = dash ? 'dash' : 'page';
    app.classList.toggle('fx-dash', dash);
    if (entering && !reduce.matches) { stage.dataset.enter = '1'; setTimeout(() => delete stage.dataset.enter, 1300); }

    // which elements sit on the dark stage: everything down to the page heading (and its one-line
    // summary); on the dashboard, down to the three statistics
    const h1 = main.querySelector('h1');
    let end = h1;
    const sub = h1 && h1.nextElementSibling;
    if (sub && sub.matches('p.muted, small, p:not(.notice)') && !sub.querySelector('input, select, button, a.btn')) end = sub;
    if (dash) end = main.querySelector(':scope > .grid') || end;
    if (end) {
      // walk down from <main> to the heading's own parent, inking earlier siblings at each level
      const chain = [];
      for (let n = end; n && n !== main; n = n.parentElement) chain.unshift(n);
      let parent = main;
      for (const stop of chain) {
        for (const n of parent.children) { if (n.id === 'storage') continue; if (n === stop) break; n.classList.add('fx-ink'); }
        parent = stop;
      }
      end.classList.add('fx-ink', 'fx-ink-end');
      let after = null;
      for (let n = end; n && n !== main && !after; n = n.parentElement) after = n.nextElementSibling;
      if (after) after.classList.add('fx-after');
    }

    // headline: letters fall into place (the text itself is unchanged)
    if (h1 && entering && !reduce.matches && !h1.dataset.fx && h1.children.length === 0 && h1.textContent.length < 60) {
      const text = h1.textContent;
      h1.dataset.fx = '1';
      h1.setAttribute('aria-label', text);
      h1.textContent = '';
      let i = 0;
      text.split(' ').forEach((word, k) => {
        if (k) h1.append(' ');
        const w = make('span', 'fx-word', h1);
        for (const ch of word) { const s = make('span', 'fx-letter', w); s.textContent = ch; s.style.setProperty('--i', i++); }
      });
    }

    // topic cards: a colour and a glyph each
    for (const card of main.querySelectorAll('a.card.topic')) {
      if (card.dataset.fx) continue;
      card.dataset.fx = '1';
      const n = parseInt(card.querySelector('.num')?.textContent, 10);
      if (!n) continue;
      card.style.setProperty('--h', HUES[(n - 1) % HUES.length]);
      make('span', 'fx-glyph', card).innerHTML = svg(GLYPH[TOPIC_LOOK[n - 1] || 'cell']);
    }


    // ---------- below the stage ----------
    const seg = route.replace(/^#\/?/, '').split('/');
    const page = seg[0] || 'dash';
    app.dataset.page = page;

    // forms: label + control pairs become fields that can sit side by side
    for (const label of main.querySelectorAll('label[for]')) {
      const ctl = label.nextElementSibling;
      if (!ctl || ctl.id !== label.htmlFor || !ctl.matches('input, select, textarea') || label.parentElement.classList.contains('fx-field')) continue;
      const field = document.createElement('div');
      field.className = 'fx-field';
      label.before(field);
      field.append(label, ctl);
    }
    for (const f of main.querySelectorAll('.fx-field:not(.fx-unit)')) {      // a unit picker belongs beside its number
      const unit = f.nextElementSibling;
      if (unit && unit.matches('select') && !main.querySelector(`label[for="${unit.id}"]`)) { f.append(unit); f.classList.add('fx-unit'); }
    }
    for (const box of new Set([...main.querySelectorAll('.fx-field')].map(f => f.parentElement))) {
      if (box.querySelectorAll(':scope > .fx-field').length > 1) box.classList.add('fx-form');
    }

    // results: show at a glance how each answer went
    if (page === 'results' || page === 'session') {
      for (const el of main.querySelectorAll('.card p, .card strong')) {
        if (el.children.length && el.firstElementChild.tagName !== 'STRONG') continue;
        const m = /^(\d+|Pending) \/ (\d+)$/.exec(el.textContent.trim());
        const card = m && el.closest('.card');
        if (!card || card.dataset.fxMark) continue;
        card.dataset.fxMark = '1';
        card.classList.add(m[1] === 'Pending' ? 'fx-pending' : +m[1] >= +m[2] ? 'fx-right' : +m[1] > 0 ? 'fx-pending' : 'fx-wrong');
        (el.tagName === 'P' ? el : el.parentElement).classList.add('fx-mark');
      }
    }

    // flashcard: the answer side looks different, and turning it over is a flip
    const big = main.querySelector('button.bigcard');
    if (big) {
      const side = /^\s*ANSWER/i.test(big.textContent) ? 'a' : 'q';
      big.classList.toggle('fx-answer', side === 'a');
      if (lastSide && lastSide !== side && !entering && !reduce.matches) big.classList.add('fx-flip');
      lastSide = side;
    } else lastSide = '';

    // practicals: the row of sections becomes a tab bar with the open one marked
    if (page === 'practicals') {
      const row = [...main.querySelectorAll('.row')].find(r => r.querySelector('a[data-bio-route^="/practicals"]') && r.children.length > 4);
      if (row) {
        row.classList.add('fx-tabs');
        const here = '/' + seg.join('/').replace(/\/$/, '');
        let on = [...row.children].find(a => (a.dataset.bioRoute || '').replace(/\/$/, '') === here);
        if (!on) on = row.firstElementChild;
        on.classList.add('fx-on');
      }
    }

    // three short steps under the title of each tool's front page
    const afterEl = main.querySelector('.fx-after');
    if (HOW[page] && !seg[1] && afterEl && !main.querySelector('.fx-how-wrap')) {
      const how = document.createElement('details');
      how.className = 'fx-how-wrap fx-after';
      how.open = innerWidth > 640;             // on a phone the steps stay folded until asked for
      how.innerHTML = '<summary>How this works</summary><div class="fx-how">' + HOW[page].map((t, i) => `<div><b>${i + 1}</b><span>${t}</span></div>`).join('') + '</div>';
      afterEl.classList.remove('fx-after');
      afterEl.before(how);
    }

    // every tool in one place: on the dashboard and on the "more" page
    if ((dash || page === 'more') && !main.querySelector('.fx-launch')) {
      const tools = app.querySelector('.card .stack a[data-bio-route="/mistakes"]');
      const open = tools ? +(/\((\d+)\)/.exec(tools.textContent) || [])[1] || 0 : 0;
      const dueCard = dash && main.querySelector(':scope > .grid.fx-ink > .card:nth-child(3) .stat');
      const due = dueCard ? parseInt(dueCard.textContent, 10) || 0 : 0;
      const sec = document.createElement('section');
      sec.className = 'fx-launch';
      sec.innerHTML = '<h2>Everything in Biology</h2><p>Every tool, and what it is for.</p><div class="fx-launch-groups">' + TOOL_GROUPS.map(([name, hue, items]) =>
        `<div class="fx-group" style="--gh:${hue}"><h3>${name}</h3>` + items.map(([path, title, text, meta]) => {
          let badge = meta ? `<em>${meta}</em>` : '';
          if (path === '/mistakes' && open) badge = `<em class="fx-hot">${open} to review</em>`;
          if (path === '/flashcards' && due) badge = `<em class="fx-hot">${due} due</em>`;
          return `<a class="fx-tool" href="#${path}"><i>${toolIcon(path)}</i><strong>${title}</strong><span>${text}</span>${badge}</a>`;
        }).join('') + '</div>').join('') + '</div>';
      const anchor = dash ? main.querySelector(':scope > .grid.fx-ink + *') : main.querySelector(':scope > .stack');
      if (anchor) anchor.after(sec); else main.append(sec);
    }

    for (const a of app.querySelectorAll('.side .nav a')) if (!a.title) a.title = a.textContent.trim();
    placePill(true);
    working = false;
    layout();
  }
  // menu: a highlight that slides to the open tab. The app rebuilds the menu on every screen
  // change, so the last position is kept on the host and the new highlight starts from there.
  function placePill(slide) {
    const nav = app.querySelector('.side .nav');
    const active = nav && nav.querySelector('a.active');
    if (!active || getComputedStyle(nav).flexDirection !== 'row') return;      // styles not in yet
    let pill = nav.querySelector('.fx-pill');
    const fresh = !pill;
    if (fresh) { working = true; pill = make('span', 'fx-pill', nav); working = false; }
    const to = [active.offsetLeft, active.offsetTop, active.offsetWidth, active.offsetHeight];
    const put = v => { pill.style.transform = `translate(${v[0]}px, ${v[1]}px)`; pill.style.width = v[2] + 'px'; pill.style.height = v[3] + 'px'; };
    const from = host.dataset.fxNav ? host.dataset.fxNav.split(',') : null;
    if (fresh && from && slide && !reduce.matches) { pill.style.transition = 'none'; put(from); pill.getBoundingClientRect(); pill.style.transition = ''; }
    put(to);
    pill.style.opacity = 1;
    host.dataset.fxNav = to.join(',');
    if (active.offsetLeft < nav.scrollLeft || active.offsetLeft + active.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = active.offsetLeft - 40;
  }

  function layout() {
    const main = app.querySelector('main#main');
    if (!main) return;
    const hostBox = host.getBoundingClientRect();
    const lastInk = main.querySelector('.fx-ink-end');
    const dash = stage.dataset.mode === 'dash';
    const after = main.querySelector('.fx-after');
    // the stage ends a fixed gap above whatever comes next, so nothing ever touches its edge
    const h = Math.round(after ? after.getBoundingClientRect().top - hostBox.top - (dash ? 62 : 34)
      : (lastInk ? lastInk.getBoundingClientRect().bottom - hostBox.top : 180) + (dash ? 104 : 28));
    stage.style.height = h + 'px';
    host.style.setProperty('--fx-h', h + 'px');
    // the helix stands in the free space to the right of the dashboard's opening panel
    const hero = dash && main.querySelector(':scope > section.hero');
    const stageBox = stage.getBoundingClientRect();
    if (hero && innerWidth >= 900) {
      const hb = hero.getBoundingClientRect(), mb = main.getBoundingClientRect();
      const left = hb.right, right = mb.right, top = app.querySelector('.main > header')?.getBoundingClientRect().bottom ?? hb.top;
      const grid = main.querySelector(':scope > .grid');
      const floor = grid ? grid.getBoundingClientRect().top : hb.bottom;
      dna.x = (left + right) / 2 - stageBox.left + 10;
      dna.y = (top + floor) / 2 - stageBox.top - 6;
      dna.h = Math.min((floor - top) * 0.47, (right - left) * 0.42, 230);
      dna.r = dna.h * 0.2;
      chipLayer.hidden = (right - left) < 420;
    } else if (hero) {
      const hb = hero.getBoundingClientRect();
      dna.x = stageBox.width - 54; dna.y = hb.top - stageBox.top - 70; dna.h = 86; dna.r = 17; chipLayer.hidden = true;
    } else { dna.r = 0; chipLayer.hidden = true; }
    placePill(false);
    sizeCanvas();
    if (reduce.matches || !raf) still();
  }

  // ---- card light and tilt: one listener for the whole app
  let lit = null;
  app.addEventListener('pointermove', e => {
    if (!fine.matches) return;
    const card = e.target.closest?.('.card');
    if (lit && lit !== card) { lit.style.removeProperty('--rx'); lit.style.removeProperty('--ry'); lit.classList.remove('fx-lit'); }
    lit = card;
    if (!card) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.classList.add('fx-lit');
    card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    if (card.tagName === 'A' && !reduce.matches) { card.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg'); card.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg'); }
  }, { passive: true });
  app.addEventListener('pointerleave', () => { if (lit) { lit.style.removeProperty('--rx'); lit.style.removeProperty('--ry'); lit.classList.remove('fx-lit'); lit = null; } });

  // ---- keep up with the app: it redraws itself whenever anything changes
  new MutationObserver(() => {
    if (working || queued) return;
    if (app.querySelector('main#main') && !app.querySelector('main#main').dataset.fxSeen) {
      queued = true;
      app.querySelector('main#main').dataset.fxSeen = '1';
      queueMicrotask(dress);
    }
  }).observe(app, { childList: true, subtree: true });
  let resizeTimer = 0;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 100); });
  if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 60); }).observe(app);
  sheet.addEventListener('load', () => { layout(); run(); });
  const first = app.querySelector('main#main');
  if (first) first.dataset.fxSeen = '1';
  dress();
  run();
}
