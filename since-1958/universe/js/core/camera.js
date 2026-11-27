// Orbit camera. The thing being looked at always sits at the scene origin
// (see the floating origin in solar/system.js), so the camera only needs two
// angles and a distance. Mouse, touch and trackpad all go through pointer events.
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export class OrbitRig {
  constructor(camera, dom) {
    this.camera = camera;
    this.dom = dom;
    this.az = 0.6;            // angle around the vertical axis
    this.pol = 1.25;          // angle down from straight overhead
    this.dist = 10;
    this.targetDist = 10;
    this.minDist = 1;
    this.maxDist = 900;
    this.vAz = 0;
    this.vPol = 0;
    this.idle = 0;            // seconds since the user last touched the view
    this.drift = true;        // slow automatic rotation when idle
    this.locked = false;      // true while a fly-to animation owns the zoom
    this.shiftX = 0;          // keeps the subject clear of the side panel (px)
    this.shiftY = 0;
    this.shiftTargetX = 0;
    this.shiftTargetY = 0;
    this.onTap = null;
    this.onInput = null;

    const pointers = new Map();
    let pinch = 0, moved = 0, downAt = 0;

    dom.addEventListener('pointerdown', e => {
      dom.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = 0;
      downAt = performance.now();
      if (pointers.size === 2) pinch = this._spread(pointers);
      this.vAz = this.vPol = 0;
      this._touch();
    });
    dom.addEventListener('pointermove', e => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (pointers.size === 1) {
        const k = 0.0052;
        this.az += dx * k;
        this.pol = clamp(this.pol - dy * k, 0.06, Math.PI - 0.06);
        // Remember the motion so the view keeps gliding after release.
        this.vAz = dx * k * 60 * 0.6 + this.vAz * 0.4;
        this.vPol = -dy * k * 60 * 0.6 + this.vPol * 0.4;
      } else if (pointers.size === 2) {
        const d = this._spread(pointers);
        if (pinch > 0 && d > 0 && !this.locked) this.targetDist = clamp(this.targetDist * pinch / d, this.minDist, this.maxDist);
        pinch = d;
      }
      this._touch();
    });
    const up = e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      pinch = 0;
      if (e.type === 'pointerup' && pointers.size === 0 && moved < 7 && performance.now() - downAt < 450) {
        this.vAz = this.vPol = 0;
        this.onTap?.(e.clientX, e.clientY);
      }
    };
    dom.addEventListener('pointerup', up);
    dom.addEventListener('pointercancel', up);
    dom.addEventListener('wheel', e => {
      e.preventDefault();
      if (this.locked) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      // ctrlKey is set for trackpad pinch gestures, which report small deltas.
      const k = e.ctrlKey ? 0.012 : 0.0016;
      this.targetDist = clamp(this.targetDist * Math.exp(e.deltaY * unit * k), this.minDist, this.maxDist);
      this._touch();
    }, { passive: false });
    this.dragging = () => pointers.size > 0;
  }

  _spread(pointers) {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  _touch() {
    this.idle = 0;
    this.onInput?.();
  }

  /** Zoom by a factor (used by the keyboard and on-screen buttons). */
  zoomBy(f) {
    if (this.locked) return;
    this.targetDist = clamp(this.targetDist * f, this.minDist, this.maxDist);
    this._touch();
  }

  update(dt, width, height) {
    this.idle += dt;
    if (!this.dragging()) {
      this.az += this.vAz * dt;
      this.pol = clamp(this.pol + this.vPol * dt, 0.06, Math.PI - 0.06);
      const damp = Math.exp(-dt * 4.5);
      this.vAz *= damp;
      this.vPol *= damp;
      if (this.drift && !this.locked) {
        const ramp = clamp((this.idle - 3) / 4, 0, 1);
        this.az += 0.014 * ramp * dt;
      }
    }
    if (!this.locked) {
      this.targetDist = clamp(this.targetDist, this.minDist, this.maxDist);
      const k = 1 - Math.exp(-dt * 7);
      this.dist = Math.exp(Math.log(this.dist) + (Math.log(this.targetDist) - Math.log(this.dist)) * k);
    }
    const sp = Math.sin(this.pol);
    this.camera.position.set(this.dist * sp * Math.cos(this.az), this.dist * Math.cos(this.pol), this.dist * sp * Math.sin(this.az));
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);

    const k2 = 1 - Math.exp(-dt * 5);
    this.shiftX += (this.shiftTargetX - this.shiftX) * k2;
    this.shiftY += (this.shiftTargetY - this.shiftY) * k2;
    if (Math.abs(this.shiftX) > 0.5 || Math.abs(this.shiftY) > 0.5) {
      this.camera.setViewOffset(width, height, this.shiftX, this.shiftY, width, height);
    } else if (this.camera.view) {
      this.camera.clearViewOffset();
    }
  }
}
