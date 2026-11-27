// Event notifications. Mars events slide in on the left; Moon and Earth events appear
// under the clock on the right.

import { fmtDateTime, esc } from './format.js';

const COLORS = { earth: 'var(--earth)', moon: 'var(--moon)', mars: 'var(--mars)', space: 'var(--deep)' };
const PLACE = { earth: 'Earth', moon: 'Moon', mars: 'Mars', space: 'Deep space' };

export class Alerts {
  constructor(leftEl, rightEl) {
    this.left = leftEl;
    this.right = rightEl;
  }

  /** go: optional { label, fn } for the action button. */
  push(ev, go, more) {
    const isMars = ev.body === 'mars';
    const host = isMars ? this.left : this.right;
    const el = document.createElement('div');
    el.className = isMars ? 'alert' : 'toast';
    el.style.setProperty('--c', COLORS[ev.body]);
    el.innerHTML = `
      <div class="d"><span class="where">${PLACE[ev.body]}</span>, ${fmtDateTime(ev.ms)}</div>
      <div class="t">${esc(ev.title)}</div>
      <div class="x">${esc(ev.text)}</div>
      <div class="row">${go ? `<button class="btn go">${esc(go.label)}</button>` : ''}${more ? `<button class="btn more">${esc(more.label)}</button>` : ''}<button class="btn quiet">Dismiss</button></div>`;
    const remove = () => {
      if (!el.isConnected) return;
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 320);
    };
    if (go) el.querySelector('.go').addEventListener('click', () => { go.fn(); remove(); });
    if (more) el.querySelector('.more').addEventListener('click', () => more.fn());
    el.querySelector('.quiet').addEventListener('click', remove);
    host.prepend(el);
    // keep the stacks short
    const max = isMars ? 3 : 2;
    while (host.children.length > max) host.lastElementChild.remove();
    let hover = false;
    el.addEventListener('pointerenter', () => { hover = true; });
    el.addEventListener('pointerleave', () => { hover = false; });
    const life = isMars ? 14000 : 9000;
    const tick = () => { if (!el.isConnected) return; if (hover) setTimeout(tick, 1500); else remove(); };
    setTimeout(tick, life);
  }

  clear() { this.left.innerHTML = ''; this.right.innerHTML = ''; }
}
