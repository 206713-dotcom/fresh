/* Geodesic — upgrades for the first 23 topics: self-checks, "try this" prompts, LaTeX overlays, 3D EM wave. */
(function () {
  const WL = window.WL, C = WL.C, T = WL.topics;
  const X = {
    'ks3-speed': { quiz: { q: 'A cyclist rides 600 m in 2 minutes at a steady speed. What is her speed?', a: ['300 m/s', '5 m/s', '1.2 m/s', '50 m/s'], c: 1, ex: 'Convert the time to seconds first: 2 min = 120 s, so v = 600 m ÷ 120 s = 5 m/s.' }, try: 'Double the speed and compare the two slopes on the graph: the line gets twice as steep.', texs: [[10.2, 'v=\\dfrac{\\Delta d}{\\Delta t}', 330, 206, 30, C.yellow]] },
    'ks3-moments': { quiz: { q: 'A 3 kg mass hangs 2 m left of the pivot. How far right of the pivot must a 4 kg mass hang to balance it?', a: ['1.5 m', '2.7 m', '1.33 m', '6 m'], c: 0, ex: 'Balance needs m₁d₁ = m₂d₂, so 3 × 2 = 4 × d₂ and d₂ = 1.5 m.' }, try: 'With m₁ = 2 kg at 2.5 m, find the d₂ that balances m₂ = 4 kg. The verdict line turns green.', texs: [[10.5, 'm_1 d_1 = m_2 d_2', 480, 448, 32, C.yellow]] },
    'ks3-waves': { quiz: { q: 'A wave has frequency 50 Hz and wavelength 4 m. How fast does it travel?', a: ['12.5 m/s', '54 m/s', '200 m/s', '0.08 m/s'], c: 2, ex: 'v = fλ = 50 Hz × 4 m = 200 m/s.' }, try: 'Keep v fixed and double f: the wavelength halves, because the rope sets the speed.', texs: [[12.2, 'v = f\\lambda', 860, 44, 36, C.yellow]] },
    'gcse-suvat': { quiz: { q: 'A car starts from rest and accelerates at 2 m/s² for 5 s. How far does it travel?', a: ['10 m', '25 m', '50 m', '20 m'], c: 1, ex: 's = ut + ½at² = 0 + ½ × 2 × 5² = 25 m.' }, try: 'Make the acceleration negative: the ball stops, turns round, and the area dips below the axis.' },
    'gcse-energy': { quiz: { q: 'A ball is dropped from 5 m (g = 10 N/kg, no air resistance). How fast is it moving at the bottom?', a: ['5 m/s', '10 m/s', '50 m/s', '100 m/s'], c: 1, ex: 'v = √(2gh) = √(2 × 10 × 5) = √100 = 10 m/s. The mass cancels.' }, try: 'Release from 80°: watch the total bar stay level while the other two trade places.' },
    'gcse-circuits': { quiz: { q: 'Two 6 Ω resistors are connected in parallel. What is the total resistance?', a: ['12 Ω', '6 Ω', '3 Ω', '36 Ω'], c: 2, ex: '1/R = 1/6 + 1/6 = 1/3, so R = 3 Ω. Two equal paths halve the resistance.' }, try: 'Make R₁ much smaller than R₂ in the parallel circuit and see which branch carries most of the current.' },
    'al-projectile': { quiz: { q: 'What is the maximum range for a launch speed of 20 m/s (g = 10 m/s², level ground, no drag)?', a: ['20 m', '40 m', '80 m', '400 m'], c: 1, ex: 'R_{max} = v₀²/g at 45°: 400 / 10 = 40 m.' }, try: 'Try 30° and then 60°: the grey and yellow paths land in the same place.', texs: [[9.4, 'R=\\dfrac{v_0^2\\sin 2\\theta}{g}', 760, 180, 34, C.yellow]] },
    'al-circular': { quiz: { q: 'A car takes a bend of radius 50 m at 10 m/s. What is its centripetal acceleration?', a: ['0.2 m/s²', '2 m/s²', '5 m/s²', '500 m/s²'], c: 1, ex: 'a = v²/r = 100/50 = 2 m/s², directed towards the centre of the bend.' }, try: 'Shrink the gap Δθ to 4°: the ratio |Δv|/(vΔθ) gets very close to 1.' },
    'al-shm': { quiz: { q: 'A 0.5 kg mass oscillates on a spring with k = 200 N/m. What is the period?', a: ['0.31 s', '0.05 s', '3.1 s', '0.016 s'], c: 0, ex: 'T = 2π√(m/k) = 2π√(0.0025) = 2π × 0.05 ≈ 0.31 s.' }, try: 'Change the amplitude: the period readout does not move. That is isochronism.' },
    'al-capacitors': { quiz: { q: 'R = 10 kΩ and C = 100 µF. What is the time constant?', a: ['1 s', '0.1 s', '10 s', '1000 s'], c: 0, ex: 'τ = RC = 10⁴ Ω × 10⁻⁴ F = 1 s.' }, try: 'Double τ and find where the curve now crosses 0.37.', texs: [[3, 'Q = Q_0\\,e^{-t/RC}', 760, 92, 34, C.blue]] },
    'al-photoelectric': { quiz: { q: 'Photons of energy 3.0 eV hit sodium (φ = 2.28 eV). What is the maximum kinetic energy of the electrons?', a: ['5.28 eV', '0.72 eV', '2.28 eV', '1.32 eV'], c: 1, ex: 'KE_max = hf − φ = 3.00 − 2.28 = 0.72 eV.' }, try: 'Set f below 5.5 × 10¹⁴ Hz and turn the intensity to maximum: still no electrons.', texs: [[9, 'hf = \\phi + KE_{\\max}', 470, 50, 34, C.yellow]] },
    'al-gravfields': { quiz: { q: 'An asteroid orbits the Sun at 4 AU. What is its period?', a: ['4 years', '8 years', '16 years', '64 years'], c: 1, ex: 'In years and AU, T² = r³ = 64, so T = 8 years.' }, try: 'Put your planet at 4 AU: the readout should say 8 years.' },
    'y1-wave-eq': { quiz: { q: 'A string has tension 100 N and mass per length 0.01 kg/m. What is the wave speed?', a: ['10 m/s', '100 m/s', '1000 m/s', '1 m/s'], c: 1, ex: 'v = √(T/μ) = √(100/0.01) = √10⁴ = 100 m/s.' }, try: 'Quadruple the tension: the pulses move twice as fast.', texs: [[8.3, '\\dfrac{\\partial^2 y}{\\partial t^2}=v^2\\dfrac{\\partial^2 y}{\\partial x^2}', 250, 285, 28, C.yellow]] },
    'y1-gauss': { quiz: { q: 'A closed surface encloses +3 nC and −1 nC, and a +5 nC charge sits just outside. What is the flux through the surface?', a: ['7 nC/ε₀', '2 nC/ε₀', '8 nC/ε₀', 'zero'], c: 1, ex: 'Only enclosed charge counts: (3 − 1) nC / ε₀. Lines from the outside charge enter and leave, so they cancel.' }, try: 'Set the shape distortion to 1: the crossing count stays fixed.', texs: [[9.4, '\\oint \\vec E\\cdot d\\vec A = \\dfrac{q}{\\varepsilon_0}', 780, 486, 30, C.green]] },
    'y1-sr': { quiz: { q: 'What is γ for v = 0.6c?', a: ['1.6', '1.25', '0.8', '1.67'], c: 1, ex: 'γ = 1/√(1 − 0.36) = 1/√0.64 = 1/0.8 = 1.25.' }, try: 'Push β to 0.95 and count ticks: the moving clock falls behind by a factor of about 3.' },
    'y2-lagrangian': { quiz: { q: 'For the true path between two fixed events, which quantity is stationary under small variations?', a: ['The total energy', 'The action ∫(T − V) dt', 'The elapsed time', 'The momentum'], c: 1, ex: 'Hamilton’s principle: the first-order change in the action S = ∫L dt vanishes for the physical path.' }, try: 'Switch the wiggle shape to 3: the valley in S(ε) gets much steeper, but its bottom stays at ε = 0.', texs: [[3, 'S=\\int_{t_1}^{t_2}(T-V)\\,dt', 330, 46, 30, C.blue]] },
    'y2-boltzmann': { quiz: { q: 'In the Boltzmann distribution, what is n(E + k_BT) / n(E)?', a: ['1/2', '1/e', 'e', 'k_BT'], c: 1, ex: 'n ∝ e^{−E/k_BT}, so raising E by k_BT multiplies n by e^{−1} ≈ 0.37.' }, try: 'Set the mean energy to 1 quantum: the exponential becomes steeper (a colder system).' },
    'y2-infinite-well': { quiz: { q: 'If the box width doubles, what happens to the ground-state energy?', a: ['It doubles', 'It halves', 'It falls to a quarter', 'It is unchanged'], c: 2, ex: 'E₁ ∝ 1/L², so doubling L divides E₁ by 4.' }, try: 'Switch on the superposition and watch |ψ|² slosh from wall to wall.' },
    'y3-tunnelling': { quiz: { q: 'For a thick barrier (κa ≫ 1), roughly what happens to T when the width a doubles?', a: ['It halves', 'It is roughly squared', 'It doubles', 'It stays the same'], c: 1, ex: 'T ∝ e^{−2κa}; doubling a gives e^{−4κa} = (e^{−2κa})², ignoring the order-one prefactor.' }, try: 'Raise the width from 1 to 4 and watch the transmitted percentage collapse.', texs: [[8, 'T\\approx \\dfrac{16E(V_0-E)}{V_0^2}e^{-2\\kappa a}', 730, 210, 28, C.yellow]] },
    'y3-equivalence': { quiz: { q: 'Pound and Rebka sent gamma rays up a 22.5 m tower. Roughly what fractional frequency shift did they measure?', a: ['2.5 × 10⁻¹⁵', '2.5 × 10⁻⁹', '10⁻⁶', '0.25'], c: 0, ex: 'Δf/f = gh/c² = 9.8 × 22.5 / (3 × 10⁸)² ≈ 2.5 × 10⁻¹⁵.' }, try: 'Raise g: the light beam and the dropped ball still fall exactly together.' },
    'y4-kg': { quiz: { q: 'In natural units, what is the lowest angular frequency a Klein–Gordon wave of mass m can have?', a: ['0', 'm', 'm²', 'c/m'], c: 1, ex: 'ω² = k² + m² ≥ m², so the spectrum has a gap: no mode oscillates slower than ω = m.' }, try: 'Set m = 0: the pulse splits cleanly into two pieces travelling at c without spreading.' },
    'y4-friedmann': { quiz: { q: 'For a flat, matter-only universe, what is its age in units of 1/H₀?', a: ['1', '2/3', '1/2', '3/2'], c: 1, ex: 'a ∝ t^{2/3} gives H = ȧ/a = 2/(3t), so t₀ = 2/(3H₀).' }, try: 'Set Ω_m = 3: the universe reaches a maximum size and recollapses.' }
  };
  Object.entries(X).forEach(([id, v]) => { const t = T[id]; if (!t) return; t.quiz = v.quiz; t.try = v.try; if (v.texs) t.anim.texs = v.texs; });

  // Replace a few hand-drawn formula labels with real LaTeX written on screen.
  const swap = (id, fnText) => { const a = T[id] && T[id].anim; if (!a) return; const old = a.draw; a.draw = function (s, t, dt) { s._swap = true; old(s, t, dt); fnText(s, t); }; };
  swap('gcse-suvat', (s, t) => s.tex('s = ut + \\tfrac12 a t^2', 650, 338, { align: 'left', size: 32, c: C.yellow, p: (t - 10.5) / 1.2 }));
  swap('gcse-energy', (s, t) => s.tex('\\tfrac12 mv^2 = mgh \\;\\Rightarrow\\; v=\\sqrt{2gh}', 40, 466, { align: 'left', size: 28, c: C.yellow, p: (t - 11.2) / 1.4 }));
  swap('al-shm', (s, t) => s.tex('x(t) = A\\cos\\omega t', 930, 70, { align: 'right', size: 30, c: C.yellow, p: (t - 9.4) / 1.1 }));
  swap('al-circular', (s, t) => s.tex('a = \\dfrac{v^2}{r} = \\omega^2 r', 900, 360, { align: 'right', size: 30, c: C.red, p: (t - 9.6) / 1.2 }));
  swap('y1-sr', (s, t) => s.tex('\\gamma = \\dfrac{1}{\\sqrt{1-v^2/c^2}}', 360, 456, { size: 30, c: C.yellow, p: (t - 11.4) / 1.3 }));
  swap('y2-infinite-well', (s, t) => s.tex('E_n = \\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}', 480, 512, { size: 26, c: C.ink, p: (t - 7.4) / 1.3 }));
  swap('y4-kg', (s, t) => { s.tex('(\\partial_t^2 - \\partial_x^2 + m^2)\\,\\phi = 0', 50, 400, { align: 'left', size: 28, c: C.yellow, p: (t - 8.2) / 1.3 }); s.tex('\\omega^2 = k^2 + m^2', 50, 510, { align: 'left', size: 26, c: C.ink, p: (t - 11.4) / 1.2 }); });
  swap('y3-equivalence', (s, t) => s.tex('\\dfrac{\\Delta f}{f} = -\\dfrac{gh}{c^2}', 690, 468, { size: 30, c: C.yellow, p: (t - 11.4) / 1.2 }));

  // Electromagnetic wave, rebuilt as a rotating 3D scene.
  if (T['y2-em-waves']) T['y2-em-waves'].anim = {
    duration: 14, alt: 'A 3D plane electromagnetic wave with perpendicular E and B fields, slowly rotating.',
    params: [{ id: 'lam', label: 'Wavelength λ', unit: '', min: 1.4, max: 4.2, step: 0.1, value: 2.6 }],
    beats: [[0, 'The electric field E oscillates in one plane (yellow).'], [4, 'The magnetic field B oscillates at right angles, in step with E (blue).'], [8, 'Each field’s change creates the other: the pair travels along x by itself.'], [11, 'Its speed is fixed by two lab constants: c = 1/√(μ₀ε₀).']],
    draw(s, t) {
      const lam = s.p.lam, k = (2 * Math.PI) / lam, w = k * 1.1, A = 1.15, x0 = -4.2, x1 = 4.2;
      s.cam({ th: -0.62 + 0.22 * Math.sin(t * 0.18), ph: 0.3 + 0.06 * Math.sin(t * 0.11), s: 100, cx: 470, cy: 300, d: 14 });
      s.arrow3([x0 - 0.3, 0, 0], [x1 + 0.6, 0, 0], { c: C.greyB, w: 2, head: 11 });
      const lx = s.P(x1 + 0.9, 0, 0); s.math('x', lx[0], lx[1], { size: 22, c: C.greyB, align: 'center' });
      const xs = []; for (let x = x0; x <= x1 + 1e-9; x += 0.14) xs.push(x);
      const ph = (x) => Math.sin(k * x - w * t);
      const aB = s.in(t, 4, 1.2), aE = s.in(t, 0, 1.2);
      s.alpha(aB, () => { xs.forEach((x) => s.arrow3([x, 0, 0], [x, A * 0.85 * ph(x), 0], { c: C.blue, w: 1.6, head: 7 })); s.poly3(xs.map((x) => [x, A * 0.85 * ph(x), 0]), { c: C.blue, w: 2.4 }); const q = s.P(x0, A * 1.05, 0); s.tex('\\vec B', q[0] - 14, q[1] + 18, { size: 30, c: C.blue }); });
      s.alpha(aE, () => { xs.forEach((x) => s.arrow3([x, 0, 0], [x, 0, A * ph(x)], { c: C.yellow, w: 1.6, head: 7 })); s.poly3(xs.map((x) => [x, 0, A * ph(x)]), { c: C.yellow, w: 2.8 }); const q = s.P(x0, 0, A * 1.15); s.tex('\\vec E', q[0] - 6, q[1] - 6, { size: 30, c: C.yellow }); });
      const xc = ((((t * 1.1) % lam) + lam) % lam) + x0;
      s.alpha(s.in(t, 8, 1), () => { const a = s.P(xc, 0, 0); s.glow(a[0], a[1], 26, C.ink, 0.35); });
      s.texAt('\\nabla\\times\\vec E = -\\dfrac{\\partial \\vec B}{\\partial t}', 780, 58, 8, { size: 25, c: C.blue });
      s.texAt('\\nabla\\times\\vec B = \\mu_0\\varepsilon_0\\dfrac{\\partial \\vec E}{\\partial t}', 780, 142, 8.6, { size: 25, c: C.yellow });
      s.texAt('c = \\dfrac{1}{\\sqrt{\\mu_0\\varepsilon_0}} \\approx 2.998\\times 10^8\\ \\text{m/s}', 480, 500, 11, { size: 30, c: C.ink });
    }
  };
  if (T['y2-em-waves']) { T['y2-em-waves'].quiz = { q: 'In a plane EM wave in vacuum, what is the ratio |E| / |B|?', a: ['1', 'c', '1/c', 'μ₀ε₀'], c: 1, ex: 'Faraday’s law for the plane wave gives B = E/c, so |E|/|B| = c.' }; T['y2-em-waves'].try = 'Shorten λ: E and B stay perpendicular and in step at every point.'; }
})();
