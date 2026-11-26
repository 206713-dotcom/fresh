/* Quilio: a Periodic Table you can open beside any question.
   A tab appears on the right whenever a question is on screen. On a wide screen the table docks beside the page,
   so the question stays in view; on a narrow one it slides up from the bottom. */
(function () {
  'use strict';
  if (!window.PT) return;
  const Q = '.quiz .q, #hmQ .hm-q-text, .lt-q, .ol-part, .ol-problem, .tr-check, .tr-rstem, .tr-qtext, .tr-spq';
  const WIDE = 1100, html = document.documentElement;
  const tab = document.createElement('button'); tab.type = 'button'; tab.className = 'qpt-tab'; tab.setAttribute('aria-expanded', 'false'); tab.setAttribute('aria-controls', 'qptPanel');
  tab.innerHTML = '<span class="qpt-tile" aria-hidden="true"><i>26</i><b>Fe</b></span><span class="qpt-lbl">Periodic table</span>';
  const panel = document.createElement('aside'); panel.className = 'qpt'; panel.id = 'qptPanel'; panel.hidden = true; panel.setAttribute('aria-label', 'Periodic Table');
  panel.innerHTML = `<div class="qpt-head"><div><b>Periodic Table</b><small>Click an element for its details. The question stays where it is.</small></div><button type="button" class="qpt-x" aria-label="Close the Periodic Table">×</button></div>
    <div class="qpt-body"><div class="qpt-pt"></div><form class="qpt-mr" autocomplete="off"><label for="qptMr">Work out Mᵣ</label><div><input id="qptMr" type="text" spellcheck="false" placeholder="e.g. CaCO3, Mg(OH)2, CuSO4.5H2O"><output></output></div></form></div>`;
  document.body.append(tab, panel);
  const host = panel.querySelector('.qpt-pt'), mrIn = panel.querySelector('#qptMr'), mrOut = panel.querySelector('output'); let built = false, open = false;
  const seen = new WeakSet(), onScreen = new Set();
  const io = window.IntersectionObserver ? new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) onScreen.add(e.target); else onScreen.delete(e.target); }); show(); }, { rootMargin: '-8% 0px -8% 0px' }) : null;
  function show() { onScreen.forEach(el => { if (!el.isConnected) onScreen.delete(el); }); const on = open || onScreen.size > 0; tab.classList.toggle('is-in', on && !html.classList.contains('intro')); }
  let t = 0; function scan() { clearTimeout(t); t = setTimeout(() => { document.querySelectorAll(Q).forEach(el => { if (seen.has(el)) return; seen.add(el); if (io) io.observe(el); else onScreen.add(el); }); show(); }, 120); }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true }); scan();
  function fit() {
    if (!built) return; const wide = innerWidth >= WIDE, inner = panel.clientWidth - 36, cell = Math.max(22, Math.min(46, Math.floor((inner - 18 - 18 * 3) / 18)));
    host.style.setProperty('--cell', cell + 'px'); html.classList.toggle('qpt-dock', open && wide); html.classList.toggle('qpt-sheet', open && !wide);
  }
  // the question nearest the middle of the screen, so it can be kept in view when the page narrows
  function anchor() { let best = null, bd = 1e9; onScreen.forEach(el => { if (!el.isConnected) return; const r = el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - innerHeight / 2); if (d < bd) { bd = d; best = el; } }); return best ? { el: best, top: best.getBoundingClientRect().top } : null; }
  function keep(a) { if (!a || !a.el.isConnected) return; const now = a.el.getBoundingClientRect().top, sheet = html.classList.contains('qpt-sheet'), want = sheet && a.top > innerHeight * .4 - 60 ? 76 : a.top, d = now - want; if (Math.abs(d) > 2) window.scrollBy({ top: d, behavior: 'instant' }); }
  function setOpen(v) {
    const a = anchor(); open = v; panel.hidden = !v; tab.setAttribute('aria-expanded', String(v)); tab.classList.toggle('is-open', v);
    if (v && !built) { PT.mount(host, {}); built = true; }
    requestAnimationFrame(() => { panel.classList.toggle('in', v); fit(); window.dispatchEvent(new Event('resize')); requestAnimationFrame(() => keep(a)); });
    if (!v) { html.classList.remove('qpt-dock', 'qpt-sheet'); tab.focus({ preventScroll: true }); } else panel.querySelector('.qpt-x').focus({ preventScroll: true });
    show();
  }
  tab.addEventListener('click', () => setOpen(!open));
  panel.querySelector('.qpt-x').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
  addEventListener('resize', () => { if (open) fit(); });
  addEventListener('hashchange', () => setTimeout(scan, 200));
  function mr() {
    const v = mrIn.value.trim(); if (!v) { mrOut.textContent = ''; return; }
    const r = PT.mr(v); mrOut.innerHTML = r ? `<b>${r.mr}</b><span>${Object.entries(r.atoms).map(([e, n]) => `${n} × ${e} (${PT.BY[e].ar})`).join(' + ')}</span>` : '<span>Check the formula: capital letter first for each element, as in NaCl.</span>';
  }
  mrIn.addEventListener('input', mr); panel.querySelector('form').addEventListener('submit', e => { e.preventDefault(); mr(); });
})();
