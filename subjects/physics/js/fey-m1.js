/* Geodesic: "See it like Feynman" sections, m1. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('m-complex', [
  'e^(iπ) + 1 = 0 ties five fundamental constants together, and engineers analyse every alternating-current circuit with complex numbers, though the currents themselves are real.',
  'A complex number is a point in a plane, and multiplying by i turns it through 90°. e^(iθ) is the point on the unit circle at angle θ, so multiplying by it turns through θ. Oscillations are shadows of rotations.',
  'Split the series for e^(iθ) into real and imaginary parts and you get exactly the series for cos θ and sin θ. Or: d/dθ e^(iθ) = ie^(iθ), so the velocity is always at right angles to the position, which is circular motion.',
  'e^(iπ/2) = i, a quarter turn. A 10 μF capacitor at 50 Hz has impedance 1/(iωC), of size 318 Ω, with the current a quarter cycle ahead of the voltage.',
  'Complex numbers cannot be put in order of size, and a measured current is real: in circuits the complex form is a convenience and you take the real part at the end. In quantum mechanics, though, the complex amplitude is essential.'
]);
WL.fy('m-taylor', [
  'Your calculator works out sin 0.3 to ten digits using nothing but additions and multiplications.',
  'Near a point any smooth function looks like its tangent line; add a parabola to match the curvature, a cubic to match how the curvature changes, and so on. The **Taylor series** builds the function from its derivatives at one point.',
  'f(x) = Σ f⁽ⁿ⁾(a)(x − a)ⁿ/n! matches every derivative at a, and the error after n terms is no bigger than the size of the next term (Lagrange’s remainder).',
  'sin 0.3 ≈ 0.3 − 0.027/6 + 0.00243/120 = 0.29552, against the true 0.295520.',
  'Some smooth functions are not equal to their Taylor series (e^(−1/x²) at 0 has every derivative zero), and a series can have a limited radius of convergence: the series for 1/(1 + x²) fails beyond |x| = 1 because of poles at ±i.'
]);
WL.fy('m-partial', [
  'On a hillside the slope depends on which way you walk. One direction is steepest uphill, and the contour lines run at right angles to it.',
  '**Partial derivatives** give the slopes along x and along y; the **gradient** combines them into a vector that points uphill, with length equal to the steepest slope.',
  'The slope in a direction u is ∇f·u (the chain rule), largest when u points along ∇f. Along a contour f does not change, so ∇f·u = 0: the gradient is perpendicular to the contours.',
  'f = x² + 3y at (1, 2) has ∇f = (2, 3): the steepest slope is √13 ≈ 3.6, while walking along x gives only 2.',
  'Having both partial derivatives does not make a function differentiable: it can still misbehave along diagonal directions.'
]);
WL.fy('m-multiple', [
  'The bell-curve integral ∫e^(−x²)dx has no formula, yet squared and turned into a two-dimensional integral in polar coordinates it is easy: √π.',
  'A double integral adds up f over small patches of area. Changing coordinates changes the shape of the patches, and the **Jacobian** says how much area each new patch covers: r dr dθ in polar coordinates.',
  '(∫e^(−x²)dx)² = ∫∫e^(−(x² + y²))dx dy = ∫₀^(2π)∫₀^∞ e^(−r²) r dr dθ = 2π × ½ = π.',
  'In polar coordinates a patch of size dr × dθ at radius 2 has area 2 dr dθ: patches further out are bigger.',
  'Swapping the order of integration needs conditions (Fubini’s theorem); for badly behaved integrands the two orders can give different answers.'
]);
WL.fy('m-matrices', [
  'Every linear transformation of the plane, whether rotation, stretch, shear or reflection, is captured by four numbers.',
  'A matrix’s columns are where the basis vectors land. Multiplying matrices chains transformations, and the **determinant** is the factor by which areas (or volumes) scale; a determinant of zero squashes the space flat.',
  'Linearity, T(ax + by) = aT(x) + bT(y), means knowing T on the basis fixes it everywhere. Matrix multiplication is associative because chaining functions is.',
  'A rotation by 30° has determinant cos²30° + sin²30° = 1, so it keeps areas; the matrix with diagonal 3 and 2 has determinant 6.',
  'Not every useful map is linear, and nearly singular matrices amplify numerical errors (measured by the condition number).'
]);
WL.fy('m-eigen', [
  'A wobbling object settles into spinning about particular axes, and a vibrating drum has special patterns that keep their shape while they oscillate.',
  '**Eigenvectors** are the directions that a transformation only stretches, without turning; **eigenvalues** are the stretch factors. Along those directions a complicated linear system splits into independent simple ones.',
  'Av = λv requires det(A − λI) = 0. Symmetric matrices have real eigenvalues and perpendicular eigenvectors (the spectral theorem), which is why physical modes are independent of each other.',
  'The matrix with rows (2, 1) and (1, 2) has eigenvalue 3 along (1, 1) and 1 along (1, −1). Check: the trace, 4, is their sum, and the determinant, 3, their product.',
  'Not every matrix has a full set of eigenvectors (the shear with rows (1, 1) and (0, 1) has only one), and non-symmetric matrices can have complex eigenvalues.'
]);
WL.fy('m-ode2', [
  'A car’s suspension, a pendulum, an RLC circuit and a building in an earthquake all obey the same equation: ay″ + by′ + cy = f(t).',
  'Try y = e^(λt): every derivative just multiplies by λ, so the equation becomes a quadratic in λ. Real roots mean decay; complex roots mean oscillation that decays. A forcing term adds a particular solution.',
  'The equation is linear, so solutions add. The characteristic equation aλ² + bλ + c = 0 gives two independent solutions, and the general solution is their combination plus any one particular solution.',
  'y″ + 2y′ + 10y = 0 gives λ = −1 ± 3i: oscillation at 3 rad/s inside an envelope shrinking as e^(−t).',
  'Nonlinear equations, such as a pendulum swinging widely, have no such neat solutions, because superposition fails.'
]);
WL.fy('m-limits', [
  'Zeno’s paradox: to cross a room you must first cross half of it, then half of what is left, and so on for ever. Infinitely many steps, yet you arrive.',
  'A **limit** is the value a sequence gets arbitrarily close to. The ε–δ definition makes "arbitrarily close" precise: whatever tolerance you name, from some point on the sequence stays within it.',
  '½ + ¼ + ⅛ + … = 1, because after n terms the shortfall is 1/2ⁿ, which can be made smaller than any ε > 0 by taking n large enough.',
  'To be within 0.001 of 1 you need 2ⁿ > 1000, so ten steps.',
  'Limits do not always exist (sin(1/x) as x → 0 has none), and swapping two limits, such as a limit of sums and a sum of limits, needs care.'
]);
WL.fy('m-convergence', [
  '1 + ½ + ⅓ + ¼ + … grows without limit, though its terms shrink to zero, while 1 + ¼ + 1/9 + … settles to π²/6.',
  'For a series to converge its terms must shrink fast enough. The harmonic series shrinks too slowly: group its terms (½; ⅓ + ¼ > ½; ⅕ to ⅛ > ½; …) and you add more than ½ infinitely often.',
  'The integral test compares sums with integrals: Σ1/n behaves like ∫dx/x = ln x, which grows for ever, while Σ1/n² behaves like ∫dx/x², which converges. The ratio test handles series that behave like geometric ones.',
  'The harmonic series first passes 10 after 12 367 terms; it grows like ln n + 0.577.',
  'Convergent series can converge very slowly (Σ(−1)ⁿ/n), and a conditionally convergent series can be rearranged to give any sum you like.'
]);
WL.fy('m-curvilinear', [
  'The electric field of a charged sphere is simple in spherical coordinates, depending only on r, but messy in x, y and z.',
  'Choose coordinates that match the problem’s symmetry. In spherical coordinates a small volume is a little box of size r² sin θ dr dθ dφ: the further out, the bigger the boxes.',
  'With x = r sin θ cos φ and so on, the Jacobian is r² sin θ. Gradient, divergence and the Laplacian pick up scale factors: 1 for r, r for θ and r sin θ for φ.',
  'The volume of a sphere: ∫₀^R∫₀^π∫₀^(2π) r² sin θ dφ dθ dr = 4πR³/3.',
  'Every coordinate system has bad points, such as the poles or the axis, where some coordinates are undefined, and formulas need care there.'
]);
WL.fy('m-line-integrals', [
  'Climbing a hill, the work done against gravity depends only on the height gained, not on the route; the work against friction depends on the route.',
  'A **line integral** adds up F·dr along a path. For a **conservative** field it depends only on the end points, because F is the gradient of a potential.',
  'If F = ∇φ, then ∫F·dr = φ(B) − φ(A). On a region without holes, curl F = 0 is exactly the condition for the integral not to depend on the path.',
  'F = (y, x) is conservative with φ = xy, so from (0, 0) to (2, 3) the integral is 6 along any path.',
  'In a region with a hole, curl F = 0 is not enough: the magnetic field round a wire has zero curl outside the wire, yet its integral once round the wire is μ₀I.'
]);
WL.fy('m-vector-spaces', [
  'Polynomials, sound waves and quantum states can all be added and scaled like arrows, so the same geometry applies to all of them.',
  'A **vector space** is any collection in which adding and scaling make sense. A **basis** is a set of independent directions, and every element is one unique combination of them. **Linear maps** respect the adding and scaling.',
  'Every basis of a space has the same number of elements, its dimension. The rank–nullity theorem: the dimension of the image plus the dimension of the kernel equals the dimension you started with.',
  'Polynomials of degree at most 3 form a four-dimensional space (basis 1, x, x², x³). Differentiation maps it onto the polynomials of degree at most 2 (rank 3), and its kernel is the constants (dimension 1): 3 + 1 = 4.',
  'Infinite-dimensional spaces, such as spaces of functions, need extra structure (norms and completeness) before limits and bases make sense.'
]);
WL.fy('m-svd', [
  'Fit a straight line to scattered data points: no line goes through them all, yet there is one best line.',
  '**Least squares** projects the data onto the set of possible fits, leaving a residual at right angles to that set. The **singular value decomposition** writes any matrix as rotate, stretch, rotate, which reveals its most important directions.',
  'Minimising |Ax − b|² gives Aᵀ(Ax − b) = 0, the normal equations: the residual is perpendicular to every column of A. The SVD is A = UΣVᵀ, with the stretches in Σ.',
  'For the points (0, 1), (1, 2) and (2, 2), the best line is y ≈ 1.17 + 0.5x.',
  'Least squares is thrown off by outliers, because squaring magnifies large errors, and it assumes all the error is in y.'
]);
WL.fy('m-ode-systems', [
  'Rabbits and foxes: more rabbits feed more foxes, and more foxes eat more rabbits. The two populations rise and fall in cycles, the peaks of foxes lagging the peaks of rabbits.',
  'Plot the state, rabbits against foxes, as a point; the equations put an arrow at every point, and the solutions follow the arrows. The fixed points of this **phase plane**, and their stability, decide the long-term behaviour.',
  'Near a fixed point, linearise: x′ = Jx. The eigenvalues of the Jacobian J classify the point as a node, a saddle, a spiral or a centre.',
  'In the Lotka–Volterra model, small cycles round the equilibrium take 2π/√(ac), where a is the prey’s growth rate and c the predators’ death rate: with a = 1 and c = 0.5 per year, about 8.9 years.',
  'The Lotka–Volterra cycles are only neutrally stable: any disturbance changes them. Realistic models add limits to growth and give stable cycles or a steady state.'
]);
WL.fy('m-laplace', [
  'Engineers design control systems, such as autopilots and thermostats, by turning differential equations into algebra.',
  'The **Laplace transform** turns differentiation into multiplication by s (minus the starting values), so a differential equation becomes an algebraic one. Solve that, then transform back.',
  'L{f′} = sF(s) − f(0), by integration by parts. Poles of F(s) in the left half of the plane mean responses that die away; poles in the right half mean instability.',
  'y′ + 2y = 0 with y(0) = 3: sY − 3 + 2Y = 0, so Y = 3/(s + 2) and y = 3e^(−2t).',
  'The transform needs functions that do not grow too fast, and inverting it can be hard: in general it needs a contour integral in the complex plane.'
]);
})();
