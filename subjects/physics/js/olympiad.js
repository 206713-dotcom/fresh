/* Geodesic — Olympiad physics pathway, following the IPhO syllabus
   (Appendix to the IPhO Statutes, accepted 2014 in Astana, amended 2015 in Mumbai).
   #olympiad: the pathway, the syllabus mapped to Geodesic topics, the skill cards.
   #oly-<skill>: one skill card with a worked example and a checked problem. */
(function () {
  const WL = (window.WL = window.WL || {}), R = String.raw;

  /* ---------- the syllabus, section by section, mapped to topics on the site ---------- */
  const SYL = [
    { code: '2.1', name: 'General', items: 'Making suitable approximations when modelling real problems; recognising and using symmetry.', topics: [], skills: ['t-dim', 't-limits', 't-fermi', 't-symmetry', 't-taylor'] },
    { code: '2.2', name: 'Mechanics', parts: [
      { code: '2.2.1', name: 'Kinematics', items: 'Velocity and acceleration as derivatives of displacement; centripetal and tangential acceleration; constant acceleration; adding velocities and angular velocities; adding accelerations (without the Coriolis term) and when the Coriolis term vanishes; the instantaneous centre of rotation of a rigid body.', topics: ['al-kinematics', 'gcse-suvat', 'al-projectile', 'al-circular', 'y1-rotation'] },
      { code: '2.2.2', name: 'Statics', items: 'Centre of mass by summation or integration; balance of forces and of torques (1D and 2D); normal force, tension, static and kinetic friction; Hooke’s law, stress, strain, Young’s modulus; stable and unstable equilibrium.', topics: ['al-equilibrium', 'gcse-moments', 'al-materials', 'y1-systems'] },
      { code: '2.2.3', name: 'Dynamics', items: 'Newton’s second law in vector and component form; translational and rotational kinetic energy; potential energy, including as a line integral; conservation of momentum, angular momentum and energy; work, power, dissipation by friction; non-inertial frames (inertial and centrifugal forces, potential energy in a rotating frame); moments of inertia of a ring, disc, sphere, hollow sphere and rod, the parallel-axis theorem.', topics: ['al-dynamics', 'al-momentum', 'al-energy', 'y1-work-energy', 'y1-angular-momentum', 'y1-rotation'], skills: ['t-cons', 't-rotframe', 't-rolling'] },
      { code: '2.2.4', name: 'Celestial mechanics', items: 'Newton’s law of gravitation, gravitational potential; Kepler’s laws (the first and third without derivation); the energy of a body on an elliptical orbit.', topics: ['al-gravfields', 'y2-central-force'], skills: ['t-orbits', 'm-conic'] },
      { code: '2.2.5', name: 'Hydrodynamics', items: 'Pressure, buoyancy, continuity, Bernoulli’s equation; surface tension, surface energy and capillary pressure.', topics: ['al-fluids', 'y1-fluids', 'gcse-pressure'], skills: ['t-bernoulli', 't-surface'] }] },
    { code: '2.3', name: 'Electromagnetic fields', parts: [
      { code: '2.3.1', name: 'Basic concepts', items: 'Charge and current, charge conservation and Kirchhoff’s current law; Coulomb force, electrostatic potential, Kirchhoff’s voltage law; magnetic field, Lorentz and Ampère forces, Biot–Savart law and the fields of a straight wire, a circular loop and a long solenoid.', topics: ['al-efields', 'gcse-static', 'al-bfields', 'y1-magnetostatics'] },
      { code: '2.3.2', name: 'Integral forms of Maxwell’s equations', items: 'Gauss’s law for E and B, Ampère’s law, Faraday’s law, used where the integrand is nearly piecewise constant; boundary conditions at conductors and at infinity; grounded conductors; superposition; uniqueness; image charges.', topics: ['y1-gauss', 'y1-potential', 'y1-faraday', 'al-induction', 'y1-maxwell', 'y2-multipoles'], skills: ['t-images', 't-superpose'] },
      { code: '2.3.3', name: 'Interaction of matter with fields', items: 'Resistivity, conductivity, Ohm’s law in differential form; permittivity and permeability; energy density of the fields; ferromagnetism, hysteresis, dissipation; eddy currents, Lenz’s law; helical motion, cyclotron frequency, E × B drift; energy of a magnetic dipole, the dipole moment of a current loop.', topics: ['al-resistivity', 'y2-matter-fields', 'al-bfields', 'gcse-induction'], skills: ['m-vec'] },
      { code: '2.3.4', name: 'Circuits', items: 'Ohm’s and Joule’s laws; ideal and real batteries, current sources, ammeters, voltmeters, ohmmeters; non-linear elements with a given I–V curve; capacitance, self- and mutual inductance, energy stored; RC and RL time constants; AC circuits with complex amplitudes, impedance, phasors, resonance and power.', topics: ['al-dc-circuits', 'al-potential-divider', 'al-capacitors', 'al-ac', 'al-current'], skills: ['t-ladder', 't-phasor'] }] },
    { code: '2.4', name: 'Oscillations and waves', parts: [
      { code: '2.4.1', name: 'Single oscillator', items: 'Harmonic oscillation; the physical pendulum and its reduced length; behaviour near unstable equilibria; damped oscillation; forced oscillation, resonance, amplitude and phase; free LC oscillation; the mechanical–electrical analogy; positive feedback and instability.', topics: ['al-shm', 'al-damping', 'y1-oscillators', 'y1-coupled', 'y2-small-oscillations'], skills: ['t-smallosc'] },
      { code: '2.4.2', name: 'Waves', items: 'Harmonic waves, phase, wavelength, wave vector, phase and group velocity; decay in dissipative media; transverse and longitudinal waves; classical Doppler effect; Fermat’s principle and Snell’s law in inhomogeneous media; speed of sound; the Mach cone; energy and energy flux of a wave.', topics: ['al-waves', 'y1-wave-eq', 'al-doppler', 'gcse-sound'], skills: ['t-fermat', 't-mach'] },
      { code: '2.4.3', name: 'Interference and diffraction', items: 'Superposition, coherence, beats, standing waves, Huygens’ principle; thin-film interference; single and double slits; diffraction gratings; Bragg reflection.', topics: ['al-interference', 'al-stationary', 'y1-optics', 'y2-fourier'] },
      { code: '2.4.4', name: 'Electromagnetic waves in matter', items: 'Frequency dependence of permittivity (qualitative); refractive index, dispersion and dissipation; linear polarisation, Brewster’s angle, polarisers, Malus’s law.', topics: ['al-polarisation', 'y2-em-waves', 'gcse-reflection-refraction'] },
      { code: '2.4.5', name: 'Geometrical optics and photometry', items: 'Rays and images; umbra and penumbra; thin lenses and ray construction; luminous flux, illuminance and luminous intensity.', topics: ['gcse-lenses', 'gcse-reflection-refraction', 'ks3-light'] },
      { code: '2.4.6', name: 'Optical devices', items: 'Telescopes and microscopes: magnification and resolving power; resolving power of a grating; interferometers.', topics: ['y1-optics', 'y3-lasers'] }] },
    { code: '2.5', name: 'Relativity', items: 'The principle of relativity; Lorentz transformations of space-time and of energy-momentum; mass–energy equivalence; invariance of the interval and of rest mass; addition of velocities; time dilation, length contraction, relativity of simultaneity; energy and momentum of the photon; relativistic Doppler effect; relativistic equation of motion; conservation laws in collisions.', topics: ['y1-sr', 'y1-rel-dynamics', 'y2-4vectors', 'y2-em-relativity'], skills: ['t-rel'] },
    { code: '2.6', name: 'Quantum physics', parts: [
      { code: '2.6.1', name: 'Probability waves', items: 'Matter waves (E = ħω, p = ħk); energy levels of hydrogen-like atoms (circular orbits) and of a parabolic potential; quantisation of angular momentum; the uncertainty principle, as a theorem and as an estimation tool.', topics: ['y1-qm-intro', 'y1-old-quantum', 'al-photons', 'y2-qho', 'y2-infinite-well'], skills: ['t-uncert'] },
      { code: '2.6.2', name: 'Structure of matter', items: 'Emission and absorption spectra; line width and lifetime; Pauli principle; charge and spin of the electron, neutrino, proton, neutron and photon; Compton scattering; nuclear energy levels (qualitative); α, β and γ decay, fission, fusion, neutron capture; mass defect; half-life; the photoelectric effect.', topics: ['al-spectra', 'al-photoelectric', 'al-nuclear', 'al-decay', 'al-particles', 'gcse-atom'] }] },
    { code: '2.7', name: 'Thermodynamics and statistical physics', parts: [
      { code: '2.7.1', name: 'Classical thermodynamics', items: 'Thermal equilibrium, reversible processes, internal energy, work, heat, entropy; the first and second laws; kinetic theory of the ideal gas, Boltzmann factor, equipartition; isothermal, isobaric, isochoric and adiabatic processes; specific heats; the Carnot cycle and the efficiency of real engines.', topics: ['al-ideal-gas', 'al-thermodynamics', 'y1-thermo', 'y1-entropy', 'gcse-particles', 'y2-boltzmann'], skills: ['t-thermo'] },
      { code: '2.7.2', name: 'Heat transfer and phase transitions', items: 'Boiling, evaporation, melting, sublimation, latent heat; saturated vapour pressure, relative humidity, Dalton’s law; thermal conductivity and continuity of heat flux.', topics: ['al-temperature', 'gcse-shc', 'gcse-heat-transfer'], skills: ['t-heatcirc'] },
      { code: '2.7.3', name: 'Statistical physics', items: 'Planck’s law (qualitatively), Wien’s displacement law, the Stefan–Boltzmann law.', topics: ['y2-blackbody', 'al-astro'], skills: ['m-newton'] }] },
    { code: '3', name: 'Experimental skills', items: 'Safety; common instruments (callipers, Vernier, stopwatch, thermometer, multimeter, lenses, prisms, optical bench, calorimeter); accuracy and the influence of instruments; measuring many periods; reducing noise; sampling density matched to the curve; significant figures; uncertainty analysis (dominant sources, random versus systematic, repetition, propagation); linearisation, straight-line fits with gradient and intercept uncertainties, graph scales and error bars.', topics: ['al-units', 'm-data'], skills: ['e-prop', 'e-linear', 'e-fit', 'e-design', 'e-loading'] },
    { code: '4', name: 'Mathematics', items: 'Algebra and series; trigonometric, exponential and logarithmic functions; plane and solid geometry, conic sections; vectors with dot, cross, double cross and triple products; complex numbers; probability, mean and standard deviation; differentiation, integration with linear substitution, dimensionless integrals; Taylor approximations, perturbation corrections, Newton’s method, bisection, trapezium and rectangle rules.', topics: ['m-vectors', 'm-complex', 'm-differentiation', 'm-integration', 'm-taylor', 'm-numerical-roots', 'm-trig-identities', 'm-polar'], skills: ['m-calc', 'm-vec', 'm-conic', 'm-newton'] }
  ];

  /* ---------- skill cards ---------- */
  const S = (id, g, code, name, idea, when, ex, p, traps, links) => ({ id, g, code, name, idea, when, ex, p, traps, links });
  const SK = [
    S('t-dim', 'theory', '2.1', 'Dimensional analysis',
      'Both sides of an equation carry the same dimensions. When a quantity depends on only a few others, that alone fixes the formula up to a pure number.',
      ['Before solving: guess the form of the answer.', 'After solving: check every term.', 'When the full problem is too hard: the scaling law is often what is really being asked.'],
      { q: 'The period of a simple pendulum can depend only on its mass m, length l and g. Find the form of T.', s: [R`Write $T = C\,m^a l^b g^c$ with C a pure number.`, R`Dimensions: $\mathrm{s} = \mathrm{kg}^a\,\mathrm{m}^{b+c}\,\mathrm{s}^{-2c}$.`, R`Match powers: $a = 0$, $-2c = 1$, $b + c = 0$, so $c = -\tfrac12$ and $b = \tfrac12$.`, R`$T = C\sqrt{l/g}$. The mass drops out; solving the equation of motion gives $C = 2\pi$ for small swings.`] },
      { q: R`Deep-water waves travel at a speed that can depend only on their wavelength λ, on g and on the water density ρ. (a) Find the form of v. (b) The exact result has $C = 1/\sqrt{2\pi}$: find the speed of an ocean swell with λ = 100 m.`, a: 'v = C√(gλ); 12.5 m/s', s: [R`$v = C\,\lambda^a g^b \rho^c$. Only ρ contains kilograms, so $c = 0$.`, R`$\mathrm{m\,s^{-1}} = \mathrm{m}^{a+b}\,\mathrm{s}^{-2b}$ gives $b = \tfrac12$ and $a = \tfrac12$: $v = C\sqrt{g\lambda}$.`, R`$v = \sqrt{9.81 \times 100/2\pi}$ = 12.5 m/s.`] },
      [R`Dimensionless groups (angles, ratios such as h/l) can enter in any way: you can then only conclude $T = \sqrt{l/g}\,f(\theta_0)$.`, 'It never gives the numerical factor: 2π came from actually solving the motion.'], ['al-units', 'al-shm']),
    S('t-limits', 'theory', '2.1', 'Limiting and special cases',
      'A correct formula reduces to the answers you already know when a parameter goes to zero, to infinity, or equals another. One failed limit proves it wrong; several passed limits are strong evidence.',
      ['Every final answer in an olympiad paper.', 'Choosing between two candidate expressions.', 'Hunting a sign error or a missing factor.'],
      { q: R`Atwood machine: is $a = \dfrac{(m_1 - m_2)g}{m_1 + m_2}$ plausible?`, s: [R`$m_2 = 0$: $a = g$, free fall of $m_1$. ✓`, R`$m_1 = m_2$: $a = 0$, balance. ✓`, R`Swapping $m_1$ and $m_2$ reverses the sign of a, as the symmetry of the set-up requires. ✓`, R`$m_1 \gg m_2$: $a \to g$ from below, never above. ✓`] },
      { q: R`A proposed range for a projectile launched from height h at speed u and angle θ above the horizontal is $R = \dfrac{u^2\sin\theta\cos\theta}{g}\left[1 + \sqrt{1 + \dfrac{2gh}{u^2\sin^2\theta}}\right]$. Check the limits h = 0 and θ → 0, then find R for u = 10 m/s, θ = 0 and h = 5.0 m.`, a: '10.1 m', s: [R`$h = 0$: the bracket is 2, giving $R = u^2\sin2\theta/g$. ✓`, R`$\theta \to 0$: the root is about $\sqrt{2gh}/(u\sin\theta)$, so $R \to u\cos\theta\sqrt{2h/g}$, a horizontal launch with fall time $\sqrt{2h/g}$. ✓`, R`$R = 10 \times \sqrt{2 \times 5.0/9.81}$ = 10.1 m.`] },
      ['A wrong formula can pass a limit: limits rule formulas out, they do not prove them.', 'Take limits of the final answer, not of a step that already assumed (for example) θ ≠ 0.'], ['al-dynamics', 'al-projectile']),
    S('t-fermi', 'theory', '2.1', 'Order-of-magnitude estimates',
      'Most quantities are fixed to within a factor of a few by one or two physical scales. Estimate each factor to one significant figure, keep the powers of ten honest, and say which effect dominates.',
      ['“Estimate the order of magnitude of…” parts.', 'Deciding which effect can be neglected.', 'Checking that a computed number is sane.'],
      { q: 'How many air molecules are in a classroom?', s: [R`Room ≈ 10 m × 8 m × 3 m ≈ 240 m³.`, R`From the ideal-gas law, $n = p/k_BT = 10^5/(1.38\times10^{-23} \times 293) \approx 2.5\times10^{25}\ \mathrm{m^{-3}}$.`, R`$N \approx 240 \times 2.5\times10^{25} \approx 6\times10^{27}$.`] },
      { q: 'Estimate the mass of the Earth’s atmosphere from the sea-level pressure (1.0 × 10⁵ Pa) and the Earth’s radius (6.4 × 10⁶ m).', a: '5 × 10^18 kg', s: [R`Each square metre of ground supports the weight of the air above it: $mg = pA$.`, R`$A = 4\pi R^2 = 5.1\times10^{14}\ \mathrm{m^2}$.`, R`$m = pA/g \approx 10^5 \times 5.1\times10^{14}/9.8 \approx 5\times10^{18}$ kg.`] },
      ['Uniform g is fine here only because the atmosphere is thin compared with the Earth’s radius.', 'Quote one significant figure: more claims a precision you do not have.'], ['al-ideal-gas', 'gcse-particles']),
    S('t-symmetry', 'theory', '2.1', 'Symmetry',
      'If a system looks the same after a reflection, rotation or relabelling, so does its solution. Points related by a symmetry share a potential, temperature or speed, which lets you join or cut them.',
      ['Resistor and capacitor networks.', 'Fields of symmetric charges and currents, before using Gauss or Ampère.', 'Equilibrium shapes and normal modes.'],
      { q: 'Twelve equal resistors R form the edges of a cube. Find the resistance between opposite corners A and B.', s: ['By the threefold symmetry about the diagonal AB, the three corners next to A share one potential, and so do the three next to B.', 'A current I splits into I/3 on each edge leaving A, then I/6 on each of the six middle edges, and recombines as I/3 into B.', R`Along any path: $V = \tfrac13IR + \tfrac16IR + \tfrac13IR = \tfrac56IR$.`, R`$R_{AB} = \tfrac56R$.`] },
      { q: 'The same cube, with each resistor 12 Ω. Find the resistance between two corners at opposite ends of a face diagonal.', a: '9.0 Ω', s: [R`Put $V_A = V$ and $V_B = 0$. The reflection that swaps A and B leaves four corners in place (the other two corners of that face and the two above them), so they sit at $V/2$.`, R`The corner above A, at potential a, joins A and two corners at V/2. No net current there: $(V - a) + 2(V/2 - a) = 0$, so $a = \tfrac23V$.`, R`Current out of A: $\dfrac{V}{2R} + \dfrac{V}{2R} + \dfrac{V}{3R} = \dfrac{4V}{3R}$, so $R_{AB} = \tfrac34R$ = 9.0 Ω.`] },
      ['Symmetry says which points are equal; a conservation law (current at a node) still fixes their values.', 'Check that the symmetry maps the source to itself or to its negative, not just the shape of the wires.'], ['al-dc-circuits', 'y1-gauss']),
    S('t-taylor', 'theory', '2.1 · 4.8', 'Small-parameter expansions',
      R`When something is small, expand to the first term that does not vanish: $(1 + x)^n \approx 1 + nx$, $\sin x \approx x$, $\cos x \approx 1 - \tfrac12x^2$. Most “small oscillation” and “far away” parts are this single move.`,
      ['Small oscillations about an equilibrium.', 'Fields far from, or very near, a source.', 'Corrections to a known result.'],
      { q: R`The field on the axis of a ring of charge Q and radius R, at distance x, is $E = \dfrac{kQx}{(x^2 + R^2)^{3/2}}$. Find its form near the centre and far away.`, s: [R`Near the centre, $x \ll R$: $E \approx kQx/R^3$, growing linearly with x.`, R`Far away: $E = \dfrac{kQ}{x^2}\left(1 + \dfrac{R^2}{x^2}\right)^{-3/2} \approx \dfrac{kQ}{x^2}\left(1 - \dfrac{3R^2}{2x^2}\right)$: a point charge plus a small correction.`, 'The linear field near the centre pulls an opposite charge back: simple harmonic motion along the axis.'] },
      { q: 'An electron is released on the axis of a ring of radius 5.0 cm carrying +1.0 nC, close to its centre. Find the angular frequency of its small oscillations.', a: '1.1 × 10^8 rad/s', s: [R`The restoring force is $F \approx -\dfrac{kQe}{R^3}x$, so $\omega^2 = \dfrac{kQe}{m_eR^3}$.`, R`$\omega^2 = \dfrac{8.99\times10^9 \times 1.0\times10^{-9} \times 1.60\times10^{-19}}{9.11\times10^{-31} \times 1.25\times10^{-4}} = 1.26\times10^{16}\ \mathrm{s^{-2}}$.`, 'ω ≈ 1.1 × 10⁸ rad/s.'] },
      ['If the first-order terms cancel, the answer lives at second order: keep enough terms.', 'Check that the small parameter really is small in the regime asked about.', 'Sideways, in the plane of the ring, the same electron is pushed outwards: the equilibrium is stable only along the axis.'], ['m-taylor', 'al-efields']),
    S('t-cons', 'theory', '2.2.3', 'Conservation laws first',
      'Before drawing forces, ask what is conserved, and when. Momentum is conserved during an impact (the impulsive forces dominate), energy afterwards if nothing dissipates, angular momentum about any point where the external torque vanishes.',
      ['Collisions followed by motion.', 'Anything with friction or an impact somewhere in the story.', 'Problems where the forces are complicated but the initial and final states are simple.'],
      { q: 'Ballistic pendulum: a bullet of mass m embeds itself in a block of mass M hanging on a string; the block rises a height h. Find the bullet’s speed.', s: [R`During the short impact the string is vertical: horizontal momentum is conserved, $mv = (M + m)V$. Energy is not: the collision is inelastic.`, R`Afterwards nothing dissipates: $\tfrac12(M + m)V^2 = (M + m)gh$, so $V = \sqrt{2gh}$.`, R`$v = \dfrac{M + m}{m}\sqrt{2gh}$.`] },
      { q: 'With m = 10 g, M = 2.0 kg and h = 5.0 cm, find the bullet’s speed and the fraction of its kinetic energy lost in the impact.', a: '199 m/s; 99.5 %', s: [R`$V = \sqrt{2 \times 9.81 \times 0.050}$ = 0.990 m/s.`, R`$v = (2.01/0.010) \times 0.990$ = 199 m/s.`, R`Kinetic energy kept: $\dfrac{\tfrac12(M + m)V^2}{\tfrac12mv^2} = \dfrac{m}{M + m}$ = 0.50 %: 99.5 % becomes heat and deformation.`] },
      ['Using energy conservation across the impact is the classic error.', 'For a rigid pendulum the pivot can push sideways during the impact: conserve angular momentum about the pivot instead of linear momentum.'], ['al-momentum', 'al-energy', 'y1-angular-momentum']),
    S('t-rotframe', 'theory', '2.2.3', 'Rotating frames',
      R`In a frame rotating at ω, add the centrifugal force $m\omega^2r$ outwards, and the Coriolis force $-2m\boldsymbol\omega\times\mathbf v$ on moving bodies. Equilibrium in that frame is an extremum of the effective potential $U - \tfrac12m\omega^2r^2$.`,
      ['Anything spinning steadily: buckets, beads on rotating wires, planets.', 'Shapes of free surfaces.', 'Stability of positions in a rotating system.'],
      { q: 'Water in a bucket spins steadily at angular velocity ω. Find the shape of its surface.', s: [R`In the rotating frame the water is at rest, so its surface is a surface of constant effective potential: $gz - \tfrac12\omega^2r^2$ = constant.`, R`$z(r) = z_0 + \dfrac{\omega^2r^2}{2g}$: a paraboloid.`, R`Check: the slope $dz/dr = \omega^2r/g$ is the ratio of centrifugal force to weight, as it must be for a surface perpendicular to the effective gravity.`] },
      { q: 'How fast must the bucket spin for the water 10 cm from the axis to stand 2.0 cm higher than at the centre? Give ω and the rate in revolutions per minute.', a: '6.3 rad/s; 60 rpm', s: [R`$\omega^2 = \dfrac{2gz}{r^2} = \dfrac{2 \times 9.81 \times 0.020}{0.10^2} = 39\ \mathrm{s^{-2}}$.`, R`ω = 6.3 rad/s, which is $6.3 \times 60/2\pi$ ≈ 60 revolutions per minute.`] },
      ['Centrifugal force exists only in the rotating frame: never add it to an equation written in an inertial frame.', 'The Coriolis force does no work, but it turns the velocity of anything moving in the rotating frame.'], ['al-circular', 'y1-angular-momentum']),
    S('t-rolling', 'theory', '2.2.1 · 2.2.3', 'Rolling and the instantaneous axis',
      R`Rolling without slipping means the contact point is momentarily at rest, so $v = \omega r$. The body is then turning about the contact point: its kinetic energy is $\tfrac12I_P\omega^2$ with $I_P = I_{cm} + mr^2$.`,
      ['Balls, cylinders and wheels on slopes.', 'Velocities of points on a rolling body (the top moves at 2v).', 'Races between shapes.'],
      { q: R`A body of mass m, radius r and moment of inertia $I = \beta mr^2$ rolls down a slope at angle θ. Find its acceleration.`, s: [R`Energy after a drop h: $mgh = \tfrac12mv^2(1 + \beta)$.`, R`So $v^2 = \dfrac{2gh}{1 + \beta}$: like sliding, with g replaced by $g/(1 + \beta)$.`, R`Along the slope $h = s\sin\theta$, so $a = \dfrac{g\sin\theta}{1 + \beta}$.`] },
      { q: 'A solid sphere (β = 2/5) and a hoop (β = 1) are released together on a 30° slope. Find both accelerations, and say which reaches the bottom first.', a: '3.5 m/s² (sphere); 2.45 m/s² (hoop); the sphere', s: [R`Sphere: $a = \dfrac{9.81 \times 0.5}{1.4}$ = 3.5 m/s².`, R`Hoop: $a = \dfrac{9.81 \times 0.5}{2}$ = 2.45 m/s².`, 'The sphere arrives first, whatever the masses and radii.'] },
      ['Static friction does no work when there is no slipping, which is why energy is conserved.', 'Mass and radius cancel: only the shape factor β matters.'], ['y1-rotation', 'al-energy']),
    S('t-smallosc', 'theory', '2.4.1', 'Energy method for small oscillations',
      R`Write the energy in one coordinate q: $E = \tfrac12\mu\dot q^2 + U(q)$. Near a minimum $q_0$, the angular frequency is $\omega^2 = U''(q_0)/\mu$. No free-body diagram needed.`,
      ['Any oscillation with rolling, pulleys or several moving parts.', 'Testing whether an equilibrium is stable (sign of U″).', 'Physical pendulums.'],
      { q: 'A solid cylinder of radius r rolls without slipping inside a fixed cylindrical bowl of radius R. Find the frequency of small oscillations.', s: [R`Let φ be the angle of the cylinder’s centre from the bottom. The centre moves on a circle of radius R − r: $v = (R - r)\dot\phi$, and rolling gives spin $\omega = v/r$.`, R`Kinetic energy: $\tfrac12mv^2 + \tfrac12\cdot\tfrac12mr^2\omega^2 = \tfrac34m(R - r)^2\dot\phi^2$, so $\mu = \tfrac32m(R - r)^2$.`, R`Potential energy $U = mg(R - r)(1 - \cos\phi)$, so $U''(0) = mg(R - r)$.`, R`$\omega^2 = \dfrac{U''}{\mu} = \dfrac{2g}{3(R - r)}$.`] },
      { q: 'A marble (a solid sphere, I = 2/5 mr²) rolls inside a bowl with R − r = 0.20 m. Find the period of small oscillations.', a: '1.06 s', s: [R`Kinetic energy: $\tfrac12mv^2(1 + \tfrac25) = \tfrac{7}{10}m(R - r)^2\dot\phi^2$, so $\mu = \tfrac75m(R - r)^2$.`, R`$\omega^2 = \dfrac{mg(R - r)}{\tfrac75m(R - r)^2} = \dfrac{5g}{7(R - r)}$.`, R`$T = 2\pi\sqrt{\dfrac{7 \times 0.20}{5 \times 9.81}}$ = 1.06 s.`] },
      ['The spin is ω = v/r with v the speed of the centre: using R in place of r is the usual slip.', 'If U″(q₀) < 0 the equilibrium is unstable and the “frequency” is a growth rate.'], ['al-shm', 'y2-small-oscillations']),
    S('t-orbits', 'theory', '2.2.4', 'Orbits and the vis-viva equation',
      R`For any Kepler orbit with semi-major axis a, the energy is $E = -GMm/2a$. Energy conservation then gives the speed anywhere: $v^2 = GM\left(\dfrac2r - \dfrac1a\right)$. Angular momentum $rv_\perp$ stays constant.`,
      ['Transfers between orbits, escape, comets.', 'Speeds at perihelion and aphelion.', 'Periods from Kepler’s third law.'],
      { q: 'A satellite is in a circular orbit of radius r. By what factor must its speed rise for it to escape?', s: [R`Circular orbit: $a = r$, so $v_c^2 = GM/r$.`, R`Escape: total energy zero, $a \to \infty$: $v_e^2 = 2GM/r$.`, R`$v_e = \sqrt2\,v_c$: a 41 % increase in speed.`] },
      { q: 'A comet has perihelion 0.60 AU and aphelion 35 AU. Find its eccentricity and its orbital period.', a: 'e = 0.97; 75 years', s: [R`$a = \tfrac12(0.60 + 35) = 17.8$ AU.`, R`$e = \dfrac{r_a - r_p}{r_a + r_p} = \dfrac{34.4}{35.6} = 0.97$.`, R`For orbits about the Sun, in years and AU, $T^2 = a^3$: $T = 17.8^{3/2}$ = 75 years.`] },
      ['T² = a³ in years and AU holds only for bodies orbiting the Sun whose own mass is negligible.', 'Use the semi-major axis: not the mean distance in time, nor the average of the two extremes of speed.'], ['al-gravfields', 'y2-central-force']),
    S('t-images', 'theory', '2.3.2', 'Image charges',
      'A grounded conducting plane holds V = 0. Replace it by an opposite charge at the mirror point: the pair gives V = 0 on the plane, and by uniqueness that is the true field on the charge’s side.',
      ['Charges near grounded planes, spheres and corners.', 'Forces and energies of charges near conductors.', 'Induced charge distributions.'],
      { q: 'A charge q sits at distance d from a large grounded conducting plane. Find the force on it and the total induced charge.', s: [R`Image: $-q$ at distance d behind the plane, so the separation is 2d.`, R`Force: an attraction $F = \dfrac{q^2}{4\pi\varepsilon_0(2d)^2}$.`, R`Gauss’s law over a surface hugging the plane: the induced charge totals $-q$.`] },
      { q: 'How much work is needed to move a charge of 1.0 nC from 1.0 cm in front of a grounded plane to infinity?', a: '2.2 × 10^-7 J', s: [R`At distance x the force is $\dfrac{q^2}{16\pi\varepsilon_0x^2}$.`, R`$W = \displaystyle\int_d^\infty\frac{q^2\,dx}{16\pi\varepsilon_0x^2} = \frac{q^2}{16\pi\varepsilon_0d}$.`, R`$W = \dfrac{8.99\times10^9 \times (1.0\times10^{-9})^2}{4 \times 0.010}$ = 2.2 × 10⁻⁷ J.`] },
      ['The work is half the energy of a fixed pair of charges 2d apart: the image moves as the charge moves.', 'The image is fictitious: there is no field inside the conductor.'], ['y1-potential', 'y2-multipoles']),
    S('t-superpose', 'theory', '2.3.2', 'Superposition of shapes',
      'A hole is the whole body plus the same shape with the opposite charge or current. Fields add, so an awkward shape becomes two symmetric ones whose fields Gauss or Ampère give at once.',
      ['Cavities in charged spheres and current-carrying wires.', 'Sheets with holes, discs with gaps.', 'Any field that is the difference of two simple ones.'],
      { q: 'A uniformly charged sphere (density ρ) contains a spherical cavity whose centre is displaced by a from the sphere’s centre. Find the field inside the cavity.', s: [R`Inside a uniform sphere, $\mathbf E = \dfrac{\rho}{3\varepsilon_0}\mathbf r$ (Gauss’s law).`, R`Cavity = full sphere + a sphere of density −ρ centred at $\mathbf a$: $\mathbf E = \dfrac{\rho}{3\varepsilon_0}\left[\mathbf r - (\mathbf r - \mathbf a)\right] = \dfrac{\rho\,\mathbf a}{3\varepsilon_0}$.`, 'The field in the cavity is uniform, along the line joining the centres.'] },
      { q: 'A long straight conductor carries a uniform current density J = 1.0 × 10⁶ A/m² along its length. It has a long cylindrical hole parallel to its axis, with the hole’s axis 1.0 cm from the conductor’s axis. Find the magnetic field inside the hole.', a: '6.3 × 10^-3 T, uniform', s: [R`Inside a uniform cylinder, Ampère’s law gives $\mathbf B = \tfrac12\mu_0\mathbf J\times\mathbf r$.`, R`Hole = conductor + a cylinder carrying −J: $\mathbf B = \tfrac12\mu_0\mathbf J\times\mathbf d$, the same everywhere in the hole.`, R`$B = \tfrac12 \times 4\pi\times10^{-7} \times 1.0\times10^6 \times 0.010$ = 6.3 × 10⁻³ T.`] },
      ['Superposition needs linear equations: fields add, but forces on charges induced by those fields need care.'], ['y1-gauss', 'y1-magnetostatics']),
    S('t-ladder', 'theory', '2.3.4', 'Infinite networks and non-linear elements',
      'An infinite ladder looks the same after you remove its first rung, so its resistance satisfies an equation in itself. For an element with a given I–V curve, draw the load line of the rest of the circuit and read off the crossing.',
      ['Infinite ladders and grids.', 'Diodes, lamps and other non-linear elements.', 'Networks that repeat.'],
      { q: 'A ladder has series resistors R and shunt resistors R, repeating forever. Find its input resistance.', s: [R`Removing the first cell leaves the same ladder: $R_\infty = R + \dfrac{R\,R_\infty}{R + R_\infty}$.`, R`$R_\infty^2 - RR_\infty - R^2 = 0$.`, R`$R_\infty = \tfrac12(1 + \sqrt5)R \approx 1.62R$ (the positive root).`] },
      { q: 'Repeat for series resistors of 10 Ω and shunt resistors of 20 Ω.', a: '20 Ω', s: [R`$R_\infty = 10 + \dfrac{20R_\infty}{20 + R_\infty}$.`, R`$R_\infty^2 - 10R_\infty - 200 = 0$.`, R`$R_\infty = 20$ Ω.`] },
      ['Take the positive root: a passive network cannot have negative resistance.', 'The self-similar argument needs the infinite ladder, though a long finite one converges quickly to the same value.'], ['al-dc-circuits']),
    S('t-phasor', 'theory', '2.3.4 · 2.4.1', 'Complex impedance and resonance',
      R`For sinusoidal signals, give each element an impedance: R, $i\omega L$, $1/(i\omega C)$. The circuit then obeys Ohm’s and Kirchhoff’s laws with complex numbers: amplitudes are moduli, phases are arguments.`,
      ['AC circuits of any shape.', 'Resonance, filters, phase shifts.', 'Driven mechanical oscillators, by the mechanical–electrical analogy.'],
      { q: 'A series RLC circuit is driven at angular frequency ω with amplitude V₀. Find the current amplitude.', s: [R`$Z = R + i\left(\omega L - \dfrac{1}{\omega C}\right)$.`, R`$I_0 = \dfrac{V_0}{|Z|} = \dfrac{V_0}{\sqrt{R^2 + (\omega L - 1/\omega C)^2}}$.`, R`Largest at $\omega_0 = 1/\sqrt{LC}$, where $Z = R$. The quality factor $Q = \dfrac1R\sqrt{L/C}$ sets how sharp the peak is.`] },
      { q: 'L = 10 mH, C = 1.0 µF and R = 10 Ω in series. Find the resonant frequency in hertz and the quality factor.', a: '1.6 kHz; Q = 10', s: [R`$f_0 = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{10^{-8}}}$ = 1.6 kHz.`, R`$Q = \dfrac{1}{10}\sqrt{\dfrac{10^{-2}}{10^{-6}}} = 10$.`] },
      [R`Physical quantities are real parts; average power is $\tfrac12\mathrm{Re}(VI^*)$, never the product of two complex amplitudes.`, 'At resonance the voltage across L or C alone is Q times the supply: ten times here.'], ['al-ac', 'y1-faraday', 'y1-oscillators']),
    S('t-fermat', 'theory', '2.4.2', 'Fermat’s principle in graded media',
      R`Light follows a path of stationary optical length $\int n\,ds$. Where the index changes only with height, $n\sin\theta$ stays constant along a ray (θ from the vertical): Snell’s law, layer by layer.`,
      ['Mirages, looming, bent starlight.', 'Optical fibres with graded index.', 'Any refraction problem with a continuously varying medium.'],
      { q: 'Why does a road look wet on a hot day?', s: ['Air just above the hot road is less dense, so its refractive index is slightly lower.', R`A ray heading down at a shallow angle keeps $n\sin\theta$ fixed; as n falls, sin θ grows, so the ray bends towards the horizontal.`, 'If it reaches sin θ = 1 before the road, it turns back up: you see the sky below the horizon, which looks like a reflection in water.'] },
      { q: 'In a layered medium the refractive index falls with height. A ray starts at the bottom, where n = 1.50, travelling at 50° to the vertical. At what value of n does the ray become horizontal?', a: '1.15', s: [R`$n\sin\theta$ is constant: $1.50\sin50^\circ = n\sin90^\circ$.`, 'n = 1.15. If the index falls below this, the ray turns back down.'] },
      ['θ is measured from the normal to the layers.', 'A ray always bends towards the region of higher index.'], ['gcse-reflection-refraction', 'y1-optics']),
    S('t-mach', 'theory', '2.4.2', 'Doppler effect and shock cones',
      R`A source moving faster than its waves leaves a cone of half-angle α with $\sin\alpha = c/v$. Below the wave speed, counting wavefronts gives the classical Doppler shift $f' = f\,\dfrac{c \pm v_o}{c \mp v_s}$.`,
      ['Sonic booms and wakes.', 'Moving sources and observers.', 'Speed measurements by reflection.'],
      { q: 'Derive the angle of the cone.', s: ['Sound emitted a time t ago now fills a sphere of radius ct, centred where the source was then.', 'The source has since moved a distance vt.', R`The envelope of all these spheres is a cone with $\sin\alpha = ct/vt = c/v$.`] },
      { q: 'A jet flies level at Mach 2.0 at a height of 2.0 km. How long after it passes directly overhead do you hear the boom? (c = 340 m/s)', a: '5.1 s', s: [R`$\sin\alpha = 1/2$, so α = 30°.`, R`The cone reaches you when the jet is ahead by $x = h/\tan\alpha = 2000/\tan30^\circ$ = 3.46 km.`, 'At 680 m/s that takes 3460/680 = 5.1 s.'] },
      ['The boom is not a single bang made when the plane “breaks the sound barrier”: the cone is dragged along the whole time.', 'Real air is not uniform: temperature gradients bend the cone and can keep it off the ground.'], ['al-doppler', 'gcse-sound']),
    S('t-rel', 'theory', '2.5', 'Four-momentum invariants',
      R`$E^2 - (pc)^2 = (mc^2)^2$ is the same in every frame, and so is $s = (\sum E)^2 - (\sum\mathbf pc)^2$ for any group of particles. Evaluate s in the lab before a reaction and in the centre-of-momentum frame after it: thresholds take two lines.`,
      ['Reaction thresholds.', 'Decays and collisions.', 'Any problem mixing a lab frame and a rest frame.'],
      { q: R`Find the threshold for $p + p \to p + p + p + \bar p$ on a proton at rest.`, s: [R`Before, in the lab: $s = (E + mc^2)^2 - (pc)^2 = 2(mc^2)^2 + 2Emc^2$.`, R`At threshold the four products are at rest in the centre-of-momentum frame: $s = (4mc^2)^2$.`, R`$E = 7mc^2$: the beam needs kinetic energy $6mc^2 \approx 5.6$ GeV.`] },
      { q: R`Find the threshold photon energy for $\gamma + p \to p + \pi^0$ on protons at rest ($m_pc^2 = 938.3$ MeV, $m_\pi c^2 = 135.0$ MeV).`, a: '145 MeV', s: [R`$s = (E_\gamma + m_pc^2)^2 - E_\gamma^2 = (m_pc^2)^2 + 2E_\gamma m_pc^2$.`, R`At threshold $s = \left[(m_p + m_\pi)c^2\right]^2$.`, R`$E_\gamma = m_\pi c^2 + \dfrac{(m_\pi c^2)^2}{2m_pc^2} = 135.0 + 9.7$ = 145 MeV.`] },
      ['Rest mass is not additive and kinetic energy is not conserved in such reactions: only total energy and momentum are.', 'The 9.7 MeV above the pion’s rest energy is the kinetic energy the products need to carry the photon’s momentum.'], ['y1-rel-dynamics', 'y2-4vectors']),
    S('t-uncert', 'theory', '2.6.1', 'The uncertainty principle as an estimate',
      R`Confining a particle to a size Δx gives it momentum of order $\hbar/\Delta x$ and kinetic energy of order $\hbar^2/(2m\Delta x^2)$. Minimising the total energy over the size gives ground-state scales without solving anything.`,
      ['Sizes and energies of atoms, nuclei, stars.', 'Zero-point energy.', 'Deciding whether a system must be treated quantum mechanically.'],
      { q: 'Estimate the size and energy of the hydrogen atom.', s: [R`Take $E(r) \approx \dfrac{\hbar^2}{2m_er^2} - \dfrac{e^2}{4\pi\varepsilon_0r}$.`, R`$dE/dr = 0$ gives $r = \dfrac{4\pi\varepsilon_0\hbar^2}{m_ee^2} = a_0 = 0.053$ nm.`, R`Then $E = -\dfrac{e^2}{8\pi\varepsilon_0a_0} = -13.6$ eV. That this is exact is partly luck.`] },
      { q: R`Estimate the minimum kinetic energy of a nucleon confined in a nucleus of radius 5 fm. Use $p \approx \hbar/r$, $mc^2 = 939$ MeV and $\hbar c = 197$ MeV fm.`, a: '0.8 MeV', s: [R`$E \approx \dfrac{(\hbar c)^2}{2mc^2r^2}$.`, R`$E \approx \dfrac{197^2}{2 \times 939 \times 25}$ ≈ 0.8 MeV.`, 'Nuclear energies are about a million times atomic ones: the size is 10⁵ times smaller and the mass about 2000 times larger.'] },
      ['Factors of 2 mean nothing here: the method gives a scale, not a number.', 'If pc comes out comparable to mc², use relativistic kinematics (an electron confined in a nucleus would need it).'], ['y1-qm-intro', 'y2-infinite-well']),
    S('t-thermo', 'theory', '2.7.1', 'Entropy bookkeeping and maximum work',
      'The total entropy never decreases. The most work you can extract from bodies out of equilibrium comes from a reversible process, for which the total entropy change is exactly zero: that condition fixes the final state.',
      ['Mixing, heat exchange, free expansion.', 'Maximum work and efficiency problems.', 'Engines working between bodies whose temperatures change.'],
      { q: R`Two identical bodies of heat capacity C, at $T_1$ and $T_2$, are put in contact. Find the entropy produced.`, s: [R`Final temperature $T_f = \tfrac12(T_1 + T_2)$, by energy conservation.`, R`$\Delta S = C\ln\dfrac{T_f}{T_1} + C\ln\dfrac{T_f}{T_2} = C\ln\dfrac{T_f^2}{T_1T_2}$.`, 'This is positive, because the arithmetic mean of two numbers exceeds their geometric mean.'] },
      { q: 'Instead, a reversible engine works between the two bodies until they reach a common temperature. With C = 1.0 kJ/K, T₁ = 400 K and T₂ = 100 K, find the final temperature and the work extracted.', a: '200 K; 1.0 × 10^5 J', s: [R`Reversible: $\Delta S = C\ln\dfrac{T_f^2}{T_1T_2} = 0$, so $T_f = \sqrt{T_1T_2}$ = 200 K.`, R`Work = heat given up by the hot body − heat taken by the cold one: $W = C(T_1 + T_2 - 2T_f)$.`, R`$W = 1000 \times (500 - 400)$ = 1.0 × 10⁵ J.`] },
      ['There is no single Carnot efficiency when the temperatures change: integrate, or use entropy as here.', 'Entropy is a function of state: compute ΔS along any convenient reversible path, even when the real process was irreversible.'], ['y1-entropy', 'al-thermodynamics']),
    S('t-heatcirc', 'theory', '2.7.2', 'Heat flow as a circuit',
      R`Steady conduction obeys an Ohm’s law: heat current $P = \Delta T/R_{th}$, with $R_{th} = L/(kA)$ for a slab. Layers in series add their resistances; parallel paths add their conductances.`,
      ['Walls, windows, insulated pipes.', 'Composite rods with several materials.', 'Estimating which layer controls the heat loss.'],
      { q: 'A wall of brick (k = 0.7 W m⁻¹ K⁻¹, 20 cm) lined with insulation (k = 0.04 W m⁻¹ K⁻¹, 5 cm) has an area of 10 m². Find the heat loss for a 20 K temperature difference.', s: [R`$R_{brick} = \dfrac{0.20}{0.7 \times 10} = 0.029$ K/W and $R_{ins} = \dfrac{0.05}{0.04 \times 10} = 0.125$ K/W.`, 'In series: R = 0.154 K/W.', 'P = 20/0.154 ≈ 130 W. The thin insulation does most of the work.'] },
      { q: 'Double glazing: two 4.0 mm glass panes (k = 0.80 W m⁻¹ K⁻¹) with a 10 mm gap of still air (k = 0.025 W m⁻¹ K⁻¹) between them, area 1.0 m², temperature difference 20 K. Estimate the heat flow, treating the air as a still conductor.', a: '49 W', s: [R`$R_{glass} = \dfrac{0.0040}{0.80} = 0.005$ K/W per pane; $R_{air} = \dfrac{0.010}{0.025} = 0.40$ K/W.`, 'R = 0.41 K/W, so P = 20/0.41 ≈ 49 W.'] },
      ['Real air gaps convect, and thin air films on the outside surfaces add resistance: “still air” is an idealisation.', 'Radiation is a parallel path that grows roughly like T³: at high temperature it dominates.'], ['gcse-heat-transfer']),
    S('t-surface', 'theory', '2.2.5', 'Surface tension and capillarity',
      R`A liquid surface stores energy γ per unit area, which is the same as a tension γ per unit length. A curved surface carries a pressure jump: $\Delta p = 2\gamma/r$ for a droplet, twice that for a soap bubble, which has two surfaces.`,
      ['Capillary rise, droplets, bubbles.', 'Insects on water, floating needles.', 'Energy of breaking up a liquid into drops.'],
      { q: 'Derive the excess pressure inside a droplet of radius r.', s: [R`Let the radius grow by dr: the surface energy rises by $\gamma\cdot8\pi r\,dr$.`, R`That energy is the work done by the excess pressure: $\Delta p\cdot4\pi r^2\,dr$.`, R`So $\Delta p = 2\gamma/r$.`] },
      { q: 'Water (γ = 0.072 N/m, contact angle 0) stands in a glass capillary of inner radius 0.10 mm. How high does it rise?', a: '15 cm', s: [R`The surface pulls up with $2\pi r\gamma\cos\theta$, balancing the weight $\rho\pi r^2hg$.`, R`$h = \dfrac{2\gamma\cos\theta}{\rho gr} = \dfrac{2 \times 0.072}{1000 \times 9.81 \times 1.0\times10^{-4}}$ = 0.15 m.`] },
      ['Use the radius of curvature of the meniscus; it equals the tube’s radius only for zero contact angle.', 'A soap bubble has two surfaces: Δp = 4γ/r.'], ['al-fluids', 'y1-fluids']),
    S('t-bernoulli', 'theory', '2.2.5', 'Continuity and Bernoulli',
      R`For steady, incompressible flow without viscosity, $Av$ is constant along a tube and $p + \tfrac12\rho v^2 + \rho gz$ is constant along a streamline. Draining tanks, siphons and Venturi meters all follow.`,
      ['Jets and draining tanks.', 'Pressure differences in pipes.', 'Lift and suction effects (with care).'],
      { q: 'Find the speed of water leaving a small hole a depth h below the surface of a wide tank.', s: ['The top surface and the jet are both at atmospheric pressure, and the top of a wide tank barely moves.', R`$\rho gh = \tfrac12\rho v^2$, so $v = \sqrt{2gh}$: the speed of free fall from the surface (Torricelli).`] },
      { q: 'A cylindrical tank drains through a small hole at its base whose area is 1/400 of the tank’s cross-section. How long does it take to empty from a depth of 1.0 m?', a: '181 s', s: [R`Continuity: $A\dfrac{dh}{dt} = -a\sqrt{2gh}$.`, R`Separate and integrate from H to 0: $t = \dfrac Aa\sqrt{\dfrac{2H}{g}}$.`, R`$t = 400 \times \sqrt{2 \times 1.0/9.81}$ = 181 s.`] },
      ['A real jet contracts after the hole (the vena contracta, about 0.6 of the area), so a real tank takes longer.', 'Bernoulli needs steady flow; a slowly draining tank is close enough.'], ['y1-fluids', 'al-fluids']),
    /* experimental */
    S('e-prop', 'experiment', '3.5', 'Propagating uncertainties',
      R`For a product or quotient of independent measurements, add relative uncertainties in quadrature: for $q = x^ay^b$, $\left(\dfrac{\delta q}{q}\right)^2 = \left(a\dfrac{\delta x}{x}\right)^2 + \left(b\dfrac{\delta y}{y}\right)^2$. The largest term usually dominates, so find it first.`,
      ['Every derived result in the experimental exam.', 'Deciding what to measure more carefully.', 'Reporting a final value.'],
      { q: 'Why time 20 swings of a pendulum rather than one?', s: ['Your reaction time adds roughly 0.2 s to any timing, however long.', 'Timing 20 periods spreads that over 20: about 0.01 s per period instead of 0.2 s.', R`In $g = 4\pi^2L/T^2$ the relative error of T counts twice, so it is the term most worth reducing.`] },
      { q: 'A pendulum of length L = 1.000 ± 0.002 m takes 40.1 ± 0.2 s for 20 swings. Find g with its uncertainty.', a: '9.82 ± 0.10 m/s²', s: [R`T = 2.005 ± 0.010 s, so $g = 4\pi^2 \times 1.000/2.005^2$ = 9.82 m/s².`, R`$\dfrac{\delta g}{g} = \sqrt{0.002^2 + (2 \times 0.0050)^2} = 0.010$.`, 'g = 9.82 ± 0.10 m/s². The timing dominates.'] },
      ['Quadrature assumes independent errors; a shared systematic error adds linearly.', 'Give the uncertainty to one or two significant figures, and round the value to match.'], ['al-units', 'm-data']),
    S('e-linear', 'experiment', '3.6', 'Linearise, then fit a straight line',
      'Rearrange the expected law into Y = mX + c, with X and Y built from what you measure. A straight graph tests the law; its gradient and intercept give the constants, with their uncertainties.',
      ['Exponential decays and growths: plot a logarithm.', 'Power laws: plot log against log.', 'Any law with one or two unknown constants.'],
      { q: R`How should you plot capacitor discharge, $V = V_0e^{-t/RC}$?`, s: [R`Take logarithms: $\ln V = \ln V_0 - t/RC$.`, R`Plot ln V against t: a straight line of gradient $-1/RC$ and intercept $\ln V_0$.`, 'A curve on this graph means the law, or the meter, is not what you assumed.'] },
      { q: 'The best line through a graph of ln(V/volt) against t has gradient −0.25 s⁻¹. Find the time constant, and the capacitance if R = 100 kΩ.', a: '4.0 s; 40 µF', s: ['RC = 1/0.25 = 4.0 s.', 'C = 4.0/(1.0 × 10⁵) = 4.0 × 10⁻⁵ F = 40 µF.'] },
      [R`Logarithms stretch the error bars: $\delta(\ln V) = \delta V/V$, so small readings get large bars.`, 'For a power law y = kxⁿ, plot ln y against ln x: the gradient is n.'], ['al-capacitors', 'm-exp-log']),
    S('e-fit', 'experiment', '3.6', 'Least-squares gradient and its uncertainty',
      R`For n points, the best gradient is $m = \dfrac{\sum(x - \bar x)(y - \bar y)}{\sum(x - \bar x)^2}$, with standard uncertainty $\sigma_m = \dfrac{s}{\sqrt{\sum(x - \bar x)^2}}$, where $s^2 = \dfrac{\sum r_i^2}{n - 2}$ comes from the residuals $r_i$.`,
      ['Any straight-line fit, by calculator or by hand.', 'Comparing a fitted constant with an expected value.', 'Judging whether more points are worth taking.'],
      { q: 'Why divide by n − 2?', s: ['Two parameters, the gradient and the intercept, were fitted to the same points.', 'Each fitted parameter uses up one degree of freedom: two points always lie exactly on a line and say nothing about the scatter.', R`Dividing by n − 2 makes $s^2$ an unbiased estimate of the scatter.`] },
      { q: 'Fit y = mx + c to the points (0, 0.1), (1, 1.9), (2, 4.1), (3, 5.9). Find the gradient and its uncertainty.', a: '1.96 ± 0.06', s: [R`$\bar x = 1.5$, $\bar y = 3.0$, $\sum(x - \bar x)(y - \bar y) = 9.8$, $\sum(x - \bar x)^2 = 5$, so m = 1.96.`, R`$c = 3.0 - 1.96 \times 1.5 = 0.06$. Residuals: 0.04, −0.12, 0.12, −0.04, so $s^2 = 0.032/2 = 0.016$.`, R`$\sigma_m = \sqrt{0.016/5} = 0.057$: m = 1.96 ± 0.06.`] },
      ['These formulas ignore uncertainty in x; if x is uncertain too, the fitted gradient is biased low.', 'With only a handful of points σ itself is uncertain: the graphical worst-line method is just as honest.'], ['m-data', 'm-statistics-uni']),
    S('e-design', 'experiment', '3.4', 'Designing the measurement',
      'Put your measurements where the curve changes: dense near a resonance or a turning point, sparse where it is flat. Repeat whatever is noisy, time many cycles of anything periodic, and check what your instruments do to the circuit.',
      ['Resonance curves and peaks.', 'Timing periodic motion.', 'Planning a five-hour experiment so that time does not run out.'],
      { q: 'Where should you take readings on a resonance curve?', s: ['Far from resonance the response changes slowly: a few points are enough.', R`Near the peak, a width of about $\omega_0/Q$ holds all the information: space points at a fraction of that width.`, 'Equally spaced readings usually miss the peak or land one point on it.'] },
      { q: 'Your reaction time is about 0.2 s and a pendulum’s period is about 1.5 s. What is the smallest number of periods you must time to bring the timing uncertainty of the period below 0.5 %?', a: '27', s: ['The uncertainty per period is 0.2/N s. You need 0.2/N < 0.005 × 1.5 = 0.0075 s.', 'N > 26.7, so at least 27 periods (30 is a sensible round number).'] },
      ['Reaction time is partly systematic: you are late at both start and stop, which partly cancels. 0.2 s is a cautious figure.', 'Count from zero: start the clock, then count “one” at the first complete swing.'], ['al-units']),
    S('e-loading', 'experiment', '3.4 · 3.5', 'Instruments change what they measure',
      'A voltmeter is a large resistor in parallel; an ammeter, a small one in series. Unless they are far larger (or smaller) than the circuit’s own resistances, they shift the reading. That error is systematic: repetition will never reveal it.',
      ['High-resistance circuits.', 'Measuring internal resistance.', 'Any reading that is suspiciously consistent but wrong.'],
      { q: 'When can you ignore a voltmeter’s effect?', s: [R`A voltmeter of resistance $R_V$ across R gives $R_\parallel = \dfrac{RR_V}{R + R_V} \approx R\left(1 - \dfrac{R}{R_V}\right)$.`, R`The relative error is about $R/R_V$: negligible only when $R_V \gg R$.`] },
      { q: 'Two 1.0 MΩ resistors in series are connected across 10.0 V. A voltmeter of resistance 10 MΩ is placed across one of them. What does it read?', a: '4.76 V', s: ['In parallel: 1.0 × 10/(1.0 + 10) = 0.909 MΩ.', 'Reading = 10.0 × 0.909/(1.0 + 0.909) = 4.76 V instead of 5.00 V: 5 % low, every single time.'] },
      ['Repeating a measurement does not reveal a systematic error; changing the method does (for example, using a second meter).', 'Digital multimeters are typically 10 MΩ on their voltage ranges: fine for kilohm circuits, not for megohm ones.'], ['al-potential-divider', 'al-dc-circuits']),
    /* mathematics */
    S('m-calc', 'maths', '4.7', 'Integrals for physics: moments of inertia',
      'Slice the body into pieces whose contribution you already know (rings, discs, rods), express one slice in a single variable, and integrate. Make the integral dimensionless where you can: the physics is in the prefactor.',
      ['Moments of inertia and centres of mass.', 'Fields of continuous charge distributions.', 'Work done by varying forces.'],
      { q: 'Find the moment of inertia of a uniform solid sphere about a diameter.', s: [R`Slice into discs at height z, of radius $\sqrt{R^2 - z^2}$ and mass $dm = \rho\pi(R^2 - z^2)\,dz$. Each has $dI = \tfrac12\,dm\,(R^2 - z^2)$.`, R`$I = \tfrac12\rho\pi\displaystyle\int_{-R}^R(R^2 - z^2)^2\,dz = \tfrac{8}{15}\rho\pi R^5$.`, R`With $M = \tfrac43\pi R^3\rho$: $I = \tfrac25MR^2$.`] },
      { q: 'Find the moment of inertia of a uniform thin rod of mass 0.30 kg and length 1.2 m about an axis through its centre, perpendicular to the rod.', a: '0.036 kg m²', s: [R`$I = \displaystyle\int_{-L/2}^{L/2}\frac ML x^2\,dx = \frac{ML^2}{12}$.`, R`$I = 0.30 \times 1.2^2/12$ = 0.036 kg m².`] },
      [R`The parallel-axis theorem $I = I_{cm} + Md^2$ works only from the axis through the centre of mass, never between two other axes.`, 'Measure distances from the axis, not from the centre: for discs about a diameter, dI is not r² dm.'], ['y1-rotation', 'm-integration']),
    S('m-vec', 'maths', '4.4', 'Cross products and the E × B drift',
      R`Cross products carry rotation and handedness: torque $\mathbf r\times\mathbf F$, the force $q\mathbf v\times\mathbf B$, angular momentum. Expand double products with $\mathbf a\times(\mathbf b\times\mathbf c) = \mathbf b(\mathbf a\cdot\mathbf c) - \mathbf c(\mathbf a\cdot\mathbf b)$.`,
      ['Charged particles in fields.', 'Torques and angular momentum in three dimensions.', 'Areas and volumes from vectors.'],
      { q: R`Show that a charge in crossed E and B fields can drift steadily at $\mathbf v_d = \mathbf E\times\mathbf B/B^2$.`, s: [R`Look for motion without acceleration: $q(\mathbf E + \mathbf v\times\mathbf B) = 0$.`, R`Cross with B: $\mathbf E\times\mathbf B + (\mathbf v\times\mathbf B)\times\mathbf B = 0$, and $(\mathbf v\times\mathbf B)\times\mathbf B = \mathbf B(\mathbf v\cdot\mathbf B) - \mathbf vB^2$.`, R`For v perpendicular to B: $\mathbf v = \mathbf E\times\mathbf B/B^2$, the same for every charge and mass.`] },
      { q: 'E = 1.0 × 10³ V/m along x and B = 0.10 T along z. Find the drift speed and its direction.', a: '1.0 × 10^4 m/s, along −y', s: [R`$\hat{\mathbf x}\times\hat{\mathbf z} = -\hat{\mathbf y}$.`, R`$v_d = E/B = 1.0\times10^3/0.10$ = 1.0 × 10⁴ m/s, along −y.`] },
      ['Mind the order: E × B, not B × E.', 'The drift requires E < cB; otherwise no frame removes the electric field.'], ['m-vectors', 'al-bfields']),
    S('m-conic', 'maths', '4.3', 'Conic sections and orbits',
      R`Every Kepler orbit is a conic with the Sun at a focus: $r = \dfrac{p}{1 + e\cos\theta}$. An ellipse has e < 1, a parabola e = 1, a hyperbola e > 1. Perihelion is $a(1 - e)$ and aphelion $a(1 + e)$.`,
      ['Orbit shapes from energy.', 'Distances of closest and furthest approach.', 'Scattering by a central force.'],
      { q: 'How does the shape of an orbit follow from its energy?', s: [R`Ellipse: $E = -GMm/2a < 0$, bound.`, 'Parabola: E = 0, the escape trajectory.', R`Hyperbola: E > 0, an unbound fly-by. The parameter p is set by the angular momentum: $p = L^2/(GMm^2)$.`] },
      { q: 'A planet’s orbit has perihelion 0.98 AU and aphelion 1.02 AU. Find its eccentricity.', a: '0.020', s: [R`$e = \dfrac{r_a - r_p}{r_a + r_p} = \dfrac{0.04}{2.00}$ = 0.020, close to the Earth’s 0.017.`] },
      ['The Sun is at a focus, not at the centre of the ellipse.', 'Near e = 1, small changes in speed change the period enormously.'], ['al-gravfields', 'm-polar']),
    S('m-newton', 'maths', '4.8', 'Numerical root-finding',
      R`When an equation has no closed-form solution, iterate. Newton’s method, $x_{n+1} = x_n - f(x_n)/f'(x_n)$, roughly doubles the number of correct digits each step near a root; bisection is slower but cannot fail if f changes sign.`,
      ['Transcendental equations (Wien’s law, pendulum amplitudes, band edges).', 'Checking a graphical solution.', 'Equations from boundary conditions.'],
      { q: R`Wien’s law: the peak of Planck’s spectrum in wavelength satisfies $x = 5(1 - e^{-x})$ with $x = hc/\lambda k_BT$. Solve it.`, s: [R`Let $f(x) = x - 5 + 5e^{-x}$, so $f'(x) = 1 - 5e^{-x}$.`, R`From $x_0 = 5$: $x_1 = 5 - \dfrac{5e^{-5}}{1 - 5e^{-5}} = 4.9651$; the next step changes only the fifth decimal.`, R`So $\lambda_{max}T = \dfrac{hc}{4.965\,k_B} = 2.898\times10^{-3}$ m K.`] },
      { q: 'Use Newton’s method to solve cos x = x (x in radians), starting from x₀ = 1. Give the root to three decimal places.', a: '0.739', s: [R`$f = \cos x - x$ and $f' = -\sin x - 1$.`, R`$x_1 = 1 - \dfrac{\cos1 - 1}{-\sin1 - 1} = 0.7504$, then $x_2 = 0.7391$ and $x_3 = 0.7391$.`, 'x = 0.739.'] },
      ['Newton’s method can jump away where f′ is small: bracket the root with a sign change first.', 'Stop when successive values agree to the precision you need, and check that f(x) is close to zero.'], ['m-numerical-roots', 'y2-blackbody'])
  ];
  const SKI = {}; SK.forEach((s, i) => (SKI[s.id] = Object.assign(s, { i })));

  /* ---------- the pathway ---------- */
  const PHASES = [
    { n: 1, name: 'Foundations', aim: 'Pre-university physics, fluent with calculus. Target: the first round of your national olympiad.', topics: ['al-kinematics', 'al-dynamics', 'al-momentum', 'al-energy', 'al-circular', 'al-shm', 'al-efields', 'al-dc-circuits', 'al-waves', 'al-ideal-gas', 'm-differentiation', 'm-integration', 'm-vectors', 'm-complex'], skills: ['t-dim', 't-limits', 't-fermi', 't-cons', 'e-prop', 'm-calc', 'm-vec'] },
    { n: 2, name: 'Mechanics and electromagnetism in depth', aim: 'Rotation, oscillations, orbits and fields at olympiad depth. Target: your national final.', topics: ['y1-rotation', 'y1-angular-momentum', 'y1-systems', 'al-gravfields', 'y2-central-force', 'y1-oscillators', 'y1-gauss', 'y1-magnetostatics', 'y1-faraday', 'y1-potential', 'al-ac', 'm-taylor', 'm-ode2'], skills: ['t-symmetry', 't-taylor', 't-rotframe', 't-rolling', 't-smallosc', 't-orbits', 't-images', 't-superpose', 't-ladder', 't-phasor'] },
    { n: 3, name: 'The whole IPhO syllabus', aim: 'Optics, relativity, quantum estimates, thermodynamics and fluids. Target: team selection.', topics: ['y1-optics', 'al-interference', 'al-doppler', 'al-polarisation', 'y1-sr', 'y1-rel-dynamics', 'y2-4vectors', 'y1-qm-intro', 'al-spectra', 'al-nuclear', 'y1-thermo', 'y1-entropy', 'al-temperature', 'y2-blackbody', 'y1-fluids'], skills: ['t-fermat', 't-mach', 't-rel', 't-uncert', 't-thermo', 't-heatcirc', 't-surface', 't-bernoulli', 'm-conic', 'm-newton'] },
    { n: 4, name: 'Exam craft and the laboratory', aim: 'Five-hour papers under time, and experiments done properly. Target: a medal.', topics: ['al-units', 'm-data', 'm-statistics-uni'], skills: ['e-prop', 'e-linear', 'e-fit', 'e-design', 'e-loading'] }
  ];

  /* ---------- state (per account) ---------- */
  const key = () => { const A = WL.auth; return 'wl-oly' + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const load = () => { try { return JSON.parse(localStorage.getItem(key()) || '{}') || {}; } catch (e) { return {}; } };
  const saveO = (o) => { try { localStorage.setItem(key(), JSON.stringify(o)); } catch (e) {} };

  /* ---------- pages ---------- */
  const H = () => WL.app.h;
  const topicLink = (id) => { const A = WL.app, n = A.nodes[id]; if (!n) return ''; const d = A.h.done.has(id); return `<a class="oly-t${d ? ' done' : ''}" href="#t-${id}" title="${A.h.esc(A.h.stageOf(id).name)}"><i aria-hidden="true">${d ? '✓' : ''}</i>${A.h.esc(n.title)}<small>${A.h.esc(A.h.stageOf(id).short)}</small></a>`; };
  const skillLink = (id, o) => { const s = SKI[id]; if (!s) return ''; const r = (o.sk || {})[id]; return `<a class="oly-s ${s.g}${r === 'correct' ? ' done' : ''}" href="#oly-${id}"><span class="oly-sc">${s.code}</span><b>${H().esc(s.name)}</b><span class="oly-si">${H().pr(s.idea.split('. ')[0].replace(/\.$/, ''))}.</span>${r === 'correct' ? '<i class="oly-ok">Solved</i>' : ''}</a>`; };
  const allTopics = () => [...new Set(SYL.flatMap((s) => (s.parts ? s.parts.flatMap((p) => p.topics) : s.topics)))].filter((t) => WL.app.nodes[t]);

  /* the page is built round three pictures: who gets a medal, what the two exam days look like, and where you are on the way */
  const GLY = {
    '2.1': '<path d="M5 5H3v14h2M19 5h2v14h-2"/><path d="M8 15l4-6 4 6" />',
    '2.2': '<ellipse cx="12" cy="12" rx="9.5" ry="5" transform="rotate(-28 12 12)"/><circle cx="9.6" cy="13.2" r="2" fill="currentColor"/><circle cx="19.7" cy="7.7" r="1.3" fill="currentColor"/>',
    '2.3': '<rect x="9" y="4" width="6" height="16" rx="1.5"/><path d="M9 7C3 7 3 17 9 17M15 7c6 0 6 10 0 10"/>',
    '2.4': '<path d="M2 12c2.5-7 5-7 7.5 0s5 7 7.5 0 3.5-5 5-3"/>',
    '2.5': '<path d="M12 12L5 4h14zM12 12l-7 8h14z"/>',
    '2.6': '<path d="M2 13h3c1.2 0 1.6-5 3.2-5s1.6 9 3.8 9 2.2-12 4-12 2 8 3.4 8H22"/>',
    '2.7': '<rect x="6" y="5" width="12" height="14" rx="1"/><path d="M6 11h12M12 11V5"/><path d="M9 15h6"/>',
    '3': '<path d="M3 20L21 6"/><circle cx="6" cy="17" r="1.4" fill="currentColor"/><circle cx="10" cy="14.6" r="1.4" fill="currentColor"/><circle cx="14" cy="10.4" r="1.4" fill="currentColor"/><circle cx="18" cy="8.6" r="1.4" fill="currentColor"/>',
    '4': '<path d="M15 3c-2 0-3 1.4-3.4 4L10 17c-.4 2.6-1.4 4-3.4 4"/>'
  };
  const glyKey = (code) => { const c = String(code).split(/[ ·]/)[0]; return c.startsWith('2.') ? c.slice(0, 3) : c[0]; };
  const glyph = (code) => `<svg class="oly2-gly" viewBox="0 0 24 24" aria-hidden="true">${GLY[glyKey(code)] || GLY['2.1']}</svg>`;
  /* a schematic distribution of contestants' scores, with the medal cut-offs placed by rank */
  function medalSVG() {
    const W = 560, Hh = 250, L = 18, R = 14, B = 46, T = 20, xs = [], N = 200;
    const f = (x) => Math.pow(x, 1.7) * Math.exp(-x / 8.2); // score out of 50
    let tot = 0; for (let i = 0; i <= N; i++) { const x = (50 * i) / N, y = f(x); xs.push([x, y]); tot += y; }
    let acc = 0; const cut = {}; for (let i = N; i >= 0; i--) { acc += xs[i][1]; const q = acc / tot; if (!cut.g && q >= 0.08) cut.g = xs[i][0]; if (!cut.s && q >= 0.25) cut.s = xs[i][0]; if (!cut.b && q >= 0.5) cut.b = xs[i][0]; }
    const ymax = Math.max(...xs.map((p) => p[1])), X = (x) => L + ((W - L - R) * x) / 50, Y = (y) => Hh - B - ((Hh - B - T) * y) / ymax;
    const area = (a, b) => { const pts = xs.filter(([x]) => x >= a - 1e-9 && x <= b + 1e-9); return `M${X(a).toFixed(1)} ${Y(0)} ${pts.map(([x, y]) => `L${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(' ')} L${X(b).toFixed(1)} ${Y(0)} Z`; };
    const lab = (x0, x1, name, pct, cls) => `<g class="${cls}"><line x1="${X(x0)}" x2="${X(x0)}" y1="${T - 6}" y2="${Y(0)}" class="mcut"/><text x="${(X(x0) + X(x1)) / 2}" y="${T + 2}" text-anchor="middle" class="mname">${name}</text><text x="${(X(x0) + X(x1)) / 2}" y="${T + 18}" text-anchor="middle" class="mpct">${pct}</text></g>`;
    return `<svg viewBox="0 0 ${W} ${Hh}" class="oly2-medals" role="img" aria-label="A schematic distribution of olympiad scores. The top 8 per cent of contestants win gold, the next 17 per cent silver and the next 25 per cent bronze.">
      <defs><linearGradient id="mg-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3c969"/><stop offset="1" stop-color="#b8862f"/></linearGradient><linearGradient id="mg-s" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e3e9f1"/><stop offset="1" stop-color="#8a97a8"/></linearGradient><linearGradient id="mg-b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e09a62"/><stop offset="1" stop-color="#8f5631"/></linearGradient></defs>
      <path d="${area(0, cut.b)}" class="mrest"/><text x="${X(cut.b * 0.42)}" y="${Y(0) - 14}" text-anchor="middle" class="mpct">no medal · the lower half</text>
      <path d="${area(cut.b, cut.s)}" fill="url(#mg-b)" opacity="0.92"/><path d="${area(cut.s, cut.g)}" fill="url(#mg-s)" opacity="0.92"/><path d="${area(cut.g, 50)}" fill="url(#mg-g)"/>
      <path d="M${xs.map(([x, y]) => `${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(' L')}" class="mcurve"/>
      ${lab(cut.b, cut.s, 'Bronze', 'next 25%', 'mb')}${lab(cut.s, cut.g, 'Silver', 'next 17%', 'ms')}${lab(cut.g, 50, 'Gold', 'top 8%', 'mgld')}
      <line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" class="maxis"/>
      ${[0, 10, 20, 30, 40, 50].map((v) => `<text x="${X(v)}" y="${Y(0) + 18}" text-anchor="middle" class="mtick">${v}</text>`).join('')}
      <text x="${(L + W - R) / 2}" y="${Hh - 6}" text-anchor="middle" class="mtick">points out of 50 · schematic: the cut-offs are set by rank, so the scores they fall at change every year</text>
    </svg>`;
  }
  function examHTML() {
    return `<div class="oly2-exam" role="img" aria-label="Theory exam: five hours, three problems of ten points. Experimental exam: five hours, twenty points. They are on separate days, in either order.">
      <div class="oly2-day"><p><b>Theory exam</b><span>5 hours</span></p><div class="oly2-bar">${[1, 2, 3].map((k) => `<span style="flex:10"><b>Problem ${k}</b><small>10 points</small></span>`).join('')}</div></div>
      <div class="oly2-day"><p><b>Experimental exam</b><span>5 hours, on another day</span></p><div class="oly2-bar ex"><span style="flex:20"><b>One or two experiments</b><small>20 points</small></span></div></div>
      <div class="oly2-tot"><span style="flex:30">Theory 30</span><span style="flex:20">Experiment 20</span></div>
    </div>`;
  }
  function renderHome(view) {
    const A = WL.app, h = A.h, o = load(); document.title = 'Olympiad pathway · Geodesic';
    const T = allTopics(), dn = T.filter((t) => h.done.has(t)).length, solved = SK.filter((s) => (o.sk || {})[s.id] === 'correct').length, ticked = Object.keys(o.tick || {}).length;
    const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
    const nextSkill = SK.find((s) => (o.sk || {})[s.id] !== 'correct');
    const tile = (k) => { const s = SKI[k]; if (!s) return ''; const r = (o.sk || {})[k] === 'correct'; return `<a class="oly2-tile ${s.g}${r ? ' done' : ''}" href="#oly-${k}">${glyph(s.code)}<span class="oly2-tc">${h.esc(s.code)}</span><b>${h.esc(s.name)}</b>${r ? '<i>Solved</i>' : ''}</a>`; };
    const secHTML = (s) => {
      const parts = s.parts || [s];
      const tick = (o.tick || {})[s.code];
      const ids = parts.flatMap((p) => p.topics).filter((t) => A.nodes[t]), d = ids.filter((t) => h.done.has(t)).length;
      return `<details class="oly-sec" id="osec-${s.code.replace(/\./g, '-')}"${tick ? ' data-tick="1"' : ''}><summary><span class="oly-code">${s.code}</span><b>${h.esc(s.name)}</b><span class="oly-prog">${ids.length ? `${d}/${ids.length} topics` : ''}</span>${h.ring(ids.length ? d / ids.length : (tick ? 1 : 0), '#d9a441', 28, 3)}</summary>
        ${parts.map((p) => `<div class="oly-part">${p !== s ? `<h4><span>${p.code}</span> ${h.esc(p.name)}</h4>` : ''}<p>${h.esc(p.items)}</p>
          ${p.topics.filter((t) => A.nodes[t]).length ? `<div class="oly-tl">${p.topics.map(topicLink).join('')}</div>` : ''}
          ${(p.skills || []).length ? `<div class="oly-sl">${p.skills.map((k) => `<a href="#oly-${k}">${h.esc(SKI[k].name)}</a>`).join('')}</div>` : ''}</div>`).join('')}
        <label class="oly-tick"><input type="checkbox" data-tick="${s.code}"${tick ? ' checked' : ''}> I can do problems on this section</label></details>`;
    };
    // coverage map: one cell per syllabus part, shaded by the share of its topics you have marked understood
    const cells = SYL.flatMap((s) => (s.parts || [s]).map((p) => { const ids = (p.topics || []).filter((t) => A.nodes[t]), d = ids.filter((t) => h.done.has(t)).length, tk = (o.tick || {})[s.code]; return { s, p, ids, d, f: ids.length ? d / ids.length : tk ? 1 : 0, sk: (p.skills || []).length }; }));
    view.innerHTML = `<section class="oly2-hero">
        <div class="oly2-hl">
          <p class="oly-k">Olympiad pathway · following the IPhO syllabus</p>
          <h1>From school physics to an IPhO medal</h1>
          <p class="oly-lede">The International Physics Olympiad is two five-hour exams. Medals go by rank: gold to the top 8% of contestants, silver to the next 17%, bronze to the next 25%. This pathway follows the official syllabus section by section, links every part to the lessons here, and trains the problem-solving moves the syllabus itself never names.</p>
          <div class="oly2-cta">${nextSkill ? `<a class="btn primary" href="#oly-${nextSkill.id}">Next skill: ${h.esc(nextSkill.name)}</a>` : '<span class="btn primary" aria-disabled="true">Every skill solved</span>'}<a class="btn ghost" href="#test">Sit a timed paper</a></div>
        </div>
        <figure class="oly2-fig">${medalSVG()}</figure>
      </section>
      <section class="oly2-band">
        <div class="oly2-exw"><h2>The two days</h2>${examHTML()}<p class="oly2-note">Theory problems are long and multi-part, usually built round one physical system you have never seen. The experiment rewards careful measurement, uncertainties and graphs as much as the physics.</p></div>
        <div class="oly2-you"><h2>Where you are</h2>
          <ul class="oly2-rings">
            <li>${h.ring(dn / Math.max(1, T.length), '#d9a441', 64, 5)}<b>${pct(dn, T.length)}%</b><span>syllabus topics understood</span><small>${dn} of ${T.length}</small></li>
            <li>${h.ring(solved / SK.length, '#7cc8ff', 64, 5)}<b>${solved}</b><span>skill problems solved</span><small>of ${SK.length}</small></li>
            <li>${h.ring(ticked / SYL.length, '#7be0a5', 64, 5)}<b>${ticked}</b><span>sections you can do</span><small>of ${SYL.length}, by your own tick</small></li>
          </ul></div>
      </section>
      <section class="block"><div class="section-h"><h2>The pathway</h2><span class="muted">Four phases, each with a target</span></div>
        <ol class="oly2-route">${PHASES.map((ph) => { const t = ph.topics.filter((x) => A.nodes[x]), d = t.filter((x) => h.done.has(x)).length, sd = ph.skills.filter((x) => (o.sk || {})[x] === 'correct').length, tgt = (ph.aim.match(/Target: ([^.]+)/) || [])[1] || ''; return `<li class="oly2-ph${d === t.length && sd === ph.skills.length && t.length ? ' done' : ''}">
          <div class="oly2-node" aria-hidden="true">${ph.n}</div>
          <div class="oly2-phb">
            <header><h3>${h.esc(ph.name)}</h3>${tgt ? `<span class="oly2-tgt">Target: ${h.esc(tgt)}</span>` : ''}</header>
            <p>${h.esc(ph.aim.replace(/\s*Target:[^.]+\.?/, ''))}</p>
            <div class="oly2-meters"><span><i style="--f:${pct(d, t.length)}%"></i>${d}/${t.length} topics</span><span><i style="--f:${pct(sd, ph.skills.length)}%" class="s"></i>${sd}/${ph.skills.length} skills</span></div>
            <div class="oly2-tiles">${ph.skills.map(tile).join('')}</div>
            <details class="oly2-topics"><summary>The ${t.length} lessons for this phase</summary><div class="oly-tl">${t.map(topicLink).join('')}</div></details>
          </div></li>`; }).join('')}</ol>
      </section>
      ${WL.olyp ? WL.olyp.homeHTML() : ''}
      <section class="block"><div class="section-h"><h2>The syllabus, mapped</h2><span class="muted">Appendix to the IPhO Statutes, 2014, amended 2015</span></div>
        <p class="sec-sub">Each square is one part of the official syllabus, filled in as you mark its lessons understood. Press one to open that section below.</p>
        <div class="oly2-map">${SYL.map((s) => `<div class="oly2-row"><span class="oly2-rc">${s.code}</span><span class="oly2-rn">${h.esc(s.name)}</span><div class="oly2-cells">${cells.filter((c) => c.s === s).map((c) => `<a href="#osec-${s.code.replace(/\./g, '-')}" data-osec="${s.code}" class="oly2-cell" style="--f:${c.f.toFixed(2)}" title="${h.esc(c.p.code + ' ' + c.p.name)}: ${c.ids.length ? `${c.d} of ${c.ids.length} lessons understood` : 'no lessons linked'}${c.sk ? `, ${c.sk} skill card${c.sk > 1 ? 's' : ''}` : ''}"><span>${h.esc(c.p.code)}</span></a>`).join('')}</div></div>`).join('')}
          <p class="oly2-legend"><span><i style="--f:0"></i>none yet</span><span><i style="--f:0.5"></i>half</span><span><i style="--f:1"></i>all understood</span></p></div>
        <div class="oly-syl">${SYL.map(secHTML).join('')}</div>
      </section>
      <section class="block oly-train"><div class="section-h"><h2>How to train</h2><a href="#science">The evidence behind this</a></div>
        <ul class="oly2-train">
          <li><b>Mix your problems</b><span>Once a topic is learnt, practise it mixed with others. In an olympiad paper nobody tells you which chapter a problem comes from; spotting the method is half the skill.</span></li>
          <li><b>Come back on a schedule</b><span>Revisit solved problems after days, then weeks. The Review tab does this for every topic you mark understood.</span></li>
          <li><b>Keep an error log</b><span>For every mistake, write the step that failed and the check that would have caught it: dimensions, a limit, a symmetry. Reread it before every paper.</span></li>
          <li><b>Sit full papers</b><span>From phase 3, one five-hour paper of three problems every two weeks, on past IPhO problems, under exam conditions. Then mark it strictly against the official scheme.</span></li>
        </ul>
        <p class="oly-books"><b>Books and sources many olympiad students use.</b> Jaan Kalda’s study guides on mechanics, electricity and thermodynamics; David Morin, <i>Introduction to Classical Mechanics</i>; Edward Purcell and David Morin, <i>Electricity and Magnetism</i>; Gnädig, Honyek and Riley, <i>200 Puzzling Physics Problems</i>; and past IPhO and APhO papers with their official solutions, published by each year’s host.</p>
      </section>`;
    h.typeset(view);
    view.onclick = (e) => { const c = e.target.closest('[data-osec]'); if (!c) return; e.preventDefault(); const d = document.getElementById('osec-' + c.dataset.osec.replace(/\./g, '-')); if (d) { d.open = true; d.scrollIntoView({ behavior: WL.reduced ? 'auto' : 'smooth', block: 'start' }); } };
    view.onchange = (e) => { const t = e.target.closest('[data-tick]'); if (!t) return; const oo = load(); oo.tick = oo.tick || {}; if (t.checked) oo.tick[t.dataset.tick] = 1; else delete oo.tick[t.dataset.tick]; saveO(oo); const d = t.closest('details'); if (d) d.toggleAttribute('data-tick', t.checked); };
  }

  function renderSkill(view, id) {
    const A = WL.app, h = A.h, s = SKI[id], o = load(); if (!s) { location.replace('#olympiad'); return; }
    document.title = s.name + ' · Olympiad · Geodesic';
    const prev = SK[s.i - 1], next = SK[s.i + 1], rec = (o.ans || {})[id];
    view.innerHTML = `<article class="oly-card">
      <nav class="crumbs"><a href="#olympiad">Olympiad pathway</a> › <span>${{ theory: 'Theory skills', experiment: 'Experimental skills', maths: 'Mathematics' }[s.g]}</span></nav>
      <p class="oly-k">IPhO syllabus ${s.code}</p>
      <h1>${h.esc(s.name)}</h1>
      <p class="oly-idea">${h.pr(s.idea)}</p>
      <div class="oly-when"><h2>When to reach for it</h2><ul>${s.when.map((w) => `<li>${h.pr(w)}</li>`).join('')}</ul></div>
      <section class="oly-ex"><h2>Worked example</h2><p class="oly-q">${h.pr(s.ex.q)}</p><ol class="oly-steps">${s.ex.s.map((x) => `<li>${h.pr(x)}</li>`).join('')}</ol></section>
      <section class="oly-try" id="oly-try"><h2>Your turn</h2><p class="oly-q">${h.pr(s.p.q)}</p>
        <textarea id="oly-ans" rows="2" placeholder="Your answer, with units">${h.esc((rec && rec.t) || '')}</textarea>
        <div class="row"><button type="button" class="btn small primary" data-ocheck>Check</button><button type="button" class="btn small ghost" data-ohint>Hint</button><button type="button" class="btn small ghost" data-osol aria-expanded="false">Solution</button><button type="button" class="btn small ghost" data-oask>Ask Einstein</button></div>
        <ol class="pcq-hints" id="oly-hints" hidden></ol>
        <div class="oly-fb" id="oly-fb" role="status" aria-live="polite">${rec ? fb(rec) : ''}</div>
        <div class="oly-sol" id="oly-sol" hidden><p class="pans"><b>Answer</b> ${h.pr(s.p.a)}</p><ol class="psol">${s.p.s.map((x) => `<li>${h.pr(x)}</li>`).join('')}</ol></div>
      </section>
      <section class="oly-traps"><h2>Traps</h2><ul>${s.traps.map((x) => `<li>${h.pr(x)}</li>`).join('')}</ul></section>
      ${s.links.filter((t) => A.nodes[t]).length ? `<section><h2>Lessons on Geodesic</h2><div class="oly-tl">${s.links.map(topicLink).join('')}</div></section>` : ''}
      <nav class="oly-pn">${prev ? `<a href="#oly-${prev.id}"><small>Previous</small>${h.esc(prev.name)}</a>` : '<span></span>'}<a href="#olympiad" class="oly-up">All skills</a>${next ? `<a href="#oly-${next.id}" class="nx"><small>Next</small>${h.esc(next.name)}</a>` : '<span></span>'}</nav>
    </article>`;
    h.typeset(view);
    function fb(r) { const ok = r.v === 'correct'; return `<p class="oly-v ${r.v}"><b>${ok ? 'Correct' : r.v === 'partial' ? 'Partly right' : 'Not yet'}</b>${r.fb ? ' ' + h.pr(r.fb) : ''}${r.note ? ` <small>${h.esc(r.note)}</small>` : ''}</p>`; }
    let hints = 0;
    const tutorTopic = () => ({ key: 'oly-' + id, title: s.name + ' (olympiad)', suggestions: ['Give me a hint, not the answer', 'Why does this method work?', 'Give me a harder problem of this kind'],
      system: `You are Einstein, the AI tutor on Geodesic, coaching a student for the International Physics Olympiad. The current skill is "${s.name}" (IPhO syllabus ${s.code}). Coach like an olympiad trainer: rigorous, brief, and Socratic when they ask for hints. Point out hidden assumptions and check answers with dimensions and limiting cases. Use LaTeX with $...$. Reply in the student's language. Your name is Einstein: an AI named in honour of Albert Einstein; you are not him and never quote him.`,
      context: `Skill: ${s.name}. Idea: ${s.idea}\nProblem: ${s.p.q}\nModel answer (do not reveal unless asked): ${s.p.a}; ${s.p.s.join(' / ')}` });
    view.onclick = async (e) => {
      const t = e.target;
      if (t.closest('[data-ohint]')) { const box = $('#oly-hints'); if (hints < s.p.s.length - 1) { box.hidden = false; box.insertAdjacentHTML('beforeend', `<li>${h.pr(s.p.s[hints])}</li>`); h.typeset(box.lastElementChild); hints++; } const b = t.closest('[data-ohint]'); if (hints >= s.p.s.length - 1) { b.disabled = true; b.textContent = 'No more hints'; } else b.textContent = `Hint ${hints + 1}`; return; }
      if (t.closest('[data-osol]')) { const sol = $('#oly-sol'), b = t.closest('[data-osol]'); sol.hidden = !sol.hidden; b.setAttribute('aria-expanded', !sol.hidden); b.textContent = sol.hidden ? 'Solution' : 'Hide solution'; if (!sol.hidden) h.typeset(sol); return; }
      if (t.closest('[data-oask]')) { WL.tutor.open({ topic: tutorTopic(), chip: null }); return; }
      const c = t.closest('[data-ocheck]');
      if (c) {
        const ans = $('#oly-ans').value.trim(); if (!ans) { $('#oly-ans').focus(); return; }
        c.disabled = true; c.textContent = 'Checking'; const out = $('#oly-fb'); out.innerHTML = '<p class="oly-v"><span class="spin" aria-hidden="true"></span> Checking</p>';
        let r; try { r = await WL.grade.check({ q: s.p.q, a: s.p.a, s: s.p.s }, ans, { topic: s.name + ' (olympiad)' }); } catch (er) { r = { verdict: 'incorrect', note: er.message }; }
        const rec2 = { t: ans.slice(0, 600), v: r.verdict, fb: r.feedback || '', note: r.note || '', at: Date.now() };
        const oo = load(); oo.ans = oo.ans || {}; oo.ans[id] = rec2; oo.sk = oo.sk || {}; if (r.verdict === 'correct' || oo.sk[id] !== 'correct') oo.sk[id] = r.verdict; saveO(oo);
        out.innerHTML = fb(rec2); h.typeset(out); c.disabled = false; c.textContent = 'Check';
      }
    };
    const $ = (q) => view.querySelector(q);
    view.onkeydown = (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.target.id === 'oly-ans') { e.preventDefault(); view.querySelector('[data-ocheck]').click(); } };
  }

  WL.olympiad = { SYL, SK, PHASES };
  WL.pages = WL.pages || {};
  WL.pages.olympiad = { match: (h) => h === 'olympiad', nav: 'olympiad', render: (h, view) => renderHome(view) };
  WL.pages.olyskill = { match: (h) => h.startsWith('oly-'), nav: 'olympiad', render: (h, view) => renderSkill(view, h.slice(4)) };
})();
