/* ---- derive-1.js ---- */
/* Geodesic — derivations for notes-only topics: KS3 and GCSE physics. Each step: what we do, the line of maths, and why it is allowed. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('ks3-energy', [
    ["Energy is never made or destroyed, so everything put in must come out somewhere.", R`E_{\text{in}} = E_{\text{useful}} + E_{\text{wasted}}`, "This is conservation of energy, the best-tested rule in physics. If the two sides ever differed, energy would have appeared from nothing or vanished."],
    ["Efficiency is the fraction of the input that ends up where we want it.", R`\text{efficiency} = \frac{E_{\text{useful}}}{E_{\text{in}}}`, "It is a definition: a fraction compares a part with the whole. Multiply by 100 to get a percentage."],
    ["Replace the useful energy using the first line.", R`\text{efficiency} = \frac{E_{\text{in}} - E_{\text{wasted}}}{E_{\text{in}}} = 1 - \frac{E_{\text{wasted}}}{E_{\text{in}}}`, "Useful = in − wasted, so the efficiency falls short of 1 by exactly the wasted fraction."],
    ["Wasted energy cannot be negative, so the efficiency can never pass 1.", R`E_{\text{wasted}} \ge 0 \;\Longrightarrow\; \text{efficiency} \le 1`, "A machine giving out more than it takes in would be creating energy. In practice some energy always heats the surroundings, so real efficiencies are below 100%."]
  ], R`\text{efficiency} = \frac{E_{\text{useful}}}{E_{\text{in}}} = 1 - \frac{E_{\text{wasted}}}{E_{\text{in}}} \le 1`, [
    "“Wasted” depends on what you want: the heat from a lamp is wasted, the heat from a heater is useful.",
    "Heat pumps deliver more heat than the electrical energy they use, but they move energy from outside; counting that input, conservation still holds."
  ]);

  d('ks3-forces', [
    ["Experiments show that the pull of gravity on an object doubles when its mass doubles.", R`W \propto m`, "Hang 100 g, 200 g, 300 g on a newton-meter and the readings are 1 N, 2 N, 3 N: a straight line through the origin."],
    ["A proportionality becomes an equation with a constant, called g.", R`W = m g, \qquad g \approx 10\ \text{N/kg on Earth}`, "g is the gradient of the weight–mass graph: the newtons of pull on each kilogram."],
    ["Forces along one line combine: those in the same direction add, opposite ones subtract.", R`F_{\text{resultant}} = F_{\text{forward}} - F_{\text{backward}}`, "A force has a direction. Choosing forward as positive, backward forces count as negative."],
    ["A falling object speeds up until air resistance has grown to equal its weight.", R`F_{\text{resultant}} = W - F_{\text{air}} = 0 \;\Longrightarrow\; \text{steady speed}`, "Air resistance increases with speed. When the resultant reaches zero the speed stops changing: terminal velocity."]
  ], R`W = mg, \qquad F_{\text{resultant}} = 0 \Leftrightarrow \text{no change in speed}`, [
    "g is 10 N/kg only near Earth’s surface (more precisely 9.8); on the Moon it is 1.6 N/kg.",
    "In a vacuum there is no air resistance, so a feather and a hammer fall together, as shown on the Moon by Apollo 15."
  ]);

  d('ks3-density', [
    ["Density says how much mass is packed into each unit of volume.", R`\rho = \frac{m}{V}`, "A definition. Two blocks of the same size can have different masses; dividing by volume makes a fair comparison."],
    ["An object placed in water pushes aside its own volume of water, which lets us measure an awkward shape.", R`V = V_{\text{after}} - V_{\text{before}}`, "Water cannot be squashed, so the level rises by exactly the volume that went in."],
    ["A fully submerged object is pushed up by a force equal to the weight of the water it pushed aside.", R`F_{\text{up}} = \rho_{\text{water}} V g, \qquad W = \rho_{\text{object}} V g`, "This is Archimedes’ principle. Both forces contain the same volume V and the same g."],
    ["Compare the two: the object sinks if its weight is larger.", R`W > F_{\text{up}} \iff \rho_{\text{object}} > \rho_{\text{water}}`, "V and g cancel from both sides, so only the densities matter, not the size of the object."]
  ], R`\rho = \frac{m}{V}; \quad \text{floats if } \rho_{\text{object}} < \rho_{\text{liquid}}`, [
    "A steel ship floats because its average density, including the air inside the hull, is below that of water.",
    "Density changes with temperature: most things expand when heated, so their density falls."
  ]);

  d('ks3-heat', [
    ["Temperature measures how fast particles jiggle on average; heat is energy moving because of a temperature difference.", R`\text{heat flows: hot} \rightarrow \text{cold}`, "Faster particles hand energy to slower ones in collisions far more often than the reverse."],
    ["Mix two amounts of the same liquid. Energy lost by the hot part equals energy gained by the cold part.", R`m_1 c\,(T_1 - T) = m_2 c\,(T - T_2)`, "Conservation of energy, with no losses to the room. Each kilogram stores c joules per degree, so energy change = mass × c × temperature change."],
    ["The same liquid means c cancels. Expand the brackets and collect T.", R`m_1T_1 + m_2T_2 = (m_1 + m_2)\,T`, "Move every term with the unknown T to one side."],
    ["Divide to find the final temperature.", R`T = \frac{m_1T_1 + m_2T_2}{m_1 + m_2}`, "It is a weighted average: the larger mass pulls the answer towards its own temperature."]
  ], R`T_{\text{mix}} = \frac{m_1T_1 + m_2T_2}{m_1 + m_2}`, [
    "Only for the same substance, with no change of state and no energy lost to the container or the air.",
    "A bath at 40 °C holds far more thermal energy than a spark at 1000 °C: temperature is not the same as energy."
  ]);

  d('ks3-climate', [
    ["Carbon dioxide is measured in parts per million. Convert to a percentage.", R`420\ \text{ppm} = \frac{420}{1\,000\,000} = 0.042\%`, "1% is one part in a hundred, which is 10 000 parts in a million. So divide ppm by 10 000."],
    ["Earth’s temperature is steady when energy arriving equals energy leaving.", R`P_{\text{in (sunlight)}} = P_{\text{out (infrared)}}`, "If more arrived than left, energy would pile up and the planet would warm until the two balanced again."],
    ["Greenhouse gases absorb some outgoing infrared and send part of it back down.", R`P_{\text{out}} < P_{\text{in}} \;\Longrightarrow\; \text{energy accumulates}`, "CO₂ and water vapour are transparent to sunlight but absorb infrared, so they cut the outgoing flow without changing the incoming one."],
    ["The surface warms until it radiates enough to restore the balance at a higher temperature.", R`T \uparrow \;\Longrightarrow\; P_{\text{out}} \uparrow \;\text{until}\; P_{\text{out}} = P_{\text{in}}`, "Hotter objects radiate more. The new balance point is warmer than the old one."]
  ], R`\text{more CO}_2 \Rightarrow P_{\text{out}} \text{ drops} \Rightarrow T \text{ rises until } P_{\text{in}} = P_{\text{out}}`, [
    "Without any greenhouse effect Earth would average about −18 °C; the natural effect is what keeps it near +15 °C.",
    "How much warming follows a given CO₂ rise also depends on feedbacks (ice, clouds, water vapour), which is where the scientific uncertainty lies."
  ]);

  d('ks3-sound', [
    ["Sound travels at a steady speed, so the usual speed equation applies.", R`v = \frac{\text{distance}}{\text{time}}`, "Sound in air at room temperature covers about 340 m every second."],
    ["An echo has gone to the wall and come back: twice the distance d to the wall.", R`v = \frac{2d}{t}`, "The timer runs for the whole round trip, there and back."],
    ["Rearrange for the distance to the wall.", R`d = \frac{v\,t}{2}`, "Multiply both sides by t and divide by 2. Forgetting the 2 is the classic mistake."],
    ["Pitch is set by how many vibrations happen each second: one divided by the time for one vibration.", R`f = \frac{1}{T}`, "If one vibration takes 0.01 s, then 100 fit into a second, so f = 100 Hz."]
  ], R`d = \frac{vt}{2}, \qquad f = \frac{1}{T}`, [
    "The speed of sound changes with temperature and with the material: about 340 m/s in air, 1500 m/s in water, 5000 m/s in steel.",
    "Sound needs particles to pass the vibration on, so there is no sound in a vacuum."
  ]);

  d('ks3-colour', [
    ["White light is a mixture of colours. Each colour slows by a different amount in glass.", R`v_{\text{violet in glass}} < v_{\text{red in glass}}`, "Measured fact: glass slows violet light slightly more than red."],
    ["The more a colour slows, the more its ray bends on entering the glass.", R`\text{bending: violet} > \text{blue} > \text{green} > \text{yellow} > \text{red}`, "Refraction is caused by the change of speed. A bigger change gives a bigger turn."],
    ["A prism bends twice in the same direction, spreading the colours into a spectrum.", R`\text{white} \rightarrow \text{R, O, Y, G, B, I, V}`, "The angled faces mean the second refraction adds to the first instead of undoing it, as it would in a parallel-sided block."],
    ["An object’s colour is the light it reflects; a filter’s colour is the light it lets through.", R`\text{red object in green light}: \text{reflects nothing} \Rightarrow \text{looks black}`, "A red surface absorbs every colour except red. With no red light arriving, nothing comes back to your eye."]
  ], R`\text{R} + \text{G} + \text{B} = \text{white (light)}; \quad \text{surface colour} = \text{light reflected}`, [
    "Mixing paints is different from mixing light: each pigment removes colours, so mixing all paints tends to black.",
    "“Seven colours” is a convention; the spectrum is continuous."
  ]);

  d('ks3-parallel', [
    ["Charge is not used up, so the current arriving at a junction equals the current leaving.", R`I_{\text{supply}} = I_1 + I_2`, "Electrons cannot pile up at a junction or vanish; what flows in must flow out."],
    ["Each branch is connected straight across the supply, so each gets the full voltage.", R`V_1 = V_2 = V_{\text{supply}}`, "Both ends of every branch join the same two wires, so the push across each branch is the same."],
    ["Resistance is defined as the voltage needed per amp of current.", R`R = \frac{V}{I}`, "A component that needs a big push for a small current has a high resistance."],
    ["Adding a branch adds current at the same voltage, so the whole circuit’s resistance falls.", R`R_{\text{total}} = \frac{V}{I_1 + I_2} < \frac{V}{I_1}`, "A bigger number on the bottom of a fraction makes the fraction smaller: more paths, less resistance."]
  ], R`I_{\text{supply}} = I_1 + I_2, \quad V_1 = V_2, \quad R = \frac{V}{I}`, [
    "Real cells have some internal resistance, so the voltage drops a little when many branches draw a large current.",
    "In series the rules swap: the current is the same everywhere and the voltages add."
  ]);

  d('ks3-magnets', [
    ["A wire carrying a current has a magnetic field around it.", R`\text{current} \Rightarrow \text{magnetic field}`, "Oersted saw a compass needle swing when a nearby current was switched on (1820)."],
    ["Coiling the wire makes the fields of all the turns add up along the axis.", R`B \propto N \ (\text{turns})`, "Each turn makes the same field in the same direction inside the coil, so N turns give N times the field."],
    ["The field of each turn grows in proportion to the current.", R`B \propto I`, "Double the flow of charge and the magnetic effect of each turn doubles."],
    ["An iron core becomes magnetised itself and adds its own, much larger, field.", R`B_{\text{with iron}} \gg B_{\text{air core}}`, "Iron contains tiny magnetic regions that line up with the coil’s field. Soft iron loses this again when the current stops, which is what makes the magnet switchable."]
  ], R`\text{strength} \uparrow \text{ with turns } N,\ \text{current } I,\ \text{and an iron core}`, [
    "The iron saturates: beyond a certain current nearly all its regions are aligned and extra current adds little.",
    "Steel would stay magnetised after switching off, so it is the wrong core for an electromagnet."
  ]);

  d('ks3-tides-eclipses', [
    ["Gravity weakens with distance, so the Moon pulls the near side of Earth harder than the far side.", R`F_{\text{near}} > F_{\text{centre}} > F_{\text{far}}`, "The near-side ocean is about 6400 km closer to the Moon than Earth’s centre, the far side 6400 km further."],
    ["Relative to Earth’s centre, water is stretched towards the Moon on one side and left behind on the other.", R`\text{two bulges: one facing the Moon, one opposite}`, "What matters is the difference in pull. The near side is pulled more than the centre; the centre is pulled more than the far side."],
    ["Earth spins under the two bulges once a day, so most coasts see two high tides.", R`\text{interval} \approx \tfrac12 \times 24\ \text{h}\ 50\ \text{min} = 12\ \text{h}\ 25\ \text{min}`, "The extra 50 minutes is because the Moon has moved on in its orbit while Earth turned."],
    ["An eclipse needs Sun, Earth and Moon in a straight line.", R`\text{solar: Moon between (new Moon)}; \quad \text{lunar: Earth between (full Moon)}`, "A shadow only falls on something directly behind the object that blocks the light."]
  ], R`\text{two tidal bulges} \Rightarrow \text{high tide every} \approx 12\ \text{h}\ 25\ \text{min}`, [
    "The Moon’s orbit is tilted by about 5°, so the line-up usually misses and there is no eclipse every month.",
    "Real tides are shaped by coastlines and ocean depth; the Sun adds about half the Moon’s effect (spring and neap tides)."
  ]);

  d('ks3-solar-system', [
    ["Light travels at a fixed speed, so a time of travel measures a distance.", R`d = c\,t, \qquad c = 300\,000\ \text{km/s}`, "The ordinary distance = speed × time, with the speed of light."],
    ["Count the seconds in one year.", R`t = 365 \times 24 \times 3600\ \text{s} \approx 3.15 \times 10^{7}\ \text{s}`, "Days × hours in a day × seconds in an hour."],
    ["Multiply to get the distance light covers in a year.", R`1\ \text{light-year} = 300\,000 \times 3.15\times10^{7} \approx 9.5 \times 10^{12}\ \text{km}`, "A light-year is a distance, not a time."],
    ["Looking far away is looking back in time.", R`t = \frac{d}{c}: \quad \text{Sun } 8\ \text{min}, \quad \text{nearest star } 4.2\ \text{years}`, "The light you see left its source that long ago."]
  ], R`1\ \text{light-year} \approx 9.5\times10^{12}\ \text{km}`, [
    "The speed of light quoted is for a vacuum; space is close enough to one.",
    "Planet formation, the giant-impact origin of the Moon and similar stories are models supported by evidence (rock ages, compositions, simulations), not direct observations."
  ]);

  d('ks3-earth', [
    ["Plates move at a steady, tiny speed, so distance = speed × time still works.", R`d = v\,t`, "GPS stations measure plate speeds directly: a few centimetres per year, about as fast as fingernails grow."],
    ["Put in a typical speed and a million years.", R`d = 2.5\ \text{cm/yr} \times 1\,000\,000\ \text{yr} = 2\,500\,000\ \text{cm}`, "The years cancel, leaving centimetres."],
    ["Convert to kilometres.", R`2\,500\,000\ \text{cm} = 25\,000\ \text{m} = 25\ \text{km}`, "Divide by 100 for metres, then by 1000 for kilometres."],
    ["Run the same sum backwards to date the Atlantic.", R`t = \frac{d}{v} = \frac{5000\ \text{km}}{2.5\ \text{cm/yr}} = 200\ \text{million years}`, "5000 km is 5 × 10⁸ cm. This matches the ages of the oldest Atlantic sea-floor rocks."]
  ], R`d = vt: \quad 2.5\ \text{cm/yr for } 10^{6}\ \text{yr} = 25\ \text{km}`, [
    "Plate speeds have not been constant over geological time; this is an estimate of scale.",
    "Evidence for moving plates: matching coastlines, fossils and rock types, magnetic stripes on the sea floor, and direct GPS measurement."
  ]);

  d('gcse-measurement', [
    ["Starting and stopping a timer by hand adds the same reaction error whether you time one swing or many.", R`t_N = N\,T \pm \Delta t`, "The error Δt (about 0.2 s) comes from you, not from how long the timing lasts."],
    ["Divide by the number of swings to get the period.", R`T = \frac{t_N}{N} \pm \frac{\Delta t}{N}`, "Dividing a measurement by N divides its uncertainty by N as well."],
    ["Two perpendicular vectors form the two short sides of a right-angled triangle.", R`R^2 = F_1^2 + F_2^2 \;\Longrightarrow\; R = \sqrt{F_1^2 + F_2^2}`, "Drawing the vectors tip-to-tail, the resultant is the hypotenuse, so Pythagoras applies."],
    ["The direction comes from the same triangle.", R`\tan\theta = \frac{F_2}{F_1}`, "tan = opposite ÷ adjacent, with θ measured from F₁."]
  ], R`T = \frac{t_N}{N}, \qquad R = \sqrt{F_1^2 + F_2^2},\ \tan\theta = \frac{F_2}{F_1}`, [
    "Pythagoras only works for perpendicular vectors; otherwise use a scale drawing or the cosine rule.",
    "Timing more swings does not help if the swings are dying away or you miscount them."
  ]);

  d('gcse-mass-weight', [
    ["Weight is the gravitational force on a mass; it is proportional to the mass.", R`W = m g`, "g is the gravitational field strength: the force on each kilogram, 9.8 N/kg on Earth."],
    ["Density is mass per unit volume.", R`\rho = \frac{m}{V}`, "A definition that lets materials be compared whatever the size of the sample."],
    ["Convert g/cm³ to kg/m³.", R`1\ \frac{\text{g}}{\text{cm}^3} = \frac{10^{-3}\ \text{kg}}{10^{-6}\ \text{m}^3} = 1000\ \frac{\text{kg}}{\text{m}^3}`, "1 cm = 10⁻² m, so 1 cm³ = (10⁻²)³ m³ = 10⁻⁶ m³. A million cubic centimetres fit in a cubic metre."],
    ["Combine the two to get the weight of a volume of material.", R`W = \rho V g`, "Substitute m = ρV into W = mg. This form is the starting point for liquid pressure and upthrust."]
  ], R`W = mg, \qquad \rho = \frac{m}{V}, \qquad W = \rho V g`, [
    "Mass is the same everywhere; weight depends on g, which varies slightly over Earth and greatly between planets.",
    "A balance compares masses and reads the same on the Moon; a spring scale measures weight and does not."
  ]);

  d('gcse-forces', [
    ["Loading a spring: equal extra loads give equal extra extensions.", R`F \propto x \;\Longrightarrow\; F = kx`, "The load–extension graph is a straight line through the origin; its gradient is the spring constant k."],
    ["Experiments with trolleys: acceleration is proportional to resultant force.", R`a \propto F \quad (m \text{ fixed})`, "Double the pulling force on the same trolley and the acceleration doubles."],
    ["And inversely proportional to mass.", R`a \propto \frac{1}{m} \quad (F \text{ fixed})`, "The same force on double the mass gives half the acceleration."],
    ["Combine the two proportionalities; the newton is defined so that the constant is 1.", R`a = \frac{F}{m} \;\Longrightarrow\; F = ma`, "1 N is the force that gives 1 kg an acceleration of 1 m/s², so no extra constant appears."]
  ], R`F = kx \ (\text{below the limit of proportionality}), \qquad F_{\text{res}} = ma`, [
    "Hooke’s law fails beyond the limit of proportionality; past the elastic limit the spring is permanently stretched.",
    "F must be the resultant force. F = ma assumes constant mass and speeds far below that of light."
  ]);

  d('gcse-moments', [
    ["The turning effect of a force depends on its size and on how far from the pivot it acts.", R`M = F\,d_{\perp}`, "d⊥ is the perpendicular distance from the pivot to the line of the force. A long spanner needs less force."],
    ["A balanced beam does not start to turn, so turning effects one way cancel those the other way.", R`\sum M_{\text{clockwise}} = \sum M_{\text{anticlockwise}}`, "If one side were larger, the beam would start rotating that way."],
    ["For two weights on a see-saw this gives a simple rule.", R`W_1 d_1 = W_2 d_2 \;\Longrightarrow\; d_2 = \frac{W_1 d_1}{W_2}`, "A heavier person must sit closer to the pivot."],
    ["It must also not move up or down, so the forces balance too.", R`\sum F_{\text{up}} = \sum F_{\text{down}}`, "The pivot pushes up with a force equal to the total weight. Two conditions are needed for equilibrium, not one."]
  ], R`M = Fd_{\perp}; \quad \text{equilibrium: } \sum M_{\text{cw}} = \sum M_{\text{acw}} \text{ and } \sum F = 0`, [
    "The beam’s own weight acts at its centre of gravity and must be included unless the pivot is there.",
    "Balanced does not have to mean horizontal: the rule holds for a beam at rest at any angle."
  ]);

  d('gcse-work-power', [
    ["Work is the energy transferred when a force moves something along its own direction.", R`W = F d`, "A definition. No movement, or movement at right angles to the force, means no work."],
    ["Power is the rate of doing work.", R`P = \frac{W}{t}`, "The same job done in half the time needs twice the power. 1 W = 1 J/s."],
    ["Substitute W = Fd.", R`P = \frac{F d}{t}`, "Just replacing W."],
    ["Recognise d/t as the speed.", R`P = F v`, "At steady speed v the object covers d = vt, so power = force × speed. This is why a car’s top speed is set by its engine power."]
  ], R`W = Fd, \qquad P = \frac{W}{t} = Fv, \qquad \text{efficiency} = \frac{\text{useful out}}{\text{total in}}`, [
    "W = Fd needs a constant force along the motion; otherwise use the component along the motion, or the area under a force–distance graph.",
    "P = Fv gives the power at that instant; if the speed changes, so does the power."
  ]);

  d('gcse-resources', [
    ["Water falling through a height h gives up gravitational potential energy.", R`E = m g h`, "Each kilogram loses gh joules as it drops h metres."],
    ["Power is energy per second, so use the mass arriving each second.", R`P = \frac{m g h}{t}`, "Divide the energy by the time taken."],
    ["Write the mass per second using density and volume flow rate Q.", R`\frac{m}{t} = \rho Q \;\Longrightarrow\; P = \rho Q g h`, "Mass = density × volume, and Q is the volume passing per second (m³/s)."],
    ["Only a fraction becomes electrical power.", R`P_{\text{electrical}} = \text{efficiency} \times \rho Q g h`, "Turbines and generators waste some energy as heat and leave the water with some kinetic energy. Large hydro plants reach about 90%."]
  ], R`P_{\text{electrical}} = \eta\,\rho Q g h, \qquad E = Pt`, [
    "Assumes the full head h is available at the turbine; friction in pipes reduces it.",
    "Comparing resources also needs reliability, cost, land use and emissions, none of which are in this equation."
  ]);

  d('gcse-pressure', [
    ["Pressure is force per unit area.", R`p = \frac{F}{A}`, "The same force spread over a larger area presses less hard: snowshoes versus stilettos."],
    ["Consider a column of liquid of height h and base area A. Its weight presses on the base.", R`F = m g = \rho V g = \rho (A h) g`, "Mass = density × volume, and the volume of a column is base area × height."],
    ["Divide by the base area.", R`p = \frac{\rho A h g}{A} = \rho g h`, "The area cancels, so the pressure depends only on depth and density, not on the shape or width of the container."],
    ["Between two depths the pressure differs by the weight of the liquid in between.", R`\Delta p = \rho g\,\Delta h`, "Apply the previous line to each depth and subtract. Any pressure on the surface (the atmosphere) cancels in the difference."]
  ], R`p = \frac{F}{A}, \qquad \Delta p = \rho g \Delta h`, [
    "Assumes constant density: fine for liquids, not for the atmosphere, where the air thins with height.",
    "Total pressure at depth is atmospheric pressure plus ρgh."
  ]);

  d('gcse-particles', [
    ["Gas pressure is the force of particles hitting the walls, per unit area.", R`p = \frac{F}{A}`, "Each collision gives the wall a tiny push; billions per second make a steady force."],
    ["Squeeze a gas to half the volume at the same temperature: the same particles hit each bit of wall twice as often.", R`V \rightarrow \tfrac12 V \;\Longrightarrow\; p \rightarrow 2p`, "The particles are twice as crowded but, at the same temperature, no faster."],
    ["So pressure is inversely proportional to volume.", R`p \propto \frac{1}{V} \;\Longrightarrow\; pV = \text{constant}`, "This is Boyle’s law, found by experiment in 1662."],
    ["Compare two states of the same gas.", R`p_1 V_1 = p_2 V_2`, "The constant is the same before and after, provided no gas escapes and the temperature is unchanged."],
    ["Cooling slows the particles. Extrapolating, they would stop at −273 °C, which defines the kelvin scale.", R`T\,(\text{K}) = \theta\,(^\circ\text{C}) + 273`, "A graph of gas pressure against temperature is a straight line that reaches zero at −273 °C: absolute zero."]
  ], R`p_1V_1 = p_2V_2 \ (\text{fixed mass and temperature}), \qquad T = \theta + 273`, [
    "Fixed mass of gas at constant temperature; compress it quickly and it heats up, breaking the law.",
    "Real gases deviate at high pressure or near the temperature at which they liquefy."
  ]);

  d('gcse-expansion', [
    ["Heating makes particles vibrate more and sit, on average, further apart.", R`T \uparrow \;\Longrightarrow\; \text{mean separation} \uparrow`, "The force between neighbouring particles is lopsided: easier to pull apart than to push together, so bigger vibrations shift the average outward."],
    ["Every metre of a rod expands by the same amount, so the total expansion is proportional to the original length.", R`\Delta L \propto L_0`, "A 2 m rod is two 1 m rods end to end, each growing equally."],
    ["It is also proportional to the temperature rise.", R`\Delta L \propto \Delta T`, "Found by experiment for moderate temperature changes."],
    ["Combine with a constant α that depends on the material.", R`\Delta L = \alpha L_0 \Delta T`, "α is the fractional change in length per degree: about 1.2 × 10⁻⁵ per °C for steel."]
  ], R`\Delta L = \alpha L_0 \Delta T`, [
    "α is roughly constant only over a limited temperature range.",
    "Water between 0 °C and 4 °C contracts on heating, which is why ice forms on top of ponds."
  ]);

  d('gcse-heat-transfer', [
    ["An object at steady temperature takes in energy as fast as it gives it out.", R`P_{\text{absorbed}} = P_{\text{emitted}}`, "If absorption were faster the object would warm; if slower it would cool."],
    ["Every square metre of a hot surface radiates, and far more strongly at higher temperature.", R`P_{\text{emitted}} = \varepsilon \sigma A T^4`, "The Stefan–Boltzmann law: T in kelvin, ε between 0 (perfect reflector) and 1 (perfect black body)."],
    ["Apply this to Earth: sunlight is absorbed over a disc, infrared is emitted from the whole sphere.", R`S (1 - a)\,\pi R^2 = \sigma \, 4\pi R^2 \, T^4`, "Earth blocks a disc of sunlight of area πR²; a fraction a (the albedo, about 0.3) is reflected. It radiates from its full surface 4πR²."],
    ["Solve for the temperature.", R`T = \left[\frac{S(1-a)}{4\sigma}\right]^{1/4} \approx 255\ \text{K}`, "With S = 1360 W/m². That is −18 °C, about 33 °C colder than the real surface; the difference is the greenhouse effect."]
  ], R`P_{\text{absorbed}} = P_{\text{emitted}}, \qquad P = \varepsilon\sigma A T^4`, [
    "The T⁴ law is beyond most GCSE courses; the balance idea is the examinable part.",
    "Treats Earth as one uniform temperature with no atmosphere."
  ]);

  d('gcse-waves', [
    ["In one period T the source makes one complete wave, and that wave moves forward exactly one wavelength.", R`\text{distance} = \lambda \quad \text{in time } T`, "The next crest is produced one period later, by which time the first has moved on by the crest spacing."],
    ["Speed is distance over time.", R`v = \frac{\lambda}{T}`, "Applying v = d/t to one wavelength."],
    ["Frequency is the number of waves per second.", R`f = \frac{1}{T}`, "If each wave takes T seconds, then 1/T of them pass per second."],
    ["Substitute.", R`v = f\lambda`, "Replacing 1/T by f. Each second, f waves each of length λ pass a point."]
  ], R`v = f\lambda`, [
    "The speed is set by the medium, the frequency by the source: when a wave enters a new medium, λ changes and f does not.",
    "True for all waves: water, sound, light, waves on strings."
  ]);

  d('gcse-reflection-refraction', [
    ["A wavefront crosses into glass at an angle; the end that enters first slows down first.", R`v_{\text{glass}} < v_{\text{air}}`, "In the same time, the part still in air travels further than the part already in glass, so the wavefront swings round."],
    ["In time t the two ends travel v₁t and v₂t; geometry of the two right-angled triangles sharing the boundary gives the angles.", R`\frac{\sin i}{\sin r} = \frac{v_{\text{air}}\,t}{v_{\text{glass}}\,t} = \frac{v_{\text{air}}}{v_{\text{glass}}}`, "Each distance is the opposite side of a triangle whose hypotenuse is the same stretch of boundary."],
    ["This ratio is a constant for the material, called the refractive index.", R`n = \frac{\sin i}{\sin r} = \frac{c}{v}`, "Snell’s law. n = 1.5 for glass means light travels 1.5 times slower in it."],
    ["Going from glass to air, the ray bends away from the normal. At the critical angle it runs along the surface.", R`n = \frac{\sin 90^\circ}{\sin c} \;\Longrightarrow\; \sin c = \frac{1}{n}`, "Reverse the ray: the angle in air is 90°, the angle in glass is c. Beyond c no refracted ray exists and all the light reflects."]
  ], R`n = \frac{\sin i}{\sin r} = \frac{c}{v}, \qquad \sin c = \frac{1}{n}`, [
    "n depends slightly on colour, which is what causes dispersion.",
    "Total internal reflection only happens going from the slower medium towards the faster one."
  ]);

  d('gcse-lenses', [
    ["Draw two rays from the top of the object: one through the centre of the lens (undeviated), one parallel to the axis (refracted through the focus).", R`\text{image is where the two rays meet}`, "Any two rays from the same point locate its image."],
    ["The central ray makes similar triangles on either side of the lens.", R`\frac{h_i}{h_o} = \frac{v}{u}`, "Same angle at the lens centre, so heights are in the same ratio as distances. This ratio is the magnification."],
    ["The ray through the focus makes another pair of similar triangles.", R`\frac{h_i}{h_o} = \frac{v - f}{f}`, "One triangle has height h_o and base f (lens to focus); the other has height h_i and base v − f."],
    ["Set the two expressions equal and divide through by v.", R`\frac{v}{u} = \frac{v}{f} - 1 \;\Longrightarrow\; \frac{1}{u} + \frac{1}{v} = \frac{1}{f}`, "Dividing by v gives 1/u = 1/f − 1/v; then move 1/v across."]
  ], R`\frac1f = \frac1u + \frac1v, \qquad m = \frac{h_i}{h_o} = \frac{v}{u}`, [
    "Thin lens, rays close to the axis. Thick lenses and wide beams give blurred images (aberrations).",
    "Uses the “real is positive” convention: a virtual image has negative v."
  ]);

  d('gcse-sound', [
    ["Sound moves at a steady speed through a given material.", R`v = \frac{d}{t}`, "Clap far from a wall or time a sound between two microphones."],
    ["For an echo the sound covers the distance twice.", R`v = \frac{2d}{t} \;\Longrightarrow\; d = \frac{vt}{2}`, "There and back. This is how sonar and ultrasound scans measure depth."],
    ["Like all waves, sound obeys the wave equation.", R`v = f\lambda`, "Each second f waves of length λ pass."],
    ["So the wavelengths we can hear span a huge range.", R`\lambda = \frac{v}{f}: \quad \frac{340}{20} = 17\ \text{m} \quad\text{to}\quad \frac{340}{20\,000} = 1.7\ \text{cm}`, "Hearing runs from 20 Hz to 20 kHz. Ultrasound is above 20 kHz, with short wavelengths that give sharp images."]
  ], R`d = \frac{vt}{2}, \qquad v = f\lambda`, [
    "The speed depends on the medium and its temperature; in a scan, the speed in tissue (about 1500 m/s) must be used.",
    "The upper limit of hearing falls with age."
  ]);

  d('gcse-static', [
    ["Charge comes in whole numbers of electron charges.", R`Q = n e, \qquad e = 1.6\times10^{-19}\ \text{C}`, "Rubbing transfers electrons, one at a time, from one surface to the other. Millikan’s oil drops showed charge is always a multiple of e."],
    ["Electric field strength is the force on each coulomb of charge.", R`E = \frac{F}{Q}`, "A definition, just as g is the gravitational force on each kilogram."],
    ["Move a charge Q across the gap d between two parallel plates. The work done is force × distance.", R`W = F d = E Q d`, "Between parallel plates the field, and so the force, is the same everywhere."],
    ["Voltage is the work done per coulomb. Compare.", R`V = \frac{W}{Q} = E d \;\Longrightarrow\; E = \frac{V}{d}`, "So the field between plates is the voltage divided by their separation."]
  ], R`Q = ne, \qquad E = \frac{F}{Q} = \frac{V}{d}`, [
    "E = V/d is for the uniform field between parallel plates, away from the edges.",
    "Air breaks down and sparks at about 3 × 10⁶ V/m."
  ]);

  d('gcse-current-pd', [
    ["Current is the rate of flow of charge.", R`I = \frac{Q}{t}`, "1 A means 1 C passing a point each second."],
    ["That charge is carried by electrons.", R`Q = n e \;\Longrightarrow\; I = \frac{n e}{t}`, "One amp is about 6 × 10¹⁸ electrons per second."],
    ["E.m.f. is the energy the source gives to each coulomb.", R`\mathcal{E} = \frac{W}{Q}`, "A 1.5 V cell gives every coulomb 1.5 J."],
    ["Potential difference is the energy each coulomb hands over in a component.", R`V = \frac{W}{Q} \;\Longrightarrow\; W = QV = I t V`, "Substituting Q = It gives the electrical energy transferred, the basis of P = IV."]
  ], R`I = \frac{Q}{t}, \qquad V = \frac{W}{Q}, \qquad W = IVt`, [
    "Conventional current flows from + to −, opposite to the electrons.",
    "A real source has internal resistance, so its terminal p.d. is slightly below its e.m.f. when current flows."
  ]);

  d('gcse-power-cost', [
    ["Voltage is energy per coulomb, current is coulombs per second.", R`V = \frac{W}{Q}, \qquad I = \frac{Q}{t}`, "The two definitions."],
    ["Multiply them: the charge cancels, leaving energy per second.", R`IV = \frac{Q}{t}\cdot\frac{W}{Q} = \frac{W}{t} = P`, "Joules per coulomb × coulombs per second = joules per second = watts."],
    ["Energy is power × time.", R`E = Pt = IVt`, "A 2 kW heater for 3 hours uses 6 kWh."],
    ["Use V = IR to write the power in a resistor two other ways.", R`P = I(IR) = I^2R, \qquad P = \frac{V}{R}V = \frac{V^2}{R}`, "Replace V, or replace I. I²R explains why transmission cables are run at low current."],
    ["One kilowatt-hour in joules.", R`1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3.6\times10^{6}\ \text{J}`, "A kilowatt for an hour."]
  ], R`P = IV = I^2R = \frac{V^2}{R}, \qquad E = Pt`, [
    "I²R and V²/R need the V and I for that one component.",
    "For a.c. mains the quoted 230 V is an effective (r.m.s.) value, and the formulas work as written for heaters and lamps."
  ]);

  d('gcse-series-parallel', [
    ["Series: the same current flows through both, and the voltages add.", R`V = V_1 + V_2 = IR_1 + IR_2`, "Energy per coulomb from the supply is shared between the two components."],
    ["Divide by I to get the total resistance.", R`R = \frac{V}{I} = R_1 + R_2`, "Resistors in series simply add."],
    ["Parallel: the same voltage across both, and the currents add.", R`I = I_1 + I_2 = \frac{V}{R_1} + \frac{V}{R_2}`, "Charge is conserved at the junction."],
    ["Divide by V.", R`\frac{1}{R} = \frac{I}{V} = \frac{1}{R_1} + \frac{1}{R_2}`, "The total is always less than the smallest branch."],
    ["Two series resistors share the supply voltage in proportion to their resistances.", R`V_{\text{out}} = I R_2 = \frac{V_{\text{in}}}{R_1 + R_2}\,R_2`, "The current is V_{in}/(R₁ + R₂); the output is taken across R₂. This is the potential divider."]
  ], R`R_{\text{series}} = R_1 + R_2, \quad \frac{1}{R_{\text{par}}} = \frac{1}{R_1} + \frac{1}{R_2}, \quad V_{\text{out}} = V_{\text{in}}\frac{R_2}{R_1 + R_2}`, [
    "The divider formula assumes nothing draws significant current from the output.",
    "Ohmic components at constant temperature; an LDR or thermistor changes R with light or temperature, which is how sensors work."
  ]);

  d('gcse-safety', [
    ["An appliance of power P on the mains draws a current set by P = IV.", R`I = \frac{P}{V}`, "For a 2300 W kettle on 230 V: I = 10 A."],
    ["Choose the fuse just above the normal current.", R`I_{\text{fuse}} > I_{\text{normal}}: \quad 10\ \text{A} \rightarrow 13\ \text{A fuse}`, "It must carry the working current without melting, but melt quickly if a fault makes the current much larger."],
    ["A cable of resistance R is heated by the current through it.", R`P_{\text{heat}} = I^2 R`, "Doubling the current quadruples the heating, which is why overloaded sockets and thin cables are fire risks."],
    ["If the live wire touches an earthed metal case, a low-resistance path gives a huge current.", R`I_{\text{fault}} = \frac{230\ \text{V}}{R_{\text{earth path}}} \gg I_{\text{fuse}}`, "The earth wire has a very low resistance, so the fuse blows and disconnects the live side before anyone touches the case."]
  ], R`I = \frac{P}{V}; \quad \text{fuse rating just above } I; \quad P_{\text{heat}} = I^2R`, [
    "A fuse protects the cable and prevents fires; it is too slow to protect a person. Residual-current devices do that.",
    "The fuse must be in the live wire, or the appliance stays live after it blows."
  ]);

  d('gcse-electromagnets', [
    ["The field around a long straight wire forms circles; it is stronger for larger currents and weaker further away.", R`B \propto \frac{I}{r}`, "The same current’s effect is spread round a circle of circumference 2πr."],
    ["With the constant of proportionality:", R`B = \frac{\mu_0 I}{2\pi r}`, "μ₀ = 4π × 10⁻⁷ T m/A. Beyond GCSE, but it shows where the 1/r comes from."],
    ["Wind the wire into a solenoid. Inside, the fields from all turns point the same way and add.", R`B \propto (\text{turns per metre}) \times I`, "Outside they largely cancel, so the field is strong and uniform inside, weak outside."],
    ["So for n turns per metre:", R`B = \mu_0 n I`, "The field does not depend on the solenoid’s radius, only on how tightly it is wound and the current."]
  ], R`B_{\text{wire}} = \frac{\mu_0 I}{2\pi r}, \qquad B_{\text{solenoid}} = \mu_0 n I`, [
    "Long wire and long solenoid; near the ends the solenoid field falls to about half.",
    "An iron core multiplies the field by hundreds or thousands until it saturates."
  ]);

  d('gcse-motor', [
    ["A wire of length L carrying current I at right angles to a field B feels a force.", R`F = BIL`, "The wire’s own field adds to the magnet’s on one side and cancels on the other, pushing the wire sideways. Direction: Fleming’s left-hand rule."],
    ["In a rectangular coil the two long sides carry current in opposite directions, so their forces are opposite.", R`F_{\text{left}} = -F_{\text{right}}`, "One side is pushed up and the other down: a pair of forces that turns the coil."],
    ["Each force acts at half the coil’s width w from the axle, giving a turning moment.", R`\tau = 2 \times BIL \times \frac{w}{2} = BI(Lw) = BIA`, "Moment = force × perpendicular distance, largest when the coil lies flat in the field. Lw is the coil’s area A."],
    ["With N turns the moments add.", R`\tau_{\max} = NBIA`, "Every turn feels the same forces. More turns, more current, stronger field or bigger coil all make it turn harder."]
  ], R`F = BIL, \qquad \tau_{\max} = NBIA`, [
    "The turning effect falls to zero when the coil is at right angles to the field; the split-ring commutator reverses the current there so rotation continues.",
    "A spinning motor generates a back-e.m.f. that reduces the current: I = (V − E_{back})/R."
  ]);

  d('gcse-induction', [
    ["A wire of length L moves at speed v across a field B. The charges inside move with it and feel a force along the wire.", R`F = B q v`, "A moving charge in a magnetic field is pushed at right angles to both its motion and the field."],
    ["Pushing a charge along the length of the wire does work.", R`W = F L = B q v L`, "Work = force × distance moved along the force."],
    ["E.m.f. is work per unit charge.", R`\mathcal{E} = \frac{W}{q} = BLv`, "The charge cancels. Faster motion, longer wire or stronger field all give a larger e.m.f."],
    ["BLv is the rate at which the wire sweeps out magnetic flux.", R`\mathcal{E} = \frac{B\,(L\,v\,\Delta t)}{\Delta t} = \frac{\Delta\Phi}{\Delta t}, \qquad N \text{ turns: } \mathcal{E} = N\frac{\Delta\Phi}{\Delta t}`, "In time Δt the wire sweeps area LvΔt, cutting flux B × area. This is Faraday’s law."]
  ], R`\mathcal{E} = BLv = N\frac{\Delta\Phi}{\Delta t}`, [
    "Wire, motion and field mutually at right angles; otherwise only the perpendicular parts count.",
    "Lenz’s law gives the direction: the induced current opposes the change causing it, as energy conservation requires."
  ]);

  d('gcse-transformer', [
    ["The alternating current in the primary makes a changing flux in the iron core, and the same flux passes through every turn of both coils.", R`V_p = N_p \frac{\Delta\Phi}{\Delta t}, \qquad V_s = N_s \frac{\Delta\Phi}{\Delta t}`, "Faraday’s law for each coil. The iron core guides almost all the flux through both."],
    ["Divide one by the other.", R`\frac{V_p}{V_s} = \frac{N_p}{N_s}`, "The rate of change of flux cancels: voltage per turn is the same in both coils."],
    ["If no energy is lost, power in equals power out.", R`V_p I_p = V_s I_s`, "Conservation of energy for an ideal (100% efficient) transformer. Raising the voltage lowers the current."],
    ["Cables of resistance R waste power as heat.", R`P_{\text{loss}} = I^2 R = \left(\frac{P}{V}\right)^2 R`, "For the same delivered power P, ten times the voltage means a tenth of the current and a hundredth of the loss."]
  ], R`\frac{V_p}{V_s} = \frac{N_p}{N_s}, \qquad V_pI_p = V_sI_s, \qquad P_{\text{loss}} = I^2R`, [
    "Works only with a.c.: a steady current gives no changing flux.",
    "Real transformers lose a few per cent to coil resistance, eddy currents and core magnetisation."
  ]);

  d('gcse-atom', [
    ["Most alpha particles pass straight through gold foil, so the atom is mostly empty space.", R`\text{most } \alpha: \text{undeflected}`, "Geiger and Marsden, 1909. A solid “plum pudding” atom would have slowed or stopped them."],
    ["A very few bounce back, so the positive charge and nearly all the mass sit in a tiny nucleus.", R`r_{\text{nucleus}} \sim 10^{-15}\ \text{m} \approx \frac{r_{\text{atom}}}{100\,000}`, "Only a small, dense, positive target could turn a fast alpha right round, and only rarely would one hit it."],
    ["A nucleus contains Z protons and N neutrons.", R`A = Z + N, \qquad {}^{A}_{Z}\mathrm{X}`, "A counts the nucleons. Isotopes have the same Z, so the same chemistry, but different N."],
    ["In any nuclear change, nucleon number and charge are conserved.", R`\sum A_{\text{before}} = \sum A_{\text{after}}, \qquad \sum Z_{\text{before}} = \sum Z_{\text{after}}`, "Nucleons are not created or destroyed, and nor is charge. This lets you find the missing product in a fission or fusion equation."]
  ], R`A = Z + N; \quad A \text{ and } Z \text{ both balance in nuclear equations}`, [
    "The Rutherford picture treats electrons as orbiting dots; the modern description uses electron clouds.",
    "Mass is not exactly conserved: a small amount becomes energy (E = mc²), the source of nuclear power."
  ]);

  d('gcse-radiation', [
    ["A detector counts background radiation as well as the source.", R`\text{corrected count} = \text{measured} - \text{background}`, "Rocks, cosmic rays and food are always there; measure them with the source removed and subtract."],
    ["Alpha emission removes 2 protons and 2 neutrons.", R`{}^{A}_{Z}\mathrm{X} \rightarrow {}^{A-4}_{Z-2}\mathrm{Y} + {}^{4}_{2}\mathrm{He}`, "Balance the top numbers (A) and the bottom numbers (Z) separately."],
    ["Beta emission turns a neutron into a proton and an electron.", R`{}^{A}_{Z}\mathrm{X} \rightarrow {}^{\ \ A}_{Z+1}\mathrm{Y} + {}^{\ \,0}_{-1}\mathrm{e}`, "A is unchanged; Z goes up by one because the electron carries charge −1."],
    ["Gamma rays spread out evenly over a sphere, so the intensity falls as the square of the distance.", R`I = \frac{P}{4\pi d^2} \propto \frac{1}{d^2}`, "The same energy crosses a sphere of area 4πd². Doubling the distance quarters the dose."]
  ], R`\text{corrected} = \text{measured} - \text{background}; \qquad I \propto \frac{1}{d^2}`, [
    "The inverse-square law needs a small source and no absorption on the way; alpha is stopped by a few centimetres of air long before it applies.",
    "Counts are random: repeat or count for longer to reduce the scatter."
  ]);

  d('gcse-earth-moon', [
    ["An object going round a circle covers the circumference once per period.", R`\text{distance} = 2\pi r \quad \text{in time } T`, "One full orbit, or one full rotation."],
    ["So its speed is:", R`v = \frac{2\pi r}{T}`, "Speed = distance ÷ time."],
    ["Earth’s orbital speed round the Sun.", R`v = \frac{2\pi \times 1.5\times10^{11}\ \text{m}}{3.16\times10^{7}\ \text{s}} \approx 30\ \text{km/s}`, "r is the Earth–Sun distance and T is one year in seconds."],
    ["The Moon’s orbit takes 27.3 days, but the phases repeat every 29.5 days.", R`\frac{1}{T_{\text{phases}}} = \frac{1}{27.3} - \frac{1}{365.25} \;\Longrightarrow\; T_{\text{phases}} \approx 29.5\ \text{days}`, "While the Moon goes round, Earth moves on round the Sun, so the Moon needs about two more days to line up with the Sun again."]
  ], R`v = \frac{2\pi r}{T}`, [
    "Orbits are treated as circles; they are slightly elliptical.",
    "Seasons are caused by the 23.4° tilt of Earth’s axis, not by distance from the Sun: Earth is closest in January."
  ]);

  d('gcse-solar-system', [
    ["Light takes time to cross the Solar System.", R`t = \frac{d}{c} = \frac{1.5\times10^{11}}{3.0\times10^{8}} = 500\ \text{s} \approx 8\ \text{min}`, "Sun to Earth. We see the Sun as it was 8 minutes ago."],
    ["A planet in a circular orbit has speed:", R`v = \frac{2\pi r}{T}`, "Circumference ÷ period."],
    ["The Sun’s gravity weakens with distance, so outer planets move more slowly.", R`v \propto \frac{1}{\sqrt{r}}`, "From the inverse-square law of gravity (derived at A-Level): four times as far out, half the speed."],
    ["Combine the two.", R`T = \frac{2\pi r}{v} \propto r^{3/2} \;\Longrightarrow\; T^2 \propto r^3`, "Further planets have further to go and go more slowly. This is Kepler’s third law."]
  ], R`t = \frac{d}{c}, \qquad v = \frac{2\pi r}{T}, \qquad T^2 \propto r^3`, [
    "Real orbits are ellipses with the Sun at one focus; a planet moves fastest when closest.",
    "T² ∝ r³ compares objects orbiting the same central body."
  ]);

  d('gcse-stars', [
    ["A star is stable when the outward pressure from fusion balances the inward pull of gravity.", R`\text{pressure outward} = \text{gravity inward}`, "If fusion slows, gravity squeezes and heats the core, speeding fusion up again: a self-correcting balance."],
    ["Fusing hydrogen to helium loses a little mass.", R`4\,{}^{1}\mathrm{H} \rightarrow {}^{4}\mathrm{He}: \quad \Delta m \approx 0.7\%`, "A helium nucleus has slightly less mass than the four protons that built it."],
    ["The missing mass appears as energy.", R`E = \Delta m\,c^2`, "Einstein’s relation. c² is huge, so a small mass gives an enormous energy."],
    ["The Sun radiates 3.8 × 10²⁶ W, so it loses mass at a calculable rate.", R`\frac{\Delta m}{t} = \frac{P}{c^2} = \frac{3.8\times10^{26}}{(3.0\times10^{8})^2} \approx 4\times10^{9}\ \text{kg/s}`, "Four million tonnes every second, yet over ten billion years that is less than 0.1% of its mass."]
  ], R`E = \Delta m\,c^2; \quad \text{stable star: pressure balances gravity}`, [
    "What a star becomes depends on its mass: Sun-like stars end as white dwarfs; much heavier ones explode as supernovae, leaving neutron stars or black holes.",
    "Elements heavier than iron are made in supernovae and neutron-star mergers, not by ordinary fusion."
  ]);
})();
/* ---- derive-2.js ---- */
/* Geodesic — derivations for notes-only topics: A-Level physics. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('al-units', [
    ["Multiply two measured quantities, each slightly uncertain.", R`z + \Delta z = (a + \Delta a)(b + \Delta b) = ab + a\,\Delta b + b\,\Delta a + \Delta a\,\Delta b`, "Take the worst case, with both errors pushing the same way, and expand the brackets."],
    ["Drop the product of two small quantities and divide by z = ab.", R`\frac{\Delta z}{z} \approx \frac{\Delta a}{a} + \frac{\Delta b}{b}`, "If each uncertainty is a few per cent, their product is a few hundredths of a per cent. Fractional uncertainties add for products, and the same result holds for quotients."],
    ["A power is a repeated product.", R`z = a^n \;\Longrightarrow\; \frac{\Delta z}{z} = n\,\frac{\Delta a}{a}`, "aⁿ is a multiplied by itself n times, so its fractional uncertainty is added n times. This is why a quantity that is squared or cubed should be measured most carefully."],
    ["For sums and differences the absolute uncertainties add.", R`z = a \pm b \;\Longrightarrow\; \Delta z = \Delta a + \Delta b`, "Worst case again: the errors may combine either way, even in a subtraction. A small difference of two large numbers can therefore be very uncertain."],
    ["A vector at angle θ to the x-axis splits into perpendicular components.", R`F_x = F\cos\theta, \qquad F_y = F\sin\theta, \qquad F = \sqrt{F_x^2 + F_y^2}`, "The components are the adjacent and opposite sides of a right-angled triangle with F as hypotenuse."]
  ], R`\frac{\Delta(ab)}{ab} = \frac{\Delta a}{a} + \frac{\Delta b}{b}, \qquad \frac{\Delta(a^n)}{a^n} = n\frac{\Delta a}{a}, \qquad \Delta(a \pm b) = \Delta a + \Delta b`, [
    "These are worst-case rules for small uncertainties. For independent random errors the proper rule adds in quadrature, which gives a smaller answer.",
    "Systematic errors do not shrink when you repeat readings; only a better method or a calibration removes them."
  ]);

  d('al-kinematics', [
    ["Acceleration is the rate of change of velocity. If it is constant:", R`a = \frac{v - u}{t} \;\Longrightarrow\; v = u + at`, "Constant acceleration means the v–t graph is a straight line of gradient a starting at u."],
    ["Displacement is the area under the v–t graph, here a trapezium.", R`s = \tfrac12 (u + v)\,t`, "Average of the parallel sides times the width; equivalently, average velocity × time."],
    ["Substitute v = u + at.", R`s = \tfrac12 (u + u + at)\,t = ut + \tfrac12 a t^2`, "The area is a rectangle ut plus a triangle of base t and height at."],
    ["Eliminate t instead, using t = (v − u)/a.", R`s = \tfrac12 (u + v)\,\frac{v - u}{a} = \frac{v^2 - u^2}{2a}`, "(v + u)(v − u) is a difference of two squares."],
    ["Rearrange.", R`v^2 = u^2 + 2as`, "The one equation without time; multiplied by ½m it is the work–energy theorem."]
  ], R`v = u + at, \quad s = \tfrac12(u + v)t, \quad s = ut + \tfrac12at^2, \quad v^2 = u^2 + 2as`, [
    "Only for constant acceleration. If a varies, use gradients and areas of graphs, or calculus.",
    "s, u, v and a are vectors along one line: choose a positive direction and keep to it."
  ]);

  d('al-dynamics', [
    ["Newton’s second law in its general form: force is the rate of change of momentum.", R`F = \frac{\Delta p}{\Delta t}, \qquad p = mv`, "This is the definition of resultant force. It also covers cases where the mass changes."],
    ["If the mass is constant it comes outside the change.", R`F = \frac{m\,\Delta v}{\Delta t} = ma`, "Δ(mv) = mΔv only when m is constant, and Δv/Δt is the acceleration."],
    ["A falling object feels its weight down and drag up. For fast motion through air the drag grows as the square of the speed.", R`ma = mg - kv^2`, "Resultant force = weight − drag, taking down as positive. k depends on the shape, the area and the air density."],
    ["At terminal velocity the acceleration is zero.", R`mg = k v_t^2 \;\Longrightarrow\; v_t = \sqrt{\frac{mg}{k}}`, "The speed stops changing when drag equals weight. A heavier object of the same shape must fall faster before its drag matches its weight."]
  ], R`F = \frac{\Delta p}{\Delta t} = ma \ (m \text{ constant}), \qquad v_t = \sqrt{\frac{mg}{k}}`, [
    "Drag ∝ v² holds for turbulent flow (most everyday falling objects); slow motion in a viscous liquid has drag ∝ v instead.",
    "F = ma fails for rockets (changing mass) unless you return to F = Δp/Δt, and at speeds close to c."
  ]);

  d('al-momentum', [
    ["Two bodies collide. By Newton’s third law the forces on them are equal and opposite at every instant.", R`F_{12} = -F_{21}`, "The force of 1 on 2 and of 2 on 1 are a third-law pair."],
    ["They act for the same time, so the changes of momentum are equal and opposite.", R`\Delta p_2 = F_{12}\,\Delta t = -F_{21}\,\Delta t = -\Delta p_1`, "Impulse = force × time = change of momentum, from the second law."],
    ["So the total momentum does not change.", R`m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2`, "Δp₁ + Δp₂ = 0. This holds whether or not kinetic energy is conserved."],
    ["In an elastic collision kinetic energy is conserved too. Write both laws with body 1 on the left.", R`m_1(u_1 - v_1) = m_2(v_2 - u_2), \qquad m_1(u_1^2 - v_1^2) = m_2(v_2^2 - u_2^2)`, "Rearranged momentum conservation, and kinetic energy conservation with the ½ cancelled."],
    ["Divide the second by the first.", R`u_1 + v_1 = v_2 + u_2 \;\Longrightarrow\; u_1 - u_2 = v_2 - v_1`, "Each side is a difference of two squares. The speed of approach equals the speed of separation."]
  ], R`\sum p_{\text{before}} = \sum p_{\text{after}}; \qquad \text{elastic: } u_1 - u_2 = v_2 - v_1`, [
    "Needs no resultant external force during the collision (or a collision so brief that external impulses are negligible).",
    "Momentum is a vector: in two dimensions it is conserved separately along each axis."
  ]);

  d('al-equilibrium', [
    ["A couple is two equal, opposite forces F a distance d apart. Take moments about any point O, a distance x from one of them.", R`\tau = Fx + F(d - x)`, "Both forces turn the object the same way about O."],
    ["Simplify.", R`\tau = Fd`, "x cancels: the torque of a couple is the same about every point, and its resultant force is zero, so it turns without pushing."],
    ["For equilibrium nothing accelerates and nothing starts to rotate.", R`\sum F_x = 0, \qquad \sum F_y = 0, \qquad \sum M = 0`, "No resultant force in either direction, and no resultant moment about any point."],
    ["Example: a weight W hangs from the middle of a string whose two halves make an angle θ with the horizontal.", R`2T\sin\theta = W \;\Longrightarrow\; T = \frac{W}{2\sin\theta}`, "Vertical components of the two tensions support the weight; the horizontal components cancel by symmetry."]
  ], R`\tau_{\text{couple}} = Fd; \qquad \sum \mathbf{F} = 0 \ \text{and}\ \sum M = 0`, [
    "As θ → 0 the tension grows without limit: a loaded string can never be perfectly straight.",
    "Three non-parallel forces in equilibrium must pass through one point and form a closed vector triangle."
  ]);

  d('al-fluids', [
    ["Pressure in a liquid increases with depth.", R`\Delta p = \rho g\,\Delta h`, "From the weight of a column of liquid divided by its base area."],
    ["Submerge an upright cylinder of cross-section A, with its top at depth h₁ and its bottom at depth h₂. The liquid pushes up on the bottom harder than it pushes down on the top.", R`F_{\text{up}} = (p_2 - p_1)A = \rho g\,(h_2 - h_1)\,A`, "The sideways forces cancel in pairs; only the top and bottom faces matter."],
    ["Recognise the volume of the cylinder.", R`F_{\text{up}} = \rho g V`, "(h₂ − h₁)A is its volume, so the upthrust equals the weight of liquid displaced: Archimedes’ principle."],
    ["A floating body is in equilibrium: upthrust on the submerged part equals its whole weight.", R`\rho_{\text{fluid}}\, g\, V_{\text{sub}} = \rho_{\text{body}}\, g\, V \;\Longrightarrow\; \frac{V_{\text{sub}}}{V} = \frac{\rho_{\text{body}}}{\rho_{\text{fluid}}}`, "g cancels. Ice of density 917 kg m⁻³ floats with 92% of its volume below fresh water."]
  ], R`F_{\text{up}} = \rho_{\text{fluid}}\, g\, V_{\text{displaced}}`, [
    "The result holds for any shape: slice the body into thin vertical columns and apply the argument to each.",
    "Assumes the fluid’s density is constant over the height of the object; not true for a tall balloon in the atmosphere."
  ]);

  d('al-energy', [
    ["Only the component of a force along the displacement does work.", R`W = F s \cos\theta`, "F cos θ is the component of F along the motion. A force at right angles to the motion does no work."],
    ["A constant resultant force accelerates a mass from u to v over a distance s.", R`W = Fs = mas`, "Newton’s second law, with the force along the motion."],
    ["Use v² = u² + 2as to replace as.", R`W = m\,\frac{v^2 - u^2}{2} = \tfrac12 mv^2 - \tfrac12 mu^2`, "So the work done by the resultant force equals the change in the quantity ½mv², which we call kinetic energy."],
    ["Lifting a mass at steady speed needs a force mg; the work done is stored as potential energy.", R`\Delta E_p = mg\,\Delta h`, "Force × distance moved in the direction of the force."],
    ["Power is the rate of doing work.", R`P = \frac{W}{t} = \frac{Fs}{t} = Fv`, "s/t is the speed, for a force along the motion."]
  ], R`W = Fs\cos\theta, \qquad E_k = \tfrac12 mv^2, \qquad \Delta E_p = mg\Delta h, \qquad P = Fv`, [
    "ΔE_p = mgΔh assumes g is constant: fine near the Earth’s surface, not for satellites.",
    "The derivation of ½mv² used constant acceleration; calculus shows the result holds for any force."
  ]);

  d('al-materials', [
    ["To compare materials rather than samples, divide the force by the area it acts on, and the extension by the original length.", R`\sigma = \frac{F}{A}, \qquad \varepsilon = \frac{x}{L}`, "A thick wire needs more force and a long wire stretches more; stress and strain remove both effects."],
    ["For a material obeying Hooke’s law, stress is proportional to strain. The constant is the Young modulus.", R`E = \frac{\sigma}{\varepsilon} = \frac{F L}{A x}`, "E is the gradient of the linear part of the stress–strain graph, in pascals."],
    ["Compare with F = kx to see what sets a sample’s stiffness.", R`k = \frac{F}{x} = \frac{EA}{L}`, "Thicker and shorter means stiffer; E is the part that belongs to the material."],
    ["The work done stretching the wire is the area under its force–extension graph.", R`E_p = \tfrac12 F x = \tfrac12 k x^2`, "The force rises steadily from 0 to F, so the area is a triangle."],
    ["Divide by the volume AL.", R`\frac{E_p}{AL} = \tfrac12 \frac{F}{A}\cdot\frac{x}{L} = \tfrac12 \sigma\varepsilon`, "The energy stored per unit volume is the area under the stress–strain graph."]
  ], R`E = \frac{\sigma}{\varepsilon} = \frac{FL}{Ax}, \qquad E_p = \tfrac12 Fx`, [
    "Only up to the limit of proportionality. Beyond the elastic limit some of the work is not recovered: the unloading curve returns below the loading curve.",
    "Uses the original area; a ductile metal narrows as it stretches, so the true stress is higher."
  ]);

  d('al-damping', [
    ["A mass on a spring has acceleration proportional to displacement and directed towards the centre.", R`a = -\frac{k}{m}\,x`, "From F = −kx and F = ma."],
    ["Compare with the defining equation of SHM, a = −ω²x.", R`\omega^2 = \frac{k}{m} \;\Longrightarrow\; f_0 = \frac{1}{2\pi}\sqrt{\frac{k}{m}}`, "This is the natural frequency: the one the system chooses when left alone."],
    ["Light damping removes a fixed fraction of the amplitude in each cycle.", R`A = A_0\,e^{-t/\tau}`, "Losing the same fraction in equal times is exponential decay. The frequency hardly changes."],
    ["The energy of an oscillator is proportional to the square of its amplitude.", R`E = \tfrac12 k A^2 = E_0\,e^{-2t/\tau}`, "At the extremes all the energy is elastic, ½kA². Squaring the amplitude doubles the decay rate."],
    ["Drive the system at frequency f. The steady amplitude is largest when the driver matches the natural frequency.", R`A_{\max} \ \text{at}\ f \approx f_0`, "At resonance the driving force stays in step with the velocity, so it feeds in energy throughout the cycle. Lighter damping gives a taller, sharper peak."]
  ], R`f_0 = \frac{1}{2\pi}\sqrt{\frac{k}{m}}, \qquad A = A_0 e^{-t/\tau}, \qquad \text{resonance at } f \approx f_0`, [
    "With heavier damping the amplitude peak moves slightly below f₀ and flattens; at critical damping there is no oscillation at all.",
    "Exponential decay assumes a drag force proportional to speed; dry friction makes the amplitude fall linearly."
  ]);

  d('al-waves', [
    ["Two points a distance Δx apart along a wave are out of step by the same fraction of a cycle as Δx is of a wavelength.", R`\frac{\Delta\phi}{2\pi} = \frac{\Delta x}{\lambda} \;\Longrightarrow\; \Delta\phi = 2\pi\frac{\Delta x}{\lambda}`, "One whole wavelength corresponds to one whole cycle, 2π radians."],
    ["Intensity is the power crossing unit area at right angles to the wave.", R`I = \frac{P}{A}`, "A definition, in W m⁻²."],
    ["A point source radiates equally in all directions, so at distance r its power is spread over a sphere.", R`I = \frac{P}{4\pi r^2}`, "The surface area of a sphere is 4πr²: the inverse-square law."],
    ["Each oscillating particle has energy proportional to the square of its amplitude.", R`I \propto A^2`, "An oscillator’s energy is ½mω²A². Double the amplitude and the wave carries four times the power."],
    ["Combine the last two.", R`A \propto \frac{1}{r}`, "Intensity falls as 1/r², so the amplitude falls only as 1/r."]
  ], R`\Delta\phi = 2\pi\frac{\Delta x}{\lambda}, \qquad I = \frac{P}{4\pi r^2} \propto A^2`, [
    "The inverse-square law needs a point source and no absorption or reflection.",
    "I ∝ A² compares waves of the same frequency in the same medium."
  ]);

  d('al-doppler', [
    ["A source of frequency f_s emits one wavefront every period.", R`T = \frac{1}{f_s}`, "The definition of period."],
    ["In that time the previous wavefront has travelled vT, while the source has moved v_s T towards the observer.", R`\lambda_o = vT - v_sT = \frac{v - v_s}{f_s}`, "The gap between successive wavefronts ahead of the source is shortened by the distance the source moved."],
    ["The waves still travel at speed v through the medium, so the observer receives:", R`f_o = \frac{v}{\lambda_o} = \frac{f_s\,v}{v - v_s}`, "v = fλ at the observer. The wave speed is set by the medium, not by the source’s motion."],
    ["For a source moving away, the wavefronts are stretched instead.", R`f_o = \frac{f_s\,v}{v + v_s}`, "Replace v_s by −v_s: lower pitch."],
    ["For light, with source speed much less than c:", R`\frac{\Delta\lambda}{\lambda} \approx \frac{\Delta f}{f} \approx \frac{v}{c}`, "Expanding the result for v_s ≪ v. Redshift means the source is receding."]
  ], R`f_o = \frac{f_s\,v}{v \mp v_s} \quad (-\ \text{approaching},\ +\ \text{receding})`, [
    "Stationary observer and source speed below the wave speed; at v_s = v the wavefronts pile up into a shock wave.",
    "For light there is no medium, and at high speeds the relativistic formula is needed."
  ]);

  d('al-polarisation', [
    ["Polarised light of amplitude A₀ meets a polariser whose axis is at angle θ to its plane of vibration. Resolve the vibration.", R`A_{\parallel} = A_0\cos\theta, \qquad A_{\perp} = A_0\sin\theta`, "An oscillation is a vector at right angles to the direction of travel, so it has components."],
    ["Only the component along the axis is transmitted.", R`A = A_0\cos\theta`, "The filter absorbs the perpendicular component."],
    ["Intensity is proportional to amplitude squared.", R`I = I_0\cos^2\theta`, "Malus’s law. Crossed polarisers (θ = 90°) transmit nothing."],
    ["Unpolarised light has every angle equally likely, so average over θ.", R`I = I_0\,\langle\cos^2\theta\rangle = \tfrac12 I_0`, "cos²θ and sin²θ have the same average and add to 1, so each averages ½. An ideal polariser halves the intensity of unpolarised light."]
  ], R`I = I_0\cos^2\theta; \qquad \text{unpolarised: } I = \tfrac12 I_0`, [
    "Only transverse waves can be polarised; sound in air cannot.",
    "Real polarisers absorb a little of the wanted component too."
  ]);

  d('al-stationary', [
    ["Two identical waves travel in opposite directions along a string and superpose.", R`y = A\sin(kx - \omega t) + A\sin(kx + \omega t)`, "For example a wave and its reflection. k = 2π/λ."],
    ["Add them using sin P + sin Q = 2 sin ½(P + Q) cos ½(P − Q).", R`y = 2A\sin(kx)\cos(\omega t)`, "The x and t dependence separate: every point oscillates in step, with an amplitude 2A sin kx that depends on where it is."],
    ["Nodes are where the amplitude is always zero.", R`\sin kx = 0 \;\Longrightarrow\; x = \frac{n\lambda}{2}`, "kx = nπ. Adjacent nodes are half a wavelength apart, with antinodes midway."],
    ["A string fixed at both ends must have a node at each end.", R`L = \frac{n\lambda}{2} \;\Longrightarrow\; f_n = \frac{v}{\lambda} = \frac{nv}{2L}`, "A whole number of half-wavelengths must fit. These are the harmonics."],
    ["For a string the wave speed depends on tension and mass per unit length.", R`v = \sqrt{\frac{T}{\mu}} \;\Longrightarrow\; f_1 = \frac{1}{2L}\sqrt{\frac{T}{\mu}}`, "Tighter or lighter strings carry waves faster, so they sound higher."]
  ], R`y = 2A\sin kx\cos\omega t; \qquad \text{node spacing } \tfrac12\lambda; \qquad f_n = \frac{nv}{2L}`, [
    "A pipe closed at one end has a node there and an antinode at the open end, giving only odd harmonics f = (2n − 1)v/4L.",
    "Real open ends have an end correction: the antinode sits slightly outside the tube."
  ]);

  d('al-current', [
    ["Consider a wire of cross-section A with n charge carriers per unit volume, each of charge q, drifting at speed v.", R`\text{length passing a point in } \Delta t = v\,\Delta t`, "All the carriers within this length of the point will pass it during Δt."],
    ["Count them.", R`N = n \times \text{volume} = n A v\,\Delta t`, "Number per unit volume × volume of that section of wire."],
    ["The charge that passes is:", R`\Delta Q = N q = n A v q\,\Delta t`, "Each carrier brings charge q."],
    ["Current is the rate of flow of charge.", R`I = \frac{\Delta Q}{\Delta t} = A n v q`, "Divide by Δt. For copper, n ≈ 8.5 × 10²⁸ m⁻³, so drift speeds are fractions of a millimetre per second."]
  ], R`I = Anvq`, [
    "v is the average drift velocity, superimposed on random thermal speeds of about 10⁶ m s⁻¹.",
    "Semiconductors have far smaller n, so their carriers drift much faster for the same current."
  ]);

  d('al-resistivity', [
    ["Two identical wires end to end carry the same current and share the voltage.", R`R_{2L} = 2R_L \;\Longrightarrow\; R \propto L`, "Series resistances add."],
    ["Two identical wires side by side carry twice the current at the same voltage.", R`R_{2A} = \tfrac12 R_A \;\Longrightarrow\; R \propto \frac{1}{A}`, "Parallel: doubling the area is like adding a second identical path."],
    ["Combine with a constant that depends only on the material.", R`R = \frac{\rho L}{A}`, "ρ is the resistivity, in Ω m."],
    ["Rearranged, this is how resistivity is measured.", R`\rho = \frac{RA}{L} = \frac{R\,\pi d^2}{4L}`, "Plot R against L; the gradient is ρ/A. The diameter is squared, so its uncertainty counts twice."]
  ], R`R = \frac{\rho L}{A}`, [
    "Uniform wire at constant temperature. For metals ρ rises with temperature; for semiconductors it falls.",
    "A filament lamp, a diode and a thermistor are non-ohmic: R = V/I still defines their resistance at each point, but it is not constant."
  ]);

  d('al-dc-circuits', [
    ["A cell of e.m.f. ℰ gives each coulomb ℰ joules. That energy is delivered partly in the external resistance R and partly in the cell’s own internal resistance r.", R`\mathcal{E} = IR + Ir`, "Kirchhoff’s second law: energy per unit charge is conserved round the loop."],
    ["The terminal p.d. is what is left for the external circuit.", R`V = IR = \mathcal{E} - Ir`, "The “lost volts” Ir grow with current. A graph of V against I has gradient −r and intercept ℰ."],
    ["Solve for the current.", R`I = \frac{\mathcal{E}}{R + r}`, "The two resistances are in series."],
    ["Power delivered to the load:", R`P = I^2R = \frac{\mathcal{E}^2 R}{(R + r)^2}`, "Zero when R = 0 (no voltage across the load) and tends to zero for very large R (no current)."],
    ["It is largest when the load matches the internal resistance.", R`\frac{dP}{dR} = \mathcal{E}^2\,\frac{(r - R)}{(R + r)^3} = 0 \;\Longrightarrow\; R = r`, "Differentiate using the quotient rule. At this point half the power is wasted inside the cell."]
  ], R`V = \mathcal{E} - Ir, \qquad P_{\max} \ \text{at}\ R = r`, [
    "Treats r as constant; in a real cell it rises as the cell runs down.",
    "Maximum power transfer is not maximum efficiency: efficiency R/(R + r) approaches 1 only for R ≫ r."
  ]);

  d('al-potential-divider', [
    ["Two resistors in series across a supply carry the same current.", R`I = \frac{V_{\text{in}}}{R_1 + R_2}`, "Series resistances add, and no current is taken from the junction."],
    ["The output is the p.d. across R₂.", R`V_{\text{out}} = I R_2 = V_{\text{in}}\,\frac{R_2}{R_1 + R_2}`, "V = IR for the lower resistor."],
    ["Equivalently, the voltages divide in the ratio of the resistances.", R`\frac{V_1}{V_2} = \frac{IR_1}{IR_2} = \frac{R_1}{R_2}`, "Same current in both."],
    ["Connect a load R_L across R₂: the lower arm becomes a parallel pair.", R`R_{\parallel} = \frac{R_2 R_L}{R_2 + R_L} < R_2 \;\Longrightarrow\; V_{\text{out}} \ \text{falls}`, "The load takes current, so the simple formula overestimates the output unless R_L ≫ R₂."],
    ["A potentiometer wire of uniform resistance per length compares e.m.f.s at balance, when no current flows through the cell being measured.", R`\frac{\mathcal{E}_1}{\mathcal{E}_2} = \frac{l_1}{l_2}`, "With no current there are no lost volts, so the balance length measures the true e.m.f."]
  ], R`V_{\text{out}} = V_{\text{in}}\,\frac{R_2}{R_1 + R_2}`, [
    "Unloaded divider, and a supply with negligible internal resistance.",
    "With a thermistor or LDR in one arm the output follows temperature or light level, but not linearly."
  ]);

  d('al-bfields', [
    ["A wire of length L carrying current I across a field B feels a force BIL. Share it among the carriers in the wire.", R`F = BIL, \qquad I = Anvq, \qquad N = nAL`, "N is the number of carriers in the length L."],
    ["Force on one carrier.", R`f = \frac{BIL}{N} = \frac{B\,(Anvq)\,L}{nAL} = Bqv`, "Everything about the wire cancels, leaving the force on a single moving charge."],
    ["This force is always perpendicular to the velocity, so it acts as a centripetal force.", R`Bqv = \frac{mv^2}{r} \;\Longrightarrow\; r = \frac{mv}{Bq}`, "It does no work, so the speed stays constant and the path is a circle."],
    ["The time for one orbit does not depend on the speed.", R`T = \frac{2\pi r}{v} = \frac{2\pi m}{Bq}`, "Faster particles move in proportionally larger circles. The cyclotron relies on this."],
    ["In a conducting slab of thickness t and width d, carriers pile up on one edge until the electric force balances the magnetic force.", R`q\frac{V_H}{d} = Bqv, \quad v = \frac{I}{n\,(td)\,q} \;\Longrightarrow\; V_H = \frac{BI}{ntq}`, "The Hall voltage. Using I = Anvq with A = td, the width cancels."]
  ], R`F = Bqv, \qquad r = \frac{mv}{Bq}, \qquad V_H = \frac{BI}{ntq}`, [
    "Velocity perpendicular to B; otherwise use Bqv sin θ and the path is a helix.",
    "T = 2πm/Bq fails once the particle is relativistic: its effective inertia grows and it falls out of step."
  ]);

  d('al-ac', [
    ["A sinusoidal current flows through a resistor.", R`I = I_0\sin\omega t`, "Mains supply and generator output have this form."],
    ["The power at each instant:", R`P = I^2R = I_0^2 R\,\sin^2\omega t`, "Never negative: the resistor heats whichever way the current flows."],
    ["Average over a whole cycle.", R`\langle\sin^2\omega t\rangle = \tfrac12 \;\Longrightarrow\; \langle P\rangle = \tfrac12 I_0^2 R`, "sin² = ½(1 − cos 2ωt), and the cosine averages to zero. The mean power is half the peak power."],
    ["Define the steady current that would give the same heating.", R`I_{\text{rms}}^2 R = \tfrac12 I_0^2 R \;\Longrightarrow\; I_{\text{rms}} = \frac{I_0}{\sqrt2}`, "Root of the mean of the square. The same argument gives V_{rms} = V₀/√2."],
    ["So mains quoted as 230 V has a peak of:", R`V_0 = \sqrt2 \times 230\ \text{V} \approx 325\ \text{V}`, "Quoted a.c. values are r.m.s. unless stated otherwise."]
  ], R`I_{\text{rms}} = \frac{I_0}{\sqrt2}, \qquad \langle P\rangle = I_{\text{rms}}V_{\text{rms}} = \tfrac12 I_0V_0`, [
    "The factor √2 is for sine waves only; a square wave has I_{rms} = I₀.",
    "⟨P⟩ = I_{rms} V_{rms} assumes a pure resistance, with current and voltage in phase."
  ]);

  d('al-temperature', [
    ["The energy needed to warm a substance is proportional to its mass and to the temperature rise.", R`E = mc\,\Delta\theta`, "c is the specific heat capacity: the joules needed to raise 1 kg by 1 K."],
    ["Supply the energy electrically and measure it.", R`P t = I V t = mc\,\Delta\theta \;\Longrightarrow\; c = \frac{IVt}{m\,\Delta\theta}`, "Electrical energy in equals thermal energy gained, if nothing escapes."],
    ["During a change of state the temperature stays constant while energy is still absorbed.", R`E = mL`, "The energy goes into separating the particles (potential energy), not into speeding them up. L is the specific latent heat."],
    ["Heat losses can be eliminated by repeating at a different power for the same time and temperatures.", R`(P_2 - P_1)\,t = (m_2 - m_1)\,L`, "The energy lost to the surroundings is the same in both runs, so it cancels in the difference."],
    ["Thermodynamic temperature starts at absolute zero.", R`T / \text{K} = \theta / ^\circ\text{C} + 273.15`, "A change of 1 K equals a change of 1 °C; only the zero differs."]
  ], R`E = mc\Delta\theta, \qquad E = mL, \qquad T = \theta + 273.15`, [
    "c is taken as constant over the temperature range.",
    "Unless losses are corrected for, a measured c comes out too high and a measured L too high as well."
  ]);

  d('al-thermodynamics', [
    ["A gas at pressure p pushes a piston of area A outwards by a small distance Δx.", R`W = F\,\Delta x = pA\,\Delta x`, "Force = pressure × area, and work = force × distance."],
    ["AΔx is the change in volume.", R`W = p\,\Delta V`, "Work done by the gas when it expands at constant pressure. For changing pressure it is the area under the p–V graph."],
    ["The internal energy can change by heating or by work.", R`\Delta U = q + W`, "The first law: q is energy supplied by heating and W is work done on the gas (negative when the gas expands)."],
    ["For an ideal gas the internal energy is entirely the random kinetic energy of the molecules.", R`U = N \times \tfrac32 kT = \tfrac32 nRT`, "Ideal-gas molecules exert no forces on one another except in collisions, so there is no potential energy. Nk = nR."],
    ["So for an ideal gas U depends only on temperature, and an isothermal change has q = −W.", R`\Delta T = 0 \;\Longrightarrow\; \Delta U = 0 \;\Longrightarrow\; q = -W`, "All the heat supplied in an isothermal expansion leaves as work."]
  ], R`\Delta U = q + W, \qquad W_{\text{by gas}} = p\Delta V, \qquad U = \tfrac32 nRT`, [
    "Sign conventions differ: some syllabuses write ΔU = Q − W with W the work done by the gas. Always state yours.",
    "U = (3/2)nRT is for a monatomic ideal gas; molecules that rotate or vibrate store more."
  ]);

  d('al-particles', [
    ["An alpha particle aimed straight at a nucleus stops when all its kinetic energy has become electric potential energy.", R`E_k = \frac{k Q_1 Q_2}{d} \;\Longrightarrow\; d_{\min} = \frac{k Q_1 Q_2}{E_k}`, "Energy conservation, with k = 1/4πε₀. This gives an upper limit for the size of the nucleus, about 10⁻¹⁴ m for gold."],
    ["Protons and neutrons are made of up and down quarks. Check the charges.", R`p = uud:\ \tfrac23 + \tfrac23 - \tfrac13 = +1, \qquad n = udd:\ \tfrac23 - \tfrac13 - \tfrac13 = 0`, "Quark charges are +⅔e for up and −⅓e for down."],
    ["In β⁻ decay a neutron becomes a proton, so one down quark has become an up quark.", R`d \rightarrow u + e^- + \bar\nu_e`, "udd → uud changes one quark only. This is the weak interaction."],
    ["Check the conservation laws.", R`\text{charge: } -\tfrac13 = \tfrac23 - 1 + 0, \qquad \text{lepton number: } 0 = 0 + 1 - 1`, "The antineutrino is needed to balance lepton number, and to explain why the electrons emerge with a range of energies."],
    ["β⁺ decay is the mirror process.", R`u \rightarrow d + e^+ + \nu_e`, "A proton in a nucleus becomes a neutron, emitting a positron and a neutrino."]
  ], R`d_{\min} = \frac{kQ_1Q_2}{E_k}; \qquad d \rightarrow u + e^- + \bar\nu_e`, [
    "d_{min} assumes a head-on approach and only the electric force; once the alpha is energetic enough to feel the strong force, the Rutherford formula fails, which is how nuclear radii were first measured.",
    "A free proton cannot β⁺ decay (it is lighter than the neutron); the energy must come from the nucleus."
  ]);

  d('al-photons', [
    ["Light of frequency f arrives in quanta.", R`E = hf = \frac{hc}{\lambda}`, "Planck’s constant h = 6.63 × 10⁻³⁴ J s. Using c = fλ."],
    ["A convenient energy unit is the work done moving one electron through one volt.", R`1\ \text{eV} = 1.60\times10^{-19}\ \text{C} \times 1\ \text{V} = 1.60\times10^{-19}\ \text{J}`, "W = QV. Visible photons carry 1.6 to 3.3 eV."],
    ["De Broglie proposed that every particle has a wavelength set by its momentum.", R`\lambda = \frac{h}{p}`, "Confirmed when electrons were diffracted by crystals, giving rings like X-rays."],
    ["An electron accelerated from rest through a p.d. V gains kinetic energy eV.", R`eV = \frac{p^2}{2m} \;\Longrightarrow\; p = \sqrt{2meV}`, "½mv² written in terms of p = mv."],
    ["So its wavelength is:", R`\lambda = \frac{h}{\sqrt{2meV}}`, "About 0.1 nm for a few hundred volts: comparable with atomic spacings, which is why crystals diffract electrons."]
  ], R`E = hf, \qquad \lambda = \frac{h}{p} = \frac{h}{\sqrt{2meV}}`, [
    "The last formula is non-relativistic: fine below a few kilovolts, increasingly wrong above about 50 kV.",
    "Wave and particle descriptions are not alternatives to choose between: diffraction patterns build up from individual, localised arrivals."
  ]);

  d('al-spectra', [
    ["An atom can only have certain energies. When an electron drops from a higher level to a lower one, a photon carries away the difference.", R`hf = E_1 - E_2`, "Energy conservation for one transition."],
    ["So each transition gives one wavelength.", R`\lambda = \frac{hc}{E_1 - E_2}`, "Using c = fλ. A line spectrum is the fingerprint of the set of levels."],
    ["A shortcut in convenient units.", R`\lambda\,(\text{nm}) \approx \frac{1240}{\Delta E\,(\text{eV})}`, "hc = 1.99 × 10⁻²⁵ J m = 1240 eV nm."],
    ["For hydrogen the levels follow a simple pattern.", R`E_n = -\frac{13.6\ \text{eV}}{n^2}`, "Negative because the electron is bound: zero is defined as the electron just free."],
    ["An atom excited to level n can produce a line for every pair of levels at or below n.", R`N_{\text{lines}} = \binom{n}{2} = \frac{n(n-1)}{2}`, "Each pair of levels gives one possible downward transition."]
  ], R`hf = E_1 - E_2, \qquad E_n = -\frac{13.6\ \text{eV}}{n^2}\ (\text{hydrogen})`, [
    "−13.6/n² is for hydrogen only; other atoms have more complicated levels because their electrons repel one another.",
    "Absorption lines appear at the same wavelengths, because the same pairs of levels are involved."
  ]);

  d('al-decay', [
    ["Each nucleus has the same fixed probability λ of decaying in each second, regardless of its age.", R`\Delta N = -\lambda N\,\Delta t`, "With N nuclei, on average λNΔt of them decay in a short time Δt. The minus sign shows N falls."],
    ["The activity is the number of decays per second.", R`A = -\frac{\Delta N}{\Delta t} = \lambda N`, "Activity is proportional to the number of undecayed nuclei."],
    ["In the limit this is a differential equation whose solution is an exponential.", R`\frac{dN}{dt} = -\lambda N \;\Longrightarrow\; N = N_0 e^{-\lambda t}`, "The exponential is the function whose rate of change is proportional to itself. A and the count rate follow the same law."],
    ["The half-life is the time for N to halve.", R`\tfrac12 = e^{-\lambda t_{1/2}} \;\Longrightarrow\; t_{1/2} = \frac{\ln 2}{\lambda}`, "Take natural logs of both sides."],
    ["A straight-line test.", R`\ln A = \ln A_0 - \lambda t`, "Plot ln A against t: the gradient is −λ."]
  ], R`A = \lambda N, \qquad N = N_0e^{-\lambda t}, \qquad t_{1/2} = \frac{\ln 2}{\lambda}`, [
    "Statistical law: it describes averages over many nuclei. A small sample fluctuates noticeably about the curve.",
    "λ is unaffected by temperature, pressure or chemical state (to very high accuracy)."
  ]);

  d('al-medical', [
    ["How strongly ultrasound reflects at a boundary depends on the acoustic impedance of the two tissues.", R`Z = \rho c`, "Density × speed of sound: a measure of how hard the medium is to set vibrating."],
    ["At a boundary the pressure and the particle velocity must match on both sides. That fixes the reflected fraction of the intensity.", R`\frac{I_R}{I_0} = \left(\frac{Z_2 - Z_1}{Z_2 + Z_1}\right)^2`, "The reflected amplitude is proportional to the mismatch in Z, and intensity goes as amplitude squared. Air to skin reflects more than 99%, hence the coupling gel."],
    ["In an X-ray tube an electron accelerated through V can give all its energy to one photon.", R`eV = hf_{\max} = \frac{hc}{\lambda_{\min}} \;\Longrightarrow\; \lambda_{\min} = \frac{hc}{eV}`, "The spectrum has a sharp short-wavelength cut-off set by the tube voltage."],
    ["Each thin layer of tissue removes the same fraction of the beam.", R`\frac{dI}{dx} = -\mu I \;\Longrightarrow\; I = I_0 e^{-\mu x}`, "The same mathematics as radioactive decay. The half-value thickness is ln 2/μ."],
    ["In PET a positron annihilates with an electron, and their rest energy appears as two photons.", R`2 m_e c^2 = 2 E_\gamma \;\Longrightarrow\; E_\gamma = 0.511\ \text{MeV}`, "Momentum conservation sends the two photons in opposite directions, so the line joining the two detections passes through the source."]
  ], R`\frac{I_R}{I_0} = \left(\frac{Z_2 - Z_1}{Z_2 + Z_1}\right)^2, \qquad I = I_0e^{-\mu x}, \qquad \lambda_{\min} = \frac{hc}{eV}`, [
    "The reflection formula is for normal incidence on a flat boundary.",
    "μ depends on photon energy and on the material, so a real X-ray beam hardens as it passes through tissue."
  ]);

  d('al-astro', [
    ["A star of luminosity L radiates equally in all directions, so at distance d its power crosses a sphere.", R`F = \frac{L}{4\pi d^2}`, "F is the radiant flux measured on Earth, in W m⁻²."],
    ["If the luminosity is known independently (a standard candle), the flux gives the distance.", R`d = \sqrt{\frac{L}{4\pi F}}`, "Rearranged inverse-square law. Type Ia supernovae and Cepheid variables are used this way."],
    ["The peak wavelength of a hot body’s spectrum gives its surface temperature.", R`\lambda_{\max} T = 2.9\times10^{-3}\ \text{m K}`, "Wien’s displacement law: hotter stars are bluer."],
    ["Each square metre of a black body radiates σT⁴, and a star is a sphere of radius r.", R`L = 4\pi r^2 \sigma T^4`, "Stefan–Boltzmann law × surface area."],
    ["So flux, colour and distance together give the star’s radius.", R`r = \sqrt{\frac{L}{4\pi\sigma T^4}} = \frac{d}{T^2}\sqrt{\frac{F}{\sigma}}`, "Substitute L = 4πd²F. No telescope resolves most stars; their sizes are found this way."]
  ], R`F = \frac{L}{4\pi d^2}, \qquad \lambda_{\max}T = 2.9\times10^{-3}\ \text{m K}, \qquad L = 4\pi r^2\sigma T^4`, [
    "Assumes no dust absorbing light on the way and that the star radiates as a black body.",
    "Standard candles are only as good as their calibration, which is one source of the present disagreement over the Hubble constant."
  ]);

  d('al-cosmology', [
    ["Light from a receding galaxy is stretched. For speeds much less than c the fractional shift equals v/c.", R`z = \frac{\Delta\lambda}{\lambda} \approx \frac{v}{c}`, "The Doppler result for light at low speed."],
    ["Hubble found that recession speed is proportional to distance.", R`v = H_0 d`, "H₀ ≈ 70 km s⁻¹ Mpc⁻¹: every megaparsec of distance adds about 70 km/s."],
    ["If every galaxy has always moved at its present speed, the time since they were all together is the same for all of them.", R`t_0 = \frac{d}{v} = \frac{1}{H_0}`, "d cancels: a galaxy twice as far is moving twice as fast, so it set out at the same time."],
    ["Convert H₀ to SI units.", R`H_0 = \frac{70\times10^{3}\ \text{m s}^{-1}}{3.09\times10^{22}\ \text{m}} = 2.3\times10^{-18}\ \text{s}^{-1}`, "1 Mpc = 3.09 × 10²² m."],
    ["So the age of the universe is roughly:", R`t_0 \approx \frac{1}{2.3\times10^{-18}\ \text{s}^{-1}} = 4.4\times10^{17}\ \text{s} \approx 14\ \text{billion years}`, "Divide by 3.16 × 10⁷ s per year."]
  ], R`z \approx \frac{v}{c}, \qquad v = H_0 d, \qquad t_0 \approx \frac{1}{H_0}`, [
    "The expansion rate has not been constant: it slowed under gravity, then began to speed up. By coincidence the corrections nearly cancel, and the accepted age is 13.8 billion years.",
    "Cosmological redshift is really the stretching of space itself: 1 + z = a_{now}/a_{then}. The Doppler picture works only for nearby galaxies."
  ]);
})();
/* ---- derive-3.js ---- */
/* Geodesic — derivations for notes-only topics: university physics, Years 1 and 2. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  /* ------------------------------ Year 1 ------------------------------ */
  d('y1-work-energy', [
    ["Work is the line integral of force along the path. Insert Newton’s second law for the net force.", R`W_{\text{net}} = \int \mathbf F\cdot d\mathbf r = \int m\frac{d\mathbf v}{dt}\cdot\mathbf v\,dt`, "dr = v dt turns the path integral into an integral over time."],
    ["The integrand is a total derivative.", R`m\frac{d\mathbf v}{dt}\cdot\mathbf v = \frac{d}{dt}\left(\tfrac12 m v^2\right) \;\Longrightarrow\; W_{\text{net}} = \Delta K`, "d(v·v)/dt = 2v·dv/dt. This is the work–energy theorem, true for any force."],
    ["A force is conservative if its work round every closed path is zero. Then the work between two points defines a function of position.", R`\oint \mathbf F\cdot d\mathbf r = 0 \;\Longleftrightarrow\; \mathbf F = -\nabla U \;\Longrightarrow\; \nabla\times\mathbf F = 0`, "Path independence lets us define U(r) = −∫F·dr from a reference point. The curl of a gradient vanishes identically."],
    ["Combine with the theorem.", R`\Delta K = -\Delta U \;\Longrightarrow\; K + U = \text{constant}`, "The work done by a conservative force is minus the change in its potential energy."],
    ["Near a minimum of U at x₀, expand to second order.", R`U \approx U(x_0) + \tfrac12 U''(x_0)(x - x_0)^2 \;\Longrightarrow\; \omega^2 = \frac{U''(x_0)}{m}`, "The first derivative vanishes at equilibrium, leaving a spring-like force −U''(x₀)(x − x₀): every stable equilibrium oscillates harmonically for small displacements."]
  ], R`W_{\text{net}} = \Delta K, \qquad \mathbf F = -\nabla U, \qquad \omega^2 = \frac{U''(x_0)}{m}`, [
    "∇ × F = 0 guarantees a potential only in a simply connected region.",
    "Friction and drag are not conservative: their work depends on the path, and mechanical energy is not conserved."
  ]);

  d('y1-systems', [
    ["Define the centre of mass of N particles and differentiate twice.", R`M\mathbf R = \sum_i m_i\mathbf r_i \;\Longrightarrow\; M\ddot{\mathbf R} = \sum_i \mathbf F_i^{\text{ext}} + \sum_i\sum_{j\ne i}\mathbf F_{ij}`, "Each particle obeys Newton’s second law, with external forces and forces from the other particles."],
    ["The internal forces cancel in pairs.", R`\mathbf F_{ij} = -\mathbf F_{ji} \;\Longrightarrow\; M\ddot{\mathbf R} = \mathbf F_{\text{ext}}`, "Newton’s third law. The centre of mass moves as a single particle of mass M acted on by the total external force."],
    ["A rocket of mass m and speed v ejects exhaust at speed u relative to itself. Compare the momentum before and after it sheds mass −dm (dm < 0).", R`mv = (m + dm)(v + dv) + (-dm)(v - u)`, "With no external force the total momentum of rocket plus exhaust is conserved. The exhaust moves at v − u in the ground frame."],
    ["Expand and keep first-order terms.", R`m\,dv = -u\,dm`, "The terms v dm cancel and the product dm dv is second order."],
    ["Integrate from initial mass m₀ to final mass m₁.", R`\Delta v = -u\int_{m_0}^{m_1}\frac{dm}{m} = u\ln\frac{m_0}{m_1}`, "The Tsiolkovsky rocket equation: the gain in speed depends on the mass ratio only logarithmically."]
  ], R`M\ddot{\mathbf R} = \mathbf F_{\text{ext}}, \qquad \Delta v = u\ln\frac{m_0}{m_1}`, [
    "Constant exhaust speed and no gravity or drag; with gravity, subtract g × burn time.",
    "Reaching orbit needs Δv ≈ 9.4 km/s with exhaust speeds of 3 to 4.5 km/s, so the mass ratio m₀/m₁ must be somewhere between 8 and 20: hence staging."
  ]);

  d('y1-angular-momentum', [
    ["Differentiate L = r × p.", R`\frac{d\mathbf L}{dt} = \dot{\mathbf r}\times\mathbf p + \mathbf r\times\dot{\mathbf p} = \mathbf r\times\mathbf F = \boldsymbol\tau`, "The first term vanishes because ṙ = v is parallel to p = mv. Torque is the rate of change of angular momentum."],
    ["For a rigid body rotating about a fixed axis, each element moves in a circle.", R`L = \sum_i m_i r_i\,(\omega r_i) = I\omega, \qquad I = \sum_i m_i r_i^2 \;\Longrightarrow\; \tau = I\alpha`, "v = ωr for each element, with r its distance from the axis."],
    ["Shift the axis a distance d from the centre of mass.", R`I = \sum_i m_i(\mathbf r_i' + \mathbf d)^2 = I_{\text{cm}} + Md^2`, "The cross term 2d·Σm r′ vanishes because r′ is measured from the centre of mass."],
    ["A body rolls without slipping down a slope. Friction f supplies the torque.", R`Mg\sin\theta - f = Ma, \quad fR = I\frac{a}{R} \;\Longrightarrow\; a = \frac{g\sin\theta}{1 + I/MR^2}`, "Rolling without slipping means α = a/R. Eliminate f."],
    ["A spinning top’s weight exerts a torque perpendicular to L, so L swings round without changing length.", R`\Omega = \frac{\tau}{L} = \frac{Mgr}{I\omega}`, "dL = τ dt is perpendicular to L; in time dt the tip of L turns through dφ = τ dt/L."]
  ], R`\boldsymbol\tau = \frac{d\mathbf L}{dt}, \qquad I = I_{\text{cm}} + Md^2, \qquad \Omega = \frac{Mgr}{I\omega}`, [
    "L = Iω with a scalar I holds only for rotation about a symmetry (principal) axis; in general L and ω are not parallel.",
    "The precession formula needs fast spin, ω ≫ Ω; otherwise nutation appears."
  ]);

  d('y1-oscillators', [
    ["Add a drag force −bẋ to the spring force and divide by m.", R`\ddot x + \gamma\dot x + \omega_0^2 x = 0, \qquad \gamma = \frac bm,\ \omega_0^2 = \frac km`, "Linear drag keeps the equation linear, so exponentials solve it."],
    ["Try x = e^{λt}.", R`\lambda^2 + \gamma\lambda + \omega_0^2 = 0 \;\Longrightarrow\; \lambda = -\frac\gamma2 \pm i\sqrt{\omega_0^2 - \frac{\gamma^2}{4}}`, "For light damping the roots are complex."],
    ["Take the real part.", R`x = A e^{-\gamma t/2}\cos(\omega_d t + \phi), \qquad \omega_d = \sqrt{\omega_0^2 - \gamma^2/4}`, "The amplitude decays with time constant 2/γ and the frequency is slightly lowered."],
    ["Drive it with a force F₀e^{iωt} and look for a steady response x = Ae^{iωt}.", R`A = \frac{F_0/m}{\omega_0^2 - \omega^2 + i\gamma\omega}, \qquad |A| = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + \gamma^2\omega^2}}`, "Substituting turns each time derivative into a factor iω."],
    ["Evaluate at resonance and compare with the static displacement F₀/k.", R`|A(\omega_0)| = \frac{F_0}{m\gamma\omega_0} = Q\,\frac{F_0}{k}, \qquad Q = \frac{\omega_0}{\gamma}`, "Using k = mω₀². The quality factor is the amplification at resonance; it is also ω₀ divided by the width of the power resonance."]
  ], R`\omega_d = \sqrt{\omega_0^2 - \gamma^2/4}, \qquad Q = \frac{\omega_0}{\gamma}, \qquad |A(\omega_0)| = Q\frac{F_0}{k}`, [
    "The steady state is reached only after transients, which die away as e^{−γt/2}: a high-Q system takes about Q cycles to respond.",
    "Linear response fails at large amplitude, where real springs and pendulums become anharmonic."
  ]);

  d('y1-coupled', [
    ["Two equal masses, each held by a spring k and joined by a coupling spring k_c.", R`m\ddot x_1 = -kx_1 - k_c(x_1 - x_2), \qquad m\ddot x_2 = -kx_2 - k_c(x_2 - x_1)`, "The coupling spring is stretched by x₁ − x₂."],
    ["Add the equations.", R`q_1 = x_1 + x_2: \quad \ddot q_1 = -\frac km q_1 \;\Longrightarrow\; \omega_1^2 = \frac km`, "In the symmetric mode the masses move together and the coupling spring is never stretched."],
    ["Subtract them.", R`q_2 = x_1 - x_2: \quad \ddot q_2 = -\frac{k + 2k_c}{m} q_2 \;\Longrightarrow\; \omega_2^2 = \frac{k + 2k_c}{m}`, "In the antisymmetric mode the coupling spring is stretched twice as far as each mass moves."],
    ["In general, try x = a e^{iωt} in Mẍ = −Kx.", R`(K - \omega^2 M)\,\mathbf a = 0 \;\Longrightarrow\; \det(K - \omega^2 M) = 0`, "A non-zero solution exists only if the determinant vanishes: an eigenvalue problem for ω²."],
    ["Start with only mass 1 displaced: an equal mixture of the two modes.", R`x_1 = A\cos\!\left(\tfrac{\Delta\omega}{2}t\right)\cos\bar\omega t, \qquad x_2 = A\sin\!\left(\tfrac{\Delta\omega}{2}t\right)\sin\bar\omega t`, "Adding and subtracting the two modes gives beats. The energy passes completely to mass 2 after a time π/Δω."]
  ], R`\omega_1^2 = \frac km, \qquad \omega_2^2 = \frac{k + 2k_c}{m}, \qquad T_{\text{exchange}} = \frac{\pi}{\Delta\omega}`, [
    "Complete exchange of energy needs identical oscillators; unequal ones exchange only part.",
    "With N masses there are N modes; as N → ∞ they become the standing waves of a continuous string."
  ]);

  d('y1-fluids', [
    ["A thin horizontal slab of fluid at rest is in equilibrium under pressure forces and its weight.", R`\frac{dp}{dz} = -\rho g \;\Longrightarrow\; p = p_0 + \rho g h`, "The pressure below must exceed the pressure above by the slab’s weight per unit area. h is depth below the surface."],
    ["In steady flow, the mass entering a stream tube per second equals the mass leaving.", R`\rho A_1 v_1 = \rho A_2 v_2 \;\Longrightarrow\; A_1v_1 = A_2v_2`, "No fluid is created or stored. For constant density the volume flow rate is conserved."],
    ["Follow a parcel of volume ΔV from section 1 to section 2. The net work done by pressure equals its gain in mechanical energy.", R`(p_1 - p_2)\,\Delta V = \tfrac12\rho\,\Delta V\,(v_2^2 - v_1^2) + \rho\,\Delta V\,g\,(z_2 - z_1)`, "Work–energy theorem with no viscous losses. The fluid behind pushes with p₁ΔV; the fluid ahead takes p₂ΔV."],
    ["Divide by ΔV and collect each section’s terms.", R`p + \tfrac12\rho v^2 + \rho g z = \text{constant along a streamline}`, "Bernoulli’s equation: pressure is energy per unit volume."],
    ["Apply it between the surface of a tank and a small hole a depth h below.", R`\rho g h = \tfrac12\rho v^2 \;\Longrightarrow\; v = \sqrt{2gh}`, "Both points are at atmospheric pressure and the surface barely moves: Torricelli’s result, the same speed as free fall through h."]
  ], R`p + \tfrac12\rho v^2 + \rho g z = \text{constant}`, [
    "Steady, incompressible, inviscid flow along a single streamline.",
    "In a real pipe viscosity gives a pressure drop along the flow (Poiseuille: Q = πR⁴Δp/8ηL), and above a critical Reynolds number the flow turns turbulent."
  ]);

  d('y1-potential', [
    ["Potential difference is minus the line integral of the field. For a point charge:", R`V(r) = -\int_\infty^r \frac{q}{4\pi\varepsilon_0 r'^2}\,dr' = \frac{q}{4\pi\varepsilon_0 r}`, "The electrostatic field is conservative, so the integral depends only on the end points. V = 0 at infinity."],
    ["Conversely the field is the downhill gradient of V.", R`\mathbf E = -\nabla V`, "dV = −E·dl for any small step, which is the definition of a gradient."],
    ["Inside a conductor in equilibrium the field is zero, so the conductor is an equipotential.", R`\mathbf E_{\text{inside}} = 0 \;\Longrightarrow\; V = \text{constant}`, "Any field would move the free charges until it was cancelled. Excess charge sits on the surface."],
    ["Parallel plates of area A, separation d, carrying ±Q. Gauss’s law gives the field, and hence the capacitance.", R`E = \frac{Q}{\varepsilon_0 A}, \quad V = Ed \;\Longrightarrow\; C = \frac QV = \frac{\varepsilon_0 A}{d}`, "The field is uniform between large, close plates."],
    ["Charge the capacitor a little at a time.", R`U = \int_0^Q \frac qC\,dq = \frac{Q^2}{2C} = \tfrac12CV^2 = \tfrac12\varepsilon_0E^2\,(Ad)`, "Each increment dq is moved through the p.d. q/C already present. The energy per unit volume, ½ε₀E², can be assigned to the field itself."]
  ], R`\mathbf E = -\nabla V, \qquad C = \frac{\varepsilon_0A}{d}, \qquad u = \tfrac12\varepsilon_0E^2`, [
    "C = ε₀A/d neglects the fringing field at the edges; valid for d ≪ plate size.",
    "u = ½ε₀E² is general for fields in vacuum, including electromagnetic waves."
  ]);

  d('y1-magnetostatics', [
    ["Each current element contributes to the field according to the Biot–Savart law.", R`d\mathbf B = \frac{\mu_0}{4\pi}\,\frac{I\,d\mathbf l\times\hat{\mathbf r}}{r^2}`, "The magnetic analogue of Coulomb’s law for a current element."],
    ["At the centre of a circular loop every element is at distance R and perpendicular to r̂.", R`B = \frac{\mu_0 I}{4\pi R^2}\oint dl = \frac{\mu_0 I}{2R}`, "All contributions point along the axis, and ∮dl is the circumference 2πR."],
    ["Summing Biot–Savart over any steady current distribution gives Ampère’s law.", R`\oint \mathbf B\cdot d\mathbf l = \mu_0 I_{\text{enc}}`, "The circulation of B round a closed loop counts the current threading it."],
    ["Long straight wire: B is tangential and constant on a circle of radius r.", R`B\,(2\pi r) = \mu_0 I \;\Longrightarrow\; B = \frac{\mu_0 I}{2\pi r}`, "Symmetry lets B come out of the integral."],
    ["Long solenoid with n turns per metre: use a rectangle with one side of length ℓ inside.", R`B\ell = \mu_0\,(n\ell)\,I \;\Longrightarrow\; B = \mu_0 n I`, "The field outside is negligible and the end sides are perpendicular to B, so only the inside edge contributes."]
  ], R`\oint\mathbf B\cdot d\mathbf l = \mu_0I_{\text{enc}}; \qquad B_{\text{wire}} = \frac{\mu_0I}{2\pi r}, \quad B_{\text{solenoid}} = \mu_0nI`, [
    "Steady currents only: with changing fields Ampère’s law needs Maxwell’s displacement current.",
    "Two parallel wires a distance d apart attract with force per length μ₀I₁I₂/2πd, which long defined the ampere."
  ]);

  d('y1-faraday', [
    ["A changing flux through a circuit induces an e.m.f. that opposes the change.", R`\mathcal E = -N\frac{d\Phi}{dt}`, "Faraday’s law with Lenz’s sign."],
    ["A solenoid of N turns, length ℓ and area A links its own flux.", R`B = \frac{\mu_0 N I}{\ell} \;\Longrightarrow\; N\Phi = \frac{\mu_0N^2A}{\ell}\,I \equiv LI`, "Flux linkage is proportional to current; the constant is the self-inductance L = μ₀N²A/ℓ."],
    ["So a changing current induces a back-e.m.f. In a series RL circuit:", R`\mathcal E_0 - L\frac{dI}{dt} = IR \;\Longrightarrow\; I = \frac{\mathcal E_0}{R}\left(1 - e^{-t/\tau}\right), \quad \tau = \frac LR`, "Kirchhoff’s loop rule. The inductor resists changes of current, so the current rises gradually."],
    ["The source works against the back-e.m.f.; that work is stored.", R`U = \int_0^I L I'\,dI' = \tfrac12LI^2`, "Power into the inductor is (L dI/dt)I."],
    ["Connect a charged capacitor across an inductor.", R`L\ddot q + \frac qC = 0 \;\Longrightarrow\; \omega = \frac{1}{\sqrt{LC}}`, "The loop rule with I = q̇ is the SHM equation: energy sloshes between the electric and magnetic fields."]
  ], R`L = \frac{\mu_0N^2A}{\ell}, \qquad U = \tfrac12LI^2, \qquad \omega_{LC} = \frac{1}{\sqrt{LC}}`, [
    "Ideal long solenoid; a real coil has end effects and resistance, which damps the LC oscillation.",
    "The induced electric field is not conservative: “potential difference” round a changing flux depends on the path."
  ]);

  d('y1-maxwell', [
    ["Take the divergence of Ampère’s law.", R`\nabla\cdot(\nabla\times\mathbf B) = 0 = \mu_0\nabla\cdot\mathbf J`, "The divergence of a curl is identically zero, so Ampère’s law requires ∇·J = 0."],
    ["But charge conservation says otherwise whenever charge is piling up.", R`\nabla\cdot\mathbf J = -\frac{\partial\rho}{\partial t} \ne 0`, "For example on the plates of a charging capacitor. Ampère’s law is inconsistent as it stands."],
    ["Maxwell added a term built from the changing electric field.", R`\nabla\times\mathbf B = \mu_0\mathbf J + \mu_0\varepsilon_0\frac{\partial\mathbf E}{\partial t}`, "Using Gauss’s law, the divergence of the new term is μ₀∂ρ/∂t, which cancels μ₀∇·J exactly."],
    ["In empty space take the curl of Faraday’s law and use the new equation.", R`\nabla\times(\nabla\times\mathbf E) = -\frac{\partial}{\partial t}(\nabla\times\mathbf B) = -\mu_0\varepsilon_0\frac{\partial^2\mathbf E}{\partial t^2}`, "With no charges or currents the two curl equations feed each other."],
    ["Simplify the left side.", R`\nabla^2\mathbf E = \mu_0\varepsilon_0\frac{\partial^2\mathbf E}{\partial t^2} \;\Longrightarrow\; c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}`, "∇×(∇×E) = ∇(∇·E) − ∇²E and ∇·E = 0 in vacuum. A wave equation whose speed, from two constants measured on the bench, is the speed of light."]
  ], R`\nabla\times\mathbf B = \mu_0\mathbf J + \mu_0\varepsilon_0\partial_t\mathbf E, \qquad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}`, [
    "The energy flow is the Poynting vector S = E × B/μ₀.",
    "Classical fields: at low intensities the granular, photon nature of light appears, which Maxwell’s equations do not describe."
  ]);

  d('y1-optics', [
    ["Light reflects from the top and bottom of a thin film of index n and thickness t (normal incidence, film in air).", R`\text{path difference} = 2nt, \qquad \text{one reflection is shifted by } \pi`, "Reflection from a higher-index medium inverts the wave; reflection from a lower-index one does not."],
    ["So the reflections reinforce when the path adds the missing half-wavelength.", R`2nt = (m + \tfrac12)\lambda`, "This is why soap films are coloured, and black where they are thinnest."],
    ["Single slit of width a: pair each point in the top half with the point a/2 below it.", R`\frac a2\sin\theta = \frac\lambda2 \;\Longrightarrow\; a\sin\theta = m\lambda \ \ (\text{minima},\ m \ne 0)`, "Each pair cancels when their paths differ by half a wavelength. Dividing the slit into 2m parts gives the higher minima."],
    ["A grating of N slits with spacing d has principal maxima where all slits are in phase.", R`d\sin\theta = m\lambda`, "The path difference between neighbours is a whole number of wavelengths."],
    ["The first zero beside a maximum is where the N phasors close into a polygon. A second wavelength is just resolved when its maximum falls there.", R`m(\lambda + \Delta\lambda) = m\lambda + \frac{\lambda}{N} \;\Longrightarrow\; \frac{\lambda}{\Delta\lambda} = mN`, "The N phasors sum to zero when the total phase across the grating has changed by one extra cycle, i.e. an extra path λ/N per slit."]
  ], R`2nt = (m + \tfrac12)\lambda, \qquad a\sin\theta = m\lambda\ (\text{minima}), \qquad \frac{\lambda}{\Delta\lambda} = mN`, [
    "Fraunhofer (far-field) conditions: plane waves in, pattern viewed at infinity or in a lens’s focal plane.",
    "A circular aperture of diameter D resolves two point sources separated by θ ≈ 1.22λ/D (Rayleigh)."
  ]);

  d('y1-rel-dynamics', [
    ["Momentum conservation holds in every inertial frame only if momentum is defined with a factor γ.", R`\mathbf p = \gamma m\mathbf v, \qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}}`, "With p = mv, a collision that conserves momentum in one frame would not in another, because velocities do not add simply."],
    ["Kinetic energy is the work done accelerating the particle from rest.", R`K = \int F\,dx = \int v\,dp = m\int v\,d(\gamma v)`, "F = dp/dt and dx = v dt."],
    ["Use d(γv) = γ³dv and γ³v dv = c² dγ.", R`K = mc^2\int_1^\gamma d\gamma' = (\gamma - 1)mc^2`, "Both identities follow from differentiating γ = (1 − v²/c²)^{−1/2}."],
    ["Interpret the constant as rest energy.", R`E = K + mc^2 = \gamma mc^2`, "For v ≪ c, (γ − 1)mc² ≈ ½mv², so the familiar kinetic energy is recovered."],
    ["Eliminate the velocity.", R`E^2 - (pc)^2 = \gamma^2m^2c^4\left(1 - \frac{v^2}{c^2}\right) = (mc^2)^2`, "The combination is the same in every frame. For a photon m = 0, so E = pc."]
  ], R`E = \gamma mc^2, \qquad E^2 = (pc)^2 + (mc^2)^2, \qquad \frac vc = \frac{pc}{E}`, [
    "m is the invariant rest mass; “relativistic mass” γm is an outdated way of writing the same thing.",
    "Thresholds for creating particles are found most easily from the invariant E² − (pc)² of the whole system."
  ]);

  d('y1-entropy', [
    ["For a Carnot cycle the heats exchanged are in the ratio of the temperatures.", R`\frac{Q_h}{T_h} = \frac{Q_c}{T_c} \;\Longrightarrow\; \oint\frac{\delta Q_{\text{rev}}}{T} = 0`, "Any reversible cycle can be built from infinitesimal Carnot cycles, so the integral vanishes for all of them."],
    ["A quantity whose change round every cycle is zero is a function of state.", R`dS = \frac{\delta Q_{\text{rev}}}{T}`, "1/T is the integrating factor that turns the path-dependent δQ into an exact differential."],
    ["Isothermal expansion of an ideal gas from V₁ to V₂.", R`\Delta S = \frac{Q}{T} = \frac{1}{T}\int_{V_1}^{V_2}\frac{nRT}{V}\,dV = nR\ln\frac{V_2}{V_1}`, "ΔU = 0 at constant T, so the heat absorbed equals the work done by the gas."],
    ["Count microstates instead. Each of N molecules has a number of positions proportional to V.", R`\Omega \propto V^N \;\Longrightarrow\; k\ln\frac{\Omega_2}{\Omega_1} = Nk\ln\frac{V_2}{V_1} = nR\ln\frac{V_2}{V_1}`, "The same answer, which identifies S = k ln Ω."],
    ["For an isolated system the multiplicity can only grow or stay the same.", R`\Delta S_{\text{total}} \ge 0`, "Overwhelmingly more microstates correspond to the higher-entropy macrostate: the second law is a statement about probability."]
  ], R`dS = \frac{\delta Q_{\text{rev}}}{T}, \qquad S = k\ln\Omega, \qquad \Delta S_{\text{total}} \ge 0`, [
    "For an irreversible process between two states, compute ΔS along any reversible path joining them.",
    "The second law is statistical: violations are possible but, for 10²³ particles, unobservably rare."
  ]);

  d('y1-old-quantum', [
    ["In Bohr’s hydrogen atom the Coulomb force keeps the electron in a circular orbit.", R`\frac{mv^2}{r} = \frac{e^2}{4\pi\varepsilon_0 r^2}`, "Classical mechanics for a circular orbit."],
    ["Bohr’s quantum condition: angular momentum comes in units of ħ.", R`mvr = n\hbar, \qquad n = 1, 2, 3, \dots`, "An assumption in 1913; de Broglie later read it as a whole number of electron wavelengths fitting round the orbit."],
    ["Eliminate v.", R`r_n = \frac{4\pi\varepsilon_0\hbar^2}{me^2}\,n^2 = n^2a_0, \qquad a_0 = 0.0529\ \text{nm}`, "Substitute v = nħ/mr into the force equation."],
    ["Total energy is kinetic plus potential.", R`E_n = \tfrac12mv^2 - \frac{e^2}{4\pi\varepsilon_0r_n} = -\frac{e^2}{8\pi\varepsilon_0r_n} = -\frac{13.6\ \text{eV}}{n^2}`, "From the force equation ½mv² is half the magnitude of the potential energy."],
    ["A jump between levels emits one photon.", R`\frac1\lambda = R_\infty\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right), \qquad R_\infty = \frac{m e^4}{8\varepsilon_0^2h^3c} = 1.097\times10^{7}\ \text{m}^{-1}`, "hc/λ = E_i − E_f. This reproduced the Rydberg constant measured from spectra to within a small correction for the proton’s finite mass."]
  ], R`r_n = n^2a_0, \qquad E_n = -\frac{13.6\ \text{eV}}{n^2}`, [
    "The orbit picture is wrong in detail: the ground state has zero orbital angular momentum, not ħ. Only the energies survive in quantum mechanics.",
    "Fails for atoms with more than one electron, and gives no line intensities or fine structure."
  ]);

  /* ------------------------------ Year 2 ------------------------------ */
  d('y2-fourier', [
    ["By Huygens’ principle each point x of an aperture radiates a wavelet. Far away, at angle θ, the wavelet from x is advanced in phase.", R`\text{phase} = -k\,x\sin\theta`, "Its path to a distant point is shorter by x sin θ than the path from the origin."],
    ["Add the wavelets, weighted by the aperture function A(x).", R`E(\theta) \propto \int A(x)\,e^{-ik_xx}\,dx = \tilde A(k_x), \qquad k_x = k\sin\theta`, "The far-field pattern is the Fourier transform of the aperture."],
    ["For a slit of width a the aperture function is a top-hat.", R`E \propto \int_{-a/2}^{a/2}e^{-ik_xx}\,dx = a\,\frac{\sin\beta}{\beta}, \qquad \beta = \tfrac12ka\sin\theta`, "Integrate the exponential and use sin β = (e^{iβ} − e^{−iβ})/2i."],
    ["Intensity is the squared modulus.", R`I = I_0\left(\frac{\sin\beta}{\beta}\right)^2`, "A sinc² pattern with a central maximum twice as wide as the others."],
    ["Zeros occur where sin β = 0 but β ≠ 0.", R`\beta = m\pi \;\Longrightarrow\; a\sin\theta = m\lambda`, "A narrower slit gives a wider pattern: the reciprocal relation of every Fourier pair."]
  ], R`E(k_x) \propto \tilde A(k_x), \qquad I = I_0\left(\frac{\sin\beta}{\beta}\right)^2`, [
    "Fraunhofer regime: distance ≫ a²/λ, or observation in the focal plane of a lens. Closer in, Fresnel diffraction applies.",
    "Scalar theory: polarisation is ignored, which is fine for apertures much larger than λ."
  ]);

  d('y2-qho', [
    ["Factorise the Hamiltonian H = p²/2m + ½mω²x² with a ladder operator.", R`a = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x + \frac{i\hat p}{m\omega}\right)`, "Classically x² + (p/mω)² factorises as (x − ip/mω)(x + ip/mω); the operators almost do."],
    ["They fail to commute by exactly one.", R`[a, a^\dagger] = \frac{m\omega}{2\hbar}\cdot\frac{-2i}{m\omega}[\hat x, \hat p] = 1`, "Using [x, p] = iħ."],
    ["That extra piece appears in the Hamiltonian.", R`H = \hbar\omega\left(a^\dagger a + \tfrac12\right)`, "Expanding a†a gives H/ħω minus ½."],
    ["The operator a† adds one quantum.", R`[H, a^\dagger] = \hbar\omega\,a^\dagger \;\Longrightarrow\; H\,a^\dagger|n\rangle = (E_n + \hbar\omega)\,a^\dagger|n\rangle`, "Likewise a lowers the energy by ħω."],
    ["The energy cannot fall for ever, so the ladder must end.", R`a|0\rangle = 0 \;\Longrightarrow\; E_n = \left(n + \tfrac12\right)\hbar\omega`, "H is a sum of squares of Hermitian operators, so its eigenvalues are positive. The bottom rung has a†a = 0."],
    ["Written as a differential equation, the bottom rung is a Gaussian.", R`\left(x + \frac{\hbar}{m\omega}\frac{d}{dx}\right)\psi_0 = 0 \;\Longrightarrow\; \psi_0 \propto e^{-m\omega x^2/2\hbar}`, "A first-order equation, solved by separating variables."]
  ], R`H = \hbar\omega\left(a^\dagger a + \tfrac12\right), \qquad E_n = \left(n + \tfrac12\right)\hbar\omega`, [
    "Exactly parabolic potential. Real molecular bonds are anharmonic, so their levels crowd together higher up.",
    "The zero-point energy ½ħω is real: it is why helium stays liquid at absolute zero under its own vapour pressure."
  ]);

  d('y2-4vectors', [
    ["Lorentz transformations are the linear maps that preserve the interval.", R`s^2 = c^2t^2 - x^2 - y^2 - z^2 = c^2t'^2 - x'^2 - y'^2 - z'^2`, "Both observers measure the same speed of light, so s² = 0 in one frame must mean s² = 0 in the other; linearity extends this to all intervals."],
    ["Along a particle’s path the invariant interval defines its proper time.", R`c^2d\tau^2 = c^2dt^2 - d\mathbf x^2 \;\Longrightarrow\; d\tau = \frac{dt}{\gamma}`, "In the particle’s own frame dx = 0, so the interval is just its clock time."],
    ["Differentiate position with respect to proper time to get a four-vector.", R`U^\mu = \frac{dx^\mu}{d\tau} = \gamma(c, \mathbf v), \qquad U\cdot U = \gamma^2(c^2 - v^2) = c^2`, "dτ is invariant, so U transforms like dx. Its length is the same for every particle."],
    ["Multiply by the rest mass.", R`P^\mu = mU^\mu = \left(\frac Ec, \mathbf p\right), \qquad E = \gamma mc^2,\ \mathbf p = \gamma m\mathbf v`, "The time component is energy over c: energy and momentum are parts of one object."],
    ["Take its invariant length.", R`P\cdot P = \frac{E^2}{c^2} - p^2 = m^2c^2 \;\Longrightarrow\; E^2 = p^2c^2 + m^2c^4`, "At rest, p = 0 and E = mc²."]
  ], R`P^\mu = \left(\frac Ec, \mathbf p\right), \qquad E^2 = p^2c^2 + m^2c^4`, [
    "Flat spacetime with signature (+, −, −, −); in general relativity the interval is built from a metric g_{μν}.",
    "Velocities do not add linearly but rapidities do: tanh φ = v/c, and φ_{total} = φ₁ + φ₂ for boosts along one line."
  ]);

  d('y2-noether', [
    ["Start from the Euler–Lagrange equation and define the momentum conjugate to q.", R`\frac{d}{dt}\frac{\partial L}{\partial\dot q_i} = \frac{\partial L}{\partial q_i}, \qquad p_i \equiv \frac{\partial L}{\partial\dot q_i}`, "The equations of motion in terms of the Lagrangian L = T − U."],
    ["If L does not depend on a coordinate, its momentum is conserved.", R`\frac{\partial L}{\partial q_i} = 0 \;\Longrightarrow\; \dot p_i = 0`, "Such a coordinate is called cyclic."],
    ["More generally, suppose L is unchanged by a small shift q_i → q_i + εK_i(q).", R`0 = \frac{\delta L}{\varepsilon} = \sum_i\left(\frac{\partial L}{\partial q_i}K_i + \frac{\partial L}{\partial\dot q_i}\dot K_i\right)`, "First-order change of L under the transformation."],
    ["Use the equations of motion in the first term.", R`0 = \sum_i\left(\dot p_iK_i + p_i\dot K_i\right) = \frac{d}{dt}\sum_i p_iK_i`, "The two terms combine into a total time derivative: Q = Σp_i K_i is conserved."],
    ["If L has no explicit time dependence, the same argument for time shifts gives the energy function.", R`h = \sum_i p_i\dot q_i - L, \qquad \frac{dh}{dt} = -\frac{\partial L}{\partial t}`, "Differentiate h and use the Euler–Lagrange equations; what survives is the explicit time dependence."]
  ], R`\delta L = 0 \ \text{under}\ q_i \to q_i + \varepsilon K_i \;\Longrightarrow\; \frac{d}{dt}\sum_i p_iK_i = 0`, [
    "Continuous symmetries only; a discrete symmetry such as reflection gives no conserved current of this kind.",
    "Translation gives momentum, rotation gives angular momentum, time translation gives energy. In a magnetic field the conserved canonical momentum is mv + qA, not mv."
  ]);

  d('y2-central-force', [
    ["Two bodies interacting through U(r) reduce to one body of reduced mass moving about the centre of mass.", R`\mu\ddot{\mathbf r} = -\nabla U(r), \qquad \mu = \frac{m_1m_2}{m_1 + m_2}`, "Subtract the two equations of motion; r is the separation."],
    ["A central force exerts no torque, so L is conserved and the motion stays in a plane.", R`L = \mu r^2\dot\theta = \text{constant}`, "Constant L also means equal areas are swept in equal times: dA/dt = L/2μ."],
    ["Use it to remove θ̇ from the energy.", R`E = \tfrac12\mu\dot r^2 + \underbrace{\frac{L^2}{2\mu r^2} + U(r)}_{U_{\text{eff}}(r)}`, "The radial motion is one-dimensional motion in an effective potential with a centrifugal barrier."],
    ["For U = −k/r, change variable to u = 1/r and use θ as the independent variable.", R`\frac{d^2u}{d\theta^2} + u = \frac{\mu k}{L^2} \;\Longrightarrow\; r = \frac{p}{1 + e\cos\theta}, \qquad p = \frac{L^2}{\mu k}`, "The orbit equation is that of a displaced harmonic oscillator in θ. The solution is a conic section with a focus at the origin."],
    ["For an ellipse, period = area ÷ rate of sweeping area, with b² = ap.", R`T = \frac{\pi ab}{L/2\mu} \;\Longrightarrow\; T^2 = \frac{4\pi^2\mu a^3}{k} = \frac{4\pi^2a^3}{G(m_1 + m_2)}`, "Using k = Gm₁m₂. Kepler’s third law, with the sum of the masses."]
  ], R`r = \frac{p}{1 + e\cos\theta}, \qquad T^2 = \frac{4\pi^2a^3}{G(m_1 + m_2)}`, [
    "Closed ellipses are special to 1/r and r² potentials (Bertrand’s theorem); any other correction makes the orbit precess, as Mercury’s does.",
    "Point masses or spherically symmetric bodies; oblateness and third bodies perturb real orbits."
  ]);

  d('y2-rigid-body', [
    ["Sum the angular momentum of every mass element of a body rotating with angular velocity ω.", R`\mathbf L = \sum m\,\mathbf r\times(\boldsymbol\omega\times\mathbf r) \;\Longrightarrow\; L_i = I_{ij}\omega_j, \quad I_{ij} = \sum m\,(r^2\delta_{ij} - r_ir_j)`, "v = ω × r, then expand the triple product. In general L is not parallel to ω."],
    ["The inertia tensor is real and symmetric, so axes exist in which it is diagonal.", R`\mathbf L = (I_1\omega_1,\ I_2\omega_2,\ I_3\omega_3)`, "These are the principal axes, fixed in the body."],
    ["Newton’s law holds in the inertial frame; the body frame rotates.", R`\left(\frac{d\mathbf L}{dt}\right)_{\text{space}} = \left(\frac{d\mathbf L}{dt}\right)_{\text{body}} + \boldsymbol\omega\times\mathbf L = \boldsymbol\tau`, "The rate of change of any vector in a rotating frame picks up an ω × term."],
    ["Write out the components along the principal axes.", R`I_1\dot\omega_1 = (I_2 - I_3)\,\omega_2\omega_3 + \tau_1 \quad \text{(and cyclic)}`, "Euler’s equations."],
    ["Torque-free spin mostly about axis 2, with small ω₁ and ω₃ and I₁ < I₂ < I₃.", R`\ddot\omega_1 = \frac{(I_2 - I_3)(I_1 - I_2)}{I_1I_3}\,\omega_2^2\,\omega_1 = +\lambda^2\omega_1`, "Both brackets are negative, so the coefficient is positive: the perturbation grows exponentially. Rotation about the intermediate axis is unstable."]
  ], R`I_1\dot\omega_1 = (I_2 - I_3)\omega_2\omega_3 + \tau_1, \qquad \lambda = \omega_2\sqrt{\frac{(I_2 - I_1)(I_3 - I_2)}{I_1I_3}}`, [
    "Perfectly rigid body. With internal friction a freely spinning body ends up rotating about its axis of greatest moment of inertia, as Explorer 1 did unexpectedly.",
    "For axes 1 and 3 the same analysis gives oscillation, not growth: those rotations are stable."
  ]);

  d('y2-small-oscillations', [
    ["Expand the potential about a stable equilibrium q₀ in small displacements η.", R`U \approx U_0 + \tfrac12\sum_{ij}V_{ij}\,\eta_i\eta_j, \qquad V_{ij} = \left.\frac{\partial^2U}{\partial q_i\partial q_j}\right|_{q_0}`, "The linear term vanishes at equilibrium."],
    ["To the same order the kinetic energy is quadratic in the velocities.", R`T = \tfrac12\sum_{ij}T_{ij}\,\dot\eta_i\dot\eta_j`, "Evaluate the mass matrix at the equilibrium point."],
    ["Lagrange’s equations are then linear.", R`\mathsf T\,\ddot{\boldsymbol\eta} = -\mathsf V\,\boldsymbol\eta`, "Both matrices are symmetric and constant."],
    ["Look for motions in which every coordinate oscillates at the same frequency.", R`\boldsymbol\eta = \mathbf a\,e^{i\omega t} \;\Longrightarrow\; (\mathsf V - \omega^2\mathsf T)\,\mathbf a = 0 \;\Longrightarrow\; \det(\mathsf V - \omega^2\mathsf T) = 0`, "A generalised eigenvalue problem. Each root ω² is a normal-mode frequency and a its shape."],
    ["In coordinates built from the eigenvectors the modes decouple.", R`\boldsymbol\eta = \mathsf A\boldsymbol\xi: \quad \ddot\xi_k = -\omega_k^2\xi_k`, "The matrix of eigenvectors diagonalises T and V together. Any small motion is a superposition of independent harmonic oscillators."]
  ], R`\det(\mathsf V - \omega^2\mathsf T) = 0`, [
    "Small amplitudes only: the next terms in the expansion couple the modes.",
    "If an eigenvalue ω² is negative the equilibrium is unstable; ω² = 0 signals a free motion such as overall translation."
  ]);

  d('y2-schrodinger', [
    ["A free particle of definite momentum is a plane wave, with the de Broglie and Planck relations.", R`\psi = e^{i(kx - \omega t)}, \qquad p = \hbar k, \quad E = \hbar\omega`, "The experimental starting point: electron diffraction and the photoelectric effect."],
    ["Derivatives of the wave bring down E and p.", R`i\hbar\,\partial_t\psi = E\psi, \qquad -i\hbar\,\partial_x\psi = p\psi`, "This suggests representing energy and momentum by operators."],
    ["Impose E = p²/2m + V on the wave.", R`i\hbar\,\frac{\partial\psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\psi}{\partial x^2} + V\psi`, "A postulate motivated by, not derived from, classical mechanics. Linearity gives superposition."],
    ["Differentiate the density |ψ|² and use the equation and its conjugate.", R`\partial_t|\psi|^2 + \partial_xj = 0, \qquad j = \frac{\hbar}{2mi}\left(\psi^*\partial_x\psi - \psi\,\partial_x\psi^*\right)`, "The potential terms cancel because V is real. Probability is conserved locally, which justifies the Born rule."],
    ["If V does not depend on time, separate the variables.", R`\psi = \phi(x)\,e^{-iEt/\hbar}, \qquad \hat H\phi = E\phi, \qquad \Psi = \sum_nc_n\phi_ne^{-iE_nt/\hbar}`, "Stationary states have a time-independent density. The general solution is a superposition of them."]
  ], R`i\hbar\,\partial_t\psi = \hat H\psi, \qquad \partial_t|\psi|^2 + \nabla\cdot\mathbf j = 0`, [
    "Non-relativistic and for a fixed number of particles; relativity needs the Dirac equation and quantum fields.",
    "The equation gives deterministic evolution of ψ; what happens in a measurement is added by the Born rule."
  ]);

  d('y2-step-barrier', [
    ["A particle of energy E > V₀ meets a step at x = 0. Write the general solution on each side.", R`\psi_1 = e^{ik_1x} + r\,e^{-ik_1x}, \qquad \psi_2 = t\,e^{ik_2x}, \qquad k_{1,2} = \frac{\sqrt{2m(E - V_{1,2})}}{\hbar}`, "Incident plus reflected wave on the left; only a transmitted wave on the right, since nothing comes in from there."],
    ["ψ and its derivative are continuous at the step.", R`1 + r = t, \qquad k_1(1 - r) = k_2t`, "A finite potential jump cannot produce a kink in ψ."],
    ["Solve.", R`r = \frac{k_1 - k_2}{k_1 + k_2}, \qquad t = \frac{2k_1}{k_1 + k_2}`, "Two equations in two unknowns."],
    ["Reflection and transmission probabilities are ratios of probability currents.", R`R = r^2 = \left(\frac{k_1 - k_2}{k_1 + k_2}\right)^2, \qquad T = \frac{k_2}{k_1}t^2 = \frac{4k_1k_2}{(k_1 + k_2)^2}`, "The current is (ħk/m)|amplitude|², so T carries the factor k₂/k₁. R + T = 1."],
    ["For E < V₀, k₂ becomes imaginary and the wave decays inside the step.", R`\psi_2 = t\,e^{-\kappa x}, \qquad \frac1\kappa = \frac{\hbar}{\sqrt{2m(V_0 - E)}}`, "Then |r| = 1: total reflection, but with a penetration depth 1/κ. Give the barrier a finite width and this tail becomes tunnelling."]
  ], R`R = \left(\frac{k_1 - k_2}{k_1 + k_2}\right)^2, \qquad \frac1\kappa = \frac{\hbar}{\sqrt{2m(V_0 - E)}}`, [
    "An ideal sharp step; a potential that changes slowly compared with the wavelength reflects very little.",
    "Plane waves are an idealisation; a wave packet splits into reflected and transmitted packets with these probabilities."
  ]);

  d('y2-operators', [
    ["Let position and momentum act on any function.", R`[\hat x, \hat p]f = x(-i\hbar f') + i\hbar(xf)' = i\hbar f \;\Longrightarrow\; [\hat x, \hat p] = i\hbar`, "The product rule leaves one extra term."],
    ["For Hermitian A and B define the states of their fluctuations.", R`|f\rangle = (\hat A - \langle A\rangle)|\psi\rangle, \quad |g\rangle = (\hat B - \langle B\rangle)|\psi\rangle, \qquad \sigma_A^2 = \langle f|f\rangle,\ \sigma_B^2 = \langle g|g\rangle`, "The variance is the squared length of the fluctuation vector."],
    ["Apply the Schwarz inequality and keep the imaginary part.", R`\sigma_A^2\sigma_B^2 \ge |\langle f|g\rangle|^2 \ge \left(\frac{\langle f|g\rangle - \langle g|f\rangle}{2i}\right)^2`, "|z|² ≥ (Im z)² for any complex number."],
    ["The antisymmetric combination is the commutator.", R`\langle f|g\rangle - \langle g|f\rangle = \langle[\hat A, \hat B]\rangle \;\Longrightarrow\; \sigma_A\sigma_B \ge \tfrac12\left|\langle[\hat A, \hat B]\rangle\right|`, "The mean values cancel in the commutator."],
    ["For position and momentum:", R`\sigma_x\sigma_p \ge \frac\hbar2`, "A property of the state itself, not of a clumsy measurement."],
    ["The same commutator governs time evolution.", R`\frac{d\langle A\rangle}{dt} = \frac{i}{\hbar}\langle[\hat H, \hat A]\rangle \;\Longrightarrow\; \frac{d\langle p\rangle}{dt} = -\langle V'(x)\rangle`, "Ehrenfest’s theorem: expectation values follow Newton’s law on average."]
  ], R`\sigma_A\sigma_B \ge \tfrac12\left|\langle[\hat A, \hat B]\rangle\right|, \qquad \sigma_x\sigma_p \ge \frac\hbar2`, [
    "Time is not an operator, so ΔEΔt ~ ħ is a different kind of statement: it relates an energy spread to the time a state takes to change (Γ = ħ/τ).",
    "⟨V′(x)⟩ is not V′(⟨x⟩) unless the wave packet is narrow, so Ehrenfest’s theorem does not make quantum motion classical."
  ]);

  d('y2-partition', [
    ["A small system exchanges energy with a large reservoir. The probability of a system state i is proportional to the number of reservoir states left available.", R`P_i \propto \Omega_R(E_{\text{tot}} - E_i) = e^{S_R(E_{\text{tot}} - E_i)/k}`, "Every microstate of the isolated whole is equally likely."],
    ["Expand the reservoir entropy to first order.", R`S_R(E_{\text{tot}} - E_i) \approx S_R(E_{\text{tot}}) - \frac{E_i}{T}`, "∂S/∂E = 1/T, and the reservoir is so large that higher terms are negligible."],
    ["Normalise.", R`P_i = \frac{e^{-\beta E_i}}{Z}, \qquad Z = \sum_ie^{-\beta E_i}, \qquad \beta = \frac{1}{kT}`, "The Boltzmann distribution, with the partition function as normalising constant."],
    ["Averages follow from derivatives of ln Z.", R`U = \sum_iE_iP_i = -\frac{\partial\ln Z}{\partial\beta}`, "Differentiating Z brings down −E_i."],
    ["Insert P_i into the Gibbs entropy.", R`S = -k\sum_iP_i\ln P_i = k\ln Z + \frac UT \;\Longrightarrow\; F = U - TS = -kT\ln Z`, "All of thermodynamics follows from Z."],
    ["A second derivative gives the fluctuations.", R`\langle(\Delta E)^2\rangle = \frac{\partial^2\ln Z}{\partial\beta^2} = kT^2C_V`, "Relative fluctuations scale as 1/√N, which is why thermodynamics is sharp for large systems."]
  ], R`P_i = \frac{e^{-\beta E_i}}{Z}, \qquad F = -kT\ln Z`, [
    "Weak coupling to a reservoir much larger than the system, in equilibrium.",
    "For indistinguishable particles in the classical limit, divide Z_1^N by N!; at high density use Bose or Fermi statistics instead."
  ]);

  d('y2-blackbody', [
    ["Count the standing electromagnetic waves in a cavity with frequencies between ν and ν + dν.", R`g(\nu)\,d\nu = \frac{8\pi\nu^2}{c^3}\,d\nu \quad \text{per unit volume}`, "Allowed wavevectors fill a shell of k-space of volume 4πk²dk, with two polarisations each."],
    ["Each mode is an oscillator whose energy is quantised in units of hν.", R`Z = \sum_{n=0}^\infty e^{-n\beta h\nu} = \frac{1}{1 - e^{-\beta h\nu}}`, "Planck’s hypothesis; the sum is a geometric series."],
    ["Its mean energy is not kT.", R`\langle E\rangle = -\frac{\partial\ln Z}{\partial\beta} = \frac{h\nu}{e^{h\nu/kT} - 1}`, "For hν ≪ kT this reduces to kT (equipartition); for hν ≫ kT the mode is frozen out."],
    ["Multiply modes by mean energy.", R`u(\nu) = \frac{8\pi h\nu^3}{c^3}\,\frac{1}{e^{h\nu/kT} - 1}`, "Planck’s law. The exponential cures the ultraviolet catastrophe."],
    ["Integrate over all frequencies with x = hν/kT.", R`u = \frac{8\pi k^4T^4}{h^3c^3}\int_0^\infty\frac{x^3\,dx}{e^x - 1} = \frac{8\pi^5k^4}{15h^3c^3}\,T^4 \;\Longrightarrow\; M = \frac c4u = \sigma T^4`, "The integral is π⁴/15. The factor c/4 converts energy density to the power leaving a small hole."]
  ], R`u(\nu) = \frac{8\pi h\nu^3/c^3}{e^{h\nu/kT} - 1}, \qquad \sigma = \frac{2\pi^5k^4}{15h^3c^2}`, [
    "A cavity much larger than the wavelengths, in thermal equilibrium.",
    "Maximising the distribution in wavelength gives Wien’s law λ_{max} T = 2.898 mm K; the peak in frequency is at a different place because dν and dλ are not proportional."
  ]);

  d('y2-multipoles', [
    ["The potential of a localised charge distribution, seen from a distant point r.", R`V(\mathbf r) = \frac{1}{4\pi\varepsilon_0}\int\frac{\rho(\mathbf r')}{|\mathbf r - \mathbf r'|}\,d^3r'`, "Superposition of Coulomb potentials."],
    ["Expand the distance for r ≫ r′.", R`\frac{1}{|\mathbf r - \mathbf r'|} = \frac1r\left(1 - \frac{2\hat{\mathbf r}\cdot\mathbf r'}{r} + \frac{r'^2}{r^2}\right)^{-1/2} \approx \frac1r + \frac{\hat{\mathbf r}\cdot\mathbf r'}{r^2} + \dots`, "Binomial expansion in the small ratio r′/r. The full series is Σ(r′ˡ/rˡ⁺¹)P_l(cos γ)."],
    ["Integrate term by term.", R`V \approx \frac{1}{4\pi\varepsilon_0}\left(\frac Qr + \frac{\mathbf p\cdot\hat{\mathbf r}}{r^2} + \dots\right), \qquad Q = \int\rho\,d^3r',\quad \mathbf p = \int\mathbf r'\rho\,d^3r'`, "The total charge and the dipole moment are the first two moments of the distribution."],
    ["For a neutral object the dipole term leads. Take the gradient.", R`\mathbf E = -\nabla V = \frac{3(\mathbf p\cdot\hat{\mathbf r})\hat{\mathbf r} - \mathbf p}{4\pi\varepsilon_0r^3}`, "The dipole field falls as 1/r³."],
    ["Away from the charges every term solves Laplace’s equation separately.", R`\nabla^2V = 0 \;\Longrightarrow\; V = \sum_l\left(A_lr^l + \frac{B_l}{r^{l+1}}\right)P_l(\cos\theta)`, "Separation of variables in spherical coordinates with axial symmetry; the multipole terms are the B_l."]
  ], R`V \approx \frac{1}{4\pi\varepsilon_0}\left(\frac Qr + \frac{\mathbf p\cdot\hat{\mathbf r}}{r^2}\right)`, [
    "Valid outside the smallest sphere that contains all the charge.",
    "The dipole moment depends on the choice of origin unless the total charge is zero."
  ]);

  d('y2-matter-fields', [
    ["A dielectric with dipole moment per unit volume P produces a potential.", R`V = \frac{1}{4\pi\varepsilon_0}\int\mathbf P(\mathbf r')\cdot\nabla'\!\left(\frac{1}{|\mathbf r - \mathbf r'|}\right)d^3r'`, "Each volume element is a small dipole P dV; its potential is p·r̂/4πε₀r² written as a gradient."],
    ["Integrate by parts.", R`V = \frac{1}{4\pi\varepsilon_0}\left[\oint\frac{\mathbf P\cdot\hat{\mathbf n}}{|\mathbf r - \mathbf r'|}\,dA' + \int\frac{-\nabla'\cdot\mathbf P}{|\mathbf r - \mathbf r'|}\,d^3r'\right]`, "The divergence theorem turns the total derivative into a surface term."],
    ["Read off the equivalent charges.", R`\sigma_b = \mathbf P\cdot\hat{\mathbf n}, \qquad \rho_b = -\nabla\cdot\mathbf P`, "These bound charges are real: they are the uncancelled ends of the stretched molecules."],
    ["Put both kinds of charge into Gauss’s law.", R`\varepsilon_0\nabla\cdot\mathbf E = \rho_f - \nabla\cdot\mathbf P \;\Longrightarrow\; \nabla\cdot\mathbf D = \rho_f, \qquad \mathbf D = \varepsilon_0\mathbf E + \mathbf P`, "D responds only to the free charge, which is the charge we control."],
    ["In a linear medium the polarisation is proportional to the field.", R`\mathbf P = \varepsilon_0\chi_e\mathbf E \;\Longrightarrow\; \mathbf D = \varepsilon_0\varepsilon_r\mathbf E, \qquad \varepsilon_r = 1 + \chi_e`, "The magnetic case is parallel: J_b = ∇ × M, H = B/μ₀ − M and ∇ × H = J_f."]
  ], R`\rho_b = -\nabla\cdot\mathbf P, \qquad \nabla\cdot\mathbf D = \rho_f, \qquad \nabla\times\mathbf H = \mathbf J_f`, [
    "Linear, isotropic response fails in ferroelectrics and ferromagnets, in crystals with preferred axes, and in very strong fields.",
    "D is not fixed by ρ_f alone unless symmetry makes ∇ × D vanish; in general ∇ × D = ∇ × P."
  ]);

  d('y2-em-relativity', [
    ["Charge density and current combine into a four-vector, and charge conservation becomes one equation.", R`J^\mu = (c\rho, \mathbf J), \qquad \partial_\mu J^\mu = \frac{\partial\rho}{\partial t} + \nabla\cdot\mathbf J = 0`, "A moving charge density is a current, so a boost mixes the two."],
    ["The potentials form another four-vector, from which an antisymmetric tensor is built.", R`A^\mu = \left(\frac Vc, \mathbf A\right), \qquad F^{\mu\nu} = \partial^\mu A^\nu - \partial^\nu A^\mu`, "E = −∇V − ∂A/∂t and B = ∇ × A are both antisymmetric combinations of derivatives of the potentials."],
    ["Its six independent components are the fields.", R`F^{0i} = -\frac{E_i}{c}, \qquad F^{ij} = -\epsilon_{ijk}B_k`, "With metric signature (+, −, −, −). E and B are parts of one object."],
    ["The two Maxwell equations with sources become one tensor equation.", R`\partial_\mu F^{\mu\nu} = \mu_0J^\nu`, "ν = 0 gives Gauss’s law and ν = i the Ampère–Maxwell law. The other two equations follow identically from the definition of F."],
    ["Boost the tensor with velocity v.", R`\mathbf E'_\parallel = \mathbf E_\parallel, \quad \mathbf E'_\perp = \gamma(\mathbf E + \mathbf v\times\mathbf B)_\perp, \quad \mathbf B'_\perp = \gamma\left(\mathbf B - \frac{\mathbf v\times\mathbf E}{c^2}\right)_\perp`, "F transforms with two Lorentz matrices. What one observer calls a purely electric field has a magnetic part for another."]
  ], R`\partial_\mu F^{\mu\nu} = \mu_0J^\nu; \qquad \text{invariants: } E^2 - c^2B^2,\ \ \mathbf E\cdot\mathbf B`, [
    "Two combinations are the same in every frame, so a field that is purely magnetic in one frame can never be purely electric in another.",
    "The Lorentz force is dp^μ/dτ = qF^{μν}u_ν; classical theory ignores the field’s reaction on the charge."
  ]);
})();
/* ---- derive-4.js ---- */
/* Geodesic — derivations for notes-only topics: university physics, Year 3. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('y3-hamiltonian', [
    ["Define the Hamiltonian as the Legendre transform of the Lagrangian.", R`H(q, p, t) = \sum_i p_i\dot q_i - L, \qquad p_i = \frac{\partial L}{\partial\dot q_i}`, "The transform swaps the velocities for the momenta as independent variables."],
    ["Take its differential.", R`dH = \sum_i\left(\dot q_i\,dp_i + p_i\,d\dot q_i - \frac{\partial L}{\partial q_i}dq_i - \frac{\partial L}{\partial\dot q_i}d\dot q_i\right) - \frac{\partial L}{\partial t}dt`, "Product rule on pq̇ and chain rule on L."],
    ["The dq̇ terms cancel, and Lagrange’s equation replaces ∂L/∂q by ṗ.", R`dH = \sum_i\left(\dot q_i\,dp_i - \dot p_i\,dq_i\right) - \frac{\partial L}{\partial t}dt`, "The definition of p removes all dependence on dq̇: that is the point of the Legendre transform."],
    ["Compare with the general differential of H(q, p, t).", R`\dot q_i = \frac{\partial H}{\partial p_i}, \qquad \dot p_i = -\frac{\partial H}{\partial q_i}`, "Hamilton’s equations: 2n first-order equations instead of n second-order ones."],
    ["Any function of the phase-space variables then evolves by a Poisson bracket.", R`\frac{df}{dt} = \sum_i\left(\frac{\partial f}{\partial q_i}\dot q_i + \frac{\partial f}{\partial p_i}\dot p_i\right) + \frac{\partial f}{\partial t} = \{f, H\} + \frac{\partial f}{\partial t}`, "Chain rule plus Hamilton’s equations. A quantity with {f, H} = 0 and no explicit time dependence is conserved."],
    ["The flow in phase space has zero divergence.", R`\frac{\partial\dot q}{\partial q} + \frac{\partial\dot p}{\partial p} = \frac{\partial^2H}{\partial q\,\partial p} - \frac{\partial^2H}{\partial p\,\partial q} = 0`, "Mixed partial derivatives commute. Phase-space volume is conserved: Liouville’s theorem."]
  ], R`\dot q = \frac{\partial H}{\partial p}, \qquad \dot p = -\frac{\partial H}{\partial q}, \qquad \frac{df}{dt} = \{f, H\} + \partial_tf`, [
    "The Legendre transform needs p = ∂L/∂q̇ to be invertible for q̇; gauge theories and other constrained systems need Dirac’s extension.",
    "H equals the energy T + U only when the constraints are time-independent and U does not depend on velocity."
  ]);

  d('y3-lasers', [
    ["Two levels in a cavity of radiation with spectral energy density u. In equilibrium, upward and downward rates balance.", R`N_1B_{12}\,u = N_2\left(A_{21} + B_{21}\,u\right)`, "Absorption on the left; spontaneous and stimulated emission on the right. These are Einstein’s three processes."],
    ["Thermal populations follow Boltzmann.", R`\frac{N_2}{N_1} = \frac{g_2}{g_1}e^{-h\nu/kT}`, "With degeneracies g₁, g₂."],
    ["Solve for u.", R`u = \frac{A_{21}/B_{21}}{\dfrac{g_1B_{12}}{g_2B_{21}}\,e^{h\nu/kT} - 1}`, "Divide through by N₂B₂₁."],
    ["This must be Planck’s law at every temperature.", R`g_1B_{12} = g_2B_{21}, \qquad \frac{A_{21}}{B_{21}} = \frac{8\pi h\nu^3}{c^3}`, "Matching the form (e^{hν/kT} − 1)⁻¹ fixes the first relation, the prefactor the second. Stimulated emission is forced on us by thermodynamics."],
    ["A beam passing through the medium gains from stimulated emission and loses to absorption.", R`\gamma = \sigma(\nu)\left(N_2 - \frac{g_2}{g_1}N_1\right)`, "Using the first relation. Gain needs a population inversion, which never occurs in thermal equilibrium."],
    ["Lasing starts when the round-trip gain makes up for the mirror losses.", R`R_1R_2\,e^{2\gamma L} = 1 \;\Longrightarrow\; \gamma_{\text{th}} = -\frac{\ln(R_1R_2)}{2L}`, "After a round trip of length 2L the intensity must return to its starting value."]
  ], R`g_1B_{12} = g_2B_{21}, \qquad \frac{A_{21}}{B_{21}} = \frac{8\pi h\nu^3}{c^3}, \qquad \gamma_{\text{th}} = -\frac{\ln(R_1R_2)}{2L}`, [
    "A two-level system cannot be inverted by optical pumping (at best N₂ = N₁ g₂/g₁); real lasers use three or four levels.",
    "A ∝ ν³ B is why X-ray lasers are hard: spontaneous emission empties the upper level too quickly."
  ]);

  d('y3-radiation', [
    ["A charge at rest is given a brief acceleration a for a time Δt. At a later time t its field has a kink in a shell of radius r = ct.", R`\text{outside: field of the old position}, \qquad \text{inside: field of the moving charge}`, "News of the acceleration travels outward at c. Field lines must be continuous across the shell."],
    ["Geometry of the kink gives the ratio of transverse to radial field in the shell.", R`\frac{E_\perp}{E_r} = \frac{\Delta v\,t\,\sin\theta}{c\,\Delta t} = \frac{a\,r\sin\theta}{c^2}`, "The charge has moved Δv·t, of which the part perpendicular to the line of sight is Δv t sin θ; the shell is cΔt thick. Use Δv = aΔt and t = r/c."],
    ["The radial field is Coulomb’s.", R`E_\perp = \frac{q}{4\pi\varepsilon_0r^2}\cdot\frac{a\,r\sin\theta}{c^2} = \frac{q\,a\sin\theta}{4\pi\varepsilon_0c^2\,r}`, "The transverse field falls only as 1/r: this is radiation, and it carries energy to infinity."],
    ["The energy flux is the Poynting vector.", R`S = \varepsilon_0c\,E_\perp^2 = \frac{q^2a^2\sin^2\theta}{16\pi^2\varepsilon_0c^3\,r^2}`, "For a radiation field B = E/c and S = EB/μ₀ = ε₀cE². No radiation along the acceleration, most at right angles."],
    ["Integrate over a sphere.", R`P = \int S\,r^2\,d\Omega = \frac{q^2a^2}{16\pi^2\varepsilon_0c^3}\cdot\frac{8\pi}{3} = \frac{q^2a^2}{6\pi\varepsilon_0c^3}`, "∫sin²θ dΩ = 8π/3. The Larmor formula."]
  ], R`P = \frac{q^2a^2}{6\pi\varepsilon_0c^3}, \qquad \frac{dP}{d\Omega} \propto \sin^2\theta`, [
    "Non-relativistic charge. At high speed the power is multiplied by γ⁶ (linear acceleration) or γ⁴ (circular), and beamed forward into a cone of angle about 1/γ.",
    "Applied to a classical orbiting electron it predicts atoms collapse in about 10⁻¹¹ s: one of the failures that led to quantum mechanics."
  ]);

  d('y3-quantum-gases', [
    ["Treat one single-particle state of energy ε as a system exchanging particles with the rest. For fermions it holds 0 or 1.", R`\Xi = 1 + e^{-\beta(\varepsilon - \mu)} \;\Longrightarrow\; \bar n = \frac{1}{e^{\beta(\varepsilon - \mu)} + 1}`, "Grand partition function of the state; n̄ is the probability that it is occupied. Pauli exclusion is built in."],
    ["For bosons any number may occupy it.", R`\Xi = \sum_{n=0}^\infty e^{-n\beta(\varepsilon - \mu)} = \frac{1}{1 - e^{-\beta(\varepsilon - \mu)}} \;\Longrightarrow\; \bar n = \frac{1}{e^{\beta(\varepsilon - \mu)} - 1}`, "A geometric series, convergent only if μ < ε for every state."],
    ["At T = 0 fermions fill every state up to a sharp Fermi surface. Count the states inside a sphere in k-space.", R`N = 2\cdot\frac{V}{(2\pi)^3}\cdot\frac43\pi k_F^3 \;\Longrightarrow\; k_F = (3\pi^2n)^{1/3}`, "Each state occupies (2π)³/V of k-space, and there are two spin states."],
    ["The energy of the highest filled state is the Fermi energy.", R`E_F = \frac{\hbar^2k_F^2}{2m} = \frac{\hbar^2}{2m}(3\pi^2n)^{2/3}`, "For electrons in a metal this is several eV, i.e. tens of thousands of kelvin, which is why they contribute so little heat capacity."],
    ["For bosons the excited states can hold only a limited number as μ → 0⁻.", R`N_{\text{ex}}^{\max} = \frac{V}{\lambda_{\text{th}}^3}\,\zeta(\tfrac32), \qquad \lambda_{\text{th}} = \frac{h}{\sqrt{2\pi mkT}}`, "Integrating the Bose distribution over the density of states at μ = 0 gives ζ(3/2) = 2.612."],
    ["Below the temperature at which this equals N, the remainder must collect in the ground state.", R`n\lambda_{\text{th}}^3 = 2.612 \;\Longrightarrow\; T_c = \frac{2\pi\hbar^2}{mk}\left(\frac{n}{2.612}\right)^{2/3}`, "Bose–Einstein condensation: a phase transition driven by statistics alone, with no interactions."]
  ], R`\bar n = \frac{1}{e^{(\varepsilon - \mu)/kT} \pm 1}, \qquad E_F = \frac{\hbar^2}{2m}(3\pi^2n)^{2/3}`, [
    "Ideal, non-interacting gases. Interactions change T_c slightly and are essential for superfluidity.",
    "Both distributions reduce to Boltzmann’s when nλ³ ≪ 1, that is, when the thermal wavelength is far smaller than the spacing between particles."
  ]);

  d('y3-hydrogen', [
    ["The potential is central, so separate the wavefunction and substitute u = rR.", R`\psi = \frac{u(r)}{r}\,Y_l^m(\theta, \phi): \qquad -\frac{\hbar^2}{2\mu}u'' + \left[-\frac{e^2}{4\pi\varepsilon_0r} + \frac{\hbar^2l(l+1)}{2\mu r^2}\right]u = Eu`, "The angular part gives the spherical harmonics and leaves a one-dimensional problem with a centrifugal barrier."],
    ["Find the behaviour at the two ends, with κ = √(−2μE)/ħ.", R`u \sim e^{-\kappa r} \ (r \to \infty), \qquad u \sim r^{l+1} \ (r \to 0)`, "At large r only the energy term survives; at small r the centrifugal term dominates. The other solutions are not normalisable."],
    ["Peel these off and expand what remains as a power series in ρ = κr.", R`u = \rho^{l+1}e^{-\rho}\sum_jc_j\rho^j, \qquad c_{j+1} = \frac{2(j + l + 1) - \rho_0}{(j + 1)(j + 2l + 2)}\,c_j, \quad \rho_0 = \frac{\mu e^2}{2\pi\varepsilon_0\hbar^2\kappa}`, "Substituting into the radial equation gives a recursion relation for the coefficients."],
    ["If the series never ends, c_{j+1}/c_j → 2/j, which sums to e^{2ρ} and ruins normalisation. So it must terminate.", R`\rho_0 = 2n, \qquad n = j_{\max} + l + 1 = 1, 2, 3, \dots`, "The numerator of the recursion must vanish for some j_{max}. This is the quantisation condition."],
    ["Translate back to the energy.", R`E_n = -\frac{\hbar^2\kappa^2}{2\mu} = -\frac{\mu}{2\hbar^2}\left(\frac{e^2}{4\pi\varepsilon_0}\right)^2\frac{1}{n^2} = -\frac{13.6\ \text{eV}}{n^2}`, "κ = μe²/(4πε₀ħ²n) = 1/(na₀). The energy depends on n only, although l can be anything from 0 to n − 1."]
  ], R`E_n = -\frac{13.6\ \text{eV}}{n^2}, \qquad a_0 = \frac{4\pi\varepsilon_0\hbar^2}{m_ee^2}, \qquad l = 0, \dots, n - 1`, [
    "Non-relativistic, spinless electron and a point nucleus. Fine structure, the Lamb shift and hyperfine splitting lift the degeneracy at the level of 10⁻⁴ and below.",
    "The degeneracy in l is special to the 1/r potential (a hidden SO(4) symmetry); it disappears in every other atom."
  ]);

  d('y3-spin', [
    ["Angular momentum is defined by its commutation relations.", R`[\hat S_i, \hat S_j] = i\hbar\,\varepsilon_{ijk}\hat S_k`, "These follow from how rotations combine, and hold for spin as for orbital angular momentum."],
    ["The smallest non-trivial representation is two-dimensional.", R`\hat{\mathbf S} = \frac\hbar2\boldsymbol\sigma, \qquad \sigma_i\sigma_j = \delta_{ij} + i\varepsilon_{ijk}\sigma_k`, "The Pauli matrices satisfy the algebra. Each has eigenvalues ±1, so any spin component measures ±ħ/2: the two spots of Stern and Gerlach."],
    ["The total spin is fixed.", R`\hat S^2 = \frac{\hbar^2}{4}(\sigma_x^2 + \sigma_y^2 + \sigma_z^2) = \frac34\hbar^2 = s(s+1)\hbar^2, \quad s = \tfrac12`, "Each σ² is the identity."],
    ["A spin carries a magnetic moment, and so has an energy in a field B along z.", R`\boldsymbol\mu = -g\mu_B\frac{\hat{\mathbf S}}{\hbar}, \qquad \hat H = -\boldsymbol\mu\cdot\mathbf B = \omega\hat S_z, \quad \omega = \frac{g\mu_BB}{\hbar}`, "g ≈ 2 for the electron, twice the classical value."],
    ["Use the Heisenberg equation for the expectation values.", R`\frac{d\langle S_x\rangle}{dt} = \frac i\hbar\langle[\hat H, \hat S_x]\rangle = -\omega\langle S_y\rangle, \qquad \frac{d\langle S_y\rangle}{dt} = \omega\langle S_x\rangle`, "From the commutators. ⟨S⟩ precesses about the field at the Larmor frequency ω while ⟨S_z⟩ stays fixed."],
    ["Add a weak field rotating in the xy-plane at frequency ω_d, with detuning Δ = ω_d − ω and coupling Ω.", R`P_{\uparrow\to\downarrow}(t) = \frac{\Omega^2}{\Omega^2 + \Delta^2}\sin^2\!\left(\frac{\sqrt{\Omega^2 + \Delta^2}\;t}{2}\right)`, "In the frame rotating with the drive the spin sees a static effective field; it precesses about that. On resonance the flip is complete: the basis of magnetic resonance."]
  ], R`\hat{\mathbf S} = \frac\hbar2\boldsymbol\sigma, \qquad \omega = \frac{g\mu_BB}{\hbar}`, [
    "Spin has no classical model: a spin-½ state changes sign under a rotation by 2π and needs 4π to return to itself.",
    "The Rabi formula assumes a rotating field; a linearly oscillating one adds a small counter-rotating correction (the Bloch–Siegert shift)."
  ]);

  d('y3-dirac', [
    ["The eigenstates of a Hermitian operator form an orthonormal basis.", R`\hat A|n\rangle = a_n|n\rangle, \qquad \langle m|n\rangle = \delta_{mn}, \qquad \sum_n|n\rangle\langle n| = \hat 1`, "Hermitian operators have real eigenvalues and orthogonal eigenvectors that span the space (the spectral theorem)."],
    ["Insert the identity to expand any state.", R`|\psi\rangle = \sum_n|n\rangle\langle n|\psi\rangle`, "The numbers ⟨n|ψ⟩ are the components of |ψ⟩ along the basis vectors. A wavefunction is the special case ψ(x) = ⟨x|ψ⟩."],
    ["Measurement postulate: the possible results are the eigenvalues, with probabilities given by the squared components.", R`P(a_n) = |\langle n|\psi\rangle|^2`, "Normalisation ⟨ψ|ψ⟩ = 1 makes the probabilities add to 1."],
    ["The mean result is then a single matrix element.", R`\langle A\rangle = \sum_na_n|\langle n|\psi\rangle|^2 = \sum_n\langle\psi|\hat A|n\rangle\langle n|\psi\rangle = \langle\psi|\hat A|\psi\rangle`, "Use Â|n⟩ = a_n|n⟩ and remove the identity."],
    ["For a time-independent Hamiltonian the Schrödinger equation integrates to a unitary operator.", R`i\hbar\frac{d}{dt}|\psi\rangle = \hat H|\psi\rangle \;\Longrightarrow\; |\psi(t)\rangle = e^{-i\hat Ht/\hbar}|\psi(0)\rangle`, "Unitary because Ĥ is Hermitian, so the norm is preserved."],
    ["Move the time dependence from the states to the operators.", R`\hat A_H(t) = \hat U^\dagger\hat A\,\hat U \;\Longrightarrow\; \frac{d\hat A_H}{dt} = \frac i\hbar[\hat H, \hat A_H]`, "The Heisenberg picture: the same physics, and the form closest to classical mechanics."]
  ], R`|\psi\rangle = \sum_n\langle n|\psi\rangle\,|n\rangle, \qquad P(a_n) = |\langle n|\psi\rangle|^2, \qquad \hat U = e^{-i\hat Ht/\hbar}`, [
    "For continuous spectra (position, momentum) sums become integrals and the “eigenstates” are not normalisable.",
    "The postulates do not say what counts as a measurement; that question is still open."
  ]);

  d('y3-angular-momentum', [
    ["From the commutation relations, build raising and lowering operators.", R`\hat J_\pm = \hat J_x \pm i\hat J_y: \qquad [\hat J_z, \hat J_\pm] = \pm\hbar\hat J_\pm, \qquad [\hat J^2, \hat J_\pm] = 0`, "Directly from [J_i, J_j] = iħε_{ijk}J_k."],
    ["So J± changes m by one unit and leaves j alone.", R`\hat J_z\left(\hat J_\pm|j, m\rangle\right) = \hbar(m \pm 1)\,\hat J_\pm|j, m\rangle`, "Apply the first commutator to a simultaneous eigenstate of J² and J_z."],
    ["The norm of the new state must not be negative.", R`\left\|\hat J_\pm|j, m\rangle\right\|^2 = \langle j, m|\hat J^2 - \hat J_z^2 \mp \hbar\hat J_z|j, m\rangle = \hbar^2\left[j(j+1) - m(m \pm 1)\right] \ge 0`, "J∓J± = J² − J_z² ∓ ħJ_z, with the eigenvalue of J² written as ħ²j(j + 1)."],
    ["The ladder therefore stops at both ends.", R`m_{\max} = j, \quad m_{\min} = -j \;\Longrightarrow\; 2j \in \{0, 1, 2, \dots\}`, "The top and bottom must be an integer number of steps apart, so j is an integer or a half-integer."],
    ["Add two angular momenta. Count the product states by their total m.", R`|j_1 - j_2| \le j \le j_1 + j_2, \qquad \sum_j(2j + 1) = (2j_1 + 1)(2j_2 + 1)`, "The largest m is j₁ + j₂, occurring once, so the largest j is j₁ + j₂; each lower m gains one new state until j = |j₁ − j₂|. The count checks."]
  ], R`\hat J_\pm|j, m\rangle = \hbar\sqrt{j(j+1) - m(m \pm 1)}\,|j, m \pm 1\rangle, \qquad |j_1 - j_2| \le j \le j_1 + j_2`, [
    "Half-integer j is allowed by the algebra but not for orbital angular momentum, where single-valued wavefunctions force integer l.",
    "The coefficients of the change of basis are the Clebsch–Gordan coefficients, fixed up to a sign convention (Condon–Shortley)."
  ]);

  d('y3-entanglement', [
    ["Two spin-½ particles in the singlet state are measured along directions a and b. Quantum mechanics gives the correlation.", R`|\Psi^-\rangle = \tfrac{1}{\sqrt2}\left(|{\uparrow\downarrow}\rangle - |{\downarrow\uparrow}\rangle\right), \qquad E(\mathbf a, \mathbf b) = \langle(\boldsymbol\sigma\cdot\mathbf a)(\boldsymbol\sigma\cdot\mathbf b)\rangle = -\mathbf a\cdot\mathbf b`, "The singlet has total spin zero, so results along the same axis are always opposite."],
    ["Suppose instead each result is fixed in advance by a shared hidden variable λ, and does not depend on the distant setting.", R`A(\mathbf a, \lambda) = \pm1, \qquad B(\mathbf b, \lambda) = \pm1`, "This is the assumption of local realism."],
    ["For any λ, combine two settings on each side.", R`A(B - B') + A'(B + B') = \pm2`, "B and B′ are each ±1, so one of the brackets is zero and the other ±2."],
    ["Average over λ.", R`|S| \le 2, \qquad S = E(\mathbf a, \mathbf b) - E(\mathbf a, \mathbf b') + E(\mathbf a', \mathbf b) + E(\mathbf a', \mathbf b')`, "An average of numbers that are each ±2 lies between −2 and 2: the CHSH inequality."],
    ["Evaluate the quantum prediction with a = 0°, a′ = 90°, b = 45°, b′ = 135°.", R`S = -\tfrac{1}{\sqrt2} - \tfrac{1}{\sqrt2} - \tfrac{1}{\sqrt2} - \tfrac{1}{\sqrt2} = -2\sqrt2`, "E = −cos θ for each pair; the pair (a, b′) is 135° apart, the rest 45°. |S| = 2.83 > 2."]
  ], R`|S|_{\text{local}} \le 2, \qquad |S|_{\text{QM}} \le 2\sqrt2`, [
    "Experiments (Aspect 1982; loophole-free tests in 2015) find |S| > 2. What fails is the conjunction of locality and predetermined values, not signalling: the correlations cannot be used to send messages.",
    "The reduced state of either particle alone is completely mixed, ρ = ½·1: all the information is in the correlations."
  ]);

  d('y3-identical', [
    ["Swapping two identical particles cannot change any observable, so it can only multiply the state by a phase. Swapping twice returns the original.", R`\psi(2, 1) = \pm\psi(1, 2)`, "The exchange operator squares to 1, so its eigenvalues are ±1: bosons and fermions."],
    ["Build such states from two single-particle states a and b.", R`\psi_\pm = \tfrac{1}{\sqrt2}\left[\psi_a(1)\psi_b(2) \pm \psi_b(1)\psi_a(2)\right]`, "For fermions with a = b this vanishes: the Pauli exclusion principle."],
    ["Compute the mean square separation.", R`\langle(x_1 - x_2)^2\rangle_\pm = \langle x^2\rangle_a + \langle x^2\rangle_b - 2\langle x\rangle_a\langle x\rangle_b \mp 2|\langle x\rangle_{ab}|^2`, "The last term comes from the cross terms; ⟨x⟩_{ab} = ∫ψ_a* x ψ_b dx is non-zero only if the two wavefunctions overlap."],
    ["So symmetry alone moves particles.", R`\text{bosons: closer together}, \qquad \text{fermions: further apart}`, "No force is involved, yet it acts like an attraction or a repulsion: the exchange “interaction”."],
    ["In helium, add the electrons’ Coulomb repulsion as a perturbation.", R`\left\langle\frac{e^2}{4\pi\varepsilon_0r_{12}}\right\rangle_\pm = J \pm K`, "J is the direct integral and K the exchange integral, both positive. The spatially antisymmetric state, which goes with the spin triplet, keeps the electrons apart and lies lower by 2K."]
  ], R`\psi(2, 1) = \pm\psi(1, 2), \qquad E_\pm = E_0 + J \pm K`, [
    "Which sign applies is fixed by spin (integer: bosons; half-integer: fermions), a theorem of relativistic quantum field theory.",
    "In two dimensions more general exchange phases are possible (anyons), as in the fractional quantum Hall effect."
  ]);

  d('y3-fine-structure', [
    ["In the electron’s rest frame the orbiting proton makes a magnetic field that couples to the spin magnetic moment.", R`\hat H_{\text{so}} = \frac{e^2}{8\pi\varepsilon_0m^2c^2}\,\frac{\hat{\mathbf L}\cdot\hat{\mathbf S}}{r^3}`, "The factor 8 instead of 4 is the Thomas precession, from the electron’s frame being accelerated."],
    ["L and S are no longer separately conserved, but J = L + S is.", R`\hat{\mathbf L}\cdot\hat{\mathbf S} = \tfrac12\left(\hat J^2 - \hat L^2 - \hat S^2\right) = \frac{\hbar^2}{2}\left[j(j+1) - l(l+1) - s(s+1)\right]`, "Square J = L + S. The good quantum numbers are n, l, j, m_j."],
    ["Add the first relativistic correction to the kinetic energy and evaluate both to first order.", R`\hat H_{\text{rel}} = -\frac{\hat p^4}{8m^3c^2}; \qquad E_{nj} = -\frac{13.6\ \text{eV}}{n^2}\left[1 + \frac{\alpha^2}{n^2}\left(\frac{n}{j + \tfrac12} - \frac34\right)\right]`, "Using ⟨1/r³⟩ and ⟨p⁴⟩ for hydrogen. The two corrections separately depend on l; their sum depends only on j."],
    ["In a weak magnetic field the moment −(μ_B/ħ)(L + 2S) = −(μ_B/ħ)(J + S) is averaged along J.", R`\langle\hat{\mathbf S}\cdot\hat{\mathbf J}\rangle = \frac{\hbar^2}{2}\left[j(j+1) + s(s+1) - l(l+1)\right]`, "S precesses rapidly about J, so only its component along J survives. Square L = J − S."],
    ["This gives the Landé factor and the splitting.", R`g_J = 1 + \frac{j(j+1) + s(s+1) - l(l+1)}{2j(j+1)}, \qquad \Delta E = g_J\,\mu_BB\,m_j`, "Each level splits into 2j + 1 equally spaced sublevels: the anomalous Zeeman effect."]
  ], R`E_{nj} = -\frac{13.6\ \text{eV}}{n^2}\left[1 + \frac{\alpha^2}{n^2}\left(\frac{n}{j + \frac12} - \frac34\right)\right], \qquad \Delta E = g_J\mu_BBm_j`, [
    "Weak-field Zeeman only: when μ_B B exceeds the fine-structure splitting, L and S decouple (Paschen–Back).",
    "The Dirac equation gives the same E_{nj} exactly to this order but misses the Lamb shift, which needs QED."
  ]);

  d('y3-variational-wkb', [
    ["Expand any normalised trial state in the true energy eigenstates.", R`|\psi\rangle = \sum_nc_n|n\rangle \;\Longrightarrow\; \langle\psi|\hat H|\psi\rangle = \sum_n|c_n|^2E_n \ge E_0\sum_n|c_n|^2 = E_0`, "Every E_n is at least E₀. So any trial function gives an upper bound on the ground-state energy."],
    ["For helium, try a product of two hydrogen-like 1s orbitals with an adjustable charge Z.", R`\langle\hat H\rangle = \left(2Z^2 - \tfrac{27}{4}Z\right)\times13.6\ \text{eV}`, "Kinetic energy +2Z², attraction to the real nucleus −8Z, electron repulsion +(5/4)Z, in units of 13.6 eV."],
    ["Minimise with respect to Z.", R`Z_{\text{eff}} = \frac{27}{16} \;\Longrightarrow\; E \le -\left(\tfrac32\right)^6\!\times 6.8\ \text{eV} = -77.5\ \text{eV}`, "Each electron partly screens the nucleus from the other. The measured value is −79.0 eV."],
    ["For a slowly varying potential, write ψ = A e^{iφ/ħ} and keep the leading terms in ħ.", R`\psi \approx \frac{C}{\sqrt{p(x)}}\exp\!\left(\pm\frac i\hbar\int p\,dx\right), \qquad p(x) = \sqrt{2m(E - V)}`, "The phase advances at the local wavenumber p/ħ; the amplitude ∝ 1/√p because the particle spends less time where it moves fast."],
    ["Matching across the two turning points of a well quantises the phase.", R`\oint p\,dx = \left(n + \tfrac12\right)h`, "Each turning point contributes a phase loss of π/2 through the connection formulas."],
    ["Under a barrier p is imaginary and the wave decays.", R`T \approx \exp\!\left(-\frac2\hbar\int_{x_1}^{x_2}\sqrt{2m(V - E)}\,dx\right)`, "The basis of Gamow’s theory of alpha decay and of field emission."]
  ], R`E_0 \le \langle\psi|\hat H|\psi\rangle, \qquad \oint p\,dx = \left(n + \tfrac12\right)h, \qquad T \approx e^{-2\int\kappa\,dx}`, [
    "The variational method gives an upper bound with no estimate of the error, and a good energy does not guarantee a good wavefunction.",
    "WKB fails near turning points (where p → 0) and needs the de Broglie wavelength to change little over one wavelength."
  ]);

  d('y3-time-dependent', [
    ["Expand the state in eigenstates of H₀ with time-dependent coefficients.", R`|\psi(t)\rangle = \sum_nc_n(t)\,e^{-iE_nt/\hbar}|n\rangle \;\Longrightarrow\; i\hbar\,\dot c_f = \sum_nV_{fn}\,e^{i\omega_{fn}t}\,c_n`, "Substitute into the Schrödinger equation with H = H₀ + V(t). The free evolution has been factored out (interaction picture)."],
    ["Start in state i and work to first order in V.", R`c_f^{(1)}(t) = -\frac i\hbar\int_0^tV_{fi}\,e^{i\omega_{fi}t'}\,dt'`, "Put c_n = δ_{ni} on the right-hand side."],
    ["For a perturbation switched on at t = 0 and constant after:", R`|c_f|^2 = \frac{4|V_{fi}|^2}{\hbar^2}\,\frac{\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}`, "A peak of height ∝ t² and width ∝ 1/t centred on energy conservation."],
    ["Sum over a continuum of final states with density ρ(E).", R`P(t) = \int|c_f|^2\rho(E_f)\,dE_f \approx \frac{2\pi}{\hbar}|V_{fi}|^2\rho(E_f)\,t`, "The peak is narrow, so take |V|²ρ outside, with ∫sin²(ωt/2)/ω² dω = πt/2 and dE = ħ dω."],
    ["The probability grows linearly, so there is a constant rate.", R`\Gamma = \frac{2\pi}{\hbar}|V_{fi}|^2\rho(E_f)`, "Fermi’s golden rule."]
  ], R`\Gamma = \frac{2\pi}{\hbar}|V_{fi}|^2\rho(E_f)`, [
    "Valid for times long enough for the peak to be narrower than the range over which |V|²ρ varies, but short enough that the initial state is hardly depleted.",
    "For electric-dipole radiation V_{fi} ∝ ⟨f|r|i⟩, which gives the selection rules Δl = ±1, Δm = 0, ±1."
  ]);

  d('y3-scattering', [
    ["Far from the target the wavefunction is an incident plane wave plus an outgoing spherical wave.", R`\psi \to e^{ikz} + f(\theta)\,\frac{e^{ikr}}{r}`, "The 1/r keeps the outgoing flux through a sphere constant."],
    ["Compare the scattered flux into dΩ with the incident flux.", R`\frac{d\sigma}{d\Omega} = |f(\theta)|^2`, "Incident flux ħk/m; scattered flux (ħk/m)|f|²/r² through area r²dΩ."],
    ["To first order in the potential, f is its Fourier transform at the momentum transfer.", R`f_{\text{Born}} = -\frac{m}{2\pi\hbar^2}\int e^{-i\mathbf q\cdot\mathbf r}\,V(\mathbf r)\,d^3r, \qquad q = 2k\sin\frac\theta2`, "The Born approximation: the wave inside the potential is taken to be the undisturbed plane wave."],
    ["Apply it to a screened Coulomb potential and let the screening length go to infinity.", R`V = \frac{Z_1Z_2e^2}{4\pi\varepsilon_0}\frac{e^{-\mu r}}{r} \;\Longrightarrow\; f = -\frac{2m}{\hbar^2}\cdot\frac{Z_1Z_2e^2}{4\pi\varepsilon_0}\cdot\frac{1}{q^2 + \mu^2}\ \xrightarrow{\ \mu\to0\ }\ -\frac{Z_1Z_2e^2}{16\pi\varepsilon_0E\sin^2(\theta/2)}`, "The Fourier transform of e^{−μr}/r is 4π/(q² + μ²). Then use ħ²q² = 8mE sin²(θ/2)."],
    ["Square it.", R`\frac{d\sigma}{d\Omega} = \left(\frac{Z_1Z_2e^2}{16\pi\varepsilon_0E}\right)^2\frac{1}{\sin^4(\theta/2)}`, "The Rutherford formula, identical to the classical result."]
  ], R`\frac{d\sigma}{d\Omega} = |f|^2, \qquad f_{\text{Born}} = -\frac{m}{2\pi\hbar^2}\tilde V(\mathbf q)`, [
    "The Born approximation needs a weak potential or high energy. That it reproduces Rutherford exactly is a special property of the Coulomb potential.",
    "At low energy use partial waves instead: σ = (4π/k²)Σ(2l + 1)sin²δ_l, and the optical theorem σ_{tot} = (4π/k) Im f(0) expresses conservation of probability."
  ]);

  d('y3-landau', [
    ["An electron moves in the xy-plane in a field B along z. Choose the Landau gauge.", R`\mathbf A = (0, Bx, 0), \qquad \hat H = \frac{1}{2m}\left[\hat p_x^2 + (\hat p_y + eBx)^2\right]`, "Minimal coupling p → p + eA for charge −e. ∇ × A = B ẑ."],
    ["Nothing depends on y, so p_y is conserved.", R`\psi = e^{ik_yy}\phi(x) \;\Longrightarrow\; \hat H = \frac{\hat p_x^2}{2m} + \tfrac12m\omega_c^2(x - x_0)^2, \qquad \omega_c = \frac{eB}{m},\ x_0 = -\frac{\hbar k_y}{eB}`, "A harmonic oscillator in x, centred at a position set by k_y."],
    ["The energies are oscillator levels and do not depend on k_y.", R`E_n = \hbar\omega_c\left(n + \tfrac12\right)`, "Landau levels: classical cyclotron motion, quantised."],
    ["Count the states in one level for a sample of size L_x × L_y.", R`k_y = \frac{2\pi j}{L_y}, \quad 0 \le x_0 \le L_x \;\Longrightarrow\; N = \frac{eBL_xL_y}{h} = \frac{\Phi}{\Phi_0}, \qquad \Phi_0 = \frac he`, "Periodic boundary conditions in y; the centre must lie inside the sample. One state per flux quantum."],
    ["With ν levels exactly filled, the electron density is fixed by B, and so is the Hall resistance.", R`n_s = \nu\frac{eB}{h} \;\Longrightarrow\; R_{xy} = \frac{B}{n_se} = \frac{h}{\nu e^2}`, "The classical Hall resistance B/n_s e, evaluated at integer filling."]
  ], R`E_n = \hbar\omega_c\left(n + \tfrac12\right), \qquad N = \frac{\Phi}{\Phi_0}, \qquad R_{xy} = \frac{h}{\nu e^2}`, [
    "This explains the values of the plateaus, not why they are flat: the plateaus need disorder, which localises the states between Landau levels.",
    "h/e² = 25 812.807 Ω is reproduced to parts in 10⁹ whatever the sample, and now defines the ohm. Fractional ν needs electron–electron interactions."
  ]);

  d('y3-nuclear-particle', [
    ["Nuclei have roughly constant density, so their volume is proportional to A.", R`R = r_0A^{1/3}, \qquad r_0 \approx 1.2\ \text{fm}`, "From electron scattering. The nuclear force is short-ranged and saturates, like the force between molecules in a liquid drop."],
    ["Each nucleon binds to its neighbours, but those at the surface have fewer.", R`B \supset a_vA - a_sA^{2/3}`, "Volume ∝ A and surface area ∝ R² ∝ A^{2/3}."],
    ["Protons repel one another.", R`B \supset -a_c\frac{Z^2}{A^{1/3}}, \qquad \text{from}\ \ \frac35\frac{Z^2e^2}{4\pi\varepsilon_0R}`, "The electrostatic energy of a uniformly charged sphere."],
    ["The Pauli principle favours equal numbers of protons and neutrons.", R`B = a_vA - a_sA^{2/3} - a_c\frac{Z^2}{A^{1/3}} - a_a\frac{(A - 2Z)^2}{A} \pm \delta`, "Extra neutrons must go into higher levels. δ is the pairing term. This is the semi-empirical mass formula."],
    ["For fixed A, the most stable Z maximises B.", R`\frac{\partial B}{\partial Z} = 0 \;\Longrightarrow\; Z = \frac{A/2}{1 + \dfrac{a_c}{4a_a}A^{2/3}} \approx \frac{A}{2 + 0.015A^{2/3}}`, "With a_c ≈ 0.71 MeV and a_a ≈ 23 MeV. Light nuclei have Z ≈ A/2; heavy ones need extra neutrons to dilute the Coulomb repulsion."]
  ], R`B = a_vA - a_sA^{2/3} - a_c\frac{Z^2}{A^{1/3}} - a_a\frac{(A - 2Z)^2}{A} \pm \delta`, [
    "A smooth average: it misses the extra binding at the magic numbers 2, 8, 20, 28, 50, 82, 126, which the shell model explains.",
    "Unreliable for the lightest nuclei, where there is no well-defined surface."
  ]);

  d('y3-solids', [
    ["A chain of identical atoms of mass m joined by springs K, spacing a. Write Newton’s law for atom n.", R`m\ddot u_n = K(u_{n+1} - u_n) - K(u_n - u_{n-1})`, "Each atom is pulled by its two neighbours."],
    ["Try a travelling wave.", R`u_n = e^{i(kna - \omega t)} \;\Longrightarrow\; -m\omega^2 = K\left(e^{ika} + e^{-ika} - 2\right) = -4K\sin^2\frac{ka}{2}`, "The lattice is periodic, so solutions are labelled by a wavenumber k."],
    ["Solve for the dispersion relation.", R`\omega = 2\sqrt{\frac Km}\left|\sin\frac{ka}{2}\right|`, "Periodic in k with period 2π/a: only the first Brillouin zone, −π/a < k ≤ π/a, is distinct."],
    ["At long wavelength this is ordinary sound.", R`ka \ll 1: \quad \omega \approx a\sqrt{\frac Km}\;k \;\Longrightarrow\; v_s = a\sqrt{\frac Km}`, "sin x ≈ x. At the zone boundary the group velocity vanishes: a standing wave."],
    ["For an electron in a periodic potential, translation by a commutes with the Hamiltonian.", R`\psi(x + a) = e^{ika}\psi(x) \;\Longrightarrow\; \psi_k(x) = e^{ikx}u_k(x), \quad u_k(x + a) = u_k(x)`, "Bloch’s theorem: eigenstates of the translation operator differ from site to site only by a phase."],
    ["At k = ±π/a two plane waves are degenerate and the lattice potential mixes them.", R`E_\pm = \frac{\hbar^2}{2m}\left(\frac\pi a\right)^2 \pm |V_G|, \qquad \text{gap} = 2|V_G|`, "Degenerate perturbation theory with the Fourier component V_G, G = 2π/a. The two standing waves pile charge on the ions or between them."]
  ], R`\omega = 2\sqrt{\frac Km}\left|\sin\frac{ka}{2}\right|, \qquad \psi_k = e^{ikx}u_k(x), \qquad E_{\text{gap}} = 2|V_G|`, [
    "Harmonic forces only; anharmonic terms give thermal expansion and finite thermal conductivity.",
    "Independent electrons: band theory wrongly predicts that some insulators (Mott insulators) are metals."
  ]);

  d('y3-semiconductors', [
    ["In a non-degenerate semiconductor the carrier densities follow Boltzmann factors measured from the band edges.", R`n = N_c\,e^{-(E_c - \mu)/kT}, \qquad p = N_v\,e^{-(\mu - E_v)/kT}`, "The Fermi function reduces to an exponential when μ is several kT inside the gap. N_c and N_v are effective densities of states."],
    ["Multiply them.", R`np = N_cN_v\,e^{-E_g/kT} = n_i^2`, "The chemical potential cancels, so the product does not depend on doping: the law of mass action."],
    ["In a pure crystal n = p.", R`n_i = \sqrt{N_cN_v}\;e^{-E_g/2kT}`, "The factor of 2 in the exponent is why conductivity rises so steeply with temperature."],
    ["Join p-type and n-type material. In equilibrium μ is level throughout, so the bands must bend.", R`eV_{\text{bi}} = kT\ln\frac{n_n}{n_p} = kT\ln\frac{N_aN_d}{n_i^2}`, "n_n = N_d on the n side and n_p = n_i²/N_a on the p side; their ratio is a Boltzmann factor across the built-in potential."],
    ["A forward bias V lowers the barrier, multiplying the diffusion current by a Boltzmann factor; the opposing drift current is unchanged.", R`I = I_s\left(e^{eV/kT} - 1\right)`, "At V = 0 the two cancel. Reverse bias leaves only the small saturation current."]
  ], R`np = n_i^2, \qquad V_{\text{bi}} = \frac{kT}{e}\ln\frac{N_aN_d}{n_i^2}, \qquad I = I_s\left(e^{eV/kT} - 1\right)`, [
    "Non-degenerate doping, full ionisation of dopants, and no recombination in the depletion region (real diodes have an ideality factor between 1 and 2).",
    "Drift and diffusion are linked by the Einstein relation D = μkT/e."
  ]);

  d('y3-fluid-dynamics', [
    ["Apply Newton’s second law to a small parcel of fluid. Its acceleration is the rate of change following the motion.", R`\frac{D\mathbf u}{Dt} = \frac{\partial\mathbf u}{\partial t} + (\mathbf u\cdot\nabla)\mathbf u`, "The velocity at the parcel changes both because the field changes in time and because the parcel moves to a place where the velocity is different."],
    ["The forces per unit volume are the pressure gradient, viscous stress and body forces.", R`\rho\frac{D\mathbf u}{Dt} = -\nabla p + \mu\nabla^2\mathbf u + \mathbf f, \qquad \nabla\cdot\mathbf u = 0`, "Navier–Stokes for an incompressible Newtonian fluid, with mass conservation."],
    ["Measure lengths in L, speeds in U, times in L/U and pressures in ρU².", R`\frac{D\mathbf u'}{Dt'} = -\nabla'p' + \frac{1}{\mathrm{Re}}\nabla'^2\mathbf u', \qquad \mathrm{Re} = \frac{\rho UL}{\mu}`, "One dimensionless number remains. Flows with the same geometry and the same Re are the same flow."],
    ["Steady flow along a pipe of radius R has only an axial velocity u(r), so the nonlinear term vanishes.", R`\frac\mu r\frac{d}{dr}\!\left(r\frac{du}{dr}\right) = -\frac{\Delta p}{L} \;\Longrightarrow\; u = \frac{\Delta p}{4\mu L}\left(R^2 - r^2\right)`, "Integrate twice, with u finite on the axis and zero at the wall (no slip)."],
    ["Integrate the profile over the cross-section.", R`Q = \int_0^Ru\,2\pi r\,dr = \frac{\pi R^4\,\Delta p}{8\mu L}`, "Poiseuille’s law: halving the radius cuts the flow sixteen-fold."]
  ], R`\rho\frac{D\mathbf u}{Dt} = -\nabla p + \mu\nabla^2\mathbf u + \mathbf f, \qquad \mathrm{Re} = \frac{\rho UL}{\mu}`, [
    "Laminar pipe flow becomes turbulent above Re ≈ 2000–4000, and then no exact solution is known.",
    "Whether smooth solutions of the 3D equations always exist is an open Millennium Prize problem. In fully developed turbulence the energy spectrum follows Kolmogorov’s E(k) ∝ ε^{2/3}k^{−5/3}."
  ]);
})();
/* ---- derive-5.js ---- */
/* Geodesic — derivations for notes-only topics: university physics, Year 4. Natural units (ħ = c = 1) where stated. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('y4-chaos', [
    ["Take the logistic map and find its fixed points.", R`x_{n+1} = f(x_n) = r\,x_n(1 - x_n): \qquad x^* = 0 \quad\text{or}\quad x^* = 1 - \frac1r`, "A fixed point satisfies x* = f(x*)."],
    ["A small deviation from a fixed point is multiplied by f′(x*) at each step.", R`\delta_{n+1} \approx f'(x^*)\,\delta_n, \qquad f'(x) = r(1 - 2x)`, "Linearise the map about x*. The fixed point is stable if |f′(x*)| < 1."],
    ["Apply this to the non-zero fixed point.", R`f'\!\left(1 - \tfrac1r\right) = 2 - r \;\Longrightarrow\; \text{stable for } 1 < r < 3`, "At r = 3 the multiplier reaches −1: deviations flip sign each step and stop decaying."],
    ["Beyond r = 3 a 2-cycle is born, then a 4-cycle, and so on, at values r_k that accumulate geometrically.", R`\lim_{k\to\infty}\frac{r_k - r_{k-1}}{r_{k+1} - r_k} = \delta = 4.6692\ldots, \qquad r_\infty \approx 3.5699`, "Feigenbaum’s constant is the same for every smooth map with a single quadratic maximum."],
    ["Past r_{∞} nearby orbits separate exponentially on average.", R`\lambda = \lim_{N\to\infty}\frac1N\sum_{n=0}^{N-1}\ln|f'(x_n)| > 0`, "The Lyapunov exponent is the average logarithm of the stretching per step. Positive λ is the working definition of chaos."],
    ["In the Lorenz flow, phase-space volumes shrink at a constant rate.", R`\nabla\cdot\mathbf f = -(\sigma + 1 + \beta) < 0`, "So the attractor has zero volume. It can still stretch in one direction while contracting in others, which gives a fractal: a strange attractor."]
  ], R`|f'(x^*)| < 1 \ \text{(stable)}; \qquad \delta = 4.6692\ldots; \qquad \text{chaos: } \lambda > 0`, [
    "Deterministic but not predictable: an initial error δ₀ grows as δ₀e^{λt}, so each extra digit of precision buys only a fixed extra time.",
    "Chaos in a continuous flow needs at least three dimensions; discrete maps can be chaotic in one."
  ]);

  d('y4-gauge', [
    ["The Dirac Lagrangian is unchanged if the field is multiplied by a constant phase.", R`\mathcal L = \bar\psi(i\gamma^\mu\partial_\mu - m)\psi, \qquad \psi \to e^{i\alpha}\psi`, "A global U(1) symmetry; by Noether’s theorem it gives a conserved current, the electric current."],
    ["Let the phase depend on position. The derivative produces an extra term.", R`\partial_\mu\!\left(e^{i\alpha(x)}\psi\right) = e^{i\alpha(x)}\left(\partial_\mu + i\,\partial_\mu\alpha\right)\psi`, "The Lagrangian is no longer invariant: comparing the field at neighbouring points now depends on a convention."],
    ["Introduce a field that absorbs the extra term.", R`D_\mu = \partial_\mu + iqA_\mu, \qquad A_\mu \to A_\mu - \frac1q\partial_\mu\alpha \;\Longrightarrow\; D_\mu\psi \to e^{i\alpha(x)}D_\mu\psi`, "The connection A_μ tells us how to compare phases at different points. Replacing ∂ by D restores the symmetry and fixes how matter couples to A."],
    ["A itself needs dynamics. The commutator of two covariant derivatives is gauge invariant.", R`[D_\mu, D_\nu] = iqF_{\mu\nu}, \qquad F_{\mu\nu} = \partial_\mu A_\nu - \partial_\nu A_\mu`, "The shift of A by a gradient cancels in F. This is the electromagnetic field tensor."],
    ["The simplest invariant Lagrangian is Maxwell’s. A mass term is forbidden.", R`\mathcal L = \bar\psi(i\gamma^\mu D_\mu - m)\psi - \tfrac14F_{\mu\nu}F^{\mu\nu}, \qquad \tfrac12m_A^2A_\mu A^\mu \ \text{not invariant}`, "Demanding local phase symmetry produces electrodynamics and a massless photon."],
    ["For a non-commuting group the same construction gives fields that interact with themselves.", R`F^a_{\mu\nu} = \partial_\mu A^a_\nu - \partial_\nu A^a_\mu + g f^{abc}A^b_\mu A^c_\nu`, "The extra term comes from the commutator of the group generators. Yang–Mills theory: gluons carry colour, photons carry no charge."]
  ], R`D_\mu = \partial_\mu + iqA_\mu, \qquad A_\mu \to A_\mu - \frac1q\partial_\mu\alpha, \qquad F_{\mu\nu} = \partial_\mu A_\nu - \partial_\nu A_\mu`, [
    "Gauge “symmetry” is a redundancy of description, not a symmetry of states; only gauge-invariant quantities are observable.",
    "The potential is nevertheless physical: a charge circling a solenoid acquires the phase qΦ/ħ where the field is zero (Aharonov–Bohm)."
  ]);

  d('y4-ising', [
    ["Spins s_i = ±1 on a lattice with z nearest neighbours each.", R`H = -J\sum_{\langle ij\rangle}s_is_j - h\sum_is_i`, "J > 0 favours alignment; h is an external field."],
    ["Replace the neighbours of each spin by their average value m.", R`H_{\text{mf}} = -(zJm + h)\sum_is_i`, "The mean-field approximation: fluctuations of the neighbours are ignored."],
    ["A single spin in this effective field has a Boltzmann average.", R`m = \langle s\rangle = \frac{e^{\beta(zJm + h)} - e^{-\beta(zJm + h)}}{e^{\beta(zJm + h)} + e^{-\beta(zJm + h)}} = \tanh\!\left[\beta(zJm + h)\right]`, "The average must equal the m we assumed: a self-consistency equation."],
    ["Set h = 0 and expand for small m.", R`m = \beta zJ\,m - \tfrac13(\beta zJ)^3m^3 + \dots`, "tanh x = x − x³/3 + …"],
    ["A non-zero solution exists only if the slope at the origin exceeds 1.", R`\beta zJ > 1 \;\Longrightarrow\; kT_c = zJ`, "Below T_c the lattice magnetises spontaneously, choosing a direction by itself."],
    ["Just below T_c:", R`m^2 \approx 3\,\frac{T_c - T}{T_c} \;\Longrightarrow\; m \propto (T_c - T)^{1/2}`, "Divide the expansion by m and solve. The order parameter exponent is β = ½."]
  ], R`m = \tanh\!\left[\beta(zJm + h)\right], \qquad kT_c = zJ, \qquad \beta_{\text{mf}} = \tfrac12`, [
    "Mean-field theory overestimates order. In 1D there is no transition at any T > 0; in 2D the exact T_c is 2.269 J/k (not 4J/k) and the exponent is 1/8.",
    "Its exponents become exact above four dimensions; the theory itself is exact only for infinitely long-ranged interactions."
  ]);

  d('y4-perturbation', [
    ["Write the Hamiltonian as a solved part plus a small correction, and expand in powers of λ.", R`(H_0 + \lambda H')|n\rangle = E_n|n\rangle, \qquad E_n = E_n^0 + \lambda E_n^1 + \lambda^2E_n^2 + \dots, \quad |n\rangle = |n^0\rangle + \lambda|n^1\rangle + \dots`, "λ is a book-keeping parameter, set to 1 at the end."],
    ["Collect the terms of first order in λ.", R`(H_0 - E_n^0)|n^1\rangle = (E_n^1 - H')|n^0\rangle`, "The zeroth-order terms cancel by definition of the unperturbed state."],
    ["Project onto ⟨n⁰|.", R`E_n^1 = \langle n^0|H'|n^0\rangle`, "The left side vanishes because H₀ is Hermitian. The first-order shift is the average of the perturbation in the unperturbed state."],
    ["Project onto a different unperturbed state ⟨m⁰|.", R`\langle m^0|n^1\rangle = \frac{H'_{mn}}{E_n^0 - E_m^0} \qquad (m \ne n)`, "This gives the first-order admixture of other states."],
    ["Use it in the second-order equation.", R`E_n^2 = \langle n^0|H'|n^1\rangle = \sum_{m\ne n}\frac{|H'_{mn}|^2}{E_n^0 - E_m^0}`, "For the ground state every denominator is negative, so the second-order shift always lowers the energy."]
  ], R`E_n^1 = \langle n^0|H'|n^0\rangle, \qquad E_n^2 = \sum_{m\ne n}\frac{|H'_{mn}|^2}{E_n^0 - E_m^0}`, [
    "Needs |H′_{mn}| ≪ |E_n⁰ − E_m⁰|. With degenerate levels, first diagonalise H′ within the degenerate subspace.",
    "The series is often only asymptotic: it improves for a few terms and then diverges, as in the Stark effect and in QED."
  ]);

  d('y4-schwarzschild', [
    ["Outside a spherical mass the vacuum Einstein equations have a unique solution.", R`ds^2 = \left(1 - \frac{r_s}{r}\right)c^2dt^2 - \frac{dr^2}{1 - r_s/r} - r^2d\Omega^2, \qquad r_s = \frac{2GM}{c^2}`, "Birkhoff’s theorem. The constant is fixed by matching to Newtonian gravity far away."],
    ["A clock at rest at radius r has dr = dΩ = 0.", R`d\tau = \sqrt{1 - \frac{r_s}{r}}\;dt`, "Proper time is ds/c along the clock’s path. Clocks deeper in the field run slow, and light climbing out is redshifted by the same factor."],
    ["The metric does not depend on t or φ, so a freely falling body conserves energy and angular momentum per unit mass. The radial motion is then one-dimensional.", R`\left(\frac{dr}{d\tau}\right)^2 = \frac{E^2}{c^2} - \left(1 - \frac{r_s}{r}\right)\left(c^2 + \frac{L^2}{r^2}\right)`, "From the normalisation u·u = c² of the four-velocity. The second term is an effective potential."],
    ["Circular orbits sit at the extrema of the effective potential.", R`r = \frac{L^2}{r_sc^2}\left[1 \pm \sqrt{1 - \frac{3r_s^2c^2}{L^2}}\right]`, "Set the derivative to zero: a quadratic in r. The extra −r_s L²/r³ term, absent in Newtonian gravity, is what limits the orbits."],
    ["They exist only if L² ≥ 3r_s²c². The limiting case is the innermost stable circular orbit.", R`r_{\text{ISCO}} = 3r_s = \frac{6GM}{c^2}`, "When the square root vanishes the stable and unstable orbits merge. Inside this radius matter plunges in."],
    ["For light the potential is (1 − r_s/r)L²/r², which has a maximum.", R`r_{\text{ph}} = \tfrac32r_s, \qquad b_{\text{crit}} = \sqrt{27}\,\frac{GM}{c^2}`, "Light with impact parameter below b_{crit} is captured: this is the radius of the black hole’s shadow."]
  ], R`r_s = \frac{2GM}{c^2}, \qquad r_{\text{ISCO}} = 3r_s, \qquad b_{\text{shadow}} = \sqrt{27}\,\frac{GM}{c^2}`, [
    "Non-rotating, uncharged mass. Real black holes spin (Kerr), which moves the ISCO in as far as GM/c² for co-rotating orbits.",
    "r = r_s is a coordinate singularity only; quantum effects add Hawking radiation at T = ħc³/8πGMk, negligible for stellar masses."
  ]);

  d('y4-classical-fields', [
    ["The action of a field is the spacetime integral of a Lagrangian density.", R`S = \int\mathcal L(\phi, \partial_\mu\phi)\,d^4x`, "Locality: L at a point depends only on the field and its derivatives there."],
    ["Vary the field and integrate by parts.", R`\delta S = \int\left[\frac{\partial\mathcal L}{\partial\phi} - \partial_\mu\frac{\partial\mathcal L}{\partial(\partial_\mu\phi)}\right]\delta\phi\;d^4x`, "The boundary term vanishes because δφ is zero at the edges."],
    ["Demand δS = 0 for every variation.", R`\partial_\mu\frac{\partial\mathcal L}{\partial(\partial_\mu\phi)} = \frac{\partial\mathcal L}{\partial\phi}`, "The Euler–Lagrange equation for fields."],
    ["Example: a free scalar field.", R`\mathcal L = \tfrac12\partial_\mu\phi\,\partial^\mu\phi - \tfrac12m^2\phi^2 \;\Longrightarrow\; (\Box + m^2)\phi = 0`, "The Klein–Gordon equation, in units with ħ = c = 1."],
    ["If a continuous change δφ leaves L unchanged, use the field equation in δL = 0.", R`0 = \delta\mathcal L = \partial_\mu\!\left(\frac{\partial\mathcal L}{\partial(\partial_\mu\phi)}\,\delta\phi\right) \;\Longrightarrow\; \partial_\mu j^\mu = 0`, "Noether’s theorem for fields: every continuous symmetry gives a conserved current."],
    ["Translation invariance gives four currents, one for each direction.", R`T^{\mu\nu} = \frac{\partial\mathcal L}{\partial(\partial_\mu\phi)}\,\partial^\nu\phi - \eta^{\mu\nu}\mathcal L, \qquad \partial_\mu T^{\mu\nu} = 0`, "The stress–energy tensor: T⁰⁰ is the energy density and T⁰ⁱ the momentum density."]
  ], R`\partial_\mu\frac{\partial\mathcal L}{\partial(\partial_\mu\phi)} = \frac{\partial\mathcal L}{\partial\phi}, \qquad \partial_\mu j^\mu = 0, \qquad \partial_\mu T^{\mu\nu} = 0`, [
    "The canonical T^{μν} need not be symmetric; for gauge fields it must be improved (Belinfante) to give the tensor that sources gravity.",
    "If L changes by a total divergence the symmetry still holds, and the current acquires an extra term."
  ]);

  d('y4-quantised-field', [
    ["Put a free scalar field in a box and expand it in plane waves.", R`\phi(\mathbf x, t) = \frac{1}{\sqrt V}\sum_{\mathbf k}q_{\mathbf k}(t)\,e^{i\mathbf k\cdot\mathbf x}`, "The field equation is linear, so its Fourier modes do not couple."],
    ["Insert into the Klein–Gordon equation.", R`\ddot q_{\mathbf k} + \omega_k^2\,q_{\mathbf k} = 0, \qquad \omega_k = \sqrt{k^2 + m^2}`, "Each mode is a harmonic oscillator. The field is an infinite set of them."],
    ["Quantise each oscillator in the usual way.", R`[a_{\mathbf k}, a^\dagger_{\mathbf k'}] = \delta_{\mathbf k\mathbf k'}, \qquad H = \sum_{\mathbf k}\omega_k\left(a^\dagger_{\mathbf k}a_{\mathbf k} + \tfrac12\right)`, "Ladder operators for every mode."],
    ["Read off the states.", R`a^\dagger_{\mathbf k}|0\rangle: \quad E = \omega_k = \sqrt{k^2 + m^2}, \quad \mathbf p = \mathbf k`, "One quantum of mode k has exactly the energy and momentum of a relativistic particle of mass m. Particles are excitations of the field; n_k counts them."],
    ["Operators for different modes commute, so the states are symmetric under exchange.", R`a^\dagger_{\mathbf k}a^\dagger_{\mathbf k'}|0\rangle = a^\dagger_{\mathbf k'}a^\dagger_{\mathbf k}|0\rangle`, "Bose statistics come out automatically. Fermions need anticommutators, {b, b†} = 1."],
    ["The vacuum energy is infinite, but its dependence on boundaries is finite and measurable.", R`E_0 = \sum_{\mathbf k}\tfrac12\omega_k \to \infty, \qquad \frac FA = -\frac{\pi^2\hbar c}{240\,d^4}`, "Only energy differences matter without gravity. Two conducting plates a distance d apart change the allowed modes and attract: the Casimir effect."]
  ], R`H = \sum_{\mathbf k}\omega_k\left(a^\dagger_{\mathbf k}a_{\mathbf k} + \tfrac12\right), \qquad \omega_k = \sqrt{k^2 + m^2}`, [
    "Free field only: with interactions the particle number is no longer conserved and the vacuum is not the simple state |0⟩.",
    "The zero-point energy would gravitate. Its naive size exceeds the observed dark energy by roughly 120 orders of magnitude, an unsolved problem."
  ]);

  d('y4-feynman', [
    ["The lowest-order amplitude for e⁺e⁻ → μ⁺μ⁻ has one photon exchanged. Apply the Feynman rules.", R`i\mathcal M = \left[\bar v(p_2)(-ie\gamma^\mu)u(p_1)\right]\frac{-ig_{\mu\nu}}{s}\left[\bar u(k_1)(-ie\gamma^\nu)v(k_2)\right]`, "A vertex factor −ieγ^μ for each vertex, the photon propagator −ig_{μν}/q² with q² = s, and spinors for the external lines."],
    ["Square it, average over the incoming spins and sum over the outgoing ones. In the high-energy limit:", R`\overline{|\mathcal M|^2} = \frac{2e^4(t^2 + u^2)}{s^2}`, "The spin sums become traces of gamma matrices. Masses are neglected, valid for √s ≫ m_μ."],
    ["Express t and u through the scattering angle in the centre-of-mass frame.", R`t = -\frac s2(1 - \cos\theta), \quad u = -\frac s2(1 + \cos\theta) \;\Longrightarrow\; \overline{|\mathcal M|^2} = e^4(1 + \cos^2\theta)`, "For massless particles s + t + u = 0."],
    ["Convert to a cross-section.", R`\frac{d\sigma}{d\Omega} = \frac{\overline{|\mathcal M|^2}}{64\pi^2s} = \frac{\alpha^2}{4s}(1 + \cos^2\theta)`, "Two-body phase space and the flux factor, with α = e²/4π."],
    ["Integrate over angles.", R`\sigma = \frac{\alpha^2}{4s}\cdot\frac{16\pi}{3} = \frac{4\pi\alpha^2}{3s}`, "∫(1 + cos²θ)dΩ = 16π/3. In everyday units, 86.9 nb divided by s in GeV²."]
  ], R`\frac{d\sigma}{d\Omega} = \frac{\alpha^2}{4s}(1 + \cos^2\theta), \qquad \sigma = \frac{4\pi\alpha^2}{3s}`, [
    "Photon exchange only: near √s = 91 GeV the Z boson dominates and adds a forward–backward asymmetry.",
    "Replacing the muons by quarks multiplies σ by N_c Q_q²; the measured ratio R = N_c ΣQ_q² was direct evidence for three colours."
  ]);

  d('y4-qed', [
    ["Dirac looked for an equation of first order in time whose square reproduces the relativistic energy.", R`i\,\partial_t\psi = \left(\boldsymbol\alpha\cdot\hat{\mathbf p} + \beta m\right)\psi, \qquad \text{requiring}\quad E^2 = p^2 + m^2`, "First order in time keeps the probability density positive, unlike the Klein–Gordon equation."],
    ["Square the operator and compare.", R`\alpha_i\alpha_j + \alpha_j\alpha_i = 2\delta_{ij}, \qquad \alpha_i\beta + \beta\alpha_i = 0, \qquad \beta^2 = 1`, "The cross terms must cancel and the squares must be 1. No ordinary numbers do this."],
    ["Four anticommuting objects that square to 1 need matrices of size at least 4 × 4. In covariant form:", R`(i\gamma^\mu\partial_\mu - m)\psi = 0, \qquad \{\gamma^\mu, \gamma^\nu\} = 2g^{\mu\nu}`, "With γ⁰ = β and γⁱ = βαᵢ. The wavefunction has four components."],
    ["Plane-wave solutions come in two pairs.", R`E = \pm\sqrt{p^2 + m^2}`, "Two spin states for each sign. The negative-energy solutions describe a particle of the same mass and opposite charge: the positron."],
    ["Couple to electromagnetism by p → π = p − qA and take the non-relativistic limit.", R`H \approx \frac{(\boldsymbol\sigma\cdot\boldsymbol\pi)^2}{2m} = \frac{\pi^2}{2m} - \frac{q}{m}\,\mathbf S\cdot\mathbf B \;\Longrightarrow\; g = 2`, "(σ·π)² = π² − qσ·B because the components of π do not commute. The magnetic moment is g(q/2m)S with g = 2, not the classical 1."],
    ["Quantum corrections shift g slightly.", R`a_e = \frac{g - 2}{2} = \frac{\alpha}{2\pi} + \dots = 0.001\,159\,652\ldots`, "Schwinger’s one-loop term. Theory and experiment agree to about one part in 10¹²."]
  ], R`(i\gamma^\mu\partial_\mu - m)\psi = 0, \qquad \{\gamma^\mu, \gamma^\nu\} = 2g^{\mu\nu}, \qquad g = 2 + \frac\alpha\pi + \dots`, [
    "As a single-particle wave equation it is inconsistent (the Klein paradox, the negative-energy sea); it must be read as an equation for a quantum field.",
    "For the muon, the measured g − 2 has been compared with theory at the level of 10⁻¹⁰; whether they disagree depends on the hadronic contribution, still under study."
  ]);

  d('y4-renormalisation', [
    ["Loop diagrams integrate over all momenta of the virtual particles and often diverge.", R`\int^\Lambda\frac{d^4k}{k^4} \sim \ln\Lambda`, "Λ is a cut-off above which we stop trusting the theory."],
    ["The measured charge already includes these loops. Express predictions through the charge measured at a reference scale μ.", R`e_0(\Lambda) \to e(\mu): \qquad \text{predictions are finite and independent of } \Lambda`, "The divergence is absorbed into the relation between the unobservable bare parameter and the measured one."],
    ["Physics cannot depend on the arbitrary choice of μ, so the coupling must change with μ to compensate.", R`\mu\frac{d\alpha}{d\mu} = \beta(\alpha)`, "The renormalisation-group equation."],
    ["For QED at one loop, with one charged fermion:", R`\beta = \frac{2\alpha^2}{3\pi} \;\Longrightarrow\; \frac{1}{\alpha(\mu)} = \frac{1}{\alpha(\mu_0)} - \frac{2}{3\pi}\ln\frac{\mu}{\mu_0}`, "Virtual pairs screen the charge. At shorter distances less screening is seen, so α grows: from 1/137 at low energy to about 1/128 at the Z mass, counting all the charged particles."],
    ["In QCD the gluons’ self-interaction reverses the sign.", R`\mu\frac{d\alpha_s}{d\mu} = -\frac{\beta_0}{2\pi}\alpha_s^2, \quad \beta_0 = 11 - \tfrac23n_f \;\Longrightarrow\; \alpha_s(Q) = \frac{4\pi}{\beta_0\ln(Q^2/\Lambda_{\text{QCD}}^2)}`, "Asymptotic freedom: the coupling falls at high energy and grows at low energy, becoming strong near Λ_{QCD} ≈ 0.2 GeV."]
  ], R`\mu\frac{d\alpha}{d\mu} = \beta(\alpha), \qquad \alpha_s(Q) = \frac{4\pi}{\beta_0\ln(Q^2/\Lambda^2)}`, [
    "One-loop formulas; the QCD expression fails near Λ_{QCD}, where perturbation theory breaks down and quarks are confined.",
    "Non-renormalisable theories, such as Fermi’s weak interaction or quantised general relativity, are still predictive at low energy as effective field theories."
  ]);

  d('y4-higgs', [
    ["A complex scalar field with a potential that is symmetric under phase rotations but whose origin is unstable.", R`V = -\mu^2|\phi|^2 + \lambda|\phi|^4`, "The negative sign of the quadratic term is the essential choice."],
    ["Minimise.", R`\frac{\partial V}{\partial|\phi|} = 0 \;\Longrightarrow\; |\phi|^2 = \frac{\mu^2}{2\lambda} \equiv \frac{v^2}{2}`, "A circle of equivalent minima. The vacuum must pick one, hiding the symmetry."],
    ["Expand about the chosen vacuum, φ = (v + h)/√2.", R`V \supset \tfrac12(2\lambda v^2)\,h^2 \;\Longrightarrow\; m_H = \sqrt{2\lambda}\;v`, "Oscillations up the wall of the potential are a massive particle. Motion along the valley costs no energy: a massless Goldstone boson."],
    ["Now gauge the symmetry and expand the kinetic term at the vacuum value.", R`|D_\mu\phi|^2 = \left|(\partial_\mu + iqA_\mu)\frac{v + h}{\sqrt2}\right|^2 \supset \tfrac12q^2v^2A_\mu A^\mu \;\Longrightarrow\; m_A = qv`, "The gauge field acquires a mass, while the Lagrangian remains gauge invariant."],
    ["The Goldstone mode can be removed by a gauge transformation.", R`\text{massless vector (2)} + \text{complex scalar (2)} \;\longrightarrow\; \text{massive vector (3)} + h\ (1)`, "It becomes the longitudinal polarisation of the massive vector. The number of degrees of freedom is unchanged."],
    ["For the electroweak SU(2) × U(1) the same steps give:", R`m_W = \tfrac12gv, \qquad m_Z = \frac{m_W}{\cos\theta_W}, \qquad v = 246\ \text{GeV}`, "v is fixed by the Fermi constant from muon decay. Fermion masses come from Yukawa couplings, m_f = y_f v/√2."]
  ], R`v = \frac{\mu}{\sqrt\lambda}, \qquad m_H = \sqrt{2\lambda}\,v, \qquad m_W = \tfrac12gv`, [
    "The mechanism explains the masses of elementary particles only. Most of the mass of ordinary matter is the binding energy of quarks and gluons in protons and neutrons.",
    "λ, and so m_H = 125 GeV, is not predicted; nor is the size of v compared with the Planck scale (the hierarchy problem)."
  ]);

  d('y4-standard-model', [
    ["The electroweak gauge fields are three W bosons of SU(2) and one B of U(1), acting on the Higgs doublet.", R`D_\mu\phi = \left(\partial_\mu - \tfrac i2g\,\sigma^aW^a_\mu - \tfrac i2g'B_\mu\right)\phi, \qquad \langle\phi\rangle = \frac{1}{\sqrt2}\begin{pmatrix}0\\ v\end{pmatrix}`, "Couplings g and g′. The Higgs doublet has hypercharge ½ in the convention Q = T₃ + Y."],
    ["Insert the vacuum value into the kinetic term.", R`|D_\mu\langle\phi\rangle|^2 = \frac{v^2}{8}\left[g^2\left(W^1_\mu W^{1\mu} + W^2_\mu W^{2\mu}\right) + \left(gW^3_\mu - g'B_\mu\right)^2\right]`, "Mass terms for the gauge fields appear."],
    ["The charged combinations get one mass.", R`W^\pm = \frac{W^1 \mp iW^2}{\sqrt2}, \qquad m_W = \tfrac12gv`, "Compare with m_W²W⁺W⁻."],
    ["Only one neutral combination appears, so the orthogonal one stays massless.", R`Z = \frac{gW^3 - g'B}{\sqrt{g^2 + g'^2}}, \quad m_Z = \tfrac12v\sqrt{g^2 + g'^2}; \qquad A = \frac{g'W^3 + gB}{\sqrt{g^2 + g'^2}}, \quad m_A = 0`, "The photon is the combination that leaves the vacuum unchanged: electric charge is the unbroken symmetry."],
    ["Define the mixing angle and read off the photon’s coupling.", R`\tan\theta_W = \frac{g'}{g} \;\Longrightarrow\; e = g\sin\theta_W, \qquad m_Z = \frac{m_W}{\cos\theta_W}`, "The photon couples to T₃ + Y with strength gg′/√(g² + g′²). Three measured numbers (α, G_F, m_Z) then predict m_W."]
  ], R`e = g\sin\theta_W, \qquad m_W = \tfrac12gv, \qquad m_Z = \frac{m_W}{\cos\theta_W}, \qquad Q = T_3 + Y`, [
    "These are tree-level relations; loop corrections, sensitive to the top and Higgs masses, shift them at the per-cent level and are tested to 0.1%.",
    "The model has about 19 free parameters and does not include neutrino masses, dark matter, the matter–antimatter asymmetry or gravity."
  ]);

  d('y4-phase-transitions', [
    ["Near a continuous transition, expand the free energy in the order parameter m, keeping the terms symmetry allows.", R`F = a\,(T - T_c)\,m^2 + b\,m^4 - hm, \qquad a, b > 0`, "Odd powers are forbidden by the m → −m symmetry at h = 0. The coefficient of m² changes sign at T_c."],
    ["Minimise at h = 0.", R`m = 0 \ (T > T_c), \qquad m^2 = \frac{a(T_c - T)}{2b} \ (T < T_c) \;\Longrightarrow\; \beta = \tfrac12`, "Below T_c the minimum moves continuously away from zero."],
    ["Keep h and differentiate the condition for the minimum.", R`\chi = \frac{\partial m}{\partial h}\bigg|_{h=0} \propto |T - T_c|^{-1} \;\Longrightarrow\; \gamma = 1`, "From 2a(T − T_c)m + 4bm³ = h. The response to a field diverges at the transition."],
    ["Exactly at T_c:", R`h = 4b\,m^3 \;\Longrightarrow\; \delta = 3`, "These exponents are the same for every model with this symmetry, but they ignore fluctuations."],
    ["Fluctuations are handled by coarse-graining. In the 1D Ising chain, sum over every second spin.", R`\sum_{s_2 = \pm1}e^{K s_2(s_1 + s_3)} = 2\cosh\!\left[K(s_1 + s_3)\right] \propto e^{K's_1s_3} \;\Longrightarrow\; \tanh K' = \tanh^2K`, "The remaining spins interact with a new coupling K′ = J′/kT. This is one step of the renormalisation group."],
    ["Follow the flow.", R`K' < K \ \text{for all finite } K \;\Longrightarrow\; K \to 0`, "Every finite coupling flows to zero, the disordered fixed point, so the 1D chain has no transition. In higher dimensions a non-trivial fixed point appears and its neighbourhood fixes the true exponents."]
  ], R`\beta = \tfrac12,\ \gamma = 1,\ \delta = 3 \ \text{(Landau)}; \qquad \tanh K' = \tanh^2K \ \text{(1D)}`, [
    "Landau exponents are correct only above the upper critical dimension, d = 4. In 3D the Ising values are β ≈ 0.326 and γ ≈ 1.237.",
    "The exponents obey scaling relations such as α + 2β + γ = 2 and 2 − α = dν, so only two are independent."
  ]);

  d('y4-superconductivity', [
    ["Suppose a density n_s of electrons moves without resistance.", R`m\frac{d\mathbf v}{dt} = -e\mathbf E \;\Longrightarrow\; \frac{\partial\mathbf J_s}{\partial t} = \frac{n_se^2}{m}\mathbf E`, "J_s = −n_s e v. The first London equation: a field accelerates the supercurrent instead of sustaining it."],
    ["Take the curl and use Faraday’s law.", R`\frac{\partial}{\partial t}\left(\nabla\times\mathbf J_s + \frac{n_se^2}{m}\mathbf B\right) = 0`, "A perfect conductor would only keep this combination constant, and so would trap whatever field it started with."],
    ["The Londons proposed that in a superconductor the combination itself vanishes.", R`\nabla\times\mathbf J_s = -\frac{n_se^2}{m}\mathbf B`, "The second London equation. It is this, not zero resistance, that describes the Meissner effect."],
    ["Combine with Ampère’s law.", R`\nabla\times(\nabla\times\mathbf B) = -\frac{\mu_0n_se^2}{m}\mathbf B \;\Longrightarrow\; \nabla^2\mathbf B = \frac{\mathbf B}{\lambda_L^2}, \qquad \lambda_L = \sqrt{\frac{m}{\mu_0n_se^2}}`, "∇ × (∇ × B) = −∇²B because ∇·B = 0."],
    ["Solve at a flat surface.", R`B(x) = B_0\,e^{-x/\lambda_L}`, "The field is screened within a penetration depth of typically 50 nm by surface currents."],
    ["The charge carriers are pairs with a single macroscopic wavefunction, which must be single-valued round a ring.", R`\oint\frac{2e}{\hbar}\mathbf A\cdot d\mathbf l = 2\pi n \;\Longrightarrow\; \Phi = n\,\frac{h}{2e}`, "Deep inside the ring the current is zero, so the phase gradient is fixed by A alone. The measured flux quantum shows that the charge is 2e."]
  ], R`\lambda_L = \sqrt{\frac{m}{\mu_0n_se^2}}, \qquad \Phi_0 = \frac{h}{2e}`, [
    "London theory is local and assumes constant n_s; it fails when the coherence length exceeds λ_L and near T_c, where Ginzburg–Landau theory is needed.",
    "BCS theory explains the pairing through lattice vibrations for conventional superconductors (2Δ = 3.53kT_c, T_c ∝ M^{−1/2}); the mechanism in the cuprates is still not settled."
  ]);

  d('y4-topological', [
    ["Change the parameters R of a Hamiltonian slowly round a closed loop. The system stays in its instantaneous eigenstate but may gain a phase.", R`|\psi(t)\rangle = e^{i\gamma(t)}\,e^{-\frac i\hbar\int E_n\,dt}\,|n(\mathbf R(t))\rangle`, "The adiabatic theorem, for a non-degenerate level."],
    ["Insert into the Schrödinger equation and project onto ⟨n|.", R`\dot\gamma = i\langle n|\nabla_{\mathbf R}n\rangle\cdot\dot{\mathbf R} \;\Longrightarrow\; \gamma = i\oint\langle n|\nabla_{\mathbf R}n\rangle\cdot d\mathbf R`, "The dynamical phase accounts for the energy; what is left depends only on the path, not on how fast it is traversed."],
    ["Rewrite as a surface integral.", R`\gamma = \int\boldsymbol\Omega\cdot d\mathbf S, \qquad \boldsymbol\Omega = \nabla_{\mathbf R}\times\mathbf A, \quad \mathbf A = i\langle n|\nabla_{\mathbf R}n\rangle`, "Stokes’ theorem. A changes under |n⟩ → e^{iχ}|n⟩ like a vector potential, but its curl, the Berry curvature, does not."],
    ["For a spin-½ following a field direction round a loop:", R`\gamma = -\tfrac12\,\Omega_{\text{solid}}`, "The curvature is that of a monopole of strength ½ at the point of degeneracy, B = 0. Ω_{solid} is the solid angle the loop subtends."],
    ["Over a closed surface the total curvature is quantised.", R`C = \frac{1}{2\pi}\oint\Omega\,d^2k \in \mathbb Z`, "Single-valuedness of the state. For a filled band, the closed surface is the Brillouin zone and C is the Chern number."],
    ["The Hall conductance of a filled band is its Chern number.", R`\sigma_{xy} = C\,\frac{e^2}{h}`, "The TKNN result. An integer cannot change under small perturbations, which is why the quantised Hall plateaus are so exact."]
  ], R`\gamma_n = i\oint\langle n|\nabla_{\mathbf R}n\rangle\cdot d\mathbf R, \qquad C \in \mathbb Z, \qquad \sigma_{xy} = C\frac{e^2}{h}`, [
    "Requires an energy gap that stays open: at a degeneracy the adiabatic theorem fails and the Chern number can change.",
    "At a boundary between regions with different C the gap must close, giving |ΔC| conducting edge states."
  ]);

  d('y4-gr', [
    ["Spacetime geometry is encoded in the metric, which gives the interval between neighbouring events.", R`ds^2 = g_{\mu\nu}(x)\,dx^\mu dx^\nu`, "It replaces the fixed Minkowski metric of special relativity."],
    ["A freely falling body follows the path of extremal proper time. Apply the Euler–Lagrange equations to L = ½g_{μν}ẋ^μẋ^ν.", R`\ddot x^\mu + \Gamma^\mu_{\alpha\beta}\,\dot x^\alpha\dot x^\beta = 0, \qquad \Gamma^\mu_{\alpha\beta} = \tfrac12g^{\mu\nu}\left(\partial_\alpha g_{\nu\beta} + \partial_\beta g_{\nu\alpha} - \partial_\nu g_{\alpha\beta}\right)`, "The geodesic equation. Mass does not appear: all bodies fall alike."],
    ["Take a slow particle in a weak, static field, g₀₀ = 1 + h₀₀.", R`\frac{d^2x^i}{dt^2} \approx -c^2\,\Gamma^i_{00} = -\frac{c^2}{2}\,\partial_ih_{00}`, "Only the time–time component matters at low speed, since ẋ⁰ ≈ c dominates."],
    ["Compare with Newton’s law of gravity.", R`\frac{d^2x^i}{dt^2} = -\partial_i\Phi \;\Longrightarrow\; g_{00} \approx 1 + \frac{2\Phi}{c^2}`, "Newtonian gravity is the curvature of time. Gravitational time dilation follows at once."],
    ["Curvature is measured by the Riemann tensor, built from Γ and its derivatives. The field equations relate a contraction of it to the energy and momentum of matter.", R`G_{\mu\nu} \equiv R_{\mu\nu} - \tfrac12R\,g_{\mu\nu} = \frac{8\pi G}{c^4}\,T_{\mu\nu}`, "G_{μν} is the combination whose divergence vanishes identically, matching energy–momentum conservation. The constant is fixed by requiring ∇²Φ = 4πGρ in the Newtonian limit."]
  ], R`\ddot x^\mu + \Gamma^\mu_{\alpha\beta}\dot x^\alpha\dot x^\beta = 0, \qquad G_{\mu\nu} = \frac{8\pi G}{c^4}T_{\mu\nu}`, [
    "A cosmological constant term Λg_{μν} may be added and is needed to describe the observed acceleration of the expansion.",
    "Classical theory: it predicts singularities where it must fail, and has not been reconciled with quantum mechanics."
  ]);

  d('y4-gravitational-waves', [
    ["Write the metric as flat spacetime plus a small perturbation and keep first order.", R`g_{\mu\nu} = \eta_{\mu\nu} + h_{\mu\nu}, \quad |h| \ll 1: \qquad \Box\bar h_{\mu\nu} = -\frac{16\pi G}{c^4}T_{\mu\nu}`, "In the Lorenz gauge, with the trace-reversed perturbation h̄. A wave equation with matter as its source."],
    ["In vacuum the solutions are transverse waves travelling at c with two polarisations.", R`h_{\mu\nu} = \begin{pmatrix}0 & 0 & 0 & 0\\ 0 & h_+ & h_\times & 0\\ 0 & h_\times & -h_+ & 0\\ 0 & 0 & 0 & 0\end{pmatrix}\cos(\omega t - kz)`, "The transverse–traceless gauge removes everything that is only a change of coordinates."],
    ["The proper distance between two free masses separated by L along x changes.", R`L' = \int_0^L\sqrt{1 + h_+}\;dx \approx L\left(1 + \tfrac12h_+\right) \;\Longrightarrow\; \frac{\delta L}{L} = \frac h2`, "Their coordinates stay fixed but the metric between them oscillates; the y direction changes by the opposite amount."],
    ["Far from a slowly moving source the wave is set by the second time derivative of the quadrupole moment.", R`h \sim \frac{2G}{c^4\,r}\,\ddot Q`, "Mass conservation removes monopole radiation and momentum conservation removes dipole radiation. G/c⁴ ≈ 8 × 10⁻⁴⁵ in SI units is why the waves are so weak."],
    ["For two masses in a circular orbit of separation a, the radiated power is:", R`P = \frac{32}{5}\,\frac{G^4}{c^5}\,\frac{(m_1m_2)^2(m_1 + m_2)}{a^5}`, "The orbit shrinks and speeds up, producing a chirp whose rate depends on the chirp mass (m₁m₂)^{3/5}/(m₁ + m₂)^{1/5}."]
  ], R`\Box\bar h_{\mu\nu} = -\frac{16\pi G}{c^4}T_{\mu\nu}, \qquad \frac{\delta L}{L} = \frac h2`, [
    "Linearised theory: the last orbits and the merger need numerical relativity.",
    "Confirmed indirectly by the orbital decay of the Hulse–Taylor pulsar (agreement within 0.2%) and directly by LIGO in 2015 with h ≈ 10⁻²¹."
  ]);

  d('y4-early-universe', [
    ["In the early universe radiation dominates, with density falling as a⁻⁴. Insert into the Friedmann equation.", R`\left(\frac{\dot a}{a}\right)^2 = \frac{8\pi G}{3}\rho \propto a^{-4} \;\Longrightarrow\; a\,\dot a = \text{constant} \;\Longrightarrow\; a \propto t^{1/2}`, "Curvature and Λ are negligible at early times."],
    ["Radiation temperature scales inversely with a.", R`T \propto \frac1a \propto t^{-1/2}, \qquad kT \approx 1\ \text{MeV}\left(\frac{1\ \text{s}}{t}\right)^{1/2}`, "Wavelengths stretch with the expansion. This sets the clock for nucleosynthesis."],
    ["Write the Friedmann equation in terms of Ω = ρ/ρ_{crit}.", R`\Omega - 1 = \frac{kc^2}{a^2H^2} = \frac{kc^2}{\dot a^2}`, "Any departure from flatness is measured by 1/ȧ²."],
    ["In a decelerating universe ȧ falls, so the departure grows.", R`|\Omega - 1| \propto t \ (\text{radiation}), \qquad \propto t^{2/3} \ (\text{matter})`, "For Ω to be within a per cent of 1 today it must have been within about 10⁻⁶⁰ at the Planck time: the flatness problem."],
    ["During inflation the expansion accelerates, with nearly constant H.", R`a \propto e^{Ht} \;\Longrightarrow\; |\Omega - 1| \propto e^{-2Ht}`, "Now ȧ grows and the universe is driven towards flatness. About 60 e-folds are enough, and the same stretching solves the horizon problem."],
    ["When weak interactions freeze out the neutron-to-proton ratio is fixed; nearly all the neutrons end up in helium.", R`Y_p \approx \frac{2(n/p)}{1 + n/p} \approx 0.25 \quad \text{for}\ \frac np \approx \frac17`, "Each ⁴He takes two neutrons and two protons. The predicted 25% matches the oldest gas clouds."]
  ], R`a \propto t^{1/2}, \qquad |\Omega - 1| = \frac{|k|c^2}{\dot a^2}, \qquad Y_p \approx 0.25`, [
    "Inflation is a paradigm, not a single tested theory: the inflaton has not been identified, and primordial gravitational waves have not been seen.",
    "Standard nucleosynthesis overpredicts lithium-7 by a factor of about three (the lithium problem)."
  ]);

  d('y4-quantum-info', [
    ["A qubit is a unit vector in a two-dimensional space; n qubits live in the tensor product.", R`|\psi\rangle = \alpha|0\rangle + \beta|1\rangle, \qquad \dim\mathcal H_n = 2^n`, "A general n-qubit state needs 2ⁿ complex amplitudes, though a measurement returns only n bits."],
    ["Grover’s search starts in the uniform superposition of all N = 2ⁿ strings. Split it into the marked item |w⟩ and everything else |r⟩.", R`|s\rangle = \sin\theta\,|w\rangle + \cos\theta\,|r\rangle, \qquad \sin\theta = \frac{1}{\sqrt N}`, "The whole algorithm stays in the two-dimensional plane spanned by |w⟩ and |r⟩."],
    ["The oracle flips the sign of the marked item.", R`O = 1 - 2|w\rangle\langle w|`, "A reflection about |r⟩. It uses one evaluation of the function being searched."],
    ["The diffusion step reflects about the starting state.", R`D = 2|s\rangle\langle s| - 1`, "“Inversion about the mean”, built from Hadamard gates and one phase flip."],
    ["Two reflections make a rotation by twice the angle between the mirrors.", R`(DO)^k|s\rangle = \sin\!\left[(2k + 1)\theta\right]|w\rangle + \cos\!\left[(2k + 1)\theta\right]|r\rangle`, "Each iteration turns the state by 2θ towards |w⟩."],
    ["Stop when the state is closest to |w⟩.", R`(2k + 1)\theta \approx \frac\pi2 \;\Longrightarrow\; k \approx \frac\pi4\sqrt N`, "For large N, θ ≈ 1/√N. A classical search needs about N/2 evaluations."]
  ], R`k_{\text{Grover}} \approx \frac\pi4\sqrt N`, [
    "The quadratic speed-up is proven optimal for unstructured search; exponential speed-ups, as in Shor’s factoring, need hidden structure such as periodicity.",
    "Real qubits decohere. Error correction works only below a threshold error rate: the 3-qubit repetition code turns p into 3p² − 2p³, an improvement only for p < ½."
  ]);
})();
/* ---- derive-6.js ---- */
/* Geodesic — derivations for notes-only topics: maths foundations (KS3–GCSE). */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('m-algebra', [
    ["An equation is a balance: whatever you do to one side you must do to the other. Make a the subject of s = ut + ½at². First remove the term without a.", R`s - ut = \tfrac12at^2`, "Subtract ut from both sides. Undo additions and subtractions before multiplications."],
    ["Clear the fraction.", R`2(s - ut) = at^2`, "Multiply both sides by 2."],
    ["Divide by the factor multiplying a.", R`a = \frac{2(s - ut)}{t^2}`, "Divide both sides by t², which is allowed as long as t ≠ 0."],
    ["If the subject is inside a square root, isolate the root and square. For a pendulum:", R`T = 2\pi\sqrt{\frac lg} \;\Longrightarrow\; \frac{T^2}{4\pi^2} = \frac lg \;\Longrightarrow\; g = \frac{4\pi^2l}{T^2}`, "Divide by 2π, square both sides, then swap g and the left-hand side."],
    ["If the subject appears twice, collect its terms and factorise.", R`y = \frac{2x + 1}{x - 3} \;\Longrightarrow\; xy - 2x = 3y + 1 \;\Longrightarrow\; x = \frac{3y + 1}{y - 2}`, "Multiply out, move every x term to one side, take x out as a common factor, then divide."]
  ], R`a = \frac{2(s - ut)}{t^2}, \qquad g = \frac{4\pi^2l}{T^2}`, [
    "Never divide by something that could be zero, and remember that squaring can introduce a false solution: check answers in the original equation.",
    "Taking a square root gives two possibilities, ±; in physics the context usually picks one."
  ]);

  d('m-graphs', [
    ["The gradient of a line measures how much y changes for each unit of x.", R`m = \frac{\text{rise}}{\text{run}} = \frac{y_2 - y_1}{x_2 - x_1}`, "By similar triangles this ratio is the same whichever two points on the line you choose."],
    ["Let (x, y) be any other point on the line through (x₁, y₁). The gradient to it must also be m.", R`\frac{y - y_1}{x - x_1} = m \;\Longrightarrow\; y - y_1 = m(x - x_1)`, "This is the equation of the line."],
    ["Expand and collect the constants.", R`y = mx + c, \qquad c = y_1 - mx_1`, "c is the value of y when x = 0: the y-intercept."],
    ["Turn the line through 90°. A step of (1, m) along it becomes a step of (−m, 1).", R`m_\perp = \frac{1}{-m} = -\frac1m \;\Longrightarrow\; m_1m_2 = -1`, "A quarter turn sends the point (x, y) to (−y, x). Rise and run swap, and one changes sign."],
    ["The distance between two points is the hypotenuse of the rise–run triangle.", R`d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`, "Pythagoras’ theorem."]
  ], R`y - y_1 = m(x - x_1), \qquad m_1m_2 = -1`, [
    "A vertical line has no gradient (the run is zero); write it as x = constant.",
    "m₁m₂ = −1 needs equal scales on both axes. On a physics graph with different units the lines will not look perpendicular."
  ]);

  d('m-trig', [
    ["Arrange four copies of a right-angled triangle with sides a, b, c inside a square of side a + b.", R`(a + b)^2 = c^2 + 4\times\tfrac12ab`, "The four triangles leave a tilted square of side c in the middle. Its corners are right angles because the two acute angles of the triangle add to 90°."],
    ["Expand and cancel.", R`a^2 + 2ab + b^2 = c^2 + 2ab \;\Longrightarrow\; a^2 + b^2 = c^2`, "Pythagoras’ theorem."],
    ["All right-angled triangles with the same angle θ are similar, so their side ratios depend only on θ.", R`\sin\theta = \frac{\text{opp}}{\text{hyp}}, \qquad \cos\theta = \frac{\text{adj}}{\text{hyp}}, \qquad \tan\theta = \frac{\text{opp}}{\text{adj}} = \frac{\sin\theta}{\cos\theta}`, "These definitions make sense because enlarging a triangle does not change its ratios."],
    ["Divide Pythagoras’ theorem by c².", R`\left(\frac ac\right)^2 + \left(\frac bc\right)^2 = 1 \;\Longrightarrow\; \sin^2\theta + \cos^2\theta = 1`, "a/c and b/c are the sine and cosine of the same angle."]
  ], R`a^2 + b^2 = c^2, \qquad \sin^2\theta + \cos^2\theta = 1`, [
    "Pythagoras’ theorem holds only in flat (Euclidean) space; on a sphere a triangle can have three right angles.",
    "The triangle definitions cover 0° < θ < 90°; the unit circle extends them to every angle."
  ]);

  d('m-quadratics', [
    ["Start from the general quadratic equation and divide by a.", R`ax^2 + bx + c = 0 \;\Longrightarrow\; x^2 + \frac bax = -\frac ca`, "a ≠ 0, or it would not be a quadratic."],
    ["Complete the square: add the square of half the coefficient of x to both sides.", R`\left(x + \frac{b}{2a}\right)^2 = \frac{b^2}{4a^2} - \frac ca`, "(x + k)² = x² + 2kx + k², so with k = b/2a the left side becomes a perfect square."],
    ["Combine the right side over a common denominator.", R`\left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2}`, "Multiply c/a by 4a/4a."],
    ["Take the square root of both sides and solve.", R`x = \frac{-b \pm\sqrt{b^2 - 4ac}}{2a}`, "A positive number has two square roots, hence ±."],
    ["The quantity under the root decides how many real solutions there are.", R`\Delta = b^2 - 4ac: \quad \Delta > 0 \ \text{two}, \quad \Delta = 0 \ \text{one (repeated)}, \quad \Delta < 0 \ \text{none}`, "A real square root exists only for a number that is not negative."]
  ], R`x = \frac{-b \pm\sqrt{b^2 - 4ac}}{2a}`, [
    "When Δ < 0 the two solutions are complex numbers, which matter in oscillations and a.c. circuits.",
    "The graph is symmetric about x = −b/2a, the average of the two roots."
  ]);

  d('m-proportion', [
    ["Many laws have the form y = kxⁿ. Scale x by a factor λ.", R`y' = k(\lambda x)^n = \lambda^n\,kx^n = \lambda^ny`, "The output is multiplied by λⁿ whatever the starting value: a power law has no preferred scale."],
    ["Take logarithms of both sides.", R`\log y = \log k + n\log x`, "log(ab) = log a + log b and log(xⁿ) = n log x."],
    ["So a log–log graph is a straight line.", R`\text{gradient} = n, \qquad \text{intercept} = \log k`, "This is how an unknown power is found from data."],
    ["Enlarge any shape by a factor L. Areas and volumes scale differently.", R`A \propto L^2, \qquad V \propto L^3 \;\Longrightarrow\; \frac AV \propto \frac1L`, "Areas are built from squares and volumes from cubes. Large objects have less surface for their bulk."],
    ["Something spreading equally in all directions covers a sphere.", R`I = \frac{P}{4\pi r^2} \propto \frac{1}{r^2}`, "The same power crosses an area growing as r²: the inverse-square law of light, gravity and electric force."]
  ], R`y = kx^n: \quad x \to \lambda x \;\Rightarrow\; y \to \lambda^ny; \qquad \log y = \log k + n\log x`, [
    "A straight log–log graph over a limited range does not prove a power law; an exponential or a mixture can look similar.",
    "The inverse-square law needs a point source and nothing absorbing on the way."
  ]);

  d('m-number', [
    ["Every whole number greater than 1 is a product of primes in exactly one way.", R`a = p_1^{a_1}p_2^{a_2}\cdots, \qquad b = p_1^{b_1}p_2^{b_2}\cdots`, "The fundamental theorem of arithmetic. Write both numbers using the same list of primes, allowing powers of 0."],
    ["The highest common factor takes the smaller power of each prime; the lowest common multiple takes the larger.", R`\text{HCF} = \prod_ip_i^{\min(a_i, b_i)}, \qquad \text{LCM} = \prod_ip_i^{\max(a_i, b_i)}`, "A common factor cannot use more of a prime than either number has; a common multiple must have at least as much as both."],
    ["Multiply them.", R`\text{HCF}\times\text{LCM} = \prod_ip_i^{a_i + b_i} = ab`, "For any two numbers, min + max = their sum."],
    ["Not every number is a fraction. Suppose √2 = p/q in lowest terms.", R`p^2 = 2q^2 \;\Longrightarrow\; p \ \text{even}, \ p = 2k \;\Longrightarrow\; q^2 = 2k^2 \;\Longrightarrow\; q \ \text{even}`, "The square of an odd number is odd, so p must be even. Then q is even as well."],
    ["That contradicts “lowest terms”, so no such fraction exists.", R`\sqrt2 \notin \mathbb Q, \qquad \mathbb N \subset \mathbb Z \subset \mathbb Q \subset \mathbb R`, "Proof by contradiction. The real numbers include irrationals such as √2 and π."]
  ], R`\text{HCF}(a, b)\times\text{LCM}(a, b) = ab, \qquad \sqrt2 \ \text{is irrational}`, [
    "HCF × LCM = product works for two numbers, not in general for three.",
    "For counting elements of sets: n(A ∪ B) = n(A) + n(B) − n(A ∩ B), because the overlap would otherwise be counted twice."
  ]);

  d('m-fractions', [
    ["A recurring decimal is an exact fraction. Let x = 0.121212…", R`100x = 12.1212\ldots`, "Multiply by the power of ten that shifts the pattern by one full block."],
    ["Subtract the original.", R`100x - x = 12 \;\Longrightarrow\; x = \frac{12}{99} = \frac{4}{33}`, "The recurring tails are identical and cancel exactly."],
    ["The same argument settles a famous puzzle.", R`x = 0.999\ldots: \quad 10x - x = 9 \;\Longrightarrow\; x = 1`, "0.999… and 1 are two ways of writing the same number, not two different numbers."],
    ["A change of p per cent multiplies the amount by a fixed factor.", R`\text{new} = \text{original}\times\left(1 + \frac{p}{100}\right)`, "Original plus p hundredths of the original. For a decrease p is negative."],
    ["To undo it, divide by the same factor.", R`\text{original} = \frac{\text{new}}{1 + p/100}`, "Not “subtract p per cent of the new amount”: the percentage was taken of the original."]
  ], R`0.\dot1\dot2 = \tfrac{4}{33}, \qquad 0.\dot9 = 1, \qquad \text{original} = \frac{\text{new}}{1 + p/100}`, [
    "Successive percentage changes multiply; they do not add. +10% then −10% gives ×0.99.",
    "A ratio a : b splits a whole into fractions a/(a + b) and b/(a + b)."
  ]);

  d('m-indices', [
    ["A positive whole-number power counts repeated factors.", R`a^m\times a^n = \underbrace{a\cdots a}_{m}\times\underbrace{a\cdots a}_{n} = a^{m+n}`, "m factors followed by n factors is m + n factors."],
    ["Extend the rule to a zero power by insisting it still holds.", R`a^m\times a^0 = a^{m+0} = a^m \;\Longrightarrow\; a^0 = 1`, "The only number that leaves aᵐ unchanged when it multiplies it is 1 (for a ≠ 0)."],
    ["And to negative powers.", R`a^n\times a^{-n} = a^0 = 1 \;\Longrightarrow\; a^{-n} = \frac{1}{a^n}`, "a⁻ⁿ must be the number that multiplies aⁿ to give 1."],
    ["And to fractional powers, using (aᵐ)ⁿ = aᵐⁿ.", R`\left(a^{1/n}\right)^n = a^1 \;\Longrightarrow\; a^{1/n} = \sqrt[n]{a}, \qquad a^{m/n} = \left(\sqrt[n]{a}\right)^m`, "a^{1/n} is the number whose nth power is a."],
    ["A surd in a denominator is removed with the difference of two squares.", R`\frac{1}{a + \sqrt b} = \frac{a - \sqrt b}{(a + \sqrt b)(a - \sqrt b)} = \frac{a - \sqrt b}{a^2 - b}`, "Multiplying top and bottom by the same thing does not change the value."]
  ], R`a^ma^n = a^{m+n}, \quad a^0 = 1, \quad a^{-n} = \frac{1}{a^n}, \quad a^{m/n} = \left(\sqrt[n]{a}\right)^m`, [
    "0⁰ and negative numbers to fractional powers need care; the rules above are safe for a > 0.",
    "Standard form A × 10ⁿ with 1 ≤ A < 10 uses the same laws: multiply the A’s and add the powers."
  ]);

  d('m-estimation', [
    ["A value given as 7.4 to one decimal place could be anything that rounds to 7.4.", R`7.35 \le x < 7.45`, "Half of the last place either way. The lower bound is included; the upper one rounds up, so it is not."],
    ["A sum is greatest when both parts are greatest.", R`(a + b)_{\max} = a_{\max} + b_{\max}`, "Increasing either term increases the total."],
    ["A difference is greatest when you take the least away from the most.", R`(a - b)_{\max} = a_{\max} - b_{\min}, \qquad (a - b)_{\min} = a_{\min} - b_{\max}`, "Subtracting a smaller number leaves more."],
    ["A quotient is greatest with the largest numerator and the smallest denominator.", R`\left(\frac ab\right)_{\max} = \frac{a_{\max}}{b_{\min}}, \qquad \left(\frac ab\right)_{\min} = \frac{a_{\min}}{b_{\max}}`, "Dividing by a smaller positive number gives a larger answer."],
    ["Example: speed from d = 120 m (nearest 10 m) and t = 8.4 s (1 d.p.).", R`v_{\max} = \frac{125}{8.35} = 14.97\ldots, \quad v_{\min} = \frac{115}{8.45} = 13.60\ldots \;\Longrightarrow\; v = 14\ \text{m/s (2 s.f.)}`, "Quote the answer only to the accuracy on which both bounds agree. Here they agree to no more than “about 14”."]
  ], R`\left(\frac ab\right)_{\max} = \frac{a_{\max}}{b_{\min}}, \qquad (a - b)_{\min} = a_{\min} - b_{\max}`, [
    "These rules assume positive quantities; with negatives, think again about which combination is extreme.",
    "Bounds give the worst case. Real measurement errors rarely all conspire, which is why science uses statistical uncertainties."
  ]);

  d('m-rates', [
    ["A quantity that grows by a fraction r each period is multiplied by (1 + r) each time.", R`N_1 = N_0(1 + r), \quad N_2 = N_0(1 + r)^2, \ \dots, \ N_n = N_0(1 + r)^n`, "The increase is a fixed fraction of the current amount, not of the starting amount."],
    ["Decay is the same with a negative r. If the amount halves every T½:", R`N = N_0\left(\tfrac12\right)^{t/T_{1/2}}`, "t/T½ is the number of half-lives that have passed."],
    ["Write ½ as a power of e.", R`\tfrac12 = e^{-\ln2} \;\Longrightarrow\; N = N_0\,e^{-(\ln2/T_{1/2})\,t}`, "e^{ln x} = x. Any exponential can be written with base e."],
    ["Compare with the standard decay law.", R`N = N_0e^{-\lambda t}, \qquad \lambda = \frac{\ln2}{T_{1/2}}`, "λ is the fraction decaying per unit time, when that fraction is small."],
    ["Average speed over a journey is total distance over total time.", R`\bar v = \frac{d_1 + d_2}{t_1 + t_2} \ne \frac{v_1 + v_2}{2}`, "Unless the two parts take equal times, the slower part lasts longer and counts for more."]
  ], R`N = N_0(1 + r)^n, \qquad N = N_0\left(\tfrac12\right)^{t/T_{1/2}} = N_0e^{-\lambda t}`, [
    "Exponential growth cannot continue for ever: real populations level off when resources run out.",
    "(1 + r)ⁿ assumes the same rate in every period."
  ]);

  d('m-expressions', [
    ["Multiply two brackets by taking every term of one with every term of the other.", R`(a + b)(c + d) = ac + ad + bc + bd`, "The area of a rectangle with sides a + b and c + d is the sum of four smaller rectangles."],
    ["Square a bracket.", R`(a + b)^2 = a^2 + 2ab + b^2`, "Two squares and two equal rectangles. The middle term is the one most often forgotten."],
    ["Multiply a sum by a difference.", R`(a - b)(a + b) = a^2 + ab - ab - b^2 = a^2 - b^2`, "The cross terms cancel: the difference of two squares."],
    ["Factorising reverses expansion. For x² + bx + c find two numbers with the right sum and product.", R`x^2 + bx + c = (x + p)(x + q), \qquad p + q = b, \quad pq = c`, "Expanding the right side gives x² + (p + q)x + pq."],
    ["Fractions add over a common denominator, exactly as with numbers.", R`\frac ab + \frac cd = \frac{ad}{bd} + \frac{bc}{bd} = \frac{ad + bc}{bd}`, "Multiply each fraction top and bottom by the other’s denominator."]
  ], R`(a + b)^2 = a^2 + 2ab + b^2, \qquad a^2 - b^2 = (a - b)(a + b)`, [
    "(a + b)² is not a² + b²; test with numbers if in doubt.",
    "Cancel only common factors of the whole numerator and denominator, never single terms."
  ]);

  d('m-equations', [
    ["Two equations in two unknowns.", R`a_1x + b_1y = c_1, \qquad a_2x + b_2y = c_2`, "Each equation is a straight line; a solution is a point on both."],
    ["Multiply the first by b₂ and the second by b₁.", R`a_1b_2\,x + b_1b_2\,y = c_1b_2, \qquad a_2b_1\,x + b_1b_2\,y = c_2b_1`, "Now the y terms match."],
    ["Subtract to eliminate y.", R`(a_1b_2 - a_2b_1)\,x = c_1b_2 - c_2b_1`, "Equal quantities subtracted from equal quantities leave equal quantities."],
    ["Divide.", R`x = \frac{c_1b_2 - c_2b_1}{a_1b_2 - a_2b_1}, \qquad y = \frac{a_1c_2 - a_2c_1}{a_1b_2 - a_2b_1}`, "y follows in the same way by eliminating x."],
    ["This fails exactly when the denominator is zero.", R`a_1b_2 - a_2b_1 = 0 \iff \frac{a_1}{b_1} = \frac{a_2}{b_2} \iff \text{parallel lines}`, "Equal gradients: the lines either never meet (no solution) or are the same line (infinitely many)."]
  ], R`x = \frac{c_1b_2 - c_2b_1}{a_1b_2 - a_2b_1}, \qquad \text{unique solution} \iff a_1b_2 - a_2b_1 \ne 0`, [
    "The quantity a₁b₂ − a₂b₁ is the determinant of the coefficients, the start of matrix algebra.",
    "A line and a curve can meet twice, once or not at all: substitute the line into the curve and use the discriminant."
  ]);

  d('m-inequalities', [
    ["Start from a < b, which means b − a is positive.", R`a < b \iff b - a > 0`, "The definition of “less than”."],
    ["Multiply the positive number b − a by a negative number c.", R`c\,(b - a) < 0`, "Positive × negative is negative."],
    ["Expand.", R`cb - ca < 0 \;\Longrightarrow\; ca > cb`, "Multiplying or dividing an inequality by a negative number reverses the sign."],
    ["A product of two brackets is negative exactly when the brackets have opposite signs.", R`(x - p)(x - q) < 0 \iff p < x < q \qquad (p < q)`, "Between the roots, x − p is positive and x − q negative. Outside them both have the same sign."],
    ["So the opposite inequality gives two separate regions.", R`(x - p)(x - q) > 0 \iff x < p \ \ \text{or}\ \ x > q`, "On a sketch: the parabola is below the axis between its roots and above it outside."]
  ], R`a < b,\ c < 0 \;\Rightarrow\; ac > bc; \qquad (x - p)(x - q) < 0 \iff p < x < q`, [
    "Never multiply an inequality by an expression whose sign you do not know, such as x.",
    "For regions on a graph, test one point: if it satisfies the inequality, its whole side of the line does."
  ]);

  d('m-sequences', [
    ["In a linear sequence the same amount d is added each time.", R`u_1 = a, \quad u_2 = a + d, \quad u_3 = a + 2d \;\Longrightarrow\; u_n = a + (n - 1)d`, "To reach the nth term you add d a total of n − 1 times."],
    ["Take a quadratic sequence and find its first differences.", R`u_n = an^2 + bn + c: \qquad u_{n+1} - u_n = a(2n + 1) + b`, "(n + 1)² − n² = 2n + 1. The differences form a linear sequence."],
    ["Take differences again.", R`\left[a(2n + 3) + b\right] - \left[a(2n + 1) + b\right] = 2a`, "The second difference is constant, and half of it is the coefficient of n²."],
    ["In a geometric sequence each term is multiplied by the same ratio.", R`u_n = ar^{n-1}`, "n − 1 multiplications by r starting from a."],
    ["Its differences never become constant.", R`u_{n+1} - u_n = ar^{n-1}(r - 1)`, "The differences are themselves geometric with the same ratio: the mark of exponential behaviour."]
  ], R`u_n = a + (n - 1)d; \qquad \text{quadratic: second difference} = 2a; \qquad u_n = ar^{n-1}`, [
    "A few terms never determine a sequence uniquely; the rule is an assumption about the pattern.",
    "A cubic sequence has a constant third difference, equal to 6a."
  ]);

  d('m-functions-gcse', [
    ["A function turns each input into exactly one output.", R`f: x \mapsto f(x), \qquad \text{e.g.}\ f(x) = 3x - 2`, "One output for each input, though different inputs may share an output."],
    ["The inverse function undoes it. Write y = f(x) and solve for x.", R`y = 3x - 2 \;\Longrightarrow\; x = \frac{y + 2}{3} \;\Longrightarrow\; f^{-1}(x) = \frac{x + 2}{3}`, "Undo the operations in reverse order, then rename the variable."],
    ["Check that it really undoes f.", R`f^{-1}(f(x)) = \frac{(3x - 2) + 2}{3} = x`, "Applying a function and then its inverse returns the starting value."],
    ["A composite applies one function to the result of another.", R`fg(x) = f(g(x)): \qquad g(x) = x^2 \;\Rightarrow\; fg(x) = 3x^2 - 2, \quad gf(x) = (3x - 2)^2`, "The function next to x acts first. The order matters."],
    ["To undo a composite, undo the last step first.", R`(fg)^{-1} = g^{-1}f^{-1}`, "Like taking off shoes before socks."]
  ], R`f^{-1}(f(x)) = x, \qquad fg(x) = f(g(x)), \qquad (fg)^{-1} = g^{-1}f^{-1}`, [
    "Only one-to-one functions have inverses; x² has one only if its domain is restricted, for example to x ≥ 0.",
    "The graph of f⁻¹ is the reflection of the graph of f in the line y = x."
  ]);

  d('m-curves', [
    ["Complete the square to find the shape of any quadratic.", R`y = ax^2 + bx + c = a\left(x + \frac{b}{2a}\right)^2 + c - \frac{b^2}{4a}`, "A squared bracket is never negative and is zero only at x = −b/2a."],
    ["Read off the turning point and the axis of symmetry.", R`\text{vertex}\ \left(-\frac{b}{2a},\ c - \frac{b^2}{4a}\right), \qquad \text{symmetric about}\ x = -\frac{b}{2a}`, "A minimum if a > 0, a maximum if a < 0."],
    ["A reciprocal graph keeps the product of the coordinates constant.", R`y = \frac kx \iff xy = k`, "As x grows y shrinks towards zero, and as x shrinks y grows without limit: the axes are asymptotes."],
    ["An exponential graph multiplies y by the same factor for each unit step in x.", R`y = ab^x: \qquad \frac{y(x + 1)}{y(x)} = b`, "Equal steps across give equal ratios up. It crosses the y-axis at a and never reaches zero."],
    ["Solving f(x) = g(x) means finding where two graphs meet.", R`f(x) = g(x) \iff \text{intersections of } y = f(x) \text{ and } y = g(x)`, "At a crossing both functions give the same y for the same x."]
  ], R`y = a\left(x + \frac{b}{2a}\right)^2 + c - \frac{b^2}{4a}; \qquad xy = k; \qquad \frac{y(x + 1)}{y(x)} = b`, [
    "A sketch shows shape and key points (intercepts, turning points, asymptotes), not accurate values.",
    "Graphical solutions are approximate; use them to locate roots and algebra or iteration to refine them."
  ]);

  d('m-geometry', [
    ["Through one corner of a triangle draw a line parallel to the opposite side.", R`\alpha' = \alpha, \qquad \gamma' = \gamma \quad \text{(alternate angles)}`, "A line crossing two parallel lines makes equal alternate angles."],
    ["The three angles at that corner lie on a straight line.", R`\alpha + \beta + \gamma = 180^\circ`, "So the angles of any triangle add to 180°."],
    ["Cut a polygon with n sides into triangles from one corner.", R`\text{interior angle sum} = (n - 2)\times180^\circ`, "There are n − 2 triangles, and their angles together make up the polygon’s interior angles."],
    ["Walk once round the polygon, turning through each exterior angle.", R`\text{sum of exterior angles} = 360^\circ`, "You end up facing the way you started: one full turn."],
    ["For a regular polygon all the turns are equal.", R`\text{exterior angle} = \frac{360^\circ}{n}, \qquad \text{interior angle} = 180^\circ - \frac{360^\circ}{n}`, "Interior and exterior angles lie on a straight line."]
  ], R`\alpha + \beta + \gamma = 180^\circ, \qquad (n - 2)\times180^\circ, \qquad \frac{360^\circ}{n}`, [
    "These results belong to flat geometry. On the Earth’s surface a triangle’s angles add to more than 180°.",
    "Bearings are measured clockwise from north and written with three figures, such as 045°."
  ]);

  d('m-similarity', [
    ["Two shapes are similar if one is an enlargement of the other: every length is multiplied by the same scale factor.", R`k = \frac{\text{new length}}{\text{old length}}`, "Angles are unchanged. Triangles with the same angles are always similar."],
    ["A square of side s becomes a square of side ks.", R`(ks)^2 = k^2s^2 \;\Longrightarrow\; \frac{A_2}{A_1} = k^2`, "Any area can be built from small squares, each scaled the same way."],
    ["A cube of side s becomes a cube of side ks.", R`(ks)^3 = k^3s^3 \;\Longrightarrow\; \frac{V_2}{V_1} = k^3`, "Any volume can be built from small cubes."],
    ["In a triangle ABC draw DE parallel to BC, with D on AB and E on AC.", R`\angle ADE = \angle ABC, \quad \angle AED = \angle ACB \;\Longrightarrow\; \triangle ADE \sim \triangle ABC`, "Corresponding angles on parallel lines are equal, and angle A is shared."],
    ["So the sides are in the same ratio.", R`\frac{AD}{AB} = \frac{AE}{AC} = \frac{DE}{BC}`, "Corresponding sides of similar triangles."]
  ], R`\frac{A_2}{A_1} = k^2, \qquad \frac{V_2}{V_1} = k^3`, [
    "Mass scales as k³ (for the same material) but strength, which depends on cross-section, only as k²: scaled-up animals and models need redesigning.",
    "Congruent shapes are the special case k = 1: tests are SSS, SAS, ASA and RHS."
  ]);

  d('m-circle-theorems', [
    ["Take points A, B, P on a circle with centre O and draw the radius OP.", R`OA = OB = OP \;\Longrightarrow\; \triangle OAP,\ \triangle OBP \ \text{isosceles}`, "All radii are equal."],
    ["Call the equal base angles x and y.", R`\angle OAP = \angle OPA = x, \qquad \angle OBP = \angle OPB = y`, "Base angles of an isosceles triangle are equal. The angle at P is x + y."],
    ["Extend PO beyond O. The exterior angle of each triangle equals the sum of the two opposite interior angles.", R`\angle AOB = 2x + 2y = 2\,\angle APB`, "The angle at the centre is twice the angle at the circumference on the same arc."],
    ["If AB is a diameter, the angle at the centre is a straight line.", R`\angle AOB = 180^\circ \;\Longrightarrow\; \angle APB = 90^\circ`, "The angle in a semicircle is a right angle."],
    ["For a quadrilateral ABCD inscribed in the circle, the angles at B and D stand on the two arcs AC, which together make the whole circle.", R`2\angle B + 2\angle D = 360^\circ \;\Longrightarrow\; \angle B + \angle D = 180^\circ`, "Opposite angles of a cyclic quadrilateral are supplementary."]
  ], R`\angle AOB = 2\angle APB, \qquad \text{angle in a semicircle} = 90^\circ, \qquad \angle B + \angle D = 180^\circ`, [
    "The diagram above has O inside angle APB; when it lies outside, the same argument works with x − y.",
    "Angles on the same arc are equal, because each is half the same angle at the centre."
  ]);

  d('m-mensuration', [
    ["A trapezium with parallel sides a and b and height h splits along a diagonal into two triangles.", R`A = \tfrac12ah + \tfrac12bh = \tfrac12(a + b)h`, "Each triangle has one of the parallel sides as base and the same height h."],
    ["A sector with angle θ at the centre is a fraction of the whole circle.", R`\frac{\theta}{360^\circ} \quad\text{or}\quad \frac{\theta}{2\pi}\ (\text{radians})`, "The sector’s arc and area are in the same proportion as its angle."],
    ["Apply that fraction to the circumference and the area.", R`s = \frac{\theta}{2\pi}\times2\pi r = r\theta, \qquad A = \frac{\theta}{2\pi}\times\pi r^2 = \tfrac12r^2\theta`, "In radians the formulas are at their simplest, which is why radians are used."],
    ["A prism has the same cross-section all the way along.", R`V = A_{\text{cross-section}}\times\text{length}, \qquad V_{\text{cylinder}} = \pi r^2h`, "Stack thin identical slices."],
    ["Unroll the curved surface of a cylinder into a rectangle.", R`A_{\text{curved}} = 2\pi r\times h, \qquad A_{\text{total}} = 2\pi rh + 2\pi r^2`, "Its width is the circumference of the circle and its height is h. Add the two circular ends."]
  ], R`A = \tfrac12(a + b)h, \qquad s = r\theta, \qquad A_{\text{sector}} = \tfrac12r^2\theta, \qquad V = \pi r^2h`, [
    "s = rθ and A = ½r²θ need θ in radians.",
    "A pyramid or cone has one-third the volume of the prism or cylinder with the same base and height; a sphere has volume (4/3)πr³."
  ]);

  d('m-trig-rules', [
    ["In triangle ABC drop a perpendicular of height h from C onto side c.", R`h = b\sin A = a\sin B`, "The height is the opposite side in each of the two right-angled triangles."],
    ["Rearrange.", R`\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}`, "The sine rule; the third ratio follows by dropping a different perpendicular."],
    ["Use the same height for the area.", R`\text{Area} = \tfrac12\,c\,h = \tfrac12\,bc\sin A`, "Half base times height. In words: half the product of two sides and the sine of the angle between them."],
    ["Place C at the origin with side a along the x-axis. Then B = (a, 0) and A = (b cos C, b sin C).", R`c^2 = (a - b\cos C)^2 + (b\sin C)^2`, "c is the distance from A to B, by Pythagoras."],
    ["Expand and use sin² + cos² = 1.", R`c^2 = a^2 + b^2 - 2ab\cos C`, "The cosine rule. With C = 90° it is Pythagoras’ theorem."]
  ], R`\frac{a}{\sin A} = \frac{b}{\sin B}, \qquad c^2 = a^2 + b^2 - 2ab\cos C, \qquad \text{Area} = \tfrac12ab\sin C`, [
    "Finding an angle with the sine rule can give two answers (θ and 180° − θ); check which fits the triangle.",
    "In 3D problems, first pick out a right-angled triangle that contains the length or angle you need."
  ]);

  d('m-transformations', [
    ["A quarter turn anticlockwise about the origin moves the two unit vectors.", R`\begin{pmatrix}1\\0\end{pmatrix} \to \begin{pmatrix}0\\1\end{pmatrix}, \qquad \begin{pmatrix}0\\1\end{pmatrix} \to \begin{pmatrix}-1\\0\end{pmatrix}`, "East turns to north, north turns to west."],
    ["Any point is x of the first plus y of the second, and rotation preserves that combination.", R`\begin{pmatrix}x\\y\end{pmatrix} \to x\begin{pmatrix}0\\1\end{pmatrix} + y\begin{pmatrix}-1\\0\end{pmatrix} = \begin{pmatrix}-y\\x\end{pmatrix}`, "The grid turns rigidly, so coordinates relative to the turned axes are unchanged."],
    ["Reflection in the line y = x swaps the axes; enlargement from the origin scales both coordinates.", R`(x, y) \to (y, x), \qquad (x, y) \to (kx, ky)`, "Follow the unit vectors in the same way."],
    ["The vector from A to B is found by going back to the origin and out again.", R`\overrightarrow{AB} = \overrightarrow{AO} + \overrightarrow{OB} = \mathbf b - \mathbf a`, "Vectors add tip to tail."],
    ["Example of a proof: M and N are the midpoints of AB and AC.", R`\overrightarrow{MN} = \tfrac12(\mathbf a + \mathbf c) - \tfrac12(\mathbf a + \mathbf b) = \tfrac12(\mathbf c - \mathbf b) = \tfrac12\overrightarrow{BC}`, "MN is parallel to BC and half as long: the midpoint theorem, in one line."]
  ], R`(x, y) \to (-y, x) \ \text{(90° anticlockwise)}, \qquad \overrightarrow{AB} = \mathbf b - \mathbf a`, [
    "A translation is not about the origin and cannot be written as a 2 × 2 matrix; it adds a vector instead.",
    "Two vectors are parallel exactly when one is a multiple of the other."
  ]);

  d('m-probability-gcse', [
    ["With equally likely outcomes, probability is a count.", R`P(A) = \frac{\text{outcomes in } A}{\text{all outcomes}}`, "Coins, dice and cards. Otherwise it is estimated by relative frequency over many trials."],
    ["Count the outcomes in A or B using a Venn diagram.", R`n(A \cup B) = n(A) + n(B) - n(A \cap B) \;\Longrightarrow\; P(A \cup B) = P(A) + P(B) - P(A \cap B)`, "The overlap was counted twice, so subtract it once. Divide by the total."],
    ["Given that B has happened, only B’s outcomes remain possible.", R`P(A \mid B) = \frac{n(A \cap B)}{n(B)} = \frac{P(A \cap B)}{P(B)}`, "B becomes the new “all outcomes”."],
    ["Rearrange: this is the rule for multiplying along a tree diagram.", R`P(A \cap B) = P(B)\times P(A \mid B)`, "Probability of the first branch times the probability of the second, given the first."],
    ["If knowing B changes nothing about A, the events are independent.", R`P(A \mid B) = P(A) \;\Longrightarrow\; P(A \cap B) = P(A)\,P(B)`, "Only then may you simply multiply the separate probabilities."]
  ], R`P(A \cup B) = P(A) + P(B) - P(A \cap B), \qquad P(A \cap B) = P(B)\,P(A \mid B)`, [
    "Drawing without replacement changes the second set of branches: the events are not independent.",
    "P(A | B) and P(B | A) are different things; confusing them is a common and serious error."
  ]);

  d('m-statistics', [
    ["The mean shares the total equally.", R`\bar x = \frac{\sum x}{n}`, "Add the values and divide by how many there are."],
    ["Deviations from the mean always cancel.", R`\sum(x - \bar x) = \sum x - n\bar x = 0`, "The mean is the balance point of the data."],
    ["So one extreme value drags the mean with it, while the median hardly moves.", R`\bar x_{\text{new}} = \bar x + \frac{x_{\text{new}} - \bar x}{n + 1}`, "The median depends only on the order of the values, not on how far out the largest one is."],
    ["For grouped data the individual values are unknown, so use the middle of each class.", R`\bar x \approx \frac{\sum f\,x_{\text{mid}}}{\sum f}`, "An estimate: it assumes values are spread evenly within each class."],
    ["In a histogram with unequal classes, plot frequency density so that area represents frequency.", R`\text{frequency density} = \frac{\text{frequency}}{\text{class width}} \;\Longrightarrow\; \text{area of bar} = \text{frequency}`, "Otherwise a wide class would look more important than it is."]
  ], R`\bar x = \frac{\sum x}{n}, \qquad \sum(x - \bar x) = 0, \qquad \text{frequency density} = \frac{\text{frequency}}{\text{class width}}`, [
    "Correlation on a scatter graph does not show that one variable causes the other.",
    "The interquartile range Q₃ − Q₁ measures the spread of the middle half and, like the median, ignores extremes."
  ]);
})();
/* ---- derive-7.js ---- */
/* Geodesic — derivations for notes-only topics: A-level maths (pure, mechanics, statistics). */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('m-vectors', [
    ["The length of a vector in three dimensions comes from Pythagoras’ theorem applied twice.", R`|\mathbf v| = \sqrt{x^2 + y^2 + z^2}`, "First in the horizontal plane, d² = x² + y²; then with the vertical, |v|² = d² + z²."],
    ["Two vectors a and b drawn from one point make a triangle whose third side is a − b. Apply the cosine rule.", R`|\mathbf a - \mathbf b|^2 = |\mathbf a|^2 + |\mathbf b|^2 - 2|\mathbf a||\mathbf b|\cos\theta`, "θ is the angle between a and b."],
    ["Work out the same length from components.", R`|\mathbf a - \mathbf b|^2 = \sum_i(a_i - b_i)^2 = |\mathbf a|^2 + |\mathbf b|^2 - 2(a_1b_1 + a_2b_2 + a_3b_3)`, "Expand each bracket and collect the squares."],
    ["Compare the two results.", R`a_1b_1 + a_2b_2 + a_3b_3 = |\mathbf a||\mathbf b|\cos\theta \equiv \mathbf a\cdot\mathbf b`, "The sum of products of components measures how far the two vectors point the same way. It is called the scalar (dot) product."],
    ["So the angle between two vectors follows from their components, and perpendicular vectors have zero dot product.", R`\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}, \qquad \mathbf a\cdot\mathbf b = 0 \iff \mathbf a\perp\mathbf b`, "cos 90° = 0, for vectors that are not zero."]
  ], R`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = |\mathbf a||\mathbf b|\cos\theta`, [
    "The component formula needs perpendicular unit axes; in skewed or curved coordinates a metric appears, as in relativity.",
    "The dot product is a number, not a vector. Work done, W = F·s, is the standard physical example."
  ]);

  d('m-differentiation', [
    ["The gradient of the chord from x to x + h.", R`\frac{f(x+h) - f(x)}{h}`, "Rise over run between two points on the curve."],
    ["Let h shrink towards zero: the chord becomes the tangent.", R`f'(x) = \lim_{h\to0}\frac{f(x+h) - f(x)}{h}`, "The limit is the value the chord gradient approaches; h itself never equals zero."],
    ["Apply this to xⁿ using the binomial expansion.", R`\frac{(x+h)^n - x^n}{h} = nx^{n-1} + \binom n2x^{n-2}h + \dots \;\to\; nx^{n-1}`, "(x + h)ⁿ = xⁿ + nx^{n−1}h + … Every term after the first still contains h and vanishes in the limit."],
    ["For a product, add and subtract f(x)g(x + h).", R`\frac{f(x+h)g(x+h) - f(x)g(x)}{h} = \frac{f(x+h) - f(x)}{h}\,g(x+h) + f(x)\,\frac{g(x+h) - g(x)}{h} \;\to\; f'g + fg'`, "A rectangle with sides f and g grows by two thin strips; the tiny corner is negligible."],
    ["For a function of a function, y = f(u) with u = g(x):", R`\frac{\delta y}{\delta x} = \frac{\delta y}{\delta u}\cdot\frac{\delta u}{\delta x} \;\to\; \frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}`, "Rates multiply: if y changes 3 times as fast as u, and u changes 2 times as fast as x, then y changes 6 times as fast as x."]
  ], R`(x^n)' = nx^{n-1}, \qquad (uv)' = u'v + uv', \qquad \frac{dy}{dx} = \frac{dy}{du}\frac{du}{dx}`, [
    "The limit must exist: |x| has no derivative at x = 0, where the gradients from the left and right differ.",
    "The binomial argument here is for positive whole n; the result nx^{n−1} holds for every real n and is proved with logarithms.",
    "The chain-rule line divides by δu, which could be zero; a full proof avoids that."
  ]);

  d('m-integration', [
    ["Define the area under y = f(t) from a to x as a function of x.", R`A(x) = \int_a^xf(t)\,dt`, "The integral is the limit of a sum of thin strips of area f(t) δt."],
    ["Increase x by a small h. The extra area is one thin strip.", R`f_{\min}\,h \le A(x+h) - A(x) \le f_{\max}\,h`, "The strip lies between the rectangles with the least and the greatest height of f in the interval."],
    ["Divide by h and let h → 0.", R`A'(x) = \lim_{h\to0}\frac{A(x+h) - A(x)}{h} = f(x)`, "For a continuous f both bounds squeeze to f(x). The rate at which area accumulates is the height of the curve."],
    ["So A is an antiderivative of f. Any other antiderivative F differs from it by a constant.", R`A(x) = F(x) + c, \qquad A(a) = 0 \;\Longrightarrow\; c = -F(a)`, "Two functions with the same derivative everywhere differ by a constant."],
    ["Put x = b.", R`\int_a^bf(x)\,dx = F(b) - F(a)`, "The fundamental theorem of calculus: areas are found by undoing differentiation."],
    ["Reversing the product rule gives integration by parts.", R`(uv)' = u'v + uv' \;\Longrightarrow\; \int u\,v'\,dx = uv - \int u'\,v\,dx`, "Integrate both sides and rearrange."]
  ], R`\int_a^bf(x)\,dx = F(b) - F(a), \ \ F' = f; \qquad \int x^n\,dx = \frac{x^{n+1}}{n+1} + c \ \ (n \ne -1)`, [
    "f must be continuous on [a, b]: the integral of 1/x² across x = 0 cannot be evaluated this way.",
    "Area below the axis counts as negative. For n = −1 the antiderivative is ln|x|."
  ]);

  d('m-exp-log', [
    ["Differentiate aˣ from first principles.", R`\frac{a^{x+h} - a^x}{h} = a^x\cdot\frac{a^h - 1}{h} \;\to\; k(a)\,a^x`, "The limit of (a^h − 1)/h is a number that depends only on a. Every exponential is proportional to its own gradient."],
    ["Define e as the base for which that constant is exactly 1.", R`\lim_{h\to0}\frac{e^h - 1}{h} = 1 \;\Longrightarrow\; \frac{d}{dx}e^x = e^x`, "Its gradient at every point equals its height."],
    ["Find its value. For small h, e^h ≈ 1 + h.", R`e \approx (1 + h)^{1/h} \;\Longrightarrow\; e = \lim_{n\to\infty}\left(1 + \frac1n\right)^n = 2.71828\ldots`, "Put h = 1/n. This is 100% interest compounded n times a year, in the limit of continuous compounding."],
    ["The natural logarithm is the inverse of the exponential.", R`y = \ln x \iff x = e^y`, "ln x is the power to which e must be raised to give x."],
    ["Differentiate x = e^y with respect to x.", R`1 = e^y\frac{dy}{dx} \;\Longrightarrow\; \frac{d}{dx}\ln x = \frac{1}{e^y} = \frac1x`, "The chain rule, then replace e^y by x."],
    ["The laws of logarithms are the index laws read backwards.", R`e^pe^q = e^{p+q} \;\Longrightarrow\; \ln(xy) = \ln x + \ln y; \qquad a^x = e^{x\ln a} \;\Longrightarrow\; \frac{d}{dx}a^x = a^x\ln a`, "Put x = e^p and y = e^q. The second result shows that the constant k(a) is ln a."]
  ], R`\frac{d}{dx}e^x = e^x, \qquad \frac{d}{dx}\ln x = \frac1x, \qquad \ln(xy) = \ln x + \ln y`, [
    "ln x is defined only for x > 0.",
    "That the limit defining e exists needs proof: the sequence (1 + 1/n)ⁿ increases and stays below 3."
  ]);

  d('m-ode1', [
    ["Radioactive decay: the rate of loss is proportional to the amount present.", R`\frac{dN}{dt} = -\lambda N`, "Each nucleus has the same chance of decaying in each second."],
    ["Separate the variables and integrate.", R`\int\frac{dN}{N} = -\lambda\int dt \;\Longrightarrow\; \ln N = -\lambda t + c`, "Everything involving N on one side, everything involving t on the other."],
    ["Exponentiate and apply the initial condition.", R`N = e^ce^{-\lambda t} = N_0e^{-\lambda t}`, "At t = 0, N = N₀, so e^c = N₀."],
    ["A linear equation that does not separate can be made exact with an integrating factor.", R`\frac{dy}{dx} + P(x)\,y = Q(x), \qquad \mu(x) = e^{\int P\,dx} \;\Longrightarrow\; \mu' = \mu P`, "μ is chosen so that μy′ + μPy is the derivative of a product."],
    ["Multiply the equation by μ.", R`\frac{d}{dx}(\mu y) = \mu Q \;\Longrightarrow\; y = \frac1\mu\left(\int\mu Q\,dx + c\right)`, "The left side is (μy)′ by the product rule."],
    ["Example: falling from rest with air resistance bv.", R`\frac{dv}{dt} + \frac bmv = g, \quad \mu = e^{bt/m} \;\Longrightarrow\; v = \frac{mg}{b}\left(1 - e^{-bt/m}\right)`, "The speed approaches the terminal value mg/b, at which drag balances weight."]
  ], R`N = N_0e^{-\lambda t}; \qquad y = \frac1\mu\left(\int\mu Q\,dx + c\right), \quad \mu = e^{\int P\,dx}`, [
    "Separation needs dy/dx = f(x)g(y). Dividing by g(y) loses any constant solution with g(y) = 0, which must be checked separately.",
    "A first-order equation has one arbitrary constant and needs one condition to fix it."
  ]);

  d('m-functions', [
    ["Suppose (x₀, y₀) lies on y = f(x). On y = f(x + a), where does the same height y₀ occur?", R`f(x + a) = f(x_0) \quad\text{when}\quad x = x_0 - a`, "The new function reaches each value a units earlier, so the graph moves a units to the left. Changes inside the bracket act on x and do the opposite of what they seem."],
    ["On y = f(bx) the same height occurs where bx = x₀.", R`x = \frac{x_0}{b}`, "A stretch parallel to the x-axis with scale factor 1/b."],
    ["Changes outside the function act on y directly.", R`y = f(x) + b: \ \text{up by } b; \qquad y = af(x): \ \text{stretch by } a \ \text{in } y`, "Every height is increased by b, or multiplied by a."],
    ["Negative signs reflect.", R`y = -f(x): \ \text{reflection in the } x\text{-axis}; \qquad y = f(-x): \ \text{reflection in the } y\text{-axis}`, "Either each height changes sign, or the value at x is taken from −x."],
    ["The inverse function swaps inputs and outputs.", R`(x_0, y_0) \ \text{on}\ y = f(x) \iff (y_0, x_0) \ \text{on}\ y = f^{-1}(x)`, "Swapping coordinates is a reflection in the line y = x. The domain of f⁻¹ is the range of f."]
  ], R`y = f(x + a): \ \text{shift}\ \begin{pmatrix}-a\\0\end{pmatrix}; \qquad y = f(bx): \ \text{stretch}\times\tfrac1b \ \text{in } x; \qquad y = af(x): \ \text{stretch}\times a \ \text{in } y`, [
    "Order matters: f(2x + 3) is a shift of 3 to the left followed by a stretch of ½, or a stretch of ½ followed by a shift of 3/2.",
    "Only a one-to-one function has an inverse; restrict the domain first (x² to x ≥ 0, sin x to −π/2 ≤ x ≤ π/2)."
  ]);

  d('m-circles', [
    ["A circle is the set of points at a fixed distance r from the centre (a, b).", R`\sqrt{(x - a)^2 + (y - b)^2} = r \;\Longrightarrow\; (x - a)^2 + (y - b)^2 = r^2`, "The distance formula, squared."],
    ["Expand.", R`x^2 + y^2 - 2ax - 2by + (a^2 + b^2 - r^2) = 0`, "Equal coefficients of x² and y², and no xy term: the signature of a circle."],
    ["Compare with the general form to read off the centre and radius.", R`x^2 + y^2 + 2gx + 2fy + c = 0: \qquad \text{centre}\ (-g, -f), \quad r = \sqrt{g^2 + f^2 - c}`, "Matching coefficients: g = −a, f = −b, c = a² + b² − r². In practice, complete the square in x and in y."],
    ["To find where the line y = mx + k meets the circle, substitute.", R`(x - a)^2 + (mx + k - b)^2 = r^2 \qquad \text{(a quadratic in } x)`, "A point on both must satisfy both equations."],
    ["The discriminant counts the intersections.", R`\Delta > 0: \ \text{two points}; \qquad \Delta = 0: \ \text{tangent}; \qquad \Delta < 0: \ \text{no intersection}`, "A tangent touches at exactly one point: a repeated root."],
    ["The tangent at P(x₁, y₁) is perpendicular to the radius.", R`m_{\text{radius}} = \frac{y_1 - b}{x_1 - a} \;\Longrightarrow\; m_{\text{tangent}} = -\frac{x_1 - a}{y_1 - b}`, "Using m₁m₂ = −1."]
  ], R`(x - a)^2 + (y - b)^2 = r^2; \qquad x^2 + y^2 + 2gx + 2fy + c = 0 \;\Rightarrow\; (-g, -f),\ r = \sqrt{g^2 + f^2 - c}`, [
    "The general form is a real circle only if g² + f² − c > 0.",
    "The perpendicular bisector of any chord passes through the centre, which locates the circle through three given points."
  ]);

  d('m-radians', [
    ["Define an angle by the arc it cuts off, measured in radii.", R`\theta = \frac sr \;\Longrightarrow\; s = r\theta`, "The ratio is the same for every circle, since all circles are similar, so it measures the angle alone. One radian is the angle whose arc equals the radius."],
    ["A full turn has arc 2πr.", R`\theta_{\text{full}} = \frac{2\pi r}{r} = 2\pi \;\Longrightarrow\; 180^\circ = \pi\ \text{rad}`, "So 1 rad = 180°/π ≈ 57.3°."],
    ["A sector is the fraction θ/2π of the disc.", R`A = \frac{\theta}{2\pi}\cdot\pi r^2 = \tfrac12r^2\theta`, "Area is proportional to angle."],
    ["Compare three areas for a small angle in a unit circle: the triangle inside the sector, the sector itself, and the triangle formed with the tangent.", R`\tfrac12\sin\theta < \tfrac12\theta < \tfrac12\tan\theta`, "Each shape contains the one before."],
    ["Divide by ½ sin θ and invert.", R`\cos\theta < \frac{\sin\theta}{\theta} < 1 \;\Longrightarrow\; \lim_{\theta\to0}\frac{\sin\theta}{\theta} = 1`, "As θ → 0, cos θ → 1 and the ratio is squeezed. This limit is what makes the derivative of sin x equal to cos x, and it holds only in radians."],
    ["The small-angle approximations follow.", R`\sin\theta \approx \theta, \qquad \tan\theta \approx \theta, \qquad \cos\theta = 1 - 2\sin^2\tfrac\theta2 \approx 1 - \tfrac12\theta^2`, "For sin θ the error stays below 1% up to about 0.24 rad (14°)."]
  ], R`s = r\theta, \qquad A = \tfrac12r^2\theta, \qquad \lim_{\theta\to0}\frac{\sin\theta}{\theta} = 1`, [
    "All of these need θ in radians; in degrees each formula picks up factors of π/180.",
    "A radian is a ratio of two lengths and so has no dimension."
  ]);

  d('m-trig-identities', [
    ["Put P = (cos A, sin A) and Q = (cos B, sin B) on the unit circle and find the chord PQ from coordinates.", R`PQ^2 = (\cos A - \cos B)^2 + (\sin A - \sin B)^2 = 2 - 2(\cos A\cos B + \sin A\sin B)`, "Expand and use sin² + cos² = 1 twice."],
    ["Find the same chord from the cosine rule in triangle OPQ.", R`PQ^2 = 1^2 + 1^2 - 2\cos(A - B)`, "The angle at the centre between OP and OQ is A − B."],
    ["Equate.", R`\cos(A - B) = \cos A\cos B + \sin A\sin B`, "Both expressions for the chord hold for all angles, so the identity does too."],
    ["Replace B by −B, then use sin x = cos(90° − x).", R`\cos(A + B) = \cos A\cos B - \sin A\sin B, \qquad \sin(A + B) = \sin A\cos B + \cos A\sin B`, "Cosine is even and sine is odd. For the second: sin(A + B) = cos((90° − A) − B)."],
    ["Put B = A.", R`\sin2A = 2\sin A\cos A, \qquad \cos2A = \cos^2A - \sin^2A = 1 - 2\sin^2A = 2\cos^2A - 1`, "The three forms of cos 2A come from sin² + cos² = 1."],
    ["Any combination of a sine and a cosine of the same angle is a single shifted sine.", R`a\sin\theta + b\cos\theta = R\sin(\theta + \alpha), \qquad R = \sqrt{a^2 + b^2}, \quad \tan\alpha = \frac ba`, "Expand R sin(θ + α) and match: R cos α = a and R sin α = b. Square and add for R; divide for α."]
  ], R`\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B, \qquad \cos(A \pm B) = \cos A\cos B \mp \sin A\sin B`, [
    "Dividing sin² + cos² = 1 by cos² or sin² gives 1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ, valid where the divisor is not zero.",
    "When solving equations never cancel a factor such as sin θ: it may be zero and those solutions would be lost."
  ]);

  d('m-series', [
    ["Arithmetic series: write the sum forwards and backwards.", R`S_n = a + (a + d) + \dots + l, \qquad S_n = l + (l - d) + \dots + a`, "l = a + (n − 1)d is the last term."],
    ["Add the two lines term by term.", R`2S_n = n(a + l) \;\Longrightarrow\; S_n = \tfrac n2(a + l) = \tfrac n2\left[2a + (n - 1)d\right]`, "Every pair adds to a + l, and there are n pairs."],
    ["Geometric series: multiply by r and subtract.", R`S_n - rS_n = a - ar^n \;\Longrightarrow\; S_n = \frac{a(1 - r^n)}{1 - r}`, "S = a + ar + … + ar^{n−1} and rS = ar + … + arⁿ share all their middle terms."],
    ["If |r| < 1 the power rⁿ dies away.", R`S_\infty = \frac{a}{1 - r} \qquad (|r| < 1)`, "Infinitely many terms can have a finite sum."],
    ["Binomial expansion: multiply out n brackets (a + b).", R`(a + b)^n = \sum_{k=0}^n\binom nka^{n-k}b^k, \qquad \binom nk = \frac{n!}{k!\,(n - k)!}`, "The term a^{n−k}b^k arises once for each way of choosing which k of the brackets supply b."],
    ["For powers that are not positive whole numbers the series does not stop.", R`(1 + x)^n = 1 + nx + \frac{n(n - 1)}{2!}x^2 + \frac{n(n - 1)(n - 2)}{3!}x^3 + \dots \qquad (|x| < 1)`, "The same coefficients, written so that they make sense for any n."]
  ], R`S_n = \tfrac n2(a + l), \qquad S_n = \frac{a(1 - r^n)}{1 - r}, \qquad S_\infty = \frac{a}{1 - r}, \qquad (a + b)^n = \sum_k\binom nka^{n-k}b^k`, [
    "The infinite binomial series converges only for |x| < 1; for (a + bx)ⁿ take out aⁿ first and require |bx/a| < 1.",
    "The sum to infinity of a geometric series exists only for |r| < 1."
  ]);

  d('m-polynomials', [
    ["Divide a polynomial f(x) by (x − a).", R`f(x) = (x - a)\,q(x) + r`, "Like 17 = 5 × 3 + 2. The remainder has lower degree than the divisor, so here it is a constant."],
    ["Put x = a.", R`f(a) = 0\cdot q(a) + r = r`, "The remainder theorem: the remainder on dividing by (x − a) is f(a). No division is needed."],
    ["So a zero remainder means a factor, and conversely.", R`f(a) = 0 \iff (x - a) \ \text{is a factor of}\ f(x)`, "The factor theorem. Each root gives a linear factor."],
    ["Partial fractions reverse the addition of algebraic fractions.", R`\frac{px + q}{(x - a)(x - b)} = \frac{A}{x - a} + \frac{B}{x - b} \;\Longrightarrow\; px + q = A(x - b) + B(x - a)`, "Multiply through by the denominator. The result must hold for every x."],
    ["Choose x to remove one unknown at a time.", R`x = a: \ A = \frac{pa + q}{a - b}; \qquad x = b: \ B = \frac{pb + q}{b - a}`, "An identity is true for all values, including the convenient ones."],
    ["A modulus is a distance.", R`|x - a| < k \iff a - k < x < a + k`, "The points whose distance from a is less than k."]
  ], R`f(x) = (x - a)\,q(x) + f(a); \qquad f(a) = 0 \iff (x - a) \ \text{is a factor}`, [
    "Partial fractions need the numerator to have lower degree than the denominator (divide first if not); a repeated factor (x − a)² needs both A/(x − a) and B/(x − a)².",
    "For equations such as |f(x)| = g(x), check each solution: squaring or splitting into cases can add false ones."
  ]);

  d('m-numerical-roots', [
    ["If a continuous function changes sign it must cross zero.", R`f(a)\,f(b) < 0 \;\Longrightarrow\; \text{a root in } (a, b)`, "A continuous curve cannot get from below the axis to above it without crossing."],
    ["Rearrange f(x) = 0 as x = g(x) and iterate.", R`x_{n+1} = g(x_n), \qquad \alpha = g(\alpha)`, "The root α is a fixed point of g."],
    ["Follow the error e_n = x_n − α.", R`e_{n+1} = g(x_n) - g(\alpha) \approx g'(\alpha)\,e_n`, "Near α the change in g is its gradient times the change in x."],
    ["So the iteration converges when the gradient is small enough.", R`|g'(\alpha)| < 1`, "Each step multiplies the error by about g′(α). If it is positive the iterates approach as a staircase; if negative, as a cobweb."],
    ["Newton–Raphson follows the tangent down to the axis.", R`0 = f(x_n) + f'(x_n)(x_{n+1} - x_n) \;\Longrightarrow\; x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}`, "Replace the curve by its tangent at x_n and solve."],
    ["For this choice of g the gradient at the root is zero.", R`g'(x) = \frac{f(x)\,f''(x)}{f'(x)^2} \;\Longrightarrow\; g'(\alpha) = 0 \;\Longrightarrow\; e_{n+1} \propto e_n^2`, "The number of correct digits roughly doubles at every step."]
  ], R`x_{n+1} = g(x_n) \ \text{converges if}\ |g'(\alpha)| < 1; \qquad x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}`, [
    "A sign change can miss a pair of roots or a repeated root, and can be faked by an asymptote such as that of 1/x.",
    "Newton–Raphson fails near a stationary point, where the tangent is almost horizontal.",
    "For areas, the trapezium rule (h/2)[y₀ + 2(y₁ + … + y_{n−1}) + y_n] overestimates when the curve bends upwards."
  ]);

  d('m-statics', [
    ["A force F at an angle θ to a chosen direction has two perpendicular components.", R`F_\parallel = F\cos\theta, \qquad F_\perp = F\sin\theta`, "From the right-angled triangle with F as hypotenuse."],
    ["A particle in equilibrium has no resultant force in any direction.", R`\sum F_x = 0, \qquad \sum F_y = 0`, "Newton’s first law. Two independent directions give two equations."],
    ["A block rests on a rough slope at angle θ. Resolve perpendicular and parallel to the slope.", R`R = mg\cos\theta, \qquad F = mg\sin\theta`, "Axes along and perpendicular to the slope keep R and F out of each other’s equations."],
    ["Friction can supply only a limited force.", R`F \le \mu R`, "The experimental law of friction: the maximum is proportional to the normal reaction."],
    ["Combine.", R`mg\sin\theta \le \mu\,mg\cos\theta \;\Longrightarrow\; \tan\theta \le \mu`, "The block stays put up to the angle where tan θ = μ, whatever its mass."],
    ["Three forces in equilibrium form a closed triangle. Apply the sine rule to it.", R`\frac{F_1}{\sin\alpha_1} = \frac{F_2}{\sin\alpha_2} = \frac{F_3}{\sin\alpha_3}`, "Lami’s theorem: α₁ is the angle between the other two forces, F₂ and F₃."]
  ], R`R = mg\cos\theta, \qquad F \le \mu R, \qquad \text{slips when}\ \tan\theta > \mu`, [
    "F = μR holds only when sliding or about to slide; otherwise friction is whatever equilibrium requires, up to that limit.",
    "A particle model ignores turning effects: an extended body can topple before it slides."
  ]);

  d('m-kinematics-calc', [
    ["Velocity is the rate of change of displacement; acceleration is the rate of change of velocity.", R`v = \frac{ds}{dt}, \qquad a = \frac{dv}{dt} = \frac{d^2s}{dt^2}`, "The gradients of the s–t and v–t graphs."],
    ["For constant acceleration, integrate once.", R`v = \int a\,dt = at + c, \quad v(0) = u \;\Longrightarrow\; v = u + at`, "The constant of integration is fixed by the initial velocity."],
    ["Integrate again.", R`s = \int(u + at)\,dt = ut + \tfrac12at^2`, "Taking s = 0 at t = 0. This is the area under the v–t graph."],
    ["Use the chain rule to write acceleration in terms of distance.", R`a = \frac{dv}{dt} = \frac{dv}{ds}\cdot\frac{ds}{dt} = v\frac{dv}{ds}`, "Useful whenever the force depends on position and not on time."],
    ["Integrate with respect to s, for constant a.", R`\int_u^vv\,dv = \int_0^sa\,ds \;\Longrightarrow\; \tfrac12v^2 - \tfrac12u^2 = as \;\Longrightarrow\; v^2 = u^2 + 2as`, "Multiply by the mass and this is the work–energy principle."]
  ], R`v = u + at, \qquad s = ut + \tfrac12at^2, \qquad v^2 = u^2 + 2as, \qquad a = v\frac{dv}{ds}`, [
    "The suvat equations hold only for constant acceleration. If a varies, integrate: v = ∫a dt and s = ∫v dt.",
    "Displacement is not distance: if v changes sign, split the motion at that instant to find the distance travelled."
  ]);

  d('m-newton-mech', [
    ["A block slides down a rough slope at angle θ. Perpendicular to the slope there is no acceleration.", R`R = mg\cos\theta`, "The block stays on the surface."],
    ["Along the slope apply Newton’s second law, with friction at its sliding value.", R`mg\sin\theta - \mu R = ma \;\Longrightarrow\; a = g(\sin\theta - \mu\cos\theta)`, "The mass cancels. With μ = 0 this is a = g sin θ."],
    ["Two masses m₁ > m₂ hang from a light string over a smooth pulley. Write the second law for each.", R`m_1g - T = m_1a, \qquad T - m_2g = m_2a`, "The string does not stretch, so both accelerations have the same size; it is light and the pulley smooth, so the tension is the same throughout."],
    ["Add the equations to eliminate T.", R`a = \frac{(m_1 - m_2)\,g}{m_1 + m_2}`, "The unbalanced weight (m₁ − m₂)g accelerates the total mass m₁ + m₂."],
    ["Substitute back.", R`T = m_2(g + a) = \frac{2m_1m_2\,g}{m_1 + m_2}`, "The tension lies between the two weights, as it must for one mass to rise and the other to fall."]
  ], R`a = g(\sin\theta - \mu\cos\theta); \qquad a = \frac{(m_1 - m_2)g}{m_1 + m_2}, \quad T = \frac{2m_1m_2g}{m_1 + m_2}`, [
    "Light inextensible string and a light smooth pulley; a pulley with mass needs a torque equation, and the two tensions then differ.",
    "The slope result assumes the block is already sliding down; if tan θ < μ it does not start."
  ]);

  d('m-momentum-mech', [
    ["During a collision the two bodies exert equal and opposite forces on each other for the same time.", R`\int F_{12}\,dt = -\int F_{21}\,dt`, "Newton’s third law. The impulses are equal and opposite."],
    ["Impulse equals change of momentum for each body.", R`m_1(v_1 - u_1) = -m_2(v_2 - u_2) \;\Longrightarrow\; m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2`, "From F = d(mv)/dt. Total momentum is conserved whatever the forces between the bodies."],
    ["One more equation is needed. Newton’s experimental law relates the speeds of separation and approach.", R`v_2 - v_1 = e\,(u_1 - u_2), \qquad 0 \le e \le 1`, "e is the coefficient of restitution: 1 for a perfectly elastic collision, 0 if the bodies stick together."],
    ["Solve the pair of equations.", R`v_1 = \frac{m_1u_1 + m_2u_2 - m_2e\,(u_1 - u_2)}{m_1 + m_2}, \qquad v_2 = \frac{m_1u_1 + m_2u_2 + m_1e\,(u_1 - u_2)}{m_1 + m_2}`, "Substitute v₂ = v₁ + e(u₁ − u₂) into the momentum equation."],
    ["Work out the kinetic energy lost.", R`\Delta E_k = \tfrac12\cdot\frac{m_1m_2}{m_1 + m_2}\,(1 - e^2)\,(u_1 - u_2)^2`, "Zero only if e = 1. The lost energy becomes heat, sound and permanent deformation."]
  ], R`m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2, \qquad v_2 - v_1 = e\,(u_1 - u_2)`, [
    "No external impulse during the collision, or one small enough to neglect over the short contact time.",
    "Direct impact along the line of centres; in an oblique impact the law of restitution applies only to the components along that line.",
    "e is an empirical number that depends on both materials and, in practice, on the speed."
  ]);

  d('m-work-energy-mech', [
    ["The work done by a force whose point of application moves along a line.", R`W = \int F\,ds; \qquad W = Fs\cos\theta \ \ \text{for a constant force at angle } \theta`, "Only the component of the force along the motion does work."],
    ["Use Newton’s second law with a = v dv/ds.", R`W_{\text{net}} = \int m\,v\frac{dv}{ds}\,ds = \int_u^vm\,v\,dv = \tfrac12mv^2 - \tfrac12mu^2`, "The work done by the resultant force equals the change in kinetic energy: the work–energy principle."],
    ["The work done by gravity when a body rises through a height h is the same along any path.", R`W_{\text{grav}} = -mgh`, "Only the vertical displacement counts, because the weight is vertical. Such a force is called conservative."],
    ["Move that term to the other side and call mgh potential energy.", R`\tfrac12mu^2 + mgh_1 + W_{\text{other}} = \tfrac12mv^2 + mgh_2`, "W_{other} is the work done by all the remaining forces: positive for an engine, negative for resistance."],
    ["Power is the rate of doing work.", R`P = \frac{dW}{dt} = F\frac{ds}{dt} = Fv`, "For a force along the direction of motion."],
    ["A vehicle reaches its greatest speed when the driving force just balances the resistance R.", R`\frac{P}{v_{\max}} = R \;\Longrightarrow\; v_{\max} = \frac PR`, "No resultant force, so no acceleration."]
  ], R`W_{\text{net}} = \Delta\!\left(\tfrac12mv^2\right), \qquad P = Fv`, [
    "mgh assumes uniform g: heights small compared with the Earth’s radius.",
    "A normal reaction does no work on a body sliding on a fixed surface, because it is perpendicular to the motion; friction always removes mechanical energy."
  ]);

  d('m-data', [
    ["The variance is the mean squared deviation from the mean.", R`\sigma^2 = \frac{\sum(x - \bar x)^2}{n}`, "Squaring stops positive and negative deviations cancelling. The standard deviation σ has the same units as the data."],
    ["Expand the square.", R`\sigma^2 = \frac{\sum x^2 - 2\bar x\sum x + n\bar x^2}{n}`, "The mean is a constant and comes outside the sums."],
    ["Use Σx = n × mean.", R`\sigma^2 = \frac{\sum x^2}{n} - \bar x^2`, "Mean of the squares minus the square of the mean: much quicker to compute."],
    ["Code the data with y = (x − a)/b, so that x = a + by.", R`\bar x = a + b\bar y`, "Adding a constant shifts every value, and the mean, by the same amount; scaling multiplies them."],
    ["Deviations are unaffected by the shift and scaled by b.", R`x - \bar x = b\,(y - \bar y) \;\Longrightarrow\; \sigma_x = |b|\,\sigma_y`, "Spread does not depend on where the data sit, only on how far apart the values are."]
  ], R`\sigma^2 = \frac{\sum x^2}{n} - \bar x^2; \qquad y = \frac{x - a}{b} \;\Rightarrow\; \bar x = a + b\bar y, \ \ \sigma_x = |b|\,\sigma_y`, [
    "Dividing by n describes the data set itself; to estimate the variance of a population from a sample, divide by n − 1.",
    "For grouped data use mid-interval values; the results are then estimates."
  ]);

  d('m-combinatorics', [
    ["Arrange n different objects in a row.", R`n\times(n - 1)\times\dots\times2\times1 = n!`, "n choices for the first place, n − 1 for the second, and so on."],
    ["Fill only r places.", R`{}^nP_r = n(n - 1)\cdots(n - r + 1) = \frac{n!}{(n - r)!}`, "Stop after r factors; multiplying top and bottom by (n − r)! tidies it."],
    ["If order does not matter, each selection has been counted once for every ordering of its r members.", R`{}^nC_r = \frac{{}^nP_r}{r!} = \frac{n!}{r!\,(n - r)!}`, "Each group of r objects can be arranged in r! ways."],
    ["If some objects are identical, arrangements that differ only by swapping them are the same.", R`\frac{n!}{p!\,q!\cdots}`, "Divide by the number of ways of permuting each set of identical objects among themselves."],
    ["Choosing r to include is choosing n − r to leave out; and any selection either contains a particular object or does not.", R`\binom nr = \binom{n}{n - r}, \qquad \binom nr = \binom{n-1}{r-1} + \binom{n-1}{r}`, "The second identity is the rule that builds Pascal’s triangle."]
  ], R`{}^nP_r = \frac{n!}{(n - r)!}, \qquad {}^nC_r = \frac{n!}{r!\,(n - r)!}`, [
    "0! = 1 by convention, so that the formulas work for r = 0 and r = n.",
    "With restrictions, deal with the restricted items first: treat objects that must stay together as one block, or count the complement and subtract."
  ]);

  d('m-probability-al', [
    ["The probability of both A and B can be built in two ways.", R`P(A \cap B) = P(A \mid B)\,P(B) = P(B \mid A)\,P(A)`, "Either B happens and then A given B, or the other way round."],
    ["Equate them.", R`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}`, "Bayes’ theorem: it reverses a conditional probability."],
    ["B happens either with A or without it.", R`P(B) = P(B \mid A)\,P(A) + P(B \mid A')\,P(A')`, "The two branches of a tree diagram that end in B. A′ means “not A”."],
    ["Example: a condition affects 1% of people; a test detects it 95% of the time and gives a false positive 5% of the time.", R`P(\text{ill} \mid +) = \frac{0.95\times0.01}{0.95\times0.01 + 0.05\times0.99} = \frac{0.0095}{0.0590} \approx 0.16`, "Most positives come from the large healthy group. The answer is 16%, not 95%."],
    ["Two special cases.", R`\text{independent: } P(A \cap B) = P(A)\,P(B); \qquad \text{mutually exclusive: } P(A \cap B) = 0`, "Independent means P(A | B) = P(A). Exclusive events with non-zero probabilities are never independent: if one happens the other cannot."]
  ], R`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B \mid A)\,P(A) + P(B \mid A')\,P(A')}`, [
    "Needs P(B) > 0.",
    "The prior P(A) matters as much as the accuracy of the test; ignoring it is the base-rate fallacy."
  ]);

  d('m-discrete-rv', [
    ["A discrete random variable takes values x with probabilities that add to 1. Its mean and variance are weighted averages.", R`E(X) = \sum x\,P(X = x), \qquad \operatorname{Var}(X) = E(X^2) - [E(X)]^2`, "The long-run average of X, and of its squared deviation from that average."],
    ["Binomial: n independent trials, each a success with probability p (and q = 1 − p). One particular sequence with r successes has probability:", R`p^r\,q^{n-r}`, "Independent probabilities multiply."],
    ["Count the sequences.", R`P(X = r) = \binom nr\,p^r\,q^{n-r}`, "The r successes can be placed among the n trials in ⁿCᵣ ways."],
    ["Write X as a sum of n indicator variables, each 1 for a success and 0 otherwise.", R`E(X_i) = p, \quad \operatorname{Var}(X_i) = p - p^2 = pq \;\Longrightarrow\; E(X) = np, \quad \operatorname{Var}(X) = npq`, "Means always add; variances add because the trials are independent."],
    ["Geometric: the number of trials up to and including the first success.", R`P(X = r) = q^{r-1}p`, "r − 1 failures followed by a success."],
    ["Its mean:", R`E(X) = p\sum_{r=1}^\infty r\,q^{r-1} = \frac{p}{(1 - q)^2} = \frac1p`, "Differentiate the geometric series 1 + q + q² + … = 1/(1 − q) with respect to q."]
  ], R`X \sim B(n, p): \ P(X = r) = \binom nrp^rq^{n-r}, \ \ E = np, \ \ \operatorname{Var} = npq; \qquad X \sim \text{Geo}(p): \ E = \frac1p`, [
    "Binomial conditions: a fixed number of trials, two outcomes, constant p, independent trials. Sampling without replacement from a small population breaks the last two.",
    "The geometric distribution has no memory: P(X > m + n | X > m) = P(X > n)."
  ]);

  d('m-normal', [
    ["If X is normal with mean μ and standard deviation σ, measure it from the mean in units of σ.", R`Z = \frac{X - \mu}{\sigma}`, "A z-score: how many standard deviations above the mean."],
    ["Find the mean and variance of Z.", R`E(Z) = \frac{E(X) - \mu}{\sigma} = 0, \qquad \operatorname{Var}(Z) = \frac{\operatorname{Var}(X)}{\sigma^2} = 1`, "Subtracting a constant shifts the mean; dividing by σ divides the variance by σ²."],
    ["A shift and a change of scale do not alter the shape of the curve, so Z is normal too.", R`Z \sim N(0, 1), \qquad P(X < x) = \Phi\!\left(\frac{x - \mu}{\sigma}\right)`, "One table, for the standard normal, serves every normal distribution."],
    ["The curve is symmetric about zero.", R`\Phi(-z) = 1 - \Phi(z)`, "The area to the left of −z equals the area to the right of +z."],
    ["Working backwards from a probability:", R`x = \mu + z\sigma`, "Find z from the table, then undo the standardisation. Two such equations give μ and σ when both are unknown."],
    ["A binomial with large n is close to normal. Match the mean and variance and correct for discreteness.", R`X \sim B(n, p) \approx N(np,\ npq), \qquad P(X \le r) \approx \Phi\!\left(\frac{r + \tfrac12 - np}{\sqrt{npq}}\right)`, "The bar for X = r covers r − ½ to r + ½, so include the whole bar: the continuity correction."]
  ], R`Z = \frac{X - \mu}{\sigma} \sim N(0, 1), \qquad \Phi(-z) = 1 - \Phi(z)`, [
    "About 68%, 95% and 99.7% of values lie within 1, 2 and 3 standard deviations of the mean.",
    "The normal approximation to the binomial needs np and nq both greater than about 5.",
    "Many real quantities are only roughly normal; the tails beyond about 3σ are where the model is least reliable."
  ]);

  d('m-poisson', [
    ["Start with a binomial and let the number of trials grow while the mean λ = np stays fixed.", R`P(X = r) = \binom nr\left(\frac\lambda n\right)^r\left(1 - \frac\lambda n\right)^{n-r}`, "Many opportunities, each with a small chance: calls in a minute, decays in a second."],
    ["Regroup the factors.", R`= \frac{n(n-1)\cdots(n-r+1)}{n^r}\cdot\frac{\lambda^r}{r!}\cdot\left(1 - \frac\lambda n\right)^n\left(1 - \frac\lambda n\right)^{-r}`, "Separate what depends on n."],
    ["Let n → ∞ with r fixed.", R`\frac{n(n-1)\cdots(n-r+1)}{n^r} \to 1, \qquad \left(1 - \frac\lambda n\right)^n \to e^{-\lambda}, \qquad \left(1 - \frac\lambda n\right)^{-r} \to 1`, "The middle limit is the definition of the exponential function."],
    ["The Poisson distribution.", R`P(X = r) = \frac{e^{-\lambda}\lambda^r}{r!}, \qquad r = 0, 1, 2, \dots`, "Check: the sum of λʳ/r! over all r is e^{λ}, so the probabilities add to 1."],
    ["Mean and variance come from the same limit.", R`E(X) = np = \lambda, \qquad \operatorname{Var}(X) = npq = \lambda\left(1 - \frac\lambda n\right) \to \lambda`, "Mean equal to variance is the fingerprint of a Poisson process."]
  ], R`P(X = r) = \frac{e^{-\lambda}\lambda^r}{r!}, \qquad E(X) = \operatorname{Var}(X) = \lambda`, [
    "Events must occur singly, independently and at a constant average rate. Clustering (accidents, infections) makes the variance exceed the mean.",
    "As an approximation to B(n, p) it needs large n and small p (say n > 50 and np < 5); for λ above about 15 a normal N(λ, λ) with a continuity correction is adequate.",
    "Independent Poisson variables add: Po(λ₁) + Po(λ₂) = Po(λ₁ + λ₂)."
  ]);

  d('m-linear-combinations', [
    ["Expectation is a weighted sum, so it is linear.", R`E(aX + b) = \sum(ax + b)\,P(X = x) = aE(X) + b`, "The sum of xP gives E(X), and the probabilities add to 1."],
    ["Variance measures deviations from the mean, so the shift b drops out.", R`\operatorname{Var}(aX + b) = E\!\left[(aX + b - a\mu - b)^2\right] = a^2\operatorname{Var}(X)`, "Deviations are multiplied by a, squared deviations by a²."],
    ["For two variables, expand the squared deviation of the sum.", R`\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2E\!\left[(X - \mu_X)(Y - \mu_Y)\right]`, "The cross term is twice the covariance."],
    ["If X and Y are independent the cross term vanishes.", R`E\!\left[(X - \mu_X)(Y - \mu_Y)\right] = E(X - \mu_X)\,E(Y - \mu_Y) = 0 \;\Longrightarrow\; \operatorname{Var}(X \pm Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)`, "Variances add even for a difference, because (−1)² = 1: subtracting a random quantity adds uncertainty."],
    ["Compare n independent observations with n times one observation.", R`\operatorname{Var}(X_1 + \dots + X_n) = n\sigma^2, \qquad \operatorname{Var}(nX) = n^2\sigma^2`, "Independent fluctuations partly cancel; one fluctuation multiplied by n does not."]
  ], R`E(aX + bY) = aE(X) + bE(Y); \qquad \operatorname{Var}(aX \pm bY) = a^2\operatorname{Var}(X) + b^2\operatorname{Var}(Y) \ \ \text{(independent)}`, [
    "The expectation rule needs no independence; the variance rule does.",
    "Linear combinations of independent normal variables are normal. For other distributions only the mean and variance are known in general."
  ]);

  d('m-continuous-rv', [
    ["For a continuous variable, probability is area under a density curve.", R`P(a < X < b) = \int_a^bf(x)\,dx, \qquad f(x) \ge 0, \quad \int_{-\infty}^\infty f(x)\,dx = 1`, "f(x) δx is the probability of landing in a small interval δx. The probability of any single exact value is zero."],
    ["The cumulative distribution function collects the area up to x.", R`F(x) = P(X \le x) = \int_{-\infty}^xf(t)\,dt \;\Longrightarrow\; f(x) = F'(x)`, "The fundamental theorem of calculus."],
    ["The median splits the area in half; other percentiles similarly.", R`F(m) = \tfrac12`, "Half the probability lies on each side."],
    ["Mean and variance are the continuous versions of the discrete sums.", R`E(X) = \int x\,f(x)\,dx, \qquad \operatorname{Var}(X) = \int x^2f(x)\,dx - \mu^2`, "Replace P(X = x) by f(x) dx and the sum by an integral."],
    ["Example: a uniform distribution on [a, b].", R`f = \frac{1}{b - a}: \qquad E(X) = \frac{a + b}{2}, \qquad E(X^2) = \frac{a^2 + ab + b^2}{3}, \qquad \operatorname{Var}(X) = \frac{(b - a)^2}{12}`, "E(X²) = (b³ − a³)/3(b − a). So a rounding error of width w has standard deviation w/√12."]
  ], R`f(x) = F'(x), \qquad E(X) = \int xf(x)\,dx, \qquad \operatorname{Var}(X) = \int x^2f(x)\,dx - \mu^2`, [
    "f(x) is a density, not a probability: it can exceed 1 as long as the total area is 1.",
    "The mean need not exist: for the Cauchy distribution the integral for E(X) diverges."
  ]);

  d('m-sampling', [
    ["The sample mean is itself a random variable.", R`\bar X = \frac{X_1 + X_2 + \dots + X_n}{n}`, "A different sample would give a different mean."],
    ["Its expectation and variance follow from the rules for sums of independent variables.", R`E(\bar X) = \mu, \qquad \operatorname{Var}(\bar X) = \frac{1}{n^2}\cdot n\sigma^2 = \frac{\sigma^2}{n}`, "The sample mean is centred on the true mean and scatters less as n grows."],
    ["Its standard deviation is called the standard error.", R`\text{SE} = \frac{\sigma}{\sqrt n}`, "To halve the uncertainty you need four times the data."],
    ["For large n the sample mean is approximately normal, whatever the parent distribution.", R`\bar X \approx N\!\left(\mu, \frac{\sigma^2}{n}\right)`, "The central limit theorem. If the parent is normal this is exact for every n."],
    ["So 95% of sample means fall within 1.96 standard errors of μ. Rearrange the inequality.", R`P\!\left(\bar X - 1.96\frac{\sigma}{\sqrt n} < \mu < \bar X + 1.96\frac{\sigma}{\sqrt n}\right) = 0.95`, "“The mean is within 1.96 SE of μ” can be read either way round. The random quantity is the interval, not μ."],
    ["If σ is unknown, estimate it from the sample.", R`E\!\left[\sum(X_i - \bar X)^2\right] = n\sigma^2 - n\cdot\frac{\sigma^2}{n} = (n - 1)\sigma^2 \;\Longrightarrow\; s^2 = \frac{\sum(x - \bar x)^2}{n - 1}`, "Deviations from the sample mean are slightly smaller than deviations from μ, and n − 1 corrects for it."]
  ], R`\bar X \approx N\!\left(\mu, \frac{\sigma^2}{n}\right), \qquad \bar x \pm 1.96\frac{\sigma}{\sqrt n}, \qquad s^2 = \frac{\sum(x - \bar x)^2}{n - 1}`, [
    "The sample must be random: no amount of data repairs a biased sampling method.",
    "A 95% confidence interval means that the method captures μ in 95% of samples; it does not mean μ has a 95% chance of lying in this particular interval.",
    "With σ estimated from a small sample, the t-distribution should replace the normal."
  ]);

  d('m-hypothesis', [
    ["State a null hypothesis that fixes a definite distribution, and an alternative.", R`H_0: p = 0.5, \qquad H_1: p > 0.5`, "Example: is a coin biased towards heads? H₀ is the claim of no effect; the test asks whether the data would be surprising if H₀ were true."],
    ["Choose a significance level before looking at the data.", R`\alpha = 0.05`, "The probability of rejecting H₀ wrongly that you are prepared to accept."],
    ["Suppose 20 tosses give 15 heads. Find the probability of a result at least this extreme if H₀ is true.", R`P(X \ge 15 \mid p = 0.5) = \frac{21\,700}{2^{20}} = 0.0207`, "X ~ B(20, 0.5). “At least as extreme” means 15 or more, in the direction of H₁."],
    ["Compare with α.", R`0.0207 < 0.05 \;\Longrightarrow\; \text{reject } H_0`, "There is evidence at the 5% level that the coin favours heads. This is not proof."],
    ["Equivalently, find the critical region in advance.", R`P(X \ge 14) = 0.0577 > 0.05, \quad P(X \ge 15) = 0.0207 \;\Longrightarrow\; \text{critical region: } X \ge 15`, "The actual significance level is 2.07%: the probability of a type I error, rejecting a true H₀."],
    ["If the coin really has p = 0.7, the test can still fail to notice.", R`P(\text{type II}) = P(X \le 14 \mid p = 0.7) = 0.584, \qquad \text{power} = 1 - 0.584 = 0.416`, "A type II error is accepting a false H₀. Twenty tosses give a weak test; more data raise the power."]
  ], R`p\text{-value} = P(\text{result at least this extreme} \mid H_0); \qquad \text{reject } H_0 \ \text{if}\ p\text{-value} < \alpha`, [
    "A p-value is not the probability that H₀ is true, and “not significant” is not evidence that H₀ is true.",
    "For a two-tailed test (H₁: p ≠ p₀) put α/2 in each tail.",
    "Testing many hypotheses at 5% guarantees some false positives: about one true null in twenty is rejected."
  ]);
})();
/* ---- derive-8.js ---- */
/* Geodesic — derivations for notes-only topics: further maths (pure, mechanics, statistics). */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  d('m-roots-poly', [
    ["Write a cubic with roots α, β, γ in factorised form.", R`ax^3 + bx^2 + cx + d = a(x - \alpha)(x - \beta)(x - \gamma)`, "By the factor theorem each root gives a factor, and the leading coefficients must match."],
    ["Expand the right side.", R`= a\left[x^3 - (\alpha + \beta + \gamma)x^2 + (\alpha\beta + \beta\gamma + \gamma\alpha)x - \alpha\beta\gamma\right]`, "Collect the powers of x."],
    ["Compare coefficients.", R`\sum\alpha = -\frac ba, \qquad \sum\alpha\beta = \frac ca, \qquad \alpha\beta\gamma = -\frac da`, "Two polynomials that are equal for every x have equal coefficients. The signs alternate."],
    ["Other symmetric combinations follow without finding the roots.", R`\sum\alpha^2 = \left(\sum\alpha\right)^2 - 2\sum\alpha\beta, \qquad \sum\frac1\alpha = \frac{\sum\alpha\beta}{\alpha\beta\gamma}`, "Square the sum of the roots; put the reciprocals over a common denominator."],
    ["To get an equation whose roots are related to the old ones, substitute. For roots 2α, 2β, 2γ put y = 2x.", R`a\left(\frac y2\right)^3 + b\left(\frac y2\right)^2 + c\left(\frac y2\right) + d = 0 \;\Longrightarrow\; ay^3 + 2by^2 + 4cy + 8d = 0`, "If x satisfies the old equation then y = 2x satisfies the new one."]
  ], R`\sum\alpha = -\frac ba, \qquad \sum\alpha\beta = \frac ca, \qquad \alpha\beta\gamma = -\frac da`, [
    "The roots may be complex or repeated; the relations hold regardless, counting repeated roots as often as they occur.",
    "For degree n the product of the roots is (−1)ⁿ × (constant term)/a.",
    "If the sum of the squares of the roots comes out negative, the roots cannot all be real."
  ]);

  d('m-rational-graphs', [
    ["A rational function is a ratio of polynomials. It is undefined where the denominator is zero.", R`y = \frac{P(x)}{Q(x)}: \qquad Q(a) = 0,\ P(a) \ne 0 \;\Longrightarrow\; \text{vertical asymptote } x = a`, "Near x = a the denominator is tiny while the numerator is not, so |y| grows without limit."],
    ["For large |x| compare the leading terms. If the degrees are equal:", R`y = \frac{a_nx^n + \dots}{b_nx^n + \dots} = \frac{a_n + (\dots)/x}{b_n + (\dots)/x} \;\to\; \frac{a_n}{b_n}`, "Divide top and bottom by xⁿ; everything else vanishes. A horizontal asymptote. If the denominator has the higher degree, y → 0."],
    ["If the numerator’s degree is higher by one, divide.", R`\frac PQ = mx + c + \frac{r(x)}{Q(x)} \;\Longrightarrow\; \text{oblique asymptote } y = mx + c`, "The remainder term tends to zero for large |x|."],
    ["To find the range without calculus, ask for which y the equation y = P/Q has a real solution x. Example:", R`y = \frac{x}{x^2 + 1} \;\Longrightarrow\; yx^2 - x + y = 0 \;\Longrightarrow\; 1 - 4y^2 \ge 0 \;\Longrightarrow\; -\tfrac12 \le y \le \tfrac12`, "A quadratic in x has real roots only if its discriminant is not negative. The end values are the turning points."],
    ["Related graphs.", R`y = \frac{1}{f(x)}: \ \text{zeros} \leftrightarrow \text{asymptotes}, \ \ \text{maxima} \leftrightarrow \text{minima}; \qquad y = |f(x)|: \ \text{reflect what lies below the axis}`, "Where f is small 1/f is large, and where f rises 1/f falls."]
  ], R`x = a \ \text{where}\ Q(a) = 0; \qquad y \to \frac{a_n}{b_n}; \qquad \text{range from discriminant} \ge 0`, [
    "If P(a) = 0 as well, the common factor cancels and the graph has a hole there, not an asymptote.",
    "A curve may cross a horizontal or oblique asymptote; it can never cross a vertical one."
  ]);

  d('m-summation', [
    ["Sum of the first n integers: pair the terms.", R`\sum_{r=1}^nr = \tfrac12n(n + 1)`, "Write the sum forwards and backwards: n pairs, each adding to n + 1."],
    ["For squares, start from an identity whose terms will cancel in a chain.", R`(r + 1)^3 - r^3 = 3r^2 + 3r + 1`, "Expand the cube."],
    ["Sum both sides from r = 1 to n. The left side collapses.", R`(n + 1)^3 - 1 = 3\sum r^2 + \tfrac32n(n + 1) + n`, "Each cube appears once with a plus sign and once with a minus sign, apart from the first and the last."],
    ["Solve for the sum of squares.", R`\sum_{r=1}^nr^2 = \tfrac16n(n + 1)(2n + 1)`, "Rearrange and factorise."],
    ["This is the method of differences in general.", R`\sum_{r=1}^n\left[f(r) - f(r + 1)\right] = f(1) - f(n + 1)`, "All the intermediate terms cancel in pairs."],
    ["An example with partial fractions.", R`\sum_{r=1}^n\frac{1}{r(r + 1)} = \sum_{r=1}^n\left(\frac1r - \frac{1}{r + 1}\right) = 1 - \frac{1}{n + 1} \;\to\; 1`, "As n → ∞ the sum converges to 1."]
  ], R`\sum r = \tfrac12n(n + 1), \qquad \sum r^2 = \tfrac16n(n + 1)(2n + 1), \qquad \sum r^3 = \tfrac14n^2(n + 1)^2`, [
    "The sum of cubes follows the same way from (r + 1)⁴ − r⁴; it equals the square of the sum of the integers.",
    "Check which terms survive at both ends: with f(r) − f(r + 2), two remain at each end.",
    "A sum to infinity exists only if the surviving term f(n + 1) tends to a limit."
  ]);

  d('m-matrix-transforms', [
    ["A linear transformation is fixed by what it does to the unit vectors: their images are the columns of its matrix.", R`M = \begin{pmatrix}a & b\\ c & d\end{pmatrix}: \qquad \begin{pmatrix}1\\0\end{pmatrix} \mapsto \begin{pmatrix}a\\c\end{pmatrix}, \quad \begin{pmatrix}0\\1\end{pmatrix} \mapsto \begin{pmatrix}b\\d\end{pmatrix}`, "Every vector is x times the first unit vector plus y times the second, and a linear map preserves such combinations."],
    ["Apply one transformation after another.", R`(AB)\mathbf v = A(B\mathbf v), \qquad (AB)_{ij} = \sum_kA_{ik}B_{kj}`, "The rule for multiplying matrices is exactly what makes AB mean “do B, then A”. The order matters."],
    ["The unit square maps to a parallelogram with sides (a, c) and (b, d). Its area is:", R`\det M = ad - bc`, "The area scale factor of the transformation; a negative value means the shape has been turned over."],
    ["To undo the transformation, solve Mv = w for v.", R`M^{-1} = \frac{1}{ad - bc}\begin{pmatrix}d & -b\\ -c & a\end{pmatrix}`, "Check by multiplying: the product with M is the identity. It exists only if det M ≠ 0."],
    ["The inverse of a product reverses the order.", R`(AB)^{-1} = B^{-1}A^{-1}`, "(AB)(B⁻¹A⁻¹) = A(BB⁻¹)A⁻¹ = I: undo the last step first."],
    ["A line through the origin that maps onto itself satisfies:", R`M\mathbf v = \lambda\mathbf v \;\Longrightarrow\; \det(M - \lambda I) = 0`, "Vectors along the line are only scaled. These are the eigenvectors; λ = 1 gives a line of invariant points."]
  ], R`\det M = ad - bc, \qquad M^{-1} = \frac{1}{\det M}\begin{pmatrix}d & -b\\ -c & a\end{pmatrix}, \qquad (AB)^{-1} = B^{-1}A^{-1}`, [
    "det M = 0 squashes the plane onto a line or a point, and there is no inverse.",
    "Linear transformations keep the origin fixed; a translation is not of this form."
  ]);

  d('m-polar', [
    ["Describe a point by its distance from the origin and its angle from the positive x-axis.", R`x = r\cos\theta, \quad y = r\sin\theta; \qquad r^2 = x^2 + y^2, \quad \tan\theta = \frac yx`, "From the right-angled triangle with hypotenuse r."],
    ["Converting an equation: for example r = 2a cos θ.", R`r^2 = 2ar\cos\theta \;\Longrightarrow\; x^2 + y^2 = 2ax \;\Longrightarrow\; (x - a)^2 + y^2 = a^2`, "Multiply by r and substitute. A circle of radius a through the origin."],
    ["For the area swept out by the radius, take a thin sector of angle δθ.", R`\delta A \approx \tfrac12r^2\,\delta\theta`, "A sector of a circle of radius r and angle θ has area ½r²θ."],
    ["Add the sectors and take the limit.", R`A = \tfrac12\int_\alpha^\beta r^2\,d\theta`, "The integral of the thin sectors."],
    ["Example: the cardioid r = a(1 + cos θ).", R`A = \tfrac12a^2\int_0^{2\pi}\left(1 + 2\cos\theta + \cos^2\theta\right)d\theta = \tfrac12a^2(2\pi + 0 + \pi) = \tfrac32\pi a^2`, "Over a full turn cos θ averages to zero and cos²θ to ½."]
  ], R`x = r\cos\theta, \quad y = r\sin\theta; \qquad A = \tfrac12\int_\alpha^\beta r^2\,d\theta`, [
    "Check the sign of r over the range and make sure a loop is not counted twice.",
    "The tangents at the pole are the directions θ for which r = 0.",
    "A conic with a focus at the origin is r = l/(1 + e cos θ): the form used for planetary orbits."
  ]);

  d('m-planes', [
    ["Define the vector product by its size and direction.", R`|\mathbf a\times\mathbf b| = |\mathbf a||\mathbf b|\sin\theta, \qquad \mathbf a\times\mathbf b \ \perp\ \mathbf a \ \text{and}\ \mathbf b`, "The size is the area of the parallelogram on a and b; the direction follows the right-hand rule."],
    ["In components, using i × j = k and its cyclic partners:", R`\mathbf a\times\mathbf b = \begin{vmatrix}\mathbf i & \mathbf j & \mathbf k\\ a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\end{vmatrix} = \begin{pmatrix}a_2b_3 - a_3b_2\\ a_3b_1 - a_1b_3\\ a_1b_2 - a_2b_1\end{pmatrix}`, "Expand the product of the two component forms; i × i = 0 and j × i = −k."],
    ["A plane through the point A with normal n contains every point R for which AR is perpendicular to n.", R`(\mathbf r - \mathbf a)\cdot\mathbf n = 0 \;\Longrightarrow\; \mathbf r\cdot\mathbf n = d, \quad d = \mathbf a\cdot\mathbf n \;\Longrightarrow\; ax + by + cz = d`, "The coefficients of x, y and z in the Cartesian equation are the components of the normal."],
    ["A plane through three points A, B, C has normal:", R`\mathbf n = \overrightarrow{AB}\times\overrightarrow{AC}`, "The vector product is perpendicular to both directions lying in the plane."],
    ["Two planes meet in a line whose direction lies in both.", R`\mathbf d = \mathbf n_1\times\mathbf n_2`, "It must be perpendicular to both normals."],
    ["The distance from a point P to the plane is the projection of AP onto the unit normal.", R`D = \frac{|(\mathbf p - \mathbf a)\cdot\mathbf n|}{|\mathbf n|} = \frac{|ax_0 + by_0 + cz_0 - d|}{\sqrt{a^2 + b^2 + c^2}}`, "Only the component of AP along the normal takes you away from the plane."]
  ], R`\mathbf r\cdot\mathbf n = d, \qquad \mathbf d = \mathbf n_1\times\mathbf n_2, \qquad D = \frac{|ax_0 + by_0 + cz_0 - d|}{|\mathbf n|}`, [
    "a × b = −b × a, and a × b = 0 for parallel vectors.",
    "The angle between two planes is the angle between their normals; between a line and a plane it is 90° minus the angle between the line and the normal.",
    "Torque r × F and the magnetic force qv × B are vector products."
  ]);

  d('m-induction', [
    ["To prove a statement P(n) for every positive whole number n, first check the first case.", R`P(1): \quad 1 = \tfrac12\cdot1\cdot2 \ \ \checkmark`, "Example: P(n) is the claim 1 + 2 + … + n = ½n(n + 1). The base case anchors the chain."],
    ["Assume the statement holds for some n = k.", R`1 + 2 + \dots + k = \tfrac12k(k + 1)`, "The inductive hypothesis: an assumption about one unspecified k, not the thing to be proved."],
    ["Show that it then holds for k + 1.", R`1 + \dots + k + (k + 1) = \tfrac12k(k + 1) + (k + 1) = \tfrac12(k + 1)(k + 2)`, "Add the next term to both sides and factorise. The result is the statement P(k + 1)."],
    ["Conclude.", R`P(1) \ \wedge\ \left[P(k) \Rightarrow P(k + 1)\right] \;\Longrightarrow\; P(n) \ \text{for all } n \ge 1`, "P(1) gives P(2), which gives P(3), and so on, like a row of dominoes."],
    ["A divisibility example: 7ⁿ − 3ⁿ is divisible by 4.", R`7^{k+1} - 3^{k+1} = 7\left(7^k - 3^k\right) + 4\cdot3^k`, "The first term is divisible by 4 by the hypothesis, and the second obviously is. Base case: 7 − 3 = 4."]
  ], R`P(1) \ \wedge\ \left[P(k) \Rightarrow P(k + 1)\right] \;\Longrightarrow\; \forall n\ P(n)`, [
    "Both parts are essential: without a base case, false statements such as “n = n + 1” pass the inductive step.",
    "Induction proves a formula you already have; it does not find one.",
    "For powers of a matrix the step is M^{k+1} = M^k M."
  ]);

  d('m-hyperbolic', [
    ["Define two functions from the even and odd parts of the exponential.", R`\cosh x = \tfrac12\left(e^x + e^{-x}\right), \qquad \sinh x = \tfrac12\left(e^x - e^{-x}\right), \qquad \tanh x = \frac{\sinh x}{\cosh x}`, "Any function is the sum of an even part and an odd part; for the exponential these are cosh and sinh."],
    ["Square and subtract.", R`\cosh^2x - \sinh^2x = \tfrac14\left[\left(e^x + e^{-x}\right)^2 - \left(e^x - e^{-x}\right)^2\right] = 1`, "The cross terms give 4 × ¼. The point (cosh t, sinh t) lies on the hyperbola x² − y² = 1, hence the name."],
    ["Differentiate.", R`\frac{d}{dx}\sinh x = \cosh x, \qquad \frac{d}{dx}\cosh x = \sinh x`, "Straight from the definitions. No minus sign appears, unlike with cosine."],
    ["Compare with the exponential form of the circular functions.", R`\cos x = \tfrac12\left(e^{ix} + e^{-ix}\right) \;\Longrightarrow\; \cosh x = \cos(ix), \qquad \sinh x = -i\sin(ix)`, "This is why every trigonometric identity has a hyperbolic twin, with a change of sign wherever two sines are multiplied (Osborn’s rule)."],
    ["Invert y = sinh x by solving for the exponential.", R`e^{2x} - 2ye^x - 1 = 0 \;\Longrightarrow\; e^x = y + \sqrt{y^2 + 1} \;\Longrightarrow\; \operatorname{arsinh}y = \ln\!\left(y + \sqrt{y^2 + 1}\right)`, "A quadratic in e^x; take the positive root because e^x > 0."]
  ], R`\cosh^2x - \sinh^2x = 1, \qquad \operatorname{arsinh}x = \ln\!\left(x + \sqrt{x^2 + 1}\right), \qquad \operatorname{arcosh}x = \ln\!\left(x + \sqrt{x^2 - 1}\right)`, [
    "arcosh x needs x ≥ 1 and by convention gives the value that is not negative.",
    "A hanging chain takes the shape y = a cosh(x/a); in special relativity rapidities add because velocities combine like tanh."
  ]);

  d('m-reduction', [
    ["A reduction formula links an integral with index n to one with a smaller index. Take I_n = ∫ sinⁿx dx from 0 to π/2 and integrate by parts.", R`I_n = \int_0^{\pi/2}\sin^{n-1}x\,\sin x\,dx = \left[-\sin^{n-1}x\cos x\right]_0^{\pi/2} + (n - 1)\int_0^{\pi/2}\sin^{n-2}x\cos^2x\,dx`, "Take u = sin^{n−1}x and dv = sin x dx."],
    ["The bracket vanishes at both limits. Replace cos² by 1 − sin².", R`I_n = (n - 1)\left(I_{n-2} - I_n\right) \;\Longrightarrow\; I_n = \frac{n - 1}{n}\,I_{n-2}`, "Collect I_n on the left. Each use lowers the index by 2, until I₀ = π/2 or I₁ = 1 is reached."],
    ["A second example.", R`J_n = \int_0^\infty x^ne^{-x}\,dx = \left[-x^ne^{-x}\right]_0^\infty + n\int_0^\infty x^{n-1}e^{-x}\,dx = nJ_{n-1} \;\Longrightarrow\; J_n = n!`, "The exponential beats any power, so the bracket is zero; and J₀ = 1."],
    ["Arc length: a short piece of curve is the hypotenuse of a small triangle.", R`\delta s^2 \approx \delta x^2 + \delta y^2 \;\Longrightarrow\; s = \int_a^b\sqrt{1 + \left(\frac{dy}{dx}\right)^2}\,dx`, "Pythagoras; then divide by δx and take the limit."],
    ["Rotate the curve about the x-axis. Each piece of arc sweeps out a band.", R`\delta S \approx 2\pi y\,\delta s \;\Longrightarrow\; S = 2\pi\int_a^by\sqrt{1 + \left(\frac{dy}{dx}\right)^2}\,dx`, "The band has circumference 2πy and slant width δs, not δx."]
  ], R`I_n = \frac{n - 1}{n}I_{n-2}, \qquad s = \int\sqrt{1 + y'^2}\,dx, \qquad S = 2\pi\int y\sqrt{1 + y'^2}\,dx`, [
    "In parametric form ds = √(ẋ² + ẏ²) dt, and in polar form ds = √(r² + (dr/dθ)²) dθ.",
    "Using δx in place of δs for a surface area is a classic error: it fails even for a cone."
  ]);

  d('m-de-moivre', [
    ["Multiply two complex numbers in modulus–argument form.", R`r_1(\cos\theta_1 + i\sin\theta_1)\cdot r_2(\cos\theta_2 + i\sin\theta_2) = r_1r_2\left[\cos(\theta_1 + \theta_2) + i\sin(\theta_1 + \theta_2)\right]`, "Expand and use the addition formulae: moduli multiply and arguments add."],
    ["Apply this n times to one number of modulus 1.", R`(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta`, "De Moivre’s theorem. With Euler’s formula e^{iθ} = cos θ + i sin θ it reads (e^{iθ})ⁿ = e^{inθ}."],
    ["Multiple angles: expand the left side by the binomial theorem and compare real parts. For n = 3:", R`\cos3\theta = \cos^3\theta - 3\cos\theta\sin^2\theta = 4\cos^3\theta - 3\cos\theta`, "The real part of (c + is)³ = c³ + 3ic²s − 3cs² − is³, then s² = 1 − c²."],
    ["Powers of cosine: with z = e^{iθ},", R`z^n + z^{-n} = 2\cos n\theta, \qquad z^n - z^{-n} = 2i\sin n\theta`, "So (2 cos θ)ⁿ = (z + 1/z)ⁿ can be expanded and regrouped into cosines of multiple angles; for example cos²θ = ½(1 + cos 2θ)."],
    ["Roots of unity: solve zⁿ = 1 by writing 1 with every possible argument.", R`z^n = e^{2\pi ik} \;\Longrightarrow\; z = e^{2\pi ik/n}, \qquad k = 0, 1, \dots, n - 1`, "Adding 2π to an argument does not change the number, but after dividing by n it gives n different roots, equally spaced round the unit circle."],
    ["They add to zero.", R`1 + \omega + \omega^2 + \dots + \omega^{n-1} = \frac{1 - \omega^n}{1 - \omega} = 0, \qquad \omega = e^{2\pi i/n}`, "A geometric series with ωⁿ = 1. In a picture: the n vectors form a closed regular polygon."]
  ], R`(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta; \qquad z^n = 1 \iff z = e^{2\pi ik/n}`, [
    "For a fractional power p/q the theorem gives one of q possible values.",
    "A sum of cosines of rθ is found as the real part of a geometric series in e^{iθ}."
  ]);

  d('m-fm-projectiles', [
    ["With no air resistance the only force is the weight, so the horizontal velocity is constant and the vertical acceleration is −g.", R`x = ut\cos\theta, \qquad y = ut\sin\theta - \tfrac12gt^2`, "The constant-acceleration equations, applied separately in each direction."],
    ["Eliminate t using the first equation.", R`t = \frac{x}{u\cos\theta} \;\Longrightarrow\; y = x\tan\theta - \frac{gx^2}{2u^2\cos^2\theta} = x\tan\theta - \frac{gx^2}{2u^2}\left(1 + \tan^2\theta\right)`, "The path is a parabola. Writing sec²θ as 1 + tan²θ makes it a quadratic in tan θ, which is how the angle needed to hit a target is found."],
    ["The range on level ground: set y = 0.", R`R = \frac{2u^2\sin\theta\cos\theta}{g} = \frac{u^2\sin2\theta}{g}`, "The other solution, x = 0, is the launch point. The range is greatest at θ = 45°."],
    ["The greatest height: the vertical velocity is zero there.", R`0 = u^2\sin^2\theta - 2gH \;\Longrightarrow\; H = \frac{u^2\sin^2\theta}{2g}`, "v² = u² + 2as in the vertical direction."],
    ["For a target at (X, Y), the quadratic in tan θ has real solutions only if its discriminant is not negative.", R`Y \le \frac{u^2}{2g} - \frac{gX^2}{2u^2}`, "Points inside this bounding parabola can be hit in two ways, by a high and a low trajectory; points outside cannot be reached at all."]
  ], R`y = x\tan\theta - \frac{gx^2}{2u^2}\sec^2\theta, \qquad R = \frac{u^2\sin2\theta}{g}, \qquad H = \frac{u^2\sin^2\theta}{2g}`, [
    "No air resistance, uniform g, a flat Earth that does not rotate. For a real ball, drag shortens the range and makes the best angle less than 45°.",
    "The projectile is a particle: spin, which makes a ball swerve, is ignored."
  ]);

  d('m-rigid-equilibrium', [
    ["The centre of mass is the mass-weighted mean position.", R`\bar x = \frac{\sum m_ix_i}{\sum m_i}`, "It is the point about which the total moment of the weights is zero, so the whole weight can be taken to act there."],
    ["For a continuous body the sum becomes an integral. For a uniform semicircular lamina of radius r, take strips parallel to the diameter.", R`\bar y = \frac{\int_0^ry\cdot2\sqrt{r^2 - y^2}\,dy}{\tfrac12\pi r^2} = \frac{\tfrac23r^3}{\tfrac12\pi r^2} = \frac{4r}{3\pi}`, "A strip at height y has width 2√(r² − y²). Substitute u = r² − y² to integrate."],
    ["A composite body is treated as particles at the centres of mass of its parts; a hole counts as negative mass.", R`\bar x = \frac{m_1x_1 + m_2x_2 - m_{\text{hole}}\,x_{\text{hole}}}{m_1 + m_2 - m_{\text{hole}}}`, "The moment of the whole equals the sum of the moments of the parts."],
    ["A rigid body is in equilibrium if the resultant force and the total moment about any point are both zero.", R`\sum\mathbf F = \mathbf 0, \qquad \sum M = 0`, "No linear and no angular acceleration. Taking moments about a point where an unknown force acts removes that force from the equation."],
    ["A block with base width b and centre of mass at height h stands on a slope. It topples when the vertical through its centre of mass falls outside the base, and slides when friction is overcome.", R`\text{topples if}\ \tan\theta > \frac{b}{2h}; \qquad \text{slides if}\ \tan\theta > \mu`, "Whichever angle is smaller is reached first as the slope is tilted."]
  ], R`\bar x = \frac{\sum mx}{\sum m}, \qquad \sum\mathbf F = \mathbf 0, \quad \sum M = 0, \qquad \bar y_{\text{semicircle}} = \frac{4r}{3\pi}`, [
    "Uniform density unless stated otherwise; the centre of mass need not lie inside the body (a ring, a boomerang).",
    "A freely suspended body hangs with its centre of mass vertically below the pivot."
  ]);

  d('m-vertical-circle', [
    ["A particle moving in a circle of radius r at speed v accelerates towards the centre.", R`a = \frac{v^2}{r} = r\omega^2`, "The velocity changes direction even when the speed is constant."],
    ["A particle on a string of length r is given speed u at the lowest point. Energy conservation gives its speed after turning through an angle θ.", R`\tfrac12mv^2 = \tfrac12mu^2 - mgr(1 - \cos\theta) \;\Longrightarrow\; v^2 = u^2 - 2gr(1 - \cos\theta)`, "The tension does no work because it is perpendicular to the motion. The height gained is r(1 − cos θ)."],
    ["Apply Newton’s second law towards the centre.", R`T - mg\cos\theta = \frac{mv^2}{r} \;\Longrightarrow\; T = \frac{mu^2}{r} - 2mg + 3mg\cos\theta`, "The component of the weight along the string is mg cos θ, pointing away from the centre in the lower half."],
    ["For complete circles the string must stay taut at the top, θ = 180°.", R`T_{\text{top}} = \frac{mu^2}{r} - 5mg \ge 0 \;\Longrightarrow\; u^2 \ge 5gr`, "A string cannot push. At the top the speed is then at least √(gr), not zero."],
    ["A bead on a rigid rod or a wire only needs to reach the top.", R`v_{\text{top}}^2 = u^2 - 4gr \ge 0 \;\Longrightarrow\; u^2 \ge 4gr`, "A rod can push as well as pull."],
    ["Conical pendulum: a horizontal circle, with a string of length L at angle θ to the vertical.", R`T\cos\theta = mg, \quad T\sin\theta = m\omega^2L\sin\theta \;\Longrightarrow\; \omega^2 = \frac{g}{L\cos\theta}`, "Vertical equilibrium, and the horizontal component of the tension as the centripetal force on a circle of radius L sin θ."]
  ], R`v^2 = u^2 - 2gr(1 - \cos\theta), \qquad T = \frac{mu^2}{r} - 2mg + 3mg\cos\theta, \qquad u^2 \ge 5gr`, [
    "If 2gr < u² < 5gr the string goes slack above the level of the centre, and the particle then moves as a projectile.",
    "No air resistance; a light string that does not stretch."
  ]);

  d('m-elastic', [
    ["Hooke’s law for a string or spring of natural length l and modulus of elasticity λ.", R`T = \frac{\lambda x}{l}`, "Tension is proportional to the extension x. Dividing by l makes λ a property of the material and its thickness, not of the length; the stiffness is k = λ/l."],
    ["The work done in stretching from 0 to x is the area under the force–extension graph.", R`E = \int_0^x\frac{\lambda s}{l}\,ds = \frac{\lambda x^2}{2l}`, "The force is not constant, so the work is an integral: a triangle of base x and height λx/l."],
    ["A mass m hangs in equilibrium from the string.", R`mg = \frac{\lambda e}{l} \;\Longrightarrow\; e = \frac{mgl}{\lambda}`, "Tension balances weight at the extension e."],
    ["Released from the natural length, the mass falls a distance d before it stops. Use energy.", R`mgd = \frac{\lambda d^2}{2l} \;\Longrightarrow\; d = \frac{2mgl}{\lambda} = 2e`, "Gravitational energy lost equals elastic energy gained, with zero speed at both ends. The mass overshoots the equilibrium position by as much as it started above it."],
    ["Combining springs.", R`\text{side by side: } k = k_1 + k_2; \qquad \text{end to end: } \frac1k = \frac{1}{k_1} + \frac{1}{k_2}`, "Side by side they share the extension and their forces add; end to end they share the force and their extensions add."]
  ], R`T = \frac{\lambda x}{l}, \qquad E = \frac{\lambda x^2}{2l}`, [
    "Valid only up to the limit of proportionality.",
    "A string gives no force when slack; a spring also resists compression.",
    "A light string: its own mass, and any energy lost as heat, are ignored."
  ]);

  d('m-variable-force', [
    ["When a force depends on speed or position the acceleration is not constant. Write it in whichever form matches the variables.", R`a = \frac{dv}{dt} = v\frac{dv}{dx}`, "Use dv/dt to link v with t, and v dv/dx to link v with x."],
    ["A particle with initial speed u slows under a resistance kv. Find how far it goes.", R`mv\frac{dv}{dx} = -kv \;\Longrightarrow\; m\,dv = -k\,dx \;\Longrightarrow\; x = \frac mk(u - v)`, "Cancel v and integrate. The particle stops after the finite distance mu/k."],
    ["The same motion in time.", R`m\frac{dv}{dt} = -kv \;\Longrightarrow\; v = ue^{-kt/m}`, "Separate the variables. It takes an infinite time to cover that finite distance."],
    ["Falling from rest with resistance kv.", R`m\frac{dv}{dt} = mg - kv \;\Longrightarrow\; v = \frac{mg}{k}\left(1 - e^{-kt/m}\right), \qquad v_T = \frac{mg}{k}`, "The terminal speed is where the acceleration is zero. With resistance kv² the same condition gives √(mg/k)."],
    ["Inverse-square gravity: a particle is projected straight up at speed u from the surface of a planet of radius R.", R`v\frac{dv}{dr} = -\frac{GM}{r^2} \;\Longrightarrow\; \tfrac12v^2 - \tfrac12u^2 = GM\left(\frac1r - \frac1R\right)`, "Integrate from R to r."],
    ["It escapes if v is still real as r → ∞.", R`u^2 \ge \frac{2GM}{R} \;\Longrightarrow\; v_{\text{esc}} = \sqrt{\frac{2GM}{R}}`, "About 11.2 km/s for the Earth."]
  ], R`a = v\frac{dv}{dx}; \qquad v_T = \frac{mg}{k}; \qquad v_{\text{esc}} = \sqrt{\frac{2GM}{R}}`, [
    "Resistance proportional to v suits slow motion in a thick fluid; proportional to v² suits fast motion in air. In that case x = (m/k) ln(u/v), and the particle never quite stops.",
    "Escape speed ignores air resistance and the planet’s rotation, and assumes no further thrust."
  ]);

  d('m-restitution', [
    ["For a direct impact, two laws fix the two unknown velocities.", R`m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2, \qquad v_2 - v_1 = e\,(u_1 - u_2)`, "Conservation of momentum, and Newton’s experimental law: speed of separation = e × speed of approach."],
    ["A ball hits a fixed smooth wall at speed u, at an angle α to the wall. Resolve its velocity.", R`u_\parallel = u\cos\alpha, \qquad u_\perp = u\sin\alpha`, "Parallel and perpendicular to the wall."],
    ["A smooth wall exerts no force along itself.", R`v_\parallel = u_\parallel`, "With no impulse parallel to the wall, that component of momentum is unchanged."],
    ["Perpendicular to the wall, apply the law of restitution.", R`v_\perp = e\,u_\perp`, "The wall itself does not move, and the direction of this component reverses."],
    ["The ball leaves at an angle β to the wall.", R`\tan\beta = \frac{v_\perp}{v_\parallel} = \frac{e\,u\sin\alpha}{u\cos\alpha} = e\tan\alpha`, "It comes off closer to the wall than it went in, unless e = 1."],
    ["Kinetic energy lost.", R`\Delta E = \tfrac12m\,u^2\sin^2\alpha\,(1 - e^2)`, "Only the perpendicular component loses energy."]
  ], R`v_\parallel = u_\parallel, \qquad v_\perp = e\,u_\perp, \qquad \tan\beta = e\tan\alpha`, [
    "Smooth surfaces: with friction the parallel component changes as well and the ball picks up spin.",
    "For two smooth spheres colliding obliquely, apply the same rules along and perpendicular to the line of centres.",
    "e is treated as a constant; in reality it falls at higher speeds."
  ]);

  d('m-t-tests', [
    ["For a normal population with known σ, the standardised sample mean is normal.", R`Z = \frac{\bar X - \mu}{\sigma/\sqrt n} \sim N(0, 1)`, "The sample mean has standard error σ/√n."],
    ["Usually σ is unknown and is replaced by the estimate from the sample.", R`s^2 = \frac{\sum(x - \bar x)^2}{n - 1}`, "The divisor n − 1 makes s² an unbiased estimate of σ²."],
    ["The resulting statistic is no longer normal.", R`T = \frac{\bar X - \mu}{s/\sqrt n} \sim t_{n-1}`, "s varies from sample to sample, which adds spread. The t-distribution has heavier tails, with ν = n − 1 degrees of freedom because the n deviations from the mean must add to zero."],
    ["Test a mean, or build a confidence interval.", R`t = \frac{\bar x - \mu_0}{s/\sqrt n}, \qquad \bar x \pm t_\nu\,\frac{s}{\sqrt n}`, "Compare t with the critical value of the t-distribution; the interval uses that critical value in place of 1.96."],
    ["Paired data: work with the differences, which removes the variation between subjects.", R`t = \frac{\bar d}{s_d/\sqrt n}, \qquad \nu = n - 1`, "A one-sample test on the differences, with H₀: mean difference = 0."],
    ["Two independent samples with a common variance: pool the estimates.", R`s_p^2 = \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}, \qquad t = \frac{\bar x_1 - \bar x_2}{s_p\sqrt{\frac{1}{n_1} + \frac{1}{n_2}}}`, "Each sample contributes in proportion to its degrees of freedom; ν = n₁ + n₂ − 2."]
  ], R`t = \frac{\bar x - \mu_0}{s/\sqrt n} \sim t_{n-1}, \qquad \bar x \pm t_{n-1}\frac{s}{\sqrt n}`, [
    "The population must be close to normal; for large n the t-distribution approaches the normal and this matters less.",
    "The pooled test assumes equal population variances. Whether data are paired is decided by the design of the experiment, not after seeing the results."
  ]);

  d('m-chi-squared', [
    ["Compare the observed frequencies O with those expected under the null hypothesis, E.", R`X^2 = \sum\frac{(O - E)^2}{E}`, "Squared so that discrepancies in either direction count, and divided by E so that a given discrepancy matters more where few were expected."],
    ["Why this form: a count with mean E has a variance of about E.", R`\frac{O - E}{\sqrt E} \approx N(0, 1) \;\Longrightarrow\; X^2 \approx \text{a sum of squared standard normals}`, "For a Poisson-like count the variance equals the mean. A sum of ν independent squared standard normals has the χ² distribution with ν degrees of freedom."],
    ["The cells are not all free: the totals must agree, and each parameter estimated from the data removes more freedom.", R`\nu = k - 1 - p`, "k cells, one constraint because the observed and expected totals are equal, and p estimated parameters."],
    ["For a contingency table, independence fixes the expected counts.", R`E = \frac{\text{row total}\times\text{column total}}{\text{grand total}}`, "If the two classifications are independent, P(row and column) = P(row) × P(column)."],
    ["Its degrees of freedom:", R`\nu = (r - 1)(c - 1)`, "Once the row and column totals are fixed, only (r − 1)(c − 1) cells can be chosen freely."],
    ["Decide.", R`X^2 > \chi^2_\nu(\alpha) \;\Longrightarrow\; \text{reject } H_0`, "Always one-tailed: only large values of X² indicate a poor fit."]
  ], R`X^2 = \sum\frac{(O - E)^2}{E} \approx \chi^2_\nu, \qquad \nu = k - 1 - p \quad\text{or}\quad (r - 1)(c - 1)`, [
    "The approximation needs every expected frequency to be at least about 5: combine cells if not, and count ν again.",
    "Use frequencies, never percentages or proportions.",
    "A very small X² means the fit is suspiciously good, the objection famously raised about Mendel’s pea data."
  ]);

  d('m-nonparametric', [
    ["Sign test: under the null hypothesis that the median is m₀, each observation is equally likely to fall above or below it.", R`X = \text{number above } m_0 \sim B\!\left(n, \tfrac12\right)`, "No assumption about the shape of the distribution is needed. Values equal to m₀ are left out."],
    ["The test is then an ordinary binomial test.", R`p\text{-value} = P(X \ge x_{\text{obs}}) \quad \text{under } B\!\left(n, \tfrac12\right)`, "Doubled for a two-tailed test."],
    ["The Wilcoxon signed-rank test also uses the sizes of the differences. Rank the absolute differences and add the ranks by sign.", R`T_+ + T_- = \tfrac12n(n + 1), \qquad T = \min(T_+, T_-)`, "The ranks 1 to n always add to ½n(n + 1). If H₀ holds the two totals should be similar; a small T is evidence against it."],
    ["Under H₀ each rank is positive or negative with probability ½.", R`E(T_+) = \tfrac14n(n + 1), \qquad \operatorname{Var}(T_+) = \tfrac{1}{24}n(n + 1)(2n + 1)`, "Rank r contributes r times a fair coin: mean r/2 and variance r²/4. Add over r using the sums of r and r². For large n use a normal approximation."],
    ["Two independent samples (the rank-sum test): rank all n₁ + n₂ values together and add the ranks of the first sample.", R`U_1 = R_1 - \tfrac12n_1(n_1 + 1), \qquad U_1 + U_2 = n_1n_2`, "Subtracting the smallest possible rank sum makes U₁ count the pairs in which the first-sample value is the larger. Each of the n₁n₂ pairs is counted in U₁ or in U₂."]
  ], R`X \sim B\!\left(n, \tfrac12\right); \qquad T = \min(T_+, T_-); \qquad U = R - \tfrac12n_1(n_1 + 1)`, [
    "The signed-rank test assumes the differences are distributed symmetrically; the sign test does not.",
    "These tests are about medians, and they lose a little power compared with a t-test when the data really are normal.",
    "Tied values share the average of the ranks they span."
  ]);

  d('m-pgf', [
    ["Collect the probabilities of a variable that takes the values 0, 1, 2, … as the coefficients of a power series.", R`G_X(t) = E\!\left(t^X\right) = \sum_rP(X = r)\,t^r`, "The whole distribution is packed into one function."],
    ["Put t = 1.", R`G(1) = \sum_rP(X = r) = 1`, "A check on any probability generating function."],
    ["Differentiate and put t = 1.", R`G'(t) = \sum_rr\,P(X = r)\,t^{r-1} \;\Longrightarrow\; G'(1) = E(X)`, "Each differentiation brings down a factor r."],
    ["Differentiate again.", R`G''(1) = E[X(X - 1)] \;\Longrightarrow\; \operatorname{Var}(X) = G''(1) + G'(1) - \left[G'(1)\right]^2`, "E(X²) = G″(1) + G′(1); then subtract the square of the mean."],
    ["For independent variables the generating function of a sum is a product.", R`G_{X+Y}(t) = E\!\left(t^Xt^Y\right) = G_X(t)\,G_Y(t)`, "The expectation of a product of independent quantities is the product of their expectations."],
    ["Standard results.", R`\text{one trial: } q + pt \;\Longrightarrow\; B(n, p): \ (q + pt)^n; \qquad \text{Po}(\lambda): \ \sum_r\frac{e^{-\lambda}\lambda^rt^r}{r!} = e^{\lambda(t - 1)}`, "A binomial is a sum of n independent trials. Multiplying two Poisson functions gives e^{(λ₁+λ₂)(t−1)}: the sum of independent Poisson variables is Poisson."]
  ], R`G(t) = E\!\left(t^X\right), \qquad E(X) = G'(1), \qquad \operatorname{Var}(X) = G''(1) + G'(1) - G'(1)^2, \qquad G_{X+Y} = G_XG_Y`, [
    "Only for variables that take whole-number values 0, 1, 2, …",
    "The product rule needs independence.",
    "The geometric distribution has G(t) = pt/(1 − qt), valid for |t| < 1/q."
  ]);
})();
/* ---- derive-9.js ---- */
/* Geodesic — derivations for notes-only topics: university maths, Years 1 and 2. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  /* ---------- Year 1 ---------- */
  d('m-complex', [
    ["A complex number z = x + iy is a point in the plane. Its conjugate is its reflection in the real axis.", R`z\bar z = (x + iy)(x - iy) = x^2 + y^2 = |z|^2`, "i² = −1 removes the cross terms. This is how division is done: multiply top and bottom by the conjugate."],
    ["Consider the function f(θ) = cos θ + i sin θ and differentiate it.", R`f'(\theta) = -\sin\theta + i\cos\theta = i(\cos\theta + i\sin\theta) = i\,f(\theta)`, "Treating i as a constant."],
    ["The only function with f′ = if and f(0) = 1 is an exponential.", R`e^{i\theta} = \cos\theta + i\sin\theta`, "Euler’s formula. The same result follows from putting iθ into the power series of the exponential and separating real and imaginary parts."],
    ["So every complex number has a polar form, and multiplication is a rotation combined with a scaling.", R`z = re^{i\theta}, \qquad z_1z_2 = r_1r_2\,e^{i(\theta_1 + \theta_2)}`, "Moduli multiply and arguments add, by the index law."],
    ["Add and subtract the formula for θ and −θ.", R`\cos\theta = \tfrac12\left(e^{i\theta} + e^{-i\theta}\right), \qquad \sin\theta = \tfrac{1}{2i}\left(e^{i\theta} - e^{-i\theta}\right)`, "Trigonometry becomes algebra with exponentials; an oscillation cos ωt is the real part of e^{iωt}."],
    ["The argument is defined only up to whole turns, so the logarithm has many values.", R`\log z = \ln|z| + i(\arg z + 2\pi k), \qquad e^{i\pi} + 1 = 0`, "e^{2πik} = 1 for every whole number k."]
  ], R`e^{i\theta} = \cos\theta + i\sin\theta, \qquad z = re^{i\theta}, \qquad |z|^2 = z\bar z`, [
    "The uniqueness step uses the fact that a first-order linear differential equation with a given starting value has exactly one solution.",
    "Many-valued functions such as the logarithm and the square root need a branch cut to be made single-valued."
  ]);

  d('m-taylor', [
    ["Approximate a function near x = a by a polynomial.", R`f(x) \approx c_0 + c_1(x - a) + c_2(x - a)^2 + c_3(x - a)^3 + \dots`, "Polynomials are easy to compute, differentiate and integrate."],
    ["Choose the coefficients so that the polynomial and the function have the same derivatives at a. Differentiate n times and put x = a.", R`f^{(n)}(a) = n!\,c_n \;\Longrightarrow\; c_n = \frac{f^{(n)}(a)}{n!}`, "Lower terms have been differentiated away; higher terms vanish at x = a."],
    ["The Taylor series.", R`f(x) = \sum_{n=0}^\infty\frac{f^{(n)}(a)}{n!}(x - a)^n`, "Value, slope, curvature and every higher derivative agree at the point a."],
    ["Standard series about a = 0.", R`e^x = \sum_{n=0}^\infty\frac{x^n}{n!}, \qquad \sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots, \qquad \cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots`, "Every derivative of the exponential is 1 at x = 0; the derivatives of sine cycle through 0, 1, 0, −1."],
    ["The error after n terms is controlled by the next derivative.", R`R_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!}(x - a)^{n+1} \quad \text{for some } \xi \text{ between } a \text{ and } x`, "Lagrange’s form of the remainder. It tells you how many terms a given accuracy needs."],
    ["A series may converge only within a certain distance of a.", R`\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \dots \qquad (-1 < x \le 1)`, "From integrating 1/(1 + x) = 1 − x + x² − … The radius of convergence is the distance to the nearest singularity, here x = −1."]
  ], R`f(x) = \sum_{n=0}^\infty\frac{f^{(n)}(a)}{n!}(x - a)^n`, [
    "Not every smooth function equals its Taylor series: e^{−1/x²} has every derivative zero at 0, yet is not zero.",
    "Physics lives on the first non-trivial term: sin θ ≈ θ, (1 + x)ⁿ ≈ 1 + nx, and any potential near a minimum is a harmonic oscillator."
  ]);

  d('m-partial', [
    ["For a function of two variables, differentiate with respect to one while holding the other fixed.", R`\frac{\partial f}{\partial x} = \lim_{h\to0}\frac{f(x + h, y) - f(x, y)}{h}`, "The slope of the surface z = f(x, y) along a slice of constant y."],
    ["A small step (δx, δy) changes f by the sum of the two partial changes.", R`\delta f \approx \frac{\partial f}{\partial x}\delta x + \frac{\partial f}{\partial y}\delta y \;\Longrightarrow\; df = f_x\,dx + f_y\,dy`, "Move in x first, then in y; to first order the two changes simply add."],
    ["Write this as a dot product.", R`df = \nabla f\cdot d\mathbf r, \qquad \nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)`, "The gradient collects the partial derivatives into a vector."],
    ["Along a contour f does not change.", R`df = \nabla f\cdot d\mathbf r = 0 \;\Longrightarrow\; \nabla f \perp \text{contour}`, "A zero dot product means perpendicular."],
    ["For a step of fixed length the change is greatest when the step is along the gradient.", R`df = |\nabla f|\,|d\mathbf r|\cos\theta`, "The gradient points in the direction of steepest ascent, and its size is the slope in that direction."],
    ["At a stationary point the gradient is zero. Its nature is decided by the second derivatives.", R`D = f_{xx}f_{yy} - f_{xy}^2: \quad D > 0,\ f_{xx} > 0 \ \text{minimum}; \quad D > 0,\ f_{xx} < 0 \ \text{maximum}; \quad D < 0 \ \text{saddle}`, "D is the determinant of the matrix of second derivatives: its sign says whether the surface curves the same way in every direction."]
  ], R`df = f_x\,dx + f_y\,dy = \nabla f\cdot d\mathbf r, \qquad \nabla f \perp \text{contours}`, [
    "The order of mixed partial derivatives does not matter, f_{xy} = f_{yx}, provided they are continuous.",
    "In thermodynamics always say what is held constant: the derivative of U with respect to T at constant V differs from that at constant p."
  ]);

  d('m-multiple', [
    ["A double integral adds up f over a region. It can be done one variable at a time.", R`\iint_Rf\,dA = \int_a^b\left(\int_{c(x)}^{d(x)}f(x, y)\,dy\right)dx`, "Slice the region into strips; the inner limits may depend on the outer variable."],
    ["In polar coordinates a small patch has sides δr and r δθ.", R`dA = r\,dr\,d\theta`, "The arc for an angle δθ at radius r has length r δθ. The factor r is the Jacobian of the change of variables."],
    ["In general the area scale factor is a determinant.", R`dx\,dy = \left|\frac{\partial(x, y)}{\partial(u, v)}\right|du\,dv, \qquad \frac{\partial(x, y)}{\partial(r, \theta)} = \begin{vmatrix}\cos\theta & -r\sin\theta\\ \sin\theta & r\cos\theta\end{vmatrix} = r`, "A small rectangle in (u, v) maps to a parallelogram whose area is the determinant of the matrix of partial derivatives."],
    ["The Gaussian integral: square it and change to polar coordinates.", R`I = \int_{-\infty}^\infty e^{-x^2}dx: \qquad I^2 = \iint e^{-(x^2 + y^2)}\,dx\,dy = \int_0^{2\pi}d\theta\int_0^\infty e^{-r^2}r\,dr`, "The product of two copies is a double integral over the whole plane."],
    ["The extra factor r makes the radial integral elementary.", R`I^2 = 2\pi\cdot\tfrac12 = \pi \;\Longrightarrow\; \int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi`, "The integrand r e^{−r²} is the derivative of −½e^{−r²}."]
  ], R`dA = r\,dr\,d\theta, \qquad \int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi, \qquad \int_{-\infty}^\infty e^{-ax^2}dx = \sqrt{\frac\pi a}`, [
    "Changing the order of integration is safe when the integral of |f| is finite (Fubini’s theorem).",
    "The Jacobian must not vanish inside the region, or the change of variables is not one-to-one there."
  ]);

  d('m-matrices', [
    ["A linear map T satisfies T(au + bv) = aT(u) + bT(v). Apply it to a general vector.", R`T(\mathbf x) = T\!\left(\sum_jx_j\mathbf e_j\right) = \sum_jx_j\,T(\mathbf e_j)`, "Linearity: the map is fixed completely by what it does to the basis vectors."],
    ["Put the images of the basis vectors in the columns of a matrix.", R`A = \begin{pmatrix}T(\mathbf e_1) & T(\mathbf e_2) & \cdots\end{pmatrix}, \qquad T(\mathbf x) = A\mathbf x`, "Ax is, by definition, the combination of the columns of A with the components of x as weights."],
    ["Doing one map after another is matrix multiplication.", R`(S\circ T)(\mathbf x) = B(A\mathbf x) = (BA)\mathbf x`, "The rule for multiplying matrices is defined so that this holds."],
    ["The determinant is the factor by which volumes are scaled, with a sign for orientation.", R`\det(BA) = \det B\,\det A`, "Scaling by one factor and then by another multiplies the factors."],
    ["A map can be undone exactly when it does not flatten space.", R`A^{-1} \ \text{exists} \iff \det A \ne 0, \qquad A^{-1} = \frac{\operatorname{adj}A}{\det A}`, "If det A = 0 some direction is squashed to nothing and information is lost."],
    ["Maps that preserve lengths and angles have orthonormal columns.", R`|Q\mathbf x|^2 = \mathbf x^TQ^TQ\,\mathbf x = |\mathbf x|^2 \ \text{for all } \mathbf x \iff Q^TQ = I`, "Rotations and reflections; det Q = ±1."]
  ], R`T(\mathbf x) = A\mathbf x \ \text{with columns}\ T(\mathbf e_j); \qquad \det(BA) = \det B\det A; \qquad Q^TQ = I`, [
    "The matrix depends on the basis chosen; the map does not. Under a change of basis P the matrix becomes P⁻¹AP.",
    "Matrix multiplication does not commute: in general AB ≠ BA, which is the root of the uncertainty principle."
  ]);

  d('m-eigen', [
    ["An eigenvector of a matrix is a direction that it does not turn.", R`A\mathbf v = \lambda\mathbf v, \qquad \mathbf v \ne \mathbf 0`, "Along such a direction the map is simply a scaling by λ."],
    ["Rearrange.", R`(A - \lambda I)\mathbf v = \mathbf 0`, "A non-zero vector is sent to zero, so the matrix A − λI cannot be inverted."],
    ["That happens only if its determinant vanishes.", R`\det(A - \lambda I) = 0`, "The characteristic equation: a polynomial of degree n in λ, with n roots when repeats are counted."],
    ["If there are n independent eigenvectors, put them in the columns of P.", R`AP = PD \;\Longrightarrow\; A = PDP^{-1}, \qquad D = \operatorname{diag}(\lambda_1, \dots, \lambda_n)`, "Column by column this is just the eigenvector equation. In the eigenvector basis the matrix is diagonal."],
    ["Powers and functions of A become easy.", R`A^k = PD^kP^{-1}, \qquad e^{At} = Pe^{Dt}P^{-1}`, "The inner factors P⁻¹P cancel in pairs."],
    ["For a real symmetric matrix, eigenvectors with different eigenvalues are orthogonal.", R`\lambda_1\mathbf v_2^T\mathbf v_1 = \mathbf v_2^TA\mathbf v_1 = (A\mathbf v_2)^T\mathbf v_1 = \lambda_2\mathbf v_2^T\mathbf v_1 \;\Longrightarrow\; \mathbf v_2^T\mathbf v_1 = 0`, "So A = QDQᵀ with Q orthogonal. This is why normal modes, and quantum states of different energy, are orthogonal."]
  ], R`\det(A - \lambda I) = 0, \qquad A = PDP^{-1}, \qquad \operatorname{tr}A = \sum\lambda_i, \quad \det A = \prod\lambda_i`, [
    "Not every matrix can be diagonalised: a shear has too few eigenvectors. Real symmetric and Hermitian matrices always can, and their eigenvalues are real.",
    "The eigenvalues of a real matrix can be complex, as for a rotation."
  ]);

  d('m-ode2', [
    ["For a linear equation with constant coefficients, try an exponential.", R`ay'' + by' + cy = 0, \quad y = e^{\lambda x} \;\Longrightarrow\; a\lambda^2 + b\lambda + c = 0`, "Differentiating an exponential only multiplies it by λ, so the differential equation becomes algebra."],
    ["Two different real roots give two independent solutions.", R`y = Ae^{\lambda_1x} + Be^{\lambda_2x}`, "The equation is linear, so solutions can be added. A second-order equation has two arbitrary constants."],
    ["Complex roots λ = α ± iβ give oscillations.", R`y = e^{\alpha x}\left(A\cos\beta x + B\sin\beta x\right)`, "By Euler’s formula e^{(α ± iβ)x} = e^{αx}(cos βx ± i sin βx); real combinations of the two are taken."],
    ["A repeated root gives only one exponential. The second solution is x times it.", R`y = (A + Bx)\,e^{\lambda x}`, "Substitute y = u(x)e^{λx}: the equation reduces to u″ = 0."],
    ["For a damped oscillator mẍ + bẋ + kx = 0 the three cases are decided by the discriminant.", R`b^2 - 4mk \ \begin{cases}< 0 & \text{under-damped: it oscillates}\\ = 0 & \text{critical: } b_c = 2\sqrt{mk}\\ > 0 & \text{over-damped}\end{cases}`, "Critical damping returns to rest fastest without overshooting."],
    ["With a driving term, add any one particular solution.", R`y = y_{\text{CF}} + y_{\text{PI}}; \qquad m\ddot x + b\dot x + kx = F_0\cos\omega t \;\Longrightarrow\; |x| = \frac{F_0}{\sqrt{(k - m\omega^2)^2 + b^2\omega^2}}`, "Try x as the real part of Xe^{iωt}. The response is largest near ω² = k/m: resonance."]
  ], R`a\lambda^2 + b\lambda + c = 0; \qquad y = Ae^{\lambda_1x} + Be^{\lambda_2x}, \quad (A + Bx)e^{\lambda x}, \quad e^{\alpha x}(A\cos\beta x + B\sin\beta x)`, [
    "Linear with constant coefficients only. Variable coefficients need series solutions or special functions.",
    "If the driving term already solves the homogeneous equation, multiply the trial solution by x."
  ]);

  d('m-limits', [
    ["The statement “f(x) tends to L as x tends to a” is made precise as a challenge and a response.", R`\forall\varepsilon > 0\ \ \exists\delta > 0: \quad 0 < |x - a| < \delta \;\Longrightarrow\; |f(x) - L| < \varepsilon`, "However small a tolerance ε is demanded on the output, a tolerance δ on the input can be found that guarantees it. The value at a itself is irrelevant."],
    ["Example: show that 3x + 1 → 7 as x → 2.", R`|(3x + 1) - 7| = 3|x - 2| < \varepsilon \quad \text{whenever} \quad |x - 2| < \delta = \frac\varepsilon3`, "Work backwards from what is wanted to find a δ that works."],
    ["A function is continuous at a if the limit equals the value.", R`\lim_{x\to a}f(x) = f(a)`, "No jump, no hole and no blow-up at a."],
    ["A limit that cannot be found by substitution: squeeze it.", R`\cos x < \frac{\sin x}{x} < 1 \;\Longrightarrow\; \lim_{x\to0}\frac{\sin x}{x} = 1`, "From comparing areas in the unit circle. Both bounds tend to 1, so the middle must."],
    ["Continuity on a closed interval has two strong consequences.", R`f(a) < k < f(b) \;\Longrightarrow\; \exists c \in (a, b): \ f(c) = k; \qquad f \ \text{attains a maximum and a minimum on } [a, b]`, "The intermediate value theorem and the extreme value theorem. Both rely on the real numbers having no gaps."]
  ], R`\lim_{x\to a}f(x) = L \iff \forall\varepsilon > 0\ \exists\delta > 0: \ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon`, [
    "Both theorems fail on open intervals or for discontinuous functions: 1/x on (0, 1) has no maximum.",
    "The limit must be the same from both sides; sin(1/x) has no limit at 0 at all."
  ]);

  d('m-convergence', [
    ["A series converges if its partial sums tend to a limit.", R`S_N = \sum_{n=1}^Na_n \to S`, "An infinite sum is defined as the limit of finite sums."],
    ["The terms must shrink to zero, but that is not enough.", R`a_n \not\to 0 \Rightarrow \text{diverges}; \qquad \sum\frac1n = 1 + \tfrac12 + \left(\tfrac13 + \tfrac14\right) + \left(\tfrac15 + \dots + \tfrac18\right) + \dots > 1 + \tfrac12 + \tfrac12 + \tfrac12 + \dots`, "Each bracket of the harmonic series exceeds ½, so the sum grows without limit although its terms tend to zero."],
    ["Compare with an integral.", R`\sum_{n=2}^N\frac{1}{n^p} < \int_1^N\frac{dx}{x^p} \;\Longrightarrow\; \sum\frac{1}{n^p} \ \text{converges} \iff p > 1`, "The terms are rectangles under the curve. The integral stays finite exactly when p > 1."],
    ["Compare with a geometric series: the ratio test.", R`L = \lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|: \qquad L < 1 \ \text{converges}, \qquad L > 1 \ \text{diverges}`, "Eventually the terms shrink at least as fast as a geometric series with a ratio between L and 1. L = 1 decides nothing."],
    ["Apply it to a power series.", R`\sum c_nx^n: \quad |x|\lim\left|\frac{c_{n+1}}{c_n}\right| < 1 \;\Longrightarrow\; |x| < R = \lim\left|\frac{c_n}{c_{n+1}}\right|`, "A power series converges inside a radius R and diverges outside it."],
    ["An alternating series whose terms decrease to zero converges, and its error is bounded by the first term left out.", R`|S - S_N| \le |a_{N+1}|`, "Successive partial sums overshoot and undershoot the limit by less each time."]
  ], R`\sum\frac{1}{n^p} \ \text{converges} \iff p > 1; \qquad L = \lim\left|\frac{a_{n+1}}{a_n}\right| < 1 \Rightarrow \text{converges}`, [
    "Absolute convergence allows the terms to be rearranged; a series that converges only conditionally can be rearranged to give any sum at all.",
    "A bounded increasing sequence always converges, the property of the real numbers that lies under all these tests."
  ]);

  d('m-curvilinear', [
    ["Spherical coordinates: distance r, polar angle θ from the z-axis, azimuth φ.", R`x = r\sin\theta\cos\phi, \quad y = r\sin\theta\sin\phi, \quad z = r\cos\theta`, "Project onto the z-axis (r cos θ) and onto the xy-plane (r sin θ), then resolve the latter."],
    ["Change each coordinate a little and see how far the point moves.", R`dl_r = dr, \qquad dl_\theta = r\,d\theta, \qquad dl_\phi = r\sin\theta\,d\phi`, "Arcs of circles of radius r and of radius r sin θ."],
    ["The three displacements are mutually perpendicular, so the volume of the small box is their product.", R`dV = r^2\sin\theta\,dr\,d\theta\,d\phi`, "The same result as the Jacobian determinant of (x, y, z) with respect to (r, θ, φ)."],
    ["On a sphere of fixed radius R the area element is:", R`dA = R^2\sin\theta\,d\theta\,d\phi \;\Longrightarrow\; A = R^2\int_0^{2\pi}d\phi\int_0^\pi\sin\theta\,d\theta = 4\pi R^2`, "The product of the two displacements along the surface."],
    ["Check with the volume of a sphere.", R`V = \int_0^Rr^2dr\int_0^\pi\sin\theta\,d\theta\int_0^{2\pi}d\phi = \frac{R^3}{3}\cdot2\cdot2\pi = \tfrac43\pi R^3`, "The integrand separates into three one-dimensional integrals."],
    ["Cylindrical coordinates (s, φ, z) are the same idea with one straight direction.", R`dV = s\,ds\,d\phi\,dz`, "Polar coordinates in the plane, extended along z."]
  ], R`dV = r^2\sin\theta\,dr\,d\theta\,d\phi, \qquad dA = R^2\sin\theta\,d\theta\,d\phi, \qquad dV = s\,ds\,d\phi\,dz`, [
    "Conventions differ: mathematicians often swap θ and φ. Check which angle is measured from the z-axis.",
    "The coordinates are singular on the z-axis, where φ is undefined; physical quantities must stay finite there."
  ]);

  d('m-line-integrals', [
    ["The work done by a force field along a curve is the sum of F · δr over small steps.", R`W = \int_C\mathbf F\cdot d\mathbf r = \int_{t_0}^{t_1}\mathbf F(\mathbf r(t))\cdot\frac{d\mathbf r}{dt}\,dt`, "Describe the curve by a parameter t; then it is an ordinary integral."],
    ["Suppose the field is the gradient of a scalar function.", R`\mathbf F = \nabla\varphi \;\Longrightarrow\; \mathbf F\cdot\frac{d\mathbf r}{dt} = \frac{\partial\varphi}{\partial x}\frac{dx}{dt} + \frac{\partial\varphi}{\partial y}\frac{dy}{dt} + \frac{\partial\varphi}{\partial z}\frac{dz}{dt} = \frac{d\varphi}{dt}`, "The chain rule."],
    ["Then the integral depends only on the end points.", R`\int_A^B\mathbf F\cdot d\mathbf r = \varphi(B) - \varphi(A), \qquad \oint\mathbf F\cdot d\mathbf r = 0`, "The fundamental theorem of calculus, applied along the curve. Such a field is called conservative."],
    ["A test: the mixed partial derivatives of φ are equal.", R`\frac{\partial F_2}{\partial x} = \frac{\partial^2\varphi}{\partial x\,\partial y} = \frac{\partial F_1}{\partial y} \qquad \left(\text{in three dimensions: } \nabla\times\mathbf F = \mathbf 0\right)`, "A necessary condition for a potential to exist."],
    ["It is not always sufficient.", R`\mathbf F = \frac{(-y,\ x)}{x^2 + y^2}: \qquad \oint_{\text{circle}}\mathbf F\cdot d\mathbf r = \int_0^{2\pi}d\theta = 2\pi \ne 0`, "This field passes the test everywhere except at the origin, where it is undefined. A loop round the hole picks up 2π."]
  ], R`\mathbf F = \nabla\varphi \iff \int_A^B\mathbf F\cdot d\mathbf r = \varphi(B) - \varphi(A) \iff \oint\mathbf F\cdot d\mathbf r = 0`, [
    "Zero curl guarantees a potential only on a region without holes (simply connected).",
    "In physics the convention is F = −∇V, so that the force points downhill in potential energy."
  ]);

  d('m-vector-spaces', [
    ["A vector space is any set whose members can be added and scaled without leaving the set.", R`\mathbf u, \mathbf v \in V \;\Longrightarrow\; a\mathbf u + b\mathbf v \in V`, "Arrows, polynomials, solutions of a linear differential equation and quantum states all qualify."],
    ["A set of vectors is linearly independent if none is a combination of the others.", R`\sum_ic_i\mathbf v_i = \mathbf 0 \;\Longrightarrow\; c_i = 0 \ \text{for all } i`, "Otherwise one of them is redundant."],
    ["A basis is an independent set that spans the space. Every vector then has unique components.", R`\mathbf x = \sum_ix_i\mathbf v_i`, "Spanning gives existence and independence gives uniqueness. Every basis has the same number of members: the dimension."],
    ["A linear map T from an n-dimensional space has a kernel (what it sends to zero) and an image (what it can reach). Choose a basis of the kernel and extend it to a basis of the whole space.", R`\underbrace{\mathbf k_1, \dots, \mathbf k_m}_{\text{kernel}}, \ \mathbf w_1, \dots, \mathbf w_{n-m}`, "Any independent set can be extended to a basis."],
    ["The images of the added vectors form a basis of the image.", R`\operatorname{rank}T + \operatorname{nullity}T = n`, "They span the image because the kernel vectors contribute nothing, and they are independent because a combination sent to zero would lie in the kernel. This is the rank–nullity theorem."],
    ["For a system of equations Ax = b this gives the structure of the solutions.", R`\mathbf x = \mathbf x_p + \mathbf x_h, \qquad A\mathbf x_h = \mathbf 0`, "One particular solution plus anything in the kernel: the same structure as for linear differential equations."]
  ], R`\operatorname{rank} + \operatorname{nullity} = n; \qquad \mathbf x = \sum_ix_i\mathbf v_i \ \text{uniquely in a basis}`, [
    "Function spaces are infinite-dimensional; there, questions of convergence arise that finite dimensions never raise.",
    "An inner product, such as the integral of fg, adds lengths and angles to a vector space."
  ]);

  d('m-svd', [
    ["The projection of b onto the direction of a is the multiple of a closest to b.", R`\operatorname{proj}_{\mathbf a}\mathbf b = \frac{\mathbf a\cdot\mathbf b}{\mathbf a\cdot\mathbf a}\,\mathbf a`, "Choose the multiple so that what is left of b is perpendicular to a."],
    ["Gram–Schmidt: make a set of vectors orthogonal by subtracting projections.", R`\mathbf u_k = \mathbf v_k - \sum_{j<k}\operatorname{proj}_{\mathbf u_j}\mathbf v_k`, "Each new vector has its components along the earlier ones removed. Normalising gives the factorisation A = QR."],
    ["Least squares: a system Ax = b with more equations than unknowns has no exact solution. Minimise the length of the residual.", R`\min_{\mathbf x}|A\mathbf x - \mathbf b|^2`, "Ax can be any vector in the column space of A; we want the one nearest to b."],
    ["The nearest point is where the residual is perpendicular to every column of A.", R`A^T(A\hat{\mathbf x} - \mathbf b) = \mathbf 0 \;\Longrightarrow\; A^TA\,\hat{\mathbf x} = A^T\mathbf b`, "The normal equations. This is how a straight line is fitted to data."],
    ["AᵀA is symmetric and its eigenvalues are not negative. Use its orthonormal eigenvectors.", R`A^TA\,\mathbf v_i = \sigma_i^2\mathbf v_i, \qquad \mathbf u_i = \frac{A\mathbf v_i}{\sigma_i}`, "xᵀAᵀAx = |Ax|² ≥ 0. The vectors u are orthonormal as well, since their dot products are those of the v, divided by the σ."],
    ["Collect these as matrices.", R`AV = U\Sigma \;\Longrightarrow\; A = U\Sigma V^T`, "Any matrix is a rotation, a stretch along perpendicular axes, and another rotation. Keeping only the largest σ gives the best low-rank approximation."]
  ], R`A^TA\,\hat{\mathbf x} = A^T\mathbf b, \qquad A = U\Sigma V^T`, [
    "The normal equations need the columns of A to be independent; otherwise use the SVD (the pseudo-inverse).",
    "Classical Gram–Schmidt loses accuracy in floating-point arithmetic; numerical codes use Householder reflections."
  ]);

  d('m-ode-systems', [
    ["A linear system of first-order equations.", R`\dot{\mathbf x} = A\mathbf x`, "Any higher-order linear equation can be written this way, with the velocity as an extra variable."],
    ["Try a solution that keeps its direction.", R`\mathbf x = e^{\lambda t}\mathbf v \;\Longrightarrow\; \lambda\mathbf v = A\mathbf v`, "An eigenvalue problem. Along an eigenvector the motion is pure exponential growth or decay."],
    ["The general solution is a combination of these.", R`\mathbf x(t) = c_1e^{\lambda_1t}\mathbf v_1 + c_2e^{\lambda_2t}\mathbf v_2`, "By linearity. The constants are fixed by the starting point."],
    ["In two dimensions the eigenvalues follow from the trace and the determinant.", R`\lambda^2 - \tau\lambda + \Delta = 0, \qquad \tau = \operatorname{tr}A, \quad \Delta = \det A, \qquad \lambda = \tfrac12\left(\tau \pm\sqrt{\tau^2 - 4\Delta}\right)`, "The characteristic equation of a 2 × 2 matrix."],
    ["Classify the fixed point at the origin.", R`\Delta < 0: \ \text{saddle}; \qquad \Delta > 0,\ \tau^2 > 4\Delta: \ \text{node}; \qquad \tau^2 < 4\Delta: \ \text{spiral}\ (\tau = 0: \text{centre}); \qquad \text{stable} \iff \tau < 0,\ \Delta > 0`, "Real eigenvalues of opposite sign, real of the same sign, or complex. Stability needs both real parts negative."],
    ["Near a fixed point of a non-linear system, linearise.", R`\dot{\mathbf x} = \mathbf f(\mathbf x), \quad \mathbf f(\mathbf x^*) = \mathbf 0 \;\Longrightarrow\; \dot{\boldsymbol\xi} \approx J\boldsymbol\xi, \qquad J_{ij} = \frac{\partial f_i}{\partial x_j}\bigg|_{\mathbf x^*}`, "A Taylor expansion to first order in the displacement ξ = x − x*. The Jacobian plays the role of A."]
  ], R`\mathbf x(t) = \sum_ic_ie^{\lambda_it}\mathbf v_i; \qquad \text{stable} \iff \operatorname{Re}\lambda_i < 0 \ \text{for all } i`, [
    "Linearisation is reliable only when no eigenvalue has zero real part: a linear centre may turn into a spiral once the non-linear terms are included.",
    "Repeated eigenvalues with too few eigenvectors give extra solutions of the form te^{λt}."
  ]);

  d('m-laplace', [
    ["Define the transform of a function of time.", R`F(s) = \mathcal L\{f(t)\} = \int_0^\infty f(t)\,e^{-st}\,dt`, "It weighs f against decaying exponentials; s must be large enough for the integral to converge."],
    ["An exponential.", R`\mathcal L\{e^{at}\} = \int_0^\infty e^{-(s - a)t}\,dt = \frac{1}{s - a} \qquad (s > a)`, "A direct integration. With a = iω the real and imaginary parts give the transforms of cos ωt and sin ωt."],
    ["The key property is the transform of a derivative. Integrate by parts.", R`\mathcal L\{f'\} = \left[f\,e^{-st}\right]_0^\infty + s\int_0^\infty f\,e^{-st}\,dt = sF(s) - f(0)`, "Differentiation becomes multiplication by s, and the starting value enters automatically."],
    ["Apply it twice.", R`\mathcal L\{f''\} = s^2F(s) - sf(0) - f'(0)`, "Replace f by f′ in the previous result."],
    ["So a differential equation becomes an algebraic one. Example: ÿ + ω²y = 0 with y(0) = 1 and ẏ(0) = 0.", R`s^2Y - s + \omega^2Y = 0 \;\Longrightarrow\; Y = \frac{s}{s^2 + \omega^2} \;\Longrightarrow\; y = \cos\omega t`, "Solve for Y and recognise it in the table of transforms."],
    ["A delayed switch-on, and a product of transforms.", R`\mathcal L\{u(t - a)f(t - a)\} = e^{-as}F(s), \qquad \mathcal L\{f * g\} = F(s)\,G(s)`, "A delay multiplies the transform by e^{−as}; a convolution in time is a product in s. The response of a system is its impulse response convolved with the input."]
  ], R`\mathcal L\{f'\} = sF(s) - f(0), \qquad \mathcal L\{e^{at}\} = \frac{1}{s - a}, \qquad \mathcal L\{t^n\} = \frac{n!}{s^{n+1}}`, [
    "f must not grow faster than an exponential, or the integral diverges for every s.",
    "Inverting usually means partial fractions and a table; the general inverse is a contour integral in the complex s-plane."
  ]);

  /* ---------- Year 2 ---------- */
  d('m-divcurl', [
    ["Divergence measures net outflow per unit volume. Take a small box with sides δx, δy, δz and add the flux through the two faces perpendicular to x.", R`\left[F_x(x + \delta x) - F_x(x)\right]\delta y\,\delta z \approx \frac{\partial F_x}{\partial x}\,\delta x\,\delta y\,\delta z`, "Flux out through the far face minus flux in through the near face."],
    ["Add the other two pairs of faces and divide by the volume.", R`\nabla\cdot\mathbf F = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}`, "Positive where field lines start (a source), negative where they end."],
    ["Curl measures circulation per unit area. Go anticlockwise round a small rectangle in the xy-plane.", R`\oint\mathbf F\cdot d\mathbf r \approx \left(\frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y}\right)\delta x\,\delta y`, "Opposite sides contribute with opposite signs, leaving the differences across the rectangle."],
    ["That is the z-component. All three together:", R`\nabla\times\mathbf F = \begin{vmatrix}\hat{\mathbf x} & \hat{\mathbf y} & \hat{\mathbf z}\\ \partial_x & \partial_y & \partial_z\\ F_x & F_y & F_z\end{vmatrix}`, "Its direction is the axis about which a small paddle wheel placed in the flow would spin fastest."],
    ["Two examples.", R`\nabla\cdot\mathbf r = 3, \quad \nabla\times\mathbf r = \mathbf 0; \qquad \nabla\times(\boldsymbol\omega\times\mathbf r) = 2\boldsymbol\omega`, "A radial field has outflow but no rotation. Rigid rotation has a curl of twice the angular velocity."],
    ["Two identities follow from the symmetry of mixed partial derivatives.", R`\nabla\times(\nabla\varphi) = \mathbf 0, \qquad \nabla\cdot(\nabla\times\mathbf F) = 0`, "Each term appears twice with opposite signs. Hence a static electric field has no curl, and a magnetic field, being the curl of a vector potential, has no divergence."]
  ], R`\nabla\cdot\mathbf F = \partial_xF_x + \partial_yF_y + \partial_zF_z, \qquad \nabla\times(\nabla\varphi) = \mathbf 0, \qquad \nabla\cdot(\nabla\times\mathbf F) = 0`, [
    "The Cartesian formulas do not carry over term by term to spherical or cylindrical coordinates, where the unit vectors change with position.",
    "The field of a point source has zero divergence everywhere except at the origin, where it is a delta function of strength 4π."
  ]);

  d('m-theorems', [
    ["Divide a volume into small boxes. For each, the net outflow is its divergence times its volume.", R`\oint_{\text{box}}\mathbf F\cdot d\mathbf S \approx (\nabla\cdot\mathbf F)\,\delta V`, "This is the definition of divergence."],
    ["Add up all the boxes. On every shared face the outflow from one box is the inflow to its neighbour.", R`\oint_S\mathbf F\cdot d\mathbf S = \int_V\nabla\cdot\mathbf F\,dV`, "Interior faces cancel, leaving only the outer surface: the divergence theorem."],
    ["Divide a surface into small loops. For each, the circulation is the normal component of the curl times its area.", R`\oint_{\text{loop}}\mathbf F\cdot d\mathbf r \approx (\nabla\times\mathbf F)\cdot\delta\mathbf S`, "This is the definition of curl."],
    ["Add up all the loops. Every shared edge is traversed in opposite directions by its two neighbours.", R`\oint_C\mathbf F\cdot d\mathbf r = \int_S(\nabla\times\mathbf F)\cdot d\mathbf S`, "Interior edges cancel, leaving the boundary curve: Stokes’ theorem. In the plane it is Green’s theorem."],
    ["Apply the divergence theorem to Gauss’s law.", R`\nabla\cdot\mathbf E = \frac{\rho}{\varepsilon_0} \iff \oint\mathbf E\cdot d\mathbf S = \frac{Q_{\text{enc}}}{\varepsilon_0}`, "The two theorems translate between the differential and the integral forms of Maxwell’s equations."],
    ["Apply Green’s theorem to the field ½(−y, x).", R`A = \tfrac12\oint(x\,dy - y\,dx)`, "The curl of this field is 1, so its circulation round a closed curve is the enclosed area. A planimeter works this way."]
  ], R`\oint_S\mathbf F\cdot d\mathbf S = \int_V\nabla\cdot\mathbf F\,dV, \qquad \oint_C\mathbf F\cdot d\mathbf r = \int_S(\nabla\times\mathbf F)\cdot d\mathbf S`, [
    "F must be differentiable throughout the region; a point charge inside has to be treated with a delta function or cut out with a small sphere.",
    "Orientation matters: the outward normal for a closed surface, and the right-hand rule linking a curve to the surface it bounds."
  ]);

  d('m-fourier-series', [
    ["Try to write a function of period 2π as a sum of sines and cosines.", R`f(x) = \frac{a_0}{2} + \sum_{n=1}^\infty\left(a_n\cos nx + b_n\sin nx\right)`, "Sines and cosines of whole-number frequency are the ones that fit the period exactly."],
    ["They are orthogonal over one period.", R`\int_{-\pi}^\pi\cos mx\cos nx\,dx = \pi\delta_{mn}, \qquad \int_{-\pi}^\pi\sin mx\sin nx\,dx = \pi\delta_{mn}, \qquad \int_{-\pi}^\pi\sin mx\cos nx\,dx = 0`, "Use the product-to-sum formulae: every product integrates to zero over a full period unless m = n."],
    ["Multiply the series by cos mx and integrate. Only one term survives.", R`a_n = \frac1\pi\int_{-\pi}^\pi f(x)\cos nx\,dx, \qquad b_n = \frac1\pi\int_{-\pi}^\pi f(x)\sin nx\,dx`, "Exactly like finding a component of a vector by taking its dot product with a basis vector."],
    ["Example: a square wave, +1 for 0 < x < π and −1 for −π < x < 0.", R`a_n = 0, \qquad b_n = \frac2\pi\int_0^\pi\sin nx\,dx = \frac{2(1 - \cos n\pi)}{n\pi} \;\Longrightarrow\; f(x) = \frac4\pi\sum_{n\ \text{odd}}\frac{\sin nx}{n}`, "The function is odd, so there are no cosines, and the even harmonics vanish."],
    ["Equivalently, with complex exponentials:", R`f(x) = \sum_{n=-\infty}^\infty c_ne^{inx}, \qquad c_n = \frac{1}{2\pi}\int_{-\pi}^\pi f(x)\,e^{-inx}\,dx`, "One formula for all the coefficients, using the orthogonality of e^{inx}."]
  ], R`a_n = \frac1\pi\int_{-\pi}^\pi f\cos nx\,dx, \qquad b_n = \frac1\pi\int_{-\pi}^\pi f\sin nx\,dx`, [
    "At a jump the series converges to the midpoint, and the partial sums overshoot by about 9% of the jump however many terms are taken (the Gibbs phenomenon).",
    "The smoother the function, the faster its coefficients fall: as 1/n for a jump, 1/n² for a kink."
  ]);

  d('m-fourier-transform', [
    ["Let the period of a Fourier series grow without limit. The sum over harmonics becomes an integral over wavenumber.", R`F(k) = \int_{-\infty}^\infty f(x)\,e^{-ikx}\,dx, \qquad f(x) = \frac{1}{2\pi}\int_{-\infty}^\infty F(k)\,e^{ikx}\,dk`, "A function that does not repeat needs a continuous range of frequencies."],
    ["Transform a derivative by integrating by parts.", R`\int f'(x)\,e^{-ikx}\,dx = \left[f\,e^{-ikx}\right]_{-\infty}^\infty + ik\int f\,e^{-ikx}\,dx = ik\,F(k)`, "The boundary term vanishes if f → 0 at infinity. Differentiation becomes multiplication by ik."],
    ["Transform a Gaussian by completing the square in the exponent.", R`\int e^{-x^2/2\sigma^2}e^{-ikx}\,dx = e^{-\sigma^2k^2/2}\int e^{-(x + ik\sigma^2)^2/2\sigma^2}\,dx = \sigma\sqrt{2\pi}\,e^{-\sigma^2k^2/2}`, "What remains is a standard Gaussian integral; shifting the variable by an imaginary constant does not change it."],
    ["A Gaussian of width σ in x has a transform of width 1/σ in k.", R`\sigma_x = \sigma, \quad \sigma_k = \frac1\sigma \;\Longrightarrow\; \sigma_x\sigma_k = 1`, "A narrow pulse needs a wide spread of frequencies, and the reverse."],
    ["For the intensities |f|² and |F|² each width is smaller by √2, and for any function at all:", R`\Delta x\,\Delta k \ge \tfrac12`, "The Gaussian is the function that reaches the minimum. With p = ħk this is Heisenberg’s uncertainty relation."],
    ["A convolution transforms into a product.", R`(f * g)(x) = \int f(y)\,g(x - y)\,dy \;\longmapsto\; F(k)\,G(k)`, "Change the order of integration. Blurring by an instrument multiplies the spectrum by the transform of its response."]
  ], R`F(k) = \int f(x)e^{-ikx}dx, \qquad f' \mapsto ikF, \qquad e^{-x^2/2\sigma^2} \mapsto \sigma\sqrt{2\pi}\,e^{-\sigma^2k^2/2}, \qquad \Delta x\,\Delta k \ge \tfrac12`, [
    "Conventions differ in where the 2π goes and in the sign of the exponent; check before combining formulae from two sources.",
    "The function must be integrable; sines, constants and delta functions are handled as distributions."
  ]);

  d('m-pde', [
    ["The heat equation on a rod of length L whose ends are held at zero.", R`\frac{\partial u}{\partial t} = \kappa\frac{\partial^2u}{\partial x^2}, \qquad u(0, t) = u(L, t) = 0`, "The temperature changes at a rate set by its curvature: peaks fall and troughs fill."],
    ["Look for solutions that are a product of a function of x and a function of t.", R`u = X(x)\,T(t) \;\Longrightarrow\; \frac{1}{\kappa}\frac{T'}{T} = \frac{X''}{X}`, "Substitute and divide by XT."],
    ["The left side depends only on t and the right only on x, so both equal a constant.", R`\frac{X''}{X} = -\lambda, \qquad \frac{T'}{T} = -\kappa\lambda`, "A function of t alone can equal a function of x alone only if neither varies."],
    ["The boundary conditions select the allowed values of the constant.", R`X'' = -\lambda X, \quad X(0) = X(L) = 0 \;\Longrightarrow\; X_n = \sin\frac{n\pi x}{L}, \qquad \lambda_n = \left(\frac{n\pi}{L}\right)^2`, "An eigenvalue problem: only whole numbers of half-waves fit between the ends."],
    ["Each mode decays at its own rate. Add them all.", R`u(x, t) = \sum_{n=1}^\infty b_n\sin\frac{n\pi x}{L}\,e^{-\kappa(n\pi/L)^2t}`, "The equation is linear, so solutions can be superposed."],
    ["The initial temperature fixes the coefficients.", R`b_n = \frac2L\int_0^Lu(x, 0)\sin\frac{n\pi x}{L}\,dx`, "A Fourier sine series of the starting profile. Fine detail (large n) disappears first."]
  ], R`u(x, t) = \sum_nb_n\sin\frac{n\pi x}{L}\,e^{-\kappa(n\pi/L)^2t}, \qquad \lambda_n = \left(\frac{n\pi}{L}\right)^2`, [
    "Works for linear equations with boundaries that match the coordinates. Other boundary conditions change the eigenfunctions: cosines for insulated ends.",
    "The same steps solve the wave equation, where each mode oscillates instead of decaying, and Laplace’s equation."
  ]);

  d('m-variations', [
    ["A functional assigns a number to a whole curve y(x).", R`J[y] = \int_a^bF(x, y, y')\,dx`, "Length, travel time and action are all of this form."],
    ["Perturb the curve slightly, keeping its end points fixed.", R`y \to y + \varepsilon\eta(x), \qquad \eta(a) = \eta(b) = 0`, "If y makes J stationary, the first-order change must vanish for every such η."],
    ["Differentiate with respect to ε and integrate the second term by parts.", R`\frac{dJ}{d\varepsilon}\bigg|_0 = \int_a^b\left(\frac{\partial F}{\partial y}\eta + \frac{\partial F}{\partial y'}\eta'\right)dx = \int_a^b\left(\frac{\partial F}{\partial y} - \frac{d}{dx}\frac{\partial F}{\partial y'}\right)\eta\,dx`, "The boundary term vanishes because η is zero at both ends."],
    ["This must be zero for every η.", R`\frac{\partial F}{\partial y} - \frac{d}{dx}\frac{\partial F}{\partial y'} = 0`, "The Euler–Lagrange equation. If the bracket were non-zero anywhere, an η concentrated there would give a non-zero result."],
    ["If F does not depend explicitly on x there is a first integral.", R`\frac{d}{dx}\left(F - y'\frac{\partial F}{\partial y'}\right) = 0 \;\Longrightarrow\; F - y'\frac{\partial F}{\partial y'} = C`, "The Beltrami identity: differentiate and use the Euler–Lagrange equation. In mechanics it is the conservation of energy."],
    ["Example: the shortest path between two points.", R`F = \sqrt{1 + y'^2}: \qquad \frac{d}{dx}\frac{y'}{\sqrt{1 + y'^2}} = 0 \;\Longrightarrow\; y' = \text{constant}`, "F does not depend on y, so its derivative with respect to y′ is constant. A straight line."]
  ], R`\frac{\partial F}{\partial y} - \frac{d}{dx}\frac{\partial F}{\partial y'} = 0; \qquad F - y'\frac{\partial F}{\partial y'} = C \ \ \text{if}\ \frac{\partial F}{\partial x} = 0`, [
    "The equation gives stationary curves, which may be minima, maxima or saddle points.",
    "Fermat’s principle of least time gives Snell’s law, and the brachistochrone (the fastest slide) is a cycloid."
  ]);

  d('m-lagrange-mult', [
    ["To find the extreme values of f(x, y) on the curve g(x, y) = c, move along the curve.", R`df = \nabla f\cdot d\mathbf r = 0 \quad \text{for every } d\mathbf r \text{ along the curve}`, "At a constrained extremum f does not change to first order as you move along the constraint."],
    ["Steps along the curve are perpendicular to ∇g.", R`dg = \nabla g\cdot d\mathbf r = 0`, "g is constant on the curve."],
    ["So ∇f is also perpendicular to the curve, and hence parallel to ∇g.", R`\nabla f = \lambda\nabla g`, "At the extremum a contour of f touches the constraint curve. λ is the Lagrange multiplier."],
    ["Equivalently, make this function stationary with respect to x, y and λ.", R`\Lambda = f - \lambda(g - c): \qquad \frac{\partial\Lambda}{\partial x} = \frac{\partial\Lambda}{\partial y} = 0, \quad \frac{\partial\Lambda}{\partial\lambda} = 0`, "The first two give ∇f = λ∇g; the third returns the constraint."],
    ["Example: the largest rectangle with perimeter P. Maximise xy subject to 2x + 2y = P.", R`y = 2\lambda, \quad x = 2\lambda \;\Longrightarrow\; x = y = \frac P4`, "A square."],
    ["The multiplier has a meaning.", R`\frac{df^*}{dc} = \lambda`, "It is the rate at which the best value f* improves when the constraint is relaxed. Here λ = P/8, which is the derivative of the best area P²/16. In statistical mechanics the multiplier for fixed energy is 1/kT."]
  ], R`\nabla f = \lambda\nabla g, \qquad \frac{df^*}{dc} = \lambda`, [
    "Requires ∇g ≠ 0 on the constraint. The method finds stationary points; which of them are maxima has to be checked separately.",
    "With several constraints, ∇f = λ₁∇g₁ + λ₂∇g₂ + …"
  ]);

  d('m-probability', [
    ["Stirling’s approximation: turn the logarithm of a factorial into an integral.", R`\ln n! = \sum_{k=1}^n\ln k \approx \int_1^n\ln x\,dx = n\ln n - n + 1 \;\Longrightarrow\; \ln n! \approx n\ln n - n`, "For large n the sum is well approximated by the area under ln x. The accurate form is n! ≈ √(2πn) nⁿe^{−n}."],
    ["The binomial distribution for N trials, with n = Np + x successes:", R`P(n) = \frac{N!}{n!\,(N - n)!}\,p^nq^{N-n}`, "x measures the departure from the mean Np."],
    ["Take logarithms, apply Stirling’s approximation and expand to second order in x.", R`\ln P \approx \text{const} - \frac{x^2}{2Npq}`, "The first-order terms cancel because the mean is the most probable value; the second derivative of ln P there is −1/Npq."],
    ["Exponentiate and normalise.", R`P(n) \approx \frac{1}{\sqrt{2\pi Npq}}\exp\!\left[-\frac{(n - Np)^2}{2Npq}\right]`, "A Gaussian with mean Np and standard deviation √(Npq)."],
    ["The relative width shrinks as the number of trials grows.", R`\frac\sigma\mu = \frac{\sqrt{Npq}}{Np} \propto \frac{1}{\sqrt N}`, "For 10²³ molecules the fluctuations are about 3 × 10⁻¹² of the mean, which is why thermodynamic quantities appear sharp."],
    ["The same shape appears for any sum of many independent variables.", R`\frac{X_1 + \dots + X_N - N\mu}{\sigma\sqrt N} \to N(0, 1)`, "The central limit theorem: only the mean and variance of the individual terms survive in the limit."]
  ], R`\ln n! \approx n\ln n - n, \qquad P(n) \approx \frac{1}{\sqrt{2\pi Npq}}\,e^{-(n - Np)^2/2Npq}, \qquad \frac\sigma\mu \propto \frac{1}{\sqrt N}`, [
    "The Gaussian form is good near the peak, within a few standard deviations; the far tails need the exact distribution.",
    "The central limit theorem needs a finite variance: sums of heavy-tailed variables (Cauchy, Lévy) do not become Gaussian."
  ]);

  d('m-delta', [
    ["Take a sequence of functions of unit area that become ever narrower.", R`\delta_\varepsilon(x) = \frac{1}{\varepsilon\sqrt\pi}\,e^{-x^2/\varepsilon^2}, \qquad \int_{-\infty}^\infty\delta_\varepsilon(x)\,dx = 1`, "A Gaussian of width ε; a narrow top-hat of height 1/ε would serve equally well."],
    ["Integrate one against a smooth function.", R`\int\delta_\varepsilon(x - a)\,f(x)\,dx \;\xrightarrow{\ \varepsilon\to0\ }\; f(a)`, "The spike samples f only very close to a, where f is essentially constant and can be taken outside the integral."],
    ["Define the delta function by this limit.", R`\int_{-\infty}^\infty\delta(x - a)\,f(x)\,dx = f(a)`, "The sifting property. δ is not an ordinary function: it has a meaning only inside an integral."],
    ["Change variable to find the effect of scaling.", R`\int\delta(ax)f(x)\,dx = \frac{1}{|a|}\int\delta(u)f\!\left(\frac ua\right)du = \frac{f(0)}{|a|} \;\Longrightarrow\; \delta(ax) = \frac{\delta(x)}{|a|}`, "Put u = ax. The modulus appears because a negative a reverses the limits."],
    ["Near each simple zero x_i of g, the function is g′(x_i)(x − x_i) to first order.", R`\delta(g(x)) = \sum_i\frac{\delta(x - x_i)}{|g'(x_i)|}`, "Apply the scaling rule at every zero."],
    ["Integrate the delta function up to x.", R`\int_{-\infty}^x\delta(x')\,dx' = H(x) \;\Longrightarrow\; H'(x) = \delta(x)`, "The result is 0 before the spike and 1 after it: the step function. A derivative of δ is defined by integrating by parts, and picks out −f′(0)."]
  ], R`\int\delta(x - a)f(x)\,dx = f(a), \qquad \delta(ax) = \frac{\delta(x)}{|a|}, \qquad H'(x) = \delta(x)`, [
    "Products such as the square of δ(x) are not defined.",
    "δ(x) has the dimensions of 1/x: a point charge q has charge density qδ³(r).",
    "Its Fourier representation is δ(x) = (1/2π) times the integral of e^{ikx} over all k."
  ]);

  d('m-separation', [
    ["The wave equation on a string fixed at both ends.", R`\frac{\partial^2u}{\partial t^2} = c^2\frac{\partial^2u}{\partial x^2}, \qquad u(0, t) = u(L, t) = 0`, "c is the wave speed."],
    ["Separate the variables, u = X(x)T(t).", R`\frac{X''}{X} = \frac{1}{c^2}\frac{T''}{T} = -k^2`, "Each side depends on a different variable, so both equal a constant. It must be negative for the ends to stay fixed."],
    ["The ends select the wavenumbers, and each gives a frequency.", R`X_n = \sin\frac{n\pi x}{L}, \qquad T_n = A_n\cos\omega_nt + B_n\sin\omega_nt, \qquad \omega_n = \frac{n\pi c}{L}, \quad f_n = \frac{nc}{2L}`, "The harmonics of a string: whole-number multiples of the fundamental c/2L."],
    ["The general motion is a superposition of these standing waves, and each standing wave is a pair of travelling waves.", R`\sin kx\cos\omega t = \tfrac12\left[\sin(kx - \omega t) + \sin(kx + \omega t)\right] \;\Longrightarrow\; u = F(x - ct) + G(x + ct)`, "d’Alembert’s form of the solution: any shape moving right plus any shape moving left."],
    ["Laplace’s equation in a rectangle separates into an oscillating factor and a growing one.", R`\nabla^2u = 0, \quad u = X(x)Y(y) \;\Longrightarrow\; \frac{X''}{X} = -\frac{Y''}{Y} = -k^2 \;\Longrightarrow\; u = \sin\frac{n\pi x}{a}\,\sinh\frac{n\pi y}{a}`, "The two constants must add to zero, so a solution that oscillates in x is exponential in y."],
    ["In plane polar coordinates the separated solutions are powers of r.", R`u = R(r)\,\Theta(\theta) \;\Longrightarrow\; u = r^{\pm n}\cos n\theta, \ \ r^{\pm n}\sin n\theta`, "Θ must return to itself after a full turn, which forces n to be a whole number."]
  ], R`f_n = \frac{nc}{2L}, \qquad u = F(x - ct) + G(x + ct), \qquad u = \sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a}`, [
    "Any reasonable starting shape or boundary value can be expanded in the separated solutions, because the eigenfunctions form a complete orthogonal set (Sturm–Liouville theory).",
    "Separation needs boundaries that lie along coordinate surfaces."
  ]);

  d('m-dft', [
    ["Sample a signal at N equally spaced times and define its discrete Fourier transform.", R`X_k = \sum_{n=0}^{N-1}x_n\,e^{-2\pi ikn/N}, \qquad k = 0, 1, \dots, N - 1`, "The amplitude of the component that completes k cycles over the record."],
    ["The sampled exponentials are orthogonal.", R`\sum_{n=0}^{N-1}e^{2\pi i(k - k')n/N} = \frac{1 - e^{2\pi i(k - k')}}{1 - e^{2\pi i(k - k')/N}} = N\delta_{kk'}`, "A geometric series: the numerator is zero unless k = k′, when every term is 1."],
    ["So the transform can be inverted exactly.", R`x_n = \frac1N\sum_{k=0}^{N-1}X_k\,e^{2\pi ikn/N}`, "Substitute the definition of X_k and use the orthogonality. Nothing is lost: N numbers in, N numbers out."],
    ["With sampling interval Δt and record length T = NΔt, the frequencies are:", R`f_k = \frac kT, \qquad \Delta f = \frac1T`, "A longer record gives finer frequency resolution."],
    ["Frequencies that differ by the sampling rate cannot be told apart.", R`e^{-2\pi i(k + N)n/N} = e^{-2\pi ikn/N} \;\Longrightarrow\; f \ \text{and}\ f + f_s \ \text{give identical samples}`, "Aliasing. To avoid it the signal must contain no frequencies above half the sampling rate, the Nyquist frequency."],
    ["Computed directly the transform takes N² operations. Split the sum into even and odd samples.", R`X_k = E_k + e^{-2\pi ik/N}O_k, \qquad X_{k+N/2} = E_k - e^{-2\pi ik/N}O_k`, "E and O are transforms of length N/2. Repeating the split gives the fast Fourier transform, with about N log₂N operations."]
  ], R`X_k = \sum_{n=0}^{N-1}x_ne^{-2\pi ikn/N}, \qquad x_n = \frac1N\sum_{k=0}^{N-1}X_ke^{2\pi ikn/N}, \qquad f_{\text{Nyq}} = \frac{f_s}{2}`, [
    "The DFT treats the record as one period of a repeating signal; a mismatch between its two ends smears each line into its neighbours (leakage), which a window reduces.",
    "The simple FFT needs N to be a power of 2."
  ]);

  d('m-statistics-uni', [
    ["Given data, the likelihood is the probability of those data, regarded as a function of the unknown parameter. For n Poisson counts x_i:", R`L(\lambda) = \prod_{i=1}^n\frac{e^{-\lambda}\lambda^{x_i}}{x_i!}, \qquad \ln L = -n\lambda + \ln\lambda\sum x_i + \text{const}`, "Independent observations multiply. The logarithm turns the product into a sum."],
    ["Maximise.", R`\frac{d\ln L}{d\lambda} = -n + \frac{\sum x_i}{\lambda} = 0 \;\Longrightarrow\; \hat\lambda = \bar x`, "The maximum-likelihood estimate of the rate is the sample mean."],
    ["The curvature of ln L at its peak gives the uncertainty.", R`\operatorname{Var}(\hat\lambda) \approx \left[-\frac{d^2\ln L}{d\lambda^2}\right]^{-1} = \frac{\hat\lambda^2}{\sum x_i} = \frac{\hat\lambda}{n}`, "A sharply peaked likelihood means a well-determined parameter. No unbiased estimator can do better (the Cramér–Rao bound)."],
    ["Bayes’ theorem turns the likelihood into a probability for the parameter.", R`P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta)\,P(\theta)`, "Posterior ∝ likelihood × prior."],
    ["Example: k successes in n trials, with a Beta prior.", R`\theta^{a-1}(1 - \theta)^{b-1}\times\theta^k(1 - \theta)^{n-k} \;\Longrightarrow\; \text{Beta}(a, b) \to \text{Beta}(a + k,\ b + n - k)`, "The prior acts like a − 1 earlier successes and b − 1 earlier failures. With enough data the prior stops mattering."],
    ["For Gaussian errors, maximising the likelihood is minimising χ². For a constant fitted to points with errors σ_i:", R`\chi^2 = \sum_i\frac{(x_i - \mu)^2}{\sigma_i^2}, \quad \frac{d\chi^2}{d\mu} = 0 \;\Longrightarrow\; \hat\mu = \frac{\sum x_i/\sigma_i^2}{\sum1/\sigma_i^2}, \qquad \frac{1}{\sigma_{\hat\mu}^2} = \sum_i\frac{1}{\sigma_i^2}`, "The weighted mean: precise points count for more. Fitting a straight line by least squares is the same idea with two parameters."]
  ], R`\hat\lambda = \bar x, \qquad P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta)P(\theta), \qquad \hat\mu = \frac{\sum x_i/\sigma_i^2}{\sum1/\sigma_i^2}`, [
    "Maximum likelihood is only as good as the model for the data, and can be biased for small samples.",
    "A good fit has χ² close to the number of degrees of freedom; much larger means a poor model or underestimated errors, much smaller means overestimated errors."
  ]);

  d('m-random-walks', [
    ["A walker takes N independent steps of length a, each to the left or to the right with equal probability.", R`x = \sum_{i=1}^Ns_i, \qquad s_i = \pm a`, "The simplest model of diffusion."],
    ["The mean displacement is zero. Find the mean square.", R`\langle x^2\rangle = \sum_i\langle s_i^2\rangle + \sum_{i\ne j}\langle s_is_j\rangle = Na^2`, "Every squared step is a², and the cross terms average to zero because the steps are independent."],
    ["So the typical distance grows as the square root of the number of steps.", R`x_{\text{rms}} = a\sqrt N`, "Not as N: most of the steps cancel one another."],
    ["If a step takes time τ, then N = t/τ.", R`\langle x^2\rangle = \frac{a^2}{\tau}\,t = 2Dt, \qquad D = \frac{a^2}{2\tau}`, "This defines the diffusion coefficient. In three dimensions each direction contributes 2Dt, so ⟨r²⟩ = 6Dt."],
    ["Let P(x, t) be the probability of being at x. One step later:", R`P(x, t + \tau) = \tfrac12P(x - a, t) + \tfrac12P(x + a, t)`, "The walker arrived from one of the two neighbouring sites."],
    ["Expand to first order in τ and second order in a.", R`\frac{\partial P}{\partial t} = D\frac{\partial^2P}{\partial x^2} \;\Longrightarrow\; P = \frac{1}{\sqrt{4\pi Dt}}\,e^{-x^2/4Dt}`, "The diffusion equation. Its solution from a point start is a Gaussian with variance 2Dt, as the central limit theorem requires."]
  ], R`x_{\text{rms}} = a\sqrt N, \qquad \langle x^2\rangle = 2Dt, \qquad \frac{\partial P}{\partial t} = D\frac{\partial^2P}{\partial x^2}`, [
    "Steps must be independent with a finite variance; correlated or heavy-tailed steps give anomalous diffusion, ⟨x²⟩ ∝ t^α with α ≠ 1.",
    "For a sphere of radius r in a fluid of viscosity η, Einstein showed that D = kT/6πηr, which let Perrin measure Avogadro’s number.",
    "A Markov chain generalises the walk: the next state depends only on the present one, and repeated steps approach a stationary distribution."
  ]);
})();
/* ---- derive-10.js ---- */
/* Geodesic — derivations for notes-only topics: university maths Year 3, special functions, Year 4. */
(function () {
  const W = (window.WL = window.WL || {}), D = (W.derive = W.derive || {}), R = String.raw;
  const d = (id, steps, result, assume) => { D[id] = { steps: steps.map(([say, tex, why]) => ({ say, tex, why })), result, assume }; };

  /* ---------- Year 3 ---------- */
  d('m-hilbert', [
    ["A Hilbert space is a vector space with an inner product. Expand a state in an orthonormal basis.", R`|\psi\rangle = \sum_nc_n|n\rangle, \qquad \langle m|n\rangle = \delta_{mn}`, "The kets |n⟩ play the part of unit vectors; for wavefunctions the inner product ⟨φ|ψ⟩ is the integral of φ*ψ."],
    ["Take the inner product with ⟨m|.", R`\langle m|\psi\rangle = \sum_nc_n\langle m|n\rangle = c_m`, "Orthonormality picks out one coefficient: the component of ψ along |m⟩."],
    ["Put this back.", R`|\psi\rangle = \sum_n|n\rangle\langle n|\psi\rangle \;\Longrightarrow\; \sum_n|n\rangle\langle n| = 1`, "True for every |ψ⟩, so the sum of projectors is the identity: the completeness relation."],
    ["A Hermitian operator equals its own adjoint. Take an eigenstate and compute the expectation value in two ways.", R`A|a\rangle = a|a\rangle: \qquad \langle a|A|a\rangle = a\langle a|a\rangle, \qquad \langle a|A|a\rangle^* = \langle a|A^\dagger|a\rangle = \langle a|A|a\rangle \;\Longrightarrow\; a = a^*`, "Its eigenvalues are real, as measured values must be."],
    ["Two eigenstates with different eigenvalues:", R`\langle b|A|a\rangle = a\langle b|a\rangle = b\langle b|a\rangle \;\Longrightarrow\; (a - b)\langle b|a\rangle = 0 \;\Longrightarrow\; \langle b|a\rangle = 0`, "Act with A to the right, or to the left using A = A†. Eigenstates with different eigenvalues are orthogonal."],
    ["For any two states, the norm of |φ⟩ − λ|ψ⟩ cannot be negative. Choosing the λ that makes it smallest gives:", R`|\langle\varphi|\psi\rangle|^2 \le \langle\varphi|\varphi\rangle\,\langle\psi|\psi\rangle`, "The Cauchy–Schwarz inequality, the step behind the general uncertainty relation."]
  ], R`c_n = \langle n|\psi\rangle, \qquad \sum_n|n\rangle\langle n| = 1, \qquad A = A^\dagger \Rightarrow a_n \in \mathbb R,\ \ \langle a_m|a_n\rangle = \delta_{mn}`, [
    "In infinite dimensions the sums must converge: physical states have a finite norm. Plane waves and position eigenstates are not in the space, but work as limits (delta-function normalisation).",
    "For unbounded operators such as momentum, being Hermitian in the loose sense is not enough: the domain matters (self-adjointness)."
  ]);

  d('m-complex-analysis', [
    ["For f(z) = u + iv to have a derivative, the limit must be the same from every direction. Compare a step along x with a step along y.", R`f'(z) = \frac{\partial u}{\partial x} + i\frac{\partial v}{\partial x} = \frac1i\left(\frac{\partial u}{\partial y} + i\frac{\partial v}{\partial y}\right)`, "δz = δx in one case and δz = iδy in the other."],
    ["Equate real and imaginary parts.", R`\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}`, "The Cauchy–Riemann equations. They make u and v each satisfy Laplace’s equation."],
    ["Integrate round a closed curve and apply Green’s theorem.", R`\oint f\,dz = \oint(u\,dx - v\,dy) + i\oint(v\,dx + u\,dy) = -\iint(v_x + u_y)\,dA + i\iint(u_x - v_y)\,dA = 0`, "Both integrands vanish by the Cauchy–Riemann equations: Cauchy’s theorem. A contour can be deformed freely through any region where f is analytic."],
    ["One integral does not vanish.", R`\oint_{|z - a| = \rho}\frac{dz}{z - a} = \int_0^{2\pi}\frac{i\rho e^{i\theta}}{\rho e^{i\theta}}\,d\theta = 2\pi i, \qquad \oint(z - a)^n\,dz = 0 \ \ (n \ne -1)`, "Put z = a + ρe^{iθ}. Every other power integrates to zero round the circle."],
    ["Near an isolated singularity expand f in positive and negative powers of z − a (a Laurent series). Only one term survives the integration.", R`f(z) = \sum_{n=-\infty}^\infty c_n(z - a)^n \;\Longrightarrow\; \oint f\,dz = 2\pi i\,c_{-1}`, "The coefficient of 1/(z − a) is called the residue."],
    ["Shrink the contour onto each singularity it encloses.", R`\oint_Cf(z)\,dz = 2\pi i\sum_k\operatorname{Res}_{z = a_k}f`, "The residue theorem. It evaluates real integrals and sums, and contains Cauchy’s integral formula for f(a)."]
  ], R`u_x = v_y, \ \ u_y = -v_x; \qquad \oint f\,dz = 2\pi i\sum\operatorname{Res}; \qquad f(a) = \frac{1}{2\pi i}\oint\frac{f(z)}{z - a}\,dz`, [
    "The contour is taken anticlockwise and must not pass through a singularity.",
    "For a simple pole the residue is the limit of (z − a)f(z). When a contour is closed at infinity, check that the arc really contributes nothing (Jordan’s lemma)."
  ]);

  d('m-numerical', [
    ["Euler’s method steps along the tangent.", R`y' = f(x, y): \qquad y_{n+1} = y_n + hf(x_n, y_n)`, "The first two terms of the Taylor series for y(x + h)."],
    ["The error made in one step is the first term left out.", R`y(x_n + h) - y_{n+1} = \tfrac12h^2y''(\xi) = O(h^2)`, "The local truncation error."],
    ["To reach a fixed x takes N = x/h steps, so the errors accumulate.", R`E_{\text{global}} \sim N\times O(h^2) = O(h)`, "Euler is a first-order method: halving the step halves the error. A method with local error O(h^{p+1}) has global error O(hᵖ); the classical Runge–Kutta method has p = 4."],
    ["Accuracy is not enough. Apply Euler to the test equation y′ = −λy, whose true solution decays.", R`y_{n+1} = (1 - h\lambda)\,y_n \;\Longrightarrow\; y_n = (1 - h\lambda)^ny_0`, "Each step multiplies by the same factor."],
    ["The numerical solution decays only if that factor is smaller than 1 in size.", R`|1 - h\lambda| < 1 \iff h < \frac2\lambda`, "With a larger step the numerical solution grows and oscillates although the true one decays. Stiff problems, with a very large λ somewhere, force a tiny step."],
    ["The implicit (backward) Euler method evaluates the slope at the end of the step.", R`y_{n+1} = y_n - h\lambda\,y_{n+1} \;\Longrightarrow\; y_{n+1} = \frac{y_n}{1 + h\lambda}`, "The factor is less than 1 for every h > 0: stable whatever the step, at the cost of solving an equation at each step."]
  ], R`E_{\text{global}} = O(h^p); \qquad \text{Euler stable} \iff |1 - h\lambda| < 1; \qquad \text{backward Euler: } y_{n+1} = \frac{y_n}{1 + h\lambda}`, [
    "Stable does not mean accurate: backward Euler damps everything, including oscillations that should persist.",
    "For Hamiltonian systems over long times use a symplectic method (leapfrog), which keeps the energy error bounded instead of letting it drift.",
    "Rounding error grows as the step shrinks, so there is a best step size."
  ]);

  d('m-tensors', [
    ["Write vectors by their components and let a repeated index mean a sum.", R`\mathbf a\cdot\mathbf b = a_ib_i \equiv \sum_{i=1}^3a_ib_i, \qquad \delta_{ii} = 3`, "The Einstein summation convention. An index that appears twice is summed; one that appears once is free and must match on both sides."],
    ["Rotate the axes. The components of a vector change by a rotation matrix.", R`a'_i = R_{ij}a_j, \qquad R_{ik}R_{jk} = \delta_{ij}`, "R is orthogonal: its rows are orthonormal, which is what keeps lengths unchanged."],
    ["A scalar product is unchanged.", R`a'_ib'_i = R_{ij}R_{ik}\,a_jb_k = \delta_{jk}\,a_jb_k = a_jb_j`, "This is what makes it a scalar: every observer gets the same number."],
    ["A linear relation between two vectors must hold in every frame.", R`b_i = T_{ij}a_j \;\Longrightarrow\; b'_i = R_{ik}b_k = R_{ik}T_{kl}\,a_l = R_{ik}T_{kl}R_{jl}\,a'_j`, "The last step uses the inverse rotation to express the old components of a by the new ones."],
    ["So the coefficients must transform with one rotation matrix for each index.", R`T'_{ij} = R_{ik}R_{jl}T_{kl}`, "This is the definition of a second-rank tensor. Conductivity, stress and the moment of inertia are examples."],
    ["Example: the angular momentum of a rigid body, the sum of m r × (ω × r).", R`L_i = I_{ij}\omega_j, \qquad I_{ij} = \sum m\left(r^2\delta_{ij} - x_ix_j\right)`, "Expand the triple product: r × (ω × r) = r²ω − (r·ω)r. L need not be parallel to ω."]
  ], R`a'_i = R_{ij}a_j, \qquad T'_{ij} = R_{ik}R_{jl}T_{kl}, \qquad a_ib_i \ \text{invariant}`, [
    "Cartesian tensors under rotations only. For general coordinates or for spacetime, upper and lower indices must be distinguished, and a metric g_{μν} raises and lowers them.",
    "Contracting two indices (the trace T_{ii}) gives an invariant; a symmetric tensor can always be made diagonal by rotating to its principal axes."
  ]);

  d('m-green', [
    ["For a linear differential operator L, define the Green’s function as the response to a point source.", R`L\,G(x, \xi) = \delta(x - \xi)`, "With the same boundary conditions as the problem to be solved."],
    ["Any source is a sum of point sources.", R`f(x) = \int f(\xi)\,\delta(x - \xi)\,d\xi`, "The sifting property of the delta function."],
    ["By linearity the response is the same sum of point responses.", R`y(x) = \int G(x, \xi)\,f(\xi)\,d\xi \;\Longrightarrow\; Ly = \int\delta(x - \xi)f(\xi)\,d\xi = f(x)`, "L acts on x only, so it passes inside the integral."],
    ["Example: an undamped oscillator at rest, kicked at t = 0.", R`m\ddot G + m\omega^2G = \delta(t): \qquad G = 0 \ \ (t < 0), \qquad G = A\sin\omega t \ \ (t > 0)`, "For t > 0 there is no force, so G solves the free equation; and it is continuous at t = 0."],
    ["Integrate the equation across t = 0 to find the jump in velocity.", R`m\left[\dot G\right]_{0^-}^{0^+} = 1 \;\Longrightarrow\; A = \frac{1}{m\omega} \;\Longrightarrow\; G(t) = \frac{\theta(t)\sin\omega t}{m\omega}`, "A unit impulse gives unit momentum. The step function θ(t) expresses causality: no response before the kick."],
    ["In three dimensions, for Poisson’s equation:", R`\nabla^2G = -\delta^3(\mathbf r - \mathbf r') \;\Longrightarrow\; G = \frac{1}{4\pi|\mathbf r - \mathbf r'|}, \qquad \varphi(\mathbf r) = \int\frac{\rho(\mathbf r')}{4\pi\varepsilon_0|\mathbf r - \mathbf r'|}\,d^3r'`, "The potential of a point charge, superposed over the charge distribution."]
  ], R`LG = \delta, \qquad y(x) = \int G(x, \xi)f(\xi)\,d\xi, \qquad G(t) = \frac{\theta(t)\sin\omega t}{m\omega}`, [
    "Linear equations only: superposition is the whole idea.",
    "The Green’s function depends on the boundary conditions as well as on the operator. In quantum field theory it becomes the propagator."
  ]);

  d('m-conformal', [
    ["An analytic function maps a small displacement dz to dw.", R`dw = f'(z)\,dz`, "The derivative is the same in every direction."],
    ["Write the derivative in polar form.", R`f'(z) = |f'|\,e^{i\alpha} \;\Longrightarrow\; |dw| = |f'|\,|dz|, \qquad \arg dw = \arg dz + \alpha`, "Every small displacement at z is scaled by the same factor and turned through the same angle."],
    ["So the angle between any two curves through z is preserved.", R`\arg dw_1 - \arg dw_2 = \arg dz_1 - \arg dz_2`, "Both are turned by α. The map is conformal wherever f′(z) ≠ 0."],
    ["If φ satisfies Laplace’s equation in the w-plane, it does so in the z-plane too.", R`\nabla_z^2\varphi = |f'(z)|^2\,\nabla_w^2\varphi`, "From the chain rule and the Cauchy–Riemann equations. So an awkward boundary can be mapped to an easy one, the problem solved there, and the answer carried back."],
    ["Example: w = z² opens a right-angled corner into a half-plane.", R`w = z^2: \quad \arg w = 2\arg z; \qquad \varphi = \operatorname{Im}w = 2xy`, "The uniform field of the half-plane becomes the field inside a corner, with hyperbolas as field lines. Angles are doubled at z = 0, where f′ = 0."],
    ["Möbius maps send circles and lines to circles and lines.", R`w = \frac{az + b}{cz + d}, \qquad ad - bc \ne 0`, "They are built from translations, rotations, scalings and the inversion 1/z, each of which has this property."]
  ], R`dw = f'(z)\,dz \ \Rightarrow \ \text{angles preserved where } f' \ne 0; \qquad \nabla_z^2\varphi = |f'|^2\,\nabla_w^2\varphi`, [
    "Two dimensions only: in three dimensions the conformal maps are far more restricted.",
    "The Joukowski map w = z + 1/z turns a circle into an aerofoil shape and gave the first theory of lift."
  ]);

  d('m-branch-cuts', [
    ["The logarithm undoes the exponential, but the exponential does not notice whole turns.", R`z = re^{i\theta} = re^{i(\theta + 2\pi k)} \;\Longrightarrow\; \log z = \ln r + i(\theta + 2\pi k)`, "Infinitely many values, differing by 2πi."],
    ["Follow log z continuously once round the origin.", R`\log z \to \log z + 2\pi i`, "The argument has increased by 2π, so the function does not return to its starting value. The origin is a branch point."],
    ["Powers inherit this.", R`z^a = e^{a\log z} \to e^{2\pi ia}z^a`, "Single-valued only if a is a whole number; the square root changes sign after one circuit."],
    ["To get a single-valued function, forbid circuits round the branch point by cutting the plane.", R`-\pi < \arg z \le \pi \quad \text{(cut along the negative real axis)}`, "The principal branch. The function is discontinuous across the cut, by 2πi for the logarithm."],
    ["The discontinuity can be used. Integrate z^{a−1}/(1 + z) round a keyhole contour that hugs the positive real axis, with 0 < a < 1.", R`\left(1 - e^{2\pi i(a - 1)}\right)\int_0^\infty\frac{x^{a-1}}{1 + x}\,dx = 2\pi i\operatorname{Res}_{z = -1} = 2\pi i\,e^{i\pi(a - 1)}`, "Above the cut the integrand is x^{a−1}/(1 + x); below it there is an extra factor e^{2πi(a−1)}. The two circles contribute nothing, and the only pole is at z = −1 = e^{iπ}."],
    ["Solve for the integral.", R`\int_0^\infty\frac{x^{a-1}}{1 + x}\,dx = \frac{2\pi i\,e^{i\pi(a - 1)}}{1 - e^{2\pi i(a - 1)}} = \frac{\pi}{\sin\pi a}`, "Divide top and bottom by e^{iπ(a−1)} and use the exponential form of the sine."]
  ], R`\log z = \ln|z| + i(\arg z + 2\pi k), \qquad \int_0^\infty\frac{x^{a-1}}{1 + x}\,dx = \frac{\pi}{\sin\pi a} \quad (0 < a < 1)`, [
    "Where the cut is placed is a choice; the values just above and just below it are not.",
    "Analytic continuation extends a function beyond where its defining formula converges: Γ(z + 1) = zΓ(z) carries the factorial to the whole plane except 0, −1, −2, …"
  ]);

  d('m-integral-equations', [
    ["An initial-value problem is equivalent to an integral equation.", R`y' = F(x, y),\ y(0) = y_0 \iff y(x) = y_0 + \int_0^xF(t, y(t))\,dt`, "Integrate both sides. The initial condition is built in. The upper limit is variable: a Volterra equation."],
    ["Solve it by iteration, feeding each approximation back into the integral.", R`y_{n+1}(x) = y_0 + \int_0^xF(t, y_n(t))\,dt`, "Picard’s method, which also proves that a solution exists and is unique."],
    ["Example: y′ = y with y(0) = 1.", R`y_0 = 1, \quad y_1 = 1 + x, \quad y_2 = 1 + x + \frac{x^2}{2}, \ \dots \ \to \ e^x`, "Each iteration adds the next term of the exponential series."],
    ["A Fredholm equation of the second kind has fixed limits.", R`y(x) = f(x) + \lambda\int_a^bK(x, t)\,y(t)\,dt \quad\text{or}\quad y = f + \lambda Ky`, "K is the kernel. With K regarded as an operator this looks like a matrix equation."],
    ["Iterate in the same way.", R`y = f + \lambda Kf + \lambda^2K^2f + \dots = \sum_{n=0}^\infty\lambda^nK^nf = (1 - \lambda K)^{-1}f`, "The Neumann series: a geometric series for an operator. It converges when λ times the size of K is less than 1."],
    ["For a separable kernel the equation reduces to algebra.", R`K = u(x)v(t): \quad y = f + \lambda c\,u(x), \quad c = \int_a^bv\,y\,dt \;\Longrightarrow\; c = \frac{\int vf\,dt}{1 - \lambda\int uv\,dt}`, "The unknown function enters only through the number c. Substitute the form of y into the definition of c."]
  ], R`y = f + \lambda Ky \;\Longrightarrow\; y = \sum_{n=0}^\infty\lambda^nK^nf`, [
    "The Neumann series can diverge. When the denominator 1 − λ∫uv dt vanishes, the homogeneous equation has a solution (an eigenvalue) and the inhomogeneous one generally has none.",
    "In quantum scattering the same series is the Born series."
  ]);

  d('m-perturbation-methods', [
    ["Regular perturbation: solve x² + εx − 1 = 0 for small ε by a power series.", R`x = x_0 + \varepsilon x_1 + \varepsilon^2x_2 + \dots: \qquad x_0^2 = 1, \quad 2x_0x_1 + x_0 = 0, \quad 2x_0x_2 + x_1^2 + x_1 = 0`, "Substitute and collect each power of ε."],
    ["The root near +1:", R`x \approx 1 - \frac\varepsilon2 + \frac{\varepsilon^2}{8}`, "x₀ = 1, x₁ = −½, x₂ = ⅛, in agreement with the expansion of the exact root."],
    ["Singular perturbation: εx² + x − 1 = 0. Setting ε = 0 loses a root.", R`\varepsilon = 0: \ x = 1 \ \text{only}; \qquad \text{exact: } x = \frac{-1 \pm\sqrt{1 + 4\varepsilon}}{2\varepsilon}`, "The small parameter multiplies the highest power, so the unperturbed problem has a lower degree."],
    ["The missing root is large. Rescale to find it.", R`x = \frac X\varepsilon: \quad X^2 + X - \varepsilon = 0 \;\Longrightarrow\; X \approx -1 - \varepsilon + \varepsilon^2 \;\Longrightarrow\; x \approx -\frac1\varepsilon - 1 + \varepsilon`, "In the rescaled variable the problem is regular."],
    ["The same happens in differential equations: εy″ + y′ + y = 0 has a thin boundary layer.", R`y \sim e^{-x/\varepsilon} \ \ \text{inside a layer of thickness } \delta \sim \varepsilon`, "Where the solution changes rapidly, εy″ is not small. Solve separately inside and outside the layer and match the two."],
    ["Secular terms: for the oscillator ẍ + x + εx³ = 0 a naive expansion gives a term growing like t. Let the amplitude and phase vary slowly instead.", R`x \approx A\cos\omega t, \qquad \omega = 1 + \tfrac38\varepsilon A^2`, "The method of multiple scales removes the resonant term by shifting the frequency. A stiffening spring oscillates faster at larger amplitude."]
  ], R`x \approx 1 - \frac\varepsilon2 + \frac{\varepsilon^2}{8}; \qquad x \approx -\frac1\varepsilon - 1 + \varepsilon; \qquad \omega = 1 + \tfrac38\varepsilon A^2`, [
    "Such series are usually asymptotic, not convergent: accurate for small ε with a few terms, and worse if too many are kept.",
    "Matching needs a region in which both the inner and the outer approximations hold."
  ]);

  d('m-wkb', [
    ["Write the wavefunction as a rapidly varying phase.", R`-\frac{\hbar^2}{2m}\psi'' + V\psi = E\psi, \qquad \psi = e^{iS(x)/\hbar}`, "For a constant potential S = ±px exactly; the idea is that a slowly varying potential changes this only gradually."],
    ["Substitute.", R`(S')^2 - i\hbar S'' = p^2(x), \qquad p(x) = \sqrt{2m(E - V(x))}`, "p(x) is the classical momentum at x."],
    ["Expand S in powers of ħ.", R`S = S_0 + \hbar S_1 + \dots: \qquad (S_0')^2 = p^2, \qquad 2S_0'S_1' = iS_0''`, "Collect the terms of order ħ⁰ and ħ¹."],
    ["Solve the two equations.", R`S_0 = \pm\int p\,dx, \quad S_1 = \frac i2\ln p \;\Longrightarrow\; \psi \approx \frac{C}{\sqrt{p(x)}}\exp\!\left(\pm\frac i\hbar\int p\,dx\right)`, "The phase accumulates at the local rate p/ħ. The amplitude 1/√p makes the probability density inversely proportional to the speed, as for a classical particle."],
    ["The approximation needs the wavelength to change little in one wavelength. It fails at a turning point; matching through it fixes the phase, and in a well with two turning points:", R`\left|\frac{d\lambda}{dx}\right| \ll 1; \qquad \int_{x_1}^{x_2}p\,dx = \left(n - \tfrac12\right)\pi\hbar, \quad n = 1, 2, 3, \dots`, "The Bohr–Sommerfeld rule with the correct ½, which comes from a phase loss of π/4 at each turning point. For the harmonic oscillator it gives the exact energies."],
    ["Under a barrier p is imaginary and the wave decays instead of oscillating.", R`T \approx \exp\!\left(-2\int_{x_1}^{x_2}\kappa\,dx\right), \qquad \kappa = \frac{\sqrt{2m(V - E)}}{\hbar}`, "The tunnelling probability. It explains the enormous range of alpha-decay lifetimes."]
  ], R`\psi \approx \frac{C}{\sqrt p}\,e^{\pm\frac i\hbar\int p\,dx}, \qquad \int_{x_1}^{x_2}p\,dx = \left(n - \tfrac12\right)\pi\hbar, \qquad T \approx e^{-2\int\kappa\,dx}`, [
    "Semi-classical: accurate for high quantum numbers and smooth potentials. Hard walls change the ½: for an infinite well the condition is that the integral equals nπħ.",
    "The same mathematics gives the stationary-phase and steepest-descent estimates of integrals: the main contribution comes from where the phase is stationary."
  ]);

  d('m-finite-difference', [
    ["Expand f at the neighbouring grid points.", R`f(x \pm h) = f \pm hf' + \tfrac12h^2f'' \pm \tfrac16h^3f''' + \tfrac{1}{24}h^4f'''' + \dots`, "Taylor series about x."],
    ["Subtract to get the first derivative.", R`\frac{f(x + h) - f(x - h)}{2h} = f' + \frac{h^2}{6}f''' + \dots`, "The even terms cancel, so the central difference is accurate to second order; a one-sided difference is only first order."],
    ["Add to get the second derivative.", R`\frac{f(x + h) - 2f(x) + f(x - h)}{h^2} = f'' + \frac{h^2}{12}f'''' + \dots`, "The odd terms cancel."],
    ["Apply these to the diffusion equation u_t = αu_{xx}, stepping forward in time.", R`u_j^{n+1} = u_j^n + r\left(u_{j+1}^n - 2u_j^n + u_{j-1}^n\right), \qquad r = \frac{\alpha\,\Delta t}{\Delta x^2}`, "j labels the grid points in space and n the steps in time. An explicit scheme: each new value follows directly from old ones."],
    ["Test stability with a single Fourier mode, of amplitude gⁿ after n steps.", R`u_j^n = g^ne^{ikj\Delta x} \;\Longrightarrow\; g = 1 - 4r\sin^2\frac{k\,\Delta x}{2}`, "Von Neumann analysis. g is the factor by which the mode is multiplied at each step."],
    ["No mode may grow.", R`|g| \le 1 \ \text{for all } k \iff r \le \tfrac12 \iff \Delta t \le \frac{\Delta x^2}{2\alpha}`, "The worst case is the sawtooth mode, for which sin² = 1. Halving the grid spacing forces the time step down by a factor of four. For the wave equation the corresponding (CFL) condition is cΔt/Δx ≤ 1."]
  ], R`f' \approx \frac{f(x + h) - f(x - h)}{2h}, \qquad f'' \approx \frac{f(x + h) - 2f(x) + f(x - h)}{h^2}, \qquad r = \frac{\alpha\,\Delta t}{\Delta x^2} \le \tfrac12`, [
    "Implicit schemes (backward Euler, Crank–Nicolson) are stable for any time step but need a system of equations solved at every step.",
    "Stability does not guarantee accuracy; and for smooth periodic problems spectral methods converge far faster than any difference of fixed order."
  ]);

  d('m-monte-carlo', [
    ["Estimate an integral as an average over random points.", R`I = \int_a^bf(x)\,dx = (b - a)\,\langle f\rangle \approx \frac{b - a}{N}\sum_{i=1}^Nf(x_i)`, "The points are drawn uniformly from the interval; the sample mean estimates the true mean."],
    ["The estimate is a mean of N independent values, so its uncertainty follows from the central limit theorem.", R`\sigma_{\bar f} = \frac{\sigma_f}{\sqrt N}`, "The error falls as 1/√N whatever the number of dimensions. A grid of N points in d dimensions has spacing N^{−1/d}, which is why Monte Carlo wins in many dimensions."],
    ["Reduce the variance by sampling where the integrand is large. Draw x from a density p(x) and weight accordingly.", R`\int f\,dx = \int\frac{f(x)}{p(x)}\,p(x)\,dx = \left\langle\frac fp\right\rangle_p`, "Importance sampling. If p is nearly proportional to f, the ratio f/p is nearly constant and its variance is small."],
    ["To sample a complicated distribution π, build a random walk whose long-run distribution is π. It is enough that each pair of states is in balance.", R`\pi_iP_{ij} = \pi_jP_{ji}`, "Detailed balance: as much probability flows from i to j as from j to i, so π does not change."],
    ["The Metropolis rule: propose a move symmetrically and accept it with probability:", R`A_{ij} = \min\!\left(1, \frac{\pi_j}{\pi_i}\right) = \min\!\left(1, e^{-\Delta E/k_BT}\right)`, "The second form is for the Boltzmann distribution. Only the ratio is needed, so the partition function never has to be computed."],
    ["Check that this satisfies detailed balance. Suppose π_j < π_i.", R`\pi_iP_{ij} = \pi_i\,q\,\frac{\pi_j}{\pi_i} = \pi_j\,q = \pi_jP_{ji}`, "q is the symmetric proposal probability; the move towards lower probability is accepted with the ratio, and the reverse move always."]
  ], R`\sigma_{\bar f} = \frac{\sigma_f}{\sqrt N}, \qquad \int f\,dx = \left\langle\frac fp\right\rangle_p, \qquad A = \min\!\left(1, e^{-\Delta E/k_BT}\right)`, [
    "Successive samples from a Markov chain are correlated: the effective number of independent samples is smaller than N, and the start of the chain must be thrown away.",
    "1/√N is slow: ten times the accuracy costs a hundred times the work.",
    "A badly chosen p, too narrow so that f/p has a huge variance, is the classic failure of importance sampling."
  ]);

  d('m-nonlinear', [
    ["A fixed point x* of the flow ẋ = f(x) is stable if small displacements decay.", R`\dot\xi \approx f'(x^*)\,\xi \;\Longrightarrow\; \text{stable} \iff f'(x^*) < 0`, "Linearise about x*. For a map x → g(x) the corresponding condition is |g′(x*)| < 1."],
    ["Saddle-node bifurcation: fixed points are created in pairs.", R`\dot x = \mu + x^2: \qquad x^* = \pm\sqrt{-\mu} \ \ (\mu < 0), \qquad \text{none for } \mu > 0`, "f′ = 2x*, so the negative one is stable and the positive one unstable. At μ = 0 they merge and disappear."],
    ["Pitchfork bifurcation: a symmetric state loses stability to a pair of new ones.", R`\dot x = \mu x - x^3: \qquad x^* = 0 \ \ (\text{stable for } \mu < 0), \qquad x^* = \pm\sqrt\mu \ \ (\mu > 0,\ \text{stable})`, "f′(0) = μ and f′(±√μ) = −2μ. The system must choose one branch: spontaneous symmetry breaking, as in Landau’s theory of phase transitions."],
    ["In two dimensions a fixed point can lose stability to an oscillation. In polar coordinates:", R`\dot r = \mu r - r^3, \quad \dot\theta = \omega \;\Longrightarrow\; \text{limit cycle of radius } r = \sqrt\mu \ \ \text{for } \mu > 0`, "A Hopf bifurcation. Trajectories from inside and outside both approach the cycle, so its amplitude does not depend on the starting point."],
    ["A Poincaré section turns a flow into a map by recording each return to a chosen surface.", R`x_{n+1} = P(x_n); \qquad \text{periodic orbit} \iff \text{fixed point of } P`, "The stability of the orbit is the stability of that fixed point of the map."],
    ["Maps can do what one-dimensional flows cannot. In the logistic map the fixed point becomes unstable through −1.", R`x_{n+1} = rx_n(1 - x_n): \qquad g'(x^*) = 2 - r = -1 \ \ \text{at } r = 3`, "A period-doubling bifurcation, the first of an infinite cascade that leads to chaos at r ≈ 3.57."]
  ], R`\text{stable} \iff f'(x^*) < 0 \ \ (\text{flow}), \quad |g'(x^*)| < 1 \ \ (\text{map}); \qquad \dot x = \mu + x^2, \quad \dot x = \mu x - x^3`, [
    "These normal forms describe what happens close to the bifurcation; far from it, higher-order terms matter.",
    "A strange attractor needs at least three dimensions for a flow; in the plane the only long-term behaviours are fixed points and closed orbits (Poincaré–Bendixson)."
  ]);

  /* ---------- special functions ---------- */
  d('m-special', [
    ["Many equations of physics can be put in Sturm–Liouville form.", R`\frac{d}{dx}\left[p(x)\frac{dy}{dx}\right] + q(x)\,y + \lambda\,w(x)\,y = 0`, "p, q and the weight w are given real functions and λ is the eigenvalue. Any equation ay″ + by′ + cy = 0 can be brought to this form by multiplying by (1/a)exp∫(b/a)dx."],
    ["Take two eigenfunctions y_m and y_n. Multiply the equation for y_n by y_m and the equation for y_m by y_n, and subtract.", R`y_m(py_n')' - y_n(py_m')' = (\lambda_m - \lambda_n)\,w\,y_my_n`, "The q terms cancel."],
    ["The left side is a total derivative.", R`\frac{d}{dx}\left[p\left(y_my_n' - y_ny_m'\right)\right] = (\lambda_m - \lambda_n)\,w\,y_my_n`, "Expand the derivative: the terms containing both first derivatives cancel."],
    ["Integrate over the interval. With suitable boundary conditions the boundary term vanishes.", R`(\lambda_m - \lambda_n)\int_a^bw\,y_my_n\,dx = \left[p\left(y_my_n' - y_ny_m'\right)\right]_a^b = 0`, "For example y = 0 at both ends, or p = 0 there, or periodic conditions."],
    ["So eigenfunctions with different eigenvalues are orthogonal with weight w.", R`\int_a^bw(x)\,y_m(x)\,y_n(x)\,dx = 0 \qquad (\lambda_m \ne \lambda_n)`, "The same argument applied to an eigenfunction and its complex conjugate shows that the eigenvalues are real."],
    ["Any reasonable function can therefore be expanded in them.", R`f(x) = \sum_nc_ny_n(x), \qquad c_n = \frac{\int fy_nw\,dx}{\int y_n^2w\,dx}`, "Multiply by w times one eigenfunction and integrate; orthogonality isolates one coefficient. Fourier series are the case p = w = 1, q = 0."]
  ], R`(py')' + qy + \lambda wy = 0 \;\Longrightarrow\; \int_a^bw\,y_my_n\,dx = 0 \ \ (m \ne n), \qquad c_n = \frac{\int fy_nw\,dx}{\int y_n^2w\,dx}`, [
    "The boundary conditions are part of the problem: without them the operator is not self-adjoint and none of this holds.",
    "Legendre (p = 1 − x², w = 1), Bessel (p = x, w = x) and Hermite (p = w = e^{−x²}) are all cases. Completeness is a theorem that needs more work than orthogonality."
  ]);

  d('m-frobenius', [
    ["Near a regular singular point at x = 0, try a power series with an unknown leading power.", R`x^2y'' + x\,p(x)\,y' + q(x)\,y = 0, \qquad y = \sum_{n=0}^\infty a_nx^{n+r}, \quad a_0 \ne 0`, "p and q are ordinary power series. A plain Taylor series (r = 0) is not general enough when the coefficient of y″ vanishes at x = 0."],
    ["Substitute and collect the lowest power, x^r.", R`r(r - 1) + p_0r + q_0 = 0`, "The indicial equation; p₀ and q₀ are the values of p and q at 0. Its two roots give the behaviour of the two solutions near the singular point."],
    ["Example: Bessel’s equation of order zero.", R`x^2y'' + xy' + x^2y = 0: \qquad r^2 = 0 \;\Longrightarrow\; r = 0`, "Here p₀ = 1 and q₀ = 0."],
    ["The higher powers give a recurrence relation.", R`n^2a_n + a_{n-2} = 0 \;\Longrightarrow\; a_n = -\frac{a_{n-2}}{n^2}`, "The coefficient of xⁿ: n(n − 1) + n from the first two terms, and the coefficient two places back from the last."],
    ["Solve it.", R`a_{2k} = \frac{(-1)^k}{2^{2k}(k!)^2}\,a_0 \;\Longrightarrow\; J_0(x) = \sum_{k=0}^\infty\frac{(-1)^k}{(k!)^2}\left(\frac x2\right)^{2k}`, "Only even powers appear. This series converges for all x."],
    ["A series may terminate. For Legendre’s equation (1 − x²)y″ − 2xy′ + l(l + 1)y = 0:", R`a_{n+2} = \frac{n(n + 1) - l(l + 1)}{(n + 2)(n + 1)}\,a_n`, "If l is a whole number the numerator vanishes at n = l and the series stops: a polynomial. Otherwise the series diverges at x = ±1. The quantisation of angular momentum arises in exactly this way."]
  ], R`y = \sum a_nx^{n+r}, \qquad r(r - 1) + p_0r + q_0 = 0, \qquad J_0(x) = \sum_k\frac{(-1)^k}{(k!)^2}\left(\frac x2\right)^{2k}`, [
    "If the two roots of the indicial equation are equal or differ by a whole number, the second solution generally contains a logarithm.",
    "At an irregular singular point (such as infinity for Bessel’s equation) no such series exists and asymptotic methods are needed."
  ]);

  d('m-hypergeometric', [
    ["Consider a power series in which the ratio of successive coefficients is a rational function of n.", R`y = \sum_{n=0}^\infty c_nx^n, \qquad \frac{c_{n+1}}{c_n} = \frac{(a + n)(b + n)}{(c + n)(1 + n)}`, "Most series met in physics are of this kind. The factor (1 + n) is conventional: it produces the n! of the exponential series."],
    ["Write the product of ratios with the rising factorial.", R`(a)_n = a(a + 1)\cdots(a + n - 1) = \frac{\Gamma(a + n)}{\Gamma(a)}`, "The Pochhammer symbol; (1)_n = n!."],
    ["The series is then:", R`{}_2F_1(a, b; c; x) = \sum_{n=0}^\infty\frac{(a)_n(b)_n}{(c)_n}\frac{x^n}{n!}`, "Two parameters above, one below. By the ratio test it converges for |x| < 1."],
    ["Turn the recurrence into a differential equation. With θ = x d/dx, θxⁿ = nxⁿ.", R`(c + n)(1 + n)\,c_{n+1} = (a + n)(b + n)\,c_n \;\Longrightarrow\; \theta(\theta + c - 1)\,y = x(\theta + a)(\theta + b)\,y`, "Each factor containing n becomes the operator θ acting on the series."],
    ["Expand the operators.", R`x(1 - x)y'' + \left[c - (a + b + 1)x\right]y' - ab\,y = 0`, "The hypergeometric equation, with regular singular points at 0, 1 and ∞. Any second-order equation with three regular singular points can be transformed into it."],
    ["Familiar functions are special cases.", R`{}_2F_1(1, 1; 2; x) = -\frac{\ln(1 - x)}{x}, \qquad {}_2F_1(-n, b; b; x) = (1 - x)^n, \qquad P_l(x) = {}_2F_1\!\left(-l, l + 1; 1; \tfrac{1 - x}{2}\right)`, "If a or b is a negative whole number the series terminates and gives a polynomial."]
  ], R`{}_2F_1(a, b; c; x) = \sum_n\frac{(a)_n(b)_n}{(c)_n\,n!}x^n, \qquad x(1 - x)y'' + [c - (a + b + 1)x]y' - aby = 0`, [
    "The series needs c not to be zero or a negative whole number, and converges only for |x| < 1; elsewhere the function is defined by analytic continuation.",
    "At x = 1 its value is Γ(c)Γ(c − a − b)/Γ(c − a)Γ(c − b), provided c − a − b > 0 (Gauss)."
  ]);

  d('m-jacobi', [
    ["The elliptic integral of the first kind cannot be done in elementary terms.", R`u = \int_0^\phi\frac{d\theta}{\sqrt{1 - k^2\sin^2\theta}}`, "k is the modulus, 0 ≤ k < 1. For k = 0 it is simply u = φ."],
    ["Define new functions by inverting it.", R`\operatorname{sn}u = \sin\phi, \qquad \operatorname{cn}u = \cos\phi, \qquad \operatorname{dn}u = \sqrt{1 - k^2\sin^2\phi}`, "Exactly as sine is defined by inverting the arcsine integral. φ is called the amplitude of u."],
    ["Two identities follow at once.", R`\operatorname{sn}^2u + \operatorname{cn}^2u = 1, \qquad \operatorname{dn}^2u + k^2\operatorname{sn}^2u = 1`, "From sin² + cos² = 1 and the definition of dn."],
    ["Differentiate, taking dφ/du from the integral.", R`\frac{d\phi}{du} = \sqrt{1 - k^2\sin^2\phi} = \operatorname{dn}u \;\Longrightarrow\; \frac{d}{du}\operatorname{sn}u = \cos\phi\,\frac{d\phi}{du} = \operatorname{cn}u\,\operatorname{dn}u`, "The fundamental theorem of calculus, then the chain rule."],
    ["A quarter period is the complete integral.", R`K(k) = \int_0^{\pi/2}\frac{d\theta}{\sqrt{1 - k^2\sin^2\theta}}, \qquad \operatorname{sn}(u + 4K) = \operatorname{sn}u`, "φ increases by 2π when u increases by 4K. K(0) = π/2 and K → ∞ as k → 1."],
    ["The pendulum, θ̈ = −ω₀² sin θ with amplitude θ₀: energy conservation and the substitution sin(θ/2) = k sin φ, with k = sin(θ₀/2), give:", R`\sin\frac\theta2 = k\operatorname{sn}(\omega_0t), \qquad T = \frac{4K(k)}{\omega_0} = \frac{2\pi}{\omega_0}\left(1 + \tfrac14k^2 + \tfrac{9}{64}k^4 + \dots\right)`, "An exact solution. The period grows with amplitude and becomes infinite as θ₀ → π."]
  ], R`\operatorname{sn}^2u + \operatorname{cn}^2u = 1, \qquad \frac{d}{du}\operatorname{sn}u = \operatorname{cn}u\operatorname{dn}u, \qquad T = \frac{4K(k)}{\omega_0}`, [
    "For k = 0 the functions reduce to sin and cos; for k = 1, sn u = tanh u and the period is infinite.",
    "They are also periodic in the imaginary direction (doubly periodic), which is what distinguishes elliptic functions from trigonometric ones."
  ]);

  d('m-zeta', [
    ["Define the zeta function by a sum over the positive whole numbers.", R`\zeta(s) = \sum_{n=1}^\infty\frac{1}{n^s} \qquad (s > 1)`, "It converges for s > 1, by comparison with an integral."],
    ["Bose integrals reduce to it. Expand the denominator as a geometric series.", R`\frac{1}{e^x - 1} = \frac{e^{-x}}{1 - e^{-x}} = \sum_{n=1}^\infty e^{-nx}`, "Valid for x > 0."],
    ["Integrate term by term.", R`\int_0^\infty\frac{x^{s-1}}{e^x - 1}\,dx = \sum_{n=1}^\infty\int_0^\infty x^{s-1}e^{-nx}\,dx = \sum_{n=1}^\infty\frac{\Gamma(s)}{n^s} = \Gamma(s)\,\zeta(s)`, "Substitute y = nx in each term; what is left is the definition of the gamma function."],
    ["The case s = 4 is the black-body integral.", R`\int_0^\infty\frac{x^3}{e^x - 1}\,dx = \Gamma(4)\,\zeta(4) = 6\cdot\frac{\pi^4}{90} = \frac{\pi^4}{15}`, "This number sets the Stefan–Boltzmann constant. ζ(3) = 1.202 gives the number of photons, and ζ(3/2) = 2.612 the onset of Bose–Einstein condensation."],
    ["For fermions the series alternates.", R`\int_0^\infty\frac{x^{s-1}}{e^x + 1}\,dx = \Gamma(s)\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n^s} = \left(1 - 2^{1-s}\right)\Gamma(s)\,\zeta(s)`, "The alternating sum is the full sum minus twice the even terms, and the even terms add up to 2^{−s}ζ(s)."],
    ["ζ(2) from the Fourier series of x² on (−π, π), evaluated at x = π.", R`x^2 = \frac{\pi^2}{3} + 4\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx \;\Longrightarrow\; \pi^2 = \frac{\pi^2}{3} + 4\,\zeta(2) \;\Longrightarrow\; \zeta(2) = \frac{\pi^2}{6}`, "cos nπ = (−1)ⁿ makes every term positive. ζ(4) = π⁴/90 follows from Parseval’s theorem for the same series."]
  ], R`\int_0^\infty\frac{x^{s-1}}{e^x - 1}dx = \Gamma(s)\zeta(s), \qquad \int_0^\infty\frac{x^{s-1}}{e^x + 1}dx = \left(1 - 2^{1-s}\right)\Gamma(s)\zeta(s), \qquad \zeta(2) = \frac{\pi^2}{6}`, [
    "The sum defines ζ only for s > 1. Elsewhere it is defined by analytic continuation, which is the sense in which ζ(−1) = −1/12 (used in Casimir-energy calculations); the series 1 + 2 + 3 + … itself still diverges.",
    "Exchanging the sum and the integral is justified here because every term is positive."
  ]);

  d('m-bessel-modified', [
    ["Bessel’s equation of order ν:", R`x^2y'' + xy' + (x^2 - \nu^2)\,y = 0`, "It arises when Laplace’s equation or the wave equation is separated in cylindrical coordinates; its solutions J_ν and Y_ν oscillate."],
    ["Replace x by ix.", R`x^2y'' + xy' - (x^2 + \nu^2)\,y = 0`, "x²y″ and xy′ are unchanged by the scaling; only x² changes sign. This is the modified Bessel equation, which appears in diffusion and for static, screened fields."],
    ["So J_ν(ix) solves it. Define a real solution.", R`I_\nu(x) = i^{-\nu}J_\nu(ix) = \sum_{k=0}^\infty\frac{1}{k!\,\Gamma(k + \nu + 1)}\left(\frac x2\right)^{2k+\nu}`, "The alternating signs of the series for J_ν disappear: I_ν grows steadily instead of oscillating."],
    ["A second solution, chosen to decay at infinity:", R`K_\nu(x) = \frac\pi2\cdot\frac{I_{-\nu}(x) - I_\nu(x)}{\sin\nu\pi}`, "For whole-number ν this is taken as a limit."],
    ["For large x, remove the first-derivative term by writing y = u/√x.", R`u'' - \left(1 + \frac{\nu^2 - \tfrac14}{x^2}\right)u = 0 \;\Longrightarrow\; u \approx e^{\pm x}`, "The substitution is exact; then the 1/x² term is dropped."],
    ["So the two solutions behave as:", R`I_\nu(x) \approx \frac{e^x}{\sqrt{2\pi x}}, \qquad K_\nu(x) \approx \sqrt{\frac{\pi}{2x}}\,e^{-x}`, "One grows and one decays. Which is allowed depends on the region: K outside a source, I inside. The same steps for the ordinary equation give outgoing and incoming waves, the Hankel functions, behaving as √(2/πx) e^{±i(x − νπ/2 − π/4)}."]
  ], R`I_\nu(x) = i^{-\nu}J_\nu(ix), \qquad I_\nu \approx \frac{e^x}{\sqrt{2\pi x}}, \qquad K_\nu \approx \sqrt{\frac{\pi}{2x}}\,e^{-x}`, [
    "The asymptotic forms need x much larger than ν²; near the origin I_ν ∝ x^ν, while K_ν diverges (logarithmically for ν = 0).",
    "K₀(r/λ) is the screened potential of a line source in two dimensions, the analogue of the Yukawa potential."
  ]);

  d('m-spherical-bessel', [
    ["Separate the wave equation (∇² + k²)ψ = 0 in spherical coordinates. The radial part, with x = kr, is:", R`x^2R'' + 2xR' + \left[x^2 - l(l + 1)\right]R = 0`, "The angular part gives spherical harmonics and the constant l(l + 1)."],
    ["For l = 0 put R = u/x.", R`u'' + u = 0 \;\Longrightarrow\; j_0(x) = \frac{\sin x}{x}, \qquad y_0(x) = -\frac{\cos x}{x}`, "The substitution removes the first-derivative term. j₀ is finite at the origin; y₀ is not."],
    ["Higher l follow by repeated differentiation.", R`j_l(x) = (-x)^l\left(\frac1x\frac{d}{dx}\right)^l\frac{\sin x}{x}`, "Rayleigh’s formula. So every j_l is built from sin x, cos x and powers of 1/x."],
    ["Limiting forms.", R`j_l(x) \approx \frac{x^l}{(2l + 1)!!} \ \ (x \ll 1), \qquad j_l(x) \approx \frac{\sin(x - l\pi/2)}{x} \ \ (x \gg l)`, "Near the origin the centrifugal barrier suppresses the wave; far away each l is a spherical wave with a phase lag of lπ/2."],
    ["A plane wave is finite at the origin and symmetric about the z-axis, so it can be expanded in products of j_l and Legendre polynomials.", R`e^{ikz} = e^{ikr\cos\theta} = \sum_{l=0}^\infty(2l + 1)\,i^l\,j_l(kr)\,P_l(\cos\theta)`, "The coefficients follow from the orthogonality of the Legendre polynomials and the behaviour at large r."],
    ["A short-range potential can only change the phase of each outgoing partial wave.", R`\frac{\sin(kr - l\pi/2)}{kr} \to \frac{\sin(kr - l\pi/2 + \delta_l)}{kr} \;\Longrightarrow\; \sigma = \frac{4\pi}{k^2}\sum_l(2l + 1)\sin^2\delta_l`, "Angular momentum is conserved, so partial waves do not mix. The phase shifts δ_l contain everything about the scattering."]
  ], R`j_0 = \frac{\sin x}{x}, \qquad e^{ikz} = \sum_l(2l + 1)\,i^lj_l(kr)P_l(\cos\theta), \qquad \sigma = \frac{4\pi}{k^2}\sum_l(2l + 1)\sin^2\delta_l`, [
    "A spherically symmetric, short-range potential; the Coulomb potential is too long-ranged for this treatment.",
    "Only partial waves with l up to about ka (a being the range of the force) are affected, so low-energy scattering is pure s-wave."
  ]);

  d('m-orthopoly', [
    ["Start from the powers 1, x, x², … and a weight w(x) on an interval, and make them orthogonal by Gram–Schmidt.", R`\langle f, g\rangle = \int_a^bf(x)\,g(x)\,w(x)\,dx, \qquad \langle p_m, p_n\rangle = 0 \ \ (m \ne n)`, "Each weight gives a family: w = 1 on (−1, 1) gives Legendre, e^{−x²} Hermite, e^{−x} on (0, ∞) Laguerre, and 1/√(1 − x²) Chebyshev."],
    ["p_n is orthogonal to every polynomial of lower degree.", R`\langle p_n, q\rangle = 0 \quad \text{if } \deg q < n`, "Any such q is a combination of the earlier members of the family."],
    ["Expand x p_n in the family. Almost all the coefficients vanish.", R`\langle xp_n, p_k\rangle = \langle p_n, xp_k\rangle = 0 \quad \text{for } k < n - 1`, "x p_k has degree k + 1, which is below n. So only three members of the family can appear."],
    ["Hence a three-term recurrence.", R`x\,p_n = \alpha_n\,p_{n+1} + \beta_n\,p_n + \gamma_n\,p_{n-1}`, "Every family of orthogonal polynomials has one; it is the practical way to compute them."],
    ["Chebyshev polynomials have a closed form.", R`T_n(\cos\theta) = \cos n\theta \;\Longrightarrow\; T_{n+1}(x) = 2x\,T_n(x) - T_{n-1}(x)`, "From cos(n + 1)θ + cos(n − 1)θ = 2 cos θ cos nθ. With x = cos θ the weighted measure becomes dθ, and the orthogonality is that of cosines."],
    ["Gaussian quadrature: take the n sample points to be the zeros of p_n.", R`\int_a^bf(x)\,w(x)\,dx \approx \sum_{i=1}^nw_if(x_i), \quad p_n(x_i) = 0; \qquad \text{exact for } \deg f \le 2n - 1`, "Write f = q p_n + r with q and r of degree below n. The first part integrates to zero by orthogonality and vanishes at the sample points, and r is integrated exactly by n points."]
  ], R`x\,p_n = \alpha_np_{n+1} + \beta_np_n + \gamma_np_{n-1}, \qquad T_n(\cos\theta) = \cos n\theta`, [
    "Among polynomials of degree n with leading coefficient 1, the scaled Chebyshev polynomial 2^{1−n}T_n has the smallest maximum on [−1, 1]; interpolating at its zeros avoids the wild oscillations of equally spaced points.",
    "The moments of the weight must exist, which is why an infinite interval needs a decaying weight."
  ]);

  d('m-confluent', [
    ["In the hypergeometric series, replace x by x/b and let b → ∞.", R`{}_2F_1\!\left(a, b; c; \frac xb\right) \to \sum_{n=0}^\infty\frac{(a)_n}{(c)_n}\frac{x^n}{n!} = M(a, c, x)`, "(b)_n/bⁿ → 1. Two of the three singular points merge at infinity, hence “confluent”."],
    ["The same limit of the differential equation gives Kummer’s equation.", R`x\,y'' + (c - x)\,y' - a\,y = 0`, "x = 0 is a regular singular point; infinity is now an irregular one."],
    ["The ratio of successive terms shows how the series behaves for large x.", R`\frac{c_{n+1}}{c_n} = \frac{a + n}{(c + n)(n + 1)} \to \frac1n \;\Longrightarrow\; M(a, c, x) \sim \frac{\Gamma(c)}{\Gamma(a)}\,e^x\,x^{a-c}`, "The same ratio as for the exponential series, so M grows like e^x unless the series stops."],
    ["It stops if a is zero or a negative whole number.", R`a = -n_r \;\Longrightarrow\; M(-n_r, c, x) \ \text{is a polynomial of degree } n_r`, "The factor (a)_n vanishes beyond that point. These polynomials are the Laguerre polynomials."],
    ["The radial equation of the hydrogen atom, once the behaviour at the origin and at infinity has been taken out, is Kummer’s equation.", R`R(r) = \rho^l\,e^{-\rho/2}\,M(l + 1 - n,\ 2l + 2,\ \rho)`, "ρ is proportional to r. Without termination M would grow like e^ρ, overwhelm the factor e^{−ρ/2}, and the wavefunction could not be normalised."],
    ["So the series must terminate.", R`l + 1 - n = -n_r \;\Longrightarrow\; n = n_r + l + 1 = 1, 2, 3, \dots, \qquad E_n = -\frac{13.6\ \text{eV}}{n^2}`, "The quantisation of energy is the condition that the confluent hypergeometric series stops."]
  ], R`xy'' + (c - x)y' - ay = 0, \qquad M(a, c, x) = \sum_n\frac{(a)_n}{(c)_n}\frac{x^n}{n!} \sim \frac{\Gamma(c)}{\Gamma(a)}e^xx^{a-c}`, [
    "The second solution, U(a, c, x), is singular at the origin and is the one needed when the origin is excluded.",
    "The harmonic oscillator (parabolic cylinder or Hermite functions) and Coulomb scattering are further cases of the same equation."
  ]);

  d('m-mathieu', [
    ["An equation with a periodically varying coefficient.", R`y'' + (a - 2q\cos2x)\,y = 0`, "Mathieu’s equation: a pendulum whose pivot is shaken, a child pumping a swing, an ion in a radio-frequency trap, an electron in a periodic lattice."],
    ["The coefficient has period π, so if y(x) is a solution then y(x + π) is too. Express the shifted pair of basic solutions through the original pair.", R`\begin{pmatrix}y_1(x + \pi)\\ y_2(x + \pi)\end{pmatrix} = M\begin{pmatrix}y_1(x)\\ y_2(x)\end{pmatrix}`, "The solutions form a two-dimensional space, so the shift acts on it as a 2 × 2 matrix."],
    ["Choose the solutions that are eigenvectors of M.", R`y(x + \pi) = \rho\,y(x) \;\Longrightarrow\; y(x) = e^{\mu x}P(x), \qquad P(x + \pi) = P(x), \quad \rho = e^{\mu\pi}`, "Floquet’s theorem: a periodic function times an exponential. In a crystal this is Bloch’s theorem."],
    ["The Wronskian of the two solutions is constant, because the equation has no y′ term.", R`\det M = \rho_1\rho_2 = 1 \;\Longrightarrow\; \rho^2 - (\operatorname{tr}M)\,\rho + 1 = 0`, "So everything is decided by one number, the trace."],
    ["Classify.", R`|\operatorname{tr}M| < 2: \ \rho = e^{\pm i\phi},\ \text{bounded}; \qquad |\operatorname{tr}M| > 2: \ \rho \ \text{real},\ \text{one solution grows exponentially}`, "Stable bands and unstable tongues in the (a, q) plane. In a crystal these are the allowed bands and the gaps."],
    ["For small q the first unstable tongue starts at a = 1.", R`1 - q < a < 1 + q`, "Here the natural frequency √a is half the frequency of the modulation: parametric resonance. The response grows exponentially from even a tiny disturbance."]
  ], R`y = e^{\mu x}P(x), \quad P(x + \pi) = P(x); \qquad \text{stable} \iff |\operatorname{tr}M| < 2`, [
    "Damping shrinks the unstable tongues, so a minimum strength of driving is needed.",
    "The boundary a = 1 ± q holds to first order in q. Shaking the pivot fast enough can also stabilise the inverted pendulum (Kapitza)."
  ]);

  d('m-theta', [
    ["Take a Fourier series with Gaussian coefficients.", R`\theta_3(z, q) = \sum_{n=-\infty}^\infty q^{n^2}e^{2inz} = 1 + 2\sum_{n=1}^\infty q^{n^2}\cos2nz, \qquad |q| < 1`, "The coefficients fall off so fast that the series converges extremely quickly."],
    ["With q = e^{−t}, differentiate term by term.", R`\frac{\partial\theta_3}{\partial t} = -\sum_nn^2e^{-n^2t}e^{2inz} = \frac14\frac{\partial^2\theta_3}{\partial z^2}`, "Each term satisfies the heat equation, so the sum does. θ₃ is the temperature on a ring that starts from a point of heat."],
    ["The same heat flow can be written as a sum of spreading Gaussians, one for each time the heat has gone round the ring. Equating the two descriptions at z = 0:", R`\sum_{n=-\infty}^\infty e^{-\pi n^2t} = \frac{1}{\sqrt t}\sum_{n=-\infty}^\infty e^{-\pi n^2/t}`, "Jacobi’s identity, an instance of Poisson summation: the Fourier transform of a Gaussian is a Gaussian of reciprocal width."],
    ["It trades a slowly converging sum for a fast one.", R`t \ll 1: \quad \sum_ne^{-\pi n^2t} \approx \frac{1}{\sqrt t}`, "On the right only the n = 0 term matters. For a particle on a ring with levels εn² this gives the high-temperature partition function Z ≈ √(πkT/ε)."],
    ["A function with two independent periods in the complex plane can be built by summing over the lattice of periods.", R`\wp(z) = \frac{1}{z^2} + \sum_{\omega \ne 0}\left[\frac{1}{(z - \omega)^2} - \frac{1}{\omega^2}\right], \qquad \omega = m\omega_1 + n\omega_2`, "The Weierstrass function. Subtracting 1/ω² makes the sum converge."],
    ["It satisfies a first-order differential equation.", R`(\wp')^2 = 4\wp^3 - g_2\wp - g_3`, "Both sides are doubly periodic with the same poles, so their difference is a bounded analytic function: a constant, which turns out to be zero. This is why elliptic functions solve motion in cubic and quartic potentials."]
  ], R`\theta_3(z, q) = \sum_nq^{n^2}e^{2inz}, \qquad \sum_ne^{-\pi n^2t} = t^{-1/2}\sum_ne^{-\pi n^2/t}, \qquad (\wp')^2 = 4\wp^3 - g_2\wp - g_3`, [
    "The two periods must not be real multiples of each other.",
    "The symmetry t → 1/t is the simplest modular transformation; such symmetries organise string theory and the statistical mechanics of two-dimensional lattices."
  ]);

  d('m-expint', [
    ["Some simple-looking integrals have no elementary form and are given names.", R`E_1(x) = \int_x^\infty\frac{e^{-t}}{t}\,dt, \qquad \operatorname{Si}(x) = \int_0^x\frac{\sin t}{t}\,dt`, "They occur in radiative transfer, antenna theory and diffraction."],
    ["For large x, integrate E₁ by parts.", R`E_1(x) = \frac{e^{-x}}{x} - \int_x^\infty\frac{e^{-t}}{t^2}\,dt`, "Take u = 1/t and dv = e^{−t}dt."],
    ["Repeat.", R`E_1(x) \sim \frac{e^{-x}}{x}\left(1 - \frac1x + \frac{2!}{x^2} - \frac{3!}{x^3} + \dots\right)`, "Each step brings another factor −n/x."],
    ["This series diverges for every x, yet it is useful.", R`|\text{error after } n \text{ terms}| < |\text{term } n + 1|, \qquad \text{smallest term at } n \approx x`, "The terms shrink until n ≈ x and then grow. Stopping at the smallest term leaves an error of order e^{−x}: an asymptotic series."],
    ["For small x the behaviour is logarithmic.", R`E_1(x) = -\gamma - \ln x + x - \frac{x^2}{4} + \dots`, "γ = 0.5772 is Euler’s constant. The logarithm comes from the 1/t behaviour of the integrand near zero."],
    ["Fresnel integrals describe diffraction at an edge.", R`C(x) + iS(x) = \int_0^xe^{i\pi t^2/2}\,dt \;\to\; \frac{1 + i}{2} \quad (x \to \infty)`, "A Gaussian integral with an imaginary exponent. Plotted in the complex plane the integral traces the Cornu spiral."]
  ], R`E_1(x) \sim \frac{e^{-x}}{x}\left(1 - \frac1x + \frac{2}{x^2} - \dots\right), \qquad E_1(x) \approx -\gamma - \ln x \ \ (x \to 0), \qquad C(\infty) = S(\infty) = \tfrac12`, [
    "An asymptotic series is not improved by taking more terms beyond the smallest one.",
    "Si(x) → π/2 as x → ∞ but overshoots first, reaching 1.852 at x = π: this overshoot is the Gibbs phenomenon."
  ]);

  /* ---------- Year 4 ---------- */
  d('m-diffgeo', [
    ["On a sphere of radius R, a small displacement has two perpendicular parts.", R`ds^2 = R^2\left(d\theta^2 + \sin^2\theta\,d\varphi^2\right)`, "R dθ along a meridian and R sin θ dφ along a circle of latitude. The coefficients are the metric: they turn coordinate differences into distances."],
    ["A geodesic makes the length between two points stationary. Apply the Euler–Lagrange equations to half the squared speed.", R`L = \tfrac12g_{ab}\dot x^a\dot x^b \;\Longrightarrow\; \ddot x^a + \Gamma^a_{bc}\,\dot x^b\dot x^c = 0, \qquad \Gamma^a_{bc} = \tfrac12g^{ad}\left(\partial_bg_{dc} + \partial_cg_{db} - \partial_dg_{bc}\right)`, "The Christoffel symbols record how the coordinate grid itself bends and stretches."],
    ["For the sphere:", R`\ddot\theta - \sin\theta\cos\theta\,\dot\varphi^2 = 0, \qquad \frac{d}{dt}\left(\sin^2\theta\,\dot\varphi\right) = 0`, "The equator, θ = π/2 with constant φ̇, is a solution, and by symmetry so is every great circle."],
    ["Carry a vector round a closed loop, keeping it parallel to itself at each step. On a curved surface it comes back rotated.", R`\Delta\alpha = \int K\,dA`, "The rotation is the integral of the Gaussian curvature K over the enclosed area. This is the intrinsic meaning of curvature."],
    ["Check on a sphere, with the triangle made by the north pole and two points on the equator 90° apart.", R`\sum\text{angles} - \pi = \frac{3\pi}{2} - \pi = \frac\pi2 = \frac{A}{R^2}, \qquad A = \tfrac18\cdot4\pi R^2 \;\Longrightarrow\; K = \frac{1}{R^2}`, "Three right angles. The angle excess of a geodesic triangle equals the curvature times its area."],
    ["Over a whole closed surface the total curvature is fixed by its topology.", R`\oint K\,dA = 2\pi\chi = 4\pi(1 - g)`, "The Gauss–Bonnet theorem: 4π for anything sphere-like and 0 for a torus, however it is deformed."]
  ], R`ds^2 = g_{ab}\,dx^adx^b, \qquad \ddot x^a + \Gamma^a_{bc}\dot x^b\dot x^c = 0, \qquad \sum\text{angles} - \pi = \int K\,dA`, [
    "Gaussian curvature is intrinsic: a cylinder has K = 0 and can be unrolled flat; a sphere cannot.",
    "In more than two dimensions one number is not enough: curvature is described by the Riemann tensor, as in general relativity."
  ]);

  d('m-groups', [
    ["A group is a set with a rule for combining elements that obeys four axioms.", R`g_1g_2 \in G, \qquad (g_1g_2)g_3 = g_1(g_2g_3), \qquad eg = g, \qquad g^{-1}g = e`, "Closure, associativity, an identity and inverses. The symmetries of any object automatically form a group."],
    ["A subgroup H splits the group into cosets gH. Two cosets are either identical or share no element, and each has as many elements as H.", R`|G| = (\text{number of cosets})\times|H| \;\Longrightarrow\; |H| \ \text{divides}\ |G|`, "Lagrange’s theorem. If g₁h₁ = g₂h₂ then g₁ = g₂h₂h₁⁻¹, so the whole of g₁H lies in g₂H."],
    ["A continuous group can be studied near the identity.", R`g(\varepsilon) \approx 1 - i\varepsilon T \;\Longrightarrow\; g(\theta) = \lim_{N\to\infty}\left(1 - \frac{i\theta T}{N}\right)^N = e^{-i\theta T}`, "T is the generator. A finite transformation is built from many infinitesimal ones."],
    ["Whether two transformations commute is recorded by the commutator of their generators.", R`[J_a, J_b] = i\hbar\,\varepsilon_{abc}J_c`, "For rotations. These relations are the Lie algebra; they fix the possible angular momenta j = 0, ½, 1, … without reference to any particular system."],
    ["The 2 × 2 unitary matrices of determinant 1 can be written with the Pauli matrices.", R`U = a + i\,\mathbf b\cdot\boldsymbol\sigma, \quad a^2 + |\mathbf b|^2 = 1; \qquad U = e^{-i\theta\,\hat{\mathbf n}\cdot\boldsymbol\sigma/2} = \cos\frac\theta2 - i\,\hat{\mathbf n}\cdot\boldsymbol\sigma\,\sin\frac\theta2`, "The generators σ/2 obey the same algebra as rotations. The closed form follows because the square of n̂·σ is the identity."],
    ["Put θ = 2π.", R`U(2\pi) = -1, \qquad U(4\pi) = +1`, "U and −U produce the same rotation of ordinary vectors, so SU(2) covers the rotation group twice. A spin-½ state changes sign under one full turn and returns only after two."]
  ], R`g = e^{-i\theta T}, \qquad [J_a, J_b] = i\hbar\varepsilon_{abc}J_c, \qquad U(2\pi) = -1 \ \ \text{in SU(2)}`, [
    "The exponential reaches only the part of the group connected to the identity; reflections are not included.",
    "The same algebra can belong to different groups: the algebra knows the local structure, not the global one."
  ]);

  d('m-path-integral', [
    ["The amplitude to go from x_a to x_b in time t is a matrix element of the evolution operator. Split the time into N short steps.", R`K = \langle x_b|e^{-iHt/\hbar}|x_a\rangle = \langle x_b|\left(e^{-iH\varepsilon/\hbar}\right)^N|x_a\rangle, \qquad \varepsilon = \frac tN`, "Evolution for a time t is N successive evolutions for ε."],
    ["Insert a complete set of position states between each pair of factors.", R`K = \int dx_1\cdots dx_{N-1}\prod_{j=0}^{N-1}\langle x_{j+1}|e^{-iH\varepsilon/\hbar}|x_j\rangle`, "The integral of |x⟩⟨x| over x is the identity. The particle is allowed to be anywhere at each intermediate time."],
    ["For a short step the kinetic and potential parts can be treated separately.", R`\langle x_{j+1}|e^{-iH\varepsilon/\hbar}|x_j\rangle \approx \sqrt{\frac{m}{2\pi i\hbar\varepsilon}}\,\exp\!\left\{\frac{i\varepsilon}{\hbar}\left[\frac m2\left(\frac{x_{j+1} - x_j}{\varepsilon}\right)^2 - V(x_j)\right]\right\}`, "Insert momentum states and do the Gaussian integral over p. The error is of order ε² per step and vanishes as N → ∞."],
    ["Multiply the steps. The exponents add up to the classical action of the zig-zag path.", R`K = \int\mathcal Dx(t)\,e^{iS[x]/\hbar}, \qquad S = \int\left(\tfrac12m\dot x^2 - V\right)dt`, "A sum over all paths, each contributing a phase of unit size. No path is preferred in magnitude."],
    ["When S is much larger than ħ the phase varies rapidly from path to path and neighbouring paths cancel, except where the phase is stationary.", R`\delta S = 0 \iff m\ddot x = -V'(x)`, "The classical path is where contributions add in step. Classical mechanics is the stationary-phase limit of quantum mechanics."],
    ["For a free particle all the integrals are Gaussian and can be done exactly.", R`K_{\text{free}} = \sqrt{\frac{m}{2\pi i\hbar t}}\,\exp\!\left[\frac{im(x_b - x_a)^2}{2\hbar t}\right]`, "The exponent is iS/ħ for the straight-line path; the prefactor comes from the fluctuations about it."]
  ], R`K = \int\mathcal Dx\,e^{iS/\hbar}, \qquad \delta S = 0 \Leftrightarrow m\ddot x = -V', \qquad K_{\text{free}} = \sqrt{\frac{m}{2\pi i\hbar t}}\,e^{im(x_b - x_a)^2/2\hbar t}`, [
    "The “measure” over paths is defined only through the limit of the time-sliced integrals; the oscillating integrals are made convergent by giving time a small imaginary part.",
    "Rotating to imaginary time turns the phase e^{iS/ħ} into a Boltzmann-like weight and the path integral into a partition function."
  ]);

  d('m-asymptotics', [
    ["Consider an integral that is dominated by the maximum of the exponent when M is large.", R`I(M) = \int e^{Mf(x)}\,dx, \qquad f'(x_0) = 0, \quad f''(x_0) < 0`, "Away from the maximum the integrand is exponentially smaller."],
    ["Expand f about its maximum.", R`f(x) \approx f(x_0) - \tfrac12|f''(x_0)|\,(x - x_0)^2`, "The first-order term vanishes at a maximum."],
    ["What remains is a Gaussian integral.", R`I(M) \approx e^{Mf(x_0)}\int_{-\infty}^\infty e^{-\frac12M|f''(x_0)|(x - x_0)^2}dx = e^{Mf(x_0)}\sqrt{\frac{2\pi}{M|f''(x_0)|}}`, "Laplace’s method. The width of the peak is of order 1/√M, so extending the limits to infinity costs nothing."],
    ["Apply it to the factorial.", R`n! = \int_0^\infty t^ne^{-t}\,dt = n^{n+1}\int_0^\infty e^{n(\ln s - s)}\,ds`, "Substitute t = ns, so that the exponent is n times a fixed function, ln s − s."],
    ["The maximum is at s = 1, where f = −1 and f″ = −1.", R`n! \approx n^{n+1}e^{-n}\sqrt{\frac{2\pi}{n}} = \sqrt{2\pi n}\left(\frac ne\right)^n`, "Stirling’s formula. Already for n = 10 it is accurate to better than 1%."],
    ["The corrections form a series in 1/n that diverges if continued for ever.", R`n! = \sqrt{2\pi n}\left(\frac ne\right)^n\left(1 + \frac{1}{12n} + \frac{1}{288n^2} - \dots\right)`, "An asymptotic series: for fixed n the terms eventually grow, and the best accuracy comes from stopping at the smallest one."]
  ], R`\int e^{Mf}dx \approx e^{Mf(x_0)}\sqrt{\frac{2\pi}{M|f''(x_0)|}}, \qquad n! \approx \sqrt{2\pi n}\left(\frac ne\right)^n`, [
    "The maximum must lie inside the range of integration and be quadratic; at an end point or at a flatter maximum the power of M changes.",
    "With an imaginary exponent the same idea is the method of stationary phase, and in the complex plane the method of steepest descent.",
    "One consequence: the central binomial coefficient is approximately 4ⁿ/√(πn)."
  ]);

  d('m-representations', [
    ["A representation assigns a matrix to each group element, so that matrix multiplication copies the group.", R`D(g_1)\,D(g_2) = D(g_1g_2)`, "It is how an abstract symmetry acts on actual states or vectors."],
    ["A representation is reducible if all its matrices can be put in the same block form by one change of basis.", R`D(g) = \begin{pmatrix}D_1(g) & 0\\ 0 & D_2(g)\end{pmatrix} \quad \text{for all } g`, "The blocks never mix. The building blocks that cannot be reduced further are the irreducible representations."],
    ["Schur’s lemma: a matrix that commutes with every matrix of an irreducible representation is a multiple of the identity.", R`A\,D(g) = D(g)\,A \ \ \forall g \;\Longrightarrow\; A = \lambda\,1`, "Each eigenspace of A is mapped into itself by every D(g), so it would be an invariant block; irreducibility forces it to be the whole space."],
    ["Apply this to a Hamiltonian that commutes with the symmetry.", R`[H, D(g)] = 0 \;\Longrightarrow\; H = E\,1 \ \ \text{within each irreducible representation}`, "All the states of an irreducible multiplet have the same energy: the degeneracy equals its dimension. The 2l + 1 states of given l are the example for rotations."],
    ["The character is the trace. It does not depend on the basis.", R`\chi(g) = \operatorname{tr}D(g), \qquad \frac{1}{|G|}\sum_g\chi_i(g)^*\,\chi_j(g) = \delta_{ij}`, "The characters of different irreducible representations are orthogonal, a consequence of Schur’s lemma."],
    ["So the content of any representation can be read off.", R`\chi = \sum_in_i\chi_i \;\Longrightarrow\; n_i = \frac{1}{|G|}\sum_g\chi_i(g)^*\,\chi(g)`, "n_i is the number of times irreducible representation i appears, found just as a Fourier coefficient is. This predicts how levels split when a symmetry is lowered."]
  ], R`D(g_1)D(g_2) = D(g_1g_2), \qquad \chi(g) = \operatorname{tr}D(g), \qquad n_i = \frac{1}{|G|}\sum_g\chi_i^*(g)\,\chi(g)`, [
    "Stated for finite groups and complex matrices; for compact continuous groups the sum becomes an integral over the group.",
    "A matrix element ⟨f|O|i⟩ vanishes unless the product of the three representations contains the trivial one: the origin of selection rules."
  ]);

  d('m-lie', [
    ["The generators of a continuous group close under commutation.", R`[T_a, T_b] = if_{abc}T_c`, "Multiply two transformations in both orders: to second order the difference is another transformation. The numbers f are the structure constants."],
    ["For rotations, define raising and lowering operators.", R`J_\pm = J_x \pm iJ_y: \qquad [J_z, J_\pm] = \pm\hbar J_\pm, \qquad [J^2, J_\pm] = 0`, "Directly from the commutation relations of the three components."],
    ["Acting on an eigenstate of J_z they shift its eigenvalue by ħ.", R`J_z\left(J_\pm|m\rangle\right) = (m \pm 1)\hbar\left(J_\pm|m\rangle\right)`, "J² is unchanged, so the states form a ladder at fixed total angular momentum."],
    ["The ladder must stop at a top state, annihilated by J₊, because the square of J_z cannot exceed J².", R`J^2 = J_-J_+ + J_z^2 + \hbar J_z \;\Longrightarrow\; J^2|j\rangle = j(j + 1)\hbar^2|j\rangle`, "Rewrite J² with the ladder operators and act on the top state, whose m is called j."],
    ["It must also stop at the bottom, and the two ends are a whole number of steps apart.", R`m = -j, -j + 1, \dots, j \;\Longrightarrow\; 2j \in \mathbb Z, \qquad \dim = 2j + 1`, "The same argument at the bottom gives −j. So j = 0, ½, 1, 3/2, … follow from the algebra alone."],
    ["The same method classifies other symmetries.", R`\dim SU(n) = n^2 - 1: \qquad SU(2): 3, \qquad SU(3): 8`, "An n × n unitary matrix of determinant 1 has n² − 1 real parameters. SU(3) has two commuting generators, so its multiplets are labelled by two numbers: eight gluons, and the octets and decuplets of hadrons."]
  ], R`[T_a, T_b] = if_{abc}T_c, \qquad J^2 = j(j + 1)\hbar^2, \qquad m = -j, \dots, j, \qquad \dim SU(n) = n^2 - 1`, [
    "Finite-dimensional unitary representations exist for compact groups. The Lorentz group is not compact: its finite representations (spinors, vectors) are not unitary, one reason why relativistic quantum mechanics needs fields.",
    "The Lorentz algebra splits into two copies of that of SU(2), so its representations are labelled by a pair of spins."
  ]);

  d('m-topology', [
    ["Topology studies what survives continuous deformation. For a polyhedron count the vertices, edges and faces.", R`\chi = V - E + F`, "Cube: 8 − 12 + 6 = 2. Tetrahedron: 4 − 6 + 4 = 2."],
    ["χ does not change when the surface is subdivided.", R`\text{new vertex on an edge: } \Delta V = 1,\ \Delta E = 1; \qquad \text{new edge across a face: } \Delta E = 1,\ \Delta F = 1`, "Each change cancels in V − E + F. So χ belongs to the surface, not to the way it is cut up."],
    ["Each handle lowers it by 2.", R`\chi = 2 - 2g`, "g is the number of handles: χ = 2 for a sphere and 0 for a torus. Two closed orientable surfaces can be deformed into each other only if they have the same g."],
    ["Loops in a space are classified by whether they can be deformed into one another.", R`\pi_1(S^1) = \mathbb Z`, "A loop on a circle is labelled by the number of times it winds round. Loops with different winding numbers cannot be deformed into each other."],
    ["The winding number of a phase field round a closed curve is a whole number.", R`n = \frac{1}{2\pi}\oint\nabla\theta\cdot d\mathbf l \in \mathbb Z`, "The phase must return to itself up to a multiple of 2π. A whole number cannot change continuously, so a vortex cannot be removed by any smooth change: it is topologically protected."],
    ["The rotation group contains a loop that cannot be shrunk, though traversed twice it can.", R`\pi_1(SO(3)) = \mathbb Z_2`, "A rotation by 2π is such a loop; a rotation by 4π can be undone continuously (Dirac’s belt trick). This is the topological reason why spin-½ exists."]
  ], R`\chi = V - E + F = 2 - 2g, \qquad \pi_1(S^1) = \mathbb Z, \qquad \pi_1(SO(3)) = \mathbb Z_2`, [
    "Topology says what is forbidden or protected, not how large any effect is.",
    "On a closed surface the indices of the zeros of a vector field add up to χ, so a sphere (χ = 2) cannot be combed flat: the hairy ball theorem."
  ]);

  d('m-forms', [
    ["A 1-form is a linear function of small displacements. The differential of a function is the basic example.", R`df = \frac{\partial f}{\partial x^i}\,dx^i`, "It is the thing to be integrated along a curve. Summation over i is implied."],
    ["Higher forms are built with the antisymmetric wedge product.", R`dx\wedge dy = -dy\wedge dx, \qquad dx\wedge dx = 0`, "dx∧dy measures oriented area. Antisymmetry is what makes a change of variables produce the Jacobian determinant."],
    ["The exterior derivative raises the degree by one.", R`\omega = P\,dx + Q\,dy \;\Longrightarrow\; d\omega = dP\wedge dx + dQ\wedge dy = \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dx\wedge dy`, "Differentiate the coefficients and wedge. On a function d gives the gradient, on a 1-form the curl, on a 2-form the divergence."],
    ["Applying it twice gives zero.", R`d(df) = \frac{\partial^2f}{\partial x^i\,\partial x^j}\,dx^i\wedge dx^j = 0`, "A symmetric object contracted with an antisymmetric one. This single statement contains curl grad = 0 and div curl = 0."],
    ["All the integral theorems are one theorem.", R`\int_Md\omega = \oint_{\partial M}\omega`, "Stokes’ theorem in its general form: the fundamental theorem of calculus, Green’s, Stokes’ and the divergence theorems are the cases of degree 0, 1 and 2."],
    ["Maxwell’s equations in this language:", R`F = dA \;\Longrightarrow\; dF = 0; \qquad d{\star}F = \mu_0\,{\star}J`, "The first pair (no monopoles, Faraday’s law) is automatic from d² = 0. The second pair needs the metric, through the Hodge star."]
  ], R`d^2 = 0, \qquad \int_Md\omega = \oint_{\partial M}\omega, \qquad F = dA \Rightarrow dF = 0`, [
    "dω = 0 does not always imply ω = dα: the form (x dy − y dx)/(x² + y²) is closed, yet integrates to 2π round the origin. Such failures measure the holes in a space (de Rham cohomology).",
    "Sign conventions for the Hodge star, and the units in Maxwell’s equations, vary between books."
  ]);

  d('m-bundles', [
    ["A fibre bundle attaches a copy of some space, the fibre, to every point of a base space.", R`E \approx U\times F \quad \text{(locally)}`, "The phase of a wavefunction is a circle attached to each point of space. Locally a bundle looks like a product, but globally it may be twisted, like a Möbius strip."],
    ["There is no natural way to compare fibres at different points. A connection supplies one, and defines the covariant derivative.", R`D_\mu\psi = \left(\partial_\mu - \frac{iq}{\hbar}A_\mu\right)\psi`, "A_μ says how the phase convention changes from point to point. This is exactly the electromagnetic potential."],
    ["Changing the phase convention at each point changes A, but not the physics.", R`\psi \to e^{iq\chi/\hbar}\psi, \quad A_\mu \to A_\mu + \partial_\mu\chi \;\Longrightarrow\; D_\mu\psi \to e^{iq\chi/\hbar}D_\mu\psi`, "A gauge transformation is a change of coordinates on the fibres."],
    ["Transport round a small closed loop does not return the original phase. The mismatch is the curvature.", R`[D_\mu, D_\nu]\psi = -\frac{iq}{\hbar}F_{\mu\nu}\psi, \qquad F_{\mu\nu} = \partial_\mu A_\nu - \partial_\nu A_\mu`, "The electromagnetic field is the curvature of the connection. For a non-commuting group there is an extra term, F = dA + A∧A."],
    ["Round a finite loop the accumulated phase is the holonomy.", R`\psi \to \exp\!\left(\frac{iq}{\hbar}\oint\mathbf A\cdot d\mathbf l\right)\psi = e^{iq\Phi/\hbar}\psi`, "By Stokes’ theorem the line integral is the enclosed flux Φ. It can be non-zero where the field itself vanishes: the Aharonov–Bohm effect."],
    ["On a closed surface the total curvature is quantised.", R`\frac{q}{2\pi\hbar}\oint\mathbf B\cdot d\mathbf S = n \in \mathbb Z`, "The phase must be single-valued whichever side of the surface the loop is shrunk over. This is Dirac’s quantisation condition, and the whole number is the Chern number."]
  ], R`D = \nabla - \frac{iq}{\hbar}\mathbf A, \qquad [D_\mu, D_\nu] = -\frac{iq}{\hbar}F_{\mu\nu}, \qquad \text{holonomy} = e^{iq\Phi/\hbar}`, [
    "Sign and unit conventions for q, A and F vary; the structure does not.",
    "The same language describes general relativity, with tangent spaces as the fibres, the Christoffel symbols as the connection and the Riemann tensor as the curvature."
  ]);

  d('m-functional', [
    ["Measure the size of an operator by how much it can stretch a vector.", R`\|A\| = \sup_{\psi \ne 0}\frac{\|A\psi\|}{\|\psi\|}`, "If this is finite the operator is bounded. In a finite-dimensional space every operator is bounded."],
    ["Position and momentum cannot both be bounded. Suppose [x, p] = iħ held for n × n matrices, and take the trace.", R`\operatorname{tr}(xp) - \operatorname{tr}(px) = 0 \ne i\hbar\,n`, "The trace of a product does not depend on the order. So the commutation relation has no finite-dimensional realisation: quantum mechanics needs an infinite-dimensional space."],
    ["An unbounded operator is not defined on every vector, so its domain is part of its definition. Take p = −iħ d/dx on the interval [0, L] and integrate by parts.", R`\langle\varphi|p\psi\rangle - \langle p\varphi|\psi\rangle = -i\hbar\left[\varphi^*\psi\right]_0^L`, "p is symmetric only if the boundary term vanishes for all functions in the domain."],
    ["The boundary term vanishes for functions with a fixed phase relation between the two ends.", R`\psi(L) = e^{i\theta}\psi(0) \;\Longrightarrow\; p_n = \frac{\hbar(2\pi n + \theta)}{L}`, "Each θ gives a different self-adjoint operator with a different spectrum; physically θ is the flux through a ring. Requiring ψ = 0 at both ends is too strong: then p has no eigenfunctions at all."],
    ["For a self-adjoint operator the spectral theorem holds.", R`A = \int\lambda\,dP(\lambda), \qquad f(A) = \int f(\lambda)\,dP(\lambda)`, "A is built from projectors onto its spectrum, discrete or continuous. This is what gives meaning to the probabilities of measurement and to the time-evolution operator."],
    ["Infinite dimensions allow what matrices cannot do.", R`S|n\rangle = |n + 1\rangle: \qquad S^\dagger S = 1, \qquad SS^\dagger = 1 - |0\rangle\langle0| \ne 1`, "The shift operator preserves lengths but cannot be inverted. For matrices, a one-sided inverse is always two-sided."]
  ], R`\operatorname{tr}[x, p] = 0 \ne i\hbar n; \qquad p_n = \frac{\hbar(2\pi n + \theta)}{L}; \qquad A = \int\lambda\,dP(\lambda)`, [
    "“Hermitian” (symmetric) and “self-adjoint” coincide for matrices but not for unbounded operators; only self-adjoint operators have a real spectrum and generate unitary evolution in time.",
    "Eigenstates of position and momentum cannot be normalised and lie outside the Hilbert space; they are made rigorous with a rigged Hilbert space."
  ]);
})();
