/* Geodesic: "See it like Feynman" sections, y1. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('y1-angular-momentum', [
  'Hold a spinning bicycle wheel by one end of its axle and it does not fall: it swings slowly round in a horizontal circle. A skater pulling in her arms spins faster.',
  '**Angular momentum** L is a vector along the spin axis, and a torque changes L in the direction of the torque. Gravity on the overhanging wheel gives a horizontal torque, so L, and with it the axle, swings sideways instead of down: **precession**. With no torque L stays fixed, so pulling mass inwards makes the spin speed up.',
  'τ = dL/dt follows from Newton’s second law applied to every particle and summed. For the skater L = Iω is constant and I falls with the square of her arms’ radius, so ω rises. The precession rate is Ω = τ/L: the faster the spin, the slower the precession.',
  'A wheel with I = 0.1 kg m² spinning at 30 rad/s has L = 3 kg m²/s. Its 20 N weight acting 0.15 m from the support gives τ = 3 N m, so Ω = 1 rad/s: one slow circle every 6 seconds.',
  'The simple formula assumes the spin’s angular momentum dwarfs the precession’s own; otherwise the axle also nods (nutation). And the skater’s kinetic energy rises: she does work pulling her arms in.'
]);
WL.fy('y1-coupled', [
  'Hang two pendulums from a slack string and start one swinging. Its swing slowly dies while the other’s grows, then the energy flows back, again and again.',
  'The pair has two special patterns of motion, its **normal modes**: both swinging together, and swinging opposite, each with its own frequency. Any motion is a mixture of the two. Starting one pendulum starts both modes equally, and their slightly different frequencies make them drift in and out of step: beats.',
  'For linear coupled oscillators the equations separate in the right coordinates, here the sum and the difference of the two displacements. Each mode is then a simple harmonic oscillator, and superposition does the rest.',
  'If the two modes have frequencies 1.00 Hz and 1.05 Hz, the beat period is 1/0.05 = 20 s: all the energy passes from one pendulum to the other in 10 s and back in another 10.',
  'Damping and nonlinear coupling spoil the clean exchange. In molecules and crystals the same idea with N masses gives N modes: vibrational spectra and phonons.'
]);
WL.fy('y1-entropy', [
  'An ice cube melts in a warm drink and never the reverse; a dropped egg never reassembles. Yet Newton’s laws work just as well run backwards.',
  '**Entropy** counts the microscopic arrangements that look the same to us: S = k ln W. Systems drift towards states with overwhelmingly more arrangements simply because those are overwhelmingly more likely, and for large systems "overwhelmingly" means certain in practice.',
  'When two systems share energy, the number of arrangements of the pair is W₁W₂. The most likely sharing makes ∂ln W/∂E equal on both sides, which is what equal temperature means: 1/T = ∂S/∂E. Heat Q flowing from hot to cold raises the total entropy, because the cold body gains Q/T_c, more than the Q/T_h the hot body loses.',
  'Melting 10 g of ice (3340 J) into a drink at 20 °C: the ice gains 3340/273 ≈ 12.2 J/K, the drink loses about 3340/293 ≈ 11.4 J/K, a net gain of 0.8 J/K. The number of arrangements grows by a factor of e^(0.8/1.38 × 10⁻²³) = e^(5.8 × 10²²); the reverse will never be seen.',
  'Why the universe began in such a low-entropy state, which is what gives time its direction, is not explained by the second law itself.'
]);
WL.fy('y1-faraday', [
  'Switch off a circuit containing a large coil and a spark jumps across the switch. An LC circuit rings at one definite frequency, the heart of every radio tuner.',
  'A coil resists changes in its own current: when the current falls, the collapsing magnetic field induces an e.m.f. that tries to keep it flowing (**self-inductance**). In an LC circuit, energy sloshes back and forth between the capacitor’s electric field and the coil’s magnetic field.',
  'ε = −L dI/dt. Round the LC loop, Q/C = −L d²Q/dt², which is the simple harmonic equation with ω = 1/√(LC). Breaking a current quickly makes dI/dt huge, hence the spark.',
  'A tuner with L = 1 μH and C = 100 pF resonates at f = 1/(2π√(10⁻¹⁶)) ≈ 16 MHz. A 1 H coil carrying 1 A, broken in 1 ms, gives an e.m.f. of about 1000 V.',
  'Real circuits have resistance, so the oscillations die away (and radiate a little), and at high frequencies the wires’ own capacitance and inductance matter.'
]);
WL.fy('y1-fluids', [
  'Blow between two sheets of paper hanging close together and they move together, not apart.',
  'In a flowing fluid, faster flow means lower pressure (along a streamline, in steady flow without viscosity). The air between the sheets moves fast, so its pressure falls below that of the still air outside, which pushes the sheets together.',
  'Bernoulli’s equation, p + ½ρv² + ρgh = constant along a streamline, is energy conservation per unit volume: pressure differences do work that speeds the fluid up or slows it down.',
  'Air at 10 m/s has a pressure ½ × 1.2 × 10² = 60 Pa lower than still air. On an A4 sheet (0.06 m²) that is about 3.6 N, far more than the sheet’s weight of 0.05 N.',
  'Bernoulli holds along a streamline in steady flow without viscosity, and it is often misused for wings (the "equal transit time" myth). Real lift needs the air to be turned, and viscosity, through the boundary layer, is what makes the flow follow the wing.'
]);
WL.fy('y1-gauss', [
  'The electric field inside a charged metal shell is exactly zero, and outside a charged sphere the field is just as if all the charge sat at its centre.',
  'Field lines start on positive charges and end on negative ones, and the number crossing any closed surface, the **flux**, counts the net charge inside. When there is enough symmetry, that count fixes the field.',
  'Because the field falls as 1/r² while the area of a sphere grows as r², the flux through any sphere round a charge is the same, q/ε₀. Any closed surface can be built from bits of spheres, which gives **Gauss’s law** for every shape.',
  'The Earth’s fair-weather field near the ground is about 100 V/m, pointing down. Gauss’s law gives the surface charge, σ = ε₀E ≈ 9 × 10⁻¹⁰ C/m², and over the whole Earth (5.1 × 10¹⁴ m²) about −5 × 10⁵ C.',
  'Gauss’s law is always true, but it gives the field directly only when symmetry lets you take E outside the integral; otherwise you need the full calculation.'
]);
WL.fy('y1-magnetostatics', [
  'Two parallel wires carrying currents in the same direction attract each other. Until 2019 this was how the ampere was defined.',
  'Each wire makes a magnetic field in circles round itself, and the moving charges in the other wire feel F = BIL in that field: attraction for currents in the same direction, repulsion for opposite ones.',
  '**Ampère’s law**: the line integral of B round a closed loop is μ₀ times the current through it. For a long straight wire, symmetry gives B = μ₀I/(2πr), so the force per metre on the second wire is μ₀I₁I₂/(2πd).',
  'Wires 1 m apart carrying 1 A each feel 2 × 10⁻⁷ N per metre, the old definition of the ampere. Busbars 10 cm apart carrying 10 kA each feel 200 N per metre, which is why they are clamped firmly.',
  'This form of Ampère’s law needs steady currents; when fields change, Maxwell’s displacement current must be added. And from a moving observer’s frame, part of the magnetic force between the wires becomes an electric force: relativity links the two.'
]);
WL.fy('y1-maxwell', [
  'A capacitor is a gap in a circuit, yet alternating current flows "through" it, and the magnetic field round the wires carries on round the gap between the plates.',
  'A changing electric field acts like a current as a source of magnetic field: the **displacement current**. With that addition, a changing E makes B and a changing B makes E, so the two can keep each other going as a travelling wave.',
  'Ampère’s law alone gives contradictory answers depending on which surface you choose: one cut by the wire, or one passing between the plates. Adding ε₀ dΦ_E/dt makes them agree, as charge conservation requires, and Maxwell’s four equations then predict waves at c = 1/√(μ₀ε₀).',
  '1/√(4π × 10⁻⁷ × 8.85 × 10⁻¹²) ≈ 3.00 × 10⁸ m/s: the speed of light, calculated from measurements on magnets and capacitors.',
  'Maxwell’s equations are classical, with no photons in them, and inside matter they need the effects of polarisation and magnetisation added.'
]);
WL.fy('y1-old-quantum', [
  'A blacksmith’s iron glows red, then orange, then white as it heats. Classical physics predicted instead that any hot body should blaze with unlimited ultraviolet energy: the "ultraviolet catastrophe".',
  'Planck assumed that each mode of light in a hot cavity can hold energy only in lumps of hf. High-frequency modes need big lumps, and at a given temperature they seldom get even one, so they are "frozen out" and the spectrum turns down at high frequencies.',
  'Classically every mode gets kT, and the number of modes grows as f², so the total diverges. With quanta, a mode’s average energy is hf/(e^(hf/kT) − 1): kT at low frequencies, but falling exponentially once hf ≫ kT, which makes the total finite and proportional to T⁴.',
  'At the Sun’s surface, 5800 K, kT ≈ 0.5 eV. A 3 eV ultraviolet mode has hf/kT = 6, so it holds about e⁻⁶ ≈ 1/400 of the classical expectation.',
  'Planck’s quanta were a patch on the theory; the full explanation came 25 years later with quantum mechanics, which also explains why matter, not just light, has separate energies.'
]);
WL.fy('y1-optics', [
  'Soap bubbles and oil on a wet road show swirling colours, though soap and oil are colourless.',
  'Light reflects from both the top and the bottom surface of a thin film, and the two reflected waves interfere: depending on the thickness and the wavelength, they reinforce or cancel. Each thickness picks out its own colours.',
  'The path difference is 2nt, plus half a wavelength from a phase flip at one surface, so a soap film in air reflects most strongly when 2nt = (m + ½)λ. As the thickness changes across the film, so does the colour; very thin regions look black, because there the half-wave flip makes the reflections cancel.',
  'A soap film (n ≈ 1.33) 300 nm thick has 2nt ≈ 800 nm, so it reflects most strongly at λ = 800/1.5 ≈ 530 nm: it looks green.',
  'Real films vary in thickness and drain as you watch, and the colour we see depends on how the eye responds to the whole mixture of reinforced and weakened wavelengths.'
]);
WL.fy('y1-oscillators', [
  'A car’s suspension stops bouncing after about one oscillation, while a good bell rings for many seconds. Both are damped oscillators; what differs is the amount of damping.',
  'Damping removes energy every cycle. Light damping gives many slowly dying cycles; **critical damping** returns to rest as fast as possible without overshooting (what a car suspension aims for); heavy damping creeps back slowly.',
  'mẍ + bẋ + kx = 0 has solutions e^(st) with s = −γ/2 ± √(γ²/4 − ω₀²), where γ = b/m. The sign under the square root decides: negative gives oscillation, zero gives critical damping (γ = 2ω₀), positive gives a slow overdamped return.',
  'One corner of a car, m = 300 kg on a 30 kN/m spring, has ω₀ = 10 rad/s, so critical damping needs b = 2mω₀ = 6000 N s/m. A bell ringing at 500 Hz for about ten seconds goes through 5000 cycles: its Q is in the thousands.',
  'Real dampers are not linear in velocity (they are tuned differently for bump and rebound), and dry friction gives a constant force, which makes oscillations die away in a straight line rather than exponentially.'
]);
WL.fy('y1-potential', [
  'Lightning conductors are pointed, and sparks jump from sharp corners first. A charged conductor’s charge crowds where its surface is most curved.',
  'The whole surface of a conductor is at one potential. Near a sharp point, a small radius of curvature at the same potential means a strong field, so the air breaks down there first.',
  'For a sphere of radius r, V = Q/(4πε₀r) and the field at its surface is E = V/r. Two spheres joined by a wire share the same V, so the small one has a much stronger field at its surface.',
  'Air breaks down at about 3 MV/m. A sphere of 1 cm radius sparks at about E × r = 30 kV; a needle tip of 0.1 mm radius sparks at only about 300 V.',
  'Real breakdown depends on humidity, pressure and the growth of electron avalanches over a distance, so E = V/r gives only the order of magnitude.'
]);
WL.fy('y1-qm-intro', [
  'Send electrons through two slits one at a time. Each lands as a single dot, yet after thousands of them the dots form interference stripes. Block one slit and the stripes vanish.',
  'Each electron is described by an **amplitude** that goes through both slits. The amplitudes for the two paths add, and the probability of landing at a point is the square of the total. The electron is detected in one place; the pattern lives in the probabilities.',
  'Probabilities do not add, amplitudes do. With amplitudes ψ₁ + ψ₂, P = |ψ₁|² + |ψ₂|² + 2 Re(ψ₁*ψ₂), and the last, cross term makes the stripes. Find out which slit each electron used and the cross term disappears.',
  'Electrons at 50 kV have λ ≈ 5.4 pm. Through slits 1 μm apart, the fringes are λ/d ≈ 5 × 10⁻⁶ rad apart, only 5 μm apart at a distance of 1 m, which is why electron interference needs electron optics to magnify it.',
  'No picture describes what happens during the flight: quantum mechanics predicts only the probabilities of the results.'
]);
WL.fy('y1-rel-dynamics', [
  'The LHC accelerates protons until they are just a few metres per second slower than light. Adding more energy then barely changes their speed; their energy and momentum grow without limit instead.',
  'Energy and momentum grow as γmc² and γmv, and γ grows without bound as v approaches c. Pushing harder raises γ, not v. And mass itself is a store of energy: mc² at rest.',
  'Momentum can be conserved in every frame only if p = γmv. Then E² = (pc)² + (mc²)²: the invariant length of the energy–momentum four-vector, the same for every observer.',
  'Protons at 6.8 TeV have γ = 6800/0.938 ≈ 7250, so v ≈ c(1 − 1/(2γ²)) = c(1 − 9.5 × 10⁻⁹): about 3 m/s slower than light.',
  '"Relativistic mass" (γm) is an old term; modern usage keeps m as the invariant mass. For massless particles E = pc exactly.'
]);
WL.fy('y1-rotation', [
  'Race a solid cylinder and a hollow pipe of the same mass and radius down a slope: the solid one always wins, whatever the mass.',
  'A rolling object shares its energy between moving along and spinning. The pipe has all its mass far from the axis, so more of its energy goes into spinning, leaving less for speed.',
  'mgh = ½mv² + ½Iω², with ω = v/r and I = kmr², gives v² = 2gh/(1 + k). Mass and radius cancel; only the shape factor k matters: ½ for a solid cylinder, 1 for a thin hoop, 2/5 for a solid ball.',
  'After a 1 m drop: a solid ball reaches √(19.6/1.4) ≈ 3.7 m/s, a solid cylinder √(19.6/1.5) ≈ 3.6 m/s, a hoop √(19.6/2) ≈ 3.1 m/s.',
  'Rolling without slipping needs friction (which does no net work in ideal rolling). On a steep or slippery slope objects slide, and real rolling loses some energy to squashing (rolling resistance).'
]);
WL.fy('y1-sr', [
  'Muons made by cosmic rays 15 km up live only 2.2 μs at rest; even at nearly the speed of light that is enough for about 660 m. Yet many reach the ground.',
  'The muons’ clocks run slow as we see them: in their own frame they still live 2.2 μs, but we see that stretched by γ. (In the muons’ frame, the atmosphere is squashed instead.)',
  'Picture a light clock moving sideways: in our frame its light travels a longer, diagonal path, at the same speed c, so each tick takes longer: Δt = γΔτ, with γ = 1/√(1 − v²/c²).',
  'At 0.995c, γ ≈ 10: the lifetime becomes 22 μs and the range about 6.6 km, so about e^(−15/6.6) ≈ 10 % of the muons survive 15 km.',
  'Time dilation is symmetric, each observer seeing the other’s clock run slow; the asymmetry in the twin paradox comes from the travelling twin changing frames.'
]);
WL.fy('y1-systems', [
  'A rocket speeds up in empty space with nothing to push against. And when a firework bursts in mid-flight, its pieces scatter but their centre of mass carries on along the same curve.',
  'The rocket throws mass backwards, and by momentum conservation it gains momentum forwards. In the firework, the internal forces cancel in pairs, so only gravity acts on the system as a whole: the **centre of mass** moves as if all the mass were there.',
  'Total momentum is P = Mv_cm, and dP/dt equals the external force. A rocket expelling mass at speed u relative to itself obeys M dv = −u dM, so Δv = u ln(M₀/M₁): the Tsiolkovsky rocket equation.',
  'With an exhaust speed of 3 km/s, reaching 9 km/s (orbit plus losses) needs ln(M₀/M₁) = 3, a mass ratio of e³ ≈ 20: 95 % of the rocket at launch must be propellant, which is why rockets have stages.',
  'Climbing through a gravity field and through air costs extra (gravity and drag losses), and real exhaust speeds change with altitude.'
]);
WL.fy('y1-thermo', [
  'A power station burning fuel at 800 K and dumping heat into a river at 300 K can never turn more than about 60 % of the heat into work, however clever its engineers.',
  'Heat is disordered energy. Turning it into ordered work needs a flow from hot to cold, and some heat must be dumped into the cold side to carry away the entropy.',
  'The entropy taken from the hot side, Q_h/T_h, must at least be delivered to the cold side: Q_c/T_c ≥ Q_h/T_h. So the efficiency W/Q_h = 1 − Q_c/Q_h can be at most 1 − T_c/T_h, the **Carnot limit**.',
  '1 − 300/800 ≈ 62 %. Real steam plants reach about 40 %, and combined-cycle gas plants, with a hotter T_h, about 60 %.',
  'The Carnot limit needs infinitely slow, reversible running, which gives no power. Run for maximum power, an engine manages roughly 1 − √(T_c/T_h), about 39 % here, close to real plants.'
]);
WL.fy('y1-wave-eq', [
  'A pulse sent along a rope keeps its shape as it travels, whether it is a hump, a square or a wiggle.',
  'Each small piece of rope is pulled by the tension from both sides. Where the rope is curved, the pulls do not balance and the piece accelerates. That one rule, acceleration proportional to curvature, makes any shape travel unchanged at speed √(T/μ).',
  'μ ∂²y/∂t² = T ∂²y/∂x². Any function f(x − vt) solves it with v² = T/μ, because the time derivatives give v²f″ and the space derivatives f″. The shape is kept because every wavelength travels at the same speed: there is no dispersion.',
  'A climbing rope (μ ≈ 0.07 kg/m) under 700 N of tension carries pulses at √(700/0.07) = 100 m/s.',
  'For large amplitudes, stiff strings or water waves, the speed depends on wavelength or amplitude, and pulses spread out or steepen.'
]);
WL.fy('y1-work-energy', [
  'Carry a suitcase upstairs and back down: gravity’s total work on it is zero. Push a box round a rough floor and back to where it started: friction’s total work is negative, whichever way you go.',
  'For some forces, such as gravity, springs and electric forces, the work done depends only on the start and end points: they are **conservative**, and each comes with a potential energy. Friction always opposes the motion, so it always takes energy out, and more for a longer path.',
  'The work–energy theorem, ∫F·dx = Δ(½mv²), comes straight from Newton’s second law. A force is conservative if its work round every closed loop is zero, which is the same as curl F = 0, and the same as F = −∇U.',
  'Pushing a 20 kg box (μ = 0.5) round a 10 m loop, friction does −μmg × 10 = −0.5 × 20 × 9.8 × 10 ≈ −980 J of work, all of it turned into heat.',
  'Magnetic forces do no work at all, yet cannot be written with an ordinary potential energy. And "conservative" depends on what you count: friction’s energy is not lost, just turned into heat.'
]);
})();
