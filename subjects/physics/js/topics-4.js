/* Twistor — University Year 3 and Year 4 topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw;
  const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);

  /* ------------------------------------------------------------ Y3 */
  function tunnelSetup(s) {
    const N = 1800, dx = 0.125, dt = 0.05, k0 = 1.5, E = (k0 * k0) / 2, V0 = E / s.p.ratio, a = s.p.w, xc = 120, x0 = 60, sg = 7;
    const V = new Float64Array(N), re = new Float64Array(N), im = new Float64Array(N);
    let nrm = 0;
    for (let j = 0; j < N; j++) {
      const x = j * dx; V[j] = x >= xc - a / 2 - 1e-9 && x < xc + a / 2 - 1e-9 ? V0 : 0;
      const env = Math.exp(-((x - x0) ** 2) / (2 * sg * sg)); re[j] = env * Math.cos(k0 * x); im[j] = env * Math.sin(k0 * x); nrm += env * env * dx;
    }
    const sc = 1 / Math.sqrt(nrm); for (let j = 0; j < N; j++) { re[j] *= sc; im[j] *= sc; }
    const al = dt / (4 * dx * dx), cpr = new Float64Array(N), cpi = new Float64Array(N), ir = new Float64Array(N), ii = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      let mr = 1, mi = 2 * al + (dt * V[j]) / 2;
      if (j > 0) { mr -= al * cpi[j - 1]; mi -= -al * cpr[j - 1]; }
      const d = mr * mr + mi * mi; ir[j] = mr / d; ii[j] = -mi / d;
      cpr[j] = al * ii[j]; cpi[j] = -al * ir[j];
    }
    const kap = Math.sqrt(2 * Math.max(1e-9, V0 - E)), sh = Math.sinh(kap * a);
    const Tk = (k) => { const e = (k * k) / 2; if (Math.abs(e - V0) < 1e-9) return 1 / (1 + (V0 * a * a) / 2); if (e < V0) { const q = Math.sqrt(2 * (V0 - e)), h = Math.sinh(q * a); return 1 / (1 + (V0 * V0 * h * h) / (4 * e * (V0 - e))); } const q = Math.sqrt(2 * (e - V0)), h = Math.sin(q * a); return 1 / (1 + (V0 * V0 * h * h) / (4 * e * (e - V0))); };
    let num = 0, den = 0; for (let k = k0 - 4 / sg; k <= k0 + 4 / sg; k += 0.002) { const wt = Math.exp(-((k - k0) ** 2) * sg * sg); num += wt * Tk(k); den += wt; }
    s.state = { N, dx, dt, al, V, re, im, cpr, cpi, ir, ii, br: new Float64Array(N), bi: new Float64Array(N), time: 0, hold: 0, E, V0, a, xc, kap, Tex: 1 / (1 + (V0 * V0 * sh * sh) / (4 * E * (V0 - E))), Tavg: num / den };
  }
  function tunnelStep(st) {
    const { N, dt, al, V, re, im, cpr, cpi, ir, ii, br, bi } = st;
    for (let j = 0; j < N; j++) {
      const c = 2 * al + (dt * V[j]) / 2, sr = (j > 0 ? re[j - 1] : 0) + (j < N - 1 ? re[j + 1] : 0), si = (j > 0 ? im[j - 1] : 0) + (j < N - 1 ? im[j + 1] : 0);
      let r = re[j] + c * im[j] - al * si, i = im[j] - c * re[j] + al * sr;
      if (j > 0) { r -= al * bi[j - 1]; i += al * br[j - 1]; }
      br[j] = r * ir[j] - i * ii[j]; bi[j] = r * ii[j] + i * ir[j];
    }
    re[N - 1] = br[N - 1]; im[N - 1] = bi[N - 1];
    for (let j = N - 2; j >= 0; j--) { const xr = re[j + 1], xi = im[j + 1]; re[j] = br[j] - (cpr[j] * xr - cpi[j] * xi); im[j] = bi[j] - (cpr[j] * xi + cpi[j] * xr); }
    st.time += dt;
  }
  WL.tunnel = { setup: tunnelSetup, step: tunnelStep };

  WL.topic({
    id: 'y3-tunnelling', stage: 'y3', strand: 'Q', title: 'Quantum Tunnelling',
    summary: 'A particle can cross a barrier it classically cannot climb. The transmission falls off as e^{−2κa}.',
    maths: [['Complex exponentials', 'e^{ikx}, plane waves'], ['Linear systems', 'Matching ψ and ψ′ at boundaries'], ['Hyperbolic functions', 'sinh, cosh'], ['Numerical PDEs', 'Crank–Nicolson time stepping']],
    idea: 'Inside the barrier ψ doesn’t oscillate; it decays exponentially. If the barrier is thin, ψ is still nonzero on the far side, and so is the <em>probability</em> of finding the particle there.',
    anim: {
      duration: 12, stateful: true, alt: 'A quantum wavepacket hitting a barrier: most reflects and a fraction tunnels through.',
      params: [{ id: 'ratio', label: 'Energy ratio E/V₀', unit: '', min: 0.5, max: 0.98, step: 0.01, value: 0.85 }, { id: 'w', label: 'Barrier width a', unit: '', min: 0.5, max: 6, step: 0.25, value: 2 }],
      beats: [[0, 'A wavepacket with energy E below the barrier height V₀ moves right.'], [3, 'Classically it must bounce back: 100% reflection.'], [5, 'Quantum: inside the barrier ψ decays but doesn’t reach zero.'], [8, 'A fraction appears on the far side. Thicker barrier = exponentially less.']],
      setup: tunnelSetup,
      step(s, dt) {
        const st = s.state; if (s.t < 1) return;
        if (st.time > 100) { st.hold += dt; if (st.hold > 2.5) tunnelSetup(s); return; }
        const n = Math.max(1, Math.round(dt * 60 * 6)); for (let k = 0; k < n; k++) tunnelStep(st);
      },
      draw(s, t) {
        const st = s.state, { N, dx, re, im, E, V0, a, xc } = st, X = (x) => 50 + x * 3.82, base = 430, hE = 130, hV = hE * (V0 / E);
        s.rect(X(xc - a / 2), base - hV, Math.max(2, X(xc + a / 2) - X(xc - a / 2)), hV, { c: C.dim, fill: C.grey, fa: 0.45, w: 2 });
        s.txt('V₀', X(xc + a / 2) + 8, base - hV + 4, { c: C.dim, size: 17 });
        s.line(X(0), base - hE, X(225), base - hE, { c: C.red, w: 1.5, dash: [6, 6] }); s.txt('E', X(0) - 14, base - hE, { c: C.red, size: 17 });
        s.line(X(0), base, X(225), base, { c: C.dim, w: 1.5 });
        const pr = [], pd = [[X(0), base]];
        for (let j = 0; j < N; j += 3) { const x = j * dx; pr.push([X(x), base - re[j] * 260]); pd.push([X(x), base - (re[j] ** 2 + im[j] ** 2) * 2600]); }
        pd.push([X((N - 1) * dx), base]);
        s.poly(pr, { c: C.blue, w: 1.2, a: 0.55 });
        s.poly(pd, { c: C.yellow, w: 2.5, fill: C.yellow, fa: 0.3 });
        let Tr = 0, Rf = 0; const jr = Math.ceil((xc + a / 2) / dx), jl = Math.floor((xc - a / 2) / dx) - 1;
        for (let j = 0; j < N; j++) { const p = (re[j] ** 2 + im[j] ** 2) * dx; if (j > jr) Tr += p; else if (j < jl) Rf += p; }
        s.txt(`transmitted: ${(100 * Tr).toFixed(2)} %`, 50, 50, { c: C.yellow, size: 21 });
        s.txt(`reflected: ${(100 * Rf).toFixed(1)} %`, 50, 82, { c: C.ink, size: 19 });
        s.txt(`theory: plane wave at E₀ ${(100 * st.Tex).toFixed(2)} %,  averaged over the packet ${(100 * st.Tavg).toFixed(2)} %`, 50, 114, { c: C.dim, size: 16, sans: true });
        s.txt(`κa = ${(st.kap * a).toFixed(2)}`, 910, 50, { c: C.ink, size: 19, align: 'right' });
        s.txt('|ψ|² (yellow), Re ψ (blue)', 910, 82, { c: C.dim, size: 14, align: 'right', sans: true });
        s.txt('units: ħ = m = 1, Crank–Nicolson on 1800 grid points', 910, 520, { c: C.dim, size: 13, align: 'right', sans: true });
        s.alpha(s.in(t, 3, 1) * (1 - s.in(t, 6, 1)), () => s.txt('classical ball: always reflected', X(xc), base - hV - 20, { c: C.red, size: 16, align: 'center', sans: true }));
      }
    },
    steps: [
      { say: 'Barrier of height V₀ for 0 < x < a, with energy E < V₀. Inside the barrier:', tex: R`\psi'' = \kappa^2\psi, \qquad \kappa = \frac{\sqrt{2m(V_0 - E)}}{\hbar}`, why: 'The Schrödinger equation with V₀ > E flips the sign compared with free space: instead of oscillating, ψ grows or decays exponentially.' },
      { say: 'Write the solution in each region.', tex: R`\psi(x) = \begin{cases} e^{ikx} + r\,e^{-ikx} & x < 0\\ C\,e^{\kappa x} + D\,e^{-\kappa x} & 0 < x < a\\ t\,e^{ikx} & x > a \end{cases}`, why: 'Left: incident plus reflected wave. Right: transmitted wave only, because nothing comes in from the right. k = √(2mE)/ħ outside.' },
      { say: 'Match ψ and ψ′ at x = 0 and x = a.', tex: R`\text{4 continuity conditions} \;\Longrightarrow\; \text{4 equations for } r,\,C,\,D,\,t`, why: 'The Schrödinger equation is second order and V is finite, so ψ and its derivative must both be continuous.' },
      { say: 'Solve the linear system for the transmission probability.', tex: R`T = |t|^2 = \left[1 + \frac{V_0^2\,\sinh^2(\kappa a)}{4E\,(V_0 - E)}\right]^{-1}`, why: 'Tedious but direct algebra. Transmitted ÷ incident probability current is |t|² because k is the same on both sides of the barrier.' },
      { say: 'For a thick barrier (κa ≫ 1):', tex: R`\sinh\kappa a \approx \tfrac12 e^{\kappa a} \;\Longrightarrow\; T \approx \frac{16E(V_0 - E)}{V_0^2}\,e^{-2\kappa a}`, why: 'The exponential dominates; the prefactor is of order one. Doubling the width squares the suppression factor.' }
    ],
    result: R`T \approx \frac{16E(V_0-E)}{V_0^2}\,e^{-2\kappa a}, \qquad \kappa = \frac{\sqrt{2m(V_0-E)}}{\hbar}`,
    assumptions: ['The formula is for a single energy (a plane wave). A real packet contains a spread of momenta; because T rises steeply with energy, its faster components tunnel far more easily, so the right comparison is T averaged over the packet. The animation shows both numbers next to the simulated result.', 'The simulation uses Crank–Nicolson, which is exactly unitary, so total probability stays 1. The finite grid (spacing 0.125) slightly lowers the kinetic energy, so the simulated transmission sits a little below the continuum theory.', 'How long tunnelling “takes” is subtle and still debated (the Hartman effect); the transmission probability is not.']
  });

  WL.topic({
    id: 'y3-equivalence', stage: 'y3', strand: 'S', title: 'The Equivalence Principle',
    summary: 'Gravity is locally indistinguishable from acceleration. That alone predicts that light bends and clocks run slow in gravity.',
    maths: [['Kinematics', 'Δy = ½gt²'], ['First-order Doppler shift', 'Δf/f ≈ −Δv/c'], ['Gravitational potential', 'ΔΦ = gh'], ['Frames of reference', 'Inertial vs accelerating']],
    idea: 'In a box accelerating through deep space, a light beam crossing the box hits the far wall lower: the floor rose to meet it. If gravity is equivalent to acceleration, <em>light must fall in gravity too</em>.',
    anim: {
      duration: 14, alt: 'A light beam crossing an accelerating box, straight from outside and curved from inside.',
      params: [{ id: 'g', label: 'Acceleration g (exaggerated)', unit: '×', min: 0.5, max: 3, step: 0.1, value: 2 }],
      beats: [[0, 'A box accelerates upward at g in deep space, far from any mass.'], [4, 'Outside view: the light goes straight. The box moves up underneath it.'], [8, 'Inside view: the light bends down, exactly like a dropped ball.'], [11, 'If acceleration ≡ gravity, then gravity bends light and shifts its frequency: Δf/f = −gh/c².']],
      draw(s, t) {
        const acc = 24 * s.p.g, c = 120, wb = 260, cross = wb / c, tau = WL.cyc(t, cross, 1), rise = 0.5 * acc * tau * tau, eY = 60;
        s.txt('Outside: inertial frame', 250, 34, { c: C.ink, size: 19, align: 'center', sans: true });
        s.txt('Inside the box', 690, 34, { c: C.ink, size: 19, align: 'center', sans: true, a: s.in(t, 7, 1) });
        const top = 270 - rise;
        s.rect(120, top, wb, 200, { c: C.blue, w: 3, fill: C.blue, fa: 0.06 });
        for (let i = 0; i < 4; i++) { const x = 150 + i * 65; s.poly([[x, top + 200], [x + 16, top + 200], [x + 8, top + 228 + 10 * Math.sin(t * 20 + i)]], { c: C.orange, fill: C.orange, fa: 0.8, close: true, w: 1 }); }
        s.arrow(400, top + 150, 400, top + 80, { c: C.green, w: 3 }); s.math('a = g', 410, top + 110, { c: C.green, size: 18 });
        const yIn = 270 + eY;
        s.alpha(s.in(t, 1, 1), () => { s.line(120, yIn, 120 + c * tau, yIn, { c: C.yellow, w: 3 }); s.dot(120 + c * tau, yIn, { c: C.yellow, r: 6 }); });
        s.alpha(s.in(t, 4, 1), () => { s.line(110, yIn, 390, yIn, { c: C.yellow, w: 1, dash: [3, 6], a: 0.5 }); s.txt('straight line in space', 250, 510, { c: C.yellow, size: 16, align: 'center', sans: true }); });
        s.alpha(s.in(t, 7, 1), () => {
          const bx = 560, btop = 160;
          s.rect(bx, btop, wb, 200, { c: C.blue, w: 3, fill: C.blue, fa: 0.06 });
          const pts = []; for (let i = 0; i <= 60; i++) { const tt = (tau * i) / 60; pts.push([bx + c * tt, btop + eY + 0.5 * acc * tt * tt]); }
          s.poly(pts, { c: C.yellow, w: 3 }); s.dot(bx + c * tau, btop + eY + rise, { c: C.yellow, r: 6 });
          const ballY = btop + eY + rise; s.circle(bx + 24, ballY, 9, { c: C.red, fill: C.red, fa: 0.6, w: 2 });
          s.line(bx + 34, ballY, bx + c * tau - 6, ballY, { c: C.ink, w: 1, dash: [3, 5], a: 0.6 });
          s.arrow(bx + wb + 26, btop + 60, bx + wb + 26, btop + 130, { c: C.green, w: 3 }); s.math('g', bx + wb + 36, btop + 96, { c: C.green, size: 20 });
          s.txt('light and a dropped ball fall the same distance', 690, 400, { c: C.ink, size: 16, align: 'center', sans: true });
          s.txt(`drop across the box: Δy = gw²/2c² = ${f1(rise)} px`, 690, 428, { c: C.dim, size: 15, align: 'center', sans: true });
        });
        s.alpha(s.in(t, 11, 1), () => { s.txt('Pound & Rebka 1959: h = 22.5 m ⇒ 2.5 × 10⁻¹⁵, measured', 690, 510, { c: C.ink, size: 15, align: 'center', sans: true }); });
      }
    },
    steps: [
      { say: 'Weak equivalence principle: inertial mass equals gravitational mass.', tex: R`m_i\,\vec a = m_g\,\vec g \;\Longrightarrow\; \vec a = \vec g`, why: 'So every body falls with the same acceleration. The MICROSCOPE satellite (final results 2022) confirmed this to about 1 part in 10¹⁵.' },
      { say: 'Einstein’s equivalence principle.', tex: R`\text{uniform gravity } \vec g \;\equiv\; \text{a frame accelerating at } -\vec g \quad(\text{locally})`, why: 'Inside a small closed box no local experiment can tell gravity from acceleration. Einstein extended this from mechanics to all of physics, including light.' },
      { say: 'Light crosses an accelerating box of width w.', tex: R`t = \frac{w}{c}, \qquad \Delta y = \tfrac12 g t^2 = \frac{g\,w^2}{2c^2}`, why: 'In the outside inertial frame the light goes straight while the floor accelerates up by ½gt². Seen from inside, the beam falls by that amount, so by equivalence light must fall in a gravitational field too.' },
      { say: 'Send light from the floor to the ceiling, height h.', tex: R`\Delta v = g\,\frac{h}{c}`, why: 'The light takes h/c to arrive, during which the ceiling picks up speed gh/c relative to the emitter’s velocity at emission.' },
      { say: 'First-order Doppler shift.', tex: R`\frac{\Delta f}{f} = -\frac{\Delta v}{c} = -\frac{gh}{c^2}`, why: 'The receiver is moving away from where the light was emitted, so it sees a lower frequency: a redshift on the way up.' },
      { say: 'Gravitational redshift, by equivalence.', tex: R`\frac{\Delta f}{f} = -\frac{\Delta\Phi}{c^2}`, why: 'gh is the change in gravitational potential ΔΦ. Pound and Rebka measured this over 22.5 m in 1959: about 2.5 × 10⁻¹⁵, in agreement.' }
    ],
    result: R`\frac{\Delta f}{f} = -\frac{\Delta\Phi}{c^2}, \qquad \text{light bends in a gravitational field}`,
    assumptions: ['Local only. Real gravity is non-uniform: tidal effects cannot be removed by any single accelerating frame. That leftover is exactly spacetime curvature.', 'First order in gh/c² and v/c. Near a mass M the full general-relativistic result is f_∞/f = √(1 − 2GM/rc²).', 'Contradiction with data: this equivalence-principle argument gives only half the observed bending of starlight by the Sun (0.87″). General relativity’s spatial curvature supplies the other half, total 1.75″, confirmed by Eddington (1919) and to about 10⁻⁴ by modern radio interferometry.']
  });

  /* ------------------------------------------------------------ Y4 */
  WL.topic({
    id: 'y4-kg', stage: 'y4', strand: 'Q', title: 'Fields as Oscillators: Klein–Gordon',
    summary: 'Make E² = p²c² + m²c⁴ into a wave equation and you get the Klein–Gordon field. A chain of masses and springs is the same thing on a lattice.',
    maths: [['Relativistic energy–momentum', 'p^μ p_μ = m²c²'], ['Operator substitution', 'E → iħ∂ₜ, p → −iħ∇'], ['Normal modes', 'Plane-wave ansatz e^{i(kx − ωt)}'], ['Discrete Laplacian', '(u_{j+1} − 2u_j + u_{j−1})/a²']],
    idea: 'A field is a mattress of coupled oscillators. Neighbour springs make waves; tying every mass to its rest position adds a <em>mass term</em>, which opens a frequency gap and makes waves slower and dispersive.',
    anim: {
      duration: 14, stateful: true, alt: 'A chain of coupled masses carrying a pulse that splits and spreads, with its dispersion relation.',
      params: [{ id: 'm', label: 'Mass m (ħ = c = 1)', unit: '', min: 0, max: 1.5, step: 0.05, value: 0.5 }],
      beats: [[0, 'A row of masses joined by springs: a field sampled on a lattice.'], [4, 'Each mass is also tied to its rest position (faint lines). That is the m² term.'], [8, 'With m = 0 a pulse splits and travels at c. With m > 0 it rings and spreads.'], [11, 'Dispersion ω² = k² + m²: a frequency gap m and group velocity below c.']],
      setup(s) { const N = 200, u = new Float64Array(N), v = new Float64Array(N); for (let j = 0; j < N; j++) u[j] = Math.exp(-((j - 100) ** 2) / (2 * 36)); s.state = { N, u, v, a: new Float64Array(N) }; },
      step(s, dt) {
        if (s.t < 1) return;
        const st = s.state, { N, u, v, a } = st, m2 = s.p.m ** 2, h = 0.125, n = Math.max(1, Math.round(dt * 60 * 6));
        const acc = () => { for (let j = 0; j < N; j++) a[j] = u[(j + 1) % N] - 2 * u[j] + u[(j - 1 + N) % N] - m2 * u[j]; };
        acc();
        for (let k = 0; k < n; k++) { for (let j = 0; j < N; j++) { v[j] += 0.5 * h * a[j]; u[j] += h * v[j]; } acc(); for (let j = 0; j < N; j++) v[j] += 0.5 * h * a[j]; }
      },
      draw(s, t) {
        const { N, u, v } = s.state, m = s.p.m, X = (j) => 60 + j * 4.2, base = 220, A = 110;
        s.line(X(0), base, X(N - 1), base, { c: C.dim, w: 1, dash: [4, 6] });
        if (m > 0) s.alpha(s.in(t, 4, 1) * Math.min(1, 0.25 + m * 0.5), () => { for (let j = 0; j < N; j += 2) s.line(X(j), base, X(j), base - u[j] * A, { c: C.teal, w: 1, a: 0.5 }); });
        const pts = []; for (let j = 0; j < N; j++) pts.push([X(j), base - u[j] * A]);
        s.poly(pts, { c: C.blue, w: 2 });
        for (let j = 0; j < N; j += 2) s.dot(X(j), base - u[j] * A, { c: C.ink, r: 2.2 });
        let E = 0; for (let j = 0; j < N; j++) { const du = u[(j + 1) % N] - u[j]; E += 0.5 * v[j] * v[j] + 0.5 * du * du + 0.5 * m * m * u[j] * u[j]; }
        s.txt(`lattice energy: ${E.toFixed(3)} (conserved)`, 50, 440, { c: C.ink, size: 18 });
        s.txt('periodic chain of 200 sites, spacing a = 1', 50, 470, { c: C.dim, size: 14, sans: true });
        const B = s.axes({ x0: 580, y0: 500, w: 310, h: 160, xr: [0, Math.PI], yr: [0, 2.6], xt: [0, 3, 1], yt: [0, 2, 1], xl: 'k', yl: 'ω' });
        s.alpha(s.in(t, 11, 1), () => {
          B.draw(1); B.fn((k) => Math.sqrt(m * m + k * k), 0, Math.PI, { c: C.grey, w: 2, dash: [5, 6] });
          B.fn((k) => Math.sqrt(m * m + 4 * Math.sin(k / 2) ** 2), 0, Math.PI, { c: C.yellow, w: 3 });
          if (m > 0.05) { s.line(B.X(0), B.Y(m), B.X(0.6), B.Y(m), { c: C.red, w: 2, dash: [3, 4] }); s.txt('gap = m', B.X(0.65), B.Y(m), { c: C.red, size: 14, sans: true }); }
          s.txt('lattice (yellow) vs continuum (grey)', 890, 320, { c: C.dim, size: 13, align: 'right', sans: true });
        });
      }
    },
    steps: [
      { say: 'Start from the relativistic energy–momentum relation.', tex: R`E^2 = p^2c^2 + m^2c^4`, why: 'This is the invariant length of the four-momentum: p^μ p_μ = m²c². It holds in every inertial frame.' },
      { say: 'Quantise with the standard substitution.', tex: R`E \to i\hbar\,\frac{\partial}{\partial t}, \qquad \vec p \to -i\hbar\,\nabla`, why: 'The same rule turns E = p²/2m into the Schrödinger equation. Acting on a plane wave e^{i(k·x − ωt)}, it returns E = ħω and p = ħk.' },
      { say: 'Apply both sides as operators on a field φ.', tex: R`-\hbar^2\frac{\partial^2\phi}{\partial t^2} = -\hbar^2c^2\nabla^2\phi + m^2c^4\phi`, why: 'E² becomes (iħ∂ₜ)² = −ħ²∂ₜ², and p² becomes (−iħ∇)² = −ħ²∇².' },
      { say: 'In natural units (ħ = c = 1):', tex: R`\left(\partial_t^2 - \nabla^2 + m^2\right)\phi = 0 \quad\equiv\quad (\Box + m^2)\,\phi = 0`, why: '□ = ∂^μ∂_μ is Lorentz invariant, so the equation looks the same in every frame.' },
      { say: 'Mechanical model: masses at spacing a joined by springs, each also tied to its rest position.', tex: R`\ddot u_j = \frac{c^2}{a^2}\left(u_{j+1} - 2u_j + u_{j-1}\right) - m^2 u_j`, why: 'Neighbour springs produce the discrete Laplacian, which becomes ∂²/∂x² as a → 0. The extra spring pulls every mass back towards zero independently: that is the m² term.' },
      { say: 'Try a plane wave to find the normal modes.', tex: R`u_j \propto e^{i(kja - \omega t)} \;\Longrightarrow\; \omega^2 = m^2 + \frac{4c^2}{a^2}\sin^2\frac{ka}{2} \;\xrightarrow{a\to0}\; \omega^2 = c^2k^2 + m^2`, why: 'e^{ika} − 2 + e^{−ika} = −4 sin²(ka/2). No mode has ω below m: mass is literally a frequency gap. The group velocity dω/dk = c²k/ω is less than c, so massive packets lag and spread.' }
    ],
    result: R`(\Box + m^2)\,\phi = 0, \qquad \omega^2 = c^2k^2 + m^2`,
    assumptions: ['As a single-particle wave equation Klein–Gordon fails: its conserved density ∝ Im(φ*∂ₜφ) is not positive-definite, and negative-energy solutions appear. Reinterpreted as a quantum field, those become antiparticles.', 'The chain is classical. Quantising each normal mode as a harmonic oscillator gives particles as quanta of the modes: the core idea of quantum field theory.', 'The lattice breaks Lorentz invariance for k ~ 1/a (compare the yellow and grey curves). The continuum limit restores it.']
  });

  const fried = {};
  function friedCurve(Om) {
    const key = Om.toFixed(2); if (fried[key]) return fried[key];
    const f = (a, ad) => [ad, -Om / (2 * a * a)];
    const run = (h) => {
      let a = 1, ad = 1, tt = 0; const out = [[0, 1, 1]];
      for (let i = 0; i < 4000; i++) {
        const k1 = f(a, ad), k2 = f(a + (h / 2) * k1[0], ad + (h / 2) * k1[1]), k3 = f(a + (h / 2) * k2[0], ad + (h / 2) * k2[1]), k4 = f(a + h * k3[0], ad + h * k3[1]);
        a += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); ad += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); tt += h;
        if (a < 0.02 || tt > 3 || tt < -1.5) break; out.push([tt, a, ad]);
      }
      return out;
    };
    const fw = run(0.004), bw = run(-0.004).reverse();
    return (fried[key] = bw.concat(fw.slice(1)));
  }
  WL.topic({
    id: 'y4-friedmann', stage: 'y4', strand: 'S', title: 'The Expanding Universe',
    summary: 'A homogeneous, isotropic universe obeys the Friedmann equation. Its matter density decides whether it expands forever or recollapses.',
    maths: [['Newtonian gravity & energy', 'Shell theorem'], ['ODEs', 'ä = −Ω_m H₀²/2a²'], ['Scaling arguments', 'ρ ∝ a⁻³'], ['(Rigorous) differential geometry', 'FLRW metric in Einstein’s equations']],
    idea: 'Galaxies sit still on a grid that stretches. Every distance scales by the same factor a(t), which makes Hubble’s law automatic. Gravity then <em>decelerates</em> the stretching.',
    anim: {
      duration: 14, alt: 'A grid of galaxies spreading apart as the scale factor grows, beside curves of a(t) for different densities.',
      params: [{ id: 'Om', label: 'Matter density Ω_m', unit: '', min: 0.1, max: 4, step: 0.05, value: 1 }],
      beats: [[0, 'Galaxies sit at fixed grid positions χ. Space itself stretches by a(t).'], [4, 'Every distance scales: d = a χ, so v = ȧχ = (ȧ/a)d. Hubble’s law, v = Hd.'], [8, 'Gravity slows the expansion: the Friedmann equation.'], [11, 'Ω_m > 1 recollapses; Ω_m < 1 expands forever (matter only, no dark energy).']],
      draw(s, t) {
        const Om = s.p.Om, cur = friedCurve(Om), tb = cur[0][0], te = cur[cur.length - 1][0], span = te - tb;
        const tn = tb + Math.min(span, (t * 0.4) % (span + 0.8));
        let k = 0; while (k < cur.length - 1 && cur[k + 1][0] < tn) k++;
        const [, an, adn] = cur[k], cx = 250, cy = 275, sc = 52, ctx = s.ctx;
        ctx.save(); ctx.beginPath(); ctx.rect(30, 50, 440, 450); ctx.clip();
        for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
          const x = cx + an * sc * i, y = cy - an * sc * j; if (x < 20 || x > 480 || y < 40 || y > 510) continue;
          const hue = (i * 47 + j * 83 + 720) % 360; s.circle(x, y, 3.5, { fill: `hsl(${hue},55%,70%)`, fa: 0.9, stroke: false });
        }
        const gx = cx + an * sc * 2, gy = cy - an * sc * 1;
        s.circle(cx, cy, 9, { c: C.ink, w: 2 }); s.txt('us', cx - 14, cy + 18, { c: C.ink, size: 14, sans: true });
        s.alpha(s.in(t, 4, 1), () => { s.line(cx, cy, gx, gy, { c: C.yellow, w: 2, dash: [5, 5] }); s.circle(gx, gy, 8, { c: C.yellow, w: 2 }); s.txt('d = aχ', (cx + gx) / 2 - 10, (cy + gy) / 2 - 14, { c: C.yellow, size: 17, italic: true }); s.arrow(gx, gy, gx + adn * sc * 2 * 0.5, gy - adn * sc * 0.5, { c: C.green, w: 3 }); });
        ctx.restore();
        s.rect(30, 50, 440, 450, { c: C.dim, w: 1 });
        const A = s.axes({ x0: 580, y0: 470, w: 340, h: 340, xr: [-1.2, 3], yr: [0, 3], xt: [-1, 3, 1], yt: [0, 3, 1], xl: 'H_0t', yl: 'a' });
        A.draw(s.in(t, 0, 1));
        const path = (cv, o) => s.poly(cv.filter((p) => p[1] <= 3.1).map((p) => [A.X(p[0]), A.Y(p[1])]), o);
        s.alpha(s.in(t, 8, 1), () => { [[0.2, C.green, 'Ω=0.2'], [1, C.blue, 'Ω=1'], [3, C.red, 'Ω=3']].forEach(([o, col, lab]) => { const cv = friedCurve(o); path(cv, { c: col, w: 1.5, a: 0.5 }); const last = cv.filter((p) => p[1] <= 3)[Math.max(0, cv.filter((p) => p[1] <= 3).length - 1)]; }); });
        path(cur, { c: C.yellow, w: 3.5 });
        s.dot(A.X(tn), A.Y(an), { c: C.red, r: 7 });
        s.dot(A.X(0), A.Y(1), { c: C.ink, r: 4 }); s.txt('today', A.X(0) + 8, A.Y(1) + 14, { c: C.dim, size: 13, sans: true });
        const kind = Math.abs(Om - 1) < 0.025 ? 'flat (k = 0)' : Om > 1 ? 'closed (k > 0)' : 'open (k < 0)';
        s.txt(`Ωₘ = ${f2(Om)}: ${kind}`, 560, 44, { c: C.yellow, size: 19 });
        s.txt(`a = ${f2(an)}    H/H₀ = ȧ/a = ${f2(adn / an)}`, 560, 72, { c: C.ink, size: 17 });
        s.txt('faint curves: Ω = 0.2 (green), 1 (blue), 3 (red)', 920, 520, { c: C.dim, size: 13, align: 'right', sans: true, a: s.in(t, 8, 1) });
      }
    },
    steps: [
      { say: 'Homogeneous, isotropic expansion: positions scale with a common factor.', tex: R`\vec r(t) = a(t)\,\vec\chi \;\Longrightarrow\; \dot{\vec r} = \frac{\dot a}{a}\,\vec r \equiv H\,\vec r`, why: 'χ are fixed (comoving) coordinates. Differentiate: velocity is proportional to distance. Hubble’s law is automatic, with H = ȧ/a.' },
      { say: 'Newtonian sketch: a test mass m on the edge of a sphere of radius r and density ρ.', tex: R`\tfrac12 m\dot r^2 - \frac{G M m}{r} = E_{\text{tot}}, \qquad M = \tfrac43\pi r^3\rho`, why: 'By the shell theorem only the mass inside matters. The test mass’s total energy is constant.' },
      { say: 'Substitute r = aχ and divide by ½ma²χ².', tex: R`\left(\frac{\dot a}{a}\right)^2 = \frac{8\pi G}{3}\,\rho - \frac{kc^2}{a^2}`, why: 'The constant kc² ≡ −2E_{tot}/(mχ²) has the sign of −E_{tot}: bound (E < 0) means k > 0.' },
      { say: 'Matter dilutes with volume.', tex: R`\rho = \rho_0\,a^{-3}`, why: 'The mass inside a comoving volume is fixed while the volume grows as a³.' },
      { say: 'Introduce the critical density and Ω_m.', tex: R`\rho_c = \frac{3H_0^2}{8\pi G}, \quad \Omega_m = \frac{\rho_0}{\rho_c} \;\Longrightarrow\; H^2 = H_0^2\left(\frac{\Omega_m}{a^3} + \frac{1 - \Omega_m}{a^2}\right)`, why: 'Evaluate step 3 today (a = 1, H = H₀) to fix k: kc² = H₀²(Ω_m − 1). Ω_m > 1: closed, recollapses. Ω_m < 1: open, expands forever (matter only).' },
      { say: 'The acceleration equation, which the animation integrates.', tex: R`\frac{\ddot a}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3p}{c^2}\right) \;\xrightarrow{\;p\,=\,0\;}\; \ddot a = -\frac{\Omega_m H_0^2}{2a^2}`, why: 'Differentiate the Friedmann equation in time and use ρ ∝ a⁻³. With only ordinary matter, gravity always decelerates the expansion. The pressure term is invisible in the Newtonian sketch; it comes from general relativity.' }
    ],
    result: R`H^2 = \frac{8\pi G}{3}\rho - \frac{kc^2}{a^2}, \qquad \frac{\ddot a}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3p}{c^2}\right)`,
    assumptions: ['The Newtonian derivation is a heuristic: it treats a finite sphere in an infinite universe and reads k as an energy. Rigorously, the FLRW metric in Einstein’s equations gives the same equation with k as spatial curvature, and shows that pressure gravitates.', 'Contradiction with data: every curve here decelerates, but supernova distances (1998) and the CMB show the expansion is accelerating. The fit is Ω_m ≈ 0.31 with dark energy Ω_Λ ≈ 0.69 (Planck 2018), which these matter-only models leave out.', 'Homogeneity and isotropy (the cosmological principle) hold only when averaged over scales above roughly 100 Mpc.']
  });
})();
