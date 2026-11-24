/* Geodesic — maths track, stage identities and physics ↔ maths links. */
(function () {
  const WL = window.WL;

  // Stage identities: colour shifts along the journey like a redshift.
  const hues = { ks3: '#5CD0B3', gcse: '#58C4DD', alevel: '#7A9CF5', y1: '#9A72AC', y2: '#D147BD', y3: '#FC6255', y4: '#FF862F' };
  const blurbs = {
    ks3: 'Motion, forces, waves and particles: the vocabulary of physics.',
    gcse: 'Equations enter: motion, energy, circuits, atoms and the expanding universe.',
    alevel: 'Calculus arrives: fields, oscillations, quanta and orbits.',
    y1: 'The core laws, written properly: waves, Gauss, relativity, thermodynamics.',
    y2: 'Lagrangians, Maxwell, Fourier and the first real quantum systems.',
    y3: 'Phase space, atoms, spin, quantum statistics and radiation.',
    y4: 'Chaos, gauge fields, critical phenomena, curved spacetime.'
  };
  WL.stages.forEach((s, i) => { s.hue = hues[s.id]; s.n = i + 1; s.blurb = blurbs[s.id]; });
  const orbit = WL.stubs.find((s) => s.id === 'gcse-orbits'); if (orbit) { orbit.title = 'Red-shift & the Big Bang'; orbit.summary = 'Stretched light from distant galaxies, Hubble’s law and the age of the universe.'; }

  WL.mstrands = [
    { id: 'A', name: 'Algebra & Functions', colour: '#58C4DD' },
    { id: 'K', name: 'Calculus & Analysis', colour: '#F4D345' },
    { id: 'L', name: 'Linear Algebra', colour: '#9A72AC' },
    { id: 'D', name: 'Differential Equations', colour: '#FC6255' },
    { id: 'V', name: 'Vectors & Fields', colour: '#5CD0B3' },
    { id: 'P', name: 'Probability & Methods', colour: '#FF862F' },
    { id: 'G', name: 'Geometry & Symmetry', colour: '#D147BD' }
  ];
  WL.mstages = [
    { id: 'mf', short: 'Foundations', name: 'Foundations (KS3–GCSE)', ages: 'Before A-Level', hue: '#5CD0B3', blurb: 'Rearranging, graphs, triangles and power laws.', maths: [] },
    { id: 'ma', short: 'A-Level', name: 'A-Level Maths', ages: 'Ages 16–18', hue: '#7A9CF5', blurb: 'Vectors and the calculus of change.', maths: [] },
    { id: 'm1', short: 'Uni Y1', name: 'University Year 1', ages: 'Mathematical methods I', hue: '#9A72AC', blurb: 'Complex numbers, series, many variables, matrices.', maths: [] },
    { id: 'm2', short: 'Uni Y2', name: 'University Year 2', ages: 'Mathematical methods II', hue: '#D147BD', blurb: 'Fields, Fourier, PDEs, variations and probability.', maths: [] },
    { id: 'm3', short: 'Uni Y3', name: 'University Year 3', ages: 'Advanced methods', hue: '#FC6255', blurb: 'Hilbert space, special functions, residues, tensors.', maths: [] },
    { id: 'msf', short: 'Special fns', name: 'Special Functions', ages: 'Uni Y3–Y4 toolkit', hue: '#E8C11C', blurb: 'Gamma, Bessel, Legendre, Hermite, Airy, elliptic and zeta: the named functions physics keeps meeting.', maths: [] },
    { id: 'm4', short: 'Uni Y4', name: 'University Year 4', ages: 'Graduate gateway', hue: '#FF862F', blurb: 'Curvature, symmetry groups, path integrals, asymptotics.', maths: [] }
  ];
  WL.stages.forEach((s, i) => (s.n = i + 1)); WL.mstages.forEach((s, i) => (s.n = i + 1));

  const M = (id, stage, strand, title, summary, outline) => ({ id, stage, strand, title, summary, outline, maths: [] });
  WL.mstubs = [
    M('m-algebra', 'mf', 'A', 'Rearranging Equations', 'An equation is a balance: do the same to both sides and it stays true.', ['Inverse operations', 'Changing the subject', 'Rearranging s = ut + ½at²']),
    M('m-graphs', 'mf', 'A', 'Straight Lines & Gradient', 'y = mx + c: what the gradient and intercept mean, and why perpendicular gradients multiply to −1.', ['Gradient = rise/run', 'Line through two points', 'Perpendicular lines']),
    M('m-trig', 'mf', 'G', 'Trigonometry & Pythagoras', 'Sine and cosine as coordinates on a circle, and a proof of Pythagoras you can watch.', ['Pythagoras by rearrangement', 'SOH CAH TOA', 'sin²θ + cos²θ = 1']),
    M('m-quadratics', 'mf', 'A', 'Quadratics & Completing the Square', 'Turn x² + bx into a square, literally, and the quadratic formula falls out.', ['Completing the square geometrically', 'The quadratic formula', 'The discriminant']),
    M('m-proportion', 'mf', 'A', 'Proportion & Power Laws', 'How quantities scale: area ∝ L², volume ∝ L³, inverse squares, and log–log graphs.', ['y = kxⁿ', 'Square–cube law', 'Inverse-square spreading']),
    M('m-vectors', 'ma', 'V', 'Vectors & the Dot Product', 'Arrows you can add, split into components and project onto each other.', ['Components & magnitude', 'Adding tip-to-tail', 'a·b = |a||b|cos θ']),
    M('m-differentiation', 'ma', 'K', 'Differentiation from First Principles', 'The slope of a curve as the limit of slopes of chords.', ['Secant to tangent', 'd/dx xⁿ', 'Product and chain rules']),
    M('m-integration', 'ma', 'K', 'Integration & Area', 'Adding up thin strips, and why that undoes differentiation.', ['Riemann sums', 'The fundamental theorem', 'Integration by parts']),
    M('m-exp-log', 'ma', 'K', 'Exponentials, e & Logarithms', 'The function that is its own slope, and its inverse.', ['e from compound growth', 'd/dx eˣ = eˣ', 'ln x and the log laws']),
    M('m-ode1', 'ma', 'D', 'First-Order Differential Equations', 'Slope fields, separation of variables and integrating factors.', ['Slope fields', 'Separation of variables', 'Integrating factor']),
    M('m-complex', 'm1', 'A', 'Complex Numbers & Euler’s Formula', 'Multiplying by i rotates by 90°, and e^{iθ} walks round the unit circle.', ['The complex plane', 'e^{iθ} = cos θ + i sin θ', 'Roots of unity']),
    M('m-taylor', 'm1', 'K', 'Taylor Series', 'Any smooth function, locally, is a polynomial built from its derivatives.', ['Matching derivatives', 'sin, cos, eˣ series', 'Radius of convergence']),
    M('m-partial', 'm1', 'K', 'Partial Derivatives & the Gradient', 'Slopes of surfaces along each axis, and the direction of steepest ascent.', ['∂f/∂x as a slice', 'Total differential', '∇f ⟂ contours']),
    M('m-multiple', 'm1', 'K', 'Multiple Integrals & Jacobians', 'Integrating over areas and volumes, and how coordinates stretch them.', ['Double integrals', 'Polar area element r dr dθ', 'The Gaussian integral']),
    M('m-matrices', 'm1', 'L', 'Matrices as Transformations', 'A matrix moves every point of the plane; its columns say where the axes go.', ['Columns = images of basis vectors', 'Determinant = area factor', 'Composition and inverses']),
    M('m-eigen', 'm1', 'L', 'Eigenvalues & Eigenvectors', 'The special directions a transformation only stretches.', ['Av = λv', 'det(A − λI) = 0', 'Diagonalisation & normal modes']),
    M('m-ode2', 'm1', 'D', 'Second-Order Linear ODEs', 'Damped and driven oscillators, solved with e^{λt}.', ['Characteristic equation', 'Under-, critical, over-damping', 'Resonance']),
    M('m-divcurl', 'm2', 'V', 'Divergence & Curl', 'How much a field spreads out, and how much it swirls.', ['Divergence as outflow', 'Curl as circulation', '∇·(∇×F) = 0']),
    M('m-theorems', 'm2', 'V', 'Divergence & Stokes’ Theorems', 'Add up tiny outflows and the inside cancels: only the boundary remains.', ['Green’s theorem', 'Divergence theorem', 'Stokes’ theorem']),
    M('m-fourier-series', 'm2', 'K', 'Fourier Series', 'Any periodic signal is a sum of sines; watch rotating circles draw a square wave.', ['Orthogonality', 'Coefficients', 'Gibbs phenomenon']),
    M('m-fourier-transform', 'm2', 'K', 'Fourier Transforms & Uncertainty', 'From a series to a continuum of frequencies, and why narrow means wide.', ['Transform pair', 'Gaussian ↔ Gaussian', 'σₓσₖ ≥ ½']),
    M('m-pde', 'm2', 'D', 'PDEs & Separation of Variables', 'Split a heat or wave equation into independent modes.', ['Separate X(x)T(t)', 'Eigenvalue problem', 'Fourier sine solution']),
    M('m-variations', 'm2', 'K', 'Calculus of Variations', 'Find the curve that makes an integral smallest: the brachistochrone.', ['Functionals', 'Euler–Lagrange', 'Beltrami identity → cycloid']),
    M('m-lagrange-mult', 'm2', 'K', 'Lagrange Multipliers', 'Optimise under a constraint: the best point is where the contours touch.', ['∇f ∥ ∇g', 'The multiplier λ', 'Meaning of λ']),
    M('m-probability', 'm2', 'P', 'Probability, Gaussians & Stirling', 'Random walks build the bell curve; Stirling counts the ways.', ['Binomial distribution', 'Stirling’s approximation', 'Central limit theorem']),
    M('m-hilbert', 'm3', 'L', 'Hilbert Spaces, Bras & Kets', 'Functions as infinite-dimensional vectors, with projections and orthogonal bases.', ['Inner products', 'Completeness & expansions', 'Hermitian operators']),
    M('m-complex-analysis', 'm3', 'K', 'Contour Integrals & Residues', 'Integrate around poles in the complex plane to evaluate real integrals.', ['Cauchy–Riemann', 'Cauchy’s theorem', 'Residue theorem']),
    M('m-numerical', 'm3', 'P', 'Numerical Methods & Stability', 'Euler, Runge–Kutta and symplectic integrators: why some blow up.', ['Local vs global error', 'Stability', 'Symplectic integrators']),
    M('m-tensors', 'm3', 'G', 'Tensors & Index Notation', 'Objects whose components transform predictably when you rotate the axes.', ['Transformation law', 'Einstein summation', 'Invariants & the metric']),
    M('m-green', 'm3', 'D', 'Green’s Functions', 'Solve for one kick, then add up kicks to solve for any force.', ['L G = δ', 'Convolution', 'Causality']),
    M('m-special', 'msf', 'D', 'Sturm–Liouville & Orthogonal Functions', 'Why so many named functions are orthogonal: they are the modes of self-adjoint operators.', ['Self-adjoint form', 'Real eigenvalues, orthogonal modes', 'Weights & completeness']),
    M('m-frobenius', 'msf', 'D', 'Series Solutions & Frobenius', 'When an ODE has no elementary solution, build one as a power series.', ['Ordinary & regular singular points', 'The indicial equation', 'Where special functions come from']),
    M('m-gamma', 'msf', 'K', 'Gamma & Beta Functions', 'The factorial, extended smoothly to every real and complex number.', ['Γ(z+1) = zΓ(z)', 'Γ(½) = √π', 'Beta integrals & Stirling']),
    M('m-erf', 'msf', 'P', 'Gaussian Integrals & the Error Function', 'The bell curve has no elementary antiderivative, so we named one.', ['∫e^{−x²}dx = √π', 'erf and diffusion', 'Moments of a Gaussian']),
    M('m-legendre', 'msf', 'A', 'Legendre Polynomials & Spherical Harmonics', 'The natural modes of anything round: multipoles, atomic orbitals, the CMB.', ['Legendre equation', 'Rodrigues & generating function', 'Y_{lm} and angular momentum']),
    M('m-bessel', 'msf', 'D', 'Bessel Functions', 'The modes of a drum, and of any wave in a cylinder or through a round hole.', ['Bessel’s equation', 'Zeros & drum modes', 'Large-x asymptotics']),
    M('m-hermite', 'msf', 'A', 'Hermite Functions', 'Gaussians times polynomials: the eigenstates of the quantum harmonic oscillator.', ['Hermite equation', 'Generating function & recursion', 'Ladder structure']),
    M('m-laguerre', 'msf', 'A', 'Laguerre Polynomials', 'The radial wavefunctions of the hydrogen atom.', ['Associated Laguerre equation', 'Radial nodes', 'Normalisation']),
    M('m-airy', 'msf', 'D', 'Airy Functions', 'Waves in a linear potential: where oscillation turns into decay.', ['y″ = xy', 'Turning points & WKB matching', 'Rainbows and the quantum bouncer']),
    M('m-hypergeometric', 'msf', 'A', 'Hypergeometric Functions', 'One family that contains almost every special function as a special case.', ['₂F₁ and ₁F₁', 'Pochhammer symbols', 'Special cases']),
    M('m-elliptic', 'msf', 'K', 'Elliptic Integrals & the Exact Pendulum', 'The period of a pendulum at any amplitude, and the perimeter of an ellipse.', ['K(k) and E(k)', 'Period vs amplitude', 'The AGM']),
    M('m-jacobi', 'msf', 'K', 'Jacobi Elliptic Functions', 'sn, cn, dn: trigonometry for the nonlinear pendulum, periodic in two directions.', ['Inverting the elliptic integral', 'Double periodicity', 'The pendulum solved exactly']),
    M('m-zeta', 'msf', 'P', 'Zeta Function & Bose/Fermi Integrals', 'Sums like 1 + 1/2⁴ + 1/3⁴ + … that set black-body radiation and Bose condensation.', ['ζ(s) = Σ n^{−s}', 'Bose & Fermi integrals', 'Analytic continuation']),
    M('m-diffgeo', 'm4', 'G', 'Manifolds, Metrics & Curvature', 'Carry an arrow round a triangle on a sphere and it comes back turned.', ['Metric on a sphere', 'Geodesics', 'Holonomy & Gauss–Bonnet']),
    M('m-groups', 'm4', 'G', 'Groups & Lie Algebras', 'Rotations don’t commute; their generators obey [Jₓ, J_y] = iJ_z.', ['Group axioms', 'Generators', 'SU(2) covers SO(3) twice']),
    M('m-path-integral', 'm4', 'K', 'Path Integrals & Stationary Phase', 'Add a phase for every path: all but the classical one cancel.', ['Time slicing', 'Gaussian integrals', 'Stationary phase']),
    M('m-asymptotics', 'm4', 'P', 'Asymptotic Series & Laplace’s Method', 'Approximations that get better as a parameter grows, even when the series diverges.', ['Laplace’s method', 'Stirling from Γ(n+1)', 'Optimal truncation'])
  ];
  WL.morder = WL.mstubs.map((m) => m.id);
  WL.mprereq = {
    'm-differentiation': ['m-graphs'], 'm-integration': ['m-differentiation'], 'm-exp-log': ['m-differentiation'], 'm-ode1': ['m-integration', 'm-exp-log'],
    'm-vectors': ['m-trig'], 'm-complex': ['m-trig', 'm-quadratics'], 'm-taylor': ['m-differentiation'], 'm-partial': ['m-differentiation'], 'm-multiple': ['m-integration'],
    'm-matrices': ['m-vectors'], 'm-eigen': ['m-matrices'], 'm-ode2': ['m-ode1', 'm-complex'], 'm-divcurl': ['m-partial', 'm-vectors'], 'm-theorems': ['m-divcurl', 'm-multiple'],
    'm-fourier-series': ['m-integration', 'm-trig'], 'm-fourier-transform': ['m-fourier-series', 'm-complex'], 'm-pde': ['m-fourier-series', 'm-ode2'],
    'm-variations': ['m-partial'], 'm-lagrange-mult': ['m-partial'], 'm-probability': ['m-exp-log'], 'm-hilbert': ['m-eigen', 'm-fourier-series'],
    'm-special': ['m-pde', 'm-hilbert'], 'm-frobenius': ['m-ode2', 'm-taylor'], 'm-gamma': ['m-integration', 'm-exp-log'], 'm-erf': ['m-multiple', 'm-gamma'],
    'm-legendre': ['m-special', 'm-frobenius'], 'm-bessel': ['m-special', 'm-frobenius'], 'm-hermite': ['m-special', 'm-frobenius'], 'm-laguerre': ['m-special', 'm-frobenius'],
    'm-airy': ['m-frobenius', 'm-complex-analysis'], 'm-hypergeometric': ['m-frobenius', 'm-gamma'], 'm-elliptic': ['m-integration', 'm-taylor'], 'm-jacobi': ['m-elliptic', 'm-complex'], 'm-zeta': ['m-gamma', 'm-taylor'], 'm-complex-analysis': ['m-complex', 'm-integration'], 'm-numerical': ['m-ode2'], 'm-tensors': ['m-matrices'], 'm-green': ['m-ode2', 'm-fourier-transform'],
    'm-diffgeo': ['m-tensors', 'm-variations'], 'm-groups': ['m-eigen', 'm-complex'], 'm-path-integral': ['m-variations', 'm-complex-analysis'], 'm-asymptotics': ['m-taylor', 'm-probability'],
    'm-graphs': ['m-algebra'], 'm-quadratics': ['m-algebra'], 'm-proportion': ['m-algebra'], 'm-trig': ['m-algebra']
  };

  // Which maths topics each physics topic leans on.
  WL.mathsFor = {
    'ks3-speed': ['m-algebra', 'm-graphs'], 'ks3-moments': ['m-algebra', 'm-proportion'], 'ks3-waves': ['m-algebra', 'm-proportion'], 'ks3-light': ['m-trig'],
    'ks3-circuits': ['m-algebra'], 'ks3-particles': ['m-proportion'], 'ks3-pressure': ['m-algebra', 'm-proportion'], 'ks3-space': ['m-algebra', 'm-proportion'],
    'gcse-suvat': ['m-algebra', 'm-graphs', 'm-quadratics'], 'gcse-newton': ['m-algebra', 'm-vectors'], 'gcse-energy': ['m-algebra', 'm-quadratics'], 'gcse-em-spectrum': ['m-trig'],
    'gcse-circuits': ['m-algebra'], 'gcse-magnetism': ['m-vectors'], 'gcse-shc': ['m-graphs'], 'gcse-radioactivity': ['m-exp-log'], 'gcse-orbits': ['m-graphs', 'm-proportion'],
    'al-projectile': ['m-vectors', 'm-trig', 'm-quadratics'], 'al-circular': ['m-vectors', 'm-differentiation', 'm-trig'], 'al-shm': ['m-differentiation', 'm-ode2', 'm-trig', 'm-elliptic'],
    'al-interference': ['m-trig', 'm-taylor'], 'al-efields': ['m-integration', 'm-vectors'], 'al-capacitors': ['m-exp-log', 'm-ode1'], 'al-induction': ['m-differentiation', 'm-trig'],
    'al-ideal-gas': ['m-probability', 'm-vectors'], 'al-photoelectric': ['m-graphs'], 'al-nuclear': ['m-proportion'], 'al-gravfields': ['m-proportion', 'm-integration'],
    'y1-rotation': ['m-multiple', 'm-integration'], 'y1-wave-eq': ['m-partial', 'm-taylor', 'm-pde'], 'y1-gauss': ['m-multiple', 'm-divcurl', 'm-theorems'], 'y1-thermo': ['m-partial', 'm-integration'],
    'y1-qm-intro': ['m-complex', 'm-fourier-transform'], 'y1-sr': ['m-algebra', 'm-taylor'],
    'y2-lagrangian': ['m-variations', 'm-partial'], 'y2-fourier': ['m-fourier-transform', 'm-complex', 'm-bessel'], 'y2-em-waves': ['m-divcurl', 'm-pde'], 'y2-boltzmann': ['m-probability', 'm-lagrange-mult', 'm-gamma', 'm-erf'],
    'y2-infinite-well': ['m-ode2', 'm-hilbert', 'm-complex'], 'y2-qho': ['m-hilbert', 'm-hermite', 'm-eigen'], 'y2-4vectors': ['m-matrices', 'm-tensors'],
    'y3-hamiltonian': ['m-partial', 'm-divcurl', 'm-numerical'], 'y3-lasers': ['m-ode1', 'm-probability'], 'y3-radiation': ['m-divcurl', 'm-theorems', 'm-green'],
    'y3-quantum-gases': ['m-probability', 'm-zeta', 'm-gamma'], 'y3-tunnelling': ['m-complex', 'm-numerical', 'm-ode2', 'm-airy'], 'y3-hydrogen': ['m-laguerre', 'm-legendre', 'm-pde', 'm-hilbert'],
    'y3-spin': ['m-eigen', 'm-groups', 'm-hilbert'], 'y3-equivalence': ['m-tensors', 'm-diffgeo'],
    'y4-chaos': ['m-eigen', 'm-numerical', 'm-ode1'], 'y4-gauge': ['m-groups', 'm-complex', 'm-diffgeo'], 'y4-ising': ['m-probability', 'm-numerical'], 'y4-kg': ['m-fourier-transform', 'm-eigen', 'm-pde'],
    'y4-perturbation': ['m-hilbert', 'm-asymptotics', 'm-eigen'], 'y4-friedmann': ['m-ode1', 'm-diffgeo'], 'y4-schwarzschild': ['m-diffgeo', 'm-tensors', 'm-variations', 'm-elliptic']
  };
})();
