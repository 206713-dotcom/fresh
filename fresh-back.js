// "Back to Fresh": one button, top-left, on every site inside Fresh.
// It lives in its own shadow root, so no site's styles can change it and it changes nothing on the site.
// It never covers the site's own header: it finds the header bar along the top and sits just under it
// (or beside a left sidebar), then slides up into the corner and folds to the logo as the page scrolls.
// Add to a page with:  <script src="(path to the Fresh root)/fresh-back.js" defer></script>
(() => {
  const me = document.currentScript;
  if (!me || window.__freshBack) return;
  window.__freshBack = true;
  const home = new URL('./', me.src).href;
  let host = null, link = null;

  // Where to stand: under a header bar that spans the top, or to the right of a sidebar.
  function probe(x, wide) {
    const W = innerWidth, H = innerHeight;
    let bar = null, side = null, small = null;
    for (const el of document.elementsFromPoint(x, 26)) {
      for (let e = el; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
        const r = e.getBoundingClientRect();
        if (r.top > 4 + (e === el ? 40 : 0)) continue;
        if (r.height <= 170 && r.width >= wide * 0.5) bar = { el: e, r };              // the widest short strip along the top
        else if (r.width <= 360 && r.height >= H * 0.6 && r.left <= x) side = { el: e, r };   // a sidebar on the left
        else if (r.width < W * 0.5 && r.height < 200 && r.bottom < 140) small = small && small.r.bottom > r.bottom ? small : { el: e, r };   // a lone button in the corner
      }
      if (bar || side) break;
    }
    return { bar, side, small };
  }
  function measure() {
    if (host) host.style.display = 'none';
    let { bar, side, small } = probe(30, innerWidth), left = 12;
    // a sidebar: look for the top bar of the main area beside it
    if (!bar && side) { left = side.r.right + 12; ({ bar, small } = probe(side.r.right + 24, innerWidth - side.r.right)); }
    if (host) host.style.display = '';
    const fixed = (el) => { const p = getComputedStyle(el).position; return p === 'fixed' || p === 'sticky'; };
    let out = { top: 0, sticky: true, left };
    if (bar) out = { top: bar.r.bottom + window.scrollY * !fixed(bar.el), sticky: fixed(bar.el), left: bar.r.left > 4 ? bar.r.left + 12 : left };
    else if (small) out = { top: small.r.bottom + window.scrollY * !fixed(small.el), sticky: fixed(small.el), left };
    out.room = room(out);
    // Something of the site's own right where the button would go (a back link, a small home chip):
    // step down past it to the first clear spot, but not far. With no clear spot close by (phones,
    // where the page has no side margin), the button stays just under the header, tucked against the
    // edge, and scrolls away with the page instead of floating over the text.
    const first = out;
    for (let k = 0; k < 7 && out.room < 52; k++) { out = { ...out, top: (out.top || 2) + 8 }; out.room = room(out); }
    if (out.room < 52) out = { ...first, left: first.left === 12 ? 6 : first.left, crowded: true };
    return out;
  }
  // How much empty margin there is to the right of the button's spot before the site's own content starts.
  // Full-width backgrounds (starting at the window's left edge) do not count as content.
  function room(o) {
    const y0 = (o.top ? o.top - window.scrollY + 10 : 12);
    if (host) host.style.display = 'none';
    let edge = 400;
    for (const y of [y0 + 4, y0 + 23, y0 + 42]) {
      for (let x = o.left; x < o.left + 170 && x < edge; x += 4) {
        const hit = document.elementsFromPoint(x, y).find((e) => e !== document.body && e !== document.documentElement && e.getBoundingClientRect().left > 4 + (o.left > 12 ? o.left - 12 : 0));
        if (hit) { edge = x; break; }
      }
    }
    if (host) host.style.display = '';
    return edge - o.left;
  }
  let spot = { top: 0, sticky: true, left: 12 }, queued = false;
  function place() {
    queued = false;
    if (!link) return;
    if (spot.crowded && innerWidth <= 600) {
      // Phones: there is no empty margin anywhere along the top, so the button waits in the bottom-left corner instead.
      link.style.position = '';
      link.style.top = 'auto';
      link.style.bottom = 'calc(14px + env(safe-area-inset-bottom, 0px))';
      link.style.left = '12px';
      link.classList.add('mini');
      return;
    }
    link.style.bottom = '';
    if (spot.crowded) {
      link.style.position = 'absolute';
      link.style.top = (spot.top ? spot.top + 8 : 10) + 'px';
      link.style.left = spot.left + 'px';
      link.classList.add('mini');
      return;
    }
    link.style.position = '';
    const y = spot.sticky ? spot.top : Math.max(0, spot.top - window.scrollY);
    link.style.top = `calc(${(y ? y + 10 : 12)}px + env(safe-area-inset-top, 0px))`;
    link.style.left = spot.left + 'px';
    // folded to the logo once it has slid away from under the header
    // Only the logo when the label would run into the site's own content, or once the button has slid away from under the header.
    link.classList.toggle('mini', spot.room < 148 || (spot.top > 0 && (spot.sticky ? window.scrollY > 40 : y < 2)));
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(place); } };
  const relayout = () => { spot = measure(); place(); };

  const mount = () => {
    if (document.getElementById('fresh-back')) return;
    host = document.createElement('div');
    host.id = 'fresh-back';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
<style>
  :host { all: initial; }
  a {
    position: fixed; top: 12px; left: 12px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 16px 0 8px; box-sizing: border-box;
    border-radius: 14px; border: 1.5px solid #e4eeb2; background: #203e32; color: #f6efd8; text-decoration: none;
    font: 800 16px/1 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.02em;
    box-shadow: 0 8px 24px rgba(11, 28, 22, 0.35); transition: transform .2s, background .2s, box-shadow .2s, padding .25s, gap .25s;
    -webkit-tap-highlight-color: transparent;
  }
  a:hover { background: #2a5242; transform: translateY(-1px); box-shadow: 0 12px 28px rgba(11, 28, 22, 0.45); }
  a:focus-visible { outline: 3px solid #f6bb83; outline-offset: 3px; }
  .label, .arrow { transition: opacity .2s; }
  a.mini { padding: 0 6px; gap: 0; }
  a.mini .label, a.mini .arrow { display: none; }
  svg { display: block; flex: none; border-radius: 8px; }
  .arrow { color: #e4eeb2; font-size: 18px; margin-right: -2px; }
  @media (max-width: 600px) {
    a { height: 42px; padding: 0 10px 0 6px; gap: 6px; border-radius: 12px; }
    .label { display: none; }
  }
  @media print { a { display: none; } }
</style>
<a href="${home}" style="top:12px;left:12px" title="Back to the Fresh homepage" aria-label="Back to the Fresh homepage">
  <span class="arrow" aria-hidden="true">←</span>
  <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#132c27"/><path fill="#f6efd8" d="M16 18h31l-6 8H25v8h13l-6 8h-7v8h-9z"/><path fill="#e4eeb2" d="M37 35h12l-8 13H29z"/><path fill="#f6bb83" d="M46 15h7l-4 6h-7z"/></svg>
  <span class="label">Fresh</span>
</a>`;
    document.body.appendChild(host);
    link = root.querySelector('a');
    relayout();
    // pages that build their header after loading: look again a few times
    for (const t of [400, 1200, 3000, 6000]) setTimeout(relayout, t);
    addEventListener('resize', relayout);
    addEventListener('hashchange', () => setTimeout(relayout, 200));
    addEventListener('scroll', queue, { passive: true });
  };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
