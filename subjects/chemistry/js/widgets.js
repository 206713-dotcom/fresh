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

  /* ================= more live models ================= */
  // drag to turn a 3D scene; it turns by itself slowly when you let go
  function spin3d(c, h, draw, opt) {
    const { g, w } = cv(c, h); let yaw = (opt && opt.yaw) || .6, pitch = (opt && opt.pitch) || -.32, drag = null;
    c.style.cursor = 'grab'; c.style.touchAction = 'pan-y';
    const S = () => (opt && opt.scale) || Math.min(w, h) / 4.2, D = 9;
    const proj = (x, y, z) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const X = x * cy + z * sy, Z1 = -x * sy + z * cy, Y = y * cp - Z1 * sp, Z = y * sp + Z1 * cp, p = D / (D - Z); return { x: w / 2 + X * S() * p, y: h / 2 - Y * S() * p, z: Z, p }; };
    c.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw, pitch }; try { c.setPointerCapture(e.pointerId); } catch (er) { } c.style.cursor = 'grabbing'; });
    c.addEventListener('pointermove', e => { if (!drag) return; yaw = drag.yaw + (e.clientX - drag.x) * .011; pitch = Math.max(-1.45, Math.min(1.45, drag.pitch + (e.clientY - drag.y) * .011)); L.poke(); });
    const up = () => { drag = null; c.style.cursor = 'grab'; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    const L = loop(c, (dt, t) => { if (!drag) yaw += dt * .32; g.clearRect(0, 0, w, h); draw(g, w, h, proj, S(), t, dt); });
    return L;
  }
  function shade(g, x, y, r, col, a) { const gr = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,' + (.9 * a) + ')'); gr.addColorStop(.35, col); gr.addColorStop(1, col); g.globalAlpha = a; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(10,36,64,.35)'; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1; }
  function axes(g, x0, y0, x1, y1) { g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke(); }
  const mn = x => String(x).replace(/-/g, '−');
  const sup = s => String(s).replace(/[\d+-]/g, d => ({ '+': '⁺', '-': '⁻' }[d] || '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]));

  /* ---------- particles: elements, compounds and mixtures ---------- */
  W.particles = function (root) {
    const body = frame(root, 'Element, compound or mixture?', 'Each circle is one atom. Atoms of the same element have the same colour. Bonded atoms move together as one molecule. The particles are drawn far bigger, and far slower, than real ones.');
    const KIND = {
      atoms: ['Atoms of one element', 'argon, Ar', 'element', [['Ar', 26]]],
      mols: ['Molecules of one element', 'oxygen, O₂', 'element', [['O2', 22]]],
      comp: ['A compound', 'carbon dioxide, CO₂', 'compound', [['CO2', 18]]],
      mixel: ['A mixture of elements', 'argon and oxygen', 'mixture', [['Ar', 12], ['O2', 12]]],
      mixc: ['A mixture of a compound and an element', 'carbon dioxide and nitrogen', 'mixture', [['CO2', 10], ['N2', 12]]],
    };
    const ATOM = { Ar: ['#b9a7e6', 9], O: ['#e8594d', 7.5], C: ['#3b4552', 8], N: ['#4f8ee8', 7.5] };
    const SHAPE = { Ar: [['Ar', 0]], O2: [['O', -.8], ['O', .8]], N2: [['N', -.8], ['N', .8]], CO2: [['O', -1.55], ['C', 0], ['O', 1.55]] };
    body.innerHTML = `<div class="seg" role="group" aria-label="Choose what is in the box">${Object.keys(KIND).map((k, i) => `<button type="button" data-v="${k}"${i ? '' : ' class="is-on"'}>${KIND[k][0]}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 280), read = body.querySelector('.read'); let M = [], kind = 'atoms';
    function fill() { M = []; for (const [s, n] of KIND[kind][3]) for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = 30 + Math.random() * 40; M.push({ s, x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: Math.random() * TAU, va: (Math.random() - .5) * 2 }); } }
    function ui() {
      const k = KIND[kind], pure = k[2] !== 'mixture';
      read.innerHTML = `<span>In the box</span><span class="big">${k[2]}</span><span><b>Example:</b> ${k[1]}</span><span><b>Pure substance?</b> ${pure ? 'yes: every particle is the same' : 'no: two kinds of particle'}</span><span>${k[2] === 'element' ? 'An <b>element</b> is made of only one type of atom. It cannot be broken down into anything simpler by a chemical reaction. Some elements are single atoms, others are molecules of two or more of the same atom.' : k[2] === 'compound' ? 'A <b>compound</b> is two or more different elements chemically bonded together, always in the same fixed ratio. Here every molecule has 1 carbon atom and 2 oxygen atoms. Separating them needs a chemical reaction.' : 'A <b>mixture</b> is two or more substances that are not chemically joined. The amounts can be any ratio, each substance keeps its own properties, and they can be separated by physical methods.'}</span>`;
    }
    loop(c, dt => {
      g.clearRect(0, 0, w, h);
      for (const m of M) {
        m.x += m.vx * dt; m.y += m.vy * dt; m.a += m.va * dt; const pad = m.s === 'CO2' ? 22 : 16;
        if (m.x < pad) { m.x = pad; m.vx = Math.abs(m.vx); } if (m.x > w - pad) { m.x = w - pad; m.vx = -Math.abs(m.vx); } if (m.y < pad) { m.y = pad; m.vy = Math.abs(m.vy); } if (m.y > h - pad) { m.y = h - pad; m.vy = -Math.abs(m.vy); }
        const parts = SHAPE[m.s], ca = Math.cos(m.a), sa = Math.sin(m.a);
        for (const [e, o] of parts) { const [col, r] = ATOM[e], d = o * 8.5; ball(g, m.x + ca * d, m.y + sa * d, r, col, 'rgba(10,36,64,.35)'); }
      }
    });
    seg(body.querySelector('.seg'), v => { kind = v; fill(); ui(); }); fill(); ui();
  };

  /* ---------- the gas laws: pV = nRT ---------- */
  W.gas = function (root) {
    const body = frame(root, 'Squeeze it, heat it, add more gas', 'An ideal gas: the particles take up no space of their own and do not attract each other. Real gases come closest to this at low pressure and high temperature. Each dot stands for a huge number of real molecules, and the speeds are slowed right down so you can follow them.');
    const tid = id('t'), vid = id('v'), nid = id('n');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="ctl"><label for="${tid}"><span>Temperature, T <b></b></span><input id="${tid}" type="range" min="100" max="600" value="300" step="10"></label><label for="${vid}"><span>Volume, V <b></b></span><input id="${vid}" type="range" min="1" max="4" value="2.5" step="0.1"></label><label for="${nid}"><span>Amount of gas, n <b></b></span><input id="${nid}" type="range" min="0.04" max="0.3" value="0.1" step="0.02"></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), [ts, vs, ns] = [...body.querySelectorAll('input')], outs = body.querySelectorAll('label b'), read = body.querySelector('.read');
    const P = [], top = 26, bot = h - 46, left = 18, maxW = w - 96, flashes = []; let needle = 0;
    const right = () => left + (+vs.value / 4) * maxW, pk = () => +ns.value * 8.314 * +ts.value / (+vs.value / 1000) / 1000;
    function sync() { const N = Math.round(+ns.value * 400), R = right(); while (P.length < N) { const a = Math.random() * TAU, f = .55 + Math.random() * .9; P.push({ x: left + 6 + Math.random() * (R - left - 12), y: top + 6 + Math.random() * (bot - top - 12), ux: Math.cos(a) * f, uy: Math.sin(a) * f }); } P.length = N; for (const p of P) if (p.x > R - 4) p.x = left + 4 + Math.random() * (R - left - 8); }
    function ui() {
      sync(); const T = +ts.value, V = +vs.value, n = +ns.value, p = pk(); outs[0].textContent = T + ' K'; outs[1].textContent = fmt(V, 1) + ' dm³'; outs[2].textContent = fmt(n) + ' mol';
      const s = []; if (Math.abs(V - 2.5) > .01) s.push(`<b>Volume ${V < 2.5 ? 'smaller' : 'bigger'}:</b> the particles hit the walls ${V < 2.5 ? 'more' : 'less'} often, so the pressure ${V < 2.5 ? 'rises' : 'falls'}. At constant T and n, pV stays the same (Boyle's law).`); if (T !== 300) s.push(`<b>${T > 300 ? 'Hotter' : 'Colder'}:</b> the particles move ${T > 300 ? 'faster' : 'slower'}, so they hit the walls ${T > 300 ? 'harder and more often' : 'more gently and less often'}. Pressure is proportional to the absolute temperature in kelvin.`); if (Math.abs(n - .1) > .001) s.push(`<b>${n > .1 ? 'More' : 'Less'} gas:</b> ${n > .1 ? 'more' : 'fewer'} particles to hit the walls, so the pressure is proportional to n.`);
      read.innerHTML = `<span>Pressure</span><span class="big">${sig(p, 3)} kPa</span><span class="eqn">p = nRT ÷ V = ${fmt(n)} × 8.31 × ${T} ÷ ${sig(V / 1000, 3)} m³</span><span>Use SI units: V in m³ (1 dm³ = 10⁻³ m³), T in K, p in Pa.</span>${s.map(x => `<span>${x}</span>`).join('') || '<span>Move a slider. Every change shows up in how often, and how hard, the particles hit the walls.</span>'}`;
    }
    loop(c, dt => {
      const R = right(), sp = 95 * Math.sqrt(+ts.value / 300), p = pk(); needle += (p - needle) * Math.min(1, dt * 4);
      g.clearRect(0, 0, w, h);
      g.setLineDash([4, 5]); g.strokeStyle = LINE; g.lineWidth = 1; g.strokeRect(left, top, maxW, bot - top); g.setLineDash([]);
      g.fillStyle = '#f2f8ff'; g.fillRect(left, top, R - left, bot - top); g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.moveTo(R, top); g.lineTo(left, top); g.lineTo(left, bot); g.lineTo(R, bot); g.stroke();
      g.fillStyle = '#9fb3c8'; rr(g, R - 3, top - 6, 9, bot - top + 12, 3); g.fill(); g.fillStyle = '#c3d1df'; g.fillRect(R + 6, (top + bot) / 2 - 4, w - R - 6 - 40, 8);
      for (const q of P) {
        q.x += q.ux * sp * dt; q.y += q.uy * sp * dt;
        if (q.x < left + 3.5) { q.x = left + 3.5; q.ux = Math.abs(q.ux); flashes.push({ x: left, y: q.y, t: .25, v: 1 }); } if (q.x > R - 3.5) { q.x = R - 3.5; q.ux = -Math.abs(q.ux); flashes.push({ x: R - 3, y: q.y, t: .25, v: 1 }); }
        if (q.y < top + 3.5) { q.y = top + 3.5; q.uy = Math.abs(q.uy); flashes.push({ x: q.x, y: top, t: .25, v: 0 }); } if (q.y > bot - 3.5) { q.y = bot - 3.5; q.uy = -Math.abs(q.uy); flashes.push({ x: q.x, y: bot, t: .25, v: 0 }); }
        ball(g, q.x, q.y, 3.4, BLUE);
      }
      for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i]; f.t -= dt; if (f.t <= 0) { flashes.splice(i, 1); continue; } g.strokeStyle = `rgba(240,154,46,${f.t * 3.2})`; g.lineWidth = 2.5; g.beginPath(); if (f.v) { g.moveTo(f.x, f.y - 5); g.lineTo(f.x, f.y + 5); } else { g.moveTo(f.x - 5, f.y); g.lineTo(f.x + 5, f.y); } g.stroke(); }
      if (flashes.length > 400) flashes.splice(0, flashes.length - 400);
      const gx = w - 34, gy = top + 30, gr = 26, a = Math.PI * .8 + Math.min(1, needle / 500) * Math.PI * 1.4;
      g.beginPath(); g.arc(gx, gy, gr, 0, TAU); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = INK2; g.lineWidth = 1.5; g.stroke();
      g.strokeStyle = LINE; for (let k = 0; k <= 5; k++) { const b = Math.PI * .8 + k / 5 * Math.PI * 1.4; g.beginPath(); g.moveTo(gx + Math.cos(b) * gr * .78, gy + Math.sin(b) * gr * .78); g.lineTo(gx + Math.cos(b) * gr * .95, gy + Math.sin(b) * gr * .95); g.stroke(); }
      g.strokeStyle = '#cf4338'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + Math.cos(a) * gr * .8, gy + Math.sin(a) * gr * .8); g.stroke();
      g.font = '400 11px Jost, sans-serif'; g.fillStyle = INK3; g.textAlign = 'center'; g.fillText('0–500 kPa', gx, gy + gr + 14); g.fillText('flashes = hits on the walls', left + maxW / 2, h - 12);
    });
    [ts, vs, ns].forEach(s => s.addEventListener('input', ui)); ui();
  };

  /* ---------- acid-base titration ---------- */
  W.titration = function (root) {
    const body = frame(root, 'Run a titration, drop by drop', '25.0 cm³ of acid, 0.100 mol/dm³, in the flask; 0.100 mol/dm³ sodium hydroxide in the burette. The pH is worked out exactly from the equilibrium, with Kₐ = 1.74 × 10⁻⁵ mol/dm³ for ethanoic acid. Indicator colours are drawn as they look in the flask.');
    const vid = id('v');
    body.innerHTML = `<div class="fig-split" style="grid-template-columns:minmax(0,1fr)"><canvas></canvas></div><div class="fig-split"><div class="ctl"><div class="seg" role="group" aria-label="Acid"><button type="button" class="is-on" data-v="0">Strong acid: HCl</button><button type="button" data-v="1">Weak acid: CH₃COOH</button></div><div class="seg" role="group" aria-label="Indicator"><button type="button" class="is-on" data-v="mo">Methyl orange</button><button type="button" data-v="ph">Phenolphthalein</button><button type="button" data-v="th">Thymolphthalein</button></div><label for="${vid}"><span>NaOH added <b></b></span><input id="${vid}" type="range" min="0" max="50" value="0" step="0.1"></label></div><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), sl = body.querySelector('input'), out = body.querySelector('label b'), read = body.querySelector('.read'), segs = body.querySelectorAll('.seg'); let weak = 0, ind = 'mo';
    const IND = { mo: ['methyl orange', 3.1, 4.4, p => p < 3.1 ? [230, 60, 50, .9, 'red'] : p < 4.4 ? [240, 140, 40, .9, 'orange'] : [246, 206, 50, .85, 'yellow']], ph: ['phenolphthalein', 8.2, 10, p => p < 8.2 ? [240, 246, 252, .35, 'colourless'] : [232, 70, 160, Math.min(.85, .3 + (p - 8.2) / 2.2), 'pink']], th: ['thymolphthalein', 9.3, 10.5, p => p < 9.3 ? [240, 246, 252, .35, 'colourless'] : [47, 111, 208, Math.min(.85, .3 + (p - 9.3) / 1.6), 'blue']] };
    function pH(v) { const Vt = 25 + v, Ca = .1 * 25 / Vt, Cb = .1 * v / Vt, Ka = weak ? 1.74e-5 : 1e3; let lo = 0, hi = 14; for (let i = 0; i < 60; i++) { const p = (lo + hi) / 2, x = Math.pow(10, -p), f = x + Cb - 1e-14 / x - Ca * Ka / (Ka + x); if (f > 0) lo = p; else hi = p; } return (lo + hi) / 2; }
    const gx0 = Math.max(150, w * .3), X = v => gx0 + 30 + v / 50 * (w - gx0 - 46), Y = p => h - 36 - p / 14 * (h - 58);
    function draw() {
      const v = +sl.value, p = pH(v), I = IND[ind], col = I[3](p); out.textContent = fmt(v, 1) + ' cm³';
      g.clearRect(0, 0, w, h); const bx = gx0 * .5, bTop = 24, bBot = 150, bw = 16;
      g.fillStyle = '#fff'; g.strokeStyle = INK2; g.lineWidth = 1.5; g.fillRect(bx - bw / 2, bTop, bw, bBot - bTop); g.strokeRect(bx - bw / 2, bTop, bw, bBot - bTop);
      const lvl = bTop + 6 + v / 50 * (bBot - bTop - 12); g.fillStyle = 'rgba(160,200,240,.55)'; g.fillRect(bx - bw / 2 + 1.5, lvl, bw - 3, bBot - lvl);
      g.strokeStyle = LINE; g.lineWidth = 1; for (let k = 0; k <= 10; k++) { const yy = bTop + 6 + k / 10 * (bBot - bTop - 12); g.beginPath(); g.moveTo(bx - bw / 2, yy); g.lineTo(bx - bw / 2 + (k % 5 ? 5 : 9), yy); g.stroke(); }
      g.fillStyle = INK2; g.fillRect(bx - 10, bBot, 20, 5); g.fillRect(bx - 2, bBot + 5, 4, 16);
      const fy = h - 30, fw = Math.min(110, gx0 * .7); g.beginPath(); g.moveTo(bx - 9, bBot + 34); g.lineTo(bx - 9, bBot + 52); g.lineTo(bx - fw / 2, fy); g.lineTo(bx + fw / 2, fy); g.lineTo(bx + 9, bBot + 52); g.lineTo(bx + 9, bBot + 34);
      g.fillStyle = '#fff'; g.fill(); g.save(); g.clip(); const lt = fy - 34 - v * .5; g.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3]})`; g.fillRect(bx - fw, lt, fw * 2, fy - lt); g.restore(); g.strokeStyle = INK2; g.lineWidth = 1.6; g.stroke();
      g.font = '400 11.5px Jost, sans-serif'; g.fillStyle = INK3; g.textAlign = 'center'; g.fillText('NaOH(aq)', bx, 14); g.fillText(col[4], bx, h - 12);
      g.fillStyle = 'rgba(240,154,46,.13)'; g.fillRect(X(0), Y(I[2]), X(50) - X(0), Y(I[1]) - Y(I[2]));
      g.strokeStyle = LINE; g.lineWidth = 1; g.textAlign = 'right'; g.fillStyle = INK3; for (let q = 0; q <= 14; q += 2) { g.beginPath(); g.moveTo(X(0), Y(q)); g.lineTo(X(50), Y(q)); g.stroke(); g.fillText(q, X(0) - 6, Y(q) + 4); }
      g.textAlign = 'center'; for (let q = 0; q <= 50; q += 10) g.fillText(q, X(q), Y(0) + 15); g.fillStyle = INK2; g.fillText('volume of NaOH added / cm³', X(25), h - 4); g.save(); g.translate(gx0 + 6, Y(7)); g.rotate(-Math.PI / 2); g.fillText('pH', 0, 0); g.restore();
      axes(g, X(0), Y(0), X(50), Y(14)); g.setLineDash([4, 4]); g.strokeStyle = INK3; g.beginPath(); g.moveTo(X(25), Y(0)); g.lineTo(X(25), Y(14)); g.stroke(); g.setLineDash([]);
      g.beginPath(); for (let q = 0; q <= 50; q += .1) { const yy = Y(pH(q)); q ? g.lineTo(X(q), yy) : g.moveTo(X(q), yy); } g.strokeStyle = 'rgba(11,95,202,.22)'; g.lineWidth = 2; g.stroke();
      g.beginPath(); for (let q = 0; q <= v + 1e-9; q += .1) { const yy = Y(pH(q)); q ? g.lineTo(X(q), yy) : g.moveTo(X(q), yy); } g.strokeStyle = BLUE; g.lineWidth = 3; g.stroke(); ball(g, X(v), Y(p), 5, SUN, INK);
      g.fillStyle = '#a85d00'; g.textAlign = 'left'; g.fillText(I[0] + ' changes here', X(31), Y(I[2]) - 4);
      const eqp = pH(25), stage = v < 24.95 ? 'before the end-point: the acid is in excess' : v <= 25.05 ? 'the equivalence point: exactly enough alkali to neutralise the acid' : 'after the end-point: the alkali is in excess';
      const good = weak ? ind !== 'mo' : true;
      read.innerHTML = `<span>pH in the flask</span><span class="big">${fmt(p, 2)}</span><span><b>${fmt(v, 1)} cm³ added:</b> ${stage}.</span><span><b>Equivalence point:</b> 25.0 cm³, at pH ${fmt(eqp, 2)}${weak ? ' (above 7: the ethanoate ion is a weak base)' : ''}.</span>${weak ? `<span><b>Half-way, 12.5 cm³:</b> pH = pKₐ = ${fmt(pH(12.5), 2)}. Ethanoic acid and ethanoate ions are in equal amounts here: a buffer.</span>` : ''}<span><b>${I[0]}:</b> ${good ? `a good choice. It changes colour between pH ${I[1]} and ${I[2]}, inside the steep part of the curve.` : `a poor choice here. It changes between pH ${I[1]} and ${I[2]}, well before the steep part, so the colour change comes too early and too gradually.`}</span>`;
    }
    seg(segs[0], v => { weak = +v; draw(); }); seg(segs[1], v => { ind = v; draw(); }); sl.addEventListener('input', draw); draw();
  };

  /* ---------- mass spectra of elements ---------- */
  W.massspec = function (root) {
    const body = frame(root, 'Read a mass spectrum', 'Each peak is one isotope, at its mass-to-charge ratio m/z (the ions here have a charge of 1+). The height of a peak is the percentage abundance of that isotope. Isotopic masses are taken as whole numbers.');
    const SET = { Cl: ['Chlorine', [[35, 75.78], [37, 24.22]]], Br: ['Bromine', [[79, 50.69], [81, 49.31]]], B: ['Boron', [[10, 19.9], [11, 80.1]]], Mg: ['Magnesium', [[24, 78.99], [25, 10.00], [26, 11.01]]], Ne: ['Neon', [[20, 90.48], [21, 0.27], [22, 9.25]]], Cu: ['Copper', [[63, 69.15], [65, 30.85]]], Cl2: ['Chlorine molecules, Cl₂', [[70, 57.43], [72, 36.71], [74, 5.87]]] };
    const hid = id('h');
    body.innerHTML = `<div class="seg" role="group" aria-label="Element">${Object.keys(SET).map((k, i) => `<button type="button" data-v="${k}"${i ? '' : ' class="is-on"'}>${k === 'Cl2' ? 'Cl₂' : k}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="ctl"><label for="${hid}" style="display:flex;gap:8px;align-items:center"><input id="${hid}" type="checkbox"> <span>Hide the answer: work it out first</span></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 280), read = body.querySelector('.read'), cb = body.querySelector('#' + hid); let k = 'Cl';
    function draw() {
      const [name, pk] = SET[k], lo = pk[0][0] - 3, hi = pk[pk.length - 1][0] + 3, X = m => 50 + (m - lo) / (hi - lo) * (w - 70), Y = a => h - 38 - a / 100 * (h - 66);
      g.clearRect(0, 0, w, h); g.font = '400 11.5px Jost, sans-serif'; g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'right';
      for (let a = 0; a <= 100; a += 20) { g.beginPath(); g.moveTo(X(lo), Y(a)); g.lineTo(X(hi), Y(a)); g.stroke(); g.fillText(a, X(lo) - 6, Y(a) + 4); }
      g.textAlign = 'center'; for (let m = lo; m <= hi; m++) g.fillText(m, X(m), Y(0) + 15); g.fillStyle = INK2; g.fillText('m/z', X((lo + hi) / 2), h - 6); g.save(); g.translate(14, Y(50)); g.rotate(-Math.PI / 2); g.fillText('abundance / %', 0, 0); g.restore(); axes(g, X(lo), Y(0), X(hi), Y(100));
      for (const [m, a] of pk) { g.fillStyle = BLUE; g.fillRect(X(m) - 4, Y(a), 8, Y(0) - Y(a)); g.fillStyle = INK; g.fillText(a.toFixed(2) + '%', X(m), Y(a) - 6); }
      const ar = pk.reduce((s, [m, a]) => s + m * a, 0) / 100, mol = k === 'Cl2', sum = pk.map(([m, a]) => `(${m} × ${a.toFixed(2)})`).join(' + ');
      read.innerHTML = `<span>${name}</span>${cb.checked ? `<span class="big">${mol ? 'Mᵣ' : 'Aᵣ'} = ?</span><span>Multiply each m/z by its abundance, add them up, then divide by 100. Untick the box to check.</span>` : `<span class="big">${mol ? 'Mᵣ' : 'Aᵣ'} = ${fmt(ar, 2)}</span><span class="eqn">${mol ? 'Mᵣ' : 'Aᵣ'} = [${sum}] ÷ 100</span>`}${mol ? '<span><b>Three peaks for Cl₂:</b> ³⁵Cl–³⁵Cl (70), ³⁵Cl–³⁷Cl (72) and ³⁷Cl–³⁷Cl (74), in the ratio 9 : 6 : 1, because ³⁵Cl is three times as common as ³⁷Cl. The real spectrum also has Cl⁺ peaks at 35 and 37.</span>' : `<span><b>Isotopes</b> are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same chemical properties because they have the same electronic configuration.</span><span>${pk.length} isotope${pk.length > 1 ? 's' : ''}: ${pk.map(([m]) => `${sup(m)}${k}`).join(', ')}.</span>`}`;
    }
    seg(body.querySelector('.seg'), v => { k = v; draw(); }); cb.addEventListener('change', draw); draw();
  };

  /* ---------- periodicity ---------- */
  W.periodicity = function (root) {
    const IE = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 762, 760, 737, 746, 906, 579, 762, 947, 941, 1140, 1351];
    const P3 = ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];
    const MODES = {
      ie: ['First ionisation energy', 'kJ/mol'], rad: ['Period 3: atomic radius', 'nm'], mp: ['Period 3: melting point', 'K'], en: ['Period 3: electronegativity', 'Pauling scale'],
    };
    const DATA = { rad: [.186, .160, .143, .117, .110, .104, .099, null], mp: [371, 922, 933, 1683, 317, 392, 172, 84], en: [.9, 1.2, 1.5, 1.8, 2.1, 2.5, 3.0, null] };
    const STRUCT = ['giant metallic', 'giant metallic', 'giant metallic', 'giant covalent', 'simple molecular, P₄', 'simple molecular, S₈', 'simple molecular, Cl₂', 'single atoms'];
    const body = frame(root, 'Patterns across the Periodic Table', 'Ionisation energies from the NIST database. Period 3 radii, melting points and electronegativities as printed in the Cambridge data booklet: metallic radii for Na, Mg and Al, covalent radii for Si to Cl. Point at a bar to read it.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Property">${Object.keys(MODES).map((m, i) => `<button type="button" data-v="${m}"${i ? '' : ' class="is-on"'}>${MODES[m][0]}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), read = body.querySelector('.read'); let mode = 'ie', at = 10;
    const blk = z => [1, 2, 3, 4, 11, 12, 19, 20].includes(z) ? 's' : z >= 21 && z <= 30 ? 'd' : 'p', BCOL = { s: BLUE, p: SUN, d: '#2f9a6b' };
    function why(z) {
      const e = PT.EL[z - 1];
      if ([3, 11, 19].includes(z)) return 'A big drop: the outer electron starts a new shell, further from the nucleus and better shielded by the full shells inside it.';
      if ([2, 10, 18, 36].includes(z)) return 'A peak: a noble gas. Its outer shell is full, and across the period the nuclear charge has risen while the shielding stayed about the same.';
      if ([5, 13, 31].includes(z)) return `Lower than ${PT.EL[z - 2].sym}: the electron removed is in a p orbital, which is higher in energy than the s orbital and is shielded by the s electrons.`;
      if ([8, 16].includes(z)) return `Lower than ${PT.EL[z - 2].sym}: the electron removed is paired with another in the same p orbital. The repulsion between the two paired electrons makes one easier to remove.`;
      if (z >= 21 && z <= 30) return 'Transition elements: almost flat. Each extra electron goes into the inner 3d subshell, which shields the 4s electrons about as fast as the nuclear charge rises.';
      return `Higher than ${PT.EL[z - 2].sym}: one more proton in the nucleus, the electron is in the same shell with similar shielding, so it is held more strongly.`;
    }
    function draw() {
      g.clearRect(0, 0, w, h); g.font = '400 11px Jost, sans-serif'; const ie = mode === 'ie', vals = ie ? IE : DATA[mode], n = vals.length, mx = ie ? 2500 : mode === 'rad' ? .2 : mode === 'mp' ? 1800 : 3.5;
      const x0 = 50, x1 = w - 14, bw = (x1 - x0) / n, Y = v => h - 40 - v / mx * (h - 64);
      g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'right'; for (let k = 0; k <= 5; k++) { const v = mx * k / 5; g.beginPath(); g.moveTo(x0, Y(v)); g.lineTo(x1, Y(v)); g.stroke(); g.fillText(mode === 'rad' ? v.toFixed(2) : mode === 'en' ? v.toFixed(1) : Math.round(v), x0 - 5, Y(v) + 4); }
      vals.forEach((v, i) => { if (v === null) return; const z = ie ? i + 1 : 11 + i, x = x0 + i * bw + bw * .14, on = (ie ? z : 11 + i) === at; g.fillStyle = ie ? BCOL[blk(z)] : i < 3 ? BLUE : i === 3 ? '#2f9a6b' : SUN; g.globalAlpha = on ? 1 : .62; g.fillRect(x, Y(v), bw * .72, Y(0) - Y(v)); g.globalAlpha = 1; if (on) { g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x, Y(v), bw * .72, Y(0) - Y(v)); }
        g.fillStyle = on ? INK : INK2; g.textAlign = 'center'; if (!ie || bw > 13 || z % 2) g.fillText(ie ? PT.EL[z - 1].sym : P3[i], x + bw * .36, Y(0) + 14); });
      if (!ie && vals[7] === null) { g.fillStyle = INK3; g.textAlign = 'center'; g.fillText('–', x0 + 7 * bw + bw / 2, Y(0) - 6); }
      axes(g, x0, Y(0), x1, Y(mx)); g.fillStyle = INK2; g.textAlign = 'center'; g.fillText(ie ? 'element, in order of proton number' : 'Period 3 element', (x0 + x1) / 2, h - 8); g.save(); g.translate(13, Y(mx / 2)); g.rotate(-Math.PI / 2); g.fillText(MODES[mode][0].replace('Period 3: ', '') + ' / ' + MODES[mode][1], 0, 0); g.restore();
      if (ie) { g.textAlign = 'left'; [['s block', BLUE], ['p block', SUN], ['d block', '#2f9a6b']].forEach(([t, col], i) => { g.fillStyle = col; g.fillRect(x0 + 10 + i * 70, 12, 10, 10); g.fillStyle = INK2; g.fillText(t, x0 + 24 + i * 70, 21); }); }
      const z = at, e = PT.EL[z - 1];
      if (ie) read.innerHTML = `<span>${e.name}, Z = ${z}</span><span class="big">${IE[z - 1]} kJ/mol</span><span class="eqn">${e.sym}(g) → ${e.sym}⁺(g) + e⁻</span><span>${z === 1 ? 'The first element: one electron, held by one proton.' : why(z)}</span>`;
      else { const i = z - 11, v = DATA[mode][i]; read.innerHTML = `<span>${e.name} · ${STRUCT[i]}</span><span class="big">${v === null ? '–' : (mode === 'rad' ? v.toFixed(3) : v) + ' ' + MODES[mode][1].replace('Pauling scale', '')}</span><span>${mode === 'rad' ? (v === null ? 'Argon forms no bonds, so it has no covalent radius to compare.' : 'Across Period 3 the radius falls: the nuclear charge rises, the outer electrons are in the same shell with similar shielding, so they are pulled in closer.') : mode === 'en' ? (v === null ? 'Argon forms no bonds, so it is not given an electronegativity.' : 'Electronegativity rises across the period: more protons, similar shielding and a smaller radius, so the bonding pair is attracted more strongly.') : i < 3 ? 'Giant metallic lattice: more delocalised electrons per atom and a higher charge on the ion from Na to Al, so stronger metallic bonding and a higher melting point.' : i === 3 ? 'Giant covalent lattice: many strong covalent bonds must be broken, so silicon has by far the highest melting point.' : i < 7 ? 'Simple molecules: only weak intermolecular forces are overcome. S₈ is bigger than P₄, with more electrons, so its London (instantaneous dipole) forces are stronger.' : 'Single atoms or small molecules with very few electrons: the weakest forces of all, so the lowest melting points.'}</span>`; }
    }
    c.addEventListener('pointermove', ev => { const r = c.getBoundingClientRect(), n = mode === 'ie' ? 36 : 8, i = Math.floor((ev.clientX - r.left - 50) / ((w - 64) / n)); if (i >= 0 && i < n) { const z = mode === 'ie' ? i + 1 : 11 + i; if (z !== at) { at = z; draw(); } } });
    seg(body.querySelector('.seg'), v => { mode = v; if (v !== 'ie' && (at < 11 || at > 18)) at = 11; draw(); }); draw();
  };

  /* ---------- shapes of molecules (VSEPR) ---------- */
  W.shapes = function (root) {
    const s3 = Math.sqrt(3) / 2, TET = [[0, 1, 0], [.943, -.333, 0], [-.471, -.333, .816], [-.471, -.333, -.816]];
    const MOL = {
      BeCl2: ['BeCl₂', 'Be', 'Cl', [[1, 0, 0], [-1, 0, 0]], [], 'linear', '180°', 2],
      CO2: ['CO₂', 'C', 'O', [[1, 0, 0], [-1, 0, 0]], [], 'linear', '180°', 2, 2],
      BF3: ['BF₃', 'B', 'F', [[0, 1, 0], [s3, -.5, 0], [-s3, -.5, 0]], [], 'trigonal planar', '120°', 3],
      CH4: ['CH₄', 'C', 'H', TET, [], 'tetrahedral', '109.5°', 4],
      NH3: ['NH₃', 'N', 'H', TET.slice(1).map(v => [v[0] * .95, v[1] - .08, v[2] * .95]), [TET[0]], 'pyramidal', '107°', 3],
      H2O: ['H₂O', 'O', 'H', [[.9, -.42, 0], [-.9, -.42, 0]], [[0, .55, .82], [0, .55, -.82]], 'non-linear (bent)', '104.5°', 2],
      PCl5: ['PCl₅', 'P', 'Cl', [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-.5, 0, s3], [-.5, 0, -s3]], [], 'trigonal bipyramidal', '90° and 120°', 5],
      SF6: ['SF₆', 'S', 'F', [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], [], 'octahedral', '90°', 6],
    };
    const COL = { Be: '#9fb8a8', C: '#3b4552', B: '#f2a5a0', N: '#4f8ee8', O: '#e8594d', P: '#f09a2e', S: '#e8c83a', Cl: '#5dc26b', F: '#a9e07a', H: '#ffffff' };
    const body = frame(root, 'Shapes of molecules', 'Electron pairs around the central atom repel each other and get as far apart as possible. Lone pairs, drawn as clouds, repel more strongly than bonding pairs. A double bond counts as one region of electrons. Drag the molecule to turn it.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Molecule">${Object.keys(MOL).map((k, i) => `<button type="button" data-v="${k}"${i === 3 ? ' class="is-on"' : ''}>${MOL[k][0]}</button>`).join('')}</div><div class="fig-split"><canvas role="img" aria-label="A 3D model of the molecule. Drag to turn it."></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), read = body.querySelector('.read'); let k = 'CH4';
    function ui() { const m = MOL[k], lp = m[4].length; read.innerHTML = `<span>${m[0]}</span><span class="big">${m[5]}</span><span><b>Bond angle:</b> ${m[6]}</span><span><b>Around ${m[1]}:</b> ${m[7]} bonding region${m[7] > 1 ? 's' : ''}${m[8] ? ' (double bonds)' : ''}, ${lp} lone pair${lp === 1 ? '' : 's'}.</span><span>${lp ? `Each lone pair repels more than a bonding pair, so it squeezes the bonds closer together: about 2.5° less for each lone pair than the 109.5° of a tetrahedron.` : m[7] === 4 ? 'Four bonding pairs and no lone pairs: the regular tetrahedron, the arrangement with the pairs furthest apart in 3D.' : `${m[7]} regions of electrons, all bonding, spread out as far as possible.`}</span>`; }
    spin3d(c, 300, (g, w, h, P, S) => {
      const m = MOL[k], ctr = P(0, 0, 0), items = [];
      m[3].forEach(v => { const L = m[2] === 'H' ? .85 : 1.05, q = P(v[0] * L, v[1] * L, v[2] * L); items.push({ z: (ctr.z + q.z) / 2 - .01, f: () => { g.strokeStyle = '#7d8b99'; g.lineWidth = 5 * q.p; if (m[8]) { const dx = q.x - ctr.x, dy = q.y - ctr.y, d = Math.hypot(dx, dy) || 1, ox = -dy / d * 4, oy = dx / d * 4; g.lineWidth = 3 * q.p; g.beginPath(); g.moveTo(ctr.x + ox, ctr.y + oy); g.lineTo(q.x + ox, q.y + oy); g.moveTo(ctr.x - ox, ctr.y - oy); g.lineTo(q.x - ox, q.y - oy); g.stroke(); } else { g.beginPath(); g.moveTo(ctr.x, ctr.y); g.lineTo(q.x, q.y); g.stroke(); } } }); items.push({ z: q.z, f: () => shade(g, q.x, q.y, (m[2] === 'H' ? .2 : .3) * S * q.p, COL[m[2]], 1) }); });
      m[4].forEach(v => { const q = P(v[0] * .62, v[1] * .62, v[2] * .62); items.push({ z: q.z + .05, f: () => { const r = .3 * S * q.p, gr = g.createRadialGradient(q.x, q.y, 0, q.x, q.y, r); gr.addColorStop(0, 'rgba(240,154,46,.55)'); gr.addColorStop(1, 'rgba(240,154,46,0)'); g.fillStyle = gr; g.beginPath(); g.arc(q.x, q.y, r, 0, TAU); g.fill(); ball(g, q.x - 4 * q.p, q.y, 2.6 * q.p, '#a85d00'); ball(g, q.x + 4 * q.p, q.y, 2.6 * q.p, '#a85d00'); } }); });
      items.push({ z: ctr.z, f: () => shade(g, ctr.x, ctr.y, .36 * S * ctr.p, COL[m[1]], 1) });
      items.sort((a, b) => a.z - b.z).forEach(it => it.f());
      g.font = '400 11.5px Jost, sans-serif'; g.fillStyle = INK3; g.textAlign = 'left'; g.fillText('drag to turn', 10, h - 10);
    }, { scale: 100 });
    seg(body.querySelector('.seg'), v => { k = v; ui(); }); ui();
  };

  /* ---------- bond energies ---------- */
  W.bonds = function (root) {
    const BE = { 'H–H': 436, 'C–H': 410, 'C–C': 350, 'C=C': 610, 'O=O': 496, 'O–H': 460, 'C=O': 805, 'C≡O': 1077, 'N≡N': 944, 'N–H': 388, 'Cl–Cl': 242, 'H–Cl': 431 };
    const RX = [
      ['Methane burns', 'CH₄ + 2O₂ → CO₂ + 2H₂O', [['C–H', 4], ['O=O', 2]], [['C=O', 2], ['O–H', 4]], -802],
      ['Hydrogen burns', '2H₂ + O₂ → 2H₂O', [['H–H', 2], ['O=O', 1]], [['O–H', 4]], -484],
      ['H₂ + Cl₂', 'H₂ + Cl₂ → 2HCl', [['H–H', 1], ['Cl–Cl', 1]], [['H–Cl', 2]], -185],
      ['Haber process', 'N₂ + 3H₂ ⇌ 2NH₃', [['N≡N', 1], ['H–H', 3]], [['N–H', 6]], -92],
      ['Ethene + H₂', 'C₂H₄ + H₂ → C₂H₆', [['C=C', 1], ['C–H', 4], ['H–H', 1]], [['C–C', 1], ['C–H', 6]], -137],
      ['Steam reforming', 'CH₄ + H₂O → CO + 3H₂', [['C–H', 4], ['O–H', 2]], [['C≡O', 1], ['H–H', 3]], 206],
    ];
    const body = frame(root, 'Break bonds, make bonds', 'Bond energies are averages over many compounds (values from the Cambridge data booklet), so the answer is close to, but not the same as, the measured enthalpy change. Everything here is a gas.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Reaction">${RX.map((r, i) => `<button type="button" data-v="${i}"${i ? '' : ' class="is-on"'}>${r[0]}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 320), read = body.querySelector('.read'); let at = 0;
    function draw() {
      const [, eq, br, mk, meas] = RX[at], B = br.reduce((s, [b, n]) => s + BE[b] * n, 0), M = mk.reduce((s, [b, n]) => s + BE[b] * n, 0), dH = B - M;
      const top = 30, bot = h - 34, lo = Math.min(0, dH), hi = B, Y = e => bot - (e - lo) / (hi - lo) * (bot - top), x0 = 60, x1 = w - 20, xm = (x0 + x1) / 2;
      g.clearRect(0, 0, w, h); g.font = '400 12px Jost, sans-serif';
      g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0 - 20, bot + 6); g.lineTo(x0 - 20, top - 8); g.stroke(); g.save(); g.translate(x0 - 30, (top + bot) / 2); g.rotate(-Math.PI / 2); g.fillStyle = INK2; g.textAlign = 'center'; g.fillText('energy', 0, 0); g.restore();
      const lvl = (y, xa, xb, label, col) => { g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(xa, y); g.lineTo(xb, y); g.stroke(); g.fillStyle = INK; g.textAlign = 'center'; g.fillText(label, (xa + xb) / 2, y - 7); };
      const arrow = (x, ya, yb, col, label) => { g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, ya); g.lineTo(x, yb); g.stroke(); const d = yb > ya ? 1 : -1; g.beginPath(); g.moveTo(x, yb); g.lineTo(x - 6, yb - 10 * d); g.lineTo(x + 6, yb - 10 * d); g.closePath(); g.fill(); g.textAlign = 'left'; g.fillText(label, x + 9, (ya + yb) / 2 + 4); };
      lvl(Y(0), x0, x0 + (x1 - x0) * .32, eq.split(/ → | ⇌ /)[0], INK2); lvl(Y(B), x0 + (x1 - x0) * .25, x0 + (x1 - x0) * .75, 'separate atoms', INK3); lvl(Y(dH), x1 - (x1 - x0) * .32, x1, eq.split(/ → | ⇌ /)[1], INK2);
      arrow(x0 + (x1 - x0) * .29, Y(0), Y(B) + 3, SUN, `+${B}`); arrow(x1 - (x1 - x0) * .29, Y(B) + 3, Y(dH), BLUE, `−${M}`);
      g.setLineDash([4, 4]); g.strokeStyle = INK3; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + (x1 - x0) * .32, Y(0)); g.lineTo(x1 - (x1 - x0) * .32, Y(0)); g.stroke(); g.setLineDash([]);
      g.fillStyle = dH < 0 ? '#2f7d4f' : '#b3412f'; g.textAlign = 'center'; g.fillText(`ΔH = ${dH > 0 ? '+' : ''}${mn(dH)} kJ/mol`, xm, (Y(0) + Y(dH)) / 2 + (dH < 0 ? 4 : -4));
      const row = l => l.map(([b, n]) => `${n} × ${b} (${BE[b]})`).join(' + ');
      read.innerHTML = `<span class="eqn">${eq}</span><span><b>Bonds broken</b> (energy taken in): ${row(br)} = <b>+${B} kJ</b></span><span><b>Bonds made</b> (energy given out): ${row(mk)} = <b>−${M} kJ</b></span><span>ΔH = energy in − energy out</span><span class="big">${dH > 0 ? '+' : ''}${mn(dH)} kJ/mol</span><span>${dH < 0 ? '<b>Exothermic:</b> more energy is given out making the new bonds than is taken in breaking the old ones.' : '<b>Endothermic:</b> more energy is taken in breaking bonds than is given out making new ones.'} Measured value: ${meas > 0 ? '+' : ''}${mn(meas)} kJ/mol.</span>`;
    }
    seg(body.querySelector('.seg'), v => { at = +v; draw(); }); draw();
  };

  /* ---------- orders of reaction ---------- */
  W.orders = function (root) {
    const body = frame(root, 'Zero, first and second order', 'A reaction A → products, at constant temperature, so k stays fixed. The left graph is the concentration against time; the right graph is the rate against concentration, which is what tells the orders apart at a glance.');
    const kid = id('k'), aid = id('a'), K0 = [.01, .03, .05], UNIT = ['mol dm⁻³ s⁻¹', 's⁻¹', 'dm³ mol⁻¹ s⁻¹'];
    body.innerHTML = `<div class="fig-split" style="grid-template-columns:minmax(0,1fr)"><canvas></canvas></div><div class="fig-split"><div class="ctl"><div class="seg" role="group" aria-label="Order"><button type="button" data-v="0">Zero order</button><button type="button" class="is-on" data-v="1">First order</button><button type="button" data-v="2">Second order</button></div><label for="${kid}"><span>Rate constant, k <b></b></span><input id="${kid}" type="range" min="0.5" max="2" value="1" step="0.1"></label><label for="${aid}"><span>Starting [A] <b></b></span><input id="${aid}" type="range" min="0.4" max="2" value="1.6" step="0.1"></label></div><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 280), [ks, as] = [...body.querySelectorAll('input')], outs = body.querySelectorAll('label b'), read = body.querySelector('.read'); let n = 1;
    const conc = (t, k, A0) => n === 0 ? Math.max(0, A0 - k * t) : n === 1 ? A0 * Math.exp(-k * t) : A0 / (1 + A0 * k * t);
    function draw() {
      const k = K0[n] * +ks.value, A0 = +as.value, half = n === 0 ? A0 / (2 * k) : n === 1 ? Math.LN2 / k : 1 / (k * A0); outs[0].textContent = sig(k, 2) + ' ' + UNIT[n]; outs[1].textContent = fmt(A0, 1) + ' mol/dm³';
      g.clearRect(0, 0, w, h); g.font = '400 11px Jost, sans-serif'; const mid = w / 2, top = 18, bot = h - 36;
      const A = { x0: 46, x1: mid - 16 }, B = { x0: mid + 40, x1: w - 14 }, XA = t => A.x0 + t / 100 * (A.x1 - A.x0), YA = v => bot - v / 2 * (bot - top);
      g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'right'; for (let v = 0; v <= 2; v += .5) { g.beginPath(); g.moveTo(A.x0, YA(v)); g.lineTo(A.x1, YA(v)); g.stroke(); g.fillText(v.toFixed(1), A.x0 - 5, YA(v) + 4); } g.textAlign = 'center'; for (let t = 0; t <= 100; t += 25) g.fillText(t, XA(t), bot + 14);
      axes(g, A.x0, bot, A.x1, top); g.fillStyle = INK2; g.fillText('time / s', (A.x0 + A.x1) / 2, h - 6); g.save(); g.translate(12, (top + bot) / 2); g.rotate(-Math.PI / 2); g.fillText('[A] / mol dm⁻³', 0, 0); g.restore();
      if (n === 1) { g.setLineDash([3, 4]); g.strokeStyle = SUN; g.lineWidth = 1.3; for (let j = 1; j <= 3; j++) { const t = half * j; if (t > 100) break; const v = A0 / Math.pow(2, j); g.beginPath(); g.moveTo(A.x0, YA(v)); g.lineTo(XA(t), YA(v)); g.lineTo(XA(t), bot); g.stroke(); } g.setLineDash([]); }
      g.beginPath(); for (let t = 0; t <= 100; t += .5) { const y = YA(conc(t, k, A0)); t ? g.lineTo(XA(t), y) : g.moveTo(XA(t), y); } g.strokeStyle = BLUE; g.lineWidth = 3; g.stroke();
      const rmax = K0[n] * 2 * Math.pow(2, n), XB = v => B.x0 + v / 2 * (B.x1 - B.x0), YB = r => bot - r / rmax * (bot - top);
      g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'center'; for (let v = 0; v <= 2; v += .5) { g.beginPath(); g.moveTo(XB(v), top); g.lineTo(XB(v), bot); g.stroke(); g.fillText(v.toFixed(1), XB(v), bot + 14); }
      axes(g, B.x0, bot, B.x1, top); g.fillStyle = INK2; g.fillText('[A] / mol dm⁻³', (B.x0 + B.x1) / 2, h - 6); g.save(); g.translate(B.x0 - 14, (top + bot) / 2); g.rotate(-Math.PI / 2); g.fillText('rate', 0, 0); g.restore();
      g.beginPath(); for (let v = 0; v <= 2; v += .02) { const y = YB(k * Math.pow(v, n)); v ? g.lineTo(XB(v), y) : g.moveTo(XB(v), y); } g.strokeStyle = '#2f9a6b'; g.lineWidth = 3; g.stroke(); ball(g, XB(A0), YB(k * Math.pow(A0, n)), 4.5, SUN, INK);
      const eq = n === 0 ? 'rate = k' : n === 1 ? 'rate = k[A]' : 'rate = k[A]²';
      read.innerHTML = `<span class="eqn">${eq}</span><span>Half-life</span><span class="big">${sig(half, 3)} s</span><span><b>Units of k:</b> ${UNIT[n]}</span><span>${n === 0 ? '<b>Zero order:</b> the rate does not depend on [A], so [A] falls in a straight line. Each half-life is half as long as the one before.' : n === 1 ? '<b>First order:</b> double [A] and the rate doubles. The half-life is constant, whatever the starting concentration: t½ = ln 2 ÷ k. The dashed lines mark three equal half-lives.' : '<b>Second order:</b> double [A] and the rate goes up four times. The rate-concentration graph is a curve, and each half-life is twice as long as the one before.'}</span>`;
    }
    seg(body.querySelector('.seg'), v => { n = +v; draw(); }); ks.addEventListener('input', draw); as.addEventListener('input', draw); draw();
  };

  /* ---------- electrochemical cells ---------- */
  W.cell = function (root) {
    const HC = {
      Mg: ['Mg²⁺', 'Mg', 2, -2.38, '#c9d0d8', 'rgba(235,240,246,.9)', 1], Zn: ['Zn²⁺', 'Zn', 2, -0.76, '#aab4c0', 'rgba(235,240,246,.9)', 1], Fe: ['Fe²⁺', 'Fe', 2, -0.44, '#7d8590', 'rgba(205,232,200,.85)', 1],
      Pb: ['Pb²⁺', 'Pb', 2, -0.13, '#6e7787', 'rgba(235,240,246,.9)', 1], H: ['H⁺', 'H₂', 2, 0, '#d6dbe0', 'rgba(235,240,246,.9)', 2], Cu: ['Cu²⁺', 'Cu', 2, 0.34, '#c97a44', 'rgba(120,175,235,.75)', 1], Ag: ['Ag⁺', 'Ag', 1, 0.80, '#dfe3e8', 'rgba(240,244,248,.9)', 1],
    };
    const cid = id('c');
    const body = frame(root, 'Build an electrochemical cell', 'The left half-cell is standard: 1.00 mol/dm³ at 298 K. Change the concentration of the ion on the right and the Nernst equation gives its new electrode potential. Electrode potentials from the Cambridge data booklet. The hydrogen electrode is platinum with hydrogen gas bubbling over it.');
    const pick = side => `<div class="seg" role="group" aria-label="${side} half-cell">${Object.keys(HC).map(k => `<button type="button" data-v="${k}"${(side === 'Left' ? 'Zn' : 'Cu') === k ? ' class="is-on"' : ''}>${HC[k][0]}/${HC[k][1]}</button>`).join('')}</div>`;
    body.innerHTML = `<div class="fig-split" style="grid-template-columns:minmax(0,1fr)"><canvas></canvas></div><div class="fig-split"><div class="ctl"><span style="font-size:13.5px;color:var(--ink-2)">Left half-cell</span>${pick('Left')}<span style="font-size:13.5px;color:var(--ink-2)">Right half-cell</span>${pick('Right')}<label for="${cid}"><span>Concentration of the right-hand ion <b></b></span><input id="${cid}" type="range" min="-3" max="0" value="0" step="0.1"></label></div><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 280), read = body.querySelector('.read'), segs = body.querySelectorAll('.seg'), cs = body.querySelector('input'), out = body.querySelector('label b'); let Lk = 'Zn', Rk = 'Cu', E = 0, posLeft = false; const dots = Array.from({ length: 14 }, (_, i) => i / 14);
    const nernst = (k, conc) => { const d = HC[k]; return d[3] + 0.059 / d[2] * Math.log10(Math.pow(conc, d[6])); };
    const lcm = (a, b) => a * b / (a === b ? a : 1), co = (n, s) => (n === 1 ? '' : n) + s;
    function half(k, m, ox) { const d = HC[k], eN = d[2] * m, el = d[1] === 'H₂' ? 'H₂(g)' : d[1] + '(s)', ion = d[0] + '(aq)'; return ox ? `${co(m, el)} → ${co(d[6] * m, ion)} + ${co(eN, 'e⁻')}` : `${co(d[6] * m, ion)} + ${co(eN, 'e⁻')} → ${co(m, el)}`; }
    function ui() {
      const conc = Math.pow(10, +cs.value), EL = HC[Lk][3], ER = nernst(Rk, conc); E = Math.abs(ER - EL); posLeft = EL > ER; out.textContent = sig(conc, 2) + ' mol/dm³';
      const neg = posLeft ? Rk : Lk, pos = posLeft ? Lk : Rk, z = lcm(HC[neg][2], HC[pos][2]), mN = z / HC[neg][2], mP = z / HC[pos][2];
      const lhs = [co(mN, HC[neg][1] === 'H₂' ? 'H₂' : HC[neg][1]), co(HC[pos][6] * mP, HC[pos][0])].join(' + '), rhs = [co(HC[neg][6] * mN, HC[neg][0]), co(mP, HC[pos][1])].join(' + ');
      read.innerHTML = E < .0005 ? `<span>Cell voltage</span><span class="big">0.00 V</span><span>Both electrodes have the same potential, so there is no push on the electrons and no current.</span>` : `<span>Cell voltage, E<sub>cell</sub></span><span class="big">${fmt(E, 2)} V</span><span class="eqn">E<sub>cell</sub> = E(positive) − E(negative) = ${mn(fmt(Math.max(EL, ER), 2))} − (${mn(fmt(Math.min(EL, ER), 2))})</span><span><b>Negative electrode, ${HC[neg][1] === 'H₂' ? 'Pt in H₂' : HC[neg][1]}:</b> oxidation. ${half(neg, 1, true)}</span><span><b>Positive electrode, ${HC[pos][1] === 'H₂' ? 'Pt in H₂' : HC[pos][1]}:</b> reduction. ${half(pos, 1, false)}</span><span><b>Overall:</b> ${lhs} → ${rhs}</span><span>Electrons flow through the wire from the negative to the positive electrode. Ions move through the salt bridge to balance the charge.${Math.abs(+cs.value) > .01 ? ` At ${sig(conc, 2)} mol/dm³, E(${HC[Rk][0]}/${HC[Rk][1]}) = ${HC[Rk][3] >= 0 ? '+' : ''}${mn(fmt(HC[Rk][3], 2))} + (0.059/${HC[Rk][2]}) log(${sig(conc, 2)}${HC[Rk][6] > 1 ? '²' : ''}) = ${mn(fmt(ER, 3))} V.` : ''}</span>`;
    }
    loop(c, dt => {
      g.clearRect(0, 0, w, h); g.font = '400 12px Jost, sans-serif'; const bw = Math.min(150, w * .28), lx = w * .25, rx = w * .75, by = 120, bb = h - 22;
      [[lx, Lk], [rx, Rk]].forEach(([x, k], i) => { const d = HC[k], conc = i ? Math.pow(10, +cs.value) : 1; g.fillStyle = d[5]; g.globalAlpha = k === 'Cu' && i ? .35 + .65 * Math.pow(conc, .35) : 1; g.fillRect(x - bw / 2 + 2, by + 30, bw - 4, bb - by - 32); g.globalAlpha = 1; g.strokeStyle = INK2; g.lineWidth = 2; g.beginPath(); g.moveTo(x - bw / 2, by); g.lineTo(x - bw / 2, bb); g.lineTo(x + bw / 2, bb); g.lineTo(x + bw / 2, by); g.stroke();
        g.fillStyle = d[4]; g.strokeStyle = 'rgba(10,36,64,.4)'; g.lineWidth = 1; g.fillRect(x - 9, 56, 18, bb - 66); g.strokeRect(x - 9, 56, 18, bb - 66);
        if (k === 'H') { for (let j = 0; j < 6; j++) { const t = (performance.now() / 1000 * .6 + j / 6) % 1; ball(g, x + 16 + Math.sin(j * 2) * 4, bb - 14 - t * (bb - by - 50), 3, 'rgba(255,255,255,.9)', 'rgba(10,36,64,.3)'); } }
        g.fillStyle = INK; g.textAlign = 'center'; g.fillText(`${d[0]}/${d[1]}`, x, bb - 6); const isPos = (i === 0) === posLeft; if (E > .0005) { g.fillStyle = isPos ? '#b3412f' : BLUE; g.font = '500 18px Jost, sans-serif'; g.fillText(isPos ? '+' : '−', x - 22, 70); g.font = '400 12px Jost, sans-serif'; } });
      g.strokeStyle = '#d9b26a'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx + bw * .28, by + 52); g.lineTo(lx + bw * .28, by - 14); g.lineTo(rx - bw * .28, by - 14); g.lineTo(rx - bw * .28, by + 52); g.stroke(); g.lineCap = 'butt'; g.fillStyle = INK3; g.fillText('salt bridge', w / 2, by - 28);
      const vy = 30; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(lx, 56); g.lineTo(lx, vy); g.lineTo(rx, vy); g.lineTo(rx, 56); g.stroke();
      g.fillStyle = '#fff'; rr(g, w / 2 - 36, vy - 18, 72, 36, 8); g.fill(); g.stroke(); g.fillStyle = INK; g.font = '500 16px JetBrains Mono, monospace'; g.fillText(fmt(E, 2) + ' V', w / 2, vy + 6); g.font = '400 12px Jost, sans-serif';
      if (E > .0005) { const len = (rx - lx) + 2 * (56 - vy), sp = .08 + E * .05; for (let i = 0; i < dots.length; i++) { dots[i] = (dots[i] + dt * sp) % 1; const f = posLeft ? 1 - dots[i] : dots[i]; let s = f * len, x, y; if (s < 56 - vy) { x = lx; y = 56 - s; } else if (s < 56 - vy + rx - lx) { x = lx + s - (56 - vy); y = vy; } else { x = rx; y = vy + s - (56 - vy) - (rx - lx); } if (Math.abs(x - w / 2) < 38 && y === vy) continue; ball(g, x, y, 3.2, '#ffd54a', '#a85d00'); } g.fillStyle = '#a85d00'; g.textAlign = posLeft ? 'right' : 'left'; g.fillText('e⁻ flow ' + (posLeft ? '←' : '→'), posLeft ? w / 2 - 44 : w / 2 + 44, vy - 6); }
    });
    seg(segs[0], v => { Lk = v; ui(); }); seg(segs[1], v => { Rk = v; ui(); }); cs.addEventListener('input', ui); ui();
  };

  /* ---------- proton NMR ---------- */
  W.nmr = function (root) {
    const NMR = {
      ethanol: ['Ethanol', 'CH₃CH₂OH', [[1.2, 3, 2, 'CH₃', 'next to a CH₂: 2 neighbouring H, so n + 1 = 3, a triplet'], [3.7, 2, 3, 'CH₂', 'next to a CH₃: 3 neighbouring H, a quartet. Shifted up by the electronegative O'], [2.6, 1, 0, 'O–H', 'no splitting: the H on O swaps between molecules too fast. Its position varies', 1]]],
      chloroethane: ['Chloroethane', 'CH₃CH₂Cl', [[1.5, 3, 2, 'CH₃', '2 neighbouring H: a triplet'], [3.6, 2, 3, 'CH₂', '3 neighbouring H: a quartet. Next to Cl, so shifted up']]],
      dichloro: ['1,1-dichloroethane', 'CH₃CHCl₂', [[2.1, 3, 1, 'CH₃', '1 neighbouring H: a doublet'], [5.9, 1, 3, 'CH', '3 neighbouring H: a quartet. Two Cl atoms pull electron density away, so it is shifted a long way up']]],
      propanone: ['Propanone', 'CH₃COCH₃', [[2.1, 6, 0, '2 × CH₃', 'both CH₃ groups are the same environment. The neighbouring carbon is C=O, which has no H, so a singlet']]],
      ester: ['Ethyl ethanoate', 'CH₃COOCH₂CH₃', [[2.0, 3, 0, 'CH₃–C=O', 'next to C=O, which has no H: a singlet'], [4.1, 2, 3, 'O–CH₂', 'next to O, and 3 neighbouring H: a quartet'], [1.3, 3, 2, 'CH₃ (ethyl)', '2 neighbouring H: a triplet']]],
      acid: ['Ethanoic acid', 'CH₃COOH', [[2.1, 3, 0, 'CH₃', 'next to C=O: a singlet'], [11.5, 1, 0, 'COOH', 'the acid O–H: far downfield, no splitting', 1]]],
    };
    const MULT = ['singlet', 'doublet', 'triplet', 'quartet'], did = id('d');
    const body = frame(root, 'Read a proton NMR spectrum', 'Drawn as at 400 MHz, with the splitting widened so you can count the lines. Shifts are typical values; δ is measured from TMS, the peak at 0. The stepped orange line is the integration trace: the height of each step is in proportion to the number of H atoms in that environment. Point at a peak.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Compound">${Object.keys(NMR).map((k, i) => `<button type="button" data-v="${k}"${i ? '' : ' class="is-on"'}>${NMR[k][0]}</button>`).join('')}</div><div class="fig-split" style="grid-template-columns:minmax(0,1fr)"><canvas></canvas></div><div class="fig-split"><div class="ctl"><label for="${did}" style="display:flex;gap:8px;align-items:center"><input id="${did}" type="checkbox"> <span>Shake with D₂O</span></label><div class="read big-f"></div></div><div class="read info"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 280), [r1, r2] = body.querySelectorAll('.read'), cb = body.querySelector('#' + did); let k = 'ethanol', at = 0;
    const X = d => 30 + (12.5 - d) / 13 * (w - 50), base = h - 40, J = .07, gam = .013;
    const pas = n => { let r = [1]; for (let i = 0; i < n; i++) r = r.map((v, j) => v + (r[j - 1] || 0)).concat(1); return r; };
    const peaks = () => NMR[k][2].filter(p => !(cb.checked && p[5]));
    function draw() {
      const P = peaks(), lines = []; P.forEach((p, pi) => { const ps = pas(p[2]), s = ps.reduce((a, b) => a + b, 0); ps.forEach((v, j) => lines.push([p[0] + (j - p[2] / 2) * J, p[1] * v / s, pi])); }); lines.push([0, .7, -1]);
      const ymax = Math.max(...lines.map(l => l[1])), Hs = (base - 40) / ymax;
      g.clearRect(0, 0, w, h); g.font = '400 11.5px Jost, sans-serif'; g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'center';
      for (let d = 0; d <= 12; d++) { g.beginPath(); g.moveTo(X(d), base); g.lineTo(X(d), base + 5); g.stroke(); g.fillText(d, X(d), base + 18); } g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(12.5), base); g.lineTo(X(-.5), base); g.stroke(); g.fillStyle = INK2; g.fillText('chemical shift, δ / ppm', w / 2, h - 6);
      g.beginPath(); for (let x = X(12.5); x <= X(-.5); x += .5) { const d = 12.5 - (x - 30) / (w - 50) * 13; let y = 0; for (const [dd, a] of lines) y += a * gam * gam / ((d - dd) * (d - dd) + gam * gam); const yy = base - y * Hs; x === X(12.5) ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.strokeStyle = BLUE; g.lineWidth = 1.6; g.stroke();
      const tot = P.reduce((s, p) => s + p[1], 0), step = 70 / Math.max(1, tot), sorted = [...P].sort((a, b) => b[0] - a[0]); let acc = 0; const iy = base - 10; g.beginPath(); g.moveTo(X(12.5), iy); sorted.forEach(p => { const x0 = X(p[0] + .25), x1 = X(p[0] - .25); g.lineTo(x0, iy - acc); acc += p[1] * step; g.lineTo(x1, iy - acc); }); g.lineTo(X(-.5), iy - acc); g.strokeStyle = SUN; g.lineWidth = 2; g.stroke();
      P.forEach((p, i) => { const tall = Math.max(...lines.filter(l => l[2] === i).map(l => l[1])) * Hs; g.fillStyle = i === at ? INK : INK3; g.font = (i === at ? '500 ' : '400 ') + '12px Jost, sans-serif'; g.fillText(`${p[1]}H ${MULT[p[2]] || (p[2] + 1) + ' lines'}`, X(p[0]), Math.max(14, base - tall - 8)); if (i === at) { g.fillStyle = 'rgba(240,154,46,.14)'; g.fillRect(X(p[0] + .3), 20, X(p[0] - .3) - X(p[0] + .3), base - 20); } });
      g.fillStyle = INK3; g.font = '400 11px Jost, sans-serif'; g.fillText('TMS', X(0), base - .7 * Hs - 6);
      const p = P[at] || P[0];
      r1.innerHTML = `<span>${NMR[k][0]}</span><span class="big" style="font-size:26px">${NMR[k][1]}</span><span>${P.length} peak${P.length > 1 ? 's' : ''}: ${P.length} different H environment${P.length > 1 ? 's' : ''}.</span>${cb.checked ? `<span>${NMR[k][2].some(q => q[5]) ? '<b>D₂O shake:</b> the O–H proton swaps for deuterium, which does not show up, so that peak disappears. This is how you prove a peak is O–H or N–H.' : 'No O–H or N–H here, so shaking with D₂O changes nothing.'}</span>` : ''}`;
      r2.innerHTML = p ? `<span>Peak at δ ≈ ${p[0]} ppm</span><span class="big" style="font-size:26px">${p[3]}</span><span><b>${p[1]} H</b> · ${MULT[p[2]]}</span><span>${p[4]}.</span><span>The n + 1 rule: H atoms on the next carbon split a peak into n + 1 lines.</span>` : '';
    }
    c.addEventListener('pointermove', ev => { const r = c.getBoundingClientRect(), d = 12.5 - (ev.clientX - r.left - 30) / (w - 50) * 13, P = peaks(); let best = -1, bd = .6; P.forEach((p, i) => { const dd = Math.abs(p[0] - d); if (dd < bd) { bd = dd; best = i; } }); if (best >= 0 && best !== at) { at = best; draw(); } });
    seg(body.querySelector('.seg'), v => { k = v; at = 0; draw(); }); cb.addEventListener('change', () => { at = 0; draw(); }); draw();
  };

  /* ---------- infrared spectra ---------- */
  W.ir = function (root) {
    const IR = {
      ethanol: ['Ethanol', 'CH₃CH₂OH', 'alcohol', [[3350, 130, .78, 'O–H (alcohol)'], [2975, 35, .6, 'C–H'], [2890, 25, .35], [1450, 18, .32], [1380, 14, .3], [1090, 16, .5], [1050, 18, .72, 'C–O'], [880, 12, .38]]],
      acid: ['Ethanoic acid', 'CH₃COOH', 'carboxylic acid', [[3000, 280, .62, 'O–H (acid), very broad'], [1715, 24, .88, 'C=O'], [1410, 16, .4], [1290, 24, .6, 'C–O'], [940, 22, .42], [620, 14, .3]]],
      propanone: ['Propanone', 'CH₃COCH₃', 'ketone', [[3005, 28, .32, 'C–H'], [1715, 22, .9, 'C=O'], [1420, 14, .4], [1360, 14, .56], [1220, 16, .62], [530, 14, .3]]],
      ester: ['Ethyl ethanoate', 'CH₃COOCH₂CH₃', 'ester', [[2985, 30, .42, 'C–H'], [1742, 20, .9, 'C=O'], [1375, 12, .45], [1240, 26, .82, 'C–O'], [1050, 20, .6], [940, 12, .3]]],
      hexane: ['Hexane', 'CH₃(CH₂)₄CH₃', 'alkane', [[2960, 22, .75, 'C–H'], [2875, 22, .6], [1465, 16, .42], [1380, 10, .3], [725, 12, .26]]],
      nitrile: ['Propanenitrile', 'CH₃CH₂CN', 'nitrile', [[2990, 28, .4, 'C–H'], [2250, 16, .62, 'C≡N'], [1460, 15, .4], [1080, 16, .32], [785, 14, .3]]],
      amine: ['Propylamine', 'CH₃CH₂CH₂NH₂', 'primary amine', [[3370, 30, .3, 'N–H'], [3290, 30, .28], [2960, 26, .62, 'C–H'], [2875, 22, .45], [1610, 22, .3], [1465, 15, .35], [800, 40, .4]]],
    };
    const BANDS = [['O–H, N–H', 3200, 3600], ['C–H', 2850, 3000], ['C≡N', 2200, 2260], ['C=O', 1670, 1750], ['fingerprint', 500, 1500]];
    const bid = id('b');
    const body = frame(root, 'Read an infrared spectrum', 'A spectrum built from typical absorption positions, not a measured one. Wavenumbers fall from left to right, as on a real spectrum. Ranges from the Cambridge data booklet: O–H in an alcohol 3200–3600 cm⁻¹, O–H in an acid 2500–3000 cm⁻¹, C=O 1670–1740 cm⁻¹, C–O 1040–1300 cm⁻¹.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Compound">${Object.keys(IR).map((k, i) => `<button type="button" data-v="${k}"${i ? '' : ' class="is-on"'}>${IR[k][0]}</button>`).join('')}</div><div class="fig-split" style="grid-template-columns:minmax(0,1fr)"><canvas></canvas></div><div class="fig-split"><div class="ctl"><label for="${bid}" style="display:flex;gap:8px;align-items:center"><input id="${bid}" type="checkbox" checked> <span>Show the key ranges</span></label></div><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 260), read = body.querySelector('.read'), cb = body.querySelector('#' + bid); let k = 'ethanol';
    const X = v => 44 + (4000 - v) / 3500 * (w - 60), Y = t => h - 34 - t / 100 * (h - 54);
    function draw() {
      const pk = IR[k][3]; g.clearRect(0, 0, w, h); g.font = '400 11px Jost, sans-serif';
      if (cb.checked) BANDS.forEach(([l, a, b], i) => { g.fillStyle = i === 4 ? 'rgba(10,36,64,.05)' : 'rgba(240,154,46,.13)'; g.fillRect(X(b), Y(100), X(a) - X(b), Y(0) - Y(100)); g.fillStyle = '#a85d00'; g.textAlign = 'center'; g.fillText(l, (X(a) + X(b)) / 2, Y(100) + 12); });
      g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'right'; for (let t = 0; t <= 100; t += 25) { g.beginPath(); g.moveTo(X(4000), Y(t)); g.lineTo(X(500), Y(t)); g.stroke(); g.fillText(t, X(4000) - 5, Y(t) + 4); }
      g.textAlign = 'center'; for (let v = 4000; v >= 500; v -= 500) g.fillText(v, X(v), Y(0) + 14); g.fillStyle = INK2; g.fillText('wavenumber / cm⁻¹', w / 2, h - 4); g.save(); g.translate(12, Y(50)); g.rotate(-Math.PI / 2); g.fillText('transmittance / %', 0, 0); g.restore(); axes(g, X(4000), Y(0), X(500), Y(100));
      g.beginPath(); for (let x = X(4000); x <= X(500); x += .7) { const v = 4000 - (x - 44) / (w - 60) * 3500; let a = 0; for (const [cc, s, d] of pk) a += d * Math.exp(-(v - cc) * (v - cc) / (2 * s * s)); const t = Math.max(3, 96 - 92 * Math.min(1, a) + Math.sin(v * .05) * .6 + (v < 1500 ? (Math.sin(v * .083) + Math.sin(v * .191 + 2) + Math.sin(v * .047 + 1)) * .6 : 0)); x === X(4000) ? g.moveTo(x, Y(t)) : g.lineTo(x, Y(t)); } g.strokeStyle = BLUE; g.lineWidth = 1.8; g.stroke();
      g.fillStyle = INK; g.textAlign = 'center'; pk.filter(p => p[3]).forEach(([cc, , d, l]) => { const t = 96 - 92 * Math.min(1, d); g.fillText(l.split(' ')[0], X(cc), Math.min(Y(t) + 16, Y(0) - 4)); });
      read.innerHTML = `<span>${IR[k][0]} · ${IR[k][2]}</span><span class="big" style="font-size:26px">${IR[k][1]}</span>${pk.filter(p => p[3]).map(([cc, , , l]) => `<span><b>${l}:</b> about ${cc} cm⁻¹</span>`).join('')}<span>Bonds absorb infrared at frequencies that match their vibrations, so each dip shows a bond that is present. Below 1500 cm⁻¹ the fingerprint region is unique to each compound: match it to a database to identify it for certain.</span>`;
    }
    seg(body.querySelector('.seg'), v => { k = v; draw(); }); cb.addEventListener('change', draw); draw();
  };

  /* ---------- giant structures ---------- */
  W.lattice = function (root) {
    const S = {
      nacl: ['Sodium chloride', 'giant ionic lattice', [['Bonding', 'strong electrostatic attraction between oppositely charged ions, in all directions'], ['Melting point', 'high, 1074 K: many strong ionic bonds to overcome'], ['Conducts electricity?', 'not as a solid: the ions cannot move. Yes when molten or dissolved'], ['Each ion', 'surrounded by 6 ions of the opposite charge']]],
      diamond: ['Diamond', 'giant covalent lattice', [['Bonding', 'every carbon atom forms 4 strong covalent bonds, in a tetrahedral arrangement'], ['Melting point', 'very high: all the covalent bonds must be broken'], ['Conducts electricity?', 'no: there are no free electrons or ions'], ['Hardness', 'very hard: used in cutting tools']]],
      graphite: ['Graphite', 'giant covalent, in layers', [['Bonding', 'each carbon forms 3 covalent bonds in flat hexagonal layers; the fourth electron is delocalised'], ['Between layers', 'weak forces, so the layers slide: soft and slippery, used as a lubricant'], ['Conducts electricity?', 'yes: the delocalised electrons move along the layers'], ['Melting point', 'very high: the covalent bonds in the layers are strong']]],
      metal: ['A metal', 'giant metallic lattice', [['Bonding', 'attraction between positive ions and a sea of delocalised electrons'], ['Conducts electricity?', 'yes: the delocalised electrons move through the structure'], ['Malleable and ductile', 'layers of ions can slide over each other without breaking the bonding'], ['Melting point', 'usually high: strong metallic bonding']]],
    };
    const body = frame(root, 'Turn a giant structure', 'Only a small piece of each lattice is drawn: a real crystal carries on in every direction with billions of particles. Sizes are not to scale. Drag to turn it.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Structure">${Object.keys(S).map((k, i) => `<button type="button" data-v="${k}"${i ? '' : ' class="is-on"'}>${S[k][0]}</button>`).join('')}</div><div class="fig-split"><canvas role="img" aria-label="A 3D model of the structure. Drag to turn it."></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), read = body.querySelector('.read'); let k = 'nacl', A = [], B = [], E = [];
    function build() {
      A = []; B = []; E = [];
      if (k === 'nacl') { for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let l = -1; l <= 1; l++) A.push({ x: i, y: j, z: l, t: (i + j + l + 3) % 2 ? 'Na' : 'Cl' }); }
      if (k === 'metal') { for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let l = -1; l <= 1; l++) A.push({ x: i * 1.05, y: j * 1.05, z: l * 1.05, t: 'M' }); for (let i = 0; i < 46; i++) E.push({ x: (Math.random() - .5) * 2.8, y: (Math.random() - .5) * 2.8, z: (Math.random() - .5) * 2.8, vx: Math.random() - .5, vy: Math.random() - .5, vz: Math.random() - .5 }); }
      if (k === 'diamond') { const a = 2.6, f = [[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]], pts = []; for (const [x, y, z] of f) for (const o of [0, .25]) for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let l = -1; l <= 1; l++) { const p = [x + o + i, y + o + j, z + o + l]; if (p.every(v => v >= -.01 && v <= 1.01)) pts.push(p); } const seen = new Set(); pts.forEach(p => { const key = p.map(v => v.toFixed(2)).join(); if (!seen.has(key)) { seen.add(key); A.push({ x: (p[0] - .5) * a, y: (p[1] - .5) * a, z: (p[2] - .5) * a, t: 'C' }); } }); }
      if (k === 'graphite') { const b = .5, s3 = Math.sqrt(3); for (let L = 0; L < 3; L++) { const off = L % 2 ? b : 0; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) for (const sub of [0, 1]) { const x = (i + j * .5) * b * s3 + (sub ? b * s3 / 2 : 0), z = j * b * 1.5 + (sub ? b / 2 : 0) + off; if (x * x + z * z < 1.75 * 1.75) A.push({ x, y: (L - 1) * 1.15, z, t: 'C', L }); } } }
      const bond = k === 'nacl' ? 1.01 : k === 'diamond' ? 2.6 * Math.sqrt(3) / 4 + .02 : k === 'graphite' ? .52 : 0;
      if (bond) for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) { const d = Math.hypot(A[i].x - A[j].x, A[i].y - A[j].y, A[i].z - A[j].z); if (d < bond && d > .1 && (k !== 'graphite' || A[i].L === A[j].L)) B.push([i, j]); }
    }
    function ui() { const s = S[k]; read.innerHTML = `<span>${s[0]}</span><span class="big" style="font-size:26px">${s[1]}</span><dl class="dl">${s[2].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`; }
    spin3d(c, 320, (g, w, h, P, sc, t, dt) => {
      const Q = A.map(a => P(a.x, a.y, a.z));
      g.lineWidth = k === 'nacl' ? 1.4 : 3; B.forEach(([i, j]) => { const a = Q[i], b = Q[j], f = .35 + .65 * ((a.z + b.z) / 2 + 2) / 4; g.strokeStyle = k === 'nacl' ? `rgba(10,36,64,${.25 * f})` : `rgba(60,70,82,${.85 * f})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); });
      if (k === 'graphite') { g.setLineDash([3, 5]); g.strokeStyle = 'rgba(240,154,46,.55)'; g.lineWidth = 1.2; [[0, 0], [.85, .3], [-.8, -.4]].forEach(([x, z]) => { const a = P(x, -1.15, z), b = P(x, 1.15, z); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }); g.setLineDash([]); }
      if (k === 'metal') E.forEach(e => { e.x += e.vx * dt * 1.4; e.y += e.vy * dt * 1.4; e.z += e.vz * dt * 1.4; ['x', 'y', 'z'].forEach(ax => { if (Math.abs(e[ax]) > 1.45) e['v' + ax] *= -1; }); });
      const items = A.map((a, i) => ({ z: Q[i].z, i })); if (k === 'metal') E.forEach((e, i) => items.push({ z: P(e.x, e.y, e.z).z + .001, e }));
      items.sort((a, b) => a.z - b.z).forEach(it => {
        if (it.e) { const q = P(it.e.x, it.e.y, it.e.z); ball(g, q.x, q.y, 2.6 * q.p, '#ffd54a', '#a85d00'); return; }
        const a = A[it.i], q = Q[it.i], fog = .55 + .45 * (q.z + 2) / 4;
        if (a.t === 'Na') shade(g, q.x, q.y, .2 * sc * q.p, '#a98be0', fog); else if (a.t === 'Cl') shade(g, q.x, q.y, .33 * sc * q.p, '#5dc26b', fog); else if (a.t === 'M') { shade(g, q.x, q.y, .3 * sc * q.p, '#b8c4d2', fog); g.fillStyle = INK; g.font = `500 ${Math.round(11 * q.p)}px Jost, sans-serif`; g.textAlign = 'center'; g.fillText('+', q.x, q.y + 4); } else shade(g, q.x, q.y, .13 * sc * q.p, '#4a5563', fog);
      });
      g.font = '400 11.5px Jost, sans-serif'; g.fillStyle = INK3; g.textAlign = 'left'; g.fillText(k === 'nacl' ? 'purple: Na⁺ · green: Cl⁻ · drag to turn' : k === 'metal' ? 'grey: positive ions · yellow: delocalised electrons' : k === 'graphite' ? 'orange dashes: weak forces between layers' : 'grey: carbon atoms · drag to turn', 10, h - 10);
    }, { scale: 66 });
    seg(body.querySelector('.seg'), v => { k = v; build(); ui(); }); build(); ui();
  };

  /* ---------- Gibbs free energy ---------- */
  W.gibbs = function (root) {
    const PRE = [['CaCO₃ decomposes', 'CaCO₃(s) → CaO(s) + CO₂(g)', 178, 161], ['Haber process', 'N₂(g) + 3H₂(g) → 2NH₃(g)', -92, -199], ['Ice melts', 'H₂O(s) → H₂O(l)', 6, 22], ['Methane burns', 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)', -890, -243]];
    const hid = id('h'), sid = id('s'), tid = id('t');
    const body = frame(root, 'Will it go? ΔG = ΔH − TΔS', 'ΔH and ΔS are taken to stay the same at every temperature, which is close enough for most questions. ΔS is in J K⁻¹ mol⁻¹, so divide it by 1000 before using it with ΔH in kJ mol⁻¹. A negative ΔG means the reaction is feasible: it says nothing about how fast it goes.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Reaction">${PRE.map((p, i) => `<button type="button" data-v="${i}"${i ? '' : ' class="is-on"'}>${p[0]}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="ctl"><label for="${hid}"><span>ΔH <b></b></span><input id="${hid}" type="range" min="-900" max="300" value="178" step="1"></label><label for="${sid}"><span>ΔS <b></b></span><input id="${sid}" type="range" min="-300" max="300" value="161" step="1"></label><label for="${tid}"><span>Temperature, T <b></b></span><input id="${tid}" type="range" min="0" max="1500" value="298" step="1"></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), [hs, ss, ts] = [...body.querySelectorAll('input')], outs = body.querySelectorAll('label b'), read = body.querySelector('.read'); let eq = PRE[0][1];
    function draw() {
      const H = +hs.value, Sv = +ss.value, T = +ts.value, G = T2 => H - T2 * Sv / 1000, g0 = G(0), g1 = G(1500), lo = Math.min(g0, g1, 0), hi = Math.max(g0, g1, 0), pad = (hi - lo) * .12 || 10, Y = v => 20 + (hi + pad - v) / (hi - lo + 2 * pad) * (h - 56), X = t => 54 + t / 1500 * (w - 70);
      outs[0].textContent = (H > 0 ? '+' : '') + mn(H) + ' kJ/mol'; outs[1].textContent = (Sv > 0 ? '+' : '') + mn(Sv) + ' J/K/mol'; outs[2].textContent = T + ' K';
      g.clearRect(0, 0, w, h); g.font = '400 11px Jost, sans-serif';
      g.fillStyle = 'rgba(47,154,107,.08)'; g.fillRect(X(0), Y(0), X(1500) - X(0), Y(lo - pad) - Y(0)); g.fillStyle = '#2f7d4f'; g.textAlign = 'left'; g.fillText('feasible: ΔG < 0', X(0) + 6, Y(lo - pad) - 6);
      g.strokeStyle = LINE; g.lineWidth = 1; g.fillStyle = INK3; g.textAlign = 'center'; for (let t = 0; t <= 1500; t += 300) { g.beginPath(); g.moveTo(X(t), 20); g.lineTo(X(t), Y(lo - pad)); g.stroke(); g.fillText(t, X(t), h - 22); }
      g.strokeStyle = INK; g.lineWidth = 1.3; g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(1500), Y(0)); g.stroke(); g.textAlign = 'right'; g.fillStyle = INK3; g.fillText('0', X(0) - 5, Y(0) + 4); g.fillText(mn(Math.round(hi + pad * .5)), X(0) - 5, Y(hi + pad * .5) + 4); g.fillText(mn(Math.round(lo - pad * .5)), X(0) - 5, Y(lo - pad * .5) + 4);
      g.fillStyle = INK2; g.textAlign = 'center'; g.fillText('temperature / K', X(750), h - 6); g.save(); g.translate(13, (20 + h - 36) / 2); g.rotate(-Math.PI / 2); g.fillText('ΔG / kJ mol⁻¹', 0, 0); g.restore();
      g.strokeStyle = BLUE; g.lineWidth = 3; g.beginPath(); g.moveTo(X(0), Y(g0)); g.lineTo(X(1500), Y(g1)); g.stroke();
      const Tx = Sv !== 0 ? H * 1000 / Sv : null; if (Tx !== null && Tx > 0 && Tx < 1500) { g.setLineDash([4, 4]); g.strokeStyle = '#a85d00'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(X(Tx), Y(0)); g.lineTo(X(Tx), Y(lo - pad)); g.stroke(); g.setLineDash([]); g.fillStyle = '#a85d00'; g.textAlign = 'left'; g.fillText(`T = ${Math.round(Tx)} K`, X(Tx) + 5, Y(0) - 6); }
      ball(g, X(T), Y(G(T)), 5.5, SUN, INK);
      const gv = G(T), cs = H < 0 && Sv > 0 ? 'ΔH negative and ΔS positive: feasible at every temperature.' : H > 0 && Sv < 0 ? 'ΔH positive and ΔS negative: never feasible, at any temperature.' : H > 0 ? `ΔH and ΔS both positive: feasible only above ${Math.round(Tx)} K, where TΔS outweighs ΔH.` : `ΔH and ΔS both negative: feasible only below ${Math.round(Tx)} K.`;
      read.innerHTML = `<span class="eqn">${eq}</span><span>ΔG at ${T} K</span><span class="big">${gv > 0 ? '+' : ''}${mn(fmt(gv, 1))} kJ/mol</span><span class="eqn">ΔG = ${mn(H)} − ${T} × (${mn(Sv)} ÷ 1000)</span><span><b>${gv < 0 ? 'Feasible' : gv === 0 ? 'At the turning point' : 'Not feasible'}</b> at ${T} K. ${cs}</span>`;
    }
    seg(body.querySelector('.seg'), v => { const p = PRE[+v]; eq = p[1]; hs.value = p[2]; ss.value = p[3]; draw(); }); [hs, ss, ts].forEach(s => s.addEventListener('input', () => { eq = 'your reaction'; draw(); })); draw();
  };

  /* ---------- colour of transition element complexes ---------- */
  W.complex = function (root) {
    const PRE = [['[Ti(H₂O)₆]³⁺', 1, 500, 'oct'], ['[Cu(H₂O)₆]²⁺', 9, 690, 'oct'], ['[Cu(NH₃)₄(H₂O)₂]²⁺', 9, 600, 'oct'], ['[Co(H₂O)₆]²⁺', 7, 515, 'oct'], ['[CoCl₄]²⁻', 7, 680, 'tet']];
    const lid = id('l');
    const body = frame(root, 'Why are complexes coloured?', 'Ligands split the five d orbitals into two levels. A d electron takes in light whose energy matches the gap ΔE and jumps up. We see the colours that are left. Wavelengths are rounded typical values, and colours on a screen are only a guide.');
    body.innerHTML = `<div class="seg" role="group" aria-label="Complex">${PRE.map((p, i) => `<button type="button" data-v="${i}"${i ? '' : ' class="is-on"'}>${p[0]}</button>`).join('')}</div><div class="fig-split"><canvas></canvas><div class="ctl"><label for="${lid}"><span>Wavelength absorbed <b></b></span><input id="${lid}" type="range" min="400" max="700" value="500" step="5"></label><div class="read"></div></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 300), sl = body.querySelector('input'), out = body.querySelector('label b'), read = body.querySelector('.read'); let at = 0, nm = 500;
    function rgb(l) { let r = 0, gg = 0, b = 0; if (l < 440) { r = -(l - 440) / 40; b = 1; } else if (l < 490) { gg = (l - 440) / 50; b = 1; } else if (l < 510) { gg = 1; b = -(l - 510) / 20; } else if (l < 580) { r = (l - 510) / 70; gg = 1; } else if (l < 645) { r = 1; gg = -(l - 645) / 65; } else r = 1; return [r * 255, gg * 255, b * 255].map(Math.round); }
    const seen = l => rgb(l).map(v => Math.round(255 - v * .82)), css = a => `rgb(${a.join(',')})`;
    function name(l) { return l < 435 ? 'yellow-green' : l < 480 ? 'yellow or orange' : l < 495 ? 'orange-red' : l < 530 ? 'purple, pink or red-violet' : l < 560 ? 'violet' : l < 590 ? 'violet-blue' : l < 620 ? 'deep blue' : 'blue to turquoise'; }
    loop(c, (dt, t) => {
      const p = PRE[at], dN = p[1], tet = p[3] === 'tet', nLo = tet ? 2 : 3, nHi = tet ? 3 : 2, E = 119600 / nm, gap = 40 + (E - 170) / (300 - 170) * 90, half = w * .48;
      g.clearRect(0, 0, w, h); g.font = '400 12px Jost, sans-serif';
      const yLo = h - 70, yHi = yLo - gap, bx = 40, bw = 30, cell = (n, i) => half / 2 - n * (bw + 6) / 2 + i * (bw + 6) + 16;
      const fillE = []; let left = dN; const order = [...Array(nLo).keys()].map(i => ['lo', i]).concat([...Array(nHi).keys()].map(i => ['hi', i])); const occ = { lo: Array(nLo).fill(0), hi: Array(nHi).fill(0) };
      order.forEach(([lv, i]) => { if (left > 0) { occ[lv][i] = 1; left--; } }); order.forEach(([lv, i]) => { if (left > 0) { occ[lv][i] = 2; left--; } });
      const ph = (t * .5) % 1, jump = ph > .45, holeHi = occ.hi.findIndex(v => v < 2), fromLo = occ.lo.findIndex(v => v > 0);
      [['lo', nLo, yLo], ['hi', nHi, yHi]].forEach(([lv, n, y]) => { for (let i = 0; i < n; i++) { const x = cell(n, i); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + bw, y); g.stroke(); let o = occ[lv][i]; if (jump && lv === 'lo' && i === fromLo) o--; if (jump && lv === 'hi' && i === holeHi) o++; g.strokeStyle = BLUE; g.lineWidth = 2; if (o >= 1) { g.beginPath(); g.moveTo(x + bw * .38, y - 3); g.lineTo(x + bw * .38, y - 22); g.lineTo(x + bw * .38 - 4, y - 16); g.stroke(); } if (o >= 2) { g.beginPath(); g.moveTo(x + bw * .62, y - 22); g.lineTo(x + bw * .62, y - 3); g.lineTo(x + bw * .62 + 4, y - 9); g.stroke(); } } });
      g.fillStyle = INK3; g.textAlign = 'left'; g.fillText(tet ? 'tetrahedral: 2 lower, 3 upper' : 'octahedral: 3 lower, 2 upper', 16, 18); g.strokeStyle = '#a85d00'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(half - 22, yLo); g.lineTo(half - 22, yHi); g.stroke(); g.fillStyle = '#a85d00'; g.fillText('ΔE', half - 18, (yLo + yHi) / 2 + 4);
      if (!jump && holeHi >= 0 && fromLo >= 0) { const col = css(rgb(nm)); g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); for (let x = 0; x < 70; x++) { const xx = 10 + x + ph * 60, yy = (yLo + yHi) / 2 + Math.sin(x * .45) * 5; x ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.fillStyle = col; g.fillText('light in', 12, (yLo + yHi) / 2 - 10); }
      g.fillStyle = INK2; g.textAlign = 'center'; g.fillText(`${p[0]} · d${sup(dN)}`, half / 2 + 12, h - 30); g.fillText('d orbitals in the complex', half / 2 + 12, h - 12);
      const sx = half + 20, sw = w - sx - 16, sy = 34; for (let x = 0; x < sw; x++) { g.fillStyle = css(rgb(400 + x / sw * 300)); g.fillRect(sx + x, sy, 1, 26); }
      const ax = sx + (nm - 400) / 300 * sw; g.fillStyle = 'rgba(10,36,64,.72)'; g.fillRect(ax - 14, sy - 4, 28, 34); g.fillStyle = '#fff'; g.font = '500 11px Jost, sans-serif'; g.fillText('absorbed', ax, sy + 17); g.font = '400 11px Jost, sans-serif'; g.fillStyle = INK3; g.fillText('400 nm', sx + 18, sy + 44); g.fillText('700 nm', sx + sw - 18, sy + 44); g.fillText('white light in', sx + sw / 2, sy - 10);
      const tx = sx + sw / 2, ty = sy + 72, th = h - ty - 26; g.fillStyle = css(seen(nm)); g.strokeStyle = '#9fb4c8'; g.lineWidth = 2; g.beginPath(); g.moveTo(tx - 26, ty); g.lineTo(tx - 26, ty + th - 26); g.arc(tx, ty + th - 26, 26, Math.PI, 0, true); g.lineTo(tx + 26, ty); g.fill(); g.stroke(); g.fillStyle = INK2; g.fillText('what we see', tx, h - 8);
    });
    function ui() { nm = +sl.value; out.textContent = nm + ' nm'; const E = 119600 / nm; read.innerHTML = `<span>The solution looks</span><span class="big" style="font-size:24px">${name(nm)}</span><span><b>ΔE</b> = hc/λ × N<sub>A</sub> ≈ ${Math.round(E)} kJ/mol for ${nm} nm light.</span><span>A <b>bigger</b> splitting absorbs light of <b>shorter</b> wavelength. Changing the ligand changes ΔE, which is why the colour changes: NH₃ splits the d orbitals more than H₂O does, so copper(II) goes from pale blue to deep blue.</span><span>Zn²⁺ (d¹⁰) and Sc³⁺ (d⁰) have no electron that can jump into a gap, so their compounds are white.</span>`; }
    seg(body.querySelector('.seg'), v => { at = +v; sl.value = PRE[at][2]; ui(); }); sl.addEventListener('input', ui); sl.value = PRE[0][2]; ui();
  };

  /* ---------- fractional distillation of crude oil ---------- */
  W.fractions = function (root) {
    const F = [['Refinery gas', 'C₁–C₄', 'below 40 °C', 'gas for heating and cooking', '#cfe3f7'], ['Gasoline (petrol)', 'C₅–C₁₀', '40–100 °C', 'fuel for cars', '#f7efb8'], ['Naphtha', 'C₇–C₁₄', '100–150 °C', 'chemical feedstock', '#f3dd8c'], ['Kerosene (paraffin)', 'C₁₀–C₁₆', '150–250 °C', 'jet fuel', '#ebc566'], ['Diesel oil (gas oil)', 'C₁₄–C₂₀', '250–350 °C', 'fuel for diesel engines', '#d9a24a'], ['Fuel oil', 'C₂₀–C₄₀', '350–400 °C', 'fuel for ships and home heating', '#a86d34'], ['Lubricating oil', 'C₂₀–C₅₀', 'above 400 °C', 'lubricants, waxes and polishes', '#7a4a26'], ['Bitumen', 'over C₅₀', 'does not boil: collected as a residue', 'making roads', '#2f2a26']];
    const body = frame(root, 'Fractional distillation of crude oil', 'Crude oil is heated until most of it boils, then the vapour rises up a column that is hot at the bottom and cool at the top. Each fraction condenses where the column has cooled to its boiling range, and is piped off there. Boiling ranges and chain lengths are approximate: they differ between refineries and books.');
    body.innerHTML = `<div class="fig-split"><canvas></canvas><div class="read"></div></div>`;
    const c = body.querySelector('canvas'), { g, w, h } = cv(c, 380), read = body.querySelector('.read'); let at = 1; const V = [];
    const cx = w * .3, cw = Math.min(110, w * .24), top = 16, bot = h - 46, tray = i => top + 10 + i * (bot - top - 20) / 8;
    function ui() { const f = F[at]; read.innerHTML = `<span>Fraction ${at + 1} of 8, from the top</span><span class="big" style="font-size:26px">${f[0]}</span><span><b>Carbon atoms per molecule:</b> ${f[1]}</span><span><b>Boiling range:</b> ${f[2]}</span><span><b>Used for:</b> ${f[3]}</span><span><b>Going down the column</b>, the molecules have longer chains, so the intermolecular forces are stronger: higher boiling point, more viscous (thicker), darker, and harder to ignite.</span><span>Click a fraction to read about it.</span>`; }
    c.addEventListener('click', ev => { const r = c.getBoundingClientRect(), y = ev.clientY - r.top; for (let i = 0; i < 8; i++) if (y >= tray(i) - 6 && y < tray(i) + (bot - top - 20) / 8 - 6) { at = i; ui(); L.poke(); break; } });
    const L = loop(c, dt => {
      g.clearRect(0, 0, w, h); g.font = '400 11.5px Jost, sans-serif';
      const grd = g.createLinearGradient(0, top, 0, bot); grd.addColorStop(0, '#dbeeff'); grd.addColorStop(1, '#ffd2b0'); g.fillStyle = grd; rr(g, cx - cw / 2, top, cw, bot - top, 14); g.fill(); g.strokeStyle = INK2; g.lineWidth = 2; g.stroke();
      g.fillStyle = INK3; g.textAlign = 'right'; g.fillText('cool', cx - cw / 2 - 8, top + 14); g.fillText('hot', cx - cw / 2 - 8, bot - 6);
      F.forEach((f, i) => { const y = tray(i); g.strokeStyle = 'rgba(10,36,64,.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - cw / 2 + 6, y); g.lineTo(cx + cw / 2 - 6, y); g.stroke();
        g.fillStyle = f[4]; g.strokeStyle = i === at ? INK : 'rgba(10,36,64,.3)'; g.lineWidth = i === at ? 2.5 : 1; g.fillRect(cx + cw / 2, y - 4, 26, 8); g.strokeRect(cx + cw / 2, y - 4, 26, 8);
        g.fillStyle = i === at ? INK : INK2; g.font = (i === at ? '500 ' : '400 ') + '12.5px Jost, sans-serif'; g.textAlign = 'left'; g.fillText(f[0], cx + cw / 2 + 34, y + 4); g.font = '400 11.5px Jost, sans-serif'; });
      g.fillStyle = '#e8594d'; g.beginPath(); for (let i = 0; i < 3; i++) { const x = cx - 30 + i * 30; g.moveTo(x - 9, h - 6); g.quadraticCurveTo(x, h - 34 - Math.sin(performance.now() / 160 + i) * 4, x + 9, h - 6); } g.fill(); g.fillStyle = INK3; g.textAlign = 'center'; g.textAlign = 'left'; g.fillText('crude oil, heated', cx + 52, h - 12);
      if (V.length < 70 && Math.random() < dt * 30) { const fi = Math.random() * 8 | 0; V.push({ x: cx + (Math.random() - .5) * (cw - 24), y: bot - 6, f: fi, s: 70 + Math.random() * 50 }); }
      for (let i = V.length - 1; i >= 0; i--) { const v = V[i], stop = tray(v.f) - 5; if (v.f === 7) { v.y = bot - 10; v.x += (cx + cw / 2 - v.x) * dt * .8; if (v.x > cx + cw / 2 - 12) { V.splice(i, 1); continue; } } else if (v.y > stop) { v.y -= v.s * dt; v.x += Math.sin(v.y * .1 + i) * .3; } else { v.x += 40 * dt; if (v.x > cx + cw / 2 - 6) { V.splice(i, 1); continue; } } ball(g, v.x, v.y, 3, F[v.f][4], 'rgba(10,36,64,.3)'); }
    });
    ui();
  };

  // which live figures belong to which lecture
  const MAP = {
    'k3-1-1': ['states'], 'k3-1-2': ['gas'], 'k3-1-3': ['states'], 'k3-2-1': ['particles'], 'k3-2-2': ['particles'], 'k3-3-1': ['particles'], 'k3-3-2': ['particles'], 'k3-3-3': ['diffusion'], 'k3-3-4': ['fractions'], 'k3-3-5': ['chromatography'], 'k3-4-5': ['ph'], 'k3-4-6': ['titration'], 'k3-5-2': ['bonds'], 'k3-6-2': ['ptable'], 'k3-6-3': ['lattice'], 'k3-7-1': ['reactivity'],
    'ci-1-1': ['states'], 'ci-1-2': ['diffusion'], 'ci-2-1': ['particles'], 'ci-2-2': ['atom'], 'ci-2-3': ['massspec'], 'ci-2-4': ['lattice'], 'ci-2-5': ['shapes'], 'ci-2-6': ['lattice'], 'ci-2-7': ['lattice'], 'ci-3-2': ['moles'], 'ci-3-3': ['moles'], 'ci-4-1': ['electrolysis'], 'ci-5-1': ['profile', 'bonds'], 'ci-6-2': ['rate'], 'ci-6-3': ['equilibrium'], 'ci-7-1': ['ph'], 'ci-8-1': ['ptable'], 'ci-9-4': ['reactivity'], 'ci-11-1': ['homologous'], 'ci-11-2': ['homologous'], 'ci-11-3': ['fractions'], 'ci-12-2': ['titration'], 'ci-12-3': ['chromatography'], 'ci-12-5': ['iontests'],
    'ca-1-1': ['periodicity'], 'ca-1-2': ['massspec'], 'ca-1-3': ['orbitals'], 'ca-1-4': ['periodicity'], 'ca-2-1': ['massspec'], 'ca-2-4': ['moles'], 'ca-3-2': ['lattice'], 'ca-3-3': ['lattice'], 'ca-3-5': ['shapes'], 'ca-4-1': ['gas'], 'ca-4-2': ['lattice'], 'ca-5-1': ['profile', 'bonds'], 'ca-5-2': ['bonds'], 'ca-6-1': ['cell'], 'ca-7-1': ['equilibrium'], 'ca-7-2': ['titration'], 'ca-8-1': ['rate'], 'ca-8-2': ['boltzmann'], 'ca-8-3': ['boltzmann'], 'ca-9-1': ['periodicity', 'ptable'], 'ca-13-1': ['homologous'], 'ca-13-3': ['shapes'], 'ca-22-1': ['ir'], 'ca-22-2': ['massspec'],
    'ca-23-3': ['gibbs'], 'ca-23-4': ['gibbs'], 'ca-24-1': ['electrolysis'], 'ca-24-2': ['cell'], 'ca-25-1': ['titration'], 'ca-26-1': ['orders'], 'ca-28-1': ['orbitals'], 'ca-28-3': ['complex'], 'ca-37-4': ['nmr'],
  };
  // every live model, for the page that lists them all
  const NAMES = {
    particles: ['Elements, compounds and mixtures', 'Particles'], states: ['States of matter', 'Particles'], diffusion: ['Diffusion', 'Particles'], gas: ['The gas laws, pV = nRT', 'Particles'],
    atom: ['Build an atom', 'Atoms and bonding'], orbitals: ['Atomic orbitals', 'Atoms and bonding'], massspec: ['Mass spectra and isotopes', 'Atoms and bonding'], shapes: ['Shapes of molecules', 'Atoms and bonding'], lattice: ['Giant structures', 'Atoms and bonding'],
    ptable: ['The Periodic Table', 'The Periodic Table'], periodicity: ['Periodicity and ionisation energy', 'The Periodic Table'], reactivity: ['The reactivity series', 'The Periodic Table'], complex: ['Colours of complexes', 'The Periodic Table'],
    moles: ['Mole calculator', 'Quantities and energy'], profile: ['Reaction pathway diagrams', 'Quantities and energy'], bonds: ['Bond energies', 'Quantities and energy'], gibbs: ['Gibbs free energy', 'Quantities and energy'],
    rate: ['Rates of reaction', 'Rates and equilibrium'], boltzmann: ['The Boltzmann distribution', 'Rates and equilibrium'], orders: ['Orders of reaction', 'Rates and equilibrium'], equilibrium: ['The Haber process', 'Rates and equilibrium'],
    ph: ['The pH scale', 'Acids and electrochemistry'], titration: ['Titration curves', 'Acids and electrochemistry'], electrolysis: ['Electrolysis', 'Acids and electrochemistry'], cell: ['Electrochemical cells', 'Acids and electrochemistry'],
    homologous: ['Homologous series', 'Organic chemistry and analysis'], fractions: ['Crude oil fractions', 'Organic chemistry and analysis'], chromatography: ['Paper chromatography', 'Organic chemistry and analysis'], iontests: ['Tests for ions and gases', 'Organic chemistry and analysis'], ir: ['Infrared spectra', 'Organic chemistry and analysis'], nmr: ['Proton NMR spectra', 'Organic chemistry and analysis'],
  };
  window.Widgets = {
    has: lid => !!MAP[lid], list: lid => MAP[lid] || [], count: Object.keys(W).length,
    all: () => Object.keys(NAMES).filter(k => W[k]).map(k => ({ name: k, title: NAMES[k][0], group: NAMES[k][1], lectures: Object.keys(MAP).filter(l => MAP[l].includes(k)) })),
    mount(name, el, opts) { try { W[name](el, opts); } catch (e) { el.remove(); if (window.console) console.error('figure ' + name, e); } },
    clear() { kills.forEach(k => { try { k(); } catch (e) { } }); kills.clear(); },
  };
})();
