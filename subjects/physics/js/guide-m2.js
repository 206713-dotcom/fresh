/* Geodesic step-by-step guides, stage m2 (built from src/guide/m2-*.js) */
WL.gd('m-divcurl', {
  h: 'Divergence and curl are the two ways a vector field can vary from point to point. Divergence measures the net outflow per unit volume, the sources and sinks; curl measures the circulation per unit area, the swirl. Maxwell’s equations are statements about the divergence and curl of the electric and magnetic fields, and they predict light.',
  s: [
    ['Divergence', [
      'The flux of F out of a tiny box is about (∇·F) times its volume. In Cartesian coordinates the **divergence** is the sum of three partial derivatives. An incompressible fluid has zero divergence everywhere.'
    ], { n: 0, e: '\\nabla\\cdot\\mathbf F = \\frac{\\partial F_x}{\\partial x}+\\frac{\\partial F_y}{\\partial y}+\\frac{\\partial F_z}{\\partial z}', x: ['Find the divergence of F = (x²y, yz, −xz) and its value at (1, 1, 1).', ['∂(x²y)/∂x = 2xy; ∂(yz)/∂y = z; ∂(−xz)/∂z = −x.', '∇·F = 2xy + z − x.', 'At (1, 1, 1): 2 + 1 − 1 = 2, a net outflow there.'], '2xy + z − x; 2'], c: ['What is the divergence of an incompressible fluid’s velocity?', 'Zero.'] }],
    ['Curl', [
      'The circulation of F round a tiny loop is about (∇×F)·n̂ times its area. A tiny paddle wheel placed in a fluid spins at half the **curl**.'
    ], { n: 1, e: '\\nabla\\times(\\boldsymbol\\omega\\times\\mathbf r) = 2\\boldsymbol\\omega', x: ['Find the curl of the rigid rotation v = ω × r with ω = (0, 0, ω).', ['v = (−ωy, ωx, 0).', '(∇×v)_z = ∂(ωx)/∂x − ∂(−ωy)/∂y = 2ω; the other components are zero.', 'Curl = 2ω: a paddle wheel turns at ω, half the curl, just like the fluid.'], '(0, 0, 2ω)'], c: ['What is the curl of the radial field r = (x, y, z)?', 'Zero: it spreads out without swirling.'] }],
    ['Identities', [
      'Because mixed partial derivatives are equal, the curl of a gradient is always zero and the divergence of a curl is always zero. That is why an electrostatic field can be written E = −∇V and a magnetic field B = ∇×A.'
    ], { n: 2, e: '\\nabla\\times(\\nabla\\varphi) = \\mathbf 0,\\qquad \\nabla\\cdot(\\nabla\\times\\mathbf A) = 0', x: ['Check that ∇·(∇×A) = 0 for A = (0, 0, xy).', ['∇×A = (∂(xy)/∂y, −∂(xy)/∂x, 0) = (x, −y, 0).', 'Its divergence: ∂x/∂x + ∂(−y)/∂y = 1 − 1 = 0.'], 'it is zero'], c: ['Why is the curl of a gradient always zero?', 'Mixed partial derivatives are equal, so the terms cancel in pairs.'] }],
    ['The inverse-square field', [
      'The field r̂/r² has zero divergence everywhere except the origin, yet a flux of 4π through every sphere round it. All its divergence is concentrated at the origin: a delta function. This is Gauss’s law for a point charge.'
    ], { n: 3, e: '\\nabla\\cdot\\frac{\\hat{\\mathbf r}}{r^2} = 4\\pi\\,\\delta^3(\\mathbf r)', x: ['Show that F = r̂/r² has zero divergence away from the origin, but flux 4π through any sphere centred on it.', ['In spherical form, ∇·F = (1/r²) d(r² × 1/r²)/dr = (1/r²) d(1)/dr = 0 for r > 0.', 'Through a sphere of radius R: (1/R²) × 4πR² = 4π, whatever R.', 'So all the divergence sits at the origin: 4πδ³(r).'], 'zero away from 0; flux 4π'], c: ['What is ∇²(1/r)?', '−4πδ³(r).'] }],
    ['Maxwell’s equations', [
      'Charges are sources of E; there are no sources of B; changing magnetic fields drive circulating electric fields; and currents and changing electric fields drive circulating magnetic fields. In empty space these combine into waves.',
      '∇·B = 0 is an experimental fact, not a mathematical necessity: it says there are no magnetic monopoles. Many searches have found none; if one were found, the equation would gain a source term.'
    ], { n: 4, e: '\\nabla\\cdot\\mathbf E = \\frac{\\rho}{\\varepsilon_0},\\quad \\nabla\\cdot\\mathbf B = 0,\\quad \\nabla\\times\\mathbf E = -\\frac{\\partial\\mathbf B}{\\partial t},\\quad \\nabla\\times\\mathbf B = \\mu_0\\mathbf J+\\mu_0\\varepsilon_0\\frac{\\partial\\mathbf E}{\\partial t}', x: ['With μ₀ = 1.2566 × 10⁻⁶ H m⁻¹ and ε₀ = 8.854 × 10⁻¹² F m⁻¹, find the speed of the waves Maxwell’s equations predict.', ['c = 1/√(μ₀ε₀) = 1/√(1.1127 × 10⁻¹⁷).', '= 2.998 × 10⁸ m s⁻¹.', 'In the 1860s Maxwell saw that this matched the measured speed of light and concluded that light is an electromagnetic wave.'], '2.998 × 10⁸ m s⁻¹'], c: ['Which Maxwell equation says there are no magnetic charges?', '∇·B = 0.'] }]
  ],
  m: [
    ['Treating divergence as a vector.', 'Divergence is a scalar; curl is a vector.'],
    ['Concluding that zero divergence means zero flux through every closed surface.', 'A singularity inside, like a point charge, can carry flux.'],
    ['Using Cartesian formulas in spherical coordinates.', 'Use the forms with scale factors.']
  ]
});

WL.gd('m-theorems', {
  h: 'Three theorems connect what happens inside a region with what happens on its edge. Green’s theorem in the plane, the divergence theorem (total outflow through a closed surface equals the divergence added up inside) and Stokes’ theorem (circulation round a loop equals the flux of curl through any surface it bounds) turn Maxwell’s equations between their local and global forms.',
  s: [
    ['Green’s theorem', [
      'For a region in the plane, with its boundary traced anticlockwise, the circulation round the boundary equals the curl added up over the inside.'
    ], { n: 0, e: '\\oint_C(P\\,dx+Q\\,dy) = \\iint_D\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dA', x: ['Use A = ½∮(x dy − y dx) to find the area of the ellipse x = a cos t, y = b sin t.', ['dx = −a sin t dt and dy = b cos t dt.', 'x dy − y dx = ab cos²t dt + ab sin²t dt = ab dt.', 'A = ½ × ab × 2π = πab.'], 'πab'], c: ['What instrument uses Green’s theorem?', 'The planimeter, which measures an area by tracing round its edge.'] }],
    ['The divergence theorem', [
      'Add up the outflow from all the small boxes filling a volume: flux through shared inner faces cancels, leaving only the flux through the outer surface.'
    ], { n: 1, e: '\\oint_S\\mathbf F\\cdot d\\mathbf S = \\iiint_V\\nabla\\cdot\\mathbf F\\,dV', x: ['Check the divergence theorem for F = (x, y, z) on a sphere of radius R.', ['On the surface F·n̂ = R, so the flux is R × 4πR² = 4πR³.', 'Inside, ∇·F = 3, so the volume integral is 3 × ⁴⁄₃πR³ = 4πR³.', 'They agree.'], 'both give 4πR³'], c: ['Why does the flux through internal faces cancel?', 'What flows out of one box through a shared face flows into its neighbour.'] }],
    ['Stokes’ theorem', [
      'Tile a surface with small loops: their shared edges cancel, leaving the circulation round the boundary. Any surface with the same boundary gives the same flux of curl.'
    ], { n: 2, e: '\\oint_C\\mathbf F\\cdot d\\mathbf r = \\iint_S(\\nabla\\times\\mathbf F)\\cdot d\\mathbf S', x: ['Check Stokes’ theorem for F = (−y, x, 0) on a disc of radius R in the xy-plane.', ['Round the circle, F·r′ = R², so the circulation is 2πR².', '∇×F = (0, 0, 2), so its flux through the disc is 2 × πR².', 'They agree.'], 'both give 2πR²'], c: ['Why do all surfaces with the same boundary give the same flux of curl?', 'Two of them together close up, and the flux of a curl through a closed surface is zero.'] }],
    ['Gauss’s and Ampère’s laws', [
      'The divergence theorem turns ∇·E = ρ/ε₀ into Gauss’s law; Stokes’ theorem turns ∇×B = μ₀J into Ampère’s law. Both always hold, but they give fields directly only when symmetry lets the field come out of the integral.'
    ], { n: 3, e: '\\oint\\mathbf E\\cdot d\\mathbf S = \\frac{Q_{\\text{enc}}}{\\varepsilon_0},\\qquad \\oint\\mathbf B\\cdot d\\mathbf l = \\mu_0I_{\\text{enc}}', x: ['Find the electric field at distance r from a long straight line carrying charge λ per metre.', ['Take a cylinder of radius r and length L round the line. By symmetry E points outwards and is constant on the curved side.', 'Flux: E × 2πrL = λL/ε₀.', 'E = λ/(2πε₀r).'], 'λ/(2πε₀r)'], c: ['Use Ampère’s law to find B at distance r from a long straight wire carrying current I.', 'B × 2πr = μ₀I, so B = μ₀I/(2πr).'] }],
    ['Conditions', [
      'The theorems need smooth fields inside the region and surfaces with a consistent normal (no Möbius strips). A singularity inside the region carries flux or circulation of its own and must be included.'
    ], { n: 4, x: ['F = (−y, x)/(x² + y²) has zero curl wherever it is defined, yet circulation 2π round the unit circle. Why does Stokes’ theorem not give zero?', ['Stokes’ theorem needs F smooth on the whole disc, but F blows up at the origin.', 'All the curl is concentrated there, like a delta function of strength 2π.', 'This is the field of a magnetic flux tube along the z-axis, a picture behind the Aharonov–Bohm effect.'], 'the singularity at the origin'], c: ['Can Stokes’ theorem be used on a Möbius strip?', 'No: the surface must have a consistent normal.'] }]
  ],
  m: [
    ['Tracing the boundary the wrong way.', 'Anticlockwise, or by the right-hand rule with the normal.'],
    ['Using Gauss’s law without enough symmetry.', 'It holds, but gives E only if E can come out of the integral.'],
    ['Ignoring a singularity inside the region.', 'Include it, for example as a delta function.']
  ]
});

WL.gd('m-delta', {
  h: 'The Dirac delta δ(x) is zero everywhere except at the origin and integrates to one: an idealised spike, a point charge, an instantaneous kick. It is not an ordinary function but a distribution, defined by what it does inside integrals: it picks out the value of a function at a point. With it, Green’s functions solve linear equations for any source by adding up responses to point sources.',
  s: [
    ['The sifting property', [
      'δ is defined by ∫δ(x − a)f(x) dx = f(a) for every smooth f. No ordinary function does this; δ is the limit of ever narrower, taller spikes, such as a box of width ε and height 1/ε, understood inside integrals.'
    ], { n: 0, e: '\\int\\delta(x-a)\\,f(x)\\,dx = f(a)', x: ['Evaluate ∫₋∞^∞ δ(x − 2)(x³ + 1) dx and ∫₀⁵ δ(x + 1) cos x dx.', ['The first picks out x = 2: 8 + 1 = 9.', 'The second has its spike at x = −1, outside [0, 5]: the integral is 0.'], '9 and 0'], c: ['Name two ordinary functions whose limit behaves like δ.', 'A box of width ε and height 1/ε; a Gaussian of area 1 whose width shrinks to zero.'] }],
    ['Rules', [
      'Scaling the argument rescales the spike, and a delta of a function sits at each root of that function.'
    ], { n: 1, e: '\\delta(ax) = \\frac{\\delta(x)}{|a|},\\qquad \\delta(g(x)) = \\sum_i\\frac{\\delta(x-x_i)}{|g\'(x_i)|}', x: ['Evaluate ∫δ(3x − 6)x² dx, and ∫δ(sin x)e^(−x²) dx over −1 < x < 1.', ['δ(3x − 6) = δ(x − 2)/3, so the first is 4/3.', 'sin x = 0 only at x = 0 in that range, where |cos 0| = 1.', 'So the second is e⁰ = 1.'], '4/3 and 1'], c: ['What is δ(ax)?', 'δ(x)/|a|.'] }],
    ['Steps and kicks', [
      'The derivative of the step function H(x) is δ(x). A force that acts in an instant, delivering an impulse J, is Jδ(t).'
    ], { n: 1, e: 'H\'(x) = \\delta(x)', x: ['A 0.20 kg ball at rest receives a kick F = 3.0δ(t) N s. Find its velocity afterwards.', ['m dv/dt = 3.0δ(t), so v = (3.0/0.20)H(t).', 'v = 15 m s⁻¹ for t > 0.'], '15 m s⁻¹'], c: ['What is the derivative of the step function?', 'The delta function.'] }],
    ['Fourier representation', [
      'Waves of every frequency, added with equal weight, cancel everywhere except at x = 0. So the Fourier transform of δ is the constant 1: an impulse contains all frequencies equally.'
    ], { n: 2, e: '\\delta(x) = \\frac1{2\\pi}\\int_{-\\infty}^{\\infty}e^{ikx}\\,dk', x: ['Why does striking a bell sharply make it ring with all its natural frequencies?', ['A sharp strike is close to an impulse.', 'An impulse’s transform is flat: it contains every frequency equally.', 'So every mode of the bell receives a share of the energy.'], 'an impulse contains all frequencies'], c: ['What does ∫e^(ikx) dk equal?', '2πδ(x).'] }],
    ['Green’s functions', [
      'For a linear operator L, the **Green’s function** solves LG = δ(x − ξ) with the boundary conditions: the response to a point source at ξ. The response to any source is then the sum of point responses.'
    ], { n: 3, e: 'LG(x,\\xi) = \\delta(x-\\xi),\\qquad y(x) = \\int G(x,\\xi)\\,f(\\xi)\\,d\\xi', x: ['Find the Green’s function of y″ = f on 0 < x < 1 with y(0) = y(1) = 0, and use it for f = 1.', ['Away from ξ, G is a straight line: G = x(ξ − 1) for x < ξ and ξ(x − 1) for x > ξ. Its slope jumps by 1 at ξ, as δ requires.', 'For f = 1: y = ∫₀¹ G(x, ξ) dξ = x(x − 1)/2.', 'Check: y″ = 1 and y(0) = y(1) = 0.'], 'y = x(x − 1)/2'], c: ['What is the Green’s function idea in one sentence?', 'Solve for a point source, then add point sources to build any source.'] }],
    ['Distributions', [
      'Laurent Schwartz made δ rigorous around 1950 by defining distributions through their action on smooth test functions. Products of distributions, such as δ², are generally undefined.'
    ], { n: 4, e: '\\int\\delta_\\varepsilon(x)^2\\,dx = \\frac1\\varepsilon\\to\\infty', x: ['Why is δ(x)² meaningless?', ['Use the box approximation: its square has height 1/ε² and width ε, so its integral is 1/ε.', 'As ε → 0 this grows without limit.', 'Quantum field theory multiplies fields at the same point and meets exactly this problem: it is the origin of its infinities and of the need for renormalisation.'], 'its integral would be infinite'], c: ['How did Schwartz define distributions?', 'As linear maps acting on smooth test functions.'] }]
  ],
  m: [
    ['Treating δ(0) as a number.', 'δ is meaningful only inside integrals.'],
    ['Forgetting the 1/|g′| factor in δ(g(x)).', 'Divide by the slope of g at each root.'],
    ['Counting a spike that lies outside the range of integration.', 'Check that the point lies inside the range.']
  ]
});

WL.gd('m-fourier-series', {
  h: 'Any reasonable periodic function is a sum of sines and cosines of whole-number multiples of its basic frequency. The coefficients come from projecting onto each harmonic, using the orthogonality of sines and cosines, just like the components of a vector. Fourier series solve heat and wave problems and analyse sounds, with one famous imperfection at jumps.',
  s: [
    ['Orthogonality', [
      'Over one period, sin mx and sin nx integrate to zero unless m = n; the same holds for cosines, and every sine is orthogonal to every cosine. So 1, cos nx and sin nx form an orthogonal basis for periodic functions.'
    ], { n: 0, e: '\\int_{-\\pi}^{\\pi}\\sin mx\\,\\sin nx\\,dx = \\begin{cases}\\pi & m = n\\ne0\\\\ 0 & m\\ne n\\end{cases}', x: ['Show that ∫₋π^π sin 2x sin 3x dx = 0.', ['sin A sin B = ½[cos(A − B) − cos(A + B)] = ½[cos x − cos 5x].', 'Each cosine integrates to zero over a full period.', 'So the integral is 0.'], '0'], c: ['What is ∫₋π^π sin²nx dx for n ≥ 1?', 'π.'] }],
    ['The coefficients', [
      'Each coefficient is a projection onto one harmonic. Even functions need only cosines; odd functions only sines.'
    ], { n: 1, e: 'a_n = \\frac1\\pi\\int_{-\\pi}^{\\pi}f\\cos nx\\,dx,\\qquad b_n = \\frac1\\pi\\int_{-\\pi}^{\\pi}f\\sin nx\\,dx', x: ['Find the Fourier series of f(x) = |x| on (−π, π).', ['f is even, so only cosines appear; a₀ = (1/π)∫|x| dx = π.', 'aₙ = (2/π)∫₀^π x cos nx dx = 2((−1)ⁿ − 1)/(πn²): −4/(πn²) for odd n, zero for even n.', '|x| = π/2 − (4/π)(cos x + cos 3x/9 + cos 5x/25 + …).'], 'π/2 − (4/π)Σ cos nx/n² over odd n'], c: ['Which coefficients vanish for an even function?', 'All the sine coefficients.'] }],
    ['Smoothness and decay', [
      'The rougher the function, the slower its coefficients shrink. A function with jumps, like a square wave, has coefficients falling as 1/n; one with only kinks, like |x|, as 1/n².'
    ], { n: 2, e: '\\sum_{\\text{odd }n}\\frac1{n^2} = \\frac{\\pi^2}{8}', x: ['Put x = 0 into the series for |x| to sum 1/n² over odd n.', ['0 = π/2 − (4/π)(1 + 1/9 + 1/25 + …).', 'So the sum of 1/n² over odd n is π²/8.'], 'π²/8'], c: ['Why do a square wave’s coefficients fall only as 1/n?', 'It jumps; smoother functions have faster-falling coefficients.'] }],
    ['Convergence and Parseval', [
      'For a piecewise smooth function, the series converges to f where f is continuous and to the midpoint at a jump. **Parseval’s theorem** says the mean square of f equals the sum of the squared coefficients: the energy is shared out among the harmonics.'
    ], { n: 3, e: '\\frac1\\pi\\int_{-\\pi}^{\\pi}f^2\\,dx = \\frac{a_0^2}{2}+\\sum_n(a_n^2+b_n^2)', x: ['Apply Parseval’s theorem to the square wave (±1), whose coefficients are bₙ = 4/(πn) for odd n.', ['Left side: (1/π)∫₋π^π 1 dx = 2.', 'Right side: (16/π²) × (the sum of 1/n² over odd n).', 'So that sum is π²/8, the same as from |x|: a satisfying check.'], 'π²/8 again'], c: ['What does a Fourier series converge to at a jump?', 'The midpoint of the jump.'] }],
    ['The Gibbs phenomenon', [
      'Near a jump, partial sums overshoot by about 9% of the jump, however many terms are taken: the overshoot only moves closer to the jump. The series still converges at each point, just not uniformly.'
    ], { n: 4, e: '\\text{overshoot}\\approx8.95\\%\\ \\text{of the jump}', x: ['A square wave jumps from −1 to +1. How high do the partial sums overshoot, and does adding terms help?', ['The jump is 2, and 9% of it is 0.18, so the partial sums peak near 1.18.', 'Adding terms squeezes the peak towards the jump without lowering it.', 'The same ringing appears whenever a signal’s high frequencies are cut off sharply, for example as halos at edges in some MRI scans.'], 'about 1.18, whatever the number of terms'], c: ['Does the series still converge at every point?', 'Yes, but not uniformly near the jump.'] }]
  ],
  m: [
    ['Forgetting the ½ on a₀.', 'The constant term is a₀/2.'],
    ['Working out sine coefficients for an even function.', 'Use symmetry: they are all zero.'],
    ['Expecting the overshoot near a jump to disappear.', 'It narrows but stays about 9% of the jump.']
  ]
});

WL.gd('m-fourier-transform', {
  h: 'Letting the period of a Fourier series grow without limit turns the sum over harmonics into an integral over all frequencies: the Fourier transform. It turns derivatives into multiplications and convolutions into products, and it obeys an uncertainty relation: a function and its transform cannot both be narrow. In optics, a far-field diffraction pattern is the transform of the aperture.',
  s: [
    ['The transform pair', [
      'F(k) measures how much of the wave e^(ikx) a function contains, and the inverse transform rebuilds the function from those amounts. Conventions differ in where the 2π goes.'
    ], { n: 0, e: 'F(k) = \\int_{-\\infty}^{\\infty}f(x)\\,e^{-ikx}\\,dx,\\qquad f(x) = \\frac1{2\\pi}\\int_{-\\infty}^{\\infty}F(k)\\,e^{ikx}\\,dk', x: ['Find the transform of f(x) = e^(−a|x|), with a > 0.', ['Split the integral at 0: ∫₀^∞ e^(−(a + ik)x) dx + ∫₋∞⁰ e^((a − ik)x) dx.', '= 1/(a + ik) + 1/(a − ik).', '= 2a/(a² + k²), a Lorentzian.'], '2a/(a² + k²)'], c: ['What does F(k) measure?', 'How much of the wave e^(ikx) the function contains.'] }],
    ['Properties', [
      'Differentiating multiplies the transform by ik, and a convolution becomes a product. So linear differential equations with constant coefficients become algebra.'
    ], { n: 1, e: 'f\'\\mapsto ik\\,F,\\qquad f*g\\mapsto F\\,G', x: ['Use the transform to solve y″ − a²y = −δ(x) for a solution that dies away.', ['Transform: (−k² − a²)Y = −1, so Y = 1/(k² + a²).', 'From the pair above, 1/(k² + a²) is the transform of e^(−a|x|)/(2a).', 'So y = e^(−a|x|)/(2a): the screened response to a point source.'], 'y = e^(−a|x|)/(2a)'], c: ['What does a convolution become under the transform?', 'A product.'] }],
    ['Standard pairs', [
      'A box becomes a sinc function; a decaying exponential becomes a Lorentzian; and a Gaussian becomes a Gaussian, with the widths inverted.'
    ], { n: 2, e: '\\text{box of half-width }a\\ \\mapsto\\ \\frac{2\\sin ka}{k}', x: ['Find the transform of a box of height 1 for |x| < a, and where it first reaches zero.', ['F(k) = ∫₋ₐᵃ e^(−ikx) dx = 2 sin(ka)/k.', 'It first reaches zero at ka = π: k = π/a.', 'A narrower box (smaller a) gives a wider transform.'], '2 sin(ka)/k; first zero at π/a'], c: ['Which function keeps its shape under the transform?', 'The Gaussian.'] }],
    ['Uncertainty', [
      'Measured by their standard deviations, a function and its transform obey σ_xσ_k ≥ ½, with equality only for Gaussians. With p = ħk this is Heisenberg’s relation; in time and frequency it says that a short pulse must contain a wide spread of frequencies.'
    ], { n: 3, e: '\\sigma_x\\sigma_k\\ge\\tfrac12,\\qquad \\sigma_t\\sigma_\\omega\\ge\\tfrac12', x: ['A laser pulse lasts σ_t = 10 fs. What spread of frequencies must it contain?', ['σ_ω ≥ 1/(2σ_t) = 1/(2 × 10⁻¹⁴ s) = 5 × 10¹³ rad s⁻¹.', 'σ_f = σ_ω/2π ≥ 8 THz.', 'For 800 nm light (375 THz) that is at least 2%: ultrashort pulses are always broadband.'], 'at least 8 THz'], c: ['Which functions achieve the smallest possible product?', 'Gaussians.'] }],
    ['Spectral lines and diffraction', [
      'A decaying oscillation has a Lorentzian spectrum, so a short-lived state gives a broadened spectral line. In optics, the far-field diffraction pattern is the transform of the aperture: a slit gives a sinc² pattern.'
    ], { n: 4, e: '\\Gamma = \\frac{\\hbar}{\\tau}', x: ['Hydrogen’s 2p state lives 1.6 ns before emitting Lyman-α light. What natural linewidth does that imply?', ['A decaying oscillation transforms to a Lorentzian (the e^(−a|x|) pair).', 'Its full width in frequency is 1/(2πτ) = 1/(2π × 1.6 × 10⁻⁹ s) ≈ 100 MHz.', 'That is the measured natural width. Lines seen in practice are usually much wider, because of the Doppler effect and collisions.'], 'about 100 MHz'], c: ['Why can a spectrometer that records for a time T not separate frequencies closer than about 1/T?', 'A record of length T has a transform at least about 1/T wide.'] }]
  ],
  m: [
    ['Mixing conventions for where the 2π goes.', 'Pick one convention and keep to it.'],
    ['Forgetting that narrow in x means wide in k.', 'The widths are inversely related.'],
    ['Transforming a function that does not die away, such as a constant, as an ordinary integral.', 'Its transform is a distribution, such as 2πδ(k).']
  ]
});

WL.gd('m-dft', {
  h: 'Real data are samples: N numbers taken at regular intervals. The discrete Fourier transform finds their frequency content, and the fast Fourier transform computes it in about N log N operations instead of N², which made digital signal processing possible. Sampling has a price: frequencies above half the sampling rate are not lost but disguised as lower ones.',
  s: [
    ['The DFT', [
      'For N samples, the DFT gives N frequency bins. Bin k corresponds to frequency k f_s/N, where f_s is the sampling rate, and the bins are 1/T apart, where T is the length of the recording.'
    ], { n: 0, e: 'X_k = \\sum_{n=0}^{N-1}x_n\\,e^{-2\\pi ikn/N}', x: ['A recording lasts 2.0 s, sampled at 8000 Hz. How many samples are there, how far apart are the frequency bins, and what is the highest frequency it can represent?', ['N = 2.0 × 8000 = 16 000 samples.', 'Bin spacing: 1/T = 0.5 Hz.', 'Highest frequency: f_s/2 = 4000 Hz.'], '16 000; 0.5 Hz; 4000 Hz'], c: ['How do you get finer frequency resolution?', 'Record for longer: the bins are 1/T apart.'] }],
    ['Sampling and aliasing', [
      'A signal with no frequencies above f_max is completely captured by samples taken faster than 2f_max. A frequency above f_s/2 shows up at |f − mf_s| for the nearest whole number m, indistinguishable from a genuine low frequency: **aliasing**.'
    ], { n: 1, e: 'f_{\\text{alias}} = |f-mf_s|', x: ['A film runs at 24 frames per second. A wagon wheel with 12 spokes turns at 2.1 revolutions per second. How does it appear to turn?', ['Spokes pass a fixed point 12 × 2.1 = 25.2 times a second.', 'Sampled at 24 Hz, this aliases to |25.2 − 24| = 1.2 Hz.', 'So the wheel seems to creep forwards at 1.2/12 = 0.1 revolutions per second; at exactly 2.0 rev s⁻¹ it would seem to stand still.'], 'slowly forwards, at 0.1 rev s⁻¹'], c: ['Why are anti-aliasing filters used before sampling?', 'After sampling, an aliased frequency cannot be told apart from a genuine low one.'] }],
    ['Leakage and windows', [
      'The DFT treats the record as one period of a repeating signal. A sinusoid that does not fit a whole number of cycles leaks power into neighbouring bins. Tapering the ends of the record with a **window** reduces the leakage, at the cost of slightly wider peaks.'
    ], { n: 2, x: ['A 10.3 Hz sine is recorded for 4.0 s. Does it fall on a bin, and what happens?', ['The bins are 1/4.0 = 0.25 Hz apart, so 10.3 Hz falls between 10.25 and 10.5 Hz.', 'It does not complete a whole number of cycles in the record, so its power spreads into many nearby bins.', 'A Hann window greatly reduces that spread.'], 'it leaks into neighbouring bins'], c: ['What does the DFT assume about the record?', 'That it is one period of a repeating signal.'] }],
    ['The fast Fourier transform', [
      'Split the sum into even and odd samples: each half is a transform of half the length, combined with simple factors. Repeating the split gives about N log₂N operations. Gauss found the idea in 1805; Cooley and Tukey rediscovered it in 1965.'
    ], { n: 3, e: 'N^2\\ \\text{against}\\ N\\log_2N', x: ['Compare the work for N = 2²⁰ samples: a direct DFT against an FFT.', ['Direct: N² ≈ 1.1 × 10¹² operations.', 'FFT: N log₂N = 2²⁰ × 20 ≈ 2.1 × 10⁷.', 'About 50 000 times faster.'], 'about 50 000 times faster'], c: ['What is the key idea of the FFT?', 'Split the sum into even and odd samples, giving two half-size transforms, and repeat.'] }],
    ['Uses, and a classic trap', [
      'The DFT finds spectra of sound, light and vibrations, speeds up convolutions, and finds periods hidden in astronomical data. Gaps in the sampling create aliases of their own.'
    ], { n: 4, x: ['An astronomer observes a star once a night, every 24 h, and finds a period of 0.8 days. Could the true period be different?', ['Observing once a day samples at 1 cycle per day.', 'A frequency of 1.25 cycles per day (period 0.8 d) cannot be told apart from 0.25 cycles per day (period 4 d).', 'Such daily aliases are a classic trap in searches for variable stars and planets; observing at varied times of night breaks the tie.'], 'yes: it could be 4 days'], c: ['How can an FFT speed up a convolution?', 'Transform both signals, multiply, and transform back.'] }]
  ],
  m: [
    ['Sampling at less than twice the highest frequency present.', 'Filter first, or sample faster.'],
    ['Reading a bin number as a frequency in hertz.', 'Multiply by f_s/N.'],
    ['Ignoring leakage when a signal does not fit a whole number of cycles.', 'Use a window.']
  ]
});
WL.gd('m-pde', {
  h: 'Partial differential equations govern fields that vary in space and time. Second-order linear PDEs come in three families with different behaviour: elliptic (equilibrium, like Laplace’s equation), parabolic (diffusion, like the heat equation) and hyperbolic (waves). Separation of variables reduces a PDE with simple boundaries to ordinary differential equations whose solutions are the system’s modes.',
  s: [
    ['Three families', [
      'For Au_xx + 2Bu_xy + Cu_yy + … = 0, the sign of B² − AC decides the type: negative is **elliptic** (Laplace), zero **parabolic** (heat), positive **hyperbolic** (waves). The type decides what data make a sensible problem: elliptic needs boundary values all round; parabolic an initial state plus boundary values; hyperbolic an initial position and velocity.'
    ], { n: 0, e: 'u_t = \\kappa u_{xx},\\qquad u_{tt} = c^2u_{xx},\\qquad \\nabla^2u = 0', x: ['Classify u_xx + 4u_xy + 3u_yy = 0.', ['A = 1, 2B = 4 so B = 2, and C = 3.', 'B² − AC = 4 − 3 = 1 > 0.', 'Hyperbolic: it behaves like a wave equation.'], 'hyperbolic'], c: ['Why is running the heat equation backwards in time a badly posed problem?', 'Tiny wiggles in the final state grow explosively when run backwards, so the answer does not depend smoothly on the data.'] }],
    ['Separation of variables', [
      'For the heat equation on 0 < x < L with u = 0 at both ends, try u = X(x)T(t). The equation splits into X″/X = T′/(κT). The left side depends only on x and the right only on t, so both must equal the same constant, −λ.'
    ], { n: 1, e: '\\frac{X\'\'}{X} = \\frac{T\'}{\\kappa T} = -\\lambda', x: ['Show how u = X(x)T(t) splits u_t = κu_xx.', ['Substitute: XT′ = κX″T.', 'Divide by κXT: T′/(κT) = X″/X.', 'A function of t alone equals a function of x alone, so both are a constant, −λ.'], 'X″ + λX = 0 and T′ = −κλT'], c: ['Why must the separation constant be the same on both sides?', 'One side depends only on x and the other only on t; they can be equal for all x and t only if both are constant.'] }],
    ['The modes', [
      'X″ + λX = 0 with X(0) = X(L) = 0 has non-zero solutions only for λₙ = (nπ/L)², with Xₙ = sin(nπx/L). The boundaries allow only these modes, like the harmonics of a string.'
    ], { n: 2, e: '\\lambda_n = \\left(\\frac{n\\pi}{L}\\right)^2,\\qquad X_n = \\sin\\frac{n\\pi x}{L}', x: ['Why does λ = −k² (negative) give no non-zero solution with these boundary conditions?', ['X = A cosh kx + B sinh kx.', 'X(0) = 0 gives A = 0; X(L) = 0 then needs B sinh kL = 0.', 'sinh kL ≠ 0 for k ≠ 0, so B = 0 as well: only the zero solution.'], 'only X = 0'], c: ['What are the allowed values of λ?', '(nπ/L)² for n = 1, 2, 3, …'] }],
    ['Building the solution', [
      'Each mode decays as e^(−κλₙt). Add them up and choose the coefficients to match the starting temperature: they are its Fourier sine coefficients. High modes die fastest, as n², so soon only the smooth half-sine remains.'
    ], { n: 3, e: 'u = \\sum_nb_n\\sin\\frac{n\\pi x}{L}\\,e^{-\\kappa(n\\pi/L)^2t}', x: ['A rod of length L starts at uniform temperature T₀ with both ends suddenly held at 0. Find u(x, t).', ['The sine coefficients of the constant T₀ are bₙ = 4T₀/(nπ) for odd n and 0 for even n.', 'u = (4T₀/π) Σ over odd n of (1/n) sin(nπx/L) e^(−κ(nπ/L)²t).', 'The n = 3 mode decays 9 times faster than the n = 1 mode, so the profile soon becomes a half-sine.'], 'u = (4T₀/π) Σ (1/n) sin(nπx/L) e^(−κn²π²t/L²), odd n'], c: ['Which modes survive longest?', 'The lowest: decay rates grow as n².'] }],
    ['Uneven ends and uniqueness', [
      'If the ends are held at different temperatures, first subtract the steady straight-line profile, then solve for the decaying remainder. Uniqueness follows from an energy argument: the difference of two solutions starts at zero and cannot grow.'
    ], { n: 4, e: 'u = u_{\\text{steady}}(x)+w(x,t)', x: ['A rod has u(0) = 0 and u(L) = 100 °C. What is the steady state, and what equation does the remainder obey?', ['Steady state: u_xx = 0, so u_s = 100x/L.', 'The remainder w = u − u_s obeys the same heat equation, with w = 0 at both ends.', 'So w is a sum of decaying sine modes, as before.'], 'u_s = 100x/L; w has zero ends'], c: ['How is uniqueness proved for the heat equation?', 'The difference w of two solutions has ∫w² dx decreasing in time, and it starts at zero.'] }]
  ],
  m: [
    ['Allowing the separation constant to differ between the two sides.', 'Both sides equal the same constant.'],
    ['Skipping the check of negative or zero λ.', 'Show that only the allowed positive values give non-zero solutions.'],
    ['Applying zero-end modes when the ends are at other temperatures.', 'Subtract the steady profile first.']
  ]
});

WL.gd('m-separation', {
  h: 'The three great equations of mathematical physics, for heat, waves and potentials, all yield to separation of variables when the boundaries are simple. Each gives a family of modes fixed by the boundary conditions: decaying modes for heat, oscillating standing waves for strings and drums, and growing or decaying profiles for Laplace’s equation.',
  s: [
    ['The wave equation on a string', [
      'With fixed ends, the modes are sin(nπx/L) oscillating at ωₙ = nπc/L. The frequencies are whole-number multiples of the fundamental c/(2L), the harmonic series that makes a string sound musical. The initial shape and velocity fix how much of each mode is present.'
    ], { n: 0, e: 'f_n = \\frac{nc}{2L}', x: ['A 0.65 m guitar string carries waves at 280 m s⁻¹. Find its first three frequencies.', ['f₁ = c/(2L) = 280 ÷ 1.30 = 215 Hz.', 'f₂ = 431 Hz and f₃ = 646 Hz: whole-number multiples.'], '215, 431 and 646 Hz'], c: ['What decides how much of each mode is present?', 'The string’s initial shape and initial velocity.'] }],
    ['D’Alembert’s solution', [
      'Any function f(x − ct) + g(x + ct) solves the wave equation: two shapes travelling in opposite directions without change. A string released from rest splits into two half-height copies of its initial shape moving apart.'
    ], { n: 1, e: 'u = \\tfrac12\\left[F(x-ct)+F(x+ct)\\right]', x: ['A long rope is held still in a single bump of height 2 cm and released. What happens?', ['u = ½[F(x − ct) + F(x + ct)].', 'Two bumps, each 1 cm high, move apart at speed c.', 'Their shapes do not change: an ideal wave equation has no dispersion.'], 'two 1 cm bumps travel apart'], c: ['How are standing waves related to travelling waves?', 'A standing wave is the sum of two equal waves travelling in opposite directions.'] }],
    ['Laplace’s equation', [
      '∇²u = 0 describes steady temperatures, electrostatic potentials and smooth fluid flow. In a disc, separation in polar coordinates gives rⁿ cos nθ and rⁿ sin nθ.'
    ], { n: 2, e: '\\nabla^2u = 0:\\quad r^n\\cos n\\theta,\\ r^n\\sin n\\theta', x: ['The edge of a unit disc is held at u = 3 + sin 2θ. Find the steady temperature inside.', ['Match each term of the boundary value with a solution that is finite at the centre.', 'The constant 3 stays 3; sin 2θ becomes r² sin 2θ.', 'u = 3 + r² sin 2θ.'], 'u = 3 + r² sin 2θ'], c: ['Why are solutions like r⁻ⁿ cos nθ left out here?', 'They blow up at the centre of the disc.'] }],
    ['The mean value property', [
      'A solution of Laplace’s equation equals the average of its values on any circle round a point. So it has no maximum or minimum inside the region: steady temperatures are most extreme on the boundary.'
    ], { n: 3, e: 'u(\\text{centre}) = \\text{mean of }u\\text{ on the circle}', x: ['In the disc above, find the temperature at the centre without the full solution.', ['The centre’s value is the mean round the edge.', 'The mean of 3 + sin 2θ over a full turn is 3.', 'So u = 3 at the centre, agreeing with the full solution.'], '3'], c: ['Can a steady temperature have a hot spot inside a region with no heat sources?', 'No: the extremes lie on the boundary.'] }],
    ['Drums and real strings', [
      'On a circular drum, separation gives Bessel functions, and the mode frequencies are set by their zeros, which are not whole-number multiples. That is why drums sound less “musical” than strings.',
      'Real strings are not perfect either. Their stiffness makes the higher modes slightly sharp, fₙ ≈ nf₁√(1 + Bn²), so pianos are tuned with octaves deliberately stretched.'
    ], { n: 4, e: 'f_n\\approx nf_1\\sqrt{1+Bn^2}', x: ['A piano string has inharmonicity B = 4 × 10⁻⁴. How far is its 10th mode from 10f₁?', ['f₁₀ ≈ 10f₁√(1 + 4 × 10⁻⁴ × 100) = 10f₁√1.04.', '= 10.20f₁: about 2% sharp, roughly a third of a semitone.', 'Tuners stretch the octaves to match these sharp overtones.'], 'about 2% sharp'], c: ['Why are a drum’s overtones not whole-number multiples?', 'They are set by zeros of Bessel functions, which are not evenly spaced.'] }]
  ],
  m: [
    ['Assuming every vibrating object has harmonic overtones.', 'Only ideal strings and pipes do; drums and stiff strings do not.'],
    ['Keeping solutions that blow up inside the region.', 'Discard terms such as r⁻ⁿ that are infinite at the centre.'],
    ['Looking for a maximum of a Laplace solution inside the region.', 'Extremes lie on the boundary.']
  ]
});

WL.gd('m-variations', {
  h: 'The calculus of variations finds functions, not numbers, that make an integral stationary: the shortest path, the fastest slide, the shape of a soap film, the path of light. The condition is the Euler–Lagrange equation, a differential equation for the best function. Applied to the action of a mechanical system it gives Lagrangian mechanics, and so all of classical physics.',
  s: [
    ['Functionals', [
      'A **functional** gives a number for a whole function: J[y] = ∫F(x, y, y′) dx, such as the length of a curve. We look for the function with fixed endpoints that makes J stationary.'
    ], { n: 0, e: 'J[y] = \\int_a^bF(x,y,y\')\\,dx', x: ['Write the functional for the length of a curve y(x) from x = 0 to x = 1, and evaluate it for y = x²/2.', ['Length = ∫₀¹ √(1 + y′²) dx.', 'With y′ = x: ∫₀¹ √(1 + x²) dx = ½[x√(1 + x²) + arsinh x]₀¹.', '= ½(√2 + ln(1 + √2)) = 1.148.'], '1.148'], c: ['What is the difference between a function and a functional?', 'A function turns numbers into numbers; a functional turns a whole function into a number.'] }],
    ['The Euler–Lagrange equation', [
      'Change y slightly to y + εη, with η zero at the ends, and require no first-order change in J. Integrating by parts shows that the bracket below must vanish everywhere.'
    ], { n: 1, e: '\\frac{\\partial F}{\\partial y}-\\frac{d}{dx}\\frac{\\partial F}{\\partial y\'} = 0', x: ['Show that the shortest path between two points in a plane is a straight line.', ['F = √(1 + y′²) does not depend on y, so ∂F/∂y = 0.', 'Then ∂F/∂y′ = y′/√(1 + y′²) is constant, so y′ is constant.', 'A constant slope: a straight line.'], 'a straight line'], c: ['Why must η vanish at the ends?', 'The endpoints are fixed; only the path between them may vary.'] }],
    ['The Beltrami identity', [
      'If F does not depend on x directly, the Euler–Lagrange equation has a first integral: F − y′ ∂F/∂y′ is constant. This solves the brachistochrone, the curve of fastest descent, which turns out to be a cycloid.'
    ], { n: 2, e: 'F-y\'\\frac{\\partial F}{\\partial y\'} = C', x: ['A bead slides from rest along a frictionless wire from one point to another lower one. Why is the straight line not the fastest path?', ['Time = ∫ ds/v with v = √(2gy) (y measured downwards).', 'Dropping steeply at first builds up speed early, which pays off over the rest of the path.', 'Solving with the Beltrami identity gives a cycloid, x = a(θ − sin θ), y = a(1 − cos θ).'], 'the cycloid is faster'], c: ['When can the Beltrami identity be used?', 'When F does not depend on x explicitly.'] }],
    ['Physics from stationary integrals', [
      'Light takes a path of stationary travel time (Fermat); a mechanical system follows a path of stationary action S = ∫(T − V) dt (Hamilton). The Euler–Lagrange equations of L = T − V are Newton’s laws, in any coordinates.',
      '“Stationary” is not always “least”: reflected light inside a curved mirror can take a path of maximum time.'
    ], { n: 3, e: 'S = \\int(T-V)\\,dt,\\qquad n_1\\sin\\theta_1 = n_2\\sin\\theta_2', x: ['Derive the equation of motion of a pendulum from L = ½ml²θ̇² + mgl cos θ.', ['∂L/∂θ = −mgl sin θ; ∂L/∂θ̇ = ml²θ̇.', 'Euler–Lagrange: d/dt(ml²θ̇) + mgl sin θ = 0.', 'θ̈ = −(g/l) sin θ, with no need to resolve any forces.'], 'θ̈ = −(g/l) sin θ'], c: ['What law does minimising travel time across a boundary between media give?', 'Snell’s law, n₁ sin θ₁ = n₂ sin θ₂.'] }],
    ['Constraints', [
      'To keep another integral fixed, such as a perimeter, make J − λK stationary instead, with a Lagrange multiplier λ.'
    ], { n: 4, e: '\\delta(J-\\lambda K) = 0', x: ['What closed curve of fixed length encloses the largest area?', ['Maximise the area ∫y dx subject to a fixed length ∫√(1 + y′²) dx.', 'The Euler–Lagrange equation for y − λ√(1 + y′²) says the curvature is constant.', 'A curve of constant curvature is a circle.'], 'a circle'], c: ['What tool handles a constraint in the calculus of variations?', 'A Lagrange multiplier.'] }]
  ],
  m: [
    ['Forgetting to hold the endpoints fixed.', 'The variation η must vanish at both ends.'],
    ['Assuming the stationary path is always a minimum.', 'It may be a maximum or a saddle.'],
    ['Using the Beltrami identity when F depends on x.', 'It needs F to be independent of x.']
  ]
});

WL.gd('m-lagrange-mult', {
  h: 'To optimise f(x, y, …) subject to a constraint g = c, look for points where the gradient of f is parallel to the gradient of g: there, moving along the constraint cannot improve f. The proportionality constant λ, the Lagrange multiplier, is not just a device: it measures how fast the best value changes as the constraint is relaxed. In statistical mechanics it becomes the temperature.',
  s: [
    ['The geometry', [
      'On the constraint surface g = c, a point is a candidate maximum or minimum of f if moving along the surface does not change f to first order. That happens when ∇f is perpendicular to the surface, that is, parallel to ∇g: the contours of f and g touch.'
    ], { n: 0, e: '\\nabla f = \\lambda\\nabla g,\\qquad g = c', x: ['Find the largest value of f = x + y on the circle x² + y² = 8.', ['∇f = (1, 1) and ∇g = (2x, 2y), so 1 = 2λx and 1 = 2λy: x = y.', 'Then 2x² = 8, so x = y = ±2.', 'The maximum is f(2, 2) = 4 (the minimum is −4).'], '4, at (2, 2)'], c: ['Why must ∇f be parallel to ∇g at the best point?', 'Otherwise f would change when you moved along the constraint, so you could do better.'] }],
    ['The method', [
      'Solve ∇f = λ∇g together with g = c for the variables and λ, then compare the values of f at all the candidates. Equivalently, find the stationary points of Λ = f − λ(g − c).'
    ], { n: 1, e: '\\Lambda = f-\\lambda(g-c)', x: ['A cylindrical can must hold 330 cm³. What shape uses the least metal?', ['Minimise A = 2πr² + 2πrh subject to πr²h = 330.', 'The equations give 4πr + 2πh = λ2πrh and 2πr = λπr², so λ = 2/r and h = 2r.', 'Height = diameter: r = (330/2π)^(1/3) = 3.74 cm and h = 7.49 cm.'], 'h = 2r: r ≈ 3.7 cm, h ≈ 7.5 cm'], c: ['Real drinks cans are taller than they are wide. Why might that be?', 'Other costs matter too: the thicker top and bottom, grip and stacking. The model minimises only the area of metal.'] }],
    ['Several constraints', [
      'With two constraints, ∇f must be a combination of both constraint gradients: it lies in the plane they span.'
    ], { n: 2, e: '\\nabla f = \\lambda_1\\nabla g_1+\\lambda_2\\nabla g_2', x: ['Find the point on the line where the planes x + y + z = 3 and x − y = 1 meet that is closest to the origin.', ['Minimise x² + y² + z²: (2x, 2y, 2z) = λ₁(1, 1, 1) + λ₂(1, −1, 0).', 'So z = λ₁/2, and x + y = λ₁ = 2z.', 'With x + y + z = 3: z = 1, x + y = 2, and x − y = 1, giving (1.5, 0.5, 1).'], '(1.5, 0.5, 1)'], c: ['With two constraints, where must ∇f lie?', 'In the plane spanned by the two constraint gradients.'] }],
    ['The meaning of λ', [
      'If f*(c) is the best value, then df*/dc = λ: the multiplier is the rate at which the optimum improves as the constraint is relaxed. In mechanics a constraint’s multiplier is the force that enforces it.'
    ], { n: 3, e: '\\lambda = \\frac{df^*}{dc}', x: ['In the circle example, check that λ = df*/dc.', ['For x² + y² = c, the maximum of x + y is √(2c).', 'df*/dc = 1/√(2c), which at c = 8 is ¼.', 'From 1 = 2λx with x = 2: λ = ¼. They agree.'], 'both are ¼'], c: ['What does a Lagrange multiplier represent in mechanics?', 'The force needed to enforce the constraint.'] }],
    ['Maximum entropy', [
      'Maximise the entropy S = −Σpᵢ ln pᵢ subject to Σpᵢ = 1 and a fixed mean energy Σpᵢεᵢ = E. The result is the Boltzmann distribution, and the multiplier for energy is β = 1/kT: temperature is a Lagrange multiplier.'
    ], { n: 4, e: 'p_i = \\frac{e^{-\\beta\\varepsilon_i}}{Z},\\qquad \\beta = \\frac1{kT}', x: ['A system has two levels, 0 and ε = 0.10 eV. Find the population ratio at 300 K.', ['kT = 8.62 × 10⁻⁵ × 300 = 0.0259 eV.', 'p₁/p₀ = e^(−ε/kT) = e^(−3.87) = 0.021.', 'About 2% of the systems are in the upper level.'], 'about 0.021'], c: ['With only Σpᵢ = 1 as a constraint, what distribution maximises the entropy?', 'All pᵢ equal.'] }]
  ],
  m: [
    ['Forgetting to check every candidate point.', 'Compare f at all solutions, and at any edges.'],
    ['Dropping the constraint equation itself.', 'Solve ∇f = λ∇g together with g = c.'],
    ['Treating λ as meaningless.', 'It is the rate of change of the optimum with the constraint.']
  ]
});

WL.gd('m-probability', {
  h: 'Statistical physics rests on counting enormous numbers of arrangements. Stirling’s approximation tames the factorials of huge numbers, the binomial distribution becomes a Gaussian for many trials, and the central limit theorem explains why Gaussians appear whenever many small independent effects add up. The same mathematics shows why large systems hardly ever fluctuate noticeably.',
  s: [
    ['The binomial distribution', [
      'In N independent trials with success probability p, the number of successes has mean Np and standard deviation √(Np(1 − p)). The relative spread shrinks like 1/√N: the law of large numbers.'
    ], { n: 0, e: '\\sigma = \\sqrt{Npq},\\qquad \\frac{\\sigma}{\\mu}\\sim\\frac1{\\sqrt N}', x: ['A box holds 10²⁰ gas molecules, each equally likely to be in either half. What is the typical fluctuation in the number in the left half, as a fraction?', ['Mean: 5 × 10¹⁹; standard deviation: √(10²⁰ × ¼) = 5 × 10⁹.', 'Fractional fluctuation: 5 × 10⁹ ÷ 5 × 10¹⁹ = 10⁻¹⁰.', 'One part in ten billion: far too small to notice, which is why gases seem perfectly uniform.'], 'about 10⁻¹⁰'], c: ['How does the relative spread change with N?', 'It shrinks as 1/√N.'] }],
    ['Stirling’s approximation', [
      'n! = ∫₀^∞ xⁿe^(−x) dx, and the integrand has a sharp peak at x = n. Approximating it there by a Gaussian gives Stirling’s formula, already within 1% at n = 10.'
    ], { n: 1, e: 'n!\\approx\\sqrt{2\\pi n}\\,n^ne^{-n},\\qquad \\ln n!\\approx n\\ln n-n', x: ['Check Stirling’s formula at n = 10, and the cruder ln n! ≈ n ln n − n at n = 100.', ['10! = 3 628 800; √(20π) × 10¹⁰ × e⁻¹⁰ = 3 598 696: 0.8% low.', 'ln 100! = 363.7; 100 ln 100 − 100 = 360.5.', 'The crude form is 1% off at n = 100, but its relative error keeps shrinking: for 10²³ particles it is essentially exact.'], '0.8% low; 360.5 against 363.7'], c: ['Which form does statistical mechanics usually use?', 'ln n! ≈ n ln n − n.'] }],
    ['From binomial to Gaussian', [
      'Applying Stirling’s formula near the peak of the binomial gives a Gaussian with the same mean and variance: the de Moivre–Laplace theorem.'
    ], { n: 2, e: '\\binom Nkp^kq^{N-k}\\approx\\frac1{\\sqrt{2\\pi Npq}}\\,e^{-(k-Np)^2/2Npq}', x: ['Estimate the probability of exactly 520 heads in 1000 fair tosses.', ['Mean 500 and Npq = 250, so σ = 15.8.', 'P ≈ e^(−20²/500) ÷ √(2π × 250) = e^(−0.8) ÷ 39.6.', '= 0.449 ÷ 39.6 = 0.0113.'], 'about 0.011'], c: ['Which two quantities does the Gaussian approximation keep from the binomial?', 'The mean and the variance.'] }],
    ['The central limit theorem', [
      'The sum of many independent random variables with finite variance is approximately normal, whatever their individual distributions. Old computers made normal random numbers by adding 12 uniform ones and subtracting 6.'
    ], { n: 3, x: ['Why does adding 12 uniform random numbers on [0, 1] and subtracting 6 give roughly a standard normal number?', ['Each uniform number has mean ½ and variance 1/12.', 'The sum of 12 has mean 6 and variance 1; subtracting 6 gives mean 0 and variance 1.', 'By the central limit theorem the sum is nearly normal, though it can never go beyond ±6, so the extreme tails are wrong.'], 'mean 0, variance 1, nearly normal'], c: ['What condition does the central limit theorem need?', 'Independent variables with finite variance.'] }],
    ['Counting and entropy', [
      'The probability of finding all N molecules in one half of a box is 2⁻ᴺ. For a handful of molecules that happens often; for a mole, never in the lifetime of the Universe. The second law of thermodynamics is this counting.'
    ], { n: 4, e: 'P(\\text{all in one half}) = 2^{-N}', x: ['Find the probability that all the molecules are in the left half for N = 10 and for N = 100.', ['N = 10: 2⁻¹⁰ ≈ 1/1000: it happens often.', 'N = 100: 2⁻¹⁰⁰ ≈ 8 × 10⁻³¹: essentially never.', 'For 10²³ molecules the probability is beyond any meaningful “never”: the second law is statistics, but overwhelming statistics.'], '10⁻³ and 8 × 10⁻³¹'], c: ['Is the second law of thermodynamics absolute?', 'It is statistical: violations are possible but, for large systems, unimaginably unlikely.'] }]
  ],
  m: [
    ['Applying Stirling’s crude form to small n.', 'Use √(2πn)nⁿe⁻ⁿ, or exact factorials.'],
    ['Assuming the Gaussian tails are right for a sum of a few terms.', 'The approximation is weakest far from the mean.'],
    ['Confusing the absolute spread with the relative spread.', 'The spread grows as √N, but the relative spread shrinks as 1/√N.']
  ]
});

WL.gd('m-statistics-uni', {
  h: 'Statistical inference turns data into statements about parameters. Maximum likelihood picks the parameter values that make the data most probable; Bayesian inference updates a prior belief into a posterior using the same likelihood; least squares and χ² fitting are the maximum-likelihood method for Gaussian errors, with a built-in test of whether the model fits.',
  s: [
    ['Estimators', [
      'An **estimator** is a rule for computing a parameter from data. Good ones are unbiased (right on average), consistent (better with more data) and efficient (small spread).'
    ], { n: 0, x: ['Why does the unbiased estimate of a variance divide by n − 1?', ['Deviations are measured from x̄, which is fitted to the same data.', 'That makes them slightly too small on average: dividing by n underestimates σ² by a factor (n − 1)/n.', 'Dividing by n − 1 corrects it.'], 'to remove the bias from fitting x̄'], c: ['What does “consistent” mean for an estimator?', 'It converges to the true value as the amount of data grows.'] }],
    ['Maximum likelihood', [
      'The **likelihood** L(θ) is the probability of the observed data, viewed as a function of the parameter. Maximise ln L. No unbiased estimator can beat the Cramér–Rao bound on its variance.'
    ], { n: 1, e: '\\frac{d}{d\\theta}\\ln L(\\theta) = 0', x: ['Counts of 3, 5, 4, 6 and 2 come from a Poisson distribution. Find the maximum-likelihood estimate of λ and its standard error.', ['ln L = Σ(xᵢ ln λ − λ) + constant; setting the derivative to zero gives λ̂ = x̄.', 'λ̂ = 20 ÷ 5 = 4.0.', 'Its standard error is √(λ/n) = √(4/5) = 0.89, which reaches the Cramér–Rao bound.'], 'λ̂ = 4.0 ± 0.9'], c: ['Why maximise ln L rather than L?', 'The logarithm turns products into sums and has its maximum in the same place.'] }],
    ['Bayesian inference', [
      'Posterior ∝ likelihood × prior. For a success probability with a Beta(a, b) prior and k successes in n trials, the posterior is Beta(a + k, b + n − k).'
    ], { n: 2, e: '\\text{Beta}(a,b)\\ \\to\\ \\text{Beta}(a+k,\\ b+n-k)', x: ['Starting from a uniform prior, Beta(1, 1), a coin gives 7 heads in 10 tosses. Find the posterior mean of p.', ['Posterior: Beta(1 + 7, 1 + 3) = Beta(8, 4).', 'Its mean is 8/(8 + 4) = 0.67.', 'The maximum-likelihood estimate is 0.70; the prior pulls slightly towards ½.'], '0.67'], c: ['What happens to the prior’s influence as data accumulate?', 'It fades: the likelihood dominates.'] }],
    ['Least squares and χ²', [
      'For independent Gaussian errors, maximising the likelihood means minimising χ² = Σ((yᵢ − f(xᵢ))/σᵢ)². A good fit has χ² close to the number of degrees of freedom ν, so the reduced χ²/ν ≈ 1.'
    ], { n: 3, e: '\\chi^2 = \\sum_i\\left(\\frac{y_i-f(x_i)}{\\sigma_i}\\right)^2,\\qquad \\frac{\\chi^2}{\\nu}\\approx1', x: ['A straight line fitted to 12 points gives χ² = 31. Is the fit good?', ['ν = 12 − 2 = 10.', 'χ²/ν = 3.1: far above 1.', 'Either the model is wrong or the error bars are too small; a χ²/ν far below 1 would suggest errors that are too large.'], 'no: χ²/ν = 3.1'], c: ['How is the 1σ range of a parameter found from χ²?', 'It is where χ² rises by 1 above its minimum.'] }],
    ['Combining measurements', [
      'Independent measurements combine as a weighted mean with weights 1/σᵢ². If they scatter more than their errors allow, the errors are probably underestimated.',
      'This happens in practice: measurements of Newton’s constant G since the 1990s disagree by several times their quoted uncertainties, so the recommended value comes with an enlarged uncertainty.'
    ], { n: 4, e: '\\bar x_w = \\frac{\\sum x_i/\\sigma_i^2}{\\sum1/\\sigma_i^2},\\qquad \\sigma_w = \\Big(\\sum\\frac1{\\sigma_i^2}\\Big)^{-1/2}', x: ['Combine 9.81 ± 0.02 and 9.75 ± 0.04 m s⁻². Are they consistent?', ['Weights: 1/0.02² = 2500 and 1/0.04² = 625.', 'Weighted mean: (2500 × 9.81 + 625 × 9.75) ÷ 3125 = 9.798, with σ = 1/√3125 = 0.018.', 'The difference, 0.06, is 1.3 times its uncertainty √(0.02² + 0.04²) = 0.045: consistent.'], '9.80 ± 0.02 m s⁻²; consistent'], c: ['What does χ²/ν ≫ 1 among repeated measurements suggest?', 'That their quoted errors are too small, or that something systematic differs between them.'] }]
  ],
  m: [
    ['Reading a good χ² as proof that the model is right.', 'It shows only that the data do not rule it out.'],
    ['Combining measurements with equal weights.', 'Weight each by 1/σ².'],
    ['Ignoring the prior when it matters, or over-trusting it when data are plentiful.', 'Check how sensitive the result is to the prior.']
  ]
});

WL.gd('m-random-walks', {
  h: 'A random walk, a sequence of independent random steps, wanders a distance that grows only like the square root of the number of steps. In the continuum limit it becomes diffusion, governed by the heat equation. Einstein used this in 1905 to link the jiggling of pollen grains to the size of molecules, and Perrin’s measurements turned atoms from a hypothesis into a fact.',
  s: [
    ['The one-dimensional walk', [
      'N steps of length a, each left or right with equal chance, give mean displacement 0 and mean square displacement Na², so the typical distance is a√N.'
    ], { n: 0, e: '\\langle x\\rangle = 0,\\qquad \\langle x^2\\rangle = Na^2', x: ['A walker takes 10 000 steps of 0.5 m. How far from the start does it typically end up? What is the chance of being back exactly at the start?', ['Typical distance: 0.5 × √10 000 = 50 m, against 5000 m walked.', 'P(back at 0) = ¹⁰⁰⁰⁰C₅₀₀₀ ÷ 2¹⁰⁰⁰⁰ ≈ √(2/(π × 10 000)) = 0.008.'], '50 m; about 0.8%'], c: ['How does the typical distance grow with the number of steps?', 'As √N.'] }],
    ['The diffusion limit', [
      'With a step every τ, the probability density obeys the diffusion equation with D = a²/(2τ). From a point it spreads as a Gaussian with ⟨x²⟩ = 2Dt. Diffusion is fast over short distances and hopelessly slow over long ones, because time grows as distance squared.'
    ], { n: 1, e: '\\frac{\\partial P}{\\partial t} = D\\frac{\\partial^2P}{\\partial x^2},\\qquad \\langle x^2\\rangle = 2Dt', x: ['A sugar molecule in water has D ≈ 5 × 10⁻¹⁰ m² s⁻¹. How long does it take to diffuse 10 μm (across a cell) and 1 cm?', ['t ≈ x²/(2D): (10⁻⁵)² ÷ 10⁻⁹ = 0.1 s.', 'For 1 cm: (10⁻²)² ÷ 10⁻⁹ = 10⁵ s, more than a day.', 'That is why cells can rely on diffusion, but your body needs a circulation.'], '0.1 s and about a day'], c: ['In three dimensions, how does ⟨r²⟩ grow?', 'As 6Dt.'] }],
    ['Einstein’s relation', [
      'A particle in a fluid feels random kicks and drag. Balancing them gives D = kT/(6πηr) for a sphere of radius r. Measuring D therefore measures Boltzmann’s constant, and with it Avogadro’s number.'
    ], { n: 2, e: 'D = \\frac{kT}{6\\pi\\eta r}', x: ['Find D for a bead of radius 0.50 μm in water (η = 1.0 × 10⁻³ Pa s) at 293 K, and its typical displacement along one axis in 60 s.', ['D = 1.38 × 10⁻²³ × 293 ÷ (6π × 10⁻³ × 0.50 × 10⁻⁶) = 4.3 × 10⁻¹³ m² s⁻¹.', 'Typical displacement: √(2Dt) = √(5.2 × 10⁻¹¹) = 7.2 μm.', 'Easily seen under a microscope, which is how Perrin measured Avogadro’s number around 1908.'], 'D = 4.3 × 10⁻¹³ m² s⁻¹; about 7 μm'], c: ['What does a measurement of D give, if r, η and T are known?', 'Boltzmann’s constant, and hence Avogadro’s number.'] }],
    ['Markov chains', [
      'A Markov chain moves between states with probabilities that depend only on the current state, collected in a transition matrix P. The long-run distribution π satisfies πP = π: an eigenvector with eigenvalue 1.'
    ], { n: 3, e: '\\boldsymbol\\pi P = \\boldsymbol\\pi', x: ['Weather is either sunny or rainy. A sunny day is followed by sun with probability 0.8; a rainy day by rain with probability 0.6. Find the long-run fraction of sunny days.', ['Balance: the flow from sunny to rainy equals the flow back: 0.2π_S = 0.4π_R.', 'So π_S = 2π_R, and with π_S + π_R = 1: π_S = ⅔.', 'In the long run, two days in three are sunny.'], '⅔'], c: ['What property defines a Markov chain?', 'The next step depends only on the current state, not on the history.'] }],
    ['Recurrence', [
      'Pólya proved in 1921 that a random walk on a lattice is sure to return to its start in one and two dimensions, but in three dimensions only with probability about 0.34. In his words: a drunk man will find his way home, but a drunk bird may get lost for ever.'
    ], { n: 4, e: 'P_{\\text{return}} = 1\\ (d = 1,2),\\qquad P_{\\text{return}}\\approx0.34\\ (d = 3)', x: ['Why are returns certain in two dimensions but not in three?', ['After n steps the walker is spread over a region of about nᵈ/² sites, so the chance of being at the origin falls as n^(−d/2).', 'The expected number of returns is the sum of these chances: it diverges for d = 1 and 2, but converges for d = 3.', 'An infinite expected number of returns means a return is certain; a finite one leaves a chance of escaping for ever.'], 'the sum of n^(−d/2) diverges only for d ≤ 2'], c: ['What equation describes the same physics as a random walk in continuous time, with drag and random kicks?', 'The Langevin equation, m dv/dt = −γv + ξ(t).'] }]
  ],
  m: [
    ['Expecting displacement to grow in proportion to the number of steps.', 'It grows as √N.'],
    ['Using ⟨x²⟩ = 2Dt in three dimensions.', 'In 3D, ⟨r²⟩ = 6Dt.'],
    ['Treating a process with memory as a Markov chain.', 'Check that the next step depends only on the present state.']
  ]
});
