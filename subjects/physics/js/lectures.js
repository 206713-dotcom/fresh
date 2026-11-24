/* Geodesic lectures — long narrated films drawn live with the Manim-style engine (js/manim.js).
   A lecture is chapters → scenes → beats. A beat is a sentence or two of narration, or a number (a silent
   pause in seconds), or [text, extra seconds]. A beat's length comes from its word count; if the voice runs
   longer than its beat, the staged animation holds (waits) while ambient motion keeps moving.
   A scene draws from S = { t: staged time in the scene, w: wall time in the scene (never holds), B: beat
   starts, D: beat lengths, b: current beat, at(k, d, delay), win(k0, k1, d), since(k), T: scene length }.
   Loaded lazily by the #lecture pages (v6 lec-pages.js), together with the lecture texts. */
(function () {
  const WL = (window.WL = window.WL || {});
  const LEC = (WL.lec = WL.lec || {});
  LEC.all = LEC.all || {};
  LEC.def = (spec) => { LEC.all[spec.id] = spec; };
  const WPS = 2.45, MIN_BEAT = 2.3, GAP = 0.72, FADE = 0.9;
  const C = WL.C, clamp = WL.clamp, smooth = WL.smooth, lerp = WL.lerp;

  /* ---------- the timeline ---------- */
  const nwords = (s) => (s ? String(s).trim().split(/\s+/).length : 0);
  function plan(spec) {
    const scenes = [], chapters = []; let G = 0;
    spec.chapters.forEach((ch, ci) => {
      const [title, list] = ch; chapters.push({ title, g0: G, s0: scenes.length, i: ci });
      list.forEach((sc) => {
        const B = [], D = [], T = []; let t = sc.lead == null ? 0.35 : sc.lead;
        (sc.say || []).forEach((b) => {
          let text = '', extra = 0;
          if (typeof b === 'number') extra = b; else if (Array.isArray(b)) { text = b[0]; extra = b[1] || 0; } else text = b;
          const n = nwords(text), d = (n ? Math.max(MIN_BEAT, n / WPS + GAP) : 0) + extra;
          B.push(t); D.push(d); T.push(text); t += d;
        });
        const dur = t + (sc.tail == null ? 0.9 : sc.tail);
        scenes.push({ sc, ci, B, D, T, dur, g0: G });
        G += dur;
      });
    });
    chapters.forEach((c, i) => { c.g1 = i + 1 < chapters.length ? chapters[i + 1].g0 : G; });
    return { scenes, chapters, total: G, words: scenes.reduce((n, s) => n + s.T.reduce((m, x) => m + nwords(x), 0), 0) };
  }
  LEC.plan = plan;
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  LEC.mmss = mmss;

  /* the frame context a scene draws from */
  function ctxS(s, t, w) {
    const B = s.B; let b = -1; for (let k = 0; k < B.length; k++) if (t >= B[k] - 1e-6) b = k;
    const at = (k, d = 0.8, dl = 0) => (k >= 0 && k < B.length ? smooth((t - B[k] - dl) / d) : k < 0 ? 1 : 0);
    return {
      t, w, B, D: s.D, b, T: s.dur, at,
      win: (k0, k1, d = 0.6) => Math.min(at(k0, d), k1 == null || k1 >= B.length ? 1 : 1 - at(k1, d)),
      since: (k) => (k >= 0 && k < B.length ? t - B[k] : -1),
      in: (t0, d = 0.8) => smooth((t - t0) / d)
    };
  }
  LEC.ctxS = ctxS;

  /* ---------- the kit: small building blocks for scenes ---------- */
  const K = (LEC.K = {
    C,
    /* LaTeX written at beat k (Manim's Write), optionally faded out at beat o.out */
    tex(r, S, k, src, x, y, o = {}) {
      if (k >= S.B.length) return null; const t0 = (k < 0 ? 0 : S.B[k]) + (o.dl || 0); if (S.t < t0 && !o.ghost) return null;
      let a = o.a == null ? 1 : o.a; if (o.out != null && o.out < S.B.length) a *= 1 - smooth((S.t - S.B[o.out] - (o.odl || 0)) / 0.55);
      if (a <= 0.003) return null;
      return r.texAt(src, x, y, t0, { size: o.size || 34, c: o.c, align: o.align, a, dur: o.dur, scale: o.scale });
    },
    /* plain text that fades in at beat k */
    txt(r, S, k, str, x, y, o = {}) {
      let a = S.at(k, o.d || 0.7, o.dl || 0); if (o.out != null) a *= 1 - S.at(o.out, 0.55, o.odl || 0);
      if (a <= 0.003) return; r.txt(str, x, y + (1 - a) * 6, { size: o.size || 22, c: o.c || C.ink, align: o.align || 'left', sans: o.sans, bold: o.bold, italic: o.italic, a: a * (o.a == null ? 1 : o.a) });
    },
    /* rows of working that appear one per beat; o.ks gives explicit beats; the last row can be boxed */
    calc(r, S, k0, x, y, rows, o = {}) {
      const dy = o.dy || 54, size = o.size || 30;
      rows.forEach((src, i) => {
        const k = o.ks ? o.ks[i] : k0 + i;
        K.tex(r, S, k, src, x, y + i * dy, { size, align: 'left', c: o.cs ? o.cs[i] : o.c, out: o.out, dl: o.dl });
      });
      if (o.box) {
        const i = rows.length - 1, k = o.ks ? o.ks[i] : k0 + i, sz = r.texSize(rows[i], size), q = S.at(k, 0.6, 1.1) * (o.out != null ? 1 - S.at(o.out, 0.5) : 1);
        if (sz && q > 0) r.rr(x - 12, y + i * dy - sz.h / 2 - 10, sz.w + 24, sz.h + 20, 8, { c: o.boxc || C.yellow, w: 2.2, a: q });
      }
    },
    /* Manim's Circumscribe round a region at beat k */
    hl(r, S, k, x, y, w, h, o = {}) { const s = S.since(k) - (o.dl || 0); if (k >= S.B.length || s < 0) return; r.circum(x, y, w, h, clamp(s / (o.d || 1.4)), { c: o.c || C.yellow, pad: o.pad || 8 }); },
    /* a box that stays */
    box(r, S, k, x, y, w, h, o = {}) { const a = S.at(k, 0.6, o.dl || 0) * (o.out != null ? 1 - S.at(o.out, 0.5) : 1); if (a > 0) r.rr(x, y, w, h, o.rad || 10, { c: o.c || C.blue, w: o.w || 2, fill: o.fill, fa: o.fa == null ? 0.12 : o.fa, a }); },
    /* an arrow that grows at beat k */
    arrow(r, S, k, x1, y1, x2, y2, o = {}) { const p = S.at(k, o.d || 0.7, o.dl || 0) * (o.out != null ? 1 - S.at(o.out, 0.5) : 1); if (p > 0) r.arrow(x1, y1, x2, y2, { c: o.c || C.ink, w: o.w || 3, p: o.fadeOnly ? 1 : p, a: o.fadeOnly ? p : 1, head: o.head }); },
    /* a list of short points, one per beat */
    list(r, S, ks, items, x, y, o = {}) {
      const dy = o.dy || 46;
      items.forEach((it, i) => {
        const a = S.at(ks[i], 0.6) * (o.out != null ? 1 - S.at(o.out, 0.5) : 1); if (a <= 0) return;
        r.dot(x, y + i * dy, { r: 4, c: o.dc || C.blue, a });
        r.txt(it, x + 18, y + i * dy + (1 - a) * 5, { size: o.size || 22, c: o.c || C.ink, a });
      });
    },
    /* a centred title card */
    title(r, S, title, sub, o = {}) {
      const a = S.in(0.15, 1.1), b = S.in(0.9, 1);
      r.txt(title, 480, (o.y || 236) + (1 - a) * 10, { size: o.size || 48, align: 'center', a });
      r.line(480 - 210 * b, (o.y || 236) + 38, 480 + 210 * b, (o.y || 236) + 38, { c: o.c || C.blue, w: 2.5 });
      if (sub) r.txt(sub, 480, (o.y || 236) + 82, { size: o.ssize || 23, align: 'center', c: C.greyB, a: S.in(1.4, 1) });
    },
    /* 3b1b's "pause and ponder": a question with a ring that counts the pause */
    ponder(r, S, k, q, o = {}) {
      const a = S.at(k, 0.8); if (a <= 0) return;
      r.txt(o.head || 'Pause and think', 480, (o.y || 150), { size: 18, align: 'center', c: C.yellow, sans: true, a });
      if (Array.isArray(q)) q.forEach((line, i) => r.txt(line, 480, (o.y || 150) + 52 + i * 38, { size: o.size || 28, align: 'center', a }));
      else r.txt(q, 480, (o.y || 150) + 52, { size: o.size || 28, align: 'center', a });
      const T = S.D[k] || 6, f = clamp(S.since(k) / T), out = k + 1 < S.B.length ? 1 - S.at(k + 1, 0.5) : 1;
      if (out > 0) r.circle(480, (o.y || 150) + 150 + (Array.isArray(q) ? 38 * (q.length - 1) : 0), 16, { c: C.yellow, w: 3, p: f, a: a * 0.9 * out });
    },
    /* axes helper with a drawn-in progress */
    axes(r, o) { return r.axes({ grid: false, ...o }); },
    /* plot y = f(x) on axes A, drawn in with progress p */
    plot(r, A, f, a, b, p = 1, o = {}) { return A.fn(f, a, b, { c: o.c || C.yellow, w: o.w || 3, p, n: o.n || 240, a: o.a, dash: o.dash }); },
    /* ambient oscillation helper */
    osc: (w, f, ph = 0) => Math.cos(2 * Math.PI * f * w + ph),
    ease: smooth, clamp, lerp,
    /* a labelled point */
    pin(r, x, y, label, o = {}) { r.dot(x, y, { r: o.r || 6, c: o.c || C.yellow, a: o.a }); if (label) r.txt(label, x + (o.dx == null ? 12 : o.dx), y + (o.dy == null ? -14 : o.dy), { size: o.size || 18, c: o.lc || o.c || C.yellow, a: o.a, align: o.align }); },
    /* a mass on a spring, drawn horizontally from a wall at x0 to the block centre x */
    springMass(r, x0, y, x, o = {}) {
      r.line(x0, y - 60, x0, y + 40, { c: C.greyB, w: 4 });
      for (let k = 0; k < 6; k++) r.line(x0, y - 55 + k * 16, x0 - 12, y - 45 + k * 16, { c: C.grey, w: 2 });
      r.line(x0 - 20, y + 32, (o.floor || 900), y + 32, { c: C.greyD, w: 2 });
      r.spring(x0, y, x - 32, y, { c: o.sc || C.greyB, coils: o.coils || 12, amp: 11, w: 2.4 });
      r.rr(x - 32, y - 30, 64, 60, 6, { c: o.c || C.blue, w: 2.5, fill: o.c || C.blue, fa: 0.25 });
      if (o.label !== false) r.tex(o.label || 'm', x, y, { size: 26 });
    }
  });

  /* ---------- the player ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('wl-lec-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('wl-lec-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const ukey = () => { const A = WL.auth; return A && A.username && !A.isOwner ? ':' + A.username : ''; };
  LEC.progress = (id) => store.get('p' + ukey(), {})[id] || null;
  const saveProg = (id, o) => { const P = store.get('p' + ukey(), {}); P[id] = Object.assign(P[id] || {}, o); store.set('p' + ukey(), P); };
  const ICON = {
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z" fill="currentColor"/></svg>',
    back: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M9 5V2L4 6l5 4V7a5 5 0 1 1-5 5H2a7 7 0 1 0 7-7z" fill="currentColor"/></svg>',
    fwd: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 5V2l5 4-5 4V7a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7z" fill="currentColor"/></svg>',
    voice: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8v4h3l4 3V5L6 8z" fill="currentColor"/><path class="lx-w" d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    cc: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.6 8.4a2 2 0 1 0 0 3.2M14.1 8.4a2 2 0 1 0 0 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    fs: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const SPEEDS = [[0.8, '0.8× slow'], [0.9, '0.9×'], [1, '1× normal'], [1.15, '1.15×'], [1.3, '1.3×']];

  class Player {
    constructor(host, spec, o = {}) {
      this.spec = spec; this.P = plan(spec); this.host = host; this.o = o; this.alive = true;
      this.speed = +store.get('speed', 1) || 1; this.cc = store.get('cc', true) !== false;
      this.si = 0; this.t = 0; this.w = 0; this.playing = false; this.lastBeat = -2;
      this.voicePlan();
      this.from = null; this.fromW = 0; this.dirty = true; this.ready = false; this.hold = false; this.lastSave = 0;
      this.build();
      this.r = new WL.R(this.ctx, { W: 960, H: 540, draw() {} });
      const pr = LEC.progress(spec.id); if (pr && pr.g > 20 && pr.g < this.P.total - 25) this.resumeAt = pr.g;
      this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
      LEC.current = this; this.waitTex();
    }
    voiceOn() { const N = WL.narrate; return !!(N && N.pref && N.pref.on); }
    build() {
      const P = this.P, h = this.host;
      h.innerHTML = `<div class="lx" tabindex="-1">
        <div class="lx-stage"><canvas width="1920" height="1080" role="img" aria-label="${this.spec.title}: lecture animation"></canvas>
          <div class="lx-chap" aria-hidden="true"></div><div class="lx-cap" aria-live="polite"></div>
          <div class="lx-over"><button type="button" class="lx-big" data-a="play">${ICON.play}<span>Play the lecture</span></button>
            <button type="button" class="lx-resume" data-a="resume" hidden></button><p class="lx-wait">Preparing the equations…</p></div></div>
        <div class="lx-bar">
          <button type="button" class="lx-b" data-a="play" aria-label="Play">${ICON.play}</button>
          <button type="button" class="lx-b" data-a="back" aria-label="Back 10 seconds" title="Back 10 s (←)">${ICON.back}</button>
          <button type="button" class="lx-b" data-a="fwd" aria-label="Forward 10 seconds" title="Forward 10 s (→)">${ICON.fwd}</button>
          <div class="lx-tl" role="slider" tabindex="0" aria-label="Lecture timeline" aria-valuemin="0" aria-valuemax="${Math.round(P.total)}" aria-valuenow="0">
            ${P.chapters.map((c) => `<div class="lx-seg" style="flex:${(c.g1 - c.g0).toFixed(1)}"><i></i></div>`).join('')}
            <div class="lx-tip" hidden></div></div>
          <span class="lx-time">0:00 / ${mmss(P.total / this.speed)}</span>
          <select class="lx-speed" aria-label="Playback speed">${SPEEDS.map(([v, l]) => `<option value="${v}"${v === this.speed ? ' selected' : ''}>${l}</option>`).join('')}</select>
          <button type="button" class="lx-b" data-a="voice" aria-pressed="${this.voiceOn()}" title="Narration">${ICON.voice}</button>
          <button type="button" class="lx-b" data-a="cc" aria-pressed="${this.cc}" title="Captions (C)">${ICON.cc}</button>
          <button type="button" class="lx-b" data-a="fs" aria-label="Full screen" title="Full screen (F)">${ICON.fs}</button>
        </div></div>`;
      const $ = (s) => h.querySelector(s);
      this.root = $('.lx'); this.cv = $('canvas'); this.ctx = this.cv.getContext('2d'); this.capEl = $('.lx-cap'); this.chapEl = $('.lx-chap');
      this.over = $('.lx-over'); this.tl = $('.lx-tl'); this.tip = $('.lx-tip'); this.timeEl = $('.lx-time'); this.segs = [...h.querySelectorAll('.lx-seg i')];
      const dpr = Math.min(2, Math.max(1.25, window.devicePixelRatio || 1)); this.cv.width = Math.round(960 * dpr); this.cv.height = Math.round(540 * dpr);
      this.capEl.hidden = !this.cc;
      h.addEventListener('click', (e) => {
        const b = e.target.closest('[data-a]'); if (!b) { if (e.target.closest('.lx-stage')) this.toggle(); return; }
        const a = b.dataset.a;
        if (a === 'play') this.toggle(); else if (a === 'resume') { this.seekG(this.resumeAt || 0); this.play(); }
        else if (a === 'back') this.skip(-10); else if (a === 'fwd') this.skip(10);
        else if (a === 'voice') { const N = WL.narrate; if (N && N.pref) { N.pref.on = !N.pref.on; try { localStorage.setItem('wl-narr2', JSON.stringify(N.pref)); } catch (er) {} b.setAttribute('aria-pressed', N.pref.on); if (N.syncSwitches) N.syncSwitches(); if (!N.pref.on) this.hush(); else if (this.playing) { if (N.voice) N.voice.claim(this, true); this.rewindBeat(); } } }
        else if (a === 'cc') { this.cc = !this.cc; store.set('cc', this.cc); b.setAttribute('aria-pressed', this.cc); this.capEl.hidden = !this.cc; }
        else if (a === 'fs') { if (WL.fs) WL.fs.toggle(this.root); else { try { if (document.fullscreenElement) document.exitFullscreen(); else this.root.requestFullscreen().catch(() => {}); } catch (er) {} } }
      });
      h.querySelector('.lx-speed').addEventListener('change', (e) => { this.speed = +e.target.value; store.set('speed', this.speed); if (this.playing) this.rewindBeat(); this.dirty = true; });
      const seekAt = (ev) => { const R = this.tl.getBoundingClientRect(), f = clamp((ev.clientX - R.left) / R.width); return f * P.total; };
      let drag = false;
      this.tl.addEventListener('pointerdown', (e) => { drag = true; this.tl.setPointerCapture(e.pointerId); this.scrub(seekAt(e)); });
      this.tl.addEventListener('pointermove', (e) => { const g = seekAt(e); this.showTip(e, g); if (drag) this.scrub(g); });
      this.tl.addEventListener('pointerleave', () => { this.tip.hidden = true; });
      this.tl.addEventListener('pointerup', (e) => { if (!drag) return; drag = false; this.seekG(seekAt(e)); });
      this.tl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); this.skip(e.key === 'ArrowRight' ? 10 : -10); }
        if (e.key === 'PageDown' || e.key === 'PageUp') { e.preventDefault(); this.chapterJump(e.key === 'PageDown' ? 1 : -1); }
      });
    }
    async waitTex() {
      const t0 = performance.now();
      while (this.alive && !(WL.texReady && WL.texReady()) && performance.now() - t0 < 12000) await new Promise((r) => setTimeout(r, 120));
      if (!this.alive) return;
      for (let i = 0; i < Math.min(3, this.P.scenes.length); i++) { this.prewarm(i); await new Promise((r) => setTimeout(r, 0)); }
      this.ready = true; this.over.classList.add('ready'); this.dirty = true;
      if (this.resumeAt) { const b = this.host.querySelector('.lx-resume'); b.hidden = false; b.textContent = `Resume at ${mmss(this.resumeAt / this.speed)}`; }
      let i = 3; const bg = () => { if (!this.alive || i >= this.P.scenes.length) return; this.prewarm(i++); setTimeout(bg, 160); }; setTimeout(bg, 600);
    }
    prewarm(i) {
      const s = this.P.scenes[i]; if (!s || s._warm || !(WL.texReady && WL.texReady())) return; s._warm = 1;
      if (!this.wr) { const c = document.createElement('canvas'); c.width = 96; c.height = 54; this.wr = new WL.R(c.getContext('2d'), { W: 960, H: 540, draw() {} }); }
      const r = this.wr, times = s.B.map((b, k) => b + Math.min(3, s.D[k] * 0.9)).concat([s.dur - 0.05]);
      times.forEach((tt) => { r.t = tt; r._a = 1; r.dt = 0; try { s.sc.draw(r, ctxS(s, tt, tt)); } catch (e) {} });
    }
    beatOf(s, t) { let b = -1; for (let k = 0; k < s.B.length; k++) if (t >= s.B[k] - 1e-6) b = k; return b; }
    get g() { return this.P.scenes[this.si].g0 + this.t; }
    toggle() { if (this.playing) this.pause(); else this.play(); }
    play() {
      if (!this.ready) return; if (this.ended) { this.ended = false; this.seekG(0); }
      this.playing = true; this.over.classList.add('gone'); const V = this.voice(); if (V) V.claim(this, true); this.rewindBeat(); this.last = null; this.root.classList.add('on');
      this.host.querySelectorAll('.lx-bar [data-a=play]').forEach((b) => { b.innerHTML = ICON.pause; b.setAttribute('aria-label', 'Pause'); });
      document.querySelectorAll('video').forEach((v) => { try { v.pause(); } catch (e) {} });
    }
    pause(end) {
      this.playing = false; this.hush(); this.dirty = true; this.save(true);
      this.host.querySelectorAll('.lx-bar [data-a=play]').forEach((b) => { b.innerHTML = ICON.play; b.setAttribute('aria-label', 'Play'); });
      if (end) { this.over.classList.remove('gone'); const big = this.host.querySelector('.lx-big span'); if (big) big.textContent = 'Watch again'; saveProg(this.spec.id, { g: 0, done: true, at: Date.now() }); }
    }
    /* ---------- the voice leads ----------
       Each spoken beat is a line in the shared voice queue, handed over a little before its beat (by the voice's
       measured start-up delay). The clock may not pass a beat until its line has started, nor begin a silent pause or
       leave the scene while a line is still being read; the caption appears when the voice starts the line. If the
       voice is early, the picture jumps to it. Without a voice the plan's own timings stand. */
    voicePlan() {
      this.Q = []; this.qi = 0; this.gi = 0; this.vdirty = true;
      this.P.scenes.forEach((s, si) => { s.q = []; s.T.forEach((text, k) => { if (text) { s.q[k] = this.Q.length; this.Q.push({ si, k, g: s.g0 + s.B[k], text, st: 'pend', vl: null }); } }); });
    }
    voice() { const N = WL.narrate, V = N && N.voice; return V && this.voiceOn() && V.kind() !== 'none' ? V : null; }
    engaged() { return this.alive && this.playing; }
    lostVoice() { if (this.playing) this.pause(); }
    hush() { const V = WL.narrate && WL.narrate.voice; this.Q.forEach((x) => (x.vl = null)); if (V && V.owner() === this) V.clear(); this.vdirty = true; this.hold = false; }
    resyncVoice() {
      // from the current point on, every line is read afresh (the current beat's included: seeking lands on beat starts)
      const g = this.g; this.vdirty = false; this.qi = this.gi = 0;
      this.Q.forEach((x) => { x.vl = null; x.st = x.g < g - 0.05 ? 'skip' : 'pend'; });
    }
    feedVoice() {
      const V = this.voice(); if (!V || !V.claim(this)) return null;
      if (this.vdirty) this.resyncVoice();
      const g = this.g, ld = V.lead() * this.speed;
      while (this.qi < this.Q.length) {
        const x = this.Q[this.qi]; if (x.st !== 'pend') { this.qi++; continue; }
        if (g < x.g - ld - 0.02 || V.waiting() >= 2) break;
        this.sayLine(x, V); this.qi++;
      }
      return V;
    }
    sayLine(x, V) {
      const N = WL.narrate; x.st = 'queued';
      const l = V.say(N.speakable ? N.speakable(x.text) : x.text, { rate: Math.min(1.5, 0.92 * this.speed), owner: this }); x.vl = l;
      l.onStart(() => { if (x.vl !== l) return; x.st = 'on'; this.lineOn(x); });
      l.onEnd((y) => { if (x.vl !== l) return; x.st = y.st === 'done' ? 'done' : 'fail'; if (x.st === 'fail' && x.si === this.si && this.beatOf(this.P.scenes[this.si], this.t) === x.k) this.setCap(x.text); });
    }
    lineOn(x) {
      if (!this.alive) return;
      const s = this.P.scenes[this.si];
      if (x.si === this.si && this.t < s.B[x.k] && s.B[x.k] - this.t < 2.5) { this.w += s.B[x.k] - this.t; this.t = s.B[x.k]; }
      else if (x.si === this.si + 1 && s.dur - this.t < 2.5) { this.nextScene(0); const s2 = this.P.scenes[this.si]; this.t = this.w = s2.B[x.k]; }
      this.setCap(x.text); this.dirty = true;
    }
    voiceLimit(s) {
      let lim = Infinity, busy = false;
      while (this.gi < this.Q.length && /^(done|fail|skip)$/.test(this.Q[this.gi].st)) this.gi++;
      for (let i = this.gi; i < this.Q.length; i++) {
        const x = this.Q[i];
        if (/^(done|fail|skip)$/.test(x.st)) continue;
        if (x.si > this.si) break;
        if (x.st === 'on' || x.si < this.si) { busy = true; continue; }
        lim = s.B[x.k] - 0.005; break;            // waiting for this line to start
      }
      if (busy) {                                 // a line is still being read: no silent pause, no new scene, until it ends
        for (let k = 0; k < s.B.length; k++) if (!s.T[k] && s.B[k] > this.t && s.B[k] < lim) { lim = s.B[k] - 0.005; break; }
        lim = Math.min(lim, s.dur - 0.005);
      }
      return lim;
    }
    nextScene(over) {
      this.from = this.si; this.fromW = this.w; this.si++; this.t = over; this.w = over; this.lastBeat = -2;
      this.prewarm(this.si); this.prewarm(this.si + 1);
    }
    /* resume speaking from the start of the current sentence, so the voice and the picture agree */
    rewindBeat() { this.hush(); const s = this.P.scenes[this.si], k = this.beatOf(s, this.t); if (k >= 0) this.t = s.B[k]; this.lastBeat = -2; this.dirty = true; }
    skip(d) { this.seekG(clamp(this.g + d * this.speed, 0, this.P.total - 0.01)); }
    chapterJump(dir) { const g = this.g, C2 = this.P.chapters; let i = 0; C2.forEach((c, k) => { if (g >= c.g0 - 0.01) i = k; }); const j = clamp(i + dir, 0, C2.length - 1); this.seekG(dir < 0 && g - C2[i].g0 > 3 ? C2[i].g0 : C2[j].g0); }
    locate(g) { const S2 = this.P.scenes; let i = 0; for (let k = 0; k < S2.length; k++) if (g >= S2[k].g0 - 1e-6) i = k; return [i, clamp(g - S2[i].g0, 0, S2[i].dur)]; }
    scrub(g) { const [i, t] = this.locate(g); this.si = i; this.t = t; this.w = t; this.from = null; this.prewarm(i); this.hush(); this.dirty = true; this.lastBeat = -2; this.setCap(''); }
    seekG(g) {
      const [i, t] = this.locate(g); const s = this.P.scenes[i], k = this.beatOf(s, t);
      this.si = i; this.t = k >= 0 ? s.B[k] : t; this.w = this.t; this.from = null; this.ended = false;
      this.prewarm(i); this.prewarm(i + 1); this.hush(); this.lastBeat = -2; this.dirty = true; this.setCap(''); this.save(true);
    }
    setCap(text) { const cs = this.P.scenes[this.si]; if (text && cs && cs.sc.nocap && this.host.clientWidth >= 640) text = '';   // on a small screen the board is too small to read, so the captions stay
      if (this.capText === text) return; this.capText = text; this.capEl.classList.remove('in'); this.capEl.textContent = text || ''; if (text) { void this.capEl.offsetWidth; this.capEl.classList.add('in'); } }
    onBeat(si, k) {
      const s = this.P.scenes[si], text = k >= 0 ? s.T[k] : '';
      const x = k >= 0 && s.q && s.q[k] != null ? this.Q[s.q[k]] : null;
      if (!x || !this.voice() || /^(on|done|fail|skip)$/.test(x.st)) { if (k >= 0 || si === 0) this.setCap(text); }
      const ch = this.P.chapters[s.ci];
      if (si === ch.s0 && k <= 0 && this.chapShown !== s.ci) { this.chapShown = s.ci; this.chapEl.textContent = `${s.ci + 1}. ${ch.title}`; this.chapEl.classList.remove('on'); void this.chapEl.offsetWidth; this.chapEl.classList.add('on'); }
    }
    advance(d) {
      this.w += d; if (this.from != null) this.fromW += d;
      let s = this.P.scenes[this.si]; let nt = this.t + d;
      if (this.feedVoice()) { const lim = this.voiceLimit(s); if (nt > lim) { nt = Math.max(this.t, lim); this.hold = true; } else this.hold = false; } else this.hold = false;
      this.t = nt;
      if (this.t >= s.dur) {
        if (this.si + 1 >= this.P.scenes.length) { this.t = s.dur; this.ended = true; this.pause(true); return; }
        this.nextScene(Math.min(0.15, this.t - s.dur)); s = this.P.scenes[this.si];
      }
      const k2 = this.beatOf(s, this.t); if (k2 !== this.lastBeat) { this.lastBeat = k2; this.onBeat(this.si, k2); }
    }
    loop(now) {
      if (!this.alive) return; this.raf = requestAnimationFrame(this.loop);
      const dt = this.last == null ? 0 : Math.min(0.1, (now - this.last) / 1000); this.last = now;
      this.dtw = this.playing ? dt * this.speed : 0;
      if (this.playing && this.ready) this.advance(dt * this.speed);
      if (this.playing || this.dirty) { this.render(); this.dirty = false; this.ui(); }
      if (this.playing && now - this.lastSave > 5000) { this.lastSave = now; this.save(); }
    }
    render() {
      const r = this.r, c = this.ctx, cv = this.cv;
      c.setTransform(cv.width / 960, 0, 0, cv.height / 540, 0, 0); c.globalAlpha = 1; c.setLineDash([]); r._a = 1; r.dt = this.dtw || 0;
      r.bg();
      const e = this.from != null ? smooth(clamp(this.t / FADE)) : 1;
      if (this.from != null && e < 1) r.alpha(1 - e, () => this.drawScene(this.from, this.P.scenes[this.from].dur, this.fromW));
      else this.from = null;
      r.alpha(e, () => this.drawScene(this.si, this.t, this.w));
      c.globalAlpha = 1; c.setLineDash([]);
    }
    drawScene(i, t, w) {
      const s = this.P.scenes[i], r = this.r; r.t = t;
      try { s.sc.draw(r, ctxS(s, t, w)); } catch (err) { if (!s._err) { s._err = 1; console.error('lecture', this.spec.id, 'scene', i, err); } }
      const c = this.ctx; c.globalAlpha = 1; c.setLineDash([]);
    }
    ui() {
      const g = this.g, P = this.P;
      this.timeEl.textContent = `${mmss(g / this.speed)} / ${mmss(P.total / this.speed)}`;
      this.tl.setAttribute('aria-valuenow', Math.round(g)); this.tl.setAttribute('aria-valuetext', mmss(g / this.speed));
      P.chapters.forEach((c, i) => { this.segs[i].style.width = `${(clamp((g - c.g0) / (c.g1 - c.g0)) * 100).toFixed(2)}%`; });
      this.root.classList.toggle('hold', this.hold);
      if (this.o.onTime) this.o.onTime(g, this);
    }
    showTip(e, g) {
      const R = this.tl.getBoundingClientRect(), C2 = this.P.chapters; let i = 0; C2.forEach((c, k) => { if (g >= c.g0) i = k; });
      this.tip.hidden = false; this.tip.textContent = `${mmss(g / this.speed)} · ${C2[i].title}`;
      this.tip.style.left = `${clamp(e.clientX - R.left, 60, R.width - 60)}px`;
    }
    save(force) { if (!this.ready) return; const g = this.g; if (force || g > 5) saveProg(this.spec.id, { g, at: Date.now(), total: this.P.total }); }
    key(e) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) return false;
      const k = e.key;
      if (k === ' ' || k === 'k') { this.toggle(); return true; }
      if (k === 'ArrowLeft' || k === 'j') { this.skip(-10); return true; }
      if (k === 'ArrowRight' || k === 'l') { this.skip(10); return true; }
      if (k === 'c') { this.host.querySelector('[data-a=cc]').click(); return true; }
      if (k === 'f') { this.host.querySelector('[data-a=fs]').click(); return true; }
      if (k === ']' || k === 'PageDown') { this.chapterJump(1); return true; }
      if (k === '[' || k === 'PageUp') { this.chapterJump(-1); return true; }
      return false;
    }
    kill() { if (!this.alive) return; this.save(true); this.alive = false; cancelAnimationFrame(this.raf); this.hush(); const V = WL.narrate && WL.narrate.voice; if (V) V.release(this); if (LEC.current === this) LEC.current = null; }
  }
  LEC.Player = Player;
})();
/* Lecture: Calculus — the derivative and the integral (A-level maths → Year 1). References: 3Blue1Brown Essence of Calculus; MIT 18.01. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  // isometric box: x right-down, y left-down, z up
  const iso = (cx, cy, s) => (x, y, z) => [cx + (x - y) * 0.866 * s, cy + (x + y) * 0.5 * s - z * s];
  function box3(r, P, x0, x1, y0, y1, z0, z1, col, a = 1) {
    const f = (pts) => r.poly(pts.map((q) => P(...q)), { c: col, w: 1.6, fill: col, fa: 0.28, close: true, a });
    f([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]);
    f([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]);
    f([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]);
  }

  L.def({
    id: 'calculus', order: 1, title: 'Calculus: the derivative and the integral', sub: 'Two ideas, one theorem, and why they are the same idea seen from two sides',
    level: 'A-level → Year 1 maths', topics: ['m-differentiation', 'm-integration'], thumb: [1, 30],
    refs: [
      ['3Blue1Brown', 'The essence of calculus (chapter 1 of the series)', 'https://www.3blue1brown.com/lessons/essence-of-calculus/'],
      ['3Blue1Brown', 'All calculus lessons: derivatives, integrals, the fundamental theorem', 'https://3blue1brown.com/topics/calculus'],
      ['MIT OCW 18.01 (David Jerison)', 'Lecture 1: Derivatives, slope, velocity, rate of change', 'https://www.ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/resources/lecture-1-derivatives'],
      ['MIT OCW 18.01SC', 'Single Variable Calculus: lectures, worked examples and problem sets', 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010']
    ],
    chapters: [
      ['The area of a circle', [
        { say: ['Calculus has two big ideas: the derivative and the integral. This lecture is about both, and about the surprising fact that they are the same idea, seen from two sides.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Calculus', 'The derivative and the integral');
            const a = S.in(1.6, 1.2), A = { X: (x) => 300 + x * 90, Y: (y) => 440 - y * 70 };
            const pts = []; for (let i = 0; i <= 80; i++) { const x = (4 * i) / 80; pts.push([A.X(x), A.Y(1 + 0.5 * Math.sin(1.4 * x))]); }
            r.poly(pts.concat([[A.X(4), A.Y(0)], [A.X(0), A.Y(0)]]), { c: C.blue, w: 0, fill: C.blue, fa: 0.25, a: a * 0.8, stroke: false });
            r.poly(pts, { c: C.yellow, w: 3, a });
          } },
        { say: ['Here is a question you already know the answer to. What is the area of a circle? Let us pretend we do not know, and try to discover it.',
                'Slice the disc into thin rings, like the rings of a tree. Each ring has some radius r, and a small thickness, which we will call d r.',
                'Cut one ring and straighten it out. It becomes, very nearly, a thin rectangle. Its length is the circumference, two pi r, and its width is d r. So its area is about two pi r d r.',
                'Now stand all the straightened rings side by side, each at the position of its radius. Their heights grow in proportion to r, so together they fill a triangle.',
                'The base of the triangle is R, and its height is two pi R. Its area is one half base times height: pi R squared.',
                'Two things happened here. We added up a huge number of tiny pieces, and the thinner we made them, the more exact the answer became. That is an integral.',
                'Now read the picture the other way. When the radius grows by d r, the area grows by one more ring, two pi r d r. So the rate at which area grows with radius is the circumference. That is a derivative. The whole subject is hiding in this one picture.', 1],
          draw(r, S) {
            const cx = 230, cy = 250, R = 150, n = 14, dr = R / n;
            const sel = 9, rs = (sel + 0.5) * dr;
            r.alpha(S.at(0, 0.8), () => r.circle(cx, cy, R, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.18 }));
            for (let i = 0; i < n; i++) { const a = S.at(1, 0.6, i * 0.08); if (a > 0) r.circle(cx, cy, (i + 0.5) * dr, { c: i === sel && S.t > S.B[2] ? C.yellow : C.blueA, w: dr - 2.2, a: a * (i === sel && S.t > S.B[2] ? 1 : 0.55) }); }
            // the straightened ring
            const a2 = S.at(2, 0.9), bx = 470, by = 110;
            if (a2 > 0 && S.t < S.B[3] + 1) { const Lr = TAU * rs * 0.42 * a2; r.rect(bx, by, Lr, dr - 2, { c: C.yellow, fill: C.yellow, fa: 0.5, w: 1.5, a: 1 - S.at(3, 0.8) }); K.tex(r, S, 2, T`2\pi r \times dr`, bx + 160, by + 46, { size: 28, c: C.yellow, out: 3 }); }
            // the triangle of rings
            const a3 = S.at(3, 0.6), X0 = 470, Y0 = 430, kx = 2.2, ky = 0.4;
            if (a3 > 0) {
              for (let i = 0; i < n; i++) { const q = S.at(3, 0.5, i * 0.12); if (q <= 0) continue; const ri = (i + 0.5) * dr, h = TAU * ri * ky; r.rect(X0 + i * dr * kx, Y0 - h * q, dr * kx - 3, h * q, { c: C.blueA, fill: C.blue, fa: 0.45, w: 1.2 }); }
              const a4 = S.at(4, 0.7); if (a4 > 0) {
                r.poly([[X0, Y0], [X0 + R * kx, Y0], [X0 + R * kx, Y0 - TAU * R * ky]], { c: C.yellow, w: 3, close: true, a: a4 });
                r.tex('R', X0 + R * kx / 2, Y0 + 24, { size: 24, c: C.yellow, a: a4 }); r.tex(T`2\pi R`, X0 + R * kx + 40, Y0 - TAU * R * ky / 2, { size: 24, c: C.yellow, a: a4 });
                K.tex(r, S, 4, T`\tfrac12 \cdot R \cdot 2\pi R = \pi R^{2}`, 640, 92, { size: 34, c: C.yellow, dl: 0.6 });
              }
            }
            K.tex(r, S, 5, T`\int_0^R 2\pi r\,dr`, 230, 470 - 20, { size: 30, c: C.blue, out: 6 });
            K.tex(r, S, 6, T`\frac{dA}{dr} = 2\pi r`, 230, 450, { size: 32, c: C.green });
          } },
        { say: [['Pause and think. Does the same trick work for a ball? Slice a sphere into thin shells instead of rings.', 4],
                'It does. Each shell has area four pi r squared and thickness d r. Adding them up gives four thirds pi R cubed, and turning it round, the rate at which the volume grows with radius is four pi R squared: the surface area. The derivative of the volume is the surface.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['A sphere, sliced into thin shells: what do you get?'], { y: 90 });
            K.tex(r, S, 1, T`V = \int_0^R 4\pi r^{2}\,dr = \tfrac43\pi R^{3}`, 480, 300, { size: 36, c: C.yellow });
            K.tex(r, S, 1, T`\frac{dV}{dR} = 4\pi R^{2}`, 480, 390, { size: 34, c: C.green, dl: 1.2 });
          } }
      ]],
      ['The paradox of the derivative', [
        { say: ['A car\'s position along a road is plotted against time. What is its speed at exactly two seconds?',
                'Speed is distance divided by time. But in a single instant no time passes and no distance is covered: zero divided by zero. This is the paradox of the derivative.',
                'The way out is to ask a better question. Over a short interval, from 2 to 2 plus delta t, the average speed is the change in s divided by delta t. On the graph, that is the slope of a line through two points: a secant.',
                ['Now shrink delta t. The second point slides towards the first, and the slope settles down to a definite value. That limiting value is what we mean by the speed at an instant.', 2],
                'Geometrically, the secant becomes the tangent line: the line that just touches the curve at that point, with the same direction as the curve.'],
          draw(r, S) {
            const f = (t) => 0.9 * t * t - 0.12 * t * t * t + 0.6 * t, df = (t) => 1.8 * t - 0.36 * t * t + 0.6;
            const A = K.axes(r, { x0: 90, y0: 430, w: 560, h: 340, xr: [0, 5], yr: [0, 9.5], xl: 't', yl: 's', xt: [0, 5, 1], yt: [0, 9, 3] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, f, 0, 5, S.at(0, 1.6, 0.3));
            const t0 = 2, p0 = A.pt(t0, f(t0));
            r.alpha(S.at(0, 0.6, 1.2), () => K.pin(r, p0[0], p0[1], 't = 2', { c: C.yellow, dx: -60 }));
            const a2 = S.at(2, 0.8); if (a2 > 0) {
              const dt = lerp(1.6, 0.04, S.at(3, 4)), t1 = t0 + dt, m = (f(t1) - f(t0)) / dt, p1 = A.pt(t1, f(t1));
              r.alpha(a2, () => {
                r.line(A.X(t0 - 1.4), A.Y(f(t0) - 1.4 * m), A.X(t1 + 1.2), A.Y(f(t0) + (dt + 1.2) * m), { c: S.t > S.B[4] ? C.green : C.blue, w: 2.5 });
                r.dot(p1[0], p1[1], { r: 6, c: C.blue });
                if (dt > 0.25) { r.line(p0[0], p0[1], p1[0], p0[1], { c: C.greyB, w: 1.5, dash: [4, 4] }); r.line(p1[0], p0[1], p1[0], p1[1], { c: C.greyB, w: 1.5, dash: [4, 4] }); r.tex(T`\Delta t`, (p0[0] + p1[0]) / 2, p0[1] + 18, { size: 20, c: C.greyB }); r.tex(T`\Delta s`, p1[0] + 24, (p0[1] + p1[1]) / 2, { size: 20, c: C.greyB }); }
                r.tex(T`\frac{\Delta s}{\Delta t} = ` + m.toFixed(3), 820, 200, { size: 32, c: C.blue });
                r.tex(T`\Delta t = ` + dt.toFixed(2), 820, 260, { size: 26, c: C.greyB });
              });
              K.tex(r, S, 4, T`v(2) = ` + df(2).toFixed(2), 820, 340, { size: 34, c: C.green });
            }
          } },
        { say: ['Written as a formula, the derivative of f at x is the limit, as h goes to zero, of f of x plus h, minus f of x, all over h.',
                'Try it on f of x equals x squared. Expand x plus h, squared: x squared, plus two x h, plus h squared. Subtract x squared, and two x h plus h squared remains.',
                'Divide by h, and you have two x plus h. Now let h shrink to zero: the derivative is two x.',
                'Numbers make it concrete. At x equals 3, with h equal to 0.1, the ratio is 6.1. With h equal to 0.01, it is 6.01. The answer closes in on 6, which is two times three.',
                'Notice what the limit really does. We never divide by zero. We compute the ratio for small, non-zero h, and ask what value it approaches as h gets smaller and smaller.'],
          draw(r, S) {
            K.tex(r, S, 0, T`f'(x) = \lim_{h\to 0}\frac{f(x+h) - f(x)}{h}`, 480, 90, { size: 40, c: C.yellow });
            K.calc(r, S, 1, 90, 190, [T`(x+h)^{2} - x^{2} = 2xh + h^{2}`, T`\frac{2xh + h^{2}}{h} = 2x + h \;\longrightarrow\; 2x`], { ks: [1, 2], dy: 80, size: 32 });
            const a = S.at(3, 0.6);
            if (a > 0) [['0.1', '6.1'], ['0.01', '6.01'], ['0.001', '6.001']].forEach(([h, v], i) => { const q = S.at(3, 0.5, 0.6 + i * 0.8); r.tex(T`h = ${h}:\ \ ${v}`, 760, 210 + i * 54, { size: 28, c: C.blue, a: q }); });
            K.txt(r, S, 4, 'small but never zero: the ratio approaches a limit', 480, 430, { size: 22, align: 'center', c: C.greyB });
          } }
      ]],
      ['Derivatives you can see', [
        { say: ['Formulas for derivatives can be seen as well as calculated. Think of x squared as the area of a square of side x.',
                'Now nudge the side by a tiny amount, d x. The area grows by two thin strips, each x by d x, plus a tiny corner square, d x by d x.',
                'When d x is small, the corner is tiny compared with the strips: if d x is a thousandth, the corner is a millionth. So the change in area is two x d x, and the derivative of x squared is two x.',
                'The same picture works in three dimensions. A cube of side x has volume x cubed. Grow the side by d x and three thin slabs appear, each x squared by d x. The other pieces are smaller still.',
                'So the derivative of x cubed is three x squared. The pattern continues: the derivative of x to the n is n times x to the n minus one, because the main growth comes from n faces.'],
          draw(r, S) {
            const x0 = 90, y0 = 110, s = 190, d = 46 * S.at(1, 1.2);
            r.alpha(S.at(0, 0.8), () => { r.rect(x0, y0, s, s, { c: C.blue, w: 2, fill: C.blue, fa: 0.3 }); r.tex('x', x0 + s / 2, y0 - 18, { size: 24 }); r.tex('x', x0 - 18, y0 + s / 2, { size: 24 }); });
            if (d > 0.5) {
              r.rect(x0 + s, y0, d, s, { c: C.yellow, w: 1.5, fill: C.yellow, fa: 0.4 }); r.rect(x0, y0 + s, s, d, { c: C.yellow, w: 1.5, fill: C.yellow, fa: 0.4 });
              r.rect(x0 + s, y0 + s, d, d, { c: C.red, w: 1.5, fill: C.red, fa: 0.5 });
              K.tex(r, S, 1, T`dx`, x0 + s + d / 2, y0 - 18, { size: 20, c: C.yellow, dl: 0.6 });
            }
            K.tex(r, S, 2, T`d(x^{2}) = 2x\,dx + (dx)^{2} \approx 2x\,dx`, 230, 440, { size: 28 });
            const a3 = S.at(3, 0.8); if (a3 > 0) {
              const P = iso(700, 230, 95), e = 0.32 * S.at(3, 1.2, 0.8);
              box3(r, P, 0, 1, 0, 1, 0, 1, C.blue, a3);
              if (e > 0.01) { box3(r, P, 1, 1 + e, 0, 1, 0, 1, C.yellow, a3); box3(r, P, 0, 1, 1, 1 + e, 0, 1, C.yellow, a3); box3(r, P, 0, 1, 0, 1, 1, 1 + e, C.yellow, a3); }
            }
            K.tex(r, S, 4, T`\frac{d}{dx}x^{3} = 3x^{2},\qquad \frac{d}{dx}x^{n} = n\,x^{n-1}`, 690, 440, { size: 28, c: C.green });
          } },
        { say: ['Here is one more you can see: the derivative of sine. Put a point on a circle of radius one, at angle theta. Its height is sin theta.',
                'Increase the angle by a small amount, d theta. The point moves a distance d theta along the circle, because on a unit circle, arc length equals angle.',
                'That small step is the hypotenuse of a tiny right-angled triangle. The triangle has the same shape as the big one, turned through ninety degrees, so its vertical side is cos theta times d theta.',
                'So the height changes by cos theta d theta: the derivative of sin theta is cos theta. By the same triangle, the horizontal position changes by minus sin theta d theta, so the derivative of cos theta is minus sin theta. These two facts drove the whole of the simple harmonic motion lecture.'],
          draw(r, S) {
            const cx = 280, cy = 280, R = 170, th = 0.85, dth = 0.32 * S.at(1, 1);
            r.circle(cx, cy, R, { c: C.greyB, w: 2, a: S.at(0, 0.8) }); r.line(cx - R - 20, cy, cx + R + 30, cy, { c: C.greyD, w: 1.5 }); r.line(cx, cy + R + 10, cx, cy - R - 20, { c: C.greyD, w: 1.5 });
            const P = [cx + R * Math.cos(th), cy - R * Math.sin(th)], Q = [cx + R * Math.cos(th + dth), cy - R * Math.sin(th + dth)];
            r.alpha(S.at(0, 0.8), () => { r.line(cx, cy, ...P, { c: C.greyB, w: 2 }); r.dot(...P, { r: 6, c: C.yellow }); r.line(P[0], P[1], P[0], cy, { c: C.yellow, w: 2, dash: [5, 5] }); r.angle(cx, cy, 44, 0, th, { c: C.blue, tex: T`\theta`, size: 20 }); r.tex(T`\sin\theta`, P[0] + 34, (P[1] + cy) / 2, { size: 22, c: C.yellow }); });
            if (dth > 0.01) { r.angle(cx, cy, R, th, th + dth, { c: C.red, w: 3 }); r.dot(...Q, { r: 5, c: C.red }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) { r.poly([P, [P[0], Q[1]], Q], { c: C.green, w: 2.5, a: a2 }); r.line(P[0], P[1], Q[0], Q[1], { c: C.red, w: 2.5, a: a2 }); r.tex(T`\cos\theta\,d\theta`, P[0] + 70, (P[1] + Q[1]) / 2, { size: 22, c: C.green, a: a2 }); }
            K.tex(r, S, 3, T`\frac{d}{d\theta}\sin\theta = \cos\theta`, 720, 200, { size: 34, c: C.yellow });
            K.tex(r, S, 3, T`\frac{d}{d\theta}\cos\theta = -\sin\theta`, 720, 290, { size: 34, c: C.blue, dl: 1.6 });
          } },
        { say: ['Here is a worked example from the first lecture of MIT\'s calculus course. Draw the tangent line to the curve y equals one over x, at the point where x equals a.',
                'The slope is the derivative of one over x, which is minus one over x squared: minus one over a squared at our point.',
                'So the tangent line is y minus one over a equals minus one over a squared, times x minus a. Set y to zero and it crosses the x-axis at x equals two a. Set x to zero and it crosses the y-axis at two over a.',
                'The tangent and the two axes make a triangle with area one half times two a times two over a. The a cancels. The area is always exactly two, wherever you draw the tangent.',
                'Watch the point move: the triangle changes shape, from tall and thin to long and flat, but its area never changes. Surprises like this are why calculus is worth learning carefully.', 2],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 440, w: 470, h: 380, xr: [0, 6.2], yr: [0, 5], xl: 'x', yl: 'y', xt: [0, 6, 1], yt: [0, 5, 1] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, (x) => 1 / x, 0.2, 6.2, S.at(0, 1.4, 0.3));
            const a = 1.5 + (S.t > S.B[4] ? 0.9 * Math.sin(0.7 * (S.t - S.B[4])) : 0), p = A.pt(a, 1 / a);
            const at = S.at(1, 0.7); if (at > 0) { r.alpha(at, () => { r.line(A.X(0), A.Y(2 / a), A.X(2 * a), A.Y(0), { c: C.blue, w: 2.5 }); K.pin(r, p[0], p[1], 'x = a', { c: C.yellow, dx: 10 }); }); }
            const a3 = S.at(3, 0.7); if (a3 > 0) r.poly([A.pt(0, 0), A.pt(2 * a, 0), A.pt(0, 2 / a)], { c: C.green, w: 2, fill: C.green, fa: 0.25, close: true, a: a3 });
            K.tex(r, S, 1, T`y' = -\frac{1}{a^{2}}`, 620, 110, { size: 30, align: 'left' });
            K.tex(r, S, 2, T`x\text{-intercept } 2a,\ \ y\text{-intercept } \frac{2}{a}`, 620, 190, { size: 26, align: 'left' });
            K.tex(r, S, 3, T`\text{area} = \tfrac12\cdot 2a\cdot\frac{2}{a} = 2`, 620, 280, { size: 32, align: 'left', c: C.green });
            if (S.t > S.B[4]) r.tex(T`a = ` + a.toFixed(2) + T`,\ \ \text{area} = 2.00`, 620, 360, { size: 26, align: 'left', c: C.yellow });
          } }
      ]],
      ['Product and chain rules', [
        { say: ['Real functions are built from simpler ones, by multiplying them and by putting one inside another. Each kind of building has a rule, and each rule has a picture.',
                'Product first. Think of f times g as the area of a rectangle with sides f and g. If both sides change, by d f and d g, the area gains two strips, f d g and g d f, plus a tiny corner.',
                'Drop the corner, which is a product of two small things, and you have the product rule: the derivative of f g is f times g prime, plus g times f prime.',
                'For example, the derivative of x squared times sin x is two x sin x, plus x squared cos x. Each factor takes its turn being differentiated, while the other one waits.'],
          draw(r, S) {
            const x0 = 110, y0 = 100, fw = 260, gh = 170, df = 54 * S.at(1, 1), dg = 40 * S.at(1, 1, 0.3);
            r.alpha(S.at(0, 0.8), () => { r.rect(x0, y0, fw, gh, { c: C.blue, w: 2, fill: C.blue, fa: 0.3 }); r.tex('f', x0 + fw / 2, y0 - 18, { size: 26 }); r.tex('g', x0 - 18, y0 + gh / 2, { size: 26 }); });
            if (df > 0.5) {
              r.rect(x0 + fw, y0, df, gh, { c: C.yellow, w: 1.5, fill: C.yellow, fa: 0.4 }); r.rect(x0, y0 + gh, fw, dg, { c: C.green, w: 1.5, fill: C.green, fa: 0.4 }); r.rect(x0 + fw, y0 + gh, df, dg, { c: C.red, w: 1.5, fill: C.red, fa: 0.5 });
              K.tex(r, S, 1, T`g\,df`, x0 + fw + df / 2 + 34, y0 + gh / 2, { size: 22, c: C.yellow, dl: 0.8 }); K.tex(r, S, 1, T`f\,dg`, x0 + fw / 2, y0 + gh + dg / 2 + 26, { size: 22, c: C.green, dl: 0.8 });
            }
            K.tex(r, S, 2, T`(fg)' = f\,g' + g\,f'`, 690, 150, { size: 36, c: C.yellow });
            K.tex(r, S, 3, T`\frac{d}{dx}\big(x^{2}\sin x\big) = 2x\sin x + x^{2}\cos x`, 690, 280, { size: 28 });
          } },
        { say: ['Now the chain rule, for a function inside a function, like sin of x squared. Picture three number lines: x, then u equals x squared, then y equals sin u.',
                'Nudge x by d x. The middle line feels a nudge d u, which is two x times d x, because squaring stretches small intervals by the factor two x.',
                'That nudge in u produces a nudge in y of cos u times d u, because sine stretches small intervals by cos u. The stretches multiply.',
                'So the derivative of sin of x squared is cos of x squared, times two x. The outer derivative, evaluated at the inner function, times the derivative of the inner function.',
                'Check it with numbers at x equals one. The formula gives two cos one, which is 1.0806. The difference quotient with h equal to a thousandth gives 1.0795, and with h equal to a millionth, 1.0806. The chain rule is not a trick: it is stretching factors multiplying.'],
          draw(r, S) {
            const lines = [['x', 1, 0.3, 110, C.blue], ['u = x^2', 1, 0.6, 225, C.yellow], ['y = \\sin u', Math.sin(1), 0.6 * Math.cos(1), 340, C.green]];
            lines.forEach(([lab, v, half, y, col], i) => {
              const a = S.at(0, 0.7, i * 0.3); if (a <= 0) return;
              r.alpha(a, () => { r.line(120, y, 640, y, { c: C.greyB, w: 2 }); for (let k = 0; k <= 4; k++) { const X = 120 + k * 130; r.line(X, y - 6, X, y + 6, { c: C.greyB, w: 1.5 }); } r.tex(lab, 70, y, { size: 22, c: col }); });
              const q = S.at(i === 0 ? 1 : i === 1 ? 1 : 2, 0.7, i === 1 ? 1 : 0); if (q <= 0) return;
              const X = 120 + v * 260, hw = half * 120;
              r.line(X - hw, y, X + hw, y, { c: col, w: 7, a: q }); r.dot(X, y, { r: 5, c: C.ink, a: q });
            });
            K.tex(r, S, 1, T`du = 2x\,dx`, 800, 168, { size: 28, c: C.yellow });
            K.tex(r, S, 2, T`dy = \cos u\,du`, 800, 283, { size: 28, c: C.green });
            K.tex(r, S, 3, T`\frac{d}{dx}\sin(x^{2}) = \cos(x^{2})\cdot 2x`, 480, 470 - 30, { size: 30, out: 4 });
            K.tex(r, S, 4, T`x = 1:\ \ 2\cos 1 = 1.0806;\quad h = 10^{-3}:\ 1.0795;\quad h = 10^{-6}:\ 1.0806`, 480, 440, { size: 26, c: C.yellow });
          } }
      ]],
      ['What derivatives are for', [
        { say: ['Before integrals, three things derivatives are for. First: why is the number e special? Look at two to the x. Its derivative is the limit of two to the x, times two to the h minus one, over h.',
                'So the derivative of two to the x is proportional to two to the x itself. The constant is the limit of two to the h minus one, over h. With h equal to 0.1 it is 0.718; with 0.01, 0.696; with 0.001, 0.6934. It settles at 0.6931, the natural log of two.',
                'For three to the x, the same constant is 1.0986. Somewhere between two and three there is a base whose constant is exactly one. That base is e, 2.718 and so on, and it is the only exponential that is its own derivative.',
                'That is why e appears whenever a quantity grows or decays at a rate proportional to itself: radioactive decay, charging capacitors, cooling coffee, and the damped oscillator in the next lecture.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\frac{d}{dx}2^{x} = 2^{x}\cdot\lim_{h\to0}\frac{2^{h}-1}{h}`, 480, 80, { size: 32 });
            const rows = [['0.1', '0.7177'], ['0.01', '0.6956'], ['0.001', '0.6934']];
            rows.forEach(([h, v], i) => { const q = S.at(1, 0.5, 0.4 + i * 0.9); if (q > 0) r.tex(T`h = ${h}:\ \ ${v}`, 200, 170 + i * 50, { size: 26, c: C.blue, a: q }); });
            K.tex(r, S, 1, T`\to \ln 2 = 0.6931`, 200, 330, { size: 28, c: C.blue, dl: 3.4 });
            const A = K.axes(r, { x0: 430, y0: 440, w: 460, h: 265, xr: [-1.5, 2], yr: [0, 8], xl: 'x', yl: 'y' }), a2 = S.at(2, 0.8);
            if (a2 > 0) { r.alpha(a2, () => A.draw(1)); K.plot(r, A, (x) => Math.pow(2, x), -1.5, 2, a2, { c: C.blue, w: 2.5 }); K.plot(r, A, (x) => Math.pow(3, x), -1.5, 1.85, a2, { c: C.green, w: 2.5 }); K.plot(r, A, Math.exp, -1.5, 2, S.at(2, 1.2, 1), { c: C.yellow, w: 3.5 }); r.tex(T`2^{x}`, A.X(2) + 26, A.Y(4), { size: 22, c: C.blue, a: a2 }); r.tex(T`3^{x}`, A.X(1.85) - 30, A.Y(7.6), { size: 22, c: C.green, a: a2 }); }
            K.tex(r, S, 2, T`\frac{d}{dx}e^{x} = e^{x}`, 200, 400, { size: 34, c: C.yellow, dl: 1.2 });
          } },
        { say: ['Second: finding the best. Cut equal squares of side x from the corners of a twelve-centimetre sheet, and fold up the sides to make an open box. Which x gives the biggest volume?',
                'The base is twelve minus two x on each side, and the height is x, so the volume is x times twelve minus two x, squared.',
                'At the top of a smooth hill the slope is zero, so set the derivative to zero. It factorises as twelve minus two x, times twelve minus six x. The solutions are x equals six, which leaves no box at all, and x equals two.',
                'At x equals two the volume is two times eight squared: 128 cubic centimetres. The second derivative there is minus 48, negative, so it really is a maximum and not a minimum.'],
          draw(r, S) {
            const x0 = 80, y0 = 110, s = 240, c = 40 * S.at(0, 1, 0.8);
            r.alpha(S.at(0, 0.8), () => { r.rect(x0, y0, s, s, { c: C.blue, w: 2, fill: C.blue, fa: 0.2 }); });
            if (c > 1) [[0, 0], [s - c, 0], [0, s - c], [s - c, s - c]].forEach(([dx, dy]) => r.rect(x0 + dx, y0 + dy, c, c, { c: C.red, w: 1.5, fill: '#0c0e12', fa: 1 }));
            if (c > 1) { r.line(x0 + c, y0 + c, x0 + s - c, y0 + c, { c: C.greyB, w: 1.2, dash: [5, 5] }); r.line(x0 + c, y0 + s - c, x0 + s - c, y0 + s - c, { c: C.greyB, w: 1.2, dash: [5, 5] }); r.line(x0 + c, y0 + c, x0 + c, y0 + s - c, { c: C.greyB, w: 1.2, dash: [5, 5] }); r.line(x0 + s - c, y0 + c, x0 + s - c, y0 + s - c, { c: C.greyB, w: 1.2, dash: [5, 5] }); r.tex('x', x0 + c / 2, y0 - 14, { size: 20, c: C.red }); r.tex('12 - 2x', x0 + s / 2, y0 + s + 22, { size: 20 }); }
            K.tex(r, S, 1, T`V = x\,(12 - 2x)^{2}`, 640, 90, { size: 32 });
            const A = K.axes(r, { x0: 430, y0: 440, w: 440, h: 230, xr: [0, 6], yr: [0, 140], xl: 'x', yl: 'V', xt: [0, 6, 1] }), a = S.at(1, 0.8, 0.6);
            if (a > 0) { r.alpha(a, () => A.draw(1)); K.plot(r, A, (x) => x * (12 - 2 * x) ** 2, 0, 6, a); }
            K.tex(r, S, 2, T`V' = (12-2x)(12-6x) = 0`, 640, 150, { size: 28, c: C.yellow });
            const b = S.at(3, 0.6); if (b > 0) { r.line(A.X(1.2), A.Y(128), A.X(2.8), A.Y(128), { c: C.green, w: 2.5, a: b }); K.pin(r, ...A.pt(2, 128), '(2, 128)', { c: C.green, a: b, dy: -16 }); }
            K.tex(r, S, 3, T`V'' = 24x - 96 = -48 < 0`, 640, 205, { size: 26, c: C.green, dl: 0.8 });
          } },
        { say: ['Third: approximation. Near a point, a smooth curve is almost its tangent line. So f of a plus h is about f of a, plus h times f prime of a.',
                'Estimate the square root of 4.1. Use a equals 4, where the root is 2, and the derivative of root x is one over two root x: one quarter. The estimate is two plus 0.1 over four, which is 2.025.',
                'The true value is 2.02485. One line of calculus, accurate to better than one part in ten thousand. Every engineer and physicist uses this trick, usually without saying so: it is why small oscillations are harmonic, and why sin theta is nearly theta for small angles.'],
          draw(r, S) {
            K.tex(r, S, 0, T`f(a+h) \approx f(a) + h\,f'(a)`, 480, 80, { size: 34, c: C.yellow });
            const A = K.axes(r, { x0: 90, y0: 440, w: 420, h: 300, xr: [0, 8], yr: [0, 3.2], xl: 'x', yl: 'y', xt: [0, 8, 2], yt: [0, 3, 1] });
            A.draw(S.at(1, 0.8)); K.plot(r, A, Math.sqrt, 0, 8, S.at(1, 1.2, 0.3));
            const a = S.at(1, 0.7, 1.4); if (a > 0) { r.line(A.X(0.5), A.Y(2 + (0.5 - 4) / 4), A.X(8), A.Y(2 + 1), { c: C.blue, w: 2.5, a }); K.pin(r, ...A.pt(4, 2), '(4, 2)', { c: C.yellow, a, dy: 22 }); }
            K.calc(r, S, 1, 560, 200, [T`\sqrt{4.1} \approx 2 + \frac{0.1}{4} = 2.025`, T`\sqrt{4.1} = 2.02485\ldots`], { ks: [1, 2], dy: 70, size: 28 });
          } }
      ]],
      ['The integral: adding up tiny pieces', [
        { say: ['Now the other big idea. A car\'s velocity is plotted against time. How far does it travel?',
                'If the velocity were constant, distance would be velocity times time: the area of a rectangle under the graph. When the velocity changes, chop time into short intervals. In each one the velocity is nearly constant, so each distance is a thin rectangle.',
                'Add up the rectangles and you have the approximate distance. As the intervals get thinner, the approximation gets better, and the sum approaches the exact area under the curve.',
                'We write that limit as the integral of v of t d t, from zero to capital T. The long S is a stretched letter S, for sum. And d t is the width of each thin rectangle, shrunk towards nothing.'],
          draw(r, S) {
            const v = (t) => 2 + 3 * t - 0.45 * t * t, A = K.axes(r, { x0: 90, y0: 430, w: 600, h: 330, xr: [0, 6], yr: [0, 8], xl: 't', yl: 'v', xt: [0, 6, 1], yt: [0, 8, 2] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, v, 0, 6, S.at(0, 1.4, 0.3));
            const N = S.t < S.B[2] ? 6 : Math.round(lerp(6, 48, S.at(2, 3))), a = S.at(1, 0.7);
            if (a > 0) for (let i = 0; i < N; i++) { const t0 = (6 * i) / N, h = v(t0); r.rect(A.X(t0), A.Y(h), A.X(6 / N) - A.X(0) - (N > 30 ? 0 : 1), A.Y(0) - A.Y(h), { c: C.blueA, fill: C.blue, fa: 0.4, w: N > 30 ? 0.6 : 1.2, a }); }
            if (S.t > S.B[2]) r.tex('n = ' + N, 780, 150, { size: 26, c: C.blue });
            K.tex(r, S, 3, T`s = \int_0^{T} v(t)\,dt`, 790, 290, { size: 38, c: C.yellow });
          } },
        { say: ['Let us do it with numbers. A stone falls from rest, so its velocity is 9.8 t metres per second. How far does it fall in three seconds?',
                'With three rectangles, each one second wide, using the velocity at the start of each second, the sum is 9.8 times zero plus one plus two: 29.4 metres. Too small, because the stone keeps speeding up during each second.',
                'With six rectangles, half a second wide, the sum is 36.75 metres. With thirty rectangles it is 42.6 metres.',
                'The area under the straight line is a triangle: one half times 3, times 29.4, which is 44.1 metres. The sums climb towards it from below. That is what an integral is: the number the sums close in on.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 90, y0: 430, w: 520, h: 330, xr: [0, 3.2], yr: [0, 32], xl: 't', yl: 'v', xt: [0, 3, 1], yt: [0, 30, 10] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, (t) => 9.8 * t, 0, 3.2, S.at(0, 1.2, 0.3));
            const N = S.t >= S.B[2] + 2.5 ? 30 : S.t >= S.B[2] ? 6 : 3, a = S.at(1, 0.6);
            if (a > 0) for (let i = 0; i < N; i++) { const t0 = (3 * i) / N, h = 9.8 * t0; if (h > 0) r.rect(A.X(t0), A.Y(h), A.X(3 / N) - A.X(0) - (N > 20 ? 0 : 1), A.Y(0) - A.Y(h), { c: C.blueA, fill: C.blue, fa: 0.4, w: N > 20 ? 0.6 : 1.2, a }); }
            const a3 = S.at(3, 0.7); if (a3 > 0) r.poly([A.pt(0, 0), A.pt(3, 0), A.pt(3, 29.4)], { c: C.yellow, w: 3, close: true, a: a3 });
            K.tex(r, S, 1, T`n = 3:\ \ 29.4\ \text{m}`, 760, 140, { size: 28, c: C.blue });
            K.tex(r, S, 2, T`n = 6:\ \ 36.75\ \text{m}`, 760, 200, { size: 28, c: C.blue });
            K.tex(r, S, 2, T`n = 30:\ \ 42.63\ \text{m}`, 760, 260, { size: 28, c: C.blue, dl: 2.5 });
            K.tex(r, S, 3, T`\tfrac12(3)(29.4) = 44.1\ \text{m}`, 760, 340, { size: 30, c: C.yellow });
          } }
      ]],
      ['The fundamental theorem', [
        { say: ['Adding up rectangles is slow. The fundamental theorem of calculus gives a shortcut, and it comes straight from the circle picture at the start.',
                'Define an area function: capital A of x is the area under the graph of f, from zero up to x. As x moves to the right, the area grows.',
                'Move x by a tiny d x. The area grows by one thin sliver, of height f of x and width d x. So d A equals f of x d x.',
                'Divide by d x: the derivative of the area function is the original function. The rate at which area accumulates is the height of the graph at the edge.',
                'So integrals are undone by derivatives. To find an area, you do not need to add rectangles at all. You need any function F whose derivative is f, and then the area from a to b is F of b minus F of a.'],
          draw(r, S) {
            const f = (x) => 1.4 + 0.6 * Math.sin(1.3 * x) + 0.18 * x, A = K.axes(r, { x0: 90, y0: 430, w: 600, h: 320, xr: [0, 6], yr: [0, 3.2], xl: 'x', yl: 'y' });
            A.draw(S.at(0, 0.8)); K.plot(r, A, f, 0, 6, S.at(0, 1.4, 0.3));
            const a1 = S.at(1, 0.7), X = 2.2 + (S.t > S.B[1] + 1 ? 1.4 * (1 - Math.cos(0.5 * (S.t - S.B[1] - 1))) : 0);
            if (a1 > 0) { const pts = [A.pt(0, 0)]; for (let i = 0; i <= 80; i++) { const x = (X * i) / 80; pts.push(A.pt(x, f(x))); } pts.push(A.pt(X, 0)); r.poly(pts, { c: C.blue, w: 0, stroke: false, fill: C.blue, fa: 0.35, a: a1 }); r.tex(T`A(x)`, A.X(X / 2), A.Y(0.6), { size: 26, a: a1 }); r.line(A.X(X), A.Y(0), A.X(X), A.Y(f(X)), { c: C.ink, w: 2, a: a1 }); }
            const a2 = S.at(2, 0.6); if (a2 > 0) { const dx = 0.22; r.rect(A.X(X), A.Y(f(X)), A.X(dx) - A.X(0), A.Y(0) - A.Y(f(X)), { c: C.yellow, w: 1.5, fill: C.yellow, fa: 0.6, a: a2 }); r.tex(T`f(x)\,dx`, A.X(X + 0.1), A.Y(f(X)) - 22, { size: 22, c: C.yellow, a: a2 }); }
            K.tex(r, S, 2, T`dA = f(x)\,dx`, 820, 150, { size: 30, c: C.yellow });
            K.tex(r, S, 3, T`\frac{dA}{dx} = f(x)`, 820, 230, { size: 34, c: C.green });
            K.tex(r, S, 4, T`\int_a^b f\,dx = F(b) - F(a)`, 790, 330, { size: 30, c: C.yellow });
            if (S.t > S.B[4]) K.hl(r, S, 4, 680, 305, 230, 52, { dl: 0.6 });
          } },
        { say: ['Watch how much work that saves. Find the area under y equals x squared, from x equals 1 to x equals 3.',
                'We need a function whose derivative is x squared. By the power rule run backwards, that is x cubed over three.',
                'Evaluate at the ends: twenty-seven over three, minus one over three, which is twenty-six thirds, about 8.67. No rectangles needed.',
                'Second example: the area under one arch of the sine curve, from zero to pi. The antiderivative of sin x is minus cos x. So the area is minus cos pi, plus cos zero: one plus one, exactly two. A curved shape, with an area that is a whole number.',
                'And the falling stone: the antiderivative of 9.8 t is 4.9 t squared. At three seconds that is 4.9 times nine, which is 44.1 metres. The same answer the triangle gave, and the one the rectangle sums were creeping towards.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 70, y0: 300, w: 300, h: 220, xr: [0, 3.3], yr: [0, 10], xl: 'x', yl: 'y', xt: [0, 3, 1] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, (x) => x * x, 0, 3.15, S.at(0, 1.2, 0.3));
            const a = S.at(0, 0.6, 1); if (a > 0) { const pts = [A.pt(1, 0)]; for (let i = 0; i <= 40; i++) { const x = 1 + (2 * i) / 40; pts.push(A.pt(x, x * x)); } pts.push(A.pt(3, 0)); r.poly(pts, { c: C.blue, stroke: false, fill: C.blue, fa: 0.4, a }); }
            K.calc(r, S, 1, 420, 110, [T`\int_1^3 x^{2}\,dx = \Big[\tfrac{x^{3}}{3}\Big]_1^3`, T`= 9 - \tfrac13 = \tfrac{26}{3} \approx 8.67`], { ks: [1, 2], dy: 76, size: 30 });
            const B2 = K.axes(r, { x0: 70, y0: 450, w: 300, h: 110, xr: [0, 3.3], yr: [0, 1.2], xl: 'x' }), b = S.at(3, 0.8);
            if (b > 0) { r.alpha(b, () => { B2.draw(1); const pts = [B2.pt(0, 0)]; for (let i = 0; i <= 60; i++) { const x = (Math.PI * i) / 60; pts.push(B2.pt(x, Math.sin(x))); } pts.push(B2.pt(Math.PI, 0)); r.poly(pts, { c: C.yellow, w: 2.5, fill: C.yellow, fa: 0.3, close: true }); }); }
            K.tex(r, S, 3, T`\int_0^{\pi}\sin x\,dx = \big[-\cos x\big]_0^{\pi} = 2`, 640, 290, { size: 30, c: C.yellow });
            K.tex(r, S, 4, T`\int_0^{3} 9.8\,t\,dt = \big[4.9\,t^{2}\big]_0^{3} = 44.1\ \text{m}`, 640, 390, { size: 28, c: C.green });
          } },
        { say: ['Why should area have anything to do with slope? The circle already told us. The area of a disc grows, ring by ring, at a rate equal to the circumference.',
                'The general statement is the same idea. A quantity that accumulates grows at a rate equal to whatever is being accumulated at the edge. Distance accumulates velocity; volume accumulates surface; charge on a capacitor accumulates current.',
                'So the derivative asks how fast something is changing, and the integral asks how much has built up. Each question undoes the other. That is the fundamental theorem of calculus, and it is the reason the two halves of the subject belong together.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\frac{d}{dr}\big(\pi r^{2}\big) = 2\pi r`, 480, 110, { size: 36, c: C.blue });
            K.list(r, S, [1, 1, 1], ['distance accumulates velocity: ds/dt = v', 'volume accumulates surface: dV/dr = 4πr²', 'charge accumulates current: dQ/dt = I'], 250, 210, { dy: 50, size: 22 });
            K.tex(r, S, 2, T`\text{derivative} \;\rightleftarrows\; \text{integral}`, 480, 420, { size: 36, c: C.yellow });
          } }
      ]],
      ['Mistakes, limits, and a summary', [
        { say: ['Three mistakes catch almost everyone. First, forgetting the chain rule\'s inner factor. The derivative of sin of three x is three cos three x, not just cos three x. A quick check: the faster the inside changes, the faster the whole thing changes.',
                'Second, forgetting the constant. Many functions have the same derivative: x cubed over three, and x cubed over three plus seven, both differentiate to x squared. So an indefinite integral always carries a plus C. In a definite integral, from a to b, the C cancels.',
                'Third, losing the units. A derivative has the units of the top divided by the units of the bottom: metres per second for d s by d t. An integral multiplies: metres per second, times seconds, is metres. If the units come out wrong, the calculus is wrong.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\frac{d}{dx}\sin 3x = 3\cos 3x \quad\text{not}\quad \cos 3x`, 480, 110, { size: 32 });
            K.tex(r, S, 1, T`\int x^{2}\,dx = \frac{x^{3}}{3} + C`, 480, 230, { size: 34, c: C.yellow });
            K.tex(r, S, 2, T`\Big[\frac{ds}{dt}\Big] = \frac{\text{m}}{\text{s}},\qquad \Big[\int v\,dt\Big] = \frac{\text{m}}{\text{s}}\cdot\text{s} = \text{m}`, 480, 360, { size: 30, c: C.green });
          } },
        { say: ['Finally, where does the machinery break? The derivative needs the graph to look like a straight line when you zoom in. The absolute value function, at zero, never does: it has a corner.',
                'From the left the slope is minus one, from the right it is plus one. The limit in the definition gives different answers from the two sides, so there is no derivative at zero.',
                'Integrals are more forgiving. A graph with a corner, or even a jump, still has a perfectly good area under it. That asymmetry matters in physics: an impulse, a sudden kick, has no well-behaved derivative, but its integral, the change in momentum, is perfectly finite.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 120, y0: 410, w: 380, h: 300, xr: [-2, 2], yr: [0, 2.2], xl: 'x', yl: 'y' });
            A.draw(S.at(0, 0.8)); K.plot(r, A, Math.abs, -2, 2, S.at(0, 1.2, 0.3));
            const a = S.at(1, 0.6); if (a > 0) { r.line(A.X(-1.8), A.Y(1.8), A.X(0), A.Y(0), { c: C.red, w: 4, a: a * 0.8 }); r.line(A.X(0), A.Y(0), A.X(1.8), A.Y(1.8), { c: C.blue, w: 4, a: a * 0.8 }); r.tex(T`-1`, A.X(-1), A.Y(1) - 30, { size: 24, c: C.red, a }); r.tex(T`+1`, A.X(1), A.Y(1) - 30, { size: 24, c: C.blue, a }); }
            const B = K.axes(r, { x0: 580, y0: 410, w: 320, h: 300, xr: [0, 4], yr: [0, 2.2], xl: 't', yl: 'F' }), b = S.at(2, 0.8);
            if (b > 0) { r.alpha(b, () => { B.draw(1); r.poly([B.pt(0, 0.1), B.pt(1.8, 0.1), B.pt(1.8, 2), B.pt(2.2, 2), B.pt(2.2, 0.1), B.pt(4, 0.1)], { c: C.yellow, w: 3 }); r.rect(B.X(1.8), B.Y(2), B.X(2.2) - B.X(1.8), B.Y(0.1) - B.Y(2), { c: C.yellow, fill: C.yellow, fa: 0.35, stroke: false }); r.tex(T`\int F\,dt = \Delta p`, B.X(3), B.Y(1.4), { size: 24, c: C.yellow }); }); }
          } },
        { say: ['Let us collect the ideas.',
                'The derivative is a rate of change at an instant: the limit of the slope of a secant, which becomes the slope of the tangent.',
                'Many derivatives can be seen: the square grows by two strips, the cube by three slabs, the sine by a little similar triangle.',
                'Products and compositions have rules: f g prime plus g f prime, and the outer derivative times the inner one.',
                'The integral is the limit of a sum of thin rectangles: the area under a graph, or the total that has built up.',
                'And the fundamental theorem joins them: the rate at which an area grows is the height of the graph, so the area from a to b is F of b minus F of a.',
                'For more, 3Blue1Brown\'s Essence of Calculus series develops every picture in this lecture further, and MIT\'s 18.01 lectures give the full course with problem sets. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['derivative: the limit of Δy/Δx, the slope of the tangent', 'see it: strips (x²), slabs (x³), a small triangle (sin)', 'product: (fg)′ = fg′ + gf′; chain: outer′ × inner′', 'integral: the limit of a sum of thin rectangles', 'fundamental theorem: ∫ from a to b of f = F(b) − F(a)'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Faraday's law of induction (A-level → Year 1). References: MIT 8.02 (Lewin, lectures 16–17); 3Blue1Brown divergence and curl. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  // a bar magnet centred at (x, y), horizontal, north on the right
  const magnet = (r, x, y, o = {}) => { const w = o.w || 120, h = o.h || 34, a = o.a; r.rect(x - w / 2, y - h / 2, w / 2, h, { c: C.blue, fill: C.blue, fa: 0.7, w: 1.5, a }); r.rect(x, y - h / 2, w / 2, h, { c: C.red, fill: C.red, fa: 0.7, w: 1.5, a }); r.txt('S', x - w / 4, y + 1, { size: 18, align: 'center', sans: true, bold: true, c: '#0c0e12', a }); r.txt('N', x + w / 4, y + 1, { size: 18, align: 'center', sans: true, bold: true, c: '#0c0e12', a }); };
  // a coil seen from the side: a set of loops between x0 and x1
  const coil = (r, x0, x1, y, h, n, o = {}) => { for (let i = 0; i < n; i++) { const x = x0 + ((x1 - x0) * (i + 0.5)) / n; const pts = []; for (let k = 0; k <= 40; k++) { const t = (TAU * k) / 40; pts.push([x + 7 * Math.sin(t), y + h * Math.cos(t)]); } r.poly(pts, { c: o.c || C.gold, w: 2.2, a: o.a }); } };
  // a meter with a needle; v in [-1, 1]
  const meter = (r, x, y, v, o = {}) => { r.circle(x, y, 46, { c: C.greyB, w: 2, fill: '#141821', fa: 1, a: o.a }); for (let k = -4; k <= 4; k++) { const t = -Math.PI / 2 + k * 0.28; r.line(x + 36 * Math.cos(t), y + 36 * Math.sin(t), x + 42 * Math.cos(t), y + 42 * Math.sin(t), { c: C.greyB, w: 1.4, a: o.a }); } const t = -Math.PI / 2 + cl(v, -1, 1) * 1.12; r.line(x, y, x + 38 * Math.cos(t), y + 38 * Math.sin(t), { c: C.yellow, w: 3, a: o.a }); r.dot(x, y, { r: 4, c: C.greyB, a: o.a }); if (o.label) r.txt(o.label, x, y + 62, { size: 15, sans: true, c: C.dim, align: 'center', a: o.a }); };

  L.def({
    id: 'faraday', order: 5, title: 'Faraday\'s law of induction', sub: 'How a changing magnetic field makes a voltage — the idea behind every generator, transformer and wireless charger',
    level: 'A-level → Year 1', topics: ['al-induction', 'y1-faraday', 'gcse-induction'], thumb: [9, 22],
    refs: [
      ['MIT 8.02 (Walter Lewin)', 'Lecture 16: Electromagnetic induction, Faraday\'s law, Lenz\'s law; Lecture 17: motional EMF, dynamos, eddy currents', 'https://web.mit.edu/smcs/8.02/'],
      ['MIT OCW 8.02 (Spring 2019)', 'Physics II: Electricity and Magnetism — course materials', 'https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/'],
      ['3Blue1Brown', 'Divergence and curl: the language of Maxwell\'s equations', 'https://www.3blue1brown.com/lessons/divergence-and-curl']
    ],
    chapters: [
      ['Faraday\'s discovery', [
        { say: ['Nearly all the electricity you have ever used was made by one effect, discovered by Michael Faraday in 1831: a changing magnetic field produces a voltage. This lecture is about that effect, and about the strange kind of electric field behind it.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Faraday\'s law', 'Electromagnetic induction', { y: 200 });
            const a = S.in(1.6, 1.2); if (a > 0) { const x = 420 + 70 * Math.sin(1.6 * S.w); coil(r, 470, 600, 400, 34, 9, { a }); magnet(r, x - 40, 400, { a, w: 110, h: 28 }); }
          } },
        { say: ['Here is Faraday\'s experiment. A coil of wire is connected to a sensitive current meter. Push a magnet into the coil, and the needle kicks.',
                'Hold the magnet still inside the coil, and the needle returns to zero. A magnetic field, however strong, makes no current by just being there.',
                'Pull the magnet out, and the needle kicks the other way. Move it faster, and the kick is bigger. Move the coil instead of the magnet, and the same thing happens. What matters is change.',
                'Faraday\'s insight was that the current is driven by the rate at which the magnetic field through the coil changes. To make that precise, we need to measure how much field passes through the coil.'],
          draw(r, S) {
            const phase = S.t < S.B[1] ? 'in' : S.t < S.B[2] ? 'hold' : 'out';
            const xin = 250 + 210 * sm(cl((S.t - 0.6) / 2.2)), xout = 460 - 210 * sm(cl((S.t - S.B[2] - 0.4) / 1.4));
            const x = phase === 'in' ? xin : phase === 'hold' ? 460 : xout;
            const v = phase === 'in' ? Math.sin(Math.PI * cl((S.t - 0.6) / 2.2)) * 0.75 : phase === 'out' ? -Math.sin(Math.PI * cl((S.t - S.B[2] - 0.4) / 1.4)) * 1 : 0;
            r.alpha(S.at(0, 0.8), () => {
              coil(r, 480, 640, 220, 60, 11);
              r.poly([[485, 282], [485, 380], [720, 380]], { c: C.gold, w: 2 }); r.poly([[635, 282], [635, 340], [720, 340]], { c: C.gold, w: 2 });
              meter(r, 770, 360, v, { label: 'current' });
              magnet(r, x - 60, 220, {});
            });
            K.txt(r, S, 3, 'what matters is the rate of change', 480, 455, { size: 22, align: 'center', c: C.yellow });
          } }
      ]],
      ['Magnetic flux', [
        { say: ['Magnetic flux is defined exactly like electric flux in the Gauss lecture. For a uniform field B through a flat loop of area A, the flux is B A cos theta, where theta is the angle between the field and the normal to the loop.',
                'Its unit is the weber: one tesla times one square metre. Face-on, the loop catches the most flux. Edge-on, it catches none.',
                'A coil of N turns links the same flux N times over, so the flux linkage is N phi. Every turn adds its own voltage, in series.',
                'There are exactly three ways to change the flux through a loop: change the field B, change the area A, or change the angle theta. Each one is the principle of a different machine: the transformer, the sliding rod, and the generator.'],
          draw(r, S) {
            const th = S.t > S.B[1] ? 1.2 * (0.5 - 0.5 * Math.cos(0.9 * (S.t - S.B[1]))) : 0, cx = 300, cy = 250;
            r.alpha(S.at(0, 0.8), () => {
              for (let i = 0; i < 9; i++) { const y = 80 + i * 42; r.arrow(60, y, 560, y, { c: C.blueA, w: 1.4, head: 8, a: 0.5 }); }
              const w = 110 * Math.abs(Math.sin(th)) + 8, hgt = 110;   // side view: edge-on when the normal is along B
              const loop = []; for (let k = 0; k <= 64; k++) { const t = (TAU * k) / 64; loop.push([cx + w * Math.cos(t) * 0.5 + 0, cy + hgt * Math.sin(t)]); }
              r.poly(loop, { c: C.yellow, w: 4, close: true, fill: C.yellow, fa: 0.12 });
              if (Math.cos(th) > 0.08) { r.arrow(cx, cy, cx + 90 * Math.cos(th), cy, { c: C.green, w: 3, head: 11 }); r.tex(T`\hat n`, cx + 90 * Math.cos(th) + 18, cy - 16, { size: 22, c: C.green }); }
            });
            K.tex(r, S, 0, T`\Phi = BA\cos\theta`, 760, 110, { size: 34, c: C.yellow });
            K.tex(r, S, 1, T`[\Phi] = \text{T m}^{2} = \text{Wb}`, 760, 180, { size: 28 });
            K.tex(r, S, 2, T`\text{flux linkage} = N\Phi`, 760, 250, { size: 28, c: C.blue });
            K.list(r, S, [3, 3, 3], ['change B: transformer', 'change A: sliding rod', 'change θ: generator'], 650, 330, { dy: 40, size: 20 });
          } }
      ]],
      ['Faraday\'s law and Lenz\'s law', [
        { say: ['Now the law itself. The electromotive force induced in a coil equals minus the rate of change of its flux linkage: epsilon equals minus N d phi by d t.',
                'Electromotive force, or EMF, is the voltage that would push a current round the loop. If the coil has resistance R, the current is the EMF over R.',
                'Check the units. Flux is tesla square metres. Divided by seconds, that should be volts, and indeed a tesla is a volt second per square metre. A flux changing by one weber per second makes one volt per turn.'],
          draw(r, S) {
            const a = S.at(0, 0.7); if (a > 0) { r.rr(270, 60, 420, 100, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 0, T`\varepsilon = -N\,\frac{d\Phi}{dt}`, 480, 110, { size: 44, c: C.yellow, dl: 0.2 }); }
            K.tex(r, S, 1, T`I = \frac{\varepsilon}{R}`, 480, 230, { size: 34 });
            K.tex(r, S, 2, T`\frac{\text{Wb}}{\text{s}} = \frac{\text{T m}^{2}}{\text{s}} = \text{V}`, 480, 340, { size: 32, c: C.green });
          } },
        { say: ['The minus sign is Lenz\'s law, and it carries real physics. The induced current always flows in the direction that opposes the change that caused it.',
                'Push the north pole of a magnet towards a loop. The flux through the loop increases, so the induced current flows so that the loop itself becomes a north pole facing the magnet, pushing back against it.',
                ['Pause and think. Why must it be this way round? What would happen if the induced current helped the change instead?', 4],
                'Then the loop would pull the magnet in, which would increase the flux faster, which would increase the current, which would pull harder. The magnet would accelerate by itself, from nothing, and you would have a perpetual motion machine. Lenz\'s law is energy conservation in disguise: you have to do work to push the magnet in, and that work becomes the electrical energy.'],
          draw(r, S) {
            const x = 210 + 120 * sm(cl((S.since(1) - 0.2) / 3)), push = S.t > S.B[1];
            r.alpha(S.at(0, 0.8), () => {
              const pts = []; for (let k = 0; k <= 64; k++) { const t = (TAU * k) / 64; pts.push([560 + 18 * Math.cos(t), 250 + 90 * Math.sin(t)]); } r.poly(pts, { c: C.gold, w: 5, close: true });
              magnet(r, x, 250, {});
            });
            const a1 = S.at(1, 0.7); if (a1 > 0 && push) {
              r.arcArrow(560, 250, 64, -2.2, 2.2, { c: C.green, w: 3, head: 11, a: a1 }); r.txt('induced current', 560, 120, { size: 16, sans: true, c: C.green, align: 'center', a: a1 });
              r.rect(600, 233, 34, 34, { c: C.red, fill: C.red, fa: 0.7, a: a1 * 0.9 }); r.txt('N', 617, 251, { size: 16, sans: true, bold: true, c: '#0c0e12', align: 'center', a: a1 });
              r.arrow(x + 70, 300, x + 10, 300, { c: C.red, w: 3, head: 11, a: a1 }); r.txt('repelled', x + 40, 322, { size: 15, sans: true, c: C.red, align: 'center', a: a1 });
            }
            K.txt(r, S, 3, 'work done against the push = electrical energy out', 480, 440, { size: 21, align: 'center', c: C.yellow });
          } },
        { say: ['A beautiful demonstration of Lenz\'s law: drop a strong magnet down a copper pipe. Copper is not magnetic, yet the magnet falls in slow motion.',
                'As the magnet falls, the flux through each ring of copper below it increases, and through each ring above it decreases. Currents swirl in the pipe walls, eddy currents, and their fields push up on the magnet from below and pull up on it from above.',
                'The magnet quickly reaches a terminal speed, where the magnetic drag balances its weight. All of its lost potential energy becomes heat in the copper. This is exactly how eddy-current brakes on trains and roller coasters work: no contact, no wear.'],
          draw(r, S) {
            const cx = 300, y = 90 + ((S.w * 26) % 300);
            r.alpha(S.at(0, 0.8), () => {
              r.rect(cx - 50, 60, 100, 380, { c: C.gold, w: 3, fill: C.gold, fa: 0.08 });
              r.rect(cx - 22, y - 30, 44, 30, { c: C.red, fill: C.red, fa: 0.75, w: 1.5 }); r.rect(cx - 22, y, 44, 30, { c: C.blue, fill: C.blue, fa: 0.75, w: 1.5 });
            });
            const a = S.at(1, 0.7); if (a > 0) { [[-55, 1], [55, -1]].forEach(([dy, s]) => { const yy = y + dy; r.poly([[cx - 46, yy - 6], [cx + 46, yy + 6]], { c: s > 0 ? C.green : C.yellow, w: 3, a }); r.arrow(cx + 50, yy, cx + 50 + 26 * s, yy, { c: s > 0 ? C.green : C.yellow, w: 2, head: 7, a: a * 0.8 }); }); r.arrow(cx + 80, y + 10, cx + 80, y - 40, { c: C.red, w: 3, head: 10, a }); r.txt('magnetic drag', cx + 92, y - 20, { size: 15, sans: true, c: C.red, a }); }
            K.tex(r, S, 2, T`mg = F_{\text{drag}}(v)\ \Rightarrow\ v_{\text{terminal}}`, 680, 250, { size: 28, c: C.yellow });
          } }
      ]],
      ['Moving wires: motional EMF', [
        { say: ['Second way to change the flux: change the area. A metal rod of length L slides along two rails at speed v, through a uniform field B pointing into the screen. The rails and the rod make a loop whose area grows.',
                'In a time d t the rod moves v d t, and the area grows by L v d t. The flux grows by B L v d t, so the EMF is B L v.',
                'There is a second way to see the same thing, with no flux at all. The free electrons in the rod move with it, at speed v, through the field. Each feels a magnetic force q v B along the rod. That force, per unit charge, over the length L, is again B L v. Two pictures, one answer.',
                'A worked example: B equals 0.50 tesla, L equals 0.20 metres, v equals 3.0 metres per second. The EMF is 0.50 times 0.20 times 3.0: 0.30 volts. With a total resistance of 2.0 ohms, the current is 0.15 amps.',
                'That current, flowing in the rod, feels a force B I L: 0.50 times 0.15 times 0.20, which is 0.015 newtons, opposing the motion, as Lenz insists. To keep the rod moving you must push with 0.015 newtons, delivering 0.015 times 3.0: 0.045 watts. And the heat in the resistor is I squared R, 0.15 squared times 2: also 0.045 watts. Mechanical power in, electrical power out.'],
          draw(r, S) {
            const x0 = 120, x1 = 640, yT = 120, yB = 330, xr = 260 + ((S.w * 40) % 300);
            r.alpha(S.at(0, 0.8), () => {
              for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) { const X = x0 + 30 + i * 70, Y = yT + 20 + j * 45; r.txt('×', X, Y, { size: 16, align: 'center', c: C.blueA, a: 0.6 }); }
              r.line(x0, yT, x1, yT, { c: C.greyB, w: 3 }); r.line(x0, yB, x1, yB, { c: C.greyB, w: 3 }); r.line(x0, yT, x0, yB, { c: C.greyB, w: 3 });
              r.rect(x0 - 8, 200, 16, 50, { c: C.yellow, w: 2, fill: '#0c0e12', fa: 1 }); r.txt('R', x0 - 26, 225, { size: 18, c: C.yellow });
              r.line(xr, yT - 10, xr, yB + 10, { c: C.gold, w: 6 }); r.arrow(xr + 10, 225, xr + 70, 225, { c: C.green, w: 3, head: 11 }); r.tex('v', xr + 84, 225, { size: 22, c: C.green });
              r.poly([[x0, yT], [xr, yT], [xr, yB], [x0, yB]], { c: C.yellow, w: 0, stroke: false, fill: C.yellow, fa: 0.08 });
              r.brace(xr + 22, yT, xr + 22, yB, { side: -1, c: C.greyB, tex: 'L', size: 20, gap: 16 });
            });
            K.tex(r, S, 1, T`\varepsilon = \frac{d\Phi}{dt} = BLv`, 800, 100, { size: 30, c: C.yellow });
            K.tex(r, S, 2, T`F = qvB\ \Rightarrow\ \varepsilon = BLv`, 800, 160, { size: 26, c: C.blue });
            K.tex(r, S, 3, T`\varepsilon = (0.50)(0.20)(3.0) = 0.30\ \text{V},\ I = 0.15\ \text{A}`, 480, 400, { size: 26, out: 4 });
            K.tex(r, S, 4, T`F = BIL = 0.015\ \text{N};\ \ Fv = 0.045\ \text{W} = I^{2}R`, 480, 400, { size: 26, c: C.green });
          } }
      ]],
      ['Reading the graphs: an exam favourite', [
        { say: ['A magnet is dropped through a coil, and the EMF is recorded against time. Sketch the trace. This question appears on exam papers every year, and the trick is to sketch the flux first.',
                'As the magnet approaches, the flux through the coil rises; as it leaves, the flux falls back to zero. The flux makes a single hump.',
                'The EMF is minus the gradient of that hump. On the way in the gradient is positive, so the EMF is negative; on the way out it is positive. Two pulses, of opposite sign.',
                ['The magnet is falling faster as it leaves, so the second pulse is taller and narrower. But the area under each pulse is the same: it equals N times the total change in flux, which is the same going in as coming out. Taller and thinner, with equal areas: that is the mark scheme.', 2]],
          draw(r, S) {
            const A = K.axes(r, { x0: 90, y0: 200, w: 760, h: 130, xr: [0, 2], yr: [-0.1, 1.15], xl: 't', yl: 'Φ' }), B2 = K.axes(r, { x0: 90, y0: 380, w: 760, h: 140, xr: [0, 2], yr: [-1.3, 1.3], xl: 't', yl: 'ε' });
            const t0 = 0.9, s1 = 0.17, s2 = 0.11, phi = (t) => t < t0 ? Math.exp(-((t - t0) ** 2) / (2 * s1 * s1)) : Math.exp(-((t - t0) ** 2) / (2 * s2 * s2));
            const dphi = (t) => { const h = 1e-3; return (phi(t + h) - phi(t - h)) / (2 * h); };
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.alpha(a1, () => A.draw(1)); K.plot(r, A, phi, 0, 2, S.at(1, 1.4), { c: C.blue, n: 400 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) { r.alpha(a2, () => B2.draw(1)); K.plot(r, B2, (t) => -dphi(t) / 6.5, 0, 2, S.at(2, 1.6), { c: C.yellow, n: 500 }); }
            const a3 = S.at(3, 0.7); if (a3 > 0) { const pts1 = [B2.pt(0.4, 0)], pts2 = [B2.pt(t0, 0)]; for (let i = 0; i <= 50; i++) { const t = 0.4 + (t0 - 0.4) * i / 50; pts1.push(B2.pt(t, -dphi(t) / 6.5)); const u = t0 + 0.6 * i / 50; pts2.push(B2.pt(u, -dphi(u) / 6.5)); } pts1.push(B2.pt(t0, 0)); pts2.push(B2.pt(t0 + 0.6, 0)); r.poly(pts1, { stroke: false, fill: C.blue, fa: 0.35, a: a3 }); r.poly(pts2, { stroke: false, fill: C.red, fa: 0.35, a: a3 }); r.txt('equal areas = NΔΦ', 700, 300, { size: 18, sans: true, c: C.green, a: a3 }); }
          } },
        { say: ['One more worked example, joining induction to mechanics. A square loop of wire, 10 centimetres on each side, mass 20 grams, resistance 0.10 ohms, falls out of the bottom of a region where B is 0.80 tesla. Only its top edge is still in the field.',
                'As it falls at speed v, the flux through it shrinks, and the EMF is B L v. The current is B L v over R, and the force on the top edge is B I L, which is B squared L squared v over R, pointing up.',
                'The loop speeds up until that force balances its weight. Setting m g equal to B squared L squared v over R, the terminal speed is m g R over B squared L squared.',
                ['Numbers: 0.020 times 9.81 times 0.10, over 0.80 squared times 0.10 squared. That is 0.0196 over 0.0064: about 3.1 metres per second. A stronger field or a lower resistance makes it fall more slowly, because both make the braking current larger.', 1.5]],
          draw(r, S) {
            const y = 120 + 60 * (1 - Math.exp(-0.8 * Math.max(0, S.t - 1))) + 10 * Math.sin(0.3 * S.w) * 0;
            r.alpha(S.at(0, 0.8), () => {
              r.rect(80, 60, 360, 150, { c: C.blue, w: 1.5, fill: C.blue, fa: 0.08, dash: [6, 5] });
              for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) r.txt('×', 110 + i * 60, 90 + j * 45, { size: 16, align: 'center', c: C.blueA, a: 0.6 });
              r.rect(190, y + 60, 140, 140, { c: C.gold, w: 4 });
              r.arrow(260, y + 60, 260, y + 10, { c: C.red, w: 3, head: 10 }); r.arrow(260, y + 140, 260, y + 220, { c: C.green, w: 3, head: 10 });
              r.tex(T`B^{2}L^{2}v/R`, 340, y + 36, { size: 20, c: C.red }); r.tex('mg', 300, y + 210, { size: 20, c: C.green });
            });
            K.tex(r, S, 1, T`\varepsilon = BLv,\ \ F = \frac{B^{2}L^{2}v}{R}`, 700, 130, { size: 28 });
            K.tex(r, S, 2, T`v_t = \frac{mgR}{B^{2}L^{2}}`, 700, 230, { size: 34, c: C.yellow });
            K.tex(r, S, 3, T`= \frac{(0.020)(9.81)(0.10)}{(0.80)^{2}(0.10)^{2}} \approx 3.1\ \text{m s}^{-1}`, 680, 330, { size: 26, c: C.green });
          } }
      ]],
      ['The generator', [
        { say: ['Third way: change the angle. A coil of N turns and area A rotates at angular speed omega in a uniform field B. The angle between the field and the coil\'s normal is omega t, so the flux linkage is N B A cos omega t.',
                'Differentiate, with the minus sign: the EMF is N B A omega sin omega t. A rotating coil makes alternating voltage, a sine wave, automatically.',
                'The peak EMF is N B A omega. It is largest when the coil is edge-on to the field, where the flux is zero but changing fastest, and zero when the coil faces the field squarely, where the flux is largest but momentarily not changing. Students often get this backwards; the graph settles it.',
                'A worked example: 200 turns, an area of 0.010 square metres, a field of 0.15 tesla, turning at 50 revolutions per second. Omega is two pi times 50, which is 314 per second. The peak EMF is 200 times 0.15 times 0.010 times 314: 94 volts. The root mean square value, peak over root two, is 67 volts.'],
          draw(r, S) {
            const om = 1.4, th = om * S.w, cx = 220, cy = 240, half = 110 * Math.abs(Math.cos(th)), hgt = 120;
            r.alpha(S.at(0, 0.8), () => {
              for (let i = 0; i < 7; i++) { const y = 110 + i * 44; r.arrow(40, y, 400, y, { c: C.blueA, w: 1.4, head: 8, a: 0.45 }); }
              r.rect(cx - half, cy - hgt, 2 * half + 0.01, 2 * hgt, { c: C.gold, w: 4, fill: C.gold, fa: 0.1 });
              r.line(cx, cy - hgt - 30, cx, cy + hgt + 30, { c: C.greyB, w: 2, dash: [4, 4] });
            });
            const A = K.axes(r, { x0: 460, y0: 290, w: 440, h: 200, xr: [0, 3 * TAU], yr: [-1.2, 1.2], xl: 'ωt' }), a = S.at(1, 0.7);
            if (a > 0) {
              r.alpha(a, () => A.draw(1));
              K.plot(r, A, (x) => Math.cos(x), 0, 3 * TAU, a, { c: C.blue, w: 2, dash: [6, 5] });
              K.plot(r, A, (x) => Math.sin(x), 0, 3 * TAU, a, { c: C.yellow, w: 3 });
              const xx = th % (3 * TAU); r.dot(...A.pt(xx, Math.sin(xx)), { r: 6, c: C.yellow, a }); r.dot(...A.pt(xx, Math.cos(xx)), { r: 5, c: C.blue, a });
              r.txt('flux', 880, 120, { size: 15, sans: true, c: C.blue, align: 'right', a }); r.txt('EMF', 880, 145, { size: 15, sans: true, c: C.yellow, align: 'right', a });
            }
            K.tex(r, S, 0, T`N\Phi = NBA\cos\omega t`, 680, 360, { size: 26, out: 1 });
            K.tex(r, S, 1, T`\varepsilon = NBA\omega\,\sin\omega t`, 680, 360, { size: 30, c: C.yellow, out: 3 });
            K.tex(r, S, 3, T`\varepsilon_0 = (200)(0.15)(0.010)(314) = 94\ \text{V},\ \ \varepsilon_{\text{rms}} = 67\ \text{V}`, 600, 420, { size: 24, c: C.green });
          } }
        ,{ say: [['Pause and think. You turn the generator twice as fast. What happens to the peak voltage, and to the frequency?', 4],
                'Both double. The frequency doubles because the coil goes round twice as often, and the peak EMF, N B A omega, doubles because omega appears in it: the flux changes twice as fast. That is why a bicycle dynamo glows brighter as you speed up, and why power stations must hold their turbines at exactly the right speed to keep the mains at 50 hertz.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Turn it twice as fast: peak voltage? frequency?'], { y: 80 });
            const A = K.axes(r, { x0: 120, y0: 360, w: 720, h: 170, xr: [0, 2 * TAU], yr: [-2.3, 2.3], xl: 't' }), a = S.at(1, 0.8);
            if (a > 0) { r.alpha(a, () => A.draw(1)); K.plot(r, A, Math.sin, 0, 2 * TAU, a, { c: C.blue, w: 2.5 }); K.plot(r, A, (x) => 2 * Math.sin(2 * x), 0, 2 * TAU, S.at(1, 1.4, 0.6), { c: C.yellow, w: 3 }); r.txt('ω', 860, 300, { size: 18, sans: true, c: C.blue, a }); r.txt('2ω: twice the peak, twice the frequency', 860, 240, { size: 17, sans: true, c: C.yellow, align: 'right', a }); }
          } }
      ]],
      ['Transformers and power lines', [
        { say: ['First way, last: change the field itself. Wind two coils on one iron core. An alternating current in the primary coil makes an alternating flux in the core, and the same flux threads the secondary coil.',
                'Each turn of either coil has the same EMF, d phi by d t. So the voltages are in the ratio of the turns: V s over V p equals N s over N p. More turns on the secondary steps the voltage up; fewer steps it down.',
                'An ideal transformer wastes no energy, so if the voltage goes up by some factor, the current goes down by the same factor. Power in equals power out.',
                'That is why power stations send electricity at very high voltage. The loss in a cable of resistance R is I squared R. Send one megawatt through a 5 ohm line at 10 kilovolts and the current is 100 amps: the line wastes 50 kilowatts, five percent. At 400 kilovolts the current is only 2.5 amps, and the loss is just 31 watts.',
                'And it only works with alternating current. A steady current gives a steady flux, and a steady flux induces nothing. Faraday\'s law is about change.'],
          draw(r, S) {
            r.alpha(S.at(0, 0.8), () => {
              r.rr(250, 100, 460, 280, 14, { c: C.greyB, w: 26, a: 0.55 });
              coil(r, 220, 280, 240, 70, 6, { c: C.red }); coil(r, 680, 740, 240, 70, 10, { c: C.green });
              const ph = Math.sin(2.4 * S.w); for (let k = 0; k < 4; k++) { const off = ((S.w * 60 + k * 230) % 920); const p = off < 460 ? [250 + off, 100] : [710 - (off - 460), 380]; r.dot(p[0], p[1], { r: 5, c: ph > 0 ? C.yellow : C.blue }); }
              r.txt('primary', 250, 420, { size: 16, sans: true, c: C.red, align: 'center' }); r.txt('secondary', 710, 420, { size: 16, sans: true, c: C.green, align: 'center' });
            });
            K.tex(r, S, 1, T`\frac{V_s}{V_p} = \frac{N_s}{N_p}`, 480, 200, { size: 34, c: C.yellow, out: 3 });
            K.tex(r, S, 2, T`V_pI_p = V_sI_s`, 480, 290, { size: 28, c: C.blue, out: 3 });
            K.calc(r, S, 3, 300, 190, [T`10\ \text{kV}:\ I = 100\ \text{A},\ \ I^{2}R = 50\ \text{kW}`, T`400\ \text{kV}:\ I = 2.5\ \text{A},\ \ I^{2}R = 31\ \text{W}`], { ks: [3, 3], dy: 70, size: 26, dl: 0, out: 4 });
            K.txt(r, S, 4, 'steady current ⇒ steady flux ⇒ no EMF', 480, 240, { size: 22, align: 'center', c: C.yellow });
          } }
        ,{ say: ['A worked example. An old phone charger steps 230 volts down to 5. The turns ratio must be 230 over 5: 46 to one. If the primary has 2,300 turns, the secondary needs 50.',
                'If the phone draws 2 amps at 5 volts, that is 10 watts. An ideal transformer takes the same 10 watts from the mains, so the primary current is 10 over 230: only 43 milliamps.',
                'Real transformers are good but not perfect, typically 90 to 98 percent efficient. Some energy heats the copper windings; some is lost each cycle re-magnetising the iron; and some goes into eddy currents in the core. That is why transformer cores are made of thin insulated sheets, laminations, stacked together: the insulation breaks up the eddy-current loops.'],
          draw(r, S) {
            K.calc(r, S, 0, 100, 110, [T`\frac{N_p}{N_s} = \frac{230}{5} = 46:\ \ N_p = 2300,\ N_s = 50`, T`P = 5\times2 = 10\ \text{W}\ \Rightarrow\ I_p = \frac{10}{230} = 43\ \text{mA}`], { ks: [0, 1], dy: 90, size: 28 });
            const a = S.at(2, 0.8); if (a > 0) r.alpha(a, () => { for (let k = 0; k < 12; k++) r.rect(560 + k * 14, 320, 10, 120, { c: C.greyB, w: 1.2, fill: C.greyB, fa: 0.35 }); r.txt('laminated core: eddy loops broken', 640, 300, { size: 16, sans: true, c: C.green, align: 'center' }); });
            K.tex(r, S, 2, T`\eta \approx 90\text{–}98\%`, 300, 380, { size: 30, c: C.yellow });
          } }
      ]],
      ['Motors, hobs and chargers', [
        { say: ['Every motor is also a generator. As its coil turns in the magnet\'s field, it induces an EMF that opposes the supply: a back EMF, proportional to the speed.',
                'So the current is the supply voltage minus the back EMF, divided by the coil\'s resistance. A 12 volt motor with a resistance of half an ohm draws 24 amps when it is stalled, with no back EMF. Running fast, with a back EMF of 10 volts, it draws only 4 amps.',
                'That is why the lights dim when a big motor starts, and why a jammed motor burns out: without the back EMF to limit it, the current is enormous.',
                'Induction is also in your kitchen and your pocket. An induction hob drives an alternating current, tens of kilohertz, through a flat coil. The changing field induces eddy currents in the base of a steel pan, and the pan heats itself, while the glass stays cool. A wireless phone charger is a transformer with an air gap: one coil in the pad, one in the phone.'],
          draw(r, S) {
            K.tex(r, S, 0, T`I = \frac{V - \varepsilon_{\text{back}}}{R}`, 300, 100, { size: 34, c: C.yellow });
            K.calc(r, S, 1, 90, 200, [T`\text{stalled}:\ I = \frac{12 - 0}{0.5} = 24\ \text{A}`, T`\text{running}:\ I = \frac{12 - 10}{0.5} = 4\ \text{A}`], { ks: [1, 1], dy: 84, size: 28, dl: 0 });
            const a = S.at(3, 0.8); if (a > 0) { r.alpha(a, () => { const cx = 720, cy = 330; for (let k = 1; k <= 5; k++) r.circle(cx, cy + 40, 18 * k, { c: C.gold, w: 2, a: 0.7 }); r.rr(cx - 130, cy - 40, 260, 34, 6, { c: C.greyB, w: 3, fill: C.greyB, fa: 0.2 }); r.glow(cx, cy - 22, 120, C.red, 0.35 + 0.15 * Math.sin(3 * S.w)); r.txt('steel pan: eddy currents heat it', cx, cy - 70, { size: 16, sans: true, c: C.red, align: 'center' }); }); }
          } }
      ]],
      ['Self-inductance', [
        { say: ['A coil also induces an EMF in itself. Change the current in a coil, and its own flux changes, so it pushes back. The back EMF is minus L d I by d t, where L is the self-inductance, measured in henries.',
                'For a long solenoid of N turns, cross-section A and length l, the field inside is mu nought N I over l, and the flux linkage is N times B A. So L equals mu nought N squared A over l. Doubling the turns quadruples the inductance.',
                'Inductance makes currents sluggish: they cannot change instantly. Switch off an inductive circuit suddenly, and d I by d t is enormous, so the coil produces a huge voltage, enough to make a spark jump across the switch. Car ignition coils use exactly this to fire spark plugs.',
                'The energy stored in an inductor is one half L I squared, held in its magnetic field. It plays the part of kinetic energy in the circuit, just as the capacitor\'s energy played the part of the spring\'s energy in the oscillations lecture.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\varepsilon = -L\,\frac{dI}{dt}`, 480, 80, { size: 36, c: C.yellow });
            r.alpha(S.at(1, 0.8), () => { coil(r, 160, 460, 230, 48, 16); for (let i = 0; i < 5; i++) r.arrow(170, 205 + i * 12, 450, 205 + i * 12, { c: C.blueA, w: 1.3, head: 7, a: 0.6 }); });
            K.tex(r, S, 1, T`L = \frac{\mu_0 N^{2}A}{l}`, 700, 230, { size: 34, c: C.blue });
            const a2 = S.at(2, 0.7); if (a2 > 0) { const fl = Math.random() > 0.5 ? 1 : 0.4; r.line(560, 360, 600, 340, { c: C.greyB, w: 3, a: a2 }); r.line(620, 360, 660, 360, { c: C.greyB, w: 3, a: a2 }); r.flash(610, 350, ((S.w * 1.7) % 1), { c: C.yellow, n: 9, r: 6, R: 22 }); r.txt('spark', 610, 395, { size: 16, sans: true, c: C.yellow, align: 'center', a: a2 * fl }); }
            K.tex(r, S, 3, T`U = \tfrac12 L I^{2}`, 300, 400, { size: 34, c: C.green });
          } }
      ]],
      ['The deep version: a curling electric field', [
        { say: ['Now the question Faraday\'s law forces on us. When a magnet moves near a stationary loop, what pushes the electrons round? The magnetic force q v cross B needs the charges to be moving, and these electrons start at rest.',
                'The answer is that a changing magnetic field creates an electric field, and this electric field curls round in closed loops. It does not start or end on charges at all. Faraday\'s law, in its deepest form, says the circulation of E round any loop equals minus the rate of change of the magnetic flux through it.',
                'Shrink the loop to a point and you get the local form: the curl of E equals minus d B by d t. Compare Gauss\'s law, which was about divergence. Static charges make fields that spread out from sources; changing magnetic fields make fields that swirl.',
                'This electric field is not conservative. Carry a charge once round the loop and it gains energy, so there is no single voltage at each point. Walter Lewin famously showed two voltmeters, connected to the same two points of such a circuit, giving different readings. Not a mistake: a correct consequence of a field that curls.'],
          draw(r, S) {
            const cx = 300, cy = 250, sw = (x, y) => { const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy + 900, f = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 110); return [-dy / Math.sqrt(d2) * 70 * f, dx / Math.sqrt(d2) * 70 * f]; };
            r.alpha(S.at(0, 0.8), () => { for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) r.txt('⊙', cx - 60 + i * 30, cy - 60 + j * 30, { size: 16, align: 'center', c: C.blueA, a: 0.5 + 0.4 * Math.sin(1.4 * S.w) }); r.txt('B increasing', cx, cy + 100, { size: 15, sans: true, c: C.blueA, align: 'center' }); });
            const a1 = S.at(1, 0.7); if (a1 > 0) r.alpha(a1, () => r.flow('curlE', sw, { x0: 80, x1: 520, y0: 40, y1: 460, n: 170, life: 2.8, max: 70, w: 1.8, c: C.yellow }));
            K.tex(r, S, 1, T`\oint \vec{E}\cdot d\vec{l} = -\frac{d\Phi_B}{dt}`, 740, 120, { size: 30, c: C.yellow });
            K.tex(r, S, 2, T`\nabla\times\vec{E} = -\frac{\partial\vec{B}}{\partial t}`, 740, 220, { size: 32, c: C.green });
            K.txt(r, S, 2, 'Gauss: ∇·E = ρ/ε₀ (sources)', 740, 290, { size: 18, align: 'center', c: C.greyB, dl: 1.5 });
            K.txt(r, S, 3, 'no single voltage at each point: the field is not conservative', 740, 380, { size: 17, align: 'center', c: C.red });
          } }
        ,{ say: ['Faraday\'s law is also half of the explanation of light. A changing magnetic field makes a curling electric field. James Clerk Maxwell added the mirror image: a changing electric field makes a curling magnetic field.',
                'Put the two together and each field keeps regenerating the other. The pair can travel through empty space on its own, as a wave, with no charges or currents anywhere near it.',
                'Maxwell calculated its speed from two numbers measured on a laboratory bench, the constants mu nought and epsilon nought: one over the square root of their product. That comes to 3.00 times ten to the eight metres per second, the measured speed of light.',
                ['Light is an electromagnetic wave. A law discovered by moving magnets in and out of coils of wire turned out to explain colour, radio, and the sunlight on your face.', 2]],
          draw(r, S) {
            const k = 2.4, w = 2.0 * S.w, a = S.at(1, 0.8);
            if (a > 0) {
              const x0 = 90, x1 = 870, y0 = 230, E = [], B = [];
              for (let i = 0; i <= 200; i++) { const u = i / 200, ph = TAU * k * u - w, x = x0 + (x1 - x0) * u; E.push([x, y0 - 80 * Math.sin(ph)]); B.push([x + 40 * Math.sin(ph) * 0.6, y0 + 40 * Math.sin(ph) * 0.35]); }
              r.line(x0, y0, x1 + 20, y0, { c: C.greyD, w: 1.5, a });
              r.poly(E, { c: C.yellow, w: 3, a }); r.poly(B, { c: C.blue, w: 3, a });
              r.txt('E', x1 - 10, 120, { size: 20, sans: true, c: C.yellow, a }); r.txt('B', x1 - 10, 290, { size: 20, sans: true, c: C.blue, a });
            }
            K.tex(r, S, 0, T`\nabla\times\vec{E} = -\frac{\partial\vec{B}}{\partial t},\qquad \nabla\times\vec{B} = \mu_0\varepsilon_0\frac{\partial\vec{E}}{\partial t}`, 480, 70, { size: 26, out: 2 });
            K.tex(r, S, 2, T`c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = 3.00\times10^{8}\ \text{m s}^{-1}`, 480, 410, { size: 32, c: C.green });
          } }
      ]],
      ['Subtleties and a summary', [
        { say: ['A word of honesty about the flux rule. Epsilon equals minus d phi by d t is not quite one law but two pieces of physics: the magnetic force on moving charges, and the curling electric field made by a changing B. In most situations both give the same answer, as they did for the sliding rod.',
                'But there are devices where the flux rule, applied naively, gives the wrong answer. A copper disc spinning in a steady field, Faraday\'s own disc dynamo, produces a steady EMF even though no loop\'s flux is obviously changing. The safe method in a puzzling case is to go back to the forces: q v cross B on moving charges, and the curling E from changing B.',
                'Richard Feynman pointed out that this is the only place in basic physics where one simple rule needs two completely different explanations. It was one of the clues that led Einstein to special relativity: whether a field is electric or magnetic depends on who is moving.'],
          draw(r, S) {
            const cx = 300, cy = 250, R = 140, rot = 1.3 * S.w;
            r.alpha(S.at(1, 0.8), () => {
              r.circle(cx, cy, R, { c: C.gold, w: 3, fill: C.gold, fa: 0.12 }); for (let k = 0; k < 6; k++) { const t = rot + (TAU * k) / 6; r.line(cx, cy, cx + R * Math.cos(t), cy + R * Math.sin(t), { c: C.gold, w: 1.5, a: 0.6 }); }
              for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) r.txt('×', cx - 100 + i * 50, cy - 100 + j * 50, { size: 14, align: 'center', c: C.blueA, a: 0.55 });
              r.line(cx, cy, cx, cy + 210, { c: C.greyB, w: 2 }); r.line(cx + R, cy, cx + R + 60, cy, { c: C.greyB, w: 2 }); r.poly([[cx + R + 60, cy], [cx + R + 60, cy + 210], [cx, cy + 210]], { c: C.greyB, w: 2 });
              r.txt('steady EMF', cx + R + 70, cy + 110, { size: 16, sans: true, c: C.yellow });
            });
            K.tex(r, S, 0, T`\varepsilon = \oint(\vec{E} + \vec{v}\times\vec{B})\cdot d\vec{l}`, 720, 100, { size: 28, c: C.yellow });
            K.txt(r, S, 2, 'electric or magnetic depends on who is moving', 720, 400, { size: 19, align: 'center', c: C.blue });
          } },
        { say: ['Let us collect what we found.',
                'Magnetic flux is B A cos theta, measured in webers, and a coil of N turns has flux linkage N phi.',
                'Faraday\'s law: the EMF is minus N d phi by d t. The minus sign is Lenz\'s law, which is energy conservation: induced currents oppose the change that makes them.',
                'Change the area and you get motional EMF, B L v. Change the angle and you get a generator, N B A omega sin omega t. Change the field and you get a transformer, with voltages in the ratio of the turns.',
                'A coil opposes changes in its own current: the back EMF is minus L d I by d t, and it stores one half L I squared.',
                'And underneath it all, a changing magnetic field makes an electric field that curls: the curl of E equals minus d B by d t.',
                'Walter Lewin\'s MIT lectures sixteen and seventeen show all of this with unforgettable demonstrations, and 3Blue1Brown\'s video on divergence and curl explains the language of the last equation. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['Φ = BA cos θ (Wb); linkage NΦ', 'ε = −N dΦ/dt; the minus sign is Lenz = energy conservation', 'BLv (area), NBAω sin ωt (angle), Vs/Vp = Ns/Np (field)', 'self-inductance: ε = −L dI/dt, U = ½LI²', 'a changing B makes a curling E: ∇×E = −∂B/∂t'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Fourier series and the Fourier transform (Year 1 → Year 2 maths). References: 3Blue1Brown DE4 and the Fourier transform; MIT 18.03 lectures 15–17. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  const sq = (x, N) => { let s = 0; for (let n = 1; n <= N; n += 2) s += Math.sin(n * x) / n; return (4 / Math.PI) * s; };
  const saw = (x, N) => { let s = 0; for (let n = 1; n <= N; n++) s += ((n % 2 ? 1 : -1) * Math.sin(n * x)) / n; return 2 * s; };
  // the outline to draw with circles: a heart, sampled and Fourier-transformed once
  const heart = (() => {
    const N = 256, z = [];
    for (let j = 0; j < N; j++) { const t = (TAU * j) / N, s = Math.sin(t); z.push([16 * s * s * s, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); }
    const co = [];
    for (let k = -40; k <= 40; k++) { let re = 0, im = 0; for (let j = 0; j < N; j++) { const a = (-TAU * k * j) / N, c = Math.cos(a), s = Math.sin(a); re += z[j][0] * c - z[j][1] * s; im += z[j][0] * s + z[j][1] * c; } co.push({ k, re: re / N, im: im / N, m: Math.hypot(re, im) / N }); }
    co.sort((a, b) => b.m - a.m);
    return co;
  })();

  L.def({
    id: 'fourier', order: 8, title: 'Fourier: building anything from waves', sub: 'Series, transforms, and why every sound, image and signal can be split into pure frequencies',
    level: 'Year 1 → Year 2 maths', topics: ['m-fourier-series', 'm-fourier-transform', 'y2-fourier'], thumb: [10, 95],
    refs: [
      ['3Blue1Brown', 'But what is a Fourier series? From heat flow to drawing with circles', 'https://3blue1brown.com/lessons/fourier-series'],
      ['3Blue1Brown', 'Solving the heat equation (the problem Fourier series were invented for)', 'https://www.3blue1brown.com/lessons/heat-equation'],
      ['MIT OCW 18.03 (Arthur Mattuck)', 'Lecture 15: Introduction to Fourier series; basic formulas for period 2π', 'https://www.ocw.mit.edu/courses/18-03-differential-equations-spring-2010/resources/lecture-15-introduction-to-fourier-series'],
      ['MIT OCW 18.03', 'Lecture 17: Particular solutions via Fourier series; hearing musical sounds', 'https://www.ocw.mit.edu/courses/18-03-differential-equations-spring-2010/resources/lecture-17-finding-particular-solutions-via-fourier-series']
    ],
    chapters: [
      ['Heat, and an outrageous claim', [
        { say: ['In 1807, Joseph Fourier made a claim that the best mathematicians of his time refused to believe: that any function at all, even one with corners and jumps, can be written as a sum of smooth sine waves. He was essentially right, and the idea now runs through all of physics and engineering.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Fourier', 'Building anything from waves', { y: 190 });
            const a = S.in(1.6, 1.2), N = 1 + 2 * Math.floor(cl((S.t - 1.6) / 7) * 12), pts = []; for (let i = 0; i <= 300; i++) { const x = -TAU + (2 * TAU * i) / 300; pts.push([480 + x * 55, 410 - 40 * sq(x, N)]); } r.poly(pts, { c: C.yellow, w: 2.5, a });
          } },
        { tail: 2.6, say: ['He was studying heat. Picture a metal rod with some starting temperature along it: hot here, cold there. How does the temperature even out over time? That is governed by the heat equation: the rate of change of temperature is proportional to its second derivative in space.',
                'For most starting shapes this is hard. But for one special shape it is easy: a sine wave. A sine wave keeps its shape and simply shrinks, at a rate that depends on how wiggly it is. Waves whose phase grows k radians per metre decay like e to the minus alpha k squared t.',
                'So Fourier\'s plan was: write the starting temperature as a sum of sine waves, let each one fade at its own rate, and add them back up. Watch: the wiggly components die quickly, the broad ones slowly, and the rod relaxes to a smooth curve.',
                'The plan only works if any starting shape can be written as a sum of sines. That is the claim, and the rest of this lecture is about why it is true, how to find the sum, and what it gives us.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\frac{\partial T}{\partial t} = \alpha\,\frac{\partial^{2} T}{\partial x^{2}}`, 480, 70, { size: 32 });
            const A = K.axes(r, { x0: 90, y0: 300, w: 760, h: 170, xr: [0, Math.PI], yr: [-0.2, 1.4], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const tt = S.t > S.B[2] ? 0.6 * (S.t - S.B[2]) : 0, al = 0.06;
            const f = (x) => { let s = 0; for (let n = 1; n <= 39; n += 2) s += (4 / (Math.PI * n)) * Math.sin(n * x) * Math.exp(-al * n * n * tt); return s; };
            K.plot(r, A, f, 0, Math.PI, S.at(0, 1.4, 0.3), { c: C.red, n: 400 });
            const a1 = S.at(1, 0.7); if (a1 > 0) { [1, 3, 5].forEach((n, i) => K.plot(r, A, (x) => (4 / (Math.PI * n)) * Math.sin(n * x) * Math.exp(-al * n * n * tt), 0, Math.PI, a1, { c: [C.yellow, C.blue, C.green][i], w: 1.8, a: 0.8 })); }
            K.tex(r, S, 1, T`\sin(kx)\,e^{-\alpha k^{2} t}`, 480, 400, { size: 30, c: C.yellow });
          } }
        ,{ tail: 2.6, say: ['Here is Fourier\'s method on a real problem. A copper rod one metre long, insulated along its length, starts at 100 degrees everywhere, and at time zero both ends are plunged into melting ice. How hot is the middle after ten minutes?',
                'The solution is a sum of sine modes: four hundred over pi, times the sum over odd n of sin n pi x over L, over n, each multiplied by its own decay, e to the minus alpha, n pi over L, squared, t.',
                'For copper, alpha is about 1.1 times ten to the minus four square metres per second. The first mode decays with a time constant of L squared over alpha pi squared: about 920 seconds, roughly fifteen minutes. The third mode decays nine times faster, in about a hundred seconds.',
                'So after ten minutes, only the first mode matters. At the middle, sin of pi over two is one, so the temperature is four hundred over pi, times e to the minus 600 over 920: 127 times 0.52, which is about 66 degrees. The next mode changes that by only a tenth of a degree. A hard problem, solved with one exponential, because Fourier split it into pieces that each behave simply.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 90, y0: 360, w: 420, h: 260, xr: [0, 1], yr: [0, 130], xl: 'x (m)', yl: 'T (°C)', xt: [0, 1, 0.25], yt: [0, 120, 40] });
            A.draw(S.at(0, 0.8));
            const tau1 = 1 / (1.1e-4 * Math.PI * Math.PI), tm = S.t > S.B[3] ? Math.min(600, 120 * (S.t - S.B[3])) : S.t > S.B[1] ? Math.min(60, 12 * (S.t - S.B[1])) : 0;
            const T0 = (x) => { if (tm === 0) return x <= 0.002 || x >= 0.998 ? 0 : 100; let s2 = 0; for (let n = 1; n <= 61; n += 2) s2 += (400 / (Math.PI * n)) * Math.sin(n * Math.PI * x) * Math.exp(-n * n * tm / tau1); return s2; };
            K.plot(r, A, T0, 0, 1, S.at(0, 1.2, 0.3), { c: C.red, n: 400 });
            r.txt(`t = ${Math.round(tm)} s`, 460, 80, { size: 18, sans: true, c: C.red, align: 'right', a: S.at(1, 0.6) });
            K.tex(r, S, 1, T`T = \frac{400}{\pi}\sum_{n\ \text{odd}}\frac{1}{n}\sin\frac{n\pi x}{L}\,e^{-\alpha (n\pi/L)^{2} t}`, 720, 110, { size: 22 });
            K.tex(r, S, 2, T`\tau_1 = \frac{L^{2}}{\alpha\pi^{2}} \approx 920\ \text{s},\ \ \tau_3 = \tau_1/9`, 720, 200, { size: 24, c: C.blue });
            K.tex(r, S, 3, T`T_{\text{mid}}(600\ \text{s}) \approx 127\,e^{-600/920} \approx 66\ ^{\circ}\text{C}`, 720, 290, { size: 24, c: C.green });
          } }
      ]],
      ['Adding sine waves', [
        { tail: 2.6, say: ['Let us test the claim on the hardest kind of shape: a square wave, which jumps between plus one and minus one with sharp corners. Can smooth sines make corners?',
                'Start with a single sine wave, scaled by four over pi. It is a rough first guess: the right size, the right period, but round where the target is flat.',
                'Add a sine wave with three times the frequency and one third of the size. The tops flatten and the sides steepen. Add the fifth harmonic at one fifth the size, then the seventh at one seventh.',
                ['With fifteen terms, the shape is already very square. With fifty, it is nearly perfect. Each extra term is smaller and wigglier, correcting the errors of the ones before.', 2],
                'Look closely at the corners, though. Just beside each jump there is an overshoot, about nine percent of the jump, that never goes away, however many terms you add. It only gets narrower. This is the Gibbs phenomenon, and it is real: it shows up as ringing in audio and in images that have been compressed too hard.',
                'It carries Josiah Willard Gibbs\'s name because he explained it in 1899, though an English mathematician, Henry Wilbraham, had already found it half a century earlier. Credit in science does not always go to the first person.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 70, y0: 260, w: 820, h: 190, xr: [-Math.PI * 1.05, Math.PI * 1.05], yr: [-1.35, 1.35], xl: 'x' });
            A.draw(S.at(0, 0.8));
            K.plot(r, A, (x) => (x >= 0 ? 1 : -1) * (Math.abs(x) <= Math.PI ? 1 : -1), -Math.PI, Math.PI, S.at(0, 1, 0.3), { c: C.greyB, w: 2, dash: [6, 5] });
            const N = S.t < S.B[1] ? 0 : S.t < S.B[2] ? 1 : S.t < S.B[3] ? 1 + 2 * Math.min(3, 1 + Math.floor((S.t - S.B[2]) / 2.2)) : S.t < S.B[3] + 3 ? 15 : 51;
            if (N > 0) K.plot(r, A, (x) => sq(x, N), -Math.PI * 1.05, Math.PI * 1.05, 1, { c: C.yellow, n: 900 });
            if (N > 0) r.txt(`terms up to sin ${N}x`, 860, 70, { size: 18, sans: true, c: C.yellow, align: 'right' });
            K.tex(r, S, 1, T`\frac{4}{\pi}\Big(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots\Big)`, 480, 420, { size: 30 });
            if (S.t > S.B[4]) { const p = A.pt(0.06, 1.179); r.circle(p[0], p[1], 26, { c: C.red, w: 2.5, a: S.at(4, 0.6) }); r.txt('≈ 9 % overshoot', p[0] + 34, p[1] - 22, { size: 16, sans: true, c: C.red, a: S.at(4, 0.6) }); }
          } }
      ]],
      ['Finding the coefficients', [
        { say: ['How did we know the sizes four over pi, then one third, then one fifth? There is a beautiful trick, and it rests on one fact about sine waves.',
                'Multiply two different harmonics, say sin x and sin three x, and look at the product over one full period. It is positive as often as it is negative, and its integral is exactly zero.',
                'But multiply a harmonic by itself, sin three x times sin three x, and the product is a square, never negative. Its integral over a period is pi.',
                'We say the harmonics are orthogonal, like perpendicular directions. And that is the trick. To find how much of sin n x is in a function f, multiply f by sin n x and integrate. Every other harmonic integrates to zero, and only the one you want survives.',
                'So b n equals one over pi, times the integral of f of x sin n x, over a period. Cosines work the same way, and the constant term a nought is just the average value of f. This is projection: exactly how you find a component of a vector.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 150, w: 360, h: 120, xr: [0, TAU], yr: [-1.1, 1.1], xl: 'x' }), B2 = K.axes(r, { x0: 520, y0: 150, w: 360, h: 120, xr: [0, TAU], yr: [-1.1, 1.1], xl: 'x' });
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.alpha(a1, () => A.draw(1)); const pts = [A.pt(0, 0)]; for (let i = 0; i <= 120; i++) { const x = (TAU * i) / 120; pts.push(A.pt(x, Math.sin(x) * Math.sin(3 * x))); } pts.push(A.pt(TAU, 0)); r.poly(pts, { c: C.yellow, w: 2, fill: C.yellow, fa: 0.3, a: a1 }); K.tex(r, S, 1, T`\int_0^{2\pi}\sin x\,\sin 3x\,dx = 0`, 260, 230, { size: 24, c: C.yellow, dl: 0.8 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) { r.alpha(a2, () => B2.draw(1)); const pts = [B2.pt(0, 0)]; for (let i = 0; i <= 120; i++) { const x = (TAU * i) / 120; pts.push(B2.pt(x, Math.sin(3 * x) ** 2)); } pts.push(B2.pt(TAU, 0)); r.poly(pts, { c: C.green, w: 2, fill: C.green, fa: 0.3, a: a2 }); K.tex(r, S, 2, T`\int_0^{2\pi}\sin^{2}3x\,dx = \pi`, 700, 230, { size: 24, c: C.green, dl: 0.8 }); }
            const a4 = S.at(4, 0.7); if (a4 > 0) { r.rr(200, 290, 560, 90, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a4 }); K.tex(r, S, 4, T`b_n = \frac{1}{\pi}\int_0^{2\pi} f(x)\sin nx\,dx,\qquad a_0 = \overline{f}`, 480, 335, { size: 28, c: C.yellow, dl: 0.2 }); }
            K.txt(r, S, 3, 'orthogonal, like perpendicular directions', 480, 440, { size: 20, align: 'center', c: C.blue });
          } }
      ]],
      ['Two worked examples', [
        { say: ['Example one: the square wave, equal to plus one from zero to pi, and minus one from pi to two pi. Use the formula for b n.',
                'Split the integral at pi: b n equals one over pi, times the integral from zero to pi of sin n x, minus the integral from pi to two pi of sin n x.',
                'Each integral is easy. The result is two over pi n, times one minus cos n pi. When n is even, cos n pi is one and b n is zero. When n is odd, cos n pi is minus one and b n is four over pi n. Exactly the sizes we used.',
                'Here is a bonus. Put x equal to pi over two, where the square wave equals one. The series becomes four over pi, times one minus a third plus a fifth minus a seventh, and so on. So that alternating sum must equal pi over four. A formula for pi, found by accident.'],
          draw(r, S) {
            K.calc(r, S, 1, 80, 90, [T`b_n = \frac{1}{\pi}\Big(\int_0^{\pi}\sin nx\,dx - \int_{\pi}^{2\pi}\sin nx\,dx\Big)`, T`= \frac{2}{\pi n}\,(1 - \cos n\pi) = \begin{cases} 4/\pi n & n\ \text{odd} \\ 0 & n\ \text{even}\end{cases}`, T`x = \tfrac{\pi}{2}:\ \ 1 = \frac{4}{\pi}\Big(1 - \frac13 + \frac15 - \frac17 + \cdots\Big)\ \Rightarrow\ \frac{\pi}{4} = 1 - \frac13 + \frac15 - \cdots`], { ks: [1, 2, 3], dy: 110, size: 26 });
          } },
        { tail: 2.6, say: ['Example two: the sawtooth, f of x equals x, between minus pi and pi, repeated. It is an odd function, symmetric through the origin, so only sines appear.',
                'Integrating x sin n x by parts gives b n equals two times minus one to the n plus one, over n. So x equals two times sin x, minus sin two x over two, plus sin three x over three, and so on.',
                'Notice how slowly the coefficients shrink: as one over n. For the square wave it was also one over n. Both functions have jumps, and jumps always produce coefficients that fall only as one over n. A function with a corner but no jump falls as one over n squared; a smooth function falls faster than any power. The smoother the function, the faster its spectrum dies away, a rule worth remembering.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 70, y0: 230, w: 820, h: 170, xr: [-Math.PI * 1.9, Math.PI * 1.9], yr: [-3.6, 3.6], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const st = []; for (let k = -1; k <= 1; k++) st.push([A.pt(-Math.PI + k * TAU, -Math.PI), A.pt(Math.PI + k * TAU, Math.PI)]);
            r.alpha(S.at(0, 0.8, 0.4), () => st.forEach(([p, q]) => r.line(p[0], p[1], q[0], q[1], { c: C.greyB, w: 2, dash: [6, 5] })));
            const N = S.t > S.B[1] ? Math.min(30, 1 + Math.floor((S.t - S.B[1]) * 2.5)) : 0;
            if (N) K.plot(r, A, (x) => saw(x, N), -Math.PI * 1.9, Math.PI * 1.9, 1, { c: C.yellow, n: 900 });
            K.tex(r, S, 1, T`x = 2\Big(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \cdots\Big)`, 480, 330, { size: 28 });
            K.tex(r, S, 2, T`\text{jump}: 1/n,\quad \text{corner}: 1/n^{2},\quad \text{smooth}: \text{faster than any power}`, 480, 420, { size: 24, c: C.green });
          } }
        ,{ tail: 2.6, say: ['Example three shows the corner rule in action: the triangle wave, f of x equals the absolute value of x, between minus pi and pi. It is even, symmetric about the vertical axis, so only cosines appear, plus a constant.',
                'The constant is the average height, pi over two. The cosine coefficients come out as minus four over pi n squared for odd n, and zero for even n. One over n squared, because the triangle has corners but no jumps.',
                'So the absolute value of x equals pi over two, minus four over pi times cos x, plus cos three x over nine, plus cos five x over twenty-five, and so on. Put x equal to zero, where the function is zero, and you find that one plus a ninth plus a twenty-fifth plus and so on equals pi squared over eight. Another formula for pi, from another shape.',
                ['Watch how quickly it converges. With just three terms the triangle is already hard to tell from the real thing, while the square wave needed dozens. Smoothness is speed.', 2]],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 250, w: 800, h: 180, xr: [-Math.PI * 1.9, Math.PI * 1.9], yr: [-0.3, 3.6], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const tr = (x) => { const y = ((x + Math.PI) % TAU + TAU) % TAU - Math.PI; return Math.abs(y); };
            K.plot(r, A, tr, -Math.PI * 1.9, Math.PI * 1.9, S.at(0, 1, 0.3), { c: C.greyB, w: 2, dash: [6, 5], n: 600 });
            const N = S.t > S.B[3] ? 5 : S.t > S.B[1] ? 1 : 0;
            if (N || S.t > S.B[1]) K.plot(r, A, (x) => { let s2 = Math.PI / 2; for (let n = 1; n <= N; n += 2) s2 -= (4 / (Math.PI * n * n)) * Math.cos(n * x); return s2; }, -Math.PI * 1.9, Math.PI * 1.9, 1, { c: C.yellow, n: 600 });
            K.tex(r, S, 2, T`|x| = \frac{\pi}{2} - \frac{4}{\pi}\Big(\cos x + \frac{\cos 3x}{9} + \frac{\cos 5x}{25} + \cdots\Big)`, 480, 340, { size: 26 });
            K.tex(r, S, 2, T`x = 0:\ \ 1 + \frac19 + \frac1{25} + \cdots = \frac{\pi^{2}}{8}`, 480, 420, { size: 28, c: C.green, dl: 2.5 });
          } },
        { say: ['There is also a beautiful energy rule, Parseval\'s theorem. The average of f squared over a period equals the sum of the squares of the coefficients, with a half for each sine or cosine. Energy is shared out among the harmonics, with nothing lost.',
                'For the square wave, f squared is always one. The fundamental alone has amplitude four over pi, so it carries one half of four over pi, squared: eight over pi squared, which is 0.81. Eighty-one percent of a square wave\'s power is in its fundamental. All the infinitely many higher harmonics share the remaining nineteen percent.',
                'That is why a square wave played through a speaker sounds like its fundamental note with a buzzy edge, and why filtering out the high harmonics barely changes how loud it is.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\overline{f^{2}} = a_0^{2} + \tfrac12\sum_{n\ge1}\big(a_n^{2} + b_n^{2}\big)`, 480, 90, { size: 32, c: C.yellow });
            K.tex(r, S, 1, T`\tfrac12\Big(\frac{4}{\pi}\Big)^{2} = \frac{8}{\pi^{2}} = 0.81`, 480, 190, { size: 32, c: C.green });
            const a = S.at(1, 0.7, 1); if (a > 0) { const B2 = K.axes(r, { x0: 180, y0: 440, w: 600, h: 180, xr: [0, 12], yr: [0, 0.9], xl: 'n' }); r.alpha(a, () => B2.draw(1)); for (let n = 1; n <= 11; n += 2) { const pw = 0.5 * (4 / (Math.PI * n)) ** 2; r.rect(B2.X(n) - 14, B2.Y(pw), 28, B2.Y(0) - B2.Y(pw), { c: C.blue, fill: C.blue, fa: 0.5, w: 1.5, a }); } r.txt('power in each harmonic', 780, 300, { size: 16, sans: true, c: C.dim, align: 'right', a }); }
          } },
        { say: [['Pause and think. You must approximate a square wave and a triangle wave to within one percent everywhere. Which needs more terms, and why?', 4],
                'The triangle, by far the fewer. Its coefficients fall as one over n squared, so ten or so terms are plenty. The square wave\'s fall only as one over n, and worse, near the jumps the Gibbs overshoot of nine percent never goes away, so no finite number of terms gets within one percent everywhere. The jump is the problem, not the number of terms.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Square or triangle: which needs more terms for 1 % accuracy?'], { y: 90 });
            K.tex(r, S, 1, T`\text{square: } \frac{1}{n},\ \text{Gibbs } 9\%\ \ \text{vs}\ \ \text{triangle: } \frac{1}{n^{2}}`, 480, 330, { size: 30, c: C.yellow });
          } }
      ]],
      ['Circles: the complex form', [
        { say: ['Now the version that 3Blue1Brown made famous. Euler\'s formula says e to the i theta equals cos theta plus i sin theta: a point on the unit circle in the complex plane, at angle theta.',
                'So e to the i n t is an arrow, rotating n times per cycle. Sines and cosines are just the shadows of these rotating arrows, and a sum of sines can be repackaged as a sum of rotating arrows, each with its own length and starting angle.',
                'The coefficient of each arrow is found with the same projection trick: c n equals one over two pi, times the integral of f of t, e to the minus i n t. Multiplying by e to the minus i n t spins everything backwards at speed n, so the n-th arrow stands still and survives the average, while every other arrow spins and averages to zero.',
                ['And now the magic. Let f be any closed curve in the plane: here, the outline of a heart. Compute its coefficients, put the arrows tip to tail, and set them turning. The tip of the last arrow traces the shape.', 6],
                'With a handful of arrows, you get a rough blob. With forty, the heart is nearly exact. Any closed drawing, however intricate, can be traced by circles turning on circles. The medieval astronomers, with their epicycles, were doing Fourier series without knowing it.'],
          draw(r, S) {
            const a0 = S.at(0, 0.8);
            if (S.t < S.B[3]) {
              const cx = 260, cy = 260, R = 120, th = 1.1 * S.w;
              r.alpha(a0, () => { r.line(cx - 160, cy, cx + 160, cy, { c: C.greyD, w: 1.5 }); r.line(cx, cy + 160, cx, cy - 160, { c: C.greyD, w: 1.5 }); r.circle(cx, cy, R, { c: C.blue, w: 2 }); r.arrow(cx, cy, cx + R * Math.cos(th), cy - R * Math.sin(th), { c: C.yellow, w: 3, head: 11 }); r.line(cx + R * Math.cos(th), cy - R * Math.sin(th), cx + R * Math.cos(th), cy, { c: C.green, w: 2, dash: [4, 4] }); });
              K.tex(r, S, 0, T`e^{i\theta} = \cos\theta + i\sin\theta`, 690, 110, { size: 30 });
              K.tex(r, S, 2, T`c_n = \frac{1}{2\pi}\int_0^{2\pi} f(t)\,e^{-int}\,dt`, 690, 230, { size: 30, c: C.yellow });
              K.tex(r, S, 1, T`f(t) = \sum_n c_n\,e^{int}`, 690, 340, { size: 30, c: C.blue });
              return;
            }
            const M = S.t < S.B[4] ? 6 : Math.min(heart.length, 6 + Math.floor((S.t - S.B[4]) * 5)), sc = 9.5, ox = 480, oy = 250, tt = 0.55 * (S.t - S.B[3]);
            let x = ox, y = oy; const tip = (tau) => { let X = ox, Y = oy; for (let i = 0; i < M; i++) { const c = heart[i], ang = c.k * tau; X += sc * (c.re * Math.cos(ang) - c.im * Math.sin(ang)); Y += sc * (c.re * Math.sin(ang) + c.im * Math.cos(ang)); } return [X, Y]; };
            const trail = []; for (let i = 0; i <= 160; i++) trail.push(tip(tt - (TAU * 0.98 * i) / 160));
            r.fade(trail.reverse(), { c: C.yellow, w: 3 });
            for (let i = 0; i < M; i++) { const c = heart[i], ang = c.k * tt, dx = sc * (c.re * Math.cos(ang) - c.im * Math.sin(ang)), dy = sc * (c.re * Math.sin(ang) + c.im * Math.cos(ang)), Rr = sc * c.m; if (Rr > 3) r.circle(x, y, Rr, { c: C.blue, w: 1, a: 0.35 }); r.line(x, y, x + dx, y + dy, { c: C.blueA, w: 1.6, a: 0.85 }); x += dx; y += dy; }
            r.txt(M + ' arrows', 860, 450, { size: 18, sans: true, c: C.blue, align: 'right' });
          } }
      ]],
      ['Listening to frequencies', [
        { tail: 2.6, say: ['Sound is where Fourier analysis becomes something you can hear. Play the notes C, E and G together: 262, 330 and 392 hertz. The air pressure at your ear is the sum of three sine waves, and it looks like a tangled mess.',
                'Yet you hear three clear notes. Inside your inner ear, the cochlea is a coiled tube lined with hair cells tuned to different frequencies, from high at the entrance to low at the far end. Each region resonates with its own frequency. Your ear performs a Fourier analysis, mechanically, in real time.',
                'The spectrum shows it plainly: three spikes, one for each note. A violin and a flute playing the same note have the same fundamental, but different sizes of harmonics above it. That pattern of harmonics, the spectrum, is what we hear as the timbre of an instrument.',
                'A tuner app on your phone does the same job in software. It records a fraction of a second of sound, computes the spectrum, finds the tallest spike, and tells you how far it is from the note you want.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 200, w: 820, h: 150, xr: [0, 0.03], yr: [-3.2, 3.2], xl: 't' });
            A.draw(S.at(0, 0.8));
            const g = (t) => Math.sin(TAU * 261.6 * t) + Math.sin(TAU * 329.6 * t) + Math.sin(TAU * 392 * t);
            K.plot(r, A, g, 0, 0.03, S.at(0, 1.6, 0.4), { c: C.yellow, w: 2, n: 900 });
            const B2 = K.axes(r, { x0: 120, y0: 440, w: 700, h: 150, xr: [200, 450], yr: [0, 1.2], xl: 'f (Hz)', xt: [200, 450, 50] }), a = S.at(2, 0.7);
            if (a > 0) { r.alpha(a, () => B2.draw(1)); [[261.6, 'C'], [329.6, 'E'], [392, 'G']].forEach(([f, n], i) => { const q = S.at(2, 0.5, 0.4 + i * 0.5); r.line(B2.X(f), B2.Y(0), B2.X(f), B2.Y(1), { c: C.green, w: 5, a: q }); r.txt(n, B2.X(f), B2.Y(1) - 16, { size: 18, sans: true, c: C.green, align: 'center', a: q }); }); }
          } }
      ]],
      ['The Fourier transform', [
        { tail: 2.6, say: ['Fourier series handle repeating signals. What about a signal that never repeats, like a single clap? Let the period grow longer and longer. The harmonics, spaced by one over the period, crowd closer and closer, until the sum becomes an integral over a continuous range of frequencies.',
                'That integral is the Fourier transform: f hat of omega equals the integral of f of t, e to the minus i omega t, d t. It answers the question: how much of each frequency omega is in the signal?',
                'Here is a way to see it, again from 3Blue1Brown. Take a signal that wobbles three times per second, and wrap its graph round a circle, winding at some trial frequency. Then ask where the centre of mass of the wrapped curve sits.',
                ['For most winding frequencies, the curve is spread evenly round the circle and the centre of mass stays near the middle. But when the winding frequency matches the signal\'s three cycles per second, the peaks all land on the same side, and the centre of mass swings far out. Plot that distance against the winding frequency, and a spike appears at three. That plot is the Fourier transform.', 4],
                'The centre of mass is a complex number. Its size tells you how much of that frequency is present, and its angle tells you the phase: whether the wave starts at a peak, a trough, or somewhere in between. Nothing about the signal is lost; the transform can be run backwards to rebuild it exactly.'],
          draw(r, S) {
            const sig = (t) => 1 + Math.cos(TAU * 3 * t), Tm = 4;
            if (S.t < S.B[2]) {
              const A = K.axes(r, { x0: 90, y0: 300, w: 780, h: 200, xr: [0, 4], yr: [-0.2, 2.2], xl: 't (s)' });
              r.alpha(S.at(0, 0.8), () => { A.draw(1); }); K.plot(r, A, sig, 0, 4, S.at(0, 1.4, 0.3), { c: C.yellow, n: 500 });
              K.tex(r, S, 1, T`\hat f(\omega) = \int_{-\infty}^{\infty} f(t)\,e^{-i\omega t}\,dt`, 480, 400, { size: 32, c: C.yellow });
              return;
            }
            const fw = S.t < S.B[3] ? 0.9 : Math.min(4.5, 0.9 + 0.32 * (S.t - S.B[3])), cx = 230, cy = 260, Rk = 75;
            const pts = []; let mx = 0, my = 0; const n = 600;
            for (let i = 0; i <= n; i++) { const t = (Tm * i) / n, rr = sig(t) * Rk, ang = -TAU * fw * t; const p = [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)]; pts.push(p); mx += p[0]; my += p[1]; }
            mx /= n + 1; my /= n + 1;
            r.line(cx - 170, cy, cx + 170, cy, { c: C.greyD, w: 1.2 }); r.line(cx, cy - 170, cx, cy + 170, { c: C.greyD, w: 1.2 });
            r.poly(pts, { c: C.yellow, w: 2, a: 0.9 }); r.dot(mx, my, { r: 8, c: C.red }); r.txt(fw.toFixed(2) + ' winds per second', cx, cy + 190, { size: 16, sans: true, c: C.dim, align: 'center' });
            const B2 = K.axes(r, { x0: 480, y0: 400, w: 400, h: 260, xr: [0, 4.6], yr: [0, 0.6], xl: 'winding frequency', xt: [0, 4, 1] });
            B2.draw(1);
            const com = (f) => { let X = 0, Y = 0; const m = 300; for (let i = 0; i <= m; i++) { const t = (Tm * i) / m, a = -TAU * f * t; X += sig(t) * Math.cos(a); Y += sig(t) * Math.sin(a); } return Math.hypot(X, Y) / (m + 1) / 2.0; };
            K.plot(r, B2, com, 0.5, fw, 1, { c: C.red, n: 220 });
          } }
      ]],
      ['Uncertainty, again', [
        { tail: 2.6, say: ['The transform reveals a trade-off you have met before. Take a short pulse, a brief burst of a single tone. Its spectrum is not a sharp spike but a spread-out bump.',
                'Make the pulse shorter and the spectrum gets wider. Make it longer and the spectrum narrows. For a Gaussian pulse, the product of the spread in time and the spread in angular frequency is exactly one half, and for any other shape it is larger.',
                'In practice: a sound lasting ten milliseconds cannot have a pitch sharper than about a hundred hertz. That is why a very short click has no definite note, and why radar engineers trade pulse length against frequency resolution.',
                'And it is the same mathematics as Heisenberg\'s uncertainty principle. In quantum mechanics momentum is h-bar times the wavenumber, so a wavefunction narrow in position must contain a wide spread of wavenumbers, and so of momenta. Delta x delta p at least h-bar over two is a fact about Fourier transforms, applied to matter waves.'],
          draw(r, S) {
            const w = S.t > S.B[1] ? 0.35 + 0.25 * Math.sin(0.9 * (S.t - S.B[1])) : 0.45;
            const A = K.axes(r, { x0: 80, y0: 260, w: 380, h: 170, xr: [-3, 3], yr: [-1.1, 1.1], xl: 't' }), B2 = K.axes(r, { x0: 540, y0: 260, w: 360, h: 170, xr: [0, 20], yr: [0, 1.1], xl: 'ω' });
            r.alpha(S.at(0, 0.8), () => { A.draw(1); B2.draw(1); });
            K.plot(r, A, (t) => Math.exp(-(t * t) / (2 * w * w)) * Math.cos(10 * t), -3, 3, S.at(0, 1.2, 0.3), { c: C.yellow, n: 700 });
            K.plot(r, A, (t) => Math.exp(-(t * t) / (2 * w * w)), -3, 3, S.at(0, 1.2, 0.3), { c: C.red, w: 1.5, dash: [5, 5] });
            K.plot(r, B2, (om) => Math.exp(-((om - 10) ** 2) * w * w / 2), 0, 20, S.at(0, 1.2, 0.8), { c: C.green, n: 400 });
            K.tex(r, S, 1, T`\Delta t\,\Delta\omega \ge \tfrac12`, 480, 330, { size: 34, c: C.yellow });
            K.tex(r, S, 2, T`10\ \text{ms} \Rightarrow \Delta f \sim 100\ \text{Hz}`, 260, 410, { size: 26, c: C.blue });
            K.tex(r, S, 3, T`p = \hbar k\ \Rightarrow\ \Delta x\,\Delta p \ge \frac{\hbar}{2}`, 700, 410, { size: 28, c: C.green });
          } }
      ]],
      ['Fourier everywhere, and its fine print', [
        { say: ['Fourier\'s idea is everywhere. JPEG images store a picture as amounts of spatial frequency in small blocks, and throw away the fine detail your eye barely notices. MRI scanners measure the Fourier transform of your body\'s tissue directly, and a computer transforms it back into an image.',
                'Spectroscopy reads the frequencies of light to find what stars are made of. And Fourier\'s original use still stands: the heat equation, the wave equation, and the Schrödinger equation are all solved by splitting into frequencies, because each frequency evolves on its own.',
                'All of this runs on one algorithm, the fast Fourier transform, published by Cooley and Tukey in 1965. A direct calculation for N samples takes about N squared steps; the fast transform takes about N log N. For a million samples, that is fifty thousand times faster, the difference between impossible and instant.',
                'Now the fine print, as promised. At a jump, the series converges to the midpoint of the jump, not to either side, and the Gibbs overshoot never disappears. Fourier\'s claim needed real conditions, worked out by Dirichlet and others over the following century: the function must not be too wild. Fourier was right in spirit, and the doubters were right that a proof needed care.',
                'And in a computer, a signal is sampled at discrete moments. Sample too slowly and high frequencies masquerade as low ones: aliasing, the reason wagon wheels seem to spin backwards in films. The fix is the Nyquist rule: sample at more than twice the highest frequency. Human hearing reaches about twenty kilohertz, which is why CDs sample at 44.1 kilohertz.'],
          draw(r, S) {
            K.tex(r, S, 2, T`N^{2} \to N\log_2 N:\ \ N = 10^{6}\ \Rightarrow\ \times 5\times10^{4}`, 480, 300, { size: 26, c: C.green, out: 3 });
            K.list(r, S, [0, 0, 1, 1], ['JPEG: spatial frequencies, fine detail discarded', 'MRI: the scanner measures a Fourier transform', 'spectroscopy: frequencies of light ⇒ composition', 'heat, wave and Schrödinger equations: one frequency at a time'], 100, 90, { dy: 44, size: 21 });
            const A = K.axes(r, { x0: 100, y0: 430, w: 760, h: 140, xr: [0, 1], yr: [-1.2, 1.2], xl: 't' }), a = S.at(4, 0.7);
            if (a > 0) { r.alpha(a, () => A.draw(1)); K.plot(r, A, (t) => Math.sin(TAU * 9 * t), 0, 1, a, { c: C.blue, w: 1.6, n: 600 }); for (let k = 0; k <= 10; k++) { const t = k / 10; r.dot(...A.pt(t, Math.sin(TAU * 9 * t)), { r: 5, c: C.red, a }); } K.plot(r, A, (t) => -Math.sin(TAU * 1 * t), 0, 1, S.at(4, 1, 1), { c: C.red, w: 2.5, dash: [6, 5] }); r.txt('9 Hz sampled at 10 Hz looks like 1 Hz', 860, 290, { size: 16, sans: true, c: C.red, align: 'right', a }); }
            K.txt(r, S, 3, 'at a jump: converges to the midpoint; Gibbs never vanishes', 480, 290, { size: 19, align: 'center', c: C.yellow, out: 4 });
          } },
        { say: ['Let us collect what we found.',
                'Fourier\'s claim: any reasonable periodic function is a sum of sines and cosines, which he needed because each sine wave solves the heat equation on its own.',
                'The coefficients come from orthogonality: multiply by the harmonic you want and integrate. For the square wave they are four over pi n for odd n, which even gives a series for pi.',
                'Jumps make coefficients fall as one over n, corners as one over n squared, smooth functions faster; near jumps the Gibbs overshoot of nine percent remains.',
                'In complex form, a Fourier series is a set of rotating arrows, and any closed drawing can be traced by circles on circles.',
                'The Fourier transform measures how much of each frequency a signal contains. Short in time means wide in frequency, the same mathematics as the uncertainty principle.',
                '3Blue1Brown\'s lessons on Fourier series and the heat equation, and Arthur Mattuck\'s MIT lectures fifteen to seventeen, are the best next steps. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['any reasonable periodic function = a sum of sines and cosines', 'coefficients by orthogonality: bₙ = (1/π)∫ f sin nx dx', 'jump: 1/n, corner: 1/n², smooth: faster; Gibbs ≈ 9 %', 'complex form: rotating arrows; circles can draw anything closed', 'transform: f̂(ω) = ∫ f e^(−iωt) dt; ΔtΔω ≥ ½'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Electric flux and Gauss's law (A-level → Year 1). References: MIT 8.02 (Lewin, lecture 3); 3Blue1Brown divergence and curl. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  const charge = (r, x, y, q, o = {}) => { const col = q > 0 ? C.red : C.blue; r.glow(x, y, 34, col, 0.5 * (o.a == null ? 1 : o.a)); r.circle(x, y, 14, { c: col, fill: col, fa: 0.85, w: 2, a: o.a }); r.txt(q > 0 ? '+' : '−', x, y + 1, { size: 22, align: 'center', c: '#0c0e12', a: o.a, bold: true, sans: true }); };
  const radial = (r, x, y, n, R0, R1, o = {}) => { for (let i = 0; i < n; i++) { const a = (TAU * i) / n + (o.rot || 0); r.arrow(x + R0 * Math.cos(a), y + R0 * Math.sin(a), x + R1 * Math.cos(a), y + R1 * Math.sin(a), { c: o.c || C.yellow, w: o.w || 2, head: 9, a: o.a, p: o.p }); } };
  // an ellipse outline, for surfaces seen at an angle
  const ell = (r, x, y, rx, ry, o = {}) => { const pts = []; for (let i = 0; i <= 64; i++) { const t = (TAU * i) / 64; pts.push([x + rx * Math.cos(t), y + ry * Math.sin(t)]); } r.poly(pts, { c: o.c || C.blue, w: o.w || 2, a: o.a, dash: o.dash, fill: o.fill, fa: o.fa, close: true }); };

  L.def({
    id: 'gauss', order: 4, title: 'Electric flux and Gauss\'s law', sub: 'Counting field lines through a closed surface — and getting the field of a charge, a wire and a plate in one line each',
    level: 'A-level → Year 1', topics: ['y1-gauss', 'al-efields', 'gcse-static'], thumb: [2, 30],
    refs: [
      ['MIT 8.02 (Walter Lewin)', 'Lecture 3: Electric flux, Gauss\'s law, examples (list of the 2002 lectures)', 'https://web.mit.edu/smcs/8.02/'],
      ['MIT OCW 8.02 (Spring 2019)', 'Physics II: Electricity and Magnetism — course materials', 'https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/'],
      ['3Blue1Brown', 'Divergence and curl: the language of Maxwell\'s equations', 'https://www.3blue1brown.com/lessons/divergence-and-curl']
    ],
    chapters: [
      ['Fields and field lines', [
        { say: ['This lecture is about a law that turns hard calculations into one-line arguments, if you know how to look at a problem. It is Gauss\'s law, and it is the first of Maxwell\'s four equations.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Gauss\'s law', 'Electric flux through a closed surface', { y: 200 });
            const a = S.in(1.6, 1.2); if (a > 0) { charge(r, 480, 400, 1, { a }); radial(r, 480, 400, 16, 22, 70, { a: a * 0.8 }); }
          } },
        { say: ['Start with Coulomb\'s law. A point charge q creates an electric field that points straight away from it, with strength k q over r squared, where k is one over four pi epsilon nought, about nine times ten to the nine in SI units.',
                'We draw the field with field lines: they start on positive charges, end on negative ones, and point in the direction of the field. Where the lines are crowded the field is strong; where they spread out it is weak.',
                'Here is the key idea of the whole lecture. Draw a fixed number of lines from the charge. At distance r, those lines are shared out over a sphere of area four pi r squared. So the density of lines falls as one over r squared: exactly the way the field falls.',
                'That is not a coincidence. The inverse-square law is what you get when something spreads out over spheres without being created or lost on the way. Field lines that never begin or end in empty space give an inverse-square field automatically.'],
          draw(r, S) {
            const cx = 300, cy = 260;
            charge(r, cx, cy, 1, { a: S.at(0, 0.8) });
            K.tex(r, S, 0, T`E = \frac{kq}{r^{2}},\quad k = \frac{1}{4\pi\varepsilon_0} \approx 8.99\times10^{9}`, 700, 90, { size: 26 });
            const a1 = S.at(1, 0.7); if (a1 > 0) radial(r, cx, cy, 20, 22, 210, { a: a1, w: 1.8, p: S.at(1, 1.2) });
            const a2 = S.at(2, 0.7); if (a2 > 0) { [80, 160].forEach((R, i) => { r.circle(cx, cy, R, { c: C.blue, w: 2, dash: [6, 5], a: a2 * (0.9 - i * 0.2) }); }); r.tex(T`4\pi r^{2}`, cx + 120, cy - 150, { size: 24, c: C.blue, a: a2 }); }
            K.tex(r, S, 2, T`\frac{\text{lines}}{\text{area}} \propto \frac{1}{4\pi r^{2}}`, 720, 250, { size: 32, c: C.blue, dl: 0.8 });
            K.txt(r, S, 3, 'inverse square = nothing created or lost in between', 720, 360, { size: 20, align: 'center', c: C.yellow });
          } },
        { say: ['Two charges, one positive and one negative, give a dipole. The lines leave the positive charge, curve round, and end on the negative one. The picture is more complicated, but the rule is the same: lines begin and end only on charges.',
                ['With two positive charges, the lines repel each other into the space between, and there is a point exactly in the middle where the field is zero. Field lines never cross, because at any point the field has only one direction.', 3]],
          draw(r, S) {
            const two = S.t > S.B[1], q2 = two ? 1 : -1, P1 = [360, 250], P2 = [600, 250];
            const E = (x, y) => { let ex = 0, ey = 0; [[P1, 1], [P2, q2]].forEach(([p, q]) => { const dx = x - p[0], dy = y - p[1], d2 = dx * dx + dy * dy + 40, d3 = d2 * Math.sqrt(d2); ex += (q * dx) / d3; ey += (q * dy) / d3; }); return [ex, ey]; };
            const a = S.at(0, 0.8) * (two ? S.at(1, 0.6) : 1 - 0 * S.at(1, 0.3));
            r.alpha(a, () => {
              r.field(E, { step: 34, x0: 60, x1: 900, y0: 40, y1: 460, log: true, w: 1.6 });
              charge(r, P1[0], P1[1], 1); charge(r, P2[0], P2[1], q2);
            });
            if (two) K.pin(r, 480, 250, 'E = 0', { c: C.green, a: S.at(1, 0.6, 1), dy: -24, dx: -20 });
          } }
      ]],
      ['Flux', [
        { say: ['To turn the counting of lines into mathematics, we need flux. Think of rain falling straight down. How much rain goes through a window depends on the window\'s area, and on how it is tilted.',
                'Facing the rain squarely, the window catches the most. Tilted at an angle theta, it catches less, because its area seen from the direction of the rain is only A cos theta. Edge-on, it catches nothing.',
                'Electric flux is the same idea for a field: phi equals E A cos theta, where theta is the angle between the field and the normal to the surface. We can write it as a dot product, E dot A, where the vector A points along the normal, with length equal to the area.',
                ['For a curved surface, or a field that varies, chop the surface into small patches, find E dot d A for each, and add them up: the flux is the surface integral of E dot d A.', 2]],
          draw(r, S) {
            const th = S.t > S.B[1] ? 0.95 * (0.5 - 0.5 * Math.cos(0.8 * Math.max(0, S.t - S.B[1]))) : 0, cx = 330, cy = 260, Lh = 110;
            r.alpha(S.at(0, 0.8), () => {
              for (let i = 0; i < 9; i++) { const x = 170 + i * 40, y0 = 60 + ((S.w * 90 + i * 37) % 60); r.arrow(x, y0, x, y0 + 380, { c: C.blueA, w: 1.4, head: 7, a: 0.5 }); }
              const dx = Lh * Math.cos(th), dy = Lh * Math.sin(th);
              r.line(cx - dx, cy - dy, cx + dx, cy + dy, { c: C.yellow, w: 6 });
              r.arrow(cx, cy, cx + 80 * Math.sin(th), cy - 80 * Math.cos(th), { c: C.green, w: 3, head: 11 }); r.tex(T`\hat{n}`, cx + 96 * Math.sin(th), cy - 96 * Math.cos(th), { size: 22, c: C.green });
              if (th > 0.05) r.angle(cx, cy, 46, Math.PI / 2 - th, Math.PI / 2, { c: C.red, tex: T`\theta`, size: 20 });
            });
            K.tex(r, S, 1, T`A_{\perp} = A\cos\theta`, 720, 140, { size: 30 });
            K.tex(r, S, 2, T`\Phi = EA\cos\theta = \vec{E}\cdot\vec{A}`, 720, 230, { size: 32, c: C.yellow });
            K.tex(r, S, 3, T`\Phi = \int \vec{E}\cdot d\vec{A}`, 720, 330, { size: 34, c: C.green });
          } },
        { say: ['For a closed surface, like a balloon, we agree that the normal always points outwards. Field lines leaving the surface count as positive flux; lines entering count as negative.',
                'So the total flux through a closed surface counts the net number of lines coming out: lines out, minus lines in.',
                ['Pause and think. A charge sits outside a closed surface. What is the net flux through the surface?', 4],
                'Zero. Every line from the outside charge that enters the surface must leave it again somewhere, because lines only end on charges and there is none inside. In counts negative, out counts positive, and they cancel exactly.'],
          draw(r, S) {
            const cx = 520, cy = 260;
            r.alpha(S.at(0, 0.8), () => {
              const pts = []; for (let i = 0; i <= 80; i++) { const t = (TAU * i) / 80, R = 120 + 18 * Math.sin(3 * t) + 10 * Math.cos(5 * t); pts.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]); }
              r.poly(pts, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.08, close: true });
              for (let i = 0; i < 8; i++) { const t = (TAU * i) / 8, R = 120 + 18 * Math.sin(3 * t) + 10 * Math.cos(5 * t), x = cx + R * Math.cos(t), y = cy + R * Math.sin(t); r.arrow(x, y, x + 34 * Math.cos(t), y + 34 * Math.sin(t), { c: C.green, w: 2, head: 8 }); }
            });
            const a = S.at(2, 0.8); if (a > 0) {
              charge(r, 180, 260, 1, { a });
              for (let k = -3; k <= 3; k++) { const ang = k * 0.13; r.arrow(200, 260 + k * 4, 860, 260 + k * 4 + 620 * Math.tan(ang), { c: C.yellow, w: 1.8, head: 8, a: a * 0.85 }); }
            }
            K.txt(r, S, 1, 'net flux = lines out − lines in', 520, 440, { size: 22, align: 'center', c: C.yellow, out: 2 });
            K.tex(r, S, 3, T`\Phi_{\text{net}} = 0\quad(\text{no charge inside})`, 520, 440, { size: 30, c: C.green });
          } }
      ]],
      ['Gauss\'s law', [
        { say: ['Now put a charge q at the centre of a sphere of radius r and calculate the flux exactly.',
                'On the sphere the field has the same size everywhere, k q over r squared, and it points straight out, along the normal. So E dot d A is just E d A, and the flux is E times the whole area.',
                'That is k q over r squared, times four pi r squared. The r squared cancels. Using k equals one over four pi epsilon nought, the four pi cancels too, and the flux is q over epsilon nought.',
                'The radius has disappeared. Every sphere around the charge, large or small, catches the same flux, because it catches the same lines. And since lines only begin and end on charges, the shape of the surface does not matter either.',
                'That is Gauss\'s law. The total electric flux out of any closed surface equals the total charge enclosed, divided by epsilon nought. Charges outside contribute nothing, however close they are.'],
          draw(r, S) {
            const cx = 270, cy = 260, R = 120 + (S.t > S.B[3] ? 50 * Math.sin(0.9 * (S.t - S.B[3])) : 0);
            charge(r, cx, cy, 1, { a: S.at(0, 0.8) });
            radial(r, cx, cy, 16, 22, 210, { a: S.at(0, 0.8) * 0.75, w: 1.6 });
            r.circle(cx, cy, R, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.06, a: S.at(0, 0.8, 0.4) });
            K.calc(r, S, 1, 500, 110, [T`\Phi = E\cdot 4\pi r^{2}`, T`= \frac{q}{4\pi\varepsilon_0 r^{2}}\cdot 4\pi r^{2} = \frac{q}{\varepsilon_0}`], { ks: [1, 2], dy: 84, size: 32 });
            const a = S.at(4, 0.7); if (a > 0) { r.rr(470, 315, 440, 100, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 4, T`\oint \vec{E}\cdot d\vec{A} = \frac{Q_{\text{enc}}}{\varepsilon_0}`, 690, 365, { size: 38, c: C.yellow, dl: 0.2 }); }
          } },
        { say: ['Gauss\'s law is always true, but it is only useful for calculating fields when there is enough symmetry to know the direction of the field, and to know that its size is constant over the surface you choose.',
                'Then the recipe has three steps. One: use symmetry to decide the direction of E. Two: choose a closed surface, a Gaussian surface, on which E is either constant and perpendicular, or parallel so that it contributes nothing. Three: set E times area equal to the enclosed charge over epsilon nought, and solve.',
                'There are three symmetries that cover almost every exam question: spherical, cylindrical, and planar. Let us do each one.'],
          draw(r, S) {
            K.list(r, S, [1, 1, 1], ['1. symmetry ⇒ direction of E', '2. Gaussian surface: E constant and ⊥, or parallel (no flux)', '3. E × area = Q_enc / ε₀ ⇒ solve'], 150, 140, { dy: 64, size: 24 });
            const a = S.at(2, 0.8); if (a > 0) {
              r.alpha(a, () => {
                r.circle(220, 400, 40, { c: C.blue, w: 2, fill: C.blue, fa: 0.12 }); r.txt('sphere', 220, 462, { size: 16, sans: true, c: C.dim, align: 'center' });
                ell(r, 480, 370, 26, 9, { c: C.blue }); ell(r, 480, 430, 26, 9, { c: C.blue }); r.line(454, 370, 454, 430, { c: C.blue, w: 2 }); r.line(506, 370, 506, 430, { c: C.blue, w: 2 }); r.txt('cylinder', 480, 462, { size: 16, sans: true, c: C.dim, align: 'center' });
                r.rr(700, 375, 80, 50, 6, { c: C.blue, w: 2, fill: C.blue, fa: 0.12 }); r.txt('pillbox', 740, 462, { size: 16, sans: true, c: C.dim, align: 'center' });
              });
            }
          } }
      ]],
      ['Two traps', [
        { say: [['Pause and think. A thin spherical shell carries charge spread evenly over its surface. What is the field inside it?', 4],
                'Zero, everywhere inside. A Gaussian sphere drawn inside the shell encloses no charge, and by symmetry the field on it would have to be the same everywhere and radial. Zero flux with a constant radial field means the field itself is zero.',
                'Two traps catch students here. First, the E in Gauss\'s law is the total field, made by every charge in the universe, inside the surface or not. Only the flux is decided by the enclosed charge. Outside charges change the field at each point, but their lines enter and leave, so they add nothing to the total flux.',
                'Second, Gauss\'s law is true for a cube of charge, or any lumpy shape, but it does not hand you the field. Without symmetry you cannot pull E out of the integral, because you do not know that it is constant on the surface. Then you go back to Coulomb\'s law, and add up the contributions.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Field inside a uniformly charged shell?'], { y: 80 });
            const cx = 480, cy = 300, a = S.at(1, 0.8);
            if (a > 0) { r.circle(cx, cy, 120, { c: C.red, w: 3, a }); for (let i = 0; i < 24; i++) { const t = (TAU * i) / 24; r.txt('+', cx + 132 * Math.cos(t), cy + 132 * Math.sin(t), { size: 14, sans: true, c: C.red, align: 'center', a }); } r.circle(cx, cy, 70, { c: C.blue, w: 2, dash: [6, 5], a }); r.txt('E = 0', cx, cy, { size: 22, sans: true, c: C.green, align: 'center', a }); }
            K.txt(r, S, 2, 'E: from all charges;  flux: only from enclosed ones', 480, 470 - 20, { size: 20, align: 'center', c: C.yellow, out: 3 });
            K.txt(r, S, 3, 'no symmetry ⇒ Gauss is true but cannot be solved for E', 480, 450, { size: 20, align: 'center', c: C.yellow });
          } }
      ]],
      ['Spherical symmetry', [
        { say: ['First, a sphere of radius R with total charge Q spread uniformly through its volume. By symmetry, the field must point radially, and depend only on the distance r from the centre.',
                'Outside, take a Gaussian sphere of radius r larger than R. It encloses all the charge, so E times four pi r squared equals Q over epsilon nought. The field is k Q over r squared: exactly as if all the charge sat at the centre.',
                'This is why Newton could treat the Earth as a point when working out the Moon\'s orbit. Gravity obeys the same inverse-square law, so Gauss\'s law works for it too.',
                'Inside, at radius r less than R, the Gaussian sphere encloses only the fraction r cubed over R cubed of the charge. Then E times four pi r squared equals Q r cubed over R cubed, over epsilon nought, and the field is k Q r over R cubed: it grows in proportion to r, from zero at the centre.',
                'Plot it. The field rises linearly inside, peaks at the surface, and falls as one over r squared outside. Where the two formulas meet, at r equals R, they agree, as they must.'],
          draw(r, S) {
            const cx = 220, cy = 250, R = 90;
            r.alpha(S.at(0, 0.8), () => { r.circle(cx, cy, R, { c: C.red, w: 2, fill: C.red, fa: 0.22 }); for (let i = 0; i < 26; i++) { const t = i * 2.4, q = Math.sqrt((i + 0.5) / 26) * (R - 10); r.txt('+', cx + q * Math.cos(t), cy + q * Math.sin(t), { size: 14, align: 'center', c: C.red, sans: true }); } });
            const a1 = S.at(1, 0.7); if (a1 > 0) r.circle(cx, cy, 150, { c: C.blue, w: 2.5, dash: [7, 5], a: a1 * (1 - S.at(3, 0.5)) });
            const a3 = S.at(3, 0.7); if (a3 > 0) r.circle(cx, cy, 55, { c: C.green, w: 2.5, dash: [7, 5], a: a3 });
            K.tex(r, S, 1, T`r > R:\ \ E = \frac{kQ}{r^{2}}`, 650, 90, { size: 30, c: C.blue });
            K.tex(r, S, 3, T`r < R:\ \ E = \frac{kQ\,r}{R^{3}}`, 650, 160, { size: 30, c: C.green });
            const a4 = S.at(4, 0.7); if (a4 > 0) {
              const A = K.axes(r, { x0: 470, y0: 440, w: 420, h: 220, xr: [0, 4], yr: [0, 1.15], xl: 'r/R', yl: 'E' });
              r.alpha(a4, () => A.draw(1)); K.plot(r, A, (x) => x, 0, 1, S.at(4, 0.8), { c: C.green }); K.plot(r, A, (x) => 1 / (x * x), 1, 4, S.at(4, 1.2, 0.6), { c: C.blue });
            }
          } },
        { say: ['A worked example. A metal sphere of radius 5.0 centimetres carries a charge of 10 nanocoulombs. What is the field at its surface, and at 10 centimetres from the centre?',
                'At the surface, E is k Q over R squared: nine times ten to the nine, times ten to the minus eight, over 0.05 squared. That is 3.6 times ten to the four volts per metre.',
                'At 10 centimetres, twice the distance, the field is a quarter of that: 9.0 times ten to the three volts per metre.',
                'Is that a lot? Dry air breaks down and sparks at about three million volts per metre. This sphere is a hundred times below that. To make a spark at the surface you would need a hundred times more charge, which is roughly what a Van de Graaff generator manages to collect.'],
          draw(r, S) {
            K.tex(r, S, 0, T`R = 5.0\ \text{cm},\quad Q = 10\ \text{nC}`, 480, 80, { size: 30, dl: 0.4 });
            K.calc(r, S, 1, 110, 170, [T`E(R) = \frac{(8.99\times10^{9})(1.0\times10^{-8})}{(0.050)^{2}} = 3.6\times10^{4}\ \text{V m}^{-1}`, T`E(2R) = \tfrac14 E(R) = 9.0\times10^{3}\ \text{V m}^{-1}`, T`E_{\text{breakdown}} \approx 3\times10^{6}\ \text{V m}^{-1} \approx 100\,E(R)`], { ks: [1, 2, 3], dy: 84, size: 28 });
          } }
      ]],
      ['Cylindrical symmetry', [
        { say: ['Second symmetry: a long straight wire carrying charge lambda per metre. The field must point straight away from the wire, and depend only on the distance r.',
                'Choose a Gaussian cylinder of radius r and length L around the wire. On its curved side, the field is perpendicular to the surface and constant. On its flat ends, the field runs parallel to the surface, so no flux passes through them.',
                'So the flux is E times the curved area, two pi r L. The enclosed charge is lambda L. Setting them equal, the L cancels, and E equals lambda over two pi epsilon nought r.',
                'Notice the power of r: one over r, not one over r squared. Lines from a line charge spread out in two dimensions only, over a cylinder, so they thin out more slowly. The dimension of the spreading sets the power law.'],
          draw(r, S) {
            const cx = 300, y0 = 90, y1 = 420;
            r.alpha(S.at(0, 0.8), () => { r.line(cx, y0 - 30, cx, y1 + 30, { c: C.red, w: 6 }); for (let k = 0; k < 9; k++) r.txt('+', cx + 12, y0 + k * 40, { size: 14, sans: true, c: C.red }); for (let k = 0; k < 6; k++) { const y = y0 + 30 + k * 60; r.arrow(cx + 6, y, cx + 150, y, { c: C.yellow, w: 1.8, head: 8 }); r.arrow(cx - 6, y, cx - 150, y, { c: C.yellow, w: 1.8, head: 8 }); } });
            const a1 = S.at(1, 0.7); if (a1 > 0) { ell(r, cx, 150, 100, 26, { c: C.blue, a: a1 }); ell(r, cx, 360, 100, 26, { c: C.blue, a: a1, dash: [6, 5] }); r.line(cx - 100, 150, cx - 100, 360, { c: C.blue, w: 2, a: a1 }); r.line(cx + 100, 150, cx + 100, 360, { c: C.blue, w: 2, a: a1 }); r.brace(cx + 120, 150, cx + 120, 360, { side: -1, c: C.blue, tex: 'L', size: 22, a: a1 }); }
            K.calc(r, S, 2, 520, 140, [T`E\cdot 2\pi r L = \frac{\lambda L}{\varepsilon_0}`, T`E = \frac{\lambda}{2\pi\varepsilon_0 r}`], { ks: [2, 2], dy: 90, size: 34, box: true, dl: 0 });
            K.txt(r, S, 3, 'line: spreads in 2D ⇒ 1/r;  point: 3D ⇒ 1/r²', 700, 400, { size: 20, align: 'center', c: C.greyB });
          } },
        { say: ['Numbers again. A long wire carries five nanocoulombs per metre. What is the field two centimetres away?',
                'E equals five times ten to the minus nine, over two pi, times 8.85 times ten to the minus twelve, times 0.02. The denominator is 1.11 times ten to the minus twelve, so E is about 4.5 times ten to the three volts per metre.',
                'Move to four centimetres and the field halves, to 2.2 kilovolts per metre. For a point charge it would have fallen to a quarter. That difference is a quick way to check, in an experiment, what shape of charge you are dealing with.'],
          draw(r, S) {
            K.calc(r, S, 0, 110, 120, [T`\lambda = 5.0\ \text{nC m}^{-1},\ r = 0.020\ \text{m}`, T`E = \frac{5.0\times10^{-9}}{2\pi(8.85\times10^{-12})(0.020)} = 4.5\times10^{3}\ \text{V m}^{-1}`, T`r\to 2r:\ \ E \to E/2 = 2.2\times10^{3}\ \text{V m}^{-1}`], { ks: [0, 1, 2], dy: 92, size: 30 });
          } }
      ]],
      ['Planar symmetry and the capacitor', [
        { say: ['Third symmetry: a large flat sheet with charge sigma per square metre. The field must point straight away from the sheet on both sides.',
                'Use a pillbox: a short cylinder that pokes through the sheet, with flat faces of area A on either side. Flux leaves through both flat faces, and none through the curved side, which is parallel to the field.',
                'So E times two A equals sigma A over epsilon nought, and E equals sigma over two epsilon nought.',
                'Look at what is missing: the distance. The field of an infinite sheet does not weaken as you move away. The lines are parallel and never spread out at all. That matches our rule: spreading in no dimensions gives no fall-off.'],
          draw(r, S) {
            const sx = 300;
            r.alpha(S.at(0, 0.8), () => { r.line(sx, 60, sx, 440, { c: C.red, w: 6 }); for (let k = 0; k < 10; k++) r.txt('+', sx + 10, 75 + k * 38, { size: 14, sans: true, c: C.red }); for (let k = 0; k < 7; k++) { const y = 90 + k * 50; r.arrow(sx + 8, y, sx + 150, y, { c: C.yellow, w: 1.8, head: 8 }); r.arrow(sx - 8, y, sx - 150, y, { c: C.yellow, w: 1.8, head: 8 }); } });
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.rr(sx - 80, 210, 160, 80, 6, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.1, a: a1 }); r.tex('A', sx - 100, 250, { size: 22, c: C.blue, a: a1 }); r.tex('A', sx + 100, 250, { size: 22, c: C.blue, a: a1 }); }
            K.calc(r, S, 2, 560, 170, [T`E\cdot 2A = \frac{\sigma A}{\varepsilon_0}`, T`E = \frac{\sigma}{2\varepsilon_0}`], { ks: [2, 2], dy: 90, size: 34, box: true });
            K.txt(r, S, 3, 'independent of distance', 700, 400, { size: 22, align: 'center', c: C.green });
          } },
        { say: ['Now put two sheets side by side, one positive and one negative: a parallel-plate capacitor. Between the plates, the fields of the two sheets point the same way and add. Outside, they point opposite ways and cancel.',
                'So the field is sigma over epsilon nought between the plates, and zero outside. Write sigma as Q over A, and the voltage across the gap d is E d, which is Q d over epsilon nought A.',
                'Capacitance is charge per volt: C equals epsilon nought A over d. Plates ten centimetres square, one millimetre apart, give 8.85 times ten to the minus twelve, times 0.01, over 0.001: 88.5 picofarads.',
                'That is tiny, which is why real capacitors roll up long thin foils very close together, and fill the gap with a material that multiplies the capacitance by its dielectric constant.'],
          draw(r, S) {
            const x1 = 260, x2 = 420;
            r.alpha(S.at(0, 0.8), () => {
              r.line(x1, 90, x1, 400, { c: C.red, w: 6 }); r.line(x2, 90, x2, 400, { c: C.blue, w: 6 });
              for (let k = 0; k < 7; k++) { const y = 110 + k * 45; r.arrow(x1 + 8, y, x2 - 10, y, { c: C.yellow, w: 2, head: 9 }); }
              r.txt('E = 0', 160, 250, { size: 18, sans: true, c: C.dim, align: 'center' }); r.txt('E = 0', 520, 250, { size: 18, sans: true, c: C.dim, align: 'center' });
              r.brace(x1, 420, x2, 420, { side: -1, c: C.greyB, tex: 'd', size: 22 });
            });
            K.calc(r, S, 1, 590, 110, [T`E = \frac{\sigma}{\varepsilon_0} = \frac{Q}{\varepsilon_0 A}`, T`V = Ed = \frac{Qd}{\varepsilon_0 A}`, T`C = \frac{Q}{V} = \frac{\varepsilon_0 A}{d}`], { ks: [1, 1, 2], dy: 84, size: 30, box: true });
            K.tex(r, S, 2, T`= \frac{(8.85\times10^{-12})(0.010)}{0.0010} = 88.5\ \text{pF}`, 650, 400, { size: 24, c: C.green, dl: 1.5 });
          } }
      ]],
      ['Voltage, and gravity\'s version', [
        { say: ['From the field we can get the voltage. Outside a charged sphere, the potential is k Q over r, and the field is minus its derivative: minus d V by d r gives back k Q over r squared.',
                'That sets a limit on a Van de Graaff generator. At the surface, V equals E R. If the dome has a radius of 20 centimetres and the air breaks down at three million volts per metre, the highest voltage it can reach is about 600 kilovolts.',
                'The charge at that point is E R squared over k: three times ten to the six, times 0.04, over nine times ten to the nine, which is 13 microcoulombs. A bigger dome holds more voltage, which is why the largest machines are housed in pressurised tanks with enormous domes.'],
          draw(r, S) {
            K.tex(r, S, 0, T`V = \frac{kQ}{r},\qquad E = -\frac{dV}{dr} = \frac{kQ}{r^{2}}`, 480, 80, { size: 32 });
            const a = S.at(1, 0.8); if (a > 0) { r.alpha(a, () => { r.circle(210, 230, 80, { c: C.greyB, w: 3, fill: C.greyB, fa: 0.15 }); r.rect(196, 310, 28, 120, { c: C.greyB, w: 2 }); r.line(150, 430, 270, 430, { c: C.greyB, w: 4 }); for (let i = 0; i < 9; i++) { const t = -Math.PI * 0.9 + i * 0.22; r.line(210 + 82 * Math.cos(t), 230 + 82 * Math.sin(t), 210 + 120 * Math.cos(t), 230 + 120 * Math.sin(t), { c: C.yellow, w: 1.5 }); } }); }
            K.calc(r, S, 1, 400, 190, [T`V_{\max} = E_{\text{bd}}R = (3\times10^{6})(0.20) = 6\times10^{5}\ \text{V}`, T`Q_{\max} = \frac{E_{\text{bd}}R^{2}}{k} = \frac{(3\times10^{6})(0.04)}{8.99\times10^{9}} = 13\ \mu\text{C}`], { ks: [1, 2], dy: 100, size: 26 });
          } },
        { say: ['Everything in this lecture works for gravity too, because gravity is also an inverse-square force. Gauss\'s law for gravity says the flux of the gravitational field through a closed surface is minus four pi G times the enclosed mass.',
                'So inside a uniform planet, the field falls in proportion to r, just like the charged ball: g of r equals g at the surface times r over R.',
                'Here is a famous consequence. Drill a straight tunnel through the centre of the Earth and jump in. The force on you is proportional to your distance from the centre, and points back towards it. That is simple harmonic motion.',
                ['The period is two pi root R over g: with R equal to 6.37 million metres and g equal to 9.81, it is 5,060 seconds, about 84 minutes. You would pop out on the other side of the world 42 minutes after jumping in, ignoring air resistance, rotation, and the fact that the real Earth is denser in the middle.', 3]],
          draw(r, S) {
            const cx = 260, cy = 260, R = 170;
            r.alpha(S.at(0, 0.8), () => { r.circle(cx, cy, R, { c: C.blue, w: 2, fill: C.blue, fa: 0.15 }); r.circle(cx, cy, R * 0.55, { c: C.gold, w: 1.5, fill: C.gold, fa: 0.12 }); });
            K.tex(r, S, 0, T`\oint \vec{g}\cdot d\vec{A} = -4\pi G M_{\text{enc}}`, 690, 80, { size: 28 });
            K.tex(r, S, 1, T`g(r) = g\,\frac{r}{R}`, 690, 160, { size: 30, c: C.blue });
            const a = S.at(2, 0.7); if (a > 0) { r.line(cx, cy - R, cx, cy + R, { c: C.greyB, w: 3, dash: [6, 5], a }); const y = cy - R * 0.92 * Math.cos(1.2 * Math.max(0, S.t - S.B[2])); r.dot(cx, y, { r: 8, c: C.yellow, a }); r.arrow(cx + 16, y, cx + 16, y + (cy - y) * 0.5, { c: C.red, w: 2.5, head: 9, a: a * (Math.abs(cy - y) > 20 ? 1 : 0) }); }
            K.tex(r, S, 2, T`\ddot{r} = -\frac{g}{R}\,r`, 690, 240, { size: 30, c: C.yellow });
            K.tex(r, S, 3, T`T = 2\pi\sqrt{\frac{R}{g}} = 2\pi\sqrt{\frac{6.37\times10^{6}}{9.81}} \approx 84\ \text{min}`, 690, 340, { size: 26, c: C.green });
          } }
      ]],
      ['Conductors', [
        { say: ['Gauss\'s law also explains a striking fact about metals. In a conductor, charges are free to move. If there were any field inside, they would move until the field was gone. So, once everything settles, the field inside a conductor is zero.',
                'Draw a Gaussian surface just inside the metal. The field on it is zero, so the flux is zero, so the enclosed charge is zero. Any extra charge on a conductor must sit on its outer surface.',
                'And a hollow conductor shields its inside from outside fields. This is the Faraday cage: the reason you are safe in a car struck by lightning, and the reason your phone loses signal in a lift. The charges on the outer skin rearrange themselves, in a fraction of a nanosecond, so that their field exactly cancels the outside field everywhere within.',
                'Just outside a conductor, a tiny pillbox shows that the field is sigma over epsilon nought, pointing straight out of the surface. Charge crowds onto sharp points, which is why lightning rods are pointed and why sparks jump from the tips of things.'],
          draw(r, S) {
            const cx = 320, cy = 250;
            r.alpha(S.at(0, 0.8), () => {
              const pts = []; for (let i = 0; i <= 90; i++) { const t = (TAU * i) / 90, R = 130 + 20 * Math.cos(2 * t); pts.push([cx + R * Math.cos(t), cy + 0.8 * R * Math.sin(t)]); }
              r.poly(pts, { c: C.greyB, w: 3, fill: C.greyB, fa: 0.12, close: true });
              r.txt('E = 0 inside', cx, cy, { size: 20, sans: true, c: C.green, align: 'center' });
            });
            const a1 = S.at(1, 0.7); if (a1 > 0) for (let i = 0; i < 28; i++) { const t = (TAU * i) / 28, R = 143 + 20 * Math.cos(2 * t); r.txt('+', cx + R * Math.cos(t), cy + 0.8 * R * Math.sin(t), { size: 15, sans: true, c: C.red, align: 'center', a: a1 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) for (let k = 0; k < 6; k++) { const y = 120 + k * 52; r.arrow(560, y, 900, y, { c: C.yellow, w: 1.6, head: 8, a: a2 * 0.8 }); }
            K.tex(r, S, 3, T`E_{\text{surface}} = \frac{\sigma}{\varepsilon_0}`, 760, 440, { size: 30, c: C.yellow });
          } }
      ]],
      ['Gauss\'s law at a point: divergence', [
        { say: ['Gauss\'s law in integral form talks about whole surfaces. Shrink the surface down around a single point, and divide the flux by the volume enclosed. The limit is called the divergence of the field.',
                'Divergence measures how much a field spreads out from a point, like water flowing out of a source. Where it is positive, field lines are being born; where it is negative, they are dying; where it is zero, they only pass through.',
                'Gauss\'s law then becomes a statement about each point: the divergence of E equals the charge density rho, over epsilon nought. Field lines are born only where there is charge.',
                ['In empty space the divergence is zero. That is the local version of what we saw at the start: lines that are neither created nor destroyed, spreading out over spheres, give the inverse-square law.', 3]],
          draw(r, S) {
            const src = (x, y) => { const dx = x - 300, dy = y - 260, d2 = dx * dx + dy * dy + 600; return [dx / d2 * 900, dy / d2 * 900]; };
            const pass = (x, y) => [70, 18 * Math.sin((y - 260) / 60)];
            r.alpha(S.at(0, 0.8), () => r.flow('gsrc', src, { x0: 80, x1: 520, y0: 60, y1: 460, n: 160, life: 2.5, max: 90, w: 1.8 }));
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.alpha(a1, () => r.flow('gpass', pass, { x0: 560, x1: 900, y0: 80, y1: 440, n: 110, life: 3, max: 90, w: 1.8 })); r.txt('div = 0: lines only pass through', 730, 455, { size: 15, sans: true, c: C.dim, align: 'center', a: a1 }); r.txt('div > 0: a source', 300, 470 - 14, { size: 15, sans: true, c: C.dim, align: 'center', a: a1 }); }
            K.tex(r, S, 0, T`\nabla\cdot\vec{E} = \lim_{V\to0}\frac{1}{V}\oint\vec{E}\cdot d\vec{A}`, 480, 50, { size: 26, out: 2 });
            const a2 = S.at(2, 0.7); if (a2 > 0) { r.rr(330, 20, 300, 64, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a2 }); K.tex(r, S, 2, T`\nabla\cdot\vec{E} = \frac{\rho}{\varepsilon_0}`, 480, 52, { size: 32, c: C.yellow, dl: 0.2 }); }
          } }
      ]],
      ['How sure are we?', [
        { say: ['Every result in this lecture rested on one assumption: that the force falls exactly as one over r squared. If it fell as one over r to the power two plus a tiny number, field lines would leak, and Gauss\'s law would fail.',
                'So physicists test it directly, using the conductor result. If the inverse-square law holds exactly, there is no field inside a charged hollow conductor. Charge an outer shell to high voltage and look for any charge appearing on an inner shell.',
                'Henry Cavendish did this in the 1770s and limited the deviation to about two percent. In 1971, Williams, Faller and Hill pushed it to a few parts in ten to the sixteen. Few laws in physics are tested so precisely.',
                'There is a deeper reason it matters. An exact inverse-square law means the photon, the carrier of the electric force, has zero mass. A massive photon would make the force die away exponentially at large distances. The null result inside a metal shell is, in disguise, a measurement of the photon\'s mass.'],
          draw(r, S) {
            const cx = 280, cy = 255;
            r.alpha(S.at(1, 0.8), () => { r.circle(cx, cy, 160, { c: C.greyB, w: 4 }); r.circle(cx, cy, 90, { c: C.greyB, w: 3 }); for (let i = 0; i < 20; i++) { const t = (TAU * i) / 20; r.txt('+', cx + 175 * Math.cos(t), cy + 175 * Math.sin(t), { size: 15, sans: true, c: C.red, align: 'center' }); } r.txt('inner shell: any charge?', cx, cy, { size: 16, sans: true, c: C.green, align: 'center' }); });
            K.tex(r, S, 0, T`F \propto \frac{1}{r^{2+q}}\ \ ?`, 680, 90, { size: 34 });
            K.tex(r, S, 2, T`\text{Cavendish (1773)}:\ |q| < 0.02`, 680, 200, { size: 26, c: C.blue });
            K.tex(r, S, 2, T`\text{Williams et al. (1971)}:\ |q| \lesssim 3\times10^{-16}`, 680, 260, { size: 26, c: C.green, dl: 1.8 });
            K.tex(r, S, 3, T`m_{\gamma} = 0 \;\Leftrightarrow\; \text{exact } 1/r^{2}`, 680, 370, { size: 30, c: C.yellow });
          } },
        { say: ['Let us collect what we found.',
                'Electric flux counts field lines through a surface: E dot A, or the integral of E dot d A for a curved surface.',
                'Gauss\'s law: the flux out of any closed surface is the enclosed charge over epsilon nought. Outside charges contribute nothing.',
                'With symmetry it gives fields in one line: k Q over r squared outside a sphere, lambda over two pi epsilon nought r for a line, sigma over two epsilon nought for a sheet, and sigma over epsilon nought between capacitor plates.',
                'Inside a conductor the field is zero and extra charge sits on the surface; the local form is divergence of E equals rho over epsilon nought.',
                'And it all rests on the exact inverse-square law, which has been tested to a few parts in ten to the sixteen.',
                'Walter Lewin\'s MIT lectures on electricity and magnetism show these ideas with spectacular demonstrations, and 3Blue1Brown\'s video on divergence and curl is the perfect next step. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['flux Φ = ∫ E · dA counts field lines', '∮ E · dA = Q_enc / ε₀; outside charges add nothing', 'sphere kQ/r²,  line λ/2πε₀r,  sheet σ/2ε₀,  capacitor σ/ε₀', 'conductor: E = 0 inside, charge on the surface; ∇·E = ρ/ε₀', 'all of it rests on an exact 1/r² law (tested to 10⁻¹⁶)'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Special relativity (Year 1). References: MIT OCW 8.20 (Markus Klute, IAP 2021). */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  const gam = (b) => 1 / Math.sqrt(1 - b * b);
  // a light clock: two mirrors, height h, centred at x, base y; photon at fraction f of the way up (0..1..0)
  const clock = (r, x, y, h, ph, o = {}) => { const a = o.a; r.line(x - 34, y, x + 34, y, { c: C.greyB, w: 4, a }); r.line(x - 34, y - h, x + 34, y - h, { c: C.greyB, w: 4, a }); r.line(x - 34, y, x - 34, y - h, { c: C.greyD, w: 1.2, a }); r.line(x + 34, y, x + 34, y - h, { c: C.greyD, w: 1.2, a }); const f = ph % 2 < 1 ? ph % 2 : 2 - (ph % 2); r.glow(x, y - f * h, 18, C.yellow, 0.6 * (a == null ? 1 : a)); r.dot(x, y - f * h, { r: 5, c: C.yellow, a }); };

  L.def({
    id: 'relativity', order: 6, title: 'Special relativity', sub: 'Two simple postulates, and why they force time to stretch, lengths to shrink, and E = mc²',
    level: 'Year 1', topics: ['y1-sr', 'y1-rel-dynamics'], thumb: [3, 22],
    refs: [
      ['MIT OCW 8.20 (Markus Klute)', 'Introduction to Special Relativity: video lectures', 'https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2021/pages/video-lectures/'],
      ['MIT OCW 8.20', 'Syllabus and reading list (French; Resnick)', 'https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2021/pages/syllabus/']
    ],
    chapters: [
      ['Two postulates', [
        { say: ['In 1905, a patent clerk named Albert Einstein took two statements that each seemed obviously true, and showed that together they overturn our ideas of time and space. This lecture follows his argument, with real numbers and real experiments.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Special relativity', 'Time, space, and E = mc²', { y: 200 });
            const a = S.in(1.6, 1.2); if (a > 0) clock(r, 480, 440, 80, 1.4 * S.w, { a });
          } },
        { say: ['The first postulate is the principle of relativity: the laws of physics are the same in every frame that moves at constant velocity. Galileo noticed it first: below deck in a smoothly sailing ship, no experiment can tell you whether the ship is moving or moored.',
                'Drop a ball in a train moving steadily, and it falls straight down, relative to you, exactly as it would on the platform. There is no absolute rest, only motion relative to something else.',
                'The second postulate is stranger: the speed of light in a vacuum is the same for every such observer, whatever their speed, and whatever the speed of the source. It is always 3.00 times ten to the eight metres per second.',
                'Maxwell\'s equations already said so: they give light a speed of one over root mu nought epsilon nought, with no mention of who is measuring it. And in 1887 Michelson and Morley tried very hard to detect the Earth\'s motion through space using light, and found nothing.',
                'Read the postulate carefully, because it is easy to over-read. It is about light in a vacuum, measured by observers who are not accelerating. In glass or water light really is slower, and an accelerating rocket is not an inertial frame. Those limits will matter later.'],
          draw(r, S) {
            const x = 200 + ((S.w * 70) % 520);
            r.alpha(S.at(0, 0.8), () => {
              r.line(60, 300, 900, 300, { c: C.greyD, w: 2 });
              r.rr(x - 120, 170, 240, 120, 10, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.12 });
              const yb = 190 + ((S.w * 60) % 90); r.circle(x, yb, 9, { c: C.yellow, fill: C.yellow, fa: 0.6 }); r.line(x, 190, x, 290, { c: C.yellow, w: 1, dash: [3, 5], a: 0.5 });
              r.arrow(x + 130, 230, x + 200, 230, { c: C.green, w: 3, head: 10 }); r.tex('v', x + 214, 230, { size: 22, c: C.green });
            });
            K.txt(r, S, 1, 'inside: the ball falls straight down', 480, 350, { size: 20, align: 'center', c: C.greyB });
            K.tex(r, S, 2, T`c = 2.998\times10^{8}\ \text{m s}^{-1}\ \text{for everyone}`, 480, 410, { size: 30, c: C.yellow, out: 3 });
            K.tex(r, S, 3, T`c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}\qquad\text{Michelson–Morley (1887): no ether wind}`, 480, 410, { size: 26, c: C.yellow });
          } },
        { say: [['Pause and think. You chase a light beam at half the speed of light. How fast does it move away from you?', 4],
                'Common sense says half the speed of light. The second postulate says the full speed of light, 3.00 times ten to the eight metres per second, exactly as for someone standing still. Both cannot be true with ordinary clocks and rulers. Einstein\'s answer was that the clocks and rulers are what must give way.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Chasing light at 0.5c: how fast does it recede?'], { y: 90 });
            const a = S.at(1, 0.8); if (a > 0) { r.alpha(a, () => { r.dot(300, 350, { r: 9, c: C.blue }); r.arrow(312, 350, 380, 350, { c: C.blue, w: 3, head: 10 }); r.txt('you: 0.5c', 300, 390, { size: 17, sans: true, c: C.blue, align: 'center' }); const lx = 420 + ((S.w * 160) % 420); r.glow(lx, 350, 20, C.yellow, 0.7); r.txt('light: still c, relative to you', 650, 300, { size: 17, sans: true, c: C.yellow, align: 'center' }); }); }
          } }
      ]],
      ['The light clock and time dilation', [
        { tail: 2.6, say: ['Build the simplest possible clock: two mirrors facing each other, a distance L apart, with a pulse of light bouncing between them. Each round trip is one tick, lasting two L over c.',
                'Now watch the same clock as it moves past you at speed v. Between the bottom mirror and the top one, the clock moves sideways, so the light travels along a diagonal. The diagonal is longer than L.',
                'Both observers agree the light moves at c. So in your frame, the light needs longer to cover the longer path. The moving clock ticks more slowly.',
                'Use Pythagoras on half a tick. In your frame it takes time delta t over two; the light covers c delta t over two along the diagonal, while the clock moves v delta t over two sideways, and the vertical side is L.',
                'Solve, and delta t equals two L over c, divided by the square root of one minus v squared over c squared. The moving clock\'s tick is longer by the factor gamma, one over root one minus v squared over c squared.'],
          draw(r, S) {
            const h = 150, a0 = S.at(0, 0.8);
            if (a0 > 0) clock(r, 150, 380, h, 1.2 * S.w, { a: a0 });
            const a1 = S.at(1, 0.8); if (a1 > 0) {
              const v = 95, per = 1.6, tt = Math.max(0, S.since(1)) % (2 * per * 2), x0 = 300, x = x0 + v * tt;
              r.alpha(a1, () => {
                const pts = []; for (let k = 0; k <= 4; k++) pts.push([x0 + v * per * k, k % 2 ? 380 - h : 380]);
                r.poly(pts, { c: C.yellow, w: 2, dash: [6, 5], a: 0.6 });
                clock(r, Math.min(x, 900), 380, h, tt / per, {});
              });
            }
            const a3 = S.at(3, 0.7); if (a3 > 0) { const X0 = 300, X1 = 300 + 95 * 1.6; r.poly([[X0, 380], [X1, 380], [X1, 380 - h]], { c: C.green, w: 2, a: a3 }); r.line(X0, 380, X1, 380 - h, { c: C.yellow, w: 3, a: a3 }); r.tex(T`\tfrac{c\Delta t}{2}`, (X0 + X1) / 2 - 30, 380 - h / 2 - 16, { size: 22, c: C.yellow, a: a3 }); r.tex(T`\tfrac{v\Delta t}{2}`, (X0 + X1) / 2, 404, { size: 22, c: C.green, a: a3 }); r.tex('L', X1 + 16, 380 - h / 2, { size: 22, c: C.green, a: a3 }); }
            K.tex(r, S, 0, T`\Delta t_0 = \frac{2L}{c}`, 150, 120, { size: 28 });
            K.tex(r, S, 3, T`\Big(\frac{c\Delta t}{2}\Big)^{2} = L^{2} + \Big(\frac{v\Delta t}{2}\Big)^{2}`, 690, 110, { size: 26, out: 4 });
            const a4 = S.at(4, 0.7); if (a4 > 0) { r.rr(520, 60, 380, 96, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a4 }); K.tex(r, S, 4, T`\Delta t = \gamma\,\Delta t_0,\ \ \gamma = \frac{1}{\sqrt{1 - v^{2}/c^{2}}}`, 710, 108, { size: 28, c: C.yellow, dl: 0.2 }); }
          } },
        { say: ['How big is gamma? At ordinary speeds it is so close to one that we never notice. Even at a tenth of the speed of light it is only 1.005.',
                'At half the speed of light, gamma is 1.155. At 0.9 c it is 2.29, and at 0.99 c it is 7.09. As v approaches c, gamma grows without limit.',
                'For a jet airliner at 250 metres per second, gamma minus one is about three times ten to the minus thirteen. A clock on the plane loses roughly a nanosecond per hour. Tiny, but in 1971 Hafele and Keating flew atomic clocks round the world and measured effects of roughly this size.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 100, y0: 430, w: 520, h: 340, xr: [0, 1], yr: [1, 8], xl: 'v/c', yl: 'γ', xt: [0, 1, 0.2], yt: [1, 8, 1] });
            A.draw(S.at(0, 0.8)); K.plot(r, A, gam, 0, 0.993, S.at(0, 2, 0.3), { n: 400 });
            [[0.1, 1.005], [0.5, 1.155], [0.9, 2.294], [0.99, 7.089]].forEach(([b, g], i) => { const q = S.at(i === 0 ? 0 : 1, 0.5, i === 0 ? 1.5 : i * 0.7); if (q > 0) { K.pin(r, ...A.pt(b, g), '', { c: C.green, a: q }); r.tex(T`${b}c:\ \gamma = ${g}`, 780, 120 + i * 56, { size: 26, c: C.green, a: q }); } });
            K.tex(r, S, 2, T`v = 250\ \text{m s}^{-1}:\ \gamma - 1 \approx \tfrac12\frac{v^{2}}{c^{2}} = 3.5\times10^{-13}`, 640, 400, { size: 22, c: C.blue });
          } }
      ]],
      ['The muon experiment', [
        { tail: 2.6, say: ['Here is time dilation measured in nature. Cosmic rays hit the top of the atmosphere and make muons: unstable particles that live, on average, 2.2 microseconds before decaying.',
                'They are made about fifteen kilometres up and move at about 0.998 times the speed of light. Without relativity, in 2.2 microseconds they travel 0.998 times c times 2.2 microseconds: just 660 metres. Almost none should reach the ground.',
                'But we detect plenty at sea level. At 0.998 c, gamma is 15.8, so in our frame the muon\'s clock runs 15.8 times slow, and its average lifetime is 35 microseconds. In that time it travels about 10.4 kilometres. A large fraction reaches the ground.',
                'In 1963, Frisch and Smith counted about 560 muons per hour at the top of Mount Washington, 1,900 metres up, and about 410 per hour at sea level. Without time dilation, only a few dozen would have survived the trip down. With it, the numbers agree.'],
          draw(r, S) {
            const top = 70, gnd = 430, a0 = S.at(0, 0.8);
            r.alpha(a0, () => { r.line(80, gnd, 520, gnd, { c: C.green, w: 3 }); r.txt('sea level', 90, gnd + 22, { size: 15, sans: true, c: C.dim }); r.line(80, top, 520, top, { c: C.blueA, w: 1.5, dash: [6, 5] }); r.txt('≈ 15 km: muons made', 90, top - 16, { size: 15, sans: true, c: C.dim }); });
            const a1 = S.at(1, 0.6); if (a1 > 0) { const yN = top + (gnd - top) * (0.66 / 15); r.line(140, top, 140, yN, { c: C.red, w: 5, a: a1 }); r.txt('no dilation: 0.66 km', 152, yN, { size: 15, sans: true, c: C.red, a: a1 }); }
            const a2 = S.at(2, 0.6); if (a2 > 0) { const yR = top + (gnd - top) * (10.4 / 15); r.line(300, top, 300, yR, { c: C.yellow, w: 5, a: a2 }); r.txt('γ = 15.8: 10.4 km', 312, yR, { size: 15, sans: true, c: C.yellow, a: a2 }); for (let k = 0; k < 6; k++) { const y = top + ((S.w * 120 + k * 61) % (gnd - top)); r.dot(400 + k * 18, y, { r: 4, c: C.yellow, a: a2 }); } }
            K.calc(r, S, 1, 570, 120, [T`(0.998c)(2.2\,\mu\text{s}) = 660\ \text{m}`, T`\gamma(0.998) = 15.8:\ \ \tau = 35\,\mu\text{s},\ \ 10.4\ \text{km}`], { ks: [1, 2], dy: 82, size: 24 });
            K.tex(r, S, 3, T`\text{top: } 560\ \text{h}^{-1}\quad \text{sea level: } 410\ \text{h}^{-1}`, 720, 350, { size: 26, c: C.green });
          } },
        { tail: 2.6, say: ['Now look at the same muon from its own point of view. In its frame, it is at rest and lives the usual 2.2 microseconds. How can it possibly reach the ground?',
                'Because in its frame, the atmosphere is rushing past at 0.998 c, and a moving length is contracted by the factor gamma. The fifteen kilometres of air become fifteen over 15.8: about 950 metres. With 660 metres of average travel, about a quarter of muons survive that far.',
                'Two frames, two explanations: time dilation for us, length contraction for the muon. But the same number of muons reaches the detector. Relativity never disagrees about events, only about how to divide the gap between them into space and time.'],
          draw(r, S) {
            K.tex(r, S, 1, T`L = \frac{L_0}{\gamma} = \frac{15\ \text{km}}{15.8} = 0.95\ \text{km}`, 480, 90, { size: 32, c: C.blue });
            const a = S.at(0, 0.8); if (a > 0) { r.alpha(a, () => { r.dot(240, 270, { r: 9, c: C.yellow }); r.txt('muon at rest', 240, 300, { size: 15, sans: true, c: C.yellow, align: 'center' }); const len = lerp(560, 560 / 15.8 * 3, S.at(1, 2)); r.rect(360, 230, len, 80, { c: C.blueA, w: 2, fill: C.blue, fa: 0.2 }); r.arrow(360 + len / 2 + 30, 340, 360 + len / 2 - 40, 340, { c: C.blueA, w: 2.5, head: 9 }); r.txt('the atmosphere, moving at 0.998c', 360 + len / 2, 370, { size: 15, sans: true, c: C.blueA, align: 'center' }); }); }
            K.txt(r, S, 2, 'time dilation (our frame) ↔ length contraction (muon frame)', 480, 440, { size: 20, align: 'center', c: C.green });
          } }
        ,{ say: ['An exam-style example from a particle accelerator. Charged pions live 26 nanoseconds on average, at rest. A beam of them moves at 0.95 c. How far does a typical pion travel before it decays?',
                'Gamma at 0.95 c is one over the square root of one minus 0.9025: 3.20. In the lab, the lifetime is 3.20 times 26 nanoseconds: 83 nanoseconds.',
                'The distance is 0.95 times c times 83 nanoseconds: 23.7 metres. Without time dilation you would predict only 7.4 metres. Accelerator physicists design their beam lines with gamma built in; if it were wrong, the particles would never arrive.'],
          draw(r, S) {
            K.calc(r, S, 0, 100, 110, [T`\tau_0 = 26\ \text{ns},\ \ v = 0.95c`, T`\gamma = \frac{1}{\sqrt{1 - 0.9025}} = 3.20,\ \ \tau = 83\ \text{ns}`, T`d = (0.95c)(83\ \text{ns}) = 23.7\ \text{m}\quad(\text{not } 7.4\ \text{m})`], { ks: [0, 1, 2], dy: 84, size: 28, box: true });
            const a = S.at(2, 0.6); if (a > 0) { r.line(100, 420, 100 + 23.7 * 30, 420, { c: C.yellow, w: 6, a }); r.line(100, 445, 100 + 7.4 * 30, 445, { c: C.red, w: 6, a }); }
          } }
      ]],
      ['Simultaneity is relative', [
        { tail: 2.6, say: ['The deepest change is to the word "simultaneous". A train moves steadily to the right. A lamp in the exact middle of a carriage flashes once.',
                'For a passenger, the light travels the same distance to the front wall and the back wall, at the same speed. It reaches both at the same moment.',
                'For someone on the platform, the light still travels at c in both directions. But the back wall is moving towards the flash and the front wall is moving away. The light reaches the back wall first.',
                'Neither observer is wrong. Two events that are simultaneous in one frame are not simultaneous in another, if they are separated along the direction of motion. There is no universal now. That one idea, accepted fully, is what makes all the other results consistent.'],
          draw(r, S) {
            const s = Math.max(0, S.since(0)), cyc = s % 6, v = 40, c = 120, xm = 200 + v * cyc, half = 160, flash = cyc > 0.6, tf = cyc - 0.6;
            r.alpha(S.at(0, 0.8), () => {
              r.line(40, 330, 920, 330, { c: C.greyD, w: 2 });
              r.rr(xm - half, 230, 2 * half, 90, 8, { c: C.blue, w: 2.5, fill: C.blue, fa: 0.1 });
              r.dot(xm, 275, { r: 6, c: flash ? C.yellow : C.greyB });
              if (flash) {
                const xl = 200 + v * 0.6 - c * tf, xr = 200 + v * 0.6 + c * tf, back = xm - half, front = xm + half;
                const platform = S.t > S.B[2];
                const L1 = platform ? Math.max(xl, back) : xm - Math.min(half, c * tf), R1 = platform ? Math.min(xr, front) : xm + Math.min(half, c * tf);
                r.line(L1, 275, xm, 275, { c: C.yellow, w: 3, a: 0.8 }); r.line(xm, 275, R1, 275, { c: C.yellow, w: 3, a: 0.8 });
                if (L1 <= back + 0.5) r.flash(back, 275, cl((S.w * 2) % 1), { c: C.red, n: 8, r: 6, R: 18 });
                if (R1 >= front - 0.5) r.flash(front, 275, cl((S.w * 2) % 1), { c: C.green, n: 8, r: 6, R: 18 });
              }
              r.arrow(xm + half + 14, 250, xm + half + 60, 250, { c: C.green, w: 2.5, head: 9 });
            });
            K.txt(r, S, 1, 'passenger: both walls lit at once', 480, 120, { size: 20, align: 'center', c: C.blue, out: 2 });
            K.txt(r, S, 2, 'platform: the back wall is lit first', 480, 120, { size: 20, align: 'center', c: C.red });
            K.txt(r, S, 3, 'no universal "now"', 480, 420, { size: 24, align: 'center', c: C.yellow });
          } }
      ]],
      ['A paradox: the pole and the barn', [
        { tail: 2.6, say: ['A famous puzzle tests whether you really believe in relative simultaneity. A runner carries a pole 10 metres long, at 0.8 c, towards a barn 8 metres long, with a door at each end.',
                'At 0.8 c, gamma is five thirds. In the barn\'s frame, the pole is contracted to 10 over five thirds: 6 metres. It fits inside the 8-metre barn, so the farmer can close both doors at once, with the pole inside.',
                'But in the runner\'s frame, the barn is the thing moving, so the barn is contracted: 8 over five thirds, only 4.8 metres. A 10-metre pole cannot fit in a 4.8-metre barn. So who is right?',
                'Both. The doors closing at once is a statement about two events at different places, so it is simultaneous only in the barn\'s frame. In the runner\'s frame, the far door closes and opens again first, before the pole\'s front reaches it, and the near door closes only after the pole\'s back has passed. No observer ever sees the pole trapped. The paradox dissolves the moment you stop assuming that "at the same time" means the same thing to everyone.'],
          draw(r, S) {
            const runner = S.t > S.B[2] && S.t < S.B[3] + 0.2;
            r.alpha(S.at(0, 0.8), () => {
              const bw = runner ? 8 / (5 / 3) : 8, pw = runner ? 10 : 10 / (5 / 3), k = 46, bx = 520 - (bw * k) / 2;
              r.rect(bx, 210, bw * k, 110, { c: C.greyB, w: 3, fill: C.greyB, fa: 0.08 });
              r.line(bx, 200, bx, 330, { c: C.red, w: 5, a: 0.8 }); r.line(bx + bw * k, 200, bx + bw * k, 330, { c: C.red, w: 5, a: 0.8 });
              const px = runner ? 520 - (pw * k) / 2 : bx + 40 + 30 * Math.sin(0.8 * S.w);
              r.line(px, 265, px + pw * k, 265, { c: C.yellow, w: 7 });
              r.txt(runner ? "runner's frame: barn 4.8 m, pole 10 m" : "barn's frame: barn 8 m, pole 6 m", 480, 380, { size: 18, sans: true, c: runner ? C.blue : C.green, align: 'center' });
            });
            K.tex(r, S, 1, T`\gamma(0.8c) = \tfrac53`, 480, 90, { size: 30, c: C.yellow, out: 3 });
            K.txt(r, S, 3, '"both doors shut at once" is simultaneous only in the barn frame', 480, 440, { size: 19, align: 'center', c: C.yellow });
          } }
      ]],
      ['The Lorentz transformation', [
        { say: ['All of these effects are packaged in one set of equations, the Lorentz transformation. An event at position x and time t in one frame has coordinates x prime and t prime in a frame moving at speed v.',
                'x prime equals gamma times x minus v t. t prime equals gamma times t minus v x over c squared.',
                'When v is tiny compared with c, gamma is one and v x over c squared is negligible. The equations become x prime equals x minus v t, and t prime equals t: Galileo\'s rules, which work perfectly at everyday speeds.',
                'The term v x over c squared in the time equation is the relativity of simultaneity. Two events at the same time t but different places x get different times t prime.',
                'And the transformation is built so that light keeps its speed. If x equals c t, then x prime equals c t prime in the new frame too. Check it yourself: it takes three lines of algebra, and it is worth doing once.'],
          draw(r, S) {
            const a = S.at(1, 0.7); if (a > 0) { r.rr(250, 60, 460, 150, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); }
            K.tex(r, S, 1, T`x' = \gamma\,(x - vt)`, 480, 100, { size: 34, c: C.yellow });
            K.tex(r, S, 1, T`t' = \gamma\Big(t - \frac{vx}{c^{2}}\Big)`, 480, 168, { size: 34, c: C.yellow, dl: 1 });
            K.tex(r, S, 2, T`v \ll c:\ \ x' = x - vt,\ \ t' = t`, 480, 280, { size: 30, c: C.blue });
            if (S.t > S.B[3]) K.hl(r, S, 3, 520, 140, 150, 56);
            K.tex(r, S, 4, T`x = ct\ \Rightarrow\ x' = \gamma(c - v)t = c\,\gamma\Big(t - \frac{v t}{c}\Big) = ct'`, 480, 390, { size: 26, c: C.green });
          } }
      ]],
      ['Spacetime diagrams', [
        { tail: 2.6, say: ['A picture makes the Lorentz transformation much easier to hold in your head. Plot time upwards, measured as c t so that it has units of length, and position across. Every event is a point; every object traces a line, its world line.',
                'Light travels one metre of x per metre of c t, so light rays are lines at forty-five degrees. Nothing can travel faster, so every world line stays steeper than forty-five degrees.',
                'Now draw the axes of a frame moving at speed v. Its time axis is the moving observer\'s world line, tilted towards the light line. Its space axis, the line of events it calls simultaneous, tilts up by the same angle. The axes close like scissors as v approaches c, but the light line stays fixed between them.',
                'Events on a horizontal line are simultaneous for us. Events on the tilted line are simultaneous for the moving observer. That is the relativity of simultaneity, drawn.'],
          draw(r, S) {
            const ox = 360, oy = 420, s = 320, b = S.t > S.B[2] ? 0.55 * (0.5 - 0.5 * Math.cos(0.8 * (S.t - S.B[2]))) : 0;
            r.alpha(S.at(0, 0.8), () => { r.arrow(ox - 20, oy, ox + s + 40, oy, { c: C.greyB, w: 2, head: 10 }); r.arrow(ox, oy + 20, ox, oy - s - 30, { c: C.greyB, w: 2, head: 10 }); r.txt('x', ox + s + 50, oy, { size: 18, c: C.greyB }); r.txt('ct', ox - 30, oy - s - 30, { size: 18, c: C.greyB }); const wl = []; for (let i = 0; i <= 40; i++) { const t = i / 40 * s; wl.push([ox + 80 + 30 * Math.sin(t / 60), oy - t]); } r.poly(wl, { c: C.teal, w: 2.5 }); });
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.line(ox, oy, ox + s, oy - s, { c: C.yellow, w: 2.5, a: a1 }); r.line(ox, oy, ox - 120, oy - 120, { c: C.yellow, w: 2.5, a: a1 }); r.txt('light', ox + s - 40, oy - s + 10, { size: 16, sans: true, c: C.yellow, a: a1 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) {
              r.arrow(ox, oy, ox + b * s, oy - s, { c: C.blue, w: 3, head: 10, a: a2 }); r.arrow(ox, oy, ox + s, oy - b * s, { c: C.blue, w: 3, head: 10, a: a2 });
              r.txt("ct′", ox + b * s + 10, oy - s - 6, { size: 18, c: C.blue, a: a2 }); r.txt("x′", ox + s + 12, oy - b * s, { size: 18, c: C.blue, a: a2 });
              r.txt('v = ' + b.toFixed(2) + 'c', 820, 120, { size: 20, sans: true, c: C.blue, a: a2 });
            }
            const a3 = S.at(3, 0.7); if (a3 > 0) { const y0 = oy - 170; r.line(ox, y0, ox + s, y0, { c: C.green, w: 2, dash: [6, 5], a: a3 }); r.line(ox, y0, ox + s, y0 - b * s, { c: C.red, w: 2, dash: [6, 5], a: a3 }); r.txt('our "now"', ox + s + 10, y0 + 4, { size: 15, sans: true, c: C.green, a: a3 }); r.txt('their "now"', ox + s + 10, y0 - b * s - 4, { size: 15, sans: true, c: C.red, a: a3 }); }
          } },
        { say: ['One quantity survives every change of frame. For two events separated by delta t and delta x, the combination c squared delta t squared minus delta x squared is the same for all observers. It is called the spacetime interval.',
                'It is the relativistic version of Pythagoras, with a minus sign. And for a clock that is present at both events, the interval is just c squared times the time the clock itself measures, its proper time.',
                'That explains the twin paradox. One twin stays home; the other flies out and back fast. Back together, the travelling twin is younger, because her zig-zag world line has a smaller interval than her brother\'s straight one. In spacetime, unlike in space, the straight line between two points is the longest in time, not the shortest.'],
          draw(r, S) {
            K.tex(r, S, 0, T`s^{2} = c^{2}\Delta t^{2} - \Delta x^{2}\ \ \text{(the same in every frame)}`, 480, 80, { size: 30, c: C.yellow });
            K.tex(r, S, 1, T`s^{2} = c^{2}\,\Delta\tau^{2}`, 480, 150, { size: 30, c: C.blue });
            const a = S.at(2, 0.8); if (a > 0) { const ox = 400, oy = 440, H = 240; r.alpha(a, () => { r.line(ox, oy, ox, oy - H, { c: C.green, w: 3 }); r.poly([[ox, oy], [ox + 110, oy - H / 2], [ox, oy - H]], { c: C.red, w: 3 }); r.dot(ox, oy, { r: 6, c: C.ink }); r.dot(ox, oy - H, { r: 6, c: C.ink }); r.txt('home twin: more time', ox - 20, oy - H / 2, { size: 16, sans: true, c: C.green, align: 'right' }); r.txt('traveller: less time', ox + 125, oy - H / 2, { size: 16, sans: true, c: C.red }); }); }
          } }
      ]],
      ['Adding velocities', [
        { tail: 2.6, say: ['If light has the same speed for everyone, velocities cannot simply add. A rocket moving at 0.6 c fires a probe forwards at 0.6 c relative to itself. How fast is the probe, seen from the ground?',
                'Not 1.2 c. Applying the Lorentz transformation, the rule is u equals u prime plus v, over one plus u prime v over c squared.',
                'Here that is 1.2 c over one plus 0.36: 0.882 c. Faster than either, but still below c.',
                'Put u prime equal to c, a light pulse fired from the rocket, and the rule gives c plus v over one plus v over c, which is exactly c. The speed of light is the one speed that is the same for everyone, as the postulate demands.'],
          draw(r, S) {
            K.tex(r, S, 1, T`u = \frac{u' + v}{1 + u'v/c^{2}}`, 480, 110, { size: 38, c: C.yellow });
            K.calc(r, S, 2, 220, 230, [T`u = \frac{0.6c + 0.6c}{1 + 0.36} = 0.882c`, T`u' = c:\ \ u = \frac{c + v}{1 + v/c} = c`], { ks: [2, 3], dy: 100, size: 32 });
            const a = S.at(0, 0.8); if (a > 0) r.alpha(a, () => { r.rr(640, 400, 90, 34, 8, { c: C.blue, w: 2, fill: C.blue, fa: 0.25 }); r.arrow(740, 417, 790, 417, { c: C.blue, w: 2.5, head: 9 }); r.dot(820, 417, { r: 6, c: C.yellow }); r.arrow(832, 417, 880, 417, { c: C.yellow, w: 2.5, head: 9 }); });
          } }
        ,{ say: ['The same reasoning changes the Doppler effect for light. There is no air for light to travel through, so only the relative velocity can matter, and time dilation adds a factor of gamma. For a source moving away at speed beta times c, wavelengths are stretched by the square root of one plus beta, over one minus beta.',
                'A galaxy receding at a tenth of the speed of light: the red hydrogen line at 656.3 nanometres arrives stretched by the square root of 1.1 over 0.9, a factor of 1.106, to 725.6 nanometres, deep red. This red-shift is how astronomers measure the expansion of the universe.',
                ['There is even a sideways Doppler shift, with no classical counterpart at all: a source moving across your line of sight is red-shifted by exactly gamma, pure time dilation. Ives and Stilwell measured it in 1938, using fast-moving hydrogen ions, and found Einstein\'s factor.', 1.5]],
          draw(r, S) {
            K.tex(r, S, 0, T`\frac{\lambda_{\text{obs}}}{\lambda_{\text{src}}} = \sqrt{\frac{1+\beta}{1-\beta}}`, 300, 110, { size: 34, c: C.yellow });
            K.tex(r, S, 1, T`\beta = 0.1:\ \ 656.3\ \text{nm} \times 1.106 = 725.6\ \text{nm}`, 480, 240, { size: 28, c: C.red });
            const a = S.at(1, 0.8); if (a > 0) { for (let i = 0; i < 200; i++) { const nm = 400 + i * 1.75, x = 180 + i * 3; r.line(x, 300, x, 330, { c: WL.nmColour(nm), w: 3.2, a: a * 0.85 }); } const X = (nm) => 180 + (nm - 400) / 1.75 * 3; r.line(X(656.3), 292, X(656.3), 338, { c: C.ink, w: 2, a }); r.arrow(X(656.3), 350, X(725.6) > 780 ? 780 : X(725.6), 350, { c: C.ink, w: 2, head: 8, a }); }
            K.tex(r, S, 2, T`\text{transverse: } \lambda_{\text{obs}} = \gamma\,\lambda_{\text{src}}`, 640, 420, { size: 26, c: C.green });
          } }
      ]],
      ['E = mc²', [
        { say: ['Momentum must change too. To keep momentum conserved in every frame, it must be p equals gamma m v. At low speed that is just m v, but as v approaches c, the momentum grows without limit. That is why no amount of pushing gets a massive object to the speed of light.',
                'The energy of a moving object becomes E equals gamma m c squared. At rest, gamma is one, and the energy is m c squared: an object has energy simply by having mass.',
                'The kinetic energy is the extra part: gamma minus one, times m c squared. Expand gamma for small v, and that becomes one half m v squared, plus tiny corrections. Newton\'s formula is the low-speed limit of Einstein\'s.',
                'Energy and momentum fit together in one equation that holds for everything, even light: E squared equals p c squared plus m c squared, squared. For light, with m equal to zero, E equals p c.'],
          draw(r, S) {
            K.tex(r, S, 0, T`p = \gamma m v`, 260, 90, { size: 34 });
            const a = S.at(1, 0.7); if (a > 0) { r.rr(560, 50, 300, 84, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 1, T`E = \gamma m c^{2}`, 710, 92, { size: 38, c: C.yellow, dl: 0.2 }); }
            K.tex(r, S, 2, T`E_K = (\gamma - 1)mc^{2} \approx \tfrac12 mv^{2} + \tfrac38\frac{mv^{4}}{c^{2}} + \ldots`, 480, 230, { size: 30, c: C.blue });
            K.tex(r, S, 3, T`E^{2} = (pc)^{2} + (mc^{2})^{2}`, 480, 350, { size: 36, c: C.green });
          } },
        { say: ['Two worked examples. First, the energy locked in one gram of anything. m c squared is 0.001 times nine times ten to the sixteen: nine times ten to the thirteen joules.',
                'That is about the energy of twenty-one thousand tonnes of TNT, roughly the bomb dropped on Nagasaki. In that explosion, about one gram of mass was converted. In everyday chemistry the converted fraction is ten million times smaller, which is why nobody noticed before 1905.',
                'Second: an electron accelerated through one million volts gains one mega-electronvolt of kinetic energy. Its rest energy is 0.511 MeV, so gamma minus one equals one over 0.511, and gamma is 2.96.',
                'Then v over c is the square root of one minus one over gamma squared: 0.941. Newton\'s formula, one half m v squared equals one MeV, would give v equal to two c, which is impossible. At these energies, only relativity gives the right answer.'],
          draw(r, S) {
            K.calc(r, S, 0, 90, 100, [T`E = mc^{2} = (10^{-3})(3.00\times10^{8})^{2} = 9.0\times10^{13}\ \text{J}`, T`\approx 21\ \text{kt TNT}`], { ks: [0, 1], dy: 70, size: 28 });
            K.calc(r, S, 2, 90, 280, [T`E_K = 1\ \text{MeV},\ \ mc^{2} = 0.511\ \text{MeV}\ \Rightarrow\ \gamma = 2.96`, T`\frac{v}{c} = \sqrt{1 - 1/\gamma^{2}} = 0.941\qquad(\text{Newton: } 2c\ \text{✗})`], { ks: [2, 3], dy: 76, size: 26 });
          } }
        ,{ say: [['Pause and think. Why can nothing with mass ever reach the speed of light?', 4],
                'Because its energy, gamma m c squared, grows without limit as v approaches c. To reach c exactly would need infinite energy. Accelerators pour in more and more energy, and particles get closer and closer to c, at 0.999999 and beyond, but never arrive.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Why can a massive object never reach c?'], { y: 80 });
            const A = K.axes(r, { x0: 180, y0: 440, w: 560, h: 220, xr: [0, 1], yr: [0, 8], xl: 'v/c', yl: 'E/mc²' }), a = S.at(1, 0.8);
            if (a > 0) { r.alpha(a, () => A.draw(1)); K.plot(r, A, gam, 0, 0.993, a, { n: 300 }); r.line(A.X(1), A.Y(0), A.X(1), A.Y(8), { c: C.red, w: 2, dash: [6, 5], a }); }
          } },
        { say: ['Where does nuclear energy come from? A helium-4 nucleus is made of two protons and two neutrons. Add up their masses: 4.0319 atomic mass units.',
                'But the helium nucleus itself has a mass of only 4.0015 units. The bound nucleus is lighter than its parts, by 0.0304 units.',
                'One atomic mass unit is worth 931.5 MeV, so that missing mass is 28.3 MeV: the binding energy, released when the nucleus forms. Fusion in the Sun turns about 0.7 percent of the mass of hydrogen into energy this way, four million tonnes every second.'],
          draw(r, S) {
            K.calc(r, S, 0, 100, 110, [T`2m_p + 2m_n = 4.0319\ \text{u}`, T`m(^{4}\text{He nucleus}) = 4.0015\ \text{u}\ \Rightarrow\ \Delta m = 0.0304\ \text{u}`, T`E_B = (0.0304)(931.5\ \text{MeV}) = 28.3\ \text{MeV}`], { ks: [0, 1, 2], dy: 84, size: 28, box: true });
            const a = S.at(0, 0.8); if (a > 0) r.alpha(a, () => { [[760, 380, C.red], [800, 380, C.greyB], [760, 420, C.greyB], [800, 420, C.red]].forEach(([x, y, c]) => r.circle(x, y, 18, { c, fill: c, fa: 0.5, w: 2 })); });
          } }
      ]],
      ['Your phone uses relativity', [
        { tail: 2.6, say: ['Relativity is not only for particle physicists. The GPS satellites orbit at about 3.9 kilometres per second, so special relativity makes their clocks run slow by about seven microseconds per day.',
                'They are also higher up in the Earth\'s gravity, and general relativity, Einstein\'s later theory, makes them run fast by about 45 microseconds per day. The net effect is about 38 microseconds per day fast.',
                'Light travels 11 kilometres in 38 microseconds, so each satellite\'s range would slip that much daily; receivers absorb the shared part, but GPS time would drift. The satellite clocks are deliberately set to tick slightly slow before launch, to cancel the effect.',
                'Notice where special relativity stops: it assumes no gravity, or at least frames that are not accelerating. Including gravity needs curved spacetime, general relativity, which is a story for a later lecture.'],
          draw(r, S) {
            const cx = 250, cy = 260;
            r.alpha(S.at(0, 0.8), () => { r.circle(cx, cy, 70, { c: C.blue, w: 2, fill: C.blue, fa: 0.3 }); r.circle(cx, cy, 170, { c: C.greyD, w: 1.5, dash: [5, 6] }); const t = 0.5 * S.w; for (let k = 0; k < 3; k++) { const a = t + (TAU * k) / 3; r.dot(cx + 170 * Math.cos(a), cy + 170 * Math.sin(a), { r: 7, c: C.yellow }); } });
            K.calc(r, S, 0, 500, 110, [T`\text{SR (speed)}:\ -7\ \mu\text{s/day}`, T`\text{GR (height)}:\ +45\ \mu\text{s/day}`, T`\text{net}:\ +38\ \mu\text{s/day}`, T`c\times38\ \mu\text{s} \approx 11\ \text{km}`], { ks: [0, 1, 1, 2], dy: 66, size: 26, cs: [C.blue, C.green, C.yellow, C.red] });
          } },
        { say: ['Let us collect what we found.',
                'Two postulates: the laws of physics are the same in every inertial frame, and light has the same speed c for everyone.',
                'From the light clock: moving clocks run slow by gamma, one over root one minus v squared over c squared; moving lengths shrink by the same factor; and simultaneity depends on the observer.',
                'The Lorentz transformation packages it all, reduces to Galileo at low speed, and leaves the interval c squared delta t squared minus delta x squared unchanged.',
                'Velocities add as u prime plus v over one plus u prime v over c squared, so nothing overtakes light.',
                'Momentum is gamma m v, energy is gamma m c squared, and E squared equals p c squared plus m c squared squared, with experimental confirmation from muons, particle accelerators, atomic clocks and GPS.',
                'MIT\'s course 8.20 develops every step of this in its video lectures, with problem sets to practise on. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['postulates: same laws in every inertial frame; c the same for all', 'Δt = γΔt₀, L = L₀/γ, no universal simultaneity', 'Lorentz: x′ = γ(x − vt), t′ = γ(t − vx/c²); s² invariant', 'u = (u′ + v)/(1 + u′v/c²): nothing overtakes light', 'p = γmv, E = γmc², E² = (pc)² + (mc²)²'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: The Schrödinger equation (Year 1 → Year 2). References: MIT OCW 8.04 (Adams 2013; Zwiebach 2016); 3Blue1Brown. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  // Hermite functions for the oscillator, n = 0..3
  const herm = (n, x) => [1, 2 * x, 4 * x * x - 2, 8 * x * x * x - 12 * x][n];
  const nrm = [1, 0.7071, 0.3536, 0.1443];
  const qho = (n, x) => nrm[n] * herm(n, x) * Math.exp(-x * x / 2) / Math.pow(Math.PI, 0.25);

  L.def({
    id: 'schrodinger', order: 7, title: 'The Schrödinger equation', sub: 'How matter waves are guessed, what ψ means, and how confinement creates energy levels',
    level: 'Year 1 → Year 2', topics: ['y2-schrodinger', 'y1-qm-intro', 'y2-qho'], thumb: [13, 70],
    refs: [
      ['MIT OCW 8.04 (Allan Adams, 2013)', 'Quantum Physics I, Lecture 1 and the full video course', 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/resources/lecture-1/'],
      ['MIT OCW 8.04 (Barton Zwiebach, 2016)', 'Quantum Physics I: video lectures, one-dimensional potentials', 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/video-lectures/'],
      ['MIT OCW 8.05 (Zwiebach)', 'Lecture 1: Wave mechanics, the Schrödinger equation and stationary states', 'https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/resources/lecture-1-wave-mechanics'],
      ['3Blue1Brown', 'Some light quantum mechanics (with minutephysics)', 'https://www.3blue1brown.com/lessons/light-quantum-mechanics']
    ],
    chapters: [
      ['Matter behaves like a wave', [
        { say: ['Newton\'s laws tell a ball where to go. For electrons and atoms they fail, badly. This lecture is about the equation that replaced them: where it comes from, what its strange solution actually means, and how it explains why atoms have energy levels.', 1.5],
          draw(r, S) {
            K.title(r, S, 'The Schrödinger equation', 'Matter waves, probability and energy levels', { y: 190 });
            const a = S.in(1.6, 1.2), pts = []; for (let i = 0; i <= 240; i++) { const x = -3 + 6 * i / 240; pts.push([480 + x * 110, 410 - 50 * Math.exp(-x * x) * Math.cos(6 * x - 3 * S.w)]); } r.poly(pts, { c: C.blue, w: 2.5, a });
          } },
        { tail: 2.6, say: ['Fire electrons, one at a time, at a barrier with two narrow slits, and record where each one lands on a screen. Each electron arrives as a single dot, like a particle.',
                'But as thousands of dots build up, a pattern of stripes appears: an interference pattern, exactly like light through two slits. Each electron, alone, somehow went through both slits and interfered with itself.',
                'In 1924 Louis de Broglie proposed that every particle has a wavelength: lambda equals h over p, Planck\'s constant divided by the momentum.',
                'For an electron with 100 electronvolts of kinetic energy, p is the square root of two m E: 5.4 times ten to the minus twenty-four kilogram metres per second. The wavelength is 6.63 times ten to the minus thirty-four over that: 0.123 nanometres, about the spacing between atoms in a crystal.',
                'That is why Davisson and Germer, in 1927, saw electrons diffract off a nickel crystal just as X-rays do. Matter waves are real, and they are small. A thrown cricket ball has a wavelength of ten to the minus thirty-four metres, which is why you never see it diffract.'],
          draw(r, S) {
            const a0 = S.at(0, 0.8);
            r.alpha(a0, () => { r.line(300, 70, 300, 200, { c: C.greyB, w: 5 }); r.line(300, 220, 300, 290, { c: C.greyB, w: 5 }); r.line(300, 310, 300, 440, { c: C.greyB, w: 5 }); r.line(560, 60, 560, 450, { c: C.greyB, w: 2 }); r.dot(90, 255, { r: 6, c: C.yellow }); r.txt('electron gun', 90, 285, { size: 14, sans: true, c: C.dim, align: 'center' }); });
            const n = Math.floor(lerp(0, 900, cl((S.t - 0.6) / (S.B[2] - 0.6)))), rr = WL.rng(11);
            for (let i = 0; i < n; i++) { let y; for (;;) { y = (rr() - 0.5) * 380; const p = Math.pow(Math.cos(y / 26), 2) * Math.exp(-y * y / 30000); if (rr() < p) break; } r.dot(565 + rr() * 60, 255 + y, { r: 1.6, c: C.blueA, a: 0.9 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) { r.rr(660, 70, 270, 80, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a2 }); K.tex(r, S, 2, T`\lambda = \frac{h}{p}`, 795, 110, { size: 36, c: C.yellow, dl: 0.2 }); }
            K.tex(r, S, 3, T`100\ \text{eV}:\ \lambda = \frac{h}{\sqrt{2mE}} = 0.123\ \text{nm}`, 790, 230, { size: 24, c: C.green });
            K.txt(r, S, 4, 'cricket ball: λ ~ 10⁻³⁴ m', 790, 300, { size: 18, align: 'center', c: C.greyB });
          } }
      ]],
      ['Guessing the equation', [
        { say: ['If electrons are waves, they need a wave equation. Schrödinger did not derive it from anything deeper; he guessed it, in 1926, by demanding that it give the right answers for waves that we already understood. It is worth seeing how.',
                'Start with a free particle, a plane wave: psi equals e to the i, k x minus omega t. Two quantum rules connect the wave to the particle: momentum p equals h-bar k, from de Broglie, and energy E equals h-bar omega, from Planck and Einstein.',
                'For a slow particle, the energy is p squared over two m. So we need an equation in which one time derivative gives a factor of omega, and two space derivatives give k squared.',
                'Differentiate psi once in time: you get minus i omega psi. Differentiate twice in x: you get minus k squared psi. Multiply by the right constants, and h-bar omega equals h-bar squared k squared over two m becomes i h-bar d psi by d t equals minus h-bar squared over two m, d two psi by d x squared.',
                'Add the potential energy V, and that is the Schrödinger equation. It is a postulate, not a theorem. Its authority comes entirely from experiment, and for slow particles it works very well, once spin is added.',
                'Schrödinger himself first tried a relativistic version, using the relativistic energy instead of p squared over two m. It gave the wrong fine details of the hydrogen spectrum, and he fell back on this simpler equation, which worked.'],
          draw(r, S) {
            K.tex(r, S, 1, T`\psi = e^{i(kx - \omega t)},\qquad p = \hbar k,\quad E = \hbar\omega`, 480, 80, { size: 30 });
            K.tex(r, S, 2, T`E = \frac{p^{2}}{2m}\ \Rightarrow\ \hbar\omega = \frac{\hbar^{2}k^{2}}{2m}`, 480, 160, { size: 30, c: C.blue });
            K.tex(r, S, 3, T`\frac{\partial\psi}{\partial t} = -i\omega\,\psi,\qquad \frac{\partial^{2}\psi}{\partial x^{2}} = -k^{2}\psi`, 480, 240, { size: 30, c: C.greyB });
            const a = S.at(4, 0.7); if (a > 0) { r.rr(170, 300, 620, 110, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 4, T`i\hbar\,\frac{\partial\psi}{\partial t} = -\frac{\hbar^{2}}{2m}\frac{\partial^{2}\psi}{\partial x^{2}} + V(x)\,\psi`, 480, 355, { size: 36, c: C.yellow, dl: 0.2 }); }
          } },
        { say: [['Pause and think. Why does the equation need the imaginary number i?', 4],
                'With one time derivative, a real equation would make waves decay or grow, like the heat equation, not oscillate. The i turns decay into rotation: e to the minus i omega t goes round a circle in the complex plane, forever, without shrinking. That is what lets the total probability stay fixed at one as time passes.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Why is there an i in the equation?'], { y: 80 });
            const a = S.at(1, 0.8); if (a > 0) { const cx = 480, cy = 330, R = 90, th = -1.4 * S.w; r.alpha(a, () => { r.line(cx - 130, cy, cx + 130, cy, { c: C.greyD, w: 1.5 }); r.line(cx, cy + 120, cx, cy - 120, { c: C.greyD, w: 1.5 }); r.circle(cx, cy, R, { c: C.blue, w: 2 }); r.arrow(cx, cy, cx + R * Math.cos(th), cy + R * Math.sin(th), { c: C.yellow, w: 3, head: 11 }); r.tex(T`e^{-i\omega t}`, cx + 190, cy - 60, { size: 26, c: C.yellow }); r.txt('rotates, never shrinks', cx + 190, cy + 10, { size: 16, sans: true, c: C.dim, align: 'center' }); }); }
          } }
      ]],
      ['What ψ means', [
        { tail: 2.6, say: ['So what is psi? It is not a physical wave that you could see. Max Born\'s rule says: the square of its magnitude, psi star psi, is a probability density. The chance of finding the particle between x and x plus d x is the modulus of psi squared, times d x.',
                'Because the particle must be somewhere, the total probability is one: the integral of the modulus of psi squared over all x equals one. Scaling psi to make this true is called normalising it.',
                'Psi is complex. Its size tells you where the particle is likely to be. Its phase, the angle in the complex plane, is invisible in the probability at a single point, but it decides how waves add and cancel. That is where interference comes from.',
                'Here is a wave packet: the real part of psi in blue, and the probability density in yellow. The phase spins rapidly inside the envelope, but the probability is a smooth bump. Where the bump is tall, a measurement is likely to find the particle; where it is zero, never.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 300, w: 800, h: 220, xr: [-6, 6], yr: [-1.1, 1.3], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const env = (x) => Math.exp(-((x + 2 - 0.5 * Math.max(0, S.t - S.B[3])) ** 2) / 2.4);
            const a3 = S.at(3, 0.7); if (a3 > 0) { K.plot(r, A, (x) => env(x) * Math.cos(5 * x - 4 * S.w), -6, 6, a3, { c: C.blue, w: 2, n: 500 }); }
            const pd = (x) => env(x) * env(x);
            K.plot(r, A, pd, -6, 6, S.at(0, 1.2, 0.5), { c: C.yellow, w: 3, n: 300 });
            K.tex(r, S, 0, T`P(x)\,dx = |\psi|^{2}\,dx`, 760, 90, { size: 28, c: C.yellow });
            K.tex(r, S, 1, T`\int_{-\infty}^{\infty}|\psi|^{2}\,dx = 1`, 760, 160, { size: 28, c: C.green });
            K.tex(r, S, 2, T`\psi = |\psi|\,e^{i\theta}`, 300, 400, { size: 30, c: C.blue });
          } }
      ]],
      ['Stationary states', [
        { say: ['Most problems start the same way. If the potential does not change with time, look for solutions in which space and time separate: psi of x and t equals phi of x, times e to the minus i E t over h-bar.',
                'Put that into the Schrödinger equation. The time derivative brings down E, and the equation for the spatial part becomes minus h-bar squared over two m, phi double-prime, plus V phi, equals E phi. This is the time-independent Schrödinger equation.',
                'For these solutions, the modulus of psi squared does not change with time, because the time factor is a pure phase, of size one. Nothing about the probability moves. These are called stationary states.',
                'The equation looks innocent, but there is a catch. For most values of E it has no solution that behaves sensibly, one that stays finite and can be normalised. Only special values of E work. Those are the allowed energies, and finding them is the main job of quantum mechanics.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\psi(x,t) = \varphi(x)\,e^{-iEt/\hbar}`, 480, 90, { size: 32 });
            const a = S.at(1, 0.7); if (a > 0) { r.rr(170, 150, 620, 90, 14, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 1, T`-\frac{\hbar^{2}}{2m}\,\varphi'' + V\varphi = E\varphi`, 480, 195, { size: 36, c: C.yellow, dl: 0.2 }); }
            K.tex(r, S, 2, T`|\psi|^{2} = |\varphi|^{2}\,|e^{-iEt/\hbar}|^{2} = |\varphi|^{2}`, 480, 300, { size: 30, c: C.blue });
            K.txt(r, S, 3, 'only special energies give normalisable solutions', 480, 400, { size: 22, align: 'center', c: C.green });
          } }
      ]],
      ['The particle in a box', [
        { tail: 2.6, say: ['The simplest example is a particle trapped between two impenetrable walls, a distance L apart. Inside, V is zero. Outside, V is infinite, so phi must be zero there, and, for psi to be continuous, zero at both walls.',
                'Inside, the equation is phi double-prime equals minus k squared phi, with k squared equal to two m E over h-bar squared. You have seen this equation many times: the solutions are sines and cosines.',
                'Zero at x equals zero picks out the sine. Zero at x equals L forces sin k L to be zero, so k L must be n pi. This is exactly the standing-wave condition for a guitar string. A confined matter wave must fit.',
                'Put k back into the energy: E n equals n squared pi squared h-bar squared over two m L squared, or n squared h squared over eight m L squared. The energies are discrete, and they grow as n squared.',
                'Notice the lowest energy is not zero. With n equal to zero, the wavefunction would vanish everywhere, which is no particle at all. A confined particle can never be completely at rest.'],
          draw(r, S) {
            const x0 = 140, x1 = 520, base = 440;
            r.alpha(S.at(0, 0.8), () => { r.line(x0, 60, x0, base, { c: C.greyB, w: 5 }); r.line(x1, 60, x1, base, { c: C.greyB, w: 5 }); r.line(x0, base, x1, base, { c: C.greyD, w: 2 }); r.txt('V = ∞', x0 - 50, 100, { size: 16, sans: true, c: C.dim, align: 'center' }); r.txt('V = ∞', x1 + 50, 100, { size: 16, sans: true, c: C.dim, align: 'center' }); });
            const show = S.t > S.B[2];
            for (let n = 1; n <= 3; n++) {
              const a = S.at(2, 0.6, (n - 1) * 0.7); if (a <= 0 || !show) continue;
              const yE = base - 34 * n * n, col = [C.yellow, C.blue, C.green][n - 1], c = Math.cos(1.2 * n * n * S.w) ;
              r.line(x0, yE, x1, yE, { c: col, w: 1.2, dash: [5, 5], a: a * 0.6 });
              const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push([x0 + (x1 - x0) * u, yE - 26 * c * Math.sin(n * Math.PI * u)]); } r.poly(pts, { c: col, w: 2.5, a });
              r.tex(T`n = ${n}`, x1 + 50, yE, { size: 20, c: col, a });
            }
            K.tex(r, S, 1, T`\varphi'' = -k^{2}\varphi,\ \ k^{2} = \frac{2mE}{\hbar^{2}}`, 760, 110, { size: 26 });
            K.tex(r, S, 2, T`kL = n\pi,\ \ \varphi_n = \sqrt{\tfrac{2}{L}}\sin\frac{n\pi x}{L}`, 760, 190, { size: 24, c: C.blue });
            const a3 = S.at(3, 0.7); if (a3 > 0) { r.rr(600, 240, 330, 84, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a3 }); K.tex(r, S, 3, T`E_n = \frac{n^{2}h^{2}}{8mL^{2}}`, 765, 282, { size: 32, c: C.yellow, dl: 0.2 }); }
            K.txt(r, S, 4, 'E₁ > 0: never completely at rest', 765, 380, { size: 19, align: 'center', c: C.green });
          } },
        { say: ['Numbers make this vivid. Trap an electron in a box one nanometre wide, about the size of a small molecule.',
                'E one is h squared over eight m L squared: 6.63 times ten to the minus thirty-four, squared, over eight times 9.11 times ten to the minus thirty-one, times ten to the minus eighteen. That is 6.0 times ten to the minus twenty joules, or 0.376 electronvolts.',
                'E two is four times that, 1.50 electronvolts. When the electron drops from level two to level one, it emits a photon carrying the difference, 1.13 electronvolts. Its wavelength is h c over the energy: about 1,100 nanometres, in the near infrared.',
                'Make the box smaller and every level rises as one over L squared, so the light gets bluer. This is exactly how quantum dots work: tiny crystals, a few nanometres across, whose colour is tuned by their size, not only by what they are made of. They are in some television screens right now.'],
          draw(r, S) {
            K.calc(r, S, 1, 90, 100, [T`E_1 = \frac{(6.63\times10^{-34})^{2}}{8(9.11\times10^{-31})(10^{-9})^{2}} = 6.0\times10^{-20}\ \text{J} = 0.376\ \text{eV}`, T`E_2 = 4E_1 = 1.50\ \text{eV},\ \ \Delta E = 1.13\ \text{eV}`, T`\lambda = \frac{hc}{\Delta E} = \frac{1240\ \text{eV nm}}{1.13\ \text{eV}} \approx 1100\ \text{nm}`], { ks: [1, 2, 2], dy: 92, size: 26 });
            const a = S.at(3, 0.8); if (a > 0) { [[2.0, '#ff5050'], [3.5, '#ffb000'], [5, '#30d050'], [6.5, '#3080ff']].forEach(([d, col], i) => { const R = 34 - i * 6; r.circle(600 + i * 90, 410, R, { c: col, fill: col, fa: 0.6, a }); }); r.txt('smaller dot → bluer light', 735, 360, { size: 16, sans: true, c: C.dim, align: 'center', a }); }
          } }
        ,{ tail: 2.6, say: ['Stationary states never move. So how does an electron ever change level? Put it in a mixture: half level one plus half level two. Each part turns in the complex plane at its own rate, set by its own energy.',
                'The two parts drift in and out of step, so the probability density sloshes from one side of the box to the other and back. The sloshing frequency is the energy difference divided by Planck\'s constant: here, 1.13 electronvolts over h, or 2.7 times ten to the fourteen hertz.',
                ['A sloshing charge is an oscillating dipole, and an oscillating dipole radiates light at its own frequency. Divide the speed of light by 2.7 times ten to the fourteen and you get 1.1 micrometres: exactly the wavelength we found from the energy jump. The two pictures agree.', 1.5]],
          draw(r, S) {
            const A = K.axes(r, { x0: 120, y0: 400, w: 520, h: 250, xr: [0, 1], yr: [0, 3.2], xl: 'x/L' });
            A.draw(S.at(0, 0.8));
            const ph = 1.6 * S.w, p1 = (x) => Math.SQRT2 * Math.sin(Math.PI * x), p2 = (x) => Math.SQRT2 * Math.sin(2 * Math.PI * x);
            K.plot(r, A, (x) => 0.5 * (p1(x) ** 2 + p2(x) ** 2) + p1(x) * p2(x) * Math.cos(ph), 0, 1, S.at(0, 1.2, 0.4), { c: C.yellow, w: 3 });
            K.tex(r, S, 0, T`\psi = \tfrac{1}{\sqrt2}\big(\varphi_1 e^{-iE_1t/\hbar} + \varphi_2 e^{-iE_2t/\hbar}\big)`, 480, 60, { size: 26 });
            K.tex(r, S, 1, T`f = \frac{E_2 - E_1}{h} = 2.7\times10^{14}\ \text{Hz}`, 790, 200, { size: 26, c: C.blue });
            K.tex(r, S, 2, T`\lambda = \frac{c}{f} = 1.1\ \mu\text{m}\ \checkmark`, 790, 300, { size: 28, c: C.green });
          } }
        ,{ say: [['Pause and think. An electron is in the second level of the box. Where is it most likely to be found? And where will it never be found?', 4],
                'The probability density is sine squared of two pi x over L: two humps, peaking at a quarter and three quarters of the way across, with a zero in the exact middle. In that state the electron is never found at the centre, even though it is found on both sides of it. A classical particle bouncing back and forth would be equally likely everywhere.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['n = 2: where is the electron most and least likely?'], { y: 80 });
            const a = S.at(1, 0.8); if (a > 0) { const A = K.axes(r, { x0: 240, y0: 430, w: 480, h: 180, xr: [0, 1], yr: [0, 2.2], xl: 'x/L', xt: [0, 1, 0.25] }); r.alpha(a, () => A.draw(1)); K.plot(r, A, (x) => 2 * Math.pow(Math.sin(2 * Math.PI * x), 2), 0, 1, a, { c: C.blue }); K.plot(r, A, () => 1, 0, 1, a, { c: C.greyB, w: 1.5, dash: [6, 5] }); K.pin(r, ...A.pt(0.5, 0), 'never here', { c: C.red, a, dy: -30, dx: -40 }); r.txt('classical', A.X(1) + 10, A.Y(1), { size: 15, sans: true, c: C.greyB, a }); }
          } }
      ]],
      ['Uncertainty, and why atoms do not collapse', [
        { say: ['Why is the lowest energy above zero? Heisenberg\'s uncertainty principle: the spread in position, delta x, and the spread in momentum, delta p, can never both be small. Their product is at least h-bar over two.',
                'This is not a statement about clumsy measurement. It is a property of waves. A wave packet that is narrow in space must be built from many wavelengths, so its momentum is spread out. A wave with one sharp wavelength must go on and on.',
                'Squeeze a particle into a box of size L, and its momentum spread is at least about h-bar over L. So it carries kinetic energy of at least roughly h-bar squared over m L squared. Confinement costs energy.',
                'This is why atoms are stable. Classically, an electron should spiral into the nucleus, releasing energy. But squeezing it closer raises its kinetic energy. Balance the two: the energy is h-bar squared over two m r squared, minus k e squared over r. The minimum is at r equals h-bar squared over m k e squared.',
                'That is the Bohr radius, 0.053 nanometres, and the energy there is minus 13.6 electronvolts: exactly the size and binding energy of a hydrogen atom. The rough argument gets the scale right; the exact match is partly good luck.'],
          draw(r, S) {
            const a = S.at(0, 0.7); if (a > 0) { r.rr(250, 50, 460, 80, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 0, T`\Delta x\,\Delta p \ge \frac{\hbar}{2}`, 480, 90, { size: 34, c: C.yellow, dl: 0.2 }); }
            const A = K.axes(r, { x0: 90, y0: 440, w: 420, h: 250, xr: [0.2, 4], yr: [-1.2, 1.6], xl: 'r / a₀', yl: 'E' }), a3 = S.at(3, 0.7);
            if (a3 > 0) { r.alpha(a3, () => A.draw(1)); K.plot(r, A, (x) => 1 / (x * x), 0.75, 4, a3, { c: C.blue, w: 2, dash: [6, 5] }); K.plot(r, A, (x) => -2 / x, 0.95, 4, a3, { c: C.red, w: 2, dash: [6, 5] }); K.plot(r, A, (x) => 1 / (x * x) - 2 / x, 0.42, 4, S.at(3, 1.2, 0.5), { c: C.yellow, w: 3 }); K.pin(r, ...A.pt(1, -1), 'a₀', { c: C.green, a: S.at(4, 0.6), dy: 24 }); }
            K.tex(r, S, 2, T`E_K \gtrsim \frac{\hbar^{2}}{2mL^{2}}`, 760, 200, { size: 30, c: C.blue });
            K.tex(r, S, 3, T`E(r) = \frac{\hbar^{2}}{2mr^{2}} - \frac{ke^{2}}{r}`, 760, 280, { size: 28 });
            K.tex(r, S, 4, T`a_0 = \frac{\hbar^{2}}{mke^{2}} = 0.053\ \text{nm},\ \ E = -13.6\ \text{eV}`, 720, 380, { size: 24, c: C.green });
          } }
      ]],
      ['Leaky walls and real atoms', [
        { tail: 2.6, say: ['Real walls are never infinitely high. In a finite well, the wavefunction does not stop at the wall; it leaks a little way into the forbidden region, decaying exponentially.',
                'Because the wave has a little more room, its wavelength is slightly longer, so every energy level sits a little lower than in the infinite box. And a finite well holds only a finite number of bound states. Above the rim, the particle is free.',
                'The hydrogen atom is a well too, shaped by the Coulomb attraction of the proton, in three dimensions. Solving the Schrödinger equation for it gives energies of minus 13.6 electronvolts over n squared.',
                'Check it against experiment. A jump from level three to level two releases 13.6 times one quarter minus one ninth: 1.89 electronvolts. The wavelength is 1240 over 1.89: 656 nanometres, the bright red line of hydrogen, measured by spectroscopists decades before anyone could explain it.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 430, w: 440, h: 330, xr: [-3, 3], yr: [-0.1, 3.3], xl: 'x' }), a0 = S.at(0, 0.8);
            if (a0 > 0) { r.alpha(a0, () => { A.draw(1); r.poly([A.pt(-3, 2.6), A.pt(-1, 2.6), A.pt(-1, 0), A.pt(1, 0), A.pt(1, 2.6), A.pt(3, 2.6)], { c: C.greyB, w: 2.5 }); }); K.plot(r, A, (x) => 0.55 + 0.5 * (Math.abs(x) < 1 ? Math.cos(1.25 * x) : Math.cos(1.25) * Math.exp(-2.2 * (Math.abs(x) - 1))), -3, 3, a0, { c: C.yellow }); }
            const a1 = S.at(1, 0.7); if (a1 > 0) { r.txt('free above the rim', A.X(0), A.Y(2.95), { size: 15, sans: true, c: C.dim, align: 'center', a: a1 }); r.line(A.X(-1), A.Y(1.75), A.X(1), A.Y(1.75), { c: C.blue, w: 1.5, dash: [5, 5], a: a1 }); }
            K.tex(r, S, 2, T`E_n = -\frac{13.6\ \text{eV}}{n^{2}}`, 750, 120, { size: 32, c: C.yellow });
            K.calc(r, S, 3, 560, 220, [T`E_3 - E_2 = 13.6\big(\tfrac14 - \tfrac19\big) = 1.89\ \text{eV}`, T`\lambda = \frac{1240}{1.89} = 656\ \text{nm}`], { ks: [3, 3], dy: 80, size: 26, box: true, dl: 0 });
            const a3 = S.at(3, 0.6, 2); if (a3 > 0) r.glow(830, 420, 40, '#ff3030', 0.7 * a3);
          } }
      ]],
      ['Tunnelling', [
        { tail: 2.6, say: ['Now let the walls be finite. A particle meets a barrier of height V, higher than its energy E. Classically it bounces back, every time.',
                'Quantum mechanically, inside the barrier the equation becomes phi double-prime equals plus kappa squared phi, with kappa equal to the square root of two m, V minus E, over h-bar. The solutions are not waves but exponentials: the wavefunction decays into the barrier, without dropping instantly to zero.',
                'If the barrier is thin enough, a little of the wave is still there on the far side, and the particle can appear there. It has tunnelled through a region it does not have the energy to cross. The transmission probability is roughly e to the minus two kappa a, for a barrier of width a.',
                'Example: an electron with 1 electronvolt meets a 5 electronvolt barrier, half a nanometre wide. Kappa is the root of two m times 4 electronvolts, over h-bar: 1.02 times ten to the ten per metre. Then two kappa a is 10.2, and including the prefactor sixteen E over V times one minus E over V, the transmission is about nine in a hundred thousand.',
                'The exponential is brutally sensitive. Double the width and the probability falls by another factor of about thirty thousand. That sensitivity is exactly what the scanning tunnelling microscope uses to see single atoms, and the same tunnelling lets alpha particles escape from nuclei and charge leak through the insulator of a flash memory cell.',
                'It even keeps the Sun shining. In the Sun\'s core, protons do not have nearly enough energy to climb over their mutual electrical repulsion. They fuse anyway, because now and then one tunnels through. Without tunnelling, the Sun would be dark.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 340, w: 800, h: 260, xr: [-6, 8], yr: [-1.3, 1.8], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const b0 = 0, b1 = 1.6, a0 = S.at(0, 0.7);
            if (a0 > 0) r.rect(A.X(b0), A.Y(1.5), A.X(b1) - A.X(b0), A.Y(-1.3) - A.Y(1.5), { c: C.red, w: 2, fill: C.red, fa: 0.15, a: a0 });
            const kap = 1.3, tr = Math.exp(-kap * (b1 - b0)), w = 3 * S.w;
            const f = (x) => x < b0 ? Math.cos(3 * x - w) * 0.8 + 0.35 * Math.cos(-3 * x - w + 0.6) : x < b1 ? 0.95 * Math.exp(-kap * (x - b0)) * Math.cos(-w + 0.2) : tr * 0.95 * Math.cos(3 * (x - b1) - w + 0.2);
            K.plot(r, A, f, -6, 8, S.at(1, 1.6), { c: C.blue, w: 2.5, n: 600 });
            K.tex(r, S, 1, T`\kappa = \frac{\sqrt{2m(V-E)}}{\hbar}`, 260, 70, { size: 26 });
            K.tex(r, S, 2, T`T \approx 16\tfrac{E}{V}\big(1 - \tfrac{E}{V}\big)\,e^{-2\kappa a}`, 680, 70, { size: 26, c: C.yellow });
            K.calc(r, S, 3, 120, 410, [T`\kappa = 1.02\times10^{10}\ \text{m}^{-1},\ 2\kappa a = 10.2,\ T \approx 2.56\,e^{-10.2} \approx 9\times10^{-5}`], { size: 24, c: C.green, out: 4 });
            K.txt(r, S, 4, 'double the width ⇒ ~30 000 times less likely', 480, 430, { size: 21, align: 'center', c: C.yellow });
          } }
      ]],
      ['The quantum harmonic oscillator', [
        { tail: 2.6, say: ['Return to the potential from the second lecture in this series: the parabola, V equals one half m omega squared x squared. Every system near a stable minimum looks like this, so it is the most important potential in quantum physics.',
                'Solving the time-independent equation, the allowed energies come out evenly spaced: E n equals n plus a half, times h-bar omega. A ladder with equal rungs.',
                'The lowest state has energy one half h-bar omega, the zero-point energy. Its wavefunction is a Gaussian, the narrowest bump that the uncertainty principle allows in this well.',
                'Back to hydrogen chloride from the oscillations lecture, vibrating at 8.65 times ten to the thirteen hertz. The rungs are h f apart: 0.358 electronvolts, and the zero-point energy is half that, 0.18 electronvolts. Even at absolute zero, the molecule keeps vibrating. Its infrared absorption line is a jump of one rung.',
                'And the equal spacing has a famous consequence. Quantise the oscillating electromagnetic field the same way, and each rung is one more photon of energy h f. Planck\'s rule for light is the harmonic oscillator, quantised.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 90, y0: 440, w: 520, h: 370, xr: [-3.4, 3.4], yr: [0, 4.6], xl: 'x' });
            A.draw(S.at(0, 0.8)); K.plot(r, A, (x) => 0.5 * x * x, -3.03, 3.03, S.at(0, 1.2, 0.3), { c: C.greyB, w: 2.5 });
            for (let n = 0; n <= 3; n++) {
              const a = S.at(1, 0.5, n * 0.5); if (a <= 0) continue; const E = n + 0.5, xt = Math.sqrt(2 * E), col = [C.yellow, C.blue, C.green, C.red][n];
              r.line(A.X(-xt), A.Y(E), A.X(xt), A.Y(E), { c: col, w: 1.5, a: a * 0.7 });
              if (S.t > S.B[2] || n === 0) K.plot(r, A, (x) => E + 0.55 * qho(n, x) * Math.cos(E * 1.5 * S.w) * 1.6, -3.3, 3.3, a, { c: col, w: 2.2 });
            }
            K.tex(r, S, 1, T`E_n = \big(n + \tfrac12\big)\hbar\omega`, 790, 110, { size: 32, c: C.yellow });
            K.tex(r, S, 2, T`E_0 = \tfrac12\hbar\omega`, 790, 180, { size: 28, c: C.green });
            K.tex(r, S, 3, T`hf = 0.358\ \text{eV},\ E_0 = 0.18\ \text{eV}`, 780, 270, { size: 24, c: C.blue });
            K.txt(r, S, 4, 'one rung = one photon of energy hf', 780, 360, { size: 19, align: 'center', c: C.yellow });
          } }
      ]],
      ['From quantum to classical', [
        { tail: 2.6, say: ['If everything is a wave, why does a thrown ball follow a neat parabola? Ehrenfest\'s theorem answers part of it: the average position of a wave packet obeys Newton\'s second law, with the force averaged over the packet.',
                'For a ball, the packet is fantastically narrow compared with any distance over which the force changes, so the average is the whole story, and Newton\'s law is recovered.',
                'But packets also spread. Because the energy goes as k squared, different wavelengths travel at different speeds: the free particle is dispersive, like the stiff string in the waves lecture. A packet that starts narrow gets wider.',
                'For an electron squeezed to the size of an atom, the spreading is fast: a packet a tenth of a nanometre wide doubles in width in about three tenths of a femtosecond. For a one-gram bead localised to a micrometre, the doubling time is about three times ten to the nineteen seconds, nearly a hundred times the present age of the universe. That difference in scale is why the quantum world hides from us.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 400, w: 800, h: 240, xr: [-5, 9], yr: [0, 1.2], xl: 'x' });
            A.draw(S.at(0, 0.8));
            const tt = S.t > S.B[2] ? Math.min(4, 0.7 * (S.t - S.B[2])) : 0, w0 = 0.55, wt = w0 * Math.sqrt(1 + (tt * 0.9) ** 2), x0 = -3 + 1.6 * tt;
            K.plot(r, A, (x) => (w0 / wt) * Math.exp(-((x - x0) ** 2) / (2 * wt * wt)), -5, 9, S.at(0, 1, 0.4), { c: C.yellow, n: 400 });
            const a = S.at(1, 0.6); if (a > 0) r.dot(...A.pt(x0, 0), { r: 7, c: C.blue, a });
            K.tex(r, S, 0, T`m\frac{d^{2}\langle x\rangle}{dt^{2}} = \Big\langle -\frac{dV}{dx}\Big\rangle`, 480, 70, { size: 30 });
            K.tex(r, S, 3, T`t_{2\times} = \frac{2\sqrt3\,m\sigma^{2}}{\hbar}:\ \ \text{electron } 3\times10^{-16}\ \text{s};\ \ 1\ \text{g bead } 3\times10^{19}\ \text{s}`, 480, 450, { size: 22, c: C.green });
          } }
      ]],
      ['What the equation does not tell you', [
        { say: ['A fair lecture must end with the limits. First, the Schrödinger equation is not relativistic: it starts from E equals p squared over two m. For fast electrons, or for spin, you need Dirac\'s equation, and for particles being created and destroyed, quantum field theory.',
                'Second, the equation is linear and completely deterministic. Given psi now, it predicts psi later, exactly. Yet when you measure position, you get one definite answer, at random, with probabilities set by the modulus of psi squared. Nothing in the equation describes that jump.',
                'How a smooth, deterministic wave becomes a single random outcome is the measurement problem. Physicists still disagree about it, with interpretations from wavefunction collapse, to many worlds, to hidden variables. What nobody disputes are the predictions, which have been confirmed to extraordinary precision.',
                'So keep two things apart: the mathematics, which is clear and tested, and the story about what psi really is, which is still open. Being honest about where the second begins is part of doing physics well.'],
          draw(r, S) {
            K.list(r, S, [0, 1, 2], ['not relativistic: Dirac equation, quantum field theory', 'linear and deterministic between measurements', 'the measurement problem: still debated'], 160, 140, { dy: 70, size: 24 });
            K.txt(r, S, 3, 'tested mathematics ≠ settled interpretation', 480, 420, { size: 24, align: 'center', c: C.yellow });
          } },
        { say: ['Let us collect what we found.',
                'Matter has a wavelength, h over p, seen in electron interference and diffraction.',
                'The Schrödinger equation was guessed from p equals h-bar k, E equals h-bar omega and E equals p squared over two m. It is tested, not derived.',
                'The modulus of psi squared is a probability density; the phase controls interference. Stationary states obey minus h-bar squared over two m phi double-prime plus V phi equals E phi.',
                'Confinement quantises energy: E n equals n squared h squared over eight m L squared in a box, and n plus a half h-bar omega for the oscillator, with zero-point energy that never goes away.',
                'Uncertainty explains why atoms are stable and sets their size, and decaying waves let particles tunnel through barriers they cannot climb.',
                'MIT\'s 8.04 lectures, by Allan Adams and by Barton Zwiebach, take each of these steps slowly and carefully, and 3Blue1Brown\'s lesson on light quantum mechanics is a beautiful companion. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['λ = h/p: electrons interfere and diffract', 'iħ ∂ψ/∂t = −(ħ²/2m) ∂²ψ/∂x² + Vψ: guessed, then tested', '|ψ|² = probability density; phase ⇒ interference', 'box: Eₙ = n²h²/8mL²; oscillator: (n + ½)ħω', 'uncertainty: atoms are stable; tunnelling through barriers'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Simple harmonic motion (A-level → Year 1). References: MIT 8.03SC L1; 3Blue1Brown DE1. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  const shadeBox = (r, x, y, w, h, a = 1) => r.rr(x, y, w, h, 12, { c: 'rgba(88,196,221,0.35)', w: 1.5, fill: 'rgba(88,196,221,0.05)', fa: 1, a });
  // pendulum period ratio T/T0 for amplitude th0 (exact, via the arithmetic–geometric mean)
  const agm = (a, b) => { for (let i = 0; i < 30; i++) { const m = (a + b) / 2, g = Math.sqrt(a * b); a = m; b = g; } return a; };
  const pratio = (th0) => 1 / agm(1, Math.cos(th0 / 2));

  L.def({
    id: 'shm', order: 2, title: 'Simple harmonic motion', sub: 'Why so much of the universe wobbles, and how to calculate it',
    level: 'A-level → Year 1', topics: ['al-shm', 'y1-oscillators', 'al-damping'], thumb: [10, 30],
    refs: [
      ['MIT OCW 8.03SC (Yen-Jie Lee)', 'Lecture 1: Periodic oscillations, harmonic oscillators', 'https://www.ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/lecture-1-video-1/'],
      ['MIT OCW 8.03SC', 'Vibrations and Waves: all lectures and notes', 'https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/resource-index/'],
      ['3Blue1Brown', 'Differential equations, studying the unsolvable (the pendulum and phase space)', 'https://www.3blue1brown.com/lessons/differential-equations']
    ],
    chapters: [
      ['Why everything wobbles', [
        { say: ['This is a lecture about one equation, and about why nature keeps writing it down.',
                'Simple harmonic motion: the motion of a mass on a spring, a pendulum, an atom in a crystal, and the current in every radio.', 1.2],
          draw(r, S) {
            K.title(r, S, 'Simple harmonic motion', 'Why so much of the universe wobbles');
            const a = S.at(1, 1.2), pts = [];
            for (let i = 0; i <= 200; i++) { const x = 180 + i * 3; pts.push([x, 420 - 26 * Math.cos(TAU * (i / 60) - 2.2 * S.w)]); }
            r.poly(pts, { c: C.blue, w: 2.5, a: a * 0.9 });
          } },
        { say: ['Look at these four systems. A block on a spring. A pendulum. Two atoms joined by a chemical bond. And a capacitor discharging through a coil.',
                'They are made of completely different things, yet each one does the same dance: it overshoots, comes back, and overshoots again, with a steady rhythm.',
                'By the end of this lecture you will see that this is not a coincidence. There is one reason behind all four, and it fits in a single line.', 1.5],
          draw(r, S) {
            const w = S.w, a0 = S.at(0, 0.8);
            r.alpha(a0, () => {
              shadeBox(r, 40, 40, 420, 200); shadeBox(r, 500, 40, 420, 200); shadeBox(r, 40, 260, 420, 200); shadeBox(r, 500, 260, 420, 200);
              // spring and block
              K.springMass(r, 80, 150, 290 + 60 * Math.cos(TAU * 0.5 * w), { floor: 440, label: false });
              // pendulum
              const th = 0.5 * Math.cos(TAU * 0.45 * w), px = 710 + 130 * Math.sin(th), py = 62 + 130 * Math.cos(th);
              r.line(650, 62, 770, 62, { c: C.greyB, w: 3 }); r.line(710, 62, px, py, { c: C.greyB, w: 2 }); r.circle(px, py, 15, { c: C.yellow, fill: C.yellow, fa: 0.35, w: 2.5 });
              // two atoms on a bond
              const d = 18 * Math.cos(TAU * 0.8 * w), x1 = 175 - d, x2 = 325 + d;
              r.spring(x1 + 24, 360, x2 - 24, 360, { c: C.greyB, coils: 7, amp: 8 }); r.circle(x1, 360, 24, { c: C.teal, fill: C.teal, fa: 0.3 }); r.circle(x2, 360, 24, { c: C.teal, fill: C.teal, fa: 0.3 });
              // LC circuit
              const q = Math.cos(TAU * 0.55 * w), ib = -Math.sin(TAU * 0.55 * w);
              r.rr(590, 300, 240, 120, 6, { c: C.greyB, w: 2 }); r.rect(570, 340, 40, 40, { c: '#0c0e12', fill: '#0c0e12', fa: 1, stroke: false });
              r.line(574, 352, 606, 352, { c: q > 0 ? C.yellow : C.blue, w: 4 }); r.line(574, 368, 606, 368, { c: q > 0 ? C.blue : C.yellow, w: 4 });
              r.glow(590, 346, 26 * Math.abs(q), q > 0 ? C.yellow : C.blue, 0.5);
              r.rect(810, 330, 40, 60, { c: '#0c0e12', fill: '#0c0e12', fa: 1, stroke: false }); r.spring(830, 330, 830, 390, { c: C.gold, coils: 6, amp: 12 });
              r.arrow(700 - 40 * ib, 300, 700 + 40 * ib, 300, { c: C.green, w: 3, a: Math.min(1, Math.abs(ib) * 1.6), head: 11 });
              r.txt('spring', 60, 64, { size: 17, sans: true, c: C.dim }); r.txt('pendulum', 520, 64, { size: 17, sans: true, c: C.dim });
              r.txt('a chemical bond', 60, 284, { size: 17, sans: true, c: C.dim }); r.txt('a circuit (L and C)', 520, 284, { size: 17, sans: true, c: C.dim });
            });
            const e = S.at(2, 0.8); if (e > 0) { r.rr(330, 215, 300, 70, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.92, a: e }); K.tex(r, S, 2, T`\ddot{x} = -\,\omega^{2} x`, 480, 250, { size: 40, dl: 0.3 }); }
          } },
        { say: ['Here is the reason. Every one of these systems has a position where it is happy to sit still: an equilibrium. Plot the potential energy against the displacement, and that equilibrium is the bottom of a valley.',
                'The valley can have any shape. This one is lopsided, and far from the bottom it looks nothing like a neat curve.',
                'But zoom in near the bottom. The closer you look, the more the curve looks like a parabola.',
                'That is Taylor\'s theorem. Near a minimum, U of x is approximately U of zero, plus one half U double-prime of zero, times x squared.',
                'There is no term proportional to x, because the slope is zero at the bottom of a valley. That is what being at the bottom means.',
                'The force is minus the slope of the potential. Differentiate the parabola and you get F equals minus k x, with k equal to the curvature at the bottom.',
                'So any system, disturbed a little from a stable equilibrium, feels a restoring force proportional to its displacement. That is Hooke\'s law, and it is almost universal for one simple reason: small valleys look like parabolas.', 1],
          draw(r, S) {
            const U = (x) => 0.6 * x * x + 0.28 * x * x * x + 0.12 * x * x * x * x;
            const z = lerp(1, 0.22, S.at(2, 2.2)), A = K.axes(r, { x0: 60, y0: 420, w: 470, h: 330, xr: [-2.3 * z, 1.7 * z], yr: [-0.15 * z * z, 2.6 * z * z], xl: 'x', yl: 'U' });
            A.draw(S.at(0, 1));
            K.plot(r, A, U, -2.3 * z, 1.7 * z, S.at(0, 1.6, 0.4), { c: C.yellow });
            if (S.t > S.B[3]) K.plot(r, A, (x) => 0.6 * x * x, -2.3 * z, 1.7 * z, S.at(3, 1.4), { c: C.blue, w: 2.5, dash: [8, 6] });
            const xb = 0.55 * z * Math.cos(2.3 * S.w), pb = A.pt(xb, U(xb));
            r.alpha(S.at(0, 1, 0.8), () => { r.circle(pb[0], pb[1] - 11, 11, { c: C.teal, fill: C.teal, fa: 0.5 }); });
            K.tex(r, S, 3, T`U(x) \approx U(0) + \tfrac12 U''(0)\,x^{2}`, 565, 130, { size: 30, align: 'left' });
            K.tex(r, S, 4, T`U'(0) = 0 \;\;\text{(bottom of the valley)}`, 565, 200, { size: 26, align: 'left', c: C.greyB });
            K.tex(r, S, 5, T`F = -\frac{dU}{dx} = -k\,x`, 565, 280, { size: 34, align: 'left', c: C.yellow });
            K.tex(r, S, 5, T`k = U''(0)`, 565, 345, { size: 30, align: 'left', dl: 0.8 });
            if (S.t > S.B[6]) K.hl(r, S, 6, 560, 252, 290, 56);
          } },
        { say: [['Pause and think. What happens if the curvature at the equilibrium is negative?', 4],
                'Then the equilibrium is the top of a hill, not the bottom of a valley. The force pushes away from it, and a small push grows exponentially instead of oscillating. That is an unstable equilibrium, like a pencil balanced on its point.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['What if U″(0) is negative?'], { y: 110 });
            const a = S.at(1, 0.8); if (a <= 0) return;
            const s = Math.max(0, S.since(1)), X = (x) => 480 + x * 170, Y = (x) => 300 + 95 * x * x;
            const pts = []; for (let i = 0; i <= 80; i++) { const x = -1.2 + (2.4 * i) / 80; pts.push([X(x), Y(x)]); }
            r.poly(pts, { c: C.red, w: 3, a });
            const xb = Math.min(1.15, 0.02 * Math.exp(1.6 * s)), sl = 190 * xb, n = Math.hypot(1, sl / 170);
            r.circle(X(xb) + 12 * (sl / 170) / n, Y(xb) - 12 / n, 12, { c: C.teal, fill: C.teal, fa: 0.5, a });
            r.txt('unstable: a small displacement grows like e^(+λt)', 480, 250, { size: 18, align: 'center', c: C.dim, sans: true, a });
          } }
      ]],
      ['The equation of motion', [
        { say: ['Let us make it concrete with a block of mass m on a spring of stiffness k, sliding without friction.',
                'Pull it to the right, and the spring pulls back to the left. Push it left, and the spring pushes right. The force always points back towards equilibrium, and its size is k times the displacement.',
                'Newton\'s second law turns that into an equation: m times the acceleration, which is the second derivative of x, equals minus k x.',
                'Divide by m and give k over m a new name, omega squared. The equation becomes x double-dot equals minus omega squared x.',
                'Read it as a sentence: the acceleration is always proportional to the displacement, and opposite to it. That sentence is the definition of simple harmonic motion.'],
          draw(r, S) {
            const x = 140 * Math.cos(2.1 * S.w), bx = 480 + x;
            r.alpha(S.at(0, 0.8), () => {
              K.springMass(r, 150, 170, bx, { floor: 860 });
              r.line(480, 112, 480, 214, { c: C.dim, w: 1.5, dash: [5, 5] }); r.txt('equilibrium', 480, 98, { size: 15, sans: true, c: C.dim, align: 'center' });
            });
            const fa = S.at(1, 0.6); if (fa > 0 && Math.abs(x) > 4) { r.arrow(bx, 236, bx - 0.75 * x, 236, { c: C.red, w: 4, a: fa, head: 12 }); r.tex('F', bx - 0.4 * x, 262, { size: 24, c: C.red, a: fa }); }
            if (fa > 0) { r.line(480, 250, bx, 250, { c: C.yellow, w: 2, a: fa * 0.8 }); r.tex('x', (480 + bx) / 2, 236 - 18, { size: 22, c: C.yellow, a: fa * (Math.abs(x) > 20 ? 1 : 0) }); }
            K.tex(r, S, 2, T`m\,\ddot{x} = -k\,x`, 300, 340, { size: 40 });
            K.tex(r, S, 3, T`\ddot{x} = -\,\omega^{2} x,\qquad \omega^{2} = \frac{k}{m}`, 640, 340, { size: 36, c: C.yellow });
            if (S.t > S.B[4]) K.hl(r, S, 4, 510, 305, 260, 70);
            K.txt(r, S, 4, 'acceleration ∝ −displacement', 480, 425, { size: 22, align: 'center', c: C.greyB, dl: 0.6 });
          } },
        { say: ['Now we need a function of time whose second derivative is minus a constant times itself. Do you know one?', 1.5,
                'Cosine. The derivative of cos t is minus sin t, and the derivative of minus sin t is minus cos t. Two derivatives bring you back to the start, with a minus sign.',
                'To get the constant omega squared, squeeze the time axis: use cos of omega t. Each derivative pulls out a factor of omega by the chain rule, so two derivatives pull out omega squared.',
                'So x equals A cos of omega t plus phi solves the equation, for any amplitude A and any phase phi.'],
          draw(r, S) {
            const rows = [[T`f(t) = \cos t`, (t) => Math.cos(t), C.yellow], [T`f'(t) = -\sin t`, (t) => -Math.sin(t), C.blue], [T`f''(t) = -\cos t`, (t) => -Math.cos(t), C.red]];
            rows.forEach(([tx, f, c], i) => {
              const k = i === 0 ? 0 : 2, dl = i === 0 ? 0.3 : (i - 1) * 1.6, a = S.at(k, 0.8, dl); if (a <= 0) return;
              const yz = 110 + i * 120 - 40;
              r.line(90, yz, 520, yz, { c: C.greyD, w: 1.5, a });
              const pts = []; for (let j = 0; j <= 200; j++) { const t = (4 * Math.PI * j) / 200; pts.push([90 + (420 * j) / 200, yz - 34 * f(t)]); }
              r.poly(pts, { c, w: 3, p: S.at(k, 1.4, dl) });
              r.tex(tx, 600, yz, { size: 28, align: 'left', c, a });
            });
            if (S.t > S.B[2] + 3.4) r.arcArrow(560, 330, 230, Math.PI * 0.84, Math.PI * 1.16, { c: C.greyB, w: 2, p: S.in(S.B[2] + 3.4, 1) });
            K.tex(r, S, 3, T`\frac{d^{2}}{dt^{2}}\cos(\omega t) = -\,\omega^{2}\cos(\omega t)`, 480, 440, { size: 30, out: 4 });
            const e = S.at(4, 0.7); if (e > 0) { r.rr(250, 405, 460, 70, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: e }); K.tex(r, S, 4, T`x(t) = A\cos(\omega t + \varphi)`, 480, 440, { size: 36, c: C.yellow, dl: 0.2 }); }
          } },
        { say: ['Let us check it rather than trust it. Start from x equals A cos of omega t plus phi.',
                'Differentiate once: the velocity is minus A omega sin of omega t plus phi.',
                'Differentiate again: the acceleration is minus A omega squared cos of omega t plus phi.',
                'And that is exactly minus omega squared times x. The equation holds at every instant.',
                'Because the equation is second order, its general solution needs two constants, and here they are: A and phi. They are fixed by how you start the motion: where the block is, and how fast it is moving, at time zero.'],
          draw(r, S) {
            K.calc(r, S, 0, 120, 110, [T`x = A\cos(\omega t+\varphi)`, T`\dot{x} = -A\omega\sin(\omega t+\varphi)`, T`\ddot{x} = -A\omega^{2}\cos(\omega t+\varphi)`, T`\ddot{x} = -\,\omega^{2}\,x \;\;\checkmark`], { dy: 70, size: 34, box: true });
            K.tex(r, S, 4, T`A,\ \varphi \;\longleftarrow\; x(0),\ \dot{x}(0)`, 720, 230, { size: 32, c: C.blue });
            K.txt(r, S, 4, 'two constants for a second-order equation', 720, 290, { size: 18, align: 'center', c: C.dim, sans: true, dl: 0.8 });
          } },
        { say: ['Each symbol has a picture. A is the amplitude: the largest displacement.',
                'Omega is the angular frequency, in radians per second. The motion repeats when omega t grows by two pi, so the period is T equals two pi over omega.',
                'Phi, the phase, slides the whole curve left or right. It says where in the cycle the motion is when the clock starts.',
                'Putting omega back in terms of the spring: T equals two pi root m over k. A heavier block is slower, and a stiffer spring is faster. Both make sense.'],
          draw(r, S) {
            const ph = 0.9 * S.at(2, 1.6), A = K.axes(r, { x0: 80, y0: 330, w: 780, h: 240, xr: [0, 4.2 * Math.PI], yr: [-1.25, 1.25], xl: 't', yl: 'x' });
            A.draw(S.at(0, 0.8));
            if (S.t > S.B[2]) K.plot(r, A, (t) => Math.cos(t), 0, 4.2 * Math.PI, 1, { c: C.greyB, w: 2, dash: [6, 6], a: 0.6 });
            K.plot(r, A, (t) => Math.cos(t + ph), 0, 4.2 * Math.PI, S.at(0, 1.6, 0.3));
            const a1 = S.at(0, 0.6, 1.2); if (a1 > 0) { const t0 = TAU - ph; r.arrow(A.X(t0), A.Y(0), A.X(t0), A.Y(1), { c: C.blue, w: 3, both: true, head: 10, a: a1 }); r.tex('A', A.X(t0) + 22, A.Y(0.5), { size: 28, c: C.blue, a: a1 }); }
            const a2 = S.at(1, 0.6); if (a2 > 0) { const t1 = TAU - ph, t2 = 2 * TAU - ph; r.brace(A.X(t1), A.Y(1.12), A.X(t2), A.Y(1.12), { side: -1, c: C.green, a: a2, tex: T`T = \frac{2\pi}{\omega}`, size: 26, gap: 28 }); }
            const a3 = S.at(2, 0.6); if (a3 > 0) { r.arrow(A.X(0), A.Y(-1.12), A.X(ph), A.Y(-1.12), { c: C.red, w: 2.5, head: 9, a: a3 }); r.tex(T`\varphi/\omega`, A.X(ph / 2) + 4, A.Y(-1.12) + 26, { size: 22, c: C.red, a: a3 }); }
            K.tex(r, S, 3, T`T = 2\pi\sqrt{\frac{m}{k}}`, 480, 420, { size: 38, c: C.yellow });
          } },
        { say: ['Whenever you meet a new formula, check its units before you trust it. Inside the square root, m over k is kilograms divided by newtons per metre.',
                'A newton is a kilogram metre per second squared, so the kilograms and metres cancel and we are left with seconds squared. The square root is seconds: a period, as it should be.',
                'This check is not just bookkeeping. It tells you the period cannot depend on the amplitude alone: there is no way to make a time out of a length and the spring constant without the mass.', 1],
          draw(r, S) {
            K.calc(r, S, 0, 160, 120, [T`\left[\frac{m}{k}\right] = \frac{\text{kg}}{\text{N m}^{-1}} = \frac{\text{kg m}}{\text{N}}`, T`\text{N} = \text{kg m s}^{-2}\ \Rightarrow\ \left[\frac{m}{k}\right] = \text{s}^{2}`, T`\left[2\pi\sqrt{m/k}\right] = \text{s}\ \checkmark`], { ks: [0, 1, 1], dy: 86, size: 34, box: true });
            K.txt(r, S, 2, 'm, k and A: only m/k can make a time', 480, 420, { size: 22, align: 'center', c: C.greyB });
          } },
        { say: ['Now something that surprises almost everyone. The period does not depend on the amplitude.',
                'Here are two identical springs. One block starts three times further out. It has three times as far to travel, but it also feels three times the force, so it moves three times as fast. They pass the centre together.',
                'The deep reason is that the equation is linear. If x of t is a solution, then three times x of t is also a solution, with exactly the same time dependence.',
                'This is why pendulums made good clocks: the swing slowly dies away, but the period hardly changes.'],
          draw(r, S) {
            const c = Math.cos(2.0 * S.w);
            r.alpha(S.at(0, 0.8), () => {
              K.springMass(r, 150, 140, 520 + 45 * c, { floor: 880, label: false, c: C.teal });
              K.springMass(r, 150, 300, 520 + 135 * c, { floor: 880, label: false, c: C.yellow });
              r.line(520, 70, 520, 350, { c: C.dim, w: 1.5, dash: [5, 5] });
            });
            K.txt(r, S, 1, 'amplitude A', 700, 120, { size: 18, sans: true, c: C.teal }); K.txt(r, S, 1, 'amplitude 3A: same period', 700, 280, { size: 18, sans: true, c: C.yellow });
            K.tex(r, S, 2, T`\ddot{x} = -\omega^{2}x \;\Rightarrow\; \frac{d^{2}(3x)}{dt^{2}} = -\omega^{2}(3x)`, 480, 425, { size: 30 });
          } }
      ]],
      ['The circle behind the wave', [
        { say: ['There is a beautiful way to see where the cosine comes from. Take a point moving round a circle of radius A, at a steady angular speed omega.',
                'Now look only at its shadow on a vertical wall, as if it were lit from the side. The shadow slides up and down.',
                'Its height is A cos of omega t plus phi. Uniform circular motion, seen edge-on, is simple harmonic motion.',
                'Unroll the shadow\'s height against time, and the cosine draws itself.', 2],
          draw(r, S) {
            const cx = 230, cy = 255, R = 120, om = 1.15, th = om * S.w, a0 = S.at(0, 0.8);
            const px = cx + R * Math.sin(th), py = cy - R * Math.cos(th);
            r.circle(cx, cy, R, { c: C.greyB, w: 2, a: a0 }); r.line(cx - R - 20, cy, cx + R + 20, cy, { c: C.greyD, w: 1.5, a: a0 });
            r.alpha(a0, () => { r.line(cx, cy, px, py, { c: C.greyB, w: 2 }); r.dot(px, py, { r: 8, c: C.yellow }); });
            const a1 = S.at(1, 0.8), wx = 420;
            if (a1 > 0) { r.line(wx, cy - R - 30, wx, cy + R + 30, { c: C.dim, w: 2, a: a1 }); r.line(px, py, wx, py, { c: C.yellow, w: 1.5, dash: [4, 5], a: a1 * 0.8 }); r.dot(wx, py, { r: 7, c: C.blue, a: a1 }); }
            K.tex(r, S, 2, T`x = A\cos(\omega t + \varphi)`, 230, 440, { size: 30, c: C.blue });
            const a3 = S.at(3, 0.8);
            if (a3 > 0) {
              const pts = [], span = Math.min(S.since(3), 7.5);
              for (let i = 0; i <= 160; i++) { const tau = S.w - (span * i) / 160; pts.push([wx + (span * i) / 160 * 62, cy - R * Math.cos(om * tau)]); }
              r.poly(pts, { c: C.blue, w: 3, a: a3 }); r.line(wx, cy, 900, cy, { c: C.greyD, w: 1.2, a: a3 }); r.txt('time →', 880, cy + 22, { size: 15, sans: true, c: C.dim, align: 'right', a: a3 });
            }
          } },
        { say: ['The circle also hands us the velocity and the acceleration, with no calculus at all.',
                'The point moves with speed A omega, along the tangent. The shadow only sees the vertical part of that velocity, which is minus A omega sin of omega t plus phi.',
                'The point accelerates towards the centre, with size A omega squared. The vertical part of that is minus omega squared times the shadow\'s height. There is the equation of motion again, read straight off the picture.',
                'So the speed is greatest, A omega, as the block passes the centre, and the acceleration is greatest, A omega squared, at the ends, where the block is momentarily at rest.'],
          draw(r, S) {
            const cx = 230, cy = 255, R = 120, om = 0.8, th = om * S.w, px = cx + R * Math.sin(th), py = cy - R * Math.cos(th);
            r.circle(cx, cy, R, { c: C.greyB, w: 2 }); r.line(cx, cy, px, py, { c: C.greyD, w: 2 }); r.dot(px, py, { r: 7, c: C.yellow });
            const wx = 420; r.line(wx, cy - R - 30, wx, cy + R + 30, { c: C.dim, w: 2 }); r.line(px, py, wx, py, { c: C.yellow, w: 1.2, dash: [4, 5], a: 0.6 }); r.dot(wx, py, { r: 6, c: C.blue });
            const av = S.at(1, 0.7); if (av > 0) {
              const vx = Math.cos(th), vy = Math.sin(th), Lv = 90;
              r.arrow(px, py, px + Lv * vx, py + Lv * vy, { c: C.green, w: 3, a: av, head: 11 });
              r.arrow(wx, py, wx, py + Lv * vy, { c: C.green, w: 4, a: av, head: 11 });
            }
            const aa = S.at(2, 0.7); if (aa > 0) {
              const ux = (cx - px) / R, uy = (cy - py) / R, La = 75;
              r.arrow(px, py, px + La * ux, py + La * uy, { c: C.red, w: 3, a: aa, head: 11 });
              r.arrow(wx + 16, py, wx + 16, py + La * uy, { c: C.red, w: 4, a: aa, head: 11 });
            }
            K.tex(r, S, 1, T`v = -A\omega\sin(\omega t+\varphi)`, 560, 140, { size: 30, align: 'left', c: C.green });
            K.tex(r, S, 2, T`a = -A\omega^{2}\cos(\omega t+\varphi) = -\,\omega^{2}x`, 560, 220, { size: 28, align: 'left', c: C.red });
            K.tex(r, S, 3, T`v_{\max} = A\omega`, 560, 310, { size: 32, align: 'left' });
            K.tex(r, S, 3, T`a_{\max} = A\omega^{2}`, 560, 370, { size: 32, align: 'left', dl: 0.8 });
          } },
        { say: [['Pause and think. Where is the block when its speed is half of its maximum?', 4],
                'Use the speed formula we will meet in a moment, or the circle. Half the top speed means the sine is one half, so the cosine is root three over two. The block is at 0.87 of the amplitude: most of the way out, not half way. It spends most of its time near the ends, moving slowly.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Where is the block when |v| = ½ v_max?'], { y: 90 });
            const a = S.at(1, 0.8); if (a <= 0) return;
            const cx = 480, cy = 330, R = 110, th = Math.PI / 6;
            r.alpha(a, () => {
              r.circle(cx, cy, R, { c: C.greyB, w: 2 }); r.line(cx - R - 20, cy, cx + R + 20, cy, { c: C.greyD, w: 1.5 });
              const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th); r.line(cx, cy, px, py, { c: C.greyB, w: 2 }); r.dot(px, py, { r: 7, c: C.yellow });
              r.line(px, py, px, cy, { c: C.yellow, w: 1.5, dash: [4, 4] }); r.dot(px, cy, { r: 6, c: C.blue });
              r.angle(cx, cy, 40, 0, th, { c: C.red, tex: T`30^{\circ}`, size: 18 });
              r.tex(T`x = A\cos 30^{\circ} = 0.87A`, cx + 250, cy - 10, { size: 26, c: C.blue });
            });
          } },
        { say: ['One more picture, borrowed from the study of differential equations. Plot the state of the oscillator as a single point: position across, and velocity divided by omega up.',
                'As the block moves, this point goes round a circle. Every possible motion is a circle around the origin, and bigger circles mean more energy.',
                'This picture is called phase space, and it will carry you a long way. Damping turns the circles into inward spirals, and in quantum mechanics this same plane is where the uncertainty principle lives.', 1],
          draw(r, S) {
            const om = 1.3, x = Math.cos(om * S.w), v = -Math.sin(om * S.w);
            r.alpha(S.at(0, 0.8), () => K.springMass(r, 60, 140, 250 + 110 * x, { floor: 420, label: false }));
            const A = K.axes(r, { x0: 520, y0: 440, w: 380, h: 380, xr: [-1.5, 1.5], yr: [-1.5, 1.5], xl: 'x', yl: 'v/ω' });
            A.draw(S.at(0, 1));
            const O = A.pt(0, 0), sc = (A.X(1) - A.X(0));
            if (S.t > S.B[1]) [0.45, 0.8, 1.15, 1.4].forEach((q, i) => r.circle(O[0], O[1], q * sc, { c: C.blue, w: 1.5, a: 0.4 * S.at(1, 0.8, i * 0.3) }));
            const trail = []; for (let i = 0; i <= 60; i++) { const tt = S.w - i * 0.05; trail.push(A.pt(Math.cos(om * tt), -Math.sin(om * tt))); }
            r.alpha(S.at(0, 1, 0.6), () => { r.fade(trail.reverse(), { c: C.yellow, w: 3 }); r.dot(...A.pt(x, v), { r: 7, c: C.yellow }); });
            const sp = S.at(2, 1.5); if (sp > 0) { const pts = []; for (let i = 0; i <= 300; i++) { const s = i * 0.06, a = 1.3 * Math.exp(-0.12 * s); pts.push(A.pt(a * Math.cos(s), -a * Math.sin(s))); } r.poly(pts, { c: C.red, w: 2, p: sp, a: 0.85 }); r.txt('damped: a spiral', A.X(0.35), A.Y(-1.35), { size: 16, sans: true, c: C.red, a: sp }); }
          } }
      ]],
      ['Energy: where the motion goes', [
        { say: ['Now follow the energy. The spring stores potential energy, one half k x squared. The block carries kinetic energy, one half m v squared.',
                'Watch the bars. At the ends, all the energy is in the spring. At the centre, all of it is in the motion. The total never changes, because there is no friction.',
                'At the ends the total is one half k A squared. So the energy of an oscillator grows as the square of its amplitude: double the swing, and you store four times the energy.'],
          draw(r, S) {
            const om = 1.4, c = Math.cos(om * S.w), PE = c * c, KE = 1 - PE;
            K.springMass(r, 120, 140, 480 + 150 * c, { floor: 850 });
            const a = S.at(0, 0.8), y0 = 440, Hm = 200;
            r.alpha(a, () => {
              r.line(300, y0, 660, y0, { c: C.greyB, w: 2 });
              r.rect(340, y0 - Hm * PE, 80, Hm * PE, { c: C.yellow, fill: C.yellow, fa: 0.55, w: 2 });
              r.rect(540, y0 - Hm * KE, 80, Hm * KE, { c: C.blue, fill: C.blue, fa: 0.55, w: 2 });
              r.line(320, y0 - Hm, 640, y0 - Hm, { c: C.green, w: 2, dash: [8, 6] });
              r.tex(T`\tfrac12 kx^{2}`, 380, y0 + 26, { size: 22, c: C.yellow }); r.tex(T`\tfrac12 mv^{2}`, 580, y0 + 26, { size: 22, c: C.blue });
            });
            K.txt(r, S, 1, 'total', 660, y0 - Hm - 2, { size: 16, sans: true, c: C.green });
            K.tex(r, S, 2, T`E = \tfrac12 kA^{2}`, 800, 300, { size: 36, c: C.green });
          } },
        { say: ['Energy conservation also gives the speed at any position, without solving for time.',
                'Set one half m v squared, plus one half k x squared, equal to one half k A squared.',
                'Rearrange, and use k over m equals omega squared. The speed is omega times the square root of A squared minus x squared.',
                'At x equals zero this gives the top speed, A omega: the same answer the circle gave us. At x equals A it gives zero, the turning point.'],
          draw(r, S) {
            K.calc(r, S, 1, 80, 150, [T`\tfrac12 mv^{2} + \tfrac12 kx^{2} = \tfrac12 kA^{2}`, T`v^{2} = \frac{k}{m}\,(A^{2} - x^{2})`, T`v = \pm\,\omega\sqrt{A^{2} - x^{2}}`], { ks: [1, 2, 2], dy: 80, size: 32, box: true, dl: 0 });
            const A = K.axes(r, { x0: 600, y0: 360, w: 300, h: 220, xr: [-1.2, 1.2], yr: [-1.2, 1.2], xl: 'x', yl: 'v' });
            A.draw(S.at(2, 0.8));
            if (S.t > S.B[2]) { K.plot(r, A, (x) => Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, S.at(2, 1.2, 0.5), { c: C.blue }); K.plot(r, A, (x) => -Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, S.at(2, 1.2, 0.5), { c: C.blue }); }
            const a = S.at(3, 0.6); if (a > 0) { K.pin(r, ...A.pt(0, 1), 'Aω', { a, c: C.yellow }); K.pin(r, ...A.pt(1, 0), 'turning point', { a, c: C.red, dy: 22, dx: -40 }); }
          } }
      ]],
      ['Worked examples', [
        { say: ['Time to calculate. A block of mass 0.50 kilograms sits on a spring of stiffness 200 newtons per metre. It is pulled 3.0 centimetres from equilibrium and released. Find the angular frequency, the period, the top speed, the top acceleration, and the energy.',
                'Angular frequency first. Omega is the square root of k over m: the root of 200 over 0.5, which is the root of 400, so 20 radians per second.',
                'The period is two pi over omega: 0.314 seconds. The frequency is its inverse, 3.18 hertz.',
                'The top speed is A omega: 0.030 metres times 20, which is 0.60 metres per second.',
                'The top acceleration is A omega squared: 0.030 times 400, or 12 metres per second squared. More than the acceleration due to gravity, from a gentle three-centimetre pull.',
                'And the energy is one half k A squared: one half, times 200, times 0.03 squared, which is 0.090 joules.',
                'Always check with a second route. One half m v max squared is one half, times 0.5, times 0.36: also 0.090 joules. Two routes agree, so we can trust both.'],
          draw(r, S) {
            r.alpha(S.at(0, 0.8), () => { r.rr(60, 40, 840, 86, 12, { c: C.blue, w: 2, fill: C.blue, fa: 0.08 }); });
            K.tex(r, S, 0, T`m = 0.50\ \text{kg},\quad k = 200\ \text{N m}^{-1},\quad A = 3.0\ \text{cm}`, 480, 83, { size: 30, dl: 0.4 });
            const rows = [T`\omega = \sqrt{k/m} = \sqrt{400} = 20\ \text{rad s}^{-1}`, T`T = 2\pi/\omega = 0.314\ \text{s},\ \ f = 3.18\ \text{Hz}`, T`v_{\max} = A\omega = 0.60\ \text{m s}^{-1}`, T`a_{\max} = A\omega^{2} = 12\ \text{m s}^{-2}`];
            K.calc(r, S, 1, 70, 180, rows, { dy: 62, size: 27 });
            K.tex(r, S, 5, T`E = \tfrac12 kA^{2} = 0.090\ \text{J}`, 560, 270, { size: 30, align: 'left', c: C.green });
            K.tex(r, S, 6, T`\tfrac12 m v_{\max}^{2} = \tfrac12(0.5)(0.36) = 0.090\ \text{J}\ \checkmark`, 560, 350, { size: 24, align: 'left', c: C.greyB });
          } },
        { say: ['Example two. Hang the same kind of spring vertically. Now gravity also acts. Does that change the motion?',
                'Measure x downwards from the spring\'s natural length. Newton\'s law reads m x double-dot equals m g minus k x.',
                'The constant term only moves the equilibrium. Define y as x minus m g over k: the distance from the new resting point. Then m y double-dot equals minus k y. The same equation, with the same omega.',
                'Here is a lovely consequence. At rest, the spring stretches by delta, which is m g over k. So k over m equals g over delta, and omega is the square root of g over delta.',
                'If a mass stretches a spring by 9.8 centimetres, omega is the root of 9.81 over 0.098, which is 10.0 radians per second, and the period is 0.628 seconds. You found the period with a ruler, without knowing the mass or the stiffness.'],
          draw(r, S) {
            const top = 60, nat = 200, del = 70, eq = nat + del, y = eq + 50 * Math.cos(3.0 * S.w);
            r.alpha(S.at(0, 0.8), () => {
              r.line(110, top, 250, top, { c: C.greyB, w: 4 }); r.spring(180, top, 180, y - 26, { c: C.greyB, coils: 11, amp: 12 });
              r.rr(150, y - 26, 60, 52, 6, { c: C.blue, fill: C.blue, fa: 0.25, w: 2.5 }); r.tex('m', 180, y, { size: 24 });
              r.line(110, nat, 250, nat, { c: C.dim, w: 1.2, dash: [4, 5] }); r.txt('natural length', 260, nat, { size: 14, sans: true, c: C.dim });
            });
            const a3 = S.at(2, 0.6); if (a3 > 0) { r.line(110, eq, 250, eq, { c: C.yellow, w: 1.5, dash: [6, 5], a: a3 }); r.txt('new equilibrium', 260, eq, { size: 14, sans: true, c: C.yellow, a: a3 }); }
            const a4 = S.at(3, 0.6); if (a4 > 0) r.brace(95, nat, 95, eq, { side: 1, c: C.green, a: a4, tex: T`\delta`, size: 24, gap: 18 });
            K.tex(r, S, 1, T`m\ddot{x} = mg - kx`, 460, 110, { size: 32, align: 'left' });
            K.tex(r, S, 2, T`y = x - \frac{mg}{k}\ \Rightarrow\ m\ddot{y} = -k\,y`, 460, 180, { size: 30, align: 'left' });
            K.tex(r, S, 3, T`\delta = \frac{mg}{k}\ \Rightarrow\ \omega = \sqrt{\frac{g}{\delta}}`, 460, 260, { size: 32, align: 'left', c: C.yellow });
            K.tex(r, S, 4, T`\delta = 0.098\ \text{m}:\ \ \omega = 10.0\ \text{rad s}^{-1},\ T = 0.628\ \text{s}`, 460, 350, { size: 26, align: 'left', c: C.green });
          } },
        { say: ['Example three: the pendulum. The component of gravity along the arc is m g sin theta, pulling back towards the bottom.',
                'So L times theta double-dot equals minus g sin theta. That is not quite simple harmonic, because sin theta is not proportional to theta.',
                'But for small angles, sin theta is very nearly theta. Then theta double-dot equals minus g over L, times theta, and the period is two pi root L over g.',
                'For a one-metre pendulum that is two pi root of 1 over 9.81, which is 2.01 seconds. That is why a one-metre pendulum ticks almost exactly once a second, each way.',
                'How small is small? Here sin theta and theta are plotted together. At twenty degrees they differ by two percent, and the true period is longer by only about 0.8 percent. At ninety degrees the period is eighteen percent longer. The approximation fails gracefully.'],
          draw(r, S) {
            const px0 = 200, py0 = 60, Lp = 230, th = 0.42 * Math.cos(2.0 * S.w), bx = px0 + Lp * Math.sin(th), by = py0 + Lp * Math.cos(th);
            r.alpha(S.at(0, 0.8), () => {
              r.line(120, py0, 280, py0, { c: C.greyB, w: 4 }); r.line(px0, py0, px0, py0 + Lp + 20, { c: C.greyD, w: 1.2, dash: [4, 5] });
              r.line(px0, py0, bx, by, { c: C.greyB, w: 2 }); r.circle(bx, by, 16, { c: C.yellow, fill: C.yellow, fa: 0.35, w: 2.5 });
              r.angle(px0, py0, 70, -Math.PI / 2, -Math.PI / 2 + th, { c: C.blue, tex: T`\theta`, size: 20 });
              const g = 70; r.arrow(bx, by, bx, by + g, { c: C.red, w: 2.5, head: 9, a: 0.9 });
              const tx = -Math.cos(th), ty = Math.sin(th), comp = g * Math.sin(th); r.arrow(bx, by, bx + tx * comp * 1.0 * Math.sign(1), by + ty * comp, { c: C.green, w: 3, head: 9 });
            });
            K.tex(r, S, 1, T`L\,\ddot{\theta} = -g\sin\theta`, 470, 100, { size: 32, align: 'left' });
            K.tex(r, S, 2, T`\sin\theta \approx \theta\ \Rightarrow\ T = 2\pi\sqrt{\frac{L}{g}}`, 470, 175, { size: 32, align: 'left', c: C.yellow });
            K.tex(r, S, 3, T`L = 1.00\ \text{m}:\ T = 2.01\ \text{s}`, 470, 250, { size: 28, align: 'left', c: C.green });
            const a4 = S.at(4, 0.8); if (a4 > 0) {
              const A = K.axes(r, { x0: 470, y0: 445, w: 260, h: 140, xr: [0, 1.6], yr: [0, 1.6], xl: 'θ' });
              r.alpha(a4, () => { A.draw(1); K.plot(r, A, (x) => x, 0, 1.6, 1, { c: C.blue, w: 2 }); K.plot(r, A, Math.sin, 0, 1.6, 1, { c: C.yellow, w: 2.5 }); });
              r.tex(T`20^{\circ}:\ +0.8\%`, 840, 350, { size: 22, c: C.green, a: a4 }); r.tex(T`90^{\circ}:\ +18\%`, 840, 395, { size: 22, c: C.red, a: a4 });
            }
          } },
        { say: ['Example four, the one students find hardest: finding A and phi from the start. An oscillator with omega equal to 10 radians per second starts at x equals 2.0 centimetres, moving outwards at 0.30 metres per second.',
                'At t equals zero, x is A cos phi, and v is minus A omega sin phi. That is two equations for two unknowns.',
                'Square and add: A squared equals x nought squared, plus v nought over omega, squared. So A is the square root of 0.02 squared plus 0.03 squared: 3.61 centimetres.',
                'Divide them: tan phi equals minus v nought over omega x nought, which is minus 1.5. With cos phi positive and sin phi negative, phi is minus 0.983 radians, about minus 56 degrees.',
                'Check: minus A omega sin phi is minus 0.0361 times 10 times sin of minus 0.983, which is 0.300 metres per second. Correct.',
                'A warning about this step: the inverse tangent on your calculator cannot tell which quadrant you are in. Always check the signs of cos phi and sin phi separately.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\omega = 10\ \text{s}^{-1},\quad x_0 = 0.020\ \text{m},\quad v_0 = +0.30\ \text{m s}^{-1}`, 480, 70, { size: 28, dl: 0.4 });
            K.calc(r, S, 1, 60, 140, [T`x_0 = A\cos\varphi,\quad v_0 = -A\omega\sin\varphi`, T`A = \sqrt{x_0^{2} + (v_0/\omega)^{2}} = 3.61\ \text{cm}`, T`\tan\varphi = -\frac{v_0}{\omega x_0} = -1.5\ \Rightarrow\ \varphi = -0.983`, T`-A\omega\sin\varphi = 0.300\ \text{m s}^{-1}\ \checkmark`], { dy: 72, size: 26 });
            const A = K.axes(r, { x0: 640, y0: 440, w: 280, h: 280, xr: [-4.4, 4.4], yr: [-4.4, 4.4], xl: 'x', yl: 'v/ω' }), a = S.at(2, 0.8);
            if (a > 0) {
              r.alpha(a, () => { A.draw(1); const O = A.pt(0, 0); r.circle(O[0], O[1], 3.61 * (A.X(1) - A.X(0)), { c: C.blue, w: 2 }); r.line(O[0], O[1], ...A.pt(2, 3), { c: C.yellow, w: 2 }); r.dot(...A.pt(2, 3), { r: 7, c: C.yellow }); });
              const b = S.at(3, 0.6); if (b > 0) { const O = A.pt(0, 0); r.angle(O[0], O[1], 36, 0, Math.atan2(3, 2), { c: C.red, a: b }); r.txt('−φ = 56°', O[0] + 46, O[1] - 46, { size: 16, sans: true, c: C.red, a: b }); }
            }
            K.txt(r, S, 5, '⚠ arctan alone cannot tell the quadrant', 60, 440, { size: 20, c: C.red, sans: true });
          } }
      ]],
      ['The same equation everywhere', [
        { say: ['Example five shows that the equation does not care what it is made of. In a circuit with an inductor L and a capacitor C, the voltages around the loop add to zero: L times the rate of change of current, plus q over C.',
                'The current is the rate of change of charge, so L q double-dot equals minus q over C. That is our equation, with omega squared equal to one over L C.',
                'Take L equal to 10 millihenries and C equal to 1.0 microfarad. Then L C is ten to the minus eight, omega is ten thousand radians per second, and the circuit rings at 1.59 kilohertz.',
                'The energy story is the same too. One half q squared over C plays the part of the spring\'s energy, and one half L I squared plays the part of the kinetic energy. The capacitor is the spring; the inductor is the mass.'],
          draw(r, S) {
            const q = Math.cos(2.2 * S.w), I = -Math.sin(2.2 * S.w);
            r.alpha(S.at(0, 0.8), () => {
              r.rr(90, 120, 300, 200, 8, { c: C.greyB, w: 2.5 });
              r.rect(70, 190, 40, 60, { c: '#0c0e12', fill: '#0c0e12', fa: 1, stroke: false });
              r.line(72, 210, 108, 210, { c: q > 0 ? C.yellow : C.blue, w: 5 }); r.line(72, 230, 108, 230, { c: q > 0 ? C.blue : C.yellow, w: 5 });
              r.glow(90, 205, 34 * Math.abs(q), q > 0 ? C.yellow : C.blue, 0.45); r.tex('C', 48, 220, { size: 24 });
              r.rect(370, 170, 40, 100, { c: '#0c0e12', fill: '#0c0e12', fa: 1, stroke: false }); r.spring(390, 170, 390, 270, { c: C.gold, coils: 7, amp: 13 }); r.tex('L', 432, 220, { size: 24 });
              if (Math.abs(I) > 0.05) r.arrow(240 - 50 * I, 120, 240 + 50 * I, 120, { c: C.green, w: 3, head: 11, a: Math.min(1, Math.abs(I) * 1.5) });
              r.txt('current', 240, 98, { size: 15, sans: true, c: C.green, align: 'center' });
            });
            K.tex(r, S, 0, T`L\frac{dI}{dt} + \frac{q}{C} = 0`, 680, 110, { size: 32, dl: 1.2 });
            K.tex(r, S, 1, T`\ddot{q} = -\frac{1}{LC}\,q,\qquad \omega = \frac{1}{\sqrt{LC}}`, 680, 190, { size: 30, c: C.yellow });
            K.tex(r, S, 2, T`\omega = 10^{4}\ \text{rad s}^{-1},\ f = 1.59\ \text{kHz}`, 680, 270, { size: 28, c: C.green });
            K.tex(r, S, 3, T`\tfrac12\frac{q^{2}}{C} \leftrightarrow \tfrac12 kx^{2},\qquad \tfrac12 LI^{2} \leftrightarrow \tfrac12 mv^{2}`, 480, 400, { size: 28 });
          } },
        { say: ['Example six turns the logic around. Instead of predicting the frequency, we measure it and learn the stiffness of something we cannot touch: a chemical bond.',
                'Hydrogen chloride absorbs infrared light at 8.65 times ten to the thirteen hertz. That is the frequency at which the two atoms vibrate against each other.',
                'Both atoms move, so the right mass is the reduced mass, mu equals m one m two over m one plus m two. For hydrogen and chlorine-35 that is 0.980 atomic mass units, or 1.63 times ten to the minus twenty-seven kilograms. It is close to the hydrogen mass, because the heavy chlorine barely moves.',
                'Then k equals mu omega squared. Omega is two pi f, 5.44 times ten to the fourteen per second, and k comes out at about 480 newtons per metre.',
                'That is the stiffness of a firm spring you could squeeze in your hand, inside a single molecule. And the reason the method works is the one from the start: near the bottom of its potential well, every bond is a spring.',
                'One honest correction. The real well is not a perfect parabola, so the measured line sits a little below the true harmonic frequency. Correcting for this anharmonicity raises k to about 516 newtons per metre: a seven percent effect. The parabola is an approximation, and a good measurement can see its edges.'],
          draw(r, S) {
            const d = 14 * Math.cos(TAU * 0.9 * S.w), xH = 300 - d * 0.97 * 2.2, xC = 520 + d * 0.03 * 2.2;
            r.alpha(S.at(0, 0.8), () => {
              r.spring(xH + 16, 160, xC - 40, 160, { c: C.greyB, coils: 8, amp: 9 });
              r.circle(xH, 160, 16, { c: C.blue, fill: C.blue, fa: 0.4 }); r.circle(xC, 160, 40, { c: C.green, fill: C.green, fa: 0.3 });
              r.tex('H', xH, 160, { size: 20 }); r.tex('Cl', xC, 160, { size: 24 });
            });
            K.tex(r, S, 1, T`f = 8.65\times10^{13}\ \text{Hz}`, 760, 160, { size: 28, c: C.yellow });
            K.tex(r, S, 2, T`\mu = \frac{m_1 m_2}{m_1+m_2} = 0.980\,\text{u} = 1.63\times10^{-27}\ \text{kg}`, 480, 270, { size: 28 });
            K.tex(r, S, 3, T`k = \mu\,(2\pi f)^{2} \approx 1.63\times10^{-27}\times(5.44\times10^{14})^{2} \approx 480\ \text{N m}^{-1}`, 480, 350, { size: 26, c: C.green });
            if (S.t > S.B[4]) K.hl(r, S, 4, 735, 330, 120, 44, { dl: 0.4 });
            K.tex(r, S, 5, T`\text{anharmonic correction: } k \approx 516\ \text{N m}^{-1}\ (+7\%)`, 480, 430, { size: 24, c: C.red });
          } }
      ]],
      ['Where the model breaks', [
        { say: ['Simple harmonic motion is an idealisation, and a good physicist knows exactly where it stops being true.',
                'First, real oscillators lose energy. Add a drag force proportional to velocity, and the equation becomes x double-dot, plus gamma x dot, plus omega nought squared x, equals zero.',
                'For light damping, the solution is a cosine inside a decaying exponential envelope, e to the minus gamma t over two. The oscillation slowly dies, and its frequency is slightly lower than omega nought.',
                'The quality factor Q, roughly omega nought over gamma, counts how many radians of oscillation happen before the energy falls by a factor of e. A guitar string has a Q in the thousands. A car\'s suspension is designed to keep Q near two.'],
          draw(r, S) {
            K.tex(r, S, 1, T`\ddot{x} + \gamma\dot{x} + \omega_0^{2}x = 0`, 480, 80, { size: 34 });
            const A = K.axes(r, { x0: 80, y0: 300, w: 780, h: 180, xr: [0, 30], yr: [-1.1, 1.1], xl: 't', yl: 'x' }), g = 0.14;
            A.draw(S.at(2, 0.8));
            if (S.t > S.B[2]) {
              K.plot(r, A, (t) => Math.exp(-g * t / 2) * Math.cos(1.6 * t), 0, 30, S.at(2, 2.4, 0.3), { c: C.yellow, n: 600 });
              K.plot(r, A, (t) => Math.exp(-g * t / 2), 0, 30, S.at(2, 1.6, 1.4), { c: C.red, w: 2, dash: [7, 6] });
              K.plot(r, A, (t) => -Math.exp(-g * t / 2), 0, 30, S.at(2, 1.6, 1.4), { c: C.red, w: 2, dash: [7, 6] });
              K.tex(r, S, 2, T`e^{-\gamma t/2}`, 330, 160, { size: 26, c: C.red, dl: 2.2 });
            }
            K.tex(r, S, 3, T`Q \approx \frac{\omega_0}{\gamma}`, 480, 420, { size: 34, c: C.green });
          } },
        { say: ['Second, push the oscillator periodically, and it responds most strongly when you push near its natural frequency. That is resonance: the reason a child on a swing goes high, and the reason bridges are designed so carefully.',
                'The sharper the resonance, the larger the Q. The height of the peak and its narrowness are two views of the same number.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 120, y0: 430, w: 700, h: 330, xr: [0, 2.2], yr: [0, 8.8], xl: 'ω/ω₀', yl: 'amplitude' }), amp = (w, Q) => 1 / Math.sqrt((1 - w * w) ** 2 + (w / Q) ** 2);
            A.draw(S.at(0, 0.8));
            K.plot(r, A, (w) => amp(w, 2), 0.01, 2.2, S.at(0, 1.6, 0.4), { c: C.blue });
            K.plot(r, A, (w) => amp(w, 8), 0.01, 2.2, S.at(1, 1.6), { c: C.yellow, n: 600 });
            K.txt(r, S, 0, 'Q = 2', 640, 300, { size: 18, sans: true, c: C.blue, dl: 1.2 }); K.txt(r, S, 1, 'Q = 8', 520, 110, { size: 18, sans: true, c: C.yellow, dl: 0.8 });
          } },
        { say: ['Third, large amplitudes break the linear approximation. The pendulum\'s period grows with amplitude, and as the swing approaches the top, it grows without limit.',
                'Remember: our derivation never assumed the system was a spring. It assumed the displacement was small. Every system obeys simple harmonic motion near a stable minimum, and none of them obey it far away.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 120, y0: 420, w: 680, h: 320, xr: [0, 175], yr: [1, 3.2], xl: 'amplitude (°)', yl: 'T/T₀', xt: [0, 150, 30], yt: [1, 3, 0.5] });
            A.draw(S.at(0, 0.8));
            K.plot(r, A, (d) => pratio(d * Math.PI / 180), 0, 174, S.at(0, 2, 0.4), { c: C.yellow, n: 400 });
            const a = S.at(0, 0.6, 2.4); if (a > 0) { K.pin(r, ...A.pt(20, pratio(20 * Math.PI / 180)), '20°: 1.008', { a, c: C.green }); K.pin(r, ...A.pt(90, pratio(Math.PI / 2)), '90°: 1.18', { a, c: C.red }); }
          } },
        { say: ['Let us collect what we found.',
                'Near any stable equilibrium, the restoring force is proportional to the displacement, because the potential is a parabola at the bottom.',
                'That gives x double-dot equals minus omega squared x, with solution A cos of omega t plus phi, and omega equals root k over m.',
                'The period does not depend on the amplitude, because the equation is linear.',
                'Simple harmonic motion is the shadow of uniform circular motion, with top speed A omega and top acceleration A omega squared.',
                'The energy is one half k A squared, passed back and forth between the spring and the motion.',
                'And the model breaks with damping, driving, and large amplitudes, which is where the next lectures begin.',
                'If you want to go further, MIT\'s course on vibrations and waves begins exactly here, and 3Blue1Brown\'s series on differential equations explores the pendulum\'s phase space beautifully. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5, 6], ['near a minimum, U is a parabola ⇒ F = −kx', 'ẍ = −ω²x, x = A cos(ωt + φ), ω = √(k/m)', 'period independent of amplitude (linearity)', 'shadow of circular motion: v_max = Aω, a_max = Aω²', 'E = ½kA², shared between spring and motion', 'breaks with damping, driving, large amplitude'], 90, 130, { dy: 52, size: 22 });
          } }
      ]]
    ]
  });
})();
/* Lecture: Waves — the wave equation, superposition and standing waves (A-level → Year 1). References: MIT 8.03SC; 3Blue1Brown. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, sm = WL.smooth, cl = WL.clamp, lerp = WL.lerp, T = String.raw, TAU = 2 * Math.PI;
  // draw a string y(x) between pixel x0..x1 about the line y0, with amplitude scale
  function str(r, x0, x1, y0, f, o = {}) { const n = o.n || 220, pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x0 + (x1 - x0) * u, y0 - f(u)]); } r.poly(pts, { c: o.c || C.yellow, w: o.w || 3, a: o.a, p: o.p }); return pts; }
  const pulse = (u, c, w) => Math.exp(-((u - c) * (u - c)) / (2 * w * w));

  L.def({
    id: 'waves', order: 3, title: 'Waves: the wave equation and standing waves', sub: 'How a shape travels, why it travels at √(T/μ), and why strings and pipes play only certain notes',
    level: 'A-level → Year 1', topics: ['y1-wave-eq', 'al-stationary', 'al-interference'], thumb: [9, 20],
    refs: [
      ['MIT OCW 8.03SC (Yen-Jie Lee)', 'Vibrations and Waves: travelling waves, standing waves, all lectures and notes', 'https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/resource-index/'],
      ['MIT OCW 8.03SC', 'Course syllabus: from oscillators to waves and optics', 'https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/syllabus'],
      ['3Blue1Brown', 'But what is a partial differential equation? and the heat-equation lessons', 'https://3blue1brown.com/topics/differential-equations']
    ],
    chapters: [
      ['What a wave is', [
        { say: ['Drop a stone in a pond, pluck a guitar string, or speak a word. Something travels outwards, and yet nothing of the water, the string or the air goes anywhere. This lecture is about how that is possible, and about the one equation that describes it.', 1.5],
          draw(r, S) {
            K.title(r, S, 'Waves', 'The wave equation and standing waves', { y: 200 });
            const a = S.in(1.6, 1.2);
            str(r, 120, 840, 420, (u) => 30 * Math.sin(TAU * (3 * u - 0.5 * S.w)), { c: C.blue, a });
          } },
        { say: ['Here is a long rope, shaken at one end. A shape moves along it. Follow one piece of rope, marked in red.',
                'The red piece only moves up and down. It never travels along the rope. What travels is the pattern: the disturbance passes from one piece to the next.',
                'When the pieces move across the direction of travel, the wave is transverse, like this rope or like light. When they move back and forth along it, the wave is longitudinal, like sound in air. The mathematics is the same.'],
          draw(r, S) {
            const k = 2.5, w = 2.2, f = (u) => 46 * Math.sin(TAU * k * u - w * S.w);
            r.alpha(S.at(0, 0.8), () => {
              str(r, 80, 880, 190, f, { c: C.yellow });
              for (let i = 0; i <= 20; i++) { const u = i / 20; r.dot(80 + 800 * u, 190 - f(u), { r: i === 9 ? 7 : 3.5, c: i === 9 ? C.red : C.greyB }); }
            });
            const a1 = S.at(1, 0.6); if (a1 > 0) { const u = 9 / 20, X = 80 + 800 * u; r.arrow(X, 190 - 52, X, 190 + 52, { c: C.red, w: 2, both: true, head: 9, a: a1 * 0.7 }); r.arrow(560, 100, 700, 100, { c: C.blue, w: 3, a: a1, head: 12 }); r.txt('the pattern moves', 715, 100, { size: 17, sans: true, c: C.blue, a: a1 }); }
            const a2 = S.at(2, 0.8); if (a2 > 0) {
              r.txt('longitudinal (sound)', 80, 300, { size: 17, sans: true, c: C.dim, a: a2 });
              for (let i = 0; i < 60; i++) { const x0 = 90 + i * 13, x = x0 + 9 * Math.sin(TAU * 2.5 * (i / 60) - w * S.w); r.line(x, 330, x, 410, { c: i === 27 ? C.red : C.blueA, w: i === 27 ? 3 : 1.6, a: a2 * (i === 27 ? 1 : 0.7) }); }
            }
          } },
        { say: ['Freeze the wave at one instant. The distance from one crest to the next is the wavelength, lambda.',
                'Now watch one point over time. It repeats every period, T, so its frequency is f equals one over T.',
                'In one period, every crest moves forward by exactly one wavelength. So the wave speed is lambda over T: v equals f lambda. That is the most used equation about waves, and it is really just distance over time.',
                'We write the travelling wave as y equals A sin of k x minus omega t, where k, the wavenumber, is two pi over lambda, and omega is two pi f. Then the speed is omega over k.',
                'Why minus omega t? Follow a crest, where the phase k x minus omega t stays fixed. As t grows, x must grow too, at the rate omega over k. A plus sign would give a wave moving to the left.'],
          draw(r, S) {
            const k = 2, w = (S.t > S.B[1] ? 1.4 : 0) * 1, A = 60, ph = S.t > S.B[1] ? w * (S.t - S.B[1]) : 0, f = (u) => A * Math.sin(TAU * k * u - ph);
            r.alpha(S.at(0, 0.8), () => { r.line(80, 220, 880, 220, { c: C.greyD, w: 1.2 }); str(r, 80, 880, 220, f, { c: C.yellow }); });
            const a0 = S.at(0, 0.6, 0.6); if (a0 > 0 && S.t < S.B[1] + 0.3) { const x1 = 80 + 800 * (0.25 / k), x2 = x1 + 800 / k; r.brace(x1, 220 - A - 10, x2, 220 - A - 10, { side: 1, c: C.blue, tex: T`\lambda`, size: 26, a: a0 }); }
            const a1 = S.at(1, 0.6); if (a1 > 0) { const X = 80 + 800 * 0.6; r.dot(X, 220 - f(0.6), { r: 8, c: C.red, a: a1 }); r.line(X, 140, X, 300, { c: C.red, w: 1, dash: [4, 4], a: a1 * 0.6 }); }
            K.tex(r, S, 2, T`v = \frac{\lambda}{T} = f\lambda`, 250, 380, { size: 38, c: C.green });
            K.tex(r, S, 3, T`y = A\sin(kx - \omega t),\quad k = \frac{2\pi}{\lambda},\ \omega = 2\pi f,\ v = \frac{\omega}{k}`, 560, 380, { size: 24, out: 4 });
            K.tex(r, S, 4, T`kx - \omega t = \text{const}\ \Rightarrow\ \frac{dx}{dt} = \frac{\omega}{k}`, 640, 380, { size: 30, c: C.blue });
          } }
      ]],
      ['The wave equation', [
        { say: ['Why does a shape travel at all, and what sets its speed? Look at a short piece of string, of length d x, pulled at both ends by the tension T.',
                'If the string is straight, the two pulls are equal and opposite, and the piece feels no net force. But if the string is curved, the two ends pull in slightly different directions.',
                'The vertical part of each pull is T times the slope of the string there. So the net vertical force is T times the change in slope across the piece: T times the second derivative of y with respect to x, times d x.',
                'The piece has mass mu d x, where mu is the mass per unit length. Newton\'s second law says mu d x times the vertical acceleration equals that force. Cancel d x, and we have the wave equation.',
                'The second time derivative of y equals T over mu, times the second space derivative of y. Read it in words: each piece of string accelerates towards the side its neighbours are bending to. Curvature drives acceleration.'],
          draw(r, S) {
            const f = (x) => 70 * Math.exp(-((x - 0.5) ** 2) / 0.04), X = (u) => 120 + 720 * u, Y = (u) => 300 - f(u);
            r.alpha(S.at(0, 0.8), () => {
              const pts = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push([X(u), Y(u)]); } r.poly(pts, { c: C.greyB, w: 2.5 });
              const u1 = 0.33, u2 = 0.41, seg = []; for (let i = 0; i <= 30; i++) { const u = u1 + (u2 - u1) * i / 30; seg.push([X(u), Y(u)]); } r.poly(seg, { c: C.yellow, w: 5 });
              const sl = (u) => { const h = 1e-3; return (Y(u + h) - Y(u - h)) / (X(u + h) - X(u - h)); };
              const t1 = sl(u1), t2 = sl(u2), L1 = 90, n1 = Math.hypot(1, t1), n2 = Math.hypot(1, t2);
              r.arrow(X(u1), Y(u1), X(u1) - L1 / n1, Y(u1) - L1 * t1 / n1, { c: C.blue, w: 3, head: 11 });
              r.arrow(X(u2), Y(u2), X(u2) + L1 / n2, Y(u2) + L1 * t2 / n2, { c: C.blue, w: 3, head: 11 });
              r.tex('T', X(u1) - 70, Y(u1) + 4, { size: 24, c: C.blue }); r.tex('T', X(u2) + 80, Y(u2) - 50, { size: 24, c: C.blue });
            });
            const a2 = S.at(2, 0.7); if (a2 > 0) { const xm = X(0.37), ym = Y(0.37); r.arrow(xm, ym - 12, xm, ym - 80, { c: C.red, w: 3.5, head: 12, a: a2 }); r.txt('net force', xm + 10, ym - 90, { size: 16, sans: true, c: C.red, a: a2 }); }
            K.tex(r, S, 2, T`F_y = T\frac{\partial^{2} y}{\partial x^{2}}\,dx`, 760, 110, { size: 30, c: C.red });
            K.tex(r, S, 3, T`(\mu\,dx)\,\frac{\partial^{2} y}{\partial t^{2}} = T\frac{\partial^{2} y}{\partial x^{2}}\,dx`, 480, 400, { size: 30, out: 4 });
            const a4 = S.at(4, 0.7); if (a4 > 0) { r.rr(260, 362, 440, 82, 12, { c: C.yellow, w: 2.5, fill: '#0c0e12', fa: 0.95, a: a4 }); K.tex(r, S, 4, T`\frac{\partial^{2} y}{\partial t^{2}} = \frac{T}{\mu}\,\frac{\partial^{2} y}{\partial x^{2}}`, 480, 402, { size: 36, c: C.yellow, dl: 0.2 }); }
          } },
        { say: ['Now the magic. Take any shape at all, f, and slide it along: y equals f of x minus v t. Does it satisfy the wave equation?',
                'Differentiate twice with respect to time. Each time derivative pulls out a factor of minus v by the chain rule, so we get v squared times f double-prime.',
                'Differentiate twice with respect to x, and we get just f double-prime. So the equation holds exactly when v squared equals T over mu.',
                'That is the wave speed on a string: v equals the square root of the tension over the mass per unit length. Tighter strings carry waves faster; heavier strings carry them slower. And any shape travels without changing, which is why a pulse keeps its form as it runs down a rope.'],
          draw(r, S) {
            const v = 0.07, c0 = 0.15 + ((v * Math.max(0, S.t - 0.5)) % 0.8), f = (u) => 70 * pulse(u, c0, 0.05) + 30 * pulse(u, c0 - 0.1, 0.03);
            r.alpha(S.at(0, 0.8), () => { r.line(80, 200, 880, 200, { c: C.greyD, w: 1.2 }); str(r, 80, 880, 200, f, { c: C.yellow, n: 300 }); });
            K.tex(r, S, 0, T`y = f(x - vt)`, 200, 330, { size: 34 });
            K.tex(r, S, 1, T`\frac{\partial^{2}y}{\partial t^{2}} = v^{2} f''`, 480, 330, { size: 30 });
            K.tex(r, S, 2, T`\frac{\partial^{2}y}{\partial x^{2}} = f''`, 740, 330, { size: 30 });
            const a = S.at(3, 0.6); if (a > 0) { r.rr(330, 385, 300, 66, 12, { c: C.green, w: 2.5, fill: '#0c0e12', fa: 0.95, a }); K.tex(r, S, 3, T`v = \sqrt{T/\mu}`, 480, 418, { size: 36, c: C.green, dl: 0.2 }); }
          } },
        { say: [['Pause and think. Is the wave speed a property of the wave, or of the string?', 4],
                'Of the string, or more generally the medium. The formula v equals root T over mu has no amplitude, no frequency and no wavelength in it. Change the frequency, and the wavelength adjusts so that f lambda stays equal to v. That is why every note on a given string, plucked or bowed, travels at the same speed.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Speed: set by the wave, or by the string?'], { y: 100 });
            const a = S.at(1, 0.8); if (a <= 0) return;
            r.alpha(a, () => {
              str(r, 120, 840, 330, (u) => 30 * Math.sin(TAU * 3 * u - 3 * S.w), { c: C.blue, w: 2.5 });
              str(r, 120, 840, 420, (u) => 30 * Math.sin(TAU * 6 * u - 6 * S.w), { c: C.yellow, w: 2.5 });
              r.txt('f, λ', 860, 330, { size: 18, sans: true, c: C.blue }); r.txt('2f, λ/2', 860, 420, { size: 18, sans: true, c: C.yellow });
            });
          } }
      ]],
      ['Numbers: strings and sound', [
        { say: ['A worked example. A steel guitar string has a mass of 1.2 grams per metre and is tuned to a tension of 70 newtons. How fast do waves travel along it?',
                'Convert first: mu is 1.2 times ten to the minus three kilograms per metre. Then v is the square root of 70 over 0.0012: the root of 58,300, which is 242 metres per second.',
                'That is the same order as the speed of sound in air, by pure coincidence. Double the tension and the speed rises by root two, about 41 percent, which is how tuning pegs work.',
                'Second example: sound. In air at room temperature, sound travels at 343 metres per second. The note A, at 440 hertz, therefore has a wavelength of 343 over 440: 0.78 metres. A low bass note at 41 hertz has a wavelength of more than eight metres, longer than most rooms.'],
          draw(r, S) {
            K.tex(r, S, 0, T`\mu = 1.2\ \text{g m}^{-1},\quad T = 70\ \text{N}`, 480, 80, { size: 30, dl: 0.4 });
            K.calc(r, S, 1, 90, 160, [T`v = \sqrt{\frac{T}{\mu}} = \sqrt{\frac{70}{1.2\times10^{-3}}} = 242\ \text{m s}^{-1}`, T`T \to 2T:\ \ v \to \sqrt2\,v = 342\ \text{m s}^{-1}`], { ks: [1, 2], dy: 86, size: 30 });
            K.calc(r, S, 3, 90, 360, [T`\lambda = \frac{v}{f} = \frac{343}{440} = 0.78\ \text{m}\qquad 41\ \text{Hz}: \ 8.4\ \text{m}`], { size: 28, c: C.blue });
          } }
      ]],
      ['Sound, and a famous mistake', [
        { say: ['The same reasoning works for sound in a gas: the springiness comes from pressure, and the inertia from density. The speed is the square root of a stiffness over a density, just as for the string.',
                'Isaac Newton did this calculation first. He assumed that the temperature of the air stays constant as it is squeezed, so the stiffness is just the pressure. That gives v equals the root of P over rho.',
                'With atmospheric pressure, 101 kilopascals, and the density of air, 1.20 kilograms per cubic metre, that is 290 metres per second. But measured, sound travels at 343. Newton was fifteen percent low, and he could not explain why.',
                'The hidden assumption was the constant temperature. A sound wave squeezes and stretches the air far too quickly for heat to flow away, so the compressions warm up and the rarefactions cool down. The air is stiffer than Newton thought, by a factor gamma, 1.4 for air.',
                'Laplace made the correction more than a century later: v equals the root of gamma P over rho, which gives 343 metres per second, exactly right. The lesson is worth keeping: when a careful calculation disagrees with measurement, look for the assumption you did not know you had made.'],
          draw(r, S) {
            K.tex(r, S, 0, T`v = \sqrt{\frac{\text{stiffness}}{\text{inertia}}}`, 480, 80, { size: 32 });
            K.tex(r, S, 1, T`\text{Newton (isothermal)}:\ v = \sqrt{\frac{P}{\rho}}`, 300, 180, { size: 30, c: C.blue });
            K.tex(r, S, 2, T`\sqrt{\frac{1.013\times10^{5}}{1.20}} = 290\ \text{m s}^{-1}`, 300, 260, { size: 28, c: C.blue });
            K.tex(r, S, 2, T`\text{measured: } 343\ \text{m s}^{-1}`, 720, 260, { size: 28, c: C.red, dl: 1.6 });
            K.tex(r, S, 4, T`\text{Laplace (adiabatic)}:\ v = \sqrt{\frac{\gamma P}{\rho}} = \sqrt{\frac{1.4\times1.013\times10^{5}}{1.20}} = 343\ \text{m s}^{-1}`, 480, 380, { size: 26, c: C.green });
            const a = S.at(3, 0.7); if (a > 0) {
              for (let i = 0; i < 46; i++) { const x0 = 560 + i * 8, ph = Math.sin(TAU * i / 23 - 2.2 * S.w), x = x0 + 5 * ph; r.line(x, 150, x, 210, { c: ph < 0 ? C.red : C.blue, w: 1.6, a: a * 0.8 }); }
              r.txt('compressions warm up, rarefactions cool', 740, 130, { size: 15, sans: true, c: C.dim, align: 'center', a });
            }
          } }
      ]],
      ['Superposition', [
        { say: ['The wave equation is linear: if y one and y two are solutions, so is their sum. Physically, that means waves pass through each other without colliding.',
                'Watch two pulses approach from opposite ends. Where they overlap, the displacements simply add. And then, remarkably, each pulse continues on its way, unchanged, as if the other had never been there.',
                'When a crest meets a trough of the same size, the string is momentarily flat. That is destructive interference. But the energy has not vanished: at that instant the string is moving fastest, so the energy is all kinetic. A moment later the pulses re-emerge.'],
          draw(r, S) {
            const s0 = Math.max(0, S.t - S.B[1]), u1 = 0.1 + 0.07 * s0, u2 = 0.9 - 0.07 * s0, inv = S.t > S.B[2] ? -1 : 1;
            const f1 = (u) => 60 * pulse(u, u1, 0.045), f2 = (u) => inv * 60 * pulse(u, u2, 0.045);
            r.alpha(S.at(0, 0.8), () => {
              r.line(80, 260, 880, 260, { c: C.greyD, w: 1.2 });
              str(r, 80, 880, 260, f1, { c: C.blue, w: 2, a: 0.55, n: 300 }); str(r, 80, 880, 260, f2, { c: C.green, w: 2, a: 0.55, n: 300 });
              str(r, 80, 880, 260, (u) => f1(u) + f2(u), { c: C.yellow, w: 3.5, n: 300 });
            });
            K.tex(r, S, 0, T`y = y_1 + y_2`, 480, 100, { size: 34, c: C.yellow });
            K.txt(r, S, 2, inv < 0 ? 'crest + trough: flat for an instant, but moving fastest' : '', 480, 400, { size: 20, align: 'center', c: C.greyB });
          } },
        { say: ['Superposition is behind interference everywhere. Two sources sending out waves in step produce a pattern. Where the paths from the two sources differ by a whole number of wavelengths, crest meets crest and the waves reinforce.',
                'Where the paths differ by half a wavelength, crest meets trough and they cancel. This is the pattern of light in Young\'s two slits, of sound from two loudspeakers, and of ripples in a tank.',
                ['The rule to remember: path difference n lambda gives a maximum; path difference n plus a half, times lambda, gives a minimum. Everything else in interference is geometry.', 2]],
          draw(r, S) {
            const s1 = [380, 270], s2 = [580, 270], lam = 46, w = S.w * 2.4, a = S.at(0, 0.8);
            if (a > 0) {
              const o = r.pix('wi', 192, 108), d = o.d;
              for (let j = 0; j < 108; j++) for (let i = 0; i < 192; i++) {
                const x = i * 5, y = j * 5, r1 = Math.hypot(x - s1[0], y - s1[1]), r2 = Math.hypot(x - s2[0], y - s2[1]);
                const v = (Math.cos(TAU * r1 / lam - w) + Math.cos(TAU * r2 / lam - w)) / 2, k = (j * 192 + i) * 4;
                d[k] = 12 + 70 * Math.max(0, v); d[k + 1] = 14 + 150 * Math.max(0, v) + 40 * Math.max(0, -v); d[k + 2] = 18 + 190 * Math.max(0, v) + 120 * Math.max(0, -v); d[k + 3] = 255;
              }
              r.alpha(a * 0.9, () => r.blit(o, 0, 0, 960, 540));
              r.dot(...s1, { r: 6, c: C.yellow, a }); r.dot(...s2, { r: 6, c: C.yellow, a });
            }
            K.tex(r, S, 2, T`\Delta = n\lambda:\ \text{max},\qquad \Delta = (n+\tfrac12)\lambda:\ \text{min}`, 480, 70, { size: 30, c: C.yellow });
          } }
      ]],
      ['Beats and the Doppler effect', [
        { say: ['Superposition in time gives beats. Play two notes close in frequency, 440 and 444 hertz, together. The sum is a single tone at their average, 442 hertz, whose loudness rises and falls.',
                'The trigonometry says the same: the sum of two sines equals two cos of two pi times half the difference, times t, multiplied by a sine at the average frequency. The loudness peaks twice per cycle of that slow cosine, so you hear beats at the difference frequency: 4 per second.',
                'Musicians use this every day. To tune a string against a reference, you listen to the beats and turn the peg until they slow down and stop. When the beats vanish, the frequencies are equal.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 80, y0: 330, w: 800, h: 200, xr: [0, 1], yr: [-2.2, 2.2], xl: 't (s)', xt: [0, 1, 0.25] });
            A.draw(S.at(0, 0.8));
            const f1 = 40, f2 = 44;
            K.plot(r, A, (t) => Math.sin(TAU * f1 * t) + Math.sin(TAU * f2 * t), 0, 1, S.at(0, 2, 0.4), { c: C.yellow, w: 1.6, n: 2400 });
            if (S.t > S.B[1]) { K.plot(r, A, (t) => 2 * Math.cos(TAU * 2 * t), 0, 1, S.at(1, 1.5), { c: C.red, w: 2.5, n: 400, dash: [7, 6] }); K.plot(r, A, (t) => -2 * Math.cos(TAU * 2 * t), 0, 1, S.at(1, 1.5), { c: C.red, w: 2.5, n: 400, dash: [7, 6] }); }
            K.tex(r, S, 1, T`\sin a + \sin b = 2\cos\frac{a-b}{2}\,\sin\frac{a+b}{2}`, 480, 80, { size: 30 });
            K.tex(r, S, 1, T`f_{\text{beat}} = |f_1 - f_2| = 4\ \text{Hz}`, 480, 420, { size: 30, c: C.red, dl: 1.6 });
            K.txt(r, S, 0, '(shown with frequencies scaled down ten times)', 880, 130, { size: 14, sans: true, c: C.dim, align: 'right', dl: 1 });
          } },
        { say: ['One more everyday wave effect: the Doppler shift. A source moving towards you squeezes its own wavefronts together in front of it, and stretches them out behind.',
                'If the source moves at speed v s through air where sound travels at v, the wavelength in front shrinks by the factor v minus v s over v, so the frequency you hear rises to f times v over v minus v s.',
                'An ambulance siren at 700 hertz, approaching at 30 metres per second: 700 times 343 over 313, which is 767 hertz. As it passes and recedes, the frequency drops to 700 times 343 over 373: 644 hertz. That sudden drop, by more than a semitone, is the sound everyone recognises.',
                'The same physics, with light, measures how fast galaxies recede from us, and how fast blood flows in an ultrasound scan.'],
          draw(r, S) {
            const vs = 0.42, sx = (t) => 300 + 120 * vs * t, now = S.since(0) > 0 ? S.since(0) : 0, a = S.at(0, 0.8);
            if (a > 0) {
              for (let k = 0; k < 14; k++) { const te = Math.floor(now / 0.55) * 0.55 - k * 0.55; if (te < 0) break; const age = now - te, R = 120 * age; if (R > 700) continue; r.circle(sx(te), 250, R, { c: C.blue, w: 1.6, a: a * Math.max(0, 1 - R / 700) }); }
              r.dot(sx(now), 250, { r: 9, c: C.yellow, a }); r.arrow(sx(now) + 14, 250, sx(now) + 60, 250, { c: C.yellow, w: 2.5, head: 9, a });
            }
            K.tex(r, S, 1, T`f' = f\,\frac{v}{v - v_s}`, 790, 90, { size: 32, c: C.yellow });
            K.tex(r, S, 2, T`700\times\frac{343}{313} = 767\ \text{Hz}`, 790, 380, { size: 26, c: C.green });
            K.tex(r, S, 2, T`700\times\frac{343}{373} = 644\ \text{Hz}`, 790, 440, { size: 26, c: C.red, dl: 2.5 });
          } }
      ]],
      ['Standing waves', [
        { say: ['Now send two identical waves along a string in opposite directions. One is sin of k x minus omega t, the other sin of k x plus omega t.',
                'Their sum is not a travelling wave at all. Using the identity for a sum of sines, it is two sin k x, times cos omega t.',
                'The shape sin k x stays fixed, and the whole shape just swells and shrinks in time. Some points never move at all: the nodes, where sin k x is zero. Halfway between, the antinodes swing with twice the amplitude of either wave.',
                'This is a standing wave. On a real string it happens naturally: a wave runs to the end, reflects, and comes back to meet itself.'],
          draw(r, S) {
            const k = 2.5, w = 1.6 * S.w, f1 = (u) => 40 * Math.sin(TAU * k * u - w), f2 = (u) => 40 * Math.sin(TAU * k * u + w);
            r.alpha(S.at(0, 0.8), () => { str(r, 80, 880, 140, f1, { c: C.blue, w: 2.5 }); str(r, 80, 880, 240, f2, { c: C.green, w: 2.5 }); r.txt('→', 892, 140, { size: 22, c: C.blue }); r.txt('←', 50, 240, { size: 22, c: C.green }); });
            const a1 = S.at(1, 0.8); if (a1 > 0) { r.line(80, 370, 880, 370, { c: C.greyD, w: 1.2, a: a1 }); str(r, 80, 880, 370, (u) => f1(u) + f2(u), { c: C.yellow, w: 3.5, a: a1 }); }
            const a2 = S.at(2, 0.6); if (a2 > 0) for (let n = 0; n <= 5; n++) { const X = 80 + 800 * (n / (2 * k)); if (X <= 880) r.dot(X, 370, { r: 6, c: C.red, a: a2 }); }
            K.tex(r, S, 1, T`\sin(kx-\omega t) + \sin(kx+\omega t) = 2\sin kx\,\cos\omega t`, 480, 455, { size: 28, c: C.yellow });
          } },
        { say: ['Fix both ends of a string of length L. The ends must be nodes, so sin k L must be zero. That forces k L to be a whole number of pi: k equals n pi over L.',
                'In terms of wavelength, lambda n equals two L over n. Only these wavelengths fit: half a wavelength, one wavelength, one and a half, and so on.',
                'With v equals f lambda, the allowed frequencies are f n equals n v over two L. The lowest, n equals one, is the fundamental. The others are whole-number multiples, the harmonics.',
                'This is quantisation, long before quantum mechanics: a confined wave can only have certain frequencies. Exactly the same reasoning, applied to an electron in a box, will give its energy levels in a later lecture.'],
          draw(r, S) {
            for (let n = 1; n <= 3; n++) {
              const a = S.at(n === 1 ? 0 : 1, 0.6, (n - 1) * 0.8); if (a <= 0) continue;
              const y0 = 90 + (n - 1) * 115, c = Math.cos(1.7 * n * S.w);
              r.alpha(a, () => {
                r.line(120, y0 - 40, 120, y0 + 40, { c: C.greyB, w: 4 }); r.line(640, y0 - 40, 640, y0 + 40, { c: C.greyB, w: 4 });
                str(r, 120, 640, y0, (u) => 36 * c * Math.sin(n * Math.PI * u), { c: [C.yellow, C.blue, C.green][n - 1], w: 3 });
                str(r, 120, 640, y0, (u) => -36 * Math.sin(n * Math.PI * u), { c: C.greyD, w: 1, a: 0.6 }); str(r, 120, 640, y0, (u) => 36 * Math.sin(n * Math.PI * u), { c: C.greyD, w: 1, a: 0.6 });
                r.tex(T`n = ${n}:\ \lambda = ${n === 1 ? '2L' : n === 2 ? 'L' : '2L/3'}`, 790, y0, { size: 24, c: [C.yellow, C.blue, C.green][n - 1] });
              });
            }
            K.tex(r, S, 2, T`f_n = \frac{n\,v}{2L}`, 480, 440, { size: 36, c: C.yellow, out: 3 });
            K.tex(r, S, 3, T`\text{confined wave} \Rightarrow \text{discrete frequencies}`, 480, 440, { size: 30, c: C.green });
          } },
        { say: [['Pause and think. Why can a string fixed at both ends not vibrate at one and a half times its fundamental frequency?', 4],
                'At one and a half times the fundamental, the wavelength would be four L over three. Start a node at one end and the pattern reaches the far end in the middle of a loop, not at a node. The fixed end cannot move, so that pattern cannot exist. Only whole numbers of half-wavelengths fit.'],
          draw(r, S) {
            K.ponder(r, S, 0, ['Why not 1.5 × the fundamental?'], { y: 90 });
            const a = S.at(1, 0.8); if (a <= 0) return;
            const c = Math.cos(2.6 * S.w);
            r.alpha(a, () => { r.line(160, 300, 160, 400, { c: C.greyB, w: 4 }); r.line(800, 300, 800, 400, { c: C.greyB, w: 4 }); str(r, 160, 800, 350, (u) => 40 * c * Math.sin(1.5 * Math.PI * u), { c: C.red, w: 3 }); r.dot(800, 350 - 40 * c * Math.sin(1.5 * Math.PI), { r: 7, c: C.red }); r.txt('the end would have to move', 640, 280, { size: 17, sans: true, c: C.red, align: 'center' }); });
          } },
        { say: ['Back to the guitar string, now 0.65 metres long, with waves travelling at 242 metres per second. Its fundamental is 242 over 1.30: 186 hertz, close to the note F sharp below middle C.',
                'The harmonics are 372, 557, 743 hertz and upward. A real pluck excites many of them at once, and the mixture is what gives a guitar its sound. Pluck near the bridge and you excite more high harmonics, which sounds brighter.',
                'Touch the string lightly at its midpoint and you force a node there. The fundamental is killed, because it needs an antinode in the middle, and the string jumps up an octave to 372 hertz. Guitarists call this a harmonic.'],
          draw(r, S) {
            K.calc(r, S, 0, 80, 100, [T`f_1 = \frac{v}{2L} = \frac{242}{2\times0.65} = 186\ \text{Hz}`, T`f_n = 186,\ 372,\ 557,\ 743,\ \ldots\ \text{Hz}`], { ks: [0, 1], dy: 80, size: 30 });
            const a = S.at(2, 0.7); if (a > 0) {
              const c = Math.cos(3.4 * S.w);
              r.alpha(a, () => { r.line(160, 330, 160, 410, { c: C.greyB, w: 4 }); r.line(800, 330, 800, 410, { c: C.greyB, w: 4 }); str(r, 160, 800, 370, (u) => 34 * c * Math.sin(2 * Math.PI * u), { c: C.blue, w: 3 }); r.dot(480, 370, { r: 8, c: C.red }); r.txt('light touch: a node', 480, 320, { size: 17, sans: true, c: C.red, align: 'center' }); });
            }
          } }
      ]],
      ['An exam classic: Melde\'s experiment', [
        { say: ['Here is a classic practical, often set as an exam question. A string 1.2 metres long, with a mass of 0.60 grams per metre, is driven at one end by a vibrator at 50 hertz. The other end runs over a pulley to a hanging mass that sets the tension. Which tensions give one, two or three loops?',
                'Start from the standing-wave condition with n loops: f equals n over two L, times root T over mu. Rearrange for the tension: T equals mu times two L f over n, squared.',
                'Two L f is 120 metres per second, so T equals 0.0006 times 120 squared, over n squared: 8.64 newtons over n squared.',
                'One loop needs 8.64 newtons, a hanging mass of 0.88 kilograms. Two loops need a quarter of that, 2.16 newtons. Three loops need 0.96 newtons, about a tenth of a kilogram.',
                ['Pause on the surprise: fewer loops need more tension. More tension means a faster wave, and at a fixed frequency a faster wave has a longer wavelength, so fewer half-wavelengths fit on the string.', 1.5]],
          draw(r, S) {
            const n = S.t > S.B[3] + 3 ? 3 : S.t > S.B[3] + 1.5 ? 2 : 1, c = Math.cos(6 * S.w);
            r.alpha(S.at(0, 0.8), () => {
              r.rr(70, 150, 40, 60, 5, { c: C.greyB, w: 2, fill: C.greyD, fa: 0.6 }); r.txt('50 Hz', 90, 230, { size: 14, sans: true, c: C.dim, align: 'center' });
              str(r, 110, 640, 180, (u) => 28 * c * Math.sin(n * Math.PI * u), { c: C.yellow, w: 2.5 });
              r.circle(652, 192, 12, { c: C.greyB, w: 2 }); r.line(664, 192, 664, 300, { c: C.greyB, w: 1.5 }); r.rr(648, 300, 32, 40, 4, { c: C.blue, w: 2, fill: C.blue, fa: 0.3 }); r.tex('mg', 708, 320, { size: 20, c: C.blue });
            });
            K.tex(r, S, 1, T`f = \frac{n}{2L}\sqrt{\frac{T}{\mu}}\ \Rightarrow\ T = \mu\Big(\frac{2Lf}{n}\Big)^{2}`, 480, 80, { size: 28 });
            K.tex(r, S, 2, T`T = \frac{6.0\times10^{-4}\times 120^{2}}{n^{2}} = \frac{8.64\ \text{N}}{n^{2}}`, 480, 400, { size: 28, c: C.yellow, out: 3 });
            K.tex(r, S, 3, T`n = 1,2,3:\ \ 8.64,\ 2.16,\ 0.96\ \text{N}\ \ (0.88,\ 0.22,\ 0.098\ \text{kg})`, 480, 400, { size: 26, c: C.green });
          } }
      ]],
      ['Pipes, and a worked comparison', [
        { say: ['Air in a pipe does the same thing, with one twist: an open end is an antinode of the air\'s motion, not a node, because the air there is free to move.',
                'A pipe open at both ends has antinodes at both ends, so the same counting works: f n equals n v over two L, with every harmonic present.',
                'A pipe closed at one end has a node at the closed end and an antinode at the open end. The longest wave that fits is four times the pipe length, so the fundamental is v over four L, half that of an open pipe the same length.',
                'And only odd harmonics fit: one, three, five times the fundamental. A clarinet behaves roughly like a closed pipe, which is part of why it sounds so different from a flute.'],
          draw(r, S) {
            const c = Math.cos(2.4 * S.w), pipe = (y, closed, lab, a) => { r.rr(140, y - 34, 520, 68, 6, { c: C.greyB, w: 2, a }); if (closed) r.line(140, y - 34, 140, y + 34, { c: C.greyB, w: 7, a }); r.txt(lab, 690, y, { size: 18, sans: true, c: C.dim, a }); };
            const a1 = S.at(1, 0.7); if (a1 > 0) { pipe(140, false, 'open–open: f₁ = v/2L', a1); str(r, 140, 660, 140, (u) => 26 * c * Math.cos(Math.PI * u), { c: C.blue, a: a1 }); str(r, 140, 660, 140, (u) => -26 * c * Math.cos(Math.PI * u), { c: C.blue, a: a1 * 0.4 }); }
            const a2 = S.at(2, 0.7); if (a2 > 0) { pipe(270, true, 'closed–open: f₁ = v/4L', a2); str(r, 140, 660, 270, (u) => 26 * c * Math.sin(Math.PI * u / 2), { c: C.yellow, a: a2 }); str(r, 140, 660, 270, (u) => -26 * c * Math.sin(Math.PI * u / 2), { c: C.yellow, a: a2 * 0.4 }); }
            const a3 = S.at(3, 0.7); if (a3 > 0) { pipe(400, true, 'third harmonic: 3f₁', a3); str(r, 140, 660, 400, (u) => 26 * c * Math.sin(3 * Math.PI * u / 2), { c: C.green, a: a3 }); str(r, 140, 660, 400, (u) => -26 * c * Math.sin(3 * Math.PI * u / 2), { c: C.green, a: a3 * 0.4 }); }
          } },
        { say: ['Example: a pipe 0.30 metres long, closed at one end, in air where sound travels at 343 metres per second. The fundamental is 343 over 1.2: 286 hertz.',
                'The next note it can play is three times that, 858 hertz, not twice. Open the closed end and the fundamental doubles to 572 hertz, with all harmonics present.',
                'A good exam habit: draw the node and antinode pattern first, count how many quarter-wavelengths fit in the pipe, and only then reach for a formula. The picture never lies; a misremembered formula often does.'],
          draw(r, S) {
            K.calc(r, S, 0, 120, 120, [T`\text{closed}:\ f_1 = \frac{v}{4L} = \frac{343}{1.2} = 286\ \text{Hz}`, T`\text{next}:\ 3f_1 = 858\ \text{Hz}`, T`\text{open}:\ f_1 = \frac{v}{2L} = 572\ \text{Hz}`], { ks: [0, 1, 1], dy: 82, size: 30, dl: 0 });
            K.txt(r, S, 2, 'draw nodes and antinodes first, then count quarter-wavelengths', 480, 430, { size: 20, align: 'center', c: C.yellow });
          } }
      ]],
      ['Spreading out: intensity and decibels', [
        { say: ['A wave spreading from a small source shares its power over a growing sphere. The area of the sphere is four pi r squared, so the intensity, the power per square metre, falls as one over r squared.',
                'A worked example. A loudspeaker radiates half a watt of sound, equally in all directions. At ten metres the intensity is 0.5 over four pi times one hundred: 4.0 times ten to the minus four watts per square metre.',
                'The ear covers an enormous range, so we measure loudness on a logarithmic scale: the sound level in decibels is ten log base ten of I over I nought, with I nought equal to ten to the minus twelve watts per square metre, the threshold of hearing.',
                'Here that is ten log of four times ten to the eight: 86 decibels. Move twice as far away and the intensity falls by four, which is minus six decibels, to 80. Every doubling of distance costs six decibels, as long as nothing reflects the sound back.'],
          draw(r, S) {
            const cx = 230, cy = 260, a = S.at(0, 0.8);
            if (a > 0) { for (let k = 1; k <= 4; k++) r.circle(cx, cy, 45 * k, { c: C.blue, w: 1.8, a: a * (1.1 - k * 0.2) }); r.dot(cx, cy, { r: 8, c: C.yellow, a }); r.tex(T`I = \frac{P}{4\pi r^{2}}`, cx, 450, { size: 30, c: C.yellow, a }); }
            K.calc(r, S, 1, 450, 110, [T`I = \frac{0.5}{4\pi(10)^{2}} = 4.0\times10^{-4}\ \text{W m}^{-2}`, T`L = 10\log_{10}\frac{I}{10^{-12}}\ \text{dB}`, T`L = 10\log_{10}(4.0\times10^{8}) = 86\ \text{dB}`, T`2r:\ \ I/4 \Rightarrow -6\ \text{dB} \Rightarrow 80\ \text{dB}`], { ks: [1, 2, 3, 3], dy: 74, size: 26 });
          } }
      ]],
      ['Energy, reflection, and where it breaks', [
        { say: ['A wave carries energy without carrying matter. On a string, the power is one half mu omega squared A squared v. It goes as the square of the amplitude and the square of the frequency: double either, and you send four times the power.',
                'At a fixed end, a pulse reflects upside down. The wall must hold the string still, so it pushes back with an equal and opposite pulse. At a free end, the pulse reflects the right way up. The same rules decide whether light reflected from glass changes phase.'],
          draw(r, S) {
            K.tex(r, S, 0, T`P = \tfrac12\,\mu\,\omega^{2}A^{2}\,v`, 480, 90, { size: 36, c: C.yellow });
            const a = S.at(1, 0.7); if (a > 0) {
              const s = (Math.max(0, S.t - S.B[1]) * 0.22) % 1.6, X = (u) => 120 + 600 * u;
              const inc = s < 0.8 ? 1 : 0, uc = s < 0.8 ? 0.1 + s : 0.9 - (s - 0.8), sign = s < 0.8 ? 1 : -1;
              r.alpha(a, () => { r.line(720, 230, 720, 350, { c: C.greyB, w: 6 }); r.line(120, 290, 720, 290, { c: C.greyD, w: 1.2 }); str(r, 120, 720, 290, (u) => sign * 50 * pulse(u, Math.min(uc, 1), 0.05), { c: inc ? C.blue : C.red, n: 260 }); r.txt(inc ? 'incoming' : 'reflected: inverted', 420, 380, { size: 18, sans: true, c: inc ? C.blue : C.red, align: 'center' }); });
            }
          } },
        { say: ['Finally, the honest limits. Our derivation assumed small slopes, so that the tension is the same everywhere and the string does not stretch. Pluck too hard and that fails.',
                'It also assumed a perfectly flexible string. A real steel string is slightly stiff, which makes higher harmonics travel a little faster. Their frequencies come out slightly above whole-number multiples. Piano tuners hear this, and tune the high notes slightly sharp to match.',
                'And in many media the speed depends on frequency. That is dispersion: it is why a prism splits white light into colours, and why a pulse spreads out as it travels.'],
          draw(r, S) {
            const A = K.axes(r, { x0: 120, y0: 420, w: 600, h: 300, xr: [0, 9], yr: [0, 10], xl: 'n', yl: 'f_n / f_1', xt: [0, 9, 1], yt: [0, 10, 2] });
            const a = S.at(1, 0.8); if (a > 0) {
              r.alpha(a, () => A.draw(1));
              for (let n = 1; n <= 8; n++) { const q = S.at(1, 0.4, 0.3 + n * 0.12); r.dot(...A.pt(n, n), { r: 6, c: C.greyB, a: q }); r.dot(...A.pt(n, n * Math.sqrt(1 + 0.004 * n * n)), { r: 6, c: C.yellow, a: q }); }
              r.txt('ideal', 760, 200, { size: 17, sans: true, c: C.greyB, a }); r.txt('stiff string (exaggerated)', 760, 230, { size: 17, sans: true, c: C.yellow, a });
            }
            K.txt(r, S, 0, 'small slopes, flexible string, no dispersion: three assumptions', 480, 70, { size: 20, align: 'center', c: C.greyB });
            K.tex(r, S, 2, T`v = v(f)\ \Rightarrow\ \text{dispersion}`, 820, 330, { size: 28, c: C.blue });
          } },
        { say: ['Let us collect what we found.',
                'A wave moves a pattern, not the medium. Its speed is f lambda, and a travelling wave is A sin of k x minus omega t.',
                'For a string, Newton\'s law on a small piece gives the wave equation, and any shape f of x minus v t solves it, with v equal to root T over mu.',
                'The equation is linear, so waves superpose: they add where they meet and pass through each other unchanged.',
                'Two opposite waves make a standing wave, 2 sin k x cos omega t. Fixed ends allow only lambda equals 2 L over n, so f n equals n v over 2 L; a closed pipe allows only odd multiples of v over 4 L.',
                'The model breaks for large amplitudes, stiff strings and dispersive media, which is where real instruments and real optics get interesting.',
                'MIT\'s 8.03 lectures develop all of this in depth, and 3Blue1Brown\'s lessons on partial differential equations show the same ideas for heat. Thank you for watching.', 1.5],
          draw(r, S) {
            K.txt(r, S, 0, 'Summary', 80, 70, { size: 30, c: C.blue });
            K.list(r, S, [1, 2, 3, 4, 5], ['the pattern travels, not the medium: v = fλ', 'Newton on a small piece ⇒ ∂²y/∂t² = (T/μ) ∂²y/∂x², v = √(T/μ)', 'linear ⇒ superposition and interference', 'standing waves: λ = 2L/n, f = nv/2L; closed pipe: odd harmonics', 'limits: large amplitude, stiffness, dispersion'], 90, 140, { dy: 56, size: 22 });
          } }
      ]]
    ]
  });
})();
/* On-ramps for the lectures, for viewers meeting the topic for the first time.
   L.ramp(id, R) rebuilds a lecture's chapters: a first chapter "Before we start" (the lecture's own title scene,
   then the goal and what you need, the words, and the symbols with how to say them), and, at the end of every
   chapter, a "Check yourself" scene (question, a pause to think, the answer) and an "In short" recap.
   R.ch[i] = [question, answer, recap point, …] for chapter i; with no recap points only the check is added.
   On the last chapter the check goes before the closing scene that thanks the viewer. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C, T = String.raw;
  const wrap = (s, w, size) => {
    const n = Math.max(12, Math.floor(w / (size * 0.45))), out = []; let line = '';
    String(s).split(/\s+/).forEach((word) => { if (line && line.length + 1 + word.length > n) { out.push(line); line = word; } else line = line ? line + ' ' + word : word; });
    if (line) out.push(line); return out;
  };
  const para = (r, s, x, y, o = {}) => {
    const size = o.size || 24, lh = o.lh || size * 1.42, lines = wrap(s, o.w || 760, size);
    if ((o.a == null ? 1 : o.a) > 0.003) lines.forEach((ln, i) => r.txt(ln, x, y + i * lh, { size, align: o.align || 'center', c: o.c || C.ink, a: o.a, italic: o.italic, bold: o.bold }));
    return lines.length;
  };
  const head = (r, S, str, y) => { const a = S.in(0.1, 0.7); r.txt(str, 480, y, { size: 18, align: 'center', c: C.yellow, sans: true, a }); r.line(480 - 110 * a, y + 18, 480 + 110 * a, y + 18, { c: C.yellow, w: 1.5, a: a * 0.6 }); };
  const andList = (xs) => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function intro(spec, R) {
    const need = R.need || [], say = ['Before we start, here is where this lecture is going. ' + R.goal];
    if (need.length) say.push('To follow it, you will need ' + andList(need) + '. If any of these feel shaky, each topic’s step-by-step guide starts from scratch.');
    return { say, draw(r, S) {
      head(r, S, 'Before we start', 66);
      r.txt(spec.title, 480, 118, { size: 28, align: 'center', a: S.in(0.2, 0.8) });
      para(r, R.goal, 480, 186, { size: 24, w: 780, a: S.at(0, 0.8) });
      const a = S.at(1, 0.7); if (a <= 0) return;
      r.txt('You will need', 480, 336, { size: 17, align: 'center', c: C.green, sans: true, a });
      need.forEach((n, i) => { const q = S.at(1, 0.6, 0.3 + i * 0.5); if (q <= 0) return; r.dot(230, 380 + i * 42, { r: 4, c: C.green, a: q }); r.txt(n, 248, 380 + i * 42, { size: 22, a: q }); });
    } };
  }
  function words(R) {
    const W = R.words;
    return { say: ['First, the words this lecture uses, in plain language.'].concat(W.map(([w, m]) => `${cap(w)}: ${m}.`)), draw(r, S) {
      head(r, S, 'Words', 66);
      W.forEach(([w, m], i) => {
        const k = i + 1, a = S.at(k, 0.6); if (a <= 0) return; const y = 116 + i * 66, cur = S.b === k;
        if (cur) r.dot(70, y, { r: 5, c: C.yellow, a });
        r.txt(w, 262, y, { size: 22, align: 'right', bold: true, c: cur ? C.yellow : C.ink, a });
        para(r, m, 286, y, { size: 20, w: 600, align: 'left', lh: 25, a });
      });
    } };
  }
  function syms(R) {
    const Y = R.syms;
    return { say: ['Next, the symbols you will see on screen, and how to read them aloud.'].concat(Y.map(([, spoken, m]) => `${spoken}: ${m}.`)), draw(r, S) {
      head(r, S, 'Symbols, and how to say them', 66);
      const nl = Y.map(([, , m]) => wrap(m, 590, 20).length), extra = nl.reduce((s, n) => s + n - 1, 0), step = Math.min(72, (372 - 24 * extra) / Math.max(1, Y.length - 1));
      let y = 120;
      Y.forEach(([tex, spoken, m], i) => {
        const k = i + 1, a = S.at(k, 0.6), cur = S.b === k; if (i) y += step + 24 * (nl[i - 1] - 1); if (a <= 0) return;
        if (cur) r.dot(46, y, { r: 5, c: C.yellow, a });
        K.tex(r, S, k, tex, 186, y, { size: 26, c: C.blue });
        r.txt('say “' + spoken + '”', 330, y - 13, { size: 17, italic: true, c: C.greyB, a });
        para(r, m, 330, y + 13, { size: 20, w: 590, align: 'left', lh: 24, a });
      });
    } };
  }
  function check(q, ans) {
    return { say: [[`Check yourself. ${q}`, 5], ans], draw(r, S) {
      head(r, S, 'Check yourself', 76);
      const n = para(r, q, 480, 140, { size: 27, w: 820, lh: 38, a: S.at(0, 0.7) }), y0 = 140 + n * 38 + 34;
      const ring = S.at(0, 0.6) * (1 - S.at(1, 0.4));
      if (ring > 0) r.circle(480, y0 + 6, 16, { c: C.yellow, w: 3, p: K.clamp(S.since(0) / (S.D[0] || 6)), a: ring * 0.9 });
      const b = S.at(1, 0.7); if (b <= 0) return;
      r.txt('Answer', 480, y0, { size: 17, align: 'center', c: C.green, sans: true, a: b });
      para(r, ans, 480, y0 + 44, { size: 24, w: 800, lh: 34, a: b });
    } };
  }
  function recap(items) {
    return { say: items.map((s, i) => (i ? s : 'In short. ' + s)), draw(r, S) {
      head(r, S, 'In short', 92);
      let y = 168;
      items.forEach((s, i) => {
        const a = S.at(i, 0.6), lines = wrap(s, 700, 25);
        if (a > 0) { r.dot(150, y, { r: 5, c: C.blue, a }); lines.forEach((ln, j) => r.txt(ln, 170, y + j * 34, { size: 25, a })); }
        y += lines.length * 34 + 30;
      });
    } };
  }

  L.ramp = function (id, R) {
    const s = L.all[id]; if (!s || s._ramped) return;
    if (R.ch.length !== s.chapters.length) throw new Error(`ramp ${id}: ${R.ch.length} checks for ${s.chapters.length} chapters`);
    s._ramped = true;
    const old = s.chapters, map = [0], first = [old[0][1][0], intro(s, R), words(R), syms(R)], out = [[R.title || 'Before we start', first]];
    let idx = first.length;
    old.forEach(([title, list], ci) => {
      const body = ci === 0 ? list.slice(1) : list.slice(), [q, ans, ...rc] = R.ch[ci], extra = [check(q, ans)];
      if (rc.length) extra.push(recap(rc));
      const end = body[body.length - 1], closing = ci === old.length - 1 && /Thank you for watching/.test(JSON.stringify(end.say || []));
      const scenes = closing ? body.slice(0, -1).concat(extra, [end]) : body.concat(extra);
      body.forEach((sc) => map.push(idx + scenes.indexOf(sc)));
      out.push([title, scenes]); idx += scenes.length;
    });
    s.chapters = out;
    if (s.thumb && map[s.thumb[0]] != null) s.thumb = [map[s.thumb[0]], s.thumb[1]];
  };

  /* ---------- the on-ramps ---------- */
  L.ramp('calculus', {
    goal: 'By the end you will know what a derivative and an integral are, how to work out simple ones, and why each one undoes the other.',
    need: ['the areas of rectangles and triangles', 'the gradient of a straight line', 'powers such as x² and x³'],
    words: [
      ['rate of change', 'how fast one quantity changes as another one changes'],
      ['gradient', 'steepness: how far a graph rises for each step across'],
      ['limit', 'the value a calculation closes in on as a small step shrinks towards zero'],
      ['derivative', 'the rate of change at a single instant: the gradient of the graph at one point'],
      ['integral', 'the total you get by adding up many tiny pieces: the area under a graph'],
      ['tangent', 'the straight line that just touches a curve at one point']
    ],
    syms: [
      [T`\Delta t`, 'delta t', 'a small but definite change in t'],
      [T`dx`, 'd x', 'a change in x so small that we take the limit as it shrinks to zero'],
      [T`\frac{dy}{dx}`, 'd y by d x', 'the derivative: the rate of change of y with x'],
      [T`f'(x)`, 'f prime of x', 'another way of writing the derivative of f'],
      [T`\int_a^b f(x)\,dx`, 'the integral of f from a to b', 'the area under the graph of f between a and b'],
      [T`\lim_{h\to 0}`, 'the limit as h tends to zero', 'what an expression closes in on as h shrinks']
    ],
    ch: [
      ['A thin ring of radius r and thickness dr is cut and straightened. Roughly what is its area?', 'About 2πr times dr: its length is the circumference, 2πr, and its width is dr.', 'Adding up all the thin rings gives the area of the circle, πR²: that is an integral.', 'The area grows at a rate equal to the circumference, 2πr: that is a derivative.'],
      ['For y = x², what does the slope between x = 5 and x = 5 + h close in on as h shrinks?', 'The slope is (25 + 10h + h² − 25)/h = 10 + h, which closes in on 10: twice 5.', 'The derivative is the limit of the slope of a line through two nearby points.', 'We never divide by zero: we watch what the ratio approaches for small, non-zero steps.'],
      ['Use the growing-cube picture. Why is the derivative of x³ equal to 3x²?', 'Growing the side by dx adds three thin slabs, each x² by dx; the other pieces are far smaller, so the volume grows by 3x² dx.', 'A derivative can be seen as the thin strips added when a shape grows a little.', 'Pieces made of two small factors, like dx times dx, vanish in the limit.'],
      ['Use the product rule on x² times x³, and check the answer against x⁵.', 'x² × 3x² + x³ × 2x = 3x⁴ + 2x⁴ = 5x⁴, which is indeed the derivative of x⁵.', 'Product rule: the derivative of fg is f times g′ plus g times f′.', 'Chain rule: the rates of change of the inner and outer functions multiply.'],
      ['Use the derivative to estimate √9.2 without a calculator.', 'Near 9, the slope of √x is 1/(2√9) = 1/6, so √9.2 ≈ 3 + 0.2/6 = 3.033. The true value is 3.0332.', 'eˣ is the one exponential that is its own derivative.', 'At a maximum or minimum the derivative is zero, and close up any smooth curve looks like a straight line.'],
      ['A car’s speed rises steadily from 0 to 20 m/s in 10 s. How far does it travel?', 'The distance is the area under the velocity graph: a triangle, ½ × 10 × 20 = 100 m.', 'An integral is the limit of a sum of thin rectangles: the area under a graph.', 'The area under a velocity–time graph is the distance travelled.'],
      ['Find the area under y = x² from 0 to 3 without adding up rectangles.', 'x³/3 has derivative x², so the area is 3³/3 − 0 = 9.', 'The area function grows at a rate equal to the height of the graph.', 'So to integrate f, find any F with F′ = f, then work out F(b) − F(a).'],
      ['What is the derivative of sin(5x)? And why does an indefinite integral need “plus C”?', 'It is 5 cos(5x): the chain rule supplies the inner factor 5. And plus C, because adding a constant never changes a derivative.']
    ]
  });

  L.ramp('shm', {
    goal: 'By the end you will know why so many different things oscillate, how one equation describes them all, and where that simple model stops working.',
    need: ['Newton’s second law, F = ma', 'the sine and cosine graphs', 'kinetic energy, ½mv²'],
    words: [
      ['equilibrium', 'the position where the forces balance, so the object could stay at rest'],
      ['displacement', 'how far the object is from equilibrium, with a sign for the direction'],
      ['restoring force', 'a force that always pushes back towards equilibrium'],
      ['amplitude', 'the largest displacement: how far the swing goes'],
      ['period', 'the time for one complete oscillation; the frequency is how many happen each second'],
      ['damping', 'friction-like losses that make an oscillation die away']
    ],
    syms: [
      [T`\ddot x`, 'x double dot', 'the second derivative of x with time: the acceleration'],
      [T`\omega`, 'omega', 'the angular frequency, in radians per second'],
      [T`T = \frac{2\pi}{\omega}`, 'T equals two pi over omega', 'the period'],
      [T`A`, 'A', 'the amplitude'],
      [T`\varphi`, 'phi', 'the phase: where in its cycle the motion starts'],
      [T`k`, 'k', 'the spring constant: the force needed per metre of stretch']
    ],
    ch: [
      ['Why does almost any system oscillate when nudged slightly away from a stable equilibrium?', 'Near the bottom of any smooth valley the energy curve is close to a parabola, so the restoring force is proportional to the displacement.', 'A stable equilibrium sits at the bottom of a valley in the energy curve.', 'At the top of a hill, a small push grows instead: the equilibrium is unstable.'],
      ['A spring with k = 50 N/m holds a 2.0 kg mass. Find ω and the period. Do they change if you pull it further?', 'ω = √(k/m) = 5 rad/s and T = 2π/ω = 1.26 s, whatever the amplitude.', 'The acceleration is proportional to the displacement and opposite to it.', 'The period depends only on k and m, not on how far you pull: that is why pendulum clocks keep time.'],
      ['A point goes round a circle of radius 0.10 m at 4 rad/s. What are the top speed and top acceleration of its shadow?', 'Top speed Aω = 0.40 m/s; top acceleration Aω² = 1.6 m/s².', 'Simple harmonic motion is steady circular motion seen edge-on.', 'The speed peaks at the centre and the acceleration at the ends.'],
      ['If you double an oscillator’s amplitude, what happens to its energy and its top speed?', 'The energy, ½kA², becomes four times larger; the top speed, Aω, doubles.', 'Energy swaps between the spring and the motion, and the total stays fixed.', 'The speed is ω√(A² − x²): fastest at the centre, momentarily still at the ends.'],
      ['An oscillator starts at x = 0, moving in the positive direction. With x = A cos(ωt + φ), what is φ?', 'x = 0 needs cos φ = 0, and a positive velocity, −Aω sin φ, needs sin φ < 0. So φ = −π/2.', 'Find ω from √(k/m) first; everything else follows from A and ω.', 'Fix the phase from both the starting position and the starting velocity, checking the signs.'],
      ['A circuit has L = 1.0 mH and C = 10 nF. At what frequency does it ring?', 'ω = 1/√(LC) = 3.2 × 10⁵ rad/s, so f = ω/2π ≈ 50 kHz.', 'Inductance plays the part of mass, and 1/C the part of the spring constant.', 'Molecules vibrate the same way, and infrared spectra measure the stiffness of their bonds.'],
      ['Name two ways in which real oscillators differ from simple harmonic motion.', 'They lose energy, so the swing dies away, and at large amplitudes the restoring force is no longer proportional to the displacement, so the period changes.']
    ]
  });

  L.ramp('waves', {
    goal: 'By the end you will know what a wave is, what sets its speed, how waves add together, and why strings and pipes play only certain notes.',
    need: ['speed = distance ÷ time', 'the sine graph', 'Newton’s second law'],
    words: [
      ['transverse wave', 'a wave in which the medium moves across the direction of travel, like a shaken rope'],
      ['longitudinal wave', 'a wave in which the medium moves back and forth along the direction of travel, like sound'],
      ['wavelength', 'the distance from one crest to the next'],
      ['frequency', 'how many crests pass each second, measured in hertz'],
      ['superposition', 'where waves overlap, their displacements simply add'],
      ['node and antinode', 'in a standing wave, points that never move, and points that move the most']
    ],
    syms: [
      [T`\lambda`, 'lambda', 'the wavelength'],
      [T`f`, 'f', 'the frequency'],
      [T`v = f\lambda`, 'v equals f lambda', 'the wave speed is the frequency times the wavelength'],
      [T`k = \frac{2\pi}{\lambda}`, 'k equals two pi over lambda', 'the wavenumber: radians of phase per metre'],
      [T`\mu`, 'mu', 'the mass of a string per metre of its length'],
      [T`T`, 'T', 'the tension in a string; careful, not the period in this lecture']
    ],
    ch: [
      ['A wave on a rope moves to the right. Does any piece of the rope move to the right?', 'No. Each piece only moves up and down; what travels is the pattern, and the energy with it.', 'A wave carries a disturbance and energy, not the material itself.', 'A wave written as sin(kx − ωt) moves to the right at speed ω/k, which equals fλ.'],
      ['A string’s tension is made four times larger. What happens to the wave speed?', 'It doubles, because v = √(T/μ).', 'A curved piece of string feels a net force from the tension, and that drives the wave.', 'The speed √(T/μ) does not depend on the frequency or the amplitude.'],
      ['Sound travels at 343 m/s. What is the wavelength of a 686 Hz note?', 'λ = v/f = 343/686 = 0.50 m.', 'Convert grams per metre into kilograms per metre before using v = √(T/μ).', 'Audible wavelengths run from centimetres to metres: the size of everyday objects.'],
      ['Newton’s formula gave 290 m/s for sound in air, not 343 m/s. What did he assume wrongly?', 'That air stays at constant temperature as it is squeezed. The squeezes are too fast for heat to flow away, so the air also warms, which makes it stiffer by a factor of 1.4.', 'The speed of sound is the square root of stiffness over density, like any wave.', 'When a careful calculation disagrees with measurement, look for a hidden assumption.'],
      ['Two loudspeakers send out the same 1.0 m wavelength in step. At a point 3.5 m from one and 5.0 m from the other, is the sound loud or quiet?', 'The path difference is 1.5 m, one and a half wavelengths, so the waves arrive out of step: quiet.', 'Waves pass through each other unchanged; where they overlap, their displacements add.', 'A path difference of a whole number of wavelengths gives a maximum; an extra half wavelength gives a minimum.'],
      ['A 256 Hz tuning fork and a string sounded together give 3 beats per second. What could the string’s frequency be?', 'Either 253 Hz or 259 Hz: the beat frequency is the difference between the two.', 'Beats come at the difference of two nearby frequencies.', 'A moving source raises the pitch in front of it and lowers it behind.'],
      ['A string vibrates at 200 Hz in two loops, its second harmonic. What is its fundamental frequency?', '100 Hz: the harmonics are whole-number multiples of the fundamental.', 'Two equal waves moving in opposite directions make a standing wave with fixed nodes.', 'On a string fixed at both ends, a whole number of half-wavelengths must fit.'],
      ['In Melde’s experiment, why do fewer loops need more tension?', 'At a fixed frequency, more tension means a faster wave and so a longer wavelength, so fewer half-wavelengths fit on the string.', 'The tension needed falls as one over the number of loops, squared.', 'Rearrange the standing-wave condition for whatever the question asks.'],
      ['A pipe closed at one end is 0.50 m long, and sound travels at 340 m/s. What is its lowest note, and which harmonics does it play?', 'f = v/(4L) = 170 Hz, and only odd harmonics: 170, 510, 850 Hz, and so on.', 'An open end is an antinode of the air’s motion, and a closed end is a node.', 'Draw the node pattern first, then count quarter-wavelengths.'],
      ['Outdoors, you move from 5 m to 20 m away from a small loudspeaker. By how many decibels does the level fall?', 'The intensity falls by 4², that is 16 times, which is 12 dB: 6 dB for each doubling of distance.', 'Sound spreads over a sphere, so its intensity falls as one over the distance squared.', 'Decibels are logarithmic: every factor of 10 in intensity adds 10 dB.'],
      ['A pulse travels to the fixed end of a string. How does it come back, and why?', 'Upside down: the fixed end must stay still, so it pulls back with an equal and opposite pulse.']
    ]
  });

  L.ramp('fourier', {
    goal: 'By the end you will know how any repeating signal can be built from sine waves, how to find how much of each it contains, and what the Fourier transform tells you about any signal at all.',
    need: ['the sine and cosine graphs', 'integrating simple functions', 'angles in radians'],
    words: [
      ['harmonic', 'a sine wave whose frequency is a whole-number multiple of a basic frequency'],
      ['Fourier series', 'a sum of harmonics that builds up a repeating signal'],
      ['coefficient', 'how much of one particular harmonic a signal contains'],
      ['orthogonal', 'of two functions: their product averages to zero over a period, like perpendicular directions'],
      ['spectrum', 'a chart of how much of each frequency a signal contains'],
      ['Fourier transform', 'the spectrum of a signal that need not repeat']
    ],
    syms: [
      [T`\sin nx`, 'sine n x', 'the n-th harmonic, n times as fast as sin x'],
      [T`b_n`, 'b n', 'the amount of the n-th sine harmonic'],
      [T`\sum_{n=1}^{\infty}`, 'the sum from n equals one to infinity', 'add up all the terms'],
      [T`e^{i\theta}`, 'e to the i theta', 'a point on the unit circle at angle theta: cos theta plus i sin theta'],
      [T`\hat f(\omega)`, 'f hat of omega', 'the Fourier transform: how much of frequency omega the signal contains'],
      [T`\omega = 2\pi f`, 'omega equals two pi f', 'the angular frequency']
    ],
    ch: [
      ['In a cooling rod, which fades faster: a gentle, slowly varying temperature pattern or a finely wiggling one?', 'The finely wiggling one. Each sine pattern fades at its own rate, and short wavelengths fade fastest.', 'Fourier split a hard heat problem into sine patterns that each evolve simply.', 'After a while only the smoothest pattern is left.'],
      ['What is the Gibbs overshoot?', 'Near a jump, a sum of sine waves overshoots by about 9% of the jump. Adding more terms makes the overshoot narrower but never removes it.', 'A square wave is four over pi times sin x, plus a third of sin 3x, plus a fifth of sin 5x, and so on.', 'Smooth sine waves can build corners and jumps, in the limit.'],
      ['Why is the integral of sin x times sin 3x over a whole period equal to zero?', 'The product is positive as often as it is negative, so it averages to zero: different harmonics are orthogonal.', 'Multiply by sin nx and integrate: every other harmonic drops out.', 'This is projection, exactly how you find one component of a vector.'],
      ['A signal has a sharp jump. Do its Fourier coefficients fall off quickly or slowly, and why does it matter?', 'Slowly, like one over n, so many terms are needed, and the overshoot at the jump never goes away.', 'Jumps make coefficients fall like 1/n; corners like 1/n²; smooth shapes faster still.', 'Putting x = π/2 into the square wave’s series gives π/4 = 1 − ⅓ + ⅕ − ⋯.'],
      ['What does e to the i n t look like, and how can a sum of them draw a picture?', 'It is an arrow turning n times per cycle. Chaining arrows of different lengths and speeds, tip to tail, can trace any closed curve.', 'Sines and cosines are the shadows of rotating arrows.', 'Each arrow’s length and starting angle come from the same projection trick.'],
      ['Your ear hears three notes in a chord, though the pressure wave looks like a tangle. How?', 'The cochlea’s hair cells are tuned to different frequencies, so the ear splits sound into its frequencies: a mechanical Fourier analysis.', 'A spectrum shows which frequencies are present, and how strongly.', 'The pattern of harmonics above a note is what we hear as its timbre.'],
      ['What do the size and the angle of the Fourier transform at a frequency tell you?', 'The size says how much of that frequency the signal contains; the angle gives the phase of that component.', 'As the period grows longer, a Fourier series becomes the Fourier transform: an integral over all frequencies.', 'Nothing is lost: running the transform backwards rebuilds the signal exactly.'],
      ['A sound lasts only 5 milliseconds. Roughly how sharp can its pitch be?', 'No sharper than about one over 5 milliseconds, that is about 200 Hz: short signals have broad spectra.', 'Narrow in time means wide in frequency, and the other way round.', 'The uncertainty principle is the same mathematics, applied to matter waves.'],
      ['Name two technologies that depend on Fourier transforms.', 'For example JPEG image compression, MRI scanners, the spectroscopy of starlight, and the tuner app on a phone.']
    ]
  });

  L.ramp('gauss', {
    goal: 'By the end you will know what electric flux is, what Gauss’s law says, and how to use symmetry to find electric fields in a single line.',
    need: ['Coulomb’s law and electric field strength', 'the surface areas of a sphere and a cylinder', 'vectors and the angle between them'],
    words: [
      ['electric field', 'the force on each coulomb of positive charge placed at a point'],
      ['field line', 'a line drawn along the field’s direction; denser lines mean a stronger field'],
      ['flux', 'how much field passes through a surface, allowing for its angle'],
      ['closed surface', 'a surface with no edges that encloses a volume, like a balloon'],
      ['Gaussian surface', 'an imaginary closed surface, chosen to make a calculation easy'],
      ['symmetry', 'a change, such as a rotation, that leaves the arrangement looking the same']
    ],
    syms: [
      [T`\vec E`, 'E', 'the electric field, a vector'],
      [T`\Phi = EA\cos\theta`, 'phi equals E A cos theta', 'the flux through a flat area at angle theta to the field'],
      [T`\oint \vec E\cdot d\vec A`, 'the closed surface integral of E dot d A', 'the total flux out of a closed surface'],
      [T`\varepsilon_0`, 'epsilon nought', 'the permittivity of free space, 8.85 × 10⁻¹² farads per metre'],
      [T`Q_{\text{enc}}`, 'Q enclosed', 'the charge inside the surface'],
      [T`\lambda,\ \sigma,\ \rho`, 'lambda, sigma, rho', 'charge per metre, per square metre and per cubic metre']
    ],
    ch: [
      ['Why can two field lines never cross?', 'At any point the field has only one direction, and a crossing would give it two.', 'Field lines start on positive charges and end on negative ones.', 'The field of a point charge spreads out over spheres, so it falls as one over r squared.'],
      ['A charge sits outside a closed surface. What is the total flux through the surface?', 'Zero: every field line that enters also leaves, and in counts negative while out counts positive.', 'The flux through a flat area is E A cos θ: largest face-on, zero edge-on.', 'Only charge inside a closed surface gives a net flux.'],
      ['A charge of 1.0 nC sits inside a closed surface of any shape. What is the total flux?', 'Q/ε₀ = 10⁻⁹/(8.85 × 10⁻¹²) ≈ 113 V m, whatever the shape or size of the surface.', 'The total flux out of any closed surface is the enclosed charge divided by ε₀.', 'To use it, choose a surface on which the field is constant, or contributes nothing.'],
      ['The total flux through a surface is zero. Must the field on the surface be zero?', 'No. Outside charges can make a field there, as long as as much flux enters as leaves.', 'The field in Gauss’s law is the total field, from every charge.', 'Without symmetry, Gauss’s law is still true, but it does not hand you the field.'],
      ['Inside a uniformly charged solid sphere, how does the field change with distance from the centre?', 'It grows in proportion to r: the enclosed charge grows as r³, while the surface area grows only as r².', 'Outside, a spherical charge acts as if it were all at the centre.', 'Inside a uniform solid sphere the field grows with r; inside a thin shell it is zero.'],
      ['How does the field of a long charged wire fall with distance, compared with a point charge?', 'As one over r for the wire, but one over r squared for a point charge: doubling the distance halves the wire’s field instead of quartering it.', 'For a wire, use a cylinder: flux leaves only through the curved side.', 'The field of a line of charge is λ over 2π ε₀ r.'],
      ['Why doesn’t the field of a large charged sheet get weaker as you move away?', 'Its field lines are parallel and never spread out, so their density, and the field, stay the same.', 'Between the plates of a capacitor the field is uniform, σ/ε₀.', 'Capacitance is ε₀A/d: bigger plates, closer together, store more charge per volt.'],
      ['Why can’t a Van de Graaff dome of radius 10 cm reach a million volts?', 'Its surface field would be V/R = 10 MV per metre, above air’s breakdown field of about 3 MV per metre, so it sparks first, at around 300 kV.', 'Outside a charged sphere, the field at the surface equals the voltage divided by the radius.', 'Gravity follows the same inverse-square law, so Gauss’s law works for it too.'],
      ['Why are you safe inside a car struck by lightning?', 'The metal body is a conductor: its charges rearrange on the outside so that the field inside stays zero. It is a Faraday cage.', 'In equilibrium the field inside a conductor is zero, and any extra charge sits on its surface.', 'Just outside, the field is σ/ε₀, strongest at sharp points.'],
      ['In empty space, what is the divergence of the electric field, and what does that say about field lines?', 'Zero: there, field lines are neither created nor destroyed. They begin and end only on charges.', 'Divergence measures how much a field spreads out from a point.', 'Gauss’s law at a point: the divergence of E equals ρ/ε₀.'],
      ['How do experiments test the inverse-square law so precisely?', 'They look for any field inside a charged hollow conductor, which would appear if the force law were even slightly different. None is found.']
    ]
  });

  L.ramp('faraday', {
    goal: 'By the end you will know how a changing magnetic field makes a voltage, how to calculate it, and how generators, transformers and motors use it.',
    need: ['what a magnetic field is', 'current, voltage and resistance, V = IR', 'what a rate of change is'],
    words: [
      ['magnetic flux', 'how much magnetic field passes through a loop'],
      ['flux linkage', 'the flux through a coil times its number of turns'],
      ['EMF', 'electromotive force: the voltage that pushes current round a loop'],
      ['induction', 'making a voltage by changing the flux through a circuit'],
      ['eddy currents', 'loops of current induced inside a solid piece of metal'],
      ['inductance', 'how strongly a coil opposes changes in its own current']
    ],
    syms: [
      [T`B`, 'B', 'the magnetic field strength, in tesla'],
      [T`\Phi = BA\cos\theta`, 'phi equals B A cos theta', 'the flux through a loop of area A'],
      [T`N\Phi`, 'N phi', 'the flux linkage of a coil with N turns'],
      [T`\varepsilon = -N\frac{d\Phi}{dt}`, 'epsilon equals minus N d phi by d t', 'Faraday’s law; the minus sign is Lenz’s law'],
      [T`\text{Wb}`, 'weber', 'the unit of flux: one tesla times one square metre'],
      [T`L`, 'L', 'the self-inductance of a coil, in henries']
    ],
    ch: [
      ['A strong magnet rests, without moving, inside a coil. Is any current induced?', 'No. Only a change in the magnetic field through the coil induces a current.', 'Moving the magnet in or out makes current flow, in opposite directions.', 'Faster motion gives a bigger current.'],
      ['Name the three ways of changing the flux through a loop.', 'Change the field B, the area A, or the angle θ between the field and the loop.', 'The flux is B A cos θ, measured in webers.', 'A coil of N turns links the flux N times.'],
      ['The flux through a 50-turn coil rises steadily by 0.020 Wb in 0.10 s. What EMF is induced?', 'ε = N ΔΦ/Δt = 50 × 0.020/0.10 = 10 V.', 'The EMF equals the rate of change of flux linkage.', 'Lenz’s law: the induced current opposes the change that caused it, which is energy conservation in disguise.'],
      ['A 0.20 m rod slides at 5.0 m/s across a 0.50 T field. What EMF does it produce?', 'ε = BLv = 0.50 × 0.20 × 5.0 = 0.50 V.', 'A moving rod sweeps out area, so its EMF is BLv.', 'Pushing the rod against the magnetic drag is where the electrical energy comes from.'],
      ['A magnet falls through a coil. Why is the second EMF pulse taller but briefer than the first?', 'The magnet is moving faster as it leaves, so the flux changes faster. Each pulse has the same area, because the flux change is the same.', 'Sketch the flux first; the EMF is minus its gradient.', 'The area under each pulse equals N times the change in flux.'],
      ['A generator is spun twice as fast. What happens to its peak EMF and to its frequency?', 'Both double: the peak EMF is N B A ω.', 'A rotating coil makes a sine-wave EMF automatically.', 'The EMF peaks when the coil is edge-on to the field, where the flux is zero but changing fastest.'],
      ['A transformer steps 230 V down to 11.5 V. The primary has 2000 turns. How many does the secondary have?', 'The voltages are in the ratio of the turns, so the secondary has 2000 × 11.5/230 = 100 turns.', 'Transformers need alternating current: a steady current gives no changing flux.', 'Power lines use high voltage so that the current, and the heating loss, stay small.'],
      ['Why does a motor draw a huge current when it is jammed?', 'With the coil not turning there is no back EMF, so the full supply voltage drives current through the coil’s small resistance.', 'A spinning motor is also a generator, and its back EMF limits the current.', 'Induction hobs and wireless chargers are transformers whose second coil is the pan or the phone.'],
      ['Why can switching off the current in a big coil cause a spark?', 'The current tries to stop instantly, so its rate of change is huge, and the coil’s back EMF becomes large enough to jump the gap.', 'The inductance of a solenoid grows as the number of turns squared.', 'An inductor stores energy ½LI² in its magnetic field.'],
      ['A magnet moves near a loop of wire whose electrons are at rest. What pushes them round?', 'An electric field, created by the changing magnetic field, that curls round in closed loops.', 'A changing magnetic field makes a circulating electric field.', 'With Maxwell’s addition, this predicts electromagnetic waves travelling at the speed of light.'],
      ['Faraday’s spinning copper disc makes a steady EMF. Why is that puzzling for the flux rule?', 'No loop’s flux is obviously changing. The EMF comes from the magnetic force on the moving charges, so when the flux rule is unclear, go back to the forces.']
    ]
  });

  L.ramp('relativity', {
    goal: 'By the end you will know Einstein’s two postulates, why they make moving clocks run slow and moving objects shorter, and where E = mc² comes from, with the experiments that test each step.',
    need: ['speed = distance ÷ time', 'Pythagoras’ theorem', 'momentum and kinetic energy'],
    words: [
      ['frame of reference', 'a viewpoint, with its own rulers and clocks, from which motion is measured'],
      ['inertial frame', 'a frame moving at constant velocity, not accelerating'],
      ['event', 'something that happens at one place, at one time'],
      ['time dilation', 'a moving clock is measured to tick more slowly'],
      ['length contraction', 'a moving object is measured to be shorter along its direction of motion'],
      ['proper time', 'the time shown by a clock that travels with the object']
    ],
    syms: [
      [T`c`, 'c', 'the speed of light, 3.00 × 10⁸ metres per second'],
      [T`\gamma = \frac{1}{\sqrt{1-v^2/c^2}}`, 'gamma', 'the Lorentz factor: 1 at rest, growing without limit as v approaches c'],
      [T`\Delta t = \gamma\,\Delta t_0`, 'delta t equals gamma delta t nought', 'time dilation'],
      [T`x',\ t'`, 'x prime, t prime', 'coordinates measured in a second, moving frame'],
      [T`E = \gamma mc^2`, 'E equals gamma m c squared', 'the total energy of a moving object'],
      [T`p = \gamma mv`, 'p equals gamma m v', 'relativistic momentum']
    ],
    ch: [
      ['What are Einstein’s two postulates?', 'The laws of physics are the same in every inertial frame, and the speed of light is the same for every inertial observer.', 'Below deck on a smooth ship, no experiment can tell steady motion from rest.', 'Together, the postulates force clocks and rulers, not light, to give way.'],
      ['A clock moves past you at 0.6c. How long does one of its 1-second ticks last in your frame?', 'γ = 1/√(1 − 0.36) = 1.25, so 1.25 s.', 'In a moving light clock the light follows a longer, diagonal path, so it ticks slowly.', 'At everyday speeds the effect is tiny, but atomic clocks can measure it.'],
      ['Cosmic-ray muons live only 2.2 microseconds on average. Why do so many reach the ground?', 'At 0.998c, γ is about 16, so in our frame they live about 35 microseconds and travel about 10 km: enough to cross the atmosphere.', 'Muons are a natural test of time dilation, and they pass it.', 'In the muon’s own frame, the atmosphere is contracted instead: the same answer.'],
      ['A lamp flashes in the middle of a moving carriage. For someone on the platform, which wall does the light reach first?', 'The back wall, which moves towards the light. For the passenger it reaches both at once, and both are right.', 'Events that are simultaneous in one frame need not be in another.', 'There is no universal “now”.'],
      ['In the pole-and-barn puzzle, who is right about whether the pole fits?', 'Both. The two door closings are simultaneous in the barn’s frame but not in the runner’s, so nobody ever sees a contradiction.', 'Length contraction works both ways: each sees the other’s object shortened.', 'Paradoxes dissolve once “at the same time” is treated as depending on the frame.'],
      ['What do the Lorentz equations become when v is much smaller than c?', 'x′ = x − vt and t′ = t: Galileo’s everyday rules.', 'The new term, vx/c² in the time equation, is the relativity of simultaneity.', 'The equations are built so that light has the same speed in both frames.'],
      ['On a spacetime diagram, why must every world line be steeper than 45 degrees?', 'Light rays are drawn at 45 degrees, and nothing can travel faster than light.', 'A moving observer’s axes tilt towards the light line.', 'Between two events, the straight world line has the longest proper time, so the travelling twin ages less.'],
      ['A rocket at 0.5c fires a probe forwards at 0.5c relative to itself. How fast is the probe, seen from the ground?', '(0.5 + 0.5)c divided by (1 + 0.25) = 0.8c, not 1.0c.', 'Relativistic velocity addition never gives more than c.', 'A source moving sideways is red-shifted by exactly γ: pure time dilation.'],
      ['How much energy is equivalent to 1 gram of mass?', 'E = mc² = 10⁻³ × (3.00 × 10⁸)² = 9.0 × 10¹³ J, about the energy of 20 thousand tonnes of TNT.', 'At rest an object has energy mc²; the kinetic energy is (γ − 1)mc².', 'Nuclear binding energy shows up as missing mass, as in the fusion that powers the Sun.'],
      ['GPS satellite clocks gain about 38 microseconds a day overall. Which two effects add up to this?', 'Weaker gravity higher up makes them run fast by about 45 microseconds a day (general relativity), and their speed makes them run slow by about 7 (special relativity).']
    ]
  });

  L.ramp('schrodinger', {
    goal: 'By the end you will know what the Schrödinger equation is, what its solution ψ means, and how it explains energy levels, tunnelling and the uncertainty principle.',
    need: ['wavelength and frequency', 'the photon energy E = hf', 'complex numbers, at least e to the i theta'],
    words: [
      ['wavefunction', 'the quantity ψ that the equation solves for; its size squared gives probabilities'],
      ['probability density', 'probability per unit length: how likely the particle is to be found near each point'],
      ['normalise', 'scale ψ so that the total probability is exactly one'],
      ['stationary state', 'a state of definite energy, whose probabilities do not change with time'],
      ['bound state', 'a state in which the particle is trapped, with a quantised energy'],
      ['tunnelling', 'passing through a barrier that the particle could not climb classically']
    ],
    syms: [
      [T`\psi(x,t)`, 'psi of x and t', 'the wavefunction'],
      [T`|\psi|^2`, 'the size of psi, squared', 'the probability density'],
      [T`\hbar = \frac{h}{2\pi}`, 'h bar', 'the reduced Planck constant, 1.05 × 10⁻³⁴ joule seconds'],
      [T`\lambda = \frac{h}{p}`, 'lambda equals h over p', 'the de Broglie wavelength of a particle'],
      [T`-\frac{\hbar^2}{2m}\psi'' + V\psi = E\psi`, 'the time-independent Schrödinger equation', 'the equation for states of definite energy'],
      [T`\Delta x\,\Delta p \ge \frac{\hbar}{2}`, 'delta x delta p is at least h bar over two', 'the uncertainty principle']
    ],
    ch: [
      ['An electron has momentum 1.0 × 10⁻²⁴ kg m/s. What is its de Broglie wavelength?', 'λ = h/p = 6.6 × 10⁻¹⁰ m, comparable to the spacing of atoms in a crystal, which is why crystals diffract electrons.', 'Electrons arrive as single dots, but build up interference patterns: they travel as waves.', 'The de Broglie wavelength is tiny for everyday objects and atom-sized for electrons.'],
      ['Why does the Schrödinger equation contain the number i?', 'Without it, waves would fade away, like heat spreading out. The i turns fading into rotation, so the total probability stays exactly one.', 'Schrödinger built his equation so that plane waves have the right energy and momentum.', 'It was a guess, judged by whether it gave the right answers. It did.'],
      ['The size of ψ, squared, is twice as large at point A as at point B. What does that mean?', 'A measurement is twice as likely to find the particle near A as near B.', 'The size of ψ squared is a probability density, normalised so that the total is one.', 'The phase of ψ is invisible on its own, but it shows up in interference.'],
      ['Why is a stationary state called stationary, if ψ keeps changing?', 'Its time dependence is a pure rotation of phase, so the size of ψ, and every probability, stays the same.', 'Separating space and time gives the time-independent equation.', 'Only special energies give sensible solutions: that is quantisation.'],
      ['How does the energy of level n = 3 in a box compare with level n = 1?', 'It is nine times larger: the energies grow as n squared.', 'The allowed waves fit whole half-wavelengths in the box, like a string.', 'The lowest energy is above zero, and some states have points where the particle is never found.'],
      ['Why can’t hydrogen’s electron simply fall into the nucleus?', 'Squeezing it into a smaller space raises the spread of its momentum, and so its kinetic energy, faster than its electrical energy falls. The balance sits at about 0.05 nm.', 'The uncertainty principle is a property of waves, not of clumsy measurement.', 'Balancing it against the electrical attraction gives the size and energy of hydrogen.'],
      ['What photon comes from hydrogen’s jump from level 2 to level 1?', '13.6 × (1 − ¼) = 10.2 eV, ultraviolet light at 122 nm.', 'In a finite well ψ leaks into the walls, lowering every level, and only a few states are bound.', 'Hydrogen’s levels are −13.6 eV divided by n squared, which gives its spectral lines.'],
      ['What happens to the tunnelling probability if a barrier becomes twice as wide?', 'It falls dramatically, roughly to its square, because the width sits in an exponent.', 'Inside a barrier ψ decays exponentially, instead of oscillating.', 'Tunnelling powers the Sun, alpha decay and the scanning tunnelling microscope.'],
      ['A molecular vibration has rungs 0.36 eV apart. What is the energy of its lowest state, and what photon does one step up absorb?', 'The lowest state has half a rung, 0.18 eV; each step up absorbs 0.36 eV.', 'The energy levels form a ladder of equal rungs, starting half a rung above zero.', 'Quantising the oscillations of light this way gives photons.'],
      ['Why doesn’t a thrown ball show quantum spreading?', 'Its wave packet is so narrow, and spreads so slowly, that its spreading time far exceeds the age of the universe; its average position follows Newton’s laws.', 'Ehrenfest’s theorem: averages obey Newton’s second law.', 'Wave packets do spread, but noticeably only for light things like electrons.'],
      ['Name one thing the Schrödinger equation does not describe.', 'For example: fast particles and spin, which need Dirac’s equation; particles being created and destroyed, which need quantum field theory; or why a measurement gives one definite result.']
    ]
  });
})();
/* Question-led lectures, in Feynman's manner: each lecture opens with a puzzle about something you can see, each
   chapter opens with the question it answers (and a moment to think about it), and the lecture closes by coming
   back to the puzzle with the answer. Applied after the on-ramps (ramp.js), so it works on the rebuilt chapters:
   the puzzle goes straight after the title scene, the chapter questions first in each chapter, and the answer to
   the puzzle just before the closing scene. Original text; the questions are ours, not Feynman's. */
(function () {
  const L = WL.lec, K = L.K, C = WL.C;
  const wrap = (s, w, size) => {
    const n = Math.max(12, Math.floor(w / (size * 0.45))), out = []; let line = '';
    String(s).split(/\s+/).forEach((word) => { if (line && line.length + 1 + word.length > n) { out.push(line); line = word; } else line = line ? line + ' ' + word : word; });
    if (line) out.push(line); return out;
  };
  const para = (r, s, x, y, o = {}) => {
    const size = o.size || 24, lh = o.lh || size * 1.42, w = o.w || 760; let lines = wrap(s, w, size);
    // a question should not end on a lonely word: narrow the measure until the last line holds its own
    if (o.bal && lines.length > 1) for (const f of [0.92, 0.84, 0.76]) { if (lines[lines.length - 1].length >= 0.45 * lines[0].length) break; const t = wrap(s, w * f, size); if (t.length > lines.length) break; lines = t; }
    if ((o.a == null ? 1 : o.a) > 0.003) lines.forEach((ln, i) => r.txt(ln, x, y + i * lh, { size, align: o.align || 'center', c: o.c || C.ink, a: o.a, italic: o.italic }));
    return lines.length;
  };
  const head = (r, S, str, y, c) => { const a = S.in(0.1, 0.7); r.txt(str, 480, y, { size: 18, align: 'center', c: c || C.yellow, sans: true, a }); r.line(480 - 110 * a, y + 18, 480 + 110 * a, y + 18, { c: c || C.yellow, w: 1.5, a: a * 0.6 }); };
  /* a thinking ring that fills while the viewer considers the question */
  const ring = (r, S, k, y) => { const a = S.at(k, 0.6); if (a <= 0) return; r.circle(480, y, 15, { c: C.yellow, w: 3, p: K.clamp(S.since(k) / Math.max(1, S.D[k] || 3)), a: a * 0.85 }); };

  /* the chapter's question, with a pause to think */
  function qcard(q, i) {
    return { lead: 0.25, say: [['Here is the question for this chapter. ' + q, 2.4]], draw(r, S) {
      head(r, S, `Chapter ${i}: the question`, 118);
      const n = para(r, q, 480, 214, { size: 33, w: 790, lh: 46, a: S.at(0, 0.8), bal: true });
      ring(r, S, 0, 214 + n * 46 + 34);
    } };
  }
  /* the opening puzzle: what you can see, then the question to hold on to */
  function puzzle(P) {
    const [q, see] = P;
    return { say: see.concat([['So here is the puzzle. ' + q + ' Hold on to it: by the end of this lecture you will be able to answer it.', 2]]), draw(r, S) {
      head(r, S, 'A puzzle to start', 70);
      let y = 128;
      see.forEach((s, k) => { const a = S.at(k, 0.7); const n = wrap(s, 800, 24).length; if (a > 0) para(r, s, 480, y, { size: 24, w: 800, lh: 33, a: a * (S.b > see.length - 1 ? 0.55 : 1) }); y += n * 33 + 16; });
      const k = see.length, a = S.at(k, 0.8); if (a <= 0) return;
      r.line(330, y + 4, 630, y + 4, { c: C.yellow, w: 1, a: a * 0.5 });
      const n = para(r, q, 480, y + 44, { size: 29, w: 820, lh: 40, c: C.yellow, a, bal: true });
      ring(r, S, k, y + 44 + n * 40 + 26);
    } };
  }
  /* the answer, at the end */
  function back(P) {
    const [q, , ans] = P;
    return { say: ['Now, back to the puzzle we started with. ' + q].concat(ans), draw(r, S) {
      head(r, S, 'Back to the puzzle', 70, C.green);
      const n0 = para(r, q, 480, 124, { size: 22, w: 800, lh: 30, c: C.greyB, italic: true, a: S.at(0, 0.7) });
      let y = 124 + n0 * 30 + 34;
      ans.forEach((s, k) => { const a = S.at(k + 1, 0.7); const n = wrap(s, 800, 25).length; if (a > 0) { r.dot(118, y, { r: 5, c: C.green, a }); para(r, s, 138, y, { size: 25, w: 760, lh: 34, align: 'left', a }); } y += n * 34 + 20; });
    } };
  }
  L.ask = function (id, A) {
    const s = L.all[id]; if (!s || s._asked) return;
    if (!s._ramped) throw new Error(`ask ${id}: run after the on-ramp`);
    if (A.qs.length !== s.chapters.length - 1) throw new Error(`ask ${id}: ${A.qs.length} questions for ${s.chapters.length - 1} chapters`);
    s._asked = true;
    const flat0 = [].concat(...s.chapters.map((c) => c[1]));
    const ch = s.chapters.map(([t, list]) => [t, list.slice()]);
    ch[0][1].splice(1, 0, puzzle(A.puzzle));                      // after the lecture's title scene
    A.qs.forEach((q, i) => ch[i + 1][1].unshift(qcard(q, i + 1)));
    const last = ch[ch.length - 1][1], end = last[last.length - 1];
    const closing = /Thank you for watching/.test(JSON.stringify(end.say || []));
    last.splice(closing ? last.length - 1 : last.length, 0, back(A.puzzle));
    s.chapters = ch;
    const flat1 = [].concat(...ch.map((c) => c[1]));
    if (s.thumb) { const sc = flat0[s.thumb[0]], j = flat1.indexOf(sc); if (j >= 0) s.thumb = [j, s.thumb[1]]; }
  };

  L.ask('calculus', {
    puzzle: ['A speedometer reads 60 km/h at one instant. But in an instant the car covers no distance, and speed is distance divided by time. So what is the speedometer measuring?',
      ['Speed is distance divided by time: 60 kilometres in an hour, or a kilometre a minute.', 'But the needle shows a speed at each instant, and an instant lasts no time at all. Zero distance in zero time is no answer.'],
      ['It measures the limit of distance ÷ time as the time interval shrinks to nothing: the derivative, the slope of the distance–time graph at that instant.', 'And the area under the speed–time graph gives back the distance. Slopes and areas undo each other: that is the fundamental theorem, and it is the whole of calculus in one sentence.']],
    qs: ['Why is the area of a circle πr²? What happens if we cut it into thin rings?',
      'How can anything have a speed at one instant, when an instant covers no distance?',
      'What are the slopes of x², of sin x and of eˣ, and can we see why from a picture?',
      'If you know how fast two quantities change, how fast does their product change, or a function of one of them?',
      'How do you find the biggest, the smallest or the best, without trying every possibility?',
      'How can adding up infinitely many, infinitely thin pieces give a finite answer?',
      'Why should finding an area be the exact reverse of finding a slope?',
      'Where do people usually go wrong with calculus, and what does a limit really mean?']
  });
  L.ask('shm', {
    puzzle: ['Why should the time of a swing not depend on how big the swing is?',
      ['Galileo noticed that a lamp swinging in the cathedral at Pisa took the same time for each swing, whether the swing was wide or narrow.', 'A guitar string sounds the same note whether you pluck it gently or hard. A wider swing has further to go, yet it takes no longer.'],
      ['Because the restoring force is proportional to the displacement. A swing twice as wide is pulled back twice as hard, so it moves twice as fast, and covers twice the distance in the same time.', 'That is the equation ẍ = −ω²x, whose period, 2π/ω, does not contain the amplitude at all. It holds while the swing is small enough for the force to stay proportional; a wide pendulum is a little slower.']],
    qs: ['Why does almost anything, nudged from rest, swing back and forth?',
      'What equation does a restoring force give, and what solves it?',
      'Where does the sine wave come from, and what has it to do with going round a circle?',
      'When the mass stops for an instant at the end of its swing, where has its energy gone?',
      'Can we predict, with real numbers, how long a spring or a pendulum takes to swing?',
      'Why do circuits, molecules and bridges obey the same equation as a mass on a spring?',
      'When does simple harmonic motion stop being a good description?']
  });
  L.ask('waves', {
    puzzle: ['What has crossed the valley?',
      ['Shout across a valley and the far side hears you a second or two later.', 'Yet no air travels from your mouth to the listener’s ear: the air near you only shuffles back and forth.'],
      ['A disturbance: each bit of air pushes on the next, so a pattern travels while the air stays put. Its speed is set by the medium, its springiness against its inertia.', 'And because the wave equation is linear, waves simply add. From that one fact come beats, standing waves, musical notes and the shapes of instruments.']],
    qs: ['If no air travels from my mouth to your ear, what is it that moves?',
      'What one equation do waves on a string and sound in air both obey, and what sets their speed?',
      'How fast do waves go on a guitar string, and in air? Can we predict it?',
      'Newton worked out the speed of sound and got it about 15 per cent too low. What did he miss?',
      'What happens when two waves pass through each other?',
      'Why do two nearly equal notes throb, and why does a passing siren drop in pitch?',
      'Why does a string fixed at both ends play only certain notes?',
      'How can a vibrating string be used to measure the speed of its own waves?',
      'Why does a pipe closed at one end play a lower note than an open one, and only odd harmonics?',
      'Why does sound fade with distance, and why do we measure loudness in decibels?',
      'What happens to a wave at the end of a string, and where does the simple model fail?']
  });
  L.ask('gauss', {
    puzzle: ['Inside a hollow charged metal sphere there is no electric force at all. Why should all those pushes cancel exactly?',
      ['Charge spread evenly over a hollow sphere surrounds you on every side.', 'Charges on the near wall push harder, but there are fewer of them in any direction; those on the far wall push more weakly, but there are more of them.'],
      ['Gauss’s law: the field coming out of any closed surface measures the charge inside it. Inside the shell there is no charge, and the sphere’s symmetry then forces the field to be zero everywhere inside.', 'The cancellation is exact only if the force falls as exactly 1/r², and experiments built on this very idea confirm it to about one part in 10¹⁶.']],
    qs: ['How can a picture made of lines describe a force that acts across empty space?',
      'How do you measure how much field passes through a surface?',
      'Why should the field coming out of any closed surface depend only on the charge inside it?',
      'When is Gauss’s law true, but no use at all for finding a field?',
      'Why does a charged sphere act, from outside, as if all its charge were at its centre?',
      'Why does the field of a long charged wire fall as 1/r, not 1/r²?',
      'Why is the field near a large charged sheet the same at every distance from it?',
      'How does the field give the voltage, and why does the same law work for gravity?',
      'Why is the field inside a metal zero, and why does its charge sit on the surface?',
      'Can the law be applied at a single point, instead of over a whole surface?',
      'How do we know the force falls as exactly 1/r²?']
  });
  L.ask('faraday', {
    puzzle: ['Why does only a change make a current?',
      ['Push a magnet into a coil and a meter jumps. Hold it still, however strong the magnet, and the meter reads zero.', 'Pull it out and the meter jumps the other way.'],
      ['Because the voltage is set by the rate of change of the magnetic flux through the coil, ε = −dΦ/dt. A steady field, however strong, has no rate of change.', 'Underneath, a changing magnetic field makes an electric field that curls round in loops, and that is what pushes the charges round the coil.']],
    qs: ['Ørsted found that a current makes a magnetic field. Can a magnet make a current?',
      'How do we count how much magnetic field threads a loop?',
      'What exactly makes the voltage, and which way does the current flow?',
      'Why does a wire moving through a steady field get a voltage across it?',
      'How do you read the voltage off a graph of flux against time?',
      'How does a spinning coil make the alternating current in your sockets?',
      'Why is electricity sent across the country at 400 000 volts?',
      'How do induction hobs and wireless chargers work with no wires touching?',
      'Why does a coil fight changes in its own current?',
      'If nothing moves, what pushes the charges round a loop when the field inside it changes?',
      'What does Faraday’s law not say, and where do people go wrong?']
  });
  L.ask('relativity', {
    puzzle: ['How can the same flash of light have the same speed for both of them?',
      ['A torch on a train moving at half the speed of light sends a flash forwards. Someone on the train measures the flash moving at the speed of light.', 'Someone on the platform measures the very same flash, and also gets the speed of light, not one and a half times it.'],
      ['Only if the two observers disagree about time and distance: moving clocks run slow, moving lengths shrink, and whether two events happen at the same time depends on who is asking.', 'The Lorentz transformation is the one rule for converting between observers that keeps the speed of light the same for all of them, and every result in this lecture follows from it.']],
    qs: ['If the speed of light is the same for everyone, however they move, what has to give?',
      'Why must a moving clock run slow?',
      'How do muons made high in the atmosphere live long enough to reach the ground?',
      'Can two events be simultaneous for one observer and not for another?',
      'Can a ten-metre pole fit inside an eight-metre barn?',
      'What rule converts one observer’s times and positions into another’s?',
      'How can a single picture show what every observer sees?',
      'If a rocket at 0.6c fires a probe forwards at 0.6c, why is the probe not doing 1.2c?',
      'Why should mass be a form of energy?',
      'Why would satellite navigation drift by kilometres a day without relativity?']
  });
  L.ask('schrodinger', {
    puzzle: ['What stops the atom collapsing?',
      ['By classical physics a hydrogen atom should not exist. An electron going round a proton is an accelerating charge, so it should radiate light, lose energy and spiral into the proton.', 'The calculation gives about a hundred-billionth of a second. Yet atoms last for ever.'],
      ['The electron is a wave. Squeezing it into a smaller space shortens its wavelength and raises its kinetic energy, so there is a lowest-energy state with a definite size, and nothing below it to fall into.', 'The Schrödinger equation turns that idea into numbers: the ground state of hydrogen, about 0.053 nm in radius and 13.6 eV deep.']],
    qs: ['Why do electrons sent one at a time through two slits build up an interference pattern?',
      'What equation could a matter wave obey, and how could anyone guess it?',
      'What is the wave function a wave of?',
      'Why do atoms have definite energy levels that do not change with time?',
      'Why can a trapped particle have only certain energies?',
      'Why does the electron not spiral into the nucleus?',
      'What changes when the walls of the box are not infinitely high?',
      'How can a particle get through a barrier it does not have the energy to climb?',
      'Why does a quantum oscillator have evenly spaced levels, and never sit completely still?',
      'Why does a cricket ball not show wave behaviour?',
      'What does the Schrödinger equation leave out?']
  });
  L.ask('fourier', {
    puzzle: ['Can adding smooth waves ever make a sharp corner?',
      ['A square wave jumps abruptly between two levels. A sine wave is perfectly smooth, with no corners anywhere.', 'Fourier claimed that every shape, the square wave included, is a sum of sine waves.'],
      ['Yes, but only with infinitely many: the odd harmonics, with amplitudes 4/(nπ). Every finite sum is smooth; only the limit has the corner.', 'The price is a small overshoot beside each jump, about 9 per cent of the jump, that never shrinks however many terms you add: the Gibbs phenomenon.']],
    qs: ['Why did Fourier claim that any shape at all is a sum of sine waves?',
      'What shapes can you build by adding sine waves of different frequencies?',
      'Given a shape, how do you find how much of each sine wave it contains?',
      'What are the recipes for a square wave and a sawtooth?',
      'Why is it simpler to add spinning circles than sines and cosines?',
      'How does your ear, or a computer, pick the notes out of a chord?',
      'What happens when the shape does not repeat at all?',
      'Why can a signal not be both short in time and pure in pitch?',
      'Where is Fourier analysis used, and when does it go wrong?']
  });
})();
