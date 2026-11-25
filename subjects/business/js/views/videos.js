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
    accent: "#38BDF8", accent2: "#A78BFA", good: "#10B981", warn: "#F59E0B", bad: "#EF4444",
    glow1: "rgba(56,189,248,0.20)", glow2: "rgba(167,139,250,0.16)"
  };
  /* Each unit has its own visual identity so the videos don't look like the
     same bland slide deck. Values are applied to PALETTE at frame start. */
  var THEMES = {
    1: { bg: "#08111F", bg2: "#102B45", panel: "#101D31", ink: "#F8FAFC", muted: "#9FB4CC", accent: "#38BDF8", accent2: "#A78BFA", good: "#34D399", warn: "#FBBF24", bad: "#F87171", glow1: "rgba(56,189,248,0.22)", glow2: "rgba(167,139,250,0.16)" },
    2: { bg: "#0C1024", bg2: "#231C4A", panel: "#171A34", ink: "#F8FAFC", muted: "#B6B0D6", accent: "#A78BFA", accent2: "#F472B6", good: "#34D399", warn: "#FBBF24", bad: "#FB7185", glow1: "rgba(167,139,250,0.22)", glow2: "rgba(244,114,182,0.15)" },
    3: { bg: "#06171A", bg2: "#0F3B3A", panel: "#102A2C", ink: "#F0FDFC", muted: "#9BC4C0", accent: "#2DD4BF", accent2: "#60A5FA", good: "#4ADE80", warn: "#FCD34D", bad: "#FB7185", glow1: "rgba(45,212,191,0.22)", glow2: "rgba(96,165,250,0.15)" },
    4: { bg: "#0D1117", bg2: "#332614", panel: "#1C1A17", ink: "#FFF7ED", muted: "#C2B49C", accent: "#F59E0B", accent2: "#38BDF8", good: "#34D399", warn: "#FCD34D", bad: "#F87171", glow1: "rgba(245,158,11,0.20)", glow2: "rgba(56,189,248,0.13)" },
    5: { bg: "#04140F", bg2: "#0B3626", panel: "#0E2620", ink: "#ECFDF5", muted: "#A7C9BA", accent: "#34D399", accent2: "#FBBF24", good: "#4ADE80", warn: "#FBBF24", bad: "#FB7185", glow1: "rgba(52,211,153,0.22)", glow2: "rgba(251,191,36,0.14)" },
    6: { bg: "#100A1F", bg2: "#3A1B33", panel: "#201630", ink: "#FDF4FF", muted: "#CDB4D4", accent: "#E879F9", accent2: "#FB923C", good: "#34D399", warn: "#FCD34D", bad: "#FB7185", glow1: "rgba(232,121,249,0.20)", glow2: "rgba(251,146,60,0.14)" }
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
      ".ecv-caption{position:absolute;left:6%;right:6%;bottom:7%;text-align:center;font-size:clamp(11px,1.35vw,17px);font-weight:650;line-height:1.45;color:#fff;text-shadow:0 2px 6px #000,0 0 18px #000;pointer-events:none}",
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
  function labelCards(ctx, labels, x, y, w, p) {
    if (!labels || !labels.length) return;
    var per = Math.min(labels.length, 4);
    var h = 44, gap = 8;
    for (var i = 0; i < per; i++) {
      var appear = Math.max(0, Math.min(1, (p * 4 - i) * 3));
      if (appear <= 0) continue;
      var yy = y + i * (h + gap);
      ctx.globalAlpha = appear;
      ctx.save();
      ctx.shadowColor = hexAlpha(PALETTE.accent, .28);
      ctx.shadowBlur = 16;
      ctx.fillStyle = hexAlpha(PALETTE.panel, .92);
      ctx.strokeStyle = hexAlpha(PALETTE.accent, .42);
      ctx.lineWidth = 1;
      rr(ctx, x, yy, w, h, 9); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = PALETTE.accent;
      rr(ctx, x, yy + 6, 4, h - 12, 2); ctx.fill();
      var lines = wrap(ctx, labels[i], w - 24, 15, 650);
      lines.slice(0, 2).forEach(function (ln, li) {
        text(ctx, ln, x + 12, yy + 15 + li * 17, 15, li ? PALETTE.muted : PALETTE.ink, li ? 500 : 750);
      });
      ctx.globalAlpha = 1;
    }
  }
  function arrow(ctx, x1, y1, x2, y2, color, p) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 12 * Math.cos(a - .5), y2 - 12 * Math.sin(a - .5));
    ctx.lineTo(x2 - 12 * Math.cos(a + .5), y2 - 12 * Math.sin(a + .5));
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    var t = (p * 3) % 1;
    ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 6, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.warn; ctx.fill();
    text(ctx, "", mx, my, 1, color);
  }
  function node(ctx, x, y, w, h, label, color, active) {
    ctx.save();
    ctx.shadowColor = hexAlpha(color, active ? .55 : .25);
    ctx.shadowBlur = active ? 22 : 12;
    ctx.fillStyle = active ? color : PALETTE.panel;
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
    var lines = wrap(ctx, label, w - 12, 12, 700);
    lines.slice(0, 2).forEach(function (ln, i) {
      text(ctx, ln, x + w / 2, y + h / 2 + (i - (Math.min(lines.length, 2) - 1) / 2) * 14, 12,
        active ? "#08111F" : PALETTE.ink, 750, "center");
    });
  }

  /* Layered, slowly moving background: base gradient, drifting light pools,
     a scene-specific line motif, floating particles and a soft vignette. */
  function drawBackdrop(ctx, W, H, t, scene) {
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, PALETTE.bg);
    g.addColorStop(.55, PALETTE.bg2);
    g.addColorStop(1, PALETTE.bg);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var pools = [
      [W * .18 + Math.sin(t * .13) * W * .06, H * .22 + Math.cos(t * .11) * H * .06, W * .46, PALETTE.glow1],
      [W * .82 + Math.cos(t * .09) * W * .05, H * .78 + Math.sin(t * .12) * H * .05, W * .42, PALETTE.glow2]
    ];
    pools.forEach(function (p) {
      var rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], p[2]);
      rg.addColorStop(0, p[3]);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    });

    ctx.save();
    var vt = scene.visual_type || "";
    if (/chart|graph|curve/.test(vt)) {
      ctx.strokeStyle = hexAlpha(PALETTE.accent, .07); ctx.lineWidth = 1;
      for (var i = -H; i < W; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
      }
    } else if (/cycle/.test(vt)) {
      ctx.strokeStyle = hexAlpha(PALETTE.accent, .08); ctx.lineWidth = 2;
      for (var r = 130; r < 540; r += 90) {
        ctx.beginPath(); ctx.arc(W * .72, H * .55, r, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (/org|flow|funnel|timeline/.test(vt)) {
      ctx.strokeStyle = hexAlpha(PALETTE.accent, .055); ctx.lineWidth = 1;
      for (var y = 90; y < H; y += 56) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    } else {
      ctx.strokeStyle = hexAlpha(PALETTE.accent2, .05); ctx.lineWidth = 2;
      for (var r2 = 90; r2 < 640; r2 += 110) {
        ctx.beginPath(); ctx.arc(W * .14, H * .88, r2, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.restore();

    for (var k = 0; k < 26; k++) {
      var px = ((k * 197 + t * 11 * (1 + k % 3)) % (W + 80)) - 40;
      var py = H - ((k * 83 + t * (16 + k % 5) * 5) % (H + 80));
      var a = .05 + .07 * Math.sin(t * 2 + k);
      ctx.beginPath(); ctx.arc(px, py, 1.3 + (k % 3) * .5, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(PALETTE.ink, Math.max(.025, a)); ctx.fill();
    }

    var v = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .88);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.40)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }

  function drawChart(ctx, scene, local, dur, W, H) {
    var ad = scene.animation_directives || {};
    var ax = ad.axes || {}, lines = ad.lines || [];
    var L = 110, R = W - 60, T = 110, B = H - 90;
    var xmax = ax.x_max || 1000, ymax = ax.y_max || 6000;
    ctx.strokeStyle = "#3B506C"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, String(ax.y_label || "Value ($)"), L, T - 18, 14, PALETTE.muted, 650);
    text(ctx, String(ax.x_label || "Output (units)"), R, B + 26, 14, PALETTE.muted, 650, "right");
    for (var g = 1; g <= 4; g++) {
      var gy = B - (B - T) * g / 5;
      ctx.strokeStyle = "#1E2D43"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L, gy); ctx.lineTo(R, gy); ctx.stroke();
      text(ctx, String(Math.round(ymax * g / 5)), L - 10, gy, 11, PALETTE.muted, 500, "right");
      var gx = L + (R - L) * g / 5;
      ctx.beginPath(); ctx.moveTo(gx, T); ctx.lineTo(gx, B); ctx.stroke();
      text(ctx, String(Math.round(xmax * g / 5)), gx, B + 14, 11, PALETTE.muted, 500, "center");
    }
    var p = local / dur;
    lines.forEach(function (ln) {
      var pts = ln.points || [];
      if (pts.length < 2) return;
      var start = ln.draw_at_sec == null ? 2 : Number(ln.draw_at_sec);
      var frac = Math.max(0, Math.min(1, (local - (start - scene.start_sec)) / Math.max(dur * .35, 1)));
      if (frac <= 0) return;
      ctx.strokeStyle = ln.color || PALETTE.accent; ctx.lineWidth = 4; ctx.lineJoin = "round";
      ctx.beginPath();
      var last = null;
      pts.forEach(function (pt, i) {
        var x = L + (R - L) * (pt[0] / xmax), y = B - (B - T) * (pt[1] / ymax);
        if (i === 0) ctx.moveTo(x, y);
        else {
          var px = L + (R - L) * (pts[i - 1][0] / xmax), py = B - (B - T) * (pts[i - 1][1] / ymax);
          ctx.lineTo(px + (x - px) * frac, py + (y - py) * frac);
        }
        last = [x, y];
      });
      ctx.stroke();
    });
    var hi = ad.highlight_intersection;
    if (hi) {
      var pulseAt = hi.pulse_at_sec == null ? dur * .7 : Number(hi.pulse_at_sec) - scene.start_sec;
      var a = Math.max(0, Math.min(1, (local - pulseAt) / 2 + .3));
      if (a > 0) {
        var hx = L + (R - L) * (hi.x / xmax), hy = B - (B - T) * (hi.y / ymax);
        ctx.globalAlpha = a;
        ctx.strokeStyle = PALETTE.warn; ctx.lineWidth = 2;
        ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(L, hy); ctx.lineTo(hx, hy); ctx.moveTo(hx, B); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(hx, hy, 9 + Math.sin(local * 4) * 3, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.warn; ctx.fill();
        var lines2 = wrap(ctx, hi.label || "Break-even", 220, 16, 800);
        ctx.fillStyle = "#1C2A3F"; rr(ctx, hx + 16, hy - 30, 230, 34, 8); ctx.fill();
        lines2.slice(0, 2).forEach(function (ln, i) { text(ctx, ln, hx + 26, hy - 22 + i * 15, 15, PALETTE.warn, 800); });
        ctx.globalAlpha = 1;
      }
    }
    labelCards(ctx, scene.on_screen_labels, W - 300, 120, 275, p);
  }

  function drawElements(ctx, scene, local, dur, W, H) {
    var els = scene.animation_directives.elements || [];
    var p = local / dur;
    var n = Math.min(els.length, 6);
    for (var i = 0; i < n; i++) {
      var e = els[i], t = e.type || "card";
      var x = 80 + (i % 3) * 365, y = 150 + Math.floor(i / 3) * 200;
      if (t === "animated_counter") {
        var val = (Number(e.from) || 0) + ((Number(e.to) || 0) - (Number(e.from) || 0)) * Math.min(1, p * 1.5);
        ctx.fillStyle = PALETTE.panel; ctx.strokeStyle = "#2B4261"; rr(ctx, x, y, 320, 150, 14); ctx.fill(); ctx.stroke();
        var pre = e.prefix || "", suf = e.suffix || "";
        text(ctx, pre + Math.round(val).toLocaleString() + suf, x + 160, y + 62, 46, PALETTE.accent, 850, "center");
        text(ctx, String(e.target || "counter").replace(/_/g, " "), x + 160, y + 112, 14, PALETTE.muted, 650, "center");
      } else if (t === "coin_flow_arrow") {
        arrow(ctx, x + 30, y + 75, x + 290, y + 75, PALETTE.good, p);
        text(ctx, String(e.label || ""), x + 160, y + 40, 16, PALETTE.ink, 750, "center");
        text(ctx, String(e.from || "") + " → " + String(e.to || ""), x + 160, y + 116, 13, PALETTE.muted, 600, "center");
      } else if (t === "org_node" || t === "icon_factory" || t === "node") {
        node(ctx, x, y, 320, 150, e.label || e.id || "Node", [PALETTE.accent, PALETTE.accent2, PALETTE.good][i % 3], p > .35);
      } else if (t === "flow_node") {
        node(ctx, x, y, 320, 130, e.label || "Stage", PALETTE.accent, p * n > i);
        if (i < n - 1) arrow(ctx, x + 320, y + 65, x + 360, y + 65, PALETTE.muted, p);
      } else if (t === "balance_scale") {
        var tilt = Math.sin(local * 2) * 3;
        ctx.strokeStyle = PALETTE.muted; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x + 160, y + 20); ctx.lineTo(x + 160, y + 120); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 40, y + 50 + tilt); ctx.lineTo(x + 280, y + 50 - tilt); ctx.stroke();
        text(ctx, String(e.label || ""), x + 160, y + 142, 14, PALETTE.ink, 700, "center");
      } else {
        node(ctx, x, y, 320, 150, e.label || e.type, [PALETTE.accent, PALETTE.warn][i % 2], p > .4);
      }
    }
  }

  function drawSplit(ctx, scene, local, dur, W, H) {
    var labels = scene.on_screen_labels || [];
    var left = labels.slice(0, Math.ceil(labels.length / 2));
    var right = labels.slice(Math.ceil(labels.length / 2));
    var p = local / dur;
    function side(x, color, head, items) {
      ctx.fillStyle = "#101D30"; ctx.strokeStyle = color; ctx.lineWidth = 2;
      rr(ctx, x, 120, W / 2 - 60, 420, 16); ctx.fill(); ctx.stroke();
      text(ctx, head, x + (W / 2 - 60) / 2, 158, 22, color, 850, "center");
      items.slice(0, 4).forEach(function (it, i) {
        var a = Math.max(0, Math.min(1, (p * 3 - i) * 2.2));
        ctx.globalAlpha = a;
        var lines = wrap(ctx, it, W / 2 - 130, 16, 650);
        lines.slice(0, 2).forEach(function (ln, j) {
          text(ctx, "• " + ln, x + 25, 210 + i * 68 + j * 19, 16, PALETTE.ink, 650);
        });
        ctx.globalAlpha = 1;
      });
    }
    side(40, PALETTE.accent, "ADVANTAGES / SIDE A", left);
    side(W / 2 + 20, PALETTE.bad, "LIMITATIONS / SIDE B", right);
  }

  function drawFunnel(ctx, scene, local, dur, W, H) {
    var labels = scene.on_screen_labels || [];
    var n = Math.min(labels.length, 6), p = local / dur;
    for (var i = 0; i < n; i++) {
      var a = Math.max(0, Math.min(1, (p * n - i) * 3));
      if (a <= 0) continue;
      var w = 720 - i * 95, x = (W - w) / 2, y = 120 + i * 72;
      ctx.globalAlpha = a;
      ctx.fillStyle = [PALETTE.accent, PALETTE.accent2, PALETTE.good, PALETTE.warn][i % 4];
      rr(ctx, x, y, w, 56, 9); ctx.fill();
      var lines = wrap(ctx, labels[i], w - 24, 16, 750);
      text(ctx, lines[0] || "", W / 2, y + 28, 16, "#04121f", 800, "center");
      ctx.globalAlpha = 1;
    }
  }

  function drawOrg(ctx, scene, local, dur, W, H) {
    var labels = scene.on_screen_labels || [];
    var flat = /flat|delay|wide/i.test(scene.on_screen_title || "") || /flat|delay/i.test(String(scene.visual_type));
    var levels = flat ? 2 : Math.min(4, Math.max(2, labels.length));
    var p = Math.min(1, local / Math.max(dur * .6, 1));
    var baseY = 130;
    for (var l = 0; l < levels; l++) {
      var count = flat ? Math.min(4, labels.length) : Math.max(1, Math.round((labels.length || 4) * Math.pow(.62, l)));
      var y = baseY + l * (flat ? 110 : 95);
      for (var c = 0; c < count; c++) {
        var x = W / 2 - (count * 150) / 2 + c * 150;
        var label = labels[(l + c) % Math.max(labels.length, 1)] || "Manager";
        node(ctx, x, y, 138, 62, label, l === 0 ? PALETTE.warn : PALETTE.accent, p > l / levels);
        if (l > 0) ctx.strokeStyle = "#3B506C", ctx.beginPath(), ctx.moveTo(x + 69, y), ctx.lineTo(W / 2, y - 33), ctx.stroke();
      }
    }
    text(ctx, flat ? "FLAT · wide span of control" : "TALL · narrow span of control", W / 2, H - 70, 18, PALETTE.muted, 800, "center");
  }

  function drawFlow(ctx, scene, local, dur, W, H) {
    var labels = scene.on_screen_labels || [];
    var n = Math.min(labels.length, 5), p = local / dur;
    var y = H / 2 - 30;
    for (var i = 0; i < n; i++) {
      var x = 55 + i * ((W - 120) / Math.max(n, 1));
      node(ctx, x, y, (W - 120) / Math.max(n, 1) - 24, 100, labels[i] || "Stage",
        [PALETTE.accent, PALETTE.good, PALETTE.warn, PALETTE.accent2][i % 4], p * n > i);
      if (i < n - 1) arrow(ctx, x + (W - 120) / n - 20, y + 50, x + (W - 120) / n + 2, y + 50, PALETTE.muted, p);
    }
  }

  function drawCycle(ctx, scene, local, dur, W, H) {
    var labels = scene.on_screen_labels || [];
    var n = Math.max(labels.length, 4), p = local / dur;
    var cx = W / 2, cy = H / 2 + 10, rx = 350, ry = 190;
    ctx.strokeStyle = "#2B4261"; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.stroke();
    var names = labels.length ? labels : ["Growth", "Boom", "Recession", "Slump"];
    names.slice(0, 4).forEach(function (lb, i) {
      var a = -Math.PI / 2 + i * Math.PI / 2;
      var x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      node(ctx, x - 85, y - 28, 170, 56, lb, [PALETTE.good, PALETTE.warn, PALETTE.bad, PALETTE.accent2][i], p > i / 4);
    });
    text(ctx, "business cycle", cx, cy, 22, PALETTE.muted, 800, "center");
  }

  function drawCurve(ctx, scene, local, dur, W, H) {
    var p = local / dur, L = 90, R = W - 70, T = 120, B = H - 90;
    ctx.strokeStyle = "#3B506C"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, "Time →", R, B + 24, 14, PALETTE.muted, 650, "right");
    text(ctx, "Sales / profit", L, T - 18, 14, PALETTE.muted, 650);
    var pts = [], steps = 100;
    for (var i = 0; i <= steps; i++) {
      var x = i / steps;
      var y = .25 + .55 * Math.exp(-Math.pow((x - .32) / .22, 2)) + .12 * x - .25 * Math.max(0, x - .78) * 4;
      y = Math.max(.04, Math.min(.95, y));
      pts.push([L + (R - L) * x, B - (B - T) * y]);
    }
    ctx.strokeStyle = PALETTE.accent2; ctx.lineWidth = 5; ctx.beginPath();
    var cut = Math.max(2, Math.floor(steps * p));
    for (var j = 0; j <= cut; j++) j ? ctx.lineTo(pts[j][0], pts[j][1]) : ctx.moveTo(pts[j][0], pts[j][1]);
    ctx.stroke();
    var stages = ["Introduction", "Growth", "Maturity", "Decline"];
    stages.forEach(function (s, i) { text(ctx, s, L + (R - L) * (i + .5) / 4, B + 26, 13, PALETTE.muted, 650, "center"); });
    labelCards(ctx, scene.on_screen_labels, W - 310, 120, 280, p);
  }

  function drawGeneric(ctx, scene, local, dur, W, H) {
    var p = local / dur;
    var isFormula = scene.visual_type === "formula_substitution";
    var labels = scene.on_screen_labels || [];
    if (isFormula) {
      var big = labels[0] || "";
      ctx.fillStyle = "#101D30"; ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 2;
      rr(ctx, 90, 140, W - 180, 150, 16); ctx.fill(); ctx.stroke();
      var lines = wrap(ctx, big, W - 240, 30, 800);
      lines.slice(0, 2).forEach(function (ln, i) { text(ctx, ln, W / 2, 192 + i * 38, 30, PALETTE.ink, 850, "center"); });
      labelCards(ctx, labels.slice(1), 140, 330, W - 280, p);
    } else {
      drawElements(ctx, scene, local, dur, W, H);
      labelCards(ctx, labels, W - 300, 120, 275, p);
    }
  }

  function drawScene(ctx, video, scene, t, W, H) {
    var local = t - scene.start_sec, dur = Math.max(1, scene.end_sec - scene.start_sec);
    var p = Math.max(0, Math.min(1, local / dur));
    applyTheme(video.unit_number);
    drawBackdrop(ctx, W, H, t, scene);

    /* Soft crossfade as each new scene appears. */
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(.25, local / .55));

    text(ctx, video.video_id + " · CHAPTER " + video.chapter_code, 46, 27, 12, PALETTE.accent, 800);
    ctx.save();
    ctx.shadowColor = hexAlpha(PALETTE.accent, .4); ctx.shadowBlur = 18;
    text(ctx, scene.on_screen_title || video.video_title, 44, 59, 30, PALETTE.ink, 850);
    ctx.restore();
    text(ctx, "Scene " + scene.scene_number + "/" + video.scenes.length,
      W - 44, 30, 13, PALETTE.muted, 700, "right");
    ctx.fillStyle = hexAlpha(PALETTE.ink, .10); ctx.fillRect(44, 82, W - 88, 3);
    var pg = ctx.createLinearGradient(44, 0, W - 44, 0);
    pg.addColorStop(0, PALETTE.accent); pg.addColorStop(1, PALETTE.accent2);
    ctx.save();
    ctx.shadowColor = hexAlpha(PALETTE.accent, .6); ctx.shadowBlur = 12;
    ctx.fillStyle = pg; ctx.fillRect(44, 82, (W - 88) * p, 3);
    ctx.restore();

    var vt = scene.visual_type || "";
    var ad = scene.animation_directives || {};
    if (ad.chart && (ad.chart.lines || []).length) drawChart(ctx, scene, local, dur, W, H);
    else if (/org_chart/i.test(vt) || (ad.elements || []).some(function (e) { return e.type === "org_node"; })) drawOrg(ctx, scene, local, dur, W, H);
    else if (/funnel/i.test(vt)) drawFunnel(ctx, scene, local, dur, W, H);
    else if (/cycle/i.test(vt)) drawCycle(ctx, scene, local, dur, W, H);
    else if (/curve/i.test(vt)) drawCurve(ctx, scene, local, dur, W, H);
    else if (/split|evaluation/i.test(vt)) drawSplit(ctx, scene, local, dur, W, H);
    else if (/flow|timeline/i.test(vt)) drawFlow(ctx, scene, local, dur, W, H);
    else if (/balance/i.test(vt)) drawGeneric(ctx, scene, local, dur, W, H);
    else drawGeneric(ctx, scene, local, dur, W, H);

    var beats = ad.visual_beats || [];
    var active = null;
    beats.forEach(function (b) { if (t >= b.at_sec && b.directive) active = b.directive; });
    if (active) {
      ctx.save();
      ctx.shadowColor = hexAlpha(PALETTE.accent, .3); ctx.shadowBlur = 14;
      ctx.fillStyle = hexAlpha(PALETTE.bg, .88);
      rr(ctx, 44, H - 54, Math.min(760, W - 90), 34, 8); ctx.fill();
      ctx.restore();
      ctx.fillStyle = PALETTE.accent;
      rr(ctx, 44, H - 54, 4, 34, 2); ctx.fill();
      text(ctx, "▸ " + active, 58, H - 37, 14, PALETTE.accent, 650);
    }
    ctx.restore(); /* scene crossfade */
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
