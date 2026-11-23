/* Geodesic step-by-step guides, stage y4 (built from src/guide/y4-*.js) */
WL.gd('y4-perturbation', {
  h: 'Almost every real problem is a solvable one plus something small: an atom in a weak field, a spring that is not quite ideal, a crystal with a slight distortion. Perturbation theory expands the answer in powers of that small extra piece. First order is an average; second order shows that energy levels push each other apart; and when levels coincide, the perturbation itself decides the right states.',
  s: [
    ['Setting up the expansion', [
      'Write H = H₀ + λH′, where H₀ is solved exactly (H₀|n⁰⟩ = E_n⁰|n⁰⟩) and λ is a bookkeeping parameter. Expand the energies and states in powers of λ, substitute, and collect equal powers. At the end set λ = 1.'
    ], { n: 0, e: 'E_n = E_n^0 + \\lambda E_n^1 + \\lambda^2E_n^2 + \\cdots', c: ['What is λ for?', 'It keeps track of the order of each term; it is set to 1 at the end.'] }],
    ['First order', [
      'The first-order energy shift is the average of the perturbation in the unperturbed state. The state also gains small amounts of the other states, each weighted by a matrix element divided by an energy difference.'
    ], { n: 1, e: 'E_n^{1} = \\langle n^0|\\hat H\'|n^0\\rangle', x: ['A particle in a box (0 to L) has a small step of height V₀ added over the left half. Find the first-order shift of every level.', ['E_n¹ = V₀ ∫₀^(L/2) (2/L) sin²(nπx/L) dx.', 'sin² averages to ½ over each half of the box, for every n.', 'So E_n¹ = V₀/2 for every level.'], 'V₀/2 for every level'], c: ['A constant V₀ is added everywhere. What are the exact and first-order shifts?', 'Both are exactly V₀.'] }],
    ['Second order: levels repel', [
      'The second-order shift adds up squared matrix elements divided by energy differences. States below a level push it up and states above push it down, so levels repel. The ground state has nothing below it, so its second-order shift is always negative.'
    ], { n: 2, e: 'E_n^{2} = \\sum_{m\\ne n}\\frac{|\\langle m^0|\\hat H\'|n^0\\rangle|^2}{E_n^0 - E_m^0}', x: ['Two levels at 0 and 1.0 eV are coupled by an off-diagonal matrix element of 0.10 eV. Compare the second-order and exact lower energies.', ['Second order: E = 0 − 0.10² ÷ (1.0 − 0) = −0.0100 eV.', 'Exact (diagonalise the 2 × 2 matrix): E = 0.5 − √(0.25 + 0.01) = −0.0099 eV.', 'Agreement to 1%; the upper level rises by the same amount.'], '−0.0100 eV against −0.0099 eV'], c: ['Why is the ground state’s second-order shift always negative?', 'Every other state is higher, so every denominator E₀ − E_m is negative.'] }],
    ['Degenerate levels', [
      'If several states share an energy, the formulas divide by zero. The cure: within that group, find the combinations that diagonalise H′; its eigenvalues there are the first-order shifts. A symmetry helps: an operator that commutes with both H₀ and H′ picks out these “good” states in advance.'
    ], { n: 3, e: '\\det\\left[\\langle i|\\hat H\'|j\\rangle - E^1\\delta_{ij}\\right] = 0', x: ['Two states with the same energy are linked by ⟨1|H′|2⟩ = W, with zero diagonal elements. Find the shifts and the good states.', ['The 2 × 2 matrix [[0, W], [W, 0]] has eigenvalues ±W.', 'The good states are (|1⟩ ± |2⟩)/√2.', 'This is how the n = 2 level of hydrogen splits linearly in an electric field.'], 'shifts ±W; states (|1⟩ ± |2⟩)/√2'], c: ['How does a symmetry help with degenerate perturbation theory?', 'States labelled by an operator that commutes with H₀ and H′ cannot be mixed by H′, so they are already the good states.'] }],
    ['A standard example', [
      'A slightly anharmonic oscillator, H′ = λx⁴, shows the method and its limits. For the ground state ⟨x⁴⟩ = 3(ħ/2mω)², so E¹ = 3λ(ħ/2mω)².'
    ], { n: 4, x: ['With ħ = m = ω = 1 and λ = 0.1, find the first-order ground-state energy and compare with the exact 0.5591.', ['⟨x⁴⟩ = 3 × (½)² = 0.75, so E¹ = 0.075.', 'E ≈ 0.500 + 0.075 = 0.575.', 'That is 2.8% high; the negative second-order term brings it closer.'], '0.575 against 0.5591'], c: ['Does the series in powers of λ for an x⁴ perturbation converge?', 'No: for negative λ the potential has no bottom, so the series cannot converge for any λ; it is asymptotic, useful only for small λ.'] }],
    ['When does it work?', [
      'Each correction is small only if the matrix element is small compared with the energy gap: |⟨m|H′|n⟩| ≪ |E_n⁰ − E_m⁰|. Nearly degenerate levels break this even when H′ is weak; then diagonalise those levels exactly.'
    ], { n: 5, e: '|H\'_{mn}| \\ll |E_n^0-E_m^0|', c: ['Two levels 1 meV apart are coupled by 2 meV. Can you use ordinary perturbation theory?', 'No: the coupling is larger than the gap. Diagonalise the two levels exactly.'] }]
  ],
  m: [
    ['Using non-degenerate formulas when levels coincide.', 'Diagonalise H′ within the degenerate group first.'],
    ['Getting the sign of the second-order denominators wrong.', 'It is E_n⁰ − E_m⁰.'],
    ['Assuming the series converges.', 'It is often only asymptotic.']
  ]
});

WL.gd('y4-chaos', {
  h: 'Weather forecasts are good for about a week, not a month, and not because computers are too slow. The equations are perfectly deterministic, yet tiny differences in the starting state grow exponentially, so long-term prediction is impossible in principle. Chaos theory explains how order turns into this kind of unpredictability, and finds surprising universal patterns along the way.',
  s: [
    ['Fixed points and stability', [
      'For ẋ = f(x), fixed points satisfy f(x*) = 0. Nearby, small deviations obey δẋ = Jδx, where J is the matrix of derivatives (the Jacobian). Its eigenvalues decide the behaviour: negative real parts mean stable, any positive real part unstable, complex values spirals, and real values of both signs a saddle. For a map x_(n+1) = g(x_n), stability needs |g′(x*)| < 1.'
    ], { n: 0, e: '\\delta\\dot{\\mathbf x} = J\\,\\delta\\mathbf x', x: ['A damped pendulum obeys ẋ = y, ẏ = −sin x − 0.5y. Classify its fixed points at (0, 0) and (π, 0).', ['At (0, 0): J = [[0, 1], [−1, −0.5]], eigenvalues −0.25 ± 0.97i: a stable spiral (hanging down).', 'At (π, 0): J = [[0, 1], [1, −0.5]], eigenvalues 0.78 and −1.28: a saddle (balanced upside down).'], 'stable spiral; saddle'], c: ['For a map, when is a fixed point stable?', 'When |g′(x*)| < 1, so small deviations shrink each step.'] }],
    ['Bifurcations', [
      'As a parameter changes, fixed points can appear, vanish or swap stability. In a **saddle-node** bifurcation (ẋ = r + x²) two fixed points merge and disappear. In a **pitchfork** (ẋ = rx − x³) one splits into three. In a **Hopf** bifurcation a stable spiral becomes unstable and a self-sustained oscillation is born.'
    ], { n: 1, x: ['Find the fixed points of ẋ = rx − x³ and their stability for r > 0.', ['f(x) = 0 at x = 0 and x = ±√r.', 'f′(x) = r − 3x²: at 0 it is r > 0 (unstable); at ±√r it is −2r < 0 (stable).', 'So as r passes 0 the single stable point splits into an unstable centre and two stable sides: a pitchfork.'], '0 unstable; ±√r stable'], c: ['In ẋ = r + x², what happens as r rises through zero?', 'The two fixed points at ±√(−r) move together, merge at r = 0, and disappear.'] }],
    ['The logistic map and period doubling', [
      'The map x_(n+1) = rx_n(1 − x_n), a model of a population with limited food, shows the whole route to chaos. For 1 < r < 3 it settles to x* = 1 − 1/r. At r = 3 that point goes unstable and a 2-cycle appears, then a 4-cycle, 8, 16, … at ever closer values of r, piling up at r ≈ 3.5699. Beyond that the motion is chaotic. The gaps shrink by a universal factor, **Feigenbaum’s δ = 4.669**.'
    ], { n: 2, e: 'x_{n+1} = r\\,x_n(1-x_n),\\qquad \\delta = 4.6692\\ldots', x: ['At r = 2.5, find the fixed point and its stability, and iterate from x₀ = 0.3.', ['x* = 1 − 1/2.5 = 0.6; g′(x*) = r(1 − 2x*) = 2.5 × (−0.2) = −0.5: stable.', 'x₁ = 2.5 × 0.3 × 0.7 = 0.525; x₂ = 0.623; x₃ = 0.587; x₄ = 0.606.', 'The iterates close in on 0.6 from alternate sides, because g′ is negative.'], 'x* = 0.6, approached in alternating steps'], c: ['Period doubling occurs at r₁ = 3, r₂ = 3.449, r₃ = 3.544. Use δ to predict r₄.', 'r₄ ≈ r₃ + (r₃ − r₂)/δ = 3.544 + 0.095/4.67 = 3.564 (the true value is 3.5644).'] }],
    ['Lyapunov exponents', [
      'Two nearby trajectories separate as δ(t) ≈ δ₀e^(λt); a positive **Lyapunov exponent** λ is the signature of chaos. Prediction is then limited to a horizon of about (1/λ)ln(tolerance/δ₀): measuring the start a thousand times better buys only ln 1000/λ ≈ 7/λ more time.'
    ], { n: 3, e: '\\delta(t)\\approx\\delta_0e^{\\lambda t}', x: ['The logistic map at r = 4 has λ = ln 2 per step. How many steps until an initial error of 10⁻¹⁰ reaches 0.1? And with 10⁻¹³?', ['Steps = ln(0.1/10⁻¹⁰)/ln 2 = ln(10⁹)/0.693 = 20.7/0.693 = 30.', 'With 10⁻¹³: ln(10¹²)/0.693 = 40.'], '30 steps; only 10 more with a thousand times better data'], c: ['For the Lorenz system (λ ≈ 0.9), how much longer can you predict with initial data 1000 times better?', 'ln(1000)/0.9 ≈ 7.7 time units more: a fixed, modest gain.'] }],
    ['The Lorenz attractor', [
      'Lorenz (1963) reduced a model of convection to three equations. For σ = 10, β = 8/3, ρ = 28, trajectories never settle and never repeat, yet stay on a bounded, butterfly-shaped set. Volumes in phase space shrink (the divergence is −(σ + 1 + β)), so the attractor has zero volume: a fractal of dimension about 2.06.'
    ], { n: 4, e: '\\dot x = \\sigma(y-x),\\quad \\dot y = x(\\rho - z) - y,\\quad \\dot z = xy - \\beta z', x: ['Find the fixed points of the Lorenz system for ρ = 28, β = 8/3.', ['ẋ = 0 gives y = x; ż = 0 gives z = x²/β; ẏ = 0 then gives x(ρ − 1 − x²/β) = 0.', 'So x = 0 (the origin), or x² = β(ρ − 1) = 72, x = ±8.49.', 'Fixed points: (0, 0, 0) and (±8.49, ±8.49, 27), all unstable at ρ = 28.'], '(0, 0, 0) and (±8.49, ±8.49, 27)'], c: ['Why must the Lorenz attractor have zero volume?', 'Every volume of starting points shrinks by e^(−13.7) per unit time, so whatever they settle on has no volume.'] }],
    ['Chaos without friction', [
      'Systems without friction (Hamiltonian systems) cannot have attractors, because phase-space volume is conserved, but they can still be chaotic. Regular motion lies on surfaces called tori; the **KAM theorem** shows most of them survive small disturbances, while chaotic layers grow where they break. Slices through phase space show regular islands in a chaotic sea.'
    ], { n: 5, c: ['Why can a frictionless (Hamiltonian) system never have an attractor?', 'Liouville’s theorem: phase-space volume is conserved, so trajectories cannot crowd onto a smaller set.'] }]
  ],
  m: [
    ['Equating chaos with randomness.', 'Chaotic systems are fully deterministic.'],
    ['Confusing chaos with a single unstable fixed point.', 'Chaos needs bounded motion with sustained exponential divergence.'],
    ['Expecting precision to buy proportional forecast time.', 'Better data gains time only logarithmically.']
  ]
});

WL.gd('y4-classical-fields', {
  h: 'A field has a value at every point of space and time, so it has infinitely many degrees of freedom. Yet its behaviour follows from one principle, the same least action that governs a thrown ball, applied to a Lagrangian density. Noether’s theorem then turns each symmetry into a conserved current, and the mass of a field fixes how far its force can reach.',
  s: [
    ['Action and Lagrangian density', [
      'For a field φ(x), the action is the spacetime integral of a **Lagrangian density** ℒ(φ, ∂_μφ). Requiring the action to be stationary under small changes of φ gives the **Euler–Lagrange field equation**. (Natural units ħ = c = 1, metric (+, −, −, −).)'
    ], { n: 0, e: 'S = \\int\\mathcal L\\,d^4x,\\qquad \\partial_\\mu\\frac{\\partial\\mathcal L}{\\partial(\\partial_\\mu\\phi)} - \\frac{\\partial\\mathcal L}{\\partial\\phi} = 0', x: ['Find the field equation for ℒ = ½∂_μφ∂^μφ − ½m²φ².', ['∂ℒ/∂(∂_μφ) = ∂^μφ and ∂ℒ/∂φ = −m²φ.', 'Euler–Lagrange: ∂_μ∂^μφ + m²φ = 0.', 'That is the Klein–Gordon equation, (□ + m²)φ = 0.'], '(□ + m²)φ = 0'], c: ['In natural units, what are the dimensions of ℒ?', 'Mass to the fourth power, since the action is dimensionless and d⁴x has dimension mass⁻⁴.'] }],
    ['Three field theories', [
      'Each field theory is defined by its Lagrangian density: the Klein–Gordon scalar, ½(∂φ)² − ½m²φ²; electromagnetism, −¼F_μνF^μν − J_μA^μ; and the Dirac field for electrons.'
    ], { n: 1, e: '\\mathcal L_{\\text{EM}} = -\\tfrac14F_{\\mu\\nu}F^{\\mu\\nu} - J_\\mu A^\\mu', x: ['Show that the electromagnetic Lagrangian gives Maxwell’s equations with sources.', ['Vary A_ν: ∂ℒ/∂(∂_μA_ν) = −F^μν and ∂ℒ/∂A_ν = −J^ν.', 'Euler–Lagrange: ∂_μ(−F^μν) − (−J^ν) = 0.', 'So ∂_μF^μν = J^ν: Gauss’s law and the Ampère–Maxwell law.'], '∂_μF^μν = J^ν'], c: ['Which of Maxwell’s equations does this Lagrangian not produce, and why?', 'The other pair (no monopoles and Faraday’s law): they hold automatically because F is built from the potential A.'] }],
    ['The mass of a field sets the range of its force', [
      'For a static point source, the Klein–Gordon equation gives the **Yukawa potential** e^(−mr)/r. The mass of the exchanged field sets the range of the force, ħ/(mc).'
    ], { n: 2, e: '\\phi(r) = \\frac{g}{4\\pi}\\,\\frac{e^{-mr}}{r},\\qquad \\text{range} = \\frac{\\hbar}{mc}', x: ['The W boson has a mass of 80.4 GeV/c². What is the range of the weak force? (ħc = 197.3 MeV fm)', ['Range = ħc/(mc²) = 197.3 MeV fm ÷ 80 400 MeV.', '= 2.5 × 10⁻³ fm = 2.5 × 10⁻¹⁸ m, about a thousandth of a proton’s size.'], 'about 2.5 × 10⁻¹⁸ m'], c: ['Why does the electromagnetic force reach to infinity?', 'The photon is massless, so the Yukawa form becomes the Coulomb 1/r.'] }],
    ['Noether’s theorem for fields', [
      'If ℒ is unchanged when φ → φ + εΔφ, the current j^μ = (∂ℒ/∂(∂_μφ))Δφ obeys ∂_μj^μ = 0, so the charge Q = ∫j⁰d³x is constant. For a complex scalar, the phase symmetry φ → e^(iα)φ gives a current whose charge counts particles minus antiparticles.'
    ], { n: 3, e: 'j^\\mu = i\\left(\\phi^*\\partial^\\mu\\phi - \\phi\\,\\partial^\\mu\\phi^*\\right),\\qquad \\partial_\\mu j^\\mu = 0', x: ['Check directly that this current is conserved when φ obeys (□ + m²)φ = 0.', ['∂_μj^μ = i(∂_μφ*∂^μφ + φ*□φ − ∂_μφ∂^μφ* − φ□φ*).', 'The first and third terms cancel, leaving i(φ*□φ − φ□φ*).', 'With □φ = −m²φ and □φ* = −m²φ*, this is i(−m²|φ|² + m²|φ|²) = 0.'], 'it vanishes, as Noether promises'], c: ['What does Q = ∫j⁰ d³x count for a complex scalar field?', 'Particles minus antiparticles: a charge.'] }],
    ['The stress–energy tensor', [
      'Symmetry under shifts in space and time gives four conserved currents at once, packed into the **stress–energy tensor** T^μν: T⁰⁰ is the energy density, T⁰ⁱ the momentum density, Tⁱʲ the stress. It is also the source of gravity in general relativity.'
    ], { n: 4, e: 'T^{\\mu\\nu} = \\frac{\\partial\\mathcal L}{\\partial(\\partial_\\mu\\phi)}\\partial^\\nu\\phi - g^{\\mu\\nu}\\mathcal L,\\qquad \\partial_\\mu T^{\\mu\\nu} = 0', x: ['Find the energy density T⁰⁰ of a Klein–Gordon field.', ['T⁰⁰ = ∂⁰φ ∂⁰φ − g⁰⁰ℒ = φ̇² − [½φ̇² − ½(∇φ)² − ½m²φ²].', '= ½φ̇² + ½(∇φ)² + ½m²φ².'], 'T⁰⁰ = ½φ̇² + ½(∇φ)² + ½m²φ², never negative'], c: ['Why does T^μν matter for gravity?', 'It is what appears on the right-hand side of Einstein’s field equations: energy and momentum curve spacetime.'] }],
    ['Dimensions and couplings', [
      'In natural units ℒ has dimension mass⁴, so a scalar field has dimension mass. Couplings then come with definite dimensions. One with a negative power of mass, such as the coefficient of φ⁶, signals a theory that needs ever more parameters at high energies: an effective theory with a cut-off.'
    ], { n: 5, x: ['What are the mass dimensions of the couplings in λφ⁴ and gφ⁶?', ['[φ] = 1, so [φ⁴] = 4 and [φ⁶] = 6.', 'Each term must have dimension 4: [λ] = 0 and [g] = −2.'], 'λ is dimensionless; g has dimension mass⁻²'], c: ['What does a coupling with negative mass dimension tell you?', 'Its effects grow with energy, so the theory needs more and more parameters at high energy: it is valid only below some scale.'] }]
  ],
  m: [
    ['Mixing metric conventions.', 'With (+, −, −, −), ∂_μφ∂^μφ = φ̇² − (∇φ)².'],
    ['Forgetting the boundary condition in the variation.', 'Variations vanish on the boundary, which kills the surface term.'],
    ['Thinking a conserved current means a conserved field value.', 'It is the integrated charge Q that stays constant.']
  ]
});

WL.gd('y4-kg', {
  h: 'Turn Einstein’s E² = p²c² + m²c⁴ into a wave equation and you get the Klein–Gordon equation. Read as the wavefunction of one particle it misbehaves, giving negative probabilities. Read as a field, a sheet of coupled oscillators like masses on springs, it becomes the simplest quantum field theory, in which particles are simply quanta of vibration.',
  s: [
    ['From E² = p²c² + m²c⁴ to a field equation', [
      'Replace energy and momentum by iħ∂/∂t and −iħ∇, as in the Schrödinger equation, but keep the relativistic energy relation. In natural units it takes the compact, relativistically correct form (□ + m²)φ = 0.'
    ], { n: 0, e: '\\frac{1}{c^2}\\frac{\\partial^2\\phi}{\\partial t^2} - \\nabla^2\\phi + \\frac{m^2c^2}{\\hbar^2}\\phi = 0', c: ['Why not keep the Schrödinger equation with E = √(p²c² + m²c⁴)?', 'The square root of a differential operator is non-local and awkward under Lorentz transformations; squaring keeps the equation local and relativistic.'] }],
    ['Plane waves and dispersion', [
      'A plane wave e^(i(kx − ωt)) solves the equation when ω² = c²k² + (mc²/ħ)². Massive waves are dispersive: the phase velocity is above c, the group velocity below it, and their product is c². The **Compton wavelength** ħ/(mc) marks where the mass matters.'
    ], { n: 1, e: '\\omega^2 = c^2k^2 + \\left(\\frac{mc^2}{\\hbar}\\right)^2,\\qquad v_pv_g = c^2', x: ['A pion (139.6 MeV/c²) has momentum 200 MeV/c. Find its energy, group and phase velocities, and Compton wavelength.', ['E = √(200² + 139.6²) = 244 MeV.', 'v_g = pc²/E = (200/244)c = 0.82c; v_p = c²/v_g = 1.22c.', 'ħ/(mc) = 197.3 ÷ 139.6 fm = 1.41 fm.'], '244 MeV; 0.82c and 1.22c; 1.41 fm'], c: ['Does a phase velocity faster than light break relativity?', 'No: no information travels at the phase velocity; signals go at the group velocity, below c.'] }],
    ['A mechanical model', [
      'Take a chain of masses joined by springs, and also tie each mass to its rest position with an extra spring. The connecting springs give the ∇² term; the extra springs give the mass term. For wavelengths much longer than the spacing, the chain obeys the Klein–Gordon equation.'
    ], { n: 2, e: '\\ddot u_j = \\frac{c^2}{a^2}(u_{j+1} - 2u_j + u_{j-1}) - m^2u_j', c: ['In the chain model, what plays the role of the particle’s mass?', 'The extra springs: they give every mode a minimum frequency, even at k = 0, just as rest energy gives a minimum energy.'] }],
    ['A field is a set of oscillators', [
      'Fourier-transform the field and each wavenumber k behaves as an independent harmonic oscillator of frequency ω_k. Quantising each gives energies ħω_k(n_k + ½): n_k counts the quanta, the particles, in that mode. The vacuum has every oscillator in its ground state.'
    ], { n: 3, e: 'H = \\sum_{\\mathbf k}\\hbar\\omega_k\\left(n_{\\mathbf k} + \\tfrac12\\right)', x: ['What is the energy above the vacuum of a state with two quanta in mode k₁ and one in mode k₂?', ['Each quantum in mode k adds ħω_k.', 'E − E_vacuum = 2ħω₁ + ħω₂: three particles, two with momentum ħk₁ and one with ħk₂.'], '2ħω₁ + ħω₂'], c: ['What is a particle in this picture?', 'One quantum of excitation of one normal mode of the field.'] }],
    ['Why the one-particle reading fails', [
      'The equation is second order in time, so it has negative-frequency solutions, and its conserved density i(φ*∂_tφ − φ∂_tφ*) can be negative: impossible for a probability. As a charge density it makes sense: positive and negative frequencies describe particles and antiparticles. Klein–Gordon describes spin-0 particles such as pions and the Higgs boson.'
    ], { n: 4, c: ['How does the field interpretation rescue the negative-frequency solutions?', 'They describe antiparticles, and the “negative probability” becomes negative charge.'] }],
    ['Static fields and the range of forces', [
      'A static point source of a massive field gives the Yukawa potential e^(−r/λ)/r, with λ = ħ/(mc): heavy force carriers give short-range forces. Yukawa used the range of nuclear forces to predict the pion in 1935; it was found in 1947.'
    ], { n: 5, e: '\\phi(r) \\propto \\frac{e^{-r/\\lambda}}{r},\\qquad \\lambda = \\frac{\\hbar}{mc}', x: ['Nuclear forces reach about 1.4 fm. What mass does that suggest for the carrier?', ['mc² = ħc/λ = 197.3 MeV fm ÷ 1.4 fm.', '= 141 MeV: the pion is 135–140 MeV.'], 'about 140 MeV/c²'], c: ['If the photon had a mass of 10⁻⁴⁹ kg, how far would electromagnetism reach?', 'λ = ħ/(mc) = 1.055 × 10⁻³⁴ ÷ (10⁻⁴⁹ × 3 × 10⁸) ≈ 3500 km. Measurements of planetary magnetic fields show the photon mass is far smaller than this.'] }]
  ],
  m: [
    ['Treating φ as a one-particle probability amplitude.', 'It is a field; its quanta are particles and antiparticles.'],
    ['Confusing phase and group velocity.', 'Signals travel at the group velocity, below c.'],
    ['Forgetting the zero-point energy ½ħω per mode.', 'Each mode keeps it even in the vacuum.']
  ]
});

WL.gd('y4-quantised-field', {
  h: 'Why is every electron in the Universe exactly identical to every other? Because they are all ripples in one field. Quantise a free field and it becomes an infinite set of harmonic oscillators, one for each wavevector; their quanta are particles. That single idea explains how particles are created and destroyed, why identical particles are identical, and why empty space still has measurable energy.',
  s: [
    ['A field is a set of oscillators', [
      'Expand a real Klein–Gordon field in a box in plane waves. Each mode is a harmonic oscillator of frequency ω_k = √(k² + m²) (natural units). Quantising means turning each mode’s amplitude into operators: a_k removes a quantum from mode k and a_k† adds one.'
    ], { n: 0, e: '\\phi(\\mathbf x,t) = \\sum_{\\mathbf k}\\frac{1}{\\sqrt{2\\omega_kV}}\\left(a_{\\mathbf k}e^{-ik\\cdot x} + a_{\\mathbf k}^\\dagger e^{ik\\cdot x}\\right)', c: ['Why does each mode of a free field evolve on its own?', 'The free field equation is linear, so different Fourier modes do not couple.'] }],
    ['The commutators', [
      'Impose [φ(x), π(y)] = iδ³(x − y) at equal times, the field version of [x, p] = iħ. Then each mode obeys the oscillator algebra, and different modes are independent. The Hamiltonian is a sum of oscillator Hamiltonians.'
    ], { n: 1, e: '[a_{\\mathbf k},a_{\\mathbf k\'}^\\dagger] = \\delta_{\\mathbf k\\mathbf k\'},\\qquad H = \\sum_{\\mathbf k}\\omega_k\\left(a_{\\mathbf k}^\\dagger a_{\\mathbf k} + \\tfrac12\\right)', x: ['Show that a_k† raises the energy by ω_k.', ['[H, a_k†] = ω_k[a_k†a_k, a_k†] = ω_k a_k†[a_k, a_k†] = ω_k a_k†.', 'So H(a_k†|E⟩) = a_k†H|E⟩ + ω_k a_k†|E⟩ = (E + ω_k)a_k†|E⟩.'], 'a_k† adds energy ω_k'], c: ['What is [a_k, a_q†] for k ≠ q, and what does it mean?', 'Zero: different modes are independent oscillators.'] }],
    ['Particles', [
      'The vacuum |0⟩ is removed by every a_k. The state a_k†|0⟩ has energy ω_k and momentum k: one particle of mass m. More creation operators build many-particle states. Because the a† commute, swapping two particles changes nothing: Bose symmetry comes automatically.'
    ], { n: 2, x: ['Normalise the state with two quanta in the same mode, (a†)²|0⟩.', ['⟨0|a²(a†)²|0⟩: move each a to the right using aa† = a†a + 1.', 'a(a†)²|0⟩ = 2a†|0⟩, and a(2a†|0⟩) = 2|0⟩, so the norm squared is 2.', 'The normalised state is (a†)²|0⟩/√2.'], '(a†)²|0⟩/√2'], c: ['Why is every electron, or every photon, exactly identical?', 'They are all quanta of one and the same field.'] }],
    ['Zero-point energy and the Casimir effect', [
      'Every mode keeps ½ω even in the vacuum, and the total over infinitely many modes is infinite. Usually only differences matter, so the constant is dropped. But differences can be measured: between two metal plates fewer modes fit than outside, and the plates attract (**Casimir**, 1948; measured accurately in 1997–98).'
    ], { n: 3, e: '\\frac{F}{A} = -\\frac{\\pi^2\\hbar c}{240\\,d^4}', x: ['Find the Casimir pressure between plates 1.0 μm apart, and 10 nm apart.', ['At 1.0 μm: π² × 1.055 × 10⁻³⁴ × 3.0 × 10⁸ ÷ (240 × 10⁻²⁴) = 1.3 × 10⁻³ Pa.', 'At 10 nm, d is 100 times smaller, so the pressure is 10⁸ times larger: 1.3 × 10⁵ Pa, more than an atmosphere.'], '1.3 mPa; about 1.3 atmospheres at 10 nm'], c: ['If the zero-point energy is infinite, how can the Casimir force be finite?', 'Only the difference between the mode sums inside and outside the plates matters, and that difference is finite.'] }],
    ['Fermions', [
      'The Dirac field must be quantised with anticommutators, {b_k, b_q†} = δ_kq. Then (b†)² = 0: no two fermions in one state, the Pauli principle. The **spin–statistics theorem** turns this into a rule: integer-spin fields are bosons, half-integer-spin fields are fermions.'
    ], { n: 4, e: '\\{b_{\\mathbf k},b^\\dagger_{\\mathbf q}\\} = \\delta_{\\mathbf k\\mathbf q},\\qquad \\{b^\\dagger, b^\\dagger\\} = 0', x: ['Show that anticommutation forbids two fermions in the same mode.', ['{b†, b†} = 2(b†)² = 0.', 'So (b†)²|0⟩ = 0: there is no state with two quanta in one mode.'], '(b†)² = 0'], c: ['What would go wrong if electrons were quantised with commutators?', 'The energy would have no lower bound: there would be no stable vacuum.'] }],
    ['Causality and antiparticles', [
      'The amplitude for a particle to travel between two points is not zero outside the light cone. Yet the field commutator [φ(x), φ(y)] does vanish there, so no measurement can signal faster than light. The cancellation works only because the field also creates antiparticles: relativity plus quantum mechanics requires antimatter.'
    ], { n: 5, c: ['Why does combining relativity with quantum mechanics require antiparticles?', 'Only with antiparticles do the amplitudes outside the light cone cancel, keeping measurements at spacelike separation independent.'] }]
  ],
  m: [
    ['Picturing a quantum of a field as a tiny ball.', 'It is one unit of excitation of a whole mode.'],
    ['Treating the infinite zero-point energy as observable.', 'Only differences, as in the Casimir effect, are measured.'],
    ['Using commutators for fermion fields.', 'Half-integer-spin fields need anticommutators.']
  ]
});
WL.gd('y4-feynman', {
  h: 'Feynman diagrams look like cartoons of particles bumping into each other, but each one stands for a precise integral. Lines are propagators, corners are couplings, and momentum is conserved at every corner. Add up the diagrams for a process and square the result, and out comes a cross-section or a decay rate that an experiment can check.',
  s: [
    ['The S-matrix', [
      'In a scattering experiment, particles start far apart, interact briefly and fly apart again. The **S-matrix** gives the amplitude for each starting state to end in each final state. It can be expanded in powers of the coupling, and the part that is not “nothing happened” defines the invariant amplitude ℳ.'
    ], { n: 0, e: '\\langle f|S-1|i\\rangle = (2\\pi)^4\\delta^4\\Big(\\sum p_f-\\sum p_i\\Big)\\,i\\mathcal M', c: ['What does the δ⁴ factor express?', 'Overall conservation of energy and momentum.'] }],
    ['Propagators', [
      'Each term of the expansion reduces (by Wick’s theorem) to products of **propagators**: the amplitude for a quantum to travel from one point to another, forward in time as a particle or backward as an antiparticle.'
    ], { n: 1, e: 'D_F(p) = \\frac{i}{p^2-m^2+i\\epsilon}', c: ['What does the small iε in the propagator do?', 'It fixes the boundary conditions: positive energies travel forward in time, negative energies (antiparticles) backward.'] }],
    ['Feynman rules', [
      'Every diagram becomes a formula by fixed rules: a factor for each external particle, a propagator for each internal line, a coupling for each vertex, momentum conservation at each vertex, and an integral over any momentum left free in a loop. Counting vertices tells you the order in the coupling.'
    ], { n: 2, x: ['How does the cross-section for e⁺e⁻ → μ⁺μ⁻ depend on α at lowest order, and how much smaller is a diagram with two extra vertices?', ['Lowest order: one photon exchanged, two vertices, so ℳ ∝ e² ∝ α and σ ∝ |ℳ|² ∝ α².', 'Two extra vertices multiply ℳ by another e², about α ≈ 1/137 (times factors like 1/π).'], 'σ ∝ α²; corrections smaller by about α'], c: ['A diagram has four QED vertices. Roughly how big is its amplitude compared with the two-vertex diagram?', 'Smaller by a factor of about e² ∝ α, of order a percent or less.'] }],
    ['Forces come from exchange', [
      'When two particles exchange a virtual quantum of mass m, the amplitude contains 1/(q² + m²) for momentum transfer q. In the slow, non-relativistic limit that amplitude is equivalent to a potential, the Yukawa potential e^(−mr)/r. Exchanging a massless photon gives Coulomb’s law.'
    ], { n: 3, e: '\\mathcal M \\propto \\frac{g^2}{|\\mathbf q|^2+m^2}\\quad\\longleftrightarrow\\quad V(r) = -\\frac{g^2}{4\\pi}\\frac{e^{-mr}}{r}', c: ['Why does exchanging a massive particle give a short-range force?', 'The 1/(q² + m²) amplitude corresponds to a potential that dies away as e^(−mr), with range 1/m.'] }],
    ['Cross-sections and decay rates', [
      'Square ℳ, multiply by the available phase space and divide by the incoming flux, and you have a rate. For e⁺e⁻ → μ⁺μ⁻ at high energy, the total cross-section is 4πα²/(3s). Replacing muons with quarks multiplies it by the number of colours times the sum of the quark charges squared.'
    ], { n: 4, e: '\\sigma(e^+e^-\\to\\mu^+\\mu^-) = \\frac{4\\pi\\alpha^2}{3s},\\qquad R = N_c\\sum_q Q_q^2', x: ['Find σ(e⁺e⁻ → μ⁺μ⁻) at √s = 10 GeV, and the ratio R of hadrons to muon pairs with five quark flavours. (1 GeV⁻² = 0.389 mb)', ['σ = 4π ÷ (3 × 137.04² × 100 GeV²) = 2.23 × 10⁻⁶ GeV⁻² = 0.87 nb.', 'Charges squared for u, d, s, c, b: 4/9 + 1/9 + 1/9 + 4/9 + 1/9 = 11/9.', 'R = 3 × 11/9 = 3.67.'], '0.87 nb; R = 3.67'], c: ['Measurements give R ≈ 3.7 near 10 GeV, not 1.2. What does that show?', 'Each quark comes in three colours.'] }],
    ['Loops and virtual particles', [
      'Diagrams with closed loops are higher order in the coupling. In QED each loop costs about α/π ≈ 0.002, so a few orders give extraordinary precision; in the strong force at 10 GeV, α_s/π ≈ 0.06, and corrections are larger. Internal lines need not obey E² = p² + m²: they are virtual. Only external lines are real particles.'
    ], { n: 5, c: ['Are the internal lines of a Feynman diagram real particles?', 'No: they are virtual and need not satisfy E² = p² + m²; only the external lines are observed particles.'] }]
  ],
  m: [
    ['Reading a diagram as a picture of what “really happens”.', 'It is a term in an expansion; only the sum is physical.'],
    ['Forgetting momentum conservation at each vertex.', 'It fixes the internal momenta, except in loops.'],
    ['Treating virtual particles as on-shell.', 'Internal lines can have any p² consistent with conservation.']
  ]
});

WL.gd('y4-qed', {
  h: 'Dirac wanted a relativistic wave equation that, like Schrödinger’s, involved only the first derivative in time. The only way to get one forced the wavefunction to have four components, and out fell the electron’s spin, its magnetic moment of exactly g = 2, and the prediction of antimatter. Coupled to light, it became quantum electrodynamics, the most precisely tested theory in science.',
  s: [
    ['The Dirac equation', [
      'Write a first-order equation (iγ^μ∂_μ − m)ψ = 0 and demand that every solution also obey E² = p² + m². That forces the four coefficients to anticommute: {γ^μ, γ^ν} = 2g^μν. No numbers can do that, so the γ’s are 4 × 4 matrices and ψ has four components. Its density ψ†ψ is never negative.'
    ], { n: 0, e: '(i\\gamma^\\mu\\partial_\\mu - m)\\psi = 0,\\qquad \\{\\gamma^\\mu,\\gamma^\\nu\\} = 2g^{\\mu\\nu}', x: ['Why must the γ’s be at least 4 × 4 matrices?', ['We need four matrices that each square to ±1 and all anticommute with one another.', '2 × 2 matrices allow at most three such (the Pauli matrices); 3 × 3 matrices allow none in a consistent way.', 'The smallest size that works is 4 × 4.'], 'four mutually anticommuting matrices need 4 × 4'], c: ['Why can the γ’s not be ordinary numbers?', 'Numbers commute; they cannot anticommute.'] }],
    ['Spin, g = 2 and hydrogen', [
      'The four components describe spin up and down for each of two kinds of solution. At low speed the Dirac equation becomes the Pauli equation with the spin magnetic moment built in, g = 2 exactly, and with spin–orbit coupling including the right Thomas factor. For hydrogen it reproduces the fine-structure formula exactly.'
    ], { n: 1, c: ['What value of g does the Dirac equation predict, and what is measured?', 'Exactly 2; the measured value is 2.00231930436…, the small excess coming from QED loops.'] }],
    ['Negative energies and antiparticles', [
      'Half of the solutions have negative energy. Dirac proposed that they are all filled, so that a hole would act as a positive particle with the electron’s mass. Anderson found the positron in 1932. In quantum field theory the picture is cleaner: the field creates electrons and annihilates positrons, and both have positive energy.'
    ], { n: 2, x: ['What is the minimum photon energy that can create an electron–positron pair (beside a nucleus)?', ['The pair needs at least its rest energy: 2m_ec² = 2 × 0.511 MeV.', '= 1.022 MeV (the nucleus takes up momentum but almost no energy).'], '1.022 MeV'], c: ['Why can a lone photon in empty space not turn into an electron–positron pair?', 'It cannot conserve both energy and momentum: the photon has E = pc, but a pair at rest has energy and no momentum.'] }],
    ['Quantum electrodynamics', [
      'Demanding that the phase of ψ can be changed independently at every point replaces ∂_μ by the covariant derivative D_μ = ∂_μ + ieA_μ and brings in the photon field. QED then has a single vertex, an electron emitting or absorbing a photon, with strength e = √(4πα). At high energy, e⁺e⁻ → μ⁺μ⁻ comes out with the angular pattern (1 + cos²θ).'
    ], { n: 3, e: '\\mathcal L_{\\text{QED}} = \\bar\\psi\\,(i\\gamma^\\mu D_\\mu - m)\\,\\psi - \\tfrac14F_{\\mu\\nu}F^{\\mu\\nu},\\qquad \\frac{d\\sigma}{d\\Omega} = \\frac{\\alpha^2}{4s}(1+\\cos^2\\theta)', x: ['What is the electron’s charge e in natural units, where α = e²/4π?', ['e = √(4πα) = √(4π ÷ 137.036).', '= 0.303.'], 'e ≈ 0.30'], c: ['How many different kinds of vertex does QED have?', 'One: an electron line emitting or absorbing a photon.'] }],
    ['Precision tests', [
      'Loop corrections give the electron an **anomalous magnetic moment**, a = (g − 2)/2 = α/2π + … (Schwinger, 1948). Calculated to five loops, it agrees with experiment to about one part in 10¹²; the comparison is now limited by how well α itself is known.'
    ], { n: 4, e: 'a_e = \\frac{\\alpha}{2\\pi} + \\dots', x: ['Compare Schwinger’s first term with the measured a_e = 0.00115965.', ['α/2π = 1 ÷ (2π × 137.036) = 0.0011614.', 'It is within 0.15% of the measurement; higher loops close the gap.'], '0.0011614 against 0.0011597'], c: ['What now limits the test of QED with a_e?', 'The independent measurement of the fine-structure constant α itself.'] }]
  ],
  m: [
    ['Treating ψ as four independent particles.', 'Its four components describe two spin states of particle and antiparticle solutions.'],
    ['Thinking g = 2 needs extra assumptions.', 'It comes out of the Dirac equation automatically.'],
    ['Forgetting that photons alone cannot pair-produce in empty space.', 'A nucleus (or a second photon) is needed to conserve momentum.']
  ]
});

WL.gd('y4-renormalisation', {
  h: 'Calculate almost any quantum correction in field theory and the answer comes out infinite. Renormalisation shows that, in a well-behaved theory, all the infinities can be soaked up into a few measured numbers such as the electron’s charge and mass, leaving every prediction finite. The lasting lesson is that the strength of a force depends on the energy at which you measure it.',
  s: [
    ['Loop divergences', [
      'A loop integral runs over all momenta k of the virtual particles. In four dimensions, an integrand falling like 1/k⁴ gives ∫d⁴k/k⁴ ~ ln Λ, where Λ is a cut-off: a logarithmic divergence. These infinities signal that the theory is being pushed to scales where it should not be trusted, and that the parameters written in the Lagrangian are not the measured ones.'
    ], { n: 0, e: '\\int^{\\Lambda}\\frac{d^4k}{k^4}\\sim\\ln\\Lambda', c: ['What does a divergent loop integral really tell you?', 'That the theory is being used beyond the scales where it is reliable, and that its “bare” parameters are not what experiments measure.'] }],
    ['Regularisation', [
      'First make the integrals finite in a controlled way: a momentum cut-off, heavy fictitious particles (Pauli–Villars), or **dimensional regularisation**, which works in d = 4 − ε dimensions so that divergences appear as poles in 1/ε.'
    ], { n: 1, c: ['Why is dimensional regularisation the standard choice?', 'It keeps gauge symmetry and Lorentz invariance intact, unlike a simple momentum cut-off.'] }],
    ['Renormalisation', [
      'Write the bare parameters as the measured values plus counterterms that cancel the divergences. Express every prediction in terms of measured quantities: the infinities cancel and nothing depends on the regulator. A theory is **renormalisable** if a finite number of counterterms suffices; in four dimensions that needs couplings of non-negative mass dimension.'
    ], { n: 2, c: ['Which theories are renormalisable in four dimensions?', 'Those whose couplings have zero or positive mass dimension, such as QED, QCD and the Standard Model.'] }],
    ['Running couplings', [
      'The measured coupling depends on the momentum transfer Q of the experiment; the β-function gives how fast it changes. In QED, virtual electron–positron pairs screen a charge, so its effective strength grows at short distances: α ≈ 1/137 at low energy but about 1/128 at the Z mass.'
    ], { n: 3, e: '\\frac{1}{\\alpha(Q)} = \\frac{1}{\\alpha(m)} - \\frac{2}{3\\pi}\\ln\\frac{Q}{m}\\quad\\text{(per charged lepton)}', x: ['Run 1/α from 137.04 up to 91.2 GeV including the electron, muon (105.7 MeV) and tau (1.777 GeV) loops.', ['Logs: ln(91 200/0.511) = 12.09; ln(91 200/105.7) = 6.76; ln(91.2/1.777) = 3.94; total 22.79.', 'Change = (2/3π) × 22.79 = 4.84.', '1/α = 137.04 − 4.84 = 132.2; quark loops bring it to the measured 128.'], 'about 1/132 from leptons alone (1/128 measured)'], c: ['Why does the electromagnetic coupling grow at short distances?', 'Virtual charged pairs screen the charge; probing closer, you get inside more of the screening cloud.'] }],
    ['Asymptotic freedom', [
      'In QCD, gluons themselves carry colour, and they anti-screen: the strong coupling decreases at high energy. Quarks are nearly free at short distances and tightly bound at long ones.'
    ], { n: 4, e: '\\alpha_s(Q) = \\frac{\\alpha_s(\\mu)}{1 + \\dfrac{\\beta_0\\alpha_s(\\mu)}{4\\pi}\\ln\\dfrac{Q^2}{\\mu^2}},\\qquad \\beta_0 = 11 - \\tfrac23n_f', x: ['Starting from α_s = 0.118 at 91.2 GeV, estimate α_s at 1 TeV with n_f = 5.', ['β₀ = 11 − 10/3 = 7.67, and β₀α_s/4π = 0.0720.', 'ln(Q²/μ²) = 2 ln(1000/91.2) = 4.79.', 'α_s = 0.118 ÷ (1 + 0.0720 × 4.79) = 0.118 ÷ 1.345 = 0.088.'], 'about 0.088'], c: ['Why does the strong coupling fall at high energy, when the electromagnetic one rises?', 'Gluons carry colour themselves, and their anti-screening outweighs the quarks’ screening.'] }],
    ['Effective field theory', [
      'Wilson’s view: every theory is valid up to some scale Λ. Interactions with couplings of negative mass dimension are suppressed by powers of E/Λ, so at low energy they are tiny. Fermi’s theory of beta decay is the classic example: it must fail around a few hundred GeV, and the W boson is what replaces it.'
    ], { n: 5, e: '\\frac{G_F}{\\sqrt2} = \\frac{g^2}{8m_W^2}', x: ['Fermi’s constant is G_F = 1.17 × 10⁻⁵ GeV⁻². Estimate the energy at which his theory must fail.', ['Probabilities grow as G_F E², which cannot exceed about 1.', 'E ~ 1/√G_F = 1/√(1.17 × 10⁻⁵) GeV.', '≈ 290 GeV; in reality the W (80 GeV) takes over first.'], 'a few hundred GeV'], c: ['Why do non-renormalisable interactions hardly matter at low energy?', 'Their effects are suppressed by powers of E/Λ, tiny when E is far below the scale Λ.'] }]
  ],
  m: [
    ['Thinking renormalisation hides real infinities.', 'Measured quantities are finite; only unmeasurable bare parameters diverge.'],
    ['Treating a coupling as one fixed number.', 'Couplings run with the energy scale.'],
    ['Assuming every useful theory must be renormalisable.', 'Effective theories work well below their cut-off.']
  ]
});

WL.gd('y4-gauge', {
  h: 'Electromagnetism can be derived from a single demand: that the phase of a charged particle’s wavefunction may be changed independently at every point in space and time. The equations stay consistent only if a field, the photon, is there to compensate. Replace the phase with matrices and the same argument produces the gluons and the W and Z: gauge symmetry is the organising principle of the Standard Model.',
  s: [
    ['Global and local phase symmetry', [
      'The free Dirac Lagrangian is unchanged by ψ → e^(iα)ψ with constant α, a **global** symmetry, and Noether’s theorem gives a conserved charge. If α depends on position, the derivative ∂_μψ picks up an extra term i(∂_μα)ψ, and the Lagrangian is no longer unchanged: a **local** phase change is not yet a symmetry.'
    ], { n: 0, c: ['What conserved quantity does the global phase symmetry give?', 'Charge: particles minus antiparticles.'] }],
    ['The covariant derivative', [
      'Introduce a field A_μ that shifts under the same change and cancels the extra term. The **covariant derivative** D_μψ then changes exactly like ψ, so anything built from ψ and D_μψ is locally invariant. The coupling of matter to the new field is fixed by the symmetry: **minimal coupling**, p → p − qA.'
    ], { n: 1, e: 'D_\\mu = \\partial_\\mu + iqA_\\mu,\\qquad \\psi\\to e^{i\\alpha(x)}\\psi,\\qquad A_\\mu\\to A_\\mu - \\frac1q\\partial_\\mu\\alpha', x: ['Check that D_μψ changes just like ψ.', ['D′_μψ′ = (∂_μ + iqA_μ − i∂_μα)(e^(iα)ψ).', '= e^(iα)(∂_μψ + i(∂_μα)ψ + iqA_μψ − i(∂_μα)ψ).', '= e^(iα)D_μψ: the extra terms cancel.'], 'D_μψ → e^(iα)D_μψ'], c: ['What familiar rule from classical mechanics does minimal coupling reproduce?', 'Replacing the momentum p by p − qA for a charge in a magnetic field.'] }],
    ['The field strength', [
      'The commutator of two covariant derivatives gives a gauge-invariant field, F_μν = ∂_μA_ν − ∂_νA_μ, and its kinetic term −¼F_μνF^μν completes Maxwell’s theory. A mass term ½m²A_μA^μ would not be invariant, so local symmetry requires a massless photon.'
    ], { n: 2, e: '[D_\\mu, D_\\nu] = iqF_{\\mu\\nu}', x: ['Show that a photon mass term would break the symmetry.', ['Under the change, A_μA^μ → (A_μ − ∂_μα/q)(A^μ − ∂^μα/q).', 'That adds terms like −(2/q)A_μ∂^μα, which do not cancel.', 'So ½m²A_μA^μ is not invariant unless m = 0.'], 'the mass term changes, so m must be 0'], c: ['Experiments limit the photon mass to below about 10⁻¹⁸ eV. What does that test?', 'The local phase (gauge) symmetry of electromagnetism.'] }],
    ['Potentials are physical: Aharonov–Bohm', [
      'Split an electron beam around a long solenoid. The magnetic field is zero along both paths, yet the interference pattern shifts by a phase qΦ/ħ, where Φ is the flux inside. The gauge-invariant phase ∮A·dl has effects that the local fields alone miss.'
    ], { n: 3, e: '\\Delta\\varphi = \\frac{q}{\\hbar}\\oint\\mathbf A\\cdot d\\mathbf l = \\frac{q\\Phi}{\\hbar}', x: ['What flux gives a full 2π shift for electrons, and what field is that inside a solenoid of radius 1.0 μm?', ['Δφ = 2π needs Φ = h/e = 4.14 × 10⁻¹⁵ Wb.', 'B = Φ/(πr²) = 4.14 × 10⁻¹⁵ ÷ (π × 10⁻¹²) = 1.3 × 10⁻³ T.'], '4.1 × 10⁻¹⁵ Wb; about 1.3 mT'], c: ['The field is zero along both paths. What causes the fringe shift?', 'The enclosed flux, felt through the line integral of the vector potential round the loop.'] }],
    ['Yang–Mills theory', [
      'Let ψ be a multiplet and the change a matrix U(x) from a group such as SU(2) or SU(3). Then one gauge field is needed for each generator, and the field strength has an extra term quadratic in the fields. The gauge bosons carry the charge they respond to, and interact with each other.'
    ], { n: 4, e: 'F^a_{\\mu\\nu} = \\partial_\\mu A^a_\\nu - \\partial_\\nu A^a_\\mu + g f^{abc}A^b_\\mu A^c_\\nu', x: ['How many gauge bosons do SU(2) and SU(3) need?', ['SU(N) has N² − 1 generators.', 'SU(2): 3 (the W⁺, W⁻ and, mixed with hypercharge, the Z).', 'SU(3): 8 (the gluons).'], '3 and 8'], c: ['Why do gluons interact with each other while photons do not?', 'SU(3) is non-abelian: the f^abc term makes gluons carry colour. U(1) has no such term.'] }],
    ['What gauge symmetry buys', [
      'Gauge invariance fixes the form of the interactions, guarantees conserved charges, keeps the theory renormalisable and forbids gauge-boson masses (unless the Higgs mechanism steps in). Gluon self-interactions produce asymptotic freedom and confinement; photons do not interact with each other directly.'
    ], { n: 5, c: ['Can light scatter off light?', 'Not directly, but through quantum loops of virtual charged particles it can, and this has been observed in heavy-ion collisions.'] }]
  ],
  m: [
    ['Treating A_μ as just a convenience.', 'Phases like ∮A·dl are measurable.'],
    ['Adding a mass term for a gauge field.', 'It breaks gauge invariance; masses need the Higgs mechanism.'],
    ['Forgetting the self-interaction term in Yang–Mills.', 'It is what makes gluons interact with each other.']
  ]
});

WL.gd('y4-higgs', {
  h: 'The laws of physics can have a symmetry that the lowest-energy state does not: a magnet’s laws prefer no direction, but the magnet picks one. When a gauge symmetry is broken this way, the force carriers gain mass. That is how the W and Z become heavy, and its leftover particle, the Higgs boson, was found at CERN in 2012.',
  s: [
    ['Spontaneous symmetry breaking', [
      'Take a complex scalar field with the “Mexican hat” potential. The Lagrangian is unchanged by φ → e^(iα)φ, but the minimum is a whole circle of values, and the vacuum must pick one point on it. The laws keep the symmetry; the ground state does not.'
    ], { n: 0, e: 'V(\\phi) = -\\mu^2|\\phi|^2 + \\lambda|\\phi|^4', x: ['Find the radius of the circle of minima.', ['dV/d|φ| = −2μ²|φ| + 4λ|φ|³ = 0.', 'So |φ|² = μ²/(2λ), that is |φ| = v/√2 with v = √(μ²/λ).'], '|φ| = v/√2, v = √(μ²/λ)'], c: ['Is the symmetry of the laws lost when the vacuum picks a point?', 'No: the equations keep it; only the ground state chooses a direction.'] }],
    ['Goldstone bosons', [
      'Ripples about the chosen vacuum split into a massive one (climbing the wall of the hat) and a massless one (rolling round the circle of minima). In general, every broken generator of a continuous global symmetry gives one massless **Goldstone boson**: phonons in crystals, magnons in magnets.'
    ], { n: 1, c: ['Why are pions so much lighter than protons?', 'They are approximate Goldstone bosons of a symmetry of the light quarks that is spontaneously broken (and only slightly broken by the quark masses).'] }],
    ['The Higgs mechanism', [
      'Now make the symmetry local. The would-be Goldstone mode can be removed by a gauge change, but the kinetic term |D_μφ|² then contains ½q²v²A_μA^μ: a mass qv for the gauge boson. The Goldstone mode has not vanished; it has become the extra (longitudinal) polarisation of the now-massive vector.'
    ], { n: 2, e: '|D_\\mu\\phi|^2 \\supset \\tfrac12q^2v^2A_\\mu A^\\mu\\quad\\Rightarrow\\quad m_A = qv', x: ['Check that no degrees of freedom are lost.', ['Before: a massless vector (2 polarisations) plus a Goldstone mode (1) = 3.', 'After: a massive vector (3 polarisations) = 3.', 'The radial mode, the Higgs particle, is extra in both counts.'], '2 + 1 = 3'], c: ['Where does the Goldstone mode go when the symmetry is gauged?', 'It becomes the longitudinal polarisation of the massive gauge boson.'] }],
    ['Electroweak symmetry breaking', [
      'In the Standard Model the Higgs field’s vacuum value v = 246 GeV breaks the SU(2) × U(1) symmetry down to the U(1) of electromagnetism. Three generators break, giving masses to the W⁺, W⁻ and Z; one combination, the photon, stays massless.'
    ], { n: 3, e: 'm_W = \\frac{gv}{2},\\qquad m_Z = \\frac{m_W}{\\cos\\theta_W}', x: ['With g = 0.65, v = 246 GeV and sin²θ_W = 0.231, find m_W and m_Z.', ['m_W = 0.65 × 246 ÷ 2 = 80 GeV.', 'cos θ_W = √(1 − 0.231) = 0.877.', 'm_Z = 80 ÷ 0.877 = 91 GeV.'], 'about 80 and 91 GeV, as measured'], c: ['Why does the photon stay massless?', 'One combination of the generators, electric charge, leaves the vacuum unchanged, so its gauge boson gets no mass.'] }],
    ['Fermion masses', [
      'Quarks and charged leptons get their masses from **Yukawa couplings** to the Higgs field: m_f = y_f v/√2. The theory accommodates these couplings but does not explain their values. Neutrino masses need something extra.'
    ], { n: 4, e: 'm_f = \\frac{y_fv}{\\sqrt2}', x: ['Find the Yukawa couplings of the top quark (172.7 GeV) and the electron (0.511 MeV).', ['y = √2 m_f/v.', 'Top: √2 × 172.7 ÷ 246 = 0.99.', 'Electron: √2 × 0.000511 ÷ 246 = 2.9 × 10⁻⁶.'], 'about 1 and 3 × 10⁻⁶'], c: ['Does the Standard Model explain why the electron’s Yukawa coupling is so small?', 'No: it is an input, measured rather than predicted.'] }],
    ['Discovery and tests', [
      'ATLAS and CMS announced a new boson near 125 GeV in July 2012, seen as peaks in two-photon and four-lepton masses. Its couplings have since been measured to grow in proportion to the masses of the particles it couples to, as the mechanism predicts.'
    ], { n: 5, e: 'm_H = \\sqrt{2\\lambda}\\,v', x: ['What self-coupling λ does m_H = 125 GeV imply?', ['λ = m_H²/(2v²) = 125² ÷ (2 × 246²).', '= 15 625 ÷ 121 000 = 0.13.'], 'λ ≈ 0.13'], c: ['How do the measured Higgs couplings test the mechanism?', 'They should be proportional to each particle’s mass, and that is what is seen.'] }]
  ],
  m: [
    ['Saying the Higgs gives all mass.', 'Most of a proton’s mass comes from the strong force, not the Higgs.'],
    ['Thinking the Goldstone boson disappears.', 'It becomes the gauge boson’s longitudinal polarisation.'],
    ['Confusing breaking of the laws with breaking of the vacuum.', 'The equations stay symmetric; the ground state does not.']
  ]
});
WL.gd('y4-standard-model', {
  h: 'With about nineteen measured numbers, one theory accounts for essentially every particle-physics experiment ever done: the Standard Model, a gauge theory of three forces acting on three generations of quarks and leptons, with one Higgs field. It is also known to be incomplete: it leaves out gravity, dark matter and why the Universe is made of matter rather than antimatter.',
  s: [
    ['The gauge group', [
      'Three forces correspond to three gauge groups: SU(3) for colour (8 gluons), SU(2) for weak isospin (3 bosons) and U(1) for weak hypercharge (1 boson). The Higgs field breaks SU(2) × U(1) down to the U(1) of electromagnetism, leaving the massive W⁺, W⁻ and Z and the massless photon. Electric charge is Q = T₃ + Y.'
    ], { n: 0, e: 'SU(3)_c\\times SU(2)_L\\times U(1)_Y,\\qquad Q = T_3 + Y', x: ['Find the hypercharge Y of the left-handed electron (T₃ = −½) and the left-handed up quark (T₃ = +½).', ['Electron: Q = −1, so Y = Q − T₃ = −1 + ½ = −½.', 'Up quark: Q = +⅔, so Y = ⅔ − ½ = 1/6.'], '−½ and 1/6'], c: ['How many gauge bosons does the Standard Model have, and which are massive?', '8 + 3 + 1 = 12; after symmetry breaking, the W⁺, W⁻ and Z are massive.'] }],
    ['Matter', [
      'Each generation holds a quark doublet and a lepton doublet, both left-handed, plus right-handed singlets. Only left-handed fermions feel the SU(2) weak force: parity violation is built in. The second and third generations repeat the first with heavier masses.'
    ], { n: 1, x: ['Check that the electric charges of one generation add to zero (counting colours).', ['Leptons: electron −1, neutrino 0: total −1.', 'Quarks: up +⅔ and down −⅓, each in 3 colours: 3 × (⅔ − ⅓) = +1.', 'Total 0. This is no accident: the same balance between quarks and leptons cancels “anomalies” that would otherwise make the theory inconsistent.'], 'they cancel exactly'], c: ['Which fermions feel the weak SU(2) force?', 'Only left-handed fermions (and right-handed antifermions).'] }],
    ['Electroweak theory', [
      'Glashow, Weinberg and Salam unified electromagnetism and the weak force. The theory predicted weak neutral currents (found in 1973) and the W and Z (found in 1983 at the predicted masses). LEP then measured the Z with extreme precision, including its decays into unseen particles.'
    ], { n: 2, x: ['The Z’s invisible decay width is about 499 MeV, and each light neutrino species contributes about 167 MeV. How many neutrino species are there?', ['N = 499 ÷ 167 = 2.99.', 'The LEP result was 2.984 ± 0.008, about 2σ below 3. A 2019 re-analysis of how the beam luminosity had been calculated moved it to 2.996 ± 0.007: a hidden systematic error had looked like a small anomaly.'], 'three'], c: ['Why does the Z’s invisible width count neutrino species?', 'Each light neutrino type adds the same partial width for Z → νν̄, and nothing else in the Standard Model decays invisibly.'] }],
    ['The strong force', [
      'Quarks carry colour; gluons carry colour too and interact with each other. At short distances the coupling is weak (asymptotic freedom); at about 1 fm it is strong, and the energy between separating quarks grows by roughly 1 GeV per fm, until it is cheaper to create a new quark–antiquark pair. Quarks emerge as jets of hadrons, never alone: **confinement**.'
    ], { n: 3, x: ['About how much energy is stored in the colour field when two quarks are pulled 2 fm apart, and what happens?', ['At about 1 GeV per fm: roughly 2 GeV.', 'That far exceeds the few hundred MeV needed to create a light quark–antiquark pair, so the field “snaps” into new hadrons.'], 'about 2 GeV: the string breaks into hadrons'], c: ['Why are free quarks never seen?', 'Pulling them apart costs more and more energy, until a new quark–antiquark pair forms and makes hadrons instead.'] }],
    ['Flavour and CP violation', [
      'The quark mass states are not the states the W couples to; a 3 × 3 unitary matrix, the **CKM matrix**, connects them. It has three mixing angles and one complex phase, the Standard Model’s source of CP violation, seen in K and B mesons. Neutrinos mix in the same way.'
    ], { n: 4, e: 'V_{\\text{CKM}}^\\dagger V_{\\text{CKM}} = 1', x: ['Test the first row of the CKM matrix with |V_ud| ≈ 0.9737, |V_us| ≈ 0.224 and |V_ub| ≈ 0.004.', ['Unitarity needs |V_ud|² + |V_us|² + |V_ub|² = 1.', '0.9481 + 0.0502 + 0.00002 = 0.998.', 'Slightly below 1, by about two to three standard deviations: a small, much-debated tension (the “Cabibbo angle anomaly”) that may come from measurement or theory errors, or from new physics.'], 'about 0.998, slightly under 1'], c: ['How many parameters does the CKM matrix have, and which one causes CP violation?', 'Four: three angles and one phase; the phase causes CP violation.'] }],
    ['Parameters and open problems', [
      'The model has nineteen parameters (three couplings, nine charged-fermion masses, four CKM parameters, two Higgs parameters and the strong CP angle), plus at least seven more for neutrino masses and mixing. It does not explain their values, and it is silent on gravity, dark matter and the matter–antimatter imbalance.'
    ], { n: 5, c: ['Name three things the Standard Model does not explain.', 'Any three of: gravity, dark matter, dark energy, the matter–antimatter imbalance, neutrino masses (in its original form), and the values of its own parameters.'] }]
  ],
  m: [
    ['Thinking all fermions feel the weak force equally.', 'Only left-handed fermions carry weak isospin.'],
    ['Picturing gluons as neutral like photons.', 'Gluons carry colour and interact with each other.'],
    ['Treating the Standard Model as a final theory.', 'It is incomplete, with many unexplained parameters.']
  ]
});

WL.gd('y4-ising', {
  h: 'Put a tiny arrow, up or down, on every site of a lattice and let neighbours lower their energy by pointing the same way. That is the Ising model, the simplest system with a genuine phase transition. It can be solved exactly in one and two dimensions, and comparing those answers with simple approximations shows why magnets and boiling fluids share the same strange power laws near their critical points.',
  s: [
    ['The model', [
      'Each site carries s = ±1. With coupling J > 0 the energy favours parallel neighbours, and an external field h favours spins along it. The **order parameter** is the magnetisation per spin m = ⟨s⟩: zero at high temperature, non-zero below a critical temperature T_c even with no field.'
    ], { n: 0, e: 'H = -J\\sum_{\\langle ij\\rangle}s_is_j - h\\sum_i s_i', c: ['What symmetry does the spontaneous magnetisation break?', 'The up–down symmetry s → −s, which the energy has when h = 0.'] }],
    ['One dimension: no transition', [
      'The chain can be solved exactly, and its free energy is smooth at every T > 0: no phase transition. A single domain wall costs energy 2J but can sit in any of N places, gaining entropy k ln N, so at any non-zero temperature walls appear and destroy long-range order. The correlation length stays finite.'
    ], { n: 1, e: '\\xi = -\\frac{a}{\\ln\\tanh(J/kT)}', x: ['Find the correlation length of the chain at kT = J.', ['tanh 1 = 0.762, and ln 0.762 = −0.272.', 'ξ = a ÷ 0.272 = 3.7a: order lasts only a few sites.'], 'about 3.7 lattice spacings'], c: ['Why does a single domain wall destroy order in 1D at any temperature above zero?', 'It costs a fixed energy 2J but gains entropy k ln N, so for a long chain the free energy always favours walls.'] }],
    ['Mean-field theory', [
      'Replace each spin’s z neighbours by their average: the spin feels an effective field zJm + h. Requiring the average to match gives m = tanh((zJm + h)/kT), with a transition at kT_c = zJ. Near T_c it predicts m ∝ (T_c − T)^(1/2).'
    ], { n: 2, e: 'm = \\tanh\\left(\\frac{zJm + h}{kT}\\right),\\qquad kT_c = zJ', x: ['Compare the mean-field T_c with the true values: 4J for the square lattice (true 2.269J) and 6J for the simple cubic (true 4.51J).', ['Square lattice: 4 ÷ 2.269 = 1.76: 76% too high.', 'Cubic lattice: 6 ÷ 4.51 = 1.33: 33% too high.', 'The error shrinks in higher dimensions, where each spin has more neighbours to average over.'], 'too high by 76% in 2D and 33% in 3D'], c: ['Why does mean-field theory overestimate T_c?', 'It ignores fluctuations, which help disorder the spins.'] }],
    ['Two dimensions: Onsager’s exact solution', [
      'Onsager (1944) solved the square lattice exactly: kT_c = 2.269J, and the exponents differ completely from mean field: m ∝ (T_c − T)^(1/8), and the heat capacity diverges logarithmically. It proved that statistical mechanics can produce sharp phase transitions at all, which had been doubted.'
    ], { n: 3, e: 'kT_c = \\frac{2J}{\\ln(1+\\sqrt2)} = 2.269\\,J,\\qquad m \\propto (T_c-T)^{1/8}', x: ['Just below T_c, at T = 0.9T_c, compare the 2D power law with mean field (taking the same prefactor).', ['2D: (0.1)^(1/8) = 0.75.', 'Mean field: (0.1)^(1/2) = 0.32.', 'The true magnetisation rises far more steeply below T_c.'], '0.75 against 0.32'], c: ['What is the exact critical temperature of the square-lattice Ising model?', 'kT_c = 2.269J.'] }],
    ['Three dimensions and universality', [
      'In 3D there is no exact solution, but simulations give kT_c ≈ 4.51J and β ≈ 0.326. Remarkably, the liquid–gas critical point of any fluid and many uniaxial magnets share these exponents: near T_c only the dimension and the symmetry of the order parameter matter. That is **universality**.'
    ], { n: 4, e: '\\alpha + 2\\beta + \\gamma = 2', x: ['Check the scaling relation α + 2β + γ = 2 for the 2D Ising model (α = 0, β = 1/8, γ = 7/4) and for mean field (α = 0, β = ½, γ = 1).', ['2D: 0 + ¼ + 7/4 = 2.', 'Mean field: 0 + 1 + 1 = 2.'], 'both satisfy it'], c: ['Why do a fluid’s critical point and a uniaxial magnet share exponents?', 'Both have a one-component order parameter with a ± symmetry in three dimensions, so they fall in the same universality class.'] }],
    ['Monte Carlo simulation', [
      'The **Metropolis** algorithm samples states with Boltzmann weights: propose a spin flip; accept it if it lowers the energy, otherwise accept it with probability e^(−ΔE/kT). Near T_c large correlated clusters slow single flips down; cluster algorithms that flip whole clusters avoid this.'
    ], { n: 5, x: ['A proposed flip raises the energy by 4J at kT = 2.5J. With what probability is it accepted?', ['P = e^(−ΔE/kT) = e^(−4/2.5) = e^(−1.6).', '= 0.20.'], '20%'], c: ['Why do cluster algorithms help near T_c?', 'Near T_c, spins move in large correlated clusters, so single flips barely change anything; flipping whole clusters samples new states quickly.'] }]
  ],
  m: [
    ['Expecting a transition in the 1D Ising chain.', 'There is none at any T > 0.'],
    ['Trusting mean-field exponents in 2D or 3D.', 'Fluctuations change them; mean field is exact only above four dimensions.'],
    ['Forgetting the up–down symmetry.', 'With h = 0 the two ordered states have equal energy.']
  ]
});

WL.gd('y4-phase-transitions', {
  h: 'Water boiling, iron magnetising and helium turning superfluid look nothing alike. Yet near their critical points they obey the same kinds of power laws, often with exactly the same exponents. Landau described transitions with an order parameter and symmetry; Wilson explained why the details stop mattering, by watching how a system looks as you zoom out further and further.',
  s: [
    ['Order parameters and kinds of transition', [
      'An **order parameter** is zero in the disordered phase and non-zero in the ordered one: magnetisation, the density difference between liquid and gas, a superfluid’s wavefunction. In a **first-order** transition it jumps, with latent heat. In a **continuous** transition it grows smoothly from zero, fluctuations appear on all scales, and the correlation length becomes infinite.'
    ], { n: 0, c: ['Is boiling water at 1 atm a first-order or a continuous transition?', 'First-order: the density jumps and latent heat is absorbed.'] }],
    ['Landau theory', [
      'Near the transition, write the free energy as a series in the order parameter m, keeping only terms the symmetry allows. The m² coefficient changes sign at T_c. Minimising gives m ∝ (T_c − T)^(1/2) and the other mean-field results.'
    ], { n: 1, e: 'F(m) = F_0 + a(T - T_c)\\,m^2 + b\\,m^4 - hm', x: ['Find the susceptibility χ = ∂m/∂h just above and just below T_c. How do they compare?', ['Above T_c (m small): F ≈ a t m² − hm with t = T − T_c, so m = h/(2at) and χ = 1/(2at).', 'Below T_c: m₀² = a|t|/(2b) and F″ = −2a|t| + 12bm₀² = 4a|t|, so χ = 1/(4a|t|).', 'At equal distances from T_c, χ is twice as large above as below.'], 'χ ∝ 1/|T − T_c| on both sides, ratio 2'], c: ['What exponent γ (χ ∝ |t|^(−γ)) does Landau theory give?', 'γ = 1.'] }],
    ['Critical exponents', [
      'Six exponents describe how quantities behave near T_c: the heat capacity (α), the order parameter (β), the susceptibility (γ), the response at T_c (δ), the correlation length (ν) and the correlations at T_c (η). Scaling relations link them, so only two are independent.'
    ], { n: 2, e: '\\alpha + 2\\beta + \\gamma = 2,\\qquad \\gamma = \\beta(\\delta-1),\\qquad 2 - \\alpha = d\\nu', x: ['Given β = 0.326 and γ = 1.237 for the 3D Ising class, find α, δ and ν.', ['α = 2 − 2β − γ = 2 − 0.652 − 1.237 = 0.111.', 'δ = 1 + γ/β = 1 + 3.79 = 4.79.', 'ν = (2 − α)/d = 1.889 ÷ 3 = 0.630.'], 'α = 0.11, δ = 4.8, ν = 0.63'], c: ['How many critical exponents are independent?', 'Two; the scaling relations fix the rest.'] }],
    ['Universality', [
      'Exponents depend only on the dimension of space, the symmetry of the order parameter and whether the forces are short-range, not on the material. Liquid–gas critical points share the 3D Ising class with uniaxial magnets; helium’s superfluid transition belongs to the 3D XY class.'
    ], { n: 3, x: ['For the 3D XY class, Monte Carlo simulations and the conformal bootstrap agree on α ≈ −0.0151 ± 0.0002. A heat-capacity experiment on helium flown on the Space Shuttle (1992) found α = −0.0127 ± 0.0003. How serious is the disagreement?', ['Difference: 0.0151 − 0.0127 = 0.0024.', 'Combined uncertainty: √(0.0002² + 0.0003²) = 0.00036.', '0.0024 ÷ 0.00036 ≈ 7σ: a real conflict. Two independent theoretical methods agree with each other, so attention has turned to how the experiment was analysed, but the question is still open.'], 'about 7σ, unresolved'], c: ['Why are mean-field exponents correct only above four dimensions?', 'Above four dimensions fluctuations become negligible near T_c; below, they change the exponents.'] }],
    ['The renormalisation group', [
      'Kadanoff’s idea: group spins into blocks, describe the blocks by new effective couplings, and repeat. That is a flow in the space of couplings. At a critical point the system looks the same at every scale, so it sits at a **fixed point** of the flow. Couplings that grow under the flow (**relevant**, such as temperature) must be tuned to reach the transition; those that shrink (**irrelevant**) are the details that do not matter, which explains universality.'
    ], { n: 4, c: ['What is a relevant coupling?', 'One that grows as you zoom out, like the distance from T_c; it must be tuned to zero to reach the critical point.'] }],
    ['Example: thinning out the Ising chain', [
      'Sum over every second spin of a 1D Ising chain and you get a new chain with coupling K′, where tanh K′ = tanh²K and K = J/kT. Repeating drives any finite K towards zero: the only fixed points are K = 0 (infinite temperature) and K = ∞ (zero temperature), so there is no transition at any finite temperature.'
    ], { n: 5, e: '\\tanh K\' = \\tanh^2K', x: ['Start from K = 1 and apply the rule three times.', ['tanh 1 = 0.762, squared 0.580, so K′ = atanh 0.580 = 0.663.', 'tanh 0.663 = 0.580, squared 0.336, so K″ = 0.350.', 'Then tanh² 0.350 = 0.113, so K‴ = 0.114: heading to zero.'], '1 → 0.66 → 0.35 → 0.11'], c: ['What are the fixed points of tanh K′ = tanh²K?', 'K = 0 and K = ∞ only.'] }]
  ],
  m: [
    ['Calling every transition continuous.', 'Check whether the order parameter jumps (first-order).'],
    ['Using mean-field exponents in 3D.', 'Real 3D exponents differ (β ≈ 0.33, not 0.5).'],
    ['Thinking universality means all transitions are identical.', 'Only those with the same dimension and order-parameter symmetry share exponents.']
  ]
});

WL.gd('y4-superconductivity', {
  h: 'Cool certain metals below a critical temperature and their electrical resistance vanishes, exactly, and they push magnetic fields out of themselves. Neither fact follows from “very good conduction”: they mark a new state of matter in which electrons pair up and condense into one quantum state spread across the whole sample.',
  s: [
    ['The phenomena', [
      'Four observations define a superconductor: zero DC resistance (currents in rings persist for years); the **Meissner effect**, the expulsion of magnetic fields; magnetic flux trapped in rings in quantised units; and an energy gap, with a transition temperature that depends on the mass of the lattice ions.'
    ], { n: 0, c: ['Why is a superconductor not simply a perfect conductor?', 'A perfect conductor would trap whatever field was inside when it was cooled; a superconductor actively expels the field.'] }],
    ['The London equations', [
      'The Londons (1935) proposed that the supercurrent responds directly to the vector potential, J = −(n_se²/m)A. Combined with Ampère’s law, this makes a magnetic field die away inside the superconductor over the **penetration depth** λ_L, typically tens of nanometres.'
    ], { n: 1, e: '\\nabla^2\\mathbf B = \\frac{\\mathbf B}{\\lambda_L^2},\\qquad \\lambda_L = \\sqrt{\\frac{m}{\\mu_0n_se^2}}', x: ['Find λ_L for n_s = 4.0 × 10²⁸ m⁻³, and how much field is left 100 nm inside.', ['λ_L = √(9.11 × 10⁻³¹ ÷ (4π × 10⁻⁷ × 4.0 × 10²⁸ × (1.6 × 10⁻¹⁹)²)) = 2.7 × 10⁻⁸ m.', 'At 100 nm: B/B₀ = e^(−100/27) = 0.025.'], '27 nm; about 2.5% left at 100 nm'], c: ['What happens to an applied field inside a thick superconductor?', 'It decays exponentially within a few penetration depths of the surface.'] }],
    ['Flux quantisation', [
      'Ginzburg and Landau described a superconductor with a complex order parameter ψ, a macroscopic wavefunction whose phase must return to itself round any loop. That quantises the trapped flux in units of h/q*. Experiments in 1961 found h/2e: the charge carriers have charge 2e.'
    ], { n: 2, e: '\\Phi = n\\,\\frac{h}{2e},\\qquad \\Phi_0 = 2.07\\times10^{-15}\\ \\text{Wb}', x: ['A type-II superconducting film of area 1.0 cm² sits in a 0.10 T field. How many flux vortices thread it?', ['N = BA/Φ₀ = 0.10 × 1.0 × 10⁻⁴ ÷ 2.07 × 10⁻¹⁵.', '= 4.8 × 10⁹.'], 'about 5 billion'], c: ['What did measuring a flux quantum of h/2e reveal?', 'That the charge carriers are pairs of electrons.'] }],
    ['Cooper pairs', [
      'Cooper (1956) showed that with a filled Fermi sea, any attraction between two electrons, however weak, binds them. In ordinary metals the attraction comes from the lattice: one electron pulls the positive ions slightly together, and a second electron is drawn to that distortion. The **isotope effect**, T_c ∝ M^(−1/2), shows lattice vibrations are involved. Not every metal follows it: ruthenium and zirconium show almost no isotope effect, because the repulsion between electrons also matters.'
    ], { n: 3, e: 'T_c\\propto M^{-1/2}', x: ['Natural mercury (average mass 200.6) becomes superconducting at 4.156 K. If T_c ∝ M^(−1/2), by how much should T_c fall per unit of mass? The 1950 measurements showed about 0.009 K per mass unit.', ['dT_c/dM = −T_c/(2M) = −4.156 ÷ 401.2.', '= −0.0104 K per mass unit.', 'The early data imply an exponent of about 0.43; later, more careful work gave 0.50 ± 0.03 for mercury.'], 'about 0.010 K per mass unit (measured: about 0.009)'], c: ['What does the isotope effect say about the pairing mechanism?', 'Lattice vibrations, which depend on the ions’ mass, are part of it.'] }],
    ['BCS theory', [
      'Bardeen, Cooper and Schrieffer (1957) built the ground state as a coherent condensate of pairs. Breaking a pair costs at least 2Δ, an **energy gap**, which is why ordinary scattering cannot slow the current. BCS predicts 2Δ(0) ≈ 3.53kT_c for weakly coupled superconductors.'
    ], { n: 4, e: '2\\Delta(0) \\approx 3.53\\,kT_c', x: ['Niobium has T_c = 9.25 K. What does BCS predict for 2Δ, and what light frequency could break pairs?', ['2Δ = 3.53 × 8.62 × 10⁻⁵ × 9.25 = 2.8 × 10⁻³ eV.', 'f = 2Δ/h = 2.8 × 10⁻³ × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = 6.8 × 10¹¹ Hz.', 'Measured 2Δ for niobium is about 3.05 meV, a ratio near 3.8: niobium couples more strongly than simple BCS assumes.'], 'about 2.8 meV (measured 3.05 meV); about 700 GHz'], c: ['Why can small scattering events not slow a supercurrent?', 'Any change must break a pair, costing at least 2Δ; small knocks have no states to go to.'] }],
    ['Josephson effects', [
      'Two superconductors separated by a thin barrier exchange pairs coherently. With no voltage, a supercurrent flows that depends on their phase difference. With a voltage V, the phase advances at 2eV/ħ and the current oscillates at f = 2eV/h, 483.6 MHz per microvolt. That relation defines the volt in practice.'
    ], { n: 5, e: 'f = \\frac{2eV}{h}', x: ['What frequency does a Josephson junction emit at 10 μV?', ['f = 483.6 MHz/μV × 10 μV.', '= 4.84 GHz.'], '4.84 GHz'], c: ['Why is the AC Josephson effect used to define the volt?', 'f/V = 2e/h depends only on fundamental constants, and frequencies can be measured extremely precisely.'] }]
  ],
  m: [
    ['Treating superconductivity as perfect conduction.', 'The Meissner effect shows it is a distinct state.'],
    ['Thinking the carriers are single electrons.', 'Flux quanta of h/2e show they are pairs.'],
    ['Applying the BCS ratio to every material.', 'Strong-coupling and unconventional superconductors depart from 3.53.']
  ]
});

WL.gd('y4-topological', {
  h: 'Some properties of quantum matter do not depend on details at all, only on its overall “shape”: whole numbers that cannot change without closing an energy gap. That is why the quantum Hall resistance is identical in every sample, why certain pumps move exactly whole electrons, and why topological insulators conduct only on their surfaces. It all starts with a geometric phase.',
  s: [
    ['The Berry phase', [
      'Change the parameters R of a Hamiltonian slowly round a closed loop. A state that stays in its eigenstate returns with its usual dynamical phase plus an extra **geometric phase** γ, which depends only on the path in parameter space. Berry (1984) showed it is physical: no choice of phase for the eigenstates can remove it. It behaves like the flux of a “magnetic field”, the **Berry curvature**, through the loop.'
    ], { n: 0, e: '\\gamma_n = i\\oint\\langle n(\\mathbf R)|\\nabla_{\\mathbf R}n(\\mathbf R)\\rangle\\cdot d\\mathbf R', c: ['Why is the Berry phase physical, when the phase of each eigenstate is arbitrary?', 'Round a closed loop, any change of phase convention cancels out (up to multiples of 2π).'] }],
    ['Spin ½: a monopole', [
      'For a spin ½ that follows a magnetic field whose direction traces a closed loop, γ = −Ω/2, where Ω is the solid angle the loop encloses. The Berry curvature is that of a magnetic monopole sitting at B = 0, where the two levels meet. Degeneracies are the sources of Berry curvature.'
    ], { n: 1, e: '\\gamma = -\\frac{\\Omega}{2}', x: ['The field direction circles at 60° from the z-axis. Find the Berry phase, and for a loop round the equator.', ['Ω = 2π(1 − cos 60°) = π, so γ = −π/2.', 'Equator: Ω = 2π, so γ = −π: the state changes sign.'], '−π/2; −π for the equator'], c: ['For a spin ½, where is the “monopole” of Berry curvature?', 'At B = 0, where the up and down levels become degenerate.'] }],
    ['Chern numbers and the quantum Hall effect', [
      'For a band of a 2D crystal, the parameters are k_x and k_y, and the Brillouin zone is a closed surface. The total Berry flux through it is 2π times a whole number, the **Chern number** C. The Hall conductance is e²/h times the sum of the Chern numbers of the filled bands: an integer that disorder cannot change.'
    ], { n: 2, e: '\\sigma_{xy} = C\\,\\frac{e^2}{h}', x: ['What is e²/h in siemens, and the Hall conductance and resistance with C = 3?', ['e²/h = (1.602 × 10⁻¹⁹)² ÷ 6.626 × 10⁻³⁴ = 3.87 × 10⁻⁵ S.', 'C = 3: σ = 1.16 × 10⁻⁴ S, R = 25 813 ÷ 3 = 8604 Ω.'], '3.87 × 10⁻⁵ S; 8.6 kΩ'], c: ['Why can disorder not change the Hall conductance on a plateau?', 'It is set by an integer, the Chern number, which can only change if the energy gap closes.'] }],
    ['The Thouless pump', [
      'Slowly cycle a periodic potential in one dimension. If the Fermi level stays in a gap, each cycle moves a whole number of electrons across the system, equal to a Chern number in the space of (k, t), however the potential is shaped. Cold-atom experiments built such pumps in 2016.'
    ], { n: 3, x: ['A pump with C = 1 is cycled at 1.0 GHz. What current does it deliver?', ['One electron per cycle: I = ef.', 'I = 1.6 × 10⁻¹⁹ × 10⁹ = 1.6 × 10⁻¹⁰ A.'], '160 pA, fixed by e and f alone'], c: ['What does each cycle of a Thouless pump move, and what fixes it?', 'A whole number of electrons, fixed by a Chern number, not by the details of the potential.'] }],
    ['Edge states', [
      'Where two regions with different Chern numbers meet, states with no energy gap must appear along the boundary, as many as the difference in C. In the quantum Hall effect these are the edge channels that carry current one way. In 1D, the Su–Schrieffer–Heeger chain with alternating hoppings v and w is topological when w > v, with zero-energy states at its ends.'
    ], { n: 4, e: 'N_{\\text{edge}} = |\\Delta C|', x: ['An SSH chain has v = 0.5 and w = 1.0 (in energy units). Is it topological, and how big is its bulk gap?', ['w > v, so it is in the topological phase, with a zero-energy state at each end.', 'Gap = 2|w − v| = 1.0.'], 'topological; gap 1.0'], c: ['Regions with Chern numbers 2 and −1 meet. How many edge channels run along the boundary?', '|2 − (−1)| = 3.'] }],
    ['Topological insulators', [
      'With time-reversal symmetry and strong spin–orbit coupling a different invariant appears. In 2D it gives the **quantum spin Hall** state, with two edge channels carrying opposite spins in opposite directions, conductance 2e²/h, found in HgTe in 2007. In 3D, surfaces carry a single cone of metallic states, seen in Bi₂Se₃ in 2009.'
    ], { n: 5, x: ['What resistance does a quantum spin Hall bar ideally show?', ['Two edge channels: G = 2e²/h = 7.75 × 10⁻⁵ S.', 'R = 1/G = 12.9 kΩ.'], 'about 12.9 kΩ'], c: ['Why does time-reversal symmetry protect the edge states of a quantum spin Hall insulator?', 'The two counter-moving channels are time-reversed partners, and scattering one into the other is forbidden unless that symmetry is broken, for example by magnetic impurities.'] }]
  ],
  m: [
    ['Thinking a Berry phase can be removed by a phase convention.', 'Round a closed loop it is gauge-invariant.'],
    ['Expecting smooth changes to alter a Chern number.', 'It changes only when a gap closes.'],
    ['Assuming every insulator is topologically trivial.', 'Check the invariant; topological insulators have conducting surfaces.']
  ]
});
WL.gd('y4-quantum-info', {
  h: 'A quantum computer is not a faster ordinary computer. Its bits can be in superpositions, n of them share 2ⁿ complex amplitudes, and clever algorithms make those amplitudes interfere so that wrong answers cancel. The same physics lets you teleport a quantum state and share provably secret keys, and its fragility makes error correction the great engineering challenge.',
  s: [
    ['Qubits', [
      'A **qubit** is a two-level quantum system, α|0⟩ + β|1⟩, a point on the Bloch sphere. Measuring it gives 0 with probability |α|² and destroys the superposition. n qubits have 2ⁿ amplitudes, but measuring them yields only n bits (Holevo’s bound): the power lies in interference, not in reading out all the amplitudes.'
    ], { n: 0, e: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle', x: ['A qubit is in (|0⟩ + √3|1⟩)/2. What is the chance of reading 0? How much memory would a classical computer need to store the state of 50 qubits?', ['P(0) = |½|² = ¼.', '50 qubits have 2⁵⁰ = 1.1 × 10¹⁵ amplitudes.', 'At 16 bytes per complex number: 1.8 × 10¹⁶ bytes, about 18 petabytes.'], '¼; about 18 PB'], c: ['If n qubits have 2ⁿ amplitudes, why can you not read out 2ⁿ numbers?', 'Each measurement gives just n bits and destroys the superposition.'] }],
    ['Gates and circuits', [
      'Gates are unitary operations, which keep the total probability equal to 1. Common ones: X (bit flip), Z (phase flip), the Hadamard H, which turns |0⟩ into (|0⟩ + |1⟩)/√2, and the two-qubit CNOT, which flips the target when the control is 1. A small set, such as H, a π/4 phase gate and CNOT, can approximate any operation.'
    ], { n: 1, e: 'H = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}', x: ['Show that HZH acts like X on |0⟩.', ['H|0⟩ = (|0⟩ + |1⟩)/√2.', 'Z flips the sign of |1⟩: (|0⟩ − |1⟩)/√2.', 'H turns that into |1⟩: the same as X|0⟩.'], 'HZH|0⟩ = |1⟩ = X|0⟩'], c: ['Why must every quantum gate be unitary?', 'To keep the state normalised, so the probabilities always add to 1.'] }],
    ['Algorithms', [
      '**Grover’s search** finds a marked item among N in about (π/4)√N steps, against about N/2 classically: a quadratic speed-up. **Shor’s algorithm** factors large numbers exponentially faster than any known classical method, which is why it threatens today’s public-key cryptography. Quantum simulation of molecules and materials is another natural use.'
    ], { n: 2, e: '\\text{Grover: } \\approx\\tfrac{\\pi}{4}\\sqrt N\\ \\text{queries}', x: ['How many queries does Grover’s search need for N = 10⁶ items, compared with a classical search?', ['Grover: (π/4)√10⁶ = 0.785 × 1000 = 785.', 'Classical: about N/2 = 500 000 on average.'], '785 against 500 000'], c: ['Is Grover’s speed-up exponential?', 'No: it is quadratic (√N against N).'] }],
    ['Teleportation', [
      'Alice has an unknown qubit and half of an entangled pair shared with Bob. She measures her two qubits together and sends Bob the two classical bits of the result. Bob applies one of four simple gates, and his qubit becomes the original state. Alice’s copy is destroyed (no cloning), and nothing goes faster than light.'
    ], { n: 3, c: ['Why does teleportation not send information faster than light?', 'Bob needs Alice’s two classical bits, sent by ordinary means; without them his qubit is completely random.'] }],
    ['Quantum key distribution', [
      'In **BB84**, Alice sends qubits prepared in one of two bases at random; Bob measures in a random basis; they keep only the cases where the bases matched. An eavesdropper must measure without knowing the basis, which disturbs the states and shows up as extra errors.'
    ], { n: 4, x: ['Why does an intercept-and-resend eavesdropper cause a 25% error rate in the kept bits?', ['Eve guesses the wrong basis half the time.', 'When she does, her resent qubit gives Bob a random result in Alice’s basis: wrong half of those times.', 'So ½ × ½ = ¼ of the kept bits are wrong.'], '25%'], c: ['What does the security of BB84 rest on?', 'On physics, the no-cloning theorem and measurement disturbance, not on assumptions about computing power.'] }],
    ['Error correction', [
      'Quantum states cannot be copied, and measuring destroys superpositions, yet errors can be corrected: spread one logical qubit over several physical ones and measure only joint properties (syndromes) that reveal the error but not the stored state. If physical error rates are below a threshold, adding more qubits makes logical errors as rare as you like.'
    ], { n: 5, e: 'p_L = 3p^2 - 2p^3\\quad\\text{(3-qubit bit-flip code)}', x: ['For the 3-qubit bit-flip code, compare the logical error rate with the physical one for p = 0.01 and p = 0.4.', ['p = 0.01: p_L = 3 × 10⁻⁴ − 2 × 10⁻⁶ ≈ 3.0 × 10⁻⁴, about 34 times better.', 'p = 0.4: p_L = 0.48 − 0.128 = 0.35, barely better.', 'The code only helps below p = ½ for this simple case; real codes have thresholds near 1%.'], 'a big gain at 1%, little at 40%'], c: ['How can errors be found without destroying the encoded state?', 'Measure joint parities that reveal which qubit changed, but not the logical value itself.'] }]
  ],
  m: [
    ['Thinking a quantum computer tries every answer in parallel and reads them all.', 'Only interference, then one measurement, gives the answer.'],
    ['Expecting exponential speed-ups for every problem.', 'Many problems gain little; Grover gives only a quadratic gain.'],
    ['Thinking teleportation moves matter or beats light.', 'It moves a quantum state, and needs classical communication.']
  ]
});

WL.gd('y4-gr', {
  h: 'Einstein’s general relativity replaces the force of gravity with the geometry of spacetime. Freely falling things follow the straightest possible paths through a curved spacetime, and energy and momentum tell spacetime how to curve. Every test since 1915, from Mercury’s orbit to atomic clocks a few centimetres apart, has agreed with it.',
  s: [
    ['The equivalence principle', [
      'In a small, freely falling laboratory the effects of gravity vanish: everything falls together, so locally spacetime is that of special relativity. This works only because gravitational mass equals inertial mass for every material, confirmed to about one part in 10¹⁵.'
    ], { n: 0, c: ['Why is the equality of gravitational and inertial mass essential to a geometric theory of gravity?', 'Then every body follows the same path from the same start, so the path can be a property of spacetime rather than of the body.'] }],
    ['The metric', [
      'The **metric** g_μν gives the interval between nearby events, and so proper times and distances. In flat spacetime it is the Minkowski metric. In a weak, steady gravitational field g₀₀ ≈ 1 + 2Φ/c², so clocks lower in the potential run slower.'
    ], { n: 1, e: 'ds^2 = g_{\\mu\\nu}\\,dx^\\mu dx^\\nu,\\qquad g_{00}\\approx1+\\frac{2\\Phi}{c^2}', x: ['A GPS satellite moves at 3.87 km/s. How much does its speed slow its clock per day, and what is the net effect with the 45.7 μs/day gravitational gain?', ['Speed effect: v²/(2c²) = 3870² ÷ (2 × 9.0 × 10¹⁶) = 8.3 × 10⁻¹¹.', 'Per day: 8.3 × 10⁻¹¹ × 86 400 s = 7.2 μs lost.', 'Net: 45.7 − 7.2 = 38.5 μs gained per day.'], '7.2 μs lost; 38.5 μs/day gained overall'], c: ['Overall, do GPS satellite clocks run fast or slow compared with ground clocks?', 'Fast, by about 38 μs a day, which the system corrects for.'] }],
    ['Geodesics', [
      'A freely falling particle takes the path of **maximum proper time** between two events: a **geodesic**. Its equation contains the Christoffel symbols, built from derivatives of the metric, which play the part of gravitational forces. In the slow, weak-field limit it reduces to Newton’s d²x/dt² = −∇Φ.'
    ], { n: 2, e: '\\frac{d^2x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\tau}\\frac{dx^\\beta}{d\\tau} = 0', x: ['Show that the geodesic equation gives Newton’s law for a slow particle in a weak static field.', ['Slow motion: dx⁰/dτ ≈ c dominates, so d²xⁱ/dτ² ≈ −Γⁱ₀₀c².', 'In a weak static field Γⁱ₀₀ ≈ ∂ᵢΦ/c².', 'So d²xⁱ/dt² ≈ −∂ᵢΦ: Newton’s gravity.'], 'd²x/dt² = −∇Φ'], c: ['Which path between two events does a freely falling clock follow?', 'The one that maximises its own elapsed time: the twin who stays in free fall ages more.'] }],
    ['Curvature', [
      'Christoffel symbols can be made zero at any point by choosing freely falling coordinates, so they are not the true gravitational field. **Curvature** is: the Riemann tensor measures how nearby geodesics converge or spread, which is the tidal force, and no choice of coordinates removes it.'
    ], { n: 3, x: ['Estimate the radius of curvature of spacetime at the Earth’s surface, using R ~ GM/(c²r³).', ['GM/c² for the Earth = 3.99 × 10¹⁴ ÷ 9.0 × 10¹⁶ = 4.4 × 10⁻³ m.', 'Divide by r³ = (6.37 × 10⁶)³ = 2.6 × 10²⁰ m³: R ~ 1.7 × 10⁻²³ m⁻².', 'Radius of curvature ~ 1/√R ≈ 2.4 × 10¹¹ m, about 1.6 times the Earth–Sun distance.'], 'about 2 × 10¹¹ m'], c: ['Why are the Christoffel symbols not “the gravitational field”?', 'They can be made to vanish at a point by falling freely; tidal effects, the curvature, cannot.'] }],
    ['Einstein’s field equations', [
      'The source of curvature is the stress–energy tensor T_μν. The **Einstein tensor** G_μν is the combination of curvature whose divergence vanishes automatically, matching the conservation of energy and momentum. The constant 8πG/c⁴ is fixed by matching Newton’s gravity in the weak-field limit.'
    ], { n: 4, e: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', x: ['How big is the constant 8πG/c⁴, and what does it say?', ['8π × 6.67 × 10⁻¹¹ ÷ (3.0 × 10⁸)⁴ = 1.68 × 10⁻⁹ ÷ 8.1 × 10³³.', '= 2.1 × 10⁻⁴³ in SI units.', 'Spacetime is extraordinarily stiff: it takes enormous energy densities to curve it noticeably.'], 'about 2 × 10⁻⁴³ s² kg⁻¹ m⁻¹'], c: ['What fixes the constant 8πG/c⁴?', 'Requiring the weak-field limit to reproduce Newton’s ∇²Φ = 4πGρ.'] }],
    ['Experimental tests', [
      'Mercury’s orbit precesses 43″ per century more than the other planets can explain; general relativity predicts exactly that. Light bending, the delay of radar echoes, gravitational redshift, frame dragging and gravitational waves have all been measured and agree.'
    ], { n: 5, e: '\\Delta\\phi = \\frac{6\\pi GM}{c^2a(1-e^2)}\\ \\text{per orbit}', x: ['Find Mercury’s extra precession per century (GM_Sun = 1.327 × 10²⁰ m³/s², a = 5.79 × 10¹⁰ m, e = 0.206, period 88.0 days).', ['Per orbit: 6π × 1.327 × 10²⁰ ÷ (9.0 × 10¹⁶ × 5.79 × 10¹⁰ × 0.958) = 5.0 × 10⁻⁷ rad.', 'Orbits per century: 36 525 ÷ 88.0 = 415.', 'Total: 2.08 × 10⁻⁴ rad = 43″.'], '43 arcseconds per century'], c: ['Why could Newtonian gravity not explain those 43″?', 'Inverse-square orbits close exactly; the other planets explain the rest of the precession but leave 43″ over.'] }]
  ],
  m: [
    ['Calling gravity a force in general relativity.', 'Free fall is motion along a geodesic; there is no force.'],
    ['Treating Christoffel symbols as the field.', 'Curvature (tides) is the coordinate-free part.'],
    ['Forgetting that clocks lower down run slow.', 'g₀₀ ≈ 1 + 2Φ/c² with Φ negative.']
  ]
});

WL.gd('y4-schwarzschild', {
  h: 'The first exact solution of Einstein’s equations describes spacetime outside any round, non-spinning mass. It explains the extra wobble of Mercury’s orbit and the bending of light, and it contains a surface, the event horizon, from which nothing can escape. Black holes once looked like a mathematical oddity; now we hear them merge and photograph their shadows.',
  s: [
    ['The metric', [
      'Schwarzschild found the solution in 1916. It is the only spherically symmetric vacuum solution (Birkhoff’s theorem), and it is static even if the source pulsates. Far away it becomes flat spacetime; the **Schwarzschild radius** r_s = 2GM/c² marks where departures become large.'
    ], { n: 0, e: 'ds^2 = \\left(1-\\frac{r_s}{r}\\right)c^2dt^2 - \\frac{dr^2}{1-r_s/r} - r^2d\\Omega^2,\\qquad r_s = \\frac{2GM}{c^2}', x: ['Find the Schwarzschild radius of the Sun and of the Earth.', ['Sun: 2 × 1.327 × 10²⁰ ÷ 9.0 × 10¹⁶ = 2.95 × 10³ m.', 'Earth: 2 × 3.99 × 10¹⁴ ÷ 9.0 × 10¹⁶ = 8.9 × 10⁻³ m.'], '3.0 km and 9 mm'], c: ['A spherical star pulsates in and out. Does the gravity outside it change?', 'No: by Birkhoff’s theorem the outside stays exactly the static Schwarzschild solution.'] }],
    ['Clocks and redshift', [
      'A clock at rest at radius r ticks at dτ = √(1 − r_s/r) dt compared with one far away, so light climbing out is redshifted. At the horizon this factor reaches zero: seen from afar, an infalling clock appears to freeze and its light fades to infinite redshift.'
    ], { n: 1, e: 'd\\tau = \\sqrt{1-r_s/r}\\,dt', x: ['Light leaves the surface of a 1.4 solar-mass neutron star of radius 12 km. What redshift does a distant observer see?', ['r_s = 1.4 × 2.95 km = 4.13 km.', '√(1 − 4.13/12) = √0.656 = 0.810.', 'z = 1/0.810 − 1 = 0.235.'], 'z ≈ 0.235'], c: ['What does a distant observer see as a clock falls towards a horizon?', 'It ticks ever more slowly and its light gets redder and fainter; it never quite seems to cross.'] }],
    ['Orbits', [
      'Compared with Newton, the radial motion has an extra attractive term ∝ L²/r³. It makes orbits precess and, closer in, removes stable orbits altogether: the **innermost stable circular orbit** (ISCO) is at 3r_s. Matter spiralling down to it radiates 5.7% of its rest energy, eight times the efficiency of hydrogen fusion.'
    ], { n: 2, e: 'r_{\\text{ISCO}} = 3r_s', x: ['For a 10 solar-mass black hole, find the ISCO radius and the orbital frequency there.', ['r_s = 29.5 km, so r_ISCO = 88.6 km.', 'f = (1/2π)√(GM/r³) = (1/2π)√(1.33 × 10²¹ ÷ (8.86 × 10⁴)³) = 220 Hz.', 'Gravitational waves from such an orbit would be at twice that: about 440 Hz.'], '89 km; 220 Hz'], c: ['Why is falling onto a black hole such an efficient energy source?', 'Gas spirals down to the ISCO, radiating about 5.7% of its rest energy, against 0.7% for fusion.'] }],
    ['Light and shadows', [
      'Light passing within about 2.6r_s is captured, so a black hole in front of glowing gas shows a dark **shadow** of radius √27 GM/c². The Event Horizon Telescope imaged the shadows of M87* (2019) and of Sagittarius A* (2022), consistent with the predictions for their masses.'
    ], { n: 3, e: 'b_{\\text{shadow}} = \\sqrt{27}\\,\\frac{GM}{c^2}', x: ['M87* has 6.5 × 10⁹ solar masses and is 16.8 Mpc (5.18 × 10²³ m) away. Predict the angular diameter of its shadow. (GM/c² for the Sun = 1477 m)', ['GM/c² = 6.5 × 10⁹ × 1477 m = 9.6 × 10¹² m.', 'Diameter = 2√27 × 9.6 × 10¹² = 1.0 × 10¹⁴ m.', 'Angle = 1.0 × 10¹⁴ ÷ 5.18 × 10²³ = 1.9 × 10⁻¹⁰ rad ≈ 40 μas; the measured ring is about 42 μas.'], 'about 40 microarcseconds'], c: ['Why is the shadow larger than the horizon?', 'Light coming within the capture distance, about 2.6r_s, spirals in, so the dark region is wider than the horizon itself.'] }],
    ['The horizon and the singularity', [
      'At r = r_s the metric components blow up, but only because of the coordinates: curvature there is finite, and other coordinates pass smoothly through. An infalling observer crosses the horizon in finite proper time and reaches r = 0 within at most πGM/c³, where curvature truly becomes infinite. Inside, r behaves like time.'
    ], { n: 4, e: '\\tau_{\\max} = \\frac{\\pi GM}{c^3}', x: ['Find the longest possible time from horizon to singularity for a 10 solar-mass black hole and for Sagittarius A* (4.3 × 10⁶ solar masses).', ['10 M_☉: π × 1.33 × 10²¹ ÷ 2.7 × 10²⁵ = 1.5 × 10⁻⁴ s.', 'Sgr A*: π × 5.7 × 10²⁶ ÷ 2.7 × 10²⁵ = 66 s.'], '0.15 ms and about a minute'], c: ['Is the horizon a place where curvature becomes infinite?', 'No: only the original coordinates misbehave there; for a large black hole the tidal forces at the horizon are gentle.'] }],
    ['Quantum black holes', [
      'Hawking (1974) found that quantum effects near the horizon make a black hole glow like a black body at a temperature inversely proportional to its mass, and its entropy is proportional to its horizon area. If black holes evaporate completely, what happens to the information that fell in is still an open question.'
    ], { n: 5, e: 'T_H = \\frac{\\hbar c^3}{8\\pi GMk}', x: ['Find the Hawking temperature of a solar-mass black hole and compare it with the 2.7 K cosmic background.', ['T = 1.055 × 10⁻³⁴ × 2.7 × 10²⁵ ÷ (8π × 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ × 1.38 × 10⁻²³).', '= 2.85 × 10⁻⁹ ÷ 4.6 × 10⁻² = 6.2 × 10⁻⁸ K.', 'Far colder than the background, so today it absorbs more than it emits.'], '6 × 10⁻⁸ K'], c: ['Below roughly what mass would a black hole be hotter than the cosmic background?', 'T ∝ 1/M, so below about 2 × 10⁻⁸ solar masses, about 4.5 × 10²² kg, less than the Moon’s mass.'] }]
  ],
  m: [
    ['Thinking the horizon is a physical surface.', 'Nothing special is felt there; it is a point of no return.'],
    ['Saying black holes suck things in from afar.', 'Far away their gravity is just that of their mass.'],
    ['Confusing the shadow with the horizon.', 'The shadow is about 2.6 times the horizon radius.']
  ]
});

WL.gd('y4-gravitational-waves', {
  h: 'Accelerating masses shake spacetime itself, sending ripples outward at the speed of light. By the time they reach Earth they stretch and squeeze space by about one part in 10²¹. In 2015 the LIGO detectors caught the ripples from two black holes merging over a billion light-years away, opening a completely new way to observe the Universe.',
  s: [
    ['Linearised gravity', [
      'Write the metric as flat spacetime plus a small perturbation h_μν. In a suitable gauge, Einstein’s equations become wave equations travelling at c, with the stress–energy of matter as their source. In empty space the solutions are **gravitational waves**.'
    ], { n: 0, e: '\\Box\\bar h_{\\mu\\nu} = -\\frac{16\\pi G}{c^4}T_{\\mu\\nu}', c: ['How was the speed of gravitational waves tested?', 'In 2017 gamma rays from a neutron-star merger arrived 1.7 s after the gravitational waves, after 130 million years of travel: the speeds agree to about one part in 10¹⁵.'] }],
    ['Two polarisations', [
      'Only two components of h survive: h₊ and h×. A wave travelling along z stretches a ring of free particles along x while squeezing it along y, then the reverse; h× does the same at 45°. Polarisations 45° apart are the signature of a spin-2 field.'
    ], { n: 1, e: '\\frac{\\delta L}{L} = \\frac{h}{2}', x: ['A wave with h₊ = 10⁻²¹ passes a ring of free particles 1.0 m across. How much does its width along x change?', ['δL/L = h/2 = 5 × 10⁻²².', 'δL = 5 × 10⁻²² m along x, while y shrinks by the same amount.'], 'about 5 × 10⁻²² m'], c: ['Why are the two polarisations 45° apart rather than 90°?', 'The stretch–squeeze pattern looks the same after a 180° rotation, the mark of a spin-2 wave.'] }],
    ['The quadrupole formula', [
      'Far from a slowly moving source, the wave amplitude depends on the second time derivative of the mass **quadrupole** moment, and the power on the third. There is no monopole radiation (mass is conserved) and no dipole radiation (momentum is conserved), so gravitational radiation is weak.'
    ], { n: 2, e: 'h\\approx\\frac{2G}{c^4r}\\ddot Q', c: ['Why is there no dipole gravitational radiation?', 'The mass dipole moment’s second derivative is the rate of change of total momentum, which is zero.'] }],
    ['Binaries and the chirp', [
      'Two masses in orbit radiate at twice the orbital frequency, lose energy and spiral together, faster and louder until they merge: a **chirp**. The rate of the chirp depends almost entirely on the **chirp mass** ℳ. The Hulse–Taylor binary pulsar (1974) showed exactly the predicted orbital decay.'
    ], { n: 3, e: '\\mathcal M = \\frac{(m_1m_2)^{3/5}}{(m_1+m_2)^{1/5}}', x: ['Find the chirp mass of GW150914, with 36 and 29 solar masses.', ['m₁m₂ = 1044, and 1044^(3/5) = 64.8.', 'm₁ + m₂ = 65, and 65^(1/5) = 2.31.', 'ℳ = 64.8 ÷ 2.31 = 28 solar masses.'], 'about 28 M_☉'], c: ['Why does the Hulse–Taylor binary pulsar’s orbit shrink?', 'It loses energy to gravitational waves, at a rate matching general relativity to 0.2%.'] }],
    ['Detecting them', [
      'LIGO’s interferometers have 4 km arms. A wave with h ~ 10⁻²¹ changes the difference in arm lengths by about hL ≈ 4 × 10⁻¹⁸ m, a few thousandths of a proton’s width, measured with laser light bouncing many times between mirrors on seismically isolated mounts.'
    ], { n: 4, x: ['GW150914 radiated about 3 solar masses of energy in roughly 0.2 s. Estimate the energy and the peak power.', ['E = 3 × 1.99 × 10³⁰ × (3.0 × 10⁸)² = 5.4 × 10⁴⁷ J.', 'Over about 0.2 s: P ~ 3 × 10⁴⁸ W on average; the peak was about 3.6 × 10⁴⁹ W.', 'Briefly more powerful than all the stars in the observable Universe combined.'], '5 × 10⁴⁷ J; peak about 4 × 10⁴⁹ W'], c: ['Why does LIGO need detectors thousands of kilometres apart?', 'To reject local disturbances (a real signal appears in both) and to locate the source from the difference in arrival times.'] }],
    ['Multi-messenger astronomy', [
      'In August 2017 LIGO and Virgo detected two neutron stars merging 40 Mpc away; 1.7 s later, gamma-ray satellites saw a burst from the same direction, and telescopes followed the glow of freshly made heavy elements (a **kilonova**). In 2023 pulsar timing arrays reported evidence for a background of very low-frequency waves.'
    ], { n: 5, x: ['Use the 1.7 s delay over 40 Mpc (about 4.1 × 10¹⁵ light-seconds) to limit any difference between the speeds of gravity and light.', ['Fractional difference ≲ 1.7 ÷ 4.1 × 10¹⁵.', '≈ 4 × 10⁻¹⁶ (even allowing for a delay in the burst’s emission).'], 'equal to about 1 part in 10¹⁵'], c: ['What did the 2017 kilonova reveal?', 'That neutron-star mergers forge heavy elements such as gold and platinum.'] }]
  ],
  m: [
    ['Thinking the wave moves the detector’s mirrors by large amounts.', 'The strain is about 10⁻²¹; the arm changes by far less than a proton.'],
    ['Expecting dipole radiation as in electromagnetism.', 'Gravitational radiation starts at the quadrupole.'],
    ['Confusing the orbital and wave frequencies.', 'The waves come at twice the orbital frequency.']
  ]
});

WL.gd('y4-friedmann', {
  h: 'Assume the Universe looks the same everywhere and in every direction, and its entire history reduces to one function, the scale factor a(t). The Friedmann equation ties its expansion rate to what the Universe contains. Fitting it to observations gives a universe 13.8 billion years old whose expansion is speeding up.',
  s: [
    ['The scale factor', [
      'On large enough scales (hundreds of megaparsecs) the Universe is homogeneous and isotropic. Then all distances between distant galaxies grow together: r = a(t)χ, with χ fixed for each galaxy. Hubble’s law follows automatically, with H = ȧ/a.'
    ], { n: 0, e: '\\mathbf r = a(t)\\boldsymbol\\chi\\;\\Longrightarrow\\;\\dot{\\mathbf r} = H\\mathbf r,\\qquad H = \\frac{\\dot a}{a}', c: ['On what scales is the Universe homogeneous?', 'Only on scales of hundreds of megaparsecs; galaxies and clusters are very lumpy.'] }],
    ['A Newtonian derivation', [
      'Take a test mass on the edge of a sphere of uniform density ρ. Its energy, ½mṙ² − GMm/r, is constant. Writing r = aχ and M = (4/3)πr³ρ gives the **Friedmann equation**. General relativity gives the same equation, with the constant reinterpreted as spatial curvature.'
    ], { n: 1, e: '\\left(\\frac{\\dot a}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{kc^2}{a^2} + \\frac{\\Lambda c^2}{3}', c: ['In the Newtonian derivation, what does the constant energy become in general relativity?', 'The spatial curvature term, −kc²/a².'] }],
    ['How the contents thin out', [
      'Matter thins with volume, ρ ∝ a⁻³. Radiation also loses energy per photon as wavelengths stretch, so ρ ∝ a⁻⁴. A cosmological constant does not thin at all. So radiation dominated early, then matter, and now dark energy.'
    ], { n: 2, e: '\\rho_m \\propto a^{-3},\\qquad \\rho_r \\propto a^{-4},\\qquad \\rho_\\Lambda = \\text{constant}', x: ['With Ω_r = 9 × 10⁻⁵, Ω_m = 0.315 and Ω_Λ = 0.685 today, when were radiation and matter equal, and when did dark energy take over from matter?', ['Radiation = matter when a = Ω_r/Ω_m = 2.9 × 10⁻⁴: redshift z = 1/a − 1 ≈ 3500.', 'Matter = Λ when a³ = Ω_m/Ω_Λ = 0.46: a = 0.77, z ≈ 0.3.'], 'z ≈ 3500 and z ≈ 0.3'], c: ['Why does radiation thin out faster than matter?', 'Its number density falls as a⁻³ like matter’s, and each photon’s energy also falls as 1/a.'] }],
    ['Critical density', [
      'For a flat universe (k = 0) the density must equal the **critical density** 3H²/(8πG). Densities are quoted as fractions Ω of it. Measurements give Ω_m ≈ 0.315 (of which ordinary matter is 0.049), Ω_Λ ≈ 0.685, and a spatially flat total.'
    ], { n: 3, e: '\\rho_c = \\frac{3H_0^2}{8\\pi G}', x: ['Find the critical density for H₀ = 67.4 km s⁻¹ Mpc⁻¹, in kg/m³ and protons per cubic metre.', ['H₀ = 67 400 ÷ 3.086 × 10²² = 2.18 × 10⁻¹⁸ s⁻¹.', 'ρ_c = 3 × (2.18 × 10⁻¹⁸)² ÷ (8π × 6.67 × 10⁻¹¹) = 8.5 × 10⁻²⁷ kg/m³.', 'Divided by the proton mass: about 5 protons per cubic metre.'], '8.5 × 10⁻²⁷ kg/m³, about 5 protons per m³'], c: ['What fraction of the critical density is ordinary matter?', 'About 5%.'] }],
    ['Acceleration', [
      'The second Friedmann equation includes pressure. Matter and radiation slow the expansion; a component with pressure p = −ρc² (a cosmological constant) speeds it up. Supernovae showed in 1998 that the expansion is accelerating now.'
    ], { n: 4, e: '\\frac{\\ddot a}{a} = -\\frac{4\\pi G}{3}\\left(\\rho + \\frac{3p}{c^2}\\right) + \\frac{\\Lambda c^2}{3},\\qquad q_0 = \\tfrac12\\Omega_m - \\Omega_\\Lambda', x: ['Find today’s deceleration parameter q₀.', ['q₀ = ½ × 0.315 − 0.685.', '= −0.53: negative, so the expansion is accelerating.'], 'q₀ ≈ −0.53'], c: ['What kind of content makes the expansion accelerate?', 'Something with strongly negative pressure, p < −ρc²/3, such as a cosmological constant.'] }],
    ['Ages', [
      'For a flat universe of matter alone, a ∝ t^(2/3) and the age is 2/(3H₀). Adding the measured dark energy gives 13.8 billion years. The comparison was once a real problem.'
    ], { n: 5, e: 'a\\propto t^{2/3}\\ (\\text{matter}),\\qquad t_0 = \\frac{2}{3H_0}', x: ['With H₀ = 67.4 km s⁻¹ Mpc⁻¹, find 1/H₀ and the age of a matter-only flat universe. Compare with the oldest stars, about 12–13 billion years old.', ['1/H₀ = 1 ÷ 2.18 × 10⁻¹⁸ s = 4.58 × 10¹⁷ s = 14.5 billion years.', 'Matter only: ⅔ × 14.5 = 9.7 billion years: younger than the oldest stars, a contradiction.', 'With Ω_Λ = 0.685 the age becomes 13.8 billion years, which fits.'], '9.7 Gyr without dark energy; 13.8 Gyr with it'], c: ['In a radiation-dominated universe, how does a grow with time?', 'As t^(1/2).'] }]
  ],
  m: [
    ['Picturing the expansion as galaxies flying through space.', 'Space itself stretches; distances scale with a(t).'],
    ['Assuming all contents thin out the same way.', 'Matter ∝ a⁻³, radiation ∝ a⁻⁴, Λ constant.'],
    ['Thinking gravity always slows the expansion.', 'Negative-pressure components accelerate it.']
  ]
});

WL.gd('y4-early-universe', {
  h: 'Run the expansion backwards and the Universe gets hotter and denser. In its first minutes, nuclear reactions turned a quarter of its hydrogen into helium; after 380 000 years atoms formed and light streamed free, the glow we now see as the cosmic microwave background. Before all that, a burst of accelerated expansion, inflation, explains why the Universe is so smooth and flat.',
  s: [
    ['The hot Big Bang', [
      'Radiation cools as T ∝ 1/a. In the radiation era a ∝ t^(1/2), so T falls as t^(−1/2): about 10¹⁰ K (1 MeV) at one second. Today’s measured contents are about 5% ordinary matter, 27% dark matter and 68% dark energy.'
    ], { n: 0, e: 'a\\propto t^{1/2},\\qquad T\\propto t^{-1/2}', x: ['If T ≈ 10¹⁰ K at one second, estimate T at one minute. What does the simple scaling assume?', ['Simple scaling, T ∝ t^(−1/2): T = 10¹⁰ ÷ √60 = 1.3 × 10⁹ K.', 'It assumes the mix of particles stays the same. Between one second and one minute, electrons and positrons annihilate and hand their energy to the photons, so the photons cool more slowly.', 'The careful calculation gives about 1.7 × 10⁹ K (kT ≈ 0.15 MeV) at one minute: about a third higher.'], 'about 1.7 × 10⁹ K; the simple scaling gives 1.3 × 10⁹ K'], c: ['Why does radiation’s temperature fall as 1/a?', 'Every wavelength stretches with the expansion, so each photon’s energy falls as 1/a.'] }],
    ['Two puzzles', [
      'Opposite sides of the sky show the same background temperature to one part in 10⁵, yet in ordinary expansion regions more than about 2° apart could never have exchanged signals before that light was emitted: the **horizon problem**. And the density is so close to critical today that it must have been tuned extraordinarily finely at early times: the **flatness problem**.'
    ], { n: 1, c: ['Why is the uniformity of the background radiation a puzzle without inflation?', 'Regions more than about 2° apart had never been in contact, yet have the same temperature to 1 part in 10⁵.'] }],
    ['Inflation', [
      'Suppose that very early on the energy was dominated by a slowly rolling field behaving like a cosmological constant. The expansion was then exponential, a ∝ e^(Ht). About 60 e-folds stretch one causally connected patch over the whole observable Universe and drive Ω to 1. Quantum fluctuations, stretched to cosmic size, seed the galaxies.'
    ], { n: 2, e: 'a\\propto e^{Ht},\\qquad N = \\ln\\frac{a_{\\text{end}}}{a_{\\text{start}}}\\gtrsim 60', x: ['How much does space grow in 60 e-folds, and how much does that shrink a departure from flatness?', ['Growth: e⁶⁰ = 1.1 × 10²⁶.', '|Ω − 1| ∝ 1/(aH)², and H is nearly constant, so it shrinks by e^(−120) ≈ 10⁻⁵².'], 'by 10²⁶; flatness improved by about 10⁵²'], c: ['What do the quantum fluctuations during inflation become?', 'The small density variations that grew into galaxies, and the hot and cold spots of the background radiation.'] }],
    ['Big Bang nucleosynthesis', [
      'At about 0.8 MeV the reactions that turn neutrons into protons and back stop, leaving about one neutron per five protons. Neutrons then decay until deuterium can survive, at about three minutes, by which time n/p ≈ 1/7. Almost all of them end up in helium-4.'
    ], { n: 3, e: 'Y_p\\approx\\frac{2(n/p)}{1+n/p}', x: ['Find n/p at freeze-out (neutron–proton energy difference 1.293 MeV, kT ≈ 0.8 MeV) and the helium mass fraction for n/p = 1/7.', ['n/p = e^(−1.293/0.8) = e^(−1.62) = 0.20, about 1/5.', 'With n/p = 1/7: Y = 2(1/7) ÷ (1 + 1/7) = (2/7) ÷ (8/7) = 0.25.'], 'about 1/5; Y = 0.25'], c: ['Why do nearly all surviving neutrons end up in helium-4?', 'It is by far the most tightly bound light nucleus, and there are no stable nuclei of mass 5 or 8 to build further.'] }],
    ['Recombination and the background radiation', [
      'Hydrogen’s binding energy is 13.6 eV, but there are about 1.6 × 10⁹ photons per atom, so even the rare high-energy photons keep atoms ionised until kT ≈ 0.26 eV: 3000 K, redshift 1100, 380 000 years. Then the light decouples. Its tiny temperature variations show **acoustic peaks**: sound waves in the early plasma, frozen in place.'
    ], { n: 4, x: ['The first acoustic peak is at multipole ℓ ≈ 220. What angle does it correspond to, and what does it tell us?', ['Angle ≈ 180°/ℓ = 180° ÷ 220 ≈ 0.8°, about a degree.', 'That matches the predicted size of the sound horizon seen across flat space.', 'So the Universe is spatially flat to good accuracy.'], 'about 1°: space is flat'], c: ['Why does the background radiation show acoustic peaks?', 'Sound waves in the photon–baryon plasma were frozen at decoupling, leaving preferred angular scales.'] }],
    ['The standard model of cosmology', [
      'Six parameters fit the Planck data and much else: Ω_bh² = 0.0224, Ω_ch² = 0.120, n_s = 0.965, H₀ = 67.4 km s⁻¹ Mpc⁻¹, an age of 13.8 billion years, and the amplitude of the fluctuations. It fits remarkably well, but not everything agrees: measurements of the expansion history by the DESI survey (2024–25) hint, at roughly 3–4σ, that dark energy may change with time.'
    ], { n: 5, x: ['With h = H₀/(100 km s⁻¹ Mpc⁻¹) = 0.674, convert Ω_bh² = 0.0224 and Ω_ch² = 0.120 into Ω_b and Ω_m.', ['h² = 0.454.', 'Ω_b = 0.0224 ÷ 0.454 = 0.049; Ω_c = 0.120 ÷ 0.454 = 0.264.', 'Ω_m = Ω_b + Ω_c = 0.31.'], 'Ω_b ≈ 0.05; Ω_m ≈ 0.31'], c: ['What is the “Hubble tension”?', 'The model fitted to the background radiation gives H₀ ≈ 67.4, while the nearby distance ladder of Cepheids and supernovae gives about 73: a disagreement of about 5σ. Some other local methods land in between, so whether it points to hidden errors or new physics is still argued.'] }]
  ],
  m: [
    ['Thinking the Big Bang happened at a point in space.', 'It happened everywhere; all of space was hot and dense.'],
    ['Expecting atoms to form at 13.6 eV ÷ k ≈ 160 000 K.', 'The huge number of photons per atom delays it to about 3000 K.'],
    ['Treating inflation as directly observed.', 'Its predictions fit the data well, but the inflaton has not been detected.']
  ]
});
