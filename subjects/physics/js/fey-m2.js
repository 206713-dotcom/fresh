/* Geodesic: "See it like Feynman" sections, m2. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('m-divcurl', [
  'Water swirling down a plughole and water gushing from a hose are both flows, but different ones: one circulates, the other spreads out.',
  '**Divergence** measures how much a field spreads out from a point, as from a source; **curl** measures how much it swirls round a point, as a tiny paddle wheel placed there would spin.',
  'div F is the net outflow per unit volume of a tiny box; curl F is the circulation per unit area round a tiny loop, pointing along the loop’s axis.',
  'F = (x, y, z) has divergence 3 everywhere: uniform expansion. F = (−y, x, 0) has curl (0, 0, 2): rigid rotation at angular speed 1, since vorticity is twice the angular speed.',
  'A flow can circulate round a line with zero curl everywhere outside it (a vortex), and divergence and curl need a field smooth enough to differentiate.'
]);
WL.fy('m-theorems', [
  'To know how much water flows out of a region you can either add up all the sources inside or measure the flow through the boundary, and the two answers agree.',
  'Add up the outflows of tiny boxes filling a volume: across every inner face, one box’s outflow is its neighbour’s inflow, so they cancel, and only the boundary is left. Tiny loops filling a surface do the same for circulation: Stokes’ theorem.',
  '∫∫∫ div F dV = ∯ F·dA and ∫∫ (curl F)·dA = ∮ F·dr. Both are versions of the fundamental theorem of calculus.',
  'F = (x, y, z) through a sphere of radius R: div F = 3, so the flux is 3 × (4/3)πR³ = 4πR³. Directly, F·n = R over an area 4πR², again 4πR³.',
  'The theorems need a closed, reasonably smooth surface and a field that is smooth inside; point sources, such as point charges, need delta functions.'
]);
WL.fy('m-fourier-series', [
  'A violin and a flute playing the same note sound different: they share the fundamental frequency but mix in different amounts of its harmonics.',
  'Any periodic signal is a sum of sines and cosines at whole-number multiples of its base frequency, and the **Fourier coefficients** say how much of each harmonic is present.',
  'Different harmonics are orthogonal over a period (∫sin mx sin nx dx = 0 for m ≠ n), so each coefficient can be found on its own by projecting: aₙ = (1/π)∫f(x) cos nx dx.',
  'A square wave is (4/π)(sin x + sin 3x/3 + sin 5x/5 + …). At x = π/2 this gives (4/π)(1 − 1/3 + 1/5 − …) = (4/π)(π/4) = 1, as it should.',
  'Near a jump the partial sums overshoot by about 9 % of the jump (the Gibbs phenomenon), and for very rough functions convergence holds only on average.'
]);
WL.fy('m-fourier-transform', [
  'A sharp click contains every frequency, while a pure tone would have to last for ever. The shorter a pulse, the wider the spread of its frequencies.',
  'The **Fourier transform** describes a signal by how much of each frequency it contains. Squeeze the signal in time and its spectrum spreads in frequency.',
  'F(ω) = ∫f(t)e^(−iωt)dt, and stretching t by a factor a squeezes ω by 1/a. A Gaussian pulse achieves the smallest possible product of spreads, Δt Δω = ½: the uncertainty relation.',
  'A note lasting 10 seconds can be tuned to within about 0.1 Hz; a click lasting 0.01 s spreads over at least about 100 Hz.',
  'The transform needs signals that die away (or the theory of distributions), and real signals are sampled and finite, so in practice the discrete transform is used.'
]);
WL.fy('m-pde', [
  'Heat a metal rod at one point and the heat spreads, the peak flattening and widening; pluck a string and its shape splits into two pulses running opposite ways.',
  '**Partial differential equations** describe quantities that vary in space and time. The heat equation smooths things out, the wave equation carries them along, and Laplace’s equation describes the settled state.',
  'Heat: ∂u/∂t = D∇²u, so a point changes in proportion to how much it differs from the average of its neighbours. Waves: ∂²u/∂t² = c²∇²u. Laplace: ∇²u = 0, every point equal to the average of its surroundings.',
  'Heat spreads a distance of about √(Dt). In copper (D ≈ 1.1 × 10⁻⁴ m²/s) 10 cm takes about 90 s; in wood (D ≈ 10⁻⁷ m²/s), about a day.',
  'Nonlinear equations, such as Navier–Stokes or general relativity, can form shocks or singularities and rarely have exact solutions.'
]);
WL.fy('m-variations', [
  'The fastest slide between two points is not a straight line but a cycloid (Johann Bernoulli’s brachistochrone, 1696): starting steeper gains speed early.',
  'Instead of the best number, find the best function: the curve that makes a total, such as a time, a length or an action, stationary. Vary the curve slightly, demand no change to first order, and you get an equation the curve must obey.',
  'δ∫F(y, y′, x)dx = 0 gives the Euler–Lagrange equation, d/dx(∂F/∂y′) = ∂F/∂y. For the brachistochrone, F = √(1 + y′²)/√(2gy).',
  'For a drop of 1 m over 1.57 m sideways, the cycloid takes π√(0.5/9.8) ≈ 0.71 s; the straight ramp takes about 0.84 s, nearly 20 % longer.',
  'The Euler–Lagrange equation finds stationary curves, not necessarily minima, and constraints need Lagrange multipliers.'
]);
WL.fy('m-lagrange-mult', [
  'Of all rectangular boxes with the same surface area, the cube holds the most. Constraints shape the best answer.',
  'At the best point on a constraint surface, the gradient of what you are optimising must be at right angles to the surface, parallel to the constraint’s gradient; otherwise you could slide along the surface and do better.',
  'At the optimum ∇f = λ∇g. The multiplier λ says how much the optimum improves for each unit the constraint is relaxed: a "shadow price".',
  'Maximise xyz subject to 2(xy + yz + zx) = 6: the symmetric solution x = y = z = 1, volume 1.',
  'Lagrange’s condition finds candidates, which must still be checked; inequality constraints need the Karush–Kuhn–Tucker conditions.'
]);
WL.fy('m-probability', [
  'Toss a coin a million times: the number of heads is very probably (95 %) within about 1000 of 500 000, almost certainly within 1500, and the possible counts form an almost perfect bell curve.',
  'Counting arrangements gives n!/(k!(n − k)!). **Stirling’s approximation** turns those enormous factorials into exponentials, and near the peak the binomial becomes a Gaussian.',
  'ln n! ≈ n ln n − n + ½ ln(2πn). Expanding the logarithm of the binomial coefficient about k = n/2 to second order gives exp(−2(k − n/2)²/n): a Gaussian with σ = √n/2.',
  'For n = 10⁶, σ = 500, so 95 % of results lie within ±1000. Stirling at n = 10 gives 3 598 696 against the exact 10! = 3 628 800, 0.8 % low.',
  'The Gaussian fails far out in the tails, for rare events, where large-deviation theory is needed.'
]);
WL.fy('m-delta', [
  'A point charge has a finite total charge but no size, so its density is infinite at one point and zero everywhere else. A hammer blow delivers a finite impulse in almost no time.',
  'The **Dirac delta** is a spike of zero width and unit area that picks out the value of a function where it sits: ∫f(x)δ(x − a)dx = f(a).',
  'It is the limit of narrower and taller bumps of unit area; rigorously it is a distribution, defined by what it does inside integrals. Its Fourier transform is 1: every frequency in equal measure.',
  'An impulse of 1 N s delivered in 1 ms means an average force of 1000 N; as the time shrinks the force becomes a delta function of weight 1 N s.',
  'Delta functions cannot be squared or multiplied together meaningfully, which causes real difficulties in quantum field theory.'
]);
WL.fy('m-separation', [
  'A guitar string’s vibration, the temperature in a cooling slab and the potential in a box all break into simple pieces, each a function of space times a function of time.',
  'Guess u(x, t) = X(x)T(t), and the PDE splits into two ordinary equations linked by a constant. The boundary conditions allow only certain constants (eigenvalues), and the full solution is a sum of these **modes**.',
  'Substituting gives X″/X = T′/(DT) = −k². Each side depends on a different variable, so both must equal the same constant, and X(0) = X(L) = 0 allows only k = nπ/L.',
  'In a slab of thickness L the slowest mode dies away with time constant L²/(π²D): for a 2 cm stainless-steel plate (D ≈ 4 × 10⁻⁶ m²/s) about 10 s.',
  'Separation works only for special geometries and linear equations whose boundaries fit the coordinates.'
]);
WL.fy('m-dft', [
  'A phone app recognises a song from a few seconds of audio by turning it into a fingerprint of frequencies, a calculation that would be hopelessly slow done the direct way.',
  'The **discrete Fourier transform** gives the frequency content of N samples. The **fast Fourier transform** computes it by splitting the samples into even and odd halves again and again, reusing the work.',
  'X_k = Σx_n e^(−2πikn/N). Splitting gives two transforms of size N/2, recombined with "twiddle factors", so the cost is about N log₂N instead of N².',
  'For N = 2²⁰, about a million samples, the direct way needs about 10¹² operations and the FFT about 2 × 10⁷: some 50 000 times faster.',
  'You must sample at least twice as fast as the highest frequency present (Nyquist), or high frequencies masquerade as low ones, and a finite window smears sharp peaks.'
]);
WL.fy('m-statistics-uni', [
  'A new drug works in 8 of 10 patients. How sure should you be that it beats the old one, which works in 60 %? It depends on what you believed before.',
  '**Bayesian inference** updates beliefs: posterior ∝ likelihood × prior. Frequentist methods ask instead how surprising the data would be under a stated hypothesis.',
  'Bayes’ theorem: P(θ | data) ∝ P(data | θ)P(θ). Starting from a uniform prior on the success rate p, 8 successes in 10 give a Beta(9, 3) posterior, with mean 9/12 = 0.75.',
  'Under that posterior, P(p > 0.6) ≈ 0.88.',
  'With little data the answer depends on the prior, and regression assumes a form for the model that may be wrong.'
]);
WL.fy('m-random-walks', [
  'A drop of ink spreads through still water, but after four times as long it has spread only twice as far.',
  'Each molecule takes random steps. The average displacement is zero, but the typical distance grows as the square root of the number of steps. Many random walkers together obey the **diffusion equation**.',
  'After N steps of length ℓ, ⟨x²⟩ = Nℓ², because the cross terms average to zero. With N = t/τ that becomes ⟨x²⟩ = 2Dt, with D = ℓ²/(2τ).',
  'Sugar in water (D ≈ 5 × 10⁻¹⁰ m²/s) spreads 1 mm in about x²/2D = 1000 s, around 17 minutes, but 1 cm in about 28 hours: which is why we stir tea.',
  'Real walks can have correlated steps or occasional huge jumps (Lévy flights), which give anomalous diffusion.'
]);
})();
