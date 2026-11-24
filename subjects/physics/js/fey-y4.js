/* Geodesic: "See it like Feynman" sections, y4. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('y4-chaos', [
  'Start a double pendulum twice from positions that look identical: the two runs match for a few seconds, then swing completely differently. Weather forecasts lose their skill after a week or two.',
  'In a **chaotic** system, nearby paths separate exponentially, so an error doubles every fixed interval. Since the starting state is never known exactly, prediction is lost after a time that grows only with the logarithm of our precision.',
  'The Lyapunov exponent λ sets the growth: δ(t) ≈ δ₀e^(λt), so an error reaches a tolerance Δ after t ≈ (1/λ) ln(Δ/δ₀). Chaos needs nonlinearity, and for a continuous flow at least three dimensions of phase space.',
  'If small errors double every day, making the starting measurements a thousand times more accurate (about 2¹⁰) adds only about ten days to the forecast.',
  'Chaos is not randomness: the motion is fully determined, often confined to a strange attractor whose statistics (the climate) can be predicted even when the path (the weather) cannot.'
]);
WL.fy('y4-classical-fields', [
  'Electric charge is not just conserved in total; it is conserved locally. Charge cannot vanish in one place and appear in another: it has to flow there, and every bit of the flow is accounted for.',
  'A **field theory** gives a value of the field at every point, and its Lagrangian density adds up energy-like terms. A symmetry of the Lagrangian density then gives more than a conserved total: a conserved **current**, a density and a flow obeying a continuity equation.',
  'Noether’s theorem for fields: a continuous symmetry gives ∂_μj^μ = 0, that is ∂ρ/∂t + ∇·j = 0. Symmetry under a change of phase, ψ → e^(iα)ψ, gives electric charge; symmetry under translations gives the energy–momentum tensor.',
  'Sunlight’s energy current at the Earth is 1361 W/m². Over a sphere of radius 1 AU that totals 4π(1.5 × 10¹¹)² × 1361 ≈ 3.8 × 10²⁶ W, the Sun’s luminosity: the same energy crosses every sphere, as local conservation demands.',
  'In general relativity the energy of gravity itself cannot be pinned to places, so the energy current of matter alone is not conserved in the ordinary sense.'
]);
WL.fy('y4-early-universe', [
  'About a quarter of the ordinary matter in the universe, by mass, is helium, almost the same everywhere: far more than stars could have made.',
  'In its first few minutes the universe was a hot nuclear reactor. Neutrons and protons stayed in balance until the reactions slowed; then neutrons decayed until, at about three minutes, deuterium could survive, and nearly all the remaining neutrons ended up in helium-4.',
  'When the reactions froze out, at kT ≈ 0.8 MeV, the neutron-to-proton ratio was e^(−Δm/kT) with Δm = 1.29 MeV: about 1/6. Decay lowered it to about 1/7 by the time nuclei could form. Each helium-4 holds two neutrons, so the helium mass fraction is Y = 2(n/p)/(1 + n/p).',
  'With n/p = 1/7, Y = 2 × (1/7)/(8/7) = 0.25, matching the observed 24 to 25 %.',
  'Inflation, a proposed burst of rapid early expansion that would have made the universe smooth and flat and seeded its ripples, fits the pattern of the microwave background, but it has not been seen directly and what drove it is unknown.'
]);
WL.fy('y4-feynman', [
  'Two electrons repel. In quantum field theory they do it by exchanging photons, and a drawing of that exchange is a recipe for calculating how likely each scattering angle is.',
  'Each **Feynman diagram** stands for one term in an expansion: lines are particles travelling, vertices are interactions, each carrying the coupling e. Every extra pair of vertices brings another factor of α = e²/(4πε₀ħc) ≈ 1/137, so each extra photon exchanged matters about a hundred times less.',
  'The diagrams are bookkeeping for perturbation theory in the interaction picture, organised by Wick’s theorem. Because α is small, a handful of diagrams gives extraordinary accuracy.',
  'The electron’s magnetic moment: g/2 = 1 + α/(2π) + …, where the first correction, α/(2π) ≈ 0.00116, was Schwinger’s 1948 result. Carried to five orders, theory and measurement agree to about one part in a trillion.',
  'The series does not truly converge (it is asymptotic), and for the strong force at low energies, inside protons, the coupling is too large for diagrams to work.'
]);
WL.fy('y4-friedmann', [
  'The density of the universe today is within about one per cent of the "critical" value that makes space flat, even though any early departure from it should have grown enormously.',
  'The **Friedmann equation** is energy conservation for an expanding universe: the expansion’s motion against gravity’s pull, with curvature keeping the books. Matter, radiation and dark energy thin out at different rates as space grows.',
  'H² = (8πG/3)ρ − kc²/a², plus a cosmological constant term. Matter density falls as a⁻³, radiation as a⁻⁴, and a cosmological constant stays fixed, so whichever dominates sets how the scale factor a(t) grows.',
  'The critical density is ρ_c = 3H₀²/(8πG). With H₀ = 70 km/s/Mpc = 2.27 × 10⁻¹⁸ s⁻¹, ρ_c ≈ 9 × 10⁻²⁷ kg/m³: about five hydrogen atoms per cubic metre.',
  'The model assumes the universe is the same everywhere and in every direction on large scales, and the nature of dark matter and dark energy, about 95 % of the total, is unknown.'
]);
WL.fy('y4-gauge', [
  'Change the phase of an electron’s wavefunction by the same amount everywhere and nothing observable changes. Demand that you may change it by different amounts in different places, and you are forced to introduce the electromagnetic field.',
  'A phase that varies from place to place spoils the derivative of ψ. A new field A_μ that shifts to compensate, A → A + ∂α/e, restores the symmetry. That compensating field is the photon, and the way it couples to charge is fixed by the symmetry: **gauge symmetry**.',
  'Replace ∂_μ by D_μ = ∂_μ + ieA_μ, and D_μψ changes just as ψ does. The field’s own Lagrangian, −¼F_μνF^μν, is the only simple gauge-invariant choice; a mass term m²A² would break the symmetry, so the photon must be massless.',
  'Measurements limit the photon’s mass to below about 10⁻¹⁸ eV, around 10⁻⁵⁴ kg.',
  'The weak force’s carriers, the W and Z, do have mass, which needs the gauge symmetry to be hidden, spontaneously broken, by the Higgs mechanism.'
]);
WL.fy('y4-gr', [
  'GPS works only because its engineers include general relativity: the satellites’ clocks gain about 38 microseconds a day on clocks on the ground. Ignored, that would make positions drift by about 10 km a day.',
  'Mass curves spacetime, and freely falling objects follow **geodesics**, the straightest possible paths. Clocks deeper in a gravitational well run slower. Satellite clocks sit higher, so they run fast, by about 45 μs a day, but they also move quickly, which slows them by about 7 μs a day.',
  'Einstein’s equations, G_μν = (8πG/c⁴)T_μν, relate curvature to energy and momentum. For weak fields the time part of the metric is g₀₀ ≈ −(1 + 2Φ/c²), so clock rates differ by ΔΦ/c².',
  'Between the ground and the GPS orbit (radius 26 600 km), GM(1/R_E − 1/r)/c² ≈ 5.3 × 10⁻¹⁰, which is 46 μs a day. The orbital speed of 3.9 km/s costs v²/2c² ≈ 8 × 10⁻¹¹, about 7 μs a day. The net 38 μs a day, times c, is about 11 km.',
  'General relativity is a classical theory that predicts its own breakdown at singularities; a quantum theory of gravity is still missing.'
]);
WL.fy('y4-gravitational-waves', [
  'On 14 September 2015 LIGO’s two detectors, 3000 km apart, recorded the same tiny wobble: 4 km arms changing length by about a four-hundredth of a proton’s width, as two black holes merged 1.3 billion light years away.',
  'Accelerating masses send ripples in spacetime outwards at the speed of light. A passing wave stretches space one way and squeezes it the other, alternately. Two black holes spiralling together radiate strongly and speed up as they lose energy, making a rising "chirp".',
  'The linearised Einstein equations give a wave equation for small ripples in the metric. The lowest-order radiation is quadrupole (there is no dipole radiation, because momentum is conserved), with strain h ~ (G/c⁴)(Q̈/r).',
  'A strain of 10⁻²¹ on a 4 km arm is a change of 4 × 10⁻¹⁸ m. The merger turned about three solar masses into waves in a fraction of a second: roughly 3 × 2 × 10³⁰ × 9 × 10¹⁶ ≈ 5 × 10⁴⁷ J.',
  'The final merger needs full numerical relativity; the simple quadrupole formula describes only the slow, early inspiral.'
]);
WL.fy('y4-higgs', [
  'The W and Z bosons, which carry the weak force, weigh about 80 and 91 GeV, nearly a hundred times a proton, while the photon has no mass at all. Yet the theory treats them as close relatives.',
  'The **Higgs field** fills space with a non-zero value; its potential is shaped like a sombrero, with the lowest point away from zero. Particles that interact with this background gain mass, while the photon does not interact with it and stays massless. Sitting at one point in the sombrero’s trough hides the symmetry without destroying it.',
  'Gauge symmetry forbids mass terms, but coupling to a field whose vacuum value is v produces terms ∝ g²v²A² that act as masses: m_W = gv/2. Three of the Higgs field’s four parts become the extra polarisation states of the W⁺, W⁻ and Z; the fourth is the Higgs boson.',
  'With v ≈ 246 GeV and g ≈ 0.65, m_W ≈ 0.65 × 246/2 ≈ 80 GeV, as measured.',
  'Most of a proton’s mass comes from the energy binding its quarks and gluons, not from the Higgs, and why the Higgs mass is so small compared with the Planck scale is unexplained.'
]);
WL.fy('y4-ising', [
  'Heat a magnet above 770 °C, iron’s Curie temperature, and it suddenly loses its magnetism. Cool it and the magnetism returns, pointing in a random direction.',
  'The **Ising model**: spins on a grid, each up or down, preferring to agree with their neighbours. At low temperature agreement wins (order: a magnet); at high temperature thermal jiggling wins (disorder). At the critical temperature, regions of every size fluctuate together.',
  'The free energy F = E − TS balances the energy saved by lining up against the entropy gained by disorder. In two dimensions Onsager solved the model exactly: kT_c = 2J/ln(1 + √2) ≈ 2.27J. Mean-field theory gives kT_c = zJ = 4J, too high because it ignores fluctuations.',
  'Iron’s Curie temperature, 1043 K, corresponds to kT_c ≈ 0.09 eV. The magnetic dipole energy between neighbouring iron atoms is only about 10⁻⁵ eV, so the lining up must come from the quantum exchange interaction, not from magnetic attraction.',
  'Real magnets have spins that point in any direction (the Heisenberg model), long-range forces and preferred axes. The Ising model captures the universal behaviour near T_c, not the details of a material.'
]);
WL.fy('y4-kg', [
  'Quantum mechanics plus E = p²/2m gives the Schrödinger equation. Quantum mechanics plus Einstein’s E² = p²c² + m²c⁴ gives the Klein–Gordon equation, which allows negative energies and cannot keep a single particle’s probability positive.',
  'The way out: ϕ is not a wavefunction but a **field**, a little oscillator at every point. Each Fourier mode of wavenumber k oscillates at ω_k = √(c²k² + m²c⁴/ħ²). Quantising each oscillator gives particles as its quanta, and the "negative energy" solutions become antiparticles.',
  'Putting E → iħ∂_t and p → −iħ∇ into E² = p²c² + m²c⁴ gives (∂²/c²∂t² − ∇² + m²c²/ħ²)ϕ = 0. Its Fourier modes are independent harmonic oscillators with energies (n + ½)ħω_k, and n counts the particles in that mode.',
  'A force carried by a particle of mass m has a range of about ħ/(mc). For the pion (140 MeV) that is 197 MeV fm / 140 MeV ≈ 1.4 fm: the range of the nuclear force, as Yukawa predicted in 1935.',
  'The free field is simple; interacting fields need perturbation theory and renormalisation, and the zero-point energies of all the modes add up to a huge vacuum energy that remains a puzzle.'
]);
WL.fy('y4-perturbation', [
  'A small electric field shifts hydrogen’s energy levels. The ground state shifts in proportion to E², but the n = 2 levels shift in proportion to E: the first-order effect appears only where levels share an energy.',
  'Treat a weak extra potential as a small correction. At first order, average it over the unperturbed state; at second order, let the state mix a little with others, which always lowers the ground state.',
  'E⁽¹⁾ = ⟨0|V|0⟩ and E⁽²⁾ = Σ|⟨n|V|0⟩|²/(E₀ − E_n), which is negative for the ground state. For 1s, ⟨1s|z|1s⟩ = 0 by symmetry, so the shift is second order, −½αE². The n = 2 states, 2s and 2p, share an energy, mix at first order and shift by ±3ea₀E.',
  'Hydrogen’s polarisability is about 7.4 × 10⁻⁴¹ C m²/V. In a field of 10⁷ V/m the ground state moves by −½αE² ≈ −2 × 10⁻⁸ eV, while the n = 2 levels move by 3ea₀E ≈ 1.6 × 10⁻³ eV, some 70 000 times more.',
  'The series need not converge, and in an electric field the electron can actually tunnel out of the atom, so the true states are resonances, which perturbation theory cannot see.'
]);
WL.fy('y4-phase-transitions', [
  'Water near its critical point (374 °C, 218 atmospheres) turns milky, and the difference between liquid and gas vanishes by the same power law, with the same exponent, as a magnet losing its magnetism near its Curie point.',
  'Near a critical point there are fluctuations on every length scale. Zoom out and rescale and the system looks the same: the details of the molecules wash out, and only symmetry and dimension remain. That is why very different systems share the same exponents (**universality**).',
  'The **renormalisation group** averages away short-scale fluctuations to get an effective description at larger scales. The critical point is a fixed point of this flow, and the exponents are set by how disturbances grow or shrink near it.',
  'In the three-dimensional Ising class, which includes the liquid–gas transition and magnets with one easy axis, the order vanishes as (T_c − T)^β with β ≈ 0.326. Mean-field theory predicts 0.5, which is wrong in three dimensions.',
  'First-order transitions, such as ordinary boiling, have no diverging length scale, and some transitions (topological ones, quantum critical points) need extensions of the theory.'
]);
WL.fy('y4-qed', [
  'Dirac wanted an equation for the electron that was first order in time, like Schrödinger’s, but relativistic. What came out predicted spin, the electron’s magnetic moment, and a particle nobody had seen: the positron, found by Anderson in 1932.',
  'Taking the square root of E² = p²c² + m²c⁴ consistently needs matrix coefficients, so the wavefunction has four components: two spin states, for both particle and antiparticle. The magnetic moment, g = 2, comes out automatically.',
  'The **Dirac equation** is (iħγ^μ∂_μ − mc)ψ = 0, with matrices obeying {γ^μ, γ^ν} = 2η^μν. Coupling it to the electromagnetic field by gauge symmetry gives **QED**, whose loop corrections move g slightly away from 2.',
  'The measured g/2 − 1 is 0.00115965…; the first QED term alone, α/2π ≈ 0.0011614, is already within 0.15 %.',
  'Dirac’s picture of a vacuum filled with a "sea" of electrons was replaced by quantum field theory, and QED alone leaves out the weak and strong forces.'
]);
WL.fy('y4-quantised-field', [
  'An empty box at absolute zero still pushes on its walls: two metal plates in a vacuum attract each other (the Casimir effect), first measured precisely in 1997.',
  'Each mode of the electromagnetic field is a quantum oscillator with zero-point energy ½ħω, even with no photons present. Between the plates only modes that fit are allowed; outside, all are. The difference in zero-point energy pulls the plates together.',
  'Adding ½ħω over the allowed modes, with a cutoff that cancels in the difference, gives an energy per area of −π²ħc/(720d³) and a pressure of −π²ħc/(240d⁴).',
  'For plates 1 μm apart, π²ħc/(240d⁴) ≈ 1.3 × 10⁻³ Pa. At 10 nm it is 10⁸ times larger: about one atmosphere.',
  'The same force can be derived from van der Waals forces between the plates’ atoms, without mentioning zero-point energy, and taking the zero-point energy of all space literally clashes enormously with the small dark energy actually observed.'
]);
WL.fy('y4-quantum-info', [
  'A quantum computer with 300 qubits holds a state described by 2³⁰⁰ numbers, more than the number of atoms in the observable universe.',
  'A **qubit** can be in a superposition of 0 and 1, and n qubits in a superposition of all 2ⁿ strings of bits. Gates act on every string at once, but a measurement gives only one result, so an algorithm must arrange interference so that wrong answers cancel and right ones reinforce.',
  'Grover’s search finds one marked item among N in about √N steps, turning the state towards the answer by a fixed angle each step. Shor’s algorithm factors numbers by finding periods with a quantum Fourier transform, exponentially faster than the best known classical method.',
  'Searching 10¹² items takes a classical computer about 5 × 10¹¹ checks on average; Grover’s algorithm needs about (π/4)√10¹² ≈ 8 × 10⁵ steps.',
  'Qubits lose coherence quickly. Useful machines need error correction, perhaps a thousand physical qubits for every reliable logical one, which is the main engineering challenge.'
]);
WL.fy('y4-renormalisation', [
  'The strength of electromagnetism is not fixed: α is about 1/137 at low energies and about 1/128 at the energy of the Z boson. The strong force does the opposite and weakens at high energies (asymptotic freedom, Nobel Prize 2004).',
  'The vacuum is full of virtual particle–antiparticle pairs, which screen a charge like a dielectric: from far away you see less charge, and probing closer you see more. Gluons carry colour charge themselves and do the opposite, so the strong charge looks smaller up close.',
  'Loop corrections make the couplings depend on the energy scale μ. In QED, dα/d ln μ = (2α²/3π) ΣQ_f², positive, so α grows; in QCD the beta function is negative as long as there are fewer than 16.5 quark flavours, so the coupling shrinks. This is the **running** of couplings.',
  'α(m_Z) ≈ 1/128 against α(0) ≈ 1/137. The strong coupling is about 0.12 at the Z mass, about 0.3 at 2 GeV, and approaches 1 below about 1 GeV, where quarks are confined.',
  'Renormalisation was once seen as hiding infinities; the modern view (Wilson’s) is that every theory is effective up to some scale, and the running describes how it changes with scale. Why the couplings have their particular values is unknown.'
]);
WL.fy('y4-schwarzschild', [
  'Squeeze the Earth into a ball 18 mm across, the size of a marble, and not even light could escape from it. Every mass has such a radius.',
  'The **Schwarzschild** solution describes spacetime outside any round mass. At r = 2GM/c² the escape speed reaches c, and inside that **horizon** every path leads inwards. Far away it reduces to Newton’s gravity.',
  'In the metric, the time and radial terms both contain (1 − r_s/r), which changes sign at r_s. Inside, r behaves like time, so moving inwards is as unavoidable as moving into the future.',
  'r_s = 2GM/c²: about 3 km for the Sun, 8.9 mm for the Earth, and about 12 million km for Sagittarius A*, the four-million-solar-mass black hole at our galaxy’s centre, imaged by the Event Horizon Telescope in 2022.',
  'Real black holes rotate (the Kerr solution). Inside the horizon general relativity predicts a singularity, where it breaks down, and quantum effects (Hawking radiation) make black holes slowly evaporate.'
]);
WL.fy('y4-standard-model', [
  'Everything you have ever touched is made of up quarks, down quarks and electrons. Yet nature has two more, heavier copies of that set, and nobody knows why there are three.',
  'The **Standard Model**: matter particles (quarks and leptons, in three generations), force carriers from the gauge symmetries SU(3) × SU(2) × U(1) (gluons, W and Z, photon), and the Higgs field giving masses. Each generation is a heavier copy of the first.',
  'Gauge symmetry fixes how the forces couple, and the theory is only consistent (free of anomalies) if quarks and leptons come in complete generations, with charges that add up to zero in each. Decays of the Z boson show that there are exactly three light neutrinos.',
  'The Z’s measured width implies 2.984 ± 0.008 light neutrino species: three.',
  'Gravity, dark matter, dark energy, neutrino masses and the excess of matter over antimatter all lie outside the Standard Model, which also needs about 19 numbers put in by hand.'
]);
WL.fy('y4-superconductivity', [
  'Below 9.2 K niobium carries current with no resistance at all (currents in superconducting rings have flowed for years without measurable decay), and it pushes magnetic fields out (the Meissner effect).',
  'Electrons pair up into **Cooper pairs** through the lattice: one electron pulls nearby ions towards it, and they attract a second electron. Pairs behave as bosons and condense into one coherent quantum state. To scatter, a pair must be broken, which costs the gap energy Δ: impossible for small disturbances at low temperature.',
  'In BCS theory the gap is Δ ≈ 1.76kT_c. One macroscopic wavefunction ψ = |ψ|e^(iθ) means the current depends on how θ varies; round a ring θ must come back to itself, so the magnetic flux through the ring is quantised in units of h/2e, the 2 revealing the pairs.',
  'For niobium, Δ ≈ 1.76 × 8.62 × 10⁻⁵ × 9.2 ≈ 1.4 meV. The flux quantum h/2e = 2.07 × 10⁻¹⁵ Wb is the unit counted by SQUID magnetometers, sensitive enough to detect the magnetic fields of the brain.',
  'High-temperature superconductors (cuprates, up to about 133 K at normal pressure) do not follow simple BCS theory, and their mechanism is still debated.'
]);
WL.fy('y4-topological', [
  'Carry an arrow round a closed path on a sphere, always keeping it parallel to itself, and it comes back turned. A Foucault pendulum does exactly this every day, and quantum states do it too: the Berry phase.',
  'When a system’s settings are slowly taken round a loop, its state picks up a geometric phase that depends only on the loop, like an enclosed area. In some materials, these phases summed over all the electron states give a whole number (a **Chern number**), which cannot change without closing the energy gap: the material’s topology.',
  'The Berry phase is γ = i∮⟨ψ|∇_R ψ⟩·dR, the flux of the Berry curvature through the loop. Over a closed surface such as the Brillouin zone it totals 2π times a whole number, and whole numbers cannot change smoothly: protected edge states and the exactly quantised Hall conductance follow.',
  'A Foucault pendulum at latitude φ turns through 360° × sin φ per sidereal day. In Paris (48.85° N) that is about 271° a day, a full turn in about 32 hours.',
  'The protection lasts only while the gap stays open and the relevant symmetries hold; disorder strong enough to close the gap destroys it.'
]);
})();
