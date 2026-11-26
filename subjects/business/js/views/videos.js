/* EcBiz concept-visualization video library + canvas render runtime.
 * Append-only module: registers the "videos" view and injects its navigation
 * buttons. It never touches quiz routing, ecbiz_* legacy keys or question banks.
 */
(function () {
  "use strict";
  var EC = window.EC;
  if (!EC) return;

  var PROGRESS_KEY = "video_progress"; // stored as ecbiz_video_progress (new key only)
  var PALETTE = {
    bg: "#0B1220", bg2: "#13233A", panel: "#111C2E", ink: "#F8FAFC", muted: "#94A3B8",
    accent: "#38BDF8", accent2: "#A78BFA", good: "#10B981", warn: "#F59E0B", bad: "#EF4444"
  };
  /* Each unit has its own visual identity so the videos don't look like the
     same bland slide deck. Values are applied to PALETTE at frame start. */
  var THEMES = {
    1: { bg: "#08111F", bg2: "#102B45", panel: "#101D31", ink: "#F8FAFC", muted: "#9FB4CC", accent: "#38BDF8", accent2: "#A78BFA", good: "#34D399", warn: "#FBBF24", bad: "#F87171" },
    2: { bg: "#0C1024", bg2: "#231C4A", panel: "#171A34", ink: "#F8FAFC", muted: "#B6B0D6", accent: "#A78BFA", accent2: "#F472B6", good: "#34D399", warn: "#FBBF24", bad: "#FB7185" },
    3: { bg: "#06171A", bg2: "#0F3B3A", panel: "#102A2C", ink: "#F0FDFC", muted: "#9BC4C0", accent: "#2DD4BF", accent2: "#60A5FA", good: "#4ADE80", warn: "#FCD34D", bad: "#FB7185" },
    4: { bg: "#0D1117", bg2: "#332614", panel: "#1C1A17", ink: "#FFF7ED", muted: "#C2B49C", accent: "#F59E0B", accent2: "#38BDF8", good: "#34D399", warn: "#FCD34D", bad: "#F87171" },
    5: { bg: "#04140F", bg2: "#0B3626", panel: "#0E2620", ink: "#ECFDF5", muted: "#A7C9BA", accent: "#34D399", accent2: "#FBBF24", good: "#4ADE80", warn: "#FBBF24", bad: "#FB7185" },
    6: { bg: "#100A1F", bg2: "#3A1B33", panel: "#201630", ink: "#FDF4FF", muted: "#CDB4D4", accent: "#E879F9", accent2: "#FB923C", good: "#34D399", warn: "#FCD34D", bad: "#FB7185" }
  };
  function hexAlpha(hex, a) {
    var h = String(hex || "#ffffff").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n)) return "rgba(255,255,255," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
  function applyTheme(unit) {
    var t = THEMES[unit] || THEMES[1];
    Object.keys(t).forEach(function (k) { PALETTE[k] = t[k]; });
  }
  var UNIT_TITLES = {
    1: "Understanding business activity", 2: "People in business", 3: "Marketing",
    4: "Operations management", 5: "Financial information and decisions",
    6: "External influences on business activity"
  };
  var state = {
    manifest: null, byId: {}, progress: {}, filter: 0,
    player: null, captionsOn: true, voiceOn: true, raf: 0, stored: false,
    voices: [], speechToken: 0, speechTimers: [],
    audioIndex: null, audioOn: true
  };

  function esc(v) { return EC.esc(v); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------- styles */
  var STYLE_ID = "ec-video-styles";
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      ".ecv-root{--ecv-line:#dcd9d2;max-width:1200px;margin:0 auto;padding:22px 18px 60px;color:var(--surface-text,#192e28)}",
      ".ecv-hero{border-radius:20px;padding:26px 28px;background:linear-gradient(135deg,#10233f,#17324f);color:#f8fafc;border:1px solid #24415f;box-shadow:0 10px 30px rgba(15,32,66,.16)}",
      ".ecv-hero h1{font-size:28px;font-weight:800;letter-spacing:-.02em;margin:6px 0 8px}",
      ".ecv-hero p{max-width:760px;line-height:1.6;color:#cbd5e1;font-size:13px}",
      ".ecv-kicker{font:700 10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#7dd3fc}",
      ".ecv-stats{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}",
      ".ecv-stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:8px 12px;font-size:11px;font-weight:700}",
      ".ecv-filters{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0 16px}",
      ".ecv-chip{border:1px solid var(--ecv-line);border-radius:999px;padding:7px 13px;font-size:12px;font-weight:700;background:#fff;color:#334155;cursor:pointer;transition:.15s}",
      ".dark .ecv-chip{background:#16221c;color:#d6e4dc;border-color:#33463c}",
      ".ecv-chip:hover{border-color:#2563eb}.ecv-chip[data-on=\"1\"]{background:#1d4ed8;border-color:#1d4ed8;color:#fff}",
      ".ecv-unit{margin-bottom:26px}",
      ".ecv-unit-head{display:flex;align-items:baseline;gap:10px;margin-bottom:10px;border-bottom:2px solid var(--ecv-line);padding-bottom:8px}",
      ".ecv-unit-head h2{font-size:17px;font-weight:800}.ecv-unit-head span{font:700 11px ui-monospace,monospace;color:#64748b}",
      ".ecv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}",
      ".ecv-card{border:1px solid var(--ecv-line);border-radius:16px;background:var(--surface-panel,#fff);padding:15px;display:flex;flex-direction:column;gap:9px;box-shadow:0 2px 8px rgba(15,23,42,.04)}",
      ".dark .ecv-card{background:#131e18;border-color:#2c3d34}",
      ".ecv-card-top{display:flex;justify-content:space-between;align-items:center;gap:8px}",
      ".ecv-code{font:700 10px ui-monospace,monospace;color:#1d4ed8;background:#eff6ff;border-radius:6px;padding:3px 7px}",
      ".dark .ecv-code{background:#172a44;color:#93c5fd}",
      ".ecv-dur{font:600 10px ui-monospace,monospace;color:#64748b}",
      ".ecv-card h3{font-size:14px;font-weight:800;line-height:1.35}",
      ".ecv-obj{font-size:11px;line-height:1.5;color:var(--surface-muted,#52615b)}",
      ".ecv-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:auto}",
      ".ecv-tag{font-size:9px;font-weight:700;background:#f1f5f9;border-radius:5px;padding:2px 6px;color:#475569}",
      ".dark .ecv-tag{background:#22322b;color:#b8cbc0}",
      ".ecv-watch{width:100%;border:0;border-radius:10px;background:#1d4ed8;color:#fff;font-size:12px;font-weight:800;padding:9px;cursor:pointer}",
      ".ecv-watch:hover{background:#1e40af}.ecv-watch[data-done=\"1\"]{background:#0f766e}",
      ".ecv-overlay{position:fixed;inset:0;z-index:9999;background:rgba(4,9,20,.92);display:flex;align-items:center;justify-content:center;padding:16px}",
      ".ecv-player{width:min(1180px,100%);max-height:calc(100dvh - 32px);overflow:auto;background:#0d1729;border:1px solid #273a56;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.55);color:#f1f5f9}",
      ".ecv-player-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid #22334c}",
      ".ecv-player-head strong{font-size:14px}.ecv-player-head small{display:block;color:#94a3b8;font-size:10px;margin-top:2px}",
      ".ecv-close{background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:9px;padding:6px 11px;font-size:12px;font-weight:700;cursor:pointer}",
      ".ecv-stage{position:relative;background:#000;line-height:0}",
      ".ecv-canvas{width:100%;height:auto;display:block;aspect-ratio:16/9}",
      ".ecv-caption{position:absolute;left:6%;right:6%;bottom:2%;text-align:center;font-size:clamp(11px,1.35vw,17px);font-weight:650;line-height:1.4;color:#fff;text-shadow:0 2px 6px #000;background:rgba(8,13,25,.92);padding:.3em .75em;border-radius:.45em;pointer-events:none}",
      ".ecv-controls{padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px}",
      ".ecv-seek{width:100%;accent-color:#38bdf8;cursor:pointer}",
      ".ecv-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".ecv-btn{background:#1e293b;border:1px solid #334155;color:#e2e8f0;border-radius:9px;padding:7px 12px;font-size:11px;font-weight:750;cursor:pointer}",
      ".ecv-btn:hover{background:#334155}.ecv-btn[data-on=\"1\"]{background:#0369a1;border-color:#0284c7;color:#fff}",
      ".ecv-voice-tag{font:700 10px ui-monospace,monospace;color:#6ee7b7;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.35);border-radius:99px;padding:3px 8px;white-space:nowrap}",
      ".ecv-time{font:700 11px ui-monospace,monospace;color:#94a3b8;margin-left:auto}",
      ".ecv-scenes{display:flex;gap:3px;height:6px}",
      ".ecv-scenes i{flex:1;background:#243449;border-radius:3px;cursor:pointer;display:block}",
      ".ecv-scenes i[data-cur=\"1\"]{background:#38bdf8}.ecv-scenes i[data-seen=\"1\"]{background:#0e7490}",
      ".ecv-quiz{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,12,24,.9);line-height:1.5;padding:24px}",
      ".ecv-quiz-box{width:min(620px,100%);background:#101d31;border:1px solid #2a3f5c;border-radius:16px;padding:20px;text-align:center}",
      ".ecv-quiz-box h4{font-size:17px;margin-bottom:12px}",
      ".ecv-opt{display:block;width:100%;text-align:left;margin:7px 0;padding:10px 12px;border-radius:9px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;cursor:pointer;font-weight:650}",
      ".ecv-opt:hover{border-color:#38bdf8}",
      ".ecv-opt[data-correct=\"1\"]{border-color:#10b981;background:#064e3b}",
      ".ecv-opt[data-wrong=\"1\"]{border-color:#ef4444;background:#7f1d1d}",
      ".ecv-explain{margin-top:10px;font-size:12px;color:#a5f3fc;text-align:left;line-height:1.6}",
      ".ecv-empty{padding:40px;text-align:center;color:#64748b;font-size:13px}"
    ].join("\n");
    var tag = document.createElement("style");
    tag.id = STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  /* ------------------------------------------------------- library rendering */
  function progressFor(id) { return state.progress[id] || {}; }
  function buildFilters() {
    var out = ['<div class="ecv-filters" role="group" aria-label="Filter videos by unit">'];
    out.push('<button type="button" class="ecv-chip" data-unit="0" data-on="' + (state.filter === 0 ? 1 : 0) + '">All 6 units</button>');
    for (var u = 1; u <= 6; u++) {
      out.push('<button type="button" class="ecv-chip" data-unit="' + u + '" data-on="' + (state.filter === u ? 1 : 0) + '">Unit ' + u + '</button>');
    }
    out.push('</div>');
    return out.join("");
  }

  function card(v) {
    var pr = progressFor(v.video_id);
    var tags = (v.scenes[0] && v.scenes[0].syllabus_concepts_tagged || []).slice(0, 3);
    var obj = (v.learning_objectives || [])[0] || "";
    return '<article class="ecv-card" data-video="' + esc(v.video_id) + '">' +
      '<div class="ecv-card-top"><span class="ecv-code">' + esc(v.video_id) + ' · ' + esc(v.chapter_code) + '</span>' +
      '<span class="ecv-dur">' + v.target_duration_sec + 's · ' + v.scenes.length + ' scenes</span></div>' +
      '<h3>' + esc(v.video_title) + '</h3>' +
      '<p class="ecv-obj">' + esc(obj) + '</p>' +
      '<div class="ecv-tags">' + tags.map(function (t) { return '<span class="ecv-tag">' + esc(t) + '</span>'; }).join("") + '</div>' +
      '<button type="button" class="ecv-watch" data-watch="' + esc(v.video_id) + '" data-done="' + (pr.completed ? 1 : 0) + '">' +
      (pr.completed ? '✓ Rewatch concept video' : '▶ Watch concept video') + '</button></article>';
  }

  function libraryHTML() {
    var vids = state.manifest.videos || [];
    var shown = state.filter ? vids.filter(function (v) { return v.unit_number === state.filter; }) : vids;
    var done = vids.filter(function (v) { return progressFor(v.video_id).completed; }).length;
    var out = [];
    out.push('<section class="ecv-root">');
    out.push('<div class="ecv-hero"><div class="ecv-kicker">Cambridge IGCSE Business · 0264 · 2027–2029</div>' +
      '<h1>Concept-visualization video library</h1>' +
      '<p>Abstract textbook definitions become animated business simulations: cost pipes, break-even crosshairs, org-chart collapses, product-life-cycle curves and cash-flow streams. Every package passed the syllabus, visual/math and deterministic gatekeeper audits.</p>' +
      '<div class="ecv-stats"><span class="ecv-stat">' + vids.length + ' videos</span>' +
      '<span class="ecv-stat">6 units · 25 chapters</span>' +
      '<span class="ecv-stat">3–5 min each</span>' +
      '<span class="ecv-stat">' + done + ' completed</span></div></div>');
    out.push(buildFilters());
    if (!shown.length) {
      out.push('<div class="ecv-empty">No videos in this unit yet.</div>');
    } else {
      for (var u = 1; u <= 6; u++) {
        var group = shown.filter(function (v) { return v.unit_number === u; });
        if (!group.length) continue;
        out.push('<div class="ecv-unit"><div class="ecv-unit-head"><h2>Unit ' + u + ': ' + esc(UNIT_TITLES[u]) + '</h2>' +
          '<span>' + group.length + ' videos</span></div><div class="ecv-grid">' +
          group.map(card).join("") + '</div></div>');
      }
    }
    out.push('</section>');
    return out.join("");
  }

  function drawLibrary(main) {
    main.innerHTML = libraryHTML();
    $$('[data-unit]', main).forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = Number(btn.getAttribute("data-unit"));
        drawLibrary(main);
        window.scrollTo(0, 0);
      });
    });
    $$('[data-watch]', main).forEach(function (btn) {
      btn.addEventListener("click", function () { openPlayer(state.byId[btn.getAttribute("data-watch")]); });
    });
  }

  /* -------------------------------------------------------------- canvas runtime */
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function text(ctx, str, x, y, size, color, weight, align, maxWidth) {
    ctx.fillStyle = color || PALETTE.ink;
    ctx.font = (weight || 600) + " " + size + "px ui-sans-serif,system-ui,Segoe UI,sans-serif";
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(String(str), x, y, maxWidth || 1200);
  }
  function wrap(ctx, str, maxWidth, size, weight) {
    ctx.font = (weight || 600) + " " + size + "px ui-sans-serif,system-ui,Segoe UI,sans-serif";
    var words = String(str || "").split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      var test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && cur) { lines.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 4);
  }

  var EPISODE_ART = {
    VID_U1_01: ["board", "factory", "box"], VID_U1_02: ["farm", "factory", "shop"],
    VID_U1_03: ["truck", "box", "chart"], VID_U1_04: ["pottery", "shop", "people"],
    VID_U1_05: ["target", "people", "chart"], VID_U2_01: ["shirt", "people", "award"],
    VID_U2_02: ["truck", "people", "network"], VID_U2_03: ["funnel", "document", "people"],
    VID_U2_04: ["message", "people", "clock"], VID_U3_01: ["package", "shop", "target"],
    VID_U3_02: ["meal", "pin", "document"], VID_U3_03: ["headphones", "tag", "package"],
    VID_U3_04: ["globe", "package", "shield"], VID_U4_01: ["bike", "factory", "clock"],
    VID_U4_02: ["bread", "chart", "coin"], VID_U4_03: ["medical", "shield", "factory"],
    VID_U4_04: ["pin", "factory", "truck"], VID_U5_01: ["board", "bank", "coin"],
    VID_U5_02: ["meal", "coin", "calendar"], VID_U5_03: ["document", "coin", "chart"],
    VID_U5_04: ["scale", "document", "shop"], VID_U5_05: ["book", "chart", "coin"],
    VID_U6_01: ["bike", "chart", "factory"], VID_U6_02: ["farm", "factory", "globe"],
    VID_U6_03: ["chip", "globe", "truck"]
  };

  // Most pictures use a filled silhouette and a second path for the details.
  var ICON_PATHS = {
    board: ["M8 55C4 49 11 37 24 24S48 8 56 8C56 16 52 27 39 40S14 59 8 55Z", "M13 51L52 12M19 40L27 44M30 28L36 34"],
    factory: ["M5 55V30L23 21V32L39 23V34L47 30L50 10H57L60 55Z", "M12 42H18M25 42H31M38 42H44M51 42H54M14 12H28M31 6H40"],
    farm: ["M8 55V30L24 15L40 30V55ZM45 55V25H58V55Z", "M16 55V38H32V55M17 40L30 53M30 40L17 53M45 25Q52 10 58 25M5 55H61"],
    truck: ["M5 19H39V46H5ZM39 28H51L60 39V46H39ZM13 47A6 6 0 1 0 25 47A6 6 0 1 0 13 47ZM43 47A6 6 0 1 0 55 47A6 6 0 1 0 43 47Z", "M46 31L53 39H44V31M11 28H31M11 35H24"],
    box: ["M7 20L32 9L57 20V46L32 57L7 46Z", "M7 20L32 32L57 20M32 32V57M19 14L45 26V37"],
    shop: ["M9 55V27L15 13H49L55 27V55Z", "M9 29H55M17 13L14 28M26 13L24 28M38 13L40 28M47 13L50 28M17 55V38H29V55M36 37H48V46H36Z"],
    pottery: ["M18 12H46V19L42 24C57 39 52 56 32 56S7 39 22 24L18 19Z", "M18 19H46M19 36Q32 43 45 36M16 44Q32 53 48 44"],
    people: ["M22 24A8 8 0 1 0 22 8A8 8 0 1 0 22 24ZM45 31A7 7 0 1 0 45 17A7 7 0 1 0 45 31ZM5 53V44A17 17 0 0 1 39 44V53ZM42 53V44L40 38A13 13 0 0 1 59 50V53Z", ""],
    target: ["M32 7A25 25 0 1 0 32 57A25 25 0 1 0 32 7Z", "M32 17A15 15 0 1 0 32 47A15 15 0 1 0 32 17ZM32 27A5 5 0 1 0 32 37A5 5 0 1 0 32 27ZM32 32L55 9L61 9M55 9V3"],
    shirt: ["M18 10L26 8Q32 18 38 8L46 10L60 23L50 34L45 29V56H19V29L14 34L4 23Z", "M25 22H39M32 22V34"],
    award: ["M19 35L14 58L24 53L30 59L34 37L40 59L46 53L56 58L49 32ZM34 7A18 18 0 1 0 34 43A18 18 0 1 0 34 7Z", "M26 25L32 31L43 19"],
    network: ["M25 7H39V20H25ZM6 43H20V57H6ZM25 43H39V57H25ZM44 43H58V57H44Z", "M32 20V43M13 43V32H51V43"],
    funnel: ["M6 10H58L40 34V49L24 57V34Z", "M12 20H52M19 29H45M26 39H38"],
    document: ["M13 6H41L52 17V58H13Z", "M41 6V18H52M21 27H43M21 36H43M21 45H35"],
    message: ["M7 10H57V45H33L21 55V45H7Z", "M18 22H46M18 31H40"],
    clock: ["M32 7A25 25 0 1 0 32 57A25 25 0 1 0 32 7Z", "M32 17V32L42 40M16 32H19M45 32H48M32 45V48"],
    package: ["M14 7H50L47 15L48 48L51 57H13L16 48L17 15Z", "M16 15H48M16 48H48M23 28Q32 19 41 28Q35 41 23 37Z"],
    meal: ["M8 48H56Q54 22 32 22Q10 22 8 48ZM5 49H59V56H5Z", "M32 17V22M29 17H35M16 40Q19 31 27 30"],
    pin: ["M32 6A20 20 0 0 1 52 26C52 38 32 58 32 58S12 38 12 26A20 20 0 0 1 32 6Z", "M32 17A9 9 0 1 0 32 35A9 9 0 1 0 32 17Z"],
    headphones: ["M9 40V30A23 23 0 0 1 55 30V40M9 33H19V56H11Q5 56 5 50V39Q5 33 9 33ZM45 33H55Q59 33 59 39V50Q59 56 53 56H45Z", "M15 31A17 17 0 0 1 49 31M12 41V49M52 41V49"],
    tag: ["M7 28L29 7H53V31L31 55Z", "M43 16A4 4 0 1 0 43 24A4 4 0 1 0 43 16ZM21 32L32 43M26 27L37 38"],
    globe: ["M32 6A26 26 0 1 0 32 58A26 26 0 1 0 32 6Z", "M7 32H57M13 17Q32 26 51 17M13 47Q32 38 51 47M32 6C16 12 16 52 32 58C48 52 48 12 32 6Z"],
    shield: ["M32 6L54 14V31Q54 47 32 58Q10 47 10 31V14Z", "M21 31L29 39L44 23"],
    bike: ["M15 34A12 12 0 1 0 15 58A12 12 0 1 0 15 34ZM49 34A12 12 0 1 0 49 58A12 12 0 1 0 49 34Z", "M15 46L24 26L34 46H15L41 28L49 46M41 28L38 18H48M19 25H29"],
    bread: ["M8 51V31Q3 20 15 15Q30 8 45 15Q60 18 56 31V51Z", "M17 28L24 19M29 28L36 19M41 28L47 21M13 43H51"],
    medical: ["M11 34L35 10L54 29L30 53Z", "M9 40L22 53M14 48L5 58M34 10L42 4L60 23L54 29M28 18L34 24M21 25L27 31M15 31L21 37"],
    bank: ["M5 25L32 9L59 25ZM8 51H56V57H8ZM13 26H21V51H13ZM28 26H36V51H28ZM43 26H51V51H43Z", "M30 19H34"],
    coin: ["M32 8A24 24 0 1 0 32 56A24 24 0 1 0 32 8Z", "M32 15A17 17 0 1 0 32 49A17 17 0 1 0 32 15ZM32 22V42M39 25H29Q23 25 25 31L36 33Q42 37 35 39H25"],
    calendar: ["M8 13H56V55H8Z", "M8 24H56M20 8V18M44 8V18M18 35H22M30 35H34M42 35H46M18 45H22M30 45H34M42 45H46"],
    scale: ["M29 14H35V54H29ZM18 54H46V58H18ZM5 34H25Q22 43 15 43Q8 43 5 34ZM39 34H59Q56 43 49 43Q42 43 39 34Z", "M10 15H54M15 15L6 34M15 15L24 34M49 15L40 34M49 15L58 34"],
    book: ["M5 14Q20 9 32 20Q45 9 59 14V53Q45 47 32 56Q19 47 5 53Z", "M32 20V56M12 26Q21 25 26 30M12 37Q21 36 26 41M38 30Q43 25 52 26M38 41Q43 36 52 37"],
    chart: ["M14 39H23V53H14ZM28 28H37V53H28ZM42 14H51V53H42Z", "M7 8V54H58M15 31L31 20L44 8H54V18"],
    chip: ["M13 13H51V51H13Z", "M22 22H42V42H22ZM23 4V13M32 4V13M41 4V13M23 51V60M32 51V60M41 51V60M4 23H13M4 32H13M4 41H13M51 23H60M51 32H60M51 41H60"],
    gear: ["M27 6H37L40 14L49 13L56 20L54 29L59 34L56 43L47 45L44 54L35 58L28 53L19 56L12 50L13 41L6 37V27L14 23L15 14L23 10Z", "M32 21A11 11 0 1 0 32 43A11 11 0 1 0 32 21Z"]
  };
  var iconPaths = {};
  var ICON_RULES = [
    [/funnel|filter/, "funnel"], [/warehouse|factory|oven|workshop|plant|kiln|production|station|assembly|weld/, "factory"],
    [/farm|land:|cocoa|harvest|environment/, "farm"], [/courier|truck|delivery|transport|dispatch|freight/, "truck"],
    [/carton|box|inventory|stock|materials|component/, "box"], [/store|shop|retail|outlet|franchis/, "shop"],
    [/scale|trade.off|weigh|balance|judgement/, "scale"], [/people|employee|labour|worker|customer|hire|staff|team|interview|owner|shareholder/, "people"],
    [/goal|target|objective|aim/, "target"], [/training|qualification|reward|quality/, "award"],
    [/org_|network|reporting|hierarchy|distribution/, "network"], [/questionnaire|paper|invoice|contract|survey|document|report|record|formula/, "document"],
    [/communication|message|channel|feedback|advert|promotion/, "message"], [/clock|time|speed|delay/, "clock"],
    [/product|snack|pack|sachet/, "package"], [/map|location|site|pin/, "pin"], [/price|label|cost|voucher/, "tag"],
    [/global|world|export|import|tariff|overseas|exchange/, "globe"], [/shield|legal|risk|protect|safety|inspection/, "shield"],
    [/bank|loan|capital|credit/, "bank"], [/coin|cash|profit|revenue|fund|finance|money|tax|wage/, "coin"],
    [/calendar|month|forecast/, "calendar"], [/graph|chart|meter|gauge|rise|result|sales|output/, "chart"],
    [/technology|machine|equipment|process/, "gear"]
  ];

  function picture(ctx, key, x, y, size, color) {
    var paths = ICON_PATHS[key];
    if (!iconPaths[key]) iconPaths[key] = paths.map(function (path) { return new Path2D(path); });
    var shape = iconPaths[key];
    ctx.save();
    ctx.translate(x, y); ctx.scale(size / 64, size / 64);
    ctx.fillStyle = hexAlpha(color, .42);
    ctx.strokeStyle = color; ctx.lineWidth = 2.8;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.fill(shape[0]); ctx.stroke(shape[0]);
    ctx.strokeStyle = PALETTE.ink; ctx.lineWidth = 2;
    ctx.stroke(shape[1]);
    ctx.restore();
  }

  function iconFor(label, fallback) {
    var rule = ICON_RULES.find(function (entry) { return entry[0].test(String(label).toLowerCase()); });
    return rule ? rule[1] : fallback;
  }

  function accentAt(i) {
    return [PALETTE.accent, PALETTE.accent2, PALETTE.warn, PALETTE.good, PALETTE.bad][i % 5];
  }

  function words(ctx, label, x, y, w, size, maxLines, align, color) {
    var lines = wrap(ctx, label, w, size, 750).slice(0, maxLines);
    lines.forEach(function (line, i) {
      text(ctx, line, x, y + (i - (lines.length - 1) / 2) * size * 1.15, size, color || PALETTE.ink, 750, align, w);
    });
  }

  function panel(ctx, x, y, w, h, color, opacity) {
    var fill = ctx.createLinearGradient(x, y, x + w, y + h);
    fill.addColorStop(0, hexAlpha(PALETTE.bg, opacity || .95));
    fill.addColorStop(1, hexAlpha(PALETTE.panel, opacity || .95));
    ctx.fillStyle = fill;
    ctx.strokeStyle = hexAlpha(color, .56); ctx.lineWidth = 1.5;
    rr(ctx, x, y, w, h, 20); ctx.fill(); ctx.stroke();
  }

  function reveal(local, index) {
    return Math.max(.72, Math.min(1, .72 + (local - index * .28) * .38));
  }

  function pictogram(ctx, label, x, y, w, h, i, art, local, type) {
    var color = accentAt(i), key = iconFor((type || "") + " " + label, art[i % art.length]);
    ctx.save();
    ctx.globalAlpha = reveal(local, i);
    panel(ctx, x, y, w, h, color);
    var size = Math.min(68, h * .41);
    picture(ctx, key, x + (w - size) / 2, y + h * .13, size, color);
    words(ctx, label, x + w / 2, y + h * .74, w - 24, Math.min(22, w / 8), 3, "center");
    ctx.restore();
  }

  function drawBackdrop(ctx, W, H, t, art, scene) {
    var g = ctx.createLinearGradient(0, H, W, 0);
    g.addColorStop(0, PALETTE.bg);
    g.addColorStop(.48, PALETTE.bg2);
    g.addColorStop(1, PALETTE.panel);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    [0, 1, 2].forEach(function (i) {
      var x = W * [.14, .87, .52][i] + Math.sin(t * .32 + i) * 31;
      var y = H * [.88, .27, .48][i] + Math.cos(t * .25 + i) * 27;
      var glow = ctx.createRadialGradient(x, y, 0, x, y, W * .42);
      glow.addColorStop(0, hexAlpha(accentAt(i + scene.scene_number - 1), [.52, .62, .24][i]));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    });

    ctx.save();
    ctx.strokeStyle = hexAlpha(PALETTE.ink, .12); ctx.lineWidth = 1;
    for (var y = 120; y < H; y += 45) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (var x = -H; x < W; x += 86) {
      ctx.beginPath(); ctx.moveTo(x, 98); ctx.lineTo(x + H * .54, H); ctx.stroke();
    }
    ctx.globalAlpha = .17;
    picture(ctx, art[1], 8, 426, 232, accentAt(0));
    picture(ctx, art[2], W - 252, 103, 246, accentAt(1));
    ctx.restore();

    ctx.fillStyle = hexAlpha(PALETTE.bg, .90); ctx.fillRect(0, 0, W, 106);
    var footer = ctx.createLinearGradient(0, 561, 0, H);
    footer.addColorStop(0, "transparent"); footer.addColorStop(.67, hexAlpha(PALETTE.bg, .92));
    footer.addColorStop(1, PALETTE.bg);
    ctx.fillStyle = footer; ctx.fillRect(0, 561, W, H - 561);
  }

  function drawIllustration(ctx, art, x, y, w, h, local, leadIcon) {
    panel(ctx, x, y, w, h, PALETTE.accent, .72);
    var cx = x + w * .5, cy = y + h * .49;
    var r = Math.min(w * .31, h * .43);
    var light = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.3);
    light.addColorStop(0, hexAlpha(PALETTE.accent, .48)); light.addColorStop(1, "transparent");
    ctx.fillStyle = light; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.strokeStyle = hexAlpha(PALETTE.accent2, .52); ctx.lineWidth = 2;
    ctx.setLineDash([4, 9]);
    ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.25, r * .78, -.22, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    var size = r * 1.32, bob = Math.sin(local * 1.25) * 5;
    picture(ctx, leadIcon || art[0], cx - size / 2, cy - size / 2 + bob, size, PALETTE.accent);
    [1, 2].forEach(function (i) {
      var satelliteX = cx + (i === 1 ? -r * 1.16 : r * 1.16);
      var satelliteY = cy + (i === 1 ? r * .42 : -r * .42);
      var satelliteSize = r * .64;
      ctx.beginPath(); ctx.arc(satelliteX, satelliteY, satelliteSize * .68, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.panel; ctx.fill();
      ctx.strokeStyle = hexAlpha(accentAt(i), .75); ctx.stroke();
      picture(ctx, art[i], satelliteX - satelliteSize / 2, satelliteY - satelliteSize / 2, satelliteSize, accentAt(i));
    });
  }

  function drawNotes(ctx, labels, x, y, w, h, art, local) {
    var gap = 9, rows = Math.max(1, labels.length);
    var row = Math.min(104, (h - gap * (rows - 1)) / rows);
    var top = y + (h - (row * rows + gap * (rows - 1))) / 2;
    labels.forEach(function (label, i) {
      var yy = top + i * (row + gap), color = accentAt(i);
      ctx.save(); ctx.globalAlpha = reveal(local, i);
      panel(ctx, x, yy, w, row, color);
      var size = Math.min(40, row - 12);
      picture(ctx, iconFor(label, art[i % art.length]), x + 17, yy + (row - size) / 2, size, color);
      var font = Math.min(22, row / 3.2);
      words(ctx, label, x + 71, yy + row / 2, w - 87, font, 3, "left");
      ctx.restore();
    });
  }

  function drawFeatures(ctx, labels, ad, art, local, dur) {
    var elements = ad.elements || [];
    var lead = /balance_scale/.test(ad.layout || "") ? "scale" : art[0];
    var satellites = elements.map(function (element) {
      return iconFor(element.type + " " + (element.label || ""), "");
    }).filter(Boolean);
    var sceneArt = Array.from(new Set([lead].concat(satellites, art))).slice(0, 3);
    drawIllustration(ctx, sceneArt, 49, 127, 650, 444, local);
    drawNotes(ctx, labels, 726, 134, 503, 430, art, local);
    var counter = elements.find(function (e) {
      return e.type === "animated_counter" && typeof e.from === "number" && typeof e.to === "number" && (e.label || e.target);
    });
    if (counter) {
      var val = counter.from + (counter.to - counter.from) * Math.min(1, local / (dur * .65));
      panel(ctx, 165, 485, 418, 69, PALETTE.warn);
      var precision = Math.max(String(counter.from).split(".")[1]?.length || 0, String(counter.to).split(".")[1]?.length || 0);
      text(ctx, (counter.prefix || "") + val.toLocaleString("en", { maximumFractionDigits: precision }) + (counter.suffix || ""),
        184, 519, 28, PALETTE.warn, 850, "left", 165);
      words(ctx, counter.label || counter.target, 370, 519, 185, 17, 2, "left");
    }
  }

  function connector(ctx, x1, y1, x2, y2, color, local) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(a - .55), y2 - 10 * Math.sin(a - .55));
    ctx.moveTo(x2, y2); ctx.lineTo(x2 - 10 * Math.cos(a + .55), y2 - 10 * Math.sin(a + .55)); ctx.stroke();
    var p = (local * .65) % 1;
    ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 3, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.ink; ctx.fill();
  }

  function drawSequence(ctx, labels, ad, art, local, timeline) {
    var hasStages = Array.isArray(ad.flow_nodes);
    var stages = hasStages ? ad.flow_nodes : labels;
    var n = stages.length;
    var rowSize = n > 5 ? Math.ceil(n / 2) : n;
    var gap = 33, w = Math.min(265, (1160 - (rowSize - 1) * gap) / Math.max(1, rowSize));
    var full = rowSize * w + (rowSize - 1) * gap;
    var layout = ad.layout || "";
    var parallel = /parallel/.test(layout) && stages.length > 5;
    var linked = !parallel && (hasStages || /sequence|route|line|stage|chain|path|timeline|flow|steps/.test(layout));
    stages.forEach(function (label, i) {
      var row = Math.floor(i / rowSize);
      var col = row && !parallel ? rowSize - 1 - i % rowSize : i % rowSize;
      var x = (1280 - full) / 2 + col * (w + gap), y = n > 5 ? 145 + row * 211 : 216;
      var h = 144;
      if (i && i % rowSize && linked) {
        if (row) connector(ctx, x + w + gap - 4, y + h / 2, x + w + 5, y + h / 2, accentAt(i), local);
        else connector(ctx, x - gap + 4, y + h / 2, x - 5, y + h / 2, accentAt(i), local);
      }
      if (i === rowSize && linked) connector(ctx, x + w / 2, y - 63, x + w / 2, y - 7, accentAt(i), local);
      pictogram(ctx, label, x, y, w, h, i, art, local);
      if (timeline) {
        var mid = x + w / 2;
        ctx.strokeStyle = hexAlpha(accentAt(i), .7); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(mid, y + h); ctx.lineTo(mid, y + h + 44); ctx.stroke();
        ctx.beginPath(); ctx.arc(mid, y + h + 44, 9, 0, Math.PI * 2); ctx.fillStyle = accentAt(i); ctx.fill();
      }
    });
    if (timeline && n) {
      ctx.strokeStyle = hexAlpha(PALETTE.ink, .46); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo((1280 - full + w) / 2, 404); ctx.lineTo((1280 + full - w) / 2, 404); ctx.stroke();
    }
    if (hasStages && n <= 5) drawNotes(ctx, labels, 185, 411, 910, 155, art, local);
    if (parallel) {
      words(ctx, "Primary research", 640, 123, 500, 20, 1, "center");
      words(ctx, "Secondary research", 640, 334, 500, 20, 1, "center");
    }
  }

  function drawBranches(ctx, labels, ad, art, local) {
    var root = labels[0], branches = labels.slice(1);
    var layout = ad.layout || "";
    var choice = /choice_node/.test(layout);
    var jobs = /job line/.test(String(ad.flow_nodes));
    if (choice) branches = labels.slice(1, 3);
    if (jobs) {
      root = ad.flow_nodes[0];
      branches = labels;
    }
    var w = Math.min(300, (1160 - (branches.length - 1) * 25) / Math.max(1, branches.length));
    var left = (1280 - (branches.length * w + (branches.length - 1) * 25)) / 2;
    branches.forEach(function (label, i) {
      var x = left + i * (w + 25);
      connector(ctx, 640, 283, x + w / 2, 348, accentAt(i + 1), local);
      pictogram(ctx, label, x, 355, w, 152, i + 1, art, local);
    });
    pictogram(ctx, root, 475, 130, 330, 150, 0, art, local);
    if (choice && labels[3]) text(ctx, labels[3], 640, 551, 22, PALETTE.warn, 800, "center", 1120);
  }

  function drawComparison(ctx, labels, art, local) {
    var n = labels.length, columns = n > 2 ? n : 2;
    var w = Math.min(435, (1150 - (columns - 1) * 20) / columns);
    var left = (1280 - (n * w + (n - 1) * 20)) / 2;
    labels.forEach(function (label, i) {
      pictogram(ctx, label, left + i * (w + 20), 201, w, 278, i, art, local);
    });
    if (n === 2) {
      picture(ctx, "scale", 613, 509, 54, PALETTE.warn);
    }
  }

  function drawFunnel(ctx, labels, ad, art, local) {
    var nodes = Array.isArray(ad.flow_nodes) ? ad.flow_nodes : labels;
    drawIllustration(ctx, art, 808, 145, 419, 397, local, "funnel");
    var row = Math.min(83, 397 / Math.max(nodes.length, 1));
    var top = 145 + (397 - row * nodes.length) / 2;
    nodes.forEach(function (label, i) {
      var w = 700 - i * 66, x = 413 - w / 2, y = top + i * row, color = accentAt(i);
      ctx.save(); ctx.globalAlpha = reveal(local, i);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y);
      ctx.lineTo(x + w - 25, y + row - 9); ctx.lineTo(x + 25, y + row - 9); ctx.closePath();
      ctx.fillStyle = hexAlpha(color, .82); ctx.fill();
      words(ctx, label, 413, y + (row - 9) / 2, w - 70, 21, 2, "center", "#0B1425");
      ctx.restore();
    });
  }

  function drawOrganization(ctx, labels, ad, art, local) {
    var layout = ad.layout || "";
    if (/four_column|seven_ownership|two_owner|internal_org/.test(layout)) {
      drawComparison(ctx, labels, art, local);
      return;
    }
    if (/bidirectional/.test(layout)) {
      pictogram(ctx, labels[0], 83, 221, 326, 204, 0, art, local, "factory");
      pictogram(ctx, labels[1], 871, 221, 326, 204, 1, art, local, "factory");
      connector(ctx, 426, 284, 853, 284, PALETTE.accent, local);
      connector(ctx, 853, 376, 426, 376, PALETTE.accent2, local);
      words(ctx, labels[2], 640, 248, 400, 22, 2, "center");
      words(ctx, labels[3], 640, 414, 400, 22, 2, "center");
      return;
    }
    if ((ad.elements || []).some(function (e) { return e.from_levels === 5 && e.to_levels === 3; })) {
      [5, 3].forEach(function (levels, i) {
        var x = i ? 652 : 49, color = accentAt(i);
        panel(ctx, x, 132, 579, 426, color);
        words(ctx, labels[i], x + 289, 164, 530, 22, 2, "center");
        for (var j = 0; j < levels; j++) {
          var y = 203 + j * (248 / (levels - 1));
          var span = i ? 8 : 3;
          var count = j === levels - 1 ? span : 1;
          for (var k = 0; k < count; k++) {
            var cx = x + 289 + (k - (count - 1) / 2) * 53;
            if (j) connector(ctx, x + 289, y - 248 / (levels - 1) + 20, cx, y - 21, color, local);
            picture(ctx, "people", cx - 20, y - 20, 40, color);
          }
        }
      });
      words(ctx, labels[2], 640, 536, 510, 16, 1, "center");
      return;
    }
    drawBranches(ctx, labels, ad, art, local);
  }

  function drawCycle(ctx, labels, art, local) {
    var positions = labels.length === 5
      ? [[640, 192], [1018, 315], [875, 508], [405, 508], [262, 315]]
      : [[640, 192], [1031, 350], [640, 510], [249, 350]];
    positions.forEach(function (pos, i) {
      var next = positions[(i + 1) % positions.length];
      var dx = next[0] - pos[0], dy = next[1] - pos[1];
      connector(ctx, pos[0] + dx * .37, pos[1] + dy * .37, next[0] - dx * .37, next[1] - dy * .37, accentAt(i), local);
    });
    picture(ctx, art[0], 572, 282, 136, PALETTE.accent);
    labels.forEach(function (label, i) {
      var pos = positions[i];
      pictogram(ctx, label, pos[0] - 135, pos[1] - 59, 270, 118, i, art, local, "chart");
    });
  }

  function drawFormula(ctx, labels, ad, art, local) {
    var eq = Array.isArray(ad.substitution) ? ad.substitution.join(" ") : labels.find(function (label) { return label.includes("="); });
    if (!eq) {
      drawNotes(ctx, labels, 478, 130, 747, 434, art, local);
      drawIllustration(ctx, art, 54, 130, 394, 434, local, "document");
      return;
    }
    panel(ctx, 54, 139, 1172, 145, PALETTE.warn);
    picture(ctx, "document", 84, 176, 72, PALETTE.warn);
    words(ctx, eq, 683, 214, 990, eq.length > 60 ? 31 : 42, 2, "center");
    drawNotes(ctx, labels.filter(function (label) { return label !== eq; }), 166, 297, 948, 273, art, local);
  }

  function drawPlot(ctx, lines, bounds, labels, art, local, dur, highlight) {
    var L = 129, R = 786, T = 189, B = 482;
    var xp = function (x) { return L + (R - L) * (x - bounds.x.min) / (bounds.x.max - bounds.x.min); };
    var yp = function (y) { return B - (B - T) * (y - bounds.y.min) / (bounds.y.max - bounds.y.min); };
    panel(ctx, 44, 129, 783, 447, PALETTE.accent);
    text(ctx, bounds.y.label, L, 155, 19, PALETTE.ink, 750);
    text(ctx, bounds.x.label, R, 523, 18, PALETTE.ink, 750, "right");
    ctx.strokeStyle = hexAlpha(PALETTE.ink, .7); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    [bounds.y, bounds.x].forEach(function (axis, index) {
      var count = Math.min(10, Math.floor((axis.max - axis.min) / axis.tick));
      for (var i = 1; i <= count; i++) {
        var value = axis.min + i * axis.tick, xy = index ? xp(value) : yp(value);
        ctx.strokeStyle = hexAlpha(PALETTE.ink, .18); ctx.lineWidth = 1;
        ctx.beginPath();
        if (index) { ctx.moveTo(xy, T); ctx.lineTo(xy, B); }
        else { ctx.moveTo(L, xy); ctx.lineTo(R, xy); }
        ctx.stroke();
        if (!index || count < 8 || i % 2 === 0) {
          var tickLabel = axis.categories ? axis.categories[i - 1] : value.toLocaleString("en");
          text(ctx, tickLabel, index ? xy : L - 11, index ? B + 17 : xy, 14, PALETTE.muted, 650, index ? "center" : "right");
        }
      }
    });
    if (!bounds.x.categories) text(ctx, String(bounds.x.min), L - 9, B + 16, 14, PALETTE.muted, 650, "right");
    lines.forEach(function (line, index) {
      var points = line.points, color = accentAt(index);
      var fraction = Math.min(1, Math.max(.03, (local / dur - index * .08) * 2.2));
      var end = fraction * (points.length - 1);
      ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(xp(points[0][0]), yp(points[0][1]));
      for (var j = 1; j < points.length && j - 1 < end; j++) {
        var start = points[j - 1], stop = points[j], f = Math.min(1, end - j + 1);
        ctx.lineTo(xp(start[0] + (stop[0] - start[0]) * f), yp(start[1] + (stop[1] - start[1]) * f));
      }
      ctx.stroke();
      ctx.fillStyle = color; ctx.fillRect(L + index * 196, 550, 19, 5);
      text(ctx, line.label, L + 27 + index * 196, 553, 16, PALETTE.ink, 700, "left", 165);
    });
    if (highlight && local / dur > .48) {
      var hx = xp(highlight.x), hy = yp(highlight.y);
      ctx.strokeStyle = PALETTE.warn; ctx.lineWidth = 2; ctx.setLineDash([7, 5]);
      ctx.beginPath(); ctx.moveTo(L, hy); ctx.lineTo(hx, hy); ctx.lineTo(hx, B); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.fillStyle = PALETTE.warn; ctx.fill();
      panel(ctx, hx + 15, hy + 10, 272, 35, PALETTE.warn);
      text(ctx, highlight.label, hx + 25, hy + 28, 16, PALETTE.ink, 800, "left", 252);
    }
    drawNotes(ctx, labels, 847, 139, 383, 420, art, local);
  }

  function drawBars(ctx, series, label, labels, art, local, dur, prefix, suffix) {
    panel(ctx, 50, 130, 734, 442, PALETTE.accent);
    words(ctx, label, 417, 166, 664, 22, 2, "center");
    var max = Math.max.apply(null, series.map(Math.abs)) || 1;
    var negative = series.some(function (value) { return value < 0; });
    var base = negative ? 357 : 490;
    var span = Math.min(200, 645 / series.length);
    var left = 417 - span * series.length / 2;
    ctx.strokeStyle = hexAlpha(PALETTE.ink, .46); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(107, base); ctx.lineTo(727, base); ctx.stroke();
    series.forEach(function (value, i) {
      var x = left + span * i + span * .18, color = accentAt(i), scale = Math.min(1, local / (dur * .48));
      var h = Math.abs(value) / max * (negative ? 124 : 258) * scale;
      var y = value < 0 ? base : base - h;
      var gradient = ctx.createLinearGradient(x, y, x + span * .64, y + h);
      gradient.addColorStop(0, color); gradient.addColorStop(1, hexAlpha(color, .45));
      ctx.fillStyle = gradient;
      if (h > 0) { rr(ctx, x, y, span * .64, h, 8); ctx.fill(); }
      text(ctx, (value < 0 ? "−" : "") + (prefix || "") + Math.abs(value).toLocaleString("en") + (suffix || ""), x + span * .32,
        value < 0 ? y + h + 20 : y - 18, 22, PALETTE.ink, 850, "center", span - 6);
    });
    drawNotes(ctx, labels, 810, 139, 420, 420, art, local);
  }

  function drawMarketShare(ctx, labels, art, local, dur) {
    panel(ctx, 49, 129, 720, 442, PALETTE.accent);
    ctx.lineWidth = 63;
    ctx.strokeStyle = hexAlpha(PALETTE.accent2, .45);
    ctx.beginPath(); ctx.arc(409, 349, 152, 0, Math.PI * 2); ctx.stroke();
    var portion = .2 * Math.min(1, local / (dur * .54));
    ctx.strokeStyle = PALETTE.warn;
    ctx.beginPath(); ctx.arc(409, 349, 152, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * portion); ctx.stroke();
    text(ctx, Math.round(portion * 100) + "%", 409, 326, 63, PALETTE.ink, 850, "center");
    text(ctx, "Market share", 409, 383, 23, PALETTE.warn, 750, "center");
    drawNotes(ctx, labels, 799, 134, 430, 430, art, local);
  }

  function drawMarketingMix(ctx, art, local) {
    var nodes = ["Product", "Price", "Place", "Promotion"];
    var icons = ["headphones", "tag", "shop", "message"];
    var positions = [[89, 157], [911, 157], [89, 374], [911, 374]];
    picture(ctx, art[0], 521, 214, 238, PALETTE.accent);
    nodes.forEach(function (node, i) {
      var pos = positions[i], x = pos[0] + (i % 2 ? 0 : 280), y = pos[1] + 70;
      ctx.strokeStyle = hexAlpha(accentAt(i), .8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(i % 2 ? 767 : 513, 335); ctx.stroke();
      var cardArt = [icons[i]];
      pictogram(ctx, node, pos[0], pos[1], 280, 140, i, cardArt, local, icons[i]);
    });
  }

  function drawScene(ctx, video, scene, t, W, H) {
    var local = Math.max(0, t - scene.start_sec), dur = Math.max(1, scene.end_sec - scene.start_sec);
    var p = Math.min(1, local / dur);
    var ad = scene.animation_directives || {}, els = ad.elements || [];
    var labels = scene.on_screen_labels || [];
    var art = EPISODE_ART[video.video_id] || ["shop", "chart", "people"];
    var vt = scene.visual_type || "", layout = ad.layout || "";
    applyTheme(video.unit_number);
    drawBackdrop(ctx, W, H, t, art, scene);

    text(ctx, video.chapter_title || ("Chapter " + video.chapter_code), 49, 28, 18, PALETTE.accent, 750, "left", 970);
    text(ctx, scene.on_screen_title || video.video_title, 49, 66, 34, PALETTE.ink, 850, "left", W - 98);
    text(ctx, "Scene " + scene.scene_number + " / " + video.scenes.length, W - 49, 28, 16, PALETTE.muted, 700, "right");
    ctx.fillStyle = hexAlpha(PALETTE.ink, .16); ctx.fillRect(49, 96, W - 98, 4);
    var progress = ctx.createLinearGradient(49, 0, W - 49, 0);
    progress.addColorStop(0, PALETTE.accent); progress.addColorStop(1, PALETTE.accent2);
    ctx.fillStyle = progress; ctx.fillRect(49, 96, (W - 98) * p, 4);

    var axes = ad.axes;
    var detailedLines = (ad.lines || []).filter(function (line) { return Array.isArray(line.from) && Array.isArray(line.to); });
    var costPoints = els.filter(function (e) { return e.type === "data_point" && typeof e.average_cost === "number"; });
    var bars = els.find(function (e) { return e.type === "bar_chart" && Array.isArray(e.series) && e.series.every(Number.isFinite); });
    if (axes && axes.x && axes.y && detailedLines.length) {
      drawPlot(ctx, detailedLines.map(function (line) { return { label: line.label, points: [line.from, line.to] }; }),
        axes, labels, art, local, dur, ad.highlight_intersection);
    } else if (ad.curve_stages) {
      var stages = ad.curve_stages;
      var stageNames = stages.map(function (stage) { return stage.name[0].toUpperCase() + stage.name.slice(1); });
      drawPlot(ctx, [{ label: "Example unit sales", points: stages.map(function (stage, i) { return [i + 1, stage.units]; }) }],
        { x: { min: 0, max: stages.length, tick: 1, label: "Time", categories: stageNames },
          y: { min: 0, max: 16000, tick: 4000, label: "Unit sales" } }, labels, art, local, dur);
    } else if (costPoints.length > 1) {
      drawPlot(ctx, [{ label: "Long-run average cost", points: costPoints.map(function (e) { return [e.x, e.average_cost]; }) }],
        { x: { min: 0, max: 1600, tick: 400, label: "Output (loaves)" },
          y: { min: 0, max: 10, tick: 2, label: "Average cost ($ per loaf)" } }, labels, art, local, dur);
    } else if (els.some(function (e) { return e.type === "ring_chart"; }) && scene.on_screen_title === "Market Share Ring Builds") {
      drawMarketShare(ctx, labels, art, local, dur);
    } else if (bars && bars.series.length) {
      drawBars(ctx, bars.series, bars.label, labels, art, local, dur, bars.prefix, bars.suffix);
    } else if (video.video_id === "VID_U5_02" && (scene.scene_number === 3 || scene.scene_number === 4)) {
      var earlier = scene.scene_number === 3;
      drawBars(ctx, earlier ? [16000, 11000] : [1000, -4000],
        earlier ? "Closing balance · Months 1 and 2" : "Closing balance · Months 3 and 4", labels, art, local, dur, "$");
    } else if (video.video_id === "VID_U3_03" && scene.scene_number === 1) {
      drawMarketingMix(ctx, art, local);
      words(ctx, labels[2], 640, 544, 550, 24, 1, "center");
    } else if (vt === "formula_substitution") {
      drawFormula(ctx, labels, ad, art, local);
    } else if (/org_chart/.test(vt)) {
      drawOrganization(ctx, labels, ad, art, local);
    } else if (/choice_node/.test(layout) || /job line/.test(String(ad.flow_nodes))) {
      drawBranches(ctx, labels, ad, art, local);
    } else if (/funnel/.test(vt)) {
      drawFunnel(ctx, labels, ad, art, local);
    } else if (/cycle_unrolled|circular_flow/.test(layout) || (video.video_id === "VID_U6_01" && scene.scene_number === 1)) {
      var cycleLabels = Array.isArray(ad.flow_nodes) ? ad.flow_nodes : labels.slice(0, 4);
      drawCycle(ctx, cycleLabels, art, local);
    } else if (/split|evaluation/.test(vt)) {
      drawComparison(ctx, labels, art, local);
    } else if (/flow|timeline/.test(vt)) {
      drawSequence(ctx, labels, ad, art, local, /timeline/.test(vt));
    } else {
      drawFeatures(ctx, labels, ad, art, local, dur);
    }
  }

  /* ------------------------------------------------------------------ player */
  function sceneAt(video, t) {
    var s = video.scenes;
    for (var i = 0; i < s.length; i++) if (t < s[i].end_sec) return s[i];
    return s[s.length - 1];
  }
  function captionChunk(scene, t) {
    var sents = String(scene.voiceover_script || "").split(/(?<=[.!?])\s+/).filter(Boolean);
    if (!sents.length) return "";
    var dur = Math.max(1, scene.end_sec - scene.start_sec);
    var idx = Math.min(sents.length - 1, Math.floor(((t - scene.start_sec) / dur) * sents.length));
    var out = sents[idx] || "";
    var w = out.split(/\s+/).length;
    if (w > 18) out = w > 0 ? out.split(/\s+/).slice(0, 18).join(" ") + "…" : out;
    return out;
  }
  function sentenceChunks(text) {
    return String(text || "").split(/(?<=[.!?])\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function wordCount(text) {
    var m = String(text || "").match(/\S+/g);
    return m ? m.length : 0;
  }
  /* Web Speech is a silent fallback only, used when a narration clip is missing.
     It quietly prefers a natural English voice; there is no voice picker. */
  function refreshVoices() {
    if (!window.speechSynthesis || typeof speechSynthesis.getVoices !== "function") return;
    var raw = [];
    try { raw = speechSynthesis.getVoices() || []; } catch (e) { return; }
    var scored = raw.map(function (v, i) {
      var name = String(v.name || ""), lang = String(v.lang || ""), score = 0;
      if (/natural|neural|premium|enhanced|aria|jenny|samantha|google uk english|google us english|zira|hazel/i.test(name)) score += 120;
      if (/espeak|compact|robotic/i.test(name)) score -= 200;
      if (/^en-gb/i.test(lang)) score += 30;
      else if (/^en-us/i.test(lang)) score += 20;
      else if (/^en/i.test(lang)) score += 8;
      if (v.localService) score += 12;
      return { voice: v, index: i, score: score };
    }).filter(function (x) { return /^en/i.test(String(x.voice.lang || "")) && x.score > -100; });
    scored.sort(function (a, b) { return b.score - a.score || a.index - b.index; });
    state.voices = scored.map(function (x) { return x.voice; });
  }
  function pickVoice() { return state.voices[0] || null; }
  function clearSpeech() {
    state.speechToken += 1;
    state.speechTimers.forEach(function (id) { clearTimeout(id); });
    state.speechTimers = [];
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }
  /* Sentence-by-sentence delivery: intonation resets at full stops, pauses
     land on punctuation, and small pitch/rate shifts avoid a flat robotic drone. */
  function speak(scene, offsetSec) {
    clearSpeech();
    var token = state.speechToken;
    if (!state.voiceOn || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
    var dur = Math.max(1, scene.end_sec - scene.start_sec);
    var offset = Math.max(0, Math.min(dur - .2, Number(offsetSec) || 0));
    var parts = sentenceChunks(scene.voiceover_script);
    if (!parts.length) return;
    var total = parts.reduce(function (n, s) { return n + wordCount(s); }, 0) || 1;
    var acc = 0;
    var baseRate = Math.max(.9, Math.min(1.08, (scene.word_count / dur) / 2.5));
    parts.forEach(function (part, i) {
      var n = wordCount(part);
      var start = acc / total * dur;
      acc += n;
      if (acc / total * dur <= offset) return;
      var wait = Math.max(0, start - offset);
      var timer = setTimeout(function () {
        if (token !== state.speechToken || !state.player || !state.player.playing) return;
        try {
          var u = new SpeechSynthesisUtterance(part);
          var voice = pickVoice();
          if (voice) { u.voice = voice; u.lang = voice.lang || "en-GB"; }
          else u.lang = "en-GB";
          u.rate = baseRate * (1 + ((i % 3) - 1) * .025);
          u.pitch = 1 + ((i % 2) ? .025 : -.015);
          u.volume = 1;
          window.speechSynthesis.speak(u);
        } catch (e) {}
      }, wait * 1000);
      state.speechTimers.push(timer);
    });
  }
  /* True only when a usable narration clip exists and voice is enabled.
     Otherwise the Web Speech engine silently takes over. */
  function canUseNarration(videoId, sceneNum) {
    if (!state.audioOn || !state.audioIndex || !state.audioIndex.videos) return false;
    var meta = state.audioIndex.videos[videoId];
    var clip = meta && meta.clips && meta.clips[String(sceneNum)];
    return !!(clip && clip.duration);
  }
  function syncAudio(audioEl, player, sc, offsetSec) {
    if (!audioEl) return;
    if (!state.audioOn || !state.audioIndex) { audioEl.pause(); return; }
    var meta = state.audioIndex.videos && state.audioIndex.videos[player.video.video_id];
    var clip = meta && meta.clips && meta.clips[String(sc.scene_number)];
    if (!clip || !clip.duration) { audioEl.pause(); return; }
    var sceneDur = Math.max(1, sc.end_sec - sc.start_sec);
    audioEl.playbackRate = Math.max(.75, Math.min(1.3, clip.duration / sceneDur));
    if (audioEl.getAttribute("data-clip") !== clip.file) {
      audioEl.setAttribute("data-clip", clip.file);
      audioEl.src = clip.file;
    }
    var target = Math.max(0, Math.min(clip.duration - .05, (Number(offsetSec) || 0) * audioEl.playbackRate));
    if (Math.abs(audioEl.currentTime - target) > .35) {
      try { audioEl.currentTime = target; } catch (e) {}
    }
    if (player.playing) {
      var pr = audioEl.play();
      if (pr && typeof pr.catch === "function") pr.catch(function () {});
    }
  }
  function saveProgress(video, t, completed) {
    var pr = progressFor(video.video_id);
    pr.watched_sec = Math.max(pr.watched_sec || 0, Math.round(t));
    if (completed) pr.completed = true;
    pr.last_scene = sceneAt(video, t).scene_number;
    state.progress[video.video_id] = pr;
    EC.store.set(PROGRESS_KEY, state.progress);
  }

  function openPlayer(video) {
    if (!video) return;
    closePlayer();
    ensureStyles();
    var overlay = document.createElement("div");
    overlay.className = "ecv-overlay";
    overlay.innerHTML =
      '<div class="ecv-player" role="dialog" aria-modal="true" aria-label="' + esc(video.video_title) + '">' +
        '<div class="ecv-player-head"><div><strong>' + esc(video.video_title) + '</strong>' +
          '<small>' + esc(video.video_id) + ' · ' + esc(video.chapter_code) + ' · ' + video.target_duration_sec + 's · ' + video.scenes.length + ' animated scenes ' +
          '<span class="ecv-voice-tag" data-voice-tag>VOICE · ON</span></small></div>' +
          '<button type="button" class="ecv-close" aria-label="Close video">✕ Close</button></div>' +
        '<div class="ecv-stage"><canvas class="ecv-canvas" width="1280" height="720"></canvas>' +
          '<div class="ecv-caption" aria-live="off"></div><div class="ecv-quiz" hidden></div>' +
          '<audio class="ecv-audio" preload="auto"></audio></div>' +
        '<div class="ecv-controls">' +
          '<div class="ecv-scenes">' + video.scenes.map(function (s) { return '<i data-scene="' + s.scene_number + '"></i>'; }).join("") + '</div>' +
          '<input class="ecv-seek" type="range" min="0" max="' + video.target_duration_sec + '" value="0" step="1" aria-label="Seek video">' +
          '<div class="ecv-row">' +
            '<button type="button" class="ecv-btn" data-action="play">▶ Play</button>' +
            '<button type="button" class="ecv-btn" data-action="restart">↺ Restart</button>' +
            '<button type="button" class="ecv-btn" data-action="voice" data-on="1">🔊 Voiceover</button>' +
            '<button type="button" class="ecv-btn" data-action="captions" data-on="1">CC Captions</button>' +
            '<span class="ecv-time">00:00 / ' + Math.floor(video.target_duration_sec / 60) + ':' + String(video.target_duration_sec % 60).padStart(2, "0") + '</span>' +
          '</div></div></div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    var canvas = $(".ecv-canvas", overlay), ctx = canvas.getContext("2d");
    var caption = $(".ecv-caption", overlay), seek = $(".ecv-seek", overlay);
    var timeEl = $(".ecv-time", overlay), quizEl = $(".ecv-quiz", overlay);
    var audioEl = $(".ecv-audio", overlay);
    var playBtn = $('[data-action="play"]', overlay);
    var player = { video: video, overlay: overlay, t: 0, playing: false, last: 0, sceneNo: 0, quizShown: false };
    state.player = player;

    function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0"); }
    function paint() {
      var sc = sceneAt(video, player.t);
      drawScene(ctx, video, sc, player.t, canvas.width, canvas.height);
      caption.textContent = state.captionsOn ? captionChunk(sc, player.t) : "";
      caption.hidden = !state.captionsOn;
      seek.value = String(Math.min(video.target_duration_sec, Math.floor(player.t)));
      timeEl.textContent = fmt(player.t) + " / " + fmt(video.target_duration_sec);
      $$("[data-scene]", overlay).forEach(function (bar) {
        var n = Number(bar.getAttribute("data-scene"));
        bar.setAttribute("data-cur", n === sc.scene_number ? "1" : "0");
        bar.setAttribute("data-seen", n < sc.scene_number ? "1" : "0");
      });
      if (sc.scene_number !== player.sceneNo) {
        player.sceneNo = sc.scene_number;
        var offset = player.t - sc.start_sec;
        if (!canUseNarration(video.video_id, sc.scene_number)) speak(sc, offset);
        syncAudio(audioEl, player, sc, offset);
        saveProgress(video, player.t, false);
      }
    }
    function tick(now) {
      if (!player.playing || !state.player || state.player !== player) return;
      var dt = Math.min(.25, (now - player.last) / 1000 || 0);
      player.last = now;
      player.t += dt;
      if (player.t >= video.target_duration_sec) {
        player.t = video.target_duration_sec;
        player.playing = false;
        playBtn.textContent = "▶ Play";
        saveProgress(video, player.t, true);
        paint(); showQuiz();
        return;
      }
      paint();
      state.raf = requestAnimationFrame(tick);
    }
    function play() {
      if (player.t >= video.target_duration_sec) player.t = 0;
      player.playing = true; player.last = performance.now();
      playBtn.textContent = "❚❚ Pause";
      var sc = sceneAt(video, player.t), offset = player.t - sc.start_sec;
      if (!canUseNarration(video.video_id, sc.scene_number)) speak(sc, offset);
      syncAudio(audioEl, player, sc, offset);
      state.raf = requestAnimationFrame(tick);
    }
    function pause() {
      player.playing = false; cancelAnimationFrame(state.raf); playBtn.textContent = "▶ Play";
      clearSpeech(); audioEl.pause();
    }
    function showQuiz() {
      if (player.quizShown) return;
      player.quizShown = true;
      var q = video.end_of_video_recap_quiz;
      quizEl.hidden = false;
      quizEl.innerHTML = '<div class="ecv-quiz-box"><div class="ecv-kicker">End-of-video recap</div>' +
        '<h4>' + esc(q.question) + '</h4>' +
        q.options.map(function (o, i) { return '<button type="button" class="ecv-opt" data-opt="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>'; }).join("") +
        '<div class="ecv-explain" hidden></div>' +
        '<button type="button" class="ecv-close" data-action="finish" style="margin-top:12px">Finish &amp; back to library</button></div>';
      $$("[data-opt]", quizEl).forEach(function (b) {
        b.addEventListener("click", function () {
          var i = Number(b.getAttribute("data-opt"));
          $$("[data-opt]", quizEl).forEach(function (x) {
            var xi = Number(x.getAttribute("data-opt"));
            x.setAttribute("data-correct", xi === q.correct_index ? "1" : "0");
            if (xi === i && i !== q.correct_index) x.setAttribute("data-wrong", "1");
          });
          var ex = $(".ecv-explain", quizEl);
          ex.hidden = false;
          ex.innerHTML = '<strong>' + (i === q.correct_index ? "Correct." : "Not quite — the correct answer is " + String.fromCharCode(65 + q.correct_index) + ".") + '</strong><br>' + esc(q.visual_explanation);
        });
      });
      $('[data-action="finish"]', quizEl).addEventListener("click", closePlayer);
    }

    playBtn.addEventListener("click", function () { player.playing ? pause() : play(); });
    $('[data-action="restart"]', overlay).addEventListener("click", function () {
      pause(); player.t = 0; player.sceneNo = 0; player.quizShown = false; quizEl.hidden = true; paint(); play();
    });
    $('[data-action="voice"]', overlay).addEventListener("click", function () {
      state.voiceOn = !state.voiceOn;
      state.audioOn = state.voiceOn;
      this.setAttribute("data-on", state.voiceOn ? "1" : "0");
      var tag = $("[data-voice-tag]", overlay);
      if (tag) tag.textContent = state.voiceOn ? "VOICE · ON" : "VOICE · OFF";
      clearSpeech();
      audioEl.pause();
      if (state.voiceOn && player.playing) {
        var sc = sceneAt(video, player.t), offset = player.t - sc.start_sec;
        if (!canUseNarration(video.video_id, sc.scene_number)) speak(sc, offset);
        syncAudio(audioEl, player, sc, offset);
      }
    });
    $('[data-action="captions"]', overlay).addEventListener("click", function () {
      state.captionsOn = !state.captionsOn;
      this.setAttribute("data-on", state.captionsOn ? "1" : "0"); paint();
    });
    $(".ecv-close", overlay).addEventListener("click", closePlayer);
    seek.addEventListener("input", function () {
      player.t = Number(seek.value); player.sceneNo = 0; clearSpeech(); paint();
      var sc = sceneAt(video, player.t);
      syncAudio(audioEl, player, sc, player.t - sc.start_sec);
    });
    $$("[data-scene]", overlay).forEach(function (bar) {
      bar.addEventListener("click", function () {
        var n = Number(bar.getAttribute("data-scene"));
        player.t = video.scenes[n - 1].start_sec; player.sceneNo = 0; clearSpeech(); paint();
        syncAudio(audioEl, player, video.scenes[n - 1], 0);
      });
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closePlayer(); });
    state.keyHandler = function (e) {
      if (!state.player) return;
      if (e.key === "Escape") { closePlayer(); return; }
      if (e.key === " ") { e.preventDefault(); player.playing ? pause() : play(); }
      function nudge(delta) {
        player.t = Math.max(0, Math.min(video.target_duration_sec, player.t + delta));
        clearSpeech(); paint();
        var sc = sceneAt(video, player.t);
        syncAudio(audioEl, player, sc, player.t - sc.start_sec);
      }
      if (e.key === "ArrowRight") nudge(5);
      if (e.key === "ArrowLeft") nudge(-5);
    };
    document.addEventListener("keydown", state.keyHandler);
    paint(); play();
  }

  function closePlayer() {
    clearSpeech();
    if (state.player) cancelAnimationFrame(state.raf);
    if (state.keyHandler) document.removeEventListener("keydown", state.keyHandler);
    state.keyHandler = null;
    if (state.player && state.player.overlay) {
      var oldAudio = $(".ecv-audio", state.player.overlay);
      if (oldAudio) { oldAudio.pause(); oldAudio.removeAttribute("src"); }
      if (state.player.overlay.parentNode) state.player.overlay.parentNode.removeChild(state.player.overlay);
    }
    state.player = null;
    document.body.style.overflow = "";
    var main = document.getElementById("main");
    if (main && state.manifest && EC.current().name === "videos") drawLibrary(main);
  }

  /* ------------------------------------------------- chapter-study integration */
  var LESSON_VIDEO_MAP = {
    "6.3": "VID_U6_02", "6.4": "VID_U6_02", "6.5": "VID_U6_02",
    "4.4": "VID_U4_02", "4.5": "VID_U4_03", "4.6": "VID_U4_04",
    "3.5": "VID_U3_03", "3.6": "VID_U3_03", "3.7": "VID_U3_04"
  };
  function videoForLesson(lesson) {
    if (!lesson || !state.manifest) return null;
    var codes = (lesson.syllabusCodes || [lesson.id]);
    for (var i = 0; i < codes.length; i++) {
      var code = String(codes[i]);
      var id = LESSON_VIDEO_MAP[code] || ("VID_U" + code.split(".")[0] + "_" + code.split(".")[1]);
      if (state.byId[id]) return state.byId[id];
      var byChapter = state.manifest.videos.filter(function (v) { return v.chapter_code === code; })[0];
      if (byChapter) return byChapter;
    }
    return null;
  }
  function injectLessonButton(main) {
    if (!state.manifest || !main) return;
    var reader = $("#lesson-reader", main), header = reader && $("header", reader);
    if (!header || $(".ecv-lesson-link", header)) return;
    var activeId = null;
    var titleEl = $("#lesson-reader h2[id^='lesson-title-']", main);
    if (titleEl) activeId = titleEl.id.replace("lesson-title-", "");
    var vids = state.manifest.videos;
    var lesson = null;
    /* lessons.json is already cached in EC.load, so this resolves immediately. */
    EC.load("lessons").then(function (sections) {
      (sections || []).forEach(function (s) {
        (s.lessons || []).forEach(function (l) { if (l.id === activeId) lesson = l; });
      });
      var video = videoForLesson(lesson);
      if (!video) return;
      var bar = document.createElement("div");
      bar.className = "ecv-lesson-link mt-3";
      bar.innerHTML = '<button type="button" class="ecv-watch" style="max-width:340px">▶ Watch: ' +
        esc(video.video_title) + ' (' + video.target_duration_sec + 's)</button>';
      bar.querySelector("button").addEventListener("click", function () { openPlayer(video); });
      header.appendChild(bar);
    }).catch(function () {});
  }

  function installNav() {
    ensureStyles();
    if ($('[data-nav="videos"]')) return;
    var tools = $(".business-nav-tools");
    if (tools) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "navBtn"; b.setAttribute("data-nav", "videos");
      b.textContent = "▶ Videos";
      tools.appendChild(b);
    }
    var mobile = $(".site-mobile-navigation");
    if (mobile) {
      var m = document.createElement("button");
      m.type = "button";
      m.className = "w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#0F2042] dark:text-sky-300";
      m.setAttribute("data-nav", "videos");
      m.textContent = "▶ Concept videos (25)";
      mobile.insertBefore(m, mobile.firstChild);
    }
  }

  function boot() {
    if (!window.EC || !EC.views) { return; }
    refreshVoices();
    if (window.speechSynthesis && typeof speechSynthesis.addEventListener === "function") {
      speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    }
    /* Direct fetch with a version query so newly synthesized clips are picked
       up immediately instead of serving a stale cached index. */
    fetch("./data/video_audio_index.json?v=2").then(function (r) {
      if (!r.ok) throw new Error("audio index unavailable");
      return r.json();
    }).then(function (index) {
      state.audioIndex = index;
    }).catch(function () { state.audioIndex = null; });
    EC.register("videos", {
      title: "Concept videos",
      render: function (main, params) {
        installNav();
        return EC.load("videos_manifest").then(function (manifest) {
          state.manifest = manifest;
          state.byId = {};
          (manifest.videos || []).forEach(function (v) { state.byId[v.video_id] = v; });
          state.progress = EC.store.get(PROGRESS_KEY, {}) || {};
          drawLibrary(main);
          var id = params && params.get ? params.get("id") : null;
          if (id && state.byId[id]) openPlayer(state.byId[id]);
        }).catch(function (err) {
          main.innerHTML = '<div class="ecv-root ecv-empty">Video library unavailable: ' + esc(err && err.message) + '</div>';
        });
      }
    });
    /* Append a "watch video" action into the chapter study view without
       modifying lessons.js or any quiz/question-bank code. */
    var lessonsView = EC.views.lessons;
    if (lessonsView && typeof lessonsView.render === "function") {
      var originalRender = lessonsView.render;
      lessonsView.render = function (main, params, name) {
        var result = originalRender.apply(this, arguments);
        return Promise.resolve(result).then(function (value) {
          try { injectLessonButton(main); } catch (e) {}
          return value;
        }, function (err) { throw err; });
      };
    }
    installNav();
    /* Prefetch the manifest so the chapter study view can show its "watch
       video" action without first visiting the library. */
    EC.load("videos_manifest").then(function (manifest) {
      state.manifest = manifest;
      state.byId = {};
      (manifest.videos || []).forEach(function (v) { state.byId[v.video_id] = v; });
      var main = document.getElementById("main");
      if (main && EC.current().name === "lessons") {
        try { injectLessonButton(main); } catch (e) {}
      }
    }).catch(function () {});
  }

  /* app.js renders before this appended module registers its view, so a
     deep link such as ?open=videos must be re-rendered once after all
     deferred scripts and DOMContentLoaded handlers have finished. */
  function rerenderDeepLink() {
    if (EC && EC.current && EC.current().name === "videos") {
      try { EC.render(); } catch (e) {}
    }
  }
  function start() { boot(); setTimeout(rerenderDeepLink, 0); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
