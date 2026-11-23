/* Geodesic — roadmap: stages, strands, nodes, maths needed. */
(function () {
  const WL = (window.WL = window.WL || {});

  WL.strands = [
    { id: 'M', name: 'Mechanics', colour: '#58C4DD' },
    { id: 'W', name: 'Waves & Optics', colour: '#5CD0B3' },
    { id: 'E', name: 'Electromagnetism', colour: '#F4D345' },
    { id: 'T', name: 'Matter & Thermal', colour: '#FF862F' },
    { id: 'Q', name: 'Quantum & Atomic', colour: '#9A72AC' },
    { id: 'S', name: 'Space & Relativity', colour: '#FC6255' }
  ];

  WL.stages = [
    { id: 'ks3', short: 'KS3', name: 'Key Stage 3', ages: 'Years 7–9 · ages 11–14',
      maths: [['Ratio & proportion', 'Scaling quantities; direct proportion y = kx.'], ['Rearranging simple formulae', 'From v = d/t to d = vt and t = d/v.'], ['Reading & plotting graphs', 'Axes, scales, straight lines, reading off values.'], ['Units & standard form', 'm, s, N, J; writing 3 × 10⁸.']] },
    { id: 'gcse', short: 'GCSE', name: 'GCSE (KS4)', ages: 'Years 10–11 · ages 14–16',
      maths: [['Algebra & substitution', 'Changing the subject, including squares and roots.'], ['Gradient & area under a graph', 'Slope = rate of change; area = accumulated total.'], ['Area of shapes', 'Rectangles, triangles, trapezia under graphs.'], ['Right-angled trigonometry', 'sin, cos, tan; Pythagoras.'], ['Quadratics', 'Expanding brackets, difference of two squares.']] },
    { id: 'alevel', short: 'A‑Level', name: 'A‑Level', ages: 'Years 12–13 · ages 16–18',
      maths: [['Vectors & resolving', 'Components, adding and subtracting vectors.'], ['Differentiation', 'Rates of change, chain rule, derivatives of sin, cos, eˣ.'], ['Integration', 'Areas, separation of variables.'], ['Exponentials & logarithms', 'eˣ, ln x, half-lives, log graphs.'], ['Radians & small angles', 'Arc length rθ, sin x ≈ x.'], ['First-order differential equations', 'dQ/dt = −kQ and friends.']] },
    { id: 'y1', short: 'Uni Y1', name: 'University Year 1', ages: 'Foundations of university physics',
      maths: [['Partial derivatives', '∂/∂x holding other variables fixed.'], ['Vector calculus I', 'Line and surface integrals, flux, gradient.'], ['Complex numbers', 'e^{iθ} = cos θ + i sin θ.'], ['Second-order linear ODEs', 'Oscillators, damping, resonance.'], ['Taylor series', 'Approximations and expansions.'], ['Matrices', 'Linear maps, determinants, eigenvalues.']] },
    { id: 'y2', short: 'Uni Y2', name: 'University Year 2', ages: 'Core theory',
      maths: [['Vector calculus II', 'div, curl, ∇², divergence & Stokes theorems.'], ['PDEs & separation of variables', 'Wave, diffusion and Laplace equations.'], ['Fourier series & transforms', 'Decomposing signals into modes.'], ['Calculus of variations', 'Functionals, Euler–Lagrange equation.'], ['Linear algebra', 'Eigenvectors, Hermitian operators.'], ['Probability & combinatorics', 'Counting microstates, Stirling.']] },
    { id: 'y3', short: 'Uni Y3', name: 'University Year 3', ages: 'Advanced core',
      maths: [['Hilbert spaces & operators', 'Bras, kets, commutators.'], ['Special functions', 'Legendre, Hermite, Laguerre, spherical harmonics.'], ['Complex analysis', 'Contour integrals, residues.'], ['Numerical methods', 'Finite differences, stability, Crank–Nicolson.'], ['Tensors (intro)', 'Index notation, metric, Einstein summation.']] },
    { id: 'y4', short: 'Uni Y4', name: 'University Year 4 (MPhys / MSci)', ages: 'Graduate-level gateway',
      maths: [['Differential geometry', 'Manifolds, metric, Christoffel symbols, curvature.'], ['Group theory & Lie algebras', 'SU(2), SU(3), representations.'], ['Functional methods', 'Path integrals, Green’s functions.'], ['Asymptotic & perturbative methods', 'Series in small parameters, renormalisation ideas.']] }
  ];

  // Stub nodes (full ones are registered in topics-*.js and merged in by id).
  const S = (id, stage, strand, title, summary, maths, outline) => ({ id, stage, strand, title, summary, maths: maths.map((m) => [m, '']), outline, stub: true });
  WL.stubs = [
    S('ks3-light', 'ks3', 'W', 'Light & Reflection', 'Rays, the law of reflection and how images form in mirrors.', ['Angles', 'Measuring with a protractor'], ['Angle of incidence = angle of reflection', 'Virtual images: tracing rays backwards', 'Refraction: light changes speed']),
    S('ks3-circuits', 'ks3', 'E', 'Current & Voltage', 'What current and potential difference measure, and how bulbs share a battery.', ['Decimals', 'Simple formulae'], ['Current = charge per second', 'Voltage = energy per charge', 'Series vs parallel bulbs']),
    S('ks3-particles', 'ks3', 'T', 'Particle Model & Density', 'Solids, liquids and gases as particles; density = mass/volume.', ['Division', 'Volume of a cuboid'], ['Density ρ = m/V', 'Why gases are less dense', 'Changes of state']),
    S('ks3-pressure', 'ks3', 'T', 'Pressure', 'Pressure as force per area, and why it grows with depth.', ['Rearranging formulae', 'Area'], ['p = F/A', 'p = ρgh from the weight of a column', 'Floating and upthrust']),
    S('ks3-space', 'ks3', 'S', 'Gravity & the Solar System', 'Weight, mass and why planets orbit.', ['Multiplication', 'Units'], ['W = mg', 'Day, year and seasons', 'Orbits as continuous falling']),
    S('gcse-newton', 'gcse', 'M', 'Newton’s Laws & Momentum', 'F = ma, action–reaction pairs and conservation of momentum.', ['Algebra', 'Vectors in 1D'], ['F = ma from a = Δv/Δt', 'Momentum p = mv and F = Δp/Δt', 'Conservation in collisions']),
    S('gcse-em-spectrum', 'gcse', 'W', 'EM Spectrum & Refraction', 'The family of EM waves and how light bends at boundaries.', ['Standard form', 'Basic trig'], ['c = fλ across the spectrum', 'Refraction and wavefronts', 'Total internal reflection']),
    S('gcse-magnetism', 'gcse', 'E', 'The Motor Effect', 'Forces on currents in magnetic fields: F = BIL.', ['Rearranging', 'Units'], ['Field lines', 'F = BIL', 'Fleming’s left-hand rule']),
    S('gcse-shc', 'gcse', 'T', 'Specific & Latent Heat', 'Heating and changes of state: E = mcΔθ and E = mL.', ['Substitution', 'Graphs'], ['E = mcΔθ', 'Plateaus on heating curves', 'E = mL']),
    S('gcse-radioactivity', 'gcse', 'Q', 'Radioactive Decay & Half-life', 'Random decay, half-life graphs and nuclear equations.', ['Halving & powers of 2', 'Reading curves'], ['α, β, γ', 'Half-life from a graph', 'N = N₀(½)^{t/T½}']),
    S('gcse-orbits', 'gcse', 'S', 'Orbits & Red-shift', 'Orbital speed, the life cycle of stars and evidence for the Big Bang.', ['Proportion', 'Graphs'], ['Faster orbits closer in', 'Red-shift ∝ distance', 'Big Bang evidence']),
    S('al-interference', 'alevel', 'W', 'Superposition & Young’s Slits', 'Path difference, fringes and the diffraction grating.', ['Small angles', 'Trig'], ['Path difference = nλ for bright fringes', 'w = λD/s', 'Grating d sin θ = nλ']),
    S('al-efields', 'alevel', 'E', 'Electric Fields & Coulomb', 'Coulomb’s law, field strength and potential.', ['Inverse square', 'Integration'], ['F = kQq/r²', 'E = −dV/dr', 'Uniform fields between plates']),
    S('al-induction', 'alevel', 'E', 'Faraday’s Law', 'Flux linkage, induced emf and Lenz’s law.', ['Differentiation', 'Trig functions'], ['Φ = BA cos θ', 'ε = −dΦ/dt', 'AC generator ε = BANω sin ωt']),
    S('al-ideal-gas', 'alevel', 'T', 'Ideal Gas & Kinetic Theory', 'pV = nRT from molecules bouncing off walls.', ['Averages', 'Momentum'], ['Momentum change per collision', 'pV = ⅓Nm⟨c²⟩', 'Temperature ∝ mean KE']),
    S('al-nuclear', 'alevel', 'Q', 'Binding Energy', 'Mass defect, E = mc² and why fusion and fission release energy.', ['Standard form', 'Unit conversion'], ['Mass defect', 'Binding energy per nucleon curve', 'Fission vs fusion']),
    S('y1-rotation', 'y1', 'M', 'Rigid Body Rotation', 'Torque, moment of inertia and angular momentum.', ['Integration', 'Cross products'], ['I = ∫r² dm', 'τ = Iα', 'L conservation']),
    S('y1-thermo', 'y1', 'T', 'Laws of Thermodynamics', 'Internal energy, heat engines and entropy.', ['Partial derivatives', 'Integrals'], ['dU = δQ − δW', 'Carnot efficiency', 'dS = δQ_{rev}/T']),
    S('y1-qm-intro', 'y1', 'Q', 'Wave–Particle Duality', 'de Broglie waves, double slit and the uncertainty principle.', ['Complex numbers', 'Fourier idea'], ['λ = h/p', 'Double-slit with electrons', 'ΔxΔp ≥ ħ/2']),
    S('y2-fourier', 'y2', 'W', 'Fourier Optics & Diffraction', 'Diffraction patterns as Fourier transforms of apertures.', ['Fourier transforms', 'Complex integrals'], ['Huygens–Fresnel', 'Fraunhofer = Fourier transform', 'Single slit sinc²']),
    S('y2-qho', 'y2', 'Q', 'Quantum Harmonic Oscillator', 'Ladder operators and evenly spaced energy levels.', ['Operators', 'Hermite polynomials'], ['a, a† and [a, a†] = 1', 'E = (n+½)ħω', 'Ground state Gaussian']),
    S('y2-4vectors', 'y2', 'S', 'Four-vectors & E = mc²', 'Spacetime intervals and relativistic energy–momentum.', ['Matrices', 'Invariants'], ['Lorentz transformation', 'Interval invariance', 'E² = p²c² + m²c⁴']),
    S('y3-hamiltonian', 'y3', 'M', 'Hamiltonian Mechanics', 'Phase space, Hamilton’s equations and Liouville’s theorem.', ['Legendre transform', 'Partial derivatives'], ['H = pq̇ − L', 'Hamilton’s equations', 'Phase-space volume is conserved']),
    S('y3-lasers', 'y3', 'W', 'Lasers & Coherence', 'Stimulated emission, population inversion and coherence.', ['Rate equations', 'ODEs'], ['Einstein A and B coefficients', 'Population inversion', 'Coherence length']),
    S('y3-radiation', 'y3', 'E', 'Radiation from Accelerating Charges', 'Larmor formula and dipole radiation.', ['Retarded potentials', 'Vector calculus'], ['Liénard–Wiechert fields', 'P = q²a²/6πε₀c³', 'Dipole radiation pattern']),
    S('y3-quantum-gases', 'y3', 'T', 'Bose & Fermi Gases', 'Quantum statistics, Fermi energy and Bose–Einstein condensation.', ['Grand canonical ensemble', 'Integrals'], ['Bose–Einstein and Fermi–Dirac distributions', 'Fermi energy', 'BEC transition']),
    S('y3-hydrogen', 'y3', 'Q', 'The Hydrogen Atom', 'Separating the Schrödinger equation in 3D.', ['Spherical harmonics', 'Laguerre polynomials'], ['Separation in spherical coordinates', 'Radial equation', 'E_n = −13.6 eV / n²']),
    S('y3-spin', 'y3', 'Q', 'Spin & Angular Momentum', 'Stern–Gerlach, Pauli matrices and addition of angular momentum.', ['Matrices', 'Commutators'], ['[J_i, J_j] = iħε_{ijk}J_k', 'Pauli matrices', 'Clebsch–Gordan']),
    S('y4-chaos', 'y4', 'M', 'Nonlinear Dynamics & Chaos', 'Bifurcations, Lyapunov exponents and strange attractors.', ['Linearisation', 'Maps'], ['Fixed points & stability', 'Logistic map', 'Lorenz attractor']),
    S('y4-gauge', 'y4', 'E', 'Gauge Symmetry', 'Why electromagnetism follows from local phase invariance.', ['Lie groups', 'Covariant derivatives'], ['Global vs local U(1)', 'D_μ = ∂_μ + iqA_μ', 'Yang–Mills']),
    S('y4-ising', 'y4', 'T', 'Phase Transitions & Ising Model', 'Mean-field theory, critical exponents and universality.', ['Statistical mechanics', 'Series'], ['Ising Hamiltonian', 'Mean-field T_c', 'Critical exponents']),
    S('y4-perturbation', 'y4', 'Q', 'Perturbation Theory', 'Approximating real systems as small changes to solvable ones.', ['Series', 'Linear algebra'], ['First-order energy shift', 'Second order', 'Fermi’s golden rule']),
    S('y4-schwarzschild', 'y4', 'S', 'Schwarzschild Black Holes', 'The vacuum solution of Einstein’s equations and its horizon.', ['Tensor calculus', 'Differential geometry'], ['Einstein field equations', 'Schwarzschild metric', 'Perihelion precession & light bending'])
  ];

  // Ordered list of every node (full topics fill in by id).
  WL.order = [
    'ks3-speed', 'ks3-moments', 'ks3-waves', 'ks3-light', 'ks3-circuits', 'ks3-particles', 'ks3-pressure', 'ks3-space',
    'gcse-suvat', 'gcse-newton', 'gcse-energy', 'gcse-em-spectrum', 'gcse-circuits', 'gcse-magnetism', 'gcse-shc', 'gcse-radioactivity', 'gcse-orbits',
    'al-projectile', 'al-circular', 'al-shm', 'al-interference', 'al-efields', 'al-capacitors', 'al-induction', 'al-ideal-gas', 'al-photoelectric', 'al-nuclear', 'al-gravfields',
    'y1-rotation', 'y1-wave-eq', 'y1-gauss', 'y1-thermo', 'y1-qm-intro', 'y1-sr',
    'y2-lagrangian', 'y2-fourier', 'y2-em-waves', 'y2-boltzmann', 'y2-infinite-well', 'y2-qho', 'y2-4vectors',
    'y3-hamiltonian', 'y3-lasers', 'y3-radiation', 'y3-quantum-gases', 'y3-tunnelling', 'y3-hydrogen', 'y3-spin', 'y3-equivalence',
    'y4-chaos', 'y4-gauge', 'y4-ising', 'y4-kg', 'y4-perturbation', 'y4-friedmann', 'y4-schwarzschild'
  ];

  // Prerequisites (roadmap arrows). Anything not listed: the previous node in the same strand.
  WL.prereq = {
    'gcse-suvat': ['ks3-speed'], 'gcse-energy': ['gcse-suvat'], 'gcse-circuits': ['ks3-circuits'],
    'al-projectile': ['gcse-suvat'], 'al-circular': ['gcse-newton'], 'al-shm': ['al-circular'], 'al-gravfields': ['al-circular'],
    'al-capacitors': ['gcse-circuits'], 'al-photoelectric': ['gcse-em-spectrum'],
    'y1-wave-eq': ['al-shm'], 'y1-gauss': ['al-efields'], 'y1-sr': ['al-gravfields'],
    'y2-lagrangian': ['y1-rotation'], 'y2-em-waves': ['y1-gauss', 'y1-wave-eq'], 'y2-boltzmann': ['y1-thermo'], 'y2-infinite-well': ['y1-qm-intro'],
    'y3-tunnelling': ['y2-infinite-well'], 'y3-equivalence': ['y1-sr'], 'y4-kg': ['y2-4vectors', 'y2-qho'], 'y4-friedmann': ['y3-equivalence']
  };
})();
