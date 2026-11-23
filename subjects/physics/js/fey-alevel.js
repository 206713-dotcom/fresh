/* Geodesic: "See it like Feynman" sections, alevel. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('al-ac', [
  'UK mains is called 230 V, yet the voltage swings between about +325 V and −325 V fifty times a second. Why quote 230?',
  'The heating effect of a current depends on I², which is positive whichever way the current flows. The **r.m.s.** value is the steady direct voltage that would heat a resistor at the same average rate. **Rectifiers** use diodes, one-way valves for current, to make the flow go one way, and a capacitor smooths the bumps.',
  'Average power is ⟨V²⟩/R. For a sine wave, sin² averages to exactly ½ over a cycle (sin² + cos² = 1, and the two average the same), so V_rms = V₀/√2.',
  'A 230 V r.m.s. supply peaks at 230 × √2 ≈ 325 V. A 2.3 kW kettle draws 10 A r.m.s., peaking at about 14 A.',
  'V_rms = V₀/√2 holds only for sine waves (a square wave’s r.m.s. equals its peak), and real loads such as motors and chargers make the current lag or distort.'
]);
WL.fy('al-astro', [
  'In Orion, Betelgeuse looks red and Rigel blue-white. Colour alone tells you a star’s surface temperature from hundreds of light years away.',
  'A star’s surface glows like any hot body. As it gets hotter, the peak of its spectrum moves to shorter wavelengths (**Wien’s law**) and its output per square metre rises as T⁴ (**Stefan–Boltzmann**). Temperature from the colour, and luminosity from the brightness and distance, then give the star’s size.',
  'The typical photon from a hot body carries a few kT of energy, so the peak wavelength scales as 1/T: λ_max T ≈ 2.9 × 10⁻³ m K. The power per square metre grows as T⁴ because the number of ways the radiation can share energy grows as T³ and each carries about kT.',
  'The Sun peaks near 500 nm, so T ≈ 2.9 × 10⁻³ / 5 × 10⁻⁷ ≈ 5800 K. Betelgeuse, at about 3500 K and 10⁵ times the Sun’s luminosity, has R ≈ √10⁵ × (5800/3500)² ≈ 870 solar radii: about 4 AU, larger than the orbit of Mars.',
  'Stars are not perfect black bodies: absorption lines and layered atmospheres change their spectra, and interstellar dust reddens starlight, which must be corrected for.'
]);
WL.fy('al-bfields', [
  'Electrons in a beam tube or a particle accelerator curve round in circles in a magnetic field, yet they never speed up or slow down.',
  'The magnetic force on a moving charge is always sideways, at right angles to its velocity. A force always at right angles turns the direction without changing the speed: circular motion. In a strip carrying a current, the same sideways push drives charges to one edge, building a small voltage across the strip: the **Hall effect**.',
  'F = qv × B is perpendicular to v, so it does no work and the kinetic energy stays fixed. Setting qvB = mv²/r gives r = mv/(qB), and the time for one circle, 2πm/(qB), does not depend on the speed: the principle of the cyclotron.',
  'An electron at 10⁷ m/s in a 1 mT field circles with r = 9.1 × 10⁻³¹ × 10⁷ / (1.6 × 10⁻¹⁹ × 10⁻³) ≈ 5.7 cm.',
  'Near the speed of light, momentum is no longer mv, so r = p/(qB) with the relativistic momentum. And the sign of a Hall voltage reveals the sign of the carriers: in some semiconductors they are positive holes.'
]);
WL.fy('al-capacitors', [
  'A camera flash charges for a few seconds, then empties in a fraction of a millisecond. A capacitor discharging through a resistor never quite reaches zero.',
  'The current out of a capacitor is driven by its own voltage, which is proportional to the charge left. Less charge means a lower voltage, a smaller current and a slower loss: the rate of emptying is proportional to how full it is. That is **exponential decay**, with time constant RC.',
  'I = V/R, V = Q/C and I = −dQ/dt, so dQ/dt = −Q/(RC), with solution Q = Q₀e^(−t/RC). After one time constant 37 % remains; after five, less than 1 %.',
  'A 1000 μF capacitor discharging through 10 kΩ has RC = 10 s, so it is half empty after RC ln 2 ≈ 7 s. A 100 μF flash capacitor discharging through about 1 Ω of flash tube has RC = 0.1 ms.',
  'Real capacitors leak slowly, their capacitance can change with voltage and temperature, and very fast discharges are limited by the wiring’s inductance as well as its resistance.'
]);
WL.fy('al-circular', [
  'On a fast roundabout you feel thrown outwards, yet nothing pushes you outwards. Let go and you fly off along the tangent, not straight out from the centre.',
  'To move in a circle, your velocity has to keep turning towards the centre, which needs a force towards the centre, the **centripetal force**, from the seat or the bar. The feeling of being thrown out is your body trying to carry straight on while the ride pushes you round.',
  'In a short time Δt the velocity turns through an angle vΔt/r, so it changes by v × vΔt/r, pointing towards the centre: a = v²/r. Something must supply a force mv²/r towards the centre, whether friction, tension, gravity or a normal reaction.',
  'A car taking a 50 m radius bend at 20 m/s (72 km/h) needs a = 400/50 = 8 m/s², nearly g. Dry tyres (μ ≈ 0.8 to 1) can just provide it; on ice (μ ≈ 0.1) the safe speed falls to √(0.1 × 9.8 × 50) ≈ 7 m/s.',
  'In the rotating frame of the ride, a "centrifugal force" is a perfectly good bookkeeping device. The picture here uses the non-rotating frame, where no such force appears.'
]);
WL.fy('al-cosmology', [
  'The night sky is dark. If the universe were infinite, unchanging and full of stars, every line of sight would end on a star and the whole sky would blaze like the Sun (Olbers’ paradox).',
  'The universe has a finite age and is expanding. We see only light that has had time to reach us, and that light has been stretched to longer wavelengths on the way. The glow of the hot early universe is still here, stretched into microwaves: the **cosmic microwave background**.',
  'Uniform expansion gives v = H₀d and an age of roughly 1/H₀. Light emitted when the universe was smaller arrives stretched by the same factor: 1 + z = (size now)/(size then). The background radiation left at about 3000 K, when the universe was about 1100 times smaller than today.',
  '3000 K ÷ 1100 ≈ 2.7 K, which is exactly what is measured. Wien’s law puts its peak at 2.9 × 10⁻³ / 2.7 ≈ 1 mm: microwaves.',
  'v = H₀d holds only for relatively nearby galaxies; further out the relation depends on how the expansion rate has changed. Measurements of H₀ by different methods currently disagree slightly (the "Hubble tension").'
]);
WL.fy('al-current', [
  'Carry the same current through a copper wire and through a silicon wire of the same size, and the charge carriers in the silicon must move enormously faster.',
  'The current depends on how many carriers there are per cubic metre, their charge and their average drift speed: I = nAvq. Copper has about one free electron per atom; pure silicon has about a ten-thousand-billionth as many, so they would have to drift far faster to carry the same current.',
  'In a time t, the carriers in a length vt of wire pass a given point: nAvt of them, carrying charge nAvtq. So I = nAvq. The power delivered is P = IV = I²R = V²/R, since each coulomb gives up V joules.',
  'In copper (n ≈ 8.5 × 10²⁸ m⁻³), 1 A through 1 mm² means a drift speed of about 0.07 mm/s. In pure silicon (n ≈ 10¹⁶ m⁻³) the same current would need 6 × 10⁸ m/s, faster than light: which is why pure silicon conducts so badly and why semiconductors are doped.',
  'The drift is slow, but the electrons themselves dart about at around 10⁶ m/s; the drift is only a tiny bias on that random motion.'
]);
WL.fy('al-damping', [
  'A child on a swing goes higher and higher with small pushes timed just right, while pushes at the wrong rhythm build nothing up. Soldiers break step when they cross a bridge.',
  'Everything that oscillates has a **natural frequency**. Pushes in step with its motion add energy every cycle; pushes out of step take away as much as they add. With **damping** draining energy, the amplitude settles where the energy fed in each cycle equals the energy lost.',
  'Driven at ω, the steady amplitude is A = (F₀/m)/√((ω₀² − ω²)² + (γω)²). At ω = ω₀ only damping limits it, and A = F₀/(mγω₀). Light damping gives a tall, narrow peak, measured by the quality factor Q ≈ ω₀/γ.',
  'At resonance the response is Q times bigger than to a slow push of the same size. A wine glass with Q ≈ 1000 can therefore be shattered by a steady, loud note at exactly its natural frequency.',
  'Large amplitudes make real systems nonlinear: the natural frequency shifts with amplitude, and resonance curves can lean over and jump suddenly between two states.'
]);
WL.fy('al-dc-circuits', [
  'Start a car with the headlights on and the lights dim, though nothing in the lamp circuit has changed.',
  'A battery is an ideal source of **e.m.f.** with a small **internal resistance**. The starter motor draws a huge current, and that current drops a large voltage across the internal resistance, leaving less for everything else connected to the battery.',
  'Kirchhoff’s laws are conservation laws: charge is conserved at junctions (current in = current out), and energy round any loop (the e.m.f.s equal the sum of the IR drops). So the terminal voltage is V = ε − Ir: the more current, the more is lost inside.',
  'A car battery with ε = 12.6 V and r ≈ 0.02 Ω supplying 150 A to the starter gives V = 12.6 − 150 × 0.02 = 9.6 V. The lamps’ power falls to about (9.6/12.6)² ≈ 58 % of normal.',
  'Internal resistance is not fixed: it rises as a battery runs down or gets cold, which is why cars struggle to start on winter mornings.'
]);
WL.fy('al-decay', [
  'The potassium-40 in your body decays roughly 4000 times every second, yet it has been around since before the Earth formed.',
  'Each nucleus has a fixed probability λ of decaying per second. The **activity** is λN: a long-lived isotope has a tiny λ, but N can be so enormous that thousands of decays still happen every second.',
  'A = λN, N falls as e^(−λt), and the half-life is t½ = ln 2/λ. For potassium-40, t½ = 1.25 billion years, so λ ≈ 1.8 × 10⁻¹⁷ s⁻¹.',
  'A 70 kg person holds about 140 g of potassium, 0.012 % of it potassium-40: about 0.017 g, or 2.5 × 10²⁰ nuclei. Then A = λN ≈ 1.8 × 10⁻¹⁷ × 2.5 × 10²⁰ ≈ 4500 Bq.',
  'Decay constants are almost perfectly fixed: they do not change with temperature or pressure, although decays by electron capture change very slightly with the chemical surroundings.'
]);
WL.fy('al-doppler', [
  'An ambulance siren drops in pitch the instant it passes you, and police radar measures your speed from the shift in its echo.',
  'As a source approaches, each crest is sent out a little closer to you than the one before, so the crests arrive bunched up: a higher frequency. As it moves away they are spread out: a lower one. This is the **Doppler effect**.',
  'In one period T the source moves vT, so the wavelength ahead shrinks to λ − vT and f′ = fc/(c − v). For light only the relative speed matters, and for v ≪ c the shift is Δf/f ≈ v/c. A radar echo is shifted twice, on the way out and on the way back: Δf = 2fv/c.',
  'A 700 Hz siren on an ambulance at 25 m/s sounds at 700 × 340/315 ≈ 756 Hz approaching and 700 × 340/365 ≈ 652 Hz going away: a drop of about two and a half semitones.',
  'For sound it matters whether the source or the listener moves, because the air is a special frame; for light only relative motion counts, and at high speed relativity adds time dilation (the transverse Doppler effect).'
]);
WL.fy('al-dynamics', [
  'A raindrop falling 1 km would hit the ground at about 140 m/s if there were no air. In fact it arrives at about 9 m/s, gently enough not to hurt.',
  'As the drop speeds up, air drag grows until it equals the drop’s weight. Then the resultant force is zero and the speed stops changing: **terminal velocity**. Small drops reach it quickly and at low speed.',
  'At everyday speeds drag grows roughly as v²: the drop sweeps up air at a rate proportional to v and gives each bit a momentum proportional to v. Setting ½ρCAv² = mg gives v_t = √(2mg/(ρCA)). Weight grows as r³ but area only as r², so bigger drops fall faster, v_t ∝ √r.',
  'A drop of radius 2 mm: m ≈ 3.4 × 10⁻⁵ kg, A ≈ 1.3 × 10⁻⁵ m², C ≈ 0.5, so v_t = √(2 × 3.4 × 10⁻⁵ × 9.8 / (1.2 × 0.5 × 1.3 × 10⁻⁵)) ≈ 9 m/s.',
  'Tiny fog droplets fall in the slow, sticky regime where drag is proportional to v (Stokes’ law), and large drops flatten and break up, which caps their speed.'
]);
WL.fy('al-efields', [
  'Birds perch safely on a 400 kV power line, while a person touching the line from the ground would be killed.',
  'The **potential** is like height in a landscape, and the **field** is how steep the slope is. Current flows through a path only if there is a potential difference across it. Both of the bird’s feet are at almost the same potential, so almost no current flows through it, however high that potential is.',
  'E = −dV/dx: the field, the force per unit charge, is the slope of the potential. Moving a charge q from A to B takes q(V_B − V_A) whatever the route, because the electrostatic field is conservative. Over the few centimetres between the bird’s feet, the potential difference is tiny.',
  'A line carrying 1000 A through a conductor of about 3 × 10⁻⁵ Ω per metre has 1000 × 3 × 10⁻⁵ × 0.05 ≈ 1.5 mV between feet 5 cm apart. Through a body of a thousand ohms or more, that drives at most a microamp or so.',
  'The bird is safe until it bridges two lines, or a line and the pylon, with its wings. And on alternating current its tiny body capacitance is recharged a hundred times a second, a small current it does not notice.'
]);
WL.fy('al-energy', [
  'A cyclist freewheeling down a hill reaches the bottom at the same speed whatever the shape of the hill, if friction is small. Climbing back, a gentler road is easier, though it takes longer.',
  '**Work** is force × distance along the force, and energy is conserved. A gentler slope needs a smaller force over a longer distance: the same total work, but less force at each moment, and legs are limited in force and in power.',
  'The work–energy theorem says the net work done equals the change in ½mv². Gravity’s work depends only on the change in height, mgh, because gravity is conservative. And P = Fv: at a fixed maximum power, a smaller force (a gentler slope) allows a higher speed.',
  'A rider and bike of 85 kg climbing 100 m gain 85 × 9.8 × 100 ≈ 83 kJ. At a steady 250 W of useful power that takes about 330 s, five and a half minutes, by any route (ignoring friction and air).',
  'Friction and air drag take a large share at speed, since the power lost to drag grows as v³, so "the route does not matter" holds only for the potential-energy part.'
]);
WL.fy('al-equilibrium', [
  'A ladder against a smooth wall is safe when steep and slides out when its foot is too far from the wall. The danger depends on the angle, not just the weight.',
  'For balance, the forces must cancel and the turning effects about any point must cancel. A smooth wall can only push horizontally, so the floor has to supply both the upward push and a sideways friction force. The shallower the ladder, the more friction it needs.',
  'Take moments about the foot: the wall’s push N_w × L sin θ must balance the weight W × (L/2) cos θ, so N_w = (W/2) cot θ. Friction must equal N_w and can be at most μW, so the ladder slips when cot θ > 2μ.',
  'With μ = 0.4 the ladder slips once cot θ > 0.8, below about 51° from the ground. The usual safety rule of one out for every four up (about 75°) leaves a wide margin.',
  'A person climbing changes everything: their weight higher up the ladder raises the friction needed, which is why ladders often slip as you near the top.'
]);
WL.fy('al-fluids', [
  'A hot-air balloon rises, a helium balloon rises faster, and a submarine can hover at any depth.',
  '**Upthrust** is the net push of the fluid’s pressure, which is larger below an object than above it, and it equals the weight of fluid displaced. Hovering means weight equals upthrust: a submarine adjusts its weight by letting water into, or blowing it out of, its ballast tanks.',
  'Pressure grows with depth, p = ρgh, so the bottom of an object is pushed harder than the top, and the net force is ρ_fluid Vg (Archimedes’ principle). Hot air is less dense than cold, so a balloon full of it displaces more weight of cold air than its own air weighs.',
  'Air at 20 °C is 1.20 kg/m³; at 100 °C it is 1.20 × 293/373 ≈ 0.94 kg/m³. Each cubic metre of hot air lifts about 0.26 kg, so a 2800 m³ balloon lifts about 730 kg, envelope, basket and passengers included.',
  'For moving fluids the pressure also depends on the speed (Bernoulli), which is how wings and sails produce lift; Archimedes covers only the still fluid.'
]);
WL.fy('al-gravfields', [
  'Geostationary satellites hang over one spot on the equator, all at the same height, about 36 000 km up. Not 35 000 or 40 000: one height only.',
  'For a given planet, an orbit’s period depends only on its radius. To keep pace with the Earth’s rotation, once every sidereal day of 23 h 56 min, there is exactly one radius that works.',
  'GMm/r² = mω²r gives r³ = GM/ω² = GMT²/4π²: Kepler’s third law in Newton’s form, and the satellite’s mass cancels out.',
  'r = ∛(GMT²/4π²) = ∛(3.99 × 10¹⁴ × 86 164² / 39.5) ≈ 4.2 × 10⁷ m from the Earth’s centre: about 35 800 km above the surface.',
  'The Earth is not a perfect sphere, and the Moon and Sun pull too, so geostationary satellites drift and need small regular burns to stay on station.'
]);
WL.fy('al-ideal-gas', [
  'The molecules of the air around you move at about 500 m/s, faster than sound, and their drumming on every surface is what we call air pressure.',
  'Each molecule bouncing off a wall hands it a momentum 2mv, and faster molecules also hit more often. So the pressure grows with the number of molecules per volume and with mv². Temperature measures the average kinetic energy per molecule.',
  'Counting momentum gives pV = ⅓Nm⟨c²⟩. Combined with pV = NkT, that gives ½m⟨c²⟩ = (3/2)kT: temperature is average translational kinetic energy in disguise.',
  'For nitrogen at 300 K, c_rms = √(3kT/m) = √(3 × 1.38 × 10⁻²³ × 300 / (28 × 1.66 × 10⁻²⁷)) ≈ 520 m/s. Sound, at 340 m/s, is a little slower than the molecules that carry it, as it must be.',
  'Real gases deviate at high pressure and low temperature, because molecules attract and take up room (van der Waals), and rotations and vibrations also hold energy, which sets the heat capacity.'
]);
WL.fy('al-induction', [
  'Drop a strong magnet down a copper pipe and it drifts down slowly, as if through honey, though copper is not magnetic.',
  'The falling magnet changes the magnetic flux through each ring of the pipe, which drives currents round the pipe: **eddy currents**. By Lenz’s law their magnetic fields oppose the change, and they push back on the magnet.',
  'ε = −N dΦ/dt. The eddy currents heat the pipe, and that energy comes from the magnet’s fall. The faster it falls, the bigger the currents and the braking, so it settles at a terminal speed where the braking force equals its weight.',
  'A strong neodymium magnet in a thick copper pipe falls at a few centimetres a second, taking several seconds to pass through 30 cm instead of the quarter of a second free fall would take.',
  'The exact braking depends on the magnet’s field, the pipe’s conductivity and the wall thickness, which needs a full calculation; aluminium, a poorer conductor, brakes less.'
]);
WL.fy('al-interference', [
  'Shine a laser through two slits a fraction of a millimetre apart and you get a row of bright and dark stripes, not two bright lines. Opening a second slit makes some places darker.',
  'Waves from the two slits overlap. Where crest meets crest they add (bright); where crest meets trough they cancel (dark). What decides it is the **path difference**: a whole number of wavelengths gives a bright fringe.',
  'Bright fringes satisfy d sin θ = nλ, so for small angles the spacing on a screen a distance D away is w = λD/d. Darkness appearing where there was light shows that light is a wave: particles from two slits could only add up.',
  'Red laser light (λ = 650 nm), slits 0.25 mm apart, screen 2 m away: w = 650 × 10⁻⁹ × 2 / 0.25 × 10⁻³ ≈ 5.2 mm.',
  'The two slits must be lit by the same wave (coherence). And when light is detected photon by photon, the stripes still build up, which the wave picture alone cannot explain.'
]);
WL.fy('al-kinematics', [
  'A ball thrown straight up takes as long to come down as to go up, and returns to your hand at the speed it left.',
  'With constant acceleration the velocity–time graph is a straight line. The ball’s velocity falls steadily through zero at the top and on to minus its starting value; the areas above and below the axis are equal, so it ends where it started.',
  'v = u + at, and the displacement is the area under the v–t graph, s = ut + ½at². At the top v = 0, so t_up = u/g. The motion is symmetric because the equations are unchanged if time runs backwards with u and v swapped and reversed.',
  'Thrown at 15 m/s, the ball rises for 15/9.8 ≈ 1.5 s to a height u²/2g = 225/19.6 ≈ 11.5 m, and is back after 3.1 s, moving at 15 m/s downwards.',
  'Air resistance breaks the symmetry: the ball comes down more slowly than it went up, and the descent takes longer than the climb.'
]);
WL.fy('al-materials', [
  'A thin steel guitar string holds a tension of about 70 N and stretches only a few millimetres along its whole length, while a rubber band the same thickness doubles its length under a few newtons.',
  '**Stress**, force per area, is what the material feels at each point; **strain**, the fractional stretch, is how it responds. Their ratio, the **Young modulus**, belongs to the material, not the object: steel’s bonds are about a hundred thousand times stiffer than rubber’s tangled chains.',
  'Dividing by area and length removes the object’s size. A rod twice as thick has twice as many bonds sharing the load; a rod twice as long has twice as many bonds in a row, each stretching the same. So E = σ/ε measures the stiffness of the bonds themselves.',
  'Steel has E ≈ 200 GPa. A 1 mm diameter wire, 2 m long, holding 50 kg: σ = 490 / 7.85 × 10⁻⁷ ≈ 6.2 × 10⁸ Pa, strain 3.1 × 10⁻³, so it stretches about 6 mm.',
  'Beyond the elastic limit metals flow plastically as defects move through them. And rubber’s stiffness comes from entropy, its chains uncoiling, not from stretched bonds, which is why rubber gets stiffer when heated.'
]);
WL.fy('al-medical', [
  'An X-ray shows the bones but barely shows the heart; ultrasound shows the heart beating but cannot see through bone.',
  'X-rays are absorbed according to the atoms in their way: calcium in bone absorbs strongly, the light atoms of soft tissue weakly. Ultrasound reflects where the **acoustic impedance** changes; bone and air reflect almost all of it, and boundaries between soft tissues reflect a little, enough to make an image.',
  'X-ray absorption by the photoelectric effect rises steeply with atomic number, roughly as Z³, so calcium (Z = 20) stands out against carbon, oxygen and hydrogen. For ultrasound the reflected fraction is ((Z₂ − Z₁)/(Z₂ + Z₁))², so big mismatches reflect strongly.',
  'Soft tissue to bone (impedances about 1.6 and 7.8 × 10⁶ kg m⁻² s⁻¹): R = (6.2/9.4)² ≈ 0.43. Soft tissue to air: R ≈ 0.999. Between two soft tissues (1.6 and 1.7): R ≈ 0.001, small but detectable.',
  'CT builds a three-dimensional map from X-rays taken at many angles, and PET relies on positrons annihilating into two back-to-back gamma rays. Dose matters: one CT scan gives several millisieverts, years of natural background.'
]);
WL.fy('al-momentum', [
  'Pull back two balls of a Newton’s cradle and two fly off the far end, never one ball at twice the speed.',
  'Every collision conserves momentum; an **elastic** one conserves kinetic energy as well. One ball at 2v would carry the right momentum, 2mv, but twice the kinetic energy: ½m(2v)² = 2mv², against 2 × ½mv² = mv². Only two balls at v satisfy both.',
  'Momentum conservation follows from Newton’s third law (internal forces cancel in pairs), and more deeply from space being the same everywhere. Kinetic energy is conserved only if nothing is permanently deformed and no heat or sound is made.',
  'Two 0.1 kg balls at 1 m/s carry 0.2 kg m/s and 0.1 J. One ball at 2 m/s would carry 0.2 kg m/s too, but 0.2 J: twice the energy available.',
  'Real cradles are not perfectly elastic and the balls are not perfectly rigid: the push travels through the row as a compression wave, and the cradle eventually settles with all the balls swinging together.'
]);
WL.fy('al-nuclear', [
  'Splitting one uranium-235 nucleus releases about 200 MeV; burning one carbon atom releases about 4 eV, fifty million times less.',
  'Nucleons are held by the strong force, which is very strong but short-ranged, and a nucleus weighs less than its separate parts by its **binding energy**/c². Iron and nickel are the most tightly bound per nucleon, so splitting heavy nuclei or fusing light ones, moving towards iron, releases energy.',
  'A nucleon deep inside a nucleus is surrounded and fully bound, while surface nucleons are less bound; in large nuclei the protons’ long-range repulsion grows roughly as Z². The balance between the two makes the binding energy per nucleon peak near mass number 56 to 62.',
  'U-235 has about 7.6 MeV per nucleon and its fission fragments about 8.5 MeV: (8.5 − 7.6) × 235 ≈ 210 MeV per fission. One kilogram, 2.6 × 10²⁴ nuclei, gives about 8 × 10¹³ J, as much as burning about 2700 tonnes of coal.',
  'The binding-energy curve explains the energy released, not stability: whether a nucleus actually decays depends on its specific neighbours and on quantum barriers, which is why U-235 hardly ever fissions on its own.'
]);
WL.fy('al-particles', [
  'A free neutron lives about 15 minutes before turning into a proton, an electron and an antineutrino. A proton, as far as anyone can tell, never decays.',
  'Protons and neutrons are made of quarks: uud and udd. In beta decay a down quark turns into an up quark through the **weak interaction**, emitting a W⁻ boson that becomes an electron and an antineutrino. The proton is the lightest particle made of three quarks, so it has nothing lighter to decay into.',
  'Conservation laws decide what can happen: charge, energy, baryon number and lepton number. The neutron is heavier than a proton plus an electron, so its decay is allowed; the proton has no lighter baryon to become, so baryon-number conservation keeps it stable.',
  'm_n − m_p − m_e = 939.57 − 938.27 − 0.51 ≈ 0.78 MeV: the energy shared out as the products’ kinetic energy.',
  'Some theories predict that protons decay with lifetimes above 10³⁴ years, and experiments have not seen it. The Standard Model also leaves out gravity and does not explain dark matter.'
]);
WL.fy('al-photoelectric', [
  'Red light, however bright, never knocks electrons out of zinc. Faint ultraviolet light does, instantly.',
  'Light arrives in packets, **photons**, of energy hf, and one photon gives all its energy to one electron. If hf is less than the **work function** φ, that electron cannot escape, however many photons arrive.',
  'If light were a smooth wave, bright enough light would eventually give any electron enough energy, after a delay. Instead the fastest ejected electrons have E_k = hf − φ, depending only on the frequency: a straight line of slope h, as Millikan measured.',
  'Zinc’s work function is about 4.3 eV, so the threshold wavelength is hc/φ ≈ 1240 eV nm / 4.3 eV ≈ 290 nm, in the ultraviolet. Red light at 650 nm carries only 1.9 eV per photon.',
  'The detailed rate and direction of emission depend on the metal’s band structure, and the photon picture alone does not explain interference, which needs the wave description too.'
]);
WL.fy('al-photons', [
  'Electrons fired at a crystal make a diffraction pattern, just as X-rays do. Things we call particles can interfere.',
  'Every particle has a wavelength λ = h/p, the **de Broglie wavelength**. For electrons of modest energy it is about the spacing of atoms in a crystal, so crystals diffract them. Light, which we picture as a wave, arrives in photons, each with momentum p = h/λ.',
  'Energy and momentum are tied to frequency and wavelength in the same way for light and for matter: E = hf and p = h/λ. For light, relativity links E and p (E = pc); de Broglie guessed that p = h/λ holds for matter too, and Davisson and Germer confirmed it.',
  'An electron accelerated through 100 V has p = √(2meV) ≈ 5.4 × 10⁻²⁴ kg m/s, so λ = 6.63 × 10⁻³⁴ / 5.4 × 10⁻²⁴ ≈ 0.12 nm: about the spacing of atoms.',
  '"Wave" and "particle" are both everyday pictures. Quantum mechanics replaces them with a probability amplitude, and neither picture on its own gives all the results.'
]);
WL.fy('al-polarisation', [
  'Polarising sunglasses cut the glare from water and wet roads. Turn them through 90° and the glare comes back.',
  'Light is a **transverse** wave: its electric field oscillates across the direction of travel. A polariser lets through only the part of the field along one axis. Light reflected from water is largely polarised horizontally, so lenses that pass only vertical vibrations block it.',
  'Only transverse waves can be polarised: a longitudinal wave such as sound has no sideways direction to choose. Malus’s law, I = I₀ cos²θ, follows because the field along the axis is E cos θ and the intensity goes as E².',
  'Two polarisers at 60° to each other pass cos² 60° = 25 % of polarised light; unpolarised light also loses half at the first, so 12.5 % gets through overall.',
  'Reflected light is completely polarised only at Brewster’s angle, about 53° for water; at other angles it is partly polarised, so sunglasses reduce glare rather than remove it.'
]);
WL.fy('al-potential-divider', [
  'A thermostat switches a heater on and off at a set temperature using a thermistor, and turning a knob changes the temperature it switches at.',
  'Two resistances in series share the voltage in proportion to their sizes. A thermistor’s resistance falls steeply as it warms, so its share of the voltage falls, and a comparator switches when that share crosses a reference. The knob is a variable resistor that moves the crossing point.',
  'V_out = V_in R₂/(R₁ + R₂), because the same current flows through both. The output changes fastest with temperature when the two resistances are about equal near the switching point.',
  'A thermistor of 10 kΩ at 25 °C might fall to 4 kΩ at 50 °C. With a fixed 10 kΩ resistor and 5 V, the voltage across the thermistor falls from 2.5 V to 5 × 4/14 ≈ 1.4 V.',
  'Whatever reads the output draws current, and a low-resistance load pulls the output down. Thermistors also warm themselves when current flows through them.'
]);
WL.fy('al-projectile', [
  'A bullet fired horizontally and a bullet dropped from the same height at the same moment hit the ground together, if air resistance is ignored.',
  'Horizontal and vertical motions are independent. Gravity acts only vertically, so the horizontal speed stays constant while the vertical motion is exactly free fall.',
  'Newton’s second law works component by component: F_x = 0 gives a constant v_x, and F_y = −mg gives free fall. Put together, the path is a parabola, y = x tan θ − gx²/(2v² cos²θ).',
  'On level ground the range is R = v² sin 2θ/g, largest at 45°. A ball kicked at 25 m/s can reach at most 625/9.8 ≈ 64 m.',
  'Air resistance shortens the range and lowers the best angle, often to 35° to 40° for balls, and spin adds lift (the Magnus effect).'
]);
WL.fy('al-resistivity', [
  'A long, thin wire has more resistance than a short, thick one of the same metal, and a filament lamp’s current does not rise in proportion to the voltage.',
  'Resistance depends on the material’s **resistivity**, the length and the cross-section: R = ρL/A. Electrons scatter off vibrating ions and defects; a longer wire means more scattering on the way, a wider one more paths side by side. Hotter metals scatter more.',
  'Resistances in series add, so R grows with length; conductances in parallel add, so R falls with area. A metal’s resistivity rises with temperature because its lattice vibrates harder, and a filament heats as the voltage rises, so its I–V graph curves.',
  'Copper has ρ = 1.7 × 10⁻⁸ Ω m, so 10 m of 1 mm² wire has R = 1.7 × 10⁻⁸ × 10 / 10⁻⁶ = 0.17 Ω. A tungsten filament at 2800 K has about 15 times its cold resistance.',
  'Ohm’s law is not a law of nature: diodes, lamps and semiconductors do not obey it, and at very low temperatures some metals become superconductors with no resistance at all.'
]);
WL.fy('al-shm', [
  'A pendulum clock keeps time whether its swing is wide or narrow, and a mass on a spring bounces with the same period however far you pull it.',
  '**Simple harmonic motion** happens whenever the restoring force is proportional to the displacement. A larger displacement means a larger force and faster motion, which exactly makes up for the longer distance, so the period stays the same.',
  'a = −ω²x has the solution x = A cos(ωt + φ), with period 2π/ω and no A in it. For a spring ω² = k/m; for a pendulum ω² = g/L, for small angles, because then sin θ ≈ θ.',
  'A 1 m pendulum has T = 2π√(1/9.8) ≈ 2.0 s; a "seconds pendulum", beating once a second, is about 99 cm long. A 0.5 kg mass on a 20 N/m spring has T = 2π√(0.5/20) ≈ 1.0 s.',
  'For large swings the pendulum’s restoring force is no longer proportional (sin θ ≠ θ) and the period grows, by about 7 % at a 60° amplitude; and damping slowly shrinks the swing.'
]);
WL.fy('al-spectra', [
  'Sodium street lamps glow a single orange-yellow, and heated hydrogen shows only a few sharp colours, the same in a lab and in the most distant galaxies.',
  'Electrons in atoms can only have certain energies. When an electron drops from one level to a lower one it emits a photon carrying exactly the difference, which gives a sharp line. Each element has its own levels, and so its own fingerprint of lines.',
  'The electron is a wave held in by the nucleus’s pull, and only certain standing-wave patterns fit, giving separate energies, like the notes of a string. Each photon has hf = ΔE, so separate levels give separate colours.',
  'Hydrogen’s levels are E_n = −13.6/n² eV. The red Balmer line, n = 3 → 2, has ΔE = 13.6 × (1/4 − 1/9) ≈ 1.89 eV, so λ = 1240/1.89 ≈ 656 nm.',
  'Lines are not infinitely sharp: the level lifetimes, the atoms’ motion and collisions all broaden them. And the simple formula works only for hydrogen; atoms with many electrons need full quantum calculations.'
]);
WL.fy('al-stationary', [
  'Pluck a guitar string and it sounds a definite note; touch it lightly at its midpoint and the note jumps up an octave.',
  'Waves travelling both ways along the string reflect at the fixed ends and overlap, forming a **stationary wave**, with points that never move (nodes) and points that swing most (antinodes). Only wavelengths that fit a whole number of half-wavelengths between the ends survive. Touching the midpoint forces a node there, killing the fundamental and leaving the second harmonic.',
  'The fixed ends must be nodes, so L = nλ/2 and f_n = nv/2L. The wave speed is v = √(T/μ), set by the tension and the mass per metre.',
  'A guitar’s top E string: L = 0.65 m and f = 330 Hz give v = 2Lf ≈ 430 m/s. With μ ≈ 0.4 g/m, the tension is T = μv² ≈ 0.0004 × 430² ≈ 74 N.',
  'Real strings are slightly stiff, so their overtones are a little sharp of exact multiples, and most of the sound is radiated by the guitar’s body, not the string.'
]);
WL.fy('al-temperature', [
  'A thermometer in a glass of ice water reads 0 °C. Warm it gently and the reading stays at 0 °C until the last ice has melted.',
  'Temperature reflects the average kinetic energy of the particles. While ice melts, the energy supplied goes into breaking the solid’s structure, the **latent heat**, not into speeding the particles up.',
  'Two bodies in contact end up at the same temperature (the zeroth law), which is what makes thermometers possible. The kelvin scale starts at absolute zero: the pressure of a gas at constant volume, extended downwards, reaches zero at −273.15 °C.',
  'Melting 1 kg of ice takes 334 kJ, enough to warm 1 kg of water by 334/4.2 ≈ 80 °C. That is why a few ice cubes cool a drink so well.',
  'At very low temperatures quantum effects take over (particles never stop completely), and temperature is defined more carefully through entropy than through kinetic energy.'
]);
WL.fy('al-thermodynamics', [
  'Pump up a bicycle tyre and the pump gets hot; let air out of the tyre and the valve feels cold.',
  'Squashing a gas does work on it, which raises its **internal energy**: the molecules speed up, and the gas warms. When a gas expands and pushes on its surroundings, it does work and cools.',
  'The first law: ΔU = Q + W, the heat put in plus the work done on the gas. In a quick compression or expansion there is no time for heat to flow (adiabatic, Q = 0), so ΔU = W. For an ideal gas U depends only on T.',
  'Compressing air (γ = 1.4) quickly to half its volume from 300 K gives T = 300 × 2^0.4 ≈ 396 K, nearly 100 °C hotter. A diesel engine compresses about 18 to 1, reaching 300 × 18^0.4 ≈ 950 K, hot enough to ignite the fuel without a spark.',
  'Real pumps are not perfectly adiabatic, and much of a pump’s warmth comes from friction. The first law also says nothing about which way processes go; that is the second law.'
]);
WL.fy('al-units', [
  'In 1999 NASA lost the Mars Climate Orbiter because one team’s software gave impulse in pound-force seconds while another expected newton seconds.',
  'Every physical quantity is a number times a unit, and equations must balance in units as well as in numbers. Checking dimensions catches many mistakes, and can even predict how quantities depend on each other.',
  'Laws of physics cannot depend on our arbitrary choice of units, so both sides of an equation must have the same dimensions. A pendulum’s period can depend on L and g only as √(L/g), because that is the only combination with the dimensions of time.',
  'One pound-force second is 4.45 N s, so the orbiter’s small thruster impulses were wrong by a factor of about 4.45.',
  'Dimensional analysis cannot find pure numbers, such as the 2π in the pendulum’s period, and how uncertainties combine depends on whether the errors are independent.'
]);
WL.fy('al-waves', [
  'Sound from a small source gets quieter with distance, to a quarter each time you double the distance, while a laser beam stays bright across a room.',
  'A spreading wave carries its power over an ever larger area. From a point, the area of a sphere grows as r², so the **intensity**, power per area, falls as 1/r². A laser beam hardly spreads, so its intensity hardly falls.',
  'Energy conservation: the same power P crosses every sphere round the source, so I = P/(4πr²). Intensity is proportional to amplitude squared, so the amplitude falls as 1/r.',
  'A 1 W point source of sound gives I = 1/(4π × 100) ≈ 8 × 10⁻⁴ W/m² at 10 m, about 89 dB; at 20 m it is 6 dB lower, 83 dB.',
  'Real sources are not points, real air absorbs (high frequencies more), and close to the source or indoors, reflections change the pattern.'
]);
})();
