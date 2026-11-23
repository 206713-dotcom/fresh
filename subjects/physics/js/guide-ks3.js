/* Geodesic step-by-step guides, stage ks3 (built from src/guide/ks3-*.js) */
WL.gd('ks3-energy', {
  h: 'Why does a bouncing ball bounce a little lower every time, and why does a phone get warm while it charges? Both come from one rule: energy is never made or destroyed, only moved from place to place, and every time it moves, some of it spreads out as heat.',
  s: [
    ['Energy is kept in stores', [
      'Energy is not a substance you can see; it is a way of keeping count of what can make things happen. It helps to picture it kept in **stores**: kinetic (anything moving), gravitational potential (anything lifted up), elastic (a stretched spring or rubber band), chemical (food, fuel, batteries), thermal (anything warm) and nuclear.',
      'Energy is measured in joules (J). Lifting an apple 1 m off the floor stores about 1 J. A slice of bread holds roughly 300 000 J, or 300 kJ (1 kJ = 1000 J).'
    ], { n: 0, c: ['A cyclist freewheels down a hill and speeds up. Which store empties, and which fills?', 'Her gravitational potential store empties as she gets lower, and her kinetic store fills as she speeds up. Some energy also goes to thermal stores, because friction and air resistance warm her bike and the air.'] }],
    ['Energy moves between stores in four ways', [
      'Energy can be **transferred** from one store to another in only four ways: by a force moving something (mechanical work), by an electric current, by heating, and by waves such as light and sound.',
      'A torch is a good example. Energy leaves the chemical store of the battery, is carried by the electric current to the lamp, and leaves the lamp as light. The lamp also gets warm, so some energy heats the torch and the air.'
    ], { n: 1, c: ['Describe the energy transfers when you rub your hands together to warm them.', 'Energy leaves the chemical store in your muscles, is transferred by the force moving your hands (mechanical work), and friction transfers it to the thermal store of your hands.'] }],
    ['The total never changes', [
      'However energy moves, the total amount stays exactly the same. This is the **conservation of energy**. If a battery gives out 100 J, then 100 J ends up somewhere else, perhaps 20 J as light and 80 J heating the room.',
      'This makes energy a powerful bookkeeping tool: if you know the energy going in and most of where it goes, you can work out the rest.'
    ], { n: 2, e: '\\text{energy in} = \\text{useful energy out} + \\text{wasted energy}', x: ['An electric kettle takes in 200 000 J from the mains, and 170 000 J of it heats the water. How much energy goes elsewhere, and where does it go?', ['Energy in = energy out, so the rest is 200 000 − 170 000 = 30 000 J.', 'It heats the kettle itself and the air around it, and a little leaves as sound.'], '30 000 J (30 kJ), mostly heating the kettle and the air'], c: ['A ball is dropped and has 6 J of kinetic energy just before it hits the floor. It rebounds with 4 J. Where did the other 2 J go?', 'Into sound and into heating the ball and the floor. It has not disappeared: it has been transferred to thermal stores, mostly.'] }],
    ['Energy spreads out and becomes less useful', [
      'In every real event, some energy ends up warming the surroundings, often through friction or sound. That energy is not lost, but it is spread thinly through lots of air and material, and it is very hard to gather up and use again. We say it has been **dissipated**.',
      'A bouncing ball rises a little less each time, because each bounce transfers some energy to sound and to heating the ball and the floor. Eventually it lies still: all its energy has been dissipated.'
    ], { n: 3, c: ['If energy is never destroyed, why do people talk about running out of energy?', 'Because once energy has spread out as heat in the surroundings, we cannot easily collect it and use it again. What we run out of is useful energy, such as the chemical store in fuel, not energy itself.'] }],
    ['Efficiency: how much ends up where you want it', [
      'The energy that does the job we want is called **useful**; the rest is **wasted**, usually as heat. Efficiency compares them: it is the fraction of the energy put in that comes out usefully. Multiply by 100 to give a percentage.',
      'A **Sankey diagram** draws the energy as arrows whose width shows how much: one wide arrow in, splitting into a useful arrow and a wasted arrow.'
    ], { n: 4, e: '\\text{efficiency} = \\frac{\\text{useful energy out}}{\\text{total energy in}}', x: ['An electric motor takes in 500 J and gives a load 350 J of gravitational potential energy. How much is wasted, and what is the motor’s efficiency?', ['Wasted energy = 500 − 350 = 150 J.', 'Efficiency = useful out ÷ total in = 350 ÷ 500 = 0.70.', 'As a percentage: 0.70 × 100 = 70%.'], '150 J wasted; 70% efficient'], c: ['Can any machine be 120% efficient?', 'No. That would mean more useful energy out than total energy in, which breaks the conservation of energy. Every real machine is below 100%.'] }]
  ],
  m: [
    ['Saying energy is “used up”.', 'Energy is transferred, not used up: say which store it ends up in, usually the thermal store of the surroundings.'],
    ['Saying wasted energy is destroyed.', 'Wasted energy still exists; it has spread out where it is no longer useful.'],
    ['Dividing kJ by J.', 'Put both energies in the same unit before working out an efficiency: 1 kJ = 1000 J.'],
    ['Getting an efficiency above 100%.', 'You have divided the wrong way round: it is useful out ÷ total in.']
  ]
});

WL.gd('ks3-forces', {
  h: 'Why does a parked car stay put, and why does a skydiver stop speeding up after a few seconds of falling? Both come down to forces adding up or cancelling out. Once you can draw the forces as arrows and combine them, you can say whether anything will speed up, slow down or carry on as it is.',
  s: [
    ['Forces are pushes and pulls, drawn as arrows', [
      'A force is a push or a pull, measured in **newtons** (N). You can measure one with a newton meter, a spring that stretches more as the force grows.',
      '**Contact** forces act when things touch: friction, air resistance, the tension in a rope, the push of the floor on your feet. **Non-contact** forces act at a distance: gravity, magnetism and the electric force. We draw forces as arrows: the length shows how big the force is, and the direction shows which way it acts.'
    ], { n: 0, c: ['Name one contact force and one non-contact force acting on you as you sit on a chair.', 'Contact: the chair pushing up on you. Non-contact: gravity pulling you down.'] }],
    ['Mass and weight are different things', [
      '**Mass** is the amount of matter in an object, measured in kilograms. It is the same wherever you take the object. **Weight** is the force of gravity pulling on that mass, measured in newtons, and it depends on where you are.',
      'On Earth, each kilogram is pulled with about 10 N; we call this the gravitational field strength, g = 10 N/kg. On the Moon, g is only 1.6 N/kg, because the Moon has much less mass than the Earth.'
    ], { n: 1, e: '\\text{weight (N)} = \\text{mass (kg)} \\times g\\ (\\text{N/kg})', x: ['An astronaut has a mass of 80 kg. What is his weight on Earth (g = 10 N/kg) and on the Moon (g = 1.6 N/kg)?', ['On Earth: W = m × g = 80 × 10 = 800 N.', 'On the Moon: W = 80 × 1.6 = 128 N.', 'His mass is 80 kg in both places; only the pull of gravity has changed.'], '800 N on Earth, 128 N on the Moon, and a mass of 80 kg in both'], c: ['A bag of sugar has a mass of 1 kg. Roughly what does it weigh on Earth?', 'About 10 N, because each kilogram weighs about 10 N on Earth.'] }],
    ['Balanced forces leave the motion unchanged', [
      'When the forces on an object cancel out, they are **balanced**, and the **resultant** (overall) force is zero. Then the motion does not change: a still object stays still, and a moving object keeps going at the same speed in the same direction.',
      'A car cruising at a steady 30 mph has balanced forces: the forward push from the engine exactly equals the backward pull of air resistance and friction.'
    ], { n: 2, c: ['A book rests on a table. Which two forces balance?', 'Its weight, pulling down, and the push of the table on the book, acting up.'] }],
    ['Unbalanced forces change the motion', [
      'When the forces do not cancel, there is a resultant force, and the motion changes: a resultant forwards speeds the object up, a resultant backwards slows it down, and a resultant sideways turns it.',
      'To find the resultant of forces along one line, add the ones pointing the same way and subtract the ones pointing the opposite way.'
    ], { n: 2, x: ['A shopping trolley is pushed forward with 60 N while friction pushes back with 20 N. What is the resultant force, and what happens?', ['The two forces act along the same line in opposite directions, so subtract: 60 − 20 = 40 N.', 'The resultant points the way of the bigger force: forwards.'], '40 N forwards, so the trolley speeds up'], c: ['A moving car’s engine force is smaller than the air resistance and friction together. What happens to the car?', 'It slows down, because the resultant force points backwards.'] }],
    ['Friction, air resistance and terminal velocity', [
      'Friction acts between surfaces and always opposes motion. It lets us walk and brake, but it wastes energy as heat in machines. Air resistance (drag) opposes anything moving through air, and it gets bigger the faster the object goes.',
      'A skydiver jumps and speeds up, because her weight is bigger than the air resistance. As she gets faster, the air resistance grows, until it equals her weight. Then the forces are balanced and she falls at a steady top speed, her **terminal velocity**.'
    ], { n: 3, c: ['Why does opening a parachute slow a skydiver down, even though her weight has not changed?', 'The parachute’s large area makes the air resistance much bigger than her weight. The resultant now points up, so she slows down, until the forces balance again at a much lower terminal velocity.'] }],
    ['Without air, everything falls together', [
      'Remove the air and there is no air resistance, so every object falls with the same acceleration, whatever its mass. In 1971 the Apollo 15 astronaut David Scott dropped a hammer and a feather on the Moon, and they landed at the same moment.'
    ], { n: 4, c: ['On Earth a feather falls much more slowly than a hammer. Is that because the feather is lighter?', 'No. It is because air resistance is large compared with the feather’s tiny weight. In a vacuum the two fall together.'] }]
  ],
  m: [
    ['Mixing up mass and weight.', 'Mass is in kilograms and stays the same everywhere; weight is a force in newtons and depends on the gravity where you are.'],
    ['Thinking a moving object needs an unbalanced force to keep moving.', 'Steady motion means balanced forces; a resultant force is needed only to change the speed or direction.'],
    ['Adding forces that point in opposite directions.', 'Subtract them; the resultant points the way of the bigger one.']
  ]
});

WL.gd('ks3-speed', {
  h: 'A sprinter, a snail and a jumbo jet can all be compared with one number: how many metres each covers every second. And one graph of distance against time tells the whole story of a journey: when it sped up, when it stopped and how far it went.',
  s: [
    ['Speed is distance covered per second', [
      'Speed tells you how much distance is covered in each unit of time. Walk 140 m in 100 s and you cover 1.4 m every second, so your speed is 1.4 m/s. The unit is the recipe: metres divided by seconds.',
      'Speeds are also given in kilometres per hour. Since 1 km = 1000 m and 1 hour = 3600 s, 1 m/s = 3.6 km/h: divide km/h by 3.6 to get m/s.'
    ], { n: 0, e: 'v = \\frac{d}{t}\\qquad d = v\\,t\\qquad t = \\frac{d}{v}', x: ['A cyclist travels 300 m in 50 s. What is her speed? How far does she go in 2 minutes at that speed?', ['v = d ÷ t = 300 ÷ 50 = 6.0 m/s.', '2 minutes = 2 × 60 = 120 s.', 'd = v × t = 6.0 × 120 = 720 m.'], '6.0 m/s; 720 m'], c: ['Which is faster: 20 m/s or 60 km/h?', '60 km/h ÷ 3.6 = 16.7 m/s, so 20 m/s is faster.'] }],
    ['On a distance–time graph, the slope is the speed', [
      'Plot distance up the side and time along the bottom. At a steady speed the same distance is added every second, so the points lie on a straight line. The steeper the line, the faster the object; a flat line means it is not moving at all.',
      'To find the speed, pick two points on the line and divide the change in distance (the rise) by the change in time (the run). That is the **gradient** of the line.'
    ], { n: 1, x: ['A runner’s line on a distance–time graph goes from (0 s, 0 m) to (40 s, 200 m). What is her speed?', ['Gradient = change in distance ÷ change in time.', '= (200 − 0) ÷ (40 − 0) = 200 ÷ 40.', '= 5.0 m/s.'], '5.0 m/s'], c: ['What does a horizontal line on a distance–time graph mean?', 'The distance is not changing, so the object is standing still.'] }],
    ['Average speed: total distance ÷ total time', [
      'Real journeys speed up and slow down. Their **average speed** is the total distance divided by the total time.',
      'It is tempting to average the speeds instead, but that is usually wrong, because you spend longer at the slower speed. Drive 30 km at 30 km/h (1 hour) and come back at 60 km/h (half an hour): 60 km in 1.5 hours is 40 km/h, not 45 km/h.'
    ], { n: 2, x: ['You walk 1.2 km to the bus stop in 15 minutes, then run the last 0.60 km in 3 minutes. What is your average speed in m/s?', ['Total distance = 1200 m + 600 m = 1800 m.', 'Total time = 15 + 3 = 18 minutes = 18 × 60 = 1080 s.', 'Average speed = 1800 ÷ 1080 = 1.7 m/s.'], '1.7 m/s'], c: ['A car drives at 60 km/h for one hour, then 30 km/h for one hour. What is its average speed?', '90 km in 2 hours = 45 km/h. Here the times are equal, so averaging the speeds happens to give the right answer; with equal distances it would not.'] }],
    ['On a speed–time graph, slope is acceleration and area is distance', [
      'Now put speed up the side. A flat line means a constant speed. A sloping line means the speed is changing: its gradient is the **acceleration**, how many m/s of speed are gained every second (units m/s²).',
      'The area under a speed–time graph is the distance travelled, because distance = speed × time is a rectangle’s height × width. Under a sloping line, split the area into rectangles and triangles.'
    ], { n: 3, e: 'a = \\frac{\\Delta v}{\\Delta t}', x: ['A car speeds up steadily from rest to 20 m/s in 10 s. Find its acceleration and the distance it covers.', ['Acceleration = change in speed ÷ time = 20 ÷ 10 = 2.0 m/s².', 'The area under the graph is a triangle with base 10 s and height 20 m/s.', 'Distance = ½ × 10 × 20 = 100 m.'], '2.0 m/s²; 100 m'], c: ['On a speed–time graph, what does a horizontal line at 15 m/s mean?', 'The object moves at a steady 15 m/s. It is not standing still: that would be a horizontal line at zero.'] }],
    ['Measuring speed honestly', [
      'A stopwatch adds your reaction time, about 0.2 s, at the start and again at the end. Over a short run that is a big fraction of the time, so the speed you calculate can be well off.',
      'Light gates, which start and stop the clock automatically, or a video with a frame counter remove most of that error. Timing over a longer distance also helps: the same 0.2 s is a smaller fraction of a longer time.'
    ], { n: 4, x: ['You time a ball rolling 2.0 m and get 1.6 s, but your timing could be out by 0.2 s either way. Between what speeds could the true speed lie?', ['If the true time is 1.6 s: v = 2.0 ÷ 1.6 = 1.25 m/s.', 'If it is really 1.4 s: v = 2.0 ÷ 1.4 = 1.43 m/s.', 'If it is really 1.8 s: v = 2.0 ÷ 1.8 = 1.11 m/s.'], 'anywhere from about 1.1 to 1.4 m/s'], c: ['Why does timing a ball over 10 m give a more trustworthy speed than over 2 m?', 'The reaction-time error is about the same, 0.2 s, but it is a much smaller fraction of the longer time.'] }]
  ],
  m: [
    ['Mixing minutes or hours with metres.', 'For m/s, put the distance in metres and the time in seconds.'],
    ['Averaging two speeds to get the average speed.', 'Always divide the total distance by the total time.'],
    ['Reading the height of a distance–time graph as the speed.', 'The speed is the slope, not the height.'],
    ['Confusing distance–time and speed–time graphs.', 'Read the vertical axis first: a flat line means stopped on one and steady speed on the other.']
  ]
});

WL.gd('ks3-moments', {
  h: 'Why is a door handle on the edge far from the hinges, and how can a small child balance a grown-up on a seesaw? Forces can turn things as well as push them along, and the turning effect depends on how far from the pivot the force acts.',
  s: [
    ['A moment is the turning effect of a force', [
      'A force applied to something that can turn about a **pivot** tends to rotate it. That turning effect is the **moment** of the force: the force multiplied by the perpendicular distance from the pivot to the line of the force. Its unit is the newton metre (N m).',
      'Push a door near its edge and it swings easily; push next to the hinges and it hardly moves. Same force, much smaller distance, much smaller moment.'
    ], { n: 0, e: 'M = F \\times d', x: ['A 0.25 m spanner is pushed with 40 N at right angles at its end. What moment does it put on the nut? What force gives the same moment with a 0.40 m spanner?', ['M = F × d = 40 × 0.25 = 10 N m.', 'For the same moment with d = 0.40 m: F = M ÷ d = 10 ÷ 0.40 = 25 N.'], '10 N m; only 25 N with the longer spanner'], c: ['Why is it hard to open a door by pushing next to its hinges?', 'The distance from the pivot is tiny, so even a large force makes only a small moment.'] }],
    ['Clockwise and anticlockwise', [
      'Each force tries to turn the object one way or the other about the pivot. On a seesaw, a child on the left turns it anticlockwise and a child on the right turns it clockwise.',
      'A force whose line passes straight through the pivot has no turning effect at all.'
    ], { n: 1, c: ['A force acts along a line that goes straight through the pivot. What is its moment?', 'Zero, because the perpendicular distance from the pivot to the force’s line is zero.'] }],
    ['Balanced: clockwise moments equal anticlockwise moments', [
      'If an object is balanced and not starting to turn, the total clockwise moment about the pivot equals the total anticlockwise moment. This is the **principle of moments**.',
      'For two masses on a beam, each weight is m × g, and g is on both sides of the balance, so it cancels: you can balance masses directly, m₁d₁ = m₂d₂.'
    ], { n: 2, e: '\\textstyle\\sum M_{\\text{clockwise}} = \\sum M_{\\text{anticlockwise}}', x: ['A 30 kg child sits 2.0 m from the pivot of a seesaw. Where must a 50 kg adult sit to balance it?', ['Balance: m₁ × d₁ = m₂ × d₂ (g cancels).', '30 × 2.0 = 50 × d₂, so d₂ = 60 ÷ 50.', 'd₂ = 1.2 m, on the other side of the pivot.'], '1.2 m from the pivot'], c: ['Two 10 N weights hang 0.30 m to the left of a pivot. Where must a single 20 N weight hang to balance them?', '0.30 m to the right: the anticlockwise moment is 20 N × 0.30 m = 6.0 N m, and 20 N × d = 6.0 N m gives d = 0.30 m.'] }],
    ['Levers trade force for distance', [
      'A **lever** lets a small force balance a large one by acting further from the pivot. Wheelbarrows, crowbars, scissors and your own forearm are all levers.',
      'Nothing comes for free. If your hand is nine times further from the pivot than the load, you push with a ninth of the force, but your hand moves nine times as far. The energy you put in equals the energy given to the load, apart from friction.'
    ], { n: 3, x: ['A crowbar has the load 0.10 m from the pivot and your hand 0.90 m from it. What force must you apply to lift a 450 N load?', ['The moments must balance: F × 0.90 = 450 × 0.10.', '450 × 0.10 = 45 N m, so F = 45 ÷ 0.90.', 'F = 50 N.'], '50 N, a ninth of the load'], c: ['With that crowbar, how far must your hand move to raise the load by 2 cm?', '18 cm. Your hand is nine times further from the pivot, so it moves nine times as far.'] }],
    ['Centre of mass and toppling', [
      'An object’s weight acts as if it all pulled down at one point, the **centre of mass**. For a uniform ruler it is in the middle.',
      'An object topples when the line of its weight passes outside its base: then the weight makes a moment that turns it further over. A low centre of mass and a wide base make things stable, which is why racing cars are low and wide.'
    ], { n: 4, c: ['Why is a bus with heavy luggage on its roof more likely to tip over on a bend?', 'The luggage raises the centre of mass, so a smaller tilt carries the line of the weight outside the base of the wheels.'] }]
  ],
  m: [
    ['Using the length of the bar instead of the distance from the pivot.', 'd is measured from the pivot to the line of the force, at right angles to the force.'],
    ['Putting a mass in kilograms into M = F × d.', 'Moments need forces in newtons (weight = m × g); only when balancing two masses does g cancel.'],
    ['Forgetting the beam’s own weight.', 'A uniform beam’s weight acts at its middle and has a moment unless the pivot is at the middle.']
  ]
});

WL.gd('ks3-pressure', {
  h: 'Why does a sharp knife cut while a blunt one squashes, and why do your ears hurt at the bottom of a swimming pool? Pressure tells you how concentrated a force is, and in liquids and gases it grows the deeper you go.',
  s: [
    ['Pressure is force spread over an area', [
      'Pressure is the force divided by the area it acts on. Its unit is the **pascal**: 1 Pa = 1 N/m², a very small pressure, about that of a sheet of paper lying on a table.',
      'A sharp knife has a tiny edge, so a modest force makes a huge pressure that parts the food. Snowshoes and tractor tyres do the opposite: a large area keeps the pressure low so they do not sink in.'
    ], { n: 0, e: 'p = \\frac{F}{A}', x: ['A person weighing 600 N stands on two feet with a total area of 0.040 m². What pressure do they put on the floor? What if they stand on one foot?', ['p = F ÷ A = 600 ÷ 0.040 = 15 000 Pa.', 'One foot has half the area, 0.020 m², so p = 600 ÷ 0.020 = 30 000 Pa.'], '15 000 Pa (15 kPa); 30 000 Pa on one foot'], c: ['Why do tractors have very wide tyres?', 'The wide tyres spread the tractor’s weight over a large area, so the pressure on the soil is small and the tractor does not sink in.'] }],
    ['In a liquid, pressure grows with depth', [
      'The deeper you go in a liquid, the more liquid there is above you pressing down, so the pressure rises. It depends only on the depth h, the density ρ of the liquid and g, not on the width or shape of the container.',
      'Pressure in a liquid pushes equally in every direction: down on the bottom, sideways on the walls, and up on anything under the surface.'
    ], { n: 1, e: 'p = \\rho\\, g\\, h', x: ['What extra pressure does the water add at the bottom of a 2.0 m deep swimming pool? (Density of water 1000 kg/m³, g = 10 N/kg.)', ['p = ρ × g × h = 1000 × 10 × 2.0.', 'p = 20 000 Pa.'], '20 000 Pa (20 kPa), about a fifth of the air pressure above it'], c: ['A tall thin tube and a wide tank both hold water 1 m deep. At which bottom is the pressure bigger?', 'They are the same: the pressure depends on the depth and the liquid, not on how wide the container is.'] }],
    ['The air presses on us too', [
      'Air has weight. The column of air above each square metre of ground weighs about 101 000 N, so the atmospheric pressure at sea level is about 101 kPa.',
      'We do not feel it because it pushes on us from all sides, and from inside our bodies too. Higher up there is less air above you, so the pressure is lower, and your ears pop as the pressure across your eardrums changes.'
    ], { n: 2, c: ['Why do sealed crisp packets puff up on a mountain or in an aeroplane?', 'The air outside is at a lower pressure up there, while the air inside the packet still has its sea-level pressure, so it pushes the packet outwards.'] }],
    ['Upthrust: why things float', [
      'The bottom of an object under water is deeper than its top, so the water pushes up on the bottom harder than it pushes down on the top. The difference is an upward force, the **upthrust**.',
      'Archimedes found that the upthrust equals the weight of the liquid the object pushes aside. An object floats if it can push aside its own weight of liquid before it is completely under.'
    ], { n: 3, x: ['A 0.50 kg block of wood floats in water. What upthrust acts on it, and what volume of water does it push aside? (g = 10 N/kg; water 1000 kg/m³.)', ['It floats, so upthrust = weight = 0.50 × 10 = 5.0 N.', 'The water pushed aside weighs 5.0 N, so its mass is 0.50 kg.', 'Volume = mass ÷ density = 0.50 ÷ 1000 = 0.00050 m³, which is 500 cm³.'], '5.0 N; 500 cm³ of water'], c: ['A stone sinks. Is the upthrust on it zero?', 'No. Water still pushes up on it with the weight of the water it displaces; that is just less than the stone’s own weight, so it sinks. This is why stones feel lighter under water.'] }],
    ['Hydraulics multiply a force', [
      'Liquids hardly squash, so a pressure applied at one place is passed through the whole liquid. Push a small piston with a small force and the same pressure acts on a large piston, giving a large force: F₁/A₁ = F₂/A₂.',
      'As with levers, you pay with distance: the small piston must move much further than the large one. Car brakes and hydraulic jacks work this way.'
    ], { n: 4, e: '\\frac{F_1}{A_1} = \\frac{F_2}{A_2}', x: ['A hydraulic jack has a small piston of area 0.0010 m² and a large one of 0.050 m². What force on the small piston lifts a car weighing 10 000 N?', ['The pressure is the same on both pistons.', 'Pressure under the car = 10 000 ÷ 0.050 = 200 000 Pa.', 'Force on the small piston = 200 000 × 0.0010 = 200 N.'], '200 N, fifty times smaller than the car’s weight'], c: ['How far must the small piston move to raise the car by 1.0 cm?', '50 cm. The volume of liquid pushed across is the same on both sides, and the small piston is fifty times narrower, so it moves fifty times further.'] }]
  ],
  m: [
    ['Using cm² with newtons and calling the answer pascals.', 'Convert the area to m² first: 1 cm² = 0.0001 m².'],
    ['Thinking a wider container gives more pressure at the bottom.', 'Only the depth and the liquid matter in p = ρgh.'],
    ['Saying the upthrust always equals the object’s weight.', 'It equals the weight of liquid pushed aside; that equals the object’s weight only when it floats.']
  ]
});
WL.gd('ks3-density', {
  h: 'A steel ship weighing thousands of tonnes floats, yet a small pebble sinks. So floating cannot be about how heavy something is. It is about density: how much mass is packed into each cubic centimetre, compared with the liquid around it.',
  s: [
    ['Density is mass per volume', [
      '**Density** tells you how much mass is packed into each unit of volume: density = mass ÷ volume. In grams and cubic centimetres, water has a density of 1 g/cm³: each cubic centimetre of water has a mass of one gram.',
      'Iron is about 7.9 g/cm³, so a cube of iron is nearly eight times heavier than the same cube of water. Cork is only about 0.25 g/cm³.'
    ], { n: 0, e: '\\rho = \\frac{m}{V}\\qquad \\text{density} = \\frac{\\text{mass}}{\\text{volume}}', x: ['A metal block measures 2.0 cm × 3.0 cm × 5.0 cm and has a mass of 237 g. What is its density, and which metal might it be?', ['Volume = 2.0 × 3.0 × 5.0 = 30 cm³.', 'Density = mass ÷ volume = 237 ÷ 30 = 7.9 g/cm³.', 'That matches iron (or steel).'], '7.9 g/cm³, probably iron or steel'], c: ['A 1 kg bag of feathers and a 1 kg bar of gold: which has the greater density?', 'The gold. Both have the same mass, but the gold squeezes it into a far smaller volume.'] }],
    ['Why some materials are denser than others', [
      'Density depends on two things: how heavy each particle is, and how tightly the particles are packed. In solids and liquids the particles touch, so these are dense. In a gas the particles are far apart, so gases are very light for their size: air is about 800 times less dense than water.'
    ], { n: 1, c: ['Why is ice slightly less dense than liquid water, so that it floats?', 'When water freezes its molecules lock into an open pattern with more space between them than in the liquid. Water is unusual in this: most solids are denser than their liquids.'] }],
    ['Measuring the volume of an awkward shape', [
      'For a box shape, measure length, width and height and multiply. For a stone or a key, lower it into a measuring cylinder of water: the water level rises by exactly the object’s volume, because the object pushes that much water out of the way. This is the **displacement** method.'
    ], { n: 2, e: 'V = V_{\\text{after}} - V_{\\text{before}}', x: ['A stone of mass 54 g is lowered into a measuring cylinder, and the water rises from 50 cm³ to 70 cm³. What is the stone’s density?', ['Volume of stone = 70 − 50 = 20 cm³.', 'Density = 54 ÷ 20 = 2.7 g/cm³.'], '2.7 g/cm³'], c: ['Why must the stone be completely under the water when you read the level?', 'Only the part under the water pushes water aside, so a stone sticking out would give too small a volume.'] }],
    ['Floating and sinking', [
      'Water pushes up on anything in it with a force called **upthrust**. An object settles until the upthrust balances its weight. If it is less dense than the water, that happens while part of it is still above the surface, so it floats. If it is denser, even the upthrust when it is completely under is not enough, so it sinks.',
      'Liquids that do not mix settle in layers by density: oil floats on water, and water floats on syrup.'
    ], { n: 3, x: ['An apple has a mass of 150 g and a volume of 180 cm³. Will it float in water?', ['Density = 150 ÷ 180 = 0.83 g/cm³.', 'That is less than water’s 1 g/cm³.'], 'Yes, it floats, with most of it under the surface'], c: ['A plastic cube of density 1.2 g/cm³ is dropped into water, then into syrup of density 1.4 g/cm³. What happens each time?', 'It sinks in the water (1.2 is more than 1.0) but floats in the syrup (1.2 is less than 1.4).'] }],
    ['How a steel ship floats', [
      'Steel is far denser than water, but a ship is mostly a steel shell full of air. What matters is its **average density**: the total mass divided by the total volume, air included. That is less than water’s, so the ship floats.',
      'If water floods in through a hole, it replaces the air, the average density rises above water’s, and the ship sinks.'
    ], { n: 4, x: ['A small steel boat has a mass of 300 kg and a total volume (hull plus the air inside) of 1.5 m³. Water has a density of 1000 kg/m³. Will it float?', ['Average density = 300 ÷ 1.5 = 200 kg/m³.', 'That is far less than 1000 kg/m³.'], 'Yes: its average density is a fifth of water’s'], c: ['Why does a ball of modelling clay sink, while the same clay shaped into a bowl floats?', 'The bowl encloses air, so its total volume is much bigger for the same mass: its average density drops below water’s.'] }]
  ],
  m: [
    ['Saying heavy things sink and light things float.', 'Compare densities, not weights: a huge log floats and a tiny pin sinks.'],
    ['Forgetting to subtract the starting water level.', 'The object’s volume is the rise in level, not the final reading.'],
    ['Mixing kg with cm³.', 'Use g with cm³ (water = 1 g/cm³) or kg with m³ (water = 1000 kg/m³).']
  ]
});

WL.gd('ks3-particles', {
  h: 'Ice, water and steam are the same water molecules. So why is one hard, one runny and one invisible? Everything is made of tiny particles that never stop moving, and how they are arranged and how fast they move explains density, squashing, melting, boiling, and why you can smell toast from the next room.',
  s: [
    ['Three states, one set of particles', [
      'In a **solid** the particles are packed closely in a regular pattern and only vibrate about fixed places, so a solid keeps its shape. In a **liquid** they are still close together but can slide past each other, so a liquid flows and takes the shape of its container. In a **gas** the particles are far apart and zoom about in all directions, so a gas spreads out to fill any space.',
      'This explains squashing: solids and liquids hardly squash because their particles already touch, while a gas squashes easily because there is mostly empty space between its particles.'
    ], { n: 0, c: ['Why can you squash the air in a sealed syringe but not the water?', 'Air particles are far apart with empty space between them, so pushing them closer is easy. Water particles already touch each other.'] }],
    ['Density: mass in each cubic metre', [
      'Density is mass divided by volume. It tells you how tightly matter is packed. Water has a density of 1000 kg/m³, which is the same as 1 g/cm³.',
      'To convert, remember that 1 m³ = 1 000 000 cm³ and 1 kg = 1000 g, so 1 g/cm³ = 1000 kg/m³.'
    ], { n: 1, e: '\\rho = \\frac{m}{V}\\qquad m = \\rho V', x: ['Aluminium has a density of 2.7 g/cm³. What is that in kg/m³, and what is the mass of a 0.50 m³ block?', ['2.7 g/cm³ × 1000 = 2700 kg/m³.', 'm = ρ × V = 2700 × 0.50 = 1350 kg.'], '2700 kg/m³; 1350 kg'], c: ['A material has a density of 500 kg/m³. Will it float on water?', 'Yes: 500 kg/m³ is less than water’s 1000 kg/m³.'] }],
    ['Why gases are so much less dense', [
      'In a solid or liquid each particle takes up about its own size. In a gas each particle has a much bigger space to itself. The particles are the same, so the gas is less dense by the ratio of those spaces.',
      'Liquid water at 100 °C (958 kg/m³) is about 1600 times denser than steam (0.6 kg/m³). Since volume grows with the cube of the spacing, the steam molecules are about 12 times further apart than in the liquid, because 12 × 12 × 12 ≈ 1700.'
    ], { n: 2, c: ['If gas particles were 10 times further apart than in the liquid, how many times less dense would the gas be?', 'About 1000 times, because 10 × 10 × 10 = 1000: the volume per particle grows with the cube of the spacing.'] }],
    ['Changing state keeps the particles and the mass', [
      'Melting, freezing, boiling, evaporating, condensing and subliming all rearrange the same particles: no mass is gained or lost. Melt 100 g of ice and you get 100 g of water.',
      'While a substance changes state, its temperature stays the same even though you keep heating it. The energy goes into pulling the particles apart against the forces holding them together, not into making them move faster.'
    ], { n: 3, c: ['You heat a beaker of ice and water steadily. What does the thermometer show until all the ice has melted?', 'It stays at 0 °C. The energy is going into breaking the bonds that hold the ice together, so the temperature only rises once all the ice has melted.'] }],
    ['Evidence that particles really move', [
      'A smell spreads across a room by **diffusion**: scent particles bump into air particles and wander outwards at random. Under a microscope, specks of smoke or pollen jiggle about for no visible reason. This **Brownian motion** is caused by invisible air or water molecules hitting them unevenly from different sides.',
      'Einstein worked out the maths of Brownian motion in 1905, and Jean Perrin’s measurements a few years later convinced the last doubters that atoms are real.'
    ], { n: 4, c: ['Why does a drop of ink spread faster in hot water than in cold water?', 'The particles move faster in hot water, so they bump into the ink particles harder and more often and carry them around more quickly.'] }]
  ],
  m: [
    ['Saying the particles themselves expand when something is heated.', 'The particles stay the same size; they move faster and spread further apart.'],
    ['Thinking mass is lost when water evaporates.', 'The particles are still there, now spread through the air as water vapour.'],
    ['Saying the temperature rises during melting.', 'It stays constant until the change of state is complete.']
  ]
});

WL.gd('ks3-heat', {
  h: 'A bath of warm water and a cup of boiling water: which holds more heat? The answer is the bath, even though the cup is hotter. Temperature and thermal energy are different things, and energy always flows from hotter to colder, by conduction, convection or radiation.',
  s: [
    ['Temperature is not the same as thermal energy', [
      '**Temperature**, measured in °C with a thermometer, tells you how fast the particles are moving on average. **Thermal energy** depends on that and on how many particles there are.',
      'So a full bath at 40 °C holds far more thermal energy than a cup of water at 90 °C: each particle is slower, but there are thousands of times more of them.'
    ], { n: 0, c: ['A spark from a sparkler is at over 1000 °C, yet it does not burn your hand. Why?', 'The spark is very hot, but it is so tiny that it holds very little thermal energy, so it cannot heat your skin much.'] }],
    ['Energy flows from hot to cold', [
      'When two things at different temperatures touch, energy is transferred from the hotter one to the colder one until they reach the same temperature: **thermal equilibrium**. A cup of tea cools to room temperature; it never heats itself up.',
      'If you mix hot and cold water, the energy lost by the hot water equals the energy gained by the cold water, so the mixture ends up between the two temperatures, closer to whichever there was more of.'
    ], { n: 1, e: 'T_{\\text{mix}} = \\frac{m_1T_1 + m_2T_2}{m_1 + m_2}', x: ['You mix 200 g of water at 80 °C with 300 g of water at 20 °C. What is the final temperature, if no energy escapes?', ['T = (m₁T₁ + m₂T₂) ÷ (m₁ + m₂).', '= (200 × 80 + 300 × 20) ÷ (200 + 300) = (16 000 + 6000) ÷ 500.', '= 22 000 ÷ 500 = 44 °C.'], '44 °C, nearer 20 °C because there was more cold water'], c: ['Does cold flow out of a fridge into your hand when you touch a frozen pea?', 'No. Energy flows from your warmer hand into the pea. Your hand feels cold because it is losing energy.'] }],
    ['Conduction, convection and radiation', [
      '**Conduction**: in a solid, faster-vibrating particles at the hot end jostle their neighbours and pass the energy along. Metals conduct very well; air, wood and plastic conduct poorly (they are **insulators**).',
      '**Convection**: in a liquid or gas, warm fluid expands, becomes less dense and rises, and cooler fluid sinks to take its place, setting up a circulating current. **Radiation**: every warm object gives out infrared waves, which need no particles at all; this is how the Sun warms the Earth across empty space.'
    ], { n: 2, c: ['Why is a radiator usually placed low down near a cold window?', 'Air warmed by the radiator rises and spreads across the room, while cooler air sinks and flows back to it: the radiator drives a convection current that carries heat round the whole room.'] }],
    ['Keeping warm and keeping cool', [
      'Most insulation works by trapping air, a poor conductor, in small pockets so that it cannot move and carry energy by convection. Woolly jumpers, loft insulation and double glazing all do this.',
      'Shiny surfaces reflect infrared and dull dark surfaces absorb and emit it well, which is why emergency blankets are shiny.'
    ], { n: 3, c: ['Why do two thin jumpers keep you warmer than one thick one of the same total thickness?', 'The layer of air trapped between the jumpers adds extra insulation.'] }],
    ['Evaporation cools', [
      'Particles in a liquid move at different speeds. The fastest ones near the surface can escape: that is **evaporation**. Because the fastest particles leave, the average speed of those left behind drops, so the liquid cools.',
      'Sweat evaporating from your skin cools you down. Evaporation is faster when it is warm, when the air is dry, and when a breeze carries the vapour away.'
    ], { n: 4, c: ['Why does a wet swimsuit feel cold on a windy beach, even on a warm day?', 'The wind carries away water vapour, so evaporation is fast, and evaporation takes the fastest-moving particles away, cooling the water left on your skin.'] }]
  ],
  m: [
    ['Using “heat” and “temperature” as if they mean the same.', 'Temperature is how hot; thermal energy also depends on how much stuff there is.'],
    ['Saying cold flows in.', 'Energy flows from hot to cold; something feels cold because it takes energy from you.'],
    ['Saying heat rises.', 'Warm fluid rises because it is less dense; heat itself can travel in any direction.']
  ]
});

WL.gd('ks3-waves', {
  h: 'Drop a cork onto a pond as a ripple passes and it bobs up and down but goes nowhere. The water stays put, yet something crosses the pond. A wave carries energy without carrying the material, and ripples, sound, light and earthquakes can all be described with the same three numbers: speed, frequency and wavelength.',
  s: [
    ['A wave moves energy, not the material', [
      'In a Mexican wave each person only stands up and sits down, yet the wave runs right round the stadium. A water wave is the same: each bit of water moves up and down, and only the pattern travels.',
      'So a wave is a travelling disturbance. What travels is energy and the shape of the disturbance, not the stuff it moves through.'
    ], { n: 0, c: ['A boat is anchored at sea as waves pass under it. Does the boat drift towards the shore with the waves?', 'No. It mostly bobs up and down in place, because the water itself is not travelling towards the shore; the energy is.'] }],
    ['Transverse and longitudinal waves', [
      'In a **transverse** wave the particles move at right angles to the direction the wave travels: ripples on water, waves on a rope, and light.',
      'In a **longitudinal** wave the particles move backwards and forwards along the direction of travel, bunching into **compressions** and spreading into **rarefactions**. Sound is longitudinal: a loudspeaker cone pushes and pulls the air in front of it.'
    ], { n: 1, c: ['A slinky spring is pushed and pulled along its length. Which kind of wave is that?', 'Longitudinal: the coils move back and forth along the same line the wave travels.'] }],
    ['Describing a wave: amplitude, wavelength, frequency', [
      'The **amplitude** is the biggest distance a point moves from its rest position; a bigger amplitude carries more energy. The **wavelength** λ is the distance from one crest to the next. The **frequency** f is how many waves pass a point each second, in hertz (Hz).',
      'The **period** T is the time for one complete wave, so T = 1/f: a wave with a frequency of 50 Hz has a period of 1/50 = 0.02 s.'
    ], { n: 2, e: 'T = \\frac{1}{f}', c: ['A wave’s frequency doubles. What happens to its period?', 'It halves, because T = 1/f.'] }],
    ['Wave speed = frequency × wavelength', [
      'In one period, every point completes one wobble, and the pattern moves forward by exactly one wavelength. Speed is distance ÷ time, so the wave speed is λ ÷ T, which is the same as frequency × wavelength.'
    ], { n: 3, e: 'v = f\\,\\lambda', x: ['A wave on a rope has a frequency of 2.0 Hz and a wavelength of 1.5 m. How fast does it travel? What wavelength would a 3.0 Hz wave have on the same rope?', ['v = f × λ = 2.0 × 1.5 = 3.0 m/s.', 'On the same rope the speed is the same, so λ = v ÷ f = 3.0 ÷ 3.0 = 1.0 m.'], '3.0 m/s; 1.0 m'], c: ['A radio station broadcasts at 100 000 000 Hz, and radio waves travel at 300 000 000 m/s. What is the wavelength?', 'λ = v ÷ f = 300 000 000 ÷ 100 000 000 = 3.0 m.'] }],
    ['Sound needs something to travel through', [
      'Sound needs particles to pass the vibration on, so it cannot cross a vacuum. It travels fastest where particles are tightly linked: about 340 m/s in air, 1500 m/s in water and 5000 m/s in steel.',
      'Pitch is set by frequency, loudness by amplitude. Young people hear from about 20 Hz to 20 000 Hz; sound above that is **ultrasound**, used for baby scans and sonar.'
    ], { n: 4, x: ['A sound wave in air has a frequency of 680 Hz. What is its wavelength? (Speed of sound 340 m/s.)', ['λ = v ÷ f.', '= 340 ÷ 680 = 0.50 m.'], '0.50 m'], c: ['Astronauts on a spacewalk talk by radio, not by shouting. Why?', 'Space is a vacuum, with no particles to carry sound. Radio waves are electromagnetic and need no particles.'] }]
  ],
  m: [
    ['Saying the water travels with the wave.', 'Only the energy and the pattern travel; each bit of water moves up and down in place.'],
    ['Measuring wavelength from a crest to the next trough.', 'Wavelength is crest to crest (or trough to trough): one whole wave.'],
    ['Thinking a higher frequency means a faster wave.', 'In one material the speed stays the same; a higher frequency means a shorter wavelength.']
  ]
});

WL.gd('ks3-sound', {
  h: 'You see the lightning before you hear the thunder, a ringing bell in a jar goes silent as the air is pumped out, and noise-cancelling headphones make a noise to create silence. All three follow from one idea: sound is a vibration passed from particle to particle.',
  s: [
    ['Sound is a vibration passed along', [
      'A vibrating object, such as a guitar string or a loudspeaker, pushes on the air next to it. Those particles push on their neighbours, and the vibration passes along as a wave. The particles only jiggle back and forth; it is the energy that travels.',
      'With no particles there is nothing to pass the vibration on, so sound cannot cross a vacuum. Space is silent.'
    ], { n: 0, c: ['An alarm clock rings inside a jar, and the air is pumped out. Why does the sound fade, although you can still see the hammer hitting the bell?', 'Sound needs particles to carry it; as the air is removed there is less and less to pass the vibration to the glass. Light needs no particles, so you can still see it.'] }],
    ['The speed of sound', [
      'Sound travels at about 340 m/s in air. That is fast, but light is almost a million times faster, so you see lightning practically at once and hear the thunder later.',
      'Sound goes faster in water (about 1500 m/s) and faster still in solids such as steel (about 5000 m/s), because the particles are closer together and more tightly linked.'
    ], { n: 1, x: ['You see a lightning flash and hear the thunder 3.0 s later. How far away was the lightning?', ['The light arrives almost instantly, so the 3.0 s is the sound’s travel time.', 'Distance = speed × time = 340 × 3.0 = 1020 m.'], 'about 1 km away'], c: ['Why can you hear a train coming by putting your ear to the rail (never do this!) before you hear it through the air?', 'Sound travels much faster in steel than in air, so it arrives through the rail first.'] }],
    ['Echoes: there and back again', [
      'An echo is sound reflected from a hard surface. The sound travels to the surface and back, so it covers twice the distance to the surface. That is why the distance is half of speed × time.',
      'Soft materials such as curtains and carpets absorb sound and reduce echoes; ships and bats use echoes to find things they cannot see.'
    ], { n: 2, e: 'd = \\frac{v\\,t}{2}', x: ['A ship’s sonar pulse comes back from the sea floor 0.80 s after it is sent. Sound travels at 1500 m/s in water. How deep is the sea?', ['The pulse goes down and back up, so the depth is half the total distance.', 'd = v × t ÷ 2 = 1500 × 0.80 ÷ 2.', 'd = 600 m.'], '600 m'], c: ['You clap 85 m from a wall. How long until you hear the echo? (Sound: 340 m/s.)', 'The sound travels 170 m there and back, so t = 170 ÷ 340 = 0.50 s.'] }],
    ['Loudness and pitch', [
      'On an oscilloscope screen a sound appears as a wave. A taller wave (bigger **amplitude**) is a louder sound. More waves squeezed onto the screen (higher **frequency**) is a higher pitch.',
      'Frequency is measured in hertz (Hz): vibrations per second. Humans hear from about 20 Hz to 20 000 Hz, and the top limit falls with age. Dogs and bats hear much higher; sound above our range is **ultrasound**.'
    ], { n: 3, x: ['A tuning fork vibrates 440 times a second. What is its frequency, and how long does one vibration take?', ['Frequency = 440 vibrations per second = 440 Hz.', 'Time for one vibration = 1 ÷ 440 = 0.0023 s (2.3 milliseconds).'], '440 Hz; 0.0023 s'], c: ['A trace on an oscilloscope gets taller but keeps the same spacing between peaks. How has the sound changed?', 'It is louder (bigger amplitude) but the pitch is the same (same frequency).'] }],
    ['Waves can add up or cancel', [
      'When two sound waves meet, they add together. Where crest meets crest, they reinforce and the sound is louder. Where crest meets trough, they cancel and it is quieter.',
      'Noise-cancelling headphones listen to the noise outside and play the opposite wave, crest for trough, so the two cancel before reaching your ear.'
    ], { n: 4, c: ['Two loudspeakers play the same note. As you walk across the room, the sound gets louder and quieter. Why?', 'At some places the waves from the two speakers arrive crest to crest and add up; at others they arrive crest to trough and cancel.'] }]
  ],
  m: [
    ['Forgetting to halve the distance for an echo.', 'The sound goes there and back: distance to the wall = speed × time ÷ 2.'],
    ['Saying a louder sound has a higher pitch.', 'Loudness depends on amplitude; pitch depends on frequency.'],
    ['Thinking sound travels fastest in air.', 'It is fastest in solids, slower in liquids and slowest in gases.']
  ]
});
WL.gd('ks3-light', {
  h: 'Why do shadows have sharp edges, why can you see a page from any angle but your face only in a mirror, and why does your mirror image seem to stand behind the glass? Light travels in straight lines and reflects by one simple law, and that law explains every one of these.',
  s: [
    ['Light travels in straight lines, very fast', [
      'Shadows have sharp edges because light travels in straight lines, so we can draw it as **rays**: straight lines with arrows. Light is also astonishingly fast, about 300 000 km every second (3.0 × 10⁸ m/s), and it needs nothing to travel through: it crosses empty space from the Sun.',
      'Even at that speed, sunlight takes about 8.3 minutes to reach us, because the Sun is 150 million km away.'
    ], { n: 0, x: ['The Moon is about 384 000 km away. How long does light take to reach us from the Moon?', ['Convert to metres: 384 000 km = 384 000 000 m.', 'Time = distance ÷ speed = 384 000 000 ÷ 300 000 000.', '= 1.28 s.'], 'about 1.3 s'], c: ['Why can light reach us from the Sun when sound from it cannot?', 'Light needs no material to travel through, so it can cross the vacuum of space; sound needs particles.'] }],
    ['We see things when their light enters our eyes', [
      '**Luminous** objects, such as the Sun, a flame or a screen, give out their own light. Everything else is seen because light from a source bounces off it and some of that light enters our eyes. Our eyes receive light; they do not send anything out.',
      'That is why you cannot see anything in a completely dark room, however hard you look.'
    ], { n: 1, c: ['Is the Moon luminous?', 'No. We see it because sunlight reflects off it into our eyes.'] }],
    ['The law of reflection: angle in equals angle out', [
      'Draw the **normal**, a line at right angles to the mirror where the ray hits it. The angle between the incoming ray and the normal is the **angle of incidence** i; the angle between the reflected ray and the normal is the **angle of reflection** r.',
      'Experiments always give the same result: the two angles are equal. Both are measured from the normal, never from the mirror’s surface.'
    ], { n: 2, e: 'i = r', x: ['A ray hits a mirror making an angle of 35° with the mirror’s surface. What is the angle of reflection?', ['Angles are measured from the normal, which is at 90° to the mirror.', 'Angle of incidence = 90° − 35° = 55°.', 'Angle of reflection = angle of incidence = 55°.'], '55°, not 35°'], c: ['A ray hits a mirror along the normal (i = 0°). Where does it go?', 'Straight back along the same line, because r = i = 0°.'] }],
    ['Why i = r: light takes the shortest route', [
      'Imagine light going from a lamp to a mirror and then to your eye. Of all the possible points on the mirror it could bounce from, the one where i = r gives the shortest total path. Hero of Alexandria noticed this two thousand years ago.',
      'It is the first example of a deep idea in physics: light picks the path that takes the least time.'
    ], { n: 3, c: ['If light took any other bounce point than the one with i = r, what would be true of its path?', 'It would be longer, and take longer, than the path with i = r.'] }],
    ['Smooth and rough surfaces', [
      'A mirror is very smooth, so parallel rays stay parallel after reflecting (**specular** reflection) and you see a clear image. Paper is rough on a tiny scale: each bit still obeys i = r, but the surfaces face all different ways, so the light is scattered in every direction (**diffuse** reflection).',
      'That is why you can read a page from any angle but cannot see your face in it.'
    ], { n: 4, c: ['Why does a wet road at night dazzle drivers more than a dry one?', 'The water makes the road smooth, so it reflects the headlights of oncoming cars like a mirror straight into drivers’ eyes, instead of scattering the light.'] }],
    ['Images in a flat mirror', [
      'Rays from an object reflect off the mirror and spread out as if they came from a point behind it. Your brain traces them back in straight lines and sees an **image** there.',
      'The image is the same size, the same way up, and as far behind the mirror as the object is in front. It is **virtual**: no light actually reaches the place behind the mirror, so it cannot be caught on a screen.'
    ], { n: 5, x: ['You stand 2.0 m in front of a flat mirror. How far are you from your image? You then step 0.50 m towards the mirror. How far are you from your image now?', ['The image is as far behind the mirror as you are in front: 2.0 m behind.', 'Distance from you to the image = 2.0 + 2.0 = 4.0 m.', 'After the step you are 1.5 m from the mirror, so the image is 1.5 m behind it: 1.5 + 1.5 = 3.0 m.'], '4.0 m, then 3.0 m'], c: ['Why is the word AMBULANCE written backwards on the front of ambulances?', 'So that drivers in front, looking in their mirrors, see it the right way round: a mirror swaps front and back, which makes writing appear reversed.'] }]
  ],
  m: [
    ['Measuring angles from the mirror surface.', 'Always measure from the normal, the line at 90° to the mirror.'],
    ['Saying we see because our eyes send out light.', 'We see because light from objects enters our eyes.'],
    ['Putting the image on the surface of the mirror.', 'The image is as far behind the mirror as the object is in front.']
  ]
});

WL.gd('ks3-colour', {
  h: 'Shine sunlight through a glass prism and a rainbow fans out on the wall. Put a green leaf under red light and it looks black. Both happen because white light is a mixture of colours, and every object, filter and eye picks out some of them.',
  s: [
    ['White light is a mixture: dispersion', [
      'When white light goes through a prism, each colour bends (refracts) by a slightly different amount: violet bends most and red least. The colours fan out into a **spectrum**: red, orange, yellow, green, blue, indigo, violet. This spreading is called **dispersion**.',
      'Newton showed in 1666 that a second prism can put the colours back together into white light, proving the colours were in the white light all along. Rainbows are the same effect, with raindrops acting as tiny prisms.'
    ], { n: 0, c: ['In a rainbow, which colour is bent the least?', 'Red, which is why it is on the outside edge of the rainbow.'] }],
    ['Adding coloured lights', [
      'The **primary colours of light** are red, green and blue. Shining them together on a white screen adds them: red + green = yellow, red + blue = magenta, green + blue = cyan, and all three together = white.',
      'This is how every screen works: each pixel is three tiny lights, red, green and blue, mixed in different strengths.'
    ], { n: 1, c: ['A red spotlight and a green spotlight overlap on a white wall. What colour is the overlap?', 'Yellow.'] }],
    ['Filters take colours away', [
      'A coloured **filter** lets its own colour through and absorbs the rest. A red filter passes only red light.',
      'Filters subtract, so two of them can block everything: white light through a red filter and then a blue filter gives no light at all. The red filter removes the blue, and the blue filter removes the red.'
    ], { n: 2, c: ['White light passes through a green filter and then another green filter. What comes out?', 'Green light: the second filter lets the green through as well.'] }],
    ['Objects look coloured because of what they reflect', [
      'A surface reflects some colours and absorbs others, and we see the colours it reflects. A red apple reflects red and absorbs the rest. A white surface reflects all colours; a black one absorbs them all.',
      'Under coloured light, things can change colour. In pure red light a green leaf has no green light to reflect, and it absorbs the red, so it looks black.'
    ], { n: 3, x: ['A white T-shirt has red writing on it. What does it look like in red light? In blue light?', ['In red light: the white shirt reflects the red, so it looks red; the red writing also reflects red, so it looks red too, and the writing disappears.', 'In blue light: the white shirt reflects the blue, so it looks blue; the red writing absorbs blue and reflects nothing, so it looks black.'], 'All red, with the writing invisible; then a blue shirt with black writing'], c: ['Why does a black car get hotter in sunshine than a white one?', 'Black absorbs all the colours of the sunlight, so it takes in more energy; white reflects them.'] }],
    ['How we see colour', [
      'Our eyes have three kinds of colour-sensing cells, called cones, most sensitive to red, green and blue light. The brain compares their signals to produce the colour we see.',
      'That is why a mix of red and green light looks exactly like yellow light to us: both excite the red and green cones in the same way.'
    ], { n: 4, c: ['A screen has no yellow pixels. How does it show a yellow banana?', 'It lights the red and green parts of each pixel together, which our cones read as yellow.'] }]
  ],
  m: [
    ['Mixing lights like paints.', 'Lights add: red + green light make yellow. Paints and filters subtract, so they follow different rules.'],
    ['Saying a filter adds colour to light.', 'A filter can only remove colours; it passes its own colour and absorbs the rest.'],
    ['Thinking an object’s colour stays the same in any light.', 'It can only reflect colours that are in the light shining on it.']
  ]
});

WL.gd('ks3-circuits', {
  h: 'Flick a switch and a lamp lights at once, although the electrons in the wire crawl along slower than a snail. A circuit is an energy delivery system: current tells you how much charge flows past each second, voltage tells you how much energy each bit of charge carries, and together they give the power.',
  s: [
    ['Current: how much charge flows each second', [
      'Electric **charge** is measured in coulombs (C). In metal wires it is carried by electrons, each with a tiny negative charge. **Current** is the rate at which charge flows past a point, measured in amperes (A): 1 A means 1 C passing every second.',
      'Current is measured with an **ammeter** connected in series, in the loop, so that the charge flows through it.'
    ], { n: 0, e: 'I = \\frac{Q}{t}', x: ['A current of 0.20 A flows through a lamp for one minute. How much charge passes through it?', ['One minute = 60 s.', 'Q = I × t = 0.20 × 60 = 12 C.'], '12 C'], c: ['Is current used up as it goes round a lamp?', 'No. The same current flows in and out; the charge is not used up. It is the energy the charge carries that the lamp transfers.'] }],
    ['Voltage: energy carried by each coulomb', [
      'A cell gives energy to each coulomb that passes through it; components such as bulbs take that energy and transfer it as light and heat. **Potential difference** (p.d., or voltage) is the energy transferred per coulomb, measured in volts: a 1.5 V cell gives 1.5 J to every coulomb.',
      'Voltage is a difference between two points, so a **voltmeter** is connected in parallel, across the component.'
    ], { n: 1, e: 'V = \\frac{E}{Q}\\qquad E = Q\\,V', x: ['12 C flows through a lamp connected to a 1.5 V cell. How much energy does the lamp transfer?', ['E = Q × V = 12 × 1.5.', '= 18 J.'], '18 J'], c: ['A 9 V battery and a 1.5 V cell each push 1 C through a circuit. Which gives more energy?', 'The 9 V battery: it gives 9 J to each coulomb, the cell only 1.5 J.'] }],
    ['Power: energy every second', [
      'Power is the energy transferred per second, in watts (W). Since the energy is charge × voltage, and charge is current × time, the power is simply voltage × current.',
      'Electricity bills count energy in kilowatt-hours: 1 kWh is 1000 W for one hour, which is 3.6 million joules.'
    ], { n: 2, e: 'P = V\\,I', x: ['A 230 V kettle draws a current of 10 A. What is its power, and how much energy does it transfer in 3.0 minutes?', ['P = V × I = 230 × 10 = 2300 W.', '3.0 minutes = 180 s.', 'E = P × t = 2300 × 180 = 414 000 J.'], '2300 W; 414 000 J (414 kJ)'], c: ['A 2.0 kW heater runs for 3 hours. How many kilowatt-hours does it use?', '2.0 kW × 3 h = 6.0 kWh.'] }],
    ['Series circuits share the voltage', [
      'With components in a single loop, the same current flows through each one: there is nowhere else for the charge to go. The energy each coulomb picks up in the cell is shared between the components, so their voltages add up to the cell’s voltage.',
      'Two identical bulbs in series each get half the voltage and carry less current than one bulb alone, so they glow much dimmer. If one breaks, the loop is broken and both go out.'
    ], { n: 3, e: 'V = V_1 + V_2', x: ['A 6.0 V battery lights two lamps in series. The voltage across the first lamp is 3.5 V. What is the voltage across the second?', ['In series the voltages add up to the supply voltage.', 'V₂ = 6.0 − 3.5 = 2.5 V.'], '2.5 V'], c: ['In a series loop, the ammeter before the first lamp reads 0.3 A. What does an ammeter after the second lamp read?', '0.3 A: in series the current is the same everywhere.'] }],
    ['Parallel circuits share the current', [
      'With components on separate branches, each branch is connected straight across the cell, so each gets the full voltage. The current splits at a junction and joins up again: the branch currents add up to the current from the cell.',
      'Each bulb glows as brightly as if it were alone, and one can be switched off without affecting the others, which is why houses are wired in parallel.'
    ], { n: 4, e: 'I = I_1 + I_2', c: ['Two identical lamps are in parallel on a 6.0 V battery. What is the voltage across each?', '6.0 V each: every parallel branch gets the full supply voltage.'] }],
    ['Resistance: how hard it is to push current through', [
      'Resistance measures how much a component opposes the current: it is the voltage across it divided by the current through it, in ohms (Ω). For the same voltage, a bigger resistance means a smaller current.'
    ], { n: 5, e: 'R = \\frac{V}{I}', x: ['A lamp has 6.0 V across it and a current of 0.50 A through it. What is its resistance?', ['R = V ÷ I = 6.0 ÷ 0.50.', '= 12 Ω.'], '12 Ω'], c: ['The voltage across a resistor is doubled and the current doubles too. Has its resistance changed?', 'No: V ÷ I is the same, so the resistance is unchanged.'] }]
  ],
  m: [
    ['Saying current is used up by a lamp.', 'The current is the same in and out; the lamp transfers the energy the charge carries.'],
    ['Connecting a voltmeter in series.', 'A voltmeter goes across the component (in parallel); an ammeter goes in the loop (in series).'],
    ['Forgetting to change minutes into seconds.', 'Q = It and E = Pt need time in seconds.']
  ]
});

WL.gd('ks3-parallel', {
  h: 'Switch off the kitchen light and the fridge keeps running: your home is wired in parallel. In a parallel circuit the current splits between branches and joins up again, and each branch gets the full voltage. Resistance, voltage divided by current, tells you how much current each branch will take.',
  s: [
    ['Current splits at a junction and joins again', [
      'Current is the flow of charge, measured in amps with an ammeter in series. In a series circuit the current is the same everywhere. In a parallel circuit it splits at a junction, and the branch currents add up to the current from the supply, because charge cannot vanish or pile up.'
    ], { n: 0, e: 'I_{\\text{supply}} = I_1 + I_2', x: ['The supply current is 0.90 A. One branch carries 0.40 A. What does the other branch carry?', ['The branch currents add up to the supply current.', 'I₂ = 0.90 − 0.40 = 0.50 A.'], '0.50 A'], c: ['Three identical lamps are in parallel and the supply current is 0.6 A. What is the current in each lamp?', '0.2 A: identical branches share the current equally, 0.6 ÷ 3.'] }],
    ['Every branch gets the full voltage', [
      'Voltage measures the energy given to or taken from each coulomb of charge. In series, the supply voltage is shared between the components. In parallel, every branch is connected straight across the supply, so each has the full supply voltage across it.',
      'That is why two lamps in parallel are each as bright as one lamp alone, while two in series are dimmer.'
    ], { n: 1, x: ['Two identical lamps are connected to a 6.0 V battery, first in series, then in parallel. What is the voltage across each lamp each time?', ['In series the 6.0 V is shared: 3.0 V each.', 'In parallel each lamp is across the battery: 6.0 V each.'], '3.0 V each in series; 6.0 V each in parallel, so the parallel lamps are brighter'], c: ['Which of those two arrangements drains the battery faster, and why?', 'Parallel: each lamp gets the full voltage and takes a full current, so the battery supplies more current in total.'] }],
    ['Resistance = voltage ÷ current', [
      '**Resistance** is how much a component opposes the current, in ohms (Ω). It is the voltage across the component divided by the current through it. For the same voltage, a bigger resistance means a smaller current.'
    ], { n: 2, e: 'R = \\frac{V}{I}', x: ['A heater has 230 V across it and takes 4.0 A. What is its resistance? What current would a 115 Ω heater take on the same supply?', ['R = V ÷ I = 230 ÷ 4.0 = 57.5 Ω.', 'For 115 Ω: I = V ÷ R = 230 ÷ 115 = 2.0 A.'], '57.5 Ω; 2.0 A'], c: ['Two branches are in parallel on 12 V: one has 6 Ω, the other 12 Ω. Which carries more current?', 'The 6 Ω branch: 12 ÷ 6 = 2 A, against 12 ÷ 12 = 1 A.'] }],
    ['Why homes are wired in parallel', [
      'In parallel, each appliance gets the full mains voltage it was designed for, and each can be switched on and off without affecting the others. In series, one switch or one broken lamp would cut off everything, and every appliance would share the voltage.'
    ], { n: 3, c: ['Old Christmas tree lights all went out when one bulb failed. How were they wired?', 'In series: one broken bulb broke the only loop.'] }],
    ['More branches, more current', [
      'Each new parallel branch gives the charge another path, so the total current from the supply goes up and the total resistance of the circuit goes down.',
      'That is why plugging too many appliances into one socket adaptor can draw a dangerously large current and overheat the wires.'
    ], { n: 4, x: ['A kettle (10 A), a toaster (4 A) and a heater (8 A) are plugged into one adaptor, all switched on. What current flows in the adaptor’s lead? Its fuse is 13 A: what happens?', ['The appliances are in parallel, so their currents add.', 'Total = 10 + 4 + 8 = 22 A.', '22 A is more than 13 A, so the fuse melts and cuts the current.'], '22 A; the 13 A fuse blows'], c: ['When you add a branch in parallel, does the current in the existing branches change?', 'No (for an ideal supply): each existing branch still has the same voltage and resistance, so the same current. Only the total goes up.'] }]
  ],
  m: [
    ['Thinking adding a branch adds resistance.', 'In parallel, more branches mean more paths, so the total resistance goes down.'],
    ['Sharing the voltage between parallel branches.', 'Voltage is shared in series; in parallel each branch gets the full supply voltage.'],
    ['Saying charge is used up in the branches.', 'The branch currents rejoin and add up to the supply current.']
  ]
});

WL.gd('ks3-magnets', {
  h: 'A fridge magnet sticks to the door but not to an aluminium can; a compass needle swings to point north; a scrapyard crane drops a car when its current is switched off. All three come from magnetic fields, and an electric current can make one that switches on and off.',
  s: [
    ['Magnetic materials and poles', [
      'Only a few materials are **magnetic**: iron, steel, nickel and cobalt. Copper, aluminium, plastic and wood are not. Every magnet has a **north pole** and a **south pole**.',
      'Like poles (north–north or south–south) repel; unlike poles (north–south) attract. A magnet attracts a piece of iron by turning it into a temporary magnet, which is why iron is attracted to both poles.'
    ], { n: 0, c: ['A steel paperclip is attracted to both ends of a bar magnet. Does that prove the paperclip is itself a magnet?', 'No. A magnet attracts plain steel at either pole by making it a temporary magnet. Only repulsion proves that both objects are magnets.'] }],
    ['Magnetic fields and field lines', [
      'A **magnetic field** is the region around a magnet where magnetic materials and other magnets feel a force. We draw it with field lines that run from the north pole to the south pole. Where the lines are close together, near the poles, the field is strongest.',
      'You can map a field with iron filings, or with a small plotting compass, whose needle lines up with the field.'
    ], { n: 1, c: ['What does it mean when field lines are drawn far apart?', 'The field there is weak.'] }],
    ['The Earth is a magnet', [
      'The Earth has a magnetic field, as if a huge bar magnet were buried inside it. A compass needle’s north pole points towards the Arctic. Since unlike poles attract, the Earth’s magnetic pole in the Arctic must be a south magnetic pole.',
      'The Earth’s field shields us from charged particles from the Sun; where they leak in near the poles, they make the aurora.'
    ], { n: 2, c: ['Why does a compass point north even indoors?', 'The Earth’s magnetic field passes through walls and roofs, so the needle still lines up with it.'] }],
    ['A current makes a magnetic field: electromagnets', [
      'A wire carrying a current has a magnetic field around it. Winding the wire into a coil adds up the fields of all the turns, and putting an iron core inside makes the field much stronger. This is an **electromagnet**.',
      'Its great advantage is that it can be switched on and off, and its strength can be changed: more turns of wire, a bigger current, or an iron core all make it stronger.'
    ], { n: 3, c: ['Give two ways to make an electromagnet pick up more paperclips.', 'Any two of: wind more turns of wire, increase the current, or put an iron core in the coil.'] }],
    ['Electromagnets at work', [
      'Because they can be switched off, electromagnets are used where a permanent magnet would be useless: scrapyard cranes that pick up and drop cars, electric door locks, relays that let a small current switch a large one, loudspeakers, and the motors in almost everything that spins.'
    ], { n: 4, c: ['Why would a permanent magnet be no good on a scrapyard crane?', 'It could never let go of the cars: an electromagnet drops them when the current is switched off.'] }]
  ],
  m: [
    ['Saying all metals are magnetic.', 'Only iron, steel, nickel and cobalt (and some alloys) are; copper and aluminium are not.'],
    ['Drawing field lines from south to north.', 'Field lines go from the north pole to the south pole outside the magnet.'],
    ['Thinking attraction proves something is a magnet.', 'Magnets attract plain iron too; only repulsion proves both objects are magnets.']
  ]
});
WL.gd('ks3-space', {
  h: 'Why do astronauts float in the Space Station when gravity up there is nearly as strong as on the ground? Because an orbit is not escaping gravity at all: it is falling sideways so fast that the Earth keeps curving away beneath you. This topic builds up to that idea from weight and falling.',
  s: [
    ['Mass stays the same; weight depends on where you are', [
      '**Mass** is the amount of matter in something, in kilograms, and it is the same everywhere. **Weight** is the force of gravity on that mass, in newtons, and it depends on where you are.',
      'The gravitational field strength g tells you the weight of each kilogram: 9.8 N/kg on Earth, 1.6 N/kg on the Moon, 3.7 N/kg on Mars. Bathroom scales measure your weight but show it as a mass.'
    ], { n: 0, e: 'W = m\\,g', x: ['A 60 kg student goes to Mars (g = 3.7 N/kg). What is her weight there, and on Earth (g = 9.8 N/kg)?', ['On Mars: W = m × g = 60 × 3.7 = 222 N.', 'On Earth: W = 60 × 9.8 = 588 N.', 'Her mass is 60 kg in both places.'], '222 N on Mars, 588 N on Earth'], c: ['Would a bag of flour weigh more, less or the same on the Moon?', 'Less: its mass is the same but the Moon’s gravity pulls each kilogram with only 1.6 N.'] }],
    ['Everything falls the same way', [
      'Without air resistance, all objects fall with the same acceleration, whatever their mass. A heavier object has more weight, but it also has more mass to get moving, and the two effects cancel exactly.',
      'Starting from rest, a falling object covers a distance s = ½gt² in time t: about 5 m in the first second, 20 m in two seconds.'
    ], { n: 1, e: 's = \\tfrac12 g\\,t^2', x: ['A stone dropped from a bridge takes 2.0 s to reach the water. Ignoring air resistance, how high is the bridge? (g = 9.8 m/s²)', ['s = ½ × g × t².', '= ½ × 9.8 × 2.0² = ½ × 9.8 × 4.0.', '= 19.6 m.'], 'about 20 m'], c: ['A hammer and a feather are dropped together on the Moon. Which lands first?', 'They land together: there is no air on the Moon, so nothing slows the feather.'] }],
    ['Why orbits happen: Newton’s cannonball', [
      'Imagine firing a cannonball sideways from a very tall mountain. The faster it goes, the further it lands. But the Earth is round: over a distance d the ground curves away by about d²/2R, where R is the Earth’s radius.',
      'Fire the ball fast enough and the ground curves away just as fast as the ball falls. It keeps falling but never gets closer to the ground: it is in **orbit**. Near the surface that needs about 7.9 km/s, and one lap takes about 85 minutes.'
    ], { n: 2, e: 'v = \\sqrt{g R}', x: ['Check the orbit speed: g = 9.8 m/s² and the Earth’s radius R = 6 400 000 m. How long does one lap take at that speed?', ['v = √(g × R) = √(9.8 × 6 400 000) = √62 720 000 ≈ 7900 m/s.', 'One lap is the circumference: 2 × π × 6 400 000 ≈ 40 200 000 m.', 'Time = distance ÷ speed = 40 200 000 ÷ 7900 ≈ 5100 s ≈ 85 minutes.'], 'about 7.9 km/s, and about 85 minutes per lap'], c: ['In one second, a falling object drops about 5 m. At 7.9 km/s, how far does the cannonball go sideways in that second, and how much does the ground curve away?', 'It goes 7.9 km sideways, and over 7.9 km the ground curves down by about 7900² ÷ (2 × 6 400 000) ≈ 4.9 m: the same as the fall, so it stays at the same height.'] }],
    ['Weightless does not mean gravity-free', [
      'At the height of the International Space Station, about 400 km up, gravity is still about 90% as strong as on the ground. Astronauts float because they and the station are falling together, in orbit. Nothing pushes up on them, so they feel weightless.'
    ], { n: 3, c: ['A lift cable snaps and the lift falls freely. What would the passengers feel?', 'They would float inside it, weightless, because they and the lift fall together with nothing pushing up on them. This is exactly what astronauts feel all the time in orbit.'] }],
    ['Gravity weakens with distance', [
      'Gravity gets weaker the further you go: double the distance and the pull drops to a quarter. The Sun’s gravity holds the planets; the further out a planet is, the weaker the pull, the slower it moves and the longer its year: Mercury 88 days, Earth 1 year, Neptune 165 years.',
      'Seasons come from the tilt of the Earth’s axis, not from its distance to the Sun: the Earth is actually closest to the Sun in early January.'
    ], { n: 4, c: ['A spacecraft moves from 1 Earth radius to 3 Earth radii from the Earth’s centre. How many times weaker is the pull?', '9 times weaker, because the pull falls with the square of the distance: 3 × 3 = 9.'] }]
  ],
  m: [
    ['Saying there is no gravity in space.', 'Gravity reaches far into space; astronauts float because they are falling around the Earth.'],
    ['Thinking heavy things fall faster.', 'Without air resistance, all objects fall with the same acceleration.'],
    ['Blaming seasons on the distance to the Sun.', 'Seasons come from the tilt of the Earth’s axis.']
  ]
});

WL.gd('ks3-tides-eclipses', {
  h: 'At the seaside the water creeps up the beach and back twice a day, and every so often the Sun goes dark in the middle of the day. Both are the Moon’s doing: its gravity stretches the oceans, and when it lines up exactly with the Sun and the Earth, its shadow lands on us.',
  s: [
    ['Tides: the Moon stretches the oceans', [
      'The Moon pulls on everything on the Earth, but more strongly on the near side than on the far side, because gravity weakens with distance. The ocean facing the Moon is pulled towards it a little more than the Earth as a whole, and the Earth as a whole a little more than the ocean on the far side.',
      'So the oceans are stretched into two bulges, one towards the Moon and one away from it. The Earth spins underneath them once a day, so most coasts get two high tides a day. The Moon moves on in its orbit as well, so high tides come about 12 hours 25 minutes apart.'
    ], { n: 0, x: ['High tide at a harbour is at 09:10 on Monday. Roughly when are the next two high tides?', ['High tides are about 12 h 25 min apart.', '09:10 + 12 h 25 min = 21:35 on Monday.', '21:35 + 12 h 25 min = 10:00 on Tuesday.'], 'about 21:35 Monday and 10:00 Tuesday'], c: ['Why is there a high tide on the side of the Earth facing away from the Moon?', 'The Moon pulls the Earth as a whole more than the far-side ocean, so that water is left behind, bulging away from the Moon.'] }],
    ['Spring tides and neap tides', [
      'The Sun raises tides too, about half as big as the Moon’s. At new Moon and full Moon the Sun, Earth and Moon are in a line, and their tides add up: extra-high and extra-low **spring tides** (nothing to do with the season).',
      'At first and last quarter the Sun and Moon pull at right angles and partly cancel, giving small **neap tides**.'
    ], { n: 1, c: ['There is a full Moon tonight. Will the tides be spring tides or neap tides?', 'Spring tides: at full Moon the Sun, Earth and Moon are in a line, so their tides add.'] }],
    ['Solar eclipses: the Moon’s shadow on Earth', [
      'A **solar eclipse** happens when the Moon passes between the Sun and the Earth and its shadow falls on the Earth. It can only happen at new Moon.',
      'Where the Moon covers the Sun completely there is a total eclipse: the sky darkens and the Sun’s faint outer atmosphere, the corona, appears. Nearby there is only a partial eclipse. Never look at the Sun directly, even during an eclipse: use eclipse glasses or a pinhole projector.'
    ], { n: 2, c: ['The Moon is 400 times smaller than the Sun. How can it cover the Sun exactly?', 'The Sun is also about 400 times further away, so the two look almost exactly the same size in our sky.'] }],
    ['Lunar eclipses: the Earth’s shadow on the Moon', [
      'A **lunar eclipse** happens when the Earth passes between the Sun and the Moon, and the Moon moves into the Earth’s shadow. It can only happen at full Moon, and it is safe to watch.',
      'The Moon often turns coppery red, because the Earth’s atmosphere bends some red sunlight into the shadow: it is lit by all the world’s sunsets at once.'
    ], { n: 3, c: ['In which order are the Sun, Earth and Moon during a lunar eclipse?', 'Sun, then Earth, then Moon: the Earth is in the middle, casting its shadow on the Moon.'] }],
    ['Why there is not an eclipse every month', [
      'The Moon’s orbit is tilted by about 5° to the Earth’s orbit round the Sun. Most months the new Moon passes a little above or below the Sun, and the full Moon a little above or below the Earth’s shadow.',
      'Eclipses happen only when a new or full Moon falls near one of the two points where the orbits cross.'
    ], { n: 4, c: ['If the Moon’s orbit were not tilted at all, how often would there be solar eclipses?', 'At every new Moon, about once a month, and a lunar eclipse at every full Moon.'] }]
  ],
  m: [
    ['Saying spring tides happen in spring.', 'Spring tides happen twice a month, at new and full Moon, all year round.'],
    ['Mixing up solar and lunar eclipses.', 'Solar: the Moon blocks the Sun (new Moon). Lunar: the Earth’s shadow covers the Moon (full Moon).'],
    ['Thinking there is only one tidal bulge.', 'There are two, facing towards and away from the Moon, which is why there are two high tides a day.']
  ]
});

WL.gd('ks3-solar-system', {
  h: 'Every atom in your body that is heavier than hydrogen was made inside a star, and the Earth itself is a leftover from the cloud that formed the Sun. This topic follows that story outwards: from a collapsing cloud of gas to our Solar System, our galaxy and the billions of galaxies beyond.',
  s: [
    ['From a cloud of gas to a solar system', [
      'A **nebula** is a cloud of gas and dust in space. When part of it collapses under its own gravity, it spins faster and flattens into a disc. Most of the material falls to the centre and becomes a star.',
      'In the disc, dust grains stick together, growing into rocks and then bigger bodies that sweep up more material, until planets form. That is why all the planets orbit the Sun in the same direction and in nearly the same flat plane. Our Solar System formed this way about 4.6 billion years ago.'
    ], { n: 0, c: ['Why do all the planets go round the Sun in the same direction?', 'They all formed from the same spinning disc of gas and dust, so they kept its direction of spin.'] }],
    ['Leftovers: asteroids, comets and meteors', [
      '**Asteroids** are rocky leftovers, mostly in the asteroid belt between Mars and Jupiter. **Comets** are lumps of ice and dust from the outer Solar System that grow glowing tails when they come close to the Sun.',
      'A **meteor** is the streak of light from a small piece of rock burning up in our atmosphere; a **meteorite** is a piece that reaches the ground. An asteroid about 10 km across hit Mexico 66 million years ago and helped wipe out the dinosaurs.'
    ], { n: 1, c: ['What is the difference between a meteor and a meteorite?', 'A meteor is the flash of light as a rock burns up in the air; a meteorite is a piece that survives and lands.'] }],
    ['How the Moon formed', [
      'The best explanation is the **giant impact**: about 4.5 billion years ago, a body about the size of Mars crashed into the young Earth. Rock thrown out by the collision gathered in orbit and became the Moon.',
      'The evidence: Moon rocks are very like the Earth’s outer rocks, and the Moon has only a small iron core, as if it were made mostly from the Earth’s outer layers.'
    ], { n: 2, c: ['Why does the Moon’s small iron core support the giant-impact idea?', 'If the Moon formed from rock blasted off the Earth’s outer layers, which have little iron, it should have little iron itself.'] }],
    ['Galaxies and light-years', [
      'A **galaxy** is an enormous group of stars, gas and dust held together by gravity. Our galaxy, the Milky Way, has over 100 billion stars and is about 100 000 light-years across. There are billions of galaxies in the observable Universe.',
      'A **light-year** is a distance, not a time: how far light travels in one year, about 9.5 million million km (9.5 × 10¹² km).'
    ], { n: 3, e: '1\\ \\text{light-year} \\approx 9.5\\times10^{12}\\ \\text{km}', x: ['The nearest star after the Sun, Proxima Centauri, is 4.2 light-years away. How far is that in km? How long would a spacecraft travelling at 20 km/s take to get there?', ['Distance = 4.2 × 9.5 × 10¹² km ≈ 4.0 × 10¹³ km.', 'Time = distance ÷ speed = 4.0 × 10¹³ ÷ 20 = 2.0 × 10¹² s.', 'One year is about 32 million seconds, so that is 2.0 × 10¹² ÷ 3.2 × 10⁷ ≈ 63 000 years.'], 'about 40 million million km, and about 63 000 years'], c: ['When you look at a galaxy 2 million light-years away, what are you really seeing?', 'The galaxy as it was 2 million years ago, when the light left it.'] }],
    ['The scale of space', [
      'Space is mostly empty. If the Sun were a ball 1 m across, the Earth would be a 9 mm pea about 107 m away, Neptune would be over 3 km away, and the nearest other star would be about 29 000 km away.'
    ], { n: 4, c: ['Put these in order of size, smallest first: star, galaxy, planet, Solar System.', 'Planet, star, Solar System, galaxy.'] }]
  ],
  m: [
    ['Treating a light-year as a time.', 'It is a distance: how far light goes in a year.'],
    ['Mixing up the Solar System and a galaxy.', 'The Solar System is one star and its planets; a galaxy holds billions of stars.'],
    ['Thinking the stars we see are as they are now.', 'We see them as they were when their light set off, years or millions of years ago.']
  ]
});

WL.gd('ks3-earth', {
  h: 'South America and Africa fit together like jigsaw pieces, and the same fossils turn up on both. Mountains, volcanoes and earthquakes cluster along the same lines on the map. Both clues point to one surprising fact: the ground beneath us is moving, a few centimetres every year.',
  s: [
    ['Inside the Earth', [
      'The Earth has layers: a thin rocky **crust** (5 to 70 km thick), a thick **mantle** of hot rock that can flow very slowly, a liquid outer **core** of iron and nickel, and a solid inner core.',
      'The crust and the rigid top of the mantle together form the **lithosphere**, which is broken into giant pieces called **tectonic plates**.'
    ], { n: 0, c: ['If the Earth were an apple, roughly what would the crust be?', 'The skin: the crust is very thin compared with the whole Earth.'] }],
    ['Why the plates move', [
      'The mantle is hotter at the bottom than at the top. Hot rock slowly rises and cooler rock sinks, setting up **convection currents** that drag on the plates above.',
      'At the same time, the cold, heavy edge of a plate sinking back into the mantle pulls the rest of the plate along. The result is movement of a few centimetres a year, about as fast as your fingernails grow.'
    ], { n: 1, x: ['The Atlantic Ocean is about 5000 km wide and widens by about 2.5 cm a year. If it had always widened at that rate, how long ago did it start to open?', ['Convert 5000 km to centimetres: 5000 × 1000 × 100 = 500 000 000 cm.', 'Time = distance ÷ speed = 500 000 000 ÷ 2.5 = 200 000 000 years.'], 'about 200 million years ago'], c: ['Why is mantle convection so slow, if the rock is hot?', 'The mantle is solid rock that flows only very slowly, like extremely thick toffee, so the currents move centimetres a year.'] }],
    ['What happens where plates meet', [
      'Where plates pull apart, molten rock rises to fill the gap and new crust forms, as along the middle of the Atlantic. Where they push together, one may sink under the other, raising mountains and feeding volcanoes, or both crumple up into high mountains such as the Himalayas.',
      'Where they slide past each other, they stick and then jerk free, causing earthquakes, as along the San Andreas fault in California.'
    ], { n: 2, c: ['Why are there so many earthquakes and volcanoes around the edges of the Pacific Ocean?', 'The Pacific plate meets other plates all round its edge, and plate boundaries are where the ground cracks, sticks and melts.'] }],
    ['The evidence for moving plates', [
      'The coasts of South America and Africa fit together; the same fossils and rock types are found on both sides of the Atlantic; mountains, volcanoes and earthquakes line up along plate boundaries.',
      'The sea floor gives the clinching evidence: rock at the ocean ridges is youngest, and it carries stripes of magnetism, matching on both sides, recording flips of the Earth’s magnetic field as new crust formed and spread.'
    ], { n: 3, c: ['Fossils of the same land reptile are found in Brazil and in South Africa. Why is that evidence for moving plates?', 'The reptile could not have swum across an ocean, so the two continents must once have been joined.'] }],
    ['An idea that waited for evidence', [
      'Alfred Wegener proposed “continental drift” in 1912, using the jigsaw fit and the fossils. Most geologists rejected it for decades, because he could not explain what force could move continents.',
      'In the 1960s, maps of the sea floor revealed the spreading ridges and magnetic stripes, supplying the mechanism, and plate tectonics was accepted. Good ideas need both evidence and a mechanism.'
    ], { n: 4, c: ['Why were scientists right to doubt Wegener at first?', 'He had evidence that the continents had moved but no believable mechanism for how; science accepted the idea once the sea-floor evidence showed how it worked.'] }]
  ],
  m: [
    ['Saying the continents float on liquid rock.', 'The mantle is solid rock that flows very slowly; only small pockets melt.'],
    ['Thinking plates move metres a year.', 'They move a few centimetres a year, but over millions of years that adds up to thousands of kilometres.'],
    ['Mixing up crust and plate.', 'A plate is the crust plus the rigid top of the mantle (the lithosphere).']
  ]
});

WL.gd('ks3-climate', {
  h: 'Carbon dioxide makes up less than a twentieth of one percent of the air, yet it helps keep the Earth about 33 °C warmer than it would otherwise be. This topic explains what the air is made of, how water and carbon cycle through the planet, and why adding a little more carbon dioxide changes the climate.',
  s: [
    ['What the air is made of', [
      'Clean, dry air is about 78% nitrogen, 21% oxygen and almost 1% argon. Carbon dioxide is only about 0.04%, a tiny but vital amount. Small amounts are often given in **parts per million** (ppm): 1% = 10 000 ppm.',
      'Pollution adds gases such as sulfur dioxide and nitrogen oxides, which cause acid rain, and tiny particles of soot.'
    ], { n: 0, x: ['Nitrogen is 78% of the air. How many parts per million is that? And carbon dioxide at 420 ppm: what percentage is that?', ['1% = 10 000 ppm, so 78% = 78 × 10 000 = 780 000 ppm.', '420 ppm ÷ 10 000 = 0.042%.'], '780 000 ppm; 0.042%'], c: ['Which gas makes up most of the air we breathe?', 'Nitrogen, about 78%, not oxygen.'] }],
    ['The water cycle', [
      'Energy from the Sun evaporates water from the oceans, lakes and plants. The vapour rises, cools and condenses into clouds. It falls back as rain or snow (precipitation), and runs back to the sea in rivers or soaks into the ground.',
      'The same water has been going round for billions of years.'
    ], { n: 1, c: ['What provides the energy that drives the water cycle?', 'The Sun, which evaporates the water.'] }],
    ['The carbon cycle', [
      'Plants take carbon dioxide from the air in photosynthesis. Animals eat plants, and living things return carbon dioxide to the air through respiration. When they die, decomposers break them down and release more. The oceans absorb and release huge amounts too.',
      'Over millions of years some carbon got locked away as coal, oil and gas. Burning these fossil fuels returns that ancient carbon to the air very quickly, much faster than plants and oceans can take it back up.'
    ], { n: 2, x: ['Before factories, the air held about 280 ppm of carbon dioxide; now it holds about 420 ppm. By what percentage has it risen?', ['Increase = 420 − 280 = 140 ppm.', 'Percentage rise = 140 ÷ 280 × 100 = 50%.'], 'about 50%'], c: ['Why does cutting down forests add to the carbon dioxide in the air?', 'Fewer trees take carbon dioxide in by photosynthesis, and burning or rotting the wood releases the carbon they stored.'] }],
    ['The greenhouse effect', [
      'Sunlight passes through the air and warms the Earth’s surface. The warm surface gives out infrared radiation. **Greenhouse gases**, such as carbon dioxide, water vapour and methane, absorb some of this infrared and send part of it back down.',
      'This keeps the Earth about 33 °C warmer than it would be with no greenhouse gases at all (about 15 °C on average instead of about −18 °C). Adding more greenhouse gas strengthens the effect, so the planet warms.'
    ], { n: 3, c: ['Is the greenhouse effect itself a bad thing?', 'No: without it the Earth would be frozen. The problem is making it stronger by adding more greenhouse gases.'] }],
    ['Weather, climate and climate change', [
      '**Weather** is the state of the air on a particular day; **climate** is the average weather of a place over decades. So one cold winter does not disprove a warming climate.',
      'The world has warmed by about 1.3 °C since the late 1800s, sea levels have risen by about 20 cm since 1900, and glaciers and ice sheets are melting.'
    ], { n: 4, c: ['Someone says, “It snowed a lot this winter, so global warming is not happening.” What is wrong with that?', 'One winter is weather; climate is the average over decades, and that average is clearly rising.'] }]
  ],
  m: [
    ['Confusing the greenhouse effect with the ozone hole.', 'They are different: the ozone layer blocks ultraviolet; greenhouse gases trap infrared.'],
    ['Saying the air is mostly oxygen.', 'It is about 78% nitrogen and 21% oxygen.'],
    ['Treating weather and climate as the same.', 'Climate is weather averaged over decades.']
  ]
});
