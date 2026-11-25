import {check as q, lesson as l} from './model.js';

export const pure3 = [
  l('al-p3-algebra','Modulus, polynomials and binomial expansions','al-p3','pure3',
    'Solve modulus problems, divide polynomials, decompose rational functions and use the binomial series.',
    [
      'The modulus |u| is the distance of u from zero. The graph of y = |ax + b| is a V with its vertex at ax + b = 0. To solve |u| < k for k > 0, solve −k < u < k. For |u| = |v|, solve u = v and u = −v.',
      'In polynomial division, cancel the highest remaining power at each step. Stop when the remainder has lower degree than the divisor. For a linear divisor ax + b, the remainder is f(−b/a), and a zero remainder means the divisor is a factor.',
      'For partial fractions, use one constant numerator over each distinct linear factor and each power of a repeated linear factor. For an irreducible quadratic Q, use (Bx + C)/Q. Clear the denominators and substitute roots or match coefficients. Divide first if the numerator and denominator have equal degree.',
      'For rational n, use (1 + u)ⁿ = 1 + nu + n(n − 1)u²/2 + … for |u| < 1. Factor out the constant first when needed. The restriction on u gives the interval in x where the expansion is valid.'
    ],
    ['Decompose (5x + 1)/((x − 1)(x + 2)) into partial fractions.',
      'Write A/(x − 1) + B/(x + 2). Clearing denominators gives 5x + 1 = A(x + 2) + B(x − 1). At x = 1 this gives 6 = 3A, so A = 2. At x = −2 this gives −9 = −3B, so B = 3. The split is 2/(x − 1) + 3/(x + 2).'],
    q('Solve |2x + 1| < 7.','−4 < x < 3',['−3 < x < 4','x < −4 or x > 3','−4 ≤ x ≤ 3'],'Write −7 < 2x + 1 < 7, subtract 1 and divide all three parts by 2. The original inequality is strict.'),
    [
      q('Where is the vertex of y = |3x − 6|?','(2, 0)',['(−2, 0)','(0, 6)','(6, 0)'],'The V reaches zero where 3x − 6 = 0, at x = 2.'),
      q('What is the remainder when x⁴ + 2x³ − x² + 3x + 1 is divided by x² + 1?','x + 3',['x − 1','3x + 1','x² + 2x − 2'],'Long division gives quotient x² + 2x − 2. Multiplying that by x² + 1 gives x⁴ + 2x³ − x² + 2x − 2, leaving x + 3.'),
      q('The polynomial 4x³ + 4x² + kx + 3 has factor 2x + 1. Find k.','7',['−7','3','14'],'At x = −1/2 the polynomial is −1/2 + 1 − k/2 + 3. Set this equal to zero to obtain k = 7.'),
      q('What is the general partial-fraction form for a proper rational function with denominator (x − 1)(x² + 4)?','A/(x − 1) + (Bx + C)/(x² + 4)',['A/(x − 1) + B/(x² + 4)','(Ax + B)/(x − 1) + C/(x² + 4)','A/(x − 1) + B/(x − 2) + C/(x + 2)'],'A linear denominator needs a constant numerator. The irreducible quadratic needs a numerator of degree at most one.'),
      q('Which are the first three terms of the expansion of 1/√(4 − x) for |x| < 4?','1/2 + x/16 + 3x²/256',['1/2 − x/16 + 3x²/256','1/2 + x/8 + 3x²/128','1/2 + x/16 − x²/256'],'Write the expression as (1/2)(1 − x/4)^(−1/2). The first three terms of (1 + u)^(−1/2) are 1 − u/2 + 3u²/8. Substitute u = −x/4 and multiply by 1/2.')
    ]),

  l('al-p3-logs','Exponential equations and logarithmic graphs','al-p3','pure3',
    'Solve exponential equations and inequalities and find constants using straight-line logarithmic graphs.',
    [
      'A logarithm asks for an exponent. If b > 0, b ≠ 1 and m > 0, then log base b of m equals t exactly when bᵗ = m. With base e the logarithm is written ln. The inverse rules are ln(eˣ) = x for real x and e^(ln x) = x for x > 0. For positive inputs, use ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b and ln(aⁿ) = n ln a.',
      'The graph of y = e^(kx) passes through (0, 1) and has horizontal asymptote y = 0 when k ≠ 0. It rises for k > 0 and falls for k < 0. The graph of y = ln x passes through (1, 0) and approaches the y-axis from the right.',
      'When an unknown is in an exponent, isolate the exponential or take logs of both positive sides. Natural logarithms preserve the inequality direction because ln is increasing. Dividing by a negative coefficient then reverses the inequality.',
      'For y = axⁿ, plot ln y against ln x: gradient n and intercept ln a. For y = abˣ, plot ln y against x: gradient ln b and intercept ln a. Recover a and b by exponentiating the corresponding values.'
    ],
    ['A plot of ln y against x is a line through (0, ln 5) and (2, ln 45). Find y in the form abˣ.',
      'The intercept ln 5 gives a = 5. The gradient is (ln 45 − ln 5)/2 = (ln 9)/2 = ln 3, so b = 3. The relationship is y = 5 × 3ˣ. Substitution at x = 2 gives y = 45.'],
    q('Solve e^(3x) = 7.','x = (ln 7)/3',['x = ln(7/3)','x = 3 ln 7','x = 7/(3e)'],'Taking natural logarithms gives 3x = ln 7. Divide by 3.'),
    [
      q('Solve ln(x − 1) + ln 2 = ln 10.','x = 6',['x = 4','x = 5','x = 9'],'The domain requires x > 1. Combine the logarithms to get ln(2(x − 1)) = ln 10, so 2(x − 1) = 10 and x = 6.'),
      q('Solve e^(−2x) > 3.','x < −(ln 3)/2',['x > −(ln 3)/2','x < (ln 3)/2','x > (ln 3)/2'],'Take ln to obtain −2x > ln 3. Dividing by −2 reverses the inequality.'),
      q('What happens to y = e^(−4x) as x increases without bound?','It approaches 0 from above.',['It approaches 1 from above.','It increases without bound.','It decreases through 0.'],'The function can be written as 1/e^(4x). Its denominator grows without bound, while the fraction stays positive.'),
      q('The plot of ln y against ln x has gradient −2 and intercept ln 3. Find y for x > 0.','y = 3/x²',['y = 3x²','y = 3e^(−2x)','y = 1/(3x²)'],'The line gives ln y = ln 3 − 2 ln x. Exponentiating gives y = 3x^(−2).'),
      q('Solve 3 × 5^(x − 1) = 12.','x = 1 + (ln 4)/(ln 5)',['x = (ln 4)/(ln 5)','x = 1 + (ln 5)/(ln 4)','x = 1 + (ln 12)/(ln 5)'],'Divide by 3 first. From 5^(x − 1) = 4, taking logs gives (x − 1) ln 5 = ln 4.')
    ]),

  l('al-p3-trig','Trigonometric identities and equations','al-p3','pure3',
    'Use reciprocal functions, exact identities and combined trigonometric expressions to solve equations.',
    [
      'Use sec θ = 1/cos θ, cosec θ = 1/sin θ and cot θ = cos θ/sin θ. Reciprocal graphs have vertical asymptotes where their denominator is zero. Secant and cosecant repeat every 2π, and cotangent repeats every π.',
      'Dividing sin² θ + cos² θ = 1 by cos² θ gives 1 + tan² θ = sec² θ. Dividing by sin² θ gives 1 + cot² θ = cosec² θ. These identities apply where both sides are defined.',
      'Use sin(A ± B) = sin A cos B ± cos A sin B, cos(A ± B) = cos A cos B ∓ sin A sin B and tan(A ± B) = (tan A ± tan B)/(1 ∓ tan A tan B) where defined. Set A = B in the addition formulas to get the double-angle forms, such as cos 2A = 1 − 2 sin² A.',
      'To combine a sin θ + b cos θ, let R = √(a² + b²). Expand R sin(θ + α) and match R cos α = a and R sin α = b. Select α with the correct signs in both equations. For a cosine form, expand R cos(θ − α) and match the coefficients in the corresponding order.',
      'To solve a trigonometric equation, solve for the inner angle over its full transformed interval, then return to the original variable. Check that solutions are in the requested interval and that the original functions are defined.'
    ],
    ['Solve √3 sin x + cos x = 1 for 0 ≤ x < 2π.',
      'Set R = √(3 + 1) = 2. Since cos α = √3/2 and sin α = 1/2, use α = π/6. Then sin(x + π/6) = 1/2. The angle x + π/6 lies in [π/6, 13π/6), so its solutions there are π/6 and 5π/6. Thus x = 0 or x = 2π/3.'],
    q('If tan θ = −2, what is sec² θ?','5',['3','4','−3'],'Use sec² θ = 1 + tan² θ = 1 + (−2)² = 5.'),
    [
      q('Find the exact value of cos 75°.','(√6 − √2)/4',['(√6 + √2)/4','(√2 − √6)/4','√6/4'],'Use cos(45° + 30°) = (√2/2)(√3/2) − (√2/2)(1/2).'),
      q('Where is sec x undefined on 0 ≤ x < 2π?','π/2 and 3π/2',['0 and π','π/4 and 5π/4','π/2 only'],'Secant is 1/cos x. Cosine vanishes at π/2 and 3π/2 in this interval.'),
      q('Solve 2 cos² x + cos x − 1 = 0 on 0 ≤ x < 2π.','π/3, π and 5π/3',['π/3 and 5π/3','2π/3, π and 4π/3','π/6, π and 11π/6'],'With c = cos x, the quadratic factors as (2c − 1)(c + 1). Cosine is 1/2 at π/3 and 5π/3, and −1 at π.'),
      q('Simplify (1 − cos 2x)/sin x where it is defined.','2 sin x',['sin x','2 cos x','2 tan x'],'Since cos 2x = 1 − 2 sin² x, the numerator is 2 sin² x. Divide by the nonzero sin x.'),
      q('What is the maximum of 5 cos x − 12 sin x over all real x?','13',['7','12','17'],'The amplitude of the combined sinusoid is √(5² + (−12)²) = 13. A sine or cosine with amplitude 13 reaches that positive maximum.')
    ]),

  l('al-p3-differentiation','Advanced differentiation and tangent gradients','al-p3','pure3',
    'Differentiate composite, product, quotient, parametric and implicit functions.',
    [
      'For x in radians, the derivatives of sin x, cos x and tan x are cos x, −sin x and sec² x. The derivatives of eˣ, ln x and arctan x are eˣ, 1/x and 1/(1 + x²). Multiply by the derivative of the inner expression for a composite function.',
      'For a product uv, differentiate to u′v + uv′. For u/v with v ≠ 0, the derivative is (u′v − uv′)/v². Write the pieces separately to keep track of the minus sign and squared denominator.',
      'If x and y depend on t, then dy/dx = (dy/dt)/(dx/dt) wherever dx/dt ≠ 0. Find the required t-value before evaluating the gradient at a point.',
      'If y appears implicitly, treat it as a function of x. For example, d(y²)/dx = 2y dy/dx and d(xy)/dx = y + x dy/dx. Collect the terms with dy/dx and solve for it.',
      'A tangent passes through the chosen point and has slope dy/dx there. A non-horizontal tangent has a perpendicular normal whose gradient is the negative reciprocal, provided the tangent gradient is finite. A horizontal tangent has a vertical normal.'
    ],
    ['Find the tangent to x² + xy + y² = 7 at (1, 2).',
      'Differentiate to get 2x + y + (x + 2y) dy/dx = 0. At (1, 2), this is 4 + 5 dy/dx = 0, so the gradient is −4/5. The tangent is y − 2 = −(4/5)(x − 1).'],
    q('Differentiate arctan(2x).','2/(1 + 4x²)',['1/(1 + 4x²)','2/(1 + 2x²)','−2/(1 + 4x²)'],'The derivative of arctan u is u′/(1 + u²). Here u = 2x, so u′ = 2 and u² = 4x².'),
    [
      q('Differentiate x² ln x for x > 0.','2x ln x + x',['2x ln x','2x + ln x','2x ln x + x²'],'Use the product rule. The contributions are 2x ln x and x² × (1/x) = x.'),
      q('Differentiate (2x + 1)/(x − 3) for x ≠ 3.','−7/(x − 3)²',['7/(x − 3)²','−7/(x − 3)','(4x − 5)/(x − 3)²'],'The quotient-rule numerator is 2(x − 3) − (2x + 1) = −7. Divide by (x − 3)².'),
      q('Let x = t² + 1 and y = t³ − t. Find dy/dx at t = 2.','11/4',['4/11','11/2','3'],'At t = 2, dx/dt = 2t = 4 and dy/dt = 3t² − 1 = 11. Their ratio is 11/4.'),
      q('Find the gradient of the normal to xy + y² = 6 at (1, 2).','5/2',['−2/5','2/5','−5/2'],'Implicit differentiation gives y + (x + 2y)dy/dx = 0. At (1, 2) the tangent slope is −2/5, so the normal slope is 5/2.'),
      q('Differentiate e^(sin x).','e^(sin x) cos x',['e^(cos x)','e^(sin x) sin x','eˣ cos x'],'The outer exponential stays e^(sin x). Multiply it by cos x, the derivative of the inner sine.')
    ]),

  l('al-p3-integration','Integration by substitution and parts','al-p3','pure3',
    'Recognise standard antiderivatives and use trig identities, partial fractions, substitution and integration by parts.',
    [
      'Reverse the chain rule for gradients of the form ax + b, with a ≠ 0. For example, integrate e^(ax + b) as e^(ax + b)/a, 1/(ax + b) as ln|ax + b|/a and sec²(ax + b) as tan(ax + b)/a. Use the same factor 1/a with sine and cosine antiderivatives.',
      'For a > 0, an antiderivative of 1/(x² + a²) is arctan(x/a)/a. Factor out a coefficient if needed to get the x² term into this form.',
      'Look for kf′(x)/f(x), which integrates to k ln|f(x)| on an interval where f(x) ≠ 0. For rational functions, split into partial fractions first when this makes the pieces easier to integrate. For sin² x or cos² x, use the double-angle identities to replace the square.',
      'For a given substitution u = g(x), replace g′(x) dx with du and express the whole integrand in u. For a definite integral, convert both bounds as well. For an indefinite integral, substitute back into the answer and include a constant C.',
      'Integration by parts gives ∫u dv = uv − ∫v du. For a product, choose u so its derivative simplifies, and choose dv so you can integrate it. Verify by differentiating your result.'
    ],
    ['Find ∫ x cos(2x) dx.',
      'Set u = x and dv = cos(2x) dx. Then du = dx and v = sin(2x)/2. Parts gives x sin(2x)/2 − ∫sin(2x)/2 dx. The remaining integral is −cos(2x)/4, so the result is x sin(2x)/2 + cos(2x)/4 + C.'],
    q('Find ∫ 1/(x² + 9) dx.','arctan(x/3)/3 + C',['arctan(x/3) + C','3 arctan(x/3) + C','ln(x² + 9)/2 + C'],'Use a = 3 in arctan(x/a)/a. Differentiation gives (1/9)/(1 + x²/9) = 1/(x² + 9).'),
    [
      q('Find ∫ 6x/(x² + 4) dx.','3 ln(x² + 4) + C',['6 ln(x² + 4) + C','ln(x² + 4) + C','3/(x² + 4) + C'],'The derivative of x² + 4 is 2x. The numerator is 3 times that derivative, so the antiderivative is 3 ln(x² + 4).'),
      q('Find ∫ sec²(3x − 1) dx on an interval where the integrand is defined.','tan(3x − 1)/3 + C',['3 tan(3x − 1) + C','tan(3x − 1) + C','sec(3x − 1)/3 + C'],'The derivative of tan(3x − 1) is 3 sec²(3x − 1). Divide by 3.'),
      q('Evaluate the definite integral of sin² x from x = 0 to x = π/2.','π/4',['π/2','π/8','1/2'],'Write sin² x = (1 − cos 2x)/2. The antiderivative x/2 − sin(2x)/4 takes values π/4 and 0 at the two endpoints.'),
      q('Find ∫ (3x + 1)/((x + 1)(x + 2)) dx.','−2 ln|x + 1| + 5 ln|x + 2| + C',['2 ln|x + 1| + 5 ln|x + 2| + C','5 ln|x + 1| − 2 ln|x + 2| + C','3 ln|(x + 1)(x + 2)| + C'],'Clear denominators in A/(x + 1) + B/(x + 2). Substituting −1 gives A = −2 and substituting −2 gives B = 5. Integrate each part.'),
      q('Use u = 1 + x² to evaluate the integral of x/(1 + x²)² from x = 0 to x = 2.','2/5',['1/5','4/5','1/2'],'Here du = 2x dx and the u-limits are 1 and 5. The integral is [−1/(2u)] between 1 and 5, giving 1/2 − 1/10 = 2/5.')
    ],['al-p3-algebra','al-p3-differentiation']),

  l('al-p3-numerical','Root estimates and fixed-point iteration','al-p3','pure3',
    'Bracket a root, generate fixed-point iterates and verify a stated accuracy.',
    [
      'For a continuous function, opposite signs of f(a) and f(b) guarantee a zero between a and b. A sign change can only prove existence. Use a graph or further reasoning when the interval may contain several roots.',
      'Rearrange f(x) = 0 into x = F(x) and choose a starting value x₀. The recurrence xₙ₊₁ = F(xₙ) means calculate each new estimate from the previous one. If the sequence tends to r and F is continuous there, r = F(r). Check that r also satisfies the original equation and domain.',
      'Iterations may overshoot, oscillate or move away from a root. Keep full calculator precision during the iteration. Once a stable approximation is found, test f on either side of the rounding interval to substantiate the stated accuracy.'
    ],
    ['Estimate the positive root of x³ + x − 4 = 0 to 3 decimal places.',
      'At 1 and 2 the function values are −2 and 6, so a continuous curve has a root between them. Its derivative 3x² + 1 is positive, so there is only one root. Use xₙ₊₁ = ∛(4 − xₙ) from x₀ = 1.4. The estimates include 1.375069, 1.379450 and 1.378682, approaching 1.378797. The signs at 1.3785 and 1.3795 are negative and positive respectively, confirming that the root rounds to 1.379.'],
    q('Which interval is shown to contain a root of x³ − 2x − 5 = 0 by a sign change at its endpoints?','2 < x < 3',['0 < x < 1','1 < x < 2','3 < x < 4'],'For f(x) = x³ − 2x − 5, f(2) = −1 and f(3) = 16. The polynomial is continuous, so there is a root between 2 and 3.'),
    [
      q('Which equation has the same non-negative solutions as x = √(5 − x)?','x² + x − 5 = 0',['x² − x − 5 = 0','x² + x + 5 = 0','x² − 5 = 0'],'Square to get x² = 5 − x. The non-negative root of the resulting quadratic satisfies the original square-root equation.'),
      q('Use xₙ₊₁ = √(5 − xₙ) with x₀ = 2. What is x₁?','√3',['√5 − 2','√7','3'],'Replace xₙ by 2 on the right. This gives x₁ = √(5 − 2) = √3.'),
      q('A root is bracketed between 1.4141 and 1.4144. What is this root to 3 decimal places?','1.414',['1.413','1.415','1.41'],'Every number in the bracket lies inside the rounding interval from 1.4135 to just below 1.4145.'),
      q('Both f(0) and f(2) are positive for f(x) = (x − 1)². What does f have between 0 and 2?','A root at x = 1',['A root at x = 1/2','Two distinct roots','A sign change at x = 1'],'The graph touches the x-axis at its minimum f(1) = 0. Its values on either side of 1 are positive.'),
      q('Starting at x₀ = 0, what happens under xₙ₊₁ = 3 − xₙ?','The terms alternate between 0 and 3.',['The terms converge to 1.5.','Every term after x₀ is 3.','The terms grow without bound.'],'The first updates give 0 → 3 → 0. The pattern repeats, so this starting value produces an oscillation.')
    ]),

  l('al-p3-vectors','Vectors and straight lines in three dimensions','al-p3','pure3',
    'Use position and direction vectors, classify lines and apply the scalar product.',
    [
      'Add, subtract and scale vectors component by component. If A and B have position vectors a and b, displacement AB is b − a and the midpoint has position vector (a + b)/2. The magnitude of (x, y, z) is √(x² + y² + z²). Divide a nonzero vector by its magnitude to make a unit vector.',
      'Write a line through position a in direction b as r = a + t b, with t real and b nonzero. Given two points, subtract the first position from the second to get a direction vector. Changing its nonzero scale gives the same line.',
      'To compare lines, test whether the directions are scalar multiples. If so, check whether a point on one also lies on the other to distinguish coincident from distinct parallel lines. Otherwise set the positions equal, solve for the two parameters using two coordinate equations, and check the third. In 3D, lines with different directions and no intersection are skew.',
      'The scalar product a · b is the sum of component products. It also equals |a||b| cos θ. To find the smaller angle between two lines, take the absolute value of the cosine calculated from their direction vectors. A zero scalar product means nonzero vectors are perpendicular.',
      'To locate the foot of the perpendicular from P to a line, write a general line point H = a + t b. Impose (p − H) · b = 0, solve for t and substitute it back to find H.'
    ],
    ['Find the intersection of r = (1, 2, 0) + t(1, −1, 2) and r = (0, 2, 1) + s(2, −1, 1).',
      'The y-coordinates give 2 − t = 2 − s, so s = t. The x-coordinates give 1 + t = 2s, so t = s = 1. The z-coordinates are both 2 for these values, confirming the intersection at (2, 1, 2).'],
    q('Find the scalar product (1, 2, −2) · (3, −1, 2).','−3',['3','−7','9'],'Multiply matching components and add: 1 × 3 + 2 × (−1) + (−2) × 2 = −3.'),
    [
      q('Find the unit vector in the direction of (2, −1, 2).','(2/3, −1/3, 2/3)',['(2/9, −1/9, 2/9)','(−2/3, 1/3, −2/3)','(2/5, −1/5, 2/5)'],'The magnitude is √(4 + 1 + 4) = 3. Divide each component by 3 and keep its sign to preserve direction.'),
      q('Find the midpoint of A(3, −1, 4) and B(−1, 5, 2).','(1, 2, 3)',['(2, 4, 6)','(−2, 3, −1)','(1, 3, 2)'],'Average corresponding coordinates: (3 − 1)/2 = 1, (−1 + 5)/2 = 2 and (4 + 2)/2 = 3.'),
      q('How are the lines r = t(1, 0, 1) and r = (0, 1, 0) + s(0, 0, 1) related?','They are skew.',['They are parallel and distinct.','They intersect at (0, 1, 0).','They are coincident.'],'The directions are not scalar multiples. Every point on the first line has y = 0 and every point on the second has y = 1, so they cannot intersect.'),
      q('Find the angle between directions (1, 1, 0) and (1, 0, 1).','60°',['30°','45°','90°'],'Their dot product is 1 and both magnitudes are √2. Thus cos θ = 1/(√2 × √2) = 1/2, giving 60°.'),
      q('Find the foot of the perpendicular from P(3, 4, 2) to r = (1, 1, 0) + t(1, 0, 1).','(3, 1, 2)',['(1, 1, 0)','(2, 1, 1)','(3, 4, 2)'],'A point H on the line has coordinates (1 + t, 1, t). The scalar product (P − H) · (1, 0, 1) equals (2 − t) + (2 − t). Set this to zero, then substitute t = 2 into H.')
    ]),

  l('al-p3-differential','Separable differential equations','al-p3','pure3',
    'Turn rate statements into differential equations, separate variables and use initial conditions.',
    [
      'A rate with respect to time t is written as dy/dt. “The amount grows at a rate proportional to its size” gives dy/dt = ky for k > 0. A decay model uses dy/dt = −ky. A rate proportional to the gap from a target L can be written as dy/dt = k(L − y).',
      'For dy/dx = f(x)g(y), separate to dy/g(y) = f(x) dx on intervals where g(y) ≠ 0. Integrate both sides and include one arbitrary constant. Check separately for constant solutions with g(y) = 0 before dividing it out.',
      'An initial condition gives a particular solution by fixing the integration constant. A second observation may determine a model coefficient such as k. Use the original context to select the sign, time interval and physically meaningful solutions.',
      'A useful check is to differentiate the solution and substitute it into the original equation. When interpreting a model, describe what your answer means in the units and time range of the problem.'
    ],
    ['A substance weighs 80 g initially and 60 g after 2 hours. Its rate of loss is proportional to its mass. Find its predicted mass after 4 hours.',
      'Write dm/dt = −km. Separation gives ln m = −kt + C for positive mass, and the initial mass gives m = 80e^(−kt). Using m(2) = 60 gives e^(−2k) = 3/4. At 4 hours the multiplier is (3/4)² and the mass is 80 × 9/16 = 45 g.'],
    q('Which is a separated form of dy/dx = 2xy for y > 0?','dy/y = 2x dx',['y dy = 2x dx','dy/(2x) = y dx','2x dy = dx/y'],'Divide by y, then place dy on the left and dx on the right. The sides depend on y and x respectively.'),
    [
      q('Solve dy/dx = 3x²(1 + y) with y(0) = 1.','y = 2e^(x³) − 1',['y = e^(x³) + 1','y = 2e^(3x²) − 1','y = e^(x³) − 1'],'Separation gives ln|1 + y| = x³ + C. Since 1 + y = 2 at x = 0, the positive branch is 1 + y = 2e^(x³).'),
      q('A population N below 150 grows at a rate proportional to the difference between 150 and N. Which equation models this for k > 0?','dN/dt = k(150 − N)',['dN/dt = k(N − 150)','dN/dt = 150kN','dN/dt = kN/150'],'The positive gap is 150 − N. Multiplying that gap by positive k gives a positive growth rate below 150.'),
      q('Solve dy/dx = y² with y(0) = 2 on an interval containing x = 0.','y = 2/(1 − 2x)',['y = 2/(1 + 2x)','y = 2eˣ','y = x + 2'],'Integrate y^(−2) dy = dx to get −1/y = x + C. With y(0) = 2, C = −1/2, so y = 2/(1 − 2x).'),
      q('A cooling model gives T(t) = 20 + 50e^(−0.4t) °C. What happens as t increases without bound?','T approaches 20 °C from above.',['T approaches 70 °C from above.','T decreases through 20 °C.','T approaches 0 °C from above.'],'The positive exponential term tends to zero. The constant 20 remains, giving the limiting temperature.'),
      q('A positive quantity satisfies dQ/dt = −kQ, with Q(0) = 90 and Q(3) = 45. Find k.','(ln 2)/3',['3 ln 2','(ln 45)/3','−(ln 2)/3'],'The solution is Q = 90e^(−kt). The second value gives e^(−3k) = 1/2, hence −3k = −ln 2.')
    ],['al-p3-integration','al-p3-logs']),

  l('al-p3-complex','Complex arithmetic and Argand diagrams','al-p3','pure3',
    'Calculate in Cartesian and polar forms and interpret complex numbers as points and transformations.',
    [
      'For z = x + iy, i² = −1. The real part is x and the imaginary part is y. Equality means both parts match. On an Argand diagram z is the point (x, y), its modulus is √(x² + y²), and its argument is the directed angle from the positive real axis. The principal argument lies in (−π, π] for z ≠ 0.',
      'Add and subtract corresponding parts. Multiply by expanding and replacing i² with −1. To divide by a nonzero complex number, multiply numerator and denominator by its conjugate. Conjugation reflects points in the real axis. A polynomial with real coefficients has each non-real root paired with its conjugate.',
      'Write z in polar form r(cos θ + i sin θ) = re^(iθ), where r = |z| and θ is an argument. Multiplication multiplies moduli and adds arguments, while division divides moduli and subtracts arguments. Multiplying by a fixed nonzero number therefore scales and rotates the diagram. Adding a fixed number translates it.',
      'To find square roots of w, set (a + ib)² = w. Match a² − b² and 2ab to the real and imaginary parts, and use a² + b² = |w|. Check the signs against 2ab and give both opposite roots for nonzero w.',
      'In an Argand diagram, |z − a| measures distance from a. A fixed distance gives a circle and a smaller distance gives its interior. The points equidistant from a and b form the perpendicular bisector. The condition arg(z − a) = α gives a ray starting at a, with a excluded because the argument of zero is undefined.'
    ],
    ['Find the two square roots of −8 + 6i.',
      'Let one root be a + ib. Matching parts gives a² − b² = −8 and ab = 3. Because the modulus of −8 + 6i is 10, a² + b² = 10. These equations give a² = 1 and b² = 9. Since ab is positive, take the same signs. The roots are 1 + 3i and −1 − 3i.'],
    q('Find the principal argument of −1 + i.','3π/4',['π/4','−π/4','−3π/4'],'The point (−1, 1) is in quadrant II. Its angle is π/4 away from the negative real axis, so the principal argument is π − π/4.'),
    [
      q('Write (3 + 4i)/(1 − 2i) in the form x + iy.','−1 + 2i',['1 + 2i','−1 − 2i','11/5 − 2i/5'],'Multiply both parts of the fraction by 1 + 2i. The denominator is 5 and the numerator is 3 + 10i + 8i² = −5 + 10i.'),
      q('A monic cubic with real coefficients has roots 1 − 2i and 3. Which is its factorisation?','(x − 3)(x² − 2x + 5)',['(x − 3)(x² + 2x + 5)','(x − 3)(x² − 2x − 3)','(x + 3)(x² − 2x + 5)'],'The third root is 1 + 2i. The conjugate pair gives (x − 1)² + 4 = x² − 2x + 5, and root 3 gives factor x − 3.'),
      q('Simplify (4e^(iπ/3))/(2e^(−iπ/6)) to Cartesian form.','2i',['−2i','2','4i'],'Divide moduli to get 2. Subtract arguments: π/3 − (−π/6) = π/2. A point of modulus 2 at this angle is 2i.'),
      q('What region is described by |z − (1 + 2i)| < 3?','Inside the circle with centre (1, 2) and radius 3, excluding its boundary',['The circle with centre (1, 2) and radius 3, boundary only','Inside the circle with centre (−1, −2) and radius 3','Outside the circle with centre (1, 2) and radius 3'],'The modulus is the distance from (1, 2). Distances strictly less than 3 give points inside the circle.'),
      q('What locus satisfies |z − (2 + i)| = |z − (−2 + i)|?','The line Re z = 0',['The line Im z = 1','The circle |z| = 2','The line Re z = 2'],'The reference points (2, 1) and (−2, 1) lie on a horizontal segment with midpoint (0, 1). Its perpendicular bisector is the imaginary axis x = 0.')
    ],['al-p3-algebra','al-p3-trig'])
];
