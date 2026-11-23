/* EcBiz mocks view — timed mock exam room, ported from MockExamMode.tsx.
 * Plain ES5 browser JavaScript. No imports, libraries or build step.
 * Presentation markup mirrors MockExamMode.tsx class-for-class so the static
 * build is visually identical to the saved app; all exam logic is unchanged.
 * Restored from the original: on-screen layout picker + compact toggle,
 * side-by-side (columns) workspace, unseen-question filtering with fallback,
 * question-level case presentation and the original review wording/badges. */
(function () {
  "use strict";
  if (!window.EC) return;

  var esc = EC.esc;

  // ------------------------------------------------------------------
  // Configuration — mirrors EXAM_CONFIGS in MockExamMode.tsx. Alongside the
  // three shorter formats, the two full 80-mark / 90-minute papers are offered
  // in the order they appear in the Cambridge IGCSE Business 0264 syllabus.
  // ------------------------------------------------------------------
  var EXAM_CONFIGS = [
    {
      id: "paper1_full_exam",
      paperLabel: "Paper 1 · Full exam",
      title: "Full Paper 1 exam",
      durationSeconds: 90 * 60,
      durationLabel: "1 hour 30 minutes",
      totalMarks: 80,
      questionMix: "4 × (2 + 4 + 6 + 8 marks) = 80 marks · 4 compulsory questions",
      description: "Four compulsory questions in the real Paper 1 format — short answers and structured data responses, each with stimulus material. 80 marks in 1 hour 30 minutes.",
      accent: {
        border: "border-indigo-300/70 dark:border-indigo-800/80",
        badge: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
        iconBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300",
        text: "text-indigo-700 dark:text-indigo-300"
      }
    },
    {
      id: "paper2_full_exam",
      paperLabel: "Paper 2 · Full exam",
      title: "Full Paper 2 exam",
      durationSeconds: 90 * 60,
      durationLabel: "1 hour 30 minutes",
      totalMarks: 80,
      questionMix: "4 × (8 + 12 marks) = 80 marks · 4 compulsory questions",
      description: "Four compulsory questions from the case study insert with Appendices 1–3, exactly as in the real 80-mark Paper 2. 1 hour 30 minutes.",
      accent: {
        border: "border-emerald-300/70 dark:border-emerald-800/80",
        badge: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
        text: "text-emerald-700 dark:text-emerald-300"
      }
    },
    {
      id: "paper1",
      paperLabel: "Paper 1",
      title: "Paper 1 Mock",
      durationSeconds: 30 * 60,
      durationLabel: "30 minutes",
      totalMarks: 20,
      questionMix: "1 × 2-mark · 1 × 4-mark · 1 × 6-mark · 1 × 8-mark",
      description: "One full Paper 1 case study, followed by all four structured questions in the same order as the real exam.",
      accent: {
        border: "border-indigo-300/70 dark:border-indigo-800/80",
        badge: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
        iconBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300",
        text: "text-indigo-700 dark:text-indigo-300"
      }
    },
    {
      id: "paper2_full",
      paperLabel: "Paper 2 · Full",
      title: "Paper 2 Full Mock",
      durationSeconds: 60 * 60,
      durationLabel: "1 hour",
      totalMarks: 40,
      questionMix: "2 × 8-mark · 2 × 12-mark",
      description: "Full Paper 2 case study insert with Appendices 1–3, two 8-mark questions and two 12-mark questions.",
      accent: {
        border: "border-emerald-300/70 dark:border-emerald-800/80",
        badge: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
        text: "text-emerald-700 dark:text-emerald-300"
      }
    },
    {
      id: "paper2_short",
      paperLabel: "Paper 2 · Short",
      title: "Paper 2 Short Mock",
      durationSeconds: 30 * 60,
      durationLabel: "30 minutes",
      totalMarks: 20,
      questionMix: "1 × 8-mark · 1 × 12-mark",
      description: "Short Paper 2 case study insert with Appendices 1–3, one 8-mark question and one 12-mark question.",
      accent: {
        border: "border-amber-300/70 dark:border-amber-800/80",
        badge: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300",
        iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
        text: "text-amber-700 dark:text-amber-300"
      }
    }
  ];

  var MARK_SCHEME_LABELS = {
    knowledge_max_1: "Knowledge (AO1)",
    knowledge_max_2: "Knowledge (AO1)",
    application_max_1: "Application (AO2)",
    application_max_2: "Application (AO2)",
    analysis_max_2: "Analysis (AO3)",
    evaluation_max_2: "Evaluation (AO4)",
    application_analysis_max_6: "Application & Analysis (AO2/AO3)",
    level_1_1_to_4: "Level 1 (1–4 marks)",
    level_2_5_to_8: "Level 2 (5–8 marks)",
    level_3_9_to_12: "Level 3 (9–12 marks)",
    working_marks: "Working & Method"
  };

  // ------------------------------------------------------------------
  // Module state — persists across re-renders (e.g. browser back button)
  // ------------------------------------------------------------------
  var stage = "select"; // select | active | finished
  var exam = null;
  var answers = {};      // partId -> typed answer
  var selfMarks = {};    // questionId -> self-awarded mark
  var currentIndex = 0;
  var deadline = 0;
  var timeLeft = 0;
  var timerId = null;
  var ranOutOfTime = false;
  var showCaseStudy = true;
  var mainEl = null;
  var p1Data = null;
  var p2Data = null;
  var lastRecordId = null;
  var layout = "stacked"; // "stacked" | "columns" — on-screen exam layout
  var caseTab = "narrative"; // mirrors the original draft's case-tab / open flag
  var draftNotice = null;    // recent draft surfaced on the select screen
  var migratedLegacy = false;

  // In-progress exam autosave. EC.store.get/set/del add the "ecbiz_" prefix,
  // so "finance_exam_draft" writes ecbiz_finance_exam_draft. The React app
  // used that same raw key directly; see migrateLegacyDraft below.
  var DRAFT_KEY = "finance_exam_draft";
  var LEGACY_DRAFT_KEY = "ecbiz_finance_exam_draft";
  var DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

  // ------------------------------------------------------------------
  // Small ES5 helpers
  // ------------------------------------------------------------------
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function formatTime(seconds) {
    seconds = Math.max(0, seconds || 0);
    return Math.floor(seconds / 60) + ":" + pad2(seconds % 60);
  }
  function countWords(text) {
    var t = String(text == null ? "" : text).replace(/^\s+|\s+$/g, "");
    return t ? t.split(/\s+/).length : 0;
  }
  function forEachNode(list, fn) { Array.prototype.forEach.call(list, fn); }
  function humaniseKey(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function canonicalId(id) {
    var i = id.lastIndexOf("-");
    return i >= 0 ? id.slice(0, i) + "_" + id.slice(i + 1) : id;
  }
  function pickRandom(items, count) {
    var arr = items.slice(0), i, j, tmp;
    for (i = arr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr.slice(0, Math.min(count, arr.length));
  }
  function flattenMarkScheme(scheme) {
    if (!scheme) return [];
    var out = [];
    Object.keys(scheme).forEach(function (key) {
      var value = scheme[key], points = [];
      if (Object.prototype.toString.call(value) === "[object Array]") {
        value.forEach(function (entry) { if (entry != null && String(entry)) points.push(String(entry)); });
      } else if (typeof value === "string" && value.replace(/^\s+|\s+$/g, "")) {
        points.push(value);
      }
      if (points.length) {
        out.push({ key: key, label: MARK_SCHEME_LABELS[key] || humaniseKey(key), points: points });
      }
    });
    return out;
  }
  function getGrade(percentage) {
    if (percentage >= 80) return { grade: "A*", label: "Outstanding (A*)" };
    if (percentage >= 70) return { grade: "A", label: "Excellent (A)" };
    if (percentage >= 60) return { grade: "B", label: "Good (B)" };
    if (percentage >= 50) return { grade: "C", label: "Competent (C)" };
    if (percentage >= 40) return { grade: "D", label: "Developing (D)" };
    return { grade: "U", label: "Ungraded (U)" };
  }
  function clockTone() {
    if (timeLeft <= 60) return "bg-rose-600 text-white border-rose-500 animate-pulse";
    if (timeLeft <= 300) return "bg-amber-500 text-black border-amber-400";
    return "bg-[#0F2042] text-white border-[#0F2042] dark:bg-white dark:text-black dark:border-white";
  }

  // On-screen layout preference. Mirrors src/lib/exam-layout.ts:
  // EXAM_LAYOUT_KEY = "ecbiz_exam_layout", legacy = "ecbiz_mock_layout".
  // EC.store.get/set add the "ecbiz_" prefix, so the bare keys are used here.
  function isLayout(value) { return value === "stacked" || value === "columns"; }
  function loadExamLayout() {
    var current = EC.store.get("exam_layout");
    if (isLayout(current)) return current;
    var legacy = EC.store.get("mock_layout");
    if (isLayout(legacy)) {
      EC.store.set("exam_layout", legacy);
      EC.store.del("mock_layout");
      return legacy;
    }
    return "stacked";
  }
  function saveExamLayout(next) { EC.store.set("exam_layout", next); }
  function changeLayout(next) {
    if (!isLayout(next) || next === layout) return;
    layout = next;
    saveExamLayout(next);
    if (stage === "active") renderActive(mainEl);
    else if (stage === "finished") renderFinished(mainEl);
    else renderSelect(mainEl);
  }

  // Unseen-question filtering: the original app stores completed question ids
  // and excludes them when building a paper (with a fallback when exhausted).
  function getDoneIds() {
    var done = EC.store.get("completed_questions", []);
    return Object.prototype.toString.call(done) === "[object Array]" ? done : [];
  }

  // ------------------------------------------------------------------
  // In-progress exam draft (ecbiz_finance_exam_draft). The React app saved
  // answers, remaining seconds, a case tab and a question index. The static
  // build keeps those fields and adds an absolute deadline plus a timestamp
  // so a reload can resume with the correct time left.
  // ------------------------------------------------------------------
  function rawGet(key) {
    try { return window.localStorage ? window.localStorage.getItem(key) : null; } catch (e) { return null; }
  }
  function parseDraft(raw) {
    if (raw == null) return null;
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function normaliseAnswers(value) {
    var out = {};
    if (!value || typeof value !== "object") return out;
    Object.keys(value).forEach(function (k) {
      var v = value[k];
      out[k] = v == null ? "" : String(v);
    });
    return out;
  }
  function finiteOr(value, fallback) {
    if (value === null || value === undefined || value === "") return fallback;
    var n = Number(value);
    return isFinite(n) ? n : fallback;
  }
  function firstFinite(values, fallback) {
    for (var i = 0; i < values.length; i += 1) {
      var n = finiteOr(values[i], null);
      if (n !== null) return n;
    }
    return fallback;
  }
  function isExamId(id) {
    var ok = false;
    EXAM_CONFIGS.forEach(function (c) { if (c.id === id) ok = true; });
    return ok;
  }
  function clampIndex(index, length) {
    var n = parseInt(index, 10);
    if (isNaN(n) || n < 0) n = 0;
    if (length > 0 && n >= length) n = length - 1;
    return n;
  }
  function draftSecondsLeft(d) {
    if (!d) return 0;
    var deadline = finiteOr(d.deadline, 0);
    if (deadline) return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    var left = finiteOr(d.timeLeft != null ? d.timeLeft : d.timeLeftSeconds, 0);
    return left > 0 ? Math.floor(left) : 0;
  }

  // Convert a legacy React draft into the static snapshot shape in place.
  // The React app's raw key is exactly the one EC.store writes for this key,
  // so migration rewrites the same localStorage entry. A snapshot we wrote
  // already has savedAt and is left alone, so newer answers survive reloads.
  function migrateLegacyDraft() {
    var raw = rawGet(LEGACY_DRAFT_KEY);
    if (raw === null) return;
    var legacy = parseDraft(raw);
    if (!legacy || typeof legacy !== "object") return;
    if (finiteOr(legacy.savedAt, 0)) return;
    var id = legacy.examId || legacy.exam_id || legacy.mockId || "paper1_full_exam";
    if (!isExamId(id)) id = "paper1_full_exam";
    var remaining = firstFinite([legacy.remaining, legacy.timeLeftSeconds, legacy.timeLeft, legacy.time_left], 0);
    var tab = legacy.caseTab || legacy.case_tab || "narrative";
    var idx = firstFinite([legacy.questionIndex, legacy.currentIdx, legacy.currentIndex, legacy.index], 0);
    EC.store.set(DRAFT_KEY, {
      answers: normaliseAnswers(legacy.answers || legacy.responses),
      timeLeft: remaining > 0 ? Math.floor(remaining) : 0,
      deadline: Date.now() + (remaining > 0 ? Math.floor(remaining) : 0) * 1000,
      currentIndex: idx > 0 ? Math.floor(idx) : 0,
      caseTab: tab,
      examId: id,
      showCaseStudy: legacy.showCaseStudy !== false && tab !== "hidden",
      savedAt: firstFinite([legacy.lastSavedAt, legacy.savedAt], Date.now())
    });
  }

  // A draft is only offered for its own exam, within seven days, while time
  // is still remaining on the clock.
  function readDraft() {
    var d = EC.store.get(DRAFT_KEY, null);
    if (!d || typeof d !== "object" || !isExamId(d.examId)) return null;
    var savedAt = finiteOr(d.savedAt, 0);
    var age = Date.now() - savedAt;
    if (!savedAt || age > DRAFT_MAX_AGE_MS || age < -DRAFT_MAX_AGE_MS) return null;
    if (draftSecondsLeft(d) <= 0) return null;
    return d;
  }
  function saveDraft() {
    if (!exam || stage !== "active") return;
    EC.store.set(DRAFT_KEY, {
      answers: answers,
      deadline: deadline,
      timeLeft: timeLeft,
      currentIndex: currentIndex,
      caseTab: caseTab,
      examId: exam.id,
      showCaseStudy: showCaseStudy,
      savedAt: Date.now()
    });
  }
  function clearDraft() {
    EC.store.del(DRAFT_KEY);
    draftNotice = null;
  }

  // Inline lucide-style icons: static SVG markup, no runtime dependency.
  // These stand in for the lucide-react components used by MockExamMode.tsx.
  function ico(path, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + cls + '" aria-hidden="true">' + path + "</svg>";
  }
  var ICON = {
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronUp: '<path d="m18 15-6-6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    columns2: '<rect width="6" height="18" x="3" y="3" rx="1"/><rect width="6" height="18" x="15" y="3" rx="1"/>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    listChecks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    rows2: '<rect width="18" height="6" x="3" y="3" rx="1"/><rect width="18" height="6" x="3" y="15" rx="1"/>',
    shieldAlert: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>'
  };

  // Root wrapper classes used by every stage of MockExamMode.tsx.
  var ROOT_CLS = "min-h-screen bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white flex flex-col transition-colors";

  // ------------------------------------------------------------------
  // Distraction-free mode: add a body class and inject a tiny style sheet
  // that hides the site header, footer and skip link while the clock runs.
  // All appearance rules now come from the original compiled CSS, so this
  // sheet only contains the nav-hiding behaviour that CSS cannot express.
  // ------------------------------------------------------------------
  function ensureExamStyles() {
    if (document.getElementById("ec-mocks-exam-style")) return;
    var style = document.createElement("style");
    style.id = "ec-mocks-exam-style";
    style.textContent =
      "body.ec-exam-active > header,body.ec-exam-active > nav,body.ec-exam-active > footer," +
      "body.ec-exam-active .site-header,body.ec-exam-active .ec-header," +
      "body.ec-exam-active .business-nav,body.ec-exam-active .ec-footer," +
      "body.ec-exam-active .ec-site-header,body.ec-exam-active .ec-site-footer," +
      "body.ec-exam-active .skip,body.ec-exam-active .business-skip-link," +
      "body.ec-exam-active .site-mobile-navigation," +
      "body.ec-exam-active #ecbiz-global-overlay-host{display:none !important;}" +
      "body.ec-exam-active #main{max-width:none;padding-left:0;padding-right:0;}";
    document.head.appendChild(style);
  }
  function setExamMode(on) {
    if (on) { ensureExamStyles(); document.body.classList.add("ec-exam-active"); }
    else document.body.classList.remove("ec-exam-active");
  }

  // ------------------------------------------------------------------
  // Paper construction — one real case/set chosen at random from the bank.
  // Questions already practised (completed_questions) are excluded, with a
  // fallback to the whole bank so a full paper can always be generated.
  // ------------------------------------------------------------------
  function buildAppendices(insert) {
    var list = [];
    var marketing = insert.appendix_1_marketing_ops;
    if (typeof marketing === "string" && marketing.replace(/^\s+|\s+$/g, "")) {
      list.push({ id: "appendix-1", title: "Appendix 1 — Marketing & Operations", body: marketing });
    }
    var financial = insert.appendix_2_financial_data;
    if (typeof financial === "string" && financial.replace(/^\s+|\s+$/g, "")) {
      list.push({ id: "appendix-2", title: "Appendix 2 — Financial Data", body: financial });
    } else if (financial && typeof financial === "object") {
      list.push({ id: "appendix-2", title: "Appendix 2 — Financial Data", table: financial });
    }
    var external = insert.appendix_3_external_environment;
    if (typeof external === "string" && external.replace(/^\s+|\s+$/g, "")) {
      list.push({ id: "appendix-3", title: "Appendix 3 — External Environment", body: external });
    }
    return list;
  }

  function makeQuestion(id, number, marks, parts, scheme, extra) {
    var q = {
      id: id, canonical: canonicalId(id), number: number, marks: marks,
      parts: parts, markScheme: scheme
    };
    if (extra) Object.keys(extra).forEach(function (k) { q[k] = extra[k]; });
    return q;
  }

  function createPaper1Exam(data, mode, doneIds) {
    var full = mode === "full_exam";
    var isDone = function (scenarioId, question) {
      return doneIds.indexOf(scenarioId + "_" + question.part) >= 0;
    };

    if (full) {
      // Full Paper 1: four unseen cases, each with parts (a)–(d) worth
      // 2/4/6/8 marks (80 marks total, 90 minutes). Relax the filter in
      // stages when fewer than four unseen case studies remain.
      var parts = ["a", "b", "c", "d"];
      var marksForPart = { a: 2, b: 4, c: 6, d: 8 };
      function hasAllParts(scenario) {
        return parts.every(function (part) {
          return scenario.questions.some(function (q) {
            return q.part === part && q.mark_value === marksForPart[part];
          });
        });
      }
      var pool = data.filter(function (scenario) {
        return hasAllParts(scenario) &&
          scenario.questions.every(function (q) { return !isDone(scenario.scenario_id, q); });
      });
      if (pool.length < 4) {
        pool = data.filter(function (scenario) {
          return scenario.questions.some(function (q) { return !isDone(scenario.scenario_id, q); });
        });
      }
      if (pool.length < 4) pool = data;

      var scenarios = pickRandom(pool, 4);
      var questions = [];
      scenarios.forEach(function (scenario, scenarioIndex) {
        parts.forEach(function (part) {
          var found = null;
          scenario.questions.forEach(function (q) {
            if (!found && q.part === part && q.mark_value === marksForPart[part] &&
                !isDone(scenario.scenario_id, q)) found = q;
          });
          if (!found) {
            scenario.questions.forEach(function (q) {
              if (!found && q.part === part && q.mark_value === marksForPart[part]) found = q;
            });
          }
          if (!found) return;
          var id = scenario.scenario_id + "-" + found.part;
          questions.push(makeQuestion(
            id,
            "Question " + (scenarioIndex + 1) + "(" + part + ")",
            found.mark_value,
            [{ id: id, label: "(" + part + ")", marks: found.mark_value,
               questionText: found.question_text || "", modelAnswer: found.model_answer || "" }],
            flattenMarkScheme(found.mark_scheme),
            {
              caseStem: scenario.scenario_stem,
              caseLabel: "Case " + (scenarioIndex + 1) + " · " + scenario.scenario_id,
              scenarioId: scenario.scenario_id,
              unit: scenario.unit,
              appendices: [],
              doneId: scenario.scenario_id + "_" + found.part
            }
          ));
        });
      });
      return {
        id: "paper1_full_exam", paper: 1, title: "Full Paper 1 exam",
        durationSeconds: 90 * 60,
        totalMarks: questions.reduce(function (s, q) { return s + q.marks; }, 0),
        scenarioId: "4 cases · Full Paper 1", unit: "Cambridge IGCSE Business 0264",
        caseStem: "Four compulsory data-response questions. Each question shows the stimulus material for its own case above the question.",
        appendices: [], questions: questions
      };
    }

    // Short Paper 1: one case study with one question of each mark value.
    var eligible = data.filter(function (scenario) {
      return scenario.questions.some(function (q) { return !isDone(scenario.scenario_id, q); });
    });
    var shortPool = eligible.length ? eligible : data;
    var scenario = shortPool[Math.floor(Math.random() * shortPool.length)];
    var picked = [];
    [2, 4, 6, 8].forEach(function (mark) {
      var found = null;
      scenario.questions.forEach(function (q) {
        if (!found && q.mark_value === mark && !isDone(scenario.scenario_id, q)) found = q;
      });
      if (found) picked.push(found);
    });
    var undone = scenario.questions.filter(function (q) { return !isDone(scenario.scenario_id, q); });
    var source = picked.length === 4 ? picked : (undone.length ? undone : scenario.questions);
    var shortQuestions = source.map(function (q, index) {
      var id = scenario.scenario_id + "-" + q.part;
      return makeQuestion(
        id,
        "Question " + (index + 1) + " (" + q.part + ")",
        q.mark_value,
        [{ id: id, label: "", marks: q.mark_value,
           questionText: q.question_text || "", modelAnswer: q.model_answer || "" }],
        flattenMarkScheme(q.mark_scheme),
        { scenarioId: scenario.scenario_id, unit: scenario.unit, appendices: [],
          doneId: scenario.scenario_id + "_" + q.part }
      );
    });
    return {
      id: "paper1", paper: 1, title: "Paper 1 Mock Exam",
      durationSeconds: 30 * 60,
      totalMarks: shortQuestions.reduce(function (s, q) { return s + q.marks; }, 0),
      scenarioId: scenario.scenario_id, unit: scenario.unit,
      caseStem: scenario.scenario_stem, appendices: [], questions: shortQuestions
    };
  }

  function normaliseP2Question(scenario, q) {
    var scenarioId = scenario.scenario_id;
    var parts = [];
    if (Object.prototype.toString.call(q.sub_parts) === "[object Array]" && q.sub_parts.length) {
      q.sub_parts.forEach(function (sp, index) {
        parts.push({
          id: scenarioId + "-" + q.number + "-" + index,
          label: sp.part || "", marks: sp.marks,
          questionText: sp.question_text || "", modelAnswer: sp.model_answer || ""
        });
      });
    } else {
      parts.push({
        id: scenarioId + "-" + q.number, label: "", marks: q.mark_value,
        questionText: q.question_text || "", modelAnswer: q.model_answer || ""
      });
    }
    var question = makeQuestion(
      scenarioId + "-" + q.number, q.number, q.mark_value, parts,
      flattenMarkScheme(q.mark_scheme), null
    );
    question.scenarioId = scenarioId;
    question.unit = scenario.unit;
    question.appendices = buildAppendices(scenario.case_study_insert);
    question.doneId = scenarioId + "-" + q.number;
    return question;
  }

  function buildP2CompletePairs(scenario, excludeDone, doneIds) {
    var pairMap = {};
    scenario.questions.forEach(function (q) {
      var key = q.number.split("(")[0] || q.number;
      if (!pairMap[key]) pairMap[key] = [];
      pairMap[key].push(q);
    });
    var out = [];
    Object.keys(pairMap).forEach(function (key) {
      var pair = pairMap[key];
      var has8 = false, has12 = false, allUndone = true;
      pair.forEach(function (q) {
        if (q.mark_value === 8) has8 = true;
        if (q.mark_value === 12) has12 = true;
        if (doneIds.indexOf(scenario.scenario_id + "-" + q.number) >= 0) allUndone = false;
      });
      if (has8 && has12 && (!excludeDone || allUndone)) out.push(pair);
    });
    return out;
  }

  function createPaper2Exam(data, mode, doneIds) {
    var isFullExam = mode === "full_exam";
    var requiredPairs = mode === "full" ? 2 : (isFullExam ? 4 : 1);

    // Prefer scenarios with enough complete, unseen topic pairs; fall back to
    // the full bank (and unfiltered pairs) once the unseen pool is exhausted.
    var eligible = data.filter(function (scenario) {
      return buildP2CompletePairs(scenario, true, doneIds).length >= requiredPairs;
    });
    var usingUndone = eligible.length > 0;
    var pool = usingUndone ? eligible : data;
    var scenario = pool[Math.floor(Math.random() * pool.length)];
    var completePairs = buildP2CompletePairs(scenario, usingUndone, doneIds);
    if (completePairs.length < requiredPairs) {
      completePairs = buildP2CompletePairs(scenario, false, doneIds);
    }
    var chosen = pickRandom(completePairs, requiredPairs);
    var chosenNumbers = {};
    chosen.forEach(function (pair) { pair.forEach(function (q) { chosenNumbers[q.number] = true; }); });

    var questions = [];
    scenario.questions.forEach(function (q) {
      if (chosenNumbers[q.number]) questions.push(normaliseP2Question(scenario, q));
    });

    return {
      id: isFullExam ? "paper2_full_exam" : (mode === "full" ? "paper2_full" : "paper2_short"),
      paper: 2,
      title: isFullExam ? "Full Paper 2 exam" : (mode === "full" ? "Paper 2 Full Mock Exam" : "Paper 2 Short Mock Exam"),
      durationSeconds: isFullExam ? 90 * 60 : (mode === "full" ? 60 * 60 : 30 * 60),
      totalMarks: questions.reduce(function (s, q) { return s + q.marks; }, 0),
      scenarioId: scenario.scenario_id, unit: scenario.unit,
      caseStem: scenario.case_study_insert.main_stem,
      appendices: buildAppendices(scenario.case_study_insert),
      questions: questions
    };
  }

  function createExam(id) {
    var doneIds = getDoneIds();
    if (id === "paper1") return createPaper1Exam(p1Data, "short", doneIds);
    if (id === "paper1_full_exam") return createPaper1Exam(p1Data, "full_exam", doneIds);
    if (id === "paper2_full") return createPaper2Exam(p2Data, "full", doneIds);
    if (id === "paper2_full_exam") return createPaper2Exam(p2Data, "full_exam", doneIds);
    return createPaper2Exam(p2Data, "short", doneIds);
  }

  function isAnswered(q) {
    return q.parts.every(function (p) { return String(answers[p.id] || "").replace(/^\s+|\s+$/g, "").length > 0; });
  }
  function answeredQuestions() {
    return exam ? exam.questions.filter(isAnswered).length : 0;
  }
  function partsStats() {
    var answered = 0, total = 0;
    if (exam) exam.questions.forEach(function (q) {
      q.parts.forEach(function (p) {
        total += 1;
        if (String(answers[p.id] || "").replace(/^\s+|\s+$/g, "").length > 0) answered += 1;
      });
    });
    return { answered: answered, total: total };
  }
  function wordTotal() {
    var n = 0;
    Object.keys(answers).forEach(function (k) { n += countWords(answers[k]); });
    return n;
  }
  function selfScore() {
    var n = 0;
    if (!exam) return 0;
    exam.questions.forEach(function (q) {
      var v = parseInt(selfMarks[q.id], 10);
      if (!isNaN(v) && v > 0) n += Math.min(v, q.marks);
    });
    return n;
  }

  // ------------------------------------------------------------------
  // HTML fragments — classes copied from MockExamMode.tsx (AppendixTable,
  // CaseStudyPanel, status strip, navigator, question card and nav).
  // ------------------------------------------------------------------
  function tableHtml(table) {
    if (!table || Object.prototype.toString.call(table.headers) !== "[object Array]" || !table.rows) return "";
    var html = '<div class="space-y-2">';
    if (table.title) html += '<p class="text-[11px] font-semibold text-[#0F2042] dark:text-neutral-200">' + esc(table.title) + "</p>";
    html += '<div class="overflow-x-auto rounded-lg border border-[#E7E5E4] dark:border-neutral-700"><table class="w-full text-[11px] border-collapse"><thead><tr>';
    (table.headers || []).forEach(function (h) {
      html += '<th class="border-b border-r border-[#E7E5E4] dark:border-neutral-700 bg-[#0F2042] dark:bg-neutral-800 px-2.5 py-1.5 text-left font-mono font-bold text-white last:border-r-0">' + esc(h) + "</th>";
    });
    html += "</tr></thead><tbody>";
    table.rows.forEach(function (row, rowIndex) {
      html += '<tr class="' + (rowIndex % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-[#FAF9F6] dark:bg-black/30") + '">';
      row.forEach(function (cell) {
        html += '<td class="border-b border-r border-[#E7E5E4] dark:border-neutral-800 px-2.5 py-1.5 text-[#44403C] dark:text-neutral-300 last:border-r-0">' + esc(cell) + "</td>";
      });
      html += "</tr>";
    });
    return html + "</tbody></table></div></div>";
  }

  // CaseStudyPanel in the original falls back to the paper values when the
  // current question does not carry its own case data.
  function casePanelHtml(question) {
    var q = question || null;
    var scenarioId = q && q.scenarioId != null ? q.scenarioId : exam.scenarioId;
    var unit = q && q.unit != null ? q.unit : exam.unit;
    var caseStem = q && q.caseStem != null ? q.caseStem : exam.caseStem;
    var appendices = q && q.appendices != null ? q.appendices : exam.appendices;
    var label = exam.paper === 1 ? "Case Study" : "Case Study Insert";
    var html = '<div class="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5">' +
      '<button type="button" data-ec-action="toggle-case" class="w-full px-4 py-3 flex items-center justify-between gap-3 bg-[#FAF9F6]/70 dark:bg-black/30 cursor-pointer' + (showCaseStudy ? " border-b border-[#E7E5E4] dark:border-neutral-800" : "") + '">' +
        '<span class="flex items-center gap-2 text-left">' + ico(ICON.book, "w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0") +
          '<span><span class="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300">' + label + "</span>" +
          '<span class="block text-[10px] text-[#78716C] dark:text-neutral-400">' + esc(scenarioId) + " · " + esc(unit) + "</span></span>" +
        "</span>" +
        '<span class="text-[10px] font-mono font-semibold text-[#57534E] dark:text-neutral-400 flex items-center gap-1 shrink-0">' + (showCaseStudy ? "Hide" : "Show") +
          ico(showCaseStudy ? ICON.chevronUp : ICON.chevronDown, "w-3.5 h-3.5") + "</span>" +
      "</button>";
    if (showCaseStudy) {
      html += '<div class="p-4 sm:p-5 space-y-4">' +
        '<div><div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">Business background</div>' +
        '<p class="text-xs sm:text-sm leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">' + esc(caseStem) + "</p></div>";
      appendices.forEach(function (app) {
        html += '<div class="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black/40 overflow-hidden">' +
          '<div class="px-3 py-2 border-b border-[#E7E5E4] dark:border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300">' + esc(app.title) + "</div>" +
          '<div class="p-3">' + (app.body ? '<p class="text-xs leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">' + esc(app.body) + "</p>" : "") +
          (app.table ? tableHtml(app.table) : "") + "</div></div>";
      });
      html += '<p class="text-[10px] text-[#78716C] dark:text-neutral-400 leading-snug">Use specific facts, figures, business names and appendix data from this insert in every answer to earn application marks.</p>' +
        "</div>";
    }
    return html + "</div>";
  }

  // Header clock: the inner label is refreshed separately so the inline
  // timer icon is preserved (paintClocks handles both clock nodes).
  function clockHtml(baseClass) {
    return '<div data-ec-clock-tone="' + esc(baseClass) + '" class="' + baseClass + " " + clockTone() + '" title="Time remaining">' +
      ico(ICON.timer, "w-4 h-4") +
      '<span data-ec-clock-text>' + formatTime(timeLeft) + "</span></div>";
  }

  // Compact on-screen layout toggle used in the active exam header (md+) and
  // in the status strip on small screens (md:hidden), as in MockExamMode.tsx.
  function layoutToggleHtml() {
    function btn(next, title, iconPath) {
      var active = layout === next;
      return '<button type="button" data-ec-action="layout" data-layout="' + next + '" aria-pressed="' + (active ? "true" : "false") +
        '" title="' + title + '" aria-label="' + title +
        '" class="p-1.5 rounded-md cursor-pointer ' +
        (active ? "bg-[#0F2042] text-white dark:bg-white dark:text-black" : "text-[#57534E] dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10") + '">' +
        ico(iconPath, "w-3.5 h-3.5") + "</button>";
    }
    return '<div role="group" aria-label="Exam layout" class="flex items-center gap-0.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-neutral-900 p-0.5">' +
      btn("stacked", "Text at top, question below", ICON.rows2) +
      btn("columns", "Text left, question right", ICON.columns2) +
      "</div>";
  }

  function statusStripHtml() {
    var pct = exam.questions.length ? ((currentIndex + 1) / exam.questions.length) * 100 : 0;
    return '<div class="mb-5">' +
      '<div class="flex items-center justify-between gap-3 mb-2">' +
        '<span class="text-xs font-mono font-semibold text-[#57534E] dark:text-neutral-400">Question ' + (currentIndex + 1) + " of " + exam.questions.length + "</span>" +
        '<div class="flex items-center gap-2">' +
          '<span data-ec-answered-q class="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline">' + answeredQuestions() + " / " + exam.questions.length + " questions answered</span>" +
          '<div class="md:hidden">' + layoutToggleHtml() + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="h-1.5 rounded-full bg-[#E7E5E4] dark:bg-neutral-800 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300" style="width:' + pct + '%"></div></div>' +
      "</div>";
  }

  function navigatorHtml() {
    var html = '<div class="space-y-2">';
    exam.questions.forEach(function (q, index) {
      var answered = isAnswered(q);
      var isCurrent = index === currentIndex;
      var cls = isCurrent
        ? "border-[#0F2042] dark:border-white bg-[#0F2042] text-white dark:bg-white dark:text-black"
        : answered
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50"
          : "border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800";
      html += '<button type="button" data-ec-action="goto" data-index="' + index + '" class="w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ' + cls + '">' +
        '<span class="flex items-center gap-2"><span class="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] font-mono flex items-center justify-center">' + (index + 1) + "</span>" +
        "<span>" + esc(q.number) + " · " + q.marks + "m</span></span>" +
        (answered ? ico(ICON.checkCircle, "w-3.5 h-3.5") : "") + "</button>";
    });
    var st = partsStats();
    var ppct = st.total ? (st.answered / st.total) * 100 : 0;
    html += "</div><div class=\"mt-3 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800\">" +
      '<div class="flex items-center justify-between text-[10px] font-mono text-[#78716C] dark:text-neutral-400 mb-1.5"><span>Parts answered</span><span>' + st.answered + " / " + st.total + "</span></div>" +
      '<div class="h-1.5 rounded-full bg-[#E7E5E4] dark:bg-neutral-800 overflow-hidden"><div class="h-full rounded-full bg-emerald-600 transition-all duration-300" style="width:' + ppct + '%"></div></div>' +
      "</div>" +
      '<button type="button" data-ec-action="submit" class="mt-4 w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">' +
        ico(ICON.flag, "w-4 h-4") + "Finish Early</button>";
    return html;
  }

  // Full Paper 1 questions each carry their own case stimulus (the shortened
  // formats never set q.caseStem, so their presentation is unchanged).
  function questionStimulusHtml(q) {
    if (!q.caseStem) return "";
    return '<div class="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5">' +
      '<div class="px-4 py-2.5 border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/70 dark:bg-black/30">' +
        '<span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300">Stimulus material · ' + esc(q.caseLabel || q.canonical) + "</span>" +
      "</div>" +
      '<p class="p-4 text-xs sm:text-sm leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">' + esc(q.caseStem) + "</p>" +
      "</div>";
  }

  function questionReviewStimulusHtml(q) {
    if (!q.caseStem) return "";
    return '<div class="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/50 dark:bg-black/20 p-3">' +
      '<div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300 mb-1.5">Stimulus material · ' + esc(q.caseLabel || q.canonical) + "</div>" +
      '<p class="text-xs leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">' + esc(q.caseStem) + "</p></div>";
  }

  function questionCardHtml(q) {
    var html = questionStimulusHtml(q) +
      '<div class="rounded-2xl border-2 border-[#0F2042]/20 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-xs">' +
      '<div class="flex flex-wrap items-center gap-2 mb-3">' +
        '<span class="px-2 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold uppercase">' + esc(q.number) + "</span>" +
        '<span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">' + q.marks + " marks</span>" +
        (q.parts.length > 1 ? '<span class="text-[10px] font-mono text-[#78716C] dark:text-neutral-400">' + q.parts.length + " sub-parts</span>" : "") +
      "</div><div class=\"space-y-5\">";
    q.parts.forEach(function (part) {
      var answer = answers[part.id] || "";
      var rows = part.label ? 4 : 9;
      html += "<div>";
      if (part.label) {
        html += '<div class="flex items-center gap-2 mb-1.5"><span class="text-xs font-mono font-bold text-[#0F2042] dark:text-white">' + esc(part.label) + "</span>" +
          '<span class="text-[10px] font-mono font-bold text-[#78716C] dark:text-neutral-400">' + part.marks + " marks</span></div>";
      }
      html += '<h2 class="font-academic-serif text-base sm:text-lg font-bold text-[#0F2042] dark:text-white leading-relaxed mb-3">' + esc(part.questionText) + "</h2>" +
        '<label for="mock-answer-' + esc(part.id) + '" class="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">Your answer</label>' +
        '<textarea id="mock-answer-' + esc(part.id) + '" data-ec-answer="' + esc(part.id) + '" rows="' + rows + '" placeholder="Type your full answer here under exam conditions..." ' +
          'class="w-full p-3 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black text-sm text-[#1C1917] dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white resize-y">' + esc(answer) + "</textarea>" +
        '<div class="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[#78716C] dark:text-neutral-400">' +
          '<span data-ec-words="' + esc(part.id) + '">' + countWords(answer) + " words</span>" +
          '<span class="hidden sm:inline">Aim for about ' + (part.marks * 10) + "–" + (part.marks * 18) + " words</span>" +
        "</div></div>";
    });
    return html + "</div></div>";
  }

  function questionNavHtml() {
    var html = '<div class="mt-5 flex items-center justify-between gap-3">' +
      '<button type="button" data-ec-action="prev" ' + (currentIndex === 0 ? "disabled " : "") +
        'class="px-4 py-2 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer">' +
        ico(ICON.chevronLeft, "w-4 h-4") + "Previous</button>";
    if (currentIndex < exam.questions.length - 1) {
      html += '<button type="button" data-ec-action="next" class="px-4 py-2 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 flex items-center gap-1.5 cursor-pointer">Next Question' +
        ico(ICON.chevronRight, "w-4 h-4") + "</button>";
    } else {
      html += '<button type="button" data-ec-action="submit" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">' +
        ico(ICON.flag, "w-4 h-4") + "Finish Exam</button>";
    }
    return html + "</div>";
  }

  function headerHtml(kicker, badge, subtitle) {
    return '<header class="sticky top-0 z-30 border-b border-[#E7E5E4] dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 sm:px-6 py-3">' +
      '<div class="max-w-6xl mx-auto flex items-center justify-between gap-3">' +
        '<div class="flex items-center gap-2.5 min-w-0">' +
          '<span class="px-2.5 py-1 rounded-lg ' + badge.cls + ' text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">' + esc(badge.text) + "</span>" +
          '<span class="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline truncate">' + esc(subtitle) + "</span>" +
        "</div>" +
        '<div class="flex items-center gap-2 shrink-0">' + kicker + "</div>" +
      "</div></header>";
  }

  // ------------------------------------------------------------------
  // Stage renderers
  // ------------------------------------------------------------------
  function renderSelect(main) {
    stage = "select";
    setExamMode(false);
    var cards = EXAM_CONFIGS.map(function (c) {
      var accent = c.accent;
      return '<button type="button" data-ec-action="start" data-id="' + c.id + '" class="study-mock-card text-left border ' + accent.border + ' bg-white dark:bg-neutral-900 flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group">' +
        '<div class="flex items-center justify-between gap-2 mb-3">' +
          '<span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ' + accent.badge + '">' + esc(c.paperLabel) + "</span>" +
          '<span class="text-[10px] font-mono font-semibold text-[#78716C] dark:text-neutral-400">' + esc(c.durationLabel) + "</span>" +
        "</div>" +
        '<div class="w-9 h-9 rounded-lg ' + accent.iconBg + ' flex items-center justify-center mb-3">' + ico(ICON.fileText, "w-4 h-4") + "</div>" +
        '<h2 class="study-panel-title text-[#0F2042] dark:text-white">' + esc(c.title) + "</h2>" +
        '<div class="mt-1 text-xs font-mono font-bold text-[#57534E] dark:text-neutral-400">' + c.totalMarks + " marks</div>" +
        '<p class="mt-3 text-[11px] font-semibold text-[#0F2042] dark:text-neutral-200">' + esc(c.questionMix) + "</p>" +
        '<p class="mt-1.5 text-[11px] leading-relaxed text-[#57534E] dark:text-neutral-400">' + esc(c.description) + "</p>" +
        '<div class="mt-4 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 text-xs font-bold flex items-center gap-1.5 ' + accent.text + '">Start this mock' +
          ico(ICON.arrowRight, "w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform") + "</div>" +
        "</button>";
    }).join("");

    // A recent in-progress draft is offered on the picker. Restoring is one
    // click (or choosing the same paper again); "Start fresh" discards it.
    draftNotice = readDraft();
    var resumeBanner = "";
    if (draftNotice) {
      var draftConfig = null;
      EXAM_CONFIGS.forEach(function (c) { if (c.id === draftNotice.examId) draftConfig = c; });
      resumeBanner = '<section data-ec-resume-banner role="status" class="mb-6 rounded-2xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/30 p-4 flex flex-wrap items-center justify-between gap-3">' +
        '<div class="flex items-center gap-2 min-w-0">' +
          ico(ICON.rotateCcw, "w-4 h-4 text-indigo-600 dark:text-indigo-300 shrink-0") +
          '<div><p class="text-xs font-bold text-indigo-900 dark:text-indigo-200">Resume your saved mock exam</p>' +
          '<p class="mt-0.5 text-[11px] text-indigo-800/80 dark:text-indigo-300/80">' +
            esc(draftConfig ? draftConfig.title : "Saved mock exam") + " · " + formatTime(draftSecondsLeft(draftNotice)) + " remaining</p></div></div>" +
        '<div class="flex items-center gap-2">' +
          '<button type="button" data-ec-action="resume" class="px-3 py-1.5 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black text-xs font-bold cursor-pointer">Resume exam</button>' +
          '<button type="button" data-ec-action="fresh" class="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer">Start fresh</button>' +
        "</div></section>";
    }

    var exitBtn = '<button type="button" data-ec-action="exit" class="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer">' +
      ico(ICON.logOut, "w-3.5 h-3.5") + '<span class="hidden sm:inline">Exit</span></button>';

    // On-screen layout chooser — MockExamMode.tsx lines 953–1030.
    function chooserButton(next, title, copy, iconPath, preview) {
      var active = layout === next;
      return '<button type="button" data-ec-action="layout" data-layout="' + next + '" aria-pressed="' + (active ? "true" : "false") +
        '" title="' + title + '" aria-label="' + title +
        '" class="rounded-xl border p-3.5 text-left transition-colors cursor-pointer ' +
        (active
          ? "border-[#0F2042] dark:border-white ring-2 ring-[#0F2042]/15 dark:ring-white/20 bg-[#F5F5F4] dark:bg-neutral-800"
          : "border-[#E7E5E4] dark:border-neutral-800 hover:border-[#0F2042]/50 dark:hover:border-neutral-500") + '">' +
        '<span class="flex items-start gap-3">' +
          '<span class="w-8 h-8 rounded-lg ' + (next === "stacked" ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300" : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300") + ' flex items-center justify-center shrink-0">' + ico(iconPath, "w-4 h-4") + "</span>" +
          '<span class="min-w-0"><strong class="block text-xs font-bold text-[#0F2042] dark:text-white">' + title + "</strong>" +
          '<span class="block mt-0.5 text-[11px] leading-snug text-[#57534E] dark:text-neutral-400">' + copy + "</span></span>" +
        "</span>" + preview + "</button>";
    }
    var stackedCopy = "Case study spans the page above the question. Timer and navigator stay in the right-hand panel.";
    var columnsCopy = "Case study and question sit side by side. Timer and navigator move into a toolbar above them.";
    var stackedPreview = '<span class="mt-3 grid gap-1" aria-hidden="true">' +
      '<span class="block h-2.5 rounded bg-[#0F2042]/25 dark:bg-white/25"></span>' +
      '<span class="block h-5 rounded bg-indigo-200/80 dark:bg-indigo-900/60"></span></span>';
    var columnsPreview = '<span class="mt-3 grid grid-cols-2 gap-1" aria-hidden="true">' +
      '<span class="block h-7 rounded bg-[#0F2042]/25 dark:bg-white/25"></span>' +
      '<span class="block h-7 rounded bg-indigo-200/80 dark:bg-indigo-900/60"></span></span>';
    var layoutPicker = '<section aria-labelledby="mock-layout-title" class="mb-6 rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-5">' +
      '<div class="mb-3">' +
        '<h2 id="mock-layout-title" class="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">On-screen layout</h2>' +
        '<p class="mt-0.5 text-[11px] text-[#78716C] dark:text-neutral-400">Choose how the case study and question appear. You can switch at any point during the exam.</p>' +
      "</div>" +
      '<div class="grid sm:grid-cols-2 gap-3">' +
        chooserButton("stacked", "Text at top, question below", stackedCopy, ICON.rows2, stackedPreview) +
        chooserButton("columns", "Text left, question right", columnsCopy, ICON.columns2, columnsPreview) +
      "</div></section>";

    main.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '">' +
      headerHtml(exitBtn, { text: "Mock Exam", cls: "bg-[#8B1E1E]" }, "Distraction-free timed practice · Test Builder") +
      '<main class="study-page">' +
        '<header class="study-hero">' +
          '<div class="study-hero-content">' +
            '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
            '<h1 class="study-title">Choose your <span>mock exam</span></h1>' +
            '<p class="study-description">The countdown starts when you choose a paper. Each mock includes its case study and relevant appendices.</p>' +
          "</div>" +
          '<div class="study-hero-image" aria-hidden="true"></div>' +
        "</header>" +
        resumeBanner +
        layoutPicker +
        '<div class="grid md:grid-cols-3 gap-4">' + cards + "</div>" +
        '<div class="mt-6 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-4 flex gap-3">' +
          ico(ICON.shieldAlert, "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5") +
          "<div><p class=\"text-xs font-bold text-amber-900 dark:text-amber-200\">Strict exam conditions</p>" +
          '<p class="mt-0.5 text-[11px] leading-snug text-amber-900/80 dark:text-amber-200/80">Navigation, Study Space and all other distractions are hidden while the timer runs. The paper submits automatically when the countdown reaches zero, or sooner if you choose Finish Early.</p></div>' +
        "</div>" +
      "</main></div>";
    bindEvents(main);
  }

  function renderActive(main) {
    var q = exam.questions[currentIndex];
    if (!q) return renderSelect(main);
    var st = partsStats();
    var header = headerHtml(
      '<div class="hidden md:block">' + layoutToggleHtml() + "</div>" +
      '<button type="button" data-ec-action="submit" title="Submit your answers before the timer runs out" class="px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">' +
        ico(ICON.flag, "w-3.5 h-3.5") + '<span class="hidden sm:inline">Finish Early</span></button>' +
      clockHtml("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tabular-nums") +
      '<button type="button" data-ec-action="exit" title="Exit mock exam" class="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer">' +
        ico(ICON.logOut, "w-3.5 h-3.5") + '<span class="hidden sm:inline">Exit</span></button>',
      { text: exam.paper === 1 ? "Paper 1" : "Paper 2", cls: "bg-[#8B1E1E]" },
      exam.title + " · " + exam.totalMarks + " marks · " + Math.round(exam.durationSeconds / 60) + " minutes"
    );

    // The workspace carries the shared study-columns layout marker as well as
    // the original Tailwind classes that drive the two presentations.
    var workspaceClass = "flex-1 w-full mx-auto px-3 sm:px-4 lg:px-6 py-6 " +
      (layout === "columns"
        ? "max-w-[1600px] study-columns-layout-columns"
        : "max-w-6xl grid md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_300px] gap-5 lg:gap-6 items-start study-columns-layout-stacked");

    var body;
    if (layout === "columns") {
      // Side-by-side mode: controls move into a toolbar above the two panels,
      // with a second clock and a compact "Questions" dropdown (TSX 1630-1701).
      var strictNote = '<div class="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-3 flex gap-2">' +
        ico(ICON.shieldAlert, "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5") +
        '<p class="text-[10px] leading-snug text-amber-900 dark:text-amber-200">Strict conditions: work independently, no notes. Use the case study facts, figures and appendices in your answers.</p></div>';
      body =
        '<div class="sticky top-[60px] z-20 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-3 py-2.5 shadow-xs">' +
          clockHtml("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-base font-bold tabular-nums") +
          '<button type="button" data-ec-action="submit" title="Submit your answers before the timer runs out" class="px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">' +
            ico(ICON.flag, "w-3.5 h-3.5") + "Finish Early</button>" +
          '<span class="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline">' + st.answered + " / " + st.total + " parts answered</span>" +
          '<details class="relative ml-auto">' +
            '<summary class="cursor-pointer list-none rounded-lg border border-[#D6D3D1] dark:border-neutral-700 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 [&::-webkit-details-marker]:hidden">' +
              ico(ICON.listChecks, "w-3.5 h-3.5") + "Questions" + ico(ICON.chevronDown, "w-3.5 h-3.5") +
            "</summary>" +
            '<div class="absolute right-0 top-full mt-2 z-30 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 shadow-xl">' +
              '<div class="flex items-center gap-2 mb-2">' + ico(ICON.listChecks, "w-4 h-4 text-indigo-600 dark:text-indigo-400") +
                '<h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">Question Navigator</h3></div>' +
              '<div data-ec-navigator>' + navigatorHtml() + "</div>" +
            "</div>" +
          "</details>" +
        "</div>" +
        '<div class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] gap-5 lg:gap-6 items-start">' +
          '<div class="min-w-0 md:sticky md:top-32 md:max-h-[calc(100vh-10rem)] md:overflow-y-auto">' +
            casePanelHtml(q) + strictNote +
          "</div>" +
          '<section class="min-w-0">' + statusStripHtml() + questionCardHtml(q) + questionNavHtml() + "</section>" +
        "</div>";
    } else {
      body =
        '<section class="min-w-0">' + statusStripHtml() + casePanelHtml(q) + questionCardHtml(q) + questionNavHtml() + "</section>" +
        '<aside class="md:sticky md:top-20 space-y-4">' +
          '<div class="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">' +
            '<div class="flex items-center gap-2 mb-3">' + ico(ICON.clock, "w-4 h-4 text-indigo-600 dark:text-indigo-400") +
              '<h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">Countdown</h3></div>' +
            '<div class="rounded-xl border px-3 py-3 text-center font-mono text-3xl font-bold tabular-nums ' + clockTone() + '" data-ec-clock data-ec-clock-base="rounded-xl border px-3 py-3 text-center font-mono text-3xl font-bold tabular-nums">' + formatTime(timeLeft) + "</div>" +
            '<p class="mt-2 text-[10px] text-[#78716C] dark:text-neutral-400 leading-snug">The exam auto-submits when the timer reaches zero, or you can use Finish Early at any time. The case study stays available throughout.</p>' +
          "</div>" +
          '<div class="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">' +
            '<div class="flex items-center gap-2 mb-3">' + ico(ICON.listChecks, "w-4 h-4 text-indigo-600 dark:text-indigo-400") +
              '<h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">Question Navigator</h3></div>' +
            '<div data-ec-navigator>' + navigatorHtml() + "</div>" +
          "</div>" +
          '<div class="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-3 flex gap-2">' +
            ico(ICON.shieldAlert, "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5") +
            '<p class="text-[10px] leading-snug text-amber-900 dark:text-amber-200">Strict conditions: work independently, no notes. Use the case study facts, figures and appendices in your answers.</p></div>' +
        "</aside>";
    }

    main.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '">' + header +
      '<main class="' + workspaceClass + '">' + body + "</main></div>";
    bindEvents(main);
  }

  function questionReviewHtml(q, index) {
    var html = '<article class="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">' +
      '<header class="px-4 sm:px-5 py-3 border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/70 dark:bg-black/30 flex flex-wrap items-center gap-2">' +
        '<span class="w-6 h-6 rounded-full bg-[#0F2042] dark:bg-white text-white dark:text-black text-[11px] font-bold flex items-center justify-center">' + (index + 1) + "</span>" +
        '<span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">' + esc(q.number) + "</span>" +
        '<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">' + q.marks + " marks</span>" +
        '<span class="text-[10px] font-mono text-[#78716C] dark:text-neutral-400">' + esc(q.scenarioId != null ? q.scenarioId : exam.scenarioId) + "</span>" +
      "</header><div class=\"p-4 sm:p-5 space-y-4\">" + questionReviewStimulusHtml(q);

    q.parts.forEach(function (part) {
      var answer = String(answers[part.id] || "").replace(/^\s+|\s+$/g, "");
      html += '<div class="' + (q.parts.length > 1 ? "rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/50 dark:bg-black/20 p-3" : "") + '">';
      if (part.label) {
        html += '<div class="flex items-center gap-2 mb-1.5"><span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black">' + esc(part.label) + "</span>" +
          '<span class="text-[10px] font-mono font-bold text-[#78716C] dark:text-neutral-400">' + part.marks + " marks</span></div>";
      }
      html += '<h3 class="text-sm sm:text-base font-bold text-[#0F2042] dark:text-white leading-relaxed">' + esc(part.questionText) + "</h3>" +
        '<div class="grid md:grid-cols-2 gap-4 mt-3">' +
          "<div><div class=\"text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5\">Your answer</div>" +
          '<div class="rounded-xl border p-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap min-h-[84px] ' + (answer ? "border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-neutral-200" : "border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 italic") + '">' +
          (answer ? esc(answer) : "No answer submitted.") + "</div></div>" +
          "<div><div class=\"text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5\">" +
          ico(ICON.checkCircle, "w-3 h-3") + "Cambridge model answer</div>" +
          '<div class="rounded-xl border border-emerald-300/60 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs sm:text-sm leading-relaxed text-[#1C1917] dark:text-neutral-200 whitespace-pre-line">' +
          esc(part.modelAnswer || "No model answer available.") + "</div></div>" +
        "</div></div>";
    });

    if (q.markScheme.length) {
      html += '<div><div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">Mark scheme points</div><div class="grid sm:grid-cols-2 gap-2">';
      q.markScheme.forEach(function (group) {
        html += '<div class="rounded-lg border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black/40 p-2.5">' +
          '<div class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300 mb-1">' + esc(group.label) + "</div><ul class=\"space-y-1\">";
        group.points.forEach(function (p) {
          html += '<li class="text-[11px] leading-snug text-[#57534E] dark:text-neutral-400 flex gap-1.5"><span class="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span><span>' + esc(p) + "</span></li>";
        });
        html += "</ul></div>";
      });
      html += "</div></div>";
    }

    // Self-marking with band / Level labels derived from the mark scheme keys.
    var mine = parseInt(selfMarks[q.id], 10);
    if (isNaN(mine)) mine = 0;
    html += '<div class="rounded-xl border border-[#0F2042]/20 dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black/40 p-3" data-ec-selfmark="' + esc(q.id) + '">' +
      '<div class="flex flex-wrap items-center justify-between gap-2 mb-2">' +
        '<span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">Self-mark this question</span>' +
        '<label class="text-[10px] font-mono text-[#57534E] dark:text-neutral-400">Awarded <input type="number" min="0" max="' + q.marks + '" value="' + mine + '" data-ec-mark="' + esc(q.id) + '" class="w-16 px-2 py-1 border border-[#D6D3D1] dark:border-neutral-700 rounded-md text-xs font-bold" /> / ' + q.marks + "</label>" +
      "</div>" +
      '<div class="flex flex-wrap gap-1.5">';
    q.markScheme.forEach(function (group) {
      var bandMark = q.marks;
      var m;
      if ((m = /^level_(\d+)_(\d+)_to_(\d+)$/.exec(group.key))) bandMark = parseInt(m[3], 10);
      else if ((m = /_max_(\d+)$/.exec(group.key))) bandMark = parseInt(m[1], 10);
      bandMark = Math.min(bandMark, q.marks);
      html += '<button type="button" data-ec-action="band" data-part="' + esc(q.id) + '" data-mark="' + bandMark + '" class="px-2 py-1 rounded-md border text-[10px] font-mono font-semibold band-btn">' + esc(group.label) + "</button>";
    });
    html += '<button type="button" data-ec-action="clear-mark" data-part="' + esc(q.id) + '" class="px-2 py-1 rounded-md border border-[#E7E5E4] dark:border-neutral-800 text-[10px] font-mono text-[#78716C] dark:text-neutral-400">Clear</button>' +
      "</div></div>";

    return html + "</div></article>";
  }

  function renderFinished(main) {
    var total = selfScore();
    var pct = exam.totalMarks ? Math.round((total / exam.totalMarks) * 100) : 0;
    var grade = getGrade(pct);
    var timeUsed = exam.durationSeconds - timeLeft;
    var questions = exam.questions.map(questionReviewHtml).join("");
    // Full-paper questions carry their own case panel; only show the shared
    // paper-level insert in review when no question has a caseStem.
    var anyQuestionCase = false;
    exam.questions.forEach(function (q) { if (q.caseStem) anyQuestionCase = true; });

    var header = headerHtml(
      '<button type="button" data-ec-action="exit" class="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer">' +
        ico(ICON.logOut, "w-3.5 h-3.5") + '<span class="hidden sm:inline">Exit Exam</span></button>',
      { text: "Mock Exam Complete", cls: "bg-emerald-600" },
      exam.title + " · " + exam.totalMarks + " marks"
    );

    var stats = [
      ["Time used", formatTime(timeUsed), "text-[#0F2042] dark:text-white"],
      ["Questions answered", answeredQuestions() + " / " + exam.questions.length, "text-emerald-700 dark:text-emerald-400"],
      ["Marks available", String(exam.totalMarks), "text-[#0F2042] dark:text-white"],
      ["Words written", String(wordTotal()), "text-indigo-700 dark:text-indigo-400"]
    ].map(function (s) {
      return '<div class="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"><div class="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">' + esc(s[0]) + '</div><div class="text-xl font-bold text-[#0F2042] dark:text-white font-mono ' + s[2] + '">' + esc(s[1]) + "</div></div>";
    }).join("");

    main.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '">' + header +
      '<main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">' +
        '<div class="mb-6">' +
          '<p class="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171] mb-1">Exam review · ' + esc(exam.title) + "</p>" +
          '<h1 class="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white">' + (ranOutOfTime ? "Time's up!" : "Exam submitted") + "</h1>" +
          '<p class="mt-2 text-sm text-[#57534E] dark:text-neutral-400 max-w-3xl">' +
            (ranOutOfTime ? "The countdown reached zero and your paper was submitted automatically. " : "Your answers are below next to the Cambridge model answers. ") +
            "Compare each response against the mark scheme to see where you earned knowledge, application, analysis, and evaluation credit." +
          "</p>" +
        "</div>" +
        '<div class="rounded-2xl border border-[#0F2042]/20 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">' +
          '<div><div class="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">Self-marked total</div>' +
            '<div class="text-3xl font-bold font-mono text-[#0F2042] dark:text-white"><span data-ec-total>' + total + "</span> / " + exam.totalMarks +
            ' <span class="text-base text-[#78716C] dark:text-neutral-400">(<span data-ec-pct>' + pct + '%</span>)</span></div></div>' +
          '<div class="text-right"><div class="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">Indicative grade</div>' +
            '<div class="text-2xl font-bold text-[#0F2042] dark:text-white"><span data-ec-grade>' + esc(grade.grade) + '</span></div><div class="text-[11px] text-[#57534E] dark:text-neutral-400"><span data-ec-grade-label>' + esc(grade.label) + "</span></div></div>" +
        "</div>" +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">' + stats + "</div>" +
        (anyQuestionCase ? "" : casePanelHtml(null)) +
        '<div class="space-y-5">' + questions + "</div>" +
        '<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">' +
          '<button type="button" data-ec-action="retake" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0F2042] dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">' +
            ico(ICON.rotateCcw, "w-4 h-4") + "Retake with new questions</button>" +
          '<button type="button" data-ec-action="choose" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">' +
            ico(ICON.fileText, "w-4 h-4") + "Choose another paper</button>" +
          '<button type="button" data-ec-action="home" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">' +
            ico(ICON.logOut, "w-4 h-4") + "Return to Study Studio</button>" +
        "</div>" +
      "</main></div>";
    bindEvents(main);
    paintBands(main);
  }

  // ------------------------------------------------------------------
  // Timer
  // ------------------------------------------------------------------
  function paintClocks() {
    forEachNode(document.querySelectorAll("[data-ec-clock]"), function (node) {
      node.textContent = formatTime(timeLeft);
      node.className = (node.getAttribute("data-ec-clock-base") || "") + " " + clockTone();
    });
    // The header clock keeps its inline timer icon, so refresh its label and
    // the enclosing pill's tone separately (paintClocks handles both clock nodes).
    forEachNode(document.querySelectorAll("[data-ec-clock-text]"), function (node) {
      node.textContent = formatTime(timeLeft);
      var pill = node.parentNode;
      if (pill && pill.getAttribute("data-ec-clock-tone")) {
        pill.className = pill.getAttribute("data-ec-clock-tone") + " " + clockTone();
      }
    });
  }
  function tick() {
    // If this view was replaced by another EC view, stop the clock and restore
    // normal navigation instead of submitting over the top of that view.
    if (!mainEl || stage !== "active" || !mainEl.querySelector("[data-ec-mocks-root]")) {
      stopTimer();
      setExamMode(false);
      return;
    }
    timeLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    paintClocks();
    if (timeLeft <= 0) finishExam(true);
  }
  function startTimer() {
    stopTimer();
    timerId = window.setInterval(tick, 500);
    tick();
  }
  function stopTimer() {
    if (timerId !== null) { window.clearInterval(timerId); timerId = null; }
  }

  // ------------------------------------------------------------------
  // Result persistence (EC.store → progress dashboard)
  // ------------------------------------------------------------------
  function saveResults() {
    var total = selfScore();
    var pct = exam.totalMarks ? Math.round((total / exam.totalMarks) * 100) : 0;
    var now = Date.now();
    lastRecordId = "mock-" + exam.id + "-" + now;
    var record = {
      id: lastRecordId,
      examId: exam.id, title: exam.title, paper: exam.paper,
      scenarioId: exam.scenarioId, unit: exam.unit,
      date: new Date(now).toISOString(),
      selfScore: total, totalMarks: exam.totalMarks, percentage: pct,
      timeUsedSeconds: exam.durationSeconds - timeLeft,
      totalWords: wordTotal(), questionsAnswered: answeredQuestions(),
      questionCount: exam.questions.length, ranOutOfTime: ranOutOfTime,
      answers: answers, selfMarks: selfMarks
    };
    var results = EC.store.get("mocks_results", []);
    if (Object.prototype.toString.call(results) !== "[object Array]") results = [];
    results.unshift(record);
    EC.store.set("mocks_results", results.slice(0, 30));

    // Append a dashboard-compatible submission record (StudentSubmissionRecord
    // shape used by src/lib/cookies.ts → loadSubmissions()).
    var submission = {
      id: record.id,
      questionId: record.id,
      questionTitle: exam.title + " (mock)",
      marks: total,
      paper: exam.paper,
      syllabus: "0264",
      unit: exam.unit,
      studentAnswer: "",
      wordCount: record.totalWords,
      timeSpentSeconds: record.timeUsedSeconds,
      result: {
        totalScore: total, maxMarks: exam.totalMarks, percentage: pct,
        aoBreakdown: {}, strengths: [], improvements: [],
        examinerNotes: "Timed mock exam · self-marked",
        modelAnswerSnippet: "", isAiEvaluated: false,
        evaluatedAt: record.date
      },
      timestamp: record.date
    };
    var subs = EC.store.get("submissions", []);
    if (Object.prototype.toString.call(subs) !== "[object Array]") subs = [];
    subs.unshift(submission);
    EC.store.set("submissions", subs.slice(0, 100));

    // Mark these questions complete so "unseen question" logic elsewhere
    // treats them as practised, matching MockExamMode's onMarkDone calls.
    var done = EC.store.get("completed_questions", []);
    if (Object.prototype.toString.call(done) !== "[object Array]") done = [];
    exam.questions.forEach(function (q) {
      // Forward the id format used by the unseen-question filters above.
      if (q.doneId && done.indexOf(q.doneId) < 0) done.push(q.doneId);
      if (done.indexOf(q.canonical) < 0) done.push(q.canonical);
    });
    EC.store.set("completed_questions", done);
  }

  // Keep the stored result in sync when the student self-marks in review.
  function refreshStoredResult() {
    if (!lastRecordId || !exam) return;
    var total = selfScore();
    var pct = exam.totalMarks ? Math.round((total / exam.totalMarks) * 100) : 0;
    var results = EC.store.get("mocks_results", []);
    if (Object.prototype.toString.call(results) === "[object Array]") {
      results.forEach(function (r) {
        if (r && r.id === lastRecordId) {
          r.selfScore = total; r.percentage = pct; r.selfMarks = selfMarks;
        }
      });
      EC.store.set("mocks_results", results);
    }
    var subs = EC.store.get("submissions", []);
    if (Object.prototype.toString.call(subs) === "[object Array]") {
      subs.forEach(function (s) {
        if (s && s.id === lastRecordId) {
          s.marks = total;
          s.result.totalScore = total; s.result.percentage = pct;
        }
      });
      EC.store.set("submissions", subs);
    }
  }

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  function startExam(id) {
    var config = null;
    EXAM_CONFIGS.forEach(function (c) { if (c.id === id) config = c; });
    if (!config) return;
    // Choosing the paper a saved draft belongs to resumes it automatically;
    // any other choice starts a new paper and discards the old draft. This
    // also covers "Retake with new questions", which calls startExam.
    if (draftNotice && draftNotice.examId === id && draftSecondsLeft(draftNotice) > 0) {
      restoreExam();
      return;
    }
    clearDraft();
    mainEl.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '"><main class="study-page"><p class="study-panel-kicker">Mock Exam</p><h1 class="study-title">Preparing your paper…</h1><p class="study-description">Loading the case study and questions.</p></main></div>';

    var isPaper1 = id === "paper1" || id === "paper1_full_exam";
    var load = isPaper1 ? EC.load("paper1") : EC.load("paper2");
    load.then(function (data) {
      if (isPaper1) p1Data = data; else p2Data = data;
      exam = createExam(id);
      answers = {};
      selfMarks = {};
      currentIndex = 0;
      lastRecordId = null;
      ranOutOfTime = false;
      showCaseStudy = true;
      caseTab = "narrative";
      timeLeft = exam.durationSeconds;
      deadline = Date.now() + exam.durationSeconds * 1000;
      stage = "active";
      setExamMode(true);
      saveDraft();
      renderActive(mainEl);
      startTimer();
      window.scrollTo(0, 0);
    }).catch(function (err) {
      mainEl.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '"><main class="study-page"><p class="study-panel-kicker">Mock Exam</p><h1 class="study-title">Could not load the mock exam</h1><div class="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">' + esc(err && err.message) + "</div></main></div>";
    });
  }

  // Restore a saved paper: reload the bank, reapply the snapshot fields and
  // recompute the deadline from the remaining seconds so the clock carries on
  // from where the student left it. The draft is refreshed, not cleared, so a
  // second reload still resumes.
  function restoreExam() {
    var d = draftNotice || readDraft();
    if (!d) return renderSelect(mainEl);
    var id = d.examId;
    if (!isExamId(id)) { clearDraft(); return renderSelect(mainEl); }
    mainEl.innerHTML = '<div data-ec-mocks-root class="' + ROOT_CLS + '"><main class="study-page"><p class="study-panel-kicker">Mock Exam</p><h1 class="study-title">Restoring your saved paper…</h1><p class="study-description">Putting your answers and timer back where you left them.</p></main></div>';
    var isPaper1 = id === "paper1" || id === "paper1_full_exam";
    var load = isPaper1 ? EC.load("paper1") : EC.load("paper2");
    load.then(function (data) {
      if (isPaper1) p1Data = data; else p2Data = data;
      exam = createExam(id);
      // Answers are keyed by part id, exactly as in the original draft shape.
      answers = normaliseAnswers(d.answers);
      selfMarks = {};
      currentIndex = clampIndex(d.currentIndex, exam.questions.length);
      caseTab = d.caseTab || "narrative";
      showCaseStudy = d.showCaseStudy !== false && caseTab !== "hidden";
      timeLeft = Math.min(draftSecondsLeft(d), exam.durationSeconds);
      deadline = Date.now() + timeLeft * 1000;
      ranOutOfTime = false;
      lastRecordId = null;
      stage = "active";
      draftNotice = null;
      setExamMode(true);
      saveDraft();
      renderActive(mainEl);
      startTimer();
      window.scrollTo(0, 0);
    }).catch(function () {
      // Keep the draft if the bank could not be loaded so the student can
      // retry restoration from the picker.
      renderSelect(mainEl);
    });
  }

  function finishExam(auto) {
    if (stage !== "active") return;
    stopTimer();
    clearDraft();
    ranOutOfTime = !!auto;
    showCaseStudy = false; // collapse the case study on submit / time-up
    stage = "finished";
    setExamMode(false);
    saveResults();
    renderFinished(mainEl);
    window.scrollTo(0, 0);
  }

  function handleSubmit() {
    if (stage !== "active") return;
    var unanswered = exam.questions.length - answeredQuestions();
    if (unanswered > 0 && !window.confirm("You still have " + unanswered + " unanswered question" + (unanswered === 1 ? "" : "s") + ". Submit the exam anyway?")) return;
    finishExam(false);
  }

  function handleExit() {
    if (stage === "active" && !window.confirm("Exit Mock Exam Mode? Your current answers will be discarded.")) return;
    stopTimer();
    clearDraft();
    setExamMode(false);
    exam = null; answers = {}; selfMarks = {}; currentIndex = 0;
    EC.navigate("overview");
  }

  function paintBands(main) {
    forEachNode(main.querySelectorAll("[data-ec-selfmark]"), function (box) {
      var id = box.getAttribute("data-ec-selfmark");
      var val = parseInt(selfMarks[id], 10);
      if (isNaN(val)) val = 0;
      forEachNode(box.querySelectorAll(".band-btn"), function (btn) {
        var active = parseInt(btn.getAttribute("data-mark"), 10) === val;
        btn.className = "px-2 py-1 rounded-md border text-[10px] font-mono font-semibold band-btn " +
          (active ? "border-[#0F2042] bg-[#0F2042] text-white" : "border-[#E7E5E4] text-[#57534E]");
      });
    });
  }

  function updateSelfSummary(main) {
    var total = selfScore();
    var pct = exam.totalMarks ? Math.round((total / exam.totalMarks) * 100) : 0;
    var grade = getGrade(pct);
    forEachNode(main.querySelectorAll("[data-ec-total]"), function (n) { n.textContent = total; });
    forEachNode(main.querySelectorAll("[data-ec-pct]"), function (n) { n.textContent = pct + "%"; });
    forEachNode(main.querySelectorAll("[data-ec-grade]"), function (n) { n.textContent = grade.grade; });
    forEachNode(main.querySelectorAll("[data-ec-grade-label]"), function (n) { n.textContent = grade.label; });
    paintBands(main);
    refreshStoredResult();
  }

  // ------------------------------------------------------------------
  // Event delegation (one handler per stage, re-bound safely)
  // ------------------------------------------------------------------
  function bindEvents(main) {
    if (main._mockClick) main.removeEventListener("click", main._mockClick);
    if (main._mockInput) main.removeEventListener("input", main._mockInput);

    main._mockClick = function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var node = target.closest("[data-ec-action]");
      if (!node || !main.contains(node)) return;
      var action = node.getAttribute("data-ec-action");

      if (action === "start") { startExam(node.getAttribute("data-id")); return; }
      if (action === "resume") { restoreExam(); return; }
      if (action === "fresh") { clearDraft(); renderSelect(main); window.scrollTo(0, 0); return; }
      if (action === "layout") { changeLayout(node.getAttribute("data-layout")); return; }
      if (action === "toggle-case") {
        showCaseStudy = !showCaseStudy;
        caseTab = showCaseStudy ? "narrative" : "hidden";
        if (stage === "active") { saveDraft(); renderActive(main); } else renderFinished(main);
        return;
      }
      if (action === "goto") { currentIndex = parseInt(node.getAttribute("data-index"), 10) || 0; saveDraft(); renderActive(main); window.scrollTo(0, 0); return; }
      if (action === "prev") { currentIndex = Math.max(0, currentIndex - 1); saveDraft(); renderActive(main); return; }
      if (action === "next") { currentIndex = Math.min(exam.questions.length - 1, currentIndex + 1); saveDraft(); renderActive(main); window.scrollTo(0, 0); return; }
      if (action === "submit") { handleSubmit(); return; }
      if (action === "exit") { handleExit(); return; }
      if (action === "choose") { stopTimer(); clearDraft(); exam = null; answers = {}; selfMarks = {}; currentIndex = 0; setExamMode(false); renderSelect(main); window.scrollTo(0, 0); return; }
      if (action === "retake") { startExam(exam.id); return; }
      if (action === "home") { EC.navigate("overview"); return; }
      if (action === "band") {
        var part = node.getAttribute("data-part");
        selfMarks[part] = parseInt(node.getAttribute("data-mark"), 10) || 0;
        var input = main.querySelector('[data-ec-mark="' + part + '"]');
        if (input) input.value = selfMarks[part];
        updateSelfSummary(main);
        return;
      }
      if (action === "clear-mark") {
        var p = node.getAttribute("data-part");
        delete selfMarks[p];
        var inp = main.querySelector('[data-ec-mark="' + p + '"]');
        if (inp) inp.value = 0;
        updateSelfSummary(main);
        return;
      }
    };
    main.addEventListener("click", main._mockClick);

    main._mockInput = function (event) {
      var target = event.target;
      if (!target || !target.getAttribute) return;
      var partId = target.getAttribute("data-ec-answer");
      if (partId !== null) {
        answers[partId] = target.value;
        saveDraft();
        var word = main.querySelector('[data-ec-words="' + partId + '"]');
        if (word) word.textContent = countWords(target.value) + " words";
        // Refresh progress indicators without rebuilding the active DOM
        // (keeps the textarea focused while the student is typing).
        var answeredLbl = main.querySelector("[data-ec-answered-q]");
        if (answeredLbl) answeredLbl.textContent = answeredQuestions() + " / " + exam.questions.length + " questions answered";
        var nav = main.querySelector("[data-ec-navigator]");
        if (nav) nav.innerHTML = navigatorHtml();
        return;
      }
      var markId = target.getAttribute("data-ec-mark");
      if (markId !== null) {
        var v = parseInt(target.value, 10);
        if (isNaN(v) || v < 0) v = 0;
        var qq = null;
        exam.questions.forEach(function (q) { if (q.id === markId) qq = q; });
        if (qq) v = Math.min(v, qq.marks);
        selfMarks[markId] = v;
        updateSelfSummary(main);
      }
    };
    main.addEventListener("input", main._mockInput);
  }

  // ------------------------------------------------------------------
  // Register the view. Also expose on window.ECViews so the wrapper in
  // app.js (which checks ECViews.mocks) delegates here correctly.
  // ------------------------------------------------------------------
  var definition = {
    title: "Mock exams",
    render: function (main, params, name) {
      mainEl = main;
      ensureExamStyles();
      if (!migratedLegacy) { migratedLegacy = true; migrateLegacyDraft(); }
      layout = loadExamLayout();
      // If an exam is still running (e.g. a popstate re-render), resume it.
      if (stage === "active" && exam) {
        setExamMode(true);
        renderActive(main);
        startTimer();
      } else if (stage === "finished" && exam) {
        setExamMode(false);
        renderFinished(main);
      } else {
        renderSelect(main);
      }
    }
  };
  window.EC.register("mocks", definition);
  if (!window.ECViews) window.ECViews = {};
  window.ECViews.mocks = definition;
})();
