// Simulation clock: time, speed presets, pause, hold (used during camera flights),
// automatic braking before events, and event-crossing detection.

import {
  SPEEDS, DEFAULT_SPEED_INDEX, START_TIME, TIME_MIN, TIME_MAX,
  APPROACH_WINDOW_S, APPROACH_TAU_S, APPROACH_FLOOR,
} from '../config.js';

export class SimClock {
  constructor(events = []) {
    this.ms = START_TIME;
    this.speedIndex = DEFAULT_SPEED_INDEX;
    this.paused = false;
    this.holds = 0;                 // > 0 while something (a flight) needs time frozen
    this.autoSlow = true;
    this.effective = SPEEDS[this.speedIndex].k;
    this.braking = false;
    this.linger = 0; this.lingerSpeed = APPROACH_FLOOR;      // seconds left to stay slow after an event, and how slow
    this.events = events.slice().sort((a, b) => a.ms - b.ms);
    this.listeners = { event: [], jump: [] };
  }

  on(type, fn) { this.listeners[type].push(fn); }
  emit(type, payload) { for (const fn of this.listeners[type]) fn(payload); }

  get userSpeed() { return SPEEDS[this.speedIndex].k; }
  get speedLabel() { return SPEEDS[this.speedIndex].label; }
  get running() { return !this.paused && this.holds === 0; }

  setSpeedIndex(i) {
    this.speedIndex = Math.max(0, Math.min(SPEEDS.length - 1, i));
  }

  /** Index of the first event strictly after ms. */
  nextEventIndex(ms) {
    let lo = 0, hi = this.events.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.events[mid].ms <= ms) lo = mid + 1; else hi = mid; }
    return lo;
  }
  nextEvent(ms = this.ms) { return this.events[this.nextEventIndex(ms)] || null; }
  prevEvent(ms = this.ms) {
    const i = this.nextEventIndex(ms - 1) - 1;
    return i >= 0 ? this.events[i] : null;
  }

  /** Jump without firing events (used by the pickers, timeline and buttons). */
  jumpTo(ms) {
    const old = this.ms;
    this.ms = Math.max(TIME_MIN, Math.min(TIME_MAX, ms)); this.linger = 0;
    this.emit('jump', { from: old, to: this.ms });
  }

  tick(dtReal) {
    dtReal = Math.min(dtReal, 0.1);
    if (!this.running) { this.braking = false; return; }

    let target = this.userSpeed;
    this.braking = false;
    // A film is coming up: slow down gently and from far away, whatever the settings, so that
    // nobody fast-forwards straight past it.
    const hold = this.nextEvent();
    if (hold && hold.film && target > 1800) {
      const remaining = (hold.ms - this.ms) / 1000;
      if (remaining < target * 5) { const braked = Math.max(1800, remaining / 1.3); if (braked < target) { target = braked; this.braking = true; this.holding = hold; } }
    }
    if (!this.braking && (this.autoSlow || (hold && hold.news)) && target > APPROACH_FLOOR) {
      const next = this.nextEvent();
      if (next) {
        const remaining = (next.ms - this.ms) / 1000;           // simulated seconds
        if (remaining < target * APPROACH_WINDOW_S) {
          const braked = Math.max(APPROACH_FLOOR, remaining / APPROACH_TAU_S);
          if (braked < target) { target = braked; this.braking = true; }
        }
      }
    }
    // An event has just happened: stay slow while its notice is on screen, so the slow moment is the event itself.
    if (this.linger > 0) { this.linger -= dtReal; if (target > this.lingerSpeed) { target = this.lingerSpeed; this.braking = true; } }
    // Slow down instantly (never overshoot an event), speed back up gently in log space.
    if (target <= this.effective) this.effective = target;
    else this.effective = Math.min(target, this.effective * Math.exp(1.5 * dtReal));

    const before = this.ms;
    this.ms = Math.max(TIME_MIN, Math.min(TIME_MAX, this.ms + this.effective * dtReal * 1000));

    // Fire events crossed during continuous flow (cap so a huge step does not spam).
    let i = this.nextEventIndex(before);
    let fired = 0;
    while (i < this.events.length && this.events[i].ms <= this.ms && fired < 4) {
      const ev = this.events[i];
      if (this.autoSlow || ev.film || ev.news) { this.linger = ev.news ? 6 : 4; this.lingerSpeed = Math.min(this.effective, APPROACH_FLOOR); }
      this.emit('event', ev);
      i++; fired++;
    }
  }
}
