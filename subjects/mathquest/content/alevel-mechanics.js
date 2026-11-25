import {check as q, lesson as l} from './model.js';

export const mechanics = [
  l('al-m-forces', 'Forces and equilibrium', 'al-mechanics', 'mechanics',
    'Resolve forces into components, balance a particle in equilibrium and distinguish actual friction from limiting friction.',
    [
      'Draw just the particle and the forces acting on it. Weight mg acts vertically down, the normal reaction R is perpendicular to a surface, and tension pulls along a taut string. A smooth surface has no friction.',
      'Choose two perpendicular axes. A force F at angle θ to your positive x-axis contributes F cos θ along x and F sin θ along y. Include the signs from the direction of the arrow. Add components to find the resultant, then use Pythagoras and trigonometry for its magnitude and direction.',
      'In equilibrium the resultant is zero. Set the sum of the components along each axis to zero. On a slope, choosing axes along and perpendicular to the surface usually keeps the equations short.',
      'Static friction acts against the direction the particle would otherwise slip. Its magnitude adjusts to balance the other forces up to the limit μR. Use friction = μR when the particle is just about to slip, and check friction ≤ μR for other equilibrium situations.',
      'A third-law pair consists of two equal and opposite forces acting on different bodies. The floor pushing up on a box pairs with the box pushing down on the floor. The weight of the box acts on the box, so it is a different force.'
    ],
    ['A 5 kg crate rests on a rough horizontal floor. A rope pulls with 12 N at 30° above the horizontal. Find the reaction and friction, and decide whether μ = 0.25 permits equilibrium. Use g = 10 m/s².',
      'The pull contributes 12 sin 30° = 6 N up, so vertical balance gives R + 6 = 50 and R = 44 N. The horizontal pull is 12 cos 30° = 6√3 N, so friction must be 6√3 N in the opposite direction. The limiting friction is 0.25 × 44 = 11 N, greater than 6√3 ≈ 10.39 N. The crate can stay at rest.'],
    q('A particle is pulled 3 N east and 4 N north. What is the magnitude of the resultant force?', '5 N',
      ['1 N', '7 N', '25 N'], 'The two forces are perpendicular. The magnitude is √(3² + 4²) = 5 N.'),
    [
      q('A 6 kg box rests on a horizontal floor and a rope pulls vertically up with 10 N. What is the normal reaction? Use g = 10 m/s².', '50 N',
        ['10 N', '60 N', '70 N'], 'The weight is 60 N down. The reaction and rope pull balance it, so R + 10 = 60.'),
      q('A horizontal pull of 14 N acts on a stationary box. The normal reaction is 50 N and μ = 0.4. What is the actual friction?', '14 N against the pull',
        ['20 N against the pull', '14 N along the pull', '6 N against the pull'], 'The limit is 0.4 × 50 = 20 N, but only 14 N is needed to keep the box in horizontal equilibrium.'),
      q('A block is about to slip. The friction is 18 N and the normal reaction is 60 N. Find the coefficient of friction.', '0.3',
        ['0.18', '0.42', '3.33'], 'At limiting equilibrium, friction = μR, so μ = 18 ÷ 60 = 0.3.'),
      q('A shelf pushes upward on a book. What is the Newton’s third law partner of this force?', 'The book pushing downward on the shelf',
        ['Earth pulling downward on the book', 'The shelf pushing downward on its supports', 'The book pulling upward on Earth'], 'Swap the two interacting bodies and reverse the direction. The two forces must act on different bodies.'),
      q('A particle of weight 10 N is held by two strings. One pulls horizontally left. The other pulls with 20 N at 30° above the horizontal to the right. Find the leftward tension.', '10√3 N',
        ['10 N', '20 N', '20√3 N'], 'The rightward component is 20 cos 30° = 10√3 N and must be balanced. The upward component is 20 sin 30° = 10 N, balancing the weight.')
    ]),
  l('al-m-kinematics', 'Motion in a straight line', 'al-mechanics', 'mechanics',
    'Describe one-dimensional motion using signs, motion graphs, constant-acceleration equations and calculus.',
    [
      'Pick a positive direction before using any numbers. Displacement, velocity and acceleration can be positive or negative. Speed is the magnitude of velocity, and distance adds the lengths travelled in each direction.',
      'When acceleration a is constant, let u be the initial velocity, v the final velocity, s the displacement and t the elapsed time. Choose an equation containing the quantities you know: v = u + at, s = ut + ½at², v² = u² + 2as, or s = ½(u + v)t.',
      'The slope on a displacement–time graph gives velocity. On a velocity–time graph the slope gives acceleration, and the area with signs gives displacement. For distance, count the areas below the time axis as positive too.',
      'Differentiate displacement with respect to time to get velocity, then differentiate again for acceleration. To work backwards, integrate. For a definite integral of velocity, use the actual start and end times. For an indefinite integral, use a known starting value to find the integration constant.',
      'When two particles meet, their positions at that time agree. Write a position equation for each using one shared origin, direction and clock, then solve for a time within the motion described.'
    ],
    ['A toy robot has velocity v(t) = 6 − 2t m/s for 0 ≤ t ≤ 5. Find its displacement and the distance it travels during the five seconds.',
      'The robot turns at t = 3, when v = 0. On the velocity–time graph the first triangle has area ½ × 3 × 6 = 9 m above the time axis. The second has area ½ × 2 × 4 = 4 m below it. The displacement is 9 − 4 = 5 m, while the total distance is 9 + 4 = 13 m.'],
    q('A trolley starts at 5 m/s and accelerates at 3 m/s² in the direction of motion for four seconds. Find its final velocity.', '17 m/s',
      ['12 m/s', '20 m/s', '32 m/s'], 'Use v = u + at to get 5 + 3 × 4 = 17 m/s.'),
    [
      q('A particle has acceleration a(t) = 4t m/s² and an initial velocity of 3 m/s. Find its velocity at t = 2 s.', '11 m/s',
        ['7 m/s', '8 m/s', '19 m/s'], 'Integrate 4t to get v(t) = 2t² + C. The initial velocity gives C = 3, and v(2) = 2 × 2² + 3 = 11 m/s.'),
      q('A cart speeds up uniformly from 6 m/s to 14 m/s over 40 m. Find its acceleration.', '2 m/s²',
        ['0.2 m/s²', '4 m/s²', '5.8 m/s²'], 'Use v² − u² = 2as. Thus a = (14² − 6²) ÷ (2 × 40) = 160 ÷ 80.'),
      q('The position of a particle is s(t) = t³ − 5t² + 7t metres. Find the velocity at t = 3 s.', '4 m/s',
        ['3 m/s', '7 m/s', '8 m/s'], 'Differentiate to get v(t) = 3t² − 10t + 7. At t = 3 this is 27 − 30 + 7 = 4 m/s.'),
      q('Over four seconds, a particle’s velocity increases linearly from −2 m/s to 6 m/s. Find the distance it travels.', '10 m',
        ['8 m', '12 m', '16 m'], 'Velocity is zero after one second. The two triangle areas have magnitudes ½ × 1 × 2 = 1 and ½ × 3 × 6 = 9. Add them for distance.'),
      q('At the same instant, A passes x = 0 at a constant 6 m/s towards positive x and B starts from rest at x = 36 m. B accelerates towards negative x at 1.5 m/s². After how long do they meet?', '4 s',
        ['3 s', '6 s', '8 s'], 'Their positions are 6t and 36 − ¾t². Equating them gives (t − 4)(t + 12) = 0 after simplifying. Only 4 seconds is in the motion described.')
    ]),
  l('al-m-momentum', 'Momentum in direct collisions', 'al-mechanics', 'mechanics',
    'Use signed momentum to find speeds and directions before and after a collision on a straight line.',
    [
      'A body of mass m and velocity v has momentum p = mv, measured in kg m/s. Momentum has the same direction as velocity. Give velocities their signs before you multiply.',
      'Find the momentum of each body just before the collision and add the signed values. If forces from outside the two-body system have negligible effect during the brief collision, the sum immediately afterwards is the same.',
      'For two bodies that stick together, use the same final velocity for both, or multiply their combined mass by that velocity. For a rebound, reverse the sign of the rebounding body’s velocity.',
      'A negative result means motion in the negative direction. Kinetic energy can change in a collision even though total momentum is conserved.'
    ],
    ['A 3 kg trolley moves right at 4 m/s and a 2 kg trolley moves left at 1 m/s. They collide and stick together on a level track. Find their common velocity, with right taken as positive.',
      'The total momentum before the collision is 3 × 4 + 2 × (−1) = 10 kg m/s. The combined mass is 5 kg, so 5v = 10. The trolleys move right at 2 m/s.'],
    q('A 4 kg trolley moves west at 3 m/s. If east is positive, what is its signed momentum?', '−12 kg m/s',
      ['12 kg m/s', '−4/3 kg m/s', '−7 kg m/s'], 'The signed velocity is −3 m/s. Multiplying by 4 kg gives −12 kg m/s.'),
    [
      q('A 2 kg cart moves right at 6 m/s, collides with a stationary 4 kg cart and sticks to it. Find their common velocity.', '2 m/s right',
        ['2 m/s left', '3 m/s right', '6 m/s right'], 'The total momentum is 2 × 6 = 12 kg m/s right. Divide by the combined mass of 6 kg.'),
      q('A 5 kg trolley travels east at 3 m/s and a 2 kg trolley travels west at 4 m/s. Find the total momentum, taking east as positive.', '7 kg m/s',
        ['23 kg m/s', '−7 kg m/s', '−23 kg m/s'], 'The momenta are +15 kg m/s and −8 kg m/s. Add these signed values to get +7 kg m/s.'),
      q('A 1 kg glider moving right at 8 m/s hits a stationary 3 kg glider. The 1 kg glider rebounds left at 1 m/s. Find the 3 kg glider’s final velocity.', '3 m/s right',
        ['3 m/s left', '7/3 m/s right', '8/3 m/s right'], 'Take right as positive. Momentum before is 8, so after the rebound −1 + 3v = 8. This gives v = 3 m/s.'),
      q('A 2 kg cart travelling right at 5 m/s meets a 3 kg cart travelling left at 5 m/s. They stick together. Find their common velocity.', '1 m/s left',
        ['1 m/s right', '5 m/s left', '0 m/s'], 'The initial momentum is 10 − 15 = −5 kg m/s if right is positive. Dividing by 5 kg gives −1 m/s.'),
      q('A 2 kg cart moving at 7 m/s strikes a stationary cart. They stick and move together at 2 m/s in the original direction. Find the stationary cart’s mass.', '5 kg',
        ['2 kg', '3 kg', '7 kg'], 'If the unknown mass is m, conservation gives 2 × 7 = (2 + m) × 2. Thus 2 + m = 7 and m = 5 kg.')
    ], ['al-m-kinematics']),
  l('al-m-newton', 'Newton’s laws of motion', 'al-mechanics', 'mechanics',
    'Find accelerations, reactions and tensions on horizontal and inclined surfaces and in connected systems.',
    [
      'For a constant mass, draw a force diagram and choose a positive direction. In that direction use resultant force = mass × acceleration. A zero resultant gives zero acceleration, so motion can continue at constant velocity.',
      'Weight has magnitude mg and points downward. Use the value of g in the question, often 10 m/s² in Mechanics. For vertical motion, keep each force and the acceleration signed relative to the same choice of positive.',
      'On a plane of angle θ above horizontal, the weight component down the slope is mg sin θ. Its magnitude perpendicular into the slope is mg cos θ. Include other perpendicular forces when finding the reaction. Friction opposes slipping or the tendency to slip, so check which way the particle is moving before choosing its sign.',
      'A taut inextensible string makes connected bodies share the magnitude of acceleration. A light string running over a smooth pulley carries the same tension on both sides. A light rigid bar can transmit a pull or a push. Draw separate force diagrams if you need the internal force.',
      'For an entire connected system you can add the individual equations written in the respective directions of motion. The internal pulls or pushes cancel. Once you have the acceleration, find a tension or thrust from one body’s equation.'
    ],
    ['Two hanging masses of 4 kg and 6 kg are connected by a light inextensible string over a smooth pulley. Find their acceleration and the string tension. Use g = 10 m/s².',
      'The 6 kg mass accelerates down while the 4 kg mass accelerates up. Their equations are 60 − T = 6a and T − 40 = 4a. Adding gives 20 = 10a, so a = 2 m/s². Substituting into the second equation gives T = 40 + 8 = 48 N.'],
    q('A 5 kg trolley on a smooth horizontal track is pulled with 20 N right and 5 N left. What is its acceleration?', '3 m/s² right',
      ['3 m/s² left', '4 m/s² right', '5 m/s² right'], 'The resultant is 20 − 5 = 15 N to the right. Divide by the mass, 5 kg.'),
    [
      q('A rope lifts a 3 kg object with an upward acceleration of 2 m/s². Find the tension in the rope. Use g = 10 m/s².', '36 N',
        ['6 N', '24 N', '30 N'], 'The weight is 30 N down. With up positive, T − 30 = 3 × 2.'),
      q('A 4 kg block is sliding up a 30° rough slope and is no longer being pushed. The friction force is 6 N. Find the acceleration while it is still moving up. Use g = 10 m/s².', '6.5 m/s² down the slope',
        ['3.5 m/s² down the slope', '6.5 m/s² up the slope', '5 m/s² down the slope'], 'The weight component down the slope is 4 × 10 × sin 30° = 20 N. Friction is also down the slope while the block moves up. Divide the resultant 26 N by 4 kg.'),
      q('A 3 kg cart and a 2 kg cart are connected by a light string on a smooth track. A forward force of 25 N is applied to the 3 kg cart in front. Find the tension.', '10 N',
        ['5 N', '15 N', '25 N'], 'Both carts accelerate at 25 ÷ 5 = 5 m/s². The tension accelerates the rear 2 kg cart, so T = 2 × 5.'),
      q('A 5 kg block slides on a level floor in the direction of a 28 N horizontal driving force. Use friction = μR with μ = 0.2 and g = 10 m/s². What is the acceleration in the direction of the drive?', '3.6 m/s²',
        ['2 m/s²', '5.6 m/s²', '7.6 m/s²'], 'The normal reaction is 50 N and friction is 10 N. The net forward force is 18 N, so a = 18 ÷ 5.'),
      q('On a smooth level track, an external forward force of 35 N acts on a 4 kg cart. It pushes a 3 kg cart in front through a light rigid bar. What is the thrust in the bar?', '15 N',
        ['5 N', '20 N', '35 N'], 'The total mass is 7 kg, so the acceleration is 5 m/s². The front cart’s only horizontal force is the bar’s push, which is 3 × 5 = 15 N.')
    ], ['al-m-forces','al-m-kinematics']),
  l('al-m-energy', 'Energy, work and power', 'al-mechanics', 'mechanics',
    'Connect changes in kinetic and gravitational potential energy with work, and use power to find a driving force.',
    [
      'A constant force F does work W = Fd cos θ over a displacement of length d, where θ is the angle between the force and displacement. A force in the opposite direction does negative work. A force perpendicular to motion does no work.',
      'Kinetic energy is ½mv². A rise of height h increases gravitational potential energy by mgh, while a descent decreases it. The height change is vertical even when the path curves.',
      'The change in kinetic energy equals the total work done on the particle. If you account for gravity using potential energy, write change in kinetic plus potential energy = work by the other forces. A smooth fixed surface’s normal force does no work along the surface.',
      'Average power is work divided by time. At a particular instant, a driving force F along the direction of motion delivers power P = Fv, where v is the current speed. Power is measured in watts, with 1 kW = 1000 W.',
      'For a vehicle on a slope, find the driving force from power and speed first. In the direction of travel, combine it with the downhill weight component and any resistance, then apply the resultant-force equation.'
    ],
    ['A 0.5 kg slider starts from rest on a smooth curved track and drops a vertical height of 1.8 m. Find its speed at the bottom. Use g = 10 m/s².',
      'The contact force is perpendicular to motion, so it does no work. The slider loses 0.5 × 10 × 1.8 = 9 J of gravitational potential energy. This becomes kinetic energy, giving ½ × 0.5 × v² = 9. Hence v² = 36 and the speed is 6 m/s.'],
    q('A constant force of 12 N acts in the direction of a 5 m displacement. How much work does it do?', '60 J',
      ['2.4 J', '17 J', '300 J'], 'The angle is 0°, so the work is 12 × 5 × cos 0° = 60 J.'),
    [
      q('A force of 18 N acts at 60° to a displacement of 4 m. Find the work done by the force.', '36 J',
        ['18 J', '36√3 J', '72 J'], 'Only the component along the displacement contributes. The work is 18 × 4 × cos 60° = 36 J.'),
      q('A 3 kg cart speeds up from 4 m/s to 8 m/s. Find its increase in kinetic energy.', '72 J',
        ['24 J', '48 J', '96 J'], 'Subtract the initial kinetic energy from the final kinetic energy: ½ × 3 × (8² − 4²) = 72 J.'),
      q('A 2 kg block starts from rest and slides down by a vertical height of 5 m. The work done against friction is 36 J. Find the final speed. Use g = 10 m/s².', '8 m/s',
        ['6 m/s', '10 m/s', '√136 m/s'], 'The block loses 100 J of potential energy and gains 100 − 36 = 64 J of kinetic energy. With mass 2 kg, this gives v² = 64.'),
      q('A motor does 960 J of work in four seconds. At one instant it pulls a crate along its direction of motion with 120 N while the crate moves at 3 m/s. What are the average and instantaneous powers, respectively?', '240 W and 360 W',
        ['360 W and 240 W', '240 W and 40 W', '3840 W and 360 W'], 'Average power is 960 ÷ 4 = 240 W. At the chosen instant, P = Fv = 120 × 3 = 360 W.'),
      q('A 600 kg vehicle travels uphill at 10 m/s with driving power 18 kW. The sine of the slope angle is 0.1 and the resistance is 300 N. Find its instantaneous acceleration uphill. Use g = 10 m/s².', '1.5 m/s²',
        ['0.9 m/s²', '2.5 m/s²', '3 m/s²'], 'The drive is 18 000 ÷ 10 = 1800 N. The downhill weight component is 600 × 10 × 0.1 = 600 N. Subtract it and the 300 N resistance, then divide the remaining 900 N by 600 kg.')
    ], ['al-m-newton','al-m-kinematics'])
];
