/* Geodesic: special-function lessons (maths track, stage msf). Live sims use WL.sf (js/sf.js). */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw, SF = () => WL.sf, PI = Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ------------------------------------------------------------ elliptic integrals */
  WL.topic({
    id: 'm-elliptic', stage: 'msf', strand: 'K', title: 'Elliptic Integrals & the Exact Pendulum',
    summary: 'The period of a pendulum at any amplitude, and the perimeter of an ellipse: integrals no elementary function can do.',
    maths: [['Energy conservation', '½ml²θ̇² − mgl cos θ = const'], ['Substitution', 'sin(θ/2) = k sin φ'], ['Binomial series', '(1 − u)^{−1/2} = 1 + u/2 + 3u²/8 + …'], ['Limits & convergence', 'AGM converges quadratically']],
    idea: 'A pendulum’s period is 2π√(l/g) only for tiny swings. Release it from higher up and it takes longer: the exact period is $T = 4\\sqrt{l/g}\\,K(k)$ with $k = \\sin(\\theta_0/2)$, where K is the <em>complete elliptic integral of the first kind</em>. No combination of elementary functions equals K, yet Gauss found a way to compute it to 15 digits in five steps.',
    anim: {
      duration: 16, alt: 'A pendulum swinging at large amplitude beside a ghost obeying the small-angle formula, with a graph of period against amplitude.',
      params: [{ id: 'a', label: 'Amplitude θ₀', unit: '°', min: 5, max: 175, step: 1, value: 120 }],
      beats: [[0, 'Release a pendulum from angle θ₀ (yellow).'], [3, 'The grey ghost follows the small-angle formula, period 2π√(l/g).'], [6.5, 'The real pendulum lingers near the top and falls behind.'], [10, 'Its period: T/T₀ = 2K(k)/π with k = sin(θ₀/2).'], [13, 'Near 180° the period grows without limit: balancing upright takes forever.']],
      draw(s, t) {
        const th0 = s.p.a * PI / 180, k = Math.sin(th0 / 2), K = SF().ellipK(k), w = 1.7, tt = Math.max(0, t - 1);
        const ex = 2 * Math.asin(clamp(k * SF().jacobi(K - w * tt, k)[0], -1, 1)), gh = th0 * Math.cos(w * tt);
        const px = 250, py = 140, L = 190;
        s.line(px - 70, py, px + 70, py, { c: C.dim, w: 3 });
        s.alpha(0.25, () => { const n = 60, pts = []; for (let i = 0; i <= n; i++) { const a = -th0 + 2 * th0 * i / n; pts.push([px + L * Math.sin(a), py + L * Math.cos(a)]); } s.poly(pts, { c: C.dim, w: 1.5, dash: [4, 6] }); });
        const bob = (th, col) => { const x = px + L * Math.sin(th), y = py + L * Math.cos(th); s.line(px, py, x, y, { c: col, w: 2.5 }); s.circle(x, y, 13, { c: col, w: 2, fill: col }); };
        s.alpha(s.in(t, 3, 1) * 0.5, () => bob(gh, C.greyB));
        bob(ex, C.yellow);
        s.txt('θ₀ = ' + s.p.a + '°', px, 470, { c: C.ink, size: 20, align: 'center', sans: true });
        const A = s.axes({ x0: 560, y0: 460, w: 340, h: 300, xr: [0, 180], yr: [1, 3], xt: [0, 180, 45], yt: [1, 3, 0.5], xl: 'θ₀ (°)', yl: 'T/T₀', yfmt: (v) => v.toFixed(1) });
        A.draw(s.in(t, 8, 1));
        const pr = s.in(t, 9, 2);
        if (pr > 0) A.fn((d) => 2 * SF().ellipK(Math.sin(d * PI / 360)) / PI, 0, 1 + 177 * pr, { c: C.yellow, w: 3 });
        s.alpha(s.in(t, 10, 1), () => { const r = 2 * K / PI; s.dot(A.X(s.p.a), A.Y(Math.min(r, 3)), { c: C.red, r: 7 }); s.txt('T/T₀ = ' + r.toFixed(3), 790, 110, { c: C.yellow, size: 22, align: 'right', sans: true }); s.txt('k = sin(θ₀/2) = ' + k.toFixed(3), 790, 140, { c: C.dim, size: 18, align: 'right', sans: true }); });
      }
    },
    steps: [
      { say: 'Energy is conserved. Released from rest at θ₀:', tex: R`\tfrac12 m l^2\dot\theta^2 - mgl\cos\theta = -mgl\cos\theta_0 \;\Longrightarrow\; \dot\theta^2 = \frac{2g}{l}\,(\cos\theta - \cos\theta_0)`, why: 'Kinetic energy ½mv² with v = lθ̇; the height below the pivot is l cos θ, so the potential energy is −mgl cos θ. At the turning point θ = θ₀ the speed is zero, which fixes the constant.' },
      { say: 'A quarter swing takes the time to go from 0 to θ₀:', tex: R`\frac{T}{4} = \int_0^{\theta_0}\frac{d\theta}{\dot\theta} = \sqrt{\frac{l}{2g}}\int_0^{\theta_0}\frac{d\theta}{\sqrt{\cos\theta - \cos\theta_0}}`, why: 'dt = dθ/θ̇. By symmetry the four quarters of the swing take equal times. The integrand blows up at θ₀ (the bob stops there), but only like 1/√(θ₀ − θ), so the integral is finite.' },
      { say: 'Use the half-angle identity and name k = sin(θ₀/2):', tex: R`\cos\theta - \cos\theta_0 = 2\left(\sin^2\tfrac{\theta_0}{2} - \sin^2\tfrac{\theta}{2}\right) = 2\left(k^2 - \sin^2\tfrac{\theta}{2}\right)`, why: 'cos θ = 1 − 2 sin²(θ/2). Subtracting the same identity at θ₀ leaves a difference of two squares, which a sine substitution can tame.' },
      { say: 'Substitute sin(θ/2) = k sin φ, so that θ: 0 → θ₀ becomes φ: 0 → π/2:', tex: R`d\theta = \frac{2k\cos\varphi\,d\varphi}{\sqrt{1 - k^2\sin^2\varphi}},\qquad \sqrt{\cos\theta - \cos\theta_0} = \sqrt2\,k\cos\varphi`, why: 'Differentiate: ½cos(θ/2) dθ = k cos φ dφ and cos(θ/2) = √(1 − k² sin² φ). The k cos φ factors cancel between numerator and denominator, removing the singularity at the end point entirely.' },
      { say: 'Everything collapses to one standard integral:', tex: R`T = 4\sqrt{\frac{l}{g}}\,K(k),\qquad K(k) = \int_0^{\pi/2}\frac{d\varphi}{\sqrt{1 - k^2\sin^2\varphi}}`, why: 'The constants combine as √(l/2g) × 2/√2 = √(l/g). K(k) is the complete elliptic integral of the first kind. Check: k = 0 gives K = π/2 and T = 2π√(l/g), the small-angle result.' },
      { say: 'Expand for moderate amplitudes:', tex: R`K(k) = \frac{\pi}{2}\left[1 + \frac{k^2}{4} + \frac{9k^4}{64} + \cdots\right] \;\Longrightarrow\; T \approx 2\pi\sqrt{\frac{l}{g}}\left(1 + \frac{\theta_0^2}{16} + \cdots\right)`, why: 'Expand (1 − k² sin²φ)^{−1/2} binomially and integrate term by term, using ∫₀^{π/2} sin^{2n}φ dφ = (π/2)·(2n−1)!!/(2n)!!. With k ≈ θ₀/2 the first correction is θ₀²/16: at 20° the period is only 0.8% longer.' },
      { say: 'Compute K exactly with Gauss’s arithmetic–geometric mean:', tex: R`K(k) = \frac{\pi}{2\,\mathrm{AGM}\big(1,\sqrt{1-k^2}\big)},\qquad a_{n+1} = \frac{a_n+b_n}{2},\;\; b_{n+1} = \sqrt{a_nb_n}`, why: 'Gauss showed the integral is unchanged when (a, b) is replaced by their arithmetic and geometric means (after rewriting it as ∫dφ/√(a²cos²φ + b²sin²φ)). The two means converge quadratically, so the number of correct digits doubles each step: five steps give machine precision.' }
    ],
    result: R`T = 4\sqrt{\frac{l}{g}}\,K\!\left(\sin\tfrac{\theta_0}{2}\right) = \frac{2\pi\sqrt{l/g}}{\mathrm{AGM}\big(1,\cos\tfrac{\theta_0}{2}\big)}`,
    assumptions: ['Ideal pendulum: point mass, light rigid rod, no friction or air drag. Real pendulums lose amplitude, so their period drifts back towards T₀ as they die down.',
      'K(k) diverges logarithmically as k → 1 (θ₀ → 180°): a pendulum balanced exactly upright never falls, an unstable equilibrium. Near the top, T ≈ 4√(l/g) ln(4/√(1 − k²)).',
      'The same family of integrals gives the perimeter of an ellipse (4aE(e), with E the second-kind integral), the field of a circular current loop, the free rigid body (Euler top) and orbits in general relativity, where the inverse functions (Jacobi’s sn, cn, dn) describe the motion itself.'],
    quiz: { q: 'A pendulum is released from 90°. Compared with the small-angle formula, its period is…', a: ['the same', 'about 2% longer', 'about 18% longer', 'about 50% longer'], c: 2, ex: 'k = sin 45° = 0.707 and K = 1.854, so T/T₀ = 2K/π = 1.180.' },
    try: 'Drag the amplitude from 10° to 170° and watch T/T₀: barely 1.002 at 10°, 1.18 at 90°, 2.44 at 170°.'
  });

  /* ------------------------------------------------------------ Bessel functions */
  const JZ = [[2.40483, 5.52008, 8.65373], [3.83171, 7.01559, 10.17347], [5.13562, 8.41724, 11.61984], [6.38016, 9.76102, 13.01520]];
  WL.topic({
    id: 'm-bessel', stage: 'msf', strand: 'D', title: 'Bessel Functions',
    summary: 'The modes of a drum, and of any wave in a cylinder or through a round hole.',
    maths: [['Polar coordinates', '∇² = ∂²/∂r² + (1/r)∂/∂r + (1/r²)∂²/∂φ²'], ['Separation of variables', 'u = R(r)Φ(φ)T(t)'], ['Power-series (Frobenius) solutions', 'y = Σ aₖ x^{k+s}'], ['Eigenvalue problems', 'boundary conditions pick discrete k']],
    idea: 'Hit a drum and its skin vibrates in patterns of rings and spokes. Writing the wave equation in polar coordinates turns the radial part into <em>Bessel’s equation</em>, whose regular solutions $J_n(x)$ look like slowly decaying cosines. The drum’s rim must stay still, so only waves that fit a zero of $J_n$ survive, and their frequencies are the zeros $j_{n,m}$: not whole-number multiples, which is why a drum sounds less “musical” than a string.',
    anim: {
      duration: 16, alt: 'A circular drum vibrating in the chosen mode, beside a graph of the Bessel function with its zeros marked.',
      params: [{ id: 'n', label: 'Angular number n', unit: '', min: 0, max: 3, step: 1, value: 1 }, { id: 'm', label: 'Ring number m', unit: '', min: 1, max: 3, step: 1, value: 2 }],
      beats: [[0, 'A drum skin vibrating in mode (n, m): n nodal diameters, m nodal circles counting the rim.'], [4, 'Radially the shape is Jₙ(j r/a), angularly cos nφ.'], [8, 'The rim must not move: the drum radius sits on the m-th zero of Jₙ.'], [12, 'Frequency ∝ that zero, so the overtones are not whole-number multiples.']],
      draw(s, t) {
        const n = s.p.n | 0, m = s.p.m | 0, j = JZ[n][m - 1], cx = 245, cy = 280, Rr = 175, ph = Math.cos(2.4 * t * j / 2.405);
        const NR = 22, NA = 64;
        for (let i = 0; i < NR; i++) for (let a = 0; a < NA; a++) {
          const r0 = i / NR, r1 = (i + 1) / NR, a0 = 2 * PI * a / NA, a1 = 2 * PI * (a + 1) / NA, rm = (r0 + r1) / 2, am = (a0 + a1) / 2;
          const v = SF().besselJ(n, j * rm) * Math.cos(n * am) * ph / 0.6, col = v >= 0 ? C.yellow : C.blue;
          s.alpha(clamp(Math.abs(v), 0, 1) * 0.9 * s.in(t, 0, 1), () => s.poly([[cx + Rr * r0 * Math.cos(a0), cy + Rr * r0 * Math.sin(a0)], [cx + Rr * r1 * Math.cos(a0), cy + Rr * r1 * Math.sin(a0)], [cx + Rr * r1 * Math.cos(a1), cy + Rr * r1 * Math.sin(a1)], [cx + Rr * r0 * Math.cos(a1), cy + Rr * r0 * Math.sin(a1)]], { c: col, fill: col, fa: 1, stroke: false }));
        }
        s.circle(cx, cy, Rr, { c: C.ink, w: 3 });
        s.alpha(s.in(t, 2, 1) * 0.6, () => { for (let q = 0; q < m - 1; q++) s.circle(cx, cy, Rr * JZ[n][q] / j, { c: C.ink, w: 1, dash: [4, 5] }); for (let q = 0; q < n; q++) { const a = PI / (2 * n) + q * PI / n; s.line(cx - Rr * Math.cos(a), cy - Rr * Math.sin(a), cx + Rr * Math.cos(a), cy + Rr * Math.sin(a), { c: C.ink, w: 1, dash: [4, 5] }); } });
        const A = s.axes({ x0: 520, y0: 300, w: 380, h: 220, xr: [0, 14], yr: [-0.6, 1.05], xt: [0, 14, 2], yt: [-0.5, 1, 0.5], xl: 'x', yl: 'Jₙ(x)', yfmt: (v) => v.toFixed(1) });
        A.draw(s.in(t, 4, 1));
        if (t > 4.5) A.fn((x) => SF().besselJ(n, x), 0, 0.01 + 13.9 * s.in(t, 4.5, 2), { c: C.yellow, w: 3 });
        s.alpha(s.in(t, 8, 1), () => { JZ[n].forEach((z, q) => { s.dot(A.X(z), A.Y(0), { c: q === m - 1 ? C.red : C.dim, r: q === m - 1 ? 7 : 4 }); }); s.txt('j' + '₀₁₂₃'[n] + ',' + '₁₂₃'[m - 1] + ' = ' + j.toFixed(3), A.X(j), A.Y(0) + 30, { c: C.red, size: 18, align: 'center', sans: true }); });
        s.alpha(s.in(t, 12, 1), () => { s.txt('f / f₀₁ = ' + (j / 2.40483).toFixed(3), 900, 420, { c: C.yellow, size: 24, align: 'right', sans: true }); s.txt('a string would give 1, 2, 3, …', 900, 450, { c: C.dim, size: 16, align: 'right', sans: true }); });
      }
    },
    steps: [
      { say: 'The membrane obeys the 2-D wave equation; write the Laplacian in polar coordinates:', tex: R`\frac{\partial^2 u}{\partial t^2} = c^2\left(\frac{\partial^2 u}{\partial r^2} + \frac1r\frac{\partial u}{\partial r} + \frac1{r^2}\frac{\partial^2 u}{\partial \varphi^2}\right)`, why: 'Tension pulls a small patch towards the average of its neighbours, exactly as on a string, but now in two directions. In polar coordinates the 1/r ∂/∂r term appears because circles get longer further out.' },
      { say: 'Separate variables, u = R(r)Φ(φ)T(t):', tex: R`T'' = -\omega^2T,\qquad \Phi'' = -n^2\Phi\;\Rightarrow\;\Phi = \cos n\varphi,\;\; n = 0, 1, 2, \dots`, why: 'Dividing by RΦT makes each side depend on a different variable, so each must equal a constant. Going once round the drum must give the same displacement, so Φ(φ + 2π) = Φ(φ): n has to be a whole number.' },
      { say: 'The radial part, with k = ω/c and x = kr, becomes Bessel’s equation:', tex: R`x^2y'' + x\,y' + (x^2 - n^2)\,y = 0`, why: 'Substituting gives r²R″ + rR′ + (k²r² − n²)R = 0. Rescaling x = kr removes k, leaving one standard equation for every drum size and every frequency.' },
      { say: 'Solve by a power series (Frobenius). The solution regular at the centre is:', tex: R`J_n(x) = \sum_{s=0}^{\infty}\frac{(-1)^s}{s!\,(s+n)!}\left(\frac{x}{2}\right)^{2s+n}`, why: 'Try y = Σ aₛ x^{s+λ}: the lowest power forces λ = ±n, and matching powers gives a two-step recursion. The second solution Yₙ blows up at x = 0, and the centre of a drum moves only a finite amount, so it is discarded.' },
      { say: 'The rim r = a is clamped, so R(a) = 0:', tex: R`J_n(ka) = 0 \;\Longrightarrow\; k_{nm} = \frac{j_{n,m}}{a},\qquad \omega_{nm} = \frac{c\,j_{n,m}}{a}`, why: 'Jₙ oscillates with slowly shrinking amplitude and crosses zero infinitely often. Each zero j_{n,m} gives one allowed wavenumber: the boundary condition turns a continuous family into discrete modes.' },
      { say: 'The overtones are not harmonic:', tex: R`\frac{\omega_{nm}}{\omega_{01}} = \frac{j_{n,m}}{j_{0,1}}:\quad 1,\ 1.593,\ 2.136,\ 2.295,\ 2.653,\dots`, why: 'j₀₁ = 2.405, j₁₁ = 3.832, j₂₁ = 5.136, j₀₂ = 5.520, j₃₁ = 6.380. A string’s overtones are exact multiples 1, 2, 3, …, which the ear hears as one pitch; a drum’s are not, so it sounds like a thud. For large x, Jₙ(x) ≈ √(2/πx) cos(x − nπ/2 − π/4), so the zeros become evenly spaced by π.' }
    ],
    result: R`u_{nm} = J_n\!\left(\frac{j_{n,m}\,r}{a}\right)\cos(n\varphi)\cos(\omega_{nm}t),\qquad \omega_{nm} = \frac{c\,j_{n,m}}{a}`,
    assumptions: ['Ideal membrane: uniform tension and density, small displacements, no stiffness, no air loading. A real timpani’s air cavity shifts the modes towards harmonic ratios, which is why it has a definite pitch.',
      'Damping is ignored; real modes decay at different rates, so the struck sound changes character as it rings.',
      'The same functions describe light through a circular aperture (the Airy disc has its first dark ring at the first zero of J₁, sin θ = 1.22λ/D), waves in optical fibres and waveguides, heat flow in a cylinder and the hydrogen-like states of a 2-D atom.'],
    quiz: { q: 'Why does a drum sound less like a single pitch than a guitar string?', a: ['Its skin is thicker', 'Its overtone frequencies are not whole-number multiples of the fundamental', 'It vibrates only in one mode', 'Its frequencies are all equal'], c: 1, ex: 'Drum overtones follow the Bessel zeros: 1, 1.59, 2.14, 2.30, … times the fundamental, not 1, 2, 3, …' },
    try: 'Set n = 0, m = 1 (one ring) and then n = 1, m = 1: the second mode has a nodal diameter, and its frequency is 1.593 times higher.'
  });

  /* ------------------------------------------------------------ Legendre polynomials */
  WL.topic({
    id: 'm-legendre', stage: 'msf', strand: 'A', title: 'Legendre Polynomials & Spherical Harmonics',
    summary: 'The natural modes of anything round: multipoles, atomic orbitals, the cosmic microwave background.',
    maths: [['Spherical coordinates', 'x = r sin θ cos φ, …'], ['Separation of variables', 'V = R(r)Θ(θ)'], ['Power series & recursions', 'a_{k+2} in terms of a_k'], ['Orthogonality', '∫ f g dx = 0']],
    idea: 'Solve Laplace’s equation around anything spherical and the angular part is forced into a short list of shapes: the <em>Legendre polynomials</em> $P_l(\\cos\\theta)$. They are the monopole, dipole, quadrupole, … patterns, the angular shapes of s, p, d orbitals, and the basis in which the cosmic microwave background is analysed.',
    anim: {
      duration: 14, alt: 'A polar plot of a Legendre polynomial, showing positive and negative lobes, beside its graph on minus one to one.',
      params: [{ id: 'l', label: 'Degree l', unit: '', min: 0, max: 6, step: 1, value: 2 }],
      beats: [[0, 'The angular pattern P_l(cos θ): yellow lobes positive, blue negative.'], [4, 'Degree l gives l nodal cones (circles of latitude where it vanishes).'], [8, 'As a function of x = cos θ it is a polynomial of degree l on [−1, 1].'], [11, 'Different l are orthogonal: their product averages to zero over the sphere.']],
      draw(s, t) {
        const l = s.p.l | 0, cx = 250, cy = 280, Sc = 170, P = (x) => SF().legendreP(l, x), pr = s.in(t, 0, 2.5);
        s.line(cx, cy - 210, cx, cy + 210, { c: C.dim, w: 1, dash: [3, 6] });
        const N = 240;
        for (const sg of [1, -1]) {
          let seg = [], last = null;
          const flush = () => { if (seg.length > 1) s.poly(seg, { c: last > 0 ? C.yellow : C.blue, w: 3, fill: last > 0 ? C.yellow : C.blue, fa: 0.18 }); seg = []; };
          for (let i = 0; i <= N * pr; i++) {
            const th = PI * i / N, v = P(Math.cos(th)), r = Sc * Math.abs(v), sgn = v >= 0 ? 1 : -1;
            if (last !== null && sgn !== last) { seg.push([cx, cy]); flush(); seg.push([cx, cy]); }
            last = sgn; seg.push([cx + sg * r * Math.sin(th), cy - r * Math.cos(th)]);
          }
          seg.push([cx, cy]); flush();
        }
        s.txt('θ = 0', cx, cy - 222, { c: C.dim, size: 15, align: 'center', sans: true });
        const A = s.axes({ x0: 560, y0: 290, w: 330, h: 200, xr: [-1, 1], yr: [-1, 1], xt: [-1, 1, 0.5], yt: [-1, 1, 0.5], xl: 'x', yl: 'P_l(x)', xfmt: (v) => v.toFixed(1), yfmt: (v) => v.toFixed(1) });
        A.draw(s.in(t, 8, 1));
        if (t > 8.5) A.fn(P, -1, -1 + 2 * s.in(t, 8.5, 2), { c: C.yellow, w: 3 });
        s.alpha(s.in(t, 4, 1), () => s.txt(l + (l === 1 ? ' nodal cone' : ' nodal cones'), 900, 110, { c: C.yellow, size: 20, align: 'right', sans: true }));
        s.alpha(s.in(t, 11, 1), () => s.txt('∫ P_l P_m dx = 2δ_lm/(2l+1)', 900, 420, { c: C.dim, size: 18, align: 'right', sans: true }));
      }
    },
    steps: [
      { say: 'Laplace’s equation in spherical coordinates, for a field with no φ-dependence:', tex: R`\frac{1}{r^2}\frac{\partial}{\partial r}\!\left(r^2\frac{\partial V}{\partial r}\right) + \frac{1}{r^2\sin\theta}\frac{\partial}{\partial\theta}\!\left(\sin\theta\,\frac{\partial V}{\partial\theta}\right) = 0`, why: 'Charge-free regions obey ∇²V = 0. Problems with an axis of symmetry (a charged ring, a sphere in a uniform field) have V independent of φ, which removes the third term.' },
      { say: 'Separate V = R(r)Θ(θ); both sides equal a constant, written l(l + 1):', tex: R`\frac{d}{dr}\!\left(r^2R'\right) = l(l+1)R \;\Longrightarrow\; R = A\,r^l + \frac{B}{r^{l+1}}`, why: 'Multiplying by r²/(RΘ) splits the equation into a pure-r part and a pure-θ part. Trying R = r^p gives p(p + 1) = l(l + 1), so p = l or p = −(l + 1): growing inside, decaying outside.' },
      { say: 'With x = cos θ the angular equation is Legendre’s equation:', tex: R`(1 - x^2)\,\Theta'' - 2x\,\Theta' + l(l+1)\,\Theta = 0`, why: 'd/dθ = −sin θ d/dx and sin²θ = 1 − x². The poles θ = 0, π sit at x = ±1, where the equation is singular: that is where the physics will cut down the solutions.' },
      { say: 'Try a power series Θ = Σ aₖxᵏ. The coefficients obey:', tex: R`a_{k+2} = \frac{k(k+1) - l(l+1)}{(k+1)(k+2)}\,a_k`, why: 'Substituting and matching powers of x gives this two-step recursion. For large k, a_{k+2}/aₖ → 1, so an endless series behaves like Σ x^{2k}, which diverges at x = ±1 (the poles). A field cannot be infinite on the axis, so the series must stop.' },
      { say: 'It stops only if l is a whole number: the polynomial solutions are given by Rodrigues’ formula:', tex: R`P_l(x) = \frac{1}{2^l\,l!}\frac{d^l}{dx^l}\big(x^2-1\big)^l:\quad P_0 = 1,\; P_1 = x,\; P_2 = \tfrac12(3x^2-1),\; P_3 = \tfrac12(5x^3-3x)`, why: 'The numerator k(k+1) − l(l+1) vanishes at k = l, terminating one of the two series (choose the other’s first coefficient zero). Normalising so that P_l(1) = 1 gives Rodrigues’ formula, which you can check satisfies the equation.' },
      { say: 'They are orthogonal, so any axisymmetric potential is a sum of them:', tex: R`\int_{-1}^{1}P_l\,P_m\,dx = \frac{2\,\delta_{lm}}{2l+1},\qquad V(r,\theta) = \sum_{l}\left(A_l r^l + \frac{B_l}{r^{l+1}}\right)P_l(\cos\theta)`, why: 'Legendre’s equation is of Sturm–Liouville form, [(1 − x²)Θ′]′ + l(l+1)Θ = 0, so solutions with different eigenvalues are orthogonal. Expanding 1/|r − r′| in this basis gives the multipole expansion: monopole, dipole, quadrupole, …' }
    ],
    result: R`\frac{1}{|\mathbf r - \mathbf r'|} = \sum_{l=0}^{\infty}\frac{r_<^{\,l}}{r_>^{\,l+1}}\,P_l(\cos\gamma)`,
    assumptions: ['Axial symmetry was assumed. Without it the angular solutions become the spherical harmonics Y_{lm}(θ, φ) ∝ P_l^m(cos θ)e^{imφ}, built from the associated Legendre functions.',
      'Requiring finiteness at both poles is what quantises l. In a cone that excludes one pole, non-integer degrees are allowed (Legendre functions of non-integer order).',
      'In quantum mechanics l(l + 1)ħ² is the eigenvalue of L², so the same quantisation produces the s, p, d, f orbital shapes; in cosmology the CMB temperature map is decomposed into Y_{lm} and its power spectrum C_l is the main observable.'],
    quiz: { q: 'Why must l be a whole number for a potential that is finite on the whole sphere?', a: ['Because r must be positive', 'Otherwise the power series does not terminate and diverges at the poles', 'Because cos θ ≤ 1', 'Because charge is quantised'], c: 1, ex: 'For non-integer l the recursion never stops, and the infinite series blows up at x = ±1, the poles of the sphere.' },
    try: 'Step l from 0 to 6: the number of nodal cones always equals l, and the lobes alternate in sign.'
  });

  /* ------------------------------------------------------------ Gamma function */
  WL.topic({
    id: 'm-gamma', stage: 'msf', strand: 'K', title: 'Gamma & Beta Functions',
    summary: 'The factorial, extended smoothly to every real and complex number.',
    maths: [['Integration by parts', '∫u dv = uv − ∫v du'], ['Gaussian integral', '∫e^{−x²}dx = √π'], ['Substitution in integrals', 't = u², t = s/(1+s)'], ['Exponentials & logarithms', 'eˣ dominates any power']],
    idea: 'What is ½! ? The integral $\\Gamma(z) = \\int_0^\\infty t^{z-1}e^{-t}\\,dt$ obeys Γ(z + 1) = zΓ(z) and equals (n − 1)! at whole numbers, so it extends the factorial to every number, with $\\Gamma(\\tfrac12) = \\sqrt\\pi$. It turns up in volumes of spheres in any dimension, in the Maxwell–Boltzmann and blackbody integrals, in quantum scattering and in Stirling’s formula for huge factorials.',
    anim: {
      duration: 14, alt: 'The integrand t to the power x minus one times e to the minus t, whose area is Gamma of x, beside a graph of the Gamma function with factorial points and poles.',
      params: [{ id: 'x', label: 'Argument x', unit: '', min: 0.5, max: 5, step: 0.05, value: 3 }],
      beats: [[0, 'Γ(x) is the area under t^{x−1}e^{−t}.'], [4, 'At whole numbers the area is a factorial: Γ(n) = (n − 1)!.'], [8, 'Between them Γ joins the factorials smoothly: Γ(½) = √π.'], [11, 'To the left it has poles at 0, −1, −2, …, from Γ(z) = Γ(z + 1)/z.']],
      draw(s, t) {
        const x = s.p.x, g = SF().gamma(x), f = (u) => Math.pow(u, x - 1) * Math.exp(-u);
        const A = s.axes({ x0: 70, y0: 440, w: 380, h: 300, xr: [0, 10], yr: [0, 1.6], xt: [0, 10, 2], yt: [0, 1.5, 0.5], xl: 't', yl: '', yfmt: (v) => v.toFixed(1) });
        A.draw(s.in(t, 0, 1));
        const pr = s.in(t, 0.5, 2), ymax = 1.6, pts = [];
        for (let i = 0; i <= 300; i++) { const u = 10 * i / 300 * pr; pts.push([A.X(u), A.Y(Math.min(f(Math.max(u, 1e-6)), ymax))]); }
        s.alpha(0.3, () => s.poly([[A.X(0), A.Y(0)], ...pts, [A.X(10 * pr), A.Y(0)]], { c: C.yellow, fill: C.yellow, fa: 1, stroke: false }));
        s.poly(pts, { c: C.yellow, w: 3 });
        s.txt('area = Γ(' + x.toFixed(2) + ') = ' + g.toFixed(4), 460, 110, { c: C.yellow, size: 20, align: 'right', sans: true, p: s.in(t, 2, 1) });
        const B = s.axes({ x0: 530, y0: 280, w: 370, h: 220, xr: [-4, 5], yr: [-6, 6], xt: [-4, 5, 1], yt: [-6, 6, 2], xl: 'x', yl: 'Γ(x)' });
        B.draw(s.in(t, 4, 1));
        if (t > 4.5) {
          const q = s.in(t, 4.5, 2);
          B.fn((u) => SF().gamma(u), 0.03, 0.03 + 4.95 * q, { c: C.teal, w: 3, n: 300 });
          if (t > 11) for (let p = 0; p < 4; p++) { const a = -p - 1 + 0.02, b = -p - 0.02; B.fn((u) => SF().gamma(u), a, a + (b - a) * s.in(t, 11, 2), { c: C.teal, w: 3, n: 300 }); s.line(B.X(-p), B.Y(-6), B.X(-p), B.Y(6), { c: C.dim, w: 1, dash: [3, 6] }); }
        }
        s.alpha(s.in(t, 6, 1), () => { [1, 2, 3, 4, 5].forEach((n) => { const v = SF().gamma(n); if (v <= 6) s.dot(B.X(n), B.Y(v), { c: C.red, r: 5 }); }); s.dot(B.X(x), B.Y(Math.min(g, 6)), { c: C.yellow, r: 7 }); });
        s.alpha(s.in(t, 8, 1), () => s.txt('Γ(½) = √π = 1.7725', 900, 420, { c: C.dim, size: 18, align: 'right', sans: true }));
      }
    },
    steps: [
      { say: 'Define the Gamma function by an integral (convergent for Re z > 0):', tex: R`\Gamma(z) = \int_0^{\infty} t^{\,z-1}e^{-t}\,dt`, why: 'Near t = 0 the integrand behaves like t^{z−1}, integrable when Re z > 0; for large t the exponential beats any power. So the integral defines a smooth function of z on the right half-plane.' },
      { say: 'Integrate by parts once:', tex: R`\Gamma(z+1) = \Big[-t^{z}e^{-t}\Big]_0^{\infty} + z\int_0^{\infty}t^{\,z-1}e^{-t}\,dt = z\,\Gamma(z)`, why: 'Take u = t^z and dv = e^{−t}dt. The boundary term vanishes at both ends (t^z → 0 at 0 for Re z > 0, and e^{−t} kills it at ∞). This recursion is the factorial’s defining property.' },
      { say: 'Start from Γ(1) = 1 and climb:', tex: R`\Gamma(1) = \int_0^\infty e^{-t}dt = 1 \;\Longrightarrow\; \Gamma(n+1) = n\,\Gamma(n) = \cdots = n!`, why: 'Apply the recursion repeatedly: Γ(2) = 1·Γ(1) = 1, Γ(3) = 2·Γ(2) = 2, Γ(4) = 3·2 = 6, … So the integral reproduces every factorial, and also defines one between the integers.' },
      { say: 'Half-integers come from the Gaussian integral (t = u²):', tex: R`\Gamma\!\left(\tfrac12\right) = \int_0^\infty t^{-1/2}e^{-t}\,dt = 2\int_0^{\infty}e^{-u^2}\,du = \sqrt\pi`, why: 'With t = u², dt = 2u du and t^{−1/2} = 1/u, the u’s cancel. ∫₀^∞e^{−u²}du = √π/2, found by squaring the integral and switching to polar coordinates. Then Γ(3/2) = ½√π, Γ(5/2) = ¾√π, …' },
      { say: 'Run the recursion backwards to continue Γ to the left; poles appear:', tex: R`\Gamma(z) = \frac{\Gamma(z+n+1)}{z\,(z+1)\cdots(z+n)},\qquad \operatorname*{Res}_{z=-n}\Gamma = \frac{(-1)^n}{n!}`, why: 'The right-hand side is defined for Re z > −(n + 1) except where a factor in the denominator vanishes. So Γ extends to the whole complex plane except simple poles at 0, −1, −2, …; it is never zero, and 1/Γ is an entire function.' },
      { say: 'Two consequences used everywhere in physics: the Beta function and Stirling’s formula:', tex: R`B(a,b) = \int_0^1 t^{a-1}(1-t)^{b-1}dt = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)},\qquad n! \approx \sqrt{2\pi n}\,\left(\frac{n}{e}\right)^{n}`, why: 'Write Γ(a)Γ(b) as a double integral and change variables t = uv, s = u(1 − v): it factorises into Γ(a + b)B(a, b). Stirling comes from Laplace’s method: t^n e^{−t} peaks sharply at t = n, and approximating the peak by a Gaussian gives √(2πn)(n/e)^n, already 0.8% accurate at n = 10.' }
    ],
    result: R`\Gamma(z+1) = z\,\Gamma(z),\qquad \Gamma(n+1) = n!,\qquad \Gamma(z)\,\Gamma(1-z) = \frac{\pi}{\sin\pi z}`,
    assumptions: ['The integral definition needs Re z > 0; everywhere else Γ is defined by analytic continuation through the recursion. The reflection formula Γ(z)Γ(1 − z) = π/sin πz connects the two halves and gives Γ(½)² = π at once.',
      'Γ is not the only smooth function through the factorials, but it is the only one that is log-convex for x > 0 with Γ(1) = 1 and Γ(x + 1) = xΓ(x) (the Bohr–Mollerup theorem): that is why it is “the” extension.',
      'Stirling’s series is asymptotic, not convergent: adding more terms improves it only up to a point. For moderate n the first correction factor (1 + 1/12n) already gives four-digit accuracy.'],
    quiz: { q: 'What is Γ(5/2)?', a: ['3√π/4', '√π/2', '2', '3/2'], c: 0, ex: 'Γ(5/2) = (3/2)Γ(3/2) = (3/2)(1/2)Γ(1/2) = (3/4)√π ≈ 1.329.' },
    try: 'Set x = 0.5 and read the area: 1.7725 = √π. Then try x = 4: the area is exactly 6 = 3!.'
  });
})();
