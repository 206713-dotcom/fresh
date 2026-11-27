// Top-right clock: date readout with drum pickers, play/pause, speed, event skipping.

import { openWheel } from './wheel.js';
import { MONTHS, parts, fmtHM, fmtSpan, daysInMonth, esc } from './format.js';
import { YEAR_MIN, YEAR_MAX, SPEEDS } from '../config.js';

/** Roman numerals; zero is N (nulla), as medieval scribes wrote it */
function roman(n) { if (!n) return 'N'; let s = ''; for (const [v, r] of [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]) while (n >= v) { s += r; n -= v; } return s; }

export class ClockUI {
  constructor(clock, { onNext, onPrev }) {
    this.clock = clock;
    const $ = (id) => document.getElementById(id);
    this.el = { clock: $('clock'), yr: $('yr'), mon: $('mon'), day: $('day'), hm: $('hm'), play: $('play'),
      slower: $('slower'), faster: $('faster'), next: $('next'), prevEv: $('prevEv'), nextEv: $('nextEv'),
      speedLabel: $('speedLabel'), speedNote: $('speedNote'), autoslow: $('autoslow') };
    this.cache = {};
    const e = this.el;

    e.yr.addEventListener('click', () => {
      const p = parts(clock.ms);
      const items = [];
      for (let y = YEAR_MIN; y <= YEAR_MAX; y++) items.push({ label: String(y), value: y });
      openWheel({ anchor: e.yr, title: 'Year', items, index: p.y - YEAR_MIN, onChange: (i) => this.setYMD(YEAR_MIN + i, null, null) });
    });
    e.mon.addEventListener('click', () => {
      const p = parts(clock.ms);
      openWheel({ anchor: e.mon, title: 'Month', items: MONTHS.map((m, i) => ({ label: m, value: i })), index: p.m,
        onChange: (i) => this.setYMD(null, i, null) });
    });
    e.day.addEventListener('click', () => {
      const p = parts(clock.ms);
      const n = daysInMonth(p.y, p.m);
      const items = Array.from({ length: n }, (_, i) => ({ label: String(i + 1), value: i + 1 }));
      openWheel({ anchor: e.day, title: 'Day', items, index: p.d - 1, onChange: (i) => this.setYMD(null, null, i + 1) });
    });
    e.play.addEventListener('click', () => this.togglePause());
    e.slower.addEventListener('click', () => clock.setSpeedIndex(clock.speedIndex - 1));
    e.faster.addEventListener('click', () => clock.setSpeedIndex(clock.speedIndex + 1));
    e.nextEv.addEventListener('click', onNext);
    e.next.addEventListener('click', onNext);
    e.prevEv.addEventListener('click', onPrev);
    e.autoslow.addEventListener('change', () => { clock.autoSlow = e.autoslow.checked; });

    window.addEventListener('keydown', (ev) => {
      if (ev.target.closest && ev.target.closest('input, textarea, .wheel')) return;
      if (document.getElementById('walkbar') && !document.getElementById('walkbar').hidden) return;   // walking: keys move the astronaut
      if (ev.key === ' ') { ev.preventDefault(); this.togglePause(); }
      else if (ev.key === '+' || ev.key === '=' || ev.key === ']') clock.setSpeedIndex(clock.speedIndex + 1);
      else if (ev.key === '-' || ev.key === '_' || ev.key === '[') clock.setSpeedIndex(clock.speedIndex - 1);
      else if (ev.key === 'n' || ev.key === 'N') onNext();
      else if (ev.key === 'p' || ev.key === 'P') onPrev();
    });
  }

  togglePause() {
    this.clock.paused = !this.clock.paused;
    this.el.play.setAttribute('aria-label', this.clock.paused ? 'Play' : 'Pause');
  }

  setYMD(y, m, d) {
    const now = new Date(this.clock.ms);
    const p = parts(this.clock.ms);
    y = y ?? p.y; m = m ?? p.m; d = d ?? p.d;
    d = Math.min(d, daysInMonth(y, m));
    this.clock.jumpTo(Date.UTC(y, m, d, p.h, p.mi, now.getUTCSeconds()));
  }

  set(key, el, text, html = false) {
    if (this.cache[key] === text) return;
    this.cache[key] = text;
    if (html) el.innerHTML = text; else el.textContent = text;
  }

  update({ timelapse, flying }) {
    const c = this.clock, e = this.el, p = parts(c.ms);
    // the year and the time in everyday figures, set in a Roman-capital typeface (Cinzel)
    this.set('yr', e.yr, `<span class="rn">${p.y}</span>`, true);
    this.set('mon', e.mon, MONTHS[p.m]);
    this.set('day', e.day, String(p.d));
    this.set('hm', e.hm, `<span class="rn">${fmtHM(c.ms)}</span>`, true);
    e.clock.classList.toggle('paused', c.paused);
    this.set('speed', e.speedLabel, c.paused ? 'Paused' : c.braking ? `${speedText(c.effective)}` : SPEEDS[c.speedIndex].label);

    let note = '', brake = false;
    const nx = c.nextEvent();
    if (flying) note = 'Time stops while you fly';
    else if (c.braking && nx) { note = `Slowing down for ${nx.title}`; brake = true; }
    else if (timelapse && !c.paused) note = 'Earth\'s spin shown slower than real';
    else if (c.paused) note = `Set to ${SPEEDS[c.speedIndex].label}`;
    this.set('note', e.speedNote, note);
    e.speedNote.classList.toggle('brake', brake);

    if (nx) {
      const s = (nx.ms - c.ms) / 1000;
      this.set('next', e.next, `Next: <b>${esc(nx.title)}</b><span class="when">in ${fmtSpan(s)} of mission time</span>`, true);
    } else this.set('next', e.next, 'No more events after this date', true);
  }
}

function speedText(k) {
  if (k >= 86400) return `${(k / 86400).toFixed(k >= 864000 ? 0 : 1)} days / s`;
  if (k >= 3600) return `${(k / 3600).toFixed(k >= 36000 ? 0 : 1)} hours / s`;
  if (k >= 60) return `${Math.round(k / 60)} min / s`;
  return `${Math.round(k)}× real time`;
}
