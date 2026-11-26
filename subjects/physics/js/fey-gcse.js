/* Twistor: "See it like Feynman" sections, gcse. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('gcse-atom', [
  'When Geiger and Marsden fired alpha particles at gold foil thinner than a page, almost all went straight through, but about one in 8000 bounced back. Rutherford compared it to a shell bouncing off tissue paper.',
  'An atom is mostly empty space: a tiny, dense, positive **nucleus**, with the electrons spread far around it. An alpha particle that passes very close to a nucleus is flung back by the electric repulsion; the rest pass through the empty space and miss.',
  'To turn a fast alpha particle round, the positive charge must be packed into a region so small that the repulsion becomes enormous. Charge spread through the whole atom, as in the plum-pudding model, would barely deflect it. Counting how many come back, and at which angles, measures the nucleus’s size.',
  'The nucleus is about 10⁻¹⁴ m across and the atom about 10⁻¹⁰ m, ten thousand times larger. Make the nucleus a pea in the centre circle of a football stadium and the electrons are out in the stands.',
  'The electrons are not little planets but spread-out waves, and what holds the nucleus together against its own repulsion is the strong nuclear force, which the electric picture leaves out.'
]);
WL.fy('gcse-circuits', [
  'Add a second lamp in series and both glow dimmer. Add it in parallel instead and both glow as brightly as one alone, while the battery runs down twice as fast.',
  '**Resistance** is how hard it is to push charge through. In series the charge has to get through both resistors, one after the other, so the difficulties add. In parallel it has two routes side by side, like opening a second door, so the combination is easier to get through than either alone.',
  'In series the same current flows through both and the voltages add: V = IR₁ + IR₂, so R = R₁ + R₂. In parallel the same voltage is across both and the currents add: I = V/R₁ + V/R₂, so 1/R = 1/R₁ + 1/R₂. Conductances (1/R) add in parallel exactly as resistances add in series.',
  'Two 10 Ω resistors make 20 Ω in series and 5 Ω in parallel. A 1 Ω and a 1000 Ω in parallel make 0.999 Ω: in parallel the smallest resistance dominates, which is why a short circuit across a component takes almost all the current.',
  'Lamps are not fixed resistors: a filament’s resistance rises roughly tenfold as it heats, so a cold lamp draws a surge of current at the moment it is switched on.'
]);
WL.fy('gcse-series-parallel', [
  'Street lights switch themselves on at dusk using little more than two resistors in series, one of which changes with the light.',
  'Two resistors in series share the supply’s voltage in proportion to their resistances, like two hills on one path sharing a fixed total drop: the bigger hill takes the bigger share. If one resistor changes, say a light-dependent resistor going dark, its share changes, and that voltage can switch another circuit. This is a **potential divider**.',
  'The same current flows through both, so the voltage across each is IR, proportional to R. The two must add up to the supply voltage, so V₁ = V × R₁/(R₁ + R₂).',
  'A 6 V supply across a fixed 10 kΩ resistor and an LDR that is 1 kΩ in daylight and 100 kΩ in the dark: the LDR’s share goes from 6 × 1/11 ≈ 0.5 V to 6 × 100/110 ≈ 5.5 V. A switch that triggers at 3 V cannot miss dusk.',
  'Anything connected across the output draws current and pulls the output voltage down, unless its resistance is much larger than the divider’s own resistors.'
]);
WL.fy('gcse-current-pd', [
  'A car battery is only 12 V, yet it can turn a starter motor; a static shock from a door handle is thousands of volts, yet harmless. Voltage alone does not say what a source can do.',
  '**Current** is the rate of flow of charge: coulombs per second. **Potential difference** is energy per coulomb: how much each coulomb gives up between two points. Multiply them and you get energy per second, the power.',
  'P = IV is just energy bookkeeping: each coulomb carries V joules and I coulombs pass each second. A static spark has a large V but moves only a tiny charge, so its total energy is small; a car battery can push a hundred amps or more for several seconds.',
  'A starter motor takes about 12 V × 150 A ≈ 1.8 kW. A static shock at 10 kV from a body holding about 100 pF moves Q = CV = 1 μC and delivers ½CV² ≈ 5 mJ.',
  'E.m.f. and p.d. are not the same: the e.m.f. is the energy the cell gives each coulomb, and part of it is lost inside the cell, so the terminal p.d. drops when a large current flows.'
]);
WL.fy('gcse-earth-moon', [
  'In Britain the Sun is high and the days are long in June, yet the Earth is closest to the Sun in early January.',
  'The Earth’s axis is tilted by 23.4° and keeps pointing the same way in space as the Earth goes round the Sun. In June the northern half leans towards the Sun, so sunlight strikes it more directly and for more hours each day.',
  'The sunlight landing on each square metre depends on the angle: a slanting beam spreads over a larger area. The Earth’s distance from the Sun varies by only about 3 % either way, changing the sunlight by about 7 % over the year, which the tilt easily outweighs.',
  'At London’s latitude (about 52° N) the noon Sun is about 61° high in June and 15° high in December. A beam at 15° spreads over 1/sin 15° ≈ 3.9 times the area it would cover overhead, against 1/sin 61° ≈ 1.1 in June: about 3.4 times less sunlight per square metre at noon, before counting the shorter days.',
  'Oceans and air store heat and lag behind, so the warmest weeks come well after the longest day; and the tilt and the orbit themselves change slowly over tens of thousands of years, the cycles behind the ice ages.'
]);
WL.fy('gcse-electromagnets', [
  'A compass needle beside a wire twitches the moment a current is switched on, as Ørsted found in 1820. Wind the wire into a coil round an iron nail and it can lift paper clips.',
  'Moving charge makes a **magnetic field** that circles the current. Coil the wire and the circles from every turn add up inside the coil, giving a field like a bar magnet’s. An iron core multiplies it by lining up its own atomic magnets with the coil’s field.',
  'Electric and magnetic fields are two sides of one thing: a charge at rest has an electric field, and a moving charge has a magnetic one too. Inside a long coil every turn adds its share, so the field grows with the turns per metre and with the current: B = μ₀nI.',
  'A coil of 500 turns over 10 cm carrying 2 A: B = 4π × 10⁻⁷ × 5000 × 2 ≈ 0.013 T, about 250 times the Earth’s field. An iron core multiplies this by hundreds, until the iron saturates at about 1.5 to 2 T.',
  'Iron saturates: once its domains are all lined up, extra current adds little. Iron can also keep some magnetism after the current stops, which is why electromagnets use soft iron.'
]);
WL.fy('gcse-em-spectrum', [
  'Radio passes through walls and light does not; X-rays pass through flesh but not bone. Yet all of them are the same kind of wave, travelling at the same speed in empty space.',
  '**Electromagnetic waves** are ripples in electric and magnetic fields, made by accelerating charges. What separates them is wavelength: metres to kilometres for radio, half a micrometre for light, around 10⁻¹¹ m for X-rays. What each does depends on how its wavelength and energy match the things it meets.',
  'Maxwell’s equations predict waves in the fields travelling at 1/√(μ₀ε₀) ≈ 3 × 10⁸ m/s, exactly the measured speed of light, so light must be electromagnetic. Matter absorbs a wave when its frequency matches something the matter can do: molecules vibrate in the infrared, outer electrons jump with visible and ultraviolet light, inner electrons with X-rays.',
  'A photon of visible light carries hf ≈ 6.6 × 10⁻³⁴ × 5 × 10¹⁴ ≈ 3 × 10⁻¹⁹ J, about 2 eV: the right size for chemistry, such as vision and photosynthesis. A 30 keV X-ray photon carries 15 000 times more, enough to knock electrons out of atoms, which is why X-rays ionise and light does not.',
  'The wave picture cannot explain why light ejects electrons from a metal only above a threshold frequency, however bright it is. For that, light has to arrive in photons.'
]);
WL.fy('gcse-energy', [
  'A skier at the bottom of a slope is going just as fast whether the slope was gentle or steep, as long as friction is small. Only the height dropped seems to matter.',
  'Lifting a mass stores energy, mgh; falling, that store turns into motion, ½mv². The route does not matter, because gravity does the same work for the same drop whatever path is taken.',
  'Gravity pulls straight down, so only the vertical part of the motion counts. A gentle slope means a weaker push along the slope, but over a longer distance, and force × distance comes out the same. So mgh = ½mv², the mass cancels, and v = √(2gh).',
  'A 5 m drop gives v = √(2 × 9.8 × 5) ≈ 10 m/s, about 36 km/h, whatever the mass. A 100 m drop would give 44 m/s if there were no air.',
  'Real slopes take a share through friction and air drag. And saying the energy is stored "in the object" is bookkeeping: it belongs to the object and the Earth together.'
]);
WL.fy('gcse-expansion', [
  'Railway tracks and bridges have gaps at their joints, overhead wires sag more in summer, and a stuck jar lid comes loose under hot water.',
  'Heating makes atoms vibrate harder, and the vibrations are lopsided: it is easier to pull neighbours apart than to squeeze them together. So the average spacing grows a little as the temperature rises, and the solid gets bigger.',
  'If the bond between atoms were a perfect spring, symmetric about its rest length, harder jiggling would not change the average spacing. Real bonds are stiff when squeezed and soft when stretched, so the average shifts outwards. Gases expand far more because nothing holds their particles together: at fixed pressure their volume is proportional to the kelvin temperature.',
  'Steel expands by about 12 millionths of its length per °C. A 1 km steel bridge warming by 30 °C grows by 1000 × 12 × 10⁻⁶ × 30 = 0.36 m, hence expansion joints. Air heated from 0 °C to 100 °C at constant pressure expands by 100/273, about 37 %.',
  'Water does the opposite between 0 °C and 4 °C, contracting as it warms because of its open, hydrogen-bonded structure. That is why lakes freeze from the top down.'
]);
WL.fy('gcse-forces', [
  'A spring stretches twice as far under twice the load, and a trolley pushed twice as hard speeds up twice as quickly. Two straight-line laws for two very different things.',
  'A spring is a chain of atoms whose bonds each stretch a tiny amount, like little springs, so small stretches give forces in proportion: **Hooke’s law**. **F = ma** says force is what changes motion, and the same push gives a heavier trolley a smaller acceleration.',
  'Any smooth force law looks straight close to its balance point, just as any smooth curve looks straight when you zoom in, so small stretches always follow Hooke’s law until the bonds start to slip or break. Newton’s second law is what makes force measurable: a force is known by the acceleration it gives a known mass, and experiment then shows forces add like arrows.',
  'A 1200 kg car going from 0 to 100 km/h (28 m/s) in 10 s needs a = 2.8 m/s², so a resultant force of 1200 × 2.8 ≈ 3.3 kN, about a quarter of its weight.',
  'Beyond the limit of proportionality a spring deforms permanently. And F = ma assumes the mass stays the same and speeds are far below the speed of light.'
]);
WL.fy('gcse-heat-transfer', [
  'A vacuum flask keeps tea hot for hours with a vacuum between two walls, silvered inner surfaces and a stopper. Each feature blocks a different way heat escapes.',
  '**Conduction** passes energy from jiggling particle to neighbour, and the vacuum stops it because there are no particles. **Convection** carries energy in moving, rising fluid, stopped by the vacuum and the stopper. **Radiation** is infrared light from the warm surface, cut down by the silvering, which reflects it back and emits little itself.',
  'Conduction and convection need matter; radiation needs nothing, and it is the only one that crosses a vacuum, as sunlight does. Good emitters are good absorbers: if a surface absorbed well but emitted badly, an object in a sealed box would warm itself above its surroundings. So shiny surfaces, which absorb little, also emit little.',
  'Bare skin at 33 °C, area 1.8 m², in a room at 20 °C radiates a net σA(T₁⁴ − T₂⁴) = 5.67 × 10⁻⁸ × 1.8 × (306⁴ − 293⁴) ≈ 140 W: more than the 100 W a resting body produces, which is why we wear clothes.',
  'Real heat flow nearly always mixes all three, and convection is usually turbulent and messy, so engineers rely on measured coefficients rather than neat formulas.'
]);
WL.fy('gcse-induction', [
  'Push a magnet into a coil and a meter flicks; hold it still and nothing happens; pull it out and the meter flicks the other way. Only change makes a current.',
  'A changing magnetic field through a coil pushes the charges round it. Spin a coil in a magnetic field and the field through it keeps changing, growing, shrinking and reversing, so the push keeps reversing: **alternating current**.',
  'Faraday found that the induced e.m.f. equals the rate of change of magnetic flux linkage. Its direction always opposes the change that causes it (Lenz’s law); if it helped the change, it would feed itself and give energy from nothing. That is why turning a generator under load is hard work: your work becomes the electrical energy.',
  'A coil of 500 turns and area 0.01 m², spinning 50 times a second in a 0.1 T field, gives a peak e.m.f. of NBAω = 500 × 0.1 × 0.01 × 2π × 50 ≈ 160 V.',
  'Real generators use iron cores and several coils, and the coils’ resistance and inductance mean the output voltage depends on what is connected.'
]);
WL.fy('gcse-lenses', [
  'A magnifying glass held at arm’s length shows an upside-down, shrunken window. Held close to a page, it shows the words upright and bigger.',
  'A convex lens is thicker in the middle, so light through the middle is delayed more than light near the edge. Rays from one point of an object are bent towards each other and meet at one point: the image. If the object is inside the focal length, the rays still spread out after the lens, and the eye traces them back to a larger, upright **virtual image**.',
  'Every path from a point on the object to its image point takes the same time: the extra glass in the middle exactly makes up for the shorter straight path through the centre. That equal-time condition is what fixes the lens formula 1/f = 1/u + 1/v.',
  'A lens with f = 10 cm and an object 15 cm away: 1/v = 1/10 − 1/15 = 1/30, so the image is 30 cm away, twice the size and inverted. With the object at 5 cm, 1/v = 1/10 − 1/5 = −1/10: a virtual image 10 cm away on the object’s side, twice the size.',
  'Real lenses do not bring every colour, or every ray, to the same point (chromatic and spherical aberration), and the thin-lens formula assumes rays close to the axis.'
]);
WL.fy('gcse-magnetism', [
  'A loose wire carrying a current jumps sideways between the poles of a magnet. Reverse the current and it jumps the other way.',
  'The moving charges in the wire feel a sideways push from the magnetic field, at right angles both to the field and to the current. The wire’s own field adds to the magnet’s on one side and cancels it on the other, and the wire is pushed towards the weaker side: the **motor effect**.',
  'A magnetic field pushes sideways on each moving charge with F = qvB. Add up all the moving charges in a length L of wire and the total is BIL. The force is always at right angles to the charges’ motion, so the field itself does no work on them: the energy comes from the battery.',
  'One metre of wire carrying 10 A across the Earth’s field (5 × 10⁻⁵ T) feels 5 × 10⁻⁵ × 10 × 1 = 0.5 mN, the weight of about 50 mg. Between the poles of a motor magnet (0.5 T) the same wire feels 5 N.',
  'F = BIL is for a straight wire at right angles to a uniform field. In general the force depends on the angle (BIL sin θ) and on the shape of the field.'
]);
WL.fy('gcse-mass-weight', [
  'An astronaut weighs about a sixth as much on the Moon, yet getting a heavy trolley moving there is just as hard as on Earth. Weight changed; something else did not.',
  '**Mass** measures how much stuff there is and how hard it is to accelerate. **Weight** is the pull of gravity on that mass, W = mg. On the Moon g is about 1.6 N/kg instead of 9.8, so the weight falls, but the mass, and the push needed to speed it up, stay the same.',
  'Two different-looking properties, how hard a thing is to accelerate and how strongly gravity pulls on it, turn out to be exactly proportional, to better than one part in 10¹⁴. That is why everything falls at the same rate, and it became Einstein’s starting point for general relativity.',
  'A 70 kg person weighs 70 × 9.8 ≈ 690 N on Earth and 70 × 1.6 ≈ 110 N on the Moon. People are about as dense as water (we only just float), so their volume is about 0.07 m³.',
  'g is not quite the same everywhere on Earth: it ranges from about 9.78 N/kg at the equator to 9.83 N/kg at the poles, because the Earth spins and bulges.'
]);
WL.fy('gcse-measurement', [
  'Walk 3 km east and then 4 km north. You have walked 7 km, but you are only 5 km from where you started.',
  'Some quantities have only a size, such as distance, mass and temperature: **scalars**. Others also have a direction, such as displacement, velocity and force: **vectors**, which add like arrows placed tip to tail.',
  'The arrow rule is just how trips combine: going 3 km east and then 4 km north lands you exactly where one straight trip would. When the two are at right angles, Pythagoras gives the size of the result, √(3² + 4²) = 5.',
  'Measure a 20 cm pencil with a millimetre ruler and each end is uncertain by about half a millimetre, so about ±1 mm, 0.5 %. Time one 2 s pendulum swing by hand and your reaction time of about 0.2 s is 10 %; time ten swings and it falls to 1 %.',
  'A measurement means little without its uncertainty, and systematic errors, such as a ruler with a worn end or a clock that runs fast, do not shrink however many times you repeat.'
]);
WL.fy('gcse-moments', [
  'A tall bus can lean a surprisingly long way before it topples, but load the top deck with heavy luggage and it tips much sooner.',
  'All of an object’s weight acts as if it were at one point, the **centre of gravity**. The object topples when that point moves outside its base: then the weight’s moment turns it over instead of back.',
  'In equilibrium there is no resultant force and no resultant turning effect about any point. As the object tilts, the line of its weight moves towards the edge of the base; at the tipping angle it passes through the edge, and beyond that the weight’s moment about the edge changes direction.',
  'A bus 2.5 m wide with its centre of gravity 1.2 m up tips when tan θ = 1.25/1.2, θ ≈ 46°. Raise the centre of gravity to 1.6 m and tan θ = 1.25/1.6 gives θ ≈ 38°. Real double-deckers must pass a tilt test at 28°.',
  'Real objects flex, and their contents shift as they tilt (liquids slosh, passengers lean), which moves the centre of gravity during the tip.'
]);
WL.fy('gcse-motor', [
  'A coil between two magnets, wired straight to a battery, would rock to and fro and settle. Yet a motor spins steadily in one direction.',
  'The coil feels opposite forces on its two sides, one up and one down: a turning effect. Once it passes upright, the same forces would turn it back. The split-ring **commutator** swaps the connections every half turn, reversing the current just as the coil passes upright, so the push always turns it the same way.',
  'The turning effect on a coil is NBIA sin θ: zero when the coil faces the poles squarely and largest when its plane lies along the field. Reversing the current every half turn keeps the turning effect the same sign, so its average is not zero.',
  'With 100 turns, 0.2 T, 1 A and a coil 4 cm by 4 cm, the largest turning effect is 100 × 0.2 × 1 × 0.0016 = 0.032 N m: about the same as 32 g hanging on the end of a 10 cm arm.',
  'A spinning motor is also a generator: it makes a back e.m.f. that opposes the battery and grows with speed, which is what limits its top speed and its current.'
]);
WL.fy('gcse-newton', [
  'Jump from a small boat to a jetty and the boat shoots backwards, and you may land short. A rifle kicks back when it fires.',
  'Forces come in pairs: you push the boat back and the boat pushes you forward, equally and oppositely. **Momentum**, mass × velocity, is what the two trade: whatever one gains, the other loses.',
  'Newton’s third law means the forces inside a system cancel in pairs, so the system’s total momentum can only change through an outside force. The deeper reason is that the laws of physics are the same everywhere in space; that symmetry gives conservation of momentum (Noether’s theorem).',
  'A 60 kg person jumping from a 120 kg boat at 2 m/s sends it back at 60 × 2/120 = 1 m/s. A 4 kg rifle firing a 10 g bullet at 800 m/s recoils at 0.01 × 800/4 = 2 m/s.',
  'Momentum conservation says nothing about energy: in a crash momentum is conserved but kinetic energy is not.'
]);
WL.fy('gcse-orbits', [
  'Light from distant galaxies is shifted towards the red, and the further away the galaxy, the bigger the shift. Almost every galaxy is moving away from us.',
  'Space itself is stretching. Think of raisins in rising dough: every raisin sees every other moving away, faster in proportion to its distance. Light crossing stretching space has its wavelength stretched too: **red-shift**.',
  'If the stretching is the same everywhere, the speed at which galaxies recede must be proportional to their distance, v = H₀d; any other rule would pick out a centre. Run the film backwards and everything was together a finite time ago, roughly 1/H₀: the **Big Bang**.',
  'H₀ ≈ 70 km/s per megaparsec, so 1/H₀ = 3.09 × 10¹⁹ km ÷ 70 km/s ≈ 4.4 × 10¹⁷ s ≈ 14 billion years, close to the measured age of 13.8 billion years.',
  'The expansion has not been steady: gravity slowed it for billions of years and dark energy now speeds it up, so the closeness of 1/H₀ to the true age is partly a coincidence.'
]);
WL.fy('gcse-particles', [
  'A bicycle pump gets warm as you pump, and a sealed can heated on a fire can burst.',
  'Gas **pressure** is the drumming of countless molecules on the walls. Heat the gas and the molecules move faster, hitting harder and more often. Squash it into less space and the same molecules hit the walls more often.',
  'Each hit hands momentum to the wall, and pressure is force per area, so it grows with the number of molecules per volume and with their speed squared: faster molecules hit harder and more often. Temperature measures their average kinetic energy, so at fixed volume p ∝ T, with T in kelvin.',
  'In room air about 3 × 10²⁷ molecules strike every square metre of wall each second, at about 500 m/s, and together they push with 10⁵ Pa. Heating a sealed can from 20 °C to 100 °C raises the pressure by 373/293, about 27 %.',
  'Real molecules attract each other and take up room, so at high pressure or low temperature a gas stops obeying pV = nRT, and eventually it liquefies.'
]);
WL.fy('gcse-power-cost', [
  'A 3 kW kettle boils a litre of water in about two minutes. A 10 W LED bulb could run for ten hours on the same energy.',
  '**Power** is the rate at which energy is transferred: joules per second. The electricity bill counts energy in **kilowatt-hours**: 1 kW for 1 hour, which is 3.6 million joules.',
  'E = Pt because power is energy per unit time; P = IV because each coulomb carries V joules and I coulombs flow each second. The kilowatt-hour is just a bigger unit, the right size for household amounts.',
  'Heating 1 kg of water from 20 °C to 100 °C takes 4200 × 1 × 80 = 336 kJ ≈ 0.09 kWh: about two minutes at 3 kW and two or three pence at 25 to 30p per kWh.',
  'Appliances do not run at their rated power all the time (fridges cycle on and off, kettles switch off), and a fossil-fuel power station burns roughly twice the energy that reaches your home.'
]);
WL.fy('gcse-pressure', [
  'A dam is much thicker at the bottom than at the top. And the pressure at the bottom of a narrow pipe of water 10 m tall equals the pressure 10 m down in a lake.',
  'The pressure at a depth comes from the weight of the water above each square metre. Only the depth matters, not the shape or width of the container, because the container’s sides take any extra weight.',
  'A column of water of height h and area A weighs ρAhg, spread over the area A: so p = ρgh. At any point the pressure is the same in every direction, and it is the same at every point at the same depth in connected water, or the water would flow.',
  'Every 10 m of water adds about one atmosphere: 1000 × 9.8 × 10 ≈ 10⁵ Pa. At the bottom of the Mariana Trench, 11 km down, the pressure is about 1100 atmospheres.',
  'Water is very slightly compressible and seawater gets a little denser with depth. And moving fluids have lower pressure where they flow faster (Bernoulli), which p = ρgh does not cover.'
]);
WL.fy('gcse-radiation', [
  'Alpha particles are stopped by a sheet of paper or a few centimetres of air, beta by a few millimetres of aluminium, while gamma rays are only weakened by centimetres of lead.',
  'Alpha particles are heavy, doubly charged helium nuclei: they barge through matter, ionising every atom they pass, and lose their energy quickly. Beta particles are fast electrons, lighter and singly charged, and ionise less per centimetre. Gamma rays are uncharged photons: they interact only rarely and travel far.',
  'How fast a particle loses energy depends on how strongly it tugs on the electrons it passes, which grows with its charge and with how slowly it moves. Slow, doubly charged alphas lose energy fastest. Gamma rays have no charge and interact only in occasional single events, so their intensity falls off steadily with thickness instead of stopping at a fixed range.',
  'A 5 MeV alpha particle creates about 150 000 ion pairs (about 34 eV each) in roughly 4 cm of air before it stops: about 4000 for every millimetre.',
  'Danger depends on where the source is: outside the body alpha is harmless because dead skin stops it, but swallowed or breathed in it does the most damage for each joule absorbed.'
]);
WL.fy('gcse-radioactivity', [
  'No one can say when a particular nucleus will decay, yet a sample’s activity halves in the same time again and again, so reliably that we date rocks and bones by it.',
  'Each nucleus has a fixed small chance of decaying in each second, with no memory of how long it has already lasted. With enormous numbers of nuclei, the same fraction decays each second, so the number left falls by the same fraction in equal times: **exponential decay**.',
  'If each nucleus decays with probability λ per second, then dN/dt = −λN, and the solution is N = N₀e^(−λt); the **half-life** is ln 2/λ. Chance for one nucleus becomes near-certainty for 10²⁰ of them, because the fluctuations grow only as √N.',
  'Carbon-14 has a half-life of 5730 years. A bone with a quarter of the carbon-14 of living tissue is two half-lives old: about 11 500 years.',
  'In small samples the chance shows: counts scatter by about √N, so 100 counts means ±10, which is why counts are repeated and background is subtracted.'
]);
WL.fy('gcse-reflection-refraction', [
  'A straw in a glass of water looks bent at the surface, and optical fibres carry light round corners for kilometres with very little loss.',
  'Light slows down in water and glass. A beam meeting the surface at a slant has one edge slowed before the other, so the beam swings round, like a line of marchers wheeling as one end steps into mud: **refraction**. Going from glass into air at a steep enough angle, the light cannot get out at all and is totally reflected.',
  'Snell’s law, n₁ sin θ₁ = n₂ sin θ₂, comes from the wave crests having to match up along the boundary. Leaving glass, sin θ₂ = n sin θ₁ cannot be bigger than 1, so beyond the **critical angle**, where sin θc = 1/n, there is no refracted ray and all the light reflects.',
  'For glass with n = 1.5 the critical angle is arcsin(1/1.5) ≈ 42°: a ray meeting the inside surface at more than 42° from the normal stays inside. For water (n = 1.33) it is about 49°.',
  'Some light is reflected even below the critical angle, a few per cent at a glass surface, and real fibres lose light to impurities and bends: about 0.2 dB per kilometre at the best wavelengths.'
]);
WL.fy('gcse-resources', [
  'Britain’s electricity changes hour by hour: wind on a stormy night, solar at noon, gas when it is calm and dark. Why can no single source do everything?',
  'Every power station turns some store of energy into electricity: chemical (fossil fuels), nuclear, the motion of wind and water, or sunlight. The sources differ in how much energy they hold per kilogram, how much land they need, whether they can be switched on when wanted, and what they release.',
  'The trade-offs come from physics. Fuels store energy densely and can be burnt on demand, but burning carbon makes carbon dioxide. Wind and sunlight cost nothing to collect and release no carbon, but their energy is spread thin and comes and goes, so they need large areas and storage.',
  'Burning 1 kg of natural gas releases about 55 MJ; fission of 1 kg of uranium-235 releases about 80 000 000 MJ. Wind at 10 m/s through a rotor 100 m across carries ½ρAv³ ≈ ½ × 1.2 × 7850 × 1000 ≈ 4.7 MW, of which a turbine can capture at most 59 %.',
  'A fair comparison also counts building, storage, grid upgrades and waste, and the cost per kilowatt-hour depends heavily on how much backup the whole system needs.'
]);
WL.fy('gcse-safety', [
  'A faulty metal toaster can make its case live at 230 V, yet a fuse usually blows before anyone touches it. A plastic hairdryer has no earth wire at all.',
  'The **earth wire** connects the metal case to the ground. If the live wire touches the case, a very large current rushes through the low-resistance earth path, the **fuse** melts, and the live wire is cut off. Double-insulated appliances make sure no outside part can ever become live.',
  'A body is a few thousand ohms; the earth path is a fraction of an ohm, so the fault current goes almost entirely through the earth wire and is large enough to melt the fuse in a fraction of a second. A residual current device is faster still: it compares the live and neutral currents and trips if as little as 30 mA goes missing, perhaps through a person.',
  'At 230 V, a 2 kΩ path through a body carries about 0.1 A, enough to stop a heart (50 mA can). The same fault through a 0.5 Ω earth path is about 460 A, which blows a 13 A fuse almost at once.',
  'Fuses protect wiring and appliances, not people: a 13 A fuse lets through currents far above the fatal level before it blows. That is why homes now need residual current devices.'
]);
WL.fy('gcse-shc', [
  'A pan of water on the hob warms steadily, but once it boils its temperature stops rising, even with the heat still on full.',
  'Heating makes the particles move faster, so the temperature rises, until they have enough energy to break free of their neighbours. At the boiling point all the energy goes into pulling particles apart, the **latent heat**, not into making them faster.',
  '**Specific heat capacity** is the energy to warm 1 kg by 1 °C. Water’s is high because energy also goes into rotating and vibrating its molecules and stretching its hydrogen bonds. Latent heat is the energy to break those bonds at a fixed temperature; it is large because each particle has to be torn away from all its neighbours.',
  'Warming 1 kg of water from 20 °C to 100 °C takes 4200 × 80 = 336 kJ; boiling it all away takes 2260 kJ, almost seven times more. That is why a pan takes a long time to boil dry.',
  'The boiling point depends on pressure: water boils at about 70 °C on top of Everest, which is why pressure cookers, at higher pressure, cook faster.'
]);
WL.fy('gcse-solar-system', [
  'Mercury goes round the Sun in 88 days, the Earth in a year and Neptune in 165 years. The further out a planet is, the slower it moves.',
  'The Sun’s pull weakens with distance, as 1/r². A planet stays in orbit when that pull exactly supplies the centripetal force for its path; further out, a weaker pull can only hold a slower planet, and the path round is longer too.',
  'Setting GMm/r² = mv²/r gives v = √(GM/r), so the speed falls as 1/√r. The period T = 2πr/v then grows as r^(3/2): Kepler’s third law, T² ∝ r³.',
  'Jupiter is 5.2 times further from the Sun than the Earth, so its year is 5.2^1.5 ≈ 11.9 Earth years, and its speed is 30 km/s ÷ √5.2 ≈ 13 km/s.',
  'Orbits are ellipses rather than circles, the planets tug on each other slightly, and Mercury’s orbit slowly turns in a way only general relativity explains.'
]);
WL.fy('gcse-sound', [
  'Bats catch insects in the dark, and doctors see babies in the womb, using sound too high for us to hear.',
  '**Ultrasound** is sound above 20 kHz. Some of it reflects at every boundary between materials of different density or stiffness, and timing the echoes gives the depth of each boundary.',
  'A wave can only show details bigger than about its wavelength. Ultrasound at a few megahertz has a wavelength of under a millimetre in the body, fine enough to picture organs. How much reflects depends on how different the two materials are (their acoustic impedance, density × speed), which is why gel is used between the probe and the skin: a layer of air would reflect almost everything.',
  'Sound travels through soft tissue at about 1540 m/s, so an echo returning after 0.1 ms comes from 1540 × 0.0001 ÷ 2 ≈ 7.7 cm deep. At 3 MHz the wavelength is 1540/(3 × 10⁶) ≈ 0.5 mm.',
  'Higher frequencies are absorbed faster, so there is a trade-off between detail and depth; and bone and gas block ultrasound, which is why it cannot image the lungs or an adult’s brain.'
]);
WL.fy('gcse-stars', [
  'The Sun has shone steadily for 4.6 billion years. No chemical fuel could last that long: a Sun made of coal would burn out in a few thousand years.',
  'The Sun is a ball of hot gas, held together by its own gravity and held up by its pressure. In the core, at about 15 million kelvin, hydrogen nuclei **fuse** into helium, and the energy released keeps the core hot enough to hold the star up.',
  'Fusing hydrogen into helium turns about 0.7 % of the mass into energy (E = mc²), around ten million times more per kilogram than any burning. A star regulates itself: if fusion runs too fast, the core heats, expands and cools, and fusion slows down again.',
  'The Sun gives out 3.8 × 10²⁶ W, which is about 4 million tonnes of mass turned into energy every second, from about 600 million tonnes of hydrogen fused. Fusing about a tenth of its 2 × 10³⁰ kg this way lasts roughly 10 billion years.',
  'How a star ends depends on its mass: the Sun will become a white dwarf, while stars above about eight solar masses explode as supernovae.'
]);
WL.fy('gcse-static', [
  'Rub a balloon on your hair and it sticks to the wall, though the wall has no charge of its own.',
  'Rubbing moves electrons from hair to balloon, charging it negatively. Near the wall, the balloon’s charge pushes the wall’s electrons slightly away, leaving the nearest surface slightly positive. The nearby opposite charge is pulled more strongly than the more distant like charge is pushed, so the balloon is attracted.',
  'Electric forces weaken with distance, so a separated pair of charges induced in the wall feels a net pull towards the balloon. The same effect lets a charged comb pick up tiny bits of uncharged paper.',
  'The electric force between a proton and an electron is about 10³⁹ times their gravitational attraction. Electricity holds matter together; gravity only shapes things as big as planets.',
  'Which material gains electrons when two are rubbed depends on surface chemistry and even on humidity, and damp air lets charge leak away, which is why static tricks work best on dry days.'
]);
WL.fy('gcse-suvat', [
  'Drop a stone down a well and count the seconds until the splash: from that one number you can work out how deep the well is.',
  'With a steady acceleration, velocity grows in a straight line with time, and the distance covered is the area under that line: a triangle, plus a rectangle if the object was already moving. The five **suvat** equations are this one picture, rearranged.',
  'Constant a means v = u + at. Distance is the area under the velocity–time graph: s = ut + ½at². Eliminate t between the two and you get v² = u² + 2as. The average velocity is (u + v)/2 only because v grows in a straight line.',
  'A splash after 2 s means s = ½ × 9.8 × 2² ≈ 20 m, a little less in fact, because the sound takes about 0.06 s to come back up.',
  'suvat holds only for constant acceleration. With air resistance, or a car braking unevenly, you need the full calculus.'
]);
WL.fy('gcse-transformer', [
  'Power stations generate at about 25 kV, the national grid carries 400 kV, and homes get 230 V. Why step up to such dangerous voltages only to step down again?',
  'A **transformer** is two coils on one iron core. Alternating current in the first coil makes a changing magnetic field in the iron, which induces a voltage in the second; the voltages are in the ratio of the turns. Stepping the voltage up steps the current down for the same power.',
  'The power wasted heating the cables is I²R. Sending the same power P = IV at 16 times the voltage cuts the current 16-fold and the losses 256-fold. Transformers only work with changing currents, which is why the grid uses alternating current.',
  'Sending 400 MW through lines of 10 Ω in total: at 25 kV the current would be 16 000 A and the loss I²R ≈ 2.6 GW, more than the power sent. At 400 kV the current is 1000 A and the loss 10 MW, 2.5 %.',
  'Real transformers lose a few per cent to heating in the coils and in the iron, and very long lines now often use high-voltage direct current, converted electronically.'
]);
WL.fy('gcse-waves', [
  'Waves from a distant storm reach a beach sorted, the long, fast swells first and shorter ones later. And at the beach they swing round to arrive almost parallel to the shore.',
  'A wave carries energy without carrying the water along. Its speed depends on the medium: in deep water, longer waves travel faster; in shallow water all waves slow down as the depth falls, so the part of a wave in shallower water lags behind and the wave turns to face the beach.',
  'v = fλ links speed, frequency and wavelength. The frequency is set by the source and does not change when a wave enters a new medium, or the crests would pile up at the boundary; so if the speed changes, the wavelength must change with it. A change of speed across a boundary is what refracts the wave.',
  'Deep-water waves travel at v = gT/2π, so a 10 s swell moves at 9.8 × 10 / 6.28 ≈ 16 m/s, about 56 km/h. In water 1 m deep every wave travels at about √(gh) ≈ 3 m/s.',
  'Real seas are a jumble of many wavelengths added together, and large waves steepen and break, which the simple wave picture does not describe.'
]);
WL.fy('gcse-work-power', [
  'Walk up a flight of stairs or run up it: the work done is the same, but running leaves you out of breath. And you are far from efficient: you get warm doing it.',
  '**Work** is the energy transferred by a force moving something: force × distance moved in the direction of the force. **Power** is how fast you do it. **Efficiency** is the fraction of the energy put in that ends up where you wanted it.',
  'Lifting your weight through a height h takes mgh whatever the speed; doing it in less time means more joules per second. Muscles turn chemical energy into work at about 25 % efficiency, so three-quarters of the energy ends up as heat.',
  'A 60 kg person climbing 3 m of stairs does 60 × 9.8 × 3 ≈ 1.8 kJ of work: 600 W if it takes 3 s, 180 W if it takes 10 s. At 25 % efficiency the body uses about 7 kJ to do it.',
  'In physics, work means a force moving through a distance. Holding a heavy bag still does no work on the bag, though your muscles still use energy to keep it there.'
]);
})();
