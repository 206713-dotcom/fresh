/* Geodesic step-by-step guides, stage alevel (built from src/guide/alevel-*.js) */
WL.gd('al-shm', {
  h: 'A child on a swing, a mass bouncing on a spring, a ruler twanged on a desk, the atoms in a crystal: all of them wobble in the same way when the wobble is small. One equation, a = −ω²x, describes every one of them. Learn it once, and you can predict how long any of them takes to swing back and forth without watching it.',
  s: [
    ['The defining rule: pulled back in proportion to how far you go', [
      'Pull a mass on a spring to one side and let go. The spring pulls it back towards the middle (the **equilibrium** position), and the further you pulled it, the harder it pulls back: F = −kx. The minus sign says the force always points back towards equilibrium.',
      'Put that force into F = ma and the acceleration is a = −(k/m)x. Any motion where the acceleration is proportional to the displacement and points the opposite way is called **simple harmonic motion** (SHM). We write the constant as ω², so the rule is a = −ω²x, with ω² = k/m for a spring.'
    ], { n: 0, e: 'a = -\\omega^2 x,\\qquad \\omega^2 = \\frac{k}{m}', x: ['A 0.50 kg mass hangs on a spring with k = 200 N/m. Find ω, and the acceleration when the mass is 3.0 cm below equilibrium.', ['ω² = k/m = 200 ÷ 0.50 = 400 s⁻², so ω = 20 rad/s.', 'a = −ω²x = −400 × 0.030 = −12 m/s².', 'The minus sign means the acceleration points up, back towards equilibrium.'], 'ω = 20 rad/s; 12 m/s² towards equilibrium'], c: ['Is a ball bouncing on a hard floor in SHM?', 'No. While it is in the air its acceleration is g downwards whatever its height, not proportional to its distance from a centre. The bounce repeats, but repeating is not enough: the force law has to be a = −ω²x.'] }],
    ['The motion itself: a shadow of a circle', [
      'Imagine a point going round a circle of radius A at a steady angular speed ω, and look at it edge-on. Its shadow slides back and forth along a line, and the shadow’s acceleration turns out to be exactly −ω² times its position. So SHM is circular motion seen side-on.',
      'That gives the motion straight away: x = A cos(ωt) if you start at the edge. A is the **amplitude** (the biggest displacement). One full lap of the circle is one full oscillation, so the **period** is T = 2π/ω and the frequency is f = 1/T.'
    ], { n: 1, e: 'x = A\\cos(\\omega t),\\qquad T = \\frac{2\\pi}{\\omega} = \\frac{1}{f}', x: ['For the spring above (ω = 20 rad/s), released 3.0 cm below equilibrium, find the period and where the mass is 0.10 s later.', ['T = 2π/ω = 2π ÷ 20 = 0.314 s.', 'x = A cos(ωt) = 3.0 cm × cos(20 × 0.10) = 3.0 × cos(2.0 rad).', 'cos(2.0 rad) = −0.416 (calculator in radians), so x = −1.2 cm.'], 'T = 0.31 s; 1.2 cm on the other side of equilibrium'], c: ['Why must your calculator be in radians for cos(ωt)?', 'Because ω is in radians per second, so ωt is an angle in radians. In degree mode, cos(2.0) would be the cosine of 2 degrees.'] }],
    ['Speed: fastest in the middle, stopped at the ends', [
      'At the ends of the swing the mass stops for an instant before coming back, so its speed is zero there and its acceleration is largest. In the middle the force is zero, so the acceleration is zero, but the mass is moving fastest.',
      'The speed at any displacement x is v = ±ω√(A² − x²), and the maximum speed, in the middle, is v_max = ωA. The maximum acceleration, at the ends, is a_max = ω²A.'
    ], { e: 'v = \\pm\\omega\\sqrt{A^2 - x^2},\\qquad v_{\\max} = \\omega A,\\qquad a_{\\max} = \\omega^2 A', x: ['For A = 3.0 cm and ω = 20 rad/s, find the maximum speed and the speed at x = 2.0 cm.', ['v_max = ωA = 20 × 0.030 = 0.60 m/s.', 'At x = 2.0 cm: v = 20 × √(0.030² − 0.020²) = 20 × √(0.00050) = 20 × 0.0224.', 'v = 0.45 m/s.'], '0.60 m/s; 0.45 m/s'], c: ['Where in the oscillation are the acceleration and the velocity both zero at the same time?', 'Nowhere. Velocity is zero at the ends, where acceleration is largest; acceleration is zero in the middle, where velocity is largest.'] }],
    ['The period does not depend on the amplitude', [
      'For a mass on a spring, T = 2π√(m/k), whatever the amplitude. Pull it twice as far and it has twice as far to go, but it is pulled twice as hard and moves twice as fast, so it takes exactly the same time. This is why pendulum clocks keep time as their swing slowly dies away.',
      'A simple pendulum of length L is SHM only for small swings (below about 10°), where sin θ ≈ θ. Then T = 2π√(L/g), which depends on the length and on g, but not on the mass of the bob.'
    ], { n: 2, e: 'T_{\\text{spring}} = 2\\pi\\sqrt{\\frac{m}{k}},\\qquad T_{\\text{pendulum}} = 2\\pi\\sqrt{\\frac{L}{g}}', x: ['How long must a pendulum be to have a period of exactly 2.00 s (g = 9.81 m/s²)?', ['Rearrange T = 2π√(L/g): L = g(T/2π)².', 'T/2π = 2.00 ÷ 6.283 = 0.3183 s.', 'L = 9.81 × 0.3183² = 9.81 × 0.1013 = 0.994 m.'], '0.994 m, almost exactly a metre'], c: ['A pendulum’s length is made four times longer. What happens to its period?', 'It doubles, because T is proportional to √L and √4 = 2.'] }],
    ['Energy sloshes between kinetic and potential', [
      'With no friction, the total energy stays the same. At the ends it is all potential energy (the mass is still); in the middle it is all kinetic (the mass is fastest). In between it is shared.',
      'For a spring the total is E = ½kA², which also equals ½mω²A². At displacement x the potential energy is ½kx² and the kinetic energy is the rest, ½k(A² − x²).'
    ], { n: 3, e: 'E = \\tfrac12 kA^2 = \\tfrac12 m\\omega^2 A^2', x: ['For k = 200 N/m and A = 3.0 cm, find the total energy, and the kinetic energy at x = 1.5 cm.', ['E = ½kA² = ½ × 200 × 0.030² = 0.090 J.', 'PE at 1.5 cm = ½ × 200 × 0.015² = 0.0225 J.', 'KE = 0.090 − 0.0225 = 0.0675 J.'], '0.090 J; 0.068 J (three quarters of the total)'], c: ['At what displacement are the kinetic and potential energies equal?', 'Where ½kx² = ½ × ½kA², so x² = A²/2 and x = A/√2 ≈ 0.71A, not at A/2.'] }],
    ['Real oscillators: damping and resonance', [
      'Real oscillators lose energy to friction and air resistance, so the amplitude dies away: **damping**. Light damping lets it swing many times; **critical damping** brings it back to rest as fast as possible without overshooting (car suspension); heavy damping brings it back slowly.',
      'If you push an oscillator in time with its own natural frequency, every push adds energy and the amplitude grows: **resonance**. A child on a swing pushed once per swing goes higher and higher. The less damping, the taller and sharper the resonance peak.'
    ], { n: 4, c: ['A bridge sways gently in the wind. Why might a crowd marching in step be dangerous?', 'If their steps match the bridge’s natural frequency, each step adds energy at the right moment: resonance. The amplitude can grow far beyond what the same people walking out of step would cause.'] }]
  ],
  m: [
    ['Leaving the calculator in degrees.', 'ωt is in radians: switch to radian mode for cos(ωt) and sin(ωt).'],
    ['Thinking a bigger swing takes longer.', 'In SHM the period is the same for any amplitude; only a pendulum at large angles slows down.'],
    ['Mixing up ω and f.', 'ω = 2πf. ω is in rad/s, f in Hz; put ω into a = −ω²x, not f.'],
    ['Saying the acceleration is largest in the middle.', 'It is zero in the middle and largest at the ends, where the restoring force is largest.']
  ]
});
WL.gd('al-units', {
  h: 'In 1999 NASA lost the Mars Climate Orbiter because one team’s software gave thrust in pound-force seconds and another read the numbers as newton seconds. Physics runs on measurement, so it needs agreed units, an honest statement of how far each number can be trusted, and a way to handle quantities that point in a direction. This topic gives you all three.',
  s: [
    ['Seven base units build all the others', [
      'Every unit in physics is made from seven **SI base units**: the kilogram (kg), metre (m), second (s), ampere (A), kelvin (K), mole (mol) and candela (cd). Other units are **derived**: the newton comes from F = ma, so 1 N = 1 kg m s⁻²; the joule is a newton times a metre, so 1 J = 1 kg m² s⁻².',
      'An equation is **homogeneous** if every term has the same base units. A correct equation must be homogeneous, so this is a quick check for mistakes. But it cannot catch a wrong number in front: E = mv² is homogeneous and still wrong, because the ½ has no units.'
    ], { n: 0, e: '1\\ \\text{N} = 1\\ \\text{kg m s}^{-2},\\qquad 1\\ \\text{J} = 1\\ \\text{kg m}^2\\text{s}^{-2}', x: ['A student writes the period of a pendulum as T = 2π√(l/g), where l is a length. Show that it is homogeneous.', ['The left side, T, is a time: units s.', 'l/g has units m ÷ (m s⁻²) = s².', 'The square root of s² is s, and 2π has no units, so both sides are in seconds.'], 'Both sides are in s, so it is homogeneous'], c: ['What are the base units of power?', 'A watt is a joule per second: kg m² s⁻² ÷ s = kg m² s⁻³.'] }],
    ['Prefixes and estimates', [
      'Prefixes save writing powers of ten: p (10⁻¹²), n (10⁻⁹), μ (10⁻⁶), m (10⁻³), k (10³), M (10⁶), G (10⁹), T (10¹²). Convert to base units before you substitute into an equation.',
      'Physicists also estimate: a sensible order of magnitude from rough everyday values (an adult 70 kg, a car 1000 kg, walking 1.5 m/s, a motorway 30 m/s) tells you whether an answer is believable.'
    ], { n: 1, x: ['Estimate the kinetic energy of a car on a motorway.', ['Take the mass as about 1000 kg and the speed as about 30 m/s.', 'E = ½mv² = ½ × 1000 × 30² = 450 000 J.', 'To one significant figure, about 5 × 10⁵ J.'], 'roughly 5 × 10⁵ J'], c: ['Write 450 nm in metres.', '450 × 10⁻⁹ m = 4.5 × 10⁻⁷ m.'] }],
    ['Errors, accuracy and precision', [
      'A **systematic error** shifts every reading the same way: a scale that does not start at zero, a meter that reads high, always looking at a scale from the same angle. Repeating does not reduce it; you find and correct it. A **random error** scatters readings either side of the true value (reaction time, fluctuating readings), and averaging many readings reduces it.',
      'A result is **accurate** if it is close to the true value and **precise** if repeated readings are close to each other. A common estimate of the uncertainty of a mean is half the range of the readings.'
    ], { n: 2, x: ['Four timings of a pendulum’s swing are 2.31 s, 2.35 s, 2.29 s and 2.33 s. Give the mean with its uncertainty.', ['Mean = (2.31 + 2.35 + 2.29 + 2.33) ÷ 4 = 9.28 ÷ 4 = 2.32 s.', 'Range = 2.35 − 2.29 = 0.06 s; half of it is 0.03 s.', 'Percentage uncertainty = 0.03 ÷ 2.32 × 100 = 1.3%.'], '2.32 ± 0.03 s (1.3%)'], c: ['A metre rule has a worn end, so every length reads 2 mm too long. What kind of error is this, and will repeating help?', 'A systematic (zero) error. Repeating gives the same wrong answer every time; you must subtract the 2 mm.'] }],
    ['Combining uncertainties', [
      'When you **add or subtract** quantities, add their **absolute** uncertainties. When you **multiply or divide**, add their **percentage** uncertainties. A quantity raised to a power n has n times the percentage uncertainty.',
      'So small errors in a quantity that is cubed matter three times as much: measure that quantity most carefully.'
    ], { n: 3, e: '\\frac{\\Delta y}{y} = \\frac{\\Delta a}{a} + 2\\frac{\\Delta b}{b} + \\frac{\\Delta c}{c}\\quad\\text{for}\\quad y = \\frac{ab^2}{c}', x: ['A ball bearing has mass 4.0 ± 0.1 g and diameter 10.0 ± 0.1 mm. Find its density, ρ = m/V with V = πd³/6, and the uncertainty.', ['Percentage uncertainty in m: 0.1 ÷ 4.0 = 2.5%. In d: 0.1 ÷ 10.0 = 1%, so in d³: 3 × 1% = 3%.', 'Percentage uncertainty in ρ = 2.5% + 3% = 5.5%.', 'V = π × (1.00 cm)³ ÷ 6 = 0.524 cm³, so ρ = 4.0 ÷ 0.524 = 7.64 g/cm³ = 7640 kg/m³.', '5.5% of 7640 is 420 kg/m³.'], 'ρ = (7.6 ± 0.4) × 10³ kg/m³, which fits steel (7850 kg/m³)'], c: ['Two lengths are 25.0 ± 0.1 cm and 12.0 ± 0.1 cm. What is their difference, with its uncertainty?', '13.0 ± 0.2 cm: the absolute uncertainties add even though you subtract the lengths.'] }],
    ['Vectors', [
      'A **scalar** has only size (mass, energy, speed); a **vector** has size and direction (force, velocity, displacement). Vectors add nose to tail: the resultant runs from the start of the first to the end of the last.',
      'Any vector F at angle θ to a direction can be **resolved** into two perpendicular **components**: F cos θ along that direction and F sin θ at right angles to it. Components can be handled separately and recombined with Pythagoras.'
    ], { n: 4, e: 'F_x = F\\cos\\theta,\\qquad F_y = F\\sin\\theta,\\qquad F = \\sqrt{F_x^2 + F_y^2}', x: ['A boat heads due north at 3.0 m/s across a river flowing due east at 4.0 m/s. What is its velocity over the ground?', ['The two velocities are at right angles, so use Pythagoras: √(3.0² + 4.0²) = √25 = 5.0 m/s.', 'Direction: tan⁻¹(4.0 ÷ 3.0) = 53° east of north.'], '5.0 m/s at 53° east of north'], c: ['A 20 N force acts at 60° to the horizontal. What is its vertical component?', '20 sin 60° = 17.3 N (the horizontal component is 20 cos 60° = 10 N).'] }]
  ],
  m: [
    ['Adding percentage uncertainties for a sum.', 'Add absolute uncertainties for sums and differences; percentages for products and quotients.'],
    ['Forgetting the power in d³ or r².', 'Multiply the percentage uncertainty by the power.'],
    ['Swapping sin and cos.', 'The component next to the angle is F cos θ; the one opposite it is F sin θ.']
  ]
});

WL.gd('al-kinematics', {
  h: 'A driver on a motorway sees brake lights ahead. How far will the car travel before it stops? Four short equations answer that, and you do not have to memorise them blindly: all four come from a single straight line on a velocity–time graph.',
  s: [
    ['Displacement, velocity and acceleration', [
      '**Displacement** s is distance in a stated direction. **Velocity** is the rate of change of displacement, and **acceleration** is the rate of change of velocity. All three are vectors, so choose a positive direction and give each quantity a sign.',
      'Speed and distance are the scalar versions: they ignore direction.'
    ], { n: 0, e: 'v = \\frac{\\Delta s}{\\Delta t},\\qquad a = \\frac{\\Delta v}{\\Delta t}', c: ['A runner completes one 400 m lap in 50 s. What are her average speed and average velocity?', 'Average speed = 400 ÷ 50 = 8.0 m/s. Average velocity = 0, because she ends where she started (zero displacement).'] }],
    ['Reading the graphs', [
      'On a displacement–time graph the **gradient** is the velocity. On a velocity–time graph the gradient is the acceleration and the **area** underneath is the displacement. For a curved graph, the gradient at an instant is the gradient of the tangent there.'
    ], { n: 1, x: ['A car speeds up steadily from rest to 20 m/s in 8.0 s, then cruises at 20 m/s for 10 s. Find its acceleration and the total distance.', ['Acceleration = gradient = 20 ÷ 8.0 = 2.5 m/s².', 'Distance = area: the triangle is ½ × 8.0 × 20 = 80 m and the rectangle is 10 × 20 = 200 m.', 'Total = 80 + 200 = 280 m.'], '2.5 m/s²; 280 m'], c: ['What does a horizontal line on a velocity–time graph mean?', 'Constant velocity: zero acceleration.'] }],
    ['The SUVAT equations from one graph', [
      'If the acceleration is constant, the v–t graph is a straight line from u (the initial velocity) to v (the final velocity) over a time t. Its gradient gives v = u + at. The area under it is a trapezium, giving s = ½(u + v)t. Substitute the first into the second to get s = ut + ½at²; eliminate t instead to get v² = u² + 2as.',
      'To use them, list the five quantities s, u, v, a and t, mark the three you know, and choose the equation that leaves out the one you neither know nor want.'
    ], { n: 2, e: 'v = u + at,\\quad s = \\tfrac12(u+v)t,\\quad s = ut + \\tfrac12at^2,\\quad v^2 = u^2 + 2as', x: ['A car at 30 m/s brakes with a deceleration of 6.0 m/s². How far does it travel while braking, and for how long? The driver also takes 0.70 s to react.', ['Take the direction of motion as positive, so a = −6.0 m/s²; v = 0.', 'No time needed for the distance, so use v² = u² + 2as: 0 = 30² − 12s, so s = 900 ÷ 12 = 75 m.', 'Time: v = u + at gives 0 = 30 − 6.0t, so t = 5.0 s.', 'In the 0.70 s reaction time it covers 30 × 0.70 = 21 m, so the total stopping distance is 96 m.'], '75 m braking (5.0 s); 96 m in all'], c: ['Which SUVAT equation has no t in it?', 'v² = u² + 2as.'] }],
    ['Free fall, and measuring g', [
      'Without air resistance, everything near the Earth falls with the same acceleration, g = 9.81 m/s². If you take up as positive, a = −9.81 m/s² on the way up and on the way down.',
      'To measure g, time an object dropped from rest through a measured height h: s = ½gt², so g = 2h/t². Two light gates measuring the speed at two heights avoid needing the exact moment of release: g = (v₂² − v₁²)/(2Δh).'
    ], { n: 3, x: ['A ball is thrown straight up at 15 m/s. How high does it go, and when does it come back to the hand?', ['Up is positive: u = 15 m/s, a = −9.81 m/s², v = 0 at the top.', 'v² = u² + 2as: 0 = 225 − 19.62s, so s = 11.5 m.', 'v = u + at: 0 = 15 − 9.81t, so t = 1.53 s to the top.', 'The way down mirrors the way up, so it is back in the hand after 3.06 s.'], '11.5 m; after 3.1 s'], c: ['A ball dropped from rest falls 1.20 m in 0.495 s. What value of g does this give?', 'g = 2h/t² = 2 × 1.20 ÷ 0.495² = 9.80 m/s².'] }],
    ['Two dimensions', [
      'Horizontal and vertical motions are independent. Gravity changes only the vertical velocity; with no air resistance, the horizontal velocity stays constant. Each direction gets its own SUVAT, and the time links them.'
    ], { n: 4, x: ['A marble rolls off a 1.25 m high table at 2.0 m/s. How far from the table does it land?', ['Vertically: it starts with no vertical velocity and falls 1.25 m: t = √(2h/g) = √(2.50 ÷ 9.81) = 0.505 s.', 'Horizontally: it keeps 2.0 m/s for that time: x = 2.0 × 0.505 = 1.01 m.'], 'about 1.0 m from the table'], c: ['Would a heavier marble rolled off at the same speed land further away?', 'No: without air resistance the fall time and the horizontal speed do not depend on mass.'] }]
  ],
  m: [
    ['Using SUVAT when the acceleration changes (for example with drag).', 'SUVAT is only for constant acceleration; otherwise use graphs.'],
    ['Mixing signs, such as g = +9.81 m/s² with up as positive.', 'Choose a positive direction and keep to it for every quantity.'],
    ['Confusing distance with displacement.', 'Displacement has a direction; a full lap has zero displacement.']
  ]
});

WL.gd('al-projectile', {
  h: 'Drop one coin and flick another sideways off a table at the same moment: they hit the floor together. Sideways motion does not affect falling. That one fact turns the curved flight of any thrown ball into two simple straight-line problems, and gives the parabola, the range and the famous 45° all at once.',
  s: [
    ['Two motions at once', [
      'Gravity pulls straight down, so it changes only the vertical velocity. With no air resistance nothing acts sideways, so the horizontal velocity never changes.',
      'So resolve the launch velocity v₀ at angle θ into a horizontal part v₀ cos θ, which stays constant, and a vertical part v₀ sin θ, which changes at g. Solve the two separately; they share the same time t.'
    ], { n: 0, e: 'x = v_0\\cos\\theta\\,t,\\qquad y = v_0\\sin\\theta\\,t - \\tfrac12 g t^2', x: ['A ball is kicked at 20 m/s at 30° above the horizontal. Find its starting horizontal and vertical velocities.', ['Horizontal: 20 cos 30° = 17.3 m/s.', 'Vertical: 20 sin 30° = 10.0 m/s.'], '17.3 m/s across; 10.0 m/s up'], c: ['A bullet is fired horizontally while another is dropped from the same height. Which lands first?', 'They land together: both start with no vertical velocity and fall with the same acceleration.'] }],
    ['The shape of the path', [
      'Eliminate t (using t = x/(v₀ cos θ)) and the height becomes a quadratic in x: the path is a **parabola**.',
      'At the top the vertical velocity is zero but the horizontal velocity is not, so the ball is still moving, at v₀ cos θ, its slowest speed in the flight.'
    ], { n: 1, e: 'y = x\\tan\\theta - \\frac{g\\,x^2}{2v_0^2\\cos^2\\theta}', c: ['Is a projectile’s speed zero at the top of its path?', 'No: only its vertical velocity is zero; it still moves sideways at v₀ cos θ (unless it was thrown straight up).'] }],
    ['Flight time, height and range', [
      'On level ground: the flight time comes from y = 0, giving T = 2v₀ sin θ/g. Half of it is spent rising. The greatest height comes from v_y² = (v₀ sin θ)² − 2gH = 0. The range is the horizontal speed times the flight time, which simplifies to R = v₀² sin 2θ/g.',
      'Because sin 2θ is largest when 2θ = 90°, the range is greatest at 45°, and angles that add up to 90° (such as 30° and 60°) give the same range.'
    ], { n: 2, e: 'T = \\frac{2v_0\\sin\\theta}{g},\\qquad H = \\frac{v_0^2\\sin^2\\theta}{2g},\\qquad R = \\frac{v_0^2\\sin 2\\theta}{g}', x: ['For the ball kicked at 20 m/s and 30° on level ground, find the flight time, greatest height and range.', ['T = 2 × 20 × sin 30° ÷ 9.81 = 20 ÷ 9.81 = 2.04 s.', 'H = 20² × sin²30° ÷ (2 × 9.81) = 400 × 0.25 ÷ 19.62 = 5.10 m.', 'R = 20² × sin 60° ÷ 9.81 = 400 × 0.866 ÷ 9.81 = 35.3 m (check: 17.3 m/s × 2.04 s = 35.3 m).'], '2.04 s; 5.1 m; 35 m'], c: ['Which other launch angle gives the same range as 30°, and what is the best possible range at 20 m/s?', '60°. The best is at 45°: R = v₀²/g = 400 ÷ 9.81 = 40.8 m.'] }],
    ['The energy shortcut', [
      'If you only need the speed at a certain height, energy conservation skips the components: v² = v₀² − 2gΔy, where Δy is the rise (negative for a drop), whatever the launch angle.'
    ], { n: 3, x: ['A ball is thrown from a 10 m high balcony at 8.0 m/s, in some direction. How fast is it moving when it hits the ground?', ['Δy = −10 m, so v² = 8.0² + 2 × 9.81 × 10 = 64 + 196 = 260.', 'v = √260 = 16.1 m/s, whichever way it was thrown.'], '16 m/s'], c: ['Two identical balls are thrown from the same window at the same speed, one up and one down. Which hits the ground faster?', 'Neither: they land with the same speed (ignoring air resistance), because both lose the same potential energy overall.'] }],
    ['Launching from a height', [
      'Thrown horizontally from a height h, a projectile falls for t = √(2h/g) and travels v₀t sideways in that time. Launched upwards from a height, it has extra time in the air, so the best angle is a little less than 45°; shot-putters use about 37–40°.'
    ], { n: 4, x: ['A ball is thrown horizontally at 12 m/s from a 20 m cliff. How far out does it land, and how fast, at what angle, is it moving then?', ['Fall time: t = √(2 × 20 ÷ 9.81) = 2.02 s.', 'Distance out: 12 × 2.02 = 24.2 m.', 'Vertical speed at landing: 9.81 × 2.02 = 19.8 m/s; horizontal still 12 m/s.', 'Speed = √(12² + 19.8²) = 23.2 m/s, at tan⁻¹(19.8 ÷ 12) = 59° below the horizontal.'], '24 m out; 23 m/s at 59° below the horizontal'], c: ['Why is the best angle for a shot-putter less than 45°?', 'The shot is released above the ground, so it has extra time to fly; lowering the angle gives more horizontal speed to use that time (and athletes can push harder at lower angles).'] }]
  ],
  m: [
    ['Using the full speed v₀ in x = vt.', 'Only the horizontal component v₀ cos θ carries the ball sideways.'],
    ['Saying the velocity is zero at the top.', 'Only the vertical component is zero there.'],
    ['Using R = v₀² sin 2θ/g when the landing height differs.', 'The range formula is only for level ground; otherwise solve the vertical motion for t.']
  ]
});

WL.gd('al-dynamics', {
  h: 'Why does a skydiver stop speeding up after about twelve seconds, and why does catching a cricket ball hurt less if you pull your hands back? Both come from Newton’s second law in its most general form: a resultant force is the rate of change of momentum.',
  s: [
    ['Momentum and Newton’s three laws', [
      '**Momentum** is mass times velocity, p = mv, a vector in kg m s⁻¹. Newton’s first law: a body keeps a constant velocity unless a resultant force acts. Second law: the resultant force equals the rate of change of momentum; for a constant mass that is F = ma. Third law: if A pushes on B, B pushes on A with an equal and opposite force.'
    ], { n: 0, e: 'F = \\frac{\\Delta p}{\\Delta t} = ma\\quad(\\text{constant mass})', x: ['A 1200 kg car speeds up from 10 m/s to 25 m/s in 6.0 s. What resultant force acts on it?', ['Change of momentum = 1200 × (25 − 10) = 18 000 kg m/s.', 'F = Δp ÷ Δt = 18 000 ÷ 6.0 = 3000 N (equivalently a = 2.5 m/s² and F = 1200 × 2.5).'], '3000 N'], c: ['Why does pulling your hands back when you catch a ball reduce the force?', 'The ball’s change of momentum is the same, but it happens over a longer time, so Δp/Δt, the force, is smaller.'] }],
    ['Mass, weight, and more than one force', [
      '**Mass** measures inertia, how hard it is to change an object’s motion; it is the same everywhere. **Weight** is the gravitational force on it, W = mg, which changes with g (on the Moon g is about 1.6 N/kg).',
      'When several forces act, F in F = ma is the **resultant**: draw every force on the object, take one direction as positive, and add them with signs.'
    ], { n: 1, x: ['A 60 kg person stands on scales in a lift that is accelerating upwards at 2.0 m/s². What do the scales read?', ['Forces on the person: the scales push up with R, weight 60 × 9.81 = 589 N acts down.', 'Up is positive: R − 589 = 60 × 2.0 = 120.', 'R = 709 N: the scales read more than the weight.'], 'about 710 N'], c: ['An astronaut has a mass of 80 kg. What are her mass and weight on the Moon (g = 1.6 N/kg)?', 'Her mass is still 80 kg; her weight is 80 × 1.6 = 128 N (on Earth it is 785 N).'] }],
    ['When momentum changes direction, or mass flows', [
      'For a rebound, the change of momentum includes the reversal: a ball hitting a wall at u and bouncing back at v changes momentum by m(u + v). For a steady stream of mass (a hose, a rocket), the force is the mass per second times the change of velocity.'
    ], { n: 2, e: 'F = \\frac{\\Delta m}{\\Delta t}\\,\\Delta v', x: ['A hose sprays 2.0 kg of water each second at 15 m/s onto a wall, and the water stops dead. What force does it exert on the wall?', ['Each second, 2.0 kg of water loses 15 m/s: Δp per second = 2.0 × 15 = 30 kg m/s per second.', 'F = 30 N on the water (away from the wall); by the third law, 30 N on the wall.'], '30 N'], c: ['A 0.060 kg tennis ball hits a wall at 20 m/s and bounces straight back at 15 m/s. What is the size of its change of momentum?', '0.060 × (20 + 15) = 2.1 kg m/s: the speeds add because the direction reverses.'] }],
    ['Drag and terminal velocity', [
      '**Drag** opposes motion through air or water and grows with speed, roughly as kv² for everyday objects. A falling object starts with acceleration g; as it speeds up, drag grows and the resultant force shrinks, so the acceleration falls. When drag equals weight, the resultant is zero and the speed stays constant: the **terminal velocity**.',
      'Opening a parachute makes k much bigger, so drag exceeds weight, the skydiver slows, and a new, lower terminal velocity is reached.'
    ], { n: 3, e: 'mg = kv_t^2\\;\\Rightarrow\\; v_t = \\sqrt{\\frac{mg}{k}}', x: ['An 80 kg skydiver has k = 0.25 kg/m. Find her acceleration at 30 m/s, and her terminal velocity.', ['Weight = 80 × 9.81 = 785 N. At 30 m/s, drag = 0.25 × 30² = 225 N.', 'Resultant = 785 − 225 = 560 N down, so a = 560 ÷ 80 = 7.0 m/s².', 'Terminal: v_t = √(785 ÷ 0.25) = √3140 = 56 m/s.'], '7.0 m/s²; 56 m/s'], c: ['At terminal velocity, are there no forces on the skydiver?', 'There are two forces, weight and drag, but they are equal and opposite, so the resultant is zero and she moves at constant velocity.'] }],
    ['Third-law pairs', [
      'A third-law pair acts on **two different bodies** and the two forces are the **same kind**. The Earth pulls a book down; the book pulls the Earth up: a pair. The table pushing up on the book is not the pair of the book’s weight, even though they are equal: both act on the book, and they are different kinds of force.'
    ], { n: 4, c: ['A horse pulls a cart, and the cart pulls back on the horse with an equal force. How does anything move?', 'The two forces act on different bodies, so they do not cancel. The horse speeds up because the ground pushes it forwards harder than the cart pulls it back.'] }]
  ],
  m: [
    ['Calling weight and the normal contact force a third-law pair.', 'Third-law pairs act on different bodies and are the same kind of force.'],
    ['Taking Δp = m(v − u) without signs for a rebound.', 'Give velocities signs: a reversal adds the speeds.'],
    ['Saying there is no force at terminal velocity.', 'The forces balance; the resultant is zero.']
  ]
});

WL.gd('al-momentum', {
  h: 'Snooker balls, car crashes, a rifle’s kick, a rocket in space: in every one, the total momentum is the same before and after, even when energy is lost as heat and sound. Conservation of momentum lets you predict what happens in a collision without knowing anything about the messy forces during it.',
  s: [
    ['The total momentum does not change', [
      'In a collision, the two bodies push on each other with equal and opposite forces (third law) for the same time, so their momentum changes are equal and opposite. The total momentum of a closed system, one with no external resultant force, stays constant.',
      'Momentum is a vector: choose a positive direction, and give velocities in the other direction a minus sign.'
    ], { n: 0, e: 'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2', x: ['A 1500 kg car at 20 m/s runs into the back of a 1000 kg car moving the same way at 10 m/s, and they lock together. How fast do they move just after?', ['Momentum before = 1500 × 20 + 1000 × 10 = 40 000 kg m/s.', 'After, 2500 kg move together: 2500v = 40 000.', 'v = 16 m/s, in the original direction.'], '16 m/s'], c: ['A 2.0 kg trolley moving at 3.0 m/s meets a 1.0 kg trolley moving at 6.0 m/s the other way. What is the total momentum?', '2.0 × 3.0 + 1.0 × (−6.0) = 0: they cancel.'] }],
    ['Elastic and inelastic', [
      'Momentum is always conserved in a closed system, but kinetic energy usually is not. In an **elastic** collision the total kinetic energy is unchanged. In an **inelastic** collision some becomes internal energy, sound or deformation. If the bodies stick together the collision is **perfectly inelastic**, and the most kinetic energy that momentum conservation allows is lost.'
    ], { n: 1, x: ['A 2.0 kg trolley at 3.0 m/s hits a stationary 1.0 kg trolley and they stick. How much kinetic energy is lost?', ['Momentum: 2.0 × 3.0 = 3.0v, so v = 2.0 m/s.', 'KE before = ½ × 2.0 × 3.0² = 9.0 J; after = ½ × 3.0 × 2.0² = 6.0 J.', 'Lost: 3.0 J, a third of the original.'], '3.0 J'], c: ['Two identical cars at the same speed collide head-on and stop dead. Was momentum conserved? Where did the kinetic energy go?', 'Yes: the total momentum was zero before and after. The kinetic energy went into bending metal, heat and sound.'] }],
    ['A shortcut for elastic collisions', [
      'For a head-on elastic collision, momentum and kinetic energy together give a simpler rule: the speed at which the bodies approach each other equals the speed at which they separate. This is linear, so it is far easier to use than the kinetic energy equation.'
    ], { n: 2, e: 'u_1 - u_2 = v_2 - v_1\\quad(\\text{elastic, head-on})', x: ['A 2.0 kg ball at 6.0 m/s hits a stationary 1.0 kg ball head-on and elastically. Find both velocities afterwards.', ['Momentum: 2.0 × 6.0 = 2.0v₁ + 1.0v₂, so 12 = 2v₁ + v₂.', 'Relative speed: 6.0 − 0 = v₂ − v₁, so v₂ = v₁ + 6.', 'Substitute: 12 = 3v₁ + 6, so v₁ = 2.0 m/s and v₂ = 8.0 m/s.', 'Check KE: before ½ × 2 × 36 = 36 J; after ½ × 2 × 4 + ½ × 1 × 64 = 36 J.'], '2.0 m/s and 8.0 m/s, both forwards'], c: ['In an elastic head-on collision two balls approach at a relative speed of 5 m/s. How fast do they separate?', 'At 5 m/s.'] }],
    ['Explosions and recoil', [
      'When something at rest explodes or fires, the total momentum stays zero, so the pieces fly apart with equal and opposite momenta. The lighter piece moves faster and carries most of the kinetic energy, which comes from chemical or stored energy.'
    ], { n: 3, x: ['A 4.0 kg rifle fires a 10 g bullet at 400 m/s. Find the recoil velocity and compare the kinetic energies.', ['Total momentum stays zero: 0.010 × 400 + 4.0v = 0, so v = −1.0 m/s (backwards).', 'Bullet KE = ½ × 0.010 × 400² = 800 J; rifle KE = ½ × 4.0 × 1.0² = 2.0 J.'], 'recoil 1.0 m/s; the bullet carries 400 times the energy'], c: ['The momentum before an explosion is zero. Is the kinetic energy afterwards zero too?', 'No: kinetic energy is a scalar and never cancels; it comes from the stored chemical energy.'] }],
    ['Collisions in two dimensions', [
      'Momentum is conserved separately in any two perpendicular directions. Resolve each momentum into components, conserve x and y separately, then recombine. When a ball hits an identical stationary ball elastically but not head-on, the two move off at right angles.'
    ], { n: 4, x: ['A 1.0 kg puck moving east at 3.0 m/s collides with a 2.0 kg puck moving north at 1.0 m/s, and they stick. Find their velocity.', ['East: 1.0 × 3.0 = 3.0 kg m/s. North: 2.0 × 1.0 = 2.0 kg m/s.', 'Combined mass 3.0 kg: v_east = 1.0 m/s, v_north = 0.67 m/s.', 'Speed = √(1.0² + 0.67²) = 1.2 m/s, at tan⁻¹(0.67) = 34° north of east.'], '1.2 m/s at 34° north of east'], c: ['A snooker ball strikes an identical stationary ball off-centre. If the collision is elastic, what is the angle between their paths afterwards?', '90°.'] }]
  ],
  m: [
    ['Forgetting minus signs for opposite directions.', 'Choose a positive direction and give every velocity a sign.'],
    ['Assuming kinetic energy is conserved in every collision.', 'Only in elastic collisions; momentum is always conserved in a closed system.'],
    ['Using the relative-speed rule for an inelastic collision.', 'It only holds for elastic collisions.']
  ]
});

WL.gd('al-equilibrium', {
  h: 'A small child can balance an adult on a see-saw, a long spanner undoes a stuck nut, and a washing line can never be pulled perfectly straight. All three come from the same two rules: for a body to stay still, the forces on it must cancel and so must their turning effects.',
  s: [
    ['Moments: the turning effect of a force', [
      'The **moment** of a force about a point is the force times the **perpendicular distance** from the point to the line along which the force acts. A force pointing straight at the pivot has no moment at all.'
    ], { n: 0, e: '\\text{moment} = F\\,d_\\perp', x: ['A 30 N force is applied to the end of a 0.25 m spanner, first at right angles, then at 60° to the spanner. Find the moment each time.', ['At right angles: 30 × 0.25 = 7.5 N m.', 'At 60°: the perpendicular distance is 0.25 sin 60° = 0.217 m, so the moment is 30 × 0.217 = 6.5 N m.'], '7.5 N m, then 6.5 N m'], c: ['Why are door handles fitted far from the hinges?', 'A larger perpendicular distance gives the same moment for a smaller force.'] }],
    ['Couples', [
      'A **couple** is two equal and opposite forces whose lines of action are apart. It makes a body turn without moving it along. Its **torque** is one force times the perpendicular distance between them, and it is the same about every point.'
    ], { n: 0, e: '\\tau = F\\,d', x: ['A driver turns a steering wheel of radius 0.20 m by pushing with 15 N with each hand, in opposite directions, at opposite sides of the rim. What is the torque?', ['The forces are 2 × 0.20 = 0.40 m apart.', 'τ = 15 × 0.40 = 6.0 N m.'], '6.0 N m'], c: ['Does the resultant force of a couple make the wheel move sideways?', 'No: the two forces are equal and opposite, so the resultant force is zero; only the turning effect remains.'] }],
    ['The conditions for equilibrium', [
      'A body is in **equilibrium** when there is no resultant force (so no acceleration) and no resultant moment about any point (so no change in rotation). So forces up = forces down, forces left = forces right, and clockwise moments = anticlockwise moments.',
      'Take moments about a point where an unknown force acts: its moment there is zero, so it drops out.'
    ], { n: 1, e: '\\sum F_x = 0,\\quad \\sum F_y = 0,\\quad \\sum M = 0', x: ['A uniform 2.0 m plank weighing 100 N rests on supports at its two ends. A 300 N person stands 0.50 m from the left end. Find the two support forces.', ['Moments about the left end (so that support drops out): R × 2.0 = 300 × 0.50 + 100 × 1.0 = 250.', 'R_right = 125 N.', 'Forces: R_left + 125 = 300 + 100, so R_left = 275 N.'], '275 N (left), 125 N (right)'], c: ['Why is the left support pushing harder?', 'The person stands nearer the left end, so that support carries more of the load.'] }],
    ['Centre of gravity', [
      'The **centre of gravity** is the point where the whole weight of a body can be taken to act. For a uniform beam it is at the middle. A beam called “light” has a weight small enough to ignore.'
    ], { n: 2, c: ['A uniform metre rule balances at the 50 cm mark. With a 0.50 N weight hung at the 10 cm mark it balances at the 30 cm mark. What does the rule weigh?', 'Moments about 30 cm: 0.50 × 0.20 = W × 0.20 (the rule’s weight acts at 50 cm), so W = 0.50 N.'] }],
    ['Three forces: a closed triangle', [
      'If three forces keep a body in equilibrium, their lines of action pass through one point, and drawn nose to tail they form a closed triangle. Solve it with trigonometry, or resolve each force into components and make each direction add to zero.'
    ], { n: 3, x: ['A 20 N lamp hangs from a cord. A horizontal string pulls it aside until the cord makes 30° with the vertical. Find the tension in the cord and the pull of the string.', ['Vertically: T cos 30° = 20, so T = 20 ÷ 0.866 = 23.1 N.', 'Horizontally: the string pulls T sin 30° = 23.1 × 0.5 = 11.5 N.'], 'cord 23 N; string 11.5 N'], c: ['Why must three forces in equilibrium all pass through one point?', 'Otherwise, about the point where two of them meet, the third would have a moment, and the body would start to turn.'] }],
    ['Why tight lines need huge tensions', [
      'A weight W hung from the middle of a string, with each half making a small angle θ with the horizontal, needs a tension T = W/(2 sin θ). As θ gets smaller, sin θ approaches zero and T grows without limit.'
    ], { n: 4, e: 'T = \\frac{W}{2\\sin\\theta}', x: ['A 10 N bird lands in the middle of a washing line, which sags so each half makes 5° with the horizontal. What is the tension?', ['2 sin 5° = 2 × 0.0872 = 0.174.', 'T = 10 ÷ 0.174 = 57 N: almost six times the bird’s weight.', 'Pulled tighter to 1°, it would need 10 ÷ (2 × 0.0175) = 290 N.'], 'about 57 N'], c: ['Can you pull a washing line with a wet towel on it perfectly straight?', 'No: a perfectly straight line would need an infinite tension.'] }]
  ],
  m: [
    ['Using the distance along the beam instead of the perpendicular distance.', 'The moment uses the perpendicular distance to the line of action.'],
    ['Leaving out the beam’s own weight.', 'Include it, acting at the centre of gravity.'],
    ['Thinking equilibrium means “not moving”.', 'It means no acceleration and no change in rotation; steady motion counts.']
  ]
});
WL.gd('al-fluids', {
  h: 'A steel nail sinks, but a 100 000-tonne steel ship floats, and your ears hurt at the bottom of a swimming pool. Both come from one fact: the pressure in a fluid grows with depth. The pressure under an object is bigger than the pressure on top of it, and that difference pushes it up.',
  s: [
    ['Density and pressure', [
      '**Density** is mass per unit volume, ρ = m/V, in kg/m³ (water is 1000 kg/m³). **Pressure** is the force acting at right angles to a surface divided by its area, p = F/A, measured in pascals: 1 Pa = 1 N/m².',
      'The same force spread over a smaller area gives a larger pressure.'
    ], { n: 0, e: 'p = \\frac{F}{A}', x: ['A 60 kg person stands on both feet, total area 0.040 m². What pressure do they exert? What if all that weight went through one 1.0 cm² heel?', ['Weight = 60 × 9.81 = 589 N.', 'On both feet: p = 589 ÷ 0.040 = 14 700 Pa, about 15 kPa.', 'On one heel: 1.0 cm² = 1.0 × 10⁻⁴ m², so p = 589 ÷ 1.0 × 10⁻⁴ = 5.9 × 10⁶ Pa, 400 times more.'], '15 kPa; 5.9 MPa'], c: ['Why do tractors have wide tyres?', 'The weight is spread over a larger area, so the pressure on the soil is smaller and the tractor sinks less.'] }],
    ['Pressure grows with depth', [
      'Picture a column of liquid of height Δh and area A. Its weight is ρAΔhg, and it presses on area A, so the pressure at its bottom is bigger than at its top by ρgΔh.',
      'At any depth the pressure pushes equally in all directions, and the shape of the container does not matter, only the depth.'
    ], { n: 1, e: '\\Delta p = \\rho g\\,\\Delta h', x: ['How much does the pressure rise 10 m below the surface of fresh water? What is the total pressure there (atmospheric pressure is 101 kPa)?', ['Δp = 1000 × 9.81 × 10 = 98 100 Pa, almost exactly one atmosphere.', 'Total = 101 + 98 = 199 kPa: about twice the pressure at the surface.'], 'rises by 98 kPa, to about 200 kPa'], c: ['Three differently shaped containers are filled with water to the same depth. Where is the pressure on the base greatest?', 'It is the same in all three: it depends only on the depth and the density.'] }],
    ['Where upthrust comes from', [
      'Submerge a block of height L and top area A. The water pushes down on its top with pressure ρgh and up on its bottom with the bigger pressure ρg(h + L). The sideways pushes cancel.',
      'The net upward force is ρgLA = ρgV, where V is the block’s volume: the weight of the water it pushes aside. It does not depend on how deep the block is.'
    ], { n: 2, e: 'F_{\\text{up}} = \\rho_{\\text{fluid}}\\,g\\,V_{\\text{displaced}}', x: ['A 0.10 m cube is held under water with its top 0.50 m below the surface. Find the upthrust from the two pressures, and check it with ρgV.', ['Extra pressure on top: 1000 × 9.81 × 0.50 = 4905 Pa. On the bottom (0.60 m): 5886 Pa.', 'Difference: 981 Pa, on an area of 0.010 m²: 981 × 0.010 = 9.81 N upwards.', 'Check: ρgV = 1000 × 9.81 × 0.001 = 9.81 N.'], '9.81 N'], c: ['If the cube is pushed deeper, does the upthrust grow?', 'No: both pressures rise by the same amount, so their difference, and the upthrust, stay the same.'] }],
    ['Archimedes’ principle and floating', [
      '**Archimedes’ principle**: the upthrust on a body equals the weight of fluid it displaces. A floating body sinks until it displaces its own weight of fluid. So the fraction of its volume under the surface equals its density divided by the fluid’s density.',
      'If a body is denser than the fluid, even fully under it cannot displace its own weight, so it sinks.'
    ], { n: 3, e: '\\frac{V_{\\text{sub}}}{V} = \\frac{\\rho_{\\text{body}}}{\\rho_{\\text{fluid}}}', x: ['Ice has a density of 917 kg/m³. What fraction of an iceberg is under the surface in sea water (1025 kg/m³)?', ['Fraction = 917 ÷ 1025 = 0.895.', 'So about 89% is under water and only 11% shows.'], 'about 89%'], c: ['Why does a steel ship float when a steel nail sinks?', 'The hull encloses a large volume of air, so the ship’s average density is less than water’s: it displaces its own weight of water before it is fully under.'] }],
    ['Measuring pressures', [
      'A **U-tube manometer** compares a gas pressure with the atmosphere: the pressure difference is ρgΔh, where Δh is the difference between the liquid levels. A **mercury barometer** balances the atmosphere against a column of mercury about 0.76 m high.'
    ], { n: 4, x: ['A water manometer connected to a gas supply shows a 12 cm difference in levels. How much above atmospheric is the gas pressure?', ['Δp = ρgΔh = 1000 × 9.81 × 0.12.', '= 1180 Pa, about 1.2 kPa.'], '1.2 kPa above atmospheric'], c: ['Why do barometers use mercury rather than water?', 'Mercury is 13.6 times denser. A water barometer would need a column about 10 m tall (101 000 ÷ (1000 × 9.81) = 10.3 m).'] }]
  ],
  m: [
    ['Using the object’s density in ρgV for the upthrust.', 'The upthrust uses the fluid’s density.'],
    ['Forgetting atmospheric pressure when asked for the total pressure.', 'ρgh is the extra pressure; add the atmosphere for the total.'],
    ['Thinking upthrust grows with depth.', 'In a liquid it stays the same once the object is fully under.']
  ]
});

WL.gd('al-energy', {
  h: 'Why does a car need several times more power to climb a hill than to cruise on the flat at the same speed, and how can a satellite circle the Earth for years without fuel? Work is done only by a force along the direction of motion; energy is never lost, only moved; and power is how fast it is moved.',
  s: [
    ['Work done by a force', [
      'A force does **work** when it moves its point of application. The work is the force times the displacement in the direction of the force, W = Fs cos θ, measured in joules. A force at right angles to the motion does no work.'
    ], { n: 0, e: 'W = Fs\\cos\\theta', x: ['You pull a suitcase 50 m along the ground with a 40 N force at 30° to the ground. How much work do you do?', ['Only the component along the motion counts: 40 cos 30° = 34.6 N.', 'W = 34.6 × 50 = 1730 J.'], 'about 1.7 kJ'], c: ['Does gravity do work on a satellite in a circular orbit?', 'No: the pull is always at right angles to the motion, so no work is done and the speed stays the same.'] }],
    ['Kinetic and potential energy from work', [
      'Lifting a mass m at steady speed through a height Δh needs a force mg, so the work done, and the **gravitational potential energy** gained, is mgΔh.',
      'A resultant force F accelerating a mass from rest over a distance s does work Fs = mas, and v² = 2as makes that ½mv²: the **kinetic energy**. More generally, the work done by the resultant force equals the change in kinetic energy.'
    ], { n: 1, e: '\\Delta E_p = mg\\Delta h,\\qquad E_k = \\tfrac12mv^2', x: ['A 1000 kg car at 20 m/s brakes to a stop in 40 m. What is the average braking force?', ['Kinetic energy to remove: ½ × 1000 × 20² = 200 000 J.', 'The braking force does that much (negative) work over 40 m: F × 40 = 200 000.', 'F = 5000 N.'], '5000 N'], c: ['A roller coaster car starts at rest 30 m up and runs down to 10 m. Ignoring friction, how fast is it going? Does its mass matter?', 'mgΔh = ½mv², so v = √(2 × 9.81 × 20) = 19.8 m/s. The mass cancels, so it does not matter.'] }],
    ['Energy is conserved; efficiency', [
      'The total energy of a closed system never changes; it only moves between stores. In real machines some is always **dissipated**, usually heating the surroundings.',
      '**Efficiency** is the useful energy output divided by the total energy input (or the same with powers).'
    ], { n: 2, e: '\\text{efficiency} = \\frac{\\text{useful output}}{\\text{total input}}', x: ['A motor lifts a 50 kg load through 12 m, using 9.0 kJ of electrical energy. What is its efficiency?', ['Useful output = mgΔh = 50 × 9.81 × 12 = 5890 J.', 'Efficiency = 5890 ÷ 9000 = 0.65.'], '65%'], c: ['Where does the other 35% go?', 'It is dissipated, mainly heating the motor’s coils and bearings and the surroundings, with a little sound.'] }],
    ['Power and P = Fv', [
      '**Power** is the rate of doing work, in watts (J/s). A force F moving its point of application at speed v along its own direction does work Fv every second.',
      'At steady speed the driving force equals the total resistance, so the power needed is that resistance times the speed.'
    ], { n: 3, e: 'P = \\frac{W}{t} = Fv', x: ['A cyclist rides at a steady 8.0 m/s against a total resistance of 25 N. What power does she produce?', ['At steady speed her driving force equals the resistance, 25 N.', 'P = Fv = 25 × 8.0 = 200 W.'], '200 W'], c: ['A car’s engine delivers 30 kW at a steady 25 m/s. What is the total resistance?', 'F = P/v = 30 000 ÷ 25 = 1200 N.'] }],
    ['Climbing a slope', [
      'Going up a slope of angle θ, the component of the weight along the slope, mg sin θ, also acts backwards. At steady speed the driving force must match mg sin θ plus the resistance, so the power is (mg sin θ + F_resistance)v.'
    ], { n: 4, x: ['A 1200 kg car climbs a 5° slope at a steady 20 m/s, with 600 N of resistance. What power does it need? What would it need on the flat?', ['Weight along the slope: 1200 × 9.81 × sin 5° = 1026 N.', 'Driving force = 1026 + 600 = 1626 N.', 'P = 1626 × 20 = 32 500 W on the slope; on the flat, 600 × 20 = 12 000 W.'], 'about 33 kW, against 12 kW on the flat'], c: ['Where does the extra power go when the car climbs?', 'Into gravitational potential energy: the car gains height at a steady rate.'] }]
  ],
  m: [
    ['Using W = Fs when the force is at an angle.', 'Use Fs cos θ, the component along the motion.'],
    ['Saying a force at right angles to the motion does work.', 'It does none: cos 90° = 0.'],
    ['Using the resultant force in P = Fv at steady speed.', 'The resultant is zero then; use the driving force.']
  ]
});

WL.gd('al-materials', {
  h: 'Why are bridges hung from steel cables, while bungee cords are made of rubber? To compare materials fairly you must divide out the size of the sample. Stress and strain do exactly that, and their ratio, the Young modulus, is a number that tells you how stiff a material is.',
  s: [
    ['Hooke’s law and springs', [
      'For small loads, the extension of a spring or wire is proportional to the load: F = kx, up to the **limit of proportionality**. The **spring constant** k is the force per metre of extension.',
      'Springs in **series** carry the same force, so their extensions add: 1/k = 1/k₁ + 1/k₂. Springs in **parallel** share the extension, so their forces add: k = k₁ + k₂.'
    ], { n: 0, e: 'F = kx', x: ['Two identical springs each have k = 200 N/m. How far does a 6.0 N load stretch them in series, and in parallel?', ['Series: 1/k = 1/200 + 1/200, so k = 100 N/m; x = 6.0 ÷ 100 = 0.060 m = 6.0 cm.', 'Parallel: k = 200 + 200 = 400 N/m; x = 6.0 ÷ 400 = 0.015 m = 1.5 cm.'], '6.0 cm in series; 1.5 cm in parallel'], c: ['A spring is cut in half. What happens to the spring constant of each half?', 'It doubles: each half stretches only half as far under the same force.'] }],
    ['Stress, strain and the Young modulus', [
      '**Tensile stress** is force per unit cross-sectional area, σ = F/A, in Pa. **Tensile strain** is extension per unit original length, ε = x/L, with no units. Up to the limit of proportionality, stress is proportional to strain, and the constant is the **Young modulus** E = σ/ε, a property of the material, not of the sample.',
      'Steel: about 2.0 × 10¹¹ Pa. Copper: 1.2 × 10¹¹ Pa. Rubber: only about 10⁶–10⁸ Pa.'
    ], { n: 1, e: '\\sigma = \\frac{F}{A},\\qquad \\varepsilon = \\frac{x}{L},\\qquad E = \\frac{\\sigma}{\\varepsilon} = \\frac{FL}{Ax}', x: ['A copper wire 3.0 m long and 0.80 mm in diameter supports 60 N. How far does it stretch? (E = 1.2 × 10¹¹ Pa)', ['Radius 0.40 mm = 4.0 × 10⁻⁴ m, so A = π(4.0 × 10⁻⁴)² = 5.03 × 10⁻⁷ m².', 'Stress = 60 ÷ 5.03 × 10⁻⁷ = 1.19 × 10⁸ Pa.', 'Strain = 1.19 × 10⁸ ÷ 1.2 × 10¹¹ = 9.9 × 10⁻⁴.', 'Extension = 9.9 × 10⁻⁴ × 3.0 m = 3.0 × 10⁻³ m.'], 'about 3.0 mm'], c: ['Two wires of the same steel and length carry the same load, but one has twice the diameter. How do their extensions compare?', 'The thick one has four times the area, so a quarter of the stress, and stretches a quarter as much.'] }],
    ['Measuring the Young modulus', [
      'Hang a long, thin wire from a rigid support. Measure its length with a metre rule and its diameter in several places with a micrometer. Add loads in steps, reading the extension against a scale or vernier, and plot load against extension. The gradient of the straight part is EA/L, so E = gradient × L/A.',
      'A long, thin wire gives large extensions, which keeps their percentage uncertainty small.'
    ], { n: 2, x: ['The straight part of a load–extension graph for a wire 2.5 m long, of area 2.0 × 10⁻⁷ m², has a gradient of 1.6 × 10⁴ N/m. Find E.', ['E = gradient × L/A.', '= 1.6 × 10⁴ × 2.5 ÷ 2.0 × 10⁻⁷.', '= 2.0 × 10¹¹ Pa, which fits steel.'], '2.0 × 10¹¹ Pa'], c: ['Why does the diameter need measuring most carefully?', 'The area depends on d², so the percentage uncertainty in d counts twice in E.'] }],
    ['Elastic and plastic', [
      '**Elastic** deformation disappears when the load is removed; **plastic** deformation is permanent. Beyond the **elastic limit**, a **ductile** metal such as copper stretches a great deal before it breaks; a **brittle** material such as glass breaks with almost no plastic stretching.',
      'The **ultimate tensile stress** is the largest stress a material can take before it fails.'
    ], { n: 3, c: ['A copper wire is loaded beyond its elastic limit and then unloaded. What do you see?', 'It does not go back to its original length: it keeps a permanent extension.'] }],
    ['Energy stored in a stretch', [
      'The work done stretching a sample is the area under its force–extension graph. Where Hooke’s law holds, that is a triangle, so the **elastic potential energy** is ½Fx = ½kx².',
      'Because both the force and the extension grow, doubling the stretch stores four times the energy.'
    ], { n: 4, e: 'E_p = \\tfrac12Fx = \\tfrac12kx^2', x: ['A 10 N force stretches a spring by 4.0 cm. How much energy is stored? How much at 8.0 cm, if it still obeys Hooke’s law?', ['E = ½ × 10 × 0.040 = 0.20 J.', 'At 8.0 cm the force is 20 N: E = ½ × 20 × 0.080 = 0.80 J.'], '0.20 J, then 0.80 J (four times as much)'], c: ['Why can you not use ½Fx after the limit of proportionality?', 'The graph is no longer a straight line, so the area is not a triangle; you must find the area under the curve.'] }]
  ],
  m: [
    ['Using the diameter as the radius in A = πr².', 'Halve the diameter first.'],
    ['Forgetting unit conversions.', 'mm to m, and 1 mm² = 10⁻⁶ m².'],
    ['Using ½Fx beyond the limit of proportionality.', 'Find the area under the curve instead.']
  ]
});

WL.gd('al-waves', {
  h: 'An earthquake’s energy can travel hundreds of kilometres, yet each bit of rock only shakes back and forth around where it started. A progressive wave carries energy without carrying matter. This topic gives you the words and equations to describe any wave, and shows why a loudspeaker sounds quieter, fast, as you walk away.',
  s: [
    ['Describing a wave', [
      'The **displacement** of a point is how far it is from its rest position; the **amplitude** is the largest displacement. The **wavelength** λ is the distance between neighbouring points in step, such as crest to crest. The **period** T is the time for one oscillation, and the **frequency** f = 1/T is the number per second.',
      'Points along the wave oscillate out of step. The **phase difference** between two points a distance Δx apart is the same fraction of a cycle as Δx is of a wavelength.'
    ], { n: 0, e: '\\Delta\\phi = \\frac{\\Delta x}{\\lambda}\\times 360^\\circ = 2\\pi\\frac{\\Delta x}{\\lambda}', x: ['On a wave of wavelength 0.60 m, what is the phase difference between two points 0.15 m apart?', ['0.15 ÷ 0.60 = 0.25 of a wavelength.', 'Δφ = 0.25 × 360° = 90°, or π/2 rad.'], '90° (π/2 rad)'], c: ['Two points are half a wavelength apart. Are they in phase or in antiphase?', 'In antiphase: 180° apart, one at a crest when the other is at a trough.'] }],
    ['The wave equation', [
      'In one period the wave moves forward one wavelength, so its speed is λ/T, which is fλ.',
      'The frequency is set by the source; the speed is set by the medium. So when a wave enters a new medium its frequency stays the same, and its wavelength changes with its speed.'
    ], { n: 1, e: 'v = f\\lambda', x: ['What is the wavelength of a 100 MHz radio wave? Of a 262 Hz note (middle C) in air, where sound travels at 340 m/s?', ['Radio: λ = 3.0 × 10⁸ ÷ 1.0 × 10⁸ = 3.0 m.', 'Sound: λ = 340 ÷ 262 = 1.30 m.'], '3.0 m; 1.3 m'], c: ['Sound travels faster in water than in air. When it enters water, what happens to its frequency and wavelength?', 'The frequency stays the same; the wavelength gets longer in proportion to the speed.'] }],
    ['Transverse and longitudinal', [
      'In a **transverse** wave (light, a wave on a string) the oscillations are at right angles to the direction the energy travels. In a **longitudinal** wave (sound) they are along it, making **compressions** and **rarefactions**.',
      'Two graphs look alike but mean different things: displacement against distance is a snapshot of the whole wave, and the gap between peaks is λ; displacement against time follows one point, and the gap between peaks is T.'
    ], { n: 2, c: ['On a displacement–time graph for one point on a wave, what does the gap between two peaks tell you?', 'The period T, not the wavelength.'] }],
    ['Reading an oscilloscope', [
      'An oscilloscope draws voltage against time. The **time-base** (time per division) turns horizontal divisions into time, so the period is the number of divisions for one cycle times the time-base. The **Y-gain** (volts per division) turns vertical divisions into voltage.'
    ], { n: 3, x: ['With the time-base at 0.50 ms/div, one cycle spans 5.0 divisions; with the Y-gain at 2.0 V/div, each peak is 3.0 divisions above the centre line. Find the frequency and the amplitude.', ['T = 5.0 × 0.50 ms = 2.5 ms, so f = 1 ÷ 0.0025 s = 400 Hz.', 'Amplitude = 3.0 × 2.0 V = 6.0 V.'], '400 Hz; 6.0 V'], c: ['If the signal’s frequency doubles and the time-base is unchanged, what changes on the screen?', 'Twice as many cycles fit across it: each cycle spans half as many divisions.'] }],
    ['Intensity', [
      '**Intensity** is the power crossing each square metre at right angles to the wave, I = P/A, in W/m². For a given wave it is proportional to the amplitude squared.',
      'A small source sending power P equally in all directions spreads it over a sphere of area 4πr², so the intensity falls as 1/r² and the amplitude as 1/r.'
    ], { n: 4, e: 'I = \\frac{P}{4\\pi r^2},\\qquad I \\propto A^2', x: ['A small loudspeaker radiates 0.50 W of sound evenly in all directions. Find the intensity at 2.0 m and at 4.0 m.', ['At 2.0 m: I = 0.50 ÷ (4π × 2.0²) = 0.50 ÷ 50.3 = 9.9 × 10⁻³ W/m².', 'At 4.0 m: twice the distance, so a quarter: 2.5 × 10⁻³ W/m² (and half the amplitude).'], '9.9 mW/m², then 2.5 mW/m²'], c: ['If the amplitude of a wave doubles, what happens to its intensity?', 'It becomes four times as large.'] }]
  ],
  m: [
    ['Reading the wavelength off a displacement–time graph.', 'That graph gives the period; the wavelength comes from a displacement–distance graph.'],
    ['Thinking the frequency changes when a wave enters a new medium.', 'The frequency stays; the speed and wavelength change.'],
    ['Using I ∝ 1/r for a point source.', 'Intensity goes as 1/r²; amplitude as 1/r.']
  ]
});

WL.gd('al-doppler', {
  h: 'Stand by a road as a racing car passes: its engine note drops sharply from high to low, nee-yow. The car’s engine did not change; the waves reaching you did. That is the Doppler effect, and the same idea measures the speed of cars with radar, of blood with ultrasound, and of whole galaxies with light.',
  s: [
    ['Why the frequency changes', [
      'A source sends out one wavefront every period. If it moves towards you, each new wavefront starts a little closer to you than the last, so the wavefronts in front of it are squashed together: the wavelength is shortened to (v − v_s)/f_s, where v is the wave speed and v_s the source’s speed.',
      'The waves still travel at v through the air, so more wavefronts arrive each second: the frequency you hear is higher. Behind the source they are stretched and the frequency is lower.'
    ], { n: 0, c: ['Does a moving source change the speed of the sound waves?', 'No: the speed is set by the air. Only the spacing of the wavefronts, the wavelength, changes.'] }],
    ['The formula', [
      'For a moving source and a stationary observer, the observed frequency is the source frequency times v/(v − v_s) when the source approaches, and v/(v + v_s) when it moves away.'
    ], { n: 1, e: 'f_o = \\frac{f_s\\,v}{v \\mp v_s}\\qquad(-\\ \\text{approaching},\\ +\\ \\text{receding})', x: ['An ambulance siren sounds at 700 Hz and the ambulance moves at 25 m/s. What frequency do you hear as it comes towards you, and as it goes away? (v = 340 m/s)', ['Approaching: f = 700 × 340 ÷ (340 − 25) = 238 000 ÷ 315 = 756 Hz.', 'Receding: f = 700 × 340 ÷ (340 + 25) = 238 000 ÷ 365 = 652 Hz.'], '756 Hz, then 652 Hz'], c: ['Which sign goes in the denominator for a source moving away, and why?', 'Plus: the denominator is bigger, so the frequency is lower, as the wavefronts are stretched apart.'] }],
    ['A passing siren', [
      'As an ambulance comes towards you at a steady speed you hear a steady, higher note; as it passes, the pitch drops quickly to a steady, lower one. The frequency depends only on the part of the source’s velocity along the line to you, not on how far away it is. That part changes sign as it goes past.'
    ], { n: 2, c: ['As an ambulance drives towards you at a steady speed, does its pitch keep rising as it gets closer?', 'No: it stays at the same higher pitch (it gets louder, not higher), then drops as it passes.'] }],
    ['Uses', [
      'Radar speed guns, weather radar, ultrasound scans of blood flow and astronomers’ measurements of stars and galaxies all use the shift. When waves bounce off a moving object, it receives a shifted frequency and then sends it back as a moving source, so the shift happens twice: Δf/f ≈ 2v/c, where c is the wave speed.'
    ], { n: 3, e: '\\frac{\\Delta f}{f} \\approx \\frac{2v}{c}', x: ['A police radar at 24 GHz reflects off a car coming towards it at 30 m/s. By how much does the frequency of the echo change?', ['Δf ≈ 2v/c × f = 2 × 30 ÷ 3.0 × 10⁸ × 24 × 10⁹.', '= 2.0 × 10⁻⁷ × 24 × 10⁹ = 4800 Hz higher.'], 'about 4.8 kHz'], c: ['Why is there a factor of 2 for a reflected wave?', 'The car first receives a shifted frequency as a moving observer, then re-sends it as a moving source, shifting it again.'] }],
    ['Faster than the waves', [
      'As v_s gets close to v, the wavefronts pile up in front of the source. A source faster than its own waves, such as a supersonic jet, leaves a cone-shaped **shock wave** behind it, heard on the ground as a sonic boom.'
    ], { n: 4, c: ['What does the formula predict when v_s = v, and what really happens?', 'It divides by zero, predicting an infinite frequency: really, the wavefronts pile up into a shock wave.'] }]
  ],
  m: [
    ['Using the wrong sign.', 'Approaching: subtract in the denominator, giving a higher frequency.'],
    ['Thinking the wave speed changes.', 'The medium sets the speed; the wavelength changes.'],
    ['Thinking the pitch rises steadily as the source gets closer.', 'It is steady, then drops as the source passes.']
  ]
});

WL.gd('al-polarisation', {
  h: 'Put on polarising sunglasses and the glare from a lake disappears; tilt your head while looking at your phone and the screen can go dark. Both show that light is a transverse wave, one of a whole family of electromagnetic waves, whose oscillations can be lined up in one direction.',
  s: [
    ['The electromagnetic spectrum', [
      'Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays are all **electromagnetic waves**: oscillating electric and magnetic fields that need no medium. In a vacuum they all travel at c = 3.00 × 10⁸ m/s and differ only in wavelength, from kilometres for radio to less than 10⁻¹² m for gamma rays. Visible light runs from about 400 nm (violet) to 700 nm (red).'
    ], { n: 0, e: 'c = f\\lambda', x: ['Wi-Fi uses 2.4 GHz. What is its wavelength? What is the frequency of green light of wavelength 530 nm?', ['λ = 3.00 × 10⁸ ÷ 2.4 × 10⁹ = 0.125 m, about 12.5 cm.', 'f = 3.00 × 10⁸ ÷ 530 × 10⁻⁹ = 5.7 × 10¹⁴ Hz.'], '12.5 cm; 5.7 × 10¹⁴ Hz'], c: ['What do all electromagnetic waves have in common?', 'They are transverse, they travel at the same speed in a vacuum, and they need no medium.'] }],
    ['Polarisation', [
      'In a **plane-polarised** wave, the oscillations (for light, of the electric field) stay in one plane. Light from the Sun or a lamp is **unpolarised**: its oscillation direction changes randomly. A polarising filter lets through only the part of the oscillation along its **transmission axis**.',
      'Only transverse waves can be polarised. Sound in air is longitudinal, so it cannot be.'
    ], { n: 1, c: ['Why can light be polarised but sound in air cannot?', 'Light’s oscillations are across its direction of travel, so they can point in different directions; sound’s are along its direction of travel, so there is only one.'] }],
    ['Malus’s law: how much gets through', [
      'Plane-polarised light of intensity I₀ meets a filter whose axis is at angle θ to its plane. Only the component of the amplitude along the axis, A₀ cos θ, passes. Intensity goes as amplitude squared, so the transmitted intensity is I₀ cos²θ.',
      'Unpolarised light through one ideal filter loses exactly half its intensity, because every angle is equally likely and the average of cos²θ is ½.'
    ], { n: 2, e: 'I = I_0\\cos^2\\theta', x: ['Polarised light of 40 W/m² meets a filter at 30° to its plane. What intensity gets through?', ['cos 30° = 0.866, and cos²30° = 0.75.', 'I = 40 × 0.75 = 30 W/m².'], '30 W/m²'], c: ['At what angle does a filter pass exactly half of polarised light?', 'cos²θ = ½, so θ = 45°.'] }],
    ['Uses', [
      'Light reflected from water or a road is partly polarised horizontally, so sunglasses with vertical axes cut glare. LCD screens use polarisers to switch pixels on and off; photographers use them to darken skies and remove reflections; engineers view loaded plastic models between polarisers, where stress shows up as coloured bands.'
    ], { n: 3, c: ['Why do polarising sunglasses cut the glare off a lake far more than they dim everything else?', 'The reflected glare is mostly polarised horizontally, so their vertical axes block most of it; ordinary unpolarised light is only halved.'] }],
    ['The three-filter surprise', [
      'Two filters at 90° to each other block all light. Put a third between them at 45°, and light gets through again. The middle filter does not add light: it turns the plane of polarisation so that part of it can pass the last filter.'
    ], { n: 4, x: ['Unpolarised light of intensity I₀ passes through filters at 0°, 45° and 90°. How much comes out?', ['First filter: half gets through, I₀/2.', 'Second, at 45° to the first: I₀/2 × cos²45° = I₀/4.', 'Third, at 45° to the second: I₀/4 × cos²45° = I₀/8.'], 'one eighth of I₀'], c: ['What happens if you now remove the middle filter?', 'The other two are at 90°, so no light gets through.'] }]
  ],
  m: [
    ['Using cos θ instead of cos²θ.', 'Amplitude goes as cos θ; intensity as cos²θ.'],
    ['Forgetting the half for unpolarised light.', 'The first filter passes half of unpolarised light.'],
    ['Saying sound can be polarised.', 'Only transverse waves can be polarised.']
  ]
});
WL.gd('al-stationary', {
  h: 'Pluck a guitar string and it plays one definite note; blow across a bottle and it hums at one pitch. A wave trapped between two ends reflects back on itself, and only certain wavelengths fit. The result is a stationary wave, with points that never move and points that move the most, and it is the physics behind every musical instrument.',
  s: [
    ['How a stationary wave forms', [
      'Send a wave down a string; it reflects at the end and travels back through the incoming wave. The two **superpose** (their displacements add). At some points they always cancel: these are **nodes**, which never move. Halfway between, they reinforce: these are **antinodes**, where the oscillation is largest.',
      'Neighbouring nodes are half a wavelength apart, and a node is a quarter of a wavelength from the next antinode.'
    ], { n: 0, e: '\\text{node to node} = \\frac{\\lambda}{2}', c: ['How far is a node from the nearest antinode?', 'A quarter of a wavelength, λ/4.'] }],
    ['Stationary versus progressive', [
      'A **progressive** wave carries energy along, and every point has the same amplitude but a different phase. In a **stationary** wave no energy is carried along; the amplitude changes from zero at a node to a maximum at an antinode, and all points between two neighbouring nodes move in step.'
    ], { n: 1, c: ['Two points lie on either side of a node, close to it. Are they in phase or in antiphase?', 'In antiphase: as one moves up, the other moves down.'] }],
    ['Strings', [
      'A string fixed at both ends must have a node at each end, so its length must hold a whole number of half-wavelengths: L = nλ/2. The lowest note, the **fundamental**, has one loop; the others, the **harmonics**, are whole-number multiples of its frequency.',
      'The wave speed on a string depends on its tension T and mass per metre μ: v = √(T/μ). Tighter or lighter strings play higher notes.'
    ], { n: 2, e: 'f_n = \\frac{n v}{2L},\\qquad v = \\sqrt{\\frac{T}{\\mu}}', x: ['A guitar string 0.65 m long has a mass per metre of 1.2 × 10⁻³ kg/m and a tension of 75 N. Find its fundamental frequency.', ['v = √(75 ÷ 1.2 × 10⁻³) = √62 500 = 250 m/s.', 'Fundamental: λ = 2L = 1.30 m.', 'f = v/λ = 250 ÷ 1.30 = 192 Hz; the second harmonic is 385 Hz.'], 'about 190 Hz'], c: ['By changing only the tension, how would you raise the note by an octave (double the frequency)?', 'f ∝ v ∝ √T, so the tension must be multiplied by 4.'] }],
    ['Air columns', [
      'In a pipe closed at one end, the air cannot move at the closed end (a node) but moves freely at the open end (an antinode). So the length must be λ/4, 3λ/4, 5λ/4, …: only odd harmonics. A pipe open at both ends has antinodes at both ends and plays all harmonics.',
      'The antinode sits slightly beyond the open end (the end correction), so measure two neighbouring resonance lengths: their difference is exactly λ/2.'
    ], { n: 3, x: ['A 512 Hz tuning fork over a tube of water gives resonances at air-column lengths of 16.2 cm and 49.6 cm. Find the speed of sound.', ['The difference is half a wavelength: λ/2 = 49.6 − 16.2 = 33.4 cm.', 'λ = 66.8 cm = 0.668 m.', 'v = fλ = 512 × 0.668 = 342 m/s.'], '342 m/s'], c: ['A pipe closed at one end is 0.34 m long. What is its lowest note? (v = 340 m/s)', 'L = λ/4, so λ = 1.36 m and f = 340 ÷ 1.36 = 250 Hz. The next note is 750 Hz.'] }],
    ['Microwaves and diffraction', [
      'Microwaves reflected from a metal plate form a stationary wave, and a detector moved along it finds nodes λ/2 apart, which measures the wavelength directly.',
      '**Diffraction** is the spreading of waves through a gap or round an edge. It is strongest when the gap is about the size of the wavelength; a gap much wider than λ lets waves through with little spreading.'
    ], { n: 4, c: ['Why can you hear someone talking round a corner but not see them?', 'Sound wavelengths (about a metre) are similar to the size of a doorway, so sound diffracts strongly; light’s wavelength (about 500 nm) is far smaller, so it hardly spreads.'] }]
  ],
  m: [
    ['Saying nodes are a wavelength apart.', 'Neighbouring nodes are λ/2 apart.'],
    ['Thinking a stationary wave carries energy along.', 'It stores energy in place; no energy is carried along.'],
    ['Giving a closed pipe all harmonics.', 'A pipe closed at one end has only odd harmonics.']
  ]
});

WL.gd('al-interference', {
  h: 'The colours of a soap bubble, the rainbow sheen on a CD and the silence inside noise-cancelling headphones all come from the same thing: two waves meeting and adding up. In 1801 Thomas Young used two narrow slits to show that light is a wave, and measured its wavelength with little more than a ruler.',
  s: [
    ['Superposition', [
      'Where two waves meet, the total displacement is the sum of their separate displacements. Two crests make a bigger crest (**constructive interference**); a crest and a trough of the same size cancel (**destructive interference**). Afterwards, each wave carries on unchanged.'
    ], { n: 0, c: ['Waves of amplitude 3 cm and 2 cm meet, crest to trough. What is the resulting amplitude?', '3 − 2 = 1 cm.'] }],
    ['Coherence', [
      'A steady pattern needs **coherent** sources: the same frequency and a constant phase difference. Two separate lamps are not coherent, because their atoms send out short, random bursts, so any pattern changes billions of times a second and averages out. Young split light from one source with two slits; lasers are naturally coherent.'
    ], { n: 1, c: ['Why do two car headlights not make interference fringes on a wall?', 'They are not coherent: their phase difference changes randomly, so the pattern averages out.'] }],
    ['Path difference', [
      'At a point P, the waves from two in-step sources have travelled different distances. Their **path difference** decides what happens: a whole number of wavelengths means they arrive in step (bright, or loud); a whole number plus a half means they arrive exactly out of step (dark, or quiet).'
    ], { n: 2, e: '\\Delta = n\\lambda\\ \\text{(bright)},\\qquad \\Delta = \\left(n + \\tfrac12\\right)\\lambda\\ \\text{(dark)}', x: ['Two loudspeakers play the same 680 Hz note in step (v = 340 m/s). You stand 3.00 m from one and 3.75 m from the other. Is it loud or quiet there?', ['λ = 340 ÷ 680 = 0.50 m.', 'Path difference = 3.75 − 3.00 = 0.75 m = 1.5 wavelengths.', 'A whole number plus a half: the waves cancel.'], 'quiet (destructive interference)'], c: ['At a point where the path difference is 1.0 m, is it loud or quiet?', '1.0 m = 2 wavelengths, so the waves arrive in step: loud.'] }],
    ['Young’s double slit', [
      'Light through two slits a distance d apart falls on a screen a distance D away. Neighbouring bright fringes are separated by w = λD/d. Longer wavelengths and a more distant screen spread the fringes out; slits further apart squeeze them together.',
      'Measure across several fringes and divide, to reduce the uncertainty in w.'
    ], { n: 3, e: 'w = \\frac{\\lambda D}{d}', x: ['A red laser (650 nm) shines on slits 0.25 mm apart, with the screen 2.0 m away. What is the fringe spacing?', ['Convert: λ = 650 × 10⁻⁹ m, d = 0.25 × 10⁻³ m.', 'w = 650 × 10⁻⁹ × 2.0 ÷ 0.25 × 10⁻³ = 5.2 × 10⁻³ m.'], '5.2 mm'], c: ['What happens to the fringes if the slits are moved closer together?', 'They spread further apart, since w ∝ 1/d.'] }],
    ['Diffraction gratings', [
      'A grating has hundreds of slits per millimetre. Bright lines appear at the same angles as for two slits, d sin θ = nλ, but with so many slits they are extremely sharp and bright. Since sin θ cannot exceed 1, the highest order is the whole number part of d/λ.',
      'Each wavelength appears at its own angle, so a grating splits light into a precise spectrum.'
    ], { n: 4, e: 'd\\sin\\theta = n\\lambda', x: ['Yellow sodium light (589 nm) falls on a grating with 300 lines per mm. Find the angle of the first-order line and the highest order you can see.', ['d = 1 ÷ 300 mm = 3.33 × 10⁻⁶ m.', 'First order: sin θ = 589 × 10⁻⁹ ÷ 3.33 × 10⁻⁶ = 0.177, so θ = 10.2°.', 'd/λ = 5.66, so the highest order is 5.'], '10.2°; up to fifth order'], c: ['Why are a grating’s lines much sharper than double-slit fringes?', 'With many slits, even a small step away from the exact angle makes the contributions cancel, so light appears only very close to it.'] }],
    ['One photon at a time', [
      'Dim the light until only one photon passes through at a time, and the fringe pattern still builds up, dot by dot. Electrons do the same. Each particle seems to pass through the slits as a wave but lands at a single point.'
    ], { n: 5, c: ['Where does any one photon land?', 'At a single point that cannot be predicted; only the pattern made by many photons shows the fringes.'] }]
  ],
  m: [
    ['Expecting fringes from two separate lamps.', 'The sources must be coherent.'],
    ['Mixing units in w = λD/d.', 'Put λ, D and d all in metres.'],
    ['Counting an order beyond d/λ.', 'sin θ ≤ 1, so n can be at most d/λ.']
  ]
});

WL.gd('al-current', {
  h: 'Flick a switch and the lamp lights at once, yet the electrons in the wire crawl along at a fraction of a millimetre per second, slower than a snail. A current is a flow of charge, and one simple counting argument, I = Anvq, explains how so slow a drift can carry so much energy.',
  s: [
    ['Current is a flow of charge', [
      'Current is the rate of flow of charge, I = ΔQ/Δt: one ampere is one coulomb per second. Charge comes in whole multiples of the **elementary charge** e = 1.60 × 10⁻¹⁹ C.',
      '**Conventional current** is drawn from + to −. In metals the moving charges are electrons, which drift the other way.'
    ], { n: 0, e: 'I = \\frac{\\Delta Q}{\\Delta t}', x: ['A phone charger supplies 2.0 A for 1.5 hours. How much charge flows, and how many electrons is that?', ['Δt = 1.5 × 3600 = 5400 s.', 'Q = IΔt = 2.0 × 5400 = 10 800 C.', 'Number = 10 800 ÷ 1.60 × 10⁻¹⁹ = 6.8 × 10²² electrons.'], '10 800 C; 6.8 × 10²² electrons'], c: ['Could an object have a charge of 2.4 × 10⁻¹⁹ C?', 'No: that is 1.5 e, and charge only comes in whole multiples of e.'] }],
    ['Counting the carriers: I = Anvq', [
      'Take a wire of cross-sectional area A, with n charge carriers in each cubic metre, each of charge q, drifting at speed v. In a time t they each move a distance vt, so every carrier in a length vt of wire, a volume Avt, passes a given point.',
      'That is nAvt carriers, carrying charge nAvtq. Divide by t to get the current.'
    ], { n: 1, e: 'I = Anvq', c: ['The same current flows through a thinner part of a wire. What happens to the drift speed there?', 'It increases: v = I/(Anq), so a smaller A needs a bigger v.'] }],
    ['How slow the drift is', [
      'Copper has about 8.5 × 10²⁸ free electrons per cubic metre, so even a large current needs only a tiny drift speed. The lamp lights at once because the electric field that pushes the electrons is set up all round the circuit almost at the speed of light: electrons everywhere start drifting together.'
    ], { n: 2, x: ['A copper wire of diameter 0.50 mm carries 0.80 A. Find the drift speed.', ['A = π(0.25 × 10⁻³)² = 1.96 × 10⁻⁷ m².', 'nq = 8.5 × 10²⁸ × 1.60 × 10⁻¹⁹ = 1.36 × 10¹⁰ C/m³.', 'v = I/(Anq) = 0.80 ÷ (1.96 × 10⁻⁷ × 1.36 × 10¹⁰) = 3.0 × 10⁻⁴ m/s.'], '0.30 mm per second'], c: ['If the electrons drift so slowly, why does the lamp light at once?', 'All the electrons in the circuit start moving together as soon as the field reaches them, which is almost at the speed of light.'] }],
    ['Potential difference and power', [
      'The **potential difference** between two points is the energy transferred per unit charge as charge moves between them: 1 volt = 1 joule per coulomb. Power is energy per second, so multiplying joules per coulomb by coulombs per second gives P = VI. With V = IR, that is also I²R or V²/R.'
    ], { n: 3, e: 'V = \\frac{W}{Q},\\qquad P = VI = I^2R = \\frac{V^2}{R}', x: ['A 12 V car headlamp draws 5.0 A. Find its power and resistance, and the energy it uses in 10 minutes.', ['P = VI = 12 × 5.0 = 60 W.', 'R = V/I = 12 ÷ 5.0 = 2.4 Ω.', 'Energy = Pt = 60 × 600 = 36 000 J (3000 C of charge, each giving up 12 J).'], '60 W; 2.4 Ω; 36 kJ'], c: ['A 3.0 kW kettle runs on 230 V. What current does it draw?', 'I = P/V = 3000 ÷ 230 = 13 A.'] }],
    ['Semiconductors', [
      'In a semiconductor, n is far smaller than in a metal, so the same current needs a much larger drift speed. That is why semiconductors have high resistance, and why the Hall voltage, which depends on 1/(nq), is big enough in them to make sensitive magnetic-field probes.'
    ], { n: 4, c: ['Why must the carriers move faster in a semiconductor than in a metal for the same current and area?', 'There are far fewer of them per cubic metre, so each must drift faster: v = I/(Anq).'] }]
  ],
  m: [
    ['Mixing up conventional current and electron flow.', 'Conventional current runs + to −; electrons drift the other way.'],
    ['Leaving the area in mm².', '1 mm² = 10⁻⁶ m².'],
    ['Thinking electrons race round the circuit.', 'They drift slowly; it is the field that travels fast.']
  ]
});

WL.gd('al-resistivity', {
  h: 'Why are mains cables made of thick copper, but a toaster’s glowing element of thin nichrome? Resistance depends on the material, the length and the thickness. And plotting current against voltage shows how each component really behaves: a straight line for a resistor, a curve for a lamp, and a one-way door for a diode.',
  s: [
    ['Resistance and Ohm’s law', [
      '**Resistance** is defined as R = V/I, measured in ohms (Ω): it is how many volts it takes to push each amp through.',
      '**Ohm’s law** is a separate statement: for a metal at constant temperature, the current is proportional to the potential difference, so R stays the same. Components that obey it are **ohmic**.'
    ], { n: 0, e: 'R = \\frac{V}{I}', c: ['Is R = V/I Ohm’s law?', 'No: it defines resistance for any component. Ohm’s law says that for some components R stays constant as V changes.'] }],
    ['Resistivity', [
      'A longer wire has more resistance (the voltage is shared along it), and a thicker wire has less (more paths side by side). So R ∝ L/A. The constant is the **resistivity** ρ, a property of the material: about 1.7 × 10⁻⁸ Ω m for copper and 1.1 × 10⁻⁶ Ω m for nichrome.'
    ], { n: 1, e: 'R = \\frac{\\rho L}{A}', x: ['What is the resistance of 100 m of copper cable with a cross-sectional area of 1.5 mm²?', ['A = 1.5 × 10⁻⁶ m².', 'R = ρL/A = 1.7 × 10⁻⁸ × 100 ÷ 1.5 × 10⁻⁶.', '= 1.1 Ω.'], 'about 1.1 Ω'], c: ['A wire is stretched to twice its length, keeping its volume the same. What happens to its resistance?', 'The length doubles and the area halves, so R becomes four times as big.'] }],
    ['I–V characteristics', [
      'An ohmic resistor gives a straight line through the origin. A filament lamp’s graph curves over: as the current grows, the filament heats up and its resistance rises. A diode lets current through in one direction only, and only once the voltage passes about 0.7 V (for silicon); in reverse almost nothing flows.'
    ], { n: 2, x: ['A filament lamp passes 0.10 A at 1.0 V and 0.25 A at 6.0 V. Find its resistance at each voltage.', ['At 1.0 V: R = 1.0 ÷ 0.10 = 10 Ω.', 'At 6.0 V: R = 6.0 ÷ 0.25 = 24 Ω.', 'The resistance more than doubles as the filament gets hot.'], '10 Ω, then 24 Ω'], c: ['Why does a filament lamp’s I–V graph curve?', 'Its filament gets hotter as the current rises, and a hotter metal has a higher resistance.'] }],
    ['Why hot metals resist more', [
      'In a metal the number of free electrons is fixed. When it gets hotter, the ions vibrate more and scatter the drifting electrons more often, so the resistance rises: for copper, by about 0.4% per kelvin.'
    ], { n: 3, x: ['A copper coil has a resistance of 20.0 Ω at 20 °C. Estimate its resistance at 70 °C.', ['A 50 K rise at 0.4% per kelvin is a 20% increase.', '20.0 × 1.20 = 24 Ω.'], 'about 24 Ω'], c: ['Why does heating a metal not give it more free electrons?', 'Its outer electrons are already free; heating only increases how often they are scattered.'] }],
    ['Sensors: LDRs and thermistors', [
      'A **light-dependent resistor** (LDR) has less resistance in brighter light. An **NTC thermistor** has less resistance when it is hotter. In both, the extra energy frees more charge carriers, which outweighs any extra scattering.'
    ], { n: 4, c: ['An NTC thermistor’s resistance falls from 10 kΩ to 2 kΩ as it warms up. Why?', 'Heat frees many more charge carriers in the semiconductor, which more than makes up for the extra scattering.'] }]
  ],
  m: [
    ['Calling R = V/I Ohm’s law.', 'R = V/I defines resistance; Ohm’s law says it stays constant.'],
    ['Using the diameter as the radius.', 'A = π(d/2)².'],
    ['Saying a thermistor’s resistance rises with temperature.', 'For an NTC thermistor it falls.']
  ]
});

WL.gd('al-dc-circuits', {
  h: 'Start a car with its headlights on and they dim while the engine turns over. The battery has not changed its voltage: some of its energy is used up inside it. This topic explains that internal resistance, and gives you two laws, one for charge and one for energy, that solve any circuit you will meet.',
  s: [
    ['e.m.f. and p.d.', [
      'The **e.m.f.** of a source is the energy it gives each coulomb of charge, turning chemical or other energy into electrical energy. The **p.d.** across a component is the energy each coulomb gives up there. Both are measured in volts (joules per coulomb).'
    ], { n: 0, c: ['A battery has an e.m.f. of 9.0 V. How much energy does it give each coulomb?', '9.0 J.'] }],
    ['Internal resistance', [
      'A real source acts like a perfect e.m.f. E in series with an **internal resistance** r. Each coulomb loses Ir joules inside, the “lost volts”, so the **terminal p.d.** across the outside circuit is V = E − Ir, less than the e.m.f. whenever current flows.',
      'A graph of terminal p.d. against current is a straight line: the intercept is E and the gradient is −r.'
    ], { n: 1, e: 'E = I(R + r),\\qquad V = E - Ir', x: ['A 1.5 V cell with internal resistance 0.50 Ω is connected to a 2.5 Ω resistor. Find the current and the terminal p.d.', ['Total resistance = 2.5 + 0.50 = 3.0 Ω.', 'I = E/(R + r) = 1.5 ÷ 3.0 = 0.50 A.', 'V = E − Ir = 1.5 − 0.50 × 0.50 = 1.25 V.'], '0.50 A; 1.25 V'], c: ['A 12.0 V car battery with internal resistance 0.020 Ω supplies 150 A to the starter motor. What is the terminal p.d.?', 'Lost volts = 150 × 0.020 = 3.0 V, so V = 9.0 V: that is why the headlights dim.'] }],
    ['Kirchhoff’s two laws', [
      '**First law (charge)**: the total current into a junction equals the total current out. **Second law (energy)**: round any closed loop, the sum of the e.m.f.s equals the sum of the p.d.s (IR terms).',
      'Mark a direction for each current, write the laws, and solve; a negative answer just means the current flows the other way.'
    ], { n: 2, e: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}},\\qquad \\sum E = \\sum IR', x: ['A 12 V supply (no internal resistance) drives 2.0 Ω in series with a parallel pair of 6.0 Ω and 3.0 Ω. Find every current, and check both laws.', ['The parallel pair: 1/R = 1/6 + 1/3, so R = 2.0 Ω. Total 4.0 Ω, so I = 12 ÷ 4.0 = 3.0 A.', 'p.d. across the 2.0 Ω: 6.0 V; across the pair: 6.0 V. Loop: 12 = 6.0 + 6.0.', 'Branch currents: 6.0 ÷ 6.0 = 1.0 A and 6.0 ÷ 3.0 = 2.0 A. Junction: 3.0 = 1.0 + 2.0.'], '3.0 A, splitting into 1.0 A and 2.0 A'], c: ['A 6.0 V cell and a 2.0 V cell are joined in series facing opposite ways, with a 4.0 Ω resistor. What current flows?', 'The e.m.f.s oppose: 6.0 − 2.0 = 4.0 V, so I = 4.0 ÷ 4.0 = 1.0 A.'] }],
    ['Combining resistors', [
      'In **series** the same current flows through each and the p.d.s add, so the resistances add. In **parallel** each has the same p.d. and the currents add, so the reciprocals add. The parallel total is always less than the smallest branch.'
    ], { n: 3, e: 'R_s = R_1 + R_2 + \\dots,\\qquad \\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots', x: ['You have three 6.0 Ω resistors. What totals can you make using all three?', ['All in series: 18 Ω.', 'All in parallel: 1/R = 3/6, so R = 2.0 Ω.', 'Two in parallel (3.0 Ω) in series with the third: 9.0 Ω; two in series (12 Ω) in parallel with the third: 4.0 Ω.'], '18, 9.0, 4.0 and 2.0 Ω'], c: ['You add another resistor in parallel. Does the total resistance go up or down?', 'Down: there is one more path for the current.'] }],
    ['Getting the most power out', [
      'The power delivered to an outside resistance R is P = E²R/(R + r)². It is largest when R = r, but then half of all the power is wasted inside the source.'
    ], { n: 4, e: 'P = \\frac{E^2R}{(R + r)^2}', x: ['A 6.0 V source has internal resistance 2.0 Ω. Find the power in a load of 1.0 Ω, 2.0 Ω and 4.0 Ω.', ['R = 1.0 Ω: P = 36 × 1.0 ÷ 3.0² = 4.0 W.', 'R = 2.0 Ω: P = 36 × 2.0 ÷ 4.0² = 4.5 W.', 'R = 4.0 Ω: P = 36 × 4.0 ÷ 6.0² = 4.0 W.'], 'greatest, 4.5 W, when R = r'], c: ['Why are power stations and batteries not designed with R = r?', 'Half the power would be wasted inside the source; they are built with r far smaller than the load.'] }]
  ],
  m: [
    ['Taking the terminal p.d. to equal the e.m.f. when current flows.', 'Subtract the lost volts, Ir.'],
    ['Ignoring the direction of an e.m.f. in a loop.', 'An e.m.f. driving against your loop direction counts as negative.'],
    ['Adding parallel resistances directly.', 'Add the reciprocals, then take the reciprocal.']
  ]
});

WL.gd('al-potential-divider', {
  h: 'A street light switches itself on at dusk with nobody touching it. Inside is a simple trick: two resistors in series share a voltage, and if one of them responds to light, the share changes as the light fades. The same idea, taken one step further, measures an e.m.f. without drawing any current at all.',
  s: [
    ['Sharing a voltage', [
      'Two resistors R₁ and R₂ in series across a supply V_in carry the same current, so the p.d.s across them are in the ratio of their resistances. The output across R₂ is a fixed fraction of the input.'
    ], { n: 0, e: 'V_{\\text{out}} = V_{\\text{in}}\\frac{R_2}{R_1 + R_2}', x: ['A 9.0 V supply is connected across 2.0 kΩ and 1.0 kΩ in series. What is the p.d. across the 1.0 kΩ resistor?', ['V_out = 9.0 × 1.0 ÷ (2.0 + 1.0) = 3.0 V.', 'The 2.0 kΩ resistor takes the other 6.0 V: twice the resistance, twice the voltage.'], '3.0 V'], c: ['You want 6.0 V across R₂ = 10 kΩ from a 9.0 V supply. What should R₁ be?', 'R₂ must take two thirds of the voltage, so R₁ = 5.0 kΩ.'] }],
    ['Sensor circuits', [
      'Replace one resistor with an LDR or a thermistor and the output follows the light or temperature. Choose which resistor to take the output across: as the sensor’s resistance changes, the share of the voltage across each resistor changes in opposite directions.'
    ], { n: 1, x: ['An LDR (R₁) and a fixed 10 kΩ resistor (R₂) are in series on 6.0 V, with the output across the fixed resistor. The LDR is 1.0 kΩ in daylight and 100 kΩ in the dark. Find the output in each case.', ['Daylight: V_out = 6.0 × 10 ÷ (1.0 + 10) = 5.5 V.', 'Dark: V_out = 6.0 × 10 ÷ (100 + 10) = 0.55 V.', 'So this output falls in the dark; to switch a lamp on at night, take the output across the LDR instead.'], '5.5 V in daylight; 0.55 V in the dark'], c: ['Using an NTC thermistor, across which resistor should you take the output so that it rises as it gets hotter?', 'Across the fixed resistor: the thermistor’s resistance falls, so the fixed resistor takes a bigger share.'] }],
    ['Loading', [
      'Connecting a load (or a voltmeter) across R₂ puts it in parallel with R₂, which lowers the combined resistance and so lowers V_out. The divider equation only works if the load’s resistance is much larger than R₂.'
    ], { n: 2, x: ['A 1.0 kΩ load is connected across the 1.0 kΩ resistor of the 9.0 V divider above. What is the output now?', ['1.0 kΩ in parallel with 1.0 kΩ is 0.50 kΩ.', 'V_out = 9.0 × 0.50 ÷ (2.0 + 0.50) = 1.8 V.', 'It drops from 3.0 V to 1.8 V.'], '1.8 V'], c: ['Why should a voltmeter have a very high resistance?', 'So that, in parallel with a component, it hardly changes the circuit’s resistance or the voltage it is measuring.'] }],
    ['The potentiometer', [
      'A driver cell keeps a steady current in a uniform resistance wire, so the p.d. along it is proportional to the length. A test cell is connected through a sensitive meter (a galvanometer) to a sliding contact. At the **balance point** the meter reads zero: no current flows through the test cell, so the p.d. along that length equals its e.m.f. exactly.',
      'Comparing two cells’ balance lengths compares their e.m.f.s.'
    ], { n: 3, e: '\\frac{E_1}{E_2} = \\frac{l_1}{l_2}', x: ['A standard cell of e.m.f. 1.018 V balances at 0.509 m. A test cell balances at 0.742 m on the same wire. Find its e.m.f.', ['E₁/E₂ = l₁/l₂, so E = 1.018 × 0.742 ÷ 0.509.', '= 1.484 V.'], '1.484 V'], c: ['Why does a potentiometer measure the e.m.f. rather than the terminal p.d.?', 'At balance no current flows through the cell, so there are no lost volts in its internal resistance.'] }],
    ['Null methods', [
      'A **null method** compares two quantities by adjusting until a detector reads zero. The detector only needs to show zero, not measure a value, so its calibration does not matter, and nothing is drawn from the quantity being measured.'
    ], { n: 4, c: ['Why does the galvanometer in a potentiometer not need an accurate scale?', 'It only has to show when the current is zero.'] }]
  ],
  m: [
    ['Taking the output across the wrong resistor.', 'Decide which way the output must move, then pick the resistor whose share moves that way.'],
    ['Ignoring the load.', 'A load in parallel lowers the output unless its resistance is much larger.'],
    ['Reading the e.m.f. off the galvanometer.', 'The galvanometer only shows balance; the e.m.f. comes from the length.']
  ]
});
WL.gd('al-particles', {
  h: 'Protons and neutrons are not the smallest things: each is made of three quarks. Beta decay is one kind of quark turning into another. And a simple piece of bookkeeping, checking that charge and a few other numbers balance, predicted the neutrino 26 years before anyone detected one.',
  s: [
    ['The nucleus and its decays', [
      'A nucleus holds protons and neutrons (**nucleons**): Z protons, A nucleons in all. In **alpha decay** it emits a helium-4 nucleus, so A falls by 4 and Z by 2. In **β⁻ decay** a neutron becomes a proton, emitting an electron and an electron antineutrino, so Z rises by 1. In **β⁺ decay** a proton becomes a neutron, emitting a positron and a neutrino, so Z falls by 1. Gamma emission changes neither.'
    ], { n: 0, e: '\\beta^-:\\ n \\rightarrow p + e^- + \\bar\\nu_e\\qquad \\beta^+:\\ p \\rightarrow n + e^+ + \\nu_e', x: ['Strontium-90 (Z = 38) decays by β⁻; carbon-11 (Z = 6) decays by β⁺. What do they become?', ['β⁻: A stays 90, Z becomes 39: yttrium-90, plus an electron and an antineutrino.', 'β⁺: A stays 11, Z becomes 5: boron-11, plus a positron and a neutrino.'], 'yttrium-90; boron-11'], c: ['In β⁺ decay, what happens to A and Z?', 'A stays the same; Z falls by 1.'] }],
    ['Why the neutrino had to exist', [
      'Alpha particles from one kind of decay all come out with the same energy. Beta particles come out with a whole spread of energies up to a maximum. If only two particles were produced, conservation of energy and momentum would fix the electron’s energy. In 1930 Pauli proposed a third, almost undetectable particle that carries off the rest; it was detected in 1956.'
    ], { n: 1, c: ['If beta decay produced only the new nucleus and an electron, what would the electrons’ energies be like?', 'They would all have the same energy. The observed spread shows a third particle shares the energy.'] }],
    ['Antiparticles', [
      'Every particle has an **antiparticle** with the same mass and the opposite charge: the positron is the antielectron. When a particle meets its antiparticle they can **annihilate**, turning their mass entirely into photons.'
    ], { n: 2, e: 'E = mc^2', x: ['An electron and a positron, both nearly at rest, annihilate into two photons. What is the energy of each photon? (m_e = 9.11 × 10⁻³¹ kg)', ['Each particle’s mass gives one photon: E = mc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)².', '= 8.2 × 10⁻¹⁴ J, which is 0.51 MeV.'], '8.2 × 10⁻¹⁴ J (0.51 MeV) each'], c: ['Why must annihilation at rest produce two photons, not one?', 'The total momentum is zero; one photon would carry momentum, so two must fly apart in opposite directions.'] }],
    ['Quarks, hadrons and leptons', [
      'Particles made of quarks are **hadrons**: **baryons** have three quarks (the proton is uud, the neutron udd) and **mesons** have a quark and an antiquark. The up quark has charge +⅔e and the down quark −⅓e.',
      '**Leptons**, such as the electron, the muon and the neutrinos, are not made of anything smaller, as far as we know.'
    ], { n: 3, e: 'p = uud,\\qquad n = udd', x: ['Check the charges of the proton and the neutron from their quarks.', ['Proton, uud: +⅔ + ⅔ − ⅓ = +1.', 'Neutron, udd: +⅔ − ⅓ − ⅓ = 0.'], '+e and 0, as they should be'], c: ['A π⁺ meson is an up quark and an anti-down quark. What is its charge?', 'An anti-down quark has +⅓e, so +⅔ + ⅓ = +1: charge +e.'] }],
    ['Beta decay inside the nucleon', [
      'In β⁻ decay a down quark turns into an up quark, so udd becomes uud. Only the **weak interaction** can change a quark’s type. Every interaction must conserve charge, **baryon number** (+⅓ for each quark, −⅓ for each antiquark) and **lepton number** (+1 for each lepton, −1 for each antilepton).'
    ], { n: 4, e: '\\beta^-:\\ d \\rightarrow u + e^- + \\bar\\nu_e', x: ['Check that n → p + e⁻ + ν̄ₑ conserves charge, baryon number and lepton number.', ['Charge: 0 → +1 − 1 + 0 = 0.', 'Baryon number: 1 → 1 + 0 + 0 = 1.', 'Lepton number: 0 → 0 + 1 − 1 = 0 (the electron +1, the antineutrino −1).'], 'all three balance'], c: ['Could a proton in a nucleus decay as p → n + e⁺, with no neutrino?', 'No: lepton number would go from 0 to −1 (the positron is an antilepton). A neutrino (+1) is needed to balance it.'] }]
  ],
  m: [
    ['Calling protons and neutrons fundamental.', 'They are each made of three quarks.'],
    ['Swapping the neutrino and antineutrino.', 'β⁻ gives an antineutrino; β⁺ gives a neutrino.'],
    ['Giving each quark a baryon number of 1.', 'Each quark has ⅓, so three make a baryon number of 1.']
  ]
});

WL.gd('al-circular', {
  h: 'A car going round a roundabout at a steady 30 km/h is accelerating, even though its speedometer never moves. Velocity has a direction, and the direction keeps changing. That acceleration points to the centre of the circle, and something real, friction, tension or gravity, has to provide the force for it.',
  s: [
    ['Radians and angular speed', [
      'Angles in circular motion are measured in **radians**: one radian is the angle where the arc equals the radius, so a full turn is 2π rad. The **angular speed** ω is the angle swept per second: ω = 2π/T = 2πf.',
      'The speed along the circle is v = rω, so for the same ω, points further out move faster.'
    ], { n: 0, e: '\\omega = \\frac{2\\pi}{T} = 2\\pi f,\\qquad v = r\\omega', x: ['A washing-machine drum of radius 0.25 m spins at 1200 revolutions per minute. Find its angular speed and the speed of its rim.', ['f = 1200 ÷ 60 = 20 rev/s.', 'ω = 2π × 20 = 126 rad/s.', 'v = rω = 0.25 × 126 = 31 m/s.'], '126 rad/s; 31 m/s'], c: ['Two children sit on a roundabout, 1 m and 2 m from the centre. Which has the larger angular speed, and which the larger speed?', 'They have the same angular speed; the outer child moves twice as fast.'] }],
    ['Why the acceleration points inwards', [
      'Compare the velocity at two moments a short time apart. Both arrows have the same length v, but the second has turned through a small angle. The change between them points towards the centre of the circle.',
      'Working out its size gives a = v²/r, or ω²r. This **centripetal acceleration** always points to the centre.'
    ], { n: 1, e: 'a = \\frac{v^2}{r} = \\omega^2 r', x: ['What is the acceleration of the rim of the washing-machine drum?', ['a = ω²r = 125.7² × 0.25.', '= 3950 m/s², about 400 times g.'], 'about 4000 m/s²'], c: ['Is an object moving in a circle at constant speed in equilibrium?', 'No: its velocity keeps changing direction, so it is accelerating and there must be a resultant force.'] }],
    ['Centripetal force is a job, not a force', [
      'By F = ma, a resultant force mv²/r towards the centre is needed. Do not draw it as an extra force: it is the job that real forces are doing. For a car on a flat bend it is friction; for the Moon, gravity; for a ball on a string, tension.'
    ], { n: 2, e: 'F = \\frac{mv^2}{r} = m\\omega^2 r', x: ['A 0.20 kg ball on a 0.80 m string is whirled in a horizontal circle at 3.0 revolutions per second. What is the tension? (Ignore gravity.)', ['ω = 2π × 3.0 = 18.8 rad/s.', 'F = mω²r = 0.20 × 18.8² × 0.80.', '= 57 N.'], 'about 57 N'], c: ['What provides the centripetal force for the Moon, and for a car on a flat bend?', 'For the Moon, the Earth’s gravity; for the car, friction between the tyres and the road.'] }],
    ['Bends and banked tracks', [
      'On a flat bend, friction must provide mv²/r. The most friction available is μmg, so the top speed is √(μgr). Banking a track tilts the normal force so that its horizontal part provides the centripetal force: with no friction needed, tan θ = v²/(rg).'
    ], { n: 3, e: 'v_{\\max} = \\sqrt{\\mu g r},\\qquad \\tan\\theta = \\frac{v^2}{rg}', x: ['A car takes a flat bend of radius 50 m. The coefficient of friction is 0.80. What is its top speed?', ['Friction provides the force: μmg = mv²/r, so the mass cancels.', 'v = √(0.80 × 9.81 × 50) = √392 = 19.8 m/s.', 'That is about 71 km/h; faster, and the car slides outwards.'], 'about 20 m/s'], c: ['At what angle should a bend of radius 200 m be banked so that a car at 25 m/s needs no friction?', 'tan θ = 25² ÷ (200 × 9.81) = 0.32, so θ = 18°.'] }],
    ['Feeling heavier and lighter', [
      'What you feel as your weight is the normal force pushing on you. At the bottom of a loop it must hold you up and also provide the centripetal force, so N = mg + mv²/r and you feel heavier. At the top, gravity already pulls towards the centre; at the right speed N falls to zero and you feel weightless.'
    ], { n: 4, x: ['A 60 kg rider passes the bottom of a roller-coaster loop of radius 10 m at 20 m/s. What is the normal force? What is the slowest speed that keeps the cars on the track at the top?', ['Bottom: N = mg + mv²/r = 589 + 60 × 400 ÷ 10 = 589 + 2400 = 2990 N, about five times her weight.', 'Top: the track must still push down or be just touching, so mg ≤ mv²/r, giving v ≥ √(gr) = √98.1 = 9.9 m/s.'], 'about 3000 N; at least 9.9 m/s at the top'], c: ['Astronauts in orbit feel weightless, but gravity is still about 90% as strong there. Why?', 'They and their spacecraft are falling together round the Earth, so nothing pushes on them: no normal force.'] }]
  ],
  m: [
    ['Drawing “centripetal force” as an extra force.', 'It is the resultant of the real forces, pointing to the centre.'],
    ['Using revolutions per minute for ω.', 'Convert to radians per second first.'],
    ['Saying there is an outward force pulling you out.', 'Seen from the ground, the only resultant points inwards; you tend to carry on in a straight line.']
  ]
});

WL.gd('al-gravfields', {
  h: 'Newton realised that the force pulling an apple to the ground also keeps the Moon in orbit, and that it weakens with the square of the distance. From that single law come the speed of every satellite, why Neptune takes 165 years to go round the Sun, where to park a TV satellite, how fast a rocket must go to escape, and the mass of the Sun itself.',
  s: [
    ['Newton’s law of gravitation', [
      'Every two masses attract each other with a force proportional to both masses and inversely proportional to the square of the distance between their centres. G = 6.67 × 10⁻¹¹ N m² kg⁻² is tiny, so gravity between everyday objects is far too small to notice. Outside a sphere, its gravity acts as if all its mass were at its centre.'
    ], { n: 0, e: 'F = \\frac{GMm}{r^2}', x: ['Find the gravitational force between the Earth (6.0 × 10²⁴ kg) and the Moon (7.3 × 10²² kg), 3.84 × 10⁸ m apart.', ['F = 6.67 × 10⁻¹¹ × 6.0 × 10²⁴ × 7.3 × 10²² ÷ (3.84 × 10⁸)².', 'Top: 2.92 × 10³⁷. Bottom: 1.47 × 10¹⁷.', 'F = 2.0 × 10²⁰ N.'], '2.0 × 10²⁰ N'], c: ['Estimate the pull between two 70 kg people 1 m apart.', 'F = 6.67 × 10⁻¹¹ × 70 × 70 ÷ 1² = 3.3 × 10⁻⁷ N: far too small to feel.'] }],
    ['Field strength and potential', [
      'The **gravitational field strength** g is the force on each kilogram: GM/r², pointing towards the mass. The **gravitational potential** φ is the work done per kilogram to bring a mass from very far away (infinity) to that point. It is negative, because gravity pulls the mass in, and it rises towards zero far away.'
    ], { n: 1, e: 'g = \\frac{GM}{r^2},\\qquad \\phi = -\\frac{GM}{r}', x: ['The Earth’s radius is 6.37 × 10⁶ m. What is g at the height of the International Space Station, 400 km up?', ['r = 6.37 × 10⁶ + 0.40 × 10⁶ = 6.77 × 10⁶ m.', 'g ∝ 1/r², so g = 9.81 × (6.37 ÷ 6.77)² = 9.81 × 0.885.', '= 8.7 N/kg, about 89% of its value at the surface.'], '8.7 N/kg'], c: ['Why is gravitational potential negative?', 'It is zero far away, and you must do work to pull a mass out of the field, so everywhere closer in it is less than zero.'] }],
    ['Orbits and Kepler’s third law', [
      'In a circular orbit, gravity provides the centripetal force: GMm/r² = mv²/r. The satellite’s own mass m cancels, so every satellite at the same radius moves at the same speed, v = √(GM/r).',
      'Using v = 2πr/T gives **Kepler’s third law**: the square of the period is proportional to the cube of the radius.'
    ], { n: 2, e: 'v = \\sqrt{\\frac{GM}{r}},\\qquad T^2 = \\frac{4\\pi^2}{GM}\\,r^3', x: ['Find the speed and period of the Space Station, at r = 6.77 × 10⁶ m. (GM for the Earth = 4.0 × 10¹⁴ m³ s⁻²)', ['v = √(4.0 × 10¹⁴ ÷ 6.77 × 10⁶) = √(5.91 × 10⁷) = 7.7 × 10³ m/s.', 'T = 2πr/v = 2π × 6.77 × 10⁶ ÷ 7690 = 5530 s.', 'That is 92 minutes: about 15 orbits a day.'], '7.7 km/s; 92 minutes'], c: ['Two satellites orbit at the same radius; one has twice the mass. How do their speeds compare?', 'They are the same: the satellite’s mass cancels.'] }],
    ['Geostationary orbits', [
      'A satellite above the equator whose period is one sidereal day (86 164 s) keeps pace with the turning Earth and stays above the same point. Kepler’s law fixes the radius: about 42 200 km from the Earth’s centre, 35 800 km above the surface.'
    ], { n: 3, x: ['Use T² = 4π²r³/GM to find the geostationary radius.', ['r³ = GMT²/4π² = 4.0 × 10¹⁴ × 86 164² ÷ 39.5.', '= 4.0 × 10¹⁴ × 7.42 × 10⁹ ÷ 39.5 = 7.5 × 10²² m³.', 'r = ∛(7.5 × 10²²) = 4.22 × 10⁷ m.'], 'about 42 200 km from the centre'], c: ['Why must a geostationary satellite be above the equator?', 'Its orbit is centred on the Earth’s centre, so only an orbit over the equator can stay above one point as the Earth turns.'] }],
    ['Energy and escape', [
      'The gravitational potential energy of a mass m at distance r is −GMm/r. To escape completely, its kinetic energy must at least cancel that, which gives the **escape speed** √(2GM/r): √2 times the speed of a circular orbit at the same radius.'
    ], { n: 4, e: 'v_{\\text{esc}} = \\sqrt{\\frac{2GM}{r}}', x: ['Find the escape speed from the Earth’s surface.', ['v = √(2 × 4.0 × 10¹⁴ ÷ 6.37 × 10⁶) = √(1.26 × 10⁸).', '= 1.12 × 10⁴ m/s.'], '11.2 km/s'], c: ['Does escape speed depend on the rocket’s mass or the direction it is fired?', 'No (ignoring air): it comes from an energy balance in which the mass cancels, and kinetic energy has no direction.'] }],
    ['Weighing the heavens', [
      'Measure the radius and period of something in orbit, and Kepler’s law gives the mass of what it orbits: M = 4π²r³/(GT²). The Earth’s orbit weighs the Sun; the Moon’s orbit weighs the Earth.'
    ], { n: 5, e: 'M = \\frac{4\\pi^2 r^3}{G T^2}', x: ['The Earth orbits the Sun at 1.50 × 10¹¹ m once every 3.16 × 10⁷ s. Find the Sun’s mass.', ['Top: 4π² × (1.50 × 10¹¹)³ = 39.5 × 3.38 × 10³³ = 1.33 × 10³⁵.', 'Bottom: 6.67 × 10⁻¹¹ × (3.16 × 10⁷)² = 6.66 × 10⁴.', 'M = 2.0 × 10³⁰ kg.'], '2.0 × 10³⁰ kg'], c: ['The Moon orbits at 3.84 × 10⁸ m every 27.3 days. What mass does that give for the Earth?', 'T = 2.36 × 10⁶ s, so M = 4π² × (3.84 × 10⁸)³ ÷ (6.67 × 10⁻¹¹ × (2.36 × 10⁶)²) = 6.0 × 10²⁴ kg.'] }]
  ],
  m: [
    ['Using the height above the surface as r.', 'r is measured from the centre of the planet.'],
    ['Thinking a heavier satellite needs a different orbital speed.', 'The satellite’s mass cancels.'],
    ['Saying potential is zero at the surface.', 'It is zero at infinity and negative everywhere closer.']
  ]
});

WL.gd('al-temperature', {
  h: 'Why does steam at 100 °C scald far worse than boiling water at the same temperature, and why does the sea stay cool through a hot summer? Warming a substance takes energy in proportion to its mass and its specific heat capacity, and changing its state takes a hidden extra amount, the latent heat, without any change of temperature at all.',
  s: [
    ['Thermal equilibrium', [
      'Energy flows by heating from a hotter body to a colder one. When there is no net flow between two bodies in contact they are in **thermal equilibrium**, and they are at the same temperature. That is how a thermometer works: it comes into equilibrium with what it measures.'
    ], { n: 0, c: ['You put a thermometer into a cup of tea. When can you read it?', 'Once it has reached thermal equilibrium with the tea, so that its reading has stopped changing.'] }],
    ['Temperature scales', [
      'Practical thermometers use a property that changes with temperature: the expansion of a liquid, the resistance of a wire, the pressure of a gas. They are calibrated at two **fixed points**, such as melting ice and boiling water.',
      'The **thermodynamic** (Kelvin) scale does not depend on any substance; it starts at **absolute zero**. T in kelvin = θ in °C + 273.15. A change of 1 K is the same as a change of 1 °C.'
    ], { n: 1, e: 'T/\\text{K} = \\theta/^\\circ\\text{C} + 273.15', x: ['A platinum resistance thermometer reads 100.0 Ω in melting ice and 138.5 Ω in boiling water. Assuming a straight-line change, what temperature does 119.4 Ω show?', ['Between 0 °C and 100 °C, R rises by 38.5 Ω.', '119.4 Ω is 19.4 Ω above the ice reading: 19.4 ÷ 38.5 = 0.504 of the way.', 'θ = 0.504 × 100 = 50.4 °C.'], '50.4 °C'], c: ['A temperature rises from 20 °C to 50 °C. What is the rise in kelvin?', '30 K: temperature differences are the same on both scales.'] }],
    ['Specific heat capacity', [
      'The **specific heat capacity** c is the energy needed to raise the temperature of 1 kg by 1 K. Water’s is unusually large, 4200 J kg⁻¹ K⁻¹, which is why the sea warms and cools so slowly.',
      'To measure c, heat a known mass with an electric heater of known power for a measured time, with insulation, and record the temperature rise: c = Pt/(mΔθ). Heat lost to the surroundings makes the measured value too large.'
    ], { n: 2, e: 'E = mc\\Delta\\theta', x: ['How long does a 2.0 kW kettle take to heat 1.5 kg of water from 15 °C to 100 °C, if no energy is lost?', ['E = mcΔθ = 1.5 × 4200 × 85 = 535 500 J.', 't = E/P = 535 500 ÷ 2000 = 268 s.'], 'about 4½ minutes'], c: ['Why does the sea warm up so much more slowly than the land in summer?', 'Water has a very large specific heat capacity, so the same energy raises its temperature much less.'] }],
    ['Latent heat', [
      'While a substance melts or boils, its temperature stays constant even though energy is going in. The energy breaks the bonds between molecules, raising their potential energy, rather than making them move faster. The **specific latent heat** L is the energy per kilogram for the change of state.',
      'For water, vaporisation (2.26 MJ/kg) takes about seven times as much as melting (0.334 MJ/kg).'
    ], { n: 3, e: 'E = mL', x: ['How much energy turns 0.50 kg of ice at −10 °C into water at 20 °C? (c for ice = 2100 J kg⁻¹ K⁻¹)', ['Warm the ice to 0 °C: 0.50 × 2100 × 10 = 10 500 J.', 'Melt it: 0.50 × 334 000 = 167 000 J.', 'Warm the water to 20 °C: 0.50 × 4200 × 20 = 42 000 J.', 'Total = 219 500 J.'], 'about 220 kJ, most of it for melting'], c: ['Why is a scald from steam worse than one from boiling water?', 'As steam condenses on the skin it gives out 2.26 MJ/kg of latent heat, before it even starts to cool.'] }],
    ['Heating curves', [
      'Heat a substance at a steady rate and plot temperature against time. Sloping sections are where its temperature rises (a smaller c gives a steeper slope); flat sections are changes of state (a larger L gives a longer plateau).'
    ], { n: 4, c: ['On a heating curve for water at steady power, why is the boiling plateau much longer than the melting one?', 'The latent heat of vaporisation is about seven times the latent heat of fusion.'] }]
  ],
  m: [
    ['Converting a temperature change to kelvin by adding 273.', 'A change of 1 °C is a change of 1 K.'],
    ['Thinking the temperature rises during melting or boiling.', 'It stays constant; the energy goes into breaking bonds.'],
    ['Ignoring heat losses in a measurement of c.', 'Losses make the measured c too large.']
  ]
});

WL.gd('al-ideal-gas', {
  h: 'The air pressing on you right now is the drumming of countless molecules: about 3 × 10²⁷ of them hit each square metre every second. Pressure is the push of those impacts, and temperature is a measure of how fast the molecules move. Kinetic theory turns that picture into numbers, and explains the gas laws from Newton’s laws.',
  s: [
    ['The gas laws and absolute zero', [
      'For a fixed mass of gas: at constant temperature pV is constant (**Boyle’s law**); at constant pressure V ∝ T; at constant volume p ∝ T. Followed backwards, all three point to the same temperature where the pressure or volume would vanish: −273.15 °C, **absolute zero**, 0 K. In the gas laws T must always be in kelvin.'
    ], { n: 0, x: ['A tyre is at 300 kPa at 20 °C. On a hot day it warms to 40 °C with its volume unchanged. What is its pressure?', ['Convert to kelvin: 293 K and 313 K.', 'p ∝ T, so p = 300 × 313 ÷ 293.', '= 320 kPa.'], 'about 320 kPa'], c: ['Why must T be in kelvin in the gas laws?', 'They are proportionalities measured from absolute zero. Going from 10 °C to 20 °C does not double the pressure; going from 283 K to 566 K would.'] }],
    ['The ideal gas equation', [
      'The three laws combine into one equation. Per mole: pV = nRT, with n the number of moles and R = 8.31 J mol⁻¹ K⁻¹. Per molecule: pV = NkT, with N the number of molecules and the **Boltzmann constant** k = R/N_A = 1.38 × 10⁻²³ J/K (N_A = 6.02 × 10²³ per mole).'
    ], { n: 0, e: 'pV = nRT = NkT', x: ['How many molecules are there in 1.0 m³ of air at 100 kPa and 300 K?', ['N = pV/(kT) = 1.0 × 10⁵ × 1.0 ÷ (1.38 × 10⁻²³ × 300).', '= 1.0 × 10⁵ ÷ 4.14 × 10⁻²¹.', '= 2.4 × 10²⁵ molecules.'], '2.4 × 10²⁵'], c: ['How many moles are in 24 litres of gas at 20 °C and 101 kPa?', 'n = pV/(RT) = 101 000 × 0.024 ÷ (8.31 × 293) = 1.0 mol.'] }],
    ['Pressure from molecules hitting the walls', [
      'A molecule of mass m bouncing off a wall with velocity component c_x reverses that component, so it gives the wall a momentum 2mc_x; in a box of length L it returns every 2L/c_x seconds. Adding up the forces of all N molecules, and using the fact that on average c_x² is a third of c² (no direction is special), gives the pressure.'
    ], { n: 1, e: 'pV = \\tfrac13 Nm\\langle c^2\\rangle', c: ['Where does the ⅓ come from?', 'Molecules move at random in three dimensions, so on average only a third of their c² is in any one direction.'] }],
    ['What temperature means', [
      'Compare pV = ⅓Nm⟨c²⟩ with pV = NkT: the average kinetic energy of a molecule is (3/2)kT. It depends only on the temperature, so in different gases at the same temperature the molecules have the same average kinetic energy, and lighter molecules move faster.'
    ], { n: 2, e: '\\tfrac12 m\\langle c^2\\rangle = \\tfrac32 kT,\\qquad c_{\\text{rms}} = \\sqrt{\\frac{3kT}{m}}', x: ['Find the root-mean-square speed of nitrogen molecules (m = 4.65 × 10⁻²⁶ kg) at 300 K.', ['c_rms = √(3kT/m) = √(3 × 1.38 × 10⁻²³ × 300 ÷ 4.65 × 10⁻²⁶).', '= √(2.67 × 10⁵).', '= 517 m/s, faster than the speed of sound.'], 'about 520 m/s'], c: ['Hydrogen (H₂) and oxygen (O₂) are at the same temperature. Which molecules are faster, and by how much?', 'They have the same average kinetic energy, and oxygen molecules are 16 times heavier, so hydrogen molecules are √16 = 4 times faster.'] }],
    ['Internal energy of an ideal gas', [
      'In an ideal gas the molecules exert no forces on each other except in collisions, so there is no potential energy between them. For a monatomic gas the internal energy is just the total kinetic energy: U = (3/2)NkT = (3/2)nRT. It depends only on temperature.'
    ], { n: 3, e: 'U = \\tfrac32 nRT', x: ['What is the internal energy of 2.0 mol of helium at 300 K?', ['U = 1.5 × 2.0 × 8.31 × 300.', '= 7500 J.'], 'about 7.5 kJ'], c: ['If the kelvin temperature of an ideal gas doubles, what happens to its internal energy?', 'It doubles.'] }],
    ['The assumptions', [
      'Kinetic theory assumes: a very large number of molecules moving at random; molecules so small that their own volume is negligible; no forces between them except during collisions; perfectly elastic collisions that take negligible time.',
      'Real gases behave like this at low pressure and high temperature.'
    ], { n: 4, c: ['Why do real gases depart from pV = nRT at high pressure and low temperature?', 'The molecules are then close together and slow, so their own volume and the attractions between them matter.'] }]
  ],
  m: [
    ['Using °C in the gas equations.', 'Always convert to kelvin.'],
    ['Mixing up n with N, or R with k.', 'n and R go together (moles); N and k go together (molecules).'],
    ['Thinking every molecule moves at c_rms.', 'Speeds have a wide spread; c_rms is a kind of average.']
  ]
});

WL.gd('al-thermodynamics', {
  h: 'Pump up a bicycle tyre hard and the pump gets hot, though nothing heated it. Let gas rush out of an aerosol and the can turns cold. A system’s internal energy can change in only two ways, by heating or by work, and that simple bookkeeping, ΔU = q + W, is the first law of thermodynamics.',
  s: [
    ['Internal energy', [
      'The **internal energy** of a system is the total of the random kinetic energies and the potential energies (from the forces between them) of all its molecules. Warming it raises the kinetic part; changing state at constant temperature changes the potential part. In an ideal gas there are no forces between molecules, so its internal energy depends only on temperature.'
    ], { n: 0, c: ['Two mugs of water are at the same temperature, but one holds twice as much. Which has more internal energy?', 'The fuller one: the average energy per molecule is the same, and it has twice as many molecules.'] }],
    ['Work done by and on a gas', [
      'When a gas expands at constant pressure p by a volume ΔV, it pushes its surroundings back and does work pΔV on them; when it is compressed, pΔV is done on it. On a pressure–volume graph, the work is the area under the line.'
    ], { n: 1, e: 'W = p\\Delta V', x: ['A gas at a constant 200 kPa expands from 2.0 litres to 5.0 litres. How much work does it do?', ['ΔV = 3.0 litres = 3.0 × 10⁻³ m³.', 'W = pΔV = 2.0 × 10⁵ × 3.0 × 10⁻³ = 600 J.'], '600 J, done by the gas'], c: ['If the pressure changes during an expansion, how do you find the work done?', 'Find the area under the curve on the p–V graph.'] }],
    ['The first law', [
      'The increase in internal energy equals the energy supplied by heating, q, plus the work done on the system, W. Energy is conserved: it can only enter or leave in these two ways.',
      'Some books use W for the work done by the system and write ΔU = q − W, so always check which convention is being used.'
    ], { n: 2, e: '\\Delta U = q + W', x: ['A gas is heated with 500 J and expands, doing 200 J of work on its surroundings. Find ΔU.', ['Work done on the gas is −200 J.', 'ΔU = q + W = 500 + (−200) = 300 J.'], 'ΔU = +300 J'], c: ['A gas is compressed so fast that no heat flows, with 150 J of work done on it. What happens to its internal energy and its temperature?', 'ΔU = 0 + 150 = +150 J, so its temperature rises. That is why a tyre pump warms up.'] }],
    ['Special cases', [
      'At **constant volume**, no work is done, so ΔU = q. At **constant temperature** (for an ideal gas), ΔU = 0, so q = −W: heat in equals work out. With **no heat flow** (adiabatic, for example a very fast change), ΔU = W: compression warms a gas, expansion cools it. Round a complete **cycle**, ΔU = 0, and the net work is the area enclosed by the loop on the p–V graph.'
    ], { n: 3, c: ['Why does an aerosol can get cold when you spray it for a while?', 'The escaping gas expands quickly, doing work against the air with little time to be heated, so its internal energy, and temperature, fall.'] }],
    ['Internal energy of an ideal gas', [
      'For a monatomic ideal gas, U = (3/2)nRT, so ΔU = (3/2)nRΔT whatever the process. That links the first law to temperature changes.'
    ], { n: 4, e: 'U = \\tfrac32nRT', x: ['1.0 mol of helium is heated from 300 K to 400 K, first at constant volume, then (separately) at constant pressure. How much heat does each take?', ['ΔU = 1.5 × 1.0 × 8.31 × 100 = 1250 J either way.', 'Constant volume: no work, so q = 1250 J.', 'Constant pressure: the gas also does work pΔV = nRΔT = 831 J, so q = 1250 + 831 = 2080 J.'], '1250 J at constant volume; 2080 J at constant pressure'], c: ['Why does heating at constant pressure need more energy for the same temperature rise?', 'Part of the energy goes into the work the gas does pushing its surroundings back.'] }]
  ],
  m: [
    ['Mixing sign conventions.', 'Here W is work done on the gas; work done by the gas counts as negative.'],
    ['Thinking temperature can only rise by heating.', 'Doing work on a gas, by compressing it quickly, also raises its temperature.'],
    ['Treating heat as something a body contains.', 'q is a transfer of energy; internal energy is what the body has.']
  ]
});
WL.gd('al-damping', {
  h: 'In 1831 a column of soldiers marching in step over a bridge near Manchester set it vibrating, and it collapsed; soldiers have broken step on bridges ever since. Push a child on a swing at just the right moment each time and they go higher and higher. Both are resonance: a push at an oscillator’s own natural frequency builds up a large amplitude, unless damping takes the energy away.',
  s: [
    ['Damping', [
      'Friction and air resistance take energy from a real oscillator, so its amplitude dies away: it is **damped**. With **light damping** it keeps oscillating, each swing a little smaller. With **critical damping** it returns to equilibrium in the shortest time without overshooting. With **heavy damping** it creeps back slowly, without oscillating.'
    ], { n: 0, c: ['Why are car suspensions designed to be close to critically damped?', 'After a bump the car returns to level quickly without bouncing up and down.'] }],
    ['How the amplitude dies away', [
      'With light damping, the amplitude falls by the same fraction in each equal time: an exponential decay, A = A₀e^(−t/τ). Energy is proportional to amplitude squared, so the energy falls twice as fast.'
    ], { n: 4, e: 'A = A_0e^{-t/\\tau},\\qquad E \\propto A^2', x: ['A pendulum’s amplitude falls from 10 cm to 5.0 cm in 40 s. What will it be after another 40 s? How long does it take for the energy to halve?', ['The amplitude halves every 40 s, so after another 40 s it is 2.5 cm.', 'Energy ∝ A², so when the amplitude halves the energy falls to a quarter: that is two energy halvings in 40 s.', 'So the energy halves every 20 s.'], '2.5 cm; the energy halves every 20 s'], c: ['An oscillator’s amplitude has fallen to half. What fraction of its energy is left?', 'A quarter.'] }],
    ['Forced oscillations', [
      'Every oscillator has a **natural frequency** f₀ at which it oscillates freely; for a mass on a spring, f₀ = (1/2π)√(k/m). Push it with a regular **driving force** and, once it settles, it oscillates at the driving frequency, not at f₀. How large the oscillation becomes depends on how close the driving frequency is to f₀.'
    ], { n: 1, e: 'f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}', c: ['You push a swing whose natural frequency is 0.5 Hz with a regular push at 0.3 Hz. At what frequency does it end up swinging?', 'At 0.3 Hz, the driving frequency, with only a small amplitude.'] }],
    ['Resonance', [
      'When the driving frequency equals the natural frequency, each push arrives at just the right moment to add energy, and the amplitude is greatest: **resonance**. With light damping the peak is tall and sharp. More damping makes it lower and broader, and moves it to a slightly lower frequency.'
    ], { n: 2, x: ['Each wheel of a car carries 300 kg on a spring with k = 30 000 N/m. Bumps on a road are 10 m apart. At what speed will the car bounce most?', ['f₀ = (1/2π)√(30 000 ÷ 300) = (1/2π) × 10 = 1.59 Hz.', 'At speed v, the car meets v/10 bumps per second.', 'Resonance when v/10 = 1.59, so v = 15.9 m/s, about 57 km/h.'], 'about 16 m/s'], c: ['What happens to the resonance peak if the damping is increased?', 'It becomes lower and broader, and shifts slightly to a lower frequency.'] }],
    ['Useful and harmful resonance', [
      'Resonance is useful in musical instruments, radio tuning circuits (which respond only to the frequency they are tuned to) and MRI scanners. It is harmful when machinery, engines or bridges are driven near their natural frequency: London’s Millennium Bridge swayed alarmingly on its opening day in 2000 as walkers fell into step with it. Engineers fit dampers and change natural frequencies to avoid it.'
    ], { n: 3, c: ['Why do soldiers break step when they cross a bridge?', 'Marching in step is a regular driving force; if its frequency matched the bridge’s natural frequency, the amplitude could grow dangerously.'] }]
  ],
  m: [
    ['Thinking a driven oscillator swings at its own natural frequency.', 'Once settled, it oscillates at the driving frequency.'],
    ['Describing critical damping as “stops eventually”.', 'Critical damping returns it to equilibrium fastest without overshooting.'],
    ['Taking energy as proportional to amplitude.', 'Energy is proportional to amplitude squared.']
  ]
});

WL.gd('al-efields', {
  h: 'Rub a balloon on your jumper and it can lift your hair against the pull of the whole Earth. The electric force is enormously stronger than gravity: between two protons, about 10³⁶ times. This topic describes it with two ideas, field strength (force per coulomb) and potential (energy per coulomb), and the second makes most problems surprisingly easy.',
  s: [
    ['Coulomb’s law', [
      'Two point charges Q and q a distance r apart repel if they have the same sign and attract if opposite, with a force proportional to Qq/r². The constant is k = 1/(4πε₀) = 8.99 × 10⁹ N m² C⁻². From outside, a charged sphere acts like a point charge at its centre.'
    ], { n: 0, e: 'F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Qq}{r^2}', x: ['In a hydrogen atom the electron is about 5.3 × 10⁻¹¹ m from the proton. What is the force between them?', ['F = 8.99 × 10⁹ × (1.60 × 10⁻¹⁹)² ÷ (5.3 × 10⁻¹¹)².', '= 8.99 × 10⁹ × 2.56 × 10⁻³⁸ ÷ 2.81 × 10⁻²¹.', '= 8.2 × 10⁻⁸ N, an attraction.'], '8.2 × 10⁻⁸ N'], c: ['The distance between two charges is tripled. What happens to the force?', 'It becomes one ninth as big.'] }],
    ['Electric field strength', [
      'The **field strength** E at a point is the force on each coulomb of positive charge placed there, in N/C (the same as V/m). Around a point charge, E = kQ/r². **Field lines** show its direction: away from positive charges, towards negative ones, closer together where the field is stronger, and never crossing.'
    ], { n: 1, e: 'E = \\frac{F}{q} = \\frac{Q}{4\\pi\\varepsilon_0 r^2}', x: ['What is the field 0.10 m from a +2.0 μC charge, and the force on an electron there?', ['E = 8.99 × 10⁹ × 2.0 × 10⁻⁶ ÷ 0.10² = 1.8 × 10⁶ N/C, pointing away from the charge.', 'F = eE = 1.60 × 10⁻¹⁹ × 1.8 × 10⁶ = 2.9 × 10⁻¹³ N, towards the charge (the electron is negative).'], '1.8 × 10⁶ N/C; 2.9 × 10⁻¹³ N'], c: ['Why can field lines never cross?', 'At each point the field has only one direction; crossing lines would give it two.'] }],
    ['Uniform fields between plates', [
      'Between two parallel plates with p.d. V and separation d, the field is uniform: E = V/d. A charged particle there feels a constant force, so, like a ball thrown sideways under gravity, it follows a parabola.'
    ], { n: 2, e: 'E = \\frac{V}{d}', x: ['Two plates 2.0 cm apart have 500 V across them. Find the field and the acceleration of an electron between them. (m_e = 9.11 × 10⁻³¹ kg)', ['E = 500 ÷ 0.020 = 25 000 V/m.', 'F = eE = 1.60 × 10⁻¹⁹ × 25 000 = 4.0 × 10⁻¹⁵ N.', 'a = F/m = 4.0 × 10⁻¹⁵ ÷ 9.11 × 10⁻³¹ = 4.4 × 10¹⁵ m/s².'], '25 kV/m; 4.4 × 10¹⁵ m/s²'], c: ['The plates are moved twice as far apart with the same p.d. What happens to the field?', 'It halves.'] }],
    ['Potential and energy', [
      'The **potential** V at a point is the work done per coulomb to bring a positive charge there from very far away. Around a point charge, V = kQ/r. A charge q moving through a p.d. ΔV gains or loses energy qΔV; an electron accelerated from rest through V gains kinetic energy eV.',
      'Field lines run downhill in potential, and they always cross the lines of equal potential (**equipotentials**) at right angles.'
    ], { n: 3, e: 'V = \\frac{Q}{4\\pi\\varepsilon_0 r},\\qquad \\tfrac12 mv^2 = qV', x: ['An electron starts from rest and is accelerated through 2000 V. How fast does it go?', ['Energy gained: eV = 1.60 × 10⁻¹⁹ × 2000 = 3.2 × 10⁻¹⁶ J.', '½mv² = 3.2 × 10⁻¹⁶, so v = √(2 × 3.2 × 10⁻¹⁶ ÷ 9.11 × 10⁻³¹).', 'v = √(7.0 × 10¹⁴) = 2.7 × 10⁷ m/s, almost a tenth of the speed of light.'], '2.7 × 10⁷ m/s'], c: ['How much work does it take to move a charge along an equipotential?', 'None: the potential does not change, so neither does its energy.'] }],
    ['Several charges', [
      'Potentials add as ordinary numbers (with signs). Fields add as vectors, which is harder. So it is often easiest to add up the potential first.'
    ], { n: 4, x: ['Charges of +4.0 nC and −4.0 nC are 0.20 m apart. Find the potential and the field at the point halfway between them.', ['Potential: k(4.0 × 10⁻⁹) ÷ 0.10 + k(−4.0 × 10⁻⁹) ÷ 0.10 = 0.', 'Field from each: 8.99 × 10⁹ × 4.0 × 10⁻⁹ ÷ 0.10² = 3600 N/C, and both point from + towards −.', 'Total field: 7200 N/C, towards the negative charge.'], 'V = 0, but E = 7200 N/C'], c: ['If the potential at a point is zero, must the field there be zero?', 'No: as above, the field depends on how fast the potential changes, not on its value.'] }],
    ['Electric and gravitational fields compared', [
      'Both are inverse-square fields with potentials that go as 1/r. But gravity only attracts and acts on mass, while electric forces attract or repel and act on charge. Between two protons the electric push is about 10³⁶ times the gravitational pull.'
    ], { n: 5, c: ['If gravity is so weak, why does it control the motion of planets?', 'Planets are almost exactly neutral, so electric forces cancel out; mass is always positive, so gravity adds up.'] }]
  ],
  m: [
    ['Forgetting to square the distance in F or E.', 'Both fall as 1/r²; only V goes as 1/r.'],
    ['Adding fields as plain numbers.', 'Fields are vectors; potentials are the ones you add as numbers.'],
    ['Using E = V/d near a point charge.', 'E = V/d is only for a uniform field.']
  ]
});

WL.gd('al-capacitors', {
  h: 'A camera flash spends a few seconds storing up energy, then releases it in a thousandth of a second; a defibrillator does the same with a few hundred joules to restart a heart. A capacitor stores charge, and when it discharges through a resistor something simple happens: the less charge is left, the slower it leaves. That gives an exponential decay, with one number, RC, setting its pace.',
  s: [
    ['Capacitance', [
      'A capacitor is two conductors separated by an insulator. Connect it to a supply and charge +Q builds on one plate and −Q on the other until the p.d. across it matches the supply. The charge is proportional to the p.d.: Q = CV, where C is the **capacitance** in farads (F). For parallel plates, C = ε₀ε_rA/d.'
    ], { n: 0, e: 'C = \\frac{Q}{V},\\qquad C = \\frac{\\varepsilon_0\\varepsilon_r A}{d}', x: ['A 470 μF capacitor is charged to 9.0 V. How much charge does it store?', ['C = 470 × 10⁻⁶ F.', 'Q = CV = 470 × 10⁻⁶ × 9.0 = 4.2 × 10⁻³ C.'], '4.2 mC'], c: ['If the plates of a parallel-plate capacitor are moved twice as far apart, what happens to its capacitance?', 'It halves: C ∝ 1/d.'] }],
    ['Energy stored', [
      'Charging takes work, because each extra bit of charge is pushed on against the voltage already there. On a graph of V against Q, the energy is the area under the straight line, a triangle: ½QV, not QV.'
    ], { n: 1, e: 'W = \\tfrac12 QV = \\tfrac12 CV^2', x: ['A camera flash has a 220 μF capacitor charged to 300 V. How much energy does it store, and what is the power if it is released in 1.0 ms?', ['W = ½ × 220 × 10⁻⁶ × 300² = 9.9 J.', 'P = 9.9 ÷ 0.0010 = 9900 W.'], '9.9 J; about 10 kW'], c: ['Why is the energy ½QV rather than QV?', 'The p.d. builds up from zero while the charge is added, so on average each coulomb is pushed through only half the final p.d.'] }],
    ['Discharge: exponential decay', [
      'Discharging through a resistor R, the current is I = V/R = Q/(RC), and that current is the rate at which charge leaves. So the rate of loss is proportional to the charge left: an exponential decay. The same shape describes Q, V and I.',
      'After one **time constant** τ = RC the charge has fallen to 1/e, about 37%, of its start; after 5RC it is below 1%. The time to halve is RC ln 2 ≈ 0.69RC.'
    ], { n: 2, e: 'Q = Q_0e^{-t/RC},\\qquad t_{1/2} = RC\\ln 2', x: ['The 470 μF capacitor at 9.0 V discharges through 10 kΩ. Find the time constant, the half-life, and the p.d. after 10 s.', ['τ = RC = 10 000 × 470 × 10⁻⁶ = 4.7 s.', 't½ = 0.693 × 4.7 = 3.3 s.', 'V = 9.0 × e^(−10/4.7) = 9.0 × e^(−2.13) = 9.0 × 0.119 = 1.1 V.'], '4.7 s; 3.3 s; 1.1 V'], c: ['After about how many time constants is a capacitor practically empty?', 'About 5: e⁻⁵ is less than 1%.'] }],
    ['Charging', [
      'Charging from a supply V₀ through R, the current starts at V₀/R and falls exponentially, while the capacitor’s p.d. rises towards V₀ along 1 − e^(−t/RC).'
    ], { n: 3, e: 'V_C = V_0\\left(1 - e^{-t/RC}\\right),\\qquad I = \\frac{V_0}{R}e^{-t/RC}', x: ['The same 470 μF capacitor is charged from 9.0 V through 10 kΩ. What is the current at the start, and the p.d. after 4.7 s?', ['At the start the capacitor has no p.d., so I = 9.0 ÷ 10 000 = 0.90 mA.', 'After one time constant: V = 9.0 × (1 − e⁻¹) = 9.0 × 0.63 = 5.7 V.'], '0.90 mA; 5.7 V'], c: ['When is the charging current largest?', 'At the very start, when the capacitor has no p.d. to oppose the supply.'] }],
    ['Combining capacitors', [
      'In **parallel**, capacitances add (it is like more plate area). In **series**, the reciprocals add: each capacitor carries the same charge and their p.d.s add. This is the opposite pattern to resistors.'
    ], { n: 4, e: 'C_{\\parallel} = C_1 + C_2,\\qquad \\frac{1}{C_{\\text{series}}} = \\frac{1}{C_1} + \\frac{1}{C_2}', c: ['What is the total capacitance of two 100 μF capacitors in series? In parallel?', 'Series: 50 μF. Parallel: 200 μF.'] }],
    ['Uses', [
      'Capacitors power camera flashes and defibrillators, smooth the output of power supplies, set the timing in circuits, keep memory alive during brief power cuts, and sense your finger on a touchscreen (which changes a tiny capacitance).'
    ], { n: 5, c: ['Why does a camera flash use a capacitor instead of drawing power straight from its battery?', 'A battery cannot deliver energy that quickly; the capacitor is charged slowly and then releases its energy in a thousandth of a second.'] }]
  ],
  m: [
    ['Using W = QV for the stored energy.', 'It is ½QV: the p.d. builds up from zero.'],
    ['Leaving μF in microfarads.', '1 μF = 10⁻⁶ F.'],
    ['Thinking a capacitor is empty after one time constant.', 'About 37% is left; it takes about 5RC to empty.']
  ]
});

WL.gd('al-bfields', {
  h: 'Every electric motor, every loudspeaker and the compass inside your phone rely on one fact: a magnetic field pushes sideways on moving charges. On a current in a wire the push is F = BIL; on a single charge it is F = BQv. Because the push is always sideways to the motion, a charged particle in a magnetic field goes round in a circle.',
  s: [
    ['The force on a current', [
      'A wire of length L carrying a current I at an angle θ to a uniform magnetic field B feels a force F = BIL sin θ, at right angles to both the wire and the field. **Fleming’s left-hand rule** gives the direction: First finger for Field, seCond finger for Current, thuMb for Motion.',
      'This defines the **tesla**: in a 1 T field, a 1 m wire carrying 1 A at right angles feels 1 N.'
    ], { n: 0, e: 'F = BIL\\sin\\theta', x: ['A 0.25 m wire carries 3.0 A in a 0.40 T field. Find the force when it is at right angles to the field, and at 30° to it.', ['At 90°: F = 0.40 × 3.0 × 0.25 = 0.30 N.', 'At 30°: F = 0.30 × sin 30° = 0.15 N.'], '0.30 N; 0.15 N'], c: ['What is the force on a wire that runs parallel to the field?', 'Zero: sin 0° = 0.'] }],
    ['The force on a moving charge', [
      'A charge Q moving at speed v at angle θ to the field feels F = BQv sin θ. The force is always at right angles to the velocity, so it changes the direction of motion but never the speed: a magnetic field does no work on a free charge.'
    ], { n: 1, e: 'F = BQv\\sin\\theta', x: ['A proton moves at 2.0 × 10⁶ m/s at right angles to a 0.50 T field. What force acts on it?', ['F = BQv = 0.50 × 1.60 × 10⁻¹⁹ × 2.0 × 10⁶.', '= 1.6 × 10⁻¹³ N.'], '1.6 × 10⁻¹³ N'], c: ['Why can a magnetic field not change a charged particle’s speed?', 'Its force is always perpendicular to the motion, so it does no work.'] }],
    ['Circles, and selecting a speed', [
      'With the velocity at right angles to the field, the magnetic force is the centripetal force: BQv = mv²/r, so r = mv/(BQ). Heavier or faster particles make wider circles, but the time for one lap, 2πm/(BQ), does not depend on the speed.',
      'Add an electric field across the magnetic one, and only particles whose electric and magnetic forces cancel go straight through: EQ = BQv, so v = E/B. This is a **velocity selector**.'
    ], { n: 2, e: 'r = \\frac{mv}{BQ},\\qquad v = \\frac{E}{B}', x: ['What is the radius of the circle the proton above moves in? (m = 1.67 × 10⁻²⁷ kg)', ['r = mv/(BQ) = 1.67 × 10⁻²⁷ × 2.0 × 10⁶ ÷ (0.50 × 1.60 × 10⁻¹⁹).', '= 3.34 × 10⁻²¹ ÷ 8.0 × 10⁻²⁰.', '= 0.042 m.'], '4.2 cm'], c: ['If the proton’s speed doubles, what happens to the radius of its circle and the time for one lap?', 'The radius doubles; the time for one lap stays the same.'] }],
    ['The Hall effect', [
      'Pass a current through a thin slice of material in a magnetic field at right angles to it. The moving charges are pushed to one side until the electric field from the charge that builds up balances the magnetic push. That leaves a small **Hall voltage** across the slice, proportional to B. It depends on 1/(nq), so it is large in semiconductors, which have few carriers, and tiny in metals.'
    ], { n: 3, e: 'V_H = \\frac{BI}{ntq}', x: ['A semiconductor slice 0.20 mm thick has n = 1.0 × 10²² carriers per m³ and carries 10 mA in a 0.10 T field. Find the Hall voltage. What would a copper slice (n = 8.5 × 10²⁸ m⁻³) give?', ['Semiconductor: V_H = 0.10 × 0.010 ÷ (1.0 × 10²² × 2.0 × 10⁻⁴ × 1.60 × 10⁻¹⁹) = 1.0 × 10⁻³ ÷ 0.32 = 3.1 × 10⁻³ V.', 'Copper: V_H = 1.0 × 10⁻³ ÷ (8.5 × 10²⁸ × 2.0 × 10⁻⁴ × 1.60 × 10⁻¹⁹) = 3.7 × 10⁻¹⁰ V.'], '3.1 mV, against 0.37 nV for copper'], c: ['Why are Hall probes made from semiconductors?', 'They have far fewer charge carriers, so the Hall voltage is millions of times bigger and easy to measure.'] }],
    ['Fields made by currents', [
      'A long straight wire has circular field lines round it (the right-hand grip rule gives their direction). A long **solenoid** has a strong, uniform field inside, and an iron core makes it much stronger. Two parallel wires with currents in the same direction attract; in opposite directions they repel.'
    ], { n: 4, c: ['Two parallel wires carry currents in opposite directions. Do they attract or repel?', 'They repel.'] }]
  ],
  m: [
    ['Using the wrong hand for the force on a current.', 'Use Fleming’s left-hand rule; for electrons, the current is opposite to their motion.'],
    ['Forgetting sin θ.', 'Only the part of the motion across the field counts.'],
    ['Saying a magnetic field speeds up charged particles.', 'It only changes their direction.']
  ]
});

WL.gd('al-induction', {
  h: 'Push a magnet into a coil and a current flows; hold it still inside and the current stops. Faraday discovered in 1831 that a changing magnetic field drives an e.m.f., and almost all the electricity you use is made that way, in spinning generators, then carried through transformers to your home.',
  s: [
    ['Magnetic flux', [
      '**Magnetic flux** Φ measures how much field passes through an area: the field strength times the area at right angles to it, Φ = BA cos θ, in webers (Wb). For a coil of N turns, the **flux linkage** is NΦ.'
    ], { n: 0, e: '\\Phi = BA\\cos\\theta,\\qquad \\text{flux linkage} = N\\Phi', x: ['A 200-turn coil measuring 4.0 cm by 5.0 cm sits with its face at right angles to a 0.30 T field. Find the flux and the flux linkage.', ['A = 0.040 × 0.050 = 2.0 × 10⁻³ m².', 'Φ = BA = 0.30 × 2.0 × 10⁻³ = 6.0 × 10⁻⁴ Wb.', 'NΦ = 200 × 6.0 × 10⁻⁴ = 0.12 Wb.'], '6.0 × 10⁻⁴ Wb; 0.12 Wb'], c: ['When is the flux through a coil zero, even in a strong field?', 'When the field runs parallel to the coil’s face, so no field lines pass through it.'] }],
    ['Faraday’s law', [
      'The induced e.m.f. equals the rate of change of flux linkage. It does not matter how the flux changes: moving a magnet, moving the coil, switching a nearby current, or turning the coil all work. No change, no e.m.f., however strong the field.'
    ], { n: 1, e: '\\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t}', x: ['The coil above is pulled right out of the field in 0.040 s. What average e.m.f. is induced?', ['The flux linkage falls from 0.12 Wb to 0.', 'ε = 0.12 ÷ 0.040 = 3.0 V.'], '3.0 V'], c: ['A coil sits in a very strong but steady field. Is an e.m.f. induced?', 'No: nothing is changing.'] }],
    ['Lenz’s law', [
      'The induced current always flows so as to **oppose the change** that causes it. Push a north pole into a coil and the near end of the coil becomes a north pole, pushing back. If it did the opposite, it would pull the magnet in faster and make even more current: energy from nothing. So Lenz’s law is conservation of energy, and it is the minus sign in Faraday’s law.'
    ], { n: 2, c: ['A magnet’s north pole is pulled out of a coil. What pole appears at the near end of the coil?', 'A south pole, which attracts the magnet and so opposes its leaving.'] }],
    ['Moving conductors', [
      'A rod of length L moving at speed v across a field B sweeps out area at a rate Lv, so the e.m.f. is BLv. If a current flows, the field pushes back on it with a force BIL, and you must do work to keep the rod moving: that work becomes the electrical energy.'
    ], { n: 3, e: '\\varepsilon = BLv', x: ['A plane with a 40 m wingspan flies at 250 m/s where the vertical part of the Earth’s field is 4.0 × 10⁻⁵ T. What e.m.f. is induced between its wingtips?', ['ε = BLv = 4.0 × 10⁻⁵ × 40 × 250.', '= 0.40 V.'], '0.40 V'], c: ['Why is it harder to move the rod when a current flows?', 'The current in the field feels a force BIL that opposes the motion (Lenz’s law), so you must do work.'] }],
    ['Generators', [
      'A coil of N turns and area A spinning at angular speed ω in a field B has flux linkage NBA cos ωt, so its e.m.f. is NBAω sin ωt: an alternating e.m.f. with peak NBAω. It is largest when the coil’s face is parallel to the field, where the flux is zero but changing fastest.'
    ], { n: 4, e: '\\varepsilon = NBA\\omega\\sin\\omega t', x: ['A 100-turn coil of area 0.010 m² spins at 50 revolutions per second in a 0.20 T field. What is the peak e.m.f.?', ['ω = 2π × 50 = 314 rad/s.', 'ε₀ = NBAω = 100 × 0.20 × 0.010 × 314 = 63 V.'], 'about 63 V'], c: ['At which position is a generator’s e.m.f. largest?', 'When the coil’s face is parallel to the field: the flux through it is zero, but changing fastest.'] }],
    ['Transformers and the National Grid', [
      'An alternating current in a transformer’s primary coil makes a changing flux in an iron core, which links the secondary coil. The voltages are in the ratio of the turns. An ideal transformer wastes no power, so stepping the voltage up steps the current down.',
      'Cables waste power as I²R, so electricity is sent at very high voltages and small currents, then stepped down for homes.'
    ], { n: 5, e: '\\frac{V_s}{V_p} = \\frac{N_s}{N_p},\\qquad V_pI_p = V_sI_s', x: ['A power station sends 10 MW through cables of total resistance 5.0 Ω. Compare the power wasted at 25 kV and at 400 kV.', ['At 25 kV: I = 10 × 10⁶ ÷ 25 000 = 400 A, so the loss is 400² × 5.0 = 800 kW (8%).', 'At 400 kV: I = 25 A, so the loss is 25² × 5.0 = 3.1 kW (0.03%).'], '800 kW against 3.1 kW'], c: ['Why does a transformer not work with a steady d.c. supply?', 'A steady current makes a steady flux, and an unchanging flux induces no e.m.f. in the secondary.'] }]
  ],
  m: [
    ['Thinking a strong field alone induces an e.m.f.', 'Only a changing flux linkage does.'],
    ['Getting Lenz’s law backwards.', 'The induced current opposes the change.'],
    ['Forgetting the number of turns.', 'Use the flux linkage NΦ.']
  ]
});

WL.gd('al-ac', {
  h: 'The socket on your wall is labelled 230 V, but its voltage actually swings up to about +325 V and down to −325 V, fifty times every second. The 230 V is a special kind of average, the root-mean-square, chosen so that heating works out just as it would with a steady voltage. And with a few diodes and a capacitor you can turn that swinging supply into the steady d.c. that your phone needs.',
  s: [
    ['Describing alternating current', [
      'A sinusoidal current I = I₀ sin(2πft) swings between +I₀ and −I₀, where I₀ is the **peak** value. UK mains has a frequency of 50 Hz, so one cycle takes 20 ms.'
    ], { n: 0, e: 'I = I_0\\sin\\omega t,\\qquad \\omega = 2\\pi f', c: ['What is the period of UK mains electricity?', 'T = 1/f = 1/50 = 0.020 s, 20 ms.'] }],
    ['Root-mean-square values', [
      'The power in a resistor is I²R. Averaged over a cycle, sin² has a mean of ½, so the mean power is ½I₀²R. The **r.m.s. current** is the steady current that would give the same mean power: I_rms = I₀/√2. In the same way, V_rms = V₀/√2.',
      'Mains “230 V” is an r.m.s. value, and the mean power is I_rms × V_rms.'
    ], { n: 1, e: 'I_{\\text{rms}} = \\frac{I_0}{\\sqrt2},\\qquad V_{\\text{rms}} = \\frac{V_0}{\\sqrt2}', x: ['A 2.3 kW kettle runs on 230 V r.m.s. mains. Find the peak voltage, the r.m.s. and peak currents, and the kettle’s resistance.', ['V₀ = 230 × √2 = 325 V.', 'I_rms = P/V_rms = 2300 ÷ 230 = 10 A, so I₀ = 10 × √2 = 14 A.', 'R = V_rms/I_rms = 230 ÷ 10 = 23 Ω.'], '325 V; 10 A r.m.s. (14 A peak); 23 Ω'], c: ['A 12 V peak a.c. supply and a 12 V battery are each connected to the same lamp. Which makes it brighter?', 'The battery: the a.c. supply’s r.m.s. voltage is only 12 ÷ √2 = 8.5 V.'] }],
    ['Why not just the mean?', [
      'Over a whole cycle the mean current of a sine wave is zero, which tells you nothing about heating. Squaring first makes every part positive; taking the mean then the square root gets back to the right units: root-mean-square.',
      'For a resistor, the peak power is twice the mean power.'
    ], { n: 2, c: ['The kettle above has a mean power of 2.3 kW. What is its peak power?', '4.6 kW, at the instants when the current is at its peak.'] }],
    ['Rectification', [
      'A single diode lets through only one half of each cycle: **half-wave rectification**, which wastes half the wave. A **bridge** of four diodes sends both halves through the load the same way: **full-wave rectification**, giving one-way pulses at twice the mains frequency.'
    ], { n: 3, c: ['After full-wave rectification of 50 Hz mains, how often do the pulses come?', '100 times a second: one for each half-cycle.'] }],
    ['Smoothing', [
      'A capacitor across the load charges up to the peak on each pulse, then discharges through the load between pulses, filling in the gaps. The ripple is smaller when the time constant RC is much longer than the time between pulses.'
    ], { n: 4, x: ['Full-wave pulses arrive every 10 ms and the load is 1.0 kΩ. With a 100 μF smoothing capacitor, by what fraction does the voltage fall between pulses?', ['RC = 1000 × 100 × 10⁻⁶ = 0.10 s, ten times the gap.', 'Fraction left after 10 ms: e^(−0.010/0.10) = e^(−0.1) = 0.905.', 'So it falls by about 9.5% before the next pulse tops it up.'], 'about 10%'], c: ['How could you make the output smoother?', 'Use a larger capacitor (or a load of larger resistance), so RC is longer compared with the gap between pulses.'] }]
  ],
  m: [
    ['Using peak values in P = VI for the mean power.', 'Use r.m.s. values; peak values give twice the mean.'],
    ['Thinking 230 V is the peak of the mains.', 'It is the r.m.s. value; the peak is 325 V.'],
    ['Using the ordinary mean of a sine wave.', 'It is zero; use the r.m.s.']
  ]
});
WL.gd('al-photons', {
  h: 'Take a photograph in very dim light and the image builds up as separate specks: light arrives in packets. Fire electrons at a thin sheet of graphite and they spread into rings, exactly as waves would. Light behaves like particles and matter behaves like waves. This topic gives you the two equations that connect the two pictures.',
  s: [
    ['Photons', [
      'Light, and all electromagnetic radiation, is given out and absorbed in packets called **photons**. A photon of frequency f carries energy E = hf = hc/λ, where h = 6.63 × 10⁻³⁴ J s is the **Planck constant**.',
      'Blue photons carry more energy than red ones. A brighter beam of the same colour carries more photons per second, not bigger ones.'
    ], { n: 0, e: 'E = hf = \\frac{hc}{\\lambda}', x: ['Find the energy of one photon of green light, wavelength 530 nm.', ['E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 530 × 10⁻⁹.', '= 1.99 × 10⁻²⁵ ÷ 5.30 × 10⁻⁷.', '= 3.75 × 10⁻¹⁹ J.'], '3.75 × 10⁻¹⁹ J'], c: ['A red beam and a blue beam have the same power. Which delivers more photons each second?', 'The red one: each red photon carries less energy, so more of them are needed for the same power.'] }],
    ['The electronvolt', [
      'Joules are awkwardly large for single photons. One **electronvolt** is the energy an electron gains when it is accelerated through 1 V: 1 eV = 1.60 × 10⁻¹⁹ J. Visible photons carry about 1.8–3.1 eV.',
      'A handy shortcut: E in eV ≈ 1240 ÷ (λ in nm).'
    ], { n: 1, e: 'E\\,(\\text{eV}) \\approx \\frac{1240}{\\lambda\\,(\\text{nm})}', x: ['Express the green photon’s energy in electronvolts, and check it with the shortcut.', ['3.75 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = 2.34 eV.', 'Shortcut: 1240 ÷ 530 = 2.34 eV.'], '2.34 eV'], c: ['What is the energy of a 400 nm violet photon, in eV?', '1240 ÷ 400 = 3.1 eV.'] }],
    ['Photons carry momentum', [
      'Photons have no mass, but they do carry momentum: p = E/c = h/λ. So light pushes on what absorbs it. The push is tiny, but in space it can steer a solar sail, and it helps blow comet tails away from the Sun.'
    ], { n: 2, e: 'p = \\frac{E}{c} = \\frac{h}{\\lambda}', x: ['Find the momentum of one 530 nm photon, and the pressure of sunlight (1.4 kW/m²) on a surface that absorbs it all.', ['p = h/λ = 6.63 × 10⁻³⁴ ÷ 530 × 10⁻⁹ = 1.25 × 10⁻²⁷ kg m/s.', 'Each second, the momentum arriving on each square metre is the intensity divided by c.', 'Pressure = 1400 ÷ 3.00 × 10⁸ = 4.7 × 10⁻⁶ Pa.'], '1.25 × 10⁻²⁷ kg m/s; 4.7 μPa'], c: ['Why must a solar sail be enormous?', 'The pressure of sunlight is only a few millionths of a pascal, so a huge area is needed for a useful force.'] }],
    ['Electrons diffract', [
      'In an electron diffraction tube, electrons accelerated through a few thousand volts pass through a thin layer of graphite and form rings on a screen: a diffraction pattern, exactly what waves passing through a crystal produce. Raise the voltage and the rings shrink.'
    ], { n: 3, c: ['Why do the rings shrink when the accelerating voltage is raised?', 'Faster electrons have more momentum, so a shorter wavelength, and shorter waves diffract through smaller angles.'] }],
    ['The de Broglie wavelength', [
      'De Broglie proposed that every particle has a wavelength λ = h/p. For an electron accelerated from rest through a p.d. V, its kinetic energy is eV = p²/2m, so p = √(2meV) and λ = h/√(2meV).',
      'At a few kilovolts that is a few hundredths of a nanometre, smaller than the spacing of atoms in a crystal, which is why crystals diffract electrons.'
    ], { n: 4, e: '\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2meV}}', x: ['Find the wavelength of an electron accelerated through 3.0 kV. (m = 9.11 × 10⁻³¹ kg)', ['p = √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 3000) = √(8.75 × 10⁻⁴⁶) = 2.96 × 10⁻²³ kg m/s.', 'λ = h/p = 6.63 × 10⁻³⁴ ÷ 2.96 × 10⁻²³ = 2.2 × 10⁻¹¹ m.'], '0.022 nm'], c: ['What is the de Broglie wavelength of a 0.16 kg cricket ball at 30 m/s?', 'λ = 6.63 × 10⁻³⁴ ÷ (0.16 × 30) = 1.4 × 10⁻³⁴ m: far too small ever to notice.'] }]
  ],
  m: [
    ['Saying a brighter beam has more energetic photons.', 'It has more photons; each one’s energy depends only on the frequency.'],
    ['Forgetting to convert units.', 'nm to m, and eV to J (× 1.60 × 10⁻¹⁹).'],
    ['Using V as the energy in joules.', 'An electron through V volts gains eV joules.']
  ]
});

WL.gd('al-photoelectric', {
  h: 'Shine the brightest red light you like on a zinc plate and not a single electron comes out; shine a weak ultraviolet lamp on it and electrons fly off at once. Waves could not explain that. Einstein could, in 1905, by treating light as a stream of packets, and it won him the Nobel Prize.',
  s: [
    ['What the experiments show', [
      'Light on a clean metal surface can free electrons, the **photoelectric effect**. But: below a **threshold frequency** no electrons come out, however bright the light. Above it, electrons come out at once, even in very dim light. Their maximum kinetic energy depends on the frequency, not on the brightness; a brighter light only frees more of them.'
    ], { n: 0, c: ['Light above the threshold frequency is made twice as bright. What changes?', 'Twice as many electrons come out each second; their maximum kinetic energy stays the same.'] }],
    ['Why waves fail', [
      'If light were a wave, its energy would arrive continuously, spread over the whole surface. Brighter light should give faster electrons; any frequency should work if you wait long enough; and very dim light should take a while before an electron gathers enough energy. All three predictions are wrong.'
    ], { n: 1, c: ['What does the wave picture predict for very dim light, and what actually happens?', 'It predicts a delay while electrons soak up enough energy; in fact electrons come out immediately.'] }],
    ['Einstein’s explanation', [
      'Light delivers its energy in **photons** of energy hf, and one photon gives all its energy to one electron. To escape, an electron needs at least the metal’s **work function** φ. The fastest electrons leave with what is left: hf − φ.',
      'Below the threshold frequency f₀ = φ/h no single photon has enough energy, and more photons do not help, because each acts alone.'
    ], { n: 2, e: 'hf = \\phi + KE_{\\max},\\qquad f_0 = \\frac{\\phi}{h}', x: ['Ultraviolet light of wavelength 250 nm falls on zinc (φ = 4.3 eV). Find the maximum kinetic energy of the electrons, and the threshold wavelength.', ['Photon energy = 1240 ÷ 250 = 4.96 eV.', 'KE_max = 4.96 − 4.3 = 0.66 eV = 0.66 × 1.60 × 10⁻¹⁹ = 1.1 × 10⁻¹⁹ J.', 'Threshold: photon energy = 4.3 eV, so λ₀ = 1240 ÷ 4.3 = 288 nm. Longer wavelengths free nothing.'], '0.66 eV; 288 nm'], c: ['Will red light of 650 nm free electrons from caesium (φ = 2.1 eV)?', 'No: each photon has 1240 ÷ 650 = 1.9 eV, less than 2.1 eV.'] }],
    ['Stopping potential: measuring h', [
      'Make the collecting electrode negative, and raise the voltage until even the fastest electrons are turned back: then eV_s = KE_max. Plot the **stopping potential** V_s against frequency: a straight line of gradient h/e, crossing the frequency axis at the threshold f₀.'
    ], { n: 3, e: 'eV_s = hf - \\phi\\;\\Longrightarrow\\; V_s = \\frac{h}{e}f - \\frac{\\phi}{e}', x: ['A metal gives V_s = 0.80 V at 7.0 × 10¹⁴ Hz and 1.62 V at 9.0 × 10¹⁴ Hz. Find h and the work function.', ['Gradient = (1.62 − 0.80) ÷ (2.0 × 10¹⁴) = 4.1 × 10⁻¹⁵ V s.', 'h = gradient × e = 4.1 × 10⁻¹⁵ × 1.60 × 10⁻¹⁹ = 6.6 × 10⁻³⁴ J s.', 'At 7.0 × 10¹⁴ Hz, hf/e = 4.1 × 10⁻¹⁵ × 7.0 × 10¹⁴ = 2.87 V, so φ/e = 2.87 − 0.80 = 2.07 V: φ = 2.1 eV.'], 'h ≈ 6.6 × 10⁻³⁴ J s; φ ≈ 2.1 eV'], c: ['Where does the V_s–f graph cross the frequency axis, and what does that point mean?', 'At the threshold frequency f₀, where the electrons have no energy left over.'] }],
    ['Work functions in electronvolts', [
      'Work functions are a few electronvolts: caesium 2.1 eV, zinc 4.3 eV, platinum 5.6 eV. Visible photons carry 1.8–3.1 eV, so visible light frees electrons from caesium but needs to be ultraviolet for zinc.'
    ], { n: 4, c: ['Why does visible light free electrons from caesium but not from zinc?', 'Visible photons carry at most about 3.1 eV, more than caesium’s 2.1 eV but less than zinc’s 4.3 eV.'] }]
  ],
  m: [
    ['Saying brighter light gives faster electrons.', 'Brighter light gives more electrons; the frequency sets their energy.'],
    ['Forgetting that hf − φ is the maximum.', 'Most electrons lose extra energy getting out; hf − φ is only for the fastest.'],
    ['Mixing eV and J in one equation.', 'Work in one unit throughout.']
  ]
});

WL.gd('al-spectra', {
  h: 'Sprinkle salt into a flame and it burns yellow; neon signs glow red; and in 1868 astronomers found a new element in sunlight, helium, decades before anyone found it on Earth. Every element gives out and absorbs only its own set of colours, because the electrons in its atoms can only have certain energies.',
  s: [
    ['Energy levels', [
      'An electron bound in an atom can only have certain **energy levels**. The zero of energy is a free electron at rest far from the atom, so the bound levels are negative. The lowest is the **ground state**; higher ones are **excited states**. For hydrogen, E_n = −13.6 eV/n².'
    ], { n: 0, e: 'E_n = -\\frac{13.6\\ \\text{eV}}{n^2}\\quad(\\text{hydrogen})', x: ['Find hydrogen’s first four energy levels.', ['n = 1: −13.6 eV. n = 2: −13.6 ÷ 4 = −3.40 eV.', 'n = 3: −13.6 ÷ 9 = −1.51 eV. n = 4: −13.6 ÷ 16 = −0.85 eV.', 'They crowd together towards zero as n grows.'], '−13.6, −3.40, −1.51, −0.85 eV'], c: ['Why are the energy levels negative?', 'Zero is a free electron; a bound electron has less energy than that, so you must add energy to free it.'] }],
    ['Emission and absorption', [
      'When an electron drops from a higher level to a lower one, the atom emits one photon whose energy equals the gap: hf = E₁ − E₂. A hot, thin gas gives out bright lines at just those wavelengths: an **emission spectrum**.',
      'Shine white light through a cooler gas and it absorbs exactly the photons that can lift electrons between its levels, then re-emits them in all directions. So dark lines appear in the light that comes straight through: an **absorption spectrum**.'
    ], { n: 1, e: 'hf = E_1 - E_2', x: ['Find the wavelength of the hydrogen line from n = 4 to n = 2.', ['ΔE = −0.85 − (−3.40) = 2.55 eV.', 'λ = 1240 ÷ 2.55 = 486 nm, blue-green light.'], '486 nm'], c: ['Why do absorption lines look dark, even though the gas re-emits the light it absorbs?', 'It re-emits in all directions, so very little continues along the original beam towards you.'] }],
    ['Photons and electrons excite differently', [
      'A photon can only be absorbed if its energy exactly matches a gap (or is enough to ionise the atom); otherwise it passes straight through. A colliding electron can hand over just part of its kinetic energy, so any electron with at least enough energy can excite the atom and keep the rest.'
    ], { n: 2, c: ['A 12.0 eV photon and a 12.0 eV electron each hit a hydrogen atom in its ground state. Which can excite it?', 'Only the electron. The gaps are 10.2 eV (to n = 2) and 12.09 eV (to n = 3); the photon matches neither, but the electron can give 10.2 eV and keep 1.8 eV.'] }],
    ['Ionisation', [
      'The **ionisation energy** is the energy needed to remove an electron from the ground state completely: 13.6 eV for hydrogen. A photon with more than this can ionise the atom, and the extra becomes the electron’s kinetic energy.',
      'An atom excited to level n can drop back by many routes, giving n(n − 1)/2 possible lines.'
    ], { n: 3, x: ['A 15.0 eV photon hits a hydrogen atom in its ground state. What happens?', ['15.0 eV is more than the 13.6 eV ionisation energy, so the electron is freed.', 'It leaves with 15.0 − 13.6 = 1.4 eV of kinetic energy.'], 'the atom is ionised; the electron has 1.4 eV'], c: ['How many different lines can hydrogen atoms excited to n = 4 emit?', '4 × 3 ÷ 2 = 6.'] }],
    ['Spectra in astronomy', [
      'The dark lines in sunlight are absorption by gases in the Sun’s outer layers. Matching them to lines measured in the laboratory tells us what stars are made of, and in 1868 a line that matched nothing known revealed helium. Shifts in the lines measure how fast stars and galaxies move.'
    ], { n: 4, c: ['How do we know what a distant star is made of?', 'Its absorption lines match the lines that each element produces in the laboratory.'] }]
  ],
  m: [
    ['Thinking a photon can give part of its energy to an atom.', 'A photon is absorbed only if its energy matches a gap exactly.'],
    ['Using eV directly in E = hc/λ with h in J s.', 'Convert to joules, or use λ (nm) ≈ 1240/ΔE (eV).'],
    ['Counting one line per level.', 'There is one line per pair of levels.']
  ]
});

WL.gd('al-nuclear', {
  h: 'Weigh a helium nucleus and it comes out lighter than the two protons and two neutrons it is made of. The missing mass has not vanished: it left as energy when the nucleus formed, by E = mc². That “mass defect” explains why the Sun shines by fusing light nuclei, why nuclear reactors work by splitting heavy ones, and why the stars stop at iron.',
  s: [
    ['The mass defect', [
      'The mass of a nucleus is less than the total mass of its separate protons and neutrons. The difference is the **mass defect** Δm. It is not a mistake in the measurement: when nucleons bind together, energy is released, and energy has mass.',
      'Nuclear masses are measured in atomic mass units, u (1 u = 1.661 × 10⁻²⁷ kg).'
    ], { n: 0, e: '\\Delta m = Zm_p + Nm_n - M_{\\text{nucleus}}', x: ['A helium-4 nucleus has mass 4.00151 u. A proton is 1.00728 u and a neutron 1.00866 u. Find the mass defect.', ['Separate nucleons: 2 × 1.00728 + 2 × 1.00866 = 4.03188 u.', 'Δm = 4.03188 − 4.00151 = 0.03037 u.'], '0.0304 u'], c: ['Is the mass defect a measurement error?', 'No: forming the nucleus released energy, and the energy carried away its mass.'] }],
    ['Binding energy', [
      'The **binding energy** is the energy needed to pull a nucleus completely apart into separate nucleons. It equals the mass defect times c². In nuclear units, 1 u of mass is equivalent to 931.5 MeV.'
    ], { n: 1, e: 'B = \\Delta m\\,c^2,\\qquad 1\\ \\text{u} \\leftrightarrow 931.5\\ \\text{MeV}', x: ['Find the binding energy of helium-4, and the binding energy per nucleon.', ['B = 0.03037 × 931.5 = 28.3 MeV.', 'Per nucleon: 28.3 ÷ 4 = 7.07 MeV.'], '28.3 MeV; 7.1 MeV per nucleon'], c: ['How does 7 MeV per nucleon compare with the few eV that hold atoms together in a molecule?', 'It is about a million times larger, which is why nuclear fuels release about a million times more energy per kilogram.'] }],
    ['The binding-energy curve', [
      'Plot binding energy per nucleon against nucleon number. It rises steeply for light nuclei, peaks around iron and nickel at about 8.8 MeV, then falls slowly to about 7.6 MeV for uranium.',
      'Any reaction that moves nuclei towards the peak increases the total binding energy, and that increase is released.'
    ], { n: 2, e: 'Q = \\sum B_{\\text{after}} - \\sum B_{\\text{before}}', c: ['Why can stars not get energy by fusing iron?', 'Iron is at the peak of the curve; fusing it would move away from the peak, which takes in energy instead of releasing it.'] }],
    ['Fission and fusion', [
      'In **fission**, a heavy nucleus such as uranium-235 absorbs a neutron and splits into two medium-sized nuclei and two or three neutrons, releasing about 200 MeV. The neutrons can cause more fissions: a chain reaction, which reactors control. In **fusion**, light nuclei join: deuterium and tritium make helium-4 and a neutron, releasing 17.6 MeV.',
      'Fusion needs temperatures of millions of kelvin, so the positive nuclei move fast enough to get close despite their repulsion.'
    ], { n: 3, x: ['Use the curve to estimate the energy released when uranium-235 (7.6 MeV per nucleon) splits into two nuclei of about 117 nucleons each (8.5 MeV per nucleon), and the energy per kilogram of uranium.', ['Each of about 236 nucleons gains about 8.5 − 7.6 = 0.9 MeV: 236 × 0.9 ≈ 210 MeV, close to the measured 200 MeV.', 'Per kilogram: 200 MeV = 3.2 × 10⁻¹¹ J for one nucleus of mass 235 × 1.66 × 10⁻²⁷ = 3.9 × 10⁻²⁵ kg.', '3.2 × 10⁻¹¹ ÷ 3.9 × 10⁻²⁵ = 8 × 10¹³ J/kg, millions of times more than coal (about 3 × 10⁷ J/kg).'], 'about 200 MeV per fission; about 8 × 10¹³ J/kg'], c: ['Why does fusion need temperatures of millions of kelvin?', 'The nuclei are positively charged and repel; only very fast nuclei get close enough for the strong force to pull them together.'] }],
    ['Why the curve has that shape', [
      'Picture the nucleus as a liquid drop. Each nucleon is held by its near neighbours, but nucleons on the surface have fewer neighbours, which hurts small nuclei most. Every proton repels every other proton, which hurts large nuclei most. Nuclei also prefer equal numbers of protons and neutrons. The best compromise is near A ≈ 60: iron and nickel.'
    ], { n: 4, c: ['Why do very large nuclei have less binding energy per nucleon than iron?', 'The repulsion between all their protons grows faster than the attraction between neighbouring nucleons.'] }]
  ],
  m: [
    ['Mixing atomic masses (with electrons) and nuclear masses.', 'Use one kind consistently, or account for the electrons.'],
    ['Thinking binding energy is stored inside the nucleus, waiting to come out.', 'It is the energy you must supply to break the nucleus apart; it was released when the nucleus formed.'],
    ['Judging stability by total binding energy.', 'Compare binding energy per nucleon.']
  ]
});
WL.gd('al-decay', {
  h: 'Several thousand nuclei in your body decay every second, mostly potassium-40 and carbon-14, and nobody can say which one will go next. Yet a large sample of any isotope always loses half its nuclei in exactly the same time. Pure chance for each nucleus becomes a precise law for the sample, with one number, the decay constant, controlling it.',
  s: [
    ['Spontaneous and random', [
      'Radioactive decay is **spontaneous**: heating, squeezing or chemically combining the material makes no difference. It is **random**: you cannot predict which nucleus will decay next, or when; each has the same fixed chance per second. The evidence: the count rate from a steady source jumps about irregularly around its average.'
    ], { n: 0, c: ['A radioactive source is heated to 500 °C. Does its half-life change?', 'No: decay is spontaneous, so temperature has no effect.'] }],
    ['Activity and the decay constant', [
      'The **activity** A is the number of decays per second, measured in becquerels (1 Bq = 1 decay per second). The **decay constant** λ is the probability that a nucleus decays in one second. With N nuclei, the activity is A = λN.',
      'To find N from a mass m, use N = (m/M)N_A, where M is the molar mass and N_A = 6.02 × 10²³ per mole.'
    ], { n: 1, e: 'A = \\lambda N', x: ['Radium-226 has λ = 1.37 × 10⁻¹¹ s⁻¹ and a molar mass of 0.226 kg/mol. Find the activity of 1.0 μg of it.', ['N = (1.0 × 10⁻⁹ kg ÷ 0.226 kg/mol) × 6.02 × 10²³ = 2.66 × 10¹⁵ nuclei.', 'A = λN = 1.37 × 10⁻¹¹ × 2.66 × 10¹⁵ = 3.6 × 10⁴ Bq.'], '36 000 decays per second'], c: ['Two samples of the same isotope have different numbers of nuclei, one twice the other. How do their activities compare?', 'The larger has twice the activity: A = λN.'] }],
    ['Exponential decay', [
      'Because the rate of decay is proportional to the number left, the number falls exponentially: N = N₀e^(−λt). The activity, and the count rate once background is subtracted, follow the same curve, because both are proportional to N.'
    ], { n: 2, e: 'N = N_0e^{-\\lambda t}', x: ['Technetium-99m, used in medical scans, has λ = 0.115 per hour. What fraction is left after 24 hours?', ['N/N₀ = e^(−0.115 × 24) = e^(−2.76).', '= 0.063, about 6%.'], 'about 6%'], c: ['Why does the corrected count rate follow the same curve as the number of nuclei?', 'It is a fixed fraction of the activity, and the activity is λN.'] }],
    ['Half-life', [
      'The **half-life** is the time for half the nuclei (or half the activity) to go. Setting N = N₀/2 gives t½ = ln 2/λ ≈ 0.693/λ. After n half-lives, (½)ⁿ is left.',
      'Plotting ln A against t gives a straight line of gradient −λ: the best way to find λ from real, scattered data.'
    ], { n: 3, e: 't_{1/2} = \\frac{\\ln 2}{\\lambda},\\qquad \\ln A = \\ln A_0 - \\lambda t', x: ['A sample’s corrected count rate is 800, 560 and 392 per minute at 0, 10 and 20 minutes. Find λ and the half-life.', ['Each 10 minutes the rate is multiplied by 0.70 (560 ÷ 800 = 392 ÷ 560 = 0.70).', 'e^(−10λ) = 0.70, so λ = −ln 0.70 ÷ 10 = 0.0357 per minute.', 't½ = 0.693 ÷ 0.0357 = 19 minutes.'], 'λ = 0.036 per minute; t½ ≈ 19 minutes'], c: ['On a graph of ln A against t, what is the gradient?', '−λ.'] }],
    ['Uses', [
      'Half-life decides the use. Carbon-14 (5730 years) dates things that were once alive, up to about 50 000 years old. Medical tracers such as technetium-99m (6 hours) last long enough for a scan but soon stop irradiating the patient. Smoke alarms use americium-241 (432 years) so they last.'
    ], { n: 4, x: ['Wood from an ancient boat has 30% of the carbon-14 activity of living wood. How old is it? (t½ = 5730 years)', ['λ = 0.693 ÷ 5730 = 1.21 × 10⁻⁴ per year.', 'e^(−λt) = 0.30, so t = ln(1 ÷ 0.30) ÷ λ = 1.20 ÷ 1.21 × 10⁻⁴.', 't = 9950 years.'], 'about 10 000 years'], c: ['Why is technetium-99m, with a 6-hour half-life, good for medical scans?', 'It lasts long enough to take the images, then decays quickly, so the patient’s dose stays small; it also gives out gamma rays, which escape the body to be detected.'] }]
  ],
  m: [
    ['Swapping the half-life and the decay constant.', 'They are inversely related: t½ = 0.693/λ.'],
    ['Forgetting to subtract background.', 'Correct every count before fitting a curve.'],
    ['Mixing time units.', 'Give λ and t in the same units (per second with seconds, per day with days).']
  ]
});

WL.gd('al-medical', {
  h: 'Doctors can see a baby in the womb, a crack in a bone or a tumour using glucose, all without cutting the body open. Each method uses a different piece of physics: echoes of ultrasound, the shadows cast by X-rays, and pairs of gamma rays from a radioactive tracer.',
  s: [
    ['Making and detecting ultrasound', [
      'Ultrasound is sound above 20 kHz; medical scanners use a few megahertz. A **piezoelectric** crystal changes shape when a voltage is applied, and makes a voltage when squeezed. An alternating voltage makes it vibrate and send out ultrasound; between pulses, the same crystal detects the returning echoes. The time of each echo gives the depth of the boundary it came from.'
    ], { n: 0, x: ['An echo returns 65 μs after the pulse is sent, in tissue where sound travels at 1540 m/s. How deep is the boundary?', ['Distance travelled = 1540 × 65 × 10⁻⁶ = 0.100 m.', 'That is there and back, so the depth is 0.050 m.'], '5.0 cm'], c: ['Why do you halve the distance?', 'The pulse travels to the boundary and back again.'] }],
    ['Acoustic impedance and reflection', [
      'Each material has an **acoustic impedance** Z = ρc (density × speed of sound). At a boundary, the fraction of the intensity reflected depends on how different the two impedances are. Soft tissues differ only a little, giving weak echoes; air and skin differ enormously, so nearly all the ultrasound reflects.'
    ], { n: 1, e: 'Z = \\rho c,\\qquad \\frac{I_R}{I_0} = \\left(\\frac{Z_2 - Z_1}{Z_2 + Z_1}\\right)^2', x: ['What fraction of the intensity reflects at a boundary between soft tissue (Z = 1.63 × 10⁶) and bone (Z = 7.8 × 10⁶)? (units kg m⁻² s⁻¹)', ['(Z₂ − Z₁) ÷ (Z₂ + Z₁) = (7.8 − 1.63) ÷ (7.8 + 1.63) = 6.17 ÷ 9.43 = 0.654.', 'Square it: 0.654² = 0.43.'], 'about 43%'], c: ['Why is gel spread on the skin before an ultrasound scan?', 'Without it there is air between the probe and the skin, and air reflects almost all the ultrasound before it gets in.'] }],
    ['X-rays', [
      'X-rays are made when electrons, accelerated through tens of kilovolts, hit a metal target. Most of their energy becomes heat; a few per cent becomes X-rays, with photon energies up to eV, so the shortest wavelength is λ_min = hc/(eV).',
      'A beam is weakened exponentially as it passes through matter: I = I₀e^(−μx), where μ is the **attenuation coefficient**. Bone has a much larger μ than soft tissue, so it casts a clear shadow.'
    ], { n: 2, e: '\\lambda_{\\min} = \\frac{hc}{eV},\\qquad I = I_0e^{-\\mu x}', x: ['An X-ray tube runs at 80 kV. What is the shortest wavelength it produces? If μ = 0.20 cm⁻¹ in soft tissue, what fraction of the beam gets through 15 cm?', ['Highest photon energy: 80 keV, so λ_min = 1240 ÷ 80 000 nm = 0.0155 nm.', 'Through 15 cm: I/I₀ = e^(−0.20 × 15) = e^(−3.0) = 0.050.'], '0.016 nm; about 5%'], c: ['Why does bone look white on an X-ray image?', 'It absorbs far more of the X-rays, so less reaches the detector behind it.'] }],
    ['CT scanning', [
      'In **computed tomography** an X-ray tube and detectors rotate around the patient, measuring the attenuation along thousands of paths through each slice of the body. A computer works out the attenuation of every small volume (voxel) and builds a 3D image, at the cost of a much larger dose than a single X-ray.'
    ], { n: 3, c: ['What does a CT scan show that a single X-ray picture cannot?', 'Where things are in depth: a single X-ray overlays everything along each path into one shadow, while CT separates the body into slices.'] }],
    ['PET scanning', [
      'A tracer such as glucose labelled with fluorine-18, a β⁺ emitter, is injected and gathers where cells use a lot of glucose, for example in tumours. Each positron soon meets an electron and they annihilate into two 511 keV gamma photons travelling in opposite directions. Detectors around the patient record pairs that arrive together; the annihilation lies on the line between them, and many such lines build up the image.'
    ], { n: 4, e: 'E_\\gamma = m_ec^2 = 0.511\\ \\text{MeV}', x: ['Fluorine-18 has a half-life of 110 minutes. What fraction of the tracer is left 4 hours after it is made?', ['240 minutes ÷ 110 minutes = 2.18 half-lives.', 'Fraction = (½)^2.18 = 0.22.'], 'about 22%, so it must be made close to the hospital'], c: ['Why do the two gamma photons fly off in opposite directions?', 'The electron and positron are almost at rest, so the total momentum is zero; the two photons’ momenta must cancel.'] }]
  ],
  m: [
    ['Forgetting to halve the echo distance.', 'The pulse goes there and back.'],
    ['Forgetting to square in the reflection formula.', 'The intensity fraction is the square of (Z₂ − Z₁)/(Z₂ + Z₁).'],
    ['Confusing μ with the half-value thickness.', 'The half-value thickness is ln 2/μ.']
  ]
});

WL.gd('al-astro', {
  h: 'Every star except the Sun looks like a single point of light, even through the largest telescopes. Yet astronomers can tell you how far away it is, how hot its surface is and how big it is. They need only how bright it looks, its colour, and three laws.',
  s: [
    ['Luminosity and flux', [
      'A star’s **luminosity** L is its total power output, in watts. At a distance d that power is spread over a sphere of area 4πd², so the power per square metre we receive, the **flux**, is F = L/(4πd²).'
    ], { n: 0, e: 'F = \\frac{L}{4\\pi d^2}', x: ['The Sun’s luminosity is 3.83 × 10²⁶ W and it is 1.50 × 10¹¹ m away. What flux reaches the Earth?', ['Area of the sphere: 4π × (1.50 × 10¹¹)² = 2.83 × 10²³ m².', 'F = 3.83 × 10²⁶ ÷ 2.83 × 10²³ = 1350 W/m².'], 'about 1.36 kW/m²'], c: ['A star is moved three times further away. What happens to its flux?', 'It becomes one ninth as large.'] }],
    ['Standard candles', [
      'A bright star might be near, or far and powerful. A **standard candle** is an object whose luminosity we know by some other clue; measure its flux and the distance follows: d = √(L/(4πF)). Cepheid variable stars, whose pulsation period reveals their luminosity, reach tens of millions of light-years; one kind of supernova reaches billions.'
    ], { n: 1, e: 'd = \\sqrt{\\frac{L}{4\\pi F}}', x: ['A Cepheid’s period shows its luminosity is 1.0 × 10³⁰ W, and its measured flux is 2.0 × 10⁻¹² W/m². How far away is it?', ['d = √(1.0 × 10³⁰ ÷ (4π × 2.0 × 10⁻¹²)) = √(4.0 × 10⁴⁰).', 'd = 2.0 × 10²⁰ m.', 'In light-years: 2.0 × 10²⁰ ÷ 9.46 × 10¹⁵ = 21 000 ly.'], '2.0 × 10²⁰ m, about 21 000 light-years'], c: ['Why do astronomers need standard candles?', 'Brightness alone cannot tell a nearby dim star from a distant powerful one; knowing L breaks the tie.'] }],
    ['Wien’s law: colour gives temperature', [
      'A hot object glows with a spectrum that peaks at a wavelength inversely proportional to its temperature in kelvin. So blue-white stars are hotter than red ones. The Sun peaks near 500 nm, giving about 5800 K.'
    ], { n: 2, e: '\\lambda_{\\max}T = 2.9\\times10^{-3}\\ \\text{m K}', x: ['A red star’s spectrum peaks at 850 nm. What is its surface temperature?', ['T = 2.9 × 10⁻³ ÷ 850 × 10⁻⁹.', '= 3400 K.'], 'about 3400 K'], c: ['Sirius peaks near 290 nm. What is its surface temperature?', '2.9 × 10⁻³ ÷ 290 × 10⁻⁹ = 10 000 K.'] }],
    ['Stefan–Boltzmann law: size from power and temperature', [
      'Each square metre of a star’s surface radiates σT⁴, with σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴. A sphere of radius r has area 4πr², so L = 4πr²σT⁴. Knowing L (from distance and flux) and T (from Wien’s law), you can find r.'
    ], { n: 3, e: 'L = 4\\pi r^2\\sigma T^4', x: ['Sirius has L = 9.6 × 10²⁷ W and T = 9900 K. Find its radius.', ['T⁴ = 9900⁴ = 9.6 × 10¹⁵ K⁴.', 'r² = L ÷ (4πσT⁴) = 9.6 × 10²⁷ ÷ (4π × 5.67 × 10⁻⁸ × 9.6 × 10¹⁵) = 1.4 × 10¹⁸ m².', 'r = 1.2 × 10⁹ m, about 1.7 times the Sun’s radius.'], '1.2 × 10⁹ m'], c: ['Two stars have the same temperature, but one is 100 times as luminous. How do their radii compare?', 'L ∝ r², so the brighter one has a radius 10 times larger.'] }],
    ['Giants and dwarfs', [
      'A star that is cool but extremely luminous must be enormous: a red giant or supergiant, hundreds of times the Sun’s radius. A star that is hot but faint must be tiny: a white dwarf, about the size of the Earth.'
    ], { n: 4, c: ['A star at 3000 K is 10 000 times as luminous as the Sun (5800 K). How does its radius compare?', 'r ∝ √L/T², so r = √10 000 × (5800/3000)² = 100 × 3.7 ≈ 370 times the Sun’s radius: a supergiant.'] }]
  ],
  m: [
    ['Using °C in Wien’s or Stefan’s law.', 'Temperatures must be in kelvin.'],
    ['Forgetting the fourth power.', 'Doubling T multiplies the power per square metre by 16.'],
    ['Confusing luminosity and flux.', 'Luminosity is the star’s total output; flux is what reaches each square metre here.']
  ]
});

WL.gd('al-cosmology', {
  h: 'Point a spectrometer at any distant galaxy and its spectral lines are shifted towards the red, and the fainter, more distant the galaxy, the bigger the shift. Read as motion, that means the Universe is expanding. Write the rate of expansion in SI units and its reciprocal is a time: roughly the age of the Universe.',
  s: [
    ['Redshift', [
      'Light from a source moving away is stretched to longer wavelengths. For speeds much less than light, the fractional shift equals v/c: z = Δλ/λ ≈ v/c. A shift to shorter wavelengths, a **blueshift**, means the source is approaching, as the nearby Andromeda galaxy is.'
    ], { n: 0, e: 'z = \\frac{\\Delta\\lambda}{\\lambda} \\approx \\frac{v}{c}', x: ['A calcium line at 393.4 nm in the lab appears at 401.3 nm in a galaxy’s spectrum. How fast is the galaxy receding?', ['Δλ = 401.3 − 393.4 = 7.9 nm.', 'z = 7.9 ÷ 393.4 = 0.0201.', 'v = zc = 0.0201 × 3.00 × 10⁸ = 6.0 × 10⁶ m/s.'], '6000 km/s'], c: ['What does a blueshift tell you?', 'The source is moving towards us.'] }],
    ['Hubble’s law', [
      'Measuring many galaxies’ distances (with standard candles) and recession speeds (from redshift), Hubble found in 1929 that speed is proportional to distance: v = H₀d. The **Hubble constant** H₀ is about 70 km/s for every megaparsec of distance (1 Mpc = 3.09 × 10²² m).'
    ], { n: 1, e: 'v = H_0d', x: ['How far away is the galaxy above, if H₀ = 70 km s⁻¹ Mpc⁻¹?', ['d = v/H₀ = 6000 ÷ 70 = 86 Mpc.', 'In metres: 86 × 3.09 × 10²² = 2.7 × 10²⁴ m, about 280 million light-years.'], 'about 86 Mpc'], c: ['How fast does a galaxy 200 Mpc away recede?', 'v = 70 × 200 = 14 000 km/s.'] }],
    ['Expansion with no centre', [
      'Hubble’s law does not put us at the centre. If space itself expands evenly, every observer sees every other galaxy receding at a speed proportional to its distance, like raisins in a rising loaf, each one seeing all the others move away.'
    ], { n: 2, c: ['Galaxies A and B lie in the same direction from us, 100 Mpc and 200 Mpc away. How fast does B recede as seen from A?', 'From us they recede at 7000 and 14 000 km/s, so from A, B moves away at 7000 km/s, and it is 100 Mpc from A: Hubble’s law holds for A too.'] }],
    ['The age of the Universe', [
      'If every galaxy has always moved at its present speed, a galaxy at distance d set off a time d/v = 1/H₀ ago, the same for all of them. To get a time, H₀ must be in SI units, per second.',
      'The expansion has not been steady, so 1/H₀ is an estimate; the best current age is 13.8 billion years. Two kinds of measurement of H₀ currently disagree slightly, giving about 67 and 73 km s⁻¹ Mpc⁻¹, a puzzle that is still being investigated.'
    ], { n: 3, e: 't_0 \\approx \\frac{1}{H_0}', x: ['Find 1/H₀ in years for H₀ = 73 and for H₀ = 67 km s⁻¹ Mpc⁻¹. (1 year = 3.16 × 10⁷ s)', ['H₀ = 73 000 m/s ÷ 3.09 × 10²² m = 2.36 × 10⁻¹⁸ s⁻¹, so 1/H₀ = 4.23 × 10¹⁷ s = 13.4 billion years.', 'For 67: 1/H₀ = 3.09 × 10²² ÷ 67 000 = 4.61 × 10¹⁷ s = 14.6 billion years.'], 'between about 13 and 15 billion years'], c: ['Why is 1/H₀ only an estimate of the age?', 'The expansion rate has changed over time: gravity slowed it at first, and it has since been speeding up.'] }],
    ['The evidence for the Big Bang', [
      'Three main pieces of evidence: the redshifts of galaxies (the Universe is expanding); the **cosmic microwave background**, a faint glow from every direction with the spectrum of a body at 2.7 K, which is light from the hot early Universe stretched about a thousandfold by the expansion; and the amounts of hydrogen and helium (about a quarter of normal matter by mass is helium), which match what the hot early Universe should have made.'
    ], { n: 4, x: ['The cosmic microwave background peaks at a wavelength of 1.06 mm. What temperature does that give?', ['Wien’s law: T = 2.9 × 10⁻³ ÷ 1.06 × 10⁻³.', '= 2.7 K.'], '2.7 K'], c: ['Why is the cosmic microwave background evidence for a hot, dense past?', 'It is radiation from everywhere at once, just what a Universe that was once hot and glowing throughout would leave behind, cooled by the expansion.'] }]
  ],
  m: [
    ['Mixing the units of H₀.', 'Convert km/s/Mpc to s⁻¹ before taking 1/H₀ as a time.'],
    ['Picturing galaxies flying out from a centre.', 'Space itself expands; every observer sees the same pattern.'],
    ['Using z ≈ v/c for very large redshifts.', 'It only works for speeds much less than c.']
  ]
});
