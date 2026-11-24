/* Geodesic step-by-step guides, stage msf (built from src/guide/msf-*.js) */
WL.gd('m-special', {
  h: 'Sines and cosines, Legendre polynomials, Bessel functions, Hermite functions: the named functions of physics share one reason for existing. Each family is the set of modes of a self-adjoint (Sturm–Liouville) operator, the infinite-dimensional cousin of a Hermitian matrix. So each family has real eigenvalues, mutually orthogonal members and the power to expand any reasonable function.',
  s: [
    ['Self-adjoint form', [
      'The Sturm–Liouville form is (py′)′ + qy + λwy = 0, with p > 0 and a **weight** w > 0. Any second-order linear equation a y″ + b y′ + c y + λd y = 0 can be brought to this form by multiplying by the integrating factor μ = exp(∫b/a dx)/a.'
    ], { n: 0, e: '(py\')\'+qy+\\lambda wy = 0', x: ['Put Laguerre’s equation xy″ + (1 − x)y′ + ny = 0 into Sturm–Liouville form. What are p, w and λ?', ['Here a = x and b = 1 − x, so μ = (1/x)exp∫(1 − x)/x dx = (1/x)e^(ln x − x) = e⁻ˣ.', 'Multiplying through: xe⁻ˣy″ + (1 − x)e⁻ˣy′ + ne⁻ˣy = 0, which is (xe⁻ˣy′)′ + ne⁻ˣy = 0.', 'So p = xe⁻ˣ, w = e⁻ˣ and λ = n.'], 'p = xe⁻ˣ, w = e⁻ˣ, λ = n'], c: ['Why does this form matter?', 'In it the operator is self-adjoint, which guarantees real eigenvalues and orthogonal modes.'] }],
    ['Boundary conditions', [
      'Self-adjointness also needs the boundary term [p(uv′ − vu′)] to vanish at both ends. Fixed values, fixed slopes, mixed or periodic conditions all do this, and so does an end where p = 0, provided solutions stay finite there.',
      'The boundary conditions are part of the physics. A pipe closed at one end and open at the other has only odd harmonics, in the ratios 1 : 3 : 5. A clarinet’s low register comes close, but its even harmonics are weak rather than absent: the bore is not a perfect cylinder, and the bell and tone holes change the end conditions.'
    ], { n: 1, e: '-y\'\' = \\lambda y,\\qquad y(0) = 0,\\quad y\'(L) = 0', x: ['Find the eigenvalues and modes of −y″ = λy on [0, L] with y(0) = 0 and y′(L) = 0: something fixed at one end and free at the other.', ['y(0) = 0 leaves y = sin(√λ x).', 'y′(L) = 0 needs cos(√λ L) = 0, so √λ L = (n − ½)π.', 'λₙ = ((n − ½)π/L)²: frequencies in the ratios 1 : 3 : 5 : ⋯, odd harmonics only.'], 'λₙ = ((n − ½)π/L)²'], c: ['What is required at an end where p = 0?', 'Only that solutions stay finite there; the boundary term then vanishes by itself.'] }],
    ['Real eigenvalues and orthogonal modes', [
      'Integrating by parts shows each λ is real and that modes with different λ are orthogonal with weight w. The eigenvalues can be ordered λ₁ < λ₂ < ⋯ → ∞, and the nth mode has n − 1 zeros.'
    ], { n: 2, e: '\\int y_my_n\\,w\\,dx = 0\\qquad(m\\ne n)', x: ['The first two Laguerre polynomials are L₀ = 1 and L₁ = 1 − x. Check that they are orthogonal with the weight from step 1.', ['The weight is e⁻ˣ on (0, ∞).', '∫₀^∞ (1)(1 − x)e⁻ˣ dx = ∫₀^∞ e⁻ˣ dx − ∫₀^∞ xe⁻ˣ dx = 1 − 1 = 0.', 'Without the weight the integral would diverge: the weight is part of the inner product.'], 'orthogonal: the integral is 0'], c: ['How many zeros does the fifth mode have?', 'Four.'] }],
    ['Completeness and expansions', [
      'A reasonable function can be expanded as f = Σcₙyₙ, with cₙ = ∫fyₙw dx / ∫yₙ²w dx. The series converges in the mean-square sense; at a jump the partial sums overshoot by about 9% of the jump however many terms are kept (the **Gibbs phenomenon**).'
    ], { n: 3, e: 'c_n = \\frac{\\int f\\,y_n\\,w\\,dx}{\\int y_n^2\\,w\\,dx}', x: ['Expand f(x) = 1 on (0, π) in the modes sin nx, and check the series at x = π/2.', ['cₙ = ∫₀^π sin nx dx ÷ ∫₀^π sin² nx dx = [(1 − cos nπ)/n] ÷ (π/2).', 'So cₙ = 4/(nπ) for odd n and 0 for even n.', 'At x = π/2 the series must give 1: (4/π)(1 − ⅓ + ⅕ − ⋯) = 1, which is Leibniz’s series π/4 = 1 − ⅓ + ⅕ − ⋯.'], 'f = (4/π)(sin x + ⅓ sin 3x + ⅕ sin 5x + ⋯)'], c: ['Does the series give 1 at x = 0?', 'No: every term is 0 there, the average of the values on either side of the jump (−1 and 1 for the odd extension).'] }],
    ['The Rayleigh quotient', [
      'The lowest eigenvalue is the minimum of R = ∫(py′² − qy²) dx / ∫wy² dx over functions obeying the boundary conditions. So any trial function gives an upper bound, often a very good one: the variational principle behind much of quantum chemistry.'
    ], { n: 4, e: '\\lambda_1\\le\\frac{\\int(py\'^2-qy^2)\\,dx}{\\int wy^2\\,dx}', x: ['A circular drum of radius 1 has its lowest mode governed by (ry′)′ + λry = 0 with y(1) = 0. Estimate λ₁ with the trial function y = 1 − r².', ['Here p = w = r and q = 0. Numerator: ∫₀¹ r(−2r)² dr = 1.', 'Denominator: ∫₀¹ r(1 − r²)² dr = ½ − ½ + ⅙ = ⅙. So R = 6.', 'The exact value is j₀₁² = 2.405² = 5.783: the bound is 3.7% high, and the frequency (∝ √λ) only 1.9% high.'], 'λ₁ ≤ 6 (exactly 5.783)'], c: ['Why does every trial function give an upper bound?', 'Expanded in the true modes, R is a weighted average of eigenvalues, all of them at least λ₁.'] }]
  ],
  m: [
    ['Leaving out the weight in orthogonality integrals.', 'Include w: r for drums, e⁻ˣ for Laguerre.'],
    ['Calling an operator self-adjoint without checking the ends.', 'The boundary term must vanish for the allowed functions.'],
    ['Expecting the overshoot at a jump to die away with more terms.', 'The Gibbs overshoot stays at about 9%; it only narrows.']
  ]
});

WL.gd('m-frobenius', {
  h: 'Most special functions are born as power series solving a second-order linear differential equation. At an ordinary point a Taylor series always works. At a regular singular point, where the coefficients blow up mildly, Frobenius’s method y = Σaₙx^(n+r) works, with the exponent r fixed by the indicial equation. And demanding that a series stay finite is often what quantises a physical quantity.',
  s: [
    ['Ordinary and singular points', [
      'For y″ + P(x)y′ + Q(x)y = 0, a point is **ordinary** if P and Q are analytic there; then two power-series solutions exist, converging at least out to the nearest singular point in the complex plane. It is a **regular singular point** if (x − x₀)P and (x − x₀)²Q are analytic.'
    ], { n: 0, e: 'y\'\'+P(x)\\,y\'+Q(x)\\,y = 0', x: ['Classify x = 1 for Legendre’s equation (1 − x²)y″ − 2xy′ + l(l + 1)y = 0, and find the radius of convergence of series about x = 0.', ['Dividing by 1 − x²: P = −2x/(1 − x²) and Q = l(l + 1)/(1 − x²), both infinite at x = ±1.', '(x − 1)P = 2x/(1 + x) and (x − 1)²Q = −(x − 1)l(l + 1)/(1 + x) are finite at x = 1: a regular singular point.', 'The nearest singular points to 0 are ±1, so series about 0 converge at least for |x| < 1.'], 'regular singular; radius 1'], c: ['Where must you look for the singular points that limit convergence?', 'Anywhere in the complex plane, not just on the real axis.'] }],
    ['Series at an ordinary point', [
      'Substitute y = Σaₙxⁿ, shift indices so that every sum has the same power, and equate coefficients. The result is a **recurrence relation** for the coefficients.'
    ], { n: 1, e: 'a_{n+2} = -\\frac{a_n}{(n+2)(n+1)}', x: ['Solve y″ + y = 0 by power series and recognise the result.', ['y″ = Σ(n + 2)(n + 1)a_(n+2)xⁿ, so (n + 2)(n + 1)a_(n+2) + aₙ = 0.', 'With a₀ = 1, a₁ = 0: a₂ = −½, a₄ = 1/24, …, giving 1 − x²/2! + x⁴/4! − ⋯ = cos x.', 'With a₀ = 0, a₁ = 1: x − x³/3! + ⋯ = sin x. The method rebuilds known functions, and builds new ones in the same way.'], 'cos x and sin x'], c: ['How many free constants does the recurrence leave?', 'Two, a₀ and a₁: one for each independent solution.'] }],
    ['The indicial equation', [
      'At a regular singular point try y = Σaₙx^(n+r) with a₀ ≠ 0. The lowest power gives the **indicial equation** r(r − 1) + p₀r + q₀ = 0, with p₀ = lim xP and q₀ = lim x²Q. If its roots differ by a whole number, the second solution may contain a logarithm.'
    ], { n: 2, e: 'r(r-1)+p_0r+q_0 = 0', x: ['Find the indicial exponents of x²y″ + xy′ + (x² − ¼)y = 0 (Bessel’s equation of order ½), and the solutions.', ['p₀ = 1 and q₀ = −¼, so r² − ¼ = 0: r = ±½.', 'For r = ½ the recurrence is n(n + 1)aₙ = −a_(n−2), giving √x(1 − x²/6 + x⁴/120 − ⋯) = sin x/√x.', 'For r = −½ it gives cos x/√x. The roots differ by 1, yet no logarithm appears: the warning is only a possibility.'], 'sin x/√x and cos x/√x'], c: ['Where do p₀ and q₀ come from?', 'p₀ = lim xP and q₀ = lim x²Q at the singular point.'] }],
    ['Where special functions come from', [
      'Each family is the series solution of one equation, named by its singular points: Legendre’s at ±1, Bessel’s at 0, Hermite’s from the harmonic oscillator, the hypergeometric equation at 0, 1 and ∞. Near a regular singular point, solutions behave like powers x^r, or like logarithms when the exponents coincide.'
    ], { n: 3, e: 'Y_0(x)\\approx\\frac2\\pi\\Big(\\ln\\frac x2+\\gamma\\Big)', x: ['Bessel’s equation of order 0 has a double indicial root. What does its second solution look like near x = 0, and why is that physically sensible?', ['With order 0 the indicial equation is r² = 0: one series, J₀, and a second solution containing J₀ ln x.', 'Near 0 this is Y₀ ≈ (2/π)(ln(x/2) + γ), with γ = 0.5772.', 'Close to the axis the wave equation looks like Laplace’s equation in two dimensions, whose radial solutions are 1 and ln r: the potential of a uniform line charge.'], 'logarithmic, like the potential of a line charge'], c: ['Which equation has regular singular points at 0, 1 and ∞?', 'The hypergeometric equation.'] }],
    ['Termination and quantisation', [
      'Often a series diverges at a physical boundary unless it stops. Demanding that it stop picks out special parameter values: whole numbers l for Legendre, quantised energies in quantum mechanics.',
      'Real molecules test the harmonic model. It predicts equally spaced vibrational levels, so the first overtone of HCl should be at twice the fundamental, 2 × 2886 = 5772 cm⁻¹. It is measured at 5668 cm⁻¹, 1.8% lower, because real bonds soften as they stretch (anharmonicity).'
    ], { n: 4, e: 'a_{k+2} = \\frac{2(k-n)}{(k+2)(k+1)}\\,a_k', x: ['For the quantum harmonic oscillator, ψ = y(x)e^(−x²/2) with y″ − 2xy′ + 2ny = 0, where E = (n + ½)ħω. Why must n be a whole number?', ['The series for y obeys the recurrence above.', 'If it never stops, then for large k, a_(k+2)/a_k ≈ 2/k, like the coefficients of e^(x²); ψ then grows like e^(x²/2) and cannot be normalised.', 'The series stops only if n is a whole number: E = (n + ½)ħω, equally spaced levels.'], 'n = 0, 1, 2, …, so E = (n + ½)ħω'], c: ['Which physical requirement quantises the energy here?', 'That ψ can be normalised, which forces the series to stop.'] }]
  ],
  m: [
    ['Assuming a series about 0 converges everywhere.', 'It converges only up to the nearest singular point, real or complex.'],
    ['Expecting a logarithm whenever the indicial roots differ by a whole number.', 'It may or may not appear; check.'],
    ['Accepting a series solution that does not terminate.', 'Check how it grows at the boundary or at infinity.']
  ]
});

WL.gd('m-gamma', {
  h: 'The Gamma function extends the factorial from whole numbers to every real and complex number: Γ(n + 1) = n!, and Γ(½) = √π. It appears whenever an integral mixes powers and exponentials, which in physics is constantly: Maxwell–Boltzmann averages, black-body radiation, the volumes of spheres in any dimension, and Stirling’s formula for huge factorials.',
  s: [
    ['Definition and recursion', [
      'Γ(z) = ∫₀^∞ t^(z−1)e⁻ᵗ dt for Re z > 0. One integration by parts gives Γ(z + 1) = zΓ(z), and with Γ(1) = 1 this reproduces the factorials. Many integrals become Gamma functions after a substitution.'
    ], { n: 0, e: '\\Gamma(z) = \\int_0^\\infty t^{z-1}e^{-t}\\,dt,\\qquad \\Gamma(z+1) = z\\,\\Gamma(z)', x: ['Evaluate ∫₀^∞ x⁵e^(−x²) dx.', ['Substitute t = x², so dx = dt/(2√t) and x⁵ = t^(5/2).', 'The integral becomes ½∫₀^∞ t²e⁻ᵗ dt = ½Γ(3).', 'Γ(3) = 2! = 2, so the integral is 1.'], '1'], c: ['What is Γ(6)?', '5! = 120.'] }],
    ['Half-integers', [
      'Substituting t = u² turns Γ(½) into the Gaussian integral, so Γ(½) = √π. The recursion then gives Γ(3/2) = √π/2, Γ(5/2) = 3√π/4, and so on: these appear in every average over a Maxwell–Boltzmann distribution.'
    ], { n: 1, e: '\\int_0^\\infty v^ne^{-av^2}dv = \\frac{\\Gamma\\big(\\frac{n+1}{2}\\big)}{2a^{(n+1)/2}}', x: ['Find the mean speed of nitrogen molecules at 300 K, using f ∝ v²e^(−av²) with a = m/(2k_BT).', ['⟨v⟩ = ∫v³e^(−av²) dv ÷ ∫v²e^(−av²) dv = [Γ(2)/(2a²)] ÷ [Γ(3/2)/(2a^(3/2))].', 'With Γ(2) = 1 and Γ(3/2) = √π/2: ⟨v⟩ = 2/√(πa) = √(8k_BT/(πm)).', 'For N₂ (m = 4.65 × 10⁻²⁶ kg): ⟨v⟩ = 476 m/s. Molecular-beam experiments with rotating velocity selectors (Miller and Kusch, 1955) confirmed this distribution closely.'], '476 m/s'], c: ['What is Γ(7/2)?', '(5/2)(3/2)(1/2)√π = 15√π/8.'] }],
    ['Continuation to the left', [
      'Running the recursion backwards, Γ(z) = Γ(z + 1)/z, extends Γ to negative non-integers. It has simple poles at 0, −1, −2, … and is never zero. The **reflection formula** links z and 1 − z.'
    ], { n: 2, e: '\\Gamma(z)\\,\\Gamma(1-z) = \\frac{\\pi}{\\sin\\pi z}', x: ['Find Γ(−3/2), and check it with the reflection formula.', ['Backwards twice: Γ(−3/2) = Γ(−½)/(−3/2) = Γ(½)/((−½)(−3/2)) = (4/3)√π ≈ 2.363.', 'Reflection with z = −3/2: Γ(−3/2)Γ(5/2) should equal π/sin(−3π/2) = π.', '(4√π/3)(3√π/4) = π. ✓'], '4√π/3 ≈ 2.363'], c: ['Can Γ(z) ever be zero?', 'No: 1/Γ is finite everywhere, so Γ never vanishes.'] }],
    ['The Beta function', [
      'Integrals of the form ∫₀¹ t^(a−1)(1 − t)^(b−1) dt, or ∫₀^(π/2) sinᵖθ cos^qθ dθ, are Beta functions, expressible through Gamma functions.'
    ], { n: 3, e: 'B(a,b) = \\int_0^1t^{a-1}(1-t)^{b-1}dt = \\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}', x: ['Evaluate ∫₀^(π/2) sin⁴θ cos²θ dθ.', ['∫₀^(π/2) sin^(2a−1)θ cos^(2b−1)θ dθ = ½B(a, b); here a = 5/2 and b = 3/2.', 'B(5/2, 3/2) = Γ(5/2)Γ(3/2)/Γ(4) = (3√π/4)(√π/2)/6 = π/16.', 'Half of that: π/32 ≈ 0.098.'], 'π/32'], c: ['What is B(1, 1)?', '1: the integral of 1 over (0, 1).'] }],
    ['Stirling’s formula', [
      'For large n, n! ≈ √(2πn)(n/e)ⁿ. Its logarithm, ln n! ≈ n ln n − n, is the backbone of statistical mechanics, where n is around 10²³.'
    ], { n: 4, e: '\\ln n!\\approx n\\ln n-n+\\tfrac12\\ln(2\\pi n)', x: ['How many digits does 100! have?', ['log₁₀ 100! ≈ ½ log₁₀(200π) + 100 log₁₀(100/e).', '= 1.399 + 156.57 = 157.97.', 'So 100! ≈ 9.3 × 10¹⁵⁷, which has 158 digits.'], '158'], c: ['For n = 10²³, how much does the ½ln(2πn) term matter?', 'It is about 27, against n ln n ≈ 5 × 10²⁴: utterly negligible.'] }],
    ['Uses in physics', [
      'The volume of a unit ball in n dimensions is π^(n/2)/Γ(n/2 + 1). It peaks at n = 5 and then shrinks towards zero, and in high dimensions almost all of the volume lies near the surface. That is the geometric reason why a thin energy shell and a full energy ball give the same thermodynamics.'
    ], { n: 5, e: 'V_n = \\frac{\\pi^{n/2}}{\\Gamma\\big(\\frac n2+1\\big)}', x: ['Find the volumes of unit balls in 4 and 10 dimensions, and the fraction of a ball’s volume in its outer 10% of radius in 10 and in 100 dimensions.', ['V₄ = π²/Γ(3) = π²/2 = 4.93; V₁₀ = π⁵/Γ(6) = π⁵/120 = 2.55.', 'Volume scales as rⁿ, so the inner 90% of the radius holds 0.9ⁿ of the volume.', 'Outer shell: 1 − 0.9¹⁰ = 65% in 10 dimensions, and 1 − 0.9¹⁰⁰ = 99.997% in 100.'], '4.93 and 2.55; 65% and 99.997%'], c: ['In which dimension is the unit ball’s volume largest?', 'n = 5, with V₅ = 5.26.'] }]
  ],
  m: [
    ['Writing Γ(n) = n!.', 'Γ(n + 1) = n!.'],
    ['Using the integral definition where Re z ≤ 0.', 'Continue with Γ(z) = Γ(z + 1)/z.'],
    ['Forgetting the ½ in ∫₀^(π/2) sin^(2a−1) cos^(2b−1) = ½B(a, b).', 'Write out the substitution t = sin²θ to see it.']
  ]
});

WL.gd('m-erf', {
  h: 'The Gaussian e^(−x²) has no elementary antiderivative, yet its total integral is exactly √π. Naming its partial integral, the error function, gives a tool used everywhere: normal probabilities, diffusion and heat flow after a sudden change, and the tail probabilities that decide whether a physics signal counts as a discovery.',
  s: [
    ['The Gaussian integral', [
      'Square the integral, treat it as an integral over the plane and switch to polar coordinates: I² = π. Rescaling gives ∫e^(−ax²) dx = √(π/a), and differentiating with respect to a gives every moment.'
    ], { n: 0, e: '\\int_{-\\infty}^{\\infty}e^{-ax^2}dx = \\sqrt{\\frac{\\pi}{a}}', x: ['Find ∫x²e^(−ax²) dx over the whole line, and hence the variance of a normal distribution.', ['Differentiate both sides with respect to a: −∫x²e^(−ax²) dx = −½√π a^(−3/2).', 'So ∫x²e^(−ax²) dx = √π/(2a^(3/2)). Dividing by √(π/a): ⟨x²⟩ = 1/(2a).', 'For a normal distribution a = 1/(2σ²), so ⟨x²⟩ = σ², as the name “standard deviation” promises.'], '√π/(2a^(3/2)); ⟨x²⟩ = σ²'], c: ['Why do polar coordinates help?', 'The area element r dr dθ supplies the factor r that makes e^(−r²) integrable in closed form.'] }],
    ['The error function', [
      'erf(x) = (2/√π)∫₀ˣ e^(−t²) dt rises from 0 to 1 and is odd; erfc = 1 − erf. Its Taylor series converges for every x, quickly when x is small.'
    ], { n: 1, e: '\\mathrm{erf}(x) = \\frac{2}{\\sqrt\\pi}\\sum_{n=0}^\\infty\\frac{(-1)^nx^{2n+1}}{n!\\,(2n+1)}', x: ['Find erf(0.5) from the series.', ['The terms of the sum: 0.5 − 0.0417 + 0.0031 − 0.0002 + ⋯ = 0.4613.', 'Multiply by 2/√π = 1.1284.', 'erf(0.5) = 0.5205, correct to four figures after four terms.'], '0.5205'], c: ['What is erf(∞)?', '1: the factor 2/√π normalises it.'] }],
    ['Normal probabilities', [
      'For a normal variable, the probability of lying within kσ of the mean is erf(k/√2): 68.3%, 95.4% and 99.7% for k = 1, 2, 3. One-sided tails are ½erfc(k/√2): 1.35 × 10⁻³ at 3σ, and 2.9 × 10⁻⁷ at 5σ, particle physics’ discovery standard.'
    ], { n: 2, e: 'P(\\text{beyond }k\\sigma) = \\tfrac12\\,\\mathrm{erfc}\\big(k/\\sqrt2\\big)', x: ['A search looks for a bump at 100 independent masses. What is the chance that pure noise gives a 3σ excess somewhere?', ['At each mass, P(≥ 3σ) = 1.35 × 10⁻³.', 'P(at least one) = 1 − (1 − 0.00135)¹⁰⁰ = 0.126: about one chance in eight.', 'This is the **look-elsewhere effect**. In 2015 ATLAS saw a two-photon bump at 750 GeV with a local significance of 3.9σ, but only about 2σ once the effect was included; it vanished in the 2016 data.'], 'about 13%'], c: ['Why is 5σ demanded rather than 3σ?', 'Many searches, many places to look and imperfectly known errors make 3σ flukes common.'] }],
    ['Diffusion from a step', [
      'The diffusion (or heat) equation has no built-in length scale, so a solution starting from a sharp step depends only on η = x/(2√(Dt)), and turns out to be an error function. The profile keeps its shape while its width grows as √t.'
    ], { n: 3, e: 'T = T_0\\,\\mathrm{erf}\\Big(\\frac{z}{2\\sqrt{\\kappa t}}\\Big)', x: ['In 1862 Kelvin assumed the Earth began uniformly hot, about 3900 °C above today’s surface temperature, and has cooled only by conduction. Estimate its age from the surface gradient, about 0.036 K/m, with κ = 1.2 × 10⁻⁶ m²/s.', ['Differentiate the profile at z = 0: G = T₀/√(πκt), so t = T₀²/(πκG²).', 't = 3900²/(π × 1.2 × 10⁻⁶ × 0.036²) = 3.1 × 10¹⁵ s ≈ 100 million years: Kelvin’s own figure.', 'Radiometric dating gives 4.54 billion years, 45 times older. The mathematics was right; the hidden assumptions were wrong. The mantle convects (as Perry argued in 1895), carrying heat up far faster than conduction, and radioactivity, discovered in 1896, adds heat.'], 'about 100 million years (true age: 4.54 billion)'], c: ['How does the width of a diffusing step grow with time?', 'As √t: spreading twice as far takes four times as long.'] }],
    ['Large-x behaviour', [
      'Repeated integration by parts gives an **asymptotic series**. It diverges for every x, but cut off near its smallest term it is very accurate for large x.'
    ], { n: 4, e: '\\mathrm{erfc}(x)\\sim\\frac{e^{-x^2}}{x\\sqrt\\pi}\\Big(1-\\frac{1}{2x^2}+\\frac{3}{4x^4}-\\frac{15}{8x^6}+\\cdots\\Big)', x: ['Estimate erfc(3) from the asymptotic series (exactly 2.2090 × 10⁻⁵).', ['Leading factor: e⁻⁹/(3√π) = 2.3209 × 10⁻⁵.', 'Brackets: 1 − 1/18 + 3/324 − 15/5832 = 1 − 0.0556 + 0.0093 − 0.0026 = 0.9511.', 'erfc(3) ≈ 2.2075 × 10⁻⁵: 0.07% off with four terms. At x = 1 the same series is useless.'], '2.2075 × 10⁻⁵'], c: ['Why does adding more terms eventually make an asymptotic series worse?', 'Its terms shrink at first, then grow without limit; the best accuracy comes from stopping near the smallest term.'] }]
  ],
  m: [
    ['Using erf(k) for the probability within kσ.', 'It is erf(k/√2).'],
    ['Quoting a local significance as if it were global.', 'Correct for the number of places searched.'],
    ['Summing an asymptotic series as far as possible.', 'Stop near its smallest term.']
  ]
});

WL.gd('m-expint', {
  h: 'A handful of integrals that cannot be done in elementary terms keep reappearing: the exponential integral in radiative transfer and groundwater flow, the sine integral in filters and Fourier series, the Fresnel integrals in diffraction, and the Lambert W function wherever an unknown sits both inside and outside an exponential. Each has a small-argument series, a large-argument asymptotic form and a physical story.',
  s: [
    ['The exponential integral', [
      'E₁(x) = ∫ₓ^∞ e⁻ᵗ/t dt. For small x, E₁ ≈ −γ − ln x + x (γ = 0.5772); for large x it follows the asymptotic series (e⁻ˣ/x)(1 − 1/x + 2/x² − ⋯). It gives the fall in water level around a pumped well and the attenuation of radiation through a slab.'
    ], { n: 0, e: 'E_1(x) = \\int_x^\\infty\\frac{e^{-t}}{t}\\,dt', x: ['Estimate E₁(0.1) and E₁(10).', ['Small x: E₁(0.1) ≈ −0.5772 + 2.3026 + 0.1 = 1.825 (exactly 1.823).', 'Large x: E₁(10) ≈ (e⁻¹⁰/10)(1 − 0.1 + 0.02 − 0.006) = 4.150 × 10⁻⁶ (exactly 4.157 × 10⁻⁶).', 'Each form is excellent in its own range.'], '1.825 and 4.15 × 10⁻⁶'], c: ['Why does E₁ diverge as x → 0?', 'Near t = 0 the integrand behaves like 1/t, whose integral is a logarithm.'] }],
    ['Sine and cosine integrals', [
      'Si(x) = ∫₀ˣ sin t/t dt rises to a maximum Si(π) = 1.852 and settles to π/2. It is the step response of an ideal low-pass filter, and it produces the Gibbs overshoot of Fourier series.'
    ], { n: 1, e: 'y(t) = \\frac12+\\frac1\\pi\\operatorname{Si}(2\\pi f_ct)', x: ['An ideal low-pass filter with cutoff f_c responds to a unit step at t = 0 with the y(t) above. Find the largest output, and the output at t = −1/(2f_c).', ['The maximum is at 2πf_ct = π: y = ½ + 1.852/π = 1.090, a 9% overshoot.', 'At t = −1/(2f_c): y = ½ − 1.852/π = −0.090.', 'The output responds before the step arrives. An ideal “brick-wall” filter is not causal, so it cannot be built: real filters must have softer edges, as the Kramers–Kronig relations require.'], 'a peak of 1.09, and −0.09 before the step'], c: ['What does Si(x) tend to as x → ∞?', 'π/2.'] }],
    ['Fresnel integrals', [
      'C(x) = ∫₀ˣ cos(πt²/2) dt and S(x) = ∫₀ˣ sin(πt²/2) dt both tend to ½; plotted together they trace the **Cornu spiral**. They give the diffraction pattern of a straight edge: a quarter of the full intensity at the geometric shadow edge, and fringes outside it peaking at 1.37 times the unobstructed intensity.'
    ], { n: 2, e: 'v = x\\sqrt{\\frac{2}{\\lambda z}}', x: ['Light of wavelength 500 nm passes a straight edge and falls on a screen 2.0 m away. How far outside the geometric shadow is the first bright fringe?', ['The first maximum is at v ≈ 1.22 in the scaled variable v = x√(2/(λz)).', 'x = 1.22√(λz/2) = 1.22 × √(5.0 × 10⁻⁷ m²) = 0.86 mm.', 'Its intensity is 1.37 times the unobstructed value; inside the shadow the light fades smoothly away.'], 'about 0.86 mm'], c: ['What intensity falls exactly at the geometric shadow edge?', 'A quarter of the unobstructed intensity.'] }],
    ['The Lambert W function', [
      'W(x) solves We^W = x. It inverts any equation of the form “linear times exponential”: Wien’s law, the current in a diode with series resistance, and many models with exponential feedback.'
    ], { n: 3, e: 'x = 3+W\\big(-3e^{-3}\\big)', x: ['Per unit frequency, the black-body spectrum peaks where x = 3(1 − e⁻ˣ), with x = hν/k_BT. Solve it, and compare the Sun’s two “peaks” (T = 5772 K).', ['Rearranging, (x − 3)e^(x − 3) = −3e⁻³, so x = 3 + W(−3e⁻³) = 2.821.', 'ν_peak = 2.821k_BT/h = 3.39 × 10¹⁴ Hz, which corresponds to c/ν = 883 nm, in the infrared.', 'Per unit wavelength the peak is at 502 nm, in the green. Both are right: where the Sun “peaks” depends on whether the spectrum is plotted per frequency or per wavelength, a hidden assumption in many textbook statements.'], 'x = 2.821; 883 nm against 502 nm'], c: ['What is W(0)?', '0, since 0 × e⁰ = 0.'] }],
    ['Asymptotics and evaluation', [
      'Each function has a convergent series for small arguments and an asymptotic series for large ones; in between, continued fractions or numerical integration take over. Asymptotic series must be cut off near their smallest term, and they can be poor at moderate arguments.'
    ], { n: 4, e: 'E_1(x)\\sim\\frac{e^{-x}}{x}\\Big(1-\\frac{1}{x}+\\frac{2!}{x^2}-\\frac{3!}{x^3}+\\cdots\\Big)', x: ['How well can the asymptotic series give E₁(3), which is exactly 0.01305?', ['The terms in the brackets are 1, −0.333, 0.222, −0.222, 0.296, …: smallest around the third term, then growing.', 'Stopping after three terms: (e⁻³/3)(1 − 0.333 + 0.222) = 0.0148.', 'That is 13% high, and no cut-off does much better: at x = 3 the convergent series is the right tool.'], '0.0148: 13% off'], c: ['Where is the smallest term of a series whose terms are n!/xⁿ?', 'Near the term number n ≈ x.'] }]
  ],
  m: [
    ['Using the asymptotic form of E₁ at small x.', 'Use −γ − ln x + x there.'],
    ['Assuming an ideal brick-wall filter can be built.', 'A perfectly sharp cut-off violates causality.'],
    ['Quoting a spectrum’s peak without saying per what.', 'State whether it is per unit frequency or per unit wavelength.']
  ]
});

WL.gd('m-legendre', {
  h: 'Solve Laplace’s equation around a sphere with axial symmetry and the angular part forces a family of polynomials on you: the Legendre polynomials. They describe any field around a sphere as a sum of monopole, dipole, quadrupole and higher pieces, from electric fields to Earth’s gravity; with the azimuthal angle added they become the spherical harmonics of atomic orbitals and of the cosmic microwave background.',
  s: [
    ['From Laplace to Legendre', [
      'With no φ-dependence, separating V = R(r)Θ(θ) gives radial solutions rˡ and r^(−(l+1)), and an angular equation that becomes Legendre’s equation in x = cos θ. Its series solution diverges at the poles unless it stops, so l must be a whole number.'
    ], { n: 0, e: 'V = \\sum_l\\Big(A_lr^l+\\frac{B_l}{r^{l+1}}\\Big)P_l(\\cos\\theta)', x: ['The surface of a sphere of radius R is held at V₀cos²θ. Find the potential inside.', ['Write cos²θ in Legendre polynomials: cos²θ = ⅓P₀ + ⅔P₂(cos θ).', 'Inside, keep only rˡ (finite at the centre) and match at r = R: V = V₀[⅓ + ⅔(r/R)²P₂(cos θ)].', 'At the centre V = V₀/3, the average over the surface, as Laplace’s equation demands.'], 'V = V₀[⅓ + ⅔(r/R)²P₂(cos θ)]'], c: ['Outside the sphere, which radial functions would you keep?', 'r^(−(l+1)), which vanish at infinity.'] }],
    ['The polynomials', [
      'P₀ = 1, P₁ = x, P₂ = ½(3x² − 1), P₃ = ½(5x³ − 3x), …. P_l has degree l, l zeros in (−1, 1), parity (−1)ˡ and P_l(1) = 1. A three-term recurrence generates them all.'
    ], { n: 1, e: '(l+1)P_{l+1} = (2l+1)\\,xP_l-l\\,P_{l-1}', x: ['Use the recurrence to find P₄.', ['With l = 3: 4P₄ = 7x · ½(5x³ − 3x) − 3 · ½(3x² − 1).', '= ½(35x⁴ − 21x² − 9x² + 3) = ½(35x⁴ − 30x² + 3).', 'P₄ = (35x⁴ − 30x² + 3)/8. Check: P₄(1) = 8/8 = 1.'], 'P₄ = (35x⁴ − 30x² + 3)/8'], c: ['Is P₅ even or odd?', 'Odd: its parity is (−1)⁵.'] }],
    ['Orthogonality and expansions', [
      'Different P_l are orthogonal on (−1, 1), with ∫P_l² dx = 2/(2l + 1). Any reasonable function of θ can be expanded in them, with coefficients found by projection.'
    ], { n: 2, e: 'a_l = \\frac{2l+1}{2}\\int_{-1}^1f(x)\\,P_l(x)\\,dx', x: ['Find the first two non-zero Legendre coefficients of f(x) = |x|.', ['|x| is even, so only even l appear. a₀ = ½∫|x| dx = ½.', 'a₂ = (5/2) × 2∫₀¹ x · ½(3x² − 1) dx = (5/2)(¾ − ½) = 5/8.', 'So |x| ≈ ½ + (5/8)P₂(x). At x = 0 this gives 0.19 instead of 0: the kink makes the series converge slowly.'], 'a₀ = ½, a₂ = 5/8'], c: ['Expand x² in Legendre polynomials.', 'x² = ⅓P₀ + ⅔P₂.'] }],
    ['Multipole expansions', [
      'For r > a, 1/|r − a| = Σ(aˡ/r^(l+1))P_l(cos θ). So any charge distribution, seen from far away, is a monopole (∝ 1/r), plus a dipole (∝ cos θ/r²), plus a quadrupole (∝ P₂/r³), and so on.',
      'Earth’s gravity has a quadrupole term set by its flattening. Newton, assuming uniform density, predicted a flattening of 1/230; the measured value is 1/298, because density increases towards the centre.'
    ], { n: 3, e: '\\frac{1}{|\\mathbf r-\\mathbf a|} = \\sum_l\\frac{a^l}{r^{l+1}}P_l(\\cos\\theta)', x: ['Charges q sit at z = ±a and −2q at the origin: a linear quadrupole. Find the potential far away.', ['Add the expansions: qΣ[1 + (−1)ˡ](aˡ/r^(l+1))P_l − 2q/r.', 'l = 0 cancels (total charge zero) and l = 1 cancels (no dipole moment).', 'The leading term is l = 2: V = 2qa²P₂(cos θ)/(4πε₀r³).'], 'V ≈ 2qa²P₂(cos θ)/(4πε₀r³)'], c: ['How does a dipole’s potential fall with distance?', 'As 1/r².'] }],
    ['Spherical harmonics', [
      'Allowing φ-dependence gives the **spherical harmonics** Y_lᵐ(θ, φ) ∝ P_lᵐ(cos θ)e^(imφ), with 2l + 1 of them for each l. They are the angular parts of atomic orbitals and the language of the cosmic microwave background (CMB) sky, where multipole l probes angles of about 180°/l.'
    ], { n: 4, e: 'a_{lm} = \\int T(\\theta,\\varphi)\\,Y_l^{m*}(\\theta,\\varphi)\\,d\\Omega', x: ['We have only one sky. How precisely can the CMB power at l = 2 (the quadrupole) and at l = 200 ever be measured?', ['Each l has 2l + 1 independent coefficients a_lm, and the power is estimated from their average square.', 'The unavoidable relative error, the **cosmic variance**, is √(2/(2l + 1)): 63% at l = 2 and 7% at l = 200.', 'The measured quadrupole is lower than the standard cosmological model predicts, but cosmic variance makes the gap only modest in significance, and no second sky is available.'], '63% and 7%'], c: ['How many orbitals have l = 3?', '2l + 1 = 7.'] }]
  ],
  m: [
    ['Keeping r^(−(l+1)) terms inside a sphere.', 'They blow up at the centre; inside, keep rˡ.'],
    ['Leaving out the (2l + 1)/2 in the coefficients.', 'It comes from ∫P_l² dx = 2/(2l + 1).'],
    ['Treating a low-l CMB anomaly as a strong signal.', 'Allow for cosmic variance.']
  ]
});

WL.gd('m-bessel', {
  h: 'Whenever a wave or diffusion problem has circular or cylindrical symmetry, separating variables produces Bessel’s equation. Its solutions are the circular cousins of sines and cosines: they oscillate with slowly shrinking amplitude, and their zeros fix the frequencies of drums, the modes of optical fibres and the size of the smallest spot a lens can form.',
  s: [
    ['Bessel’s equation', [
      'Writing the 2D wave equation in polar coordinates and separating u = R(r)Φ(φ)T(t) gives cos nφ (n must be a whole number for u to be single-valued) and, with x = kr, Bessel’s equation of order n.'
    ], { n: 0, e: 'x^2y\'\'+xy\'+(x^2-n^2)y = 0', x: ['A circular membrane of radius 0.30 m has wave speed c = 100 m/s. Find the frequency of its fundamental, whose shape is J₀(kr).', ['The rim is fixed, so J₀(ka) = 0: ka = j₀₁ = 2.405.', 'f = ck/(2π) = c j₀₁/(2πa) = 100 × 2.405/(2π × 0.30).', 'f = 128 Hz.'], '128 Hz'], c: ['Why must n be a whole number for a full membrane?', 'Going once round must bring u back to itself.'] }],
    ['Two kinds of solution', [
      'The Frobenius method gives J_n(x), finite at the origin. The second solution Y_n(x) is infinite at x = 0, so it is discarded whenever the region includes the axis, but it is needed for rings, annuli and coaxial cables.'
    ], { n: 1, e: 'Y_0(x)\\approx\\frac2\\pi\\Big(\\ln\\frac x2+\\gamma\\Big)\\quad(x\\to0)', x: ['A coaxial cable has an inner conductor of radius 1 mm at V₀ and an outer one of radius 4 mm at 0. Find V(r) between them, and relate it to Y₀.', ['With no time dependence (k → 0) the radial solutions are 1 and ln r: the static limits of J₀ and Y₀.', 'Fitting the two conductors: V = V₀ ln(b/r)/ln(b/a).', 'At r = 2 mm: V = V₀ ln 2/ln 4 = V₀/2. The singular solution is allowed because the axis is not part of the region.'], 'V = V₀ ln(b/r)/ln(b/a)'], c: ['Why is Y_n excluded for a whole drum?', 'It is infinite at the centre, which is part of the drum.'] }],
    ['Shape and zeros', [
      'J₀(0) = 1 and J_n(0) = 0 for n ≥ 1. For large x, J_n(x) ≈ √(2/(πx)) cos(x − nπ/2 − π/4): a cosine whose amplitude falls as 1/√x, as wave energy spreads over larger circles. The zeros are unevenly spaced at first, but their spacing approaches π.'
    ], { n: 2, e: 'J_n(x)\\approx\\sqrt{\\frac{2}{\\pi x}}\\cos\\Big(x-\\frac{n\\pi}{2}-\\frac\\pi4\\Big)', x: ['Use the large-x form to estimate the first three zeros of J₀, and compare them with the exact 2.405, 5.520 and 8.654.', ['The zeros of cos(x − π/4) are x = (m − ¼)π.', 'm = 1, 2, 3 give 2.356, 5.498 and 8.639.', 'Errors: 2.0%, 0.4% and 0.2%. Even the first estimate is close, and they improve as x grows.'], '2.356, 5.498, 8.639'], c: ['Why does the amplitude fall like 1/√x?', 'The wave’s energy spreads round circles whose circumference grows like r.'] }],
    ['Useful identities', [
      'Neighbouring orders are linked by recurrences, which are how computers usually evaluate Bessel functions.',
      'There is a numerical trap. Running the recurrence upwards for n > x amplifies any tiny admixture of the growing solution Y_n, so the results become garbage; it must be run downwards (Miller’s algorithm).'
    ], { n: 3, e: 'J_{n+1}(x) = \\frac{2n}{x}J_n(x)-J_{n-1}(x)', x: ['From J₀(1) = 0.7652 and J₁(1) = 0.4401, find J₂(1). What happens if you keep going up to J₁₀(1)?', ['J₂(1) = 2 × 0.4401 − 0.7652 = 0.1149, which is correct.', 'Continuing upwards in double precision gives J₁₀(1) ≈ 1.2 × 10⁻⁹, but the true value is 2.6 × 10⁻¹⁰: 4.6 times too big.', 'Rounding errors excited the Y_n solution, which grows as n rises. Running downwards suppresses it instead.'], 'J₂(1) = 0.1149; going up to J₁₀ fails'], c: ['In which direction is the recurrence stable for n > x?', 'Downwards.'] }],
    ['Applications', [
      'A drum’s modes are J_n(j_nm r/a) cos nφ, with frequencies proportional to the zeros j_nm, which are not whole-number multiples of each other, so an ideal drum has no clear pitch. Diffraction by a circular aperture puts the first dark ring at sin θ = 1.22λ/D (the **Airy disc**), from the first zero of J₁.',
      'Real timpani show a revealing gap between model and data. The ideal membrane puts the modes that set the pitch, (1,1), (2,1), (3,1) and (4,1), in the ratios 1 : 1.34 : 1.67 : 1.98. The air in and around the kettle lowers them unequally, bringing them close to 2 : 3 : 4 : 5, which is why timpani have a definite pitch.'
    ], { n: 4, e: '\\sin\\theta = 1.22\\,\\frac{\\lambda}{D}', x: ['Find the diffraction limit of the Hubble Space Telescope (D = 2.4 m) at 500 nm.', ['θ = 1.22 × 500 × 10⁻⁹/2.4 = 2.5 × 10⁻⁷ rad.', 'In arcseconds: 2.5 × 10⁻⁷ × 206 265 = 0.052″.', 'Above the atmosphere Hubble reaches this limit; ground-based telescopes without adaptive optics are blurred by turbulence to about 1″.'], 'about 0.05 arcseconds'], c: ['Where does the 1.22 come from?', 'The first zero of J₁, 3.832, divided by π.'] }]
  ],
  m: [
    ['Leaving out the weight r in drum-mode orthogonality.', 'The integral is ∫J_n J_n r dr.'],
    ['Using Y_n where the axis is part of the region.', 'Discard it there.'],
    ['Running the Bessel recurrence upwards for n > x.', 'Run it downwards.']
  ]
});
WL.gd('m-bessel-modified', {
  h: 'Replace x by ix in Bessel’s equation and the oscillating functions J and Y turn into growing and decaying exponentials in disguise: the modified Bessel functions I and K. They describe screened fields, the magnetic field around a vortex in a superconductor and alternating current crowding to a wire’s surface. Combining J and Y another way gives the Hankel functions: outgoing and incoming cylindrical waves.',
  s: [
    ['The modified Bessel equation', [
      'Changing the sign of x² in Bessel’s equation gives the modified equation. Its solution I_ν(x) = i^(−ν)J_ν(ix) is finite at 0 and grows like eˣ; every term of its series is positive, so it never oscillates. K_ν decays like e⁻ˣ and is singular at 0.'
    ], { n: 0, e: 'x^2y\'\'+xy\'-(x^2+\\nu^2)y = 0', x: ['Evaluate I₀(1) from its series, Σ(x/2)^(2k)/(k!)².', ['With x = 1: 1 + ¼ + 1/64 + 1/2304 + ⋯.', '= 1 + 0.25 + 0.0156 + 0.0004 = 1.2661.', 'Every term is positive, so I₀ can never cross zero, unlike J₀, whose series has the same terms with alternating signs (J₀(1) = 0.7652).'], '1.2661'], c: ['How does K₀ behave close to x = 0?', 'Like −ln(x/2) − γ: logarithmically infinite.'] }],
    ['Where they appear', [
      'Wherever ∇²φ = φ/λ² meets cylindrical geometry: screening in plasmas and electrolytes, diffusion with decay, and London’s equation for magnetic fields in superconductors. The field of a line source is ∝ K₀(r/λ): logarithmic close to the line and exponentially small far away.'
    ], { n: 1, e: 'B = \\frac{\\Phi_0}{2\\pi\\lambda^2}K_0\\Big(\\frac{r}{\\lambda}\\Big)', x: ['A vortex in a superconductor carries a field B ∝ K₀(r/λ). How much weaker is it at r = 3λ than at r = λ? Compare an unscreened field falling as 1/r.', ['K₀(1) = 0.421 and K₀(3) = 0.0347.', 'The ratio is 0.083: 12 times weaker.', 'An unscreened field would fall only 3 times. Screening confines each vortex’s field to a tube about λ wide, which is why vortices can pack into a regular lattice, as decoration experiments first showed in 1967.'], '12 times weaker'], c: ['What sets the range of a screened field?', 'The screening length λ: beyond a few λ the field dies exponentially.'] }],
    ['Hankel functions', [
      'H_ν^(1) = J_ν + iY_ν and H_ν^(2) = J_ν − iY_ν behave as √(2/(πx))e^(±i(x − νπ/2 − π/4)): outgoing and incoming cylindrical waves. Their amplitude falls as 1/√r, so the power through any cylinder around the source is the same.'
    ], { n: 2, e: 'H_\\nu^{(1,2)}(x)\\approx\\sqrt{\\frac{2}{\\pi x}}\\,e^{\\pm i(x-\\nu\\pi/2-\\pi/4)}', x: ['A long, straight road acts as a line source of sound. By how many decibels does the level fall when you double your distance from it, compared with a point source?', ['Cylindrical wave: amplitude ∝ 1/√r, so intensity ∝ 1/r. Doubling r halves the intensity: −3 dB.', 'Spherical wave from a point source: intensity ∝ 1/r², so −6 dB per doubling.', 'Measured falls beside real roads are often larger than 3 dB, because soft ground absorbs sound and traffic is not a perfect line: the free-field model was a hidden assumption.'], '3 dB (point source: 6 dB)'], c: ['Why does a cylindrical wave’s amplitude fall as 1/√r?', 'Its energy spreads round a circumference ∝ r, so its intensity falls as 1/r.'] }],
    ['Asymptotics', [
      'For large x, I_ν ≈ eˣ/√(2πx) and K_ν ≈ √(π/(2x))e⁻ˣ, each with corrections in powers of 1/x. For small x, I_ν ≈ (x/2)^ν/Γ(ν + 1).'
    ], { n: 3, e: '\\frac{I_1(\\kappa)}{I_0(\\kappa)}\\approx1-\\frac{1}{2\\kappa}\\qquad(\\kappa\\gg1)', x: ['A dipole free to rotate only in a plane, in a field, has ⟨cos θ⟩ = I₁(κ)/I₀(κ), where κ = pE/k_BT. Find ⟨cos θ⟩ for small κ, and for κ = 1 and κ = 10.', ['Small κ: I₁ ≈ κ/2 and I₀ ≈ 1, so ⟨cos θ⟩ ≈ κ/2 (compare κ/3 for rotation in three dimensions).', 'κ = 1: I₁(1)/I₀(1) = 0.565/1.266 = 0.446, a little below κ/2.', 'κ = 10: the large-x forms give 1 − 1/(2κ) = 0.950; the exact value is 0.949.'], '≈ κ/2; 0.446; 0.949'], c: ['Why does the alignment grow linearly at first?', 'A weak field only slightly biases random orientations, so the response is proportional to the field.'] }],
    ['Skin effect', [
      'Alternating current in a wire obeys a diffusion equation with an imaginary coefficient, so the current density is a Bessel function of complex argument. When the **skin depth** δ = √(2ρ/(ωμ₀)) is much less than the radius, the current crowds into a surface layer about δ thick.'
    ], { n: 4, e: '\\delta = \\sqrt{\\frac{2\\rho}{\\omega\\mu_0}}', x: ['Find the skin depth in copper (ρ = 1.68 × 10⁻⁸ Ω m) at 50 Hz, 1 MHz and 1 GHz. How much does a 1 mm-radius wire’s resistance rise at 1 MHz?', ['δ = 9.2 mm at 50 Hz, 0.065 mm at 1 MHz and 2.1 μm at 1 GHz.', 'At 1 MHz the current uses a ring of area about 2πaδ instead of πa², so R_ac/R_dc ≈ a/(2δ) = 1/(2 × 0.065) ≈ 8.', 'That is why radio coils use stranded, insulated “Litz” wire, and why microwave parts are plated with silver or gold only microns thick.'], 'δ = 9.2 mm, 65 μm and 2.1 μm; about 8 times'], c: ['Does the skin effect matter for household wiring at 50 Hz?', 'Hardly: a 9 mm skin depth is larger than the radius of ordinary household wire.'] }]
  ],
  m: [
    ['Expecting I_ν to oscillate like J_ν.', 'All the terms of its series are positive.'],
    ['Using I for a field in a region that extends to infinity.', 'I grows; decaying fields use K.'],
    ['Ignoring the skin effect at high frequency.', 'Compare δ with the size of the conductor.']
  ]
});

WL.gd('m-spherical-bessel', {
  h: 'Separate the wave equation or the Schrödinger equation in spherical coordinates and the radial part gives spherical Bessel functions. Unlike ordinary Bessel functions they are elementary: sines and cosines divided by powers of x. They describe spherical cavities, quantum dots and nuclei, and above all scattering, where a plane wave is a sum of spherical waves of every angular momentum.',
  s: [
    ['Spherical Bessel functions', [
      'The radial equation x²y″ + 2xy′ + (x² − l(l + 1))y = 0 has solutions jₗ, regular at 0, and yₗ, singular there. j₀ = sin x/x and j₁ = sin x/x² − cos x/x. For small x, jₗ ≈ xˡ/(2l + 1)!!: the centrifugal barrier keeps waves with high l away from the centre.'
    ], { n: 0, e: 'j_l(x)\\approx\\frac{x^l}{(2l+1)!!}\\qquad(x\\to0)', x: ['Evaluate j₁(0.1) from the formula and compare with x/3. What goes wrong at x = 10⁻⁶ in double precision?', ['sin(0.1)/0.01 − cos(0.1)/0.1 = 9.98334 − 9.95004 = 0.03330, close to x/3 = 0.03333 (the next term, −x³/30, makes up the difference).', 'At x = 10⁻⁶ both terms are about 10⁶ while their difference is about 3 × 10⁻⁷: 12 of the 16 digits cancel.', 'The computed value is 3.3330 × 10⁻⁷ instead of 3.3333 × 10⁻⁷. Near 0, use the series.'], '0.03330; at 10⁻⁶ the formula loses 12 digits'], c: ['What is (2l + 1)!! for l = 2?', '5 × 3 × 1 = 15.'] }],
    ['Rayleigh’s formula', [
      'Every jₗ follows from j₀ by repeated differentiation, so each is a finite combination of sin x, cos x and powers of 1/x. The spherical Hankel functions hₗ = jₗ ± iyₗ behave as e^(±i(x − lπ/2))/x: outgoing and incoming spherical waves.'
    ], { n: 1, e: 'j_l(x) = (-x)^l\\Big(\\frac{1}{x}\\frac{d}{dx}\\Big)^l\\frac{\\sin x}{x}', x: ['Derive j₁ from j₀ using Rayleigh’s formula.', ['With l = 1: j₁ = −x · (1/x) d/dx(sin x/x) = −d/dx(sin x/x).', 'd/dx(sin x/x) = (x cos x − sin x)/x².', 'So j₁ = sin x/x² − cos x/x.'], 'j₁ = sin x/x² − cos x/x'], c: ['How does an outgoing spherical wave’s amplitude fall with r?', 'As 1/r, so its intensity falls as 1/r².'] }],
    ['The plane-wave expansion', [
      'A plane wave contains every angular momentum. A particle of momentum ħk passing at impact parameter b has angular momentum about kbħ, so only partial waves with l ≲ ka reach a target of radius a.'
    ], { n: 2, e: 'e^{ikr\\cos\\theta} = \\sum_{l=0}^\\infty(2l+1)\\,i^l\\,j_l(kr)\\,P_l(\\cos\\theta)', x: ['Which partial waves matter for a neutron hitting a nucleus of radius 5 fm at 10 MeV, and at 1 keV?', ['k = √(2mE)/ħ. At 10 MeV, pc = √(2 × 939.6 × 10) MeV = 137 MeV, so k = 137/197.3 fm⁻¹ = 0.69 fm⁻¹ and ka ≈ 3.5.', 'So l = 0 up to about 4 contribute, and the angular distribution has structure.', 'At 1 keV, ka ≈ 0.035: only l = 0 (s-waves) matters, and the scattering is the same in every direction.'], 'l up to about 4 at 10 MeV; only l = 0 at 1 keV'], c: ['Why do slow collisions scatter equally in all directions?', 'Only the l = 0 wave reaches the target, and it is spherically symmetric.'] }],
    ['Partial waves and phase shifts', [
      'Outside a short-range potential each partial wave is unchanged except for a **phase shift** δₗ. All scattering information sits in the δₗ, and each partial wave’s cross-section is limited by unitarity to at most (4π/k²)(2l + 1).'
    ], { n: 3, e: '\\sigma_l = \\frac{4\\pi}{k^2}(2l+1)\\sin^2\\delta_l', x: ['An attractive well happens to give δ₀ = π at some low energy, with every higher δₗ tiny. What is the cross-section there?', ['σ₀ = (4π/k²)sin²π = 0.', 'With the l ≥ 1 contributions small, the target is almost transparent.', 'This is the **Ramsauer–Townsend effect**: slow electrons, below about 1 eV, pass through argon, krypton and xenon atoms with a deep minimum in scattering, which no classical picture of a hard atom can explain.'], 'nearly zero'], c: ['What is the largest possible s-wave cross-section?', '4π/k², reached when δ₀ = π/2.'] }],
    ['Cavities and shells', [
      'In a spherical box of radius a, ψ ∝ jₗ(kr) with jₗ(ka) = 0: s-states at ka = π, 2π, …, the first p-state at ka = 4.493 and the first d-state at 5.763. These zeros set the levels of spherical cavities, quantum dots and the simplest model of a nucleus.'
    ], { n: 4, e: 'E_{nl} = \\frac{\\hbar^2x_{nl}^2}{2ma^2}', x: ['Fill a spherical box with nucleons, 2(2l + 1) per level, in order of the zeros of jₗ. Where are the shell closures, and how do they compare with the measured magic numbers 2, 8, 20, 28, 50, 82, 126?', ['Levels in order: 1s (3.14), 1p (4.49), 1d (5.76), 2s (6.28), 1f (6.99), 2p (7.73), 1g (8.18).', 'Running totals: 2, 8, 18, 20, 34, 40, 58; the largest energy gaps come after 2, 8, 20, 34 and 58.', 'So the box reproduces 2, 8 and 20, then predicts 34 and 58 where nature has 28 and 50. Mayer and Jensen (1949) fixed it with strong spin–orbit coupling, which splits each level and pushes its highest-j member down into the shell below.'], '2, 8 and 20; then the model fails'], c: ['What is the ratio of the lowest p-state energy to the lowest s-state energy in a spherical box?', '(4.493/π)² = 2.05.'] }]
  ],
  m: [
    ['Evaluating jₗ from its closed form at tiny x.', 'Use the series xˡ/(2l + 1)!! there.'],
    ['Including partial waves far beyond l ≈ ka.', 'They barely reach the target.'],
    ['Concluding from zero scattering that there is no potential.', 'δ₀ = π also gives zero s-wave scattering.']
  ]
});

WL.gd('m-hermite', {
  h: 'Near the bottom of any potential well the energy is approximately a parabola, so the quantum harmonic oscillator describes molecular vibrations, phonons and every mode of the electromagnetic field. Its stationary states are Gaussians times Hermite polynomials, and its energies are equally spaced, starting not at zero but at ħω/2.',
  s: [
    ['Natural units', [
      'Measure length in units of √(ħ/mω) and energy in units of ħω. The Schrödinger equation then has no constants left.'
    ], { n: 0, e: '\\xi = x\\sqrt{\\frac{m\\omega}{\\hbar}},\\qquad \\psi\'\'+(2\\varepsilon-\\xi^2)\\psi = 0', x: ['HCl vibrates at 2886 cm⁻¹ (ω = 5.44 × 10¹⁴ s⁻¹) with reduced mass 0.98 u. Find its natural length and energy units, and compare ħω with k_BT at room temperature.', ['√(ħ/mω) = 0.011 nm, about 9% of the bond length (0.127 nm): the zero-point jiggle is small but real.', 'ħω = 0.358 eV, while k_BT = 0.026 eV at 300 K.', 'So almost every molecule sits in its ground state: the vibrations are “frozen”. That is why diatomic gases at room temperature have molar heat capacity (5/2)R, not the classical (7/2)R.'], '0.011 nm; 0.36 eV, far above k_BT'], c: ['What are the units of ε?', 'None: it is the energy measured in units of ħω.'] }],
    ['Peeling off the Gaussian', [
      'For large |ξ| the solutions behave like e^(±ξ²/2); only the decaying one is acceptable. Writing ψ = h(ξ)e^(−ξ²/2) leaves Hermite’s equation for h.'
    ], { n: 1, e: 'h\'\'-2\\xi h\'+(2\\varepsilon-1)h = 0', x: ['Show that ψ = e^(−ξ²/2) is a solution, and find its energy.', ['ψ′ = −ξe^(−ξ²/2) and ψ″ = (ξ² − 1)e^(−ξ²/2).', 'Then ψ″ + (2ε − ξ²)ψ = (2ε − 1)e^(−ξ²/2), which vanishes only if ε = ½.', 'So the ground state has E = ½ħω: not zero, as the uncertainty principle demands.'], 'ε = ½, so E = ½ħω'], c: ['Why is e^(+ξ²/2) rejected?', 'It grows without limit and cannot be normalised.'] }],
    ['Quantisation', [
      'If the series for h does not stop, ψ grows like e^(ξ²/2). It stops only when 2ε − 1 = 2n, so E_n = (n + ½)ħω, and the terminating polynomials are the Hermite polynomials.',
      'The zero-point energy is measurable. H₂ and D₂ have identical chemistry, but D₂’s heavier atoms vibrate more slowly, so its ½ħω is lower, by 0.080 eV in the harmonic model. D₂ is indeed harder to break apart, by 0.078 eV; anharmonicity accounts for the rest.'
    ], { n: 2, e: 'E_n = \\hbar\\omega\\big(n+\\tfrac12\\big)', x: ['Check that ψ₁ = ξe^(−ξ²/2) is a solution, and find its energy.', ['ψ₁′ = (1 − ξ²)e^(−ξ²/2) and ψ₁″ = (ξ³ − 3ξ)e^(−ξ²/2).', 'ψ₁″ + (2ε − ξ²)ψ₁ = (2ε − 3)ξe^(−ξ²/2) = 0, so ε = 3/2.', 'E₁ = (3/2)ħω: one step of ħω above the ground state, with one node at the centre.'], 'E₁ = (3/2)ħω'], c: ['How many nodes does ψ_n have?', 'n.'] }],
    ['The polynomials', [
      'H₀ = 1, H₁ = 2ξ, H₂ = 4ξ² − 2, H₃ = 8ξ³ − 12ξ, H₄ = 16ξ⁴ − 48ξ² + 12. They follow from a recurrence, from Rodrigues’ formula or from the generating function e^(2ξt − t²), and they are orthogonal with weight e^(−ξ²).'
    ], { n: 3, e: 'H_{n+1} = 2\\xi H_n-2nH_{n-1}', x: ['Use the recurrence to find H₅.', ['With n = 4: H₅ = 2ξH₄ − 8H₃.', '= 2ξ(16ξ⁴ − 48ξ² + 12) − 8(8ξ³ − 12ξ) = 32ξ⁵ − 96ξ³ + 24ξ − 64ξ³ + 96ξ.', 'H₅ = 32ξ⁵ − 160ξ³ + 120ξ: odd, as ψ₅ must be.'], 'H₅ = 32ξ⁵ − 160ξ³ + 120ξ'], c: ['What is the parity of ψ_n?', '(−1)ⁿ.'] }],
    ['Ladder operators', [
      'a = (ξ + d/dξ)/√2 and a† = (ξ − d/dξ)/√2 step between neighbouring states. Since ξ = (a + a†)/√2, the position only connects neighbouring levels, giving the selection rule Δn = ±1 for absorbing light.'
    ], { n: 4, e: 'a^\\dagger\\psi_n = \\sqrt{n+1}\\,\\psi_{n+1},\\qquad a\\,\\psi_n = \\sqrt{n}\\,\\psi_{n-1}', x: ['Use the ladder operators to find ⟨ξ²⟩ in state n.', ['ξ² = (a + a†)²/2 = (a² + a†² + aa† + a†a)/2.', 'a² and a†² change n by 2, so they average to zero; aa† gives n + 1 and a†a gives n.', '⟨ξ²⟩ = n + ½: the potential energy averages ½(n + ½)ħω, exactly half the total, as the virial theorem says.'], '⟨ξ²⟩ = n + ½'], c: ['Real HCl absorbs weakly at its first overtone, Δn = 2. Why, if the rule is Δn = ±1?', 'The rule holds only for a perfectly harmonic well and a dipole moment linear in x; real bonds are neither.'] }],
    ['Ground state and uncertainty', [
      'The ground state is a pure Gaussian with Δx = √(ħ/2mω) and Δp = √(mħω/2): their product is exactly ħ/2, the minimum allowed.'
    ], { n: 5, e: '\\Delta x\\,\\Delta p = \\frac{\\hbar}{2}', x: ['What is the probability of finding the ground-state particle beyond its classical turning points?', ['The classical turning points for E = ½ħω are at ξ = ±1.', '|ψ₀|² ∝ e^(−ξ²), so P(|ξ| > 1) = erfc(1).', 'erfc(1) = 0.157: a 16% chance of being where a classical particle with this energy could never go.'], '16%'], c: ['Why is the ground state a minimum-uncertainty state?', 'It is a Gaussian, the only shape for which Δx Δp = ħ/2 exactly.'] }]
  ],
  m: [
    ['Starting the energy ladder at zero.', 'E₀ = ½ħω.'],
    ['Forgetting the Gaussian factor.', 'ψ_n ∝ H_n(ξ)e^(−ξ²/2).'],
    ['Treating Δn = ±1 as exact for real molecules.', 'Anharmonicity allows weak overtones.']
  ]
});

WL.gd('m-laguerre', {
  h: 'Separating the hydrogen atom’s Schrödinger equation leaves a radial equation whose physical solutions are associated Laguerre polynomials times an exponential. Requiring the series to stop forces the energies E_n = −13.6 eV/n² and fixes the number of radial nodes at n − l − 1. Precise data then show exactly where this beautiful model needs corrections.',
  s: [
    ['The radial equation', [
      'With ψ = (u/r)Y_lᵐ, u obeys a one-dimensional equation with an effective potential: the Coulomb attraction plus a centrifugal barrier ħ²l(l + 1)/(2mr²) that keeps electrons with angular momentum away from the nucleus.'
    ], { n: 0, e: 'V_{\\text{eff}} = -\\frac{e^2}{4\\pi\\varepsilon_0r}+\\frac{\\hbar^2l(l+1)}{2mr^2}', x: ['Where is the minimum of V_eff for l = 1, and what does that suggest about s and p electrons in bigger atoms?', ['dV_eff/dr = 0 gives r = l(l + 1)a₀: 2a₀ for l = 1.', 'A p-electron is held away from the nucleus, while an s-electron, with no barrier, can reach it.', 'In lithium the outer 2s electron penetrates the inner 1s² core and feels more of the nuclear charge, so 2s lies 1.85 eV below 2p (the red 671 nm line). In hydrogen they are degenerate.'], 'r = 2a₀'], c: ['Which electrons feel no centrifugal barrier?', 's-electrons (l = 0).'] }],
    ['Peeling off both ends', [
      'Near the nucleus u ~ r^(l+1); far away u ~ e^(−κr) with E = −ħ²κ²/2m. Factoring out both behaviours leaves the associated Laguerre equation for what remains.'
    ], { n: 1, e: 'u = x^{l+1}e^{-x/2}\\,v(x),\\qquad x = 2\\kappa r', x: ['Show that u = re^(−r/a) solves the l = 0 radial equation, and find a and E.', ['u′ = (1 − r/a)e^(−r/a) and u″ = (r/a² − 2/a)e^(−r/a).', 'Substitute into −(ħ²/2m)u″ − (e²/4πε₀r)u = Eu. The terms without r: ħ²/(ma) = e²/(4πε₀), so a = 4πε₀ħ²/(me²) = a₀.', 'The terms in r: E = −ħ²/(2ma₀²) = −13.6 eV.'], 'a = a₀; E = −13.6 eV'], c: ['How does u behave near r = 0 for l = 2?', 'Like r³, that is, r^(l+1).'] }],
    ['Termination gives 1/n²', [
      'The series for v grows like eˣ unless it stops. Stopping requires n = n_r + l + 1 to be a whole number, and then E_n = −13.6 eV/n²: the energy depends only on n, not on l.',
      'Precise spectroscopy shows what the model leaves out: fine structure from relativity (about 10⁻⁴ eV), and the Lamb shift between 2s and 2p, 4.4 μeV (1058 MHz), explained only by quantum electrodynamics.'
    ], { n: 2, e: 'E_n = -\\frac{13.6\\ \\text{eV}}{n^2}\\times\\frac{\\mu}{m_e}', x: ['The Balmer line Hα (n = 3 → 2) is at 656.28 nm in hydrogen. The energies scale with the reduced mass μ. Where should deuterium’s line be?', ['μ/mₑ ≈ 1 − mₑ/M: 1 − 1/1836 for hydrogen, 1 − 1/3670 for deuterium.', 'Deuterium’s levels are deeper by a fraction 1/1836 − 1/3670 = 2.72 × 10⁻⁴, so its wavelength is shorter by 656.28 × 2.72 × 10⁻⁴ = 0.18 nm.', 'Urey found a faint line at 656.10 nm in 1931: the discovery of deuterium.'], '0.18 nm shorter, at 656.10 nm'], c: ['How many radial nodes has the 3p state?', 'n − l − 1 = 1.'] }],
    ['The radial functions', [
      'R_nl ∝ ρˡe^(−ρ/2)L^(2l+1)_(n−l−1)(ρ) with ρ = 2r/(na₀). The radial probability P(r) = r²R² shows the shells. s-states are non-zero at the nucleus, which makes them sensitive to its size.'
    ], { n: 3, e: 'P(r<b)\\approx\\frac43\\Big(\\frac{b}{a}\\Big)^3\\qquad(b\\ll a)', x: ['Estimate the chance that a 1s electron is inside the proton (radius 0.84 fm; a₀ = 52 918 fm). Repeat for muonic hydrogen, where the muon’s reduced mass is 186mₑ.', ['Electron: (4/3)(0.84/52 918)³ = 5 × 10⁻¹⁵.', 'Muon: its orbit is 186 times smaller, a = 285 fm, so (4/3)(0.84/285)³ = 3 × 10⁻⁸: about 6 million times larger.', 'That sensitivity let muonic hydrogen measure the proton’s radius in 2010 as 0.84 fm, 4% below the value then accepted from ordinary hydrogen (0.88 fm): the **proton radius puzzle**. Newer ordinary-hydrogen measurements mostly agree with the smaller value.'], '5 × 10⁻¹⁵ and 3 × 10⁻⁸'], c: ['For which l does P(r) have a single peak, at n²a₀?', 'l = n − 1, which has no radial nodes.'] }],
    ['Generalised Laguerre polynomials', [
      'L₀^(α) = 1, L₁^(α) = 1 + α − x, and a three-term recurrence gives the rest. They are orthogonal on (0, ∞) with weight xᵅe⁻ˣ.'
    ], { n: 4, e: '(k+1)L_{k+1}^{(\\alpha)} = (2k+1+\\alpha-x)L_k^{(\\alpha)}-(k+\\alpha)L_{k-1}^{(\\alpha)}', x: ['Find L₂^(1), and use it to locate the radial nodes of the 3s state, R₃₀ ∝ L₂^(1)(ρ)e^(−ρ/2) with ρ = 2r/(3a₀).', ['k = 1, α = 1: 2L₂ = (4 − x)(2 − x) − 2 = x² − 6x + 6, so L₂^(1) = (x² − 6x + 6)/2.', 'Its zeros are ρ = 3 ± √3 = 1.27 and 4.73.', 'r = 3a₀ρ/2 = 1.90a₀ and 7.10a₀: two radial nodes, as n − l − 1 = 2 requires.'], 'nodes at 1.90a₀ and 7.10a₀'], c: ['What is the weight for L^(α)?', 'xᵅe⁻ˣ on (0, ∞).'] }]
  ],
  m: [
    ['Expecting 2s and 2p to differ in the 1/r model.', 'They are degenerate there; only corrections split them.'],
    ['Forgetting the reduced mass.', 'Use μ = mM/(m + M), above all for isotopes and muons.'],
    ['Counting n − 1 radial nodes for every state.', 'Radial nodes number n − l − 1.']
  ]
});

WL.gd('m-orthopoly', {
  h: 'Every weight function on an interval generates its own family of orthogonal polynomials, and they all share a three-term recurrence, real interlacing zeros and an optimal quadrature rule. The classical families (Jacobi, with its special cases Gegenbauer, Legendre and Chebyshev, plus Laguerre and Hermite) are the ones that also solve differential equations, which is why they keep appearing in physics and in numerical work.',
  s: [
    ['Weight functions', [
      'Given w(x) ≥ 0 on (a, b), Gram–Schmidt applied to 1, x, x², … with the inner product ∫fgw dx produces orthogonal polynomials of every degree. Each weight gives its own family.'
    ], { n: 0, e: '\\langle f,g\\rangle = \\int_a^bf\\,g\\,w\\,dx', x: ['Apply Gram–Schmidt to 1, x, x² with w = 1 on (−1, 1).', ['p₀ = 1 and p₁ = x, which are already orthogonal (x is odd).', 'p₂ = x² − (⟨x², 1⟩/⟨1, 1⟩)·1 − (⟨x², x⟩/⟨x, x⟩)x = x² − (2/3)/2 = x² − ⅓.', 'Scaled so that p(1) = 1: (3x² − 1)/2 = P₂, the Legendre polynomial.'], 'the Legendre polynomials'], c: ['Which weight on (0, ∞) produces the Laguerre polynomials?', 'e⁻ˣ.'] }],
    ['Recurrences and zeros', [
      'Because xpₙ is orthogonal to every polynomial of degree below n − 1, every family obeys a three-term recurrence. The zeros of pₙ are real, simple and inside (a, b), and those of neighbouring degrees **interlace**.'
    ], { n: 1, e: 'x\\,p_n = \\alpha_np_{n+1}+\\beta_np_n+\\gamma_np_{n-1}', x: ['Check that the zeros of P₂ and P₃ interlace.', ['P₂ = (3x² − 1)/2 has zeros ±1/√3 = ±0.577.', 'P₃ = (5x³ − 3x)/2 has zeros 0 and ±√(3/5) = ±0.775.', 'In order: −0.775, −0.577, 0, 0.577, 0.775: each zero of P₂ sits between two of P₃.'], 'they interlace'], c: ['How many real zeros does p₇ have in (a, b)?', 'Seven, all simple.'] }],
    ['Chebyshev polynomials', [
      'Tₙ(cos θ) = cos nθ, so Tₙ swings between −1 and 1 exactly n + 1 times on [−1, 1]. Interpolating at the zeros of Tₙ (**Chebyshev nodes**), which crowd towards the ends, avoids the wild oscillations of equally spaced interpolation.'
    ], { n: 2, e: 'x_k = \\cos\\frac{(2k+1)\\pi}{2n}', x: ['Interpolate f(x) = 1/(1 + 25x²) on [−1, 1] by a polynomial of degree 10, through 11 equally spaced points and through 11 Chebyshev nodes.', ['Equally spaced: the polynomial matches at the nodes but swings wildly near the ends, with a maximum error of 1.9, larger than f itself: **Runge’s phenomenon**.', 'Chebyshev nodes: the maximum error is 0.11, and it keeps shrinking as the degree rises.', 'More data in the wrong places can make a fit worse: a warning for fitting experimental data with high-degree polynomials.'], 'maximum errors 1.9 against 0.11'], c: ['Why do Chebyshev nodes crowd towards the ends?', 'They are the projections onto the axis of equally spaced points on a semicircle.'] }],
    ['Gaussian quadrature', [
      'Put the n nodes of a quadrature rule at the zeros of pₙ and choose the weights to match: the rule is then exact for every polynomial of degree up to 2n − 1, twice what equally spaced nodes achieve.'
    ], { n: 3, e: '\\int_{-1}^1f\\,dx\\approx f\\Big(-\\tfrac{1}{\\sqrt3}\\Big)+f\\Big(\\tfrac{1}{\\sqrt3}\\Big)', x: ['Estimate ∫₋₁¹ eˣ dx = 2.3504 with the two-point Gauss rule, and compare it with Simpson’s rule, which uses three points.', ['Gauss: e^0.5774 + e^(−0.5774) = 1.7813 + 0.5614 = 2.3427, 0.33% low.', 'Simpson: (e⁻¹ + 4 + e)/3 = 2.3621, 0.50% high.', 'Two well-placed points beat three equally spaced ones.'], '2.3427 (Gauss) against 2.3621 (Simpson)'], c: ['Up to what degree is an n-point Gauss rule exact?', '2n − 1.'] }],
    ['Gegenbauer polynomials and hidden symmetry', [
      'Gegenbauer polynomials have generating function (1 − 2xt + t²)^(−λ). For λ = ½ they are the Legendre polynomials; for λ = 1, Chebyshev’s U. They are the harmonics of spheres in higher dimensions.'
    ], { n: 4, e: '\\frac{1}{(1-2xt+t^2)^\\lambda} = \\sum_nC_n^{(\\lambda)}(x)\\,t^n', x: ['Count hydrogen’s states with n = 3 (ignoring spin), and say why rotation alone cannot explain the count.', ['l = 0, 1, 2 give 1 + 3 + 5 = 9 = n² states with the same energy.', 'Rotational symmetry only forces the 2l + 1 states of each l to match. The match across different l is “accidental”: Fock (1935) traced it to the symmetry of a sphere in four dimensions, whose harmonics (Gegenbauer polynomials with λ = 1) come in groups of n².', 'The symmetry belongs to the exact 1/r potential. In real hydrogen, relativity and the Lamb shift break it slightly; in other atoms, screening breaks it badly.'], '9 = n²'], c: ['Which Gegenbauer family gives the Legendre polynomials?', 'λ = ½.'] }]
  ],
  m: [
    ['Interpolating with a high-degree polynomial at equally spaced points.', 'Use Chebyshev nodes, or low-degree pieces.'],
    ['Using a plain Gauss rule on a function with an endpoint singularity.', 'Build the singularity into the weight.'],
    ['Testing orthogonality without the weight.', 'Chebyshev T, for example, needs 1/√(1 − x²).']
  ]
});

WL.gd('m-airy', {
  h: 'Near any turning point, where a wave’s energy equals the potential, the Schrödinger equation reduces to y″ = zy. Its decaying solution, the Airy function, oscillates on the allowed side and dies away on the forbidden side, gluing the two regions together. It fixes the quarter-wave phase in WKB quantisation, the energy levels in a linear potential and the bright edge of a rainbow.',
  s: [
    ['Why every turning point looks the same', [
      'Close to a turning point a smooth potential is nearly a straight line, V ≈ E + F(x − x_t). Measuring distance in units of ℓ = (ħ²/2mF)^(1/3) turns the Schrödinger equation into Airy’s equation, with no trace of the original problem left.'
    ], { n: 0, e: '\\frac{d^2\\psi}{dz^2} = z\\,\\psi,\\qquad z = \\frac{x-x_t}{\\ell}', x: ['Find the natural length ℓ for a neutron in Earth’s gravity, and for an electron in an electric field of 10⁷ V/m.', ['Neutron: F = mg, so ℓ = (ħ²/(2m²g))^(1/3) = 5.9 μm.', 'Electron: F = eE, so ℓ = (ħ²/(2meE))^(1/3) = 1.6 nm.', 'Within a few ℓ of the turning point the wave switches from oscillating to decaying; further away, WKB takes over.'], '5.9 μm and 1.6 nm'], c: ['Why is a straight-line potential enough near a turning point?', 'Over a short enough distance any smooth curve looks straight.'] }],
    ['Ai and Bi', [
      'Airy’s equation has two standard solutions: Ai(z), which decays for z > 0, and Bi(z), which grows. For z < 0 both oscillate, with a wavelength that shortens as |z| grows, as the local momentum increases.'
    ], { n: 1, e: '\\mathrm{Ai}(0) = 0.3550,\\qquad \\mathrm{Ai}\'(0) = -0.2588', x: ['Compare Bi(5) with Ai(5), and explain why a physical state uses Ai alone.', ['For large z, Bi/Ai ≈ 2e^(2ζ), with ζ = (2/3)z^(3/2) = 7.45 at z = 5.', 'So Bi(5)/Ai(5) ≈ 6 × 10⁶ (exactly 6.07 × 10⁶).', 'Any admixture of Bi would swamp Ai a few units into the forbidden region and grow without limit beyond it: a bound state must use Ai alone.'], 'Bi is about 6 million times larger at z = 5'], c: ['In which direction does Ai decay?', 'Into the classically forbidden region, z > 0.'] }],
    ['Asymptotic forms', [
      'With ζ = (2/3)|z|^(3/2), Ai decays like e^(−ζ) on the right and oscillates like sin(ζ + π/4) on the left, both with amplitude ∝ |z|^(−1/4). These are exactly the WKB forms, so Ai shows how to join WKB waves across a turning point: its π/4 is the origin of the ½ in Bohr–Sommerfeld quantisation.'
    ], { n: 2, e: '\\mathrm{Ai}(z)\\approx\\frac{e^{-\\zeta}}{2\\sqrt\\pi\\,z^{1/4}},\\qquad\\zeta = \\tfrac23z^{3/2}', x: ['Test the decaying form at z = 2 and z = 5, where Ai is exactly 0.03492 and 1.0834 × 10⁻⁴.', ['z = 2: ζ = 1.886, so e^(−ζ)/(2√π × 2^(1/4)) = 0.0360, 3.1% high.', 'z = 5: ζ = 7.454, giving 1.0930 × 10⁻⁴, 0.9% high.', 'The form improves as z grows; at z = 0 it fails completely (it diverges), exactly where WKB fails too.'], '3.1% and 0.9% high'], c: ['Where does the WKB phase π/4 come from?', 'From the oscillating form of Ai, sin(ζ + π/4).'] }],
    ['Zeros and the quantum bouncer', [
      'Ai has infinitely many zeros, all negative: a₁ = −2.338, a₂ = −4.088, a₃ = −5.521. A particle above a hard floor in a linear potential has ψ = Ai(z + aₙ), with energies |aₙ| times the natural energy unit.'
    ], { n: 3, e: 'E_n = |a_n|\\Big(\\frac{\\hbar^2(eF)^2}{2m^*}\\Big)^{1/3}', x: ['At a GaAs/AlGaAs interface, electrons (effective mass 0.067mₑ) are pressed against a barrier by a field of 5 × 10⁶ V/m: a triangular well. Estimate the two lowest levels.', ['The energy unit is (ħ²(eF)²/(2m*))^(1/3) = 24.2 meV.', 'E₁ = 2.338 × 24.2 = 57 meV and E₂ = 4.088 × 24.2 = 99 meV.', 'The size is right, but the field at a real interface is not uniform: the electrons themselves bend the potential. Quantitative work needs a self-consistent calculation; the triangle is a first estimate.'], 'about 57 and 99 meV'], c: ['Why do the levels crowd together higher up?', 'The well widens with height, so the zeros of Ai get closer together.'] }],
    ['Caustics and rainbows', [
      'Geometric optics predicts infinite intensity on a **caustic**, such as the rainbow angle. Airy (1838) showed that near a caustic the wave intensity follows Ai²: finite, with extra fringes (supernumerary bows) whose spacing depends on the droplet size.'
    ], { n: 4, e: 'I\\propto\\mathrm{Ai}^2', x: ['For water (n = 1.333) the deviation of a ray reflected once inside a drop is stationary at the rainbow angle. Find it, and say what Airy’s theory adds.', ['Stationary deviation needs cos²i = (n² − 1)/3, so i = 59.4°; then sin r = sin i/n gives r = 40.2°.', 'The deviation is D = 180° + 2i − 4r = 137.9°, so the bow appears 180° − 137.9° = 42.1° from the point opposite the Sun.', 'Rays pile up there, so geometric optics predicts infinite brightness. Airy’s Ai² profile is finite and adds faint supernumerary bows just inside, seen when drops are small and uniform. For very small drops even Airy’s theory fails, and full Mie scattering is needed.'], 'about 42°'], c: ['What happens to supernumerary bows when the drops are large?', 'Their spacing shrinks and, with a spread of drop sizes, they wash out.'] }]
  ],
  m: [
    ['Including Bi in a bound state.', 'It grows into the forbidden region; use Ai alone.'],
    ['Using the WKB forms right at a turning point.', 'Use Ai there.'],
    ['Treating a triangular-well estimate as exact.', 'Real interfaces need a self-consistent potential.']
  ]
});

WL.gd('m-hypergeometric', {
  h: 'A remarkable number of functions are special cases of one series, the Gauss hypergeometric function ₂F₁(a, b; c; x). Logarithms, inverse trigonometric functions, Legendre polynomials and complete elliptic integrals all fit, and so do many exact results in quantum mechanics and cosmology. Recognising ₂F₁ turns integrals and differential equations into table look-ups.',
  s: [
    ['Pochhammer symbols', [
      'The rising factorial is (a)ₙ = a(a + 1)⋯(a + n − 1) = Γ(a + n)/Γ(a), with (a)₀ = 1 and (1)ₙ = n!. If a is a negative integer, (a)ₙ = 0 once n is large enough, and a series built from it stops: a polynomial.'
    ], { n: 0, e: '(a)_n = \\frac{\\Gamma(a+n)}{\\Gamma(a)}', x: ['Show that ₂F₁(−2, 3; 1; t) is a polynomial, and that with t = (1 − x)/2 it is P₂(x).', ['(−2)₁ = −2, (−2)₂ = 2, and (−2)ₙ = 0 for n ≥ 3.', 'So ₂F₁ = 1 + (−2)(3)t/(1 · 1) + (2)(12)t²/(2 · 2) = 1 − 6t + 6t².', 'With t = (1 − x)/2: 1 − 3(1 − x) + (3/2)(1 − x)² = (3x² − 1)/2 = P₂(x).'], '1 − 6t + 6t² = P₂(x)'], c: ['What is (½)₃?', '½ × 3/2 × 5/2 = 15/8.'] }],
    ['The Gauss function', [
      '₂F₁(a, b; c; x) converges for |x| < 1. It solves the hypergeometric equation, whose regular singular points are 0, 1 and ∞, and every second-order equation with exactly three regular singular points can be transformed into it.'
    ], { n: 1, e: '{}_2F_1(a,b;c;x) = \\sum_{n=0}^\\infty\\frac{(a)_n(b)_n}{(c)_n\\,n!}\\,x^n', x: ['Check that arcsin x = x ₂F₁(½, ½; 3/2; x²) by comparing the first terms.', ['n = 1: (½)(½)/((3/2) · 1) = 1/6, giving x³/6.', 'n = 2: (¾)²/((15/4) · 2) = 3/40, giving 3x⁵/40.', 'arcsin x = x + x³/6 + 3x⁵/40 + ⋯, exactly its Taylor series.'], 'x + x³/6 + 3x⁵/40 + ⋯'], c: ['Where are the singular points of the hypergeometric equation?', 'At 0, 1 and ∞.'] }],
    ['Special cases', [
      'Logarithms, powers, inverse trigonometric functions, Legendre polynomials and complete elliptic integrals are all ₂F₁ with particular parameters. For example, the complete elliptic integral is K(k) = (π/2)₂F₁(½, ½; 1; k²).'
    ], { n: 2, e: 'K(k) = \\frac{\\pi}{2}\\,{}_2F_1\\big(\\tfrac12,\\tfrac12;1;k^2\\big)', x: ['A pendulum’s exact period is T = T₀ ₂F₁(½, ½; 1; sin²(θ₀/2)). Find T/T₀ for a 90° amplitude.', ['Here k² = sin²45° = ½. The terms are ((½)ₙ/n!)² × 2⁻ⁿ: 1, 0.125, 0.0352, 0.0122, 0.0047, 0.0019, ….', 'They sum to 1.1803.', 'The period is 18% longer than the small-swing value, and it grows without limit as θ₀ → 180°.'], 'T = 1.180T₀'], c: ['What happens to the series as θ₀ → 180°?', 'Then k² → 1, where this ₂F₁ diverges logarithmically: the period becomes infinite.'] }],
    ['Summation and transformations', [
      'At x = 1, Gauss’s theorem gives the sum as a ratio of Gamma functions, provided Re(c − a − b) > 0. Transformation formulas relate values at x to values at 1 − x, 1/x or x/(x − 1), which is how ₂F₁ is computed for any x.'
    ], { n: 3, e: '{}_2F_1(a,b;c;1) = \\frac{\\Gamma(c)\\,\\Gamma(c-a-b)}{\\Gamma(c-a)\\,\\Gamma(c-b)}', x: ['Evaluate ₂F₁(½, ½; 2; 1) with Gauss’s theorem, and see how fast the series converges.', ['Γ(2)Γ(1)/(Γ(3/2)Γ(3/2)) = 1/(π/4) = 4/π = 1.2732.', 'The first five terms of the series add up to only 1.2112.', 'Here c − a − b = 1, so the terms fall only like 1/n², and the error after N terms is about 1/N: a closed form beats brute summation.'], '4/π'], c: ['What condition must hold for the series to converge at x = 1?', 'Re(c − a − b) > 0.'] }],
    ['Confluent and generalised forms', [
      'Merging the singular point at 1 with ∞ gives the confluent function ₁F₁(a; c; x), which contains the Laguerre and Hermite polynomials and the Coulomb wavefunctions. ₀F₁ gives Bessel functions, and the general ₚF_q covers most functions met in physics.'
    ], { n: 4, e: 'J_0(x) = {}_0F_1\\big(;1;-x^2/4\\big)', x: ['Show that ₀F₁(; 1; −x²/4) = J₀(x), and evaluate it at x = 1.', ['₀F₁(; c; z) = Σzⁿ/((c)ₙn!). With c = 1, (1)ₙ = n!, so the terms are (−x²/4)ⁿ/(n!)²: the series for J₀.', 'At x = 1: 1 − ¼ + 1/64 − 1/2304 + ⋯ = 0.76519.', 'The exact value is 0.76520: four terms give almost five figures.'], 'J₀(1) ≈ 0.7652'], c: ['What is ₁F₁(a; a; x)?', 'eˣ.'] }]
  ],
  m: [
    ['Summing the series at |x| ≥ 1.', 'Transform to a convergent argument first.'],
    ['Missing that a negative-integer parameter stops the series.', 'It gives a polynomial.'],
    ['Applying Gauss’s theorem when Re(c − a − b) ≤ 0.', 'The series then diverges at x = 1.']
  ]
});
WL.gd('m-confluent', {
  h: 'Merge two of the hypergeometric equation’s singular points and you get the confluent hypergeometric (Kummer) equation. Its solutions contain the hydrogen atom, the harmonic oscillator, Coulomb scattering and tunnelling through parabolic barriers. Their large-x behaviour, a growing exponential unless the series terminates, is the common source of quantisation in all of them.',
  s: [
    ['Kummer’s equation', [
      'xy″ + (c − x)y′ − ay = 0 has the regular solution M(a, c, x) = ₁F₁(a; c; x) and a second solution U(a, c, x) that decays at large x. For large x, M grows like eˣ unless a = 0, −1, −2, …, when it is a polynomial.'
    ], { n: 0, e: 'M(a,c,x) = \\sum_{n=0}^\\infty\\frac{(a)_n}{(c)_n}\\frac{x^n}{n!}', x: ['Show that M(−2, 1, x) is the Laguerre polynomial L₂(x) = 1 − 2x + x²/2.', ['(−2)₁/(1)₁ = −2, giving −2x.', '(−2)₂/((1)₂ · 2!) = 2/(2 · 2) = ½, giving x²/2; and (−2)ₙ = 0 for n ≥ 3.', 'So M(−2, 1, x) = 1 − 2x + x²/2 = L₂(x).'], 'L₂(x)'], c: ['When is M a polynomial?', 'When a is 0 or a negative integer.'] }],
    ['Whittaker functions and hydrogen', [
      'Hydrogen’s radial functions are ρˡe^(−ρ/2)M(l + 1 − n, 2l + 2, ρ), with ρ = 2r/(na₀). Normalisability needs a = l + 1 − n to be 0 or a negative integer: that is the quantisation of n.'
    ], { n: 1, e: 'R_{nl}\\propto\\rho^le^{-\\rho/2}M(l+1-n,\\,2l+2,\\,\\rho)', x: ['Write the 3p radial function using M, and find its radial node.', ['n = 3, l = 1: a = 1 + 1 − 3 = −1 and c = 4, so M(−1, 4, ρ) = 1 − ρ/4.', 'R₃₁ ∝ ρ(1 − ρ/4)e^(−ρ/2), with ρ = 2r/(3a₀).', 'The node is at ρ = 4, that is r = 6a₀: one radial node, as n − l − 1 = 1 requires.'], 'node at r = 6a₀'], c: ['What happens if a is not 0 or a negative integer?', 'M grows like e^ρ, so the wavefunction grows like e^(ρ/2) and cannot be normalised.'] }],
    ['Parabolic cylinder functions', [
      'Weber’s equation y″ + (ν + ½ − z²/4)y = 0 is the harmonic oscillator. With the sign of z² reversed it describes an inverted parabolic barrier, for which the transmission probability is known exactly.'
    ], { n: 2, e: 'T = \\frac{1}{1+e^{-2\\pi(E-V_0)/\\hbar\\omega_b}}', x: ['Find the transmission through a parabolic barrier V = V₀ − ½mω_b²x² at E = V₀ − ħω_b, E = V₀ and E = V₀ + ħω_b.', ['Below the top by ħω_b: T = 1/(1 + e^(2π)) = 0.0019.', 'At the top: T = ½ exactly. Quantum mechanics both reflects some particles that are above the barrier and lets some through from below it.', 'Above by ħω_b: T = 0.998. The rise is smooth, which is one reason the conductance steps of a quantum point contact, a narrow saddle-shaped channel, are rounded rather than sharp.'], '0.002, ½ and 0.998'], c: ['Can a particle with more energy than the barrier top be reflected?', 'Yes: just above the top, a parabolic barrier still reflects a noticeable fraction.'] }],
    ['Coulomb wavefunctions', [
      'For a Coulomb potential the exact scattering solution is a confluent hypergeometric function. The probability of finding the two particles at zero separation, relative to free particles, is the **Sommerfeld factor** C², with η = Z₁Z₂e²/(4πε₀ħv).'
    ], { n: 3, e: 'C^2 = \\frac{2\\pi\\eta}{e^{2\\pi\\eta}-1}', x: ['Two protons meet with relative energy 10 keV. Find η and C². What if the charges attracted instead?', ['The relative speed is v = √(4E/m_p) = 0.0065c, so η = αc/v = (1/137)/0.0065 = 1.12.', 'C² = 2π(1.12)/(e^7.02 − 1) = 0.0063: the repulsion makes contact 160 times rarer.', 'For attraction (η → −η), C² = 7.0: contact is 7 times more likely. This **Sommerfeld enhancement** sharpens the absorption edges of semiconductors.'], 'η = 1.12; C² = 0.0063 (7.0 if attractive)'], c: ['What happens to C² for a repulsive pair as v → 0?', 'It falls exponentially, like e^(−2πη).'] }],
    ['Fusion in stars', [
      'Protons in the Sun’s core (k_BT ≈ 1.34 keV) are far below the Coulomb barrier. The tunnelling factor rises steeply with energy while the Maxwell–Boltzmann tail falls, so reactions happen in a narrow window, the **Gamow peak**, at E₀ = (E_G(k_BT)²/4)^(1/3), where E_G = 2μc²(παZ₁Z₂)².'
    ], { n: 4, e: 'E_0 = \\Big(\\frac{E_G(k_BT)^2}{4}\\Big)^{1/3},\\qquad \\text{rate}\\propto T^{(\\tau-2)/3},\\quad \\tau = \\frac{3E_0}{k_BT}', x: ['At the Sun’s centre (k_BT = 1.34 keV), compare p + p (E_G = 493 keV) with p + ¹⁴N (E_G = 45.1 MeV), the key step of the CNO cycle.', ['p + p: E₀ = 6.0 keV and τ = 13.6, so the rate ∝ T^3.9.', 'p + ¹⁴N: E₀ = 27.2 keV and τ = 61, so the rate ∝ T^20: enormously sensitive to temperature.', 'So the pp chain dominates in the Sun and the CNO cycle in hotter, heavier stars. In 2020 Borexino detected CNO neutrinos from the Sun, confirming that the cycle supplies about 1% of its power.'], 'pp ∝ T⁴; CNO ∝ T²⁰'], c: ['How does fusion happen at all in the Sun’s core?', 'By tunnelling: the protons are far below the Coulomb barrier.'] }]
  ],
  m: [
    ['Accepting a non-terminating M as a bound state.', 'It grows like eˣ; the series must stop.'],
    ['Treating barrier transmission as a sharp step.', 'It rises smoothly over an energy range of about ħω_b.'],
    ['Taking k_BT as the typical reaction energy in a star.', 'Reactions happen near the Gamow peak, several times k_BT.']
  ]
});

WL.gd('m-mathieu', {
  h: 'Mathieu’s equation y″ + (a − 2q cos 2x)y = 0 is the simplest equation with a periodic coefficient. It describes a swing pumped by a child, an inverted pendulum stabilised by vibration, ions held in radio-frequency traps and electrons in a crystal. Floquet theory says when its solutions stay bounded and when they grow, and the answer, a chart of stable and unstable regions, is the same for all of them.',
  s: [
    ['The Mathieu equation', [
      'The coefficient has period π. For q = 0 the equation is a simple oscillator; turning on q pumps energy in or out. Modulating a parameter at about twice the natural frequency gives the strongest growth: **parametric resonance**.'
    ], { n: 0, e: 'y\'\'+(a-2q\\cos2x)\\,y = 0', x: ['A pendulum has natural frequency 0.5 Hz. At what pumping frequencies are its parametric resonances?', ['The resonances lie at Ω = 2ω₀/n for n = 1, 2, 3, ….', 'So at 1 Hz (strongest), 0.5 Hz, 0.33 Hz, …, each weaker than the last.', 'A child on a swing pumps at 2ω₀, standing and squatting twice per cycle. Faraday (1831) saw the same effect: a liquid surface shaken vertically at f ripples at f/2.'], '1 Hz, 0.5 Hz, 0.33 Hz, …'], c: ['Why is pumping at twice the natural frequency most effective?', 'The parameter changes at the same two points in every swing, so the energy input always adds up.'] }],
    ['Floquet’s theorem', [
      'For any equation with periodic coefficients, solutions can be chosen as y = e^(μx)P(x) with P periodic. Over one period the solutions are multiplied by a matrix M with determinant 1, so its eigenvalues are λ and 1/λ. If |tr M| < 2 they lie on the unit circle and every solution stays bounded; if |tr M| > 2 one grows.'
    ], { n: 1, e: '\\lambda+\\frac{1}{\\lambda} = \\operatorname{tr}M', x: ['Over one period, tr M = 2.5. Find the multipliers and say what happens.', ['λ + 1/λ = 2.5 gives λ = 2 or ½.', 'One solution doubles every period: unstable.', 'With tr M = 1.5 instead, λ = e^(±iθ) with cos θ = 0.75: both solutions stay bounded, merely shifting in phase each period.'], 'λ = 2 and ½: unstable'], c: ['Why is det M = 1?', 'The equation has no first-derivative term, so the Wronskian is constant.'] }],
    ['The stability chart', [
      'In the (q, a) plane, unstable tongues grow from the points a = n² on the q = 0 axis. The first, from a = 1, is the principal parametric resonance; for small q it occupies 1 − q < a < 1 + q. Higher tongues are much narrower.',
      'Real systems have damping, which the ideal chart leaves out. A weak drive then cannot beat the losses, and instability needs q above a threshold: Faraday ripples appear only when the shaking exceeds a minimum strength.'
    ], { n: 2, e: '1-q<a<1+q', x: ['For q = 0.2, which pumping frequencies Ω excite the principal resonance of an oscillator with natural frequency ω₀? (Here a = (2ω₀/Ω)².)', ['Instability for 0.8 < a < 1.2.', 'So 2ω₀/Ω lies between √0.8 = 0.894 and √1.2 = 1.095.', 'Ω between 1.83ω₀ and 2.24ω₀: a band about 10% either side of 2ω₀, widening as q grows.'], '1.83ω₀ < Ω < 2.24ω₀'], c: ['What does damping do to the stability chart?', 'It adds a threshold: the tongues lift off the q = 0 axis.'] }],
    ['Characteristic values and band gaps', [
      'On the tongue boundaries the solutions are periodic: the Mathieu functions, with characteristic values aₙ(q) and bₙ(q). For an electron in a periodic potential these boundaries are the band edges, and the tongues are the band gaps.'
    ], { n: 3, e: 'V(x) = V_0\\cos\\frac{2\\pi x}{d}\\ \\Rightarrow\\ \\Delta E_1\\approx V_0', x: ['Map the Schrödinger equation in a weak potential V₀cos(2πx/d) onto Mathieu’s equation, and find the width of the first band gap.', ['With x′ = πx/d: ψ″ + (2md²/(ħ²π²))(E − V₀cos 2x′)ψ = 0, so a ∝ E and 2q ∝ V₀, with the same factor 2md²/(ħ²π²).', 'The first tongue spans 1 − q < a < 1 + q: a width of 2q in a.', 'Converted back, the gap is V₀ wide, centred on the free-electron energy at k = π/d: a weak lattice opens gaps set by its Fourier components.'], 'ΔE ≈ V₀'], c: ['In this language, what is a band gap?', 'A range of energies where the Floquet multipliers are real and solutions grow, so no extended state exists.'] }],
    ['Paul traps and the Kapitza pendulum', [
      'Static electric fields alone cannot hold a charge (Earnshaw’s theorem). An oscillating quadrupole field gives Mathieu motion in each direction, stable for q < 0.908 when a = 0: the **Paul trap** (Nobel Prize, 1989). The same averaging can hold a pendulum upside down.'
    ], { n: 4, e: 'a_0^2\\Omega^2>2g\\ell', x: ['A pendulum of length 0.20 m hangs from a pivot shaken vertically with amplitude 1.0 cm. How fast must the pivot shake to keep the pendulum upright?', ['Kapitza’s condition: a₀²Ω² > 2gℓ.', 'Ω > √(2 × 9.81 × 0.20)/0.010 = 198 rad/s.', 'f > 31.5 Hz: the upside-down position becomes stable, as desk demonstrations confirm.'], 'above about 32 Hz'], c: ['Why can’t static fields trap a charge?', 'In free space the potential obeys Laplace’s equation, so it has no minimum, only saddles.'] }]
  ],
  m: [
    ['Pumping at the natural frequency for the strongest response.', 'The principal resonance is at twice the natural frequency.'],
    ['Expecting instability for any drive, however weak.', 'Damping sets a threshold.'],
    ['Reading |tr M| < 2 as decay.', 'It means bounded oscillation: neither decay nor growth.']
  ]
});

WL.gd('m-elliptic', {
  h: 'The small-angle pendulum formula is only an approximation. The exact period of a pendulum, the perimeter of an ellipse and the shapes of many nonlinear oscillations all need integrals no elementary function can do: elliptic integrals. They are easy to compute, though, thanks to Gauss’s arithmetic–geometric mean, which gains digits faster than almost any other algorithm.',
  s: [
    ['Where they come from', [
      'Energy conservation gives a pendulum’s speed at every angle, so the time for a quarter swing is an integral. The half-angle substitution sin(θ/2) = k sin φ, with k = sin(θ₀/2), removes its singularity and turns it into the complete elliptic integral K(k).'
    ], { n: 0, e: 'T = 4\\sqrt{\\frac{l}{g}}\\,K\\Big(\\sin\\frac{\\theta_0}{2}\\Big)', x: ['A pendulum clock swings ±4°. How many seconds a day slower is it than the small-angle formula predicts, and how much does its rate change if the amplitude drifts by 0.1°?', ['T/T₀ ≈ 1 + θ₀²/16 = 1 + (0.0698)²/16 = 1 + 3.0 × 10⁻⁴: 26 s per day slow.', 'd(T/T₀)/dθ₀ = θ₀/8, so 0.1° (0.0017 rad) changes the rate by 1.5 × 10⁻⁵: 1.3 s per day.', 'Clockmakers call this **circular error**, and fight it by keeping the swing small and steady.'], '26 s/day; 1.3 s/day per 0.1°'], c: ['Why does the period integral need a substitution?', 'Its integrand becomes infinite at the turning point θ₀.'] }],
    ['The family', [
      'K(k) is the complete elliptic integral of the first kind and E(k) the second kind; stopping at an angle φ gives the incomplete forms F(φ, k) and E(φ, k). Many books and programs (including SciPy) use the parameter m = k² instead of the modulus k: a constant source of errors.'
    ], { n: 1, e: 'P = 4a\\,E(e),\\qquad e = \\sqrt{1-b^2/a^2}', x: ['Find the perimeter of an ellipse with semi-axes 2 and 1, and compare with Ramanujan’s approximation π[3(a + b) − √((3a + b)(a + 3b))].', ['e = √(1 − ¼) = 0.866, so P = 4 × 2 × E(0.866) = 8 × 1.2111 = 9.6884.', 'Ramanujan: π(9 − √35) = π(9 − 5.9161) = 9.6884.', 'They agree to 3 parts in a million, even for this fairly flat ellipse.'], 'P = 9.688'], c: ['If a program asks for m, what do you pass for k = 0.5?', 'm = k² = 0.25.'] }],
    ['Small amplitudes', [
      'Expanding the integrand in powers of k² and integrating term by term gives a series. For the pendulum, T/T₀ = 1 + θ₀²/16 + 11θ₀⁴/3072 + ⋯.'
    ], { n: 2, e: '\\frac{T}{T_0} = 1+\\frac{\\theta_0^2}{16}+\\frac{11\\,\\theta_0^4}{3072}+\\cdots', x: ['Find T/T₀ for a 60° amplitude from the series, and compare it with the exact 1.07318.', ['θ₀ = 1.0472 rad, so θ₀²/16 = 0.06854 and 11θ₀⁴/3072 = 0.00431.', 'T/T₀ ≈ 1.07285: within 0.03% of the exact value.', 'The series is excellent up to about 90° and useless close to 180°.'], '1.0729'], c: ['How much longer is the period at 60° than for small swings?', 'About 7.3%.'] }],
    ['Computing them fast: the AGM', [
      'Start with a₀ = 1 and b₀ = k′ = √(1 − k²), and replace them repeatedly by their arithmetic and geometric means. They converge to a common value M extremely fast, each step roughly doubling the number of correct digits, and K = π/(2M).'
    ], { n: 3, e: 'a_{n+1} = \\frac{a_n+b_n}{2},\\quad b_{n+1} = \\sqrt{a_nb_n},\\qquad K = \\frac{\\pi}{2M}', x: ['Find the period of a pendulum swinging ±150° (k = sin 75°, k′ = cos 75° = 0.2588) by the AGM.', ['(1, 0.2588) → (0.6294, 0.5087) → (0.56908, 0.56587) → (0.567472, 0.567470).', 'M = 0.567471, so K = π/(2M) = 2.7681.', 'T/T₀ = 2K/π = 1.762: three steps gave six correct figures.'], 'T = 1.76T₀'], c: ['How fast does the AGM converge?', 'Quadratically: each step roughly doubles the number of correct digits.'] }],
    ['Large amplitudes', [
      'As θ₀ → 180° (k → 1), K diverges logarithmically: K ≈ ln(4/k′). A pendulum balanced near the top takes ever longer to fall away. Inverting the incomplete integral defines the Jacobi elliptic functions, which describe the motion itself.'
    ], { n: 4, e: 'K\\approx\\ln\\frac{4}{k\'}\\qquad(k\\to1)', x: ['Estimate the period of a pendulum released at 179°.', ['k′ = cos 89.5° = 0.00873, so K ≈ ln(4/0.00873) = 6.128.', 'T/T₀ = 2K/π = 3.90, the same as the exact value to three figures.', 'Released at 179.9° it would take 5.4T₀: each factor of 10 closer to the top adds only a fixed amount, (2/π)ln 10 = 1.47, to T/T₀.'], 'T ≈ 3.9T₀'], c: ['Why does the period become infinite at exactly 180°?', 'The pendulum is then balanced at an unstable equilibrium and never starts to fall.'] }]
  ],
  m: [
    ['Passing k where a program expects m = k².', 'Check the convention every time.'],
    ['Using the small-angle series near 180°.', 'Use ln(4/k′) or the AGM there.'],
    ['Ignoring circular error in timekeeping.', 'Keep the amplitude small and constant.']
  ]
});

WL.gd('m-jacobi', {
  h: 'The elliptic integral u = ∫₀^φ dθ/√(1 − k² sin²θ) cannot be done in elementary functions, but inverting it, φ as a function of u, gives new functions as useful as sine and cosine: Jacobi’s sn, cn and dn. They reduce to trigonometric functions when k = 0 and to hyperbolic ones when k = 1, are periodic in two directions in the complex plane, and solve the pendulum and the Duffing oscillator exactly.',
  s: [
    ['Inverting the elliptic integral', [
      'Define φ = am(u, k) by the integral above; then sn u = sin φ, cn u = cos φ and dn u = √(1 − k² sn²u). Just as sin inverts ∫dt/√(1 − t²), sn inverts ∫dt/√((1 − t²)(1 − k²t²)).'
    ], { n: 0, e: 'u = \\int_0^\\varphi\\frac{d\\theta}{\\sqrt{1-k^2\\sin^2\\theta}}', x: ['What do sn, cn and dn become when k = 0 and when k = 1?', ['k = 0: u = φ, so sn u = sin u, cn u = cos u and dn u = 1.', 'k = 1: u = ∫dθ/cos θ = artanh(sin φ), so sn u = tanh u.', 'Then cn u = √(1 − tanh²u) = sech u, and dn u = sech u too. In between, the functions interpolate between endless oscillation and a single kink.'], 'k = 0: sin, cos, 1; k = 1: tanh, sech, sech'], c: ['Which value of k gives the trigonometric functions?', 'k = 0.'] }],
    ['Identities and derivatives', [
      'sn² + cn² = 1 and dn² + k² sn² = 1. The derivatives are (sn)′ = cn dn, (cn)′ = −sn dn and (dn)′ = −k² sn cn: with these, Jacobi functions can be handled as easily as sines.'
    ], { n: 1, e: '(\\operatorname{cn}u)\'\' = -(1-2k^2)\\operatorname{cn}u-2k^2\\operatorname{cn}^3u', x: ['Use the derivatives to show that cn satisfies the equation above.', ['(cn)″ = −(sn)′dn − sn(dn)′ = −cn dn² + k² sn² cn.', 'Replace dn² by 1 − k² sn²: (cn)″ = cn(2k² sn² − 1).', 'Replace sn² by 1 − cn²: (cn)″ = −(1 − 2k²)cn − 2k²cn³: a cubic restoring force, exactly the Duffing oscillator.'], 'cn solves a cubic (Duffing) equation'], c: ['What is dn where sn = 1?', '√(1 − k²) = k′.'] }],
    ['Double periodicity', [
      'sn has a real period 4K and an imaginary period 2iK′, where K′ = K(k′). A doubly periodic analytic function must have poles (by Liouville’s theorem): sn has simple poles at iK′ plus periods, and the periods form a lattice that tiles the complex plane.'
    ], { n: 2, e: '\\operatorname{sn}(u+4K) = \\operatorname{sn}(u+2iK\') = \\operatorname{sn}u', x: ['For k = 1/√2, show that the zeros of sn form a square grid.', ['k′ = √(1 − ½) = 1/√2 = k, so K′ = K(k′) = K(k) = 1.8541.', 'The zeros of sn lie at 2mK + 2niK′ for whole numbers m and n: spacing 2K along the real axis and 2K′ along the imaginary axis.', 'With K = K′ the grid is square, of side 3.708. Gauss studied this most symmetric, “lemniscatic” case before anyone else.'], 'a square grid of side 3.708'], c: ['Why must a doubly periodic analytic function have poles?', 'Otherwise it would be bounded on the whole plane, and so constant (Liouville’s theorem).'] }],
    ['The pendulum solved exactly', [
      'For θ̈ + ω₀² sin θ = 0, released from rest at θ₀, the exact solution is sin(θ/2) = k sn(K − ω₀t, k) with k = sin(θ₀/2), and the period is 4K(k)/ω₀.'
    ], { n: 3, e: '\\sin\\frac{\\theta}{2} = k\\,\\operatorname{sn}(K-\\omega_0t,\\,k)', x: ['A pendulum is released from 60°. Where is it one eighth of a period later? Compare simple harmonic motion. (Use sn(K/2) = 1/√(1 + k′).)', ['T = 4K/ω₀, so t = T/8 gives K − ω₀t = K/2.', 'k = ½ and k′ = 0.866, so sn(K/2) = 1/√1.866 = 0.732 and sin(θ/2) = 0.366: θ = 42.9°.', 'Simple harmonic motion gives 60° × cos 45° = 42.4°. The real pendulum is slightly further out: it lingers near its turning point.'], 'θ = 42.9° (SHM: 42.4°)'], c: ['What is the period of the exact pendulum in terms of K?', 'T = 4K(k)/ω₀, with k = sin(θ₀/2).'] }],
    ['Other exact solutions', [
      'The Duffing oscillator ẍ + x + εx³ = 0 has the exact solution x = A cn(Ωt, k) with Ω² = 1 + εA² and k² = εA²/(2Ω²). Euler’s equations for a freely spinning asymmetric top and the Korteweg–de Vries equation for shallow-water waves are solved by Jacobi functions too; the periodic shallow-water waves are called **cnoidal waves**.'
    ], { n: 4, e: 'x = A\\operatorname{cn}(\\Omega t,k),\\quad \\Omega^2 = 1+\\varepsilon A^2,\\quad k^2 = \\frac{\\varepsilon A^2}{2\\Omega^2}', x: ['For ẍ + x + x³ = 0 with amplitude A = 1, find the exact period and compare it with the Poincaré–Lindstedt estimate ω ≈ 1 + (3/8)εA².', ['Ω² = 2, so Ω = 1.414, and k² = ¼.', 'Exact period: T = 4K(k)/Ω = 4 × 1.6858/1.414 = 4.768.', 'Poincaré–Lindstedt gives ω ≈ 1.375, so T ≈ 4.570, 4% short: with εA² = 1 the “small” parameter is not small, and only the exact solution is reliable.'], 'T = 4.768 (perturbation theory: 4.570)'], c: ['What are cnoidal waves?', 'Periodic shallow-water waves described by cn², with sharper crests and flatter troughs than sine waves.'] }]
  ],
  m: [
    ['Assuming sn has only a real period.', 'It also has an imaginary period, 2iK′.'],
    ['Trusting perturbation theory when εA² is not small.', 'Use the exact Jacobi solution.'],
    ['Mixing up k and m = k² in software.', 'Check the convention.']
  ]
});

WL.gd('m-theta', {
  h: 'Theta functions are rapidly convergent sums of Gaussians, θ₃ = Σq^(n²)e^(2inz). They solve the heat equation on a circle, they are the partition functions of rotors and of particles on rings, and their transformation laws connect high and low temperatures exactly. Ratios of theta functions give Jacobi’s elliptic functions, and the closely related Weierstrass ℘ function is the simplest function periodic in two directions.',
  s: [
    ['Jacobi theta functions', [
      'With nome q = e^(iπτ) (|q| < 1), θ₃(z, q) = 1 + 2Σq^(n²) cos 2nz; θ₁, θ₂ and θ₄ are shifted versions. The series converge extremely fast, because the exponent grows like n².'
    ], { n: 0, e: '\\theta_3(z,q) = 1+2\\sum_{n=1}^\\infty q^{n^2}\\cos2nz', x: ['Evaluate θ₃(0, q) for q = 0.1 to eight figures.', ['θ₃(0, 0.1) = 1 + 2(0.1 + 0.1⁴ + 0.1⁹ + ⋯).', '= 1 + 2(0.1 + 0.0001 + 0.000000001) = 1.2002000.', 'Three terms give eight figures; the next one, 2 × 10⁻¹⁶, is negligible.'], '1.2002000'], c: ['Why do theta series converge so fast?', 'The exponent grows like n², so the terms fall faster than any geometric series.'] }],
    ['Heat flow and partition functions', [
      'Σe^(−n²t)e^(2inz) solves the heat equation ∂θ/∂t = ¼∂²θ/∂z², so theta functions are heat kernels on a circle. The partition function of a quantum particle on a ring, with levels n²ε, is θ₃ at z = 0.'
    ], { n: 1, e: 'Z_{\\text{ring}} = \\sum_{n=-\\infty}^\\infty e^{-n^2\\varepsilon/k_BT}', x: ['For k_BT = 10ε, evaluate Z by direct summation, and compare with the classical result √(πk_BT/ε).', ['Direct: 1 + 2(e^(−0.1) + e^(−0.4) + e^(−0.9) + e^(−1.6) + ⋯) = 5.6049912…, after about 20 terms.', 'Classical: √(10π) = 5.6049912….', 'They agree to all 16 digits a computer holds. The next step shows why.'], '5.60499'], c: ['Which states dominate Z at low temperature?', 'n = 0 and n = ±1: Z ≈ 1 + 2e^(−ε/k_BT).'] }],
    ['Modular transformations', [
      'Poisson summation turns a slowly converging sum of Gaussians into a rapidly converging one: Σe^(−πn²t) = t^(−1/2)Σe^(−πn²/t). For the ring, the high-temperature form is the classical integral plus corrections like e^(−π²k_BT/ε).'
    ], { n: 2, e: '\\sum_ne^{-n^2\\varepsilon/k_BT} = \\sqrt{\\frac{\\pi k_BT}{\\varepsilon}}\\sum_ne^{-\\pi^2n^2k_BT/\\varepsilon}', x: ['Explain the agreement found in the last step.', ['By the transformation, Z = √(πk_BT/ε) × (1 + 2e^(−π²k_BT/ε) + ⋯).', 'At k_BT = 10ε the correction is 2e^(−98.7) ≈ 10⁻⁴³.', 'So the classical answer is “wrong” only in the 43rd decimal place: quantum corrections to Z vanish exponentially, not like a power, as T rises.'], 'the correction is about 10⁻⁴³'], c: ['Which form of the sum would you use at low temperature?', 'The original, whose terms e^(−n²ε/k_BT) then fall very fast.'] }],
    ['Lattices and the Weierstrass ℘ function', [
      'For a lattice of periods ω in the complex plane, ℘(z) = 1/z² + Σ′[1/(z − ω)² − 1/ω²] is the simplest doubly periodic function, with a double pole at each lattice point. It satisfies (℘′)² = 4℘³ − g₂℘ − g₃, with lattice sums g₂ = 60Σ′ω⁻⁴ and g₃ = 140Σ′ω⁻⁶.'
    ], { n: 3, e: '(\\wp\')^2 = 4\\wp^3-g_2\\wp-g_3', x: ['Show that g₃ = 0 for a square lattice and g₂ = 0 for a hexagonal one.', ['A square lattice is unchanged by ω → iω, which sends ω⁻⁶ to i⁻⁶ω⁻⁶ = −ω⁻⁶. So g₃ = −g₃ = 0.', 'A hexagonal lattice is unchanged by ω → e^(iπ/3)ω, which multiplies ω⁻⁴ by e^(−4iπ/3) ≠ 1. So g₂ = 0.', 'Symmetry alone kills one invariant in each case; the same lattice sums appear in the electrostatic energies of crystals and vortex lattices.'], 'square: g₃ = 0; hexagonal: g₂ = 0'], c: ['Why is ℘ an even function?', 'The lattice is symmetric under ω → −ω, and 1/z² is even.'] }],
    ['Physics uses', [
      'Rotational partition functions of molecules are theta-like sums. At high temperature Z_rot ≈ T/θ_r + ⅓ + ⋯, but the hidden assumption that every J level is available can fail.',
      'Hydrogen showed this dramatically. Its measured low-temperature heat capacity disagreed with every simple calculation until Dennison (1927) realised that nuclear spin splits H₂ into ortho (odd J) and para (even J) forms, which hardly convert into each other, in a 3 : 1 ratio. Treated as a fixed mixture, the theory fits the data.'
    ], { n: 4, e: 'Z_{\\text{rot}} = \\sum_J(2J+1)\\,e^{-J(J+1)\\theta_r/T}', x: ['For HCl (θ_r = 15.2 K) at 300 K, compare the direct sum with T/θ_r and with T/θ_r + ⅓ + θ_r/(15T).', ['Direct sum: Z_rot = 20.074.', 'T/θ_r = 19.74: 1.7% low.', 'With the corrections: 19.737 + 0.333 + 0.003 = 20.074, matching to five figures.'], 'Z_rot = 20.07'], c: ['Why does H₂ need special treatment?', 'Its two identical nuclei make the allowed J values depend on the nuclear spin state.'] }]
  ],
  m: [
    ['Summing a slowly converging theta series term by term.', 'Transform it with Poisson summation.'],
    ['Using T/θ_r for Z_rot at low temperature.', 'Sum the levels directly there.'],
    ['Forgetting nuclear spin statistics for symmetric molecules.', 'H₂, D₂ and similar molecules need ortho and para forms.']
  ]
});

WL.gd('m-zeta', {
  h: 'The Riemann zeta function ζ(s) = Σn⁻ˢ is where number theory meets statistical physics. Its values at integers appear in every Bose and Fermi integral: the Stefan–Boltzmann law, the number of photons in the cosmic background, the Bose–Einstein condensation temperature. Analytic continuation gives meaning to divergent sums, and its zeros encode the distribution of the primes.',
  s: [
    ['Definition and Euler product', [
      'For Re s > 1, ζ(s) converges, and because every integer factorises uniquely into primes it equals a product over primes. Euler found ζ(2) = π²/6 and ζ(4) = π⁴/90; ζ(3) ≈ 1.2021 has no known closed form.'
    ], { n: 0, e: '\\zeta(s) = \\sum_{n=1}^\\infty\\frac{1}{n^s} = \\prod_p\\frac{1}{1-p^{-s}}', x: ['Estimate ζ(2) from the Euler product over the primes 2, 3, 5 and 7.', ['The factors are 1/(1 − ¼) = 4/3, then 9/8, 25/24 and 49/48.', 'Product: 1.3333 × 1.125 × 1.0417 × 1.0208 = 1.595.', 'The true value is π²/6 = 1.645: four primes already give 97%, because the missing factors are all close to 1.'], '1.595 (exactly 1.645)'], c: ['Why does ζ(1) diverge?', 'It is the harmonic series, which grows like ln N.'] }],
    ['Bose and Fermi integrals', [
      'Expanding 1/(eˣ − 1) = Σe^(−kx) and integrating term by term gives Γ(s)ζ(s); for fermions an extra factor (1 − 2^(1−s)) appears. These numbers set the Stefan–Boltzmann law and the number of photons in thermal radiation.'
    ], { n: 1, e: 'n_\\gamma = \\frac{2\\zeta(3)}{\\pi^2}\\Big(\\frac{k_BT}{\\hbar c}\\Big)^3', x: ['Find the number density of photons in the cosmic microwave background (T = 2.725 K), and of relic neutrinos of one species, which carry the fermion factor ¾ and a temperature lower by a factor (4/11)^(1/3).', ['k_BT/ħc = 1190 m⁻¹, so n_γ = (2 × 1.202/π²) × 1190³ = 4.11 × 10⁸ m⁻³: 411 per cm³.', 'Neutrinos plus antineutrinos of one species: (3/4)(4/11) × 411 = 112 per cm³.', 'With about 0.25 protons and neutrons per m³, there are some 1.6 billion photons per baryon. The photons are observed directly; the relic neutrinos have never been detected.'], '411 photons and 112 neutrinos per cm³'], c: ['Where does the ¾ for fermions come from?', 'From the factor 1 − 2^(1−s) with s = 3: 1 − ¼ = ¾.'] }],
    ['Bose–Einstein condensation', [
      'In an ideal Bose gas the excited states can hold at most nλ_T³ = ζ(3/2) = 2.612 particles per thermal volume, where λ_T = h/√(2πmk_BT). Below the temperature T_c at which this limit is reached, the extra particles collect in the ground state.'
    ], { n: 2, e: 'T_c = \\frac{2\\pi\\hbar^2}{mk_B}\\Big(\\frac{n}{\\zeta(3/2)}\\Big)^{2/3}', x: ['Treat liquid helium-4 (density 145 kg/m³) as an ideal Bose gas and find T_c. Compare with the λ-point, 2.17 K, where it becomes superfluid.', ['n = 145/(6.65 × 10⁻²⁷ kg) = 2.18 × 10²⁸ m⁻³.', 'T_c = (2πħ²/mk_B)(n/2.612)^(2/3) = 3.13 K.', 'London’s 1938 estimate has the right size but is 44% too high: helium is a strongly interacting liquid, not an ideal gas. In dilute atomic gases (1995), where the ideal-gas assumption holds, condensation appears close to the predicted T_c.'], 'T_c ≈ 3.1 K (measured: 2.17 K)'], c: ['Why is there a limit to how many particles the excited states can hold?', 'At zero chemical potential their Bose integral converges to ζ(3/2) and cannot grow further.'] }],
    ['Analytic continuation', [
      'Riemann extended ζ to every s ≠ 1. Then ζ(0) = −½ and ζ(−1) = −1/12. These do not make 1 + 2 + 3 + ⋯ equal −1/12 as an ordinary sum: they are the finite parts left when a smooth cut-off is applied and the divergent pieces are removed.'
    ], { n: 3, e: '\\sum_{n=1}^\\infty n\\,e^{-\\varepsilon n} = \\frac{1}{\\varepsilon^2}-\\frac{1}{12}+O(\\varepsilon^2)', x: ['Check the expansion above at ε = 0.1.', ['The exact sum is e^(−ε)/(1 − e^(−ε))² = 99.91671.', '1/ε² − 1/12 = 100 − 0.08333 = 99.91667.', 'The −1/12 is really there, beside the divergent 1/ε². In the **Casimir effect** the divergent parts cancel and the finite part is a measurable force between conducting plates, π²ħc/(240d⁴): 1.3 mPa at 1 μm, confirmed at the per-cent level since the late 1990s. How to treat real metals at finite temperature is still debated.'], 'they agree to 4 × 10⁻⁵'], c: ['Is 1 + 2 + 3 + ⋯ equal to −1/12?', 'Not as an ordinary sum, which diverges; −1/12 is the finite part left after removing the divergence.'] }],
    ['The zeros', [
      'Apart from the “trivial” zeros at −2, −4, …, all zeros are conjectured to lie on the line Re s = ½: the **Riemann hypothesis**. The billions computed so far do, and their spacings follow the random-matrix statistics also found in the energy levels of heavy nuclei and chaotic quantum systems.'
    ], { n: 4, e: 'N(T)\\approx\\frac{T}{2\\pi}\\ln\\frac{T}{2\\pi}-\\frac{T}{2\\pi}+\\frac78', x: ['Use the counting formula above to estimate how many zeros lie on the critical line with 0 < Im s < 100.', ['T/2π = 15.915 and ln 15.915 = 2.767.', 'N ≈ 15.915 × 2.767 − 15.915 + 0.875 = 29.0.', 'There are exactly 29: the first at 14.135, the 29th at 98.83.'], '29'], c: ['What links the zeros to nuclear physics?', 'Their spacing statistics match those of random matrices, like the energy levels of heavy nuclei.'] }]
  ],
  m: [
    ['Treating ζ(−1) = −1/12 as the value of an ordinary sum.', 'It is the finite part of a regularised sum.'],
    ['Applying the ideal Bose gas to liquid helium quantitatively.', 'Interactions shift T_c substantially.'],
    ['Forgetting the fermion factor 1 − 2^(1−s).', 'Fermi integrals always carry it.']
  ]
});
