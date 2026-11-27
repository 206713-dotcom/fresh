// Calm space ambience, generated live with the Web Audio API: no audio file to download,
// and only a handful of sine oscillators, so it costs almost nothing while the 3D scene runs.
// Original procedural sound (slow drifting chords), not a recording of any existing piece.

const CHORDS = [            // Hz; slow, open voicings around D
  [73.42, 110.00, 146.83, 220.00, 329.63, 440.00],   // D  A  D  A  E  A
  [65.41, 98.00, 146.83, 196.00, 293.66, 392.00],    // C  G  D  G  D  G
  [58.27, 116.54, 174.61, 233.08, 293.66, 349.23],   // Bb Bb F  Bb D  F
  [55.00, 110.00, 164.81, 220.00, 329.63, 493.88],   // A  A  E  A  E  B
];

export class Ambient {
  constructor() { this.ctx = null; this.on = false; this.timer = 0; this.i = 0; }

  _build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = this.ctx = new AC({ latencyHint: 'playback' });
    const master = this.master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.3;
    // one feedback echo gives the sense of a very large space
    const delay = ctx.createDelay(1.5); delay.delayTime.value = 0.83;
    const fb = ctx.createGain(); fb.gain.value = 0.42;
    const wet = ctx.createGain(); wet.gain.value = 0.5;
    lp.connect(master); lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(ctx.destination);
    this.voices = CHORDS[0].map((f, k) => {
      const o = ctx.createOscillator(); o.type = k < 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (k % 2 ? 4 : -4);
      const g = ctx.createGain(); g.gain.value = 0;
      // each voice breathes in and out at its own slow pace
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.035 + k * 0.011;
      const depth = ctx.createGain(); depth.gain.value = 0.03 / (1 + k * 0.35);
      const base = ctx.createConstantSource ? ctx.createConstantSource() : null;
      lfo.connect(depth); depth.connect(g.gain);
      if (base) { base.offset.value = 0.045 / (1 + k * 0.35); base.connect(g.gain); base.start(); } else g.gain.value = 0.045 / (1 + k * 0.35);
      o.connect(g); g.connect(lp); o.start(); lfo.start();
      return o;
    });
    return true;
  }

  _next() {
    this.i = (this.i + 1) % CHORDS.length;
    const t = this.ctx.currentTime;
    this.voices.forEach((o, k) => o.frequency.setTargetAtTime(CHORDS[this.i][k], t, 2.5));   // glide, never jump
  }

  /** Must be called from a click or key press (browsers block sound before that). */
  start() {
    if (this.on) return;
    if (!this.ctx && !this._build()) return;
    this.on = true;
    this.ctx.resume();
    this.master.gain.setTargetAtTime(0.55, this.ctx.currentTime, 2.0);   // slow fade in
    this.timer = setInterval(() => this._next(), 24000);
  }

  stop() {
    if (!this.on) return;
    this.on = false;
    clearInterval(this.timer);
    const ctx = this.ctx;
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(() => { if (!this.on) ctx.suspend(); }, 2000);            // no audio work at all while muted
  }

  toggle() { this.on ? this.stop() : this.start(); return this.on; }
}
