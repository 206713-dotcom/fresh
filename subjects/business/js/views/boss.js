/* EcBiz Boss Battle arena — plain browser JavaScript, no framework or build step.
 * Port of src/components/BossBattleArena.tsx, MistakeReview.tsx and the shared
 * boss-battle / mcq-review rules into the static window.EC view system.
 */
(function () {
  "use strict";

  if (!window.EC) return;
  var EC = window.EC;

  var LETTERS = ["A", "B", "C", "D"];
  var REVIEW_KEY = "mcq_review";             // localStorage: ecbiz_mcq_review
  var WRONG_KEY = "mcq_wrong";               // localStorage: ecbiz_mcq_wrong (read by quiz.js)
  var BOSS_WRONG_KEY = "boss_wrong_questions";
  var FILTER_KEY = "boss_filters";
  var MASTERY_DAYS = 2;
  var JETPACK_COST = 200;
  var JETPACK_SECONDS = 3;
  var REVIVE_REQUIRED = 10;
  var FLAG_KEY = "question_flags";          // localStorage: ecbiz_question_flags
  var FLAG_MAX_TRACKED = 500;
  var FLAG_MAX_NOTE = 240;
  var FLAG_REASONS = ["Typo in question", "Mark scheme issue", "Wrong unit / tag", "Other"];
  var FLAG_CONFIDENCES = ["Pretty sure", "Very confident", "100% certain"];
  var GROUND_Y = 230;
  var CANVAS_W = 760;
  var CANVAS_H = 270;

  /* ------------------------------------------------------------------ */
  /* Static game configuration (names / numbers from the React source)   */
  /* ------------------------------------------------------------------ */

  var DIFFICULTIES = [
    { id: "foundation", label: "Foundation", badge: "Core 0264",
      description: "Standard attack rhythm and base velocity.",
      hpMult: 1, speedMult: 1, cadenceMult: 1, rewardMult: 1,
      color: "#10b981", seconds: 40 },
    { id: "higher", label: "Higher Tier", badge: "Grade 7-8 Target",
      description: "+35% Boss HP, +25% Projectile Velocity & Multi-Height Barrages.",
      hpMult: 1.35, speedMult: 1.25, cadenceMult: 1.22, rewardMult: 1.6,
      color: "#f59e0b", seconds: 25 },
    { id: "nightmare", label: "A* Nightmare", badge: "Grade 9 Ruthless",
      description: "+80% Boss HP, Extreme Velocity & Undulating Wave Trajectories.",
      hpMult: 1.8, speedMult: 1.55, cadenceMult: 1.45, rewardMult: 2.8,
      color: "#ef4444", seconds: 14 }
  ];

  var BOSSES = [
    { id: "cash_flow_crisis", name: "Cash-Flow Kraken",
      title: "Terror of Insolvency & Liquidity", icon: "\uD83D\uDC19", color: "#0284c7",
      maxHp: 220, attackIntervalMs: 12000, projectileSpeed: 5.5, projectileIcon: "\uD83D\uDCB8" },
    { id: "hostile_takeover", name: "Takeover Titan",
      title: "Predatory Buyouts & Shareholder Clashes", icon: "\uD83E\uDD88", color: "#e11d48",
      maxHp: 320, attackIntervalMs: 10500, projectileSpeed: 6.2, projectileIcon: "\uD83D\uDCC9" },
    { id: "diseconomy_dragon", name: "Diseconomy Dragon",
      title: "Bureaucracy & Scale Inefficiencies", icon: "\uD83D\uDC09", color: "#ea580c",
      maxHp: 440, attackIntervalMs: 9500, projectileSpeed: 6.8, projectileIcon: "\uD83D\uDD25" },
    { id: "hyperinflation_hydra", name: "Hyperinflation Hydra",
      title: "Macroeconomic Shocks & Spiral Costs", icon: "\uD83D\uDC0D", color: "#10b981",
      maxHp: 560, attackIntervalMs: 8800, projectileSpeed: 7.2, projectileIcon: "\uD83D\uDCB9" },
    { id: "monopoly_overlord", name: "Monopoly Overlord",
      title: "Anti-Trust Hegemony & Collusion", icon: "\uD83D\uDC41️", color: "#eab308",
      maxHp: 680, attackIntervalMs: 8200, projectileSpeed: 7.8, projectileIcon: "⚖️" },
    { id: "grand_examiner", name: "Cambridge Grand Examiner",
      title: "Grade Boundary 9 Standard", icon: "\uD83D\uDC51", color: "#9333ea",
      maxHp: 800, attackIntervalMs: 7600, projectileSpeed: 8.4, projectileIcon: "⚡" }
  ];

  var ARMOUR = [
    { id: "starter", name: "Candidate Uniform", icon: "\uD83E\uDD4A", damagePerHit: 30, cost: 0,
      description: "Standard exam uniform. Takes 30 damage per hit." },
    { id: "bronze", name: "Prefect Blazer", icon: "\uD83D\uDEE1️", damagePerHit: 22, cost: 40,
      description: "Sturdy woven blazer. Takes 22 damage per hit." },
    { id: "iron", name: "Kevlar Formula Sheet", icon: "\uD83D\uDCDC", damagePerHit: 14, cost: 100,
      description: "Laminated business ratios absorb kinetic impact. Takes 14 damage." },
    { id: "diamond", name: "Cambridge Diamond Robe", icon: "\uD83D\uDC8E", damagePerHit: 6, cost: 220,
      description: "Mythic examiner regalia. Deflects almost all damage (6 damage)." },
    { id: "graphene", name: "Graphene Exosuit", icon: "\uD83E\uDDBE", damagePerHit: 3, cost: 340,
      description: "Lab-grown carbon lattice. Takes 3 damage per hit." },
    { id: "nova", name: "Nova Chairman Plate", icon: "\uD83C\uDF1F", damagePerHit: 1, cost: 460,
      description: "Stellar forged plate. Takes 1 damage per hit." },
    { id: "grandmaster", name: "Grandmaster Mantle", icon: "\uD83C\uDFDB️", damagePerHit: 0, cost: 640,
      description: "Zero damage taken. You are the examiner now." }
  ];

  var CHARACTERS = [
    { id: "custom", name: "Custom Scholar", icon: "\uD83E\uDDD1\u200D\uD83C\uDF93", cost: 0, flip: false, custom: true },
    { id: "dino", name: "Dino Scholar", icon: "\uD83E\uDD96", cost: 0, flip: true },
    { id: "knight", name: "Business Knight", icon: "\uD83E\uDD40", cost: 30, flip: true },
    { id: "analyst", name: "Chief Financial Mage", icon: "\uD83E\uDDD9\u200D♂️", cost: 80, flip: true },
    { id: "cyber", name: "Audit Cyborg", icon: "\uD83E\uDD16", cost: 150, flip: false },
    { id: "lion", name: "Audit Lion", icon: "\uD83E\uDD81", cost: 220, flip: true },
    { id: "phoenix", name: "Phoenix Rising Intern", icon: "\uD83E\uDD85", cost: 260, flip: true },
    { id: "phantom", name: "Cambridge Phantom", icon: "\uD83D\uDC7B", cost: 380, flip: true },
    { id: "dean", name: "The Dean", icon: "\uD83C\uDF93", cost: 520, flip: true }
  ];

  var AMMO_LADDER = [
    { from: 20, to: 35, cost: 60 }, { from: 35, to: 50, cost: 140 },
    { from: 50, to: 65, cost: 240 }, { from: 65, to: 80, cost: 340 },
    { from: 80, to: 100, cost: 480 }
  ];

  var UNIT_OPTIONS = [
    { code: "1", label: "1 · Understanding business activity" },
    { code: "2", label: "2 · People in business" },
    { code: "3", label: "3 · Marketing" },
    { code: "4", label: "4 · Operations management" },
    { code: "5", label: "5 · Financial information and decisions" },
    { code: "6", label: "6 · External influences" }
  ];

  var FOCUS_OPTIONS = [
    { id: "all", label: "All questions" },
    { id: "missed", label: "Previously missed" },
    { id: "definitions", label: "Definitions & key terms" },
    { id: "calculations", label: "Calculations & formulas" },
    { id: "application", label: "Application & analysis" }
  ];

  var RECALL_RE = /\b(define|state|name|which of the following|what is|identify|select the|choose the|match)\b/i;
  var CALC_RE = /\b(calculate|compute|ratio|margin|percentage|percent|contribution|break-?even|average|profit|rate of)\b/i;
  var APPLY_RE = /\b(recommend|justify|evaluate|assess|analyse|analyze|discuss|to what extent|most important|best|overall)\b/i;

  /* ------------------------------------------------------------------ */
  /* Small ES5 helpers                                                    */
  /* ------------------------------------------------------------------ */

  function esc(v) { return EC.esc(v); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* Inline Lucide icons — same markup as the original React app. */
  var ICON_PATHS = {
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    "sparkles": '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
    "refresh-cw": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    "volume-2": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    "volume-x": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
    "crosshair": '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
    "shopping-bag": '<path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
    "palette": '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
    "flame": '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
    "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "rocket": '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    "heart": '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
    "pause": '<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
    "play": '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    "swords": '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "trash-2": '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    "check-circle-2": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'
  };
  function ico(name, size, cls) {
    var body = ICON_PATHS[name] || "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (size || 24) + '" height="' + (size || 24) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true" class="lucide lucide-' + name + (cls ? " " + cls : "") + '">' + body + '</svg>';
  }
  function soundIcon(st) {
    return ico(st.sound ? "volume-2" : "volume-x", 17);
  }
  function now() { return Date.now(); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function toInt(v, d) { v = parseInt(v, 10); return isNaN(v) ? d : v; }

  function localDayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function readMap(key) {
    var raw = EC.store.get(key, {});
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return raw;
  }
  function writeMap(key, map) { EC.store.set(key, map); }

  /* Local question-flag notes (mirrors src/lib/flags.ts). */
  function flagNotes() {
    var raw = EC.store.get(FLAG_KEY, []);
    return Object.prototype.toString.call(raw) === "[object Array]" ? raw : [];
  }
  function isQuestionFlagged(questionId) {
    var notes = flagNotes();
    for (var i = 0; i < notes.length; i++) {
      if (notes[i] && notes[i].questionId === questionId) return true;
    }
    return false;
  }
  function saveLocalQuestionFlag(entry) {
    var notes = flagNotes(), i, kept = [];
    for (i = 0; i < notes.length && kept.length < FLAG_MAX_TRACKED - 1; i++) {
      if (notes[i] && notes[i].questionId !== entry.questionId) kept.push(notes[i]);
    }
    var stamped = {
      questionId: entry.questionId, reason: entry.reason,
      confidence: entry.confidence, note: entry.note,
      timestamp: new Date().toISOString()
    };
    EC.store.set(FLAG_KEY, [stamped].concat(kept).slice(0, FLAG_MAX_TRACKED));
  }

  /* ------------------------------------------------------------------ */
  /* Persistence: filters, spaced repetition, review + wrong banks        */
  /* ------------------------------------------------------------------ */

  function loadFilter() {
    var raw = EC.store.get(FILTER_KEY, {});
    var units = raw && Array.isArray(raw.units) ? raw.units : [];
    var focus = raw && raw.focus ? raw.focus : "all";
    var known = false, i;
    for (i = 0; i < FOCUS_OPTIONS.length; i++) if (FOCUS_OPTIONS[i].id === focus) known = true;
    return {
      units: units,
      subsection: raw && typeof raw.subsection === "string" ? raw.subsection : "all",
      focus: known ? focus : "all"
    };
  }
  function saveFilter(filter) { EC.store.set(FILTER_KEY, filter); }

  function loadBossWrong() { return readMap(BOSS_WRONG_KEY); }
  function recordBossMiss(item, difficulty) {
    var map = loadBossWrong(), old = map[item.id] || {};
    map[item.id] = {
      id: item.id, unit: item.section, chapter: item.chapter, difficulty: difficulty,
      question: item.question, correctAnswer: item.correctAnswer,
      missCount: (toInt(old.missCount, 0) + 1), lastMissedAt: now()
    };
    writeMap(BOSS_WRONG_KEY, map);
  }
  function recordBossHit(id) {
    var map = loadBossWrong(), entry = map[id];
    if (!entry) return;
    if (toInt(entry.missCount, 0) <= 1) delete map[id];
    else entry.missCount = toInt(entry.missCount, 0) - 1;
    writeMap(BOSS_WRONG_KEY, map);
  }

  function readWrong() {
    var raw = EC.store.get(WRONG_KEY, {}), map = {}, id;
    if (Array.isArray(raw)) {
      for (var i = 0; i < raw.length; i++) {
        if (typeof raw[i] === "string") map[raw[i]] = { id: raw[i], correctDates: [], missedAt: now() };
      }
      writeWrong(map);
      return map;
    }
    if (raw && typeof raw === "object") {
      for (id in raw) {
        if (!has(raw, id)) continue;
        var v = raw[id] || {};
        map[id] = {
          id: id,
          correctDates: Array.isArray(v.correctDates) ? v.correctDates : [],
          missedAt: typeof v.missedAt === "number" ? v.missedAt : now()
        };
      }
    }
    return map;
  }
  function writeWrong(map) { writeMap(WRONG_KEY, map); }
  function resetWrongProgress(id) {
    var map = readWrong();
    if (!map[id]) return;
    map[id] = { id: id, correctDates: [], missedAt: now() };
    writeWrong(map);
  }
  function recordWrongCorrect(id) {
    var map = readWrong(), entry = map[id];
    if (!entry) return;
    var dates = entry.correctDates.slice(), today = localDayKey();
    if (dates.indexOf(today) === -1) dates.push(today);
    if (dates.length >= MASTERY_DAYS) delete map[id];
    else entry.correctDates = dates;
    writeWrong(map);
  }
  function moveToWrong(id) {
    var review = readMap(REVIEW_KEY);
    if (!review[id]) return false;
    var wrong = readWrong();
    wrong[id] = { id: id, correctDates: [], missedAt: now() };
    writeWrong(wrong);
    delete review[id];
    writeMap(REVIEW_KEY, review);
    return true;
  }

  function readReview() { return readMap(REVIEW_KEY); }
  function recordReviewMiss(entry) {
    var map = readReview(), old = map[entry.id] || {};
    map[entry.id] = {
      id: entry.id, question: entry.question, options: entry.options,
      correctIndex: entry.correctIndex, chapter: entry.chapter, unit: entry.unit,
      explanation: entry.explanation, reason: entry.reason || "",
      difficulty: entry.difficulty, missedAt: now(),
      missCount: toInt(old.missCount, 0) + 1
    };
    writeMap(REVIEW_KEY, map);
  }
  function bumpReviewMiss(id) {
    var map = readReview();
    if (!map[id]) return;
    map[id].missCount = toInt(map[id].missCount, 0) + 1;
    map[id].missedAt = now();
    writeMap(REVIEW_KEY, map);
  }
  function removeReview(id) {
    var map = readReview();
    delete map[id];
    writeMap(REVIEW_KEY, map);
  }
  function reviewList() {
    var map = readReview(), out = [], id;
    for (id in map) if (has(map, id)) out.push(map[id]);
    out.sort(function (a, b) { return toInt(b.missedAt, 0) - toInt(a.missedAt, 0); });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* Question bank, classification and drawing                            */
  /* ------------------------------------------------------------------ */

  var bankPromise = null;
  function loadBank() {
    if (!bankPromise) {
      var names = ["mcq-section1", "mcq-section2", "mcq-section3",
                   "mcq-section4", "mcq-section5", "mcq-section6"], loads = [], i;
      for (i = 0; i < names.length; i++) loads.push(EC.load(names[i]));
      bankPromise = Promise.all(loads).then(function (parts) {
        var out = [], j, k;
        for (j = 0; j < parts.length; j++) {
          var part = parts[j] || [];
          for (k = 0; k < part.length; k++) out.push(part[k]);
        }
        return out;
      });
    }
    return bankPromise;
  }

  function chapterCode(item) {
    var parts = String(item.chapter || "").split(" ");
    return parts.length ? parts[0] : "";
  }
  function matchesFocus(item, focus) {
    var q = String(item.question || "").toLowerCase();
    if (focus === "definitions") return RECALL_RE.test(q);
    if (focus === "calculations") return CALC_RE.test(q);
    if (focus === "application") return APPLY_RE.test(q) || /\b(explain|analyse|analyze)\b/.test(q);
    return true;
  }
  function questionLevel(item) {
    var q = String(item.question || "").toLowerCase(), score = 0;
    if (CALC_RE.test(q)) score += 2;
    if (APPLY_RE.test(q)) score += 2;
    else if (/\b(explain|why|how)\b/.test(q)) score += 1;
    if (RECALL_RE.test(q)) score -= 1;
    return score <= 0 ? 1 : score === 1 ? 2 : 3;
  }

  function buildPool(st) {
    var filter = st.filter, items = st.bank || [], units = null, i;
    if (filter.units.length) {
      units = {};
      for (i = 0; i < filter.units.length; i++) units[filter.units[i]] = true;
    }
    var subsection = filter.subsection === "all" ? null : filter.subsection;
    var focus = filter.focus === "all" ? null : filter.focus;
    function pass(item) {
      if (units && !units[item.section]) return false;
      if (subsection && String(item.chapter || "").indexOf(subsection) !== 0) return false;
      if (filter.focus === "missed") return true;
      if (focus && !matchesFocus(item, focus)) return false;
      return true;
    }
    var pool = [], out;
    for (i = 0; i < items.length; i++) if (pass(items[i])) pool.push(items[i]);
    var widened = false;
    if (!pool.length && (subsection || focus)) {
      widened = true;
      pool = [];
      for (i = 0; i < items.length; i++) {
        var it = items[i];
        if (units && !units[it.section]) continue;
        if (focus && !matchesFocus(it, focus)) continue;
        pool.push(it);
      }
      if (!pool.length) {
        for (i = 0; i < items.length; i++) if (!units || units[items[i].section]) pool.push(items[i]);
      }
    }
    return { items: pool, widened: widened };
  }

  function subsectionsFor(st) {
    var pool = buildPool({ filter: { units: st.filter.units, subsection: "all", focus: "all" }, bank: st.bank }).items;
    var tally = {}, order = [], i, code;
    for (i = 0; i < pool.length; i++) {
      code = chapterCode(pool[i]);
      if (!tally[code]) { tally[code] = { code: code, chapter: pool[i].chapter, count: 0 }; order.push(code); }
      tally[code].count++;
    }
    order.sort(function (a, b) {
      var na = toInt(a.split(".")[0], 0), nb = toInt(b.split(".")[0], 0);
      if (na !== nb) return na - nb;
      return a < b ? -1 : a > b ? 1 : 0;
    });
    var out = [];
    for (i = 0; i < order.length; i++) out.push(tally[order[i]]);
    return out;
  }

  function buildDistractors(st, target) {
    var bank = st.bank || [], same = [], diff = [], other = [], i;
    for (i = 0; i < bank.length; i++) {
      var it = bank[i];
      if (it.id === target.id || it.correctAnswer === target.correctAnswer) continue;
      other.push(it);
      if (it.chapter === target.chapter) same.push(it); else diff.push(it);
    }
    same = shuffle(same); diff = shuffle(diff);
    var picked = [], j, val;
    for (j = 0; j < same.length && picked.length < 2; j++) {
      val = same[j].correctAnswer;
      if (val && picked.indexOf(val) === -1) picked.push(val);
    }
    for (j = 0; j < diff.length && picked.length < 3; j++) {
      val = diff[j].correctAnswer;
      if (val && picked.indexOf(val) === -1) picked.push(val);
    }
    while (picked.length < 3 && other.length) {
      val = other[Math.floor(Math.random() * other.length)].correctAnswer;
      if (val && picked.indexOf(val) === -1) picked.push(val);
    }
    return picked.slice(0, 3);
  }

  function pickQuestion(st, difficulty) {
    var filter = st.filter, wrong = loadBossWrong();
    var pool = buildPool(st).items;
    if (filter.focus === "missed") {
      var missed = [];
      for (var m = 0; m < pool.length; m++) if (wrong[pool[m].id]) missed.push(pool[m]);
      if (missed.length) pool = missed;
    }
    if (!pool.length) pool = st.bank || [];
    var recent = st.recent || [], usable = [], i;
    for (i = 0; i < pool.length; i++) if (recent.indexOf(pool[i].id) === -1) usable.push(pool[i]);
    if (!usable.length) usable = pool;

    var stage = st.game ? st.game.stage : toInt(EC.store.get("boss_stage", 1), 1);
    var rage = st.game ? st.game.rage : 0;
    var prefer = Math.min(3, Math.max(1, Math.floor((stage - 1) / 2) + 1 + (rage >= 6 ? 1 : 0)));
    function weight(item) {
      var entry = wrong[item.id];
      var missBoost = entry ? Math.pow(toInt(entry.missCount, 0) + 1, 1.6) : 1;
      var lvl = questionLevel(item);
      var lvlWeight = lvl === prefer ? 3 : Math.abs(lvl - prefer) === 1 ? 1.5 : 0.7;
      return missBoost * lvlWeight;
    }
    var total = 0;
    for (i = 0; i < usable.length; i++) total += weight(usable[i]);
    var target;
    if (total <= 0) target = usable[Math.floor(Math.random() * usable.length)];
    else {
      var r = Math.random() * total;
      target = usable[usable.length - 1];
      for (i = 0; i < usable.length; i++) {
        r -= weight(usable[i]);
        if (r <= 0) { target = usable[i]; break; }
      }
    }
    if (!target) return null;

    st.recent = (recent.concat([target.id])).slice(-6);
    var options = shuffle([target.correctAnswer].concat(buildDistractors(st, target)));
    var correctIndex = options.indexOf(target.correctAnswer);
    if (correctIndex < 0) { options = [target.correctAnswer, "", "", ""]; correctIndex = 0; }
    var exp = target.explanation || {};
    return {
      id: target.id,
      questionNumber: target.questionNumber || target.id,
      chapter: target.chapter || "",
      question: target.question || "",
      options: options,
      correctIndex: correctIndex,
      explanation: 'Cambridge Mark Scheme: "' + target.correctAnswer + '"',
      reason: exp.correct_reason || "",
      unit: target.section || "",
      difficulty: difficulty,
      item: target
    };
  }

  /* ------------------------------------------------------------------ */
  /* Styles (injected once — site.css has no arena classes)               */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* View + screen plumbing                                               */
  /* ------------------------------------------------------------------ */

  var activeCleanup = null;
  var krakenImage = null, krakenRequested = false;

  function getKraken() {
    if (!krakenRequested) {
      krakenRequested = true;
      if (typeof Image !== "undefined") {
        krakenImage = new Image();
        krakenImage.src = "./assets/boss-kraken-CYEgYL7e.webp";
      }
    }
    return krakenImage;
  }

  function renderView(main, params, name) {
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }

    var root = document.createElement("div");
    root.className = "boss-page";
    main.innerHTML = "";
    main.appendChild(root);

    var st = {
      root: root, screen: "", content: null, bank: [], recent: [],
      filter: loadFilter(),
      difficulty: EC.store.get("boss_difficulty", "foundation"),
      stage: clamp(toInt(EC.store.get("boss_stage", 1), 1), 1, 999),
      sound: EC.store.get("boss_sound", true) !== false,
      game: null, raf: 0, lastTs: 0, qInterval: null,
      controlsCleanup: null, destroyed: false, floatTimers: [],
      flag: {
        open: false, questionId: "", reason: FLAG_REASONS[0],
        confidence: FLAG_CONFIDENCES[0], note: "", state: "idle"
      },
      review: { mode: "list", ids: [], index: 0, selected: null, feedback: null, notice: "" }
    };
    if (!findById(DIFFICULTIES, st.difficulty)) st.difficulty = "foundation";

    root.addEventListener("click", function (e) {
      var node = e.target;
      while (node && node !== root && (!node.getAttribute || !node.getAttribute("data-act"))) node = node.parentNode;
      if (!node || node === root) return;
      handleAction(st, node.getAttribute("data-act"), node, e);
    });
    root.addEventListener("change", function (e) {
      var node = e.target;
      if (!node || !node.getAttribute) return;
      var act = node.getAttribute("data-act");
      if (act === "subsection") {
        st.filter.subsection = node.value;
        saveFilter(st.filter);
        renderLobby(st);
      } else if (act === "focus") {
        st.filter.focus = node.value;
        saveFilter(st.filter);
        renderLobby(st);
      }
    });
    root.addEventListener("input", function (e) {
      var node = e.target;
      if (!node || !node.getAttribute || node.getAttribute("data-act") !== "flagnote") return;
      st.flag.note = String(node.value || "").slice(0, FLAG_MAX_NOTE);
      var counter = st.root.querySelector("#eb-flag-count");
      if (counter) counter.textContent = st.flag.note.length + "/" + FLAG_MAX_NOTE;
    });

    activeCleanup = function () { cleanup(st); };
    showScreen(st, "lobby");

    loadBank().then(function (items) {
      if (st.destroyed) return;
      st.bank = items || [];
      if (st.screen === "lobby") renderLobby(st);
    })["catch"](function (err) {
      if (st.destroyed || !st.content) return;
      st.content.innerHTML = '<div class="ec-banner">Could not load the question bank: ' +
        esc(err && err.message ? err.message : err) + '</div>';
    });

    return activeCleanup;
  }

  function clearFloats(st) {
    var i;
    if (st.floatTimers) {
      for (i = 0; i < st.floatTimers.length; i++) clearTimeout(st.floatTimers[i]);
      st.floatTimers = [];
    }
    if (st.content) {
      var host = st.content.querySelector("#eb-floats");
      if (host) host.innerHTML = "";
    }
  }

  function cleanup(st) {
    st.destroyed = true;
    stopLoop(st);
    clearQuestionTimer(st);
    clearFloats(st);
    closeFlagDialog(st, true);
    if (st.controlsCleanup) { st.controlsCleanup(); st.controlsCleanup = null; }
    st.game = null;
  }

  function showScreen(st, screen) {
    stopLoop(st);
    clearQuestionTimer(st);
    clearFloats(st);
    closeFlagDialog(st, true);
    if (st.controlsCleanup) { st.controlsCleanup(); st.controlsCleanup = null; }
    st.screen = screen;
    st._hudHtml = ""; st._jetHtml = "";
    st.root.innerHTML =
      topbar(st) +
      '<div id="eb-content"></div>';
    st.content = st.root.querySelector("#eb-content");
    if (screen === "lobby") renderLobby(st);
    else if (screen === "shop") renderShop(st);
    else if (screen === "battle") renderBattle(st);
    else if (screen === "review") {
      st.review.mode = "list";
      st.review.ids = []; st.review.index = 0; st.review.active = null;
      st.review.selected = null; st.review.feedback = null;
      renderReview(st);
    }
  }

  function topbar(st) {
    var inBattle = st.screen === "battle";
    var shopActive = st.screen === "shop";
    return '<header class="boss-topbar">' +
      '<button type="button" class="boss-quiet" data-act="lobby">' + ico("arrow-left", 16) + '<span>Business overview</span></button>' +
      '<div class="boss-topbar-actions">' +
        '<span class="boss-coins" data-eb-coins aria-label="' + esc(EC.points()) + ' GIS Points">◎ ' + esc(EC.points()) + ' GIS Points</span>' +
        '<button type="button" class="boss-quiet" data-act="sound" aria-label="' + (st.sound ? "Mute game audio" : "Unmute game audio") + '">' + soundIcon(st) + '<span class="sr-only">' + (st.sound ? "Sound on" : "Muted") + '</span></button>' +
        (inBattle ? '' : '<button type="button" class="boss-quiet" data-act="shop">' + ico("shopping-bag", 16) + '<span>' + (shopActive ? "Battle lobby" : "Armour shop") + '</span></button>') +
        (inBattle ? '' : '<button type="button" class="boss-quiet" data-act="review">' + ico("clipboard-list", 16) + '<span>Review mistakes (' + reviewList().length + ')</span></button>') +
      '</div></header>';
  }

  function syncCoins(st) {
    var nodes = st.root.querySelectorAll("[data-eb-coins]"), i;
    var balance = EC.points() + " GIS Points";
    for (i = 0; i < nodes.length; i++) {
      nodes[i].textContent = "◎ " + balance;
      nodes[i].setAttribute("aria-label", balance);
    }
  }

  function selectedBoss(st) {
    return BOSSES[(st.stage - 1) % BOSSES.length];
  }

  function computeBoss(base, stage, diffId) {
    var diff = findById(DIFFICULTIES, diffId) || DIFFICULTIES[0];
    var stageScale = 1 + (stage - 1) * 0.16;
    var loop = Math.floor((stage - 1) / BOSSES.length) + 1;
    return {
      id: base.id, name: base.name, title: base.title, icon: base.icon,
      color: base.color, projectileIcon: base.projectileIcon,
      maxHp: Math.round(base.maxHp * stageScale * diff.hpMult),
      projectileSpeed: Number(((base.projectileSpeed + (stage - 1) * 0.28) * diff.speedMult).toFixed(2)),
      attackIntervalMs: Math.max(3600, Math.round(base.attackIntervalMs / (Math.min(2.5, 1 + (stage - 1) * 0.07) * diff.cadenceMult))),
      attackCadenceMs: Math.max(1150, Math.round(2400 / (Math.min(2.2, 1 + (stage - 1) * 0.08) * diff.cadenceMult))),
      stage: stage, loop: loop,
      scaledTitle: "Stage " + stage + " (Loop " + loop + ") · " + base.title
    };
  }

  function questionSeconds(diffId, stage) {
    var diff = findById(DIFFICULTIES, diffId) || DIFFICULTIES[0];
    var scale = Math.max(0.7, 1 - 0.05 * Math.max(0, stage - 1));
    return Math.max(8, Math.round(diff.seconds * scale));
  }

  /* ------------------------------------------------------------------ */
  /* Lobby                                                                */
  /* ------------------------------------------------------------------ */

  function renderLobby(st) {
    if (!st.content) return;
    var boss = computeBoss(selectedBoss(st), st.stage, st.difficulty);
    var diff = findById(DIFFICULTIES, st.difficulty);
    var pool = buildPool(st), missed = loadBossWrong();
    var missedCount = 0, k, totalSubsections = 0;
    for (k in missed) if (has(missed, k)) missedCount++;
    var secs = questionSeconds(st.difficulty, st.stage);
    var out = [];

    out.push('<section class="boss-lobby-hero" aria-labelledby="boss-lobby-title"><div class="boss-hero-copy">' +
      '<p>IGCSE BUSINESS</p>' +
      '<h1 id="boss-lobby-title">Boss Battle</h1>' +
      '<div>Dodge attacks and answer Business questions to deal damage and earn GIS Points.</div>' +
      '<button type="button" class="boss-cta" data-act="start">' + ico("swords", 20) + ' Start battle ' + ico("arrow-right", 19) + '</button>' +
      '</div></section>');

    out.push('<div class="boss-lobby-grid">');
    out.push('<section class="boss-lobby-panel" aria-labelledby="boss-picker-title">' +
      '<div class="boss-panel-heading"><h2 id="boss-picker-title">Choose a boss</h2>' +
      (boss.loop > 1 ? '<span>Loop ' + boss.loop + '</span>' : '') + '</div>' +
      '<div role="group" aria-label="Select boss" class="boss-picker">');
    var i, stageFor, pressed;
    for (i = 0; i < BOSSES.length; i++) {
      stageFor = i + 1 + (boss.loop - 1) * BOSSES.length;
      pressed = (st.stage - 1) % BOSSES.length === i;
      out.push('<button type="button" aria-pressed="' + pressed + '" data-act="boss" data-stage="' + stageFor + '">' +
        '<span class="boss-picker-icon" aria-hidden="true">' + esc(BOSSES[i].icon) + '</span>' +
        '<span><strong>' + esc(BOSSES[i].name) + '</strong><small>Stage ' + stageFor + '</small></span>' +
        ico("chevron-right", 16) + '</button>');
    }
    out.push('</div></section>');

    out.push('<section class="boss-lobby-panel" aria-labelledby="boss-difficulty-title">' +
      '<div class="boss-panel-heading"><h2 id="boss-difficulty-title">Difficulty</h2></div>' +
      '<div class="boss-difficulty" role="group" aria-label="Battle difficulty">');
    for (i = 0; i < DIFFICULTIES.length; i++) {
      var d = DIFFICULTIES[i];
      out.push('<button type="button" aria-pressed="' + (st.difficulty === d.id) + '" data-act="difficulty" data-id="' + d.id + '">' +
        '<span style="background-color:' + d.color + '" aria-hidden="true"></span>' +
        '<strong>' + esc(d.label) + '</strong><small>' + d.rewardMult + '× rewards</small></button>');
    }
    out.push('</div><p class="boss-difficulty-hint">' + esc(diff.description) + '</p>');
    out.push('<div class="boss-selected-match"><span>' + esc(boss.icon) + ' <strong>' + esc(boss.name) + '</strong></span><span>' + boss.maxHp + ' HP</span></div>');
    out.push('<div class="boss-lobby-actions">' +
      '<button type="button" class="boss-quiet" data-act="wardrobe">' + ico("palette", 16) + ' Wardrobe</button>' +
      (st.stage > 1 ? '<button type="button" class="boss-quiet" data-act="boss" data-stage="1">' + ico("rotate-ccw", 16) + ' Select Stage 1</button>' : '') +
      '<button type="button" class="boss-quiet" data-act="review">' + ico("clipboard-list", 16) + ' Review mistakes (' + reviewList().length + ')</button>' +
      '</div></section></div>');

    out.push('<section class="boss-lobby-panel boss-filters-panel" aria-labelledby="boss-filters-title">' +
      '<div class="boss-panel-heading"><h2 id="boss-filters-title">Question focus</h2><span>' +
      (st.filter.focus === "missed" ? missedCount.toLocaleString() + ' missed questions' : pool.items.length.toLocaleString() + ' in the pool') +
      '</span></div><div class="boss-filters-grid">');
    out.push('<fieldset class="boss-filter-fieldset"><legend>Units</legend>' +
      '<div class="boss-filter-chips" role="group" aria-label="Filter by unit">' +
      '<button type="button" class="boss-filter-chip' + (!st.filter.units.length ? ' is-on' : '') + '" data-act="allunits" aria-pressed="' + (!st.filter.units.length) + '">All</button>');
    for (i = 0; i < UNIT_OPTIONS.length; i++) {
      var u = UNIT_OPTIONS[i], on = st.filter.units.indexOf(u.code) !== -1;
      out.push('<button type="button" class="boss-filter-chip' + (on ? ' is-on' : '') + '" data-act="unit" data-id="' + u.code +
        '" title="' + esc(u.label) + '" aria-pressed="' + on + '">U' + u.code + '</button>');
    }
    out.push('</div></fieldset>');

    var subs = subsectionsFor(st);
    for (i = 0; i < subs.length; i++) totalSubsections += subs[i].count;
    out.push('<label class="boss-filter-field"><span>Subsection</span>' +
      '<select class="boss-filter-select" data-act="subsection" aria-label="Filter by subsection">' +
      '<option value="all">All subsections (' + totalSubsections.toLocaleString() + ')</option>');
    for (i = 0; i < subs.length; i++) {
      out.push('<option value="' + esc(subs[i].code) + '"' + (st.filter.subsection === subs[i].code ? ' selected' : '') + '>' +
        esc(subs[i].chapter) + ' (' + subs[i].count + ')</option>');
    }
    out.push('</select></label>');

    out.push('<label class="boss-filter-field"><span>Focus mode</span>' +
      '<select class="boss-filter-select" data-act="focus" aria-label="Focus mode">');
    for (i = 0; i < FOCUS_OPTIONS.length; i++) {
      var f = FOCUS_OPTIONS[i];
      var label = f.label + (f.id === "missed" && missedCount ? ' (' + missedCount + ')' : '');
      out.push('<option value="' + f.id + '"' + (st.filter.focus === f.id ? ' selected' : '') + '>' + esc(label) + '</option>');
    }
    out.push('</select></label></div>');

    out.push('<div class="boss-filters-foot"><span>' + secs + 's per question on ' + esc(diff.label) +
      ' (tightens each stage) · questions escalate as the stage rises</span>');
    if (pool.items.length < 20) out.push('<span class="boss-filter-warning" role="status">Only ' + pool.items.length.toLocaleString() +
      ' question' + (pool.items.length === 1 ? '' : 's') + ' match — broaden the filters for a varied fight.</span>');
    if (st.filter.focus === "missed" && !missedCount) out.push('<span class="boss-filter-warning" role="status">No missed questions yet — misses are banked here and resurface until you master them.</span>');
    out.push('<span>Wrong answers also go to the Review page, where you can practise them and choose whether to add them to MCQ Wrong Only.</span></div></section>');

    st.content.innerHTML = out.join("");
  }

  /* ------------------------------------------------------------------ */
  /* Battle setup + HUD / overlays                                        */
  /* ------------------------------------------------------------------ */

  function getMaxAmmo() { return clamp(toInt(EC.store.get("boss_max_ammo", 20), 20), 20, 100); }
  /* Ammo seen by the shop: the live fight's magazine when there is one. */
  function shopAmmo(st) {
    if (st.game && typeof st.game.ammo === "number") return clamp(st.game.ammo, 0, getMaxAmmo());
    return clamp(toInt(EC.store.get("boss_ammo", getMaxAmmo()), getMaxAmmo()), 0, getMaxAmmo());
  }
  function setShopAmmo(st, value) {
    var v = clamp(value, 0, getMaxAmmo());
    if (st.game) st.game.ammo = v;
    EC.store.set("boss_ammo", v);
  }
  function getArmour() { return findById(ARMOUR, EC.store.get("armour_id", "starter")) || ARMOUR[0]; }
  function getChar() { return findById(CHARACTERS, EC.store.get("char_id", "custom")) || CHARACTERS[0]; }
  function hasJetpack() { return EC.store.get("jetpack_unlocked", false) === true; }
  /* Pokemon-style Scholar Level: real study time from the (100-entry capped)
   * submission history, not the MCQ completion counter. */
  function studyBonus() {
    var subs = EC.store.get("submissions", []);
    if (Object.prototype.toString.call(subs) !== "[object Array]") subs = [];
    var total = 0, i, secs;
    for (i = 0; i < subs.length && i < 100; i++) {
      secs = subs[i] && subs[i].timeSpentSeconds;
      total += toInt(secs || 60, 60);
    }
    var level = clamp(1 + Math.floor(total / 180), 1, 50);
    return { damage: 1 + (level - 1) * 0.1, hp: (level - 1) * 10, level: level };
  }

  function startBattle(st, stage, diffId, continueRun) {
    var boss = computeBoss(BOSSES[(stage - 1) % BOSSES.length], stage, diffId);
    var bonus = studyBonus(), maxHp = 100 + bonus.hp;
    var old = st.game;
    st.stage = stage;
    st.difficulty = diffId;
    EC.store.set("boss_stage", stage);
    EC.store.set("boss_difficulty", diffId);
    EC.store.set("boss_battles_count", toInt(EC.store.get("boss_battles_count", 0), 0) + 1);
    st.recent = [];

    var g = {
      stage: stage, diff: diffId, boss: boss,
      bossHp: boss.maxHp, ghostHp: boss.maxHp,
      playerHp: maxHp, maxPlayerHp: maxHp,
      ammo: getMaxAmmo(), maxAmmo: getMaxAmmo(),
      lives: continueRun && old ? old.lives : 1,
      tokens: continueRun && old ? old.tokens : 0,
      score: continueRun && old ? old.score : 0,
      streak: 0, bestStreak: 0, rage: 0,
      reviveUsed: false, reviveCorrect: 0,
      shots: [], attacks: [], floats: [],
      player: { x: 80, y: 190, vy: 0, isJumping: false, width: 38, height: 48, rotation: 0 },
      lastQuestion: now(), lastBossAttack: now(),
      invincibleUntil: 0, shake: 0, flash: 0,
      jetpackActive: false, jetpackEnd: 0, jetpackCooldownEnd: 0,
      holdStart: 0, holdTriggered: false, pendingSalvo: 0,
      question: null, selected: -1, qTimer: 0, feedback: null, pendingAction: null,
      state: "playing", pausedAt: 0, lastHud: 0,
      sky: null, floor: null
    };
    /* Live escalation: every correct answer makes the boss faster. */
    g.attackInterval = function () {
      return Math.max(4200, Math.round(g.boss.attackIntervalMs / (1 + Math.min(g.rage, 15) * 0.035)));
    };
    g.cadence = function () {
      return Math.max(850, Math.round(g.boss.attackCadenceMs / (1 + Math.min(g.rage, 15) * 0.055)));
    };
    g.projectileSpeed = function () {
      return Math.min(10.5, g.boss.projectileSpeed * (1 + Math.min(g.rage, 15) * 0.05));
    };
    st.game = g;
    showScreen(st, "battle");
  }

  function renderBattle(st) {
    if (!st.content) return;
    var g = st.game;
    if (!g) { showScreen(st, "lobby"); return; }
    st.content.innerHTML =
      '<div class="boss-match">' +
        '<div class="boss-match-bar"><div>' +
          '<p class="boss-match-meta">Stage ' + g.stage + ' · ' + esc((findById(DIFFICULTIES, g.diff) || DIFFICULTIES[0]).label) + '</p>' +
          '<h1>' + esc(g.boss.name) + '</h1></div>' +
          '<div class="boss-match-actions"><span id="eb-score">' + g.score.toLocaleString() + ' score</span>' +
          (g.state === "playing" ? '<button type="button" class="boss-quiet" data-act="pause">' + ico("pause", 16) + ' Pause</button>' : '') +
          ((g.state === "gameover" || g.state === "victory") ? '<button type="button" class="boss-quiet" data-act="lobby">Battle lobby</button>' : '') +
          '</div></div>' +
        '<div class="boss-match-hud" id="eb-hud"></div>' +
        '<div class="boss-canvas-wrap" id="eb-arena">' +
          '<canvas id="eb-canvas" class="boss-canvas" width="' + CANVAS_W + '" height="' + CANVAS_H +
          '" tabindex="' + (g.state === "playing" ? "0" : "-1") + '" aria-label="Battle arena. Space jumps, F shoots, R refills, and Escape pauses."></canvas>' +
          '<div id="eb-floats" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:20;overflow:hidden"></div>' +
          '<div id="eb-jetstat"></div>' +
          '<div id="eb-overlay"></div>' +
        '</div>' +
        '<div id="eb-question"></div>' +
        '<div id="eb-controls-host"></div>' +
      '</div>';

    st.canvas = st.content.querySelector("#eb-canvas");
    st.ctx = st.canvas ? st.canvas.getContext("2d") : null;
    if (!st.ctx) return;
    getKraken(); // optional boss artwork — the canvas falls back to emoji if missing
    var sky = st.ctx.createLinearGradient(0, 0, CANVAS_W, GROUND_Y);
    sky.addColorStop(0, "#090f19"); sky.addColorStop(1, "#280d1a");
    var floor = st.ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
    floor.addColorStop(0, "#291726"); floor.addColorStop(1, "#0c1018");
    g.sky = sky; g.floor = floor;

    var canvas = st.canvas;
    function down(e) {
      if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
      jumpStart(st);
    }
    function up() { jumpEnd(st); }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("lostpointercapture", up);
    canvas.addEventListener("pointercancel", up);

    var onKeyDown = function (e) { handleKeyDown(st, e); };
    var onKeyUp = function (e) { handleKeyUp(st, e); };
    var onVis = function () { if (st.game && st.game.state === "playing") pauseBattle(st); };
    var onBlur = function () { jumpEnd(st); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    st.controlsCleanup = function () {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("lostpointercapture", up);
      canvas.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
    };

    renderHud(st);
    renderOverlay(st);
    startLoop(st);
  }

  function controlsMarkup(st) {
    var g = st.game;
    if (!g) return "";
    var jet = "";
    if (hasJetpack()) {
      var flying = g.jetpackActive && now() < g.jetpackEnd;
      var cool = Math.max(0, Math.ceil((g.jetpackCooldownEnd - now()) / 1000));
      var cls = flying
        ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white border-cyan-300 ring-2 ring-cyan-400 animate-pulse"
        : cool > 0
          ? "bg-neutral-800/80 text-neutral-400 border-neutral-700 cursor-not-allowed opacity-75"
          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/50";
      jet = '<button type="button" data-act="jetpack" class="py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 border cursor-pointer ' + cls + '"' +
        (flying || cool > 0 ? ' disabled' : '') +
        ' title="Activate 3-second sustained rocket flight! (Hold Space or click)">' + ico("rocket", 14, flying ? "animate-bounce" : "") +
        '<span>' + (flying ? 'FLYING (' + Math.max(0, (g.jetpackEnd - now()) / 1000).toFixed(1) + 's)'
          : cool > 0 ? 'Cooldown (' + cool + 's)' : '🚀 JETPACK (Hold Space)') + '</span></button>';
    } else {
      jet = '<button type="button" data-act="buyjet" class="py-3 bg-gradient-to-r from-cyan-950 via-neutral-900 to-blue-950 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm" title="Purchase Quantum Jetpack for ' + JETPACK_COST + ' GIS Points">' +
        ico("rocket", 14, "text-cyan-400") + '<span>Get Jetpack (' + JETPACK_COST + '✦)</span></button>';
    }
    return '<div class="boss-controls" role="group" aria-label="Combat controls">' +
      '<button type="button" data-act="jump" class="py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer active:scale-95 shadow-sm" title="Tap or Space to Jump · Hold or Long Press for Jetpack 🚀"><span>Jump</span><kbd>Space</kbd></button>' +
      '<button type="button" data-act="shoot" class="py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm" title="Press &apos;F&apos; or click to Shoot (Can destroy enemy projectiles!)">' + ico("crosshair", 16) + '<span>Shoot · <span id="eb-ammo">' + g.ammo + '</span></span><kbd>F</kbd></button>' +
      jet +
      '<button type="button" data-act="refill" class="py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm" title="Press &apos;R&apos; key to refill ammo and heal HP!">' + ico("refresh-cw", 14) + '<span>Refill</span><kbd>R</kbd></button>' +
      '</div>';
  }

  function syncControls(st) {
    if (!st.content) return;
    var host = st.content.querySelector("#eb-controls-host");
    if (!host) return;
    var playing = !!(st.game && st.game.state === "playing");
    var want = playing ? controlsMarkup(st) : "";
    if (host.innerHTML !== want) host.innerHTML = want;
  }

  function renderHud(st) {
    var g = st.game;
    if (!g || st.screen !== "battle" || !st.content) return;
    var bar = st.content.querySelector("#eb-hud");
    if (!bar) return;
    var pct = clamp(g.bossHp / g.boss.maxHp * 100, 0, 100);
    var ghost = clamp(g.ghostHp / g.boss.maxHp * 100, 0, 100);
    var isCritical = pct <= 30, isEnraged = pct <= 60 && pct > 30;
    var elapsed = now() - g.lastQuestion;
    var eta = Math.max(0, Math.ceil((g.attackInterval() - elapsed) / 1000));
    var charging = elapsed >= g.attackInterval() - 2200;
    var armour = getArmour(), char = getChar();
    var hpPct = clamp(g.playerHp / g.maxPlayerHp * 100, 0, 100);
    var isQuestion = g.state === "question" || g.state === "revive";
    var phaseBadge;
    if (isCritical) {
      phaseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">' +
        ico("flame", 12, "text-rose-500") + ' CRITICAL DESPERATION PHASE</span>';
    } else if (isEnraged) {
      phaseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">' +
        ico("alert-triangle", 12, "text-amber-400") + ' ENRAGED PHASE</span>';
    } else {
      phaseBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">' +
        'STAGE ' + g.stage + ' · LOOP ' + g.boss.loop + '</span>';
    }
    var threatCls = g.rage > 0
      ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
      : "bg-neutral-700/40 text-neutral-400 border-neutral-600";
    var barCls = isCritical
      ? "bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 animate-pulse"
      : isEnraged
        ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400"
        : "bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-400";
    var out = [];

    out.push('<div class="boss-enemy-hud relative overflow-hidden text-white">' +
      '<div class="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500" style="background-color:' + g.boss.color + '"></div>' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">' +
        '<div class="flex items-center gap-3">' +
          '<span class="text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">' + esc(g.boss.icon) + '</span>' +
          '<div><div class="flex items-center gap-2">' +
            '<span class="font-extrabold text-base sm:text-lg tracking-wide uppercase font-academic-serif">' + esc(g.boss.name) + '</span>' +
            phaseBadge +
            '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ' + threatCls + '" title="Every correct answer enrages the boss: faster projectiles and shorter attack intervals.">⚡ THREAT LV ' + g.rage + '</span>' +
          '</div><div class="text-[11px] text-neutral-400 font-mono">' + esc(g.boss.scaledTitle) + '</div></div>' +
        '</div>' +
        '<div class="text-right sm:text-right font-mono">' +
          '<div class="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">' + g.bossHp + ' <span class="text-xs font-normal text-neutral-400">/ ' + g.boss.maxHp + ' HP</span></div>' +
          '<div class="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">' + Math.round(pct) + '% Health Remaining</div>' +
        '</div></div>' +
      '<div role="progressbar" aria-label="Boss health" aria-valuemin="0" aria-valuemax="' + g.boss.maxHp + '" aria-valuenow="' + g.bossHp + '" class="relative w-full h-6 sm:h-7 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700/80 shadow-inner p-0.5">' +
        '<div class="absolute inset-0 pointer-events-none z-20 flex justify-between px-[25%] opacity-40">' +
          '<div class="w-0.5 h-full bg-white/40 shadow-xs"></div><div class="w-0.5 h-full bg-white/40 shadow-xs"></div></div>' +
        '<div class="absolute top-0.5 bottom-0.5 left-0.5 rounded-xl transition-all duration-700 ease-out bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 opacity-70" style="width:' + ghost + '%"></div>' +
        '<div class="relative h-full rounded-xl transition-all duration-150 ease-out z-10 shadow-lg ' + barCls + '" style="width:' + pct + '%">' +
          '<div class="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-40"></div>' +
        '</div></div>' +
      '<div class="flex items-center justify-between text-xs mt-2 text-neutral-400 font-mono">' +
        '<span class="text-[11px]">' + (charging
          ? '<span class="text-amber-400 font-bold animate-pulse flex items-center gap-1">⚡ 129-QUESTION SPECIAL STRIKE CHARGING!</span>'
          : '<span>Next Special Strike: Timed Business Question</span>') + '</span>' +
        '<span class="text-[11px] text-neutral-400">' + (isQuestion ? 'Question round' : 'Next question in ' + eta + 's') + '</span>' +
      '</div></div>');

    out.push('<div class="boss-player-hud">' +
      '<div class="flex items-center gap-2">' +
        '<span class="text-xl">' + esc(char.icon) + '</span>' +
        '<div><div class="font-bold text-neutral-900 dark:text-white flex items-center gap-2">' +
          '<span>' + esc(char.name) + '</span>' +
          '<span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">(' + esc(armour.name) + ' · takes ' + armour.damagePerHit + ' dmg)</span>' +
        '</div><div class="text-[11px] text-neutral-500">HP: ' + g.playerHp + ' / ' + g.maxPlayerHp + '</div></div>' +
      '</div>' +
      '<div class="flex items-center gap-4">' +
        '<div class="w-32 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">' +
          '<div class="h-full bg-emerald-500 transition-all duration-300" style="width:' + hpPct + '%"></div></div>' +
        '<div class="flex items-center gap-2 font-mono"><span>Ammo: ' + g.ammo + '/' + g.maxAmmo + '</span>' +
          (g.ammo <= 4 ? '<button type="button" data-act="refill" class="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold cursor-pointer">Refill 15✦</button>' : '') +
        '</div>' +
        '<div class="boss-player-lives">' + ico("heart", 16) + ' ' + g.lives + ' ' + (g.lives === 1 ? 'extra life' : 'extra lives') + ' · ' + g.tokens + '/3 tokens</div>' +
      '</div></div>');

    var hudHtml = out.join("");
    if (hudHtml !== st._hudHtml) { bar.innerHTML = hudHtml; st._hudHtml = hudHtml; }
    var jetHost = st.content.querySelector("#eb-jetstat");
    if (jetHost) {
      var jetHtml = "";
      if (!hasJetpack()) jetHtml = "";
      else {
        var flying = g.jetpackActive && now() < g.jetpackEnd;
        var cool = Math.max(0, Math.ceil((g.jetpackCooldownEnd - now()) / 1000));
        jetHtml = '<div class="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-2">' +
          (flying
            ? '<div class="px-3 py-1 rounded-full bg-cyan-500/35 border border-cyan-400 text-cyan-100 font-mono text-xs font-black flex items-center gap-1.5 shadow-xl animate-pulse backdrop-blur-md">' + ico("rocket", 14, "text-cyan-300 animate-bounce") + '<span>JETPACK ACTIVE: ' + Math.max(0, (g.jetpackEnd - now()) / 1000).toFixed(1) + 's</span></div>'
            : cool > 0
              ? '<div class="px-2.5 py-0.5 rounded-full bg-black/60 border border-neutral-700 text-neutral-400 font-mono text-[10px] flex items-center gap-1 backdrop-blur-sm"><span>⏳ Thruster Cool: ' + cool + 's</span></div>'
              : '<div class="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] flex items-center gap-1 backdrop-blur-sm">' + ico("rocket", 12, "text-cyan-400") + '<span>Jetpack Ready [Shift / W]</span></div>') +
          '</div>';
      }
      if (jetHtml !== st._jetHtml) { jetHost.innerHTML = jetHtml; st._jetHtml = jetHtml; }
    }
    var score = st.content.querySelector("#eb-score");
    if (score) score.textContent = g.score.toLocaleString() + " score";
    var ammo = st.content.querySelector("#eb-ammo");
    if (ammo) ammo.textContent = g.ammo;
  }

  /* ------------------------------------------------------------------ */
  /* Local "flag issue" dialog (port of FlagQuestionButton)              */
  /* ------------------------------------------------------------------ */

  function flagButtonMarkup(st, questionId) {
    var f = st.flag, i, html = "";
    if (f.state === "done") {
      html = '<span class="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">✓ Flag saved on this device</span>';
    } else if (isQuestionFlagged(questionId)) {
      html = '<span class="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">✓ Flagged locally</span>';
    } else {
      html = '<button type="button" data-act="flagopen" title="Save an issue note on this device" aria-haspopup="dialog" aria-expanded="' + (f.open ? "true" : "false") +
        '" class="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--line)] hover:bg-[var(--sheet-surface)] hover:text-[var(--ink)] dark:hover:bg-neutral-800 dark:hover:text-neutral-200">⚑ Flag issue</button>';
    }
    if (f.open) {
      html += '<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">' +
        '<button type="button" data-act="flagclose" aria-label="Close report dialog" class="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></button>' +
        '<div role="dialog" aria-modal="true" aria-labelledby="flag-question-title" class="relative m-0 w-full max-w-md rounded-t-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white sm:m-4 sm:rounded-2xl">' +
          '<div class="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">' +
            '<h3 id="flag-question-title" class="flex items-center gap-2 font-academic-serif text-base font-bold text-[var(--green)] dark:text-white">⚑ Flag question locally</h3>' +
            '<button type="button" data-act="flagclose" aria-label="Close" class="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">✕</button>' +
          '</div>' +
          '<p class="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">' + esc(questionId) + '</p>' +
          '<p class="mt-2 text-xs text-neutral-600 dark:text-neutral-300">This note is saved in this browser for your reference.</p>' +
          '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">What&apos;s wrong?</legend>' +
            '<div class="mt-1.5 grid grid-cols-2 gap-1.5">';
      for (i = 0; i < FLAG_REASONS.length; i++) {
        html += '<label data-act="flagreason" data-value="' + esc(FLAG_REASONS[i]) + '" class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-all ' +
          (f.reason === FLAG_REASONS[i] ? 'border-[var(--green)] bg-[var(--green)] text-white dark:border-[#38BDF8] dark:bg-[#38BDF8] dark:text-[#0F172A]' : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-700') + '">' +
          '<input type="radio" data-act="flagreason" name="flag-reason" value="' + esc(FLAG_REASONS[i]) + '"' + (f.reason === FLAG_REASONS[i] ? ' checked' : '') + ' class="sr-only" />' + esc(FLAG_REASONS[i]) + '</label>';
      }
      html += '</div></fieldset>' +
          '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">How sure are you?</legend>' +
            '<div class="mt-1.5 inline-flex w-full rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800" role="radiogroup" aria-label="Confidence level">';
      for (i = 0; i < FLAG_CONFIDENCES.length; i++) {
        html += '<button type="button" data-act="flagconf" data-value="' + esc(FLAG_CONFIDENCES[i]) + '" role="radio" aria-checked="' + (f.confidence === FLAG_CONFIDENCES[i]) +
          '" class="flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ' +
          (f.confidence === FLAG_CONFIDENCES[i] ? 'bg-white text-[var(--green)] shadow-sm dark:bg-neutral-900 dark:text-[#38BDF8]' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200') + '">' + esc(FLAG_CONFIDENCES[i]) + '</button>';
      }
      html += '</div></fieldset>' +
          '<label class="mt-3 block text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400" for="flag-note">Note (optional)</label>' +
          '<textarea id="flag-note" data-act="flagnote" rows="2" maxlength="' + FLAG_MAX_NOTE + '" placeholder="What exactly is wrong? e.g. option B and the mark scheme disagree about the formula…" class="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[var(--green)] focus:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">' + esc(f.note) + '</textarea>' +
          '<div class="mt-4 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">' +
            '<span id="eb-flag-count" class="font-mono text-[10px] text-neutral-400">' + f.note.length + '/' + FLAG_MAX_NOTE + '</span>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" data-act="flagclose" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>' +
              '<button type="button" data-act="flagsave" class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--green)] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90">⚑ Save on this device</button>' +
            '</div></div>';
      if (f.state === "error") {
        html += '<p role="alert" class="mt-2 text-[10px] font-semibold text-rose-600 dark:text-rose-400">This browser could not save your note. Check whether site storage is available, then try again.</p>';
      }
      html += '</div></div>';
    }
    return html;
  }

  function renderFlagHost(st) {
    if (!st.content) return;
    var host = st.content.querySelector("#eb-flag-host");
    if (!host) return;
    var qid = st.flag.questionId || (st.game && st.game.question ? st.game.question.id : "");
    host.innerHTML = flagButtonMarkup(st, qid);
  }

  function openFlagDialog(st, questionId) {
    st.flag.open = true;
    st.flag.questionId = questionId;
    st.flag.reason = FLAG_REASONS[0];
    st.flag.confidence = FLAG_CONFIDENCES[0];
    st.flag.note = "";
    st.flag.state = "idle";
    try { st._prevBodyOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; } catch (err) {}
    renderFlagHost(st);
    var note = st.content && st.content.querySelector("#flag-note");
    if (note && note.focus) { try { note.focus({ preventScroll: true }); } catch (err2) {} }
  }

  function closeFlagDialog(st, silent) {
    if (!st.flag.open) return;
    st.flag.open = false;
    try { if (document.body) document.body.style.overflow = st._prevBodyOverflow || ""; } catch (err) {}
    if (!silent) renderFlagHost(st);
  }

  function submitFlag(st) {
    var f = st.flag;
    if (f.state === "sending" || isQuestionFlagged(f.questionId)) return;
    f.state = "sending";
    try {
      saveLocalQuestionFlag({
        questionId: f.questionId, reason: f.reason,
        confidence: f.confidence, note: String(f.note || "").trim().slice(0, FLAG_MAX_NOTE)
      });
      f.state = "done";
      closeFlagDialog(st, true);
      renderFlagHost(st);
    } catch (err) {
      f.state = "error";
      renderFlagHost(st);
    }
  }

  function renderOverlay(st) {
    var g = st.game;
    if (!g || st.screen !== "battle" || !st.content) return;
    var box = st.content.querySelector("#eb-overlay");
    var qbox = st.content.querySelector("#eb-question");
    if (!box || !qbox) return;
    var html = "", qhtml = "", i;
    var questionRound = g.state === "question" || g.state === "revive";

    if (questionRound) {
      var q = g.question;
      if (!q) { qbox.innerHTML = ""; box.innerHTML = ""; return; }
      var revive = g.state === "revive";
      qhtml = '<section id="eb-question-section" tabindex="-1" aria-labelledby="boss-question-title" class="boss-question bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 rounded-2xl p-5 sm:p-6 text-white shadow-2xl ' +
        (revive ? 'border-emerald-500' : 'border-rose-500') + '">' +
        '<div class="flex items-center justify-between pb-3 border-b border-neutral-800">' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-2xl animate-bounce">' + (revive ? '❤️' : '⚡') + '</span>' +
            '<div><div class="text-[10px] font-mono font-bold uppercase tracking-wider ' + (revive ? 'text-emerald-400' : 'text-rose-400') + '">' +
              (revive
                ? 'REVIVE TRIAL · ' + g.reviveCorrect + '/' + REVIVE_REQUIRED + ' CORRECT · Q#' + esc(q.questionNumber)
                : 'Business question') +
            '</div><div class="text-xs font-semibold text-neutral-300">' +
              (revive
                ? 'Every answer must be correct. One mistake ends the run for good.'
                : 'A correct answer hits the boss. Choose A–D or press 1–4.') +
            '</div></div></div>' +
          '<div class="px-3 py-1.5 rounded-xl font-mono text-sm font-black flex items-center gap-1.5 border ' +
            (g.qTimer <= 5 ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-neutral-800 border-neutral-700 text-neutral-200') + '">' +
            '<span>⏱️</span><span id="eb-qtime">' + g.qTimer + 's</span></div>' +
        '</div>' +
        '<div class="py-4">' +
          '<div class="text-xs font-mono text-sky-400 mb-1 flex items-center gap-2">' +
            '<span class="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">0264 Business</span>' +
            '<span>' + esc(q.chapter) + '</span></div>' +
          '<h2 id="boss-question-title" class="font-academic-serif text-lg sm:text-2xl font-bold text-white leading-snug">' + esc(q.question) + '</h2>';
      if (revive) {
        qhtml += '<div class="mt-3 flex items-center gap-1">';
        for (i = 0; i < REVIVE_REQUIRED; i++) {
          qhtml += '<span class="h-1.5 flex-1 rounded-full transition-colors ' + (i < g.reviveCorrect ? 'bg-emerald-400' : 'bg-neutral-700') + '"></span>';
        }
        qhtml += '</div>';
      }
      qhtml += '</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">';
      for (i = 0; i < q.options.length; i++) {
        var isCorrect = i === q.correctIndex;
        var btnStyle = "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700";
        if (g.feedback) {
          if (isCorrect) btnStyle = "bg-emerald-600 text-white border-emerald-400 shadow-md font-bold";
          else btnStyle = "bg-neutral-900 text-neutral-500 border-neutral-800 opacity-60";
        }
        qhtml += '<button type="button" data-act="answer" data-i="' + i + '"' + (g.feedback ? ' disabled' : '') +
          ' class="text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ' + btnStyle + '">' +
          '<span class="font-mono text-sky-400 mr-2 font-bold">' + LETTERS[i] + '.</span><span>' + esc(q.options[i]) + '</span></button>';
      }
      qhtml += '</div>';
      if (g.feedback) {
        qhtml += '<div role="status" class="mt-4 p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ' +
          (g.feedback.isCorrect ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-rose-950/60 border-rose-500 text-rose-200') + '">' +
          '<strong class="block font-bold mb-0.5">' + (g.feedback.isCorrect ? 'Correct' : 'Correct answer highlighted above') + '</strong>' +
          '<p>' + esc(g.feedback.text) + '</p>' +
          '<div class="mt-2 flex items-center justify-between gap-3">' +
            '<span id="eb-flag-host">' + flagButtonMarkup(st, q.id) + '</span>' +
            '<button type="button" id="eb-continue" data-act="continue" class="boss-cta boss-continue">Continue ' + ico("arrow-right", 16) + '</button>' +
          '</div></div>';
      }
      qhtml += '</section>';

    } else if (g.state === "paused") {
      html = '<div class="boss-pause"><h2>Battle paused</h2>' +
        '<div>' +
          '<button type="button" id="eb-resume" data-act="resume" class="boss-cta">' + ico("play", 16) + ' Resume battle</button>' +
          '<button type="button" data-act="lobby" class="boss-quiet">Leave fight</button>' +
        '</div></div>';

    } else if (g.state === "gameover") {
      var pct = clamp(g.bossHp / g.boss.maxHp * 100, 0, 100);
      var canRevive = !g.reviveUsed && (g.bestStreak >= 3 || pct <= 40);
      html = '<div class="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-fade-in overflow-y-auto">' +
        '<div class="text-4xl mb-1">💀</div>' +
        '<div class="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold mb-1">STAGE ' + g.stage + ' · LOOP ' + g.boss.loop + '</div>' +
        '<h3 class="text-xl sm:text-2xl font-black text-rose-500 mb-1">DEFEATED BY ' + esc(g.boss.name.toUpperCase()) + '</h3>';
      if (canRevive) {
        html += '<div class="mb-3 w-full max-w-md rounded-xl border border-emerald-500/50 bg-emerald-950/70 p-3 shadow-lg">' +
          '<div class="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">' +
            ico("sparkles", 14, "text-emerald-300") + ' Second Wind Available</div>' +
          '<p class="mt-1 text-[11px] leading-snug text-emerald-100/90">Best streak ' + g.bestStreak + ' · Boss at ' + Math.round(pct) + '% HP. Answer <strong>' + REVIVE_REQUIRED +
            ' questions in a row</strong> correctly to revive at full HP. One mistake ends the run for good.</p>' +
          '<button type="button" data-act="revive" class="mt-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer">' +
            '⚡ Revive Trial · ' + REVIVE_REQUIRED + ' Correct in a Row</button></div>';
      } else {
        html += '<p class="max-w-md text-[11px] leading-snug text-neutral-400 mb-3">' +
          (g.reviveUsed ? 'Revive trial already used this run.' : 'Build a 3+ answer streak or push the boss below 40% HP to unlock a revive trial.') + '</p>';
      }
      html += '<div class="flex flex-wrap items-center justify-center gap-2">' +
        '<button type="button" data-act="retry" class="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer">↺ Retry Stage ' + g.stage + '</button>' +
        '<button type="button" data-act="restart" class="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl transition cursor-pointer">Restart from Stage 1</button>' +
        '</div></div>';

    } else if (g.state === "victory") {
      var mult = (findById(DIFFICULTIES, g.diff) || DIFFICULTIES[0]).rewardMult;
      var reward = g.stageReward || 0;
      var scoreGain = Math.round((600 + g.stage * 180) * mult);
      html = '<div class="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">' +
        '<div class="text-5xl mb-2 animate-bounce">🏆</div>' +
        '<div class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">STAGE ' + g.stage + ' ASCENSION CONQUERED · LOOP ' + g.boss.loop + '</div>' +
        '<h3 class="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">' + esc(g.boss.name.toUpperCase()) + ' VANQUISHED!</h3>' +
        '<p class="text-xs text-emerald-200 max-w-md mb-2">Outstanding mastery! You fully drained ' + esc(g.boss.name) + "'s health bar on " + esc((findById(DIFFICULTIES, g.diff) || DIFFICULTIES[0]).label) + ' Tier!</p>' +
        '<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold mb-5 shadow-sm">' +
          (reward ? '<span>✦ +' + reward + ' GIS Points</span><span>·</span>' : '') + '<span>⭐ +' + scoreGain + ' Score</span></div>' +
        '<div class="flex flex-wrap items-center justify-center gap-3">' +
          '<button type="button" data-act="ascend" class="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition transform active:scale-95 cursor-pointer flex items-center gap-2">' +
            '<span>Ascend to Stage ' + (g.stage + 1) + ' (Harder Boss)</span>' + ico("chevron-right", 16) + '</button>' +
          '<button type="button" data-act="retry" class="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer">↺ Replay Stage ' + g.stage + '</button>' +
          '<button type="button" data-act="wardrobe" class="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer">Spend GIS Points in Wardrobe 🎨</button>' +
        '</div></div>';
    }

    qbox.innerHTML = qhtml;
    box.innerHTML = html;
    var wrap = st.content.querySelector("#eb-arena");
    if (wrap) { if (questionRound) wrap.setAttribute("hidden", "hidden"); else wrap.removeAttribute("hidden"); }
    syncControls(st);
    syncFocus(st, questionRound);
  }

  /* Keyboard/screen-reader focus follows the active part of the fight. */
  function syncFocus(st, questionRound) {
    var g = st.game;
    if (!g) return;
    if (st.canvas) st.canvas.setAttribute("tabindex", g.state === "playing" ? "0" : "-1");
    if (st.flag.open) return;
    var host = null, node;
    if (g.state === "playing") host = st.canvas;
    else if (g.state === "paused") host = st.content && st.content.querySelector("#eb-resume");
    else if (questionRound) {
      host = st.content && st.content.querySelector("#eb-question-section");
      if (host && host.scrollIntoView) { try { host.scrollIntoView({ block: "nearest" }); } catch (err) {} }
    }
    if (g.feedback) {
      node = st.content && st.content.querySelector("#eb-continue");
      if (node) host = node;
    }
    if (host && host.focus) {
      try { host.focus({ preventScroll: true }); }
      catch (err) { try { host.focus(); } catch (err2) {} }
    }
  }

  function beep(st, freq, type, duration, gainVal) {
    if (!st.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!st.actx) st.actx = new Ctx();
      var ctx = st.actx;
      if (ctx.state === "suspended" && ctx.resume) ctx.resume();
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal || 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  /* Original Web Audio cue helpers — same pitches, waveforms and gains. */
  function sJump(st) { beep(st, 360, "square", 0.15, 0.12); }
  function sShoot(st) { beep(st, 650, "sawtooth", 0.12, 0.1); }
  function sHit(st) { beep(st, 130, "triangle", 0.25, 0.25); }
  function sBossAttack(st) { beep(st, 220, "sawtooth", 0.3, 0.15); }
  function sBossHurt(st) { beep(st, 170, "sawtooth", 0.2, 0.15); }
  function sReviveStart(st) { beep(st, 440, "square", 0.4, 0.2); }
  function sCrit(st) {
    beep(st, 523, "sine", 0.1, 0.25);
    setTimeout(function () { if (!st.destroyed) beep(st, 659, "sine", 0.1, 0.25); }, 90);
    setTimeout(function () { if (!st.destroyed) beep(st, 784, "sine", 0.15, 0.25); }, 180);
    setTimeout(function () { if (!st.destroyed) beep(st, 1046, "square", 0.3, 0.3); }, 270);
  }
  function sJetpack(st) {
    if (!st.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!st.actx) st.actx = new Ctx();
      var ctx = st.actx;
      if (ctx.state === "suspended" && ctx.resume) ctx.resume();
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.35);
      osc.frequency.setValueAtTime(240, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.9);
    } catch (e) {}
  }

  function jumpStart(st) {
    var g = st.game;
    if (!g || g.state !== "playing") return;
    if (!g.holdStart) { g.holdStart = now(); g.holdTriggered = false; handleJump(st); }
  }
  function jumpEnd(st) {
    var g = st.game;
    if (!g) return;
    g.holdStart = 0; g.holdTriggered = false;
  }
  function handleJump(st) {
    var g = st.game;
    if (!g || g.state !== "playing") return;
    var p = g.player;
    if (!p.isJumping) { p.vy = -14.2; p.isJumping = true; sJump(st); }
  }
  function handleShoot(st) {
    var g = st.game;
    if (!g || g.state !== "playing") return;
    if (g.ammo <= 0) { addFloat(st, "NO AMMO! Press [R] to Refill 🎯", 150, 100, "#fbbf24"); return; }
    g.ammo--;
    var p = g.player;
    g.shots.push({ x: p.x + p.width, y: p.y + 18, vx: 14, color: "#38bdf8", id: Math.random() });
    sShoot(st);
    renderHud(st);
  }
  async function handleRefill(st) {
    var g = st.game;
    if (!g || (g.state !== "playing" && g.state !== "question")) return;
    if (await EC.spendPoints(15, "Boss Battle refill")) {
      g.ammo = g.maxAmmo;
      g.playerHp = Math.min(g.maxPlayerHp, g.playerHp + 25);
      sCrit(st);
      addFloat(st, "+" + g.maxAmmo + " Ammo & +25 HP Refilled! 🎯 [R]", 100, 110, "#10b981");
    } else {
      g.ammo = g.maxAmmo;
      sCrit(st);
      addFloat(st, "Emergency +" + g.maxAmmo + " Ammo Supplied! ⚡ [R]", 100, 110, "#38bdf8");
    }
    syncCoins(st);
    renderHud(st);
  }
  function handleJetpack(st) {
    var g = st.game;
    if (!g || g.state !== "playing") return;
    if (!hasJetpack()) { addFloat(st, "Unlock Jetpack in Armour Shop! (" + JETPACK_COST + "✦)", 150, 100, "#fbbf24"); return; }
    if (g.jetpackActive) return;
    if (now() < g.jetpackCooldownEnd) {
      var secLeft = Math.ceil((g.jetpackCooldownEnd - now()) / 1000);
      addFloat(st, "Jetpack cooling down (" + secLeft + "s)", 150, 100, "#fbbf24");
      return;
    }
    g.jetpackActive = true;
    g.jetpackEnd = now() + JETPACK_SECONDS * 1000;
    sJetpack(st);
    addFloat(st, "🚀 JETPACK ENGAGED! (" + JETPACK_SECONDS + "s)", g.player.x, g.player.y - 25, "#38bdf8");
  }

  function handleKeyDown(st, e) {
    var g = st.game;
    if (!g || st.screen !== "battle") return;
    if (st.flag.open) {
      if (e.key === "Escape") { e.preventDefault(); closeFlagDialog(st); }
      return;
    }
    var target = e.target;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (target && target.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

    if (g.state === "question" || g.state === "revive") {
      if (e.repeat || g.feedback) return;
      var key = String(e.key || "").toLowerCase();
      var idx = /^[1-4]$/.test(key) ? toInt(key, 1) - 1 : "abcd".indexOf(key);
      if (idx >= 0 && key.length === 1) { e.preventDefault(); answerQuestion(st, idx); }
      return;
    }
    if (g.state !== "playing") return;
    if (target && target.closest && target.closest("button, a")) return;
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault(); jumpStart(st);
    } else if (e.code === "KeyF" && !e.repeat) {
      e.preventDefault(); handleShoot(st);
    } else if (e.code === "KeyR" && !e.repeat) {
      e.preventDefault(); handleRefill(st);
    } else if ((e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyW" || e.code === "KeyJ") && !e.repeat) {
      e.preventDefault(); handleJetpack(st);
    } else if (e.code === "Escape" || e.code === "KeyP") {
      e.preventDefault(); pauseBattle(st);
    }
  }
  function handleKeyUp(st, e) {
    if (e.code === "Space" || e.code === "ArrowUp") jumpEnd(st);
  }

  /* Floating combat text lives in the DOM, not on the canvas (as in the
   * original React arena): animate-bounce + a drop shadow, gone after 1.3s. */
  function addFloat(st, text, x, y, color) {
    var host = st.content && st.content.querySelector("#eb-floats");
    if (!host) return;
    var el = document.createElement("div");
    el.className = "absolute pointer-events-none font-extrabold text-sm sm:text-base animate-bounce";
    el.style.left = x + "px";
    el.style.top = y + "px";
    var span = document.createElement("span");
    span.style.color = color || "#ef4444";
    span.className = "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";
    span.textContent = text;
    el.appendChild(span);
    host.appendChild(el);
    var timer = setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      var k = st.floatTimers.indexOf(timer);
      if (k !== -1) st.floatTimers.splice(k, 1);
    }, 1300);
    st.floatTimers.push(timer);
    if (st.floatTimers.length > 24) clearTimeout(st.floatTimers.shift());
  }

  /* ------------------------------------------------------------------ */
  /* Main canvas loop                                                     */
  /* ------------------------------------------------------------------ */

  function startLoop(st) {
    var g = st.game;
    if (!g || st.screen !== "battle" || g.state !== "playing" || st.raf || st.destroyed) return;
    st.lastTs = 0;
    st.raf = requestAnimationFrame(function (ts) { frame(st, ts); });
  }
  function stopLoop(st) {
    if (st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; }
    st.lastTs = 0;
  }

  function frame(st, ts) {
    st.raf = 0;
    var g = st.game;
    if (!g || st.screen !== "battle" || g.state !== "playing" || st.destroyed) return;
    var canvas = st.canvas, ctx = st.ctx;
    if (!canvas || !ctx || !document.body || !document.body.contains(canvas)) { stopLoop(st); return; }
    var dt = st.lastTs ? clamp((ts - st.lastTs) / 16.6667, 0.2, 2) : 1;
    st.lastTs = ts;
    var t = now(), i, j;

    ctx.save();
    if (g.shake > 0) {
      ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      g.shake *= 0.85;
      if (g.shake < 0.5) g.shake = 0;
    }
    if (g.ghostHp > g.bossHp) g.ghostHp = Math.max(g.bossHp, g.ghostHp - 1.8 * dt);

    /* Arena background */
    ctx.fillStyle = g.sky; ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);
    ctx.fillStyle = g.floor; ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
    ctx.strokeStyle = "rgba(244,117,129,0.22)"; ctx.lineWidth = 1;
    var off = (ts / 20) % 30;
    for (i = -30; i < CANVAS_W + 30; i += 30) {
      ctx.beginPath(); ctx.moveTo(i - off, GROUND_Y); ctx.lineTo(i - off - 25, CANVAS_H); ctx.stroke();
    }
    ctx.strokeStyle = "#ef647c"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke();

    /* Player physics */
    var p = g.player;
    var flying = g.jetpackActive && t < g.jetpackEnd;
    if (g.jetpackActive && !flying) { g.jetpackActive = false; g.jetpackCooldownEnd = t + 7000; }
    if (g.holdStart && !g.holdTriggered && t - g.holdStart >= 260) {
      g.holdTriggered = true;
      if (hasJetpack()) handleJetpack(st);
      else addFloat(st, "🚀 Hold to Fly! Get Jetpack in Shop (" + JETPACK_COST + "✦)", p.x, p.y - 25, "#fbbf24");
    }
    if (flying) {
      if (p.y > 72) p.vy = Math.max(-5.5, p.vy - 1.2 * dt);
      else p.vy = Math.sin(t / 140) * 0.9;
      p.isJumping = true;
      p.y += p.vy * dt;
      if (p.y < 35) { p.y = 35; p.vy = 0; }
      p.rotation = Math.sin(t / 180) * 0.08;
    } else {
      p.vy += 0.65 * dt;
      p.y += p.vy * dt;
      if (p.y >= GROUND_Y - p.height) {
        p.y = GROUND_Y - p.height; p.vy = 0; p.isJumping = false; p.rotation = 0;
      } else p.rotation = p.vy * 0.03;
    }

    /* Player sprite */
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    ctx.rotate(p.rotation);
    if (t < g.invincibleUntil) ctx.globalAlpha = Math.sin(t / 40) > 0 ? 0.35 : 0.85;
    var bob = p.isJumping ? 0 : Math.sin(ts / 80) * 2;
    var character = getChar();
    if (character.custom) drawScholar(ctx, bob);
    else {
      if (character.flip) ctx.scale(-1, 1);
      ctx.font = "38px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(character.icon, 0, bob);
    }
    if (hasJetpack()) drawJetpack(ctx, bob, flying);
    ctx.restore();
    var altitude = Math.max(0, GROUND_Y - p.height - p.y);
    var shadowScale = Math.max(0.28, 1 - altitude / 180);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0," + (0.35 * shadowScale).toFixed(2) + ")";
    ctx.beginPath();
    ctx.ellipse(p.x + p.width / 2, GROUND_Y + 4, 16 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();

    /* Boss sprite */
    var bossX = CANVAS_W - 95;
    var bossY = GROUND_Y - 85 + Math.sin(ts / 250) * 8;
    ctx.save();
    if (g.flash > 0) { ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 25; g.flash--; }
    var img = krakenImage;
    if (g.stage % BOSSES.length === 1 && img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, bossX - 68, bossY - 34, 136, 136);
    } else {
      ctx.font = "68px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(g.boss.icon, bossX, bossY + 30);
    }
    ctx.restore();

    /* Boss attack spawning */
    if (t - g.lastBossAttack >= g.cadence()) {
      g.lastBossAttack = t;
      sBossAttack(st);
      spawnAttack(st);
      if (g.diff === "nightmare" && Math.random() < 0.2) g.pendingSalvo = t + 1400;
    }
    if (g.pendingSalvo && t >= g.pendingSalvo) {
      g.pendingSalvo = 0;
      spawnAttack(st, Math.random() < 0.5 ? "high" : "low");
    }

    /* Boss projectiles */
    for (i = g.attacks.length - 1; i >= 0; i--) {
      var ba = g.attacks[i];
      ba.x += ba.vx * dt;
      ba.rotation += 0.12 * dt;
      if (ba.tier === "wave") {
        ba.y = ba.baseY + Math.sin((CANVAS_W - ba.x) * ba.waveFreq) * ba.waveAmp;
      }
      drawAttack(ctx, ba, g);
      if (t >= g.invincibleUntil) {
        var pHurt = { x: p.x + 8, y: p.y + 6, w: p.width - 16, h: p.height - 12 };
        var bHit = { x: ba.x + 4, y: ba.y + 4, w: ba.width - 8, h: ba.height - 8 };
        if (pHurt.x < bHit.x + bHit.w && pHurt.x + pHurt.w > bHit.x &&
            pHurt.y < bHit.y + bHit.h && pHurt.y + pHurt.h > bHit.y) {
          g.attacks.splice(i, 1);
          g.invincibleUntil = t + 850;
          sHit(st);
          var armour = getArmour(), dmg = armour.damagePerHit;
          if (g.playerHp - dmg > 0) {
            g.playerHp -= dmg;
          } else if (g.lives > 0) {
            g.lives--; g.playerHp = g.maxPlayerHp;
            addFloat(st, "Extra life used", 150, 100, "#10b981");
          } else {
            g.playerHp = 0;
            endGame(st); ctx.restore(); return;
          }
          addFloat(st, "-" + dmg + " HP! (Armour: " + armour.name + ")", p.x, p.y - 12, "#ef4444");
          continue;
        }
      }
      if (ba.x + ba.width < 0) { g.attacks.splice(i, 1); g.score += 15; }
    }

    /* Player projectiles */
    for (i = g.shots.length - 1; i >= 0; i--) {
      var shot = g.shots[i];
      shot.x += shot.vx * dt;
      ctx.save();
      ctx.fillStyle = shot.color; ctx.shadowColor = shot.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(shot.x, shot.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      var deflected = false;
      for (j = g.attacks.length - 1; j >= 0; j--) {
        var enemy = g.attacks[j];
        var dx = shot.x - (enemy.x + enemy.width / 2), dy = shot.y - (enemy.y + enemy.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < 24) {
          g.attacks.splice(j, 1); g.shots.splice(i, 1);
          sHit(st);
          addFloat(st, "DEFLECTED! 💥", enemy.x, enemy.y - 12, "#38bdf8");
          g.score += 30; deflected = true; break;
        }
      }
      if (deflected) continue;
      if (shot.x >= bossX - 25) {
        g.shots.splice(i, 1);
        sBossHurt(st);
        var hitDamage = Math.round(18 * studyBonus().damage);
        g.bossHp = Math.max(0, g.bossHp - hitDamage);
        g.flash = 3; g.score += 35;
        addFloat(st, "-" + hitDamage + " Hit!", bossX - 20, bossY - 20, "#38bdf8");
        if (g.bossHp <= 0) { finishStage(st); ctx.restore(); return; }
        continue;
      }
      if (shot.x > CANVAS_W) g.shots.splice(i, 1);
    }

    /* Floating combat text is rendered as DOM nodes over the arena. */

    /* Question special strike */
    if (t - g.lastQuestion >= g.attackInterval()) {
      g.lastQuestion = t;
      triggerQuestion(st, false);
      ctx.restore(); return;
    }
    if (t - g.lastHud > 200) { g.lastHud = t; renderHud(st); }
    ctx.restore();
    st.raf = requestAnimationFrame(function (next) { frame(st, next); });
  }

  /* Wardrobe palettes (id -> [primary, secondary]) mirrored from
   * src/lib/data/customizer-items.ts so the arena draws the equipped items. */
  var AV_SKINS = {
    "skin-1": "#F7D0B3", "skin-2": "#E8B18A", "skin-3": "#D19C74",
    "skin-4": "#A76E43", "skin-5": "#7B4B27", "skin-6": "#4B2810",
    "skin-7": "#38BDF8", "skin-8": "#FDE047", "skin-9": "#0F0A1E"
  };
  var AV_HAIR = {
    "hair-1": ["#2B2118"], "hair-2": ["#171717"], "hair-3": ["#451A03"],
    "hair-4": ["#3B2219"], "hair-5": ["#1C1917"], "hair-6": ["#0A0A0A"],
    "hair-7": ["#DC2626"], "hair-8": ["#78350F"], "hair-9": ["#F1F5F9"],
    "hair-10": ["#06B6D4"], "hair-11": ["#B91C1C"], "hair-12": ["#E2E8F0"],
    "hair-13": ["#CBD5E1", "#FDE047"], "hair-14": ["#2E1065", "#A78BFA"],
    "hair-15": ["#22D3EE"]
  };
  var AV_TOP = {
    "top-1": ["#F8FAFC", "#CBD5E1"], "top-2": ["#0F2042", "#F59E0B"],
    "top-3": ["#881337", "#FDE68A"], "top-4": ["#047857", "#FEF08A"],
    "top-5": ["#0284C7", "#FFFFFF"], "top-6": ["#78350F", "#451A03"],
    "top-7": ["#7C3AED", "#C4B5FD"], "top-8": ["#1E293B", "#FBBF24"],
    "top-9": ["#991B1B", "#FDE047"], "top-10": ["#06B6D4", "#A855F7"],
    "top-11": ["#312E81", "#E0E7FF"], "top-12": ["#064E3B", "#FDE68A"],
    "top-13": ["#0F172A", "#22D3EE"], "top-14": ["#1C1917", "#FDE047"],
    "top-15": ["#0E7490", "#67E8F9"]
  };
  var AV_BOTTOM = {
    "bot-1": ["#334155"], "bot-2": ["#1E293B"], "bot-3": ["#2563EB"],
    "bot-4": ["#D97706"], "bot-5": ["#991B1B", "#1E293B"],
    "bot-6": ["#0F172A", "#38BDF8"], "bot-7": ["#3F6212"], "bot-8": ["#78350F"],
    "bot-9": ["#020617", "#E2E8F0"], "bot-10": ["#0369A1", "#06B6D4"],
    "bot-11": ["#111827", "#E2E8F0"], "bot-12": ["#991B1B", "#111827"],
    "bot-13": ["#1E293B", "#38BDF8"], "bot-14": ["#422006", "#FBBF24"],
    "bot-15": ["#334E68", "#E2E8F0"]
  };
  var AV_SHOE = {
    "shoe-1": ["#1E293B"], "shoe-2": ["#F8FAFC"], "shoe-3": ["#B45309"],
    "shoe-4": ["#DC2626", "#111827"], "shoe-5": ["#09090B"],
    "shoe-6": ["#E2E8F0", "#3B82F6"], "shoe-7": ["#4C0519"],
    "shoe-8": ["#CA8A04", "#FEF08A"], "shoe-9": ["#0284C7", "#38BDF8"],
    "shoe-10": ["#38BDF8", "#F0FDFA"], "shoe-11": ["#0B0B0F"],
    "shoe-12": ["#7F1D1D", "#FDE68A"], "shoe-13": ["#082F49", "#38BDF8"],
    "shoe-14": ["#1F2937", "#F97316"], "shoe-15": ["#134E4A", "#34D399"]
  };

  /* Canvas roundRect with a fallback for older browsers. */
  function ctxRoundRect(ctx, x, y, w, h, r) {
    var rr = typeof r === "number" ? r : (r && r[0]) || 0;
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, rr); return; }
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function drawScholar(ctx, bob) {
    var custom = EC.store.get("avatar_customization", {}) || {};
    var skin = AV_SKINS[custom.skinToneId] || AV_SKINS["skin-1"];
    var hair = AV_HAIR[custom.hairId] || AV_HAIR["hair-1"];
    var top = AV_TOP[custom.topId] || AV_TOP["top-1"];
    var bottom = AV_BOTTOM[custom.bottomId] || AV_BOTTOM["bot-1"];
    var shoe = AV_SHOE[custom.shoeId] || AV_SHOE["shoe-1"];
    var hairColor = hair[0], hairDark = hair[1] || "rgba(0,0,0,0.4)";
    var hy = bob, angle, bx, by, i, coils;

    /* Legs / trousers */
    ctx.fillStyle = bottom[0];
    ctx.fillRect(-8, 6 + bob, 6, 14); ctx.fillRect(2, 6 + bob, 6, 14);
    if (bottom[1]) {
      ctx.fillStyle = bottom[1];
      ctx.fillRect(-8, 17 + bob, 6, 2); ctx.fillRect(2, 17 + bob, 6, 2);
    }
    /* Shoes */
    ctx.fillStyle = shoe[0];
    ctx.fillRect(-9, 18 + bob, 8, 4); ctx.fillRect(1, 18 + bob, 8, 4);
    if (shoe[1]) {
      ctx.fillStyle = shoe[1];
      ctx.fillRect(-9, 21 + bob, 8, 1); ctx.fillRect(1, 21 + bob, 8, 1);
    }
    /* Shirt / torso */
    ctx.fillStyle = top[0];
    ctxRoundRect(ctx, -10, -8 + bob, 20, 16, 4);
    ctx.fill();
    /* Tie (with the equipped top's secondary accent) */
    ctx.fillStyle = "#166534";
    ctx.fillRect(-2, -7 + bob, 4, 14);
    if (top[1]) { ctx.fillStyle = top[1]; ctx.fillRect(-2, -7 + bob, 4, 3); }
    /* Head / face and eye */
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(0, -14 + bob, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0F172A";
    ctx.beginPath(); ctx.arc(3, -15 + bob, 1.6, 0, Math.PI * 2); ctx.fill();

    /* Hair — every wardrobe style has its own silhouette */
    ctx.fillStyle = hairColor;
    switch (custom.hairId) {
      case "hair-1": // Scholar Side-Part
        ctx.beginPath(); ctx.ellipse(0, -16 + hy, 9.3, 6.9, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = hairDark; ctx.fillRect(-4.6, -22.6 + hy, 1.7, 5.6);
        break;
      case "hair-2": // Academic Neat Crop
        ctxRoundRect(ctx, -8.6, -22.4 + hy, 17.2, 5.6, 2.4); ctx.fill();
        ctx.fillRect(-8.6, -18 + hy, 17.2, 2.4);
        break;
      case "hair-3": // Messy Revision Curls
        coils = [[-8, -16, 3.6], [-4.6, -20.4, 3.8], [0.2, -22.4, 4], [4.9, -20.4, 3.8], [8.8, -16.2, 3.5]];
        for (i = 0; i < coils.length; i++) {
          ctx.beginPath(); ctx.arc(coils[i][0], coils[i][1] + hy, coils[i][2], 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.ellipse(0, -13.4 + hy, 9.3, 4.7, 0, Math.PI, 0); ctx.fill();
        break;
      case "hair-4": // Modern Textured Quiff
        ctx.beginPath(); ctx.ellipse(0, -16 + hy, 9.2, 6.3, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-8.4, -17.2 + hy);
        ctx.quadraticCurveTo(-1, -27.5 + hy, 10, -19.5 + hy);
        ctx.quadraticCurveTo(2.5, -22.4 + hy, -8.4, -13.6 + hy);
        ctx.closePath(); ctx.fill();
        break;
      case "hair-5": // Sleek High Ponytail
        ctx.beginPath(); ctx.ellipse(0, -16 + hy, 9, 6.7, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8.3, -17.6 + hy);
        ctx.quadraticCurveTo(14.5, -13 + hy, 11.2, -2.5 + hy);
        ctx.quadraticCurveTo(8.6, -10.5 + hy, 5.4, -14 + hy);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#BE123C";
        ctx.beginPath(); ctx.ellipse(8.3, -18 + hy, 2.4, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();
        break;
      case "hair-6": // Curly High-Top Fade
        ctxRoundRect(ctx, -7.6, -25 + hy, 15.2, 9.6, 3); ctx.fill();
        coils = [[-5.4, -24.6, 2.4], [0, -25.9, 2.6], [5.4, -24.6, 2.4]];
        for (i = 0; i < coils.length; i++) {
          ctx.beginPath(); ctx.arc(coils[i][0], coils[i][1] + hy, coils[i][2], 0, Math.PI * 2); ctx.fill();
        }
        break;
      case "hair-7": // Spiky Anime Protagonist
        ctx.beginPath(); ctx.ellipse(0, -15 + hy, 9.2, 5.2, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-9.4, -16.6 + hy);
        var spikes = [-7.2, -4.4, -1.6, 1.4, 4.2, 7.1];
        for (i = 0; i < spikes.length; i++) {
          ctx.lineTo(spikes[i] + 1, (-22.5 - (i % 2) * 4) + hy);
          ctx.lineTo(spikes[i] + 2.2, -16.6 + hy);
        }
        ctx.closePath(); ctx.fill();
        break;
      case "hair-8": // Regal Braided Crown
        ctx.beginPath(); ctx.ellipse(0, -15.5 + hy, 9.2, 6.1, 0, Math.PI, 0); ctx.fill();
        for (i = 0; i <= 10; i++) {
          angle = Math.PI - (i / 10) * Math.PI;
          bx = Math.cos(angle) * 7.5;
          by = -15.5 + hy - Math.sin(angle) * 6.1;
          ctx.beginPath(); ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? hairDark : hairColor; ctx.fill();
        }
        ctx.fillStyle = hairColor;
        break;
      case "hair-9": // Platinum Valedictorian
        ctx.beginPath(); ctx.ellipse(0, -16 + hy, 9.5, 7.1, 0, Math.PI, 0); ctx.fill();
        ctx.fillRect(-9.6, -15 + hy, 4.5, 16); ctx.fillRect(5.1, -15 + hy, 4.5, 16);
        break;
      case "hair-10": // Cyber Matrix Mohawk
        ctx.beginPath(); ctx.ellipse(0, -14.8 + hy, 9.2, 4.8, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-2.6, -17 + hy);
        ctx.lineTo(-2.2, -27.5 + hy); ctx.lineTo(0, -20.5 + hy);
        ctx.lineTo(2.2, -29 + hy); ctx.lineTo(4.4, -17 + hy);
        ctx.closePath(); ctx.fill();
        break;
      case "hair-11": // Crimson Comet Side-Sweep
        ctx.beginPath(); ctx.ellipse(0, -16 + hy, 9.3, 6.6, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-9.2, -16 + hy);
        ctx.quadraticCurveTo(-2, -25 + hy, 10.2, -19 + hy);
        ctx.lineTo(10.2, -16 + hy);
        ctx.quadraticCurveTo(0, -20.8 + hy, -9.2, -12.6 + hy);
        ctx.closePath(); ctx.fill();
        break;
      case "hair-12": // Examiner's Silver Sweep
        ctxRoundRect(ctx, -8.8, -22.6 + hy, 17.6, 6.4, 1.6); ctx.fill();
        ctx.fillRect(-8.8, -17.6 + hy, 17.6, 2.2);
        break;
      case "hair-13": // Chairman's Platinum Wave
        ctx.beginPath(); ctx.ellipse(0, -16.4 + hy, 9.4, 6.8, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-9, -18.5 + hy);
        ctx.quadraticCurveTo(-4.5, -25.5 + hy, 0.5, -19.5 + hy);
        ctx.quadraticCurveTo(5.5, -25.5 + hy, 9.4, -18 + hy);
        ctx.lineTo(9.4, -15.5 + hy);
        ctx.quadraticCurveTo(4.5, -20.5 + hy, 0.5, -15 + hy);
        ctx.quadraticCurveTo(-4.5, -20.5 + hy, -9, -14.5 + hy);
        ctx.closePath(); ctx.fill();
        break;
      case "hair-14": // Obsidian Twilight Perm
        coils = [[-8.4, -15.6, 3.4], [-5.2, -20, 3.9], [-0.8, -22.2, 4.2], [3.8, -20.4, 4], [8, -15.8, 3.6]];
        for (i = 0; i < coils.length; i++) {
          ctx.beginPath(); ctx.arc(coils[i][0], coils[i][1] + hy, coils[i][2], 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.ellipse(0, -13.6 + hy, 9.3, 4.8, 0, Math.PI, 0); ctx.fill();
        break;
      case "hair-15": // Quantum Gradient Fade
        ctx.shadowColor = "#22D3EE"; ctx.shadowBlur = 6;
        ctxRoundRect(ctx, -7.4, -25.5 + hy, 14.8, 10.5, 2.6); ctx.fill();
        ctx.shadowBlur = 0;
        break;
      default:
        ctx.beginPath(); ctx.ellipse(0, -16.5 + hy, 9.2, 6.8, 0, Math.PI, 0); ctx.fill();
        ctx.fillRect(-2, -21 + hy, 10, 4);
    }
  }

  function drawJetpack(ctx, bob, flying) {
    ctx.save();
    ctx.fillStyle = "#1e293b"; ctx.strokeStyle = flying ? "#38bdf8" : "#475569"; ctx.lineWidth = 1.5;
    ctx.fillRect(-16, -11 + bob, 7, 18); ctx.strokeRect(-16, -11 + bob, 7, 18);
    ctx.fillStyle = flying ? "#22d3ee" : "#0284c7";
    ctx.beginPath(); ctx.arc(-12.5, -2 + bob, 2.5, 0, Math.PI * 2); ctx.fill();
    if (flying) {
      var flame = 16 + Math.random() * 14;
      ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.moveTo(-16, 7 + bob); ctx.lineTo(-12.5, 7 + bob + flame); ctx.lineTo(-9, 7 + bob); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#e0f2fe";
      ctx.beginPath(); ctx.moveTo(-15, 7 + bob); ctx.lineTo(-12.5, 7 + bob + flame * 0.6); ctx.lineTo(-10, 7 + bob); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function spawnAttack(st, forceTier) {
    var g = st.game, r = Math.random(), tier = forceTier || "low";
    if (!forceTier) {
      if (g.diff === "foundation") tier = r < 0.55 ? "low" : "high";
      else if (g.diff === "higher") tier = r < 0.45 ? "low" : r < 0.75 ? "high" : "mid";
      else tier = r < 0.35 ? "low" : r < 0.65 ? "high" : r < 0.85 ? "mid" : "wave";
    }
    var y = GROUND_Y - 20, baseY = y, waveAmp = 22, waveFreq = 0.025;
    if (tier === "high") { y = GROUND_Y - 96; baseY = y; }
    else if (tier === "mid") { y = GROUND_Y - 50; baseY = y; }
    else if (tier === "wave") { baseY = GROUND_Y - 60; y = baseY; }
    g.attacks.push({
      x: CANVAS_W - 120, y: y, baseY: baseY,
      vx: -Math.min(g.projectileSpeed(), 9.5),
      width: 24, height: 20, icon: g.boss.projectileIcon, id: Math.random(),
      rotation: 0, tier: tier, waveAmp: waveAmp, waveFreq: waveFreq
    });
  }

  function drawAttack(ctx, ba, g) {
    var color = ba.tier === "low" ? "#ef4444" : ba.tier === "mid" ? "#f59e0b"
      : ba.tier === "high" ? "#06b6d4" : "#c084fc";
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (ba.tier === "low") {
      ctx.moveTo(ba.x + ba.width, GROUND_Y - 2); ctx.lineTo(ba.x + ba.width + 16, GROUND_Y - 2);
    } else if (ba.tier === "mid") {
      ctx.arc(ba.x + ba.width + 6, ba.y + ba.height / 2, 8, -Math.PI / 2, Math.PI / 2);
    } else if (ba.tier === "high") {
      ctx.moveTo(ba.x + ba.width, ba.y + ba.height / 2); ctx.lineTo(ba.x + ba.width + 24, ba.y + ba.height / 2);
    } else {
      for (var k = 0; k <= 24; k += 6) {
        var tx = ba.x + ba.width + k;
        var ty = ba.baseY + Math.sin((CANVAS_W - tx) * ba.waveFreq) * ba.waveAmp + ba.height / 2;
        if (k === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
      }
    }
    ctx.stroke(); ctx.restore();
    ctx.save();
    ctx.translate(ba.x + ba.width / 2, ba.y + ba.height / 2);
    ctx.rotate(ba.rotation);
    ctx.shadowColor = color; ctx.shadowBlur = 12;
    ctx.font = "22px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(ba.icon, 0, 0);
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /* Question attacks, answers and battle flow                            */
  /* ------------------------------------------------------------------ */

  function clearQuestionTimer(st) {
    if (st.qInterval) { clearInterval(st.qInterval); st.qInterval = null; }
  }
  function startQuestionTimer(st) {
    clearQuestionTimer(st);
    st.qInterval = setInterval(function () {
      var g = st.game;
      if (!g || st.screen !== "battle" || (g.state !== "question" && g.state !== "revive") || g.feedback || document.hidden) return;
      g.qTimer--;
      if (g.qTimer <= 0) { clearQuestionTimer(st); answerQuestion(st, -1); return; }
      var el = st.content && st.content.querySelector("#eb-qtime");
      if (el) el.textContent = "⏱ " + g.qTimer + "s";
    }, 1000);
  }

  function triggerQuestion(st, revive) {
    var g = st.game;
    if (!g) return;
    stopLoop(st); clearQuestionTimer(st);
    var q = pickQuestion(st, g.diff);
    if (!q) { g.lastQuestion = now() + 4000; startLoop(st); return; }
    g.question = q; g.selected = -1; g.feedback = null; g.pendingAction = null;
    g.state = revive ? "revive" : "question";
    g.lastQuestion = now();
    g.qTimer = questionSeconds(g.diff, g.stage);
    renderOverlay(st); renderHud(st);
    startQuestionTimer(st);
    if (revive) sReviveStart(st); else beep(st, 380, "square", 0.35, 0.2);
  }

  function answerQuestion(st, idx) {
    var g = st.game;
    if (!g || !g.question || g.feedback || (g.state !== "question" && g.state !== "revive")) return;
    clearQuestionTimer(st);
    var q = g.question, correct = idx === q.correctIndex, text = "", action = null;

    /* Spaced repetition + review bank outcomes */
    if (correct) {
      recordBossHit(q.id);
      recordWrongCorrect(q.id);
    } else {
      recordBossMiss(q.item, g.diff);
      resetWrongProgress(q.id);
      recordReviewMiss({
        id: q.id, question: q.question, options: q.options, correctIndex: q.correctIndex,
        chapter: q.chapter, unit: q.unit, explanation: q.explanation,
        reason: q.reason, difficulty: q.difficulty
      });
    }
    g.selected = idx;

    if (g.state === "revive") {
      if (correct) {
        g.reviveCorrect++;
        if (g.reviveCorrect >= REVIVE_REQUIRED) {
          g.reviveUsed = true;
          text = "REVIVE COMPLETE! " + REVIVE_REQUIRED + "/" + REVIVE_REQUIRED +
            " correct in a row. You claw your way back at full HP!";
          action = function () {
            g.reviveCorrect = 0; g.playerHp = g.maxPlayerHp; g.streak = 0;
            g.invincibleUntil = now() + 2000;
            addFloat(st, "SECOND WIND! FULL HP RESTORED ❤️", 150, 100, "#10b981");
            returnToFight(st);
          };
        } else {
          text = "Revive trial " + g.reviveCorrect + "/" + REVIVE_REQUIRED + " correct. One mistake still ends the run!";
          action = function () { triggerQuestion(st, true); };
        }
      } else {
        g.reviveUsed = true; g.reviveCorrect = 0;
        text = "REVIVE FAILED — the trial needs " + REVIVE_REQUIRED + " correct in a row. " + q.explanation;
        action = function () { g.question = null; g.feedback = null; g.state = "gameover"; renderOverlay(st); };
      }
      g.feedback = { isCorrect: correct, text: text };
      g.pendingAction = action;
      renderOverlay(st);
      if (correct) sCrit(st); else sHit(st);
      return;
    }

    if (correct) {
      var nextStreak = g.streak + 1, mult = 1 + Math.min(nextStreak, 10) * 0.2;
      g.streak = nextStreak;
      g.bestStreak = Math.max(g.bestStreak, nextStreak);
      g.rage = Math.min(15, g.rage + 1);
      var damage = Math.round(55 * studyBonus().damage * mult);
      g.bossHp = Math.max(0, g.bossHp - damage);
      g.tokens++;
      var added = Math.floor(g.tokens / 3);
      g.tokens = g.tokens % 3;
      if (added) { g.lives += added; sCrit(st); }
      var claim = "boss-question:" + q.id;
      var earned = EC.claimedPoints(claim) ? 0 : 3;
      if (earned) EC.earnPoints(earned, "Boss Battle answer", claim);
      syncCoins(st);
      g.score += Math.round(300 * mult);
      g.shake = 10; g.flash = 8;
      text = "You dealt " + damage + " damage. " + (earned ? "+" + earned + " GIS Points. " : "") +
        (added ? "You earned an extra life. " : "") + q.explanation;
      action = function () { if (g.bossHp <= 0) finishStage(st); else returnToFight(st); };
      sCrit(st);
    } else {
      g.streak = 0;
      var raw = 40, mitigated = Math.max(5, raw - (30 - getArmour().damagePerHit));
      g.playerHp = Math.max(0, g.playerHp - mitigated);
      text = (idx === -1 ? "Time ran out." : "Incorrect.") +
        " Streak reset to 0. Boss struck through defense! -" + mitigated + " HP. (Armour absorbed " +
        (raw - mitigated) + " damage). " + q.explanation;
      action = function () {
        if (g.playerHp > 0) returnToFight(st);
        else if (g.lives > 0) {
          g.lives--; g.playerHp = g.maxPlayerHp; g.invincibleUntil = now() + 1200;
          returnToFight(st);
          addFloat(st, "Extra life used", 150, 100, "#10b981");
        } else { g.question = null; g.feedback = null; g.state = "gameover"; renderOverlay(st); }
      };
      sHit(st);
    }
    g.feedback = { isCorrect: correct, text: text };
    g.pendingAction = action;
    renderOverlay(st);
  }

  function continueQuestion(st) {
    var g = st.game;
    if (!g || !g.feedback) return;
    var action = g.pendingAction;
    g.pendingAction = null;
    if (action) action();
  }

  function returnToFight(st) {
    var g = st.game;
    if (!g) return;
    g.feedback = null; g.pendingAction = null; g.question = null;
    g.state = "playing";
    g.lastQuestion = now(); g.lastBossAttack = now();
    renderOverlay(st); renderHud(st); startLoop(st);
  }
  function finishStage(st) {
    var g = st.game;
    if (!g || g.state === "victory") return;
    var mult = (findById(DIFFICULTIES, g.diff) || DIFFICULTIES[0]).rewardMult;
    var claim = "boss-stage:" + g.stage;
    g.stageReward = EC.claimedPoints(claim) ? 0 : 15;
    if (g.stageReward) EC.earnPoints(g.stageReward, "Boss Battle stage cleared", claim);
    syncCoins(st);
    g.score += Math.round((600 + g.stage * 180) * mult);
    g.state = "victory"; g.question = null; g.feedback = null;
    clearQuestionTimer(st); stopLoop(st);
    renderOverlay(st); renderHud(st);
  }
  function endGame(st) {
    var g = st.game;
    if (!g) return;
    g.state = "gameover"; g.question = null; g.feedback = null;
    clearQuestionTimer(st); stopLoop(st); renderOverlay(st);
  }
  function pauseBattle(st) {
    var g = st.game;
    if (!g || g.state !== "playing") return;
    g.pausedAt = now(); jumpEnd(st); g.state = "paused";
    stopLoop(st); clearQuestionTimer(st); renderOverlay(st);
  }
  function resumeBattle(st) {
    var g = st.game;
    if (!g || g.state !== "paused") return;
    var paused = now() - g.pausedAt;
    g.lastQuestion += paused; g.lastBossAttack += paused; g.invincibleUntil += paused;
    if (g.jetpackActive) g.jetpackEnd += paused;
    if (g.jetpackCooldownEnd > g.pausedAt) g.jetpackCooldownEnd += paused;
    g.state = "playing"; renderOverlay(st); startLoop(st);
  }

  /* ------------------------------------------------------------------ */
  /* Action dispatcher                                                    */
  /* ------------------------------------------------------------------ */

  function openWardrobe() {
    if (typeof EC.openAvatarCustomizer === "function") {
      try { EC.openAvatarCustomizer(); return; } catch (err) {}
    }
    EC.navigate("avatar");
  }

  async function handleAction(st, act, node, e) {
    var g = st.game, id = node.getAttribute("data-id");
    switch (act) {
      case "lobby": showScreen(st, "lobby"); return;
      case "shop": showScreen(st, "shop"); return;
      case "review": showScreen(st, "review"); return;
      case "mcq": EC.navigate("quiz"); return;
      case "wardrobe": openWardrobe(); return;
      case "flagopen":
        if (g && g.question) openFlagDialog(st, g.question.id);
        return;
      case "flagclose": closeFlagDialog(st); return;
      case "flagreason": st.flag.reason = node.getAttribute("data-value") || node.getAttribute("value") || FLAG_REASONS[0]; renderFlagHost(st); return;
      case "flagconf": st.flag.confidence = node.getAttribute("data-value") || FLAG_CONFIDENCES[0]; renderFlagHost(st); return;
      case "flagsave": submitFlag(st); return;
      case "sound":
        st.sound = !st.sound;
        EC.store.set("boss_sound", st.sound);
        node.innerHTML = soundIcon(st) + '<span class="sr-only">' + (st.sound ? "Sound on" : "Muted") + '</span>';
        node.setAttribute("aria-label", st.sound ? "Mute game audio" : "Unmute game audio");
        return;
      case "start":
        if (!st.bank.length) { beep(st, 200, "sine", 0.2); return; }
        startBattle(st, st.stage, st.difficulty, false); return;
      case "boss":
        st.stage = clamp(toInt(node.getAttribute("data-stage"), 1), 1, 999);
        EC.store.set("boss_stage", st.stage); renderLobby(st); return;
      case "difficulty":
        st.difficulty = findById(DIFFICULTIES, id) ? id : "foundation";
        EC.store.set("boss_difficulty", st.difficulty); renderLobby(st); return;
      case "allunits":
        st.filter.units = []; st.filter.subsection = "all"; saveFilter(st.filter); renderLobby(st); return;
      case "unit":
        var pos = st.filter.units.indexOf(id);
        if (pos === -1) st.filter.units.push(id); else st.filter.units.splice(pos, 1);
        st.filter.units.sort(function (a, b) { return toInt(a, 0) - toInt(b, 0); });
        st.filter.subsection = "all"; saveFilter(st.filter); renderLobby(st); return;
      case "pause": pauseBattle(st); return;
      case "resume": resumeBattle(st); return;
      case "leave": showScreen(st, "lobby"); return;
      case "retry": if (g) startBattle(st, g.stage, g.diff, false); return;
      case "restart": if (g) startBattle(st, 1, g.diff, false); return;
      case "ascend": if (g) startBattle(st, g.stage + 1, g.diff, true); return;
      case "revive": if (g) { g.reviveCorrect = 0; triggerQuestion(st, true); } return;
      case "answer": answerQuestion(st, toInt(node.getAttribute("data-i"), -1)); return;
      case "continue": continueQuestion(st); return;
      case "jump": handleJump(st); return;
      case "shoot": handleShoot(st); return;
      case "refill": handleRefill(st); return;
      case "jetpack": handleJetpack(st); return;
      case "buyjet":
        if (EC.points() < JETPACK_COST) {
          addFloat(st, "Need " + JETPACK_COST + " GIS Points! (You have " + EC.points() + ")", 150, 100, "#ef4444");
          return;
        }
        if (!await EC.spendPoints(JETPACK_COST, "Boss Battle jetpack", function () {
          return EC.store.get("jetpack_unlocked", false) ? false : {jetpack_unlocked: true};
        })) return;
        syncCoins(st);
        sCrit(st);
        node.textContent = "🚀 Jetpack Unlocked!"; node.disabled = true;
        addFloat(st, "🚀 QUANTUM JETPACK UNLOCKED! Press Shift / W to Fly!", 100, 120, "#06b6d4");
        return;
      case "buyarmour": shopBuyArmour(st, id); return;
      case "equiparmour": EC.store.set("armour_id", id); sJump(st); renderShop(st); return;
      case "buychar": shopBuyChar(st, id); return;
      case "equipchar": EC.store.set("char_id", id); sJump(st); renderShop(st); return;
      case "upammo": shopUpgradeAmmo(st); return;
      case "shoprefill":
        if (EC.points() >= 15 && shopAmmo(st) < getMaxAmmo()) {
          if (!await EC.spendPoints(15, "Boss Battle ammo refill", function () {
            return shopAmmo(st) < getMaxAmmo() && {boss_ammo: getMaxAmmo()};
          })) return;
          syncCoins(st);
          if (st.game) st.game.ammo = getMaxAmmo();
          sCrit(st);
        }
        renderShop(st); return;
      case "revmode": st.review.mode = node.getAttribute("data-mode") || "list"; renderReview(st); return;
      case "revpractice": startPractice(st, node.getAttribute("data-ids") ? node.getAttribute("data-ids").split(",") : []); return;
      case "revanswer": reviewAnswer(st, toInt(node.getAttribute("data-i"), -1)); return;
      case "revnext": reviewNext(st); return;
      case "revmove":
        if (moveToWrong(id)) {
          st.review.notice = "Moved to MCQ Wrong Only. Answer it correctly on " + MASTERY_DAYS + " different days to clear it.";
          st.review.selected = null; st.review.feedback = null;
          renderReview(st);
        }
        return;
      case "revremove": removeReview(id); renderReview(st); return;
      case "revmoveall":
        var all = reviewList(), a;
        for (a = 0; a < all.length; a++) moveToWrong(all[a].id);
        st.review.notice = "Moved " + all.length + " question" + (all.length === 1 ? "" : "s") + " to MCQ Wrong Only.";
        renderReview(st); return;
      case "revclear":
        if (window.confirm("Remove every question from your review list?")) {
          EC.store.set(REVIEW_KEY, {}); st.review.notice = ""; renderReview(st);
        }
        return;
      case "revback": st.review.mode = "list"; showScreen(st, "lobby"); return;
      default: return;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Armour & mods shop                                                   */
  /* ------------------------------------------------------------------ */

  function unlockedList(key, fallback) {
    var list = EC.store.get(key, fallback);
    return Array.isArray(list) ? list : fallback.slice();
  }
  async function shopBuyArmour(st, id) {
    var item = findById(ARMOUR, id);
    if (!item || !await EC.spendPoints(item.cost, "Boss Battle armour", function () {
      var list = unlockedList("unlocked_armour", ["starter"]);
      return list.indexOf(id) === -1 && {unlocked_armour: list.concat(id), armour_id: id};
    })) return;
    syncCoins(st);
    sCrit(st);
    renderShop(st);
  }
  async function shopBuyChar(st, id) {
    var item = findById(CHARACTERS, id);
    if (!item || !await EC.spendPoints(item.cost, "Boss Battle character", function () {
      var list = unlockedList("unlocked_chars", ["custom", "dino"]);
      return list.indexOf(id) === -1 && {unlocked_chars: list.concat(id), char_id: id};
    })) return;
    syncCoins(st);
    sCrit(st);
    renderShop(st);
  }
  async function shopUpgradeAmmo(st) {
    var next = null, i;
    for (i = 0; i < AMMO_LADDER.length; i++) if (AMMO_LADDER[i].from === getMaxAmmo()) next = AMMO_LADDER[i];
    if (!next || !await EC.spendPoints(next.cost, "Boss Battle ammo upgrade", function () {
      return getMaxAmmo() === next.from && {boss_max_ammo: next.to, boss_ammo: next.to};
    })) return;
    syncCoins(st);
    if (st.game) st.game.ammo = next.to;
    sCrit(st);
    renderShop(st);
  }

  function renderShop(st) {
    if (!st.content) return;
    var armourUnlocked = unlockedList("unlocked_armour", ["starter"]);
    var charUnlocked = unlockedList("unlocked_chars", ["custom", "dino"]);
    var armourId = EC.store.get("armour_id", "starter");
    var charId = EC.store.get("char_id", "custom");
    var maxAmmo = getMaxAmmo(), nextAmmo = null, i;
    for (i = 0; i < AMMO_LADDER.length; i++) if (AMMO_LADDER[i].from === maxAmmo) nextAmmo = AMMO_LADDER[i];
    var out = [];

    out.push('<div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">' +
      '<div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4"><div>' +
        '<h2 class="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2"><span>🛒 Armour &amp; Mods Upgrades</span>' +
        '<span class="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-mono">Balance: ' + esc(EC.points()) + ' GIS Points</span></h2>' +
        '<p class="text-xs text-neutral-500 dark:text-neutral-400">Better armour reduces hit damage taken from boss strikes and moving projectiles.</p>' +
      '</div><button type="button" data-act="lobby" class="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-white cursor-pointer">Exit Shop</button></div>');

    out.push('<div class="space-y-3"><h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">🛡️ Protection Armour (Reduces Hit Damage)</h3>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">');
    for (i = 0; i < ARMOUR.length; i++) {
      var a = ARMOUR[i], owned = armourUnlocked.indexOf(a.id) !== -1, equipped = armourId === a.id;
      var cardCls = equipped
        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20"
        : owned
          ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 opacity-90";
      out.push('<div class="p-4 rounded-xl border transition-all flex flex-col justify-between ' + cardCls + '"><div>' +
        '<div class="text-3xl mb-2">' + esc(a.icon) + '</div>' +
        '<div class="font-bold text-sm text-neutral-900 dark:text-white">' + esc(a.name) + '</div>' +
        '<div class="text-xs text-rose-600 dark:text-rose-400 font-mono font-semibold mt-1">Takes ' + a.damagePerHit + ' Dmg / Hit</div>' +
        '<p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">' + esc(a.description) + '</p></div>');
      out.push('<div class="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">');
      if (equipped) out.push('<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ Equipped</span>');
      else if (owned) out.push('<button type="button" data-act="equiparmour" data-id="' + a.id + '" class="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white transition cursor-pointer">Equip</button>');
      else out.push('<button type="button" data-act="buyarmour" data-id="' + a.id + '"' + (EC.points() < a.cost ? ' disabled' : '') +
        ' class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ' +
        (EC.points() >= a.cost ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed') +
        '"><span>Buy for ' + a.cost + ' ✦</span></button>');
      out.push('</div></div>');
    }
    out.push('</div></div>');

    out.push('<div class="space-y-3 pt-2"><h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">🎭 Character Skins (Who You Play As)</h3>' +
      '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">');
    for (i = 0; i < CHARACTERS.length; i++) {
      var c = CHARACTERS[i], owns = charUnlocked.indexOf(c.id) !== -1, eq = charId === c.id;
      var skinCls = eq
        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20"
        : owns
          ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 opacity-90";
      out.push('<div class="p-4 rounded-xl border transition-all flex flex-col justify-between ' + skinCls + '"><div>' +
        '<div class="text-4xl mb-2">' + esc(c.icon) + '</div>' +
        '<div class="font-bold text-sm text-neutral-900 dark:text-white">' + esc(c.name) + '</div>' +
        (c.id === "custom" ? '<p class="text-[11px] text-sky-600 dark:text-sky-300 mt-1">Customise in the Wardrobe (top bar / after battle)</p>' : '') +
        '</div><div class="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">');
      if (eq) out.push('<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ Equipped</span>');
      else if (owns) out.push('<button type="button" data-act="equipchar" data-id="' + c.id + '" class="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white transition cursor-pointer">Equip</button>');
      else out.push('<button type="button" data-act="buychar" data-id="' + c.id + '"' + (EC.points() < c.cost ? ' disabled' : '') +
        ' class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ' +
        (EC.points() >= c.cost ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed') +
        '"><span>Buy for ' + c.cost + ' ✦</span></button>');
      out.push('</div></div>');
    }
    out.push('</div></div>');

    out.push('<div class="space-y-3 pt-2"><h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">🎯 Ammo Capacity &amp; Refills</h3>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
      '<div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between"><div>' +
        '<div class="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2"><span>Expanded Ammo Bandolier</span>' +
        '<span class="text-xs bg-sky-500/20 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-full font-mono">Current: ' + maxAmmo + ' Max</span></div>' +
        '<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Increases maximum carried ink darts. Upgrades climb to 100 (+15 each tier, prices rise).</p>' +
      '</div><button type="button" data-act="upammo"' + (!nextAmmo || EC.points() < nextAmmo.cost ? ' disabled' : '') +
        ' class="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4 cursor-pointer">' +
        (nextAmmo ? 'Upgrade (+' + (nextAmmo.to - nextAmmo.from) + ') · ' + nextAmmo.cost + ' ✦' : 'Maxed out · 100 🎉') + '</button></div>' +
      '<div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between"><div>' +
        '<div class="font-bold text-sm text-neutral-900 dark:text-white">Emergency Full Ammo Refill</div>' +
        '<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Refill all ' + maxAmmo + ' ammo immediately for battle.</p>' +
      '</div><button type="button" data-act="shoprefill"' + (EC.points() < 15 || shopAmmo(st) >= maxAmmo ? ' disabled' : '') +
        ' class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4 cursor-pointer">Refill Ammo · 15 ✦</button></div>' +
      '</div></div>');

    out.push('<div class="space-y-3 pt-2"><h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">' +
      ico("rocket", 16, "text-cyan-500") + '<span>🚀 Aeronautics &amp; Kinetic Gadgets</span></h3>' +
      '<div class="p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/25 via-neutral-900/60 to-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
        '<div class="flex items-start gap-3.5"><div class="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 shrink-0">🚀</div>' +
        '<div><div class="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center gap-2"><span>Quantum Scholar Jetpack</span>' +
        '<span class="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono font-bold">3.0s Aerial Flight</span></div>' +
        '<p class="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-lg leading-relaxed">Sustained rocket propulsion! Defies gravity to fly smoothly over ground obstacles, torso projectiles, and undulating sine-wave attacks. Press <strong>Shift</strong> or <strong>W</strong> in combat.</p>' +
        '</div></div><div class="shrink-0 flex items-center">' +
        (hasJetpack()
          ? '<span class="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">✓ Unlocked &amp; Equipped</span>'
          : '<button type="button" data-act="buyjet"' + (EC.points() < JETPACK_COST ? ' disabled' : '') +
            ' class="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer">Buy Jetpack · ' + JETPACK_COST + ' ✦</button>') +
        '</div></div></div></div>');

    st.content.innerHTML = out.join("");
  }

  function reviewEntry(id) {
    var all = reviewList(), i;
    for (i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function startPractice(st, ids) {
    if (!ids || !ids.length) return;
    st.review.mode = "practice";
    st.review.ids = ids;
    st.review.index = 0;
    st.review.selected = null;
    st.review.feedback = null;
    st.review.active = reviewEntry(ids[0]);
    if (st.content) {
      st.root.innerHTML = topbar(st) + '<div id="eb-content"></div>';
      st.content = st.root.querySelector("#eb-content");
    }
    renderReview(st);
  }
  function reviewAnswer(st, idx) {
    var r = st.review, entry = r.active;
    if (!entry || r.selected !== null || idx < 0) return;
    r.selected = idx;
    if (idx === toInt(entry.correctIndex, -1)) {
      removeReview(entry.id);
      r.feedback = { correct: true, message: "Correct — this question has been cleared from your review list." };
    } else {
      bumpReviewMiss(entry.id);
      r.feedback = { correct: false, message: "Not quite. It stays in your review list so you can try again another time." };
    }
    renderReview(st);
  }
  function reviewNext(st) {
    var r = st.review;
    if (r.index < r.ids.length - 1) {
      r.index++;
      r.active = reviewEntry(r.ids[r.index]);
      r.selected = null; r.feedback = null;
    } else {
      r.mode = "list"; r.ids = []; r.index = 0; r.active = null;
      r.selected = null; r.feedback = null;
    }
    renderReview(st);
  }

  function renderReview(st) {
    if (!st.content) return;
    var entries = reviewList(), r = st.review, out = [];
    out.push('<div class="study-page"><header class="study-hero"><div class="study-hero-content">' +
      '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · Mistake review</p>' +
      '<h1 class="study-title">Mistake <span>Review</span></h1>' +
      '<p class="study-description">Questions you get wrong in Boss Battle land here. Review the mark scheme answer, practise them again, and decide which ones deserve a place in the MCQ Wrong Only bank.</p>' +
      '<div class="study-hero-actions">' +
        '<button type="button" data-act="lobby" class="study-action btn-primary whitespace-nowrap shrink-0">' + ico("swords", 16) + '<span>Back to Boss Battle</span>' + ico("arrow-right", 16) + '</button>' +
        '<button type="button" data-act="mcq" class="study-action study-secondary-action whitespace-nowrap shrink-0">' + ico("target", 16) + '<span>Open MCQ Drills</span></button>' +
      '</div>' +
      '<p class="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">' + entries.length + ' question' + (entries.length === 1 ? '' : 's') + ' waiting for review</p>' +
      '</div><div class="study-hero-image" aria-hidden="true"></div></header>' +
      '<div class="study-studio">' +
      '<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs leading-relaxed text-[var(--surface-muted)]">' +
        '<strong class="text-[var(--surface-text)]">How it works:</strong> practise a mistake here until you are happy with it, then choose <em>Move to Wrong Only</em> to drill it in the MCQ bank. A question only leaves Wrong Only after you answer it correctly on ' + MASTERY_DAYS + ' different days — getting it wrong resets the count.' +
      '</div>');
    if (r.notice) out.push('<div role="status" class="mt-3 rounded-xl border border-[var(--surface-accent)] bg-[var(--sheet-sage)] p-3 text-xs font-semibold text-[var(--surface-text)]">' + esc(r.notice) + '</div>');
    var allIds = entries.map(function (e) { return e.id; }).join(",");
    out.push('<div class="study-mode-bar mt-4"><div role="group" aria-label="Review view" class="study-mode-options max-sm:!grid-cols-2">' +
      '<button type="button" data-act="revmode" data-mode="list" aria-pressed="' + (r.mode === "list") + '" class="study-mode-button">' + ico("clipboard-list", 17) + '<span>Review list</span><small class="font-mono text-[10px] opacity-70 tabular-nums">' + entries.length + '</small></button>' +
      '<button type="button" data-act="revpractice" data-ids="' + esc(allIds) + '"' + (entries.length ? '' : ' disabled') + ' aria-pressed="' + (r.mode === "practice") + '" class="study-mode-button disabled:opacity-50 disabled:cursor-not-allowed">' + ico("rotate-ccw", 17) + '<span>Practise all</span><small class="font-mono text-[10px] opacity-70 tabular-nums">' + entries.length + '</small></button>' +
      '</div></div>');

    if (r.mode === "practice") {
      var active = r.active;
      out.push('<div class="study-panel-padding">');
      if (!active) {
        out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">' +
          '<p class="text-sm text-[var(--surface-muted)]">This question has already been cleared from your review list.</p>' +
          '<button type="button" data-act="revnext" class="study-action btn-primary mt-4"><span>Continue</span>' + ico("arrow-right", 15) + '</button></div>');
      } else {
        out.push('<div class="space-y-5">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<span class="font-mono text-xs font-bold text-[var(--surface-text)] tabular-nums">Question ' + (r.index + 1) + ' of ' + r.ids.length + '</span>' +
            '<button type="button" data-act="revmode" data-mode="list" class="text-xs font-semibold text-[var(--surface-muted)] hover:underline flex items-center gap-1">' + ico("arrow-left", 13) + ' Back to review list</button>' +
          '</div>' +
          '<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5">' +
            '<p class="study-panel-kicker mb-2">' + (active.unit ? 'Unit ' + esc(active.unit) + ' · ' : '') + esc(active.chapter) + '</p>' +
            '<h3 class="study-prompt text-[var(--surface-text)]">' + esc(active.question) + '</h3></div>');
        var opts = active.options || [], i;
        out.push('<div class="space-y-2.5">');
        for (i = 0; i < opts.length; i++) {
          var isCorrect = i === toInt(active.correctIndex, -1);
          var isSelected = r.selected === i;
          var classes = "bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)]";
          if (r.feedback) {
            if (isCorrect) classes = "bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium";
            else if (isSelected) classes = "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)]";
            else classes = "opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
          }
          var badge = "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
          if (r.feedback && isCorrect) badge = "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
          else if (r.feedback && isSelected) badge = "bg-[#97532b] border-transparent text-white";
          out.push('<button type="button" data-act="revanswer" data-i="' + i + '"' + (r.feedback ? ' disabled' : '') +
            ' class="w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ' + classes + ' ' + (r.feedback ? 'cursor-default' : 'cursor-pointer') + '">' +
            '<span class="w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ' + badge + '">' +
            (r.feedback && isCorrect ? ico("check-circle-2", 14) : r.feedback && isSelected ? ico("x-circle", 14) : LETTERS[i]) + '</span>' +
            '<span>' + esc(opts[i]) + '</span></button>');
        }
        out.push('</div>');
        if (r.feedback) {
          out.push('<div role="status" class="rounded-xl border p-4 text-xs ' + (r.feedback.correct ? 'border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)]' : 'border-[var(--sheet-rose-line)] bg-[var(--sheet-rose)]') + '">' +
            '<div class="flex items-center gap-2 font-semibold text-sm text-[var(--surface-text)]">' +
            (r.feedback.correct ? ico("check-circle-2", 16, "shrink-0 text-[var(--surface-accent)]") : ico("x-circle", 16, "shrink-0 text-[#97532b] dark:text-[#f6bb83]")) +
            '<span>' + esc(r.feedback.message) + '</span></div>' +
            '<p class="mt-2 text-[var(--surface-muted)]">' + esc(active.explanation) + (active.reason ? ' — ' + esc(active.reason) : '') + '</p>' +
            '<div class="mt-4 flex flex-wrap items-center gap-2">' +
              '<button type="button" data-act="revnext" class="study-action btn-primary whitespace-nowrap"><span>' + (r.index < r.ids.length - 1 ? 'Next Question' : 'Finish Practice') + '</span>' + ico("arrow-right", 15) + '</button>' +
              (reviewEntry(active.id) ? '<button type="button" data-act="revmove" data-id="' + esc(active.id) + '" class="study-action study-secondary-action whitespace-nowrap">' + ico("target", 15) + '<span>Move to Wrong Only</span></button>' : '') +
            '</div></div>');
        }
        out.push('</div>');
      }
      out.push('</div>');

    } else if (!entries.length) {
      out.push('<div class="study-panel-padding"><div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">' +
        '<p class="study-panel-kicker">Nothing to review</p>' +
        '<h3 class="mt-1 font-[var(--font-serif)] text-xl font-semibold text-[var(--surface-text)]">Your review list is empty</h3>' +
        '<p class="mt-1.5 text-xs sm:text-sm text-[var(--surface-muted)]">Any question you answer incorrectly in Boss Battle will appear here for review and practice.</p>' +
        '<button type="button" data-act="lobby" class="study-action btn-primary mt-5">' + ico("swords", 15) + '<span>Play Boss Battle</span></button>' +
        '</div></div>');
    } else {
      out.push('<div class="study-panel-padding">' +
        '<div class="mb-4 flex flex-wrap items-center justify-between gap-2">' +
          '<p class="text-xs text-[var(--surface-muted)]">' + entries.length + ' mistake' + (entries.length === 1 ? '' : 's') + ' banked from Boss Battle.</p>' +
          '<div class="flex flex-wrap gap-2">' +
            '<button type="button" data-act="revmoveall" class="study-action btn-primary !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap">' + ico("target", 13) + '<span>Move all to Wrong Only</span></button>' +
            '<button type="button" data-act="revclear" class="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap">' + ico("trash-2", 13) + '<span>Clear review list</span></button>' +
          '</div></div>' +
        '<div class="space-y-3">');
      var k, n;
      for (k = 0; k < entries.length; k++) {
        var en = entries[k];
        out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5 space-y-3">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<span class="font-mono text-[11px] font-semibold text-[var(--surface-muted)] tabular-nums">' + (en.unit ? 'Unit ' + esc(en.unit) + ' · ' : '') + esc(en.chapter) + ' · missed ' + toInt(en.missCount, 0) + '×</span>' +
            '<span class="font-mono text-[11px] text-[var(--surface-muted)]">' + esc(new Date(toInt(en.missedAt, 0)).toLocaleDateString()) + '</span>' +
          '</div>' +
          '<h3 class="study-prompt text-[var(--surface-text)]">' + esc(en.question) + '</h3>' +
          '<div class="space-y-1.5">');
        var eopts = en.options || [];
        for (n = 0; n < eopts.length; n++) {
          var right = n === toInt(en.correctIndex, -1);
          out.push('<div class="flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm leading-relaxed ' +
            (right ? 'border-[var(--surface-accent)] bg-[var(--sheet-sage)] text-[var(--surface-text)] font-medium' : 'border-[var(--surface-line)] bg-[var(--surface)] text-[var(--surface-text)]') + '">' +
            '<span class="w-6 h-6 rounded-md border flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ' +
            (right ? 'bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]' : 'bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]') + '">' +
            (right ? ico("check-circle-2", 13) : LETTERS[n]) + '</span><span>' + esc(eopts[n]) + '</span></div>');
        }
        out.push('</div>' +
          '<p class="text-xs text-[var(--surface-accent)]"><strong class="font-mono mr-1.5">Mark scheme:</strong>' + esc(en.explanation) + (en.reason ? ' — ' + esc(en.reason) : '') + '</p>' +
          '<div class="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--surface-line)]">' +
            '<button type="button" data-act="revpractice" data-ids="' + esc(en.id) + '" class="study-action btn-primary !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap">' + ico("rotate-ccw", 13) + '<span>Practise this</span></button>' +
            '<button type="button" data-act="revmove" data-id="' + esc(en.id) + '" class="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap">' + ico("target", 13) + '<span>Move to Wrong Only</span></button>' +
            '<button type="button" data-act="revremove" data-id="' + esc(en.id) + '" class="text-xs font-semibold text-[#97532b] dark:text-[#f6bb83] hover:underline px-2 py-1 whitespace-nowrap">Remove</button>' +
          '</div></div>');
      }
      out.push('</div></div>');
    }
    out.push('</div></div>');
    st.content.innerHTML = out.join("");
  }

  /* ------------------------------------------------------------------ */
  /* Registration                                                         */
  /* ------------------------------------------------------------------ */

  var definition = { title: "Boss Battle", render: renderView };
  window.EC.register("boss-battle", definition);
  window.EC.register("boss", definition); // backwards-compatible alias for the old placeholder
})();
