// Vertical drum picker: scroll or drag the list; the centred value applies live.

const ROW = 42;

let open = null;

export function closeWheel() {
  if (!open) return;
  open.flush();            // apply the centred value before the list goes away
  open.el.remove();
  document.removeEventListener('pointerdown', open.outside, true);
  document.removeEventListener('keydown', open.key, true);
  const { anchor, onClose } = open;
  open = null;
  anchor.setAttribute('aria-expanded', 'false');
  onClose && onClose();
}

/**
 * @param anchor   element the picker opens next to
 * @param items    array of { label, value }
 * @param index    initial index
 * @param onChange (index) => void, called whenever the centred item changes
 */
export function openWheel({ anchor, items, index, onChange, onClose, title }) {
  if (open && open.anchor === anchor) { closeWheel(); return; }
  closeWheel();
  const el = document.createElement('div');
  el.className = 'wheel';
  el.setAttribute('role', 'listbox');
  el.setAttribute('aria-label', title || 'Choose');
  el.innerHTML = `<div class="lbl">${title || ''}</div><ul></ul><div class="band"></div>`;
  const ul = el.querySelector('ul');
  const pads = 2;
  const html = [];
  for (let i = 0; i < pads; i++) html.push('<li class="pad" aria-hidden="true"></li>');
  items.forEach((it, i) => html.push(`<li role="option" data-i="${i}">${it.label}</li>`));
  for (let i = 0; i < pads; i++) html.push('<li class="pad" aria-hidden="true"></li>');
  ul.innerHTML = html.join('');
  document.body.appendChild(el);
  el.querySelector('.band').style.top = `${ul.offsetTop + 2 * ROW}px`;

  const r = anchor.getBoundingClientRect();
  const w = 130, h = el.offsetHeight;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
  let top = r.bottom + 6;
  if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
  el.style.left = `${left}px`; el.style.top = `${top}px`;

  const lis = [...ul.querySelectorAll('li[data-i]')];
  let current = index;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const paint = () => {
    const c = ul.scrollTop / ROW;
    lis.forEach((li, i) => {
      const off = i - c;
      li.classList.toggle('on', i === current);
      li.setAttribute('aria-selected', i === current ? 'true' : 'false');
      if (!reduce) {
        const a = Math.max(-80, Math.min(80, off * 22));
        li.style.transform = `rotateX(${-a}deg)`;
        li.style.opacity = String(Math.max(0.15, 1 - Math.abs(off) * 0.28));
      }
    });
  };
  const centred = () => Math.max(0, Math.min(items.length - 1, Math.round(ul.scrollTop / ROW)));
  let settle = null, raf = 0;
  const flush = () => {
    clearTimeout(settle); settle = null;
    if (!el.isConnected) return;
    const i = centred();
    if (i !== current) { current = i; paint(); onChange(i); }
  };
  ul.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); });
    clearTimeout(settle);
    settle = setTimeout(flush, 90);
  });
  ul.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (!li) return;
    const i = +li.dataset.i;
    ul.scrollTo({ top: i * ROW, behavior: reduce ? 'auto' : 'smooth' });
  });
  ul.scrollTop = index * ROW;
  paint();

  const outside = (e) => { if (!el.contains(e.target) && e.target !== anchor) closeWheel(); };
  const key = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); closeWheel(); anchor.focus(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); e.stopPropagation();
      const i = Math.max(0, Math.min(items.length - 1, current + (e.key === 'ArrowDown' ? 1 : -1)));
      ul.scrollTo({ top: i * ROW, behavior: 'auto' });
    }
  };
  document.addEventListener('pointerdown', outside, true);
  document.addEventListener('keydown', key, true);
  anchor.setAttribute('aria-expanded', 'true');
  open = { el, anchor, outside, key, onClose, flush };
  ul.tabIndex = 0;
  ul.focus({ preventScroll: true });
}
