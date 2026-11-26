/* Twistor — smooth movement between pages. A page change cross-fades the old page out and lifts the new one in
   (the View Transitions API, where the browser has it; elsewhere the page just appears). The header stays still.
   With reduced motion nothing moves. */
(function () {
  const WL = (window.WL = window.WL || {}), root = document.documentElement;
  const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  WL.transition = function (go) {
    if (reduced || typeof document.startViewTransition !== 'function' || document.hidden || root.classList.contains('ta-open') || document.body.classList.contains('locked')) { go(); return; }
    root.classList.add('tw-vt');
    try {
      const vt = document.startViewTransition(() => { go(); });
      /* a transition cut short by the next one still runs its page change; its promises reject, quietly */
      vt.ready.catch(() => {}); vt.updateCallbackDone.catch(() => {});
      vt.finished.catch(() => {}).then(() => root.classList.remove('tw-vt'));
    } catch (e) { root.classList.remove('tw-vt'); go(); }
  };
  /* the header gains a soft shadow once the page has scrolled */
  let raf = 0;
  addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; root.classList.toggle('tw-scrolled', scrollY > 8); }); }, { passive: true });
})();

/* The header is one row above 1100px and two below, and its links grow with the Twistor look, so its real height
   varies. Sticky bars (a topic's tabs, the test builder's options) sit at top: var(--hdr-h); keep that number equal
   to the header's real height below 1100px. Above it the shared layout sets the row height from --hdr-h itself,
   so the property is left alone there (measuring it would feed back into what is measured). */
(function () {
  if (!window.matchMedia) return;
  const mq = matchMedia('(max-width: 1100px)'), root = document.documentElement;
  let top = null, last = '';
  const set = () => {
    if (!top) return;
    const v = mq.matches ? Math.round(top.getBoundingClientRect().height) + 'px' : '';
    if (v === last) return; last = v;
    if (v) root.style.setProperty('--hdr-h', v); else root.style.removeProperty('--hdr-h');
  };
  const init = () => {
    top = document.querySelector('header.top') || document.querySelector('.top'); if (!top) return;
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(top); else addEventListener('resize', set);
    if (mq.addEventListener) mq.addEventListener('change', set); else if (mq.addListener) mq.addListener(set);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
