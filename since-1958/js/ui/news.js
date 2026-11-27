// News: a headline pops up when the clock reaches one of the biggest moments; clicking it opens the full story
// with official photos (where we have them) and the machine itself as a small turning 3D model.
import * as THREE from 'three';
import { NEWS } from '../../data/news.js';
import { loadGLB } from '../scene/models.js';

const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const dateOf = (n) => { const d = new Date(n.ms); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

export class News {
  /** hooks: { subject(n) -> {name, sources}, onGo(n), onObject(n), onFilm(n), onOpen(), onClose() } */
  constructor(hooks) {
    this.h = hooks; this.isOpen = false; this.cur = null;
    this.toastEl = document.createElement('button'); this.toastEl.id = 'newsToast'; this.toastEl.hidden = true; document.body.appendChild(this.toastEl);
    this.toastEl.addEventListener('click', (e) => { if (e.target.closest('.nt-x')) { this.hideToast(); return; } const n = this.toastN; this.hideToast(); if (n) this.open(n); });
    this.el = document.createElement('div'); this.el.id = 'news'; this.el.hidden = true; document.body.appendChild(this.el);
    this.el.addEventListener('click', (e) => this._click(e));
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') { if (this.el.querySelector('.n-zoom')) this.el.querySelector('.n-zoom').remove(); else this.close(); }
      else if (e.key === 'ArrowRight') this.step(1); else if (e.key === 'ArrowLeft') this.step(-1); else return;
      e.preventDefault(); e.stopImmediatePropagation();
    }, true);
  }
  byTime(t) { return NEWS.find((n) => n.t === t) || null; }
  /** the newest story at or before this time (or the first one) */
  latest(ms) { let r = NEWS[0]; for (const n of NEWS) if (n.ms <= ms) r = n; return r; }

  toast(n) {
    if (this.isOpen) return;
    this.toastN = n; const p = n.photos && n.photos[0];
    this.toastEl.innerHTML = `${p ? `<img src="${p.src}" alt="">` : '<span class="nt-ico">📰</span>'}<span class="nt-t"><b>NEWS · ${dateOf(n)}</b><strong>${esc(n.head)}</strong><i>Click to read the story${p ? ' and see the photo' : ''}</i></span><span class="nt-x" aria-label="Dismiss" title="Dismiss">✕</span>`;
    this.toastEl.hidden = false; this.toastEl.classList.remove('in'); void this.toastEl.offsetWidth; this.toastEl.classList.add('in');
    clearTimeout(this._tt); this._tt = setTimeout(() => this.hideToast(), 22000);
  }
  hideToast() { clearTimeout(this._tt); this.toastEl.hidden = true; this.toastN = null; }

  open(n) {
    if (!n) return;
    const first = !this.isOpen; this.isOpen = true; this.cur = n; this.hideToast();
    const s = this.h.subject(n) || {}, i = NEWS.indexOf(n), ph = n.photos || [];
    const fig = (p, k) => `<figure class="${k ? 'n-more' : 'n-hero'}"><img src="${p.src}" alt="${esc(p.cap)}" data-zoom="${p.src}" title="Click to enlarge"><figcaption>${esc(p.cap)} <em>Image: ${esc(p.credit)}</em></figcaption></figure>`;
    this.el.innerHTML = `<article class="n-page" role="dialog" aria-label="News story">
      <header class="n-top"><span class="n-paper">THE SOLAR SYSTEM NEWS</span><span class="n-date">${dateOf(n)}</span><button class="n-x" data-act="close" aria-label="Close" title="Close ( Esc )">✕</button></header>
      <div class="n-cols"><div class="n-main">
        <p class="n-kick">${esc(n.kicker)}</p><h2>${esc(n.head)}</h2><p class="n-lead">${esc(n.lead)}</p>
        ${ph[0] ? fig(ph[0], 0) : ''}
        ${n.body.map((b) => `<p>${esc(b)}</p>`).join('')}
        ${ph.slice(1).map((p) => fig(p, 1)).join('')}
        ${ph.length ? '' : `<p class="n-nophoto">No photo is stored here for this story. The official pictures are on the NASA pages listed on the right.</p>`}
      </div><aside class="n-side">
        <div class="n-model">${n.glb ? '<canvas></canvas><span class="n-ml">Drag to turn</span>' : '<span class="n-nomodel">No 3D model for this one</span>'}</div>
        <h3>${esc(s.name || '')}</h3><p class="n-fate">${esc(s.short || '')}</p>
        <div class="n-btns">
          <button data-act="go">${n.eq ? 'Go to the place' : 'Ride along with it'}</button>
          ${s.hasObject ? '<button data-act="object">Explore the 3D model</button>' : ''}
          ${n.film ? '<button data-act="film">Watch its film</button>' : ''}
        </div>
        ${(s.sources || []).length ? `<h4>Sources</h4><ul class="n-src">${s.sources.slice(0, 4).map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)} ↗</a></li>`).join('')}</ul>` : ''}
      </aside></div>
      <footer class="n-foot"><button data-act="prev" ${i <= 0 ? 'disabled' : ''}>← Earlier story</button><span>${i + 1} of ${NEWS.length}</span><button data-act="next" ${i >= NEWS.length - 1 ? 'disabled' : ''}>Later story →</button></footer>
    </article>`;
    this.el.hidden = false; this.el.querySelector('.n-page').scrollTop = 0;
    this._model(n);
    if (first && this.h.onOpen) this.h.onOpen();
  }
  step(d) { const n = NEWS[NEWS.indexOf(this.cur) + d]; if (n) this.open(n); }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false; this._stopModel(); this.el.hidden = true; this.el.innerHTML = '';
    if (this.h.onClose) this.h.onClose();
  }
  _click(e) {
    const z = e.target.closest('.n-zoom'); if (z) { z.remove(); return; }
    const img = e.target.closest('img[data-zoom]');
    if (img) { const d = document.createElement('div'); d.className = 'n-zoom'; d.innerHTML = `<img src="${img.dataset.zoom}" alt=""><span>Click anywhere to close</span>`; this.el.appendChild(d); return; }
    if (e.target === this.el) { this.close(); return; }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, n = this.cur;
    if (a === 'close') this.close(); else if (a === 'prev') this.step(-1); else if (a === 'next') this.step(1);
    else { this.close(); if (a === 'go') this.h.onGo(n); else if (a === 'object') this.h.onObject(n); else if (a === 'film') this.h.onFilm(n); }
  }

  // ---- the small turning model
  _stopModel() {
    cancelAnimationFrame(this._raf); this._raf = 0;
    if (this._r) { this._r.dispose(); this._r.forceContextLoss(); this._r = null; }
    this._tok = (this._tok || 0) + 1;
  }
  _model(n) {
    this._stopModel(); if (!n.glb) return;
    const canvas = this.el.querySelector('.n-model canvas'), tok = this._tok;
    const r = this._r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, 0.01, 1000), pivot = new THREE.Group(); scene.add(pivot);
    const sun = new THREE.DirectionalLight(0xfff4e2, 3.2); sun.position.set(3, 4, 5); scene.add(sun); scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x30302c, 0.9));
    let yaw = 0.6, pitch = 0.25, drag = null, auto = true;
    canvas.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; auto = false; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => { if (!drag) return; yaw += (e.clientX - drag[0]) * 0.01; pitch = Math.max(-1.2, Math.min(1.2, pitch + (e.clientY - drag[1]) * 0.01)); drag = [e.clientX, e.clientY]; });
    canvas.addEventListener('pointerup', () => { drag = null; });
    loadGLB(n.glb).then((m) => {
      if (tok !== this._tok) return;
      const box = new THREE.Box3().setFromObject(m), c = box.getCenter(new THREE.Vector3()), rad = box.getSize(new THREE.Vector3()).length() / 2 || 1;
      m.position.sub(c); pivot.add(m); cam.position.set(0, 0, rad / Math.tan(18 * Math.PI / 180) * 1.05); cam.near = rad * 0.05; cam.far = rad * 20; cam.updateProjectionMatrix();
    }).catch(() => {});
    let last = performance.now();
    const loop = (now) => {
      if (tok !== this._tok) return;
      this._raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now; if (auto) yaw += dt * 0.35;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (w && h && (canvas.width !== Math.round(w * r.getPixelRatio()) || this._mh !== h)) { this._mh = h; r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
      pivot.rotation.set(pitch, yaw, 0); r.render(scene, cam);
    };
    this._raf = requestAnimationFrame(loop);
  }
}
