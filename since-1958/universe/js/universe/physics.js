// The numbers behind the two events, kept apart from the drawing code so they
// can be checked on their own (see tests/astronomy/universe.test.mjs).
//
// Supernova: the standard light curve of a Type Ia.
// Merger: GW150914, with the orbit shrinking by the quadrupole formula for
// gravitational-wave energy loss (Peters 1964). The formula assumes slow speeds
// and weak gravity, so the last few orbits are an approximation.

// ------------------------------------------------------------------ constants
const GM_SUN = 1.32712440018e20;     // m^3 s^-2
const C = 299792458;                 // m s^-1
const M_SUN_KG = 1.98892e30;

// ================================================================== supernova
export const SN = {
  peak: -19.3,          // absolute magnitude at maximum
  rise: 18.5,           // days from explosion to maximum
  // Magnitudes below maximum, at days after maximum (B band, typical Type Ia).
  decline: [[0, 0], [5, 0.12], [10, 0.45], [15, 1.1], [20, 1.75], [30, 2.7], [40, 3.2], [60, 3.55], [100, 4.15], [140, 4.75]],
  start: -22, end: 110,
  daysPerSecond: 5,
};
/** Absolute magnitude of a typical Type Ia supernova, `day` days from maximum. null before it explodes. */
export function supernovaMagnitude(day) {
  if (day <= -SN.rise) return null;
  if (day < 0) {
    // Brightness grows as time squared at first (an expanding fireball), then levels off.
    const x = (day + SN.rise) / SN.rise;
    const L = x * x * (3 - 2 * x);
    return SN.peak - 2.5 * Math.log10(Math.max(L, 1e-6));
  }
  const k = SN.decline;
  for (let i = 1; i < k.length; i++) {
    if (day <= k[i][0]) {
      const f = (day - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
      return SN.peak + k[i - 1][1] + f * (k[i][1] - k[i - 1][1]);
    }
  }
  return SN.peak + k[k.length - 1][1];
}
/** Luminosity in Suns from an absolute magnitude (the Sun's is 4.83). */
export const sunsFromMagnitude = M => Math.pow(10, -0.4 * (M - 4.83));

// ============================================================ black hole merger
/** GW150914: masses in Suns. The orbit is followed from the moment it entered LIGO's band. */
export const MERGER = (() => {
  const m1 = 36, m2 = 29, mFinal = 62, f0 = 35, fMerge = 250, ringdown = 0.004;
  const M = m1 + m2, GM = GM_SUN * M;
  const sep = f => Math.cbrt(GM / Math.pow(Math.PI * f, 2));               // Kepler: separation for a wave frequency
  const a0 = sep(f0), aM = sep(fMerge);
  // Peters (1964): time for a circular binary to spiral in from separation a0.
  const tau = (5 / 256) * Math.pow(C, 5) * Math.pow(a0, 4) / (GM_SUN * m1 * GM_SUN * m2 * GM);
  const tMerge = tau * (1 - Math.pow(aM / a0, 4));
  const w0 = Math.PI * f0;                                                 // orbital angular speed at the start
  const phase = t => 1.6 * w0 * tau * (1 - Math.pow(Math.max(1 - t / tau, 0), 0.625));
  const rs = m => 2 * GM_SUN * m / (C * C);                                // Schwarzschild radius, metres
  return {
    m1, m2, mFinal, M, f0, fMerge, ringdown, a0, aM, tau, tMerge, w0, phase, rs,
    phaseMerge: phase(tMerge),
    energy: (M - mFinal) * M_SUN_KG * C * C,                               // joules carried off as gravitational waves
    slow: 120,                                                             // how much the film is slowed down
    after: 0.05,                                                           // seconds of ringdown and quiet to show
    /** The binary at real time t (seconds from the start). */
    at(t) {
      if (t < tMerge) {
        const a = a0 * Math.pow(1 - t / tau, 0.25);
        const f = Math.sqrt(GM / (a * a * a)) / Math.PI;
        return { merged: false, a, f, phi: phase(t), v: Math.sqrt(GM / a) / C, amp: a0 / a };
      }
      const dt = t - tMerge;
      return { merged: true, a: aM * Math.exp(-dt / (ringdown * 0.7)), f: fMerge, phi: this.phaseMerge + Math.PI * fMerge * dt, v: 0, amp: (a0 / aM) * Math.exp(-dt / ringdown), dt };
    },
    /** Gravitational-wave strain at real time t, in units of its value at the start. */
    strain(t) { const s = this.at(t); return s.amp * Math.cos(2 * s.phi); },
  };
})();

