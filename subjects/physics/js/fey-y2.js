/* Geodesic: "See it like Feynman" sections, y2. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('y2-4vectors', [
  'Observers moving relative to each other disagree about lengths, times, energies and momenta. Yet some combinations they all agree on: c²t² − x² between two events, and E² − p²c² for a particle.',
  'Space and time are parts of one four-dimensional **spacetime**, and quantities that change between observers the way (ct, x, y, z) does are **four-vectors**. Their "length" is the same for everyone, as a rod’s length is the same however it is turned. A particle’s energy and momentum make one four-vector, whose length is its rest energy.',
  'Lorentz transformations are rotations in spacetime, through hyperbolic angles, and they keep s² = c²t² − r² fixed. Applied to the four-momentum (E/c, p), the invariant gives E² = p²c² + m²c⁴, and at rest, with p = 0, E = mc².',
  'An electron and a positron annihilating at rest release 2 × 0.511 MeV, as two 511 keV photons flying apart back to back so that the total momentum stays zero: the very photons a PET scanner detects.',
  'Four-vectors describe flat spacetime and inertial observers. With gravity, spacetime curves and the same quantities can only be defined at each point.'
]);
WL.fy('y2-blackbody', [
  'The cosmic microwave background, the faintest glow in the sky at 2.725 K, fits the black-body curve more precisely than any glowing object ever measured in a laboratory.',
  'A **black body** is in equilibrium with its radiation: each mode of the electromagnetic field holds, on average, hf/(e^(hf/kT) − 1). Counting the modes at each frequency gives Planck’s curve, which depends only on the temperature.',
  'In equilibrium the spectrum cannot depend on the material (Kirchhoff): if it did, two cavities joined through a colour filter would drive heat from one to the other for nothing. Modes per frequency (∝ f²) times Planck’s average energy gives u(f) ∝ f³/(e^(hf/kT) − 1), and integrating gives σT⁴.',
  'A square metre at room temperature, 300 K, radiates σT⁴ ≈ 5.67 × 10⁻⁸ × 8.1 × 10⁹ ≈ 460 W. You radiate like this all the time, and absorb almost as much back from the room.',
  'Real surfaces have emissivities below 1 that vary with wavelength, and the derivation assumes equilibrium, which lasers and LEDs are far from.'
]);
WL.fy('y2-boltzmann', [
  'The air thins with height, to about half its density 5.5 km up, and a warm liquid evaporates faster, though only its fastest molecules escape.',
  'In thermal equilibrium the probability of a state of energy E is proportional to e^(−E/kT), the **Boltzmann factor**. Higher-energy states are exponentially rarer, and less rare at higher temperatures.',
  'Put a small system in contact with a large reservoir. The chance of the small system having energy E is proportional to the number of reservoir arrangements with energy U − E, that is e^(S(U−E)/k) ≈ e^(S(U)/k) e^(−E/kT), because ∂S/∂U = 1/T.',
  'For air molecules (29 u) at 250 K, the density falls by a factor of e for every kT/mg = 1.38 × 10⁻²³ × 250 / (29 × 1.66 × 10⁻²⁷ × 9.8) ≈ 7.3 km of height, so it halves about every 5 km.',
  'For identical quantum particles at low temperature or high density, the Bose–Einstein and Fermi–Dirac distributions replace Boltzmann’s.'
]);
WL.fy('y2-central-force', [
  'A planet sweeps out equal areas in equal times (Kepler’s second law), moving fastest when nearest the Sun. That holds for any force pointing at the Sun, not only gravity.',
  'A **central force** exerts no torque about the centre, so angular momentum is conserved, and the area swept out per second, L/(2m), stays the same.',
  'dA/dt = ½r² dθ/dt = L/(2m). Ellipses (Kepler’s first law) need the inverse-square law specifically: with u = 1/r the orbit equation becomes u″ + u = GMm²/L², whose solutions are conic sections, so the orbits close on themselves.',
  'At its nearest (0.983 AU) and furthest (1.017 AU) from the Sun, the Earth’s speeds are in the ratio 1.017/0.983 ≈ 1.035: about 30.3 km/s against 29.3 km/s.',
  'For any other force law, orbits do not close but slowly turn. Mercury’s orbit turns by an extra 43″ per century, explained by general relativity: the first test of Einstein’s theory.'
]);
WL.fy('y2-em-relativity', [
  'A charge moving alongside a current-carrying wire feels a magnetic force. In the charge’s own rest frame it is not moving, so there can be no magnetic force on it, yet it still accelerates.',
  'In the charge’s frame, the wire’s positive ions and its electrons move at different speeds, so they are length-contracted differently and the wire looks electrically charged: the force is electric. Electric and magnetic fields are two faces of one field, mixed together by a change of frame.',
  'The fields form one antisymmetric tensor F^μν, and Lorentz transformations mix its E and B parts. Magnetism is the relativistic correction to electricity, noticeable even at drift speeds of a fraction of a millimetre a second because the electric forces it corrects are so enormous.',
  'Electrons in a wire drift at about 0.1 mm/s, so the correction is of order (v/c)² ~ 10⁻²⁵. But a metre of copper wire holds about 10⁴ C of conduction electrons, balanced by as much positive charge, so even that tiny imbalance gives the magnetic forces we measure.',
  'The tensor picture is complete for classical fields, but a charge’s force on itself (radiation reaction) stays awkward, and at very small scales quantum electrodynamics is needed.'
]);
WL.fy('y2-em-waves', [
  'Sunlight pushes: comet tails point away from the Sun, and solar sails can drive spacecraft. Light carries momentum as well as energy.',
  'In an electromagnetic wave, E and B are at right angles to each other and to the direction of travel, in step, with E = cB. Energy flows along E × B (the **Poynting vector**), and momentum flows with it: p = U/c.',
  'In empty space Maxwell’s equations give each component of E and B the wave equation with speed c. The wave’s E sets charges moving and its B then pushes them forwards (qv × B), so absorbed light delivers momentum at I/c per second per square metre: a pressure I/c, or 2I/c from a mirror.',
  'Sunlight at the Earth, 1361 W/m², presses on a perfect mirror with 2 × 1361/(3 × 10⁸) ≈ 9 μPa. A sail 100 m square feels about 0.09 N: tiny, but it never stops.',
  'The classical wave shows no photons, and inside matter both the speed and the way momentum is shared between field and material become subtle (the Abraham–Minkowski debate).'
]);
WL.fy('y2-fourier', [
  'Light through a narrow slit spreads into a wide pattern, and the narrower the slit, the wider the spread. A telescope’s mirror size sets the finest detail it can show.',
  'The far-field diffraction pattern is the **Fourier transform** of the aperture: a narrow slit contains a wide range of spatial frequencies, and each one leaves at its own angle. A lens performs this Fourier transform in its focal plane.',
  'Each point of the aperture sends out a wavelet; far away, their phases differ by kx sin θ, so the amplitude at angle θ is ∫A(x)e^(−ikx sin θ)dx, the Fourier transform at spatial frequency sin θ/λ. The usual uncertainty follows: width × angular spread ≈ λ.',
  'The Hubble Space Telescope’s 2.4 m mirror at 500 nm resolves about 1.22λ/D ≈ 2.5 × 10⁻⁷ rad, 0.05 arcseconds: enough to separate two car headlights 1.5 m apart from 6000 km away.',
  'The far-field approximation needs distances much larger than a²/λ; closer in, Fresnel diffraction is more complicated. Real telescopes are also limited by the atmosphere and by imperfect optics.'
]);
WL.fy('y2-infinite-well', [
  'Long chain-like dye molecules absorb visible light, and the longer the chain, the redder the light they absorb.',
  'A molecule’s outer electrons can move freely along the chain but are trapped at its ends: a **particle in a box**. Only standing waves that fit are allowed, with energies E_n ∝ n²/L², so a longer box has closer levels, smaller jumps and longer-wavelength light.',
  'The wavefunction must vanish at the walls, so L = nλ/2, p = h/λ = nh/(2L), and E = p²/2m = n²h²/(8mL²). The lowest energy is not zero: confining a particle costs kinetic energy, as the uncertainty principle demands.',
  'An electron in a 1 nm box has E₁ = h²/(8mL²) ≈ 0.38 eV, and the jump from n = 1 to n = 2 needs 3E₁ ≈ 1.1 eV, light of about 1.1 μm. Doubling the box’s length cuts every level by four.',
  'Real walls are not infinitely high, so electrons leak into them and the levels drop, and the electrons repel each other. The model gives the trend, not the exact colours.'
]);
WL.fy('y2-lagrangian', [
  'Light passing from air into water bends at the surface along the quickest route, and a thrown ball follows a parabola. In both cases nature picks one special path out of all possible paths.',
  'For every possible path, add up the **action** S = ∫(T − V)dt. The real path makes S stationary: paths close to it have the same action, to first order. In quantum mechanics every path contributes a phase e^(iS/ħ); away from the stationary path the phases cancel, and near it they add up.',
  'Requiring δS = 0 gives the Euler–Lagrange equation, d/dt(∂L/∂q̇) = ∂L/∂q, which for L = ½mq̇² − V(q) is exactly Newton’s mq̈ = −V′(q). The principle works in any coordinates, which is what makes it so powerful.',
  'A 0.1 kg ball moving 1 m in a second has an action of about 0.05 J s, roughly 5 × 10³² times ħ. The phases change wildly from path to path, so only the stationary path survives: that is why a ball behaves classically.',
  'The action is stationary, not always least (it can be a saddle point), and dissipative forces such as friction do not fit simply into the scheme.'
]);
WL.fy('y2-matter-fields', [
  'Putting glass or plastic between the plates of a capacitor multiplies its capacitance; water multiplies it about 80 times.',
  'The material’s molecules polarise in the field: their charges shift slightly, or polar molecules turn to line up. The charges this induces on the surfaces partly cancel the field inside, so the same charge on the plates gives a lower voltage, which means more capacitance.',
  'A polarisation P = χε₀E leaves bound charge on the surfaces, so the free charge needed for a given field is multiplied by ε_r = 1 + χ. Water molecules are strongly polar (dipole moment 6.2 × 10⁻³⁰ C m) and free to turn, so at low frequency ε_r ≈ 80.',
  'Plates of 1 m² 1 mm apart have C = ε₀A/d ≈ 8.9 nF in air; filled with water, about 0.7 μF.',
  'At high frequencies the molecules cannot turn fast enough: water’s ε_r falls from 80 to about 1.8 at optical frequencies, which is why its refractive index is 1.33 and not √80.'
]);
WL.fy('y2-multipoles', [
  'A water molecule is electrically neutral, yet it pulls strongly on its neighbours, and far away its field falls as 1/r³, not 1/r².',
  'Far from a cluster of charges, the potential can be written as a series in 1/r: the monopole (total charge) ∝ 1/r, the **dipole** ∝ 1/r², the quadrupole ∝ 1/r³, and so on. For a neutral molecule the monopole vanishes and the dipole dominates, and its field, the slope of the potential, falls as 1/r³.',
  'Outside the charges the potential obeys Laplace’s equation, ∇²V = 0, whose solutions in spherical coordinates are r^(−l−1)P_l(cos θ): each term is a multipole of order l.',
  'Water’s dipole (6.2 × 10⁻³⁰ C m) gives a field 2kp/r³ ≈ 2 × 9 × 10⁹ × 6.2 × 10⁻³⁰ / 10⁻²⁷ ≈ 10⁸ V/m at 1 nm along its axis: comparable to fields inside atoms, which is why polar molecules cling together.',
  'The multipole series works only outside a sphere enclosing all the charges; inside it, or very close, the full arrangement matters.'
]);
WL.fy('y2-noether', [
  'Energy is conserved, momentum is conserved, angular momentum is conserved. Why these, and why exactly?',
  'Each conservation law comes from a symmetry. If the laws of physics are the same at all times, energy is conserved; if they are the same everywhere, momentum; if they are the same in every direction, angular momentum.',
  'If the Lagrangian does not depend on a coordinate q, so that shifting q is a symmetry, the Euler–Lagrange equation gives d/dt(∂L/∂q̇) = 0: the matching momentum is constant. Symmetry under shifts in time gives a constant Hamiltonian, the energy. This is **Noether’s theorem**.',
  'If the fine-structure constant changed with time, the laws would differ from year to year. Comparisons of atomic clocks limit any change to less than about one part in 10¹⁸ per year.',
  'In an expanding universe the symmetry under shifts in time is broken, and there is no general law of global energy conservation: light loses energy as it is red-shifted.'
]);
WL.fy('y2-operators', [
  'You can measure an electron’s position precisely, or its momentum, but the more sharply one is fixed the more uncertain the other becomes, and this is not a fault of the instruments.',
  'In quantum mechanics measurable quantities are **operators**, and position and momentum do not commute: xp − px = iħ. Quantities that do not commute cannot both have definite values in the same state.',
  'A state of definite momentum is a pure wave, e^(ikx), spread over all space; a localised state is a sum of many wavelengths (Fourier). From the commutator follows Δx Δp ≥ ħ/2.',
  'An electron confined to an atom, Δx ≈ 0.1 nm, has Δp ≥ ħ/(2Δx) ≈ 5 × 10⁻²⁵ kg m/s and so a kinetic energy of order (Δp)²/2m ≈ 1 eV: the right size for atomic energies.',
  'The principle is often explained as measurement disturbing the system, but the spread belongs to the state itself. The energy–time relation is a different kind of statement, because time is not an operator.'
]);
WL.fy('y2-partition', [
  'Hydrogen gas’s heat capacity drops at low temperature: its molecules stop rotating below about 100 K and stop vibrating below a few thousand kelvin. Motions "freeze out".',
  'The **partition function** Z = Σe^(−E/kT) adds up every state weighted by its Boltzmann factor, and all the thermodynamics follows from it. When kT is much smaller than the gap to a motion’s first excited level, that motion is hardly ever excited and adds nothing to the heat capacity.',
  'U = −∂ln Z/∂β and C = dU/dT. For two levels a gap Δ apart, C peaks near kT ≈ Δ/2.4 and falls as e^(−Δ/kT) below it: quantum gaps make classical equipartition fail at low temperature.',
  'For H₂ the rotational levels correspond to about 85 K and the vibration to about 6300 K, so at room temperature C_v ≈ (5/2)R (translation and rotation), not (7/2)R.',
  'For identical particles the counting of states changes (hydrogen has ortho and para forms with different rotational levels), and the canonical ensemble assumes contact with a heat bath.'
]);
WL.fy('y2-qho', [
  'Molecules made of two atoms absorb infrared light at one main frequency, with weaker overtones, and even at absolute zero they still vibrate.',
  'A quantum oscillator’s levels are evenly spaced, E_n = (n + ½)ħω, and the lowest is not zero: the **zero-point energy** ½ħω, because a particle cannot sit still at the bottom of a well. Jumps between neighbouring levels absorb a single frequency, ω.',
  'The Hamiltonian factorises into ladder operators a and a†, with [a, a†] = 1, so each step up adds exactly ħω. The ground state minimises ½mω²⟨x²⟩ + ⟨p²⟩/2m subject to ΔxΔp ≥ ħ/2, which gives ½ħω.',
  'Carbon monoxide absorbs at a wavenumber of 2143 cm⁻¹ (4.67 μm), so ħω ≈ 0.27 eV, about ten times kT at room temperature: almost every molecule sits in its ground state.',
  'Real bonds are not parabolic: the levels crowd together higher up (anharmonicity), and eventually the bond breaks, which a perfect harmonic potential never allows.'
]);
WL.fy('y2-rigid-body', [
  'Throw a book spinning about its longest or its shortest axis and it spins cleanly; spin it about the middle axis and it tumbles over and over (the tennis racket theorem).',
  'A rigid body has three **principal axes**, with different moments of inertia. Rotation about the largest or the smallest is stable: small wobbles stay small. About the middle one, small wobbles grow exponentially.',
  'Euler’s equations, I₁ω̇₁ = (I₂ − I₃)ω₂ω₃ and its cyclic partners, can be linearised about steady rotation round axis 2. Wobbles then grow at a rate ω√((I₂ − I₁)(I₃ − I₂)/(I₁I₃)), which is real, and so unstable, exactly when I₂ lies between I₁ and I₃.',
  'For a 25 × 18 × 3 cm book the moments of inertia are in the ratio 333 : 634 : 949, which gives a growth rate of about 0.55ω: a small wobble grows about thirty-fold every turn.',
  'Real objects are not perfectly rigid. Flexible bodies lose energy and drift towards spinning about their axis of largest moment of inertia, as the first American satellite, Explorer 1, did.'
]);
WL.fy('y2-schrodinger', [
  'The electron in a hydrogen atom has an energy of −13.6 eV in its lowest state, never lower, and only particular energies above it.',
  'The electron is described by a **wavefunction** ψ that obeys the Schrödinger equation. Bound states are standing waves in the potential: only certain shapes fit, each with a definite energy, and |ψ|² gives the probability of finding the electron at each place.',
  'With E → iħ∂/∂t and p → −iħ∇, the energy relation E = p²/2m + V becomes iħ ∂ψ/∂t = −(ħ²/2m)∇²ψ + Vψ. Requiring ψ to stay finite and vanish far away picks out separate energies: E_n = −13.6 eV/n² for hydrogen.',
  'Balance the kinetic energy ħ²/(2ma²) of an electron confined to size a against the potential energy −ke²/a, and minimise: a = ħ²/(mke²) ≈ 0.053 nm and E = −ke²/(2a) ≈ −13.6 eV. The uncertainty principle sets the size of atoms.',
  'The equation is non-relativistic and leaves out spin and fine structure (Dirac’s equation adds them), and atoms with many electrons can only be solved approximately.'
]);
WL.fy('y2-small-oscillations', [
  'A carbon dioxide molecule vibrates in only a few patterns, each absorbing infrared at its own frequency; one of them, the bending at 15 μm, is why carbon dioxide warms the planet.',
  'Near equilibrium every system behaves like a set of coupled springs, because the potential is quadratic. Such systems have **normal modes**, patterns in which every part oscillates at the same frequency, and any small motion is a sum of them.',
  'Expanding V to second order gives V ≈ ½qᵀKq and kinetic energy ½q̇ᵀMq̇. Then Mq̈ = −Kq has solutions q = a e^(iωt) whenever det(K − ω²M) = 0: an eigenvalue problem. N degrees of freedom give N modes, some at zero frequency for overall motion.',
  'Carbon dioxide’s bending mode is at 667 cm⁻¹ (15 μm) and its asymmetric stretch at 2349 cm⁻¹ (4.3 μm). The symmetric stretch, at 1388 cm⁻¹, does not change the molecule’s dipole moment, so it does not absorb infrared.',
  'At larger amplitudes the potential is not quadratic and the modes exchange energy (anharmonic coupling), which is how molecules eventually share energy and reach thermal equilibrium.'
]);
WL.fy('y2-step-barrier', [
  'An electron with more than enough energy to get over a step can still bounce back. And in one dimension a well, however shallow, always holds at least one bound state.',
  'The wave changes its wavelength at the step, and any sudden change in a medium reflects part of a wave, as glass reflects part of the light. Quantum particles are waves, so they partly reflect even where a ball would sail over.',
  'Matching ψ and ψ′ at the step gives the reflected fraction R = ((k₁ − k₂)/(k₁ + k₂))². In one dimension any attractive well binds, because the exponential tails of a bound state can always be made to match.',
  'An electron with E = 2V₀ meeting a step of height V₀: k₂/k₁ = √((E − V₀)/E) ≈ 0.707, so R = (0.293/1.707)² ≈ 0.03. About 3 % bounce back.',
  'In three dimensions a shallow well need not bind (the deuteron is only just bound), and real steps are smooth: reflection fades when the change is gradual compared with the wavelength.'
]);
})();
