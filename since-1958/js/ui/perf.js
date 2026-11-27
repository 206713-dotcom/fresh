// A small frame meter, for tuning speed on a real computer. Press ` (the key left of 1) to show or hide it.
// It is off by default and costs nothing while hidden. Whatever is drawing the screen reports each frame:
// the main view, a featured animation or a film.
let on = false, el = null;
const acc = { t: 0, n: 0, worst: 0, js: 0, draw: 0 };
const toggles = new Map();
// freezes: every stretch of more than 50 ms in which the page could not draw (building a model, loading a map, ...)
const spikes = []; let doing = ''; const slowParts = [], sec = { t: 0, parts: null };
// time on the graphics card itself, where the browser allows measuring it (EXT_disjoint_timer_query_webgl2)
const gq = { ext: undefined, gl: null, pending: [], ms: 0, n: 0, shown: -1 };
// Where the browser can say what a slow frame was spent on (long-animation-frame), each freeze is split into our
// script (and which function), style and layout, and the rest (painting). Otherwise only its length is known.
const loaf = typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('long-animation-frame');
const name = (x) => (x.sourceFunctionName || x.invoker || '?').replace(/^.*\//, '').slice(0, 24) + (x.sourceURL ? '@' + x.sourceURL.split('/').pop().replace('.js', '') + ':' + (x.sourceCharPosition ?? '') : '');
try {
  if (loaf) new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (e.duration < 90) continue;
    const end = e.startTime + e.duration, lay = e.styleAndLayoutStart ? end - e.styleAndLayoutStart : 0, js = (e.scripts || []).reduce((a, x) => a + x.duration, 0);
    const top = (e.scripts || []).slice().sort((a, b) => b.duration - a.duration)[0];
    spikes.push(`${Math.round(e.duration)}=js ${Math.round(js)}${top ? `(${name(top)} ${Math.round(top.duration)})` : ''}+lay ${Math.round(lay)}${doing ? ' ' + doing : ''}`); if (spikes.length > 5) spikes.shift(); } }).observe({ type: 'long-animation-frame', buffered: false });
  else new PerformanceObserver((l) => { for (const e of l.getEntries()) { spikes.push(`${Math.round(e.duration)}${doing ? ' ' + doing : ''}`); if (spikes.length > 8) spikes.shift(); } }).observe({ entryTypes: ['longtask'] });
} catch (e) { /* not in this browser */ }          // key -> { name, on, fn }: switches for measuring what costs what (only while the meter shows)
export const perf = {
  get on() { return on; },
  toggle() {
    on = !on;
    if (!el) { el = document.createElement('div'); el.id = 'perfHud'; document.body.appendChild(el); }
    el.hidden = !on; el.textContent = on ? 'measuring…' : '';
  },
  /** dt: seconds since the last frame; r: the renderer that drew it (its info counts calls and triangles); who: a short name */
  frame(dt, r, who = '') {
    if (!on) return;
    acc.t += dt; acc.n++; acc.worst = Math.max(acc.worst, dt);
    if (acc.t < 0.5) return;
    const fps = acc.n / acc.t, i = r && r.info && r.info.render, off = [...toggles.values()].filter((x) => !x.on).map((x) => x.name);
    el.textContent = `${who} · ${fps.toFixed(0)} fps · ${(1000 * acc.t / acc.n).toFixed(1)} ms (worst ${(acc.worst * 1000).toFixed(0)}) · cpu ${(acc.js / acc.n).toFixed(1)} + ${(acc.draw / acc.n).toFixed(1)} ms · gpu ${gq.ext ? (gq.n ? (gq.ms / gq.n).toFixed(1) + ' ms' : '…') : 'n/a'} · pixel ratio ${r ? r.getPixelRatio().toFixed(2) : '-'}${i ? ` · ${i.calls} draws · ${(i.triangles / 1000).toFixed(0)}k tri` : ''}${off.length ? ` · OFF: ${off.join(', ')}` : ''}${slowParts.length ? `\nslow frames (ms): ${slowParts.join(' | ')}` : ''}${spikes.length ? `\nfreezes (ms): ${spikes.join('\n')}` : ''}`;
    acc.t = 0; acc.n = 0; acc.worst = 0; acc.js = 0; acc.draw = 0; gq.ms = 0; gq.n = 0;
  },
  /** time spent this frame in our own code (js) and in handing the picture to the graphics card (draw), in ms */
  cpu(js, draw) { if (on) { acc.js += js; acc.draw += draw; } },
  /** wrap one renderer.render(): the graphics card's own time for it is read back a few frames later */
  gpuBegin(r) {
    if (!on) return;
    const gl = r.getContext();
    if (gq.gl !== gl) { gq.gl = gl; gq.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') || null; gq.pending = []; }
    if (!gq.ext) return;
    for (let i = gq.pending.length - 1; i >= 0; i--) { const q = gq.pending[i]; if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) { if (!gl.getParameter(gq.ext.GPU_DISJOINT_EXT)) { gq.ms += gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6; gq.n++; } gl.deleteQuery(q); gq.pending.splice(i, 1); } }
    if (gq.pending.length > 6) return;
    const q = gl.createQuery(); gl.beginQuery(gq.ext.TIME_ELAPSED_EXT, q); gq.cur = q;
  },
  gpuEnd(r) { if (!on || !gq.ext || !gq.cur) return; const gl = r.getContext(); gl.endQuery(gq.ext.TIME_ELAPSED_EXT); gq.pending.push(gq.cur); gq.cur = null; },
  /** split a frame into named parts: the slowest part of every slow frame is listed */
  secStart(t) { if (on) { sec.t = t; sec.parts = []; } },
  sec(name) { if (!on || !sec.parts) return; const t = performance.now(); sec.parts.push([name, t - sec.t]); sec.t = t; if (name === 'render') { const tot = sec.parts.reduce((a, x) => a + x[1], 0); if (tot > 60) { const top = sec.parts.slice().sort((x, y) => y[1] - x[1]).slice(0, 2).map(([k, v]) => `${k} ${Math.round(v)}`).join(', '); slowParts.push(`${Math.round(tot)}: ${top}`); if (slowParts.length > 5) slowParts.shift(); } } },
  /** what is going on now (named in the list of freezes) */
  doing(what) { doing = what; },
  /** a switch for measuring: while the meter shows, pressing `key` turns the thing off and on */
  toggle1(key, name, fn) { toggles.set(key, { name, on: true, fn }); },
};
window.addEventListener('keydown', (e) => {
  if (e.target && e.target.closest && e.target.closest('input,textarea')) return;
  if (e.key === '`') { perf.toggle(); return; }
  const t = on && toggles.get(e.key); if (t) { t.on = !t.on; t.fn(t.on); e.stopImmediatePropagation(); }
}, true);

/** Keeps a picture smooth by trading a few pixels for frames: when frames are slow for two seconds running, the
 *  pixel ratio steps down (never below `floor`); when there is plenty of headroom it steps back up to the full ratio. */
export class AdaptiveRatio {
  constructor() { this.k = 1; this.t = 0; this.n = 0; this.slow = 0; this.fast = 0; this.hold = 0; }
  /** call once a frame; returns true when the ratio scale changed (resize the renderer then) */
  tick(dt) {
    if (document.hidden || dt <= 0) return false;
    if (this.hold > 0) { this.hold -= dt; return false; }               // after a change, let it settle before judging again
    this.t += dt; this.n++;
    if (this.t < 1) return false;
    const fps = this.n / this.t; this.t = 0; this.n = 0;
    this.slow = fps < 47 ? this.slow + 1 : 0;
    this.fast = fps > 58 ? this.fast + 1 : 0;
    if (this.slow >= 2 && this.k > 0.56) { this.k = Math.max(0.55, this.k * 0.86); this.slow = 0; this.hold = 1.2; return true; }
    if (this.fast >= 4 && this.k < 1) { this.k = Math.min(1, this.k * 1.08); this.fast = 0; this.hold = 1.2; return true; }
    return false;
  }
  /** the pixel ratio to use, given the full one; never below one real pixel per CSS pixel (or the full ratio, if that is lower) */
  ratio(full) { return Math.max(Math.min(1, full), full * this.k); }
}
