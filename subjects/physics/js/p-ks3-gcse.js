/* Twistor — new KS3 and GCSE physics topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw, lerp = WL.lerp, clamp = WL.clamp;
  const f0 = (x) => x.toFixed(0), f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);
  const deg = (r) => (r * 180) / Math.PI;

  /* ================================================================ KS3: Light */
  WL.topic({
    id: 'ks3-light', stage: 'ks3', strand: 'W', title: 'Light & Reflection',
    summary: 'Why the angle of incidence equals the angle of reflection, and where the image in a mirror comes from.',
    maths: [['Angles', 'Measured from the normal, the line at 90° to the mirror'], ['Reflecting a point', 'Same distance on the other side of a line'], ['Shortest distance', 'A straight line between two points']],
    idea: 'Light from the lamp to your eye takes the <em>shortest path</em> that touches the mirror. Reflect your eye in the mirror and that shortest path becomes a straight line, which is exactly why i = r.',
    try: 'Drag P away from the yellow minimum on the little graph: the path always gets longer, and i stops equalling r.',
    quiz: { q: 'A ray hits a mirror at 30° to the mirror’s surface. What is the angle of reflection, measured from the normal?', a: ['30°', '60°', '90°', '120°'], c: 1, ex: 'Angles are measured from the normal: the incidence angle is 90° − 30° = 60°, so the reflection angle is also 60°.' },
    anim: {
      duration: 17, alt: 'Light from a lamp reflects off a mirror to an eye; the reflection point slides to show the shortest path.',
      params: [{ id: 'P', label: 'Reflection point P', unit: 'cm', min: 4, max: 78, step: 0.2, value: 43.6 }],
      beats: [[0, 'Light from lamp A bounces off the mirror at P and reaches the eye at B.'], [3, 'Slide P along the mirror: the total length A → P → B changes.'], [8, 'The shortest path is the one where the angle of incidence i equals the angle of reflection r.'], [11, 'Why? Reflect B to B′ behind the mirror. A→P→B is exactly as long as A→P→B′, and a straight line is shortest.'], [14, 'The eye sees the lamp at A′, as far behind the mirror as A is in front: a virtual image.']],
      draw(s, t) {
        const Ax = 240, Ay = 150, Bx = 700, By = 210, My = 330, X = (cm) => 80 + cm * 10, opt = 43.6;
        const sweep = opt + 25 * Math.sin(0.9 * Math.max(0, t - 3));
        const Pc = t < 3 ? opt : t < 8 ? sweep : lerp(opt + 25 * Math.sin(4.5), s.p.P, s.in(t, 8, 1)), P = X(Pc);
        const L = (x) => Math.hypot(Ax - x, Ay - My) + Math.hypot(Bx - x, By - My);
        s.rect(60, My, 840, 210, { fill: '#0b131a', fa: 1, stroke: false });
        s.txt('behind the mirror', 880, 525, { c: C.dim, size: 13, align: 'right', sans: true });
        s.line(70, My, 890, My, { c: C.greyB, w: 5 }); for (let x = 84; x < 890; x += 22) s.line(x, My + 4, x - 10, My + 16, { c: C.dim, w: 1.4 });
        s.glow(Ax, Ay, 44, C.yellow, 0.55); s.circle(Ax, Ay, 11, { c: C.yellow, fill: C.yellow, fa: 0.9 }); s.tex('A', Ax - 30, Ay - 22, { size: 28, c: C.yellow, alt: 'A' });
        const eye = []; for (let k = 0; k <= 40; k++) { const a = (2 * Math.PI * k) / 40; eye.push([Bx + 22 * Math.cos(a), By + 11 * Math.sin(a) * (Math.cos(a) > 0 ? 1 : 1)]); }
        s.poly(eye, { c: C.ink, w: 2 }); s.dot(Bx - 6, By + 2, { c: C.blue, r: 6 }); s.tex('B', Bx + 34, By - 18, { size: 28, alt: 'B' });
        s.poly([[Ax, Ay], [P, My], [Bx, By]], { c: C.yellow, w: 3.2, p: s.in(t, 0.3, 1.6) });
        s.alpha(s.in(t, 1.6, 0.6), () => { [[Ax, Ay, P, My], [P, My, Bx, By]].forEach(([x1, y1, x2, y2]) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, l = Math.hypot(x2 - x1, y2 - y1); s.arrow(mx - ((x2 - x1) / l) * 9, my - ((y2 - y1) / l) * 9, mx + ((x2 - x1) / l) * 9, my + ((y2 - y1) / l) * 9, { c: C.yellow, w: 3, head: 13 }); }); });
        const aA = Math.atan2(My - Ay, Ax - P), aB = Math.atan2(My - By, Bx - P), iA = Math.abs(aA - Math.PI / 2), rB = Math.abs(Math.PI / 2 - aB);
        s.alpha(s.in(t, 1.8, 1), () => {
          s.line(P, My, P, My - 140, { c: C.ink, w: 1.5, dash: [5, 6] }); s.txt('normal', P + 6, My - 150, { c: C.dim, size: 13, sans: true });
          s.angle(P, My, 48, Math.PI / 2, aA, { c: C.blue, w: 2.5, tex: 'i', lc: C.blue, gap: 18 });
          s.angle(P, My, 64, aB, Math.PI / 2, { c: C.red, w: 2.5, tex: 'r', lc: C.red, gap: 18 });
          s.dot(P, My, { c: C.ink, r: 5 }); s.tex('P', P, My + 28, { size: 24, alt: 'P' });
        });
        s.txt(`A → P → B = ${f1(L(P) / 10)} cm`, 60, 50, { c: C.ink, size: 20 });
        s.txt(`i = ${f1(deg(iA))}°    r = ${f1(deg(rB))}°`, 60, 82, { c: Math.abs(iA - rB) < 0.012 ? C.green : C.dim, size: 20 });
        const gx = 610, gy = 128, gw = 300, gh = 86, Lmin = L(X(opt)), Lmax = Math.max(L(X(4)), L(X(78)));
        s.alpha(s.in(t, 3, 1), () => {
          s.line(gx, gy, gx + gw, gy, { c: C.dim, w: 1.5 }); s.line(gx, gy, gx, gy - gh - 8, { c: C.dim, w: 1.5 });
          s.txt('path length', gx + 4, gy - gh - 14, { c: C.dim, size: 12, sans: true }); s.txt('where P is', gx + gw, gy + 14, { c: C.dim, size: 12, sans: true, align: 'right' });
          const pts = []; for (let c = 4; c <= 78; c += 1) pts.push([gx + ((c - 4) / 74) * gw, gy - ((L(X(c)) - Lmin) / (Lmax - Lmin)) * gh * 0.9 - 6]);
          s.poly(pts, { c: C.blue, w: 2.5 });
          s.dot(gx + ((opt - 4) / 74) * gw, gy - 6, { c: C.yellow, r: 5 });
          s.dot(gx + ((Pc - 4) / 74) * gw, gy - ((L(P) - Lmin) / (Lmax - Lmin)) * gh * 0.9 - 6, { c: C.red, r: 6 });
        });
        s.texAt('i = r', 480, 92, 8.6, { size: 44, c: C.yellow });
        const Bp = [Bx, 2 * My - By];
        s.alpha(s.in(t, 11, 1), () => {
          s.line(Bx, By, Bp[0], Bp[1], { c: C.dim, w: 1.5, dash: [4, 6] }); s.right(Bx, My, Math.PI, 10, { c: C.dim });
          s.line(P, My, Bp[0], Bp[1], { c: C.yellow, w: 2, dash: [7, 6], a: 0.8 });
          s.line(Ax, Ay, Bp[0], Bp[1], { c: C.green, w: 1.8, dash: [3, 7], a: 0.8 });
          s.circle(Bp[0], Bp[1], 9, { c: C.ink, w: 2, dash: [3, 3] }); s.tex('B^{\\prime}', Bp[0] + 30, Bp[1] + 4, { size: 26, alt: "B'" });
          s.brace(Bx + 30, By, Bx + 30, My, { side: -1, h: 10, c: C.dim, label: 'd' }); s.brace(Bx + 30, My, Bx + 30, Bp[1], { side: -1, h: 10, c: C.dim, label: 'd' });
        });
        s.texAt('|AP|+|PB| = |AP|+|PB^{\\prime}|', 400, 400, 11.6, { size: 26, c: C.green });
        s.alpha(s.in(t, 14, 1), () => {
          const Ap = [Ax, 2 * My - Ay]; s.circle(Ap[0], Ap[1], 11, { c: C.yellow, w: 2, dash: [3, 3], fill: C.yellow, fa: 0.25 }); s.tex('A^{\\prime}', Ap[0] - 34, Ap[1] - 10, { size: 26, c: C.yellow, alt: "A'" });
          const dx = P - Bx, dy = My - By, k = (Ap[1] - My) / dy; s.line(P, My, P + dx * k, My + dy * k, { c: C.yellow, w: 2, dash: [2, 6] });
        });
      }
    },
    steps: [
      { say: 'Light travels in straight lines, so we can draw it as rays.', tex: R`\text{lamp } A \;\longrightarrow\; \text{mirror at } P \;\longrightarrow\; \text{eye } B`, why: 'Shadows have sharp edges and you can’t see round corners: both tell us light goes in straight lines in one material.' },
      { say: 'Measure both angles from the normal, the line at 90° to the mirror.', tex: R`i = \text{angle of incidence},\qquad r = \text{angle of reflection}`, why: 'Using the normal makes the rule the same for any mirror, flat or curved: the normal is always defined at the point where the ray hits.' },
      { say: 'The law of reflection, found by experiment:', tex: R`i = r`, why: 'Shine a ray box at a mirror and measure: the two angles always match. The next steps show why nature does this.' },
      { say: 'Reflect the eye B to a point B′ the same distance behind the mirror. Every path A → P → B is as long as A → P → B′.', tex: R`|PB| = |PB'| \;\Longrightarrow\; |AP| + |PB| = |AP| + |PB'|`, why: 'P is on the mirror line, and B′ is B’s mirror image, so P is the same distance from both (the two triangles are identical).' },
      { say: 'The shortest route from A to B′ is a straight line. It crosses the mirror exactly where i = r.', tex: R`\text{shortest } A \to P \to B \iff A,\ P,\ B' \text{ in a line} \iff i = r`, why: 'Where the straight line A–B′ crosses the mirror, it makes equal angles with the normal on both sides (vertically opposite angles). Light really does pick the quickest path: Fermat’s principle.' },
      { say: 'The image: rays reaching the eye seem to come from A′, as far behind the mirror as A is in front.', tex: R`\text{image distance} = \text{object distance}`, why: 'Your brain assumes light travelled in a straight line, so it traces the ray back through the mirror to A′. No light actually goes there, so it is a virtual image.' }
    ],
    result: R`i = r \quad\text{(angles measured from the normal)}`,
    assumptions: ['A flat, perfectly smooth mirror. A rough surface sends light off in many directions (diffuse reflection), which is why paper doesn’t act as a mirror.', 'Fermat’s principle is really “stationary time”, not always “least time”: in a concave mirror the actual path can be the longest of its neighbours.', 'A real glass mirror reflects from the metal layer at the back and loses a few per cent of the light; the front of the glass gives a faint second image.']
  });

  /* ================================================================ KS3: Current & Voltage */
  WL.topic({
    id: 'ks3-circuits', stage: 'ks3', strand: 'E', title: 'Current & Voltage',
    summary: 'What current and voltage actually measure, and why bulbs in series glow dimmer.',
    maths: [['Dividing quantities', 'charge per second, energy per charge'], ['Rearranging', 'E = QV from V = E/Q'], ['Decimals', '1.5 V cells']],
    idea: 'Current is <em>how much charge</em> passes a point each second. Voltage is <em>how much energy</em> each unit of charge carries from the cell to the components.',
    try: 'Add a second bulb: the current halves and each bulb gets half the voltage, so both glow much dimmer.',
    quiz: { q: '3 C of charge passes a point in a wire in 2 s. What is the current?', a: ['6 A', '1.5 A', '0.67 A', '5 A'], c: 1, ex: 'I = Q/t = 3 C ÷ 2 s = 1.5 A.' },
    anim: {
      duration: 15, alt: 'Charges carrying energy halos round a circuit from a cell to one or two bulbs.',
      params: [{ id: 'cells', label: 'Cells (1.5 V each)', unit: '', min: 1, max: 3, step: 1, value: 2 }, { id: 'bulbs', label: 'Bulbs in series', unit: '', min: 1, max: 2, step: 1, value: 1 }],
      beats: [[0, 'A cell pushes charge round a complete circuit, and the bulb lights.'], [3, 'Current is how much charge passes a point each second. Count it at the gate.'], [6, 'Each charge picks up energy in the cell (yellow glow) and gives it to the bulb.'], [9, 'Voltage is energy per charge. More cells: more energy per charge, and more current.'], [12, 'Two bulbs in series share the cell’s voltage, so each glows more dimly.']],
      draw(s, t) {
        const n = s.p.cells, b = s.p.bulbs, V = 1.5 * n, Rb = 3, I = V / (Rb * b), path = [[150, 120], [810, 120], [810, 420], [150, 420], [150, 120]], L = WL.plen(path);
        const yb = b === 1 ? [270] : [205, 335], dB = yb.map((y) => 660 + (y - 120)), dCell = L - 150, sp = 30, speed = 40 * I;
        s.poly(path, { c: C.ink, w: 3, p: s.in(t, 0, 1.2) });
        const energy = (d) => { if (d >= dCell) return V; let E = V; dB.forEach((x) => { if (d >= x) E -= V / b; }); return Math.max(0, E); };
        yb.forEach((y) => { const P = I * I * Rb; s.glow(810, y, 26 + 14 * P, C.yellow, 0.2 + 0.1 * P); });
        s.alpha(s.in(t, 0.8, 0.8), () => {
          const off = (speed * t) % sp;
          for (let d = off; d < L; d += sp) { const q = WL.along(path, d), E = energy(d); if (t > 5.5) s.glow(q[0], q[1], 6 + 12 * (E / 4.5), C.yellow, 0.55 * s.in(t, 5.5, 1)); s.dot(q[0], q[1], { c: C.blue, r: 4.5 }); }
        });
        for (let i = 0; i < n; i++) { const y = 270 + (i - (n - 1) / 2) * 30; s.rect(128, y - 13, 44, 26, { fill: C.bg, fa: 1, stroke: false }); s.line(126, y - 7, 174, y - 7, { c: C.ink, w: 3 }); s.line(138, y + 7, 162, y + 7, { c: C.ink, w: 7 }); }
        s.txt('+', 112, 270 - (n - 1) * 15 - 12, { c: C.red, size: 20, align: 'center' }); s.txt(`${n} × 1.5 V`, 100, 270 + n * 15 + 20, { c: C.ink, size: 16, align: 'center', sans: true });
        yb.forEach((y) => { s.circle(810, y, 18, { c: C.ink, w: 3, fill: C.bg, fa: 1 }); s.line(797, y - 13, 823, y + 13, { c: C.ink, w: 2.5 }); s.line(823, y - 13, 797, y + 13, { c: C.ink, w: 2.5 }); s.txt(`${f2(V / b)} V`, 840, y, { c: C.yellow, size: 16, sans: true }); });
        s.alpha(s.in(t, 3, 1), () => {
          s.line(480, 395, 480, 445, { c: C.green, w: 2, dash: [4, 4] }); s.txt('gate', 480, 460, { c: C.green, size: 13, align: 'center', sans: true });
          const tt = Math.max(0, t - 3); s.txt(`charge through the gate: ${f1(I * tt)} C in ${f1(tt)} s`, 480, 505, { c: C.ink, size: 18, align: 'center' });
        });
        s.txt(`I = ${f2(I)} A`, 480, 352, { c: C.blue, size: 24, align: 'center', a: s.in(t, 3.2, 1) });
        s.texAt('I = \\dfrac{Q}{t}', 330, 240, 3.6, { size: 34, c: C.blue });
        s.texAt('V = \\dfrac{E}{Q}', 630, 240, 9.3, { size: 34, c: C.yellow });
      }
    },
    steps: [
      { say: 'Current is the rate at which charge flows past a point.', tex: R`I = \frac{Q}{t}`, why: 'One ampere means one coulomb of charge passing every second, like counting cars past a gate per minute.' },
      { say: 'Potential difference (voltage) is the energy transferred per unit of charge.', tex: R`V = \frac{E}{Q}`, why: 'One volt means one joule for every coulomb. A 3 V battery gives each coulomb 3 J to spend in the circuit.' },
      { say: 'So the energy a component transfers is:', tex: R`E = QV`, why: 'Multiply both sides of V = E/Q by Q.' },
      { say: 'Replace Q using Q = It.', tex: R`E = VIt`, why: 'From the first step, the charge that flows in time t is Q = It.' },
      { say: 'Power is energy transferred per second.', tex: R`P = \frac{E}{t} = VI`, why: 'Divide E = VIt by t. A 6 V bulb with 0.5 A flowing transfers 3 J every second: 3 W.' },
      { say: 'In series, each coulomb’s energy from the cell is shared between the bulbs.', tex: R`V_{\text{cell}} = V_1 + V_2`, why: 'Energy is conserved: whatever each coulomb gains in the cell, it gives away on its way round. Two identical bulbs get half each.' }
    ],
    result: R`I = \frac{Q}{t}, \qquad V = \frac{E}{Q}, \qquad P = VI`,
    assumptions: ['Charges are already everywhere in the wire; the cell does not send them out from itself. When the circuit closes, an electric field sets up round the whole loop almost instantly and all the charges start drifting together.', 'The animation’s dots move centimetres per second; real electrons drift only about a tenth of a millimetre per second, yet the bulb lights at once because the field carries the signal.', 'Bulbs are given a fixed resistance. A real filament’s resistance rises as it heats, so doubling the voltage less than doubles the current.']
  });

  /* ================================================================ KS3: Particle model (2D Lennard-Jones) */
  function ljSetup(s) {
    const N = 64, Wb = 16, Hb = 14, a = 1.12, x = new Float64Array(N), y = new Float64Array(N), vx = new Float64Array(N), vy = new Float64Array(N), r = WL.rng(3);
    for (let i = 0; i < N; i++) { const row = Math.floor(i / 8), col = i % 8; x[i] = 3.5 + col * a + (row % 2) * a * 0.5; y[i] = 0.6 + row * a * 0.866; vx[i] = WL.gauss(r) * 0.3; vy[i] = WL.gauss(r) * 0.3; }
    s.state = { N, Wb, Hb, x, y, vx, vy, ax: new Float64Array(N), ay: new Float64Array(N), Tt: 0.12, manual: s.state && s.state.manual, h0: 0.6 + 7 * a * 0.866 + 0.5 };
    ljForce(s.state);
  }
  function ljForce(S) {
    const { N, x, y, ax, ay } = S, g = 0.08; ax.fill(0); ay.fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = x[i] - x[j], dy = y[i] - y[j], r2 = dx * dx + dy * dy; if (r2 > 6.25) continue;
      const ir2 = 1 / Math.max(r2, 0.64), ir6 = ir2 * ir2 * ir2; let f = 24 * ir2 * ir6 * (2 * ir6 - 1); f = Math.max(-200, Math.min(200, f));
      ax[i] += f * dx; ay[i] += f * dy; ax[j] -= f * dx; ay[j] -= f * dy;
    }
    for (let i = 0; i < N; i++) ay[i] -= g;
  }
  WL.topic({
    id: 'ks3-particles', stage: 'ks3', strand: 'T', title: 'Particle Model & Density',
    summary: 'Solids, liquids and gases as the same particles at different spacings, and why gases are so much less dense.',
    maths: [['Division', 'mass ÷ volume'], ['Volume of a cube', 'side³'], ['Cube roots', 'From a volume ratio back to a spacing ratio']],
    idea: 'Heating doesn’t change the particles. It changes <em>how fast they move</em> and <em>how far apart</em> they end up. Spread the same mass over far more space and the density collapses.',
    try: 'After it boils, drag the temperature back down: the gas condenses and then freezes into a crystal again.',
    quiz: { q: 'A 2 kg block has a volume of 0.001 m³. What is its density?', a: ['0.002 kg/m³', '2000 kg/m³', '500 kg/m³', '20 kg/m³'], c: 1, ex: 'ρ = m/V = 2 kg ÷ 0.001 m³ = 2000 kg/m³.' },
    anim: {
      duration: 16, stateful: true, alt: 'A simulation of 64 particles that starts as a crystal, melts into a liquid and boils into a gas as it is heated.',
      params: [{ id: 'T', label: 'Temperature (model units)', unit: '', min: 0.05, max: 2, step: 0.05, value: 0.15, noReset: true }],
      beats: [[0, 'In a solid the particles sit in a regular pattern and only vibrate.'], [4, 'Heat it: they vibrate harder until the pattern breaks. It melts.'], [7, 'In a liquid the particles still touch, but slide past one another.'], [10, 'Heat more: they fly apart and fill the box. A gas.'], [13, 'Same particles, same mass, far more space: the density drops enormously.']],
      setup: ljSetup,
      onParam(s) { s.state.manual = true; },
      step(s, dt) {
        const S = s.state, h = 0.004, n = Math.max(1, Math.round(dt * 600)), { N, x, y, vx, vy, ax, ay, Wb, Hb } = S;
        const t = s.t, prog = t < 4 ? 0.12 : t < 7 ? lerp(0.12, 0.5, (t - 4) / 3) : t < 10 ? 0.5 : t < 13 ? lerp(0.5, 1.5, (t - 10) / 3) : 1.5;
        S.Tt = S.manual ? s.p.T : prog;
        for (let k = 0; k < n; k++) {
          for (let i = 0; i < N; i++) { vx[i] += 0.5 * h * ax[i]; vy[i] += 0.5 * h * ay[i]; x[i] += h * vx[i]; y[i] += h * vy[i];
            if (x[i] < 0.5) { x[i] = 0.5; vx[i] = Math.abs(vx[i]); } if (x[i] > Wb - 0.5) { x[i] = Wb - 0.5; vx[i] = -Math.abs(vx[i]); }
            if (y[i] < 0.5) { y[i] = 0.5; vy[i] = Math.abs(vy[i]); } if (y[i] > Hb - 0.5) { y[i] = Hb - 0.5; vy[i] = -Math.abs(vy[i]); } }
          ljForce(S);
          let K = 0; for (let i = 0; i < N; i++) { vx[i] += 0.5 * h * ax[i]; vy[i] += 0.5 * h * ay[i]; K += 0.5 * (vx[i] * vx[i] + vy[i] * vy[i]); }
          const Tc = K / N, lam = clamp(Math.sqrt(1 + (h / 0.15) * (S.Tt / Math.max(Tc, 1e-6) - 1)), 0.97, 1.03);
          for (let i = 0; i < N; i++) { vx[i] *= lam; vy[i] *= lam; }
        }
      },
      draw(s, t) {
        const S = s.state, { N, x, y, vx, vy, Wb, Hb } = S, sc = 26, X0 = 60, Y0 = 470;
        s.rect(X0, Y0 - Hb * sc, Wb * sc, Hb * sc, { c: C.dim, w: 2, fill: '#0a0f15', fa: 1 });
        for (let i = 0; i < N; i++) { const sp = Math.hypot(vx[i], vy[i]); s.circle(X0 + x[i] * sc, Y0 - y[i] * sc, 12.5, { c: WL.cmap(clamp(sp / 2.4)), w: 1.5, fill: WL.cmap(clamp(sp / 2.4)), fa: 0.55 }); }
        let K = 0; for (let i = 0; i < N; i++) K += 0.5 * (vx[i] ** 2 + vy[i] ** 2); const Tn = K / N;
        const ys = Array.from(y).sort((a, b) => a - b), h95 = ys[Math.floor(0.95 * (N - 1))] + 0.5, rel = clamp(S.h0 / h95, 0, 1.2);
        const tx = 560, state = Tn < 0.33 ? 'solid' : Tn < 0.9 ? 'liquid' : 'gas';
        s.rr(tx, 110, 26, 330, 13, { c: C.dim, w: 2 }); const fh = 320 * clamp(Tn / 2); s.rr(tx + 4, 436 - fh, 18, fh, 9, { stroke: false, fill: WL.cmap(clamp(Tn / 2)), fa: 0.9 });
        s.txt('temperature', tx + 13, 92, { c: C.dim, size: 14, align: 'center', sans: true }); s.txt(f2(Tn), tx + 13, 460, { c: C.ink, size: 15, align: 'center', sans: true });
        s.txt(state, 760, 150, { c: state === 'solid' ? C.blue : state === 'liquid' ? C.teal : C.red, size: 40, align: 'center', bold: true });
        s.txt('density (compared with the solid)', 640, 250, { c: C.dim, size: 15, sans: true });
        s.rr(640, 268, 260, 22, 6, { c: C.dim, w: 1.5 }); s.rr(642, 270, 256 * clamp(rel), 18, 5, { stroke: false, fill: C.yellow, fa: 0.85 });
        s.txt(`ρ ≈ ${f2(rel)} × ρ_solid`, 640, 312, { c: C.ink, size: 18 });
        s.texAt('\\rho = \\dfrac{m}{V}', 770, 400, 13.3, { size: 44, c: C.yellow });
        s.txt('2D Lennard-Jones particles with weak gravity', 60, 505, { c: C.dim, size: 13, sans: true });
      }
    },
    steps: [
      { say: 'Everything is made of particles, each with mass m.', tex: R`M = N\,m`, why: 'The total mass of a sample is just the number of particles times the mass of one. Heating doesn’t change either.' },
      { say: 'Density is mass per unit volume.', tex: R`\rho = \frac{M}{V}`, why: 'It tells you how tightly mass is packed. Water is 1000 kg per cubic metre.' },
      { say: 'In solids and liquids the particles touch, so each takes up roughly its own size cubed.', tex: R`V \approx N d^3 \;\Longrightarrow\; \rho \approx \frac{m}{d^3}`, why: 'Picture the particles as tiny cubes of side d stacked together. That is why solids and liquids have similar densities.' },
      { say: 'In a gas the spacing s between particles is far bigger than their size.', tex: R`\rho_{\text{gas}} \approx \frac{m}{s^3}`, why: 'Each particle now “owns” a much larger cube of empty space, of side s.' },
      { say: 'So the density ratio depends on the spacing ratio, cubed.', tex: R`\frac{\rho_{\text{liquid}}}{\rho_{\text{gas}}} \approx \left(\frac{s}{d}\right)^3`, why: 'Divide the two expressions: the particle mass m cancels.' },
      { say: 'Water at 100 °C: 958 kg/m³ as liquid, 0.6 kg/m³ as steam.', tex: R`\left(\frac{s}{d}\right)^3 \approx \frac{958}{0.6} \approx 1600 \;\Longrightarrow\; \frac{s}{d} \approx 12`, why: 'The cube root of 1600 is about 11.7: steam molecules are about twelve times farther apart than in liquid water.' }
    ],
    result: R`\rho = \frac{m}{V} \qquad \frac{\rho_{\text{liquid}}}{\rho_{\text{gas}}} \approx \left(\frac{s}{d}\right)^3`,
    assumptions: ['The simulation is a 2D model (Lennard-Jones particles with a little gravity). Real substances are 3D, so its melting and boiling “temperatures” are only illustrative.', 'Contradiction with the simple picture: ice (917 kg/m³) is less dense than liquid water (1000 kg/m³). Hydrogen bonds hold ice in an open hexagonal lattice, which is why ice floats.', 'Temperature measures the average kinetic energy; individual particles have a wide spread of speeds, shown by the colours.']
  });

  /* ================================================================ KS3: Pressure */
  WL.topic({
    id: 'ks3-pressure', stage: 'ks3', strand: 'T', title: 'Pressure',
    summary: 'Pressure as force per area, and why it grows with depth in a liquid.',
    maths: [['Rearranging', 'p = F/A'], ['Volume of a column', 'V = A h'], ['Units', '1 Pa = 1 N/m²']],
    idea: 'A liquid’s pressure at depth h is simply the <em>weight of the column of liquid above</em> each square metre. Deeper means a taller column, so more pressure, pushing in every direction.',
    try: 'Lower the water: every jet weakens, and the top hole stops completely once the surface drops below it.',
    quiz: { q: 'What is the pressure due to the water 10 m below the surface? (ρ = 1000 kg/m³, g = 10 N/kg)', a: ['10 kPa', '100 kPa', '1000 kPa', '1 kPa'], c: 1, ex: 'p = ρgh = 1000 × 10 × 10 = 100 000 Pa = 100 kPa. Add the air above (≈ 101 kPa) for the total pressure.' },
    anim: {
      duration: 13, alt: 'Bricks pressing into sand, and a tank of water with jets spurting from holes at three depths.',
      params: [{ id: 'h', label: 'Water depth', unit: 'cm', min: 15, max: 33, step: 0.5, value: 30 }],
      beats: [[0, 'Pressure is force spread over an area: the same brick presses harder standing on its end.'], [4, 'In a liquid, deeper water has more water above it, so the pressure is higher.'], [7, 'Liquid pressure pushes equally in all directions.'], [10, 'So deeper holes squirt faster: p = ρgh.']],
      draw(s, t) {
        const lvl = s.p.h * 10, bot = 460, sy = bot - lvl, holes = [60, 150, 240], g = 400;
        s.rr(80, 110, 340, 350, 6, { c: C.greyB, w: 3 });
        s.rect(83, sy, 334, bot - sy - 2, { fill: '#1C5D7A', fa: 0.55, stroke: false });
        for (let x = 90; x < 415; x += 20) s.line(x, sy + 2 * Math.sin(t * 3 + x * 0.1), x + 12, sy + 2 * Math.sin(t * 3 + x * 0.1 + 1.2), { c: C.blueA, w: 1.5, a: 0.6 });
        s.line(60, 500, 920, 500, { c: C.dim, w: 2 });
        s.alpha(s.in(t, 4, 1), () => {
          [0.25, 0.55, 0.85].forEach((f) => {
            const d = f * lvl, y = sy + d, L = 8 + d * 0.11, cx = 200;
            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ux, uy]) => s.arrow(cx + ux * 10, y + uy * 10, cx + ux * (10 + L), y + uy * (10 + L), { c: C.yellow, w: 2, head: 7, a: s.in(t, 7, 1) * 0.6 + 0.4 * (ux === 0 && uy === 1 ? 1 : 0) }));
            s.txt(`${f0((1000 * 10 * d) / 1000)} Pa`, 250, y, { c: C.ink, size: 14, sans: true });
          });
        });
        holes.forEach((hy) => {
          const y0 = bot - hy, d = sy < y0 ? y0 - sy : 0; s.circle(420, y0, 5, { c: C.ink, w: 2, fill: C.bg, fa: 1 });
          if (d <= 2) return; const v = Math.sqrt(2 * g * d), Hf = 500 - y0, T = Math.sqrt((2 * Hf) / g), pts = [];
          for (let k = 0; k <= 40; k++) { const tt = (k / 40) * T; pts.push([420 + v * tt, y0 + 0.5 * g * tt * tt]); }
          s.alpha(s.in(t, 9, 1.2) * 0.6 + 0.4, () => {
            s.poly(pts, { c: C.blue, w: 2.5, a: 0.5 });
            for (let k = 0; k < 14; k++) { const tt = (((t * 0.8 + k / 14) % 1) * T); s.dot(420 + v * tt, y0 + 0.5 * g * tt * tt, { c: C.blueA, r: 3 }); }
          });
        });
        s.txt('Pa values use ρ = 1000 kg/m³, g = 10 N/kg, depth in cm', 80, 525, { c: C.dim, size: 12, sans: true });
        s.alpha(s.out(t, 3.6, 0.8) * 0.85 + 0.15, () => {
          s.rect(600, 160, 320, 22, { fill: '#5a4a2a', fa: 0.6, stroke: false });
          const k1 = s.in(t, 0.6, 1.2);
          s.rect(620, 160 - 40 + 4 * k1, 140, 40, { c: C.red, fill: C.red, fa: 0.35, w: 2 }); s.rect(820, 160 - 140 + 14 * k1, 40, 140, { c: C.red, fill: C.red, fa: 0.35, w: 2 });
          s.txt('large A: low p', 690, 200, { c: C.ink, size: 14, align: 'center', sans: true }); s.txt('small A: high p', 840, 200, { c: C.ink, size: 14, align: 'center', sans: true });
        });
        s.texAt('p = \\dfrac{F}{A}', 760, 250, 0.8, { size: 34, c: C.red, t1: 4 });
        s.texAt('p = \\rho g h', 250, 70, 10.2, { size: 40, c: C.yellow });
      }
    },
    steps: [
      { say: 'Pressure is force per unit area.', tex: R`p = \frac{F}{A}`, why: 'The same push spread over a bigger area does less to each square metre. Snowshoes work this way; drawing pins do the opposite.' },
      { say: 'Picture a column of liquid of cross-section A reaching down to depth h.', tex: R`V = A\,h`, why: 'The column is a prism, so its volume is its base area times its height.' },
      { say: 'Its mass:', tex: R`m = \rho V = \rho A h`, why: 'Density is mass per volume, so mass = density × volume.' },
      { say: 'Its weight presses on the area A at the bottom:', tex: R`W = m g = \rho A h g`, why: 'Weight = mass × gravitational field strength.' },
      { say: 'Divide by the area: the width of the column cancels.', tex: R`p = \frac{W}{A} = \rho g h`, why: 'A drops out, so the pressure depends only on depth, not on the shape or width of the container.' },
      { say: 'Add the air pressing on the surface for the total pressure.', tex: R`p_{\text{total}} = p_{\text{atm}} + \rho g h`, why: 'The atmosphere is another column (of air) above the water, worth about 101 kPa at sea level: the same as 10 m of water.' }
    ],
    result: R`p = \frac{F}{A}, \qquad p = \rho g h`,
    assumptions: ['The liquid is incompressible and at rest, and g is the same at every depth.', 'The jet speeds use v = √(2gh), which ignores viscosity and the narrowing of the jet; a real sharp-edged hole delivers only about 60% of that ideal flow.', 'Air pressure acts on the surface and on the jets alike, so it cancels from the jet speed but not from the total pressure at depth.']
  });

  /* ================================================================ KS3: Gravity & orbits (Newton's cannon) */
  const GM = 4.77e6, ER = 140, EC = [480, 300];
  function shoot(S, v) { const r0 = ER + 14, vo = Math.sqrt(GM / r0); S.shots.push({ v, x: 0, y: -r0, vx: v * vo, vy: 0, pts: [], alive: true, hit: false }); if (S.shots.length > 7) S.shots.shift(); }
  WL.topic({
    id: 'ks3-space', stage: 'ks3', strand: 'S', title: 'Gravity & Orbits',
    summary: 'Weight, falling, and why an orbit is just falling sideways fast enough to keep missing the ground.',
    maths: [['Squares & square roots', 'v = √(gR)'], ['Pythagoras', 'How fast a curved surface drops away'], ['Standard form', 'R = 6.37 × 10⁶ m']],
    idea: 'A satellite is <em>falling all the time</em>. It also moves sideways so fast that the Earth’s surface curves away beneath it as quickly as it falls.',
    try: 'After the intro, set the speed to 1.0 for a circle, 1.25 for an ellipse and 1.45 to escape.',
    quiz: { q: 'Why do astronauts on the space station feel weightless?', a: ['There is no gravity in space', 'They and the station are falling around the Earth together', 'The station shields them from gravity', 'They are too far from Earth to be pulled'], c: 1, ex: 'Gravity at the station’s height is still about 90% of its surface value. Astronaut and station fall together, so nothing pushes on the astronaut: weightlessness is free fall.' },
    anim: {
      duration: 18, stateful: true, alt: 'Newton’s cannon: balls fired sideways from a mountain at increasing speeds fall back, orbit, and escape.',
      params: [{ id: 'v', label: 'Launch speed', unit: '× orbital', min: 0.4, max: 1.5, step: 0.01, value: 1, noReset: true }],
      beats: [[0, 'Throw a ball sideways from a very high mountain: it falls to the ground.'], [2.4, 'Throw it faster: it lands farther away, because the Earth curves away beneath it.'], [7.3, 'At about 7.9 km/s the ground curves away as fast as the ball falls. It never lands: an orbit.'], [10.8, 'Faster still: a stretched orbit, an ellipse.'], [14.2, 'Above about 11.2 km/s it escapes Earth’s gravity for good.']],
      setup(s) { s.state = { shots: [], plan: [[0.3, 0.45], [2.6, 0.7], [5, 0.88], [7.5, 1.0], [11, 1.25], [14.5, 1.45]], fired: 0 }; },
      onParam(s) { shoot(s.state, s.p.v); },
      step(s, dt) {
        const S = s.state;
        while (S.fired < S.plan.length && s.t >= S.plan[S.fired][0]) { shoot(S, S.plan[S.fired][1]); S.fired++; }
        const h = 0.004, n = Math.max(1, Math.round(dt / h));
        S.shots.forEach((q) => {
          if (!q.alive) return;
          for (let k = 0; k < n; k++) {
            const acc = (x, y) => { const r = Math.hypot(x, y), a = -GM / (r * r * r); return [a * x, a * y]; };
            const a1 = acc(q.x, q.y), x2 = q.x + q.vx * h / 2, y2 = q.y + q.vy * h / 2, v2x = q.vx + a1[0] * h / 2, v2y = q.vy + a1[1] * h / 2, a2 = acc(x2, y2);
            q.x += v2x * h; q.y += v2y * h; q.vx += a2[0] * h; q.vy += a2[1] * h;
            const r = Math.hypot(q.x, q.y); if (r < ER) { q.alive = false; q.hit = true; break; } if (r > 1400) { q.alive = false; break; }
          }
          q.pts.push([q.x, q.y]); if (q.pts.length > 1400) q.pts.shift();
        });
      },
      draw(s, t) {
        const [cx, cy] = EC, S = s.state;
        s.glow(cx, cy, ER + 40, C.blue, 0.25);
        s.circle(cx, cy, ER, { c: C.teal, w: 2, fill: '#163e57', fa: 1 });
        [[0.3, 0.2, 40], [-0.5, -0.1, 30], [0.1, -0.6, 26], [-0.2, 0.55, 34]].forEach(([u, v, r]) => s.circle(cx + u * ER, cy + v * ER, r, { stroke: false, fill: '#3f7a4f', fa: 0.75 }));
        s.poly([[cx - 18, cy - ER + 2], [cx, cy - ER - 16], [cx + 18, cy - ER + 2]], { c: C.greyB, w: 2, fill: C.greyB, fa: 0.8, close: true });
        S.shots.forEach((q, i) => {
          const col = WL.cmap(clamp((q.v - 0.4) / 1.1)), old = (S.shots.length - 1 - i) * 0.12;
          const pts = q.pts.map(([x, y]) => [cx + x, cy + y]);
          s.fade(pts, { c: col, w: 2.6, a: 1 - old, pow: 0.4 });
          const e = pts[pts.length - 1]; if (e) { if (q.alive) s.dot(e[0], e[1], { c: col, r: 6 }); if (q.hit) s.circle(e[0], e[1], 7, { c: col, w: 2 }); }
          if (e && i === S.shots.length - 1) s.txt(`${f1(q.v * 7.9)} km/s`, e[0] + 12, e[1] - 12, { c: col, size: 16, sans: true });
        });
        s.texAt('v = \\sqrt{gR} \\approx 7.9\\ \\text{km/s}', 790, 470, 8, { size: 28, c: C.yellow });
        s.texAt('v_{\\text{esc}} = \\sqrt{2gR} \\approx 11.2\\ \\text{km/s}', 790, 515, 14.6, { size: 24, c: C.red });
        s.txt('heights exaggerated; air resistance ignored', 30, 520, { c: C.dim, size: 12, sans: true });
      }
    },
    steps: [
      { say: 'Weight is mass times the gravitational field strength.', tex: R`W = mg, \qquad g_{\text{Earth}} \approx 9.8\ \text{N/kg}`, why: 'Mass is how much stuff; weight is the pull of gravity on it. On the Moon, g ≈ 1.6 N/kg, so you would weigh about a sixth as much.' },
      { say: 'Anything dropped falls about 4.9 m in its first second.', tex: R`s = \tfrac12 g t^2 = \tfrac12 (9.8)(1)^2 = 4.9\ \text{m}`, why: 'This is the distance fallen from rest with constant acceleration g (you will derive this formula at GCSE).' },
      { say: 'Earth’s surface curves away: over a horizontal distance d it drops by about d²/2R.', tex: R`\text{drop} \approx \frac{d^2}{2R}`, why: 'Pythagoras: (R − drop)² + d² = R². When the drop is tiny compared with R, this simplifies to drop ≈ d²/2R.' },
      { say: 'In an orbit, the ground drops away exactly as fast as the ball falls. In 1 s the ball moves d = v × 1 s.', tex: R`\frac{v^2}{2R} = \tfrac12 g`, why: 'Set the curvature drop over one second equal to the 4.9 m the ball falls in that second.' },
      { say: 'Solve for the orbital speed.', tex: R`v = \sqrt{gR} = \sqrt{9.8 \times 6.37\times10^{6}} \approx 7.9\ \text{km/s}`, why: 'Multiply both sides by 2R and take the square root. Check: over 7.9 km the Earth curves away by 7900²/(2 × 6.37 × 10⁶) ≈ 4.9 m.' },
      { say: 'Time for one lap.', tex: R`T = \frac{2\pi R}{v} \approx 85\ \text{minutes}`, why: 'Distance round the Earth ÷ speed. The space station, about 400 km up, takes about 92 minutes.' }
    ],
    result: R`v_{\text{orbit}} = \sqrt{gR} \approx 7.9\ \text{km/s}`,
    assumptions: ['No air resistance. A cannonball at 8 km/s near the ground would burn up; satellites orbit above most of the atmosphere.', 'Steps 2–5 treat g as constant. The animation uses the full inverse-square pull, which is what makes the faster shots ellipses.', 'A real rocket must first climb above the atmosphere; at the station’s height the orbital speed is about 7.7 km/s, slightly less than at the surface.']
  });

  /* ================================================================ GCSE: Newton & momentum (collisions) */
  WL.topic({
    id: 'gcse-newton', stage: 'gcse', strand: 'M', title: 'Newton’s Laws & Momentum',
    summary: 'F = ma, action–reaction pairs, and why the total momentum of colliding objects never changes.',
    maths: [['Algebra', 'Solving for an unknown velocity'], ['Signs & directions', 'Momentum is a vector: + right, − left'], ['Area under a graph', 'Impulse = area under F–t']],
    idea: 'In a collision each object pushes the other with an <em>equal and opposite force</em> for the <em>same time</em>. Whatever momentum one gains, the other loses.',
    try: 'Set e = 0 to make the trolleys stick: momentum stays the same but the kinetic energy readout drops.',
    quiz: { q: 'A 2 kg trolley at 3 m/s hits and sticks to a stationary 1 kg trolley. How fast do they move together?', a: ['1 m/s', '1.5 m/s', '2 m/s', '3 m/s'], c: 2, ex: 'Momentum before: 2 × 3 = 6 kg m/s. After: (2 + 1) × v = 6, so v = 2 m/s.' },
    anim: {
      duration: 15, alt: 'Two trolleys collide on a track while bars track their momentum and a graph shows the force pulse.',
      params: [{ id: 'm1', label: 'Mass m₁', unit: 'kg', min: 1, max: 5, step: 0.5, value: 2 }, { id: 'm2', label: 'Mass m₂', unit: 'kg', min: 1, max: 5, step: 0.5, value: 1 }, { id: 'u1', label: 'Speed u₁', unit: 'm/s', min: 1, max: 3, step: 0.1, value: 2 }, { id: 'e', label: 'Bounciness e', unit: '', min: 0, max: 1, step: 0.05, value: 1 }],
      beats: [[0, 'A moving trolley heads for a stationary one on a frictionless track.'], [3, 'Momentum p = mv. The bars show each trolley’s momentum and the total.'], [6, 'In the collision they push each other with equal and opposite forces (Newton’s third law).'], [9, 'Same force for the same time: equal and opposite changes in momentum. The total never changes.'], [12, 'Make them sticky (e = 0): kinetic energy is lost, momentum is still conserved.']],
      draw(s, t) {
        const { m1, m2, u1, e } = s.p, w1 = 60 + 10 * m1, w2 = 60 + 10 * m2, x10 = 150, x20 = 560, Dt = 0.18, sc = 100;
        const tc = (x20 - x10 - (w1 + w2) / 2) / (u1 * sc), v1 = (u1 * (m1 - e * m2)) / (m1 + m2), v2 = (m1 * u1 * (1 + e)) / (m1 + m2), Tl = tc + Dt + 2.6;
        const tau = WL.cyc(t, Tl, 0.8), I = (q) => q / 2 - (Dt / (2 * Math.PI)) * Math.sin((Math.PI * q) / Dt), ph = (q) => (1 - Math.cos((Math.PI * q) / Dt)) / 2;
        let x1, x2, vv1, vv2; const x1c = x10 + u1 * sc * tc;
        if (tau < tc) { x1 = x10 + u1 * sc * tau; x2 = x20; vv1 = u1; vv2 = 0; }
        else if (tau < tc + Dt) { const q = tau - tc; x1 = x1c + sc * (u1 * q + (v1 - u1) * I(q)); x2 = x20 + sc * v2 * I(q); vv1 = u1 + (v1 - u1) * ph(q); vv2 = v2 * ph(q); }
        else { const q = tau - tc - Dt; x1 = x1c + sc * (u1 * Dt + (v1 - u1) * I(Dt)) + sc * v1 * q; x2 = x20 + sc * v2 * I(Dt) + sc * v2 * q; vv1 = v1; vv2 = v2; }
        const ty = 210;
        s.line(40, ty + 26, 930, ty + 26, { c: C.dim, w: 3 });
        const cart = (x, w, col, lab, v) => { s.rr(x - w / 2, ty - 26, w, 44, 6, { c: col, w: 2.5, fill: col, fa: 0.3 }); s.circle(x - w / 3, ty + 20, 6, { c: C.ink, w: 2, fill: C.bg, fa: 1 }); s.circle(x + w / 3, ty + 20, 6, { c: C.ink, w: 2, fill: C.bg, fa: 1 }); s.txt(lab, x, ty - 4, { c: C.ink, size: 15, align: 'center', sans: true }); if (Math.abs(v) > 0.02) s.arrow(x, ty - 40, x + v * 40, ty - 40, { c: col, w: 3, head: 10 }); };
        cart(x1, w1, C.blue, `${m1} kg`, vv1); cart(x2, w2, C.red, `${m2} kg`, vv2);
        if (tau >= tc && tau < tc + Dt + 0.05) s.flash((x1 + w1 / 2 + x2 - w2 / 2) / 2, ty - 4, (tau - tc) / (Dt + 0.05), { c: C.yellow, r: 10, R: 24 });
        const p1 = m1 * vv1, p2 = m2 * vv2, px = 300, k = 24;
        s.alpha(s.in(t, 3, 1), () => {
          s.line(px, 318, px, 470, { c: C.dim, w: 1.5 });
          [[p1, C.blue, 'p₁'], [p2, C.red, 'p₂'], [p1 + p2, C.yellow, 'total']].forEach(([p, col, lab], i) => { const y = 340 + i * 46; s.rect(px, y - 13, p * k, 26, { c: col, fill: col, fa: 0.45, w: 2 }); s.txt(lab, px - 12, y, { c: col, size: 16, align: 'right', sans: true }); s.txt(`${f2(p)} kg m/s`, px + Math.max(0, p * k) + 10, y, { c: C.ink, size: 15, sans: true }); });
        });
        const KEb = 0.5 * m1 * u1 * u1, KEa = 0.5 * m1 * vv1 * vv1 + 0.5 * m2 * vv2 * vv2;
        s.txt(`kinetic energy: ${f2(KEb)} J before → ${f2(KEa)} J now`, 60, 505, { c: e < 0.999 && tau > tc + Dt ? C.orange : C.dim, size: 16, sans: true, a: s.in(t, 9, 1) });
        const gx = 600, gy = 470, gw = 320, gh = 140, Fm = (m2 * v2 * Math.PI) / (2 * Dt), wl = tc - 0.25, wr = tc + Dt + 0.25, GX = (q) => gx + ((q - wl) / (wr - wl)) * gw;
        s.alpha(s.in(t, 6, 1), () => {
          s.line(gx, gy - gh / 2, gx + gw, gy - gh / 2, { c: C.dim, w: 1.5 }); s.txt('force', gx - 6, gy - gh - 6, { c: C.dim, size: 13, sans: true }); s.txt('time', gx + gw, gy - gh / 2 + 16, { c: C.dim, size: 13, sans: true, align: 'right' });
          const on2 = [], on1 = []; for (let i = 0; i <= 60; i++) { const q = wl + ((wr - wl) * i) / 60, z = q - tc, f = z > 0 && z < Dt ? Math.sin((Math.PI * z) / Dt) : 0; on2.push([GX(q), gy - gh / 2 - f * gh * 0.45]); on1.push([GX(q), gy - gh / 2 + f * gh * 0.45]); }
          s.poly(on2, { c: C.red, w: 2.5, fill: C.red, fa: 0.25 }); s.poly(on1, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.25 });
          s.txt(`peak ${f1(Fm)} N`, gx + gw - 4, gy - gh + 4, { c: C.dim, size: 13, sans: true, align: 'right' });
          if (tau < wr && tau > wl) s.line(GX(tau), gy - gh, GX(tau), gy, { c: C.ink, w: 1, dash: [3, 4] });
        });
        s.texAt('p = mv', 300, 290, 3.3, { size: 30, c: C.yellow });
        s.texAt('F = \\dfrac{\\Delta p}{\\Delta t}', 760, 290, 6.3, { size: 30, c: C.ink });
        s.texAt('m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2', 480, 76, 9.3, { size: 32, c: C.yellow });
      }
    },
    steps: [
      { say: 'Newton’s second law in terms of momentum p = mv.', tex: R`F = ma = m\,\frac{\Delta v}{\Delta t} = \frac{\Delta p}{\Delta t}`, why: 'For a fixed mass, m Δv is the change in mv. Force is the rate at which momentum changes.' },
      { say: 'Newton’s third law: during contact the two forces are equal and opposite.', tex: R`F_{1\to2} = -F_{2\to1}`, why: 'Forces always come in pairs acting on different objects. If trolley 1 pushes trolley 2 forwards, trolley 2 pushes trolley 1 backwards just as hard.' },
      { say: 'They push for the same time Δt, so their momentum changes are equal and opposite.', tex: R`\Delta p_2 = F_{1\to2}\,\Delta t = -F_{2\to1}\,\Delta t = -\Delta p_1`, why: 'Contact starts and ends at the same instant for both trolleys: you can’t touch something without it touching you.' },
      { say: 'So the total momentum doesn’t change: conservation of momentum.', tex: R`m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2`, why: 'Δp₁ + Δp₂ = 0 means the sum before equals the sum after, whatever the forces were like.' },
      { say: 'Kinetic energy is not always conserved.', tex: R`\tfrac12 m_1v_1^2 + \tfrac12 m_2v_2^2 \le \tfrac12 m_1u_1^2 + \tfrac12 m_2u_2^2`, why: 'In a sticky collision some energy becomes heat and sound. Only in a perfectly elastic collision (e = 1) is kinetic energy kept.' },
      { say: 'Impulse: the area under the force–time graph is the change of momentum.', tex: R`J = F\,\Delta t = \Delta p`, why: 'For a given Δp, stretching the contact time shrinks the force. That is how crumple zones, airbags and bending your knees protect you.' }
    ],
    result: R`F = \frac{\Delta p}{\Delta t}, \qquad \sum p_{\text{before}} = \sum p_{\text{after}}`,
    assumptions: ['No friction or other horizontal external force; otherwise momentum leaks into the track and the Earth.', 'The collision is modelled as a smooth 0.18 s push. Real contact times range from microseconds (steel balls) to tenths of a second (cars with crumple zones).', 'Near the speed of light momentum is γmv rather than mv. Conservation still holds; the formula changes.']
  });

  /* ================================================================ GCSE: EM spectrum & refraction */
  const nGlass = (nm) => 1.5046 + 4200 / (nm * nm);
  WL.topic({
    id: 'gcse-em-spectrum', stage: 'gcse', strand: 'W', title: 'EM Spectrum & Refraction',
    summary: 'The family of electromagnetic waves, and why light bends when it changes speed.',
    maths: [['Trigonometry', 'sin θ in right-angled triangles'], ['Ratios', 'n = c/v'], ['Standard form', 'f = c/λ ≈ 6 × 10¹⁴ Hz']],
    idea: 'A wavefront hitting glass at an angle slows down <em>one end first</em>, like a line of marchers stepping from road onto mud. The front swings round: that is refraction.',
    try: 'Switch “from glass to air” on and raise θ₁ past about 41°: the transmitted wave vanishes. That is total internal reflection.',
    quiz: { q: 'Light travels from glass (n = 1.5) into air. What is the critical angle?', a: ['30°', '42°', '48°', '60°'], c: 1, ex: 'sin θc = 1/1.5 = 0.667, so θc ≈ 41.8°. Beyond that angle all the light reflects back into the glass.' },
    anim: {
      duration: 15, alt: 'Wavefronts crossing from air into glass, bending towards the normal, with an EM spectrum strip.',
      params: [{ id: 'th', label: 'Angle θ₁', unit: '°', min: 0, max: 80, step: 1, value: 40 }, { id: 'nm', label: 'Wavelength', unit: 'nm', min: 400, max: 700, step: 5, value: 520 }, { id: 'out', label: 'From glass to air', toggle: true, value: 0 }],
      beats: [[0, 'Light is an electromagnetic wave. Each line is a crest: a wavefront.'], [3, 'In glass light slows to v = c/n. The frequency can’t change, so the wavelength shrinks.'], [6, 'Each wavefront reaches the glass at one end first; that end slows first, so the wave turns towards the normal.'], [9, 'Snell’s law: n₁ sin θ₁ = n₂ sin θ₂. Violet bends slightly more than red: dispersion.'], [12, 'Switch on “from glass to air” and steepen the angle: past the critical angle all the light reflects.']],
      draw(s, t) {
        const th = (s.p.th * Math.PI) / 180, nm = s.p.nm, ng = nGlass(nm), out = !!s.p.out, Y = 250, O = [480, Y], lam0 = nm / 10, col = WL.nmColour(nm), w = 2.4;
        const n1 = out ? ng : 1, n2 = out ? 1 : ng, sn2 = (n1 * Math.sin(th)) / n2, tir = sn2 > 1, th2 = tir ? 0 : Math.asin(sn2), dir = out ? -1 : 1;
        s.rect(0, Y, 960, 190, { fill: '#173048', fa: 0.6, stroke: false }); s.txt('glass', 20, Y + 22, { c: C.blueA, size: 15, sans: true }); s.txt('air', 20, Y - 18, { c: C.dim, size: 15, sans: true });
        const crests = (d, n, region, a) => {
          const k = (2 * Math.PI * n) / lam0, ctx = s.ctx; ctx.save(); ctx.beginPath(); if (region === 'top') ctx.rect(0, 0, 960, Y); else ctx.rect(0, Y, 960, 190); ctx.clip();
          const u = [-d[1], d[0]];
          for (let m = -40; m <= 40; m++) { const ph = (w * t + 2 * Math.PI * m) / k, c0 = [O[0] + d[0] * ph, O[1] + d[1] * ph]; s.line(c0[0] - u[0] * 1200, c0[1] - u[1] * 1200, c0[0] + u[0] * 1200, c0[1] + u[1] * 1200, { c: col, w: 2, a }); }
          ctx.restore();
        };
        const dIn = [Math.sin(th), dir * Math.cos(th)], dR = [Math.sin(th), -dir * Math.cos(th)], dT = [Math.sin(th2), dir * Math.cos(th2)];
        const inReg = out ? 'bot' : 'top', tReg = out ? 'top' : 'bot', a0 = s.in(t, 0, 1.2);
        s.alpha(a0, () => { crests(dIn, n1, inReg, 0.75); if (!tir) crests(dT, n2, tReg, 0.75 * s.in(t, 3, 1)); crests(dR, n1, inReg, tir ? 0.7 : 0.14); });
        s.line(0, Y, 960, Y, { c: C.blueA, w: 2 }); s.line(480, Y - 200, 480, Y + 180, { c: C.ink, w: 1.4, dash: [5, 6] });
        const L = 260; s.arrow(O[0] - dIn[0] * L, O[1] - dIn[1] * L, O[0] - dIn[0] * 30, O[1] - dIn[1] * 30, { c: C.ink, w: 3.5 });
        if (!tir) s.arrow(O[0], O[1], O[0] + dT[0] * 170, O[1] + dT[1] * 170, { c: C.ink, w: 3.5, a: s.in(t, 3, 1) });
        s.arrow(O[0], O[1], O[0] + dR[0] * (tir ? 200 : 120), O[1] + dR[1] * (tir ? 200 : 120), { c: C.ink, w: tir ? 3.5 : 1.5, a: tir ? 1 : 0.4 });
        const up = Math.PI / 2, aIn = out ? -up - th : up + th, aT = out ? up - th2 : -up + th2;
        s.angle(480, Y, 54, out ? -up : up, aIn, { c: C.yellow, w: 2.5, tex: '\\theta_1', lc: C.yellow, gap: 22 });
        if (!tir) s.angle(480, Y, 54, out ? up : -up, aT, { c: C.green, w: 2.5, tex: '\\theta_2', lc: C.green, gap: 22, a: s.in(t, 3, 1) });
        s.txt(`n(glass) = ${ng.toFixed(3)} at ${nm} nm`, 940, 26, { c: C.ink, size: 17, align: 'right', sans: true });
        s.txt(tir ? `θ₁ = ${s.p.th}° > critical ${f1(deg(Math.asin(1 / ng)))}°: total internal reflection` : `θ₁ = ${s.p.th}°   θ₂ = ${f1(deg(th2))}°`, 940, 52, { c: tir ? C.red : C.ink, size: 17, align: 'right', sans: true });
        s.texAt('n_1\\sin\\theta_1 = n_2\\sin\\theta_2', 180, 92, 9.3, { size: 32, c: C.yellow });
        const sy = 470, bands = [['Radio', '#355'], ['Micro', '#455'], ['Infrared', '#644'], ['Visible', null], ['UV', '#536'], ['X-ray', '#446'], ['Gamma', '#335']], bx = 60, bw = 840 / 7;
        bands.forEach(([n, c], i) => { if (c) s.rect(bx + i * bw, sy - 14, bw - 2, 28, { fill: c, fa: 0.8, stroke: false }); else for (let k = 0; k < 30; k++) s.rect(bx + i * bw + (k * (bw - 2)) / 30, sy - 14, (bw - 2) / 30 + 0.6, 28, { fill: WL.nmColour(700 - (k * 300) / 29), fa: 0.9, stroke: false }); s.txt(n, bx + i * bw + bw / 2, sy + 28, { c: C.dim, size: 13, align: 'center', sans: true }); });
        const mk = bx + 3 * bw + ((700 - nm) / 300) * (bw - 2); s.poly([[mk, sy - 18], [mk - 7, sy - 30], [mk + 7, sy - 30]], { c: C.ink, fill: C.ink, fa: 1, close: true, w: 1 });
        s.txt(`f = c/λ = ${((3e8 / (nm * 1e-9)) / 1e14).toFixed(2)} × 10¹⁴ Hz`, 900, sy + 52, { c: C.ink, size: 15, align: 'right', sans: true });
        s.txt('longer λ, lower f', 60, sy + 52, { c: C.dim, size: 13, sans: true });
      }
    },
    steps: [
      { say: 'Light slows down in glass. The refractive index n measures by how much.', tex: R`v = \frac{c}{n}`, why: 'For glass n ≈ 1.5, so light travels at about 2 × 10⁸ m/s inside it.' },
      { say: 'The frequency is set by the source and can’t change at the boundary, so the wavelength shrinks.', tex: R`\lambda_2 = \frac{v}{f} = \frac{\lambda_1}{n}`, why: 'Crests must arrive at the boundary and leave it at the same rate, or they would pile up. Same f, smaller v, so smaller λ.' },
      { say: 'Follow one wavefront AB hitting the glass. In time Δt, end B travels v₁Δt in air while end A travels v₂Δt in glass.', tex: R`BD = v_1\,\Delta t, \qquad AC = v_2\,\Delta t`, why: 'A enters the glass first and slows down; B is still in air for a while. This mismatch is what turns the front.' },
      { say: 'Both distances share the same hypotenuse AD along the surface.', tex: R`\sin\theta_1 = \frac{v_1\Delta t}{AD}, \qquad \sin\theta_2 = \frac{v_2\Delta t}{AD}`, why: 'Each wavefront makes the same angle with the surface as its ray makes with the normal, so these right-angled triangles contain θ₁ and θ₂.' },
      { say: 'Divide the two equations.', tex: R`\frac{\sin\theta_1}{\sin\theta_2} = \frac{v_1}{v_2} = \frac{n_2}{n_1} \;\Longrightarrow\; n_1\sin\theta_1 = n_2\sin\theta_2`, why: 'AD and Δt cancel. Using v = c/n turns the speed ratio into an index ratio: Snell’s law.' },
      { say: 'Going from glass into air, θ₂ reaches 90° at the critical angle.', tex: R`\sin\theta_c = \frac{n_2}{n_1} = \frac{1}{1.5} \;\Longrightarrow\; \theta_c \approx 42^\circ`, why: 'Above θc, Snell’s law would need sin θ₂ > 1, which is impossible: no wave can leave, so all of it reflects. Optical fibres rely on this.' }
    ],
    result: R`n_1\sin\theta_1 = n_2\sin\theta_2, \qquad c = f\lambda`,
    assumptions: ['Some light is always reflected at the surface (about 4% for glass at normal incidence); the faint reflected wavefronts show this.', 'n depends on wavelength (dispersion, modelled here with Cauchy’s formula), which is why prisms split white light.', 'Rigour: the “slower light” in glass is really the incoming wave combined with waves re-emitted by the atoms. For X-rays n is slightly below 1, so the phase velocity exceeds c, with no conflict with relativity because no information travels at that speed.']
  });

  /* ================================================================ GCSE: Motor effect */
  const fieldLines = (() => { const cache = {}; return (I, B) => {
    const key = I.toFixed(2) + '|' + B.toFixed(2); if (cache[key]) return cache[key];
    const c = 12 * I, cx = 480, cy = 280, F = (x, y) => { const rx = x - cx, ry = y - cy, r2 = rx * rx + ry * ry + 30; return [B + (c * -ry) / r2, (c * rx) / r2]; };
    const lines = []; for (let y0 = 130; y0 <= 430; y0 += 20) { let x = 160, y = y0; const pts = [[x, y]]; for (let k = 0; k < 500; k++) { const v = F(x, y), m = Math.hypot(v[0], v[1]) || 1; x += (4 * v[0]) / m; y += (4 * v[1]) / m; pts.push([x, y]); if (x > 800 || x < 150 || y < 110 || y > 450 || Math.hypot(x - cx, y - cy) < 16) break; } lines.push(pts); }
    if (Object.keys(cache).length > 300) for (const k in cache) delete cache[k];
    return (cache[key] = lines);
  }; })();
  WL.topic({
    id: 'gcse-magnetism', stage: 'gcse', strand: 'E', title: 'The Motor Effect',
    summary: 'Why a current-carrying wire in a magnetic field feels a force, F = BIL, and how that spins a motor.',
    maths: [['Rearranging', 'F = BIL'], ['Directions', 'Force ⟂ current ⟂ field'], ['Units', '1 T = 1 N/(A m)']],
    idea: 'The wire’s own circular field <em>adds to</em> the magnet’s field on one side and <em>cancels</em> it on the other. The wire is pushed from the strong side towards the weak side.',
    try: 'Drag the current through zero to negative: the force flips. Then switch on the coil to see a motor.',
    quiz: { q: 'A 0.2 m wire carrying 3 A sits at right angles to a 0.5 T field. What is the force on it?', a: ['0.3 N', '3 N', '30 N', '0.03 N'], c: 0, ex: 'F = BIL = 0.5 × 3 × 0.2 = 0.3 N.' },
    anim: {
      duration: 15, alt: 'Field lines between magnet poles bending around a current-carrying wire, which is pushed down; optionally a rotating motor coil.',
      params: [{ id: 'I', label: 'Current I', unit: 'A', min: -5, max: 5, step: 0.5, value: 3 }, { id: 'B', label: 'Field B', unit: 'T', min: 0.2, max: 1, step: 0.05, value: 0.6 }, { id: 'motor', label: 'Show motor coil', toggle: true, value: 0 }],
      beats: [[0, 'Between the poles of a magnet the field B runs from N to S.'], [3, 'A current makes its own circular field (⊗ means current into the screen).'], [6, 'The fields add above the wire and cancel below: the wire is pushed towards the weak side. F = BIL.'], [9, 'Reverse the current and the force reverses.'], [12, 'Switch on the coil: forces on its two sides turn it. With a commutator, that’s a motor.']],
      draw(s, t) {
        const I = s.p.I, B = s.p.B, motor = !!s.p.motor, cx = 480, cy = 280, L = 0.1, F = B * Math.abs(I) * L;
        s.rr(50, 110, 100, 340, 8, { c: C.red, w: 2, fill: C.red, fa: 0.35 }); s.rr(810, 110, 100, 340, 8, { c: C.blue, w: 2, fill: C.blue, fa: 0.35 });
        s.txt('N', 100, 280, { c: C.ink, size: 40, align: 'center', bold: true }); s.txt('S', 860, 280, { c: C.ink, size: 40, align: 'center', bold: true });
        if (!motor) {
          const lines = fieldLines(s.in(t, 3, 2) * I, B);
          lines.forEach((pts, i) => { s.poly(pts, { c: C.blue, w: 1.6, a: 0.55 }); s.poly(pts, { c: C.blueA, w: 2.4, dash: [5, 50], dashOff: -t * 45 - i * 7, a: 0.85 }); });
          s.alpha(s.in(t, 3, 1) * s.out(t, 6.5, 1), () => { [30, 52, 76].forEach((r) => s.circle(cx, cy, r, { c: C.yellow, w: 1.6, dash: [5, 6], a: 0.7 })); });
          const dy = 34 * Math.tanh(F / 0.3) * Math.sign(I) * s.in(t, 6, 1.5), wy = cy + dy;
          s.circle(cx, wy, 15, { c: C.ink, w: 2.5, fill: C.bg, fa: 1 });
          if (I >= 0) { s.line(cx - 8, wy - 8, cx + 8, wy + 8, { c: C.ink, w: 2.5 }); s.line(cx + 8, wy - 8, cx - 8, wy + 8, { c: C.ink, w: 2.5 }); } else s.dot(cx, wy, { c: C.ink, r: 4 });
          s.alpha(s.in(t, 6, 1), () => { if (Math.abs(I) > 0.01) { s.arrow(cx + 40, wy, cx + 40, wy + Math.sign(I) * (30 + 220 * F), { c: C.yellow, w: 4 }); s.txt(`F = ${F.toFixed(2)} N`, cx + 54, wy + Math.sign(I) * 60, { c: C.yellow, size: 18 }); } });
          s.txt(I >= 0 ? 'current into the screen' : 'current out of the screen', cx, 470, { c: C.dim, size: 14, align: 'center', sans: true });
        } else {
          for (let y = 140; y <= 420; y += 28) { s.line(160, y, 800, y, { c: C.blue, w: 1.4, a: 0.45 }); s.line(160, y, 800, y, { c: C.blueA, w: 2.2, a: 0.8, dash: [5, 50], dashOff: -t * 45 - y }); }
          const phi = t * 1.6 * Math.sign(I || 1) * (0.4 + 0.6 * Math.abs(I) / 5), r = 95, sgn = Math.cos(phi) >= 0 ? 1 : -1;
          const p1 = [cx + r * Math.cos(phi), cy - r * Math.sin(phi)], p2 = [cx - r * Math.cos(phi), cy + r * Math.sin(phi)];
          s.line(p1[0], p1[1], p2[0], p2[1], { c: C.orange, w: 4, a: 0.7 }); s.dot(cx, cy, { c: C.dim, r: 4 });
          [[p1, sgn], [p2, -sgn]].forEach(([p, d]) => { s.circle(p[0], p[1], 13, { c: C.ink, w: 2.5, fill: C.bg, fa: 1 }); if (d > 0) { s.line(p[0] - 7, p[1] - 7, p[0] + 7, p[1] + 7, { c: C.ink, w: 2.2 }); s.line(p[0] + 7, p[1] - 7, p[0] - 7, p[1] + 7, { c: C.ink, w: 2.2 }); } else s.dot(p[0], p[1], { c: C.ink, r: 3.5 }); s.arrow(p[0], p[1], p[0], p[1] + d * Math.sign(I || 1) * 70, { c: C.yellow, w: 3.5 }); });
          s.txt(`torque ∝ |cos φ| = ${Math.abs(Math.cos(phi)).toFixed(2)}`, cx, 470, { c: C.dim, size: 15, align: 'center', sans: true });
          s.txt('the commutator flips the current every half turn', cx, 495, { c: C.dim, size: 13, align: 'center', sans: true });
        }
        s.texAt('F = BIL', 480, 70, 6.3, { size: 44, c: C.yellow });
      }
    },
    steps: [
      { say: 'A charge q moving at speed v across a magnetic field B feels a sideways force.', tex: R`F = qvB`, why: 'This magnetic force is perpendicular to both the motion and the field. (You will meet it properly at A-Level; here it explains where F = BIL comes from.)' },
      { say: 'In a wire of length L and cross-section A, with n charge carriers per m³ drifting at v_d:', tex: R`I = nAqv_d, \qquad N = nAL`, why: 'Current is charge per second through the cross-section; N is how many carriers are in the length L.' },
      { say: 'Add up the force on every carrier.', tex: R`F = N\,q v_d B = (nAL)\,q v_d B = B\,(nAqv_d)\,L = BIL`, why: 'Regroup the factors: nAqv_d is just the current I.' },
      { say: 'If the wire makes an angle θ with the field, only the perpendicular part counts.', tex: R`F = BIL\sin\theta`, why: 'A wire running along the field feels no force at all (θ = 0).' },
      { say: 'Direction: Fleming’s left-hand rule (in vector form, F = I L × B).', tex: R`\vec F = I\,\vec L \times \vec B`, why: 'First finger: Field. Second finger: Current. Thumb: Motion (force). In the animation, current into the screen with B to the right gives a downward force.' },
      { say: 'A coil of N turns and width w turns, giving a motor.', tex: R`\tau = N\,BIL\,w\,|\cos\phi|`, why: 'Opposite sides carry opposite currents, so their forces point opposite ways: a couple. The commutator reverses the current every half turn so the torque keeps the same sense.' }
    ],
    result: R`F = BIL\sin\theta \qquad (\vec F = I\vec L\times\vec B)`,
    assumptions: ['Uniform field and a straight wire. Near the magnet’s edges the field spreads and weakens.', 'By Newton’s third law the magnet feels an equal and opposite force; in a motor the casing must hold the magnets still.', 'Rigour: magnetic forces do no work on moving charges (F ⟂ v). The energy in a motor is delivered by the electric field of the supply, working against the back-emf the spinning coil generates.']
  });

  /* ================================================================ GCSE: Specific & latent heat */
  const SHC = { ci: 2100, cw: 4186, cs: 2010, Lf: 334000, Lv: 2256000 };
  WL.topic({
    id: 'gcse-shc', stage: 'gcse', strand: 'T', title: 'Specific & Latent Heat',
    summary: 'Heating ice to steam: why the temperature climbs, stalls at 0 °C and 100 °C, then climbs again.',
    maths: [['Substitution', 'E = mcΔθ with numbers'], ['Gradient', 'Slope = P/(mc)'], ['Ratios', 'L_v / L_f ≈ 6.8']],
    idea: 'Energy supplied either makes particles <em>move faster</em> (temperature rises) or <em>pulls them apart</em> (a change of state, temperature fixed). On a heating curve you can see which is happening.',
    try: 'Double the mass: every part of the graph takes twice as long, but the plateaus stay at 0 °C and 100 °C.',
    quiz: { q: 'How much energy heats 2 kg of water by 10 °C? (c = 4200 J/kg °C)', a: ['8.4 kJ', '84 kJ', '840 kJ', '42 kJ'], c: 1, ex: 'E = mcΔθ = 2 × 4200 × 10 = 84 000 J = 84 kJ.' },
    anim: {
      duration: 13.5, alt: 'A heating curve for ice turning into water and steam, beside a beaker of particles.',
      params: [{ id: 'P', label: 'Heater power', unit: 'W', min: 100, max: 1000, step: 50, value: 500 }, { id: 'm', label: 'Mass', unit: 'kg', min: 0.05, max: 0.3, step: 0.01, value: 0.1 }],
      beats: [[0, 'Heat a block of ice at −20 °C with a steady heater.'], [1, 'The temperature rises steadily: E = mcΔθ.'], [2.8, 'At 0 °C it stops rising: the energy goes into breaking bonds. Melting: E = mL_f.'], [5.2, 'Liquid water warms more slowly than ice did: its c is about twice as big.'], [7.4, 'At 100 °C a long plateau: boiling needs almost 7× the energy of melting.'], [11.4, 'Only once all the water has boiled does the steam get hotter.']],
      draw(s, t) {
        const P = s.p.P, m = s.p.m, Q = [m * SHC.ci * 20, m * SHC.Lf, m * SHC.cw * 100, m * SHC.Lv, m * SHC.cs * 20], seg = [1, 2.8, 5.2, 7.4, 11.4, 12.6];
        const cum = [0]; Q.forEach((q) => cum.push(cum[cum.length - 1] + q)); const Qt = cum[5], tTot = Qt / P / 60;
        let k = -1, f = 0; for (let i = 0; i < 5; i++) if (t >= seg[i]) { k = i; f = clamp((t - seg[i]) / (seg[i + 1] - seg[i])); }
        const Qn = k < 0 ? 0 : cum[k] + f * Q[k], temp = (q) => { if (q <= cum[1]) return -20 + 20 * (q / cum[1]); if (q <= cum[2]) return 0; if (q <= cum[3]) return (100 * (q - cum[2])) / Q[2]; if (q <= cum[4]) return 100; return 100 + (20 * (q - cum[4])) / Q[4]; };
        const T = temp(Qn), melt = clamp((Qn - cum[1]) / Q[1]), boil = clamp((Qn - cum[3]) / Q[3]);
        const A = s.axes({ x0: 450, y0: 470, w: 460, h: 360, xr: [0, tTot], yr: [-30, 130], xt: WL.ticks(0, tTot, 5), yt: [-20, 120, 20], xl: 't / min', yl: 'θ / °C', grid: true });
        A.draw(s.in(t, 0, 1));
        const pts = []; for (let i = 0; i <= 300; i++) { const q = (Qn * i) / 300; pts.push(A.pt(q / P / 60, temp(q))); } s.poly(pts, { c: C.yellow, w: 3.5 });
        s.dot(...A.pt(Qn / P / 60, T), { c: C.red, r: 7 });
        const mid = (a, b) => (cum[a] + cum[b]) / 2 / P / 60;
        s.texAt('E = mc\\,\\Delta\\theta', A.X(mid(2, 3)) + 78, A.Y(42), 5.4, { size: 26, c: C.ink });
        s.texAt('E = mL_f', A.X(mid(1, 2)) + 10, A.Y(0) - 24, 3.1, { size: 26, c: C.blue });
        s.texAt('E = mL_v', A.X(mid(3, 4)), A.Y(100) + 28, 7.7, { size: 26, c: C.red });
        const bx = 80, by = 180, bw = 260, bh = 280, r = WL.rng(4);
        s.poly([[bx, by], [bx, by + bh], [bx + bw, by + bh], [bx + bw, by]], { c: C.greyB, w: 3 });
        const liquidTop = by + bh - 120 * (1 - boil);
        if (melt > 0) s.rect(bx + 3, liquidTop, bw - 6, by + bh - liquidTop - 2, { fill: '#1C5D7A', fa: 0.45 * Math.min(1, melt * 2) * (1 - boil * 0.6), stroke: false });
        const jig = 1.5 + Math.max(0, T + 20) * 0.04;
        for (let i = 0; i < 48; i++) {
          const gx = i % 8, gy = Math.floor(i / 8), freed = r() < melt, gas = r() < boil, ph = r() * 6.28, sp = 0.7 + r();
          let x, y;
          if (gas) { x = bx + 20 + ((r() * (bw - 40) + t * 60 * sp) % (bw - 40)); y = by + 20 + Math.abs(((r() * 200 + t * 80 * sp) % 400) - 200) * 0.5; }
          else if (freed) { x = bx + 20 + ((r() * (bw - 40) + Math.sin(t * sp + ph) * 30) % (bw - 40)); y = by + bh - 14 - (r() * 100) * (1 - boil); }
          else { x = bx + 70 + gx * 17 + Math.sin(t * 9 + ph) * jig; y = by + bh - 20 - gy * 17 + Math.cos(t * 11 + ph) * jig; }
          s.circle(x, y, 6, { c: gas ? C.red : freed ? C.blue : C.blueA, w: 1.5, fill: gas ? C.red : freed ? C.blue : C.blueA, fa: 0.5 });
        }
        const glow = 0.4 + 0.3 * Math.sin(t * 10); s.rect(bx + 30, by + bh + 12, bw - 60, 10, { fill: C.orange, fa: glow, stroke: false }); s.glow(bx + bw / 2, by + bh + 16, 90, C.orange, 0.25);
        s.txt(`${f0(T)} °C`, bx + bw / 2, by - 30, { c: C.ink, size: 30, align: 'center' });
        s.txt(`energy supplied ${f1(Qn / 1000)} kJ · time ${f1(Qn / P / 60)} min`, bx + bw / 2, by + bh + 44, { c: C.dim, size: 14, align: 'center', sans: true });
        s.txt('animation speeds through the long plateau; the graph’s time axis is real', 450, 520, { c: C.dim, size: 12, sans: true });
      }
    },
    steps: [
      { say: 'Heating without a change of state: the definition of specific heat capacity c.', tex: R`E = m\,c\,\Delta\theta`, why: 'c is the energy needed to warm 1 kg by 1 °C. Water’s c (4200 J/kg °C) is unusually large, which is why the sea warms and cools so slowly.' },
      { say: 'With a heater of constant power P, E = Pt, so the temperature rises in a straight line.', tex: R`\Delta\theta = \frac{P\,t}{m\,c} \quad\Longrightarrow\quad \text{gradient} = \frac{P}{mc}`, why: 'Bigger mass or bigger c means a shallower slope. Ice (c ≈ 2100) warms about twice as fast as liquid water (c ≈ 4200).' },
      { say: 'During melting the temperature stays fixed; the energy breaks bonds. The definition of specific latent heat L:', tex: R`E = m\,L`, why: 'The particles don’t speed up, so the thermometer doesn’t move; the energy goes into potential energy as particles pull apart.' },
      { say: 'So each plateau lasts:', tex: R`t = \frac{mL}{P}`, why: 'Set Pt = mL and solve for t.' },
      { say: 'Compare the two plateaus.', tex: R`\frac{t_{\text{boil}}}{t_{\text{melt}}} = \frac{L_v}{L_f} = \frac{2.26\times10^6}{3.34\times10^5} \approx 6.8`, why: 'Boiling must separate the molecules completely, while melting only loosens them. That takes far more energy.' },
      { say: 'Total energy from −20 °C ice to 120 °C steam:', tex: R`E = m\left(c_i\,20 + L_f + c_w\,100 + L_v + c_s\,20\right)`, why: 'Add the five stages. For 0.1 kg that is about 309 kJ, three quarters of it for boiling.' }
    ],
    result: R`E = mc\Delta\theta \;\;\text{(temperature change)}, \qquad E = mL \;\;\text{(change of state)}`,
    assumptions: ['No energy is lost to the surroundings, the sample is evenly mixed, and c is constant over each range.', 'Everything at 1 atmosphere. At lower pressure water boils below 100 °C (about 70 °C on top of Everest).', 'Contradiction with the ideal curve: very pure water can be supercooled several degrees below 0 °C without freezing, and superheated above 100 °C, because freezing and boiling need nucleation sites to start.']
  });

  /* ================================================================ GCSE: Radioactive decay */
  WL.topic({
    id: 'gcse-radioactivity', stage: 'gcse', strand: 'Q', title: 'Radioactive Decay & Half-life',
    summary: 'Random decay, half-life and the exponential curve that comes out of pure chance.',
    maths: [['Halving & powers of 2', '(½)ⁿ'], ['Exponentials', 'e^{−λt}'], ['Reading graphs', 'Half-life from a curve']],
    idea: 'No single nucleus has a schedule. But give every nucleus the <em>same chance per second</em> of decaying and the crowd as a whole halves on a perfectly regular clock.',
    try: 'Set the sample to 100 nuclei and let it restart a few times: the data scatter around the curve much more.',
    quiz: { q: 'A sample has a half-life of 2 days. What fraction is left after 6 days?', a: ['1/3', '1/6', '1/8', '1/4'], c: 2, ex: '6 days is 3 half-lives: (½)³ = 1/8.' },
    anim: {
      duration: 14, stateful: true, alt: 'A grid of nuclei decaying at random beside a graph of the number remaining with the exponential curve.',
      params: [{ id: 'th', label: 'Half-life', unit: 's', min: 1, max: 5, step: 0.5, value: 2.5 }, { id: 'N', label: 'Nuclei', unit: '', min: 100, max: 900, step: 100, value: 400 }],
      beats: [[0, 'Every one of these nuclei is unstable. Any of them could decay at any moment, at random.'], [3, 'You can’t predict which one goes next, but the number left halves every half-life.'], [7, 'The curve is exponential: N = N₀(½)^{t/T½} = N₀e^{−λt}.'], [11, 'Small samples wobble more: random scatter is about √N. Try 100 nuclei.']],
      setup(s) { const N = s.p.N; s.state = { N, dec: new Float32Array(N).fill(-1), left: N, time: 0, data: [[0, N]], fx: [], hold: 0, r: WL.rng(17 + N) }; },
      step(s, dt) {
        const S = s.state; if (s.t < 0.6) return;
        if (S.left < S.N * 0.02 || S.time > 6 * s.p.th) { S.hold += dt; if (S.hold > 1.8) { const N = s.p.N; s.state = { N, dec: new Float32Array(N).fill(-1), left: N, time: 0, data: [[0, N]], fx: [], hold: 0, r: WL.rng(Math.floor(s.t * 1000)) }; } return; }
        const lam = Math.LN2 / s.p.th, p = 1 - Math.exp(-lam * dt), cols = Math.ceil(Math.sqrt(S.N));
        S.time += dt;
        for (let i = 0; i < S.N; i++) if (S.dec[i] < 0 && S.r() < p) { S.dec[i] = S.time; S.left--; if (S.fx.length < 60) S.fx.push({ i, a: S.r() * 6.28, age: 0, cols }); }
        S.fx.forEach((f) => (f.age += dt)); S.fx = S.fx.filter((f) => f.age < 0.7);
        if (S.time - S.data[S.data.length - 1][0] > 0.08) S.data.push([S.time, S.left]);
      },
      draw(s, t) {
        const S = s.state, cols = Math.ceil(Math.sqrt(S.N)), cell = Math.min(36, 360 / cols), gx = 60 + (360 - cols * cell) / 2, gy = 100;
        for (let i = 0; i < S.N; i++) { const x = gx + (i % cols) * cell + cell / 2, y = gy + Math.floor(i / cols) * cell + cell / 2, d = S.dec[i] >= 0; s.circle(x, y, cell * 0.36, { stroke: false, fill: d ? '#2a3140' : C.green, fa: d ? 1 : 0.85 }); }
        S.fx.forEach((f) => { const x = gx + (f.i % cols) * cell + cell / 2, y = gy + Math.floor(f.i / cols) * cell + cell / 2, d = f.age * 160; s.flash(x, y, f.age / 0.7, { c: C.yellow, r: 4, R: 10, n: 6, w: 2 }); s.dot(x + Math.cos(f.a) * d, y + Math.sin(f.a) * d, { c: C.red, r: 3.5, a: 1 - f.age / 0.7 }); });
        s.txt(`${S.left} of ${S.N} undecayed`, 240, 482, { c: C.ink, size: 18, align: 'center' });
        const th = s.p.th, tmax = 6 * th, A = s.axes({ x0: 500, y0: 460, w: 410, h: 340, xr: [0, tmax], yr: [0, S.N * 1.05], xt: [0, tmax, th], yt: WL.ticks(0, S.N, 4), xl: 't / s', yl: 'N', xfmt: (v) => (v / th).toFixed(0) + 'T½' });
        A.draw(s.in(t, 0, 1));
        s.alpha(s.in(t, 3, 1), () => { [1, 2, 3].forEach((k) => { const x = k * th, y = S.N / 2 ** k; s.line(A.X(x), A.Y(0), A.X(x), A.Y(y), { c: C.dim, w: 1.2, dash: [3, 5] }); s.line(A.X(0), A.Y(y), A.X(x), A.Y(y), { c: C.dim, w: 1.2, dash: [3, 5] }); s.txt(`N₀/${2 ** k}`, A.X(x) + 6, A.Y(y) - 12, { c: C.dim, size: 13, sans: true }); }); });
        s.alpha(s.in(t, 7, 1), () => A.fn((x) => S.N * Math.pow(0.5, x / th), 0, tmax, { c: C.yellow, w: 2.5 }));
        s.poly(S.data.map(([x, y]) => A.pt(Math.min(x, tmax), y)), { c: C.green, w: 2.2 });
        s.texAt('N = N_0\\left(\\tfrac12\\right)^{t/T_{1/2}}', 760, 70, 7.3, { size: 32, c: C.yellow });
      }
    },
    steps: [
      { say: 'Each nucleus has the same, fixed probability λ per second of decaying, independent of the others.', tex: R`P(\text{decay in } \Delta t) = \lambda\,\Delta t`, why: 'This is the whole model. Nothing about a nucleus’s history changes its chance: it doesn’t “age”.' },
      { say: 'With N nuclei, the expected number decaying in Δt is:', tex: R`\Delta N = -\lambda N\,\Delta t`, why: 'Multiply the chance per nucleus by the number of nuclei. The minus sign: N goes down.' },
      { say: 'Shrink Δt to get a differential equation (A-Level preview), and solve it.', tex: R`\frac{dN}{dt} = -\lambda N \;\Longrightarrow\; N = N_0\,e^{-\lambda t}`, why: 'The rate of loss is proportional to the amount left: the defining property of exponential decay.' },
      { say: 'The half-life T½ is the time for N to halve.', tex: R`\tfrac12 N_0 = N_0 e^{-\lambda T_{1/2}} \;\Longrightarrow\; T_{1/2} = \frac{\ln 2}{\lambda}`, why: 'Take natural logs of both sides: ln(½) = −λT½.' },
      { say: 'So the decay law can be written in half-lives:', tex: R`N = N_0\left(\tfrac12\right)^{t/T_{1/2}}`, why: 'e^{−λt} = e^{−ln2 · t/T½} = (½)^{t/T½}. After n half-lives, (½)ⁿ is left.' },
      { say: 'Activity, the decays per second, falls the same way.', tex: R`A = \lambda N = A_0\left(\tfrac12\right)^{t/T_{1/2}}`, why: 'Activity is measured in becquerels (decays per second). It is what a Geiger counter responds to.' }
    ],
    result: R`N = N_0 e^{-\lambda t} = N_0\left(\tfrac12\right)^{t/T_{1/2}}, \qquad T_{1/2} = \frac{\ln 2}{\lambda}`,
    assumptions: ['Decays are independent and random; the curve describes the average, and real counts scatter by about √N.', 'λ is not quite universal: electron-capture rates (beryllium-7) shift by up to about 1% with chemical surroundings, and fully ionised rhenium-187 decays about a billion times faster than neutral rhenium (measured 1996).', 'Contradiction with pure exponentials: quantum theory predicts deviations at very short and very long times, and both have been observed in experiments (1997 and 2006).']
  });

  /* ================================================================ GCSE: Red-shift */
  const LINES = [410, 434, 486, 656];
  WL.topic({
    id: 'gcse-orbits', stage: 'gcse', strand: 'S', title: 'Red-shift & the Big Bang',
    summary: 'Stretched light from distant galaxies, Hubble’s law and the age of the universe.',
    maths: [['Ratios', 'z = Δλ/λ'], ['Straight-line graphs', 'Gradient of v against d is H₀'], ['Unit conversion', 'Mpc, km/s, years']],
    idea: 'Distant galaxies aren’t flying through space away from us; <em>space itself is stretching</em>, and it stretches the light crossing it. The farther the light has come, the redder it arrives.',
    try: 'Raise the expansion rate: every line shifts further and the Hubble line gets steeper (a younger universe).',
    quiz: { q: 'A hydrogen line normally at 656 nm is seen at 663 nm. Roughly how fast is the galaxy receding?', a: ['320 km/s', '3200 km/s', '32 000 km/s', '0.01 km/s'], c: 1, ex: 'z = Δλ/λ = 7/656 ≈ 0.0107, so v ≈ zc ≈ 0.0107 × 300 000 km/s ≈ 3200 km/s.' },
    anim: {
      duration: 13, alt: 'Galaxies moving apart as space stretches, a light wave being stretched redder, shifted spectra and Hubble’s law graph.',
      params: [{ id: 'H', label: 'Expansion rate', unit: '×', min: 0.5, max: 2, step: 0.05, value: 1 }],
      beats: [[0, 'Galaxies sit in space, and space itself is stretching.'], [3, 'Light crossing stretching space gets stretched too: its wavelength grows. Red-shift.'], [6, 'Absorption lines in a galaxy’s spectrum shift towards red; farther galaxies shift more.'], [9, 'Speed ∝ distance: Hubble’s law, v = H₀d. Run it backwards and everything started together: the Big Bang.']],
      draw(s, t) {
        const H = s.p.H, tau = WL.cyc(t, 11, 1.5), a = Math.exp(0.06 * H * tau), sx = (chi) => 70 + chi * 62 * a, gy = 90;
        for (let chi = 0; chi <= 6; chi++) { const x = sx(chi); if (x > 950) continue; s.glow(x, gy, 22, chi === 0 ? C.yellow : C.purpleA, 0.5); s.dot(x, gy, { c: chi === 0 ? C.yellow : C.ink, r: 5 }); }
        s.txt('us', 70, gy + 30, { c: C.yellow, size: 14, align: 'center', sans: true });
        s.alpha(s.in(t, 3, 1), () => {
          const chiE = 5, frac = clamp(tau / 10), chiNow = chiE * (1 - frac), x0 = sx(chiNow), lam = 26 * Math.exp(0.06 * H * tau) / Math.exp(0);
          const stretch = Math.exp(0.06 * H * tau * 1.0), nm = clamp(470 * stretch, 380, 760), col = WL.nmColour(nm), pts = [];
          for (let k = 0; k <= 60; k++) { const u = k / 60; pts.push([x0 + u * 70, gy + 38 + 10 * Math.sin((u * 70 * 2 * Math.PI) / (18 * stretch))]); }
          s.poly(pts, { c: col, w: 2.6 }); s.arrow(x0, gy + 60, x0 - 30, gy + 60, { c: col, w: 2, head: 8 });
          s.txt(`λ grows ×${f2(stretch)} on the way`, x0 + 76, gy + 40, { c: col, size: 14, sans: true });
        });
        const strip = (y, z, lab) => {
          const x0 = 160, w = 600; for (let k = 0; k < 60; k++) s.rect(x0 + (k * w) / 60, y - 12, w / 60 + 0.7, 24, { fill: WL.nmColour(380 + (k * 370) / 59), fa: 0.85, stroke: false });
          LINES.forEach((l) => { const L2 = l * (1 + z); if (L2 < 750) { const x = x0 + ((L2 - 380) / 370) * w; s.line(x, y - 12, x, y + 12, { c: '#000', w: 3 }); } });
          s.txt(lab, x0 - 12, y, { c: C.ink, size: 14, align: 'right', sans: true });
        };
        s.alpha(s.in(t, 6, 1), () => { strip(210, 0, 'lab'); [[1, 'near'], [3, 'farther'], [5, 'farthest']].forEach(([chi, lab], i) => strip(250 + i * 36, 0.035 * H * chi, lab)); s.txt('380 nm', 160, 368, { c: C.dim, size: 12, sans: true }); s.txt('750 nm', 760, 368, { c: C.dim, size: 12, sans: true, align: 'right' }); });
        const A = s.axes({ x0: 120, y0: 510, w: 320, h: 120, xr: [0, 400], yr: [0, 60000], xt: [0, 400, 100], yt: [0, 60000, 20000], xl: 'd / Mpc', yl: 'v', yfmt: (v) => v / 1000 + 'k' });
        s.alpha(s.in(t, 9, 1), () => { A.draw(1); const H0 = 70 * H, r = WL.rng(9); A.fn((d) => H0 * d, 0, 400, { c: C.yellow, w: 2.5 }); for (let i = 0; i < 14; i++) { const d = 20 + r() * 360; s.dot(...A.pt(d, H0 * d + (r() - 0.5) * 6000), { c: C.purpleA, r: 4 }); } s.txt(`H₀ = ${f0(H0)} km/s/Mpc  ⇒  1/H₀ ≈ ${f1(978 / H0)} billion years`, 470, 470, { c: C.ink, size: 17 }); });
        s.texAt('v = H_0\\,d', 640, 420, 9.3, { size: 34, c: C.yellow });
        s.texAt('z = \\dfrac{\\Delta\\lambda}{\\lambda} \\approx \\dfrac{v}{c}', 860, 290, 6.3, { size: 26, c: C.ink });
      }
    },
    steps: [
      { say: 'A source moving away stretches the waves it sends: the Doppler effect.', tex: R`z = \frac{\Delta\lambda}{\lambda} \approx \frac{v}{c} \quad (v \ll c)`, why: 'Each new crest is emitted from a little farther away, so crests arrive more spread out. Longer wavelength means redder light.' },
      { say: 'Measure z using absorption lines whose lab wavelengths we know, such as hydrogen’s 656.3 nm.', tex: R`z = \frac{\lambda_{\text{obs}} - \lambda_{\text{lab}}}{\lambda_{\text{lab}}}`, why: 'Atoms of each element absorb at fixed wavelengths: a barcode. The whole barcode slides, so we can tell it has shifted.' },
      { say: 'Hubble (1929): recession speed is proportional to distance.', tex: R`v = H_0\,d`, why: 'Distances came from standard candles (Cepheid stars); speeds from red-shifts. Plotted together they fall on a line.' },
      { say: 'If v ∝ d for every galaxy, then they all took the same time to get where they are.', tex: R`t = \frac{d}{v} = \frac{1}{H_0}`, why: 'd cancels: a galaxy twice as far away moves twice as fast, so all of them were together at the same moment.' },
      { say: 'With H₀ ≈ 70 km/s/Mpc:', tex: R`\frac{1}{H_0} = \frac{3.09\times10^{19}\ \text{km}}{70\ \text{km/s}} \approx 4.4\times10^{17}\ \text{s} \approx 14\ \text{billion years}`, why: '1 Mpc = 3.09 × 10¹⁹ km. This sets the age scale of the universe; the detailed value, 13.8 billion years, comes from the cosmic microwave background.' },
      { say: 'Strictly, cosmological red-shift is the stretching of space, not a Doppler shift.', tex: R`1 + z = \frac{a_{\text{now}}}{a_{\text{then}}}`, why: 'The wavelength grows with the scale factor a of the universe. For small z the two descriptions agree; at large z only this one is right.' }
    ],
    result: R`v = H_0\,d, \qquad z \approx \frac{v}{c}, \qquad t_{\text{universe}} \sim \frac{1}{H_0}`,
    assumptions: ['z ≈ v/c only for z ≪ 1; galaxies also have their own “peculiar” motions of a few hundred km/s on top of the expansion.', 'Contradiction in current data: the Hubble tension. Measuring H₀ from nearby supernovae gives about 73 km/s/Mpc; inferring it from the cosmic microwave background gives about 67.4, and the gap is now over 5 standard deviations.', 'Further evidence for the Big Bang beyond red-shift: the cosmic microwave background (1965) and the abundance of light elements.']
  });
})();
