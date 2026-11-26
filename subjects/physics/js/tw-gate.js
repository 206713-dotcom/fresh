/* Twistor — the start screen. There are no accounts: progress is kept in this browser (localStorage), so the start
   screen is only a way in. It shows once per visit (sessionStorage), with the twistor drawing itself; Enter flies
   through the core circle into the site. The header button with the linked rings brings it back. */
(function () {
  const WL = (window.WL = window.WL || {}), $ = (s) => document.querySelector(s);
  const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  let sim = null, ready = false;
  function startSim() {
    if (sim || !WL.twistor) return;
    const c = $('#tw-canvas'); if (!c) return;
    try { sim = WL.twistor.start(c, { intro: !REDUCED }); } catch (e) { sim = null; }
  }
  function stopSim() { if (sim) { sim.stop(); sim = null; } }
  function hide() {
    const g = $('#gate'); if (g) { g.hidden = true; g.classList.remove('leaving', 'gone'); }
    document.body.classList.remove('locked'); stopSim();
    /* the first page was drawn before the tour script loaded, so offer the first-visit tour from here */
    setTimeout(() => { if (WL.tour) WL.tour.maybe(document.body.dataset.page === 'topic' ? 'topic' : 'home'); }, 60);
  }
  function enter() {
    const g = $('#gate'), b = $('#gate-enter-btn'); if (!g || g.hidden || g.classList.contains('leaving')) return;
    if (b) b.disabled = true;
    ss.set('tw-intro', '1');
    if (WL.music && WL.music.entrance) { try { WL.music.entrance(sim && !REDUCED ? 2.4 : 0.5); } catch (e) {} }
    if (!sim || REDUCED) { hide(); return; }
    g.classList.add('leaving');
    sim.outro(() => {
      document.body.classList.remove('locked'); window.scrollTo(0, 0);
      g.classList.add('gone');
      setTimeout(hide, 1100);
    });
  }
  function show() {
    const g = $('#gate'); if (!g || !g.hidden) return;
    const old = $('#tw-canvas'); if (old) old.replaceWith(old.cloneNode(false));   // a fresh canvas, so the picture draws itself again
    g.classList.remove('leaving', 'gone'); g.hidden = false; document.body.classList.add('locked');
    const b = $('#gate-enter-btn'); if (b) { b.disabled = false; setTimeout(() => b.focus(), 60); }
    startSim();
  }
  function setReady() {
    if (ready) return; ready = true;
    const b = $('#gate-enter-btn'), msg = $('#gate-msg'), load = $('#gate-load');
    if (load) load.classList.add('done');
    if (msg) msg.hidden = true;
    if (b) { b.disabled = false; b.hidden = false; if (!$('#gate').hidden) setTimeout(() => b.focus(), 60); }
  }
  function boot() {
    const g = $('#gate'); if (!g) return;
    if (ss.get('tw-intro')) { hide(); setReady(); return; }      // already came in during this visit
    startSim();
    const b = $('#gate-enter-btn'); if (b) { b._w = 1; b.addEventListener('click', enter); }
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' && ready && !e.target.closest('summary, button, a')) enter(); });
    if (document.readyState === 'complete') setReady(); else addEventListener('load', setReady);
    setTimeout(setReady, 15000);                                  // never trap anyone behind a slow download
  }
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#gate-btn')) { const b = $('#gate-enter-btn'); if (b && !b._w) { b._w = 1; b.addEventListener('click', enter); } show(); } });
  WL.gate = { enter, show, hide, get detail() { return sim ? sim.detail : null; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
