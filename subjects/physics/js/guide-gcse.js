/* Geodesic step-by-step guides, stage gcse (built from src/guide/gcse-*.js) */
WL.gd('gcse-forces', {
  h: 'Push an empty supermarket trolley and it shoots forward; push a full one just as hard and it creeps. Hang one bag on a spring and it stretches a little; hang two and it stretches twice as far. This topic turns those two everyday facts into two rules, F = kx for springs and F = ma for motion, and shows where each rule stops working.',
  s: [
    ['A force can change speed, direction or shape', [
      'A force is a push or a pull, measured in newtons (N). Whatever the force, it can only do three things to an object: speed it up or slow it down, change the direction it is moving in, or change its shape.',
      'A footballer’s kick changes the ball’s speed. A car going round a bend has its direction changed by the road. Squeezing a sponge changes its shape. Every problem in this topic is about one of those three.'
    ], { c: ['A satellite goes round the Earth at a steady speed. Is a force acting on it?', 'Yes. Its speed is steady, but its direction changes all the time, and changing direction needs a force. Here it is gravity, pulling towards the Earth.'] }],
    ['Springs: double the load, double the extension', [
      'Hang weights on a spring and measure how much longer it gets. That increase is the **extension**, x: the new length minus the original length, not the total length.',
      'Up to a point, the extension is proportional to the force: twice the force, twice the extension. That is Hooke’s law, F = kx. The **spring constant** k is the force needed for each metre of extension, in N/m. A stiff spring has a large k.'
    ], { n: 0, e: 'F = k\\,x', x: ['A spring is 12.0 cm long. With a 3.0 N weight hanging from it, it is 18.0 cm long. Find the spring constant, then the spring’s length with a 5.0 N weight.', ['Extension = 18.0 − 12.0 = 6.0 cm = 0.060 m.', 'k = F/x = 3.0 ÷ 0.060 = 50 N/m.', 'With 5.0 N: x = F/k = 5.0 ÷ 50 = 0.10 m = 10.0 cm.', 'New length = 12.0 + 10.0 = 22.0 cm.'], 'k = 50 N/m; the spring is 22.0 cm long (assuming 5.0 N is still below the limit of proportionality).'], c: ['Spring A stretches 2.0 cm under 4.0 N. Spring B stretches 4.0 cm under 4.0 N. Which is stiffer?', 'A: k = 4.0 ÷ 0.020 = 200 N/m. B: k = 4.0 ÷ 0.040 = 100 N/m. A is stiffer: it needs more force for each metre of stretch.'] }],
    ['Past the limit, the rule breaks', [
      'Plot force against extension and the points lie on a straight line through the origin. Keep adding weight and eventually the line bends: you have passed the **limit of proportionality**, and F = kx no longer holds.',
      'Go further and you pass the **elastic limit**: take the weights off and the spring stays longer than it was. It has been permanently stretched. Below the elastic limit, a spring always returns to its original length.',
      'Stretching a spring stores energy. Below the limit of proportionality the stored energy is ½kx², the area under the force–extension line.'
    ], { e: 'E_{\\text{elastic}} = \\tfrac12 k x^2', x: ['How much energy is stored in a spring with k = 50 N/m stretched by 0.10 m?', ['E = ½ × k × x² = ½ × 50 × 0.10².', '= ½ × 50 × 0.010 = 0.25 J.'], '0.25 J'], c: ['Loads of 1, 2, 3 and 4 N give extensions of 2.0, 4.0, 6.0 and 8.9 cm. Where is the limit of proportionality?', 'Between 3 N and 4 N. Up to 3 N each newton adds 2.0 cm; at 4 N the extension would be 8.0 cm if the rule still held, but it is 8.9 cm.'] }],
    ['The resultant force: add forces along a line, with signs', [
      'Usually several forces act at once. What matters for motion is their **resultant**: the single force that would have the same effect. Along one line, pick a direction as positive and add the forces with signs.',
      'If the resultant is zero, the forces are **balanced**, and the motion does not change: a still object stays still, and a moving object keeps the same speed in the same direction. Balanced does not mean stopped.'
    ], { n: 1, x: ['A 1000 kg car’s engine pushes it forward with 2500 N. Air resistance and friction together push back with 1700 N. Find the resultant force.', ['Take forward as positive.', 'Resultant = +2500 − 1700 = +800 N.'], '800 N forwards, so the car speeds up.'], c: ['A skydiver weighs 700 N and the air pushes up on her with 700 N. What is she doing?', 'Falling at a constant speed (terminal velocity). The forces are balanced, so her speed is not changing, but she is still moving.'] }],
    ['F = ma: how quickly the speed changes', [
      'An unbalanced resultant force makes an object accelerate, in the direction of the force. Twice the force gives twice the acceleration; twice the mass gives half the acceleration. Both facts are in one equation: resultant force = mass × acceleration.',
      'One newton is defined as the force that gives 1 kg an acceleration of 1 m/s². Always use the resultant force in F = ma, never just one of the forces.'
    ], { n: 2, e: 'F_{\\text{res}} = m\\,a', x: ['The 1000 kg car from the last step has a resultant force of 800 N. What is its acceleration, and how fast is it going after 5.0 s if it started at 10 m/s?', ['a = F/m = 800 ÷ 1000 = 0.80 m/s².', 'The speed rises by 0.80 m/s every second: 0.80 × 5.0 = 4.0 m/s.', 'Final speed = 10 + 4.0 = 14 m/s.'], '0.80 m/s²; 14 m/s'], c: ['The same force pushes a 2 kg trolley and a 4 kg trolley. How do their accelerations compare?', 'The 4 kg trolley has half the acceleration of the 2 kg one, because a = F/m and the mass has doubled.'] }],
    ['Friction and drag, and terminal velocity', [
      'Friction acts where surfaces rub; drag (air resistance) acts on anything moving through air or water. Both push against the motion. Friction from a surface is roughly constant, but drag grows as the speed grows.',
      'That is why a falling object stops speeding up. At first, drag is small and the weight wins. As the speed rises, drag grows until it equals the weight. Then the resultant is zero and the speed stays constant: **terminal velocity**.'
    ], { n: 3, x: ['A 70 kg skydiver has 400 N of air resistance on her. Find her acceleration (g = 9.8 N/kg), and the air resistance at terminal velocity.', ['Weight = mg = 70 × 9.8 = 686 N, downwards.', 'Resultant = 686 − 400 = 286 N downwards.', 'a = F/m = 286 ÷ 70 = 4.1 m/s² downwards.', 'At terminal velocity the resultant is zero, so air resistance = weight = 686 N.'], '4.1 m/s²; 686 N'], c: ['A skydiver opens her parachute. Which way is the resultant force just after, and what happens to her speed?', 'Upwards: the parachute suddenly makes drag bigger than her weight. She slows down, which makes the drag fall, until drag equals weight again at a new, lower terminal velocity.'] }],
    ['Moving in a circle needs a force towards the centre', [
      'An object moving in a circle at steady speed is still accelerating, because its direction keeps changing. By F = ma, that needs a resultant force, and it points towards the centre of the circle.',
      'Something real must supply that force: the tension in a string for a ball swung round, friction between tyres and road for a car on a roundabout, gravity for the Moon. Take the force away and the object carries on in a straight line.'
    ], { n: 4, c: ['A ball on a string is swung in a circle and the string snaps. Which way does the ball go?', 'In a straight line, along the direction it was moving at that instant (at a tangent to the circle), not outwards from the centre.'] }]
  ],
  m: [
    ['Using the spring’s total length as x.', 'x is the extension: subtract the original length first, and convert centimetres to metres before using k in N/m.'],
    ['Putting a single force into F = ma.', 'Find the resultant first, adding all the forces along the line with signs.'],
    ['Thinking balanced forces mean the object is at rest.', 'Balanced forces mean the motion does not change: it may be moving at a steady speed.'],
    ['Saying a ball released from a circle flies outwards.', 'It moves off along the tangent; nothing pushes it outwards.']
  ]
});
WL.gd('gcse-measurement', {
  h: 'Two students time the same pendulum and get 1.5 s and 1.8 s. Who is right? Every measurement comes with an uncertainty, and good technique shrinks it. This topic also sorts quantities into two kinds: scalars, which have only a size, and vectors, which have a direction too and must be added with geometry, not plain arithmetic.',
  s: [
    ['Reading instruments properly', [
      'A metre rule reads to the nearest millimetre. Put your eye level with the mark you are reading: looking from an angle shifts the reading, which is called **parallax error**. Measure from a clear mark, not from the worn end of the rule.',
      'In a measuring cylinder, water curves up at the walls, forming a **meniscus**. Read the bottom of the meniscus, at eye level. The volume of an irregular solid is the rise in level when you lower it in.'
    ], { n: 0, c: ['You read a measuring cylinder from above, looking down at an angle. Will your reading be too high or too low?', 'Too high: looking down from above, the bottom of the meniscus lines up with a mark above its true level.'] }],
    ['Measure many to find one', [
      'Your reaction time when starting and stopping a stopwatch is about 0.2 to 0.3 s, far bigger than the stopwatch’s 0.01 s display. That error is the same whether you time one swing of a pendulum or twenty.',
      'So time many swings and divide: the error in one swing shrinks by the same factor. The same trick measures tiny lengths: measure a stack of paper and divide by the number of sheets.'
    ], { n: 1, e: 'T = \\frac{t_N}{N}', x: ['Ten swings of a pendulum take 15.6 s, and your timing could be out by 0.3 s. Find the period and its uncertainty.', ['Period T = 15.6 ÷ 10 = 1.56 s.', 'The 0.3 s error is shared over ten swings: 0.3 ÷ 10 = 0.03 s.'], 'T = 1.56 s ± 0.03 s'], c: ['A stack of 200 sheets of paper is 2.0 cm thick. How thick is one sheet?', '2.0 cm ÷ 200 = 0.010 cm = 0.10 mm, far too thin to measure directly with a ruler.'] }],
    ['Scalars and vectors', [
      'A **scalar** has a size only: distance, speed, time, mass, energy, temperature. A **vector** has a size and a direction: displacement, velocity, acceleration, force, weight, momentum.',
      'Walk 3 km east and then 4 km north: you have covered a distance of 7 km (a scalar), but your **displacement**, how far you are from where you started and in which direction, is only 5 km. Speed is distance per time; velocity is displacement per time.'
    ], { n: 2, c: ['A runner does one full lap of a 400 m track in 80 s. What are her average speed and her average velocity?', 'Average speed = 400 ÷ 80 = 5 m/s. Her displacement is zero (she ends where she started), so her average velocity is 0.'] }],
    ['Adding two vectors at right angles', [
      'Two vectors at right angles add like the sides of a right-angled triangle. Draw them nose to tail; the **resultant** runs from the start of the first to the end of the second. Its size comes from Pythagoras, and its direction from the tangent of the angle.',
      'You can also do it with a scale drawing: choose a scale (say 1 cm for 1 N), draw the arrows nose to tail, and measure the resultant with a ruler and protractor.'
    ], { n: 3, e: 'R = \\sqrt{F_1^2 + F_2^2}\\qquad \\tan\\theta = \\frac{F_2}{F_1}', x: ['A boat heads straight across a river at 3.0 m/s while the current carries it downstream at 1.5 m/s. What is its resultant velocity?', ['The two velocities are at right angles, so use Pythagoras: R = √(3.0² + 1.5²) = √(9.0 + 2.25) = √11.25.', 'R = 3.4 m/s.', 'Direction: tan θ = 1.5 ÷ 3.0 = 0.5, so θ = 27° downstream of straight across.'], '3.4 m/s at 27° downstream from straight across'], c: ['Forces of 6 N and 8 N act on a box at right angles. What is the size of their resultant?', '10 N, because √(6² + 8²) = √100 = 10. It is not 14 N: that would only be true if they pointed the same way.'] }],
    ['Random and systematic errors', [
      '**Random errors** scatter readings both ways: reaction time, judging a meniscus. Averaging repeats and timing many swings reduce them.',
      '**Systematic errors** push every reading the same way: a worn ruler end, a stopwatch that runs fast, a balance that shows 0.3 g with nothing on it (a **zero error**). Repeating does not remove them; you must find the cause and correct it.'
    ], { n: 4, x: ['A balance reads 0.3 g with nothing on it. A stone on the balance reads 25.8 g. What is the stone’s true mass?', ['The zero error adds 0.3 g to every reading.', 'True mass = 25.8 − 0.3 = 25.5 g.'], '25.5 g'], c: ['Repeating a measurement ten times and averaging: does that fix a stopwatch that runs 2% fast?', 'No. Every reading is 2% too big, so the average is too; you must correct for the faulty watch.'] }]
  ],
  m: [
    ['Adding vectors at right angles as if they were numbers.', 'Use Pythagoras: 3 N and 4 N at right angles make 5 N, not 7 N.'],
    ['Timing a single swing.', 'Time many swings and divide; the reaction-time error is then shared out.'],
    ['Thinking repeats remove every error.', 'Repeats reduce random errors only; systematic errors need their cause fixed.']
  ]
});

WL.gd('gcse-suvat', {
  h: 'How far does a car travel while it brakes from motorway speed? How high does a ball go if you throw it up at 14 m/s? When the acceleration is constant, five quantities describe the motion, and four equations link them, so knowing any three gives you the other two.',
  s: [
    ['Five quantities, and signs for direction', [
      'For motion in a straight line with constant acceleration we use five quantities: **s** (displacement), **u** (initial velocity), **v** (final velocity), **a** (acceleration) and **t** (time). These are often called the suvat quantities.',
      'Displacement, velocity and acceleration are vectors, so their direction matters. In a straight line we show direction with a sign. Choose which way is positive at the start and keep to it. If up is positive, a ball thrown upwards has u = +14 m/s, but its acceleration is a = −9.8 m/s² all the way up and down.'
    ], { n: 0, c: ['A ball is thrown straight up. At the very top, its velocity is zero. What is its acceleration there?', 'Still 9.8 m/s² downwards. Gravity does not switch off at the top; that is why the ball starts coming back down.'] }],
    ['A velocity–time graph holds everything', [
      'On a velocity–time graph, the **gradient** is the acceleration: how much the velocity changes each second. A straight line means constant acceleration.',
      'The **area** between the line and the time axis is the displacement. Area below the axis counts as negative displacement (moving backwards).'
    ], { n: 1, e: 'a = \\frac{v - u}{t}', x: ['A cyclist speeds up steadily from 4.0 m/s to 10.0 m/s in 6.0 s. Find her acceleration and how far she travels.', ['a = (v − u) ÷ t = (10.0 − 4.0) ÷ 6.0 = 1.0 m/s².', 'Distance = area under the graph, a trapezium: ½ × (4.0 + 10.0) × 6.0.', '= ½ × 14.0 × 6.0 = 42 m.'], '1.0 m/s²; 42 m'], c: ['On a velocity–time graph the line is horizontal at 5 m/s for 4 s. What is the acceleration and the distance?', 'Acceleration 0 (flat line); distance = 5 × 4 = 20 m (the rectangle under the line).'] }],
    ['The four equations', [
      'Rearranging the gradient gives v = u + at. The area under the straight line is a trapezium, which gives s = ½(u + v)t, or, written another way, s = ut + ½at². Getting rid of t between them gives v² = u² + 2as.',
      'Each equation leaves out one of the five quantities. To choose: list what you know and what you want, and pick the equation that leaves out the one you neither know nor want.'
    ], { n: 2, e: 'v = u + at\\qquad s = ut + \\tfrac12 at^2\\qquad s = \\tfrac12(u+v)t\\qquad v^2 = u^2 + 2as', x: ['A car travelling at 12 m/s accelerates at 1.5 m/s² for 8.0 s. How fast is it going, and how far does it travel?', ['Known: u = 12 m/s, a = 1.5 m/s², t = 8.0 s.', 'v = u + at = 12 + 1.5 × 8.0 = 24 m/s.', 's = ut + ½at² = 12 × 8.0 + ½ × 1.5 × 8.0² = 96 + 48 = 144 m.'], '24 m/s; 144 m'], c: ['You know u, v and s, and want a. Which equation do you use?', 'v² = u² + 2as, the one that leaves out t, which you neither know nor need.'] }],
    ['Free fall', [
      'Near the Earth’s surface, ignoring air resistance, everything falls with an acceleration of g = 9.8 m/s² downwards.',
      'A ball thrown straight up at speed u slows down by 9.8 m/s every second, stops at the top after a time u/g, at a height u²/2g, and comes back down to your hand with the same speed, taking the same time.'
    ], { n: 3, x: ['A ball is thrown straight up at 14 m/s. How long until it reaches the top, and how high does it go?', ['At the top v = 0. Using v = u + at with a = −9.8: 0 = 14 − 9.8t, so t = 14 ÷ 9.8 = 1.4 s.', 'Using v² = u² + 2as: 0 = 14² − 2 × 9.8 × s, so s = 196 ÷ 19.6 = 10 m.'], '1.4 s; 10 m'], c: ['How long is the ball in the air altogether before it returns to your hand?', 'About 2.9 s: 1.4 s up and the same 1.4 s down.'] }],
    ['Stopping distances', [
      'A driver’s **stopping distance** is the thinking distance plus the braking distance. The thinking distance is speed × reaction time (typically about 0.7 s, longer if tired, distracted or drunk).',
      'The braking distance comes from v² = u² + 2as with v = 0, giving s = u²/2a. Because it grows with the square of the speed, doubling your speed makes the braking distance four times longer.'
    ], { n: 4, x: ['A car travels at 20 m/s. The driver reacts in 0.70 s and the brakes slow the car at 5.0 m/s². Find the stopping distance.', ['Thinking distance = 20 × 0.70 = 14 m.', 'Braking distance = u² ÷ 2a = 20² ÷ (2 × 5.0) = 400 ÷ 10 = 40 m.', 'Stopping distance = 14 + 40 = 54 m.'], '54 m'], c: ['The same car goes at 40 m/s. How do the thinking and braking distances change?', 'The thinking distance doubles to 28 m; the braking distance quadruples to 160 m, so the total is 188 m, more than three times as far.'] }]
  ],
  m: [
    ['Mixing up signs.', 'Choose a positive direction first; anything pointing the other way gets a minus sign, including g.'],
    ['Using suvat when the acceleration changes.', 'The four equations hold only for constant acceleration.'],
    ['Saying a = 0 at the top of a throw.', 'The velocity is zero at the top; the acceleration is still 9.8 m/s² downwards.']
  ]
});

WL.gd('gcse-mass-weight', {
  h: 'An astronaut who weighs 800 N on Earth would weigh only 130 N on the Moon, but she would be just as hard to push sideways. Mass and weight are different things. This topic separates them and adds density, mass per volume, which decides what floats.',
  s: [
    ['Mass and weight', [
      '**Mass** is measured in kilograms. It measures how much matter something has and how hard it is to accelerate, and it is the same everywhere. **Weight** is a force, measured in newtons, pointing towards the centre of the planet.',
      'They are linked by the **gravitational field strength** g, the force on each kilogram. On Earth g = 9.8 N/kg, on the Moon about 1.6 N/kg and on Jupiter about 25 N/kg.'
    ], { n: 0, e: 'W = m\\,g', x: ['A 60 kg astronaut stands on Jupiter (g = 25 N/kg). What is her weight there, and her mass?', ['W = m × g = 60 × 25 = 1500 N.', 'Her mass is unchanged: 60 kg.'], '1500 N, with a mass of 60 kg'], c: ['A space probe has a weight of 2000 N on Earth. What is its mass?', 'm = W ÷ g = 2000 ÷ 9.8 ≈ 204 kg.'] }],
    ['Two meanings of g', [
      'g is the gravitational field strength, in N/kg, and it is also the acceleration of free fall, in m/s². They are the same number because of F = ma: a falling object has only its weight acting on it, so its acceleration is a = W/m = g.',
      'So every object, heavy or light, falls with the same acceleration when air resistance is small enough to ignore.'
    ], { n: 1, c: ['A 5 kg ball and a 1 kg ball are dropped together in a vacuum. Which accelerates more?', 'Neither: both accelerate at g. The 5 kg ball has five times the weight but also five times the mass.'] }],
    ['Beam balances and spring balances', [
      'A **beam balance** compares an unknown mass with standard masses. Both sides are pulled by the same g, so it gives the right mass on the Moon too.',
      'A **spring balance** (newton meter) measures the force stretching its spring, so it measures weight. One marked in kilograms only reads correctly where g = 9.8 N/kg.'
    ], { n: 2, c: ['A 2.0 kg mass is put on a spring balance marked in kilograms, on the Moon. What does it read?', 'About 0.33 kg, because the Moon’s g is a sixth of Earth’s, so the spring is stretched a sixth as much. A beam balance would still read 2.0 kg.'] }],
    ['Density: how tightly mass is packed', [
      '**Density** is mass per unit volume, in kg/m³ or g/cm³ (1 g/cm³ = 1000 kg/m³). Water is 1000 kg/m³, aluminium 2700, iron 7900, gold 19 300, and air only about 1.2.',
      'To measure the density of a liquid, weigh an empty measuring cylinder, pour in a known volume of the liquid, and weigh it again: the difference is the liquid’s mass.'
    ], { n: 3, e: '\\rho = \\frac{m}{V}', x: ['An empty measuring cylinder has a mass of 120 g. With 50 cm³ of oil in it, the mass is 166 g. Find the density of the oil in g/cm³ and kg/m³.', ['Mass of oil = 166 − 120 = 46 g.', 'Density = 46 ÷ 50 = 0.92 g/cm³.', 'In kg/m³: 0.92 × 1000 = 920 kg/m³.'], '0.92 g/cm³ = 920 kg/m³'], c: ['What is the weight of a 0.20 m³ block of aluminium (density 2700 kg/m³) on Earth?', 'Mass = 2700 × 0.20 = 540 kg; weight = 540 × 9.8 ≈ 5300 N.'] }],
    ['Floating and layers', [
      'An object floats in a liquid if its average density is less than the liquid’s, and sinks if it is greater. Liquids that do not mix, such as oil and water, settle in layers with the least dense on top.',
      'A steel ship floats because the hull encloses a lot of air, so its average density, steel plus air, is less than water’s.'
    ], { n: 4, c: ['Oil (920 kg/m³), water (1000 kg/m³) and syrup (1400 kg/m³) are poured into a jar. In what order do they settle, top to bottom?', 'Oil on top, then water, then syrup at the bottom: least dense to most dense.'] }]
  ],
  m: [
    ['Giving weight in kilograms.', 'Weight is a force, in newtons; kilograms are for mass.'],
    ['Thinking mass changes on the Moon.', 'Mass is the same everywhere; only weight changes with g.'],
    ['Mixing g/cm³ and kg/m³.', '1 g/cm³ = 1000 kg/m³; water is 1 g/cm³ or 1000 kg/m³.']
  ]
});

WL.gd('gcse-moments', {
  h: 'A crane lifting a steel beam would tip over without the heavy blocks on its other arm. Forces can turn things as well as push them, and when something is balanced, the turning effects in each direction cancel exactly. Where an object’s weight acts decides whether it stays upright or topples.',
  s: [
    ['The moment of a force', [
      'The **moment** of a force about a pivot is the force multiplied by the perpendicular distance from the pivot to the line of the force. It is measured in newton metres (N m).',
      'This is why door handles are far from the hinges and why a long spanner loosens a tight nut more easily: the same moment needs a smaller force when the distance is bigger.'
    ], { n: 0, e: 'M = F \\times d_{\\perp}', x: ['A nut needs a moment of 30 N m to loosen. What force is needed with a 0.15 m spanner, and with a 0.25 m spanner?', ['F = M ÷ d.', 'Short spanner: 30 ÷ 0.15 = 200 N.', 'Long spanner: 30 ÷ 0.25 = 120 N.'], '200 N; 120 N'], c: ['A force acts at an angle, not at right angles to the spanner. Is its moment bigger or smaller than if it pushed at right angles?', 'Smaller: only the perpendicular distance from the pivot to the force’s line counts, and that is shorter when the force is at an angle.'] }],
    ['The principle of moments', [
      'An object is in **equilibrium** when there is no resultant force and no resultant moment. Then, taking moments about any point, the total clockwise moment equals the total anticlockwise moment.',
      'The forces must balance too: the upward forces (such as the push of the pivot) equal the downward forces.'
    ], { n: 1, e: '\\textstyle\\sum M_{\\text{clockwise}} = \\sum M_{\\text{anticlockwise}}', x: ['On a seesaw, a 450 N girl sits 1.6 m to the left of the pivot. Where must a 600 N boy sit to balance her, and what force does the pivot exert?', ['Anticlockwise moment = 450 × 1.6 = 720 N m.', 'Clockwise: 600 × d = 720, so d = 1.2 m to the right.', 'Upward force from the pivot = 450 + 600 = 1050 N.'], '1.2 m right of the pivot; 1050 N upwards'], c: ['Why does the boy sit closer to the pivot than the girl?', 'He is heavier, so he needs a smaller distance to make the same moment.'] }],
    ['When the beam has weight of its own', [
      'If a beam is not “light”, its own weight acts at its centre of gravity (the middle, for a uniform beam), and that weight has a moment too.',
      'Choosing to take moments about the pivot, or about an unknown support force, removes that force from the equation, because its distance is zero. That is the trick for solving problems with unknown supports.'
    ], { n: 2, x: ['A uniform 2.0 m beam weighing 50 N is pivoted 0.50 m from its left end. What weight, hung at the left end, balances it?', ['The beam’s weight acts at its middle, 1.0 m from the left end, so 0.50 m to the right of the pivot.', 'Clockwise moment of the beam’s weight = 50 × 0.50 = 25 N m.', 'Anticlockwise: W × 0.50 = 25, so W = 50 N.'], '50 N'], c: ['In that example, what force does the pivot exert?', '100 N upwards: it supports the 50 N beam and the 50 N weight.'] }],
    ['Finding the centre of gravity', [
      'The **centre of gravity** is the point where the whole weight of an object can be taken to act. For a uniform, symmetrical object it is at the centre.',
      'For a flat irregular shape, hang it from a pin so it swings freely and draw a vertical line down from the pin, using a plumb line. Repeat from a second hole. The centre of gravity is where the lines cross, because a hanging object always settles with its centre of gravity directly below the pivot.'
    ], { n: 3, c: ['Why does a hanging object settle with its centre of gravity directly below the pin?', 'Anywhere else, its weight would have a moment about the pin and turn it; only directly below is the moment zero.'] }],
    ['Stability: why things topple', [
      'An object tips over when the vertical line through its centre of gravity passes outside its base: its weight then has a moment that turns it further over.',
      'A low centre of gravity and a wide base make an object stable: racing cars, Bunsen burners, and wine glasses with heavy bases.'
    ], { n: 4, c: ['Why should heavy books go on the bottom shelf of a bookcase?', 'That keeps the centre of gravity low, so the bookcase has to tilt much further before the line of its weight passes outside its base.'] }]
  ],
  m: [
    ['Measuring the distance to the end of the beam instead of to the pivot.', 'Distances are always measured from the point you take moments about.'],
    ['Forgetting the weight of the beam.', 'A heavy beam’s weight acts at its centre of gravity and has a moment.'],
    ['Forgetting the pivot force.', 'For equilibrium the forces must balance too: upward = downward.']
  ]
});

WL.gd('gcse-newton', {
  h: 'Why do passengers lurch forward when a bus brakes, why does a gun kick back when fired, and why does an airbag save lives? Newton’s three laws, and the momentum that forces change, answer all three.',
  s: [
    ['First law: things keep doing what they are doing', [
      'If the resultant force on an object is zero, its velocity does not change: it stays at rest, or keeps moving in a straight line at a constant speed. This tendency to keep going is called **inertia**.',
      'Moving things do not need a force to keep going; they need a force to speed up, slow down or turn. Passengers lurch forward when a bus brakes because their bodies keep moving until a seat belt or the seat in front applies a force.'
    ], { n: 0, c: ['A spacecraft far from any planet switches its engines off. What happens to its motion?', 'It carries on in a straight line at the same speed: with no resultant force, its velocity does not change.'] }],
    ['Second law: F = ma', [
      'The resultant force equals mass × acceleration. A bigger force gives a bigger acceleration; a bigger mass needs a bigger force for the same acceleration, so mass measures inertia.',
      'One newton is the force that gives 1 kg an acceleration of 1 m/s².'
    ], { n: 1, e: 'F = m\\,a', x: ['A 1200 kg car speeds up from 10 m/s to 25 m/s in 5.0 s. What resultant force acts on it?', ['a = (v − u) ÷ t = (25 − 10) ÷ 5.0 = 3.0 m/s².', 'F = m × a = 1200 × 3.0 = 3600 N.'], '3600 N'], c: ['The same force acts on a full and an empty shopping trolley. Which accelerates more?', 'The empty one: it has less mass, so a = F/m is larger.'] }],
    ['Third law: forces come in pairs', [
      'When object A pushes on object B, B pushes back on A with a force of the same size, in the opposite direction, of the same type, at the same time.',
      'The two forces act on different objects, so they never cancel each other out. When you walk, your foot pushes back on the ground and the ground pushes you forward.'
    ], { n: 2, c: ['The Earth pulls a falling apple down with 1 N. What is the third-law partner of that force?', 'The apple pulls the Earth up with 1 N of gravity. (The Earth’s huge mass means its acceleration is too tiny to notice.)'] }],
    ['Momentum is conserved', [
      '**Momentum** is mass × velocity, p = mv, in kg m/s. In a collision, the two objects push on each other with equal and opposite forces for the same time, so their momentum changes are equal and opposite.',
      'So the total momentum before equals the total momentum after, as long as no outside force acts. This lets you predict the result of a collision or explosion without knowing the forces in between.'
    ], { n: 3, e: 'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2', x: ['A 2.0 kg trolley moving at 3.0 m/s hits a stationary 1.0 kg trolley, and they stick together. How fast do they move off?', ['Momentum before = 2.0 × 3.0 + 1.0 × 0 = 6.0 kg m/s.', 'Afterwards the joined trolleys have mass 3.0 kg, so 3.0 × v = 6.0.', 'v = 2.0 m/s.'], '2.0 m/s'], c: ['A 3.0 kg rifle fires a 0.010 kg bullet at 600 m/s. How fast does the rifle recoil?', 'Total momentum starts at zero. Bullet: 0.010 × 600 = 6.0 kg m/s forwards, so the rifle has 6.0 kg m/s backwards: 6.0 ÷ 3.0 = 2.0 m/s.'] }],
    ['Impulse: why soft landings save lives', [
      'Force × time equals the change in momentum (the **impulse**). For a given change of momentum, such as bringing a passenger to a stop, a longer stopping time means a smaller force.',
      'Crumple zones, airbags, seat belts, cycle helmets and soft playground surfaces all work by stretching out the time of the impact.'
    ], { n: 4, e: 'F\\,\\Delta t = \\Delta p', x: ['A 70 kg passenger is stopped from 15 m/s. Compare the force if this takes 0.10 s (hitting the dashboard) and 0.50 s (an airbag).', ['Change in momentum = 70 × 15 = 1050 kg m/s.', 'In 0.10 s: F = 1050 ÷ 0.10 = 10 500 N.', 'In 0.50 s: F = 1050 ÷ 0.50 = 2100 N.'], '10 500 N against 2100 N: five times less with the airbag'], c: ['Why do you bend your knees when you land from a jump?', 'It makes the stop take longer, so for the same change of momentum the force on your legs is smaller.'] }],
    ['Terminal velocity', [
      'Air resistance grows with speed. A falling object speeds up until the drag equals its weight. The resultant force is then zero and, by the first law, it falls at a constant **terminal velocity**.'
    ], { n: 5, c: ['At terminal velocity, a skydiver is still falling. Why is she not speeding up?', 'Her weight and the air resistance are equal, so the resultant force is zero and her velocity does not change.'] }]
  ],
  m: [
    ['Saying the third-law forces cancel.', 'They act on different objects, so they cannot cancel each other.'],
    ['Forgetting that momentum has a direction.', 'Give one direction a minus sign; in a recoil the two momenta point opposite ways.'],
    ['Using a single force in F = ma.', 'Use the resultant of all the forces.']
  ]
});
WL.gd('gcse-energy', {
  h: 'A roller coaster car is hauled up the first hill and then needs no engine for the rest of the ride. Where does its speed come from at the bottom of each drop? From energy changing store: gravitational potential energy mgh becomes kinetic energy ½mv² and back again, and that lets you find speeds without knowing the shape of the track.',
  s: [
    ['Energy stores and transfers', [
      'Energy sits in **stores**: kinetic (moving things), gravitational potential (raised things), elastic (stretched things), thermal (hot things), chemical (fuel, food, batteries) and nuclear. It moves between stores when forces do work, by heating, by electric currents and by radiation.',
      'The total never changes. When energy seems to vanish, it has usually gone into the thermal store of the surroundings, through friction or air resistance.'
    ], { n: 0, c: ['A car brakes to a stop. Which store has its kinetic energy gone into?', 'Mostly the thermal store of the brakes, tyres and road, which all warm up.'] }],
    ['Work: how a force transfers energy', [
      'When a force moves something, it does **work**, and the work done is the energy transferred. Work = force × the distance moved in the direction of the force. One joule is the work done when a force of one newton moves one metre.',
      'Carrying a bag along a level corridor at steady speed does almost no work on the bag: your upward force is at right angles to the motion.'
    ], { n: 1, e: 'W = F\\,s', x: ['You push a box 5.0 m across a floor with a steady force of 40 N. How much work do you do, and where does the energy go?', ['W = F × s = 40 × 5.0 = 200 J.', 'At steady speed the box gains no kinetic energy, so the 200 J heats the box and floor through friction.'], '200 J, ending up as thermal energy'], c: ['A weightlifter holds a barbell still above her head for 5 s. How much work does she do on it?', 'None: the barbell does not move, so no work is done on it (her muscles tire for biological reasons).'] }],
    ['Gravitational potential energy: mgh', [
      'To lift a mass m at a steady speed you push up with a force equal to its weight, mg. Lifting it through a height h does work mg × h, which is stored as gravitational potential energy.'
    ], { n: 2, e: '\\Delta E_p = m\\,g\\,h', x: ['How much gravitational potential energy does a 2.0 kg box gain when lifted onto a 1.5 m shelf? (g = 9.8 N/kg)', ['ΔEp = m × g × h = 2.0 × 9.8 × 1.5.', '= 29.4 J.'], '29 J'], c: ['The same box is lifted 1.5 m by a ramp instead of straight up. Does it gain more, less or the same potential energy?', 'The same: only the change in height matters, not the route.'] }],
    ['Kinetic energy: ½mv²', [
      'Push a mass from rest with a constant force over a distance and the work done becomes **kinetic energy**, ½mv².',
      'The square matters: double the speed and the kinetic energy is four times bigger. That is why a crash at 60 km/h is so much worse than at 30 km/h.'
    ], { n: 3, e: 'E_k = \\tfrac12 m v^2', x: ['A 1000 kg car travels at 30 m/s. What is its kinetic energy? What is it at 15 m/s?', ['Ek = ½ × m × v² = ½ × 1000 × 30² = ½ × 1000 × 900 = 450 000 J.', 'At 15 m/s: ½ × 1000 × 15² = 112 500 J, a quarter as much.'], '450 kJ; 112.5 kJ'], c: ['A ball’s speed triples. By what factor does its kinetic energy change?', 'Nine times, because 3² = 9.'] }],
    ['Conservation: finding speeds from heights', [
      'With no friction, the potential energy lost equals the kinetic energy gained. For anything falling or sliding down a height h from rest, mgh = ½mv², so v = √(2gh).',
      'The mass cancels, and the shape of the slope does not matter: a steep drop and a long gentle ramp of the same height give the same speed at the bottom.'
    ], { n: 4, e: 'mgh = \\tfrac12 m v^2\\;\\Longrightarrow\\; v = \\sqrt{2gh}', x: ['A roller coaster car starts from rest and drops 20 m. Ignoring friction, how fast is it going at the bottom?', ['mgh = ½mv², so v = √(2gh).', 'v = √(2 × 9.8 × 20) = √392.', 'v = 19.8 m/s.'], 'about 20 m/s, whatever the car’s mass'], c: ['A real roller coaster reaches only 18 m/s at the bottom of that drop. Where did the rest of the energy go?', 'Into thermal energy (and some sound), through friction at the wheels and air resistance.'] }],
    ['Elastic energy, power and efficiency', [
      'A stretched spring with spring constant k and extension e stores **elastic potential energy** ½ke². **Power** is the rate of transferring energy, in watts (1 W = 1 J/s). **Efficiency** is the fraction of the input energy that ends up where you want it.'
    ], { n: 5, e: 'E_e = \\tfrac12 k e^2\\qquad P = \\frac{E}{t}', x: ['A spring with k = 200 N/m is stretched 0.10 m and then launches a 0.050 kg ball. How much energy does it store, and how fast can the ball go?', ['Ee = ½ × 200 × 0.10² = ½ × 200 × 0.010 = 1.0 J.', 'If all of it becomes kinetic energy: ½ × 0.050 × v² = 1.0, so v² = 40.', 'v = 6.3 m/s.'], '1.0 J; up to 6.3 m/s'], c: ['A motor transfers 600 J in 4.0 s. What is its power?', 'P = E ÷ t = 600 ÷ 4.0 = 150 W.'] }]
  ],
  m: [
    ['Forgetting to square the speed.', 'Ek = ½mv²: square v first, then multiply by ½m.'],
    ['Using the distance along a slope as h.', 'h in mgh is the vertical height change.'],
    ['Counting work when the force is at right angles to the motion.', 'Only the distance moved along the force counts.']
  ]
});

WL.gd('gcse-work-power', {
  h: 'Two people climb the same stairs, one walking and one running. They do the same work, but the runner has the greater power. This topic separates the three ideas: work (energy transferred by a force), power (how fast), and efficiency (how much of it is useful).',
  s: [
    ['Work done = force × distance', [
      '**Work done** equals the force times the distance moved in the direction of the force. One joule is the work done when a force of one newton moves its point of application one metre.',
      'No movement, no work: holding a heavy bag still does no work on it. Carrying it along a level path at constant speed does no work on it either, because your upward force is at right angles to the motion.'
    ], { n: 0, e: 'W = F\\,d', x: ['A gardener pulls a sledge 25 m with a steady 80 N force along the direction of motion. How much work does he do?', ['W = F × d = 80 × 25.', '= 2000 J.'], '2000 J (2.0 kJ)'], c: ['How much work does gravity do on a satellite in a circular orbit?', 'None: gravity points to the centre, at right angles to the satellite’s motion, so it never moves along the force.'] }],
    ['Work fills energy stores', [
      'Work done always shows up as a change in some energy store. Lifting something at steady speed: the force equals its weight, so the work done is mgh, which goes into the gravitational store.',
      'Pushing a box at steady speed against friction: the work done ends up in the thermal store of the box and the floor.'
    ], { n: 1, c: ['A crane lifts a 500 kg load 20 m at steady speed. How much work does it do on the load?', 'W = mgh = 500 × 9.8 × 20 = 98 000 J, all into the load’s gravitational store.'] }],
    ['Power: how fast the work is done', [
      '**Power** is the rate of doing work or transferring energy: work done ÷ time. One watt is one joule per second, so a 2 kW kettle transfers 2000 J every second.',
      'For a vehicle moving at steady speed v against a resistive force F, the power needed is P = Fv, because each second it moves v metres against the force.'
    ], { n: 2, e: 'P = \\frac{W}{t}\\qquad P = F\\,v', x: ['A 60 kg student runs up stairs 3.0 m high in 4.0 s. What is her useful power? (g = 9.8 N/kg)', ['Work done against gravity = mgh = 60 × 9.8 × 3.0 = 1764 J.', 'Power = W ÷ t = 1764 ÷ 4.0 = 441 W.'], 'about 440 W'], c: ['A car cruises at 25 m/s against 600 N of drag and friction. What power must its engine deliver to the wheels?', 'P = Fv = 600 × 25 = 15 000 W, or 15 kW.'] }],
    ['Efficiency and Sankey diagrams', [
      '**Efficiency** is the useful energy output divided by the total energy input (or the same with powers). It is always less than 1 (100%) for real machines; the rest is wasted, usually heating the surroundings.',
      'A **Sankey diagram** draws energy flows as arrows whose widths are proportional to the energy: one wide input arrow splits into a useful arrow and wasted arrows that bend away.'
    ], { n: 3, e: '\\text{efficiency} = \\frac{\\text{useful output}}{\\text{total input}}', x: ['An electric motor takes in 800 W and lifts a load with a useful power of 600 W. What is its efficiency, and how much power is wasted?', ['Efficiency = 600 ÷ 800 = 0.75 = 75%.', 'Wasted power = 800 − 600 = 200 W, mostly heating the motor.'], '75%; 200 W wasted'], c: ['An LED lamp is 40% efficient and gives out 4.0 W of light. How much power does it take in?', 'Input = useful ÷ efficiency = 4.0 ÷ 0.40 = 10 W.'] }]
  ],
  m: [
    ['Using the total path length when the force acts in one direction.', 'Only the distance moved along the force counts.'],
    ['Mixing up power and energy.', 'Energy is in joules; power is joules per second (watts).'],
    ['Writing efficiency as more than 100%.', 'Useful output can never exceed the input: check you divided useful by total.']
  ]
});

WL.gd('gcse-resources', {
  h: 'Nearly every power station, whether it burns coal, splits uranium or catches the wind, ends by doing the same thing: spinning a generator. What changes is what turns the turbine, how much it pollutes, how reliable it is and whether it will run out. This topic compares the main energy resources on those points.',
  s: [
    ['Heat, steam, turbine, generator', [
      'In coal, oil, gas, biomass and nuclear power stations, energy from the fuel heats water into high-pressure steam. The steam spins a **turbine**, which turns a **generator** that induces an electric current. Geothermal stations do the same with steam from hot underground rock.',
      'Fossil fuels release chemical energy and carbon dioxide. Nuclear fission releases nuclear energy with no carbon dioxide, but leaves radioactive waste.'
    ], { n: 0, c: ['What do a coal power station and a nuclear power station have in common?', 'Both heat water into steam that spins a turbine and generator; only the source of the heat is different.'] }],
    ['Moving air and water', [
      'Wind turbines are pushed round by moving air. Hydroelectric dams let water stored high up fall through turbines, turning gravitational potential energy into kinetic energy. Tidal barrages trap water at high tide and release it through turbines; wave machines use the up-and-down motion of the sea.',
      'Hydroelectric and tidal power are predictable; wind and waves depend on the weather.'
    ], { n: 1, x: ['In a small hydroelectric scheme, 2.0 m³ of water falls 30 m every second. Water has a density of 1000 kg/m³. What power does the water deliver, and what electrical power at 85% efficiency?', ['Mass falling each second = 2.0 × 1000 = 2000 kg.', 'Power = mgh per second = 2000 × 9.8 × 30 = 588 000 W.', 'Electrical power = 0.85 × 588 000 ≈ 500 000 W.'], 'about 590 kW from the water, 500 kW of electricity'], c: ['A wind turbine is rated at 3.0 MW but on average produces about a third of that. How much energy does it give in a day, in MWh?', 'Average power about 1.0 MW, for 24 hours: 1.0 × 24 = 24 MWh.'] }],
    ['Solar energy', [
      '**Solar cells** (photovoltaic cells) turn light directly into electricity, with no moving parts; typical panels convert about 20% of the light that falls on them. **Solar thermal** panels absorb sunlight to heat water instead.'
    ], { n: 2, x: ['Bright sunlight delivers about 1000 W to each square metre. How much electrical power does a 1.6 m² solar panel give if it is 20% efficient?', ['Light power on the panel = 1000 × 1.6 = 1600 W.', 'Electrical power = 0.20 × 1600 = 320 W.'], '320 W'], c: ['Why does a solar panel produce much less in winter in the UK?', 'The days are short, the Sun is low so its light is spread out more thinly, and it is often cloudy.'] }],
    ['Comparing resources', [
      'No resource wins on every count. Fossil fuels are reliable and can be turned up quickly, but they emit carbon dioxide and will run out. Nuclear is reliable and low-carbon but expensive to build and leaves long-lived waste. Wind and solar are renewable and low-carbon, but vary with the weather and need storage or back-up.',
      'A **renewable** resource is replaced naturally as fast as we use it; a non-renewable one, such as coal or uranium, is not.'
    ], { n: 3, c: ['Why can a gas power station help when everyone switches on their kettles at once, while a nuclear station usually cannot?', 'Gas stations can be started and turned up within minutes; nuclear stations change their output only slowly, so they run steadily.'] }],
    ['Most of it is sunshine in disguise', [
      'The Sun is powered by nuclear fusion. Its light drives the weather (wind, waves, and rain that fills hydroelectric dams) and photosynthesis, which made biomass and, over millions of years, fossil fuels.',
      'Three resources do not come from the Sun: nuclear fission (uranium made in ancient exploding stars), geothermal (heat from inside the Earth) and tides (the Moon’s gravity).'
    ], { n: 4, c: ['Trace the energy in coal back to its source.', 'Sunlight was captured by ancient plants by photosynthesis; the plants were buried and slowly turned into coal, keeping that energy in a chemical store.'] }]
  ],
  m: [
    ['Saying renewable means pollution-free.', 'Renewable means it will not run out; building turbines and panels still has costs and impacts.'],
    ['Thinking solar cells drive a turbine.', 'Photovoltaic cells make electricity directly, with no turbine.'],
    ['Mixing up power (MW) and energy (MWh).', 'Energy = power × time.']
  ]
});

WL.gd('gcse-pressure', {
  h: 'Why is a dam much thicker at the bottom than at the top, and why can a small push on a brake pedal stop a heavy car? Pressure is force spread over an area; in a liquid it grows with depth, and liquids pass it on undiminished.',
  s: [
    ['Pressure on solids', [
      'Pressure is the force acting at right angles to a surface divided by the area it acts on. The unit is the pascal: 1 Pa = 1 N/m².',
      'A sharp knife has a tiny cutting area, so a modest force gives an enormous pressure. Snowshoes and tractor tyres spread the weight over a large area, so the pressure is small and they do not sink in.'
    ], { n: 0, e: 'p = \\frac{F}{A}', x: ['An elephant weighing 50 000 N stands on four feet, each of area 0.10 m². A woman weighing 600 N puts all her weight on one stiletto heel of area 1.0 cm². Compare the pressures.', ['Elephant: p = 50 000 ÷ (4 × 0.10) = 50 000 ÷ 0.40 = 125 000 Pa.', 'Heel: 1.0 cm² = 0.0001 m², so p = 600 ÷ 0.0001 = 6 000 000 Pa.'], 'The heel presses nearly 50 times harder: 6 MPa against 0.125 MPa'], c: ['Why do you sink into snow in boots but not on skis?', 'Skis spread your weight over a much larger area, so the pressure on the snow is much smaller.'] }],
    ['Pressure in liquids', [
      'A liquid pushes on everything in it and on the walls of its container. The pressure increases with depth, because there is more liquid above pushing down, and is larger in a denser liquid. At a given depth it acts equally in all directions.',
      'That is why dams are much thicker at the bottom, and why water spurts furthest from the lowest hole in a leaking can.'
    ], { n: 1, c: ['Three holes are punched one above another in a can of water. Which jet travels furthest?', 'The bottom one: the pressure there is greatest because the water above it is deepest.'] }],
    ['Δp = ρgΔh', [
      'Picture a column of liquid of height Δh standing on an area A. Its weight is ρ × AΔh × g. Divide by the area A and the area cancels: the extra pressure is ρgΔh, whatever the shape of the container.'
    ], { n: 2, e: '\\Delta p = \\rho\\,g\\,\\Delta h', x: ['What is the extra pressure 15 m down in sea water of density 1030 kg/m³? (g = 9.8 N/kg)', ['Δp = ρ × g × Δh = 1030 × 9.8 × 15.', '= 151 410 Pa ≈ 151 kPa.'], 'about 151 kPa'], c: ['Two tanks hold water 3 m deep: one is 1 m wide, one is 10 m wide. Compare the pressure on their bottoms.', 'The same: Δp = ρgΔh depends only on the depth and the liquid.'] }],
    ['Atmospheric pressure, and total pressure under water', [
      'The air above us has weight too. At sea level it presses with about 101 000 Pa (101 kPa), the weight of roughly 10 tonnes on every square metre. We do not notice because the pressure inside our bodies pushes back equally.',
      'Under water, the total pressure is atmospheric pressure plus ρgh. Every 10 m of water adds about one more atmosphere.'
    ], { n: 3, e: 'p_{\\text{total}} = p_{\\text{atm}} + \\rho g h', x: ['What is the total pressure on a diver 15 m down in that sea water?', ['p = p_atm + ρgh = 101 kPa + 151 kPa.', '= 252 kPa.'], '252 kPa, two and a half times the pressure at the surface'], c: ['Roughly how deep must you dive in fresh water for the total pressure to double?', 'About 10 m, where the water adds about one more atmosphere.'] }],
    ['Hydraulics', [
      'A liquid passes on any pressure applied to it. In a hydraulic jack or car brakes, a small force on a small piston creates a pressure that acts on a large piston, giving a large force: F₂ = F₁ × A₂/A₁.',
      'The large piston moves a smaller distance, so the work done is not multiplied.'
    ], { n: 4, e: 'F_2 = F_1\\,\\frac{A_2}{A_1}', x: ['A brake pedal pushes a 2.0 cm² piston with 300 N. The wheel’s piston has an area of 10 cm². What force does it apply to the brake pad?', ['F₂ = F₁ × A₂ ÷ A₁ = 300 × 10 ÷ 2.0.', '= 1500 N.'], '1500 N'], c: ['If the pedal piston moves 5.0 cm, how far does the wheel piston move?', '1.0 cm: the same volume of liquid moves, and the wheel piston is five times wider.'] }]
  ],
  m: [
    ['Leaving areas in cm².', 'Convert to m² before using p = F/A: 1 cm² = 0.0001 m².'],
    ['Forgetting atmospheric pressure under water.', 'ρgh is the extra pressure; the total adds the air pressure above.'],
    ['Thinking hydraulics creates energy.', 'The force is multiplied but the distance is divided; the work stays the same.']
  ]
});

WL.gd('gcse-particles', {
  h: 'Smoke specks under a microscope jiggle about for no visible reason, a sealed bottle cracks in a hot car, and a bubble grows as it rises through water. All three follow from one model: everything is made of particles in constant motion, and gas pressure is just those particles hammering on the walls.',
  s: [
    ['Solids, liquids and gases', [
      'The three states differ in how the particles are arranged, how far apart they are, how they move and how strongly they attract each other. In a solid they vibrate about fixed positions; in a liquid they are close but slide past each other; in a gas they are far apart and move freely and fast.',
      'Melting, boiling, freezing and condensing change the arrangement, not the particles themselves. Pure water melts at 0 °C and boils at 100 °C at normal atmospheric pressure.'
    ], { n: 0, c: ['Why is a gas easy to compress but a liquid is not?', 'Gas particles are far apart with lots of empty space between them; liquid particles are already touching.'] }],
    ['Temperature and absolute zero', [
      'The hotter a substance, the faster its particles move on average: temperature measures their average kinetic energy. Cool anything enough and the motion falls to its minimum. That temperature, −273 °C, is **absolute zero**, the bottom of the **Kelvin** scale.',
      'A change of 1 K is the same size as a change of 1 °C; only the starting point differs, so T (in K) = θ (in °C) + 273.'
    ], { n: 1, e: 'T\\,(\\text{K}) = \\theta\\,(^\\circ\\text{C}) + 273', x: ['Convert 27 °C to kelvin, and 100 K to °C.', ['27 + 273 = 300 K.', '100 − 273 = −173 °C.'], '300 K; −173 °C'], c: ['Can anything be colder than 0 K?', 'No: 0 K is where the particle motion is at its minimum; there is no lower temperature.'] }],
    ['Brownian motion: seeing molecules indirectly', [
      'Under a microscope, smoke specks in air jiggle about at random. Air molecules are far too small to see, but they move fast and hit each speck unevenly from different sides, so it is shoved first one way, then another.',
      'Light, fast molecules can move a much heavier speck because there are so many collisions. Einstein explained this in 1905, and Perrin’s measurements convinced the doubters that molecules are real.'
    ], { n: 2, c: ['Why does a large speck jiggle less than a small one?', 'It is hit by many more molecules at once, so the pushes from different sides nearly cancel, and its larger mass is harder to move.'] }],
    ['Gas pressure', [
      'Gas particles constantly collide with the walls of their container. Each collision gives a tiny push; the total force per unit area is the gas **pressure**.',
      'Heat a gas in a fixed volume and the particles move faster, hitting the walls harder and more often, so the pressure rises. Squash a gas into a smaller volume at the same temperature and the particles hit each part of the wall more often, so again the pressure rises.'
    ], { n: 3, c: ['Why should you never put an aerosol can on a bonfire?', 'Heating the gas inside makes its particles move faster and hit the walls harder and more often; the pressure can rise until the can bursts.'] }],
    ['Boyle’s law: pV stays the same', [
      'For a fixed mass of gas at constant temperature, halving the volume doubles the pressure: the same particles, moving at the same speeds, hit each bit of wall twice as often. So pressure × volume stays constant.'
    ], { n: 4, e: 'p_1V_1 = p_2V_2', x: ['A bubble of volume 2.0 cm³ is released at the bottom of a lake, where the pressure is 300 kPa. What is its volume at the surface (100 kPa), if its temperature does not change?', ['p₁V₁ = p₂V₂, so V₂ = p₁V₁ ÷ p₂.', 'V₂ = 300 × 2.0 ÷ 100 = 6.0 cm³.'], '6.0 cm³, three times bigger'], c: ['A syringe of air is pushed from 60 cm³ to 20 cm³ at constant temperature. What happens to the pressure?', 'It triples, because the volume is a third as big.'] }]
  ],
  m: [
    ['Using °C in gas calculations.', 'Use kelvin when temperatures are multiplied or divided: T = θ + 273.'],
    ['Saying particles get bigger when heated.', 'They move faster and spread out; the particles themselves do not grow.'],
    ['Forgetting that Boyle’s law needs constant temperature.', 'pV = constant only if the temperature and the amount of gas stay the same.']
  ]
});
WL.gd('gcse-expansion', {
  h: 'Railway lines can buckle on a hot day, concrete bridges are built with gaps that open and close with the seasons, and a jam-jar lid comes loose under the hot tap. Almost everything gets bigger when heated: gases most, liquids less, solids least, and engineers have to design around it.',
  s: [
    ['Gases expand most, solids least', [
      'For the same temperature rise, gases expand the most, liquids much less and solids least of all. The change in a solid is small: a steel rail 10 m long grows by only about 1 mm for every 10 °C rise.',
      'But the force needed to stop that growth is enormous, which is why rails buckle and why bridges need expansion joints.'
    ], { n: 0, e: '\\Delta L = \\alpha\\,L_0\\,\\Delta T', x: ['A steel rail is 25 m long. Steel’s expansion coefficient is α = 12 × 10⁻⁶ per °C. How much longer does the rail get when it warms by 30 °C?', ['ΔL = α × L₀ × ΔT = 12 × 10⁻⁶ × 25 × 30.', '= 0.0090 m.', 'That is 9.0 mm.'], '9.0 mm'], c: ['Why is a hot jam-jar lid easier to unscrew after holding it under hot water?', 'The metal lid expands more than the glass jar for the same temperature rise, so it loosens.'] }],
    ['Why things expand: the particle picture', [
      'In a solid, heating makes the particles vibrate with bigger amplitude, so on average they sit slightly further apart and the whole solid grows. The particles themselves do not get bigger.',
      'In a liquid the same happens, more strongly because the forces between particles are weaker. In a gas kept at constant pressure, faster particles push the walls back further: its volume is proportional to its temperature in kelvin.'
    ], { n: 1, x: ['A balloon holds 2.0 litres of air at 27 °C. It is warmed to 87 °C at constant pressure. What is its new volume?', ['Convert to kelvin: 27 + 273 = 300 K, and 87 + 273 = 360 K.', 'V is proportional to T, so V₂ = 2.0 × 360 ÷ 300.', '= 2.4 litres.'], '2.4 litres'], c: ['Do the atoms in a hot metal bar get bigger?', 'No. They vibrate more and sit a little further apart on average; that is what makes the bar grow.'] }],
    ['Designing for expansion', [
      'Engineers leave room for things to grow: gaps or sliding joints in bridges and railway lines, loops in long pipelines, and power cables hung loosely so that they do not snap when they contract in winter.',
      'Glass that is heated unevenly expands unevenly and can crack, which is why oven dishes use special glass that expands very little.'
    ], { n: 2, c: ['Why are overhead power cables left sagging in summer?', 'If they were tight in summer, they would contract in winter cold and could snap or pull down the pylons.'] }],
    ['Putting expansion to work', [
      'A liquid-in-glass thermometer uses the expansion of mercury or coloured alcohol: a narrow tube turns a tiny change in volume into a long movement of the thread.',
      'A **bimetallic strip** is two metals bonded together. When heated, the one that expands more (for example brass) ends up on the outside of the curve, so the strip bends. It switches heaters and kettles on and off.'
    ], { n: 3, c: ['A bimetallic strip of brass and iron is heated. Which metal is on the outside of the bend?', 'Brass, because it expands more than iron, so it has to be on the longer, outer side of the curve.'] }],
    ['Water is strange', [
      'Water contracts as it warms from 0 °C to 4 °C, and only expands above 4 °C, so it is densest at 4 °C.',
      'Ponds therefore freeze from the top down: the densest water, at 4 °C, sinks to the bottom, and the ice floats on top, insulating the water below so fish survive the winter.'
    ], { n: 4, c: ['Why can a water pipe burst in a hard frost?', 'Water expands as it freezes into ice, and the ice pushes on the pipe with a force strong enough to split it.'] }]
  ],
  m: [
    ['Saying the particles themselves expand.', 'The particles stay the same size; they move more and sit further apart.'],
    ['Using °C for gas volumes.', 'Gas volume at constant pressure is proportional to the kelvin temperature.'],
    ['Forgetting units with α.', 'Keep L₀ and ΔL in the same unit, and ΔT in °C (or K, the same size of step).']
  ]
});

WL.gd('gcse-shc', {
  h: 'Heat a pan of ice steadily and watch the thermometer: it climbs, stalls at 0 °C while the ice melts, climbs again, then stalls at 100 °C for a long time while the water boils. Heating either raises the temperature or changes the state, and two material constants tell you how much energy each takes.',
  s: [
    ['Temperature and internal energy', [
      'Temperature measures the average kinetic energy of the particles. **Internal energy** is the total energy of all the particles: their kinetic energy plus the potential energy stored in the bonds between them.',
      'So a bath of warm water has far more internal energy than a red-hot pin, even though the pin is much hotter.'
    ], { n: 0, c: ['Two cups hold water at 60 °C, one with 200 g and one with 400 g. Which has more internal energy?', 'The 400 g cup: same temperature, twice as many particles.'] }],
    ['Specific heat capacity', [
      'The **specific heat capacity** c is the energy needed to raise 1 kg of a substance by 1 °C. Water’s is unusually large, 4200 J/(kg °C), five to ten times that of most metals.',
      'That is why the sea warms and cools slowly, keeping coastal climates mild, and why water is used in radiators and car cooling systems.'
    ], { n: 1, e: 'E = m\\,c\\,\\Delta\\theta', x: ['How much energy is needed to heat 2.0 kg of water from 20 °C to 100 °C? How long would a 2.0 kW kettle take, if no energy is wasted?', ['Δθ = 100 − 20 = 80 °C.', 'E = m × c × Δθ = 2.0 × 4200 × 80 = 672 000 J.', 'Time = E ÷ P = 672 000 ÷ 2000 = 336 s, about 5.6 minutes.'], '672 kJ; about 5.6 minutes'], c: ['The same energy is given to 1 kg of water and 1 kg of copper (c = 385 J/(kg °C)). Which gets hotter?', 'The copper, by about eleven times as much, because its specific heat capacity is about eleven times smaller.'] }],
    ['Specific latent heat', [
      'While a substance melts or boils, its temperature stays fixed: the energy goes into breaking bonds, not into speeding particles up. The **specific latent heat** L is the energy needed to change the state of 1 kg with no change in temperature.',
      'For water, melting takes 334 000 J/kg (latent heat of fusion) but boiling takes 2 260 000 J/kg (vaporisation), almost seven times as much, because boiling pulls the particles completely apart.'
    ], { n: 2, e: 'E = m\\,L', x: ['How much energy melts 0.50 kg of ice at 0 °C? How much boils away 0.50 kg of water at 100 °C?', ['Melting: E = m × L_f = 0.50 × 334 000 = 167 000 J.', 'Boiling: E = m × L_v = 0.50 × 2 260 000 = 1 130 000 J.'], '167 kJ to melt it; 1130 kJ to boil it'], c: ['Why does steam at 100 °C scald worse than water at 100 °C?', 'As steam condenses on your skin it gives out its large latent heat as well, before it even starts to cool.'] }],
    ['Reading a heating curve', [
      'Heat ice at a steady rate and plot temperature against time. Sloping parts are heating within one state; flat parts are changes of state.',
      'A steeper slope means a smaller heat capacity for that state. The boiling plateau is about seven times longer than the melting plateau, because the latent heat of vaporisation is about seven times bigger.'
    ], { n: 3, c: ['On a heating curve for water, which flat section is longer, and why?', 'The boiling one at 100 °C: vaporisation needs about seven times more energy per kilogram than melting.'] }],
    ['Measuring c in the lab', [
      'Put an electric heater in a metal block, measure the energy supplied (E = VIt, or with a joulemeter) and the temperature rise, then c = E ÷ (mΔθ).',
      'Insulate the block, and stir if it is water, to reduce the energy lost to the room; otherwise the value of c comes out too high.'
    ], { n: 4, x: ['A 1.0 kg aluminium block is heated by a 12 V heater taking 4.0 A for 300 s. Its temperature rises by 16 °C. Find c.', ['Energy supplied E = V × I × t = 12 × 4.0 × 300 = 14 400 J.', 'c = E ÷ (m × Δθ) = 14 400 ÷ (1.0 × 16).', '= 900 J/(kg °C).'], '900 J/(kg °C), the accepted value for aluminium'], c: ['If the block was not insulated, would the measured c be too big or too small?', 'Too big: some energy escapes, so the temperature rise is smaller than it should be for the energy you count, and c = E/(mΔθ) comes out larger.'] }]
  ],
  m: [
    ['Using E = mcΔθ during a change of state.', 'While melting or boiling, the temperature does not change: use E = mL.'],
    ['Forgetting to convert kJ or grams.', 'Use joules and kilograms with c in J/(kg °C).'],
    ['Using the final temperature instead of the change.', 'Δθ is the change in temperature: final minus initial.']
  ]
});

WL.gd('gcse-heat-transfer', {
  h: 'A metal spoon in hot tea soon burns your fingers, a radiator warms the far side of a room, and the Sun warms your face across 150 million km of empty space. These are the three routes for thermal energy: conduction, convection and radiation.',
  s: [
    ['Conduction: passed from particle to particle', [
      'Heat one end of a rod and the other end eventually warms. In every solid, hotter particles vibrate more and pass the vibrations on to their neighbours through the bonds between them.',
      'Metals are good conductors because they also have **free electrons** that move fast through the whole metal and carry energy quickly. Wood, plastic, glass and especially air are poor conductors: **insulators**.'
    ], { n: 0, c: ['A metal bench and a wooden bench are both at 5 °C. Why does the metal one feel colder to sit on?', 'Metal conducts energy away from your body much faster, so your skin cools faster, even though both benches are at the same temperature.'] }],
    ['Convection: carried by moving fluid', [
      'Convection happens only in fluids (liquids and gases). Heated fluid expands, becomes less dense and rises; cooler, denser fluid sinks to take its place, forming a circulating **convection current**.',
      'A room heater warms the air near it, which rises to the ceiling, spreads, cools and sinks on the far side. A freezer compartment sits at the top of a fridge so that cold air sinks through the cabinet.'
    ], { n: 1, c: ['Why is the heating element of an electric kettle at the bottom?', 'Water heated at the bottom rises and cooler water sinks to replace it, so convection currents heat all the water. Heated at the top, the hot water would just stay there.'] }],
    ['Radiation: infrared waves', [
      'All objects emit **infrared radiation**, and hotter objects emit more. Radiation is an electromagnetic wave, so it crosses a vacuum: that is how the Sun’s energy reaches the Earth.',
      'Dull, matt black surfaces are the best absorbers and emitters of infrared; shiny, light-coloured surfaces are the poorest absorbers and emitters, because they reflect it.'
    ], { n: 2, c: ['Two identical cans of hot water, one matt black and one shiny silver, are left to cool. Which cools faster?', 'The matt black one: it emits infrared radiation faster.'] }],
    ['Energy balance and the Earth’s temperature', [
      'An object warms up if it absorbs radiation faster than it emits it, and cools if it emits faster. Its temperature stays constant when the two rates are equal.',
      'The Earth absorbs sunlight and emits infrared to space. Greenhouse gases absorb part of the outgoing infrared and send some back down, so the surface must warm until it emits enough to restore the balance.'
    ], { n: 3, c: ['If the Sun suddenly gave out 1% more energy, what would happen to the Earth’s temperature?', 'It would rise until the Earth emitted 1% more infrared, so that energy in and energy out balanced again.'] }],
    ['Everyday consequences', [
      'Houses lose heat through walls, roofs, windows and draughts. Cavity-wall insulation and loft insulation trap air in small pockets so it cannot convect; double glazing traps a thin layer of air or gas between two panes; draught excluders stop warm air escaping.',
      'A vacuum flask fights all three routes: the vacuum stops conduction and convection, and silvered walls reflect infrared.'
    ], { n: 4, c: ['Why does a vacuum flask keep cold drinks cold as well as hot drinks hot?', 'It slows energy transfer in either direction; it does not care which way the energy is flowing.'] }]
  ],
  m: [
    ['Saying heat rises.', 'Hot fluid rises because it is less dense; energy itself can move any way.'],
    ['Saying radiation needs a material.', 'Infrared is an electromagnetic wave and crosses empty space.'],
    ['Thinking cold flows into a room.', 'Energy flows out from the warm room; the room feels cold because it loses energy.']
  ]
});

WL.gd('gcse-waves', {
  h: 'In a ripple tank, waves bounce off walls, bend as the water gets shallower, and spread out round obstacles. Every wave, from ripples to radio, behaves in these same ways, and one equation, v = fλ, links its speed, frequency and wavelength.',
  s: [
    ['Describing a wave', [
      'The **amplitude** is the biggest displacement from the rest position. The **wavelength** λ is the length of one complete wave, crest to crest. The **frequency** f is the number of waves passing a point each second, in hertz (Hz), and the **period** T = 1/f is the time for one wave.',
      'A wave carries energy without carrying matter: the water in a ripple only bobs up and down while the ripple travels on.'
    ], { n: 0, c: ['A wave has a period of 0.25 s. What is its frequency?', 'f = 1 ÷ T = 1 ÷ 0.25 = 4.0 Hz.'] }],
    ['The wave equation', [
      'In one period T the wave moves forward one wavelength λ, so its speed is λ ÷ T, which is fλ. The speed is usually set by the medium; the frequency is set by the source.'
    ], { n: 1, e: 'v = f\\,\\lambda', x: ['Ripples in a tank have a wavelength of 2.0 cm and a frequency of 15 Hz. How fast do they travel?', ['Convert: λ = 0.020 m.', 'v = f × λ = 15 × 0.020 = 0.30 m/s.'], '0.30 m/s'], c: ['A mobile phone signal travels at 3.0 × 10⁸ m/s with a frequency of 900 MHz. What is its wavelength?', 'λ = v ÷ f = 3.0 × 10⁸ ÷ 9.0 × 10⁸ = 0.33 m.'] }],
    ['Transverse and longitudinal', [
      'In a **transverse** wave the oscillations are at right angles to the direction of travel: light and all electromagnetic waves, ripples on water, waves on a rope, seismic S-waves.',
      'In a **longitudinal** wave the oscillations are along the direction of travel, making compressions and rarefactions: sound, and seismic P-waves.'
    ], { n: 2, c: ['Is a seismic P-wave transverse or longitudinal, and what does that let it pass through?', 'Longitudinal. Like sound, it can travel through solids and liquids, including the Earth’s liquid outer core; transverse S-waves cannot cross liquids.'] }],
    ['Reflection, refraction and diffraction', [
      'Waves **reflect** from a barrier at the same angle they arrive. Waves passing into shallower water slow down; their frequency cannot change, so their wavelength shortens, and if they meet the boundary at an angle their direction changes: **refraction**.',
      'Waves also spread out after passing through a gap or round an edge: **diffraction**.'
    ], { n: 3, x: ['Ripples of frequency 15 Hz travel at 0.30 m/s in deep water and 0.20 m/s in shallow water. What happens to their wavelength?', ['Deep: λ = v ÷ f = 0.30 ÷ 15 = 0.020 m = 2.0 cm.', 'Shallow: λ = 0.20 ÷ 15 = 0.013 m = 1.3 cm.', 'The frequency stays 15 Hz, set by the source.'], 'It shortens from 2.0 cm to 1.3 cm'], c: ['When a wave slows down at a boundary, which of speed, frequency and wavelength stays the same?', 'The frequency: the source makes the same number of waves per second, so the same number must cross the boundary each second.'] }],
    ['Why the size of the gap matters', [
      'Diffraction is strongest when the gap is about the same size as the wavelength. Sound has wavelengths of about a metre, similar to a doorway, so you hear people round corners.',
      'Light has wavelengths of about half a millionth of a metre, so it hardly diffracts at a doorway and you cannot see round it. Long-wave radio, with wavelengths over a kilometre, bends round hills.'
    ], { n: 4, c: ['Why can you hear a band behind a wall but not see it?', 'Sound’s wavelength is similar to the size of gaps and obstacles, so it diffracts round them; light’s wavelength is far too small to bend noticeably.'] }]
  ],
  m: [
    ['Thinking the frequency changes when a wave slows down.', 'The frequency is set by the source; the wavelength changes instead.'],
    ['Forgetting unit prefixes.', 'Convert kHz, MHz and cm before using v = fλ.'],
    ['Mixing up amplitude and wavelength.', 'Amplitude is up and down from the rest line; wavelength is along the wave.']
  ]
});

WL.gd('gcse-reflection-refraction', {
  h: 'A straw in a glass of water looks bent, a diamond sparkles far more than glass, and the internet reaches you as flashes of light trapped inside glass fibres. All three come from what light does at a boundary: it reflects, it bends, and beyond a critical angle it cannot get out at all.',
  s: [
    ['Reflection', [
      'Angles are measured from the **normal**, a line at right angles to the surface. The law of reflection: the angle of incidence equals the angle of reflection.',
      'The image in a plane mirror is the same size as the object, upright, as far behind the mirror as the object is in front, and laterally inverted (left and right swapped). It is **virtual**: it cannot be caught on a screen.'
    ], { n: 0, c: ['A ray hits a mirror at 30° to the surface. What is the angle of reflection?', '60°: the angle of incidence measured from the normal is 90° − 30° = 60°, and r = i.'] }],
    ['Refraction: light changes speed and bends', [
      'Light slows down when it passes from air into glass or water. If it arrives at an angle, it bends towards the normal; leaving the glass it speeds up and bends away from the normal. A ray along the normal goes straight through.',
      'The **refractive index** n measures how strongly a material bends light: n = sin i ÷ sin r, and it also tells you how much the light slows: n = c ÷ v. Glass is about 1.5, water 1.33 and diamond 2.42.'
    ], { n: 1, e: 'n = \\frac{\\sin i}{\\sin r} = \\frac{c}{v}', x: ['Light enters water (n = 1.33) at an angle of incidence of 50°. Find the angle of refraction.', ['sin r = sin i ÷ n = sin 50° ÷ 1.33 = 0.766 ÷ 1.33 = 0.576.', 'r = sin⁻¹ 0.576 = 35°.'], '35°, bent towards the normal'], c: ['How fast does light travel in glass of refractive index 1.5? (c = 3.0 × 10⁸ m/s)', 'v = c ÷ n = 3.0 × 10⁸ ÷ 1.5 = 2.0 × 10⁸ m/s.'] }],
    ['The critical angle and total internal reflection', [
      'Light going from glass to air bends away from the normal. As the angle inside the glass increases, the ray that escapes bends ever closer to the surface; at the **critical angle** c it skims along the surface. Beyond c no light escapes: all of it reflects back inside. This is **total internal reflection**.',
      'It needs two conditions: the light must travel from the denser material towards the less dense one, and it must hit the boundary at more than the critical angle.'
    ], { n: 2, e: '\\sin c = \\frac{1}{n}', x: ['Find the critical angle for glass (n = 1.5) and for diamond (n = 2.42).', ['Glass: sin c = 1 ÷ 1.5 = 0.667, so c = 42°.', 'Diamond: sin c = 1 ÷ 2.42 = 0.413, so c = 24°.'], '42° for glass; 24° for diamond'], c: ['Why does a diamond sparkle more than a glass copy?', 'Its critical angle is much smaller, so light inside it is totally reflected far more often before it escapes, bouncing around and coming out in bright flashes.'] }],
    ['Optical fibres', [
      'An optical fibre is a thin glass core surrounded by cladding of slightly lower refractive index. Light entering one end hits the boundary at more than the critical angle every time, so it is trapped and follows the fibre round gentle bends.',
      'Fibres carry telephone and internet signals as pulses of infrared light, and doctors use bundles of them in endoscopes to see inside the body.'
    ], { n: 3, c: ['Why must an optical fibre not be bent too sharply?', 'At a sharp bend the light meets the boundary at less than the critical angle, so some of it escapes instead of being totally reflected.'] }]
  ],
  m: [
    ['Measuring angles from the surface instead of the normal.', 'Always measure i and r from the normal.'],
    ['Expecting total internal reflection going into glass.', 'It only happens going from the denser material out towards the less dense one.'],
    ['Using sin r ÷ sin i.', 'n = sin i ÷ sin r for light going from air into the material; n is always bigger than 1.']
  ]
});
WL.gd('gcse-lenses', {
  h: 'A magnifying glass makes an ant look huge, the same kind of lens in a camera makes a whole street fit on a tiny sensor, and a different shape of lens lets a short-sighted person read a distant sign. Lenses bend light by refraction, and three simple rays are enough to find any image they make.',
  s: [
    ['Focus and focal length', [
      'Rays parallel to the **principal axis** (the line through the centre of the lens, at right angles to it) pass through a **converging** (convex) lens and meet at one point: the **principal focus** F. The distance from the centre of the lens to F is the **focal length** f.',
      'A fatter, more curved lens has a shorter focal length: it is more powerful. A **diverging** (concave) lens spreads parallel rays apart, as if they came from a focus on the same side as the light arrives.'
    ], { n: 0, e: 'P = \\frac{1}{f}\\quad(f\\ \\text{in metres, }P\\ \\text{in dioptres})', c: ['A lens has a focal length of 25 cm. What is its power?', 'P = 1 ÷ f = 1 ÷ 0.25 m = 4 dioptres (D).'] }],
    ['Drawing ray diagrams', [
      'Draw rays from the top of the object. Where they cross after the lens, the top of the image forms. Any two of these three rays are enough: a ray parallel to the axis bends through the far focus; a ray through the centre of the lens goes straight on; a ray through the near focus comes out parallel to the axis.',
      'For a diverging lens, the parallel ray bends outwards as if it came from the near focus, and the central ray again goes straight through.'
    ], { n: 1, x: ['An object stands 30 cm from a converging lens of focal length 10 cm. Where is the image, and how big compared with the object? (Use 1/f = 1/u + 1/v.)', ['1/v = 1/f − 1/u = 1/10 − 1/30 = 3/30 − 1/30 = 2/30.', 'v = 15 cm, on the far side of the lens.', 'Magnification = v ÷ u = 15 ÷ 30 = 0.5.'], 'A real, upside-down image 15 cm behind the lens, half the size of the object'], c: ['Which of the three rays is easiest to draw, and why?', 'The ray through the centre of the lens, because it goes straight on without bending.'] }],
    ['Real and virtual images', [
      'A **real** image forms where light rays actually meet; it can be caught on a screen and is upside down. A **virtual** image forms where rays only seem to come from; it cannot be caught on a screen.',
      'For a converging lens: an object beyond 2F gives a smaller real image (camera, eye); at 2F, the same size; between F and 2F, a larger real image (projector). Inside F, there is no real image at all.'
    ], { n: 2, c: ['A projector must throw a large image onto a screen. Where should the slide be, relative to the lens?', 'Between F and 2F, close to F: that gives a real, magnified image far away on the screen (the slide is put in upside down so the picture comes out the right way up).'] }],
    ['The magnifying glass', [
      'Put the object closer to a converging lens than its focal length. The rays leave the lens still spreading, and your eye traces them back to a **virtual**, upright, magnified image on the same side as the object.',
      'Magnification = image height ÷ object height.'
    ], { n: 3, e: '\\text{magnification} = \\frac{\\text{image height}}{\\text{object height}}', x: ['Through a magnifying glass, a 2.0 mm long ant appears 6.0 mm long. What is the magnification?', ['Magnification = image height ÷ object height.', '= 6.0 ÷ 2.0 = 3.'], '3 (it has no unit)'], c: ['Can the image from a magnifying glass be projected onto a screen?', 'No: it is virtual. No light actually comes from where the image appears.'] }],
    ['Correcting eyesight', [
      'A **short-sighted** eye focuses distant objects in front of the retina, because the eye is too strong for its length. A diverging lens spreads the rays a little first, moving the focus back onto the retina.',
      'A **long-sighted** eye cannot bend light from nearby objects enough, so it would focus behind the retina. A converging lens adds extra bending.'
    ], { n: 4, c: ['A pair of glasses has lenses of power −2 D. Is the wearer short- or long-sighted?', 'Short-sighted: a negative power means a diverging lens.'] }]
  ],
  m: [
    ['Drawing rays bending inside the lens.', 'In ray diagrams for thin lenses, draw the bend at the centre line of the lens.'],
    ['Calling every image upside down.', 'Real images from one lens are inverted; the virtual image of a magnifying glass is upright.'],
    ['Using centimetres for the power.', 'Power in dioptres needs the focal length in metres.']
  ]
});

WL.gd('gcse-em-spectrum', {
  h: 'Your phone, your microwave oven, the light from a lamp and an X-ray at the hospital all use the same kind of wave. Electromagnetic waves differ only in wavelength, and when light changes speed at a boundary it changes direction, which explains lenses, rainbows and optical fibres.',
  s: [
    ['One family of waves', [
      'Electromagnetic waves are transverse waves of electric and magnetic fields. They need no medium and all travel at c = 3.0 × 10⁸ m/s in a vacuum.',
      'In order of decreasing wavelength: radio (metres to kilometres), microwaves (centimetres), infrared (micrometres), visible light (about 400 to 700 nm, violet to red), ultraviolet, X-rays and gamma rays. Since v = fλ, shorter wavelength means higher frequency, and more energy carried by each photon.'
    ], { n: 0, e: 'c = f\\,\\lambda', x: ['Green light has a wavelength of 500 nm. What is its frequency? And what is the wavelength of a microwave oven’s 2.45 GHz waves?', ['500 nm = 500 × 10⁻⁹ m = 5.0 × 10⁻⁷ m.', 'f = c ÷ λ = 3.0 × 10⁸ ÷ 5.0 × 10⁻⁷ = 6.0 × 10¹⁴ Hz.', 'Microwaves: λ = c ÷ f = 3.0 × 10⁸ ÷ 2.45 × 10⁹ = 0.12 m.'], '6.0 × 10¹⁴ Hz; about 12 cm'], c: ['Which travels faster in a vacuum, X-rays or radio waves?', 'Neither: all electromagnetic waves travel at the same speed in a vacuum.'] }],
    ['Uses and dangers', [
      'Radio waves carry broadcasts; microwaves carry mobile signals and heat food; infrared is used in remote controls and thermal cameras; visible light in fibre optics; ultraviolet in sterilising water; X-rays in medical imaging; gamma rays to sterilise equipment and treat cancer.',
      'The danger rises with frequency. Microwaves and infrared heat tissue; ultraviolet damages skin cells and eyes; X-rays and gamma rays are **ionising**, able to damage DNA and cause cancer.'
    ], { n: 1, c: ['Why do radiographers stand behind a screen when taking X-rays, while the patient does not?', 'Each X-ray dose is small, but the radiographer would receive one every time; the screen keeps their total dose low.'] }],
    ['Refraction: light changes speed', [
      'Light travels more slowly in glass or water than in a vacuum. The **refractive index** n says how much slower: v = c/n. Glass is about 1.5, water 1.33, diamond 2.42.',
      'At the boundary the frequency cannot change, because each crest arriving makes one crest leaving. So the wavelength shrinks by the factor n. Colour is set by frequency, so the colour does not change.'
    ], { n: 2, e: 'v = \\frac{c}{n}', x: ['Red light of wavelength 700 nm enters glass with n = 1.5. What are its speed, wavelength and frequency inside the glass?', ['Speed: v = c ÷ n = 3.0 × 10⁸ ÷ 1.5 = 2.0 × 10⁸ m/s.', 'Wavelength: 700 ÷ 1.5 = 467 nm.', 'Frequency (unchanged): f = c ÷ λ in air = 3.0 × 10⁸ ÷ 7.0 × 10⁻⁷ = 4.3 × 10¹⁴ Hz.'], '2.0 × 10⁸ m/s; 467 nm; 4.3 × 10¹⁴ Hz'], c: ['Does red light turn a different colour inside glass, since its wavelength changes?', 'No: colour depends on frequency, which stays the same.'] }],
    ['Why the ray bends: Snell’s law', [
      'Follow a straight wavefront hitting glass at an angle. The end that reaches the glass first slows down while the other end is still in air, so the wavefront swings round, like a line of marching soldiers stepping onto mud.',
      'The geometry gives **Snell’s law**: entering a slower material, the ray bends towards the normal.'
    ], { n: 3, e: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2', x: ['Light passes from water (n = 1.33) into glass (n = 1.5), meeting the boundary at 40° to the normal. At what angle does it continue?', ['n₁ sin θ₁ = n₂ sin θ₂, so sin θ₂ = 1.33 × sin 40° ÷ 1.5.', '= 1.33 × 0.643 ÷ 1.5 = 0.570.', 'θ₂ = 35°.'], '35°, bent slightly towards the normal'], c: ['A ray goes from glass into air. Does it bend towards or away from the normal?', 'Away: it speeds up as it enters the air.'] }],
    ['Total internal reflection and dispersion', [
      'Going from glass into air, the ray bends away from the normal. At the critical angle the ray would skim along the surface; beyond it no light escapes and all of it reflects. Optical fibres trap light this way over kilometres.',
      'The refractive index is slightly different for each colour, higher for violet than for red, so a prism or a raindrop spreads white light into a spectrum: **dispersion**.'
    ], { n: 4, e: '\\sin\\theta_c = \\frac{1}{n}', c: ['Why does violet light bend more than red light in a prism?', 'Glass has a slightly higher refractive index for violet, so violet slows more and bends more.'] }]
  ],
  m: [
    ['Thinking higher-frequency waves travel faster.', 'All electromagnetic waves travel at c in a vacuum.'],
    ['Changing the frequency at a boundary.', 'The frequency stays the same; the speed and wavelength change.'],
    ['Calling all radiation dangerous in the same way.', 'Only ultraviolet (partly), X-rays and gamma rays are ionising.']
  ]
});

WL.gd('gcse-sound', {
  h: 'Thunder arrives seconds after the lightning, a ship can map the sea floor without touching it, and doctors can watch an unborn baby move without a single X-ray. Sound is a longitudinal wave, and its echoes, including ultrasound too high for us to hear, let us measure and see.',
  s: [
    ['Compressions and rarefactions', [
      'A loudspeaker cone moving forward squashes the air in front of it, making a **compression**; moving back, it leaves a region of lower pressure, a **rarefaction**. These pass from particle to particle away from the source.',
      'Each air particle only oscillates back and forth along the direction of travel: sound is **longitudinal**. With no particles there is nothing to pass the vibration on, so sound cannot cross a vacuum.'
    ], { n: 0, c: ['Do the air particles near a loudspeaker travel across the room to your ear?', 'No: each particle only moves back and forth a tiny distance; the compressions and rarefactions travel.'] }],
    ['The speed of sound', [
      'In air sound travels at about 330 to 350 m/s, depending on the temperature. It is faster in liquids (about 1500 m/s in water) and faster still in solids (about 5000 m/s in steel), because the particles are linked more stiffly.',
      'To measure it in air, stand a long way from someone who makes a loud bang with a visible action, and time from seeing it to hearing it.'
    ], { n: 1, x: ['You stand 200 m from a friend who bangs two wooden blocks together. You time 0.59 s between seeing the bang and hearing it. What is the speed of sound?', ['The light arrives almost instantly, so 0.59 s is the sound’s travel time.', 'v = d ÷ t = 200 ÷ 0.59 = 339 m/s.'], 'about 340 m/s'], c: ['Why is it better to measure over 200 m than over 20 m?', 'Your reaction time of about 0.2 s would be most of the 0.06 s travel time over 20 m, but only a third of the 0.6 s over 200 m (and repeating and averaging helps further).'] }],
    ['Pitch, loudness and the range of hearing', [
      'A higher frequency means a higher pitch; a bigger amplitude means a louder sound. Young people hear roughly 20 Hz to 20 000 Hz, and the upper limit falls with age.',
      'Like all waves, sound obeys v = fλ, so the wavelengths we hear span from about 17 m (at 20 Hz) down to about 1.7 cm (at 20 000 Hz).'
    ], { n: 2, e: 'v = f\\,\\lambda', c: ['What is the wavelength in air of a 440 Hz note? (v = 340 m/s)', 'λ = v ÷ f = 340 ÷ 440 = 0.77 m.'] }],
    ['Echoes', [
      'An echo is reflected sound. The sound goes to the reflector and back, so the distance to it is half of speed × time.',
      'Soft furnishings absorb sound and reduce echoes; hard, smooth walls reflect well, which is why an empty room sounds so loud.'
    ], { n: 3, e: 'd = \\frac{v\\,t}{2}', x: ['A ship’s sonar pulse returns from a shoal of fish 0.40 s after it is sent. Sound travels at 1500 m/s in sea water. How deep are the fish?', ['The pulse travels down and back up.', 'd = v × t ÷ 2 = 1500 × 0.40 ÷ 2 = 300 m.'], '300 m'], c: ['A bat hears its echo from a moth 0.010 s after its squeak. How far away is the moth? (v = 340 m/s)', 'd = 340 × 0.010 ÷ 2 = 1.7 m.'] }],
    ['Ultrasound', [
      '**Ultrasound** is sound above 20 kHz. Its short wavelength gives fine detail. Ships use it in sonar to find the depth of the sea and shoals of fish; engineers use it to find hidden cracks in metal.',
      'Doctors send pulses into the body; echoes from each boundary between tissues build up the picture, without the ionising radiation of X-rays, which is why it is safe for scanning unborn babies.'
    ], { n: 4, x: ['A medical scanner uses 2.0 MHz ultrasound. Sound travels at 1500 m/s in soft tissue. What is the wavelength, and how long does an echo take to return from a boundary 6.0 cm deep?', ['λ = v ÷ f = 1500 ÷ 2 000 000 = 0.00075 m = 0.75 mm.', 'There and back: t = 2 × 0.060 ÷ 1500 = 0.000080 s.'], '0.75 mm; 80 microseconds'], c: ['Why is ultrasound, not X-rays, used to check on an unborn baby?', 'Ultrasound is not ionising, so it does not damage the baby’s cells.'] }]
  ],
  m: [
    ['Forgetting to halve for an echo.', 'The sound covers the distance twice: there and back.'],
    ['Saying sound is a transverse wave.', 'Sound is longitudinal: the particles move along the direction of travel.'],
    ['Thinking ultrasound is louder sound.', 'Ultrasound is higher frequency, above human hearing; loudness is about amplitude.']
  ]
});

WL.gd('gcse-magnetism', {
  h: 'Inside every electric motor, from a phone’s vibrator to a train, a wire carrying a current sits in a magnetic field and is pushed sideways. That push, F = BIL, is the motor effect, and it also drives loudspeakers.',
  s: [
    ['Magnetic fields, including those made by currents', [
      'A **magnetic field** is the region where a magnet or a moving charge feels a force. Field lines run from north to south outside a magnet; where they crowd together the field is stronger. Field strength is measured in **tesla** (T): the Earth’s field is about 50 μT, a fridge magnet a few mT, a hospital MRI scanner 1.5 to 3 T.',
      'A current makes its own field: circles round a straight wire, and a field like a bar magnet’s from a coil.'
    ], { n: 0, c: ['How does the field round a straight wire change if the current is reversed?', 'The circles stay the same shape but point the other way round.'] }],
    ['A current in a field feels a force', [
      'Charges moving across a magnetic field are pushed sideways. In a wire, the current is many charges drifting along, so the whole wire is pushed. The force is F = BIL: field strength × current × the length of wire in the field.',
      'The force is biggest when the wire is at right angles to the field, and zero when it runs along the field.'
    ], { n: 1, e: 'F = B\\,I\\,L', x: ['A 5.0 cm length of wire carries 3.0 A at right angles to a 0.20 T field. What force acts on it?', ['Convert: L = 0.050 m.', 'F = B × I × L = 0.20 × 3.0 × 0.050.', '= 0.030 N.'], '0.030 N'], c: ['The wire is turned so that it lies along the field lines. What is the force now?', 'Zero: only a wire crossing the field feels a force.'] }],
    ['Which way: Fleming’s left-hand rule', [
      'Hold the thumb, first finger and second finger of your left hand at right angles to each other. **F**irst finger = **F**ield (north to south), se**C**ond finger = **C**urrent (positive to negative), thu**M**b = **M**otion (the force).',
      'Reverse either the current or the field and the force reverses; reverse both and it stays the same.'
    ], { n: 2, c: ['A wire’s current and the magnet’s field are both reversed. Which way does the force point now?', 'The same way as before: each reversal flips it, so two reversals cancel.'] }],
    ['The tesla', [
      'Rearranging F = BIL gives B = F ÷ (IL): a field of one tesla pushes with one newton on each metre of wire carrying one ampere. The tesla is a big unit, which is why everyday fields are quoted in mT and μT.'
    ], { n: 3, x: ['A 0.10 m wire carrying 2.0 A at right angles to a field feels a force of 0.016 N. What is the field strength?', ['B = F ÷ (I × L) = 0.016 ÷ (2.0 × 0.10).', '= 0.080 T.'], '0.080 T (80 mT)'], c: ['How could you double the force on a wire without changing the magnet?', 'Double the current, or double the length of wire in the field.'] }],
    ['How a motor works', [
      'Put a rectangular coil in a field. The current goes one way along one side and the other way along the opposite side, so the forces on those sides point opposite ways: a turning effect.',
      'A **split-ring commutator** reverses the current every half turn, so the coil keeps turning the same way. Make it turn harder with more current, a stronger magnet or more turns of wire.'
    ], { n: 4, c: ['What would happen to a motor’s coil without the commutator?', 'It would turn half a turn, then the forces would push it back, so it would rock to and fro instead of spinning.'] }],
    ['Loudspeakers', [
      'In a loudspeaker, a coil sits in the field of a permanent magnet. The audio signal is an alternating current, so the force on the coil changes direction in time with the music, pushing the cone back and forth to make sound waves.'
    ], { n: 5, c: ['What sets the pitch of the note a loudspeaker plays?', 'The frequency of the alternating current, which sets how many times per second the cone moves back and forth.'] }]
  ],
  m: [
    ['Using the right hand for the motor effect.', 'Fleming’s left-hand rule is for motors (force on a current).'],
    ['Leaving the length in centimetres.', 'Use metres in F = BIL.'],
    ['Thinking a wire along the field feels a force.', 'Only the part of the field across the wire pushes it.']
  ]
});

WL.gd('gcse-static', {
  h: 'Rub a balloon on your hair and it sticks to the wall; touch a car door on a dry day and you get a small shock. Rubbing moves electrons from one material to another, and around every charge is an electric field where other charges feel a force.',
  s: [
    ['Two kinds of charge', [
      'There are two kinds of electric charge, positive and negative. Like charges repel; unlike charges attract. Atoms contain positive protons in the nucleus and negative electrons around it; normally the numbers are equal and the atom is neutral.',
      'Charge is measured in coulombs (C). One electron carries −1.6 × 10⁻¹⁹ C, so a coulomb is a huge amount of static charge: everyday static charges are a few nanocoulombs (nC, 10⁻⁹ C).'
    ], { n: 0, e: 'Q = n\\,e', x: ['A plastic sphere carries a charge of −4.8 nC. How many extra electrons does it have?', ['Q = 4.8 × 10⁻⁹ C, and each electron carries 1.6 × 10⁻¹⁹ C.', 'n = Q ÷ e = 4.8 × 10⁻⁹ ÷ 1.6 × 10⁻¹⁹ = 3.0 × 10¹⁰.'], '30 billion extra electrons'], c: ['A neutral atom loses an electron. What is its charge now?', 'Positive, +1.6 × 10⁻¹⁹ C: it has one more proton than electrons.'] }],
    ['Charging by friction moves electrons', [
      'When two insulators are rubbed together, electrons move from one surface to the other. Only electrons move; the positive charges are locked in the nuclei.',
      'A polythene rod rubbed with a cloth gains electrons and becomes negative, while the cloth is left equally positive. An acetate rod loses electrons to the cloth and becomes positive. Charge is never created, only moved.'
    ], { n: 1, c: ['A polythene rod gains a charge of −20 nC when rubbed with a cloth. What is the charge on the cloth?', '+20 nC: the electrons the rod gained came from the cloth.'] }],
    ['Conductors and insulators', [
      'In metals some electrons are free to move through the material, so charge flows easily: metals are **conductors**. In insulators such as plastic, rubber and glass, the electrons are bound to their atoms, so charge stays where it is put.',
      'That is why you can charge a plastic rod by rubbing it, but not a metal rod held in your hand: charge on the metal flows away through you.'
    ], { n: 2, c: ['Why do fuel tankers connect a metal cable to the ground before pumping fuel?', 'Any charge that builds up by friction flows away safely to earth through the conductor, instead of making a spark that could ignite the fuel.'] }],
    ['Electric fields', [
      'An **electric field** is a region in which a charge feels a force. The direction of the field is the direction of the force on a small positive charge. Field lines start on positive charges and end on negative charges; where they are closer together, the field is stronger.',
      'Between two parallel plates the field is uniform: equally strong everywhere between them, with strength E = V ÷ d.'
    ], { n: 3, e: 'E = \\frac{V}{d}', x: ['Two parallel plates 2.0 cm apart have 400 V between them. What is the field strength, and the force on an electron between them?', ['E = V ÷ d = 400 ÷ 0.020 = 20 000 V/m (or N/C).', 'F = e × E = 1.6 × 10⁻¹⁹ × 20 000 = 3.2 × 10⁻¹⁵ N, towards the positive plate.'], '20 000 V/m; 3.2 × 10⁻¹⁵ N'], c: ['Which way do the field lines point around a negative charge?', 'Inwards, towards the charge: a positive test charge would be pulled towards it.'] }],
    ['Static at work and as a danger', [
      'Static charge is useful in photocopiers and laser printers (charged drums pick up toner), in spray painting (charged paint droplets spread out and wrap round the object) and in electrostatic smoke precipitators.',
      'It is dangerous where sparks could ignite fuel or flour dust, which is why refuelling aircraft and tankers are earthed first.'
    ], { n: 4, c: ['Why does charging paint droplets give a smoother coat?', 'Like charges repel, so the droplets spread out evenly, and they are attracted to the oppositely charged object, even round its back.'] }]
  ],
  m: [
    ['Saying positive charges move when objects are rubbed.', 'Only electrons move; a positive object has lost electrons.'],
    ['Drawing field lines from negative to positive.', 'They go from positive to negative, the way a positive charge would be pushed.'],
    ['Forgetting nano means 10⁻⁹.', '1 nC = 1 × 10⁻⁹ C; convert before dividing by e.']
  ]
});
WL.gd('gcse-current-pd', {
  h: 'A phone battery is labelled 3.7 V and its charger 2.0 A. What do those numbers actually measure? Current counts how much charge flows past each second; voltage measures how much energy each bit of charge carries. Once you see volts as joules per coulomb, circuits become energy bookkeeping.',
  s: [
    ['Current: coulombs per second', [
      '**Current** is the rate of flow of charge. One ampere is one coulomb per second. In metal wires the moving charges are free electrons, drifting from the negative terminal round to the positive.',
      'By an old convention, current is drawn flowing the other way, from + to −. This **conventional current** was chosen before electrons were discovered, and it is still used on every circuit diagram.'
    ], { n: 0, e: 'I = \\frac{Q}{t}', x: ['A charger supplies a current of 2.0 A for 1.5 hours. How much charge flows? How many electrons pass each second?', ['1.5 hours = 1.5 × 3600 = 5400 s.', 'Q = I × t = 2.0 × 5400 = 10 800 C.', 'Each second 2.0 C passes; one electron carries 1.6 × 10⁻¹⁹ C, so 2.0 ÷ 1.6 × 10⁻¹⁹ = 1.25 × 10¹⁹ electrons per second.'], '10 800 C; about 1.3 × 10¹⁹ electrons every second'], c: ['In which direction do the electrons actually move in a wire: from + to − or from − to +?', 'From − to +, the opposite way to conventional current.'] }],
    ['Measuring current', [
      'An **ammeter** measures current. It goes in series, in the loop itself, so that the current flows through it. A good ammeter has a very low resistance, so it barely changes the current it measures.'
    ], { n: 1, c: ['What would go wrong if you connected an ammeter in parallel across a lamp?', 'Its very low resistance would offer an easy path, so a large current would flow through the meter instead of the lamp, and it could be damaged.'] }],
    ['Direct and alternating current', [
      '**Direct current** (d.c.) flows one way only, like the current from a cell. **Alternating current** (a.c.) repeatedly reverses direction; mains electricity in the UK reverses 50 times a second, a frequency of 50 Hz.'
    ], { n: 2, c: ['How long does one complete cycle of 50 Hz mains last?', '1 ÷ 50 = 0.02 s.'] }],
    ['e.m.f. and potential difference: joules per coulomb', [
      'The **electromotive force** (e.m.f.) of a source is the energy it gives each coulomb of charge that it drives round a complete circuit. A 1.5 V cell gives 1.5 J to every coulomb.',
      'The **potential difference** (p.d.) across a component is the energy each coulomb transfers to it as it passes through. Round a series circuit, the p.d.s add up to the e.m.f.: every joule given out by the cell is handed over somewhere.'
    ], { n: 3, e: '\\mathcal{E} = \\frac{W}{Q}\\qquad V = \\frac{W}{Q}', x: ['A 9.0 V battery drives 30 C round a circuit containing a lamp and a resistor. The lamp transfers 180 J. What is the p.d. across the lamp, and across the resistor?', ['Energy given by the battery = Q × e.m.f. = 30 × 9.0 = 270 J.', 'p.d. across the lamp = W ÷ Q = 180 ÷ 30 = 6.0 V.', 'The resistor gets the rest: 270 − 180 = 90 J, so 90 ÷ 30 = 3.0 V.'], '6.0 V across the lamp and 3.0 V across the resistor, adding up to 9.0 V'], c: ['How is a voltmeter connected, and why?', 'In parallel, across the component, because it measures the difference in energy per coulomb between two points.'] }],
    ['How fast does electricity travel?', [
      'The electrons themselves drift very slowly, typically a fraction of a millimetre per second in a household wire. Yet a lamp lights the instant you press the switch, because the wire is already full of electrons: the push that sets them all moving travels along the wire at a large fraction of the speed of light.'
    ], { n: 4, c: ['If electrons drift so slowly, why does a lamp light almost instantly?', 'The wire is already full of free electrons; when the switch closes, all of them start moving together, like water in a full hose.'] }]
  ],
  m: [
    ['Saying current is used up.', 'The same current flows into and out of each component; energy is what is transferred.'],
    ['Confusing e.m.f. with p.d.', 'e.m.f. is energy given to each coulomb by the source; p.d. is energy each coulomb hands over in a component.'],
    ['Forgetting to convert hours or minutes.', 'Q = It needs time in seconds.']
  ]
});

WL.gd('gcse-circuits', {
  h: 'Why do old Christmas lights all go out when one bulb fails, while the lights in your house do not? Resistances in series add, because the charge has to get through each one in turn; in parallel each branch is another route, so the total resistance falls. With V = IR and those two rules you can work out any simple circuit.',
  s: [
    ['Resistance and Ohm’s law', [
      '**Resistance** is the ratio of the voltage across a component to the current through it: R = V/I, in ohms (Ω). For a metal wire at constant temperature the ratio stays the same, so a graph of current against voltage is a straight line through the origin: **Ohm’s law**.',
      'Many components are not ohmic. A filament lamp’s resistance rises as it heats up, so its graph curves; a diode lets current through only one way.'
    ], { n: 0, e: 'V = I\\,R', c: ['A resistor has 3.0 V across it and 0.15 A through it. What is its resistance?', 'R = V ÷ I = 3.0 ÷ 0.15 = 20 Ω.'] }],
    ['Series: one path, resistances add', [
      'In series there is only one route, so the same current flows through everything. The supply voltage is shared in proportion to the resistances: a resistor with twice the resistance gets twice the voltage.',
      'Adding the voltages shows that resistances in series simply add.'
    ], { n: 1, e: 'R_{\\text{series}} = R_1 + R_2 + \\cdots', x: ['Resistors of 4.0 Ω and 8.0 Ω are in series with a 6.0 V battery. Find the current and the voltage across each.', ['Total resistance = 4.0 + 8.0 = 12 Ω.', 'I = V ÷ R = 6.0 ÷ 12 = 0.50 A, the same in both.', 'V₁ = 0.50 × 4.0 = 2.0 V; V₂ = 0.50 × 8.0 = 4.0 V (they add up to 6.0 V).'], '0.50 A; 2.0 V and 4.0 V'], c: ['A third resistor is added in series. What happens to the current?', 'It falls: the total resistance is bigger, so less current flows for the same voltage.'] }],
    ['Parallel: several paths, reciprocals add', [
      'In parallel, each branch is connected across the same two points, so each has the same voltage. The current splits between the branches, with more going through the smaller resistance.',
      'Adding the branch currents shows that the reciprocals of the resistances add. The total is always less than the smallest single resistance: every extra branch is another path.'
    ], { n: 2, e: '\\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots', x: ['Resistors of 4.0 Ω and 12 Ω are in parallel across a 6.0 V supply. Find the total resistance and all the currents.', ['1/R = 1/4.0 + 1/12 = 3/12 + 1/12 = 4/12, so R = 3.0 Ω.', 'Branch currents: 6.0 ÷ 4.0 = 1.5 A and 6.0 ÷ 12 = 0.50 A.', 'Supply current = 1.5 + 0.50 = 2.0 A (check: 6.0 ÷ 3.0 = 2.0 A).'], '3.0 Ω; 1.5 A, 0.50 A and 2.0 A in total'], c: ['Two identical 10 Ω resistors are in parallel. What is their combined resistance?', '5 Ω: two equal paths halve the resistance.'] }],
    ['Power in a resistor', [
      'Power is P = VI. Combining it with V = IR gives two more forms: P = I²R, handy in series where the current is shared, and P = V²/R, handy in parallel where the voltage is shared.'
    ], { n: 3, e: 'P = VI = I^2R = \\frac{V^2}{R}', x: ['In the parallel circuit above, what power does each resistor dissipate?', ['Use P = V²/R, since both have 6.0 V across them.', '4.0 Ω: 6.0² ÷ 4.0 = 36 ÷ 4.0 = 9.0 W.', '12 Ω: 36 ÷ 12 = 3.0 W.'], '9.0 W and 3.0 W (12 W in total = 6.0 V × 2.0 A)'], c: ['In parallel, does the bigger or the smaller resistor get hotter?', 'The smaller one: with the same voltage, P = V²/R is larger when R is smaller.'] }],
    ['Potential dividers', [
      'Two resistors in series across a supply split its voltage in the ratio of their resistances. Taking the output across one of them gives a chosen fraction of the input.',
      'Replace one resistor with a thermistor or a light-dependent resistor (LDR) and the output changes with temperature or light: that is how automatic night-lights and simple thermostats work.'
    ], { n: 4, e: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2}{R_1 + R_2}', x: ['A 9.0 V supply feeds R₁ = 2.0 kΩ and R₂ = 1.0 kΩ in series. What is the output voltage across R₂?', ['V_out = 9.0 × 1.0 ÷ (2.0 + 1.0).', '= 9.0 ÷ 3 = 3.0 V.'], '3.0 V'], c: ['If R₂ is an LDR whose resistance rises in the dark, does V_out rise or fall as it gets dark?', 'It rises: R₂ takes a bigger share of the supply voltage.'] }],
    ['Mains electricity', [
      'UK mains is 230 V alternating current at 50 Hz. Appliances are wired in parallel, so each gets the full voltage and can be switched on and off on its own. The fuse, in the live wire, melts if the current is too large; the earth wire protects you if a metal case becomes live.'
    ], { n: 5, c: ['Why are household appliances not wired in series?', 'They would share the 230 V between them, and switching one off would switch all of them off.'] }]
  ],
  m: [
    ['Adding resistances in parallel.', 'In parallel the reciprocals add; the total is less than the smallest resistor.'],
    ['Forgetting to flip 1/R at the end.', 'If 1/R = 4/12, then R = 12/4 = 3 Ω, not 0.33 Ω.'],
    ['Using the supply voltage across a resistor in series.', 'In series each resistor gets only its share of the voltage.']
  ]
});

WL.gd('gcse-power-cost', {
  h: 'Why does a kettle cost more to run than a phone charger, and how does the electricity company work out your bill? Electrical power is simply current × voltage; multiply by time and you have the energy, and bills count that energy in kilowatt-hours.',
  s: [
    ['Power = current × voltage', [
      'Each coulomb passing through a component transfers V joules, and I coulombs pass each second. So the energy transferred per second, the **power**, is IV watts.'
    ], { n: 0, e: 'P = I\\,V', x: ['A hairdryer is rated 1.6 kW and runs on 230 V mains. What current does it draw?', ['I = P ÷ V = 1600 ÷ 230.', '= 6.96 A ≈ 7.0 A.'], 'about 7.0 A'], c: ['A 3.0 V torch bulb takes 0.30 A. What is its power?', 'P = IV = 0.30 × 3.0 = 0.90 W.'] }],
    ['Energy = power × time', [
      'Over a time t, the energy transferred is the power multiplied by the time. With power in watts and time in seconds, the energy comes out in joules.'
    ], { n: 1, e: 'E = Pt = IVt', c: ['How much energy does a 60 W lamp transfer in 10 minutes?', 'E = Pt = 60 × 600 = 36 000 J.'] }],
    ['The kilowatt-hour on your bill', [
      'The joule is tiny for household use, so electricity is sold in **kilowatt-hours** (kWh): the energy a 1 kW appliance transfers in 1 hour. One kWh is 1000 W × 3600 s = 3 600 000 J.',
      'To find a cost, work out the energy in kWh (power in kW × time in hours) and multiply by the price of one kWh.'
    ], { n: 2, e: '1\\ \\text{kWh} = 3.6\\times10^6\\ \\text{J}', x: ['A 2.2 kW kettle is used for 4 minutes a day for 30 days. Electricity costs 30p per kWh. What does it cost?', ['Time per day = 4 ÷ 60 = 0.0667 h, so 30 days = 2.0 h.', 'Energy = 2.2 kW × 2.0 h = 4.4 kWh.', 'Cost = 4.4 × 30p = 132p.'], '£1.32'], c: ['Which uses more energy: a 10 W LED left on for 10 hours, or a 2 kW kettle used for 3 minutes?', 'Neither: the LED uses 0.010 kW × 10 h = 0.10 kWh and the kettle 2 kW × 0.05 h = 0.10 kWh. They are exactly equal.'] }],
    ['Other forms: P = I²R and P = V²/R', [
      'Combining P = IV with V = IR gives P = I²R and P = V²/R. P = I²R is the heating in a wire: double the current and the heating goes up four times.',
      'That is why power is sent across the country at high voltage and low current, and why thick cables, with low resistance, are used for high-power appliances such as cookers.'
    ], { n: 3, e: 'P = I^2R = \\frac{V^2}{R}', x: ['A cable has a resistance of 0.20 Ω. How much power is wasted heating it when it carries 10 A? And 20 A?', ['P = I²R = 10² × 0.20 = 20 W.', 'At 20 A: 20² × 0.20 = 80 W.'], '20 W, then 80 W: four times as much for twice the current'], c: ['Why do electric showers need much thicker cables than lamps?', 'They take a large current, and the heating in a cable is I²R; a thick cable has a small R, so it stays cool enough.'] }],
    ['Reading a power rating', [
      'An appliance marked “230 V, 2.3 kW” draws 10 A when connected to 230 V mains. The rating assumes that voltage: run the same heater on a lower supply and its power falls, as V²/R if its resistance stays fixed.'
    ], { n: 4, x: ['A heater is rated 2.3 kW at 230 V. What is its resistance, and what power would it give on a 115 V supply?', ['R = V² ÷ P = 230² ÷ 2300 = 52 900 ÷ 2300 = 23 Ω.', 'On 115 V: P = V² ÷ R = 115² ÷ 23 = 13 225 ÷ 23 = 575 W.'], '23 Ω; 575 W, a quarter of the rated power'], c: ['Halving the voltage on a fixed resistor: what happens to the power?', 'It falls to a quarter, because P = V²/R.'] }]
  ],
  m: [
    ['Using watts and minutes for kWh.', 'For kWh use power in kilowatts and time in hours.'],
    ['Thinking the current is the same on any supply.', 'The rating holds only at the stated voltage.'],
    ['Forgetting to square in P = I²R.', 'Double the current gives four times the heating.']
  ]
});

WL.gd('gcse-series-parallel', {
  h: 'A torch with three cells is brighter than one with one cell, and a night-light switches itself on at dusk. Both come down to how voltage and current divide in series and in parallel, and to a simple trick, the potential divider, that turns light or temperature into a voltage.',
  s: [
    ['Series circuits', [
      'In a series circuit there is only one path, so the current is the same everywhere. The supply’s e.m.f. is shared between the components: their p.d.s add up to it.',
      'Resistances in series add, so adding components makes the total resistance bigger and the current smaller. Cells in series add their e.m.f.s, if they all face the same way.'
    ], { n: 0, x: ['Three 1.5 V cells are placed in series in a torch, all facing the same way. What is the total e.m.f.? What if one is put in backwards?', ['Facing the same way: 1.5 + 1.5 + 1.5 = 4.5 V.', 'One reversed: 1.5 + 1.5 − 1.5 = 1.5 V.'], '4.5 V; only 1.5 V with one reversed'], c: ['In a series circuit with two lamps, one lamp breaks. What happens to the other?', 'It goes out too: the only path for the current is broken.'] }],
    ['Parallel circuits', [
      'In parallel each branch is connected directly across the supply, so each gets the same p.d. The current splits at junctions: the total current entering a junction equals the total leaving it, because charge cannot pile up.',
      'Adding a branch gives the current another path, so the total resistance falls: two resistors in parallel always have less resistance than either one alone.'
    ], { n: 1, x: ['A current of 2.5 A enters a junction that splits into two branches. One branch carries 1.0 A. What does the other carry?', ['Current in = current out at a junction.', 'Other branch = 2.5 − 1.0 = 1.5 A.'], '1.5 A'], c: ['Resistors of 6.0 Ω and 3.0 Ω are in parallel. Is their combined resistance more or less than 3.0 Ω?', 'Less: 1/R = 1/6 + 1/3 = 1/2, so R = 2.0 Ω.'] }],
    ['Potential dividers', [
      'Two resistors in series across a supply share its voltage in proportion to their resistances: the bigger resistor gets the bigger share. Taking the output across one of them gives a chosen fraction of the input voltage.',
      'Replace one resistor with a variable resistor, a light-dependent resistor (LDR) or a thermistor, and the output changes with a dial, with light or with temperature.'
    ], { n: 2, e: 'V_{\\text{out}} = V_{\\text{in}}\\,\\frac{R_2}{R_1 + R_2}', x: ['An LDR has a resistance of 10 kΩ in daylight and 100 kΩ in the dark. It is in series with a fixed 10 kΩ resistor across 6.0 V, and the output is taken across the LDR. Find V_out in daylight and in the dark.', ['Daylight: V_out = 6.0 × 10 ÷ (10 + 10) = 3.0 V.', 'Dark: V_out = 6.0 × 100 ÷ (10 + 100) = 5.5 V.'], '3.0 V in daylight, 5.5 V in the dark: enough of a change to switch on a lamp'], c: ['A thermistor’s resistance falls as it warms. In a divider with the output across the thermistor, what happens to V_out on a hot day?', 'It falls, because the thermistor’s share of the supply voltage gets smaller.'] }],
    ['Diodes and LEDs', [
      'A **diode** lets current flow in one direction only and blocks it in the other. A **light-emitting diode** (LED) is a diode that glows when current flows through it the right way.',
      'Diodes turn a.c. into d.c. (rectification) and protect circuits from batteries put in backwards.'
    ], { n: 3, c: ['An LED does not light when connected to a battery. The battery is fine. What is the simplest thing to try?', 'Turn the LED round: it only conducts, and lights, in one direction.'] }],
    ['Why parallel resistance is smaller', [
      'Both branches have the same p.d. V. The total current is I = I₁ + I₂ = V/R₁ + V/R₂. Dividing by V gives 1/R = 1/R₁ + 1/R₂. More paths means more current for the same push: a smaller total resistance.'
    ], { n: 4, e: '\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_2}', c: ['Can adding a 1 MΩ resistor in parallel with a 10 Ω resistor increase the total resistance?', 'No: any extra parallel path, however poor, lets a little more current through, so the total drops slightly below 10 Ω.'] }]
  ],
  m: [
    ['Thinking current is used up along a series circuit.', 'The current is the same at every point in a series loop.'],
    ['Giving the parallel total as a sum.', 'Add the reciprocals, then flip the answer.'],
    ['Taking the output across the wrong resistor.', 'V_out uses the resistance the output is measured across, R₂, on top of the fraction.']
  ]
});

WL.gd('gcse-safety', {
  h: 'The mains supply in your walls can kill, yet you plug things in every day without a thought. That is because plugs, cables and appliances carry several layers of protection: three different wires, a fuse, an earth connection, and devices that cut the power in a fraction of a second.',
  s: [
    ['The hazards', [
      'The main dangers are electric shock (current through the body), fire from overheating cables, and sparks. Damaged insulation, frayed cables, overloaded sockets, wet hands and water near sockets all make these more likely.',
      'Current through the heart is what kills: as little as about 50 mA across the chest can be fatal.'
    ], { n: 0, c: ['Why is it dangerous to plug too many appliances into one socket adaptor?', 'Their currents add up in the adaptor’s cable, which can overheat and start a fire.'] }],
    ['Live, neutral and earth', [
      'UK mains is about 230 V a.c. at 50 Hz. The **live** wire (brown) alternates between large positive and negative voltages; the **neutral** wire (blue) stays close to 0 V and completes the circuit; the **earth** wire (green and yellow) is connected to the ground and normally carries no current.',
      'Switches and fuses are always fitted in the live wire, so that when they open, the appliance is disconnected from the dangerous voltage.'
    ], { n: 1, c: ['Why must a light switch be in the live wire rather than the neutral?', 'With the switch in the neutral, the lamp holder would still be at 230 V when switched off, and changing the bulb could give a shock.'] }],
    ['Fuses and trip switches', [
      'A **fuse** contains a thin wire that melts if the current goes above its rating, breaking the circuit. Choose the lowest standard rating (3 A, 5 A or 13 A in UK plugs) that is above the appliance’s normal current, found from I = P/V.',
      'A **trip switch** (circuit breaker) does the same job with an electromagnet or bimetallic strip that opens a switch. It acts faster and can simply be reset.'
    ], { n: 2, e: 'I = \\frac{P}{V}', x: ['Choose fuses for a 700 W microwave and a 2.0 kW heater on 230 V mains.', ['Microwave: I = 700 ÷ 230 = 3.0 A (3.04 A), which is just over 3 A, so use 5 A.', 'Heater: I = 2000 ÷ 230 = 8.7 A, so use 13 A.'], '5 A for the microwave, 13 A for the heater'], c: ['Why not just fit a 13 A fuse to everything?', 'A 13 A fuse would let a dangerously large current flow through a thin lamp cable before melting, so the cable could overheat and catch fire.'] }],
    ['Earthing and double insulation', [
      'If a fault connects the live wire to an appliance’s metal case, anyone touching the case could get a shock. With the case earthed, a large current flows straight down the low-resistance earth wire instead, which blows the fuse or trips the breaker and disconnects the live supply.',
      'Appliances with plastic outer cases that cannot conduct are **double insulated**, marked with a square inside a square, and need no earth wire.'
    ], { n: 3, c: ['A metal kettle’s earth wire has come loose. Is the kettle still safe to use?', 'No: if a fault made the case live, there would be no easy path to earth, so the fuse would not blow and touching the kettle could give a shock.'] }],
    ['Protecting people: the RCD', [
      'A **residual current device** (RCD) compares the currents in the live and neutral wires. They should be equal; if they differ by more than about 30 mA, current must be leaking somewhere, possibly through a person, and the RCD cuts the supply within a few hundredths of a second.',
      'Fuses protect the wiring from overheating; RCDs protect people, because they react to much smaller currents.'
    ], { n: 4, c: ['Why might a fuse not save someone who touches a live wire?', 'The current through a person, perhaps 50 mA, is far too small to melt a 3 A or 13 A fuse, but it can still be fatal. An RCD reacts to differences of 30 mA.'] }]
  ],
  m: [
    ['Putting the fuse or switch in the neutral wire.', 'Fuses and switches go in the live wire.'],
    ['Choosing a fuse below the normal current.', 'Pick the smallest rating that is above the normal current, or the fuse will blow in normal use.'],
    ['Thinking the earth wire carries current all the time.', 'It carries current only when there is a fault.']
  ]
});
WL.gd('gcse-electromagnets', {
  h: 'In 1820 Hans Christian Ørsted noticed a compass needle twitch whenever he switched on a current nearby. That accident revealed that every electric current makes a magnetic field, and winding the wire into a coil around iron gives a magnet you can switch on and off.',
  s: [
    ['The field around a straight wire', [
      'The magnetic field around a long straight wire carrying a current is a set of circles centred on the wire. It is stronger closer to the wire and with a bigger current, and reversing the current reverses the direction of the circles.',
      'The **right-hand grip rule**: point your right thumb along the conventional current, and your fingers curl the way the field goes.'
    ], { n: 0, e: 'B = \\frac{\\mu_0 I}{2\\pi r}', x: ['A long wire carries 10 A. How strong is its magnetic field 2.0 cm away? (μ₀/2π = 2.0 × 10⁻⁷ T m/A.)', ['B = (μ₀/2π) × I ÷ r = 2.0 × 10⁻⁷ × 10 ÷ 0.020.', '= 1.0 × 10⁻⁴ T, or 100 μT.'], '100 μT, about twice the Earth’s field'], c: ['A current flows straight down into the page. Which way do the field circles go, seen from above?', 'Clockwise: point your right thumb into the page and your fingers curl clockwise.'] }],
    ['The solenoid: a coil like a bar magnet', [
      'A long coil of wire, a **solenoid**, has a field like a bar magnet’s outside, with north and south poles at its ends. Inside, the field is strong and nearly uniform: parallel, evenly spaced lines along the axis.',
      'Looking at one end, if the current flows anticlockwise, that end is a north pole; if clockwise, a south pole. Inside, the field is B = μ₀nI, where n is the number of turns per metre.'
    ], { n: 1, e: 'B = \\mu_0\\, n\\, I', x: ['A solenoid has 500 turns wound along 0.25 m and carries 2.0 A. How strong is the field inside? (μ₀ = 4π × 10⁻⁷ T m/A.)', ['Turns per metre n = 500 ÷ 0.25 = 2000 per metre.', 'B = μ₀nI = 4π × 10⁻⁷ × 2000 × 2.0.', '= 5.0 × 10⁻³ T, or 5.0 mT.'], '5.0 mT'], c: ['How could you double the field inside a solenoid without changing the current?', 'Wind twice as many turns along the same length, doubling n.'] }],
    ['Making it stronger with soft iron', [
      'More turns, a larger current, or an iron core all make an electromagnet stronger. The core matters most: the iron becomes magnetised itself and adds a field hundreds of times bigger than the coil’s alone.',
      'Soft iron is used because it magnetises easily and loses its magnetism as soon as the current stops; steel would stay magnetised.'
    ], { n: 2, c: ['Why would a steel core be a bad choice for a scrapyard crane’s electromagnet?', 'Steel stays magnetised after the current is switched off, so the crane could not drop its load.'] }],
    ['Electromagnets at work', [
      'Electromagnets lift scrap metal, lock doors, and work relays, where a small current in one circuit switches a large current in another, such as a car’s starter motor.',
      'Electric bells, loudspeakers and MRI scanners also rely on fields made by currents.'
    ], { n: 3, c: ['Why is a relay used to switch on a car’s starter motor rather than a simple switch on the dashboard?', 'The starter needs hundreds of amps; a relay lets a small, safe current from the ignition switch close a heavy-duty contact near the motor, so thick cables are not needed through the dashboard.'] }]
  ],
  m: [
    ['Using the left hand for the grip rule.', 'The grip rule for the field round a current uses the right hand.'],
    ['Thinking the field is strongest outside a solenoid.', 'It is strongest and uniform inside.'],
    ['Choosing steel for a switchable magnet.', 'Use soft iron: it loses its magnetism when the current stops.']
  ]
});

WL.gd('gcse-motor', {
  h: 'Electric toothbrushes, washing machines, drones and electric cars all spin for the same reason: a current-carrying coil in a magnetic field is pushed up on one side and down on the other. One clever part, the split-ring commutator, keeps it spinning the same way.',
  s: [
    ['The force on a wire in a field', [
      'A wire carrying a current at right angles to a magnetic field feels a force at right angles to both: F = BIL. Fleming’s left-hand rule gives the direction: **F**irst finger along the **F**ield (north to south), se**C**ond finger along the **C**urrent, thu**M**b along the **M**otion.',
      'Reversing either the current or the field reverses the force.'
    ], { n: 0, e: 'F = B\\,I\\,L', c: ['A wire runs between the poles of a magnet and is pushed upwards. What happens if you reverse the magnet and the current?', 'It is still pushed upwards: two reversals cancel.'] }],
    ['Why a coil turns', [
      'Put a rectangular coil between the poles of a magnet. Current flows one way along one side and the opposite way along the other, so the forces on the two sides point in opposite directions, one up and one down. Being on opposite sides of the axle, they make a turning effect.',
      'The turning effect is largest when the coil’s plane is parallel to the field, and zero when the coil is at right angles to it.'
    ], { n: 1, e: '\\tau_{\\max} = N B I A', x: ['A coil of 50 turns, 4.0 cm by 3.0 cm, carries 0.50 A in a 0.20 T field. What is the largest turning effect (torque)?', ['Area A = 0.040 × 0.030 = 0.0012 m².', 'τ = N × B × I × A = 50 × 0.20 × 0.50 × 0.0012.', '= 0.0060 N m.'], '0.0060 N m'], c: ['Why do the two forces turn the coil rather than push it sideways?', 'They are equal and opposite, so they cancel as a push, but they act on opposite sides of the axle, so their moments add up and turn it.'] }],
    ['The split-ring commutator', [
      'If the current always flowed the same way round the coil, the forces would turn it to the vertical position and then pull it back: it would just rock.',
      'The **split-ring commutator**, two half-rings fixed to the coil, swaps the coil’s connections to the supply every half turn, just as the coil passes the vertical. The current in each side reverses, so the forces keep turning it the same way.'
    ], { n: 2, c: ['At what position does the commutator swap the connections, and why there?', 'When the coil’s plane is at right angles to the field (vertical), where the turning effect is zero anyway; the coil’s momentum carries it past, and the swapped current then pushes it on round.'] }],
    ['Making it turn faster or harder', [
      'A motor turns harder with a bigger current, a stronger magnet, or more turns of wire on the coil.',
      'Practical motors also wind several coils at different angles onto a soft iron core, giving a smoother, stronger turning effect with no dead position.'
    ], { n: 3, c: ['Give two ways to make a toy motor spin harder.', 'Any two of: more current, a stronger magnet, more turns on the coil (or a soft iron core).'] }],
    ['Motors are also generators', [
      'A spinning coil in a magnetic field has an e.m.f. induced in it. In a running motor this **back e.m.f.** opposes the supply, so the current is large when the motor starts and falls once it is up to speed.',
      'A motor that jams draws its full starting current and can overheat.'
    ], { n: 4, e: 'I = \\frac{V - \\mathcal{E}_{\\text{back}}}{R}', x: ['A 12 V motor has a coil resistance of 2.0 Ω. What current flows when it is starting, and when it runs with a back e.m.f. of 10 V?', ['Starting (not yet turning, no back e.m.f.): I = 12 ÷ 2.0 = 6.0 A.', 'Running: I = (12 − 10) ÷ 2.0 = 1.0 A.'], '6.0 A at the start, 1.0 A when running'], c: ['Why can a jammed motor burn out?', 'It stops turning, so there is no back e.m.f. and the large starting current flows all the time, heating the coil.'] }]
  ],
  m: [
    ['Forgetting the commutator.', 'Without it the coil only rocks back and forth.'],
    ['Using the right hand for the motor effect.', 'Fleming’s left-hand rule is for motors.'],
    ['Thinking the turning effect is biggest when the coil is vertical.', 'It is biggest when the coil’s plane is parallel to the field, and zero when vertical.']
  ]
});

WL.gd('gcse-induction', {
  h: 'Push a magnet into a coil and a current flows, with no battery anywhere. Michael Faraday found this in 1831, and almost all the world’s electricity is now made this way, in generators spun by steam, wind or water.',
  s: [
    ['Moving a magnet makes a current', [
      'Push a magnet into a coil connected to a sensitive meter and the needle flicks; hold it still and the needle returns to zero; pull it out and the needle flicks the other way.',
      'An e.m.f. is induced only while the magnetic field through the coil is **changing**, or while a wire is cutting through field lines. If the coil is part of a complete circuit, the e.m.f. drives a current.'
    ], { n: 0, c: ['A magnet rests inside a coil connected to a meter. What does the meter read?', 'Zero: nothing is changing, so no e.m.f. is induced.'] }],
    ['What makes the e.m.f. bigger', [
      'The induced e.m.f. is bigger if the magnet moves faster, if the magnet is stronger, or if the coil has more turns. All three make the field through the coil change faster.',
      'For a straight wire of length L moving at speed v across a field B, the e.m.f. is BLv. Reversing the motion, or turning the magnet round, reverses the e.m.f.'
    ], { n: 1, e: '\\mathcal{E} = B\\,L\\,v', x: ['A 0.50 m metal rod moves at 4.0 m/s at right angles across a 0.10 T field. What e.m.f. is induced across its ends?', ['ℰ = B × L × v = 0.10 × 0.50 × 4.0.', '= 0.20 V.'], '0.20 V'], c: ['A coil of 200 turns has the magnetic flux through it change by 0.0030 Wb in 0.10 s. What average e.m.f. is induced?', 'ℰ = N × ΔΦ ÷ Δt = 200 × 0.0030 ÷ 0.10 = 6.0 V.'] }],
    ['Lenz’s law: the current fights the change', [
      'The induced current flows in the direction that **opposes** the change producing it. Push a north pole into a coil and the coil’s nearer end becomes a north pole, repelling the magnet; pull it out and that end becomes a south pole, attracting it back.',
      'It has to be so. If the induced current helped the motion, the magnet would speed up and make ever more current from nothing, breaking the conservation of energy.'
    ], { n: 2, c: ['Why is it harder to turn a bicycle dynamo when the lamp is switched on?', 'The induced current opposes the motion that makes it (Lenz’s law), so you must do work against that force; that work becomes the light.'] }],
    ['The a.c. generator', [
      'A coil rotating in a magnetic field cuts through field lines, so an alternating e.m.f. is induced. **Slip rings** (two complete rings, one on each end of the coil) and carbon brushes carry the current out without the wires twisting.',
      'The e.m.f. is largest when the coil’s sides cut the field lines fastest (its plane parallel to the field) and zero when they move along the field lines. Turning faster gives a bigger and more frequent e.m.f.'
    ], { n: 3, c: ['A generator’s coil turns 50 times a second. What is the frequency of the a.c. it produces, and how many revolutions per minute is that?', '50 Hz; 50 × 60 = 3000 revolutions per minute.'] }],
    ['Generators everywhere', [
      'Power-station turbines, wind turbines and bicycle dynamos all spin magnets and coils past each other. UK generators turn at speeds that produce exactly 50 Hz.',
      'A motor and a generator are the same machine: feed in current and it turns; turn it and it gives out current. Electric cars use this to recharge their batteries while braking.'
    ], { n: 4, c: ['How does an electric car recover energy when it brakes?', 'Its motor is driven by the moving wheels and acts as a generator, charging the battery; the induced current also opposes the motion, slowing the car.'] }]
  ],
  m: [
    ['Thinking a still magnet in a coil makes a current.', 'Only a changing field, or a wire cutting field lines, induces an e.m.f.'],
    ['Getting the direction from the motor rule.', 'Use Lenz’s law: the induced current opposes the change that causes it.'],
    ['Mixing up slip rings and a split-ring commutator.', 'Slip rings give a.c. from a generator; the split ring keeps a d.c. motor turning one way.']
  ]
});

WL.gd('gcse-transformer', {
  h: 'Electricity leaves the power station at 25 000 V, races across the country at 400 000 V, and arrives at your socket at 230 V. Transformers, two coils on an iron core with no moving parts, change the voltage at each step, and the reason for the huge voltages is to waste less energy in the cables.',
  s: [
    ['How a transformer works', [
      'An alternating current in the **primary** coil makes a constantly changing magnetic field. The soft iron core guides this changing field through the **secondary** coil, where it induces an alternating e.m.f.',
      'With direct current the field would be steady, so nothing would be induced in the secondary, apart from a brief pulse when the current is switched on or off.'
    ], { n: 0, c: ['Why does a transformer not work on a battery’s d.c.?', 'A steady current makes a steady field, and only a changing field induces an e.m.f. in the secondary.'] }],
    ['The turns ratio sets the voltage ratio', [
      'Each turn of either coil has the same changing field through it, so each turn has the same e.m.f. induced in it. The voltages are therefore in the same ratio as the numbers of turns.',
      'A **step-up** transformer has more turns on the secondary, so a higher output voltage; a **step-down** transformer has fewer.'
    ], { n: 1, e: '\\frac{V_p}{V_s} = \\frac{N_p}{N_s}', x: ['A power-station transformer steps 25 kV up to 400 kV. Its primary has 500 turns. How many turns are on the secondary?', ['N_s = N_p × V_s ÷ V_p.', '= 500 × 400 ÷ 25 = 500 × 16.', '= 8000 turns.'], '8000 turns'], c: ['A transformer has 1000 primary turns and 50 secondary turns. What does it do to 230 V?', 'Steps it down by 20 times, to 11.5 V.'] }],
    ['Power in = power out (nearly)', [
      'An ideal, 100% efficient transformer delivers all its input power: V_pI_p = V_sI_s. So stepping the voltage up steps the current down by the same factor, and stepping the voltage down steps the current up.',
      'Real large transformers are about 98 to 99% efficient; the losses are heating in the coils and in the core.'
    ], { n: 2, e: 'V_p I_p = V_s I_s', x: ['An ideal transformer takes 1.2 A from 230 V mains and gives 12 V. What current can the secondary supply?', ['V_p × I_p = V_s × I_s, so I_s = 230 × 1.2 ÷ 12.', '= 276 ÷ 12 = 23 A.'], '23 A'], c: ['A transformer steps the voltage up 10 times. What happens to the current?', 'It is stepped down 10 times (ignoring losses), so the power stays the same.'] }],
    ['Why the grid uses very high voltages', [
      'The power wasted heating a cable is P = I²R. For a given power to deliver, P = IV, so raising the voltage lowers the current, and the heating falls with the square of the current.',
      'Raising the voltage 16 times cuts the current 16 times and the cable heating 256 times. Power stations generate at around 25 kV, step up to 275 or 400 kV for the national grid, and step down in stages to 230 V for homes.'
    ], { n: 3, e: 'P_{\\text{loss}} = I^2 R', x: ['A power station sends 100 MW through cables of total resistance 5.0 Ω. Compare the power lost at 25 kV and at 400 kV.', ['At 25 kV: I = P ÷ V = 100 000 000 ÷ 25 000 = 4000 A; loss = 4000² × 5.0 = 80 000 000 W.', 'At 400 kV: I = 100 000 000 ÷ 400 000 = 250 A; loss = 250² × 5.0 = 312 500 W.'], '80 MW lost (most of the power!) against 0.31 MW'], c: ['Why are 400 kV cables strung high on pylons rather than run along hedges?', 'Such high voltages are extremely dangerous and can arc through air to nearby objects, so they are kept well out of reach.'] }]
  ],
  m: [
    ['Thinking a step-up transformer gives free energy.', 'Voltage goes up but current goes down: power out is at most power in.'],
    ['Using the transformer equation upside down.', 'V_p/V_s = N_p/N_s: primary on top on both sides.'],
    ['Expecting a transformer to work on d.c.', 'It needs a changing current, so a.c.']
  ]
});

WL.gd('gcse-atom', {
  h: 'If an atom were the size of a football stadium, its nucleus would be a marble on the centre spot, yet the marble would hold almost all the mass. Firing alpha particles at gold foil revealed this, and the nucleus turned out to hold enough energy, released by splitting or joining nuclei, to power stars and cities.',
  s: [
    ['Inside the atom', [
      'An atom has a positively charged **nucleus**, made of protons and neutrons, with negatively charged electrons around it. A neutral atom has equal numbers of protons and electrons.',
      'An atom that gains or loses electrons becomes an **ion**: losing electrons makes a positive ion, gaining them a negative ion.'
    ], { n: 0, c: ['A sodium atom loses one electron. What is it now?', 'A positive ion, Na⁺, with one more proton than electrons.'] }],
    ['The alpha-scattering experiment', [
      'In 1909 Geiger and Marsden fired alpha particles (small, fast and positive) at very thin gold foil. Most went straight through. A few were deflected through large angles, and about 1 in 8000 bounced back towards the source.',
      'Rutherford explained it in 1911: most of the atom is empty space, so most alphas pass straight through; the positive charge and almost all the mass are packed into a tiny nucleus, which repels the few alphas that come close.'
    ], { n: 1, x: ['An atom is about 10⁻¹⁰ m across and its nucleus about 10⁻¹⁵ m. How many times bigger is the atom? If the nucleus were a 1 cm marble, how big would the atom be?', ['Ratio = 10⁻¹⁰ ÷ 10⁻¹⁵ = 10⁵ = 100 000.', 'A 1 cm marble scaled up 100 000 times is 100 000 cm = 1 km.'], 'About 100 000 times bigger: the atom would be 1 km across'], c: ['Which observation showed that the nucleus is positive?', 'The alpha particles, which are positive, were pushed away (deflected and some bounced back), so the nucleus must repel them.'] }],
    ['Nuclide notation and isotopes', [
      'The **proton number** Z is the number of protons; it decides which element the atom is. The **nucleon number** A is the number of protons plus neutrons. A nuclide is written with A on top and Z below the symbol: carbon-14 has Z = 6 and A = 14, so 6 protons and 8 neutrons.',
      '**Isotopes** are atoms of the same element (same Z) with different numbers of neutrons (different A), such as carbon-12 and carbon-14.'
    ], { n: 2, e: 'A = Z + N', x: ['Uranium-235 has proton number 92. How many protons, neutrons and (in a neutral atom) electrons does it have?', ['Protons = Z = 92.', 'Neutrons = A − Z = 235 − 92 = 143.', 'Electrons = protons = 92 in a neutral atom.'], '92 protons, 143 neutrons, 92 electrons'], c: ['Uranium-238 and uranium-235: what is the same and what is different?', 'Both have 92 protons (same element); U-238 has 3 more neutrons (146 against 143).'] }],
    ['Fission: splitting heavy nuclei', [
      'A heavy nucleus such as uranium-235 absorbs a slow neutron, becomes unstable and splits into two smaller nuclei, releasing two or three neutrons and a lot of energy, mostly as the kinetic energy of the fragments.',
      'The released neutrons can split more nuclei: a **chain reaction**, controlled in reactors and uncontrolled in bombs. In every nuclear equation the nucleon numbers and the proton numbers must balance on both sides.'
    ], { n: 3, x: ['Check that this fission balances: uranium-235 (Z = 92) + a neutron → barium-141 (Z = 56) + krypton-92 (Z = 36) + 3 neutrons.', ['Nucleon numbers: 235 + 1 = 236 before; 141 + 92 + 3 × 1 = 236 after.', 'Proton numbers: 92 + 0 = 92 before; 56 + 36 + 0 = 92 after.'], 'Both balance, so the equation is possible'], c: ['What stops a reactor’s chain reaction running out of control?', 'Control rods absorb some of the neutrons, so on average each fission causes just one more.'] }],
    ['Fusion: joining light nuclei', [
      'Two light nuclei join to form a heavier one, releasing energy. In the Sun, hydrogen nuclei fuse, in steps, into helium.',
      'Nuclei are positive and repel each other, so fusion needs extremely high temperatures and pressures, so that they collide fast enough to get close. That is why fusion power stations are so hard to build.'
    ], { n: 4, c: ['Why does fusion need temperatures of millions of degrees?', 'Only nuclei moving extremely fast can overcome their electrical repulsion and get close enough to fuse.'] }]
  ],
  m: [
    ['Mixing up A and Z.', 'Z (bottom) counts protons; A (top) counts protons plus neutrons.'],
    ['Saying isotopes are different elements.', 'Isotopes are the same element with different numbers of neutrons.'],
    ['Confusing fission and fusion.', 'Fission splits a heavy nucleus; fusion joins light ones.']
  ]
});
WL.gd('gcse-radiation', {
  h: 'A smoke alarm holds a radioactive source, hospitals use radiation both to find cancers and to kill them, and yet the same radiation can cause cancer. Unstable nuclei give out three kinds of ionising radiation, alpha, beta and gamma, and how far each one gets decides how we use it and how we stay safe.',
  s: [
    ['Background radiation', [
      'We are exposed to a low level of radiation all the time. Natural sources include radon gas seeping out of rocks, building materials, cosmic rays from space, and our food and drink (our bodies contain potassium-40 and carbon-14). Artificial sources include medical X-rays and scans.',
      'Radon is the largest single source for most people in the UK, which is why some houses have radon fans.'
    ], { n: 0, c: ['Name two natural and one artificial source of background radiation.', 'Natural: any two of radon gas, rocks and building materials, cosmic rays, food and drink. Artificial: medical X-rays or scans (or fallout from past weapons tests).'] }],
    ['Detecting it, and correcting for background', [
      'A **Geiger–Müller tube** gives a pulse each time ionising radiation passes through it, and a counter records the pulses. The **count rate** is the number of counts per second or per minute.',
      'Background radiation is always there, so measure it first with the source away, then subtract it from every reading to get the **corrected count rate**.'
    ], { n: 1, x: ['The background count is 18 per minute. With a source in place the counter reads 342 per minute; with a sheet of paper in between, 340; with 3 mm of aluminium, 21. Which radiation does the source give out?', ['Corrected rates: 342 − 18 = 324; with paper 340 − 18 = 322; with aluminium 21 − 18 = 3.', 'Paper hardly changes it, so there is no alpha.', 'Aluminium stops almost all of it, and what is left is about background, so it is beta, with no gamma.'], 'Beta only'], c: ['Why must you subtract background before comparing readings?', 'The detector counts background too; without subtracting it, a weak source could look stronger than it is, and readings near background would look like real radiation.'] }],
    ['Alpha, beta and gamma', [
      '**Alpha** particles are helium nuclei (2 protons, 2 neutrons): heavy, slow and strongly ionising, stopped by a sheet of paper or a few centimetres of air. **Beta** particles are fast electrons from the nucleus: less ionising, stopped by a few millimetres of aluminium. **Gamma** rays are electromagnetic waves: weakly ionising, reduced only by thick lead or concrete.',
      'The more strongly a radiation ionises, the faster it loses its energy, so the less far it gets.'
    ], { n: 2, e: '\\alpha = {}^{4}_{2}\\mathrm{He}\\qquad \\beta = {}^{\\ \\,0}_{-1}\\mathrm{e}', c: ['Which radiation would you use to check the thickness of aluminium foil in a factory, and why?', 'Beta: alpha would not get through at all, gamma would pass through almost unchanged, but beta is partly absorbed, and how much gets through depends on the thickness.'] }],
    ['Deflection in fields', [
      'In an electric or magnetic field, alpha and beta are deflected in opposite directions because their charges are opposite. Beta is deflected far more: its charge is half as big, but its mass is about 7000 times smaller. Gamma, being uncharged, goes straight on.'
    ], { n: 3, c: ['Why is gamma radiation not bent by a magnetic field?', 'It has no charge: it is an electromagnetic wave, and only charged particles are pushed by magnetic fields.'] }],
    ['Staying safe', [
      'Ionising radiation can damage or kill living cells and alter DNA, which can cause cancer. Outside the body alpha is the least dangerous, because it cannot get through skin; inside the body it is the most dangerous, because all its ionisation is concentrated in nearby cells.',
      'Keep exposure low by limiting the time, increasing the distance (for gamma the intensity falls with the square of the distance) and using shielding. Handle sources with tongs, never point them at people, and store them in lead-lined boxes.'
    ], { n: 4, e: 'I \\propto \\frac{1}{d^2}', x: ['A gamma source gives a corrected count of 400 per minute at 1.0 m. What count would you expect at 2.0 m?', ['The intensity falls with the square of the distance.', 'Twice the distance gives 1/2² = 1/4 of the count.', '400 ÷ 4 = 100 per minute.'], '100 per minute'], c: ['Why is breathing in radon gas more dangerous than standing near an alpha source?', 'Inside the lungs the alpha particles are right next to living cells and all their ionisation goes into them; outside, the dead layer of skin stops them.'] }]
  ],
  m: [
    ['Forgetting to subtract background.', 'Always subtract the background count rate first.'],
    ['Saying alpha is always the most dangerous.', 'Outside the body it is the least dangerous; inside it is the most.'],
    ['Calling gamma a particle with charge.', 'Gamma is an uncharged electromagnetic wave.']
  ]
});

WL.gd('gcse-radioactivity', {
  h: 'No one can say when a particular uranium nucleus will decay; it might be in a second or in a billion years. Yet a large sample always loses half its nuclei in exactly the same time. Pure chance, repeated over billions of nuclei, makes one of nature’s most reliable clocks, good enough to date bones and rocks.',
  s: [
    ['Unstable nuclei', [
      'A nucleus contains protons (number Z) and neutrons; the total is the nucleon number A. Isotopes of an element have the same Z but different numbers of neutrons. Some combinations are unstable and **decay**, giving out radiation and often becoming a different element.'
    ], { n: 0, c: ['Carbon-14 has 6 protons. How many neutrons does it have?', '14 − 6 = 8 neutrons.'] }],
    ['Decay equations', [
      'In **alpha decay**, the nucleus loses 2 protons and 2 neutrons, so A falls by 4 and Z by 2. In **beta decay**, a neutron turns into a proton and an electron, which is shot out, so A stays the same and Z goes up by 1. Gamma emission changes neither.',
      'In every decay equation, the top numbers balance and the bottom numbers balance.'
    ], { n: 1, e: '{}^{A}_{Z}\\mathrm{X}\\to{}^{A-4}_{Z-2}\\mathrm{Y}+{}^{4}_{2}\\mathrm{He}\\qquad {}^{A}_{Z}\\mathrm{X}\\to{}^{A}_{Z+1}\\mathrm{Y}+{}^{\\ \\ 0}_{-1}\\mathrm{e}', x: ['Radium-226 (Z = 88) gives out an alpha particle. What nucleus is left? Carbon-14 (Z = 6) gives out a beta particle. What is left?', ['Alpha: A = 226 − 4 = 222, Z = 88 − 2 = 86: element 86 is radon, so radon-222.', 'Beta: A stays 14, Z = 6 + 1 = 7: element 7 is nitrogen, so nitrogen-14.'], 'Radon-222; nitrogen-14'], c: ['A nucleus decays and its proton number goes up by one while its nucleon number stays the same. Which decay was it?', 'Beta decay: a neutron became a proton.'] }],
    ['Random decay and half-life', [
      'Each nucleus has the same fixed chance of decaying each second, whatever its neighbours are doing. With more nuclei, more decay each second, so the number left falls fast at first and then more and more slowly.',
      'The **half-life** is the time for half of the nuclei, or half the activity, to go. After n half-lives the fraction left is (½)ⁿ.'
    ], { n: 2, e: 'N = N_0\\left(\\tfrac12\\right)^{n}', x: ['A source has an activity of 800 counts per second and a half-life of 3.0 days. What is its activity after 12 days?', ['12 days ÷ 3.0 days = 4 half-lives.', 'Activity = 800 × (½)⁴ = 800 ÷ 16.', '= 50 counts per second.'], '50 counts per second'], c: ['A bone contains one eighth of the carbon-14 that living bone does. Carbon-14’s half-life is 5730 years. How old is it?', 'One eighth is (½)³, so three half-lives: 3 × 5730 ≈ 17 000 years.'] }],
    ['Counting is uncertain', [
      'Because decay is random, counts fluctuate: a count of N is uncertain by about √N. A count of 400 might really be anywhere from about 380 to 420.',
      'Counting for longer gives bigger counts and smaller percentage uncertainty. Before working out a half-life, measure the background and subtract it from every reading.'
    ], { n: 3, c: ['Which is more precise: a count of 100 or a count of 10 000?', '10 000: the uncertainty is √10 000 = 100, which is 1%, against √100 = 10, which is 10%.'] }],
    ['Using radioactivity', [
      'Half-life decides the use. Medical tracers need short half-lives (hours) so they do not stay in the body; smoke alarms use americium-241, with a half-life of 432 years, so the alarm lasts; carbon-14 dates things up to about 50 000 years old; uranium dates rocks billions of years old.',
      'Gamma rays sterilise surgical instruments and kill cancer cells; beta sources check the thickness of paper and foil.'
    ], { n: 4, c: ['Why would a tracer with a half-life of 100 years be a bad choice for a medical scan?', 'It would stay radioactive inside the patient for many years, giving them an unnecessary dose long after the scan.'] }],
    ['Contamination and irradiation', [
      '**Irradiation** is being exposed to radiation from a source outside the body; it stops when you move away. **Contamination** is having radioactive material on or inside you, so the exposure goes on.',
      'Alpha sources are fairly harmless outside the body but very dangerous if swallowed or breathed in.'
    ], { n: 5, c: ['Does food that has been irradiated to kill bacteria become radioactive?', 'No: it has been exposed to radiation, not contaminated with radioactive material.'] }]
  ],
  m: [
    ['Halving the time instead of the amount.', 'Each half-life halves the amount left, not the time.'],
    ['Thinking a sample is gone after two half-lives.', 'After two half-lives a quarter is left; it never quite reaches zero.'],
    ['Getting the numbers wrong in a beta decay.', 'In beta decay A stays the same and Z goes up by 1.']
  ]
});

WL.gd('gcse-earth-moon', {
  h: 'Why is it summer in Australia while it is winter in Britain, and why does the Moon change shape through the month? The Earth spins once a day, goes round the Sun once a year with its axis tilted, and the Moon circles us about once a month. Those three motions explain day and night, the seasons and the phases.',
  s: [
    ['Day and night', [
      'The Earth rotates on its axis once in about 24 hours. The half facing the Sun has day; the other half has night.',
      'The Sun appears to rise in the east and set in the west because the Earth turns from west to east.'
    ], { n: 0, x: ['The Earth’s radius is 6.4 × 10⁶ m. How fast is a point on the equator moving as the Earth spins?', ['In one day it goes once round: 2πr = 2 × 3.14 × 6.4 × 10⁶ = 4.0 × 10⁷ m.', 'One day = 24 × 3600 = 86 400 s.', 'v = 4.0 × 10⁷ ÷ 86 400 = 465 m/s.'], 'about 465 m/s (over 1600 km/h)'], c: ['Why do we not feel the Earth spinning?', 'We move along with it at a steady speed; we only feel changes in speed or direction, and its slow turn changes our direction very gently.'] }],
    ['The year and the seasons', [
      'The Earth orbits the Sun once in about 365¼ days. Its axis is tilted at about 23.4° and keeps pointing the same way in space.',
      'When the northern hemisphere tilts towards the Sun (around June), the Sun climbs higher in the sky and days are longer, so sunlight is more concentrated and shines for longer: summer. Six months later the north tilts away: winter. The southern hemisphere has the opposite seasons.'
    ], { n: 1, c: ['The Earth is actually closest to the Sun in early January. Why is that not summer in Britain?', 'Seasons come from the tilt, not the distance. In January the northern hemisphere tilts away from the Sun, so the Sun is low and the days are short.'] }],
    ['The Moon and its phases', [
      'The Moon orbits the Earth and always keeps the same face towards us. The Sun always lights half of the Moon; the phase we see depends on how much of that lit half faces us.',
      'New Moon (between the Earth and the Sun, its dark side towards us), then waxing crescent, first quarter, waxing gibbous, full Moon (on the far side of the Earth from the Sun), and back through waning gibbous, last quarter and waning crescent.'
    ], { n: 2, c: ['At full Moon, where are the Sun, Earth and Moon?', 'Roughly in a line with the Earth in the middle: we see the whole sunlit face of the Moon.'] }],
    ['Orbital speed', [
      'For a roughly circular orbit, the distance travelled in one orbit is the circumference 2πr, covered in one period T, so v = 2πr/T.'
    ], { n: 3, e: 'v = \\frac{2\\pi r}{T}', x: ['The Moon orbits at 3.84 × 10⁸ m from the Earth once every 27.3 days. How fast does it move?', ['T = 27.3 × 86 400 = 2.36 × 10⁶ s.', 'Circumference = 2π × 3.84 × 10⁸ = 2.41 × 10⁹ m.', 'v = 2.41 × 10⁹ ÷ 2.36 × 10⁶ = 1020 m/s.'], 'about 1.0 km/s'], c: ['The Earth orbits the Sun at about 30 km/s. Is that faster or slower than the Moon goes round the Earth?', 'About 30 times faster: the Moon’s orbital speed around the Earth is only about 1 km/s.'] }],
    ['Why the phases repeat every 29.5 days, not 27.3', [
      'The Moon goes once round the Earth, relative to the stars, in 27.3 days. But in that time the Earth has moved about a thirteenth of the way round the Sun, so the Moon must travel about two more days to line up with the Sun again and repeat its phase.'
    ], { n: 4, c: ['How many full Moons are there in a year, roughly?', 'About 12.4: 365 ÷ 29.5. That is why some years have 13 full Moons.'] }]
  ],
  m: [
    ['Blaming seasons on the distance from the Sun.', 'Seasons come from the tilt of the Earth’s axis.'],
    ['Saying the Earth’s shadow causes the phases.', 'Phases come from how much of the sunlit half we see; the Earth’s shadow only matters in an eclipse.'],
    ['Leaving T in days in v = 2πr/T.', 'Convert days to seconds for a speed in m/s.']
  ]
});

WL.gd('gcse-solar-system', {
  h: 'Why does a comet whip round the Sun in a few weeks and then vanish for 76 years, and why must a Mars rover drive itself? The Sun’s gravity holds the planets, asteroids and comets in orbits that are ellipses, and the distances are so large that even light takes minutes or hours to cross them.',
  s: [
    ['What is out there', [
      'The Sun holds over 99.8% of the Solar System’s mass. Then come four small rocky planets (Mercury, Venus, Earth, Mars), the asteroid belt, four giant planets (Jupiter and Saturn of gas, Uranus and Neptune of ice), dwarf planets such as Pluto, and comets from far beyond.',
      'Moons orbit planets; planets, asteroids and comets orbit the Sun.'
    ], { n: 0, c: ['What is the difference between a planet and a moon?', 'A planet orbits the Sun; a moon orbits a planet.'] }],
    ['How it formed: accretion', [
      'A cloud of gas and dust collapsed under its own gravity and began to spin, flattening into a disc. Most of the material fell to the centre and became the Sun. In the disc, dust grains stuck together and grew into larger and larger bodies (**accretion**), eventually planets.',
      'Near the hot young Sun only rock and metal could stay solid, so the inner planets are rocky; further out, ices could freeze too, so the giants grew huge.'
    ], { n: 1, c: ['Why are the inner planets rocky and the outer planets giant?', 'Close to the Sun it was too hot for ices to freeze, so only rock and metal were available; further out there was much more solid material, so planets grew big enough to pull in gas.'] }],
    ['Gravity and orbits', [
      'The Sun’s gravity provides the force that keeps each planet moving in its curved path; without it, a planet would fly off in a straight line. The pull weakens with distance, so outer planets move more slowly and have much longer years.',
      'The surface gravity of a planet depends on its mass and radius: about 3.7 N/kg on Mars, 9.8 N/kg on Earth, and 25 N/kg at the cloud tops of Jupiter.'
    ], { n: 2, e: 'T^2 \\propto r^3', x: ['Jupiter is 5.2 times further from the Sun than the Earth. Using T² ∝ r³, how long is Jupiter’s year?', ['T² is proportional to r³, so T is proportional to r^1.5.', 'T = 5.2^1.5 years = √(5.2³) = √140.6.', 'T = 11.9 years.'], 'about 12 Earth years'], c: ['Which moves faster in its orbit, Mercury or Neptune?', 'Mercury: it is closest to the Sun, where the pull is strongest, so it must move fastest to stay in orbit.'] }],
    ['Elliptical orbits', [
      'Planetary orbits are **ellipses** with the Sun at one focus, not at the centre. Most are nearly circular; comets’ orbits are very stretched.',
      'As a body falls in towards the Sun, it loses gravitational potential energy and gains kinetic energy, so it is fastest at its closest point and slowest at its furthest. A comet whips round the Sun quickly and then crawls through the outer Solar System.'
    ], { n: 3, c: ['Where in its orbit does a comet move slowest?', 'At its furthest point from the Sun, where it has the most potential energy and the least kinetic energy.'] }],
    ['Light travel times', [
      'Light from the Sun takes about 8.3 minutes to reach the Earth, and over 4 hours to reach Neptune. Radio commands to distant spacecraft take just as long, so probes and rovers must run themselves for much of the time.'
    ], { n: 4, e: 't = \\frac{d}{c}', x: ['Mars is between about 5.6 × 10¹⁰ m and 4.0 × 10¹¹ m from the Earth. How long does a radio signal take, at the nearest and furthest?', ['Nearest: t = 5.6 × 10¹⁰ ÷ 3.0 × 10⁸ = 187 s, about 3.1 minutes.', 'Furthest: t = 4.0 × 10¹¹ ÷ 3.0 × 10⁸ = 1330 s, about 22 minutes.'], 'between about 3 and 22 minutes each way'], c: ['Why can a Mars rover not be steered live with a joystick from Earth?', 'Each command and each picture takes minutes to travel; by the time a driver saw a hazard, the rover would already have reached it.'] }]
  ],
  m: [
    ['Putting the Sun at the centre of an ellipse.', 'The Sun sits at one focus, not the centre.'],
    ['Thinking planets need an engine to keep moving.', 'Nothing slows them in space; gravity only bends their path.'],
    ['Assuming every planet moves at the same speed.', 'Inner planets move faster; outer ones slower.']
  ]
});

WL.gd('gcse-stars', {
  h: 'The iron in your blood and the calcium in your bones were made inside stars that exploded billions of years ago. Stars are huge balls of gas held together by gravity and powered by nuclear fusion, and their life story, and their death, depends on their mass.',
  s: [
    ['The Sun as a star', [
      'The Sun is a medium-sized star, mostly hydrogen (about three quarters of its mass) and helium. In its core, at about 15 million °C, hydrogen nuclei fuse in a series of steps to make helium, releasing energy.',
      'Each second the Sun turns about 600 million tonnes of hydrogen into helium, and about 4 million tonnes of mass disappear, turned into energy by E = mc².'
    ], { n: 0, e: 'E = mc^2', x: ['The Sun gives out 3.8 × 10²⁶ W. How much mass does it lose each second? (c = 3.0 × 10⁸ m/s)', ['Energy per second E = 3.8 × 10²⁶ J.', 'm = E ÷ c² = 3.8 × 10²⁶ ÷ (3.0 × 10⁸)² = 3.8 × 10²⁶ ÷ 9.0 × 10¹⁶.', '= 4.2 × 10⁹ kg per second.'], 'about 4 million tonnes every second'], c: ['Why is the Sun not burning in the way a fire burns?', 'A fire is a chemical reaction needing oxygen; the Sun is powered by nuclear fusion, which releases millions of times more energy per kilogram.'] }],
    ['Galaxies and light-years', [
      'The Sun is one of 100 billion or more stars in the Milky Way, a spiral galaxy about 100 000 light-years across, and the observable Universe contains billions of galaxies.',
      'A **light-year** is the distance light travels in one year, about 9.5 × 10¹⁵ m. Looking at distant objects is looking back in time.'
    ], { n: 1, e: '1\\ \\text{ly} \\approx 9.5\\times10^{15}\\ \\text{m}', x: ['Sirius is 8.6 light-years away. How far is that in metres, and when did the light we see tonight leave it?', ['d = 8.6 × 9.5 × 10¹⁵ = 8.2 × 10¹⁶ m.', 'Light covers one light-year per year, so it left 8.6 years ago.'], '8.2 × 10¹⁶ m; 8.6 years ago'], c: ['Why is the light-year more useful than the kilometre for stars?', 'Star distances in kilometres are huge, awkward numbers; light-years keep them small and also tell you how old the light is.'] }],
    ['Birth and the main sequence', [
      'A star forms when a cloud of gas and dust, a **nebula**, collapses under its own gravity. The collapsing **protostar** heats up until its core is hot and dense enough for hydrogen to fuse into helium.',
      'The star then becomes stable, on the **main sequence**: the outward pressure of its hot gas, kept hot by fusion, balances the inward pull of gravity. The Sun has been on the main sequence for about 4.6 billion years and has about 5 billion to go.'
    ], { n: 2, c: ['What balances gravity in a main-sequence star?', 'The outward pressure of the hot gas, kept hot by fusion in the core.'] }],
    ['How stars end', [
      'When a star like the Sun runs out of hydrogen in its core, it swells into a **red giant**, then throws off its outer layers and leaves a hot, dense core: a **white dwarf**, which slowly cools.',
      'A star much more massive than the Sun swells into a **red supergiant** and ends in a **supernova** explosion, leaving a **neutron star** or, for the most massive, a **black hole**. Supernovae scatter the elements made inside stars into space, where they form new stars and planets.'
    ], { n: 3, c: ['Will the Sun end as a black hole?', 'No: it is not massive enough. It will become a red giant and then a white dwarf.'] }],
    ['A contest between gravity and pressure', [
      'Every stage of a star’s life is a contest between gravity pulling in and pressure pushing out. When fusion slows, gravity wins and the core contracts and heats up, until a new fuel ignites or something else stops the collapse: tightly packed electrons in a white dwarf, or neutrons in a neutron star.',
      'If nothing can stop it, the core collapses all the way into a black hole.'
    ], { n: 4, c: ['Why does a star’s core heat up when its fusion slows down?', 'Gravity squeezes the core smaller, and compressing a gas heats it.'] }]
  ],
  m: [
    ['Thinking a light-year is a time.', 'It is a distance: how far light travels in a year.'],
    ['Saying stars burn like fires.', 'Stars shine by nuclear fusion, not chemical burning.'],
    ['Giving every star the same ending.', 'The ending depends on mass: white dwarf, neutron star or black hole.']
  ]
});

WL.gd('gcse-orbits', {
  h: 'In 1929 Edwin Hubble found that the further away a galaxy is, the faster it is moving away from us. Run that expansion backwards and everything was once squeezed together, about 14 billion years ago. This topic follows the evidence: stretched light, Hubble’s law, and the faint glow left over from the Big Bang.',
  s: [
    ['Spectral fingerprints', [
      'Each element absorbs and emits light only at particular wavelengths, seen as dark **absorption lines** in a star’s spectrum. Hydrogen, for example, has a strong red line at 656.3 nm in the laboratory.',
      'The pattern of lines identifies the element even when the whole pattern has shifted.'
    ], { n: 0, c: ['How can we tell a distant galaxy contains hydrogen, if all its lines are in the wrong places?', 'The pattern of the lines (their spacing and ratios) still matches hydrogen; only the whole pattern has shifted.'] }],
    ['Red-shift', [
      'A source moving away from us stretches the waves it sends, so every line moves to a longer, redder wavelength. The fractional shift is the **red-shift**, z = Δλ/λ. For speeds much less than light, z is about v/c.',
      'An approaching source is blue-shifted: the Andromeda galaxy is coming towards us at about 300 km/s.'
    ], { n: 1, e: 'z = \\frac{\\Delta\\lambda}{\\lambda} \\approx \\frac{v}{c}', x: ['In a galaxy’s spectrum, hydrogen’s 656.3 nm line is seen at 662.9 nm. How fast is the galaxy moving away?', ['Δλ = 662.9 − 656.3 = 6.6 nm.', 'z = 6.6 ÷ 656.3 = 0.0101.', 'v = z × c = 0.0101 × 3.0 × 10⁸ = 3.0 × 10⁶ m/s, which is 3000 km/s.'], 'about 3000 km/s'], c: ['A galaxy’s lines are shifted to shorter wavelengths. What does that tell you?', 'It is moving towards us (blue-shift).'] }],
    ['Hubble’s law', [
      'Hubble found that more distant galaxies have bigger red-shifts: their recession speed is proportional to their distance, v = H₀d.',
      'The Hubble constant H₀ is about 70 km/s for every **megaparsec** of distance (1 Mpc = 3.26 million light-years).'
    ], { n: 2, e: 'v = H_0\\,d', x: ['The galaxy above recedes at 3000 km/s. With H₀ = 70 km/s per Mpc, how far away is it?', ['d = v ÷ H₀ = 3000 ÷ 70.', '= 43 Mpc, about 140 million light-years.'], 'about 43 Mpc'], c: ['A galaxy is twice as far away as another. How do their recession speeds compare?', 'It recedes twice as fast: speed is proportional to distance.'] }],
    ['An age for the Universe', [
      'If every galaxy’s speed is proportional to its distance, they all took the same time to get where they are: d/v = 1/H₀. With H₀ = 70 km/s/Mpc that is about 14 billion years.',
      'The fuller calculation, which allows for the expansion speeding up and slowing down, gives 13.8 billion years.'
    ], { n: 3, e: 't \\approx \\frac{1}{H_0}', c: ['If H₀ were bigger, would the Universe come out older or younger?', 'Younger: t ≈ 1/H₀, so a faster expansion means less time to reach today’s distances.'] }],
    ['The evidence for the Big Bang', [
      'Two key pieces of evidence: the red-shift of distant galaxies (the Universe is expanding), and the **cosmic microwave background**, a faint glow of microwaves arriving from every direction. It is the light of the hot early Universe, stretched by the expansion into microwaves.',
      'The Big Bang theory also correctly predicts how much hydrogen and helium the Universe contains.'
    ], { n: 4, c: ['Why is the cosmic microwave background evidence for a hot, dense beginning?', 'It is radiation from a time when the Universe was hot and glowing everywhere; the expansion has since stretched that light into microwaves.'] }],
    ['Space itself is stretching', [
      'The Big Bang was not an explosion into empty space with a centre. Space itself is expanding, carrying galaxies apart, and the light’s wavelength stretches with it.',
      'So every galaxy sees all the others moving away: there is no special centre, and we are not at it.'
    ], { n: 5, c: ['If all galaxies are moving away from us, are we at the centre of the Universe?', 'No: in an expanding space, every observer sees the others moving away, like dots on a balloon being blown up.'] }]
  ],
  m: [
    ['Saying red-shift means the galaxy looks red.', 'It means the lines are shifted to longer wavelengths; the galaxy need not look red.'],
    ['Picturing the Big Bang as an explosion from a point in space.', 'Space itself expands everywhere; there is no centre.'],
    ['Mixing up the units of H₀.', 'H₀ in km/s per Mpc gives distance in Mpc when the speed is in km/s.']
  ]
});
