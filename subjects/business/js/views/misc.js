/* EcBiz misc views — plain browser JavaScript, no framework or build step.
   Ports the remaining smaller study tools:
   review, sections, chapter-sheets, archive, study-space, achievements,
   avatar, themes and flashcards. ES5-compatible; every view renders only
   into the main element it is given. */
(function () {
  "use strict";
  if (!window.EC) return;

  var EC = window.EC;
  var h = EC.esc;

  /* ================================================================= */
  /* Shared helpers                                                     */
  /* ================================================================= */

  function isArray(v) { return Object.prototype.toString.call(v) === "[object Array]"; }
  function has(obj, key) { return !!obj && Object.prototype.hasOwnProperty.call(obj, key); }
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function clampInt(v, lo, hi, fallback) {
    var n = parseInt(v, 10);
    if (!isFinite(n)) return fallback;
    return Math.max(lo, Math.min(hi, n));
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function fmtTime(seconds) {
    var s = Math.max(0, Math.floor(num(seconds)));
    return pad2(Math.floor(s / 60)) + ":" + pad2(s % 60);
  }
  function readStoreArray(key) {
    var v = EC.store.get(key, []);
    return isArray(v) ? v : [];
  }
  function readStoreObject(key) {
    var v = EC.store.get(key, {});
    return (v && typeof v === "object" && !isArray(v)) ? v : {};
  }
  function rootFor(main, className) {
    var root = document.createElement("div");
    root.className = className || "";
    main.innerHTML = "";
    main.appendChild(root);
    return root;
  }
  function actionNode(root, event) {
    var node = event.target;
    while (node && node !== root && node.getAttribute) {
      if (node.getAttribute("data-act")) return node;
      node = node.parentNode;
    }
    return null;
  }
  function mdBold(text) {
    /* Escape first, then turn **bold** into <strong> — never inject raw HTML. */
    return h(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  function dateLabel(ts) {
    var d = new Date(num(ts));
    if (isNaN(d.getTime())) return "";
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  /* Lucide-style inline icons (same paths as the original compiled bundle).
     Kept dependency-free so every view can share one tiny renderer. */
  var ICON_PATHS = {
    play: '<polygon points="6 3 20 12 6 21 6 3"></polygon>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"></path><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path>',
    bag: '<path d="M6 2h12l2 7H4l2-7z"></path><path d="M4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"></path>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
    coins: '<circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    sliders: '<path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><line x1="1" x2="7" y1="14" y2="14"></line><line x1="9" x2="15" y1="8" y2="8"></line><line x1="17" x2="23" y1="16" y2="16"></line>',
    music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
    rain: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path>',
    trees: '<path d="M12 22v-6"></path><path d="m8 14 4-8 4 8"></path><path d="m6 18 6-8 6 8"></path>',
    checkCircle: '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    external: '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>',
    laptop: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M2 21h20"></path>',
    minimize: '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" x2="21" y1="10" y2="3"></line><line x1="3" x2="10" y1="21" y2="14"></line>',
    maximize: '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line>',
    grip: '<circle cx="9" cy="5" r="1" fill="currentColor"></circle><circle cx="9" cy="12" r="1" fill="currentColor"></circle><circle cx="9" cy="19" r="1" fill="currentColor"></circle><circle cx="15" cy="5" r="1" fill="currentColor"></circle><circle cx="15" cy="12" r="1" fill="currentColor"></circle><circle cx="15" cy="19" r="1" fill="currentColor"></circle>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    ghost: '<path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path>',
    trophy: '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"></path><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"></path><path d="M18 9h1.5a1 1 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"></path><path d="M6 9H4.5a1 1 0 0 1 0-5H6"></path>',
    clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    paintbrush: '<path d="m14.622 17.897-10.68-2.913"></path><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"></path><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"></path>',
    sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
    palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle>',
    scissors: '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" x2="8.12" y1="4" y2="15.88"></line><line x1="14.47" x2="20" y1="14.48" y2="20"></line><line x1="8.12" x2="12" y1="8.12" y2="12"></line>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>',
    wand: '<path d="m15 4 5 5"></path><path d="M3 21v-4l12-12 4 4L7 21H3z"></path><path d="m18 2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"></path>'
  };
  function ic(name, size, cls) {
    var body = ICON_PATHS[name];
    if (!body) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (size || 16) + '" height="' + (size || 16) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-' + name + (cls ? " " + cls : "") +
      '" aria-hidden="true">' + body + '</svg>';
  }

  /* Zero-dependency confetti (canvas-confetti compatible options). */
  function confettiBurst(opts) {
    opts = opts || {};
    try {
      var count = opts.particleCount || 70;
      var spread = (opts.spread || 60) * Math.PI / 180;
      var origin = opts.origin || { y: 0.6 };
      var canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
      var dpr = window.devicePixelRatio || 1, w = window.innerWidth, hh = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(hh * dpr));
      document.body.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      if (!ctx) { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); return; }
      ctx.scale(dpr, dpr);
      var colors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#fde047", "#38bdf8"];
      var ox = w / 2, oy = hh * (origin.y == null ? 0.6 : origin.y), parts = [], i;
      for (i = 0; i < count; i++) {
        var angle = (Math.random() - 0.5) * spread * 2 - Math.PI / 2;
        var speed = 6 + Math.random() * 9;
        parts.push({
          x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          w: 5 + Math.random() * 6, h: 8 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
          life: 100 + Math.random() * 60, age: 0
        });
      }
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        ctx.clearRect(0, 0, w, hh);
        var alive = false, j, p;
        for (j = 0; j < parts.length; j++) {
          p = parts[j];
          if (p.age > p.life) continue;
          alive = true; p.age++; p.vy += 0.28; p.vx *= 0.99;
          p.x += p.vx; p.y += p.vy; p.rot += p.vr;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
        if (alive && ts - start < 4000) requestAnimationFrame(frame);
        else if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
      requestAnimationFrame(frame);
    } catch (e) {}
  }

  /* Presentation class strings copied from the original React components.
     style.css already contains these compiled utilities and static classes. */
  var CLS = {
    page: "study-page",
    pageHeading: "study-page-heading",
    title: "study-title",
    desc: "study-description",
    eyebrowRed: "text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171] mb-1",
    eyebrowBlue: "text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]",
    hero: "study-hero",
    heroContent: "study-hero-content",
    heroKicker: "study-hero-kicker",
    heroActions: "study-hero-actions",
    heroImage: "study-hero-image",
    studio: "study-studio",
    panelPad: "study-panel-padding",
    kicker: "study-panel-kicker",
    prompt: "study-prompt",
    modeBar: "study-mode-bar mt-4",
    modeOptions: "study-mode-options max-sm:!grid-cols-2",
    modeButton: "study-mode-button",
    action: "study-action",
    primary: "btn-primary",
    secondary: "study-secondary-action",
    actionSm: "study-action btn-primary !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap",
    actionSmSec: "study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap",
    removeLink: "text-xs font-semibold text-[#97532b] dark:text-[#f6bb83] hover:underline px-2 py-1 whitespace-nowrap cursor-pointer",
    softCard: "rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5",
    practiceCard: "rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs leading-relaxed text-[var(--surface-muted)]",
    centerCard: "rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center",
    meta: "font-mono text-[11px] font-semibold text-[var(--surface-muted)] tabular-nums",
    metaPlain: "font-mono text-[11px] text-[var(--surface-muted)]",
    markScheme: "text-xs text-[var(--surface-accent)]",
    noteSage: "rounded-xl border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] p-4 text-xs",
    noteRose: "rounded-xl border border-[var(--sheet-rose-line)] bg-[var(--sheet-rose)] p-4 text-xs",
    noteNotice: "mt-3 rounded-xl border border-[var(--surface-accent)] bg-[var(--sheet-sage)] p-3 text-xs font-semibold text-[var(--surface-text)]",
    group: "space-y-3",
    groupLoose: "space-y-5",
    flexRow: "flex flex-wrap items-center justify-between gap-2",
    optRow: "flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm leading-relaxed",
    optBadge: "w-6 h-6 rounded-md border flex items-center justify-center font-mono text-[11px] font-bold shrink-0",
    optionBtn: "w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3",
    optionBadge: "w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5",
    backLink: "text-xs font-semibold text-[var(--surface-muted)] hover:underline flex items-center gap-1 cursor-pointer",
    sectionsBtn: "px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer",
    sectionsBtnLight: "border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300",
    sectionsBtnDark: "border border-[#0F2042]/30 dark:border-[#38BDF8]/40 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#0F2042] dark:text-[#38BDF8]",
    sectionsBtnPrimary: "px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] transition-colors shadow-sm cursor-pointer",
    secBox: "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 lg:p-7 shadow-sm transition-colors",
    secPills: "flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[#E7E5E4] dark:border-neutral-800",
    secPillLabel: "text-[11px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mr-1",
    secPill: "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
    secPillOn: "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] shadow-sm",
    secPillOff: "bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-400 hover:border-[#0F2042] dark:hover:border-[#38BDF8]",
    secHead: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E7E5E4] dark:border-neutral-800",
    secCategory: "business-category text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#d4d9cf] uppercase",
    secTopicsCount: "text-xs text-[var(--muted,#4b5c54)] dark:text-neutral-400",
    secTitle: "font-academic-serif text-xl sm:text-2xl font-bold text-[var(--green,#203e32)] dark:text-white",
    secStrap: "text-xs sm:text-sm text-[#57534E] dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed",
    secOptsGrid: "shrink-0 w-full sm:w-auto sm:max-w-[340px]",
    secOpts: "grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2",
    secOpt: "inline-flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold transition-all shadow-2xs cursor-pointer text-left w-full min-w-0",
    secOptTitle: "block font-bold text-[11px] sm:text-xs leading-tight truncate",
    secOptSub: "block text-[9.5px] font-normal opacity-75 truncate",
    secOptCompare: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200",
    secOptSummary: "btn-primary",
    secOptBlank: "bg-[#FAF9F6] dark:bg-black border border-dashed border-[#D6D3D1] dark:border-neutral-700 text-[#78716C] dark:text-[#64748B] italic",
    secKeyHead: "flex items-center justify-between mb-3",
    secKeyLabel: "text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400",
    secKeyHint: "text-[11px] text-[#78716C] dark:text-neutral-400",
    secTopics: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5",
    secTopic: "p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer",
    secTopicOff: "bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-700 hover:border-[#0F2042]/50 dark:hover:border-[#38BDF8]/50",
    topicBadge: "px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#0F2042] dark:text-[#38BDF8]",
    topicTitle: "font-academic-serif text-sm font-bold mb-2 leading-snug text-[#1C1917] dark:text-white",
    topicTitleRevised: "font-academic-serif text-sm font-bold mb-2 leading-snug transition-colors text-emerald-900 dark:text-emerald-200 line-through opacity-80",
    secTopicRevised: "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60",
    reviseBtn: "px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all flex items-center gap-1.5 border cursor-pointer",
    reviseBtnOn: "bg-emerald-600 text-white border-emerald-600 shadow-xs",
    reviseBtnOff: "bg-white dark:bg-neutral-800 border-[#D6D3D1] dark:border-neutral-700 text-[#78716C] dark:text-neutral-400 hover:border-emerald-500",
    concepts: "text-xs text-[#57534E] dark:text-neutral-300 space-y-1 pl-3.5 list-disc",
    topicFoot: "pt-2.5 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-[11px] text-[#78716C] dark:text-neutral-400",
    practiceLink: "text-[#0F2042] dark:text-[#38BDF8] font-semibold hover:underline",
    sheetRoot: "one-page-sheet-root mx-auto w-full max-w-7xl px-3 py-6 transition-colors sm:px-4 sm:py-8",
    sheetChrome: "sheet-chrome",
    sheetBar: "rounded-xl border border-[var(--line)] bg-[var(--white)] p-3 shadow-xs dark:bg-neutral-900 sm:px-4 sm:py-3",
    sheetBrand: "font-academic-serif text-xl font-bold leading-none tracking-tight text-[var(--green)] dark:text-white",
    sheetBrandSub: "font-mono text-[9px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]",
    sheetBrandCourse: "font-mono text-[9px] text-[var(--muted)] dark:text-neutral-400",
    sheetSmallBtn: "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors",
    sheetPrint: "bg-[var(--green)] text-white hover:opacity-90 dark:bg-[#e4eeb2] dark:text-[#203e32]",
    sheetSearchWrap: "relative flex-1 sm:w-56",
    sheetSearch: "w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] py-1.5 pl-8 pr-8 text-[10.5px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#97532b] focus:outline-none dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400",
    sheetNav: "rounded-xl border border-[var(--line)] bg-[var(--white)] p-2 shadow-xs dark:bg-neutral-900",
    sheetNavLbl: "font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] dark:text-neutral-400",
    sheetNavGrid: "grid grid-cols-2 gap-1.5 sm:grid-cols-3",
    sheetNavBtn: "group relative overflow-hidden rounded-lg border px-2.5 py-1.5 text-left transition-all cursor-pointer",
    sheetNavOn: "border-[var(--green)] bg-[var(--green)] text-white shadow-sm",
    sheetNavOff: "border-[var(--line)] bg-[var(--white)] text-[var(--ink)] hover:border-[var(--sheet-blush-line)] hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800",
    sheetNavSec: "font-mono text-[8px] font-bold uppercase tracking-[0.08em]",
    sheetNavCount: "font-mono text-[7.5px] font-bold",
    sheetNavTitle: "mt-0.5 line-clamp-1 block text-[10px] font-semibold leading-tight",
    article: "chapter-summary-page screen-sheet-document mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--white)] shadow-xl dark:bg-[#111915]",
    sheetMasthead: "relative shrink-0 border-b-2 border-[var(--green)] bg-[var(--sheet-surface)] px-5 pb-3 pt-5 sm:px-7 dark:bg-neutral-900",
    sheetMastheadBar: "absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[var(--green)] via-[var(--sheet-blush)] to-[var(--sheet-sage)]",
    sheetMastheadTop: "flex flex-col justify-between gap-3 sm:flex-row sm:items-end",
    sheetEyebrow: "flex flex-wrap items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em]",
    sheetEyebrowTag: "rounded bg-[var(--sheet-blush)] px-1.5 py-0.5 text-[var(--sheet-ink-soft)]",
    sheetH1: "mt-1 font-academic-serif text-xl font-bold leading-tight tracking-tight text-[var(--green)] dark:text-white sm:text-[26px]",
    sheetStrap: "mt-0.5 max-w-2xl text-[10.5px] leading-snug text-[var(--muted)] dark:text-neutral-300",
    sheetStats: "grid shrink-0 grid-cols-3 gap-1.5 sm:flex",
    sheetStat: "min-w-[50px] rounded-md border px-2 py-1 text-center",
    sheetStatNum: "font-academic-serif text-base font-bold leading-none tabular-nums text-[var(--green)] dark:text-white",
    sheetStatLbl: "mt-0.5 font-mono text-[6.5px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]",
    sheetKeyBar: "mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dashed border-[var(--line)] pt-2 font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)] dark:text-neutral-400",
    sheetBody: "chapter-summary-body bg-[var(--white)] px-4 py-4 dark:bg-[#111915] sm:px-6 sm:py-5 lg:px-8",
    sheetFooter: "flex shrink-0 flex-row items-center justify-between gap-2 border-t border-[var(--green)]/30 bg-[var(--sheet-surface)] px-5 py-2.5 font-mono text-[7.5px] text-[var(--muted)] dark:bg-neutral-900 dark:text-neutral-400 sm:px-7",
    sheetBlock: "border-b border-dashed border-[var(--line)] pb-3 last:border-b-0 last:pb-0",
    sheetBlockHead: "relative flex flex-wrap items-center justify-between gap-2 overflow-hidden rounded-lg border border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)] px-2.5 py-1.5",
    sheetBlockCode: "rounded bg-[var(--green)] px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wide text-[#e4eeb2]",
    sheetBlockTitle: "font-academic-serif text-[14px] font-bold leading-tight text-[var(--green)] dark:text-white sm:text-[15.5px]",
    sheetBlockEyebrow: "hidden text-[8px] font-mono font-semibold uppercase tracking-[0.1em] text-[var(--sheet-ink-soft)] sm:inline",
    sheetBlockCount: "shrink-0 font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]",
    sheetVisual: "min-w-0 rounded-lg border border-[var(--line)] bg-[var(--sheet-surface)] p-2 sm:p-2.5",
    sheetVisualCap: "mb-1.5 flex items-center gap-1.5 border-b border-dashed border-[var(--line)] pb-1",
    sheetVisualTitle: "text-[8px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--muted)] dark:text-neutral-400",
    sheetPoint: "flex gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[var(--sheet-surface)]",
    sheetTakeaway: "mt-2 flex items-stretch gap-2 rounded-lg border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] py-1.5 pl-2.5 pr-2.5",
    sheetEmpty: "rounded-2xl border border-dashed border-[var(--line)] bg-[var(--sheet-surface)] px-5 py-10 text-center dark:bg-neutral-900",
    sheetEmptyText: "mt-2 text-xs font-semibold text-[var(--ink)] dark:text-white",
    sheetClear: "mt-2 text-[10px] font-semibold text-[#97532b] hover:underline cursor-pointer",
    sheetFilterResult: "mb-3 flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--sheet-surface)] px-3 py-1.5 text-[9.5px] text-[var(--muted)] dark:bg-neutral-900 dark:text-neutral-400",
    archiveGrid: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12",
    archiveCard: "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-[#0F2042] dark:hover:border-[#38BDF8] transition-colors",
    archiveCat: "uppercase font-semibold text-[#8B1E1E] dark:text-[#F87171]",
    archiveBadge: "bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 px-2 py-0.5 rounded text-[10px] text-[#0F2042] dark:text-[#38BDF8]",
    archiveTitle: "font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white mb-3",
    archiveDesc: "text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed mb-6",
    archiveLinks: "pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex flex-wrap gap-2 text-xs",
    archiveLinkPrimary: "bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] px-4 py-2 rounded-lg font-semibold transition-colors",
    archiveLinkGhost: "bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-neutral-200 px-4 py-2 rounded-lg font-semibold transition-colors",
    archiveStrip: "p-6 bg-[#FAF9F6] dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl text-xs text-[#57534E] dark:text-neutral-400 space-y-3",
    archiveStripTitle: "font-academic-serif text-base font-bold text-[#0F2042] dark:text-white",
    archiveStripLinks: "flex flex-wrap gap-4 text-xs font-semibold text-[#0F2042] dark:text-[#38BDF8] pt-1",
    arcLink: "hover:underline",
    achHeader: "px-6 py-4 border-b border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 sticky top-0 z-20",
    achIconBox: "w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl font-bold shadow-xs",
    achTitle: "text-base sm:text-lg font-bold font-academic-serif",
    achTitleSub: "text-xs text-[#78716C] dark:text-neutral-400",
    achCoins: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold font-mono",
    achFilterBar: "px-6 py-3 border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black flex flex-wrap items-center justify-between gap-3",
    achFilters: "flex items-center gap-1.5 overflow-x-auto scrollbar-none",
    achFilter: "px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer",
    achFilterOn: "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs",
    achFilterOff: "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-[#57534E] dark:text-neutral-300 hover:bg-neutral-100",
    achClaimAll: "px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer",
    achList: "flex-1 overflow-y-auto p-6 space-y-3",
    achCard: "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
    achCardOff: "bg-white dark:bg-neutral-900 border-[#E7E5E4] dark:border-neutral-800 shadow-xs",
    achCardClaimed: "bg-white/60 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 opacity-75",
    achCardReady: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-sm",
    achIcon: "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-800",
    achRow: "flex items-start gap-3.5 flex-1",
    achReward: "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    achDesc: "text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed",
    achBar: "flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden",
    achBarFill: "h-full transition-all duration-500 rounded-full bg-indigo-500",
    achBarClaimed: "bg-neutral-400 dark:bg-neutral-600",
    achBarReady: "bg-emerald-500",
    achCount: "font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400",
    achClaimed: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-semibold",
    achClaimBtn: "px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer animate-pulse",
    achLocked: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 text-xs font-medium border border-neutral-200/50 dark:border-neutral-700/50",
    achEmpty: "text-center py-12 text-[#78716C] dark:text-neutral-400 text-sm",
    achToast: "mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between",
    achFooter: "px-6 py-3.5 border-t border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400",
    achDone: "px-4 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold transition cursor-pointer",
    avHeader: "px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-800/40",
    avIcon: "p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xl font-bold",
    avTitle: "text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white",
    avTag: "text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-bold uppercase",
    avSub: "text-xs text-neutral-500 dark:text-neutral-400",
    avCoins: "px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs",
    avRandom: "px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer",
    avBody: "grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden",
    avPreviewCol: "md:col-span-4 bg-gradient-to-b from-neutral-100 to-neutral-200/80 dark:from-neutral-950 dark:to-neutral-900 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800",
    avPreviewLbl: "text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-1",
    avPreviewName: "text-sm font-bold text-neutral-800 dark:text-neutral-200",
    avStage: "relative w-48 h-64 flex items-center justify-center my-3 drop-shadow-xl",
    avEquipped: "w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 text-xs space-y-1 shadow-xs",
    avEquippedRow: "flex items-center justify-between text-[11px]",
    avEquippedKey: "text-neutral-500",
    avEquippedVal: "font-semibold text-neutral-800 dark:text-neutral-200",
    avWardrobe: "md:col-span-8 p-5 sm:p-6 flex flex-col overflow-hidden bg-white dark:bg-neutral-900",
    avCats: "flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none",
    avCat: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer",
    avCatOn: "bg-indigo-600 text-white shadow-sm",
    avCatOff: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200",
    avGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3",
    avGridSkin: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
    avCard: "p-3.5 rounded-2xl border transition-all flex flex-col justify-between",
    avCardOn: "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm",
    avCardOff: "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40",
    avSwatch: "w-9 h-9 rounded-full shadow-inner border border-black/10 shrink-0",
    avItemName: "font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5",
    avItemDesc: "text-[11px] text-neutral-500 dark:text-neutral-400",
    avCardFoot: "mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between",
    avEquippedLbl: "text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1",
    avEquipBtn: "px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer",
    avBuyBtn: "px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white shadow-xs",
    avBuyOff: "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed",
    avCost: "text-[11px] font-mono text-neutral-500",
    avCatalog: "flex-1 overflow-y-auto pr-1",
    themeCoins: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold font-mono",
    themeShop: "rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950 shadow-xl p-2 z-50",
    themeShopHead: "flex items-center justify-between px-2 py-1.5",
    themeShopLbl: "text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400",
    themeList: "space-y-1 max-h-80 overflow-y-auto overscroll-contain",
    themeItem: "w-full text-left px-2 py-2 rounded-xl border flex items-center gap-2.5 transition-colors cursor-pointer",
    themeItemOn: "border-[#203e32]/40 dark:border-emerald-700 bg-[#edf2e7] dark:bg-emerald-950/50",
    themeItemOff: "border-transparent hover:bg-white dark:hover:bg-neutral-900",
    themeSwatches: "flex -space-x-1.5 shrink-0",
    themeSwatch: "h-4 w-4 rounded-full border border-black/10 dark:border-white/20",
    themeName: "flex items-center gap-1 text-xs font-bold text-[#1C1917] dark:text-white",
    themeBlurb: "block text-[10px] leading-snug text-[#78716C] dark:text-neutral-400",
    themePrice: "shrink-0 text-[10px] font-mono font-bold",
    themeNote: "px-2 pt-1.5 pb-1 text-[10px] leading-snug text-neutral-500 dark:text-neutral-400",
    fcWrap: "max-w-xl mx-auto py-6",
    fcTop: "flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-neutral-400",
    fcFlip: "bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-[#38BDF8] rounded-2xl p-8 min-h-[320px] flex flex-col justify-between shadow-sm cursor-pointer hover:border-[#1E3A8A] dark:hover:border-[#60A5FA] transition-all select-none",
    fcFlipTop: "flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-4",
    fcRef: "font-mono text-[#0F2042] dark:text-[#38BDF8] uppercase font-bold",
    fcSide: "text-[11px] bg-[#FAF9F6] dark:bg-black px-2 py-0.5 rounded border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300",
    fcTerm: "my-8 text-center",
    fcTermH: "font-academic-serif text-3xl sm:text-4xl font-bold text-[#0F2042] dark:text-white mb-3",
    fcUnit: "text-xs text-[#78716C] dark:text-neutral-400",
    fcDef: "space-y-4",
    fcDefH: "font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#38BDF8]",
    fcDefText: "text-base text-[#1C1917] dark:text-neutral-200 leading-relaxed",
    fcFormula: "p-3 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-700 rounded-lg text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]",
    fcTip: "p-3 bg-[#FAF9F6] dark:bg-black rounded-lg border border-[#E7E5E4] dark:border-neutral-800 text-xs text-[#57534E] dark:text-neutral-400",
    fcTipStrong: "text-[#8B1E1E] dark:text-[#F87171] block mb-0.5",
    fcBottom: "pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400",
    fcMaster: "px-3 py-1 rounded text-xs font-semibold cursor-pointer",
    fcMasterOn: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300",
    fcMasterOff: "bg-[#F5F5F4] dark:bg-neutral-900 text-[#44403C] dark:text-neutral-200 hover:bg-[#E7E5E4] dark:hover:bg-[#334155]",
    fcNav: "flex items-center justify-between gap-4",
    fcPrev: "flex-1 py-2.5 px-4 bg-white dark:bg-neutral-900 border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors text-[#1C1917] dark:text-neutral-200",
    fcFlipBtn: "py-2.5 px-6 bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors text-[#1C1917] dark:text-neutral-200",
    fcNext: "flex-1 py-2.5 px-4 bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors",
    ss: {
      bg: "fixed inset-0 z-[100] w-full h-full min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans select-none",
      glow: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-40",
      card: "bg-slate-900/60 border-indigo-500/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(79,70,229,0.15)]",
      header: "relative z-20 max-w-6xl mx-auto pt-6 px-4 sm:px-6",
      headerRow: "flex items-center justify-between p-3.5 sm:p-4 rounded-3xl border",
      brandIcon: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-black/30",
      brandName: "font-bold tracking-tight text-base sm:text-lg",
      brandTag: "text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/80",
      brandSub: "text-xs text-white/50 hidden sm:block",
      badge: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-semibold text-xs sm:text-sm",
      coins: "bg-amber-500/10 border-amber-500/25 text-amber-300",
      streak: "bg-orange-500/10 border-orange-500/25 text-orange-300",
      ghostBtn: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer",
      shrinkBtn: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition active:scale-95 cursor-pointer",
      main: "relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]",
      toast: "fixed top-24 z-50 animate-bounce px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/20 text-white text-xs sm:text-sm shadow-2xl backdrop-blur-xl flex items-center gap-2",
      pod: "w-full max-w-xl mx-auto flex flex-col items-center",
      modeTabs: "flex items-center p-1.5 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl mb-4 shadow-inner",
      modeBtn: "px-5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
      modeOn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
      modeOff: "text-white/60 hover:text-white",
      presets: "w-full mb-6 p-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md flex flex-col gap-2.5",
      presetHead: "flex items-center justify-between text-xs text-white/70",
      presetChips: "flex flex-wrap items-center gap-1.5",
      presetChip: "px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition active:scale-95 cursor-pointer border",
      presetOn: "bg-indigo-600 border-indigo-400 text-white shadow-sm",
      presetOff: "bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white",
      customRow: "pt-2 border-t border-white/10 flex items-center justify-between gap-2",
      customInput: "w-16 px-2 py-1 text-xs font-mono font-bold text-center bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-400",
      customBtn: "px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition active:scale-95 cursor-pointer",
      timerCard: "w-full p-8 sm:p-12 rounded-[36px] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500",
      status: "flex items-center gap-2 mb-4",
      statusDot: "w-2.5 h-2.5 rounded-full",
      statusText: "text-xs uppercase tracking-widest font-bold text-white/60",
      digits: "text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter my-2 tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm",
      quickRow: "flex items-center gap-2 my-2",
      quickBtn: "p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer",
      primaryBtn: "p-2 rounded-xl font-bold transition transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
      toggles: "flex items-center gap-2 mt-4",
      toggleBtn: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium transition active:scale-95 cursor-pointer",
      volume: "flex items-center justify-center gap-2 mt-4 text-xs text-white/60",
      footer: "text-[10px] text-white/40 mt-6 text-center",
      widget: "fixed z-[90] select-none transition-all duration-300 flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/15 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/40",
      widgetGhost: "opacity-30 hover:opacity-95",
      grip: "flex items-center gap-1 cursor-grab active:cursor-grabbing text-white/40",
      digitsMini: "font-mono text-xs font-black tabular-nums tracking-wider text-white/90",
      miniBtn: "w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
    }
  };

  /* Keep as a small hub so the legacy "misc" URL still resolves to something useful. */
  EC.register("misc", {
    title: "Study tools",
    render: function (main) {
      var root = rootFor(main, CLS.page);
      root.innerHTML =
        '<div class="' + CLS.pageHeading + '"><div>' +
          '<p class="' + CLS.eyebrowRed + '">Cambridge IGCSE · 0264</p>' +
          '<h1 class="' + CLS.title + '">Study tools</h1>' +
          '<p class="' + CLS.desc + '">Small utilities for reviewing mistakes, revising chapters and staying focused.</p>' +
        '</div></div>' +
        '<div class="' + CLS.archiveGrid + '">' +
          toolCard("review", "Mistake Review", "Revisit questions you got wrong and practise them again.") +
          toolCard("sections", "Sections & Chapters", "All six syllabus sections with topics and links to practice.") +
          toolCard("chapter-sheets", "Chapter Summaries", "One-page visual revision sheets for every section.") +
          toolCard("archive", "Document Archive", "Official specimen papers, mark schemes and revision PDFs.") +
          toolCard("study-space", "Study Space", "Pomodoro focus timer, ambient sound and ghost mode.") +
          toolCard("achievements", "Achievements", "Fourteen milestones with coin rewards.") +
          toolCard("avatar", "Avatar Studio", "Customise your scholar avatar.") +
          toolCard("themes", "Themes", "Daylight, Midnight and coin-unlocked themes.") +
          toolCard("flashcards", "Flashcards", "Flip through the full 0264 glossary deck.") +
        '</div>';
    }
  });
  function toolCard(name, title, desc) {
    return '<a class="' + CLS.archiveCard + '" href="?open=' + name + '" style="text-decoration:none">' +
      '<h2 class="' + CLS.archiveTitle + '">' + h(title) + '</h2>' +
      '<p class="' + CLS.archiveDesc + '">' + h(desc) + '</p>' +
      '<div class="' + CLS.archiveLinks + '"><span class="' + CLS.archiveLinkPrimary + '">Open tool →</span></div></a>';
  }

  /* ================================================================= */
  /* review — Mistake Review                                            */
  /* ================================================================= */

  var REVIEW_KEY = "mcq_review";
  var WRONG_KEY = "mcq_wrong";
  var MASTERY_DAYS_REQUIRED = 2;

  EC.register("review", {
    title: "Mistake Review",
    render: function (main) {
      var root = rootFor(main, CLS.page);
      root.innerHTML =
        '<header class="' + CLS.hero + '">' +
          '<div class="' + CLS.heroContent + '">' +
            '<p class="' + CLS.heroKicker + '">Cambridge IGCSE Business Studies · Mistake review</p>' +
            '<h1 class="' + CLS.title + '">Mistake <span>Review</span></h1>' +
            '<p class="' + CLS.desc + '">Questions you get wrong in Boss Battle land here. Review the mark scheme answer, ' +
            'practise them again, and decide which ones deserve a place in the MCQ Wrong Only bank.</p>' +
            '<div class="' + CLS.heroActions + '">' +
              '<a class="' + CLS.action + ' ' + CLS.primary + ' whitespace-nowrap shrink-0" href="?open=boss-battle">⚔️ <span>Back to Boss Battle</span> →</a>' +
              '<a class="' + CLS.action + ' ' + CLS.secondary + ' whitespace-nowrap shrink-0" href="?open=quiz">🎯 <span>Open MCQ Drills</span></a>' +
            '</div>' +
            '<p class="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75" id="ms-review-waiting"></p>' +
          '</div>' +
          '<div class="' + CLS.heroImage + '" aria-hidden="true"></div>' +
        '</header>' +
        '<div class="' + CLS.studio + '">' +
          '<div class="' + CLS.practiceCard + '"><strong class="text-[var(--surface-text)]">How it works:</strong> practise a mistake here until you are happy ' +
            'with it, then choose <em>Move to Wrong Only</em> to drill it in the MCQ bank. A question only ' +
            'leaves Wrong Only after you answer it correctly on ' + MASTERY_DAYS_REQUIRED +
            ' different days — getting it wrong resets the count.</div>' +
          '<div id="ms-review-notice"></div>' +
          '<div class="' + CLS.modeBar + '">' +
            '<div role="group" aria-label="Review view" class="' + CLS.modeOptions + '" id="ms-review-tabs"></div>' +
          '</div>' +
          '<div class="' + CLS.panelPad + '" id="ms-review-body"></div>' +
        '</div>';
      var tabs = root.querySelector("#ms-review-tabs");
      var body = root.querySelector("#ms-review-body");
      var notice = root.querySelector("#ms-review-notice");
      var waiting = root.querySelector("#ms-review-waiting");

      var st = { entries: [], view: "list", ids: [], idx: 0, active: null,
                 selected: null, feedback: null, notice: "" };

      function loadMap() { return readStoreObject(REVIEW_KEY); }
      function saveMap(map) { EC.store.set(REVIEW_KEY, map); }
      function refresh() {
        var map = loadMap(), out = [], id;
        for (id in map) {
          if (!has(map, id)) continue;
          var entry = map[id];
          if (!entry || typeof entry !== "object") continue;
          if (!entry.id) entry.id = id;
          out.push(entry);
        }
        out.sort(function (a, b) { return num(b.missedAt) - num(a.missedAt); });
        st.entries = out;
      }
      function find(id) {
        for (var i = 0; i < st.entries.length; i++) if (st.entries[i].id === id) return st.entries[i];
        return null;
      }
      function remove(id) { var map = loadMap(); delete map[id]; saveMap(map); refresh(); }
      function bumpMiss(id) {
        var map = loadMap(), e = map[id];
        if (!e) return;
        e.missCount = num(e.missCount) + 1;
        e.missedAt = Date.now();
        saveMap(map); refresh();
        if (st.active) st.active = find(id) || st.active;
      }
      function addWrong(id) {
        if (!id) return;
        var map = readStoreObject(WRONG_KEY);
        map[id] = { id: id, correctDates: [], missedAt: Date.now() };
        EC.store.set(WRONG_KEY, map);
      }
      function moveToWrong(id) {
        if (!loadMap()[id]) return;
        remove(id);
        addWrong(id);
        st.notice = "Moved to MCQ Wrong Only. Answer it correctly on " + MASTERY_DAYS_REQUIRED +
          " different days to clear it.";
      }

      function drawNotice() {
        notice.innerHTML = st.notice ? '<div role="status" class="' + CLS.noteNotice + '">' + h(st.notice) + '</div>' : "";
      }
      function drawTabs() {
        tabs.innerHTML =
          '<button type="button" class="' + CLS.modeButton + '" aria-pressed="' + (st.view === "list" ? "true" : "false") +
            '" data-act="view-list">' +
            '<span class="text-[11px]">📋</span><span>Review list</span>' +
            '<small class="font-mono text-[10px] opacity-70 tabular-nums">' + st.entries.length + '</small></button>' +
          '<button type="button" class="' + CLS.modeButton + ' disabled:opacity-50 disabled:cursor-not-allowed" aria-pressed="' +
            (st.view === "practice" ? "true" : "false") + '" data-act="practice-all"' +
            (st.entries.length ? "" : " disabled") + '>' +
            '<span class="text-[11px]">🔄</span><span>Practise all</span>' +
            '<small class="font-mono text-[10px] opacity-70 tabular-nums">' + st.entries.length + '</small></button>';
      }

      function optionMarkup(entry, index, practice) {
        var correct = index === num(entry.correctIndex);
        var letter = correct ? "✓" : String.fromCharCode(65 + index);
        var cls, badgeCls, inner;
        if (practice) {
          cls = CLS.optionBtn;
          badgeCls = CLS.optionBadge + " bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
          if (st.feedback) {
            if (correct) {
              cls += " bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium cursor-default";
              badgeCls = CLS.optionBadge + " bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
            } else if (st.selected === index) {
              cls += " bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)] cursor-default";
              badgeCls = CLS.optionBadge + " bg-[#97532b] border-transparent text-white";
              letter = "✕";
            } else {
              cls += " opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)] cursor-default";
            }
          } else {
            cls += " bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)] cursor-pointer";
          }
          inner = '<span class="' + badgeCls + '">' + letter + '</span><span>' + h(entry.options[index]) + '</span>';
          return '<button type="button" data-act="answer" data-index="' + index + '"' +
            (st.feedback ? " disabled" : "") + ' class="' + cls + '">' + inner + '</button>';
        }
        cls = CLS.optRow;
        badgeCls = CLS.optBadge;
        if (correct) {
          cls += " border-[var(--surface-accent)] bg-[var(--sheet-sage)] text-[var(--surface-text)] font-medium";
          badgeCls += " bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
        } else {
          cls += " border-[var(--surface-line)] bg-[var(--surface)] text-[var(--surface-text)]";
          badgeCls += " bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
        }
        inner = '<span class="' + badgeCls + '">' + letter + '</span><span>' + h(entry.options[index]) + '</span>';
        return '<div class="' + cls + '">' + inner + '</div>';
      }
      function optionsHtml(entry, practice) {
        var out = [], i;
        var opts = isArray(entry.options) ? entry.options : [];
        for (i = 0; i < opts.length; i++) out.push(optionMarkup(entry, i, practice));
        return '<div class="' + (practice ? "space-y-2.5" : "space-y-1.5") + '">' + out.join("") + '</div>';
      }

      function drawList() {
        if (!st.entries.length) {
          body.innerHTML = '<div class="' + CLS.centerCard + '">' +
            '<p class="' + CLS.kicker + '">Nothing to review</p>' +
            '<h3 class="mt-1 font-[var(--font-serif)] text-xl font-semibold text-[var(--surface-text)]">Your review list is empty</h3>' +
            '<p class="mt-1.5 text-xs sm:text-sm text-[var(--surface-muted)]">Any question you answer incorrectly in Boss Battle will appear here for review and practice.</p>' +
            '<a class="' + CLS.action + ' ' + CLS.primary + ' mt-5" href="?open=boss-battle">⚔️ <span>Play Boss Battle</span></a></div>';
          return;
        }
        var html = '<div class="mb-4 flex flex-wrap items-center justify-between gap-2"><p class="text-xs text-[var(--surface-muted)]">' +
          plural(st.entries.length, "mistake") + ' banked from Boss Battle.</p><div class="flex flex-wrap gap-2">' +
          '<button type="button" class="' + CLS.actionSm + '" data-act="move-all">🎯 <span>Move all to Wrong Only</span></button>' +
          '<button type="button" class="' + CLS.actionSmSec + '" data-act="clear-all">🗑️ <span>Clear review list</span></button>' +
          '</div></div><div class="' + CLS.group + '">';
        st.entries.forEach(function (entry) {
          var meta = (entry.unit ? "Unit " + h(entry.unit) + " · " : "") + h(entry.chapter) +
            " · missed " + num(entry.missCount) + "×";
          html += '<div class="' + CLS.softCard + ' space-y-3">' +
            '<div class="' + CLS.flexRow + '"><span class="' + CLS.meta + '">' + meta + '</span>' +
              '<span class="' + CLS.metaPlain + '">' + h(dateLabel(entry.missedAt)) + '</span></div>' +
            '<h3 class="' + CLS.prompt + ' text-[var(--surface-text)]">' + h(entry.question) + '</h3>' +
            optionsHtml(entry, false) +
            '<p class="' + CLS.markScheme + '"><strong class="font-mono mr-1.5">Mark scheme:</strong>' + h(entry.explanation) + '</p>' +
            '<div class="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--surface-line)]">' +
              '<button type="button" class="' + CLS.actionSm + '" data-act="practice-one" data-id="' + h(entry.id) + '">🔄 <span>Practise this</span></button>' +
              '<button type="button" class="' + CLS.actionSmSec + '" data-act="move-one" data-id="' + h(entry.id) + '">🎯 <span>Move to Wrong Only</span></button>' +
              '<button type="button" class="' + CLS.removeLink + '" data-act="remove" data-id="' + h(entry.id) + '">Remove</button>' +
            '</div></div>';
        });
        body.innerHTML = html + '</div>';
      }

      function drawPractice() {
        var entry = st.active;
        if (!entry) {
          body.innerHTML = '<div class="' + CLS.centerCard + '">' +
            '<p class="text-sm text-[var(--surface-muted)]">This question has already been cleared from your review list.</p>' +
            '<button type="button" class="' + CLS.action + ' ' + CLS.primary + ' mt-4" data-act="next">Continue →</button></div>';
          return;
        }
        var html = '<div class="' + CLS.groupLoose + '">' +
          '<div class="' + CLS.flexRow + '"><span class="font-mono text-xs font-bold text-[var(--surface-text)] tabular-nums">Question ' +
            (st.idx + 1) + ' of ' + st.ids.length + '</span>' +
            '<button type="button" class="' + CLS.backLink + '" data-act="view-list">← Back to review list</button></div>' +
          '<div class="' + CLS.softCard + '"><p class="' + CLS.kicker + ' mb-2">' +
            (entry.unit ? "Unit " + h(entry.unit) + " · " : "") + h(entry.chapter) + '</p>' +
            '<h3 class="' + CLS.prompt + ' text-[var(--surface-text)]">' + h(entry.question) + '</h3></div>' +
          optionsHtml(entry, true);
        if (st.feedback) {
          html += '<div role="status" class="' + (st.feedback.correct ? CLS.noteSage : CLS.noteRose) + '">' +
            '<div class="flex items-center gap-2 font-semibold text-sm text-[var(--surface-text)]">' +
              '<span>' + (st.feedback.correct ? "✅" : "❌") + '</span><span>' + h(st.feedback.message) + '</span></div>' +
            '<p class="mt-2 text-[var(--surface-muted)]">' + h(entry.explanation) + '</p>' +
            '<div class="mt-4 flex flex-wrap items-center gap-2">' +
              '<button type="button" class="' + CLS.action + ' ' + CLS.primary + ' whitespace-nowrap" data-act="next">' +
                (st.idx < st.ids.length - 1 ? "Next Question" : "Finish Practice") + ' →</button>' +
              '<button type="button" class="' + CLS.action + ' ' + CLS.secondary + ' whitespace-nowrap" data-act="move-practice">🎯 <span>Move to Wrong Only</span></button>' +
            '</div></div>';
        }
        body.innerHTML = html + '</div>';
      }

      function draw() {
        if (waiting) waiting.textContent = plural(st.entries.length, "question") + " waiting for review";
        drawNotice(); drawTabs(); if (st.view === "list") drawList(); else drawPractice();
      }

      function startPractice(ids) {
        if (!ids || !ids.length) return;
        st.ids = ids.slice(); st.idx = 0; st.selected = null; st.feedback = null;
        st.notice = ""; st.active = find(st.ids[0]); st.view = "practice"; draw();
      }
      function next() {
        if (st.idx < st.ids.length - 1) {
          st.idx++; st.selected = null; st.feedback = null;
          st.active = find(st.ids[st.idx]); draw();
        } else {
          st.view = "list"; st.ids = []; st.idx = 0; st.active = null;
          st.selected = null; st.feedback = null; refresh(); draw();
        }
      }
      function answer(index) {
        if (st.feedback || !st.active) return;
        st.selected = index;
        if (index === num(st.active.correctIndex)) {
          var id = st.active.id;
          remove(id);
          st.active = find(id) || st.active;
          st.feedback = { correct: true, message: "Correct — this question has been cleared from your review list." };
        } else {
          bumpMiss(st.active.id);
          st.feedback = { correct: false, message: "Not quite. It stays in your review list so you can try again another time." };
        }
        draw();
      }

      root.addEventListener("click", function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act"), id = btn.getAttribute("data-id");
        if (act === "view-list") { st.view = "list"; st.feedback = null; st.selected = null; draw(); }
        else if (act === "practice-all") startPractice(st.entries.map(function (e) { return e.id; }));
        else if (act === "practice-one") startPractice([id]);
        else if (act === "answer") answer(parseInt(btn.getAttribute("data-index"), 10) || 0);
        else if (act === "next") next();
        else if (act === "move-one") { moveToWrong(id); draw(); }
        else if (act === "move-practice") { if (st.active) moveToWrong(st.active.id); next(); }
        else if (act === "move-all") {
          var all = st.entries.slice();
          all.forEach(function (e) { moveToWrong(e.id); });
          st.notice = "Moved " + plural(all.length, "question") + " to MCQ Wrong Only.";
          if (st.view === "practice") { st.view = "list"; st.ids = []; st.active = null; st.feedback = null; }
          draw();
        }
        else if (act === "remove") { remove(id); draw(); }
        else if (act === "clear-all") {
          if (!window.confirm("Remove every question from your review list?")) return;
          EC.store.set(REVIEW_KEY, {}); refresh(); st.notice = ""; draw();
        }
      });
      root.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.keyCode !== 13) return;
        if (event.target && event.target.getAttribute && event.target.getAttribute("data-act") === "answer") {
          answer(parseInt(event.target.getAttribute("data-index"), 10) || 0);
        }
      });

      refresh();
      draw();
    }
  });

  /* ================================================================= */
  /* sections — Sections & Chapters                                     */
  /* ================================================================= */

  /* Google Docs consolidation links from syllabus-sections.json (sections 1–5). */
  var CONSOLIDATION_DOCS = {
    "1": "https://docs.google.com/document/d/1vhY8qBmVvCjDHAq8BbR1SblXaNw8lv5hrxvEcioENOw/edit?tab=t.0",
    "2": "https://docs.google.com/document/d/1CPrZbJA-8uhA_tP45FKHjo3pWFHPYnE2q7zL--IYPT8/edit?tab=t.0",
    "3": "https://docs.google.com/document/d/1Qc3OYlT0VTAUUckaefMS7ynq3h41SvmqpdaZZBf_yWM/edit?tab=t.0",
    "4": "https://docs.google.com/document/d/141lWIHYvK53CSvJDF9SfmAjYvqRA0MKgX_-ixOUT58A/edit?tab=t.0",
    "5": "https://docs.google.com/document/d/1PdKDA-jKsDHv-ndiCXo4Ema7J-YQwkOznqjDIYWDlIs/edit?tab=t.0"
  };

  EC.register("sections", {
    title: "Sections & Chapters",
    render: function (main, params) {
      var root = rootFor(main, CLS.page);
      var initial = params && params.get("section") ? params.get("section") : "1";
      var st = { sheets: [], active: initial, mode: "focused", revised: loadRevisedTopics() };
      var body = document.createElement("div");
      root.innerHTML =
        '<div class="' + CLS.pageHeading + '"><div>' +
          '<div class="flex items-center gap-2 mb-1">' +
            '<span class="w-2 h-2 rounded-full bg-[#0F2042] dark:bg-[#38BDF8]"></span>' +
            '<span class="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">Cambridge 0264 Syllabus Directory</span>' +
          '</div>' +
          '<h1 class="' + CLS.title + '">Sections &amp; Chapters Breakdown</h1>' +
          '<p class="' + CLS.desc + '">Access official consolidation documents, core chapter concepts, and targeted practice questions.</p>' +
        '</div><div class="flex flex-wrap items-center gap-2.5">' +
          '<button type="button" class="' + CLS.sectionsBtn + ' ' + CLS.sectionsBtnLight + '" data-act="sheets">Chapter summaries</button>' +
          '<button type="button" class="' + CLS.sectionsBtn + ' ' + CLS.sectionsBtnLight + '" data-act="toggle"><span id="ms-sections-toggle-label">View All Sections (1–6)</span></button>' +
          '<a class="' + CLS.sectionsBtnPrimary + '" href="?open=practice">Practice Studio →</a>' +
        '</div></div><div id="ms-sections-body"></div>';
      root.appendChild(body);

      /* ecbiz_revised_topics — per-topic "To Revise / Revised" ticks. The
       * original component stored a JSON array under this raw localStorage
       * key; EC.store writes/reads the same JSON via the "revised_topics" key. */
      function loadRevisedTopics() {
        var v = EC.store.get("revised_topics", []);
        return isArray(v) ? v : [];
      }
      function toggleRevisedTopic(code) {
        var next = loadRevisedTopics(), i = next.indexOf(code);
        if (i >= 0) next.splice(i, 1); else next.push(code);
        EC.store.set("revised_topics", next);
        st.revised = next;
      }
      function isRevised(code) { return st.revised.indexOf(code) >= 0; }

      function sheetBy(code) {
        for (var i = 0; i < st.sheets.length; i++) if (st.sheets[i].code === code) return st.sheets[i];
        return st.sheets[0];
      }
      function sectionCard(sheet) {
        var code = h(sheet.code);
        var blocks = sheet.blocks || [];
        var pills = '<span class="' + CLS.secPillLabel + '">Sections:</span>';
        for (var i = 1; i <= 6; i++) {
          var c = String(i);
          pills += '<button type="button" class="' + CLS.secPill + ' ' +
            (c === String(sheet.code) ? CLS.secPillOn : CLS.secPillOff) +
            '" data-act="select" data-code="' + c + '"><span>Sec ' + c + '</span></button>';
        }
        var opt = function (cls, icon, title, sub, act) {
          return '<button type="button" class="' + CLS.secOpt + ' ' + cls + '" data-act="' + act +
            '" data-code="' + code + '"><span class="text-sm shrink-0">' + icon + '</span>' +
            '<div class="min-w-0 flex-1"><span class="' + CLS.secOptTitle + '">' + h(title) + '</span>' +
            '<span class="' + CLS.secOptSub + '">' + h(sub) + '</span></div></button>';
        };
        var topics = blocks.map(function (b) {
          var revised = isRevised(b.code);
          var topicCode = h(b.code);
          return '<div class="' + CLS.secTopic + ' ' + (revised ? CLS.secTopicRevised : CLS.secTopicOff) +
              '" data-act="practice" data-code="' + topicCode + '" data-section="' + code + '">' +
            '<div><div class="flex items-center justify-between gap-2 mb-2">' +
              '<span class="' + CLS.topicBadge + '">Topic ' + topicCode + '</span>' +
              '<button type="button" class="' + CLS.reviseBtn + ' ' + (revised ? CLS.reviseBtnOn : CLS.reviseBtnOff) +
                '" data-act="revise" data-code="' + topicCode + '" title="Mark as revised/unrevised" aria-label="Mark as revised/unrevised" aria-pressed="' + (revised ? "true" : "false") + '">' +
                '<span class="w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ' +
                  (revised ? "bg-white text-emerald-700" : "border border-neutral-400") + '">' + (revised ? "✓" : "") + '</span>' +
                '<span>' + (revised ? "Revised" : "To Revise") + '</span></button></div>' +
              '<h4 class="' + (revised ? CLS.topicTitleRevised : CLS.topicTitle) + '">' + h(b.title) + '</h4>' +
              '<div class="space-y-1 mb-3"><span class="text-[10px] font-mono uppercase text-[#78716C] dark:text-neutral-400 block">Core Key Concepts:</span>' +
                '<ul class="' + CLS.concepts + '"><li class="leading-snug">' + h(b.title) + '</li></ul></div></div>' +
            '<div class="' + CLS.topicFoot + '"><span class="font-mono">Syllabus Section ' + code + '</span>' +
              '<span class="' + CLS.practiceLink + '">Practice →</span></div></div>';
        }).join("");
        return '<div class="' + CLS.secBox + '">' +
          '<div class="' + CLS.secPills + '">' + pills + '</div>' +
          '<div class="' + CLS.secHead + '"><div>' +
            '<div class="flex items-center gap-2 mb-1"><span class="' + CLS.secCategory + '">Section ' + code + ' Breakdown</span>' +
              '<span class="' + CLS.secTopicsCount + '">' + blocks.length + ' Key Syllabus Topics</span></div>' +
            '<h3 class="' + CLS.secTitle + '">' + h(sheet.title) + '</h3>' +
            '<p class="' + CLS.secStrap + '">' + h(sheet.strap) + '</p></div>' +
            '<div class="' + CLS.secOptsGrid + '"><div class="' + CLS.secOpts + '">' +
              opt(CLS.secOptCompare, "⚖️", "Advantages & Disadvantages", "Section " + code + " revision", "compare") +
              opt(CLS.secOptSummary, "📋", "Chapter Summary", "Section " + code + " summary", "sheet") +
              opt("bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200",
                "📊", sectionLabel(code), "Interactive Visual", "diagram") +
              (CONSOLIDATION_DOCS[code]
                ? '<a class="' + CLS.secOpt + ' bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200" href="' + CONSOLIDATION_DOCS[code] + '" target="_blank" rel="noopener noreferrer"><span class="text-sm shrink-0">📄</span><span class="min-w-0 flex-1"><span class="' + CLS.secOptTitle + ' block">Consolidation Document</span><span class="' + CLS.secOptSub + ' block">Google Docs ↗</span></span></a>'
                : '<div class="' + CLS.secOpt + ' ' + CLS.secOptBlank + '"><span class="text-sm shrink-0">📄</span><span class="min-w-0 flex-1"><span class="' + CLS.secOptTitle + ' block">Blank for now</span><span class="' + CLS.secOptSub + ' block">No consolidation document yet</span></span></div>') +
            '</div></div></div>' +
          '<div><div class="' + CLS.secKeyHead + '"><span class="' + CLS.secKeyLabel + '">Key Topics Under Section ' + code + ':</span>' +
            '<span class="' + CLS.secKeyHint + '">Click any topic to practice questions</span></div>' +
            '<div class="' + CLS.secTopics + '">' + topics + '</div></div></div>';
      }
      function sectionLabel(code) {
        var labels = { "1": "Factors of Production & Rewards", "2": "People & Organisation Visuals",
          "3": "Marketing & Strategy Visuals", "4": "Operations & Break-Even Visuals",
          "5": "Finance & Accounts Visuals", "6": "Economy & Global Trade Visuals" };
        return labels[code] || "Section Concept Visuals";
      }
      function draw() {
        if (!st.sheets.length) return;
        if (st.mode === "all") {
          body.className = "space-y-8";
          body.innerHTML = st.sheets.map(sectionCard).join("");
          return;
        }
        body.className = "space-y-6";
        body.innerHTML = sectionCard(sheetBy(st.active));
      }
      root.addEventListener("click", function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act"), code = btn.getAttribute("data-code");
        if (act === "select") { st.active = code; draw(); }
        else if (act === "toggle") {
          st.mode = st.mode === "focused" ? "all" : "focused";
          var label = root.querySelector("#ms-sections-toggle-label");
          if (label) label.textContent = st.mode === "focused" ? "View All Sections (1–6)" : "Focus Mode";
          draw();
        }
        else if (act === "sheets") EC.navigate("chapter-sheets", { section: st.active });
        else if (act === "sheet" && code) EC.navigate("chapter-sheets", { section: code });
        else if (act === "diagram" && code) EC.openSectionDiagram(code);
        else if (act === "compare") EC.navigate("compare", { section: code || st.active });
        else if (act === "revise") {
          /* Toggle must not also trigger the topic's practice navigation. */
          if (event.stopPropagation) event.stopPropagation();
          toggleRevisedTopic(code);
          draw();
        }
        else if (act === "practice") {
          /* Resolve the clicked topic from the event: `node` was never in
           * scope here. Pass BOTH the section (unit) and the topic code (q). */
          var node = (event.target && event.target.closest)
            ? event.target.closest('[data-act="practice"]') : null;
          if (!node) node = btn;
          var topicCode = node.getAttribute("data-code");
          var sectionCode = node.getAttribute("data-section") || st.active;
          EC.navigate("practice", { unit: sectionCode, q: topicCode });
        }
      });
      return EC.load("one-page-sheets").then(function (sheets) {
        st.sheets = isArray(sheets) ? sheets : [];
        if (!st.sheets.length) { body.innerHTML = '<div class="' + CLS.sheetEmpty + '"><p class="' + CLS.sheetEmptyText + '">No syllabus sections available.</p></div>'; return; }
        var valid = false;
        for (var i = 0; i < st.sheets.length; i++) if (st.sheets[i].code === st.active) valid = true;
        if (!valid) st.active = st.sheets[0].code;
        draw();
      });
    }
  });

  /* ================================================================= */
  /* chapter-sheets — one-page chapter summaries                        */
  /* ================================================================= */

  function renderChapterSheets(main, params) {
      var root = rootFor(main, CLS.sheetRoot);
      var initial = (params && params.get("section")) || EC.store.get("chapterSheet", "1") || "1";
      var st = { sheets: [], code: initial, query: "", stageSel: {} };
      root.innerHTML =
        '<div class="' + CLS.sheetChrome + ' mb-4 space-y-2.5">' +
          '<div class="' + CLS.sheetBar + '">' +
            '<div class="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">' +
              '<div class="flex items-center justify-between gap-3"><div class="flex flex-col">' +
                '<div class="flex flex-wrap items-center gap-2">' +
                  '<span class="' + CLS.sheetBrand + '">EcBiz</span>' +
                  '<span class="' + CLS.sheetBrandSub + '">· Chapter Summary · Visual Revision Document</span>' +
                '</div>' +
                '<span class="' + CLS.sheetBrandCourse + '">Cambridge IGCSE™ Business 0264</span>' +
              '</div>' +
              '<a class="' + CLS.sheetSmallBtn + ' border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--sheet-surface)] sm:hidden" href="?open=sections">← Back</a></div>' +
              '<div class="flex w-full items-center gap-2 sm:w-auto">' +
                '<button type="button" class="' + CLS.sheetSmallBtn + ' ' + CLS.sheetPrint + '" data-act="print" title="Print this chapter summary or save it as a PDF">🖨️ <span>Print summary</span></button>' +
                '<div class="' + CLS.sheetSearchWrap + '">' +
                  '<input type="text" id="ms-sheet-search" placeholder="Search this sheet..." aria-label="Search this summary sheet" class="' + CLS.sheetSearch + '" />' +
                '</div>' +
                '<a class="hidden shrink-0 items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--white)] px-3 py-1.5 text-[10px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--sheet-surface)] sm:inline-flex" href="?open=sections">← Back to Sections</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="' + CLS.sheetNav + '">' +
            '<div class="flex items-center justify-between px-1.5 pb-1.5">' +
              '<span class="' + CLS.sheetNavLbl + '">Six visual chapter summaries</span>' +
              '<span class="hidden font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] sm:inline" id="ms-sheet-navcount"></span>' +
            '</div>' +
            '<div id="ms-sheet-tabs" class="' + CLS.sheetNavGrid + '"></div>' +
          '</div>' +
        '</div><div id="ms-sheet-body"></div>';
      var search = root.querySelector("#ms-sheet-search");
      var tabs = root.querySelector("#ms-sheet-tabs");
      var body = root.querySelector("#ms-sheet-body");
      var navCount = root.querySelector("#ms-sheet-navcount");

      function activeSheet() {
        for (var i = 0; i < st.sheets.length; i++) if (st.sheets[i].code === st.code) return st.sheets[i];
        return st.sheets[0];
      }
      var SHEET_TONES = {
        green: { bg: "var(--sheet-sage)", line: "var(--sheet-sage-line)", fg: "#4f6b3a" },
        sage: { bg: "var(--sheet-surface)", line: "var(--sheet-sage-line)", fg: "#59724a" },
        rose: { bg: "var(--sheet-rose)", line: "var(--sheet-rose-line)", fg: "#97532b" },
        sand: { bg: "var(--sheet-sand)", line: "var(--sheet-sand-line)", fg: "#8a6a33" }
      };
      function toneStyle(tone) {
        var t = SHEET_TONES[tone] || SHEET_TONES.green;
        return "background:" + t.bg + ";border:1px solid " + t.line + ";color:" + t.fg + ";";
      }
      function miniCard(tone, inner) {
        return '<div style="' + toneStyle(tone) + 'border-radius:.5rem;padding:.45rem">' + inner + '</div>';
      }
      function stageBlocks(stages, key, label) {
        if (!isArray(stages) || !stages.length) return "";
        var sel = num(st.stageSel[key]) || 0;
        if (sel >= stages.length) sel = 0;
        var out = '<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin:.45rem 0">';
        for (var i = 0; i < stages.length; i++) {
          var on = i === sel;
          out += '<button type="button" data-act="stage" data-viz="' + h(key) + '" data-stage="' + i + '" aria-pressed="' + (on ? "true" : "false") +
            '" style="' + (on
              ? "background:var(--green,#203e32);color:#e4eeb2;border:1px solid var(--green,#203e32);"
              : "background:var(--white,#fff);color:var(--muted,#64748b);border:1px solid var(--line,#d6d3d1);") +
            'border-radius:.35rem;padding:.2rem .4rem;font:700 9px/1.3 var(--font-mono,monospace);cursor:pointer">' + h(stages[i].title || "") + '</button>';
        }
        out += '</div>';
        var s = stages[sel] || {};
        out += miniCard(s.tone || "green", '<strong style="font-size:9.5px">' + h(s.title || label || "Stage") + '</strong>' +
          (s.text ? '<span style="display:block;font-size:9px;line-height:1.4;margin-top:.2rem">' + mdBold(s.text) + '</span>' : "") +
          (s.meta ? '<span style="display:block;font-size:8.5px;line-height:1.4;margin-top:.2rem;opacity:.8">' + mdBold(s.meta) + '</span>' : ""));
        return out;
      }
      function visualHtml(v, key) {
        key = key || (v && v.title) || "visual";
        var kind = v.kind || "", out = "", i, t;
        function wrap(title, body, wide) {
          return '<figure class="' + CLS.sheetVisual + (wide || v.wide ? " md:col-span-2" : "") + '">' +
            '<figcaption class="' + CLS.sheetVisualCap + '">' +
              '<span class="flex h-4 w-4 items-center justify-center rounded border border-[var(--line)] bg-[var(--white)] text-[var(--green)] text-[9px]">◆</span>' +
              '<span class="' + CLS.sheetVisualTitle + '">' + h(title || v.title || "Visual") + '</span>' +
              (kind === "chart" || kind === "chart-interactive"
                ? '<button type="button" data-act="diagram" class="ml-auto text-[8px] font-bold text-[#97532b] hover:underline cursor-pointer">Open interactive diagram ↗</button>'
                : "") +
            '</figcaption><div style="font-size:9px;line-height:1.45;color:var(--muted,#64748b)">' + body + '</div>' +
            (v.note ? '<p style="margin-top:.4rem;padding-top:.35rem;border-top:1px dashed var(--line);font-size:8.5px;line-height:1.4;color:var(--muted,#64748b)">' + mdBold(v.note) + '</p>' : '') +
          '</figure>';
        }
        if (kind === "formula" && isArray(v.tokens)) {
          var groups = [], pending = null;
          for (i = 0; i < v.tokens.length; i++) {
            t = v.tokens[i];
            if (t.kind === "operator") pending = t;
            else { groups.push({ op: pending, token: t }); pending = null; }
          }
          if (pending) groups.push({ op: pending, token: null });
          out = '<div style="display:flex;flex-wrap:wrap;gap:.3rem;align-items:stretch">';
          for (i = 0; i < groups.length; i++) {
            var g = groups[i];
            if (g.op) out += '<span style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:999px;background:var(--sheet-sand);border:1px solid var(--sheet-sand-line);color:#97532b;font:700 11px/1 var(--font-mono,monospace);align-self:center">' + h(g.op.value) + '</span>';
            if (g.token) out += miniCard(g.token.kind === "result" ? "green" : "sage",
              '<strong style="display:block;font-size:9.5px;line-height:1.25">' + h(g.token.label || "") + '</strong>' +
              '<span style="display:block;font-size:8px;line-height:1.3;opacity:.85">' + h(g.token.text || "") + '</span>');
          }
          out += '</div>';
        } else if (kind === "flow" && isArray(v.steps)) {
          out = '<div style="display:flex;flex-wrap:wrap;gap:.3rem;align-items:center">';
          for (i = 0; i < v.steps.length; i++) {
            t = v.steps[i];
            out += miniCard(t.tone || (i % 2 ? "sand" : "green"), '<strong style="font-size:9px">' + h(t.title || t.label || "") + '</strong>' +
              (t.text ? '<span style="display:block;font-size:8px;line-height:1.35">' + mdBold(t.text) + '</span>' : ""));
            if (i < v.steps.length - 1) out += '<span style="color:#97532b;font-weight:700">→</span>';
          }
          out += '</div>';
        } else if ((kind === "quad" || kind === "pills") && isArray(v.items)) {
          out = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.35rem">';
          var tones = ["sand", "green", "rose", "sage"];
          for (i = 0; i < v.items.length; i++) {
            t = v.items[i];
            out += miniCard(t.tone || tones[i % 4], '<strong style="font-size:9.5px">' + h(t.title || t.label || "") + '</strong>' +
              (t.meta ? '<span style="display:block;font:700 7.5px/1.2 var(--font-mono,monospace);text-transform:uppercase;margin-top:.15rem">' + h(t.meta) + '</span>' : "") +
              (t.text ? '<span style="display:block;font-size:8.5px;line-height:1.35;margin-top:.2rem">' + mdBold(t.text) + '</span>' : ""));
          }
          out += '</div>';
        } else if (kind === "contrast" && isArray(v.columns)) {
          out = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.4rem">';
          for (i = 0; i < v.columns.length; i++) {
            t = v.columns[i];
            var col = '<strong style="font-size:9.5px">' + h(t.title || "") + '</strong>' +
              (t.subtitle ? '<span style="display:block;font-size:8px;opacity:.8">' + h(t.subtitle) + '</span>' : "") + '<ul style="margin:.35rem 0 0;padding-left:.9rem">';
            var items = isArray(t.items) ? t.items : [];
            for (var j = 0; j < items.length; j++) col += '<li style="margin-bottom:.15rem">' + mdBold(String(items[j])) + '</li>';
            col += '</ul>' + (t.footer ? '<div style="margin-top:.3rem;padding:.25rem;border-top:1px dashed var(--line);font-size:8px">' + mdBold(t.footer) + '</div>' : "");
            out += miniCard(t.tone || "green", col);
          }
          out += '</div>';
        } else if (kind === "table" && isArray(v.rows)) {
          out = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:8.5px"><thead><tr>';
          var heads = isArray(v.headers) ? v.headers : [];
          for (i = 0; i < heads.length; i++) out += '<th style="text-align:left;padding:.25rem;border-bottom:1px solid var(--sheet-blush-line);background:var(--sheet-blush);font:700 7.5px var(--font-mono,monospace);text-transform:uppercase">' + h(heads[i]) + '</th>';
          out += '</tr></thead><tbody>';
          for (i = 0; i < v.rows.length; i++) {
            if (!isArray(v.rows[i])) continue;
            out += '<tr>';
            for (j = 0; j < v.rows[i].length; j++) out += '<td style="padding:.25rem;border-bottom:1px solid var(--line)">' + mdBold(String(v.rows[i][j])) + '</td>';
            out += '</tr>';
          }
          out += '</tbody></table></div>';
        } else if (kind === "metrics" && isArray(v.items)) {
          out = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.35rem">';
          for (i = 0; i < v.items.length; i++) {
            t = v.items[i];
            out += miniCard("sage", '<strong style="font-size:9px">' + h(t.label || "") + '</strong>' +
              (t.formula ? '<span style="display:block;font:600 9px/1.3 var(--font-mono,monospace);margin-top:.2rem">' + h(t.formula) + '</span>' : "") +
              (t.note ? '<span style="display:block;font-size:8px;line-height:1.3;margin-top:.2rem">' + h(t.note) + '</span>' : ""));
          }
          out += '</div>';
        } else if (kind === "channels" && isArray(v.channels)) {
          for (i = 0; i < v.channels.length; i++) {
            t = v.channels[i];
            out += '<div style="' + toneStyle("sage") + 'border-radius:.5rem;padding:.45rem;margin-bottom:.3rem"><strong style="font:700 8px var(--font-mono,monospace);text-transform:uppercase">' + h(t.label || "") + '</strong><div style="margin-top:.25rem">';
            var steps = isArray(t.steps) ? t.steps : [];
            for (j = 0; j < steps.length; j++) {
              out += '<span style="display:inline-block;border:1px solid var(--line);border-radius:999px;padding:.1rem .4rem;font-size:8.5px;font-weight:600;margin:.1rem">' + h(String(steps[j])) + '</span>';
              if (j < steps.length - 1) out += '<span style="color:#97532b">→</span>';
            }
            out += '</div></div>';
          }
        } else if (kind === "waterfall" && isArray(v.steps)) {
          for (i = 0; i < v.steps.length; i++) {
            t = v.steps[i];
            out += '<div style="display:flex;align-items:center;gap:.35rem;margin-bottom:.25rem">' +
              '<span style="min-width:90px;text-align:center;border:1px solid var(--line);border-radius:.3rem;padding:.2rem;font:700 8px var(--font-mono,monospace)">' + h(t.label || "") + '</span>' +
              miniCard(t.tone || "green", '<span style="font-size:9px;font-weight:600">' + mdBold(t.formula || t.text || "") + '</span>') + '</div>';
          }
        } else if (kind === "externality") {
          var costs = isArray(v.costs) ? v.costs : [], benefits = isArray(v.benefits) ? v.benefits : [];
          out = '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:.35rem;align-items:center">' +
            miniCard("rose", '<strong style="font-size:9px">⚠ External costs</strong><div style="font-size:8px;margin-top:.25rem">' + costs.map(function (c) { return h(c); }).join(" · ") + '</div>') +
            miniCard("sage", '<strong style="font-size:8.5px;text-align:center">Business activity<br/>effects on outsiders</strong>') +
            miniCard("green", '<strong style="font-size:9px">✦ External benefits</strong><div style="font-size:8px;margin-top:.25rem">' + benefits.map(function (b) { return h(b); }).join(" · ") + '</div>') + '</div>';
        } else if (kind === "chart") {
          var stages = isArray(v.stages) ? v.stages : [];
          if (stages.length) {
            out = stageBlocks(stages, key, v.chart || "Stage");
          } else if (v.chart === "orgChart") {
            out = miniCard("sage", '<strong style="font-size:9.5px">Hierarchy · chain of command · span of control</strong>' +
              '<span style="display:block;font-size:8.5px;line-height:1.4;margin-top:.2rem">Tall structures have many levels and narrow spans; flat structures have few levels and wide spans. Delayering removes levels to widen spans and speed up communication.</span>');
          } else if (v.chart === "breakEven") {
            out = miniCard("sand", '<strong style="font-size:9.5px">Break-even = fixed costs ÷ contribution per unit</strong>' +
              '<span style="display:block;font-size:8.5px;line-height:1.4;margin-top:.2rem">Contribution = price − variable cost. Margin of safety = current output − break-even output.</span>');
          } else {
            out = miniCard("green", '<strong style="font-size:9.5px">' + h(v.title || "Interactive chart") + '</strong>');
          }
        } else {
          /* Fallback: preserve every field as compact text for any new kind. */
          var bits = [];
          function push(label, text) {
            if (!text && text !== 0) return;
            bits.push('<li style="margin-bottom:.15rem">' + (label ? '<strong>' + mdBold(label) + ':</strong> ' : '') + mdBold(text) + '</li>');
          }
          if (isArray(v.tokens)) v.tokens.forEach(function (x) { push(x.label || x.value, x.text || x.value); });
          if (isArray(v.items)) v.items.forEach(function (x) { push(x.title || x.label, (x.text || x.formula || "") + (x.meta ? " — " + x.meta : "")); });
          if (isArray(v.steps)) v.steps.forEach(function (x) { push(x.title || x.label, x.text || x.formula || ""); });
          if (isArray(v.columns)) v.columns.forEach(function (x) { push(x.title, isArray(x.items) ? x.items.join(" · ") : ""); });
          if (isArray(v.rows)) v.rows.forEach(function (row) { if (isArray(row)) push(row[0], row.slice(1).join(" · ")); });
          if (v.note) push("Note", v.note);
          out = bits.length ? '<ul style="padding-left:.9rem">' + bits.join("") + '</ul>' : "";
        }
        return wrap(v.title || "Visual", out);
      }
      function blockHtml(block) {
        var points = isArray(block.points) ? block.points : [];
        var visuals = isArray(block.visuals) ? block.visuals : [];
        var list = points.map(function (p) {
          return '<li class="' + CLS.sheetPoint + '">' +
            '<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] text-[var(--green)] text-[9px]">✓</span>' +
            '<div class="min-w-0"><div class="text-[9.5px] font-bold leading-tight text-[var(--ink)]">' + mdBold(p.text || p.title) + '</div></div>' +
          '</li>';
        }).join("");
        return '<section class="' + CLS.sheetBlock + '">' +
          '<header class="' + CLS.sheetBlockHead + '">' +
            '<div class="flex min-w-0 items-center gap-2">' +
              '<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--sheet-blush-line)] bg-white/75 text-[var(--green)] text-xs">📘</span>' +
              '<div class="min-w-0"><div class="flex flex-wrap items-center gap-1.5">' +
                '<span class="' + CLS.sheetBlockCode + '">' + h(block.code || "") + '</span>' +
                '<h2 class="' + CLS.sheetBlockTitle + '">' + h(block.title) + '</h2>' +
                (block.eyebrow ? '<span class="' + CLS.sheetBlockEyebrow + '">· ' + h(block.eyebrow) + '</span>' : '') +
              '</div></div>' +
            '</div>' +
            '<div class="' + CLS.sheetBlockCount + '">' + visuals.length + ' visuals · ' + points.length + ' key ideas</div>' +
          '</header>' +
          '<div class="mt-2">' +
            '<div class="grid items-start gap-2 md:grid-cols-2">' + visuals.map(function (v, i) {
              return visualHtml(v, (block.code || st.code) + "-" + i);
            }).join("") + '</div>' +
            (list ? '<ul class="mt-2 grid gap-x-3 gap-y-0.5 sm:grid-cols-2">' + list + '</ul>' : '') +
            (block.takeaway ? '<div class="' + CLS.sheetTakeaway + '">' +
              '<span class="my-auto flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full bg-[var(--green)] text-[#e4eeb2]">💡</span>' +
              '<div class="flex min-w-0 items-center"><span class="mr-1.5 font-mono text-[7.5px] font-bold uppercase leading-none tracking-[0.12em] text-[#4f6b3a]">Exam takeaway:</span>' +
                '<span class="text-[9px] leading-snug text-[var(--ink)]">' + mdBold(block.takeaway) + '</span></div></div>' : '') +
          '</div>' +
        '</section>';
      }
      function draw() {
        if (!st.sheets.length) return;
        var sheet = activeSheet(), q = st.query.replace(/^\s+|\s+$/g, "").toLowerCase();
        var blocks = isArray(sheet.blocks) ? sheet.blocks : [];
        var visualCount = 0, i;
        for (i = 0; i < blocks.length; i++) visualCount += (isArray(blocks[i].visuals) ? blocks[i].visuals.length : 0);
        if (navCount) navCount.textContent = blocks.length + " sub-topics · " + visualCount + " diagrams";
        tabs.innerHTML = st.sheets.map(function (s) {
          var on = s.code === st.code;
          var n = isArray(s.blocks) ? s.blocks.length : 0;
          return '<button type="button" aria-pressed="' + (on ? "true" : "false") + '" class="' +
            CLS.sheetNavBtn + ' ' + (on ? CLS.sheetNavOn : CLS.sheetNavOff) +
            '" data-act="select" data-code="' + h(s.code) + '">' +
            '<div class="flex items-center justify-between gap-1.5">' +
              '<span class="' + CLS.sheetNavSec + ' ' + (on ? "text-[#e4eeb2]" : "text-[var(--sheet-ink-soft)]") + '">Section ' + h(s.code) + '</span>' +
              '<span class="' + CLS.sheetNavCount + ' ' + (on ? "text-[#e4eeb2]" : "text-[var(--muted)]") + '">' + n + '</span>' +
            '</div>' +
            '<span class="' + CLS.sheetNavTitle + ' ' + (on ? "text-white" : "") + '">' + h(s.title) + '</span>' +
          '</button>';
        }).join("");
        var filtered = blocks.filter(function (b) {
          if (!q) return true;
          return h(JSON.stringify(b)).toLowerCase().replace(/\*\*/g, "").indexOf(q) >= 0;
        });
        var idx = st.sheets.indexOf(sheet);
        var prev = idx > 0 ? st.sheets[idx - 1] : null;
        var next = idx < st.sheets.length - 1 ? st.sheets[idx + 1] : null;
        if (!filtered.length) {
          body.innerHTML = '<div class="' + CLS.sheetEmpty + '">' +
            '<p class="' + CLS.sheetEmptyText + '">No sub-topics matched “' + h(st.query) + '”.</p>' +
            '<button type="button" class="' + CLS.sheetClear + '" data-act="clear-search">Clear search filter</button></div>';
          return;
        }
        function stat(value, label, surface, border) {
          return '<div class="' + CLS.sheetStat + ' ' + surface + ' ' + border + '">' +
            '<div class="' + CLS.sheetStatNum + '">' + value + '</div>' +
            '<div class="' + CLS.sheetStatLbl + '">' + h(label) + '</div></div>';
        }
        var pagerBtn = "inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--white)] px-3 py-2 text-[10px] font-semibold text-[var(--ink)] shadow-xs transition-colors hover:bg-[var(--sheet-surface)]";
        body.innerHTML = '<article class="' + CLS.article + '">' +
          '<header class="' + CLS.sheetMasthead + '"><div class="' + CLS.sheetMastheadBar + '"></div>' +
            '<div class="' + CLS.sheetMastheadTop + '"><div class="min-w-0">' +
              '<div class="' + CLS.sheetEyebrow + '">' +
                '<span class="' + CLS.sheetEyebrowTag + '">EcBiz · Section ' + h(sheet.code) + ' of 6</span>' +
                '<span class="text-[var(--muted)]">Cambridge IGCSE Business 0264</span></div>' +
              '<h1 class="' + CLS.sheetH1 + '">' + h(sheet.title) + '</h1>' +
              '<p class="' + CLS.sheetStrap + '">' + h(sheet.strap) + '</p></div>' +
              '<div class="' + CLS.sheetStats + '">' +
                stat("0" + h(sheet.code) + "<span class='text-[9.5px] opacity-70'>/06</span>", "Section", "bg-[var(--sheet-blush)]", "border-[var(--sheet-blush-line)]") +
                stat(String(visualCount), "Visuals", "bg-[var(--sheet-sand)]", "border-[var(--sheet-sand-line)]") +
                stat(String(blocks.length), "Topics", "bg-[var(--sheet-sage)]", "border-[var(--sheet-sage-line)]") +
              '</div></div>' +
            '<div class="' + CLS.sheetKeyBar + '">' +
              '<span class="inline-flex items-center gap-1">✨ ' + (visualCount ? "Interactive stages & pyramid tiers" : "Visual formulas & exam comparisons") + '</span>' +
              '<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-sm border border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)]"></span>Blush = topic header</span>' +
              '<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-sm border border-[var(--sheet-sand-line)] bg-[var(--sheet-sand)]"></span>Sand = concepts</span>' +
              '<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-sm border border-[var(--sheet-rose-line)] bg-[var(--sheet-rose)]"></span>Rose = risks</span>' +
              '<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-sm border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)]"></span>Sage = exam takeaway</span>' +
              '<span class="ml-auto hidden sm:inline">Complete chapter coverage</span>' +
            '</div>' +
          '</header>' +
          '<div class="' + CLS.sheetBody + '">' +
            (q ? '<div class="' + CLS.sheetFilterResult + '"><span>' + filtered.length + ' of ' + blocks.length +
              ' sub-topics match “' + h(st.query) + '”</span>' +
              '<button type="button" class="font-semibold text-[#97532b] hover:underline cursor-pointer" data-act="clear-search">Clear</button></div>' : '') +
            '<div class="space-y-3">' + filtered.map(blockHtml).join("") + '</div>' +
          '</div>' +
          '<footer class="' + CLS.sheetFooter + '">' +
            '<span class="truncate">EcBiz · Section ' + h(sheet.code) + ' Chapter Summary · Cambridge IGCSE™ Business 0264</span>' +
            '<span class="inline-flex shrink-0 items-center gap-1.5">💡 <span>Study &amp; revise</span></span>' +
          '</footer>' +
        '</article>' +
        '<div class="' + CLS.sheetChrome + ' mt-5 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">' +
          (prev ? '<button type="button" class="' + pagerBtn + '" data-act="select" data-code="' + h(prev.code) + '">← <span>' +
            '<span class="block font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)]">Previous</span>' +
            'Section ' + h(prev.code) + ': ' + h(prev.title) + '</span></button>' : '<div></div>') +
          (next ? '<button type="button" class="' + pagerBtn + '" data-act="select" data-code="' + h(next.code) + '"><span>' +
            '<span class="block font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)]">Next</span>' +
            'Section ' + h(next.code) + ': ' + h(next.title) + '</span> →</button>' : '<div></div>') +
        '</div>';
      }
      function select(code) {
        st.code = code; st.query = ""; search.value = "";
        EC.store.set("chapterSheet", code); draw();
      }
      search.addEventListener("input", function () { st.query = search.value; draw(); });
      root.addEventListener("click", function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "select") select(btn.getAttribute("data-code"));
        else if (act === "clear-search") { st.query = ""; search.value = ""; draw(); }
        else if (act === "print") window.print();
        else if (act === "stage") {
          st.stageSel[btn.getAttribute("data-viz")] = parseInt(btn.getAttribute("data-stage"), 10) || 0;
          draw();
        }
        else if (act === "diagram") EC.openSectionDiagram(st.code);
      });
      return EC.load("one-page-sheets").then(function (sheets) {
        st.sheets = isArray(sheets) ? sheets : [];
        if (!st.sheets.length) { body.innerHTML = '<div class="' + CLS.sheetEmpty + '"><p class="' + CLS.sheetEmptyText + '">No chapter sheets available.</p></div>'; return; }
        var ok = false;
        for (var i = 0; i < st.sheets.length; i++) if (st.sheets[i].code === st.code) ok = true;
        if (!ok) st.code = st.sheets[0].code;
        draw();
      });
  }

  EC.register("chapter-sheets", {
    title: "Chapter Summaries",
    render: function (main, params) { return renderChapterSheets(main, params); }
  });

  /* In-place chapter-summary dialog — reuses the full sheet renderer. */
  var chapterOverlayNode = null, chapterOverlayCleanup = null;
  function closeChapterSheetOverlay() {
    if (typeof chapterOverlayCleanup === "function") { try { chapterOverlayCleanup(); } catch (e) {} chapterOverlayCleanup = null; }
    if (chapterOverlayNode && chapterOverlayNode.parentNode) chapterOverlayNode.parentNode.removeChild(chapterOverlayNode);
    chapterOverlayNode = null;
    ecUnlockBodyScroll();
  }
  EC.openChapterSheetOverlay = function (code) {
    code = String(code || EC.store.get("chapterSheet", "1") || "1");
    closeChapterSheetOverlay();
    var host = ecGlobalOverlayHost();
    var dialog = document.createElement("div");
    dialog.className = "fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/75 p-2 backdrop-blur-md sm:p-5";
    var shell = document.createElement("div");
    shell.className = "relative w-full max-w-6xl rounded-2xl bg-[var(--paper,#F6F4ED)] dark:bg-neutral-950 shadow-2xl my-2 overflow-hidden";
    var chrome = document.createElement("div");
    chrome.className = "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--line,#D6D3D1)] bg-[var(--paper,#F6F4ED)]/95 dark:bg-neutral-950/95 px-4 py-2.5 backdrop-blur";
    chrome.innerHTML =
      '<div class="min-w-0"><div class="text-xs font-bold text-[#0F2042] dark:text-white">Chapter Summary</div>' +
      '<div class="text-[10px] opacity-70">One-page visual revision sheet · Section ' + h(code) + ' · Cambridge IGCSE Business 0264</div></div>' +
      '<button type="button" class="p-1.5 rounded-lg border border-[var(--line,#D6D3D1)] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer" data-act="close-sheet" title="Close chapter summary" aria-label="Close chapter summary">' + ic("x", 18) + '</button>';
    var sheetHost = document.createElement("div");
    shell.appendChild(chrome);
    shell.appendChild(sheetHost);
    dialog.appendChild(shell);
    host.appendChild(dialog);
    chapterOverlayNode = dialog;
    chapterOverlayCleanup = ecWireDialog(dialog, closeChapterSheetOverlay, null, "Chapter summary — Section " + code);
    ecLockBodyScroll();
    var closeBtn = chrome.querySelector('[data-act="close-sheet"]');
    if (closeBtn) {
      closeBtn.addEventListener("click", closeChapterSheetOverlay);
      closeBtn.focus();
    }
    try {
      var result = renderChapterSheets(sheetHost, { get: function (key) { return key === "section" ? code : null; } });
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (chapterOverlayNode !== dialog) return;
          sheetHost.innerHTML = '<p class="p-6 text-xs text-rose-700">Could not load this chapter summary.</p>';
        });
      }
    } catch (e) {
      sheetHost.innerHTML = '<p class="p-6 text-xs text-rose-700">Could not load this chapter summary.</p>';
    }
  };
  EC.closeChapterSheetOverlay = closeChapterSheetOverlay;

  /* ================================================================= */
  /* archive — Document Archive                                         */
  /* ================================================================= */

  EC.register("archive", {
    title: "Document Archive",
    render: function (main) {
      var root = rootFor(main, CLS.page);
      var docs = [
        { title: "Cambridge IGCSE Business 0264 Specimen Paper 1 (2027)",
          desc: "Official Cambridge examination Paper 1 (Short Answer and Data Response). 80 marks, 1 hour 30 minutes.",
          category: "Official 0264 Specimen", specimen: true,
          url: "https://www.cambridgeinternational.org/Images/718443-2027-specimen-paper-1.pdf",
          mark: "https://www.cambridgeinternational.org/Images/718522-2027-specimen-paper-1-mark-scheme.pdf" },
        { title: "Cambridge IGCSE Business 0264 Specimen Paper 2 (2027)",
          desc: "Official Cambridge examination Paper 2 (Case Study). 80 marks, 1 hour 30 minutes, includes case insert.",
          category: "Official 0264 Specimen", specimen: true,
          url: "https://www.cambridgeinternational.org/Images/718446-2027-specimen-paper-2.pdf",
          mark: "https://www.cambridgeinternational.org/Images/718525-2027-specimen-paper-2-mark-scheme.pdf",
          insert: "https://www.cambridgeinternational.org/Images/718535-2027-specimen-paper-2-insert.pdf" },
        { title: "Cambridge IGCSE Business Studies 0264 Syllabus (2027–2029)",
          desc: "Complete qualification curriculum syllabus document detailing Assessment Objectives AO1–AO4, subject content, and grading.",
          category: "Official Syllabus", local: true,
          url: "./assets/aistudio/718123-2027-2029-syllabus_74cc6921.pdf" },
        { title: "CAIE IGCSE Business Studies Revision Guide",
          desc: "Comprehensive structured revision summary of all chapters and CIE examination technique guidelines.",
          category: "Revision Guide", local: true,
          url: "./assets/aistudio/CAIE_-_IGCSE_-_Business_Studies__1__c3cb68cc.pdf" }
      ];
      function link(url, label, primary) {
        return '<a class="' + (primary ? CLS.archiveLinkPrimary : CLS.archiveLinkGhost) + '" href="' + h(url) +
          '" target="_blank" rel="noopener noreferrer">' + h(label) + ' ↗</a>';
      }
      function stripLink(url, label) {
        return '<a class="' + CLS.arcLink + '" href="' + h(url) +
          '" target="_blank" rel="noopener noreferrer">' + h(label) + ' ↗</a>';
      }
      var html = '<div class="' + CLS.pageHeading + '"><div>' +
        '<h1 class="' + CLS.title + '">Cambridge Examination Document Archive</h1>' +
        '<p class="' + CLS.desc + '">Zero-cost access to official Cambridge International Education (CIE) 0264 specimen papers, ' +
        'mark schemes, case inserts, and syllabus specifications.</p></div></div>' +
        '<div class="' + CLS.archiveGrid + '">';
      docs.forEach(function (doc) {
        html += '<div class="' + CLS.archiveCard + '"><div>' +
          '<div class="flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-neutral-400 mb-2">' +
            '<span class="' + CLS.archiveCat + '">' + h(doc.category) + '</span>' +
            (doc.specimen ? '<span class="' + CLS.archiveBadge + '">First Exam 2027</span>' : '') + '</div>' +
          '<h2 class="' + CLS.archiveTitle + '">' + h(doc.title) + '</h2>' +
          '<p class="' + CLS.archiveDesc + '">' + h(doc.desc) + '</p></div>' +
          '<div class="' + CLS.archiveLinks + '">' +
            link(doc.url, doc.local ? "Open Document PDF" : "Question Paper PDF", true) +
            (doc.mark ? link(doc.mark, "Mark Scheme PDF", false) : "") +
            (doc.insert ? link(doc.insert, "Case Study Insert", false) : "") +
          '</div></div>';
      });
      html += '</div><div class="' + CLS.archiveStrip + '">' +
        '<h3 class="' + CLS.archiveStripTitle + '">Authoritative Cambridge Portals &amp; Cloud Handlers</h3>' +
        '<p class="leading-relaxed">As part of the EcBiz zero-cost infrastructure, paper archives and PDFs are fetched directly from ' +
        'official Cambridge portals and Google Drive storage links.</p>' +
        '<div class="' + CLS.archiveStripLinks + '">' +
          stripLink("https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-business-0264/", "Cambridge 0264 Qualification Portal") +
          stripLink("https://pastpapers.papacambridge.com/papers/caie/igcse-business-studies-0450", "PapaCambridge 0450 Archive") +
        '</div></div>';
      root.innerHTML = html;
    }
  });

  /* ================================================================= */
  /* study-space — Pomodoro focus widget / aesthetic realm              */
  /* ================================================================= */

  var SS_THEMES = {
    default: {
      id: "default", name: "Midnight Lo-Fi",
      subtitle: "Cozy nocturnal vibes with purple ambient glow", price: 0,
      background: "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100",
      card: "bg-slate-900/60 border-indigo-500/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(79,70,229,0.15)]",
      accent: "from-indigo-500 to-purple-600", accentText: "text-indigo-400", accentBorder: "border-indigo-500/40",
      button: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
      ring: "ring-indigo-500/40", glow: "rgba(99, 102, 241, 0.25)"
    },
    greenhouse: {
      id: "greenhouse", name: "Emerald Greenhouse",
      subtitle: "Soothing botanical sanctum surrounded by lush rain foliage", price: 50,
      background: "bg-gradient-to-br from-stone-950 via-emerald-950/70 to-teal-950 text-emerald-50",
      card: "bg-emerald-950/40 border-emerald-500/25 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(16,185,129,0.18)]",
      accent: "from-emerald-400 to-teal-500", accentText: "text-emerald-400", accentBorder: "border-emerald-500/40",
      button: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      ring: "ring-emerald-500/40", glow: "rgba(16, 185, 129, 0.25)"
    },
    cyberpunk: {
      id: "cyberpunk", name: "Cyberpunk Neon",
      subtitle: "Futuristic night-city arcade with pulsating neon glow", price: 100,
      background: "bg-gradient-to-br from-zinc-950 via-purple-950/80 to-neutral-950 text-pink-50",
      card: "bg-zinc-900/60 border-pink-500/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(236,72,153,0.22)] ring-1 ring-cyan-500/20",
      accent: "from-pink-500 via-purple-500 to-cyan-400", accentText: "text-pink-400", accentBorder: "border-pink-500/40",
      button: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-600/35",
      badge: "bg-pink-500/10 text-pink-300 border-pink-500/30",
      ring: "ring-pink-500/50", glow: "rgba(236, 72, 153, 0.3)"
    }
  };
  var SS_SOUNDS = [
    { id: "rain", name: "Gentle Rain", icon: "rain", src: "https://actions.google.com/sounds/v1/weather/rain_heavy.ogg", type: "rain" },
    { id: "lofi", name: "Lo-Fi Chill", icon: "music", src: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", type: "lofi" },
    { id: "fire", name: "Cozy Hearth", icon: "flame", src: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg", type: "noise" },
    { id: "nature", name: "Forest Birds", icon: "trees", src: "https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg", type: "nature" }
  ];
  function ssTheme(id) { return has(SS_THEMES, id) ? SS_THEMES[id] : SS_THEMES.default; }
  function ssTrack(id) {
    for (var i = 0; i < SS_SOUNDS.length; i++) if (SS_SOUNDS[i].id === id) return SS_SOUNDS[i];
    return null;
  }

  /* Persistent ambient audio manager: named looping tracks, Web Audio
     filtering per track type, and a synth fallback when audio is blocked. */
  var ssAudio = {
    ctx: null, elements: {}, nodes: {}, active: {}, master: 0.65,
    context: function () {
      try {
        if (!this.ctx) {
          var Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return null;
          this.ctx = new Ctx();
        }
        if (this.ctx.state === "suspended" && this.ctx.resume) this.ctx.resume();
        return this.ctx;
      } catch (e) { return null; }
    },
    synth: function (track, volume) {
      if (!track || this.nodes[track.id]) return;
      try {
        var ctx = this.context();
        if (!ctx) return;
        var bufferSize = ctx.sampleRate * 2;
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0), b0 = 0, b1 = 0, b2 = 0, i;
        for (i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.12;
        }
        var noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
        var filter = ctx.createBiquadFilter();
        filter.type = track.type === "rain" ? "lowpass" : "bandpass";
        filter.frequency.value = track.type === "rain" ? 800 : 440;
        var gain = ctx.createGain(); gain.gain.value = num(volume) * 0.4;
        noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination); noise.start();
        this.nodes[track.id] = { source: noise, gain: gain };
      } catch (e) {}
    },
    start: function (track, volume) {
      if (!track) return;
      var self = this;
      this.active[track.id] = true;
      var audio = this.elements[track.id];
      if (!audio) {
        try {
          audio = new Audio(track.src);
          audio.loop = true;
          audio.preload = "none";
          this.elements[track.id] = audio;
        } catch (e) { audio = null; }
      }
      if (!audio) { this.synth(track, volume); return; }
      try { audio.volume = num(volume); } catch (e) {}
      try {
        var p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(function () {}, function () { self.synth(track, volume); });
        }
      } catch (e) { this.synth(track, volume); }
    },
    stop: function (id) {
      var audio = this.elements[id];
      if (audio) { try { audio.pause(); } catch (e) {} }
      var node = this.nodes[id];
      if (node) {
        try { node.source.stop(); } catch (e) {}
        this.nodes[id] = null;
      }
      this.active[id] = false;
    },
    stopAll: function () {
      var key;
      for (key in this.active) if (has(this.active, key)) this.stop(key);
    },
    setVolume: function (v) {
      this.master = num(v);
      var key;
      for (key in this.elements) if (has(this.elements, key)) {
        try { this.elements[key].volume = this.master; } catch (e) {}
      }
      for (key in this.nodes) if (has(this.nodes, key) && this.nodes[key] && this.nodes[key].gain) {
        try { this.nodes[key].gain.gain.value = this.master * 0.4; } catch (e) {}
      }
    },
    anyActive: function () {
      var key;
      for (key in this.active) if (has(this.active, key) && this.active[key]) return true;
      return false;
    }
  };

  var ssTimer = null, ssWatch = null, ssToastTimer = null;
  var ssCleanupFn = null, ssOverlayHost = null;

  /* Global overlay host shared by all EC.open*Overlay APIs. */
  function ecGlobalOverlayHost() {
    var host = document.getElementById("ecbiz-global-overlay-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "ecbiz-global-overlay-host";
      document.body.appendChild(host);
    }
    return host;
  }

  /* Reference-counted scroll lock so stacked dialogs restore the page safely. */
  var ecOverlayLockCount = 0, ecOverlayPrevOverflow = "";
  function ecLockBodyScroll() {
    if (ecOverlayLockCount === 0) {
      ecOverlayPrevOverflow = document.body.style.overflow || "";
      try { document.body.style.overflow = "hidden"; } catch (e) {}
    }
    ecOverlayLockCount++;
  }
  function ecUnlockBodyScroll() {
    ecOverlayLockCount = Math.max(0, ecOverlayLockCount - 1);
    if (ecOverlayLockCount === 0) {
      try { document.body.style.overflow = ecOverlayPrevOverflow; } catch (e) {}
    }
  }
  /* Shared close wiring for dialog-style overlays. */
  function ecWireDialog(node, onClose, labelledBy, label) {
    node.setAttribute("role", "dialog");
    node.setAttribute("aria-modal", "true");
    if (labelledBy) node.setAttribute("aria-labelledby", labelledBy);
    else if (label) node.setAttribute("aria-label", label);
    var handler = function (event) {
      if (event.key === "Escape" || event.keyCode === 27) { event.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    node.addEventListener("click", function (event) { if (event.target === node) onClose(); });
    return function () { document.removeEventListener("keydown", handler); };
  }

  function renderStudySpace(main, params, opts) {
      opts = opts || {};
      if (typeof ssCleanupFn === "function") { try { ssCleanupFn(); } catch (e) {} ssCleanupFn = null; }
      if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
      if (ssToastTimer !== null) { clearTimeout(ssToastTimer); ssToastTimer = null; }

      var savedPos = EC.store.get("studyPos", null);
      /* The original app counted focus blocks in ecbiz_completed_focus_sessions;
       * read that FIRST and only fall back to the newer studySessions key so a
       * returning user never loses their count. */
      var savedSessions = EC.store.get("completed_focus_sessions", null);
      if (savedSessions === null || savedSessions === undefined) savedSessions = EC.store.get("studySessions", 0);
      var st = {
        active: EC.store.get("studyspace_active", false) === true,
        pos: (savedPos && typeof savedPos.x === "number" && typeof savedPos.y === "number")
          ? { x: savedPos.x, y: savedPos.y }
          : { x: Math.max(16, (window.innerWidth || 1024) - 360), y: Math.max(16, (window.innerHeight || 768) - 230) },
        focus: clampInt(EC.store.get("studyFocusMins", 25), 1, 180, 25),
        breakMins: clampInt(EC.store.get("studyBreakMins", 5), 1, 60, 5),
        ghost: EC.store.get("studyGhost", false) === true,
        mini: EC.store.get("studyMiniMode", "micro") === "compact" ? "compact" : "micro",
        streak: Math.max(0, num(EC.store.get("studyStreak", 0))),
        sessions: Math.max(0, num(savedSessions)),
        unlocked: ["default"], activeTheme: "default",
        mode: "focus", timeLeft: 0, running: false, elapsed: 0,
        expanded: true, volume: 0.65, toast: "", custom: "",
        storeOpen: false, mixerOpen: false
      };
      st.timeLeft = st.focus * 60;
      st.custom = String(st.focus);
      var savedThemes = readStoreArray("study_themes");
      savedThemes.forEach(function (id) { if (has(SS_THEMES, id) && st.unlocked.indexOf(id) < 0) st.unlocked.push(id); });
      var savedActive = EC.store.get("study_active_theme", "default");
      if (has(SS_THEMES, savedActive) && st.unlocked.indexOf(savedActive) >= 0) st.activeTheme = savedActive;
      ssAudio.setVolume(st.volume);

      var root = rootFor(main, "");
      root.id = "ms-study-space-root";
      var area = document.createElement("div");
      root.appendChild(area);

      function theme() { return ssTheme(st.activeTheme); }
      function setActive(flag) { st.active = !!flag; EC.store.set("studyspace_active", st.active); }
      function persist() {
        /* Always write BOTH focus-session keys so legacy and current readers
         * (including the Deep Focus Novice achievement) stay in sync. */
        EC.store.set("completed_focus_sessions", st.sessions);
        EC.store.set("studyspace_active", st.active);
        EC.store.set("studyPos", st.pos);
        EC.store.set("studyFocusMins", st.focus);
        EC.store.set("studyBreakMins", st.breakMins);
        EC.store.set("studyGhost", st.ghost);
        EC.store.set("studyMiniMode", st.mini);
        EC.store.set("studyStreak", st.streak);
        EC.store.set("studySessions", st.sessions);
        EC.store.set("study_themes", st.unlocked);
        EC.store.set("study_active_theme", st.activeTheme);
      }
      function statusText() {
        if (st.running) return st.mode === "focus"
          ? "Studying (" + st.focus + "m session) • Earning GIS Points" : "Recharging...";
        return "Ready to Focus (" + (st.mode === "focus" ? st.focus : st.breakMins) + "m session)";
      }
      function toastHtml() {
        return st.toast ? '<div class="' + CLS.ss.toast + '"><span>' + ic("sparkles", 16, "text-amber-400") +
          '</span><span>' + h(st.toast) + '</span></div>' : "";
      }
      function toastHolder() { return area.querySelector("[data-ss-toast-holder]"); }
      function toast(msg, ms) {
        st.toast = msg;
        if (ssToastTimer !== null) clearTimeout(ssToastTimer);
        ssToastTimer = setTimeout(function () {
          st.toast = ""; ssToastTimer = null;
          var holder = toastHolder();
          if (holder) holder.innerHTML = "";
        }, ms || 3000);
        var box = toastHolder();
        if (box) box.innerHTML = toastHtml();
      }
      function badge(cls, iconName, value, label) {
        return '<div class="' + CLS.ss.badge + ' ' + cls + '">' + ic(iconName, 16) +
          '<span>' + h(value) + '</span><span class="text-[10px] opacity-60 hidden sm:inline">' + h(label) + '</span></div>';
      }
      function presets() {
        return [5, 10, 12, 13, 15, 20, 25, 45].map(function (mins) {
          return '<button type="button" class="' + CLS.ss.presetChip + ' ' +
            (st.focus === mins ? CLS.ss.presetOn : CLS.ss.presetOff) +
            '" data-act="preset" data-mins="' + mins + '">' + mins + 'm</button>';
        }).join("");
      }
      function shopHtml() {
        if (!st.storeOpen) return "";
        var cards = Object.keys(SS_THEMES).map(function (id) {
          var t = SS_THEMES[id];
          var owned = st.unlocked.indexOf(id) >= 0;
          var equipped = st.activeTheme === id;
          var button = owned
            ? '<button type="button" data-act="buytheme" data-id="' + id + '" class="w-full py-2 rounded-xl text-xs font-semibold transition active:scale-95 ' +
                (equipped ? "bg-white/20 text-white/70 cursor-default" : t.button) + '">' +
                (equipped ? "Equipped" : "Equip Theme") + '</button>'
            : '<button type="button" data-act="buytheme" data-id="' + id + '"' +
                (EC.points() < t.price ? ' disabled' : '') + ' class="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ' +
                (EC.points() >= t.price ? t.button : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed") + '">' +
                ic("lock", 12) + '<span>' + t.price + ' GIS Points</span></button>';
          return '<div class="p-4 rounded-2xl border flex flex-col justify-between transition-all ' +
            (equipped ? t.accentBorder + " bg-white/10 shadow-lg" : "border-white/10 bg-black/25 hover:border-white/20") + '">' +
            '<div><div class="flex items-center justify-between mb-2"><span class="font-bold text-sm tracking-tight">' + h(t.name) + '</span>' +
            (equipped ? '<span class="p-1 rounded-full bg-emerald-500/20 text-emerald-400">' + ic("checkCircle", 14) + '</span>' : "") +
            '</div><p class="text-[11px] text-white/50 leading-relaxed mb-4">' + h(t.subtitle) + '</p></div>' +
            '<div>' + button + '</div></div>';
        }).join("");
        return '<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">' +
          '<div class="w-full max-w-xl p-6 sm:p-8 rounded-3xl border ' + theme().card + ' shadow-2xl">' +
            '<div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">' +
              ic("bag", 20, "text-purple-400") + '<h3 class="font-bold text-lg">Decoration Store</h3></div>' +
              '<div class="flex items-center gap-3"><div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs">' +
                ic("coins", 14, "text-amber-400") + '<span>' + EC.points() + ' GIS Points Available</span></div>' +
              '<button type="button" data-act="closeshop" class="text-white/50 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-white/10">Close</button></div></div>' +
            '<p class="text-xs text-white/60 mb-6">Use your hard-earned GIS Points to unlock aesthetic study room environments inspired by Roblox lo-fi spaces.</p>' +
            '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">' + cards + '</div>' +
          '</div></div>';
      }
      function mixerHtml() {
        if (!st.mixerOpen) return "";
        var rows = SS_SOUNDS.map(function (track) {
          var playing = ssAudio.active[track.id] === true;
          return '<div class="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">' +
            '<div class="flex items-center gap-3"><div class="p-2 rounded-xl ' + (playing ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-white/50") + '">' +
              ic(track.icon, 16) + '</div><span class="text-sm font-medium">' + h(track.name) + '</span></div>' +
            '<button type="button" data-act="sound" data-id="' + track.id + '" class="px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ' +
              (playing ? "bg-indigo-600 text-white shadow" : "bg-white/10 text-white/70 hover:bg-white/15") + '">' +
              (playing ? "Playing" : "Muted") + '</button></div>';
        }).join("");
        return '<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">' +
          '<div class="w-full max-w-md p-6 rounded-3xl border ' + theme().card + ' shadow-2xl">' +
            '<div class="flex items-center justify-between mb-5"><div class="flex items-center gap-2">' +
              ic("sliders", 20, "text-indigo-400") + '<h3 class="font-bold text-base">Sound Mixer</h3></div>' +
              '<button type="button" data-act="closemixer" class="text-white/50 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-white/10">Close</button></div>' +
            '<div class="mb-6 p-4 rounded-2xl bg-black/30 border border-white/10">' +
              '<div class="flex items-center justify-between text-xs text-white/70 mb-2"><span class="flex items-center gap-1.5 font-medium">' +
                ic(st.volume > 0 ? "volume" : "mute", 16) + 'Master Volume</span>' +
                '<span class="font-mono" data-ss-volume-label>' + Math.round(num(st.volume) * 100) + '%</span></div>' +
              '<input type="range" min="0" max="1" step="0.05" value="' + h(st.volume) + '" data-role="volume" class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-400" />' +
            '</div><div class="space-y-2.5">' + rows + '</div>' +
          '</div></div>';
      }

      function drawPanel() {
        var t = theme(), focusActive = st.mode === "focus";
        root.className = "fixed inset-0 z-[100] w-full h-full min-h-screen overflow-y-auto transition-all duration-300 " +
          t.background + " font-sans select-none";
        area.innerHTML =
          '<div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-1000" style="background:' + h(t.glow) + '"></div>' +
          '<div class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-[130px] bg-indigo-600/10 pointer-events-none"></div>' +
          '<div class="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[130px] bg-purple-600/10 pointer-events-none"></div>' +
          '<header class="' + CLS.ss.header + '"><div class="' + CLS.ss.headerRow + ' ' + t.card + '">' +
            '<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-2xl bg-gradient-to-tr ' + t.accent + ' flex items-center justify-center shadow-lg shadow-black/30">' +
              ic("laptop", 20, "text-white") + '</div>' +
              '<div><div class="flex items-center gap-2"><span class="' + CLS.ss.brandName + '">Study Space</span>' +
                '<span class="' + CLS.ss.brandTag + '">Lo-Fi Hub</span></div>' +
                '<p class="' + CLS.ss.brandSub + '">Aesthetic Roblox-inspired focus realm</p></div></div>' +
            '<div class="flex items-center gap-2 sm:gap-3">' +
              '<div class="' + CLS.ss.badge + ' ' + CLS.ss.coins + '">' + ic("coins", 16) +
                '<span data-ss-coins>' + EC.points() + '</span><span class="text-[10px] opacity-60 hidden sm:inline">GIS Points</span></div>' +
              '<div class="' + CLS.ss.badge + ' ' + CLS.ss.streak + '">' + ic("flame", 16) +
                '<span data-ss-streak>' + st.streak + '</span><span class="text-[10px] opacity-60 hidden sm:inline">Day Streak</span></div>' +
              '<button type="button" class="' + CLS.ss.ghostBtn + '" data-act="shop" title="Cosmetics Shop">' + ic("bag", 16, "text-purple-300") +
                '<span class="hidden sm:inline">Shop</span></button>' +
              '<button type="button" class="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-xs" data-act="achievements" title="View Achievements &amp; Claim Bonus GIS Points">' +
                ic("trophy", 16, "text-amber-400") + '<span class="hidden sm:inline">Achievements</span></button>' +
              '<button type="button" class="p-2 rounded-2xl border transition active:scale-95 cursor-pointer ' +
                (ssAudio.anyActive() ? "bg-indigo-600/30 border-indigo-400 text-indigo-300" : "bg-white/10 hover:bg-white/15 border-white/15 text-white/80") +
                '" data-act="mixer" title="Ambient Sound Mixer">' + ic("sliders", 16) + '</button>' +
              '<button type="button" class="' + CLS.ss.shrinkBtn + '" data-act="shrink" title="Shrink into a floating mini timer and continue practice questions">' +
                ic("minimize", 16) + '<span>Shrink to Mini Timer ↘</span></button>' +
              '<button type="button" class="p-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-white transition active:scale-95 cursor-pointer" data-act="close-widget" title="Close Widget" aria-label="Close Widget">' + ic("x", 16) + '</button>' +
            '</div></div></header>' +
          '<main class="' + CLS.ss.main + '">' +
            '<div data-ss-toast-holder>' + toastHtml() + '</div>' +
            '<div class="' + CLS.ss.pod + '">' +
              '<div class="' + CLS.ss.modeTabs + '">' +
                '<button type="button" class="' + CLS.ss.modeBtn + ' ' + (focusActive ? t.button + " shadow-md" : CLS.ss.modeOff) +
                  '" data-act="mode" data-mode="focus">Focus Session (' + st.focus + 'm)</button>' +
                '<button type="button" class="' + CLS.ss.modeBtn + ' ' + (focusActive ? CLS.ss.modeOff : t.button + " shadow-md") +
                  '" data-act="mode" data-mode="break">Short Break (' + st.breakMins + 'm)</button>' +
              '</div>' +
              (focusActive ?
                '<div class="' + CLS.ss.presets + '">' +
                  '<div class="' + CLS.ss.presetHead + '"><span class="flex items-center gap-1.5 font-bold text-white/90">' +
                    ic("clock", 14, "text-indigo-400") + '<span>Choose Focus Duration:</span></span>' +
                    '<span class="text-[11px] font-mono text-white/50">Custom Minutes</span></div>' +
                  '<div class="' + CLS.ss.presetChips + '">' + presets() + '</div>' +
                  '<div class="' + CLS.ss.customRow + '"><span class="text-[11px] text-white/60">Any Custom Time:</span>' +
                    '<div class="flex items-center gap-1.5">' +
                      '<input type="number" id="ms-ss-custom" min="1" max="180" value="' + h(st.custom) + '" placeholder="e.g. 12" class="' + CLS.ss.customInput + '" />' +
                      '<span class="text-xs text-white/60">mins</span>' +
                      '<button type="button" class="' + CLS.ss.customBtn + '" data-act="set-custom">Set</button>' +
                    '</div></div></div>' : "") +
              '<div class="' + CLS.ss.timerCard + ' ' + t.card + '">' +
                (st.running ? '<div class="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center gap-1.5 px-8 pb-3 opacity-25 pointer-events-none">' +
                  [40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 80, 65, 95, 40].map(function (v, i) {
                    return '<span class="w-1.5 bg-current rounded-full animate-pulse" style="height:' + v + '%;animation-delay:' + (i * 0.15).toFixed(2) + 's;animation-duration:1.2s"></span>';
                  }).join("") + '</div>' : "") +
                '<div class="' + CLS.ss.status + '"><span class="' + CLS.ss.statusDot + ' ' +
                  (st.running ? "bg-emerald-400 animate-ping" : "bg-white/30") + '"></span>' +
                  '<span class="' + CLS.ss.statusText + '" data-ss-status>' + h(statusText()) + '</span></div>' +
                '<div class="' + CLS.ss.digits + '" aria-live="polite" data-ss-digits>' + fmtTime(st.timeLeft) + '</div>' +
                '<div class="' + CLS.ss.quickRow + '">' +
                  '<button type="button" class="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-xs font-mono font-semibold transition active:scale-95 cursor-pointer" data-act="add" data-mins="1" title="Add 1 minute">+1m</button>' +
                  '<button type="button" class="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-xs font-mono font-semibold transition active:scale-95 cursor-pointer" data-act="add" data-mins="5" title="Add 5 minutes">+5m</button>' +
                '</div>' +
                '<div class="flex items-center gap-4 mt-4 z-10">' +
                  '<button type="button" class="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition transform active:scale-95 shadow-xl cursor-pointer ' + t.button +
                    '" data-act="startpause">' + ic(st.running ? "pause" : "play", 20, "fill-current" + (st.running ? "" : " ml-0.5")) +
                    '<span>' + (st.running ? "Pause" : "Start Session") + '</span></button>' +
                  '<button type="button" class="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer" data-act="reset" title="Reset Clock">' + ic("reset", 20) + '</button>' +
                '</div>' +
                '<div class="mt-8 text-center text-xs text-white/40 flex items-center gap-1.5">' + ic("coins", 14, "text-amber-400/70") +
                  '<span>Finish a focus block of at least 15 minutes to earn 10 GIS Points once per day.</span></div>' +
              '</div>' +
              '<div class="w-full mt-6 flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-xl">' +
                '<div class="flex items-center gap-2">' + ic("music", 16, "text-white/60") +
                  '<span class="text-xs font-medium text-white/70">Ambient Lo-Fi Tracks</span></div>' +
                '<div class="flex items-center gap-2">' + SS_SOUNDS.map(function (track) {
                  var playing = ssAudio.active[track.id] === true;
                  return '<button type="button" data-act="sound" data-id="' + track.id + '" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition active:scale-95 border ' +
                    (playing ? "bg-white/20 border-white/30 text-white" : "bg-white/5 border-transparent text-white/50 hover:text-white/80") + '">' +
                    ic(track.icon, 14) + '<span class="hidden sm:inline">' + h(track.name) + '</span></button>';
                }).join("") + '</div></div>' +
              '<div class="w-full mt-4 text-center"><button type="button" class="text-xs text-white/60 hover:text-emerald-400 transition inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-white/5" data-act="shrink">' +
                '<span>Ready to do practice questions on the website?</span>' +
                '<span class="font-semibold underline underline-offset-4">Shrink into floating timer ↘</span></button></div>' +
            '</div>' +
          '</main>' +
          '<p class="' + CLS.ss.footer + '">' + ic("clock", 12) + ' ' + st.sessions + ' focus blocks complete · Settings are saved on this device.</p>' +
          shopHtml() + mixerHtml();
      }

      function widgetFrame(ghost, inner, titleText) {
        var w = st.mini === "micro" ? 240 : 290;
        var hh = st.mini === "micro" ? 44 : 150;
        root.className = "";
        area.innerHTML =
          '<div id="ms-ss-widget" class="fixed z-[90] select-none transition-all duration-300 flex items-center gap-1.5 px-2 py-1 rounded-full border ' +
            (ghost
              ? "opacity-25 hover:opacity-95 bg-black/25 border border-white/10 shadow-none backdrop-blur-none cursor-pointer"
              : "border " + theme().card + " shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl") +
            '" style="left:' + num(st.pos.x) + 'px;top:' + num(st.pos.y) + 'px;width:' + w + 'px;min-height:' + hh + 'px" ' +
            'title="' + h(titleText) + '">' + inner +
            '<div data-ss-toast-holder>' + toastHtml() + '</div></div>';
        bindDrag();
      }
      function microInner(ghost) {
        if (ghost) {
          return '<div class="flex items-center gap-2 px-1 py-0.5">' +
            '<div class="flex items-center gap-1.5 cursor-grab active:cursor-grabbing" data-role="drag">' + ic("grip", 12, "text-white/40") +
              '<span class="' + CLS.ss.statusDot + ' ' + (st.running ? "bg-emerald-400 animate-ping" : "bg-white/40") + '"></span></div>' +
            '<span class="font-mono text-xs sm:text-sm font-black tabular-nums tracking-wider text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]" data-ss-digits>' + fmtTime(st.timeLeft) + '</span>' +
            '<span class="text-[10px] text-white/60 flex items-center gap-1 pl-1 font-sans">' + ic("ghost", 11, "text-amber-300/80 animate-pulse") +
              '<span class="hidden sm:inline">Tap to wake</span></span></div>';
        }
        return '<div class="flex items-center gap-1.5 sm:gap-2">' +
          '<div class="flex items-center gap-1 cursor-grab active:cursor-grabbing pl-0.5" data-role="drag" title="Drag to reposition anywhere">' +
            ic("grip", 14, "text-white/40 hover:text-white/80 transition") +
            '<span class="' + CLS.ss.statusDot + ' ' + (st.running ? "bg-emerald-400 animate-ping" : "bg-white/40") + '" title="' + (st.running ? "Timer Running" : "Timer Paused") + '"></span></div>' +
          '<button type="button" data-act="expand" class="font-mono text-xs sm:text-sm font-black tabular-nums tracking-wide text-white hover:text-indigo-200 transition px-1 py-0.5 rounded cursor-pointer" title="Click to expand to full Study Space" data-ss-digits>' + fmtTime(st.timeLeft) + '</button>' +
          '<button type="button" data-act="startpause" class="w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm cursor-pointer ' +
            (st.running ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "bg-white/10 hover:bg-white/20 text-white/90") + '" title="' + (st.running ? "Pause" : "Start Focus") + '">' +
            ic(st.running ? "pause" : "play", 11, "fill-current" + (st.running ? "" : " ml-0.5")) + '</button>' +
          '<button type="button" data-act="ghost" class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-amber-300 flex items-center justify-center transition active:scale-90 cursor-pointer" title="Ghost Mode (Fairly transparent, numbers stay visible)">' + ic("ghost", 12) + '</button>' +
          '<button type="button" data-act="mini-compact" class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer" title="Switch to Card view (with points &amp; streak)">' + ic("maximize", 11) + '</button>' +
          '<button type="button" data-act="expand" class="px-2 py-0.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow-sm transition active:scale-90 cursor-pointer" title="Open Fullscreen Study Realm">' + ic("external", 11) +
            '<span class="hidden sm:inline">Max</span></button>' +
          '<button type="button" data-act="close-widget" class="w-5 h-5 rounded-full text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition active:scale-90 cursor-pointer" title="Close Widget" aria-label="Close Widget">' + ic("x", 12) + '</button></div>';
      }
      function compactInner(ghost) {
        if (ghost) {
          return '<div class="p-3 flex flex-col gap-2">' +
            '<div class="flex items-center justify-between"><div class="flex items-center gap-1.5 cursor-grab active:cursor-grabbing" data-role="drag">' + ic("grip", 12, "text-white/40") +
              '<span class="' + CLS.ss.statusDot + ' ' + (st.running ? "bg-emerald-400 animate-ping" : "bg-white/40") + '"></span>' +
              '<span class="text-[10px] font-mono text-white/50">Ghost HUD</span></div>' +
              '<div class="flex items-center gap-1 text-[10px] text-white/60">' + ic("ghost", 12, "text-amber-300 animate-pulse") +
              '<span>Tap anywhere to wake</span></div></div>' +
            '<div class="flex items-center justify-between"><div class="text-2xl font-black font-mono tracking-tight tabular-nums text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]" data-ss-digits>' + fmtTime(st.timeLeft) + '</div>' +
              '<button type="button" data-act="startpause" class="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer">' + ic(st.running ? "pause" : "play", 14) + '</button></div></div>';
        }
        return '<div>' +
          '<div class="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing" data-role="drag">' +
            '<div class="flex items-center gap-1.5">' + ic("grip", 14, "text-white/40") +
              '<div class="flex items-center gap-1.5"><span class="' + CLS.ss.statusDot + ' ' + (st.running ? "bg-emerald-400 animate-ping" : "bg-white/40") + '"></span>' +
              '<span class="text-[11px] font-bold tracking-wide text-white/80">' + (st.mode === "focus" ? "Study Focus" : "Break") + '</span></div></div>' +
            '<div class="flex items-center gap-1">' +
              '<button type="button" data-act="ghost" class="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-amber-300 border border-white/10 transition cursor-pointer" title="Ghost Mode (Fairly transparent, numbers stay visible)">' + ic("ghost", 12) + '</button>' +
              '<button type="button" data-act="mini-micro" class="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 transition cursor-pointer" title="Shrink even smaller to Micro Pill">' + ic("minimize", 12) + '</button>' +
              '<button type="button" data-act="sound-all" class="p-1 rounded-lg border transition cursor-pointer ' +
                (ssAudio.anyActive() ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-300" : "bg-white/5 border-white/10 text-white/50 hover:text-white") + '" title="' +
                (ssAudio.anyActive() ? "Mute Ambient Audio" : "Play Lo-Fi/Rain Audio") + '">' + ic(ssAudio.anyActive() ? "volume" : "mute", 12) + '</button>' +
              '<button type="button" data-act="expand" class="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition border border-indigo-400/40 cursor-pointer" title="Expand to Full Study Realm">' + ic("external", 12) + '</button>' +
              '<button type="button" data-act="close-widget" class="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer" title="Close Widget" aria-label="Close Widget">' + ic("x", 12) + '</button>' +
            '</div></div>' +
          '<div class="p-3 flex items-center justify-between gap-2.5">' +
            '<div data-act="expand" class="cursor-pointer group flex flex-col" title="Click to view full room">' +
              '<div class="text-2xl font-black font-mono tracking-tight tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 group-hover:opacity-80 transition" data-ss-digits>' + fmtTime(st.timeLeft) + '</div>' +
              '<div class="flex items-center gap-2 text-[10px] text-white/50"><span class="flex items-center gap-1 text-amber-300 font-semibold">' + ic("coins", 12, "text-amber-400") +
                '<span data-ss-coins>' + EC.points() + '</span></span><span>•</span>' +
                '<span class="flex items-center gap-1 text-orange-300 font-semibold">' + ic("flame", 12, "text-orange-400") +
                '<span data-ss-streak-mini>' + st.streak + 'd</span></span></div></div>' +
            '<div class="flex items-center gap-1.5">' +
              '<button type="button" data-act="startpause" class="p-2 rounded-xl font-bold transition transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer ' + theme().button + '" title="' + (st.running ? "Pause" : "Start Focus") + '">' +
                ic(st.running ? "pause" : "play", 14, "fill-current" + (st.running ? "" : " ml-0.5")) + '</button>' +
              '<button type="button" data-act="reset" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer" title="Reset Timer">' + ic("reset", 14) + '</button>' +
            '</div></div>' +
          (st.running ? '<div class="h-0.5 bg-white/10 w-full overflow-hidden rounded-b-3xl"><div class="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 animate-pulse w-full"></div></div>' : "") +
          '</div>';
      }
      function drawWidget() {
        var ghost = st.ghost;
        if (st.mini === "micro") {
          widgetFrame(ghost, microInner(ghost), ghost
            ? "Ghost Mode Active • Tap or click anywhere on this widget to wake up"
            : "Drag to reposition • Click Expand for full room");
        } else {
          widgetFrame(ghost, compactInner(ghost), ghost
            ? "Ghost Mode Active • Tap or click anywhere on this widget to wake up"
            : "Drag to reposition • Click Expand for full room");
        }
      }
      function draw() {
        /* Either visible state (full realm or floating widget) counts as open. */
        if (!st.active) setActive(true);
        if (st.expanded) drawPanel(); else drawWidget();
      }
      function closeWidget() {
        setActive(false);
        if (typeof ssCleanupFn === "function") { try { ssCleanupFn(); } catch (e) {} ssCleanupFn = null; }
        if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
        if (ssWatch !== null) { clearInterval(ssWatch); ssWatch = null; }
        if (ssToastTimer !== null) { clearTimeout(ssToastTimer); ssToastTimer = null; }
        ssAudio.stopAll();
        if (opts.modal && main && main.parentNode) {
          /* Global overlay: remove it entirely. */
          main.innerHTML = "";
        } else {
          root.style.display = "none";
          area.innerHTML = "";
        }
      }

      function refreshTick() {
        var nodes = area.querySelectorAll("[data-ss-digits]"), i;
        for (i = 0; i < nodes.length; i++) nodes[i].textContent = fmtTime(st.timeLeft);
        nodes = area.querySelectorAll("[data-ss-status]");
        for (i = 0; i < nodes.length; i++) nodes[i].textContent = statusText();
        var coinNode = area.querySelector("[data-ss-coins]");
        if (coinNode) coinNode.textContent = EC.points();
        var streakNode = area.querySelector("[data-ss-streak]");
        if (streakNode) streakNode.textContent = st.streak;
        streakNode = area.querySelector("[data-ss-streak-mini]");
        if (streakNode) streakNode.textContent = st.streak + "d";
      }
      function clampPos() {
        var w = st.mini === "micro" ? 240 : 290;
        var hh = st.mini === "micro" ? 44 : 150;
        var maxX = Math.max(8, (window.innerWidth || 1024) - w - 8);
        var maxY = Math.max(8, (window.innerHeight || 768) - hh - 8);
        st.pos.x = Math.max(8, Math.min(maxX, num(st.pos.x)));
        st.pos.y = Math.max(8, Math.min(maxY, num(st.pos.y)));
      }
      function onResize() { clampPos(); if (!st.expanded) draw(); }
      window.addEventListener("resize", onResize);

      function bindDrag() {
        var widget = area.querySelector("#ms-ss-widget");
        if (!widget) return;
        widget.addEventListener("pointerdown", function (e) {
          if (e.target && e.target.closest && e.target.closest("button,input,a")) return;
          e.preventDefault();
          var startX = e.clientX, startY = e.clientY, ox = st.pos.x, oy = st.pos.y, moved = false;
          function moveTrack(ev) {
            if (Math.abs(ev.clientX - startX) > 4 || Math.abs(ev.clientY - startY) > 4) moved = true;
            var dx = ev.clientX - startX, dy = ev.clientY - startY;
            var w = st.mini === "micro" ? 240 : 290;
            var hh = st.mini === "micro" ? 44 : 150;
            var maxX = Math.max(8, (window.innerWidth || 1024) - w - 8);
            var maxY = Math.max(8, (window.innerHeight || 768) - hh - 8);
            st.pos.x = Math.max(8, Math.min(maxX, ox + dx));
            st.pos.y = Math.max(8, Math.min(maxY, oy + dy));
            widget.style.left = st.pos.x + "px";
            widget.style.top = st.pos.y + "px";
          }
          function up() {
            document.removeEventListener("pointermove", moveTrack);
            document.removeEventListener("pointerup", up);
            persist();
            if (!moved && st.ghost) wake();
          }
          document.addEventListener("pointermove", moveTrack);
          document.addEventListener("pointerup", up);
        });
      }
      function wake() {
        if (!st.ghost) return;
        st.ghost = false;
        toast("Study Space: Normal visibility restored", 2000);
        persist(); draw();
      }
      function toggleGhost() {
        st.ghost = !st.ghost;
        toast(st.ghost
          ? "👻 Ghost Mode ON: Transparent HUD. Tap or click anywhere on it to wake up!"
          : "Ghost Mode OFF: Normal visibility restored", st.ghost ? 3000 : 2000);
        persist(); draw();
      }
      async function buyTheme(id) {
        if (!has(SS_THEMES, id)) return;
        var t = SS_THEMES[id];
        if (st.unlocked.indexOf(id) >= 0) {
          st.activeTheme = id;
          EC.store.set("study_active_theme", id);
          toast("Equipped " + t.name + "!");
        } else {
          var balance = EC.points();
          if (balance < t.price) {
            toast("Need " + (t.price - balance) + " more GIS Points to unlock this theme!");
            return;
          }
          if (!await EC.spendPoints(t.price, "Study space theme", function () {
            var owned = EC.store.get("study_themes", st.unlocked);
            return owned.indexOf(id) === -1 && {study_themes: owned.concat(id), study_active_theme: id};
          })) return;
          st.unlocked = EC.store.get("study_themes", st.unlocked);
          st.activeTheme = id;
          toast("Unlocked and equipped " + t.name + "! 🎉");
        }
        persist(); draw();
      }
      function toggleSound(id) {
        var track = ssTrack(id);
        if (!track) return;
        if (ssAudio.active[id]) ssAudio.stop(id);
        else ssAudio.start(track, st.volume);
        draw();
      }
      function toggleAllSounds() {
        if (ssAudio.anyActive()) ssAudio.stopAll();
        else ssAudio.start(SS_SOUNDS[0], st.volume);
        draw();
      }
      function setFocus(mins) {
        st.focus = mins; st.custom = String(mins); st.running = false; st.elapsed = 0;
        if (st.mode === "focus") st.timeLeft = mins * 60;
        try { localStorage.setItem("ecbiz_used_custom_timer", "true"); } catch (e) {}
        persist();
        toast("⏱️ Focus session set to " + mins + " minutes!");
        if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
        /* Update the visible digits immediately — otherwise a paused timer
           looks frozen and the presets appear to do nothing. */
        draw();
        refreshTick();
      }
      function switchMode(mode) {
        st.running = false; st.elapsed = 0; st.mode = mode;
        st.timeLeft = (mode === "focus" ? st.focus : st.breakMins) * 60;
        st.toast = "";
        if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
        draw();
      }
      function tick() {
        if (!document.body.contains(root)) { cleanup(); return; }
        if (!st.running || st.timeLeft <= 0) return;
        st.timeLeft--;
        if (st.mode === "focus") {
          st.elapsed++;
        }
        if (st.timeLeft <= 0) {
          st.running = false;
          if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
          if (st.mode === "focus") {
            if (st.elapsed >= 15 * 60) {
              var day = new Date().toISOString().slice(0, 10);
              EC.earnPoints(10, "Focus session completed", "focus:" + day).then(function (awarded) {
                if (awarded) toast("+10 GIS Points for focused study!");
              });
            }
            st.sessions++;
            st.streak++;
            /* Keep the original key AND the current key in sync, and emit
             * both legacy (count) and current (sessions) event payload fields. */
            EC.store.set("completed_focus_sessions", st.sessions);
            EC.store.set("studySessions", st.sessions);
            try {
              window.dispatchEvent(new CustomEvent("ecbiz_focus_session_done", {
                detail: { count: st.sessions, sessions: st.sessions }
              }));
            } catch (e) {}
            persist();
            toast("🎉 Focus session complete! Streak increased to " + st.streak + "!");
            st.mode = "break"; st.timeLeft = st.breakMins * 60;
          } else {
            toast("Break finished! Ready to dive back into study?");
            st.mode = "focus"; st.timeLeft = st.focus * 60;
          }
          st.elapsed = 0; persist(); draw(); return;
        }
        refreshTick();
      }
      function ensureTimer() { if (ssTimer === null) ssTimer = setInterval(tick, 1000); }
      var cleaned = false;
      function cleanup() {
        if (cleaned) return;
        cleaned = true;
        if (ssCleanupFn === cleanup) ssCleanupFn = null;
        if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
        if (ssWatch !== null) { clearInterval(ssWatch); ssWatch = null; }
        if (ssToastTimer !== null) { clearTimeout(ssToastTimer); ssToastTimer = null; }
        ssAudio.stopAll();
        window.removeEventListener("resize", onResize);
      }
      ssWatch = setInterval(function () { if (!document.body.contains(root)) cleanup(); }, 1500);

      area.addEventListener("click", function (event) {
        var widget = area.querySelector("#ms-ss-widget");
        if (st.ghost && widget && widget.contains && widget.contains(event.target)) { wake(); return; }
        var btn = actionNode(area, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act"), id = btn.getAttribute("data-id");
        if (act === "startpause") {
          if (!st.running) ensureTimer();
          st.running = !st.running; st.toast = ""; draw();
        } else if (act === "reset") {
          st.running = false; st.elapsed = 0;
          st.timeLeft = (st.mode === "focus" ? st.focus : st.breakMins) * 60;
          st.toast = "";
          if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
          draw();
        } else if (act === "mode") {
          switchMode(btn.getAttribute("data-mode"));
        } else if (act === "add") {
          var extra = parseInt(btn.getAttribute("data-mins"), 10) || 0;
          st.timeLeft += extra * 60;
          toast("Added +" + extra + "m to timer");
          refreshTick();
        } else if (act === "preset") {
          setFocus(parseInt(btn.getAttribute("data-mins"), 10) || st.focus);
        } else if (act === "set-custom") {
          var input = area.querySelector("#ms-ss-custom");
          var raw = input ? input.value : st.custom, parsed = parseInt(raw, 10);
          if (!isFinite(parsed) || parsed < 1 || parsed > 180) {
            toast("Please enter a valid duration between 1 and 180 minutes.");
          } else setFocus(parsed);
        } else if (act === "sound") {
          toggleSound(id);
        } else if (act === "sound-all") {
          toggleAllSounds();
        } else if (act === "ghost") {
          toggleGhost();
        } else if (act === "shop") {
          st.storeOpen = true; draw();
        } else if (act === "closeshop") {
          st.storeOpen = false; draw();
        } else if (act === "mixer") {
          st.mixerOpen = !st.mixerOpen; draw();
        } else if (act === "closemixer") {
          st.mixerOpen = false; draw();
        } else if (act === "buytheme") {
          buyTheme(id);
        } else if (act === "achievements") {
          EC.navigate("achievements");
        } else if (act === "mini-compact") {
          st.mini = "compact"; persist();
          toast("Switched to Card view", 1500);
          clampPos(); draw();
        } else if (act === "mini-micro") {
          st.mini = "micro"; persist();
          toast("Shrunk to Micro Pill capsule", 1500);
          clampPos(); draw();
        } else if (act === "shrink" || act === "expand") {
          st.expanded = act === "expand"; st.toast = ""; draw();
        } else if (act === "close-widget") {
          if (event.stopPropagation) event.stopPropagation();
          closeWidget();
        }
      });
      area.addEventListener("input", function (event) {
        var target = event.target;
        if (target && (target.getAttribute("data-role") === "volume" || target.getAttribute("data-role") === "master-volume")) {
          st.volume = num(target.value);
          ssAudio.setVolume(st.volume);
          var label = area.querySelector("[data-ss-volume-label]");
          if (label) label.textContent = Math.round(st.volume * 100) + "%";
          var range = area.querySelector('input[data-role="volume"]');
          if (range && range !== target) range.value = st.volume;
        }
        if (target && target.id === "ms-ss-custom") st.custom = target.value;
      });
      area.addEventListener("keydown", function (event) {
        if (event.target && event.target.id === "ms-ss-custom" && (event.key === "Enter" || event.keyCode === 13)) {
          event.preventDefault();
          var parsed = parseInt(st.custom, 10);
          if (!isFinite(parsed) || parsed < 1 || parsed > 180) toast("Please enter a valid duration between 1 and 180 minutes.");
          else setFocus(parsed);
        }
        if (event.key === "Escape" || event.keyCode === 27) {
          if (st.storeOpen) { st.storeOpen = false; draw(); }
          else if (st.mixerOpen) { st.mixerOpen = false; draw(); }
          else if (opts.modal) { closeWidget(); }
        }
      });

      clampPos();
      draw();
      ssCleanupFn = cleanup;
  }

  EC.register("study-space", { title: "Study Space", render: renderStudySpace });

  /* Public global-overlay APIs (app.js can call these instead of routing). */
  EC.openStudySpaceWidget = function () {
    EC.store.set("studyspace_active", true);
    if (!ssOverlayHost) ssOverlayHost = ecGlobalOverlayHost();
    return renderStudySpace(ssOverlayHost, null, { modal: true });
  };
  EC.closeStudySpaceWidget = function () {
    EC.store.set("studyspace_active", false);
    if (typeof ssCleanupFn === "function") { try { ssCleanupFn(); } catch (e) {} ssCleanupFn = null; }
    if (ssTimer !== null) { clearInterval(ssTimer); ssTimer = null; }
    if (ssWatch !== null) { clearInterval(ssWatch); ssWatch = null; }
    if (ssToastTimer !== null) { clearTimeout(ssToastTimer); ssToastTimer = null; }
    ssAudio.stopAll();
    var roots = document.querySelectorAll("#ms-study-space-root");
    for (var i = 0; i < roots.length; i++) {
      if (roots[i].parentNode) roots[i].parentNode.removeChild(roots[i]);
    }
  };
  EC.isStudySpaceActive = function () { return EC.store.get("studyspace_active", false) === true; };


  /* ================================================================= */
  /* achievements — 14 milestones                                       */
  /* ================================================================= */

  var achOverlayNode = null, achOverlayCleanup = null;
  function closeAchievementsOverlay() {
    if (typeof achOverlayCleanup === "function") { try { achOverlayCleanup(); } catch (e) {} achOverlayCleanup = null; }
    if (achOverlayNode && achOverlayNode.parentNode) achOverlayNode.parentNode.removeChild(achOverlayNode);
    achOverlayNode = null;
    ecUnlockBodyScroll();
  }

  function renderAchievements(main, opts) {
      opts = opts || {};
      var container = main;
      if (opts.modal) {
        closeAchievementsOverlay();
        container = document.createElement("div");
        container.className = "fixed inset-0 z-[115] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md";
        main.appendChild(container);
        achOverlayNode = container;
      }
      var root = rootFor(container, opts.modal ? "w-full" :
        "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md");
      if (!opts.modal) {
        root.setAttribute("role", "dialog");
        root.setAttribute("aria-modal", "true");
        root.setAttribute("aria-labelledby", "achievements-modal-title");
      }
      root.innerHTML =
        '<div class="bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-3xl ' +
        'w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-[#1C1917] dark:text-neutral-100">' +
          '<div class="' + CLS.achHeader + '"><div class="flex items-center gap-3">' +
            '<div class="' + CLS.achIconBox + '">' + ic("trophy", 20) + '</div>' +
            '<div><div class="flex items-center gap-2 flex-wrap">' +
              '<h1 id="achievements-modal-title" class="' + CLS.achTitle + '">Achievements &amp; Milestones</h1>' +
              '<span id="ms-ach-ready-badge"></span></div>' +
              '<p class="' + CLS.achTitleSub + '">Accomplish study targets to claim bonus GIS Points for cosmetics &amp; themes.</p></div></div>' +
            '<div class="flex items-center gap-3">' +
              '<div class="' + CLS.achCoins + '"><span>✦</span><span id="ms-ach-coins">' + h(EC.points()) + '</span>' +
                '<span class="text-[10px] text-amber-600/70 hidden sm:inline">GIS Points</span></div>' +
              '<button type="button" class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer" data-act="close" title="Close Achievements" aria-label="Close Achievements">' +
                ic("x", 20) + '</button></div></div>' +
          '<div id="ms-ach-toast"></div>' +
          '<div class="' + CLS.achFilterBar + '">' +
            '<div class="' + CLS.achFilters + '" id="ms-ach-filters"></div>' +
            '<div id="ms-ach-claimall"></div></div>' +
          '<div id="ms-ach-body" class="' + CLS.achList + '"></div>' +
          '<div class="' + CLS.achFooter + '">' +
            '<div>Total Unlocked: <span class="font-bold text-[#0F2042] dark:text-white"><span id="ms-ach-count">14</span> / <span id="ms-ach-total">14</span></span></div>' +
            '<button type="button" class="' + CLS.achDone + '" data-act="close">Done</button></div>' +
        '</div>';
      var panel = root.firstChild;
      var body = root.querySelector("#ms-ach-body");
      var filters = root.querySelector("#ms-ach-filters");
      var claimAllBox = root.querySelector("#ms-ach-claimall");
      var toastBox = root.querySelector("#ms-ach-toast");
      var coinNode = root.querySelector("#ms-ach-coins");
      var readyBadge = root.querySelector("#ms-ach-ready-badge");
      var st = { filter: "all", defs: [], claimed: [], toast: null };
      var toastTimer = null;

      function close() {
        if (toastTimer !== null) clearTimeout(toastTimer);
        if (opts.modal) closeAchievementsOverlay();
        else EC.navigate("overview");
      }
      function submissions() {
        var list = readStoreArray("submissions");
        if (list.length) return list;
        var keys = EC.store.keys ? EC.store.keys() : [], i;
        for (i = 0; i < keys.length && list.length < 100; i++) {
          var val = EC.store.get(keys[i], null);
          if (!isArray(val)) continue;
          val.forEach(function (item) {
            if (item && typeof item === "object" &&
                (item.result || item.totalScore != null || item.aoBreakdown)) list.push(item);
          });
        }
        return list;
      }
      function definitions() {
        var subs = submissions(), rated = readStoreObject("subpoint_ratings_v2");
        var ratedCount = Object.keys(rated).length;
        var custom = EC.store.get("avatar_customization", null);
        var styled = !!(custom && (isArray(custom.unlockedItems) && custom.unlockedItems.length > 6 ||
          custom.hairId !== "hair-1" || custom.topId !== "top-1" ||
          custom.bottomId !== "bot-1" || custom.shoeId !== "shoe-1"));
        var mastered = readStoreArray("glossaryMastered").length + readStoreArray("mastered_terms").length;
        var highest = 0, ao2 = false;
        subs.forEach(function (s) {
          var r = (s && s.result && typeof s.result === "object") ? s.result : s;
          if (!r || typeof r !== "object") return;
          var pct = num(r.percentage);
          if (!pct && num(r.maxMarks) > 0) pct = Math.round(num(r.totalScore) / num(r.maxMarks) * 100);
          if (pct > highest) highest = pct;
          var ao = r.aoBreakdown || s.aoBreakdown || {};
          if ((ao.ao2 && num(ao.ao2.score) > 0) ||
              (r.ruleEnforcement && r.ruleEnforcement.appWordsPassed)) ao2 = true;
        });
        var focusSessions = Math.max(0, num(EC.store.get("completed_focus_sessions", 0)));
        var customTimer = EC.store.get("used_custom_timer", false) === true;
        var boss = Math.max(0, num(EC.store.get("boss_battles_count", 0)));
        function def(id, title, desc, category, reward, icon, req, current) {
          return { id: id, title: title, desc: desc, category: category, reward: reward,
                   icon: icon, req: req, current: Math.max(0, Math.min(req, Math.floor(num(current)))) };
        }
        return [
          def("first_submission", "First Exam Step", "Submit your first Cambridge Paper 1 or Paper 2 question response.", "exam", 5, "✍️", 1, subs.length),
          def("ao2_keyword_scan", "Context Champion", "Incorporate authentic case study facts to satisfy the strict AO2 application rules.", "exam", 5, "🎯", 1, ao2 ? 1 : 0),
          def("merit_scholar_70", "Merit Scholar", "Score 70% or higher on any Cambridge examination question response.", "exam", 10, "🏅", 70, highest),
          def("distinction_full_marks", "Distinction Mastery", "Achieve a perfect 100% full-marks score on any assessment question.", "exam", 15, "🌟", 100, highest),
          def("submissions_5", "Dedicated Candidate", "Complete 5 or more total question submissions across the revision studio.", "exam", 10, "📚", 5, subs.length),
          def("submissions_10", "Cambridge Veteran", "Complete 10 or more total verified question responses.", "exam", 15, "🏆", 10, subs.length),
          def("checklist_5", "Syllabus Triage", "Rate 5 syllabus subpoints (Easy, Moderate, Hard) in the 0264 Checklist.", "syllabus", 5, "📋", 5, ratedCount),
          def("checklist_15", "Confidence Auditor", "Rate 15 syllabus subpoints to clearly pinpoint your knowledge gaps.", "syllabus", 10, "🔍", 15, ratedCount),
          def("checklist_25", "Curriculum Cartographer", "Rate 25 syllabus subpoints across Section 1 & Section 2.", "syllabus", 15, "🗺️", 25, ratedCount),
          def("focus_session_done", "Deep Focus Novice", "Complete at least one timed focus session in the Lo-Fi Study Space.", "focus", 5, "🎧", 1, focusSessions),
          def("custom_focus_time", "Tailored Pacing", "Use a custom focus duration (e.g. 12m, 13m, 15m) in Study Space.", "focus", 5, "⏱️", 1, customTimer ? 1 : 0),
          def("boss_battle_init", "Arena Contender", "Enter and fight in the 2D Boss Battle Arena against the Syllabus Overlords.", "combat", 5, "⚔️", 1, boss),
          def("avatar_stylist", "Cambridge Couturier", "Personalise your student avatar with distinct hairstyles, clothing, or skin tones.", "scholar", 5, "🎨", 1, styled ? 1 : 0),
          def("mastered_glossary_5", "Terminology Master", "Mark 5 or more key Cambridge business concepts as mastered in the Glossary.", "scholar", 5, "📖", 5, mastered)
        ];
      }
      function stateOf(d) {
        var done = d.current >= d.req;
        var claimed = st.claimed.indexOf(d.id) >= 0;
        return { done: done, claimed: claimed, claimable: done && !claimed };
      }
      function scheduleToast(ms) {
        if (toastTimer !== null) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          st.toast = null; toastTimer = null;
          toastBox.innerHTML = "";
        }, ms || 3000);
      }
      function award(d) {
        st.claimed.push(d.id);
        EC.store.set("claimed_achievements", st.claimed);
        EC.earnPoints(d.reward, "Achievement: " + d.title, "achievement:" + d.id);
      }
      function claim(id) {
        var d = null, i;
        for (i = 0; i < st.defs.length; i++) if (st.defs[i].id === id) d = st.defs[i];
        if (!d || !stateOf(d).claimable) return;
        award(d);
        confettiBurst({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        st.toast = { title: d.title, coins: d.reward };
        scheduleToast(3000);
        refresh(false);
      }
      function claimAll() {
        var total = 0;
        st.defs.forEach(function (d) { if (stateOf(d).claimable) { award(d); total += d.reward; } });
        if (!total) return;
        confettiBurst({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        st.toast = { title: "All Available Rewards", coins: total };
        scheduleToast(3500);
        refresh(false);
      }
      function drawToast() {
        if (!st.toast) { toastBox.innerHTML = ""; return; }
        toastBox.innerHTML = '<div class="' + CLS.achToast + '"><div class="flex items-center gap-2">' +
          ic("sparkles", 16, "text-emerald-500") +
          '<span>Claimed reward for <strong class="font-bold">' + h(st.toast.title) + '</strong>!</span></div>' +
          '<span class="font-mono font-bold text-amber-600 dark:text-amber-400">+' + h(st.toast.coins) + ' GIS Points ✦</span></div>';
      }
      function draw() {
        coinNode.textContent = EC.points();
        var countNode = root.querySelector("#ms-ach-count");
        if (countNode) countNode.textContent = st.claimed.length;
        var totalNode = root.querySelector("#ms-ach-total");
        if (totalNode) totalNode.textContent = st.defs.length;
        var claimable = st.defs.filter(function (d) { return stateOf(d).claimable; }).length;
        readyBadge.innerHTML = claimable
          ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white animate-pulse">' +
              claimable + ' Ready to Claim!</span>' : "";
        var readyOff = "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20";
        filters.innerHTML = [
          ["all", "All (" + st.defs.length + ")", CLS.achFilterOn],
          ["claimable", "Ready to Claim", "bg-emerald-600 text-white shadow-xs", readyOff],
          ["in_progress", "In Progress", CLS.achFilterOn, CLS.achFilterOff],
          ["claimed", "Claimed (" + st.claimed.length + ")", CLS.achFilterOn, CLS.achFilterOff]
        ].map(function (f) {
          var active = st.filter === f[0];
          return '<button type="button" class="' + CLS.achFilter + ' ' + (active ? f[2] : (f[3] || CLS.achFilterOff)) +
            '" data-act="filter" data-filter="' + f[0] + '">' +
            (f[0] === "claimable" && claimable
              ? '<span>' + h(f[1]) + '</span><span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">' + claimable + '</span>'
              : h(f[1])) + '</button>';
        }).join("");
        claimAllBox.innerHTML = claimable
          ? '<button type="button" class="' + CLS.achClaimAll + '" data-act="claim-all">' + ic("sparkles", 14) +
            '<span>Claim All Rewards (' + claimable + ')</span></button>' : "";
        var list = st.defs.filter(function (d) {
          var s = stateOf(d);
          if (st.filter === "claimable") return s.claimable;
          if (st.filter === "in_progress") return !s.done;
          if (st.filter === "claimed") return s.claimed;
          return true;
        });
        if (!list.length) {
          body.innerHTML = '<div class="' + CLS.achEmpty + '">' + ic("trophy", 40, "mx-auto opacity-30 mb-2") +
            '<p>No achievements match this filter.</p></div>';
          drawToast();
          return;
        }
        body.innerHTML = list.map(function (d) {
          var s = stateOf(d);
          var pct = Math.min(100, Math.round(d.current / d.req * 100));
          var bar = s.claimable ? CLS.achBarReady : (s.claimed ? CLS.achBarClaimed : CLS.achBarFill);
          var card = s.claimable ? CLS.achCardReady : (s.claimed ? CLS.achCardClaimed : CLS.achCardOff);
          var reward = '<span class="' + CLS.achReward + '">+' + d.reward + ' GIS Points</span>';
          var iconBg = s.claimed
            ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
            : s.claimable ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
            : "bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-800";
          var action = s.claimed
            ? '<span class="' + CLS.achClaimed + '">' + ic("check", 14, "text-emerald-500") + '<span>Claimed</span></span>'
            : s.claimable
            ? '<button type="button" class="' + CLS.achClaimBtn + '" data-act="claim" data-id="' + h(d.id) + '">' + ic("sparkles", 14) +
              '<span>Claim +' + d.reward + ' ✦</span></button>'
            : '<span class="' + CLS.achLocked + '">' + ic("lock", 12, "opacity-60") + '<span>' + pct + '% Done</span></span>';
          return '<div class="' + CLS.achCard + ' ' + card + '">' +
            '<div class="' + CLS.achRow + '"><div class="' + CLS.achIcon + ' ' + iconBg + '">' + h(d.icon) + '</div>' +
              '<div class="space-y-1 flex-1"><div class="flex items-center gap-2 flex-wrap">' +
                '<span class="font-bold text-sm text-[#0F2042] dark:text-white font-academic-serif">' + h(d.title) + '</span>' +
                reward + '</div>' +
                '<p class="' + CLS.achDesc + '">' + h(d.desc) + '</p>' +
                '<div class="pt-1.5 flex items-center gap-2.5 max-w-sm">' +
                  '<div class="' + CLS.achBar + '"><div class="' + bar + '" style="width:' + pct + '%"></div></div>' +
                  '<span class="' + CLS.achCount + '">' + d.current + ' / ' + d.req + '</span>' +
                '</div></div></div>' +
            '<div class="shrink-0 self-end sm:self-center">' + action + '</div></div>';
        }).join("");
        drawToast();
      }
      function refresh(recompute) {
        if (recompute !== false) st.defs = definitions();
        st.claimed = readStoreArray("claimed_achievements");
        draw();
      }
      root.addEventListener("click", function (event) {
        if (event.target === root) { close(); return; }
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "close") close();
        else if (act === "filter") { st.filter = btn.getAttribute("data-filter"); draw(); }
        else if (act === "claim") claim(btn.getAttribute("data-id"));
        else if (act === "claim-all") claimAll();
      });
      root.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) close();
      });
      refresh(true);
      if (opts.modal) {
        achOverlayCleanup = ecWireDialog(container, closeAchievementsOverlay, "achievements-modal-title", null);
        ecLockBodyScroll();
        var closeButton = root.querySelector('[aria-label="Close Achievements"]');
        if (closeButton && closeButton.focus) closeButton.focus();
      }
  }

  EC.register("achievements", {
    title: "Achievements",
    render: function (main) { return renderAchievements(main); }
  });

  EC.openAchievementsOverlay = function () {
    if (!achOverlayNode) {
      var host = ecGlobalOverlayHost();
      return renderAchievements(host, { modal: true });
    }
  };
  EC.closeAchievementsOverlay = closeAchievementsOverlay;


  /* ================================================================= */
  /* avatar — Scholar Avatar Studio                                     */
  /* ================================================================= */

  var SKINS = [
    ["skin-1", "Fair Ivory", "#F7D0B3", 0, "", "Classic academic light tone", "", ""],
    ["skin-2", "Warm Peach", "#E8B18A", 0, "", "Warm natural peach tone", "", ""],
    ["skin-3", "Sunlit Olive", "#D19C74", 0, "", "Sun-kissed olive complexion (Free)", "", ""],
    ["skin-4", "Golden Bronze", "#A76E43", 0, "", "Rich golden bronze complexion (Free)", "", ""],
    ["skin-5", "Deep Amber", "#7B4B27", 0, "", "Deep radiant amber tone (Free)", "", ""],
    ["skin-6", "Espresso", "#4B2810", 0, "", "Deep polished espresso tone (Free)", "", ""],
    ["skin-7", "Cyberpunk Azure", "#38BDF8", 150, "", "Synthetic blue holographic android tone", "", ""],
    ["skin-8", "Celestial Gold", "#FDE047", 320, "", "Legendary gilded valedictorian complexion", "", ""],
    ["skin-9", "Void Onyx", "#0F0A1E", 320, "", "Legendary deep cosmic void complexion", "", ""]
  ];
  /* [id, name, colour, cost, icon, description, rarity, secondaryColour] —
     rarity and secondary colours come straight from the source data. */
  function cosmetic(id, name, color, cost, icon, desc, rarity, secondary) {
    return [id, name, color, cost, icon, desc, rarity || "", secondary || ""];
  }
  var HAIRS = [
    cosmetic("hair-1", "Scholar Side-Part", "#2B2118", 0, "🧑‍🎓", "Neat, classic side part for exam focus", "common"),
    cosmetic("hair-2", "Academic Neat Crop", "#171717", 20, "💇", "Short tapered crop with sharp edges", "common"),
    cosmetic("hair-3", "Messy Revision Curls", "#451A03", 40, "👨‍🦱", "Voluminous wild curls from late-night cramming", "rare"),
    cosmetic("hair-4", "Modern Textured Quiff", "#3B2219", 60, "✨", "Upswept brushed-back modern styling", "rare"),
    cosmetic("hair-5", "Sleek High Ponytail", "#1C1917", 85, "👱‍♀️", "High ponytail tied with an exam ribbon", "rare"),
    cosmetic("hair-6", "Curly High-Top Fade", "#0A0A0A", 110, "💈", "Crisp gradient fade with tight coils", "epic"),
    cosmetic("hair-7", "Spiky Anime Protagonist", "#DC2626", 145, "🔥", "Fiery red spikes ready to conquer the syllabus", "epic"),
    cosmetic("hair-8", "Regal Braided Crown", "#78350F", 180, "👑", "Intricately woven braids wrapped over crown", "epic"),
    cosmetic("hair-9", "Platinum Valedictorian", "#F1F5F9", 250, "⚡", "Striking silver-platinum flowing locks", "legendary"),
    cosmetic("hair-10", "Cyber Matrix Mohawk", "#06B6D4", 350, "🤖", "Glowing neon cyan holographic mohawk", "legendary"),
    cosmetic("hair-11", "Crimson Comet Side-Sweep", "#B91C1C", 420, "☄️", "Blazing crimson side-swept fringe", "epic"),
    cosmetic("hair-12", "Examiner's Silver Sweep", "#E2E8F0", 460, "📏", "Polished silver sweep of a master examiner", "epic"),
    cosmetic("hair-13", "Chairman's Platinum Wave", "#CBD5E1", 520, "🌊", "Flowing platinum waves of a boardroom legend", "legendary", "#FDE047"),
    cosmetic("hair-14", "Obsidian Twilight Perm", "#2E1065", 580, "🌙", "Deep violet twilight curls from late-night study", "legendary", "#A78BFA"),
    cosmetic("hair-15", "Quantum Gradient Fade", "#22D3EE", 650, "⚛️", "Holographic cyan fade that shifts hue", "legendary")
  ];
  var TOPS = [
    cosmetic("top-1", "Candidate Basic Tee", "#F8FAFC", 0, "👕", "Clean white combed cotton exam tee", "common", "#CBD5E1"),
    cosmetic("top-2", "Cambridge Navy Blazer", "#0F2042", 25, "🧥", "Formal navy wool blazer with gold brass buttons", "common", "#F59E0B"),
    cosmetic("top-3", "Oxford Burgundy Knit Vest", "#881337", 45, "👔", "Scholastic cable-knit sweater vest over collar", "rare", "#FDE68A"),
    cosmetic("top-4", "Campus Varsity Bomber", "#047857", 70, "⚾", "Emerald green wool jacket with leather sleeves", "rare", "#FEF08A"),
    cosmetic("top-5", "Pinstripe Business Shirt", "#0284C7", 95, "💼", "Sharp tailored sky-blue pinstripe executive shirt", "rare", "#FFFFFF"),
    cosmetic("top-6", "Vintage Scholar Trench", "#78350F", 130, "🧥", "Distressed amber-brown leather scholar coat", "epic", "#451A03"),
    cosmetic("top-7", "Study Space Lo-Fi Hoodie", "#7C3AED", 170, "🎧", "Plush oversized lavender hoodie with lo-fi badge", "epic", "#C4B5FD"),
    cosmetic("top-8", "Wall Street Silk Waistcoat", "#1E293B", 220, "📈", "Charcoal damask vest with antique gold pocket chain", "epic", "#FBBF24"),
    cosmetic("top-9", "Royal Valedictorian Robe", "#991B1B", 320, "🎓", "Crimson ceremonial velvet robe with gold satin trim", "legendary", "#FDE047"),
    cosmetic("top-10", "Quantum Cyber Carbon Plate", "#06B6D4", 480, "🛡️", "Glowing reactive nanofiber chest armor with neon lights", "legendary", "#A855F7")
  ];
  var BOTTOMS = [
    cosmetic("bot-1", "Standard Exam Trousers", "#334155", 0, "👖", "Ironed charcoal grey school slacks", "common"),
    cosmetic("bot-2", "Navy Pleated Chinos", "#1E293B", 20, "👖", "Tailored slim-fit midnight navy chinos", "common"),
    cosmetic("bot-3", "Campus Denim Jeans", "#2563EB", 40, "👖", "Washed indigo durable university denim", "rare"),
    cosmetic("bot-4", "Sand Khaki Slacks", "#D97706", 60, "👖", "Breathable tailored sand-beige summer trousers", "rare"),
    cosmetic("bot-5", "Highland Academic Plaid", "#991B1B", 85, "🏴", "Crisp red and black woven tartan check trousers", "rare", "#1E293B"),
    cosmetic("bot-6", "Athletic Striped Trackpants", "#0F172A", 115, "🏃", "Matte black runners with dual speed stripes", "epic", "#38BDF8"),
    cosmetic("bot-7", "Olive Field Cargo Pants", "#3F6212", 150, "🪖", "Tactical pocketed cargo pants with brass clasps", "epic"),
    cosmetic("bot-8", "Retro High-Waist Trousers", "#78350F", 200, "🕰️", "1950s scholastic wide-leg camel wool trousers", "epic"),
    cosmetic("bot-9", "Tuxedo Satin-Stripe Slacks", "#020617", 280, "🤵", "Midnight black formal trousers with silk side-braid", "legendary", "#E2E8F0"),
    cosmetic("bot-10", "Cyber Neon Matrix Joggers", "#0369A1", 420, "⚡", "Matte graphite techwear with pulsating neon piping", "legendary", "#06B6D4")
  ];
  var SHOES = [
    cosmetic("shoe-1", "Black Polish Loafers", "#1E293B", 0, "👞", "Standard issue shiny black school shoes", "common"),
    cosmetic("shoe-2", "Clean White Court Sneakers", "#F8FAFC", 20, "👟", "Minimalist leather white casual sneakers", "common"),
    cosmetic("shoe-3", "Tan Leather Oxford Brogues", "#B45309", 40, "👞", "Perforated burnished cognac leather brogues", "rare"),
    cosmetic("shoe-4", "High-Top Retro Sneakers", "#DC2626", 65, "🏀", "Iconic red, white & black basketball high-tops", "rare", "#111827"),
    cosmetic("shoe-5", "Black Chelsea Boots", "#09090B", 90, "🥾", "Sleek elastic-sided polished urban boots", "rare"),
    cosmetic("shoe-6", "Chunky Platform Runners", "#E2E8F0", 125, "👟", "Max-cushion streetwear platform sneakers", "epic", "#3B82F6"),
    cosmetic("shoe-7", "Cordovan Wine Derbies", "#4C0519", 165, "👞", "Deep burgundy high-shine formal calfskin shoes", "epic"),
    cosmetic("shoe-8", "Royal Gold Wingtip Slippers", "#CA8A04", 230, "✨", "Gold thread embroidered velvet ceremonial loafers", "epic", "#FEF08A"),
    cosmetic("shoe-9", "Anti-Gravity Hover-Jets", "#0284C7", 340, "🚀", "Magnetic levitation boots that float 2 inches up", "legendary", "#38BDF8"),
    cosmetic("shoe-10", "Mythic Diamond Striders", "#38BDF8", 500, "💎", "Custom diamond-encrusted soles that leave sparkle trails", "legendary", "#F0FDFA")
  ];
  var AV_DEFAULT = {
    skinToneId: "skin-1", hairId: "hair-1", topId: "top-1", bottomId: "bot-1", shoeId: "shoe-1",
    unlockedItems: ["skin-1", "skin-2", "skin-3", "skin-4", "skin-5", "skin-6", "hair-1", "top-1", "bot-1", "shoe-1"]
  };

  /* Lazily enrich the fallback wardrobes from the authoritative JSON files.
     Each load is isolated so a missing file simply keeps the built-in list. */
  var avatarDataPromise = null;
  function loadAvatarData() {
    if (avatarDataPromise) return avatarDataPromise;
    function safe(name) {
      var p = null;
      try { p = EC.load(name); } catch (e) { p = null; }
      if (!p || !p.then) return Promise.resolve([]);
      return p.then(function (v) { return isArray(v) ? v : []; }, function () { return []; });
    }
    avatarDataPromise = Promise.all([
      safe("skin-tones"), safe("hair-designs"), safe("top-designs"),
      safe("bottom-designs"), safe("shoe-designs")
    ]).then(function (sets) {
      function rows(list, skin) {
        var out = [];
        (list || []).forEach(function (r) {
          if (!r || !r.id) return;
          out.push(skin
            ? [String(r.id), String(r.name || ""), String(r.color || "#888888"), num(r.cost), "", String(r.description || ""), "", ""]
            : [String(r.id), String(r.name || ""), String(r.previewColor || "#888888"), num(r.cost),
               String(r.icon || ""), String(r.description || ""), String(r.rarity || ""), String(r.secondaryColor || "")]);
        });
        return out;
      }
      var loaded = {
        skin: rows(sets[0], true), hair: rows(sets[1]), top: rows(sets[2]),
        bottom: rows(sets[3]), shoe: rows(sets[4])
      };
      if (loaded.skin.length) SKINS = loaded.skin;
      if (loaded.hair.length) HAIRS = loaded.hair;
      if (loaded.top.length) TOPS = loaded.top;
      if (loaded.bottom.length) BOTTOMS = loaded.bottom;
      if (loaded.shoe.length) SHOES = loaded.shoe;
      return loaded;
    });
    return avatarDataPromise;
  }

  /* Each hairstyle has its own silhouette; previously every style shared one
     cap, so ponytails and braids were invisible. Geometry mirrors the original. */
  function avatarHair(id, color) {
    var cap = '<path d="M 58 36 C 58 16, 102 16, 102 36 C 102 24, 94 20, 80 20 C 66 20, 58 24, 58 36 Z" fill="' + h(color) + '"/>';
    switch (id) {
      case "hair-2":
        return cap + '<path d="M 61 33 Q 80 24 99 33 L 97 29 Q 80 22 63 29 Z" fill="' + h(color) + '"/>';
      case "hair-3":
        return '<path d="M 56 34 C 52 16 68 9 80 13 C 92 7 108 14 104 34 Z" fill="' + h(color) + '"/>' +
          '<circle cx="61" cy="23" r="6" fill="' + h(color) + '"/><circle cx="73" cy="16" r="6.5" fill="' + h(color) + '"/>' +
          '<circle cx="87" cy="15" r="6.5" fill="' + h(color) + '"/><circle cx="99" cy="24" r="6" fill="' + h(color) + '"/>';
      case "hair-4":
        return cap + '<path d="M 59 30 C 64 13 87 7 101 22 C 96 15 78 14 70 21 C 66 25 62 27 59 30 Z" fill="' + h(color) + '"/>';
      case "hair-5":
        return '<path d="M 97 29 C 114 29 122 45 116 61 C 112 72 105 80 99 87 C 110 72 109 55 100 44 Z" fill="' + h(color) + '"/>' +
          cap + '<path d="M 58 30 Q 70 20 86 28 Q 72 24 58 34 Z" fill="' + h(color) + '"/>' +
          '<ellipse cx="99" cy="31" rx="4.5" ry="3" fill="#BE123C"/>';
      case "hair-6":
        return cap + '<path d="M 62 19 Q 80 1 98 19 L 96 27 Q 80 13 64 27 Z" fill="' + h(color) + '"/>' +
          '<circle cx="68" cy="18" r="4" fill="' + h(color) + '"/><circle cx="80" cy="12" r="4.5" fill="' + h(color) + '"/>' +
          '<circle cx="92" cy="18" r="4" fill="' + h(color) + '"/>';
      case "hair-7":
        return cap + '<path d="M 59 24 L 65 7 L 70 20 L 77 3 L 82 20 L 90 5 L 94 21 L 101 11 L 101 29 Z" fill="' + h(color) + '"/>';
      case "hair-8":
        return cap + '<path d="M 58 32 Q 59 17 72 13 Q 82 9 92 15 Q 102 19 102 32" stroke="' + h(color) +
          '" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-dasharray="2 5"/>';
      case "hair-9":
        return '<path d="M 56 34 C 51 17 66 7 80 9 C 94 7 109 17 104 34 L 107 68 C 99 58 100 44 98 36 L 62 36 C 60 44 61 58 53 68 Z" fill="' + h(color) + '"/>' + cap;
      case "hair-10":
        return cap + '<path d="M 71 21 C 73 3 87 3 89 21 Z" fill="' + h(color) + '"/>' +
          '<path d="M 75 15 L 80 1 L 85 15 Z" fill="' + h(color) + '"/>';
      case "hair-11":
        return cap + '<path d="M 56 33 Q 64 16 88 19 Q 102 22 102 33 Q 84 25 56 37 Z" fill="' + h(color) + '"/>';
      case "hair-12":
        return '<path d="M 58 32 L 57 20 Q 80 11 102 20 L 101 32 Q 80 25 58 32 Z" fill="' + h(color) + '"/>' +
          '<path d="M 57 28 Q 80 18 102 28 L 101 33 Q 80 24 58 33 Z" fill="' + h(color) + '"/>';
      case "hair-13":
        return cap + '<path d="M 56 34 Q 62 14 76 17 Q 70 8 86 12 Q 82 6 96 13 Q 106 17 103 33 Q 92 22 80 24 Q 66 24 56 34 Z" fill="' + h(color) + '"/>';
      case "hair-14":
        return '<circle cx="60" cy="26" r="6" fill="' + h(color) + '"/><circle cx="71" cy="17" r="7" fill="' + h(color) + '"/>' +
          '<circle cx="84" cy="15" r="7.5" fill="' + h(color) + '"/><circle cx="96" cy="18" r="6.5" fill="' + h(color) + '"/>' +
          '<circle cx="103" cy="27" r="5.5" fill="' + h(color) + '"/>' + cap;
      case "hair-15":
        return cap + '<rect x="59" y="7" width="42" height="14" rx="3.5" fill="' + h(color) + '"/>' +
          '<rect x="63" y="4" width="34" height="5" rx="2.5" fill="' + h(color) + '" opacity="0.75"/>';
      default:
        return cap + '<path d="M 58 30 Q 70 20 86 28 Q 72 24 58 34 Z" fill="' + h(color) + '"/>';
    }
  }

  var avatarModalCleanup = null, avatarHost = null;
  function renderAvatar(main, opts) {
      opts = opts || {};
      var host = main;
      if (opts.modal) {
        if (typeof avatarModalCleanup === "function") { try { avatarModalCleanup(); } catch (e) {} avatarModalCleanup = null; }
        host = document.createElement("div");
        host.className = "fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md";
        host.setAttribute("role", "dialog");
        host.setAttribute("aria-modal", "true");
        host.setAttribute("aria-labelledby", "avatar-modal-title");
        main.appendChild(host);
      }
      var root = rootFor(host,
        "mx-auto my-4 w-full max-w-5xl rounded-3xl border border-neutral-200 dark:border-neutral-800 " +
        "bg-white dark:bg-neutral-900 shadow-2xl text-neutral-900 dark:text-neutral-100 flex flex-col overflow-hidden");
      var saved = EC.store.get("avatar_customization", null);
      var st = {
        custom: {
          skinToneId: saved && saved.skinToneId || AV_DEFAULT.skinToneId,
          hairId: saved && saved.hairId || AV_DEFAULT.hairId,
          topId: saved && saved.topId || AV_DEFAULT.topId,
          bottomId: saved && saved.bottomId || AV_DEFAULT.bottomId,
          shoeId: saved && saved.shoeId || AV_DEFAULT.shoeId,
          unlockedItems: (saved && isArray(saved.unlockedItems) ? saved.unlockedItems : AV_DEFAULT.unlockedItems).slice()
        },
        category: "skin", toast: "", toastTimer: null
      };
      var cats = [];
      function rebuildCats() {
        cats = [
          ["skin", "🎨 Skin Tones", SKINS], ["hair", "💇 Hairstyles (" + HAIRS.length + ")", HAIRS],
          ["top", "👕 Clothing / Tops (" + TOPS.length + ")", TOPS],
          ["bottom", "👖 Pants / Bottoms (" + BOTTOMS.length + ")", BOTTOMS],
          ["shoe", "👟 Shoes (" + SHOES.length + ")", SHOES]
        ];
      }
      rebuildCats();
      function listFor(cat) { for (var i = 0; i < cats.length; i++) if (cats[i][0] === cat) return cats[i][2]; return []; }
      function byId(list, id) {
        for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i];
        return list[0];
      }
      function unlocked(item) { return item[3] === 0 || st.custom.unlockedItems.indexOf(item[0]) >= 0; }
      function equippedId(cat) {
        return st.custom[{ skin: "skinToneId", hair: "hairId", top: "topId", bottom: "bottomId", shoe: "shoeId" }[cat]];
      }
      function save() { EC.store.set("avatar_customization", st.custom); }
      function avatarSvg() {
        var skin = byId(SKINS, st.custom.skinToneId), hair = byId(HAIRS, st.custom.hairId);
        var top = byId(TOPS, st.custom.topId), bottom = byId(BOTTOMS, st.custom.bottomId);
        var shoe = byId(SHOES, st.custom.shoeId);
        var s = h(skin[2]), t = h(top[2]), b = h(bottom[2]), sh = h(shoe[2]), hr = h(hair[2]);
        var html = '<svg viewBox="0 0 160 220" role="img" aria-label="Avatar preview">' +
          '<ellipse cx="80" cy="210" rx="45" ry="8" fill="rgba(0,0,0,0.18)"/>' +
          '<rect x="58" y="115" width="18" height="75" rx="4" fill="' + b + '"/>' +
          '<rect x="84" y="115" width="18" height="75" rx="4" fill="' + b + '"/>';
        if (bottom[7]) {
          html += '<line x1="58" y1="120" x2="58" y2="185" stroke="' + h(bottom[7]) + '" stroke-width="2"/>' +
            '<line x1="102" y1="120" x2="102" y2="185" stroke="' + h(bottom[7]) + '" stroke-width="2"/>';
        }
        html += '<ellipse cx="64" cy="193" rx="14" ry="7" fill="' + sh + '"/>' +
          '<ellipse cx="96" cy="193" rx="14" ry="7" fill="' + sh + '"/>';
        if (shoe[7]) {
          html += '<circle cx="64" cy="192" r="3" fill="' + h(shoe[7]) + '"/>' +
            '<circle cx="96" cy="192" r="3" fill="' + h(shoe[7]) + '"/>';
        }
        html += '<rect x="36" y="66" width="12" height="48" rx="5" fill="' + t + '"/>' +
          '<circle cx="42" cy="118" r="6" fill="' + s + '"/>' +
          '<rect x="112" y="66" width="12" height="48" rx="5" fill="' + t + '"/>' +
          '<circle cx="118" cy="118" r="6" fill="' + s + '"/>' +
          '<rect x="48" y="60" width="64" height="60" rx="8" fill="' + t + '"/>';
        if (top[7]) html += '<path d="M 68 60 L 80 85 L 92 60 Z" fill="' + h(top[7]) + '"/>';
        html += '<rect x="48" y="114" width="64" height="6" fill="#18181B"/>' +
          '<rect x="74" y="113" width="12" height="8" rx="1" fill="#EAB308"/>' +
          '<rect x="74" y="50" width="12" height="14" rx="2" fill="' + s + '"/>' +
          '<circle cx="80" cy="38" r="22" fill="' + s + '"/>' +
          '<circle cx="73" cy="36" r="2.5" fill="#1E293B"/><circle cx="87" cy="36" r="2.5" fill="#1E293B"/>' +
          '<path d="M 74 44 Q 80 49 86 44" stroke="#1E293B" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
          avatarHair(hair[0], hair[2]) + '</svg>';
        return html;
      }
      function rarityBadge(rarity) {
        var r = String(rarity || "common").toLowerCase();
        if (r === "legendary") return '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">Legendary</span>';
        if (r === "epic") return '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">Epic</span>';
        if (r === "rare") return '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">Rare</span>';
        return '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Common</span>';
      }
      function itemHtml(item, cat) {
        var eq = equippedId(cat) === item[0], un = unlocked(item), afford = EC.points() >= item[3];
        var isSkin = cat === "skin";
        var action = eq
          ? '<span class="' + CLS.avEquippedLbl + '">' + ic("check", 14) + ' Equipped</span>'
          : un
          ? '<button type="button" class="' + CLS.avEquipBtn + '" data-act="equip" data-cat="' + cat + '" data-id="' + h(item[0]) + '">Equip</button>'
          : '<button type="button" class="' + CLS.avBuyBtn + (afford ? "" : " " + CLS.avBuyOff) + '" data-act="buy" data-cat="' + cat +
            '" data-id="' + h(item[0]) + '"' + (afford ? "" : " disabled") + '>' + ic("lock", 12) +
            '<span>' + (isSkin ? item[3] + " ✦" : "Unlock " + item[3] + " ✦") + '</span></button>';
        var badge = rarityBadge(item[6]);
        var costLine = item[3] === 0 ? (isSkin ? "" : "Starter Default") : (isSkin ? "" : item[3] + " GIS Points");
        return '<div class="' + CLS.avCard + ' ' + (eq ? CLS.avCardOn : CLS.avCardOff) + '"><div>' +
          (isSkin
            ? '<div class="flex items-center gap-3 mb-2"><span class="' + CLS.avSwatch + '" style="background:' + h(item[2]) + '"></span>' +
                '<div class="min-w-0"><div class="' + CLS.avItemName + '"><span>' + h(item[1]) + '</span>' +
                  (item[3] === 0 ? '<span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">FREE</span>' : badge) +
                  '</div><div class="' + CLS.avItemDesc + '">' + h(item[5] || "") + '</div></div></div>'
            : '<div class="flex items-center justify-between mb-1.5"><span class="text-xl">' + (item[4] || "🎁") + '</span>' + badge + '</div>' +
              '<div class="' + CLS.avItemName + '">' + h(item[1]) + '</div>' +
              '<p class="' + CLS.avItemDesc + ' mt-1">' + h(item[5] || "") + '</p>') +
          '</div><div class="' + CLS.avCardFoot + '">' +
            '<span class="' + CLS.avCost + '">' + (item[3] === 0 ? "Free" : (isSkin ? "✦ " + item[3] : "✦ " + item[3])) + '</span>' +
            (costLine ? '<span class="text-[11px] font-mono text-neutral-500 mr-auto">' + costLine + '</span>' : '') +
            action + '</div></div>';
      }
      function draw() {
        var list = listFor(st.category);
        root.innerHTML =
          '<div class="' + CLS.avHeader + '">' +
            '<div class="flex items-center gap-3"><span class="' + CLS.avIcon + '">' + ic("sparkles", 22) + '</span>' +
              '<div><div class="flex items-center gap-2"><h1 id="avatar-modal-title" class="' + CLS.avTitle + '">Scholar Avatar Studio</h1>' +
                '<span class="' + CLS.avTag + '">Customization</span></div>' +
                '<p class="' + CLS.avSub + '">Unlock hairstyle, clothing, slacks, and shoes using study points earned across all questions!</p></div></div>' +
            '<div class="flex items-center gap-3"><div class="' + CLS.avCoins + '"><span>✦</span><span>' + EC.points() + ' GIS Points</span></div>' +
              '<button type="button" class="' + CLS.avRandom + '" data-act="randomize" title="Randomize from unlocked wardrobe">' + ic("wand", 14, "text-indigo-500") +
                '<span class="hidden sm:inline">Randomize</span></button>' +
              '<button type="button" class="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer" data-act="close" aria-label="Close Avatar Studio" title="Close Avatar Studio">' + ic("x", 20) + '</button></div>' +
          '</div>' +
          (st.toast ? '<div role="status" class="mx-6 mt-4 p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold">' + h(st.toast) + '</div>' : '') +
          '<div class="' + CLS.avBody + '">' +
            '<div class="' + CLS.avPreviewCol + '">' +
              '<div class="w-full text-center"><span class="' + CLS.avPreviewLbl + '">Live Avatar Preview</span>' +
                '<h2 class="' + CLS.avPreviewName + '">Cambridge Candidate</h2></div>' +
              '<div class="' + CLS.avStage + '">' + avatarSvg() + '</div>' +
              '<div class="' + CLS.avEquipped + '">' +
                [["Skin:", byId(SKINS, st.custom.skinToneId)[1]], ["Hair:", byId(HAIRS, st.custom.hairId)[1]],
                 ["Top:", byId(TOPS, st.custom.topId)[1]], ["Pants:", byId(BOTTOMS, st.custom.bottomId)[1]],
                 ["Shoes:", byId(SHOES, st.custom.shoeId)[1]]].map(function (row) {
                  return '<div class="' + CLS.avEquippedRow + '"><span class="' + CLS.avEquippedKey + '">' + h(row[0]) + '</span>' +
                    '<span class="' + CLS.avEquippedVal + '">' + h(row[1]) + '</span></div>';
                }).join("") +
              '</div></div>' +
            '<div class="' + CLS.avWardrobe + '">' +
              '<div class="' + CLS.avCats + '">' + cats.map(function (c) {
                return '<button type="button" class="' + CLS.avCat + ' ' + (st.category === c[0] ? CLS.avCatOn : CLS.avCatOff) +
                  '" data-act="cat" data-cat="' + c[0] + '">' + h(c[1]) + '</button>';
              }).join('') + '</div>' +
              '<div class="' + CLS.avCatalog + '"><div class="' + (st.category === "skin" ? CLS.avGridSkin : CLS.avGrid) + '">' +
                list.map(function (item) { return itemHtml(item, st.category); }).join('') +
              '</div></div></div></div>';
      }
      function closeAvatar() {
        if (st.toastTimer !== null) { clearTimeout(st.toastTimer); st.toastTimer = null; }
        if (typeof avatarModalCleanup === "function") { try { avatarModalCleanup(); } catch (e) {} avatarModalCleanup = null; }
        if (opts.modal) {
          if (host.parentNode) host.parentNode.removeChild(host);
        } else {
          EC.navigate("overview");
        }
      }
      if (opts.modal) {
        st.onKey = function (event) {
          if (event.key === "Escape" || event.keyCode === 27) { event.preventDefault(); closeAvatar(); }
        };
        document.addEventListener("keydown", st.onKey);
        avatarModalCleanup = function () {
          document.removeEventListener("keydown", st.onKey);
          if (st.toastTimer !== null) { clearTimeout(st.toastTimer); st.toastTimer = null; }
        };
      }
      function toast(msg) {
        st.toast = msg;
        if (st.toastTimer !== null) clearTimeout(st.toastTimer);
        st.toastTimer = setTimeout(function () {
          st.toast = ""; st.toastTimer = null;
          var node = root.querySelector('[role="status"]');
          if (node && node.parentNode) node.parentNode.removeChild(node);
        }, 3000);
        draw();
      }
      function pick(cat, id) {
        st.custom[{ skin: "skinToneId", hair: "hairId", top: "topId", bottom: "bottomId", shoe: "shoeId" }[cat]] = id;
        save(); toast("Avatar updated!");
      }
      root.addEventListener("click", async function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act"), cat = btn.getAttribute("data-cat"), id = btn.getAttribute("data-id");
        if (act === "cat") { st.category = cat; st.toast = ""; draw(); }
        else if (act === "close") { closeAvatar(); }
        else if (act === "equip") pick(cat, id);
        else if (act === "buy") {
          var item = byId(listFor(cat), id);
          if (!item || unlocked(item)) return;
          if (EC.points() < item[3]) { toast("Need " + (item[3] - EC.points()) + " more GIS Points."); return; }
          if (!await EC.spendPoints(item[3], "Avatar cosmetic", function () {
            var current = EC.store.get("avatar_customization", st.custom) || st.custom;
            var owned = Array.isArray(current.unlockedItems) ? current.unlockedItems : [];
            if (owned.indexOf(id) !== -1) return false;
            var updated = Object.assign({}, current, {unlockedItems: owned.concat(id)});
            updated[{ skin: "skinToneId", hair: "hairId", top: "topId", bottom: "bottomId", shoe: "shoeId" }[cat]] = id;
            return {avatar_customization: updated};
          })) return;
          st.custom = EC.store.get("avatar_customization", st.custom);
          st.toast = "Unlocked and equipped " + item[1] + "!";
          draw();
        } else if (act === "randomize") {
          cats.forEach(function (c) {
            var pool = c[2].filter(unlocked);
            if (!pool.length) return;
            st.custom[{ skin: "skinToneId", hair: "hairId", top: "topId", bottom: "bottomId", shoe: "shoeId" }[c[0]]] =
              pool[Math.floor(Math.random() * pool.length)][0];
          });
          save(); toast("Randomised from your unlocked wardrobe!");
        }
      });
      draw();
      loadAvatarData().then(function () {
        if (!document.body.contains(root)) return;
        rebuildCats();
        draw();
      });
      if (opts.modal) {
        var closeBtn = root.querySelector('[aria-label="Close Avatar Studio"]');
        if (closeBtn && closeBtn.focus) closeBtn.focus();
      }
  }

  EC.register("avatar", { title: "Avatar Studio", render: function (main) { return renderAvatar(main); } });

  /* Global modal API — used by the boss wardrobe and by app.js header. */
  EC.openAvatarCustomizer = function () {
    if (!avatarHost) avatarHost = ecGlobalOverlayHost();
    return renderAvatar(avatarHost, { modal: true });
  };
  EC.closeAvatarCustomizer = function () {
    if (typeof avatarModalCleanup === "function") { try { avatarModalCleanup(); } catch (e) {} avatarModalCleanup = null; }
    if (avatarHost) {
      var dialogs = avatarHost.querySelectorAll('[role="dialog"][aria-labelledby="avatar-modal-title"]');
      for (var i = 0; i < dialogs.length; i++) if (dialogs[i].parentNode) dialogs[i].parentNode.removeChild(dialogs[i]);
    }
  };


  /* ================================================================= */
  /* themes — Daylight / Midnight plus coin-unlocked themes             */
  /* ================================================================= */

  var THEMES = [
    { id: "daylight", name: "Daylight", blurb: "Warm paper and forest green — the original look.", price: 0,
      swatch: ["#f6f4ed", "#203e32", "#f6bb83"], dark: false },
    { id: "midnight", name: "Midnight", blurb: "Low-glare dark mode for late-night revision.", price: 0,
      swatch: ["#0d1613", "#2f6b52", "#f6bb83"], dark: true },
    { id: "sepia", name: "Vintage Scholar", blurb: "Aged paper, dark ink and brass details.", price: 150,
      swatch: ["#f2e7cf", "#4c3a16", "#e9b871"], dark: false },
    { id: "blueprint", name: "Blueprint", blurb: "Cool drafting-table blues and crisp navy ink.", price: 200,
      swatch: ["#eaf2fb", "#174a6b", "#9cc8f5"], dark: false },
    { id: "sakura", name: "Sakura", blurb: "Soft blossom pinks for gentle weekend study.", price: 200,
      swatch: ["#fdf0f4", "#7a2f45", "#f8b7c7"], dark: false }
  ];
  var THEME_VARS = {
    daylight: { "--ec-green": "#203e32", "--ec-green-soft": "#e8f0e9", "--ec-ink": "#1c1917", "--ec-muted": "#57534e", "--ec-line": "#e7e5e4", "--ec-red": "#8b1e1e", "--ec-cream": "#faf9f6" },
    midnight: { "--ec-green": "#2f6b52", "--ec-green-soft": "#152a22", "--ec-ink": "#e8f0eb", "--ec-muted": "#9fb3aa", "--ec-line": "#2b3d35", "--ec-red": "#f87171", "--ec-cream": "#0d1613" },
    sepia: { "--ec-green": "#4c3a16", "--ec-green-soft": "#efe2c4", "--ec-ink": "#372a17", "--ec-muted": "#6a5840", "--ec-line": "#d9c49c", "--ec-red": "#8b1e1e", "--ec-cream": "#f2e7cf" },
    blueprint: { "--ec-green": "#174a6b", "--ec-green-soft": "#e2eefb", "--ec-ink": "#12314a", "--ec-muted": "#4a6580", "--ec-line": "#c4d8ec", "--ec-red": "#b42318", "--ec-cream": "#eaf2fb" },
    sakura: { "--ec-green": "#7a2f45", "--ec-green-soft": "#fbe8f0", "--ec-ink": "#3f1f2a", "--ec-muted": "#7a5561", "--ec-line": "#f0cfd9", "--ec-red": "#9f1239", "--ec-cream": "#fdf0f4" }
  };
  var THEME_INDEX_VARS = {
    daylight: { "--paper": "#f6f4ed", "--card": "#fffefa", "--ink": "#192e28", "--muted": "#4b5c54", "--line": "#d4d9cf", "--green": "#203e32" },
    midnight: { "--paper": "#0d1613", "--card": "#16211c", "--ink": "#e8f0eb", "--muted": "#9fb3aa", "--line": "#2b3d35", "--green": "#2f6b52" },
    sepia: { "--paper": "#f2e7cf", "--card": "#fbf5e6", "--ink": "#372a17", "--muted": "#6a5840", "--line": "#d9c49c", "--green": "#4c3a16" },
    blueprint: { "--paper": "#eaf2fb", "--card": "#f4f9ff", "--ink": "#12314a", "--muted": "#4a6580", "--line": "#c4d8ec", "--green": "#174a6b" },
    sakura: { "--paper": "#fdf0f4", "--card": "#fff8fa", "--ink": "#3f1f2a", "--muted": "#7a5561", "--line": "#f0cfd9", "--green": "#7a2f45" }
  };
  var THEME_KNOWN = ["daylight", "midnight", "sepia", "blueprint", "sakura"];
  function themeById(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i]; return THEMES[0]; }
  function unlockedThemes() {
    var saved = readStoreArray("unlocked_themes");
    var out = ["daylight", "midnight"];
    saved.forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
    return out;
  }
  function applyTheme(id) {
    var theme = themeById(id), html = document.documentElement, group;
    html.setAttribute("data-theme", theme.id);
    if (html.classList) html.classList.toggle("dark", !!theme.dark);
    group = THEME_VARS[theme.id] || {};
    Object.keys(group).forEach(function (key) { html.style.setProperty(key, group[key]); });
    group = THEME_INDEX_VARS[theme.id] || {};
    Object.keys(group).forEach(function (key) { html.style.setProperty(key, group[key]); });
    if ("colorScheme" in html.style) html.style.colorScheme = theme.dark ? "dark" : "light";
    EC.store.set("theme", theme.id);
  }
  function currentThemeId() {
    var id = EC.store.get("theme", "daylight");
    /* Migrate the original theme ids saved by the React app. */
    if (id === "dark" || id === "midnight") id = "midnight";
    else if (id === "light") id = "daylight";
    if (THEME_KNOWN.indexOf(id) === -1) id = "daylight";
    var unlocked = EC.store.get("unlocked_themes", ["daylight", "midnight"]);
    if (!Array.isArray(unlocked)) unlocked = ["daylight", "midnight"];
    if (unlocked.indexOf(id) === -1) id = "daylight";
    return id;
  }
  applyTheme(currentThemeId());
  function themeShopTitle() { return "Theme shop — " + themeById(currentThemeId()).name; }
  async function themePick(id) {
    var theme = themeById(id), unlocked = unlockedThemes();
    if (unlocked.indexOf(id) >= 0) {
      applyTheme(id);
      return { ok: true, msg: theme.name + " theme applied." };
    }
    var balance = EC.points();
    if (balance < theme.price) {
      return { ok: false, msg: "Need " + (theme.price - balance) + " more GIS Points to unlock " + theme.name + "!" };
    }
    if (!await EC.spendPoints(theme.price, "Site theme", function () {
      var list = unlockedThemes();
      return list.indexOf(id) === -1 && {unlocked_themes: list.concat(id), theme: id};
    })) return { ok: false, msg: "Could not buy this theme. Check your GIS Points balance." };
    applyTheme(id);
    return { ok: true, msg: "Unlocked and applied " + theme.name + "! 🎉" };
  }
  function themeMenuHtml(notice, extraClass) {
    var active = currentThemeId(), unlocked = unlockedThemes(), balance = EC.points();
    var items = THEMES.map(function (t) {
      var owned = unlocked.indexOf(t.id) >= 0, isActive = active === t.id, afford = balance >= t.price;
      var priceCls = isActive ? "text-emerald-700 dark:text-emerald-400"
        : owned ? "text-[#78716C] dark:text-neutral-400"
        : afford ? "text-amber-700 dark:text-amber-300" : "text-rose-500 dark:text-rose-400";
      return '<button type="button" role="menuitem" class="' + CLS.themeItem + ' ' +
        (isActive ? CLS.themeItemOn : CLS.themeItemOff) + '" data-act="' + (owned ? "apply" : "buy") +
        '" data-id="' + h(t.id) + '">' +
        '<span class="' + CLS.themeSwatches + '">' + t.swatch.map(function (color) {
          return '<span class="' + CLS.themeSwatch + '" style="background-color:' + h(color) + '"></span>';
        }).join('') + '</span>' +
        '<span class="min-w-0 flex-1"><span class="' + CLS.themeName + '"><span class="truncate">' + h(t.name) + '</span>' +
          ic(t.dark ? "moon" : "sun", 12, "shrink-0 opacity-60") +
          (isActive ? ic("check", 12, "shrink-0 text-emerald-600 dark:text-emerald-400") : '') + '</span>' +
          '<span class="' + CLS.themeBlurb + '">' + h(t.blurb) + '</span></span>' +
        '<span class="' + CLS.themePrice + ' ' + priceCls + '">' +
          (isActive ? "Active" : owned ? "Owned" : "✦ " + t.price) + '</span></button>';
    }).join("");
    return '<div role="menu" class="' + (extraClass || CLS.themeShop) + '">' +
      '<div class="' + CLS.themeShopHead + '"><span class="' + CLS.themeShopLbl + '">Theme shop</span>' +
        '<span class="text-[11px] font-bold text-[#57534E] dark:text-neutral-300">✦ ' + balance + '</span></div>' +
      '<div class="' + CLS.themeList + '">' + items + '</div>' +
      (notice ? '<p role="status" class="px-2 pt-1.5 text-[10px] font-semibold leading-snug text-amber-700 dark:text-amber-300">' + h(notice) + '</p>' : '') +
      '<p class="' + CLS.themeNote + '">Theme unlocks are saved in this browser alongside your progress.</p></div>';
  }

  EC.register("themes", {
    title: "Themes",
    render: function (main) {
      var root = rootFor(main, CLS.page);
      var body = document.createElement("div");
      root.innerHTML =
        '<div class="' + CLS.pageHeading + '"><div>' +
          '<p class="' + CLS.eyebrowBlue + '">Personalise your study space</p>' +
          '<h1 class="' + CLS.title + '">Themes</h1>' +
          '<p class="' + CLS.desc + '">The two base themes are free. Unlock the rest with GIS Points earned from practice. ' +
          'Your choice is saved on this device.</p></div>' +
          '<div class="flex items-center gap-3"><div class="' + CLS.themeCoins + '"><span>✦</span>' +
            '<span id="ms-themes-coins">' + h(EC.points()) + '</span></div></div></div>' +
        '<div id="ms-themes-body" class="mx-auto w-full max-w-md"></div>' +
        '<div id="ms-themes-toast"></div>';
      root.appendChild(body);
      var toastBox = root.querySelector("#ms-themes-toast");
      function draw() {
        var coinNode = root.querySelector("#ms-themes-coins");
        if (coinNode) coinNode.textContent = EC.points();
        body.innerHTML = themeMenuHtml("");
      }
      root.addEventListener("click", async function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var result = await themePick(btn.getAttribute("data-id"));
        var cls = result.ok
          ? "mx-auto w-full max-w-md mt-3 rounded-xl border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] px-3 py-2 text-xs font-semibold text-[var(--green)]"
          : "mx-auto w-full max-w-md mt-3 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300";
        toastBox.innerHTML = '<div role="status" class="' + cls + '">' + h(result.msg) + '</div>';
        draw();
      });
      draw();
    }
  });

  /* In-place theme shop for the site header. app.js can call
     EC.renderThemeShop(host) once after the header is injected; the helper
     replaces the host's contents with a menu button + dropdown and keeps the
     button title in sync via themeShopTitle(). */
  function noop() {}
  EC.renderThemeShop = function (host) {
    var container = typeof host === "string" ? document.querySelector(host) : host;
    if (!container) return { refresh: noop, destroy: noop, title: themeShopTitle };
    if (container._ecThemeShop && typeof container._ecThemeShop.destroy === "function") container._ecThemeShop.destroy();
    var open = false, notice = "", destroyed = false, suppressDocClick = false;
    var utilBtn = "p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 " +
      "hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer";
    var dropdownCls = "absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.75rem)] rounded-2xl " +
      "border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950 shadow-xl p-2 z-50";
    function html() {
      return '<button type="button" aria-haspopup="menu" aria-expanded="' + (open ? "true" : "false") +
        '" class="' + utilBtn + '" title="' + h(themeShopTitle()) + '" data-ec-theme-btn>' + ic("paintbrush", 16) + '</button>' +
        (open ? themeMenuHtml(notice, dropdownCls) : "");
    }
    function draw() { if (!destroyed) container.innerHTML = html(); }
    async function pick(id) {
      var result = await themePick(id);
      notice = result.msg;
      if (result.ok && !/applied/.test(result.msg)) open = false;
      draw();
    }
    function findAttr(node, attr) {
      while (node && node !== container && node.getAttribute) {
        if (node.getAttribute(attr) !== null) return node;
        node = node.parentNode;
      }
      return null;
    }
    function onClick(event) {
      suppressDocClick = true; /* draw() replaces the clicked node; the subsequent
        document listener would otherwise treat it as an outside click. */
      var btn = findAttr(event.target, "data-ec-theme-btn");
      if (btn) { open = !open; notice = ""; draw(); return; }
      btn = findAttr(event.target, "data-id");
      if (btn) {
        var id = btn.getAttribute("data-id");
        if (id) pick(id);
      }
    }
    function onDocClick(event) {
      if (suppressDocClick) { suppressDocClick = false; return; }
      if (open && container && !container.contains(event.target)) { open = false; notice = ""; draw(); }
    }
    function onKey(event) {
      if ((event.key === "Escape" || event.keyCode === 27) && open) { open = false; notice = ""; draw(); }
    }
    var api = {
      refresh: function () { draw(); },
      destroy: function () {
        destroyed = true;
        container.removeEventListener("click", onClick);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKey);
        container._ecThemeShop = null;
      },
      title: themeShopTitle,
      open: function () { open = true; draw(); },
      close: function () { open = false; draw(); }
    };
    container._ecThemeShop = api;
    container.addEventListener("click", onClick);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    draw();
    return api;
  };
  EC.themeShopTitle = themeShopTitle;
  EC.currentThemeId = currentThemeId;
  EC.themeShopMenuHtml = themeMenuHtml;
  EC.themePick = themePick;

  /* Upgrade the existing header control automatically (app.js is not edited).
     Calling EC.renderThemeShop(host) again simply replaces this instance. */
  document.addEventListener("DOMContentLoaded", function () {
    try {
      var host = document.querySelector(".site-theme-control");
      if (host && !host.querySelector("[data-ec-theme-btn]")) EC.renderThemeShop(host);
    } catch (e) {}
  });


  /* ================================================================= */
  /* flashcards — 0264 glossary deck                                    */
  /* ================================================================= */

  EC.register("flashcards", {
    title: "Flashcards",
    render: function (main) {
      var root = rootFor(main, CLS.page);
      var st = { cards: [], idx: clampInt(EC.store.get("flashcardPosition", 0), 0, 100000, 0),
                 flipped: false, mastered: {} };
      var savedMastered = readStoreArray("glossaryMastered");
      savedMastered.forEach(function (id) { st.mastered[String(id)] = true; });
      var deck = document.createElement("div");
      deck.className = CLS.fcWrap;
      root.innerHTML =
        '<div class="' + CLS.pageHeading + '"><div>' +
          '<p class="' + CLS.eyebrowBlue + '">Cambridge IGCSE Business 0264</p>' +
          '<h1 class="' + CLS.title + '">Glossary Flashcards</h1>' +
          '<p class="' + CLS.desc + '">Flip through the full syllabus glossary. Your position is saved automatically, so you can ' +
          'pick up where you left off.</p></div>' +
          '<div class="flex items-center gap-2"><a class="' + CLS.sectionsBtn + ' ' + CLS.sectionsBtnLight +
            '" href="?open=glossary">Full glossary →</a></div></div>' +
        '<div id="ms-fc-deck"></div>';
      root.appendChild(deck);
      var body = root.querySelector("#ms-fc-deck");

      function card() { return st.cards[st.idx]; }
      function draw() {
        if (!st.cards.length) {
          body.innerHTML = '<div class="text-center py-12 text-[#78716C] dark:text-neutral-400">No flashcards available.</div>';
          return;
        }
        if (st.idx < 0) st.idx = 0;
        if (st.idx >= st.cards.length) st.idx = st.cards.length - 1;
        var c = card(), id = String(c.id), mastered = !!st.mastered[id];
        var html = '<div class="space-y-6">' +
          '<div class="' + CLS.fcTop + '">' +
            '<span>Card ' + (st.idx + 1) + ' of ' + st.cards.length + '</span>' +
            '<span>Mastered: ' + (mastered ? "✓" : "—") + '</span></div>' +
          '<div class="' + CLS.fcFlip + '" data-act="flip" role="button" tabindex="0" aria-label="Flip card"><div>' +
            '<div class="' + CLS.fcFlipTop + '"><span class="' + CLS.fcRef + '">' + h(c.syllabusRef) + '</span>' +
              '<span class="' + CLS.fcSide + '">' + (st.flipped ? "Definition Side" : "Term Side · Click to Flip") + '</span></div>';
        if (st.flipped) {
          html += '<div class="' + CLS.fcDef + '">' +
            '<h3 class="' + CLS.fcDefH + '">' + h(c.term) + '</h3>' +
            '<p class="' + CLS.fcDefText + '">' + h(c.definition) + '</p>' +
            (c.formula ? '<div class="' + CLS.fcFormula + '"><strong>Formula:</strong> ' + h(c.formula) + '</div>' : '') +
            (c.exampleContext ? '<div class="' + CLS.fcTip + '"><strong class="' + CLS.fcTipStrong + '">Context:</strong>' +
              h(c.exampleContext) + '</div>' : '') +
            '<div class="' + CLS.fcTip + '"><strong class="' + CLS.fcTipStrong + '">Cambridge Exam Tip:</strong>' +
              h(c.examAdvice) + '</div></div>';
        } else {
          html += '<div class="' + CLS.fcTerm + '"><h2 class="' + CLS.fcTermH + '">' + h(c.term) + '</h2>' +
            '<span class="' + CLS.fcUnit + '">' + h(c.unit) + '</span></div>';
        }
        html += '</div><div class="' + CLS.fcBottom + '">' +
          '<span>Click card to reveal definition</span>' +
          '<button type="button" class="' + CLS.fcMaster + ' ' + (mastered ? CLS.fcMasterOn : CLS.fcMasterOff) +
            '" data-act="master">' + (mastered ? "✓ Mastered" : "+ Mark as Mastered") + '</button>' +
          '</div></div>' +
          '<div class="' + CLS.fcNav + '">' +
            '<button type="button" class="' + CLS.fcPrev + '" data-act="prev"' + (st.idx <= 0 ? ' disabled' : '') + '>← Previous Card</button>' +
            '<button type="button" class="' + CLS.fcFlipBtn + '" data-act="flip">' + (st.flipped ? "Term" : "Flip") + '</button>' +
            '<button type="button" class="' + CLS.fcNext + '" data-act="next"' + (st.idx >= st.cards.length - 1 ? ' disabled' : '') + '>Next Card →</button>' +
          '</div></div>';
        body.innerHTML = html;
      }
      function go(delta) {
        st.idx = Math.max(0, Math.min(st.cards.length - 1, st.idx + delta));
        st.flipped = false;
        EC.store.set("flashcardPosition", st.idx);
        draw();
      }
      function flip() { st.flipped = !st.flipped; draw(); }
      function toggleMastered() {
        var id = String(card().id);
        if (st.mastered[id]) delete st.mastered[id]; else st.mastered[id] = true;
        var arr = Object.keys(st.mastered);
        EC.store.set("glossaryMastered", arr);
        draw();
      }
      root.addEventListener("click", function (event) {
        var btn = actionNode(root, event);
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "flip") flip();
        else if (act === "prev") go(-1);
        else if (act === "next") go(1);
        else if (act === "master") toggleMastered();
      });
      root.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" || event.keyCode === 37) go(-1);
        else if (event.key === "ArrowRight" || event.keyCode === 39) go(1);
        else if (event.key === " " || event.keyCode === 32) { event.preventDefault(); flip(); }
      });
      return EC.load("glossary").then(function (cards) {
        st.cards = isArray(cards) ? cards : [];
        if (st.idx >= st.cards.length) st.idx = 0;
        draw();
      });
    }
  });

  /* ================================================================= */
  /* Section concept diagrams                                           */
  /* Faithful port of FactorsOfProductionDiagram.tsx and                */
  /* SectionConceptDiagram.tsx as a global, Escape-closable overlay.     */
  /* ================================================================= */

  var SD_META = {
    "1": { title: "The 4 Factors of Production & Factor Rewards", icon: "\uD83C\uDFDB\uFE0F",
      subtitle: "Land · Labour · Capital · Enterprise — and the reward each factor earns",
      badge: "Cambridge Syllabus Core 1.1 / Unit 1", tabs: [] },
    "2": { title: "Section 2: People in Business Visuals", icon: "\uD83D\uDC65",
      subtitle: "Maslow's Pyramid, Herzberg's Dual Scale, Tall vs Flat Hierarchy & Delayering",
      badge: "Cambridge 0264 Visual Studio",
      tabs: [{ id: "maslow", label: "\uD83D\uDD3A Maslow Pyramid" }, { id: "herzberg", label: "\u2696\uFE0F Herzberg Two-Factor" }, { id: "org", label: "\uD83C\uDFE2 Org Hierarchy & Delayering" }] },
    "3": { title: "Section 3: Marketing & Strategy Visuals", icon: "\uD83D\uDCE3",
      subtitle: "Product Life Cycle, Extension Strategies, 4Ps Alignment & Boston Matrix",
      badge: "Cambridge 0264 Visual Studio",
      tabs: [{ id: "plc", label: "\uD83D\uDCC8 Product Life Cycle & Extension" }] },
    "4": { title: "Section 4: Operations Management Visuals", icon: "\uD83C\uDFED",
      subtitle: "Interactive Break-Even Simulator, Margin of Safety & Production Methods",
      badge: "Cambridge 0264 Visual Studio",
      tabs: [{ id: "breakeven", label: "\uD83E\uDDEE Break-Even Simulator" }] },
    "5": { title: "Section 5: Finance & Accounts Visuals", icon: "\uD83D\uDCB9",
      subtitle: "Short vs Long-Term Sources of Finance, Gearing & Working Capital",
      badge: "Cambridge 0264 Visual Studio",
      tabs: [{ id: "sources", label: "\uD83D\uDCB0 Sources of Finance Matrix" }] },
    "6": { title: "Section 6: External Influences Visuals", icon: "\uD83C\uDF0D",
      subtitle: "Business Cycle Wave, SPICED vs WPIDEC Exchange Rates & Economic Policies",
      badge: "Cambridge 0264 Visual Studio",
      tabs: [{ id: "cycle", label: "\u3030\uFE0F Business Cycle & SPICED" }] }
  };
  var SD_FACTORS = [
    { title: "Land", reward: "Rent", icon: "\uD83C\uDFDE\uFE0F",
      definition: "All natural resources and gifts of nature available for production without human intervention.",
      examples: "Agricultural land, minerals, water bodies, climate and solar/wind energy sites.",
      tip: "'Land' is NOT just soil — it includes underground minerals, oceans and atmospheric resources. Capital goods are NOT land." },
    { title: "Labour", reward: "Wages & Salaries", icon: "\uD83D\uDC77",
      definition: "The human intellectual, physical and technical effort used to make goods and deliver services.",
      examples: "Skilled professionals, assembly workers, teachers, pilots, delivery drivers, software engineers.",
      tip: "Labour is human effort. In a definition say what the worker does and name wages as the reward." },
    { title: "Capital", reward: "Interest", icon: "\uD83C\uDFED",
      definition: "Man-made physical aids to production used to manufacture goods or provide commercial services.",
      examples: "Machinery, robots, delivery fleets, factories, warehouses, servers and tools.",
      tip: "MONEY IS NOT A FACTOR OF PRODUCTION. Capital means real physical capital goods." },
    { title: "Enterprise", reward: "Profit", icon: "\uD83D\uDE80",
      definition: "The human ability to organise Land, Labour and Capital while bearing the risk of business failure.",
      examples: "Entrepreneurs launching startups, innovators, small business owners, franchisors.",
      tip: "Always mention (1) combining the other three factors and (2) taking the financial risk." }
  ];
  var SD_STAGES = {
    maslow: [
      { title: "Physiological", text: "Food, water, warmth and rest.", meta: "At work: basic pay, breaks, heating.", tone: "sand" },
      { title: "Safety", text: "Security, a steady job and a safe workplace.", meta: "At work: contract, PPE, pension.", tone: "sage" },
      { title: "Social", text: "Belonging, friendship and being part of a team.", meta: "At work: teamwork, social events.", tone: "green" },
      { title: "Esteem", text: "Status, recognition and respect.", meta: "At work: praise, promotion, title.", tone: "rose" },
      { title: "Self-actualisation", text: "Reach full potential and grow.", meta: "At work: challenging work, autonomy.", tone: "rose" }
    ],
    plc: [
      { title: "Introduction", text: "Low sales, high costs and heavy promotion.", meta: "Aim: create awareness and build distribution.", tone: "sand" },
      { title: "Growth", text: "Sales rise rapidly; the brand gains repeat customers.", meta: "Aim: build loyalty and market share.", tone: "green" },
      { title: "Maturity", text: "Sales peak and competition is strongest.", meta: "Aim: defend share with extension strategies.", tone: "sage" },
      { title: "Decline", text: "Sales fall as the product becomes outdated.", meta: "Aim: harvest profit or withdraw.", tone: "rose" }
    ],
    cycle: [
      { title: "Growth", text: "Output, employment and consumer spending begin to rise.", meta: "Businesses plan investment and new capacity.", tone: "green" },
      { title: "Boom", text: "The peak: high demand, low unemployment and inflationary pressure.", meta: "Watch costs and avoid over-borrowing.", tone: "sand" },
      { title: "Recession", text: "Demand and output fall; unemployment begins to rise.", meta: "Cut discretionary spend; protect cash flow.", tone: "rose" },
      { title: "Slump", text: "The trough: low output and high unemployment.", meta: "Reduce costs and prepare for recovery.", tone: "sage" }
    ]
  };
  var SD_STYLE = {
    overlay: "position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:clamp(.5rem,2vw,1.25rem);overflow-y:auto;",
    panel: "position:relative;background:var(--surface,#FAF9F6);color:var(--surface-text,#16233b);width:100%;max-width:64rem;max-height:92vh;overflow-y:auto;border-radius:1.5rem;box-shadow:0 1.5rem 4rem rgba(0,0,0,.45);margin:auto;border:1px solid rgba(100,116,139,.3);",
    header: "position:sticky;top:0;z-index:20;background:#0F2042;color:#fff;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid rgba(30,58,138,.6);",
    badge: "display:inline-block;font:650 .65rem/1.4 var(--font-mono,monospace);letter-spacing:.07em;text-transform:uppercase;background:#fbbf24;color:#0f172a;border-radius:.35rem;padding:.15rem .5rem;",
    kicker: "font:650 .7rem/1.4 var(--font-mono,monospace);letter-spacing:.06em;text-transform:uppercase;color:#bfdbfe;",
    title: "font:650 clamp(1.1rem,2.4vw,1.5rem)/1.2 var(--font-serif,Georgia,serif);margin:.35rem 0 0;color:#fff;",
    subtitle: "font-size:.82rem;color:#dbeafe;margin:.35rem 0 0;line-height:1.4;",
    close: "background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:.75rem;padding:.5rem;cursor:pointer;line-height:0;",
    body: "padding:1.25rem;display:grid;gap:1.1rem;",
    intro: "background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);border-radius:.85rem;padding:.85rem 1rem;font-size:.85rem;line-height:1.5;",
    card: "background:var(--surface-practice,rgba(255,255,255,.7));border:1px solid rgba(100,116,139,.3);border-radius:.9rem;padding:1rem;",
    cardTitle: "font:650 1rem/1.3 var(--font-serif,Georgia,serif);margin:0 0 .5rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;",
    reward: "font:650 .7rem/1.4 var(--font-mono,monospace);letter-spacing:.04em;text-transform:uppercase;background:rgba(245,158,11,.18);color:#92400e;border-radius:.35rem;padding:.15rem .5rem;",
    list: "margin:.5rem 0 0;padding-left:1.25rem;display:grid;gap:.3rem;font-size:.85rem;line-height:1.45;",
    text: "font-size:.85rem;line-height:1.5;margin:.35rem 0;",
    tip: "font-size:.8rem;line-height:1.45;background:rgba(245,158,11,.12);border-left:3px solid #f59e0b;border-radius:.35rem;padding:.55rem .7rem;margin:.6rem 0 0;",
    pill: "border:1px solid rgba(100,116,139,.3);border-radius:.6rem;padding:.45rem .7rem;font:650 .72rem/1.3 var(--font-mono,monospace);cursor:pointer;background:var(--surface-practice,#fff);color:var(--surface-text,#334155);",
    pillOn: "border:1px solid #0F2042;border-radius:.6rem;padding:.45rem .7rem;font:650 .72rem/1.3 var(--font-mono,monospace);cursor:pointer;background:#0F2042;color:#fff;box-shadow:0 1px 3px rgba(15,23,42,.2);",
    detail: "border-radius:.9rem;padding:1rem;border:1px solid rgba(100,116,139,.3);background:var(--surface-practice,rgba(255,255,255,.7));"
  };
  var sdState = { overlay: null, section: "1", tab: "", stage: 0,
                  be: { fixed: 12000, price: 20, variable: 12, volume: 2000 }, onKey: null };
  function sdButton(label, act, extra, on) {
    return '<button type="button" style="' + (on ? SD_STYLE.pillOn : SD_STYLE.pill) +
      '" data-act="' + act + '"' + (extra || "") + '>' + label + '</button>';
  }
  function sdStageButtons(stages, act) {
    if (!stages || !stages.length) return "";
    var out = '<div style="display:flex;flex-wrap:wrap;gap:.45rem;margin:.75rem 0">';
    for (var i = 0; i < stages.length; i++) {
      out += sdButton(stages[i].title, act, ' data-stage="' + i + '" aria-pressed="' + (sdState.stage === i) + '"', sdState.stage === i);
    }
    return out + '</div>';
  }
  function sdStageDetail(stages) {
    var s = stages && stages[sdState.stage] ? stages[sdState.stage] : (stages ? stages[0] : null);
    if (!s) return "";
    return '<div style="' + SD_STYLE.detail + '"><strong style="font-size:.9rem">' + h(s.title) + '</strong>' +
      '<p style="' + SD_STYLE.text + '">' + h(s.text || "") + '</p>' +
      (s.meta ? '<p style="font-size:.78rem;color:#64748b;line-height:1.45">' + h(s.meta) + '</p>' : '') + '</div>';
  }
  function sdFactorsContent() {
    var out = '<p style="' + SD_STYLE.intro + '"><strong>Production combines four factors of production.</strong> Each factor earns a different reward: rent, wages, interest and profit. Click a factor to explore the Cambridge definition and exam guidance.</p>';
    out += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.8rem">';
    for (var i = 0; i < SD_FACTORS.length; i++) {
      var f = SD_FACTORS[i];
      out += '<div style="' + SD_STYLE.card + '">' +
        '<h3 style="' + SD_STYLE.cardTitle + '"><span aria-hidden="true">' + f.icon + '</span>' + h(f.title) +
          '<span style="' + SD_STYLE.reward + '">Reward: ' + h(f.reward) + '</span></h3>' +
        '<p style="' + SD_STYLE.text + '">' + h(f.definition) + '</p>' +
        '<p style="font-size:.78rem;color:#64748b;line-height:1.45"><strong>Examples:</strong> ' + h(f.examples) + '</p>' +
        '<div style="' + SD_STYLE.tip + '"><strong>Cambridge exam tip:</strong> ' + h(f.tip) + '</div></div>';
    }
    return out + '</div>';
  }
  function sdMaslowContent() {
    var stages = SD_STAGES.maslow, tiers = [
      { points: "230,30 370,30 400,82 200,82", labelY: 61 },
      { points: "200,82 400,82 430,134 170,134", labelY: 113 },
      { points: "170,134 430,134 460,186 140,186", labelY: 165 },
      { points: "140,186 460,186 490,238 110,238", labelY: 217 },
      { points: "110,238 490,238 520,290 80,290", labelY: 269 }
    ];
    var svg = '<svg viewBox="55 10 490 300" style="max-height:240px;width:100%;max-width:420px;margin:auto" role="img" aria-label="Maslow hierarchy of needs from physiological needs at the base to self-actualisation at the top">';
    for (var d = 0; d < tiers.length; d++) {
      var idx = Math.max(stages.length - 1 - d, 0), stage = stages[idx], active = sdState.stage === idx;
      svg += '<g role="button" tabindex="0" data-act="sd-stage" data-stage="' + idx + '" aria-pressed="' + active + '" style="cursor:pointer">' +
        '<polygon points="' + tiers[d].points + '" fill="var(--sheet-surface,#F5F5F4)" stroke="' + (active ? "#97532b" : "var(--sheet-blush-line,#d9b7b7)") + '" stroke-width="' + (active ? 3 : 1) + '"></polygon>' +
        '<text x="300" y="' + tiers[d].labelY + '" text-anchor="middle" fill="currentColor" font-size="11" font-weight="700">' + h(stage.title) + '</text></g>';
    }
    svg += '</svg>';
    return '<p style="' + SD_STYLE.intro + '"><strong>Maslow argued that needs must be satisfied in order.</strong> A need that is already met no longer motivates — the next level takes over. Tap a tier to see its workplace meaning.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;align-items:center">' +
        '<div style="overflow-x:auto">' + svg + '</div><div>' + sdStageButtons(stages, "sd-stage") + sdStageDetail(stages) + '</div></div>';
  }
  function sdHerzbergContent() {
    function col(title, subtitle, items, tone) {
      var html = '<div style="' + SD_STYLE.card + '"><h3 style="' + SD_STYLE.cardTitle + '">' + h(title) + '</h3>' +
        '<p style="font-size:.78rem;color:#64748b;line-height:1.45">' + h(subtitle) + '</p><ul style="' + SD_STYLE.list + '">';
      for (var i = 0; i < items.length; i++) html += '<li>' + h(items[i]) + '</li>';
      return html + '</ul><div style="' + SD_STYLE.tip + '">' + (tone === "hygiene"
        ? "Their presence only <strong>prevents dissatisfaction</strong> — it does not create real motivation."
        : "Their presence <strong>creates genuine satisfaction and drive</strong>.") + '</div></div>';
    }
    return '<p style="' + SD_STYLE.intro + '"><strong>Satisfaction and dissatisfaction are NOT opposites.</strong> Two separate sets of factors control them: hygiene factors and motivators.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.8rem">' +
        col("Hygiene factors", "Prevent dissatisfaction when adequate", ["Company policy and administration", "Supervision and working conditions", "Salary, job security and status", "Interpersonal relationships and work-life balance"], "hygiene") +
        col("Motivators", "Create genuine satisfaction and drive", ["Achievement and recognition", "The work itself — interest and challenge", "Responsibility and autonomy", "Growth, advancement and learning"], "motivator") +
      '</div>';
  }
  function sdOrgContent() {
    return '<p style="' + SD_STYLE.intro + '"><strong>Hierarchy</strong> = levels of authority. <strong>Chain of command</strong> = the route instructions travel. <strong>Span of control</strong> = how many people one manager supervises. Delayering removes levels to widen spans and speed communication.</p>' +
      '<div style="overflow-x:auto">' +
      '<svg viewBox="0 0 640 235" style="max-height:200px;width:100%;min-width:360px;margin:auto;color:var(--green,#203e32)" role="img" aria-label="Organisation chart with a board or CEO at the top, functional managers in the middle and teams below">' +
        '<g stroke="currentColor" stroke-opacity=".4" stroke-width="1.5" fill="none"><line x1="320" y1="55" x2="320" y2="72"/><line x1="135" y1="72" x2="505" y2="72"/><line x1="135" y1="72" x2="135" y2="88"/><line x1="320" y1="72" x2="320" y2="88"/><line x1="505" y1="72" x2="505" y2="88"/><line x1="135" y1="128" x2="135" y2="146"/><line x1="95" y1="146" x2="175" y2="146"/><line x1="320" y1="128" x2="320" y2="146"/><line x1="280" y1="146" x2="360" y2="146"/><line x1="505" y1="128" x2="505" y2="146"/><line x1="465" y1="146" x2="545" y2="146"/></g>' +
        '<rect x="240" y="15" width="160" height="40" rx="8" fill="var(--sheet-blush,#f5dede)" stroke="currentColor" stroke-opacity=".35"/>' +
        '<text x="320" y="39" text-anchor="middle" fill="currentColor" font-size="11" font-weight="700">Board / CEO</text>' +
        '<g>' +
        '<rect x="60" y="88" width="150" height="40" rx="7" fill="var(--sheet-surface,#F5F5F4)" stroke="currentColor" stroke-opacity=".35"/><text x="135" y="112" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">Marketing</text>' +
        '<rect x="245" y="88" width="150" height="40" rx="7" fill="var(--sheet-surface,#F5F5F4)" stroke="currentColor" stroke-opacity=".35"/><text x="320" y="112" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">Operations</text>' +
        '<rect x="430" y="88" width="150" height="40" rx="7" fill="var(--sheet-surface,#F5F5F4)" stroke="currentColor" stroke-opacity=".35"/><text x="505" y="112" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">Finance</text>' +
        '</g>' +
        '<g font-size="9" fill="currentColor" opacity=".6" font-family="var(--font-mono,monospace)"><text x="8" y="38">LEVEL 1</text><text x="8" y="111">LEVEL 2</text><text x="8" y="170">LEVEL 3</text></g>' +
      '</svg></div>' +
      '<p style="' + SD_STYLE.intro + '"><strong>Tall vs flat:</strong> a tall structure has many levels (narrow spans, slower decisions, more promotion prospects); a flat structure has few levels (wide spans, faster communication, fewer promotion prospects).</p>';
  }
  function sdLineChart(paths, labels) {
    return '<svg viewBox="0 0 640 260" style="max-height:200px;width:100%;max-width:520px;margin:auto" role="img" aria-label="' + h(labels) + '">' +
      '<line x1="50" y1="225" x2="615" y2="225" stroke="currentColor" stroke-opacity=".3"/>' +
      '<line x1="50" y1="225" x2="50" y2="25" stroke="currentColor" stroke-opacity=".3"/>' +
      paths +
      '<text x="610" y="248" text-anchor="end" fill="currentColor" opacity=".5" font-size="9" font-family="monospace">TIME →</text>' +
      '</svg>';
  }
  function sdPlcContent() {
    var stages = SD_STAGES.plc;
    var wave = "M 60 205 C 95 202 120 195 155 180 C 200 160 220 120 275 90 C 315 70 365 65 420 70 C 470 75 500 100 545 140 C 575 165 590 190 615 205";
    var pts = [{ x: 110, y: 190 }, { x: 275, y: 90 }, { x: 420, y: 70 }, { x: 560, y: 158 }];
    var dots = "";
    for (var i = 0; i < pts.length; i++) {
      dots += '<circle cx="' + pts[i].x + '" cy="' + pts[i].y + '" r="' + (sdState.stage === i ? 8 : 6) + '" fill="' + (sdState.stage === i ? "#97532b" : "var(--sheet-surface,#F5F5F4)") + '" stroke="#97532b" stroke-width="2.5"/>';
    }
    var chart = sdLineChart('<path d="' + wave + ' L 615 225 L 60 225 Z" fill="var(--sheet-sage,#e6efd8)" opacity=".6"/><path d="' + wave + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' + dots,
      "Product life cycle: introduction, growth, maturity and decline");
    return '<p style="' + SD_STYLE.intro + '"><strong>Products pass through introduction, growth, maturity and decline.</strong> Tap a stage to inspect what happens to sales, profit and the marketing aim.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;align-items:center">' +
        '<div>' + chart + '</div><div>' + sdStageButtons(stages, "sd-stage") + sdStageDetail(stages) + '</div></div>' +
      '<div style="' + SD_STYLE.card + '"><h3 style="' + SD_STYLE.cardTitle + '">Extension strategies at maturity</h3>' +
        '<p style="' + SD_STYLE.text + '">Find new markets or segments · introduce new packaging or sizes · add features or improvements · use new advertising and promotions · lower price or introduce discounts · develop new distribution channels.</p></div>';
  }
  function sdBreakEvenContent() {
    var be = sdState.be, fixed = num(be.fixed), price = num(be.price), variable = num(be.variable), volume = num(be.volume);
    var contribution = price - variable;
    var units = contribution > 0 ? Math.ceil(fixed / contribution) : 0;
    var revenue = price * volume, totalCost = fixed + variable * volume, profit = revenue - totalCost;
    var fmt = function (n) { return String(Math.round(num(n))); };
    var chart = sdLineChart(
      '<line x1="70" y1="185" x2="600" y2="185" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="5 4"/>' +
      '<line x1="70" y1="245" x2="600" y2="245" stroke="#97532b" stroke-width="2.5"/>' +
      '<line x1="70" y1="45" x2="600" y2="110" stroke="currentColor" stroke-width="2.5"/>' +
      '<line x1="70" y1="185" x2="600" y2="185" stroke="currentColor" stroke-opacity=".35"/>' +
      '<circle cx="324" cy="149" r="7" fill="#97532b" stroke="var(--sheet-surface,#F5F5F4)" stroke-width="3"/>' +
      '<text x="330" y="138" fill="#97532b" font-size="9" font-weight="700">Break-even</text>' +
      '<text x="540" y="60" text-anchor="end" fill="currentColor" font-size="9" font-weight="700">Sales revenue</text>' +
      '<text x="540" y="180" text-anchor="end" fill="#97532b" font-size="9" font-weight="700">Total cost</text>',
      "Break-even chart showing revenue, total cost and the break-even point");
    var fields = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.6rem;margin-bottom:.8rem">';
    var labels = [["fixed", "Fixed costs ($)"], ["price", "Price per unit ($)"], ["variable", "Variable cost/unit ($)"], ["volume", "Current output (units)"]];
    for (var i = 0; i < labels.length; i++) {
      fields += '<label style="font:650 .7rem/1.4 var(--font-mono,monospace);color:#64748b">' + labels[i][1] +
        '<input type="number" min="0" step="any" value="' + h(be[labels[i][0]]) + '" data-be="' + labels[i][0] +
        '" style="display:block;width:100%;margin-top:.3rem;padding:.5rem;border:1px solid rgba(100,116,139,.4);border-radius:.6rem;background:var(--surface-practice,#fff);color:inherit;font:inherit"/></label>';
    }
    fields += '</div>';
    return '<p style="' + SD_STYLE.intro + '"><strong>Break-even output = fixed costs ÷ contribution per unit.</strong> Change the numbers to see how the break-even point and profit change.</p>' +
      fields +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem">' +
        '<div style="' + SD_STYLE.card + '"><div style="font:650 .68rem var(--font-mono,monospace);color:#64748b">CONTRIBUTION / UNIT</div><div style="font-size:1.4rem;font-weight:800">$' + fmt(contribution) + '</div><div style="font-size:.72rem;color:#64748b">price − variable cost</div></div>' +
        '<div style="' + SD_STYLE.card + '"><div style="font:650 .68rem var(--font-mono,monospace);color:#64748b">BREAK-EVEN OUTPUT</div><div style="font-size:1.4rem;font-weight:800">' + fmt(units) + ' units</div><div style="font-size:.72rem;color:#64748b">fixed ÷ contribution</div></div>' +
        '<div style="' + SD_STYLE.card + '"><div style="font:650 .68rem var(--font-mono,monospace);color:#64748b">MARGIN OF SAFETY</div><div style="font-size:1.4rem;font-weight:800">' + fmt(volume - units) + ' units</div><div style="font-size:.72rem;color:#64748b">current output − break-even</div></div>' +
        '<div style="' + SD_STYLE.card + '"><div style="font:650 .68rem var(--font-mono,monospace);color:#64748b">PROFIT AT OUTPUT</div><div style="font-size:1.4rem;font-weight:800;color:' + (profit >= 0 ? "#047857" : "#be123c") + '">$' + fmt(profit) + '</div><div style="font-size:.72rem;color:#64748b">revenue − total cost</div></div>' +
      '</div>' + chart;
  }
  function sdFinanceContent() {
    var rows = [
      ["Short-term sources", "Overdraft, trade credit, factoring, leasing, retained cash", "Quick to arrange, flexible; often higher interest, must be repaid soon"],
      ["Long-term sources", "Bank loan, debentures, shares, retained profit, venture capital", "Repaid over years; spreads cost but shares dilute ownership"],
      ["Debt finance", "Loans, debentures, overdrafts, leasing", "No loss of control, interest is tax-deductible; interest must be paid even in a loss"],
      ["Equity finance", "Ordinary shares, retained profit, venture capital", "No fixed repayment, dividends can be cut; dilutes control and ownership"]
    ];
    var out = '<p style="' + SD_STYLE.intro + '"><strong>Finance choice depends on time horizon, cost, control and risk.</strong> Short-term sources fund working capital; long-term sources fund fixed assets and expansion.</p>';
    out += '<div style="' + SD_STYLE.card + '"><table style="width:100%;border-collapse:collapse;font-size:.82rem"><thead><tr>' +
      '<th style="text-align:left;padding:.5rem;border-bottom:2px solid var(--green,#203e32)">Source</th>' +
      '<th style="text-align:left;padding:.5rem;border-bottom:2px solid var(--green,#203e32)">Examples</th>' +
      '<th style="text-align:left;padding:.5rem;border-bottom:2px solid var(--green,#203e32)">Advantages / risks</th></tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
      out += '<tr><th style="text-align:left;padding:.5rem;border-bottom:1px solid rgba(100,116,139,.2)">' + h(rows[i][0]) + '</th>' +
        '<td style="padding:.5rem;border-bottom:1px solid rgba(100,116,139,.2)">' + h(rows[i][1]) + '</td>' +
        '<td style="padding:.5rem;border-bottom:1px solid rgba(100,116,139,.2)">' + h(rows[i][2]) + '</td></tr>';
    }
    out += '</tbody></table></div>';
    out += '<div style="' + SD_STYLE.card + '"><h3 style="' + SD_STYLE.cardTitle + '">Gearing & working capital</h3>' +
      '<p style="' + SD_STYLE.text + '"><strong>Gearing = (long-term debt ÷ total capital) × 100.</strong> High gearing means more fixed interest commitments — higher risk but greater returns for shareholders when profits rise.</p>' +
      '<p style="' + SD_STYLE.text + '"><strong>Working capital = current assets − current liabilities.</strong> It measures short-term liquidity: too little risks cash-flow problems; too much ties up cash that could be invested.</p></div>';
    return out;
  }
  function sdCycleContent() {
    var stages = SD_STAGES.cycle;
    var wave = "M 40 175 C 70 175 80 150 110 140 C 155 125 190 75 250 65 C 300 58 340 100 390 120 C 440 140 480 190 530 185 C 565 182 590 165 610 150";
    var pts = [{ x: 110, y: 140 }, { x: 250, y: 65 }, { x: 390, y: 120 }, { x: 530, y: 185 }];
    var dots = "";
    for (var i = 0; i < pts.length; i++) {
      dots += '<circle cx="' + pts[i].x + '" cy="' + pts[i].y + '" r="' + (sdState.stage === i ? 8 : 6) + '" fill="' + (sdState.stage === i ? "#97532b" : "var(--sheet-surface,#F5F5F4)") + '" stroke="#97532b" stroke-width="2.5"/>';
    }
    var chart = sdLineChart('<path d="' + wave + ' L 610 220 L 40 220 Z" fill="var(--sheet-sage,#e6efd8)" opacity=".55"/><path d="' + wave + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' + dots,
      "Business cycle moving through growth, boom, recession and slump");
    return '<p style="' + SD_STYLE.intro + '"><strong>The business cycle moves through growth, boom, recession and slump.</strong> Tap a stage to see what happens to demand, output and unemployment.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;align-items:center">' +
        '<div>' + chart + '</div><div>' + sdStageButtons(stages, "sd-stage") + sdStageDetail(stages) + '</div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.8rem">' +
        '<div style="' + SD_STYLE.card + '"><h3 style="' + SD_STYLE.cardTitle + '">SPICED — a strong currency</h3><ul style="' + SD_STYLE.list + '"><li><strong>S</strong>tronger £</li><li><strong>P</strong>urchasing power abroad rises</li><li><strong>I</strong>mports cheaper</li><li><strong>C</strong>heaper holidays abroad</li><li><strong>E</strong>xports dearer</li><li><strong>D</strong>eflationary pressure</li></ul></div>' +
        '<div style="' + SD_STYLE.card + '"><h3 style="' + SD_STYLE.cardTitle + '">WPIDEC — a weak currency</h3><ul style="' + SD_STYLE.list + '"><li><strong>W</strong>eaker £</li><li><strong>P</strong>urchasing power abroad falls</li><li><strong>I</strong>mports dearer</li><li><strong>D</strong>earer holidays abroad</li><li><strong>E</strong>xports cheaper</li><li><strong>C</strong>inflationary pressure</li></ul></div>' +
      '</div>';
  }
  function sdContent() {
    var code = sdState.section, tab = sdState.tab;
    if (code === "1") return sdFactorsContent();
    if (code === "2") return tab === "herzberg" ? sdHerzbergContent() : (tab === "org" ? sdOrgContent() : sdMaslowContent());
    if (code === "3") return sdPlcContent();
    if (code === "4") return sdBreakEvenContent();
    if (code === "5") return sdFinanceContent();
    if (code === "6") return sdCycleContent();
    return '<p style="' + SD_STYLE.intro + '">Visual content is not available for this section.</p>';
  }
  function sdRender() {
    if (!sdState.overlay) return;
    var meta = SD_META[sdState.section] || SD_META["1"];
    var tabs = "";
    if (meta.tabs && meta.tabs.length) {
      tabs = '<div style="display:flex;flex-wrap:wrap;gap:.4rem">';
      for (var i = 0; i < meta.tabs.length; i++) {
        tabs += sdButton(meta.tabs[i].label, "sd-tab", ' data-tab="' + meta.tabs[i].id + '" aria-pressed="' + (sdState.tab === meta.tabs[i].id) + '"', sdState.tab === meta.tabs[i].id);
      }
      tabs += '</div>';
    }
    sdState.overlay.innerHTML =
      '<div class="ec-section-diagram-overlay" role="dialog" aria-modal="true" aria-label="' + h(meta.title) + '" style="' + SD_STYLE.overlay + '">' +
        '<div style="' + SD_STYLE.panel + '">' +
          '<header style="' + SD_STYLE.header + '"><div style="min-width:0">' +
            '<div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap"><span aria-hidden="true" style="font-size:1.5rem;padding:.4rem;border-radius:.75rem;background:rgba(255,255,255,.1)">' + meta.icon + '</span>' +
              '<span style="' + SD_STYLE.badge + '">' + h(meta.badge) + '</span>' +
              '<span style="' + SD_STYLE.kicker + '">Section ' + h(sdState.section) + '</span></div>' +
            '<h2 style="' + SD_STYLE.title + '">' + h(meta.title) + '</h2>' +
            '<p style="' + SD_STYLE.subtitle + '">' + h(meta.subtitle) + '</p></div>' +
            '<div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0">' + tabs +
              '<button type="button" data-act="sd-close" aria-label="Close visual" title="Close" style="' + SD_STYLE.close + '">' + ic("x", 20) + '</button>' +
            '</div></header>' +
          '<div style="' + SD_STYLE.body + '">' + sdContent() + '</div>' +
        '</div></div>';
  }
  function sdClose() {
    if (!sdState.overlay) return;
    if (sdState.onKey) { document.removeEventListener("keydown", sdState.onKey); sdState.onKey = null; }
    if (sdState.overlay.parentNode) sdState.overlay.parentNode.removeChild(sdState.overlay);
    sdState.overlay = null;
    ecUnlockBodyScroll();
  }
  EC.openSectionDiagram = function (code) {
    code = String(code || "1");
    if (!SD_META[code]) code = "1";
    sdClose();
    sdState.section = code;
    var tabs = SD_META[code].tabs || [];
    sdState.tab = tabs.length ? tabs[0].id : "";
    sdState.stage = 0;
    sdState.overlay = document.createElement("div");
    sdState.overlay.id = "ecbiz-section-diagram-host";
    document.body.appendChild(sdState.overlay);
    ecLockBodyScroll();
    sdState.onKey = function (event) {
      if (event.key === "Escape" || event.keyCode === 27) { event.preventDefault(); sdClose(); }
    };
    document.addEventListener("keydown", sdState.onKey);
    sdState.overlay.addEventListener("click", function (event) {
      if (event.target === sdState.overlay ||
          (event.target && event.target.classList && event.target.classList.contains("ec-section-diagram-overlay"))) {
        sdClose(); return;
      }
      var node = (event.target && event.target.closest) ? event.target.closest("[data-act]") : null;
      if (!node) return;
      var act = node.getAttribute("data-act");
      if (act === "sd-close") sdClose();
      else if (act === "sd-tab") { sdState.tab = node.getAttribute("data-tab"); sdState.stage = 0; sdRender(); }
      else if (act === "sd-stage") { sdState.stage = parseInt(node.getAttribute("data-stage"), 10) || 0; sdRender(); }
    });
    sdState.overlay.addEventListener("change", function (event) {
      var field = event.target && event.target.getAttribute ? event.target.getAttribute("data-be") : null;
      if (!field || !has(sdState.be, field)) return;
      sdState.be[field] = num(event.target.value);
      sdRender();
    });
    sdRender();
    var closeBtn = sdState.overlay.querySelector('[data-act="sd-close"]');
    if (closeBtn && closeBtn.focus) closeBtn.focus();
  };
  EC.openFactorsDiagram = function () { EC.openSectionDiagram("1"); };
})();
