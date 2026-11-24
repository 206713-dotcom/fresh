/* Quilio: live figures. Each W.<name>(root) fills one .fig element. */
(function () {
  'use strict';
  const TAU = Math.PI * 2, W = {}, kills = new Set(); let uid = 0;
  const reduce = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const INK = '#0a2440', INK2 = '#3a5673', INK3 = '#6a849d', BLUE = '#0b5fca', SUN = '#f09a2e', LINE = 'rgba(10,36,64,.14)';
  const fmt = (x, d) => (+x).toFixed(d === undefined ? 2 : d);
  const sig = (x, n) => { if (!isFinite(x)) return '–'; if (x === 0) return '0'; const s = Number(x).toPrecision(n || 3); return /e/.test(s) ? s.replace(/e\+?(-?\d+)/, ' × 10^$1') : String(+s === Math.round(+s) && Math.abs(+s) >= 100 ? Math.round(+s) : s); };
  function cv(canvas, h) { const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(260, canvas.clientWidth || canvas.parentElement.clientWidth || 600); canvas.style.height = h + 'px'; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); const g = canvas.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); return { g, w, h }; }
  // runs step(dt, t) every frame while the canvas is on screen; with reduced motion it draws once and again on poke()
  function loop(canvas, step) {
    let on = false, raf = 0, last = 0, dead = false; const still = reduce();
    const tick = t => { if (!on || dead) return; const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; step(dt, t / 1000); raf = requestAnimationFrame(tick); };
    let io = null;
    if (still || !window.IntersectionObserver) { if (still) setTimeout(() => { if (!dead) step(0.016, 0); }, 0); else { on = true; last = performance.now(); raf = requestAnimationFrame(tick); } }
    else { io = new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); } else if (!v) { on = false; cancelAnimationFrame(raf); } }); io.observe(canvas); }
    const kill = () => { dead = true; on = false; cancelAnimationFrame(raf); if (io) io.disconnect(); }; kills.add(kill);
    return { kill, poke: () => { if (still) step(0.016, performance.now() / 1000); } };
  }
  function frame(root, title, note) { root.className = 'fig'; root.innerHTML = `<div class="fig-head"><h3>${title}</h3><span class="live-dot">Live</span></div><div class="fig-body"></div>${note ? `<p class="fig-note">${note}</p>` : ''}`; return root.querySelector('.fig-body'); }
  const id = p => `w${++uid}-${p}`;
  function seg(el, cb) { el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; [...el.children].forEach(c => c.classList.toggle('is-on', c === b)); cb(b.dataset.v); }); }
  function ball(g, x, y, r, fill, stroke) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.2; g.stroke(); } }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  /* ---------- states of matter ---------- */
  W.states = function (root) {
    const body = frame(root, 'Heat the particles', 'A model of 60 particles of water. Below 0 °C they sit in a lattice and only vibrate. From 0 °C to 100 °C they still touch but slide past each other. Above 100 °C they fly apart. Sizes and speeds are not to scale.');
    const tid = id('t');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><label for="${tid}"><span>Temperature <b></b></span><input id="${tid}" type="range" min="-60" max="170" value="-30" step="1"></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 270), sl = body.querySelector('input'), out = body.querySelector('label b'), read = body.querySelector('.read');
    const N = 60, R = Math.min(8, w / 44), P = [], cols = 12, x0 = (w - (cols - 0.5) * 2.06 * R) / 2 + R * 0.5;
    for (let i = 0; i < N; i++) { const row = Math.floor(i / cols), col = i % cols, sx = x0 + col * 2.06 * R + (row % 2) * 1.03 * R, sy = h - R - 6 - row * 1.79 * R; P.push({ x: sx, y: sy, sx, sy, vx: 0, vy: 0, f1: 9 + Math.random() * 6, f2: 9 + Math.random() * 6, p1: Math.random() * TAU, p2: Math.random() * TAU }); }
    let phase = 0;
    const TXT = [['solid', 'regular lattice', 'touching', 'vibrate about fixed positions'], ['liquid', 'random', 'touching', 'slide past each other'], ['gas', 'random', 'far apart', 'move fast in all directions']];
    function ui() {
      const T = +sl.value, ph = T < 0 ? 0 : T < 100 ? 1 : 2; out.textContent = T + ' °C';
      if (ph !== phase) { if (ph === 2) P.forEach(p => { const a = Math.random() * TAU; p.vx = Math.cos(a) * 160; p.vy = Math.sin(a) * 160 - 60; }); if (ph === 1) P.forEach(p => { p.vx *= .2; p.vy *= .2; }); phase = ph; }
      const t = TXT[ph]; read.innerHTML = `<span>State</span><span class="big">${t[0]}</span><span><b>Arrangement:</b> ${t[1]}</span><span><b>Separation:</b> ${t[2]}</span><span><b>Motion:</b> ${t[3]}</span><span>Melting point 0 °C · boiling point 100 °C</span>`;
    }
    const L = loop(c, (dt, t) => {
      const T = +sl.value;
      if (phase === 0) { const A = 0.5 + (T + 60) / 60 * 1.7; for (const p of P) { const tx = p.sx + A * Math.sin(t * p.f1 + p.p1), ty = p.sy + A * Math.cos(t * p.f2 + p.p2), k = Math.min(1, dt * 7); p.x += (tx - p.x) * k; p.y += (ty - p.y) * k; } }
      else if (phase === 1) {
        const K = 260 + T * 5;
        for (const p of P) { p.vy += 620 * dt; p.vx += (Math.random() - .5) * K * dt * 8; p.vy += (Math.random() - .5) * K * dt * 8; p.vx *= .9; p.vy *= .9; p.x += p.vx * dt; p.y += p.vy * dt; }
        for (let k = 0; k < 2; k++) for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 < 4 * R * R && d2 > 0.0001) { const d = Math.sqrt(d2), o = (2 * R - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o; } }
      } else {
        const s = 150 + (T - 100) * 2.2;
        for (const p of P) { const v = Math.hypot(p.vx, p.vy) || 1; p.vx *= 1 + (s / v - 1) * .08; p.vy *= 1 + (s / v - 1) * .08; p.x += p.vx * dt; p.y += p.vy * dt; }
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 < 4 * R * R && d2 > 0.0001) { const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rel < 0) { a.vx += rel * nx; a.vy += rel * ny; b.vx -= rel * nx; b.vy -= rel * ny; } } }
      }
      for (const p of P) { if (p.x < R + 3) { p.x = R + 3; p.vx = Math.abs(p.vx); } if (p.x > w - R - 3) { p.x = w - R - 3; p.vx = -Math.abs(p.vx); } if (p.y < R + 3) { p.y = R + 3; p.vy = Math.abs(p.vy); } if (p.y > h - R - 3) { p.y = h - R - 3; p.vy = -Math.abs(p.vy) * (phase === 2 ? 1 : .2); } }
      g.clearRect(0, 0, w, h); const hot = Math.max(0, Math.min(1, (T + 60) / 230));
      for (const p of P) ball(g, p.x, p.y, R, `rgb(${Math.round(20 + hot * 215)},${Math.round(105 + hot * 30)},${Math.round(215 - hot * 170)})`, 'rgba(255,255,255,.9)');
    });
    sl.addEventListener('input', () => { ui(); L.poke(); }); ui();
  };

  /* ---------- diffusion: ammonia and hydrogen chloride ---------- */
  W.diffusion = function (root) {
    const body = frame(root, 'Which gas gets there first?', 'Both gases are at the same temperature, so their molecules have the same average kinetic energy. The lighter ammonia molecules therefore move faster. The model sets each speed in proportion to 1 ÷ √M<sub>r</sub>.');
    body.innerHTML = `<canvas></canvas><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button type="button" class="btn small" data-a="go">Release the gases</button><button type="button" class="chip" data-a="reset">Reset</button><span class="read" style="flex:1;min-width:200px"></span></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 170), read = body.querySelector('.read');
    const x1 = 56, x2 = w - 56, y1 = 58, y2 = 112, Lh = x2 - x1, vN = 1 / Math.sqrt(17), vH = 1 / Math.sqrt(36.5), meet = x1 + Lh * vN / (vN + vH), base = Lh / (9 * (vN + vH));
    let A = [], B = [], run = false, t = 0, ring = 0;
    const reset = () => { A = []; B = []; run = false; t = 0; ring = 0; read.innerHTML = 'Cotton wool soaked in <b>concentrated ammonia</b> is at the left end and in <b>concentrated hydrochloric acid</b> at the right.'; };
    const L = loop(c, dt => {
      if (run) {
        t += dt; if (A.length < 46 && Math.random() < .5) A.push({ x: x1, y: y1 + 8 + Math.random() * (y2 - y1 - 16), k: .35 + Math.random() * .65 }); if (B.length < 46 && Math.random() < .5) B.push({ x: x2, y: y1 + 8 + Math.random() * (y2 - y1 - 16), k: .35 + Math.random() * .65 });
        for (const p of A) { p.x = Math.min(meet, p.x + base * vN * p.k * dt + (Math.random() - .5) * 1.4); p.y = Math.max(y1 + 6, Math.min(y2 - 6, p.y + (Math.random() - .5) * 2.4)); }
        for (const p of B) { p.x = Math.max(meet, p.x - base * vH * p.k * dt + (Math.random() - .5) * 1.4); p.y = Math.max(y1 + 6, Math.min(y2 - 6, p.y + (Math.random() - .5) * 2.4)); }
        if (t > 9) { ring = Math.min(1, ring + dt * .5); if (ring > .3) read.innerHTML = `A white ring of <b>ammonium chloride</b> forms ${Math.round((meet - x1) / Lh * 100)}% of the way along: nearer the hydrochloric acid, because <b>ammonia (M<sub>r</sub> 17) diffuses faster</b> than hydrogen chloride (M<sub>r</sub> 36.5).`; }
      }
      g.clearRect(0, 0, w, h); rr(g, x1 - 14, y1, Lh + 28, y2 - y1, 26); g.fillStyle = '#f4faff'; g.fill(); g.strokeStyle = '#9fb4c8'; g.lineWidth = 2; g.stroke();
      ball(g, x1 - 2, (y1 + y2) / 2, 15, '#fff', '#9fb4c8'); ball(g, x2 + 2, (y1 + y2) / 2, 15, '#fff', '#9fb4c8');
      for (const p of A) ball(g, p.x, p.y, 4, '#1673dc'); for (const p of B) ball(g, p.x, p.y, 5.4, '#f09a2e');
      if (ring > 0) { g.globalAlpha = ring; rr(g, meet - 5, y1 + 2, 10, y2 - y1 - 4, 5); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#8fa3b6'; g.lineWidth = 1.5; g.stroke(); g.globalAlpha = 1; }
      g.fillStyle = INK; g.font = '500 13px Jost, sans-serif'; g.textAlign = 'left'; g.fillText('NH₃  ·  Mᵣ = 17', x1 - 14, 36); g.textAlign = 'right'; g.fillText('HCl  ·  Mᵣ = 36.5', x2 + 14, 36);
      g.fillStyle = INK3; g.font = '400 12px Jost, sans-serif'; g.textAlign = 'left'; g.fillText('ammonia', x1 - 14, 138); g.textAlign = 'right'; g.fillText('hydrogen chloride', x2 + 14, 138);
      if (ring > .3) { g.textAlign = 'center'; g.fillStyle = INK; g.fillText('white ring: NH₄Cl', meet, 138); }
    });
    body.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; if (a.dataset.a === 'go') { if (!run) { run = true; if (reduce()) { t = 10; ring = 1; for (let i = 0; i < 40; i++) { A.push({ x: x1 + Math.random() * (meet - x1), y: y1 + 8 + Math.random() * 38 }); B.push({ x: meet + Math.random() * (x2 - meet), y: y1 + 8 + Math.random() * 38 }); } } } } else reset(); L.poke(); });
    reset();
  };

  /* ---------- atom builder ---------- */
  W.atom = function (root) {
    const body = frame(root, 'Build the first twenty atoms', 'Shells are energy levels, not tracks: electrons do not really circle the nucleus like planets. Neutron numbers are for the most common isotope.');
    const zid = id('z'), iid = id('ion'), NEU = [0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20], ION = { 1: 1, 3: 1, 4: 2, 7: -3, 8: -2, 9: -1, 11: 1, 12: 2, 13: 3, 15: -3, 16: -2, 17: -1, 19: 1, 20: 2 };
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><label for="${zid}"><span>Proton number <b></b></span><input id="${zid}" type="range" min="1" max="20" value="11" step="1"></label><label for="${iid}" style="display:flex;gap:8px;align-items:center"><input id="${iid}" type="checkbox"> <span class="ion-l">show its ion</span></label><dl class="dl"></dl></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 320), sl = body.querySelector('#' + zid), cb = body.querySelector('#' + iid), dl = body.querySelector('dl'), out = body.querySelector('label b'), il = body.querySelector('.ion-l');
    let sh = [], z = 11, q = 0; const sup = n => (Math.abs(n) > 1 ? Math.abs(n) : '') + (n > 0 ? '+' : '−');
    function ui() {
      z = +sl.value; const e = PT.EL[z - 1], ion = ION[z]; cb.disabled = !ion; if (!ion) cb.checked = false; q = cb.checked ? ion : 0; il.textContent = ion ? `show its ion, ${e.sym}${sup(ion).replace('+', '⁺').replace('−', '⁻').replace('2', '²').replace('3', '³')}` : 'no simple ion';
      const ne = z - q, cap = [2, 8, 8, 2]; sh = []; let n = ne; for (const k of cap) { if (n <= 0) break; sh.push(Math.min(k, n)); n -= k; }
      const base = PT.shells(z); out.textContent = z;
      dl.innerHTML = [['Element', `${e.name}, ${e.sym}`], ['Protons', z], ['Neutrons', NEU[z - 1]], ['Electrons', ne], ['Nucleon number', z + NEU[z - 1]], ['Electronic configuration', sh.length ? sh.join(',') : 'no electrons'], ['Period', `${e.period} <small>(${base.length} occupied shell${base.length > 1 ? 's' : ''} in the atom)</small>`], ['Group', z === 1 ? 'placed on its own' : z === 2 || e.group === 18 ? 'VIII <small>(full outer shell)</small>' : `${['', 'I', 'II'][e.group] || { 13: 'III', 14: 'IV', 15: 'V', 16: 'VI', 17: 'VII' }[e.group]} <small>(${base[base.length - 1]} outer electron${base[base.length - 1] > 1 ? 's' : ''} in the atom)</small>`], ['Charge', q ? `${Math.abs(q)}${q > 0 ? '+' : '−'} <small>(${q > 0 ? 'lost' : 'gained'} ${Math.abs(q)} electron${Math.abs(q) > 1 ? 's' : ''})</small>` : '0, neutral']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    }
    const L = loop(c, (dt, t) => {
      g.clearRect(0, 0, w, h); const cx = w / 2, cy = h / 2, step = Math.min(34, (Math.min(w, h) / 2 - 30) / 4), r0 = 26;
      for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(cx, cy, r0 + step * (i + 1), 0, TAU); g.strokeStyle = i < sh.length ? 'rgba(11,95,202,.45)' : 'rgba(10,36,64,.08)'; g.lineWidth = 1.4; g.setLineDash(i < sh.length ? [] : [3, 5]); g.stroke(); } g.setLineDash([]);
      const grd = g.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, r0); grd.addColorStop(0, '#ffc777'); grd.addColorStop(1, '#e8801a'); ball(g, cx, cy, r0, grd);
      g.fillStyle = '#fff'; g.font = '600 12px Jost, sans-serif'; g.textAlign = 'center'; g.fillText(z + ' p', cx, cy - 2); g.fillText(NEU[z - 1] + ' n', cx, cy + 12);
      sh.forEach((n, i) => { const r = r0 + step * (i + 1), w0 = t * (0.5 - i * 0.09) * (i % 2 ? -1 : 1); for (let k = 0; k < n; k++) { const a = w0 + k / n * TAU; ball(g, cx + r * Math.cos(a), cy + r * Math.sin(a), 5.5, '#0b5fca', '#fff'); } });
    });
    sl.addEventListener('input', () => { ui(); L.poke(); }); cb.addEventListener('change', () => { ui(); L.poke(); }); ui();
  };

  /* ---------- electrolysis ---------- */
  W.electrolysis = function (root) {
    const H2 = { p: 'hydrogen', obs: 'bubbles of colourless gas', eq: '2H⁺ + 2e⁻ → H₂', kind: 'gas', col: 'rgba(255,255,255,.95)' }, O2 = { p: 'oxygen', obs: 'bubbles of colourless gas', eq: '4OH⁻ → O₂ + 2H₂O + 4e⁻', kind: 'gas', col: 'rgba(255,255,255,.95)' }, CU = { p: 'copper', obs: 'a pink-brown solid coats the cathode', eq: 'Cu²⁺ + 2e⁻ → Cu', kind: 'metal', col: '#c9743c' };
    const CELLS = [
      { name: 'Molten lead(II) bromide', el: 'inert electrodes', liq: '#f6e9c6', ions: [['Pb²⁺', 1, 1], ['Br⁻', -1, 1]], cat: { p: 'lead', obs: 'grey molten metal collects below the cathode', eq: 'Pb²⁺ + 2e⁻ → Pb', kind: 'drop', col: '#8793a3' }, an: { p: 'bromine', obs: 'red-brown gas bubbles off', eq: '2Br⁻ → Br₂ + 2e⁻', kind: 'gas', col: 'rgba(176,74,32,.9)' }, why: 'A molten binary compound contains only two kinds of ion. The metal forms at the cathode and the non-metal at the anode.' },
      { name: 'Concentrated aqueous sodium chloride', el: 'inert electrodes', liq: '#e6f3ff', ions: [['H⁺', 1, 1], ['Na⁺', 1, 0], ['Cl⁻', -1, 1], ['OH⁻', -1, 0]], cat: H2, an: { p: 'chlorine', obs: 'bubbles of pale yellow-green gas', eq: '2Cl⁻ → Cl₂ + 2e⁻', kind: 'gas', col: 'rgba(196,214,92,.95)' }, why: 'Sodium is more reactive than hydrogen, so hydrogen forms at the cathode. The solution is concentrated, so chloride ions are discharged and chlorine forms at the anode. Sodium hydroxide solution is left behind.' },
      { name: 'Dilute aqueous sodium chloride', el: 'inert electrodes', liq: '#eef7ff', ions: [['H⁺', 1, 1], ['Na⁺', 1, 0], ['Cl⁻', -1, 0], ['OH⁻', -1, 1]], cat: H2, an: O2, why: 'In a dilute solution of a halide, hydroxide ions from the water are discharged instead of the halide ions, so oxygen forms at the anode.' },
      { name: 'Dilute sulfuric acid', el: 'inert electrodes', liq: '#eef7ff', ions: [['H⁺', 1, 1], ['SO₄²⁻', -1, 0], ['OH⁻', -1, 1]], cat: H2, an: O2, why: 'Hydrogen ions are discharged at the cathode. Sulfate ions stay in solution: hydroxide ions from the water are discharged, giving oxygen. Two volumes of hydrogen form for every one volume of oxygen.' },
      { name: 'Aqueous copper(II) sulfate', el: 'inert (graphite) electrodes', liq: '#bcdcff', ions: [['Cu²⁺', 1, 1], ['H⁺', 1, 0], ['SO₄²⁻', -1, 0], ['OH⁻', -1, 1]], cat: CU, an: O2, why: 'Copper is less reactive than hydrogen, so copper is deposited on the cathode. Oxygen forms at the anode. The blue colour of the solution fades as copper(II) ions are removed.' },
      { name: 'Aqueous copper(II) sulfate', el: 'copper electrodes', liq: '#bcdcff', ions: [['Cu²⁺', 1, 1], ['SO₄²⁻', -1, 0]], cat: CU, an: { p: 'copper(II) ions', obs: 'the copper anode dissolves and loses mass', eq: 'Cu → Cu²⁺ + 2e⁻', kind: 'dissolve', col: '#c9743c' }, why: 'The anode is not inert. Its copper atoms lose electrons and go into solution as ions, while copper is deposited on the cathode. The blue colour does not change. This is how copper is refined.' },
    ];
    const body = frame(root, 'Predict the products of electrolysis', 'Cations are drawn blue and move to the cathode. Anions are drawn orange and move to the anode. An ion that is discharged disappears at the electrode; an ion that is not discharged stays in the liquid.');
    const sid = id('cell');
    body.innerHTML = `<div class="ctl"><label for="${sid}"><span>Electrolyte and electrodes</span><select id="${sid}">${CELLS.map((c, i) => `<option value="${i}">${c.name}, ${c.el}</option>`).join('')}</select></label></div><div class="fig-split"><canvas></canvas><div class="ctl"><dl class="dl"></dl><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), sel = body.querySelector('select'), dl = body.querySelector('dl'), read = body.querySelector('.read');
    const ax = w * .28, kx = w * .72, top = 96, bot = 262, lx1 = w * .1, lx2 = w * .9; let cell, I = [], FX = [], dep = 0, pool = 0;
    function set(i) {
      cell = CELLS[i]; I = []; FX = []; dep = 0; pool = 0;
      cell.ions.forEach(([s, q, d]) => { for (let k = 0; k < 4; k++) I.push({ s, q, d, x: ax + 30 + Math.random() * (kx - ax - 60), y: top + 40 + Math.random() * (bot - top - 60), ph: Math.random() * TAU }); });
      dl.innerHTML = [['Cathode (−)', `<b>${cell.cat.p}</b>: ${cell.cat.obs}`], ['Half-equation', `${cell.cat.eq} <small>(reduction)</small>`], ['Anode (+)', `<b>${cell.an.p}</b>: ${cell.an.obs}`], ['Half-equation', `${cell.an.eq} <small>(oxidation)</small>`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); read.innerHTML = `<b>Why?</b> ${cell.why}`;
    }
    const L = loop(c, (dt, t) => {
      for (const p of I) {
        const tx = p.q > 0 ? kx - 20 : ax + 20, dir = Math.sign(tx - p.x), near = Math.abs(tx - p.x) < 8;
        if (!near) p.x += dir * 30 * dt; else if (p.d) { const E = p.q > 0 ? cell.cat : cell.an, ex = p.q > 0 ? kx : ax; if (E.kind === 'gas') FX.push({ x: ex + (p.q > 0 ? -11 : 11), y: p.y, r: 3 + Math.random() * 3, col: E.col, k: 'gas' }); else if (E.kind === 'drop') FX.push({ x: ex - 12, y: p.y, r: 4, col: E.col, k: 'drop' }); else if (E.kind === 'metal') dep = Math.min(9, dep + .25); p.x = (ax + kx) / 2 + (Math.random() - .5) * 60; p.y = top + 40 + Math.random() * (bot - top - 60); if (cell.an.kind === 'dissolve' && p.q > 0) { p.x = ax + 24; } } else p.x += Math.sin(t * 2 + p.ph) * 12 * dt - dir * 4 * dt;
        p.y += Math.sin(t * 1.7 + p.ph) * 9 * dt; p.y = Math.max(top + 30, Math.min(bot - 16, p.y));
      }
      FX = FX.filter(f => { if (f.k === 'gas') { f.y -= 46 * dt; f.x += Math.sin(t * 6 + f.y) * .3; return f.y > top + 12; } f.y += 60 * dt; if (f.y > bot - 8) { pool = Math.min(1, pool + .04); return false; } return true; });
      g.clearRect(0, 0, w, h);
      // liquid and beaker
      rr(g, lx1, top + 14, lx2 - lx1, bot - top - 14, 14); g.fillStyle = cell.liq; g.fill(); g.strokeStyle = '#9fb4c8'; g.lineWidth = 2; g.beginPath(); g.moveTo(lx1, top - 6); g.lineTo(lx1, bot - 14); g.arcTo(lx1, bot, lx1 + 14, bot, 14); g.lineTo(lx2 - 14, bot); g.arcTo(lx2, bot, lx2, bot - 14, 14); g.lineTo(lx2, top - 6); g.stroke();
      if (pool > 0) { g.fillStyle = cell.cat.col; g.beginPath(); g.ellipse(kx - 12, bot - 5, 16 + pool * 26, 3 + pool * 5, 0, 0, TAU); g.fill(); }
      // wires, supply, electrons
      g.strokeStyle = INK2; g.lineWidth = 2; g.beginPath(); g.moveTo(ax, top - 20); g.lineTo(ax, 34); g.lineTo(w / 2 - 34, 34); g.moveTo(w / 2 + 34, 34); g.lineTo(kx, 34); g.lineTo(kx, top - 20); g.stroke();
      rr(g, w / 2 - 34, 18, 68, 32, 8); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = INK2; g.stroke(); g.fillStyle = INK; g.font = '500 13px Jost, sans-serif'; g.textAlign = 'center'; g.fillText('+  d.c.  −', w / 2, 39);
      const path = [[ax, top - 20], [ax, 34], [w / 2 - 34, 34]], path2 = [[w / 2 + 34, 34], [kx, 34], [kx, top - 20]], along = (pts, u) => { const d1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), d2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), s = u * (d1 + d2); return s < d1 ? [pts[0][0] + (pts[1][0] - pts[0][0]) * s / d1, pts[0][1] + (pts[1][1] - pts[0][1]) * s / d1] : [pts[1][0] + (pts[2][0] - pts[1][0]) * (s - d1) / d2, pts[1][1] + (pts[2][1] - pts[1][1]) * (s - d1) / d2]; };
      for (let k = 0; k < 4; k++) { const u = (t * .25 + k / 4) % 1; let q = along(path, u); ball(g, q[0], q[1], 3.2, SUN); q = along(path2, u); ball(g, q[0], q[1], 3.2, SUN); }
      g.fillStyle = INK3; g.font = '400 11.5px Jost, sans-serif'; g.fillText('electrons →', (ax + w / 2 - 34) / 2, 26); g.fillText('electrons →', (kx + w / 2 + 34) / 2, 26);
      // electrodes
      const copper = cell.el === 'copper electrodes'; g.fillStyle = copper ? '#c9743c' : '#4a5563'; rr(g, ax - (copper ? 7 - pool : 7), top - 22, copper ? 14 - Math.min(5, dep * .5) : 14, bot - top - 4, 3); g.fill(); g.fillStyle = copper ? '#c9743c' : '#4a5563'; rr(g, kx - 7, top - 22, 14, bot - top - 4, 3); g.fill();
      if (dep > 0) { g.fillStyle = '#c9743c'; rr(g, kx - 7 - dep, top + 16, 14 + dep * 2, bot - top - 44, 4); g.fill(); }
      for (const f of FX) { ball(g, f.x, f.y, f.r, f.col, f.k === 'gas' ? 'rgba(10,36,64,.35)' : null); }
      for (const p of I) { ball(g, p.x, p.y, 14, p.q > 0 ? '#1673dc' : '#f09a2e', '#fff'); g.fillStyle = '#fff'; g.font = '600 11px Jost, sans-serif'; g.textAlign = 'center'; g.fillText(p.s, p.x, p.y + 4); }
      g.fillStyle = INK; g.font = '500 13px Jost, sans-serif'; g.fillText('anode (+)', ax, bot + 22); g.fillText('cathode (−)', kx, bot + 22);
      g.fillStyle = INK2; g.font = '400 12.5px Jost, sans-serif'; g.textAlign = 'right'; g.fillText(cell.an.p, ax - 13, top - 12); g.textAlign = 'left'; g.fillText(cell.cat.p, kx + 13, top - 12); g.textAlign = 'center';
    });
    sel.addEventListener('change', () => { set(+sel.value); L.poke(); }); set(0);
  };

  /* ---------- reaction pathway diagram ---------- */
  W.profile = function (root) {
    const body = frame(root, 'Draw the reaction pathway diagram', 'Energies are in kJ/mol and chosen for a clear picture. A catalyst gives the reaction a different route with a lower activation energy. It does not change the energy of the reactants or the products, so ΔH stays the same.');
    const eid = id('ea'), cid = id('cat');
    body.innerHTML = `<div class="svgbox"></div><div class="fig-split"><div class="ctl"><div class="seg" role="group" aria-label="Type of reaction" style="justify-self:start"><button type="button" class="is-on" data-v="exo">Exothermic</button><button type="button" data-v="endo">Endothermic</button></div><label for="${eid}"><span>Activation energy, Eₐ <b></b></span><input id="${eid}" type="range" min="30" max="140" value="80" step="5"></label><label for="${cid}" style="display:flex;gap:8px;align-items:center"><input id="${cid}" type="checkbox"> <span>add a catalyst</span></label></div><div class="read"></div></div>`;
    const box = body.querySelector('.svgbox'), sl = body.querySelector('#' + eid), cb = body.querySelector('#' + cid), read = body.querySelector('.read'), out = body.querySelector('label b'); let type = 'exo';
    function draw() {
      const Ea = +sl.value, R = type === 'exo' ? 110 : 50, P = type === 'exo' ? 50 : 110, dH = P - R, Y = E => 268 - E * .95, yR = Y(R), yP = Y(P), pk = Math.max(R + Ea, P + 12), yK = Y(pk), pc = Math.max(R + Ea * .55, P + 8), yC = Y(pc);
      const path = y => `M52 ${yR} L150 ${yR} C215 ${yR} 222 ${y} 262 ${y} C302 ${y} 309 ${yP} 374 ${yP} L500 ${yP}`; out.textContent = Ea + ' kJ/mol';
      box.innerHTML = `<svg viewBox="0 0 540 300" style="width:100%;max-width:600px;height:auto" role="img" aria-label="Reaction pathway diagram" font-family="Jost, sans-serif"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="${INK}"/></marker></defs>
        <path d="M40 16V280H520" fill="none" stroke="${INK}" stroke-width="1.6" marker-start="url(#ah)" marker-end="url(#ah)"/><text x="18" y="150" transform="rotate(-90 18 150)" text-anchor="middle" font-size="13" fill="${INK2}">energy</text><text x="280" y="297" text-anchor="middle" font-size="13" fill="${INK2}">progress of reaction</text>
        <path d="M150 ${yR}H470" stroke="${INK3}" stroke-dasharray="4 5" fill="none"/>
        ${cb.checked ? `<path d="${path(yC)}" fill="none" stroke="${SUN}" stroke-width="2.4" stroke-dasharray="7 5"/><text x="178" y="${yC - 2}" text-anchor="end" font-size="12.5" fill="#a85d00">with catalyst</text><path d="M182 ${yC - 6}H222" stroke="#a85d00" stroke-width="1"/>` : ''}
        <path d="${path(yK)}" fill="none" stroke="${BLUE}" stroke-width="3"/>
        <text x="100" y="${yR - 9}" text-anchor="middle" font-size="14" font-weight="500" fill="${INK}">reactants</text><text x="440" y="${yP + (type === 'exo' ? 20 : -9)}" text-anchor="middle" font-size="14" font-weight="500" fill="${INK}">products</text>
        <path d="M262 ${yR - 3}V${yK + 5}" stroke="${INK}" stroke-width="1.5" marker-end="url(#ah)"/><text x="270" y="${(yR + yK) / 2 + 4}" font-size="13.5" fill="${INK}">Eₐ</text>
        <path d="M470 ${yR + (dH < 0 ? 3 : -3)}V${yP + (dH < 0 ? -6 : 6)}" stroke="${INK}" stroke-width="1.5" marker-end="url(#ah)"/><text x="478" y="${(yR + yP) / 2 + 4}" font-size="13.5" fill="${INK}">ΔH</text></svg>`;
      read.innerHTML = type === 'exo' ? `<span class="big">ΔH = −${-dH} kJ/mol</span><span><b>Exothermic:</b> the products have less energy than the reactants. Thermal energy is transferred to the surroundings, so their temperature rises.</span><span>More energy is released making bonds than is taken in breaking bonds.</span>` : `<span class="big">ΔH = +${dH} kJ/mol</span><span><b>Endothermic:</b> the products have more energy than the reactants. Thermal energy is taken in from the surroundings, so their temperature falls.</span><span>More energy is taken in breaking bonds than is released making bonds.</span>`;
    }
    seg(body.querySelector('.seg'), v => { type = v; draw(); }); sl.addEventListener('input', draw); cb.addEventListener('change', draw); draw();
  };

  /* ---------- rate of reaction ---------- */
  W.rate = function (root) {
    const body = frame(root, 'Change the conditions, watch the curve', 'Calcium carbonate with excess dilute hydrochloric acid. The carbonate is used up, so the final volume of gas never changes: only how quickly you reach it. The model doubles the rate for every 10 °C and makes it proportional to concentration, which real reactions follow only roughly.');
    const tid = id('t'), cid = id('c');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><label for="${tid}"><span>Temperature <b></b></span><input id="${tid}" type="range" min="20" max="60" value="20" step="5"></label><label for="${cid}"><span>Acid concentration <b></b></span><input id="${cid}" type="range" min="0.5" max="2" value="1" step="0.25"></label><div class="seg" role="group" aria-label="Surface area"><button type="button" class="is-on" data-v="1">Large lumps</button><button type="button" data-v="3">Powder</button></div><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), ts = body.querySelector('#' + tid), cs = body.querySelector('#' + cid), read = body.querySelector('.read'), outs = body.querySelectorAll('label b'); let area = 1;
    const X = t => 52 + t / 120 * (w - 72), Y = v => h - 40 - v / 100 * (h - 62), V = 80, k0 = .028;
    function draw() {
      const T = +ts.value, C = +cs.value, k = k0 * Math.pow(2, (T - 20) / 10) * C * area; outs[0].textContent = T + ' °C'; outs[1].textContent = fmt(C) + ' mol/dm³';
      g.clearRect(0, 0, w, h); g.strokeStyle = LINE; g.lineWidth = 1; g.font = '400 11.5px Jost, sans-serif'; g.fillStyle = INK3; g.textAlign = 'right';
      for (let v = 0; v <= 100; v += 20) { g.beginPath(); g.moveTo(X(0), Y(v)); g.lineTo(X(120), Y(v)); g.stroke(); g.fillText(v, X(0) - 6, Y(v) + 4); } g.textAlign = 'center'; for (let t = 0; t <= 120; t += 20) { g.beginPath(); g.moveTo(X(t), Y(0)); g.lineTo(X(t), Y(100)); g.stroke(); g.fillText(t, X(t), Y(0) + 15); }
      g.fillStyle = INK2; g.fillText('time / s', X(60), h - 6); g.save(); g.translate(13, Y(50)); g.rotate(-Math.PI / 2); g.fillText('volume of CO₂ / cm³', 0, 0); g.restore();
      const curve = (kk, col, dash, lw) => { g.beginPath(); for (let t = 0; t <= 120; t += 1) { const y = Y(V * (1 - Math.exp(-kk * t))); t ? g.lineTo(X(t), y) : g.moveTo(X(t), y); } g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash); g.stroke(); g.setLineDash([]); };
      curve(k0, INK3, [5, 5], 2); curve(k, BLUE, [], 3);
      const tt = Math.min(120, 26 / (V * k) * 1); g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(tt), Y(V * k * tt)); g.strokeStyle = SUN; g.lineWidth = 2; g.stroke();
      g.textAlign = 'left'; g.fillStyle = INK3; g.fillText('- - 20 °C, 1.00 mol/dm³, lumps', X(54), Y(12)); g.fillStyle = BLUE; g.fillText('— your conditions', X(54), Y(5)); g.fillStyle = '#a85d00'; g.fillText('tangent at t = 0', X(tt) + 5, Y(V * k * tt) + 3);
      const why = []; if (T > 20) why.push('<b>Hotter:</b> particles have more kinetic energy, so they collide more often and more of the collisions have energy of at least Eₐ.'); if (C > 1) why.push('<b>More concentrated:</b> more acid particles per unit volume, so collisions are more frequent.'); if (C < 1) why.push('<b>More dilute:</b> fewer acid particles per unit volume, so collisions are less frequent.'); if (area > 1) why.push('<b>Powder:</b> a larger surface area is exposed, so more collisions happen each second.');
      read.innerHTML = `<span>Initial rate</span><span class="big">${sig(V * k, 2)} cm³/s</span><span>${sig(k / k0, 2)} × the rate of the dashed curve. Final volume: ${V} cm³ either way.</span>${why.map(s => `<span>${s}</span>`).join('') || '<span>Move a control: the curve gets steeper, but it levels off at the same height.</span>'}`;
    }
    ts.addEventListener('input', draw); cs.addEventListener('input', draw); seg(body.querySelector('.seg'), v => { area = +v; draw(); }); draw();
  };

  /* ---------- pH scale ---------- */
  W.ph = function (root) {
    const UI = ['#e0262b', '#e63b2a', '#ee5a24', '#f47f20', '#f8a51d', '#f6c81c', '#d9d425', '#3fa648', '#2a9d7a', '#2389b8', '#2a6bc4', '#3a51b8', '#4b3fa8', '#5a3296', '#63287f'];
    const EX = ['1 mol/dm³ hydrochloric acid', 'stomach acid', 'lemon juice', 'vinegar', 'tomato juice', 'black coffee', 'milk', 'pure water', 'sea water', 'baking soda solution', 'milk of magnesia', 'household ammonia', 'limewater', 'oven cleaner', '1 mol/dm³ sodium hydroxide'];
    const body = frame(root, 'Slide along the pH scale', 'Universal indicator shows a range of colours, so it tells you how acidic or alkaline a solution is. The other three indicators have only two colours each and change over a narrow range of pH, which is why they are used to find the end-point of a titration.');
    const pid = id('ph');
    body.innerHTML = `<div class="fig-split"><div class="ctl"><div class="swatch"></div><label for="${pid}"><span>pH <b></b></span><input id="${pid}" type="range" min="0" max="14" value="7" step="1"></label><div class="ind"><div><i></i><b>litmus</b><span></span></div><div><i></i><b>methyl orange</b><span></span></div><div><i></i><b>thymolphthalein</b><span></span></div></div></div><div class="read"></div></div>`;
    const sl = body.querySelector('input'), sw = body.querySelector('.swatch'), read = body.querySelector('.read'), out = body.querySelector('label b'), ind = [...body.querySelectorAll('.ind div')];
    function ui() {
      const p = +sl.value; out.textContent = p; sw.style.background = UI[p];
      const kind = p <= 2 ? 'strongly acidic' : p <= 6 ? 'weakly acidic' : p === 7 ? 'neutral' : p <= 11 ? 'weakly alkaline' : 'strongly alkaline';
      const lit = p <= 5 ? ['#d8343a', 'red'] : p <= 8 ? ['#8b5aa8', 'purple'] : ['#2a5fc4', 'blue'], mo = p <= 3 ? ['#e23b30', 'red'] : p === 4 ? ['#f08a24', 'orange'] : ['#f5cf2a', 'yellow'], th = p <= 9 ? ['#f7fafc', 'colourless'] : ['#2f6fd0', 'blue'];
      [lit, mo, th].forEach((v, i) => { ind[i].querySelector('i').style.background = v[0]; ind[i].querySelector('span').textContent = v[1]; });
      read.innerHTML = `<span>Universal indicator at pH ${p}</span><span class="big">${kind}</span><span><b>Example:</b> ${EX[p]}</span><span>${p < 7 ? 'Acidic: the solution contains more H⁺ ions than OH⁻ ions. The lower the pH, the higher the concentration of H⁺ ions.' : p > 7 ? 'Alkaline: the solution contains more OH⁻ ions than H⁺ ions. The higher the pH, the more alkaline it is.' : 'Neutral: the concentrations of H⁺ ions and OH⁻ ions are equal.'}</span>`;
    }
    sl.addEventListener('input', ui); ui();
  };

  /* ---------- reactivity series ---------- */
  W.reactivity = function (root) {
    const M = [
      ['K', 'potassium', 'K⁺', 'Reacts violently with cold water: it melts, darts about and burns with a lilac flame, forming potassium hydroxide and hydrogen.', 'Far too violent to try with dilute acid.', 'electrolysis'],
      ['Na', 'sodium', 'Na⁺', 'Reacts quickly with cold water: it melts into a ball and fizzes across the surface, forming sodium hydroxide and hydrogen.', 'Far too violent to try with dilute acid.', 'electrolysis'],
      ['Ca', 'calcium', 'Ca²⁺', 'Fizzes steadily in cold water, forming calcium hydroxide and hydrogen.', 'Very vigorous with dilute hydrochloric acid.', 'electrolysis'],
      ['Mg', 'magnesium', 'Mg²⁺', 'Hardly reacts with cold water, but burns in steam with a bright white light, forming magnesium oxide and hydrogen.', 'Rapid fizzing with dilute hydrochloric acid: magnesium chloride and hydrogen form.', 'electrolysis'],
      ['Al', 'aluminium', 'Al³⁺', 'Seems unreactive because a thin, tough layer of aluminium oxide sticks to its surface and protects it.', 'Slow at first with dilute hydrochloric acid, until the oxide layer is removed.', 'electrolysis of aluminium oxide in molten cryolite'],
      ['C', 'carbon', '', 'Not a metal. It is placed here because it can take the oxygen from the oxides of the metals below it.', '', ''],
      ['Zn', 'zinc', 'Zn²⁺', 'No reaction with cold water. Reacts with steam to form zinc oxide and hydrogen.', 'Steady fizzing with dilute hydrochloric acid.', 'heating the oxide with carbon'],
      ['Fe', 'iron', 'Fe²⁺', 'Rusts slowly in water and air. Reacts with steam.', 'Slow fizzing with dilute hydrochloric acid.', 'reduction of iron(III) oxide by carbon monoxide in the blast furnace'],
      ['H', 'hydrogen', '', 'Not a metal. Metals above hydrogen react with dilute acids to give hydrogen; metals below it do not.', '', ''],
      ['Cu', 'copper', 'Cu²⁺', 'No reaction with cold water or steam.', 'No reaction with dilute hydrochloric acid.', 'heating the oxide with carbon'],
      ['Ag', 'silver', 'Ag⁺', 'No reaction with cold water or steam.', 'No reaction with dilute hydrochloric acid.', 'found native (as the metal)'],
      ['Au', 'gold', '', 'No reaction with cold water or steam.', 'No reaction with dilute hydrochloric acid.', 'found native (as the metal)'],
    ];
    const body = frame(root, 'The reactivity series, most reactive first', 'A metal high in the series loses electrons to form positive ions more readily than a metal below it. That single idea explains every row here.');
    const mid = id('m'), iid = id('i'), metals = M.filter(m => m[5] !== ''), ions = M.filter(m => ['Mg', 'Zn', 'Fe', 'Cu', 'Ag'].includes(m[0]));
    body.innerHTML = `<div class="fig-split"><div class="ladder">${M.map((m, i) => `<button type="button" class="${m[5] === '' ? 'ref' : ''}" data-i="${i}"><b>${m[0]}</b><span>${m[1]}</span><i>${i === 0 ? 'most reactive' : i === M.length - 1 ? 'least reactive' : ''}</i></button>`).join('')}</div><div class="ctl"><dl class="dl"></dl><div class="read"><b>Will it displace?</b><label for="${mid}">Metal added<select id="${mid}">${metals.map(m => `<option>${m[1]}</option>`).join('')}</select></label><label for="${iid}">to a solution containing<select id="${iid}">${ions.map(m => `<option value="${m[1]}">${m[1]} ions, ${m[2]}</option>`).join('')}</select></label><span class="eqn"></span></div></div></div>`;
    const dl = body.querySelector('dl'), ms = body.querySelector('#' + mid), is = body.querySelector('#' + iid), eq = body.querySelector('.eqn'), btn = [...body.querySelectorAll('.ladder button')];
    function show(i) { const m = M[i]; btn.forEach((b, k) => b.classList.toggle('is-on', k === i)); dl.innerHTML = (m[5] === '' ? [[m[1], m[3]]] : [['Metal', `${m[1]}, ${m[0]}`], ['Water or steam', m[3]], ['Dilute acid', m[4]], ['How it is obtained', m[5]]]).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); }
    function disp() { const a = M.findIndex(m => m[1] === ms.value), b = M.findIndex(m => m[1] === is.value); eq.innerHTML = a === b ? 'Same metal: nothing changes.' : a < b ? `<b>Yes.</b> ${ms.value[0].toUpperCase() + ms.value.slice(1)} is more reactive than ${is.value}, so it forms positive ions more readily: ${ms.value} displaces ${is.value} from the solution, and ${is.value} metal is deposited.` : `<b>No reaction.</b> ${ms.value[0].toUpperCase() + ms.value.slice(1)} is less reactive than ${is.value}, so it cannot displace it.`; }
    body.querySelector('.ladder').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); }); ms.addEventListener('change', disp); is.addEventListener('change', disp); ms.value = 'zinc'; is.value = 'copper'; show(3); disp();
  };

  /* ---------- tests for ions and gases ---------- */
  W.iontests = function (root) {
    const FL = [['Li⁺', 'lithium', 'red', '#e0283c'], ['Na⁺', 'sodium', 'yellow', '#ffc61a'], ['K⁺', 'potassium', 'lilac', '#b78ce6'], ['Ca²⁺', 'calcium', 'orange-red', '#f0642a'], ['Ba²⁺', 'barium', 'light green', '#a5dc6e'], ['Cu²⁺', 'copper(II)', 'blue-green', '#22b8a0']];
    const CAT = [
      ['Al³⁺', 'aluminium', 'white ppt., soluble in excess, giving a colourless solution', 'white ppt., insoluble in excess', '#f4f6f8', 0, '#f4f6f8', 1],
      ['NH₄⁺', 'ammonium', 'ammonia produced on warming', 'no test with aqueous ammonia', null, 0, null, 0],
      ['Ca²⁺', 'calcium', 'white ppt., insoluble in excess', 'no ppt. or very slight white ppt.', '#f4f6f8', 1, null, 0],
      ['Cr³⁺', 'chromium(III)', 'green ppt., soluble in excess', 'green ppt., insoluble in excess', '#5f9a6a', 0, '#5f9a6a', 1, null, '#a9d2ad'],
      ['Cu²⁺', 'copper(II)', 'light blue ppt., insoluble in excess', 'light blue ppt., soluble in excess, giving a dark blue solution', '#7fc4ee', 1, '#7fc4ee', 0, '#1f3fa8'],
      ['Fe²⁺', 'iron(II)', 'green ppt., insoluble in excess; turns brown near the surface on standing', 'green ppt., insoluble in excess; turns brown near the surface on standing', '#6f9c5c', 1, '#6f9c5c', 1],
      ['Fe³⁺', 'iron(III)', 'red-brown ppt., insoluble in excess', 'red-brown ppt., insoluble in excess', '#9a4a22', 1, '#9a4a22', 1],
      ['Zn²⁺', 'zinc', 'white ppt., soluble in excess, giving a colourless solution', 'white ppt., soluble in excess, giving a colourless solution', '#f4f6f8', 0, '#f4f6f8', 0],
    ];
    const AN = [['carbonate, CO₃²⁻', 'add dilute acid, then test for carbon dioxide gas', 'effervescence; carbon dioxide produced'], ['chloride, Cl⁻', 'acidify with dilute nitric acid, then add aqueous silver nitrate', 'white ppt.'], ['bromide, Br⁻', 'acidify with dilute nitric acid, then add aqueous silver nitrate', 'cream ppt.'], ['iodide, I⁻', 'acidify with dilute nitric acid, then add aqueous silver nitrate', 'yellow ppt.'], ['nitrate, NO₃⁻', 'add aqueous sodium hydroxide, then aluminium foil; warm carefully', 'ammonia produced'], ['sulfate, SO₄²⁻', 'acidify with dilute nitric acid, then add aqueous barium nitrate', 'white ppt.'], ['sulfite, SO₃²⁻', 'add a small volume of acidified aqueous potassium manganate(VII)', 'the solution changes from purple to colourless']];
    const GAS = [['ammonia, NH₃', 'damp red litmus paper', 'turns the paper blue'], ['carbon dioxide, CO₂', 'limewater', 'turns the limewater milky'], ['chlorine, Cl₂', 'damp litmus paper', 'bleaches the paper'], ['hydrogen, H₂', 'a lighted splint', 'burns with a ‘pop’'], ['oxygen, O₂', 'a glowing splint', 'relights the splint'], ['sulfur dioxide, SO₂', 'acidified aqueous potassium manganate(VII)', 'turns it from purple to colourless']];
    const body = frame(root, 'Tests for ions and gases', 'The wording of every test and result follows the Cambridge notes for use in qualitative analysis. “ppt.” means precipitate.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Kind of test"><button type="button" class="is-on" data-v="flame">Flame tests</button><button type="button" data-v="cat">Cations</button><button type="button" data-v="an">Anions</button><button type="button" data-v="gas">Gases</button></div><div class="pane"></div>`;
    const pane = body.querySelector('.pane');
    const tube = (ppt, stays, sol) => `<div class="tube" style="--ppt:${ppt && stays ? ppt : 'transparent'};--ph:${ppt && stays ? '34%' : '0%'};--sol:${sol || (ppt && !stays ? '#f3f8fd' : '#eaf4ff')}"><i></i><u></u></div>`;
    const table = rows => `<div class="tb-wrap"><table style="border-collapse:collapse;width:100%;font-size:14.5px"><thead><tr>${rows[0].map(c => `<th style="text-align:left;padding:9px 12px;background:var(--tint);font-weight:500">${c}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r => `<tr>${r.map((c, i) => `<td style="padding:9px 12px;border-top:1px solid var(--line-2);${i ? '' : 'font-weight:500'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    function show(v) {
      if (v === 'flame') {
        pane.innerHTML = `<div class="fig-split" style="margin-top:14px"><div class="flame-box"><div class="flame"></div></div><div class="ctl"><div class="seg" role="group" aria-label="Metal ion">${FL.map((f, i) => `<button type="button" data-v="${i}" class="${i ? '' : 'is-on'}">${f[0]}</button>`).join('')}</div><div class="read"></div></div></div>`;
        const fl = pane.querySelector('.flame'), rd = pane.querySelector('.read'), pick = i => { const f = FL[i]; fl.style.setProperty('--fc', f[3]); rd.innerHTML = `<span>${f[1]} ions, ${f[0]}</span><span class="big">${f[2]}</span><span>Dip a clean wire in the solid, then hold it in a blue Bunsen flame.</span>`; }; seg(pane.querySelector('.seg'), i => pick(+i)); pick(0);
      } else if (v === 'cat') {
        pane.innerHTML = `<div class="ctl" style="margin-top:14px"><div class="seg" role="group" aria-label="Cation">${CAT.map((f, i) => `<button type="button" data-v="${i}" class="${i ? '' : 'is-on'}">${f[0]}</button>`).join('')}</div><div class="tests"></div></div>`;
        const ts = pane.querySelector('.tests'), pick = i => { const f = CAT[i]; ts.innerHTML = `<div class="test">${tube(f[4], f[5], f[9])}<div><b>${f[1]} + aqueous sodium hydroxide</b>${f[2]}</div></div><div class="test">${tube(f[6], f[7], f[8])}<div><b>${f[1]} + aqueous ammonia</b>${f[3]}</div></div>`; }; seg(pane.querySelector('.seg'), i => pick(+i)); pick(0);
      } else pane.innerHTML = `<div style="margin-top:14px">${table(v === 'an' ? [['Anion', 'Test', 'Test result']].concat(AN) : [['Gas', 'Test', 'Test result']].concat(GAS))}</div>`;
    }
    seg(body.querySelector('.seg'), show); show('flame');
  };

  /* ---------- mole calculator ---------- */
  W.moles = function (root) {
    const body = frame(root, 'Mole calculator', 'Relative atomic masses are the ones on the Cambridge IGCSE Periodic Table (for example Cl = 35.5, Cu = 64). The molar gas volume is 24 dm³ at room temperature and pressure.');
    const fid = id('f'), mid = id('m'), vid = id('v'), sid = id('s');
    body.innerHTML = `<div class="fig-split"><div class="ctl"><label for="${fid}"><span>Formula</span><input id="${fid}" type="text" value="CaCO3" autocomplete="off" spellcheck="false"></label><label for="${mid}"><span>Mass of the substance / g</span><input id="${mid}" type="number" value="25" min="0" step="any"></label><label for="${vid}"><span>If it is a gas: volume at r.t.p. / dm³</span><input id="${vid}" type="number" value="" min="0" step="any" placeholder="optional"></label><label for="${sid}"><span>If it is dissolved: volume of solution / cm³</span><input id="${sid}" type="number" value="" min="0" step="any" placeholder="optional"></label></div><div class="read"></div></div>`;
    const [f, m, v, s] = ['#' + fid, '#' + mid, '#' + vid, '#' + sid].map(q => body.querySelector(q)), read = body.querySelector('.read');
    const sub = t => t.replace(/(\d+)/g, d => [...d].map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join(''));
    function ui() {
      const r = PT.mr(f.value); if (!r) { read.innerHTML = `<b>I cannot read that formula.</b><span>Type symbols with their capitals and the numbers after them, such as H2SO4, Mg(OH)2 or CuSO4.5H2O.</span>`; return; }
      const M = r.mr, parts = Object.entries(r.atoms), mass = parseFloat(m.value), n = mass / M, vol = parseFloat(v.value), sol = parseFloat(s.value), out = [];
      out.push(`<span>Relative formula mass, M<sub>r</sub></span><span class="big">${M}</span><span class="eqn">${parts.map(([e, k]) => `${k > 1 ? `(${k} × ${PT.BY[e].ar})` : PT.BY[e].ar}`).join(' + ')} = ${M}</span>`);
      out.push(`<span><b>Percentage by mass:</b> ${parts.map(([e, k]) => `${e} ${sig(k * PT.BY[e].ar / M * 100, 3)}%`).join(', ')}</span>`);
      if (mass > 0) { out.push(`<span><b>Amount:</b> n = m ÷ M = ${mass} ÷ ${M} = <b>${sig(n, 3)} mol</b></span>`); out.push(`<span><b>Number of particles:</b> ${sig(n, 3)} × 6.02 × 10²³ = <b>${sig(n * 6.02e23, 3).replace(/\^(-?\d+)/, (a, e) => [...e].map(c => c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join(''))}</b></span>`); if (sol > 0) out.push(`<span><b>Concentration:</b> ${sig(n, 3)} mol ÷ ${sig(sol / 1000, 3)} dm³ = <b>${sig(n / (sol / 1000), 3)} mol/dm³</b> (${sig(mass / (sol / 1000), 3)} g/dm³)</span>`); }
      if (vol > 0) out.push(`<span><b>From the gas volume:</b> n = V ÷ 24 = ${vol} ÷ 24 = <b>${sig(vol / 24, 3)} mol</b>, which has a mass of ${sig(vol / 24 * M, 3)} g</span>`);
      read.innerHTML = out.join(''); f.setAttribute('aria-label', 'Formula ' + sub(f.value));
    }
    [f, m, v, s].forEach(x => x.addEventListener('input', ui)); ui();
  };

  /* ---------- Boltzmann distribution ---------- */
  W.boltzmann = function (root) {
    const body = frame(root, 'The Boltzmann distribution', 'Real activation energies are far larger than the one drawn here, often 50 to 250 kJ/mol, so the real shaded fraction is tiny. Eₐ is drawn low so that you can see the area change. The area under each curve is the same: the number of particles does not change.');
    const tid = id('t'), eid = id('e'), cid = id('c');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><label for="${tid}"><span>Temperature <b></b></span><input id="${tid}" type="range" min="250" max="700" value="300" step="10"></label><label for="${eid}"><span>Activation energy, Eₐ <b></b></span><input id="${eid}" type="range" min="4" max="20" value="8" step="0.5"></label><label for="${cid}" style="display:flex;gap:8px;align-items:center"><input id="${cid}" type="checkbox"> <span>add a catalyst</span></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), ts = body.querySelector('#' + tid), es = body.querySelector('#' + eid), cb = body.querySelector('#' + cid), read = body.querySelector('.read'), outs = body.querySelectorAll('label b');
    const f = (E, T) => { const k = .008314 * T; return 2 / Math.sqrt(Math.PI) * Math.pow(k, -1.5) * Math.sqrt(E) * Math.exp(-E / k); }, frac = (Ea, T) => { let s = 0; for (let E = Ea; E < 160; E += .02) s += f(E + .01, T) * .02; return s; };
    const X = E => 44 + E / 30 * (w - 60), Y = v => h - 38 - v / .25 * (h - 58);
    function draw() {
      const T = +ts.value, Ea0 = +es.value, Ea = cb.checked ? Ea0 * .6 : Ea0; outs[0].textContent = T + ' K'; outs[1].textContent = fmt(Ea0, 1) + ' kJ/mol';
      g.clearRect(0, 0, w, h); g.beginPath(); g.moveTo(X(Ea), Y(0)); for (let E = Ea; E <= 30; E += .1) g.lineTo(X(E), Y(f(E, T))); g.lineTo(X(30), Y(0)); g.closePath(); g.fillStyle = 'rgba(240,154,46,.45)'; g.fill();
      const curve = (TT, col, dash, lw) => { g.beginPath(); for (let E = 0; E <= 30; E += .1) { const y = Y(f(E, TT)); E ? g.lineTo(X(E), y) : g.moveTo(X(E), y); } g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash); g.stroke(); g.setLineDash([]); };
      if (T !== 300) curve(300, INK3, [5, 5], 2); curve(T, BLUE, [], 3);
      g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(X(0), Y(.25)); g.lineTo(X(0), Y(0)); g.lineTo(X(30), Y(0)); g.stroke();
      g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(Ea), Y(0)); g.lineTo(X(Ea), Y(.2)); g.strokeStyle = '#a85d00'; g.stroke(); if (cb.checked) { g.beginPath(); g.moveTo(X(Ea0), Y(0)); g.lineTo(X(Ea0), Y(.15)); g.strokeStyle = INK3; g.stroke(); } g.setLineDash([]);
      g.font = '400 12px Jost, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#a85d00'; g.fillText(cb.checked ? 'Eₐ with catalyst' : 'Eₐ', X(Ea), Y(.21)); if (cb.checked) { g.fillStyle = INK3; g.fillText('Eₐ', X(Ea0), Y(.16)); }
      g.fillStyle = INK2; g.fillText('kinetic energy', X(15), h - 8); g.save(); g.translate(14, Y(.12)); g.rotate(-Math.PI / 2); g.fillText('number of particles', 0, 0); g.restore();
      if (T !== 300) { g.textAlign = 'left'; g.fillStyle = INK3; g.fillText('- - 300 K', X(21), Y(.235)); g.fillStyle = BLUE; g.fillText('— ' + T + ' K', X(21), Y(.215)); }
      const p = frac(Ea, T) * 100, p0 = frac(Ea0, 300) * 100;
      read.innerHTML = `<span>Particles with energy ≥ Eₐ</span><span class="big">${sig(p, 2)}%</span><span>At 300 K with no catalyst it is ${sig(p0, 2)}%.</span>${T > 300 ? '<span><b>Hotter:</b> the peak moves right and gets lower. A much larger fraction of the particles now has energy of at least Eₐ, so more collisions are successful.</span>' : ''}${T < 300 ? '<span><b>Colder:</b> the peak moves left and gets higher. Fewer particles have energy of at least Eₐ.</span>' : ''}${cb.checked ? '<span><b>Catalyst:</b> the curve does not move. The catalyst offers a route with a lower Eₐ, so more of the same particles can react.</span>' : ''}`;
    }
    ts.addEventListener('input', draw); es.addEventListener('input', draw); cb.addEventListener('change', draw); draw();
  };

  /* ---------- orbital viewer ---------- */
  W.orbitals = function (root, opts) {
    const body = frame(root, 'Turn an orbital in your hands', 'Each dot is a place where the electron could be found, picked at random from |ψ|² for a hydrogen atom. Blue and orange show where the wavefunction is positive and negative. An orbital holds at most two electrons, with opposite spins.');
    body.innerHTML = `<div class="orb-embed"><canvas role="img" aria-label="A model of an atomic orbital drawn as a cloud of dots. Drag to turn it."></canvas></div><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between"><div class="seg" role="group" aria-label="Orbital">${Orbital.ORDER.map(k => `<button type="button" data-v="${k}">${Orbital.ORBS[k].label}${Orbital.ORBS[k].sub ? `<sub>${Orbital.ORBS[k].sub}</sub>` : ''}</button>`).join('')}</div></div><div class="read"></div>`;
    const read = body.querySelector('.read'), btn = [...body.querySelectorAll('.seg button')];
    const view = new Orbital.View(body.querySelector('canvas'), { n: 14000, zoom: 2.5, onChange: (k, o) => { btn.forEach(b => b.classList.toggle('is-on', b.dataset.v === k)); read.innerHTML = `<b>${o.label}${o.sub ? `<sub>${o.sub}</sub>` : ''}</b><span>${o.say}</span>`; } });
    view.set((opts && opts.first) || '2p', true); view.start(); seg(body.querySelector('.seg'), k => view.set(k)); kills.add(() => view.destroy());
  };

  /* ---------- Haber process: position of equilibrium ---------- */
  W.equilibrium = function (root) {
    const body = frame(root, 'Find the best conditions for making ammonia', 'The yield is the equilibrium value for ideal gases, using an equilibrium constant fitted to measurements (the Gillespie–Beattie equation). Real gases at high pressure give somewhat higher yields than this. A real plant does not wait for equilibrium: each pass converts about 15%, and the unreacted gases are recycled.');
    const tid = id('t'), pid = id('p');
    body.innerHTML = `<p class="eqn" style="font:400 19px var(--body);text-align:center">N₂(g) + 3H₂(g) ⇌ 2NH₃(g) &nbsp; <small style="font-size:14px;color:var(--ink-2)">the forward reaction is exothermic</small></p><div class="fig-split"><div class="ctl"><label for="${tid}"><span>Temperature <b></b></span><input id="${tid}" type="range" min="250" max="600" value="450" step="10"></label><label for="${pid}"><span>Pressure <b></b></span><input id="${pid}" type="range" min="25" max="400" value="200" step="25"></label><button type="button" class="chip wrap" style="justify-self:start">Typical conditions: 450 °C, 200 atm, iron catalyst</button><div class="read bars"></div></div><div class="read why"></div></div>`;
    const ts = body.querySelector('#' + tid), ps = body.querySelector('#' + pid), bars = body.querySelector('.bars'), why = body.querySelector('.why'), outs = body.querySelectorAll('label b');
    function yieldAt(Tc, P) { const T = Tc + 273.15, lg = -2.691122 * Math.log10(T) - 5.519265e-5 * T + 1.848863e-7 * T * T + 2001.6 / T + 2.6899, K = Math.pow(10, 2 * lg) * P * P; let lo = 0, hi = .999999; for (let i = 0; i < 60; i++) { const x = (lo + hi) / 2, v = 16 * x * x * (2 - x) * (2 - x) / (27 * Math.pow(1 - x, 4)); if (v < K) lo = x; else hi = x; } const x = (lo + hi) / 2; return 2 * x / (4 - 2 * x) * 100; }
    function ui() {
      const T = +ts.value, P = +ps.value, y = yieldAt(T, P), rate = T < 350 ? ['very slow', 12] : T < 420 ? ['slow', 34] : T <= 500 ? ['fast enough', 66] : ['fast', 92], cost = P <= 100 ? ['low', 25] : P <= 250 ? ['high, but practical', 60] : ['very high, and a safety risk', 95];
      outs[0].textContent = T + ' °C'; outs[1].textContent = P + ' atm (' + (P * 100).toLocaleString('en-GB') + ' kPa)';
      const bar = (l, v, pc, hue) => `<span style="display:flex;justify-content:space-between"><span>${l}</span><b>${v}</b></span><div class="meter" style="--hue:${hue}"><i style="--v:${pc}%"></i></div>`;
      bars.innerHTML = `<span>Ammonia in the equilibrium mixture</span><span class="big">${sig(y, 2)}%</span>${bar('Yield', sig(y, 2) + '%', y, 'var(--accent)')}${bar('Rate', rate[0], rate[1], 'var(--good)')}${bar('Cost of the plant', cost[0], cost[1], 'var(--sun)')}`;
      const s = []; s.push(T < 450 ? '<b>Lower temperature:</b> the position of equilibrium moves to the right, in the exothermic direction, so the yield is higher. But the particles have less energy, so the rate is too slow.' : T > 450 ? '<b>Higher temperature:</b> the rate is higher, but the position of equilibrium moves to the left, in the endothermic direction, so the yield falls.' : '<b>450 °C is a compromise:</b> hot enough for a fast rate, cool enough for a reasonable yield.');
      s.push(P > 200 ? '<b>Higher pressure:</b> there are 4 moles of gas on the left and 2 on the right. The position of equilibrium moves to the side with fewer gas molecules, so the yield rises, and the rate rises too. But stronger pipes and pumps cost more and the risk of leaks is greater.' : P < 200 ? '<b>Lower pressure:</b> cheaper and safer, but the position of equilibrium moves to the left, the side with more gas molecules, so the yield falls.' : '<b>200 atm is a compromise:</b> high enough for a good yield and rate without the cost and danger of very high pressure.');
      s.push('<b>The iron catalyst</b> increases the rate of the forward and reverse reactions equally. It does not change the position of equilibrium or the yield: it gets you there sooner.');
      why.innerHTML = s.map(x => `<span>${x}</span>`).join('');
    }
    ts.addEventListener('input', ui); ps.addEventListener('input', ui); body.querySelector('.chip').addEventListener('click', () => { ts.value = 450; ps.value = 200; ui(); }); ui();
  };

  /* ---------- paper chromatography ---------- */
  W.chromatography = function (root) {
    const body = frame(root, 'Run a chromatogram', 'Each dye has its own R<sub>f</sub> value in a given solvent, because each has a different solubility in the solvent and a different attraction to the paper. The distances are measured from the pencil start line.');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><div style="display:flex;gap:8px"><button type="button" class="btn small" data-a="go">Start the run</button><button type="button" class="chip" data-a="reset">Reset</button></div><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 330), read = body.querySelector('.read'), px = 18, pw = 196, base = 276, topY = 46, D = [['A', '#d8343a', [.28]], ['B', '#2a6bd0', [.62]], ['C', '#e9b81a', [.85]], ['X', '#2e8f5a', [.62, .85]]], COL = { '0.28': '#d8343a', '0.62': '#2a6bd0', '0.85': '#e9b81a' };
    let p = 0, run = false;
    const txt = () => { read.innerHTML = p < 1 ? '<span>Spots A, B and C are single dyes. <b>X is an unknown ink.</b></span><span>The solvent level starts below the pencil line, so the spots do not wash into the solvent.</span>' : `<span class="eqn">R<sub>f</sub> = distance travelled by substance ÷ distance travelled by solvent</span><span><b>A:</b> 2.8 ÷ 10.0 = 0.28 &nbsp; <b>B:</b> 6.2 ÷ 10.0 = 0.62 &nbsp; <b>C:</b> 8.5 ÷ 10.0 = 0.85</span><span><b>X gives two spots</b>, with R<sub>f</sub> 0.62 and 0.85. It is a mixture of dye B and dye C, and it contains no dye A. A pure substance would give one spot.</span>`; };
    const L = loop(c, dt => {
      if (run && p < 1) { p = Math.min(1, p + dt / 6); if (p === 1) txt(); }
      const front = base - 12 - p * (base - 12 - topY - 14), dist = base - front; g.clearRect(0, 0, w, h);
      rr(g, px - 12, 250, pw + 24, 70, 10); g.fillStyle = '#e4f1ff'; g.fill(); g.strokeStyle = '#9fb4c8'; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = '#fff'; g.fillRect(px, 18, pw, 292); g.strokeStyle = 'rgba(10,36,64,.2)'; g.strokeRect(px, 18, pw, 292);
      g.fillStyle = 'rgba(120,180,240,.22)'; g.fillRect(px, front, pw, 310 - front);
      g.strokeStyle = '#6a7a8a'; g.lineWidth = 1; g.beginPath(); g.moveTo(px + 8, base); g.lineTo(px + pw - 8, base); g.stroke();
      if (p > 0) { g.setLineDash([5, 4]); g.strokeStyle = BLUE; g.beginPath(); g.moveTo(px, front); g.lineTo(px + pw, front); g.stroke(); g.setLineDash([]); g.fillStyle = BLUE; g.font = '400 11.5px Jost, sans-serif'; g.textAlign = 'left'; g.fillText('solvent front', px + pw + 8, front + 4); }
      D.forEach((d, i) => { const x = px + 30 + i * 45; g.fillStyle = INK; g.font = '500 13px Jost, sans-serif'; g.textAlign = 'center'; g.fillText(d[0], x, base + 20); if (p === 0) ball(g, x, base, 6.5, d[1]); else d[2].forEach(rf => { const y = base - rf * dist; g.globalAlpha = .88; g.beginPath(); g.ellipse(x, y, 8, 6.5, 0, 0, TAU); g.fillStyle = COL[String(rf)]; g.fill(); g.globalAlpha = 1; }); });
      g.fillStyle = INK3; g.font = '400 11.5px Jost, sans-serif'; g.textAlign = 'left'; g.fillText('pencil start line', px + pw + 8, base + 4);
    });
    body.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; if (a.dataset.a === 'go') { run = true; if (reduce()) { p = 1; txt(); } } else { run = false; p = 0; txt(); } L.poke(); }); txt();
  };

  /* ---------- homologous series: displayed formulae ---------- */
  W.homologous = function (root) {
    const FAM = { alkane: ['Alkanes', 'CₙH₂ₙ₊₂', 'C–C single bonds only (saturated)', ['methane', 'ethane', 'propane', 'butane', 'pentane', 'hexane']], alkene: ['Alkenes', 'CₙH₂ₙ', 'C=C double bond (unsaturated)', ['', 'ethene', 'propene', 'but-1-ene', 'pent-1-ene', 'hex-1-ene']], alcohol: ['Alcohols', 'CₙH₂ₙ₊₁OH', '–OH', ['methanol', 'ethanol', 'propan-1-ol', 'butan-1-ol', 'pentan-1-ol', 'hexan-1-ol']], acid: ['Carboxylic acids', 'CₙH₂ₙ₊₁COOH', '–COOH', ['methanoic acid', 'ethanoic acid', 'propanoic acid', 'butanoic acid', 'pentanoic acid', 'hexanoic acid']] };
    const body = frame(root, 'Step along a homologous series', 'Each member differs from the next by one –CH₂– unit. A displayed formula shows every atom and every bond. Where the functional group could be in more than one place, the structure with it on the first carbon is drawn.');
    const nid = id('n');
    body.innerHTML = `<div class="ctl"><div class="seg" role="group" aria-label="Homologous series">${Object.keys(FAM).map((k, i) => `<button type="button" data-v="${k}" class="${i ? '' : 'is-on'}">${FAM[k][0]}</button>`).join('')}</div><label for="${nid}"><span>Number of carbon atoms <b></b></span><input id="${nid}" type="range" min="1" max="6" value="2" step="1"></label></div><div class="svgbox"></div><dl class="dl"></dl>`;
    const sl = body.querySelector('input'), box = body.querySelector('.svgbox'), dl = body.querySelector('dl'), out = body.querySelector('label b'); let fam = 'alkane';
    const sub = n => n === 1 ? '' : String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
    function build(n) {
      const A = [], B = [], add = (x, y, s) => A.push({ x, y, s }) - 1, used = [];
      for (let i = 0; i < n; i++) { add(i, 0, 'C'); used.push(0); }
      for (let i = 0; i < n - 1; i++) { const o = fam === 'alkene' && i === 0 ? 2 : 1; B.push([i, i + 1, o]); used[i] += o; used[i + 1] += o; }
      let endRight = true;
      if (fam === 'alcohol') { const o = add(n, 0, 'O'), hh = add(n + 1, 0, 'H'); B.push([n - 1, o, 1], [o, hh, 1]); used[n - 1]++; endRight = false; }
      if (fam === 'acid') { const o1 = add(n - 1, -1, 'O'), o2 = add(n, 0, 'O'), hh = add(n + 1, 0, 'H'); B.push([n - 1, o1, 2], [n - 1, o2, 1], [o2, hh, 1]); used[n - 1] += 3; endRight = false; }
      for (let i = 0; i < n; i++) { const slots = []; if (fam === 'acid' && n === 1) slots.push([-1, 0]); if (!(fam === 'acid' && i === n - 1)) slots.push([i, -1]); slots.push([i, 1]); if (i === 0) slots.push([-1, 0]); if (i === n - 1 && endRight) slots.push([n, 0]); let need = 4 - used[i]; for (const [x, y] of slots) { if (need <= 0) break; B.push([i, add(x, y, 'H'), 1]); need--; } }
      return { A, B };
    }
    function ui() {
      if (fam === 'alkene' && +sl.value < 2) sl.value = 2; sl.min = fam === 'alkene' ? 2 : 1; const n = +sl.value, { A, B } = build(n), S = 46, minX = Math.min(...A.map(a => a.x)), maxX = Math.max(...A.map(a => a.x)), Wd = (maxX - minX) * S + 80, X = a => 40 + (a.x - minX) * S, Y = a => 70 + a.y * S; out.textContent = n;
      box.innerHTML = `<svg viewBox="0 0 ${Wd} 140" width="${Wd}" height="140" role="img" aria-label="Displayed formula">${B.map(([i, j, o]) => { const a = A[i], b = A[j], dx = X(b) - X(a), dy = Y(b) - Y(a), d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, x1 = X(a) + ux * 11, y1 = Y(a) + uy * 11, x2 = X(b) - ux * 11, y2 = Y(b) - uy * 11; return o === 1 ? `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="1.8"/>` : `<path d="M${x1 - uy * 3.2} ${y1 + ux * 3.2}L${x2 - uy * 3.2} ${y2 + ux * 3.2}M${x1 + uy * 3.2} ${y1 - ux * 3.2}L${x2 + uy * 3.2} ${y2 - ux * 3.2}" stroke="${INK}" stroke-width="1.8"/>`; }).join('')}${A.map(a => `<text x="${X(a)}" y="${Y(a) + 6}" text-anchor="middle" font-family="Jost, sans-serif" font-size="18" font-weight="${a.s === 'H' ? 400 : 500}" fill="${a.s === 'O' ? '#cf4338' : a.s === 'C' ? INK : INK2}">${a.s}</text>`).join('')}</svg>`;
      const mol = fam === 'alkane' ? `C${sub(n)}H${sub(2 * n + 2)}` : fam === 'alkene' ? `C${sub(n)}H${sub(2 * n)}` : fam === 'alcohol' ? `C${sub(n)}H${sub(2 * n + 1)}OH` : n === 1 ? 'HCOOH' : `C${sub(n - 1)}H${sub(2 * n - 1)}COOH`;
      const chain = k => k <= 0 ? '' : 'CH₃' + 'CH₂'.repeat(k - 1), str = fam === 'alkane' ? (n === 1 ? 'CH₄' : n === 2 ? 'CH₃CH₃' : 'CH₃' + 'CH₂'.repeat(n - 2) + 'CH₃') : fam === 'alkene' ? (n === 2 ? 'CH₂=CH₂' : 'CH₂=CH' + 'CH₂'.repeat(n - 3) + 'CH₃') : fam === 'alcohol' ? (n === 1 ? 'CH₃OH' : chain(n - 1) + 'CH₂OH') : n === 1 ? 'HCOOH' : chain(n - 1) + 'COOH';
      const cnt = { C: 0, H: 0, O: 0 }; A.forEach(a => cnt[a.s]++); const mr = cnt.C * 12 + cnt.H + cnt.O * 16;
      dl.innerHTML = [['Name', `<b>${FAM[fam][3][n - 1]}</b>`], ['Homologous series', `${FAM[fam][0].toLowerCase()}, general formula ${FAM[fam][1]}`], ['Functional group', FAM[fam][2]], ['Molecular formula', mol], ['Structural formula', str], ['Relative molecular mass', `${mr} <small>(the next member is 14 more: one extra CH₂)</small>`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    }
    seg(body.querySelector('.seg'), v => { fam = v; ui(); }); sl.addEventListener('input', ui); ui();
  };

  W.ptable = function (root) { const body = frame(root, 'The Periodic Table', ''); PT.mount(body); };

  // which live figures belong to which lecture
  const MAP = {
    'k3-1-1': ['states'], 'k3-1-3': ['states'], 'k3-3-3': ['diffusion'], 'k3-3-5': ['chromatography'], 'k3-4-5': ['ph'], 'k3-6-2': ['ptable'], 'k3-7-1': ['reactivity'],
    'ci-1-1': ['states'], 'ci-1-2': ['diffusion'], 'ci-2-2': ['atom'], 'ci-3-2': ['moles'], 'ci-3-3': ['moles'], 'ci-4-1': ['electrolysis'], 'ci-5-1': ['profile'], 'ci-6-2': ['rate'], 'ci-6-3': ['equilibrium'], 'ci-7-1': ['ph'], 'ci-8-1': ['ptable'], 'ci-9-4': ['reactivity'], 'ci-11-1': ['homologous'], 'ci-11-2': ['homologous'], 'ci-12-3': ['chromatography'], 'ci-12-5': ['iontests'],
    'ca-1-3': ['orbitals'], 'ca-2-4': ['moles'], 'ca-5-1': ['profile'], 'ca-7-1': ['equilibrium'], 'ca-8-1': ['rate'], 'ca-8-2': ['boltzmann'], 'ca-8-3': ['boltzmann'], 'ca-9-1': ['ptable'], 'ca-13-1': ['homologous'], 'ca-24-1': ['electrolysis'], 'ca-28-1': ['orbitals'],
  };
  window.Widgets = {
    has: lid => !!MAP[lid], list: lid => MAP[lid] || [],
    mount(name, el, opts) { try { W[name](el, opts); } catch (e) { el.remove(); if (window.console) console.error('figure ' + name, e); } },
    clear() { kills.forEach(k => { try { k(); } catch (e) { } }); kills.clear(); },
  };
})();
