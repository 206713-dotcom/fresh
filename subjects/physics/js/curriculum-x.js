/* Twistor — full curriculum map (2026-11 audit).
   Every point of the official Cambridge syllabuses (Lower Secondary Science 0893, IGCSE Physics 0625, AS & A Level Physics 9702,
   IGCSE Mathematics 0580, AS & A Level Mathematics 9709, Further Mathematics 9231) and the core physics/maths courses at
   MIT, Caltech and Stanford maps to a topic below. Topics without full content yet are outlines (stub: true). */
(function () {
  const WL = window.WL;
  const have = new Set([...WL.stubs.map((s) => s.id)]);
  const add = (stage, strand, rows) => rows.forEach(([id, title, summary, outline]) => { if (!have.has(id)) { WL.stubs.push({ id, stage, strand, title, summary, maths: [], outline, stub: true }); have.add(id); } });

  /* ---------------- KS3 · Cambridge Lower Secondary Science 0893 (Stages 7–9) ---------------- */
  add('ks3', 'M', [
    ['ks3-energy', 'Energy: Changes, Dissipation & Conservation', 'Energy is never made or destroyed, only moved around — and it always spreads out and becomes less useful.', ['Energy changes in events and processes', 'Dissipation: energy becoming less useful', 'Conservation of energy']],
    ['ks3-forces', 'Forces, Gravity & Air Resistance', 'Balanced forces keep motion steady; unbalanced forces change it. Gravity pulls masses together.', ['Gravity depends on mass', 'Balanced vs unbalanced forces', 'Air resistance, and why there is none in a vacuum']]
  ]);
  add('ks3', 'T', [
    ['ks3-density', 'Density, Floating & Sinking', 'Whether something floats depends on its density compared with the liquid, not on its weight.', ['Density = mass ÷ volume', 'Floating and sinking', 'Measuring density']],
    ['ks3-heat', 'Heat, Temperature & Thermal Transfer', 'Temperature is how hot; heat is energy on the move. It flows by conduction, convection and radiation.', ['Heat vs temperature', 'Conduction, convection, radiation', 'Cooling by evaporation']],
    ['ks3-climate', 'Atmosphere, Climate & Earth’s Cycles', 'The water and carbon cycles, the composition of air, and why climate is not weather.', ['Composition of clean air', 'Water and carbon cycles', 'Climate change: causes and impacts']]
  ]);
  add('ks3', 'W', [
    ['ks3-sound', 'Sound, Echoes & Waveforms', 'Sound is a vibration passed from particle to particle; it cannot cross a vacuum.', ['Sound needs a medium', 'Echoes', 'Loudness = amplitude, pitch = frequency', 'Waves reinforcing and cancelling']],
    ['ks3-colour', 'Dispersion & Colour', 'White light is a mixture of colours; filters subtract and surfaces absorb and reflect.', ['Dispersion by a prism', 'Adding and subtracting colours', 'Why objects look coloured']]
  ]);
  add('ks3', 'E', [
    ['ks3-parallel', 'Parallel Circuits, Voltage & Resistance', 'Current splits in parallel branches; resistance = voltage ÷ current.', ['Current divides in parallel', 'Measuring current and voltage', 'Resistance = V ÷ I']],
    ['ks3-magnets', 'Magnets & Electromagnets', 'Magnetic fields surround magnets and currents; electromagnets can be switched on and off.', ['Magnetic fields and forces', 'Making an electromagnet', 'What makes an electromagnet stronger', 'Earth’s magnetic field']]
  ]);
  add('ks3', 'S', [
    ['ks3-tides-eclipses', 'Tides & Eclipses', 'The Moon’s gravity raises tides; lining up the Sun, Earth and Moon makes eclipses.', ['Tides from Earth–Moon–Sun gravity', 'Solar and lunar eclipses']],
    ['ks3-solar-system', 'Stars, Galaxies & the Solar System', 'Planets condense from dust and gas; stars are born in nebulae; galaxies hold billions of stars.', ['Formation of planets', 'Asteroids and collisions', 'Galaxies and nebulae', 'How the Moon formed']],
    ['ks3-earth', 'Plate Tectonics & Earth’s Interior', 'Convection in the mantle drags tectonic plates, building mountains and causing earthquakes.', ['Lithosphere and mantle', 'Plate boundaries', 'Evidence for plate tectonics']]
  ]);

  /* ---------------- GCSE · Cambridge IGCSE Physics 0625 ---------------- */
  add('gcse', 'M', [
    ['gcse-measurement', 'Measurement, Scalars & Vectors', 'Measure lengths, volumes and times precisely, and combine vectors at right angles.', ['Rulers, cylinders and timers', 'Measuring multiples to cut error', 'Scalars vs vectors', 'Resultant of perpendicular vectors']],
    ['gcse-mass-weight', 'Mass, Weight & Density', 'Mass is matter; weight is gravity’s pull on it; density is mass per volume.', ['W = mg', 'Density = m ÷ V', 'Density of irregular objects by displacement', 'Floating liquids']],
    ['gcse-forces', 'Forces, Hooke’s Law & F = ma', 'Forces change shape and motion: springs stretch, friction heats, resultant force accelerates.', ['Load–extension and Hooke’s law', 'Resultant force', 'Friction and drag', 'F = ma', 'Circular motion (qualitative)']],
    ['gcse-moments', 'Moments, Equilibrium & Centre of Gravity', 'Turning effects balance when clockwise moments equal anticlockwise moments.', ['Moment = F × d', 'Principle of moments', 'Centre of gravity and stability']],
    ['gcse-work-power', 'Work, Power & Efficiency', 'Work is energy transferred by a force; power is how fast; efficiency is how much is useful.', ['W = Fd', 'P = W ÷ t', 'Efficiency and Sankey diagrams']],
    ['gcse-resources', 'Energy Resources', 'Fossil, nuclear and renewable sources: how each makes electricity and what it costs the planet.', ['Turbines and generators', 'Renewable vs non-renewable', 'The Sun as the source of most energy', 'Fusion research']],
    ['gcse-pressure', 'Pressure in Solids & Liquids', 'Pressure is force per area; in liquids it grows with depth and density.', ['p = F ÷ A', 'Liquid pressure and depth', 'Δp = ρgΔh']]
  ]);
  add('gcse', 'T', [
    ['gcse-particles', 'Kinetic Particle Model & Gas Pressure', 'States of matter, Brownian motion, absolute zero and why squeezing a gas raises its pressure.', ['States and changes of state', 'Brownian motion', 'Kelvin scale and absolute zero', 'pV = constant']],
    ['gcse-expansion', 'Thermal Expansion', 'Solids, liquids and gases expand on heating — gases most — with real consequences for bridges and thermometers.', ['Relative expansion', 'Everyday applications', 'Particle explanation']],
    ['gcse-heat-transfer', 'Conduction, Convection & Radiation', 'Three routes for thermal energy, and how Earth’s temperature balances incoming and outgoing radiation.', ['Conduction in metals and non-metals', 'Convection currents', 'Infrared emission and absorption', 'Earth’s energy balance']]
  ]);
  add('gcse', 'W', [
    ['gcse-waves', 'Wave Properties', 'Waves carry energy, not matter: transverse vs longitudinal, and reflection, refraction and diffraction in a ripple tank.', ['v = fλ', 'Transverse and longitudinal', 'Reflection, refraction, diffraction', 'Gap width and diffraction']],
    ['gcse-reflection-refraction', 'Reflection, Refraction & Total Internal Reflection', 'Plane-mirror images, Snell’s law, the critical angle and optical fibres.', ['Plane mirror images', 'n = sin i ÷ sin r', 'Critical angle and TIR', 'Optical fibres']],
    ['gcse-lenses', 'Thin Lenses & Ray Diagrams', 'Converging and diverging lenses, real and virtual images, magnifying glasses and glasses for eyes.', ['Focal length and principal focus', 'Ray diagrams', 'Real vs virtual images', 'Correcting long and short sight']],
    ['gcse-sound', 'Sound & Ultrasound', 'Compressions and rarefactions, the speed of sound, echoes and ultrasound scanning.', ['Longitudinal sound waves', 'Measuring the speed of sound', 'Loudness and pitch', 'Ultrasound uses']]
  ]);
  add('gcse', 'E', [
    ['gcse-static', 'Electric Charge & Electric Fields', 'Charging by friction moves electrons; fields show where charges feel forces.', ['Attraction and repulsion', 'Conductors and insulators', 'Electric field patterns']],
    ['gcse-current-pd', 'Current, EMF & Potential Difference', 'Current is charge per second; e.m.f. and p.d. are energy per unit charge.', ['I = Q ÷ t', 'a.c. vs d.c.', 'E = W ÷ Q and V = W ÷ Q', 'Ammeters and voltmeters']],
    ['gcse-power-cost', 'Electrical Power & Energy Cost', 'P = IV, E = IVt, and the kilowatt-hour on your electricity bill.', ['P = IV', 'E = IVt', 'kWh and cost']],
    ['gcse-series-parallel', 'Series & Parallel Circuits', 'Current is shared in parallel and the same in series; potential dividers split voltage.', ['Combined resistance', 'Junction rule', 'Potential dividers', 'Sensors: LDRs and thermistors']],
    ['gcse-safety', 'Electrical Safety & the Mains', 'Live, neutral and earth; fuses, trip switches and double insulation.', ['Hazards', 'Live, neutral, earth', 'Fuses and trip switches', 'Earthing and double insulation']],
    ['gcse-electromagnets', 'Magnetic Effect of a Current', 'A current makes a magnetic field: straight wires, solenoids and electromagnets.', ['Field around a wire', 'Solenoids', 'Uses of electromagnets']],
    ['gcse-motor', 'The d.c. Motor', 'A coil in a field turns; the split-ring commutator keeps it turning one way.', ['Turning effect on a coil', 'Commutator and brushes', 'Making it turn faster']],
    ['gcse-induction', 'Electromagnetic Induction & the a.c. Generator', 'Moving a conductor through a field induces an e.m.f.; a spinning coil makes alternating current.', ['Inducing an e.m.f.', 'Factors affecting size', 'Lenz’s law', 'The a.c. generator']],
    ['gcse-transformer', 'Transformers & Power Transmission', 'Changing voltage with coils on an iron core — and why the grid uses very high voltages.', ['Vp/Vs = Np/Ns', 'VpIp = VsIs', 'Power loss P = I²R']]
  ]);
  add('gcse', 'Q', [
    ['gcse-atom', 'The Nuclear Atom, Isotopes, Fission & Fusion', 'Rutherford’s alpha-scattering, proton and nucleon numbers, isotopes, and splitting and joining nuclei.', ['Alpha-particle scattering', 'Nuclide notation', 'Isotopes', 'Fission and fusion']],
    ['gcse-radiation', 'α, β, γ: Detection, Properties & Safety', 'Background radiation, the three types of emission, how they ionise and penetrate, and staying safe.', ['Background radiation', 'Ionising and penetrating power', 'Deflection in fields', 'Time, distance, shielding']]
  ]);
  add('gcse', 'S', [
    ['gcse-earth-moon', 'Day, Night, Seasons & the Moon', 'Earth’s spin, its tilted orbit and the Moon’s orbit explain days, seasons and phases.', ['Rotation and day/night', 'Tilt and seasons', 'Lunar phases', 'v = 2πr ÷ T']],
    ['gcse-solar-system', 'The Solar System & Orbits', 'Eight planets on elliptical orbits held by the Sun’s gravity; faster when closer.', ['Inner and outer planets', 'Gravitational field strength', 'Elliptical orbits', 'Light travel times']],
    ['gcse-stars', 'The Sun & the Life Cycle of Stars', 'Stars are powered by fusion and evolve to white dwarfs, neutron stars or black holes.', ['The Sun as a star', 'Fusion in stars', 'Stellar life cycle', 'Light-years']]
  ]);

  /* ---------------- A Level · Cambridge AS & A Level Physics 9702 ---------------- */
  add('alevel', 'M', [
    ['al-units', 'Units, Uncertainties & Vectors', 'SI base units, homogeneity, errors and uncertainties, and resolving vectors.', ['SI base units and prefixes', 'Systematic vs random error', 'Combining uncertainties', 'Resolving vectors']],
    ['al-kinematics', 'Kinematics: Deriving the SUVAT Equations', 'From the definitions of velocity and acceleration to the equations of uniform acceleration, with free fall.', ['Displacement, velocity, acceleration', 'Graphs: gradients and areas', 'Deriving SUVAT', 'Measuring g']],
    ['al-dynamics', 'Newton’s Laws, Drag & Terminal Velocity', 'Force as rate of change of momentum, Newton’s three laws, drag and terminal velocity.', ['F = Δp/Δt', 'Newton’s laws', 'Weight and mass', 'Air resistance and terminal velocity']],
    ['al-momentum', 'Momentum Conservation & Collisions', 'Elastic and inelastic collisions in one and two dimensions.', ['Conservation of momentum', 'Elastic collisions: relative speed', 'Inelastic collisions', '2D collisions']],
    ['al-equilibrium', 'Torque, Couples & Equilibrium', 'Moments, couples, the conditions for equilibrium and vector triangles.', ['Moments and torque of a couple', 'Principle of moments', 'Equilibrium conditions', 'Vector triangles']],
    ['al-fluids', 'Density, Pressure & Upthrust', 'Hydrostatic pressure Δp = ρgΔh and Archimedes’ principle from a pressure difference.', ['Δp = ρgΔh', 'Upthrust from pressure difference', 'Archimedes’ principle']],
    ['al-energy', 'Work, Energy & Power', 'Work done by a force, conservation of energy, efficiency, and P = Fv.', ['W = Fs cos θ', 'ΔEp = mgΔh, Ek = ½mv²', 'Efficiency', 'P = Fv']],
    ['al-materials', 'Stress, Strain & the Young Modulus', 'Hooke’s law, stress, strain, Young modulus and elastic potential energy.', ['Hooke’s law and k', 'Stress, strain, Young modulus', 'Elastic vs plastic', 'E = ½Fx']],
    ['al-damping', 'Damping, Forced Oscillations & Resonance', 'Light, critical and heavy damping; driving an oscillator near its natural frequency.', ['Damping regimes', 'Forced oscillations', 'Resonance']]
  ]);
  add('alevel', 'W', [
    ['al-waves', 'Progressive Waves & Intensity', 'Wave quantities, the oscilloscope, v = fλ and intensity ∝ amplitude².', ['Phase difference', 'Using an oscilloscope', 'v = fλ', 'Intensity ∝ A²']],
    ['al-doppler', 'The Doppler Effect', 'Why a passing siren changes pitch: f₀ = fv/(v ± vₛ).', ['Moving source, stationary observer', 'f₀ = fv/(v ± vₛ)']],
    ['al-polarisation', 'EM Spectrum & Polarisation', 'Wavelength ranges of the EM spectrum and Malus’s law for polarised light.', ['EM wavelength ranges', 'Polarisation', 'Malus’s law I = I₀cos²θ']],
    ['al-stationary', 'Stationary Waves & Diffraction', 'Nodes and antinodes on strings, in air columns and with microwaves; diffraction through gaps.', ['Formation of stationary waves', 'Nodes, antinodes, wavelength', 'Diffraction and gap width']]
  ]);
  add('alevel', 'E', [
    ['al-current', 'Current, Charge Carriers & Power', 'Charge is quantised; current I = Anvq; p.d. is energy per charge; P = VI.', ['Q = It', 'I = Anvq', 'V = W/Q', 'P = VI = I²R = V²/R']],
    ['al-resistivity', 'Resistance, Resistivity & I–V Characteristics', 'Ohm’s law, R = ρL/A, and the I–V curves of lamps, diodes, LDRs and thermistors.', ['R = V/I', 'R = ρL/A', 'I–V characteristics', 'LDRs and thermistors']],
    ['al-dc-circuits', 'EMF, Internal Resistance & Kirchhoff’s Laws', 'Why terminal p.d. drops under load, and solving networks with Kirchhoff’s laws.', ['e.m.f. vs p.d.', 'Internal resistance', 'Kirchhoff’s first and second laws', 'Series and parallel resistors']],
    ['al-potential-divider', 'Potential Dividers & Potentiometers', 'Splitting voltage, sensor circuits and null methods with a galvanometer.', ['Potential divider equation', 'Potentiometer', 'Null methods', 'Sensor circuits']],
    ['al-bfields', 'Magnetic Forces: F = BIL, F = BQv & the Hall Effect', 'Forces on currents and moving charges, the Hall voltage, velocity selectors and fields of coils.', ['F = BIL sin θ', 'F = BQv sin θ', 'Hall effect', 'Circular paths and velocity selection', 'Fields of wires, coils, solenoids']],
    ['al-ac', 'Alternating Current, RMS & Rectification', 'Peak and r.m.s. values, mean power, and turning a.c. into smooth d.c.', ['I_{rms} = I₀/√2', 'Mean power', 'Half- and full-wave rectification', 'Smoothing capacitor']]
  ]);
  add('alevel', 'T', [
    ['al-temperature', 'Temperature, Thermometry & Latent Heat', 'Thermal equilibrium, the thermodynamic scale, and specific heat and latent heat.', ['Thermal equilibrium', 'Thermometric properties', 'Kelvin scale', 'Specific heat and latent heat']],
    ['al-thermodynamics', 'Internal Energy & the First Law', 'Internal energy as random kinetic plus potential energy; ΔU = q + W.', ['Internal energy', 'W = pΔV', 'ΔU = q + W']]
  ]);
  add('alevel', 'Q', [
    ['al-particles', 'Particle Physics: Quarks, Leptons & Decays', 'The nuclear atom, α and β± decay with neutrinos, quark flavours, hadrons and leptons.', ['α-scattering and the nucleus', 'β± decay and neutrinos', 'Six quarks', 'Baryons, mesons, leptons']],
    ['al-photons', 'Photons & Wave–Particle Duality', 'E = hf, p = E/c, electron diffraction and the de Broglie wavelength.', ['E = hf', 'The electronvolt', 'Electron diffraction', 'λ = h/p']],
    ['al-spectra', 'Energy Levels & Line Spectra', 'Why atoms emit and absorb only certain colours: hf = E₁ − E₂.', ['Discrete energy levels', 'Emission and absorption spectra', 'hf = E₁ − E₂']],
    ['al-decay', 'Radioactive Decay: Activity & Decay Constant', 'Randomness, A = λN, half-life and exponential decay.', ['Spontaneous and random decay', 'A = λN', 'λ = ln2/t½', 'x = x₀e^{−λt}']],
    ['al-medical', 'Medical Physics: Ultrasound, X-rays, CT & PET', 'Piezoelectric ultrasound, acoustic impedance, X-ray attenuation, CT reconstruction and PET.', ['Piezoelectric effect', 'Acoustic impedance Z = ρc', 'X-ray production and attenuation', 'CT scanning', 'PET and annihilation']]
  ]);
  add('alevel', 'S', [
    ['al-astro', 'Stars: Luminosity, Wien & Stefan–Boltzmann', 'Standard candles and measuring stellar temperatures and radii.', ['Luminosity and flux', 'Standard candles', 'Wien’s law', 'L = 4πσr²T⁴']],
    ['al-cosmology', 'Hubble’s Law & the Big Bang', 'Redshift, Hubble’s law in SI units, and the evidence for an expanding universe.', ['Δλ/λ ≈ v/c', 'v = H₀d', 'Age of the universe']]
  ]);

  /* ---------------- University (MIT · Caltech · Stanford core) ---------------- */
  add('y1', 'M', [
    ['y1-work-energy', 'Work–Energy Theorem & Conservative Forces', 'Line integrals of force, potential energy as a scalar field, and when energy is conserved.', ['Work as ∫F·dr', 'Conservative forces and curl F = 0', 'Potential energy curves', 'Power']],
    ['y1-systems', 'Systems of Particles, Centre of Mass & Rockets', 'Internal forces cancel; the centre of mass moves as one particle; the rocket equation.', ['Centre of mass motion', 'Impulse', 'Variable mass: rocket equation']],
    ['y1-angular-momentum', 'Angular Momentum, Torque & Gyroscopes', 'τ = dL/dt, conservation of L, moments of inertia and precession.', ['L = r × p', 'Moment of inertia', 'Conservation of L', 'Gyroscopic precession']],
    ['y1-oscillators', 'Damped & Driven Oscillators', 'Underdamped, critical and overdamped motion, resonance curves and the Q factor.', ['Damped SHM', 'Driven response and phase', 'Resonance and Q', 'Transients']],
    ['y1-coupled', 'Coupled Oscillators & Normal Modes', 'Two pendulums swapping energy, and normal modes from an eigenvalue problem.', ['Normal modes', 'Beats', 'Mode matrices', 'From N masses to a wave']],
    ['y1-fluids', 'Fluid Statics & Bernoulli', 'Pressure, buoyancy, continuity and Bernoulli’s equation along a streamline.', ['Hydrostatics', 'Continuity', 'Bernoulli’s equation', 'Limits: viscosity and turbulence']]
  ]);
  add('y1', 'E', [
    ['y1-potential', 'Electric Potential, Conductors & Capacitance', 'Potential as the line integral of E, equipotentials, conductors and capacitors from Gauss’s law.', ['V = −∫E·dl', 'Conductors in equilibrium', 'Capacitance and energy density']],
    ['y1-magnetostatics', 'Biot–Savart & Ampère’s Law', 'Magnetic fields from currents: straight wires, loops and solenoids.', ['Biot–Savart law', 'Ampère’s law', 'Fields of wire, loop, solenoid', 'Forces between currents']],
    ['y1-faraday', 'Faraday’s Law, Inductance & LC Circuits', 'Changing flux makes a curling E field; inductors store energy; LC circuits oscillate.', ['Faraday’s law in integral form', 'Self- and mutual inductance', 'RL and LC circuits', 'Magnetic energy']],
    ['y1-maxwell', 'Maxwell’s Equations & the Displacement Current', 'Completing Ampère’s law and discovering that light is an electromagnetic wave.', ['Displacement current', 'Four Maxwell equations', 'Wave solutions', 'Energy flow: Poynting vector']]
  ]);
  add('y1', 'W', [['y1-optics', 'Physical Optics: Interference & Diffraction', 'Thin films, single-slit and multi-slit diffraction, gratings and resolution.', ['Thin-film interference', 'Single-slit diffraction', 'Gratings', 'Rayleigh criterion']]]);
  add('y1', 'S', [['y1-rel-dynamics', 'Relativistic Energy & Momentum', 'Four-momentum, E² = (pc)² + (mc²)², and particle decays and collisions.', ['Relativistic momentum', 'E = γmc²', 'E² = p²c² + m²c⁴', 'Thresholds and decays']]]);
  add('y1', 'T', [['y1-entropy', 'Entropy & the Second Law', 'Entropy from heat flow and from counting microstates — and why it never decreases.', ['dS = dQ_rev/T', 'S = k ln Ω', 'Second law', 'Free energies']]]);
  add('y1', 'Q', [['y1-old-quantum', 'Birth of Quantum Theory', 'Black-body radiation, photoelectric and Compton effects, and the Bohr atom.', ['Planck’s hypothesis', 'Compton scattering', 'Bohr model', 'Franck–Hertz']]]);
  add('y2', 'M', [
    ['y2-noether', 'Symmetry & Noether’s Theorem', 'Every continuous symmetry gives a conserved quantity.', ['Cyclic coordinates', 'Noether’s theorem', 'Energy, momentum, angular momentum']],
    ['y2-central-force', 'Central Forces & Kepler’s Laws', 'Effective potentials, orbit equations and Kepler’s three laws derived.', ['Reduced mass', 'Effective potential', 'Orbit equation', 'Kepler’s laws']],
    ['y2-rigid-body', 'Rigid Bodies & Euler’s Equations', 'The inertia tensor, principal axes, torque-free precession and tennis-racket instability.', ['Inertia tensor', 'Principal axes', 'Euler’s equations', 'Intermediate-axis theorem']],
    ['y2-small-oscillations', 'Small Oscillations & Normal Modes', 'Expand any potential about a minimum: normal modes from a generalised eigenvalue problem.', ['Quadratic expansion', 'Mass and stiffness matrices', 'Normal coordinates']]
  ]);
  add('y2', 'Q', [
    ['y2-schrodinger', 'The Schrödinger Equation & Wavefunctions', 'Probability amplitudes, the Born rule, stationary states and expectation values.', ['Time-dependent Schrödinger equation', 'Born rule', 'Stationary states', 'Probability current']],
    ['y2-step-barrier', 'Potential Steps, Delta Wells & Bound States', 'Reflection from steps, the delta-function well and finite square wells.', ['Potential step', 'Finite square well', 'Delta-function potential', 'Transmission coefficients']],
    ['y2-operators', 'Operators, Commutators & Uncertainty', 'Observables as Hermitian operators; [x, p] = iħ and the generalised uncertainty principle.', ['Hermitian operators', 'Commutators', 'Uncertainty principle', 'Ehrenfest’s theorem']]
  ]);
  add('y2', 'T', [
    ['y2-partition', 'Partition Functions & Ensembles', 'Microcanonical, canonical and grand canonical ensembles; everything from ln Z.', ['Canonical ensemble', 'Z and free energy', 'Equipartition', 'Grand canonical ensemble']],
    ['y2-blackbody', 'Black-Body Radiation & Planck’s Law', 'Counting photon modes in a box gives Planck’s spectrum, Wien’s law and Stefan–Boltzmann.', ['Mode counting', 'Planck distribution', 'Wien and Stefan–Boltzmann', 'The ultraviolet catastrophe']]
  ]);
  add('y2', 'E', [
    ['y2-multipoles', 'Laplace’s Equation & Multipoles', 'Boundary-value problems, uniqueness, method of images and multipole expansions.', ['Uniqueness theorems', 'Method of images', 'Separation of variables', 'Multipole expansion']],
    ['y2-matter-fields', 'Electric & Magnetic Fields in Matter', 'Polarisation, bound charges, D and H, dielectrics and magnetisation.', ['Polarisation P and D', 'Dielectrics', 'Magnetisation M and H', 'Boundary conditions']],
    ['y2-em-relativity', 'Relativistic Electrodynamics', 'E and B mix under boosts: the field tensor and the covariant form of Maxwell’s equations.', ['Field tensor F^μν', 'Transformation of fields', 'Covariant Maxwell equations', 'Invariants']]
  ]);
  add('y3', 'Q', [
    ['y3-dirac', 'Dirac Notation, Hilbert Space & Measurement', 'Kets, bras, operators and the postulates of quantum mechanics.', ['Kets and bras', 'Observables and eigenbases', 'Measurement postulate', 'Time evolution operator']],
    ['y3-angular-momentum', 'Angular Momentum Algebra & Clebsch–Gordan', 'Ladder operators, spherical harmonics and adding angular momenta.', ['[Jᵢ, Jⱼ] = iħεᵢⱼₖJₖ', 'Ladder operators', 'Addition of angular momentum', 'Clebsch–Gordan coefficients']],
    ['y3-entanglement', 'Entanglement, Bell Inequalities & Density Matrices', 'Correlations no local hidden-variable theory can reproduce, and mixed states.', ['Tensor products', 'Bell/CHSH inequality', 'Density matrices', 'Decoherence']],
    ['y3-identical', 'Identical Particles & the Pauli Principle', 'Symmetric and antisymmetric states, exchange forces and the periodic table.', ['Bosons and fermions', 'Slater determinants', 'Exchange interaction', 'Helium']],
    ['y3-fine-structure', 'Fine Structure, Zeeman & Stark Effects', 'Relativistic and spin–orbit corrections to hydrogen, and atoms in external fields.', ['Spin–orbit coupling', 'Fine structure', 'Zeeman effect', 'Stark effect']],
    ['y3-variational-wkb', 'Variational Method & WKB', 'Bounding ground-state energies and semiclassical wavefunctions with connection formulas.', ['Variational principle', 'Helium ground state', 'WKB approximation', 'Connection formulas']],
    ['y3-time-dependent', 'Time-Dependent Perturbation Theory', 'Transitions, Fermi’s golden rule, absorption, emission and selection rules.', ['Interaction picture', 'Fermi’s golden rule', 'Absorption and stimulated emission', 'Selection rules']],
    ['y3-scattering', 'Quantum Scattering', 'Cross-sections, the Born approximation and partial waves.', ['Differential cross-section', 'Born approximation', 'Partial waves and phase shifts', 'Optical theorem']],
    ['y3-landau', 'Landau Levels & the Quantum Hall Effect', 'Charged particles in magnetic fields have quantised orbits; Hall conductance is quantised.', ['Landau levels', 'Degeneracy', 'Integer quantum Hall effect']],
    ['y3-nuclear-particle', 'Nuclear & Particle Physics', 'Nuclear models, decays, accelerators, detectors and the particle zoo.', ['Liquid-drop and shell models', 'α, β, γ decay theory', 'Hadrons and quarks', 'Detectors']]
  ]);
  add('y3', 'T', [
    ['y3-solids', 'Crystals, Phonons & Band Theory', 'Lattices, X-ray diffraction, phonons, Bloch’s theorem and why some solids conduct.', ['Bravais lattices and reciprocal space', 'Phonons and heat capacity', 'Bloch’s theorem', 'Band gaps']],
    ['y3-semiconductors', 'Semiconductors & p–n Junctions', 'Electrons and holes, doping, the p–n junction, diodes, LEDs and transistors.', ['Intrinsic and doped semiconductors', 'Fermi level', 'p–n junction', 'Devices']]
  ]);
  add('y3', 'M', [['y3-fluid-dynamics', 'Fluid Dynamics: Navier–Stokes & Turbulence', 'Viscous flow, the Reynolds number, vorticity and the onset of turbulence.', ['Euler and Navier–Stokes', 'Reynolds number', 'Vorticity', 'Turbulence']]]);
  add('y4', 'E', [
    ['y4-classical-fields', 'Classical Field Theory & Noether Currents', 'Lagrangian densities, the Euler–Lagrange field equations and conserved currents.', ['Lagrangian density', 'Field equations', 'Noether currents', 'Stress–energy tensor']],
    ['y4-quantised-field', 'Quantising the Free Field', 'A field is a set of oscillators; its quanta are particles.', ['Mode expansion', 'Creation and annihilation operators', 'Fock space', 'Vacuum energy']],
    ['y4-feynman', 'Feynman Diagrams & Scattering', 'Perturbation theory in pictures: propagators, vertices and cross-sections.', ['Interaction picture and S-matrix', 'Wick’s theorem', 'Feynman rules', 'Cross-sections']],
    ['y4-qed', 'The Dirac Equation & QED', 'Relativistic electrons, spinors, antiparticles and quantum electrodynamics.', ['Dirac equation', 'Spinors and antiparticles', 'QED Feynman rules', 'g − 2']],
    ['y4-renormalisation', 'Renormalisation & Running Couplings', 'Why infinities appear and how couplings change with energy scale.', ['Loop divergences', 'Regularisation', 'Running coupling', 'Asymptotic freedom']],
    ['y4-higgs', 'Symmetry Breaking & the Higgs Mechanism', 'Goldstone bosons and how gauge bosons acquire mass.', ['Spontaneous symmetry breaking', 'Goldstone theorem', 'Higgs mechanism']],
    ['y4-standard-model', 'The Standard Model', 'SU(3)×SU(2)×U(1): quarks, leptons, gauge bosons and the Higgs.', ['Gauge group', 'Electroweak theory', 'QCD and confinement', 'Open problems']]
  ]);
  add('y4', 'T', [
    ['y4-phase-transitions', 'Phase Transitions & the Renormalisation Group', 'Critical exponents, universality, mean-field theory and Wilson’s RG.', ['Order parameters', 'Landau theory', 'Critical exponents', 'Renormalisation group']],
    ['y4-superconductivity', 'Superconductivity & Superfluidity', 'Zero resistance, the Meissner effect, Cooper pairs and BCS theory.', ['Meissner effect', 'London equations', 'Cooper pairs', 'BCS gap']],
    ['y4-topological', 'Berry Phase & Topological Matter', 'Geometric phases, Chern numbers, Thouless pumps and topological insulators.', ['Berry phase', 'Chern number', 'Thouless pump', 'Topological insulators']]
  ]);
  add('y4', 'S', [
    ['y4-gr', 'Metric, Twistors & Einstein’s Equations', 'Curved spacetime, the geodesic equation, curvature and the field equations.', ['Metric tensor', 'Twistor equation', 'Riemann curvature', 'Einstein field equations']],
    ['y4-gravitational-waves', 'Gravitational Waves', 'Linearised gravity, wave polarisations and what LIGO measures.', ['Linearised Einstein equations', 'Polarisations', 'Quadrupole formula', 'Detection']],
    ['y4-early-universe', 'Inflation, Nucleosynthesis & the CMB', 'The first minutes of the universe and the light left over from it.', ['Horizon and flatness problems', 'Inflation', 'Big Bang nucleosynthesis', 'CMB anisotropies']]
  ]);
  add('y4', 'Q', [['y4-quantum-info', 'Quantum Computation & Information', 'Qubits, gates, algorithms, teleportation and error correction.', ['Qubits and gates', 'Deutsch, Grover, Shor', 'Teleportation', 'Error correction']]]);

  /* ---------------- physics ordering (stage paths) ---------------- */
  const ORDER = {
    ks3: ['ks3-energy', 'ks3-forces', 'ks3-speed', 'ks3-moments', 'ks3-pressure', 'ks3-density', 'ks3-particles', 'ks3-heat', 'ks3-waves', 'ks3-sound', 'ks3-light', 'ks3-colour', 'ks3-circuits', 'ks3-parallel', 'ks3-magnets', 'ks3-space', 'ks3-tides-eclipses', 'ks3-solar-system', 'ks3-earth', 'ks3-climate'],
    gcse: ['gcse-measurement', 'gcse-suvat', 'gcse-mass-weight', 'gcse-forces', 'gcse-moments', 'gcse-newton', 'gcse-energy', 'gcse-work-power', 'gcse-resources', 'gcse-pressure', 'gcse-particles', 'gcse-expansion', 'gcse-shc', 'gcse-heat-transfer', 'gcse-waves', 'gcse-reflection-refraction', 'gcse-lenses', 'gcse-em-spectrum', 'gcse-sound', 'gcse-magnetism', 'gcse-static', 'gcse-current-pd', 'gcse-circuits', 'gcse-power-cost', 'gcse-series-parallel', 'gcse-safety', 'gcse-electromagnets', 'gcse-motor', 'gcse-induction', 'gcse-transformer', 'gcse-atom', 'gcse-radiation', 'gcse-radioactivity', 'gcse-earth-moon', 'gcse-solar-system', 'gcse-stars', 'gcse-orbits'],
    alevel: ['al-units', 'al-kinematics', 'al-projectile', 'al-dynamics', 'al-momentum', 'al-equilibrium', 'al-fluids', 'al-energy', 'al-materials', 'al-waves', 'al-doppler', 'al-polarisation', 'al-stationary', 'al-interference', 'al-current', 'al-resistivity', 'al-dc-circuits', 'al-potential-divider', 'al-particles', 'al-circular', 'al-gravfields', 'al-temperature', 'al-ideal-gas', 'al-thermodynamics', 'al-shm', 'al-damping', 'al-efields', 'al-capacitors', 'al-bfields', 'al-induction', 'al-ac', 'al-photons', 'al-photoelectric', 'al-spectra', 'al-nuclear', 'al-decay', 'al-medical', 'al-astro', 'al-cosmology'],
    y1: ['y1-work-energy', 'y1-systems', 'y1-angular-momentum', 'y1-rotation', 'y1-fluids', 'y1-oscillators', 'y1-coupled', 'y1-wave-eq', 'y1-optics', 'y1-gauss', 'y1-potential', 'y1-magnetostatics', 'y1-faraday', 'y1-maxwell', 'y1-sr', 'y1-rel-dynamics', 'y1-thermo', 'y1-entropy', 'y1-old-quantum', 'y1-qm-intro'],
    y2: ['y2-lagrangian', 'y2-noether', 'y2-central-force', 'y2-small-oscillations', 'y2-rigid-body', 'y2-multipoles', 'y2-matter-fields', 'y2-em-waves', 'y2-em-relativity', 'y2-fourier', 'y2-4vectors', 'y2-boltzmann', 'y2-partition', 'y2-blackbody', 'y2-schrodinger', 'y2-infinite-well', 'y2-step-barrier', 'y2-qho', 'y2-operators'],
    y3: ['y3-hamiltonian', 'y3-fluid-dynamics', 'y3-dirac', 'y3-angular-momentum', 'y3-spin', 'y3-hydrogen', 'y3-tunnelling', 'y3-identical', 'y3-entanglement', 'y3-fine-structure', 'y3-variational-wkb', 'y3-time-dependent', 'y3-scattering', 'y3-landau', 'y3-radiation', 'y3-lasers', 'y3-quantum-gases', 'y3-solids', 'y3-semiconductors', 'y3-nuclear-particle', 'y3-equivalence'],
    y4: ['y4-perturbation', 'y4-chaos', 'y4-classical-fields', 'y4-kg', 'y4-quantised-field', 'y4-feynman', 'y4-qed', 'y4-renormalisation', 'y4-gauge', 'y4-higgs', 'y4-standard-model', 'y4-ising', 'y4-phase-transitions', 'y4-superconductivity', 'y4-topological', 'y4-quantum-info', 'y4-gr', 'y4-schwarzschild', 'y4-gravitational-waves', 'y4-friedmann', 'y4-early-universe']
  };
  const known = new Set(WL.order); const all = [];
  WL.stages.forEach((s) => (ORDER[s.id] || []).forEach((id) => all.push(id)));
  WL.order.forEach((id) => { if (!all.includes(id)) all.push(id); }); // never drop a topic
  WL.order = all;

  /* ---------------- MATHS ---------------- */
  const Mh = new Set(WL.mstubs.map((m) => m.id));
  const madd = (stage, strand, rows) => rows.forEach(([id, title, summary, outline]) => { if (!Mh.has(id)) { WL.mstubs.push({ id, stage, strand, title, summary, outline, maths: [] }); Mh.add(id); } });
  if (!WL.mstages.find((s) => s.id === 'mfm')) {
    const i = WL.mstages.findIndex((s) => s.id === 'm1');
    WL.mstages.splice(i, 0, { id: 'mfm', short: 'Further', name: 'Further Mathematics', ages: 'A Level Further Maths', hue: '#4FB0AE', blurb: 'Matrices, polar curves, hyperbolic functions, de Moivre, further mechanics and statistics.', maths: [] });
    WL.mstages.forEach((s, k) => (s.n = k + 1));
  }
  madd('mf', 'A', [
    ['m-number', 'Number: Types, Factors & Sets', 'Primes, HCF and LCM, rational and irrational numbers, and set notation with Venn diagrams.', ['Types of number', 'Prime factors, HCF, LCM', 'Sets and Venn diagrams']],
    ['m-fractions', 'Fractions, Percentages & Ratio', 'Converting between forms, percentage change, compound interest and sharing in a ratio.', ['Fractions, decimals, percentages', 'Recurring decimals', 'Percentage change and reverse percentages', 'Ratio and proportion']],
    ['m-indices', 'Indices, Standard Form & Surds', 'Index laws including fractional powers, numbers like 6.02 × 10²³, and exact surd arithmetic.', ['Index laws', 'Standard form', 'Simplifying surds', 'Rationalising denominators']],
    ['m-estimation', 'Estimation, Rounding & Bounds', 'Significant figures, sensible estimates and upper and lower bounds.', ['Rounding', 'Estimation', 'Limits of accuracy']],
    ['m-rates', 'Rates, Growth & Decay', 'Speed, density and other rates, plus compound growth and depreciation.', ['Rates', 'Average speed', 'Exponential growth and decay']],
    ['m-expressions', 'Expanding, Factorising & Algebraic Fractions', 'The algebra toolkit: brackets, factorising quadratics and cubics, completing the square, algebraic fractions.', ['Expanding brackets', 'Factorising', 'Completing the square', 'Algebraic fractions']],
    ['m-equations', 'Equations & Simultaneous Equations', 'Linear, fractional, quadratic and simultaneous (including non-linear) equations.', ['Linear and fractional equations', 'Simultaneous equations', 'Non-linear simultaneous equations', 'Subject appearing twice']],
    ['m-inequalities', 'Inequalities & Regions', 'Solving inequalities and shading regions defined by several inequalities.', ['Number-line inequalities', 'Graphical regions']],
    ['m-sequences', 'Sequences & nth Terms', 'Linear, quadratic, cubic and exponential sequences.', ['Term-to-term rules', 'nth term of linear and quadratic sequences', 'Exponential sequences']],
    ['m-functions-gcse', 'Functions, Inverses & Composites', 'Function notation, domain and range, f⁻¹(x) and fg(x).', ['Function notation', 'Inverse functions', 'Composite functions']],
    ['m-curves', 'Graphs of Functions & Curve Sketching', 'Quadratic, cubic, reciprocal and exponential graphs, turning points and asymptotes.', ['Plotting axⁿ and abˣ + c', 'Sketching key features', 'Graphical solutions']],
    ['m-geometry', 'Angles, Polygons, Constructions & Bearings', 'Angle facts, polygons, ruler-and-compass constructions, scale drawings and bearings.', ['Angle rules', 'Polygons', 'Constructions and nets', 'Scale drawings and bearings', 'Symmetry']],
    ['m-similarity', 'Similarity & Congruence', 'Scale factors for lengths, areas and volumes.', ['Similar triangles', 'Area and volume scale factors', 'Congruence']],
    ['m-circle-theorems', 'Circle Theorems', 'Angles in semicircles, at the centre, in the same segment, cyclic quadrilaterals and tangents.', ['Angle at centre', 'Cyclic quadrilaterals', 'Alternate segment theorem', 'Chords and tangents']],
    ['m-mensuration', 'Area, Volume & Surface Area', 'Perimeters, arcs and sectors, prisms, cylinders, spheres, cones and frustums.', ['Areas of plane shapes', 'Arcs and sectors', 'Volumes and surface areas', 'Compound shapes']],
    ['m-trig-rules', 'Sine Rule, Cosine Rule & 3D Trigonometry', 'Non-right-angled triangles, exact values, trig graphs and angles in 3D.', ['Exact values', 'Trig graphs and equations', 'Sine and cosine rules', 'Area = ½ab sin C', '3D problems']],
    ['m-transformations', 'Transformations & 2D Vectors', 'Reflections, rotations, enlargements, translations, and vector geometry.', ['Transformations', 'Column vectors', 'Magnitude', 'Vector geometry proofs']],
    ['m-probability-gcse', 'Probability: Combined & Conditional', 'Sample spaces, tree and Venn diagrams, with and without replacement.', ['Relative frequency', 'Combined events', 'Tree and Venn diagrams', 'Conditional probability']],
    ['m-statistics', 'Statistics: Averages, Charts & Histograms', 'Averages and spread, scatter diagrams, cumulative frequency and histograms.', ['Mean, median, mode, IQR', 'Charts and diagrams', 'Scatter and correlation', 'Cumulative frequency', 'Histograms and frequency density']]
  ]);
  madd('ma', 'A', [
    ['m-functions', 'Functions & Transformations', 'Domains, ranges, one-one functions, inverses, composites and transformations of graphs.', ['Domain and range', 'Inverse and composite functions', 'Graph transformations']],
    ['m-circles', 'Coordinate Geometry & Circles', 'Equations of lines and circles and their intersections.', ['Line equations', 'Circle equation', 'Line–circle intersection']],
    ['m-radians', 'Radians, Arcs & Sectors', 'Measuring angles by arc length: s = rθ and A = ½r²θ.', ['Radian measure', 'Arc length', 'Sector area']],
    ['m-trig-identities', 'Trigonometric Identities & Equations', 'sec, cosec, cot, compound and double angles, and R cos(θ − α).', ['Pythagorean identities', 'Addition formulae', 'Double angles', 'R-form', 'Solving trig equations']],
    ['m-series', 'Binomial Expansion & Series', 'Expanding (a + b)ⁿ, arithmetic and geometric progressions and sums to infinity.', ['Binomial theorem', 'Arithmetic progressions', 'Geometric progressions', '(1 + x)ⁿ for rational n']],
    ['m-polynomials', 'Polynomials, Modulus & Partial Fractions', 'Factor and remainder theorems, |x| equations and splitting rational functions.', ['Polynomial division', 'Factor and remainder theorems', 'Modulus equations', 'Partial fractions']],
    ['m-numerical-roots', 'Numerical Solution of Equations', 'Locating roots by sign change, iteration xₙ₊₁ = F(xₙ) and the trapezium rule.', ['Sign change', 'Fixed-point iteration', 'Convergence', 'Trapezium rule']],
    ['m-statics', 'Forces, Friction & Equilibrium', 'Resolving forces, limiting friction F = μR and particles in equilibrium.', ['Resolving forces', 'Friction', 'Equilibrium of a particle']],
    ['m-kinematics-calc', 'Kinematics with Calculus', 'Displacement, velocity and acceleration as derivatives and integrals.', ['v = ds/dt', 'Constant acceleration', 'Variable acceleration']],
    ['m-newton-mech', 'Newton’s Laws: Connected Particles & Slopes', 'Pulleys, inclined planes and connected particles.', ['Inclined planes', 'Connected particles', 'Tension and thrust']],
    ['m-momentum-mech', 'Momentum & Direct Impacts', 'Conservation of momentum in direct collisions, including coalescence.', ['Momentum', 'Direct impact']],
    ['m-work-energy-mech', 'Work, Energy & Power (Mechanics)', 'Work–energy principle, power P = Fv and motion on hills.', ['Work done by a force', 'Work–energy principle', 'Power']],
    ['m-data', 'Representation of Data', 'Stem-and-leaf, box plots, histograms, cumulative frequency, mean and standard deviation.', ['Diagrams', 'Measures of location and spread', 'Coded data']],
    ['m-combinatorics', 'Permutations & Combinations', 'Counting arrangements and selections, with repetition and restrictions.', ['n!', 'ⁿPᵣ and ⁿCᵣ', 'Restricted arrangements']],
    ['m-probability-al', 'Probability Rules', 'Addition and multiplication rules, independence and conditional probability.', ['Exclusive and independent events', 'Conditional probability', 'Tree diagrams']],
    ['m-discrete-rv', 'Discrete Random Variables: Binomial & Geometric', 'E(X), Var(X), and the binomial and geometric models.', ['Probability distributions', 'Expectation and variance', 'Binomial', 'Geometric']],
    ['m-normal', 'The Normal Distribution', 'Standardising, tables, inverse problems and approximating the binomial.', ['Z-scores', 'Normal tables', 'Normal approximation with continuity correction']],
    ['m-poisson', 'The Poisson Distribution', 'Counting random events: mean = variance = λ, and approximations.', ['Poisson probabilities', 'Approximating the binomial', 'Normal approximation']],
    ['m-linear-combinations', 'Linear Combinations of Random Variables', 'E(aX + bY) and Var(aX + bY), with normal and Poisson results.', ['Expectation rules', 'Variance rules', 'Sums of normals']],
    ['m-continuous-rv', 'Continuous Random Variables', 'Probability density functions, cumulative distributions, mean and variance.', ['pdf properties', 'cdf', 'E(X) and Var(X)', 'Functions of a variable']],
    ['m-sampling', 'Sampling, Estimation & Confidence Intervals', 'Unbiased estimators, the central limit theorem and confidence intervals.', ['Sampling methods', 'Distribution of the sample mean', 'Central limit theorem', 'Confidence intervals']],
    ['m-hypothesis', 'Hypothesis Testing', 'One- and two-tailed tests, critical regions and Type I and II errors.', ['Null and alternative hypotheses', 'Binomial, Poisson and normal tests', 'Type I and II errors']]
  ]);
  madd('mfm', 'A', [
    ['m-roots-poly', 'Roots of Polynomial Equations', 'Relations between roots and coefficients, and equations with transformed roots.', ['Σα, Σαβ, αβγ', 'Symmetric functions', 'Substitutions']],
    ['m-rational-graphs', 'Rational Functions & Graphs', 'Oblique asymptotes, ranges via the discriminant, and graphs of y² = f(x), 1/f(x), |f(x)|.', ['Asymptotes', 'Range of a rational function', 'Related graphs']],
    ['m-summation', 'Summation of Series & the Method of Differences', 'Σr, Σr², Σr³, telescoping sums and convergence.', ['Standard sums', 'Method of differences', 'Sum to infinity']],
    ['m-matrix-transforms', 'Matrices & Linear Transformations', 'Matrix algebra, determinants, inverses and 2D transformations with invariant lines.', ['Matrix multiplication', 'Determinants and inverses', 'Transformations', 'Invariant points and lines']],
    ['m-polar', 'Polar Coordinates & Curves', 'Converting between Cartesian and polar forms, sketching curves and sector areas.', ['Polar form', 'Sketching r = f(θ)', 'Area ½∫r²dθ']],
    ['m-planes', 'Vectors: Planes & the Cross Product', 'Equations of planes, vector products and line–plane geometry.', ['Plane equations', 'Vector product', 'Intersections and angles', 'Shortest distances']],
    ['m-induction', 'Proof by Induction', 'Proving statements for all positive integers.', ['Base case and inductive step', 'Sums, divisibility and matrices']],
    ['m-hyperbolic', 'Hyperbolic Functions', 'sinh, cosh, tanh and their inverses, identities and logarithmic forms.', ['Definitions', 'Osborn’s rule', 'Inverse hyperbolics']],
    ['m-reduction', 'Reduction Formulae, Arc Length & Surface Area', 'Recursion for integrals, and lengths and areas of curves.', ['Reduction formulae', 'Arc length', 'Surface of revolution']],
    ['m-de-moivre', 'De Moivre’s Theorem & Roots of Unity', '(cos θ + i sin θ)ⁿ, multiple-angle formulae and nth roots of unity.', ['De Moivre', 'Multiple angles', 'C + iS series', 'Roots of unity']],
    ['m-fm-projectiles', 'Projectiles: the Trajectory Equation', 'Range, greatest height and the Cartesian path of a projectile.', ['Trajectory equation', 'Range and height', 'Model limitations']],
    ['m-rigid-equilibrium', 'Centres of Mass & Rigid Bodies', 'Locating centres of mass and toppling vs sliding.', ['Centres of mass', 'Composite bodies', 'Toppling and sliding']],
    ['m-vertical-circle', 'Circular Motion in Vertical Circles', 'Tension and reaction around a vertical circle; conditions for completing it.', ['Horizontal circles', 'Vertical circles', 'Conical pendulum']],
    ['m-elastic', 'Hooke’s Law & Elastic Energy', 'Modulus of elasticity and elastic potential energy λx²/2l.', ['T = λx/l', 'Elastic energy', 'Energy methods']],
    ['m-variable-force', 'Variable Forces & Equations of Motion', 'Separable differential equations for motion under variable forces.', ['v dv/dx', 'Resistive forces', 'Separable ODEs']],
    ['m-restitution', 'Restitution & Oblique Impacts', 'Newton’s experimental law and collisions of smooth spheres.', ['Coefficient of restitution', 'Direct impacts', 'Oblique impacts']],
    ['m-t-tests', 't-Tests & Small-Sample Inference', 't-distributions, pooled variance and paired tests.', ['t-test for a mean', 'Two-sample and paired tests', 'Confidence intervals']],
    ['m-chi-squared', 'χ² Tests', 'Goodness of fit and independence in contingency tables.', ['Goodness of fit', 'Degrees of freedom', 'Contingency tables']],
    ['m-nonparametric', 'Non-parametric Tests', 'Sign, Wilcoxon signed-rank and rank-sum tests.', ['Sign test', 'Wilcoxon signed-rank', 'Rank-sum test']],
    ['m-pgf', 'Probability Generating Functions', 'G(t) = E(tˣ): means, variances and sums of independent variables.', ['PGFs of standard distributions', 'Mean and variance from G', 'Sums of variables']]
  ]);
  madd('m1', 'K', [
    ['m-limits', 'Limits, Continuity & ε–δ', 'What a limit really means, continuity, and the intermediate value theorem.', ['ε–δ definition', 'Continuity', 'IVT and EVT']],
    ['m-convergence', 'Convergence of Sequences & Series', 'Tests for convergence, absolute convergence and power series.', ['Monotone convergence', 'Comparison and ratio tests', 'Absolute convergence', 'Radius of convergence']],
    ['m-curvilinear', 'Polar, Cylindrical & Spherical Coordinates', 'Jacobians, volume elements and the gradient in curvilinear coordinates.', ['Coordinate systems', 'Jacobians', 'Volume and surface elements']],
    ['m-line-integrals', 'Line Integrals & Conservative Fields', 'Work along a path, path independence and potentials.', ['∫F·dr', 'Path independence', 'Potentials']]
  ]);
  madd('m1', 'L', [
    ['m-vector-spaces', 'Vector Spaces & Linear Maps', 'Spans, bases, dimension, kernels, images and change of basis.', ['Vector spaces', 'Basis and dimension', 'Linear maps', 'Rank–nullity']],
    ['m-svd', 'Orthogonality, Least Squares & the SVD', 'Projections, Gram–Schmidt, least squares and singular value decomposition.', ['Orthogonal projections', 'Gram–Schmidt', 'Least squares', 'SVD']]
  ]);
  madd('m1', 'D', [
    ['m-ode-systems', 'Systems of ODEs & the Phase Plane', 'Linear systems x′ = Ax, fixed points and their stability.', ['x′ = Ax', 'Eigenvalue classification', 'Phase portraits', 'Linearisation']],
    ['m-laplace', 'Laplace Transforms', 'Turning differential equations into algebra; step and impulse responses.', ['Definition and table', 'Solving ODEs', 'Step and delta inputs', 'Convolution']]
  ]);
  madd('m2', 'K', [['m-delta', 'Dirac Delta & Distributions', 'Point sources as generalised functions, and why δ(x) is not a function.', ['Sifting property', 'Representations', 'Derivatives of δ', 'Distributions']]]);
  madd('m2', 'D', [
    ['m-separation', 'Separation of Variables: Heat, Wave & Laplace', 'Product solutions, boundary conditions and eigenfunction series.', ['Heat equation', 'Wave equation', 'Laplace equation', 'Eigenfunction expansions']],
    ['m-dft', 'Discrete Fourier Transform & FFT', 'Sampling, aliasing and the fast Fourier transform.', ['DFT', 'Sampling theorem', 'Aliasing', 'FFT']]
  ]);
  madd('m2', 'P', [
    ['m-statistics-uni', 'Estimation, Bayesian Inference & Regression', 'Maximum likelihood, Bayes’ theorem, confidence intervals and least squares.', ['Likelihood', 'Bayesian updating', 'Linear regression', 'χ² fitting']],
    ['m-random-walks', 'Random Walks, Diffusion & Markov Chains', 'From coin tosses to the diffusion equation; Langevin and Fokker–Planck.', ['Random walks', 'Diffusion limit', 'Markov chains', 'Langevin equation']]
  ]);
  madd('m3', 'K', [
    ['m-conformal', 'Conformal Mapping', 'Analytic maps preserve angles: potential flow and electrostatics by mapping.', ['Conformality', 'Möbius maps', 'Potential problems']],
    ['m-branch-cuts', 'Branch Cuts & Analytic Continuation', 'Multivalued functions, Riemann surfaces and continuing functions beyond their series.', ['log z and z^a', 'Branch cuts', 'Keyhole contours', 'Analytic continuation']],
    ['m-integral-equations', 'Integral Equations', 'Fredholm and Volterra equations, kernels and Neumann series.', ['Fredholm equations', 'Volterra equations', 'Neumann series']]
  ]);
  madd('m3', 'P', [
    ['m-perturbation-methods', 'Singular Perturbation & Multiple Scales', 'Boundary layers, matched asymptotics and two-timing.', ['Regular vs singular', 'Boundary layers', 'Matched asymptotics', 'Multiple scales']],
    ['m-wkb', 'WKB & Stationary Phase', 'Approximate solutions of rapidly oscillating problems.', ['WKB ansatz', 'Turning points', 'Stationary phase', 'Steepest descent']],
    ['m-finite-difference', 'Finite Differences & Stability', 'Discretising PDEs, von Neumann stability and spectral methods.', ['Finite differences', 'CFL condition', 'Implicit methods', 'Spectral methods']],
    ['m-monte-carlo', 'Monte Carlo Methods', 'Random sampling, importance sampling and the Metropolis algorithm.', ['Monte Carlo integration', 'Importance sampling', 'Markov-chain Monte Carlo']]
  ]);
  madd('m3', 'D', [['m-nonlinear', 'Nonlinear Dynamics: Bifurcations & Attractors', 'Saddle-node and Hopf bifurcations, limit cycles and strange attractors.', ['Bifurcations', 'Limit cycles', 'Poincaré maps', 'Strange attractors']]]);
  madd('m4', 'G', [
    ['m-representations', 'Group Representations & Characters', 'Matrices that represent symmetries, irreducibility and character tables.', ['Representations', 'Schur’s lemma', 'Characters', 'Selection rules']],
    ['m-lie', 'Lie Groups & Algebras: SU(2), SU(3), Lorentz', 'Continuous symmetry groups of physics and their algebras.', ['Generators', 'SU(2) and SO(3)', 'SU(3) and quarks', 'Lorentz group']],
    ['m-topology', 'Topology for Physicists', 'Homotopy, winding numbers and why defects are stable.', ['Topological spaces', 'Fundamental group', 'Winding numbers', 'Defects']],
    ['m-forms', 'Differential Forms', 'Exterior derivative, wedge products and the general Stokes theorem.', ['k-forms', 'Exterior derivative', 'Stokes’ theorem', 'Maxwell in forms']],
    ['m-bundles', 'Fibre Bundles & Connections', 'Gauge fields as connections; Berry phase as holonomy.', ['Fibre bundles', 'Connections and curvature', 'Holonomy']],
    ['m-functional', 'Functional Analysis & Spectral Theory', 'Banach and Hilbert spaces, bounded and unbounded operators, spectra.', ['Normed spaces', 'Operators', 'Spectral theorem']]
  ]);
  madd('msf', 'A', [
    ['m-bessel-modified', 'Modified Bessel & Hankel Functions', 'Iₙ, Kₙ and Hankel functions: decaying and outgoing cylindrical solutions.', ['Modified Bessel equation', 'Iₙ and Kₙ', 'Hankel functions', 'Asymptotics']],
    ['m-spherical-bessel', 'Spherical Bessel Functions & Scattering', 'j_l, y_l and h_l for waves in three dimensions and partial-wave scattering.', ['Spherical Bessel functions', 'Rayleigh formula', 'Plane-wave expansion', 'Partial waves']],
    ['m-orthopoly', 'Orthogonal Polynomials: Chebyshev, Gegenbauer & Jacobi', 'The general theory behind every orthogonal family, and Gaussian quadrature.', ['Weight functions', 'Recurrences', 'Chebyshev polynomials', 'Gaussian quadrature']],
    ['m-confluent', 'Confluent Hypergeometric & Parabolic Cylinder Functions', 'Kummer’s M and U, Whittaker functions and parabolic cylinder functions.', ['Kummer’s equation', 'Whittaker functions', 'Parabolic cylinder functions', 'Coulomb wavefunctions']],
    ['m-mathieu', 'Mathieu Functions & Floquet Theory', 'Periodic coefficients: parametric resonance, Paul traps and band structure.', ['Mathieu equation', 'Floquet theorem', 'Stability chart', 'Characteristic values']],
    ['m-theta', 'Theta Functions & the Weierstrass ℘ Function', 'Doubly periodic functions, lattice sums and modular transformations.', ['Jacobi theta functions', 'Weierstrass ℘', 'Lattices and periods', 'Modular transformations']],
    ['m-expint', 'Exponential, Sine & Fresnel Integrals', 'Ei, Si, Ci, Fresnel integrals, Dawson’s function and the Lambert W function.', ['Exponential integral', 'Sine and cosine integrals', 'Fresnel integrals', 'Lambert W']]
  ]);
  const MORDER = {
    mf: ['m-number', 'm-fractions', 'm-indices', 'm-estimation', 'm-rates', 'm-algebra', 'm-expressions', 'm-equations', 'm-quadratics', 'm-inequalities', 'm-sequences', 'm-proportion', 'm-graphs', 'm-curves', 'm-functions-gcse', 'm-geometry', 'm-similarity', 'm-circle-theorems', 'm-mensuration', 'm-trig', 'm-trig-rules', 'm-transformations', 'm-probability-gcse', 'm-statistics'],
    ma: ['m-functions', 'm-circles', 'm-radians', 'm-trig-identities', 'm-series', 'm-polynomials', 'm-exp-log', 'm-differentiation', 'm-integration', 'm-numerical-roots', 'm-vectors', 'm-ode1', 'm-statics', 'm-kinematics-calc', 'm-newton-mech', 'm-momentum-mech', 'm-work-energy-mech', 'm-data', 'm-combinatorics', 'm-probability-al', 'm-discrete-rv', 'm-normal', 'm-poisson', 'm-linear-combinations', 'm-continuous-rv', 'm-sampling', 'm-hypothesis'],
    mfm: ['m-roots-poly', 'm-rational-graphs', 'm-summation', 'm-induction', 'm-matrix-transforms', 'm-polar', 'm-planes', 'm-hyperbolic', 'm-reduction', 'm-de-moivre', 'm-fm-projectiles', 'm-rigid-equilibrium', 'm-vertical-circle', 'm-elastic', 'm-variable-force', 'm-restitution', 'm-t-tests', 'm-chi-squared', 'm-nonparametric', 'm-pgf'],
    m1: ['m-limits', 'm-convergence', 'm-complex', 'm-taylor', 'm-partial', 'm-curvilinear', 'm-multiple', 'm-line-integrals', 'm-vector-spaces', 'm-matrices', 'm-eigen', 'm-svd', 'm-ode2', 'm-ode-systems', 'm-laplace'],
    m2: ['m-divcurl', 'm-theorems', 'm-delta', 'm-fourier-series', 'm-fourier-transform', 'm-dft', 'm-pde', 'm-separation', 'm-variations', 'm-lagrange-mult', 'm-probability', 'm-statistics-uni', 'm-random-walks'],
    m3: ['m-hilbert', 'm-complex-analysis', 'm-conformal', 'm-branch-cuts', 'm-green', 'm-integral-equations', 'm-tensors', 'm-nonlinear', 'm-perturbation-methods', 'm-wkb', 'm-numerical', 'm-finite-difference', 'm-monte-carlo'],
    msf: ['m-special', 'm-frobenius', 'm-gamma', 'm-erf', 'm-expint', 'm-legendre', 'm-bessel', 'm-bessel-modified', 'm-spherical-bessel', 'm-hermite', 'm-laguerre', 'm-orthopoly', 'm-airy', 'm-hypergeometric', 'm-confluent', 'm-mathieu', 'm-elliptic', 'm-jacobi', 'm-theta', 'm-zeta'],
    m4: ['m-diffgeo', 'm-forms', 'm-topology', 'm-bundles', 'm-groups', 'm-representations', 'm-lie', 'm-functional', 'm-path-integral', 'm-asymptotics']
  };
  const mall = []; WL.mstages.forEach((s) => (MORDER[s.id] || []).forEach((id) => mall.push(id)));
  WL.morder.forEach((id) => { if (!mall.includes(id)) mall.push(id); }); WL.morder = mall;
  Object.assign(WL.mprereq, {
    'm-expressions': ['m-algebra'], 'm-equations': ['m-algebra'], 'm-curves': ['m-graphs'], 'm-trig-rules': ['m-trig'], 'm-similarity': ['m-geometry'], 'm-circle-theorems': ['m-geometry'],
    'm-functions': ['m-functions-gcse'], 'm-trig-identities': ['m-trig-rules'], 'm-series': ['m-sequences'], 'm-normal': ['m-discrete-rv'], 'm-poisson': ['m-discrete-rv'], 'm-hypothesis': ['m-sampling'],
    'm-sampling': ['m-normal'], 'm-continuous-rv': ['m-integration'], 'm-de-moivre': ['m-complex'], 'm-hyperbolic': ['m-exp-log'], 'm-polar': ['m-trig-identities'], 'm-planes': ['m-vectors'],
    'm-convergence': ['m-limits'], 'm-svd': ['m-eigen'], 'm-ode-systems': ['m-eigen', 'm-ode2'], 'm-laplace': ['m-ode2'], 'm-separation': ['m-pde', 'm-fourier-series'], 'm-dft': ['m-fourier-transform'],
    'm-conformal': ['m-complex-analysis'], 'm-branch-cuts': ['m-complex-analysis'], 'm-wkb': ['m-ode2', 'm-complex-analysis'], 'm-representations': ['m-groups'], 'm-lie': ['m-groups'], 'm-forms': ['m-diffgeo'],
    'm-bundles': ['m-forms'], 'm-bessel-modified': ['m-bessel'], 'm-spherical-bessel': ['m-bessel'], 'm-orthopoly': ['m-special'], 'm-confluent': ['m-hypergeometric'], 'm-mathieu': ['m-frobenius'], 'm-theta': ['m-jacobi'], 'm-expint': ['m-gamma']
  });
})();
