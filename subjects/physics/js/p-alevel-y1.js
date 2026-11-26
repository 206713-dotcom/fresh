/* Twistor — new A-Level and University Year 1 physics topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw, lerp = WL.lerp, clamp = WL.clamp;
  const f0 = (x) => x.toFixed(0), f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2), f3 = (x) => x.toFixed(3);

  /* ================================================================ A-Level: Young's slits */
  WL.topic({
    id: 'al-interference', stage: 'alevel', strand: 'W', title: 'Superposition & Young’s Slits',
    summary: 'Two coherent sources make bright and dark fringes; their spacing measures the wavelength of light.',
    maths: [['Small angles', 'sin θ ≈ tan θ ≈ θ'], ['Path difference', 'Δ = d sin θ'], ['Standard form', 'λ ≈ 6 × 10⁻⁷ m']],
    idea: 'Where waves from the two slits arrive <em>crest on crest</em> they add; where they arrive <em>crest on trough</em> they cancel. Which happens depends only on the difference in path length.',
    try: 'Widen the slit spacing d: the fringes on the screen squeeze together, exactly as w = λD/d says.',
    quiz: { q: 'Light of wavelength 600 nm passes through slits 0.3 mm apart onto a screen 1.5 m away. What is the fringe spacing?', a: ['0.3 mm', '3 mm', '30 mm', '0.03 mm'], c: 1, ex: 'w = λD/d = (6 × 10⁻⁷ × 1.5)/(3 × 10⁻⁴) = 3 × 10⁻³ m = 3 mm.' },
    anim: {
      duration: 15, alt: 'Waves from two slits overlapping into an interference pattern, with the intensity on a screen.',
      params: [{ id: 'lam', label: 'Wavelength λ', unit: 'px', min: 20, max: 60, step: 1, value: 36 }, { id: 'd', label: 'Slit spacing d', unit: 'px', min: 50, max: 200, step: 2, value: 110 }],
      beats: [[0, 'Two slits lit by the same source send out waves in step: coherent sources.'], [3, 'Crest meets crest: they add (bright). Crest meets trough: they cancel (dark).'], [6, 'At a point P on the screen the two paths differ by Δ = r₂ − r₁.'], [9, 'Bright fringes where d sin θ = nλ. For small angles they are evenly spaced: w = λD/d.'], [12, 'Widen d and the fringes squeeze together.']],
      draw(s, t) {
        const lam = s.p.lam, d = s.p.d, sx = 90, cy = 270, s1 = [sx, cy - d / 2], s2 = [sx, cy + d / 2], SX = 720, D = SX - sx, k = (2 * Math.PI) / lam, w = 4;
        const nx = 150, ny = 120, im = s.pix('yy', nx, ny), px = (SX - sx) / nx, py = 480 / ny, dd = im.d;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const x = sx + (i + 0.5) * px, y = 30 + (j + 0.5) * py, r1 = Math.hypot(x - s1[0], y - s1[1]), r2 = Math.hypot(x - s2[0], y - s2[1]);
          const v = (Math.cos(k * r1 - w * t) / Math.sqrt(r1 + 20) + Math.cos(k * r2 - w * t) / Math.sqrt(r2 + 20)) * 3.2, c = WL.rgb(WL.dmap(v * s.in(t, 0, 1.5), '#2f86b0', '#F4D345')), o = 4 * (j * nx + i);
          dd[o] = c[0]; dd[o + 1] = c[1]; dd[o + 2] = c[2]; dd[o + 3] = 255;
        }
        s.blit(im, sx, 30, SX - sx, 480);
        s.rect(sx - 12, 30, 12, 480, { fill: '#3a4256', fa: 1, stroke: false }); [s1, s2].forEach((q) => { s.rect(sx - 12, q[1] - 6, 12, 12, { fill: C.bg, fa: 1, stroke: false }); s.dot(q[0], q[1], { c: C.ink, r: 4 }); });
        s.line(SX, 30, SX, 510, { c: C.greyB, w: 3 });
        const I = (y) => { const r1 = Math.hypot(SX - s1[0], y - s1[1]), r2 = Math.hypot(SX - s2[0], y - s2[1]); return Math.cos((Math.PI * (r2 - r1)) / lam) ** 2; };
        const ip = []; for (let y = 30; y <= 510; y += 2) ip.push([SX + 12 + 190 * I(y), y]);
        s.poly(ip, { c: C.yellow, w: 2.5, fill: C.yellow, fa: 0.18, p: s.in(t, 3, 1.5) });
        s.txt('intensity', 830, 20, { c: C.dim, size: 13, sans: true, align: 'center' });
        s.alpha(s.in(t, 6, 1), () => {
          const Py = cy + 190 * Math.sin(0.25 * (t - 6)), P = [SX, Py], r1 = Math.hypot(P[0] - s1[0], P[1] - s1[1]), r2 = Math.hypot(P[0] - s2[0], P[1] - s2[1]), dl = r2 - r1;
          s.line(s1[0], s1[1], P[0], P[1], { c: C.ink, w: 1.6 }); s.line(s2[0], s2[1], P[0], P[1], { c: C.ink, w: 1.6 });
          const ux = (P[0] - s2[0]) / r2, uy = (P[1] - s2[1]) / r2, m = Math.max(0, dl); s.line(s2[0], s2[1], s2[0] + ux * m, s2[1] + uy * m, { c: C.red, w: 5 });
          s.dot(P[0], P[1], { c: C.red, r: 6 }); s.txt('P', P[0] - 16, P[1] - 14, { c: C.red, size: 18 });
          const nl = dl / lam, near = Math.abs(nl - Math.round(nl)); s.txt(`Δ = ${f2(nl)} λ ${near < 0.12 ? '→ bright' : Math.abs(near - 0.5) < 0.12 ? '→ dark' : ''}`, 120, 520, { c: near < 0.12 ? C.yellow : C.ink, size: 18 });
        });
        s.alpha(s.in(t, 9, 1), () => { for (let n = -3; n <= 3; n++) { const sn = (n * lam) / d; if (Math.abs(sn) >= 1) continue; const y = cy + D * Math.tan(Math.asin(sn)); if (y < 36 || y > 506) continue; s.line(SX - 10, y, SX + 4, y, { c: C.ink, w: 2.5 }); s.txt(`n=${n}`, SX - 14, y, { c: C.dim, size: 12, sans: true, align: 'right' }); } s.txt(`w ≈ λD/d = ${f0((lam * D) / d)} px`, 520, 520, { c: C.ink, size: 18 }); });
        s.texAt('d\\sin\\theta = n\\lambda', 400, 52, 9.3, { size: 34, c: C.yellow });
      }
    },
    steps: [
      { say: 'Superposition: where two waves overlap, their displacements add.', tex: R`y = y_1 + y_2`, why: 'For small amplitudes the medium responds linearly, so each wave carries on as if the other weren’t there and the effects simply add.' },
      { say: 'Two coherent sources in phase. At a point P the waves have travelled r₁ and r₂.', tex: R`\Delta = r_2 - r_1`, why: 'Coherent means a fixed phase relation, here the same phase, because both slits are lit by one source. Then only the path difference decides the outcome.' },
      { say: 'Constructive and destructive conditions.', tex: R`\Delta = n\lambda \;\;(\text{bright}), \qquad \Delta = \left(n + \tfrac12\right)\lambda \;\;(\text{dark})`, why: 'A whole number of wavelengths brings crest back onto crest; an extra half wavelength puts crest onto trough.' },
      { say: 'For a distant screen (D ≫ d) the two rays are nearly parallel, so the path difference is d sin θ.', tex: R`\Delta \approx d\sin\theta`, why: 'Drop a perpendicular from one slit onto the other ray: the leftover piece of the longer ray is the opposite side of a small right-angled triangle with hypotenuse d and angle θ.' },
      { say: 'Bright fringes satisfy the grating equation.', tex: R`d\sin\theta = n\lambda`, why: 'Combine the last two steps. The same equation governs a diffraction grating with many slits; extra slits just sharpen the bright lines.' },
      { say: 'Small angles: sin θ ≈ tan θ = y/D, so the fringes are evenly spaced.', tex: R`y_n = \frac{n\lambda D}{d} \;\Longrightarrow\; w = \frac{\lambda D}{d}`, why: 'Neighbouring fringes differ by one in n. Measure w, D and d and you have measured the wavelength of light: Young did this in 1801.' }
    ],
    result: R`d\sin\theta = n\lambda, \qquad w = \frac{\lambda D}{d}`,
    assumptions: ['Far-field (Fraunhofer) geometry and narrow slits. Real slits have width, which adds a single-slit envelope that dims the outer fringes.', 'The sources must be coherent; two separate light bulbs flicker in phase too fast for fringes to be seen.', 'The pattern builds up even when photons (Taylor, 1909) or electrons (Tonomura, 1989) arrive one at a time, which is the puzzle of wave–particle duality.']
  });

  /* ================================================================ A-Level: Electric fields & potential */
  const efCache = {};
  function efData(q1, q2, sep) {
    const key = [q1, q2.toFixed(2), sep].join('|'); if (efCache[key]) return efCache[key];
    const A = [480 - sep / 2, 270, q1], B = [480 + sep / 2, 270, q2], Q = [A, B];
    const V = (x, y) => Q.reduce((s2, [qx, qy, q]) => s2 + q / Math.max(8, Math.hypot(x - qx, y - qy)), 0);
    const nx = 97, ny = 55, g = new Float64Array(nx * ny); for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) g[j * nx + i] = V(i * 10, j * 10);
    const levels = [0.004, 0.007, 0.012, 0.02, 0.035, 0.06], cont = [];
    levels.forEach((l) => [l, -l].forEach((lv) => cont.push([lv, WL.contour(g, nx, ny, lv)])));
    const E = (x, y) => { let ex = 0, ey = 0; Q.forEach(([qx, qy, q]) => { const dx = x - qx, dy = y - qy, r = Math.max(6, Math.hypot(dx, dy)); ex += (q * dx) / (r * r * r); ey += (q * dy) / (r * r * r); }); return [ex, ey]; };
    const lines = []; const src = Q.filter((q) => Math.abs(q[2]) > 0.05), sign = src.some((q) => q[2] > 0) ? 1 : -1;
    src.filter((q) => Math.sign(q[2]) === sign).forEach(([qx, qy, q]) => { const n = Math.round(6 * Math.abs(q)); for (let i = 0; i < n; i++) { const a = (2 * Math.PI * i) / n + 0.2; let x = qx + 14 * Math.cos(a), y = qy + 14 * Math.sin(a); const pts = [[x, y]]; for (let k = 0; k < 420; k++) { const e = E(x, y), m = Math.hypot(e[0], e[1]) || 1; x += (sign * 4 * e[0]) / m; y += (sign * 4 * e[1]) / m; pts.push([x, y]); if (x < -10 || x > 970 || y < -10 || y > 550 || Q.some(([px, py, pq]) => Math.abs(pq) > 0.05 && Math.sign(pq) !== sign && Math.hypot(x - px, y - py) < 10)) break; } lines.push(pts); } });
    const keys = Object.keys(efCache); if (keys.length > 120) keys.forEach((k2) => delete efCache[k2]);
    return (efCache[key] = { V, E, cont, lines, A, B });
  }
  WL.topic({
    id: 'al-efields', stage: 'alevel', strand: 'E', title: 'Electric Fields & Potential',
    summary: 'Coulomb’s law, field strength and potential, and why field lines always cross equipotentials at right angles.',
    maths: [['Inverse-square law', 'E ∝ 1/r²'], ['Integration', 'V = −∫E dr'], ['Vectors', 'Adding fields from several charges']],
    idea: 'Potential is like height on a hill made by the charges. The field points <em>straight downhill</em>, so it always cuts the contour lines (equipotentials) at right angles, and it is strongest where they bunch together.',
    try: 'Make the two charges equal and opposite (a dipole), then both positive: compare the shapes of the equipotentials.',
    quiz: { q: 'What is the potential 0.1 m from a +2 nC point charge? (k = 9 × 10⁹ N m² C⁻²)', a: ['18 V', '180 V', '1800 V', '1.8 V'], c: 1, ex: 'V = kQ/r = 9 × 10⁹ × 2 × 10⁻⁹ / 0.1 = 180 V.' },
    anim: {
      duration: 13, alt: 'Field arrows, field lines and dashed equipotential contours around two point charges.',
      params: [{ id: 'q1', label: 'Charge q₁', unit: '', min: -3, max: 3, step: 0.5, value: 2 }, { id: 'q2', label: 'Charge q₂', unit: '', min: -3, max: 3, step: 0.5, value: -1 }, { id: 'sep', label: 'Separation', unit: 'px', min: 120, max: 420, step: 10, value: 300 }],
      beats: [[0, 'A point charge’s field points straight out from it: E = kQ/r².'], [3, 'Add a second charge: the fields add as vectors (superposition).'], [6, 'Dashed lines are equipotentials. Moving a charge along one takes no work.'], [9, 'Field lines always cross equipotentials at right angles: E = −dV/dr points downhill in potential.']],
      draw(s, t) {
        const q2e = s.p.q2 * s.in(t, 3, 1.2), D = efData(s.p.q1, Math.round(q2e * 20) / 20, s.p.sep);
        s.alpha(s.in(t, 6, 1.2), () => D.cont.forEach(([lv, segs]) => { const col = lv > 0 ? C.orange : C.blue; segs.forEach(([x1, y1, x2, y2]) => s.line(x1 * 10, y1 * 10, x2 * 10, y2 * 10, { c: col, w: 1.6, a: 0.75, cap: 'butt' })); }));
        s.field((x, y) => { const e = D.E(x, y); return Math.hypot(x - D.A[0], y - D.A[1]) < 30 || Math.hypot(x - D.B[0], y - D.B[1]) < 30 ? null : e; }, { step: 48, log: true, a: 0.75 * s.in(t, 0, 1) * (1 - 0.5 * s.in(t, 6, 1)) });
        s.alpha(s.in(t, 1.5, 1.2), () => D.lines.forEach((pts, i) => { s.poly(pts, { c: C.ink, w: 1.3, a: 0.35 }); s.poly(pts, { c: C.ink, w: 2, a: 0.7, dash: [4, 40], dashOff: -t * 40 - i * 5 }); }));
        [[D.A[0], s.p.q1, 1], [D.B[0], q2e, s.in(t, 3, 1)]].forEach(([x, q, a]) => s.alpha(a, () => { const col = q >= 0 ? C.red : C.blue; s.glow(x, 270, 34, col, 0.5); s.circle(x, 270, 15, { c: col, fill: col, fa: 0.8, w: 2 }); s.txt(q > 0 ? '+' : q < 0 ? '−' : '0', x, 271, { c: C.ink, size: 20, align: 'center' }); }));
        s.alpha(s.in(t, 9, 1), () => {
          const tp = [480 + 260 * Math.cos(t * 0.35), 120 + 60 * Math.sin(t * 0.5)], e = D.E(tp[0], tp[1]), m = Math.hypot(e[0], e[1]) || 1;
          s.dot(tp[0], tp[1], { c: C.green, r: 7 }); s.arrow(tp[0], tp[1], tp[0] + (e[0] / m) * 60, tp[1] + (e[1] / m) * 60, { c: C.green, w: 3 });
          s.line(tp[0] - (e[1] / m) * 40, tp[1] + (e[0] / m) * 40, tp[0] + (e[1] / m) * 40, tp[1] - (e[0] / m) * 40, { c: C.yellow, w: 2, dash: [4, 4] });
          s.right(tp[0], tp[1], Math.atan2(-e[1], e[0]), 10, { c: C.ink });
          s.txt(`V = ${f2(D.V(tp[0], tp[1]) * 100)} (arb.)`, tp[0] + 16, tp[1] + 26, { c: C.ink, size: 14, sans: true });
        });
        s.texAt('E = \\dfrac{kQ}{r^2}', 120, 64, 0.5, { size: 30, c: C.ink });
        s.texAt('V = \\dfrac{kQ}{r}', 120, 140, 6.2, { size: 30, c: C.orange });
        s.texAt('E = -\\dfrac{dV}{dr}', 840, 64, 9.3, { size: 30, c: C.green });
      }
    },
    steps: [
      { say: 'Coulomb’s law for two point charges.', tex: R`F = \frac{kQq}{r^2}, \qquad k = \frac{1}{4\pi\varepsilon_0} \approx 9\times10^{9}\ \text{N m}^2\text{C}^{-2}`, why: 'Found experimentally by Coulomb with a torsion balance (1785). The 1/r² follows from the field spreading over spheres of area 4πr².' },
      { say: 'Field strength is force per unit positive test charge.', tex: R`E = \frac{F}{q} = \frac{kQ}{r^2}`, why: 'Dividing by q removes the test charge, so E describes the space around Q itself.' },
      { say: 'Work to bring a test charge q from infinity to distance r, against the field:', tex: R`W = -\int_\infty^{r} \frac{kQq}{r'^2}\,dr' = \frac{kQq}{r}`, why: 'The external force must balance the repulsion, so it is −F, and work is force × distance summed along the way: an integral.' },
      { say: 'Potential is that work per unit charge.', tex: R`V = \frac{W}{q} = \frac{kQ}{r}`, why: 'Potential is defined as zero at infinity. Near a positive charge V is large and positive: you are “uphill”.' },
      { say: 'Field and potential are linked by a derivative.', tex: R`E = -\frac{dV}{dr} = -\frac{d}{dr}\left(\frac{kQ}{r}\right) = \frac{kQ}{r^2}\ \checkmark`, why: 'The field is the steepness of the potential hill and points downhill (hence the minus sign). In 3D, E = −∇V, which is always perpendicular to the equipotential surfaces.' },
      { say: 'With several charges, potentials add as numbers and fields add as vectors.', tex: R`V = \sum_i \frac{kQ_i}{r_i}, \qquad \vec E = \sum_i \vec E_i`, why: 'Superposition. Adding scalars is easier, which is why we often find V first and then take its gradient.' }
    ],
    result: R`E = \frac{kQ}{r^2}, \qquad V = \frac{kQ}{r}, \qquad \vec E = -\nabla V`,
    assumptions: ['Static charges in vacuum. Moving charges also produce magnetic fields, and changing fields travel at the speed of light rather than instantly.', 'Point charges. At r → 0 both E and V diverge: the classical self-energy of a point electron is infinite, a puzzle only partly resolved by quantum electrodynamics.', 'The equipotentials are drawn in 2D through the charges; in 3D they are surfaces of revolution.']
  });

  /* ================================================================ A-Level: Faraday's law */
  WL.topic({
    id: 'al-induction', stage: 'alevel', strand: 'E', title: 'Faraday’s Law',
    summary: 'Changing magnetic flux induces an emf; Lenz’s law fixes its direction; a spinning coil makes alternating current.',
    maths: [['Differentiation', 'dΦ/dt and d/dt cos ωt'], ['Trigonometric functions', 'sin and cos of ωt'], ['Units', '1 Wb = 1 T m², 1 V = 1 Wb/s']],
    idea: 'Only <em>change</em> matters. A magnet sitting in a coil does nothing; moving it in or out changes the flux, and the faster the change, the bigger the emf.',
    try: 'Double the speed: the emf peaks double and the pulses come twice as often.',
    quiz: { q: 'The flux through a 100-turn coil falls from 0.02 Wb to zero in 0.5 s. What is the average induced emf?', a: ['0.04 V', '4 V', '40 V', '0.4 V'], c: 1, ex: 'ε = N ΔΦ/Δt = 100 × 0.02 / 0.5 = 4 V.' },
    anim: {
      duration: 14, alt: 'A bar magnet moving in and out of a coil with flux and emf graphs, and a rotating coil in a uniform field.',
      params: [{ id: 'w', label: 'Speed ω', unit: 'rad/s', min: 0.5, max: 2.5, step: 0.1, value: 1.2 }, { id: 'N', label: 'Turns N', unit: '', min: 1, max: 10, step: 1, value: 5 }],
      beats: [[0, 'Push a magnet into a coil: the magnetic flux through the coil grows.'], [3, 'A changing flux induces an emf: ε = −N dΦ/dt. Faster motion, bigger emf.'], [6, 'Lenz’s law: the induced current makes a field (green) that opposes the change.'], [9, 'A coil spinning in a steady field: Φ = BA cos ωt, so ε = BANω sin ωt. A generator.']],
      draw(s, t) {
        const w = s.p.w, N = s.p.N, cx = 280, cy = 250, a = 60, z = (tt) => 170 * Math.sin(w * tt), xm = cx + z(t), Phi = (zz) => Math.pow(1 + (zz * zz) / (a * a), -1.5);
        const vz = 170 * w * Math.cos(w * t), dPhi = -3 * (z(t) / (a * a)) * Math.pow(1 + z(t) ** 2 / (a * a), -2.5) * vz, eps = -N * dPhi;
        for (let k = 0; k < 6; k++) { const x = cx - 30 + k * 12; s.poly(Array.from({ length: 41 }, (_, i) => { const u = (Math.PI * i) / 40 + Math.PI / 2; return [x + 14 * Math.cos(u), cy + a * Math.sin(u)]; }), { c: C.gold, w: 3, a: 0.5 }); }
        const lineDip = (r0, side) => { const pts = []; for (let i = 0; i <= 60; i++) { const th = 0.15 + ((Math.PI - 0.3) * i) / 60, r = r0 * Math.sin(th) ** 2; pts.push([xm + r * Math.cos(th), cy - side * r * Math.sin(th)]); } return pts; };
        s.alpha(s.in(t, 0, 1), () => [55, 90, 140, 210].forEach((r0) => [1, -1].forEach((sd) => s.poly(lineDip(r0, sd), { c: C.blue, w: 1.5, a: 0.45 }))));
        s.rect(xm - 45, cy - 14, 45, 28, { c: C.red, fill: C.red, fa: 0.75, w: 2 }); s.rect(xm, cy - 14, 45, 28, { c: C.blue, fill: C.blue, fa: 0.75, w: 2 });
        s.txt('N', xm - 23, cy + 1, { c: C.ink, size: 16, align: 'center', bold: true }); s.txt('S', xm + 22, cy + 1, { c: C.ink, size: 16, align: 'center', bold: true });
        for (let k = 0; k < 6; k++) { const x = cx - 30 + k * 12; s.poly(Array.from({ length: 41 }, (_, i) => { const u = (Math.PI * i) / 40 - Math.PI / 2; return [x + 14 * Math.cos(u), cy + a * Math.sin(u)]; }), { c: C.gold, w: 3 }); }
        s.alpha(s.in(t, 6, 1), () => { const sgn = Math.sign(dPhi), mag = Math.min(1, Math.abs(dPhi) * 0.8); if (mag > 0.03) { s.arrow(cx - 40 * sgn * 0, cy, cx + sgn * 80 * mag, cy, { c: C.green, w: 4 }); s.arrow(cx + 40, cy - a - 12, cx + 40 + sgn * 26, cy - a - 12, { c: C.green, w: 2.5, head: 9 }); } s.txt('induced field', cx, cy + a + 22, { c: C.green, size: 13, align: 'center', sans: true }); });
        const gx = 60, gy = 470, gw = 420, gh = 90;
        s.line(gx, gy, gx + gw, gy, { c: C.dim, w: 1.2 }); s.txt('flux Φ', gx + gw, gy - gh / 2 - 6, { c: C.blue, size: 13, sans: true, align: 'right' }); s.txt('emf ε', gx + gw, gy + gh / 2 - 6, { c: C.yellow, size: 13, sans: true, align: 'right' });
        const tr1 = [], tr2 = []; for (let i = 0; i <= 160; i++) { const tt = t - (i / 160) * 6, zz = z(tt), v = 170 * w * Math.cos(w * tt), e = -N * (-3 * (zz / (a * a)) * Math.pow(1 + zz * zz / (a * a), -2.5) * v); tr1.push([gx + gw - (i / 160) * gw, gy - Phi(zz) * gh * 0.9]); tr2.push([gx + gw - (i / 160) * gw, gy - clamp(e / (N * 6), -1, 1) * gh * 0.8]); }
        s.poly(tr1, { c: C.blue, w: 2.5 }); s.poly(tr2, { c: C.yellow, w: 2.5, a: s.in(t, 3, 1) });
        s.alpha(s.in(t, 9, 1.2), () => {
          s.cam({ th: -0.5, ph: 0.35, s: 95, cx: 760, cy: 230 });
          for (let y = -1.5; y <= 1.5; y += 0.75) s.arrow3([-1.6, y, -0.9], [1.6, y, -0.9], { c: C.blue, w: 1.4, head: 8, a: 0.5 });
          const ph = w * t, u = [-Math.sin(ph), Math.cos(ph), 0], corner = (a2, b2) => [u[0] * a2, u[1] * a2, b2];
          s.poly3([corner(-0.9, -0.6), corner(0.9, -0.6), corner(0.9, 0.6), corner(-0.9, 0.6), corner(-0.9, -0.6)], { c: C.gold, w: 3.5 });
          s.arrow3([0, 0, 0], [Math.cos(ph) * 0.8, Math.sin(ph) * 0.8, 0], { c: C.ink, w: 2, head: 9 });
          const hx = 600, hy = 470, hw = 320, hh = 70; s.line(hx, hy, hx + hw, hy, { c: C.dim, w: 1.2 });
          const c1 = [], c2 = []; for (let i = 0; i <= 120; i++) { const tt = (i / 120) * (4 * Math.PI) / w; c1.push([hx + (i / 120) * hw, hy - Math.cos(w * tt) * hh * 0.8]); c2.push([hx + (i / 120) * hw, hy - Math.sin(w * tt) * hh * 0.8]); }
          s.poly(c1, { c: C.blue, w: 2 }); s.poly(c2, { c: C.yellow, w: 2 }); const pp = ((t * w) % (4 * Math.PI)) / (4 * Math.PI); s.line(hx + pp * hw, hy - hh, hx + pp * hw, hy + hh, { c: C.ink, w: 1, dash: [3, 4] });
          s.txt('Φ = BA cos ωt', hx, hy - hh - 6, { c: C.blue, size: 14, sans: true }); s.txt('ε ∝ sin ωt', hx + hw, hy - hh - 6, { c: C.yellow, size: 14, sans: true, align: 'right' });
        });
        s.txt(`ε = ${f2(eps)} (arb.)`, 60, 360, { c: C.yellow, size: 18, a: s.in(t, 3, 1) });
        s.texAt('\\varepsilon = -N\\dfrac{d\\Phi}{dt}', 280, 54, 3.3, { size: 34, c: C.yellow });
        s.texAt('\\varepsilon = BAN\\omega\\sin\\omega t', 760, 54, 9.6, { size: 30, c: C.ink });
      }
    },
    steps: [
      { say: 'Magnetic flux measures how much field threads an area.', tex: R`\Phi = BA\cos\theta`, why: 'θ is the angle between the field and the normal to the area. Flux is biggest when the field goes straight through.' },
      { say: 'Faraday’s law: the induced emf equals the rate of change of flux linkage.', tex: R`\varepsilon = -N\,\frac{d\Phi}{dt}`, why: 'N turns each catch the same flux, so the flux linkage is NΦ. This is an experimental law (Faraday, 1831).' },
      { say: 'Lenz’s law gives the minus sign: the induced current opposes the change that caused it.', tex: R`\text{induced field} \;\propto\; -\frac{d\Phi}{dt}`, why: 'If the induced current helped the change, it would speed the magnet up, creating energy from nothing. Opposing it means you must do work, which becomes electrical energy.' },
      { say: 'A coil spinning at angular speed ω in a steady field:', tex: R`\theta = \omega t \;\Longrightarrow\; \Phi = BA\cos\omega t`, why: 'The angle between the coil’s normal and the field grows steadily, so the flux rises and falls like a cosine.' },
      { say: 'Differentiate.', tex: R`\varepsilon = -N\frac{d}{dt}(BA\cos\omega t) = BAN\omega\sin\omega t`, why: 'd/dt cos ωt = −ω sin ωt; the two minus signs cancel. The emf is largest when the flux is zero and changing fastest.' },
      { say: 'The peak emf is proportional to the speed.', tex: R`\varepsilon_0 = BAN\omega`, why: 'Turn the generator twice as fast and you get twice the peak voltage at twice the frequency. Power stations keep ω fixed (50 Hz in the UK) and regulate the output another way.' }
    ],
    result: R`\varepsilon = -N\frac{d\Phi}{dt}, \qquad \varepsilon = BAN\omega\sin\omega t`,
    assumptions: ['Uniform field and a rigid coil. The magnet’s flux in the animation uses the on-axis dipole formula, a good approximation only for a small coil.', 'The coil’s self-inductance is ignored; it delays the current and would round off the emf pulses in a real circuit.', 'Rigour: the “flux rule” covers both motional emf and transformer emf, but Feynman lists cases where it fails (rocking plates, the Faraday disc). The fundamental laws are F = q(E + v × B) and ∇ × E = −∂B/∂t.']
  });

  /* ================================================================ A-Level: Ideal gas (hard-disk simulation) */
  function gasSetup(s) {
    const N = 60, r = WL.rng(21), W = s.p.V, T = s.p.T, u0 = 120, P = [];
    for (let i = 0; i < N; i++) { const a = r() * 6.283, sp = u0 * Math.sqrt(T) * Math.sqrt(-2 * Math.log(1 - r() * 0.999)) / Math.SQRT2; P.push({ x: 75 + r() * (W - 30), y: 95 + r() * 350, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }); }
    s.state = { P, N, imp: 0, pE: 0, hist: new Float64Array(16), flashes: [], mV: false, mT: false, u0, Wnow: W, Tnow: T };
  }
  WL.topic({
    id: 'al-ideal-gas', stage: 'alevel', strand: 'T', title: 'Ideal Gas & Kinetic Theory',
    summary: 'Pressure from molecules hitting the walls, and why pV = NkT links temperature to molecular kinetic energy.',
    maths: [['Averages', '⟨c²⟩ and root-mean-square speed'], ['Momentum', 'Δp = 2mc_x per wall hit'], ['Proportionality', 'p ∝ 1/V and p ∝ T']],
    idea: 'Pressure is nothing but the <em>average push of countless collisions</em> with the walls. Squeeze the box and hits come more often; heat the gas and they come harder and more often.',
    try: 'Halve the volume with the piston, wait a few seconds, and compare the pressure readout: it roughly doubles.',
    quiz: { q: 'If the absolute temperature of a gas doubles, what happens to the r.m.s. speed of its molecules?', a: ['It doubles', 'It rises by a factor √2', 'It halves', 'It is unchanged'], c: 1, ex: 'c_{rms} = √(3kT/m) ∝ √T, so doubling T multiplies c_{rms} by √2 ≈ 1.41.' },
    anim: {
      duration: 15, stateful: true, alt: 'Sixty molecules bouncing in a box with a movable piston, a pressure gauge and a speed histogram.',
      params: [{ id: 'V', label: 'Box width (volume)', unit: 'px', min: 220, max: 520, step: 10, value: 500, noReset: true }, { id: 'T', label: 'Temperature', unit: '×', min: 0.5, max: 3, step: 0.1, value: 1, noReset: true }],
      beats: [[0, 'A gas: fast molecules bouncing off each other and the walls.'], [3, 'Each hit on a wall transfers momentum 2mv. Pressure is the average force per unit area (here, per unit length).'], [6, 'Halve the volume: hits come twice as often, so the pressure doubles (Boyle’s law).'], [9, 'Heat it: faster molecules hit harder and more often, so p ∝ T.'], [12, 'The speeds settle into the Maxwell–Boltzmann distribution (yellow).']],
      setup: gasSetup,
      onParam(s, id) { if (id === 'V') s.state.mV = true; else s.state.mT = true; },
      step(s, dt) {
        const S = s.state, t = s.t, rad = 7, x0 = 60, y0 = 80, y1 = 460;
        const Wt = S.mV ? s.p.V : t < 6 ? 500 : t < 8 ? lerp(500, 250, WL.smooth((t - 6) / 2)) : 250, Tt = S.mT ? s.p.T : t < 9 ? 1 : t < 10.5 ? lerp(1, 2, (t - 9) / 1.5) : 2;
        if (Math.abs(Tt - S.Tnow) > 1e-6) { const f = Math.sqrt(Tt / S.Tnow); S.P.forEach((q) => { q.vx *= f; q.vy *= f; }); S.Tnow = Tt; }
        S.Wnow = Wt; const xr = x0 + Wt, n = 4, h = dt / n;
        for (let k = 0; k < n; k++) {
          S.P.forEach((q) => { q.x += q.vx * h; q.y += q.vy * h;
            if (q.x < x0 + rad) { q.x = x0 + rad; if (q.vx < 0) { S.imp += -2 * q.vx; q.vx = -q.vx; S.flashes.push([x0, q.y, 0]); } }
            if (q.x > xr - rad) { q.x = xr - rad; if (q.vx > 0) { S.imp += 2 * q.vx; q.vx = -q.vx; S.flashes.push([xr, q.y, 0]); } }
            if (q.y < y0 + rad) { q.y = y0 + rad; if (q.vy < 0) { S.imp += -2 * q.vy; q.vy = -q.vy; } }
            if (q.y > y1 - rad) { q.y = y1 - rad; if (q.vy > 0) { S.imp += 2 * q.vy; q.vy = -q.vy; } } });
          for (let i = 0; i < S.N; i++) for (let j = i + 1; j < S.N; j++) {
            const a = S.P[i], b = S.P[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 > 4 * rad * rad || d2 === 0) continue;
            const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv >= 0) continue;
            a.vx += rv * nx; a.vy += rv * ny; b.vx -= rv * nx; b.vy -= rv * ny; const ov = (2 * rad - d) / 2; a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
          }
        }
        const per = 2 * (Wt + (y1 - y0)), pInst = S.imp / (dt * per); S.imp = 0; S.pE += (pInst - S.pE) * Math.min(1, dt / 1.2);
        const vr = S.u0 * Math.sqrt(S.Tnow); S.P.forEach((q) => { const b = Math.floor((Math.hypot(q.vx, q.vy) / vr) * 5.33); if (b < 16) S.hist[b] += dt * 0.6; }); for (let b = 0; b < 16; b++) S.hist[b] *= 1 - dt * 0.15;
        S.flashes.forEach((f) => (f[2] += dt)); S.flashes = S.flashes.filter((f) => f[2] < 0.25).slice(-40);
      },
      draw(s, t) {
        const S = s.state, x0 = 60, y0 = 80, y1 = 460, xr = x0 + S.Wnow, vr = S.u0 * Math.sqrt(S.Tnow);
        s.rect(x0, y0, S.Wnow, y1 - y0, { c: C.greyB, w: 3, fill: '#0b1118', fa: 1 });
        s.rect(xr, y0 - 6, 14, y1 - y0 + 12, { fill: C.greyB, fa: 0.9, stroke: false }); s.line(xr + 14, 270, xr + 60, 270, { c: C.greyB, w: 6 });
        S.flashes.forEach(([x, y, a]) => s.line(x, y - 9, x, y + 9, { c: C.yellow, w: 4, a: 1 - a / 0.25 }));
        S.P.forEach((q) => { const sp = Math.hypot(q.vx, q.vy) / vr; s.circle(q.x, q.y, 7, { c: WL.cmap(clamp(sp / 2.2)), w: 1.5, fill: WL.cmap(clamp(sp / 2.2)), fa: 0.65 }); });
        const area = S.Wnow * (y1 - y0), kT = 0.5 * S.u0 * S.u0 * S.Tnow, ratio = (S.pE * area) / (S.N * kT);
        s.txt(`p = ${f2(S.pE)}   (model units)`, 620, 60, { c: C.yellow, size: 20 });
        s.txt(`V = ${f0(area / 1000)} × 10³ px²   T = ${f2(S.Tnow)}`, 620, 90, { c: C.ink, size: 17 });
        s.txt(`pV / NkT = ${f2(ratio)}`, 620, 120, { c: C.green, size: 18, a: s.in(t, 3, 1) });
        const A = s.axes({ x0: 640, y0: 470, w: 280, h: 230, xr: [0, 3], yr: [0, 1.05], xt: [0, 3, 1], xl: 'v / v_{rms}' , ytl: false });
        A.draw(s.in(t, 0, 1)); const tot = S.hist.reduce((a, b) => a + b, 0) || 1;
        for (let b = 0; b < 16; b++) { const v0 = b / 5.33, v1 = (b + 1) / 5.33, hgt = (S.hist[b] / tot) * 5.33 / 1.2; s.rect(A.X(v0), A.Y(hgt), A.X(v1) - A.X(v0) - 1, A.Y(0) - A.Y(hgt), { c: C.blue, fill: C.blue, fa: 0.45, w: 1 }); }
        s.alpha(s.in(t, 12, 1), () => A.fn((v) => (2 * v * Math.exp(-v * v)) / 1.2, 0, 3, { c: C.yellow, w: 2.5 }));
        s.texAt('pV = \\tfrac13 Nm\\langle c^2\\rangle', 780, 190, 3.6, { size: 26, c: C.ink });
        s.texAt('\\tfrac12 m\\langle c^2\\rangle = \\tfrac32 kT', 780, 236, 9.5, { size: 26, c: C.yellow });
      }
    },
    steps: [
      { say: 'One molecule of mass m in a cube of side L, moving with x-velocity c_x, hits the right-hand wall.', tex: R`\Delta p = mc_x - (-mc_x) = 2mc_x`, why: 'An elastic bounce reverses c_x, so the momentum change is twice the momentum. The wall receives the same impulse in the opposite direction.' },
      { say: 'It returns to the same wall after travelling 2L, so the average force from this one molecule is:', tex: R`F = \frac{2mc_x}{2L/c_x} = \frac{mc_x^2}{L}`, why: 'Force = momentum change ÷ time between hits. Faster molecules hit harder and more often: c_x appears twice.' },
      { say: 'Add up all N molecules.', tex: R`F = \frac{m}{L}\sum c_x^2 = \frac{Nm}{L}\langle c_x^2\rangle`, why: 'Collisions between molecules swap momentum around but don’t change the total, so we can treat each as if it flew freely.' },
      { say: 'Pressure is force per area, and in 3D no direction is special.', tex: R`p = \frac{F}{L^2} = \frac{Nm}{V}\langle c_x^2\rangle, \qquad \langle c_x^2\rangle = \tfrac13\langle c^2\rangle \;\Longrightarrow\; pV = \tfrac13 Nm\langle c^2\rangle`, why: 'c² = c_x² + c_y² + c_z², and by symmetry the three averages are equal. (In the 2D animation the factor is ½ instead of ⅓.)' },
      { say: 'Compare with the experimental ideal gas law pV = NkT.', tex: R`\tfrac12 m\langle c^2\rangle = \tfrac32 kT`, why: 'Equate the two expressions for pV. Temperature is a measure of the average kinetic energy of the molecules.' },
      { say: 'The root-mean-square speed:', tex: R`c_{\text{rms}} = \sqrt{\frac{3kT}{m}}`, why: 'For nitrogen at 300 K: √(3 × 1.38 × 10⁻²³ × 300 / 4.65 × 10⁻²⁶) ≈ 517 m/s, faster than sound in air.' }
    ],
    result: R`pV = \tfrac13 Nm\langle c^2\rangle = NkT, \qquad \tfrac12 m\langle c^2\rangle = \tfrac32 kT`,
    assumptions: ['Ideal gas: molecules are points with no forces between them except during collisions. Real gases deviate at high pressure and low temperature (van der Waals).', 'The simulation’s molecules have a finite size, which makes pV/NkT slightly larger than 1, the same correction van der Waals’ b describes.', 'The animation is 2D, so its kinetic energy is ½m⟨c²⟩ = kT (two degrees of freedom) instead of 3/2 kT.']
  });

  /* ================================================================ A-Level: Binding energy */
  const BE_DATA = [[2, 1.112, '²H'], [3, 2.827, '³H'], [4, 7.074, '⁴He'], [7, 5.606, '⁷Li'], [12, 7.68, '¹²C'], [16, 7.976, '¹⁶O'], [56, 8.79, '⁵⁶Fe'], [62, 8.795, '⁶²Ni'], [120, 8.505, '¹²⁰Sn'], [208, 7.868, '²⁰⁸Pb'], [235, 7.591, '²³⁵U'], [238, 7.57, '²³⁸U']];
  const semf = (A, Zf, pair) => { const aV = 15.75, aS = 17.8, aC = 0.711, aA = 23.7, aP = 11.18, Z = Zf == null ? A / (2 + 0.0154 * Math.pow(A, 2 / 3)) : Zf, N = A - Z; let d = 0; if (pair) { const zi = Math.round(Z), ni = A - zi; if (A % 2 === 0) d = zi % 2 === 0 && ni % 2 === 0 ? aP / Math.sqrt(A) : -aP / Math.sqrt(A); } const terms = [aV * A, -aS * Math.pow(A, 2 / 3), -(aC * Z * (Z - 1)) / Math.pow(A, 1 / 3), -(aA * (N - Z) ** 2) / A, d]; return { B: terms.reduce((a, b) => a + b, 0), terms, Z }; };
  WL.topic({
    id: 'al-nuclear', stage: 'alevel', strand: 'Q', title: 'Binding Energy',
    summary: 'Mass defect, E = mc², and why both fusion of light nuclei and fission of heavy ones release energy.',
    maths: [['Standard form & units', '1 u = 931.5 MeV/c²'], ['Proportion', 'Volume ∝ A, surface ∝ A^{2/3}'], ['Reading graphs', 'Energy released = rise on the curve × nucleons']],
    idea: 'A nucleus weighs <em>less</em> than its parts. The missing mass is the energy that holds it together, and per nucleon it peaks in the middle of the periodic table, so nuclei release energy by moving towards iron and nickel.',
    try: 'Slide A from 4 up to 238 and watch which term in the liquid-drop formula grows to drag the curve down.',
    quiz: { q: 'A nucleus has a mass defect of 0.0304 u. What is its binding energy? (1 u ≡ 931.5 MeV)', a: ['2.83 MeV', '28.3 MeV', '283 MeV', '0.0304 MeV'], c: 1, ex: 'B = Δm c² = 0.0304 × 931.5 MeV ≈ 28.3 MeV, the binding energy of helium-4.' },
    anim: {
      duration: 14, alt: 'A balance showing helium-4 lighter than its nucleons, and the binding energy per nucleon curve with fission and fusion arrows.',
      params: [{ id: 'A', label: 'Mass number A', unit: '', min: 4, max: 240, step: 1, value: 56 }],
      beats: [[0, 'A helium-4 nucleus weighs less than the two protons and two neutrons it is made from.'], [3, 'The missing mass is the binding energy: E = Δm c². For ⁴He that is 28.3 MeV.'], [6, 'Per nucleon, binding energy climbs steeply, peaks near iron and nickel (about 8.8 MeV), then slowly falls.'], [9, 'Fusing light nuclei and splitting heavy ones both climb the curve, and release the difference.']],
      draw(s, t) {
        const A = s.axes({ x0: 80, y0: 480, w: 520, h: 360, xr: [0, 250], yr: [0, 9.6], xt: [0, 250, 50], yt: [0, 9, 1], xl: 'A', yl: 'B/A (MeV)', grid: true });
        s.alpha(s.in(t, 5.5, 1), () => {
          A.draw(1);
          A.fn((a) => semf(a).B / a, 8, 250, { c: C.yellow, w: 3, n: 240 });
          BE_DATA.forEach(([a, b, lab]) => { s.dot(...A.pt(a, b), { c: C.ink, r: 4.5 }); s.txt(lab, A.X(a) + 7, A.Y(b) - 11, { c: C.dim, size: 13, sans: true }); });
          const a = s.p.A, sm = semf(a, null, true), ba = sm.B / a; s.dot(...A.pt(a, ba), { c: C.red, r: 7 }); s.line(A.X(a), A.Y(0), A.X(a), A.Y(ba), { c: C.red, w: 1.5, dash: [3, 4] });
          s.txt(`A = ${a}, Z ≈ ${Math.round(sm.Z)}: B/A ≈ ${f2(ba)} MeV`, 340, 506, { c: C.red, size: 16, align: 'center', sans: true });
          const bx = 670, by = 470, labs = ['volume', 'surface', 'Coulomb', 'asymmetry', 'pairing'], cols = [C.green, C.blue, C.red, C.purple, C.orange];
          s.txt('liquid-drop terms per nucleon (MeV)', bx, 288, { c: C.dim, size: 13, sans: true });
          sm.terms.forEach((v, i) => { const y = 310 + i * 32, wv = (v / a) * 14; s.rect(bx + 90, y, wv, 20, { c: cols[i], fill: cols[i], fa: 0.5, w: 1.5 }); s.txt(labs[i], bx + 82, y + 10, { c: cols[i], size: 13, sans: true, align: 'right' }); s.txt(f2(v / a), bx + 90 + Math.max(0, wv) + 6, y + 10, { c: C.ink, size: 13, sans: true }); });
        });
        s.alpha(s.in(t, 9, 1), () => {
          s.arrow(A.X(4), A.Y(2.2), A.X(10), A.Y(6.6), { c: C.teal, w: 3.5 }); s.txt('fusion', A.X(14), A.Y(4.2), { c: C.teal, size: 16, sans: true });
          s.arrow(A.X(235), A.Y(7.45), A.X(118), A.Y(8.35), { c: C.orange, w: 3.5 }); s.txt('fission', A.X(178), A.Y(7.45), { c: C.orange, size: 16, sans: true });
        });
        s.alpha(s.out(t, 5.5, 1) * 0.95 + 0.05, () => {
          const tilt = 0.12 * s.in(t, 1, 1.5), cx = 340, cy = 200;
          s.poly([[cx, cy], [cx - 20, cy + 140], [cx + 20, cy + 140]], { c: C.greyB, w: 2, fill: C.greyB, fa: 0.4, close: true });
          const L = 190, ax = cx - L * Math.cos(tilt), ay = cy + L * Math.sin(-tilt) * -1, bx2 = cx + L * Math.cos(tilt), by2 = cy + L * Math.sin(tilt);
          s.line(ax, cy - L * Math.sin(tilt), bx2, by2, { c: C.greyB, w: 5 });
          const ly = cy - L * Math.sin(tilt), ry = by2;
          s.line(ax, ly, ax, ly + 50, { c: C.dim, w: 1.5 }); s.line(bx2, ry, bx2, ry + 50, { c: C.dim, w: 1.5 });
          s.rect(ax - 50, ly + 50, 100, 6, { fill: C.greyB, fa: 1, stroke: false }); s.rect(bx2 - 70, ry + 50, 140, 6, { fill: C.greyB, fa: 1, stroke: false });
          [[-8, -8, C.red], [8, -8, C.blue], [-8, 8, C.blue], [8, 8, C.red]].forEach(([dx, dy, c]) => s.circle(ax + dx, ly + 32 + dy, 8, { c, fill: c, fa: 0.8, w: 1 }));
          [[-48, C.red], [-16, C.red], [16, C.blue], [48, C.blue]].forEach(([dx, c]) => s.circle(bx2 + dx, ry + 38, 9, { c, fill: c, fa: 0.8, w: 1 }));
          s.txt('⁴He nucleus  4.0015 u', ax, ly + 80, { c: C.ink, size: 15, align: 'center', sans: true }); s.txt('2p + 2n  4.0319 u', bx2, ry + 80, { c: C.ink, size: 15, align: 'center', sans: true });
          s.txt('Δm = 0.0304 u  →  28.3 MeV', cx, 450, { c: C.yellow, size: 20, align: 'center', a: s.in(t, 3, 1) });
        });
        s.texAt('E = \\Delta m\\,c^2', 480, 60, 3.3, { size: 38, c: C.yellow, t1: 5.4 });
        s.texAt('B = a_VA - a_SA^{2/3} - a_C\\dfrac{Z^2}{A^{1/3}} - a_A\\dfrac{(A-2Z)^2}{A} \\pm \\delta', 560, 60, 6.6, { size: 24, c: C.ink });
      }
    },
    steps: [
      { say: 'The mass defect: a nucleus is lighter than its separate protons and neutrons.', tex: R`\Delta m = Z m_p + N m_n - M_{\text{nucleus}}`, why: 'Measured with mass spectrometers to better than a part in a billion. Every stable nucleus has Δm > 0.' },
      { say: 'Binding energy is the energy needed to pull the nucleus completely apart.', tex: R`B = \Delta m\,c^2`, why: 'Einstein’s E = mc²: when nucleons bind, energy leaves the system (as gamma rays or kinetic energy), and with it, mass.' },
      { say: 'Example, helium-4.', tex: R`\Delta m = 2(1.007276) + 2(1.008665) - 4.001506 = 0.030376\ \text{u} \;\Rightarrow\; B = 28.3\ \text{MeV}`, why: '1 u of mass is equivalent to 931.5 MeV. Divided among 4 nucleons that is 7.07 MeV each, unusually high for such a light nucleus.' },
      { say: 'Energy released in any nuclear reaction:', tex: R`Q = \sum B_{\text{after}} - \sum B_{\text{before}}`, why: 'Products more tightly bound than the reactants means mass has disappeared and energy has been released.' },
      { say: 'Fission of uranium-235 into two medium nuclei:', tex: R`Q \approx 235 \times (8.5 - 7.6)\ \text{MeV} \approx 200\ \text{MeV}`, why: 'Each of the 235 nucleons ends up bound about 0.9 MeV more tightly. Per kilogram, that is millions of times more than burning coal.' },
      { say: 'The liquid-drop model (semi-empirical mass formula) explains the curve’s shape.', tex: R`B = a_V A - a_S A^{2/3} - a_C\frac{Z(Z-1)}{A^{1/3}} - a_A\frac{(A-2Z)^2}{A} \pm \delta`, why: 'Volume binding ∝ A; nucleons on the surface have fewer neighbours (∝ A^{2/3}); protons repel (Coulomb, grows fast for heavy nuclei); a neutron–proton imbalance costs energy; pairs of like nucleons bind extra.' }
    ],
    result: R`B = \Delta m\,c^2, \qquad Q = \sum B_{\text{after}} - \sum B_{\text{before}}`,
    assumptions: ['The liquid-drop formula is an empirical fit: it misses the extra stability at “magic numbers” (2, 8, 20, 28, 50, 82, 126), which needs the nuclear shell model, and fails for very light nuclei.', 'Common misconception: iron-56 is often called the most tightly bound nucleus, but nickel-62 has a slightly higher binding energy per nucleon (8.7945 vs 8.7903 MeV). Iron-56 has the lowest mass per nucleon, which is a different quantity.', 'Masses are for bare nuclei; atomic masses include electrons and their (tiny) binding energies.']
  });

  /* ================================================================ Y1: Rigid-body rotation (rolling race) */
  const RACERS = [[0.4, C.blue, 'solid sphere'], [0.5, C.teal, 'disc'], [2 / 3, C.yellow, 'hollow sphere'], [1, C.red, 'hoop']];
  WL.topic({
    id: 'y1-rotation', stage: 'y1', strand: 'M', title: 'Rolling & Moment of Inertia',
    summary: 'Why a solid sphere beats a hoop down any slope, whatever their mass or size: moment of inertia.',
    maths: [['Integration', 'I = ∫r² dm'], ['Energy conservation', 'mgh = ½mv² + ½Iω²'], ['Rolling condition', 'v = ωr']],
    idea: 'A rolling object must also <em>spin</em>, and spinning costs energy. The more of its mass sits far from the axis, the more energy is locked in rotation and the less is left for rolling forward.',
    try: 'Steepen the slope: every racer speeds up, but the finishing order never changes.',
    quiz: { q: 'A solid disc and a hoop of equal mass and radius roll down the same slope from rest. Which reaches the bottom first?', a: ['The hoop', 'The disc', 'They tie', 'It depends on the mass'], c: 1, ex: 'The disc has I = ½mr², the hoop mr², so the disc keeps a bigger share of its energy as forward motion: a = g sin θ/(1 + I/mr²) is larger.' },
    anim: {
      duration: 12, alt: 'Four rolling objects race down parallel ramps; the solid sphere wins and the hoop comes last.',
      params: [{ id: 'th', label: 'Slope angle θ', unit: '°', min: 5, max: 25, step: 1, value: 15 }],
      beats: [[0, 'A solid sphere, a disc, a hollow sphere and a hoop are released together.'], [3, 'The solid sphere always wins and the hoop always loses, whatever their mass or size.'], [6, 'Rolling splits kinetic energy: KE = ½mv² + ½Iω². Mass far from the axis means more spinning energy.'], [9, 'Less energy left for moving forward: a = g sin θ / (1 + I/mr²).']],
      draw(s, t) {
        const th = (s.p.th * Math.PI) / 180, g = 600, Lr = 480, r = 22, dir = [Math.cos(th), Math.sin(th)], nrm = [Math.sin(th), -Math.cos(th)];
        const acc = RACERS.map(([k]) => (g * Math.sin(th)) / (1 + k)), tf = acc.map((a) => Math.sqrt((2 * Lr) / a)), T = Math.max(...tf) + 2.2, tau = WL.cyc(Math.max(0, t - 0.6), T, 0.6);
        RACERS.forEach(([k, col, name], i) => {
          const S0 = [90, 120 + 56 * i], E0 = [S0[0] + dir[0] * (Lr + 30), S0[1] + dir[1] * (Lr + 30)];
          s.line(S0[0], S0[1], E0[0], E0[1], { c: C.greyB, w: 3 }); s.line(E0[0], E0[1] - 26, E0[0], E0[1] + 6, { c: C.dim, w: 2 });
          const d = Math.min(Lr, 0.5 * acc[i] * tau * tau), cx = S0[0] + dir[0] * d + nrm[0] * r, cy = S0[1] + dir[1] * d + nrm[1] * r, ang = d / r;
          if (k === 0.4) s.circle(cx, cy, r, { c: col, w: 2, fill: col, fa: 0.75 });
          else if (k === 0.5) s.circle(cx, cy, r, { c: col, w: 2.5, fill: col, fa: 0.35 });
          else if (k < 1) { s.circle(cx, cy, r, { c: col, w: 5, fill: col, fa: 0.12 }); }
          else s.circle(cx, cy, r, { c: col, w: 6 });
          for (let q = 0; q < 3; q++) { const a = ang + (q * 2 * Math.PI) / 3; s.line(cx, cy, cx + r * 0.9 * Math.cos(a), cy + r * 0.9 * Math.sin(a), { c: C.bg, w: 2 }); }
          const done = 0.5 * acc[i] * tau * tau >= Lr; s.txt(done ? `${name}: ${f2(tf[i] * 0.42)} s` : name, S0[0] - 10, S0[1] - 8, { c: col, size: 14, sans: true, align: 'right', a: 0 });
          s.txt(name, E0[0] + 12, E0[1] - 12, { c: col, size: 14, sans: true });
          if (done) s.txt(`${f2(Math.sqrt(2 * Lr / acc[i]))} s`, E0[0] + 12, E0[1] + 8, { c: C.ink, size: 13, sans: true });
        });
        s.alpha(s.in(t, 6, 1), () => {
          const bx = 650, by = 300; s.txt('share of kinetic energy', bx, by - 14, { c: C.dim, size: 13, sans: true });
          RACERS.forEach(([k, col, name], i) => { const y = by + i * 40, ft = 1 / (1 + k), W2 = 260; s.rect(bx, y, W2 * ft, 22, { fill: col, fa: 0.6, stroke: false }); s.rect(bx + W2 * ft, y, W2 * (1 - ft), 22, { fill: C.orange, fa: 0.35, stroke: false }); s.txt(`${f0(100 * ft)}% moving`, bx + 6, y + 11, { c: C.ink, size: 12, sans: true }); s.txt(`I/mr² = ${k === 0.4 ? '2/5' : k === 0.5 ? '1/2' : k < 1 ? '2/3' : '1'}`, bx + W2 + 8, y + 11, { c: col, size: 12, sans: true }); });
          s.txt('orange = spinning', bx, by + 168, { c: C.orange, size: 12, sans: true });
        });
        s.texAt('KE = \\tfrac12 mv^2 + \\tfrac12 I\\omega^2', 760, 60, 6.3, { size: 28, c: C.ink });
        s.texAt('a = \\dfrac{g\\sin\\theta}{1 + I/mr^2}', 760, 130, 9.3, { size: 30, c: C.yellow });
      }
    },
    steps: [
      { say: 'Moment of inertia: rotational “mass”, weighted by distance squared from the axis.', tex: R`I = \sum_i m_i r_i^2 \;\longrightarrow\; I = \int r^2\,dm`, why: 'Kinetic energy of a spinning body is Σ ½mᵢ(ωrᵢ)² = ½(Σmᵢrᵢ²)ω². The bracket is I. Mass far out counts much more than mass near the axis.' },
      { say: 'Example: a uniform disc of mass M, radius R, surface density σ = M/πR².', tex: R`I = \int_0^R r^2\,(2\pi r\,\sigma\,dr) = 2\pi\sigma\frac{R^4}{4} = \tfrac12 MR^2`, why: 'Slice the disc into thin rings of radius r and width dr. Each ring has mass σ·2πr dr, all at distance r.' },
      { say: 'Rolling without slipping links spin to speed.', tex: R`v = \omega R`, why: 'The contact point is momentarily at rest, so the centre moves forward exactly one circumference per turn.' },
      { say: 'Energy conservation from height h.', tex: R`Mgh = \tfrac12 Mv^2 + \tfrac12 I\omega^2 = \tfrac12 Mv^2\left(1 + \frac{I}{MR^2}\right)`, why: 'Substitute ω = v/R. Static friction at the contact point does no work because that point doesn’t slide.' },
      { say: 'Solve for the speed at the bottom.', tex: R`v^2 = \frac{2gh}{1 + I/MR^2}`, why: 'M and R cancel out: only the shape factor k = I/MR² matters. A marble and a bowling ball (both solid spheres) tie.' },
      { say: 'Along a slope of angle θ the acceleration is constant:', tex: R`a = \frac{g\sin\theta}{1 + k}, \qquad k = \tfrac25 < \tfrac12 < \tfrac23 < 1`, why: 'Smaller k wins: solid sphere (2/5), then disc (1/2), hollow sphere (2/3), hoop (1).' }
    ],
    result: R`I = \int r^2\,dm, \qquad a = \frac{g\sin\theta}{1 + I/MR^2}`,
    assumptions: ['Rolling without slipping. On steep or slippery slopes objects slide: rolling needs μ_s ≥ tan θ · k/(1 + k).', 'Rigid bodies and no rolling resistance or air drag; real hoops and balls flex slightly, which wastes a little energy.', 'The finish times shown use the model’s scaled g, so only their ratios are meaningful: t ∝ √(1 + k).']
  });

  /* ================================================================ Y1: Thermodynamics (Carnot cycle) */
  WL.topic({
    id: 'y1-thermo', stage: 'y1', strand: 'T', title: 'Laws of Thermodynamics & Entropy',
    summary: 'The Carnot cycle: the most efficient engine possible, and how it reveals entropy as a state function.',
    maths: [['Partial derivatives', 'State functions U(T, V)'], ['Integration', 'W = ∫p dV = nRT ln(V₂/V₁)'], ['Logarithms', 'ln of volume ratios']],
    idea: 'An engine takes heat from a hot place, turns <em>some</em> of it into work and must dump the rest somewhere cold. The best possible split depends only on the two temperatures.',
    try: 'Raise T_h or lower T_c: the loop on the p–V diagram fattens and the efficiency rises.',
    quiz: { q: 'What is the maximum possible efficiency of an engine working between 600 K and 300 K?', a: ['25%', '50%', '75%', '100%'], c: 1, ex: 'η = 1 − T_c/T_h = 1 − 300/600 = 50%. No engine between these temperatures can do better.' },
    anim: {
      duration: 12, alt: 'A Carnot cycle traced on a p–V diagram beside a piston and a T–S rectangle.',
      params: [{ id: 'Th', label: 'Hot reservoir T_h', unit: 'K', min: 400, max: 900, step: 10, value: 600 }, { id: 'Tc', label: 'Cold reservoir T_c', unit: 'K', min: 150, max: 380, step: 10, value: 300 }],
      beats: [[0, 'An ideal gas in a cylinder runs a cycle between a hot and a cold reservoir.'], [2.5, 'Isothermal expansion at T_h: it absorbs heat Q_h and does work.'], [5, 'Adiabatic expansion: insulated, the gas cools from T_h to T_c.'], [7.5, 'Isothermal compression at T_c dumps heat Q_c; an adiabatic compression closes the loop.'], [10, 'Net work = enclosed area. η = 1 − T_c/T_h. On a T–S diagram the cycle is a rectangle.']],
      draw(s, t) {
        const Th = s.p.Th, Tc = Math.min(s.p.Tc, Th - 50), g1 = 1.5, V1 = 1, V2 = 2.2, V3 = V2 * Math.pow(Th / Tc, g1), V4 = V1 * Math.pow(Th / Tc, g1);
        const leg = (u, k) => { if (k === 0) { const V = V1 * Math.pow(V2 / V1, u); return [V, Th]; } if (k === 1) { const V = V2 * Math.pow(V3 / V2, u); return [V, Th * Math.pow(V2 / V, 1 / g1)]; } if (k === 2) { const V = V3 * Math.pow(V4 / V3, u); return [V, Tc]; } const V = V4 * Math.pow(V1 / V4, u); return [V, Tc * Math.pow(V4 / V, 1 / g1)]; };
        const tc = t % 10, k = Math.min(3, Math.floor(tc / 2.5)), u = (tc - 2.5 * k) / 2.5, [Vn, Tn] = leg(u, k), pn = Tn / Vn;
        const A = s.axes({ x0: 80, y0: 470, w: 420, h: 360, xr: [0, V3 * 1.08], yr: [0, (Th / V1) * 1.1], xt: WL.ticks(0, V3, 5), yt: WL.ticks(0, Th / V1, 4), xl: 'V', yl: 'p' });
        A.draw(s.in(t, 0, 1));
        const pts = []; for (let kk = 0; kk < 4; kk++) for (let i = 0; i <= 40; i++) { const [V, T] = leg(i / 40, kk); pts.push(A.pt(V, T / V)); }
        s.alpha(s.in(t, 10, 1), () => s.poly(pts, { fill: C.yellow, fa: 0.2, stroke: false }));
        const cols = [C.red, C.purple, C.blue, C.purple];
        for (let kk = 0; kk < 4; kk++) { const seg = []; const lim = kk < k || t >= 10 ? 1 : kk === k ? u : 0; for (let i = 0; i <= 40; i++) { const uu = (i / 40) * lim; const [V, T] = leg(uu, kk); seg.push(A.pt(V, T / V)); } if (lim > 0) s.poly(seg, { c: cols[kk], w: 3.5 }); }
        s.dot(...A.pt(Vn, pn), { c: C.ink, r: 7 });
        const px = 600, py0 = 60, pw = 150, ph = 230, fill = (Vn - V1) / (V3 - V1), pistonY = py0 + 20 + (1 - fill) * 150;
        s.rect(px, py0, pw, ph, { c: C.greyB, w: 3 }); s.rect(px + 3, pistonY, pw - 6, 14, { fill: C.greyB, fa: 0.9, stroke: false }); s.line(px + pw / 2, pistonY, px + pw / 2, py0 - 30, { c: C.greyB, w: 5 });
        const r = WL.rng(8), sp = Math.sqrt(Tn) * 2.2;
        for (let i = 0; i < 26; i++) { const ox = r(), oy = r(), ph2 = r() * 6.28; const x = px + 12 + ((ox * (pw - 24) + t * 40 * sp * (r() - 0.5)) % (pw - 24) + (pw - 24)) % (pw - 24), y = pistonY + 22 + ((oy * (py0 + ph - pistonY - 30) + Math.sin(t * sp + ph2) * 10) % (py0 + ph - pistonY - 30) + (py0 + ph - pistonY - 30)) % (py0 + ph - pistonY - 30); s.dot(x, y, { c: WL.cmap(clamp((Tn - 150) / 750)), r: 3.5 }); }
        const res = k === 0 ? [C.red, `hot ${Th} K`, 1] : k === 2 ? [C.blue, `cold ${Tc} K`, -1] : [C.greyD, 'insulated', 0];
        s.rect(px - 10, py0 + ph + 4, pw + 20, 26, { fill: res[0], fa: 0.6, stroke: false }); s.txt(res[1], px + pw / 2, py0 + ph + 17, { c: C.ink, size: 14, align: 'center', sans: true });
        if (res[2]) for (let i = 0; i < 3; i++) { const x = px + 30 + i * 45, f2y = ((t * 1.5 + i * 0.3) % 1); s.arrow(x, res[2] > 0 ? py0 + ph + 4 - f2y * 30 : py0 + ph - 30 + f2y * 30, x, res[2] > 0 ? py0 + ph - 26 - f2y * 30 : py0 + ph + 4 + f2y * 30, { c: res[0], w: 2.5, head: 8 }); }
        s.txt(res[2] > 0 ? 'Q_h in' : res[2] < 0 ? 'Q_c out' : 'Q = 0', px + pw + 16, py0 + ph - 10, { c: res[0] === C.greyD ? C.dim : res[0], size: 15, sans: true });
        const Sx = (V, T) => Math.log(V) + Math.log(T) / (g1 - 0.5) * 0 + 1.5 * Math.log(T), S1 = Sx(V1, Th), S2 = Sx(V2, Th);
        const B = s.axes({ x0: 620, y0: 505, w: 280, h: 140, xr: [S1 - 0.3, S2 + 0.3], yr: [0, Th * 1.15], xt: null, yt: null, xl: 'S', yl: 'T' });
        s.alpha(s.in(t, 10, 1), () => { B.draw(1); s.poly([B.pt(S1, Tc), B.pt(S1, Th), B.pt(S2, Th), B.pt(S2, Tc), B.pt(S1, Tc)], { c: C.yellow, w: 2.5, fill: C.yellow, fa: 0.2 }); s.dot(...B.pt(Sx(Vn, Tn), Tn), { c: C.ink, r: 5 }); });
        const Qh = Th * Math.log(V2 / V1), Qc = Tc * Math.log(V2 / V1);
        s.txt(`Q_h = ${f0(Qh)}   Q_c = ${f0(Qc)}   W = ${f0(Qh - Qc)}  (nR = 1 units)`, 80, 520, { c: C.ink, size: 15, sans: true, a: s.in(t, 7.5, 1) });
        s.txt(`η = ${f1(100 * (1 - Tc / Th))}%`, 300, 84, { c: C.yellow, size: 22, a: s.in(t, 10, 1) });
        s.texAt('\\eta = 1 - \\dfrac{T_c}{T_h}', 300, 132, 10.2, { size: 30, c: C.yellow });
        s.texAt('dS = \\dfrac{\\delta Q_{\\text{rev}}}{T}', 860, 330, 10.6, { size: 24, c: C.ink });
      }
    },
    steps: [
      { say: 'First law: energy is conserved.', tex: R`dU = \delta Q - \delta W, \qquad \delta W = p\,dV`, why: 'Heat in raises the internal energy unless the gas spends it doing work by expanding. δ marks quantities that depend on the path, not just the state.' },
      { say: 'Isothermal expansion at T_h: an ideal gas’s U depends only on T, so all heat in becomes work.', tex: R`Q_h = W_{12} = \int_{V_1}^{V_2} \frac{nRT_h}{V}\,dV = nRT_h\ln\frac{V_2}{V_1}`, why: 'dU = 0 at constant T, so δQ = p dV. Integrate p = nRT/V.' },
      { say: 'Adiabatic legs: no heat flows, so TV^{γ−1} is constant.', tex: R`T_hV_2^{\gamma-1} = T_cV_3^{\gamma-1}, \;\; T_hV_1^{\gamma-1} = T_cV_4^{\gamma-1} \;\Longrightarrow\; \frac{V_3}{V_4} = \frac{V_2}{V_1}`, why: 'Divide the two adiabatic conditions: the temperatures cancel and the volume ratios match.' },
      { say: 'Heat dumped at T_c:', tex: R`Q_c = nRT_c\ln\frac{V_3}{V_4} = nRT_c\ln\frac{V_2}{V_1}`, why: 'Same calculation as the hot leg, and the logarithm is the same by the previous step.' },
      { say: 'Efficiency:', tex: R`\eta = \frac{W}{Q_h} = 1 - \frac{Q_c}{Q_h} = 1 - \frac{T_c}{T_h}`, why: 'Net work W = Q_h − Q_c by the first law over a full cycle. The logs cancel, leaving only temperatures.' },
      { say: 'Q_h/T_h = Q_c/T_c, so heat divided by temperature sums to zero round the cycle: entropy is a state function.', tex: R`\oint\frac{\delta Q_{\text{rev}}}{T} = 0 \;\Longrightarrow\; dS = \frac{\delta Q_{\text{rev}}}{T}`, why: 'Any reversible cycle can be built from tiny Carnot cycles, so this holds generally (Clausius). For irreversible processes ∮δQ/T < 0: the second law.' }
    ],
    result: R`\eta_{\text{Carnot}} = 1 - \frac{T_c}{T_h}, \qquad dS = \frac{\delta Q_{\text{rev}}}{T}`,
    assumptions: ['Reversible and quasi-static: the cycle must run infinitely slowly, so a Carnot engine delivers zero power.', 'Contradiction with real plants: a coal station between about 840 K and 300 K has a Carnot limit of 64% but achieves about 36%. That is close to the Curzon–Ahlborn efficiency at maximum power, 1 − √(T_c/T_h) ≈ 40%.', 'The second law is statistical: tiny systems can briefly run “backwards”, as quantified by fluctuation theorems and seen in experiments on single molecules.']
  });

  /* ================================================================ Y1: Wave-particle duality (single-electron double slit) */
  function dsSetup(s) { s.state = { hits: [], hist: new Float64Array(60), acc: 0, fly: [], r: WL.rng(5 + Math.round(s.p.E)), manual: s.state && s.state.manual }; }
  WL.topic({
    id: 'y1-qm-intro', stage: 'y1', strand: 'Q', title: 'Wave–Particle Duality',
    summary: 'Single electrons build up an interference pattern dot by dot; watching which slit they use destroys it.',
    maths: [['Complex amplitudes', '|ψ₁ + ψ₂|² has a cross term'], ['Small angles', 'Fringe spacing λL/d'], ['Square roots', 'p = √(2meV)']],
    idea: 'Each electron arrives as <em>one dot</em>, like a particle. Yet where the dots are allowed to land is decided by a wave going through <em>both</em> slits. Ask which slit, and the wave-like fringes disappear.',
    try: 'Switch on the which-slit detector: the pattern restarts and the fringes never form.',
    quiz: { q: 'An electron is accelerated through 100 V. What is its de Broglie wavelength?', a: ['1.23 nm', '0.123 nm', '12.3 nm', '0.0123 nm'], c: 1, ex: 'λ = h/√(2meV) ≈ 1.226 nm/√V = 1.226/10 ≈ 0.123 nm, about the spacing of atoms in a crystal.' },
    anim: {
      duration: 15, stateful: true, alt: 'Electrons passing through two slits land one at a time and gradually build up interference fringes.',
      params: [{ id: 'E', label: 'Accelerating voltage', unit: 'V', min: 30, max: 300, step: 10, value: 60 }, { id: 'which', label: 'Which-slit detector', toggle: true, value: 0 }, { id: 'rate', label: 'Electrons per second', unit: '', min: 10, max: 400, step: 10, value: 150, noReset: true }],
      beats: [[0, 'Electrons are fired one at a time at two slits.'], [3, 'Each one lands as a single dot: particle-like.'], [6, 'Thousands of dots build up fringes: wave-like interference.'], [9, 'The fringe spacing gives the electron’s wavelength: λ = h/p (de Broglie).'], [12, 'Switch on a which-slit detector and the fringes vanish.']],
      setup: dsSetup,
      onParam(s, id) { if (id === 'rate') s.state.manual = true; },
      step(s, dt) {
        const S = s.state, t = s.t, rate = S.manual ? s.p.rate : t < 3 ? 3 : t < 6 ? 25 : s.p.rate, lam = 13 / Math.sqrt(s.p.E / 60), d = 80, a = 18, L = 520, which = !!s.p.which;
        const I = (y) => { const be = (Math.PI * a * y) / (lam * L), al = (Math.PI * d * y) / (lam * L), env = be === 0 ? 1 : (Math.sin(be) / be) ** 2; return which ? env : env * Math.cos(al) ** 2; };
        S.acc += rate * dt;
        while (S.acc >= 1) { S.acc -= 1; let y = 0; for (let k = 0; k < 200; k++) { y = (S.r() - 0.5) * 460; if (S.r() < I(y)) break; } S.hits.push([y, S.r()]); if (S.hits.length > 6000) S.hits.shift(); const b = Math.floor((y + 230) / (460 / 60)); if (b >= 0 && b < 60) S.hist[b]++; if (S.fly.length < 5 && rate < 60) S.fly.push({ y, slit: S.r() < 0.5 ? -1 : 1, age: 0 }); }
        S.fly.forEach((f) => (f.age += dt)); S.fly = S.fly.filter((f) => f.age < 0.6);
      },
      draw(s, t) {
        const S = s.state, gx = 60, sx = 300, scx = 800, cy = 270, which = !!s.p.which;
        s.rr(gx - 30, cy - 18, 46, 36, 6, { c: C.greyB, w: 2, fill: C.greyD, fa: 0.8 }); s.txt('e⁻ gun', gx - 7, cy + 36, { c: C.dim, size: 13, align: 'center', sans: true });
        s.rect(sx - 6, 40, 12, 460, { fill: '#3a4256', fa: 1, stroke: false }); [-40, 40].forEach((o) => s.rect(sx - 6, cy + o - 9, 12, 18, { fill: C.bg, fa: 1, stroke: false }));
        if (which) [-40, 40].forEach((o) => { s.circle(sx + 20, cy + o, 9, { c: C.red, w: 2 }); s.glow(sx + 20, cy + o, 18, C.red, 0.3); });
        S.fly.forEach((f) => { const u = f.age / 0.6, p1 = [gx + 16, cy], p2 = [sx, cy + f.slit * 40], p3 = [scx, cy + f.y]; const q = u < 0.45 ? [lerp(p1[0], p2[0], u / 0.45), lerp(p1[1], p2[1], u / 0.45)] : [lerp(p2[0], p3[0], (u - 0.45) / 0.55), lerp(p2[1], p3[1], (u - 0.45) / 0.55)]; s.glow(q[0], q[1], 14, C.blue, 0.6); s.dot(q[0], q[1], { c: C.blueA, r: 3 }); if (which && u > 0.42 && u < 0.5) s.flash(sx + 20, cy + f.slit * 40, (u - 0.42) / 0.08, { c: C.red, r: 8, R: 14, n: 8, w: 2 }); });
        s.rect(scx - 10, 40, 70, 460, { fill: '#05070a', fa: 1, c: C.dim, w: 1 });
        const n = S.hits.length, dr = Math.min(1, 900 / Math.max(1, n)) * 0.9 + 0.1; S.hits.forEach(([y, xr]) => s.dot(scx - 6 + xr * 62, cy + y, { c: C.blueA, r: 1.3, a: dr }));
        const mx = Math.max(1, ...S.hist); for (let b = 0; b < 60; b++) { const y = cy - 230 + (b + 0.5) * (460 / 60), w = (S.hist[b] / mx) * 80; s.rect(scx + 66, y - 3, w, 6, { fill: C.yellow, fa: 0.75, stroke: false }); }
        s.txt(`${n} electrons`, scx + 30, 520, { c: C.ink, size: 15, align: 'center', sans: true });
        const lnm = 1.226 / Math.sqrt(s.p.E); s.txt(`λ = h/√(2meV) = ${f3(lnm)} nm at ${s.p.E} V`, 360, 520, { c: C.ink, size: 16, sans: true, a: s.in(t, 9, 1) });
        s.texAt('\\lambda = \\dfrac{h}{p}', 560, 64, 9.3, { size: 38, c: C.yellow });
        s.texAt(which ? 'P(y) = |\\psi_1|^2 + |\\psi_2|^2' : 'P(y) = |\\psi_1 + \\psi_2|^2', 560, 470, 6.3, { size: 28, c: which ? C.red : C.blue });
      }
    },
    steps: [
      { say: 'Light quanta carry momentum.', tex: R`p = \frac{E}{c} = \frac{h}{\lambda}`, why: 'From relativity, a massless particle has E = pc; combined with E = hf = hc/λ this gives p = h/λ. Compton scattering (1923) confirmed it.' },
      { say: 'de Broglie (1924): reverse it. Every particle has a wavelength.', tex: R`\lambda = \frac{h}{p}`, why: 'A bold guess motivated by symmetry. It explained why Bohr’s orbits were quantised (a whole number of wavelengths fits round each one) and was confirmed by electron diffraction in 1927.' },
      { say: 'An electron accelerated through a voltage V:', tex: R`eV = \frac{p^2}{2m} \;\Longrightarrow\; \lambda = \frac{h}{\sqrt{2meV}} \approx \frac{1.226\ \text{nm}}{\sqrt{V/\text{volt}}}`, why: 'Its kinetic energy equals the work done by the field. At 100 V, λ ≈ 0.12 nm: about an atomic spacing, which is why crystals diffract electrons.' },
      { say: 'Two slits: bright fringes where the path difference is a whole number of wavelengths.', tex: R`d\sin\theta = n\lambda \;\Longrightarrow\; \Delta y = \frac{\lambda L}{d}`, why: 'Exactly as for light (see Young’s slits). Measuring Δy measures the electron’s λ.' },
      { say: 'Quantum rule: add amplitudes, then square.', tex: R`P(y) = |\psi_1 + \psi_2|^2 = |\psi_1|^2 + |\psi_2|^2 + 2\,\text{Re}(\psi_1^*\psi_2)`, why: 'The cross term is the interference. Its sign alternates across the screen, carving out the dark fringes.' },
      { say: 'Determine the slit and the cross term disappears.', tex: R`P(y) = |\psi_1|^2 + |\psi_2|^2`, why: 'A which-path record entangles the electron with the detector, and the two records are orthogonal, so the cross term averages to zero. Equivalently, locating the electron to within d kicks its momentum by about h/d, enough to smear the fringes (uncertainty principle).' }
    ],
    result: R`\lambda = \frac{h}{p}, \qquad P = |\psi_1 + \psi_2|^2`,
    assumptions: ['Non-relativistic momentum. At 50 kV electron-microscope voltages the relativistic correction to λ is already about 2.5%.', 'Ideal slits in the far-field limit; the pattern shown is the Fraunhofer two-slit result with a single-slit envelope.', 'This is not just a thought experiment: single-electron build-up was filmed by Merli, Missiroli and Pozzi (1974) and Tonomura (1989), and molecules as large as C₆₀ interfere (Arndt et al., 1999).']
  });
})();
