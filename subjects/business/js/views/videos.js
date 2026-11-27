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

  /* ------------------------------------------------------- cinematic layer
     Backdrop style is derived from the scene number but interpolated over
     time, so neighbouring scenes drift into one another instead of cutting.
     Everything here is precomputed once; the frame loop allocates nothing. */
  var REDUCED_MOTION = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var PARTICLES = (function () {
    var list = [], seed = 20240617;
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < 48; i++) {
      var alpha = .10 + rnd() * .15;
      list.push({
        x: rnd(), y: rnd(), r: 1 + rnd() * 2.2, sp: .22 + rnd() * .5,
        ph: rnd() * 6.283, dx: 5 + rnd() * 17, vy: .0016 + rnd() * .003,
        col: "rgba(255,255,255," + alpha.toFixed(3) + ")"
      });
    }
    return list;
  })();
  var BACKDROP_STYLES = [
    { ax: 0, ay: .2, gx: [.14, .86, .52], gy: [.86, .24, .5] },
    { ax: .35, ay: .75, gx: [.78, .18, .46], gy: [.3, .82, .6] },
    { ax: .7, ay: .1, gx: [.24, .9, .6], gy: [.68, .18, .42] },
    { ax: 1.05, ay: .55, gx: [.88, .3, .5], gy: [.22, .78, .56] },
    { ax: 1.4, ay: .9, gx: [.16, .72, .48], gy: [.75, .32, .28] },
    { ax: 1.75, ay: .3, gx: [.6, .12, .82], gy: [.44, .88, .68] }
  ];
  var dotPattern = null;
  function getDotPattern(ctx) {
    if (dotPattern !== null) return dotPattern;
    var c = document.createElement("canvas"); c.width = c.height = 44;
    var g = c.getContext("2d");
    g.fillStyle = "rgba(255,255,255,.85)";
    g.beginPath(); g.arc(2, 2, 1, 0, 6.283); g.fill();
    dotPattern = ctx.createPattern(c, "repeat");
    return dotPattern;
  }
  function activeTerm(scene, t) {
    var labels = scene.on_screen_labels || [];
    if (!labels.length) return "";
    var spoken = String(captionChunk(scene, t) || "").toLowerCase();
    for (var i = 0; i < labels.length; i++) {
      var l = String(labels[i]).toLowerCase().replace(/^(the|a|an)\s+/, "");
      var key = l.split(/\s+/).slice(0, 2).join(" ");
      if (key.length > 4 && spoken.indexOf(key.slice(0, 10)) >= 0) return String(labels[i]);
    }
    return "";
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
    var local = Math.max(0, t - scene.start_sec);
    var dur = Math.max(1, scene.end_sec - scene.start_sec);
    var seed = (scene.scene_number - 1) + Math.min(.4, (local / dur) * .4) + (REDUCED_MOTION ? 0 : t * .006);
    var base = Math.floor(seed) % BACKDROP_STYLES.length;
    var next = (base + 1) % BACKDROP_STYLES.length;
    var m = ease(seed - Math.floor(seed));
    var A = BACKDROP_STYLES[base], B = BACKDROP_STYLES[next];
    var ang = A.ax + (B.ax - A.ax) * m;
    var g = ctx.createLinearGradient(W * (1 - Math.cos(ang)) / 2, H * (1 - Math.sin(ang)) / 2,
      W * (1 + Math.cos(ang)) / 2, H * (1 + Math.sin(ang)) / 2);
    g.addColorStop(0, PALETTE.bg); g.addColorStop(.52, PALETTE.bg2); g.addColorStop(1, PALETTE.panel);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var lead = base % 2 === 0 ? PALETTE.accent : PALETTE.accent2;
    var alt = base % 2 === 0 ? PALETTE.accent2 : PALETTE.accent;
    var drift = REDUCED_MOTION ? 0 : t;
    for (var i = 0; i < 3; i++) {
      var bx = W * (A.gx[i] + (B.gx[i] - A.gx[i]) * m);
      var by = H * (A.gy[i] + (B.gy[i] - A.gy[i]) * m);
      var x = bx + Math.sin(drift * .09 + i * 2.1) * W * .035;
      var y = by + Math.cos(drift * .07 + i * 1.7) * H * .05;
      var rad = W * (.36 + (i === 1 ? .1 : 0));
      var glow = ctx.createRadialGradient(x, y, 0, x, y, rad);
      glow.addColorStop(0, hexAlpha(lead, (.26 + (i === 1 ? .11 : 0)) * (1 - m * .3)));
      glow.addColorStop(.45, hexAlpha(alt, .09 * m));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    }

    var pat = getDotPattern(ctx);
    if (pat) { ctx.save(); ctx.globalAlpha = .05; ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (!REDUCED_MOTION) {
      for (var q = 0; q < PARTICLES.length; q++) {
        var p = PARTICLES[q];
        var px = (((p.x + Math.sin(drift * p.sp + p.ph) * p.dx / W) % 1) + 1) % 1 * W;
        var py = (((p.y + drift * p.vy + Math.cos(drift * p.sp * .7 + p.ph) * .012) % 1) + 1) % 1 * H;
        ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(px, py, p.r, 0, 6.283); ctx.fill();
      }
    }

    ctx.save();
    ctx.globalAlpha = .10;
    picture(ctx, art[1], 8, 426, 232, accentAt(0));
    picture(ctx, art[2], W - 252, 103, 246, accentAt(1));
    ctx.restore();

    ctx.fillStyle = hexAlpha(PALETTE.bg, .9); ctx.fillRect(0, 0, W, 106);
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

/* ===== EcBiz teaching diagrams (generated) ===== */
  var ICONS = {
    coin: function (c, s) { c.beginPath(); c.arc(0, 0, s, 0, 6.283); c.stroke(); c.beginPath(); c.arc(0, 0, s * .62, 0, 6.283); c.stroke(); c.beginPath(); c.moveTo(0, -s * .3); c.lineTo(0, s * .3); c.stroke(); },
    gear: function (c, s) { c.beginPath(); for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = i % 2 ? s * .78 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.stroke(); c.beginPath(); c.arc(0, 0, s * .32, 0, 6.283); c.stroke(); },
    people: function (c, s) { c.beginPath(); c.arc(0, -s * .45, s * .3, 0, 6.283); c.stroke(); c.beginPath(); c.arc(0, s * .75, s * .62, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(-s * .85, -s * .2, s * .2, 0, 6.283); c.stroke(); c.beginPath(); c.arc(s * .85, -s * .2, s * .2, 0, 6.283); c.stroke(); },
    cart: function (c, s) { c.beginPath(); c.moveTo(-s, -s * .7); c.lineTo(-s * .6, -s * .7); c.lineTo(-s * .3, s * .3); c.lineTo(s * .7, s * .3); c.lineTo(s * .9, -s * .4); c.lineTo(-s * .5, -s * .4); c.stroke(); c.beginPath(); c.arc(-s * .1, s * .7, s * .13, 0, 6.283); c.stroke(); c.beginPath(); c.arc(s * .55, s * .7, s * .13, 0, 6.283); c.stroke(); },
    chart: function (c, s) { c.beginPath(); c.moveTo(-s, s); c.lineTo(-s, -s); c.moveTo(-s, s); c.lineTo(s, s); c.stroke(); c.beginPath(); c.moveTo(-s * .8, s * .5); c.lineTo(-s * .3, 0); c.lineTo(s * .1, s * .3); c.lineTo(s * .8, -s * .6); c.stroke(); },
    bars: function (c, s) { [[-.7, .2], [-.15, -.4], [.4, -.9]].forEach(function (b) { c.strokeRect(b[0] * s, b[1] * s, s * .4, (1 - b[1]) * s); }); },
    globe: function (c, s) { c.beginPath(); c.arc(0, 0, s, 0, 6.283); c.stroke(); c.beginPath(); c.ellipse(0, 0, s * .45, s, 0, 0, 6.283); c.stroke(); c.beginPath(); c.moveTo(-s, 0); c.lineTo(s, 0); c.stroke(); },
    bulb: function (c, s) { c.beginPath(); c.arc(0, -s * .2, s * .65, Math.PI * .8, Math.PI * 2.2); c.lineTo(s * .25, s * .55); c.lineTo(-s * .25, s * .55); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-s * .22, s * .8); c.lineTo(s * .22, s * .8); c.stroke(); },
    shield: function (c, s) { c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .8, -s * .6); c.lineTo(s * .7, s * .3); c.quadraticCurveTo(0, s * 1.1, -s * .7, s * .3); c.lineTo(-s * .8, -s * .6); c.closePath(); c.stroke(); },
    truck: function (c, s) { c.strokeRect(-s, -s * .5, s * 1.2, s); c.strokeRect(s * .2, -s * .1, s * .7, s * .6); c.beginPath(); c.arc(-s * .5, s * .6, s * .17, 0, 6.283); c.stroke(); c.beginPath(); c.arc(s * .6, s * .6, s * .17, 0, 6.283); c.stroke(); }
  };
  function TT(ctx, s, x, y, size, col, wt, al, mw) { var z = size < 16 ? 16 : (size < 18 ? 18 : size); text(ctx, s, x, y, z, col, wt, al, mw); }
  /* ======================= TEACHING DIAGRAMS =======================
     Real concept diagrams (break-even chart, balance scale, Maslow pyramid,
     product life cycle, income-statement waterfall, org charts, maps, ...)
     keyed to a specific scene: TEACH["VID_ID:sceneIndex"]. Scenes without an
     entry keep the existing renderer. Numbers come from each scene's script.
     Everything is drawn from PALETTE, so it follows whatever theme is active. */
  function C(n) { return PALETTE[n] || n; }
  function money(v) { var s = Math.abs(v) >= 1000 ? Math.abs(v).toLocaleString("en-US") : String(Math.abs(v)); return (v < 0 ? "-" : "") + "$" + s; }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function stage(p, i, n) { return ease(p * (n + 1) - i * 0.9 - 0.15); }
  function box(ctx, x, y, w, h, fill, stroke, r) {
    ctx.save(); ctx.shadowColor = hexAlpha(stroke || fill, .35); ctx.shadowBlur = 14;
    ctx.fillStyle = fill; rr(ctx, x, y, w, h, r || 12); ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
  }
  function line(ctx, x1, y1, x2, y2, col, w, dash) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
  }
  function arrowHead(ctx, x1, y1, x2, y2, col, w) {
    line(ctx, x1, y1, x2, y2, col, w || 3);
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 12 * Math.cos(a - .4), y2 - 12 * Math.sin(a - .4));
    ctx.lineTo(x2 - 12 * Math.cos(a + .4), y2 - 12 * Math.sin(a + .4)); ctx.closePath(); ctx.fill();
  }
  /* extra pictorial icons (filled, drawn at 0,0 with size s) */
  var PIC = {
    field: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(s * .5, -s * .5, s * .22, 0, 6.283); c.fill(); c.fillStyle = hexAlpha(col, .6); c.beginPath(); c.moveTo(-s, s * .6); c.quadraticCurveTo(-s * .3, -s * .5, s * .3, s * .1); c.quadraticCurveTo(s * .7, s * .3, s, s * .6); c.closePath(); c.fill(); c.strokeStyle = col; c.lineWidth = 2; for (var i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * s * .35, s * .65); c.lineTo(i * s * .35, s * .9); c.stroke(); } },
    factory: function (c, s, col) { c.fillStyle = col; c.fillRect(-s, -s * .1, s * 2, s * .9); c.fillRect(-s * .8, -s * .8, s * .25, s * .7); c.fillRect(-s * .35, -s * .6, s * .25, s * .5); c.fillStyle = hexAlpha(PALETTE.bg, .7); for (var i = 0; i < 4; i++) c.fillRect(-s * .8 + i * s * .45, s * .15, s * .25, s * .25); },
    shop: function (c, s, col) { c.fillStyle = col; c.fillRect(-s * .9, -s * .1, s * 1.8, s * .9); c.beginPath(); c.moveTo(-s, -s * .1); c.lineTo(-s * .75, -s * .8); c.lineTo(s * .75, -s * .8); c.lineTo(s, -s * .1); c.closePath(); c.fill(); c.fillStyle = hexAlpha(PALETTE.bg, .75); c.fillRect(-s * .2, s * .25, s * .4, s * .55); },
    person: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(0, -s * .5, s * .35, 0, 6.283); c.fill(); c.beginPath(); c.arc(0, s * .75, s * .75, Math.PI, 0); c.fill(); },
    pin: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(0, -s * .3, s * .6, Math.PI * .85, Math.PI * 2.15); c.lineTo(0, s * .9); c.closePath(); c.fill(); c.fillStyle = hexAlpha(PALETTE.bg, .85); c.beginPath(); c.arc(0, -s * .3, s * .22, 0, 6.283); c.fill(); },
    coinF: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(0, 0, s, 0, 6.283); c.fill(); c.fillStyle = hexAlpha(PALETTE.bg, .75); c.font = "800 " + (s * 1.2) + "px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("$", 0, s * .08); },
    tools: function (c, s, col) { c.strokeStyle = col; c.lineWidth = s * .22; c.lineCap = "round"; c.beginPath(); c.moveTo(-s * .8, s * .8); c.lineTo(s * .5, -s * .5); c.stroke(); c.fillStyle = col; c.beginPath(); c.arc(s * .6, -s * .6, s * .38, 0, 6.283); c.fill(); },
    star: function (c, s, col) { c.fillStyle = col; c.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); },
    truckF: function (c, s, col) { c.fillStyle = col; c.fillRect(-s, -s * .5, s * 1.2, s); c.fillRect(s * .25, -s * .1, s * .7, s * .6); c.fillStyle = hexAlpha(PALETTE.bg, .85); c.beginPath(); c.arc(-s * .5, s * .6, s * .2, 0, 6.283); c.arc(s * .6, s * .6, s * .2, 0, 6.283); c.fill(); }
  };
  function pic(ctx, name, x, y, s, col) {
    ctx.save(); ctx.translate(x, y);
    if (PIC[name]) PIC[name](ctx, s, col);
    else if (ICONS[name]) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, s / 9); ctx.lineCap = "round"; ctx.lineJoin = "round"; ICONS[name](ctx, s); }
    ctx.restore();
  }
  function caption(ctx, str, x, y, col, size, align) { TT(ctx, str, x, y, size || 15, col || PALETTE.muted, 700, align || "center", 600); }

  /* waterfall / stacked bars: steps [{l, v, t:"up"|"down"|"total", c}] */
  function dWaterfall(ctx, R, p, o) {
    var steps = o.steps, n = steps.length, run = 0, levels = [], maxv = o.max || 0;
    steps.forEach(function (s) {
      var from = run, to;
      if (s.t === "total") { to = s.v != null ? s.v : run; from = 0; run = to; }
      else if (s.t === "down") { to = run - s.v; run = to; }
      else { to = run + s.v; run = to; }
      levels.push([from, to]); maxv = Math.max(maxv, from, to);
    });
    var L = R.x + 40, B = R.y + R.h - 46, T = R.y + 40, H = B - T, bw = Math.min(110, (R.w - 60) / n - 24), gap = (R.w - 60 - bw * n) / Math.max(1, n);
    line(ctx, L, B, R.x + R.w, B, hexAlpha(PALETTE.ink, .5), 2);
    if (o.ref) { var ry = B - o.ref.v / maxv * H; line(ctx, L, ry, R.x + R.w, ry, PALETTE.warn, 2, [8, 6]); TT(ctx, o.ref.l, R.x + R.w, ry - 12, 14, PALETTE.warn, 800, "right"); }
    steps.forEach(function (s, i) {
      var a = stage(p, i, n), x = L + gap / 2 + i * (bw + gap), lo = Math.min(levels[i][0], levels[i][1]), hi = Math.max(levels[i][0], levels[i][1]);
      var yTop = B - hi / maxv * H, yBot = B - lo / maxv * H, hh = (yBot - yTop) * a, col = C(s.c || (s.t === "total" ? "accent" : s.t === "down" ? "bad" : "good"));
      var y = yBot - hh;
      box(ctx, x, y, bw, Math.max(hh, 0.1), hexAlpha(col, .88), col, 8);
      if (a > .6) {
        ctx.globalAlpha = (a - .6) / .4;
        var val = s.v != null ? s.v : levels[i][1];
        TT(ctx, (s.t === "down" ? "-" : "") + (o.fmt ? o.fmt(val) : money(val)), x + bw / 2, y - 14, 17, PALETTE.ink, 850, "center");
        ctx.globalAlpha = 1;
      }
      var ls = wrap(ctx, s.l, bw + gap - 8, 13, 700);
      ls.slice(0, 3).forEach(function (t2, k) { TT(ctx, t2, x + bw / 2, B + 16 + k * 15, 13, PALETTE.muted, 700, "center"); });
      if (i < n - 1 && a > .9) line(ctx, x + bw, B - levels[i][1] / maxv * H, x + bw + gap, B - levels[i][1] / maxv * H, hexAlpha(PALETTE.ink, .35), 1.5, [4, 4]);
    });
  }

  /* signed column chart (cash balances) vals [{l,v}] */
  function dSigned(ctx, R, p, o) {
    var vals = o.vals, n = vals.length, mx = 0, mn = 0;
    vals.forEach(function (d) { mx = Math.max(mx, d.v); mn = Math.min(mn, d.v); });
    var span = mx - mn || 1, T = R.y + 50, B = R.y + R.h - 50, H = B - T, zero = T + mx / span * H, bw = Math.min(100, (R.w - 60) / n - 30), gap = (R.w - 60 - bw * n) / n;
    line(ctx, R.x + 30, zero, R.x + R.w, zero, hexAlpha(PALETTE.ink, .6), 2); TT(ctx, "$0", R.x + 24, zero - 12, 13, PALETTE.muted, 700, "right");
    vals.forEach(function (d, i) {
      var a = stage(p, i, n), x = R.x + 40 + gap / 2 + i * (bw + gap), h = Math.abs(d.v) / span * H * a, col = d.v < 0 ? PALETTE.bad : PALETTE.good;
      var y = d.v >= 0 ? zero - h : zero;
      box(ctx, x, y, bw, Math.max(h, .1), hexAlpha(col, .88), col, 8);
      TT(ctx, (d.v < 0 ? "-$" : "$") + Math.abs(d.v / 1000) + "k", x + bw / 2, d.v >= 0 ? y - 14 : y + h + 14, 17, PALETTE.ink, 850, "center");
      TT(ctx, d.l, x + bw / 2, R.y + R.h - 6, 14, PALETTE.muted, 750, "center");
    });
    if (o.note) caption(ctx, o.note, R.x + R.w / 2, R.y + 16, PALETTE.warn, 16);
  }

  /* break-even chart */
  function dBreakEven(ctx, R, p, o) {
    var fc = o.fc || 2000, vc = 2, pr = 6, maxQ = 1000, maxV = Math.max(6000, fc * 3), L = R.x + 70, Rr = R.x + R.w - 10, T = R.y + 30, B = R.y + R.h - 50;
    function X(q) { return L + q / maxQ * (Rr - L); } function Y(v) { return B - v / maxV * (B - T); }
    for (var g = 0; g <= maxV / 1000; g++) { line(ctx, L, Y(g * 1000), Rr, Y(g * 1000), hexAlpha(PALETTE.ink, .09), 1); TT(ctx, "$" + g + "k", L - 8, Y(g * 1000), 12, PALETTE.muted, 600, "right"); }
    for (var q = 0; q <= 1000; q += 250) TT(ctx, q, X(q), B + 16, 12, PALETTE.muted, 600, "center");
    line(ctx, L, T, L, B, PALETTE.ink, 2); line(ctx, L, B, Rr, B, PALETTE.ink, 2);
    TT(ctx, "Loaves sold (output)", (L + Rr) / 2, B + 36, 14, PALETTE.muted, 700, "center");
    TT(ctx, "Costs and revenue ($)", L, T - 12, 14, PALETTE.muted, 700, "left");
    var all = o.static, bq = fc / (pr - vc);
    function sg(a, b, f, col) {
      var t = all ? 1 : ease(p * 3 - f); if (t <= 0) return;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.lineTo(X(a[0] + (b[0] - a[0]) * t), Y(a[1] + (b[1] - a[1]) * t)); ctx.stroke(); ctx.restore();
    }
    sg([0, fc], [maxQ, fc], 0, PALETTE.muted);
    sg([0, fc], [maxQ, fc + vc * maxQ], .7, PALETTE.warn);
    sg([0, 0], [maxQ, pr * maxQ], 1.4, PALETTE.good);
    TT(ctx, "Fixed cost $" + fc.toLocaleString("en-US"), X(30), Y(fc) + 16, 13, PALETTE.muted, 800, "left");
    TT(ctx, "Total cost", X(maxQ) - 8, Y(fc + vc * maxQ) - 16, 14, PALETTE.warn, 850, "right");
    TT(ctx, "Revenue", X(maxQ) - 8, Y(pr * maxQ) + 14, 14, PALETTE.good, 850, "right");
    if (all || p > .55) {
      var a = all ? 1 : ease((p - .55) * 4);
      ctx.save(); ctx.globalAlpha = a;
      line(ctx, X(bq), Y(bq * pr), X(bq), B, PALETTE.accent, 2, [6, 5]); line(ctx, L, Y(bq * pr), X(bq), Y(bq * pr), PALETTE.accent, 2, [6, 5]);
      ctx.fillStyle = PALETTE.accent; ctx.beginPath(); ctx.arc(X(bq), Y(bq * pr), 9, 0, 6.283); ctx.fill();
      TT(ctx, "Break-even: " + bq + " loaves, $" + (bq * pr).toLocaleString("en-US"), X(bq) + 16, Y(bq * pr) + 30, 15, PALETTE.accent, 850, "left");
      ctx.restore();
    }
    if (o.profit && p > .3) {
      ctx.save(); ctx.globalAlpha = ease((p - .3) * 3);
      line(ctx, X(1000) - 24, Y(6000), X(1000) - 24, Y(4000), PALETTE.good, 6);
      TT(ctx, "Profit $2,000", X(1000) - 36, Y(5000), 16, PALETTE.good, 850, "right"); ctx.restore();
    }
    if (o.mos && p > .3) {
      ctx.save(); ctx.globalAlpha = ease((p - .3) * 3);
      line(ctx, X(700), B, X(700), Y(4200), PALETTE.accent2, 2, [6, 5]);
      arrowHead(ctx, X(bq), B - 22, X(700), B - 22, PALETTE.accent2, 4);
      TT(ctx, "Margin of safety: 200 loaves", X(600), B - 40, 15, PALETTE.accent2, 850, "center");
      TT(ctx, "Actual 700", X(700), B + 30, 13, PALETTE.accent2, 800, "center"); ctx.restore();
    }
  }

  /* balance scale for the statement of financial position */
  function dBalance(ctx, R, p, o) {
    var cx = R.x + R.w / 2, py = R.y + 110, tilt = o.tilt0 + (o.tiltEnd - o.tilt0) * ease(p * 1.4), arm = R.w * .36;
    ctx.fillStyle = PALETTE.ink; ctx.beginPath(); ctx.moveTo(cx - 34, R.y + R.h - 30); ctx.lineTo(cx + 34, R.y + R.h - 30); ctx.lineTo(cx, py); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(cx, py); ctx.rotate(tilt);
    line(ctx, -arm, 0, arm, 0, PALETTE.ink, 6);
    [-1, 1].forEach(function (side) {
      var px = side * arm, items = side < 0 ? o.left : o.right, title = side < 0 ? o.lt : o.rt;
      line(ctx, px, 0, px - 70, 110, hexAlpha(PALETTE.ink, .5), 2); line(ctx, px, 0, px + 70, 110, hexAlpha(PALETTE.ink, .5), 2);
      ctx.save(); ctx.translate(px, 0); ctx.rotate(-tilt);
      box(ctx, -120, 110, 240, 12, PALETTE.ink, null, 6);
      var y = 110;
      items.forEach(function (it, i) {
        var h = Math.max(26, it.v / o.scale * 190) * stage(p, i, items.length + 1); y -= h;
        box(ctx, -108, y, 216, h, hexAlpha(C(it.c), .92), C(it.c), 6);
        if (h > 24) TT(ctx, it.l + " " + money(it.v), 0, y + h / 2, 13, "#08111F", 850, "center", 206);
      });
      TT(ctx, title, 0, 144, 16, PALETTE.ink, 850, "center", 240);
      ctx.restore();
    });
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, py, 10, 0, 6.283); ctx.fillStyle = PALETTE.accent; ctx.fill();
    if (o.note) caption(ctx, o.note, cx, R.y + R.h - 6, PALETTE.warn, 16);
  }

  /* curve with stage bands */
  function dCurve(ctx, R, p, o) {
    var L = R.x + 56, Rr = R.x + R.w - 10, T = R.y + 50, B = R.y + R.h - 50;
    function X(x) { return L + x * (Rr - L); } function Y(y) { return B - y * (B - T); }
    (o.bands || []).forEach(function (b) {
      ctx.fillStyle = hexAlpha(C(b.c), .12); ctx.fillRect(X(b.x0), T - 14, X(b.x1) - X(b.x0), B - T + 14);
      TT(ctx, b.l, (X(b.x0) + X(b.x1)) / 2, T - 2, 14, C(b.c), 850, "center", X(b.x1) - X(b.x0) - 6);
    });
    line(ctx, L, T - 14, L, B, PALETTE.ink, 2); line(ctx, L, B, Rr, B, PALETTE.ink, 2);
    TT(ctx, o.xl || "Time", Rr, B + 24, 14, PALETTE.muted, 700, "right"); TT(ctx, o.yl || "", L, T - 34, 14, PALETTE.muted, 700, "left");
    (o.curves || []).forEach(function (cv) {
      var t = Math.min(1, ease(p * 2.2 - (cv.delay || 0)));
      if (t <= 0) return;
      ctx.save(); ctx.strokeStyle = C(cv.c); ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.lineCap = "round"; if (cv.dash) ctx.setLineDash([10, 8]);
      ctx.shadowColor = hexAlpha(C(cv.c), .6); ctx.shadowBlur = 12; ctx.beginPath();
      var N = 90, last = Math.floor(N * t);
      for (var i = 0; i <= last; i++) { var u = i / N, y = cv.f(u); if (i) ctx.lineTo(X(u), Y(y)); else ctx.moveTo(X(u), Y(y)); }
      ctx.stroke(); ctx.restore();
      if (t > .98 && cv.l) { var lx = cv.lx != null ? cv.lx : .98; TT(ctx, cv.l, X(lx), Y(cv.f(lx)) + (cv.ly || -18), 14, C(cv.c), 850, "center"); }
    });
    (o.marks || []).forEach(function (m) { if (p > m.at) { ctx.save(); ctx.globalAlpha = ease((p - m.at) * 4); ctx.fillStyle = C(m.c || "warn"); ctx.beginPath(); ctx.arc(X(m.x), Y(m.y), 8, 0, 6.283); ctx.fill(); TT(ctx, m.l, X(m.x), Y(m.y) + (m.dy || -22), 14, C(m.c || "warn"), 850, "center"); ctx.restore(); } });
  }

  /* hub: centre + satellites */
  function dHub(ctx, R, p, o) {
    var cx = R.x + R.w / 2, cy = R.y + R.h / 2, n = o.items.length, rx = R.w * .34, ry = R.h * .33;
    o.items.forEach(function (it, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, t = stage(p, i, n);
      var col = C(it.c || ["accent", "accent2", "good", "warn", "bad"][i % 5]);
      ctx.save(); ctx.globalAlpha = t;
      line(ctx, cx, cy, cx + (x - cx) * t, cy + (y - cy) * t, hexAlpha(col, .7), 3, [8, 6]);
      box(ctx, x - 80, y - 50, 160, 100, hexAlpha(PALETTE.panel, .96), col, 16);
      pic(ctx, it.i, x, y - 18, 18, col);
      TT(ctx, it.l, x, y + 16, 15, PALETTE.ink, 800, "center", 148);
      if (it.s) TT(ctx, it.s, x, y + 34, 11, PALETTE.muted, 600, "center", 148);
      ctx.restore();
    });
    box(ctx, cx - 84, cy - 38, 168, 76, hexAlpha(C(o.cc || "accent"), .96), C(o.cc || "accent"), 38);
    var ls = wrap(ctx, o.center, 150, 15, 850);
    ls.slice(0, 2).forEach(function (s, i) { TT(ctx, s, cx, cy + (i - (Math.min(ls.length, 2) - 1) / 2) * 18, 15, "#08111F", 850, "center"); });
  }

  /* chain of pictorial stages */
  function dChain(ctx, R, p, o) {
    var n = o.items.length, w = Math.min(200, (R.w - 20) / n - 40), gap = (R.w - 20 - w * n) / Math.max(1, n - 1), y = R.y + R.h / 2 - 110;
    o.items.forEach(function (it, i) {
      var x = R.x + 10 + i * (w + gap), t = stage(p, i, n), col = C(it.c || ["accent", "good", "warn", "accent2"][i % 4]), hl = o.hl == null || o.hl === i;
      ctx.save(); ctx.globalAlpha = (hl ? 1 : .35) * t;
      box(ctx, x, y, w, 180, hexAlpha(PALETTE.panel, .96), hl ? col : hexAlpha(col, .5), 18);
      pic(ctx, it.i, x + w / 2, y + 52, 30, col);
      var ls = wrap(ctx, it.l, w - 14, 15, 850);
      ls.slice(0, 2).forEach(function (s, k) { TT(ctx, s, x + w / 2, y + 108 + k * 18, 15, PALETTE.ink, 850, "center", w - 12); });
      if (it.s) TT(ctx, it.s, x + w / 2, y + 148, 12, PALETTE.muted, 650, "center", w - 12);
      if (it.tag) TT(ctx, it.tag, x + w / 2, y + 166, 11, col, 800, "center", w - 12);
      ctx.restore();
      if (it.price != null && t > .6) { ctx.save(); ctx.globalAlpha = (t - .6) / .4; box(ctx, x + w / 2 - 44, y + 200, 88, 34, hexAlpha(col, .95), col, 17); TT(ctx, it.price, x + w / 2, y + 217, 17, "#08111F", 850, "center"); if (it.add) TT(ctx, it.add, x + w / 2, y + 252, 15, PALETTE.good, 850, "center"); ctx.restore(); }
      if (i < n - 1) { ctx.globalAlpha = t; arrowHead(ctx, x + w + 6, y + 90, x + w + gap - 6, y + 90, hexAlpha(PALETTE.ink, .6), 3); ctx.globalAlpha = 1; }
    });
    if (o.note) caption(ctx, o.note, R.x + R.w / 2, R.y + R.h - 16, PALETTE.warn, 16);
  }

  /* pyramid (Maslow) levels bottom -> top */
  function dPyramid(ctx, R, p, o) {
    var n = o.levels.length, bh = (R.h - 30) / n, cx = R.x + R.w / 2;
    o.levels.forEach(function (lv, i) {
      var t = stage(p, i, n), yb = R.y + R.h - 10 - i * bh, yt = yb - bh + 4, wb = R.w * (1 - i / n) * .96, wt = R.w * (1 - (i + 1) / n) * .96, col = C(lv.c);
      ctx.save(); ctx.globalAlpha = t; ctx.shadowColor = hexAlpha(col, .5); ctx.shadowBlur = 14;
      ctx.fillStyle = hexAlpha(col, .92); ctx.beginPath(); ctx.moveTo(cx - wb / 2, yb); ctx.lineTo(cx + wb / 2, yb); ctx.lineTo(cx + wt / 2, yt); ctx.lineTo(cx - wt / 2, yt); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = t; TT(ctx, lv.l, cx, (yb + yt) / 2 - 8, 17, "#08111F", 850, "center", Math.max(90, wt - 10)); TT(ctx, lv.s, cx, (yb + yt) / 2 + 12, 12, "#08111F", 700, "center", Math.max(90, wt - 10)); ctx.restore();
    });
  }

  /* seesaw (Herzberg) */
  function dSeesaw(ctx, R, p, o) {
    var cx = R.x + R.w / 2, py = R.y + R.h * .55, ang = o.a0 + (o.a1 - o.a0) * ease(p * 1.5);
    ctx.fillStyle = PALETTE.ink; ctx.beginPath(); ctx.moveTo(cx - 40, py + 120); ctx.lineTo(cx + 40, py + 120); ctx.lineTo(cx, py); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(cx, py); ctx.rotate(ang); line(ctx, -R.w * .45, 0, R.w * .45, 0, PALETTE.ink, 8);
    [[-1, o.l], [1, o.r]].forEach(function (s) {
      ctx.save(); ctx.translate(s[0] * R.w * .28, 0); ctx.rotate(-ang);
      box(ctx, -125, -104, 250, 96, hexAlpha(C(s[1].c), .95), C(s[1].c), 14);
      TT(ctx, s[1].t, 0, -80, 18, "#08111F", 850, "center", 230); TT(ctx, s[1].s, 0, -55, 12, "#08111F", 750, "center", 234); TT(ctx, s[1].s2 || "", 0, -34, 12, "#08111F", 750, "center", 234);
      ctx.restore();
    });
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, py, 10, 0, 6.283); ctx.fillStyle = PALETTE.accent; ctx.fill();
  }

  /* loop diagram */
  function dLoop(ctx, R, p, o) {
    var cx = R.x + R.w / 2, cy = R.y + R.h / 2, rx = R.w * .33, ry = R.h * .33, n = o.nodes.length, pts = [];
    o.nodes.forEach(function (nd, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); });
    o.nodes.forEach(function (nd, i) {
      var a = pts[i], b = pts[(i + 1) % n], t = stage(p, i, n), col = C(nd.c || "accent");
      ctx.save(); ctx.globalAlpha = t;
      var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, fb = (i === n - 1);
      var sx = a[0] + ux * Math.min(80, d * .4), sy = a[1] + uy * Math.min(46, d * .4), ex = b[0] - ux * Math.min(80, d * .4), ey = b[1] - uy * Math.min(46, d * .4);
      arrowHead(ctx, sx, sy, ex, ey, fb ? PALETTE.good : hexAlpha(PALETTE.ink, .6), 3);
      box(ctx, a[0] - 74, a[1] - 40, 148, 80, hexAlpha(PALETTE.panel, .96), col, 14);
      pic(ctx, nd.i, a[0], a[1] - 14, 15, col);
      TT(ctx, nd.l, a[0], a[1] + 20, 14, PALETTE.ink, 800, "center", 138);
      ctx.restore();
    });
    if (o.barrier != null && p > .5) {
      var a = pts[o.barrier], b = pts[(o.barrier + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      ctx.save(); ctx.globalAlpha = ease((p - .5) * 3); ctx.strokeStyle = PALETTE.bad; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(mx - 14, my - 20); ctx.lineTo(mx + 14, my + 20); ctx.moveTo(mx + 14, my - 20); ctx.lineTo(mx - 14, my + 20); ctx.stroke();
      TT(ctx, o.barrierLabel || "Barrier", mx + 40, my - 36, 15, PALETTE.bad, 850, "left", 220); ctx.restore();
    }
  }

  /* org charts: tall vs flat */
  function dOrgPair(ctx, R, p) {
    function tree(x0, w, levels, counts, col, title, sub) {
      var yTop = R.y + 90, lh = (R.h - 170) / (levels - 1 || 1);
      TT(ctx, title, x0 + w / 2, R.y + 20, 18, col, 850, "center"); TT(ctx, sub, x0 + w / 2, R.y + 44, 13, PALETTE.muted, 700, "center", w);
      var prev = [[x0 + w / 2, yTop]];
      for (var l = 0; l < levels; l++) {
        var cnt = counts[l], cur = [];
        for (var k = 0; k < cnt; k++) cur.push([x0 + w * (k + .5) / cnt, yTop + l * lh]);
        var t = stage(p, l, levels);
        cur.forEach(function (c, k) { ctx.save(); ctx.globalAlpha = t; if (l > 0) { var par = prev[Math.min(prev.length - 1, Math.floor(k * prev.length / cnt))]; line(ctx, par[0], par[1] + 14, c[0], c[1] - 14, hexAlpha(col, .6), 2); } pic(ctx, "person", c[0], c[1], 11, col); ctx.restore(); });
        prev = cur;
      }
    }
    tree(R.x + 10, R.w / 2 - 30, 5, [1, 2, 2, 2, 2], C("accent"), "TALL structure", "Narrow span, many layers");
    tree(R.x + R.w / 2 + 20, R.w / 2 - 30, 3, [1, 3, 9], C("good"), "FLAT structure", "Wide span, few layers");
    line(ctx, R.x + R.w / 2, R.y + 10, R.x + R.w / 2, R.y + R.h - 20, hexAlpha(PALETTE.ink, .25), 2, [6, 6]);
  }
  function dSpan(ctx, R, p) {
    var cx = R.x + R.w / 2, sy = R.y + 70;
    box(ctx, cx - 90, sy - 30, 180, 60, hexAlpha(C("warn"), .95), C("warn"), 14); TT(ctx, "1 supervisor", cx, sy, 16, "#08111F", 850, "center");
    var n = 8, w = R.w - 40;
    for (var i = 0; i < n; i++) { var x = R.x + 20 + w * (i + .5) / n, t = stage(p, i, n), y = sy + 190; ctx.save(); ctx.globalAlpha = t; line(ctx, cx, sy + 30, x, y - 28, hexAlpha(C("accent"), .7), 2); pic(ctx, "person", x, y, 15, C("accent")); TT(ctx, "Loader " + (i + 1), x, y + 44, 12, PALETTE.muted, 700, "center"); ctx.restore(); }
    caption(ctx, "Span of control = 8 subordinates to one manager", cx, R.y + R.h - 24, PALETTE.warn, 16);
  }

  /* funnel with named stages */
  function dFunnel(ctx, R, p, o) {
    var n = o.stages.length, h = (R.h - 20) / n, cx = R.x + R.w * .42;
    o.stages.forEach(function (s, i) {
      var t = stage(p, i, n), w1 = R.w * .8 * (1 - i / (n + 1)), w2 = R.w * .8 * (1 - (i + 1) / (n + 1)), y = R.y + 6 + i * h, col = C(["accent", "accent2", "good", "warn"][i % 4]);
      ctx.save(); ctx.globalAlpha = t; ctx.fillStyle = hexAlpha(col, .9); ctx.beginPath(); ctx.moveTo(cx - w1 / 2, y); ctx.lineTo(cx + w1 / 2, y); ctx.lineTo(cx + w2 / 2, y + h - 4); ctx.lineTo(cx - w2 / 2, y + h - 4); ctx.closePath(); ctx.fill();
      TT(ctx, s.l, cx, y + h / 2 - 2, 15, "#08111F", 850, "center", w2 - 20);
      if (s.n) TT(ctx, s.n, cx + w1 / 2 + 16, y + h / 2, 17, col, 850, "left");
      ctx.restore();
    });
  }

  /* donut */
  function dDonut(ctx, R, p, o) {
    var cx = R.x + R.w * .34, cy = R.y + R.h / 2, r = Math.min(R.h / 2 - 40, 140), t = ease(p * 1.6);
    ctx.lineWidth = 46; ctx.strokeStyle = hexAlpha(PALETTE.ink, .12); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
    ctx.save(); ctx.strokeStyle = C("accent"); ctx.lineCap = "round"; ctx.shadowColor = hexAlpha(C("accent"), .6); ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * o.share * t); ctx.stroke(); ctx.restore();
    TT(ctx, Math.round(o.share * 100 * t) + "%", cx, cy - 8, 48, PALETTE.ink, 900, "center"); TT(ctx, o.sub, cx, cy + 32, 14, PALETTE.muted, 700, "center");
    var lx = cx + r + 50;
    box(ctx, lx, cy - 64, 220, 46, hexAlpha(PALETTE.panel, .95), C("accent"), 10); TT(ctx, o.a, lx + 110, cy - 41, 15, PALETTE.ink, 800, "center", 206);
    box(ctx, lx, cy + 10, 220, 46, hexAlpha(PALETTE.panel, .95), PALETTE.muted, 10); TT(ctx, o.b, lx + 110, cy + 33, 15, PALETTE.ink, 800, "center", 206);
  }

  /* liability: owners vs business, with or without a legal wall */
  function dLiability(ctx, R, p, o) {
    var cy = R.y + R.h / 2 - 30, bx = R.x + R.w * .56, t = ease(p * 2);
    box(ctx, bx, cy - 100, 260, 200, hexAlpha(C("accent"), .18), C("accent"), 18); TT(ctx, o.biz, bx + 130, cy - 74, 16, C("accent"), 850, "center", 240);
    pic(ctx, "factory", bx + 130, cy - 8, 32, C("accent")); TT(ctx, "Business debts: $100,000", bx + 130, cy + 72, 15, PALETTE.bad, 850, "center", 240);
    for (var i = 0; i < o.owners; i++) {
      var oy = cy - (o.owners - 1) * 55 + i * 110, ox = R.x + 80; pic(ctx, "person", ox, oy - 10, 22, C("warn")); TT(ctx, o.ownerLabel, ox, oy + 38, 13, PALETTE.muted, 700, "center", 150);
      if (!o.wall) arrowHead(ctx, ox + 50, oy, bx - 6, cy, hexAlpha(C("warn"), .85), 3);
      else line(ctx, ox + 50, oy, bx - 70, cy, hexAlpha(C("warn"), .5), 2, [6, 6]);
    }
    if (o.wall) { ctx.save(); ctx.globalAlpha = t; var wx = bx - 52; ctx.fillStyle = hexAlpha(C("good"), .9); ctx.fillRect(wx, cy - 120, 14, 240); TT(ctx, "legal wall", wx + 7, cy + 138, 14, C("good"), 850, "center"); ctx.restore(); }
    var col = o.wall ? C("good") : C("bad");
    box(ctx, R.x + 10, R.y + R.h - 64, R.w - 20, 46, hexAlpha(col, .18), col, 12);
    TT(ctx, o.result, R.x + R.w / 2, R.y + R.h - 41, 16, PALETTE.ink, 850, "center", R.w - 50);
  }

  /* map with two sites */
  function dMap(ctx, R, p, o) {
    ctx.save(); box(ctx, R.x, R.y, R.w, R.h, hexAlpha(C("good"), .10), hexAlpha(C("good"), .4), 18);
    ctx.fillStyle = hexAlpha(C("accent"), .25); ctx.beginPath(); ctx.moveTo(R.x + 2, R.y + R.h * .1); ctx.quadraticCurveTo(R.x + R.w * .2, R.y + R.h * .2, R.x + R.w * .15, R.y + R.h * .55); ctx.quadraticCurveTo(R.x + R.w * .1, R.y + R.h * .85, R.x + 2, R.y + R.h - 2); ctx.closePath(); ctx.fill();
    TT(ctx, "SEA", R.x + 30, R.y + R.h * .4, 16, hexAlpha(C("accent"), .95), 850, "center");
    ctx.strokeStyle = hexAlpha(PALETTE.ink, .2); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(R.x + R.w * .2, R.y + R.h * .55); ctx.quadraticCurveTo(R.x + R.w * .5, R.y + R.h * .3, R.x + R.w * .8, R.y + R.h * .4); ctx.stroke(); ctx.restore();
    var pts = [[[R.x + R.w * .24, R.y + R.h * .55], "Site A", "near the port", "accent"], [[R.x + R.w * .8, R.y + R.h * .4], "Site B", "near the capital", "warn"]];
    pts.forEach(function (s, i) {
      var t = stage(p, i, 2), col = C(s[3]); ctx.save(); ctx.globalAlpha = t; var by = Math.sin(p * 9 + i) * 3;
      pic(ctx, "pin", s[0][0], s[0][1] - 24 + by, 26, col); box(ctx, s[0][0] - 70, s[0][1] + 18, 140, 48, hexAlpha(PALETTE.panel, .96), col, 10);
      TT(ctx, s[1], s[0][0], s[0][1] + 34, 16, PALETTE.ink, 850, "center"); TT(ctx, s[2], s[0][0], s[0][1] + 53, 12, PALETTE.muted, 650, "center"); ctx.restore();
    });
    [[R.x + R.w * .5, R.y + R.h * .16, "Customers", "people", "good"], [R.x + R.w * .14, R.y + R.h * .84, "Raw materials", "field", "warn"]].forEach(function (m, i) {
      ctx.save(); ctx.globalAlpha = ease(p * 3 - .5 - i * .3); pic(ctx, m[3], m[0], m[1], 18, C(m[4])); TT(ctx, m[2], m[0], m[1] + 34, 13, C(m[4]), 800, "center"); ctx.restore();
    });
    if (o.note) caption(ctx, o.note, R.x + R.w / 2, R.y + R.h - 18, PALETTE.warn, 16);
  }

  /* currency exchange */
  function dFx(ctx, R, p, o) {
    var cx = R.x + R.w / 2, y = R.y + 150, t = ease(p * 2);
    function card(x, cur, amt, col) { box(ctx, x - 100, y - 70, 200, 140, hexAlpha(PALETTE.panel, .96), col, 18); pic(ctx, "coinF", x, y - 32, 18, col); TT(ctx, cur, x, y + 2, 16, PALETTE.muted, 800, "center"); TT(ctx, amt, x, y + 38, 24, PALETTE.ink, 900, "center", 190); }
    card(R.x + 120, "US dollars", o.a, C("accent")); card(R.x + R.w - 120, "UK pounds", o.b, C("warn"));
    ctx.save(); ctx.globalAlpha = t; arrowHead(ctx, R.x + 240, y - 14, R.x + R.w - 240, y - 14, C("good"), 5); arrowHead(ctx, R.x + R.w - 240, y + 24, R.x + 240, y + 24, C("accent2"), 5);
    TT(ctx, o.rate, cx, y - 46, 19, PALETTE.ink, 850, "center", 280); TT(ctx, o.rate2 || "", cx, y + 54, 14, PALETTE.muted, 700, "center", 280); ctx.restore();
    if (o.note) { var nc = C(o.nc || "good"); box(ctx, R.x + 20, R.y + R.h - 130, R.w - 40, 60, hexAlpha(nc, .15), nc, 12); TT(ctx, o.note, cx, R.y + R.h - 100, 16, PALETTE.ink, 800, "center", R.w - 70); }
  }

  /* border gate: tariff or quota */
  function dGate(ctx, R, p, o) {
    var y = R.y + R.h / 2 - 30, gx = R.x + R.w / 2;
    box(ctx, R.x, y - 70, R.w * .42, 140, hexAlpha(C("accent"), .12), hexAlpha(C("accent"), .5), 14); TT(ctx, "Overseas supplier", R.x + R.w * .21, y - 50, 14, C("accent"), 800, "center");
    box(ctx, R.x + R.w * .58, y - 70, R.w * .42, 140, hexAlpha(C("warn"), .12), hexAlpha(C("warn"), .5), 14); TT(ctx, "Home market", R.x + R.w * .79, y - 50, 14, C("warn"), 800, "center");
    ctx.fillStyle = PALETTE.ink; ctx.fillRect(gx - 8, y - 100, 16, 200); ctx.fillStyle = C("bad"); ctx.fillRect(gx - 40, y - 100, 80, 26); TT(ctx, "BORDER", gx, y - 87, 12, "#08111F", 900, "center");
    for (var i = 0; i < o.trucks; i++) {
      var ph = (p * 1.3 + i * .17) % 1, x = R.x + 30 + ph * (R.w - 140), blocked = o.mode === "quota" && i >= o.pass && x > gx - 70;
      if (blocked) x = gx - 60 - (i - o.pass) * 34;
      pic(ctx, "truckF", x, y + 24, 16, blocked ? C("bad") : C("good"));
    }
    box(ctx, R.x + 10, y + 110, R.w - 20, 76, hexAlpha(PALETTE.panel, .96), C("bad"), 14);
    TT(ctx, o.l1, R.x + R.w / 2, y + 134, 17, PALETTE.ink, 850, "center", R.w - 40); TT(ctx, o.l2, R.x + R.w / 2, y + 164, 15, PALETTE.warn, 800, "center", R.w - 40);
  }

  /* pillars */
  function dPillars(ctx, R, p, o) {
    var n = 3, w = 150, gap = (R.w - 30 - w * n) / (n - 1), base = R.y + R.h - 40;
    o.items.forEach(function (it, i) {
      var x = R.x + 15 + i * (w + gap), t = stage(p, i, n), h = 220 * t, col = C(it.c);
      box(ctx, x, base - h, w, h, hexAlpha(col, .9), col, 10);
      if (t > .8) { pic(ctx, it.i, x + w / 2, base - h + 46, 22, "#08111F"); TT(ctx, it.l, x + w / 2, base - h + 104, 16, "#08111F", 850, "center", w - 12); TT(ctx, it.s, x + w / 2, base - h + 128, 13, "#08111F", 700, "center", w - 12); }
    });
    ctx.fillStyle = hexAlpha(PALETTE.ink, .85); ctx.fillRect(R.x, base - 244, R.w, 24); ctx.fillRect(R.x - 10, base, R.w + 20, 14);
    TT(ctx, o.roof, R.x + R.w / 2, base - 232, 14, PALETTE.bg, 850, "center");
  }

  var TEACH = {
    "VID_U1_01:1": { fn: function (c, R, p) {
      var cx = R.x + R.w / 2, cy = R.y + R.h / 2;
      box(c, R.x + 10, cy - 60, 200, 120, hexAlpha(C("warn"), .95), C("warn"), 16); pic(c, "tools", R.x + 110, cy - 24, 22, "#08111F"); TT(c, "One batch of resin", R.x + 110, cy + 22, 16, "#08111F", 850, "center", 184);
      [[R.y + 20, "Custom deck", "$480", "good", true], [R.y + R.h - 190, "Tail-pads", "$180", "bad", false]].forEach(function (o, i) {
        var t = stage(p, i, 2), x = R.x + R.w - 250, col = C(o[3]); c.save(); c.globalAlpha = t;
        arrowHead(c, R.x + 216, cy, x - 8, o[0] + 60, hexAlpha(col, .9), 4); box(c, x, o[0], 240, 120, hexAlpha(PALETTE.panel, .96), col, 16);
        TT(c, o[1], x + 120, o[0] + 28, 18, PALETTE.ink, 850, "center"); TT(c, o[2], x + 120, o[0] + 68, 38, col, 900, "center");
        TT(c, o[4] ? "CHOSEN" : "FORGONE", x + 120, o[0] + 102, 13, col, 850, "center"); c.restore(); });
      if (p > .6) { c.save(); c.globalAlpha = ease((p - .6) * 3); box(c, cx - 190, R.y + R.h - 56, 380, 44, hexAlpha(C("bad"), .2), C("bad"), 12); TT(c, "Opportunity cost = $180 (the forgone option)", cx, R.y + R.h - 34, 15, PALETTE.ink, 850, "center", 360); c.restore(); }
    } },
    "VID_U1_01:2": { hub: { center: "Factors of production", items: [{ l: "Land", s: "natural resources", i: "field", c: "good" }, { l: "Labour", s: "human effort", i: "person", c: "accent" }, { l: "Capital", s: "man-made resources", i: "factory", c: "warn" }, { l: "Enterprise", s: "risk-taking organiser", i: "bulb", c: "accent2" }] } },
    "VID_U1_01:4": { wf: { steps: [{ l: "Selling price", v: 480, t: "total", c: "accent" }, { l: "Bought-in materials", v: 170, t: "down", c: "bad" }, { l: "Added value", t: "total", c: "good" }], fmt: function (v) { return "$" + v; } } },
    "VID_U1_02:0": { chain: { items: [{ l: "Primary", s: "extract resources", i: "field", c: "good" }, { l: "Secondary", s: "make goods", i: "factory", c: "warn" }, { l: "Tertiary", s: "provide services", i: "shop", c: "accent" }] } },
    "VID_U1_02:1": { chain: { hl: 0, items: [{ l: "Primary: Bramblefield Farms", s: "raw milk", i: "field", c: "good", tag: "farming, mining, forestry" }, { l: "Secondary", s: "manufacturing", i: "factory", c: "warn" }, { l: "Tertiary", s: "services", i: "shop", c: "accent" }] } },
    "VID_U1_02:2": { chain: { hl: 1, items: [{ l: "Primary", s: "raw milk", i: "field", c: "good" }, { l: "Secondary: Meadowline Dairy", s: "milk to cheese, yoghurt", i: "factory", c: "warn", tag: "goods are tangible" }, { l: "Tertiary", s: "services", i: "shop", c: "accent" }] } },
    "VID_U1_02:3": { chain: { hl: 2, items: [{ l: "Primary", s: "raw milk", i: "field", c: "good" }, { l: "Secondary", s: "cheese made", i: "factory", c: "warn" }, { l: "Tertiary: Harbourmart", s: "retail, banking, transport", i: "shop", c: "accent", tag: "services are intangible" }] } },
    "VID_U1_02:4": { chain: { note: "Value is added at every stage: $2.00, $3.20, $4.50", items: [{ l: "Farm milk", i: "field", c: "good", price: "$2.00" }, { l: "Dairy sells cheese", i: "factory", c: "warn", price: "$3.20", add: "+$1.20" }, { l: "Shop sells", i: "shop", c: "accent", price: "$4.50", add: "+$1.30" }] } },
    "VID_U1_04:1": { liab: { biz: "Sole trader business", owners: 1, ownerLabel: "The owner", wall: false, result: "Unlimited liability: debts can reach the owner's savings" } },
    "VID_U1_04:2": { liab: { biz: "Partnership", owners: 2, ownerLabel: "Partner", wall: false, result: "Partners share skills, profit and unlimited liability" } },
    "VID_U1_04:3": { liab: { biz: "Private limited company (Ltd)", owners: 2, ownerLabel: "Shareholder", wall: true, result: "Limited liability: shareholders risk only their investment" } },
    "VID_U1_04:4": { liab: { biz: "Public limited company (Plc)", owners: 3, ownerLabel: "Shareholder", wall: true, result: "Shares sold to the public; liability is limited" } },
    "VID_U1_05:2": { hub: { center: "Internal stakeholders", cc: "accent", items: [{ l: "Owners", s: "want profit", i: "coinF", c: "warn" }, { l: "Managers", s: "want growth", i: "bulb", c: "accent" }, { l: "Employees", s: "want pay, security", i: "person", c: "good" }] } },
    "VID_U1_05:3": { hub: { center: "External stakeholders", cc: "accent2", items: [{ l: "Customers", s: "quality, price", i: "cart", c: "good" }, { l: "Suppliers", s: "prompt payment", i: "truckF", c: "warn" }, { l: "Government", s: "tax, laws", i: "shield", c: "accent" }, { l: "Community", s: "jobs, environment", i: "people", c: "accent2" }, { l: "Lenders", s: "repayment", i: "coinF", c: "bad" }] } },
    "VID_U1_03:5": { chain: { note: "Horizontal integration: same stage, bigger market share", items: [{ l: "Firm A", s: "retailer", i: "shop", c: "accent" }, { l: "Firm B", s: "retailer", i: "shop", c: "warn" }, { l: "Merged firm", s: "larger market share", i: "shop", c: "good" }] } },
    "VID_U1_03:6": { chain: { note: "Vertical integration: join a different stage of the chain", items: [{ l: "Supplier", s: "backward", i: "field", c: "good" }, { l: "Manufacturer", s: "your firm", i: "factory", c: "warn" }, { l: "Retailer", s: "forward", i: "shop", c: "accent" }] } },
    "VID_U2_01:1": { pyr: { levels: [{ l: "Physiological", s: "pay and rest", c: "bad" }, { l: "Safety", s: "contract, safe machines", c: "warn" }, { l: "Social", s: "team and belonging", c: "good" }, { l: "Esteem", s: "praise and status", c: "accent" }, { l: "Self-actualisation", s: "skill growth", c: "accent2" }] } },
    "VID_U2_01:3": { see: { a0: 0.0, a1: -0.2, l: { t: "Hygiene", s: "pay, conditions, security", s2: "stop dissatisfaction", c: "warn" }, r: { t: "Motivators", s: "achievement, responsibility", s2: "recognition: adds motivation", c: "good" } } },
    "VID_U2_02:1": { org: true },
    "VID_U2_02:2": { span: true },
    "VID_U2_03:1": { funnel: { stages: [{ l: "Job analysis" }, { l: "Job description" }, { l: "Person specification" }, { l: "Advertise" }, { l: "Applications", n: "48" }, { l: "Shortlist", n: "4" }, { l: "Interview" }, { l: "Offer", n: "1 hire" }] } },
    "VID_U2_04:1": { loop: { barrier: 1, barrierLabel: "Barrier: noise, jargon, overload", nodes: [{ l: "Sender encodes", i: "person", c: "accent" }, { l: "Message via channel", i: "bars", c: "warn" }, { l: "Receiver decodes", i: "person", c: "good" }, { l: "Feedback", i: "bulb", c: "accent2" }] } },
    "VID_U2_04:4": { loop: { barrier: 1, barrierLabel: "Barriers break the loop", nodes: [{ l: "Sender", i: "person", c: "accent" }, { l: "Message", i: "bars", c: "warn" }, { l: "Receiver", i: "person", c: "good" }, { l: "Feedback", i: "bulb", c: "accent2" }] } },
    "VID_U3_01:2": { donut: { share: 0.2, sub: "market share", a: "Verdant Crunch $1.6m", b: "Total market $8m" } },
    "VID_U3_01:4": { hub: { center: "Segmenting a market", items: [{ l: "Age", i: "people", c: "accent" }, { l: "Gender", i: "person", c: "accent2" }, { l: "Income", i: "coinF", c: "warn" }, { l: "Location", i: "pin", c: "good" }, { l: "Lifestyle", i: "star", c: "bad" }] } },
    "VID_U3_03:0": { hub: { center: "The marketing mix", items: [{ l: "Product", s: "design, brand, packaging", i: "bulb", c: "accent" }, { l: "Price", s: "what customers pay", i: "coinF", c: "warn" }, { l: "Place", s: "distribution", i: "truckF", c: "good" }, { l: "Promotion", s: "advertising, offers", i: "star", c: "accent2" }] } },
    "VID_U3_04:2": { hub: { center: "The four Ps", items: [{ l: "Product", i: "bulb", c: "accent" }, { l: "Price", i: "coinF", c: "warn" }, { l: "Place", i: "truckF", c: "good" }, { l: "Promotion", i: "star", c: "accent2" }] } },
    "VID_U3_03:2": { curve: { yl: "Sales (units)", xl: "Time", bands: [{ x0: 0, x1: .22, l: "Introduction", c: "accent" }, { x0: .22, x1: .5, l: "Growth", c: "good" }, { x0: .5, x1: .76, l: "Maturity", c: "warn" }, { x0: .76, x1: 1, l: "Decline", c: "bad" }], curves: [{ c: "accent", f: function (u) { return .95 * Math.exp(-Math.pow((u - .58) / .27, 2)) + .03; } }], marks: [{ x: .1, y: .1, l: "2k", c: "accent", at: .4, dy: -18 }, { x: .38, y: .6, l: "9k", c: "good", at: .5, dy: -18 }, { x: .6, y: .95, l: "14k", c: "warn", at: .6, dy: -18 }, { x: .88, y: .38, l: "6k", c: "bad", at: .7, dy: -18 }] } },
    "VID_U3_03:3": { curve: { yl: "Sales (units)", xl: "Time", bands: [{ x0: 0, x1: .22, l: "Introduction", c: "accent" }, { x0: .22, x1: .5, l: "Growth", c: "good" }, { x0: .5, x1: .76, l: "Maturity", c: "warn" }, { x0: .76, x1: 1, l: "Decline", c: "bad" }], curves: [{ c: "muted", dash: 1, f: function (u) { return .95 * Math.exp(-Math.pow((u - .58) / .27, 2)) + .03; }, l: "without action", lx: .92, ly: 22 }, { c: "good", delay: .4, f: function (u) { var b = .95 * Math.exp(-Math.pow((u - .58) / .27, 2)) + .03; return u < .66 ? b : Math.max(b, Math.min(.9, b + .45 * ease((u - .66) / .1))); }, l: "with extension strategy", lx: .86, ly: -20 }] } },
    "VID_U3_03:5": { curve: { yl: "Price", xl: "Time after launch", bands: [{ x0: 0, x1: .5, l: "Launch", c: "accent" }, { x0: .5, x1: 1, l: "Later", c: "good" }], curves: [{ c: "accent", f: function (u) { return .22 + .25 * u; }, l: "Penetration: low start, share", lx: .7, ly: 22 }, { c: "warn", delay: .3, f: function (u) { return .88 - .38 * ease(u * 1.1); }, l: "Skimming: high start", lx: .3, ly: -20 }] } },
    "VID_U4_02:1": { wf: { steps: [{ l: "Fixed cost", v: 2000, t: "up", c: "muted" }, { l: "Variable: 1,000 x $2", v: 2000, t: "up", c: "warn" }, { l: "Total cost", t: "total", c: "accent" }] } },
    "VID_U4_02:2": { curve: { yl: "Average cost per unit", xl: "Output (scale of production)", bands: [{ x0: 0, x1: .5, l: "Economies of scale", c: "good" }, { x0: .5, x1: 1, l: "Diseconomies of scale", c: "bad" }], curves: [{ c: "accent", f: function (u) { return .2 + 2.2 * Math.pow(u - .5, 2); } }], marks: [{ x: .5, y: .2, l: "lowest average cost", c: "accent", at: .7, dy: 26 }] } },
    "VID_U4_02:3": { wf: { steps: [{ l: "Variable cost", v: 2, t: "up", c: "warn" }, { l: "Contribution", v: 4, t: "up", c: "good" }, { l: "Selling price", t: "total", c: "accent" }], fmt: function (v) { return "$" + v; } } },
    "VID_U4_02:4": { be: { static: false } },
    "VID_U4_02:5": { be: { static: true, profit: true } },
    "VID_U4_02:6": { be: { static: true, mos: true } },
    "VID_U4_04:0": { map: { note: "Which site minimises total annual cost?" } },
    "VID_U4_04:2": { map: { note: "Qualitative: skills, reputation, quality of life" } },
    "VID_U4_04:3": { wf: { max: 520000, steps: [{ l: "Labour", v: 300000, t: "up", c: "accent" }, { l: "Transport", v: 80000, t: "up", c: "warn" }, { l: "Materials", v: 40000, t: "up", c: "accent2" }, { l: "Utilities", v: 60000, t: "up", c: "good" }, { l: "Incentive", v: 30000, t: "down", c: "bad" }, { l: "Site A total", t: "total", c: "accent" }] } },
    "VID_U4_04:4": { wf: { max: 520000, ref: { v: 450000, l: "Site A: $450,000" }, steps: [{ l: "Labour", v: 360000, t: "up", c: "accent" }, { l: "Transport", v: 20000, t: "up", c: "warn" }, { l: "Materials", v: 70000, t: "up", c: "accent2" }, { l: "Utilities", v: 50000, t: "up", c: "good" }, { l: "Site B total", t: "total", c: "accent" }] } },
    "VID_U4_04:5": { wf: { max: 560000, ref: { v: 500000, l: "Site B: $500,000" }, steps: [{ l: "Labour", v: 300000, t: "up", c: "accent" }, { l: "Transport now 140k", v: 140000, t: "up", c: "bad" }, { l: "Materials", v: 40000, t: "up", c: "accent2" }, { l: "Utilities", v: 60000, t: "up", c: "good" }, { l: "Incentive", v: 30000, t: "down", c: "muted" }, { l: "Site A now", t: "total", c: "accent" }] } },
    "VID_U5_02:2": { signed: { vals: [{ l: "Month 1", v: 16000 }, { l: "Month 2", v: 11000 }], note: "Closing cash balance each month" } },
    "VID_U5_02:3": { signed: { vals: [{ l: "Month 1", v: 16000 }, { l: "Month 2", v: 11000 }, { l: "Month 3", v: 1000 }, { l: "Month 4", v: -4000 }], note: "Month 4 goes negative: a cash shortfall" } },
    "VID_U5_03:1": { wf: { steps: [{ l: "Revenue", v: 120000, t: "total", c: "accent" }, { l: "Cost of sales", v: 45000, t: "down", c: "bad" }, { l: "Gross profit", t: "total", c: "good" }] } },
    "VID_U5_03:2": { wf: { steps: [{ l: "Gross profit", v: 75000, t: "total", c: "good" }, { l: "Expenses", v: 38000, t: "down", c: "bad" }, { l: "Profit", t: "total", c: "accent" }] } },
    "VID_U5_03:3": { wf: { steps: [{ l: "Profit", v: 37000, t: "total", c: "accent" }, { l: "Tax", v: 7000, t: "down", c: "bad" }, { l: "Dividends", v: 10000, t: "down", c: "warn" }, { l: "Retained profit", t: "total", c: "good" }] } },
    "VID_U5_04:1": { bal: { lt: "Assets", rt: "Liabilities + equity", left: [{ l: "Non-current", v: 180000, c: "accent" }, { l: "Current", v: 50000, c: "good" }], right: [], tilt0: -0.16, tiltEnd: -0.16, scale: 230000, note: "Total assets $230,000" } },
    "VID_U5_04:2": { bal: { lt: "Assets $230k", rt: "Liabilities $110k", left: [{ l: "Non-current", v: 180000, c: "accent" }, { l: "Current", v: 50000, c: "good" }], right: [{ l: "Non-current liab.", v: 70000, c: "warn" }, { l: "Current liab.", v: 40000, c: "bad" }], tilt0: -0.16, tiltEnd: -0.12, scale: 230000, note: "Gap of $120,000: equity still to be added" } },
    "VID_U5_04:3": { bal: { lt: "Total assets $230k", rt: "Liabilities + equity $230k", left: [{ l: "Non-current", v: 180000, c: "accent" }, { l: "Current", v: 50000, c: "good" }], right: [{ l: "Non-current liab.", v: 70000, c: "warn" }, { l: "Current liab.", v: 40000, c: "bad" }, { l: "Equity", v: 120000, c: "accent2" }], tilt0: -0.12, tiltEnd: 0, scale: 230000, note: "Balanced: assets = liabilities + equity" } },
    "VID_U6_01:1": { curve: { yl: "Output (GDP)", xl: "Time", bands: [{ x0: 0, x1: .25, l: "Growth", c: "good" }, { x0: .25, x1: .5, l: "Boom", c: "warn" }, { x0: .5, x1: .75, l: "Recession", c: "bad" }, { x0: .75, x1: 1, l: "Slump", c: "accent2" }], curves: [{ c: "muted", dash: 1, f: function () { return .5; }, l: "trend", lx: .05, ly: -14 }, { c: "accent", f: function (u) { return .5 + .36 * Math.sin(u * 6.283 - .8); } }] } },
    "VID_U6_02:1": { wf: { steps: [{ l: "Private cost: treatment", v: 150000, t: "up", c: "accent" }, { l: "External cost: harm to town", v: 400000, t: "up", c: "bad" }, { l: "Social cost", t: "total", c: "accent2" }] } },
    "VID_U6_02:3": { pillars: { roof: "SUSTAINABLE DEVELOPMENT", items: [{ l: "Economic", s: "profit", i: "coin", c: "warn" }, { l: "Social", s: "fairness", i: "people", c: "accent" }, { l: "Environmental", s: "care", i: "field", c: "good" }] } },
    "VID_U6_03:3": { fx: { a: "$400", b: "300 pounds", rate: "$1 = 0.75 pounds", rate2: "pounds to dollars: divide by 0.75", note: "$400 x 0.75 = 300 pounds   |   300 / 0.75 = $400" } },
    "VID_U6_03:4": { fx: { a: "$500 export", b: "240 pound import", rate: "$1 = 0.60 pounds", rate2: "the dollar depreciates", note: "Weaker dollar: exports cheaper abroad, imports dearer at home", nc: "warn" } },
    "VID_U6_03:5": { gate: { mode: "tariff", trucks: 5, l1: "Tariff = 10% of $400 = $40 tax", l2: "Landed cost $440 (330 pounds at 0.75)" } },
    "VID_U6_03:6": { gate: { mode: "quota", trucks: 6, pass: 4, l1: "Quota: 12,000 wanted, only 8,000 allowed in", l2: "4,000 unit gap pushes the price up to 330 pounds" } }
  };
  /* ======================= BATCH 2: generic + extra diagrams ======================= */
  var PIC2 = {
    doc: function (c, s, col) { c.fillStyle = col; c.fillRect(-s * .7, -s, s * 1.4, s * 2); c.fillStyle = hexAlpha(PALETTE.bg, .75); for (var i = 0; i < 4; i++) c.fillRect(-s * .45, -s * .6 + i * s * .38, s * .9, s * .12); },
    clock: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(0, 0, s, 0, 6.283); c.fill(); c.strokeStyle = hexAlpha(PALETTE.bg, .85); c.lineWidth = s * .14; c.lineCap = "round"; c.beginPath(); c.moveTo(0, -s * .6); c.lineTo(0, 0); c.lineTo(s * .45, s * .2); c.stroke(); },
    scale: function (c, s, col) { c.strokeStyle = col; c.lineWidth = s * .14; c.lineCap = "round"; c.beginPath(); c.moveTo(0, -s); c.lineTo(0, s); c.moveTo(-s, -s * .5); c.lineTo(s, -s * .5); c.moveTo(-s * .5, s); c.lineTo(s * .5, s); c.stroke(); c.fillStyle = col; c.beginPath(); c.arc(-s * .8, s * .1, s * .35, 0, Math.PI); c.arc(s * .8, s * .1, s * .35, 0, Math.PI); c.fill(); },
    check: function (c, s, col) { c.strokeStyle = col; c.lineWidth = s * .3; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(-s * .7, 0); c.lineTo(-s * .2, s * .55); c.lineTo(s * .8, -s * .6); c.stroke(); },
    cross: function (c, s, col) { c.strokeStyle = col; c.lineWidth = s * .3; c.lineCap = "round"; c.beginPath(); c.moveTo(-s * .6, -s * .6); c.lineTo(s * .6, s * .6); c.moveTo(s * .6, -s * .6); c.lineTo(-s * .6, s * .6); c.stroke(); },
    quest: function (c, s, col) { c.fillStyle = col; c.font = "900 " + (s * 2) + "px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 0, s * .1); },
    gearF: function (c, s, col) { c.fillStyle = col; c.beginPath(); for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = i % 2 ? s * .75 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.fillStyle = hexAlpha(PALETTE.bg, .8); c.beginPath(); c.arc(0, 0, s * .3, 0, 6.283); c.fill(); },
    chartF: function (c, s, col) { c.fillStyle = col; c.fillRect(-s * .9, s * .1, s * .5, s * .8); c.fillRect(-s * .25, -s * .4, s * .5, s * 1.3); c.fillRect(s * .4, -s * .9, s * .5, s * 1.8); },
    globeF: function (c, s, col) { c.fillStyle = hexAlpha(col, .9); c.beginPath(); c.arc(0, 0, s, 0, 6.283); c.fill(); c.strokeStyle = hexAlpha(PALETTE.bg, .7); c.lineWidth = s * .1; c.beginPath(); c.ellipse(0, 0, s * .45, s, 0, 0, 6.283); c.moveTo(-s, 0); c.lineTo(s, 0); c.stroke(); },
    shieldF: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .8, -s * .6); c.lineTo(s * .7, s * .3); c.quadraticCurveTo(0, s * 1.1, -s * .7, s * .3); c.lineTo(-s * .8, -s * .6); c.closePath(); c.fill(); c.strokeStyle = hexAlpha(PALETTE.bg, .8); c.lineWidth = s * .2; c.lineCap = "round"; c.beginPath(); c.moveTo(-s * .3, 0); c.lineTo(-s * .05, s * .3); c.lineTo(s * .35, -s * .25); c.stroke(); },
    bulbF: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.arc(0, -s * .2, s * .65, 0, 6.283); c.fill(); c.fillRect(-s * .25, s * .3, s * .5, s * .45); },
    cartF: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.moveTo(-s * .8, -s * .4); c.lineTo(s * .9, -s * .4); c.lineTo(s * .6, s * .3); c.lineTo(-s * .5, s * .3); c.closePath(); c.fill(); c.beginPath(); c.arc(-s * .3, s * .7, s * .16, 0, 6.283); c.arc(s * .4, s * .7, s * .16, 0, 6.283); c.fill(); },
    bankF: function (c, s, col) { c.fillStyle = col; c.beginPath(); c.moveTo(-s, -s * .3); c.lineTo(0, -s); c.lineTo(s, -s * .3); c.closePath(); c.fill(); for (var i = -2; i <= 2; i++) c.fillRect(i * s * .35 - s * .08, -s * .2, s * .16, s * .8); c.fillRect(-s, s * .7, s * 2, s * .2); }
  };
  Object.keys(PIC2).forEach(function (k) { PIC[k] = PIC2[k]; });
  /* match a label to a concept picture (replaces the old restaurant-bell / syringe / generic-document guesses) */
  var AUTO_ICON = [
    [/\$|cost|price|revenue|profit|cash|wage|pay\b|salary|fee|loan|overdraft|saving|capital|money|tax|income|budget|finance|invest|dividend/i, "coinF"],
    [/bank|lender|debt|equity|interest rate|borrow/i, "bankF"],
    [/staff|worker|employee|people|customer|owner|team|shareholder|manager|applicant|hire|recruit|union|member|household|buyer|supplier|stakeholder|patient/i, "people"],
    [/factory|production|manufactur|machine|assembly|output|capacity|plant|oven|workshop|lean|kaizen|batch|flow\b/i, "factory"],
    [/truck|transport|deliver|distribution|route|logistic|import|export|supply chain|wholesaler/i, "truckF"],
    [/shop|retail|store|sales|outlet|franchis|grocer|ecommerce|online/i, "shop"],
    [/chart|rise|rises|growth|grow|percent|%|increase|trend|forecast|gdp|inflation|boom|recession|slump/i, "chartF"],
    [/survey|questionnaire|contract|plan|report|statement|record|document|paperwork|form|manual|note|law|legal|rule|regulation|specification|description|cv/i, "doc"],
    [/day|week|month|year|time|hour|delay|speed|quick|fast|period|deadline|schedule/i, "clock"],
    [/global|world|trade|overseas|market|country|countries|abroad|network|international/i, "globeF"],
    [/quality|protect|safety|safe|risk|inspect|check|standard|trust|insur|secure|defect|waste|failure/i, "shieldF"],
    [/idea|brand|new |innovat|creativ|design|product|enterprise|entrepreneur|objective|goal|target|smart|motivat|reward|bonus|praise/i, "bulbF"],
    [/site|location|map|place|pin|region|city|port/i, "pin"],
    [/farm|land|raw|cocoa|harvest|resource|environment|natural|green|sustain/i, "field"],
    [/process|technology|automation|cad|cam|equipment|system|method|step|stage/i, "gearF"],
    [/balance|weigh|judge|compare|versus|trade-off|decision|evaluate/i, "scale"]
  ];
  function autoIcon(label, i) {
    for (var k = 0; k < AUTO_ICON.length; k++) if (AUTO_ICON[k][0].test(String(label))) return AUTO_ICON[k][1];
    return ["bulbF", "chartF", "people", "gearF", "globeF"][i % 5];
  }
  function wrapN(ctx, s, w, size, wt, max) { return wrap(ctx, s, w, size, wt).slice(0, max || 4); }
  function T2(ctx, str, x, y, size, col, wt, al, w) { var z = Math.max(size, 18); TT(ctx, str, x, y, z, col, wt, al, w); return z; }
  function lines2(ctx, str, x, cy, w, size, col, wt, al, maxL) {
    var ls = wrapN(ctx, str, w, size, wt || 750, maxL || 4);
    ls.forEach(function (l, i) { TT(ctx, l, x, cy + (i - (ls.length - 1) / 2) * size * 1.22, size, col || PALETTE.ink, wt || 750, al || "center", w + 8); });
    return ls.length;
  }
  function splitHead(s) { var m = String(s).match(/^([^:]{2,34}):\s*(.+)$/); return m ? { h: m[1], b: m[2] } : { h: "", b: String(s) }; }

  /* generic numbered step cards with concept pictures (row, or two rows for 6+) */
  function dSteps(ctx, R, p, o) {
    var items = o.items, n = items.length, rows = n > 5 ? 2 : 1, per = Math.ceil(n / rows), gap = 34;
    var w = Math.min(300, (R.w - gap * (per - 1)) / per), h = rows === 2 ? (R.h - 40) / 2 - 10 : Math.min(R.h - 40, 330);
    items.forEach(function (it, i) {
      var r = Math.floor(i / per), c = i % per, rowN = Math.min(per, n - r * per), totalW = rowN * w + (rowN - 1) * gap;
      var x = R.x + (R.w - totalW) / 2 + c * (w + gap), y = R.y + (rows === 2 ? r * (h + 20) : (R.h - h) / 2 - 10), t = stage(p, i, n), col = C(["accent", "good", "warn", "accent2", "bad"][i % 5]);
      ctx.save(); ctx.globalAlpha = t; ctx.translate(0, (1 - t) * 14);
      box(ctx, x, y, w, h, hexAlpha(PALETTE.panel, .96), col, 20);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 28, y + 28, 17, 0, 6.283); ctx.fill(); TT(ctx, i + 1, x + 28, y + 28, 19, "#08111F", 900, "center");
      pic(ctx, it.i || autoIcon(it.t, i), x + w / 2, y + h * (rows === 2 ? .3 : .27), rows === 2 ? 30 : 42, col);
      lines2(ctx, it.t, x + w / 2, y + h * (rows === 2 ? .7 : .66), w - 32, 21, PALETTE.ink, 800, "center", 5);
      ctx.restore();
      if (c < rowN - 1) { ctx.save(); ctx.globalAlpha = t; arrowHead(ctx, x + w + 4, y + h / 2, x + w + gap - 4, y + h / 2, hexAlpha(PALETTE.ink, .6), 3); ctx.restore(); }
    });
  }

  /* heading + text columns (split screens) */
  function dCols(ctx, R, p, o) {
    var items = o.items, n = items.length, cols = n <= 3 ? n : 2, rows = Math.ceil(n / cols), gap = 26;
    var w = (R.w - gap * (cols - 1)) / cols, h = (R.h - 20 - gap * (rows - 1)) / rows, oy = 0;
    if (rows === 1 && h > 300) { oy = (h - 300) / 2; h = 300; }
    items.forEach(function (it, i) {
      var c = i % cols, r = Math.floor(i / cols), x = R.x + c * (w + gap), y = R.y + 10 + oy + r * (h + gap), t = stage(p, i, n), col = C(["accent", "warn", "good", "accent2"][i % 4]);
      ctx.save(); ctx.globalAlpha = t; ctx.translate(0, (1 - t) * 14);
      box(ctx, x, y, w, h, hexAlpha(PALETTE.panel, .96), col, 20);
      ctx.fillStyle = hexAlpha(col, .9); rr(ctx, x, y, w, 62, 20); ctx.fill(); ctx.fillRect(x, y + 40, w, 22);
      pic(ctx, it.i || autoIcon(it.h + " " + it.b, i), x + 36, y + 31, 17, "#08111F");
      TT(ctx, it.h || "Key point", x + 66, y + 31, 22, "#08111F", 900, "left", w - 84);
      lines2(ctx, it.b, x + w / 2, y + 62 + (h - 62) / 2, w - 40, 21, PALETTE.ink, 700, "center", 5);
      ctx.restore();
    });
  }

  /* evaluation: weigh two sides on a beam */
  function classify(labels) {
    var pro = [], con = [], ver = [];
    labels.forEach(function (l) {
      var s = String(l);
      if (/^(judge|weigh|start niche|mixed economy|neutral|coherent|numbers|judgement|rebalance|state|name|pick|choose)/i.test(s)) ver.push(s);
      else if (/limit|^cost\b|cost:|^con\b|con:| minus|risk|slow|assum|misses|historic|unlimited|administration|against|extra|retaliation|stretched|dear|danger|only \d|jobs lost|price war|but small|costly|diluted|interest due/i.test(s)) con.push(s);
      else pro.push(s);
    });
    if (!pro.length || !con.length) { var all = pro.concat(con), half = Math.ceil(all.length / 2); pro = all.slice(0, half); con = all.slice(half); }
    return { pro: pro, con: con, ver: ver };
  }
  function dEval(ctx, R, p, o) {
    var cl = classify(o.labels), cx = R.x + R.w / 2, t = ease(p * 1.6), tilt = (cl.con.length - cl.pro.length) * .03 * t;
    var panelW = (R.w - 140) / 2, top = R.y + 90, hh = R.h - 190;
    [[0, cl.pro, "good", "FOR", "check"], [1, cl.con, "bad", "AGAINST", "cross"]].forEach(function (sd) {
      var x = sd[0] ? cx + 70 : R.x, items = sd[1], col = C(sd[2]);
      ctx.save(); ctx.translate(0, tilt * (sd[0] ? 1 : -1) * 60);
      box(ctx, x, top, panelW, hh, hexAlpha(PALETTE.panel, .96), col, 20);
      ctx.fillStyle = hexAlpha(col, .9); rr(ctx, x, top, panelW, 54, 20); ctx.fill(); ctx.fillRect(x, top + 34, panelW, 20);
      TT(ctx, sd[3], x + panelW / 2, top + 27, 22, "#08111F", 900, "center");
      var each = (hh - 64) / Math.max(1, items.length);
      items.forEach(function (it, i) { var a = stage(p, i + (sd[0] ? 1 : 0), items.length + 2), cy = top + 64 + each * i + each / 2; ctx.globalAlpha = a; pic(ctx, sd[4], x + 34, cy, 14, col); lines2(ctx, it.replace(/^(advantage|benefit|limitation|cost|pro|con|useful):\s*/i, ""), x + 58 + (panelW - 80) / 2, cy, panelW - 90, 20, PALETTE.ink, 700, "center", 3); });
      ctx.restore();
    });
    ctx.save(); ctx.translate(cx, R.y + 40); ctx.rotate(tilt); line(ctx, -R.w * .42, 0, R.w * .42, 0, PALETTE.ink, 7); ctx.restore();
    ctx.fillStyle = PALETTE.accent; ctx.beginPath(); ctx.arc(cx, R.y + 40, 12, 0, 6.283); ctx.fill();
    if (cl.ver.length) { var vy = R.y + R.h - 52; box(ctx, R.x + 60, vy - 28, R.w - 120, 56, hexAlpha(C("accent"), .2), C("accent"), 16); lines2(ctx, "Verdict: " + cl.ver.join("  |  ").replace(/^(Judge|Weigh)/, "$1"), cx, vy, R.w - 160, 20, PALETTE.ink, 850, "center", 1); }
    else { var vy2 = R.y + R.h - 52; box(ctx, R.x + 60, vy2 - 28, R.w - 120, 56, hexAlpha(C("accent"), .2), C("accent"), 16); TT(ctx, "Judge both sides, then justify your choice", cx, vy2, 20, PALETTE.ink, 850, "center"); }
  }

  /* recap quiz */
  function dRecap(ctx, R, p, o) {
    var n = o.labels.length, cx = R.x + 190, cy = R.y + R.h / 2 - 10, t = ease(p * 2);
    ctx.save(); ctx.globalAlpha = t; ctx.shadowColor = hexAlpha(C("accent"), .6); ctx.shadowBlur = 30; ctx.fillStyle = C("accent"); ctx.beginPath(); ctx.arc(cx, cy, 120, 0, 6.283); ctx.fill(); ctx.restore();
    pic(ctx, "quest", cx, cy, 70, "#08111F"); TT(ctx, "RECAP", cx, cy + 150, 22, C("accent"), 900, "center");
    var x0 = R.x + 360, w = R.w - 360, h = (R.h - 30 - 18 * (n - 1)) / n;
    o.labels.forEach(function (l, i) {
      var y = R.y + 10 + i * (h + 18), a = stage(p, i, n), col = C(["accent", "good", "warn", "accent2"][i % 4]);
      ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * 30, 0);
      box(ctx, x0, y, w, h, hexAlpha(PALETTE.panel, .96), col, 16);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0 + 38, y + h / 2, 20, 0, 6.283); ctx.fill(); TT(ctx, i + 1, x0 + 38, y + h / 2, 22, "#08111F", 900, "center");
      lines2(ctx, l, x0 + 70 + (w - 90) / 2, y + h / 2, w - 100, 22, PALETTE.ink, 800, "center", 2);
      ctx.restore();
    });
  }

  /* before / after paired bars: pairs [{l,a,b,pre,suf}] */
  function dPairs(ctx, R, p, o) {
    var items = o.pairs, n = items.length, gw = R.w / n, B = R.y + R.h - 70, T = R.y + 60, H = B - T;
    ctx.fillStyle = C("muted"); ctx.fillRect(R.x + 10, R.y + 8, 20, 20); TT(ctx, o.la || "Before", R.x + 40, R.y + 18, 18, PALETTE.muted, 800, "left");
    ctx.fillStyle = C("good"); ctx.fillRect(R.x + 170, R.y + 8, 20, 20); TT(ctx, o.lb || "After", R.x + 200, R.y + 18, 18, PALETTE.good, 800, "left");
    items.forEach(function (it, i) {
      var gx = R.x + i * gw + gw / 2, mx = Math.max(it.a, it.b) * 1.12, bw = Math.min(110, gw / 3), a = stage(p, i, n);
      [[it.a, -bw * .6, "muted"], [it.b, bw * .6, "good"]].forEach(function (b) {
        var h = b[0] / mx * H * a, x = gx + b[1] - bw / 2; box(ctx, x, B - h, bw, Math.max(h, .1), hexAlpha(C(b[2]), .9), C(b[2]), 8);
        if (a > .6) TT(ctx, (it.pre || "") + b[0].toLocaleString("en-US") + (it.suf || ""), x + bw / 2, B - h - 18, 20, PALETTE.ink, 850, "center");
      });
      lines2(ctx, it.l, gx, B + 30, gw - 20, 18, PALETTE.muted, 750, "center", 2);
    });
    line(ctx, R.x, B, R.x + R.w, B, hexAlpha(PALETTE.ink, .5), 2);
  }

  /* fraction / ratio card */
  function dFrac(ctx, R, p, o) {
    var cx = R.x + R.w * .34, t = ease(p * 2), y0 = R.y + 40;
    function cell(y, it, col) { box(ctx, cx - 210, y, 420, 110, hexAlpha(PALETTE.panel, .96), col, 18); TT(ctx, it.l, cx, y + 32, 20, PALETTE.muted, 800, "center", 400); TT(ctx, it.v, cx, y + 76, 38, PALETTE.ink, 900, "center", 400); }
    cell(y0, o.top, C("accent")); line(ctx, cx - 230, y0 + 136, cx + 230, y0 + 136, PALETTE.ink, 5); cell(y0 + 162, o.bottom, C("warn"));
    TT(ctx, o.op || "divided by", cx + 255, y0 + 136, 18, PALETTE.muted, 750, "left");
    var rx = R.x + R.w * .78, ry = y0 + 136;
    ctx.save(); ctx.globalAlpha = t; ctx.shadowColor = hexAlpha(C("good"), .6); ctx.shadowBlur = 26; ctx.fillStyle = C("good"); ctx.beginPath(); ctx.arc(rx, ry, 120, 0, 6.283); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = t; TT(ctx, "= " + o.res, rx, ry - 8, o.res.length > 8 ? 30 : 40, "#08111F", 900, "center", 220); TT(ctx, o.rl || "result", rx, ry + 42, 18, "#08111F", 800, "center", 200); ctx.restore();
    if (o.bar) {
      var by = R.y + R.h - 120, bw = R.w - 40, a = o.bar[0], b = o.bar[1], mx = Math.max(a, b);
      TT(ctx, o.barTitle || "Compared to scale", R.x + 20, by - 24, 18, PALETTE.muted, 800, "left");
      box(ctx, R.x + 20, by, bw * (b / mx) * t, 30, hexAlpha(C("warn"), .85), C("warn"), 8); TT(ctx, o.bar[3] || "", R.x + 30, by + 15, 17, "#08111F", 850, "left");
      box(ctx, R.x + 20, by + 42, Math.max(10, bw * (a / mx) * t), 30, hexAlpha(C("accent"), .85), C("accent"), 8); TT(ctx, o.bar[2] || "", R.x + 30, by + 57, 17, "#08111F", 850, "left");
    }
  }

  function dSampling(ctx, R, p, o) {
    var cols = 14, rows = 6, gx = 54, gy = 54, x0 = R.x + 30, y0 = R.y + 70, picks = [], i;
    function inPick(k) { return picks.indexOf(k) >= 0; }
    if (o.mode === "random") picks = [3, 9, 17, 22, 30, 38, 41, 49, 57, 63, 70, 78];
    else if (o.mode === "quota") picks = [0, 1, 14, 15, 5, 6, 19, 20, 9, 10, 23, 24, 28, 29, 42, 43, 33, 34, 47, 48];
    else picks = [0, 1, 2, 14, 15, 16, 28, 29, 30, 42, 43, 44];
    TT(ctx, o.title, R.x + R.w / 2, R.y + 28, 22, PALETTE.ink, 850, "center");
    for (i = 0; i < cols * rows; i++) {
      var c = i % cols, r = Math.floor(i / cols), x = x0 + c * gx, y = y0 + r * gy, on = inPick(i) && stage(p, picks.indexOf(i) / 3, 8) > .3;
      var grp = o.mode === "quota" ? (c < 5 ? 0 : c < 10 ? 1 : 2) : 0, col = o.mode === "quota" ? C(["accent", "warn", "good"][grp]) : C("accent");
      ctx.save(); ctx.globalAlpha = on ? 1 : .42; if (on) { ctx.shadowColor = hexAlpha(col, .9); ctx.shadowBlur = 16; ctx.fillStyle = hexAlpha(col, .3); ctx.beginPath(); ctx.arc(x, y, 22, 0, 6.283); ctx.fill(); }
      pic(ctx, "person", x, y - 2, on ? 11 : 9, on ? col : C("muted")); ctx.restore();
    }
    if (o.mode === "bias") { ctx.save(); ctx.strokeStyle = C("bad"); ctx.lineWidth = 4; ctx.setLineDash([10, 8]); rr(ctx, x0 - 28, y0 - 28, 3 * gx + 8, 3 * gy + 6, 14); ctx.stroke(); ctx.restore(); TT(ctx, "One gym only", x0 + 3 * gx + 40, y0 + 40, 20, C("bad"), 850, "left"); TT(ctx, "everyone else is missed", x0 + 3 * gx + 40, y0 + 70, 18, PALETTE.muted, 700, "left"); }
    TT(ctx, o.note, R.x + R.w / 2, R.y + R.h - 36, 20, C("warn"), 850, "center", R.w - 40);
  }

  function dSmart(ctx, R, p, o) {
    var n = o.items.length, gap = 24, w = (R.w - gap * (n - 1)) / n, h = R.h - 40;
    o.items.forEach(function (it, i) {
      var x = R.x + i * (w + gap), y = R.y + 20, t = stage(p, i, n), col = C(["accent", "good", "warn", "accent2"][i % 4]);
      ctx.save(); ctx.globalAlpha = t; ctx.translate(0, (1 - t) * 20);
      box(ctx, x, y, w, h, hexAlpha(PALETTE.panel, .96), col, 22);
      TT(ctx, it.k, x + w / 2, y + 90, 100, col, 900, "center"); TT(ctx, it.h, x + w / 2, y + 170, 24, PALETTE.ink, 900, "center", w - 20);
      lines2(ctx, it.t, x + w / 2, y + 270, w - 36, 21, PALETTE.muted, 700, "center", 4);
      ctx.restore();
    });
  }

  function dQC(ctx, R, p, o) {
    function row(y, title, col, every) {
      TT(ctx, title, R.x + 10, y - 56, 22, col, 900, "left");
      var n = 4, w = 150, gap = (R.w - 20 - w * n) / (n - 1);
      ["Design", "Make", "Assemble", "Final product"].forEach(function (s, i) {
        var x = R.x + 10 + i * (w + gap), t = stage(p, i, n); ctx.save(); ctx.globalAlpha = t;
        box(ctx, x, y - 34, w, 68, hexAlpha(PALETTE.panel, .96), col, 14); TT(ctx, s, x + w / 2, y, 20, PALETTE.ink, 800, "center", w - 12);
        if (i < n - 1) arrowHead(ctx, x + w + 4, y, x + w + gap - 4, y, hexAlpha(PALETTE.ink, .6), 3);
        if (every ? i < 3 : i === 3) { ctx.fillStyle = C("good"); ctx.beginPath(); ctx.arc(x + w - 4, y - 34, 18, 0, 6.283); ctx.fill(); pic(ctx, "check", x + w - 4, y - 34, 9, "#08111F"); }
        ctx.restore();
      });
    }
    row(R.y + 110, "QUALITY CONTROL: one gate at the end", C("warn"), false);
    row(R.y + 300, "QUALITY ASSURANCE: a check at every stage", C("good"), true);
    TT(ctx, "The gate catches defects; the loop prevents them", R.x + R.w / 2, R.y + R.h - 30, 22, C("accent"), 850, "center", R.w - 40);
  }

  function dParent(ctx, R, p, o) {
    var cx = R.x + R.w / 2, t = ease(p * 2);
    box(ctx, cx - 190, R.y + 20, 380, 100, hexAlpha(PALETTE.panel, .96), C("accent"), 18); pic(ctx, "factory", cx - 130, R.y + 70, 26, C("accent")); TT(ctx, "Parent company", cx + 30, R.y + 55, 20, PALETTE.muted, 800, "center"); TT(ctx, "Vantara Devices", cx + 30, R.y + 90, 24, PALETTE.ink, 900, "center", 240);
    box(ctx, cx - 190, R.y + R.h - 140, 380, 100, hexAlpha(PALETTE.panel, .96), C("warn"), 18); pic(ctx, "factory", cx - 130, R.y + R.h - 90, 26, C("warn")); TT(ctx, "Subsidiary", cx + 30, R.y + R.h - 105, 20, PALETTE.muted, 800, "center"); TT(ctx, "Vantara Assembly Works", cx + 30, R.y + R.h - 70, 20, PALETTE.ink, 900, "center", 240);
    ctx.save(); ctx.globalAlpha = t; arrowHead(ctx, cx - 90, R.y + 128, cx - 90, R.y + R.h - 148, C("good"), 8); TT(ctx, "$2m capital flows down", cx - 112, R.y + R.h / 2, 22, C("good"), 900, "right");
    arrowHead(ctx, cx + 90, R.y + R.h - 148, cx + 90, R.y + 128, C("warn"), 8); TT(ctx, "$600,000 profit returns", cx + 112, R.y + R.h / 2, 22, C("warn"), 900, "left"); ctx.restore();
  }

  function dIconRatio(ctx, R, p, o) {
    o.rows.forEach(function (rw, k) {
      var y = R.y + 70 + k * 220, col = C(k ? "good" : "warn"), n = rw.people + rw.machines, w = Math.min(46, (R.w - 40) / n);
      TT(ctx, rw.title, R.x + 10, y - 40, 22, col, 900, "left");
      var a = ease(p * 2 - k * .4);
      for (var i = 0; i < n; i++) { var x = R.x + 30 + i * w; ctx.save(); ctx.globalAlpha = a; if (i < rw.people) pic(ctx, "person", x, y, 15, C("accent")); else pic(ctx, "gearF", x, y, 16, col); ctx.restore(); }
      TT(ctx, rw.people + " workers, " + rw.machines + " machines  =  " + rw.ratio, R.x + 10, y + 70, 20, PALETTE.ink, 850, "left");
    });
    ctx.fillStyle = C("accent"); ctx.beginPath(); ctx.arc(R.x + R.w - 120, R.y + 50, 14, 0, 6.283); ctx.fill(); TT(ctx, "worker", R.x + R.w - 96, R.y + 50, 18, PALETTE.muted, 750, "left");
  }

  /* ---------- batch 2 spec table (concept-specific); anything missing falls back to auto ---------- */
  function wfBars(steps, fmt, extra) { var o = { steps: steps, fmt: fmt }; if (extra) for (var k in extra) o[k] = extra[k]; return { wf: o }; }
  function usd(v) { return "$" + v.toLocaleString("en-US"); }
  var BE_SPEC = { fc: 2400 };
  var TEACH2 = {
    "VID_U1_01:3": { chain: { note: "Output rises from 4 to 10 decks a week", items: [{ l: "Shape", i: "tools", c: "accent" }, { l: "Resin", i: "factory", c: "warn" }, { l: "Sand", i: "gearF", c: "good" }, { l: "Pack", i: "cartF", c: "accent2" }] } },
    "VID_U1_01:5": { pairs: { la: "Before", lb: "After", pairs: [{ l: "Added value per deck", a: 310, b: 360, pre: "$" }] } },
    "VID_U1_01:7": wfBars([{ l: "Price", v: 520, t: "total", c: "accent" }, { l: "Bought-in materials", v: 200, t: "down", c: "bad" }, { l: "Added value", t: "total", c: "good" }], function (v) { return "$" + v; }),
    "VID_U1_01:0": { cols: [{ h: "Need", b: "Essential for survival", i: "shieldF" }, { h: "Want", b: "Not essential for survival", i: "bulbF" }, { h: "Scarcity", b: "Unlimited wants, scarce resources", i: "scale" }] },
    "VID_U1_02:5": { curve: { yl: "Share of jobs", xl: "Time", bands: [{ x0: 0, x1: .4, l: "Industrialisation", c: "warn" }, { x0: .4, x1: 1, l: "De-industrialisation", c: "accent2" }], curves: [{ c: "good", f: function (u) { return .55 - .4 * ease(u * 1.2); }, l: "Primary", lx: .9, ly: 20 }, { c: "warn", delay: .3, f: function (u) { return .15 + .32 * Math.sin(Math.min(1, u * 1.2) * 3.0); }, l: "Secondary", lx: .5, ly: -22 }, { c: "accent", delay: .5, f: function (u) { return .2 + .5 * ease(u); }, l: "Tertiary (services)", lx: .88, ly: -20 }] } },
    "VID_U1_03:2": { hub: { center: "Business size", items: [{ l: "Employees", s: "number of staff", i: "people", c: "accent" }, { l: "Output / sales", s: "value or volume", i: "chartF", c: "good" }, { l: "Capital employed", s: "money invested", i: "coinF", c: "warn" }] } },
    "VID_U1_03:3": { pairs: { la: "Launch", lb: "Later", pairs: [{ l: "Staff", a: 40, b: 120 }, { l: "Sales", a: 1.2, b: 3.8, pre: "$", suf: "m" }, { l: "Capital employed", a: 0.4, b: 1.1, pre: "$", suf: "m" }] } },
    "VID_U1_04:0": { hub: { center: "Business forms", items: [{ l: "Sole trader", i: "person", c: "accent" }, { l: "Partnership", i: "people", c: "warn" }, { l: "Private Ltd", i: "shop", c: "good" }, { l: "Public Plc", i: "bankF", c: "accent2" }, { l: "Franchise", i: "cartF", c: "bad" }, { l: "Joint venture", i: "globeF", c: "accent" }, { l: "Public corporation", i: "factory", c: "warn" }] } },
    "VID_U1_05:0": { hub: { center: "Objectives", items: [{ l: "Survival", i: "shieldF", c: "accent" }, { l: "Profit", i: "coinF", c: "warn" }, { l: "Growth", i: "chartF", c: "good" }, { l: "Market share", i: "globeF", c: "accent2" }, { l: "CSR", i: "people", c: "bad" }] } },
    "VID_U1_05:1": { smart: [{ k: "S", h: "Specific", t: "patient meal rating" }, { k: "M", h: "Measurable", t: "70% to 85%" }, { k: "A", h: "Achievable", t: "train the team, two menus" }, { k: "T", h: "Time-bound", t: "twelve months" }] },
    "VID_U1_05:5": { chain: { note: "Objectives change as the firm matures", items: [{ l: "Start: survival", i: "shieldF", c: "accent" }, { l: "Next: growth", i: "chartF", c: "good" }, { l: "Later: market share", i: "globeF", c: "warn" }] } },
    "VID_U2_01:0": wfBars([{ l: "Target tops per day", v: 200, t: "total", c: "accent" }, { l: "Missing (absence 12%)", v: 40, t: "down", c: "bad" }, { l: "Actual tops per day", t: "total", c: "good" }], function (v) { return String(v); }),
    "VID_U2_01:2": { chain: { note: "160 tops x $0.40 = $64 a day", items: [{ l: "Time the seam", i: "clock", c: "accent" }, { l: "Standard: 20 tops/hour", i: "chartF", c: "warn" }, { l: "Piece rate $0.40", i: "coinF", c: "good" }, { l: "160 tops = $64", i: "cartF", c: "accent2" }] } },
    "VID_U2_01:5": { chain: { items: [{ l: "Because: repetitive seams", i: "gearF", c: "bad" }, { l: "Therefore: rotation and recognition", i: "people", c: "warn" }, { l: "So: higher effort and output", i: "chartF", c: "good" }] } },
    "VID_U2_01:6": { pairs: { la: "Before", lb: "After trial", pairs: [{ l: "Output (tops)", a: 160, b: 215 }, { l: "Absence", a: 12, b: 7, suf: "%" }, { l: "Waste", a: 8, b: 4, suf: "%" }] } },
    "VID_U2_02:0": { org: true },
    "VID_U2_02:3": { chain: { note: "Responsibility stays with the manager", items: [{ l: "Plan", i: "doc", c: "accent" }, { l: "Organise", i: "people", c: "good" }, { l: "Coordinate", i: "gearF", c: "warn" }, { l: "Command", i: "bulbF", c: "accent2" }, { l: "Control", i: "shieldF", c: "bad" }] } },
    "VID_U2_02:4": { pairs: { la: "Before", lb: "After", pairs: [{ l: "Staff", a: 40, b: 32 }] } },
    "VID_U2_02:6": { pairs: { la: "Before union", lb: "After agreement", pairs: [{ l: "Hourly pay", a: 12.0, b: 12.6, pre: "$" }] } },
    "VID_U2_02:8": { pairs: { la: "Start of year", lb: "End of year", pairs: [{ l: "Approval days", a: 6, b: 1 }, { l: "Staff", a: 40, b: 32 }, { l: "Daily consignments", a: 120, b: 134 }] } },
    "VID_U2_03:2": { pairs: { la: "Internal hire", lb: "External hire", pairs: [{ l: "Days to fill", a: 12, b: 35 }, { l: "Training cost", a: 600, b: 2400, pre: "$" }] } },
    "VID_U2_03:3": { funnel: { stages: [{ l: "48 CVs received", n: "48" }, { l: "Shortlisted", n: "12" }, { l: "References and tests", n: "" }, { l: "Interviews", n: "4" }, { l: "Offer matched to person spec", n: "1" }] } },
    "VID_U2_03:5": wfBars([{ l: "Induction", v: 200, t: "total", c: "accent" }, { l: "On-the-job", v: 600, t: "total", c: "warn" }, { l: "Off-the-job", v: 2400, t: "total", c: "bad" }], usd),
    "VID_U2_03:6": { pairs: { la: "External route", lb: "Internal route (Priya)", pairs: [{ l: "Training cost", a: 2400, b: 600, pre: "$" }, { l: "Days to start", a: 35, b: 12 }] } },
    "VID_U2_04:3": wfBars([{ l: "Meeting", v: 0, t: "total", c: "good" }, { l: "Email", v: 0.02, t: "total", c: "accent" }, { l: "Text", v: 0.05, t: "total", c: "warn" }, { l: "Letter", v: 0.85, t: "total", c: "bad" }], function (v) { return "$" + v.toFixed(2); }),
    "VID_U2_04:6": { pairs: { la: "Before", lb: "After new handover", pairs: [{ l: "Missed callbacks a day", a: 18, b: 4 }, { l: "Complaints", a: 6, b: 2, suf: "%" }, { l: "Resolution", a: 58, b: 74, suf: "%" }] } },
    "VID_U3_01:1": { loop: { nodes: [{ l: "Customer need", i: "people", c: "accent" }, { l: "Product made", i: "factory", c: "warn" }, { l: "Satisfaction", i: "check", c: "good" }, { l: "Loyalty", i: "star", c: "accent2" }] } },
    "VID_U3_01:5": { hub: { center: "Spending shifts", items: [{ l: "Income, age, tech", i: "coinF", c: "accent" }, { l: "Fashion, climate", i: "chartF", c: "warn" }, { l: "Rivals respond", i: "people", c: "bad" }] } },
    "VID_U3_01:6": { donut: { share: 0.2, sub: "of packs sold", a: "400,000 sold = $1.6m", b: "2,000,000 in market" } },
    "VID_U3_02:1": { cols: [{ h: "Primary", b: "Original, direct data (fieldwork)", i: "people" }, { h: "Secondary", b: "Data already collected (desk research)", i: "doc" }] },
    "VID_U3_02:4": { samp: { mode: "random", title: "Random sample: everyone has an equal chance", note: "Quota sampling instead fixes the mix by group" } },
    "VID_U3_02:5": { samp: { mode: "bias", title: "A biased sample", note: "Bias ruins reliability: check size and data age" } },
    "VID_U3_02:6": wfBars([{ l: "Prefer lunch", v: 240, t: "total", c: "accent" }, { l: "Prefer dinner", v: 96, t: "total", c: "warn" }, { l: "Unsure", v: 64, t: "total", c: "muted" }], function (v) { return String(v); }),
    "VID_U3_03:1": { hub: { center: "Product", items: [{ l: "Brand image", s: "distinguishes rivals", i: "star", c: "accent" }, { l: "Packaging", s: "protects and promotes", i: "cartF", c: "warn" }, { l: "New products", s: "win buyers", i: "bulbF", c: "good" }] } },
    "VID_U3_03:6": { chain: { note: "Direct keeps control; indirect widens reach", items: [{ l: "Producer", i: "factory", c: "accent" }, { l: "Wholesaler", i: "truckF", c: "warn" }, { l: "Retailer", i: "shop", c: "good" }, { l: "Buyer", i: "people", c: "accent2" }] } },
    "VID_U3_04:1": { funnel: { stages: [{ l: "Target: eco-focused households" }, { l: "Positioning: affordable, trustworthy" }, { l: "Awareness", n: "" }, { l: "Interest", n: "" }, { l: "Loyalty", n: "" }] } },
    "VID_U3_04:3": wfBars([{ l: "Home revenue", v: 2000000, t: "up", c: "accent" }, { l: "New country adds", v: 600000, t: "up", c: "good" }, { l: "Total", t: "total", c: "accent2" }], function (v) { return "$" + (v / 1000000).toFixed(1) + "m"; }),
    "VID_U4_01:1": { frac: { top: { l: "Total output", v: "1,200 frames" }, bottom: { l: "Number of workers", v: "20 workers" }, op: "divided by", res: "60", rl: "frames per worker" } },
    "VID_U4_01:2": { iconr: { rows: [{ title: "LABOUR-INTENSIVE", people: 20, machines: 2, ratio: "10 workers per machine" }, { title: "CAPITAL-INTENSIVE", people: 8, machines: 16, ratio: "0.5 workers per machine" }] } },
    "VID_U4_01:3": { chain: { items: [{ l: "Lean: fewer inputs, less waste", i: "shieldF", c: "accent" }, { l: "Just in time: stock arrives when needed", i: "truckF", c: "warn" }, { l: "Kaizen: continuous improvement", i: "chartF", c: "good" }] } },
    "VID_U4_01:4": { hub: { center: "Seven wastes", items: [{ l: "Overproduction", i: "factory", c: "bad" }, { l: "Waiting", i: "clock", c: "warn" }, { l: "Transport", i: "truckF", c: "accent" }, { l: "Over-processing", i: "gearF", c: "accent2" }, { l: "Inventory", i: "cartF", c: "good" }, { l: "Motion", i: "people", c: "warn" }, { l: "Defects", i: "cross", c: "bad" }] } },
    "VID_U4_01:5": { chain: { items: [{ l: "Job: one bespoke frame", i: "tools", c: "accent" }, { l: "Batch: ten red, then ten blue", i: "cartF", c: "warn" }, { l: "Flow: continuous high-volume line", i: "factory", c: "good" }] } },
    "VID_U4_01:6": { chain: { items: [{ l: "CAD: design on screen", i: "doc", c: "accent" }, { l: "CAM: computer-controlled machines", i: "gearF", c: "warn" }, { l: "Automation: minimal human control", i: "factory", c: "good" }] } },
    "VID_U4_02:0": wfBars([{ l: "Rent a month (fixed)", v: 2000, t: "total", c: "muted" }, { l: "Flour and energy per loaf", v: 2, t: "total", c: "warn" }, { l: "Price per loaf", v: 6, t: "total", c: "good" }], function (v) { return "$" + v.toLocaleString("en-US"); }, { max: 2400 }),
    "VID_U4_02:8": { be: { static: true, fc: 2400 } },
    "VID_U4_03:1": { qc: true },
    "VID_U4_03:2": { chain: { items: [{ l: "TQM: quality is everyone's job", i: "people", c: "accent" }, { l: "Kaizen loops every week", i: "chartF", c: "warn" }, { l: "Quality circles fix defects at source", i: "shieldF", c: "good" }] } },
    "VID_U4_03:3": wfBars([{ l: "Northgate defects", v: 5, t: "total", c: "bad" }, { l: "Gap to close", v: 4, t: "down", c: "warn" }, { l: "Industry leader", t: "total", c: "good" }], function (v) { return v + "%"; }),
    "VID_U4_03:4": { frac: { top: { l: "Defective units a week (5% of 2,000)", v: "100 units" }, bottom: { l: "Rework cost each", v: "$12" }, op: "multiplied by", res: "$1,200", rl: "failure cost a week" } },
    "VID_U4_03:5": wfBars([{ l: "Before (100 defects)", v: 1200, t: "total", c: "bad" }, { l: "Saving", v: 720, t: "down", c: "good" }, { l: "After (40 defects)", t: "total", c: "accent" }], usd),
    "VID_U4_03:6": { cols: [{ h: "Internal failure", b: "Scrap and rework", i: "factory" }, { h: "External failure", b: "Returns and lost goodwill", i: "people" }, { h: "Prevention", b: "Stops defects upstream", i: "shieldF" }] },
    "VID_U4_04:1": wfBars([{ l: "Labour", v: 300000, t: "up", c: "accent" }, { l: "Transport", v: 80000, t: "up", c: "warn" }, { l: "Materials", v: 40000, t: "up", c: "accent2" }, { l: "Utilities", v: 60000, t: "up", c: "good" }, { l: "Site A before incentive", t: "total", c: "muted" }], usd, { max: 520000 }),
    "VID_U4_04:6": { map: { chosen: 1, note: "Buyers cluster near the capital: the cheaper site changes" } },
    "VID_U4_04:8": wfBars([{ l: "Labour", v: 300000, t: "up", c: "accent" }, { l: "Transport now 160k", v: 160000, t: "up", c: "bad" }, { l: "Materials", v: 40000, t: "up", c: "accent2" }, { l: "Utilities", v: 60000, t: "up", c: "good" }, { l: "Incentive", v: 30000, t: "down", c: "muted" }, { l: "Site A now", t: "total", c: "accent" }], usd, { max: 600000, ref: { v: 500000, l: "Site B: $500,000" } }),
    "VID_U5_01:1": { hub: { center: "Why finance?", items: [{ l: "Start-up capital", i: "coinF", c: "accent" }, { l: "Expansion, new technology", i: "factory", c: "warn" }, { l: "Short term: under a year", i: "clock", c: "good" }, { l: "Long term: over a year", i: "bankF", c: "accent2" }] } },
    "VID_U5_01:2": wfBars([{ l: "Moulding machine", v: 50000, t: "up", c: "accent" }, { l: "Stock", v: 12000, t: "up", c: "warn" }, { l: "Total need", t: "total", c: "bad" }], usd),
    "VID_U5_01:3": wfBars([{ l: "Owner's savings", v: 10000, t: "up", c: "accent" }, { l: "Retained profit", v: 12000, t: "up", c: "good" }, { l: "Sale of trailer", v: 3000, t: "up", c: "warn" }, { l: "Internal total", t: "total", c: "accent2" }], usd),
    "VID_U5_01:4": wfBars([{ l: "Five-year loan", v: 25000, t: "up", c: "accent" }, { l: "Three-month overdraft", v: 12000, t: "up", c: "warn" }, { l: "External total", t: "total", c: "accent2" }], usd),
    "VID_U5_01:5": { cols: [{ h: "Debt", b: "Control kept, but interest is due", i: "bankF" }, { h: "Equity", b: "No repayment, but control is diluted", i: "people" }] },
    "VID_U5_02:1": { chain: { note: "Net flow = inflows minus outflows", items: [{ l: "Inflows in", i: "coinF", c: "good" }, { l: "Outflows out", i: "cartF", c: "bad" }, { l: "Net flow", i: "scale", c: "accent" }] } },
    "VID_U5_02:5": { loop: { nodes: [{ l: "Inventory", i: "cartF", c: "accent" }, { l: "Production", i: "factory", c: "warn" }, { l: "Receivables", i: "doc", c: "accent2" }, { l: "Cash", i: "coinF", c: "good" }] } },
    "VID_U5_03:5": wfBars([{ l: "Revenue", v: 120000, t: "total", c: "accent" }, { l: "Costs take", v: 83000, t: "down", c: "bad" }, { l: "Profit", t: "total", c: "good" }], usd),
    "VID_U5_03:7": wfBars([{ l: "Revenue", v: 120000, t: "total", c: "accent" }, { l: "Cost of sales", v: 45000, t: "down", c: "bad" }, { l: "Expenses", v: 38000, t: "down", c: "bad" }, { l: "Tax", v: 7000, t: "down", c: "warn" }, { l: "Dividends", v: 10000, t: "down", c: "warn" }, { l: "Retained profit", t: "total", c: "good" }], usd),
    "VID_U5_04:0": { bal: { lt: "Assets", rt: "Liabilities + equity", left: [], right: [], tilt0: 0, tiltEnd: 0, scale: 230000, note: "Assets on the left, liabilities and equity on the right" } },
    "VID_U5_04:4": { frac: { top: { l: "Total assets", v: "$230,000" }, bottom: { l: "Current liabilities", v: "$40,000" }, op: "minus", res: "$190,000", rl: "capital employed" } },
    "VID_U5_04:5": { frac: { top: { l: "Current assets", v: "$50,000" }, bottom: { l: "Current liabilities", v: "$40,000" }, op: "divided by", res: "1.25 : 1", rl: "current ratio", barTitle: "Acid-test: remove inventory ($24,000)", bar: [26000, 50000, "Without inventory $26,000", "Current assets $50,000"] } },
    "VID_U5_04:7": { bal: { lt: "Total assets $230k", rt: "Liabilities + equity $230k", left: [{ l: "Non-current", v: 180000, c: "accent" }, { l: "Current", v: 50000, c: "good" }], right: [{ l: "Non-current liab.", v: 70000, c: "warn" }, { l: "Current liab.", v: 40000, c: "bad" }, { l: "Equity", v: 120000, c: "accent2" }], tilt0: 0, tiltEnd: 0, scale: 230000, note: "Assets = liabilities + equity" } },
    "VID_U5_05:0": wfBars([{ l: "Revenue", v: 200000, t: "total", c: "accent" }, { l: "Cost of sales", v: 120000, t: "down", c: "bad" }, { l: "Expenses", v: 50000, t: "down", c: "warn" }, { l: "Profit", t: "total", c: "good" }], usd),
    "VID_U5_05:1": { frac: { top: { l: "Current assets", v: "$90,000" }, bottom: { l: "Current liabilities", v: "$60,000" }, op: "divided by", res: "1.50 : 1", rl: "current ratio", barTitle: "Assets cover liabilities 1.5 times", bar: [60000, 90000, "Liabilities $60,000", "Assets $90,000"] } },
    "VID_U5_05:2": { frac: { top: { l: "Current assets minus stock", v: "$90,000 - $18,000" }, bottom: { l: "Current liabilities", v: "$60,000" }, op: "divided by", res: "1.20 : 1", rl: "acid-test ratio", barTitle: "Stock removed", bar: [60000, 72000, "Liabilities $60,000", "Assets without stock $72,000"] } },
    "VID_U5_05:3": { frac: { top: { l: "Gross profit", v: "$80,000" }, bottom: { l: "Revenue", v: "$200,000" }, op: "divided by, x 100", res: "40.00%", rl: "gross profit margin", barTitle: "40% of each sales dollar", bar: [80000, 200000, "Gross profit", "Revenue"] } },
    "VID_U5_05:4": { frac: { top: { l: "Profit", v: "$30,000" }, bottom: { l: "Revenue", v: "$200,000" }, op: "divided by, x 100", res: "15.00%", rl: "profit margin", barTitle: "15% of each sales dollar", bar: [30000, 200000, "Profit", "Revenue"] } },
    "VID_U5_05:5": { frac: { top: { l: "Profit", v: "$30,000" }, bottom: { l: "Capital employed", v: "$240,000" }, op: "divided by, x 100", res: "12.50%", rl: "ROCE", barTitle: "Return on every dollar invested", bar: [30000, 240000, "Profit", "Capital employed"] } },
    "VID_U5_05:6": { pairs: { la: "Liquidity (ratio)", lb: "Profitability (%)", pairs: [{ l: "Current 1.50 | Acid-test 1.20", a: 1.5, b: 1.2 }, { l: "Margins 40% and 15%", a: 40, b: 15, suf: "%" }, { l: "ROCE", a: 12.5, b: 12.5, suf: "%" }] } },
    "VID_U6_01:0": { curve: { yl: "Output (GDP)", xl: "Time", bands: [{ x0: 0, x1: .25, l: "Growth", c: "good" }, { x0: .25, x1: .5, l: "Boom", c: "warn" }, { x0: .5, x1: .75, l: "Recession", c: "bad" }, { x0: .75, x1: 1, l: "Slump", c: "accent2" }], curves: [{ c: "accent", f: function (u) { return .5 + .36 * Math.sin(u * 6.283 - .8); } }] } },
    "VID_U6_01:4": { chain: { items: [{ l: "Corporation tax cut: more retained profit", i: "bankF", c: "accent" }, { l: "Income tax cut: more disposable income", i: "coinF", c: "warn" }, { l: "Spending creates demand", i: "chartF", c: "good" }] } },
    "VID_U6_01:5": { chain: { items: [{ l: "Interest rate 3% to 7%", i: "chartF", c: "bad" }, { l: "Borrowing costs rise", i: "bankF", c: "warn" }, { l: "Consumer spending falls", i: "cartF", c: "accent" }, { l: "Workshop plans postponed", i: "factory", c: "accent2" }] } },
    "VID_U6_01:7": { hub: { center: "Downturn response", items: [{ l: "Cut overtime, delay expansion", i: "clock", c: "accent" }, { l: "Change product mix", i: "bulbF", c: "warn" }, { l: "Negotiate supplier terms", i: "doc", c: "good" }, { l: "Keep training for recovery", i: "people", c: "accent2" }] } },
    "VID_U6_02:0": { cols: [{ h: "Private costs", b: "Paid by the factory", i: "coinF" }, { h: "Third-party harms", b: "Pollution, noise, congestion", i: "cross" }, { h: "Third-party gains", b: "Jobs, skills, local trade", i: "check" }] },
    "VID_U6_02:2": wfBars([{ l: "Private benefit: productivity", v: 120000, t: "up", c: "accent" }, { l: "External benefit: community skills", v: 200000, t: "up", c: "good" }, { l: "Social benefit", t: "total", c: "accent2" }], usd),
    "VID_U6_02:4": wfBars([{ l: "Wages $8 to $10 (50 weeks)", v: 480000, t: "up", c: "accent" }, { l: "Cocoa $1,800 to $2,100 a tonne", v: 600000, t: "up", c: "warn" }, { l: "Extra cost of the ethical choice", t: "total", c: "bad" }], usd),
    "VID_U6_02:5": wfBars([{ l: "Annual sales", v: 5000000, t: "total", c: "accent" }, { l: "8% lost to boycott", v: 400000, t: "down", c: "bad" }, { l: "Sales after campaign", t: "total", c: "warn" }], function (v) { return "$" + (v / 1000000).toFixed(1) + "m"; }),
    "VID_U6_03:2": { parent: true },
    "VID_U6_03:8": { fx: { a: "$400", b: "? pounds", rate: "$1 = 0.75, then 0.60", rate2: "recalculate the bill", note: "At 0.75: 300 pounds. At 0.60: 240 pounds", nc: "accent" } }
  };
  Object.keys(TEACH2).forEach(function (k) {
    var v = TEACH2[k];
    if (v.cols) v = { cols: v.cols };
    TEACH[k] = TEACH[k] || v;
  });
  /* keep batch-1 entries; batch 2 fills in everything else. Specs with 'be.fc' need the parametrised break-even drawer. */

  function autoSpec(scene) {
    var labels = scene.on_screen_labels || [], vt = scene.visual_type || "";
    if (/recap/.test(vt)) return { recap: { labels: labels } };
    if (/evaluation/.test(vt)) return { evalr: { labels: labels } };
    if (/split_screen/.test(vt)) { var it = labels.map(splitHead); if (it.length <= 4) return { cols: it }; }
    return { steps: { items: labels.map(function (l) { return { t: l }; }) } };
  }
  function drawTeachScene(ctx, video, scene, p, W, H) {
    var key = video.video_id + ":" + video.scenes.indexOf(scene);
    var spec = TEACH[key] || autoSpec(scene), full = !TEACH[key] || !!spec.cols || !!spec.recap || !!spec.evalr || !!spec.steps;
    var R = { x: 49, y: 122, w: full ? W - 98 : W - 400, h: H - 122 - 96 };
    try {
      if (spec.fn) spec.fn(ctx, R, p);
      else if (spec.wf) dWaterfall(ctx, R, p, spec.wf);
      else if (spec.signed) dSigned(ctx, R, p, spec.signed);
      else if (spec.be) dBreakEven(ctx, R, p, spec.be);
      else if (spec.bal) dBalance(ctx, R, p, spec.bal);
      else if (spec.curve) dCurve(ctx, R, p, spec.curve);
      else if (spec.hub) dHub(ctx, R, p, spec.hub);
      else if (spec.chain) dChain(ctx, R, p, spec.chain);
      else if (spec.pyr) dPyramid(ctx, R, p, spec.pyr);
      else if (spec.see) dSeesaw(ctx, R, p, spec.see);
      else if (spec.loop) dLoop(ctx, R, p, spec.loop);
      else if (spec.org) dOrgPair(ctx, R, p);
      else if (spec.span) dSpan(ctx, R, p);
      else if (spec.funnel) dFunnel(ctx, R, p, spec.funnel);
      else if (spec.donut) dDonut(ctx, R, p, spec.donut);
      else if (spec.liab) dLiability(ctx, R, p, spec.liab);
      else if (spec.map) dMap(ctx, R, p, spec.map);
      else if (spec.fx) dFx(ctx, R, p, spec.fx);
      else if (spec.gate) dGate(ctx, R, p, spec.gate);
      else if (spec.pillars) dPillars(ctx, R, p, spec.pillars);
      else if (spec.pairs) dPairs(ctx, R, p, spec.pairs);
      else if (spec.frac) dFrac(ctx, R, p, spec.frac);
      else if (spec.samp) dSampling(ctx, R, p, spec.samp);
      else if (spec.smart) dSmart(ctx, R, p, { items: spec.smart });
      else if (spec.qc) dQC(ctx, R, p, spec);
      else if (spec.parent) dParent(ctx, R, p, spec);
      else if (spec.iconr) dIconRatio(ctx, R, p, spec.iconr);
      else if (spec.recap) dRecap(ctx, R, p, spec.recap);
      else if (spec.evalr) dEval(ctx, R, p, spec.evalr);
      else if (spec.cols) dCols(ctx, R, p, { items: Array.isArray(spec.cols) ? spec.cols : [] });
      else if (spec.steps) dSteps(ctx, R, p, spec.steps);
      else return false;
    } catch (e) { if (window.__err) window.__err(key, e); return false; }
    if (!full) labelCards2(ctx, scene.on_screen_labels, W - 340, 124, 300, p);
    return true;
  }
  function labelCards2(ctx, labels, x, y, w, p) {
    if (!labels || !labels.length) return;
    var yy = y;
    labels.slice(0, 5).forEach(function (l, i) {
      var a = Math.max(0, Math.min(1, (p * 5 - i * .6) * 2.5)), ls = wrap(ctx, l, w - 30, 18, 700).slice(0, 4), h = 22 + ls.length * 23;
      if (a > 0) {
        ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * 18, 0);
        box(ctx, x, yy, w, h, hexAlpha(PALETTE.panel, .96), hexAlpha(PALETTE.accent, .6), 12);
        ctx.fillStyle = PALETTE.accent; rr(ctx, x, yy + 8, 5, h - 16, 2); ctx.fill();
        ls.forEach(function (s, k) { TT(ctx, s, x + 18, yy + 22 + k * 23, 18, k ? PALETTE.ink : PALETTE.ink, k ? 600 : 750, "left", w - 28); });
        ctx.restore();
      }
      yy += h + 10;
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

    /* The slow camera push-in is limited to the diagram layer. */
    var zoom = REDUCED_MOTION ? 1 : 1 + .05 * p;
    ctx.save();
    if (zoom !== 1) { ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -H / 2); }
    var taught = drawTeachScene(ctx, video, scene, p, W, H);
    if (!taught) {

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
    ctx.restore();

    var reveal = REDUCED_MOTION ? 1 : ease(Math.min(1, local / .45));
    ctx.save();
    ctx.globalAlpha = reveal;
    ctx.translate(0, (1 - reveal) * 16);
    text(ctx, video.chapter_title || ("Chapter " + video.chapter_code), 49, 28, 18, PALETTE.accent, 750, "left", 970);
    text(ctx, scene.on_screen_title || video.video_title, 49, 66, 42, PALETTE.ink, 850, "left", W - 98);
    ctx.restore();
    text(ctx, "Scene " + scene.scene_number + " / " + video.scenes.length, W - 49, 28, 16, PALETTE.muted, 700, "right");
    ctx.fillStyle = hexAlpha(PALETTE.ink, .16); ctx.fillRect(49, 106, W - 98, 4);
    var progress = ctx.createLinearGradient(49, 0, W - 49, 0);
    progress.addColorStop(0, PALETTE.accent); progress.addColorStop(1, PALETTE.accent2);
    ctx.fillStyle = progress; ctx.fillRect(49, 106, (W - 98) * p, 4);
    drawTermGlow(ctx, scene, t);
  }

  function drawTermGlow(ctx, scene, t) {
    if (!activeTerm(scene, t)) return;
    var g = ctx.createRadialGradient(50, 66, 0, 50, 66, 320);
    g.addColorStop(0, hexAlpha(PALETTE.accent, .13));
    g.addColorStop(1, "transparent");
    ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 16, 470, 102); ctx.restore();
  }

  function drawEndCard(ctx, video, W, H, elapsed) {
    applyTheme(video.unit_number);
    var g = ctx.createLinearGradient(0, H, W, 0);
    g.addColorStop(0, PALETTE.bg); g.addColorStop(.55, PALETTE.bg2); g.addColorStop(1, PALETTE.panel);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (!REDUCED_MOTION) {
      var glow = ctx.createRadialGradient(W * .78, H * .2, 0, W * .78, H * .2, W * .5);
      glow.addColorStop(0, hexAlpha(PALETTE.accent, .18)); glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    }
    var a = REDUCED_MOTION ? 1 : ease(Math.min(1, elapsed / .5));
    var lines = wrap(ctx, video.video_title, W - 200, 44, 850).slice(0, 2);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 14);
    lines.forEach(function (line, i) {
      text(ctx, line, W / 2, 48 + (i - (lines.length - 1) / 2) * 48, 44, PALETTE.ink, 850, "center", W - 200);
    });
    ctx.restore();
    var lw = (W - 360) * (REDUCED_MOTION ? 1 : ease(Math.min(1, Math.max(0, (elapsed - .3) / .5))));
    var lg = ctx.createLinearGradient(180, 0, W - 180, 0);
    lg.addColorStop(0, PALETTE.accent); lg.addColorStop(1, PALETTE.accent2);
    ctx.fillStyle = lg; ctx.fillRect(180, 130, lw, 3);
    text(ctx, "Recap questions next", W / 2, 160, 17, PALETTE.muted, 700, "center");
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
    /* One reusable frame buffer for scene crossfades — allocated once. */
    var snapshot = document.createElement("canvas");
    snapshot.width = canvas.width; snapshot.height = canvas.height;
    var sctx = snapshot.getContext("2d");
    var caption = $(".ecv-caption", overlay), seek = $(".ecv-seek", overlay);
    var timeEl = $(".ecv-time", overlay), quizEl = $(".ecv-quiz", overlay);
    var audioEl = $(".ecv-audio", overlay);
    var playBtn = $('[data-action="play"]', overlay);
    var player = { video: video, overlay: overlay, t: 0, playing: false, last: 0, sceneNo: 0, quizShown: false, fadeStart: 0, endStart: 0 };
    state.player = player;

    function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0"); }
    function paint() {
      var sc = sceneAt(video, player.t);
      if (player.t >= video.target_duration_sec - .001) {
        if (!player.endStart) player.endStart = performance.now();
        drawEndCard(ctx, video, canvas.width, canvas.height, (performance.now() - player.endStart) / 1000);
        player.fadeStart = 0;
      } else {
        player.endStart = 0;
        if (sc.scene_number !== player.sceneNo && player.sceneNo > 0 && player.t > 0) {
          sctx.clearRect(0, 0, snapshot.width, snapshot.height);
          sctx.drawImage(canvas, 0, 0);
          player.fadeStart = performance.now();
        }
        drawScene(ctx, video, sc, player.t, canvas.width, canvas.height);
        if (player.fadeStart) {
          var a = (performance.now() - player.fadeStart) / 500;
          if (a >= 1) player.fadeStart = 0;
          else {
            a = ease(a);
            var z = REDUCED_MOTION ? 1 : 1 + .04 * a;
            ctx.save();
            ctx.globalAlpha = 1 - a;
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(z, z);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            ctx.drawImage(snapshot, 0, 0);
            ctx.restore();
          }
        }
      }
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
        var endFrames = 0;
        function endFrame() {
          if (!state.player || state.player !== player || endFrames++ > 70) return;
          drawEndCard(ctx, video, canvas.width, canvas.height, (performance.now() - player.endStart) / 1000);
          requestAnimationFrame(endFrame);
        }
        requestAnimationFrame(endFrame);
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
