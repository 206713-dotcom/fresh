/* Geodesic: "See it like Feynman" sections, m3. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('m-hilbert', [
  'The same mathematics describes a list of three numbers and a wavefunction with infinitely many values: both can be added and scaled, and both have lengths and angles between them.',
  'A **Hilbert space** is a vector space with an inner product, complete in the sense that limits of sequences stay inside it. Kets |ψ⟩ are its vectors; bras ⟨φ| are the machines that take inner products, and ⟨φ|ψ⟩ is a number, an amplitude.',
  'Completeness lets infinite sums, such as Fourier series and expansions in eigenfunctions, converge to something inside the space. Hermitian operators have real eigenvalues and orthogonal eigenvectors: the mathematical reason measurements give real numbers.',
  'On [0, L] the functions sin(nπx/L) are orthogonal: ∫sin(πx/L) sin(2πx/L)dx = 0, and each is normalised by the factor √(2/L).',
  'Position and momentum "eigenstates", δ(x − a) and e^(ikx), have infinite length and are not in the Hilbert space at all; treating them rigorously needs rigged Hilbert spaces.'
]);
WL.fy('m-complex-analysis', [
  '∫ from −∞ to ∞ of dx/(1 + x²) = π, a real integral, is easiest found by a detour through the complex plane.',
  'For analytic functions, an integral round a closed loop depends only on the poles inside it: each contributes 2πi times its **residue**. Close the real line with a large semicircle on which the integrand vanishes, and count the poles.',
  'Cauchy’s theorem: ∮f dz = 0 for a function analytic inside the loop. Near a pole f ≈ c/(z − a), and ∮dz/(z − a) = 2πi.',
  '1/(1 + z²) has a pole at i with residue 1/(2i), so the integral is 2πi × 1/(2i) = π.',
  'The semicircle’s contribution must really vanish (oscillating integrands need Jordan’s lemma), and branch points need cuts.'
]);
WL.fy('m-numerical', [
  'Simulate a planet’s orbit with the simplest step-by-step method (Euler’s) and the planet slowly spirals outwards, gaining energy from nowhere.',
  'Each step replaces the curve by a short straight line, and the errors pile up. Some methods systematically add energy; better ones, such as the symplectic leapfrog, keep it nearly constant over millions of orbits.',
  'Euler’s method has a local error of order h² per step and a global error of order h. Applied to y″ = −ω²y, it multiplies the amplitude by √(1 + h²ω²) at every step: always growing.',
  'With 100 steps per orbit (hω ≈ 0.063) the amplitude grows by about 1.002 per step: about 22 % per orbit.',
  'Even good methods drift over very long times, and chaotic systems magnify every error, so long-term paths can be trusted only statistically.'
]);
WL.fy('m-tensors', [
  'Squeeze a block of rubber and it bulges sideways. The stress inside is not a single force: it depends on which face you look at and which direction you ask about.',
  'A **tensor** is a quantity that changes in a definite way when the coordinates are rotated. The stress tensor σ_ij gives the force per area in direction i on a face whose normal is j. Index notation, with the summation convention, writes complicated expressions compactly.',
  'Physical laws must hold in any coordinates, so they must equate tensors of the same type. σ_ij is symmetric because otherwise a tiny cube would spin up infinitely fast: angular momentum balance.',
  'The trace is the same in every rotated frame, so the pressure p = −(σ₁₁ + σ₂₂ + σ₃₃)/3 does not depend on the axes chosen.',
  'In curved spaces derivatives of tensors need connections (covariant derivatives), and not every array of numbers is a tensor.'
]);
WL.fy('m-green', [
  'To find the field of any arrangement of charges, you need only the field of a single point charge: add up point charges.',
  'A **Green’s function** is the response to a point source, a delta function. For a linear equation, the response to any source is the sum of point responses, weighted by the source.',
  'If LG = δ, then u = ∫G(x, x′)f(x′)dx′ solves Lu = f. For the Laplacian in three dimensions, G = −1/(4π|x − x′|).',
  'Integrating the 1/r Green’s function over a uniformly charged sphere gives, outside it, Q/(4πε₀r): as if all the charge sat at the centre.',
  'Boundary conditions change the Green’s function (the method of images handles simple shapes), and nonlinear equations have none.'
]);
WL.fy('m-conformal', [
  'To find the airflow past a wing, Joukowsky (around 1910) took the easy problem, flow past a circle, and mapped it onto a wing shape with a single complex function.',
  'Analytic functions w = f(z) map the plane while keeping angles, and they carry solutions of Laplace’s equation to solutions. Solve the problem in a simple shape, then map it onto the hard one: **conformal mapping**.',
  'If u is harmonic and f analytic, then u∘f is harmonic (the chain rule plus the Cauchy–Riemann equations). The Joukowsky map z + 1/z turns circles into wing-like shapes.',
  'z + 1/z sends the unit circle e^(iθ) to 2 cos θ: the segment from −2 to 2, a flat plate.',
  'Conformal maps work in two dimensions (in three, only Möbius maps keep angles), and real wings need viscosity, brought in as the extra Kutta condition.'
]);
WL.fy('m-branch-cuts', [
  'Walk once round the origin and √z changes sign: in the complex plane the square root has two values.',
  'Multi-valued functions such as √z and log z have **branch points**: going round one moves you to another value. A **branch cut** is a line you agree not to cross, which makes the function single-valued.',
  'With z = re^(iθ), √z = √r e^(iθ/2), and θ → θ + 2π multiplies it by e^(iπ) = −1. log z = ln r + iθ gains 2πi with each turn.',
  '**Analytic continuation**: Σzⁿ = 1/(1 − z) holds only for |z| < 1, but 1/(1 − z) defines the function everywhere except z = 1. At z = 2 it gives −1, though the series itself diverges there.',
  'Where to put a cut is a choice: physical results cannot depend on it, but intermediate formulas do.'
]);
WL.fy('m-integral-equations', [
  'A CT scanner measures X-ray absorption along thousands of lines through the body and reconstructs the density inside: it solves an integral equation.',
  'An **integral equation** has the unknown inside an integral: f(x) = ∫K(x, y)u(y)dy (first kind) or u = f + λ∫Ku (second kind). Many measurements are integrals of the thing you want to know.',
  'The Radon transform turns a function into its line integrals, and inverting it (filtered back-projection) recovers the function. Equations of the first kind are often ill-posed: small errors in the data make large errors in the answer.',
  'u(x) = 1 + λ∫₀¹u(y)dy: try u = c, a constant, so c = 1 + λc and c = 1/(1 − λ), for λ ≠ 1.',
  'Ill-posed problems need regularisation, an assumption of smoothness that itself shapes the answer.'
]);
WL.fy('m-perturbation-methods', [
  'Air flowing over a wing is almost frictionless far away, but in a thin layer next to the surface viscosity dominates. Drop the tiny viscous term and you lose drag altogether.',
  'In a **singular perturbation** a small parameter multiplies the highest derivative, so setting it to zero changes the kind of equation. Thin **boundary layers** appear where the solution changes rapidly, and matched asymptotic expansions stitch the inner and outer solutions together.',
  'For εy″ + y′ + y = 0, setting ε = 0 leaves a first-order equation that cannot meet two boundary conditions; the missing one is met inside a layer of width about ε.',
  'Air at 5 m/s over a 1 m plate has Re ≈ 3.3 × 10⁵, still laminar, and the boundary layer at the trailing edge is about 5L/√Re ≈ 9 mm thick. (Much faster, and the layer turns turbulent and this formula no longer holds.)',
  'These expansions are asymptotic rather than convergent, and they can fail where layers interact or the flow separates.'
]);
WL.fy('m-wkb', [
  'A quantum particle in a slowly varying potential behaves almost classically: its wavelength simply follows the local momentum, and its energy levels obey the old Bohr–Sommerfeld rule.',
  'Where the potential changes little over one wavelength, write ψ ≈ e^(iS/ħ) with S ≈ ∫p dx. The amplitude goes as 1/√p, because the particle spends longer where it moves slowly.',
  'Substituting into the Schrödinger equation and expanding in ħ gives the Hamilton–Jacobi equation at leading order. Connection formulas at the turning points then give the condition ∮p dx = (n + ½)h.',
  'For the harmonic oscillator ∮p dx = 2πE/ω, so E = (n + ½)ħω, which in this case is exact.',
  'The method fails near turning points, where p → 0 and the wavelength grows without limit; Airy functions patch the gap.'
]);
WL.fy('m-finite-difference', [
  'Weather and heat simulations replace smooth fields with values on a grid, but choose too large a time step and the simulation explodes into nonsense.',
  'Replace derivatives by differences between neighbouring grid values and update the grid step by step. If the method asks information to travel further than one cell per step, errors grow exponentially.',
  'The explicit scheme for the heat equation is stable only if DΔt/Δx² ≤ ½ (von Neumann analysis); for waves, cΔt/Δx ≤ 1 (the Courant–Friedrichs–Lewy condition).',
  'Heat in carbon steel (D ≈ 1.2 × 10⁻⁵ m²/s) on a 1 mm grid needs Δt ≤ 10⁻⁶ / (2 × 1.2 × 10⁻⁵) ≈ 0.04 s.',
  'Implicit methods remove the stability limit at the cost of solving equations every step, and a stable scheme is not necessarily an accurate one.'
]);
WL.fy('m-monte-carlo', [
  'You can estimate π by throwing darts at a square and counting how many land inside the circle drawn in it.',
  '**Monte Carlo** methods use random sampling to estimate integrals and averages. The error falls as 1/√N whatever the dimension, which makes them unbeatable for integrals in many dimensions.',
  'The mean of N independent samples has standard error σ/√N (the central limit theorem), while a grid needs about kᵈ points in d dimensions.',
  '10 000 darts give π to about ±0.016: 4 × √(0.785 × 0.215)/100.',
  'The random numbers must be good, and the slow 1/√N convergence means each extra digit costs a hundred times more samples (importance sampling helps).'
]);
WL.fy('m-nonlinear', [
  'Open a tap very slowly: a steady stream, then regular drips, then irregular drips. A smooth change of one setting makes sudden changes in behaviour.',
  'As a parameter changes, fixed points can appear, merge or lose their stability: **bifurcations**. In some systems a sequence of period doublings leads to chaos.',
  'In the logistic map x_{n+1} = rx_n(1 − x_n), the period doubles at r = 3, 3.449, 3.544, … and the ratio of successive gaps tends to Feigenbaum’s constant, 4.669…, the same for a whole class of systems.',
  'Chaos sets in at r ≈ 3.5699.',
  'The universality holds for one-dimensional maps with a single smooth hump; real systems may reach chaos by other routes.'
]);
})();
