// Bottom timeline: event ticks coloured by place, a playhead, click or drag to travel.

import { fmtDate, esc } from './format.js';

const COLORS = { earth: 'var(--earth)', moon: 'var(--moon)', mars: 'var(--mars)', space: 'var(--deep)' };

export class Timeline {
  constructor(el, events, { start, end, onJump, onEvent }) {
    this.el = el; this.start = start; this.end = end;
    el.innerHTML = '<div class="tl-bar"></div><div class="tl-hit"></div><div class="tl-head"></div>';
    this.head = el.querySelector('.tl-head');
    const frac = (ms) => (ms - start) / (end - start);
    const y0 = new Date(start).getUTCFullYear(), y1 = new Date(end).getUTCFullYear();
    for (let y = Math.ceil(y0 / 10) * 10; y <= y1; y += 10) {
      const t = document.createElement('div');
      t.className = 'tl-year'; t.textContent = y;
      t.style.left = `${frac(Date.UTC(y, 0, 1)) * 100}%`;
      el.appendChild(t);
    }
    const tip = document.createElement('div');
    tip.className = 'tl-tip'; tip.hidden = true;
    el.appendChild(tip);
    for (const e of events) {
      const t = document.createElement('button');
      t.className = 'tl-tick';
      t.style.left = `${frac(e.ms) * 100}%`;
      t.style.setProperty('--c', COLORS[e.body]);
      t.setAttribute('aria-label', `${e.title}, ${fmtDate(e.ms)}`);
      t.addEventListener('pointerenter', () => {
        tip.hidden = false;
        tip.innerHTML = `<span class="d">${fmtDate(e.ms)}</span>${esc(e.title)}`;
        const x = frac(e.ms) * el.clientWidth;
        tip.style.left = `${Math.max(90, Math.min(el.clientWidth - 90, x))}px`;
      });
      t.addEventListener('pointerleave', () => { tip.hidden = true; });
      t.addEventListener('click', (ev) => { ev.stopPropagation(); onEvent(e); });
      el.appendChild(t);
    }
    const hit = el.querySelector('.tl-hit');
    let dragging = false;
    const at = (ev) => {
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      onJump(start + f * (end - start));
    };
    hit.addEventListener('pointerdown', (ev) => { dragging = true; hit.setPointerCapture(ev.pointerId); at(ev); });
    hit.addEventListener('pointermove', (ev) => { if (dragging) at(ev); });
    hit.addEventListener('pointerup', () => { dragging = false; });
    this.frac = frac;
  }

  update(ms) {
    const f = Math.min(1, Math.max(0, this.frac(ms)));
    const s = `${(f * 100).toFixed(3)}%`;
    if (this._s !== s) { this._s = s; this.head.style.left = s; }
  }
}
