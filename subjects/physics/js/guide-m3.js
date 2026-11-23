/* Geodesic step-by-step guides, stage m3 (built from src/guide/m3-*.js) */
WL.gd('m-hilbert', {
  h: 'Quantum states live in a Hilbert space: a complex vector space with an inner product, complete enough that limits of expansions stay inside it. Dirac’s bra–ket notation makes its geometry transparent: components are inner products, observables are Hermitian operators with real eigenvalues and perpendicular eigenvectors, and probabilities are squared lengths of projections.',
  s: [
    ['Inner products', [
      '⟨φ|ψ⟩ is linear in ψ, conjugate-linear in φ, and ⟨ψ|ψ⟩ > 0 for any non-zero ψ. The Cauchy–Schwarz inequality keeps every probability at most 1. For wavefunctions, ⟨φ|ψ⟩ = ∫φ*ψ dx.'
    ], { n: 0, e: '|\\langle\\varphi|\\psi\\rangle|^2\\le\\langle\\varphi|\\varphi\\rangle\\langle\\psi|\\psi\\rangle', x: ['For |ψ⟩ = (1, i)/√2 and |φ⟩ = (1, 1)/√2, find ⟨φ|ψ⟩ and check the Cauchy–Schwarz inequality.', ['⟨φ|ψ⟩ = (1 × 1 + 1 × i)/2 = (1 + i)/2.', '|⟨φ|ψ⟩|² = 2/4 = ½.', 'Both states have length 1, so the bound is 1, and ½ ≤ 1.'], '(1 + i)/2'], c: ['Why must a bra’s components be complex-conjugated?', 'So that ⟨ψ|ψ⟩ is real and positive: a length.'] }],
    ['Bases and expansions', [
      'In an orthonormal basis, |ψ⟩ = Σcₙ|n⟩ with cₙ = ⟨n|ψ⟩, and Σ|cₙ|² equals the squared length. Completeness, the fact that the basis spans everything, is written Σ|n⟩⟨n| = 1.'
    ], { n: 1, e: '|\\psi\\rangle = \\sum_nc_n|n\\rangle,\\qquad c_n = \\langle n|\\psi\\rangle', x: ['Expand |ψ⟩ = (3, 4i)/5 in the basis |±⟩ = (1, ±1)/√2.', ['c₊ = ⟨+|ψ⟩ = (3 + 4i)/(5√2); c₋ = (3 − 4i)/(5√2).', '|c₊|² = 25/50 = ½ and |c₋|² = ½.', 'They add to 1, as they must.'], 'c± = (3 ± 4i)/(5√2), each with probability ½'], c: ['What does Σ|n⟩⟨n| = 1 express?', 'Completeness: the basis spans the whole space.'] }],
    ['Operators and adjoints', [
      'The adjoint A† satisfies ⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩; for a matrix it is the conjugate transpose. **Hermitian** operators (A = A†) have real eigenvalues and perpendicular eigenvectors, so they represent observables.'
    ], { n: 2, e: 'A = A^\\dagger\\ \\Rightarrow\\ a_n\\in\\mathbb R', x: ['Show that A = (2 i; −i 2) is Hermitian, and find its eigenvalues.', ['Transpose, then conjugate: (2 −i; i 2) becomes (2 i; −i 2) = A.', 'det(A − λI) = (2 − λ)² − (i)(−i) = (2 − λ)² − 1 = 0.', 'λ = 1 or 3: real, as promised.'], 'Hermitian; eigenvalues 1 and 3'], c: ['What is the adjoint of a matrix?', 'Its conjugate transpose.'] }],
    ['Measurement', [
      'Measuring an observable gives eigenvalue aₙ with probability |⟨n|ψ⟩|² (the **Born rule**), and the average result is ⟨ψ|A|ψ⟩. Observables that do not commute obey ΔA ΔB ≥ ½|⟨[A, B]⟩|.'
    ], { n: 3, e: 'P(a_n) = |\\langle n|\\psi\\rangle|^2,\\qquad \\langle A\\rangle = \\langle\\psi|A|\\psi\\rangle', x: ['A spin is in (|↑⟩ + 2|↓⟩)/√5. Find the probabilities for S_z, its mean, and its spread.', ['P(+ħ/2) = 1/5 and P(−ħ/2) = 4/5.', '⟨S_z⟩ = (ħ/2)(1/5 − 4/5) = −0.3ħ.', '⟨S_z²⟩ = ħ²/4, so ΔS_z = √(0.25 − 0.09) ħ = 0.4ħ.'], '1/5 and 4/5; −0.3ħ; 0.4ħ'], c: ['What does the Robertson inequality give for S_x and S_y?', 'ΔS_x ΔS_y ≥ (ħ/2)|⟨S_z⟩|.'] }],
    ['Infinite dimensions', [
      'In infinite dimensions new issues appear. Position and momentum have no normalisable eigenvectors: their “eigenstates” are idealisations normalised to delta functions, and real states are wave packets built from them.'
    ], { n: 4, e: '\\langle k|k\'\\rangle = 2\\pi\\,\\delta(k-k\')\\quad\\text{for}\\ \\langle x|k\\rangle = e^{ikx}', x: ['Why is a plane wave e^(ikx) not a genuine state of a particle on a line?', ['Its squared length is ∫|e^(ikx)|² dx = ∫1 dx, which is infinite.', 'So it cannot be normalised: it would describe a particle spread evenly over all space.', 'Physical states are wave packets, superpositions of plane waves with a finite spread of k.'], 'it cannot be normalised'], c: ['How are continuous basis states normalised?', 'To delta functions, for example ⟨x|x′⟩ = δ(x − x′).'] }]
  ],
  m: [
    ['Forgetting to conjugate the bra.', '⟨φ| has the complex conjugates of φ’s components.'],
    ['Reading cₙ itself as a probability.', 'The probability is |cₙ|².'],
    ['Treating plane waves as normalisable states.', 'They are idealisations; physical states are wave packets.']
  ]
});

WL.gd('m-complex-analysis', {
  h: 'A complex function that is differentiable in the complex sense (analytic) is extraordinarily rigid: its real and imaginary parts are harmonic, its integral round any closed loop vanishes, and its values inside a loop are fixed by its values on the loop. The residue theorem turns this into a machine for real integrals, and analyticity itself turns out to express causality.',
  s: [
    ['The Cauchy–Riemann equations', [
      'f = u + iv is complex-differentiable if the derivative is the same from every direction. Comparing the real and imaginary directions gives the Cauchy–Riemann equations, and then u and v are both harmonic.'
    ], { n: 0, e: 'u_x = v_y,\\qquad u_y = -v_x', x: ['Is f(z) = z² analytic? And f(z) = z̄?', ['z² = (x² − y²) + i(2xy): u_x = 2x = v_y and u_y = −2y = −v_x. Analytic.', 'z̄ = x − iy: u_x = 1 but v_y = −1. Not analytic anywhere.'], 'z² yes; z̄ no'], c: ['What does analyticity imply about u and v?', 'Both satisfy Laplace’s equation.'] }],
    ['Cauchy’s theorem and formula', [
      'If f is analytic inside and on a closed contour, its integral round the contour is zero, so contours can be deformed freely through analytic regions. Cauchy’s formula recovers f anywhere inside from its values on the boundary.'
    ], { n: 1, e: 'f(a) = \\frac1{2\\pi i}\\oint\\frac{f(z)}{z-a}\\,dz', x: ['Evaluate ∮ e^z/(z − 1) dz round the circle |z| = 2.', ['e^z is analytic everywhere, and z = 1 lies inside the circle.', 'Cauchy’s formula: the integral is 2πi × e¹.', '= 2πie.'], '2πie'], c: ['Why can a contour be deformed through a region where f is analytic?', 'The integral round the closed loop between the old and new contours is zero.'] }],
    ['Laurent series and residues', [
      'Near an isolated singularity, f has a series with negative powers too. Only the 1/(z − a) term survives integration round the point: its coefficient is the **residue**.'
    ], { n: 2, e: '\\operatorname{Res}_{z=a}\\frac{g}{h} = \\frac{g(a)}{h\'(a)}', x: ['Find the residues at z = 0 of 1/(z(z − 2)) and of e^z/z³.', ['1/(z(z − 2)): a simple pole, residue lim z f = 1/(0 − 2) = −½.', 'e^z/z³ = (1 + z + z²/2 + …)/z³: the 1/z coefficient is ½.'], '−½ and ½'], c: ['What is the residue of g/h at a simple zero of h?', 'g(a)/h′(a).'] }],
    ['The residue theorem', [
      'A contour integral is 2πi times the sum of the residues inside. Real integrals along the whole line are done by closing the contour with a large semicircle whose contribution vanishes.'
    ], { n: 3, e: '\\oint_Cf\\,dz = 2\\pi i\\sum\\operatorname{Res}', x: ['Evaluate ∫₋∞^∞ cos x/(1 + x²) dx.', ['Use e^(iz)/(1 + z²) and close in the upper half-plane, where e^(iz) dies away.', 'The only pole inside is z = i, with residue e⁻¹/(2i).', 'Integral = 2πi × e⁻¹/(2i) = π/e ≈ 1.156; its real part is the answer.'], 'π/e'], c: ['Why close in the upper half-plane for e^(iz)?', 'There |e^(iz)| = e^(−Im z) dies away, so the large arc contributes nothing.'] }],
    ['Causality and analyticity', [
      'A physical response cannot come before its cause. Its Fourier transform is then analytic in the upper half of the complex frequency plane, which forces its real and imaginary parts to determine each other: the **Kramers–Kronig relations**. A material’s absorption at all frequencies fixes its refractive index.'
    ], { n: 4, e: '\\chi(\\omega) = \\frac1{\\omega_0^2-\\omega^2-i\\gamma\\omega}', x: ['A damped oscillator has the response χ(ω) above. Where are its poles, and what does that say?', ['The poles solve ω² + iγω − ω₀² = 0: ω = −iγ/2 ± √(ω₀² − γ²/4).', 'Both lie in the lower half-plane, so χ is analytic in the upper half.', 'That is causality in mathematical form: no response before the force acts.'], 'both poles in the lower half-plane'], c: ['What do the Kramers–Kronig relations say?', 'For a causal response, the real and imaginary parts determine each other.'] }]
  ],
  m: [
    ['Forgetting the factor 2πi.', 'The integral is 2πi times the sum of residues.'],
    ['Including poles outside the contour.', 'Count only the poles inside.'],
    ['Closing the contour on the side where the integrand grows.', 'Close where it dies away.']
  ]
});

WL.gd('m-conformal', {
  h: 'An analytic function maps the plane so that small shapes keep their angles: it is conformal wherever its derivative is not zero. Laplace’s equation survives such maps, so a potential problem in an awkward region can be transformed to a simple one, solved there and mapped back. Electrostatics, heat flow and two-dimensional ideal flow past wings all yield to this method.',
  s: [
    ['Conformality', [
      'Near a point, w = f(z) acts like multiplication by f′(z): a rotation and a scaling, the same in every direction. So angles between curves are kept wherever f′ ≠ 0. At a **critical point** (f′ = 0) angles are multiplied.'
    ], { n: 0, e: 'dw = f\'(z)\\,dz', x: ['Under w = z², what happens to angles at z = 1 + i and at z = 0?', ['At 1 + i, f′ = 2(1 + i) ≠ 0: locally a rotation by 45° and a scaling by 2√2, so angles are kept.', 'At 0, f′ = 0: the quarter-plane (an angle of 90°) maps to the half-plane (180°).', 'Angles at the origin are doubled.'], 'kept at 1 + i, doubled at 0'], c: ['Where can an analytic map fail to keep angles?', 'At points where f′(z) = 0.'] }],
    ['Harmonic functions are preserved', [
      'If φ(w) satisfies Laplace’s equation and w = f(z) is analytic, then φ(f(z)) satisfies it too, and boundary values carry across. The real and imaginary parts of analytic functions are themselves ready-made solutions.'
    ], { n: 1, e: '\\nabla^2\\varphi = 0\\ \\Rightarrow\\ \\nabla^2\\big[\\varphi(f(z))\\big] = 0', x: ['Find the steady temperature in the upper half-plane when the boundary is held at 100 °C for x < 0 and 0 °C for x > 0.', ['arg z = θ is harmonic: it is the imaginary part of log z.', 'θ = 0 on the positive x-axis and π on the negative one.', 'So T = 100θ/π: 0 °C on the right, 100 °C on the left, and 50 °C straight up.'], 'T = 100θ/π'], c: ['Why is arg z harmonic?', 'It is the imaginary part of the analytic function log z.'] }],
    ['Standard maps', [
      'Powers zⁿ open up wedges; the exponential turns strips into half-planes; and **Möbius maps** (az + b)/(cz + d) send circles and lines to circles and lines. Together they reach most simple shapes.'
    ], { n: 2, e: 'w = \\frac{az+b}{cz+d}', x: ['w = (z − i)/(z + i) maps the upper half-plane onto the unit disc. Where do z = i, 0 and ∞ go?', ['z = i: w = 0, the centre.', 'z = 0: w = −i/i = −1.', 'z → ∞: w → 1. The real axis becomes the unit circle.'], '0, −1 and 1'], c: ['What does w = zⁿ do to a wedge of angle π/n?', 'Opens it into a half-plane.'] }],
    ['Ideal flow', [
      'For two-dimensional, incompressible, swirl-free flow, the complex potential W(z) is analytic, and the velocity is read from dW/dz. Flow past a cylinder of radius a is W = U(z + a²/z).'
    ], { n: 3, e: 'v_x-iv_y = \\frac{dW}{dz}', x: ['For W = U(z + a²/z), find the flow speed at the top of the cylinder.', ['dW/dz = U(1 − a²/z²).', 'At the top, z = ia: 1 − a²/(−a²) = 2.', 'The speed is 2U, twice the free stream, so by Bernoulli the pressure is lowest there.'], '2U'], c: ['How is the velocity read from the complex potential?', 'v_x − iv_y = dW/dz.'] }],
    ['Aerofoils', [
      'The Joukowski map turns flow round an offset circle into flow round a wing-like shape. Requiring the flow to leave the sharp trailing edge smoothly fixes the circulation and gives lift.',
      'Ideal flow has real limits: it predicts zero drag on any body (d’Alembert’s paradox) and no stall, because it ignores viscosity and the separation of the flow.'
    ], { n: 4, e: 'L = \\rho U\\Gamma,\\qquad C_L\\approx2\\pi\\alpha', x: ['Thin-aerofoil theory gives C_L ≈ 2πα. Predict the lift coefficient at 5°, and say where the theory fails.', ['α = 5° = 0.087 rad, so C_L ≈ 2π × 0.087 = 0.55.', 'Real thin sections give slightly less, because of viscosity.', 'Above roughly 15° real wings stall as the flow separates; ideal-flow theory never predicts that.'], 'about 0.55'], c: ['What does the Kutta condition require?', 'The flow must leave the sharp trailing edge smoothly; that fixes the circulation and so the lift.'] }]
  ],
  m: [
    ['Assuming angles are kept at critical points.', 'Where f′ = 0, angles are multiplied.'],
    ['Forgetting to carry the boundary values across the map.', 'Map the boundary conditions too.'],
    ['Trusting ideal flow for drag or stall.', 'Those need viscosity.']
  ]
});

WL.gd('m-branch-cuts', {
  h: 'Functions like log z and √z take several values: going once round the origin adds 2πi to the logarithm and flips the sign of the square root. To make them single-valued we cut the plane along a line paths may not cross, or glue sheets into a Riemann surface. Branch cuts are not just a nuisance: keyhole contours use them to evaluate integrals, and in physics they appear wherever a new process switches on.',
  s: [
    ['Multivalued functions', [
      'arg z is defined only up to multiples of 2π, so log z has infinitely many values, and so do powers z^a = e^(a log z) unless a is a whole number. A **branch point** is a point that cannot be circled without the value changing.'
    ], { n: 0, e: 'z^a = e^{a\\log z},\\qquad \\log z = \\ln|z|+i(\\arg z+2\\pi k)', x: ['Find all values of (−8)^(1/3).', ['−8 = 8e^(i(π + 2πk)), so the cube roots are 2e^(i(π/3 + 2πk/3)).', 'k = 0: 1 + i√3. k = 1: −2. k = 2: 1 − i√3.', 'Three values, spaced 120° apart round a circle of radius 2.'], '1 + i√3, −2, 1 − i√3'], c: ['What is a branch point?', 'A point that cannot be circled without the function’s value changing.'] }],
    ['Branch cuts', [
      'A **branch cut** joins the branch points; forbidding paths from crossing it makes the function single-valued. The principal branch of log cuts along the negative real axis, and the function jumps across the cut.'
    ], { n: 1, e: '-\\pi<\\arg z\\le\\pi', x: ['With the principal branch, find √z just above and just below the cut at z = −4.', ['Just above, arg z → π: √z = 2e^(iπ/2) = 2i.', 'Just below, arg z → −π: √z = 2e^(−iπ/2) = −2i.', 'The value jumps by 4i across the cut.'], '2i above, −2i below'], c: ['Where does the principal logarithm put its cut?', 'Along the negative real axis.'] }],
    ['Keyhole contours', [
      'For integrals of x^(a−1)f(x) from 0 to ∞, go out just above the positive real axis and back just below it. Below the cut the integrand has picked up a factor e^(2πi(a−1)), so the two straight pieces do not cancel, and the residue theorem gives the answer.'
    ], { n: 2, e: '\\int_0^\\infty\\frac{x^{a-1}}{1+x}\\,dx = \\frac{\\pi}{\\sin\\pi a}\\qquad(0<a<1)', x: ['Evaluate ∫₀^∞ dx/(x^(2/3)(1 + x)).', ['Here a − 1 = −2/3, so a = 1/3.', 'π/sin(π/3) = π/(√3/2) = 2π/√3.', '≈ 3.63.'], '2π/√3'], c: ['Why do the two straight pieces of the keyhole not cancel?', 'Below the cut the integrand carries an extra phase factor.'] }],
    ['Analytic continuation', [
      'If two analytic functions agree on any small arc, they agree wherever both are defined, so a function has at most one analytic extension. The Gamma function, first defined by an integral for Re z > 0, extends to every z except 0, −1, −2, ….'
    ], { n: 3, e: '\\Gamma(z+1) = z\\,\\Gamma(z)', x: ['The integral for Γ(z) diverges at z = −½. Use Γ(z + 1) = zΓ(z) to find Γ(−½).', ['Γ(½) = √π.', 'With z = −½: Γ(½) = (−½)Γ(−½).', 'So Γ(−½) = −2√π ≈ −3.54.'], '−2√π'], c: ['Why can an analytic function be continued in only one way?', 'Two analytic functions that agree on any small arc agree everywhere both are defined.'] }],
    ['Branch cuts in physics', [
      'Scattering amplitudes, as functions of energy, have branch points at thresholds where a new process becomes possible, because the outgoing momentum is a square root of the energy above threshold. Just above threshold, cross-sections grow as a power of that momentum.'
    ], { n: 4, e: '\\sigma\\propto k^{2l+1},\\qquad k\\propto\\sqrt{E-E_{\\text{th}}}', x: ['How does an s-wave (l = 0) reaction cross-section behave just above its threshold, and what happens below?', ['σ ∝ k ∝ √(E − E_th): it rises from zero like a square root.', 'Below threshold, k would be imaginary: the channel is closed.', 'The square root makes E_th a branch point of the amplitude.'], 'σ ∝ √(E − E_th) above threshold'], c: ['Why does a square root create a branch point in energy?', 'Going round E_th in the complex energy plane flips its sign.'] }]
  ],
  m: [
    ['Expecting a function to stay continuous across its cut.', 'It jumps there.'],
    ['Finding only one root of zⁿ = w.', 'There are n of them.'],
    ['Using the integral for Γ(z) where it diverges.', 'Continue with Γ(z + 1) = zΓ(z).']
  ]
});

WL.gd('m-green', {
  h: 'A Green’s function is the response of a linear system to a point source or an instantaneous kick. Because the system is linear, the response to any source is the sum, a convolution, of point responses. Choosing the right Green’s function builds in the boundary conditions, and choosing the retarded one builds in causality: no response before the cause.',
  s: [
    ['Definition and use', [
      'For a linear operator L with boundary conditions, LG(x, ξ) = δ(x − ξ). Then y = ∫G(x, ξ)f(ξ) dξ solves Ly = f with the same boundary conditions.'
    ], { n: 0, e: 'L\\,G(x,\\xi) = \\delta(x-\\xi),\\qquad y(x) = \\int G(x,\\xi)\\,f(\\xi)\\,d\\xi', x: ['For y″ = f on 0 < x < 1 with y(0) = y(1) = 0, G = x(ξ − 1) for x < ξ and ξ(x − 1) for x > ξ. Solve y″ = x.', ['y = ∫₀ˣ ξ(x − 1)ξ dξ + ∫ₓ¹ x(ξ − 1)ξ dξ.', 'Working out both integrals: y = x(x² − 1)/6.', 'Check: y″ = x, and y(0) = y(1) = 0.'], 'y = x(x² − 1)/6'], c: ['Why does the solution satisfy the same boundary conditions as G?', 'It is a sum of copies of G, each of which does.'] }],
    ['Constructing G', [
      'Away from ξ, G solves the unforced equation: use the solution that satisfies the left boundary condition for x < ξ and the right one for x > ξ. Join them so G is continuous and its slope jumps by 1 at ξ; the Wronskian sets the scale.'
    ], { n: 1, e: 'G(x,\\xi) = \\frac{y_1(x_<)\\,y_2(x_>)}{W}', x: ['Build the Green’s function of y″ + y = f on 0 < x < π/2 with y(0) = y(π/2) = 0.', ['Left solution y₁ = sin x (zero at 0); right solution y₂ = cos x (zero at π/2).', 'Wronskian: W = y₁y₂′ − y₁′y₂ = −sin²x − cos²x = −1.', 'G = −sin(x_<) cos(x_>), with x_< and x_> the smaller and larger of x and ξ. Its slope jumps by sin²ξ + cos²ξ = 1, as required.'], 'G = −sin(x_<) cos(x_>)'], c: ['What sets the size of the slope jump?', 'The delta function: the slope jumps by 1 (divided by the leading coefficient).'] }],
    ['Causal Green’s functions', [
      'For a driven oscillator the **retarded** Green’s function is zero before the kick and a free oscillation after it. The response to any force history is the sum of responses to all the earlier kicks.'
    ], { n: 2, e: 'x(t) = \\int_{-\\infty}^{t}G(t-t\')\\,F(t\')\\,dt\',\\qquad G(t) = \\frac{\\theta(t)\\sin\\omega t}{m\\omega}', x: ['A mass on a spring, at rest, feels a force switched on at t = 0 and then held at F₀. Find the motion.', ['x(t) = ∫₀ᵗ sin(ω(t − t′))/(mω) × F₀ dt′.', '= (F₀/(mω²))(1 − cos ωt).', 'It oscillates between 0 and 2F₀/k about the new equilibrium F₀/k: a sudden load overshoots.'], 'x = (F₀/k)(1 − cos ωt)'], c: ['What does the step function θ(t) in G build in?', 'Causality: no response before the kick.'] }],
    ['Potentials and waves', [
      'For Poisson’s equation the free-space Green’s function is 1/(4π|r − r′|), the potential of a unit point charge, and adding up point charges gives the familiar Coulomb integral. For the wave equation, the retarded Green’s function uses the source at the earlier time t − |r − r′|/c.'
    ], { n: 3, e: 'G = \\frac1{4\\pi|\\mathbf r-\\mathbf r\'|}', x: ['Write the potential of a charge distribution ρ, and say what changes when the charges move.', ['φ(r) = ∫ρ(r′)/(4πε₀|r − r′|) dV′: point potentials, added up.', 'For moving charges, each point contributes as it was at the retarded time t − |r − r′|/c.', 'So any change spreads outwards at the speed of light.'], 'the Coulomb integral, evaluated at retarded times'], c: ['How long after the Sun changed would the change in its gravity reach us?', 'About 8.3 minutes: gravitational waves travel at c, as the 2017 neutron-star merger confirmed.'] }],
    ['The method of images', [
      'To meet a boundary condition such as φ = 0 on a grounded plate, add imaginary “image” sources outside the region, placed so that the condition holds automatically.'
    ], { n: 4, e: 'F = \\frac{q^2}{4\\pi\\varepsilon_0(2d)^2}', x: ['A 1.0 nC charge sits 2.0 cm above a large grounded metal plate. Find the force on it.', ['The image is −1.0 nC at 2.0 cm below the plate, 4.0 cm from the charge.', 'F = 8.99 × 10⁹ × (10⁻⁹)² ÷ 0.040² = 5.6 × 10⁻⁶ N.', 'The charge is pulled towards the plate.'], '5.6 μN, towards the plate'], c: ['Why is it allowed to put an imaginary charge below the plate?', 'It lies outside the region of interest, where it only enforces φ = 0 on the plate.'] }]
  ],
  m: [
    ['Forgetting the slope jump when joining the two pieces of G.', 'The slope must jump by 1 (over the leading coefficient).'],
    ['Using a Green’s function that responds before the kick.', 'For driven systems use the retarded one.'],
    ['Putting an image charge inside the region of interest.', 'Images must lie outside it.']
  ]
});

WL.gd('m-integral-equations', {
  h: 'An integral equation has the unknown function inside an integral. Problems arrive in this form when the present depends on the whole past (Volterra equations), when a field at one point depends on sources everywhere (Fredholm equations), or when a measurement is a blurred average of the quantity we want. Equations of the second kind are usually well behaved; those of the first kind are often treacherous.',
  s: [
    ['Kinds of equation', [
      'A **Fredholm** equation has fixed limits; a **Volterra** equation has a variable upper limit. In the second kind the unknown also appears outside the integral; in the first kind only inside. K(x, t) is the **kernel**.'
    ], { n: 0, e: 'y(x) = f(x)+\\lambda\\int_a^bK(x,t)\\,y(t)\\,dt', x: ['Classify y(x) = sin x + ∫₀ˣ (x − t)y(t) dt and f(x) = ∫₀¹ e^(xt)y(t) dt.', ['The first has a variable upper limit and y outside the integral: Volterra, second kind.', 'The second has fixed limits and y only inside: Fredholm, first kind.'], 'Volterra second kind; Fredholm first kind'], c: ['Which kind is usually better behaved?', 'The second kind.'] }],
    ['From differential equations', [
      'Integrating y′ = F(x, y) from a starting value gives a Volterra equation with the initial condition built in. A boundary-value problem becomes a Fredholm equation whose kernel is its Green’s function.'
    ], { n: 1, e: 'y(x) = y_0+\\int_0^xF(t,y(t))\\,dt', x: ['Turn y′ = y, y(0) = 1 into an integral equation.', ['Integrate from 0 to x: y(x) − y(0) = ∫₀ˣ y(t) dt.', 'So y(x) = 1 + ∫₀ˣ y(t) dt: a Volterra equation of the second kind.'], 'y(x) = 1 + ∫₀ˣ y(t) dt'], c: ['What does the Volterra form contain that the differential equation alone does not?', 'The initial condition.'] }],
    ['The Neumann series', [
      'Substituting the equation into itself again and again gives y = f + λKf + λ²K²f + …. It converges when λ times the size of K is less than 1, and for Volterra equations with bounded kernels it always converges.'
    ], { n: 2, e: 'y = f+\\lambda Kf+\\lambda^2K^2f+\\cdots', x: ['Solve y(x) = 1 + ∫₀ˣ y(t) dt by repeated substitution.', ['Start with y₀ = 1; then y₁ = 1 + x.', 'y₂ = 1 + ∫₀ˣ (1 + t) dt = 1 + x + x²/2, and so on.', 'The pattern is the series for eˣ, so y = eˣ.'], 'y = eˣ'], c: ['Why does the series always converge for Volterra equations with bounded kernels?', 'The nth term carries a factor like xⁿ/n!.'] }],
    ['Separable kernels', [
      'If the kernel is a sum of products a(x)b(t), the unknown reduces to a few constants found by algebra. At special values of λ, the eigenvalues of the kernel, a unique solution fails (the **Fredholm alternative**).'
    ], { n: 3, x: ['Solve y(x) = 1 + λ∫₀¹ y(t) dt, and find where it fails.', ['The integral is a constant c, so y = 1 + λc is constant too.', 'Then c = ∫₀¹ y dt = 1 + λc, so c = 1/(1 − λ) and y = 1/(1 − λ).', 'At λ = 1, an eigenvalue of the kernel, there is no solution.'], 'y = 1/(1 − λ); fails at λ = 1'], c: ['What is the Fredholm alternative?', 'At an eigenvalue of the kernel there is either no solution or infinitely many; otherwise exactly one.'] }],
    ['Abel’s equation and inverse problems', [
      'Many measurements are blurred averages, f = ∫K(x, t)y(t) dt, and recovering y is an equation of the first kind. Abel solved one such problem exactly in 1823, and the same equation recovers the speed of waves inside the Earth from earthquake travel times.',
      'Most first-kind problems are treacherous: a smooth kernel washes out fine detail, so very different y give almost the same f, and tiny noise in f is hugely amplified. They need **regularisation**: adding a mild preference for smooth answers.'
    ], { n: 4, e: '\\int_0^x\\frac{\\varphi(t)\\,dt}{\\sqrt{x-t}} = f(x)', x: ['Why is “un-blurring” a measurement so delicate?', ['A smooth kernel averages over neighbouring points, wiping out rapid wiggles in y.', 'So adding a large, rapid wiggle to y barely changes f.', 'Running it backwards, a tiny bit of noise in f can produce a huge wiggle in y, unless the solution is regularised.'], 'noise is amplified enormously'], c: ['What did Abel’s equation let seismologists recover?', 'The speed of waves at different depths in the Earth, from earthquake travel times.'] }]
  ],
  m: [
    ['Expecting a unique solution at an eigenvalue of the kernel.', 'There the solution fails or is not unique.'],
    ['Solving a first-kind equation without regularisation.', 'Noise is amplified; add a smoothness preference.'],
    ['Using a Neumann series for a Fredholm equation with large λ.', 'It converges only when λ times the kernel’s size is less than 1.']
  ]
});
WL.gd('m-tensors', {
  h: 'Physical laws cannot depend on how we orient our axes. Tensors are the quantities that make this automatic: their components change in a fixed way when the axes rotate, so an equation between tensors that holds in one frame holds in all. Index notation with the summation convention turns pages of vector algebra into a few lines.',
  s: [
    ['Index notation', [
      'Write a vector as aᵢ, with i = 1, 2, 3. A repeated index is summed (the **summation convention**): aᵢbᵢ is a·b, and Aᵢⱼxⱼ is a matrix times a vector. An index appearing once in each term is **free**; a summed one is a **dummy** and may be renamed. δᵢⱼ is the identity, and εᵢⱼₖ gives cross products: (a × b)ᵢ = εᵢⱼₖaⱼbₖ.'
    ], { n: 0, e: '\\nabla\\cdot(\\varphi\\mathbf a) = \\partial_i(\\varphi a_i)', x: ['Prove ∇·(φa) = a·∇φ + φ∇·a using index notation.', ['Write the divergence as ∂ᵢ(φaᵢ), summed over i.', 'Product rule: ∂ᵢ(φaᵢ) = (∂ᵢφ)aᵢ + φ(∂ᵢaᵢ).', 'Read each term back: aᵢ∂ᵢφ = a·∇φ and ∂ᵢaᵢ = ∇·a.'], '∇·(φa) = a·∇φ + φ∇·a'], c: ['In aᵢbᵢcⱼ, which index is free, and what is the result?', 'j is free; the result is the vector (a·b)c.'] }],
    ['The transformation law', [
      'Under a rotation R, a vector’s components change as a′ᵢ = Rᵢⱼaⱼ, and a rank-2 tensor’s as T′ᵢⱼ = RᵢₖRⱼₗTₖₗ: one factor of R for each index. That is the definition: an array of numbers is a tensor only if its components transform this way. In matrix form, T′ = RTRᵀ.'
    ], { n: 1, e: 'T\'_{ij} = R_{ik}R_{jl}T_{kl}', x: ['A crystal’s conductivity tensor is diag(1, 2) in some units. Apply the transformation law with R = (0 −1; 1 0), a 90° rotation in the xy-plane.', ['T′ = RTRᵀ. First, RT = (0 −2; 1 0).', 'Then (RT)Rᵀ = (2 0; 0 1).', 'The principal values have swapped places because the axes have; the trace, 3, is unchanged.'], 'T′ = diag(2, 1)'], c: ['What makes an array of numbers a tensor?', 'Its components transform with one factor of R for each index.'] }],
    ['Contractions and invariants', [
      'Setting two indices equal and summing (a **contraction**) lowers the rank by two: Tᵢᵢ is the trace. Quantities with no free indices are **invariants**, the same in every frame. For a symmetric tensor the eigenvalues (principal values) are invariant too, and its eigenvectors are the principal axes.'
    ], { n: 2, e: '\\sigma_{ij}n_j = \\lambda\\,n_i', x: ['On the surface of a twisted rod the stress is pure shear: σ = (0 τ; τ 0), in axes along and around the rod. Find the principal stresses and their directions.', ['Eigenvalues: λ² − τ² = 0, so λ = +τ (tension) and −τ (compression).', 'Eigenvectors: (1, 1)/√2 for +τ and (1, −1)/√2 for −τ, both at 45° to the axis.', 'Chalk is weak in tension, so it cracks across the largest tension: twist a stick of chalk and it breaks along a 45° helix, as predicted. A ductile metal rod instead shears straight across, because it fails in shear. The tensor is the same; the failure rule is not.'], '±τ, at 45° to the axis'], c: ['Which quantities of a symmetric rank-2 tensor do not depend on the axes?', 'Its trace, its determinant and its eigenvalues (the principal values).'] }],
    ['The inertia tensor', [
      'Angular momentum and angular velocity are linked by Lᵢ = Iᵢⱼωⱼ, with Iᵢⱼ = Σm(r²δᵢⱼ − xᵢxⱼ). Unless ω lies along a principal axis, L is not parallel to ω. Stress, strain and the conductivity of crystals work the same way.'
    ], { n: 3, e: 'L_i = I_{ij}\\omega_j', x: ['Two masses m sit at ±(a, 0, a), a dumbbell tilted at 45°, spinning with ω = ωẑ. Find L.', ['Each mass has r² = 2a². So I₃₃ = 2m(2a² − a²) = 2ma², I₁₃ = 2m(0 − a²) = −2ma², and I₂₃ = 0.', 'L = (I₁₃ω, I₂₃ω, I₃₃ω) = 2ma²ω(−1, 0, 1): at 45° to the axis of spin.', 'As the dumbbell turns, L turns with it, so the bearings must keep supplying a torque. This is why car wheels are balanced with small weights: an unbalanced wheel shakes its axle.'], 'L = 2ma²ω(−1, 0, 1)'], c: ['When is L parallel to ω?', 'When ω lies along a principal axis: an eigenvector of I.'] }],
    ['The metric', [
      'In relativity the **metric** g_μν turns coordinate differences into the invariant interval, ds² = g_μν dx^μ dx^ν, with g = diag(−1, 1, 1, 1) in flat spacetime (taking c = 1). A negative ds² means the events are timelike separated: a clock can travel between them, and √(−ds²) is the time it records.'
    ], { n: 4, e: 'ds^2 = -c^2dt^2+dx^2+dy^2+dz^2', x: ['Two events are 5.0 s apart in time and 3.0 light-seconds apart in space. Find the interval, and the time a clock carried between them would record.', ['With c = 1 light-second per second: ds² = −5.0² + 3.0² = −16 (light-seconds)².', 'Negative, so timelike: a clock can make the trip, at 3.0/5.0 = 0.6c.', 'It records √16 = 4.0 s: 5.0 s divided by γ = 1.25. Real clocks agree: muons circling CERN’s storage ring at 99.94% of c lived about 64 μs instead of 2.2 μs, just as γ ≈ 29 predicts.'], 'ds² = −16 (light-seconds)²; 4.0 s'], c: ['Why does every inertial observer get the same ds²?', 'It is a full contraction with no free indices: a scalar.'] }]
  ],
  m: [
    ['Using one dummy index three times in a term, as in aᵢbᵢcᵢ.', 'Each summed index appears exactly twice; rename one if needed.'],
    ['Calling any array of numbers a tensor.', 'It must transform with one factor of R for each index.'],
    ['Assuming L is parallel to ω.', 'Only when ω lies along a principal axis.']
  ]
});

WL.gd('m-nonlinear', {
  h: 'In a linear system, doubling the cause doubles the effect and nothing qualitatively new happens. Nonlinear systems can change character suddenly as a parameter is turned: steady states appear or vanish, steady oscillations are born, and with three or more variables the motion can become chaotic. A small catalogue of standard patterns covers a remarkable range of real systems.',
  s: [
    ['Fixed points and stability', [
      'A **fixed point** is a state where nothing changes. Linearise about it: in one variable it is stable if f′(x*) < 0; in two, the eigenvalues of the **Jacobian** decide. If all real parts are negative it is stable; complex eigenvalues mean spiralling; real ones of opposite sign mean a saddle.'
    ], { n: 0, e: '\\ddot\\theta+\\gamma\\dot\\theta+\\sin\\theta = 0', x: ['A damped pendulum obeys θ̈ + 0.5θ̇ + sin θ = 0. Classify its fixed points at θ = 0 and θ = π.', ['As a system: θ̇ = ω, ω̇ = −sin θ − 0.5ω. The Jacobian has rows (0, 1) and (−cos θ, −0.5).', 'At θ = 0: λ² + 0.5λ + 1 = 0, so λ = −0.25 ± 0.97i: a stable spiral (decaying swings).', 'At θ = π (upside down): λ² + 0.5λ − 1 = 0, so λ = 0.78 and −1.28: a saddle, unstable.'], 'stable spiral at 0; saddle at π'], c: ['When can linearisation not decide stability?', 'When an eigenvalue has zero real part, for example at a centre.'] }],
    ['Bifurcations', [
      'As a parameter μ passes a critical value, fixed points can be born, destroyed or exchange stability: a **bifurcation**. In a **saddle-node** (ẋ = μ + x²) a stable and an unstable point collide and vanish. In a **pitchfork** (ẋ = μx − x³) one stable state splits into two.',
      'Real systems are never perfectly symmetric, and a small imperfection unfolds the pitchfork: a real column bends smoothly towards its weaker side instead of choosing at random. Thin cylindrical shells are an extreme case: tiny dents can make them buckle at a fraction of their ideal load, so engineers multiply the ideal value by a “knockdown factor” well below 1.'
    ], { n: 1, e: '\\dot x = \\mu x-x^3', x: ['Find the fixed points of ẋ = μx − x³ and their stability, for μ < 0 and for μ > 0.', ['Fixed points: x(μ − x²) = 0, so x = 0, and x = ±√μ when μ > 0.', 'f′(x) = μ − 3x². At x = 0, f′ = μ: stable for μ < 0, unstable for μ > 0.', 'At x = ±√μ, f′ = −2μ < 0: stable. One stable state splits into two as μ passes 0, like a column buckling left or right.'], 'a pitchfork at μ = 0'], c: ['What happens at a saddle-node bifurcation?', 'A stable and an unstable fixed point collide and both disappear.'] }],
    ['Limit cycles', [
      'A **limit cycle** is an isolated closed orbit that nearby trajectories approach (or leave): a heartbeat, a bowed string, a laser. In a **Hopf bifurcation** a stable spiral loses stability and a small limit cycle is born, its radius growing like √μ.'
    ], { n: 2, e: '\\dot r = \\mu r-r^3,\\qquad \\dot\\theta = 1', x: ['For ṙ = μr − r³, θ̇ = 1 with μ = 0.04, find the attracting orbit, and say how its size depends on μ.', ['Fixed points of the r equation: r = 0 and r = √μ = 0.2.', 'For 0 < r < 0.2, ṙ > 0; for r > 0.2, ṙ < 0. Every orbit spirals onto the circle r = 0.2.', 'The amplitude grows as √μ, so the oscillation’s power, proportional to r², rises linearly from zero as μ passes onset.'], 'the circle r = 0.2'], c: ['What does the Poincaré–Bendixson theorem rule out in the plane?', 'Chaos: bounded orbits in two dimensions settle onto fixed points or closed orbits.'] }],
    ['Poincaré maps', [
      'Record a trajectory each time it crosses a chosen surface. The flow becomes a **map** with one dimension fewer: a limit cycle becomes a fixed point, whose stability is set by its **multiplier**, the factor by which a small deviation changes on each return.'
    ], { n: 3, e: 'r_{n+1} = P(r_n)', x: ['For the system in the last step with μ = 0.04, record r each time the orbit crosses the positive x-axis. Find the map’s fixed point and its multiplier.', ['Crossings come every 2π in time; the limit cycle gives the fixed point r* = 0.2.', 'Near it, δ = r − r* obeys δ̇ = (μ − 3r*²)δ = −2μδ.', 'Each return multiplies δ by e^(−4πμ) = e^(−0.50) ≈ 0.61. Its size is below 1, so the cycle is stable.'], 'r* = 0.2; multiplier ≈ 0.61'], c: ['How does a period-2 orbit look on a Poincaré section?', 'As two points visited alternately.'] }],
    ['Chaos and strange attractors', [
      'With three or more variables, orbits can separate exponentially while staying bounded, folding onto a fractal **strange attractor**. The average rate of separation is the **Lyapunov exponent** λ: small errors grow like e^(λn).',
      'Some numbers are universal. In any system that reaches chaos by period doubling, the doublings crowd together by Feigenbaum’s ratio δ = 4.669. Experiments resolve only three or four doublings before noise blurs them: Libchaber’s convecting mercury (1982) gave 4.4 ± 0.1, close to δ but about 3σ below it. The universal value is a limit, which real data approach only roughly.'
    ], { n: 4, e: '\\lambda = \\lim_{n\\to\\infty}\\frac1n\\sum_k\\ln|g\'(x_k)|', x: ['At r = 4 the logistic map has λ = ln 2. If the starting value is known to 1 part in 10¹⁵ (double precision), roughly how many iterations can be predicted?', ['Errors grow like 10⁻¹⁵ × e^(λn) = 10⁻¹⁵ × 2ⁿ.', 'They reach order 1 when 2ⁿ ≈ 10¹⁵: n = 15 ln 10/ln 2 ≈ 50.', 'Perfect equations and 16-digit arithmetic buy only about 50 steps; data 1000 times better adds just 10 more.'], 'about 50 iterations'], c: ['What two things does a strange attractor do at once?', 'It shrinks phase-space volume overall while stretching nearby orbits apart, folding them onto a fractal set.'] }]
  ],
  m: [
    ['Deciding stability from linearisation at a centre.', 'Purely imaginary eigenvalues need the nonlinear terms to decide.'],
    ['Expecting chaos in an autonomous system with two variables.', 'It needs three variables, or a map, or periodic forcing.'],
    ['Expecting experiments to show a perfect bifurcation diagram.', 'Imperfections and noise smooth and blur it.']
  ]
});

WL.gd('m-perturbation-methods', {
  h: 'Few problems can be solved exactly, but many lie close to one that can. Perturbation methods expand the answer in a small parameter ε. When ε = 0 leaves the problem’s character intact, a plain power series works; when it changes it, by losing roots, lowering the order of an equation or hiding a slow drift, the series fails, and the way it fails points to the fix.',
  s: [
    ['Regular perturbation', [
      'Write x = x₀ + εx₁ + ε²x₂ + ⋯, substitute, and collect equal powers of ε. Each order gives a simple equation for the next correction. This works when the problem at ε = 0 has the same number and kind of solutions as for small ε.'
    ], { n: 0, e: 'x = x_0+\\varepsilon x_1+\\varepsilon^2x_2+\\cdots', x: ['Find the real root of x³ + εx − 1 = 0 to order ε², and test it at ε = 0.1.', ['At ε = 0: x₀³ = 1, so x₀ = 1.', 'Order ε: 3x₁ + 1 = 0, so x₁ = −⅓. Order ε²: 3x₂ + 3x₁² + x₁ = 0, so x₂ = 0.', 'x ≈ 1 − ε/3 = 0.9667 at ε = 0.1; the exact root is 0.96668.'], 'x ≈ 1 − ε/3'], c: ['When does a regular expansion work?', 'When setting ε = 0 keeps the number and kind of solutions.'] }],
    ['Singular perturbation', [
      'If ε multiplies the highest power or the highest derivative, setting ε = 0 loses solutions. The lost ones are large (or vary fast) and are found by rescaling: choose the scale at which the small term balances one of the others. This is the method of **dominant balance**.'
    ], { n: 1, e: 'x = \\frac{X}{\\sqrt\\varepsilon}', x: ['εx³ − x + 1 = 0 has a root near 1 for small ε. Where are the other two?', ['For large x, εx³ must balance x: εx³ ~ x gives x ~ 1/√ε.', 'Set x = X/√ε: X³ − X + √ε = 0, a regular problem with X ≈ ±1 − √ε/2.', 'So x ≈ ±1/√ε − ½: at ε = 0.01, 9.5 and −10.5 (exactly 9.457 and −10.467). Check: with no x² term the roots must add to zero, and 1.010 + 9.457 − 10.467 = 0.'], 'x ≈ ±1/√ε − ½'], c: ['What is the warning sign of a singular perturbation?', 'ε multiplying the highest power or the highest derivative.'] }],
    ['Boundary layers', [
      'When ε multiplies the highest derivative, the reduced equation cannot satisfy every boundary condition. The solution follows the reduced (**outer**) solution almost everywhere, then changes steeply in a thin **boundary layer** where εy″ matters. Inner and outer solutions are joined by **matching**.',
      'Prandtl’s viscous boundary layer is the same idea. On a smooth flat plate its laminar predictions agree well with measurements until the layer turns turbulent (typically around Re_x ≈ 5 × 10⁵), a transition no expansion in ε predicts.'
    ], { n: 2, e: 'y\\approx x+1-e^{-x/\\varepsilon}', x: ['Solve εy″ + y′ = 1 with y(0) = 0 and y(1) = 2, for small ε.', ['Outer: drop εy″, so y′ = 1 and y = x + 1. It meets y(1) = 2 but gives 1, not 0, at x = 0.', 'Inner, near x = 0: with X = x/ε, y_XX + y_X ≈ 0, so y = A(1 − e^(−X)), which meets y(0) = 0.', 'Matching: as X → ∞ the inner solution must tend to the outer value at x → 0, so A = 1. Composite: y ≈ x + 1 − e^(−x/ε).'], 'y ≈ x + 1 − e^(−x/ε)'], c: ['Why must the layer sit at x = 0 rather than x = 1?', 'Only there does the fast solution e^(−x/ε) decay into the interior; at x = 1 it would grow.'] }],
    ['Secular terms', [
      'For ẍ + x + εx³ = 0, the plain expansion produces a term like εt sin t that grows without bound, although the true motion stays bounded. It is a frequency shift in disguise. The **Poincaré–Lindstedt** method expands the frequency too, giving ω = 1 + (3/8)εA².'
    ], { n: 3, e: '\\omega\\approx1+\\tfrac38\\varepsilon A^2', x: ['Use ω ≈ 1 + (3/8)εA² to find how a pendulum’s period depends on its amplitude, and evaluate it at 30°.', ['sin θ ≈ θ − θ³/6, so θ̈ + θ − θ³/6 = 0 (time in units of 1/ω₀): ε = −1/6.', 'ω ≈ 1 − θ₀²/16, so T ≈ T₀(1 + θ₀²/16).', 'At 30° = 0.524 rad: T ≈ 1.0171T₀. The exact (elliptic-integral) value is 1.0174T₀: an error of 0.03%.'], 'T ≈ T₀(1 + θ₀²/16): 1.7% longer at 30°'], c: ['What makes a term “secular”?', 'It grows without bound in time, like t sin t, even though the true motion stays bounded.'] }],
    ['Multiple scales', [
      'Treat the fast time t and the slow time T = εt as independent, and let the amplitude and phase drift on the slow time. Removing secular terms at each order gives equations for that slow drift, valid for times of order 1/ε.'
    ], { n: 4, e: 'x\\approx A(T)\\cos\\big(t+\\varphi(T)\\big),\\qquad T = \\varepsilon t', x: ['For van der Pol’s oscillator ẍ − ε(1 − x²)ẋ + x = 0, find how the amplitude evolves and where it settles.', ['Put x = A cos(t + φ) into the order-ε equation. The forcing contains (A³/4 − A) sin(t + φ) + (A³/4) sin 3(t + φ).', 'The resonant sin(t + φ) and cos(t + φ) terms must cancel: 2dA/dT = A − A³/4, and dφ/dT = 0.', 'Fixed points: A = 0 (unstable) and A = 2 (stable). From any start the oscillation settles at amplitude 2.'], 'dA/dT = (A/2)(1 − A²/4); A → 2'], c: ['Why does multiple scales succeed where the plain expansion fails?', 'Amplitude and phase may drift on the slow time, which removes the secular terms, so the result holds for times of order 1/ε.'] }]
  ],
  m: [
    ['Expanding in ε when ε multiplies the highest derivative.', 'Look for a boundary layer and rescale there.'],
    ['Putting the boundary layer at the wrong end.', 'Put it where the fast solution decays into the interior.'],
    ['Trusting a naive expansion over long times.', 'Remove secular terms with Poincaré–Lindstedt or multiple scales.']
  ]
});

WL.gd('m-wkb', {
  h: 'When a wave’s wavelength is short compared with the distance over which its medium changes, the wave adjusts locally: its phase builds up as ∫k dx and its amplitude changes to keep the flux steady. This is the WKB approximation, the bridge between waves and rays, and between quantum and classical mechanics. Its relatives, stationary phase and steepest descent, approximate integrals dominated by a few special points.',
  s: [
    ['The WKB approximation', [
      'For ψ″ + k(x)²ψ = 0, try a wave whose phase is ∫k dx and whose amplitude changes slowly. At the next order the amplitude must be ∝ 1/√k. In a forbidden region the solutions grow or decay as exp(±∫κ dx) instead.'
    ], { n: 0, e: '\\psi\\approx\\frac{C}{\\sqrt{p}}\\,e^{\\pm\\frac{i}{\\hbar}\\int p\\,dx}', x: ['Show that the WKB probability density matches where a classical particle spends its time.', ['Since the amplitude is ∝ 1/√p, averaging over the rapid wiggles gives |ψ|² ∝ 1/p = 1/(mv).', 'A classical particle spends time dx/v crossing each dx, so its probability density is also ∝ 1/v.', 'They agree: both are largest where the particle is slowest, near the turning points.'], 'both ∝ 1/v'], c: ['When is WKB valid?', 'When the wavelength changes little over one wavelength: |dλ/dx| ≪ 1.'] }],
    ['Turning points and quantisation', [
      'Where E = V, p → 0 and WKB fails. Near such a soft **turning point** the exact solution is an Airy function, which joins the oscillating and decaying forms with a phase of π/4. At a hard wall, where ψ must vanish, the phase is π/2 instead. For a bound state the phases must fit together, which quantises the energy.'
    ], { n: 1, e: '\\int_0^{z_t}p\\,dz = \\left(n-\\tfrac14\\right)\\pi\\hbar', x: ['A neutron bounces on a horizontal mirror: a hard wall at z = 0, with V = mgz above. Estimate the height of its lowest state.', ['The wall contributes π/2 and the soft turning point π/4, so ∫₀^z_t p dz = (n − ¼)πħ, with p = m√(2g(z_t − z)).', 'The integral is (2/3)m√(2g) z_t^(3/2). Setting it to ¾πħ for n = 1 gives z_t ≈ 13.6 μm; the exact Airy-function answer is 13.7 μm, an energy of 1.4 peV.', 'In 2002, ultracold neutrons at the ILL in Grenoble passed between a mirror and an absorber only when the gap was larger than this lowest state: quantum states in Earth’s gravity.'], 'about 14 μm'], c: ['Why does a hard wall give a different phase from a soft turning point?', 'At a hard wall ψ must vanish (π/2); at a soft point it leaks into the forbidden region (π/4).'] }],
    ['Tunnelling', [
      'Inside a barrier the WKB solution decays as exp(−∫κ dx), with κ = √(2m(V − E))/ħ. The transmission probability is about exp(−2∫κ dx): exponentially sensitive to the barrier’s width and height.'
    ], { n: 2, e: 'T\\approx\\exp\\Big(-2\\int\\kappa\\,dx\\Big)', x: ['In a scanning tunnelling microscope the gap is a barrier about 4.5 eV high (the work function). By what factor does the current fall when the gap widens by 0.10 nm?', ['κ = √(2mφ)/ħ = 1.09 × 10¹⁰ m⁻¹ for an electron with φ = 4.5 eV.', 'T ∝ e^(−2κd), so widening by 0.10 nm multiplies the current by e^(−2.17) ≈ 0.11: about 9 times less.', 'That is why STMs detect height changes of picometres. Measured “apparent barrier heights” are often lower than the work function, because image charges round off the barrier: the rectangular barrier was a hidden assumption.'], 'about a factor of 9'], c: ['Why is tunnelling so sensitive to the barrier’s width?', 'The width appears in the exponent.'] }],
    ['Stationary phase', [
      'For ∫g(x)e^(iλf(x)) dx with λ large, the integrand oscillates rapidly and cancels itself, except near points where f′ = 0. Expanding f to second order there gives a Gaussian-like integral.'
    ], { n: 3, e: 'J_0(x)\\approx\\sqrt{\\frac{2}{\\pi x}}\\cos\\Big(x-\\frac{\\pi}{4}\\Big)', x: ['Using J₀(x) = (1/2π)∫₀^2π e^(ix cos θ) dθ, derive the large-x form above and test it at x = 10.', ['The phase x cos θ is stationary at θ = 0 and θ = π.', 'Near each, cos θ ≈ ±(1 − φ²/2); each Gaussian integral gives √(2π/x), with phases ∓π/4. Adding them gives √(2/(πx)) cos(x − π/4).', 'At x = 10: 0.2523 × cos(9.215) = −0.2468. The exact value is −0.2459: 0.3% off, and the error shrinks as x grows.'], '−0.2468, against exactly −0.2459'], c: ['Why do only the neighbourhoods of stationary points contribute?', 'Elsewhere the phase changes quickly and neighbouring contributions cancel.'] }],
    ['Steepest descent', [
      'For integrals of e^(λφ) with λ large, most of the value comes from near the maximum of φ, or in the complex plane from a saddle point, crossed along the path of steepest descent. There the integrand is nearly Gaussian, which gives the leading term. For real φ this is **Laplace’s method**.'
    ], { n: 4, e: 'n! = \\int_0^\\infty e^{\\,n\\ln t-t}\\,dt\\approx\\sqrt{2\\pi n}\\,n^ne^{-n}', x: ['Derive Stirling’s formula, and test it at n = 10.', ['The exponent f(t) = n ln t − t peaks where f′ = n/t − 1 = 0: at t = n, with f″ = −1/n.', 'Gaussian approximation: e^f(n) × √(2π/|f″|) = nⁿe⁻ⁿ√(2πn).', 'At n = 10: 3 598 696, against 10! = 3 628 800: 0.8% low. The next correction, a factor 1 + 1/(12n), brings it within 0.003%.'], 'n! ≈ √(2πn) nⁿe⁻ⁿ'], c: ['Why does Stirling’s formula improve as n grows?', 'The peak’s width, √n, becomes small compared with its position, n, so the Gaussian approximation improves.'] }]
  ],
  m: [
    ['Using the WKB form right at a turning point.', 'Use the Airy function there to connect the two sides.'],
    ['Forgetting the turning-point phases, so ∫p dx = nπħ.', 'Each soft turning point adds π/4; a hard wall adds π/2.'],
    ['Treating every real barrier as rectangular.', 'Integrate κ over the barrier’s actual shape.']
  ]
});

WL.gd('m-numerical', {
  h: 'A computer approximates continuous mathematics with finite steps and finite precision, and both introduce errors. A method’s order says how fast its error shrinks with the step size; its stability says whether errors grow as it runs; rounding sets a floor below which smaller steps stop helping. A careful calculation checks all three.',
  s: [
    ['Local and global error', [
      'The **local error** is what one step adds; the **global error** is what builds up over a fixed interval. If the local error is O(h^(p+1)), there are T/h steps, so the global error is O(hᵖ): the method has **order** p. Euler’s method has order 1; the classic Runge–Kutta method, order 4.'
    ], { n: 0, e: 'y_{n+1} = y_n+h\\,f(x_n,y_n)', x: ['Use Euler’s method on y′ = y, y(0) = 1, to estimate y(1) = e with h = 0.1 and with h = 0.05.', ['Each step multiplies y by 1 + h: y(1) ≈ 1.1¹⁰ = 2.5937, an error of 0.1245.', 'With h = 0.05: 1.05²⁰ = 2.6533, an error of 0.0650.', 'Halving h roughly halves the error (a ratio of 1.92): first order, as expected.'], 'errors 0.125 and 0.065'], c: ['A method’s local error is O(h⁵). What is its order?', '4: its global error is O(h⁴).'] }],
    ['Stability', [
      'Applied to y′ = −λy, Euler’s method multiplies y by 1 − hλ each step, which decays only if hλ < 2. Implicit (backward) Euler divides by 1 + hλ and is stable for any step. **Stiff** problems mix very fast and very slow rates, and only implicit methods handle them efficiently.'
    ], { n: 1, e: 'y_{n+1} = \\frac{y_n}{1+h\\lambda}', x: ['A reaction network has one fast rate, 10⁶ s⁻¹, and one slow rate, 1 s⁻¹. We want the slow evolution up to 3 s. How many steps do forward and backward Euler need?', ['Forward Euler is stable only if hλ < 2 for every rate: h < 2 μs, so at least 1.5 million steps, though the fast part dies within microseconds.', 'Backward Euler is stable for any h. With h = 0.01 s (300 steps) the slow part comes out as (1/1.01)³⁰⁰ = 0.0505, against e⁻³ = 0.0498: within 2%.', 'Stability, not accuracy, sets the explicit method’s step.'], '1.5 million steps against 300'], c: ['What makes a problem stiff?', 'Rates of very different sizes, so that stability rather than accuracy limits an explicit method’s step.'] }],
    ['Rounding', [
      'Double-precision numbers carry about 16 significant digits (machine epsilon ≈ 2.2 × 10⁻¹⁶). Subtracting nearly equal numbers wipes out most of them: **catastrophic cancellation**. The cure is usually algebra before arithmetic.'
    ], { n: 2, e: '1-\\cos x = 2\\sin^2(x/2)', x: ['Compute 1 − cos x for x = 10⁻⁸ in double precision, directly and via 2 sin²(x/2).', ['cos(10⁻⁸) = 1 − 5 × 10⁻¹⁷, but the nearest double to that is exactly 1, so the direct result is 0: a 100% error.', '2 sin²(x/2) = 2 × (5 × 10⁻⁹)² = 5.0 × 10⁻¹⁷, correct to full precision.', 'The same mathematics gives completely different numbers.'], '0 directly; 5.0 × 10⁻¹⁷ via the identity'], c: ['Why doesn’t a finite-difference derivative keep improving as h shrinks?', 'Rounding error grows like ε/h, so below an optimal h (about 10⁻⁸ for a forward difference) the total error rises again.'] }],
    ['Symplectic integrators', [
      'For orbits and molecules, Euler’s method spirals outward and gains energy steadily. **Leapfrog** (velocity Verlet) updates positions and velocities alternately. It is only second order, but it preserves phase-space area exactly, so its energy error stays bounded however long it runs.'
    ], { n: 3, e: 'v_{n+\\frac12} = v_n+\\tfrac{h}{2}a_n,\\quad x_{n+1} = x_n+h\\,v_{n+\\frac12},\\quad v_{n+1} = v_{n+\\frac12}+\\tfrac{h}{2}a_{n+1}', x: ['Simulate x″ = −x for 100 orbits with h = 0.01, using Euler’s method and leapfrog. What happens to the energy?', ['One Euler step sends x → x + hv and v → v − hx, so x² + v² is multiplied by exactly 1 + h².', '100 orbits take 62 832 steps: 1.0001^62 832 ≈ e^6.28 ≈ 535. Euler’s energy grows 535-fold.', 'Leapfrog’s energy stays within h²/4 = 0.0025% of its starting value throughout.'], 'Euler: ×535; leapfrog: within 0.0025%'], c: ['Why can a second-order symplectic method beat fourth-order Runge–Kutta over very long runs?', 'Its energy error stays bounded, whereas Runge–Kutta’s small error drifts steadily.'] }],
    ['Checking a code', [
      'Run with steps h, h/2 and h/4. For an order-p method, the differences between successive results shrink by about 2ᵖ, so the order can be measured without knowing the exact answer. Check conserved quantities and known special cases too.'
    ], { n: 4, e: 'p\\approx\\log_2\\frac{y_h-y_{h/2}}{y_{h/2}-y_{h/4}}', x: ['Classic Runge–Kutta on y′ = y gives y(1) = 2.7182511, 2.7182797 and 2.7182817 with h = 0.2, 0.1 and 0.05. Estimate the order.', ['The differences are 2.86 × 10⁻⁵ and 1.95 × 10⁻⁶.', 'Their ratio is 14.7, so p ≈ log₂ 14.7 = 3.9.', 'Close to 4, as it should be; a clear mismatch usually means a bug.'], 'p ≈ 3.9 (expected: 4)'], c: ['What should you conclude if a result changes noticeably when you halve the step?', 'That it has not converged: it is not yet a result.'] }]
  ],
  m: [
    ['Judging accuracy by the local error.', 'The global error is one order lower.'],
    ['Assuming a stable method is accurate.', 'Stability is not accuracy; check by halving the step.'],
    ['Using a non-symplectic method for very long orbit runs.', 'Use leapfrog or another symplectic method.']
  ]
});

WL.gd('m-finite-difference', {
  h: 'To solve a differential equation on a computer, replace derivatives by differences between values on a grid. Taylor series give each formula’s error. But an accurate-looking scheme can still produce nonsense if errors grow from step to step, so stability must be checked mode by mode. Implicit and spectral methods trade extra work per step for stability or accuracy.',
  s: [
    ['Difference formulas', [
      'The forward difference (f(x + h) − f(x))/h has an error of about (h/2)f″. The central difference (f(x + h) − f(x − h))/(2h) has an error of about (h²/6)f‴, because the odd terms cancel by symmetry.'
    ], { n: 0, e: '\\frac{f(x+h)-f(x-h)}{2h} = f\'+\\frac{h^2}{6}f\'\'\'+\\cdots', x: ['Estimate the derivative of eˣ at x = 1 (exactly e = 2.7183) with h = 0.1, by forward and by central differences.', ['Forward: (e^1.1 − e)/0.1 = 2.8588, an error of 0.141; the formula predicts (h/2)e = 0.136.', 'Central: (e^1.1 − e^0.9)/0.2 = 2.7228, an error of 0.0045; predicted (h²/6)e = 0.0045.', 'The central formula is 30 times better at no extra cost.'], '2.859 and 2.723'], c: ['Why is the central difference more accurate?', 'Its first-order error terms cancel by symmetry, leaving an error ∝ h².'] }],
    ['Boundary-value problems', [
      'On a grid, −u″ = f with fixed end values becomes a linear system. Each interior point links only to its neighbours, so the matrix is tridiagonal and fast to solve. In two dimensions Laplace’s equation becomes the **five-point rule**.'
    ], { n: 1, e: '\\frac{-u_{j-1}+2u_j-u_{j+1}}{h^2} = f_j', x: ['Solve −u″ = π² sin πx with u(0) = u(1) = 0 (exactly u = sin πx) on a grid with h = ¼.', ['Unknowns at x = ¼, ½, ¾; by symmetry u₁ = u₃. The equations: 16(2u₁ − u₂) = 6.979 and 16(2u₂ − 2u₁) = 9.870.', 'Solving: u₂ = 1.053 and u₁ = 0.745, against the exact 1 and 0.707: 5.3% high.', 'With h = ⅛ the error drops to 1.3%: a factor of 4 for half the spacing, as a second-order scheme should give.'], 'u(½) ≈ 1.053'], c: ['What is the five-point rule for Laplace’s equation?', 'Each grid value equals the average of its four neighbours.'] }],
    ['Stability and the CFL condition', [
      'For the heat equation u_t = αu_xx, the explicit scheme multiplies each Fourier mode by G = 1 − 4r sin²(kΔx/2) per step, with r = αΔt/Δx². Every mode stays bounded only if r ≤ ½, so halving Δx forces Δt down fourfold. For waves, the **CFL condition** cΔt/Δx ≤ 1 plays the same role.'
    ], { n: 2, e: 'r = \\frac{\\alpha\\Delta t}{\\Delta x^2}\\le\\frac12', x: ['What happens to the explicit heat-equation scheme with r = 0.6?', ['The worst mode is the grid-scale zigzag (kΔx = π), for which G = 1 − 4r = −1.4.', 'It flips sign and grows by 40% each step, seeded by rounding errors of about 10⁻¹⁶.', 'After about 110 steps (1.4¹¹⁰ ≈ 10¹⁶) the zigzag swamps the solution.'], 'the zigzag mode blows up'], c: ['What does the CFL condition say physically?', 'In one step, information must not cross more than one grid cell, so the scheme can “see” everywhere the true solution depends on.'] }],
    ['Implicit methods', [
      'Evaluating the space derivative at the new time (backward Euler) gives G = 1/(1 + 4r sin²(kΔx/2)): stable for any Δt, but only first order in time. **Crank–Nicolson** averages the old and new levels: second order and stable, but its G approaches −1 for short waves when the steps are large.'
    ], { n: 3, e: 'G_{\\text{CN}} = \\frac{1-2r\\sin^2(k\\Delta x/2)}{1+2r\\sin^2(k\\Delta x/2)}', x: ['With r = 10, how do backward Euler and Crank–Nicolson treat the grid-scale zigzag?', ['Exactly, this mode decays by e^(−π²r) ≈ e^(−99) per step: it vanishes at once.', 'Backward Euler: G = 1/(1 + 4r) = 1/41 ≈ 0.024. Strongly damped, as it should be.', 'Crank–Nicolson: G = (1 − 2r)/(1 + 2r) = −19/21 ≈ −0.90. The zigzag flips sign each step and takes about 23 steps to fall tenfold. That is why sharp initial data can leave lingering wiggles in Crank–Nicolson runs; a few backward-Euler steps first cure it.'], 'backward Euler 0.024; Crank–Nicolson −0.90'], c: ['What is the price of backward Euler’s unconditional stability?', 'Only first-order accuracy in time, and a linear system to solve at every step.'] }],
    ['Spectral methods and dispersion', [
      'For smooth periodic functions, differentiate by Fourier transforming, multiplying by ik and transforming back. The error falls faster than any power of the number of points. Finite differences, by contrast, misjudge short waves, which then travel at the wrong speed: **numerical dispersion**.'
    ], { n: 4, e: '\\frac{e^{ik(x+h)}-e^{ik(x-h)}}{2h} = i\\,\\frac{\\sin kh}{h}\\,e^{ikx}', x: ['On a periodic grid of 8 points (h = π/4), differentiate sin 3x with the central difference and spectrally.', ['The central difference replaces k by sin(kh)/h. For k = 3: sin(3π/4)/(π/4) = 0.90 instead of 3.', 'So the derivative is 70% too small: this wave spans fewer than three grid points.', 'Spectral differentiation multiplies the k = 3 coefficient by exactly 3i, so the result is correct to rounding error, about 10⁻¹⁵.'], '0.90 cos 3x (central) against 3 cos 3x (spectral)'], c: ['What is the price of spectral methods?', 'Every point is coupled to every other, the problem must be smooth (often periodic), and discontinuities cause Gibbs oscillations.'] }]
  ],
  m: [
    ['Refining Δx in an explicit scheme without reducing Δt.', 'Keep r ≤ ½, so Δt must shrink like Δx².'],
    ['Trusting Crank–Nicolson with large steps on sharp data.', 'Expect lingering wiggles; damp them with a few backward-Euler steps.'],
    ['Assuming a stable scheme is accurate for short waves.', 'Use enough points per wavelength, or a spectral method.']
  ]
});

WL.gd('m-monte-carlo', {
  h: 'Monte Carlo methods answer exact questions with random numbers: an integral is an average, and an average can be estimated by sampling. The error falls as 1/√N whatever the dimension, which makes these methods indispensable in statistical physics, particle physics and finance. The skill lies in reducing the variance and in being honest about error bars.',
  s: [
    ['Integration by sampling', [
      '∫ₐᵇ f dx = (b − a)⟨f⟩, so averaging f over N random points estimates the integral. By the central limit theorem the error is about (b − a)σ_f/√N in any dimension, whereas a grid in d dimensions needs nᵈ points.'
    ], { n: 0, e: '\\hat\\pi = 4\\,\\frac{N_{\\text{in}}}{N}', x: ['Estimate π by scattering N random points in a square and counting those inside the inscribed circle. What is the standard error for N = 10 000, and how many points would five decimal places need?', ['Each point lands inside with probability p = π/4, so π̂ = 4N_in/N.', 'Binomial error: σ = 4√(p(1 − p)/N) = 4√(0.785 × 0.215/10⁴) = 0.016.', 'For an error of 10⁻⁵: N = (1.64/10⁻⁵)² ≈ 3 × 10¹⁰. Each extra digit costs 100 times more points.'], '±0.016; about 3 × 10¹⁰ points'], c: ['Why is Monte Carlo preferred for high-dimensional integrals?', 'Its error falls like 1/√N in any dimension, while grids need nᵈ points.'] }],
    ['Variance reduction', [
      'Since the error is σ/√N, cutting σ is as good as taking more samples. **Importance sampling** draws x from a density p(x) shaped like f and averages f/p, which then varies little.'
    ], { n: 1, e: '\\int f\\,dx = \\Big\\langle\\frac{f}{p}\\Big\\rangle_p', x: ['Compare plain sampling of ∫₀¹ eˣ dx with importance sampling from p(x) = (2/3)(1 + x).', ['Plain: σ² = ∫e^(2x) dx − (e − 1)² = 0.242.', 'Importance: f/p = 3eˣ/(2(1 + x)) varies only from 1.50 to 2.04, and its variance is 0.027.', 'Nine times smaller: the same accuracy with nine times fewer samples.'], 'the variance falls ninefold'], c: ['What would the ideal importance density be for a positive f?', 'p ∝ f, which gives zero variance, but needs the very integral you want.'] }],
    ['Markov-chain Monte Carlo', [
      'To sample a distribution known only up to its normalisation, such as e^(−E/k_BT), build a random walk whose long-run distribution is the target. The **Metropolis algorithm** proposes a move and accepts it with probability min(1, e^(−ΔE/k_BT)). **Detailed balance** guarantees the right distribution.'
    ], { n: 2, e: 'P_{\\text{acc}} = \\min\\big(1,e^{-\\Delta E/k_BT}\\big)', x: ['At room temperature (k_BT = 0.0259 eV) a proposed move raises the energy by 0.050 eV. With what probability is it accepted, and why does that give the Boltzmann ratio?', ['P_acc = e^(−0.050/0.0259) = e^(−1.93) = 0.145.', 'The reverse move lowers the energy, so it is always accepted.', 'Detailed balance: π_A × 0.145 = π_B × 1, so π_B/π_A = e^(−ΔE/k_BT), the Boltzmann ratio, with no partition function needed.'], '14.5%'], c: ['Why does Metropolis need only energy differences?', 'It uses only ratios π_new/π_old, in which the normalisation cancels.'] }],
    ['Correlations and honest errors', [
      'Successive Markov-chain samples are correlated: N samples with autocorrelation time τ are worth only about N/(2τ) independent ones. Near critical points τ grows rapidly (**critical slowing down**): for single-spin Metropolis on the 2D Ising model, τ grows like L^2.17. Cluster algorithms cut the exponent to well below 1.'
    ], { n: 3, e: 'N_{\\text{eff}}\\approx\\frac{N}{2\\tau}', x: ['A run produces 10⁶ samples with τ = 500. How does the true error bar compare with the naive σ/√N?', ['N_eff = 10⁶/(2 × 500) = 1000.', 'The true error is σ/√1000, larger than the naive σ/√10⁶ by √1000 ≈ 32.', 'Estimate τ by **binning**: average over blocks of increasing length until the error estimate stops growing.'], '32 times larger'], c: ['Why discard the start of a Markov chain?', 'It still remembers the arbitrary starting state and has not yet reached equilibrium.'] }],
    ['Random numbers', [
      'Computers use deterministic **pseudo-random** generators. A good one has a long period and no correlations that the calculation can detect, but “good” depends on the use. In 1992 Ferrenberg, Landau and Wong found that a widely trusted generator gave wrong results for the 2D Ising model, detected only because Onsager’s exact solution was known.'
    ], { n: 4, e: 'x_{n+1} = 65539\\,x_n\\bmod 2^{31}', x: ['IBM’s RANDU generator used the rule above. Show that x_(n+2) = 6x_(n+1) − 9xₙ (mod 2³¹), and explain what that does in three dimensions.', ['65539 = 2¹⁶ + 3, so x_(n+2) = (2¹⁶ + 3)²xₙ = (2³² + 6 × 2¹⁶ + 9)xₙ.', 'Mod 2³¹ the 2³² term vanishes, and 6 × 2¹⁶ + 9 = 6(2¹⁶ + 3) − 9, so x_(n+2) = 6x_(n+1) − 9xₙ.', 'Scaled to [0, 1), every triple obeys u_(n+2) − 6u_(n+1) + 9uₙ = a whole number, so the points (uₙ, u_(n+1), u_(n+2)) lie on just 15 planes: a 3D simulation samples space very unevenly.'], 'all triples lie on 15 planes'], c: ['How can you test whether a result depends on the random number generator?', 'Rerun with a different, unrelated generator and compare.'] }]
  ],
  m: [
    ['Quoting σ/√N for correlated samples.', 'Use N_eff ≈ N/(2τ) in place of N.'],
    ['Keeping the start of the chain.', 'Discard the equilibration period.'],
    ['Trusting a generator because it passed standard tests.', 'Repeat the calculation with a different generator.']
  ]
});
