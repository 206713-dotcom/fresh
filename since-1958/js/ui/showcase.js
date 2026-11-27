// The featured animations: one small film engine that plays a "show" (see ui/shows.js). A show builds its own
// 3D scene from the hand-built models and gives a list of shots; the engine flies one continuous camera through
// them, writes the big idea and its explanation, pins labels to the model, and lets each shot animate the scene
// (light rays, heat, unfolding, a landing). Its own renderer exists only while it is open.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CLEAN } from './cine.js';
import { perf, AdaptiveRatio } from './perf.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const soft = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const BLEND = 2.4;     // seconds over which one shot flows into the next

function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.08, 'rgba(255,250,235,0.9)'); gr.addColorStop(0.3, 'rgba(255,240,210,0.18)'); gr.addColorStop(1, 'rgba(255,240,210,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}

export class Showcase {
  constructor(root) {
    this.root = root; this.isOpen = false; this.actions = {};
    root.innerHTML = `<div class="sc-wrap" role="dialog" aria-label="Featured animation">
      <canvas></canvas><div class="cine"><i class="cine-vig"></i><i class="cine-grain"></i></div><div class="sc-labels"></div><div class="sc-fade"></div><p class="sc-wait">Building the model<i>…</i></p><div class="sc-bar top"></div><div class="sc-bar bot"></div>
      <div class="sc-cap"><p class="sc-k"></p><h2 class="sc-t"></h2><p class="sc-l"></p></div>
      <div class="sc-dots"></div>
      <div class="sc-end"><div class="sc-body"></div><div class="sc-row"></div></div>
      <div class="sc-top"><button class="sc-prev" aria-label="Previous scene" title="Previous scene ( ← )">‹</button><button class="sc-pause" title="Pause or play ( Space )">⏸ Pause</button><button class="sc-skip" title="Next scene ( Tab )">Next ›</button><button class="p-close sc-x" aria-label="Close">×</button></div>
    </div>`;
    this.$ = (s) => root.querySelector(s);
    this.canvas = this.$('canvas');
    this.$('.sc-x').addEventListener('click', () => this.close());
    this.$('.sc-skip').addEventListener('click', () => this._next());
    this.$('.sc-pause').addEventListener('click', () => this._pause(!this.paused));
    this.$('.sc-prev').addEventListener('click', () => this._jump(Math.max(0, this.shot - 1)));
    this.$('.sc-row').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.a, arg = b.dataset.arg;
      if (a === 'again') this._restart(); else if (a === 'close') this.close(); else { const f = this.actions[a]; this.close(); if (f) f(arg); }
    });
    this.$('.sc-dots').addEventListener('click', (e) => { const d = e.target.closest('[data-i]'); if (d) this._jump(+d.dataset.i); });
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
      else if (e.key === 'ArrowRight') { e.stopPropagation(); this._next(); }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); this._jump(Math.max(0, this.shot - 1)); }
      else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); e.stopImmediatePropagation(); this._pause(!this.paused); }
    }, true);
  }

  /** def: a show from ui/shows.js. info: live facts the show may use (for example a distance). */
  open(def, info = {}) {
    if (this.isOpen) return;
    this.def = def; this.info = info; this.isOpen = true; this.root.hidden = false; this.root.dataset.show = def.id;
    this.ready = false; this.root.classList.add('loading'); this.renderer = null;
    this.$('.sc-dots').innerHTML = def.shots.map((s, i) => `<i data-i="${i}"></i>`).join('');
    // the end card: "Left behind" (what this machine left, why, what it still gives us, its state today) when there
    // is one, otherwise the plain ending
    const e = def.end, lb = this.leftBehind ? this.leftBehind(def.id) : null, end = this.$('.sc-end');
    end.classList.toggle('lbx', !!lb);
    end.querySelector('.sc-body').innerHTML = lb ? lb.html : `<p class="sc-k"></p><h2></h2><p class="sc-et"></p>`;
    if (!lb) { end.querySelector('.sc-k').textContent = def.name; end.querySelector('h2').textContent = e.title; end.querySelector('.sc-et').textContent = e.text; }
    this.$('.sc-row').innerHTML = `<button data-a="again" class="sc-again">Watch again</button>${(lb ? lb.buttons : e.buttons).map(([label, a, arg]) => `<button data-a="${a}" data-arg="${arg || ''}">${label}</button>`).join('')}<button data-a="close">Close</button>`;
    // Building the model takes a moment of the page's time. Let the "Building the model" note reach the screen first,
    // so the click answers at once instead of seeming to freeze.
    const ticket = this.ticket = {};
    requestAnimationFrame(() => requestAnimationFrame(() => { if (this.isOpen && this.ticket === ticket) this._open2(def); }));
  }
  _open2(def) {
    const r = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: def.bloom === false,      // with the glow on, edges are smoothed in its own buffer (4 samples); smoothing the screen too would be paid twice
      powerPreference: 'high-performance', logarithmicDepthBuffer: !!def.logDepth });
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = def.exposure || 1.05;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    // Shadows are redrawn only when something that casts one moves (def.liveShadow says which shots), and for a few
    // frames after each cut. The camera flying round does not change them.
    r.shadowMap.autoUpdate = false; this.shadowFrames = 4; r.info.autoReset = false;
    this.adapt = new AdaptiveRatio();
    this._build();
    // the finish of the picture: a soft glow round everything bright (engines, light rays, glints on metal).
    // If a graphics card does not get on with it, the plain picture is shown instead.
    this.fx = null; this.plain = false; this.frames = 0;
    if (def.bloom !== false) try {
      const b = def.bloom || {}, rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
      const c = this.fx = new EffectComposer(r, rt);
      c.addPass(new RenderPass(this.scene, this.cam)); c.addPass(new ShaderPass(CLEAN));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), b.strength ?? 0.42, b.radius ?? 0.6, b.threshold ?? 1.5); c.addPass(this.bloom);
      c.addPass(new OutputPass());
    } catch (e) { console.warn('featured animation: glow off', e); this.fx = null; }
    this.started = false; this.t = null; this.T = 0; this._pause(false);
    this._restart();
    // The graphics card prepares the materials in the background, then the pictures are handed to it one per frame
    // (so the page never stops for long), and only then does the film start.
    const go = () => { if (this.renderer !== r || this.ready) return; this.ready = true; this.root.classList.remove('loading'); this.started = false; this._jump(0); };
    const upload = () => {
      const tex = new Set();
      this.scene.traverse((o) => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of ms) for (const k of ['map', 'bumpMap', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap', 'metalnessMap']) if (m[k] && m[k].isTexture) tex.add(m[k]); });
      const list = [...tex];
      const step = () => { if (this.renderer !== r) return; const t0 = performance.now(); while (list.length && performance.now() - t0 < 12) { try { r.initTexture(list.pop()); } catch (e) { /* uploaded on first use instead */ } } if (list.length) requestAnimationFrame(step); else go(); };
      requestAnimationFrame(step);
    };
    try { if (this.fx) r.setRenderTarget(this.fx.renderTarget1); const p = r.compileAsync(this.scene, this.cam); r.setRenderTarget(null); p.then(upload, upload); setTimeout(go, 25000); } catch (e) { r.setRenderTarget(null); upload(); }
    let last = performance.now();
    const loop = (now) => {
      if (!this.isOpen || this.renderer !== r) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      this._tick(dt);
    };
    this.raf = requestAnimationFrame(loop);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf); this.ticket = null;
    if (this.renderer) {                                   // (it may be closed before it was ever built)
      this.scene.traverse((o) => { if (o.userData.own) { o.geometry.dispose(); if (o.material.dispose) o.material.dispose(); } });     // shared model shapes stay
      if (this.fx) { for (const p of this.fx.passes) if (p.dispose) p.dispose(); this.fx.dispose(); this.fx = null; }
      if (this.def && this.def.release && this.st) this.def.release(this.st);           // models kept for next time are taken out of this scene
      this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer = null;
    }
    this.st = null;
    const fresh = this.canvas.cloneNode(false); this.canvas.replaceWith(fresh); this.canvas = fresh;
    this.$('.sc-labels').innerHTML = '';
    this.root.hidden = true; this.root.classList.remove('ended', 'loading', 'paused');
    if (this.onClose) this.onClose();
  }

  _build() {
    const def = this.def, s = this.scene = new THREE.Scene(); s.background = new THREE.Color(def.bg || 0x000000);
    const sd = def.sun, sunDir = this.sunDir = sd.dir.clone().normalize();
    const sun = this.sun = new THREE.DirectionalLight(sd.color || 0xfff8ee, sd.intensity || 4.4); sun.position.copy(sunDir).multiplyScalar(sd.dist || 30); sun.castShadow = true;
    const R = sd.shadow || 4.6; Object.assign(sun.shadow.camera, { left: -R, right: R, top: R, bottom: -R, near: 1, far: (sd.dist || 30) * 2 + R * 2 }); sun.shadow.mapSize.set(sd.map || 2048, sd.map || 2048); sun.shadow.bias = -0.0003; sun.shadow.normalBias = sd.normalBias || 0.015;
    s.add(sun, sun.target);
    const h = def.hemi || [0x8090b0, 0x101014, 0.18]; s.add(new THREE.HemisphereLight(h[0], h[1], h[2]));
    this.glow = glowTex();
    if (!def.noStars) {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color: 0xfff6e8, transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }));
      spr.position.copy((def.sunAt || sd.dir).clone().normalize()).multiplyScalar(2500); spr.scale.setScalar(70); spr.userData.own = true; s.add(spr);
      let k = 31; const rnd = () => { k = (k * 16807) % 2147483647; return k / 2147483647; };
      const band = V(0.3, 0.9, -0.3).normalize(), pts = [], cols = [];
      for (let i = 0; i < 9000; i++) {
        const u = rnd() * 2 - 1, a = rnd() * 6.283, q = Math.sqrt(1 - u * u), p = V(q * Math.cos(a), u, q * Math.sin(a));
        const inBand = Math.abs(p.dot(band)), keep = i < 3200 || rnd() < Math.exp(-(inBand * inBand) / 0.02);
        if (!keep) continue;
        p.multiplyScalar(3000); pts.push(p.x, p.y, p.z);
        const b = Math.pow(rnd(), 3.2) * 0.95 + 0.06, w = rnd(); cols.push(b * (w < 0.2 ? 1 : 0.86), b * 0.9, b * (w > 0.8 ? 1 : 0.84));
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      const stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, toneMapped: false })); stars.userData.own = true; s.add(stars);
    }
    this.cam = new THREE.PerspectiveCamera(def.fov || 38, 1, def.near || 0.05, def.far || 6000); this._w = 0;
    this.st = def.build(this._ctx());
  }

  /** helpers a show can use while it builds */
  _ctx() {
    const scene = this.scene, glow = this.glow, self = this;
    return {
      THREE, scene, glow, info: this.info, sun: this.sun, renderer: this.renderer, cam: this.cam,
      /** a glowing line through the points; set(k) draws the first k (0..1) of it */
      beam(points, color = 0xffe08a, r = 0.02) {
        const path = new THREE.CurvePath(); for (let i = 0; i < points.length - 1; i++) path.add(new THREE.LineCurve3(points[i], points[i + 1]));
        const N = Math.max(8, Math.round(path.getLength() / 0.12)), geo = new THREE.TubeGeometry(path, N, r, 5, false);
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
        m.userData.own = true; m.frustumCulled = false; scene.add(m);
        const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending })); head.scale.setScalar(r * 22); head.userData.own = true; scene.add(head);
        const set = (k) => { k = Math.max(0, Math.min(1, k)); geo.setDrawRange(0, Math.floor(k * N) * 30); m.visible = k > 0; head.visible = k > 0.001 && k < 0.999; if (head.visible) head.position.copy(path.getPointAt(k)); };
        set(0); return { mesh: m, head, set, show(v) { m.visible = v && m.visible; if (!v) { m.visible = false; head.visible = false; } } };
      },
      sprite(color, size) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending })); sp.scale.setScalar(size); sp.userData.own = true; scene.add(sp); return sp; },
      setSun(dir, intensity) { self.sunDir.copy(dir).normalize(); if (intensity != null) self.sun.intensity = intensity; },
      setShadow(R, bias) { const c = self.sun.shadow.camera; if (c.right === R) return; c.left = c.bottom = -R; c.right = c.top = R; c.updateProjectionMatrix(); if (bias) self.sun.shadow.normalBias = bias; },
      fade() { const f = self.$('.sc-fade'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); },
    };
  }

  /** stop or start the film where it is: the camera, the model and the light all hold still */
  _pause(on) { this.shadowFrames = 2; this.paused = !!on; this.root.classList.toggle('paused', this.paused); const b = this.$('.sc-pause'); if (b) b.textContent = this.paused ? '▶ Play' : '⏸ Pause'; }
  _restart() { this.root.classList.remove('ended'); this._pause(false); this._jump(0); }
  _next() { if (!this.st) return; if (this.shot < this.def.shots.length - 1) this._jump(this.shot + 1); else this._end(); }
  _anchor(sh) { return sh.anchor ? sh.anchor(this.st) : null; }
  _jump(i) {
    if (!this.st) return;                                 // still building
    this.shadowFrames = 4;
    const sh = this.def.shots[i], cut = sh.cut || !this.started || this.root.classList.contains('ended');
    if (!cut && this.cam && this.t != null) { this.fromPos = this.cam.position.clone(); this.fromLook = this.look.clone(); const a = this._anchor(sh); if (a) { this.fromPos.sub(a); this.fromLook.sub(a); } }
    else { this.fromPos = null; if (this.started) this._ctx().fade(); }
    this.started = true; this.shot = i; this.t = 0; this.root.classList.remove('ended');
    const cap = this.$('.sc-cap');
    cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in'); cap.classList.toggle('big', !!sh.big);
    this.$('.sc-cap .sc-k').textContent = sh.k; this.$('.sc-t').textContent = sh.t; this.$('.sc-l').textContent = typeof sh.l === 'function' ? sh.l(this.info) : sh.l;
    this.root.querySelectorAll('.sc-dots i').forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'now' : ''; });
    const L = this.$('.sc-labels'); L.innerHTML = (sh.labels || []).map((l) => `<span class="${l.cls || ''}"><b>${l.text}</b>${l.sub ? `<i>${l.sub}</i>` : ''}</span>`).join('');
    this.labelEls = [...L.children];
    for (let k = 0; k < i; k++) { const p = this.def.shots[k]; if (p.done) p.done(this.st); }       // if shots were skipped, leave the scene as they would have
    if (sh.on) sh.on(this.st);
  }
  _end() { this.root.classList.add('ended'); }

  _draw(dt) {
    const r = this.renderer;
    r.info.reset(); perf.gpuBegin(r); this._drawInner(dt); perf.gpuEnd(r);
  }
  _drawInner(dt) {
    const r = this.renderer;
    if (this.shadowFrames > 0 || (this.def.liveShadow && this.def.liveShadow(this.shot, this.st))) { r.shadowMap.needsUpdate = true; if (this.shadowFrames > 0) this.shadowFrames--; }
    if (this.fx && !this.plain) {
      try {
        this.fx.render(dt);
        // self-check: if the finished picture is pure black where the plain one is not, show the plain one from now on
        if (++this.frames === 40 || this.frames === 160) {
          const gl = r.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4);
          const sum = () => { let s = 0; for (const [x, y] of [[0.5, 0.5], [0.3, 0.4], [0.7, 0.6], [0.5, 0.25], [0.62, 0.8], [0.2, 0.7], [0.8, 0.3], [0.4, 0.55], [0.6, 0.45]]) { gl.readPixels(Math.floor(w * x), Math.floor(h * y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); s += px[0] + px[1] + px[2]; } return s; };
          if (sum() === 0) { r.setRenderTarget(null); r.render(this.scene, this.cam); if (sum() > 0) { this.plain = true; console.warn('featured animation: glow switched off, it came out black on this graphics card'); } }
        }
        return;
      } catch (e) { console.warn('featured animation: glow failed, plain picture', e); this.plain = true; }
    }
    r.setRenderTarget(null); r.render(this.scene, this.cam);
  }

  _tick(dt) {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight, dpr = window.devicePixelRatio || 1, def = this.def;
    if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) {
      this._w = w; this._h = h; this._dpr = dpr;
      this.prFull = Math.max(1, Math.min(dpr, Math.sqrt(3.4e6 / (w * h))));
      this.renderer.setPixelRatio(this.adapt.ratio(this.prFull)); this.renderer.setSize(w, h, false);
      if (this.fx) { this.fx.setPixelRatio(this.renderer.getPixelRatio()); this.fx.setSize(w, h); }
      this.cam.aspect = w / h; this.cam.fov = (def.fov || 38) * (w / h < 1 ? 1.5 : 1); this.cam.updateProjectionMatrix();
    }
    if (!w || !h || !this.ready) return;
    // too slow on this computer? a few fewer pixels, until it runs smoothly again (and back up when it can)
    if (this.adapt.tick(dt)) { this.renderer.setPixelRatio(this.adapt.ratio(this.prFull)); this.renderer.setSize(w, h, false); if (this.fx) { this.fx.setPixelRatio(this.renderer.getPixelRatio()); this.fx.setSize(w, h); } }
    perf.frame(dt, this.renderer, def.id);
    let sh = def.shots[this.shot];
    const ended = this.root.classList.contains('ended');
    if (this.paused) dt = 0;                                     // paused: everything holds still, the picture is still drawn
    if (!ended) {
      this.t += dt; this.T += dt;
      if (this.t >= sh.d) { if (this.shot < def.shots.length - 1) { this._jump(this.shot + 1); sh = def.shots[this.shot]; } else this._end(); }
    } else this.T += dt;
    const u = Math.min(1, this.t / sh.d);
    if (sh.up) sh.up(this.st, u, this.t, dt);
    if (def.tick) def.tick(this.st, this.T, dt);
    const k = soft(u * 0.999), pos = sh.a.clone().lerp(sh.b, k), look = sh.la.clone().lerp(sh.lb, k), C = sh.centre || def.centre;
    const b = this.fromPos ? soft(this.t / BLEND) : 1;                  // flow in from wherever the camera was
    if (b < 1) {
      // swing around the subject, never through it: blend the direction and the distance from its centre separately
      const a = this.fromPos.clone().sub(C), c = pos.clone().sub(C), ra = a.length(), rc = c.length();
      const ang = a.angleTo(c), sn = Math.sin(ang) || 1, ua = a.normalize(), uc = c.normalize();
      const dir = ang < 1e-3 ? uc : ua.multiplyScalar(Math.sin((1 - b) * ang) / sn).addScaledVector(uc, Math.sin(b * ang) / sn);
      const clear = def.clear || 3.2, lift = Math.sin(Math.PI * b) * Math.max(0, clear - Math.min(ra, rc)) * 0.6;
      pos.copy(C).addScaledVector(dir.normalize(), ra + (rc - ra) * b + lift);
      look.lerp(this.fromLook, 1 - b);
    }
    const an = this._anchor(sh); if (an) { pos.add(an); look.add(an); }
    if (sh.track) look.copy(sh.track(this.st, u));
    if (sh.shake) { const s = sh.shake(this.st, u) || 0; if (s) { pos.x += Math.sin(this.T * 47) * s; pos.y += Math.sin(this.T * 61 + 1) * s; look.y += Math.sin(this.T * 53 + 2) * s * 0.6; } }
    this.look = look;
    this.cam.position.copy(pos); this.cam.up.set(0, 1, 0); this.cam.lookAt(look);
    if (def.shadowFollow) { const f = def.shadowFollow(this.st); this.sun.target.position.copy(f); this.sun.position.copy(f).addScaledVector(this.sunDir, def.sun.dist || 30); this.sun.target.updateMatrixWorld(); }
    this._draw(dt);
    // labels pinned to the model
    if (this.labelEls && sh.labels) {
      const v = new THREE.Vector3();
      sh.labels.forEach((l, i) => {
        const el = this.labelEls[i]; if (!el) return;
        v.copy(typeof l.p === 'function' ? l.p(this.st) : l.p); if (an && !l.world) v.add(an); v.project(this.cam);
        const vis = !ended && u >= (l.at || 0.12) && u <= (l.to || 1) && v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
        el.classList.toggle('on', vis);
        el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`;
      });
    }
  }
}
