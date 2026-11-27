// A thumb joystick for touch screens, for walking on the Moon and in the exhibition, where a computer uses W A S D.
// It presses the same keys the keyboard would: pushed up is W, down is S, left A, right D (both together on a diagonal),
// and pushed all the way it also holds Shift to run. Looking around stays a drag on the picture, as before.
// A Jump button (Space) is offered where jumping exists.
const touch = () => matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

export function setupJoystick() {
  const pad = document.createElement('div'); pad.id = 'joy'; pad.hidden = true;
  pad.innerHTML = '<div class="joy-base"><div class="joy-knob"></div></div><button class="joy-jump" type="button">Jump</button>';
  document.body.appendChild(pad);
  const base = pad.querySelector('.joy-base'), knob = pad.querySelector('.joy-knob'), jump = pad.querySelector('.joy-jump');
  let keys = null, id = null, cx = 0, cy = 0;
  const R = 46, set = (k, on) => { if (!keys) return; if (on) keys.add(k); else keys.delete(k); };
  const apply = (x, y) => {
    const m = Math.hypot(x, y), f = m > R ? R / m : 1; x *= f; y *= f;
    knob.style.transform = `translate(${x}px, ${y}px)`;
    const nx = x / R, ny = y / R, t = 0.32;
    set('w', ny < -t); set('s', ny > t); set('a', nx < -t); set('d', nx > t); set('shift', Math.hypot(nx, ny) > 0.95);
  };
  const release = () => { id = null; apply(0, 0); for (const k of ['w', 'a', 's', 'd', 'shift']) set(k, false); };
  base.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation(); id = e.pointerId; base.setPointerCapture(id);
    const r = base.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; apply(e.clientX - cx, e.clientY - cy);
  });
  base.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; e.preventDefault(); e.stopPropagation(); apply(e.clientX - cx, e.clientY - cy); });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) base.addEventListener(ev, (e) => { if (e.pointerId === id) release(); });
  jump.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); set(' ', true); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) jump.addEventListener(ev, () => set(' ', false));
  for (const el of [base, jump]) el.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  return {
    /** show it, pressing keys into this set (or hide it with null). canJump: offer the Jump button. */
    attach(set, { canJump = false, high = false } = {}) {
      if (!set || !touch()) { release(); keys = null; pad.hidden = true; return; }
      if (keys !== set) { release(); keys = set; }
      pad.hidden = false; jump.hidden = !canJump; pad.classList.toggle('high', high);
    },
  };
}
