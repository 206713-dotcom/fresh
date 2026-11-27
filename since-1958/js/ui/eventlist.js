// Event drawer under the timeline: every event by name, in order, in a strip you can scroll.
// Click a name to travel there. Filters narrow the list to one place.

import { esc } from './format.js';

const COLORS = { earth: 'var(--earth)', moon: 'var(--moon)', mars: 'var(--mars)', space: 'var(--deep)' };
const FILTERS = [['all', 'Everything'], ['moon', 'Moon'], ['mars', 'Mars'], ['space', 'Deep space'], ['earth', 'Earth']];

export class EventList {
  constructor(el, toggleBtn, events, { onEvent }) {
    this.el = el; this.events = events; this.nextIdx = -1; this.hover = false;
    el.innerHTML = `<div class="ev-filters" role="group" aria-label="Show events from">${FILTERS.map(([f, label], i) =>
      `<button data-f="${f}" aria-pressed="${i === 0}">${label}</button>`).join('')}<span class="ev-tip">Click a name to travel there</span></div>
      <div class="ev-strip">${events.map((e, i) => `<button class="ev" data-i="${i}" data-body="${e.body}" style="--c:${COLORS[e.body]}">
        <span class="y">${new Date(e.ms).getUTCFullYear()}</span><span class="n">${esc(e.title)}</span></button>`).join('')}</div>`;
    this.strip = el.querySelector('.ev-strip');
    this.chips = [...this.strip.children];
    this.strip.addEventListener('click', (ev) => { const b = ev.target.closest('.ev'); if (b) onEvent(events[+b.dataset.i]); });
    this.strip.addEventListener('pointerenter', () => { this.hover = true; });
    this.strip.addEventListener('pointerleave', () => { this.hover = false; });
    // a mouse wheel scrolls the strip sideways
    this.strip.addEventListener('wheel', (ev) => { if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) { this.strip.scrollLeft += ev.deltaY; ev.preventDefault(); } }, { passive: false });
    el.querySelector('.ev-filters').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-f]'); if (!b) return;
      for (const o of el.querySelectorAll('.ev-filters button')) o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      const f = b.dataset.f;
      for (const c of this.chips) c.hidden = f !== 'all' && c.dataset.body !== f;
      this.nextIdx = -1;
    });
    toggleBtn.addEventListener('click', () => {
      const open = el.hidden;
      el.hidden = !open; document.body.classList.toggle('tl-open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      this.nextIdx = -1;
    });
  }

  /** Mark what is already history and keep the next event in view. */
  update(ms) {
    if (this.el.hidden) return;
    let next = this.events.findIndex((e) => e.ms > ms);
    if (next < 0) next = this.events.length;
    if (next === this.nextIdx) return;
    this.nextIdx = next;
    this.chips.forEach((c, i) => { c.classList.toggle('past', i < next); c.classList.toggle('next', i === next); });
    if (this.hover) return;
    let target = this.chips[Math.min(next, this.chips.length - 1)];
    for (let i = next; i < this.chips.length && target.hidden; i++) target = this.chips[i];
    if (target && !target.hidden) this.strip.scrollTo({ left: Math.max(0, target.offsetLeft - this.strip.clientWidth * 0.3), behavior: 'smooth' });
  }
}
