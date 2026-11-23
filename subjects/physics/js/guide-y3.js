/* Geodesic step-by-step guides, stage y3 (built from src/guide/y3-*.js) */
WL.gd('y3-hamiltonian', {
  h: 'Hamilton rewrote mechanics so that positions and momenta are equal partners. A single function, the Hamiltonian, then drives the motion through two neat first-order equations, and every possible state of a system becomes a point flowing through phase space. That picture is the foundation of statistical mechanics, and its brackets became the commutators of quantum mechanics.',
  s: [
    ['From Lagrangian to Hamiltonian', [
      'Define the **canonical momentum** p_i = ∂L/∂q̇_i for each coordinate. The **Hamiltonian** H = Σp_iq̇_i − L, written in terms of q and p (not q̇), swaps velocities for momenta as the independent variables. When the kinetic energy is quadratic in the velocities and the constraints do not change with time, H is just the total energy T + V.'
    ], { n: 0, e: 'H(q,p,t) = \\sum_i p_i\\dot q_i - L,\\qquad p_i = \\frac{\\partial L}{\\partial\\dot q_i}', x: ['Find H for a particle moving in a plane in a potential U(r), using polar coordinates.', ['L = ½m(ṙ² + r²φ̇²) − U(r), so p_r = mṙ and p_φ = mr²φ̇.', 'Replace the velocities: ṙ = p_r/m and φ̇ = p_φ/(mr²).', 'H = p_r²/(2m) + p_φ²/(2mr²) + U(r).'], 'H = p_r²/2m + p_φ²/2mr² + U(r)'], c: ['When is H equal to the total energy?', 'When T is quadratic in the velocities and the constraints do not depend on time.'] }],
    ['Hamilton’s equations', [
      'Treating q and p as independent and making the action stationary gives 2n first-order equations instead of Lagrange’s n second-order ones. If H has no explicit time dependence, it is conserved; if a coordinate does not appear in H, its momentum is conserved.'
    ], { n: 1, e: '\\dot q_i = \\frac{\\partial H}{\\partial p_i},\\qquad \\dot p_i = -\\frac{\\partial H}{\\partial q_i}', x: ['Write Hamilton’s equations for H = p²/2m + ½mω²q², and recover the familiar equation of motion.', ['q̇ = ∂H/∂p = p/m.', 'ṗ = −∂H/∂q = −mω²q.', 'Differentiate the first and use the second: q̈ = ṗ/m = −ω²q.'], 'q̈ = −ω²q'], c: ['In the polar example above, which momentum is conserved and why?', 'p_φ, the angular momentum: φ does not appear in H.'] }],
    ['Phase space', [
      'A state is a point (q, p); its future is a curve, and two curves can never cross, because the equations are first order. The harmonic oscillator traces ellipses. A pendulum has two kinds of motion, swinging and spinning all the way round, separated by a special curve (the separatrix) through the upside-down position.'
    ], { n: 2, x: ['Show that an oscillator with energy E traces an ellipse in phase space of area 2πE/ω.', ['p²/2m + ½mω²q² = E is an ellipse.', 'Its half-widths are p_max = √(2mE) and q_max = √(2E/(mω²)).', 'Area = π p_max q_max = π × 2E/ω = 2πE/ω.'], 'area 2πE/ω'], c: ['What happens to a pendulum’s period as its energy approaches that needed to reach the top?', 'It grows without limit: near the separatrix the pendulum lingers almost forever near the upside-down point.'] }],
    ['Poisson brackets', [
      'For any two functions f and g of the phase-space variables, the **Poisson bracket** {f, g} gives how f changes in time: df/dt = {f, H} + ∂f/∂t. A quantity is conserved if its bracket with H vanishes. Dirac noticed that quantum commutators follow the same rules with {f, g} → [f̂, ĝ]/(iħ).'
    ], { n: 3, e: '\\{f,g\\} = \\sum_i\\left(\\frac{\\partial f}{\\partial q_i}\\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial g}{\\partial q_i}\\right),\\qquad \\{q,p\\} = 1', x: ['Show that L_z = xp_y − yp_x is conserved for H = (p_x² + p_y²)/2m + U(r).', ['{L_z, p_x² + p_y²} = 0: rotating the momentum does not change its size.', '{L_z, U(r)} = −(x ∂U/∂y − y ∂U/∂x) = −U′(r)(xy/r − yx/r) = 0.', 'So dL_z/dt = {L_z, H} = 0.'], 'L_z is conserved'], c: ['What does Dirac’s rule turn {x, p} = 1 into?', 'The quantum commutator [x̂, p̂] = iħ.'] }],
    ['Action and slow changes', [
      'For periodic motion, the **action** J = ∮p dq (the area enclosed in phase space) is a natural variable, and the frequency is ∂H/∂J (in cycles per unit time; with I = J/2π the angular frequency is ∂H/∂I). The action is an **adiabatic invariant**: if a parameter changes slowly compared with one period, J barely changes even though the energy does. For an oscillator, J = 2πE/ω, so E/ω stays constant.'
    ], { n: 4, e: 'J = \\oint p\\,dq,\\qquad \\nu = \\frac{\\partial H}{\\partial J}', x: ['A mass on a spring oscillates while its stiffness is slowly increased fourfold. What happens to its energy and its amplitude?', ['ω ∝ √k doubles, and E/ω is constant, so E doubles.', 'E = ½kA²: A² = 2E/k goes from 2E/k to 2(2E)/(4k), half as much.', 'So A falls by a factor √2.'], 'energy doubles; amplitude falls by √2'], c: ['Why must the change be slow for the action to stay constant?', 'If the parameter changes within one period, the motion is kicked unevenly around its cycle and the enclosed area changes.'] }],
    ['Liouville’s theorem', [
      'Hamiltonian flow has zero divergence in phase space: ∂q̇/∂q + ∂ṗ/∂p = ∂²H/∂q∂p − ∂²H/∂p∂q = 0. So a cloud of systems flows like an incompressible fluid, keeping its phase-space volume. This is why statistical mechanics can give equal probability to equal phase-space volumes.'
    ], { n: 5, e: '\\frac{d\\rho}{dt} = \\frac{\\partial\\rho}{\\partial t} + \\{\\rho, H\\} = 0', x: ['Check the zero divergence for the harmonic oscillator.', ['q̇ = p/m, so ∂q̇/∂q = 0.', 'ṗ = −mω²q, so ∂ṗ/∂p = 0.', 'The sum is zero: the ellipses rotate the cloud without squeezing it.'], 'zero divergence'], c: ['If friction is added, is phase-space volume still conserved?', 'No: friction shrinks it, as every trajectory spirals into the equilibrium point.'] }]
  ],
  m: [
    ['Writing H in terms of q̇ instead of p.', 'Eliminate every velocity in favour of the momenta.'],
    ['Assuming H is always the energy.', 'Only when T is quadratic in velocities and constraints are fixed in time.'],
    ['Getting the minus sign in the wrong equation.', 'It is ṗ = −∂H/∂q.']
  ]
});

WL.gd('y3-fluid-dynamics', {
  h: 'The same equation describes honey dripping off a spoon and a hurricane crossing an ocean: the Navier–Stokes equation, Newton’s second law for each small parcel of fluid. One number, the Reynolds number, decides whether the flow is smooth or chaotic, and whether its solutions always stay smooth in three dimensions is still an unsolved million-dollar problem.',
  s: [
    ['Describing a flowing fluid', [
      'Describe the flow by a velocity field u(r, t), with density and pressure at each point. A parcel moving with the flow changes for two reasons: the field changes in time, and the parcel moves to where the field is different. The **material derivative** D/Dt = ∂/∂t + u·∇ combines both. For an incompressible fluid, conservation of mass becomes ∇·u = 0.'
    ], { n: 0, e: '\\frac{D}{Dt} = \\frac{\\partial}{\\partial t} + \\mathbf u\\cdot\\nabla,\\qquad \\nabla\\cdot\\mathbf u = 0', x: ['The steady flow u = (x, −y) heads into a wall and turns. Is it incompressible, and do its parcels accelerate?', ['∇·u = ∂x/∂x + ∂(−y)/∂y = 1 − 1 = 0: incompressible.', 'Du/Dt = (u·∇)u = (x ∂/∂x − y ∂/∂y)(x, −y) = (x, y).', 'So parcels accelerate, although the flow pattern never changes.'], 'incompressible; acceleration (x, y)'], c: ['In a steady flow, can a fluid parcel accelerate?', 'Yes: it moves to places where the velocity is different, so u·∇u need not be zero.'] }],
    ['Euler’s equation and Bernoulli', [
      'Without viscosity, a parcel is pushed only by pressure differences and gravity: Euler’s equation. For steady flow, p + ½ρu² + ρgz is constant along a streamline (Bernoulli): fast flow means low pressure.'
    ], { n: 1, e: '\\rho\\frac{D\\mathbf u}{Dt} = -\\nabla p + \\rho\\mathbf g', x: ['A 20 m/s wind blows over a flat roof of area 100 m², with still air in the house below. Estimate the upward force.', ['The pressure drop above the roof is about ½ρu² = ½ × 1.2 × 20² = 240 Pa.', 'Force = 240 × 100 = 2.4 × 10⁴ N.'], 'about 24 kN, upwards'], c: ['Why must you be careful using Bernoulli between points on different streamlines?', 'The constant can differ from streamline to streamline, unless the flow has no vorticity.'] }],
    ['Viscosity and the Navier–Stokes equation', [
      'In a Newtonian fluid the shear stress is proportional to the velocity gradient, τ = μ du/dy, where μ is the viscosity (water 1.0 × 10⁻³ Pa s, air 1.8 × 10⁻⁵ Pa s). Adding the viscous force gives the **Navier–Stokes equation**. At a solid wall the fluid moves with the wall: the **no-slip** condition.'
    ], { n: 2, e: '\\rho\\left(\\frac{\\partial\\mathbf u}{\\partial t} + \\mathbf u\\cdot\\nabla\\mathbf u\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf u + \\mathbf f', x: ['Oil (μ = 0.10 Pa s) fills a 1.0 mm gap between two plates; the top plate (0.20 m²) slides at 0.50 m/s. What force is needed?', ['With no slip, the velocity rises linearly from 0 to 0.50 m/s across the gap: du/dy = 500 s⁻¹.', 'τ = μ du/dy = 0.10 × 500 = 50 Pa.', 'F = τA = 50 × 0.20 = 10 N.'], '10 N'], c: ['What does the no-slip condition say?', 'Fluid touching a solid surface moves with that surface.'] }],
    ['The Reynolds number', [
      'Compare the inertial term (about ρU²/L) with the viscous term (about μU/L²): their ratio is the **Reynolds number** Re = ρUL/μ = UL/ν. Flows with the same shape and the same Re behave identically, which is why scale models work.'
    ], { n: 3, e: '\\mathrm{Re} = \\frac{\\rho UL}{\\mu} = \\frac{UL}{\\nu}', x: ['Compare Re for a bacterium (30 μm/s, 2 μm long) and a human swimmer (1 m/s, 2 m), both in water (ν = 1.0 × 10⁻⁶ m²/s).', ['Bacterium: Re = 3 × 10⁻⁵ × 2 × 10⁻⁶ ÷ 10⁻⁶ = 6 × 10⁻⁵: viscosity rules, and it stops dead when it stops swimming.', 'Swimmer: Re = 1 × 2 ÷ 10⁻⁶ = 2 × 10⁶: inertia rules, and the wake is turbulent.'], 'about 10⁻⁴ against 10⁶'], c: ['A 1/10-scale model is tested in air. To match the real Reynolds number, how fast must the wind be?', 'Ten times faster (or use a fluid with a smaller ν).'] }],
    ['Vorticity', [
      'The **vorticity** ω = ∇ × u measures local spinning. Without viscosity, the circulation round a loop moving with the fluid stays constant (Kelvin), so vortex lines move with the fluid. Stretching a vortex tube makes it spin faster, which drives energy to ever smaller eddies. A wing’s lift per metre of span is ρUΓ, where Γ is the circulation round it.'
    ], { n: 4, e: 'L\' = \\rho U\\Gamma', x: ['A wing in air (ρ = 1.2 kg/m³) at 60 m/s has a circulation of 40 m²/s. Find the lift per metre and for a 10 m span.', ['L′ = 1.2 × 60 × 40 = 2900 N per metre.', 'Over 10 m: 2.9 × 10⁴ N, enough to hold up about 3 tonnes.'], '2.9 kN per metre; 29 kN in all'], c: ['Why does stretching a vortex tube make it spin faster?', 'Its circulation is conserved while it gets thinner, just as a skater spins faster pulling in her arms.'] }],
    ['Turbulence', [
      'At high Re, energy put in at large scales cascades through smaller and smaller eddies until viscosity turns it into heat. Kolmogorov (1941) argued that in between, only the dissipation rate per unit mass ε matters, which fixes the energy spectrum and the size η of the smallest eddies.'
    ], { n: 5, e: 'E(k) = C\\,\\varepsilon^{2/3}k^{-5/3},\\qquad \\eta = \\left(\\frac{\\nu^3}{\\varepsilon}\\right)^{1/4}', x: ['Estimate the smallest eddy size in the lower atmosphere (ν = 1.5 × 10⁻⁵ m²/s, ε ≈ 10⁻³ W/kg).', ['η = ((1.5 × 10⁻⁵)³ ÷ 10⁻³)^(1/4) = (3.4 × 10⁻¹²)^(1/4).', '= 1.4 × 10⁻³ m.'], 'about 1 mm'], c: ['Why is simulating turbulent flow directly so expensive?', 'The number of active scales grows as Re^(9/4) in three dimensions.'] }]
  ],
  m: [
    ['Using Bernoulli in viscous or turbulent regions.', 'It assumes steady, inviscid flow along a streamline.'],
    ['Dropping the nonlinear term u·∇u.', 'It is what makes turbulence possible.'],
    ['Scaling a model by size alone.', 'Match the Reynolds number too.']
  ]
});

WL.gd('y3-dirac', {
  h: 'Dirac notation strips quantum mechanics down to linear algebra. A state is a vector in a complex space; a measurement asks for its components along special directions; time evolution rotates it. A wavefunction turns out to be nothing more than the list of a state’s components in one particular basis.',
  s: [
    ['Kets, bras and inner products', [
      'A state is a **ket** |ψ⟩. Each ket has a **bra** ⟨ψ|, and their product ⟨φ|ψ⟩ is a complex number with ⟨φ|ψ⟩ = ⟨ψ|φ⟩*. Physical states are normalised, ⟨ψ|ψ⟩ = 1, and kets that differ only by an overall phase describe the same state. Components are inner products: in position space ψ(x) = ⟨x|ψ⟩.'
    ], { n: 0, e: '|\\psi\\rangle = \\sum_n c_n|n\\rangle,\\qquad c_n = \\langle n|\\psi\\rangle', x: ['A spin is in |ψ⟩ = (3|↑⟩ + 4i|↓⟩)/5. Is it normalised, and what is the probability of finding it down?', ['⟨ψ|ψ⟩ = (|3|² + |4i|²)/25 = (9 + 16)/25 = 1.', '⟨↓|ψ⟩ = 4i/5, so P(down) = |4i/5|² = 16/25.'], 'yes; 16/25'], c: ['Do |ψ⟩ and −|ψ⟩ describe different states?', 'No: an overall phase changes no prediction.'] }],
    ['Operators and the identity', [
      'An operator maps kets to kets, with matrix elements A_mn = ⟨m|Â|n⟩. For a complete orthonormal basis, Σ|n⟩⟨n| = 1, and inserting this “resolution of the identity” is the most useful move in the notation. A Hermitian operator can be written through its own eigenvectors: Â = Σa_n|a_n⟩⟨a_n|.'
    ], { n: 1, e: '\\sum_n |n\\rangle\\langle n| = \\hat 1,\\qquad \\hat A = \\sum_n a_n\\,|a_n\\rangle\\langle a_n|', x: ['For |ψ⟩ = (3|↑⟩ + 4i|↓⟩)/5, find ⟨σ_x⟩, ⟨σ_y⟩ and ⟨σ_z⟩.', ['σ_x swaps the components: ⟨σ_x⟩ = (3 × 4i + (−4i) × 3)/25 = 0.', 'σ_y|ψ⟩ = (4|↑⟩ + 3i|↓⟩)/5, so ⟨σ_y⟩ = (3 × 4 + (−4i)(3i))/25 = 24/25.', '⟨σ_z⟩ = (9 − 16)/25 = −7/25. The squares add to 1: a point on the Bloch sphere.'], '(0, 24/25, −7/25)'], c: ['Insert Σ|n⟩⟨n| into ⟨φ|ψ⟩. What do you get?', 'Σ⟨φ|n⟩⟨n|ψ⟩ = Σφ_n*ψ_n: the familiar sum of products of components.'] }],
    ['The postulates', [
      'A state is a normalised vector. Every observable is a Hermitian operator. A measurement gives one of its eigenvalues, with probability |⟨a_n|ψ⟩|² (the Born rule). Straight afterwards the state is the corresponding eigenvector. Between measurements the state evolves by the Schrödinger equation.'
    ], { n: 2, e: 'P(a_n) = |\\langle a_n|\\psi\\rangle|^2,\\qquad \\langle A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle', c: ['Straight after a measurement finds S_z = +ħ/2, what is the state?', '|↑⟩, the eigenvector for that result.'] }],
    ['Time evolution', [
      'For a time-independent Hamiltonian, |ψ(t)⟩ = Û(t)|ψ(0)⟩ with Û = e^(−iĤt/ħ). Because Ĥ is Hermitian, Û is unitary, so probabilities are conserved. Alternatively, keep states fixed and let operators evolve (the Heisenberg picture): dÂ_H/dt = (i/ħ)[Ĥ, Â_H].'
    ], { n: 3, e: '\\hat U(t) = e^{-i\\hat Ht/\\hbar} = \\sum_n e^{-iE_nt/\\hbar}\\,|n\\rangle\\langle n|', x: ['A spin in a field along z has Ĥ = (ħω/2)σ_z. It starts up along x. How does ⟨σ_x⟩ change?', ['|ψ(0)⟩ = (|↑⟩ + |↓⟩)/√2, and the energy states pick up phases e^(∓iωt/2).', '|ψ(t)⟩ = (e^(−iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)/√2.', '⟨σ_x⟩ = Re(e^(iωt/2) × e^(iωt/2)) = cos ωt: the spin precesses about z.'], '⟨σ_x⟩ = cos ωt'], c: ['Why must the time-evolution operator be unitary?', 'So that the total probability, the length of the state vector, stays 1.'] }],
    ['Compatible observables', [
      'If [Â, B̂] = 0, the two operators share eigenvectors, and measuring B does not disturb an earlier result for A. A complete set of commuting observables labels each state uniquely, such as Ĥ, L̂² and L̂_z for hydrogen (ignoring spin).'
    ], { n: 4, x: ['How many states of hydrogen (ignoring spin) share n = 2, and how are they labelled?', ['l can be 0 or 1.', 'l = 0 gives m = 0; l = 1 gives m = −1, 0, 1.', 'So four states: |2 0 0⟩, |2 1 −1⟩, |2 1 0⟩, |2 1 1⟩.'], 'four, labelled by l and m'], c: ['If [A, B] = 0, can a state have definite values of both?', 'Yes: they have a common set of eigenvectors.'] }],
    ['What the postulates hide', [
      'The postulates are short, but they lean on a split between “system” and “measurement” that they never define (the **measurement problem**), and on mathematical care with infinite dimensions: position eigenstates |x⟩ are not normalisable, and real states are wave packets built from them.'
    ], { n: 5, c: ['Why is |x⟩ not a physical state?', 'It cannot be normalised: ⟨x|x′⟩ = δ(x − x′), which is infinite when x = x′. Real states are wave packets.'] }]
  ],
  m: [
    ['Forgetting the complex conjugate in a bra.', '⟨ψ| has the conjugated components of |ψ⟩.'],
    ['Treating |x⟩ or |p⟩ as normalisable states.', 'They are idealisations; physical states are packets.'],
    ['Ignoring relative phases.', 'An overall phase does not matter; relative phases do.']
  ]
});

WL.gd('y3-angular-momentum', {
  h: 'Orbital motion, electron spin, the spin of a nucleus: every kind of angular momentum in quantum mechanics obeys the same three commutation relations. From those alone, without any wavefunctions, you can find every allowed value, and the rules for adding two angular momenta together.',
  s: [
    ['The algebra', [
      'Angular momentum is defined by its commutators: [J_x, J_y] = iħJ_z and cyclic permutations. The components do not commute with one another, but each commutes with J² = J_x² + J_y² + J_z². So J² and one component, usually J_z, can be sharp together, giving states |j, m⟩.'
    ], { n: 0, e: '[\\hat J_i,\\hat J_j] = i\\hbar\\,\\varepsilon_{ijk}\\hat J_k,\\qquad \\hat J^2|j,m\\rangle = \\hbar^2 j(j+1)|j,m\\rangle,\\qquad \\hat J_z|j,m\\rangle = \\hbar m|j,m\\rangle', c: ['Why can J_x and J_z not both be sharp (unless j = 0)?', 'They do not commute, so they have no common eigenstates with non-zero angular momentum.'] }],
    ['Ladder operators', [
      'J₊ = J_x + iJ_y raises m by one and J₋ lowers it. Since J_x² + J_y² cannot be negative, m² ≤ j(j + 1), so the ladder must stop at both ends, at m = j and m = −j. Getting from −j to j in whole steps forces 2j to be a whole number: j = 0, ½, 1, 3/2, …'
    ], { n: 1, e: '\\hat J_\\pm|j,m\\rangle = \\hbar\\sqrt{j(j+1) - m(m\\pm1)}\\;|j,m\\pm1\\rangle', x: ['Find J₋|1, 1⟩ and J₊|3/2, −1/2⟩.', ['J₋|1, 1⟩ = ħ√(2 − 1 × 0)|1, 0⟩ = √2 ħ|1, 0⟩.', 'J₊|3/2, −1/2⟩ = ħ√(15/4 − (−½)(½))|3/2, 1/2⟩ = ħ√4 |3/2, 1/2⟩ = 2ħ|3/2, 1/2⟩.'], '√2 ħ|1, 0⟩ and 2ħ|3/2, 1/2⟩'], c: ['Why must 2j be a whole number?', 'The ladder must reach +j from −j in whole steps, which needs 2j steps.'] }],
    ['Orbital angular momentum', [
      'For L = r × p, the eigenfunctions are the **spherical harmonics** Y_l^m(θ, φ) ∝ P_l^m(cos θ)e^(imφ). The wavefunction must return to itself after a full turn, so m, and hence l, must be whole numbers. Half-integer values occur only for spin.'
    ], { n: 2, x: ['For l = 2, compare |L| with the largest L_z. What is the smallest angle L can make with the z-axis?', ['|L| = ħ√(l(l + 1)) = √6 ħ = 2.45ħ.', 'Largest L_z = 2ħ.', 'cos θ = 2/√6, so θ = 35°: L can never point exactly along z.'], '2.45ħ against 2ħ; at least 35°'], c: ['Why can orbital angular momentum not have half-integer l?', 'e^(imφ) must return to itself after φ → φ + 2π, which requires whole-number m.'] }],
    ['Adding angular momenta', [
      'Two angular momenta add to J = J₁ + J₂, which obeys the same algebra. The total j runs from |j₁ − j₂| to j₁ + j₂ in steps of one, with m = m₁ + m₂. Both descriptions, the separate (uncoupled) states and the combined (coupled) states, span the same space, so the state counts must match.'
    ], { n: 3, e: 'j = |j_1-j_2|,\\ \\dots,\\ j_1+j_2,\\qquad \\sum_{j}(2j+1) = (2j_1+1)(2j_2+1)', x: ['A p electron has l = 1 and spin ½. What total j are possible, and do the state counts match?', ['j = ½ or 3/2.', 'Coupled: 2 + 4 = 6 states. Uncoupled: 3 × 2 = 6 states.'], 'j = ½ or 3/2; 6 states either way'], c: ['What total j can two j = 1 angular momenta make?', '0, 1 and 2, with 1 + 3 + 5 = 9 = 3 × 3 states.'] }],
    ['Clebsch–Gordan coefficients', [
      'The coefficients ⟨j₁m₁; j₂m₂|j m⟩ convert between the two descriptions. To find them, start from the top state (both maximal), lower it with J₋ = J₁₋ + J₂₋, and build each smaller-j family orthogonal to those already found.'
    ], { n: 4, x: ['Build the coupled states of two spin-½ particles.', ['Top: |1, 1⟩ = |↑↑⟩.', 'Lower with J₋: √2 |1, 0⟩ = |↓↑⟩ + |↑↓⟩, so |1, 0⟩ = (|↑↓⟩ + |↓↑⟩)/√2, and |1, −1⟩ = |↓↓⟩.', 'Orthogonal to |1, 0⟩: |0, 0⟩ = (|↑↓⟩ − |↓↑⟩)/√2, the singlet.'], 'a triplet (j = 1) and a singlet (j = 0)'], c: ['Two spins are in |1, 0⟩. What is the probability that the first spin is up?', 'One half.'] }],
    ['Selection rules and rotations', [
      'An operator like r carries angular momentum 1, so it only links states with Δj = 0, ±1 and Δm = 0, ±1; for single-electron light emission, parity also requires Δl = ±1. A rotation through θ is the operator e^(−iθn̂·J/ħ), and for half-integer j a rotation by 2π multiplies the state by −1.'
    ], { n: 5, x: ['From a 3d state, which of 2p, 2s and 4f can an electron reach by emitting or absorbing one photon?', ['3d → 2p: Δl = −1, allowed (emission).', '3d → 2s: Δl = −2, forbidden.', '3d → 4f: Δl = +1, allowed (absorption).'], '2p and 4f, not 2s'], c: ['What does a 2π rotation do to a spin-½ state, and can it be seen?', 'It multiplies the state by −1; the sign shows up in interference, and was observed with neutrons in 1975.'] }]
  ],
  m: [
    ['Taking |L| = lħ.', '|L| = ħ√(l(l + 1)), always longer than the largest L_z.'],
    ['Letting m run outside −j to j.', 'm takes 2j + 1 values from −j to +j.'],
    ['Assuming uncoupled states have definite total j.', 'Most are mixtures of several j values.']
  ]
});

WL.gd('y3-spin', {
  h: 'In 1922 Stern and Gerlach sent silver atoms through a magnet that pulls harder on one side than the other. Instead of a smear, they got exactly two spots. Electrons carry an intrinsic angular momentum of ħ/2 with just two possible values along any axis, a property called spin, and it is the physics behind MRI, atomic clocks and the 21 cm radio map of our Galaxy.',
  s: [
    ['Stern–Gerlach', [
      'An atom with magnetic moment μ in a field that grows with height feels a force F_z = μ_z ∂B_z/∂z. Classically μ_z could take any value, so the beam would spread. Silver atoms form two distinct spots: the z-component of the electron’s spin takes only the values ±ħ/2.'
    ], { n: 0, e: 'F_z = \\mu_z\\frac{\\partial B_z}{\\partial z}', x: ['A silver atom (1.79 × 10⁻²⁵ kg) with μ_z = ±μ_B = ±9.27 × 10⁻²⁴ J/T crosses a 3.5 cm magnet with gradient 1000 T/m at 550 m/s. How far is it deflected?', ['F = 9.27 × 10⁻²⁴ × 1000 = 9.3 × 10⁻²¹ N, so a = 5.2 × 10⁴ m/s².', 'Time in the magnet: 0.035 ÷ 550 = 6.4 × 10⁻⁵ s.', 'Deflection = ½at² = ½ × 5.2 × 10⁴ × (6.4 × 10⁻⁵)² = 1.1 × 10⁻⁴ m.'], 'about 0.1 mm each way'], c: ['Atoms selected “up along z” are measured along x, then along z again. What fraction end up “up along z”?', 'Half: measuring along x erases the earlier z information.'] }],
    ['Pauli matrices and the Bloch sphere', [
      'In the basis |↑⟩, |↓⟩, spin is S = (ħ/2)σ, with the three Pauli matrices. A general state is a pair of complex numbers (a, b) with |a|² + |b|² = 1. Every spin-½ state is “up” along some direction (θ, φ), so the states map onto points of a sphere, the **Bloch sphere**: note the half-angle θ/2.'
    ], { n: 1, e: '|{\\uparrow_{\\hat n}}\\rangle = \\cos\\tfrac{\\theta}{2}|{\\uparrow}\\rangle + e^{i\\phi}\\sin\\tfrac{\\theta}{2}|{\\downarrow}\\rangle', x: ['Find the states “up along x” and “up along y”, and check the first is an eigenvector of σ_x.', ['Along x: θ = 90°, φ = 0: (|↑⟩ + |↓⟩)/√2.', 'σ_x swaps the components, giving the same vector back: eigenvalue +1.', 'Along y: θ = 90°, φ = 90°: (|↑⟩ + i|↓⟩)/√2.'], '(|↑⟩ + |↓⟩)/√2 and (|↑⟩ + i|↓⟩)/√2'], c: ['Using σ_iσ_j = δ_ij + iε_ijkσ_k, what is σ_x²?', 'The identity matrix.'] }],
    ['The magnetic moment', [
      'The electron’s spin carries a magnetic moment μ = −g(e/2m)S with g ≈ 2.0023, about twice what a classically spinning charge would have. The natural unit is the **Bohr magneton** μ_B = eħ/2m = 5.79 × 10⁻⁵ eV/T. Nuclear moments are measured in nuclear magnetons, 1836 times smaller.'
    ], { n: 2, e: '\\boldsymbol\\mu = -g\\frac{e}{2m}\\mathbf S,\\qquad \\mu_B = \\frac{e\\hbar}{2m_e}', x: ['How far apart are the spin-up and spin-down energies of a free electron in a 1.0 T field, and what frequency does that correspond to?', ['ΔE = gμ_B B = 2.0023 × 5.79 × 10⁻⁵ eV = 1.16 × 10⁻⁴ eV.', 'f = ΔE/h = 1.16 × 10⁻⁴ × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = 2.8 × 10¹⁰ Hz.'], '0.12 meV; 28 GHz'], c: ['Why are nuclear magnetic moments about a thousand times smaller than the electron’s?', 'The magneton goes as 1/mass, and a proton is 1836 times heavier than an electron.'] }],
    ['Larmor precession', [
      'In a steady field B along z, the spin-up and spin-down parts pick up opposite phases, so the average spin ⟨S⟩ precesses round B at the **Larmor frequency**, exactly like a gyroscope: 28.0 GHz per tesla for an electron, 42.6 MHz per tesla for a proton.'
    ], { n: 3, e: '\\omega = \\frac{g\\mu_BB}{\\hbar}', x: ['At what frequency do protons precess in a 3.0 T MRI scanner?', ['f = 42.6 MHz/T × 3.0 T.', '= 128 MHz, in the radio band.'], '128 MHz'], c: ['Does the precession rate depend on how far the spin is tilted from the field?', 'No: every tilt precesses at the same Larmor frequency.'] }],
    ['Magnetic resonance', [
      'Add a weak field B₁ rotating at the Larmor frequency. Seen from a frame rotating with it, the spin feels a steady field and swings fully from up to down and back at the **Rabi frequency** Ω, proportional to B₁. Off resonance by Δ, the swing is faster but incomplete. A pulse lasting π/Ω flips the spin (a π pulse).'
    ], { n: 4, e: 'P_{\\uparrow\\to\\downarrow}(t) = \\frac{\\Omega^2}{\\Omega^2+\\Delta^2}\\,\\sin^2\\!\\left(\\frac{\\sqrt{\\Omega^2+\\Delta^2}\\,t}{2}\\right)', x: ['A rotating field of 10 μT acts on protons on resonance. How long is a π pulse?', ['Ω/2π = 42.6 MHz/T × 10 × 10⁻⁶ T = 426 Hz.', 'A π pulse lasts π/Ω = 1/(2 × 426 Hz) = 1.2 ms.'], 'about 1.2 ms'], c: ['If the drive is detuned by Δ = Ω, what is the largest flip probability?', 'Ω²/(Ω² + Δ²) = ½.'] }],
    ['Two spins and the 21 cm line', [
      'In hydrogen the electron and proton spins interact. The total-spin-1 state lies 5.87 μeV above the spin-0 state. The photon emitted when the atom flips between them has a wavelength of 21 cm; each atom waits about 11 million years on average, yet there is so much hydrogen that the line maps the whole Galaxy.'
    ], { n: 5, x: ['Check the frequency and wavelength of the 5.87 μeV transition.', ['f = 5.87 × 10⁻⁶ × 1.602 × 10⁻¹⁹ ÷ 6.626 × 10⁻³⁴ = 1.42 × 10⁹ Hz.', 'λ = c/f = 3.00 × 10⁸ ÷ 1.42 × 10⁹ = 0.211 m.'], '1420 MHz; 21 cm'], c: ['Why is the 21 cm line bright if each atom takes millions of years to emit?', 'There is an enormous amount of hydrogen, and collisions keep refilling the upper state.'] }]
  ],
  m: [
    ['Picturing spin as a literal spinning ball.', 'It is intrinsic angular momentum with no classical model.'],
    ['Confusing ⟨S_z⟩ with a possible result.', 'Each measurement gives only +ħ/2 or −ħ/2.'],
    ['Forgetting the half-angle in a spinor.', 'A tilt θ on the Bloch sphere enters as cos(θ/2), sin(θ/2).']
  ]
});
WL.gd('y3-hydrogen', {
  h: 'Hydrogen is the one real atom whose Schrödinger equation can be solved exactly, and the solution explains a remarkable amount: the colours of its spectrum, the shapes of atomic orbitals, and, with a few extra ideas, the layout of the whole periodic table. The energies come out of a simple demand: the wavefunction must not blow up far from the nucleus.',
  s: [
    ['Separating the equation', [
      'The Coulomb potential depends only on r, so the Hamiltonian commutes with L² and L_z, and ψ = R(r)Y_l^m(θ, φ). The angular part is the same for every central potential; all of the Coulomb physics is in the radial equation. With u = rR it looks like a one-dimensional problem with an effective potential that includes a centrifugal barrier.'
    ], { n: 0, e: '-\\frac{\\hbar^2}{2\\mu}\\frac{d^2u}{dr^2} + \\left[-\\frac{e^2}{4\\pi\\varepsilon_0 r} + \\frac{\\hbar^2 l(l+1)}{2\\mu r^2}\\right]u = Eu,\\qquad u(0) = 0', c: ['Why is the angular part of the solution the same for every central potential?', 'The potential depends only on r, so it enters only the radial equation; the angular part is fixed by L² and L_z.'] }],
    ['Why the energies are quantised', [
      'Far away, bound solutions decay as e^(−κr). Peel off the behaviour at both ends and expand what is left as a power series. A series that never stops grows like e^(2κr) and cannot be normalised, so it must stop, and that happens only for particular energies, labelled by the **principal quantum number** n.'
    ], { n: 1, e: 'E_n = -\\frac{\\mu e^4}{2(4\\pi\\varepsilon_0)^2\\hbar^2}\\,\\frac{1}{n^2} = -\\frac{13.6\\ \\text{eV}}{n^2}', x: ['For a hydrogen-like ion of nuclear charge Ze, E_n scales as Z². Find the ground-state energy of He⁺ and of Li²⁺.', ['He⁺ (Z = 2): E₁ = −4 × 13.6 = −54.4 eV.', 'Li²⁺ (Z = 3): E₁ = −9 × 13.6 = −122 eV.'], '−54.4 eV and −122 eV'], c: ['Why must the power series stop?', 'An unending series grows like e^(2κr), and the wavefunction could not be normalised.'] }],
    ['Quantum numbers and degeneracy', [
      'Each state is labelled by n = 1, 2, 3, …; l = 0, 1, …, n − 1; and m = −l, …, l. The energy depends on n alone, so level n holds n² states (2n² with spin). That extra sameness across different l is special to the 1/r potential.'
    ], { n: 2, x: ['How many states share n = 3?', ['l = 0, 1, 2, with 1, 3 and 5 values of m.', '1 + 3 + 5 = 9 spatial states; with spin, 18.'], '9 (18 with spin)'], c: ['Why do states with the same n but different l have the same energy only in hydrogen?', 'It comes from an extra hidden symmetry of the 1/r potential (the same one that keeps Kepler orbits closed); other central potentials split them.'] }],
    ['The wavefunctions', [
      'The ground state is ψ₁₀₀ = e^(−r/a₀)/√(πa₀³), where a₀ = 0.0529 nm is the **Bohr radius**. The probability of finding the electron between r and r + dr is P(r) = r²|R|² dr: it peaks at a₀ for 1s and at n²a₀ for the states with l = n − 1, Bohr’s old orbits.'
    ], { n: 3, e: '\\psi_{100} = \\frac{e^{-r/a_0}}{\\sqrt{\\pi a_0^3}},\\qquad \\langle r\\rangle = \\frac{a_0}{2}[3n^2 - l(l+1)]', x: ['For the 1s state, find ⟨r⟩ and the probability that the electron is within one Bohr radius of the nucleus.', ['⟨r⟩ = (a₀/2)(3 × 1 − 0) = 1.5a₀.', 'P(r < a₀) = ∫₀^a₀ (4/a₀³) r² e^(−2r/a₀) dr = 1 − 5e⁻².', '= 1 − 0.68 = 0.32.'], '⟨r⟩ = 1.5a₀; 32% within a₀'], c: ['|ψ|² is largest at the nucleus, so is the electron most likely to be found right there?', 'No: P(r) = 4πr²|ψ|² includes the volume of each shell, which is tiny near r = 0, so the most likely distance is a₀.'] }],
    ['Spectra', [
      'Photons from jumps between levels obey 1/λ = R_H(1/n₁² − 1/n₂²), with R_H = 1.0968 × 10⁷ m⁻¹. Jumps down to n₁ = 1 form the ultraviolet **Lyman** series; down to n₁ = 2, the visible **Balmer** series. Because R depends on the reduced mass, deuterium’s lines are shifted slightly.'
    ], { n: 4, e: '\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)', x: ['Find the wavelength of the 3 → 2 line (Hα) and the shortest wavelength in the Lyman series.', ['Hα: 1/λ = 1.0968 × 10⁷ × (1/4 − 1/9) = 1.0968 × 10⁷ × 5/36 = 1.523 × 10⁶ m⁻¹, so λ = 656.5 nm.', 'Lyman limit (∞ → 1): 1/λ = R_H, so λ = 91.2 nm.'], '656 nm; 91.2 nm'], c: ['Are deuterium’s lines at slightly longer or shorter wavelengths than hydrogen’s?', 'Shorter: its larger reduced mass makes R slightly bigger (by about 0.03%).'] }],
    ['Hydrogen-like systems', [
      'The same solution covers any two charges bound by the Coulomb force, with the right reduced mass and charges: ions such as He⁺, **positronium** (an electron and a positron), and **muonic hydrogen**, where a muon 207 times heavier than an electron replaces it.'
    ], { n: 5, x: ['Find the binding energy and size of positronium, and the Bohr radius of muonic hydrogen.', ['Positronium: μ = m_e/2, so the energies halve (6.8 eV binding) and the radius doubles (2a₀).', 'Muonic hydrogen: μ = 105.66 × 938.27 ÷ 1043.93 MeV/c² = 95.0 MeV/c² = 186 m_e.', 'Its Bohr radius is a₀/186 = 2.8 × 10⁻¹³ m, only a few hundred times the proton’s size.'], '6.8 eV and 2a₀; 285 fm'], c: ['Why is muonic hydrogen used to measure the size of the proton?', 'The muon orbits about 186 times closer, so its levels are noticeably shifted by the proton’s finite size.'] }]
  ],
  m: [
    ['Allowing l = n.', 'l runs from 0 to n − 1.'],
    ['Confusing the peak of |ψ|² with the most probable distance.', 'Use P(r) = r²|R|², which includes the shell volume.'],
    ['Using the electron mass for precise spectra.', 'Use the reduced mass.']
  ]
});

WL.gd('y3-tunnelling', {
  h: 'An alpha particle escapes from a uranium nucleus although it has far too little energy to climb the barrier holding it in. The Sun fuses hydrogen at temperatures where, classically, almost no protons could ever touch. Flash memory and the scanning tunnelling microscope work for the same reason: quantum waves leak through barriers.',
  s: [
    ['Inside a forbidden region', [
      'Where V > E, the Schrödinger equation becomes ψ″ = κ²ψ, with exponential solutions instead of waves. Classically the particle could never be there, since its kinetic energy would be negative; quantum mechanically the wavefunction simply decays, over a length of about 1/κ. For an electron, κ = 5.12 nm⁻¹ × √(V − E in eV).'
    ], { n: 0, e: '\\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}', x: ['How far does an electron 4.0 eV below the top of a barrier reach into it?', ['κ = 5.12 × √4.0 = 10.2 nm⁻¹.', '1/κ = 0.098 nm, about the size of an atom.'], 'about 0.1 nm'], c: ['Where can a classical particle with E < V₀ never be found?', 'Inside the barrier, where its kinetic energy would have to be negative.'] }],
    ['The rectangular barrier', [
      'Write incoming and reflected waves on the left, growing and decaying exponentials inside, and a transmitted wave on the right. Matching ψ and ψ′ at both edges fixes the transmission exactly. For a thick barrier (κa ≫ 1), it is dominated by the factor e^(−2κa).'
    ], { n: 1, e: 'T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}\\approx16\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right)e^{-2\\kappa a}', x: ['A 1.0 eV electron meets a 5.0 eV barrier 0.50 nm wide. Find T.', ['κ = 5.12 × √4.0 = 10.24 nm⁻¹, so κa = 5.12 and e^(−2κa) = 3.6 × 10⁻⁵.', 'Approximate: T ≈ 16 × 0.2 × 0.8 × 3.6 × 10⁻⁵ = 9.1 × 10⁻⁵.', 'Exact: sinh 5.12 = 83.7, so T = 1/(1 + 25 × 83.7² ÷ 16) = 9.1 × 10⁻⁵.'], 'about 9 × 10⁻⁵'], c: ['If the same barrier were 1.0 nm wide, roughly what would T be?', 'Another factor of e^(−10.24) ≈ 3.6 × 10⁻⁵: about 3 × 10⁻⁹.'] }],
    ['Exponential sensitivity', [
      'Because T goes as e^(−2κa), small changes in width make huge changes in transmission, and heavier particles tunnel far less: for the same energy deficit a proton’s κ is √1836 ≈ 43 times an electron’s. For smooth barriers the exponent becomes an integral (the WKB approximation).'
    ], { n: 2, e: 'T \\approx \\exp\\!\\left(-\\frac{2}{\\hbar}\\int_{x_1}^{x_2}\\sqrt{2m\\,(V(x) - E)}\\,dx\\right)', x: ['In a scanning tunnelling microscope the barrier is about 4.5 eV high. By what factor does the current change if the tip moves 0.10 nm closer?', ['κ = 5.12 × √4.5 = 10.9 nm⁻¹.', 'Ratio = e^(2κ × 0.10 nm) = e^(2.17) = 8.8.'], 'about 9 times, for one tenth of a nanometre'], c: ['Why do heavy particles tunnel so much less than electrons?', 'κ grows as √m, and T falls exponentially with κ.'] }],
    ['Where tunnelling matters', [
      'Alpha decay (Gamow, 1928): the alpha particle tunnels out through the Coulomb barrier, so tiny energy differences give huge differences in half-life. Fusion in stars: protons tunnel through their mutual repulsion. Technology: flash memory (electrons tunnel onto an isolated gate), tunnel diodes and the scanning tunnelling microscope.'
    ], { n: 3, x: ['Protons in the Sun’s core are at 1.5 × 10⁷ K. Compare their typical energy with the Coulomb barrier between two protons, about 0.7 MeV.', ['kT = 8.62 × 10⁻⁵ eV/K × 1.5 × 10⁷ K = 1.3 keV.', 'The barrier is about 500 times larger.', 'Classically the fraction of protons with enough energy is about e^(−500): none. Only tunnelling lets the Sun shine.'], 'kT is about 1/500 of the barrier'], c: ['Alpha energies vary only from about 4 to 9 MeV, yet half-lives range over more than 20 powers of ten. Why?', 'The transmission depends exponentially on the barrier integral, which changes a lot as the energy changes a little.'] }],
    ['How long does tunnelling take?', [
      'The question sounds simple but has no single answer. Some definitions of the tunnelling time stop growing as the barrier gets wider (the Hartman effect), seeming to imply speeds faster than light. No signal actually travels faster than c: the transmitted peak is built from the leading edge of the incoming packet.'
    ], { n: 4, c: ['Can the Hartman effect be used to send a signal faster than light?', 'No: the transmitted pulse is reshaped from the front of the incoming one; no information arrives earlier than light allows.'] }]
  ],
  m: [
    ['Using e^(−κa) instead of e^(−2κa).', 'The probability is the square of the amplitude, which decays as e^(−κa).'],
    ['Forgetting the mass in κ.', 'κ ∝ √m: protons tunnel far less than electrons.'],
    ['Using the e^(−2κa) approximation for thin barriers.', 'It needs κa ≫ 1; otherwise use the exact formula.']
  ]
});

WL.gd('y3-identical', {
  h: 'Two electrons are not just alike: they are identical, and no experiment can ever tell which is which. Quantum mechanics builds that in by demanding that swapping two particles leaves the state the same or flips its sign. The sign flip gives the Pauli exclusion principle, and with it the periodic table, the solidity of matter and the magnetism of iron.',
  s: [
    ['Exchange symmetry', [
      'For identical particles, swapping their labels cannot change any observable, so the state can only be multiplied by +1 or −1 (swapping twice must give it back). **Bosons** (integer spin: photons, helium-4 atoms) have symmetric states; **fermions** (half-integer spin: electrons, protons, neutrons) have antisymmetric ones.'
    ], { n: 0, e: '\\psi(2,1) = \\pm\\,\\psi(1,2)', c: ['Is a helium-4 atom a boson or a fermion?', 'A boson: it is made of six fermions (2 protons, 2 neutrons, 2 electrons), an even number, so its total spin is a whole number.'] }],
    ['Pauli exclusion', [
      'With one particle in state a and the other in b, the allowed states are the symmetric and antisymmetric combinations. For fermions with a = b, the antisymmetric combination vanishes: no two identical fermions can be in the same single-particle state. For N fermions the antisymmetric state is a **Slater determinant**.'
    ], { n: 1, e: '\\psi_\\pm(1,2) = \\frac{1}{\\sqrt2}\\left[\\psi_a(1)\\psi_b(2) \\pm \\psi_b(1)\\psi_a(2)\\right]', x: ['Non-interacting electrons sit in a 1D box (levels n²E₁). Find the lowest total energy for two electrons with the same spin, two with opposite spins, and three with the same spin.', ['Same spin: they must occupy n = 1 and n = 2: E₁ + 4E₁ = 5E₁.', 'Opposite spins: both can be in n = 1: 2E₁.', 'Three, same spin: n = 1, 2, 3: (1 + 4 + 9)E₁ = 14E₁.'], '5E₁, 2E₁ and 14E₁'], c: ['What happens to the antisymmetric two-particle state when a = b?', 'It is exactly zero: such a state does not exist.'] }],
    ['The exchange “force”', [
      'Symmetry alone changes how far apart identical particles tend to be, with no force acting: bosons bunch together and fermions keep apart. The size of the effect depends on how much the two single-particle states overlap, through ⟨x⟩_ab = ∫xψ_a*ψ_b dx.'
    ], { n: 2, e: '\\langle(x_1-x_2)^2\\rangle_\\pm = \\langle x^2\\rangle_a + \\langle x^2\\rangle_b - 2\\langle x\\rangle_a\\langle x\\rangle_b \\mp 2|\\langle x\\rangle_{ab}|^2', x: ['Two particles occupy the ground and first excited states of a harmonic oscillator, where ⟨x²⟩₀ = σ², ⟨x²⟩₁ = 3σ² and ⟨0|x|1⟩ = σ. Compare their mean square separation as distinguishable particles, bosons and fermions.', ['Both ⟨x⟩ are zero, so distinguishable: σ² + 3σ² = 4σ².', 'Bosons: 4σ² − 2σ² = 2σ²: closer together.', 'Fermions: 4σ² + 2σ² = 6σ²: further apart.'], '4σ², 2σ² and 6σ²'], c: ['Is the exchange “force” carried by some particle?', 'No: it is a correlation that comes purely from the symmetry of the state.'] }],
    ['Spin and space together', [
      'For electrons, the whole state, space times spin, must be antisymmetric. So a symmetric spatial state goes with the spin **singlet** (S = 0), and an antisymmetric spatial state with a spin **triplet** (S = 1). The antisymmetric spatial state keeps the electrons apart, lowering their repulsion: that is why the triplet usually lies lower (Hund’s first rule), and why spins can prefer to line up.'
    ], { n: 3, c: ['Two electrons are in a spin triplet. Can they be found at the same point?', 'No: their spatial state is antisymmetric, so it vanishes when x₁ = x₂.'] }],
    ['Helium', [
      'Helium has two electrons around a nucleus of charge 2e. Ignoring their repulsion, both sit in the 1s level of a Z = 2 ion: 2 × (−54.4 eV) = −108.8 eV. Adding the average repulsion, +34.0 eV, gives −74.8 eV; the measured value is −79.0 eV, and a variational calculation in which each electron partly screens the other reaches −77.5 eV.'
    ], { n: 4, x: ['Using the measured ground-state energy, find helium’s first ionisation energy.', ['Removing one electron leaves He⁺ in its ground state, at −54.4 eV.', 'Ionisation energy = −54.4 − (−79.0) = 24.6 eV, the highest of any element.'], '24.6 eV'], c: ['Why does helium have two separate families of excited states?', 'They are spin singlets and spin triplets; light barely connects them, because the dipole operator does not act on spin.'] }],
    ['The periodic table', [
      'Fill single-electron levels in order of energy, two electrons (spin up and down) per orbital: 1s, 2s, 2p, 3s, 3p, 4s, 3d … Closed shells at 2, 10, 18 and 36 electrons give the noble gases; one electron more gives an alkali metal. Screening raises states of high l, which is why 4s fills before 3d.'
    ], { n: 5, x: ['Write the ground-state configuration of potassium (19 electrons).', ['1s² 2s² 2p⁶ 3s² 3p⁶ takes 18 electrons, an argon core.', 'The 19th goes into 4s, not 3d.'], '[Ar] 4s¹'], c: ['Why is sodium chemically like lithium?', 'Each has a single electron outside a closed shell.'] }]
  ],
  m: [
    ['Applying the exclusion principle to bosons.', 'Bosons can share a state; only fermions are excluded.'],
    ['Antisymmetrising space alone for electrons.', 'It is space times spin that must be antisymmetric.'],
    ['Treating exchange effects as a new force.', 'They come from the symmetry of the state.']
  ]
});

WL.gd('y3-entanglement', {
  h: 'Measure one of a pair of entangled particles and you instantly know what its distant partner will show, yet no message can be sent that way. Einstein suspected the results were fixed in advance; Bell proved that idea makes a testable prediction, and experiments, finally free of loopholes in 2015, have ruled it out.',
  s: [
    ['Entangled states', [
      'The states of a pair live in a combined (tensor product) space with basis |i⟩|j⟩. A product state |a⟩|b⟩ gives each part a state of its own. Most states are not products: (|01⟩ − |10⟩)/√2 cannot be split up, so neither particle has a state of its own. That is **entanglement**.'
    ], { n: 0, e: '|\\Phi^\\pm\\rangle = \\frac{|00\\rangle \\pm |11\\rangle}{\\sqrt2},\\qquad |\\Psi^\\pm\\rangle = \\frac{|01\\rangle \\pm |10\\rangle}{\\sqrt2}', x: ['Is (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 entangled? Is (|00⟩ + |11⟩)/√2?', ['The first factorises: ((|0⟩ + |1⟩)/√2) ⊗ ((|0⟩ + |1⟩)/√2). Not entangled.', 'For the second, (a|0⟩ + b|1⟩)(c|0⟩ + d|1⟩) would need ac and bd non-zero but ad = bc = 0: impossible.', 'So it is entangled.'], 'the first is a product; the second is entangled'], c: ['For α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩, what quick test shows entanglement?', 'It is entangled exactly when αδ − βγ ≠ 0.'] }],
    ['EPR and hidden variables', [
      'In the singlet, measuring spin along any axis on A predicts the opposite result on B with certainty. Einstein, Podolsky and Rosen argued that B’s result must have been fixed in advance. Bell showed that this is testable: quantum mechanics predicts the correlation E(a, b) = −cos θ between results along directions at angle θ, which no theory of pre-set local values can match at every angle.'
    ], { n: 1, e: 'E(a,b) = -\\cos\\theta_{ab}', x: ['For the singlet measured along two directions 60° apart, what are the probabilities of the same and of opposite results?', ['E = −cos 60° = −0.5.', 'P(same) − P(opposite) = E and they add to 1, so P(same) = (1 + E)/2 = 0.25.', 'P(opposite) = 0.75.'], '25% same, 75% opposite'], c: ['At θ = 0, what does the singlet always give?', 'Opposite results.'] }],
    ['The CHSH inequality', [
      'Let each side choose between two settings (a, a′ and b, b′), recording ±1. If every result is fixed in advance, each run gives A(B − B′) + A′(B + B′) = ±2, since one bracket is 0 and the other ±2. Averaging gives |S| ≤ 2. Quantum mechanics reaches 2√2.'
    ], { n: 2, e: 'S = E(a,b) - E(a,b\') + E(a\',b) + E(a\',b\'),\\qquad |S|_{\\text{local}} \\le 2', x: ['With E = −cos θ, compute S for a = 0°, a′ = 90°, b = 45°, b′ = 135°.', ['E(a, b) = −cos 45° = −0.707; E(a, b′) = −cos 135° = +0.707.', 'E(a′, b) = −cos 45° = −0.707; E(a′, b′) = −cos 45° = −0.707.', 'S = −0.707 − 0.707 − 0.707 − 0.707 = −2.83, so |S| = 2√2 > 2.'], '|S| = 2.83'], c: ['Why is |S| ≤ 2 for any theory with pre-set local values?', 'In every single run the combination equals ±2, and an average cannot exceed that.'] }],
    ['The experiments', [
      'Aspect’s group (1982) switched settings while the photons were in flight. In 2015, groups in Delft, Vienna and Boulder closed the main loopholes together: the stations were far enough apart that no signal could link the choices, and detection was efficient enough that no assumption about missed particles was needed.'
    ], { n: 3, x: ['The Delft experiment found S = 2.42 ± 0.20 from 245 trials. How strong is that evidence on its own?', ['(2.42 − 2) ÷ 0.20 = 2.1 standard deviations above the local limit.', 'Its reported probability of a local model doing as well by chance was about 4%.', 'Strong but not overwhelming alone; together with the Vienna and Boulder results, which are far more significant, the conclusion is robust.'], 'about 2σ alone'], c: ['What were the locality and detection loopholes?', 'Locality: the settings or results might have been communicated between stations at light speed or below. Detection: if many particles are missed, the detected ones might be a biased sample.'] }],
    ['Density matrices', [
      'A system that is in |ψ_i⟩ with probability p_i is described by ρ = Σp_i|ψ_i⟩⟨ψ_i|, with ⟨A⟩ = Tr(ρA). It is pure exactly when Tr ρ² = 1. For a qubit, ρ = ½(1 + r·σ): pure states lie on the Bloch sphere, mixed states inside it. Ignoring one part of an entangled pair means tracing it out, ρ_A = Tr_B ρ.'
    ], { n: 4, e: '\\rho = \\sum_i p_i|\\psi_i\\rangle\\langle\\psi_i|,\\qquad \\langle A\\rangle = \\mathrm{Tr}(\\rho A)', x: ['What does one particle of a singlet look like on its own?', ['Tracing out B gives ρ_A = ½(|0⟩⟨0| + |1⟩⟨1|) = ½ × 1.', 'Tr ρ_A² = ½: completely mixed, with no preferred direction at all.', 'Its entropy is ln 2, though the pair as a whole is in a pure state.'], 'completely mixed: ρ_A = ½ × 1'], c: ['A qubit has ρ = ½(1 + 0.6σ_z). Is it pure, and what is the probability of measuring “up”?', 'Mixed (|r| = 0.6 < 1); P(up) = (1 + 0.6)/2 = 0.8.'] }],
    ['No signalling, and decoherence', [
      'Whatever A chooses to measure, B’s density matrix does not change, so entanglement cannot carry a message: the correlations appear only when the results are compared over an ordinary channel. When a system becomes entangled with its surroundings, its own density matrix loses its off-diagonal terms (**decoherence**), extremely quickly for large objects, which is why everyday objects never show interference between very different states.'
    ], { n: 5, c: ['Can Alice signal to Bob by choosing which way to measure her half of an entangled pair?', 'No: Bob’s results on their own look exactly the same whatever Alice does.'] }]
  ],
  m: [
    ['Thinking entanglement allows faster-than-light messages.', 'Each side’s own statistics never depend on the other’s choice.'],
    ['Treating a mixed state as a superposition.', 'A superposition is pure (on the Bloch sphere); a mixture lies inside.'],
    ['Calling every correlation entanglement.', 'Classical correlations never violate Bell inequalities.']
  ]
});

WL.gd('y3-fine-structure', {
  h: 'Look closely at hydrogen’s red Hα line and it turns out to be two lines; put the atom in a magnetic field and its lines split into more. These small effects, from relativity, from the electron’s spin coupling to its orbit, and from external fields, are each only about a ten-thousandth of the main energies, and the patterns they made are what forced physicists to accept spin.',
  s: [
    ['How big the corrections are', [
      'In hydrogen the electron moves at about αc, where α = e²/(4πε₀ħc) ≈ 1/137 is the **fine-structure constant**. Relativistic corrections are therefore of relative size α² ≈ 5 × 10⁻⁵, about 7 × 10⁻⁴ eV on top of 13.6 eV. Being small, they can be found with first-order perturbation theory, as long as degenerate levels are handled in the right basis.'
    ], { n: 0, c: ['Why can first-order perturbation theory handle fine structure?', 'The corrections are only about α² ≈ 5 × 10⁻⁵ of the level energies.'] }],
    ['The relativistic correction', [
      'Expanding the relativistic energy √(p²c² + m²c⁴) gives an extra term −p⁴/(8m³c²). Its first-order shift depends on n and l.'
    ], { n: 1, e: 'E^{(1)}_{\\text{rel}} = -\\frac{E_n^2}{2mc^2}\\left[\\frac{4n}{l+\\frac12} - 3\\right]', x: ['Find the relativistic shift of hydrogen’s ground state.', ['E₁ = −13.6 eV, mc² = 511 000 eV, n = 1, l = 0.', 'Bracket: 4/(½) − 3 = 5.', 'Shift = −(13.6² ÷ (2 × 511 000)) × 5 = −9.0 × 10⁻⁴ eV.'], 'about −0.9 meV'], c: ['Does the relativistic correction raise or lower the levels?', 'It lowers them.'] }],
    ['Spin–orbit coupling', [
      'In the electron’s own frame, the proton circles it and makes a magnetic field proportional to L, which acts on the electron’s spin magnetic moment. (A relativistic effect, Thomas precession, halves the simple estimate.) Since L·S = ½(J² − L² − S²), the states of definite total angular momentum j are the right ones to use.'
    ], { n: 2, e: '\\mathbf L\\cdot\\mathbf S = \\frac{\\hbar^2}{2}\\left[j(j+1) - l(l+1) - \\tfrac34\\right]', x: ['Find ⟨L·S⟩ for the two d levels (l = 2), and check that the weighted average is zero.', ['j = 5/2: (ħ²/2)(35/4 − 6 − 3/4) = ħ².', 'j = 3/2: (ħ²/2)(15/4 − 6 − 3/4) = −3ħ²/2.', 'Weighted by 2j + 1 states: 6 × 1 + 4 × (−1.5) = 0.'], '+ħ² and −1.5ħ²; average zero'], c: ['Why are states of definite j the right basis for spin–orbit coupling?', 'L·S = ½(J² − L² − S²), which is diagonal in states of definite j, l and s.'] }],
    ['The fine-structure formula', [
      'Adding both corrections (and one more for s states) gives energies that depend only on n and j. Each level with l > 0 splits into a pair, j = l ± ½, but states with the same j and different l, such as 2s₁/₂ and 2p₁/₂, stay together. Dirac’s relativistic equation gives the same result exactly.'
    ], { n: 3, e: 'E_{nj} = -\\frac{13.6\\ \\text{eV}}{n^2}\\left[1 + \\frac{\\alpha^2}{n^2}\\left(\\frac{n}{j+\\frac12} - \\frac34\\right)\\right]', x: ['Find the splitting between 2p₃/₂ and 2p₁/₂, in energy and frequency.', ['For n = 2: n/(j + ½) is 2 for j = ½ and 1 for j = 3/2.', 'ΔE = (13.6/4)(α²/4)(2 − 1) = 3.4 × 1.33 × 10⁻⁵ = 4.5 × 10⁻⁵ eV.', 'f = ΔE/h = 4.5 × 10⁻⁵ × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = 1.1 × 10¹⁰ Hz.'], '45 μeV; about 11 GHz'], c: ['Which n = 2 states stay together in this formula, and what later split them?', '2s₁/₂ and 2p₁/₂; the Lamb shift, a quantum electrodynamics effect of about 1 GHz.'] }],
    ['The Zeeman effect', [
      'In a weak magnetic field, each level splits into 2j + 1 sublevels spaced by g_Jμ_BB, where the **Landé g-factor** combines the orbital (g = 1) and spin (g ≈ 2) magnetism. In a strong field, L and S decouple and the shift becomes μ_BB(m_l + 2m_s).'
    ], { n: 4, e: '\\Delta E = g_J\\,\\mu_B B\\,m_j,\\qquad g_J = 1 + \\frac{j(j+1) + s(s+1) - l(l+1)}{2j(j+1)}', x: ['Find g_J for 2p₃/₂ and the spacing of its sublevels in a 1.0 T field.', ['l = 1, s = ½, j = 3/2: g_J = 1 + (15/4 + 3/4 − 2) ÷ (15/2) = 1 + 2.5/7.5 = 4/3.', 'Spacing = (4/3) × 5.79 × 10⁻⁵ eV = 7.7 × 10⁻⁵ eV.'], 'g_J = 4/3; 77 μeV'], c: ['What is g_J for a state with no orbital angular momentum, such as 2s₁/₂?', '2: the magnetism is all from spin.'] }],
    ['The Stark effect', [
      'An electric field E adds eEz to the energy. The ground state has a definite parity, so it has no first-order shift; it shifts only quadratically, by −½αE². The n = 2 level is different: the field mixes 2s and 2p₀, and the shift is linear, ±3ea₀E.'
    ], { n: 5, e: '\\Delta E_{n=2} = \\pm3ea_0E', x: ['In a field of 1.0 × 10⁷ V/m, compare the linear shift of n = 2 with the ground state’s quadratic shift (α = 4.5 × 4πε₀a₀³).', ['n = 2: 3ea₀E = 3 × 0.0529 × 10⁻⁹ m × 10⁷ V/m × e = 1.6 × 10⁻³ eV.', 'Ground state: α = 4.5 × 1.11 × 10⁻¹⁰ × (5.29 × 10⁻¹¹)³ = 7.4 × 10⁻⁴¹ C m²/V.', '½αE² = ½ × 7.4 × 10⁻⁴¹ × 10¹⁴ = 3.7 × 10⁻²⁷ J = 2.3 × 10⁻⁸ eV.'], '1.6 meV against 2 × 10⁻⁸ eV'], c: ['Why has hydrogen’s ground state no first-order Stark shift?', 'It has definite parity, so the average of z is zero.'] }]
  ],
  m: [
    ['Using m_l, m_s states when spin–orbit coupling dominates.', 'Use states of definite j.'],
    ['Forgetting Thomas precession.', 'It halves the simple spin–orbit estimate.'],
    ['Using g = 2 for orbital magnetism.', 'Orbital g is 1; spin g is about 2; g_J combines them.']
  ]
});
WL.gd('y3-variational-wkb', {
  h: 'Almost no real Hamiltonian can be solved exactly, so physics needs approximations whose errors you understand. The variational method guarantees an upper bound on the ground-state energy from any guess at all; the WKB method treats a wavefunction as a wave whose wavelength slowly follows the classical momentum, and gives energy levels and tunnelling rates.',
  s: [
    ['The variational principle', [
      'Expand any trial state in the (unknown) energy eigenstates: ⟨H⟩ = Σ|c_n|²E_n ≥ E₀Σ|c_n|² = E₀. So the average energy of any trial state is an upper bound on the true ground-state energy. Put adjustable parameters into the trial function and minimise ⟨H⟩: the lowest value is the best bound that family can give.'
    ], { n: 0, e: 'E_0 \\le \\frac{\\langle\\psi|\\hat H|\\psi\\rangle}{\\langle\\psi|\\psi\\rangle}', x: ['Use the trial function ψ = x(L − x) for a particle in a box of width L. How close is the bound?', ['⟨H⟩ = (ħ²/2m)∫ψ′² dx ÷ ∫ψ² dx, with ∫(L − 2x)² dx = L³/3 and ∫x²(L − x)² dx = L⁵/30.', '⟨H⟩ = (ħ²/2m)(L³/3)(30/L⁵) = 5ħ²/(mL²).', 'The exact value is π²ħ²/(2mL²) = 4.93ħ²/(mL²): the bound is only 1.3% high.'], '5ħ²/mL², 1.3% above the truth'], c: ['Can a variational estimate ever fall below the true ground-state energy?', 'No: every trial state gives an upper bound.'] }],
    ['How good can a guess be?', [
      'The quality depends on how well the trial family can imitate the true state. Because the energy is stationary at the true state, an error of size ε in the wavefunction gives an error only of order ε² in the energy.'
    ], { n: 1, x: ['For H = p²/2 + x⁴ (units with ħ = m = 1), try ψ = e^(−bx²), for which ⟨T⟩ = b/2 and ⟨x⁴⟩ = 3/(16b²). Find the best bound.', ['⟨H⟩ = b/2 + 3/(16b²).', 'd⟨H⟩/db = ½ − 3/(8b³) = 0 gives b³ = 3/4, b = 0.909.', '⟨H⟩ = 0.454 + 0.227 = 0.681, against the exact 0.668: 2% high.'], '0.681 (exact 0.668)'], c: ['Why is a variational energy usually more accurate than the wavefunction behind it?', 'The energy is stationary at the true state, so first-order errors in ψ give only second-order errors in E.'] }],
    ['Helium', [
      'Try a product of two hydrogen-like 1s orbitals with an adjustable charge Z. Each electron partly shields the nucleus from the other, so the best Z should be below 2. The calculation gives ⟨H⟩ = [2Z² − (27/4)Z] × 13.6 eV.'
    ], { n: 2, e: 'Z_{\\text{eff}} = \\tfrac{27}{16}', x: ['Minimise ⟨H⟩ = [2Z² − (27/4)Z] × 13.6 eV and compare with the measured −79.0 eV.', ['d/dZ: 4Z − 27/4 = 0, so Z = 27/16 = 1.69.', '⟨H⟩ = [2 × 1.69² − 6.75 × 1.69] × 13.6 = −5.70 × 13.6 = −77.5 eV.', 'That is 1.9% above the measured value, as an upper bound must be.'], '−77.5 eV with Z_eff = 1.69'], c: ['Why is the best Z_eff less than 2?', 'Each electron screens part of the nuclear charge from the other.'] }],
    ['The WKB approximation', [
      'If the potential changes little over one wavelength, the wavefunction is a wave whose local wavelength follows the classical momentum p(x) = √(2m(E − V)), with amplitude ∝ 1/√p, so |ψ|² is proportional to the time a classical particle spends near x. In a forbidden region it becomes a growing or decaying exponential.'
    ], { n: 3, e: '\\psi(x) \\approx \\frac{C}{\\sqrt{p(x)}}\\exp\\left(\\pm\\frac{i}{\\hbar}\\int^x p(x\')\\,dx\'\\right)', x: ['An electron with E = 10 eV moves where V rises by 1 eV per nanometre. Is WKB valid? (λ = 1.23 nm/√(E − V in eV))', ['λ = 1.23 ÷ √10 = 0.39 nm.', 'dλ/dx = (λ/2)(dV/dx)/(E − V) = 0.19 nm × (1 eV/nm) ÷ 10 eV = 0.019.', 'That is much less than 1, so yes.'], 'yes: |dλ/dx| ≈ 0.02'], c: ['Where does the WKB approximation fail?', 'At turning points, where p → 0 and the wavelength becomes infinite.'] }],
    ['Turning points and energy levels', [
      'Near a turning point the exact solution is an Airy function; matching it to the WKB forms on each side gives the connection formulas. Each smooth turning point contributes a phase of π/4, so a bound state between two smooth turning points obeys ∮p dx = (n + ½)h. Through a barrier, T ≈ e^(−2∫κ dx).'
    ], { n: 4, e: '\\oint p\\,dx = \\left(n + \\tfrac12\\right)h', x: ['Apply the WKB rule to the harmonic oscillator.', ['The orbit in phase space is an ellipse of area 2πE/ω, and ∮p dx is that area.', '2πE/ω = (n + ½)h gives E = (n + ½)ħω.', 'For the oscillator, WKB happens to be exact.'], 'E = (n + ½)ħω, exactly'], c: ['For a ball bouncing on a hard floor in gravity (one hard wall, one smooth turning point), what replaces n + ½?', 'n + ¾: the hard wall contributes π/2 of phase instead of π/4.'] }],
    ['Limits of both methods', [
      'A variational energy carries a guarantee; other quantities computed from the same trial function do not, and can be poor. WKB is an expansion in ħ that becomes more accurate for higher levels, but it is not a convergent series.'
    ], { n: 5, c: ['A trial function gives an energy within 1% of the truth. Is ⟨r⟩ then guaranteed to be within 1%?', 'No: only the energy has a bound; other averages can be much worse.'] }]
  ],
  m: [
    ['Forgetting to divide by ⟨ψ|ψ⟩.', 'Normalise, or use the ratio ⟨ψ|H|ψ⟩/⟨ψ|ψ⟩.'],
    ['Using the variational method for an excited state without orthogonality.', 'The trial state must be orthogonal to all lower states.'],
    ['Using WKB near a turning point.', 'Use the connection formulas there.']
  ]
});

WL.gd('y3-time-dependent', {
  h: 'Nearly everything we measure about atoms comes from transitions: light absorbed, light emitted, particles scattered. Time-dependent perturbation theory calculates how fast they happen when a weak, possibly oscillating, push acts on a system whose stationary states are known. Its central result, Fermi’s golden rule, is one of the most used formulas in physics.',
  s: [
    ['Setting up', [
      'Write H = H₀ + V(t) and expand the state in the eigenstates of H₀, keeping their natural phase factors: |ψ⟩ = Σc_n(t)e^(−iE_nt/ħ)|n⟩. The coefficients then change only because of V (the **interaction picture**), and they obey exact coupled equations.'
    ], { n: 0, e: 'i\\hbar\\,\\dot c_f = \\sum_n V_{fn}(t)\\,e^{i\\omega_{fn}t}\\,c_n,\\qquad \\omega_{fn} = \\frac{E_f-E_n}{\\hbar}', c: ['In this picture, why do the c_n change only because of V?', 'The phases from H₀ alone have been put into the factors e^(−iE_nt/ħ).'] }],
    ['The first-order amplitude', [
      'Start in state i and assume the coefficients barely change: put c_n = δ_ni on the right-hand side and integrate. The result is valid while the transition probability stays small.'
    ], { n: 1, e: 'c_f^{(1)}(t) = -\\frac{i}{\\hbar}\\int_0^t V_{fi}(t\')\\,e^{i\\omega_{fi}t\'}\\,dt\'', x: ['A perturbation V(t) = V e^(−t/τ) is switched on at t = 0 and dies away. Find the final transition probability, and compare slow and sudden switching.', ['c_f = −(i/ħ)V_fi ∫₀^∞ e^(−t/τ + iω_fi t) dt = −(i/ħ)V_fi ÷ (1/τ − iω_fi).', 'P = |V_fi|²τ² ÷ (ħ²(1 + ω_fi²τ²)).', 'Slow (ω_fiτ ≫ 1): P → |V_fi|²/(ħω_fi)², small. Sudden (ω_fiτ ≪ 1): P → |V_fi|²τ²/ħ².'], 'P = |V_fi|²τ²/ħ²(1 + ω²τ²)'], c: ['When does first-order theory stop being trustworthy?', 'When the transition probability is no longer small, say above about 0.1.'] }],
    ['Resonance', [
      'For an oscillating push V = F cos ωt, the amplitude is dominated by a term that is large when the drive frequency matches ω_fi. The probability is a sinc² curve in the detuning: its peak grows as t², its width shrinks as 1/t, and its area grows as t. A push lasting a time t cannot define a frequency better than about 1/t.'
    ], { n: 2, e: 'P_{i\\to f}(t) = \\frac{|F_{fi}|^2}{\\hbar^2}\\,\\frac{\\sin^2[(\\omega_{fi}-\\omega)t/2]}{(\\omega_{fi}-\\omega)^2}', x: ['A drive is applied for 1.0 ms. How sharply can it pick out a transition frequency?', ['The central peak extends to (ω_fi − ω)t/2 = π, so its half-width is Δω ≈ 2π/t.', 'In ordinary frequency, Δf ≈ 1/t = 1 kHz.'], 'to about 1 kHz'], c: ['As the drive lasts longer, what happens to the height and width of the resonance curve?', 'The height grows as t² and the width shrinks as 1/t.'] }],
    ['Fermi’s golden rule', [
      'If the final states form a continuum (photon modes, free electrons, vibrations of a solid), the sinc² peak sits on a smooth spread of states, and the total probability grows in proportion to t. That defines a constant rate: the squared matrix element times the density of final states at the right energy.'
    ], { n: 3, e: '\\Gamma_{i\\to f} = \\frac{2\\pi}{\\hbar}\\,|V_{fi}|^2\\,\\rho(E_f)', c: ['Why does the probability grow linearly in time once the final states form a continuum?', 'The peak’s height grows as t² while its width shrinks as 1/t; spread over a smooth density of states, the area, and so the probability, grows as t.'] }],
    ['Atoms and light', [
      'Visible light’s wavelength is thousands of times an atom’s size, so its field is uniform across the atom, and V = −d·E with d = −er (the **electric dipole approximation**). Spontaneous emission needs the quantised field (or Einstein’s argument), and its rate grows as ω³.'
    ], { n: 4, e: 'A = \\frac{\\omega^3\\,|\\langle f|\\mathbf d|i\\rangle|^2}{3\\pi\\varepsilon_0\\hbar c^3}', x: ['Hydrogen 2p → 1s has a dipole matrix element of 0.745ea₀ and photon energy 10.2 eV. Find its lifetime.', ['d = 1.60 × 10⁻¹⁹ × 0.745 × 5.29 × 10⁻¹¹ = 6.3 × 10⁻³⁰ C m; ω = 10.2 eV/ħ = 1.55 × 10¹⁶ s⁻¹.', 'A = (1.55 × 10¹⁶)³ × (6.3 × 10⁻³⁰)² ÷ (3π × 8.85 × 10⁻¹² × 1.055 × 10⁻³⁴ × (3.0 × 10⁸)³).', 'A = 6.2 × 10⁸ s⁻¹, so the lifetime is 1/A = 1.6 ns, as measured.'], 'about 1.6 ns'], c: ['Why do X-ray transitions happen far faster than visible ones with similar dipole moments?', 'The rate grows as ω³.'] }],
    ['Sudden and slow changes', [
      'If the Hamiltonian changes much faster than the system’s natural periods, the state has no time to change: the chance of ending in a new eigenstate is |⟨n_new|ψ_old⟩|² (the **sudden approximation**). If it changes slowly enough, a system that starts in an eigenstate stays in the matching one (the **adiabatic theorem**).'
    ], { n: 5, e: 'P = |\\langle n_{\\text{new}}|\\psi_{\\text{old}}\\rangle|^2', x: ['Tritium (Z = 1) beta-decays to helium-3 (Z = 2) almost instantly. What is the chance that its electron ends in the new 1s state?', ['The overlap of 1s orbitals of charges Z₁ and Z₂ is 8(Z₁Z₂)^(3/2)/(Z₁ + Z₂)³.', 'For Z₁ = 1, Z₂ = 2: 8 × 2^1.5 ÷ 27 = 0.838.', 'P = 0.838² = 0.70.'], 'about 70%'], c: ['What does the adiabatic theorem say?', 'If the Hamiltonian changes slowly enough, a system in an eigenstate stays in the corresponding instantaneous eigenstate.'] }]
  ],
  m: [
    ['Using first-order results when the probability is large.', 'They hold only while P ≪ 1.'],
    ['Leaving out the density of final states.', 'The golden rule needs ρ(E_f).'],
    ['Mixing ω and f in line widths.', 'Δω = 2πΔf.']
  ]
});

WL.gd('y3-scattering', {
  h: 'Rutherford found the atomic nucleus by counting alpha particles that bounced straight back from gold foil, and electron beams later showed that protons have a size and a structure. Almost everything we know about atoms, nuclei and particles comes from scattering. Quantum scattering theory turns the pattern of where particles go into a picture of the target.',
  s: [
    ['Cross-sections', [
      'A beam with flux Φ (particles per unit area per second) hits a target. The number scattered per second into a small solid angle dΩ is Φ(dσ/dΩ)dΩ. The **differential cross-section** dσ/dΩ has units of area per steradian; its integral, the total cross-section σ, is the effective area the target presents. Nuclear physicists use the **barn**, 10⁻²⁸ m².'
    ], { n: 0, e: '\\frac{dN}{dt} = \\Phi\\,\\frac{d\\sigma}{d\\Omega}\\,d\\Omega', x: ['A gold foil 1.0 μm thick (5.9 × 10²⁸ nuclei per m³) is hit by a beam. If each nucleus has σ = 100 b for some process, what fraction of the beam undergoes it?', ['The nuclei per square metre of foil: nt = 5.9 × 10²⁸ × 1.0 × 10⁻⁶ = 5.9 × 10²² m⁻².', 'Fraction = ntσ = 5.9 × 10²² × 100 × 10⁻²⁸ = 5.9 × 10⁻⁴.'], 'about 0.06%'], c: ['What is one barn in square metres?', '10⁻²⁸ m², roughly the cross-sectional area of a uranium nucleus.'] }],
    ['The scattering amplitude', [
      'Far from the target, the wavefunction is the incoming plane wave plus an outgoing spherical wave whose strength depends on direction, f(θ, φ). Comparing the outgoing and incoming fluxes gives dσ/dΩ = |f|².'
    ], { n: 1, e: '\\psi \\to e^{ikz} + f(\\theta,\\phi)\\,\\frac{e^{ikr}}{r},\\qquad \\frac{d\\sigma}{d\\Omega} = |f|^2', c: ['What are the units of the scattering amplitude f?', 'Length: |f|² must be an area per steradian.'] }],
    ['The Born approximation', [
      'If the potential is weak, the scattered wave is made by the incoming wave alone, and f is proportional to the Fourier transform of the potential at the **momentum transfer** ħq, where q = 2k sin(θ/2). Large q probes short distances: to see structure of size d you need q ≳ 1/d.'
    ], { n: 2, e: 'f_{\\text{Born}}(\\mathbf q) = -\\frac{m}{2\\pi\\hbar^2}\\int e^{-i\\mathbf q\\cdot\\mathbf r}\\,V(\\mathbf r)\\,d^3r,\\qquad q = 2k\\sin\\frac{\\theta}{2}', x: ['1.0 GeV electrons scatter through 30°. What momentum transfer do they reach, and what size can they resolve? (ħc = 197.3 MeV fm)', ['k = E/(ħc) = 1000 ÷ 197.3 = 5.07 fm⁻¹ (they are ultra-relativistic).', 'q = 2 × 5.07 × sin 15° = 2.6 fm⁻¹.', 'Resolution ~1/q ≈ 0.4 fm, smaller than a proton.'], 'q ≈ 2.6 fm⁻¹; about 0.4 fm'], c: ['To probe finer structure, should you look at larger or smaller scattering angles?', 'Larger angles (and higher energies): both increase q.'] }],
    ['Rutherford scattering', [
      'For a charge Z₁e of kinetic energy E scattering off a point charge Z₂e, the cross-section falls steeply with angle as 1/sin⁴(θ/2). Classical mechanics and quantum mechanics give the same formula.'
    ], { n: 3, e: '\\frac{d\\sigma}{d\\Omega} = \\left(\\frac{Z_1Z_2e^2}{16\\pi\\varepsilon_0E}\\right)^2\\frac{1}{\\sin^4(\\theta/2)}', x: ['5.0 MeV alpha particles hit gold (Z = 79). Find dσ/dΩ at 90° and at 180°. (e²/4πε₀ = 1.44 MeV fm)', ['Z₁Z₂e²/(16πε₀E) = 2 × 79 × 1.44 ÷ (4 × 5.0) = 11.4 fm.', 'At 90°: 11.4² ÷ sin⁴45° = 130 ÷ 0.25 = 520 fm² = 5.2 b per steradian.', 'At 180°: 130 fm² = 1.3 b per steradian.'], '5.2 b/sr at 90°; 1.3 b/sr at 180°'], c: ['The formula blows up at θ → 0. Why does the real cross-section not?', 'The atom’s electrons screen the nucleus for particles passing far away.'] }],
    ['Partial waves', [
      'For a central potential, expand in angular momentum. Far away, each partial wave l is just a free wave shifted in phase by δ_l, and the phase shifts contain everything. At low energy only the first few matter, because a particle with angular momentum lħ passes at a distance of about l/k.'
    ], { n: 4, e: '\\sigma = \\frac{4\\pi}{k^2}\\sum_l(2l+1)\\sin^2\\delta_l', x: ['At low energy (ka ≪ 1), a hard sphere of radius a gives δ₀ = −ka. Find σ and compare it with the sphere’s geometric cross-section.', ['Only l = 0 matters: σ = (4π/k²) sin²(ka) ≈ (4π/k²)(ka)².', 'σ = 4πa².', 'That is four times the geometric area πa²: slow waves diffract all round the sphere.'], '4πa², four times πa²'], c: ['At low energy, why do only the first few partial waves matter?', 'Partial wave l corresponds to passing at about l/k; for large l that is outside the range of the potential.'] }],
    ['The optical theorem', [
      'Conservation of probability links the total cross-section to the forward scattering amplitude: whatever is removed from the beam must appear as interference between the incoming wave and the forward-scattered wave, the target’s “shadow”.'
    ], { n: 5, e: '\\sigma_{\\text{tot}} = \\frac{4\\pi}{k}\\,\\mathrm{Im}\\,f(0)', c: ['Why must there always be some forward scattering whenever anything is removed from the beam?', 'Only a forward wave interfering destructively with the incoming beam can make the shadow that removes that flux.'] }]
  ],
  m: [
    ['Confusing dσ/dΩ with σ.', 'σ is the integral of dσ/dΩ over all directions.'],
    ['Using the Born approximation for strong potentials at low energy.', 'Use partial waves there.'],
    ['Forgetting screening at small angles.', 'Real atoms are neutral overall, so Rutherford’s 1/θ⁴ is cut off.']
  ]
});

WL.gd('y3-landau', {
  h: 'Cool a thin layer of electrons to near absolute zero, put it in a strong magnetic field, and its Hall resistance stops changing smoothly. It sits on flat steps at exactly h/νe², the same in every sample to better than a part in a billion, so precisely that it now defines the ohm. The explanation starts with an electron going round in a magnetic field.',
  s: [
    ['Cyclotron motion', [
      'A charge in a uniform field B moves in circles at the **cyclotron frequency** ω_c = eB/m, whatever its speed; faster charges make bigger circles. In a semiconductor the **effective mass** m* replaces m; in gallium arsenide m* = 0.067m_e.'
    ], { n: 0, e: '\\omega_c = \\frac{eB}{m},\\qquad r_c = \\frac{mv}{eB}', x: ['Find the cyclotron frequency and ħω_c for electrons in GaAs at 5.0 T.', ['ω_c = 1.60 × 10⁻¹⁹ × 5.0 ÷ (0.067 × 9.11 × 10⁻³¹) = 1.3 × 10¹³ rad/s, about 2.1 THz.', 'ħω_c = 1.055 × 10⁻³⁴ × 1.3 × 10¹³ = 1.4 × 10⁻²¹ J = 8.6 meV.'], '2.1 THz; 8.6 meV'], c: ['Does a faster electron go round faster?', 'No: the same frequency, in a bigger circle.'] }],
    ['Landau levels', [
      'With the vector potential A = (0, Bx, 0), the Hamiltonian does not depend on y, so p_y = ħk_y is conserved. What remains is a harmonic oscillator in x, centred at x₀ = −ħk_y/eB, with frequency ω_c. So the energies are evenly spaced **Landau levels**, and they do not depend on k_y at all.'
    ], { n: 1, e: 'E_n = \\hbar\\omega_c\\left(n+\\tfrac12\\right),\\qquad \\ell_B = \\sqrt{\\frac{\\hbar}{eB}} = \\frac{25.7\\ \\text{nm}}{\\sqrt{B/\\text{T}}}', x: ['At 5.0 T, how big is the magnetic length, and how does the GaAs level spacing compare with kT at 4 K?', ['ℓ_B = 25.7 ÷ √5.0 = 11.5 nm.', 'kT at 4 K = 8.62 × 10⁻⁵ × 4 = 0.34 meV.', 'ħω_c = 8.6 meV is 25 times larger: the levels are cleanly separated.'], '11.5 nm; spacing 25 times kT'], c: ['Why must quantum Hall experiments be done at very low temperature?', 'kT must be far smaller than ħω_c, or electrons are spread across several levels.'] }],
    ['One state per flux quantum', [
      'In a sample of area A, counting the allowed k_y values whose orbit centres lie inside the sample gives the number of states in each Landau level (per spin): exactly the number of **flux quanta** h/e passing through the sample. The **filling factor** ν = n_s h/(eB) says how many levels the electrons fill.'
    ], { n: 2, e: 'N_{\\text{states}} = \\frac{eBA}{h},\\qquad \\nu = \\frac{n_sh}{eB}', x: ['A 2D electron gas has n_s = 3.0 × 10¹⁵ m⁻². What is the filling factor at 6.2 T?', ['ν = 3.0 × 10¹⁵ × 6.63 × 10⁻³⁴ ÷ (1.60 × 10⁻¹⁹ × 6.2).', '= 1.99 × 10⁻¹⁸ ÷ 9.9 × 10⁻¹⁹ = 2.0: two levels exactly full.'], 'ν = 2'], c: ['If B doubles at the same electron density, what happens to ν?', 'It halves: each level holds twice as many states.'] }],
    ['The integer quantum Hall effect', [
      'Classically, the Hall resistance is R_xy = B/(n_s e), rising steadily with B. Von Klitzing (1980) found flat plateaux at exactly R_xy = h/(νe²) with whole-number ν, while the ordinary (longitudinal) resistance R_xx fell to zero.'
    ], { n: 3, e: 'R_{xy} = \\frac{h}{\\nu e^2} = \\frac{25\\,812.807\\ \\Omega}{\\nu}', x: ['For the sample above at 6.2 T, compare the classical Hall resistance with the ν = 2 plateau.', ['Classical: B/(n_s e) = 6.2 ÷ (3.0 × 10¹⁵ × 1.60 × 10⁻¹⁹) = 1.29 × 10⁴ Ω.', 'Plateau: 25 812.807 ÷ 2 = 12 906.4 Ω.', 'At exact filling they agree; the plateau holds that value over a range of fields.'], 'about 12.9 kΩ, flat over a range'], c: ['What is the longitudinal resistance R_xx on a plateau?', 'Zero: current flows without dissipation.'] }],
    ['Why the plateaux are exact', [
      'Disorder broadens each Landau level, and the states in its tails are trapped (localised) and carry no current, so nothing changes while the Fermi level crosses them: a plateau. The current is carried along the edges of the sample by states that cannot scatter backwards. Laughlin showed the value is universal: threading one extra flux quantum through the sample moves a whole number of electrons across it.'
    ], { n: 4, c: ['Why does a dirtier sample still give exactly the same plateau value?', 'The value is set by counting (whole numbers of edge channels, whole electrons per flux quantum), not by any material property; disorder actually helps make the plateaux wide.'] }],
    ['Fractions and graphene', [
      'In 1982 a plateau appeared at ν = 1/3, impossible for independent electrons. Laughlin explained it as a new correlated liquid whose excitations carry charge e/3. In graphene, electrons behave as massless Dirac particles, the levels are spaced as √n, and the plateaux fall at ν = ±2, ±6, ±10, …'
    ], { n: 5, x: ['What Hall resistance does the ν = 1/3 plateau show?', ['R_xy = h/(νe²) = 3 × 25 812.8 Ω.', '= 77 438 Ω.'], 'about 77.4 kΩ'], c: ['Why can independent electrons not explain a plateau at ν = 1/3?', 'A partly filled level of non-interacting electrons has no energy gap; the gap at 1/3 comes from interactions between electrons.'] }]
  ],
  m: [
    ['Using the free electron mass in a semiconductor.', 'Use the effective mass m*.'],
    ['Mixing up R_xy and R_xx.', 'R_xy is quantised; R_xx vanishes on a plateau.'],
    ['Forgetting spin when counting states.', 'eBA/h is per spin direction.']
  ]
});

WL.gd('y3-radiation', {
  h: 'Why is the sky blue, how does a radio antenna send a signal, and why would a classical atom collapse in a hundred-billionth of a second? A charge moving steadily carries its field along with it; an accelerating charge shakes its field, and the ripple runs outward at the speed of light, carrying energy away for good.',
  s: [
    ['Retarded potentials', [
      'A change in a source is felt elsewhere only after light has had time to travel. So the potentials are the familiar static formulas, evaluated at the **retarded time** t_r = t − |r − r′|/c.'
    ], { n: 0, e: 'V(\\mathbf r,t) = \\frac{1}{4\\pi\\varepsilon_0}\\int\\frac{\\rho(\\mathbf r\',t_r)}{|\\mathbf r-\\mathbf r\'|}\\,d^3r\'', c: ['If the Sun’s charge distribution suddenly changed, when would the Earth’s field change?', 'About 8.3 minutes later, the light-travel time.'] }],
    ['Two parts to the field', [
      'The field of a moving point charge has two parts: a **velocity field**, Coulomb’s field adjusted for motion, falling as 1/R², and an **acceleration field**, at right angles to the line of sight, falling only as 1/R. Only the second radiates.'
    ], { n: 1, e: '\\mathbf E_{\\text{rad}} = \\frac{q}{4\\pi\\varepsilon_0 c^2R}\\,\\hat{\\mathbf R}\\times(\\hat{\\mathbf R}\\times\\mathbf a)\\qquad (v\\ll c)', c: ['Why does only the 1/R field carry energy to infinity?', 'Energy flux goes as E², so 1/R²; over a sphere of area 4πR² that stays constant. The 1/R² field gives a flux falling as 1/R⁴, which vanishes far away.'] }],
    ['Larmor’s formula', [
      'The radiated energy flux is proportional to sin²θ, where θ is measured from the acceleration: nothing goes straight along it, most goes sideways. Integrating over a sphere gives the total power, the same at every radius, so the energy really leaves.'
    ], { n: 2, e: 'P = \\frac{q^2a^2}{6\\pi\\varepsilon_0c^3},\\qquad \\frac{dP}{d\\Omega} \\propto \\sin^2\\theta', x: ['How much power does an electron radiate while accelerating at 1.0 × 10¹⁸ m/s²?', ['P = (1.60 × 10⁻¹⁹)² × (10¹⁸)² ÷ (6π × 8.85 × 10⁻¹² × (3.0 × 10⁸)³).', '= 2.6 × 10⁻² ÷ 4.5 × 10¹⁵ = 5.7 × 10⁻¹⁸ W.'], 'about 6 × 10⁻¹⁸ W'], c: ['In which direction does a slowly moving accelerated charge radiate most, and in which not at all?', 'Most at right angles to the acceleration; none along it.'] }],
    ['Dipole radiation and the blue sky', [
      'An oscillating dipole p₀ cos ωt has acceleration proportional to ω², so it radiates a power proportional to ω⁴. Molecules driven by sunlight scatter short wavelengths far more strongly, which makes the sky blue. Magnetic-dipole and quadrupole radiation are weaker by about (size/wavelength)², which is why transitions that need them are called “forbidden”.'
    ], { n: 3, e: '\\langle P\\rangle = \\frac{p_0^2\\omega^4}{12\\pi\\varepsilon_0c^3}', x: ['How much more strongly is 450 nm blue light scattered by air molecules than 700 nm red?', ['Power ∝ ω⁴ ∝ 1/λ⁴.', 'Ratio = (700 ÷ 450)⁴ = 1.56⁴ = 5.9.'], 'about 6 times'], c: ['Roughly how much weaker is a “forbidden” atomic transition than an allowed one?', 'By about (atom size/wavelength)² ≈ (0.1 nm ÷ 500 nm)², about 10⁻⁷ or less.'] }],
    ['Relativistic charges and synchrotron light', [
      'At relativistic speeds the power grows by powers of γ; for circular motion by γ⁴, beamed forward into a cone about 1/γ wide. This **synchrotron radiation** drains energy from electron accelerators, a loss per turn growing as E⁴/ρ, and is a brilliant source of X-rays for science.'
    ], { n: 4, e: 'U_0 \\approx 88.5\\ \\text{keV}\\,\\frac{(E/\\text{GeV})^4}{\\rho/\\text{m}}', x: ['The LEP collider ran 100 GeV electrons round a bending radius of about 3100 m. How much energy did each lose per turn?', ['U₀ = 88.5 keV × 100⁴ ÷ 3100.', '= 88.5 keV × 3.2 × 10⁴ = 2.9 × 10⁶ keV.'], 'about 2.9 GeV per turn'], c: ['Why do proton colliders lose far less to synchrotron radiation than electron colliders of the same energy?', 'At the same energy a proton’s γ is 1836 times smaller, and the loss goes as γ⁴: about 10¹³ times less.'] }],
    ['Radiation and the stability of atoms', [
      'Applied to Rutherford’s planetary atom, Larmor’s formula is fatal: the orbiting electron radiates and spirals into the nucleus. Stable atoms with sharp spectral lines flatly contradicted classical electrodynamics, and quantum mechanics replaced orbits with stationary states that do not radiate.'
    ], { n: 5, x: ['How much power would a classical electron radiate in the first Bohr orbit (v = 2.19 × 10⁶ m/s, r = 5.29 × 10⁻¹¹ m)?', ['a = v²/r = (2.19 × 10⁶)² ÷ 5.29 × 10⁻¹¹ = 9.1 × 10²² m/s².', 'P = (1.60 × 10⁻¹⁹)² × (9.1 × 10²²)² ÷ 4.5 × 10¹⁵ = 4.7 × 10⁻⁸ W.', 'That is 2.9 × 10¹¹ eV per second, against a binding energy of only 13.6 eV.'], 'about 5 × 10⁻⁸ W'], c: ['Roughly how long would a classical hydrogen atom survive?', 'About 10⁻¹¹ s before the electron spiralled in.'] }]
  ],
  m: [
    ['Thinking a charge moving at steady velocity radiates.', 'Only acceleration radiates.'],
    ['Using Larmor’s formula at relativistic speeds.', 'Use Liénard’s version, with its powers of γ.'],
    ['Expecting radiation along the acceleration.', 'The pattern goes as sin²θ: none along a.']
  ]
});
WL.gd('y3-lasers', {
  h: 'A laser pointer’s spot stays small across a lecture hall, and its light can interfere with itself over metres. Ordinary light is a jumble of independent flashes from separate atoms; laser light is made by stimulated emission, in which one photon triggers an identical twin. Einstein worked out the rules in 1917, forty years before the first laser.',
  s: [
    ['Three processes', [
      'Between two levels with E₂ − E₁ = hν, three processes compete. **Absorption**: a photon lifts an atom up, at a rate B₁₂ρ (ρ is the radiation energy density). **Stimulated emission**: a photon triggers an excited atom to emit an identical photon, at a rate B₂₁ρ. **Spontaneous emission**: an excited atom emits on its own, at a rate A₂₁, in a random direction.'
    ], { n: 0, c: ['How does a photon from stimulated emission differ from the one that triggered it?', 'It does not: same frequency, direction, phase and polarisation.'] }],
    ['Einstein’s relations', [
      'In thermal equilibrium the populations follow Boltzmann and the radiation follows Planck. Demanding that the upward and downward rates balance at every temperature fixes two relations. They are properties of the atom, so they hold out of equilibrium too. In equilibrium, spontaneous emission beats stimulated by a factor e^(hν/kT) − 1.'
    ], { n: 1, e: 'g_1B_{12} = g_2B_{21},\\qquad \\frac{A_{21}}{B_{21}} = \\frac{8\\pi h\\nu^3}{c^3}', x: ['At the Sun’s surface (5800 K), how much faster is spontaneous emission than stimulated emission for 500 nm light?', ['hν = 1240 ÷ 500 = 2.48 eV; kT = 8.62 × 10⁻⁵ × 5800 = 0.50 eV.', 'Ratio = e^(hν/kT) − 1 = e^4.96 − 1 = 142.'], 'about 140 times'], c: ['Why are X-ray lasers so hard to build?', 'A/B grows as ν³, so at high frequency spontaneous emission drains the excited atoms far faster than stimulated emission can use them.'] }],
    ['Population inversion', [
      'Light passing through a medium grows only if stimulated emission beats absorption, which needs N₂/g₂ > N₁/g₁: more atoms up than down, a **population inversion**. That never happens in thermal equilibrium. Pumping a two-level system with light cannot achieve it either, so lasers use three or four levels.'
    ], { n: 2, c: ['Why can shining light on a two-level system never invert it?', 'The light drives absorption and stimulated emission at equal rates per atom, so at best the populations become equal.'] }],
    ['Gain, mirrors and threshold', [
      'An inverted medium amplifies light as e^(γz). Between two mirrors the light passes many times. The laser switches on when the gain over a round trip matches all losses, including the light let out through the partly transparent mirror. The cavity only supports frequencies spaced by c/(2L).'
    ], { n: 3, e: '\\gamma_{\\text{th}} = -\\frac{\\ln(R_1R_2)}{2L},\\qquad \\Delta\\nu_{\\text{modes}} = \\frac{c}{2L}', x: ['A helium–neon laser has a 0.30 m cavity with mirrors of reflectivity 0.999 and 0.99. Find the threshold gain and the spacing of its frequencies.', ['R₁R₂ = 0.989, and ln 0.989 = −0.0111.', 'γ_th = 0.0111 ÷ 0.60 = 0.018 per metre.', 'Mode spacing = 3.0 × 10⁸ ÷ 0.60 = 500 MHz; with a gain bandwidth of about 1.5 GHz, roughly three modes run at once.'], 'about 1.8% per metre; 500 MHz'], c: ['Why do low-gain lasers such as helium–neon need extremely good mirrors?', 'The threshold gain is set by −ln(R₁R₂); a weak gain can only beat very small losses.'] }],
    ['Coherence', [
      '**Temporal coherence** is how long a wave stays in step with itself: about 1/Δν, giving a **coherence length** ℓ_c ≈ c/Δν ≈ λ²/Δλ. Interference needs path differences shorter than ℓ_c. **Spatial coherence** is how far across a beam the phase stays correlated. Lasers excel at both.'
    ], { n: 4, e: '\\ell_c = \\frac{c}{\\Delta\\nu} \\approx \\frac{\\lambda^2}{\\Delta\\lambda}', x: ['Compare the coherence length of a single-frequency laser (Δν = 1 MHz), a multi-mode helium–neon laser (Δν = 1.5 GHz) and sunlight (550 nm, Δλ ≈ 300 nm).', ['Single frequency: 3.0 × 10⁸ ÷ 10⁶ = 300 m.', 'Multi-mode: 3.0 × 10⁸ ÷ 1.5 × 10⁹ = 0.2 m.', 'Sunlight: 550² ÷ 300 nm = 1000 nm, about a micrometre.'], '300 m, 0.2 m and 1 μm'], c: ['Why does a soap film show colours in sunlight only when it is thin?', 'The path difference between its two reflections must be shorter than sunlight’s coherence length, about a micrometre.'] }],
    ['How the photons arrive', [
      'Light sources differ in their photon statistics. Thermal light fluctuates strongly, ⟨Δn²⟩ = n̄ + n̄², and its photons tend to bunch. An ideal laser is Poissonian, ⟨Δn²⟩ = n̄. A single-photon source never gives two at once. The correlation g⁽²⁾(0) is 2, 1 and 0 for these three.'
    ], { n: 5, e: 'g^{(2)}(0) = 2\\ (\\text{thermal}),\\quad 1\\ (\\text{laser}),\\quad 0\\ (\\text{single photon})', x: ['A detector counts on average 100 photons per time window. Compare the spread for an ideal laser and for single-mode thermal light.', ['Laser (Poisson): Δn = √100 = 10.', 'Thermal: Δn = √(100 + 100²) = 100.5: fluctuations as large as the mean.'], '10 against about 100'], c: ['What value of g⁽²⁾(0) proves that a source emits single photons?', 'A value below 1, ideally 0: no classical light can go below 1.'] }]
  ],
  m: [
    ['Thinking a two-level system can lase.', 'Inversion needs three or four levels.'],
    ['Confusing spontaneous and stimulated emission.', 'Only stimulated emission copies the incoming photon.'],
    ['Thinking laser light is special only because it is bright.', 'Its coherence and statistics are what matter.']
  ]
});

WL.gd('y3-quantum-gases', {
  h: 'The electrons in a lump of copper at room temperature behave as if they were at about eighty thousand kelvin, and a cloud of rubidium atoms cooled to a millionth of a kelvin suddenly merges into a single quantum wave. When particles crowd so closely that their wavelengths overlap, whether they are fermions or bosons decides everything.',
  s: [
    ['Occupation numbers', [
      'Treat one single-particle state of energy ε as a system that can swap particles with the rest. A fermion state holds 0 or 1 particle; a boson state any number. The average occupations are the **Fermi–Dirac** and **Bose–Einstein** distributions. Both reduce to Boltzmann’s when occupations are small.'
    ], { n: 0, e: '\\bar n_{\\text{FD}} = \\frac{1}{e^{(\\varepsilon-\\mu)/kT}+1},\\qquad \\bar n_{\\text{BE}} = \\frac{1}{e^{(\\varepsilon-\\mu)/kT}-1}', x: ['Compare the three distributions for a state with ε − μ = kT.', ['Fermi–Dirac: 1/(e + 1) = 0.27.', 'Bose–Einstein: 1/(e − 1) = 0.58.', 'Boltzmann: e⁻¹ = 0.37, in between.'], '0.27, 0.58 and 0.37'], c: ['When do both quantum distributions reduce to Boltzmann’s?', 'When ε − μ ≫ kT, so every occupation is small: a hot or thin gas.'] }],
    ['The Fermi gas at absolute zero', [
      'N spin-½ fermions in a box fill every momentum state inside a sphere of radius k_F = (3π²n)^(1/3). The energy of the top state is the **Fermi energy**. Even at absolute zero the gas has kinetic energy, (3/5)E_F per particle, and so a **degeneracy pressure**.'
    ], { n: 1, e: 'E_F = \\frac{\\hbar^2}{2m}(3\\pi^2n)^{2/3}', x: ['Copper has 8.5 × 10²⁸ free electrons per m³. Find its Fermi energy and Fermi temperature.', ['3π²n = 2.52 × 10³⁰ m⁻³, and its 2/3 power is 1.85 × 10²⁰ m⁻².', 'E_F = (1.055 × 10⁻³⁴)² ÷ (2 × 9.11 × 10⁻³¹) × 1.85 × 10²⁰ = 1.13 × 10⁻¹⁸ J = 7.1 eV.', 'T_F = E_F/k = 7.1 ÷ 8.62 × 10⁻⁵ = 82 000 K.'], '7.1 eV; 82 000 K'], c: ['Why does a Fermi gas push outwards even at absolute zero?', 'The exclusion principle forces most particles into high-momentum states, and that motion makes pressure.'] }],
    ['A cold Fermi gas', [
      'At T ≪ T_F only the electrons within about kT of the Fermi level can be excited; the rest have no empty states nearby to move into. So the electrons’ heat capacity is tiny and grows in proportion to T. That solved an old puzzle: classical theory predicted a large electronic heat capacity that experiments never found.'
    ], { n: 2, e: 'C_{\\text{el}} = \\frac{\\pi^2}{2}Nk\\,\\frac{T}{T_F}', x: ['Estimate the electrons’ molar heat capacity in copper at 300 K, and compare with the lattice’s 24.5 J mol⁻¹ K⁻¹.', ['C_el = (π²/2) × R × (300 ÷ 82 000) = 4.93 × 8.31 × 0.0037.', '= 0.15 J mol⁻¹ K⁻¹, about 0.6% of the lattice value.'], '0.15 J mol⁻¹ K⁻¹'], c: ['Why can only electrons near the Fermi level absorb heat?', 'Deeper electrons would need to move into states that are already full.'] }],
    ['Degenerate stars', [
      'In a white dwarf, electron degeneracy pressure holds up about a solar mass in a ball the size of the Earth. Balancing it against gravity gives R ∝ M^(−1/3): heavier white dwarfs are smaller. When the electrons become relativistic, the balance fails above about 1.4 solar masses (Chandrasekhar’s limit).'
    ], { n: 3, x: ['A 1.0 solar-mass white dwarf has a radius of 5800 km. Estimate its electrons’ Fermi energy (about two nucleons per electron).', ['Mean density = 2.0 × 10³⁰ ÷ (4/3 π (5.8 × 10⁶)³) = 2.4 × 10⁹ kg/m³.', 'n_e = ρ/(2m_p) = 7.2 × 10³⁵ m⁻³.', 'E_F = (ħ²/2m)(3π²n_e)^(2/3) = 4.7 × 10⁻¹⁴ J = 0.29 MeV: comparable to m_ec² = 0.51 MeV, so the electrons are becoming relativistic.'], 'about 0.3 MeV'], c: ['Why is a heavier white dwarf smaller?', 'More gravity squeezes it until the denser electrons push back hard enough: R ∝ M^(−1/3).'] }],
    ['Bose–Einstein condensation', [
      'For bosons μ cannot rise above the lowest energy. As the gas is cooled at fixed density, μ reaches that limit and the excited states can no longer hold all the particles. Below a critical temperature the rest pile into the lowest state: a **Bose–Einstein condensate**. In 3D this happens when nλ_th³ = 2.612.'
    ], { n: 4, e: 'T_c = \\frac{2\\pi\\hbar^2}{mk}\\left(\\frac{n}{2.612}\\right)^{2/3},\\qquad \\frac{N_0}{N} = 1 - \\left(\\frac{T}{T_c}\\right)^{3/2}', x: ['Find T_c for rubidium-87 atoms at 1.0 × 10²⁰ m⁻³, and the condensed fraction at half that temperature.', ['m = 87 × 1.66 × 10⁻²⁷ = 1.44 × 10⁻²⁵ kg, so 2πħ²/(mk) = 3.5 × 10⁻²⁰ K m².', '(n/2.612)^(2/3) = (3.8 × 10¹⁹)^(2/3) = 1.1 × 10¹³ m⁻², so T_c = 4.0 × 10⁻⁷ K.', 'At T = T_c/2: N₀/N = 1 − 0.5^1.5 = 0.65.'], 'about 0.4 μK; 65% condensed at half of it'], c: ['For bosons, why can μ not rise above the lowest energy level?', 'The occupation 1/(e^((ε−μ)/kT) − 1) of that level would become negative.'] }],
    ['Photons, phonons and liquid helium', [
      'Particles whose number is not conserved, photons and phonons, have μ = 0; they give Planck’s law and Debye’s heat capacity. Liquid helium-4 becomes a superfluid at 2.17 K, close to the 3.1 K that an ideal Bose gas of its density would condense at, suggesting the two are related.'
    ], { n: 5, c: ['Helium-4 becomes superfluid at 2.17 K, but helium-3 only below about 2.5 mK. Why the huge difference?', 'Helium-3 atoms are fermions; they must first pair up, like electrons in a superconductor, which happens only at millikelvin temperatures.'] }]
  ],
  m: [
    ['Using the wrong distribution.', 'Fermions (half-integer spin) use Fermi–Dirac; bosons use Bose–Einstein.'],
    ['Forgetting the spin factor of 2 in the Fermi energy.', 'The (3π²n) formula already includes two spin states.'],
    ['Thinking condensation needs attraction.', 'It is a purely statistical effect; it happens even in an ideal gas.']
  ]
});

WL.gd('y3-solids', {
  h: 'Why is copper a superb conductor, diamond a perfect insulator, and silicon somewhere in between? Atoms in a crystal sit on a repeating lattice, and that one fact explains why X-rays bounce off crystals into sharp spots, why vibrations come in packets called phonons, and why electrons can only have energies in bands separated by gaps.',
  s: [
    ['Lattices', [
      'A crystal is a lattice of points R = n₁a₁ + n₂a₂ + n₃a₃ with a group of atoms (the basis) at each. Common metal structures are body-centred cubic (iron, sodium) and face-centred cubic (copper, aluminium); face-centred cubic packs spheres most densely, filling 74% of space.'
    ], { n: 0, x: ['Copper is face-centred cubic with a cube edge of 0.3615 nm and 4 atoms per cubic cell. Find its atom density and mass density (63.55 u per atom).', ['n = 4 ÷ (0.3615 × 10⁻⁹)³ = 8.47 × 10²⁸ m⁻³.', 'ρ = 8.47 × 10²⁸ × 63.55 × 1.66 × 10⁻²⁷ = 8.9 × 10³ kg/m³, matching copper’s 8.96 × 10³.'], '8.5 × 10²⁸ atoms per m³; 8.9 g/cm³'], c: ['How many atoms belong to one cubic cell of a body-centred cubic lattice?', 'Two: 8 corners shared eight ways, plus one at the centre.'] }],
    ['Diffraction', [
      'The **reciprocal lattice** vectors G satisfy e^(iG·R) = 1 for every lattice vector. A wave scatters strongly when its change in wavevector equals one of them (the Laue condition), which is the same as **Bragg’s law** for a family of lattice planes of spacing d.'
    ], { n: 1, e: '2d\\sin\\theta = n\\lambda', x: ['Copper Kα X-rays (0.154 nm) reflect from the (200) planes of rock salt (d = 0.282 nm). At what angle is the first-order peak?', ['sin θ = λ/(2d) = 0.154 ÷ 0.564 = 0.273.', 'θ = 15.8°.'], '15.8°'], c: ['Why can visible light not reveal crystal structure by diffraction?', 'Its wavelength is far larger than 2d, so sin θ = λ/2d would exceed 1.'] }],
    ['Phonons', [
      'Atoms joined by springs carry waves whose frequency depends on wavevector: linear at long wavelength (sound) and flattening at the edge of the **Brillouin zone**, k = π/a. Quantised, each mode of frequency ω carries **phonons** of energy ħω.'
    ], { n: 2, e: '\\omega(k) = 2\\sqrt{\\frac{K}{m}}\\left|\\sin\\frac{ka}{2}\\right|,\\qquad v_{\\text{sound}} = a\\sqrt{\\frac{K}{m}}', x: ['A chain of atoms of mass 4.65 × 10⁻²⁶ kg, spacing 0.25 nm and spring constant 20 N/m. Find its speed of sound and highest phonon energy.', ['√(K/m) = √(20 ÷ 4.65 × 10⁻²⁶) = 2.07 × 10¹³ s⁻¹.', 'v = a√(K/m) = 0.25 × 10⁻⁹ × 2.07 × 10¹³ = 5.2 × 10³ m/s.', 'ω_max = 2√(K/m) = 4.1 × 10¹³ s⁻¹, so ħω_max = 4.4 × 10⁻²¹ J = 27 meV.'], '5.2 km/s; 27 meV'], c: ['Why do the wavevectors k and k + 2π/a describe the same vibration?', 'Atoms sit only at x = na, and e^(i(k + 2π/a)na) = e^(ikna) there.'] }],
    ['Heat capacity', [
      'Einstein gave every atom one frequency, which makes the heat capacity fall exponentially at low temperature. Debye used the real spread of sound-wave frequencies, so long-wavelength modes stay active, and found the T³ law that experiments show. At high temperature both give 3Nk.'
    ], { n: 3, e: 'C = \\frac{12\\pi^4}{5}Nk\\left(\\frac{T}{\\theta_D}\\right)^3\\quad (T\\ll\\theta_D)', x: ['For copper (θ_D = 343 K, T_F = 82 000 K), compare the lattice and electron heat capacities at 10 K, and find where they are equal.', ['Lattice: 1944 × (10/343)³ = 0.048 J mol⁻¹ K⁻¹.', 'Electrons: (π²/2)R(10/82 000) = 0.0050 J mol⁻¹ K⁻¹.', 'Equal when 1944(T/343)³ = 5.0 × 10⁻⁴ T, at T ≈ 3 K: below that the electrons dominate.'], 'lattice ten times larger at 10 K; equal near 3 K'], c: ['Why does Einstein’s model fail at low temperature?', 'With one frequency, all modes freeze out together; real solids keep low-frequency sound modes active, giving T³.'] }],
    ['Bloch’s theorem and bands', [
      'In a periodic potential, energy states can be written as a plane wave times a function with the lattice’s period. ħk is the **crystal momentum**, conserved up to multiples of ħG. For each k there is a ladder of energies E_n(k), which form **bands**. A crystal of N cells has N distinct k values per band.'
    ], { n: 4, e: '\\psi_{n\\mathbf k}(\\mathbf r) = e^{i\\mathbf k\\cdot\\mathbf r}u_{n\\mathbf k}(\\mathbf r)', x: ['A 1D crystal has 1000 cells of 0.30 nm. How many k values does each band have, and how far apart are they?', ['With periodic boundaries, k = 2πm/(Na) for m = 0 … N − 1: 1000 values.', 'Spacing = 2π ÷ (1000 × 0.30 nm) = 0.021 nm⁻¹.'], '1000 values, 0.021 nm⁻¹ apart'], c: ['Is ħk the electron’s ordinary momentum?', 'No: the Bloch state is not a momentum eigenstate, and ħk is conserved only up to multiples of ħG.'] }],
    ['Metals, insulators and semiconductors', [
      'Each band holds 2N electrons (two spins per k). If the electrons exactly fill some bands with a gap above, the solid is an **insulator** (diamond, gap 5.5 eV) or, if the gap is small, a **semiconductor** (silicon, 1.1 eV). A partly filled band makes a **metal**.'
    ], { n: 5, x: ['Compare the factor e^(−E_g/2kT), which controls thermally excited carriers, for silicon and diamond at 300 K.', ['kT = 0.0259 eV.', 'Silicon: e^(−1.12/0.0517) = e^(−21.7) ≈ 4 × 10⁻¹⁰.', 'Diamond: e^(−5.5/0.0517) = e^(−106) ≈ 10⁻⁴⁶: about 10³⁷ times fewer carriers.'], 'about 10³⁷ times fewer in diamond'], c: ['Magnesium has two electrons per cell, enough to fill a band. Why is it a metal?', 'Its bands overlap in energy, so neither is completely full.'] }]
  ],
  m: [
    ['Confusing crystal momentum with true momentum.', 'ħk is conserved only up to ħG.'],
    ['Forgetting the factor 2 for spin when filling bands.', 'Each band holds 2N electrons.'],
    ['Using Einstein’s model at low temperature.', 'Debye’s T³ law is what experiments show.']
  ]
});

WL.gd('y3-semiconductors', {
  h: 'A modern phone chip holds over ten billion transistors, and every one relies on two ideas: adding a few impurity atoms per million transforms how a semiconductor conducts, and joining two differently doped pieces makes a junction that lets current flow only one way. Diodes, LEDs, solar cells and transistors all follow.',
  s: [
    ['Intrinsic semiconductors', [
      'In a pure semiconductor at absolute zero the valence band is full and the conduction band empty. At room temperature a few electrons cross the gap (silicon 1.12 eV), each leaving a **hole**, a missing electron that behaves like a positive carrier. Their density depends very steeply on the gap and the temperature.'
    ], { n: 0, e: 'n_i = \\sqrt{N_cN_v}\\,e^{-E_g/2kT},\\qquad n_i(\\text{Si, 300 K}) \\approx 1\\times10^{16}\\ \\text{m}^{-3}', x: ['By about how much does silicon’s intrinsic carrier density rise from 300 K to 350 K? (Ignore the slow change of the prefactor.)', ['Ratio = exp[(E_g/2k)(1/300 − 1/350)].', 'E_g/2k = 1.12 ÷ (2 × 8.62 × 10⁻⁵) = 6500 K, and 1/300 − 1/350 = 4.8 × 10⁻⁴ K⁻¹.', 'Ratio = e^3.1 ≈ 22 (about 28 with the T^(3/2) prefactor).'], 'about 20 to 30 times'], c: ['Why does germanium have far more intrinsic carriers than silicon at room temperature?', 'Its gap is smaller (0.66 eV against 1.12 eV), and the density depends exponentially on the gap.'] }],
    ['Doping', [
      'Replace a silicon atom with phosphorus: its fifth electron is loosely held and almost always free at room temperature (an n-type **donor**). Boron, with one electron fewer, creates a hole (a p-type **acceptor**). In equilibrium np = n_i², so adding electrons removes holes.'
    ], { n: 1, e: 'np = n_i^2,\\qquad \\sigma = e(n\\mu_n + p\\mu_p)', x: ['Silicon is doped with 1.0 × 10²² phosphorus atoms per m³ (about 1 per 5 million silicon atoms). Find n, p, and the conductivity compared with pure silicon. (μ_n = 0.14, μ_p = 0.045 m² V⁻¹ s⁻¹)', ['n ≈ 1.0 × 10²² m⁻³ and p = n_i²/n = 10³² ÷ 10²² = 10¹⁰ m⁻³.', 'σ = 1.6 × 10⁻¹⁹ × 10²² × 0.14 = 220 S/m.', 'Pure: σ = 1.6 × 10⁻¹⁹ × 10¹⁶ × 0.185 = 3.0 × 10⁻⁴ S/m: doping raised it about a million times.'], 'about 10⁶ times more conductive'], c: ['Doping adds electrons. Why does the hole density fall?', 'np = n_i²: with more electrons around, holes are filled (recombine) faster.'] }],
    ['The Fermi level and moving carriers', [
      'The Fermi level sits near mid-gap in pure material, moves up towards the conduction band with donors and down with acceptors. Carriers **drift** in an electric field (mobility μ) and **diffuse** from high to low concentration (diffusion constant D); Einstein’s relation links the two. The sign of the Hall voltage shows whether electrons or holes carry the current.'
    ], { n: 2, e: 'D = \\frac{\\mu kT}{e}', x: ['Find the diffusion constant of electrons in silicon at 300 K (μ_n = 0.14 m² V⁻¹ s⁻¹).', ['kT/e = 0.0259 V.', 'D = 0.14 × 0.0259 = 3.6 × 10⁻³ m²/s (36 cm²/s).'], '36 cm²/s'], c: ['How does the Hall effect show whether electrons or holes carry the current?', 'The two are pushed to the same side, but have opposite charges, so the Hall voltage has opposite signs.'] }],
    ['The p–n junction', [
      'Where p-type meets n-type, electrons diffuse into the p side and holes into the n side, leaving a **depletion region** of fixed charged dopants. Its field builds a voltage that stops further net diffusion. Forward bias lowers this barrier and the current rises exponentially; reverse bias raises it and only a tiny current flows.'
    ], { n: 3, e: 'V_{\\text{bi}} = \\frac{kT}{e}\\ln\\frac{N_aN_d}{n_i^2},\\qquad I = I_s\\left(e^{eV/kT}-1\\right)', x: ['A silicon junction has N_a = N_d = 1.0 × 10²³ m⁻³. Find the built-in voltage and the width of the depletion region (ε = 11.7ε₀).', ['V_bi = 0.0259 × ln(10⁴⁶ ÷ 10³²) = 0.0259 × 32.2 = 0.83 V.', 'W = √(2εV_bi/e × (N_a + N_d)/(N_aN_d)) = √(2 × 1.04 × 10⁻¹⁰ × 0.83 ÷ 1.6 × 10⁻¹⁹ × 2 × 10⁻²³).', 'W = 1.5 × 10⁻⁷ m.'], '0.83 V; 0.15 μm'], c: ['By how much does a diode’s forward current rise when the voltage goes up by 60 mV at room temperature?', 'By e^(0.060/0.0259) ≈ 10 times.'] }],
    ['Devices', [
      'The junction underlies almost every device. In an **LED**, electrons and holes recombine at the junction and emit photons with energy close to the gap. A **solar cell** runs the same process backwards. A **transistor** uses a junction or a gate voltage to control a much larger current.'
    ], { n: 4, x: ['What colours do LEDs with gaps of 1.42 eV (GaAs), 2.7 eV (InGaN) and 3.4 eV (GaN) give?', ['λ ≈ 1240/E_g nm.', 'GaAs: 873 nm, infrared. InGaN: 460 nm, blue. GaN: 365 nm, ultraviolet.'], 'infrared, blue, ultraviolet'], c: ['Why is silicon a poor material for LEDs?', 'Its gap is indirect: an electron and hole can only recombine with the help of a lattice vibration, so light emission is slow and other losses win.'] }],
    ['Beyond the ideal diode', [
      'The diode equation assumes carriers diffuse across the barrier and recombine only outside the depletion region, with simple Boltzmann statistics. Real diodes also recombine inside it, have resistance in series, and break down at large reverse voltages.'
    ], { n: 5, c: ['A real diode’s current rises as e^(eV/1.5kT) instead of e^(eV/kT). What does the 1.5 suggest?', 'Significant recombination inside the depletion region, which gives an “ideality factor” between 1 and 2.'] }]
  ],
  m: [
    ['Treating holes as real positive particles.', 'A hole is a missing electron in a nearly full band.'],
    ['Using np = n_i² away from equilibrium.', 'It holds only in thermal equilibrium; under bias the junction regions break it.'],
    ['Forgetting kT/e ≈ 26 mV at room temperature.', 'It sets the scale of every exponential in the junction.']
  ]
});

WL.gd('y3-nuclear-particle', {
  h: 'Nuclei are drops of protons and neutrons about 10⁻¹⁵ m across, held together by the strong force. Two complementary models, a charged liquid drop and a shell model with “magic numbers”, explain their masses and decays. Inside the nucleons are quarks, and the whole zoo of particles is organised by conservation laws, then probed with accelerators and detectors.',
  s: [
    ['Size and binding', [
      'Electron scattering shows that nuclei have radius R ≈ 1.2 fm × A^(1/3), so all nuclei have about the same density. A nucleus weighs less than its parts by its binding energy B/c². B/A is about 8 MeV for most nuclei, peaking near iron and nickel.'
    ], { n: 0, e: 'R = r_0A^{1/3},\\quad r_0\\approx1.2\\ \\text{fm}', x: ['Find the radii of carbon-12 and uranium-238, and the density of nuclear matter.', ['C-12: 1.2 × 12^(1/3) = 2.7 fm. U-238: 1.2 × 238^(1/3) = 7.4 fm.', 'Density = m_nucleon ÷ (4/3 π r₀³) = 1.67 × 10⁻²⁷ ÷ 7.2 × 10⁻⁴⁵ = 2.3 × 10¹⁷ kg/m³.'], '2.7 fm and 7.4 fm; 2.3 × 10¹⁷ kg/m³'], c: ['Why do all nuclei have about the same density?', 'The strong force has a short range and saturates: each nucleon binds only to its near neighbours, so they pack the same way however many there are.'] }],
    ['The liquid-drop model', [
      'Treat the nucleus as a drop of nuclear fluid and add up what changes its binding: each nucleon binds to its neighbours (volume), surface nucleons have fewer neighbours (surface), protons repel (Coulomb), unequal numbers of protons and neutrons cost energy (asymmetry), and like nucleons prefer to pair. The **semi-empirical mass formula** fits most nuclei to about 1%.'
    ], { n: 1, e: 'B = a_vA - a_sA^{2/3} - a_c\\frac{Z(Z-1)}{A^{1/3}} - a_a\\frac{(A-2Z)^2}{A} \\pm \\frac{a_p}{\\sqrt A}', x: ['Estimate the binding energy of uranium-238 (Z = 92) with a_v = 15.8, a_s = 18.3, a_c = 0.714, a_a = 23.2, a_p = 12 MeV. The measured value is 1801.7 MeV.', ['Volume 3760; surface 18.3 × 38.4 = 703; Coulomb 0.714 × 92 × 91 ÷ 6.20 = 965.', 'Asymmetry 23.2 × 54² ÷ 238 = 284; pairing (even–even) +12/√238 = +0.8.', 'B = 3760 − 703 − 965 − 284 + 1 = 1810 MeV: 0.4% above the measurement (7.6 MeV per nucleon).'], 'about 1810 MeV'], c: ['Which term makes the heaviest nuclei less tightly bound per nucleon?', 'The Coulomb repulsion, which grows as Z²/A^(1/3).'] }],
    ['The shell model', [
      'Nuclei with 2, 8, 20, 28, 50, 82 or 126 protons or neutrons are unusually stable: these **magic numbers** recall closed shells in atoms. A simple well gives only the first three; a strong spin–orbit force, which lowers each j = l + ½ level, gives the rest. The model predicts the spin of an odd nucleus from its last unpaired nucleon.'
    ], { n: 2, x: ['Predict the ground-state spin and parity of oxygen-17 (8 protons, 9 neutrons).', ['8 protons and 8 neutrons fill closed shells.', 'The ninth neutron goes into the next level, 1d₅/₂ (l = 2, even parity).', 'So the spin is 5/2 with positive parity: 5/2⁺, as measured.'], '5/2⁺'], c: ['Why is lead-208 (82 protons, 126 neutrons) exceptionally stable?', 'It is doubly magic: both its proton and neutron shells are closed.'] }],
    ['Decays', [
      'Unstable nuclei decay by **alpha** emission (heavy nuclei shedding a helium-4 nucleus), **beta** decay (a neutron turning into a proton or back, via the weak force) and **gamma** emission (an excited nucleus dropping to a lower level). The energy released, Q, comes from the mass difference.'
    ], { n: 3, e: 'Q = \\left(M_{\\text{parent}} - \\sum M_{\\text{products}}\\right)c^2', x: ['Polonium-210 (209.982874 u) decays to lead-206 (205.974465 u) and an alpha (4.002603 u). Find Q and the alpha’s kinetic energy.', ['Δm = 209.982874 − 205.974465 − 4.002603 = 0.005806 u, so Q = 0.005806 × 931.5 = 5.41 MeV.', 'Momentum is shared equally, so the alpha takes a fraction 206/210 of Q.', 'K_α = 5.41 × 206 ÷ 210 = 5.30 MeV, as measured.'], 'Q = 5.41 MeV; K_α = 5.30 MeV'], c: ['Why does the alpha particle carry away almost all the energy?', 'Both pieces have equal and opposite momenta, and kinetic energy p²/2m is larger for the lighter one.'] }],
    ['Particles and forces', [
      'Matter is built from six **leptons** (electron, muon, tau and their neutrinos) and six **quarks**. Quarks carry colour and are confined inside hadrons: baryons (qqq) and mesons (qq̄). Forces are carried by the photon, the W and Z, and eight gluons; the Higgs boson gives mass to the W, Z and the fermions. Conservation laws decide which reactions can happen.'
    ], { n: 4, x: ['Check that π⁺ → μ⁺ + ν_μ conserves charge, baryon number and muon-lepton number.', ['Charge: +1 → +1 + 0.', 'Baryon number: 0 → 0 + 0.', 'Muon number: 0 → −1 (μ⁺ is an antilepton) + 1 (ν_μ) = 0.'], 'all conserved'], c: ['With enough energy, is p + p → p + p + π⁰ allowed?', 'Yes: charge (2 → 2) and baryon number (2 → 2) both balance.'] }],
    ['Accelerators and detectors', [
      'Accelerators give particles enough energy to probe small distances (about ħc/E) and to create heavy particles (E = mc²). Detectors measure momentum from how a track curves in a magnetic field, energy by absorbing showers in calorimeters, and identity from how strongly particles ionise. Combining the energies and momenta of decay products gives the **invariant mass** of what decayed.'
    ], { n: 5, e: 'p\\ [\\text{GeV}/c] = 0.3\\,B\\,[\\text{T}]\\;r\\,[\\text{m}],\\qquad M^2c^4 = \\Big(\\sum E\\Big)^2 - \\Big|\\sum\\mathbf pc\\Big|^2', x: ['A muon track curves with radius 4.0 m in a 2.0 T field. What is its momentum?', ['p = 0.3 × 2.0 × 4.0.', '= 2.4 GeV/c.'], '2.4 GeV/c'], c: ['Two photons of 80 GeV and 50 GeV emerge with 120° between them. What invariant mass produced them?', 'M² = 2E₁E₂(1 − cos θ) = 2 × 80 × 50 × 1.5 = 12 000 GeV², so M ≈ 110 GeV/c².'] }]
  ],
  m: [
    ['Writing R ∝ A instead of A^(1/3).', 'Volume, not radius, is proportional to A.'],
    ['Mixing atomic and nuclear masses in β⁺ decay.', 'Account for the electron masses when using atomic masses.'],
    ['Trusting the liquid-drop formula for very light nuclei.', 'It is accurate only for medium and heavy nuclei.']
  ]
});

WL.gd('y3-equivalence', {
  h: 'In a small enough room you cannot tell whether you are resting in a gravitational field or riding in a rocket accelerating the other way. From that observation alone, before any curved-spacetime mathematics, Einstein predicted that light bends near masses and that clocks run slower lower down. Both are now measured routinely, and GPS would fail without them.',
  s: [
    ['All things fall alike', [
      'Newton’s gravity involves two kinds of mass: inertial mass, in F = ma, and gravitational mass, in F = GMm/r². Experiment says they are proportional for every material, so everything falls with the same acceleration. The MICROSCOPE satellite (2022) found any difference to be smaller than about 1 part in 10¹⁵.'
    ], { n: 0, e: 'm_i\\,\\mathbf a = m_g\\,\\mathbf g\\;\\Longrightarrow\\;\\mathbf a = \\mathbf g\\quad\\text{if } m_i = m_g', c: ['If aluminium’s ratio of gravitational to inertial mass differed slightly from platinum’s, what would a torsion balance show?', 'A tiny twist: the two would accelerate slightly differently towards the Earth or Sun.'] }],
    ['Einstein’s equivalence principle', [
      'Einstein went further: no local experiment of any kind, mechanical, optical or atomic, can tell a uniform gravitational field from a uniformly accelerating frame. A freely falling laboratory is, locally, an inertial frame where special relativity holds.'
    ], { n: 1, c: ['Gravity at the height of the space station is about 90% as strong as on the ground. Why do astronauts float?', 'They and the station fall freely together: locally, an inertial frame.'] }],
    ['Light must bend', [
      'In a rocket accelerating at g, a light beam crossing a cabin of width w takes w/c, while the floor rises by ½g(w/c)². Inside, the beam seems to curve downwards. By equivalence, light must also fall in a gravitational field.'
    ], { n: 2, e: '\\Delta y = \\frac{g w^2}{2c^2}', x: ['How far does light fall crossing a 3.0 m room? And what deflection does full general relativity predict for starlight grazing the Sun?', ['Room: Δy = 9.81 × 3.0² ÷ (2 × (3.0 × 10⁸)²) = 4.9 × 10⁻¹⁶ m, far too small to see.', 'Sun: δθ = 4GM/(c²b) = 4 × 6.67 × 10⁻¹¹ × 2.0 × 10³⁰ ÷ (9.0 × 10¹⁶ × 6.96 × 10⁸) = 8.5 × 10⁻⁶ rad = 1.75″.', 'The equivalence argument alone gives only half of this; the other half comes from the curvature of space.'], '5 × 10⁻¹⁶ m; 1.75 arcseconds'], c: ['Why did Eddington’s 1919 eclipse measurement matter so much?', 'It could tell 0.87″ (the equivalence-only or Newtonian value) from 1.75″ (general relativity), and favoured 1.75″.'] }],
    ['Clocks run slower lower down', [
      'Send light from the floor to the ceiling of an accelerating rocket. While it travels, the ceiling gains speed gh/c, so it receives the light Doppler-shifted to a lower frequency. By equivalence, light climbing out of a gravitational field is redshifted: clocks lower down tick more slowly.'
    ], { n: 3, e: '\\frac{\\Delta f}{f} = -\\frac{gh}{c^2} = -\\frac{\\Delta\\Phi}{c^2}', x: ['Find the fractional shift in Pound and Rebka’s 22.5 m tower experiment (1959), and the daily gain of GPS clocks from weaker gravity at r = 2.66 × 10⁷ m (GM = 3.99 × 10¹⁴ m³/s²).', ['Tower: gh/c² = 9.81 × 22.5 ÷ 9.0 × 10¹⁶ = 2.5 × 10⁻¹⁵.', 'GPS: GM(1/R_E − 1/r)/c² = 3.99 × 10¹⁴ × (1.570 × 10⁻⁷ − 0.376 × 10⁻⁷) ÷ 9.0 × 10¹⁶ = 5.3 × 10⁻¹⁰.', 'Per day: 5.3 × 10⁻¹⁰ × 86 400 s = 46 μs gained.'], '2.5 × 10⁻¹⁵; about 46 μs per day'], c: ['Your head is 1.7 m above your feet. Does it age faster or slower, and by roughly how much per year?', 'Faster, by gh/c² = 1.9 × 10⁻¹⁶ of the time: about 6 nanoseconds a year.'] }],
    ['The tests', [
      'Pound and Rebka (1959) measured the shift up a tower; Gravity Probe A (1976) flew a hydrogen maser to 10 000 km and confirmed it to 1.4 parts in 10⁴; optical clocks have detected the shift for a height change of 33 cm (2010); GPS corrects for it every day.'
    ], { n: 4, c: ['In 2010 an optical clock raised by 33 cm was seen to run fast. What fractional shift is that?', 'gh/c² = 9.81 × 0.33 ÷ 9.0 × 10¹⁶ = 3.6 × 10⁻¹⁷.'] }],
    ['What equivalence cannot remove', [
      'A uniform field disappears in free fall, but a real field cannot be removed everywhere at once: two falling balls side by side drift together, and two one above the other drift apart. These **tidal effects** are what remain, and in general relativity they are the curvature of spacetime.'
    ], { n: 5, e: '\\Delta g \\approx \\frac{2GM}{r^3}\\,\\Delta r', x: ['Compare the tidal stretch across a 2 m astronaut in low orbit (r = 6.77 × 10⁶ m) with that near a 10-solar-mass black hole at r = 100 km.', ['Orbit: 2 × 3.99 × 10¹⁴ × 2 ÷ (6.77 × 10⁶)³ = 5 × 10⁻⁶ m/s²: unnoticeable.', 'Black hole: 2 × 6.67 × 10⁻¹¹ × 2.0 × 10³¹ × 2 ÷ (10⁵)³ = 5 × 10⁶ m/s²: half a million g, tearing her apart.'], 'about 5 × 10⁻⁶ against 5 × 10⁶ m/s²'], c: ['Why can no freely falling frame remove tidal effects?', 'They are differences in gravity between nearby points; one acceleration cannot cancel different pulls everywhere.'] }]
  ],
  m: [
    ['Thinking free fall removes gravity entirely.', 'Only locally; tidal effects remain.'],
    ['Using the equivalence principle for the full light deflection.', 'It gives only half; space curvature supplies the rest.'],
    ['Getting the direction of gravitational time dilation wrong.', 'Lower clocks run slower.']
  ]
});
