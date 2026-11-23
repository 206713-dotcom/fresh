/* Geodesic: "See it like Feynman" sections, msf. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('m-special', [
  'Sines, Legendre polynomials and Bessel functions, the special functions of physics, are all orthogonal families, so almost any function can be built from them.',
  'They are the eigenfunctions of self-adjoint differential operators, written in **Sturm–Liouville** form. Like the eigenvectors of a symmetric matrix, they are orthogonal and complete.',
  '(py′)′ + qy = −λwy with suitable boundary conditions has real eigenvalues, growing without bound, and eigenfunctions orthogonal with weight w.',
  'For y″ = −λy with y(0) = y(π) = 0, λ = n² and y = sin nx: the Fourier sine series.',
  'Singular problems, on infinite intervals or with p = 0 at an end, can have continuous spectra instead.'
]);
WL.fy('m-frobenius', [
  'Bessel’s equation has a singular point at x = 0, yet its solutions can still be written as power series, times a power of x.',
  'Near a regular singular point, try y = xʳΣaₙxⁿ. The lowest power gives the **indicial equation** for r, and the rest give a recurrence for the coefficients.',
  'At a regular singular point the coefficients have only mild poles, so the solutions start like a power xʳ. If the two values of r differ by a whole number, the second solution may contain a logarithm.',
  'For Bessel’s equation of order 0, r = 0 twice, and J₀(x) = 1 − x²/4 + x⁴/64 − x⁶/2304 + …; at x = 1 these four terms give 0.7652, the exact value to four places.',
  'At irregular singular points, such as infinity for many equations, the series may not converge, and asymptotic expansions are needed.'
]);
WL.fy('m-hypergeometric', [
  'Legendre polynomials, elliptic integrals, even arcsin and ln(1 + x), are all special cases of one function, ₂F₁(a, b; c; x).',
  'In a **hypergeometric series**, the ratio of successive coefficients is a rational function of n. ₂F₁ solves the equation with three regular singular points, at 0, 1 and ∞.',
  '₂F₁(a, b; c; x) = Σ(a)ₙ(b)ₙ/((c)ₙ n!) xⁿ, and many classical functions fit: ln(1 + x) = x ₂F₁(1, 1; 2; −x).',
  'At x = 1 that gives 1 − 1/2 + 1/3 − … = ln 2 ≈ 0.693.',
  'The series converges inside |x| < 1 (on the circle |x| = 1 only for some a, b and c, as here at x = 1); beyond it, analytic continuation formulas are needed.'
]);
WL.fy('m-jacobi', [
  'A pendulum swinging through large angles does not follow a sine wave. Its motion is described by sn, cn and dn, elliptic cousins of sine and cosine.',
  'sn(u, k) behaves like sin u for small k but flattens as k → 1. The **Jacobi elliptic functions** repeat in two directions of the complex plane: one real period and one imaginary.',
  'They invert elliptic integrals, just as sin inverts ∫dx/√(1 − x²). For the pendulum, sin(θ/2) = k sn(ωt, k) with k = sin(θ₀/2).',
  'At an amplitude of 90°, k = sin 45° ≈ 0.707, and the period is about 1.18 times the small-swing period.',
  'The solution ignores friction, and for a pendulum going right over the top (k > 1) different forms apply.'
]);
WL.fy('m-zeta', [
  'The Stefan–Boltzmann constant contains π⁴/15 ≈ 6.49, which comes from ζ(4) = π⁴/90: a number from pure mathematics inside a law about hot bodies.',
  'The **zeta function** is ζ(s) = Σ1/nˢ. Bose–Einstein integrals ∫xˢ⁻¹/(eˣ − 1)dx expand into sums of geometric series and come out as Γ(s)ζ(s).',
  '1/(eˣ − 1) = Σe^(−nx), and ∫xˢ⁻¹e^(−nx)dx = Γ(s)/nˢ. So ∫x³/(eˣ − 1)dx = 3! ζ(4) = 6π⁴/90 = π⁴/15.',
  'π⁴/15 ≈ 6.494.',
  'The Riemann hypothesis, about where ζ’s zeros lie, is still unproven: one of the great open problems of mathematics.'
]);
WL.fy('m-bessel-modified', [
  'Heat leaving a cooling fin, and alternating current crowding towards the surface of a wire, follow "modified" Bessel functions that grow or decay instead of oscillating.',
  'The **modified Bessel functions** I_n and K_n are Bessel functions of an imaginary argument, related to them as cosh and e^(−x) are to cos. **Hankel functions** combine J and Y into outgoing and incoming waves.',
  'x²y″ + xy′ − (x² + n²)y = 0: the changed sign makes the behaviour exponential, and K_n(x) ≈ √(π/2x)e^(−x) for large x.',
  'At x = 5 the large-x formula gives K₀ ≈ 0.0038, against the exact 0.0037.',
  'Near x = 0 the functions behave very differently (K_n blows up), so which pair to use depends on the region.'
]);
WL.fy('m-spherical-bessel', [
  'A sound wave meeting a small sphere scatters in a pattern built from spherical waves of increasing complexity, each described by a spherical Bessel function.',
  'In spherical coordinates the wave equation separates into spherical harmonics for the angles times **spherical Bessel functions** jₗ(kr) for the radius. Higher l keeps the wave further from the centre: the centrifugal barrier.',
  'jₗ(x) = (−x)ˡ((1/x)d/dx)ˡ(sin x/x), and for small x, jₗ ∝ xˡ: a partial wave with angular momentum l hardly reaches inside r ≈ l/k.',
  'j₀(x) = sin x/x, with its first zero at x = π, which sets the lowest radial mode of a spherical cavity.',
  'Spherical symmetry is an idealisation; a scatterer that is not round couples different values of l together.'
]);
WL.fy('m-orthopoly', [
  'Chebyshev polynomials give the best way to approximate a function by a polynomial over an interval, and they sit inside every maths library.',
  'T_n(cos θ) = cos nθ, so the **Chebyshev polynomials** ripple evenly between −1 and 1. Approximating with them spreads the error evenly instead of letting it pile up at the ends.',
  'Of all polynomials of degree n with leading coefficient 2ⁿ⁻¹, T_n has the smallest maximum on [−1, 1] (equioscillation). Interpolating at Chebyshev points avoids the wild oscillations of Runge’s example.',
  'T₂(x) = 2x² − 1 and T₃(x) = 4x³ − 3x; check: cos 3θ = 4cos³θ − 3cos θ.',
  'For functions with singularities near the interval convergence is slow, and for periodic functions Fourier series do better.'
]);
WL.fy('m-confluent', [
  'The radial wavefunctions of hydrogen and the wavefunctions of the quantum oscillator are special cases of one function, ₁F₁(a; c; x).',
  'Merging two singular points of the hypergeometric equation ("confluence") gives Kummer’s equation, solved by M(a, c, x) = ₁F₁. Bound states need the series to stop (a = −n), which gives polynomials and quantised energies.',
  'If the series does not stop, M grows like eˣ and the wavefunction cannot be normalised. Stopping at a = −n is the quantisation condition.',
  'For hydrogen it gives E = −13.6 eV/n²; for the oscillator, E = (n + ½)ħω.',
  'Scattering states, which are not bound, need the non-terminating solutions and their behaviour far away (Coulomb phase shifts).'
]);
WL.fy('m-mathieu', [
  'A child on a swing can pump it higher by standing and squatting twice each cycle, changing the pendulum’s length rhythmically: small swings grow exponentially (**parametric resonance**).',
  'y″ + (a − 2q cos 2t)y = 0 describes an oscillator whose stiffness varies periodically. **Floquet theory** says the solutions are periodic functions times e^(μt); in "tongues" of the (a, q) plane μ is real, and the solutions grow.',
  'The strongest instability comes when the stiffness varies at twice the natural frequency. The matrix that carries solutions over one period decides whether they grow.',
  'Vary an oscillator’s stiffness by ±5 % at twice its natural frequency and the swing grows by a factor e about every 13 cycles (rate εω₀/4 with ε = 0.05). Vary a pendulum’s length by ±5 % instead and it is about three times faster, every 4 swings or so, because pulling the bob in also speeds it up (rate 3εω₀/4).',
  'Damping must first be overcome, so there is a threshold, and at large amplitudes nonlinearity limits the growth.'
]);
WL.fy('m-theta', [
  'Heat diffusing round a ring can be written as a sum over images or as a Fourier series. Both are **theta functions**, and a beautiful identity links the two forms.',
  'Theta functions are rapidly converging sums such as Σe^(−πn²t). The Weierstrass ℘ function is doubly periodic with a double pole: the simplest function that repeats over a lattice.',
  'Poisson summation gives θ(t) = (1/√t)θ(1/t) for θ(t) = Σe^(−πn²t): short times (images) are tied to long times (Fourier modes).',
  'θ(1) = 1 + 2(e^(−π) + e^(−4π) + …) ≈ 1.0864, and at t = 1 the identity maps θ to itself.',
  'Here they are mainly tools for calculation; their deeper meaning (modular forms) reaches into number theory and string theory.'
]);
WL.fy('m-expint', [
  'The bright and dark fringes at the edge of a shadow (Fresnel diffraction) are described by integrals of cos(x²) and sin(x²), which have no elementary formula.',
  'The **Fresnel integrals** C(x) = ∫cos(πt²/2)dt and S(x) = ∫sin(πt²/2)dt, plotted against each other, trace the Cornu spiral, whose geometry gives the diffraction pattern.',
  'The phase of wavelets from points beyond a straight edge grows as the square of the distance, so adding them gives these integrals. As x → ∞, C and S both tend to ½.',
  'At the geometric edge of the shadow the intensity is a quarter of the unobstructed value (half the amplitude), and the first bright fringe outside reaches about 1.37 times it.',
  'Fresnel’s approximation assumes small angles and a thin, straight edge; real edges have thickness and polarisation effects.'
]);
WL.fy('m-elliptic', [
  'A pendulum released from 170° takes more than twice as long per swing as a small-amplitude one, and released from exactly 180°, upside down, it would wait for ever.',
  'Energy conservation gives the speed at every angle, and the period is the integral of dθ divided by the speed. Near the top the speed is tiny, so the time spent there dominates.',
  'T = 4√(L/g) K(k), with k = sin(θ₀/2) and K the complete **elliptic integral** of the first kind, which grows without limit (logarithmically) as k → 1.',
  'For θ₀ = 170°, k = sin 85° ≈ 0.996 and K ≈ ln(4/√(1 − k²)) ≈ 3.83, so T/T₀ = 3.83/(π/2) ≈ 2.4.',
  'Real pendulums have friction, and near the top only a rigid rod will do: a string would go slack.'
]);
WL.fy('m-bessel', [
  'A drum’s overtones are not whole-number multiples of its fundamental, which is why it sounds less "musical" than a string.',
  'A circular membrane vibrates in angular patterns times **Bessel functions** Jₙ(kr) along the radius. The frequencies are set by the zeros of Jₙ, which are not evenly spaced.',
  'The rim is fixed, so Jₙ(ka) = 0. The zeros of J₀ are 2.405, 5.520, 8.654, …, in ratios 1 : 2.295 : 3.598, not whole numbers.',
  'An ideal drum’s lowest modes are in the ratios 1 : 1.59 : 2.14 : 2.30 (from 3.832, 5.136 and 5.520 divided by 2.405).',
  'Real drums are affected by the air and by stiffness, which shift the modes; timpani are designed so that several overtones come close to harmonic ratios.'
]);
WL.fy('m-legendre', [
  'The Earth’s gravity is described by spherical harmonics, and the biggest correction to a perfect sphere, the "J₂" term, comes from the bulge at the equator.',
  'On a sphere, the natural vibration patterns are **spherical harmonics** Y_lm, whose dependence on latitude is given by Legendre functions P_l^m. Any function on a sphere is a sum of them, like a Fourier series.',
  'They are the angular eigenfunctions of the Laplacian, ∇²(rˡY_lm) = 0, and the expansion 1/|r − r′| = Σ(r<ˡ/r>ˡ⁺¹)P_l(cos γ) is the multipole expansion.',
  'The Earth’s J₂ ≈ 1.08 × 10⁻³ makes satellite orbits slowly turn; sun-synchronous orbits are chosen so that they turn by about 1° a day, keeping pace with the Sun.',
  'Shapes far from spherical are better fitted by other coordinates (spheroidal ones), and the expansion converges only outside a sphere enclosing the source.'
]);
WL.fy('m-gamma', [
  '0! = 1 and (½)! = √π/2: the factorial makes sense for fractions, and π turns up.',
  'The **gamma function**, Γ(z) = ∫₀^∞ t^(z−1)e^(−t)dt, extends the factorial, with Γ(n) = (n − 1)!. It is the only smooth extension whose logarithm is convex.',
  'Integration by parts gives Γ(z + 1) = zΓ(z), and Γ(1) = 1. Γ(½) = ∫t^(−½)e^(−t)dt = 2∫e^(−u²)du = √π.',
  'The volume of a unit ball in d dimensions is π^(d/2)/Γ(d/2 + 1): 4π/3 for d = 3, about 2.55 for d = 10, and it shrinks towards zero as d grows.',
  'Γ has poles at 0, −1, −2, …, and for large arguments Stirling’s approximation is needed.'
]);
WL.fy('m-hermite', [
  'The quantum oscillator’s wavefunctions look like Gaussians that wiggle more and more: the nth has exactly n nodes, and its shape is a Hermite polynomial times e^(−x²/2).',
  'The Gaussian is the ground state, and each step up the energy ladder multiplies it by a polynomial with one more zero (the raising operator a†).',
  'Substituting ψ = H(x)e^(−x²/2) gives Hermite’s equation, H″ − 2xH′ + 2nH = 0, which has polynomial, normalisable solutions only for whole-number n: the quantisation.',
  'H₀ = 1, H₁ = 2x and H₂ = 4x² − 2, so ψ₂ has its nodes at x = ±1/√2.',
  'Real molecular potentials are anharmonic, so their states follow Hermite functions only approximately.'
]);
WL.fy('m-laguerre', [
  'Each hydrogen wavefunction has a definite number of radial nodes, n − l − 1: the 2s state has one, the 2p state none.',
  'The radial wavefunction is a polynomial × rˡ × e^(−r/na₀), and the polynomial is an associated **Laguerre polynomial** whose zeros are the radial nodes.',
  'Bound states need the series to stop, or the wavefunction would grow like e^(+r). That fixes n as a positive whole number and gives E = −13.6 eV/n².',
  'For 2s, R ∝ (1 − r/2a₀)e^(−r/2a₀), with its node at r = 2a₀ ≈ 0.106 nm.',
  'Fine structure and spin shift the energies slightly, and atoms with many electrons need screened approximations.'
]);
WL.fy('m-airy', [
  'A rainbow’s bright edge is softened, and faint extra bands appear just inside it. Both are described by the Airy function.',
  'Near a turning point, where a classical particle stops and turns, or where rays fold into a caustic, the wave neither oscillates freely nor simply decays: it joins the two smoothly. The **Airy function** Ai(x) oscillates on one side and dies away exponentially on the other.',
  'Linearise the potential near the turning point and the equation becomes y″ = xy, solved by Ai(x). It joins the WKB solutions on either side (the connection formulas).',
  'Ai(x) peaks at x ≈ −1.02, so the brightest part of a caustic lies a little inside its geometric edge.',
  'Linearising fails if two turning points are close together; then parabolic cylinder functions are needed.'
]);
WL.fy('m-erf', [
  'The chance that a measurement falls within one standard deviation of the mean is 68.27 %, and within two, 95.45 %: numbers from one function, erf.',
  'erf(x) = (2/√π)∫₀ˣ e^(−t²)dt is the area under a Gaussian from the centre out to x. The same function describes how a sharp step in temperature smooths out by diffusion.',
  'P(|X − μ| < kσ) = erf(k/√2), and a diffusing step evolves as u(x, t) = ½(1 + erf(x/√(4Dt))).',
  'erf(1/√2) ≈ 0.6827 and erf(√2) ≈ 0.9545.',
  'There is no elementary formula, so erf is computed from series or rational approximations.'
]);
})();
