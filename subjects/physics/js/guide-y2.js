/* Geodesic step-by-step guides, stage y2 (built from src/guide/y2-*.js) */
WL.gd('y2-lagrangian', {
  h: 'Throw a ball and it follows a parabola. Newton explains that with forces acting moment by moment. Lagrange and Hamilton found a completely different explanation: of every path the ball could take between two moments, nature chooses the one for which a single number, the action, does not change to first order. It gives the same answers, and it works in any coordinates you like.',
  s: [
    ['The action', [
      'Describe a system by coordinates q(t). Its **Lagrangian** is L = T − V, kinetic minus potential energy. The **action** of a path between two fixed moments is S = ∫L dt. **Hamilton’s principle**: the actual path makes S stationary, so any small change to the path changes S only at second order.'
    ], { n: 0, e: 'S[q] = \\int_{t_1}^{t_2} L(q,\\dot q,t)\\,dt,\\qquad \\delta S = 0', x: ['A ball is thrown up at t = 0 from height 0 and caught at height 0 at t = 1 s. Try paths x = at(1 − t). Which value of a makes the action stationary?', ['ẋ = a(1 − 2t), so T = ½ma²(1 − 2t)² and V = mgat(1 − t).', 'S(a) = ½ma² ∫₀¹(1 − 2t)² dt − mga ∫₀¹ t(1 − t) dt = ma²/6 − mga/6.', 'dS/da = ma/3 − mg/6 = 0 gives a = g/2: x = (g/2)t(1 − t), exactly the real path (ẍ = −g).'], 'a = g/2, the true parabola'], c: ['Is the action always a minimum on the real path?', 'Not always: it is stationary. For short times it is usually a minimum, but it can be a saddle point.'] }],
    ['The Euler–Lagrange equation', [
      'Change the path slightly by εη(t), with η = 0 at both ends. Differentiate S with respect to ε and integrate by parts: the end terms vanish, and what is left must vanish for every possible η. That forces a bracket to be zero at every moment: the **Euler–Lagrange equation**, one for each coordinate.'
    ], { n: 1, e: '\\frac{d}{dt}\\frac{\\partial L}{\\partial\\dot q} - \\frac{\\partial L}{\\partial q} = 0', x: ['Find the equation of motion of a pendulum of length l from its Lagrangian.', ['With θ from the vertical: T = ½ml²θ̇² and V = −mgl cos θ, so L = ½ml²θ̇² + mgl cos θ.', '∂L/∂θ̇ = ml²θ̇ and ∂L/∂θ = −mgl sin θ.', 'Euler–Lagrange: ml²θ̈ + mgl sin θ = 0, so θ̈ = −(g/l) sin θ.'], 'θ̈ = −(g/l) sin θ'], c: ['Apply the Euler–Lagrange equation to L = ½mẋ² − ½kx².', 'mẍ = −kx: a mass on a spring.'] }],
    ['Why bother: any coordinates, no constraint forces', [
      'The equation has the same form in any coordinates: angles, polar coordinates, distance along a wire. Forces that only enforce a constraint (a pendulum rod’s tension, a hoop’s push on a bead) never have to be found, because coordinates that respect the constraint leave them out automatically.'
    ], { n: 2, x: ['A bead slides on a frictionless hoop of radius R that spins about its vertical diameter at angular speed Ω. Find where the bead can rest relative to the hoop (θ measured from the bottom).', ['The bead’s speed has a part Rθ̇ along the hoop and RΩ sin θ round the axis: L = ½mR²(θ̇² + Ω² sin²θ) + mgR cos θ.', 'Euler–Lagrange: mR²θ̈ = mR²Ω² sin θ cos θ − mgR sin θ.', 'At rest θ̈ = 0: either sin θ = 0 (bottom or top), or cos θ = g/(RΩ²), which exists only if Ω² > g/R.'], 'at the bottom, the top, or at cos θ = g/(RΩ²) when the hoop spins fast enough'], c: ['Why did you never need the force of the hoop on the bead?', 'Using θ as the coordinate keeps the bead on the hoop automatically; that force does no work and drops out.'] }],
    ['Symmetry gives conservation', [
      'If L does not depend on a coordinate q (a **cyclic** coordinate), the Euler–Lagrange equation says its **conjugate momentum** ∂L/∂q̇ stays constant. If L does not depend on time, the energy function Σq̇ ∂L/∂q̇ − L is conserved. Shifts give momentum, rotations angular momentum, time shifts energy: Noether’s theorem.'
    ], { n: 3, e: '\\frac{\\partial L}{\\partial q} = 0\\;\\Longrightarrow\\; p_q = \\frac{\\partial L}{\\partial\\dot q} = \\text{constant}', x: ['A particle moves in a plane in a potential U(r) that depends only on distance. What is conserved?', ['In polar coordinates L = ½m(ṙ² + r²φ̇²) − U(r).', 'φ does not appear, so p_φ = ∂L/∂φ̇ = mr²φ̇ is constant: the angular momentum.', 'L has no explicit t, so the energy ½m(ṙ² + r²φ̇²) + U is constant too.'], 'angular momentum and energy'], c: ['If L does not depend explicitly on time, what is conserved?', 'The energy function h = Σq̇ ∂L/∂q̇ − L, which usually equals T + V.'] }],
    ['From classical to quantum', [
      'In Feynman’s version of quantum mechanics a particle takes every path, each weighted by e^(iS/ħ). When S is huge compared with ħ, neighbouring paths have wildly different phases and cancel, except near the path where S is stationary. Classical mechanics is what survives.'
    ], { n: 4, x: ['Compare S/ħ for a thrown ball (0.1 kg, 10 m/s, for 1 s) and for an electron in an atom (about 10 eV over 10⁻¹⁶ s).', ['Ball: S ≈ ½mv² × t = 5 J s, so S/ħ ≈ 5 ÷ 1.05 × 10⁻³⁴ ≈ 5 × 10³⁴.', 'Electron: S ≈ 1.6 × 10⁻¹⁸ J × 10⁻¹⁶ s ≈ 2 × 10⁻³⁴ J s, so S/ħ ≈ 2.'], 'about 10³⁴ for the ball (classical); about 1 for the electron (quantum)'], c: ['Why does classical mechanics emerge when the action is large?', 'Paths away from the stationary one have rapidly varying phases that cancel; only those near it add up.'] }]
  ],
  m: [
    ['Writing L = T + V.', 'The Lagrangian is T − V.'],
    ['Leaving out velocity terms that come from the coordinates.', 'In polar coordinates T includes r²φ̇², and so on.'],
    ['Saying the action is always a minimum.', 'It is stationary; it may be a saddle.']
  ]
});

WL.gd('y2-noether', {
  h: 'Why is energy conserved? Not by luck: because the laws of physics are the same today as yesterday. In 1918 Emmy Noether proved that every continuous symmetry of a system comes with a conserved quantity. Shifting in time gives energy, shifting in space gives momentum, rotating gives angular momentum, and that idea organises nearly all of modern physics.',
  s: [
    ['Cyclic coordinates', [
      'With coordinates q_i and Lagrangian L(q, q̇, t), the **generalised momentum** is p_i = ∂L/∂q̇_i. If L does not depend on some q_i, that coordinate is **cyclic**, and its momentum p_i is conserved, straight from the Euler–Lagrange equation.'
    ], { n: 0, e: '\\frac{\\partial L}{\\partial q_i} = 0 \\Rightarrow p_i = \\frac{\\partial L}{\\partial\\dot q_i} = \\text{constant}', x: ['For a projectile, L = ½m(ẋ² + ẏ²) − mgy. Which momentum is conserved?', ['x does not appear in L, so p_x = ∂L/∂ẋ = mẋ is constant.', 'y does appear, through −mgy.'], 'the horizontal momentum mẋ'], c: ['Is p_y conserved for the projectile?', 'No: ∂L/∂y = −mg is not zero, so dp_y/dt = −mg.'] }],
    ['Noether’s theorem', [
      'Suppose a small shift q_i → q_i + εK_i(q) leaves L unchanged (or changes it only by a total time derivative ε dF/dt). Then the quantity Q = Σp_iK_i − F is conserved along every motion.'
    ], { n: 1, e: 'Q = \\sum_i\\frac{\\partial L}{\\partial\\dot q_i}K_i - F', x: ['A particle moves in a plane under a potential U(√(x² + y²)). Use rotation symmetry to find the conserved quantity.', ['A small rotation shifts (x, y) by ε(−y, x), so K = (−y, x), and it leaves both T and U unchanged (F = 0).', 'Q = p_x(−y) + p_y x = m(xẏ − yẋ).'], 'Q = m(xẏ − yẋ), the angular momentum'], c: ['What conserved quantity comes from shifting every particle the same distance along x?', 'The total momentum along x.'] }],
    ['The big three, and when they fail', [
      'Symmetry under time shifts gives conservation of energy: in general the energy function h = Σp_iq̇_i − L changes only as fast as L depends explicitly on time. Space shifts give momentum; rotations give angular momentum. When a symmetry is broken, the matching quantity is no longer conserved.'
    ], { n: 2, e: 'h = \\sum p_i\\dot q_i - L,\\qquad \\frac{dh}{dt} = -\\frac{\\partial L}{\\partial t}', x: ['A mass on a spring whose stiffness is slowly changed, k(t). Is its energy conserved?', ['L = ½mẋ² − ½k(t)x² depends explicitly on t.', 'So dh/dt = −∂L/∂t = ½k̇x², which is not zero while k changes.', 'Energy is not conserved: whoever changes the spring does work.'], 'no: dh/dt = ½k̇x²'], c: ['A ball rolls on a surface that is slowly being tilted. Is its energy conserved?', 'No: the Lagrangian depends explicitly on time, so there is no time-shift symmetry.'] }],
    ['Canonical and kinetic momentum', [
      'For a charge in a magnetic field, L = ½mv² + qv·A − qφ, so the momentum that symmetry conserves is the **canonical momentum** p = mv + qA, not mv itself.'
    ], { n: 3, e: '\\mathbf p_{\\text{can}} = m\\mathbf v + q\\mathbf A', x: ['A charge moves in a uniform field B along z, described by A = (0, Bx, 0). What is conserved, and what does it mean?', ['L = ½m(ẋ² + ẏ² + ż²) + qBxẏ does not depend on y.', 'So p_y = mẏ + qBx is constant.', 'Since mẏ swings back and forth as the charge circles, this fixes the x-position of the centre of its circle.'], 'p_y = mẏ + qBx'], c: ['Is the ordinary momentum mv of a charge circling in a uniform field conserved?', 'No: its direction keeps changing. Only canonical momenta along symmetric directions are conserved.'] }],
    ['Beyond mechanics', [
      'For fields, Noether’s theorem gives conserved currents obeying ∂_μJ^μ = 0. The phase symmetry of the quantum wavefunction gives conservation of probability and of electric charge; shifts in space and time give conservation of energy and momentum. Some conserved quantities come from hidden symmetries, such as the Runge–Lenz vector that keeps Kepler’s orbits closed.'
    ], { n: 4, e: '\\partial_\\mu J^\\mu = 0', c: ['Which symmetry lies behind the conservation of electric charge?', 'The symmetry of a charged field under a change of its overall phase.'] }]
  ],
  m: [
    ['Assuming a symmetric-looking system has a conserved quantity.', 'The Lagrangian itself must be unchanged by the shift.'],
    ['Using mv where canonical momentum is conserved.', 'With magnetic fields the conserved momentum is mv + qA.'],
    ['Applying Noether to discrete symmetries such as reflections.', 'The theorem needs continuous symmetries.']
  ]
});

WL.gd('y2-central-force', {
  h: 'Kepler spent years fitting Mars’s orbit and found an ellipse with the Sun at one focus. Newton showed why: two bodies pulling on each other along the line between them reduce to one body moving in a fixed potential, angular momentum is conserved, and for an inverse-square force the orbits must be conic sections.',
  s: [
    ['Two bodies become one', [
      'For two masses interacting through a potential that depends only on their separation, the centre of mass moves steadily, and the separation r = r₁ − r₂ behaves like a single particle of **reduced mass** μ = m₁m₂/(m₁ + m₂) in that potential.'
    ], { n: 0, e: '\\mu = \\frac{m_1m_2}{m_1 + m_2}', x: ['Find the reduced mass of hydrogen (m_e = 9.109 × 10⁻³¹ kg, m_p = 1836 m_e), and how much it shifts the energy levels.', ['μ = m_e × m_p/(m_e + m_p) = m_e × 1836/1837 = 0.99946 m_e.', 'Energy levels are proportional to μ, so they are 0.054% smaller than with a fixed proton.', 'Deuterium’s heavier nucleus shifts its lines slightly, which is how deuterium was discovered in 1931.'], 'μ = 0.99946 m_e; levels shifted by 0.05%'], c: ['When is the reduced mass practically the lighter mass?', 'When the other mass is much larger, as for a planet and the Sun.'] }],
    ['The effective potential', [
      'A central force exerts no torque, so the angular momentum L = μr²φ̇ is conserved and the motion stays in a plane. The radial motion is then one-dimensional, with an extra **centrifugal** term added to the potential. The particle moves between turning points where E = U_eff; circular orbits sit at its minimum.'
    ], { n: 1, e: 'E = \\tfrac12\\mu\\dot r^2 + U_{\\text{eff}}(r),\\qquad U_{\\text{eff}} = U(r) + \\frac{L^2}{2\\mu r^2}', x: ['For U = −k/r, find the radius of the circular orbit with angular momentum L.', ['dU_eff/dr = k/r² − L²/(μr³) = 0.', 'r = L²/(μk).'], 'r = L²/(μk)'], c: ['Why can a particle with L ≠ 0 never fall into r = 0 under a 1/r potential?', 'The centrifugal term L²/(2μr²) rises faster than −k/r falls, so close in it acts as a barrier.'] }],
    ['The orbit equation', [
      'Write u = 1/r and use the angle θ instead of time. For U = −k/r the radial equation becomes d²u/dθ² + u = μk/L², whose solution is a **conic section**, r = p/(1 + e cos θ), with p = L²/(μk). The eccentricity e is set by the energy: e < 1 (E < 0) gives an ellipse, e = 1 a parabola, e > 1 a hyperbola.'
    ], { n: 2, e: 'r = \\frac{p}{1 + e\\cos\\theta},\\qquad E = \\frac{\\mu k^2}{2L^2}(e^2 - 1)', x: ['An orbit has p = 1.0 AU and e = 0.50. Find its closest and furthest distances and its semi-major axis.', ['Closest (θ = 0): r = 1.0 ÷ 1.5 = 0.67 AU.', 'Furthest (θ = π): r = 1.0 ÷ 0.5 = 2.0 AU.', 'a = (0.67 + 2.0) ÷ 2 = 1.33 AU, which equals p/(1 − e²).'], '0.67 AU and 2.0 AU; a = 1.33 AU'], c: ['What sign must the total energy have for a closed orbit?', 'Negative: then e < 1 and the orbit is an ellipse.'] }],
    ['Kepler’s laws', [
      'First law: orbits are ellipses with the Sun at a focus. Second: equal areas in equal times, because angular momentum is conserved. Third: T² = 4π²a³/(G(M + m)). The **vis-viva** equation gives the speed anywhere on an orbit: v² = GM(2/r − 1/a).'
    ], { n: 3, e: 'T^2 = \\frac{4\\pi^2a^3}{G(M + m)},\\qquad v^2 = GM\\left(\\frac2r - \\frac1a\\right)', x: ['Halley’s comet comes within 0.586 AU of the Sun and goes out to 35.1 AU. Find its semi-major axis, eccentricity, period and speed at its closest point. (GM_Sun = 4π² AU³/yr²; 1 AU/yr = 4.74 km/s)', ['a = (0.586 + 35.1) ÷ 2 = 17.8 AU; e = (35.1 − 0.586) ÷ (35.1 + 0.586) = 0.967.', 'T = a^1.5 years = 17.8^1.5 = 75 years.', 'v² = 39.5 × (2 ÷ 0.586 − 1 ÷ 17.8) = 39.5 × 3.36 = 133, so v = 11.5 AU/yr = 55 km/s.'], 'a = 17.8 AU; e = 0.97; 75 years; 55 km/s'], c: ['A satellite in a circular orbit fires its engine forwards briefly to speed up. What happens to its semi-major axis?', 'It grows: by vis-viva, a larger v at the same r means a larger a, a higher-energy orbit.'] }],
    ['Why orbits close', [
      'Bertrand’s theorem: the only central forces for which every bounded orbit closes are the inverse-square law and the linear (spring) force. For gravity the closure is guaranteed by a conserved vector pointing to the closest point (the Runge–Lenz vector). Any small extra force makes that point slowly rotate: the orbit **precesses**.'
    ], { n: 4, c: ['Mercury’s closest point precesses 43 arcseconds per century more than Newtonian effects from the other planets explain. What does that tell you?', 'Gravity near the Sun is not exactly inverse-square; general relativity accounts for exactly that 43″.'] }]
  ],
  m: [
    ['Using the total mass where the reduced mass belongs (or the reverse).', 'μ for the relative motion; M + m in Kepler’s third law.'],
    ['Forgetting the centrifugal term.', 'U_eff = U + L²/(2μr²).'],
    ['Confusing the semi-major axis with the closest distance.', 'a is half the sum of the closest and furthest distances.']
  ]
});

WL.gd('y2-small-oscillations', {
  h: 'A molecule, a suspension bridge and a crystal all sit near a stable equilibrium, and near any such point every system behaves like a set of independent springs. Expand the energy to second order, and one matrix calculation gives all the natural frequencies and shapes of vibration, the normal modes.',
  s: [
    ['Expanding about equilibrium', [
      'At an equilibrium q₀ every ∂U/∂q_i is zero. Write q = q₀ + η and keep terms up to second order: U ≈ U₀ + ½ηᵀVη, where V is the matrix of second derivatives (the **stiffness matrix**), and T ≈ ½η̇ᵀTη̇, with the **mass matrix** T evaluated at q₀. The equilibrium is stable if V is positive definite.'
    ], { n: 0, e: 'L \\approx \\tfrac12\\dot\\eta^{\\mathsf T}T\\dot\\eta - \\tfrac12\\eta^{\\mathsf T}V\\eta', x: ['Expand a pendulum about its lowest point and find ω.', ['U = mgl(1 − cos θ) ≈ ½mglθ², so V = mgl.', 'T = ½ml²θ̇², so the mass matrix is ml².', 'ω² = V/T = g/l.'], 'ω = √(g/l)'], c: ['What does it mean for V to be positive definite?', 'Every small displacement, in any combination of coordinates, raises the potential energy.'] }],
    ['Normal modes', [
      'The equations of motion Tη̈ = −Vη have solutions in which every coordinate oscillates together, η = a cos(ωt + φ), when (V − ω²T)a = 0. The squared frequencies are the roots of det(V − ω²T) = 0, and the vectors a are the mode shapes.'
    ], { n: 1, e: '\\det(V - \\omega^2T) = 0', x: ['A linear molecule has masses m, M, m in a row, joined by two springs k, moving along the line. Find its modes.', ['T = diag(m, M, m) and V = k[[1, −1, 0], [−1, 2, −1], [0, −1, 1]].', 'det(V − ω²T) = 0 gives ω² = 0, k/m and k/m + 2k/M.', 'Modes: everything sliding together (ω = 0); the outer atoms moving oppositely with the centre still; and the outer atoms moving together against the centre.'], 'ω = 0, √(k/m), √(k/m)√(1 + 2m/M)'], c: ['For CO₂ (m = 16, M = 12) this model predicts the ratio of the two stretching frequencies to be √(1 + 32/12) = 1.9. The measured ratio is about 1.7. Why might the model be off?', 'Real bonds are not simple springs between neighbours only; the oxygen atoms also interact, and quantum effects mix some vibrations.'] }],
    ['Normal coordinates', [
      'Put the mode vectors into a matrix A and write η = Aξ. Both energies become sums of squares: L = Σ½(ξ̇ₖ² − ωₖ²ξₖ²). Each **normal coordinate** ξₖ is an independent oscillator, and any small motion is a sum of them, with amounts set by how the motion started.'
    ], { n: 2, e: '\\eta = A\\xi,\\qquad L = \\sum_k \\tfrac12\\left(\\dot\\xi_k^2 - \\omega_k^2\\xi_k^2\\right)', c: ['Why do normal coordinates make the problem easy?', 'Each one obeys its own equation ξ̈ = −ω²ξ, with no coupling to the others.'] }],
    ['Zero modes and repeated frequencies', [
      'A free molecule can drift or turn with no change in energy: those are **zero modes**, with ω = 0. When two modes share a frequency (as in a round bowl), the mode shapes are not unique; symmetry usually suggests a natural choice.'
    ], { n: 3, c: ['How many zero modes does a free, non-linear molecule have in three dimensions?', 'Six: three translations and three rotations (a linear molecule has five).'] }],
    ['Stability from the second derivatives', [
      'If V has a negative eigenvalue, the matching ω² is negative and that mode grows exponentially instead of oscillating: the equilibrium is unstable. This is the general test for the stability of any mechanical equilibrium.'
    ], { n: 4, x: ['A uniform 15 cm pencil is balanced on its tip. How fast does a small tilt grow?', ['U = mg(l/2)cos θ ≈ mgl/2 − ¼mglθ², so the stiffness is −mgl/2: negative.', 'Mass term: I = ml²/3 about the tip, so ω² = −(mgl/2)/(ml²/3) = −3g/(2l) = −98 s⁻².', 'The tilt grows as e^(9.9t): it multiplies by e every 0.10 s.'], 'growth rate about 10 s⁻¹'], c: ['What does a negative ω² mean physically?', 'The displacement grows exponentially instead of oscillating: the equilibrium is unstable.'] }]
  ],
  m: [
    ['Leaving out the mass matrix when the masses differ.', 'Solve det(V − ω²T) = 0, not det(V − ω²).'],
    ['Expanding the kinetic energy to higher order.', 'Evaluate the mass matrix at the equilibrium; that is enough.'],
    ['Missing the zero modes.', 'Free systems always have zero-frequency translations and rotations.']
  ]
});

WL.gd('y2-rigid-body', {
  h: 'Toss a phone spinning end over end about the axis across its width and it flips over unexpectedly every turn or so; spin it about its long axis or about the axis through its screen and it turns smoothly. Astronauts on the space station filmed a wing nut doing the same. Euler’s equations for rigid bodies explain exactly why.',
  s: [
    ['The inertia tensor', [
      'For a rigid body turning with angular velocity ω, the angular momentum is L = 𝐈ω, where 𝐈 is the **inertia tensor**, I_ij = Σm(r²δ_ij − x_ix_j). The kinetic energy is ½ω·𝐈ω. In general L does not point along ω.'
    ], { n: 0, e: 'I_{ij} = \\sum m\\,(r^2\\delta_{ij} - x_ix_j),\\qquad \\mathbf L = \\mathbf I\\boldsymbol\\omega', x: ['Two masses m sit at (a, 0, a) and (−a, 0, −a): a tilted dumbbell. It spins about the z-axis at ω. Find L.', ['I_zz = Σm(r² − z²) = 2m(2a² − a²) = 2ma².', 'I_xz = −Σmxz = −2ma², and I_yz = 0.', 'L = (I_xzω, 0, I_zzω) = (−2ma²ω, 0, 2ma²ω): tilted away from the spin axis.'], 'L is not parallel to ω'], c: ['Why do car wheels need balancing?', 'If the axle is not a principal axis, L sweeps round with the wheel, and the bearings must supply a rotating torque: vibration.'] }],
    ['Principal axes', [
      'The inertia tensor is real and symmetric, so it has three perpendicular eigenvectors, the **principal axes**, with **principal moments** I₁, I₂, I₃. Spin about a principal axis and L is parallel to ω. For a box of sides a > b > c, the moments about axes along a, b and c are M(b² + c²)/12, M(a² + c²)/12 and M(a² + b²)/12.'
    ], { n: 1, x: ['A phone is 15 cm × 7 cm (thickness ignored). Find its three principal moments, in units of M cm².', ['Axis along the length: M × 7² ÷ 12 = 4.1.', 'Axis along the width: M × 15² ÷ 12 = 18.8.', 'Axis through the screen: M × (15² + 7²) ÷ 12 = 22.8.'], '4.1, 18.8 and 22.8 M cm²: the width axis is the intermediate one'], c: ['For a book with sides a > b > c, which axis has the intermediate moment?', 'The axis parallel to the middle-length edge b.'] }],
    ['Euler’s equations', [
      'Newton’s law dL/dt = τ holds in a fixed frame. In the body’s own rotating frame, along its principal axes, it becomes three coupled equations, because the frame itself turns.'
    ], { n: 2, e: 'I_1\\dot\\omega_1 = (I_2 - I_3)\\omega_2\\omega_3 + \\tau_1\\quad(\\text{and cyclic})', x: ['Show that, with no torque, Euler’s equations keep the kinetic energy constant.', ['Multiply each equation by its ω_i and add: Σ I_iω_iω̇_i = ω₁ω₂ω₃[(I₂ − I₃) + (I₃ − I₁) + (I₁ − I₂)].', 'The bracket is zero.', 'So d/dt(½ΣI_iω_i²) = 0.'], 'dT/dt = 0'], c: ['With no torque, are L’s components in the body frame constant?', 'No: L is fixed in space, but the body turns, so its body-frame components change.'] }],
    ['The free symmetric top', [
      'If I₁ = I₂ and no torque acts, ω₃ stays constant while the other two components rotate at Ω = ω₃(I₃ − I₁)/I₁: the rotation axis circles the symmetry axis.'
    ], { n: 3, e: '\\Omega = \\omega_3\\frac{I_3 - I_1}{I_1}', x: ['For a rigid Earth, (I₃ − I₁)/I₁ = 1/305. How long would the wobble of its rotation axis take?', ['ω₃ is one turn per day.', 'Ω = ω₃/305: one turn every 305 days.'], '305 days'], c: ['The observed wobble (the Chandler wobble) takes about 433 days. Why longer?', 'The Earth is not rigid: its elastic yielding and its oceans slow the wobble.'] }],
    ['The intermediate-axis theorem', [
      'Spin about the axis of largest or smallest moment is stable. Spin about the intermediate axis is not: a tiny wobble grows exponentially, at a rate ω√((I₂ − I₁)(I₃ − I₂)/(I₁I₃)), and the body flips over again and again.'
    ], { n: 4, e: '\\lambda = \\omega\\sqrt{\\frac{(I_2 - I_1)(I_3 - I_2)}{I_1I_3}}', x: ['For the phone above, how fast does a wobble grow when it is spun about its width axis?', ['I₁ = 4.1, I₂ = 18.8, I₃ = 22.8 (in M cm²).', 'λ/ω = √((18.8 − 4.1)(22.8 − 18.8) ÷ (4.1 × 22.8)) = √(58.8 ÷ 93.5) = 0.79.', 'The wobble grows by a factor e for every 1.3 rad of spin: it flips within about a turn.'], 'λ ≈ 0.8ω'], c: ['Explorer 1 (1958) was spun about its long axis, the one of smallest moment, and its flexible antennas slowly lost energy. What happened?', 'For fixed L the energy L²/2I is lowest about the axis of largest moment, so losing energy drove it there: it ended up tumbling end over end.'] }]
  ],
  m: [
    ['Assuming L always points along ω.', 'Only for rotation about a principal axis.'],
    ['Using Euler’s equations in axes that are not principal.', 'Those three equations assume principal axes.'],
    ['Thinking L’s body-frame components stay fixed without torque.', 'L is fixed in space, not in the body.']
  ]
});
WL.gd('y2-multipoles', {
  h: 'Why can a charged sphere be replaced by a point charge at its centre, and why does the field of a neutral water molecule fall off as 1/r³ instead of 1/r²? In empty space the potential obeys Laplace’s equation, and its solutions are unique once the boundaries are fixed. That uniqueness licenses every clever trick: image charges, separation of variables and the multipole expansion.',
  s: [
    ['Laplace’s equation', [
      'Where there is no charge, the potential obeys ∇²V = 0 (with charge, Poisson’s equation ∇²V = −ρ/ε₀). Its solutions have a remarkable property: V at any point equals its average over any sphere around that point. So V can have no maximum or minimum in empty space; its extremes lie on the boundaries.'
    ], { n: 0, e: '\\nabla^2 V = 0\\ \\ \\text{(no charge)},\\qquad \\nabla^2V = -\\frac{\\rho}{\\varepsilon_0}', x: ['Check that V = x² − y² solves Laplace’s equation, and describe the origin.', ['∂²V/∂x² = 2 and ∂²V/∂y² = −2, so ∇²V = 0.', 'At the origin V rises along x but falls along y: a saddle, not a minimum.'], 'it solves it; the origin is a saddle point'], c: ['Can electrostatic fields alone hold a charge in stable equilibrium?', 'No (Earnshaw’s theorem): stability would need a minimum of the potential energy, and V has none in empty space.'] }],
    ['Uniqueness', [
      'If two potentials obey the same Poisson equation and the same boundary conditions, their difference W obeys Laplace’s equation and vanishes on the boundary. Then ∫|∇W|² dV = 0, so W is constant: the solution is unique. Any guess that satisfies the equation and the boundary conditions is therefore the answer.'
    ], { n: 1, x: ['A hollow closed conductor contains no charge. Find the field inside it.', ['V = constant (the conductor’s potential) satisfies Laplace’s equation inside and matches the boundary.', 'By uniqueness it is the solution, so E = −∇V = 0 inside.'], 'zero: a Faraday cage'], c: ['Why does uniqueness let you trust an inspired guess?', 'If the guess satisfies the equation and the boundary conditions, no other solution exists.'] }],
    ['Image charges', [
      'Replace a conductor by imaginary charges, placed outside the region you care about, that make the boundary conditions come out right. Uniqueness guarantees the answer, but only in the region containing the real charges: the images are not really there.'
    ], { n: 2, x: ['A 1.0 nC charge is 5.0 cm above a large grounded metal plate. Find the force on it.', ['An image charge −1.0 nC, 5.0 cm below the plate, makes V = 0 on the plane.', 'The force is that between the charge and its image, 10 cm apart: F = 8.99 × 10⁹ × (1.0 × 10⁻⁹)² ÷ 0.10².', 'F = 9.0 × 10⁻⁷ N, pulling it towards the plate.'], '9.0 × 10⁻⁷ N towards the plate'], c: ['Is the image charge physically there?', 'No: it only reproduces the correct field above the plate. Below the plate, inside the metal, the field is zero.'] }],
    ['Separation of variables', [
      'In spherical coordinates with symmetry about an axis, Laplace’s equation separates, and the general solution is a sum of powers of r times **Legendre polynomials** P_l(cos θ). Fit the coefficients to the boundary conditions.'
    ], { n: 3, e: 'V(r,\\theta) = \\sum_{l=0}^{\\infty}\\left(A_l r^l + \\frac{B_l}{r^{l+1}}\\right)P_l(\\cos\\theta)', x: ['A conducting sphere of radius R (held at V = 0) sits in a uniform field E₀ along z. Find the potential outside it.', ['Far away V → −E₀r cos θ, so only the l = 1 terms survive: V = (−E₀r + B₁/r²) cos θ.', 'V = 0 at r = R gives B₁ = E₀R³.', 'V = −E₀(r − R³/r²) cos θ, with surface charge σ = 3ε₀E₀ cos θ.'], 'V = −E₀(r − R³/r²) cos θ'], c: ['What does the sphere’s own contribution look like from far away?', 'A dipole: E₀R³ cos θ/r², with dipole moment p = 4πε₀R³E₀.'] }],
    ['The multipole expansion', [
      'Seen from a distance r much larger than its size, any charge distribution’s potential becomes a series: a **monopole** term Q/r, a **dipole** term p·r̂/r², a **quadrupole** term in 1/r³, and so on. Each coefficient is a moment of the charge distribution, and each term falls off faster than the one before.'
    ], { n: 4, e: 'V(\\mathbf r) = \\frac{1}{4\\pi\\varepsilon_0}\\left[\\frac{Q}{r} + \\frac{\\mathbf p\\cdot\\hat{\\mathbf r}}{r^2} + \\cdots\\right]', x: ['A water molecule has dipole moment 6.2 × 10⁻³⁰ C m. Find its field 1.0 nm away along its axis.', ['On the axis E = 2p/(4πε₀r³).', 'E = 2 × 8.99 × 10⁹ × 6.2 × 10⁻³⁰ ÷ (1.0 × 10⁻⁹)³.', '= 1.1 × 10⁸ V/m.'], '1.1 × 10⁸ V/m'], c: ['A neutral charge distribution also has zero dipole moment. How does its potential fall with distance?', 'As 1/r³: the quadrupole term leads.'] }],
    ['Multipoles in experiments', [
      'Multipole moments can be measured, and each tests a model. The Earth’s equatorial bulge gives it a quadrupole moment that makes satellite orbits precess; nuclear quadrupole moments show which nuclei are squashed or stretched.'
    ], { n: 5, c: ['How do engineers use the Earth’s quadrupole moment?', 'They choose an orbit tilt at which the bulge makes the orbit plane turn exactly once a year: a sun-synchronous orbit, which passes over each place at the same local time.'] }]
  ],
  m: [
    ['Using image charges in the wrong region.', 'Images are valid only where the real charges are.'],
    ['Thinking zero total charge means zero field.', 'Dipole and higher moments can still give a field.'],
    ['Forgetting what fixes uniqueness.', 'You need the boundary potentials (or the charges on the conductors).']
  ]
});

WL.gd('y2-matter-fields', {
  h: 'Slide a slab of glass between the plates of a capacitor and its capacitance jumps fivefold; put an iron core in a coil and it becomes a magnet a thousand times stronger. Matter responds to fields: its atoms stretch into tiny dipoles and its electrons’ spins line up. Two new fields, D and H, keep track of that response so that the equations refer only to charges and currents we control.',
  s: [
    ['Polarisation and bound charge', [
      'The **polarisation** P is the electric dipole moment per unit volume. Where P is not uniform, the ends of neighbouring dipoles do not cancel, leaving a **bound charge**: ρ_b = −∇·P inside and σ_b = P·n̂ on surfaces. A polarised object’s field is exactly the field of these bound charges.'
    ], { n: 0, e: '\\rho_b = -\\nabla\\cdot\\mathbf P,\\qquad \\sigma_b = \\mathbf P\\cdot\\hat{\\mathbf n}', x: ['A wide slab is uniformly polarised with P = 1.0 × 10⁻⁵ C/m² at right angles to its faces. Find the bound charges and the field they make inside.', ['Inside, P is uniform, so ρ_b = 0.', 'On the faces, σ_b = ±1.0 × 10⁻⁵ C/m², like a parallel-plate capacitor.', 'Inside, E = −P/ε₀ = −1.0 × 10⁻⁵ ÷ 8.85 × 10⁻¹² = −1.1 × 10⁶ V/m, opposite to P.'], 'surface charges ±10⁻⁵ C/m²; 1.1 MV/m inside, opposing P'], c: ['Where is the bound charge of a uniformly polarised block?', 'Only on its surfaces, where P has a component along the normal.'] }],
    ['The displacement field D', [
      'Split the charge in Gauss’s law into free and bound parts and move the bound part to the left: the field D = ε₀E + P has only the free charge as its source. In a simple (linear, isotropic) dielectric P = ε₀χ_eE, so D = ε₀ε_rE with ε_r = 1 + χ_e.'
    ], { n: 1, e: '\\nabla\\cdot\\mathbf D = \\rho_f,\\qquad \\mathbf D = \\varepsilon_0\\mathbf E + \\mathbf P = \\varepsilon_0\\varepsilon_r\\mathbf E', x: ['Capacitor plates carry free charge 2.0 × 10⁻⁶ C/m², with glass (ε_r = 5.0) between them. Find D, E and P.', ['Gauss for D with a pillbox: D = σ_f = 2.0 × 10⁻⁶ C/m².', 'E = D/(ε₀ε_r) = 2.0 × 10⁻⁶ ÷ (4.4 × 10⁻¹¹) = 4.5 × 10⁴ V/m, a fifth of the field without glass.', 'P = D − ε₀E = 2.0 × 10⁻⁶ − 0.40 × 10⁻⁶ = 1.6 × 10⁻⁶ C/m²: the bound surface charge.'], 'D = 2.0 μC/m²; E = 45 kV/m; P = 1.6 μC/m²'], c: ['Why does a dielectric, at fixed free charge, reduce the field between the plates?', 'Its bound surface charges have the opposite sign to the nearby free charges and partly cancel their field.'] }],
    ['From molecules to ε', [
      'Each molecule responds to the field actually acting on it, not to the average field. For a random or cubic arrangement, Lorentz showed that the local field is E + P/(3ε₀). With polarisability α and N molecules per cubic metre, that gives the **Clausius–Mossotti** relation; for a thin gas it becomes ε_r − 1 ≈ Nα/ε₀.'
    ], { n: 2, e: '\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = \\frac{N\\alpha}{3\\varepsilon_0}', x: ['Helium has α/(4πε₀) = 2.05 × 10⁻³¹ m³. Estimate ε_r − 1 for helium at standard conditions (N = 2.69 × 10²⁵ m⁻³).', ['For a thin gas ε_r − 1 ≈ Nα/ε₀ = 4πN × α/(4πε₀).', '= 4π × 2.69 × 10²⁵ × 2.05 × 10⁻³¹ = 6.9 × 10⁻⁵.', 'The measured value is about 6.5 × 10⁻⁵.'], 'about 7 × 10⁻⁵'], c: ['Why does the field acting on one molecule differ from the average field in a dense material?', 'Its nearby neighbours’ dipoles add their own field; Lorentz’s correction accounts for that.'] }],
    ['Magnetisation and H', [
      'The **magnetisation** M is the magnetic dipole moment per unit volume. It acts like bound currents, J_b = ∇ × M inside and K_b = M × n̂ on surfaces. Defining H = B/μ₀ − M leaves only free currents in Ampère’s law. In a linear material B = μ₀μ_rH, with μ_r = 1 + χ_m.'
    ], { n: 3, e: '\\nabla\\times\\mathbf H = \\mathbf J_f,\\qquad \\mathbf H = \\frac{\\mathbf B}{\\mu_0} - \\mathbf M', x: ['A long solenoid has 1000 turns per metre carrying 0.50 A, with an iron core of μ_r = 1000 (in its linear range). Find H, B and M.', ['Ampère for H depends only on free current: H = nI = 500 A/m, with or without the core.', 'B = μ₀μ_rH = 4π × 10⁻⁷ × 1000 × 500 = 0.63 T (without iron, 0.63 mT).', 'M = (μ_r − 1)H = 5.0 × 10⁵ A/m.'], 'H = 500 A/m; B = 0.63 T; M = 5 × 10⁵ A/m'], c: ['Why can you not use B = μ₀μ_rH with a constant μ_r for iron at strong fields?', 'Iron saturates and shows hysteresis: its response is neither linear nor single-valued.'] }],
    ['At a boundary', [
      'Applying the integral laws to a thin box and a thin loop straddling a boundary gives the jump conditions: with no free charge or current on the surface, the normal part of D and the tangential part of E are continuous. Field lines therefore bend at the surface: tan θ₁/tan θ₂ = ε₁/ε₂.'
    ], { n: 4, e: 'D_{1\\perp} = D_{2\\perp},\\qquad E_{1\\parallel} = E_{2\\parallel},\\qquad \\frac{\\tan\\theta_1}{\\tan\\theta_2} = \\frac{\\varepsilon_1}{\\varepsilon_2}', x: ['A field in air meets glass (ε_r = 5.0) at 30° to the normal. At what angle does it continue inside the glass?', ['tan θ₂ = tan θ₁ × ε₂/ε₁ = tan 30° × 5.0 = 2.89.', 'θ₂ = 71°: the field lines bend away from the normal.'], '71° from the normal'], c: ['Which part of E is continuous across the surface of a dielectric?', 'The tangential part. (It is the normal part of D that is continuous.)'] }],
    ['Limits of the simple model', [
      'ε_r and μ_r summarise a response under particular conditions; they are not fundamental constants. They depend on frequency, temperature and field strength, and some materials respond differently in different directions.'
    ], { n: 5, c: ['Water’s static ε_r is 80, but its refractive index is only 1.33, not √80 = 8.9. Why?', 'At light frequencies the molecules cannot turn fast enough to follow the field; only their electrons respond, giving ε_r ≈ 1.33² = 1.77.'] }]
  ],
  m: [
    ['Treating D as the real field.', 'E is the field that pushes charges; D is bookkeeping for free charge.'],
    ['Taking μ_r of iron as a constant.', 'Ferromagnets saturate and have hysteresis.'],
    ['Leaving out bound charges when using Gauss’s law for E.', 'Either include bound charge, or use D with free charge only.']
  ]
});

WL.gd('y2-em-waves', {
  h: 'Measure the force between two charges and the force between two currents on a laboratory bench, combine the two constants, and out comes 3.00 × 10⁸ m/s, the speed of light. Maxwell’s equations predict waves of electric and magnetic field, and their structure explains polarisation, radiation pressure and why light slows down in glass.',
  s: [
    ['Maxwell’s equations', [
      'Gauss’s law (charges are sources of E), no magnetic monopoles, Faraday’s law (a changing B makes a curling E) and the Ampère–Maxwell law (currents and a changing E make a curling B). Maxwell’s extra term ε₀∂E/∂t keeps Ampère’s law consistent with conservation of charge.'
    ], { n: 0, e: '\\nabla\\cdot\\mathbf E = \\frac{\\rho}{\\varepsilon_0},\\quad \\nabla\\cdot\\mathbf B = 0,\\quad \\nabla\\times\\mathbf E = -\\frac{\\partial\\mathbf B}{\\partial t},\\quad \\nabla\\times\\mathbf B = \\mu_0\\mathbf J + \\mu_0\\varepsilon_0\\frac{\\partial\\mathbf E}{\\partial t}', c: ['Without Maxwell’s extra term, what goes wrong around a charging capacitor?', 'Ampère’s law gives different fields depending on whether your surface is cut by the wire or passes through the gap.'] }],
    ['The wave equation', [
      'In empty space, take the curl of Faraday’s law: ∇×(∇×E) = −∂(∇×B)/∂t = −μ₀ε₀∂²E/∂t². The left side is ∇(∇·E) − ∇²E = −∇²E, since ∇·E = 0. So each component of E obeys the wave equation, and so does B.'
    ], { n: 1, e: '\\nabla^2\\mathbf E = \\mu_0\\varepsilon_0\\frac{\\partial^2\\mathbf E}{\\partial t^2},\\qquad c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = 2.998\\times10^{8}\\ \\text{m/s}', c: ['Which measurements fix μ₀ε₀, and so c?', 'The force between charges (ε₀) and the force between currents (μ₀): no light needed.'] }],
    ['The structure of a plane wave', [
      'For a wave travelling along x, Gauss’s laws force E and B to be at right angles to x: the wave is **transverse**. Faraday’s law then makes B perpendicular to E, in phase with it, and smaller by a factor c. The wave travels along E × B, and the direction of E is its **polarisation**.'
    ], { n: 2, e: '\\mathbf E = E_0\\hat{\\mathbf y}\\cos(kx - \\omega t),\\qquad \\mathbf B = \\frac{E_0}{c}\\hat{\\mathbf z}\\cos(kx - \\omega t),\\qquad \\omega = ck', x: ['A 100 MHz radio wave travels along x with E₀ = 0.10 V/m along y. Find B₀ and its direction, λ and k.', ['B₀ = E₀/c = 0.10 ÷ 3.00 × 10⁸ = 3.3 × 10⁻¹⁰ T.', 'E × B must point along +x, so B is along +z.', 'λ = c/f = 3.0 m and k = 2π/λ = 2.1 rad/m.'], 'B₀ = 0.33 nT along z; λ = 3.0 m; k = 2.1 m⁻¹'], c: ['Can a plane wave in empty space have part of E along its direction of travel?', 'No: ∇·E = 0 forces the field to be transverse.'] }],
    ['Energy, momentum and pressure', [
      'The energy is shared equally between E and B. It flows along the **Poynting vector** S = E × B/μ₀, whose average is the intensity I = ½cε₀E₀². Light also carries momentum, so it presses on surfaces: I/c on an absorbing surface, 2I/c on a mirror.'
    ], { n: 3, e: '\\mathbf S = \\frac{\\mathbf E\\times\\mathbf B}{\\mu_0},\\qquad I = \\tfrac12 c\\varepsilon_0E_0^2,\\qquad p_{\\text{rad}} = \\frac{I}{c}', x: ['A 5.0 mW laser pointer is focused onto a 1.0 mm² spot. Find the intensity, the field amplitude and the force on a black target.', ['I = 5.0 × 10⁻³ ÷ 1.0 × 10⁻⁶ = 5000 W/m².', 'E₀ = √(2I/(cε₀)) = √(10 000 ÷ 2.66 × 10⁻³) = 1.9 × 10³ V/m.', 'F = P/c = 5.0 × 10⁻³ ÷ 3.00 × 10⁸ = 1.7 × 10⁻¹¹ N.'], '5 kW/m²; 1.9 kV/m; 17 pN'], c: ['Why are solar sails made of mirrors rather than black material?', 'Reflection reverses the light’s momentum, doubling the push.'] }],
    ['Waves in matter', [
      'In a material, ε₀ becomes ε₀ε_r (and μ₀ becomes μ₀μ_r), so waves travel at c/n with n = √(ε_rμ_r). The frequency stays the same; the wavelength shrinks by n. And ε_r depends on frequency, so n does too: **dispersion**.'
    ], { n: 4, e: 'v = \\frac{c}{n},\\qquad n = \\sqrt{\\varepsilon_r\\mu_r}', x: ['Light of vacuum wavelength 600 nm enters glass with n = 1.50. Find its speed, frequency and wavelength inside.', ['v = 3.00 × 10⁸ ÷ 1.50 = 2.00 × 10⁸ m/s.', 'f = c/λ = 5.0 × 10¹⁴ Hz, unchanged.', 'λ = v/f = 400 nm.'], '2.0 × 10⁸ m/s; 5.0 × 10¹⁴ Hz; 400 nm'], c: ['Why does a prism split white light into colours?', 'n depends on frequency, so each colour bends by a different amount.'] }]
  ],
  m: [
    ['Putting E and B a quarter-cycle apart in a travelling wave.', 'In a plane travelling wave they are in phase.'],
    ['Writing B₀ = E₀.', 'In SI units B₀ = E₀/c.'],
    ['Saying the frequency changes in a medium.', 'Speed and wavelength change; frequency does not.']
  ]
});

WL.gd('y2-em-relativity', {
  h: 'A charge sitting still beside a wire carrying a current feels no force. Now run alongside the drifting electrons: in your frame the charge is moving, and it feels a magnetic force, yet whether it accelerates cannot depend on who is watching. The resolution is that electric and magnetic fields are two faces of one object, and each observer splits it differently.',
  s: [
    ['Charge and current as a four-vector', [
      'Total charge is the same for every observer, but charge density is not: a moving box of charge is shorter, so its density is γρ₀. Charge density and current density together form a four-vector, J^μ = (cρ, J), and conservation of charge becomes ∂_μJ^μ = 0. The potentials combine the same way: A^μ = (V/c, A).'
    ], { n: 0, e: 'J^\\mu = (c\\rho,\\ \\mathbf J),\\qquad \\partial_\\mu J^\\mu = 0', x: ['A block of charge density ρ₀ (in its own frame) moves at 0.60c. Find ρ and J, and check the invariant.', ['γ = 1.25, so ρ = 1.25ρ₀ and J = ρv = 0.75cρ₀.', '(cρ)² − J² = c²ρ₀²(1.5625 − 0.5625) = c²ρ₀²: the same in every frame.'], 'ρ = 1.25ρ₀; J = 0.75cρ₀'], c: ['Is charge density the same in every frame?', 'No: total charge is invariant, but length contraction changes the density.'] }],
    ['The field tensor', [
      'From the potential four-vector build F^μν = ∂^μA^ν − ∂^νA^μ. It is antisymmetric, so it has six independent components, and they are exactly the three components of E/c and the three of B.'
    ], { n: 1, e: 'F^{\\mu\\nu} = \\begin{pmatrix}0 & -E_x/c & -E_y/c & -E_z/c\\\\ E_x/c & 0 & -B_z & B_y\\\\ E_y/c & B_z & 0 & -B_x\\\\ E_z/c & -B_y & B_x & 0\\end{pmatrix}', c: ['Why does F^μν have exactly six independent components?', 'An antisymmetric 4 × 4 matrix has zeros on the diagonal and 6 independent entries above it: three for E and three for B.'] }],
    ['Maxwell’s equations in two lines', [
      'Gauss’s law and the Ampère–Maxwell law combine into one equation with the four-current as its source. The other pair, no monopoles and Faraday’s law, hold automatically because F is built from a potential.'
    ], { n: 2, e: '\\partial_\\mu F^{\\mu\\nu} = \\mu_0 J^\\nu', c: ['Which of Maxwell’s equations is the ν = 0 component of ∂_μF^μν = μ₀J^ν?', 'Gauss’s law, ∇·E = ρ/ε₀.'] }],
    ['How the fields transform', [
      'Viewed from a frame moving at velocity v, the parts of E and B along v are unchanged, while the parts across v mix together, each with a factor γ.'
    ], { n: 3, e: '\\mathbf E\'_\\perp = \\gamma(\\mathbf E + \\mathbf v\\times\\mathbf B)_\\perp,\\qquad \\mathbf B\'_\\perp = \\gamma\\left(\\mathbf B - \\frac{\\mathbf v\\times\\mathbf E}{c^2}\\right)_\\perp', x: ['In the lab there is only a magnetic field, 1.0 T along z. What does an observer moving at 1000 m/s along x measure?', ['γ ≈ 1, and v × B = 1000 x̂ × 1.0 ẑ = −1000 ŷ V/m.', 'So E′ = −1000 ŷ V/m: an electric field of 1000 V/m appears.', 'A charge at rest in that frame feels qE′, which is the lab’s magnetic force qv × B seen differently.'], 'an electric field of 1000 V/m (and B′ ≈ 1.0 T)'], c: ['A charge rests in the lab beside a magnet and feels no force. Does an observer moving past agree?', 'Yes: in their frame the charge moves through B′, and that magnetic force exactly cancels the force from E′.'] }],
    ['What every observer agrees on', [
      'Two combinations of the fields are the same in every frame: E² − c²B² and E·B. If E·B = 0 and E > cB, there is a frame with no magnetic field; if E < cB, a frame with no electric field. A light wave has both equal to zero, so it looks like light to everyone.'
    ], { n: 4, e: 'E^2 - c^2B^2,\\qquad \\mathbf E\\cdot\\mathbf B', x: ['In the lab E = 3.0 × 10⁶ V/m and B = 0.0050 T, at right angles. Is there a frame with no magnetic field, and how fast does it move?', ['E² − c²B² = 9.0 × 10¹² − 9.0 × 10¹⁶ × 2.5 × 10⁻⁵ = 6.75 × 10¹² > 0, and E·B = 0.', 'So a frame with B′ = 0 exists, moving at v = c²B/E along E × B.', 'v = 9.0 × 10¹⁶ × 0.0050 ÷ 3.0 × 10⁶ = 1.5 × 10⁸ m/s = 0.5c.'], 'yes: at 0.5c along E × B'], c: ['If E·B ≠ 0 in one frame, can any observer see a purely magnetic field?', 'No: E·B is invariant, so E can never vanish.'] }],
    ['Where classical electrodynamics breaks', [
      'The theory is exact for given charges and currents. Trouble starts when a point charge acts on its own field: the field energy of a point charge is infinite, and the self-force equation has unphysical runaway solutions. The scale where this bites is the classical electron radius, e²/(4πε₀m_ec²).'
    ], { n: 5, x: ['Calculate the classical electron radius.', ['r_e = 8.99 × 10⁹ × (1.60 × 10⁻¹⁹)² ÷ (9.11 × 10⁻³¹ × (3.00 × 10⁸)²).', '= 2.30 × 10⁻²⁸ ÷ 8.20 × 10⁻¹⁴ = 2.8 × 10⁻¹⁵ m.'], '2.8 fm'], c: ['Why is a point charge a problem for classical electrodynamics?', 'Its field energy grows without limit as you approach it, and its self-force leads to runaway motion: quantum electrodynamics is needed.'] }]
  ],
  m: [
    ['Transforming E and B separately, like ordinary vectors.', 'They mix: they are parts of one tensor.'],
    ['Forgetting γ on the perpendicular components.', 'Only the parallel components are unchanged.'],
    ['Mixing metric sign conventions.', 'Fix (+, −, −, −) or (−, +, +, +) and stick to it.']
  ]
});

WL.gd('y2-fourier', {
  h: 'Look at a distant street light through a fine umbrella fabric and you see a grid of spots: the Fourier transform of the weave. Far from any opening, the diffracted light is the Fourier transform of the opening. That one fact turns diffraction into Fourier analysis, and explains how lenses form images and why no microscope can see arbitrarily small details.',
  s: [
    ['Wavelets and the far field', [
      'Every point of a wavefront acts as a source of spherical wavelets, and the field further on is their sum, each with the phase of its own path. Far away, in the **Fraunhofer** regime (a²/(λL) ≪ 1 for an opening of size a at distance L), the path difference from a point x across the opening is simply x sin θ.'
    ], { n: 0, x: ['Is a 1.0 mm opening lit by 500 nm light, viewed on a screen 1.0 m away, in the far field?', ['a²/(λL) = (1.0 × 10⁻³)² ÷ (500 × 10⁻⁹ × 1.0) = 2.', 'That is not much less than 1: the pattern is still changing with distance (Fresnel).', 'You would need L of tens of metres, or a lens.'], 'no: a²/(λL) = 2'], c: ['How can you see the far-field pattern of a 1 mm opening on a lab bench?', 'Put a lens after it and look in its focal plane.'] }],
    ['Far field = Fourier transform', [
      'Write k_x = k sin θ. Adding up the wavelets, each weighted by the aperture function A(x), the far-field amplitude is ∫A(x)e^(−ik_x x)dx: the **Fourier transform** of the aperture. The intensity is its squared size. Narrow features of the aperture give wide features in the pattern, with Δx Δk_x ~ 2π.'
    ], { n: 1, e: 'E(\\theta) \\propto \\int A(x)\\,e^{-ikx\\sin\\theta}\\,dx = \\tilde A(k\\sin\\theta)', x: ['Find the far-field pattern of a slit of width a.', ['A(x) = 1 for |x| < a/2, else 0.', '∫ e^(−ik_x x)dx from −a/2 to a/2 = a sin(β)/β, with β = ½ka sin θ.', 'I ∝ (sin β/β)², with zeros where a sin θ = mλ.'], 'I ∝ (sin β/β)², zeros at a sin θ = mλ'], c: ['If the opening is made narrower, what happens to its diffraction pattern?', 'It spreads out: the widths scale inversely.'] }],
    ['Building patterns from standard transforms', [
      'A few transforms build most patterns: a top-hat gives a sinc; a pair of points gives a cosine; a row of points gives a row of points; a Gaussian gives a Gaussian. The **convolution theorem** does the rest: an aperture made by repeating a shape has a pattern equal to the shape’s pattern times the repeat’s pattern.'
    ], { n: 2, e: '\\widetilde{f\\ast g} = \\tilde f\\,\\tilde g', x: ['Two slits, each 0.10 mm wide, have centres 0.50 mm apart. Describe the pattern and find which bright fringes are missing.', ['The aperture is one slit convolved with two points, so the pattern is a sinc² envelope (one slit) times cos² fringes (two points).', 'Fringes: d sin θ = mλ. Envelope zeros: a sin θ = λ, 2λ, …', 'With d/a = 5, the 5th, 10th, … fringes fall on envelope zeros and vanish.'], 'cos² fringes under a sinc² envelope; orders 5, 10, … missing'], c: ['Which fringes are missing if d = 3a?', 'Orders 3, 6, 9, …'] }],
    ['A lens is a Fourier transformer', [
      'A lens brings parallel light, one spatial frequency, to a single point in its back focal plane, so the far-field pattern appears at distance f behind it: spatial frequency ν lands at x = fλν. Masks placed there filter the image: blocking the centre removes the uniform background and brings out edges; blocking the outer spots blurs fine detail.'
    ], { n: 3, e: 'x_f = f\\lambda\\nu', x: ['A grating with 10 lines per mm is lit by 633 nm light and followed by a 200 mm lens. Where are the first-order spots in the focal plane?', ['ν = 10 per mm = 10⁴ m⁻¹.', 'x = fλν = 0.200 × 633 × 10⁻⁹ × 10⁴ = 1.27 × 10⁻³ m.'], '1.3 mm either side of the axis'], c: ['What happens to the image if you block the central spot in the focal plane?', 'The uniform background disappears and edges stand out brightly.'] }],
    ['Abbe’s limit of resolution', [
      'To image a grating of period d, the objective lens must collect at least the zero and first diffraction orders, which leave at sin θ = λ/d. A lens accepting angles up to its **numerical aperture** NA can therefore resolve periods down to about λ/NA (λ/(2NA) with tilted illumination). Resolution is a limit on spatial frequencies, not on how well the glass is polished.'
    ], { n: 4, e: 'd_{\\min} \\approx \\frac{\\lambda}{\\text{NA}}', x: ['What is the finest period an oil-immersion objective with NA = 1.4 can resolve in 500 nm light?', ['d ≈ λ/NA = 500 ÷ 1.4 = 360 nm.', 'With tilted illumination, about half: 180 nm.'], 'about 360 nm (180 nm at best)'], c: ['Why can a more perfectly polished lens not beat Abbe’s limit?', 'The limit comes from which diffraction orders the opening can collect, not from flaws in the glass.'] }]
  ],
  m: [
    ['Using the far-field formulas too close to the opening.', 'Check a²/(λL) ≪ 1, or use a lens.'],
    ['Confusing spatial frequency with ordinary frequency.', 'Spatial frequency is cycles per metre across the object.'],
    ['Blaming resolution on lens quality.', 'Diffraction sets the limit, through the numerical aperture.']
  ]
});
WL.gd('y2-4vectors', {
  h: 'Two observers moving past each other disagree about how far apart two events are, and how much time passes between them. But they agree exactly on one combination, the spacetime interval. Write positions, velocities, energies and frequencies as four-component vectors and relativity becomes geometry: E² = (pc)² + (mc²)² is simply the length of one of those vectors.',
  s: [
    ['The Lorentz transformation and the interval', [
      'For a frame moving at v along x, with γ = 1/√(1 − v²/c²): x′ = γ(x − vt) and t′ = γ(t − vx/c²). The **interval** s² = c²t² − x² − y² − z² comes out the same in every inertial frame. It sorts pairs of events into **timelike** (s² > 0, a slower-than-light signal could link them), **spacelike** (s² < 0) and **lightlike** (s² = 0).'
    ], { n: 0, e: 'x\' = \\gamma(x - vt),\\quad t\' = \\gamma\\left(t - \\frac{vx}{c^2}\\right),\\qquad s^2 = c^2t^2 - |\\mathbf x|^2', x: ['An event is at t = 5.0 μs, x = 600 m. Where and when is it in a frame moving at 0.60c? Check the interval.', ['γ = 1.25 and vt = 0.60 × 3.0 × 10⁸ × 5.0 × 10⁻⁶ = 900 m.', 'x′ = 1.25 × (600 − 900) = −375 m; t′ = 1.25 × (5.0 μs − 0.60 × 600 ÷ 3.0 × 10⁸ s) = 1.25 × 3.8 μs = 4.75 μs.', 'Interval: (1500 m)² − (600 m)² = 1.89 × 10⁶ m²; and (1425 m)² − (375 m)² = 1.89 × 10⁶ m².'], 'x′ = −375 m, t′ = 4.75 μs; same interval'], c: ['Is that pair of events (origin and this one) timelike or spacelike, and why does it matter?', 'Timelike (s² > 0): every observer agrees on which came first, and one could have caused the other.'] }],
    ['Four-vectors', [
      'A **four-vector** A^μ = (A⁰, A) is anything that transforms like (ct, x). Its length A·A = (A⁰)² − |A|² is the same for everyone. The time on a moving clock, its **proper time**, satisfies dτ = dt/γ, and the **four-velocity** U = dx^μ/dτ = γ(c, v) always has U·U = c².'
    ], { n: 1, e: 'U^\\mu = \\gamma(c,\\mathbf v),\\qquad U\\cdot U = c^2', x: ['Find the four-velocity of a particle moving at 0.60c along x, and check its length.', ['γ = 1.25, so U = (1.25c, 0.75c, 0, 0).', 'U·U = (1.25c)² − (0.75c)² = (1.5625 − 0.5625)c² = c².'], 'U = (1.25c, 0.75c); U·U = c²'], c: ['Why is U·U = c² for every particle, whatever its speed?', 'Because proper time is defined by the interval: c²dτ² = c²dt² − dx²; divide by dτ².'] }],
    ['Four-momentum', [
      'Multiply the four-velocity by the mass: P = mU = (E/c, p), with E = γmc² and p = γmv. Its length gives the energy–momentum relation. Conserving the total four-momentum is energy and momentum conservation in one statement that holds in every frame.'
    ], { n: 2, e: 'P\\cdot P = \\frac{E^2}{c^2} - p^2 = m^2c^2', x: ['An electron and a positron collide head-on, each with 45.6 GeV. What mass can they create? What beam energy would a stationary-target experiment need for the same?', ['Head-on: total momentum zero, so Mc² = 91.2 GeV: enough for a Z boson.', 'Fixed target: P·P = 2m²c² + 2Em, which must reach (91.2 GeV/c)².', 'E ≈ 91.2² ÷ (2 × 0.000511) GeV = 8 × 10⁶ GeV.'], '91.2 GeV/c² head-on; about 8 × 10¹⁵ eV on a fixed target'], c: ['If the total four-momentum is conserved in one frame, is it conserved in every frame?', 'Yes: the Lorentz transformation is linear, so equal totals stay equal.'] }],
    ['Rapidity', [
      'Write v/c = tanh φ. Then a boost is a “rotation” by the **rapidity** φ, with γ = cosh φ. Boosts in the same direction simply add rapidities, which gives the velocity-addition formula without algebra.'
    ], { n: 3, e: '\\frac{v}{c} = \\tanh\\phi,\\qquad \\phi_{\\text{total}} = \\phi_1 + \\phi_2', x: ['A rocket launches a probe at 0.5c, which launches another at 0.5c relative to itself, which launches a third at 0.5c. How fast is the last one?', ['φ for 0.5c: atanh(0.5) = 0.549.', 'Three boosts: φ = 3 × 0.549 = 1.648.', 'v = tanh(1.648)c = 0.929c (exactly 13c/14).'], '0.929c, not 1.5c'], c: ['A rocket has constant acceleration as felt on board. Which grows steadily with its own time: its speed or its rapidity?', 'Its rapidity: φ = aτ/c. Its speed creeps towards c.'] }],
    ['The four-wavevector and the Doppler effect', [
      'The phase of a wave, ωt − k·x, is the same for every observer, so K = (ω/c, k) is a four-vector. Transforming it gives the relativistic Doppler effect. Even a source moving across your line of sight is redshifted, by 1/γ: pure time dilation.'
    ], { n: 4, e: 'f = f_0\\sqrt{\\frac{1 - \\beta}{1 + \\beta}}\\quad(\\text{receding})', x: ['A galaxy recedes at 0.60c. By what factor are its wavelengths stretched?', ['f/f₀ = √(0.40 ÷ 1.60) = 0.50.', 'So every wavelength doubles: hydrogen’s 656 nm line appears at 1312 nm.'], 'a factor of 2 (z = 1)'], c: ['A source moves at right angles to your line of sight at 0.60c. Is its light shifted?', 'Yes: redshifted by 1/γ = 0.80, purely from time dilation.'] }]
  ],
  m: [
    ['Mixing the metric sign conventions.', 'Choose (+, −, −, −) or (−, +, +, +) and keep it throughout.'],
    ['Using (c, v) as the four-velocity.', 'It is γ(c, v).'],
    ['Confusing which frequency is the emitted one.', 'f₀ is measured in the source’s own frame.']
  ]
});

WL.gd('y2-boltzmann', {
  h: 'The air thins as you climb a mountain; many chemical reactions roughly double their speed for a 10 K rise; the lines in a star’s spectrum reveal its temperature. Behind all of these is one result: share energy at random among a huge number of particles and the number with energy E falls as e^(−E/kT).',
  s: [
    ['Microstates and macrostates', [
      'A **macrostate** says how many particles are in each energy level; a **microstate** says which particles. The number of microstates for given occupation numbers nᵢ is N!/(n₁!n₂!…). For large N, one macrostate is overwhelmingly more likely than any noticeably different one.'
    ], { n: 0, e: '\\Omega(\\{n_i\\}) = \\frac{N!}{\\prod_i n_i!}', x: ['Toss 100 coins. How much more likely is exactly 50 heads than exactly 60?', ['Ω(50) = 100!/(50! 50!) = 1.01 × 10²⁹.', 'Ω(60) = 100!/(60! 40!) = 1.37 × 10²⁸.', 'Ratio = 7.3. For 10²³ coins, a 10% imbalance would be suppressed by a factor like e^(−10²¹).'], 'about 7 times'], c: ['Why does one macrostate dominate more and more as N grows?', 'The number of arrangements becomes ever more sharply peaked: its relative width shrinks as 1/√N.'] }],
    ['Maximising the number of arrangements', [
      'Find the most probable macrostate: maximise ln Ω (using Stirling’s ln n! ≈ n ln n − n) while keeping the number of particles and the total energy fixed, using two Lagrange multipliers α and β. Setting the derivative to zero for each level gives an exponential.'
    ], { n: 1, e: 'n_j = \\frac{N}{Z}g_je^{-\\beta E_j},\\qquad Z = \\sum_i g_i e^{-\\beta E_i}', c: ['What are the two multipliers for?', 'α keeps the total number of particles fixed; β keeps the total energy fixed.'] }],
    ['What β means', [
      'Put two systems in thermal contact: the combined number of arrangements is largest when their β values are equal, which is exactly what equal temperature means. Comparing with thermodynamics gives β = 1/kT. At room temperature kT ≈ 0.026 eV, the yardstick for every thermal process.'
    ], { n: 2, e: '\\frac{n_2}{n_1} = \\frac{g_2}{g_1}e^{-(E_2 - E_1)/kT}', x: ['In a 2500 K flame, what fraction of sodium atoms are in the first excited level, 2.1 eV up with g₂/g₁ = 3?', ['kT = 8.62 × 10⁻⁵ × 2500 = 0.215 eV.', 'n₂/n₁ = 3 × e^(−2.1/0.215) = 3 × e^(−9.75) = 3 × 5.8 × 10⁻⁵.', '= 1.8 × 10⁻⁴, about 2 in 10 000, yet enough to make the flame glow yellow.'], 'about 2 × 10⁻⁴'], c: ['What is kT at room temperature, in eV?', 'About 0.026 eV, roughly 1/40 eV.'] }],
    ['The partition function does everything', [
      'Z, the sum of the Boltzmann factors of all states, is more than a normalising constant. Its logarithm generates the thermodynamics: the mean energy is −∂ln Z/∂β and the free energy is −kT ln Z.'
    ], { n: 3, e: 'U = -\\frac{\\partial\\ln Z}{\\partial\\beta},\\qquad F = -kT\\ln Z', x: ['A particle has two states, energies 0 and ε. Find its mean energy, and evaluate it when kT = ε.', ['Z = 1 + e^(−βε).', 'U = −∂ln Z/∂β = εe^(−βε)/(1 + e^(−βε)) = ε/(e^(βε) + 1).', 'At kT = ε: U = ε/(e + 1) = 0.27ε.'], 'U = ε/(e^(ε/kT) + 1); 0.27ε'], c: ['As T → ∞, what fraction of such two-state particles are in the upper state?', 'Half: never more, since both states then have equal weight.'] }],
    ['The atmosphere', [
      'A molecule at height h has extra energy mgh, so the density of an isothermal atmosphere falls as e^(−mgh/kT). It drops by a factor e over the **scale height** H = kT/(mg).'
    ], { n: 4, e: 'n(h) \\propto e^{-mgh/kT},\\qquad H = \\frac{kT}{mg}', x: ['Find the scale height of air (average molecular mass 29 u = 4.8 × 10⁻²⁶ kg) at 290 K, and the pressure at 3.0 km as a fraction of sea level.', ['H = 1.38 × 10⁻²³ × 290 ÷ (4.8 × 10⁻²⁶ × 9.81) = 8.5 × 10³ m.', 'At 3.0 km: e^(−3.0/8.5) = 0.70.'], 'H ≈ 8.5 km; about 70% of sea-level pressure'], c: ['Above about 100 km, where gases stop mixing, why does helium become relatively more common with height?', 'Each gas then has its own scale height kT/(mg), and light helium’s is much larger.'] }],
    ['Where it stops applying', [
      'The derivation treats particles as distinguishable and assumes most levels are nearly empty. When the **thermal de Broglie wavelength** λ_th = h/√(2πmkT) becomes comparable with the spacing between particles (nλ³ ≳ 1), quantum statistics take over: Fermi–Dirac for electrons in metals, Bose–Einstein for photons and helium-4.'
    ], { n: 5, e: '\\lambda_{\\text{th}} = \\frac{h}{\\sqrt{2\\pi mkT}}', x: ['Are the free electrons in copper (n = 8.5 × 10²⁸ m⁻³) at 300 K classical?', ['λ_th = 6.63 × 10⁻³⁴ ÷ √(2π × 9.11 × 10⁻³¹ × 1.38 × 10⁻²³ × 300) = 4.3 × 10⁻⁹ m.', 'nλ³ = 8.5 × 10²⁸ × (4.3 × 10⁻⁹)³ = 6.8 × 10³.', 'That is far above 1: they are strongly quantum and need Fermi–Dirac statistics.'], 'no: nλ³ ≈ 7000'], c: ['Is nitrogen gas at room temperature and pressure classical?', 'Yes: λ_th ≈ 0.019 nm and n ≈ 2.4 × 10²⁵ m⁻³ give nλ³ ≈ 10⁻⁷, far below 1.'] }]
  ],
  m: [
    ['Forgetting the degeneracy g of a level.', 'Count how many states share each energy.'],
    ['Mixing units in E/kT.', 'Put E and kT in the same units (eV with 8.62 × 10⁻⁵ eV/K, or J).'],
    ['Using Boltzmann statistics for electrons in metals.', 'Check nλ³; if it is not small, use quantum statistics.']
  ]
});

WL.gd('y2-partition', {
  h: 'Statistical mechanics has a remarkable shortcut: write down one function, the partition function Z = Σe^(−E/kT), and every thermodynamic property follows by differentiating its logarithm. This topic explains why the Boltzmann factor appears, how to use Z, and why classical physics gets heat capacities wrong at low temperature.',
  s: [
    ['Three ensembles', [
      'The right probabilities for microstates depend on what the system can exchange with its surroundings. Isolated (fixed energy, particle number and volume): the **microcanonical** ensemble, all accessible states equally likely. Exchanging energy with a reservoir at temperature T: the **canonical** ensemble. Exchanging energy and particles: the **grand canonical** ensemble, at fixed T and chemical potential μ.'
    ], { n: 0, c: ['A cup of coffee with a tight lid sits on a table. Which ensemble describes it, and what if the lid is removed?', 'With the lid it exchanges energy only: canonical. Without it, molecules evaporate too: grand canonical.'] }],
    ['Why e^(−E/kT)', [
      'Let a small system share energy with a large reservoir. The probability of one particular system state of energy E is proportional to how many states the reservoir has left, e^(S_R/k). Expanding the reservoir’s entropy, S_R(E_tot − E) ≈ S_R(E_tot) − E/T, so the probability is proportional to e^(−E/kT).'
    ], { n: 1, e: 'P_i = \\frac{e^{-\\beta E_i}}{Z},\\qquad Z = \\sum_i e^{-\\beta E_i},\\qquad \\beta = \\frac{1}{kT}', c: ['Why must the reservoir be large?', 'So that taking energy E from it barely changes its temperature, and the first-order expansion is accurate.'] }],
    ['Everything from ln Z', [
      'Differentiating ln Z with respect to β gives the mean energy; F = −kT ln Z gives the free energy, and from it entropy and pressure. Differentiating again gives the size of the energy fluctuations: ⟨ΔE²⟩ = kT²C_V.'
    ], { n: 2, e: 'U = -\\frac{\\partial\\ln Z}{\\partial\\beta},\\quad F = -kT\\ln Z,\\quad \\langle(\\Delta E)^2\\rangle = kT^2C_V', x: ['How big are the energy fluctuations of 1 mol of monatomic gas at 300 K, compared with its energy?', ['C_V = 1.5R = 12.5 J/K and U = 1.5RT = 3740 J.', 'ΔE_rms = √(kT²C_V) = √(1.38 × 10⁻²³ × 300² × 12.5) = 3.9 × 10⁻⁹ J.', 'Relative size: 3.9 × 10⁻⁹ ÷ 3740 = 10⁻¹², about 1/√N.'], 'about one part in 10¹²'], c: ['Why do the different ensembles give the same thermodynamics for large systems?', 'Fluctuations are only about 1/√N of the averages, so fixing E or fixing T makes no visible difference.'] }],
    ['Equipartition, and where it fails', [
      'Classically, every squared term in the energy (½mv², ½kx², ½Iω²) contributes ½kT. A diatomic gas would then have C_V = 7R/2 at all temperatures. Hydrogen actually has 3R/2 at a few tens of kelvin, 5R/2 near room temperature, and approaches 7R/2 only at thousands of kelvin. Quantised levels **freeze out** whenever their spacing is much larger than kT.'
    ], { n: 3, x: ['Hydrogen’s rotational levels are spaced on a scale of about 85 K and its vibration on about 6300 K. Predict C_V at 300 K.', ['Translation: 3 squared terms, 3R/2, always.', 'Rotation: 300 K ≫ 85 K, so its 2 terms are active: +R.', 'Vibration: 300 K ≪ 6300 K, so it is frozen out.'], 'C_V ≈ 5R/2'], c: ['Why does vibration not add to hydrogen’s heat capacity at room temperature?', 'Its level spacing is far larger than kT, so almost no molecules are excited out of the ground vibrational state.'] }],
    ['Model systems', [
      'Four models cover most problems: the two-level system, the harmonic oscillator, the rotor and the ideal gas. Einstein modelled a solid as 3N quantum oscillators of one frequency, giving C = 3Nk x²eˣ/(eˣ − 1)² with x = θ_E/T, which falls to zero at low T and reaches 3Nk at high T.'
    ], { n: 4, e: 'C = 3Nk\\,\\frac{x^2e^x}{(e^x - 1)^2},\\qquad x = \\frac{\\theta_E}{T}', x: ['Diamond has an Einstein temperature of about 1320 K. Estimate its molar heat capacity at 300 K.', ['x = 1320 ÷ 300 = 4.4, and e⁴·⁴ = 81.5.', 'x²eˣ/(eˣ − 1)² = 19.4 × 81.5 ÷ 80.5² = 0.24.', 'C = 0.24 × 3R = 6.1 J mol⁻¹ K⁻¹; the measured value is about 6.1.'], 'about 6 J mol⁻¹ K⁻¹, a quarter of 3R'], c: ['What does the Einstein model give at high temperature?', '3R per mole: the classical Dulong–Petit value.'] }],
    ['The grand canonical ensemble', [
      'When particles are exchanged too, a state with N particles and energy E has probability e^(−β(E − μN))/Ξ. The grand potential −kT ln Ξ equals −pV. For an ideal gas, the number of particles in a fixed small volume fluctuates with ⟨ΔN²⟩ = ⟨N⟩. Applied to single-particle states, this ensemble gives the Fermi–Dirac and Bose–Einstein distributions directly.'
    ], { n: 5, e: '\\Xi = \\sum_{N,i} e^{-\\beta(E_i-\\mu N)},\\qquad \\Phi_G = -kT\\ln\\Xi = -pV', x: ['A cube of air 1 μm on each side holds about 2.5 × 10⁷ molecules. How much does that number fluctuate?', ['For an ideal gas ⟨ΔN²⟩ = ⟨N⟩, so ΔN = √(2.5 × 10⁷) = 5000.', 'Relative fluctuation = 5000 ÷ 2.5 × 10⁷ = 2 × 10⁻⁴.'], 'about 5000, or 0.02%'], c: ['Why do the Fermi–Dirac and Bose–Einstein distributions come most naturally from the grand ensemble?', 'Treat each single-particle state as a system that exchanges particles with the rest: its occupation is 0 or 1 for fermions, any whole number for bosons.'] }]
  ],
  m: [
    ['Forgetting degeneracies in Z.', 'Sum over states, not over energy levels, or include g.'],
    ['Using equipartition when kT is below the level spacing.', 'Those degrees of freedom are frozen out.'],
    ['Using the canonical ensemble when particles are exchanged.', 'Use the grand canonical ensemble.']
  ]
});

WL.gd('y2-blackbody', {
  h: 'The red glow of a stove ring, the colour of the Sun and the faint 2.725 K microwave glow left over from the early Universe all follow one curve. Classical physics predicted infinite energy for it; Planck’s guess that energy comes in lumps of hν fixed it in 1900, and that was the first equation of quantum physics.',
  s: [
    ['Counting modes', [
      'In a box of side L, standing electromagnetic waves need k = (π/L)(n_x, n_y, n_z) with positive whole numbers. Counting the points in one octant of a sphere in n-space, and doubling for the two polarisations, gives the number of modes per unit volume per unit frequency: g(ν) = 8πν²/c³.'
    ], { n: 0, e: 'g(\\nu)\\,d\\nu = \\frac{8\\pi\\nu^2}{c^3}\\,d\\nu', x: ['How many modes per cubic metre lie between 500 THz and 501 THz (green light)?', ['g(ν)Δν = 8π × (5.0 × 10¹⁴)² ÷ (3.0 × 10⁸)³ × 1.0 × 10¹².', '= 8π × 9260 × 10¹² = 2.3 × 10¹⁷.'], 'about 2 × 10¹⁷ modes per m³'], c: ['Why does the number of modes grow as ν²?', 'The number of modes up to wavenumber k grows like the volume of a sphere, k³, so the number per unit k grows as k².'] }],
    ['The ultraviolet catastrophe', [
      'Classical physics gives each mode an average energy kT. Multiplying by g(ν) gives the Rayleigh–Jeans law, u = (8πν²/c³)kT. It fits long wavelengths, but at high frequency there are ever more modes, so the total energy is infinite.'
    ], { n: 1, e: 'u_{\\text{RJ}}(\\nu) = \\frac{8\\pi\\nu^2}{c^3}\\,kT', c: ['At which end of the spectrum does the Rayleigh–Jeans law work?', 'At low frequencies, where hν ≪ kT.'] }],
    ['Planck’s distribution', [
      'If a mode of frequency ν can only hold energies nhν, its average energy is hν/(e^(hν/kT) − 1) instead of kT: high-frequency modes are frozen. In photon language, each mode holds on average n̄ = 1/(e^(hν/kT) − 1) photons.'
    ], { n: 2, e: 'u(\\nu,T) = \\frac{8\\pi h\\nu^3}{c^3}\\,\\frac{1}{e^{h\\nu/kT}-1}', x: ['How many photons, on average, occupy a mode of green light (500 THz) at the Sun’s surface (5800 K), and at room temperature?', ['Sun: hν/kT = 6.63 × 10⁻³⁴ × 5.0 × 10¹⁴ ÷ (1.38 × 10⁻²³ × 5800) = 4.1, so n̄ = 1/(e⁴·¹ − 1) = 0.016.', 'Room (300 K): hν/kT = 80, so n̄ ≈ e⁻⁸⁰ ≈ 10⁻³⁵.'], 'about 0.02 at the Sun; essentially zero at room temperature'], c: ['Why is there no chemical potential for photons in a cavity?', 'Photon number is not conserved: the walls create and absorb photons freely.'] }],
    ['Wien’s law and Stefan–Boltzmann', [
      'With x = hν/kT the spectrum has one universal shape, scaled by T. Per unit frequency it peaks at x = 2.821; per unit wavelength it peaks at λ_max T = 2.898 mm K. Integrating over all frequencies gives the power per unit area σT⁴.'
    ], { n: 3, e: '\\lambda_{\\max}T = 2.898\\ \\text{mm K},\\qquad M = \\sigma T^4', x: ['The Sun’s surface is at 5772 K. Find its peak wavelength, its peak frequency, and the power from each square metre.', ['λ_max = 2.898 × 10⁻³ ÷ 5772 = 502 nm.', 'ν_peak = 2.821kT/h = 3.4 × 10¹⁴ Hz, which corresponds to 885 nm: a different point of the same spectrum.', 'M = 5.67 × 10⁻⁸ × 5772⁴ = 6.3 × 10⁷ W/m².'], '502 nm; 3.4 × 10¹⁴ Hz; 63 MW/m²'], c: ['Why do the wavelength peak and the frequency peak not match?', 'Equal steps in ν are not equal steps in λ (dν ∝ dλ/λ²), so the two ways of plotting weight the spectrum differently.'] }],
    ['A gas of photons', [
      'Radiation in a cavity behaves as a gas with simple laws: energy density u = aT⁴ (a = 4σ/c), pressure p = u/3, photon number ∝ T³, and entropy ∝ VT³.'
    ], { n: 4, e: 'u = aT^4,\\qquad p = \\frac{u}{3}', x: ['Estimate the radiation pressure in the Sun’s core, at 1.5 × 10⁷ K.', ['a = 4σ/c = 7.6 × 10⁻¹⁶ J m⁻³ K⁻⁴.', 'u = 7.6 × 10⁻¹⁶ × (1.5 × 10⁷)⁴ = 3.8 × 10¹³ J/m³.', 'p = u/3 = 1.3 × 10¹³ Pa: small next to the gas pressure there (about 10¹⁶ Pa), but dominant in very massive stars.'], 'about 10¹³ Pa'], c: ['A cavity full of radiation doubles its volume slowly without exchanging heat. What happens to its temperature?', 'Entropy ∝ VT³ stays fixed, so T falls by 2^(1/3), to 0.79 of its value.'] }],
    ['The cosmic microwave background', [
      'The Universe is filled with radiation at 2.725 K: about 411 photons per cubic centimetre, peaking near 160 GHz. COBE’s FIRAS instrument found its spectrum to be Planckian to within about 50 parts per million of the peak: the most perfect black body known.'
    ], { n: 5, x: ['Check the peak frequency and the photon density of the 2.725 K background. (n = 16πζ(3)(kT/hc)³ with ζ(3) = 1.202)', ['ν_peak = 2.821 × 1.38 × 10⁻²³ × 2.725 ÷ 6.63 × 10⁻³⁴ = 1.6 × 10¹¹ Hz.', 'kT/(hc) = 3.76 × 10⁻²³ ÷ 1.99 × 10⁻²⁵ = 189 m⁻¹.', 'n = 16π × 1.202 × 189³ = 4.1 × 10⁸ m⁻³, about 410 per cm³.'], '160 GHz; about 410 photons per cm³'], c: ['The background was released when the Universe was about 3000 K. By what factor has the Universe expanded since then?', 'T falls in proportion to the expansion, so 3000 ÷ 2.725 ≈ 1100.'] }]
  ],
  m: [
    ['Mixing the per-frequency and per-wavelength peaks.', 'Wien’s λ_max T = 2.898 mm K is for the wavelength spectrum only.'],
    ['Giving every mode kT.', 'High-frequency modes are frozen out: use Planck’s mean energy.'],
    ['Forgetting the two polarisations.', 'They give the factor 8π rather than 4π.']
  ]
});

WL.gd('y2-schrodinger', {
  h: 'Quantum mechanics gives up the idea of a path. Instead, a particle is described by a complex wavefunction ψ(x, t), which changes in time according to one linear equation, and |ψ|² tells you where you are likely to find it. Normalisation, stationary states, probability currents and spreading wave packets all follow from those two statements.',
  s: [
    ['The equation', [
      'For a particle of mass m in a potential V(x), the Schrödinger equation is first order in time and second order in space. It is not derived: it is the simplest equation that gives E = ħω and p = ħk for plane waves together with E = p²/2m + V. It is **linear**, so any sum of solutions is a solution: the root of interference.'
    ], { n: 0, e: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2} + V(x)\\,\\psi', x: ['Show that a free plane wave ψ = Ae^(i(kx − ωt)) solves the equation only if ħω = ħ²k²/2m.', ['iħ∂ψ/∂t = iħ(−iω)ψ = ħωψ.', '−(ħ²/2m)∂²ψ/∂x² = −(ħ²/2m)(ik)²ψ = (ħ²k²/2m)ψ.', 'So it works if and only if ħω = ħ²k²/2m, which is E = p²/2m.'], 'ħω = ħ²k²/2m'], c: ['Why must the Schrödinger equation be linear?', 'So that superpositions are solutions too, which is what produces interference.'] }],
    ['The Born rule', [
      'The probability of finding the particle between x and x + dx is |ψ|² dx. So ψ must be **normalised**: ∫|ψ|² dx = 1. Multiplying ψ by an overall phase e^(iα) changes nothing measurable, but relative phases between parts of a superposition do matter.'
    ], { n: 1, e: '\\int_{-\\infty}^{\\infty}|\\psi|^2\\,dx = 1', x: ['Normalise ψ = Ae^(−|x|/a), and find the probability of finding the particle within |x| < a.', ['∫|ψ|² dx = A² × 2 ∫₀^∞ e^(−2x/a) dx = A²a, so A = 1/√a.', 'P(|x| < a) = (2/a) ∫₀^a e^(−2x/a) dx = 1 − e⁻² = 0.86.'], 'A = 1/√a; 86%'], c: ['Does multiplying ψ by e^(iα) change any prediction?', 'No: |ψ|² and every expectation value are unchanged.'] }],
    ['Probability is conserved', [
      'Differentiate |ψ|² in time and use the equation: the density obeys a continuity equation with a **probability current** j, so the total probability stays 1, provided V is real. For a plane wave, j = |A|²ħk/m: density times velocity.'
    ], { n: 2, e: '\\frac{\\partial |\\psi|^2}{\\partial t} + \\frac{\\partial j}{\\partial x} = 0,\\qquad j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\frac{\\partial\\psi}{\\partial x} - \\psi\\frac{\\partial\\psi^*}{\\partial x}\\right)', x: ['An electron beam is ψ = Ae^(ikx) with k = 1.0 × 10¹⁰ m⁻¹ and |A|² = 1.0 × 10⁶ per metre. Find the particle flux.', ['v = ħk/m = 1.055 × 10⁻³⁴ × 1.0 × 10¹⁰ ÷ 9.11 × 10⁻³¹ = 1.16 × 10⁶ m/s.', 'j = |A|²v = 1.0 × 10⁶ × 1.16 × 10⁶ = 1.2 × 10¹² per second.'], '1.2 × 10¹² electrons per second'], c: ['Why must V be real for probability to be conserved?', 'An imaginary part would make the total probability grow or shrink (it can model absorption).'] }],
    ['Stationary states', [
      'Try ψ = φ(x)e^(−iEt/ħ): the equation becomes Ĥφ = Eφ, the time-independent equation. In such a state |ψ|² and every expectation value are constant; only the phase turns. The general solution is a sum of stationary states, and visible motion comes only from the cross terms between different energies, oscillating at (E_m − E_n)/ħ.'
    ], { n: 3, e: '\\Psi(x,t) = \\sum_n c_n\\,\\phi_n(x)\\,e^{-iE_nt/\\hbar}', x: ['An electron in a 1.0 nm infinite well is in an equal mix of its two lowest states. At what frequency does its probability density slosh back and forth?', ['E₁ = h²/(8mL²) = (6.63 × 10⁻³⁴)² ÷ (8 × 9.11 × 10⁻³¹ × 10⁻¹⁸) = 6.0 × 10⁻²⁰ J (0.38 eV), and E₂ = 4E₁.', 'E₂ − E₁ = 3E₁ = 1.8 × 10⁻¹⁹ J.', 'f = ΔE/h = 2.7 × 10¹⁴ Hz.'], '2.7 × 10¹⁴ Hz'], c: ['In a single stationary state, does anything measurable change with time?', 'No: only the overall phase rotates.'] }],
    ['Expectation values and momentum', [
      'The average position is ⟨x⟩ = ∫ψ*xψ dx. Momentum acts as the operator −iħ∂/∂x, so ⟨p⟩ = ∫ψ*(−iħ∂ψ/∂x)dx. A real ψ has ⟨p⟩ = 0; multiplying it by e^(ik₀x) gives ⟨p⟩ = ħk₀. A gradient of phase is momentum.'
    ], { n: 4, e: '\\langle p\\rangle = \\int \\psi^*\\left(-i\\hbar\\frac{\\partial}{\\partial x}\\right)\\psi\\,dx', x: ['An electron’s wavefunction is a real bump times e^(ik₀x), with k₀ = 5.0 × 10⁹ m⁻¹. Find ⟨p⟩ and its average velocity.', ['⟨p⟩ = ħk₀ = 1.055 × 10⁻³⁴ × 5.0 × 10⁹ = 5.3 × 10⁻²⁵ kg m/s.', '⟨v⟩ = ⟨p⟩/m = 5.8 × 10⁵ m/s.'], '5.3 × 10⁻²⁵ kg m/s; 5.8 × 10⁵ m/s'], c: ['What is ⟨p⟩ for a real wavefunction?', 'Zero.'] }],
    ['Wave packets spread', [
      'A real particle is a **wave packet**, a mix of momenta. Because ω = ħk²/2m is not proportional to k, the parts travel at different speeds and the packet spreads. A Gaussian of starting width σ₀ grows as shown; heavier and wider packets spread far more slowly.'
    ], { n: 5, e: '\\sigma(t) = \\sigma_0\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2}', x: ['A C₆₀ molecule (mass 1.2 × 10⁻²⁴ kg) is localised to σ₀ = 1.0 nm. How long until its width doubles?', ['Doubling needs ħt/(2mσ₀²) = √3.', 't = √3 × 2 × 1.2 × 10⁻²⁴ × (1.0 × 10⁻⁹)² ÷ 1.055 × 10⁻³⁴.', 't = 3.9 × 10⁻⁸ s: about 40 ns, against 3 × 10⁻¹⁴ s for an electron.'], 'about 40 ns'], c: ['Why does a free wave packet spread at all?', 'Its different momentum parts travel at different speeds, because ω is not proportional to k.'] }]
  ],
  m: [
    ['Picturing |ψ|² as the particle smeared out.', 'It is a probability density; each detection finds the whole particle at one place.'],
    ['Forgetting to normalise.', 'Probabilities need ∫|ψ|² dx = 1.'],
    ['Thinking a stationary state has no motion at all.', 'Its density is constant, but it still has kinetic energy and momentum spread.']
  ]
});
WL.gd('y2-infinite-well', {
  h: 'Tiny crystals called quantum dots, all made of the same material, glow red, green or blue depending only on their size. Trap a quantum particle between two walls and its wave must fit a whole number of half-wavelengths into the space, so only certain energies are allowed, and squeezing the box pushes them up. This simplest quantum system already explains that, and why atoms cannot collapse.',
  s: [
    ['Setting up the problem', [
      'Inside the box (0 < x < L) the potential is zero, so the time-independent Schrödinger equation is just ψ″ = −k²ψ, with k = √(2mE)/ħ. Outside, the potential is infinite, so ψ must be zero there, and because ψ is continuous, ψ(0) = ψ(L) = 0.'
    ], { n: 0, e: '-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi,\\qquad \\psi(0) = \\psi(L) = 0', c: ['Why must ψ be zero at the walls?', 'It is zero outside, where the potential is infinite, and ψ must be continuous.'] }],
    ['Quantisation', [
      'The general solution A sin kx + B cos kx must vanish at x = 0, so B = 0, and at x = L, so sin kL = 0: k = nπ/L. So the allowed energies are discrete and grow as n². n = 0 would give ψ = 0 everywhere, no particle at all, so the lowest energy is E₁, not zero.'
    ], { n: 1, e: 'E_n = \\frac{n^2h^2}{8mL^2},\\qquad n = 1, 2, 3,\\dots', x: ['An electron is confined to a 1.0 nm box. Find its first three energies and the wavelength of the photon emitted when it drops from n = 2 to n = 1.', ['E₁ = (6.63 × 10⁻³⁴)² ÷ (8 × 9.11 × 10⁻³¹ × (1.0 × 10⁻⁹)²) = 6.0 × 10⁻²⁰ J = 0.38 eV.', 'E₂ = 4E₁ = 1.50 eV; E₃ = 9E₁ = 3.38 eV.', 'ΔE = 3E₁ = 1.13 eV, so λ = 1240 ÷ 1.13 = 1100 nm, in the infrared.'], '0.38, 1.50, 3.38 eV; 1100 nm'], c: ['Why is n = 0 not allowed?', 'It gives ψ = 0 everywhere: there would be no particle.'] }],
    ['The wavefunctions', [
      'Normalising gives ψ_n = √(2/L) sin(nπx/L). The nth state has n − 1 nodes inside the box. Different states are orthogonal, and any wavefunction in the box can be written as a sum of them (a Fourier sine series).'
    ], { n: 2, e: '\\psi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\frac{n\\pi x}{L}', x: ['In the ground state, what is the probability of finding the particle in the middle third of the box?', ['P = (2/L) ∫ sin²(πx/L) dx from L/3 to 2L/3.', 'Using sin² = ½(1 − cos 2θ): P = 1/3 + √3/(2π).', 'P = 0.333 + 0.276 = 0.61, against 1/3 for a classical particle bouncing evenly.'], 'about 61%'], c: ['How many nodes inside the box does ψ₃ have?', 'Two.'] }],
    ['Zero-point energy', [
      'Confining a particle to a width L means Δx ~ L, so Δp ≳ ħ/L, and its kinetic energy cannot be zero. The ground-state energy is the price of confinement, and it grows as 1/L² as the box shrinks.'
    ], { n: 3, x: ['Estimate the ground-state energy of a neutron confined in a nucleus, L ≈ 10 fm. (m_n = 1.675 × 10⁻²⁷ kg)', ['E₁ = h²/(8mL²) = (6.63 × 10⁻³⁴)² ÷ (8 × 1.675 × 10⁻²⁷ × (1.0 × 10⁻¹⁴)²).', '= 3.3 × 10⁻¹³ J = 2.0 MeV.', 'Millions of electronvolts: the energy scale of nuclear physics.'], 'about 2 MeV'], c: ['If the box is made half as wide, what happens to E₁?', 'It becomes four times larger.'] }],
    ['Time evolution', [
      'Each energy state simply turns its phase as e^(−iE_nt/ħ), so a single state has an unchanging probability density. A mixture of two states beats: its density sloshes back and forth at (E₂ − E₁)/h, the frequency of the light that transition emits.'
    ], { n: 4, c: ['An electron in a box is in a mix of the n = 1 and n = 3 states. At what frequency does its density oscillate, in terms of E₁?', '(9E₁ − E₁)/h = 8E₁/h.'] }],
    ['Real boxes', [
      'Real boxes have finite walls, so the wave leaks a little into them and the energies are slightly lower. Electrons in long dye molecules and in semiconductor **quantum dots** behave approximately like this; in a solid, the electron’s **effective mass** replaces its free mass.'
    ], { n: 5, x: ['In CdSe the electron’s effective mass is about 0.13 m_e. Estimate its confinement energy in a 3.0 nm and a 6.0 nm dot (treating each as a 1D box).', ['Scale the 1 nm result: E₁ = 0.38 eV × (1/0.13) × (1/L²) with L in nm.', '3.0 nm: 0.38 ÷ (0.13 × 9) = 0.32 eV. 6.0 nm: 0.38 ÷ (0.13 × 36) = 0.08 eV.', 'The smaller dot adds about 0.24 eV more to its light’s energy: it glows bluer.'], '0.32 eV and 0.08 eV'], c: ['Why are a real well’s energies a little lower than the infinite-well formula gives?', 'The wavefunction leaks into the walls, so the particle is effectively in a slightly wider box.'] }]
  ],
  m: [
    ['Allowing n = 0.', 'The lowest state is n = 1, with non-zero energy.'],
    ['Mixing h and ħ in the energy formula.', 'n²h²/(8mL²) and n²π²ħ²/(2mL²) are the same thing.'],
    ['Using the free electron mass inside a solid.', 'Use the material’s effective mass.']
  ]
});

WL.gd('y2-step-barrier', {
  h: 'A ball rolling towards a slope it cannot climb always rolls back, and one with enough energy always goes over. A quantum wave does both: part of it reflects even when it has energy to spare, and part leaks into regions where it has too little. That leakage lets electrons cross thin insulators, makes scanning tunnelling microscopes work, and lets the Sun fuse hydrogen.',
  s: [
    ['Matching at a boundary', [
      'Where the potential is constant, solutions are waves e^(±ikx) with ħk = √(2m(E − V)) when E > V, and growing or decaying exponentials e^(±κx) with ħκ = √(2m(V − E)) when E < V. Where V jumps by a finite amount, both ψ and dψ/dx must be continuous. Matching them at each boundary is the whole technique.'
    ], { n: 0, c: ['At an infinitely high wall, why may ψ′ jump?', 'Integrating the equation across the boundary involves V times ψ; with V infinite that integral need not vanish, so only ψ itself must be continuous.'] }],
    ['A step it can climb', [
      'Send a wave e^(ik₁x) at a step of height V₀ < E. Part reflects and part goes on, with k₂ < k₁. Matching ψ and ψ′ gives the amplitudes; the probabilities come from the currents, which include the speed on each side.'
    ], { n: 1, e: 'R = \\left(\\frac{k_1-k_2}{k_1+k_2}\\right)^2,\\qquad T = \\frac{4k_1k_2}{(k_1+k_2)^2}', x: ['5.0 eV electrons meet a 4.0 eV step. What fraction reflects?', ['k ∝ √(E − V), so k₂/k₁ = √(1.0 ÷ 5.0) = 0.447.', 'R = ((1 − 0.447) ÷ (1 + 0.447))² = 0.382² = 0.15.', 'So 15% reflect and 85% pass, though every electron had enough energy.'], 'about 15%'], c: ['What would classical physics predict for R?', 'Zero: with enough energy, every particle goes over.'] }],
    ['A step it cannot climb: leaking in', [
      'If E < V₀, the wave beyond the step is e^(−κx): everything is eventually reflected, but the wave reaches a distance of about 1/κ into the forbidden region. If the barrier is thin compared with 1/κ, some of the wave gets through: **tunnelling**.'
    ], { n: 2, e: '\\frac1\\kappa = \\frac{\\hbar}{\\sqrt{2m(V_0-E)}}', x: ['How far does an electron 1.0 eV below the top of a step reach into it? And a proton?', ['Electron: 1/κ = 1.055 × 10⁻³⁴ ÷ √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹) = 2.0 × 10⁻¹⁰ m, about an atom’s width.', 'Proton: 1/κ ∝ 1/√m, so it is √1836 = 43 times shorter: 4.6 × 10⁻¹² m.'], '0.20 nm for the electron; 0.005 nm for the proton'], c: ['Why do heavy particles tunnel so much less than electrons?', 'κ grows as √m, and the chance of crossing a barrier falls roughly as e^(−2κd): exponentially.'] }],
    ['The delta-function well', [
      'V = −αδ(x) is the limit of a very deep, very narrow well. Integrating the equation across x = 0 makes ψ′ jump by −(2mα/ħ²)ψ(0). It has exactly one bound state, ψ ∝ e^(−κ|x|) with κ = mα/ħ². Turned into a barrier (+αδ), it lets through a fraction T = 1/(1 + |E₀|/E), where E₀ is the well’s bound-state energy.'
    ], { n: 3, e: 'E_0 = -\\frac{m\\alpha^2}{2\\hbar^2},\\qquad T(E) = \\frac{1}{1 + m\\alpha^2/(2\\hbar^2E)}', x: ['For an electron with α = 1.0 eV nm, find the bound-state energy, and the transmission through the matching barrier at E = 6.5 eV and at 1.0 eV.', ['α = 1.6 × 10⁻²⁸ J m, so E₀ = −9.11 × 10⁻³¹ × (1.6 × 10⁻²⁸)² ÷ (2 × (1.055 × 10⁻³⁴)²) = −1.05 × 10⁻¹⁸ J = −6.5 eV.', 'At 6.5 eV: T = 1/(1 + 6.5/6.5) = 0.50.', 'At 1.0 eV: T = 1/(1 + 6.5) = 0.13.'], 'E₀ = −6.5 eV; T = 0.50 and 0.13'], c: ['How many bound states does a delta-function well have?', 'Exactly one.'] }],
    ['The finite square well', [
      'For a well of depth V₀ and width 2a, the wave is a cosine or sine inside and a decaying exponential outside. Matching gives equations solved graphically, in terms of z₀ = a√(2mV₀)/ħ. The number of bound states is the whole number just above 2z₀/π, and in one dimension there is always at least one, however shallow the well.'
    ], { n: 4, e: 'z_0 = \\frac{a\\sqrt{2mV_0}}{\\hbar},\\qquad N = \\left\\lceil\\frac{2z_0}{\\pi}\\right\\rceil', x: ['How many bound states does an electron have in a well 10 eV deep and 0.40 nm wide?', ['a = 0.20 nm; √(2mV₀) = √(2 × 9.11 × 10⁻³¹ × 1.6 × 10⁻¹⁸) = 1.71 × 10⁻²⁴ kg m/s.', 'z₀ = 0.20 × 10⁻⁹ × 1.71 × 10⁻²⁴ ÷ 1.055 × 10⁻³⁴ = 3.24.', '2z₀/π = 2.06, so there are 3 bound states.'], 'three'], c: ['Does every attractive well in one dimension have a bound state?', 'Yes: at least one even state, however shallow or narrow.'] }],
    ['Three dimensions are different', [
      'For a spherical well with no angular momentum, u = rR(r) obeys the same one-dimensional equation, but with u(0) = 0. Only the odd-type solutions survive, so binding needs z₀ > π/2: V₀R² > π²ħ²/(8μ). A 3D well can be too shallow to hold anything.'
    ], { n: 5, e: 'V_0R^2 > \\frac{\\pi^2\\hbar^2}{8\\mu}', x: ['The deuteron (proton plus neutron, μ ≈ 469.5 MeV/c²) has a force range of about 2.1 fm. How deep must the well be to bind it? (ħc = 197.3 MeV fm)', ['V₀ > π²(ħc)² ÷ (8μc²R²) = 9.87 × 197.3² ÷ (8 × 469.5 × 2.1²).', '= 3.84 × 10⁵ ÷ 1.66 × 10⁴ = 23 MeV.', 'The deuteron has one bound state, bound by only 2.2 MeV: the well is only just deep enough.'], 'at least about 23 MeV'], c: ['Why can a 3D well fail to bind, when a 1D well never does?', 'The condition u(0) = 0 allows only the odd-type solutions, which need z₀ > π/2.'] }]
  ],
  m: [
    ['Using |C/A|² as the transmission probability.', 'Multiply by k₂/k₁: probabilities come from currents.'],
    ['Assuming a particle with E > V₀ always passes.', 'Some of the wave reflects at any sudden step.'],
    ['Forgetting the jump in ψ′ at a delta function.', 'ψ′ jumps by −(2mα/ħ²)ψ(0).']
  ]
});

WL.gd('y2-qho', {
  h: 'Atoms in a molecule vibrate, every mode of light behaves like a vibrating spring, and even at absolute zero nothing is perfectly still. All of this is the quantum harmonic oscillator, and remarkably it can be solved without solving a differential equation: two operators that raise and lower the energy, and one commutator, do all the work.',
  s: [
    ['Ladder operators', [
      'Define a = √(mω/2ħ)(x + ip/(mω)) and its adjoint a†. Using [x, p] = iħ, they satisfy [a, a†] = 1, and the Hamiltonian becomes H = ħω(a†a + ½).'
    ], { n: 0, e: 'a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{ip}{m\\omega}\\right),\\qquad [a, a^\\dagger] = 1,\\qquad H = \\hbar\\omega\\left(a^\\dagger a + \\tfrac12\\right)', x: ['Show that [a, a†] = 1.', ['Write P = p/(mω). Then (x + iP)(x − iP) − (x − iP)(x + iP) = −2i[x, P].', '[x, P] = iħ/(mω), so the difference is −2i × iħ/(mω) = 2ħ/(mω).', 'Multiply by the prefactor mω/(2ħ): [a, a†] = 1.'], '[a, a†] = 1'], c: ['Where does the ½ in H = ħω(a†a + ½) come from?', 'From the fact that a and a† do not commute: reordering them leaves the extra ½.'] }],
    ['The energy ladder', [
      'If N = a†a has eigenvalue ν, then a lowers it to ν − 1 and a† raises it to ν + 1. But ⟨N⟩ is the squared length of a|ν⟩, which cannot be negative, so lowering must stop: there is a state with a|0⟩ = 0. So the levels are E_n = (n + ½)ħω, evenly spaced.'
    ], { n: 1, e: 'E_n = \\left(n + \\tfrac12\\right)\\hbar\\omega,\\qquad a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle', x: ['The CO molecule vibrates with ħω = 0.266 eV. What wavelength does it absorb, and what is its zero-point energy?', ['The step 0 → 1 needs ħω = 0.266 eV.', 'λ = 1240 ÷ 0.266 nm = 4.66 μm, in the infrared (CO absorbs at 4.67 μm).', 'Zero-point energy = ½ħω = 0.133 eV.'], '4.7 μm; 0.13 eV'], c: ['Why must the ladder end at the bottom?', 'The energy cannot go below zero (⟨N⟩ ≥ 0), so there must be a lowest state with a|0⟩ = 0.'] }],
    ['The ground state', [
      'In terms of x, a|0⟩ = 0 is a first-order equation, (x + (ħ/mω)d/dx)ψ₀ = 0, whose solution is a Gaussian. Applying a† again and again generates all the excited states (Hermite polynomials times the Gaussian).'
    ], { n: 2, e: '\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/2\\hbar}', x: ['How wide is CO’s vibrational ground state? (reduced mass 1.14 × 10⁻²⁶ kg, ħω = 0.266 eV)', ['ω = 0.266 × 1.6 × 10⁻¹⁹ ÷ 1.055 × 10⁻³⁴ = 4.0 × 10¹⁴ rad/s.', 'σ = √(ħ/(2mω)) = √(1.055 × 10⁻³⁴ ÷ (2 × 1.14 × 10⁻²⁶ × 4.0 × 10¹⁴)) = 3.4 × 10⁻¹² m.', 'About 3% of the 113 pm bond length.'], 'about 3.4 pm'], c: ['Where is the ground-state oscillator most likely to be found, compared with a classical one?', 'At the centre; a classical oscillator spends most time near its turning points.'] }],
    ['Matrix elements', [
      'Since x = √(ħ/2mω)(a + a†), x only links neighbouring levels. So ⟨n|x|n⟩ = 0, ⟨n|x²|n⟩ = (ħ/2mω)(2n + 1), the average potential and kinetic energies are each E_n/2, and ΔxΔp = (n + ½)ħ, the minimum ħ/2 in the ground state.'
    ], { n: 3, e: '\\langle n|x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n + 1)', x: ['Show that the average potential energy in level n is half the total energy.', ['⟨V⟩ = ½mω²⟨x²⟩ = ½mω² × (ħ/2mω)(2n + 1).', '= (ħω/4)(2n + 1) = ½(n + ½)ħω = E_n/2.'], '⟨V⟩ = E_n/2'], c: ['What is ⟨x⟩ in any energy level?', 'Zero: x only connects neighbouring levels. (That does not make Δx zero.)'] }],
    ['Coherent and thermal states', [
      'Eigenstates of a, called **coherent states**, are wave packets of minimum uncertainty whose centres swing back and forth exactly like a classical oscillator; laser light is close to one. At temperature T the average energy is ħω/2 + ħω/(e^(ħω/kT) − 1): about kT when hot, frozen at ħω/2 when cold.'
    ], { n: 4, e: '\\langle E\\rangle_T = \\frac{\\hbar\\omega}{2} + \\frac{\\hbar\\omega}{e^{\\hbar\\omega/kT} - 1}', x: ['How excited are CO’s vibrations at 300 K?', ['ħω/kT = 0.266 ÷ 0.0259 = 10.3.', 'Thermal part: 0.266 eV ÷ (e¹⁰·³ − 1) ≈ 0.266 × 3.4 × 10⁻⁵ = 9 × 10⁻⁶ eV.', 'Practically every molecule is in its vibrational ground state.'], 'barely: almost all in the ground state'], c: ['What does the thermal average energy approach at high temperature?', 'kT, the classical equipartition value.'] }]
  ],
  m: [
    ['Forgetting the zero-point energy ½ħω.', 'The lowest energy is ½ħω, not zero.'],
    ['Treating a and a† as observables.', 'They are not Hermitian; x and p (and N) are.'],
    ['Confusing ⟨x⟩ = 0 with Δx = 0.', 'The average is zero, but the spread is not.']
  ]
});

WL.gd('y2-operators', {
  h: 'You can know where a particle is very precisely, or how fast it is moving, but not both. In quantum mechanics that is not a statement about clumsy instruments: it is a theorem that follows from one equation, [x, p] = iħ. This topic sets out how measurable quantities become operators, and what commutators tell you.',
  s: [
    ['Observables are Hermitian operators', [
      'Every measurable quantity is a **Hermitian** operator: one with ∫f*(Âg)dx = ∫(Âf)*g dx. Its eigenvalues are real, its eigenfunctions for different eigenvalues are orthogonal, and they form a complete set. A measurement gives eigenvalue a_n with probability |⟨φ_n|ψ⟩|².'
    ], { n: 0, e: '\\langle f|\\hat A g\\rangle = \\langle \\hat A f|g\\rangle \\;\\Rightarrow\\; a_n\\in\\mathbb R', x: ['A particle in a box is in ψ = (φ₁ + 2φ₂)/√5. What are the possible energies, their probabilities, and the average?', ['Possible results: E₁ or E₂ = 4E₁.', 'Probabilities: |1/√5|² = 1/5 and |2/√5|² = 4/5.', '⟨E⟩ = (1/5)E₁ + (4/5)(4E₁) = 3.4E₁.'], 'E₁ (20%) or 4E₁ (80%); average 3.4E₁'], c: ['Why must observables be Hermitian?', 'So that every possible measurement result, an eigenvalue, is a real number.'] }],
    ['Commutators', [
      'The commutator [Â, B̂] = ÂB̂ − B̂Â measures whether order matters. Acting on any function, [x, p̂] = iħ. Two rules build everything else: [A, BC] = [A, B]C + B[A, C], and [p, V(x)] = −iħV′(x).'
    ], { n: 1, e: '[\\hat x,\\hat p] = i\\hbar,\\qquad [\\hat x,\\hat p^2] = 2i\\hbar\\,\\hat p', x: ['Find [x, p²] and [H, x] for H = p²/2m + V(x).', ['[x, p²] = [x, p]p + p[x, p] = 2iħp.', '[H, x] = [p², x]/(2m) = −2iħp/(2m) = −iħp/m (V(x) commutes with x).'], '[x, p²] = 2iħp; [H, x] = −iħp/m'], c: ['What is [p, x²]?', '−2iħx.'] }],
    ['The uncertainty principle as a theorem', [
      'Apply the Cauchy–Schwarz inequality to the deviations (Â − ⟨A⟩)ψ and (B̂ − ⟨B⟩)ψ. The result, **Robertson’s relation**, bounds the product of the spreads by the commutator. For x and p it gives σ_xσ_p ≥ ħ/2, and a Gaussian reaches the bound exactly.'
    ], { n: 2, e: '\\sigma_A\\sigma_B \\ge \\tfrac12\\left|\\langle[\\hat A,\\hat B]\\rangle\\right|\\quad\\Rightarrow\\quad \\sigma_x\\sigma_p\\ge\\frac{\\hbar}{2}', x: ['An electron is localised with σ_x = 0.10 nm. What is the least spread in its velocity?', ['σ_p ≥ ħ/(2σ_x) = 1.055 × 10⁻³⁴ ÷ 2.0 × 10⁻¹⁰ = 5.3 × 10⁻²⁵ kg m/s.', 'σ_v = σ_p/m ≥ 5.8 × 10⁵ m/s.'], 'at least 580 km/s'], c: ['Can x and p_y (momentum in a different direction) both be sharp?', 'Yes: [x, p_y] = 0, so there is no bound.'] }],
    ['Ehrenfest’s theorem', [
      'For an operator with no explicit time dependence, the Schrödinger equation gives d⟨A⟩/dt = (i/ħ)⟨[H, A]⟩. For x and p this gives Newton-like laws for the averages: d⟨x⟩/dt = ⟨p⟩/m and d⟨p⟩/dt = −⟨V′(x)⟩. But ⟨V′(x)⟩ is not V′(⟨x⟩) in general.'
    ], { n: 3, e: '\\frac{d\\langle x\\rangle}{dt} = \\frac{\\langle p\\rangle}{m},\\qquad \\frac{d\\langle p\\rangle}{dt} = -\\left\\langle \\frac{dV}{dx}\\right\\rangle', x: ['Compare V = ½kx² with V = λx⁴: when does ⟨x⟩ follow the classical path exactly?', ['Harmonic: ⟨V′⟩ = k⟨x⟩ = V′(⟨x⟩), so ⟨x⟩ obeys the classical equation exactly.', 'Quartic: ⟨V′⟩ = 4λ⟨x³⟩, which is not 4λ⟨x⟩³ for a spread-out packet.', 'So the quartic packet’s centre does not follow a classical path.'], 'exactly for the harmonic oscillator only'], c: ['When do quantum averages obey Newton’s laws exactly?', 'When V′ is at most linear in x: a free particle, a uniform force, or a harmonic potential.'] }],
    ['Energy and time', [
      'There is no time operator, so ΔE Δt ≳ ħ is not a Robertson relation. Two honest versions exist: a state with energy spread ΔE needs a time of about ħ/ΔE to change noticeably; and a state that decays with lifetime τ has an energy width Γ = ħ/τ, seen as the natural width of a spectral line.'
    ], { n: 4, e: '\\Gamma = \\frac{\\hbar}{\\tau},\\qquad \\Delta\\nu = \\frac{1}{2\\pi\\tau}', x: ['The excited state that gives sodium’s yellow light lives 16 ns. What is its natural linewidth?', ['Γ = ħ/τ = 1.055 × 10⁻³⁴ ÷ 1.6 × 10⁻⁸ = 6.6 × 10⁻²⁷ J = 4.1 × 10⁻⁸ eV.', 'In frequency: Δν = 1/(2πτ) = 1 ÷ (2π × 1.6 × 10⁻⁸) = 9.9 MHz.'], 'about 10 MHz'], c: ['Why is ΔE Δt ≥ ħ/2 not a Robertson relation?', 'Time is a parameter in quantum mechanics, not an operator.'] }],
    ['Preparation versus disturbance', [
      'Heisenberg’s original picture was a microscope: measuring x more precisely kicks the momentum harder. That is about one measurement disturbing another, and it is a different statement from Robertson’s, which is about the spreads of results over many identically prepared systems. Careful versions of the disturbance relation have been tested experimentally.'
    ], { n: 5, c: ['Is Robertson’s relation about a measurement disturbing the particle?', 'No: it limits the spreads in an ensemble, where each copy is measured once, for A or for B.'] }]
  ],
  m: [
    ['Treating ΔE Δt as an operator relation.', 'Use the lifetime–width or time-to-change versions.'],
    ['Taking any operator as an observable.', 'Observables must be Hermitian, with real eigenvalues.'],
    ['Reading the uncertainty principle as instrument error.', 'It is a property of quantum states themselves.']
  ]
});
