// Screen-space overlay: body labels, off-screen direction arrows (SpaceEngine-style, but
// clickable: one click selects the body), and hardware markers on the focused body.

import * as THREE from 'three';
import { EQUIPMENT, STATES, stateAt } from '../../data/equipment.js';
import { fmtDist, esc } from './format.js';
import { BODIES, WORLD_IDS } from '../config.js';
import { PROBES } from '../../data/probes.js';

const COLORS = { earth: 'var(--earth)', moon: 'var(--moon)', mars: 'var(--mars)', sun: '#ffd27a' };
const NAMES = { earth: 'Earth', moon: 'Moon', mars: 'Mars', sun: 'Sun' };
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12L6 4v16z"/></svg>';

const _r = new THREE.Vector3();
const _p = new THREE.Vector3();
const _n = new THREE.Vector3();
const _c = new THREE.Vector4();
const _d = new THREE.Vector3(), _o = new THREE.Vector3();

export class Indicators {
  constructor(root, { onBody, onMarker }) {
    this.root = root;
    this.onBody = onBody;
    this.onMarker = onMarker;
    this.labels = {};
    this.arrows = {};
    // order = label priority when two would overlap
    this.ids = ['earth', 'moon', 'mars', ...PROBES.map((p) => p.id), ...WORLD_IDS.filter((id) => !['earth', 'moon', 'mars'].includes(id))];
    this.showLabels = true;
    for (const id of this.ids) {
      if (!COLORS[id]) { COLORS[id] = BODIES[id].color; NAMES[id] = BODIES[id].name; }
      const l = document.createElement('button');
      l.className = 'blbl' + (BODIES[id].probe ? ' probe' : ''); l.style.setProperty('--c', COLORS[id]); l.hidden = true;
      l.setAttribute('aria-label', `Go to ${NAMES[id]}`);
      l.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); onBody(id); });
      l.addEventListener('click', (e) => { if (e.detail === 0) onBody(id); });   // keyboard
      root.appendChild(l);
      this.labels[id] = l;
      if (!['earth', 'moon', 'mars'].includes(id)) continue;
      const a = document.createElement('button');
      a.className = 'arrow'; a.style.setProperty('--c', COLORS[id]); a.hidden = true;
      a.innerHTML = `${ARROW}<span></span>`;
      a.setAttribute('aria-label', `Go to ${NAMES[id]}`);
      a.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); onBody(id); });
      a.addEventListener('click', (e) => { if (e.detail === 0) onBody(id); });
      root.appendChild(a);
      this.arrows[id] = a;
    }
    this.markers = new Map();
    for (const q of EQUIPMENT) {
      const m = document.createElement('button');
      m.className = 'mk'; m.hidden = true; m.dataset.name = q.name;
      m.setAttribute('aria-label', `${q.name}: fly there`);
      m.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); onMarker(q); });
      m.addEventListener('click', (e) => { if (e.detail === 0) onMarker(q); });
      root.appendChild(m);
      this.markers.set(q.id, m);
    }
    this.cache = new WeakMap();
  }

  pop(eqId) {
    const m = this.markers.get(eqId);
    if (!m) return;
    m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop');
  }

  /** Is target b (at distance dist from the camera) behind a planet, the Sun or a moon? */
  _hidden(cam, b, dist, eph) {
    _d.copy(b.pos).sub(cam).divideScalar(dist);
    for (const o of eph.list) {
      if (o === b) continue;
      _o.copy(o.pos).sub(cam);
      const t = _o.dot(_d);
      if (t <= 0 || t >= dist) continue;                          // not between the camera and the target
      if (_o.lengthSq() - t * t < o.radius * o.radius * 0.98) return true;
    }
    return false;
  }

  _project(camera, renderPos, W, H) {
    _c.set(renderPos.x, renderPos.y, renderPos.z, 1).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    const w = _c.w;
    const on = w > 0 && Math.abs(_c.x / w) <= 1 && Math.abs(_c.y / w) <= 1;
    return { on, w, x: (_c.x / w * 0.5 + 0.5) * W, y: (-_c.y / w * 0.5 + 0.5) * H, cx: _c.x, cy: _c.y };
  }

  _show(el, x, y, html) {
    if (el.hidden) el.hidden = false;
    // only touch the DOM when the label really moved: unchanged styles cost a layout for nothing
    const k = `${x.toFixed(1)},${y.toFixed(1)}`;
    if (el._xy !== k) { el._xy = k; el.style.left = `${x.toFixed(1)}px`; el.style.top = `${y.toFixed(1)}px`; }
    if (html != null && this.cache.get(el) !== html) { this.cache.set(el, html); if (el.classList.contains('arrow')) el.querySelector('span').innerHTML = html; else el.innerHTML = html; }
  }

  update(camera, rig, eph, ms, W, H) {
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const focus = rig.bodyId;
    const taken = [];
    for (const id of this.ids) {
      const b = eph[id];
      if (b.isProbe && !b.active) { this.labels[id].hidden = true; continue; }
      const dist = rig.camWorld.distanceTo(b.pos);
      rig.toRender(b.pos, _r);
      const pr = this._project(camera, _r, W, H);
      const rpx = (b.radius / dist) / tanHalf * (H / 2);
      const label = this.labels[id], arrow = this.arrows[id];
      // a planet between the camera and this one hides it: no name floating over the Earth
      if (this._hidden(rig.camWorld, b, dist, eph)) { label.hidden = true; if (arrow) arrow.hidden = true; continue; }
      const isFocusClose = id === focus && (rig.mode === 'site' || dist < b.radius * (b.isProbe ? 3000 : 30));
      const lx = pr.x + Math.max(rpx, 3) + 8;
      const clash = pr.on && taken.some((o) => Math.abs(o.y - pr.y) < 15 && Math.abs(o.x - lx) < 96);
      if (pr.on && !isFocusClose && rpx < H * 0.28 && this.showLabels && !clash) {
        this._show(label, lx, pr.y, `${NAMES[id]}<small>${fmtDist(dist)}</small>`);
        taken.push({ x: lx, y: pr.y });
        if (arrow) arrow.hidden = true;
      } else {
        label.hidden = true;
        if (!arrow) continue;
        if (pr.on || isFocusClose) { arrow.hidden = true; continue; }
        // Direction to an off-screen target. Clip x, y are proportional to view-space x, y
        // whatever the sign of w, so (x, y) itself points the right way, also for targets
        // behind the camera. Dividing by w first (the usual NDC step) would mirror those.
        let dx = pr.cx * (W / 2), dy = -pr.cy * (H / 2);
        if (Math.hypot(dx, dy) < 1e-9) dy = 1;   // straight behind: any direction works
        const mx = W / 2 - 90, my = H / 2 - 60;
        const s = 1 / Math.max(Math.abs(dx) / mx, Math.abs(dy) / my);
        const x = W / 2 + dx * s, y = H / 2 + dy * s;
        this._show(arrow, x, y, `${NAMES[id]} <small>${fmtDist(dist)}</small>`);
        const ang = Math.atan2(dy, dx);
        arrow.querySelector('svg').style.transform = `rotate(${ang}rad)`;
      }
    }

    // ---- hardware markers on the focused body
    const fb = eph[focus];
    const showMarkers = (focus === 'moon' || focus === 'mars') && rig.camWorld.distanceTo(fb.pos) < fb.radius * 40;
    const placed = [];
    const rFocus = (fb.radius / rig.camWorld.distanceTo(fb.pos)) / tanHalf * (H / 2);
    for (const q of EQUIPMENT) {
      const m = this.markers.get(q.id);
      if (!showMarkers || q.body !== focus || Date.parse(q.arrival) > ms) { m.hidden = true; continue; }
      fb.surfacePoint(q.lat, q.lon, 0.001, _p);
      fb.dir(q.lat, q.lon, _n);
      const toCam = rig.camWorld.clone().sub(_p);
      const atSite = rig.mode === 'site' && rig.eq === q && toCam.length() < 2.5;
      if (_n.dot(toCam) <= 0 || atSite) { m.hidden = true; continue; }
      rig.toRender(_p, _r);
      const pr = this._project(camera, _r, W, H);
      if (!pr.on) { m.hidden = true; continue; }
      const st = stateAt(q, ms);
      m.style.setProperty('--sc', st ? STATES[st.state].color : '#aaa');
      this._show(m, pr.x, pr.y, null);
      placed.push({ m, x: pr.x, y: pr.y });
    }
    // name the markers when the body is large on screen, skipping ones that would overlap
    placed.sort((a, b) => a.y - b.y);
    const named = [];
    for (const p of placed) {
      const clash = named.some((o) => Math.abs(o.y - p.y) < 18 && p.x > o.x - 20 && p.x < o.x + 170);
      const on = rFocus > 140 && !clash;
      p.m.classList.toggle('named', on);
      if (on) named.push(p);
    }
  }
}
