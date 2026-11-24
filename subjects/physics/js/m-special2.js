/* Geodesic: special-function lessons, part 2 (Hermite, Laguerre, Airy, error function). Live sims use WL.sf (js/sf.js). */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw, SF = () => WL.sf, PI = Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = (n) => String(n).split('').map((d) => SUP[+d]).join('');
  const hermCoef = (n) => { let a = [1], b = [0, 2]; if (n === 0) return a; for (let k = 1; k < n; k++) { const c = new Array(k + 2).fill(0); b.forEach((v, i) => (c[i + 1] += 2 * v)); a.forEach((v, i) => (c[i] -= 2 * k * v)); a = b; b = c; } return b; };
  const polyStr = (co, v) => co.map((c, i) => [c, i]).filter(([c]) => c !== 0).reverse().map(([c, i], j) => {
    const m = Math.abs(c), coef = m === 1 && i > 0 ? '' : String(m), pw = i === 0 ? '' : i === 1 ? v : v + sup(i);
    return (c < 0 ? (j ? ' − ' : '−') : j ? ' + ' : '') + coef + pw;
  }).join('');

  /* ------------------------------------------------------------ Hermite */
  WL.topic({
    id: 'm-hermite', stage: 'msf', strand: 'A', title: 'Hermite Polynomials & the Quantum Oscillator',
    summary: 'Gaussians times polynomials: the eigenstates of the quantum harmonic oscillator.',
    maths: [['Power-series solutions', 'y = Σ aₖ xᵏ'], ['Gaussian integrals', '∫e^{−x²}dx = √π'], ['Second-order ODEs', 'y″ + p y′ + q y = 0'], ['Eigenvalue problems', 'Ĥψ = Eψ']],
    idea: 'Near the bottom of any smooth potential well, V ≈ ½mω²x². The Schrödinger equation for that parabola has solutions that are a Gaussian times a polynomial, $\\psi_n \\propto H_n(\\xi)\\,e^{-\\xi^2/2}$. Demanding that ψ stays finite forces the power series for $H_n$ to stop, and that single condition quantises the energy: $E_n = \\hbar\\omega(n + \\tfrac12)$. Molecular vibrations, phonons in solids and every mode of the electromagnetic field are built on these functions.',
    anim: {
      duration: 14, alt: 'The parabolic potential with its equally spaced energy levels and the chosen eigenfunction drawn on its level; beside it the quantum probability density compared with the classical one.',
      params: [{ id: 'n', label: 'Level n', unit: '', min: 0, max: 8, step: 1, value: 3 }],
      beats: [[0, 'The oscillator potential V = ½ξ² (energies in units of ħω) and its allowed energies n + ½.'], [4, 'Each eigenstate ψₙ is a Hermite polynomial times a Gaussian, with exactly n nodes.'], [8, 'Right: |ψₙ|² against the classical probability density 1/(π√(2n + 1 − ξ²)).'], [11, 'For large n the quantum density approaches the classical one, piling up near the turning points.']],
      draw(s, t) {
        const n = Math.round(s.p.n), sf = SF(), E = n + 0.5, xt = Math.sqrt(2 * E);
        const A = s.axes({ x0: 50, y0: 480, w: 520, h: 410, xr: [-5, 5], yr: [0, 10], xt: [-4, 4, 2], yt: [0, 10, 1], xl: 'ξ', yl: '', ytl: false });
        A.draw(s.in(t, 0, 1));
        A.fn((x) => x * x / 2, -4.47, 4.47, { c: C.dim, w: 2, p: s.in(t, 0.5, 1.5) });
        for (let k = 0; k <= 9; k++) { const e = k + 0.5, x0 = Math.sqrt(2 * e); s.line(A.X(-x0), A.Y(e), A.X(x0), A.Y(e), { c: k === n ? C.yellow : 'rgba(150,170,190,0.30)', w: k === n ? 2 : 1, p: s.in(t, 1.5 + 0.12 * k, 0.6) }); }
        s.alpha(s.in(t, 2.5, 1), () => s.txt('E = ' + (n + 0.5) + ' ħω', A.X(4.9), A.Y(E) - 12, { c: C.yellow, size: 16, align: 'right', sans: true }));
        if (t > 4) { const q = s.in(t, 4, 2); A.fn((x) => E + 1.5 * sf.hoPsi(n, x), -5, -5 + 10 * q, { c: C.teal, w: 3, n: 500 }); }
        s.alpha(s.in(t, 6, 1), () => {
          [-1, 1].forEach((sg) => s.line(A.X(sg * xt), A.Y(0), A.X(sg * xt), A.Y(E), { c: C.dim, w: 1, dash: [3, 5] }));
          s.txt('H' + '₀₁₂₃₄₅₆₇₈'[n] + '(ξ) = ' + polyStr(hermCoef(n), 'ξ'), 300, 34, { c: C.teal, size: n > 6 ? 14 : 17, align: 'center', sans: true });
        });
        const B = s.axes({ x0: 620, y0: 430, w: 300, h: 260, xr: [-5, 5], yr: [0, 0.8], xt: [-4, 4, 2], yt: [0, 0.8, 0.2], xl: 'ξ', yl: '|ψ|²', yfmt: (v) => v.toFixed(1) });
        B.draw(s.in(t, 8, 1));
        if (t > 8.3) {
          const q = s.in(t, 8.3, 2);
          B.fn((x) => sf.hoPsi(n, x) ** 2, -5, -5 + 10 * q, { c: C.teal, w: 2.5, n: 500 });
          s.alpha(s.in(t, 9.5, 1), () => B.fn((x) => Math.min(0.78, 1 / (PI * Math.sqrt(Math.max(2 * E - x * x, 1e-4)))), -xt + 0.005, xt - 0.005, { c: C.red, w: 2, dash: [6, 5], n: 300 }));
          s.alpha(s.in(t, 10, 1), () => { s.txt('quantum', 900, 140, { c: C.teal, size: 16, align: 'right', sans: true }); s.txt('classical', 900, 162, { c: C.red, size: 16, align: 'right', sans: true }); });
        }
        s.alpha(s.in(t, 11.5, 1), () => s.txt(n + (n === 1 ? ' node' : ' nodes') + ', parity ' + (n % 2 ? 'odd' : 'even'), 770, 480, { c: C.dim, size: 16, align: 'center', sans: true }));
      }
    },
    steps: [
      { say: 'Measure length and energy in the oscillator’s natural units:', tex: R`\xi = x\sqrt{\frac{m\omega}{\hbar}},\quad \varepsilon = \frac{E}{\hbar\omega}\;\Longrightarrow\; \frac{d^2\psi}{d\xi^2} + \left(2\varepsilon - \xi^2\right)\psi = 0`, why: 'Substituting x = ξ√(ħ/mω) into −(ħ²/2m)ψ″ + ½mω²x²ψ = Eψ and dividing by ħω/2 removes every constant. The length √(ħ/mω) is where the kinetic and potential energies of the ground state are comparable.' },
      { say: 'For large |ξ| the ξ² term dominates; peel off the Gaussian behaviour:', tex: R`\psi \approx e^{\pm\xi^2/2}\ \text{as}\ |\xi|\to\infty,\qquad \psi = h(\xi)\,e^{-\xi^2/2} \;\Longrightarrow\; h'' - 2\xi h' + (2\varepsilon - 1)h = 0`, why: 'With ψ = e^{−ξ²/2}: ψ″ = (ξ² − 1)e^{−ξ²/2}, which matches ξ²ψ to leading order. Only the decaying sign is normalisable. Writing ψ = h e^{−ξ²/2} and dividing out the exponential gives the Hermite-type equation for h.' },
      { say: 'Solve for h by a power series:', tex: R`h = \sum_k a_k\,\xi^k,\qquad a_{k+2} = \frac{2k + 1 - 2\varepsilon}{(k+1)(k+2)}\,a_k`, why: 'Substitute and collect the coefficient of ξᵏ: (k + 2)(k + 1)a_{k+2} − 2k a_k + (2ε − 1)a_k = 0. Even and odd coefficients decouple, giving an even and an odd solution, each fixed by a₀ or a₁.' },
      { say: 'Unless the series stops, it grows like e^{ξ²}, and ψ blows up. So it must stop:', tex: R`\frac{a_{k+2}}{a_k}\to\frac{2}{k}\ \Rightarrow\ h\sim e^{\xi^2},\ \psi\sim e^{+\xi^2/2};\qquad 2\varepsilon - 1 = 2n\ \Longrightarrow\ E_n = \hbar\omega\left(n + \tfrac12\right)`, why: 'The series of e^{ξ²} = Σ ξ^{2j}/j! has the same ratio 2/k between successive even coefficients, so a non-terminating h grows like e^{ξ²}. The only escape is for the numerator 2k + 1 − 2ε to vanish at some k = n, which needs ε = n + ½. Normalisability alone quantises the energy.' },
      { say: 'The terminating solutions are the Hermite polynomials, generated by:', tex: R`H_n(\xi) = (-1)^n e^{\xi^2}\frac{d^n}{d\xi^n}e^{-\xi^2},\qquad e^{2\xi t - t^2} = \sum_{n=0}^{\infty} H_n(\xi)\frac{t^n}{n!},\qquad H_{n+1} = 2\xi H_n - 2nH_{n-1}`, why: 'H₀ = 1, H₁ = 2ξ, H₂ = 4ξ² − 2, H₃ = 8ξ³ − 12ξ. Differentiating the generating function with respect to t and ξ gives the recurrence and H′ₙ = 2nH_{n−1}; these are what make the ladder operators work.' },
      { say: 'They are orthogonal with the Gaussian weight, which fixes the normalised eigenfunctions:', tex: R`\int_{-\infty}^{\infty}H_mH_n\,e^{-\xi^2}d\xi = 2^n n!\sqrt\pi\,\delta_{mn},\qquad \psi_n(\xi) = \frac{H_n(\xi)\,e^{-\xi^2/2}}{\sqrt{2^n n!\sqrt\pi}}`, why: 'Multiply the generating functions for t and s and integrate against e^{−ξ²}: the result is √π e^{2ts}, whose expansion contains only equal powers tⁿsⁿ, so m ≠ n integrals vanish. Orthogonality is also guaranteed in general because the oscillator Hamiltonian is self-adjoint (Sturm–Liouville).' }
    ],
    result: R`E_n = \hbar\omega\left(n + \tfrac12\right),\qquad \psi_n(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}\frac{1}{\sqrt{2^n n!}}\,H_n(\xi)\,e^{-\xi^2/2}`,
    assumptions: ['A perfectly quadratic potential is an idealisation. Real bonds are anharmonic, so the levels close up with n: HCl’s first overtone lies at 5668 cm⁻¹, not twice its fundamental 2886 cm⁻¹ (5772 cm⁻¹), a 1.8% deficit that the harmonic model cannot produce.',
      'The zero-point energy ½ħω is not a convention but measurable: H₂ and D₂ share the same electronic potential, yet their dissociation energies differ (4.478 eV vs 4.556 eV) almost entirely because their zero-point energies differ.',
      'Quantisation came from a boundary condition (ψ → 0 at infinity), not from the differential equation. Change the condition (a wall, a periodic box) and the spectrum changes, even with the same equation.'],
    quiz: { q: 'How many nodes does ψ₃ have, and what is its parity?', a: ['3 nodes, odd', '3 nodes, even', '4 nodes, even', '2 nodes, odd'], c: 0, ex: 'H₃ = 8ξ³ − 12ξ has three real roots (0, ±√(3/2)) and only odd powers, so ψ₃ is odd with three nodes.' },
    try: 'Step n from 0 to 8. The level spacing never changes (one ħω each), and at n = 8 the quantum density has its biggest peaks next to the classical turning points, where a classical particle moves slowest.'
  });

  /* ------------------------------------------------------------ Laguerre */
  const lagKey = (s, n, l) => n * 10 + l;
  WL.topic({
    id: 'm-laguerre', stage: 'msf', strand: 'A', title: 'Laguerre Polynomials & the Hydrogen Atom',
    summary: 'The radial wavefunctions of the hydrogen atom, and why its energies go as 1/n².',
    maths: [['Power-series solutions', 'y = Σ cⱼ xʲ'], ['Spherical coordinates', 'ψ = R(r)Y(θ, φ)'], ['Effective potential', 'V + L²/2mr²'], ['Gamma function', 'Γ(n + 1) = n!']],
    idea: 'In the hydrogen atom the Schrödinger equation separates into angles (spherical harmonics) and a radial equation. Peeling off the behaviour near the nucleus ($r^{l}$) and far away ($e^{-r/na_0}$) leaves Laguerre’s equation. Its series must terminate or the wavefunction explodes, and that forces $E_n = -13.6\\ \\text{eV}/n^2$. The leftover polynomial, an associated Laguerre polynomial, sets the number of radial nodes, $n - l - 1$.',
    anim: {
      duration: 15, alt: 'A slice through the hydrogen orbital chosen by n and l, beside its radial probability density with the radial nodes marked.',
      params: [{ id: 'n', label: 'Principal n', unit: '', min: 1, max: 5, step: 1, value: 3 }, { id: 'l', label: 'Angular l', unit: '', min: 0, max: 4, step: 1, value: 0 }],
      beats: [[0, 'A slice through the electron cloud of the state (n, l, m = 0).'], [4, 'Right: the radial probability P(r) = r²R(r)², with r in Bohr radii.'], [8, 'Its zeros are the radial nodes: there are n − l − 1 of them.'], [11, 'The states with l = n − 1 have no radial node and peak at r = n²a₀, the Bohr orbits.']],
      draw(s, t) {
        const n = Math.round(s.p.n), l = Math.min(Math.round(s.p.l), n - 1), sf = SF(), key = lagKey(s, n, l), NX = 150, im = s.pix('h', NX, NX), rmax = 3.2 * n * n + 6;
        if (s.state.k !== key) {
          s.state.k = key; let mx = 0; const v = new Float32Array(NX * NX);
          for (let j = 0; j < NX; j++) for (let i = 0; i < NX; i++) {
            const x = ((i + 0.5) / NX - 0.5) * 2 * rmax * 0.62, z = (0.5 - (j + 0.5) / NX) * 2 * rmax * 0.62, r = Math.hypot(x, z), ct = r ? z / r : 1;
            const ps = sf.Rnl(n, l, r) * sf.legendreP(l, ct); const w = ps * ps; v[j * NX + i] = w; if (w > mx) mx = w;
          }
          for (let p = 0; p < NX * NX; p++) { const a = Math.pow(v[p] / mx, 0.3); im.d[4 * p] = 40 + 215 * a; im.d[4 * p + 1] = 60 + 150 * a; im.d[4 * p + 2] = 90 + 30 * a; im.d[4 * p + 3] = 255 * Math.min(1, 1.6 * a); }
        }
        s.alpha(s.in(t, 0, 1.2), () => s.blit(im, 40, 50, 420, 420));
        s.alpha(s.in(t, 0.5, 1), () => { s.txt('n = ' + n + ', l = ' + l + '  (' + n + 'spdfg'[l] + ')', 250, 495, { c: C.yellow, size: 20, align: 'center', sans: true }); s.txt('z', 250, 40, { c: C.dim, size: 15, align: 'center', sans: true }); s.txt('slice through |ψ|² (brightness compressed)', 250, 520, { c: C.dim, size: 13, align: 'center', sans: true }); s.txt('x', 470, 260, { c: C.dim, size: 15, sans: true }); });
        const P = (r) => r * r * sf.Rnl(n, l, r) ** 2, rr = 2.4 * n * n + 6;
        let pm = 0; for (let i = 1; i <= 300; i++) pm = Math.max(pm, P(rr * i / 300));
        const B = s.axes({ x0: 520, y0: 440, w: 390, h: 300, xr: [0, rr], yr: [0, 1.15], xt: [0, rr, Math.max(2, Math.round(rr / 6))], yt: [0, 1, 0.5], xl: 'r/a₀', yl: 'P(r)', ytl: false });
        B.draw(s.in(t, 4, 1));
        if (t > 4.3) {
          const q = s.in(t, 4.3, 2.2);
          s.alpha(0.25, () => s.poly([[B.X(0), B.Y(0)], ...Array.from({ length: 301 }, (_, i) => [B.X(rr * q * i / 300), B.Y(P(rr * q * i / 300) / pm)]), [B.X(rr * q), B.Y(0)]], { fill: C.teal, fa: 1, stroke: false }));
          B.fn((r) => P(r) / pm, 0, rr * q, { c: C.teal, w: 3, n: 400 });
        }
        if (t > 8) {
          const nodes = sf.zeros((r) => sf.laguerre(n - l - 1, 2 * l + 1, 2 * r / n), 0.05, rr, 0.02, 6);
          s.alpha(s.in(t, 8, 1), () => { nodes.forEach((z) => s.dot(B.X(z), B.Y(0), { c: C.red, r: 6 })); s.txt('radial nodes: ' + nodes.length + ' = n − l − 1', 900, 150, { c: C.red, size: 17, align: 'right', sans: true }); });
        }
        s.alpha(s.in(t, 11, 1), () => {
          const rm = 0.5 * (3 * n * n - l * (l + 1)); s.line(B.X(rm), B.Y(0), B.X(rm), B.Y(1.05), { c: C.yellow, w: 1.5, dash: [5, 5] });
          s.txt('⟨r⟩ = ' + rm + ' a₀', B.X(rm) + 6, B.Y(1.1), { c: C.yellow, size: 15, sans: true });
          s.txt('E = −13.6 eV / ' + n * n + ' = ' + (-13.6057 / (n * n)).toFixed(3) + ' eV', 900, 180, { c: C.dim, size: 16, align: 'right', sans: true });
        });
      }
    },
    steps: [
      { say: 'Separate ψ = R(r)Y_{lm}(θ, φ) and set u = rR. The radial equation is a 1-D problem with an effective potential:', tex: R`-\frac{\hbar^2}{2m}\frac{d^2u}{dr^2} + \left[-\frac{e^2}{4\pi\varepsilon_0 r} + \frac{\hbar^2 l(l+1)}{2mr^2}\right]u = Eu`, why: 'With ψ = (u/r)Y, the radial part of ∇² becomes (1/r)d²u/dr², and the angular part acting on Y gives −l(l + 1)/r². The extra term is the centrifugal barrier, which keeps l > 0 electrons away from the nucleus.' },
      { say: 'For a bound state E < 0. Scale distances with κ and x = 2κr:', tex: R`E = -\frac{\hbar^2\kappa^2}{2m},\quad x = 2\kappa r,\quad \lambda = \frac{1}{\kappa a_0}\;\Longrightarrow\; \frac{d^2u}{dx^2} = \left[\frac14 - \frac{\lambda}{x} + \frac{l(l+1)}{x^2}\right]u`, why: 'Here a₀ = 4πε₀ħ²/me² = 0.529 Å is the Bohr radius. Every physical constant is now hidden inside the single number λ, which will turn out to be the principal quantum number.' },
      { say: 'Peel off the behaviour at both ends:', tex: R`u \sim x^{\,l+1}\ (x\to0),\qquad u\sim e^{-x/2}\ (x\to\infty)\;\Longrightarrow\; u = x^{\,l+1}e^{-x/2}\,v(x),\qquad x\,v'' + (2l + 2 - x)\,v' + (\lambda - l - 1)\,v = 0`, why: 'Near x = 0 the centrifugal term dominates, so u ~ x^{l+1} (the other choice x^{−l} is not normalisable or makes ψ singular). Far away only ¼ survives, so u ~ e^{−x/2}. What is left over obeys the associated Laguerre equation x y″ + (α + 1 − x)y′ + N y = 0 with α = 2l + 1.' },
      { say: 'Try a power series for v:', tex: R`v = \sum_j c_j x^j,\qquad c_{j+1} = \frac{j + l + 1 - \lambda}{(j+1)(j+2l+2)}\,c_j`, why: 'Collecting the coefficient of xʲ gives (j + 1)(j + 2l + 2)c_{j+1} = (j + l + 1 − λ)c_j. For large j the ratio tends to 1/j, the ratio for eˣ, so a series that never stops makes u ~ e^{+x/2}: not normalisable.' },
      { say: 'So the series must stop at some j = n_r: λ is a whole number n, and the energy is quantised:', tex: R`\lambda = n_r + l + 1 \equiv n = 1, 2, 3,\dots\;\Longrightarrow\; E_n = -\frac{\hbar^2}{2ma_0^2}\,\frac{1}{n^2} = -\frac{13.6\ \text{eV}}{n^2}`, why: 'λ = 1/(κa₀) = n gives κ = 1/(na₀), so x = 2r/(na₀). The energy depends only on n, not on l: for each n the values l = 0, …, n − 1 are degenerate. That degeneracy is special to the 1/r potential.' },
      { say: 'The terminating polynomials are associated Laguerre polynomials; normalising gives the radial functions:', tex: R`R_{nl}(r) = N_{nl}\left(\frac{2r}{na_0}\right)^{l} e^{-r/na_0}\,L^{(2l+1)}_{n-l-1}\!\left(\frac{2r}{na_0}\right),\qquad \int_0^\infty x^{\alpha}e^{-x}L^{(\alpha)}_m L^{(\alpha)}_k\,dx = \frac{\Gamma(k+\alpha+1)}{k!}\,\delta_{mk}`, why: 'L^{(α)}_k has degree k = n − l − 1, so there are exactly n − l − 1 radial nodes. Examples: R₁₀ ∝ e^{−r/a₀}, R₂₀ ∝ (1 − r/2a₀)e^{−r/2a₀}, R₂₁ ∝ r e^{−r/2a₀}. The orthogonality weight xᵅe^{−x} comes from writing the equation in Sturm–Liouville form.' }
    ],
    result: R`\psi_{nlm} = R_{nl}(r)\,Y_{lm}(\theta,\varphi),\qquad E_n = -\frac{13.6\ \text{eV}}{n^2},\qquad \langle r\rangle_{nl} = \frac{a_0}{2}\left[3n^2 - l(l+1)\right]`,
    assumptions: ['Infinite nuclear mass was assumed. Using the reduced mass μ = mₑm_p/(mₑ + m_p) shifts every level by about 1/1836. Deuterium’s slightly larger reduced mass moves Hα by about 0.18 nm, which is how deuterium was discovered (Urey, 1932).',
      'The n² degeneracy (2s with 2p, and so on) is exact only for a non-relativistic point charge. Fine structure splits 2p₃/₂ from 2p₁/₂ by 10.97 GHz, and the Lamb shift (2s₁/₂ above 2p₁/₂ by 1057.8 MHz, measured 1947) contradicts the Laguerre solution outright. It needed QED.',
      'Conventions clash: older physics books write L^{2l+1}_{n+l} with a different normalisation. The form here, L^{(2l+1)}_{n−l−1}, is the one used in modern references and in SciPy’s genlaguerre. Always check which convention a formula assumes before combining it with another.'],
    quiz: { q: 'How many radial nodes does the 4d state (n = 4, l = 2) have?', a: ['1', '2', '3', '0'], c: 0, ex: 'n − l − 1 = 4 − 2 − 1 = 1: the Laguerre polynomial L^{(5)}₁ is linear, with one root.' },
    try: 'Keep n = 3 and step l from 0 to 2: the radial nodes go 2, 1, 0 while the energy stays at −1.512 eV. Then set l = n − 1 for several n and watch P(r) peak at n² Bohr radii.'
  });

  /* ------------------------------------------------------------ Airy */
  const AZ = [2.338107, 4.087949, 5.520560, 6.786708, 7.944134];
  WL.topic({
    id: 'm-airy', stage: 'msf', strand: 'D', title: 'Airy Functions & Turning Points',
    summary: 'Waves in a linear potential: the function that joins oscillation to decay.',
    maths: [['Power-series solutions', 'y = Σ cₖ xᵏ'], ['Fourier transforms', 'f(x) = ∫F(k)e^{ikx}dk/2π'], ['Stationary phase', '∫e^{iφ(t)}dt'], ['WKB approximation', 'ψ ≈ p^{−1/2}e^{±i∫p dx/ħ}']],
    idea: 'Wherever a wave meets a turning point, where its energy equals the potential, the local equation is $y\'\' = xy$. Its decaying solution $\\mathrm{Ai}(x)$ oscillates on one side and dies away on the other, joining the two regions smoothly. It fixes the π/4 phase in the WKB quantisation rule, the spacing of a rainbow’s supernumerary bands, and the energies of a neutron bouncing on a mirror under gravity.',
    anim: {
      duration: 15, alt: 'Graphs of Ai and Bi, then the quantum bouncer: a linear gravitational potential above a hard floor with its levels at the zeros of Ai.',
      params: [{ id: 'n', label: 'Bouncer level n', unit: '', min: 1, max: 5, step: 1, value: 2 }],
      beats: [[0, 'Ai(x) and Bi(x): oscillating where x < 0, decaying or growing where x > 0.'], [5, 'A neutron above a mirror feels V = mgz: a linear potential with a hard floor.'], [8, 'Its wavefunction is Ai(z/l₀ + aₙ), which must vanish at the floor: the energies sit at the zeros of Ai.'], [12, 'The levels are not evenly spaced: Eₙ grows like n^{2/3}.']],
      draw(s, t) {
        const n = Math.round(s.p.n), sf = SF(), an = AZ[n - 1];
        const A = s.axes({ x0: 40, y0: 260, w: 400, h: 200, xr: [-10, 3], yr: [-0.6, 1.2], xt: [-10, 2, 2], yt: [-0.5, 1, 0.5], xl: 'x', yl: '', yfmt: (v) => v.toFixed(1) });
        A.draw(s.in(t, 0, 1));
        if (t > 0.6) { const q = s.in(t, 0.6, 2.5); A.fn(sf.airyAi, -10, -10 + 13 * q, { c: C.yellow, w: 3, n: 500 }); A.fn(sf.airyBi, -10, -10 + 11 * q, { c: C.blue, w: 2, n: 500 }); }
        s.alpha(s.in(t, 2.5, 1), () => { s.txt('Ai', A.X(1.6), A.Y(0.25), { c: C.yellow, size: 18, sans: true }); s.txt('Bi', A.X(-0.6), A.Y(1.0), { c: C.blue, size: 18, sans: true }); s.txt('y″ = x y', 230, 40, { c: C.ink, size: 22, align: 'center' }); });
        const B = s.axes({ x0: 520, y0: 480, w: 380, h: 410, xr: [0, 10], yr: [0, 9.5], xt: [0, 10, 2], yt: [0, 9, 1], xl: 'z / l₀', yl: 'E / mgl₀', ytl: true });
        B.draw(s.in(t, 5, 1));
        s.alpha(s.in(t, 5.2, 1), () => { B.fn((z) => z, 0, 9.5, { c: C.dim, w: 2 }); s.rect(B.X(0) - 14, B.Y(9.5), 14, B.Y(0) - B.Y(9.5), { fill: 'rgba(150,170,190,0.25)', stroke: false }); s.txt('mirror', B.X(0) - 8, B.Y(9.5) - 12, { c: C.dim, size: 13, align: 'center', sans: true }); });
        AZ.forEach((e, k) => s.line(B.X(0), B.Y(e), B.X(e), B.Y(e), { c: k === n - 1 ? C.yellow : 'rgba(150,170,190,0.35)', w: k === n - 1 ? 2 : 1, p: s.in(t, 7 + 0.2 * k, 0.6) }));
        if (t > 8.5) { const q = s.in(t, 8.5, 2); B.fn((z) => an + 1.3 * sf.airyAi(z - an), 0, 10 * q, { c: C.teal, w: 3, n: 400 }); }
        s.alpha(s.in(t, 10.5, 1), () => {
          s.txt('E' + '₁₂₃₄₅'[n - 1] + ' = ' + an.toFixed(3) + ' mgl₀', 900, 120, { c: C.yellow, size: 18, align: 'right', sans: true });
          s.txt('neutron: l₀ = 5.87 μm, E' + '₁₂₃₄₅'[n - 1] + ' = ' + (an * 0.6018).toFixed(2) + ' peV', 900, 146, { c: C.dim, size: 15, align: 'right', sans: true });
        });
        s.alpha(s.in(t, 12.5, 1), () => s.math('WKB: (3π(n − ¼)/2)^{2/3} = ' + Math.pow(1.5 * PI * (n - 0.25), 2 / 3).toFixed(3), 900, 172, { c: C.dim, size: 16, align: 'right', upright: true }));
      }
    },
    steps: [
      { say: 'Near a turning point x_t any smooth potential is a straight line. Rescaling turns the Schrödinger equation into Airy’s equation:', tex: R`V(x)\approx E + F\,(x - x_t),\qquad z = \left(\frac{2mF}{\hbar^2}\right)^{1/3}(x - x_t)\;\Longrightarrow\; \frac{d^2\psi}{dz^2} = z\,\psi`, why: 'Substituting the linear potential gives ψ″ = (2mF/ħ²)(x − x_t)ψ. Choosing the length scale (ħ²/2mF)^{1/3} makes the coefficient one. Every turning point of every smooth potential looks like this under a microscope.' },
      { say: 'Solve by a power series. The coefficients jump in steps of three:', tex: R`\psi = \sum_k c_k z^k,\quad c_2 = 0,\quad c_{k+3} = \frac{c_k}{(k+2)(k+3)};\qquad f = 1 + \frac{z^3}{6} + \frac{z^6}{180} + \cdots,\quad g = z + \frac{z^4}{12} + \cdots`, why: 'ψ″ = Σ k(k − 1)c_k z^{k−2} must equal Σ c_k z^{k+1}. Matching powers of z gives the recurrence, and the z⁰ term forces c₂ = 0. The two independent series converge for all z; Ai and Bi are particular combinations of f and g.' },
      { say: 'A Fourier transform gives an integral formula, which is the best route to the behaviour far away:', tex: R`-k^2\Psi = i\frac{d\Psi}{dk}\;\Rightarrow\;\Psi = e^{ik^3/3},\qquad \mathrm{Ai}(z) = \frac{1}{\pi}\int_0^\infty \cos\!\left(\frac{t^3}{3} + zt\right)dt`, why: 'In Fourier space d²/dz² becomes −k² and multiplication by z becomes i d/dk, so the equation drops to first order and integrates at once. The integral picks the solution that decays for z > 0, normalised so that Ai(0) = 0.3550.' },
      { say: 'Stationary phase on the integral gives the asymptotic forms on the two sides:', tex: R`\mathrm{Ai}(z)\approx\frac{e^{-\zeta}}{2\sqrt\pi\,z^{1/4}}\ (z\to+\infty),\qquad \mathrm{Ai}(-z)\approx\frac{\sin(\zeta + \pi/4)}{\sqrt\pi\,z^{1/4}}\ (z\to+\infty),\qquad \zeta = \tfrac23 z^{3/2}`, why: 'For z < 0 the phase t³/3 + zt is stationary at t = √(−z), and the Gaussian integral around that point produces the oscillation and the extra π/4. For z > 0 there is no real stationary point; deforming the contour to the saddle at t = i√z gives the exponential decay.' },
      { say: 'Match to WKB waves on either side: the turning point contributes a phase of π/4 each time. For a well with two soft walls:', tex: R`\int_{x_1}^{x_2}p\,dx = \left(n + \tfrac12\right)\pi\hbar,\qquad n = 0, 1, 2,\dots`, why: 'Far from the turning point the Airy asymptotics coincide with the WKB forms p^{−1/2}sin(∫p dx/ħ + π/4) and p^{−1/2}e^{−∫|p|dx/ħ}, so Ai is the bridge that tells WKB how to connect them. Two soft walls give two quarter-phases, the ½ in the rule. A hard wall instead gives ψ = 0 and changes ½ to ¾ (one soft wall plus one hard wall).' },
      { say: 'A neutron bouncing on a mirror: V = mgz above a hard floor. The floor demands ψ(0) = 0, so the energies are set by the zeros aₙ of Ai:', tex: R`\psi_n(z) = \mathrm{Ai}\!\left(\frac{z}{l_0} + a_n\right),\quad l_0 = \left(\frac{\hbar^2}{2m^2g}\right)^{1/3},\quad E_n = |a_n|\left(\frac{mg^2\hbar^2}{2}\right)^{1/3}`, why: 'a₁ = −2.338, a₂ = −4.088, a₃ = −5.521. For a neutron l₀ = 5.87 μm, so the ground state has E₁ = 1.41 peV and a classical height of 13.7 μm. WKB with one hard and one soft wall gives |aₙ| ≈ [3π(n − ¼)/2]^{2/3} = 2.320, 4.082, 5.517: already within 1%.' }
    ],
    result: R`\mathrm{Ai}''(z) = z\,\mathrm{Ai}(z),\qquad \mathrm{Ai}(z) = \frac{1}{\pi}\int_0^{\infty}\cos\!\left(\frac{t^3}{3} + zt\right)dt,\qquad E_n = |a_n|\left(\frac{mg^2\hbar^2}{2}\right)^{1/3}`,
    assumptions: ['The linear approximation holds only within a few l₀ of the turning point. If two turning points come closer than that (near the top of a barrier), the Airy connection fails and parabolic-cylinder functions are needed.',
      'The quantum bouncer has been measured: neutrons passing through a narrow slit above a mirror are blocked unless the slit exceeds the first quantum height (Nesvizhevsky et al., 2002), and resonance spectroscopy between levels (qBounce, from 2011) agrees with the Airy-zero spacing, e.g. a |1⟩→|3⟩ transition near 463 Hz. The ideal hard floor is justified because the mirror’s repulsive potential (~100 neV) dwarfs peV energies.',
      'Geometric optics predicts infinite intensity at a caustic, such as the rainbow angle, which is impossible. Airy (1838) showed the wave intensity near a caustic is proportional to Ai², finite and with supernumerary fringes whose spacing depends on droplet size, as observed.'],
    quiz: { q: 'Why is the bouncing neutron’s ground-state energy not zero?', a: ['ψ must vanish at the floor and decay above it, so the energy sits at the first zero of Ai', 'Gravity is quantised', 'The mirror pushes it up', 'Because of spin'], c: 0, ex: 'Shifting Ai until its first zero sits at the floor gives E₁ = |a₁|·mgl₀ = 2.338 mgl₀ ≈ 1.41 peV for a neutron: confinement costs kinetic energy.' },
    try: 'Step the bouncer from n = 1 to 5. The gaps shrink (1.75, 1.43, 1.27, 1.16 in units of mgl₀) because the well widens as the energy rises, unlike the evenly spaced oscillator.'
  });

  /* ------------------------------------------------------------ error function */
  const GN = (() => { let u = 12345; const r = () => ((u = (u * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff); const a = []; for (let i = 0; i < 420; i++) { const x0 = -7 * r(), g = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * PI * r()); a.push([x0, g, r()]); } return a; })();
  WL.topic({
    id: 'm-erf', stage: 'msf', strand: 'P', title: 'Gaussian Integrals & the Error Function',
    summary: 'The bell curve has no elementary antiderivative, so we named one, and it runs diffusion and statistics.',
    maths: [['Double integrals in polar form', 'dx dy = r dr dθ'], ['Differentiation under the integral', 'd/da ∫f(x,a)dx'], ['Partial differential equations', '∂c/∂t = D∂²c/∂x²'], ['Normal distribution', 'N(μ, σ²)']],
    idea: 'The Gaussian $e^{-x^2}$ has no antiderivative made of elementary functions, yet its full integral is exactly $\\sqrt\\pi$. Naming its partial integral, $\\mathrm{erf}(x) = \\frac{2}{\\sqrt\\pi}\\int_0^x e^{-t^2}dt$, gives the probability of landing within a given number of standard deviations, and the exact profile of heat or ink spreading from a sharp edge: $c = \\tfrac{c_0}{2}\\,\\mathrm{erfc}\\big(x/2\\sqrt{Dt}\\big)$.',
    anim: {
      duration: 15, alt: 'A bell curve with the region within k standard deviations shaded and its probability, beside dye particles diffusing from a sharp edge with the error-function profile overlaid.',
      params: [{ id: 'k', label: 'Width k (in σ)', unit: '', min: 0.25, max: 3.5, step: 0.05, value: 2 }],
      beats: [[0, 'The area within ±kσ of the mean is erf(k/√2).'], [5, 'Right: particles start packed on the left of a wall that is then removed.'], [8, 'Each particle random-walks; the density follows ½ erfc(x/2√(Dt)) at every moment.'], [12, 'Plotted against x/√t the profiles collapse onto one curve: diffusion has no length scale of its own.']],
      draw(s, t) {
        const k = s.p.k, sf = SF(), A = s.axes({ x0: 40, y0: 360, w: 400, h: 250, xr: [-4, 4], yr: [0, 0.45], xt: [-4, 4, 1], yt: [0, 0.4, 0.1], xl: 'x/σ', yl: '', yfmt: (v) => v.toFixed(1) });
        const g = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * PI);
        A.draw(s.in(t, 0, 1));
        if (t > 0.5) {
          const pts = []; for (let i = 0; i <= 200; i++) { const x = -k + 2 * k * i / 200; pts.push([A.X(x), A.Y(g(x))]); }
          s.alpha(0.35 * s.in(t, 1.5, 1), () => s.poly([[A.X(-k), A.Y(0)], ...pts, [A.X(k), A.Y(0)]], { fill: C.teal, fa: 1, stroke: false }));
          A.fn(g, -4, -4 + 8 * s.in(t, 0.5, 1.5), { c: C.ink, w: 3 });
        }
        s.alpha(s.in(t, 2.5, 1), () => { s.txt('P(|x − μ| < ' + k.toFixed(2) + 'σ) = erf(k/√2) = ' + (100 * sf.erf(k / Math.SQRT2)).toFixed(2) + '%', 240, 60, { c: C.teal, size: 18, align: 'center', sans: true }); s.txt('68.27% · 95.45% · 99.73% at k = 1, 2, 3', 240, 400, { c: C.dim, size: 15, align: 'center', sans: true }); });
        const x0 = 530, x1 = 910, xm = (x0 + x1) / 2, sc = 50, yb = 470, tt = Math.max(0, t - 5.5), Dt = 0.004 + 0.16 * tt;
        s.alpha(s.in(t, 5, 1), () => {
          s.rect(x0, 110, x1 - x0, 220, { c: C.dim, w: 1 });
          if (tt <= 0) s.line(xm, 110, xm, 330, { c: C.ink, w: 3 });
          GN.forEach(([xi, gi, yi]) => { const x = xi + Math.sqrt(2 * Dt) * gi; if (Math.abs(x) < 3.75) s.dot(xm + x * sc, 115 + 210 * yi, { c: C.yellow, r: 2 }); });
        });
        const B = s.axes({ x0, y0: yb, w: x1 - x0, h: 110, xr: [-3.8, 3.8], yr: [0, 1.1], xt: [-3, 3, 1], yt: [0, 1, 0.5], xl: 'x', yl: '', ytl: false });
        B.draw(s.in(t, 7, 1));
        if (t > 7.5) {
          [0.15, 0.6, 1.6].forEach((d, i) => s.alpha(0.35, () => B.fn((x) => 0.5 * sf.erfc(x / (2 * Math.sqrt(d))), -3.8, 3.8, { c: C.dim, w: 1.5 })));
          B.fn((x) => 0.5 * sf.erfc(x / (2 * Math.sqrt(Dt))), -3.8, 3.8, { c: C.red, w: 3, p: s.in(t, 7.5, 1) });
          s.txt('c/c₀ = ½ erfc(x / 2√(Dt))', xm, 92, { c: C.red, size: 16, align: 'center', sans: true, p: s.in(t, 8, 1) });
        }
        s.alpha(s.in(t, 12, 1), () => s.txt('every curve is the same shape in η = x/2√(Dt)', xm, 522, { c: C.dim, size: 15, align: 'center', sans: true }));
      }
    },
    steps: [
      { say: 'Square the Gaussian integral and switch to polar coordinates:', tex: R`I = \int_{-\infty}^{\infty}e^{-x^2}dx,\qquad I^2 = \iint e^{-(x^2+y^2)}dx\,dy = \int_0^{2\pi}\!\!\int_0^{\infty}e^{-r^2}r\,dr\,d\theta = \pi\;\Longrightarrow\; I = \sqrt\pi`, why: 'The product of two independent integrals is a double integral over the plane, and e^{−x²}e^{−y²} = e^{−r²} depends only on r. The extra r in the area element r dr dθ makes the radial integral elementary: ∫₀^∞ r e^{−r²}dr = ½.' },
      { say: 'Rescale, then differentiate with respect to the width to get every moment:', tex: R`\int_{-\infty}^{\infty}e^{-ax^2}dx = \sqrt{\frac{\pi}{a}},\qquad \int_{-\infty}^{\infty}x^2e^{-ax^2}dx = -\frac{d}{da}\sqrt{\frac{\pi}{a}} = \frac{\sqrt\pi}{2a^{3/2}}`, why: 'Substituting u = √a x gives the first result. Differentiating under the integral with respect to a brings down −x² each time; n derivatives give ∫x^{2n}e^{−ax²}dx = Γ(n + ½)/a^{n+½}. With a = 1/2σ² this shows the variance of N(0, σ²) is σ².' },
      { say: 'The partial integral cannot be written with elementary functions, so define it:', tex: R`\mathrm{erf}(x) = \frac{2}{\sqrt\pi}\int_0^x e^{-t^2}dt = \frac{2}{\sqrt\pi}\sum_{n=0}^{\infty}\frac{(-1)^n x^{2n+1}}{n!\,(2n+1)},\qquad \mathrm{erfc}(x) = 1 - \mathrm{erf}(x)`, why: 'The factor 2/√π makes erf(∞) = 1. The series comes from integrating the Taylor series of e^{−t²} term by term; it converges for every x but needs many terms beyond x ≈ 3. Liouville’s theorem (1830s) proves no elementary antiderivative exists.' },
      { say: 'For a normal variable, the chance of falling within k standard deviations:', tex: R`P(|X - \mu| < k\sigma) = \int_{-k\sigma}^{k\sigma}\frac{e^{-x^2/2\sigma^2}}{\sqrt{2\pi}\,\sigma}\,dx = \mathrm{erf}\!\left(\frac{k}{\sqrt2}\right):\quad 68.27\%,\ 95.45\%,\ 99.73\%`, why: 'Substitute t = x/(σ√2): the limits become ±k/√2 and the prefactor becomes 1/√π, which over a symmetric interval gives erf(k/√2). The one-sided tail beyond 5σ, the particle-physics discovery threshold, is ½erfc(5/√2) = 2.9 × 10⁻⁷.' },
      { say: 'Diffusion from a sharp step: look for a solution that depends only on η = x/(2√(Dt)):', tex: R`\frac{\partial c}{\partial t} = D\frac{\partial^2 c}{\partial x^2},\quad c = f(\eta)\;\Longrightarrow\; f'' + 2\eta f' = 0\;\Longrightarrow\; c(x,t) = \frac{c_0}{2}\,\mathrm{erfc}\!\left(\frac{x}{2\sqrt{Dt}}\right)`, why: 'With c = f(η): ∂c/∂t = −ηf′/2t and ∂²c/∂x² = f″/4Dt, so the PDE becomes the ODE f″ = −2ηf′. Then f′ ∝ e^{−η²} and f = A + B erf(η); the initial step (c₀ for x < 0, 0 for x > 0) fixes A = −B = c₀/2. The spreading front moves as √t, not t.' },
      { say: 'For large x, integrate by parts repeatedly to get an asymptotic series:', tex: R`\mathrm{erfc}(x) = \frac{e^{-x^2}}{x\sqrt\pi}\left(1 - \frac{1}{2x^2} + \frac{3}{4x^4} - \frac{15}{8x^6} + \cdots\right)`, why: 'Write e^{−t²} = (−1/2t)d(e^{−t²})/dt and integrate by parts; each step produces the next term. The series diverges for every x (the coefficients grow like factorials) but its first few terms are extremely accurate: at x = 2 two terms give 0.004521 against the exact 0.004678.' }
    ],
    result: R`\int_{-\infty}^{\infty}e^{-ax^2}dx = \sqrt{\frac{\pi}{a}},\qquad P(|X-\mu|<k\sigma) = \mathrm{erf}\!\left(\frac{k}{\sqrt2}\right),\qquad c = \frac{c_0}{2}\,\mathrm{erfc}\!\left(\frac{x}{2\sqrt{Dt}}\right)`,
    assumptions: ['The erfc solution assumes a constant diffusivity and pure conduction or diffusion. Kelvin (1862) used exactly this solution for a cooling Earth and found an age of 20–400 million years, later narrowed to 20–40 million. Radiometric dating gives 4.54 billion. His hidden assumptions were no internal heat source (radioactivity was unknown) and no convection in the mantle.',
      'The 68–95–99.7 rule is true only for Gaussian data. Heavy-tailed distributions (from systematic errors, or from Lorentzian line shapes in spectroscopy) put far more probability beyond 3σ, so a “5σ” claim also relies on the tails being Gaussian and on correcting for the look-elsewhere effect.',
      'The central limit theorem explains why Gaussians are everywhere, but it needs finite variance. A Cauchy (Lorentzian) variable has none, and averaging many of them never narrows the distribution.'],
    quiz: { q: 'What fraction of a normal distribution lies within ±2σ of the mean?', a: ['95.45%', '68.27%', '99.73%', '90%'], c: 0, ex: 'erf(2/√2) = erf(1.414) = 0.9545.' },
    try: 'Set k = 1, 2 and 3 to recover 68.27%, 95.45% and 99.73%. Then watch the diffusion panel: the front never has a sharp edge, and its width grows as √t.'
  });
})();
