/* Geodesic step-by-step guides, stage y1 (built from src/guide/y1-*.js) */
WL.gd('y1-work-energy', {
  h: 'Lift a box onto a shelf by any route you like, straight up or the long way round, and gravity does the same work. Drag it across a rough floor and the longer route costs more. That difference, whether the work depends on the path, is exactly what decides whether a force can have a potential energy. This topic turns that idea into calculus.',
  s: [
    ['Work as a line integral', [
      'When a force F acts on a particle moving along a path C, the work is the sum of F·dr along the path. The dot product keeps only the part of the force along the motion; a force always perpendicular to the velocity, such as the magnetic force on a charge, does no work.',
      'To evaluate it, describe the path, write dr along it, and integrate F·dr.'
    ], { n: 0, e: 'W = \\int_C \\mathbf F\\cdot d\\mathbf r', x: ['A force F = (2x, 3) N acts on a particle moving from (0, 0) to (2, 0) and then to (2, 1) (distances in m). Find the work done.', ['First leg: along x, so dr = (dx, 0) and F·dr = 2x dx: ∫₀² 2x dx = 4 J.', 'Second leg: along y at x = 2, so dr = (0, dy) and F·dr = 3 dy: ∫₀¹ 3 dy = 3 J.', 'Total W = 4 + 3 = 7 J.'], '7 J'], c: ['A charged particle goes round a circle in a uniform magnetic field. How much work does the magnetic force do on it per lap?', 'None: the force is always perpendicular to the velocity, so F·dr = 0 everywhere.'] }],
    ['The work–energy theorem', [
      'Put Newton’s second law into the integral: F_net·dr = m(dv/dt)·v dt = d(½mv²). So the net work done on a particle equals its change in kinetic energy, ΔK.',
      'This holds for any forces, friction included: it is just Newton’s second law, integrated along the path.'
    ], { n: 1, e: 'W_{\\text{net}} = \\Delta K = \\tfrac12mv_2^2 - \\tfrac12mv_1^2', x: ['A 2.0 kg block slides 3.0 m across a rough floor (μ = 0.25), starting at 4.0 m/s. How fast is it moving at the end?', ['Friction = μmg = 0.25 × 2.0 × 9.81 = 4.9 N, doing work −4.9 × 3.0 = −14.7 J.', 'K₁ = ½ × 2.0 × 4.0² = 16.0 J, so K₂ = 16.0 − 14.7 = 1.3 J.', 'v = √(2 × 1.3 ÷ 2.0) = 1.1 m/s.'], 'about 1.1 m/s'], c: ['Does the work–energy theorem hold when friction acts?', 'Yes: it is Newton’s second law integrated, so it holds for the net force, whatever the forces are.'] }],
    ['Conservative forces and potential energy', [
      'A force is **conservative** if the work it does between two points is the same for every path; equivalently, the work round any closed loop is zero. Only then can we define a **potential energy** U, with F = −∇U, and only then is K + U conserved.',
      'A quick test: in a region without holes, F is conservative exactly when its curl is zero. Gravity, springs and electrostatic forces pass; friction and drag do not.'
    ], { n: 2, e: '\\oint \\mathbf F\\cdot d\\mathbf r = 0 \\iff \\mathbf F = -\\nabla U \\;\\Rightarrow\\; \\nabla\\times\\mathbf F = \\mathbf 0', x: ['Show that F = (2x, 3) is conservative, find U, and check the work from (0, 0) to (2, 1) along the straight diagonal.', ['Curl (z-part): ∂F_y/∂x − ∂F_x/∂y = 0 − 0 = 0, so it is conservative.', 'F = −∇U with U = −(x² + 3y) + constant; W = U(start) − U(end) = 0 − (−7) = 7 J.', 'Diagonal: r = (2t, t), dr = (2, 1)dt, F·dr = (2·2t·2 + 3)dt = (8t + 3)dt; ∫₀¹ = 4 + 3 = 7 J, the same as the L-shaped path.'], 'conservative; U = −(x² + 3y); 7 J by either path'], c: ['Is friction conservative?', 'No: it always opposes the motion, so the work round any closed loop is negative, not zero.'] }],
    ['Reading a potential-energy curve', [
      'In one dimension F = −dU/dx: the force pushes downhill on the U(x) graph. With total energy E, the particle can only be where U(x) ≤ E; it turns round where U = E. Equilibria are where dU/dx = 0: minima are stable, maxima unstable.',
      'Near a minimum x₀, U ≈ U(x₀) + ½U″(x₀)(x − x₀)², a spring with k = U″(x₀). So small oscillations about any smooth minimum are simple harmonic, with ω = √(U″(x₀)/m).'
    ], { n: 3, e: '\\omega = \\sqrt{\\frac{U\'\'(x_0)}{m}}', x: ['A 0.50 kg particle moves in U(x) = 2x⁴ − 4x² (U in J, x in m). Find the equilibria, their stability, and the period of small oscillations about the stable ones. If E = −1.0 J, where does it turn?', ['dU/dx = 8x³ − 8x = 0 at x = 0 and x = ±1.', 'U″ = 24x² − 8: at 0 it is −8 (unstable); at ±1 it is +16 (stable), with U(±1) = −2 J.', 'ω = √(16 ÷ 0.50) = 5.66 rad/s, so T = 2π/ω = 1.11 s.', 'Turning points: 2x⁴ − 4x² = −1 gives x² = (4 ± √8)/4, so x = 0.54 m and 1.31 m: it rocks back and forth in the right-hand well.'], 'stable at ±1 m (T = 1.1 s); unstable at 0; turns at 0.54 m and 1.31 m'], c: ['With E = +1.0 J instead, where can the particle go?', 'Wherever 2x⁴ − 4x² ≤ 1, which is |x| ≤ 1.49 m: it now rolls over the central hump and moves between −1.49 m and +1.49 m.'] }],
    ['Power', [
      'The rate at which a force does work is P = F·v. For the net force, P = dK/dt.',
      'A car delivering a constant power from rest does not accelerate uniformly: since ½mv² = Pt (ignoring losses), v = √(2Pt/m), and the driving force P/v falls as it speeds up.'
    ], { n: 4, e: 'P = \\mathbf F\\cdot\\mathbf v', x: ['A 1000 kg car delivers a steady 50 kW from rest. Ignoring losses, how fast is it going after 10 s, and what is the driving force then?', ['½mv² = Pt, so v = √(2 × 50 000 × 10 ÷ 1000) = √1000 = 31.6 m/s.', 'F = P/v = 50 000 ÷ 31.6 = 1580 N.'], '31.6 m/s; 1.6 kN'], c: ['Why can a constant power not give a constant acceleration from rest?', 'The force P/v would be infinite at v = 0, and it falls as v rises.'] }]
  ],
  m: [
    ['Using |F||dr| instead of F·dr.', 'Only the component of the force along the path does work.'],
    ['Using K + U = constant when friction acts.', 'Use W_nonconservative = ΔK + ΔU.'],
    ['Getting the sign of F = −dU/dx wrong.', 'The force points downhill on the potential-energy curve.']
  ]
});

WL.gd('y1-systems', {
  h: 'A diver tumbles and twists through the air, every part of her following a different curve, yet one point, her centre of mass, traces a perfect parabola. And a rocket speeds up in empty space with nothing to push against. Both come from the same idea: internal forces cancel, so a whole system moves as if it were one particle.',
  s: [
    ['The centre of mass', [
      'For particles of masses mᵢ at positions rᵢ, the **centre of mass** is R = Σmᵢrᵢ/M, where M is the total mass. Add up Newton’s second law for every particle: the internal forces come in equal and opposite pairs (third law) and cancel, leaving M d²R/dt² = F_ext.',
      'So the centre of mass moves as if all the mass were there and only the external forces acted. The total momentum is P = M dR/dt.'
    ], { n: 0, e: '\\mathbf R = \\frac{1}{M}\\sum_i m_i\\mathbf r_i,\\qquad M\\ddot{\\mathbf R} = \\mathbf F_{\\text{ext}}', x: ['Where is the centre of mass of the Earth (5.97 × 10²⁴ kg) and the Moon (7.35 × 10²² kg), whose centres are 3.84 × 10⁸ m apart?', ['Measure from the Earth’s centre: R = (7.35 × 10²² × 3.84 × 10⁸) ÷ (5.97 × 10²⁴ + 7.35 × 10²²).', '= 2.82 × 10³¹ ÷ 6.04 × 10²⁴ = 4.67 × 10⁶ m.', 'The Earth’s radius is 6.37 × 10⁶ m, so this point is inside the Earth, about 1700 km below the surface.'], '4670 km from the Earth’s centre'], c: ['A firework shell explodes in mid-air. Ignoring air resistance, what path does the centre of mass of all the pieces follow?', 'The same parabola the shell was on: the explosion forces are internal.'] }],
    ['Impulse', [
      'The **impulse** of a force is its integral over time, and it equals the change of momentum it causes. In a short collision only the area under the force–time graph matters, so spreading the same change of momentum over a longer time lowers the peak force.'
    ], { n: 1, e: '\\mathbf J = \\int\\mathbf F\\,dt = \\Delta\\mathbf p', x: ['A 57 g tennis ball arrives at 30 m/s and leaves the racket at 40 m/s the opposite way, after 4.0 ms of contact. Find the impulse and the average force.', ['Taking the outgoing direction as positive: Δp = 0.057 × (40 − (−30)) = 0.057 × 70 = 4.0 N s.', 'Average force = 4.0 ÷ 0.0040 = 1000 N.'], '4.0 N s; about 1000 N'], c: ['Why do airbags and crumple zones reduce injuries?', 'They make the same change of momentum happen over a longer time, so the force is smaller.'] }],
    ['The centre-of-mass frame', [
      'Watch from a frame moving with the centre of mass and the total momentum is zero; collisions look symmetrical. The kinetic energy splits into two parts: ½MV² for the motion of the centre of mass, and the energy of motion relative to it. Momentum conservation keeps the first part fixed, so only the second can be turned into heat or deformation.'
    ], { n: 2, e: 'K = \\tfrac12MV^2 + K_{\\text{internal}}', x: ['A 1.0 kg ball at 6.0 m/s hits a stationary 2.0 kg ball. What is the most kinetic energy that the collision could turn into heat?', ['V = (1.0 × 6.0) ÷ 3.0 = 2.0 m/s.', 'Total K = ½ × 1.0 × 6.0² = 18 J; the centre-of-mass part is ½ × 3.0 × 2.0² = 6 J.', 'So at most 18 − 6 = 12 J can be lost, which happens if they stick together.'], '12 J'], c: ['In a perfectly inelastic collision, which part of the kinetic energy is lost?', 'All of the internal part; the ½MV² part must remain, because momentum is conserved.'] }],
    ['The rocket equation', [
      'A rocket of mass m throws exhaust backwards at speed u relative to itself. When it sheds a small mass, conservation of momentum gives m dv = −u dm. Integrating from the starting mass m₀ to the final mass m₁ gives **Tsiolkovsky’s rocket equation**. In a uniform gravitational field, subtract gt for a burn lasting t.'
    ], { n: 3, e: '\\Delta v = u\\ln\\frac{m_0}{m_1}', x: ['A rocket’s exhaust speed is 3.0 km/s and its mass ratio is 5. What Δv does it get in empty space, and what if it climbs vertically against gravity for a 120 s burn?', ['In space: Δv = 3.0 × ln 5 = 3.0 × 1.61 = 4.8 km/s.', 'Against gravity: subtract 9.81 × 120 = 1.2 km/s, leaving 3.6 km/s.'], '4.8 km/s; 3.6 km/s'], c: ['If the mass ratio is doubled from 5 to 10, does Δv double?', 'No: it only adds u ln 2 = 2.1 km/s, because Δv grows with the logarithm of the mass ratio.'] }],
    ['Why rockets have stages', [
      'Because Δv grows only logarithmically, reaching orbit needs most of the launch mass to be propellant. Dropping empty tanks part-way (staging) means you stop carrying dead mass.'
    ], { n: 4, x: ['A 100 t rocket carries 90 t of propellant and 1 t of payload (u = 4.4 km/s). Compare one stage with 9 t of tanks against two stages: 60 t of fuel in 6 t of tanks, then 30 t of fuel in 3 t of tanks.', ['One stage: 100 t → 10 t, Δv = 4.4 × ln 10 = 10.1 km/s.', 'Two stages: first burn 100 → 40 t, ln 2.5 = 0.92; drop 6 t to 34 t; second burn 34 → 4 t, ln 8.5 = 2.14.', 'Total Δv = 4.4 × (0.92 + 2.14) = 13.5 km/s.'], '10.1 km/s for one stage; 13.5 km/s for two'], c: ['To reach low orbit needs about 9.4 km/s. With u = 4.4 km/s, what fraction of the launch mass must be propellant?', 'm₀/m₁ = e^(9.4/4.4) = 8.5, so 1 − 1/8.5 = 88% must be propellant.'] }]
  ],
  m: [
    ['Thinking internal forces can move the centre of mass.', 'Only external forces change its motion.'],
    ['Using F = ma for a rocket as if its mass were constant.', 'Use conservation of momentum, which gives the rocket equation.'],
    ['Thinking a rocket pushes against the air.', 'It pushes on its own exhaust; it works best in a vacuum.']
  ]
});

WL.gd('y1-angular-momentum', {
  h: 'A cat dropped upside down lands on its feet; a figure skater spins faster by pulling in her arms; a spinning top leans over but does not fall. All three follow from angular momentum, which plays the same part for turning that momentum plays for moving: a torque is what changes it, and with no torque it stays exactly the same.',
  s: [
    ['Torque and angular momentum', [
      'For a particle at position r with momentum p, the **angular momentum** about the origin is L = r × p, and the **torque** of a force is τ = r × F. Differentiating, dL/dt = v × p + r × F = τ, because v × mv = 0.',
      'For a system, the internal torques cancel, so the total angular momentum changes only through external torques.'
    ], { n: 0, e: '\\mathbf L = \\mathbf r\\times\\mathbf p,\\qquad \\frac{d\\mathbf L}{dt} = \\boldsymbol\\tau_{\\text{ext}}', x: ['A 2.0 kg particle is at r = (3, 0, 0) m moving with v = (0, 4, 0) m/s. Find its angular momentum about the origin.', ['p = mv = (0, 8, 0) kg m/s.', 'L = r × p = (3, 0, 0) × (0, 8, 0) = (0, 0, 3 × 8) = (0, 0, 24).'], '24 kg m²/s along +z'], c: ['A particle moves in a straight line at constant velocity, passing near the origin. Is its angular momentum about the origin constant?', 'Yes: no force acts, so no torque; L = mvd, with d the perpendicular distance from the origin to the line, which does not change.'] }],
    ['Moment of inertia', [
      'For a rigid body turning about a fixed axis, L = Iω, where the **moment of inertia** I = Σmᵢrᵢ² measures how the mass is spread about the axis. Then τ = Iα and the rotational kinetic energy is ½Iω².',
      'Standard results: a rod about its centre ML²/12, about one end ML²/3; a disc ½MR²; a ring MR²; a solid sphere ⅖MR². The **parallel-axis theorem** gives I about any axis parallel to one through the centre of mass: I = I_cm + Md².'
    ], { n: 1, e: 'L = I\\omega,\\qquad \\tau = I\\alpha,\\qquad I = I_{\\text{cm}} + Md^2', x: ['A uniform 1.2 m rod of mass 0.90 kg is pivoted at one end and released from horizontal. Find its angular acceleration at the start.', ['I about the end = ML²/3 = 0.90 × 1.44 ÷ 3 = 0.432 kg m².', 'Its weight acts at the middle: τ = Mg × L/2 = 0.90 × 9.81 × 0.60 = 5.30 N m.', 'α = τ/I = 5.30 ÷ 0.432 = 12.3 rad/s².'], '12 rad/s²'], c: ['Use the parallel-axis theorem to get I for a rod about one end from I_cm = ML²/12.', 'I = ML²/12 + M(L/2)² = ML²/12 + ML²/4 = ML²/3.'] }],
    ['Conservation of angular momentum', [
      'With no external torque, L stays constant. A skater pulling in her arms reduces I, so ω rises. A planet’s angular momentum about the Sun is conserved, because gravity points at the Sun, so the line from the Sun sweeps out equal areas in equal times: Kepler’s second law.'
    ], { n: 2, e: 'I_1\\omega_1 = I_2\\omega_2', x: ['A skater with I = 3.0 kg m² spins at 2.0 revolutions per second, then pulls in her arms to I = 1.2 kg m². Find her new spin rate and the change in kinetic energy.', ['L is conserved: ω₂ = ω₁ × I₁/I₂ = 2.0 × 3.0 ÷ 1.2 = 5.0 rev/s.', 'K₁ = ½ × 3.0 × (2π × 2.0)² = 237 J; K₂ = ½ × 1.2 × (2π × 5.0)² = 592 J.'], '5.0 rev/s; the kinetic energy rises by 355 J'], c: ['Where does her extra kinetic energy come from?', 'From the work her muscles do pulling her arms inwards.'] }],
    ['Rolling down a slope', [
      'A body rolling without slipping has v = ωR, and friction at the contact point supplies the torque that spins it up. Its acceleration down a slope of angle θ is g sin θ/(1 + I/MR²), so the shape matters but the mass and size do not.'
    ], { n: 3, e: 'a = \\frac{g\\sin\\theta}{1 + I/MR^2}', x: ['Find the acceleration of a solid cylinder, a hoop and a solid sphere rolling down a 30° slope.', ['Cylinder (I/MR² = ½): a = 9.81 × 0.5 ÷ 1.5 = 3.27 m/s².', 'Hoop (1): a = 4.91 ÷ 2 = 2.45 m/s².', 'Sphere (⅖): a = 4.91 ÷ 1.4 = 3.50 m/s².'], 'sphere 3.5, cylinder 3.3, hoop 2.5 m/s²'], c: ['Does a heavier solid cylinder roll down faster than a light one?', 'No: the mass and radius cancel; only the shape factor I/MR² matters.'] }],
    ['Gyroscopes and precession', [
      'Hold a spinning wheel by one end of its axle. Gravity makes a torque that is horizontal and at right angles to L. A torque changes L in its own direction, so it swings the axle round horizontally instead of tipping it down: the wheel **precesses** at Ω = τ/L.'
    ], { n: 4, e: '\\Omega = \\frac{\\tau}{L} = \\frac{Mgr}{I\\omega}', x: ['A 2.0 kg bicycle wheel with I = 0.20 kg m² spins at 20 rad/s, supported by its axle 0.15 m from the wheel. Find the precession rate.', ['τ = Mgr = 2.0 × 9.81 × 0.15 = 2.94 N m.', 'L = Iω = 0.20 × 20 = 4.0 kg m²/s.', 'Ω = τ/L = 0.74 rad/s, one turn every 8.5 s.'], '0.74 rad/s'], c: ['What happens to the precession as the wheel slows down?', 'L falls, so Ω = τ/L grows: it precesses faster and faster, and eventually falls.'] }]
  ],
  m: [
    ['Measuring r in I = Σmr² from the wrong point.', 'r is the distance from the axis of rotation.'],
    ['Thinking a torque must speed up or slow down the spin.', 'A torque perpendicular to L changes only its direction: precession.'],
    ['Conserving L when an external torque acts.', 'L is conserved only with zero external torque.']
  ]
});

WL.gd('y1-rotation', {
  h: 'Race a solid ball, a disc and a hoop down the same ramp. The ball wins every time, whatever their sizes and masses. For turning motion, mass is not enough: what matters is how far the mass sits from the axis, measured by the moment of inertia.',
  s: [
    ['A dictionary for rotation', [
      'Every quantity for straight-line motion has a partner for rotation: angle θ for position, angular velocity ω for velocity, angular acceleration α for acceleration, torque τ for force, moment of inertia I for mass, and angular momentum L = Iω for momentum. Newton’s second law becomes τ = Iα, and the kinetic energy of rotation is ½Iω².'
    ], { n: 0, e: '\\tau = I\\alpha,\\qquad L = I\\omega,\\qquad E_k = \\tfrac12 I\\omega^2', c: ['What are the rotational partners of F = ma and p = mv?', 'τ = Iα and L = Iω.'] }],
    ['Computing a moment of inertia', [
      'The moment of inertia is I = Σmᵢrᵢ², or ∫r² dm for a continuous body. Because r is squared, mass far from the axis counts much more.',
      'For a flat body, the **perpendicular-axis theorem** helps: I about an axis at right angles to the plane is the sum of I about two perpendicular axes in the plane.'
    ], { n: 1, e: 'I = \\int r^2\\,dm', x: ['Derive I for a thin uniform rod of mass M and length L about its centre.', ['A slice of length dx has mass dm = (M/L)dx at distance x from the centre.', 'I = ∫ x² (M/L) dx from −L/2 to L/2 = (M/L) × [x³/3] = (M/L) × 2(L/2)³/3.', 'I = ML²/12.'], 'ML²/12'], c: ['A hoop and a disc have the same mass and radius. Which has the larger moment of inertia about its axis?', 'The hoop: all its mass is at the full radius R, giving MR², against ½MR² for the disc.'] }],
    ['Parallel axes', [
      'For an axis parallel to one through the centre of mass, at distance d from it, I = I_cm + Md². So the moment of inertia is smallest about an axis through the centre of mass.'
    ], { n: 1, e: 'I = I_{\\text{cm}} + Md^2', x: ['A 0.50 kg disc of radius 0.20 m turns about an axis through a point on its rim, perpendicular to its face. Find I.', ['I_cm = ½MR² = ½ × 0.50 × 0.20² = 0.010 kg m².', 'd = R, so add MR² = 0.50 × 0.040 = 0.020 kg m².', 'I = 0.030 kg m².'], '0.030 kg m²'], c: ['Can the parallel-axis theorem be used between two axes, neither of which passes through the centre of mass?', 'Not directly: go via the centre of mass, because the formula assumes one axis passes through it.'] }],
    ['Rolling without slipping', [
      'For a rolling object the contact point is momentarily at rest, so v = ωR. Its kinetic energy is shared between moving along and spinning: ½Mv² + ½Iω² = ½Mv²(1 + k), where k = I/MR² depends only on the shape.',
      'Released from a height h, it reaches v = √(2gh/(1 + k)). A hoop (k = 1) puts half its energy into spinning; a solid sphere (k = ⅖) only two sevenths, so it is faster.'
    ], { n: 2, e: 'v = \\sqrt{\\frac{2gh}{1 + k}},\\qquad k = \\frac{I}{MR^2}', x: ['A hoop, a disc and a solid sphere roll from rest down a ramp 1.0 m high. Find their speeds at the bottom, and compare with a block sliding without friction.', ['Hoop: v = √(2 × 9.81 × 1.0 ÷ 2) = 3.13 m/s.', 'Disc: √(19.6 ÷ 1.5) = 3.62 m/s. Sphere: √(19.6 ÷ 1.4) = 3.74 m/s.', 'Frictionless block (no spinning): √19.6 = 4.43 m/s.'], 'sphere 3.74, disc 3.62, hoop 3.13 m/s'], c: ['A yo-yo (a uniform disc) falls as its string unwinds. What is its acceleration?', 'The string acts like the slope: a = g/(1 + k) = g/1.5 = 6.5 m/s².'] }],
    ['Conservation of angular momentum', [
      'With no external torque, L = Iω is constant. Pulling mass inwards reduces I and raises ω. The kinetic energy L²/2I then increases: the extra energy comes from the work done pulling the mass in. Collapsing stars spin up in exactly this way.'
    ], { n: 3, x: ['Thought experiment: the Sun (radius 7.0 × 10⁸ m) spins once in 25 days. If it collapsed to a 10 km sphere keeping its angular momentum (and staying uniform), how fast would it spin?', ['I ∝ R², so ω ∝ 1/R² and the period ∝ R².', 'T = 25 days × (1.0 × 10⁴ ÷ 7.0 × 10⁸)² = 2.16 × 10⁶ s × 2.0 × 10⁻¹⁰.', 'T = 4.4 × 10⁻⁴ s: over 2000 turns a second, as fast as the quickest pulsars.'], 'about 0.4 ms per turn'], c: ['A skater halves her moment of inertia. What happens to her ω and her kinetic energy?', 'Both double: ω because L is fixed, and K = L²/2I because I halves.'] }],
    ['Gyroscopes', [
      'A torque changes the direction of L as well as its size. Gravity on a leaning spinning top makes a torque at right angles to L, so L swings round in a horizontal circle, **precession**, at Ω = τ/L. The Earth itself precesses once every 26 000 years, because the Sun and Moon pull on its equatorial bulge.'
    ], { n: 4, e: '\\Omega = \\frac{\\tau}{L}', c: ['Why does a spinning top precess instead of falling over?', 'Gravity’s torque is perpendicular to the top’s angular momentum, so it changes the direction of L, swinging the axis round, rather than tipping it down.'] }]
  ],
  m: [
    ['Using MR² for every round object.', 'Hoop MR², disc ½MR², solid sphere ⅖MR².'],
    ['Leaving out the rotational kinetic energy for a rolling object.', 'Include ½Iω², with ω = v/R.'],
    ['Using the parallel-axis theorem from an axis not through the centre of mass.', 'Always shift from the centre-of-mass axis.']
  ]
});

WL.gd('y1-fluids', {
  h: 'Why does a shower curtain billow inwards, why does water squirt faster when you squeeze the end of a hose, and how does an aeroplane’s airspeed indicator work? A fluid at rest has pressure that grows with depth; a fluid in steady flow trades pressure for speed. Two conservation laws, of mass and of energy, explain it all.',
  s: [
    ['Fluids at rest', [
      'In a fluid at rest, pressure increases with depth as dp/dz = −ρg, so in a liquid p = p₀ + ρgh. **Pascal’s principle**: a change of pressure applied anywhere in an enclosed fluid is passed on undiminished everywhere. **Archimedes**: the buoyant force equals the weight of fluid displaced.'
    ], { n: 0, e: 'p = p_0 + \\rho g h', x: ['A hydraulic jack has a small piston of area 2.0 cm² and a large one of 200 cm². What force does a 100 N push on the small piston produce, and what is the catch?', ['The pressure is the same: 100 N ÷ 2.0 cm² = 50 N per cm².', 'On the large piston: 50 × 200 = 10 000 N.', 'The catch: the volume pushed is the same, so the small piston must move 100 times further.'], '10 000 N, for a 100 times shorter movement'], c: ['Atmospheric pressure is 101 kPa. What is the absolute pressure at the bottom of a 3.0 m deep pool?', '101 kPa + 1000 × 9.81 × 3.0 Pa = 101 + 29.4 = 130 kPa.'] }],
    ['Continuity', [
      'In steady flow of a fluid that cannot be compressed, the volume passing each cross-section per second is the same everywhere along a pipe. So where the pipe narrows, the fluid must speed up.'
    ], { n: 1, e: 'A_1v_1 = A_2v_2', x: ['Water flows at 1.5 m/s in a hose 2.0 cm across. How fast does it leave a nozzle 0.50 cm across?', ['The areas are in the ratio of the diameters squared: (2.0 ÷ 0.50)² = 16.', 'v = 1.5 × 16 = 24 m/s.'], '24 m/s'], c: ['Where does a river flow fastest: where it is wide and deep, or narrow and shallow?', 'Where it is narrow and shallow: the same volume per second must pass through a smaller cross-section.'] }],
    ['Bernoulli’s equation', [
      'Apply the work–energy theorem to a small parcel of fluid moving along a **streamline** in steady flow, with no viscosity and no compression: the work done on it by the pressure difference equals its gain in kinetic and gravitational energy. Per unit volume, p + ½ρv² + ρgz stays constant along the streamline.',
      'So where the fluid speeds up, its pressure drops.'
    ], { n: 2, e: 'p + \\tfrac12\\rho v^2 + \\rho g z = \\text{constant along a streamline}', x: ['Water flows at 2.0 m/s through a pipe of area 10 cm² into a level throat of 4.0 cm². Find the speed in the throat and the pressure drop.', ['Continuity: v₂ = 2.0 × 10 ÷ 4.0 = 5.0 m/s.', 'Bernoulli (same height): Δp = ½ρ(v₂² − v₁²) = ½ × 1000 × (25 − 4.0).', 'Δp = 10 500 Pa: the pressure in the throat is 10.5 kPa lower.'], '5.0 m/s; 10.5 kPa lower'], c: ['In the narrow throat of a pipe, is the pressure higher or lower than in the wide part?', 'Lower: the fluid moves faster there, so it has less pressure.'] }],
    ['Applications', [
      'Water leaving a small hole a depth h below the surface of a large open tank has the same speed as if it had fallen freely through h: v = √(2gh) (**Torricelli**). A Venturi meter measures flow from the pressure drop in a throat; a pitot tube measures airspeed from the extra pressure where the air is brought to rest.'
    ], { n: 3, e: 'v = \\sqrt{2gh}', x: ['Water stands 1.8 m above a small 1.0 cm² hole near the bottom of a large tank. How fast does it leave, and at what rate?', ['v = √(2 × 9.81 × 1.8) = 5.9 m/s.', 'Flow rate = Av = 1.0 × 10⁻⁴ × 5.9 = 5.9 × 10⁻⁴ m³/s, about 0.6 litres per second.'], '5.9 m/s; 0.6 L/s'], c: ['Why does the jet from a draining tank slow down as time passes?', 'The water level h falls, and the speed √(2gh) falls with it.'] }],
    ['Where it breaks', [
      'Real fluids are **viscous**. In smooth (laminar) flow through a pipe, the flow rate follows **Poiseuille’s law**, Q = πR⁴Δp/(8ηL): halving the radius cuts the flow sixteenfold. The **Reynolds number** Re = ρvD/η compares inertia with viscosity; pipe flow is usually laminar below about 2000 and turbulent above about 4000, and turbulence wastes energy that Bernoulli ignores.'
    ], { n: 4, e: 'Q = \\frac{\\pi R^4\\Delta p}{8\\eta L},\\qquad \\text{Re} = \\frac{\\rho vD}{\\eta}', x: ['Water (η = 1.0 × 10⁻³ Pa s) flows at 1.5 m/s in a 2.0 cm pipe. Is the flow laminar or turbulent?', ['Re = 1000 × 1.5 × 0.020 ÷ 1.0 × 10⁻³ = 30 000.', 'That is far above 4000.'], 'turbulent'], c: ['An artery narrows to half its radius. With the same pressure difference, by what factor does the blood flow fall?', 'Q ∝ R⁴, so it falls by a factor of 16.'] }]
  ],
  m: [
    ['Using Bernoulli for viscous or turbulent flow.', 'It assumes steady, smooth, non-viscous flow along a streamline.'],
    ['Using Bernoulli without continuity.', 'You usually need both: continuity gives the speeds, Bernoulli the pressures.'],
    ['Mixing gauge and absolute pressure.', 'Gauge pressure is measured above atmospheric; say which you mean.']
  ]
});
WL.gd('y1-oscillators', {
  h: 'A singer shatters a wine glass, a car’s suspension soaks up a pothole, a radio picks out one station from hundreds: all three are the same model, a damped oscillator pushed by a periodic force. It is probably the most used equation in physics, and one number, the quality factor Q, captures most of its behaviour.',
  s: [
    ['The damped oscillator', [
      'A mass on a spring with a drag force proportional to velocity, −bẋ, obeys ẍ + γẋ + ω₀²x = 0, where γ = b/m and ω₀² = k/m. Trying x = e^(st) gives s = −γ/2 ± √(γ²/4 − ω₀²).',
      'If γ < 2ω₀ (**underdamped**), s is complex: the mass oscillates at ω_d = √(ω₀² − γ²/4) inside an envelope e^(−γt/2). If γ = 2ω₀ (**critically damped**), it returns fastest without overshooting. If γ > 2ω₀ (**overdamped**), it creeps back.'
    ], { n: 0, e: '\\ddot x + \\gamma\\dot x + \\omega_0^2x = 0,\\qquad \\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2/4}', x: ['A 0.50 kg mass on a spring with k = 200 N/m has damping b = 0.20 kg/s. Which case is it, how fast does it oscillate, and how long does its amplitude take to halve?', ['ω₀ = √(200 ÷ 0.50) = 20 rad/s; γ = 0.20 ÷ 0.50 = 0.40 s⁻¹.', 'γ is far below 2ω₀ = 40 s⁻¹: underdamped, with ω_d = √(400 − 0.04) ≈ 20 rad/s.', 'Envelope e^(−0.20t): it halves when 0.20t = ln 2, at t = 3.5 s.'], 'underdamped; about 20 rad/s; the amplitude halves every 3.5 s'], c: ['What value of b would make this oscillator critically damped?', 'γ = 2ω₀ = 40 s⁻¹, so b = mγ = 20 kg/s.'] }],
    ['Energy and Q', [
      'Energy goes as amplitude squared, so with light damping it decays as e^(−γt), twice as fast as the amplitude. The **quality factor** Q = ω₀/γ is 2π times the energy stored divided by the energy lost per cycle; the amplitude falls by a factor e in about Q/π cycles.'
    ], { n: 1, e: 'Q = \\frac{\\omega_0}{\\gamma},\\qquad E(t) = E_0e^{-\\gamma t}', x: ['Find Q for the oscillator above, the fraction of its energy lost each cycle, and how many cycles its amplitude takes to fall by a factor e.', ['Q = 20 ÷ 0.40 = 50.', 'Energy lost per cycle ≈ 2π/Q = 0.13, about 13%.', 'Q/π = 16 cycles; at 0.31 s per cycle that is 5.0 s, which matches 2/γ.'], 'Q = 50; 13% per cycle; 16 cycles'], c: ['A quartz watch crystal rings at 32 768 Hz with Q = 10⁵. About how long does its free ringing last?', 'The amplitude falls by e in 2/γ = 2Q/ω₀ = 2 × 10⁵ ÷ (2π × 32 768) ≈ 1 s.'] }],
    ['Driven oscillations', [
      'Add a drive F₀ cos ωt and, once the start-up has died away, the mass oscillates at the drive frequency ω, not at ω₀. Writing x = Re[Ae^(iωt)] turns the equation into algebra: A = (F₀/m)/(ω₀² − ω² + iγω). Its size is the amplitude, and its angle is how far the motion lags the force.'
    ], { n: 2, e: '|A| = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + \\gamma^2\\omega^2}}', x: ['Drive the oscillator above (m = 0.50 kg, ω₀ = 20 rad/s, γ = 0.40 s⁻¹) with F₀ = 1.0 N, first at 10 rad/s, then at 20 rad/s.', ['F₀/m = 2.0 m/s².', 'At 10 rad/s: |A| = 2.0 ÷ √(300² + 4.0²) = 2.0 ÷ 300 = 6.7 mm, close to the static stretch F₀/k = 5.0 mm.', 'At 20 rad/s: |A| = 2.0 ÷ (γω₀) = 2.0 ÷ 8.0 = 0.25 m, which is Q × F₀/k = 50 × 5.0 mm.'], '6.7 mm, then 250 mm at resonance'], c: ['At resonance, by how much does the displacement lag the driving force?', 'By 90°: a quarter of a cycle.'] }],
    ['Resonance', [
      'Well below ω₀ the mass follows the force, in phase, with amplitude about F₀/k. At ω₀ it lags by 90° and the amplitude is Q times bigger. Well above ω₀ it lags by 180° and the amplitude falls as 1/ω².',
      'The power absorbed peaks exactly at ω₀, with a full width at half maximum of Δω = γ, so Q = ω₀/Δω: a high-Q oscillator responds only in a narrow band.'
    ], { n: 3, e: 'Q = \\frac{\\omega_0}{\\Delta\\omega}', c: ['If the oscillator above is driven at 40 rad/s, how does its amplitude compare with F₀/k?', '|A| = 2.0 ÷ √(1200² + 16²) ≈ 1.7 mm, about a third of F₀/k, and the motion is almost exactly opposite to the force.'] }],
    ['Transients', [
      'The full solution is the steady response plus a free oscillation set by how the motion started. That transient dies away in a time of about 2/γ = 2Q/ω₀. So a high-Q system has a sharp resonance but responds slowly: the time–bandwidth trade-off behind tuned circuits, filters and seismometers.'
    ], { n: 4, c: ['Why does a very sharply tuned (high-Q) circuit respond slowly when the signal changes?', 'Its transients last about 2Q/ω₀; a narrow bandwidth always comes with a long response time.'] }]
  ],
  m: [
    ['Mixing up ω₀, ω_d and the drive frequency ω.', 'ω₀ is natural, ω_d is free and damped, ω is imposed by the drive.'],
    ['Thinking the steady motion is at the natural frequency.', 'It is at the driving frequency.'],
    ['Using the amplitude decay rate for the energy.', 'Amplitude decays as e^(−γt/2); energy as e^(−γt).']
  ]
});

WL.gd('y1-coupled', {
  h: 'Hang two pendulums from a slightly springy bar and set one swinging. Over a minute it gradually stops, while the other starts swinging, and then the energy flows back. It looks complicated, but it is the sum of two very simple motions, the normal modes, each with its own fixed frequency.',
  s: [
    ['Two coupled masses', [
      'Two masses m, each tied to a wall by a spring k and to each other by a spring k′, obey mẍ₁ = −kx₁ − k′(x₁ − x₂) and mẍ₂ = −kx₂ − k′(x₂ − x₁).',
      'Add and subtract the equations. The sum x₁ + x₂ oscillates at √(k/m): the masses move together and the middle spring is never stretched. The difference x₁ − x₂ oscillates at √((k + 2k′)/m): they move in opposite directions. These are the two **normal modes**.'
    ], { n: 0, e: '\\omega_1 = \\sqrt{\\frac{k}{m}},\\qquad \\omega_2 = \\sqrt{\\frac{k + 2k\'}{m}}', x: ['Two 0.20 kg masses have k = 20 N/m each and a coupling spring k′ = 2.0 N/m. Find the two normal-mode frequencies.', ['In step: ω₁ = √(20 ÷ 0.20) = 10 rad/s.', 'Opposite: ω₂ = √((20 + 4.0) ÷ 0.20) = √120 = 10.95 rad/s.'], '10.0 rad/s and 10.95 rad/s'], c: ['In the in-step mode, why does the coupling spring make no difference?', 'Both masses move by the same amount, so the coupling spring is never stretched or squashed.'] }],
    ['Beats: energy passing back and forth', [
      'Start with one mass pulled aside and the other at rest. That is an equal mixture of the two modes. They drift in and out of step at the difference frequency Δω = ω₂ − ω₁, so the motion passes from one mass to the other and back. With weak coupling the transfer is complete, taking a time π/Δω.'
    ], { n: 1, e: 'T_{\\text{exchange}} = \\frac{\\pi}{\\Delta\\omega}', x: ['For the masses above, how long does it take for all the motion to pass from the first mass to the second?', ['Δω = 10.95 − 10.00 = 0.95 rad/s.', 'T = π ÷ 0.95 = 3.3 s.'], 'about 3.3 s'], c: ['If the coupling spring is made weaker, does the energy transfer faster or slower?', 'Slower: the two mode frequencies get closer, so Δω is smaller and π/Δω is longer.'] }],
    ['The matrix method', [
      'In general, write the equations as Mẍ = −Kx, with a mass matrix M and a stiffness matrix K. Try x = a cos ωt and you get (K − ω²M)a = 0: an eigenvalue problem. The values of ω² come from det(K − ω²M) = 0, and the eigenvectors a are the mode shapes.',
      'Because K and M are symmetric, the modes are independent (orthogonal), so any motion is one unique sum of them.'
    ], { n: 2, e: '\\det(K - \\omega^2M) = 0', x: ['Set up the two-mass system as a matrix problem and solve it.', ['K = [[k + k′, −k′], [−k′, k + k′]] and M = mI.', 'det = (k + k′ − mω²)² − k′² = 0, so k + k′ − mω² = ±k′.', 'mω² = k with a = (1, 1), or mω² = k + 2k′ with a = (1, −1): the same two modes.'], 'ω² = k/m with (1, 1); ω² = (k + 2k′)/m with (1, −1)'], c: ['Why are normal modes useful even when the starting motion is messy?', 'Any motion is a unique sum of modes, and each mode simply oscillates at its own frequency, so the whole future follows.'] }],
    ['From a chain of masses to a wave', [
      'A chain of N equal masses joined by springs between two walls has N modes, with ω_n = 2√(k/m) sin(nπ/(2(N + 1))). As N grows, the low modes become standing waves. For long wavelengths on a chain of spacing a, waves travel at a√(k/m), and in the limit the chain obeys the wave equation.'
    ], { n: 3, e: '\\omega_n = 2\\sqrt{\\frac{k}{m}}\\,\\sin\\frac{n\\pi}{2(N+1)}', x: ['Three masses with k/m = 100 s⁻² are joined in a line between two walls. Find the three mode frequencies.', ['2√(k/m) = 20 rad/s, and N + 1 = 4, so the angles are nπ/8.', 'n = 1: 20 sin 22.5° = 7.7 rad/s; n = 2: 20 sin 45° = 14.1 rad/s; n = 3: 20 sin 67.5° = 18.5 rad/s.'], '7.7, 14.1 and 18.5 rad/s'], c: ['How fast do long waves travel along a chain of masses with spacing a?', 'At v = a√(k/m).'] }],
    ['Molecules and crystals', [
      'Normal modes describe how molecules vibrate (seen as infrared lines) and how the atoms in a crystal vibrate (phonons). A chain cannot carry vibrations above 2√(k/m): at the top of the band neighbouring atoms move in antiphase, and anything faster does not travel.'
    ], { n: 4, c: ['What happens to a vibration driven at one end of the chain above 2√(k/m)?', 'It cannot travel along the chain; it dies away within a few spacings.'] }]
  ],
  m: [
    ['Giving each mass its own frequency.', 'Frequencies belong to the modes, not to the masses.'],
    ['Leaving out the mass matrix.', 'Solve det(K − ω²M) = 0, not det(K − ω²I), unless all masses are equal (then divide by m).'],
    ['Miscounting modes.', 'N masses (in one direction) have N modes.']
  ]
});

WL.gd('y1-wave-eq', {
  h: 'Flick one end of a long rope and a bump runs along it, keeping its shape. Apply Newton’s second law to one tiny piece of the rope and out comes the wave equation, the same equation that governs sound, light and earthquake waves. Its solution says that any shape simply slides along at one fixed speed.',
  s: [
    ['Newton’s law on a bit of string', [
      'Take a short piece of string between x and x + dx, with mass μ dx, under tension T. If the string’s slope is different at the two ends, the up-and-down parts of the tension do not cancel. For small slopes that difference is T(∂²y/∂x²)dx. Newton’s second law then gives the **wave equation**, with a speed set by the tension and the mass per metre.'
    ], { n: 0, e: '\\frac{\\partial^2 y}{\\partial t^2} = v^2\\frac{\\partial^2 y}{\\partial x^2},\\qquad v = \\sqrt{\\frac{T}{\\mu}}', x: ['A piano wire has a mass per length of 6.0 × 10⁻³ kg/m and a tension of 700 N. How fast do waves travel along it?', ['v = √(T/μ) = √(700 ÷ 6.0 × 10⁻³).', '= √(1.17 × 10⁵) = 342 m/s.'], 'about 340 m/s'], c: ['Why must the slopes be small for this derivation?', 'So that sin θ ≈ ∂y/∂x and the tension stays the same all along the string.'] }],
    ['Any shape slides along', [
      'd’Alembert showed that the general solution is y = f(x − vt) + g(x + vt), for any functions f and g. A shape f(x − vt) is a bump moving right at speed v without changing; g(x + vt) moves left. The starting shape and velocity fix f and g.'
    ], { n: 1, e: 'y(x,t) = f(x - vt) + g(x + vt)', x: ['Check that y = f(x − vt) solves the wave equation, for any f.', ['Let ξ = x − vt. Then ∂y/∂t = −v f′(ξ) and ∂²y/∂t² = v² f″(ξ).', 'Also ∂²y/∂x² = f″(ξ).', 'So ∂²y/∂t² = v² ∂²y/∂x², whatever f is.'], 'it works for every shape f'], c: ['A string at rest is pulled into a bump 2 cm high and released. What happens?', 'It splits into two 1 cm bumps of the same shape, running away from each other at speed v.'] }],
    ['Harmonic waves', [
      'A sine wave y = A sin(kx − ωt), with k = 2π/λ and ω = 2πf, solves the equation only if ω = vk. Since ω is proportional to k, every wavelength travels at the same speed: the string is **non-dispersive**, which is why a bump keeps its shape.'
    ], { n: 2, e: 'y = A\\sin(kx - \\omega t),\\qquad \\omega = vk', x: ['On the piano wire (v = 342 m/s), find λ, k and ω for a 440 Hz wave.', ['λ = v/f = 342 ÷ 440 = 0.777 m.', 'k = 2π/λ = 8.086 rad/m; ω = 2πf = 2765 rad/s.', 'Check: vk = 342 × 8.086 = 2765 rad/s, the same.'], 'λ = 0.78 m; k = 8.1 m⁻¹; ω = 2.8 × 10³ s⁻¹'], c: ['Why does a pulse on a string keep its shape while a pulse of deep-water waves spreads out?', 'On the string ω ∝ k, so all wavelengths travel together; water waves are dispersive, so different wavelengths separate.'] }],
    ['Standing waves and harmonics', [
      'Fix both ends of a string of length L and only standing waves sin(nπx/L) cos(ω_n t) fit, with frequencies f_n = nv/(2L): a harmonic series, which is why stringed instruments sound musical. Any motion of the string is a sum of these modes, a **Fourier series**.'
    ], { n: 3, e: 'f_n = \\frac{n v}{2L}', x: ['The piano wire is 0.80 m long. Find its first three frequencies.', ['f₁ = 342 ÷ (2 × 0.80) = 214 Hz.', 'f₂ = 428 Hz, f₃ = 641 Hz.'], '214, 428 and 641 Hz'], c: ['To raise a string’s fundamental by an octave, how must its tension change?', 'f ∝ v ∝ √T, so the tension must be multiplied by 4.'] }],
    ['Energy and impedance', [
      'A travelling sine wave carries power P = ½μvω²A² along the string. The quantity Z = μv = √(Tμ) acts as an **impedance**: where two strings join, part of a wave reflects, with amplitude ratio r = (Z₁ − Z₂)/(Z₁ + Z₂). A fixed end reflects it upside down; a free end, the right way up.'
    ], { n: 4, e: 'P = \\tfrac12\\mu v\\,\\omega^2 A^2,\\qquad r = \\frac{Z_1 - Z_2}{Z_1 + Z_2}', x: ['What power does a 440 Hz wave of amplitude 1.0 mm carry along the piano wire?', ['μv = 6.0 × 10⁻³ × 342 = 2.05 kg/s.', 'ω²A² = 2765² × (1.0 × 10⁻³)² = 7.6.', 'P = ½ × 2.05 × 7.6 = 7.8 W.'], 'about 8 W'], c: ['A wave on a light string reaches a string four times heavier per metre, at the same tension. What fraction of the amplitude reflects?', 'Z ∝ √μ, so Z₂ = 2Z₁ and r = (1 − 2) ÷ (1 + 2) = −⅓: a third, upside down.'] }]
  ],
  m: [
    ['Using the total mass instead of the mass per length.', 'μ is mass per metre of string.'],
    ['Thinking the string itself travels along with the wave.', 'Each bit moves up and down; only the shape travels.'],
    ['Forgetting the inversion at a fixed end.', 'A fixed end reflects the wave upside down.']
  ]
});

WL.gd('y1-optics', {
  h: 'Oil on a wet road shows rainbow colours, good camera lenses look faintly purple, and no telescope can split two stars that sit too close together. All three come from light behaving as a wave: compare the paths that different parts of a wave take to a point, and you know whether they add up or cancel.',
  s: [
    ['Thin films', [
      'Light reflects from both the top and the bottom of a thin film of index n and thickness t. At normal incidence the second reflection travels an extra 2nt. Reflection off a medium of higher index also flips the wave (a phase shift of π, worth half a wavelength).',
      'For a soap film in air only the top reflection is flipped, so reflection is bright when 2nt = (m + ½)λ. When both reflections are flipped, as for a coating on glass, the condition swaps.'
    ], { n: 0, e: '2nt = \\left(m + \\tfrac12\\right)\\lambda\\quad(\\text{bright, one flip})', x: ['How thick should a magnesium fluoride coating (n = 1.38) on glass (n = 1.5) be to cancel the reflection of 550 nm light?', ['Both reflections go from lower to higher index, so both are flipped: the flips cancel out.', 'For the reflections to cancel, the extra path must be half a wavelength: 2nt = λ/2.', 't = λ/(4n) = 550 ÷ (4 × 1.38) = 100 nm.'], 'about 100 nm'], c: ['Why does a soap film look black just before it bursts?', 'It is so thin that the path difference is almost zero, so the one flip makes the two reflections cancel for every colour.'] }],
    ['Diffraction at a single slit', [
      'Treat every point across a slit of width a as a source. At angle θ, pair each point with the one a/2 below it: they cancel when a sin θ = mλ (m = ±1, ±2, …). So the central bright band is twice as wide as the others, which are much fainter.'
    ], { n: 1, e: 'a\\sin\\theta = m\\lambda\\ (\\text{minima})', x: ['633 nm laser light passes through a 0.10 mm slit onto a screen 2.0 m away. How wide is the central bright band?', ['First minimum: sin θ = 633 × 10⁻⁹ ÷ 1.0 × 10⁻⁴ = 6.3 × 10⁻³, a small angle.', 'On the screen: 2.0 m × 6.3 × 10⁻³ = 12.7 mm from the centre.', 'The central band runs from −12.7 mm to +12.7 mm.'], 'about 25 mm wide'], c: ['If the slit is made narrower, what happens to the central band?', 'It gets wider: a smaller a means a larger angle for the first minimum.'] }],
    ['Gratings and resolving power', [
      'A grating of N slits with spacing d gives sharp bright lines where every path differs by whole wavelengths: d sin θ = mλ. The more slits, the sharper the lines. The **resolving power**, how small a difference in wavelength it can separate, is λ/Δλ = mN.'
    ], { n: 2, e: 'd\\sin\\theta = m\\lambda,\\qquad \\frac{\\lambda}{\\Delta\\lambda} = mN', x: ['Sodium light has two lines at 589.0 nm and 589.6 nm. How many slits must be lit to separate them in the first order?', ['λ/Δλ = 589.3 ÷ 0.6 = 982.', 'In the first order, N ≥ 982 slits.'], 'about 1000 slits'], c: ['A grating has 600 lines per mm, and 2.0 cm of it is lit. What is its resolving power in the second order?', 'N = 600 × 20 = 12 000, so mN = 24 000.'] }],
    ['Round apertures and the Rayleigh criterion', [
      'Light through a round opening of diameter D spreads into a bright disc with dark rings; the first dark ring is at sin θ = 1.22λ/D. Two point sources can just be told apart when the centre of one pattern falls on the first dark ring of the other.'
    ], { n: 3, e: '\\theta_{\\min} = 1.22\\frac{\\lambda}{D}', x: ['What is the smallest angle the Hubble Space Telescope (D = 2.4 m) can resolve at 550 nm?', ['θ = 1.22 × 550 × 10⁻⁹ ÷ 2.4 = 2.8 × 10⁻⁷ rad.', 'In arcseconds: × 206 265 = 0.058″.'], '2.8 × 10⁻⁷ rad, about 0.06 arcseconds'], c: ['Your pupil is 3.0 mm across. From how far away can you just tell a car’s two headlights (1.5 m apart) apart, at 550 nm?', 'θ = 1.22 × 550 × 10⁻⁹ ÷ 3.0 × 10⁻³ = 2.2 × 10⁻⁴ rad, so the distance is 1.5 ÷ 2.2 × 10⁻⁴ ≈ 7 km.'] }],
    ['When the formulas work', [
      'These are far-field (Fraunhofer) results, good when a²/(λL) ≪ 1 for an opening of size a seen from a distance L, or when a lens focuses the pattern. Closer in, the pattern is different. Interference also needs the path difference to be shorter than the light’s coherence length, only about a micrometre for sunlight.'
    ], { n: 4, x: ['Is the slit pattern above (a = 0.10 mm, L = 2.0 m, 633 nm) in the far field?', ['a²/(λL) = (1.0 × 10⁻⁴)² ÷ (633 × 10⁻⁹ × 2.0) = 1.0 × 10⁻⁸ ÷ 1.27 × 10⁻⁶.', '= 0.008, much less than 1.'], 'yes: the far-field formulas apply'], c: ['Why do only very thin films show colours in sunlight?', 'In a thicker film the path difference exceeds sunlight’s coherence length of about a micrometre, so the colours wash out.'] }]
  ],
  m: [
    ['Forgetting the phase flip on reflection.', 'Reflection off a higher-index medium flips the wave; count the flips.'],
    ['Using a sin θ = mλ for the bright fringes of a single slit.', 'It gives the dark minima.'],
    ['Using small-angle approximations at large angles.', 'Use sin θ itself when the angle is not small.']
  ]
});

WL.gd('y1-gauss', {
  h: 'If lightning strikes your car you are safe inside, because the field inside a closed metal shell is zero. Gauss’s law explains why. It says the total electric flux out of any closed surface equals the charge inside divided by ε₀, whatever the surface’s size or shape. It is Coulomb’s law rewritten so that symmetry does the work.',
  s: [
    ['Electric flux', [
      'The **flux** of E through a surface adds up, for each small patch, the part of E at right angles to the patch times its area: Φ = ∫E·dA. For a closed surface dA points outwards, so field lines leaving count as positive and lines entering as negative.'
    ], { n: 0, e: '\\Phi_E = \\oint_S \\mathbf E\\cdot d\\mathbf A', x: ['A uniform field of 500 N/C passes through a flat 0.20 m × 0.30 m rectangle whose normal is at 60° to the field. What is the flux?', ['Area = 0.060 m².', 'Φ = EA cos 60° = 500 × 0.060 × 0.5 = 15 N m²/C.'], '15 N m²/C'], c: ['What is the total flux of a uniform field through a closed cube?', 'Zero: as much flux enters through one side as leaves through the other.'] }],
    ['Why the size and shape do not matter', [
      'For a point charge, the field falls as 1/r² while the area of a sphere grows as r², so the flux through every sphere around it is the same, q/ε₀. Any other closed surface around the charge covers the same total solid angle, so it gets the same flux; a charge outside sends in as many field lines as it sends out. Adding up charges gives **Gauss’s law**.'
    ], { n: 1, e: '\\oint_S \\mathbf E\\cdot d\\mathbf A = \\frac{Q_{\\text{enc}}}{\\varepsilon_0},\\qquad \\nabla\\cdot\\mathbf E = \\frac{\\rho}{\\varepsilon_0}', x: ['A 2.0 nC charge sits at the centre of a cube of side 0.50 m. Find the flux through the whole cube and through one face.', ['Total: Φ = Q/ε₀ = 2.0 × 10⁻⁹ ÷ 8.85 × 10⁻¹² = 226 N m²/C.', 'By symmetry each of the 6 faces gets a sixth: 37.7 N m²/C.'], '226 N m²/C in all; 38 per face'], c: ['If the charge moves off-centre but stays inside the cube, does the total flux change?', 'No: only the enclosed charge matters. (The share through each face does change.)'] }],
    ['Using symmetry to find fields', [
      'Gauss’s law always holds, but it gives E directly only when symmetry makes E the same size and at right angles (or parallel) over a well-chosen surface. Then the integral becomes E times an area. Spheres suit point and spherical charges, cylinders suit long lines, and flat boxes suit large sheets.'
    ], { n: 2, e: 'E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}\\ (\\text{line}),\\qquad E = \\frac{\\sigma}{2\\varepsilon_0}\\ (\\text{sheet})', x: ['Find the field at distance r from a long straight wire carrying charge λ per metre, and evaluate it for λ = 5.0 nC/m at r = 0.10 m.', ['Use a cylinder of radius r and length L around the wire. By symmetry E points straight out and is the same everywhere on the curved side; the ends get no flux.', 'Gauss: E × 2πrL = λL/ε₀, so E = λ/(2πε₀r).', 'E = 5.0 × 10⁻⁹ ÷ (2π × 8.85 × 10⁻¹² × 0.10) = 900 N/C.'], 'E = λ/(2πε₀r); 900 N/C'], c: ['Why can Gauss’s law alone not give the field of a short charged rod?', 'There is no symmetry that makes E constant over any convenient closed surface, so the integral cannot be undone.'] }],
    ['Conductors', [
      'In a conductor at equilibrium the field inside is zero; otherwise charges would still be moving. Gauss’s law then forces any extra charge onto the surface, and the field just outside is σ/ε₀, at right angles to the surface. A hollow conductor shields its inside from outside fields: a **Faraday cage**.'
    ], { n: 3, e: 'E_{\\text{surface}} = \\frac{\\sigma}{\\varepsilon_0}', x: ['A conducting sphere of radius 0.10 m carries 10 nC. Find the surface charge density and the field just outside.', ['σ = Q/(4πR²) = 10 × 10⁻⁹ ÷ (4π × 0.010) = 8.0 × 10⁻⁸ C/m².', 'E = σ/ε₀ = 8.0 × 10⁻⁸ ÷ 8.85 × 10⁻¹² = 9.0 × 10³ N/C.', 'Check with a point charge at the centre: kQ/R² = 8.99 × 10⁹ × 10⁻⁸ ÷ 0.010 = 9.0 × 10³ N/C.'], '9000 N/C'], c: ['Why are you safe inside a car struck by lightning?', 'Its metal body acts as a Faraday cage: the charge flows over the outside and the field inside stays nearly zero.'] }],
    ['The same law for gravity', [
      'Newton’s gravity is also an inverse-square law, so the same reasoning gives ∮g·dA = −4πGM_enc. Inside a planet of uniform density only the mass closer to the centre than you pulls on you, so g grows in proportion to r, from zero at the centre.'
    ], { n: 4, e: '\\oint \\mathbf g\\cdot d\\mathbf A = -4\\pi G M_{\\text{enc}}', c: ['If the Earth had uniform density, what would g be halfway to its centre?', 'Half the surface value, about 4.9 N/kg, since g ∝ r inside.'] }]
  ],
  m: [
    ['Thinking Gauss’s law only holds when there is symmetry.', 'It always holds; symmetry is only needed to solve it for E.'],
    ['Counting charges outside the surface.', 'Only the enclosed charge appears.'],
    ['Forgetting that E = 0 inside a conductor only at equilibrium.', 'While charges are moving, there is a field inside.']
  ]
});
WL.gd('y1-potential', {
  h: 'Lightning conductors are sharp, while the dome of a high-voltage generator is smooth and round. The reason lies in the electric potential: energy per unit charge, a single number at each point whose downhill slope is the field. Conductors at rest are regions of constant potential, and that one fact explains shielding, sharp points and how capacitors store energy.',
  s: [
    ['Potential and field', [
      'The potential difference between two points is minus the line integral of E between them. Turned round, the field is the downhill gradient of the potential: E = −∇V. Because the electrostatic field is conservative, this single number at each point describes the field completely.',
      '**Equipotential** surfaces are everywhere at right angles to the field lines, and moving a charge along one takes no work. For a point charge, V = q/(4πε₀r).'
    ], { n: 0, e: 'V(\\mathbf b) - V(\\mathbf a) = -\\int_{\\mathbf a}^{\\mathbf b}\\mathbf E\\cdot d\\mathbf l,\\qquad \\mathbf E = -\\nabla V', x: ['In a region the potential is V = 3x²y − 2y volts (x, y in metres). Find the field at (1, 2).', ['E_x = −∂V/∂x = −6xy; E_y = −∂V/∂y = −(3x² − 2).', 'At (1, 2): E_x = −12 V/m and E_y = −(3 − 2) = −1 V/m.'], 'E = (−12, −1) V/m'], c: ['How much work does it take to move a charge along an equipotential?', 'None: its potential energy qV does not change.'] }],
    ['Conductors at equilibrium', [
      'In a conductor at rest, the field inside is zero, or charges would still be moving. So the whole conductor is at one potential. By Gauss’s law any extra charge sits on the surface, and the field just outside is at right angles to it, with size σ/ε₀.'
    ], { n: 1, x: ['A +5.0 nC point charge sits in a cavity inside an uncharged conducting shell. What charges appear on the shell’s inner and outer surfaces?', ['Take a Gaussian surface inside the metal: E = 0 there, so it encloses no net charge.', 'So the inner surface must carry −5.0 nC.', 'The shell is neutral overall, so the outer surface carries +5.0 nC.'], '−5.0 nC inside, +5.0 nC outside'], c: ['Why must the field just outside a conductor be at right angles to its surface?', 'Any part along the surface would push charges along it, and they would move until that part vanished.'] }],
    ['Capacitance', [
      'Two conductors carrying +Q and −Q, with p.d. V between them, form a capacitor of capacitance C = Q/V, which depends only on the shapes and on any insulator between them. Parallel plates: C = κε₀A/d, where κ is the dielectric constant. An isolated sphere: C = 4πε₀R.'
    ], { n: 2, e: 'C = \\frac{Q}{V},\\qquad C_{\\text{plates}} = \\frac{\\kappa\\varepsilon_0A}{d}', x: ['Find the capacitance of the Earth as an isolated sphere (R = 6.37 × 10⁶ m), and of two 1.0 m² plates 1.0 mm apart in air.', ['Earth: C = 4π × 8.85 × 10⁻¹² × 6.37 × 10⁶ = 7.1 × 10⁻⁴ F.', 'Plates: C = 8.85 × 10⁻¹² × 1.0 ÷ 1.0 × 10⁻³ = 8.85 × 10⁻⁹ F.'], 'Earth about 710 μF; the plates 8.9 nF'], c: ['A dielectric with κ = 4 is slid between the plates of an isolated charged capacitor. What happens to the p.d.?', 'C becomes 4 times larger with the same Q, so V = Q/C falls to a quarter.'] }],
    ['Energy in the field', [
      'Charging a capacitor means carrying each extra bit of charge dq across the p.d. q/C already there. Adding it all up gives U = Q²/2C = ½CV². The energy lives in the field itself, with energy density ½ε₀E² per cubic metre.'
    ], { n: 3, e: 'U = \\tfrac12CV^2,\\qquad u = \\tfrac12\\varepsilon_0E^2', x: ['The 8.85 nF plates above are charged to 1000 V. Find the stored energy two ways.', ['U = ½CV² = ½ × 8.85 × 10⁻⁹ × 1000² = 4.4 × 10⁻³ J.', 'Field: E = V/d = 10⁶ V/m, so u = ½ × 8.85 × 10⁻¹² × 10¹² = 4.4 J/m³.', 'Times the volume between the plates, 1.0 × 10⁻³ m³: 4.4 × 10⁻³ J, the same.'], '4.4 mJ'], c: ['Where is the energy of a charged capacitor stored?', 'In the electric field between the plates.'] }],
    ['Sharp points', [
      'Connect two conducting spheres by a wire: they reach the same potential, so Q/R is the same for both. The smaller sphere carries less charge but a higher charge density, and the field at its surface, proportional to 1/R, is stronger. On any conductor the field is strongest at the sharpest points.'
    ], { n: 4, x: ['Spheres of radius 10 cm and 1.0 cm are joined by a long wire and share 22 nC. Find each charge and compare their surface fields.', ['Same potential: Q₁/0.10 = Q₂/0.010, so Q₁ = 10Q₂. With Q₁ + Q₂ = 22 nC: Q₁ = 20 nC, Q₂ = 2.0 nC.', 'Large: E = kQ/R² = 8.99 × 10⁹ × 20 × 10⁻⁹ ÷ 0.010 = 1.8 × 10⁴ V/m.', 'Small: E = 8.99 × 10⁹ × 2.0 × 10⁻⁹ ÷ 1.0 × 10⁻⁴ = 1.8 × 10⁵ V/m, ten times stronger.'], '20 nC and 2 nC; the small sphere’s field is 10 times stronger'], c: ['Why are lightning conductors pointed?', 'The very strong field at the point ionises the air, letting charge leak away gently and giving the strike a safe path.'] }]
  ],
  m: [
    ['Dropping the minus sign in E = −∇V.', 'The field points downhill in potential.'],
    ['Thinking a conductor’s potential must be zero.', 'It is constant throughout, not necessarily zero.'],
    ['Forgetting the dielectric constant.', 'A dielectric multiplies the capacitance by κ.']
  ]
});

WL.gd('y1-magnetostatics', {
  h: 'In 1820 Ørsted noticed a compass needle twitch whenever a nearby wire carried current: currents make magnetic fields. The Biot–Savart law builds that field piece by piece from every bit of current, like Coulomb’s law for charges, and Ampère’s law gets it in a single line whenever the arrangement is symmetrical enough.',
  s: [
    ['The Biot–Savart law', [
      'A small piece of current I dl, at displacement r from a point, contributes a field at right angles to both dl and r, falling off as 1/r². Add up (integrate) the contributions round the whole circuit to get B.'
    ], { n: 0, e: 'd\\mathbf B = \\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\mathbf l\\times\\hat{\\mathbf r}}{r^2}', x: ['Find the field at the centre of a circular loop of radius R carrying current I, and evaluate it for R = 5.0 cm, I = 3.0 A.', ['Every piece dl is at distance R and at right angles to r̂, so each gives dB = μ₀I dl/(4πR²), all pointing along the axis.', 'Adding round the loop, ∫dl = 2πR: B = μ₀I/(2R).', 'B = 4π × 10⁻⁷ × 3.0 ÷ 0.10 = 3.8 × 10⁻⁵ T, about the strength of the Earth’s field.'], 'B = μ₀I/2R; 3.8 × 10⁻⁵ T'], c: ['What field does a piece of current make at a point straight ahead of it, along its own direction?', 'None: dl × r̂ = 0 when they are parallel.'] }],
    ['Fields worth knowing', [
      'A long straight wire: B = μ₀I/(2πr), in circles round the wire. The centre of a loop: μ₀I/(2R). A long solenoid with n turns per metre: μ₀nI inside, nearly zero outside. A toroid: μ₀NI/(2πr) inside.'
    ], { n: 1, e: 'B_{\\text{wire}} = \\frac{\\mu_0 I}{2\\pi r},\\qquad B_{\\text{solenoid}} = \\mu_0 nI', x: ['A power cable carries 100 A. What is the field 1.0 m away?', ['B = μ₀I/(2πr) = 2 × 10⁻⁷ × 100 ÷ 1.0.', '= 2.0 × 10⁻⁵ T, about half the Earth’s field.'], '2.0 × 10⁻⁵ T'], c: ['How far from a wire carrying 10 A is its field equal to the Earth’s (5 × 10⁻⁵ T)?', 'r = 2 × 10⁻⁷ × 10 ÷ 5 × 10⁻⁵ = 0.04 m: 4 cm.'] }],
    ['Ampère’s law', [
      'For steady currents, the line integral of B round any closed loop equals μ₀ times the current passing through the loop. When symmetry makes B constant along a well-chosen loop, the integral becomes B times a length, and the field drops out in one line.'
    ], { n: 2, e: '\\oint\\mathbf B\\cdot d\\mathbf l = \\mu_0 I_{\\text{enc}},\\qquad \\nabla\\times\\mathbf B = \\mu_0\\mathbf J', x: ['Use a rectangular loop to find the field inside a long solenoid, then evaluate it for 800 turns on a 0.40 m length carrying 2.0 A.', ['Take a rectangle with one side of length ℓ inside the coil along its axis and one side outside. Only the inside side contributes: Bℓ.', 'It encloses nℓ turns, each carrying I: Bℓ = μ₀nℓI, so B = μ₀nI.', 'n = 800 ÷ 0.40 = 2000 per metre: B = 4π × 10⁻⁷ × 2000 × 2.0 = 5.0 × 10⁻³ T.'], 'B = μ₀nI; 5.0 mT'], c: ['Inside a thick straight wire of radius a carrying a uniform current I, how does B depend on r?', 'A circle of radius r < a encloses I r²/a², so B = μ₀Ir/(2πa²): it grows in proportion to r.'] }],
    ['No magnetic charges', [
      'Magnetic field lines always close on themselves: the total flux of B out of any closed surface is zero, ∇·B = 0. No isolated north or south pole (a magnetic monopole) has ever been found.'
    ], { n: 3, e: '\\oint\\mathbf B\\cdot d\\mathbf A = 0', c: ['A bar magnet is cut in half. What do you get?', 'Two smaller magnets, each with its own north and south pole.'] }],
    ['Forces between currents', [
      'Each of two long parallel wires sits in the other’s field, so they push or pull with force per metre μ₀I₁I₂/(2πd): currents in the same direction attract, opposite directions repel.'
    ], { n: 4, e: '\\frac{F}{L} = \\frac{\\mu_0 I_1I_2}{2\\pi d}', x: ['The two wires in a power cord are 5.0 mm apart and carry 15 A in opposite directions. Find the force per metre between them.', ['F/L = 2 × 10⁻⁷ × 15 × 15 ÷ 0.0050.', '= 9.0 × 10⁻³ N/m, pushing them apart.'], '9 mN per metre, repulsive'], c: ['Two wires carry currents in the same direction. Do they attract or repel?', 'They attract.'] }]
  ],
  m: [
    ['Using the straight-wire formula for a loop or coil.', 'Each shape has its own result; use Biot–Savart or Ampère to get it.'],
    ['Using Ampère’s law without enough symmetry.', 'It always holds, but only gives B directly when B is constant along the loop.'],
    ['Using the total number of turns as n.', 'n is turns per metre: N/ℓ.']
  ]
});

WL.gd('y1-faraday', {
  h: 'Your phone charges wirelessly, an induction hob heats the pan but not your hand, and an electric guitar’s pickup turns a vibrating string into a signal. All use Faraday’s discovery: a changing magnetic flux drives an e.m.f. Behind it is a new kind of electric field that circulates, and coils that resist any change in their own current.',
  s: [
    ['Faraday’s law', [
      'The magnetic flux through a surface is Φ = ∫B·dA. The e.m.f. round a circuit equals minus the rate of change of the flux through it; for a coil of N turns, multiply by N. The minus sign is **Lenz’s law**: the induced current opposes the change that caused it.'
    ], { n: 0, e: '\\mathcal E = -N\\frac{d\\Phi}{dt},\\qquad \\nabla\\times\\mathbf E = -\\frac{\\partial\\mathbf B}{\\partial t}', x: ['A 100-turn coil of area 0.0020 m² sits at right angles to a field B = 0.050 sin(2π × 50t) T. What is the peak e.m.f.?', ['Φ = BA, so ℰ = −NA dB/dt = −NA × 0.050 × 2π × 50 cos(2π × 50t).', 'Peak = 100 × 0.0020 × 0.050 × 314 = 3.1 V.'], 'about 3.1 V'], c: ['A coil sits in a very strong but steady field. Is there an e.m.f.?', 'No: the flux is not changing.'] }],
    ['Two mechanisms, one law', [
      'If a conductor moves through a steady field, the e.m.f. comes from the magnetic force on its charges: ℰ = BLv for a sliding rod. If the field itself changes, a new **induced electric field** pushes the charges, and it circulates: its line integral round a loop is not zero. So it is not conservative and has no potential.'
    ], { n: 1, e: '\\mathcal E = BLv', x: ['A 0.50 m rod slides at 4.0 m/s along rails in a 0.30 T field; the circuit resistance is 2.0 Ω. Find the current, the force needed to keep it moving, and check the energy.', ['ℰ = BLv = 0.30 × 0.50 × 4.0 = 0.60 V, so I = 0.60 ÷ 2.0 = 0.30 A.', 'The field pushes back on the current: F = BIL = 0.30 × 0.30 × 0.50 = 0.045 N.', 'Mechanical power Fv = 0.045 × 4.0 = 0.18 W = I²R = 0.09 × 2.0 = 0.18 W.'], '0.30 A; 0.045 N; 0.18 W in and out'], c: ['Can an induced electric field be written as E = −∇V?', 'No: its line integral round a closed loop is the e.m.f., not zero, so no potential exists.'] }],
    ['Inductance', [
      'A current in a coil sends flux through the coil itself. The **self-inductance** is L = NΦ/I, and a changing current induces ℰ = −L dI/dt, opposing the change. A long solenoid has L = μ₀N²A/ℓ.'
    ], { n: 2, e: '\\mathcal E = -L\\frac{dI}{dt},\\qquad L_{\\text{sol}} = \\frac{\\mu_0N^2A}{\\ell}', x: ['A 0.20 m solenoid has 500 turns and cross-section 4.0 cm². Find L, and the e.m.f. if a 2.0 A current is switched off in 1.0 ms.', ['L = 4π × 10⁻⁷ × 500² × 4.0 × 10⁻⁴ ÷ 0.20 = 6.3 × 10⁻⁴ H.', 'ℰ = L × ΔI/Δt = 6.3 × 10⁻⁴ × 2.0 ÷ 1.0 × 10⁻³ = 1.3 V.'], '0.63 mH; 1.3 V'], c: ['Why can opening a switch in a circuit with a big coil make a spark?', 'The current drops almost instantly, so −L dI/dt is huge, and that voltage can jump the gap.'] }],
    ['RL and LC circuits', [
      'Connect a battery to a resistor and an inductor: the current rises smoothly, I = (ℰ/R)(1 − e^(−t/τ)), with τ = L/R. Connect a charged capacitor to an inductor: charge sloshes back and forth at ω = 1/√(LC), with the energy passing between the capacitor’s electric field and the inductor’s magnetic field, just like a mass on a spring.'
    ], { n: 3, e: '\\tau = \\frac{L}{R},\\qquad \\omega = \\frac{1}{\\sqrt{LC}}', x: ['Find τ for L = 10 mH with R = 5.0 Ω, and the frequency of L = 10 mH with C = 1.0 μF.', ['τ = L/R = 0.010 ÷ 5.0 = 2.0 ms.', 'ω = 1/√(0.010 × 1.0 × 10⁻⁶) = 1/√(10⁻⁸) = 10⁴ rad/s.', 'f = ω/2π = 1.6 kHz.'], '2.0 ms; 1.6 kHz'], c: ['In an LC circuit, where is the energy when the capacitor has no charge?', 'All in the inductor’s magnetic field: the current is at its largest then.'] }],
    ['Magnetic energy', [
      'Building up a current I against the back e.m.f. stores energy U = ½LI². It lives in the magnetic field, with energy density B²/2μ₀ per cubic metre.'
    ], { n: 4, e: 'U = \\tfrac12LI^2,\\qquad u_B = \\frac{B^2}{2\\mu_0}', x: ['Compare the energy density of a 1.0 T magnetic field with that of an electric field of 3 × 10⁶ V/m, about the most air can hold before sparking.', ['Magnetic: u = 1.0² ÷ (2 × 4π × 10⁻⁷) = 4.0 × 10⁵ J/m³.', 'Electric: u = ½ε₀E² = ½ × 8.85 × 10⁻¹² × (3 × 10⁶)² = 40 J/m³.', 'The magnetic field stores about ten thousand times more.'], '4 × 10⁵ J/m³ against 40 J/m³'], c: ['A 0.50 H inductor carries 4.0 A. How much energy does it store?', '½ × 0.50 × 4.0² = 4.0 J.'] }]
  ],
  m: [
    ['Forgetting the number of turns.', 'A coil of N turns has N times the e.m.f. of one turn.'],
    ['Treating the induced field as conservative.', 'It circulates; it has no potential.'],
    ['Ignoring the back e.m.f. of an inductor when current changes fast.', 'ℰ = −L dI/dt can be very large.']
  ]
});

WL.gd('y1-maxwell', {
  h: 'In 1865 James Clerk Maxwell added one small term to Ampère’s law to fix a contradiction. With it, his four equations predicted waves of electric and magnetic field travelling at 3.0 × 10⁸ m/s, which was exactly the measured speed of light. Light, he concluded, is an electromagnetic wave.',
  s: [
    ['The displacement current', [
      'While a capacitor charges, current flows in the wires but not across the gap. Ampère’s law then gives different answers for a surface the wire passes through and one that passes through the gap. Maxwell added a term: a changing electric flux acts like a current, I_d = ε₀ dΦ_E/dt, which in the gap equals the current in the wire exactly.'
    ], { n: 0, e: 'I_d = \\varepsilon_0\\frac{d\\Phi_E}{dt}', x: ['A capacitor with circular plates of radius 5.0 cm charges with a 2.0 A current. Find the magnetic field at the edge of the gap.', ['The displacement current through the gap is 2.0 A, the same as in the wire.', 'Ampère–Maxwell round a circle of radius 5.0 cm: B × 2πr = μ₀I_d.', 'B = 2 × 10⁻⁷ × 2.0 ÷ 0.050 = 8.0 × 10⁻⁶ T.'], '8.0 μT'], c: ['Is the displacement current a flow of charge?', 'No: it is a changing electric field, which makes a magnetic field just as a current would.'] }],
    ['The four equations', [
      'Gauss’s law for E; no magnetic monopoles; Faraday’s law; and the Ampère–Maxwell law. Taking the divergence of the last and using the first gives ∂ρ/∂t + ∇·J = 0: conservation of charge is built in.'
    ], { n: 1, e: '\\nabla\\cdot\\mathbf E = \\frac{\\rho}{\\varepsilon_0},\\quad \\nabla\\cdot\\mathbf B = 0,\\quad \\nabla\\times\\mathbf E = -\\frac{\\partial\\mathbf B}{\\partial t},\\quad \\nabla\\times\\mathbf B = \\mu_0\\mathbf J + \\mu_0\\varepsilon_0\\frac{\\partial\\mathbf E}{\\partial t}', c: ['Which of the four equations says there are no magnetic monopoles?', '∇·B = 0.'] }],
    ['Electromagnetic waves', [
      'In empty space, take the curl of Faraday’s law and put in the Ampère–Maxwell law: every component of E and B obeys the wave equation, with speed c = 1/√(μ₀ε₀). The waves are transverse: E, B and the direction of travel are all at right angles, and |E| = c|B|.'
    ], { n: 2, e: 'c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}},\\qquad E = cB', x: ['Calculate c from μ₀ = 4π × 10⁻⁷ H/m and ε₀ = 8.854 × 10⁻¹² F/m, and find B in a wave with E = 100 V/m.', ['μ₀ε₀ = 4π × 10⁻⁷ × 8.854 × 10⁻¹² = 1.113 × 10⁻¹⁷ s²/m².', 'c = 1/√(1.113 × 10⁻¹⁷) = 3.00 × 10⁸ m/s.', 'B = E/c = 100 ÷ 3.00 × 10⁸ = 3.3 × 10⁻⁷ T.'], 'c = 3.00 × 10⁸ m/s; B = 0.33 μT'], c: ['A plane wave travels in the +z direction with E along x. Which way does B point?', 'Along +y, so that E × B points along +z.'] }],
    ['Energy and momentum in the wave', [
      'The **Poynting vector** S = E × B/μ₀ gives the energy flowing through each square metre per second. For a wave of amplitude E₀ the intensity is ½cε₀E₀². The wave also carries momentum: it presses on an absorbing surface with pressure I/c (2I/c on a mirror).'
    ], { n: 3, e: '\\mathbf S = \\frac{\\mathbf E\\times\\mathbf B}{\\mu_0},\\qquad I = \\tfrac12c\\varepsilon_0E_0^2', x: ['Sunlight at the Earth has an intensity of 1360 W/m². Find the amplitude of its electric field and its pressure on a black surface.', ['E₀ = √(2I/(cε₀)) = √(2720 ÷ (3.00 × 10⁸ × 8.85 × 10⁻¹²)) = √(1.02 × 10⁶) = 1.0 × 10³ V/m.', 'Pressure = I/c = 1360 ÷ 3.00 × 10⁸ = 4.5 × 10⁻⁶ Pa.'], 'about 1000 V/m; 4.5 μPa'], c: ['Why does a mirror feel twice the radiation pressure of a black surface?', 'The light’s momentum is reversed, not just stopped, so the change of momentum is doubled.'] }],
    ['Energy enters a wire from the side', [
      'In a wire carrying current through a resistance, E points along the wire and B circles round it, so the Poynting vector points into the wire from the side. Adding it up over the wire’s surface gives exactly VI. The energy heating the wire flows in through the field around it, not along the inside of the metal.'
    ], { n: 4, x: ['Show that the Poynting flux into a wire of length ℓ and radius a, with p.d. V and current I, is VI.', ['At the surface E = V/ℓ along the wire and B = μ₀I/(2πa) round it.', 'S = EB/μ₀ = (V/ℓ) × I/(2πa), pointing inwards.', 'Times the surface area 2πaℓ: (V/ℓ)(I/2πa)(2πaℓ) = VI.'], 'exactly VI flows in from the field'], c: ['So how does energy get from a battery to a lamp?', 'Through the electric and magnetic fields around the wires; the wires guide it.'] }]
  ],
  m: [
    ['Thinking only currents make magnetic fields.', 'A changing electric field makes one too.'],
    ['Writing E = B for a wave.', 'In SI units E = cB.'],
    ['Forgetting the ½ in the intensity.', 'The time-averaged intensity is ½cε₀E₀².']
  ]
});

WL.gd('y1-sr', {
  h: 'Muons made by cosmic rays 15 km up live, on average, only 2.2 μs, yet huge numbers reach the ground. They should not get that far, unless their clocks run slow. Einstein showed that if light has the same speed for everyone, moving clocks must tick more slowly, and the proof needs nothing more than a light clock and Pythagoras.',
  s: [
    ['Two postulates', [
      'Einstein assumed only two things: the laws of physics are the same in every inertial (unaccelerated) frame, and light in a vacuum travels at the same speed c for every inertial observer, however the source moves. Everything else in special relativity follows from these.'
    ], { n: 0, c: ['A spaceship moving at 0.5c switches on its headlight. How fast does the light travel according to an observer on Earth?', 'At c, not 1.5c: the second postulate.'] }],
    ['The light clock', [
      'Light bounces between two mirrors a distance L apart. In the clock’s own frame each tick takes Δτ = 2L/c. Seen from a frame where the clock moves at v, the light must travel a longer, diagonal path at the same speed c, so each tick takes longer. Pythagoras on that path gives Δt = γΔτ, with γ = 1/√(1 − v²/c²).'
    ], { n: 1, e: '\\Delta t = \\gamma\\,\\Delta\\tau,\\qquad \\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}', x: ['Muons move at 0.995c and live 2.2 μs on average in their own frame. How long do they live in the Earth’s frame, and how far do they travel?', ['γ = 1/√(1 − 0.995²) = 1/√0.00998 = 10.0.', 'Δt = 10.0 × 2.2 μs = 22 μs.', 'Distance = 0.995 × 3.00 × 10⁸ × 22 × 10⁻⁶ = 6.6 km, instead of 0.66 km without time dilation.'], '22 μs; 6.6 km'], c: ['A clock moves at 0.6c. How long does each of its 1.0 s ticks take in the frame it moves through?', 'γ = 1/√(1 − 0.36) = 1.25, so 1.25 s.'] }],
    ['Proper time and the interval', [
      'The time shown by a clock carried between two events is its **proper time** τ. All inertial observers disagree about Δt and Δx separately, but they all agree on the **spacetime interval**, and for a clock present at both events it equals its proper time.'
    ], { n: 2, e: 'c^2\\Delta\\tau^2 = c^2\\Delta t^2 - \\Delta x^2', x: ['An astronaut travels at 0.6c to a star 6.0 light-years away. How long does the trip take by Earth’s clocks and by hers?', ['Earth: Δt = 6.0 ly ÷ 0.6c = 10 years.', 'Her clock: Δτ = √(10² − 6.0²) = √64 = 8.0 years (in units where c = 1 ly per year).', 'Check: Δt/γ = 10 ÷ 1.25 = 8.0 years.'], '10 years by Earth clocks; 8.0 years by hers'], c: ['Who measures the proper time between two events?', 'A clock that is present at both events.'] }],
    ['Length contraction and simultaneity', [
      'A rod moving along its length is measured shorter, L = L₀/γ. And events that happen at the same time in one frame happen at different times in another: for a moving train of length L, the clock at the back reads ahead of the one at the front by Lv/c². Most relativity “paradoxes” disappear once this is taken seriously.'
    ], { n: 3, e: 'L = \\frac{L_0}{\\gamma},\\qquad t\' = \\gamma\\left(t - \\frac{vx}{c^2}\\right),\\quad x\' = \\gamma(x - vt)', x: ['How far is the journey to the star in the astronaut’s own frame, and is her answer consistent?', ['In her frame the 6.0 ly distance is contracted: 6.0 ÷ 1.25 = 4.8 ly.', 'At 0.6c, 4.8 ly takes 4.8 ÷ 0.6 = 8.0 years, matching her clock.'], '4.8 light-years; consistent'], c: ['A train of rest length 100 m moves at 0.8c. How long is it measured from the platform?', 'γ = 1/0.6 = 1.67, so 100 ÷ 1.67 = 60 m.'] }],
    ['Velocities, energy and momentum', [
      'Velocities no longer simply add: combining u and v gives (u + v)/(1 + uv/c²), which never exceeds c. Energy and momentum become E = γmc² and p = γmv, linked by E² = (pc)² + (mc²)². The kinetic energy (γ − 1)mc² reduces to ½mv² at everyday speeds.'
    ], { n: 4, e: 'u\' = \\frac{u + v}{1 + uv/c^2},\\qquad E = \\gamma mc^2,\\qquad p = \\gamma m v', x: ['Two spaceships each move at 0.80c relative to the Earth, towards each other. How fast does one see the other approach?', ['u′ = (0.80c + 0.80c) ÷ (1 + 0.80 × 0.80) = 1.60c ÷ 1.64.', '= 0.976c, still less than c.'], '0.976c'], c: ['An electron is given a kinetic energy equal to its rest energy, 0.511 MeV. What are γ and its speed?', 'Its total energy is 2mc², so γ = 2 and v = c√(1 − ¼) = 0.87c.'] }],
    ['The evidence', [
      'Muons from cosmic rays reach the ground; fast-moving unstable particles in accelerators live longer by exactly γ; atomic clocks flown round the world in 1971 (Hafele and Keating) disagreed with ground clocks by the predicted amounts. GPS satellites must correct their clocks: their speed makes them lose about 7 μs a day, while the weaker gravity (general relativity) makes them gain about 45 μs, for a net 38 μs.'
    ], { n: 5, c: ['Roughly how large would GPS position errors become if the 38 μs/day were ignored?', 'Light travels about 300 m per microsecond, so about 38 × 300 m ≈ 11 km a day.'] }]
  ],
  m: [
    ['Using the wrong clock for the proper time.', 'Proper time is on the clock that is present at both events.'],
    ['Adding velocities as u + v.', 'Use (u + v)/(1 + uv/c²).'],
    ['Ignoring the relativity of simultaneity.', 'Clocks synchronised in one frame are not synchronised in another.']
  ]
});
WL.gd('y1-rel-dynamics', {
  h: 'The Large Hadron Collider pushes protons to 99.999999% of the speed of light. Past a point, more energy hardly makes them faster at all, yet it keeps adding to their momentum and energy, and when they collide that energy turns into new particles. Special relativity rewrites momentum and energy so that their conservation laws hold for every observer.',
  s: [
    ['Momentum and energy, rewritten', [
      'With γ = 1/√(1 − v²/c²), momentum becomes p = γmv and total energy E = γmc². The kinetic energy is what you add to the rest energy, K = (γ − 1)mc², which reduces to ½mv² when v is much less than c. Here m is the ordinary (rest) mass, the same for every observer.'
    ], { n: 0, e: 'p = \\gamma mv,\\qquad E = \\gamma mc^2,\\qquad K = (\\gamma - 1)mc^2', x: ['A proton (mc² = 938.3 MeV) moves at 0.80c. Find its total energy, kinetic energy and momentum, and compare with ½mv².', ['γ = 1/√(1 − 0.64) = 1/0.6 = 1.667.', 'E = 1.667 × 938.3 = 1564 MeV, so K = 1564 − 938 = 626 MeV.', 'pc = γmc² × (v/c) = 1564 × 0.80 = 1251 MeV, so p = 1251 MeV/c.', 'The old formula ½mv² = ½ × 938.3 × 0.64 = 300 MeV: less than half the true value.'], 'E = 1564 MeV; K = 626 MeV; p = 1251 MeV/c'], c: ['At what speed is a particle’s kinetic energy equal to its rest energy?', 'When γ = 2, so v = c√(1 − ¼) = 0.87c.'] }],
    ['The energy–momentum relation', [
      'E and pc fit together like the sides of a right-angled triangle whose other side is the rest energy: E² = (pc)² + (mc²)². For a massless particle such as a photon, E = pc. The speed follows from v/c = pc/E.',
      'Particle physicists quote energies in eV, momenta in eV/c and masses in eV/c²: the electron is 0.511 MeV/c², the proton 938.3 MeV/c².'
    ], { n: 1, e: 'E^2 = (pc)^2 + (mc^2)^2,\\qquad \\frac{v}{c} = \\frac{pc}{E}', x: ['An electron has a momentum of 1.0 MeV/c. Find its total energy, kinetic energy and speed.', ['E = √(1.0² + 0.511²) = √1.261 = 1.12 MeV.', 'K = 1.12 − 0.51 = 0.61 MeV.', 'v/c = pc/E = 1.0 ÷ 1.12 = 0.89.'], 'E = 1.12 MeV; K = 0.61 MeV; v = 0.89c'], c: ['What is the momentum of a 2.0 eV photon in kg m/s?', 'p = E/c = 2.0 × 1.60 × 10⁻¹⁹ ÷ 3.00 × 10⁸ = 1.1 × 10⁻²⁷ kg m/s.'] }],
    ['Conservation and invariant mass', [
      'In every reaction the total energy and total momentum are conserved. The **invariant mass** of a system, found from (ΣE)² − (Σpc)², is the same in every frame; in a decay it equals the mass of the parent. But mass itself is not conserved: kinetic energy can become rest energy and back again.'
    ], { n: 2, x: ['Two 1.0 GeV photons fly in opposite directions. What is the invariant mass of the pair? What if they flew in the same direction?', ['Opposite: ΣE = 2.0 GeV and Σp = 0, so Mc² = 2.0 GeV.', 'Same direction: ΣE = 2.0 GeV and Σpc = 2.0 GeV, so M = 0.'], '2.0 GeV/c²; zero'], c: ['Is mass conserved in particle reactions?', 'No: energy and momentum are. In e⁺ + e⁻ → 2γ, for example, all the rest mass becomes photon energy.'] }],
    ['Two-body decays', [
      'A particle at rest that decays into exactly two products shares energy between them in a fixed way, set only by the masses: the products fly apart back to back with one definite momentum. For one massless product, p*c = (M² − m²)c²/(2M), working in units of MeV.'
    ], { n: 3, e: 'p^*c = \\frac{(M^2 - m^2)c^2}{2M}\\quad(\\text{one massless product})', x: ['A K⁺ meson at rest (493.7 MeV/c²) decays into a muon (105.7 MeV/c²) and a neutrino (massless). Find the muon’s momentum.', ['M² = 243 740 and m² = 11 172 (in MeV²).', 'p*c = (243 740 − 11 172) ÷ (2 × 493.7) = 232 568 ÷ 987.4.', '= 235.5 MeV, so p = 235.5 MeV/c, the same in every such decay.'], '235.5 MeV/c'], c: ['A neutral pion at rest (135.0 MeV/c²) decays into two photons. What is each photon’s energy?', '67.5 MeV each, flying in opposite directions.'] }],
    ['Threshold energies', [
      'To create new particles, enough energy must be available in the centre-of-momentum frame. When a beam hits a stationary target, much of the beam’s energy is locked up in the motion of the centre of mass, so the threshold is far above the rest energy of what you make. The test uses s = (ΣE)² − (Σpc)², which must reach at least (Σmc²)² of the products.'
    ], { n: 4, e: 's = (E_1 + E_2)^2 - |\\mathbf p_1c + \\mathbf p_2c|^2 \\ge \\left(\\sum m_ic^2\\right)^2', x: ['What beam kinetic energy is needed for p + p → p + p + π⁰ on a stationary proton target? (m_p = 938.3, m_π = 135.0 MeV/c²)', ['For a fixed target, s = 2m_p² + 2E₁m_p (MeV units).', 'Threshold: 2m_p² + 2E₁m_p = (2m_p + m_π)² = 2011.6² = 4 046 535.', 'E₁ = (4 046 535 − 1 760 814) ÷ 1876.6 = 1218 MeV, so K = 1218 − 938 = 280 MeV.'], 'about 280 MeV, twice the pion’s rest energy'], c: ['Why do colliders smash two beams head-on instead of hitting a fixed target?', 'With equal and opposite momenta the lab is the centre-of-momentum frame, so all the energy is available for making particles.'] }]
  ],
  m: [
    ['Using “relativistic mass” γm in Newtonian formulas.', 'Keep m as the rest mass; use p = γmv and E = γmc².'],
    ['Using ½mv² at high speeds.', 'Use K = (γ − 1)mc².'],
    ['Assuming rest mass is conserved in a reaction.', 'Conserve total energy and momentum instead.']
  ]
});

WL.gd('y1-thermo', {
  h: 'A modern power station turns only about 40% of its fuel’s heat into electricity, and no engineering could ever reach 100%. The limit is not about friction: it comes from the second law of thermodynamics. Carnot found that limit in 1824, and the argument revealed a new quantity, entropy.',
  s: [
    ['States, processes and the first law', [
      'A system in equilibrium has **state variables** such as p, V, T and internal energy U. Heat Q and work W are not state variables: they describe how energy crosses the boundary during a process. The first law balances the books: dU = δQ − δW, where δW = p dV is the work done by the system. (Some courses use work done on the system instead; check the sign.)'
    ], { n: 0, e: 'dU = \\delta Q - \\delta W,\\qquad \\delta W = p\\,dV', x: ['2.0 mol of a monatomic ideal gas expands at a constant 100 kPa from 0.040 m³ to 0.060 m³. Find the work, the change in internal energy and the heat supplied.', ['W = pΔV = 1.0 × 10⁵ × 0.020 = 2000 J, done by the gas.', 'ΔU = (3/2)nRΔT = (3/2)pΔV = 3000 J (since pV = nRT).', 'Q = ΔU + W = 5000 J.'], 'W = 2.0 kJ; ΔU = 3.0 kJ; Q = 5.0 kJ'], c: ['Is heat a state variable?', 'No: how much heat goes in depends on the path taken between two states; U, p, V and T depend only on the state.'] }],
    ['Four standard processes for an ideal gas', [
      'At constant **pressure**, W = pΔV. At constant **volume**, W = 0 and Q = ΔU. At constant **temperature** (isothermal), ΔU = 0 and Q = W = nRT ln(V₂/V₁). With no heat flow (**adiabatic**), pV^γ is constant, where γ = C_p/C_V (5/3 for a monatomic gas, 1.4 for air), and equivalently TV^(γ−1) is constant.'
    ], { n: 1, e: 'W_{\\text{iso}} = nRT\\ln\\frac{V_2}{V_1},\\qquad pV^\\gamma = \\text{constant}', x: ['1.0 mol of ideal gas at 300 K expands isothermally from 10 L to 20 L. Find W, Q and ΔU.', ['ΔU = 0 at constant temperature.', 'W = nRT ln 2 = 1.0 × 8.31 × 300 × 0.693 = 1730 J.', 'Q = W = 1730 J: all the heat in becomes work out.'], 'W = Q = 1.73 kJ; ΔU = 0'], c: ['Air at 300 K is squeezed adiabatically to a tenth of its volume (γ = 1.4). What temperature does it reach?', 'TV^(γ−1) is constant, so T = 300 × 10^0.4 = 750 K: hot enough to ignite diesel fuel without a spark.'] }],
    ['The second law and the Carnot engine', [
      'Kelvin–Planck: no engine can take heat from a single reservoir and turn all of it into work. Clausius: heat does not flow from cold to hot by itself. Carnot’s reversible cycle, two isothermals and two adiabatics, is the most efficient engine possible between two temperatures, and its efficiency depends only on them.'
    ], { n: 2, e: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_c}{T_h},\\qquad \\text{COP}_{\\text{fridge}} = \\frac{T_c}{T_h - T_c}', x: ['A power station’s steam is at 820 K and its cooling river at 290 K. What is the highest possible efficiency? And the best possible COP of a fridge at 275 K in a 295 K kitchen?', ['η = 1 − 290 ÷ 820 = 0.65: at most 65%; real stations manage about 40%.', 'COP = 275 ÷ (295 − 275) = 14.'], '65%; 14'], c: ['Why could an engine with everything at one temperature produce no work?', 'Its Carnot limit would be 1 − T/T = 0: you need a temperature difference.'] }],
    ['Entropy appears', [
      'For a Carnot cycle Q_h/T_h = Q_c/T_c, so the sum of Q/T round the cycle is zero. Any reversible cycle can be built from many tiny Carnot cycles, so δQ_rev/T always adds up to zero round a closed loop: it is the change of a state function, the **entropy** S. For an irreversible process in an isolated system, entropy increases.'
    ], { n: 3, e: 'dS = \\frac{\\delta Q_{\\text{rev}}}{T},\\qquad \\Delta S_{\\text{isolated}} \\ge 0', x: ['What is the entropy change when 1.0 kg of ice melts at 273 K? (L = 334 kJ/kg)', ['The heat enters reversibly at a fixed 273 K.', 'ΔS = Q/T = 334 000 ÷ 273 = 1220 J/K.'], '1.22 kJ/K'], c: ['A gas expands freely into a vacuum: no heat flows. Is its entropy change zero?', 'No: S is a state function, so take a reversible isothermal path between the same states: ΔS = nR ln(V₂/V₁), which is positive.'] }],
    ['What entropy counts', [
      'Boltzmann linked entropy to the number of microscopic arrangements Ω that look the same from outside: S = k ln Ω. Let a gas into twice the volume and each molecule has twice as many places to be, so Ω grows by 2^N and ΔS = Nk ln 2. The second law is about overwhelming probability, not strict certainty.'
    ], { n: 4, e: 'S = k\\ln\\Omega', x: ['What is the chance that, at some instant, all the molecules of a gas are in the left half of their box: for 10 molecules, and for a mole?', ['Each molecule is in the left half with probability ½.', '10 molecules: (½)¹⁰ = 1/1024, which happens quite often.', 'A mole: (½)^(6 × 10²³), a number so small that it never happens in the lifetime of the Universe.'], '1 in 1024; effectively never'], c: ['If the second law is only a matter of probability, why is it never broken in practice?', 'Large decreases in entropy are possible in principle, but for 10²³ molecules their probability is like 2 to the power −10²³.'] }]
  ],
  m: [
    ['Mixing up the sign convention for W.', 'Here W is work done by the system: dU = δQ − δW.'],
    ['Using °C in the Carnot efficiency.', 'Temperatures must be in kelvin.'],
    ['Thinking entropy can never decrease anywhere.', 'It can fall locally if it rises more elsewhere; only the total for an isolated system cannot fall.']
  ]
});

WL.gd('y1-entropy', {
  h: 'A drop of ink spreads through water but never gathers itself back; a cup of tea cools but never warms itself from the room. Nothing in Newton’s laws forbids the reverse. Entropy is the quantity that makes this arrow of time precise, both from heat and temperature and from counting arrangements of atoms.',
  s: [
    ['Entropy from heat', [
      'For a reversible process, dS = δQ_rev/T. Entropy is a **state function**: the change between two states is the same however you get there. So even for a messy, irreversible process you can calculate ΔS along any convenient reversible path between the same two states.'
    ], { n: 0, e: '\\Delta S = \\int\\frac{\\delta Q_{\\text{rev}}}{T},\\qquad \\Delta S = mc\\ln\\frac{T_2}{T_1}', x: ['Find the entropy change when 1.0 kg of water is heated from 20 °C to 80 °C. (c = 4186 J kg⁻¹ K⁻¹)', ['δQ = mc dT, so ΔS = ∫mc dT/T = mc ln(T₂/T₁).', 'In kelvin: ln(353.15 ÷ 293.15) = ln 1.2047 = 0.1862.', 'ΔS = 4186 × 0.1862 = 779 J/K.'], 'about 780 J/K'], c: ['Why may you use a reversible path to find ΔS for an irreversible process?', 'Entropy depends only on the state, so any path between the same two states gives the same change.'] }],
    ['The second law', [
      'The entropy of an isolated system never decreases: ΔS ≥ 0, with equality only for reversible processes. Heat leaving a hot body takes away less entropy (Q/T_hot) than it brings to a cold one (Q/T_cold), so heat flowing from hot to cold raises the total, which is why it happens by itself and the reverse does not.'
    ], { n: 1, e: '\\Delta S_{\\text{isolated}} \\ge 0', x: ['1.0 kg of water at 80 °C is mixed with 1.0 kg at 20 °C in an insulated flask, reaching 50 °C. Find the total entropy change.', ['Hot water: ΔS = 4186 ln(323.15 ÷ 353.15) = 4186 × (−0.0888) = −372 J/K.', 'Cold water: ΔS = 4186 ln(323.15 ÷ 293.15) = 4186 × 0.0974 = +408 J/K.', 'Total = +36 J/K.'], '+36 J/K'], c: ['Could the mixed water ever separate itself back into hot and cold halves?', 'Only by decreasing the total entropy by 36 J/K, which the second law forbids for an isolated system.'] }],
    ['Limits on engines and refrigerators', [
      'An engine takes heat Q_h at T_h and rejects Q_c at T_c. It cannot reduce the total entropy, so Q_c/T_c ≥ Q_h/T_h. That caps its efficiency at the Carnot value; similarly a refrigerator’s coefficient of performance is at most T_c/(T_h − T_c).'
    ], { n: 2, e: '\\eta \\le 1 - \\frac{T_c}{T_h}', x: ['An inventor claims an engine working between 500 K and 300 K with 45% efficiency. Is that possible?', ['Carnot limit: 1 − 300 ÷ 500 = 0.40.', '45% is above the limit, so the engine would reduce total entropy.'], 'impossible: the limit is 40%'], c: ['What is the best possible coefficient of performance of a heat pump warming a house to 293 K from outside air at 273 K (heat delivered per unit of work)?', 'T_h/(T_h − T_c) = 293 ÷ 20 ≈ 15. Real heat pumps manage 3 to 4.'] }],
    ['Entropy as counting', [
      'A **macrostate** (what we see: pressure, volume, temperature) can be made in Ω different **microstates** (exact arrangements of molecules). Boltzmann’s S = k ln Ω makes entropy a count. An isolated system wanders among its microstates and ends up, overwhelmingly, in the macrostates with the most of them.'
    ], { n: 3, e: 'S = k\\ln\\Omega', x: ['1.0 mol of gas expands into twice its volume. Find ΔS by counting, and compare with Clausius.', ['Each of N molecules has twice as many places, so Ω is multiplied by 2^N.', 'ΔS = k ln 2^N = Nk ln 2 = nR ln 2 = 8.31 × 0.693 = 5.76 J/K.', 'The reversible isothermal path gives Q/T = nR ln 2, the same.'], '5.76 J/K'], c: ['Toss four coins. Which number of heads is most likely, and in how many of the 16 equally likely microstates does it happen?', 'Two heads, in 6 of the 16.'] }],
    ['Free energies', [
      'A system held at constant temperature by its surroundings does not simply maximise its own entropy: it minimises a **free energy**. At constant T and V that is F = U − TS; at constant T and p, the **Gibbs free energy** G = H − TS. Two phases coexist when their Gibbs energies per particle are equal, which gives ΔS = L/T at a phase change.'
    ], { n: 4, e: 'F = U - TS,\\qquad G = H - TS', x: ['Find the entropy change when 1.0 kg of water boils at 373 K. (L = 2.26 MJ/kg)', ['At the boiling point the two phases coexist, so ΔS = L/T.', 'ΔS = 2.26 × 10⁶ ÷ 373 = 6060 J/K.'], 'about 6.1 kJ/K'], c: ['Melting ice absorbs energy, yet above 0 °C it melts by itself. Why?', 'Above 273 K the term TΔS outweighs the energy needed, so melting lowers G = H − TS.'] }]
  ],
  m: [
    ['Using Q/T directly for an irreversible heat flow inside a system.', 'Compute ΔS along a reversible path between the same states.'],
    ['Thinking a system’s entropy can never fall.', 'It can, if the surroundings gain more; only the isolated total cannot fall.'],
    ['Using °C in ln(T₂/T₁).', 'Use kelvin.']
  ]
});

WL.gd('y1-old-quantum', {
  h: 'In 1900, physics confidently predicted that any hot oven should pour out an infinite amount of ultraviolet light. Planck removed the absurdity with an assumption he called desperate: energy comes in lumps of hf. Over the next 25 years experiment after experiment forced the same lumpiness on light and on atoms.',
  s: [
    ['Black-body radiation and Planck', [
      'Classical physics gives every mode of radiation in a hot cavity an average energy kT, and there are more and more modes at higher frequency, so the total energy diverges: the **ultraviolet catastrophe**. Planck assumed an oscillator could only hold energies nhf. The average energy of a mode then becomes hf/(e^(hf/kT) − 1): about kT at low frequency, but exponentially small when hf ≫ kT.'
    ], { n: 0, e: '\\langle E\\rangle = \\frac{hf}{e^{hf/kT} - 1}', x: ['At room temperature, kT = 0.026 eV. How excited are the modes of visible light (hf ≈ 2.5 eV)?', ['hf/kT = 2.5 ÷ 0.026 ≈ 96.', '⟨E⟩/kT ≈ 96 e^(−96) ≈ 10⁻⁴⁰.', 'Visible modes are effectively empty, which is why objects at room temperature do not glow.'], 'about 10⁻⁴⁰ of the classical value'], c: ['What does Planck’s formula become at low frequencies (hf ≪ kT)?', 'e^x − 1 ≈ x, so ⟨E⟩ ≈ kT: the classical result.'] }],
    ['Compton scattering', [
      'X-rays scattered by electrons come out with a longer wavelength that depends only on the scattering angle. Treat the X-ray as a photon of momentum h/λ, conserve relativistic energy and momentum, and Compton’s formula follows; h/(m_e c) = 2.43 pm is the electron’s **Compton wavelength**.'
    ], { n: 1, e: '\\lambda\' - \\lambda = \\frac{h}{m_ec}(1 - \\cos\\theta)', x: ['X-rays of wavelength 0.0500 nm scatter from electrons through 90°. Find the new wavelength and the electron’s recoil energy.', ['At 90°, cos θ = 0, so Δλ = 2.43 pm and λ′ = 0.05243 nm.', 'Electron energy = hc/λ − hc/λ′ = 1240 eV nm × (1/0.0500 − 1/0.05243) nm⁻¹.', '= 1240 × (20.00 − 19.07) = 1150 eV.'], '0.0524 nm; about 1.15 keV'], c: ['Why is the Compton shift so hard to notice with visible light?', '2.4 pm is only about 5 millionths of a 500 nm wavelength.'] }],
    ['The Bohr atom', [
      'Bohr (1913) proposed that hydrogen’s electron moves only in circular orbits with angular momentum nħ, does not radiate in them, and emits a photon hf = E_i − E_f when it jumps between them. With the Coulomb force this gives radii n²a₀ (a₀ = 0.0529 nm) and energies −13.6 eV/n², matching hydrogen’s spectrum.'
    ], { n: 2, e: 'r_n = n^2a_0,\\qquad E_n = -\\frac{13.6\\ \\text{eV}}{n^2}', x: ['How fast is the electron moving in Bohr’s ground state?', ['L = mva₀ = ħ, so v = ħ/(m a₀).', 'v = 1.055 × 10⁻³⁴ ÷ (9.11 × 10⁻³¹ × 5.29 × 10⁻¹¹) = 2.19 × 10⁶ m/s.', 'That is about c/137, the fine-structure constant times c.'], '2.2 × 10⁶ m/s'], c: ['What is the radius of Bohr’s n = 3 orbit?', '9a₀ = 9 × 0.0529 nm = 0.48 nm.'] }],
    ['The Franck–Hertz experiment', [
      'Electrons accelerated through mercury vapour lose energy only in lumps of 4.9 eV. As the voltage rises, the current reaching the collector climbs, then drops sharply each time the electrons gain enough energy to excite mercury atoms: every 4.9 V. The vapour then glows with ultraviolet light of exactly hc/(4.9 eV).'
    ], { n: 3, x: ['What wavelength of light should the excited mercury atoms give out?', ['λ = hc/E = 1240 eV nm ÷ 4.9 eV.', '= 253 nm, in the ultraviolet; the measured line is at 254 nm.'], 'about 254 nm'], c: ['Why does the current drop at 4.9 V, again at 9.8 V, and so on?', 'At each of those voltages the electrons can just lose all their energy exciting one more atom, so they cannot reach the collector against its small opposing voltage.'] }],
    ['What the old theory got wrong', [
      'The Bohr model fails for any atom with more than one electron, cannot predict how bright the lines are, and its orbits are not real: quantum mechanics gives hydrogen’s ground state zero angular momentum, not ħ. Its energies come out right because they are forced by matching classical physics at large n. Quantum mechanics replaced it in 1925–26.'
    ], { n: 4, c: ['What does quantum mechanics say is the angular momentum of hydrogen’s ground state?', 'Zero, not the ħ that Bohr assumed.'] }]
  ],
  m: [
    ['Using the electron mass when the photon scatters off something else.', 'h/(mc) uses the mass of whatever the photon bounces off.'],
    ['Picturing Bohr’s orbits as real paths.', 'They are a stepping stone; quantum mechanics replaced them.'],
    ['Saying Planck introduced photons.', 'Planck quantised the oscillators’ energy; Einstein proposed photons in 1905.']
  ]
});

WL.gd('y1-qm-intro', {
  h: 'Fire electrons at two slits, so slowly that only one is in the apparatus at a time. Each lands as a single dot, like a particle, yet thousands of dots build up interference fringes, like a wave. Put a detector at the slits to see which way each electron went, and the fringes vanish. One rule explains all of it.',
  s: [
    ['Photons carry energy and momentum', [
      'Light comes in photons with energy E = hf and momentum p = h/λ. Compton confirmed this in 1923 by bouncing X-rays off electrons and finding exactly the wavelength shift that billiard-ball collisions with those energies and momenta predict.'
    ], { n: 0, e: 'E = hf,\\qquad p = \\frac{h}{\\lambda}', x: ['An X-ray photon has wavelength 0.10 nm. Find its energy and momentum, and the kinetic energy of an electron with the same momentum.', ['E = 1240 eV nm ÷ 0.10 nm = 12.4 keV; p = h/λ = 6.63 × 10⁻³⁴ ÷ 1.0 × 10⁻¹⁰ = 6.6 × 10⁻²⁴ kg m/s.', 'Electron: K = p²/2m = (6.63 × 10⁻²⁴)² ÷ (2 × 9.11 × 10⁻³¹) = 2.4 × 10⁻¹⁷ J = 150 eV.'], '12.4 keV for the photon; only 150 eV for the electron'], c: ['A photon and a slow electron have the same wavelength. Which carries more energy?', 'The photon: same momentum, but E = pc for the photon and only p²/2m for the electron.'] }],
    ['Matter waves', [
      'De Broglie proposed that every particle has a wavelength λ = h/p. Davisson and Germer confirmed it in 1927: 54 eV electrons reflected from a nickel crystal gave a diffraction peak exactly where waves of 0.167 nm should. Everyday objects have wavelengths far too small to notice.'
    ], { n: 1, e: '\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2meV}}', x: ['Check the wavelength of Davisson and Germer’s 54 eV electrons.', ['p = √(2meV) = √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 54) = 3.97 × 10⁻²⁴ kg m/s.', 'λ = h/p = 6.63 × 10⁻³⁴ ÷ 3.97 × 10⁻²⁴ = 1.67 × 10⁻¹⁰ m.'], '0.167 nm'], c: ['Why do we never notice the wavelength of a walking person?', 'λ = h/(mv) ≈ 6.6 × 10⁻³⁴ ÷ (70 × 1.5) ≈ 6 × 10⁻³⁶ m: unimaginably small.'] }],
    ['One particle at a time', [
      'Send electrons through two slits one at a time. Each lands at a single point, but the pattern built up by thousands of them shows fringes. No electron interferes with another; each electron’s own two possibilities, through one slit or the other, interfere.'
    ], { n: 2, c: ['If only one electron is in the apparatus at a time, what is it interfering with?', 'Its own two alternatives: passing through the left slit and passing through the right one.'] }],
    ['The rule: add amplitudes, then square', [
      'Each way of reaching a point on the screen has a complex number, an **amplitude** ψ. If nothing records which way was taken, add the amplitudes first, then square to get the probability. That leaves a cross term, positive or negative: the fringes. If the route is recorded, even in principle, add the probabilities instead, and the fringes vanish.'
    ], { n: 3, e: 'P = |\\psi_1 + \\psi_2|^2 = |\\psi_1|^2 + |\\psi_2|^2 + 2\\,\\mathrm{Re}(\\psi_1^*\\psi_2)', x: ['The two routes to a point have equal-sized amplitudes a. Find the probability when they arrive in phase, exactly out of phase, and when the route is recorded.', ['In phase: |a + a|² = 4|a|².', 'Out of phase: |a − a|² = 0.', 'Route recorded: |a|² + |a|² = 2|a|², the same everywhere, so no fringes.'], '4|a|², 0, or a flat 2|a|²'], c: ['A detector records which slit every electron passes through. What pattern builds up?', 'Two overlapping single-slit humps, with no interference fringes.'] }],
    ['Complementarity and uncertainty', [
      'The better you can tell the routes apart, the weaker the fringes. A related limit is the **uncertainty principle**: a wave confined within Δx must contain a spread of wavelengths, and so of momenta, with Δx Δp ≥ ħ/2.'
    ], { n: 4, e: '\\Delta x\\,\\Delta p \\ge \\frac{\\hbar}{2}', x: ['An electron is confined to an atom, Δx ≈ 0.10 nm. Estimate its least kinetic energy.', ['Δp ≥ ħ/(2Δx) = 1.055 × 10⁻³⁴ ÷ 2.0 × 10⁻¹⁰ = 5.3 × 10⁻²⁵ kg m/s.', 'K ≈ (Δp)²/2m = (5.3 × 10⁻²⁵)² ÷ (2 × 9.11 × 10⁻³¹) = 1.5 × 10⁻¹⁹ J.', 'That is about 1 eV: just the scale of atomic energies.'], 'about 1 eV'], c: ['Why can an electron never sit perfectly still at the bottom of a potential well?', 'Zero momentum spread would need an infinite spread in position; confinement forces a minimum kinetic energy.'] }]
  ],
  m: [
    ['Adding probabilities when the routes cannot be told apart.', 'Add amplitudes first, then square.'],
    ['Saying the electron splits in half.', 'It is always detected whole, at one point.'],
    ['Treating the uncertainty principle as clumsy measurement.', 'It is a property of waves themselves.']
  ]
});
