/* Geodesic: "See it like Feynman" sections, y3. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('y3-angular-momentum', [
  'The two electrons in helium combine their spins to a total of 0 or 1, never anything else, and helium’s excited states split into two separate families that hardly ever turn into one another.',
  'Quantum angular momenta add like vectors whose lengths are quantised: combining j₁ and j₂ gives totals from |j₁ − j₂| up to j₁ + j₂ in whole steps. Two spin-½ particles make total spin 0 (a singlet) or 1 (a triplet).',
  'The algebra [J_x, J_y] = iħJ_z fixes everything: J² has eigenvalues j(j+1)ħ², and J_z takes 2j + 1 values. Counting states checks the rule: (2j₁ + 1)(2j₂ + 1) = Σ(2J + 1), and for ½ ⊗ ½, 2 × 2 = 1 + 3.',
  'A p electron (l = 1) with spin ½ has j = ½ or 3/2: 2 + 4 = 6 states, the same as 3 × 2. In sodium these two values of j give the two yellow D lines, at 589.0 and 589.6 nm.',
  'Clebsch–Gordan coefficients say how to build the combined states, not what their energies are: those depend on interactions such as spin–orbit coupling and exchange.'
]);
WL.fy('y3-dirac', [
  'Put a vertical polariser and a horizontal one in a beam and no light gets through. Slide a diagonal polariser between them and some light does.',
  'A photon’s polarisation is a vector in a two-dimensional space, and a polariser measures along its axis, projecting the state onto it. Vertical has no overlap with horizontal, but a diagonal state overlaps both, so the middle polariser prepares the photons afresh.',
  'The probability of passing is |⟨axis|state⟩|². Vertical to diagonal: cos² 45° = ½; diagonal to horizontal: ½ again; so a quarter of the light that passes the first polariser gets through. Without the middle one, ⟨H|V⟩ = 0.',
  'Use N polarisers turning in equal steps from vertical to horizontal and the transmission is (cos²(90°/N))^N, which tends to 1 as N grows: for N = 10, (cos² 9°)¹⁰ ≈ 0.78.',
  'Dirac notation describes states and probabilities, not what "really happens" during a measurement. Interpretations differ; the predictions do not.'
]);
WL.fy('y3-entanglement', [
  'Two photons from one source, measured along the same axis, always agree. Measured along axes at an angle θ, they agree with probability cos²θ, a pattern that no pre-arranged "instructions" carried by the photons can reproduce.',
  'The pair is in one joint state, not two separate ones. Neither photon has a polarisation of its own before measurement; only the relation between them is defined. This is **entanglement**.',
  'If each photon carried pre-set answers, the correlations would obey Bell’s inequality, in the CHSH form |S| ≤ 2. Quantum mechanics predicts S = 2√2 ≈ 2.83 for the best choice of angles, and experiments, loophole-free since 2015, find the violation.',
  'With the correlation E(θ) = cos 2θ and analyser angles 0°, 22.5°, 45° and 67.5°, three pairs give cos 45° and one gives cos 135°, so S = 3 × 0.707 + 0.707 ≈ 2.83.',
  'Entanglement cannot send signals: each side alone sees random results, and the correlations appear only when the two records are compared.'
]);
WL.fy('y3-equivalence', [
  'In a freely falling lift you would float, exactly as in deep space. No experiment inside a small falling box can tell free fall from being far from all masses.',
  'In free fall gravity is not felt, because everything falls together. Standing on the Earth, you are being pushed up by the floor: accelerating upwards compared with free fall. So gravity can be described as the shape of spacetime, with free-fall paths as the straightest possible lines.',
  'Because inertial and gravitational mass are equal (tested to about one part in 10¹⁵), a uniform gravitational field is equivalent to acceleration. Two consequences follow: light bends, and clocks lower down run slow, so a photon climbing a height h loses a fraction gh/c² of its energy.',
  'Pound and Rebka measured that shift in 1960 for gamma rays climbing 22.5 m: gh/c² = 9.8 × 22.5 / (9 × 10¹⁶) ≈ 2.5 × 10⁻¹⁵, as predicted. GPS satellite clocks gain about 45 μs a day from being higher up.',
  'The equivalence is only local: over larger regions the differences in gravity (tides) cannot be removed by any choice of frame, and those differences are the curvature.'
]);
WL.fy('y3-fine-structure', [
  'Seen through a good spectrometer, hydrogen’s red line is two lines very close together, and in a magnetic field spectral lines split into several (the Zeeman effect).',
  'The electron’s spin makes it a tiny magnet. Moving round the nucleus, it sees the nucleus’s electric field partly as a magnetic field in its own frame, and its energy depends on how its spin points: **spin–orbit coupling** splits the levels. An outside magnetic field splits them further, by orientation.',
  'The fine-structure corrections are of order α² times the level energies (α ≈ 1/137): the relativistic kinetic energy, spin–orbit coupling and the Darwin term together make the energy depend only on n and j, as Dirac’s equation predicts. The Zeeman shifts are ΔE = μ_B g m_j B.',
  'α² × 13.6 eV ≈ 7 × 10⁻⁴ eV sets the scale; the Hα line splits by about 0.014 nm. A 1 T field shifts levels by μ_B B ≈ 5.8 × 10⁻⁵ eV.',
  'The Lamb shift, discovered in 1947, separates levels that Dirac’s equation says are equal, by about 4 μeV; explaining it took quantum electrodynamics.'
]);
WL.fy('y3-fluid-dynamics', [
  'Smoke from a candle rises in a smooth thread, then breaks into swirls a few centimetres up. Honey poured slowly stays smooth, while water from a tap turns turbulent.',
  'Viscosity smooths out differences in velocity, while inertia carries disturbances along and lets them grow. The **Reynolds number** Re = ρvL/η compares the two: at small Re the flow is smooth (laminar); at large Re it is **turbulent**, with eddies handing energy down to smaller and smaller scales until viscosity turns it into heat.',
  'The Navier–Stokes equation, ρ(∂v/∂t + v·∇v) = −∇p + η∇²v + f, is Newton’s second law for a parcel of fluid. Its nonlinear term v·∇v passes energy between scales, and when it dominates the viscous term (Re ≫ 1), small disturbances grow.',
  'Water at 1 m/s in a 2 cm pipe: Re = 1000 × 1 × 0.02 / 0.001 = 20 000, well above the 2300 or so where pipe flow turns turbulent. Honey (η ≈ 10 Pa s) at the same speed has Re ≈ 3, and stays smooth.',
  'There is no general theory of turbulence, and whether solutions of the three-dimensional Navier–Stokes equations always stay smooth is one of the unsolved Millennium Prize problems.'
]);
WL.fy('y3-hamiltonian', [
  'Plot a pendulum’s position against its momentum and its motion traces a closed loop. Start a cloud of pendulums from slightly different starts and the area the cloud covers in that plot never changes, however much it stretches and folds.',
  '**Phase space** has one axis for each position and each momentum. Hamilton’s equations make the points flow through it, and the flow keeps volumes fixed (**Liouville’s theorem**), like an incompressible fluid.',
  'q̇ = ∂H/∂p and ṗ = −∂H/∂q, so the divergence of the flow is ∂²H/∂q∂p − ∂²H/∂p∂q = 0, and volumes are conserved. That is why phase-space volume is the right thing to count in statistical mechanics.',
  'A 1 kg pendulum 1 m long swinging 0.1 m either side has E ≈ 0.049 J, and its orbit encloses a phase-space area 2πE/ω ≈ 0.1 J s, about 10³³ times ħ: its quantum energy levels are far too close together ever to notice.',
  'With friction, phase-space volumes shrink and attractors appear. In chaotic systems the volume is kept but stretched into fine filaments, so prediction fails even though Liouville’s theorem holds.'
]);
WL.fy('y3-hydrogen', [
  'Hydrogen’s spectral lines fit a simple formula, 1/λ = R(1/n₁² − 1/n₂²), found by Balmer and Rydberg from the measurements alone, long before anyone knew why.',
  'The electron is a standing wave in the proton’s 1/r potential. The three-dimensional solutions are labelled n, l and m, and the energy depends only on n: E_n = −13.6 eV/n². Each line is a jump between two levels.',
  'The Coulomb potential has a hidden symmetry (the Runge–Lenz vector is conserved, the same fact that stops classical orbits from turning), which gives every l with the same n the same energy. The Rydberg constant comes out as R = me⁴/(8ε₀²h³c).',
  'R = 1.097 × 10⁷ m⁻¹, so the Lyman-α line (2 → 1) has 1/λ = (3/4)R, λ = 121.6 nm, and the series ends at 91.2 nm. Photons shorter than that ionise hydrogen, which is why hydrogen clouds block far-ultraviolet light.',
  'Fine structure, the Lamb shift and the hyperfine splitting (the 21 cm line) all shift the levels slightly, and the proton is not infinitely heavy (a reduced-mass correction of about 0.05 %).'
]);
WL.fy('y3-identical', [
  'Atoms are large and chemistry is rich because electrons will not share a state: once the lowest level is full, the next electron must go higher. Otherwise every electron would crowd into the lowest orbital, and atoms would be small and chemically dull.',
  'Identical particles are truly indistinguishable, so swapping two cannot change any probability. Under a swap the wavefunction either stays the same (**bosons**) or changes sign (**fermions**). Two fermions in the same state would give ψ = −ψ, so ψ = 0: the **Pauli exclusion principle**.',
  'Swapping twice gives back the original, so the swap factor squared is 1, and the factor is ±1. The spin–statistics theorem of relativistic quantum field theory fixes which: half-integer spin gives −1 (fermions), whole-number spin +1 (bosons).',
  'White dwarfs are held up by the electrons’ refusal to share states. A white dwarf with the Sun’s mass is about the size of the Earth, with a density near 2 × 10⁹ kg/m³: a teaspoonful would weigh about ten tonnes.',
  'Why spin and statistics are linked can only be proved in relativistic quantum field theory, and in two dimensions "anyons" with other swap phases exist.'
]);
WL.fy('y3-landau', [
  'In a thin layer of electrons at low temperature and in a strong magnetic field, the Hall resistance locks onto values h/(ie²), with i a whole number, so precisely that they now define the standard ohm.',
  'In a magnetic field electrons circle, and quantum mechanics allows only certain circles: **Landau levels**, each holding exactly eB/h electrons per unit area. When a whole number of levels is full, current flows along the edges and the Hall resistance is h/(ie²).',
  'The levels are E = ħω_c(n + ½) with ω_c = eB/m, and each holds one state per flux quantum h/e of field passing through. The exactness comes from topology: the Hall conductance is a topological number (a Chern number), unaffected by the disorder of any real sample.',
  'h/e² = 25 812.807 Ω, the von Klitzing constant. At 10 T each Landau level holds eB/h ≈ 2.4 × 10¹⁵ electrons per square metre.',
  'The fractional quantum Hall effect, with plateaus at fractions such as 1/3, needs the electrons’ interactions with each other, and new quasiparticles carrying a fraction of the electron’s charge.'
]);
WL.fy('y3-lasers', [
  'A 5 mW laser pointer can dazzle from a kilometre away; a 60 W bulb cannot. The laser’s light is one colour, one direction and all in step.',
  'In **stimulated emission** a photon passing an excited atom triggers it to emit an identical photon, with the same direction, frequency and phase. With more atoms excited than not (a **population inversion**) and mirrors sending the light back and forth, the photons multiply into one coherent beam.',
  'Einstein’s coefficients make absorption and stimulated emission equally likely per atom (for equal degeneracies), so amplification needs more atoms in the upper level than the lower, which never happens in thermal equilibrium. The inversion must be pumped, and optical pumping needs three or four levels, not two.',
  'A 5 mW pointer squeezed into a 1 mm² spot gives 5000 W/m², about five times bright sunlight, all of it focused by the eye onto a tiny patch of retina: never look into one.',
  'Real lasers have finite linewidths and coherence lengths, several modes and noise, and the photon statistics of laser light differ from those of thermal light.'
]);
WL.fy('y3-nuclear-particle', [
  'The Sun shines because protons fuse, yet two protons repel strongly, and at the Sun’s core temperature classical physics says they almost never get close enough.',
  'Protons **tunnel** through the electric barrier between them. The fusion rate comes from where the falling tail of the thermal energy distribution overlaps the rising chance of tunnelling: the **Gamow peak**. And the first step needs the weak interaction to turn a proton into a neutron, which makes it extremely slow.',
  'The tunnelling probability goes as e^(−2πη), with η = Z₁Z₂e²/(4πε₀ħv). Multiplied by the Boltzmann factor e^(−E/kT), it peaks at E₀ = (bkT/2)^(2/3): several kT up, in the tail but not too far into it.',
  'For two protons at 1.5 × 10⁷ K (kT ≈ 1.3 keV) the Gamow peak is near 6 keV, while the barrier is about half an MeV high: they tunnel through a barrier roughly a hundred times their typical energy. A given proton in the core waits about ten billion years to fuse.',
  'The full rate also needs the nuclear factor S(E), which for proton–proton fusion is far too small to measure in a laboratory and comes from theory.'
]);
WL.fy('y3-quantum-gases', [
  'Cool rubidium atoms to 170 nK and many of them suddenly pile into one single quantum state: a Bose–Einstein condensate, first made in 1995. Cool the electrons in a metal and nothing like that happens.',
  '**Bosons** like to share states: their occupation 1/(e^((E−μ)/kT) − 1) can grow without limit as μ approaches the lowest energy, so below a critical temperature a large fraction **condenses** into the ground state. **Fermions** cannot share, so they stack up to a Fermi energy, which in a metal corresponds to tens of thousands of kelvin.',
  'Condensation sets in when the thermal de Broglie wavelength λ_T = h/√(2πmkT) grows to about the spacing between atoms: nλ_T³ ≈ 2.612.',
  'Copper’s conduction electrons have a Fermi energy of 7 eV, a Fermi temperature of about 81 000 K. At room temperature the electron gas is deeply quantum: only electrons near the top of the stack can take up heat, giving about 1 % of the classical heat capacity.',
  'Real atoms interact. In superfluid helium-4, a strongly interacting Bose liquid, only about 10 % of the atoms are in the condensate.'
]);
WL.fy('y3-radiation', [
  'The sky is blue and sunsets are red, and a radio aerial sends out its signal sideways, not along its length.',
  'An accelerating charge sends a kink in its field lines outwards at c: that kink is **radiation**, and it goes mostly sideways to the acceleration. Electrons in air molecules, shaken by sunlight, re-radiate (scatter) with a power that grows as ω⁴, so blue light is scattered far more than red.',
  'The Larmor formula gives the power, P = q²a²/(6πε₀c³). An electron bound in a molecule and driven well below its resonance moves with an amplitude that hardly depends on frequency, so its acceleration grows as ω² and the radiated power as ω⁴: Rayleigh scattering.',
  'Blue at 450 nm is scattered (700/450)⁴ ≈ 6 times more than red at 700 nm. At sunset, light near the horizon passes through about 40 times as much air as at noon, losing most of its blue.',
  'Larmor’s formula is non-relativistic; at high speeds the radiation is beamed forwards (synchrotron light). And at high frequencies the emission comes in photons, which a classical picture cannot show.'
]);
WL.fy('y3-scattering', [
  'Slow neutrons bounce off a nucleus equally in all directions, whatever the nucleus’s shape. Fast ones scatter mostly forwards, in a diffraction pattern.',
  'A wave much longer than an object cannot "see" its shape, so it scatters evenly in all directions (s-wave scattering). A wave much shorter than the object diffracts round it, with most of the scattering in a forward cone.',
  'A particle of momentum p passing at impact parameter b carries angular momentum pb = ħl, so only partial waves with l up to about ka, where a is the range, feel the potential. When ka ≪ 1 only l = 0 matters, and the scattering is the same in every direction. A hard sphere at low energy even has a cross-section of 4πa², four times its shadow: a wave effect.',
  'Room-temperature neutrons (0.025 eV) have λ ≈ 0.18 nm, about 30 000 times the size of a nucleus: pure s-wave scattering. At 100 MeV, λ ≈ 2.9 fm, comparable to the nucleus, and many partial waves join in.',
  'The simple pictures assume a fixed target and no absorption. Real nuclear scattering has resonances and absorption, handled by models such as the optical model.'
]);
WL.fy('y3-semiconductors', [
  'Pure silicon conducts poorly, but adding one phosphorus atom for every million silicon atoms makes it conduct millions of times better. And a junction between two kinds of doped silicon lets current through one way only.',
  'Silicon’s electrons fill a **valence band**, with a gap of 1.1 eV below the empty **conduction band**, and few electrons are shaken across by heat. Phosphorus has one spare electron, loosely held, which easily joins the conduction band (n-type); boron has one too few, leaving mobile holes (p-type). At a **p–n junction**, carriers diffuse across and leave a charged layer whose field blocks further flow, unless an outside voltage lowers the barrier.',
  'The number of carriers in pure silicon goes as e^(−E_g/2kT), and with E_g = 1.1 eV and kT = 0.026 eV that is about e⁻²¹ ≈ 7 × 10⁻¹⁰: tiny. A diode’s current follows I = I₀(e^(eV/kT) − 1), because a forward voltage lowers the barrier and the current rises exponentially.',
  'Silicon has 5 × 10²⁸ atoms per m³. Doping at one part per million adds 5 × 10²² electrons per m³, against about 10¹⁶ in pure silicon: some five million times more carriers.',
  'Real devices also involve band bending, recombination and the effects of heavy doping, and the band picture itself assumes a perfect crystal.'
]);
WL.fy('y3-solids', [
  'Diamond is clear and insulating, while graphite, made of the same carbon atoms, is black and conducts. Copper conducts and silicon barely does.',
  'In a crystal, electron waves scatter off the regular lattice, and at certain wavelengths the scattered waves add up and open gaps in the allowed energies: **bands**. If the highest occupied band is full and the gap above it is large, the material insulates; if a band is partly full, it is a metal.',
  'Bloch’s theorem says that in a periodic potential the wavefunctions are plane waves times periodic functions. Bragg reflection at k = π/a opens gaps of size about 2|V_G|. Each band holds two electrons per unit cell (two spins), so an odd number of electrons per cell usually makes a metal.',
  'Diamond’s gap is 5.5 eV, bigger than any visible photon’s 1.8 to 3.1 eV, so visible light passes straight through. Silicon’s 1.1 eV gap absorbs all visible light, so silicon looks grey and opaque, yet it is clear to infrared beyond 1.1 μm.',
  'Interactions between electrons can make materials with half-filled bands insulate (Mott insulators), which simple band theory gets wrong.'
]);
WL.fy('y3-spin', [
  'Silver atoms sent through an uneven magnetic field split into exactly two beams (Stern and Gerlach, 1922), not the smear expected if their magnetism could point any way.',
  'Electrons carry an intrinsic angular momentum, **spin ½**: measured along any axis, it is always +ħ/2 or −ħ/2. Silver’s single outer electron gives the atom a magnetic moment that can only point "up" or "down" along the field.',
  'Spin-½ states are two-component vectors, and the spin operators are ħ/2 times the Pauli matrices. Turning such a state through 360° multiplies it by −1; only 720° brings it back, which has been seen directly with neutron interferometers.',
  'With a field gradient of 1000 T/m the force on the atom is μ_B × 1000 ≈ 10⁻²⁰ N. Over 5 cm at 500 m/s (100 μs), a silver atom (1.8 × 10⁻²⁵ kg) is pushed aside by ½(F/m)t² ≈ 0.26 mm each way.',
  'Spin is not literally something spinning: a spinning electron would have to rotate faster than light. It is a property explained only by relativistic quantum mechanics (Dirac).'
]);
WL.fy('y3-time-dependent', [
  'An excited atom left in the dark eventually emits a photon, with a definite average lifetime: nanoseconds for allowed transitions, much longer for "forbidden" ones.',
  'A weak disturbance oscillating at ω drives jumps between states whose energies differ by ħω. When there is a continuum of final states, the probability grows at a steady rate: **Fermi’s golden rule**.',
  'First-order perturbation theory gives an amplitude c_f(t) ∝ ∫⟨f|V|i⟩e^(iω_fi t)dt. Summed over a density of final states ρ, |c_f|² grows in proportion to t, giving a rate Γ = (2π/ħ)|V_fi|²ρ(E_f).',
  'Hydrogen’s 2p state decays to 1s at about 6 × 10⁸ per second, a lifetime of 1.6 ns. The 2s state cannot decay by emitting one photon, so it lives about 0.12 s and decays by emitting two.',
  'The golden rule fails for strong driving (the population then swings back and forth: Rabi oscillations) and at very short times, and spontaneous emission strictly needs the quantised electromagnetic field.'
]);
WL.fy('y3-tunnelling', [
  'Uranium-238 emits alpha particles with an average wait of billions of years; polonium-212 within a microsecond. Yet their alpha energies differ only by a factor of two.',
  'The alpha particle rattles about inside the nucleus, hitting the electric barrier around 10²¹ times a second, with a tiny chance of **tunnelling** through each time. That chance depends exponentially on the barrier’s width and height, so a small change in energy makes an enormous change in lifetime.',
  'Inside the barrier the wavefunction dies away as e^(−κx), with κ = √(2m(V − E))/ħ, so the transmission is about e^(−2∫κ dx). For an electric barrier the exponent grows as Z/√E: the Geiger–Nuttall law.',
  'Uranium-238: E = 4.27 MeV, half-life 4.5 × 10⁹ years. Polonium-212: E = 8.95 MeV, half-life 0.3 μs. A factor of two in energy makes a factor of almost 10²⁴ in lifetime.',
  'The simple model ignores how the alpha particle forms inside the nucleus and the nucleus’s shape, which change the rates by factors of ten or so: small beside the exponential.'
]);
WL.fy('y3-variational-wkb', [
  'You can estimate the ground-state energy of helium to within 2 % with a pencil, without solving its Schrödinger equation.',
  'The **variational principle**: any trial wavefunction gives an average energy at or above the true ground state, so tuning its parameters to lower that energy approaches the truth from above. The **WKB method**: where the potential changes slowly compared with the wavelength, the wave simply adjusts its local wavelength, and its phase is ∫p dx/ħ.',
  'Write any trial state as a sum of eigenstates: ⟨H⟩ = Σ|c_n|²E_n, which cannot be lower than E₀. For helium, take two hydrogen-like orbitals with an effective nuclear charge Z as the adjustable parameter (each electron partly screens the other) and minimise: Z = 27/16.',
  'That gives E = −2(27/16)² × 13.6 eV ≈ −77.5 eV, against the measured −79.0 eV: within 2 %, from a one-line calculation.',
  'The variational method bounds the energy but does not guarantee a good wavefunction, and WKB fails near turning points, where the wavelength grows without limit and Airy functions are needed to patch across.'
]);
})();
