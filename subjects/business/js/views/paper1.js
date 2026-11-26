/* EcBiz Paper 1 topical practice studio — plain ES5 browser JavaScript.
   Registers the "practice" view (the Paper 1 nav item). Data: data/paper1.json
   (6,000 case-study sets / 24,000 questions). Only one set is rendered at a time.
   Presentation mirrors the original PracticeStudio React component: the
   study-page / study-hero / study-studio / study-workspace / study-columns shell. */
(function () {
  "use strict";
  if (!window.EC) return;

  var EC = window.EC;
  var esc = EC.esc;
  var store = EC.store;

  var SECTIONS = [
    { n: "1", label: "Business Activity" },
    { n: "2", label: "People in Business" },
    { n: "3", label: "Marketing" },
    { n: "4", label: "Operations" },
    { n: "5", label: "Finance" },
    { n: "6", label: "External Influences" }
  ];

  /* AO3 / AO4 signal language — verbatim from the original AOHighlightViewer. */
  var ANALYSIS_WORDS = [
    "this leads to", "as a result", "consequently", "therefore", "this means that",
    "meaning that", "which enables", "enabling the business to", "enabling them to",
    "enables the business to", "resulting in", "because of this", "leading to",
    "this results in", "which causes", "in turn", "which leads to",
    "this allows the business to", "this reduces", "this increases", "which helps",
    "subsequently", "due to this", "thereby", "because", "due to", "in order to",
    "allowing", "which impacts", "which lowers", "impact on profit", "affects cash flow",
    "loss of customers", "lower costs", "higher revenue", "higher profit",
    "reduces financial risk", "delays operations", "lowers unit costs",
    "increased productivity", "improves cash flow", "competitive advantage",
    "loss of reputation"
  ];
  var EVALUATION_WORDS = [
    "on balance", "in conclusion", "to conclude", "overall", "however", "weighing up",
    "weighing", "depends on", "depends upon", "it depends on", "the deciding factor",
    "deciding factor", "greater than", "outweigh", "outweighs", "short run", "long run",
    "in the short term", "in the long term", "in the short run", "in the long run",
    "ultimately", "despite this", "nevertheless", "on the other hand", "in contrast",
    "although", "vital that", "crucial factor", "vital factor", "most important factor",
    "most critical factor", "best option", "recommend", "justified because",
    "advantages are greater", "disadvantages are greater", "preferable", "superior", "decisive"
  ];
  /* AO1 syllabus vocabulary from the original AOHighlightViewer. */
  var KNOWLEDGE_TERMS = [
    "fixed costs", "variable costs", "fixed cost", "variable cost", "revenue", "profit",
    "break-even", "margin of safety", "market segmentation", "niche market", "mass market",
    "economies of scale", "diseconomies of scale", "product life cycle", "price elasticity",
    "demand", "supply", "equilibrium", "sole trader", "unlimited liability",
    "limited liability", "partnership", "private limited company", "public limited company",
    "plc", "ltd", "joint venture", "franchise", "franchisee", "franchisor",
    "quality control", "quality assurance", "total quality management", "tqm",
    "just-in-time", "jit", "batch production", "flow production", "job production",
    "lean production", "kaizen", "buffer stock", "boston matrix", "cash cow", "cash dog",
    "star", "problem child", "opportunity cost", "factors of production", "land", "labour",
    "labor", "capital", "enterprise", "rent", "wages", "interest", "salary", "commission",
    "piece rate", "bonus", "fringe benefits", "profit sharing", "motivation", "maslow",
    "taylor", "herzberg", "hierarchy of needs", "hygiene factors", "job rotation",
    "job enrichment", "span of control", "chain of command", "delegation", "centralised",
    "decentralised", "autocratic", "democratic", "paternalistic", "laissez-faire",
    "trade union", "industrial action", "strike", "overtime", "recruitment", "redundancy",
    "dismissal", "contract of employment", "market research", "primary research",
    "secondary research", "sampling", "random sample", "quota sample", "market share",
    "marketing mix", "product", "price", "promotion", "place", "penetration pricing",
    "price skimming", "cost-plus pricing", "competitive pricing", "promotional mix",
    "branding", "brand image", "e-commerce", "distribution channel", "wholesaler",
    "retailer", "cash flow", "cash flow forecast", "working capital", "liquidity",
    "overdraft", "bank loan", "retained profit", "share capital", "income statement",
    "gross profit", "net profit", "balance sheet", "current ratio", "acid test ratio",
    "return on capital employed", "roce", "inflation", "unemployment", "economic growth",
    "gross domestic product", "gdp", "exchange rate", "appreciation", "depreciation",
    "tariff", "quota", "added value", "specialisation", "division of labour",
    "primary sector", "secondary sector", "tertiary sector"
  ];
  var STOP = {
    "the": 1, "and": 1, "for": 1, "with": 1, "that": 1, "this": 1, "from": 1,
    "into": 1, "have": 1, "has": 1, "are": 1, "was": 1, "were": 1, "not": 1,
    "each": 1, "than": 1, "then": 1, "they": 1, "their": 1, "which": 1, "will": 1,
    "business": 1, "businesses": 1, "company": 1, "companies": 1, "mark": 1,
    "one": 1, "two": 1, "allowed": 1, "need": 1, "needed": 1, "type": 1
  };

  var AO_STYLE = {
    ao1: "background:#dbeafe;border-bottom:2px solid #3b82f6;color:#1e3a8a;padding:1px 3px;border-radius:3px",
    ao2: "background:#d1fae5;border-bottom:2px solid #10b981;color:#065f46;padding:1px 3px;border-radius:3px",
    ao3: "background:#fef3c7;border-bottom:2px solid #f59e0b;color:#92400e;padding:1px 3px;border-radius:3px",
    ao4: "background:#ede9fe;border-bottom:2px solid #8b5cf6;color:#5b21b6;padding:1px 3px;border-radius:3px"
  };
  var AO_LABEL = { ao1: "AO1 K", ao2: "AO2 APP", ao3: "AO3 AN", ao4: "AO4 EVAL" };

  var data = null;       // full 6000-set array (kept in JS memory only)
  var units = [];        // distinct unit strings from the data
  var mainEl = null;
  var AI_MODEL_LABEL = "Qwen 3 0.6B";
  var aiUnsubscribe = null;  // EC.ai.onChange handle (installed once on bind)

  /* Lazily-loaded question banks for the two alternate practice modes. */
  var banks = {
    "verified-questions": null,
    "verified-p1-cases": null,
    "verified-p2-cases": null,
    "other-paper2-cases": null
  };

  var state = {
    mode: "paper1",        // "paper1" | "verified" | "paper2"
    unit: "all",
    search: "",
    shuffle: false,
    ranks: null,
    list: [],
    activeId: "",
    activePart: "",
    focusPart: "",
    /* Official past papers (verified-questions.json) */
    vqPaper: "all",
    vqMark: "all",
    vqIndex: 0,
    /* Paper 2 specimen insert (verified-p2-cases.json / other-paper2-cases.json) */
    p2CaseIndex: 0,
    p2Index: 0,
    /* Question timer */
    timerSeconds: 0,
    timerRunning: false,
    timerHandle: null,
    /* ExamLayoutPicker preference (EC.store key "exam_layout" → ecbiz_exam_layout) */
    layout: "stacked",
    /* Full EC.autoMark result for the assessment drawer */
    evaluation: null,
    evaluationId: "",
    lastCoins: null,
    lastSubmissionId: "",
    originalEvaluation: null,
    overrideOpen: false,
    overrideForm: null,
    /* Live AO highlighter + toggle chips */
    liveHighlight: false,
    showAo: { ao1: true, ao2: true, ao3: true, ao4: true },
    /* Verified-mode appendix tab ("main" or appendix index) */
    verifiedCaseTab: "main",
    /* Flag dialog */
    flagOpen: "",
    flagReason: "Typo in question",
    flagConfidence: "Pretty sure",
    flagNote: "",
    flagScrollOverflow: null,
    /* Factors of production diagram */
    factorsOpen: false,
    factorsTab: "factors",
    factorsSelected: "land"
  };

  /* ------------------------------------------------------------------ */
  /* Small ES5 helpers                                                    */
  /* ------------------------------------------------------------------ */
  function num(v, d) { v = parseInt(v, 10); return isNaN(v) ? d : v; }

  function wordCount(s) {
    s = String(s == null ? "" : s).trim();
    return s ? s.split(/\s+/).length : 0;
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function unitNumber(unitStr) {
    var m = /Unit\s+(\d)/i.exec(String(unitStr || ""));
    return m ? m[1] : "";
  }

  function qid(scenarioId, part) { return scenarioId + "_" + part; }

  function findAction(node) {
    while (node && node !== mainEl) {
      if (node.getAttribute && node.getAttribute("data-action")) return node;
      node = node.parentNode;
    }
    return null;
  }

  function qs(selector) { return mainEl ? mainEl.querySelector(selector) : null; }

  /* ------------------------------------------------------------------ */
  /* Marking engine — mirrors PracticeStudio.tsx:1019-1052. The primary
     button loads the model in place via EC.ai.load(); the AI Marker page
     stays reachable from elsewhere, but this button never navigates.      */
  /* ------------------------------------------------------------------ */
  function aiInfo() {
    var st = {}, ready = false, loading = false, status = "", reason = "", percent = 0;
    try { if (EC.ai && EC.ai.state) st = EC.ai.state() || {}; } catch (e) {}
    try { if (EC.ai && EC.ai.isReady) ready = !!EC.ai.isReady(); } catch (e) {}
    try { if (EC.ai && EC.ai.isLoading) loading = !!EC.ai.isLoading(); } catch (e) {}
    try { if (EC.ai && EC.ai.reason) reason = String(EC.ai.reason() || ""); } catch (e) {}
    status = String(st.status || "");
    percent = st.percent != null ? num(st.percent, 0) : num(st.progress, 0);
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    var fileProtocol = !!(window.location && window.location.protocol === "file:");
    var blocked = fileProtocol || /memory cap|Promise not supported/i.test(status) ||
      /memory cap/i.test(reason) || (/WebGPU hardware adapter unavailable/i.test(reason) && !/wasm/i.test(status));
    var error = !ready && !loading && /unavailable|failed|error/i.test(status) && !blocked;
    var label = ready ? "Local AI ready"
      : loading ? (percent > 0 ? "Loading local AI (" + percent + "%)" : "Loading local AI")
      : blocked ? "Local AI unavailable"
      : error ? "Retry local AI"
      : "Enable local AI";
    return {
      ready: ready, loading: loading, label: label, status: status, reason: reason,
      error: error, blocked: blocked, percent: percent,
      device: String(st.device || "webgpu")
    };
  }

  function engineHtml() {
    var a = aiInfo();
    var h = '<div role="group" aria-label="Marking engine" class="study-engine">' +
      '<button type="button" data-action="enable-local-ai" class="study-engine-option" ' +
        'aria-pressed="' + (a.ready ? "true" : "false") + '" title="' +
        esc(a.ready ? AI_MODEL_LABEL + " ready — local marking active"
                    : "Load " + AI_MODEL_LABEL + " (~650 MB) in the background") + '"' +
        (a.loading || a.blocked ? ' disabled' : '') + '>' +
        '<span>' + esc(a.label) + '</span>' +
        (a.ready ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500" title="' + esc(AI_MODEL_LABEL + " ready") + '"></span>' : '') +
      '</button>' +
      '<button type="button" aria-pressed="' + (a.ready ? "false" : "true") + '" class="study-engine-option">Instant Examiner</button>' +
      '</div>';
    if (a.loading) {
      /* Sky progress banner from the original PracticeStudio (amber for WASM). */
      var sky = /webgpu/i.test(a.device);
      var wrap = sky
        ? 'mt-2 px-3 py-2 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 bg-sky-50/80 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
        : 'mt-2 px-3 py-2 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300';
      h += '<div class="' + wrap + '" role="status">' +
        '<span>Downloading ' + AI_MODEL_LABEL + ' weights into browser cache…' +
          (a.status ? ' ' + esc(a.status) : '') + ' (You can still submit answers for assessment!)</span>' +
        '<span class="font-mono font-bold shrink-0">' + a.percent + '%</span></div>';
    } else if (a.error) {
      h += '<div role="status" class="mt-2 px-3 py-2 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">' +
        '<span>' + esc(a.status) + ' You can still submit answers for assessment.</span></div>';
    }
    return h;
  }

  function refreshEngine() {
    var host = qs("[data-ai-engine-host]");
    if (host) host.innerHTML = engineHtml();
  }

  /* ------------------------------------------------------------------ */
  /* Inline Lucide-style icons (same markup as the original components)  */
  /* ------------------------------------------------------------------ */
  function icon(path, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'class="' + cls + '" aria-hidden="true">' + path + '</svg>';
  }
  var ICON = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    rows: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/>',
    columns: '<rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };

  /* ExamLayoutPicker persistence — the store prefixes keys with "ecbiz_". */
  function loadLayout() {
    var layout = store.get("exam_layout", null);
    if (layout !== "stacked" && layout !== "columns") {
      layout = store.get("mock_layout", null);
      if (layout === "stacked" || layout === "columns") {
        store.set("exam_layout", layout);
        store.del("mock_layout");
      } else layout = "stacked";
    }
    return layout;
  }
  function layoutClass() {
    return state.layout === "columns" ? "study-columns-layout-columns" : "study-columns-layout-stacked";
  }
  function setLayout(next) {
    if (next !== "stacked" && next !== "columns") return;
    state.layout = next;
    store.set("exam_layout", next);
    render();
  }

  /* Canvas-free confetti fallback (canvas-confetti compatible call shape). */
  function celebrate(options) {
    try {
      if (typeof window.confetti === "function") { window.confetti(options); return; }
      options = options || {};
      var count = options.particleCount || 50;
      var spread = options.spread || 60;
      var origin = options.origin || {};
      var w = window.innerWidth || document.documentElement.clientWidth || 800;
      var h = window.innerHeight || document.documentElement.clientHeight || 600;
      var startX = (typeof origin.x === "number" ? origin.x : 0.5) * w;
      var startY = (typeof origin.y === "number" ? origin.y : 0.7) * h;
      var span = w * (spread / 100);
      var style = document.getElementById("ecbiz-p1-confetti-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "ecbiz-p1-confetti-style";
        style.textContent = "@keyframes ecbizP1Confetti{" +
          "0%{opacity:1;transform:translate3d(0,0,0) rotate(0deg)}" +
          "100%{opacity:0;transform:translate3d(var(--dx,0px),var(--dy,100vh),0) rotate(var(--rot,540deg))}}" +
          ".ecbiz-p1-confetti{position:absolute;display:block;width:8px;height:12px;border-radius:1px;opacity:0;" +
          "animation:ecbizP1Confetti 1.5s ease-out forwards}";
        (document.head || document.documentElement).appendChild(style);
      }
      var host = document.createElement("div");
      host.setAttribute("aria-hidden", "true");
      host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
      var palette = ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"];
      for (var i = 0; i < count; i++) {
        var p = document.createElement("i");
        p.className = "ecbiz-p1-confetti";
        var dx = (Math.random() - 0.5) * span;
        var dy = Math.max(80, h - startY + 60) * (0.7 + Math.random() * 0.5);
        p.style.left = Math.max(0, Math.min(w, startX + dx)) + "px";
        p.style.top = startY + "px";
        p.style.background = palette[i % palette.length];
        p.style.setProperty("--dx", (dx * 0.4).toFixed(1) + "px");
        p.style.setProperty("--dy", dy.toFixed(1) + "px");
        p.style.setProperty("--rot", Math.round((Math.random() - 0.5) * 1080) + "deg");
        host.appendChild(p);
      }
      (document.body || document.documentElement).appendChild(host);
      window.setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 1800);
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ */
  /* Shared helpers: question timer, local flags, lazy bank loading       */
  /* ------------------------------------------------------------------ */
  function formatTime(s) {
    s = num(s, 0);
    var m = Math.floor(s / 60), sec = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function tickTimer() {
    state.timerSeconds++;
    var t = qs("[data-timer]");
    if (t) t.textContent = formatTime(state.timerSeconds);
  }

  function toggleTimer() {
    if (state.timerRunning) {
      if (state.timerHandle) clearInterval(state.timerHandle);
      state.timerHandle = null;
      state.timerRunning = false;
    } else {
      state.timerRunning = true;
      state.timerHandle = setInterval(tickTimer, 1000);
    }
    var btn = qs('[data-action="toggle-timer"]');
    if (btn) btn.textContent = state.timerRunning ? "⏸ Pause Timer" : "▶ Start Timer";
  }

  function resetTimer() {
    if (state.timerHandle) clearInterval(state.timerHandle);
    state.timerHandle = null;
    state.timerRunning = false;
    state.timerSeconds = 0;
  }

  function flaggedIds() {
    var notes = store.get("question_flags", []);
    var legacy = store.get("flagged_question_ids", []);
    var out = [], i;
    if (Array.isArray(legacy)) out = out.concat(legacy);
    if (Array.isArray(notes)) {
      for (i = 0; i < notes.length; i++) {
        if (notes[i] && notes[i].questionId && out.indexOf(notes[i].questionId) < 0) out.push(notes[i].questionId);
      }
    }
    return out;
  }

  /* Port of FlagQuestionButton.tsx — four reasons, three confidence levels,
     240-character note, Escape-to-close and background scroll lock. */
  var FLAG_REASONS = ["Typo in question", "Mark scheme issue", "Wrong unit / tag", "Other"];
  var FLAG_CONFIDENCES = ["Pretty sure", "Very confident", "100% certain"];

  function saveFlag(id) {
    if (!id || flaggedIds().indexOf(id) >= 0) { closeDialogs(); return; }
    var notes = store.get("question_flags", []);
    if (!Array.isArray(notes)) notes = [];
    var entry = {
      questionId: id,
      reason: state.flagReason,
      confidence: state.flagConfidence,
      note: String(state.flagNote || "").trim().slice(0, 240),
      timestamp: new Date().toISOString()
    };
    var out = [entry];
    for (var i = 0; i < notes.length; i++) {
      if (notes[i] && notes[i].questionId !== id) out.push(notes[i]);
    }
    if (out.length > 500) out.length = 500;
    store.set("question_flags", out);
    store.set("flagged_question_ids", flaggedIds().concat([id]));
    closeDialogs();
    renderContent();
  }

  function dialogIsOpen() {
    return !!state.flagOpen || state.overrideOpen || !!state.factorsOpen;
  }

  function syncDialogLock() {
    try {
      if (dialogIsOpen()) {
        if (state.flagScrollOverflow === null) state.flagScrollOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      } else {
        if (state.flagScrollOverflow !== null) document.body.style.overflow = state.flagScrollOverflow;
        state.flagScrollOverflow = null;
      }
    } catch (e) {}
  }

  function closeDialogs() {
    state.flagOpen = "";
    state.overrideOpen = false;
    state.factorsOpen = false;
    state.flagNote = "";
    state.flagReason = "Typo in question";
    state.flagConfidence = "Pretty sure";
    syncDialogLock();
    renderDialogs();
  }

  function loadBanks(names, done) {
    var i = 0;
    function next() {
      if (i >= names.length) { done(); return; }
      var name = names[i++];
      EC.load(name).then(function (json) {
        banks[name] = json;
        next();
      }, function () {
        banks[name] = null;
        next();
      });
    }
    next();
  }

  /* ------------------------------------------------------------------ */
  /* Local persistence (EC.store prefixes keys with "ecbiz_")            */
  /* ------------------------------------------------------------------ */
  function getSubmissions() {
    var s = store.get("submissions", []);
    return Array.isArray(s) ? s : [];
  }

  function submissionMap() {
    var map = {}, arr = getSubmissions();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].questionId) map[arr[i].questionId] = arr[i];
    }
    return map;
  }

  function savedScore(record) {
    if (!record) return null;
    if (record.result && record.result.totalScore != null) return num(record.result.totalScore, 0);
    if (record.score != null) return num(record.score, 0);
    return null;
  }

  function getBookmarks() {
    var b = store.get("bookmarked_questions", []);
    return Array.isArray(b) ? b : [];
  }

  function toggleBookmark(id) {
    var list = getBookmarks(), i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    store.set("bookmarked_questions", list);
    return i < 0;
  }

  function getDraft(id) {
    var v = store.get("draft_" + id, "");
    return typeof v === "string" ? v : "";
  }

  function persistState() {
    store.set("p1_studio_state", {
      unit: state.unit, search: state.search, shuffle: state.shuffle, activeId: state.activeId
    });
    if (state.activeId) {
      store.set("p1_last_position", {
        scenarioId: state.activeId, part: "a",
        sectionCode: state.unit === "all" ? undefined : state.unit,
        updatedAt: Date.now()
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Filtering / navigation                                              */
  /* ------------------------------------------------------------------ */
  function recomputeList() {
    var q = String(state.search || "").toLowerCase();
    var out = [], i, j, s, qs, hay;
    for (i = 0; i < data.length; i++) {
      s = data[i];
      if (state.unit !== "all" && unitNumber(s.unit) !== state.unit) continue;
      if (q) {
        hay = String(s.scenario_stem || "") + " " + String(s.unit || "") + " " + String(s.scenario_id || "");
        qs = s.questions || [];
        for (j = 0; j < qs.length; j++) hay += " " + String(qs[j].question_text || "");
        if (hay.toLowerCase().indexOf(q) < 0) continue;
      }
      out.push(s);
    }
    if (state.shuffle) {
      if (!state.ranks) {
        state.ranks = {};
        for (i = 0; i < data.length; i++) state.ranks[data[i].scenario_id] = Math.random();
      }
      out.sort(function (a, b) {
        return (state.ranks[a.scenario_id] || 0) - (state.ranks[b.scenario_id] || 0);
      });
    }
    state.list = out;
    var found = false;
    for (i = 0; i < out.length; i++) {
      if (out[i].scenario_id === state.activeId) { found = true; break; }
    }
    if (!found) state.activeId = out.length ? out[0].scenario_id : "";
  }

  function activeScenario() {
    if (state.mode === "verified") return verifiedScenario();
    if (state.mode === "paper2") return p2Scenario();
    var i;
    for (i = 0; i < state.list.length; i++) {
      if (state.list[i].scenario_id === state.activeId) return state.list[i];
    }
    return state.list[0] || null;
  }

  function activeIndex() {
    var i;
    for (i = 0; i < state.list.length; i++) {
      if (state.list[i].scenario_id === state.activeId) return i;
    }
    return 0;
  }

  /* The original studio edits one part at a time. Fall back to the first
     part of the active scenario when no valid part has been selected yet. */
  function currentPart() {
    var sc = activeScenario();
    var parts = sc ? (sc.questions || []) : [];
    var i;
    if (state.activePart) {
      for (i = 0; i < parts.length; i++) {
        if (parts[i].part === state.activePart) return state.activePart;
      }
    }
    return parts.length ? parts[0].part : "a";
  }

  /* ------------------------------------------------------------------ */
  /* Mode adapters — reshape the two alternate banks into the same        */
  /* scenario/question shape the paper-1 editor and examiner already use.  */
  /* ------------------------------------------------------------------ */
  function verifiedAll() {
    return Array.isArray(banks["verified-questions"]) ? banks["verified-questions"] : [];
  }

  function verifiedFiltered() {
    var all = verifiedAll(), out = [], i, q;
    for (i = 0; i < all.length; i++) {
      q = all[i];
      if (state.vqPaper !== "all" && num(q.paper, 0) !== num(state.vqPaper, 0)) continue;
      if (state.vqMark !== "all" && num(q.marks, 0) !== num(state.vqMark, 0)) continue;
      if (state.unit !== "all" && String(q.unit || "").indexOf("Unit " + state.unit) < 0) continue;
      out.push(q);
    }
    if (state.vqIndex >= out.length) state.vqIndex = 0;
    return out;
  }

  /* Mirrors getVerifiedCaseStudy() from the original verified-case-studies lib. */
  function verifiedCase(vq) {
    if (!vq) return null;
    var p1 = banks["verified-p1-cases"];
    var p2 = banks["verified-p2-cases"];
    var qNumMatch = /^(\d+)/.exec(String(vq.question || ""));
    var qNum = qNumMatch ? qNumMatch[1] : "1";
    var key;
    if (num(vq.paper, 0) === 1) {
      key = String(vq.paper_code || "") + "|" + String(vq.year || "") + "|" +
        String(vq.series || "") + "|Q" + qNum;
      return (p1 && p1[key]) || null;
    }
    key = String(vq.paper_code || "") + "|" + String(vq.year || "") + "|" + String(vq.series || "");
    return (p2 && p2[key]) || null;
  }

  function verifiedFullContext(vq, cs) {
    if (!cs) return String(vq.case_context || "General Cambridge business scenario.");
    var parts = [cs.businessTitle, cs.mainCase, cs.table];
    if (cs.appendices) {
      for (var i = 0; i < cs.appendices.length; i++) {
        parts.push((cs.appendices[i].label || "") + ":\n" + (cs.appendices[i].body || ""));
      }
    }
    return parts.filter(Boolean).join("\n\n");
  }

  /* Case-study proper nouns become the AO2 keyword list, as in the original. */
  function extractVerifiedAppWords(vq, cs) {
    var source = [cs && cs.businessTitle, cs && cs.mainCase, vq && vq.case_context]
      .filter(Boolean).join(" ");
    var words = String(source).match(/\b[A-Z][A-Za-z0-9&]{2,}\b/g) || [], out = [];
    for (var i = 0; i < words.length; i++) {
      if (!STOP[words[i].toLowerCase()] && out.indexOf(words[i]) < 0) out.push(words[i]);
      if (out.length >= 12) break;
    }
    return out;
  }

  function verifiedScenario() {
    var list = verifiedFiltered();
    var vq = list.length ? list[state.vqIndex] : null;
    if (!vq) return null;
    var cs = verifiedCase(vq);
    var terms = [String(vq.question_paraphrase || vq.question || "Knowledge of the syllabus topic.")];
    if (vq.case_context) terms.push(String(vq.case_context));
    return {
      scenario_id: "VQ_" + vq.id,
      unit: String(vq.unit || ""),
      scenario_stem: verifiedFullContext(vq, cs),
      verified: vq,
      caseStudy: cs,
      questions: [{
        part: "a",
        mark_value: num(vq.marks, 0),
        question_text: String(vq.question_paraphrase || vq.question || "Question"),
        mark_scheme: { knowledge_max_2: terms },
        model_answer: "Refer to the official Cambridge mark scheme PDF linked in the case panel for indicative content.",
        qwen_marking_keys: { valid_app_words: extractVerifiedAppWords(vq, cs) }
      }]
    };
  }

  function p2CaseEntries() {
    var out = [], key, c, i;
    var official = banks["verified-p2-cases"];
    if (official && typeof official === "object") {
      for (key in official) {
        if (!official.hasOwnProperty(key)) continue;
        c = official[key];
        if (c && c.mainCase) {
          out.push({
            key: key,
            title: String(c.businessTitle || key),
            stem: String(c.mainCase || ""),
            appendices: c.appendices || [],
            questions: null,
            official: true,
            businessName: String(c.businessTitle || key),
            industry: "",
            session: key,
            hooks: []
          });
        }
      }
    }
    var other = banks["other-paper2-cases"];
    if (Array.isArray(other)) {
      for (i = 0; i < other.length; i++) {
        c = other[i];
        if (!c) continue;
        var stem = [c.backgroundStory, c.operationsAndWorkforce, c.marketAndStrategy]
          .filter(Boolean).join("\n\n");
        out.push({
          key: String(c.id || ("OTHER_" + i)),
          title: String(c.businessName || c.title || "Paper 2 Case Study"),
          stem: String(stem || c.overviewSummary || ""),
          appendices: c.appendices || [],
          questions: c.questions || [],
          official: false,
          businessName: String(c.businessName || c.title || "—"),
          industry: String(c.industry || c.businessType || "—"),
          session: String(c.session || ("Year " + (c.year || "—"))),
          hooks: c.applicationHooks || []
        });
      }
    }
    /* Surface the official 0264/02 2027 specimen insert first. */
    out.sort(function (a, b) {
      var ar = String(a.key).indexOf("2027 specimen") >= 0 ? 0 : 1;
      var br = String(b.key).indexOf("2027 specimen") >= 0 ? 0 : 1;
      return ar - br;
    });
    return out;
  }

  function p2Case() {
    var list = p2CaseEntries();
    if (!list.length) return null;
    if (state.p2CaseIndex >= list.length) state.p2CaseIndex = 0;
    return list[state.p2CaseIndex];
  }

  function p2QuestionPool() {
    var c = p2Case();
    if (!c) return [];
    if (c.questions && c.questions.length) return c.questions;
    var all = verifiedAll(), scored = [], out = [], i;
    var parts = String(c.key || "").split("|");
    var year = num(parts[1], 0), series = parts[2] || "";
    for (i = 0; i < all.length; i++) {
      if (num(all[i].paper, 0) !== 2) continue;
      var rank = 0;
      if (year && num(all[i].year, 0) === year) rank += 2;
      if (series && String(all[i].series || "") === series) rank += 2;
      scored.push({ q: all[i], rank: rank });
    }
    scored.sort(function (a, b) { return b.rank - a.rank; });
    for (i = 0; i < scored.length; i++) out.push(scored[i].q);
    return out;
  }

  function p2Scenario() {
    var c = p2Case();
    var pool = p2QuestionPool();
    var vq = pool.length ? pool[state.p2Index] : null;
    if (!c || !vq) return null;
    if (state.p2Index >= pool.length) state.p2Index = 0;
    var isRaw = !!vq.questionText;
    var text = String(vq.questionText || vq.question_paraphrase || vq.question || "Question");
    var indicative = (vq.rubric && Array.isArray(vq.rubric.indicativeContent))
      ? vq.rubric.indicativeContent : [text];
    var model = (vq.rubric && vq.rubric.sampleStrongAnswer)
      ? String(vq.rubric.sampleStrongAnswer)
      : "Refer to the official Cambridge mark scheme PDF linked in the case panel for indicative content.";
    return {
      scenario_id: "P2_" + c.key + "_" + vq.id,
      unit: String(c.key || "Paper 2"),
      scenario_stem: c.stem,
      appendices: c.appendices,
      p2case: c,
      p2question: vq,
      questions: [{
        part: "a",
        mark_value: num(vq.marks, 0),
        question_text: text,
        mark_scheme: { knowledge_max_2: indicative },
        model_answer: model,
        qwen_marking_keys: { valid_app_words: (c.hooks || []).slice(0, 8) }
      }]
    };
  }

  function findQuestion(id) {
    var sc = activeScenario();
    if (!sc) return null;
    var qs = sc.questions || [];
    for (var i = 0; i < qs.length; i++) {
      if (qid(sc.scenario_id, qs[i].part) === id) return { scenario: sc, question: qs[i] };
    }
    return null;
  }

  function valueOfAnswer(id) {
    var t = qs('textarea[data-qid="' + id + '"]');
    return t ? t.value : getDraft(id);
  }

  function clearEvaluation() {
    state.evaluation = null;
    state.originalEvaluation = null;
    state.evaluationId = "";
    state.lastCoins = null;
    state.lastSubmissionId = "";
    state.liveHighlight = false;
    state.overrideOpen = false;
    state.overrideForm = null;
    renderResults();
  }

  function move(delta) {
    if (!state.list.length) return;
    clearEvaluation();
    var next = (activeIndex() + delta + state.list.length) % state.list.length;
    state.activeId = state.list[next].scenario_id;
    renderContent();
    updateCount();
    persistState();
  }

  function doJump() {
    var input = qs('[data-action="jump-num"]');
    if (!input || !state.list.length) return;
    var n = num(input.value, 1);
    n = Math.max(1, Math.min(state.list.length, n));
    state.activeId = state.list[n - 1].scenario_id;
    renderContent();
    updateCount();
    persistState();
  }

  /* ------------------------------------------------------------------ */
  /* Instant Examiner (deterministic keyword / structure checks)         */
  /* ------------------------------------------------------------------ */
  function markSchemeTerms(q) {
    var ms = (q && q.mark_scheme) || {}, out = [], key;
    for (key in ms) {
      if (ms.hasOwnProperty(key) && Array.isArray(ms[key])) {
        out = out.concat(ms[key]);
      }
    }
    return out;
  }

  function termTokens(term) {
    var raw = String(term || "").toLowerCase().match(/[a-z]{4,}/g) || [], out = [];
    for (var i = 0; i < raw.length; i++) {
      if (!STOP[raw[i]] && out.indexOf(raw[i]) < 0) out.push(raw[i]);
    }
    return out;
  }

  function termsFound(terms, lowerAnswer) {
    var found = [];
    for (var i = 0; i < terms.length; i++) {
      var toks = termTokens(terms[i]), hit = false;
      for (var j = 0; j < toks.length; j++) {
        if (lowerAnswer.indexOf(toks[j]) >= 0) { hit = true; break; }
      }
      if (hit) found.push(terms[i]);
    }
    return found;
  }

  function phrasesFound(phrases, lowerAnswer) {
    var found = [];
    for (var i = 0; i < phrases.length; i++) {
      if (lowerAnswer.indexOf(String(phrases[i]).toLowerCase()) >= 0) found.push(phrases[i]);
    }
    return found;
  }

  function instantFeedback(q, answer) {
    var lower = String(answer || "").toLowerCase();
    var words = wordCount(answer);
    var ms = q.mark_scheme || {};
    var keys = q.qwen_marking_keys || {};
    var rules = keys.deterministic_rules || {};
    var max = num(q.mark_value, 0);

    var knowTerms = markSchemeTerms(q);
    var kFound = termsFound(knowTerms, lower);
    var appWords = keys.valid_app_words || [];
    var appFound = phrasesFound(appWords, lower);
    var anFound = phrasesFound(ANALYSIS_WORDS, lower);
    var evalFound = phrasesFound(EVALUATION_WORDS, lower);

    var capApp = /app/i.test(rules.if_app_words_missing || "") && appFound.length === 0;
    var capEval = /eval/i.test(rules.if_no_eval_word || "") && evalFound.length === 0;

    var kPts = Math.min(2, kFound.length);
    var appPts = max >= 4 ? Math.min(2, appFound.length) : 0;
    var anPts = max >= 6 ? Math.min(2, anFound.length) : 0;
    var evalPts = max >= 8 ? Math.min(2, evalFound.length) : 0;
    if (capApp) appPts = 0;
    if (capEval) evalPts = 0;
    var estimate = Math.min(max, kPts + appPts + anPts + evalPts);

    var target = max <= 2 ? 20 : max <= 4 ? 50 : max <= 6 ? 90 : 130;
    var points = [];
    points.push("Length: " + words + " words (a full " + max + "-mark answer is usually around " + target + " words)." +
      (words < target * 0.5 ? " Try to develop your points further." : ""));
    points.push("AO1 Knowledge: " + kFound.length + " of " +
      (Array.isArray(ms.knowledge_max_2) ? ms.knowledge_max_2.length : knowTerms.length) +
      " key ideas detected" + (kFound.length ? " (" + kFound.slice(0, 3).join("; ") + ")." : ". Check the definition in the mark scheme."));
    if (max >= 4) {
      points.push("AO2 Application: " + appFound.length + " case-study reference" + (appFound.length === 1 ? "" : "s") +
        " detected" + (appFound.length ? " (" + appFound.slice(0, 4).join(", ") + ")." : "."));
      if (capApp) points.push("Rubric rule: no case context found, so AO2 Application is capped at 0.");
    }
    if (max >= 6) {
      points.push("AO3 Analysis: " + anFound.length + " causal link" + (anFound.length === 1 ? "" : "s") +
        " detected" + (anFound.length ? " (" + anFound.slice(0, 3).join(", ") + ")." : ". Use phrases such as 'this leads to' or 'as a result'."));
    }
    if (max >= 8) {
      points.push("AO4 Evaluation: " + evalFound.length + " judgement phrase" + (evalFound.length === 1 ? "" : "s") +
        " detected" + (evalFound.length ? " (" + evalFound.slice(0, 3).join(", ") + ")." : ". Weigh the options and reach a justified conclusion."));
      if (capEval) points.push("Rubric rule: no evaluative language found, so AO4 Evaluation is capped at 0.");
    }
    points.push("Estimated mark (guideline only): " + estimate + " / " + max +
      ". Compare with the mark scheme and model answer before awarding your own mark.");
    return { score: estimate, max: max, points: points };
  }

  function normalizeAuto(r) {
    if (!r || typeof r !== "object") return null;
    var score = r.totalScore != null ? r.totalScore : (r.score != null ? r.score : r.mark);
    var max = r.maxMarks != null ? r.maxMarks : r.max;
    var feedback = r.feedback || r.message || r.text || "";
    if (score == null && !feedback) return null;
    var points = Array.isArray(r.points) ? r.points : (feedback ? [feedback] : []);
    return {
      score: score != null ? num(score, 0) : null,
      max: max != null ? num(max, 0) : null,
      points: points
    };
  }

  function feedbackHtml(det, heading) {
    var h = '<div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">';
    h += '<strong class="font-mono font-bold uppercase text-[11px] tracking-wider text-slate-900 dark:text-slate-100 block mb-1">' + esc(heading) + '</strong>';
    if (det.score != null) {
      h += '<div class="font-mono font-bold text-emerald-700 dark:text-emerald-400 mb-1">' +
        esc(det.score) + (det.max != null ? ' / ' + esc(det.max) : '') + '</div>';
    }
    h += '<ul class="list-disc pl-4 space-y-1">';
    for (var i = 0; i < det.points.length; i++) h += '<li>' + esc(det.points[i]) + '</li>';
    h += '</ul></div>';
    return h;
  }

  function runExaminer(id, panel) {
    var found = findQuestion(id);
    if (!found) return;
    var answer = valueOfAnswer(id);
    var det = instantFeedback(found.question, answer);
    panel.innerHTML = feedbackHtml(det, "Instant Examiner · local keyword & structure checks");
  }

  function updateAiSlot(panel, result) {
    if (!panel || !panel.parentNode) return;
    var slot = panel.querySelector('[data-ai-slot]');
    if (!slot) return;
    var norm = normalizeAuto(result);
    if (!norm) {
      slot.innerHTML = "AI assessment unavailable — local checks shown above.";
      return;
    }
    slot.innerHTML = '<hr style="border:0;border-top:1px solid var(--line);margin:12px 0">' +
      feedbackHtml(norm, "AI-assisted assessment (optional EC.autoMark)");
  }

  /* ------------------------------------------------------------------ */
  /* AO highlighting                                                     */
  /* ------------------------------------------------------------------ */
  function aoForTag(tag) {
    if (tag === "k" || tag === "ao1" || tag === "1" || tag === "2") return "ao1";
    if (tag === "app" || tag === "ao2") return "ao2";
    if (tag === "an" || tag === "ao3") return "ao3";
    if (tag === "eval" || tag === "ao4") return "ao4";
    return null;
  }

  function aoEnabled(ao) { return !state.showAo || state.showAo[ao] !== false; }

  function highlightAnnotated(text, filter) {
    var re = /(\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\])/gi;
    var parts = String(text || "").split(re);
    var out = "", buf = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var m = /^\[(k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]$/i.exec(p);
      if (m) {
        var ao = aoForTag(m[1].toLowerCase());
        if (ao && filter && !aoEnabled(ao)) ao = null;
        if (buf) {
          out += ao
            ? '<span style="' + AO_STYLE[ao] + '">' + esc(buf) + ' <b style="font-size:9px">' + AO_LABEL[ao] + '</b></span> '
            : esc(buf) + ' ';
          buf = "";
        }
      } else {
        buf += p;
      }
    }
    if (buf) out += esc(buf);
    return out;
  }

  /* Returns the de-overlapped AO spans for a student answer. The same scanner
     feeds both the highlighter and the detected-element counts. */
  function aoMatches(text, q, filter) {
    text = String(text || "");
    var lower = text.toLowerCase();
    var matches = [], i, j;

    function add(term, ao, priority) {
      if (filter && !aoEnabled(ao)) return;
      var needle = String(term || "").toLowerCase();
      if (!needle) return;
      var from = 0, idx;
      while ((idx = lower.indexOf(needle, from)) >= 0) {
        matches.push({ start: idx, end: idx + needle.length, ao: ao, priority: priority });
        from = idx + needle.length;
      }
    }

    var appWords = (q.qwen_marking_keys || {}).valid_app_words || [];
    for (i = 0; i < appWords.length; i++) add(appWords[i], "ao2", 4);
    for (i = 0; i < EVALUATION_WORDS.length; i++) add(EVALUATION_WORDS[i], "ao4", 3);
    for (i = 0; i < ANALYSIS_WORDS.length; i++) add(ANALYSIS_WORDS[i], "ao3", 2);
    var know = markSchemeTerms(q).concat(KNOWLEDGE_TERMS);
    for (i = 0; i < know.length; i++) {
      var toks = termTokens(know[i]);
      for (j = 0; j < toks.length; j++) add(toks[j], "ao1", 1);
    }

    matches.sort(function (a, b) {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if ((b.end - b.start) !== (a.end - a.start)) return (b.end - b.start) - (a.end - a.start);
      return a.start - b.start;
    });
    var kept = [];
    for (i = 0; i < matches.length; i++) {
      var overlaps = false;
      for (j = 0; j < kept.length; j++) {
        if (matches[i].start < kept[j].end && matches[i].end > kept[j].start) { overlaps = true; break; }
      }
      if (!overlaps) kept.push(matches[i]);
    }
    kept.sort(function (a, b) { return a.start - b.start; });
    return { text: text, kept: kept };
  }

  function renderMatches(found) {
    var text = found.text, kept = found.kept;
    var out = "", pos = 0;
    for (var i = 0; i < kept.length; i++) {
      var m = kept[i];
      if (m.start > pos) out += esc(text.substring(pos, m.start));
      out += '<span style="' + AO_STYLE[m.ao] + '" title="' + AO_LABEL[m.ao] + '">' +
        esc(text.substring(m.start, m.end)) + '</span>';
      pos = m.end;
    }
    if (pos < text.length) out += esc(text.substring(pos));
    return out;
  }

  function highlightText(text, q, filter) {
    return renderMatches(aoMatches(text, q, filter));
  }

  function aoCounts(found) {
    var counts = { ao1: [], ao2: [], ao3: [], ao4: [] }, i, m;
    for (i = 0; i < found.kept.length; i++) {
      m = found.kept[i];
      var word = found.text.substring(m.start, m.end).toLowerCase();
      if (counts[m.ao].indexOf(word) < 0) counts[m.ao].push(word);
    }
    return counts;
  }

  /* Interactive AO legend — mirrors the original AOHighlightViewer chips. */
  function aoChipRow() {
    var chips = [
      ["ao1", "AO1 Knowledge", "bg-blue-500 border-blue-500 text-blue-700 dark:text-blue-300", "bg-blue-500/10"],
      ["ao2", "AO2 Context (App)", "bg-emerald-500 border-emerald-500 text-emerald-700 dark:text-emerald-300", "bg-emerald-500/10"],
      ["ao3", "AO3 Analysis", "bg-amber-500 border-amber-500 text-amber-700 dark:text-amber-300", "bg-amber-500/10"],
      ["ao4", "AO4 Evaluation", "bg-purple-500 border-purple-500 text-purple-700 dark:text-purple-300", "bg-purple-500/10"]
    ];
    var h = '<div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">';
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i], on = aoEnabled(c[0]);
      h += '<button type="button" data-action="toggle-ao-chip" data-ao="' + c[0] + '" aria-pressed="' +
        (on ? 'true' : 'false') + '" title="Toggle ' + esc(c[1]) + ' highlight" class="px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ' +
        (on ? c[2] + ' ' + c[3] + ' font-bold' : 'bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-400 opacity-60') + '">' +
        '<span class="w-1.5 h-1.5 rounded-full ' + c[2].split(" ")[0] + '"></span><span>' + esc(c[1]) + '</span></button>';
    }
    return h + '</div>';
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function aoViewerHtml(q, text, title, isStudent) {
    text = String(text || "");
    var bracketed = /\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]/i.test(text);
    var body;
    if (bracketed) body = highlightAnnotated(text, true);
    else if (isStudent && String(text).trim()) body = highlightText(text, q, true);
    else if (isStudent) body = '<p class="text-xs italic text-slate-500 dark:text-slate-400">Write an answer above to see your own AO language highlighted.</p>';
    else body = esc(text || "No model answer available.");

    var h = '<div class="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-4 sm:p-5 shadow-xs">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 dark:border-neutral-800">' +
        '<div><span class="font-academic-serif text-sm font-bold text-[#0F2042] dark:text-white">' + esc(title) + '</span>' +
        '<span class="block text-[11px] text-[#78716C] dark:text-neutral-400">' +
        (isStudent ? "Live visual mapping of Knowledge (AO1), Application (AO2), Analysis (AO3), and Evaluation (AO4)."
                   : "Official Cambridge rubric annotations highlighting exact mark awards.") + '</span></div>' +
        aoChipRow() + '</div>';

    if (isStudent && String(text).trim()) {
      var counts = aoCounts(aoMatches(text, q, null));
      h += '<div class="flex flex-wrap items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-neutral-800/80 text-[11px] font-mono">' +
        '<span class="text-slate-500 dark:text-neutral-400 font-sans">Detected elements:</span>' +
        '<span class="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold">' + plural(counts.ao1.length, "AO1 Concept") + '</span>' +
        '<span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-bold">' + plural(counts.ao2.length, "AO2 Case Context Fact") + '</span>' +
        '<span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-bold">' + plural(counts.ao3.length, "AO3 Causal Chain") + '</span>' +
        '<span class="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-bold">' + plural(counts.ao4.length, "AO4 Evaluative Phrase") + '</span></div>';
    }
    h += '<div class="text-sm leading-relaxed font-sans text-[#1C1917] dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">' + body + '</div></div>';
    return h;
  }

  function aoHtml(q, draft) {
    return aoViewerHtml(q, q.model_answer || "", "Model answer — annotated AO language", false) +
      '<div class="mt-3">' + aoViewerHtml(q, draft, "Your answer — detected AO language", true) + '</div>';
  }

  /* Re-render every mounted AO viewer after a toggle-chip click. */
  function refreshAoViewers() {
    var i, nodes, el, id, found;
    nodes = mainEl ? mainEl.querySelectorAll('[data-panel="ao"]') : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el.hidden) continue;
      id = el.getAttribute("data-qid");
      found = findQuestion(id);
      if (found) el.innerHTML = aoHtml(found.question, valueOfAnswer(id));
    }
    nodes = mainEl ? mainEl.querySelectorAll("[data-live-highlight]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      id = el.getAttribute("data-live-highlight");
      found = findQuestion(id);
      if (found) el.innerHTML = aoViewerHtml(found.question, valueOfAnswer(id), "Live Draft — AO Structure & Case Context Highlighter", true);
    }
    el = qs("[data-result-highlight]");
    if (el && state.evaluation) {
      found = findQuestion(state.evaluationId);
      el.innerHTML = aoViewerHtml(found ? found.question : {}, found ? valueOfAnswer(state.evaluationId) : "", "Your Submitted Response — Live AO Structure Analysis", true);
    }
  }

  /* Live AO2 facts badge shown directly below the answer textarea. */
  function aoBadgeHtml(q, draft) {
    var appWords = (q.qwen_marking_keys || {}).valid_app_words || [];
    if (!appWords.length) return "";
    var found = phrasesFound(appWords, String(draft || "").toLowerCase());
    var h = '<div class="flex flex-wrap items-center justify-between gap-2 pt-1" data-ao2-badge="1">' +
      '<div class="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">' +
      '<span class="px-2 py-0.5 rounded font-bold border ' +
      (found.length ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700') + '">' +
      found.length + ' AO2 Case Context Facts</span>';
    for (var i = 0; i < Math.min(4, found.length); i++) {
      h += '<span class="px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-[10px]">' + esc(found[i]) + '</span>';
    }
    h += '</div>';
    if (String(draft || "").trim()) {
      h += '<button type="button" data-action="toggle-live-highlight" class="text-[11px] font-mono font-semibold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer">' +
        (state.liveHighlight ? "Hide Live AO Highlighter" : "Show Live AO Highlighter") + '</button>';
    }
    return h + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* HTML rendering — original PracticeStudio presentation classes       */
  /* ------------------------------------------------------------------ */
  function sectionButton(value, label) {
    var numLabel = value === "all" ? "All" : (value.length === 1 ? "0" + value : value);
    return '<button type="button" class="study-section-button" data-action="set-unit" data-unit="' + esc(value) +
      '" aria-pressed="' + (state.unit === value ? 'true' : 'false') + '"><span>' + esc(numLabel) +
      '</span>' + esc(label) + '</button>';
  }

  /* ------------------------------------------------------------------ */
  /* ExamLayoutPicker                                                     */
  /* ------------------------------------------------------------------ */
  function layoutPickerHtml() {
    function opt(value, title, svg) {
      var on = state.layout === value;
      return '<button type="button" data-action="set-layout" data-value="' + value + '" aria-pressed="' +
        (on ? 'true' : 'false') + '" title="' + title + '" aria-label="' + title +
        '" class="p-1.5 rounded-md cursor-pointer ' +
        (on ? 'bg-[#0F2042] text-white dark:bg-white dark:text-black' : 'text-[var(--surface-muted)] hover:bg-black/5 dark:hover:bg-white/10') +
        '">' + icon(svg, 'w-3.5 h-3.5') + '</button>';
    }
    return '<div class="flex items-center gap-2">' +
      '<span class="hidden sm:inline text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--surface-muted)]">Layout</span>' +
      '<div role="group" aria-label="Case study layout" class="flex items-center gap-0.5 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-soft)] p-0.5">' +
      opt("stacked", "Text at top, question below", ICON.rows) +
      opt("columns", "Text left, question right", ICON.columns) +
      '</div></div>';
  }

  /* ------------------------------------------------------------------ */
  /* Assessment results — full EC.autoMark object, never normalised away  */
  /* ------------------------------------------------------------------ */
  function cloneObj(v) {
    try { return JSON.parse(JSON.stringify(v)); } catch (e) { return v; }
  }
  function stringArray(v) {
    var out = [], i;
    if (Array.isArray(v)) {
      for (i = 0; i < v.length; i++) out.push(String(v[i] == null ? "" : v[i]));
    } else if (v) out.push(String(v));
    return out;
  }

  function normalizeFullResult(r, found) {
    var max = found ? num(found.question.mark_value, 0) : 8;
    if (!r || typeof r !== "object") r = {};
    var rawScore = r.totalScore != null ? r.totalScore : (r.score != null ? r.score : r.mark);
    var score = Math.max(0, Math.min(max, num(rawScore, 0)));
    var bd = r.aoBreakdown || {};
    function ao(key) {
      var a = (bd && bd[key]) || {};
      return {
        score: num(a.score, 0),
        max: num(a.max, 0),
        feedback: String(a.feedback || "")
      };
    }
    var result = {
      totalScore: score,
      maxMarks: r.maxMarks != null ? num(r.maxMarks, max) : max,
      percentage: r.percentage != null ? num(r.percentage, 0) : (max ? Math.round(score / max * 100) : 0),
      level: String(r.level || ""),
      levelDescription: String(r.levelDescription || ""),
      requirementToLevel3: String(r.requirementToLevel3 || ""),
      questionType: String(r.questionType || ""),
      isAiEvaluated: !!r.isAiEvaluated,
      examinerNotes: String(r.examinerNotes || r.feedback || ""),
      modelAnswerSnippet: String(r.modelAnswerSnippet || (found && found.question.model_answer) || ""),
      aoBreakdown: { ao1: ao("ao1"), ao2: ao("ao2"), ao3: ao("ao3"), ao4: ao("ao4") },
      strengths: stringArray(r.strengths),
      improvements: stringArray(r.improvements),
      examinerNotesRaw: r.examinerNotes || "",
      ruleEnforcement: r.ruleEnforcement || null,
      paragraphAudits: Array.isArray(r.paragraphAudits) ? r.paragraphAudits : [],
      manualOverride: r.manualOverride || null,
      evaluatedAt: String(r.evaluatedAt || new Date().toISOString())
    };
    if (!result.level) result.level = score === 0 ? "Level 0 (0 marks)" : "Level " + (score / Math.max(1, max) >= 0.75 ? "3" : score / Math.max(1, max) >= 0.4 ? "2" : "1");
    return result;
  }

  function callAutoMark(found, answer, done) {
    var hook = window.EC && window.EC.autoMark;
    if (typeof hook !== "function") { done(null); return; }
    var sc = found.scenario, q = found.question, vq = sc.verified || {};
    var payload = {
      questionId: found.id || qid(sc.scenario_id, q.part),
      scenarioId: sc.scenario_id,
      part: q.part,
      unit: sc.unit,
      markValue: q.mark_value,
      mark_value: q.mark_value,
      questionText: q.question_text,
      question_text: q.question_text,
      caseStem: sc.scenario_stem,
      caseMainStem: sc.scenario_stem,
      answer: answer,
      markScheme: q.mark_scheme,
      mark_scheme: q.mark_scheme,
      validAppWords: (q.qwen_marking_keys || {}).valid_app_words || [],
      qwen_marking_keys: q.qwen_marking_keys || {},
      modelAnswer: q.model_answer,
      model_answer: q.model_answer,
      indicativeKnowledgePoints: (q.mark_scheme || {}).knowledge_max_2 || [],
      paper: state.mode === "paper2" ? 2 : num(vq.paper, 1)
    };
    var r;
    try { r = hook(payload); } catch (e) { done(null); return; }
    if (r && typeof r.then === "function") {
      r.then(function (value) { done(value || null); }, function () { done(null); });
    } else done(r || null);
  }

  /* Deterministic local fallback so the full drawer still works if the
     optional EC.autoMark hook is unavailable. */
  function buildLocalEvaluation(found, answer) {
    var det = instantFeedback(found.question, answer);
    var max = num(found.question.mark_value, 0);
    var caps = [2, max >= 4 ? 2 : 0, max >= 6 ? 2 : 0, max >= 8 ? 2 : 0];
    var score = det.score;
    var k = Math.min(caps[0], score);
    var rest = score - k;
    var a2 = Math.min(caps[1], rest); rest -= a2;
    var a3 = Math.min(caps[2], rest); rest -= a3;
    var a4 = Math.min(caps[3], rest);
    return {
      totalScore: score,
      maxMarks: max,
      percentage: max ? Math.round(score / max * 100) : 0,
      level: score === 0 ? "Level 0 (0 marks)" : "Level " + (score / Math.max(1, max) >= 0.75 ? "3" : "2"),
      isAiEvaluated: false,
      questionType: max === 2 ? "paper1_2m" : "website_rules",
      examinerNotes: "[ Cambridge 0264 Examiner ] " + det.points[det.points.length - 1],
      modelAnswerSnippet: found.question.model_answer || "",
      aoBreakdown: {
        ao1: { score: k, max: caps[0], feedback: "Syllabus knowledge detected against the mark scheme." },
        ao2: { score: a2, max: caps[1], feedback: a2 ? "Case-specific facts detected." : "No case-specific application detected." },
        ao3: { score: a3, max: caps[2], feedback: a3 ? "Causal chain detected." : "No developed causal chain." },
        ao4: { score: a4, max: caps[3], feedback: a4 ? "Judgement phrase detected." : "No evaluative judgement detected." }
      },
      strengths: [det.points[1]].concat(a2 ? [det.points[2] || ""] : []).filter(Boolean),
      improvements: det.points.slice(2, 5),
      ruleEnforcement: {
        appWordsRequired: (found.question.qwen_marking_keys || {}).valid_app_words || [],
        appWordsFound: [],
        appWordsPassed: a2 > 0,
        ao2CappedToZero: caps[1] > 0 && a2 === 0,
        evalWordRequired: caps[3] > 0,
        evalWordsFound: [],
        evalWordPassed: a4 > 0,
        ao4CappedToZero: caps[3] > 0 && a4 === 0,
        ruleNotes: []
      },
      paragraphAudits: [],
      manualOverride: null,
      evaluatedAt: new Date().toISOString()
    };
  }

  function saveSubmissionRecord(found, id, answer, result) {
    var vq = found.scenario.verified || {};
    var paper = state.mode === "paper2" ? 2 : (state.mode === "verified" ? num(vq.paper, 1) : 1);
    var syllabus = state.mode === "verified" ? String(vq.syllabus || "0264") : "0264";
    var record = {
      id: state.lastSubmissionId || ("sub-" + Date.now()),
      questionId: id,
      questionTitle: found.scenario.scenario_id + " Part (" + String(found.question.part).toUpperCase() + ")",
      marks: result.maxMarks,
      paper: paper,
      syllabus: syllabus,
      unit: found.scenario.unit,
      studentAnswer: answer,
      wordCount: wordCount(answer),
      timeSpentSeconds: state.timerSeconds,
      result: cloneObj(result),
      timestamp: new Date().toISOString()
    };
    var all = getSubmissions(), i, kept = [];
    for (i = 0; i < all.length; i++) {
      if (all[i] && all[i].id !== record.id) kept.push(all[i]);
    }
    kept.unshift(record);
    if (kept.length > 100) kept.length = 100;
    store.set("submissions", kept);
    var done = store.get("completed_questions", []);
    if (!Array.isArray(done)) done = [];
    if (done.indexOf(id) < 0) done.push(id);
    store.set("completed_questions", done);
  }

  function submitForAssessment(id) {
    var found = findQuestion(id);
    if (!found) return;
    var answer = valueOfAnswer(id);
    if (!String(answer || "").trim()) return;
    if (state.timerRunning) toggleTimer();
    callAutoMark(found, answer, function (raw) {
      var result = normalizeFullResult(raw || buildLocalEvaluation(found, answer), found);
      state.evaluation = result;
      state.originalEvaluation = cloneObj(result);
      state.evaluationId = id;
      state.lastSubmissionId = "sub-" + Date.now();
      state.lastCoins = 20 + Math.max(5, result.totalScore * 5);
      if (typeof EC.earnPoints === "function") EC.earnPoints(state.lastCoins);
      if (result.percentage >= 70) celebrate({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      saveSubmissionRecord(found, id, answer, result);
      var prog = qs("#p1-progress");
      if (prog) prog.innerHTML = progressInner(found.scenario, submissionMap());
      renderResults();
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () {
          var box = qs("#p1-results");
          if (box && box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    });
  }

  function isTwoMarkKnowledgeOnly() {
    var r = state.evaluation;
    return !!(r && (num(r.maxMarks, 0) === 2 || r.questionType === "paper1_2m"));
  }

  function resultRuleCards(r) {
    var re = r.ruleEnforcement || {};
    if (!re || isTwoMarkKnowledgeOnly()) return "";
    var h = '<div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">' +
      '<strong class="text-slate-900 dark:text-slate-100 block font-mono text-[11px] uppercase tracking-wider">Website Code Rules Enforcement Audit:</strong>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">';
    var required = stringArray(re.appWordsRequired);
    var appCls = !required.length
      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      : re.appWordsPassed
        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200';
    h += '<div class="p-3 rounded-lg border ' + appCls + '"><div class="font-bold flex items-center justify-between"><span>AO2 Application Keyword Scan:</span><span>' +
      (!required.length ? 'N/A (Pure Definition)' : re.appWordsPassed ? '✓ Rule Passed' : '✕ Capped to 0') + '</span></div><div class="mt-1 text-[11px]">' +
      (!required.length ? 'No application words required for this mark tier.'
        : re.appWordsPassed
          ? 'Found case keywords: <strong class="font-mono">[' + esc(stringArray(re.appWordsFound).join(", ")) + ']</strong>. Awarded AO2 application marks (' +
            num(r.aoBreakdown.ao2.score, 0) + '/' + num(r.aoBreakdown.ao2.max, 0) + ').'
          : 'Required words missing (' + esc(required.slice(0, 4).join(", ")) + '). <strong>Application score automatically set to 0.</strong>') +
      '</div></div>';
    if (re.evalWordRequired) {
      var passed = !!re.evalWordPassed && num(r.aoBreakdown.ao4.score, 0) > 0;
      var evalCls = passed
        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
        : re.evalWordPassed
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200';
      h += '<div class="p-3 rounded-lg border ' + evalCls + '"><div class="font-bold flex items-center justify-between"><span>AO4 Evaluation Judgment Scan:</span><span>' +
        (passed ? '✓ Rule Passed (' + num(r.aoBreakdown.ao4.score, 0) + '/' + num(r.aoBreakdown.ao4.max, 0) + ')'
          : re.evalWordPassed ? 'Needs Justification (0/' + num(r.aoBreakdown.ao4.max, 0) + ')' : '✕ Capped to 0') +
        '</span></div><div class="mt-1 text-[11px]">' +
        (passed
          ? 'Found judgment phrasing: <strong class="font-mono">[' + esc(stringArray(re.evalWordsFound).join(", ")) + ']</strong>. Awarded ' +
            num(r.aoBreakdown.ao4.score, 0) + '/' + num(r.aoBreakdown.ao4.max, 0) + ' AO4 evaluation marks.'
          : re.evalWordPassed
            ? 'Found phrasing <strong class="font-mono">[' + esc(stringArray(re.evalWordsFound).join(", ")) + ']</strong>, but more developed trade-off justification is needed to earn AO4 marks (0/' + num(r.aoBreakdown.ao4.max, 0) + ').'
            : 'No evaluative judgment phrasing found. <strong>Evaluation score automatically capped at 0.</strong>') +
        '</div></div>';
    } else {
      h += '<div class="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300">' +
        '<div class="font-bold">Interpretation Status:</div><div class="mt-1 text-[11px]">' +
        'Core business concept understanding interpreted and combined with rule scan to compute total score.</div></div>';
    }
    var notes = stringArray(re.ruleNotes);
    if (notes.length) {
      h += '<div class="sm:col-span-2 text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">';
      for (var i = 0; i < notes.length; i++) h += '<div>• ' + esc(notes[i]) + '</div>';
      h += '</div>';
    }
    return h + '</div></div>';
  }

  function resultAoCards(r) {
    var two = isTwoMarkKnowledgeOnly();
    var h = '<div class="grid gap-3 font-mono text-xs ' + (two ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-4') + '">';
    var defs = [
      ['ao1', 'AO1 Knowledge', 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'],
      ['ao2', 'AO2 Application', 'bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900'],
      ['ao3', 'AO3 Analysis', 'bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900'],
      ['ao4', 'AO4 Evaluation', 'bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900']
    ];
    for (var i = 0; i < defs.length; i++) {
      if (two && i > 0) break;
      var key = defs[i][0], a = r.aoBreakdown[key] || { score: 0, max: 0, feedback: "" };
      var capped = (key === "ao2" && r.ruleEnforcement && r.ruleEnforcement.ao2CappedToZero) ||
        (key === "ao4" && r.ruleEnforcement && r.ruleEnforcement.ao4CappedToZero);
      h += '<div class="p-3 ' + defs[i][2] + '">' +
        '<div class="flex items-center justify-between"><span class="text-[10px] text-slate-500 block">' + defs[i][1] + '</span>' +
        (capped && num(a.max, 0) > 0 ? '<span class="text-[9px] font-bold text-rose-600 uppercase">Capped</span>' : '') + '</div>' +
        '<strong class="text-lg text-slate-800 dark:text-slate-200">' + num(a.score, 0) + ' / ' + num(a.max, 0) + '</strong>' +
        '<p class="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1">' + esc(a.feedback) + '</p></div>';
    }
    return h + '</div>';
  }

  function resultAuditHtml(r) {
    var audits = r.paragraphAudits || [];
    if (!audits.length) return "";
    var h = '<div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
      '<strong class="text-slate-900 dark:text-slate-100 font-mono text-[11px] uppercase tracking-wider">Cambridge 0264 Anti-Halo Paragraph Isolation Audit</strong>' +
      '<span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">Evaluated in vacuum · Total = Σ paragraph subtotals</span></div><div class="space-y-2.5">';
    for (var i = 0; i < audits.length; i++) {
      var p = audits[i] || {};
      var role = String(p.role || "body");
      var roleLabel = role === "conclusion" ? "Conclusion" : role === "option" ? "Option" : "Body Point";
      var bad = !!p.is_duplicate || num(p.subtotal, 0) === 0;
      var good = !bad && p.max_subtotal && num(p.subtotal, 0) >= num(p.max_subtotal, 0);
      h += '<div class="p-3 rounded-lg border space-y-1.5 ' +
        (bad ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
          : good ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                 : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-slate-800') + '">' +
        '<div class="flex flex-wrap items-center justify-between gap-2"><div class="flex flex-wrap items-center gap-2">' +
        '<span class="font-mono font-bold text-slate-900 dark:text-slate-100">Paragraph ' + esc(p.paragraph_number) + '</span>' +
        '<span class="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase">' + roleLabel + '</span>' +
        (p.is_duplicate ? '<span class="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/70 text-rose-900 dark:text-rose-200 font-mono text-[10px] font-bold">Duplicate (0 marks)</span>' : '') +
        '</div><div class="flex flex-wrap items-center gap-2 font-mono text-[11px]">' +
        (isTwoMarkKnowledgeOnly()
          ? '<span class="text-slate-700 dark:text-slate-300">K: ' + esc(p.k_score) + '/' + (p.max_subtotal != null ? esc(p.max_subtotal) : "2") + '</span>'
          : role === "conclusion"
            ? '<span class="text-slate-700 dark:text-slate-300">Eval: ' + esc(p.eval_score != null ? p.eval_score : 0) + '/' + (p.max_subtotal != null ? esc(p.max_subtotal) : "2") + '</span>'
            : '<span class="text-slate-700 dark:text-slate-300">K:' + esc(p.k_score) + ' · App:' + esc(p.app_score) +
              (num(r.aoBreakdown.ao3.max, 0) > 0 ? ' · An:' + esc(p.an_score) : '') + '</span>') +
        '<span class="px-2 py-0.5 rounded bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black font-bold">' +
        esc(p.subtotal) + '/' + (p.max_subtotal != null ? esc(p.max_subtotal) : "3") + '</span></div></div>' +
        (p.isolated_quote ? '<blockquote class="text-[11px] italic text-slate-600 dark:text-slate-400 border-l-2 border-slate-300 dark:border-slate-700 pl-2.5 line-clamp-3">"' + esc(p.isolated_quote) + '"</blockquote>' : '') +
        '<p class="text-[11px] font-sans text-slate-800 dark:text-slate-200">' + esc(p.critique) + '</p></div>';
    }
    return h + '</div></div>';
  }

  function resultsHtml() {
    var r = state.evaluation;
    if (!r) return "";
    var found = findQuestion(state.evaluationId);
    var q = found ? found.question : { model_answer: r.modelAnswerSnippet, qwen_marking_keys: {} };
    var ov = r.manualOverride || {};
    var h = '<div class="mt-8 bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-white rounded-2xl p-6 lg:p-8 shadow-md space-y-6">';
    h += '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4] dark:border-neutral-800"><div>' +
      '<div class="flex flex-wrap items-center gap-2">' +
      '<span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Cambridge Assessment Score Result</span>' +
      (state.lastCoins ? '<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-500/30 shadow-xs animate-bounce">✦ +' + num(state.lastCoins, 0) + ' GIS Points Earned!</span>' : '') +
      (ov.isOverridden ? '<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-500/30">⚖️ Manual Override Applied ' + (ov.bodApplied ? '(+BOD)' : '') + '</span>' : '') +
      '</div>' +
      '<h3 class="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white mt-1">Score: ' + num(r.totalScore, 0) + ' / ' + num(r.maxMarks, 0) + ' Marks (' + num(r.percentage, 0) + '%)</h3>' +
      '<p class="text-xs text-[#57534E] dark:text-neutral-400 mt-1 font-mono">' + esc(r.examinerNotes) + '</p>' +
      (r.level ? '<span class="inline-block mt-2 px-2 py-0.5 rounded bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black text-[11px] font-bold">' + esc(r.level) + '</span>' : '') +
      (ov.isOverridden ? '<div class="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-2.5 font-sans">' +
        '<strong>Examiner Justification:</strong> ' + esc(ov.reason) +
        '<span class="text-neutral-400 dark:text-neutral-500 ml-2">(AI original: ' + esc(ov.originalScore) + '/' + num(r.maxMarks, 0) + ')</span></div>' : '') +
      '</div><div class="flex flex-wrap items-center gap-2">' +
      '<button type="button" data-action="open-override" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer" title="Override AI marks, award BOD (Benefit of the Doubt), or adjust score"><span>⚖️ Override / BOD Mark</span></button>' +
      '<span class="px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 text-xs font-mono font-bold text-[#0F2042] dark:text-white">' +
      (r.isAiEvaluated ? 'Evaluated with ' + AI_MODEL_LABEL + ' Local AI' : 'Website Rules + CIE Examiner') +
      (!r.isAiEvaluated && (EC.ai && EC.ai.isReady && EC.ai.isReady()) ? ' · Local AI ready' : '') + '</span></div></div>';
    h += resultRuleCards(r) + resultAoCards(r) + resultAuditHtml(r);
    h += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">' +
      '<div class="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1.5">' +
      '<strong class="text-emerald-900 dark:text-emerald-200 block text-[11px] font-mono uppercase">Demonstrated Strengths:</strong><ul class="space-y-1 text-emerald-800 dark:text-emerald-300">';
    var strengths = r.strengths.length ? r.strengths : ["No specific strengths detected in this response."];
    for (var i = 0; i < strengths.length; i++) h += '<li class="flex items-start gap-1.5"><span>✓</span><span>' + esc(strengths[i]) + '</span></li>';
    h += '</ul></div><div class="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1.5">' +
      '<strong class="text-amber-900 dark:text-amber-200 block text-[11px] font-mono uppercase">Key Improvements to Access Higher Mark Band:</strong><ul class="space-y-1 text-amber-800 dark:text-amber-300">';
    var improvements = r.improvements.length ? r.improvements : ["Add developed case-specific reasoning to reach the next mark band."];
    for (i = 0; i < improvements.length; i++) h += '<li class="flex items-start gap-1.5"><span>→</span><span>' + esc(improvements[i]) + '</span></li>';
    h += '</ul></div></div>';
    h += '<div class="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">' +
      '<div class="flex items-center justify-between"><button type="button" data-action="toggle-result-highlight" class="px-3.5 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">' +
      '<span>' + (state.liveHighlight ? '▼ Hide' : '▶ Inspect') + ' Student Answer AO Highlighting</span>' +
      '<span class="text-[10px] font-mono opacity-80">(AO1, AO2, AO3, AO4)</span></button>' +
      '<span class="text-[11px] text-neutral-400 font-mono">Real-time Cambridge rubric color scanner</span></div>';
    if (state.liveHighlight) {
      var answer = found ? valueOfAnswer(state.evaluationId) : "";
      h += '<div data-result-highlight="1">' + aoViewerHtml(q, answer, "Your Submitted Response — Live AO Structure Analysis", true) + '</div>';
    }
    h += '</div>';
    h += aoViewerHtml(q, r.modelAnswerSnippet || "", "Official Cambridge Model Answer Outline", false);
    return h + '</div>';
  }

  function renderResults() {
    var el = qs("#p1-results");
    if (el) el.innerHTML = resultsHtml();
  }

  /* ------------------------------------------------------------------ */
  /* Modal dialogs — flag report, mark override, factors diagram          */
  /* ------------------------------------------------------------------ */
  function flagDialogHtml() {
    var id = state.flagOpen;
    if (!id) return "";
    var h = '<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">' +
      '<button type="button" aria-label="Close report dialog" class="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-pointer" data-action="close-dialog"></button>' +
      '<div role="dialog" aria-modal="true" aria-labelledby="flag-question-title" class="relative m-0 w-full max-w-md rounded-t-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:m-4 sm:rounded-2xl">' +
      '<div class="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">' +
      '<h3 id="flag-question-title" class="flex items-center gap-2 font-academic-serif text-base font-bold text-[var(--green)] dark:text-white">' + icon(ICON.flag, 'h-4 w-4') + ' Flag question locally</h3>' +
      '<button type="button" data-action="close-dialog" aria-label="Close" class="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 cursor-pointer">✕</button></div>' +
      '<p class="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">' + esc(id) + '</p>' +
      '<p class="mt-2 text-xs text-neutral-600 dark:text-neutral-300">This note is saved in this browser for your reference.</p>' +
      '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">What\'s wrong?</legend>' +
      '<div class="mt-1.5 grid grid-cols-2 gap-1.5">';
    for (var i = 0; i < FLAG_REASONS.length; i++) {
      var sel = state.flagReason === FLAG_REASONS[i];
      h += '<button type="button" data-action="flag-reason" data-value="' + esc(FLAG_REASONS[i]) + '" aria-pressed="' + (sel ? 'true' : 'false') + '" ' +
        'class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-all ' +
        (sel ? 'border-[var(--green)] bg-[var(--green)] text-white dark:border-[#38BDF8] dark:bg-[#38BDF8] dark:text-[#0F172A]'
             : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200') + '">' + esc(FLAG_REASONS[i]) + '</button>';
    }
    h += '</div></fieldset>' +
      '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">How sure are you?</legend>' +
      '<div class="mt-1.5 inline-flex w-full rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800" role="radiogroup" aria-label="Confidence level">';
    for (i = 0; i < FLAG_CONFIDENCES.length; i++) {
      var csel = state.flagConfidence === FLAG_CONFIDENCES[i];
      h += '<button type="button" role="radio" aria-checked="' + (csel ? 'true' : 'false') + '" data-action="flag-confidence" data-value="' + esc(FLAG_CONFIDENCES[i]) + '" ' +
        'class="flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all cursor-pointer ' +
        (csel ? 'bg-white text-[var(--green)] shadow-sm dark:bg-neutral-900 dark:text-[#38BDF8]' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200') + '">' + esc(FLAG_CONFIDENCES[i]) + '</button>';
    }
    h += '</div></fieldset>' +
      '<label class="mt-3 block text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400" for="flag-note">Note (optional)</label>' +
      '<textarea id="flag-note" data-action="flag-note" rows="2" maxlength="240" placeholder="What exactly is wrong? e.g. option B and the mark scheme disagree about the formula…" ' +
      'class="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[var(--green)] focus:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">' + esc(state.flagNote) + '</textarea>' +
      '<div class="mt-4 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">' +
      '<span class="font-mono text-[10px] text-neutral-400" data-flag-count>' + String(state.flagNote).length + '/240</span>' +
      '<div class="flex items-center gap-2"><button type="button" data-action="close-dialog" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer">Cancel</button>' +
      '<button type="button" data-action="save-flag" data-qid="' + esc(id) + '" class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--green)] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90 cursor-pointer">' + icon(ICON.flag, 'h-3.5 w-3.5') + ' Save on this device</button></div></div>' +
      '</div></div>';
    return h;
  }

  function overrideDialogHtml() {
    if (!state.overrideOpen || !state.evaluation) return "";
    var r = state.evaluation, f = state.overrideForm || {};
    var max = num(r.maxMarks, 0);
    var score = Math.max(0, Math.min(max, num(f.score, r.totalScore)));
    var reasons = [
      ["BOD (Benefit of Doubt)", "Plausible contextual phrasing that AI didn't catch"],
      ["Valid Alternative", "Mark scheme explicitly accepts 'other valid answers'"],
      ["Case Context Present", "Student applied scenario facts that AI missed"],
      ["Clear Cause & Effect", "Analysis link (AO3) is coherent despite non-standard wording"]
    ];
    var h = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="presentation">' +
      '<div role="dialog" aria-modal="true" aria-labelledby="override-title" class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">' +
      '<div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">' +
      '<div class="flex items-center gap-2.5"><span class="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-lg font-bold">⚖️</span><div>' +
      '<h3 id="override-title" class="font-bold text-neutral-900 dark:text-white text-base">Manual Mark Override &amp; BOD Credit</h3>' +
      '<p class="text-xs text-neutral-500 dark:text-neutral-400">Correct AI under-marking, award examiner BOD, or adjust marks</p></div></div>' +
      '<button type="button" data-action="close-dialog" aria-label="Close" class="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-lg leading-none cursor-pointer">×</button></div>' +
      '<div class="p-6 overflow-y-auto space-y-5 text-sm">' +
      '<div class="grid grid-cols-2 gap-3 p-3.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60">' +
      '<div><div class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Original AI Mark</div><div class="text-2xl font-extrabold text-neutral-800 dark:text-neutral-200">' + num(state.originalEvaluation ? state.originalEvaluation.totalScore : r.totalScore, 0) + ' <span class="text-xs font-normal text-neutral-400">/ ' + max + '</span></div></div>' +
      '<div><div class="text-xs text-amber-600 dark:text-amber-400 font-medium">New Adjusted Mark</div><div class="text-2xl font-extrabold text-amber-600 dark:text-amber-400">' + score + ' <span class="text-xs font-normal text-amber-500/70">/ ' + max + '</span>' +
      (f.bod ? '<span class="ml-2 text-xs font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">BOD</span>' : '') + '</div></div></div>' +
      '<div class="space-y-2"><div class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Quick Mark Actions</div><div class="flex flex-wrap gap-2">' +
      '<button type="button" data-action="override-bod" class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"><span>➕ +1 Mark BOD</span><span class="text-[10px] bg-black/20 px-1.5 py-0.2 rounded font-mono">Examiner Discretion</span></button>' +
      '<button type="button" data-action="override-full" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer">💯 Award Full Marks (' + max + '/' + max + ')</button>' +
      (r.manualOverride && r.manualOverride.isOverridden ? '<button type="button" data-action="override-reset" class="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold cursor-pointer">↺ Reset to AI Mark</button>' : '') +
      '</div></div>' +
      '<div class="space-y-2"><div class="flex items-center justify-between"><label class="font-semibold text-neutral-800 dark:text-neutral-200">Adjusted Total Score:</label>' +
      '<div class="flex items-center gap-2"><input type="number" min="0" max="' + max + '" data-action="override-score-num" value="' + score + '" class="w-16 px-2 py-1 text-center font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg">' +
      '<span class="text-neutral-500">/ ' + max + '</span></div></div>' +
      '<input type="range" min="0" max="' + max + '" data-action="override-score" value="' + score + '" class="w-full accent-amber-500 cursor-pointer"></div>' +
      '<div class="pt-1"><button type="button" data-action="override-detailed" class="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">' +
      '<span>' + (f.detailed ? '▼ Hide Detailed AO Breakdown' : '▶ Customize AO1 / AO2 / AO3 / AO4 Marks Individually') + '</span></button>';
    if (f.detailed) {
      h += '<div class="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2.5"><div class="grid grid-cols-2 gap-3 text-xs">';
      var keys = ["ao1", "ao2", "ao3", "ao4"];
      var names = ["AO1 Knowledge", "AO2 Application", "AO3 Analysis", "AO4 Evaluation"];
      for (var j = 0; j < keys.length; j++) {
        var a = r.aoBreakdown[keys[j]] || { max: 0 };
        if (j === 3 && !num(a.max, 0)) continue;
        h += '<div><label class="text-neutral-600 dark:text-neutral-300 font-medium block mb-1">' + names[j] + ' (' + num(a.max, 0) + ' max):</label>' +
          '<input type="number" min="0" max="' + num(a.max, 0) + '" data-action="override-ao" data-ao="' + keys[j] + '" value="' + num(f.ao && f.ao[keys[j]], 0) + '" class="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"></div>';
      }
      h += '</div></div>';
    }
    h += '</div><div class="space-y-2"><label class="font-semibold text-neutral-800 dark:text-neutral-200 block text-xs uppercase tracking-wider">Reason / Cambridge Marking Justification</label><div class="grid grid-cols-2 gap-1.5">';
    for (j = 0; j < reasons.length; j++) {
      h += '<button type="button" data-action="override-reason-preset" data-value="' + esc(reasons[j][0] + ": " + reasons[j][1]) + '" class="text-left p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-neutral-800/40 text-xs transition">' +
        '<div class="font-semibold text-neutral-800 dark:text-neutral-200">' + esc(reasons[j][0]) + '</div><div class="text-[11px] text-neutral-500 dark:text-neutral-400">' + esc(reasons[j][1]) + '</div></button>';
    }
    h += '</div><textarea rows="2" data-action="override-reason" placeholder="Why is this mark adjustment justified?" class="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white text-xs">' + esc(f.reason || "") + '</textarea></div>' +
      '<div class="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">' +
      '<button type="button" data-action="close-dialog" class="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer">Cancel</button>' +
      '<button type="button" data-action="apply-override" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"><span>Save &amp; Apply Score</span><span>✓</span></button></div>' +
      '</div></div></div>';
    return h;
  }

  function factorsDialogHtml() {
    if (!state.factorsOpen) return "";
    var items = {
      land: ["🏞️", "Land", "Rent", "Natural resources provided by Earth", "Agricultural land and forests; mineral deposits; water bodies; solar and wind sites."],
      labour: ["👷", "Labour", "Wages & Salaries", "Human physical and mental productive effort", "Skilled professionals; assembly workers; teachers, pilots and drivers; software engineers."],
      capital: ["🏭", "Capital", "Interest", "Man-made goods used to produce other goods", "Machinery and robots; delivery fleets; factories and offices; servers and tools."],
      enterprise: ["🚀", "Enterprise", "Profit", "Risk-taking, innovation and coordination", "Entrepreneurs spotting market gaps; innovators; small business owners; franchisors."]
    };
    var cur = items[state.factorsSelected] || items.land;
    var h = '<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto" role="presentation">' +
      '<div role="dialog" aria-modal="true" aria-labelledby="factors-title" class="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl">' +
      '<div class="bg-[#0F2042] dark:bg-black text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="flex items-center gap-2">' +
      '<span class="px-2 py-0.5 rounded bg-emerald-500 text-[#0F172A] text-[10px] font-mono font-bold uppercase tracking-wider">Cambridge Syllabus Core 1.1 / Unit 1</span>' +
      '<span class="text-xs text-blue-200 font-mono hidden sm:inline">Syllabus 0264</span></div>' +
      '<h2 id="factors-title" class="font-academic-serif text-xl sm:text-2xl font-bold text-white mt-0.5">The 4 Factors of Production &amp; Factor Rewards</h2></div>' +
      '<div class="flex items-center gap-2"><div class="flex items-center p-1 rounded-lg bg-white/10 text-xs font-medium">' +
      '<button type="button" data-action="factors-tab" data-value="factors" class="px-3 py-1.5 rounded-md cursor-pointer ' + (state.factorsTab === "factors" ? 'bg-white text-[#0F2042] font-bold shadow-xs' : 'text-blue-100 hover:text-white') + '">Factors &amp; Rewards</button>' +
      '<button type="button" data-action="factors-tab" data-value="circular" class="px-3 py-1.5 rounded-md cursor-pointer ' + (state.factorsTab === "circular" ? 'bg-white text-[#0F2042] font-bold shadow-xs' : 'text-blue-100 hover:text-white') + '">Flow Diagram</button></div>' +
      '<button type="button" data-action="close-dialog" title="Close Diagram" aria-label="Close" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer text-sm">✕</button></div></div>' +
      '<div class="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">';
    if (state.factorsTab === "factors") {
      h += '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">';
      var keys = ["land", "labour", "capital", "enterprise"];
      for (var k = 0; k < keys.length; k++) {
        var item = items[keys[k]];
        h += '<button type="button" data-action="factors-select" data-value="' + keys[k] + '" class="p-4 rounded-xl border text-left cursor-pointer ' +
          (state.factorsSelected === keys[k] ? 'border-[#0F2042] dark:border-[#38BDF8] bg-slate-50 dark:bg-neutral-800 shadow-md' : 'border-slate-200 dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black') + '">' +
          '<div class="text-2xl">' + item[0] + '</div><h3 class="font-academic-serif font-bold text-base text-[#0F2042] dark:text-white">' + item[1] + '</h3>' +
          '<div class="text-[11px] font-mono text-slate-500">Reward: ' + item[2] + '</div></button>';
      }
      h += '</div><div class="bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3">' +
        '<div class="flex items-center gap-3"><span class="text-3xl">' + cur[0] + '</span><div><h3 class="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white">' + cur[1] + ' · <span class="text-blue-600 dark:text-blue-400">Reward: ' + cur[2] + '</span></h3>' +
        '<p class="text-xs text-[#78716C] dark:text-neutral-400">' + cur[3] + '</p></div></div>' +
        '<div class="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"><span class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Cambridge Textbook Definition:</span>' +
        '<p class="font-academic-serif text-sm text-[#1C1917] dark:text-neutral-100 leading-relaxed">' + esc(cur[3]) + '.</p></div>' +
        '<div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">' +
        '<div class="font-bold text-emerald-900 dark:text-emerald-200 mb-1">💰 Why is the Factor Reward called "' + esc(cur[2]) + '"?</div>' +
        '<p class="text-emerald-800/90 dark:text-emerald-300">' + esc(cur[4]) + '</p></div></div>';
    } else {
      h += '<div class="bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">' +
        '<h3 class="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white">Who supplies each factor, and what they are paid</h3>' +
        '<p class="text-xs text-[#57534E] dark:text-neutral-400">Households supply land, labour, capital and enterprise. Firms use them to produce goods and services, and pay rent, wages, interest and profit.</p>' +
        '<div class="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-2">' +
        '<div class="font-mono text-[11px] uppercase text-blue-700 dark:text-blue-300 font-bold">🏞️ Land → RENT · 👷 Labour → WAGES · 🏭 Capital → INTEREST · 🚀 Enterprise → PROFIT</div>' +
        '<p class="text-xs text-neutral-600 dark:text-neutral-400">Firms combine the four factors to produce output; factor rewards flow back to households as income.</p></div></div>';
    }
    return h + '</div></div></div>';
  }

  function renderDialogs() {
    var el = qs("#p1-dialogs");
    if (el) el.innerHTML = flagDialogHtml() + overrideDialogHtml() + factorsDialogHtml();
  }

  function startOverride() {
    if (!state.evaluation) return;
    var r = state.evaluation, bd = r.aoBreakdown || {};
    state.overrideForm = {
      score: r.totalScore,
      bod: !!(r.manualOverride && r.manualOverride.bodApplied),
      reason: r.manualOverride && r.manualOverride.reason ? r.manualOverride.reason : "Candidate demonstrated valid alternative reasoning per mark scheme guidance.",
      detailed: false,
      ao: { ao1: num(bd.ao1 && bd.ao1.score, 0), ao2: num(bd.ao2 && bd.ao2.score, 0), ao3: num(bd.ao3 && bd.ao3.score, 0), ao4: num(bd.ao4 && bd.ao4.score, 0) }
    };
    state.overrideOpen = true;
    syncDialogLock();
    renderDialogs();
  }

  function distributeOverrideScore(total) {
    var f = state.overrideForm;
    if (!f || !state.evaluation) return;
    var bd = state.evaluation.aoBreakdown;
    var a = {
      ao1: Math.min(num(bd.ao1.max, 0), num(f.ao.ao1, 0)),
      ao2: Math.min(num(bd.ao2.max, 0), num(f.ao.ao2, 0)),
      ao3: Math.min(num(bd.ao3.max, 0), num(f.ao.ao3, 0)),
      ao4: Math.min(num(bd.ao4.max, 0), num(f.ao.ao4, 0))
    };
    var sum = a.ao1 + a.ao2 + a.ao3 + a.ao4, guard = 0;
    while (sum < total && guard++ < 40) {
      if (a.ao3 < num(bd.ao3.max, 0)) { a.ao3++; sum++; }
      else if (a.ao2 < num(bd.ao2.max, 0)) { a.ao2++; sum++; }
      else if (a.ao1 < num(bd.ao1.max, 0)) { a.ao1++; sum++; }
      else if (a.ao4 < num(bd.ao4.max, 0)) { a.ao4++; sum++; }
      else break;
    }
    while (sum > total && guard++ < 40) {
      if (a.ao4 > 0) { a.ao4--; sum--; }
      else if (a.ao3 > 0) { a.ao3--; sum--; }
      else if (a.ao2 > 0) { a.ao2--; sum--; }
      else if (a.ao1 > 0) { a.ao1--; sum--; }
      else break;
    }
    f.ao = a;
    f.score = total;
  }

  function syncEvaluationSubmission(result) {
    if (!state.lastSubmissionId) return;
    var all = getSubmissions(), i;
    for (i = 0; i < all.length; i++) {
      if (all[i] && all[i].id === state.lastSubmissionId) {
        all[i].result = cloneObj(result);
        store.set("submissions", all);
        break;
      }
    }
  }

  function resetOverride() {
    if (!state.originalEvaluation) return;
    state.evaluation = cloneObj(state.originalEvaluation);
    syncEvaluationSubmission(state.evaluation);
    closeDialogs();
    renderResults();
  }

  function applyOverride() {
    if (!state.evaluation || !state.overrideForm) return;
    var r = state.evaluation, f = state.overrideForm;
    var max = num(r.maxMarks, 0);
    var newScore = Math.max(0, Math.min(max, num(f.score, r.totalScore)));
    var original = state.originalEvaluation ? num(state.originalEvaluation.totalScore, r.totalScore) : r.totalScore;
    var reason = String(f.reason || "Manual examiner override.");
    var override = {
      isOverridden: true,
      originalScore: original,
      newScore: newScore,
      reason: reason,
      bodApplied: !!f.bod,
      overriddenAt: new Date().toISOString(),
      customBreakdown: cloneObj(f.ao || {})
    };
    var bd = cloneObj(r.aoBreakdown);
    var keys = ["ao1", "ao2", "ao3", "ao4"];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], a = bd[k] || { score: 0, max: 0, feedback: "" };
      var target = num(override.customBreakdown[k], 0);
      if (target > num(a.score, 0)) {
        a.feedback = "Mark updated to " + target + "/" + num(a.max, 0) + " (" + (f.bod ? "BOD applied" : "Examiner override") + ").";
      }
      a.score = target;
      bd[k] = a;
    }
    var updated = cloneObj(r);
    updated.totalScore = newScore;
    updated.percentage = max ? Math.round(newScore / max * 100) : 0;
    updated.manualOverride = override;
    updated.aoBreakdown = bd;
    if (updated.ruleEnforcement) {
      updated.ruleEnforcement.ao2CappedToZero = num(bd.ao2.score, 0) > 0 ? false : !!updated.ruleEnforcement.ao2CappedToZero;
      updated.ruleEnforcement.ao4CappedToZero = num(bd.ao4.score, 0) > 0 ? false : !!updated.ruleEnforcement.ao4CappedToZero;
      var notes = stringArray(updated.ruleEnforcement.ruleNotes);
      notes.push(f.bod
        ? "[Examiner Discretion] +1 BOD awarded. Adjusted score: " + newScore + "/" + max + "."
        : "[Manual Override] Mark adjusted to " + newScore + "/" + max + ". Reason: " + reason);
      updated.ruleEnforcement.ruleNotes = notes;
    }
    state.evaluation = updated;
    syncEvaluationSubmission(updated);
    closeDialogs();
    renderResults();
  }

  function flagButtonHtml(id, flagged) {
    if (flagged) {
      return '<span role="status" class="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">' +
        icon(ICON.check, 'h-3 w-3') + ' Flagged locally</span>';
    }
    return '<button type="button" data-action="open-flag" data-qid="' + esc(id) + '" title="Save an issue note on this device" ' +
      'aria-haspopup="dialog" aria-expanded="' + (state.flagOpen === id ? 'true' : 'false') + '" ' +
      'class="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--line)] hover:bg-[var(--sheet-surface)] hover:text-[var(--ink)] cursor-pointer">' +
      icon(ICON.flag, 'h-3 w-3') + ' Flag issue</button>';
  }

  function vqMove(delta) {
    var list = verifiedFiltered();
    if (!list.length) return;
    clearEvaluation();
    state.vqIndex = (state.vqIndex + delta + list.length) % list.length;
    resetTimer();
    renderContent();
    updateCount();
  }

  function p2Move(delta) {
    var pool = p2QuestionPool();
    if (!pool.length) return;
    clearEvaluation();
    state.p2Index = (state.p2Index + delta + pool.length) % pool.length;
    resetTimer();
    renderContent();
    updateCount();
  }

  function setMode(mode) {
    if (state.mode === mode) return;
    clearEvaluation();
    state.mode = mode;
    state.activePart = "";
    state.vqIndex = 0;
    state.p2Index = 0;
    state.p2CaseIndex = 0;
    resetTimer();
    render();
    var names = [];
    if (mode !== "paper1") {
      if (!banks["verified-questions"]) names.push("verified-questions");
      if (!banks["verified-p1-cases"]) names.push("verified-p1-cases");
      if (mode === "paper2") {
        if (!banks["verified-p2-cases"]) names.push("verified-p2-cases");
        if (!banks["other-paper2-cases"]) names.push("other-paper2-cases");
      }
    }
    if (names.length) loadBanks(names, function () { render(); });
  }

  function loadingContentHtml(label) {
    return '<section class="study-case-panel"><div class="study-panel-header">' +
      '<p class="study-panel-kicker">Loading…</p><h2 class="study-panel-title">' + esc(label) + '</h2></div>' +
      '<div class="study-case-text">Loading the question bank from data/…</div></section>' +
      '<div class="study-paper-one-editor"><section class="study-answer">' +
      '<p class="text-sm text-slate-600 dark:text-slate-400">Loading questions…</p></section></div>';
  }

  function verifiedCount(code) {
    var all = verifiedAll(), n = 0, i, q;
    for (i = 0; i < all.length; i++) {
      q = all[i];
      if (code !== "all" && String(q.unit || "").indexOf("Unit " + code) < 0) continue;
      if (state.vqPaper !== "all" && num(q.paper, 0) !== num(state.vqPaper, 0)) continue;
      if (state.vqMark !== "all" && num(q.marks, 0) !== num(state.vqMark, 0)) continue;
      n++;
    }
    return n;
  }

  function renderVerifiedToolbar() {
    var sections = '<div><h2 class="study-panel-kicker">Topical filter</h2>' +
      '<div role="group" aria-label="Official past papers topical filter" class="study-sections">';
    var topics = [{ n: "all", label: "All Topics" }].concat(SECTIONS);
    for (var s = 0; s < topics.length; s++) {
      var t = topics[s];
      sections += '<button type="button" class="study-section-button" data-action="set-unit" data-unit="' + esc(t.n) +
        '" aria-pressed="' + (state.unit === t.n ? 'true' : 'false') + '">' +
        '<span>' + (t.n === "all" ? "All" : "0" + t.n) + '</span>' +
        '<div class="min-w-0 flex-1 flex items-center justify-between gap-1.5">' +
          '<strong class="font-semibold text-[12px] leading-tight truncate text-left">' + esc(t.label) + '</strong>' +
          '<small class="font-mono text-[10px] opacity-70 tabular-nums shrink-0">' + verifiedCount(t.n) + '</small>' +
        '</div></button>';
    }
    sections += '</div></div>';
    qs("#p1-sections").innerHTML = sections;

    var html = '<div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--sheet-surface)] px-4 py-3 text-xs">';
    html += '<div class="flex flex-wrap items-center gap-3">';
    html += '<div class="flex items-center gap-1" role="group" aria-label="Filter by paper">' +
      '<span class="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mr-1">Paper:</span>';
    var papers = ["all", 1, 2], i, on;
    for (i = 0; i < papers.length; i++) {
      on = String(state.vqPaper) === String(papers[i]);
      html += '<button type="button" data-action="set-vq-paper" data-value="' + esc(papers[i]) + '" aria-pressed="' +
        (on ? 'true' : 'false') + '" class="px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ' +
        (on ? 'bg-[var(--green)] text-white' : 'bg-[var(--white)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--practice-bg)]') + '">' +
        (papers[i] === "all" ? "All Papers" : "Paper " + papers[i]) + '</button>';
    }
    html += '</div><div class="flex items-center gap-1" role="group" aria-label="Filter by marks">' +
      '<span class="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mr-1">Marks:</span>';
    var marks = ["all", 2, 4, 6, 8, 12];
    for (i = 0; i < marks.length; i++) {
      on = String(state.vqMark) === String(marks[i]);
      html += '<button type="button" data-action="set-vq-mark" data-value="' + esc(marks[i]) + '" aria-pressed="' +
        (on ? 'true' : 'false') + '" class="px-2 py-1 rounded-md font-mono font-bold transition-colors cursor-pointer ' +
        (on ? 'bg-[var(--green)] text-white' : 'bg-[var(--white)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--practice-bg)]') + '">' +
        (marks[i] === "all" ? "All" : marks[i] + "m") + '</button>';
    }
    html += '</div></div><div class="font-mono text-[11px] text-[var(--muted)] tabular-nums">' +
      verifiedFiltered().length + " of " + verifiedAll().length + ' questions</div></div>';
    qs("#p1-filters").innerHTML = html;
  }

  function renderP2Toolbar() {
    var entries = p2CaseEntries(), i;
    var sections = '<div><h2 class="study-panel-kicker">Paper 2 cases</h2>' +
      '<div role="group" aria-label="Paper 2 case studies" class="study-sections">';
    for (i = 0; i < entries.length; i++) {
      var on = i === state.p2CaseIndex;
      sections += '<button type="button" data-action="set-p2-case" data-index="' + i + '" aria-pressed="' +
        (on ? 'true' : 'false') + '" class="study-section-button"><span>' + (i < 9 ? "0" : "") + (i + 1) +
        '</span>' + esc(entries[i].title) + '</button>';
    }
    sections += '</div></div>';
    qs("#p1-sections").innerHTML = sections;

    var html = '<div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--sheet-surface)] px-4 py-3 text-xs">' +
      '<div class="font-mono text-[11px] text-[var(--muted)]">' +
      (entries.length ? esc(entries[state.p2CaseIndex] ? entries[state.p2CaseIndex].key : "") : "Loading case inserts…") +
      '</div><div class="font-mono text-[11px] text-[var(--muted)] tabular-nums">' +
      p2QuestionPool().length + ' questions in view</div></div>';
    qs("#p1-filters").innerHTML = html;
  }

  function renderToolbar() {
    if (state.mode === "verified") { renderVerifiedToolbar(); updateCount(); return; }
    if (state.mode === "paper2") { renderP2Toolbar(); updateCount(); return; }
    var i;
    /* Section rail — matches the original <aside class="study-section-rail">. */
    var sections = '<div><h2 class="study-panel-kicker">Syllabus sections</h2>' +
      '<div role="group" aria-label="Syllabus sections" class="study-sections">';
    sections += sectionButton("all", "Sections");
    for (i = 0; i < SECTIONS.length; i++) {
      sections += sectionButton(SECTIONS[i].n, SECTIONS[i].label);
    }
    sections += '</div></div>';
    qs("#p1-sections").innerHTML = sections;

    /* Filter bar — chapter / unit, search, shuffle and set jump. */
    var html = '<div class="flex flex-wrap items-center gap-2 px-4 py-3 text-xs border-b border-[var(--line)]">';
    html += '<label class="font-semibold">Chapter / unit: <select data-action="chapter" class="boss-filter-select" style="max-width:190px">';
    html += '<option value="all"' + (state.unit === "all" ? ' selected' : '') + '>All chapters</option>';
    for (i = 0; i < units.length; i++) {
      html += '<option value="' + esc(unitNumber(units[i])) + '"' +
        (state.unit === unitNumber(units[i]) ? ' selected' : '') + '>' + esc(units[i]) + '</option>';
    }
    html += '</select></label>';
    html += '<label class="font-semibold">Search: <input type="search" data-action="search" value="' + esc(state.search) +
      '" placeholder="Search case stems and questions" size="24" style="padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)"></label>';
    html += '<button type="button" class="study-action study-secondary-action" data-action="shuffle" aria-pressed="' +
      (state.shuffle ? 'true' : 'false') + '">Shuffle: ' + (state.shuffle ? 'on' : 'off') + '</button>';
    html += '<label class="font-semibold">Jump to set #: <input type="number" min="1" value="' + (activeIndex() + 1) +
      '" data-action="jump-num" style="width:72px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)"></label>';
    html += '<button type="button" class="study-action btn-primary" data-action="jump">Go</button>';
    html += '</div>';
    qs("#p1-filters").innerHTML = html;
    updateCount();
  }

  function updateCount() {
    var el = qs("#p1-count");
    if (!el) return;
    if (state.mode === "verified") {
      var vl = verifiedFiltered();
      el.textContent = vl.length ? (state.vqIndex + 1) + " / " + vl.length : "0 / 0";
      return;
    }
    if (state.mode === "paper2") {
      var pl = p2QuestionPool();
      el.textContent = pl.length ? (state.p2Index + 1) + " / " + pl.length : "0 / 0";
      return;
    }
    var n = state.list.length;
    el.textContent = n ? (activeIndex() + 1) + " / " + n : "0 / 0";
    var jump = qs('[data-action="jump-num"]');
    if (jump) {
      jump.max = String(n);
      if (n) jump.value = String(activeIndex() + 1);
    }
  }

  function progressInner(sc, subs) {
    var qList = sc.questions || [];
    var marked = 0, total = 0, maxTotal = 0, i, rec, score;
    for (i = 0; i < qList.length; i++) {
      maxTotal += num(qList[i].mark_value, 0);
      rec = subs[qid(sc.scenario_id, qList[i].part)];
      if (rec) {
        marked++;
        score = savedScore(rec);
        if (score != null) total += score;
      }
    }
    var pct = maxTotal ? Math.round(total / maxTotal * 100) : 0;
    var all = getSubmissions(), allMarks = 0;
    for (i = 0; i < all.length; i++) {
      score = savedScore(all[i]);
      if (score != null) allMarks += score;
    }
    return '<div class="font-mono text-[11px] text-slate-500 dark:text-slate-400">' +
      '<strong class="text-slate-800 dark:text-slate-200">Set progress</strong> · ' + marked + ' / ' + qList.length +
      ' parts marked · ' + total + ' / ' + maxTotal + ' marks' +
      '<div style="background:var(--card);border:1px solid var(--line);border-radius:999px;height:8px;overflow:hidden;margin-top:8px">' +
        '<div style="height:100%;width:' + pct + '%;background:var(--green)"></div>' +
      '</div>' +
      '<div class="mt-1">All-time on this device: ' + all.length + ' saved marks · ' + allMarks + ' marks total</div></div>';
  }

  /* Exact rubric placeholders from the original PracticeStudio. */
  function placeholderFor(marks) {
    if (marks === 2) return "Write the textbook definition here...";
    if (marks === 4) return "State Reason 1 and apply to the case facts [k + app], then state Reason 2 and apply [k + app]...";
    if (marks === 6) return "Explain Benefit 1 with case application and causal analysis ('this leads to... as a result...') [k + app + an], then Benefit 2...";
    return "Analyze the advantages with case facts [k + app + an], analyze the disadvantages [k + app + an], then provide a justified overall conclusion weighing the trade-offs [eval]...";
  }

  function verifiedPlaceholder(marks, title) {
    title = String(title || "the case");
    if (marks <= 2) return "Write a clear, precise definition or state the required points...";
    if (marks === 4) return "State Point 1 applied to " + title + ", then Point 2 applied to the case...";
    if (marks <= 8) return "Apply each point to " + title + " facts & figures and develop causal chains ('this leads to... as a result...')...";
    return "Compare each option using " + title + " facts and appendix figures, weigh trade-offs, and finish with a justified recommendation...";
  }

  function markOptions(max, rec) {
    var saved = savedScore(rec), html = '<option value="">—</option>';
    for (var i = 0; i <= max; i++) {
      html += '<option value="' + i + '"' + (saved === i ? ' selected' : '') + '>' + i + '</option>';
    }
    return html;
  }

  function markSchemeHtml(q) {
    var ms = q.mark_scheme || {};
    var rows = [
      ["AO1 Knowledge (max 2)", ms.knowledge_max_2],
      ["AO2 Application (max 2)", ms.application_max_2],
      ["AO3 Analysis (max 2)", ms.analysis_max_2],
      ["AO4 Evaluation (max 2)", ms.evaluation_max_2]
    ];
    var html = '<div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">';
    html += '<strong class="font-mono font-bold uppercase text-[11px] tracking-wider text-slate-900 dark:text-slate-100 block mb-1">Cambridge mark scheme outline (' +
      esc(q.mark_value) + ' marks)</strong>';
    html += '<ul class="list-disc pl-4 space-y-1">';
    var any = false;
    for (var i = 0; i < rows.length; i++) {
      if (Array.isArray(rows[i][1]) && rows[i][1].length) {
        any = true;
        html += '<li><strong>' + esc(rows[i][0]) + ':</strong> ' + esc(rows[i][1].join("; ")) + '</li>';
      }
    }
    if (!any) html += '<li>' + esc(markSchemeTerms(q).join("; ")) + '</li>';
    html += '</ul></div>';
    return html;
  }

  function partHtml(sc, q, subs, bookmarks, opts) {
    opts = opts || {};
    var id = qid(sc.scenario_id, q.part);
    var draft = getDraft(id);
    var rec = subs[id];
    var score = savedScore(rec);
    var marks = num(q.mark_value, 0);
    var firstPart = sc.questions && sc.questions[0] ? sc.questions[0].part : "a";
    var inputId = opts.inputId || (q.part === firstPart ? "paper-one-response" : "paper-one-response-" + esc(q.part));
    var label = opts.label || "Your answer";
    var placeholder = opts.placeholder || placeholderFor(marks);
    var rows = opts.rows || (marks >= 6 ? 9 : 5);

    var html = '<div class="space-y-3" id="p1-part-' + esc(q.part) + '" data-part="' + esc(q.part) + '" data-qid="' + esc(id) + '">';
    if (opts.showHeading !== false) {
      html += '<span class="study-panel-kicker">Part ' + esc(String(q.part).toUpperCase()) + ' · ' + esc(q.mark_value) + ' marks</span>';
      html += '<h2 id="paper-one-active-question" class="study-prompt">' + esc(q.question_text) + '</h2>';
    }

    html += '<div class="space-y-2">';
    html += '<div class="study-answer-meta">';
    html += '<div class="flex flex-wrap items-center gap-2"><label for="' + inputId + '">' + esc(label) + '</label>' +
      (draft.trim()
        ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono">' +
          '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Draft auto-saved locally</span>'
        : '') +
      '<span data-saved="' + esc(id) + '" class="font-mono text-[10px] text-emerald-700 dark:text-emerald-400"></span></div>';
    html += '<div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">';
    html += '<span>Words: <span data-words="' + esc(id) + '">' + wordCount(draft) + '</span></span>';
    html += '<span>Time: <span data-timer="">' + formatTime(state.timerSeconds) + '</span></span>';
    html += '<button type="button" data-action="clear-draft" data-qid="' + esc(id) + '" ' +
      (draft.trim() ? '' : 'hidden ') +
      'class="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors" ' +
      'title="Clear your current draft response">Clear Draft</button>';
    html += '<button type="button" data-action="toggle-timer" class="text-xs font-semibold text-blue-600 dark:text-sky-400 cursor-pointer">' +
      (state.timerRunning ? '⏸ Pause Timer' : '▶ Start Timer') + '</button>';
    html += '</div></div>';
    html += '<textarea id="' + inputId + '" class="study-response" data-action="answer" data-qid="' + esc(id) + '" rows="' +
      rows + '" placeholder="' + esc(placeholder) + '">' + esc(draft) + '</textarea>';
    html += aoBadgeHtml(q, draft);
    if (state.liveHighlight && draft.trim() && !state.evaluation) {
      html += '<div class="mt-2" data-live-highlight="' + esc(id) + '">' +
        aoViewerHtml(q, draft, "Live Draft — AO Structure & Case Context Highlighter", true) + '</div>';
    }
    html += '</div>';

    html += '<div class="study-answer-actions">';
    html += '<button type="button" class="study-action study-secondary-action" data-action="toggle-ms" data-qid="' + esc(id) + '">View mark scheme</button>';
    if (opts.contextNote) {
      html += '<div class="font-mono text-[11px] text-[var(--muted)]">' + esc(opts.contextNote) + '</div>';
    }
    html += '<button type="button" class="study-action btn-primary" data-action="submit-assessment" data-qid="' + esc(id) + '"' +
      (draft.trim() ? '' : ' disabled') + '>Submit for assessment</button>';
    html += '</div>';

    html += '<div data-panel="ms" data-qid="' + esc(id) + '" hidden>' + markSchemeHtml(q) +
      '<div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 mt-2">' +
      '<strong class="text-emerald-900 dark:text-emerald-300 block mb-1">Exemplar Model Answer:</strong>' +
      '<p class="italic text-slate-800 dark:text-slate-200 leading-relaxed">"' + esc(q.model_answer || "") + '"</p></div></div>';
    html += '</div>';
    return html;
  }

  function bookmarkButtonHtml(id) {
    var bm = getBookmarks().indexOf(id) >= 0;
    return '<button type="button" class="study-bookmark" data-action="bookmark" data-qid="' + esc(id) +
      '" aria-pressed="' + (bm ? 'true' : 'false') + '">' + (bm ? '★ Bookmarked' : '☆ Bookmark') + '</button>';
  }

  function noResultsHtml(verified) {
    if (verified) {
      return '<section class="study-case-panel"><div class="study-panel-header">' +
        '<p class="study-panel-kicker">No results</p><h2 class="study-panel-title">No past paper questions match your filters</h2></div>' +
        '<div class="study-case-text">No past paper questions match the selected topic, paper, and mark filters.</div></section>' +
        '<div class="study-paper-one-editor"><section class="study-answer">' +
        '<div class="p-8 text-center space-y-3">' +
        '<p class="text-sm font-semibold text-[var(--ink)] dark:text-white">No past paper questions match the selected topic, paper, and mark filters.</p>' +
        '<button type="button" data-action="reset-filters" class="study-action btn-primary">Reset filters</button>' +
        '</div></section></div>';
    }
    return '<section class="study-case-panel"><div class="study-panel-header">' +
      '<p class="study-panel-kicker">No results</p><h2 class="study-panel-title">No questions match your filters</h2></div>' +
      '<div class="study-case-text">Try another topic, paper or mark filter.</div></section>' +
      '<div class="study-paper-one-editor"><section class="study-answer">' +
      '<p class="text-sm text-slate-600 dark:text-slate-400">No questions match the selected filters.</p></section></div>';
  }

  function pdfLinksHtml(vq) {
    var html = '';
    if (vq.question_pdf) html += '<a href="' + esc(vq.question_pdf) + '" target="_blank" rel="noopener noreferrer" class="font-semibold text-[var(--green)] dark:text-[#e4eeb2] hover:underline">Question Paper PDF ↗</a>';
    if (vq.insert_pdf) html += '<a href="' + esc(vq.insert_pdf) + '" target="_blank" rel="noopener noreferrer" class="font-semibold text-[var(--green)] dark:text-[#e4eeb2] hover:underline">Case Insert PDF ↗</a>';
    if (vq.mark_scheme_pdf) html += '<a href="' + esc(vq.mark_scheme_pdf) + '" target="_blank" rel="noopener noreferrer" class="font-semibold text-[#97532b] dark:text-[#e6b39b] hover:underline">Mark Scheme PDF ↗</a>';
    return html ? '<div class="pt-3 border-t border-dashed border-[var(--line)] flex flex-wrap gap-3 font-mono text-[11px]">' + html + '</div>' : '';
  }

  function renderVerifiedContent() {
    var el = qs("#p1-content");
    if (!el) return;
    if (!verifiedAll().length) { el.innerHTML = loadingContentHtml("Official Past Papers"); updateCount(); return; }
    var sc = activeScenario();
    if (!sc) { el.innerHTML = noResultsHtml(true); updateCount(); return; }
    var subs = submissionMap(), bookmarks = getBookmarks();
    var vq = sc.verified, cs = sc.caseStudy, q = sc.questions[0], id = qid(sc.scenario_id, q.part);
    var caseTitle = (cs && cs.businessTitle) || "Case Study";
    var i, tabActive = state.verifiedCaseTab;
    var html = '<section class="study-case-panel" aria-labelledby="verified-case-title">';
    html += '<div class="study-panel-header"><div class="min-w-0">';
    html += '<p class="study-panel-kicker">' + esc(vq.syllabus) + ' · ' + esc(vq.paper_code) + ' · ' +
      esc(vq.series) + ' ' + esc(vq.year) + '</p>';
    html += '<h2 id="verified-case-title" class="study-panel-title">' + esc(caseTitle) + '</h2></div>';
    html += '<div role="group" aria-label="Past paper question navigation" class="study-pager">';
    html += '<button type="button" data-action="vq-prev" class="study-pager-button" aria-label="Previous question" title="Previous question">' + icon(ICON.chevronLeft, 'w-4 h-4') + '</button>';
    html += '<span class="study-page-count" id="p1-count"></span>';
    html += '<button type="button" data-action="vq-next" class="study-pager-button" aria-label="Next question" title="Next question">' + icon(ICON.chevronRight, 'w-4 h-4') + '</button>';
    html += '</div></div>';

    /* Appendix tablist — Case Study plus one tab per appendix. */
    if (cs && cs.appendices && cs.appendices.length) {
      html += '<div class="px-4 sm:px-6 pb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Case study documents">';
      html += '<button type="button" role="tab" data-action="set-case-tab" data-tab="main" aria-selected="' +
        (tabActive === "main" ? 'true' : 'false') + '" class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ' +
        (tabActive === "main" ? 'bg-[var(--green)] text-white' : 'bg-[var(--paper)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]') +
        '">Case Study</button>';
      for (i = 0; i < cs.appendices.length; i++) {
        var appLabel = String(cs.appendices[i].label || ("Appendix " + (i + 1)));
        html += '<button type="button" role="tab" data-action="set-case-tab" data-tab="' + i + '" aria-selected="' +
          (tabActive === i ? 'true' : 'false') + '" class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ' +
          (tabActive === i ? 'bg-[var(--green)] text-white' : 'bg-[var(--paper)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]') +
          '">' + esc(appLabel) + '</button>';
      }
      html += '</div>';
    }

    html += '<div class="study-case-text space-y-3">';
    if (tabActive === "main" || !cs || !cs.appendices || !cs.appendices.length) {
      html += '<div>' + esc((cs && cs.mainCase) || vq.case_context || "Refer to the question paper PDF for the case study insert.") + '</div>';
      if (cs && cs.table) {
        html += '<div class="mt-3 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper)] dark:bg-neutral-900 p-3">' +
          '<pre class="font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--ink)] dark:text-neutral-200 whitespace-pre">' + esc(cs.table) + '</pre></div>';
      }
    } else {
      var app = cs.appendices[num(tabActive, 0)];
      if (app) {
        html += '<div class="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper)] dark:bg-neutral-900 p-3.5">' +
          '<div class="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">' + esc(app.label || "") + '</div>' +
          '<pre class="font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--ink)] dark:text-neutral-200 whitespace-pre-wrap">' + esc(app.body || "") + '</pre></div>';
      }
    }
    html += pdfLinksHtml(vq) + '</div></section>';
    html += '<div class="study-paper-one-editor">';
    html += '<div id="p1-progress" class="px-4 py-3 text-xs">' + progressInner(sc, subs) + '</div>';
    html += '<section class="study-answer space-y-4" aria-labelledby="verified-active-question">';
    html += '<div class="study-question-header"><div class="text-xs font-mono font-semibold text-[var(--muted)]">' +
      esc(vq.unit) + ' · Question ' + esc(vq.question) + ' · <strong class="text-[var(--ink)] dark:text-white">' +
      esc(vq.marks) + ' marks</strong></div>' +
      bookmarkButtonHtml(id) + flagButtonHtml(id, flaggedIds().indexOf(id) >= 0) + '</div>';
    html += '<h2 id="verified-active-question" class="study-prompt">' + esc(q.question_text) + '</h2>';
    html += partHtml(sc, q, subs, bookmarks, {
      inputId: "verified-archive-response",
      placeholder: verifiedPlaceholder(num(vq.marks, 0), caseTitle),
      rows: num(vq.marks, 0) >= 8 ? 9 : 6,
      showHeading: false,
      contextNote: num(vq.paper, 0) === 2 ? "Use case study & appendices in your answer" : "Refer directly to the business context"
    });
    html += '</section></div>';
    el.innerHTML = html;
    updateCount();
  }

  /* Question tabs with score chips, as in the original Paper 2 mode. */
  function p2QuestionTabsHtml() {
    var pool = p2QuestionPool(), subs = submissionMap(), h = '', i;
    if (!pool.length) return '';
    h += '<div class="flex flex-wrap gap-2 mb-4" role="group" aria-label="Paper 2 questions">';
    for (i = 0; i < pool.length; i++) {
      var q = pool[i];
      var qidValue = q.id || String(i);
      var max = num(q.marks, 0);
      var rec = subs[qidValue] || subs["P2_" + String(q.id || i) + "_a"];
      var score = savedScore(rec), hasScore = score != null;
      var isFull = hasScore && score >= max;
      var done = hasScore || (store.get("completed_questions", []) || []).indexOf(qidValue) >= 0;
      var cls = 'px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ';
      if (i === state.p2Index) cls += 'bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322]';
      else if (hasScore) cls += isFull
        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
        : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700';
      else cls += done
        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
      h += '<button type="button" data-action="set-p2-question" data-index="' + i + '" class="' + cls + '" aria-pressed="' +
        (i === state.p2Index ? 'true' : 'false') + '" aria-label="' +
        esc(String(q.partNumber || ("Question " + (i + 1)))) + ', ' + max + ' marks' +
        (hasScore ? '. Scored ' + score + ' out of ' + max : '') + '">' +
        esc(String(q.partNumber || ("Question " + (i + 1)))) + ' (' + max + 'm)' +
        (hasScore ? ' ' + score + '/' + max : (done ? ' ✓' : '')) + '</button>';
    }
    return h + '</div>';
  }

  function renderP2Content() {
    var el = qs("#p1-content");
    if (!el) return;
    if (!banks["verified-p2-cases"] && !banks["other-paper2-cases"]) {
      el.innerHTML = loadingContentHtml("Paper 2 Specimen Insert"); updateCount(); return;
    }
    var sc = activeScenario();
    if (!sc) { el.innerHTML = noResultsHtml(); updateCount(); return; }
    var subs = submissionMap(), bookmarks = getBookmarks();
    var c = sc.p2case, vq = sc.p2question, q = sc.questions[0];
    var id = qid(sc.scenario_id, q.part), i;
    var html = '<div class="study-alternate-mode space-y-6">' +
      '<div class="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between">' +
      '<div><strong>Paper 2 Case Study Mode:</strong> The full Paper 1 database (Sections 1 &amp; 2) is active above. Paper 2 full database will be added when provided.</div>' +
      '<button type="button" data-action="set-mode" data-mode="paper1" class="px-3 py-1 bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold rounded-lg shrink-0 ml-3 cursor-pointer">Switch to Paper 1 Database →</button>' +
      '</div>';
    html += '<section class="study-case-panel" aria-labelledby="paper-two-case-title">';
    html += '<div class="study-panel-header"><div class="min-w-0">';
    html += '<p class="study-panel-kicker">' + esc(c.key) + '</p>';
    html += '<h2 id="paper-two-case-title" class="study-panel-title">' + esc(c.title) + '</h2></div>';
    html += '<div role="group" aria-label="Case study navigation" class="study-pager">';
    html += '<button type="button" data-action="p2-prev" class="study-pager-button" aria-label="Previous question" title="Previous question">' + icon(ICON.chevronLeft, 'w-4 h-4') + '</button>';
    html += '<span class="study-page-count" id="p1-count"></span>';
    html += '<button type="button" data-action="p2-next" class="study-pager-button" aria-label="Next question" title="Next question">' + icon(ICON.chevronRight, 'w-4 h-4') + '</button>';
    html += '</div></div>';
    html += '<p class="px-4 text-xs text-[#57534E] dark:text-neutral-400 mb-4">Business: ' + esc(c.businessName || "—") +
      ' · Sector: ' + esc(c.industry || "—") + ' · Session: ' + esc(c.session || "—") + '</p>';
    html += '<div class="study-case-text">' + esc(sc.scenario_stem || "") + '</div>';
    if (sc.appendices && sc.appendices.length) {
      html += '<div class="px-4 pb-3 pt-3 border-t border-[var(--line)] space-y-3">';
      for (i = 0; i < sc.appendices.length; i++) {
        var ap = sc.appendices[i];
        var body = ap.body != null ? ap.body : ap.content;
        html += '<div class="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper)] p-3">' +
          '<div class="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">' +
          esc(ap.label || ap.title || ("Appendix " + (i + 1))) + '</div>' +
          '<pre class="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">' + esc(body || "") + '</pre></div>';
      }
      html += '</div>';
    }
    if (vq.question_pdf || vq.insert_pdf || vq.mark_scheme_pdf) {
      html += '<div class="px-4 pb-3">' + pdfLinksHtml(vq) + '</div>';
    }
    html += '</section>';
    html += '<div class="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 lg:p-8 shadow-xs">';
    html += '<h2 class="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white mb-2">' + esc(c.title) + '</h2>';
    html += '<p class="text-xs text-[#57534E] dark:text-neutral-400 mb-4">Business: ' + esc(c.businessName || "—") +
      ' · Sector: ' + esc(c.industry || "—") + ' · Session: ' + esc(c.session || "—") + '</p>';
    html += p2QuestionTabsHtml();
    html += '<h3 class="font-academic-serif text-lg font-bold mb-4">' + esc(q.question_text) + '</h3>';
    html += '<div class="study-paper-one-editor">';
    html += '<div id="p1-progress" class="px-4 py-3 text-xs">' + progressInner(sc, subs) + '</div>';
    html += '<section class="study-answer space-y-4" aria-labelledby="paper-one-active-question">';
    html += '<div class="study-question-header"><div class="text-xs font-mono font-semibold text-[var(--muted)]">' +
      esc(vq.partNumber || ("Question " + vq.question)) + ' · <strong class="text-[var(--ink)] dark:text-white">' +
      esc(vq.marks) + ' marks</strong></div>' +
      bookmarkButtonHtml(id) + flagButtonHtml(id, flaggedIds().indexOf(id) >= 0) + '</div>';
    html += partHtml(sc, q, subs, bookmarks, {
      inputId: "paper-two-response",
      label: "Student Response:",
      placeholder: "Write your Paper 2 answer...",
      rows: 8,
      showHeading: false
    });
    html += '</section></div></div></div>';
    el.innerHTML = html;
    updateCount();
  }

  function renderContent() {
    if (state.mode === "verified") { renderVerifiedContent(); return; }
    if (state.mode === "paper2") { renderP2Content(); return; }
    var el = qs("#p1-content");
    if (!el) return;
    var sc = activeScenario();
    if (!sc) {
      el.innerHTML = '<section class="study-case-panel"><div class="study-panel-header">' +
        '<p class="study-panel-kicker">No results</p><h2 class="study-panel-title">No sets match your filters</h2></div>' +
        '<div class="study-case-text">Try another section or a different search term.</div></section>' +
        '<div class="study-paper-one-editor"><section class="study-answer">' +
        '<p class="text-sm text-slate-600 dark:text-slate-400">Try another section or a different search term.</p>' +
        '</section></div>';
      updateCount();
      return;
    }
    var subs = submissionMap();
    var bookmarks = getBookmarks();
    var qList = sc.questions || [];
    var i;

    var html = '<section class="study-case-panel" aria-labelledby="paper-one-case-title">';
    html += '<div class="study-panel-header">';
    html += '<div><p class="study-panel-kicker">' + esc(sc.unit) + '</p>' +
      '<h2 id="paper-one-case-title" class="study-panel-title">Case study</h2></div>';
    html += '<div role="group" aria-label="Case study navigation" class="study-pager">';
    html += '<button type="button" data-action="prev" class="study-pager-button" aria-label="Previous question" title="Previous question">' + icon(ICON.chevronLeft, 'w-4 h-4') + '</button>';
    html += '<span class="study-page-count" id="p1-count"></span>';
    html += '<button type="button" data-action="next" class="study-pager-button" aria-label="Next question" title="Next question">' + icon(ICON.chevronRight, 'w-4 h-4') + '</button>';
    html += '</div></div>';
    html += '<div class="study-case-text">' + esc(sc.scenario_stem || "") + '</div>';
    html += '<a class="study-answer-jump" href="#paper-one-response">Go to your answer ↓</a>';
    html += '</section>';

    /* Only the selected part is edited at a time, exactly like the original
       studio. All parts remain answerable by switching via the part buttons;
       drafts/marks live in localStorage and survive every re-render. */
    var part = currentPart();
    var activeId = qid(sc.scenario_id, part);

    html += '<div class="study-paper-one-editor">';
    html += '<div id="p1-progress" class="px-4 py-3 text-xs">' + progressInner(sc, subs) + '</div>';
    html += '<section class="study-answer space-y-4" aria-labelledby="paper-one-active-question">';
    html += '<div class="study-question-header"><h2 class="study-panel-title">Questions</h2>' +
      bookmarkButtonHtml(activeId) + flagButtonHtml(activeId, flaggedIds().indexOf(activeId) >= 0) + '</div>';
    html += '<div role="group" aria-label="Question parts" class="study-question-options">';
    for (i = 0; i < qList.length; i++) {
      var p = qList[i];
      var pid = qid(sc.scenario_id, p.part);
      var prec = subs[pid];
      var pscore = savedScore(prec);
      var pmax = num(p.mark_value, 0);
      var hasScore = pscore != null;
      var isFull = hasScore && pscore >= pmax;
      var cls = "study-question-button";
      if (hasScore) cls += isFull ? " study-question-button--done" : " study-question-button--partial";
      else if (prec) cls += " study-question-button--done";
      html += '<button type="button" class="' + cls + '" data-action="select-part" data-part="' + esc(p.part) +
        '" aria-pressed="' + (p.part === part ? 'true' : 'false') + '" aria-label="Part ' +
        esc(String(p.part).toUpperCase()) + ', ' + esc(p.mark_value) + ' marks">' +
        '<strong>Part ' + esc(String(p.part).toUpperCase()) + '</strong>' +
        '<small>' + esc(p.mark_value) + ' marks</small>' +
        (hasScore ? '<span class="study-question-score ' + (isFull ? 'study-question-score--full' : 'study-question-score--partial') + '">' +
          pscore + '/' + pmax + (isFull ? ' ✓' : '') + '</span>' : (prec ? '<span class="study-question-done-mark" aria-hidden="true">✓ Done</span>' : '')) +
        '</button>';
    }
    html += '</div>';
    for (i = 0; i < qList.length; i++) {
      if (qList[i].part === part) html += partHtml(sc, qList[i], subs, bookmarks);
    }
    html += '</section></div>';

    el.innerHTML = html;
    updateCount();
  }

  function render() {
    if (!data) return;
    mainEl.innerHTML =
      '<div class="study-page">' +
        '<header class="study-hero">' +
          '<div class="study-hero-content">' +
            '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
            '<h1 class="study-title">Paper 1 <span>Practice</span></h1>' +
            '<p class="study-description">Practise 2-, 4-, 6- and 8-mark questions using business case studies.</p>' +
            '<div class="study-hero-actions">' +
              '<button type="button" class="study-action btn-primary" data-action="open-mocks" title="Open the timed Paper 1 or Paper 2 mock exam chooser with full case study and appendices">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="12" y2="14"/><circle cx="12" cy="14" r="8"/><polyline points="12 9 12 14 16.5 16.5"/></svg>' +
                '<span>Start Mock Exam</span>' +
              '</button>' +
              '<button type="button" class="study-action study-secondary-action" data-action="open-study-space" title="Launch Aesthetic Study Space &amp; Focus Pomodoro Timer">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>' +
                '<span>Study Space</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="study-hero-image" aria-hidden="true"></div>' +
        '</header>' +
        '<div class="study-studio study-paper-one-studio">' +
          '<div class="study-mode-bar">' +
            '<div role="group" aria-label="Practice mode" class="study-mode-options">' +
              '<button type="button" data-action="set-mode" data-mode="paper1" aria-pressed="' +
                (state.mode === "paper1" ? 'true' : 'false') + '" class="study-mode-button">' + icon(ICON.search, 'w-4 h-4') + 'Topical Questions</button>' +
              '<button type="button" data-action="set-mode" data-mode="verified" aria-pressed="' +
                (state.mode === "verified" ? 'true' : 'false') + '" class="study-mode-button">' + icon(ICON.landmark, 'w-4 h-4') + 'Official Past Papers</button>' +
              '<button type="button" data-action="set-mode" data-mode="paper2" aria-pressed="' +
                (state.mode === "paper2" ? 'true' : 'false') + '" class="study-mode-button">' + icon(ICON.file, 'w-4 h-4') + 'Paper 2 Specimen Insert</button>' +
            '</div>' +
            '<div data-ai-engine-host>' + engineHtml() + '</div>' +
            layoutPickerHtml() +
          '</div>' +
          '<div id="p1-filters"></div>' +
          '<div class="study-workspace">' +
            '<aside class="study-section-rail" aria-label="Practice navigation">' +
              '<div id="p1-sections"></div>' +
              '<div class="study-mode-shortcuts">' +
                '<button type="button" class="study-shortcut" data-action="open-sections" title="Browse the syllabus chapters">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' +
                  '<span>Syllabus Chapters</span></button>' +
                '<button type="button" class="study-shortcut" data-action="open-quick-quiz" title="Launch the A/B/C/D quick quiz drill">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>' +
                  '<span>Quick Quiz</span></button>' +
                '<button type="button" class="study-shortcut" data-action="open-factors" title="Open the Factors of Production &amp; Factor Rewards diagram">' +
                  icon(ICON.landmark, 'w-4 h-4') + '<span>Factors &amp; Rewards</span></button>' +
              '</div>' +
            '</aside>' +
            '<div class="min-w-0">' +
              '<div id="p1-content" class="study-columns study-paper-one-columns ' + layoutClass() + '"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="p1-results"></div>' +
      '<div id="p1-dialogs"></div>';
    if (state.focusPart && /^[abcd]$/i.test(state.focusPart)) {
      state.activePart = state.focusPart.toLowerCase();
      state.focusPart = "";
    }
    renderToolbar();
    renderContent();
    renderResults();
    renderDialogs();
  }

  /* ------------------------------------------------------------------ */
  /* Event handling (delegated — installed once per main element)        */
  /* ------------------------------------------------------------------ */
  function setButtonLabel(btn, key, showing) {
    var labels = {
      ms: showing ? "Hide mark scheme" : "View mark scheme",
      ao: showing ? "Hide AO highlight" : "AO highlight",
      model: showing ? "Hide model answer" : "Model answer",
      examiner: showing ? "Hide feedback" : "Instant Examiner"
    };
    if (labels[key]) btn.textContent = labels[key];
  }

  function togglePanel(action, btn, id) {
    var map = { "toggle-ms": "ms", "toggle-ao": "ao", "toggle-model": "model", "examiner": "examiner" };
    var key = map[action];
    if (!key) return;
    var panel = qs('[data-panel="' + key + '"][data-qid="' + id + '"]');
    if (!panel) return;
    var showing = panel.hidden;
    panel.hidden = !showing;
    if (showing) {
      if (key === "ao") {
        var found = findQuestion(id);
        panel.innerHTML = found ? aoHtml(found.question, valueOfAnswer(id)) : "";
      } else if (key === "examiner") {
        runExaminer(id, panel);
      }
    }
    setButtonLabel(btn, key, showing);
  }

  function saveMark(id) {
    var found = findQuestion(id);
    if (!found) return;
    var sel = qs('select[data-qid="' + id + '"]');
    if (!sel || sel.value === "") {
      var note0 = qs('[data-marknote="' + id + '"]');
      if (note0) note0.textContent = "Choose a mark from the list first.";
      return;
    }
    var max = num(found.question.mark_value, 0);
    var score = Math.max(0, Math.min(max, num(sel.value, 0)));
    var answer = valueOfAnswer(id);
    var record = {
      id: "sub-" + Date.now(),
      questionId: id,
      questionTitle: found.scenario.scenario_id + " Part (" + String(found.question.part).toUpperCase() + ")",
      marks: max,
      paper: state.mode === "paper2" ? 2 : (state.mode === "verified" ? num((found.scenario.verified || {}).paper, 1) : 1),
      syllabus: state.mode === "verified" ? String((found.scenario.verified || {}).syllabus || "0264") : "0264",
      unit: found.scenario.unit,
      studentAnswer: answer,
      wordCount: wordCount(answer),
      timeSpentSeconds: state.timerSeconds,
      result: {
        totalScore: score,
        maxMarks: max,
        percentage: max ? Math.round(score / max * 100) : 0,
        feedback: "Self-marked in Paper 1 topical practice."
      },
      timestamp: new Date().toISOString()
    };
    var all = getSubmissions();
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].questionId === id) { all.splice(i, 1); break; }
    }
    all.unshift(record);
    if (all.length > 100) all.length = 100;
    store.set("submissions", all);
    var doneIds = store.get("completed_questions", []);
    if (!Array.isArray(doneIds)) doneIds = [];
    if (doneIds.indexOf(id) < 0) { doneIds.push(id); store.set("completed_questions", doneIds); }

    var note = qs('[data-marknote="' + id + '"]');
    if (note) note.textContent = "Saved mark: " + score + " / " + max;
    var prog = qs("#p1-progress");
    if (prog) prog.innerHTML = progressInner(found.scenario, submissionMap());
  }

  function onClick(event) {
    var btn = findAction(event.target);
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-qid");
    if (!action || action === "answer" || action === "mark-select") return;
    if (action === "set-unit") {
      state.unit = btn.getAttribute("data-unit") || "all";
      state.activeId = "";
      recomputeList();
      renderToolbar();
      renderContent();
      persistState();
    } else if (action === "shuffle") {
      state.shuffle = !state.shuffle;
      recomputeList();
      renderToolbar();
      renderContent();
      persistState();
    } else if (action === "prev") {
      move(-1);
    } else if (action === "next") {
      move(1);
    } else if (action === "jump") {
      doJump();
    } else if (action === "bookmark") {
      var nowBm = toggleBookmark(id);
      btn.textContent = nowBm ? "★ Bookmarked" : "☆ Bookmark";
      btn.setAttribute("aria-pressed", nowBm ? "true" : "false");
    } else if (action === "toggle-ms" || action === "toggle-ao" ||
               action === "toggle-model" || action === "examiner") {
      togglePanel(action, btn, id);
    } else if (action === "save-mark") {
      saveMark(id);
    } else if (action === "submit-assessment") {
      submitForAssessment(id);
    } else if (action === "clear-draft") {
      if (!id) return;
      store.set("draft_" + id, "");
      var ta = qs('textarea[data-qid="' + id + '"]');
      if (ta) { ta.value = ""; ta.focus(); }
      var wc = qs('[data-words="' + id + '"]');
      if (wc) wc.textContent = "0";
      var mn = qs('[data-marknote="' + id + '"]');
      if (mn) mn.textContent = "Draft cleared";
      renderContent();
    } else if (action === "toggle-live-highlight") {
      var foundHl = findQuestion(id);
      state.liveHighlight = !state.liveHighlight;
      renderContent();
      if (state.liveHighlight && foundHl) {
        var panelHl = qs('[data-live-highlight="' + id + '"]');
        if (panelHl) panelHl.scrollIntoView && panelHl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } else if (action === "toggle-ao-chip") {
      var aoKey = btn.getAttribute("data-ao");
      if (aoKey && state.showAo[aoKey] != null) state.showAo[aoKey] = !state.showAo[aoKey];
      refreshAoViewers();
    } else if (action === "toggle-result-highlight") {
      state.liveHighlight = !state.liveHighlight;
      renderResults();
    } else if (action === "select-part") {
      var picked = btn.getAttribute("data-part");
      if (picked) {
        clearEvaluation();
        state.activePart = picked;
        resetTimer();
        renderContent();
        updateCount();
      }
    } else if (action === "toggle-timer") {
      toggleTimer();
    } else if (action === "open-flag") {
      if (!id || flaggedIds().indexOf(id) >= 0) return;
      state.flagOpen = id;
      state.flagReason = "Typo in question";
      state.flagConfidence = "Pretty sure";
      state.flagNote = "";
      syncDialogLock();
      renderDialogs();
    } else if (action === "close-dialog") {
      closeDialogs();
    } else if (action === "flag-reason") {
      state.flagReason = btn.getAttribute("data-value") || "Typo in question";
      renderDialogs();
    } else if (action === "flag-confidence") {
      state.flagConfidence = btn.getAttribute("data-value") || "Pretty sure";
      renderDialogs();
    } else if (action === "save-flag") {
      saveFlag(btn.getAttribute("data-qid") || state.flagOpen);
    } else if (action === "open-override") {
      startOverride();
    } else if (action === "override-bod") {
      if (!state.overrideForm) return;
      var fBod = state.overrideForm;
      var bd = state.evaluation.aoBreakdown;
      var next = Math.min(num(state.evaluation.maxMarks, 0), num(fBod.score, 0) + 1);
      fBod.bod = true;
      if (num(bd.ao3.max, 0) > num(fBod.ao.ao3, 0)) fBod.ao.ao3++;
      else if (num(bd.ao2.max, 0) > num(fBod.ao.ao2, 0)) fBod.ao.ao2++;
      else if (num(bd.ao1.max, 0) > num(fBod.ao.ao1, 0)) fBod.ao.ao1++;
      else if (num(bd.ao4.max, 0) > num(fBod.ao.ao4, 0)) fBod.ao.ao4++;
      fBod.score = next;
      fBod.reason = "BOD (Benefit of Doubt) awarded: Candidate's explanation is valid in Cambridge examiner discretion.";
      renderDialogs();
    } else if (action === "override-full") {
      if (!state.overrideForm) return;
      var maxFull = num(state.evaluation.maxMarks, 0), bdFull = state.evaluation.aoBreakdown;
      state.overrideForm.score = maxFull;
      state.overrideForm.ao = {
        ao1: num(bdFull.ao1.max, 0), ao2: num(bdFull.ao2.max, 0),
        ao3: num(bdFull.ao3.max, 0), ao4: num(bdFull.ao4.max, 0)
      };
      state.overrideForm.reason = "Candidate full credit awarded: thorough answer covering all assessment objectives (AO1, AO2, AO3, AO4).";
      renderDialogs();
    } else if (action === "override-reset") {
      resetOverride();
    } else if (action === "override-detailed") {
      if (!state.overrideForm) return;
      state.overrideForm.detailed = !state.overrideForm.detailed;
      renderDialogs();
    } else if (action === "override-reason-preset") {
      if (!state.overrideForm) return;
      state.overrideForm.reason = btn.getAttribute("data-value") || "";
      renderDialogs();
    } else if (action === "apply-override") {
      applyOverride();
    } else if (action === "open-factors") {
      state.factorsOpen = true;
      syncDialogLock();
      renderDialogs();
    } else if (action === "factors-tab") {
      state.factorsTab = btn.getAttribute("data-value") || "factors";
      renderDialogs();
    } else if (action === "factors-select") {
      state.factorsSelected = btn.getAttribute("data-value") || "land";
      renderDialogs();
    } else if (action === "set-layout") {
      setLayout(btn.getAttribute("data-value"));
    } else if (action === "set-case-tab") {
      var tab = btn.getAttribute("data-tab");
      state.verifiedCaseTab = tab === "main" ? "main" : num(tab, 0);
      renderContent();
    } else if (action === "set-p2-question") {
      clearEvaluation();
      state.p2Index = num(btn.getAttribute("data-index"), 0);
      resetTimer();
      renderContent();
      updateCount();
    } else if (action === "reset-filters") {
      state.unit = "all";
      state.vqPaper = "all";
      state.vqMark = "all";
      state.vqIndex = 0;
      renderToolbar();
      renderContent();
    } else if (action === "set-mode") {
      setMode(btn.getAttribute("data-mode"));
    } else if (action === "set-vq-paper") {
      state.vqPaper = btn.getAttribute("data-value") || "all";
      state.vqIndex = 0;
      renderToolbar();
      renderContent();
    } else if (action === "set-vq-mark") {
      state.vqMark = btn.getAttribute("data-value") || "all";
      state.vqIndex = 0;
      renderToolbar();
      renderContent();
    } else if (action === "vq-prev") {
      vqMove(-1);
    } else if (action === "vq-next") {
      vqMove(1);
    } else if (action === "set-p2-case") {
      state.p2CaseIndex = num(btn.getAttribute("data-index"), 0);
      state.p2Index = 0;
      resetTimer();
      renderToolbar();
      renderContent();
    } else if (action === "p2-prev") {
      p2Move(-1);
    } else if (action === "p2-next") {
      p2Move(1);
    } else if (action === "open-quick-quiz") {
      EC.navigate("quiz");
    } else if (action === "open-sections") {
      EC.navigate("sections");
    } else if (action === "enable-local-ai") {
      /* Load the model in place — the original loads it in the background
         rather than navigating away to the AI Marker page. */
      if (EC.ai && typeof EC.ai.load === "function") EC.ai.load();
      refreshEngine();
    } else if (action === "open-ai-marker") {
      /* Kept only for the optional secondary "Open AI Marker ↗" link. */
      EC.navigate("ai-marker");
    } else if (action === "open-mocks") {
      EC.navigate("mocks");
    } else if (action === "open-study-space") {
      EC.navigate("study-space");
    }
  }

  function onInput(event) {
    var t = event.target;
    if (!t || !t.getAttribute) return;
    var action = t.getAttribute("data-action");
    if (action === "search") {
      state.search = t.value;
      recomputeList();
      renderContent();
      updateCount();
      persistState();
    } else if (action === "answer") {
      var id = t.getAttribute("data-qid");
      store.set("draft_" + id, t.value);
      var w = qs('[data-words="' + id + '"]');
      if (w) w.textContent = String(wordCount(t.value));
      var s = qs('[data-saved="' + id + '"]');
      if (s) s.textContent = t.value.trim() ? "Draft autosaved locally" : "";
      var subBtn = qs('[data-action="submit-assessment"][data-qid="' + id + '"]');
      if (subBtn) subBtn.disabled = !t.value.trim();
      var clearBtn = qs('[data-action="clear-draft"][data-qid="' + id + '"]');
      if (clearBtn) clearBtn.hidden = !t.value.trim();
      var badgeHost = qs('[data-ao2-badge="1"]');
      if (badgeHost && findQuestion(id)) {
        var fresh = document.createElement("div");
        fresh.innerHTML = aoBadgeHtml(findQuestion(id).question, t.value);
        while (badgeHost.firstChild) badgeHost.removeChild(badgeHost.firstChild);
        while (fresh.firstChild) badgeHost.appendChild(fresh.firstChild);
      }
      var live = qs('[data-live-highlight="' + id + '"]');
      if (live && state.liveHighlight) {
        var foundLive = findQuestion(id);
        if (foundLive) live.innerHTML = aoViewerHtml(foundLive.question, t.value, "Live Draft — AO Structure & Case Context Highlighter", true);
      }
    } else if (action === "flag-note") {
      state.flagNote = String(t.value).slice(0, 240);
      var counter = qs("[data-flag-count]");
      if (counter) counter.textContent = String(t.value).length + "/240";
    } else if (action === "override-score" || action === "override-score-num") {
      if (!state.overrideForm) return;
      var total = Math.max(0, Math.min(num(state.evaluation.maxMarks, 0), num(t.value, 0)));
      distributeOverrideScore(total);
      if (action === "override-score") {
        var numInput = qs('[data-action="override-score-num"]');
        if (numInput) numInput.value = String(total);
      } else {
        var rangeInput = qs('[data-action="override-score"]');
        if (rangeInput) rangeInput.value = String(total);
      }
      renderDialogs();
      var reRange = qs('[data-action="override-score"]');
      if (reRange) reRange.value = String(total);
    } else if (action === "override-ao") {
      if (!state.overrideForm) return;
      state.overrideForm.ao[t.getAttribute("data-ao")] = num(t.value, 0);
      var aSum = 0, aKeys = ["ao1", "ao2", "ao3", "ao4"];
      for (var ai = 0; ai < aKeys.length; ai++) aSum += num(state.overrideForm.ao[aKeys[ai]], 0);
      state.overrideForm.score = Math.min(num(state.evaluation.maxMarks, 0), aSum);
      renderDialogs();
    } else if (action === "override-reason") {
      if (state.overrideForm) state.overrideForm.reason = t.value;
    }
  }

  function onChange(event) {
    var t = event.target;
    if (!t || !t.getAttribute) return;
    if (t.getAttribute("data-action") === "chapter") {
      state.unit = t.value || "all";
      state.activeId = "";
      recomputeList();
      renderToolbar();
      renderContent();
      persistState();
    }
  }

  function bind() {
    if (!mainEl || mainEl.__p1StudioBound) return;
    mainEl.__p1StudioBound = true;
    mainEl.addEventListener("click", onClick);
    mainEl.addEventListener("input", onInput);
    mainEl.addEventListener("change", onChange);
    /* Keep the primary button label/state in sync with the model loader. */
    if (typeof aiUnsubscribe === "function") { aiUnsubscribe(); aiUnsubscribe = null; }
    if (EC.ai && typeof EC.ai.onChange === "function") {
      aiUnsubscribe = EC.ai.onChange(function () { refreshEngine(); });
    }
    /* Escape closes any open dialog and restores background scrolling. */
    if (!window.__p1EscapeBound) {
      window.__p1EscapeBound = true;
      window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.keyCode === 27) {
          if (dialogIsOpen()) { e.preventDefault(); closeDialogs(); }
        }
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* View registration                                                   */
  /* ------------------------------------------------------------------ */
  function applyParams(params) {
    if (!params) return;
    var u = params.get ? params.get("unit") : null;
    if (u && (/^[1-6]$/.test(u) || u === "all")) state.unit = u;
    var q = params.get ? params.get("q") : null;
    if (q != null) state.search = q;
    var set = params.get ? params.get("set") : null;
    if (set) state.activeId = set;
    var part = params.get ? params.get("part") : null;
    if (part && /^[abcd]$/i.test(part)) {
      state.focusPart = part.toLowerCase();
      state.activePart = part.toLowerCase();
    }
  }

  function initState() {
    state.layout = loadLayout();
    var saved = store.get("p1_studio_state", null);
    if (saved && typeof saved === "object") {
      if (saved.unit === "all" || /^[1-6]$/.test(saved.unit)) state.unit = saved.unit;
      if (typeof saved.search === "string") state.search = saved.search;
      state.shuffle = !!saved.shuffle;
      if (saved.activeId) state.activeId = saved.activeId;
    } else {
      var pos = store.get("p1_last_position", null);
      if (pos && pos.scenarioId) state.activeId = pos.scenarioId;
    }
  }

  var definition = {
    title: "Paper 1",
    render: function (main, params) {
      mainEl = main;
      if (!data) {
        return EC.load("paper1").then(function (json) {
          data = Array.isArray(json) ? json : [];
          var i, seen = {};
          for (i = 0; i < data.length; i++) {
            if (!seen[data[i].unit]) { seen[data[i].unit] = 1; units.push(data[i].unit); }
          }
          initState();
          applyParams(params);
          bind();
          recomputeList();
          render();
          persistState();
        });
      }
      applyParams(params);
      bind();
      recomputeList();
      render();
    }
  };

  EC.register("practice", definition);
  /* Alias for links that still use the old "paper1" view name. */
  EC.register("paper1", definition);
})();
