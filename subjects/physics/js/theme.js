/* Twistor — light / dark theme switch. Light (paper) is the default; the choice is kept in this browser only. */
(function () {
  const KEY = 'wl-theme', root = document.documentElement;
  let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  const def = window.WL_THEME_DEFAULT === 'dark' ? 'dark' : 'light';   // an edition can start dark (Twistor does)
  if ((saved || def) !== 'dark') root.dataset.theme = 'light';
  function sync(btn) {
    const light = root.dataset.theme === 'light';
    btn.setAttribute('aria-pressed', String(light));
    btn.title = light ? 'Switch to the dark theme' : 'Switch to the light theme';
    btn.setAttribute('aria-label', btn.title);
  }
  function wire() {
    const btn = document.getElementById('theme-btn'); if (!btn) return;
    sync(btn);
    btn.addEventListener('click', () => {
      const light = root.dataset.theme !== 'light';
      if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
      try { localStorage.setItem(KEY, light ? 'light' : 'dark'); } catch (e) {}
      sync(btn); window.dispatchEvent(new Event('wl-theme'));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
