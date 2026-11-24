/* Geodesic special-function library (double precision; checked against SciPy, see test notes in PLAN.md).
   WL.sf.{gamma,lgamma,beta,erf,erfc,besselJ,besselJzeros,sphJ,legendreP,assocP,Ylm,hermiteH,hoPsi,laguerre,Rnl,airyAi,airyBi,
          hyp2f1,hyp1f1,agm,ellipK,ellipE,ellipF,jacobi,zeta,polylog,bisect,zeros} */
(function () {
  const WL = (window.WL = window.WL || {}); const PI = Math.PI;
  const LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gamma(z) {
    if (z < 0.5) return PI / (Math.sin(PI * z) * gamma(1 - z));
    z -= 1; let x = LG[0]; for (let i = 1; i < 9; i++) x += LG[i] / (z + i);
    const t = z + 7.5; return Math.sqrt(2 * PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function lgamma(z) {
    if (z < 0.5) return Math.log(PI / Math.abs(Math.sin(PI * z))) - lgamma(1 - z);
    z -= 1; let x = LG[0]; for (let i = 1; i < 9; i++) x += LG[i] / (z + i);
    const t = z + 7.5; return 0.5 * Math.log(2 * PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  const beta = (a, b) => Math.exp(lgamma(a) + lgamma(b) - lgamma(a + b));
  function erfcCF(x) {
    let f = x, C = x, D = 0; const tiny = 1e-300;
    for (let i = 1; i < 500; i++) {
      const a = i / 2; D = x + a * D; if (D === 0) D = tiny; C = x + a / C; if (C === 0) C = tiny; D = 1 / D; const d = C * D; f *= d; if (Math.abs(d - 1) < 1e-16) break;
    }
    return Math.exp(-x * x) / Math.sqrt(PI) / f;
  }
  function erf(x) {
    const s = Math.sign(x); x = Math.abs(x);
    if (x < 2.5) { let term = x, sum = x; for (let n = 1; n < 200; n++) { term *= -x * x / n; const d = term / (2 * n + 1); sum += d; if (Math.abs(d) < 1e-17 * Math.abs(sum)) break; } return (s * 2 * sum) / Math.sqrt(PI); }
    return s * (1 - erfcCF(x));
  }
  const erfc = (x) => (x > 2.5 ? erfcCF(x) : 1 - erf(x));
  /* Bessel J_n for integer n: trapezoid rule on the periodic Bessel integral (spectrally accurate); real order: series */
  function besselJ(n, x) {
    if (Number.isInteger(n)) {
      if (n < 0) return (n % 2 ? -1 : 1) * besselJ(-n, x);
      const N = Math.max(64, Math.ceil(Math.abs(x) + n) * 2 + 48); let s = 0;
      for (let i = 0; i < N; i++) { const t = (2 * PI * i) / N; s += Math.cos(n * t - x * Math.sin(t)); }
      return s / N;
    }
    let term = Math.pow(x / 2, n) / gamma(n + 1), sum = term;
    for (let k = 1; k < 300; k++) { term *= -(x * x) / 4 / (k * (k + n)); sum += term; if (Math.abs(term) < 1e-17 * Math.abs(sum)) break; }
    return sum;
  }
  function sphJ(l, x) { // spherical Bessel j_l by upward recurrence (fine for x > l) or series
    if (Math.abs(x) < 1e-8) return l === 0 ? 1 : 0;
    if (x < l + 0.5) return Math.sqrt(PI / (2 * x)) * besselJ(l + 0.5, x);
    let j0 = Math.sin(x) / x, j1 = Math.sin(x) / (x * x) - Math.cos(x) / x; if (l === 0) return j0;
    for (let k = 1; k < l; k++) { const j2 = ((2 * k + 1) / x) * j1 - j0; j0 = j1; j1 = j2; } return j1;
  }
  function bisect(f, a, b, tol = 1e-13) { let fa = f(a); for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } if (b - a < tol) break; } return (a + b) / 2; }
  function zeros(f, a, b, step = 0.05, max = 50) { const out = []; let x0 = a, f0 = f(a); for (let x = a + step; x <= b && out.length < max; x += step) { const f1 = f(x); if (f0 * f1 < 0) out.push(bisect(f, x - step, x)); x0 = x; f0 = f1; } return out; }
  const besselJzeros = (n, count = 5) => zeros((x) => besselJ(n, x), n === 0 ? 0.5 : n * 0.9 + 0.5, 3.2 * (count + n + 2) + 10, 0.05, count);
  function legendreP(l, x) { if (l === 0) return 1; let p0 = 1, p1 = x; for (let k = 1; k < l; k++) { const p2 = ((2 * k + 1) * x * p1 - k * p0) / (k + 1); p0 = p1; p1 = p2; } return p1; }
  function assocP(l, m, x) { // with Condon–Shortley phase, 0 <= m <= l
    let pmm = 1; const s = Math.sqrt(Math.max(0, (1 - x) * (1 + x))); let f = 1;
    for (let i = 1; i <= m; i++) { pmm *= -f * s; f += 2; }
    if (l === m) return pmm; let pmm1 = x * (2 * m + 1) * pmm; if (l === m + 1) return pmm1;
    let pl = 0; for (let ll = m + 2; ll <= l; ll++) { pl = (x * (2 * ll - 1) * pmm1 - (ll + m - 1) * pmm) / (ll - m); pmm = pmm1; pmm1 = pl; } return pl;
  }
  function Ylm(l, m, th, ph) { // real spherical harmonic (orthonormal)
    const am = Math.abs(m), N = Math.sqrt(((2 * l + 1) / (4 * PI)) * Math.exp(lgamma(l - am + 1) - lgamma(l + am + 1)));
    const P = assocP(l, am, Math.cos(th));
    if (m === 0) return N * P; return Math.SQRT2 * N * P * (m > 0 ? Math.cos(am * ph) : Math.sin(am * ph));
  }
  function hermiteH(n, x) { if (n === 0) return 1; let h0 = 1, h1 = 2 * x; for (let k = 1; k < n; k++) { const h2 = 2 * x * h1 - 2 * k * h0; h0 = h1; h1 = h2; } return h1; }
  function hoPsi(n, x) { let p0 = Math.pow(PI, -0.25) * Math.exp(-x * x / 2); if (n === 0) return p0; let p1 = Math.SQRT2 * x * p0; for (let k = 1; k < n; k++) { const p2 = Math.sqrt(2 / (k + 1)) * x * p1 - Math.sqrt(k / (k + 1)) * p0; p0 = p1; p1 = p2; } return p1; }
  function laguerre(n, a, x) { if (n === 0) return 1; let l0 = 1, l1 = 1 + a - x; for (let k = 1; k < n; k++) { const l2 = ((2 * k + 1 + a - x) * l1 - (k + a) * l0) / (k + 1); l0 = l1; l1 = l2; } return l1; }
  function Rnl(n, l, r) { // hydrogen radial function, atomic units
    const rho = (2 * r) / n, N = Math.sqrt(Math.pow(2 / n, 3) * Math.exp(lgamma(n - l) - lgamma(n + l + 1)) / (2 * n));
    return N * Math.pow(rho, l) * Math.exp(-rho / 2) * laguerre(n - l - 1, 2 * l + 1, rho);
  }
  const A0 = 0.355028053887817239, B0 = 0.258819403792806798, U1 = 5 / 72, U2 = 385 / 10368;
  function airySeries(x) {
    let f = 1, g = x, tf = 1, tg = x;
    for (let k = 1; k < 200; k++) { tf *= (x * x * x) / ((3 * k - 1) * (3 * k)); tg *= (x * x * x) / ((3 * k) * (3 * k + 1)); f += tf; g += tg; if (Math.abs(tf) + Math.abs(tg) < 1e-17 * (Math.abs(f) + Math.abs(g))) break; }
    return [A0 * f - B0 * g, Math.sqrt(3) * (A0 * f + B0 * g)];
  }
  const UA = [1, 0.0694444444444444, 0.037133487654321, 0.0379930591278006, 0.0576491904126697, 0.116099064025515];
  const asum = (z, sgn) => UA.reduce((acc, u, k) => acc + (sgn < 0 && k % 2 ? -1 : 1) * u / Math.pow(z, k), 0);
  const PQ = (z) => [1 - UA[2] / (z * z) + UA[4] / Math.pow(z, 4), UA[1] / z - UA[3] / Math.pow(z, 3) + UA[5] / Math.pow(z, 5)];
  function airyAi(x) {
    if (x > 5) { const z = (2 / 3) * Math.pow(x, 1.5); return (Math.exp(-z) / (2 * Math.sqrt(PI) * Math.pow(x, 0.25))) * asum(z, -1); }
    if (x < -9) { const y = -x, z = (2 / 3) * Math.pow(y, 1.5), p = z + PI / 4, [P, Q] = PQ(z); return (Math.sin(p) * P - Math.cos(p) * Q) / (Math.sqrt(PI) * Math.pow(y, 0.25)); }
    return airySeries(x)[0];
  }
  function airyBi(x) {
    if (x > 7) { const z = (2 / 3) * Math.pow(x, 1.5); return (Math.exp(z) / (Math.sqrt(PI) * Math.pow(x, 0.25))) * asum(z, 1); }
    if (x < -9) { const y = -x, z = (2 / 3) * Math.pow(y, 1.5), p = z + PI / 4, [P, Q] = PQ(z); return (Math.cos(p) * P + Math.sin(p) * Q) / (Math.sqrt(PI) * Math.pow(y, 0.25)); }
    return airySeries(x)[1];
  }
  function hyp2f1(a, b, c, z) { let t = 1, s = 1; for (let n = 0; n < 5000; n++) { t *= ((a + n) * (b + n)) / ((c + n) * (n + 1)) * z; s += t; if (Math.abs(t) < 1e-16 * Math.abs(s)) break; } return s; }
  function hyp1f1(a, b, z) { let t = 1, s = 1; for (let n = 0; n < 5000; n++) { t *= (a + n) / ((b + n) * (n + 1)) * z; s += t; if (Math.abs(t) < 1e-16 * Math.abs(s)) break; } return s; }
  function agm(a, b) { for (let i = 0; i < 60 && Math.abs(a - b) > 1e-15 * a; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)]; return (a + b) / 2; }
  const ellipK = (k) => (k >= 1 ? Infinity : PI / (2 * agm(1, Math.sqrt(1 - k * k)))); // modulus k
  function ellipE(k) {
    if (k >= 1) return 1; let a = 1, b = Math.sqrt(1 - k * k), c = k, sum = 0.5 * c * c, p = 0.5;
    for (let i = 0; i < 60 && Math.abs(c) > 1e-16; i++) { c = (a - b) / 2; [a, b] = [(a + b) / 2, Math.sqrt(a * b)]; p *= 2; sum += p * c * c; }
    return (PI / (2 * a)) * (1 - sum);
  }
  function ellipF(phi, k, n = 400) { let s = 0; const h = phi / n; for (let i = 0; i <= n; i++) { const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2, sp = Math.sin(i * h); s += w / Math.sqrt(1 - k * k * sp * sp); } return (s * h) / 3; }
  function jacobi(u, k) { // returns [sn, cn, dn, am]
    if (k < 1e-9) return [Math.sin(u), Math.cos(u), 1, u];
    if (k > 1 - 1e-12) { const t = Math.tanh(u), s = 1 / Math.cosh(u); return [t, s, s, 2 * Math.atan(Math.exp(u)) - PI / 2]; }
    const a = [1], c = [k]; let b = Math.sqrt(1 - k * k), N = 0;
    while (Math.abs(c[N]) > 1e-16 && N < 30) { a.push((a[N] + b) / 2); c.push((a[N] - b) / 2); b = Math.sqrt(a[N] * b); N++; }
    let ph = Math.pow(2, N) * a[N] * u; let ph1 = ph;
    for (let n = N; n > 0; n--) { ph1 = ph; ph = (ph + Math.asin((c[n] / a[n]) * Math.sin(ph))) / 2; }
    return [Math.sin(ph), Math.cos(ph), Math.cos(ph) / Math.cos(ph1 - ph), ph];
  }
  const BD = (() => { const n = 40, d = []; let s = 0; for (let i = 0; i <= n; i++) { s += Math.exp(lgamma(n + i) - lgamma(n - i + 1) - lgamma(2 * i + 1) + i * Math.log(4)) * n; d.push(s); } return d; })();
  function eta(s) { const n = 40; let sum = 0; for (let k = 0; k < n; k++) sum += ((k % 2 ? -1 : 1) * (BD[k] - BD[n])) / Math.pow(k + 1, s); return -sum / BD[n]; }
  function zeta(s) {
    if (s === 1) return Infinity;
    if (s < 0.5) return Math.pow(2, s) * Math.pow(PI, s - 1) * Math.sin((PI * s) / 2) * gamma(1 - s) * zeta(1 - s);
    return eta(s) / (1 - Math.pow(2, 1 - s));
  }
  function polylog(s, z) { if (z === 1) return zeta(s); let t = z, sum = 0; for (let k = 1; k < 100000; k++) { const d = t / Math.pow(k, s); sum += d; if (Math.abs(d) < 1e-16 * Math.abs(sum)) break; t *= z; } return sum; }
  WL.sf = { gamma, lgamma, beta, erf, erfc, besselJ, besselJzeros, sphJ, legendreP, assocP, Ylm, hermiteH, hoPsi, laguerre, Rnl, airyAi, airyBi, hyp2f1, hyp1f1, agm, ellipK, ellipE, ellipF, jacobi, zeta, eta, polylog, bisect, zeros };
})();
