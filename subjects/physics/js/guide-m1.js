/* Geodesic step-by-step guides, stage m1 (built from src/guide/m1-*.js) */
WL.gd('m-limits', {
  h: 'Calculus rests on limits, and the ε–δ definition makes “gets arbitrarily close” precise: for every tolerance ε, there is a closeness δ that guarantees it. From it come continuity and the two great theorems about continuous functions on closed intervals, together with counterexamples showing why each condition is needed.',
  s: [
    ['Limits of sequences', [
      'aₙ → L means: whatever tolerance ε > 0 you are given, from some point N onwards every term lies within ε of L. The tolerance comes first, as a challenge; N is the response.'
    ], { n: 0, e: 'a_n\\to L\\iff\\forall\\varepsilon>0\\ \\exists N:\\ n>N\\Rightarrow|a_n-L|<\\varepsilon', x: ['Show that aₙ = n/(n + 1) → 1, and find an N that works for ε = 0.01.', ['|aₙ − 1| = 1/(n + 1).', '1/(n + 1) < ε whenever n > 1/ε − 1.', 'For ε = 0.01, N = 99 works. Such an N exists for every ε > 0, so the limit is 1.'], 'N = 99'], c: ['In the definition, which is chosen first, ε or N?', 'ε, as a challenge; N is then chosen to meet it.'] }],
    ['The ε–δ definition', [
      'lim f(x) = L as x → a means: for every ε > 0 there is a δ > 0 such that 0 < |x − a| < δ forces |f(x) − L| < ε. To prove a limit, work backwards from |f(x) − L| < ε to find δ, then present the argument forwards.'
    ], { n: 0, e: '\\forall\\varepsilon>0\\ \\exists\\delta>0:\\ 0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon', x: ['Prove that 5x − 2 → 8 as x → 2.', ['|f(x) − 8| = |5x − 10| = 5|x − 2|.', 'This is below ε whenever |x − 2| < ε/5.', 'So δ = ε/5 works: 0 < |x − 2| < δ gives |f(x) − 8| < ε.'], 'δ = ε/5'], c: ['Why does the definition say 0 < |x − a|?', 'The limit is about values near a, not at a; f(a) need not even exist.'] }],
    ['Rules and the squeeze', [
      'Limits of sums, products and quotients are the sums, products and quotients of the limits (with a non-zero denominator). If f is trapped between two functions with the same limit, it has that limit too: the **squeeze theorem**.'
    ], { n: 1, e: 'g\\le f\\le h,\\quad g,h\\to L\\ \\Rightarrow\\ f\\to L', x: ['Find the limit of x² sin(1/x) as x → 0.', ['−1 ≤ sin(1/x) ≤ 1, so −x² ≤ x² sin(1/x) ≤ x².', 'Both bounds tend to 0.', 'By the squeeze theorem, the limit is 0.'], '0'], c: ['How is sin x/x → 1 proved?', 'By squeezing it between cos x and 1, using sin x ≤ x ≤ tan x.'] }],
    ['Continuity', [
      'f is **continuous** at a if its limit there equals its value. Polynomials, exponentials, sin and cos are continuous, and so are their combinations. A **removable** discontinuity can be filled in; a jump or an infinite discontinuity cannot.'
    ], { n: 2, e: '\\lim_{x\\to a}f(x) = f(a)', x: ['Classify the discontinuities of (x² − 4)/(x − 2) at x = 2, of 1/x at 0, and of the sign function at 0.', ['(x² − 4)/(x − 2) equals x + 2 except at 2; defining its value there as 4 fills the gap: removable.', '1/x blows up near 0: an infinite discontinuity.', 'The sign function jumps from −1 to 1: a jump, which cannot be filled in.'], 'removable, infinite, jump'], c: ['What three things does continuity at a require?', 'f(a) exists, the limit exists, and the two are equal.'] }],
    ['The big theorems', [
      'On a closed interval [a, b], a continuous function takes every value between f(a) and f(b) (the **intermediate value theorem**) and reaches a maximum and a minimum (the **extreme value theorem**). Remove any condition and they can fail.'
    ], { n: 3, e: 'f(a)<k<f(b)\\ \\Rightarrow\\ \\exists c\\in(a,b):\\ f(c) = k', x: ['Show that x⁵ − 3x + 1 = 0 has a root between 0 and 1. Does 1/x have a maximum on (0, 1]?', ['f(0) = 1 > 0 and f(1) = −1 < 0, and polynomials are continuous, so a root lies between them.', '1/x grows without limit as x → 0, so it has no maximum on (0, 1].', 'The extreme value theorem needs a closed interval, and the endpoint 0 is missing.'], 'a root exists; no maximum'], c: ['A function jumps over the value k. Which condition of the intermediate value theorem fails?', 'Continuity.'] }],
    ['Order of limits, and other traps', [
      'Two limits taken one after the other need not commute. And some functions misbehave badly: sin(1/x) has no limit at 0, because it oscillates infinitely fast.'
    ], { n: 4, e: '\\lim_m\\lim_n a_{mn}\\ne\\lim_n\\lim_m a_{mn}\\ \\text{in general}', x: ['Let a(m, n) = m/(m + n). Compare taking n → ∞ first with taking m → ∞ first.', ['Fix m and let n → ∞: a → 0. Then m → ∞ still gives 0.', 'Fix n and let m → ∞: a → 1. Then n → ∞ still gives 1.', 'The order matters. In physics, a magnet keeps its magnetisation only if the system is made infinitely large before the outside field is switched off; in the other order the answer is zero.'], '0 one way, 1 the other'], c: ['Why does sin(1/x) have no limit at 0?', 'It swings between −1 and 1 infinitely often as x → 0.'] }]
  ],
  m: [
    ['Choosing a δ that depends on x.', 'δ may depend only on ε (and the point a).'],
    ['Finding every limit by substituting x = a.', 'That works only for continuous functions.'],
    ['Swapping the order of two limits without justification.', 'Check: the answers can differ.']
  ]
});

WL.gd('m-convergence', {
  h: 'An infinite series means the limit of its partial sums, and whether that limit exists is a real question. A handful of tests (comparison, integral, ratio, alternating) settle most cases. Absolute convergence is robust; conditional convergence is so fragile that rearranging the terms can change the sum, which matters in some physics calculations.',
  s: [
    ['Sequences', [
      'A sequence that is bounded and always increasing (or always decreasing) converges: this is the completeness of the real numbers at work. It lets you prove convergence before knowing the limit.'
    ], { n: 0, e: '\\text{bounded}+\\text{monotone}\\ \\Rightarrow\\ \\text{convergent}', x: ['a₁ = 1 and aₙ₊₁ = √(2 + aₙ). Show the sequence converges and find its limit.', ['It increases (1, 1.732, 1.932, …) and stays below 2: if aₙ < 2, then aₙ₊₁ < √4 = 2.', 'Bounded and increasing, so it converges.', 'The limit satisfies L = √(2 + L), so L² − L − 2 = 0 and L = 2.'], '2'], c: ['What is a Cauchy sequence?', 'One whose terms eventually stay within any ε of each other; for real numbers these are exactly the convergent sequences.'] }],
    ['Comparison and integral tests', [
      'Terms not tending to zero mean divergence, but terms tending to zero are not enough. If 0 ≤ aₙ ≤ bₙ and Σbₙ converges, so does Σaₙ; if Σaₙ diverges, so does Σbₙ. Comparing with an integral shows Σ1/nᵖ converges exactly when p > 1.'
    ], { n: 1, e: '\\sum\\frac1{n^p}\\ \\text{converges}\\iff p>1', x: ['Does the sum of 1/√(n(n + 1)) converge?', ['√(n(n + 1)) < n + 1, so each term is larger than 1/(n + 1).', 'The sum of 1/(n + 1) is the harmonic series, which diverges.', 'So this series diverges too.'], 'it diverges'], c: ['For which p does Σ1/nᵖ converge?', 'p > 1.'] }],
    ['The ratio test', [
      'If |aₙ₊₁/aₙ| tends to L, the series converges absolutely when L < 1 and diverges when L > 1. L = 1 gives no answer. The test suits powers and factorials.'
    ], { n: 2, e: '\\lim\\left|\\frac{a_{n+1}}{a_n}\\right| = L<1\\ \\Rightarrow\\ \\text{converges}', x: ['Does the sum of n³/3ⁿ converge?', ['Ratio: (n + 1)³/3ⁿ⁺¹ × 3ⁿ/n³ = (1 + 1/n)³/3.', 'This tends to ⅓, which is less than 1.', 'So the series converges.'], 'it converges'], c: ['What does the ratio test say when the limit is 1?', 'Nothing: Σ1/n and Σ1/n² both give 1, and one diverges while the other converges.'] }],
    ['Alternating series', [
      'If the terms alternate in sign and shrink steadily to zero, the series converges, and the error after N terms is at most the first term left out.'
    ], { n: 3, e: '|S-S_N|\\le|a_{N+1}|', x: ['1 − ⅓ + ⅕ − ⅐ + … = π/4. How many terms guarantee an error below 0.001?', ['The error after N terms is at most the next term, 1/(2N + 1).', '1/(2N + 1) < 0.001 needs N ≥ 500.', 'Correct, but painfully slow; other series for π converge far faster.'], '500 terms'], c: ['What two conditions does the alternating series test need?', 'Terms alternating in sign, and decreasing in size to zero.'] }],
    ['Absolute and conditional convergence', [
      'If Σ|aₙ| converges, the series converges **absolutely**, and any rearrangement has the same sum. If it converges only **conditionally**, Riemann showed the terms can be rearranged to give any sum at all.'
    ], { n: 4, e: '1-\\tfrac12+\\tfrac13-\\tfrac14+\\cdots = \\ln2', x: ['Rearrange 1 − ½ + ⅓ − ¼ + … as two positive terms, then one negative: 1 + ⅓ − ½ + ⅕ + ⅐ − ¼ + …. What is the new sum?', ['The terms are the same, only reordered.', 'This order sums to (3/2) ln 2 ≈ 1.040, not ln 2 ≈ 0.693.', 'Physics meets this too: the electrostatic energy of a salt crystal (the Madelung sum) is conditionally convergent, so the order of summation must be chosen with care.'], '(3/2) ln 2'], c: ['Which series can safely be rearranged?', 'Absolutely convergent ones.'] }]
  ],
  m: [
    ['Concluding convergence because aₙ → 0.', 'That is necessary but not enough: think of Σ1/n.'],
    ['Reading a ratio-test limit of 1 as convergence.', 'L = 1 decides nothing.'],
    ['Rearranging a conditionally convergent series.', 'Its sum can change.']
  ]
});

WL.gd('m-complex', {
  h: 'Complex numbers make rotation and oscillation algebraic. Euler’s formula, e^(iθ) = cos θ + i sin θ, follows straight from the power series and turns trigonometry into exponentials, AC circuits into Ohm’s law with complex resistances, and oscillations into the real parts of rotating arrows. In quantum mechanics the complex phase is not just bookkeeping: its effects can be measured.',
  s: [
    ['The complex plane', [
      'z = x + iy is the point (x, y), with modulus |z| = √(x² + y²) and argument arg z. The **conjugate** z̄ = x − iy is its reflection in the real axis, and z z̄ = |z|², which is how to divide: multiply top and bottom by the conjugate.'
    ], { n: 0, e: 'z\\bar z = |z|^2', x: ['Compute (3 + 4i)/(1 − 2i) and its modulus.', ['Multiply top and bottom by 1 + 2i: (3 + 4i)(1 + 2i)/(1 + 4) = (3 + 6i + 4i − 8)/5.', '= (−5 + 10i)/5 = −1 + 2i.', 'Modulus √5, which matches |3 + 4i| ÷ |1 − 2i| = 5/√5.'], '−1 + 2i, modulus √5'], c: ['What is z z̄?', '|z|², a real number.'] }],
    ['Euler’s formula', [
      'Put iθ into the series for eˣ: the even powers give the cosine series and the odd powers i times the sine series. So multiplying by e^(iθ) rotates by θ, and e^(iπ) + 1 = 0.'
    ], { n: 1, e: 'e^{i\\theta} = \\cos\\theta+i\\sin\\theta', x: ['Show where Euler’s formula comes from, and evaluate e^(iπ/3).', ['e^(iθ) = 1 + iθ − θ²/2! − iθ³/3! + θ⁴/4! + …', 'The real terms are the series for cos θ, the imaginary ones i times the series for sin θ.', 'e^(iπ/3) = ½ + (√3/2)i.'], '½ + (√3/2)i'], c: ['What is e^(iπ) + 1?', '0.'] }],
    ['Oscillations and circuits', [
      'A real oscillation is the real part of a rotating complex number. Differentiating e^(iωt) multiplies it by iω, so differential equations become algebra. In AC circuits, resistors, inductors and capacitors have **impedances** R, iωL and 1/(iωC), and V = IZ handles every phase shift.'
    ], { n: 2, e: 'Z_R = R,\\qquad Z_L = i\\omega L,\\qquad Z_C = \\frac1{i\\omega C}', x: ['A 100 Ω resistor and a 10 μF capacitor in series are driven at 50 Hz with amplitude 20 V. Find the current amplitude and phase.', ['ω = 2π × 50 = 314 rad s⁻¹, and the capacitor’s impedance is 1/(iωC) = −318i Ω.', 'Z = 100 − 318i, so |Z| = 334 Ω and the current amplitude is 20 ÷ 334 = 0.060 A.', 'arg Z = −72.6°, so the current leads the voltage by 72.6°.'], '0.060 A, leading by 72.6°'], c: ['What does differentiating e^(iωt) do?', 'It multiplies by iω.'] }],
    ['Logarithms and powers', [
      'Adding 2π to the argument gives the same number, so log z = ln|z| + i(arg z + 2πk) has infinitely many values, and so do powers such as iⁱ.'
    ], { n: 3, e: '\\log z = \\ln|z|+i(\\arg z+2\\pi k)', x: ['Find all values of log(−1) and of iⁱ.', ['−1 = e^(i(π + 2πk)), so log(−1) = i(π + 2πk).', 'iⁱ = e^(i log i) = e^(i × i(π/2 + 2πk)) = e^(−π/2 − 2πk).', 'All of them are real; the principal value is e^(−π/2) ≈ 0.208.'], 'i(π + 2πk); e^(−π/2 − 2πk)'], c: ['Why does log z have infinitely many values?', 'Adding 2π to the argument gives the same z.'] }],
    ['Roots, and a phase you can measure', [
      'Every polynomial of degree n has exactly n complex roots, counted with multiplicity. zⁿ = w has n roots equally spaced on a circle.',
      'In quantum mechanics the phase is physical: in the Aharonov–Bohm effect, electrons passing either side of a shielded magnetic field pick up a phase difference qΦ/ħ that shifts their interference pattern, as experiments confirmed in 1986.'
    ], { n: 4, e: '\\Delta\\varphi = \\frac{q\\Phi}{\\hbar}', x: ['Solve z⁴ = −16.', ['−16 = 16e^(i(π + 2πk)).', 'z = 2e^(i(π/4 + πk/2)) for k = 0, 1, 2, 3.', 'z = √2(±1 ± i): the four corners of a square.'], '√2(±1 ± i)'], c: ['How many roots does a polynomial of degree n have?', 'Exactly n, counted with multiplicity.'] }]
  ],
  m: [
    ['Dividing complex numbers without the conjugate.', 'Multiply top and bottom by the conjugate of the bottom.'],
    ['Keeping only the principal value of log or a power.', 'Add 2πk to the argument when every value is needed.'],
    ['Taking arg z = tan⁻¹(y/x) without checking the quadrant.', 'Place the point first.']
  ]
});

WL.gd('m-taylor', {
  h: 'A Taylor series rebuilds a function near a point from its derivatives there: match the value, the slope, the curvature and so on. The series converges within a radius set by the nearest singularity, which may lie off the real line. Truncated series are the working approximations of physics, and the remainder term says how good they are.',
  s: [
    ['Matching derivatives', [
      'Choose a polynomial whose value and first n derivatives at x = a equal those of f. The coefficient of (x − a)ᵏ must then be f⁽ᵏ⁾(a)/k!. About a = 0 this is the **Maclaurin series**.'
    ], { n: 0, e: 'f(x) = \\sum_{k=0}^{\\infty}\\frac{f^{(k)}(a)}{k!}(x-a)^k', x: ['Find the Maclaurin series of ln(1 + x) up to x³.', ['f = ln(1 + x), f′ = 1/(1 + x), f″ = −1/(1 + x)², f‴ = 2/(1 + x)³.', 'At 0 these are 0, 1, −1 and 2.', 'Series: x − x²/2 + 2x³/3! = x − x²/2 + x³/3.'], 'x − x²/2 + x³/3'], c: ['What must the coefficient of (x − a)ᵏ be?', 'f⁽ᵏ⁾(a)/k!.'] }],
    ['Standard series', [
      'Inside their radius of convergence, series can be substituted into, multiplied, differentiated and integrated term by term, which makes awkward limits easy.'
    ], { n: 1, e: 'e^x = \\sum_{n=0}^\\infty\\frac{x^n}{n!},\\qquad \\sin x = x-\\frac{x^3}{6}+\\cdots', x: ['Find the limit of (eˣ − 1 − x)/x² as x → 0.', ['eˣ = 1 + x + x²/2 + x³/6 + …', 'So (eˣ − 1 − x)/x² = ½ + x/6 + …', 'The limit is ½.'], '½'], c: ['Write down the series for e^(−x²).', '1 − x² + x⁴/2 − x⁶/6 + …'] }],
    ['The remainder', [
      'Stopping after the xⁿ term leaves an error equal to the next derivative, at some point between a and x, times (x − a)ⁿ⁺¹/(n + 1)!. This bounds the error of any truncated approximation.'
    ], { n: 2, e: 'R_n = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}', x: ['How accurate is sin x ≈ x − x³/6 at x = 0.5?', ['The next non-zero term is x⁵/120, so the error is at most 0.5⁵/120 = 2.6 × 10⁻⁴.', 'Check: sin 0.5 = 0.479426, and the approximation gives 0.479167.', 'The error, 2.6 × 10⁻⁴, matches the bound.'], 'about 2.6 × 10⁻⁴'], c: ['What does Lagrange’s remainder depend on?', 'The next derivative somewhere between a and x, and the size of (x − a).'] }],
    ['Radius of convergence', [
      'A power series converges inside a circle in the complex plane reaching out to the nearest singularity of the function, which may not be on the real line at all.'
    ], { n: 3, e: '\\frac1{1+x^2} = 1-x^2+x^4-\\cdots\\quad(|x|<1)', x: ['The series for 1/(1 + x²) fails at x = 2, though the function is perfectly smooth for every real x. Why?', ['The series is geometric with ratio −x², so it converges only for |x| < 1.', 'The function has poles at x = ±i, at distance 1 from the origin.', 'The radius of convergence reaches only to the nearest singularity, real or complex.'], 'singularities at ±i'], c: ['What is the radius of convergence of the series for ln(1 + x)?', '1: there is a singularity at x = −1.'] }],
    ['Series in physics', [
      'Expanding a potential to second order about a minimum gives simple harmonic motion with ω² = V″/m, which is why oscillators are everywhere. The next term in the series says how the motion departs from perfect simple harmonic motion.'
    ], { n: 4, e: '\\omega^2 = \\frac{V\'\'(x_0)}{m}', x: ['A pendulum has potential energy mgl(1 − cos θ). Expand it to find the small-swing frequency and the first correction.', ['1 − cos θ = θ²/2 − θ⁴/24 + …', 'The θ² term gives simple harmonic motion with ω² = g/l.', 'The θ⁴ term weakens the restoring force, so larger swings are slower: the period grows by about θ₀²/16, 0.6% at a swing of 0.3 rad.'], 'ω² = g/l, with a period increase of about θ₀²/16'], c: ['Why do oscillators turn up everywhere in physics?', 'Near any minimum, V ≈ V₀ + ½V″(x − x₀)², which gives simple harmonic motion.'] }]
  ],
  m: [
    ['Forgetting the k! in the coefficients.', 'The coefficient is f⁽ᵏ⁾(a)/k!.'],
    ['Using a series outside its radius of convergence.', 'Find the nearest singularity first, including complex ones.'],
    ['Trusting a truncated series without estimating the error.', 'Use the remainder or the first omitted term.']
  ]
});

WL.gd('m-partial', {
  h: 'A function of several variables changes in different ways in different directions. A partial derivative measures the change along one axis with the others held fixed; the gradient gathers them into a vector pointing uphill, perpendicular to contours. The total differential adds up small changes from every variable, which is how errors propagate and how thermodynamics works.',
  s: [
    ['Partial derivatives', [
      '∂f/∂x is the slope of the surface z = f(x, y) in the x-direction, with y held fixed. For smooth functions the mixed second derivatives agree: f_xy = f_yx.'
    ], { n: 0, e: '\\frac{\\partial^2f}{\\partial x\\,\\partial y} = \\frac{\\partial^2f}{\\partial y\\,\\partial x}', x: ['For f = x²y + e^(xy), find f_x and f_y, and check that f_xy = f_yx.', ['f_x = 2xy + ye^(xy); f_y = x² + xe^(xy).', 'Differentiating f_x with respect to y: 2x + e^(xy) + xye^(xy).', 'Differentiating f_y with respect to x: 2x + e^(xy) + xye^(xy). The same.'], 'they agree'], c: ['What does ∂f/∂x measure geometrically?', 'The slope of the surface along x, at fixed y.'] }],
    ['The total differential and errors', [
      'A small change in each variable changes f by the sum of the separate effects: df ≈ f_x dx + f_y dy. For a product of powers, fractional errors are multiplied by the powers; independent ones combine as the square root of the sum of squares.'
    ], { n: 1, e: 'df = \\frac{\\partial f}{\\partial x}dx+\\frac{\\partial f}{\\partial y}dy', x: ['A pendulum gives g = 4π²l/T² with l = 1.000 ± 0.002 m and T = 2.006 ± 0.004 s. Find g and its uncertainty, assuming independent errors.', ['g = 4π² × 1.000 ÷ 2.006² = 9.811 m s⁻².', 'Fractional errors: 0.2% from l, and 2 × 0.2% = 0.4% from T, because T is squared.', 'Combined: √(0.2² + 0.4²) = 0.45%, so g = 9.81 ± 0.04 m s⁻².'], '9.81 ± 0.04 m s⁻²'], c: ['Why does the timing error count twice?', 'g ∝ T⁻², and a power n multiplies the fractional error by |n|.'] }],
    ['The gradient', [
      '∇f collects the partial derivatives into a vector. The rate of change in the direction of a unit vector û is ∇f·û, largest along ∇f itself. Along a contour f is constant, so the gradient is perpendicular to contours.'
    ], { n: 2, e: 'D_{\\hat u}f = \\nabla f\\cdot\\hat{\\mathbf u}', x: ['A temperature map is T(x, y) = 20 + x² − xy. At (2, 1), find the direction of fastest increase and the rate of change along (0.6, 0.8).', ['∇T = (2x − y, −x) = (3, −2) at (2, 1).', 'Fastest increase along (3, −2), at a rate √13 = 3.61 per unit distance.', 'Along (0.6, 0.8): 3 × 0.6 − 2 × 0.8 = 0.2.'], 'along (3, −2); rate 0.2 along (0.6, 0.8)'], c: ['Why is the gradient perpendicular to contours?', 'Along a contour f does not change, so ∇f · (tangent) = 0.'] }],
    ['Stationary points', [
      'At a stationary point ∇f = 0. With D = f_xx f_yy − f_xy²: D > 0 and f_xx > 0 gives a minimum, D > 0 and f_xx < 0 a maximum, and D < 0 a saddle.'
    ], { n: 3, e: 'D = f_{xx}f_{yy}-f_{xy}^2', x: ['Classify the stationary points of f = x³ − 3x + y².', ['f_x = 3x² − 3 = 0 and f_y = 2y = 0 give (1, 0) and (−1, 0).', 'f_xx = 6x, f_yy = 2, f_xy = 0, so D = 12x.', '(1, 0): D > 0 and f_xx > 0, a minimum. (−1, 0): D < 0, a saddle.'], 'minimum at (1, 0); saddle at (−1, 0)'], c: ['What does D < 0 mean?', 'A saddle: uphill in one direction, downhill in another.'] }],
    ['Holding something constant', [
      'When several variables are linked, a partial derivative means nothing until you say which variable is held fixed. In thermodynamics this matters constantly.'
    ], { n: 4, e: '\\left(\\frac{\\partial p}{\\partial V}\\right)_T\\left(\\frac{\\partial V}{\\partial T}\\right)_p\\left(\\frac{\\partial T}{\\partial p}\\right)_V = -1', x: ['For an ideal gas, pV = nRT. Find (∂p/∂V) at constant T, (∂V/∂T) at constant p and (∂T/∂p) at constant V, and multiply them.', ['(∂p/∂V)_T = −nRT/V²; (∂V/∂T)_p = nR/p; (∂T/∂p)_V = V/(nR).', 'Product: −nRT/(pV) = −1, not +1 as naive cancelling suggests.', 'And “∂p/∂V” alone is ambiguous: compressed without heat flow (constant entropy), a gas resists γ times more strongly than at constant T.'], '−1'], c: ['Why must a partial derivative say what is held constant?', 'With linked variables, different choices give different answers.'] }]
  ],
  m: [
    ['Letting the other variables change while taking a partial derivative.', 'Hold them fixed.'],
    ['Adding independent fractional errors.', 'Combine them as the square root of the sum of squares; adding gives the worst case.'],
    ['Classifying a stationary point from f_xx alone.', 'Use D = f_xx f_yy − f_xy² as well.']
  ]
});

WL.gd('m-curvilinear', {
  h: 'Cartesian coordinates are rarely the natural ones. Cylindrical and spherical coordinates match the symmetry of wires, planets and atoms, but their unit vectors change direction from place to place, and their area and volume elements carry scale factors such as r² sin θ. Getting these right is essential for every integral and derivative in curved coordinates.',
  s: [
    ['The three systems', [
      'Cylindrical coordinates (s, φ, z) use the distance from an axis; spherical coordinates (r, θ, φ) use the distance from a point, the angle θ down from the z-axis, and the angle φ round it.'
    ], { n: 0, e: 'x = r\\sin\\theta\\cos\\phi,\\quad y = r\\sin\\theta\\sin\\phi,\\quad z = r\\cos\\theta', x: ['Convert (x, y, z) = (1, 1, √2) to cylindrical and spherical coordinates.', ['Cylindrical: s = √2, φ = π/4, z = √2.', 'Spherical: r = √(1 + 1 + 2) = 2; θ = cos⁻¹(√2/2) = π/4; φ = π/4.'], '(√2, π/4, √2) and (2, π/4, π/4)'], c: ['In spherical coordinates, what does θ measure?', 'The angle down from the z-axis, from 0 to π.'] }],
    ['Area and volume elements', [
      'Changing r, θ and φ a little moves a point by dr, r dθ and r sin θ dφ in three perpendicular directions, so the volume element is r² sin θ dr dθ dφ. In the plane, dA = r dr dθ. These factors are the Jacobians of the coordinate changes.'
    ], { n: 1, e: 'dA = r\\,dr\\,d\\theta,\\qquad dV = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi', x: ['Use polar coordinates to evaluate the integral of e^(−(x² + y²)) over the whole plane, and deduce the integral of e^(−x²) along the line.', ['With dA = r dr dθ: ∫₀^(2π) dθ ∫₀^∞ e^(−r²) r dr = 2π × ½ = π.', 'The double integral also equals (∫e^(−x²) dx)².', 'So ∫e^(−x²) dx = √π: a result with no simple proof in Cartesian coordinates.'], '√π'], c: ['What is the volume element in spherical coordinates?', 'r² sin θ dr dθ dφ.'] }],
    ['Areas on a sphere', [
      'On a sphere of radius R, the area element is R² sin θ dθ dφ: circles of latitude shrink towards the poles.'
    ], { n: 1, e: 'dA = R^2\\sin\\theta\\,d\\theta\\,d\\phi', x: ['What fraction of a sphere’s surface lies within 30° of its north pole?', ['A = R² ∫₀^(π/6) sin θ dθ ∫₀^(2π) dφ = 2πR²(1 − cos 30°).', 'As a fraction of 4πR²: (1 − cos 30°)/2.', '= 0.067, about 6.7%.'], 'about 6.7%'], c: ['Why does the area element contain sin θ?', 'A circle of latitude at angle θ has radius R sin θ.'] }],
    ['Moving unit vectors', [
      'ê_r points away from the origin, so its direction changes as the point moves. Differentiating r = rê_r twice gives the acceleration in polar coordinates, with extra terms that come purely from the turning unit vectors.'
    ], { n: 2, e: '\\mathbf a = (\\ddot r-r\\dot\\theta^2)\\,\\hat{\\mathbf e}_r+(r\\ddot\\theta+2\\dot r\\dot\\theta)\\,\\hat{\\mathbf e}_\\theta', x: ['A bead slides outwards at steady speed v along a rod turning at constant ω, so r = vt. Find its acceleration.', ['ṙ = v, r̈ = 0, θ̇ = ω and θ̈ = 0.', 'a_r = −vtω² (towards the centre); a_θ = 2vω (sideways).', 'The rod must push the bead sideways with force 2mvω: the Coriolis term, which comes purely from the turning unit vectors.'], 'a_r = −vtω², a_θ = 2vω'], c: ['Where does the −rθ̇² term come from?', 'From the turning of ê_r: it is the centripetal acceleration.'] }],
    ['The gradient in curved coordinates', [
      'Divide each partial derivative by its scale factor: 1 for r, r for θ, and r sin θ for φ.'
    ], { n: 3, e: '\\nabla f = \\frac{\\partial f}{\\partial r}\\hat{\\mathbf e}_r+\\frac1r\\frac{\\partial f}{\\partial\\theta}\\hat{\\mathbf e}_\\theta+\\frac1{r\\sin\\theta}\\frac{\\partial f}{\\partial\\phi}\\hat{\\mathbf e}_\\phi', x: ['Find ∇f for f = r² cos θ.', ['∂f/∂r = 2r cos θ.', '(1/r) ∂f/∂θ = −r sin θ.', '∇f = 2r cos θ ê_r − r sin θ ê_θ. (Check: f = rz, and the Cartesian gradient gives the same.)'], '2r cos θ ê_r − r sin θ ê_θ'], c: ['What is ∇(1/r)?', '−ê_r/r²: the shape of every inverse-square field.'] }],
    ['Choosing coordinates', [
      'Match the coordinates to the symmetry: spherical for point sources and atoms, cylindrical for wires and pipes. The angular integrals then often just give 2π or 4π.'
    ], { n: 4, e: '\\iiint f(r)\\,dV = 4\\pi\\int_0^\\infty f(r)\\,r^2\\,dr', x: ['In hydrogen’s ground state the probability density is e^(−2r/a)/(πa³). What is the probability that the electron is within r = a?', ['Integrating over angles gives 4π, so P = (4/a³)∫₀^a r²e^(−2r/a) dr.', 'This works out to 1 − 5e^(−2).', '= 0.32: only about a third, even though a is the single most likely radius.'], 'about 0.32'], c: ['When should you use spherical coordinates?', 'When the problem has a centre of symmetry, such as a point charge or an atom.'] }]
  ],
  m: [
    ['Leaving out the Jacobian (r, or r² sin θ).', 'Include the scale factors in every area or volume element.'],
    ['Treating ê_r as a constant vector.', 'It turns as the point moves.'],
    ['Mixing up the conventions for θ and φ.', 'Here θ is measured down from the z-axis.']
  ]
});
WL.gd('m-multiple', {
  h: 'A double integral adds up a quantity over an area, a triple integral over a volume. Work one variable at a time with the right limits, and change coordinates when the region or the integrand has a symmetry, remembering the stretch factor (the Jacobian) of the new coordinates. This gives masses, centres of mass, moments of inertia and probabilities.',
  s: [
    ['Iterated integrals', [
      'Compute a double integral as an inner integral (say over y, with limits that may depend on x) followed by an outer one over x. Sketch the region first to set the limits.'
    ], { n: 0, e: '\\iint_Rf\\,dA = \\int\\!\\left(\\int f\\,dy\\right)dx', x: ['Integrate xy over the triangle with corners (0, 0), (1, 0) and (1, 1).', ['For each x from 0 to 1, y runs from 0 to x.', 'Inner: ∫₀ˣ xy dy = x³/2.', 'Outer: ∫₀¹ x³/2 dx = 1/8.'], '1/8'], c: ['What does Fubini’s theorem say?', 'For well-behaved integrands, the order of integration does not matter.'] }],
    ['Changing the order', [
      'Some integrals are impossible in one order and easy in the other. Describe the same region the other way round and try again.'
    ], { n: 1, x: ['Evaluate the integral over 0 ≤ y ≤ π, y ≤ x ≤ π of (sin x)/x, integrating over x first.', ['The inner integral of (sin x)/x has no elementary form. The region is 0 ≤ y ≤ x ≤ π.', 'Reverse the order: for each x from 0 to π, y runs from 0 to x.', '∫₀^π (sin x/x) × x dx = ∫₀^π sin x dx = 2.'], '2'], c: ['What must you do before reversing the order?', 'Sketch the region and describe its limits the other way round.'] }],
    ['When the order does matter', [
      'Fubini’s theorem needs a condition: the integral of |f| must be finite. If the integrand blows up badly enough, the two orders can give different answers.'
    ], { n: 0, e: '\\int_0^1\\!\\!\\int_0^1\\frac{x^2-y^2}{(x^2+y^2)^2}\\,dy\\,dx = \\frac\\pi4', x: ['Compute the integral of (x² − y²)/(x² + y²)² over the unit square in both orders.', ['Integrating over y first: the antiderivative is y/(x² + y²), giving 1/(1 + x²); then ∫₀¹ 1/(1 + x²) dx = π/4.', 'Swapping x and y flips the sign of the integrand, so the other order gives −π/4.', 'The integrand blows up near the origin so strongly that |f| has an infinite integral, and Fubini’s condition fails.'], 'π/4 one way, −π/4 the other'], c: ['What condition makes the order of integration irrelevant?', 'The integral of |f| over the region is finite.'] }],
    ['Jacobians', [
      'Under a change of variables x = x(u, v), y = y(u, v), a small cell du dv is stretched by the absolute value of the Jacobian determinant. In polar coordinates the factor is r.'
    ], { n: 2, e: 'dA = \\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|du\\,dv', x: ['Find the area of the ellipse x²/a² + y²/b² ≤ 1, using x = au and y = bv.', ['The ellipse becomes the unit disc u² + v² ≤ 1.', 'The Jacobian is det(a 0; 0 b) = ab.', 'Area = ab × π = πab.'], 'πab'], c: ['What is the area element in polar coordinates?', 'r dr dθ.'] }],
    ['The Gaussian integral', [
      'Squaring ∫e^(−x²) dx gives a double integral that is easy in polar coordinates, thanks to the factor r: the answer is √π. Many probability and physics results follow by substitution.'
    ], { n: 3, e: '\\int_{-\\infty}^{\\infty}e^{-x^2}\\,dx = \\sqrt\\pi', x: ['Use it to show that the normal density e^(−x²/2σ²)/(σ√(2π)) has total probability 1.', ['Substitute x = σ√2 u, so dx = σ√2 du.', '∫e^(−x²/2σ²) dx = σ√2 × √π = σ√(2π).', 'Dividing by σ√(2π) gives 1.'], 'shown'], c: ['Where does the √π come from?', 'From squaring the integral and switching to polar coordinates, where the factor r makes it easy.'] }],
    ['Physical uses', [
      'Mass is ∭ρ dV, the centre of mass is (∭xρ dV)/M, and the moment of inertia is ∭r⊥²ρ dV, where r⊥ is the distance from the axis.'
    ], { n: 4, e: 'I = \\iiint r_\\perp^2\\,\\rho\\,dV', x: ['Find the moment of inertia of a uniform disc of mass M and radius R about its axis.', ['Surface density: σ = M/(πR²).', 'I = σ∫₀^(2π)∫₀^R r² × r dr dθ = σ × 2π × R⁴/4.', '= ½MR².'], '½MR²'], c: ['Why does a hoop of the same mass and radius have a larger moment of inertia?', 'All its mass is at the rim: I = MR².'] }]
  ],
  m: [
    ['Forgetting the Jacobian when changing coordinates.', 'Include r, r² sin θ or the relevant determinant.'],
    ['Setting limits without sketching the region.', 'Sketch first; inner limits may depend on the outer variable.'],
    ['Swapping the order for an integrand that is not absolutely integrable.', 'Check that the integral of |f| is finite.']
  ]
});

WL.gd('m-line-integrals', {
  h: 'A line integral adds up a vector field along a path: ∫F·dr is the work a force does along a route. For some fields the answer depends only on the endpoints; these conservative fields are gradients of a potential, and their circulation round any closed loop is zero. Whether a curl-free field is conservative depends on the shape of the region, a fact that reappears in magnetism and quantum mechanics.',
  s: [
    ['Definition', [
      'Describe the path as r(t) for a ≤ t ≤ b. Then the line integral is ∫ F(r(t))·r′(t) dt. Reversing the direction of travel changes its sign.'
    ], { n: 0, e: '\\int_C\\mathbf F\\cdot d\\mathbf r = \\int_a^b\\mathbf F(\\mathbf r(t))\\cdot\\mathbf r\'(t)\\,dt', x: ['Find the work done by F = (y, −x) along the quarter circle from (1, 0) to (0, 1), anticlockwise.', ['r(t) = (cos t, sin t) for 0 ≤ t ≤ π/2, so r′(t) = (−sin t, cos t).', 'F·r′ = sin t × (−sin t) + (−cos t) × cos t = −1.', 'W = ∫₀^(π/2) (−1) dt = −π/2: the field pushes against the motion.'], '−π/2'], c: ['What happens to a line integral if the path is reversed?', 'It changes sign.'] }],
    ['Conservative fields', [
      'If F = ∇φ, the line integral from A to B is φ(B) − φ(A) whatever the path, and the circulation round any closed loop is zero. Gravity and electrostatic fields are conservative; friction is not.'
    ], { n: 1, e: '\\int_A^B\\nabla\\varphi\\cdot d\\mathbf r = \\varphi(B)-\\varphi(A)', x: ['F = (2xy, x² + 3y²). Find the work it does from (0, 0) to (1, 2).', ['Check: ∂F₂/∂x = 2x = ∂F₁/∂y, so F may be a gradient.', 'φ = x²y + y³ has ∇φ = (2xy, x² + 3y²).', 'Work = φ(1, 2) − φ(0, 0) = 2 + 8 = 10, along any path.'], '10'], c: ['What is the circulation of a conservative field round a closed loop?', 'Zero.'] }],
    ['Testing and finding potentials', [
      'A conservative field has zero curl. On a region with no holes the converse holds. To find φ, integrate one component, then fix the “constant”, which may depend on the other variables, using the remaining components.'
    ], { n: 2, e: '\\nabla\\times\\mathbf F = \\mathbf 0', x: ['Is F = (y² + z, 2xy, x) conservative? If so, find a potential.', ['Curl components: ∂F₃/∂y − ∂F₂/∂z = 0; ∂F₁/∂z − ∂F₃/∂x = 1 − 1 = 0; ∂F₂/∂x − ∂F₁/∂y = 2y − 2y = 0.', 'Integrating F₁ with respect to x: φ = xy² + xz + g(y, z).', 'Matching F₂ and F₃ forces g to be constant, so φ = xy² + xz.'], 'yes: φ = xy² + xz'], c: ['When does zero curl guarantee a potential?', 'On a region with no holes.'] }],
    ['Circulation and holes', [
      'A field can have zero curl everywhere it is defined and still not be conservative, if the region has a hole that a loop can wind round.'
    ], { n: 3, e: '\\oint\\frac{-y\\,dx+x\\,dy}{x^2+y^2} = 2\\pi', x: ['Show that F = (−y, x)/(x² + y²) has zero curl away from the origin but circulation 2π round the unit circle.', ['Away from the origin, a direct calculation gives ∂F₂/∂x − ∂F₁/∂y = 0.', 'On the unit circle, F = (−sin t, cos t) = r′(t), so F·r′ = 1.', 'The circulation is 2π, not 0: the origin is a hole, and loops round it pick up 2π.'], '2π'], c: ['What is the circulation round a loop that does not enclose the origin?', 'Zero.'] }],
    ['Physics', [
      'The work done by gravity depends only on the start and end. The magnetic field round a long straight wire has the same form as the field with a hole: zero curl outside the wire, but ∮B·dl = μ₀I round it (Ampère’s law).'
    ], { n: 4, e: 'W = GMm\\left(\\frac1{r_2}-\\frac1{r_1}\\right)', x: ['Find the work done by gravity when a 1000 kg satellite is raised from the Earth’s surface (6370 km) to an orbit of radius 6770 km (GM = 3.99 × 10¹⁴ m³ s⁻²).', ['W = GMm(1/r₂ − 1/r₁) = 3.99 × 10¹⁷ × (1/6.77 × 10⁶ − 1/6.37 × 10⁶).', '= 3.99 × 10¹⁷ × (−9.28 × 10⁻⁹) = −3.7 × 10⁹ J.', 'Gravity is conservative, so any route gives the same answer; air resistance along the way would not be.'], '−3.7 × 10⁹ J'], c: ['What is ∮B·dl round a long straight wire carrying current I?', 'μ₀I.'] }]
  ],
  m: [
    ['Leaving out r′(t) in the integrand.', 'The integrand is F(r(t))·r′(t).'],
    ['Calling a field conservative from zero curl on a region with a hole.', 'Check whether loops can wind round the hole.'],
    ['Missing the function g(y, z) when finding a potential.', 'The “constant” can depend on the other variables.']
  ]
});

WL.gd('m-vector-spaces', {
  h: 'A vector space is any collection that can be added and scaled consistently: arrows, but also polynomials, matrices, solutions of linear differential equations and quantum states. Basis and dimension, linear maps, kernels and images work the same way in all of them. Treating functions as vectors, with an inner product defined by an integral, is the step that leads to Fourier series and quantum mechanics.',
  s: [
    ['Axioms and examples', [
      'A **vector space** is closed under addition and scaling and obeys the usual rules, with a zero vector. A **subspace** is a subset that is itself a vector space; the quick test is that it contains 0 and is closed under addition and scaling.'
    ], { n: 0, e: 'a\\mathbf u+b\\mathbf v\\in V\\quad\\text{for all }\\mathbf u,\\mathbf v\\in V', x: ['Which are vector spaces: polynomials of degree exactly 2; of degree at most 2; solutions of y″ − 4y = 0; solutions of y″ − 4y = 1?', ['Degree exactly 2: no, since x² + (−x²) = 0 has no degree 2.', 'Degree at most 2: yes.', 'y″ − 4y = 0: yes; sums and multiples of solutions are solutions.', 'y″ − 4y = 1: no; adding two solutions gives a solution of y″ − 4y = 2, and 0 is not a solution.'], 'only the second and third'], c: ['What is the quickest test for a subspace?', 'It contains 0 and is closed under addition and scaling.'] }],
    ['Span, independence and basis', [
      'Vectors are **linearly independent** if no combination of them is zero except the trivial one. A **basis** is an independent set that spans the space; all bases have the same size, the **dimension**.'
    ], { n: 1, e: '\\sum c_i\\mathbf v_i = \\mathbf 0\\ \\Rightarrow\\ c_i = 0', x: ['Do 1 + x, 1 − x and x² form a basis for polynomials of degree at most 2? Find the coordinates of 3 + x + 2x².', ['If a(1 + x) + b(1 − x) + cx² = 0 for all x, then a + b = 0, a − b = 0 and c = 0: independent.', 'Three independent vectors in a 3-dimensional space form a basis.', 'For 3 + x + 2x²: a + b = 3, a − b = 1, c = 2, so the coordinates are (2, 1, 2).'], 'yes; (2, 1, 2)'], c: ['What is the dimension of the space of 2 × 2 matrices?', '4.'] }],
    ['Linear maps, kernels and images', [
      'A map T is **linear** if T(au + bv) = aT(u) + bT(v). Its **kernel** (what it sends to 0) and **image** (all its outputs) are subspaces, and their dimensions add up to the dimension of the domain.'
    ], { n: 2, e: '\\dim\\ker T+\\dim\\operatorname{im}T = \\dim V', x: ['Differentiation maps polynomials of degree at most 3 to themselves. Find its kernel and image and check rank + nullity.', ['Kernel: polynomials with zero derivative, the constants: dimension 1.', 'Image: all polynomials of degree at most 2: dimension 3.', '1 + 3 = 4, the dimension of the domain.'], 'kernel: constants; image: degree ≤ 2'], c: ['Is differentiation linear?', 'Yes: (au + bv)′ = au′ + bv′.'] }],
    ['Inner products', [
      'An **inner product** generalises the dot product and gives lengths and angles. For functions on an interval, ⟨f, g⟩ = ∫fg dx, so functions can be perpendicular.'
    ], { n: 3, e: '\\langle f,g\\rangle = \\int_a^bf(x)\\,g(x)\\,dx', x: ['On [−1, 1], show that 1 and x are orthogonal, and make x² orthogonal to 1.', ['⟨1, x⟩ = ∫₋₁¹ x dx = 0.', '⟨x², 1⟩ = 2/3 and ⟨1, 1⟩ = 2, so subtract (2/3)/2 = ⅓: x² − ⅓.', 'Up to a factor this is the Legendre polynomial P₂(x) = (3x² − 1)/2.'], 'x² − ⅓'], c: ['Why are sin nx and sin mx useful on [−π, π]?', 'They are orthogonal for n ≠ m, which is the basis of Fourier series.'] }],
    ['Why it matters in physics', [
      'Solutions of linear equations form vector spaces, so they can be superposed. Quantum states form a complex vector space; observables are linear maps, and measurement probabilities are squared inner products.',
      'Superposition belongs to linear equations only: large water waves and turbulent air do not simply add.'
    ], { n: 4, e: '|\\psi\\rangle = \\sum_ic_i|i\\rangle,\\qquad P_i = |c_i|^2', x: ['A qubit is in the state (|0⟩ + 2i|1⟩)/√5. Check it is normalised and find the probability of measuring 1.', ['⟨ψ|ψ⟩ = (1 + |2i|²)/5 = (1 + 4)/5 = 1.', 'P(1) = |2i/√5|² = 4/5.'], 'normalised; P(1) = 4/5'], c: ['Why can solutions of a linear equation be superposed?', 'They form a vector space.'] }]
  ],
  m: [
    ['Calling a set a vector space without checking that it contains 0.', 'Check 0, sums and scalar multiples.'],
    ['Confusing independence with orthogonality.', 'Orthogonal non-zero vectors are independent, but not every independent set is orthogonal.'],
    ['Using the dimension of the target in rank + nullity.', 'It is the dimension of the domain.']
  ]
});

WL.gd('m-matrices', {
  h: 'A matrix represents a linear map: its columns are the images of the basis vectors. Composition is multiplication, the determinant is the volume scale factor (and multiplies), and the inverse undoes the map when the determinant is not zero. Gaussian elimination solves systems and reveals the rank, the number of independent directions that survive.',
  s: [
    ['Linear maps and their matrices', [
      'The matrix of a linear map has T(e₁), T(e₂), … as its columns. Composition S∘T has matrix ST, with T acting first.'
    ], { n: 0, e: 'T(\\mathbf e_j) = \\text{column }j', x: ['Find the matrix that rotates 3D space by 90° about the z-axis.', ['e₁ = (1, 0, 0) goes to (0, 1, 0); e₂ goes to (−1, 0, 0); e₃ stays at (0, 0, 1).', 'These are the columns: (0 −1 0; 1 0 0; 0 0 1).'], '(0 −1 0; 1 0 0; 0 0 1)'], c: ['In the product ST, which map acts first?', 'T.'] }],
    ['Determinants', [
      'The determinant is the signed volume of the image of the unit cube. It changes sign if two columns swap, is zero if two columns are equal, and multiplies: det(AB) = det A det B.'
    ], { n: 1, e: '\\det(AB) = \\det A\\,\\det B', x: ['Find the determinant of A = (2 1 0; 1 3 1; 0 1 2) and say what it means.', ['Expand along the first row: 2(3 × 2 − 1 × 1) − 1(1 × 2 − 1 × 0) + 0 = 10 − 2 = 8.', 'The map multiplies volumes by 8 and keeps orientation.'], '8'], c: ['If det A = 8 and det B = −½, what is det(AB)?', '−4.'] }],
    ['Inverses and systems', [
      'A is invertible exactly when det A ≠ 0. Gaussian elimination reduces the system step by step to a triangular one, solved from the bottom up.'
    ], { n: 2, e: 'A^{-1} = \\frac{\\operatorname{adj}A}{\\det A}', x: ['Solve x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2 by elimination.', ['Row 2 − 2 × row 1: −3y − z = −9. Row 3 − row 1: y − 2z = −4.', 'Then y = 2z − 4, so −3(2z − 4) − z = −9, giving z = 3, y = 2 and x = 1.', 'Check: 2 − 2 + 3 = 3 and 1 + 4 − 3 = 2.'], 'x = 1, y = 2, z = 3'], c: ['When does Ax = b have exactly one solution for every b?', 'When det A ≠ 0.'] }],
    ['Rank', [
      'The **rank** is the number of independent columns (or rows): the dimension of the image. If it is less than n, the solutions of Ax = 0 form a whole subspace.',
      'A small determinant is not itself a warning sign, since it changes with the scale of the matrix. The real measure of trouble is the condition number, from the singular values.'
    ], { n: 3, e: '\\operatorname{rank}A+\\dim\\ker A = n', x: ['Find the rank of (1 2 3; 2 4 6; 1 0 1) and the solutions of Ax = 0.', ['Row 2 is twice row 1; row 3 is not a multiple of row 1. So the rank is 2.', 'Rank + nullity = 3, so the solutions form a line.', 'x + z = 0 and x + 2y + 3z = 0 give the direction (1, 1, −1).'], 'rank 2; the line through (1, 1, −1)'], c: ['Is a tiny determinant on its own a sign of trouble?', 'No; use the condition number, the ratio of the largest to the smallest singular value.'] }],
    ['Orthogonal matrices and change of basis', [
      'Orthogonal matrices (QᵀQ = I) preserve lengths and angles: rotations and reflections. In a new basis, with change-of-basis matrix P, the same map has matrix P⁻¹AP, and a good basis can make it diagonal.'
    ], { n: 4, e: 'A\' = P^{-1}AP', x: ['A = (2 1; 1 2). Find its matrix in the basis b₁ = (1, 1), b₂ = (1, −1).', ['Ab₁ = (3, 3) = 3b₁ and Ab₂ = (1, −1) = 1 × b₂.', 'So in this basis the matrix is (3 0; 0 1).', 'The right basis turns the map into two simple stretches: the idea behind eigenvectors.'], '(3 0; 0 1)'], c: ['What does QᵀQ = I mean geometrically?', 'Q keeps lengths and angles: it is a rotation or a reflection.'] }]
  ],
  m: [
    ['Multiplying matrices in the wrong order.', 'In ST, T acts first.'],
    ['Expecting a unique solution when det A = 0.', 'There is either none or infinitely many.'],
    ['Reading a small determinant as “nearly singular”.', 'Use the condition number.']
  ]
});

WL.gd('m-eigen', {
  h: 'An eigenvector of a matrix is a direction the map does not turn: Av = λv. The eigenvalues come from det(A − λI) = 0, and in a basis of eigenvectors the matrix becomes diagonal, so powers, exponentials and long-term behaviour become easy. For symmetric matrices the eigenvectors are perpendicular and the eigenvalues real; for coupled oscillators they are the normal modes.',
  s: [
    ['Definition', [
      'Along an **eigenvector** v the map is just a stretch by the **eigenvalue** λ. A negative λ reverses the direction; complex eigenvalues mean there is no real direction left unturned, as for a rotation.'
    ], { n: 0, e: 'A\\mathbf v = \\lambda\\mathbf v', x: ['Is (1, 2) an eigenvector of A = (3 1; 2 2)? Is (1, 1)?', ['A(1, 2) = (5, 6), not a multiple of (1, 2): no.', 'A(1, 1) = (4, 4) = 4(1, 1): yes, with λ = 4.'], 'no; yes, with λ = 4'], c: ['Why has a 90° rotation of the plane no real eigenvectors?', 'It turns every direction; its eigenvalues are ±i.'] }],
    ['Finding them', [
      '(A − λI)v = 0 has a non-zero solution only if det(A − λI) = 0, the **characteristic equation**. For each root, solve for v. The eigenvalues add to the trace and multiply to the determinant: a quick check.'
    ], { n: 1, e: '\\det(A-\\lambda I) = 0,\\qquad \\operatorname{tr}A = \\sum\\lambda_i,\\quad \\det A = \\prod\\lambda_i', x: ['Find the eigenvalues and eigenvectors of A = (3 1; 2 2).', ['det(A − λI) = (3 − λ)(2 − λ) − 2 = λ² − 5λ + 4 = 0, so λ = 1 or 4.', 'λ = 4 gives v = (1, 1); λ = 1 gives v = (1, −2).', 'Check: 1 + 4 = 5, the trace; 1 × 4 = 4, the determinant.'], 'λ = 4 with (1, 1); λ = 1 with (1, −2)'], c: ['What do the trace and determinant tell you?', 'The sum and the product of the eigenvalues.'] }],
    ['Diagonalisation', [
      'With n independent eigenvectors as the columns of P, A = PDP⁻¹ with D diagonal. Powers become easy, and in the long run the largest eigenvalue dominates.'
    ], { n: 2, e: 'A = PDP^{-1},\\qquad A^n = PD^nP^{-1}', x: ['For the same A, find A¹⁰(3, 0).', ['Write (3, 0) = 2(1, 1) + 1(1, −2).', 'Each part is just stretched: A¹⁰(3, 0) = 2 × 4¹⁰(1, 1) + 1¹⁰(1, −2).', '= (2 097 153, 2 097 150): the λ = 4 direction dominates.'], '(2 097 153, 2 097 150)'], c: ['Why might a matrix not be diagonalisable?', 'A repeated eigenvalue may lack enough independent eigenvectors, as for (1 1; 0 1).'] }],
    ['Symmetric matrices', [
      'A real symmetric matrix has real eigenvalues and perpendicular eigenvectors (the **spectral theorem**). Inertia and stress tensors and quantum observables are of this kind, which is why their eigenvalues are real, measurable numbers.'
    ], { n: 3, e: 'A = QDQ^{\\mathsf T}', x: ['Find the principal axes of the symmetric matrix (5 2; 2 2).', ['λ² − 7λ + 6 = 0, so λ = 6 or 1: both real.', 'Eigenvectors: (2, 1) for 6 and (1, −2) for 1. They are perpendicular.', 'In these axes the matrix is diagonal. For an inertia matrix, these are the axes a body can spin about without wobbling.'], 'along (2, 1) and (1, −2)'], c: ['Why are quantum observables represented by Hermitian matrices?', 'So that their eigenvalues, the possible measured values, are real.'] }],
    ['Normal modes', [
      'For small oscillations Mẍ = −Kx, trying x = v e^(iωt) gives Kv = ω²Mv: the squared frequencies are eigenvalues and the eigenvectors are the **normal modes**.',
      'The eigenvalue method is exact, but the spring model it is applied to may not be.'
    ], { n: 4, e: 'K\\mathbf v = \\omega^2M\\mathbf v', x: ['Model CO₂ as O–C–O joined by two equal springs. The stretching modes have ω² = k/m_O (symmetric) and ω² = k(1/m_O + 2/m_C) (antisymmetric). Predict their frequency ratio and compare with the measured 2349 and 1388 cm⁻¹.', ['Ratio of ω²: 1 + 2m_O/m_C = 1 + 32/12 = 3.67, so the predicted frequency ratio is √3.67 = 1.91.', 'Measured: 2349/1388 = 1.69.', 'The springs model misses by 13%: real bonds affect each other, and the symmetric stretch is shifted by a resonance with another vibration.'], 'predicted 1.91, measured 1.69'], c: ['Two equal masses are joined by three equal springs between two walls. What are the modes?', 'Moving together, ω² = k/m; moving oppositely, ω² = 3k/m.'] }]
  ],
  m: [
    ['Treating an eigenvector as unique.', 'Any non-zero multiple is also an eigenvector.'],
    ['Assuming every matrix can be diagonalised.', 'Check for enough independent eigenvectors.'],
    ['Writing det(A) − λ instead of det(A − λI).', 'Subtract λ along the diagonal first.']
  ]
});

WL.gd('m-svd', {
  h: 'Orthogonality makes linear algebra computable. Projecting onto a subspace gives the closest point in it; Gram–Schmidt builds orthonormal bases; least squares fits a model by projecting the data onto the space of possible predictions. The singular value decomposition writes any matrix as rotate, stretch, rotate, and reveals its rank, its conditioning and its best low-rank approximations.',
  s: [
    ['Orthogonal projection', [
      'The closest point to b on the line through a is the projection (a·b/a·a)a, and what is left over is perpendicular to the line. The same idea projects onto any subspace.'
    ], { n: 0, e: '\\operatorname{proj}_{\\mathbf a}\\mathbf b = \\frac{\\mathbf a\\cdot\\mathbf b}{\\mathbf a\\cdot\\mathbf a}\\,\\mathbf a', x: ['Find the point on the line through the origin in direction (1, 1, 1) closest to b = (2, 0, 1), and its distance from b.', ['a·b = 3 and a·a = 3, so the projection is (1, 1, 1).', 'Leftover: b − (1, 1, 1) = (1, −1, 0), perpendicular to a.', 'Distance: √2.'], '(1, 1, 1); √2'], c: ['What two properties does a projection matrix P have?', 'P² = P and Pᵀ = P.'] }],
    ['Gram–Schmidt', [
      'Take vectors one at a time, subtract their components along the orthonormal vectors already found, and normalise. The result spans the same space; in matrix form, A = QR.'
    ], { n: 1, e: 'A = QR', x: ['Make (1, 1, 0) and (1, 0, 1) orthonormal.', ['q₁ = (1, 1, 0)/√2.', 'Subtract the part of (1, 0, 1) along q₁: (1, 0, 1) − (½, ½, 0) = (½, −½, 1).', 'Normalise: q₂ = (1, −1, 2)/√6. Check: q₁·q₂ = 0.'], 'q₁ = (1, 1, 0)/√2, q₂ = (1, −1, 2)/√6'], c: ['What does R record in A = QR?', 'The coefficients that rebuild the original columns from the orthonormal ones.'] }],
    ['Least squares', [
      'An overdetermined system Ax ≈ b has no exact solution; minimising the squared error gives the **normal equations** AᵀAx = Aᵀb. It is the best fit when the errors are independent, normally distributed, of equal size and only in y; otherwise it can mislead.'
    ], { n: 2, e: 'A^{\\mathsf T}A\\,\\hat{\\mathbf x} = A^{\\mathsf T}\\mathbf b', x: ['Fit y = a + bx to the points (0, 1), (1, 3), (2, 4), (3, 4).', ['Normal equations: 4a + 6b = 12 and 6a + 14b = 23.', 'So b = 1 and a = 1.5: y = 1.5 + x.', 'The residuals are −0.5, 0.5, 0.5, −0.5: they add to zero but follow a curved pattern, a hint that a straight line is the wrong model.'], 'y = 1.5 + x, with patterned residuals'], c: ['What does least squares assume about the errors?', 'Independent, normal, equal in size and only in y.'] }],
    ['The singular value decomposition', [
      'Every matrix factorises as A = UΣVᵀ: rotate, stretch along the axes by the **singular values**, rotate again. The squared singular values are the eigenvalues of AᵀA; the number of non-zero ones is the rank, and their ratio is the **condition number**.'
    ], { n: 3, e: 'A = U\\Sigma V^{\\mathsf T},\\qquad \\kappa = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}', x: ['Find the singular values and condition number of A = (3 0; 4 5).', ['AᵀA = (25 20; 20 25), with eigenvalues 45 and 5.', 'Singular values: √45 = 6.71 and √5 = 2.24. Check: their product, 15, equals |det A|.', 'Condition number: 6.71/2.24 = 3, a well-behaved matrix.'], '6.71 and 2.24; κ = 3'], c: ['What does a huge condition number warn of?', 'Small errors in the data can cause large errors in the solution.'] }],
    ['Low-rank approximation and PCA', [
      'Keeping only the k largest singular values gives the best rank-k approximation, with error σₖ₊₁. Applied to data, this is **principal component analysis**: the leading singular vectors are the directions of greatest variance.'
    ], { n: 4, e: '\\|A-A_k\\| = \\sigma_{k+1}', x: ['A data matrix has singular values 50, 20, 2 and 0.5. How good is its best rank-2 approximation?', ['The error, in the largest-stretch sense, is σ₃ = 2.', 'Of the total Σσ² = 2904, the two largest keep 2900: 99.9%.', 'This is how image compression and principal component analysis keep almost everything while discarding most of the numbers.'], 'error 2; 99.9% kept'], c: ['What are the leading singular vectors of a centred data matrix?', 'The directions of greatest variance: the principal components.'] }]
  ],
  m: [
    ['Solving the normal equations for an ill-conditioned matrix.', 'Use QR or the SVD instead.'],
    ['Forgetting to normalise in Gram–Schmidt.', 'Divide each new vector by its length.'],
    ['Fitting a line without looking at the residuals.', 'A pattern in them means the model is wrong.']
  ]
});
WL.gd('m-ode2', {
  h: 'Linear second-order equations with constant coefficients describe springs, pendulums, circuits and every system near a stable equilibrium. Trying y = e^(λx) turns them into a quadratic whose roots decide everything: exponential decay, oscillation, or the boundary between them. A driving force adds a particular solution, and near the natural frequency it produces resonance.',
  s: [
    ['The characteristic equation', [
      'For ay″ + by′ + cy = 0, try y = e^(λx): this gives aλ² + bλ + c = 0. Two real roots give Ae^(λ₁x) + Be^(λ₂x); a repeated root gives (A + Bx)e^(λx); complex roots α ± iβ give e^(αx)(A cos βx + B sin βx).'
    ], { n: 0, e: 'a\\lambda^2+b\\lambda+c = 0', x: ['Solve y″ − y′ − 6y = 0 with y(0) = 0 and y′(0) = 5.', ['λ² − λ − 6 = (λ − 3)(λ + 2) = 0, so λ = 3 or −2.', 'y = Ae^(3x) + Be^(−2x), with A + B = 0 and 3A − 2B = 5.', 'A = 1 and B = −1: y = e^(3x) − e^(−2x).'], 'y = e^(3x) − e^(−2x)'], c: ['What is the general solution when λ is a repeated root?', '(A + Bx)e^(λx).'] }],
    ['Damping', [
      'For mẍ + bẋ + kx = 0, write ω₀² = k/m and γ = b/m. If b² < 4mk the motion oscillates inside a decaying envelope e^(−γt/2) (**underdamped**); b² = 4mk is **critical damping**, the fastest return without overshoot; larger b creeps back (**overdamped**).',
      'All of this assumes small amplitudes. At large amplitude a real pendulum or spring becomes non-linear, and its frequency starts to depend on the amplitude.'
    ], { n: 1, e: '\\ddot x+\\gamma\\dot x+\\omega_0^2x = 0,\\qquad \\omega_d = \\sqrt{\\omega_0^2-\\gamma^2/4}', x: ['A 2.0 kg mass on a spring of stiffness 50 N m⁻¹ has damping b = 8.0 N s m⁻¹. Classify the motion and find its frequency.', ['ω₀ = √(50/2) = 5 rad s⁻¹ and γ = 8/2 = 4 s⁻¹.', 'b² = 64 is less than 4mk = 400: underdamped. (Critical damping would need b = 20 N s m⁻¹.)', 'ω_d = √(25 − 4) = 4.58 rad s⁻¹, inside an envelope e^(−2t).'], 'underdamped, ω_d = 4.58 rad s⁻¹'], c: ['Why are car suspensions designed close to critical damping?', 'They then settle fastest without bouncing.'] }],
    ['Forced oscillations', [
      'With a driving term, the general solution is the complementary function plus any particular integral. Try a particular integral shaped like the forcing; if that shape already solves the unforced equation, multiply it by t.'
    ], { n: 2, e: 'x = x_{\\text{cf}}+x_{\\text{pi}}', x: ['Find particular solutions of ẍ + 4x = 3 cos t and of ẍ + 4x = cos 2t.', ['For 3 cos t, try A cos t: −A + 4A = 3, so x = cos t.', 'cos 2t already solves ẍ + 4x = 0, so try t times a sinusoid: x = (t/4) sin 2t works.', 'That solution grows steadily: driving at the natural frequency, with no damping, gives resonance.'], 'cos t and (t/4) sin 2t'], c: ['What is the general solution of a forced linear equation?', 'The complementary function plus a particular integral.'] }],
    ['Resonance and Q', [
      'The **quality factor** Q = ω₀/γ measures how sharp a resonance is: the peak response is about Q times the static one, the resonance is about ω₀/Q wide, and a struck oscillator rings for about Q/π cycles.'
    ], { n: 3, e: 'Q = \\frac{\\omega_0}{\\gamma}', x: ['A string vibrates at 196 Hz with Q ≈ 1500. Roughly how long does it ring, and how narrow is its resonance?', ['It rings for about Q/π ≈ 480 cycles: about 2.4 s.', 'Its resonance width is about f/Q = 196/1500 ≈ 0.13 Hz.'], 'about 2.4 s; about 0.13 Hz'], c: ['What happens to an undamped oscillator driven exactly at ω₀?', 'Its response grows without limit, like t sin ω₀t.'] }],
    ['Circuits', [
      'An RLC circuit obeys Lq̈ + Rq̇ + q/C = V(t): the same equation, with inductance for mass, resistance for damping and 1/C for stiffness. Tuning a radio adjusts C to bring ω₀ = 1/√(LC) onto a station’s frequency.'
    ], { n: 4, e: '\\omega_0 = \\frac1{\\sqrt{LC}}', x: ['A circuit has L = 0.10 mH and C = 250 pF. What frequency does it tune to, and what resistance would make it critically damped?', ['ω₀ = 1/√(10⁻⁴ × 2.5 × 10⁻¹⁰) = 6.32 × 10⁶ rad s⁻¹, so f = 1.01 MHz, in the medium-wave band.', 'Critical damping needs R² = 4L/C, so R = 2√(L/C) = 1.26 kΩ.'], '1.01 MHz; 1.26 kΩ'], c: ['Which mechanical quantities match L, R and 1/C?', 'Mass, the damping constant and the spring stiffness.'] }]
  ],
  m: [
    ['Forgetting the x in (A + Bx)e^(λx) for a repeated root.', 'A repeated root needs both terms.'],
    ['Trying a particular integral that already solves the unforced equation.', 'Multiply the trial by t.'],
    ['Applying the initial conditions to the particular integral alone.', 'Apply them to the full solution.']
  ]
});

WL.gd('m-ode-systems', {
  h: 'A system x′ = Ax of linear differential equations is solved by the eigenvectors of A: along each one the motion is pure exponential growth, decay or rotation. The eigenvalues classify the equilibrium as a node, saddle, spiral or centre, and the phase portrait shows every trajectory at once. Near an equilibrium of a nonlinear system, the Jacobian matrix takes the role of A.',
  s: [
    ['Solving x′ = Ax', [
      'If Av = λv, then x = e^(λt)v is a solution. With enough independent eigenvectors, the general solution is a sum of such terms, with the constants fixed by the starting point.'
    ], { n: 0, e: '\\mathbf x(t) = \\sum_ic_ie^{\\lambda_it}\\mathbf v_i', x: ['Solve x′ = (1 2; 2 1)x with x(0) = (3, 1).', ['Eigenvalues 3 and −1, with eigenvectors (1, 1) and (1, −1).', 'x(0) = 2(1, 1) + 1(1, −1).', 'x(t) = 2e^(3t)(1, 1) + e^(−t)(1, −1).'], '2e^(3t)(1, 1) + e^(−t)(1, −1)'], c: ['What does each eigenvector give?', 'A straight-line solution that grows or shrinks as e^(λt).'] }],
    ['Classifying equilibria', [
      'In two dimensions the trace τ and determinant Δ decide: Δ < 0 gives a **saddle**; Δ > 0 gives a **node** if τ² > 4Δ and a **spiral** if τ² < 4Δ; the sign of τ says whether it is stable (negative) or unstable.'
    ], { n: 1, e: '\\tau = \\operatorname{tr}A,\\qquad \\Delta = \\det A', x: ['Classify the origin for A = (0 1; −4 −1).', ['τ = −1 and Δ = 4.', 'τ² = 1 < 4Δ = 16: a spiral. τ < 0: stable.', 'This is the damped oscillator x″ + x′ + 4x = 0 written as a system.'], 'a stable spiral'], c: ['What does Δ < 0 always give?', 'A saddle, which is unstable.'] }],
    ['Phase portraits', [
      'Plot trajectories in the plane of the two variables. A second-order equation becomes a system by using the velocity as the second variable, so a pendulum’s motion becomes a curve in the (angle, angular velocity) plane.'
    ], { n: 2, x: ['Write the pendulum θ″ = −(g/l) sin θ as a system and describe its phase portrait.', ['With ω = θ′: θ′ = ω and ω′ = −(g/l) sin θ.', 'Near θ = 0 the trajectories are closed loops: swinging.', 'Near θ = π they form a saddle (balancing upside down); far out they become wavy lines that never close: the pendulum whirls over the top.'], 'loops, a saddle, and whirling lines'], c: ['How does a second-order equation become a first-order system?', 'Use the velocity as a second variable.'] }],
    ['Nonlinear systems', [
      'Find the equilibria, compute the Jacobian matrix of partial derivatives at each, and classify it. Saddles, nodes and spirals survive the nonlinear terms; centres are delicate, because the neglected terms decide whether nearby orbits close.'
    ], { n: 3, e: 'J = \\left(\\frac{\\partial f_i}{\\partial x_j}\\right)', x: ['A damped pendulum obeys θ′ = ω, ω′ = −sin θ − 0.5ω. Classify its equilibria at (0, 0) and (π, 0).', ['At (0, 0): J = (0 1; −1 −0.5), with τ = −0.5 and Δ = 1. τ² < 4Δ: a stable spiral.', 'At (π, 0): J = (0 1; 1 −0.5), with Δ = −1: a saddle.', 'So it settles hanging down, spiralling in; balancing upright is unstable.'], 'stable spiral; saddle'], c: ['Why are centres of a linearisation unreliable?', 'The neglected nonlinear terms decide whether nearby orbits close or spiral.'] }],
    ['Predator and prey', [
      'The Lotka–Volterra model has a centre and a conserved quantity, so populations cycle for ever with sizes set by the starting values.',
      'That prediction is fragile: any small extra effect, such as limited food for the prey, turns the centre into a spiral. Real population cycles, like those of Canadian lynx and hares, are better described by models with a stable limit cycle.'
    ], { n: 4, e: 'x\' = x(a-by),\\qquad y\' = y(cx-d)', x: ['For x′ = x(1 − 0.5y), y′ = y(0.25x − 0.75), with prey x and predators y, find the equilibrium and its type.', ['Equilibrium: y = 2 and x = 3.', 'The Jacobian there is (0 −1.5; 0.5 0): trace 0, determinant 0.75. A centre, with period about 2π/√0.75 = 7.3.', 'The model predicts endless cycles, but a centre is the most fragile kind of equilibrium.'], '(3, 2), a centre'], c: ['What is a limit cycle?', 'An isolated closed orbit that nearby trajectories approach (or move away from).'] }]
  ],
  m: [
    ['Classifying by the eigenvalues’ signs without checking for complex values.', 'Complex eigenvalues mean rotation: a spiral or centre.'],
    ['Trusting a centre found by linearising.', 'Check the nonlinear terms.'],
    ['Forgetting to fix the constants from the starting point.', 'Write x(0) in terms of the eigenvectors.']
  ]
});

WL.gd('m-laplace', {
  h: 'The Laplace transform turns a linear differential equation with constant coefficients into an algebraic equation, with the initial conditions built in. Solve for the transform, split it into partial fractions and read the answer from a table. Switch-ons, impulses and convolutions become simple products, and the poles of the transform show at once whether a system is stable.',
  s: [
    ['Definition and table', [
      'F(s) = ∫₀^∞ e^(−st) f(t) dt, for s large enough. A short table covers most needs, and the transform is linear.'
    ], { n: 0, e: '\\mathcal L\\{e^{at}\\} = \\frac1{s-a},\\qquad \\mathcal L\\{\\sin\\omega t\\} = \\frac{\\omega}{s^2+\\omega^2},\\qquad \\mathcal L\\{1\\} = \\frac1s', x: ['Find the Laplace transform of f(t) = 3 + 2e^(−t) − sin 2t.', ['By linearity, transform each term.', '3/s + 2/(s + 1) − 2/(s² + 4).'], '3/s + 2/(s + 1) − 2/(s² + 4)'], c: ['For which s does the transform of e^(at) exist?', 's > a.'] }],
    ['Derivatives', [
      'Integration by parts shows that differentiation becomes multiplication by s, with the initial conditions appearing automatically.'
    ], { n: 1, e: '\\mathcal L\\{f\'\\} = sF-f(0),\\qquad \\mathcal L\\{f\'\'\\} = s^2F-sf(0)-f\'(0)', x: ['Solve y″ + 3y′ + 2y = 0 with y(0) = 1 and y′(0) = 0.', ['Transform: s²Y − s + 3(sY − 1) + 2Y = 0, so Y = (s + 3)/((s + 1)(s + 2)).', 'Partial fractions: Y = 2/(s + 1) − 1/(s + 2).', 'y = 2e^(−t) − e^(−2t). Check: y(0) = 1 and y′(0) = 0.'], 'y = 2e^(−t) − e^(−2t)'], c: ['What is the transform of f′?', 'sF(s) − f(0).'] }],
    ['Steps and impulses', [
      'A switch-on at t = a, u(t − a), transforms to e^(−as)/s; delaying any function by a multiplies its transform by e^(−as). A sharp kick, the impulse δ(t − a), transforms to e^(−as).'
    ], { n: 2, e: '\\mathcal L\\{u(t-a)\\} = \\frac{e^{-as}}{s},\\qquad \\mathcal L\\{\\delta(t-a)\\} = e^{-as}', x: ['A capacitor with time constant 2 s obeys v′ + v/2 = u(t − 1)/2: a 1 V supply switched on at t = 1 s, starting uncharged. Find v(t).', ['Transform: (s + ½)V = e^(−s)/(2s), so V = e^(−s) × [1/s − 1/(s + ½)].', 'Without the delay this is 1 − e^(−t/2); the e^(−s) delays it by 1 s.', 'v = 0 before t = 1 s, then v = 1 − e^(−(t − 1)/2).'], 'v = 1 − e^(−(t − 1)/2) for t ≥ 1'], c: ['What is the transform of a unit impulse at t = 0?', '1.'] }],
    ['Convolution and transfer functions', [
      'The transform of a convolution is the product of the transforms. For a linear system starting at rest, output = H(s) × input, where the **transfer function** H(s) is the transform of the response to an impulse.'
    ], { n: 3, e: '\\mathcal L\\{f*g\\} = F(s)\\,G(s)', x: ['A system’s impulse response is e^(−t). Find its response to a unit step.', ['H(s) = 1/(s + 1); the step transforms to 1/s.', 'Output: 1/(s(s + 1)) = 1/s − 1/(s + 1).', 'So the response is 1 − e^(−t).'], '1 − e^(−t)'], c: ['What is the transfer function?', 'The transform of the impulse response.'] }],
    ['Poles and stability', [
      'A pole of the transform at s = a contributes e^(at). All poles in the left half-plane mean decay (stable); poles on the imaginary axis mean sustained oscillation; any pole in the right half-plane means growth.',
      'This is a small-signal statement. Real amplifiers saturate, so a linearly unstable circuit often settles into a steady oscillation of fixed size, which is how every electronic oscillator works.'
    ], { n: 4, e: 'H(s) = \\frac1{s^2+2s+5}:\\quad s = -1\\pm2i', x: ['A system has H(s) = 1/(s² + 2s + 5). Is it stable, and what is its impulse response?', ['Poles: s = −1 ± 2i, in the left half-plane: stable.', 'H = 1/((s + 1)² + 4), whose inverse is ½e^(−t) sin 2t.', 'A decaying oscillation at 2 rad s⁻¹.'], 'stable; ½e^(−t) sin 2t'], c: ['What does a pole in the right half-plane mean?', 'A growing exponential: the system is unstable.'] }]
  ],
  m: [
    ['Forgetting the initial conditions when transforming derivatives.', 'L{f′} = sF − f(0).'],
    ['Inverting before splitting into partial fractions.', 'Split first, then use the table term by term.'],
    ['Leaving out the step function after a delay.', 'A delayed response is zero before the switch-on.']
  ]
});
