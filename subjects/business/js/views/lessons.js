/* EcBiz lessons view — plain-browser port of the Interactive Lessons Studio.
 * No frameworks, no build step. All content comes from ./data/lessons.json.
 * Presentation markup mirrors the original React app (InteractiveLessonsView,
 * InteractiveLessonCard and WordDropExercise) class-for-class so the compiled
 * style.css produces identical visuals. Behaviour and persistence are unchanged.
 */
(function () {
  "use strict";
  if (!window.EC) return;

  var PROGRESS_KEY = "interactive_lessons_progress_v1";
  var HINTS_KEY = "interactive_lessons_hints_v1";
  var ACTIVE_KEY = "interactive_lessons_active_v1";

  var RATING_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };
  var RATING_OPTIONS = [
    {
      value: "easy", label: "Easy", description: "I can explain it",
      activeClass: "border-[#a9bb8b] bg-[#edf2e7] text-[#2c4a28] dark:border-[#617b4d] dark:bg-[#1c2b18] dark:text-[#dce9c8]",
      dotClass: "bg-[#6e8b58]"
    },
    {
      value: "medium", label: "Medium", description: "Mostly clear",
      activeClass: "border-[#d8bd80] bg-[#faf1d7] text-[#6e5017] dark:border-[#7e693b] dark:bg-[#2c2514] dark:text-[#f0dca8]",
      dotClass: "bg-[#c49a4a]"
    },
    {
      value: "hard", label: "Hard", description: "Needs review",
      activeClass: "border-[#d7a596] bg-[#f7e7e1] text-[#7b3b2b] dark:border-[#7d5145] dark:bg-[#2d1c18] dark:text-[#efc6b8]",
      dotClass: "bg-[#b46a55]"
    }
  ];

  var COMMAND_WORD_GUIDANCE = {
    calculate: "Show the formula, substitute the figures, then state the unit or percentage.",
    explain: "Make a point, then develop it with a reason or consequence.",
    identify: "Name or state the correct answer — no development is needed.",
    recommend: "Make a decision and justify it with evidence from the scenario, weighing up the alternative.",
    evaluate: "Give both sides of the argument, then reach a supported judgement.",
    analyse: "Break the issue into parts and explain how they connect.",
    discuss: "Present both sides and support each with business reasoning.",
    justify: "Support your choice with evidence and compare it with the alternative."
  };

  var MAX_GAPS = 12;
  var MAX_GAPS_PER_CONCEPT = 3;
  var MIN_DECOY_COUNT = 5;
  var DECOY_POOL = [
    "opportunity cost", "cash flow", "market share", "interest rate", "brand image",
    "supplier", "revenue", "profit margin", "motivation", "quality control",
    "break-even", "liquidity", "stakeholder", "added value", "division of labour",
    "fixed costs", "variable costs", "customer loyalty", "net profit", "market research",
    "sole trader", "unlimited liability", "limited liability", "economies of scale",
    "span of control", "chain of command", "autocratic", "democratic", "job rotation",
    "job enrichment", "piece rates", "price skimming", "penetration pricing",
    "focus group", "batch production", "flow production", "lean production",
    "working capital", "acid test", "appreciation", "depreciation", "import tariff",
    "import quota", "pressure group"
  ];

  var ICONS = {
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    checkCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    listChecks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bookOpen: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.83"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    graduationCap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    gripVertical: '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
    mousePointerClick: '<path d="m14 14-1.5 1.5"/><path d="m18.5 9.5 1.5-1.5"/><path d="M19.5 5.5 21 4"/><path d="M21 12a9 9 0 1 1-6.2-8.56"/><path d="m4 4 6.2 6.2"/><path d="m9.5 14.5-1.7 5.1a1 1 0 0 0 1.9.7L12 16"/>'
  };

  var state = {
    sections: [], lessons: [], byId: {}, lessonOrder: [],
    activeId: null, lastRenderedId: null,
    progress: {}, hints: {},
    selectedOption: null,
    word: { assignments: {}, selectedWord: null, checked: false },
    confirmingReset: false,
    scrollToReader: false,
    main: null, bound: false, token: 0
  };

  /* ---------- small helpers ---------- */

  function esc(v) { return EC.esc(v); }
  function normalise(v) { return String(v == null ? "" : v).trim().toLowerCase(); }
  function termStep(n) { return Math.max(1, Math.ceil(n * 0.25)); }
  function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

  function imul(a, b) {
    var ah = (a >>> 16) & 0xffff, al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff, bl = b & 0xffff;
    return ((al * bl) + ((((ah * bl) + (al * bh)) << 16) >>> 0)) | 0;
  }
  function hashString(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function seededShuffle(items, seed) {
    var result = items.slice(), s = seed || 1, i, j, tmp;
    for (i = result.length - 1; i > 0; i--) {
      s = (imul(s, 1664525) + 1013904223) >>> 0;
      j = s % (i + 1);
      tmp = result[i]; result[i] = result[j]; result[j] = tmp;
    }
    return result;
  }
  function hiddenTermDots(term) {
    var n = Math.min(7, Math.max(3, Math.ceil(String(term).length / 2)));
    return new Array(n + 1).join("\u2022");
  }

  function splitConcept(text) {
    var tokens = [], re = /\[\[([^\]]+)\]\]/g, m, last = 0, index = 0;
    text = String(text == null ? "" : text);
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) tokens.push({ kind: "text", value: text.slice(last, m.index) });
      tokens.push({ kind: "term", value: m[1], index: index });
      index += 1;
      last = re.lastIndex;
    }
    if (last < text.length) tokens.push({ kind: "text", value: text.slice(last) });
    return { tokens: tokens, count: index };
  }

  function numericSort(a, b) { return a - b; }
  function getRevealed(conceptId, termCount) {
    var raw = state.hints[conceptId], out = [], i, v;
    if (!Array.isArray(raw)) return out;
    for (i = 0; i < raw.length; i++) {
      v = raw[i];
      if (typeof v === "number" && v >= 0 && v < termCount && out.indexOf(v) < 0) out.push(v);
    }
    return out.sort(numericSort);
  }
  function setRevealed(conceptId, indices) {
    if (!indices.length) delete state.hints[conceptId];
    else state.hints[conceptId] = indices.slice().sort(numericSort);
    EC.store.set(HINTS_KEY, state.hints);
  }
  function hintConcept(conceptId, termCount) {
    if (termCount <= 0) return;
    var cur = getRevealed(conceptId, termCount), step = termStep(termCount), i;
    for (i = 0; i < termCount && step > 0; i++) {
      if (cur.indexOf(i) < 0) { cur.push(i); step -= 1; }
    }
    setRevealed(conceptId, cur);
  }
  function toggleTerm(conceptId, index, termCount) {
    if (index < 0 || index >= termCount) return;
    var cur = getRevealed(conceptId, termCount), at = cur.indexOf(index);
    if (at >= 0) cur.splice(at, 1); else cur.push(index);
    setRevealed(conceptId, cur);
  }
  function hideConcept(conceptId) { setRevealed(conceptId, []); }
  function resetTerms(lesson) {
    var i, id;
    for (i = 0; i < lesson.concepts.length; i++) {
      id = lesson.concepts[i].id;
      if (state.hints[id]) delete state.hints[id];
    }
    EC.store.set(HINTS_KEY, state.hints);
  }

  function isComplete(id) { return !!(state.progress[id] && state.progress[id].rating); }
  function confidenceCounts() {
    var counts = { easy: 0, medium: 0, hard: 0 }, id, rating;
    for (id in state.progress) {
      if (!has(state.progress, id)) continue;
      rating = state.progress[id] && state.progress[id].rating;
      if (rating === "easy" || rating === "medium" || rating === "hard") counts[rating] += 1;
    }
    return counts;
  }
  function completedCount() {
    var n = 0, i;
    for (i = 0; i < state.lessons.length; i++) if (isComplete(state.lessons[i].id)) n += 1;
    return n;
  }
  function sectionCompletion(sectionCode) {
    var s = null, i;
    for (i = 0; i < state.sections.length; i++) if (state.sections[i].code === sectionCode) s = state.sections[i];
    var total = s ? s.lessons.length : 0, done = 0;
    if (s) for (i = 0; i < s.lessons.length; i++) if (isComplete(s.lessons[i].id)) done += 1;
    return { completed: done, total: total, percentage: total ? Math.round(done / total * 100) : 0 };
  }
  function nextIncomplete() {
    var i, l;
    for (i = 0; i < state.lessons.length; i++) {
      l = state.lessons[i];
      if (!isComplete(l.id)) return l;
    }
    return state.lessons[0];
  }
  function formatDate(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    } catch (e) { return ""; }
  }
  function commandGuidance(word) {
    var key = String(word == null ? "" : word).toLowerCase();
    return COMMAND_WORD_GUIDANCE[key] ||
      "Read the command word carefully, then structure your answer to match what it asks you to do.";
  }
  function resetLocal() {
    state.selectedOption = null;
    state.word = { assignments: {}, selectedWord: null, checked: false };
  }

  /* Some gap answers are interchangeable — the order does not change the
   * meaning, so a student must get the mark whichever slot they choose. */
  var SWAPPABLE_GROUPS = [
    ["growth", "boom"],
    ["corporation tax", "income tax"],
    ["change product mix", "negotiate supplier terms"]
  ];
  function sameAnswer(a, b) {
    var x = normalise(a), y = normalise(b);
    if (x === y) return true;
    for (var i = 0; i < SWAPPABLE_GROUPS.length; i++) {
      var group = SWAPPABLE_GROUPS[i], hasX = false, hasY = false;
      for (var j = 0; j < group.length; j++) {
        var g = normalise(group[j]);
        if (g === x) hasX = true;
        if (g === y) hasY = true;
      }
      if (hasX && hasY) return true;
    }
    return false;
  }
  function gapIsCorrect(gap, value) {
    return !!(value && sameAnswer(value, gap.answer));
  }
  /* Keep every correct gap, clear only the wrong/empty ones, and let the
   * student try again without losing the work they already got right. */
  function retryWrongGaps(gaps) {
    var next = {}, i, gap, value;
    for (i = 0; i < gaps.length; i++) {
      gap = gaps[i];
      value = state.word.assignments[gap.id];
      if (gapIsCorrect(gap, value)) next[gap.id] = value;
    }
    state.word.assignments = next;
    state.word.selectedWord = null;
    state.word.checked = false;
  }

  /* ---------- zero-dependency confetti (first-rating celebration) ----------
   * Mirrors the original canvas-confetti call:
   *   { particleCount: 70, spread: 62, origin: { y: 0.78 },
   *     colors: ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"] }
   * No external library — just injected CSS + absolutely positioned pieces
   * animated with the Web Animations API (CSS-transition fallback) and removed
   * after ~1.8s.
   */

  var CONFETTI_COLORS = ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"];
  var confettiStyleInjected = false;

  function injectConfettiStyle() {
    if (confettiStyleInjected) return;
    confettiStyleInjected = true;
    if (!document.createElement || (!document.head && !document.documentElement)) return;
    var style = document.createElement("style");
    style.type = "text/css";
    style.textContent =
      ".ec-confetti-layer{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:2147483647;}" +
      ".ec-confetti-piece{position:absolute;display:block;border-radius:1px;opacity:1;will-change:transform,opacity;}";
    (document.head || document.documentElement).appendChild(style);
  }

  function fireConfetti() {
    if (typeof document === "undefined" || !document.body || !document.createElement) return;
    injectConfettiStyle();
    var vw = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1024;
    var vh = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 768;
    var layer = document.createElement("div");
    layer.className = "ec-confetti-layer";
    document.body.appendChild(layer);

    var pieces = [], specs = [], i, p, size, tx, rise, fall, rot, dur, delay;
    for (i = 0; i < 70; i++) {
      p = document.createElement("i");
      size = 5 + Math.random() * 7;
      tx = (Math.random() * 2 - 1) * vw * 0.24;
      rise = vh * (0.14 + Math.random() * 0.28);
      fall = vh * (0.04 + Math.random() * 0.12);
      rot = Math.round((Math.random() * 2 - 1) * 720);
      dur = 1100 + Math.round(Math.random() * 500);
      delay = Math.round(Math.random() * 130);
      p.className = "ec-confetti-piece";
      p.style.left = (48 + Math.random() * 4) + "%";
      p.style.top = "78%";
      p.style.width = (size * 0.6).toFixed(1) + "px";
      p.style.height = size.toFixed(1) + "px";
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      p.style.transform = "translate3d(0,0,0) rotate(0deg)";
      layer.appendChild(p);
      pieces.push(p);
      specs.push({ tx: tx, rise: rise, fall: fall, rot: rot, dur: dur, delay: delay });
    }

    function launch() {
      void layer.offsetWidth;
      for (var j = 0; j < pieces.length; j++) {
        var s = specs[j], el = pieces[j];
        var peak = "translate3d(" + (s.tx * 0.55).toFixed(1) + "px," + (-s.rise).toFixed(1) + "px,0) rotate(" + Math.round(s.rot * 0.5) + "deg)";
        var end = "translate3d(" + s.tx.toFixed(1) + "px," + s.fall.toFixed(1) + "px,0) rotate(" + s.rot + "deg)";
        if (el.animate) {
          el.animate([
            { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
            { transform: peak, opacity: 1, offset: 0.45 },
            { transform: end, opacity: 0 }
          ], { duration: s.dur, delay: s.delay, easing: "cubic-bezier(.12,.62,.32,1)", fill: "forwards" });
        } else {
          el.style.transitionProperty = "transform,opacity";
          el.style.transitionTimingFunction = "cubic-bezier(.12,.62,.32,1)";
          el.style.transitionDuration = s.dur + "ms";
          el.style.transitionDelay = s.delay + "ms";
          el.style.transform = end;
          el.style.opacity = "0";
        }
      }
    }
    if (window.requestAnimationFrame) window.requestAnimationFrame(launch);
    else launch();
    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 1800);
  }

  /* ---------- word-drop exercise construction ---------- */

  function buildWordDrop(lesson) {
    var parsed = [], selected = [], seen = {}, budget = MAX_GAPS;
    var i, j, k, termIndex, part, norm, picked;
    for (i = 0; i < lesson.concepts.length; i++) {
      var sp = splitConcept(lesson.concepts[i].text || "");
      parsed.push({ id: lesson.concepts[i].id, lead: lesson.concepts[i].lead, parts: sp.tokens });
      selected.push({});
    }
    for (i = 0; i < MAX_GAPS_PER_CONCEPT && budget > 0; i++) {
      picked = false;
      for (j = 0; j < parsed.length && budget > 0; j++) {
        termIndex = 0;
        for (k = 0; k < parsed[j].parts.length; k++) {
          part = parsed[j].parts[k];
          if (part.kind !== "term") continue;
          norm = normalise(part.value);
          if (!has(selected[j], termIndex) && !has(seen, norm)) {
            selected[j][termIndex] = true;
            seen[norm] = true;
            budget -= 1;
            picked = true;
            break;
          }
          termIndex += 1;
        }
      }
      if (!picked) break;
    }

    var gaps = [], concepts = [], termIdx, segments, gapId;
    for (j = 0; j < parsed.length; j++) {
      termIdx = 0;
      segments = [];
      for (k = 0; k < parsed[j].parts.length; k++) {
        part = parsed[j].parts[k];
        if (part.kind === "text") { segments.push({ kind: "text", value: part.value }); continue; }
        if (has(selected[j], termIdx)) {
          gapId = parsed[j].id + "-gap-" + termIdx;
          gaps.push({ id: gapId, answer: part.value });
          segments.push({ kind: "blank", value: part.value, gapId: gapId });
        } else {
          segments.push({ kind: "term", value: part.value });
        }
        termIdx += 1;
      }
      concepts.push({ id: parsed[j].id, lead: parsed[j].lead, segments: segments });
    }

    var answers = [], decoyTarget, available, decoys, bank;
    for (i = 0; i < gaps.length; i++) answers.push(gaps[i].answer);
    decoyTarget = Math.max(MIN_DECOY_COUNT, Math.ceil(gaps.length * 0.5));
    available = DECOY_POOL.filter(function (w) {
      return !answers.some(function (a) { return normalise(a) === normalise(w); });
    });
    decoys = seededShuffle(available, hashString(lesson.id + "-decoys")).slice(0, decoyTarget);
    bank = seededShuffle(answers.concat(decoys), hashString(lesson.id));
    return { concepts: concepts, gaps: gaps, words: bank, decoyCount: decoys.length };
  }

  function usedWords() {
    var out = [], key, w;
    for (key in state.word.assignments) {
      if (!has(state.word.assignments, key)) continue;
      w = normalise(state.word.assignments[key]);
      if (out.indexOf(w) < 0) out.push(w);
    }
    return out;
  }
  function assignWord(gapId, word) {
    if (state.word.checked) return;
    var next = {}, key, val;
    for (key in state.word.assignments) {
      if (!has(state.word.assignments, key)) continue;
      val = state.word.assignments[key];
      if (normalise(val) !== normalise(word)) next[key] = val;
    }
    next[gapId] = word;
    state.word.assignments = next;
    state.word.selectedWord = null;
  }
  function clearGap(gapId) {
    if (state.word.checked) return;
    delete state.word.assignments[gapId];
  }

  /* ---------- markup ---------- */

  function icon(name, cls, size, label) {
    var attrs = 'xmlns="http://www.w3.org/2000/svg"';
    if (size) attrs += ' width="' + size + '" height="' + size + '"';
    if (cls) attrs += ' class="' + cls + '"';
    attrs += ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (label) attrs += ' role="img" aria-label="' + esc(label) + '"';
    else attrs += ' aria-hidden="true"';
    return '<svg ' + attrs + '>' + (ICONS[name] || "") + '</svg>';
  }

  function currentSectionCode() {
    var l = state.byId[state.activeId];
    return l ? l.sectionCode : (state.sections[0] ? state.sections[0].code : "1");
  }
  function findSection(code) {
    for (var i = 0; i < state.sections.length; i++) if (state.sections[i].code === code) return state.sections[i];
    return null;
  }
  function activeSection() {
    return findSection(currentSectionCode()) || state.sections[0] ||
      { code: "1", title: "", shortTitle: "", lessons: [] };
  }
  function sectionPosition(lesson, section) {
    var i;
    if (section && section.lessons) {
      for (i = 0; i < section.lessons.length; i++) {
        if (section.lessons[i].id === lesson.id) return i + 1;
      }
    }
    return 1;
  }
  function firstLessonInSection(code) {
    var s = findSection(code);
    if (!s || !s.lessons.length) return state.lessons[0];
    for (var i = 0; i < s.lessons.length; i++) if (!isComplete(s.lessons[i].id)) return s.lessons[i];
    return s.lessons[0];
  }

  function renderHero(totalMinutes) {
    var done = completedCount(), total = state.lessons.length;
    var pct = total ? Math.round(done / total * 100) : 0;
    var next = nextIncomplete();
    var allComplete = done === total;
    var label = allComplete ? "Open Practice Studio" : "Resume Lesson " + next.id;
    var out = [];
    out.push('<header class="study-hero"><div class="study-hero-content">');
    out.push('<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>');
    out.push('<h1 class="study-title">Interactive <span>Lessons Studio</span></h1>');
    out.push('<p class="study-description">Build business judgement across ' + total +
      ' guided lessons with hidden-term hints, gap-fill drills and scenario practice.</p>');
    out.push('<div class="study-hero-actions">');
    out.push('<button type="button" data-action="' + (allComplete ? "open-practice" : "resume") + '"' +
      (allComplete ? ' data-section="' + esc(currentSectionCode()) + '"' : ' data-id="' + esc(next.id) + '"') +
      ' class="study-action btn-primary whitespace-nowrap shrink-0"><span>' + esc(label) +
      '</span>' + icon("arrowRight", "", 16) + '</button>');
    out.push('<button type="button" data-action="checklist" class="study-action study-secondary-action whitespace-nowrap shrink-0">' +
      icon("listChecks", "", 16) + '<span>0264 Syllabus Checklist</span></button>');
    out.push('</div>');
    out.push('<p class="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">' +
      done + ' of ' + total + ' completed · ' + pct + '% mastered · ' +
      state.sections.length + ' sections · ~' + Math.round(totalMinutes / 60) + ' hrs</p>');
    out.push('</div><div class="study-hero-image" aria-hidden="true"></div></header>');
    return out.join("");
  }

  function renderBar() {
    var out = [], done = completedCount(), total = state.lessons.length;
    var pct = total ? Math.round(done / total * 100) : 0;
    var c = confidenceCounts();
    out.push('<div class="study-mode-bar">');
    out.push('<div role="group" aria-label="Syllabus section navigation" class="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1">');
    for (var i = 0; i < state.sections.length; i++) {
      var s = state.sections[i], sc = sectionCompletion(s.code);
      var isActive = s.code === currentSectionCode();
      out.push('<button type="button" data-action="section" data-section="' + esc(s.code) + '"' +
        ' aria-pressed="' + (isActive ? "true" : "false") + '"' +
        ' title="' + esc(s.title + " — " + sc.completed + " of " + sc.total + " lessons complete") + '"' +
        ' class="study-mode-button whitespace-nowrap shrink-0 max-sm:!flex-row max-sm:!min-h-[2.875rem] max-sm:!px-2.5 max-sm:!py-1.5 max-sm:!gap-1.5">' +
        '<span class="font-mono text-[11px] opacity-70 tabular-nums">0' + esc(s.code) + '</span>' +
        '<span>' + esc(s.shortTitle) + '</span>' +
        '<small class="font-mono text-[10px] opacity-65 tabular-nums">' + sc.completed + '/' + sc.total + '</small></button>');
    }
    out.push('</div>');
    out.push('<div class="flex items-center gap-2.5 py-2 shrink-0">');
    out.push('<div class="flex items-center gap-2 rounded-lg bg-[var(--surface-practice)] px-2.5 py-1.5 text-[11px] font-mono font-semibold tabular-nums text-[var(--surface-text)]">');
    out.push('<div role="progressbar" aria-label="Overall lesson completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      pct + '" class="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--surface-line)]">' +
      '<div class="h-full rounded-full bg-[var(--green)] dark:bg-[#e4eeb2] transition-[width] duration-500" style="width:' + pct + '%"></div></div>');
    out.push('<span>' + pct + '%</span>');
    if (done > 0) {
      out.push('<span class="hidden xl:inline text-[var(--surface-muted)]">· ' +
        c.easy + 'E/' + c.medium + 'M/' + c.hard + 'H</span>');
    }
    out.push('</div>');
    if (done > 0) {
      if (!state.confirmingReset) {
        out.push('<button type="button" data-action="reset-toggle" title="Reset all lesson progress and hint reveals" ' +
          'class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[var(--surface-muted)] transition-colors hover:bg-[var(--surface-practice)] hover:text-[#8b3e2f] dark:hover:text-[#efc6b8] cursor-pointer whitespace-nowrap">' +
          icon("rotateCcw", "h-3 w-3") + '<span>Reset</span></button>');
      } else {
        out.push('<div class="flex items-center gap-1 text-[11px]">' +
          '<button type="button" data-action="reset-confirm" class="rounded-md bg-[#97532b] px-2 py-1 font-semibold text-white hover:bg-[#7b4220] cursor-pointer whitespace-nowrap">Confirm reset</button>' +
          '<button type="button" data-action="reset-cancel" class="rounded-md px-2 py-1 font-semibold text-[var(--surface-muted)] hover:bg-[var(--surface-practice)] cursor-pointer whitespace-nowrap">Cancel</button></div>');
      }
    }
    out.push('</div></div>');
    return out.join("");
  }

  function renderRail() {
    var out = [], i, j;
    var section = activeSection(), sc = sectionCompletion(section.code);
    var lessons = section.lessons || [];
    var pos = 1;
    for (i = 0; i < lessons.length; i++) if (lessons[i].id === state.activeId) { pos = i + 1; break; }
    out.push('<aside class="study-section-rail" aria-label="Section lessons navigation"><div>');
    out.push('<div class="flex items-baseline justify-between gap-2 px-1">' +
      '<h2 class="study-panel-kicker !m-0">Section ' + esc(section.code) + '</h2>' +
      '<span class="font-mono text-[10px] font-semibold tabular-nums text-[var(--surface-muted)]">' +
      sc.completed + '/' + sc.total + ' done</span></div>');
    out.push('<p class="mt-1 px-1 text-xs font-semibold leading-snug text-[var(--surface-text)]">' + esc(section.title) + '</p>');
    out.push('<div class="mx-1 mt-2 mb-3 h-1 overflow-hidden rounded-full bg-[var(--surface-line)]">' +
      '<div class="h-full rounded-full bg-[var(--green)] dark:bg-[#e4eeb2] transition-[width] duration-500" style="width:' + sc.percentage + '%"></div></div>');
    out.push('<div class="lg:hidden mb-3">' +
      '<label for="lesson-picker" class="block px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--surface-muted)]">Select lesson (' + pos + ' of ' + lessons.length + ')</label>' +
      '<select id="lesson-picker" data-action="lesson-picker" class="mt-1 w-full cursor-pointer rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--surface-text)]">');
    for (i = 0; i < lessons.length; i++) {
      var opt = lessons[i], optEntry = state.progress[opt.id];
      out.push('<option value="' + esc(opt.id) + '"' + (opt.id === state.activeId ? ' selected' : '') + '>' +
        esc(opt.id) + ' — ' + esc(opt.title) + (optEntry && optEntry.rating ? ' ✓' : '') + '</option>');
    }
    out.push('</select></div>');
    out.push('<div role="group" aria-label="Lessons in current section" class="study-sections hidden lg:grid">');
    for (j = 0; j < lessons.length; j++) {
      var l = lessons[j], isActive = l.id === state.activeId, entry = state.progress[l.id];
      out.push('<button type="button" data-action="lesson" data-id="' + esc(l.id) + '"' +
        ' aria-pressed="' + (isActive ? "true" : "false") + '"' +
        (isActive ? ' aria-current="page"' : '') +
        ' class="study-section-button"><span>' + esc(l.id) + '</span>' +
        '<div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-1">' +
        '<strong class="line-clamp-2 font-semibold text-[12px] leading-snug text-left">' + esc(l.title) + '</strong>' +
        (entry && entry.rating ? icon("checkCircle2", "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5d7d48] dark:text-[#c9dfb2]", 0, "Completed") : '') +
        '</div><small class="mt-0.5 block font-mono text-[10px] text-[var(--surface-muted)]">' +
        esc(l.minutes) + ' min' + (entry && entry.rating ? ' · ' + esc(RATING_LABELS[entry.rating] || entry.rating) : '') +
        '</small></div></button>');
    }
    out.push('</div></div>');
    out.push('<div class="study-mode-shortcuts">' +
      '<button type="button" data-action="open-practice" data-section="' + esc(section.code) + '" class="study-shortcut">' +
      icon("target", "", 16) + '<span>Practice Section ' + esc(section.code) + '</span></button>' +
      '<button type="button" data-action="checklist" class="study-shortcut">' +
      icon("listChecks", "", 16) + '<span>0264 Syllabus Checklist</span></button></div>');
    out.push('</aside>');
    return out.join("");
  }

  function renderConceptTokens(concept, split, out) {
    var revealed = getRevealed(concept.id, split.count), i, t;
    for (i = 0; i < split.tokens.length; i++) {
      t = split.tokens[i];
      if (t.kind === "text") { out.push(esc(t.value)); continue; }
      var attrs = ' type="button" data-action="term" data-concept="' + esc(concept.id) +
        '" data-index="' + t.index + '" data-total="' + split.count + '"';
      if (revealed.indexOf(t.index) >= 0) {
        out.push('<button' + attrs + ' class="mx-0.5 inline cursor-pointer rounded align-baseline bg-transparent p-0 text-left"' +
          ' title="Click to hide this term again" aria-label="Hide term: ' + esc(t.value) + '">' +
          '<mark class="lesson-revealed-term rounded bg-[#e4eeb2] px-1.5 py-0.5 font-semibold text-[#213b30] transition-colors hover:bg-[#d8e69a] [box-decoration-break:clone]">' +
          esc(t.value) + '</mark></button>');
      } else {
        out.push('<button' + attrs + ' class="mx-0.5 inline-flex cursor-pointer select-none items-center justify-center rounded border-b-2 border-dashed border-[#96a48f] bg-[#f0f2e9] px-1.5 align-baseline font-mono text-[11px] leading-5 tracking-[0.16em] text-[#879487] transition-colors hover:border-[#203e32] hover:bg-[#e8ece0] hover:text-[#203e32] dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c] dark:hover:border-[#b9d3a3] dark:hover:text-[#dce9c8]"' +
          ' title="Hidden term — click or use Hint to reveal"><span aria-hidden="true">' + hiddenTermDots(t.value) +
          '</span><span class="sr-only">Reveal hidden term</span></button>');
      }
    }
  }

  function renderConcepts(lesson, splits) {
    var out = [], i, totalTerms = 0, revealedTerms = 0, c, split, revealed, remaining, step;
    for (i = 0; i < lesson.concepts.length; i++) {
      totalTerms += splits[i].count;
      revealedTerms += getRevealed(lesson.concepts[i].id, splits[i].count).length;
    }
    out.push('<section class="study-case-panel p-5 sm:p-7" aria-labelledby="concepts-' + esc(lesson.id) + '">');
    out.push('<div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--surface-line,#d4d9cf)]">' +
      '<div class="flex items-center gap-2.5">' +
      '<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] text-[var(--green,#203e32)] dark:text-[#d4e6bd]">' +
      icon("bookOpen", "h-4 w-4") + '</span><div>' +
      '<h3 id="concepts-' + esc(lesson.id) + '" class="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]">Concept explanation</h3>' +
      '<p class="text-[11px] text-[var(--surface-muted,#4b5c54)]">Use Hint or tap any blank to reveal terms; tap a shown term or Hide to quiz yourself.</p>' +
      '</div></div>');
    out.push('<div class="flex flex-wrap items-center gap-2.5">' +
      '<span class="font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted,#4b5c54)]">' +
      revealedTerms + '/' + totalTerms + ' terms revealed</span>');
    if (totalTerms > 0) {
      out.push('<button type="button" data-action="reset-terms"' +
        (revealedTerms === 0 ? ' disabled title="All terms in this lesson are already hidden"' : ' title="Hide all revealed terms in this lesson to quiz yourself again"') +
        ' class="inline-flex min-h-7 items-center gap-1 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] px-2.5 py-1 text-[11px] font-semibold text-[var(--surface-text,#192e28)] transition-colors hover:bg-[var(--surface-practice,#edf2e7)] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer whitespace-nowrap">' +
        icon("rotateCcw", "h-3 w-3") + '<span>Reset all terms</span></button>');
    }
    out.push('</div></div>');
    out.push('<ol class="mt-5 space-y-5">');
    for (i = 0; i < lesson.concepts.length; i++) {
      c = lesson.concepts[i]; split = splits[i];
      revealed = getRevealed(c.id, split.count);
      remaining = split.count - revealed.length;
      step = Math.min(termStep(split.count), remaining);
      out.push('<li class="relative flex gap-3"><span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] font-mono text-[10px] font-bold text-[#35512e] dark:text-[#c9dcb4]">' + (i + 1) + '</span>');
      out.push('<div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">');
      out.push('<h4 class="font-academic-serif text-[15.5px] font-bold leading-snug text-[var(--surface-text,#192e28)]">' + esc(c.lead) + '</h4>');
      if (split.count > 0) {
        out.push('<div class="flex items-center gap-1.5 shrink-0">');
        if (remaining > 0) {
          out.push('<button type="button" data-action="hint" data-concept="' + esc(c.id) + '" data-total="' + split.count + '"' +
            ' title="Reveal ' + step + ' more hidden term' + (step === 1 ? "" : "s") + '"' +
            ' aria-label="Hint: reveal ' + step + ' of ' + remaining + ' hidden terms"' +
            ' class="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--green,#203e32)] bg-[var(--surface,#fffefa)] px-2.5 py-1 text-[11px] font-semibold text-[var(--green,#203e32)] whitespace-nowrap transition-colors hover:bg-[var(--surface-practice,#edf2e7)] dark:border-[#b9d3a3] dark:text-[#d4e6bd]">' +
            icon("eye", "h-3 w-3") + '<span>Hint</span><span class="font-mono text-[10px] opacity-75 tabular-nums">' + revealed.length + '/' + split.count + '</span></button>');
          if (revealed.length > 0) {
            out.push('<button type="button" data-action="hide-concept" data-concept="' + esc(c.id) + '"' +
              ' title="Hide revealed terms in this bullet to quiz yourself again" aria-label="Hide revealed terms in this bullet"' +
              ' class="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)] px-2 py-1 text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] whitespace-nowrap transition-colors hover:bg-[var(--surface-practice,#edf2e7)] hover:text-[var(--surface-text,#192e28)]">' +
              icon("eyeOff", "h-3 w-3") + '<span>Hide</span></button>');
          }
        } else {
          out.push('<button type="button" data-action="hide-concept" data-concept="' + esc(c.id) + '"' +
            ' title="Hide all terms in this bullet to quiz yourself again" aria-label="Hide all revealed terms in this bullet"' +
            ' class="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] px-2.5 py-1 text-[11px] font-semibold text-[#38532f] whitespace-nowrap transition-colors hover:border-[#203e32] hover:bg-[#e4eeb2]/55 dark:text-[#d4e6bd]">' +
            icon("eyeOff", "h-3 w-3") + '<span>Hide</span><span class="font-mono text-[10px] opacity-75 tabular-nums">' + revealed.length + '/' + split.count + '</span></button>');
        }
        out.push('</div>');
      }
      out.push('</div>');
      out.push('<p class="mt-1.5 text-[14.5px] leading-7 text-[#33463d] dark:text-neutral-200">');
      renderConceptTokens(c, split, out);
      out.push('</p>');
      if (c.note) {
        out.push('<p class="mt-2 flex gap-2 text-xs leading-relaxed text-[var(--surface-muted,#4b5c54)]">' +
          icon("lightbulb", "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a3701f] dark:text-[#e1b969]") +
          '<span>' + esc(c.note) + '</span></p>');
      }
      out.push('</div></li>');
    }
    out.push('</ol>');
    out.push('<div class="mt-6 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] p-4">' +
      '<div class="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#4f6944] dark:text-[#bdd5a5]">' +
      icon("graduationCap", "h-3.5 w-3.5") + 'Exam tip</div>' +
      '<p class="mt-1.5 text-xs leading-relaxed text-[var(--surface-text,#192e28)]">' + esc(lesson.examTip || "") + '</p></div>');
    out.push('</section>');
    return out.join("");
  }

  function renderPractice(lesson) {
    var out = [], p = lesson.practice || {}, i;
    var correct = state.selectedOption === p.correctIndex;
    var qid = "practice-question-" + lesson.id;
    out.push('<section class="study-paper-one-editor bg-[var(--surface-practice,#edf2e7)]/70 p-5 dark:bg-[#15221b] sm:p-7" aria-labelledby="practice-heading-' + esc(lesson.id) + '">');
    out.push('<div class="lg:sticky lg:top-24">');
    out.push('<div class="flex items-center justify-between gap-2 pb-4 border-b border-[var(--surface-line,#d4d9cf)]">' +
      '<div class="flex items-center gap-2.5">' +
      '<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[#31502f] dark:text-[#d4e6bd]">' +
      icon("target", "h-4 w-4") + '</span><div>' +
      '<h3 id="practice-heading-' + esc(lesson.id) + '" class="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]">Practice it now</h3>' +
      '<p class="text-[11px] text-[var(--surface-muted,#4b5c54)]">Apply the concept to a business scenario.</p>' +
      '</div></div>' +
      '<span class="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--surface-accent,#203e32)]">' + esc(p.commandWord || "") + '</span></div>');
    out.push('<div class="mt-4 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] p-4">' +
      '<p class="text-sm leading-relaxed text-[#33463d] dark:text-neutral-200">' + esc(p.scenario || "") + '</p></div>');
    out.push('<h4 id="' + qid + '" class="mt-4 font-academic-serif text-base font-bold leading-snug text-[var(--surface-text,#192e28)] sm:text-[1.0625rem]">' + esc(p.question || "") + '</h4>');
    var options = p.options || [];
    out.push('<div class="mt-3 space-y-2" role="group" aria-labelledby="' + qid + '">');
    for (i = 0; i < options.length; i++) {
      var selected = state.selectedOption === i, right = i === p.correctIndex;
      var optionState = !selected
        ? "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[#33463d] hover:border-[#203e32] hover:bg-[#f7faf1] dark:text-neutral-200 dark:hover:border-[#b9d3a3] dark:hover:bg-[#1b281f]"
        : right
          ? "border-[#7e9b67] bg-[#f3f8ec] text-[#2d4a26] ring-1 ring-[#a9bb8b] dark:border-[#7e9b67] dark:bg-[#1d2b18] dark:text-[#e0eccb]"
          : "border-[#c58f80] bg-[#fdf1ed] text-[#74392b] ring-1 ring-[#d7a596] dark:border-[#8b5a4b] dark:bg-[#2b1b17] dark:text-[#f0c8ba]";
      var badgeState = selected
        ? (right ? "border-[#7e9b67] bg-[#203e32] text-[#e4eeb2]" : "border-[#c58f80] bg-[#b46a55] text-white")
        : "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)] text-[#5c6e63] dark:text-neutral-300";
      out.push('<button type="button" data-action="option" data-index="' + i + '" aria-pressed="' + (selected ? "true" : "false") +
        '" class="flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left text-sm leading-snug transition-colors ' + optionState + '">' +
        '<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold ' + badgeState + '">' +
        String.fromCharCode(65 + i) + '</span>' +
        '<span class="min-w-0 flex-1 pt-0.5">' + esc(options[i]) + '</span>' +
        (selected ? (right ? icon("checkCircle2", "mt-0.5 h-4 w-4 shrink-0 text-[#5d7d48]") : icon("xCircle", "mt-0.5 h-4 w-4 shrink-0 text-[#b46a55]")) : '') +
        '</button>');
    }
    out.push('</div>');
    if (state.selectedOption === null) {
      out.push('<p class="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--surface-muted,#4b5c54)]">' +
        icon("listChecks", "h-3.5 w-3.5") + 'Choose an answer to check your reasoning.</p>');
    } else {
      out.push('<div class="mt-3 rounded-xl border p-3.5 ' +
        (correct ? "border-[#b9cdab] bg-[#f4f9ee] dark:border-[#4e6740] dark:bg-[#1a2918]" : "border-[#d9bcb3] bg-[#fcf2ee] dark:border-[#7d5145] dark:bg-[#2a1b17]") +
        '" role="status" aria-live="polite">');
      out.push('<div class="flex items-center gap-1.5 text-xs font-bold ' +
        (correct ? "text-[#35522d] dark:text-[#cfe2b8]" : "text-[#7b3b2b] dark:text-[#efc6b8]") + '">' +
        (correct ? icon("checkCircle2", "h-4 w-4") : icon("xCircle", "h-4 w-4")) +
        (correct ? "Correct — well reasoned." : "Not quite — check the explanation.") + '</div>');
      out.push('<p class="mt-1.5 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200">' + esc(p.explanation || "") + '</p>');
      out.push('<details class="group mt-3 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)]/80 px-3 py-2">' +
        '<summary class="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-bold text-[#415a34] dark:text-[#cfe2b8] [&::-webkit-details-marker]:hidden">' +
        '<span>View model answer</span>' + icon("chevronDown", "h-3.5 w-3.5 transition-transform group-open:rotate-180") + '</summary>' +
        '<p class="mt-2 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200">' + esc(p.modelAnswer || "") + '</p></details>');
      out.push('<button type="button" data-action="clear-option" class="mt-2.5 cursor-pointer text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] underline decoration-dotted underline-offset-2 hover:text-[var(--surface-text,#192e28)]">Clear answer and try again</button>');
      out.push('</div>');
    }
    out.push('<div class="mt-4 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)]/75 p-3.5">' +
      '<div class="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#5c7546] dark:text-[#bdd5a5]">' +
      icon("graduationCap", "h-3.5 w-3.5") + 'Command word coach</div>' +
      '<p class="mt-1.5 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200"><strong class="font-bold text-[var(--surface-text,#192e28)]">' +
      esc(p.commandWord || "") + ':</strong> ' + esc(commandGuidance(p.commandWord)) + '</p></div>');
    out.push('</div></section>');
    return out.join("");
  }

  function renderWordDrop(lesson) {
    var wd = buildWordDrop(lesson);
    if (!wd.gaps.length) return "";
    var out = [], i, j;
    var filled = 0, correct = 0, used = usedWords();
    for (i = 0; i < wd.gaps.length; i++) {
      var a = state.word.assignments[wd.gaps[i].id];
      if (a) filled += 1;
      if (state.word.checked && gapIsCorrect(wd.gaps[i], a)) correct += 1;
    }
    out.push('<section class="border-t border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)]/55 p-5 dark:bg-[#121c16] sm:p-7" aria-labelledby="worddrop-' + esc(lesson.id) + '">');
    out.push('<div class="flex flex-wrap items-start justify-between gap-3"><div class="flex items-start gap-2.5">' +
      '<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[var(--green,#203e32)] dark:border-[#3d5137] dark:bg-[#1a2915] dark:text-[#d4e6bd]">' +
      icon("gripVertical", "h-4 w-4") + '</span><div>' +
      '<h3 id="worddrop-' + esc(lesson.id) + '" class="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]">Drag the words into the gaps</h3>' +
      '<p class="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-[var(--surface-muted,#4b5c54)]">' +
      icon("mousePointerClick", "h-3 w-3 shrink-0") +
      'Drag a word, or tap a word then tap a gap. ' + wd.decoyCount + ' extra words are decoys.</p>' +
      '</div></div>' +
      '<span class="font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted,#4b5c54)]">' +
      (state.word.checked ? correct + '/' + wd.gaps.length + ' correct' : filled + '/' + wd.gaps.length + ' filled') + '</span></div>');
    out.push('<ol class="mt-4 space-y-3">');
    for (i = 0; i < wd.concepts.length; i++) {
      out.push('<li class="flex gap-2.5"><span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cbd6c2] bg-white font-mono text-[10px] font-bold text-[#4f6944] dark:border-[#3d5137] dark:bg-[#1a2915] dark:text-[#c9dcb4]">' + (i + 1) + '</span>');
      out.push('<p class="text-sm leading-8 text-[#33463d] dark:text-neutral-300">' +
        '<span class="font-semibold text-[var(--ink,#192e28)] dark:text-white">' + esc(wd.concepts[i].lead) + '. </span>');
      var segs = wd.concepts[i].segments;
      for (j = 0; j < segs.length; j++) {
        var seg = segs[j];
        if (seg.kind === "text") { out.push(esc(seg.value)); continue; }
        if (seg.kind === "term") { out.push('<span class="font-semibold text-[#4a6157] dark:text-neutral-200">' + esc(seg.value) + '</span>'); continue; }
        var value = state.word.assignments[seg.gapId];
        var isCorrect = state.word.checked && gapIsCorrect({ answer: seg.value }, value);
        var isWrong = state.word.checked && value && !isCorrect;
        var gapState = state.word.checked
          ? (isCorrect
              ? "border-[#5f8a4b] bg-[#e6f2dc] text-[#2f5323] dark:border-[#5f8a4b] dark:bg-[#1e3117] dark:text-[#cfe8bd]"
              : isWrong
                ? "border-[#b46a55] bg-[#f9e5de] text-[#7b3b2b] dark:border-[#8a4f3f] dark:bg-[#2d1a15] dark:text-[#efc6b8]"
                : "border-dashed border-[#96a48f] bg-white text-[#879487] dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c]")
          : value
            ? "border-[#8ba577] bg-white text-[var(--ink,#192e28)] shadow-xs dark:border-[#4e6740] dark:bg-[#1c2b20] dark:text-white"
            : "border-dashed border-[#96a48f] bg-white/70 text-[#96a48f] hover:border-[#203e32] hover:bg-white dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c]";
        out.push('<button type="button" data-action="gap" data-gap="' + esc(seg.gapId) + '"' +
          ' aria-label="' + (value
            ? 'Gap filled with ' + esc(value) + '. Tap to remove.'
            : 'Empty gap for ' + seg.value.length + ' characters. Tap to place the selected word.') + '"' +
          (value ? ' title="Gap filled with ' + esc(value) + '. Tap to remove."' : ' title="Empty gap. Tap to place the selected word."') +
          (state.word.checked ? ' disabled' : '') +
          ' class="mx-0.5 inline-flex min-h-7 min-w-[84px] translate-y-0.5 items-center justify-center rounded-md border px-2 align-baseline text-[13px] font-semibold transition-colors ' + gapState + '">' +
          esc(value || "drop here") + '</button>');
      }
      out.push('</p></li>');
    }
    out.push('</ol>');
    out.push('<div class="mt-5 rounded-xl border border-[#d7e2c9] bg-white p-3 dark:border-[#34452e] dark:bg-neutral-900">' +
      '<div class="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5c7546] dark:text-[#bdd5a5]">Word bank' +
      '<span class="normal-case tracking-normal opacity-70">— ' + (wd.words.length - used.length) + ' left</span></div>');
    out.push('<div class="mt-2 flex flex-wrap gap-1.5">');
    for (i = 0; i < wd.words.length; i++) {
      var word = wd.words[i], isUsed = used.indexOf(normalise(word)) >= 0;
      var isSel = state.word.selectedWord === word;
      var wordState = isUsed
        ? "border-dashed border-[#d4d9cf] bg-[#f4f4ef] text-[#b3b8ae] line-through dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-600"
        : isSel
          ? "border-[#203e32] bg-[#e4eeb2] text-[#213b30] ring-2 ring-[#203e32]/30 dark:border-[#b9d3a3] dark:text-[#dce9c8]"
          : "border-[#b9c9a5] bg-[#f6f9ef] text-[#31502f] hover:bg-[#edf2e7] dark:border-[#4e6740] dark:bg-[#1a2915] dark:text-[#d4e6bd] dark:hover:bg-[#213522]";
      out.push('<button type="button" data-action="word" data-word="' + esc(word) + '"' +
        (!isUsed && !state.word.checked ? ' draggable="true"' : ' draggable="false"') +
        (isUsed || state.word.checked ? ' disabled' : '') +
        ' class="cursor-grab rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors active:cursor-grabbing ' + wordState + '">' +
        esc(word) + '</button>');
    }
    out.push('</div></div>');
    out.push('<div class="mt-4 flex flex-wrap items-center gap-2">' +
      '<button type="button" data-action="word-check"' + (filled !== wd.gaps.length || state.word.checked ? ' disabled' : '') +
      ' class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#203e32] px-3 py-1.5 text-xs font-bold text-[#e4eeb2] transition-colors hover:bg-[#1a332a] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b9d3a3] dark:text-[#16281d]">' +
      icon("check", "h-3.5 w-3.5") + 'Check answers</button>' +
      '<button type="button" data-action="word-reset" class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#cbd6c2] bg-white px-3 py-1.5 text-xs font-semibold text-[#31502f] transition-colors hover:bg-[#edf2e7] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800">' +
      icon("rotateCcw", "h-3.5 w-3.5") +
      (state.word.checked ? (correct === wd.gaps.length ? 'Try again' : 'Retry wrong ones') : 'Clear') + '</button>');
    if (state.word.checked && correct !== wd.gaps.length) {
      out.push('<button type="button" data-action="word-clear" class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#cbd6c2] bg-white px-3 py-1.5 text-xs font-semibold text-[#31502f] transition-colors hover:bg-[#edf2e7] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">Start over</button>');
    }
    if (state.word.checked) {
      out.push('<span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ' +
        (correct === wd.gaps.length ? "bg-[#e6f2dc] text-[#2f5323] dark:bg-[#1e3117] dark:text-[#cfe8bd]" : "bg-[#f9e5de] text-[#7b3b2b] dark:bg-[#2d1a15] dark:text-[#efc6b8]") + '">' +
        (correct === wd.gaps.length
          ? icon("checkCircle2", "h-3.5 w-3.5") + 'All gaps correct'
          : icon("xCircle", "h-3.5 w-3.5") + (wd.gaps.length - correct) + ' to fix') + '</span>');
    }
    out.push('</div>');
    if (state.word.checked && correct !== wd.gaps.length) {
      out.push('<p class="mt-2 text-[11px] text-[var(--muted,#4b5c54)] dark:text-neutral-400">Green gaps are correct and stay in place. Press <strong>Retry wrong ones</strong> to practise only the gaps you missed — interchangeable answers such as growth/boom are accepted.</p>');
    }
    out.push('</section>');
    return out.join("");
  }

  function renderConfidence(lesson) {
    var out = [], i, entry = state.progress[lesson.id];
    out.push('<footer class="border-t border-[var(--surface-line,#d4d9cf)] p-5 sm:p-7">' +
      '<div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div>' +
      '<div class="flex items-center gap-2">' +
      '<span class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] text-[#31502f] dark:text-[#d4e6bd]">' +
      icon("checkCircle2", "h-4 w-4") + '</span>' +
      '<h3 class="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]">How confident are you?</h3></div>' +
      '<p class="mt-1 text-xs leading-relaxed text-[var(--surface-muted,#4b5c54)]">Rate this lesson to mark it complete. You can change your rating at any time.</p>');
    if (entry && entry.rating) {
      out.push('<p class="mt-1 font-mono text-[11px] font-semibold text-[#557247] dark:text-[#bdd5a5]">Completed ' +
        esc(formatDate(entry.completedAt)) + ' · rated ' + esc(RATING_LABELS[entry.rating] || entry.rating) + '</p>');
    }
    out.push('</div><div class="grid w-full grid-cols-3 gap-2 xl:max-w-[430px]" role="group" aria-label="Lesson confidence rating">');
    for (i = 0; i < RATING_OPTIONS.length; i++) {
      var o = RATING_OPTIONS[i], active = entry && entry.rating === o.value;
      var rateState = active
        ? o.activeClass
        : "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[var(--surface-muted,#4b5c54)] hover:border-[#aab7a3] hover:bg-[var(--surface-practice,#edf2e7)]/50";
      out.push('<button type="button" data-action="rate" data-rating="' + o.value + '" aria-pressed="' + (active ? "true" : "false") +
        '" class="group flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition-colors ' + rateState + '">' +
        '<span class="flex items-center gap-1.5 text-sm font-bold">' +
        '<span class="h-1.5 w-1.5 rounded-full ' + (active ? o.dotClass : "bg-[#b9c2b5] dark:bg-neutral-600") + '"></span>' +
        esc(o.label) + (active ? icon("check", "h-3 w-3") : '') + '</span>' +
        '<span class="text-[10px] leading-tight opacity-80">' + esc(o.description) + '</span></button>');
    }
    out.push('</div></div></footer>');
    return out.join("");
  }

  function renderNavFoot(lesson, section) {
    var idx = state.lessonOrder.indexOf(lesson.id);
    var prev = idx > 0 ? state.byId[state.lessonOrder[idx - 1]] : null;
    var next = idx >= 0 && idx < state.lessonOrder.length - 1 ? state.byId[state.lessonOrder[idx + 1]] : null;
    var out = [];
    out.push('<div class="flex flex-col gap-3 border-t border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)]/50 px-5 py-4 dark:bg-[#111a16] sm:flex-row sm:items-center sm:justify-between sm:px-7">');
    out.push('<div class="flex items-center gap-2">' +
      '<button type="button" class="study-action study-secondary-action disabled:cursor-not-allowed disabled:opacity-40"' +
      (prev ? ' data-action="lesson" data-id="' + esc(prev.id) + '" title="Previous: ' + esc(prev.id + " " + prev.title) + '"' : ' disabled') + '>' +
      icon("arrowLeft", "h-3.5 w-3.5") + '<span>Previous</span></button>' +
      '<button type="button" class="study-action study-secondary-action disabled:cursor-not-allowed disabled:opacity-40"' +
      (next ? ' data-action="lesson" data-id="' + esc(next.id) + '" title="Next: ' + esc(next.id + " " + next.title) + '"' : ' disabled') + '>' +
      '<span>Next</span>' + icon("arrowRight", "h-3.5 w-3.5") + '</button></div>');
    out.push('<div class="flex flex-wrap items-center gap-2">' +
      '<button type="button" data-action="open-practice" data-section="' + esc(section.code) + '" class="study-action btn-primary">' +
      icon("target", "h-3.5 w-3.5") + '<span>Practice Section ' + esc(section.code) + '</span></button>' +
      '<button type="button" data-action="checklist" class="study-action study-secondary-action">' +
      icon("listChecks", "h-3.5 w-3.5") + '<span>0264 Syllabus Checklist</span></button></div>');
    out.push('</div>');
    return out.join("");
  }

  function renderLesson(lesson) {
    var section = findSection(lesson.sectionCode) || state.sections[0] ||
      { code: lesson.sectionCode, lessons: [] };
    var pos = sectionPosition(lesson, section);
    var total = section.lessons ? section.lessons.length : 1;
    var splits = [], i, idx = state.lessonOrder.indexOf(lesson.id);
    var prev = idx > 0 ? state.byId[state.lessonOrder[idx - 1]] : null;
    var next = idx >= 0 && idx < state.lessonOrder.length - 1 ? state.byId[state.lessonOrder[idx + 1]] : null;
    var entry = state.progress[lesson.id];
    for (i = 0; i < lesson.concepts.length; i++) splits.push(splitConcept(lesson.concepts[i].text || ""));

    var out = [];
    out.push('<article id="lesson-reader" class="scroll-mt-24 flex flex-col" aria-labelledby="lesson-title-' + esc(lesson.id) + '">');
    out.push('<header class="border-b border-[var(--surface-line,#d4d9cf)] px-5 py-5 sm:px-7 sm:py-6">');
    out.push('<div class="flex flex-wrap items-center justify-between gap-2">');
    out.push('<div class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] tabular-nums">' +
      '<span class="text-[var(--surface-accent,#203e32)] font-bold">Section ' + esc(lesson.sectionCode) + ' · Lesson ' + esc(lesson.id) + '</span>' +
      '<span aria-hidden="true">·</span><span>0264 ' + esc((lesson.syllabusCodes || []).join(", ")) + '</span>' +
      '<span aria-hidden="true">·</span><span>' + esc(lesson.chapter || "") + '</span>' +
      '<span aria-hidden="true">·</span><span>' + esc(lesson.minutes) + ' min</span>' +
      '<span aria-hidden="true">·</span><span>' + pos + '/' + total + ' in section</span>');
    if (entry && entry.rating) {
      out.push('<span aria-hidden="true">·</span><span class="inline-flex items-center gap-1 font-bold text-[#38532f] dark:text-[#d4e6bd]">' +
        icon("checkCircle2", "h-3.5 w-3.5") + 'Completed (' + esc(RATING_LABELS[entry.rating] || entry.rating) + ')</span>');
    }
    out.push('</div>');
    out.push('<div class="flex items-center gap-1.5 shrink-0">' +
      '<button type="button" ' + (prev ? 'data-action="lesson" data-id="' + esc(prev.id) + '"' : 'disabled') +
      ' title="' + (prev ? "Previous: " + esc(prev.id + " " + prev.title) : "First lesson") + '" aria-label="Previous lesson"' +
      ' class="study-pager-button disabled:opacity-35 disabled:cursor-not-allowed">' + icon("arrowLeft", "h-4 w-4") + '</button>' +
      '<button type="button" ' + (next ? 'data-action="lesson" data-id="' + esc(next.id) + '"' : 'disabled') +
      ' title="' + (next ? "Next: " + esc(next.id + " " + next.title) : "Last lesson") + '" aria-label="Next lesson"' +
      ' class="study-pager-button disabled:opacity-35 disabled:cursor-not-allowed">' + icon("arrowRight", "h-4 w-4") + '</button></div>');
    out.push('</div>');
    out.push('<h2 id="lesson-title-' + esc(lesson.id) + '" class="mt-2 font-academic-serif text-2xl font-bold leading-tight tracking-tight text-[var(--surface-text,#192e28)] sm:text-[1.85rem]" style="text-wrap:balance">' + esc(lesson.title) + '</h2>');
    out.push('<p class="mt-2.5 max-w-3xl text-sm leading-relaxed text-[var(--surface-muted,#4b5c54)]">' +
      '<strong class="font-semibold text-[var(--surface-text,#192e28)]">Learning objective:</strong> ' + esc(lesson.objective || "") + '</p>');
    out.push('</header>');
    out.push('<div class="study-columns study-paper-one-columns">');
    out.push(renderConcepts(lesson, splits));
    out.push(renderPractice(lesson));
    out.push('</div>');
    out.push(renderWordDrop(lesson));
    out.push(renderConfidence(lesson));
    out.push(renderNavFoot(lesson, section));
    out.push('</article>');
    return out.join("");
  }

  function html() {
    var totalMinutes = 0, i;
    for (i = 0; i < state.lessons.length; i++) totalMinutes += Number(state.lessons[i].minutes) || 0;
    var lesson = state.byId[state.activeId] || state.lessons[0];
    var out = [];
    out.push('<section class="study-page">');
    out.push(renderHero(totalMinutes));
    out.push('<div class="study-studio">');
    out.push(renderBar());
    out.push('<div class="study-workspace">');
    out.push(renderRail());
    out.push('<div class="min-w-0">' + (lesson ? renderLesson(lesson) : "") + '</div>');
    out.push('</div></div>');
    out.push('<p class="mx-auto mt-5 max-w-3xl text-center text-[11px] leading-relaxed text-[var(--muted,#4b5c54)] dark:text-neutral-500">Lesson content follows the Cambridge IGCSE Business 0264 syllabus for examination in 2027–2029 and the Sixth Edition textbook. Progress, confidence ratings and hint reveals are stored locally in this browser.</p>');
    out.push('</section>');
    return out.join("");
  }

  function draw() {
    if (!state.main) return;
    var y = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || 0;
    state.main.innerHTML = html();
    if (state.scrollToReader) {
      state.scrollToReader = false;
      var reader = document.getElementById("lesson-reader");
      if (reader && reader.scrollIntoView) reader.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (y) {
      window.scrollTo(0, y);
    }
  }

  /* ---------- events ---------- */

  function findAction(target) {
    var n = target;
    while (n && n !== state.main) {
      if (n.getAttribute && n.getAttribute("data-action")) return n;
      n = n.parentNode;
    }
    return null;
  }
  function setOver(node, on) {
    if (!node || !node.style) return;
    node.style.borderColor = on ? "#203e32" : "";
    node.style.borderStyle = on ? "solid" : "";
    node.style.backgroundColor = on ? "#e4eeb2" : "";
    node.style.color = on ? "#213b30" : "";
  }
  function clearOver() {
    if (!state.main) return;
    var nodes = state.main.querySelectorAll('[data-action="gap"]'), i;
    for (i = 0; i < nodes.length; i++) setOver(nodes[i], false);
  }
  function selectLesson(id) {
    if (!state.byId[id] || id === state.activeId) return;
    state.scrollToReader = true;
    EC.navigate("lessons", { lesson: id });
  }

  function onClick(ev) {
    var node = findAction(ev.target);
    if (!node) return;
    var action = node.getAttribute("data-action");
    var id, concept, code, rating, i, word, gapId;
    switch (action) {
      case "resume":
        selectLesson(node.getAttribute("data-id"));
        break;
      case "lesson":
        selectLesson(node.getAttribute("data-id"));
        break;
      case "section":
        code = node.getAttribute("data-section");
        selectLesson(firstLessonInSection(code).id);
        break;
      case "open-practice":
        /* Original "Practice Section N" opened the Paper 1 Practice Studio. */
        EC.navigate("practice", { unit: node.getAttribute("data-section") || currentSectionCode() });
        break;
      case "checklist":
        EC.navigate("checklist");
        break;
      case "reset-toggle":
        state.confirmingReset = true; draw(); break;
      case "reset-cancel":
        state.confirmingReset = false; draw(); break;
      case "reset-confirm":
        state.progress = {}; state.hints = {};
        EC.store.set(PROGRESS_KEY, state.progress);
        EC.store.set(HINTS_KEY, state.hints);
        EC.store.del(ACTIVE_KEY);
        state.confirmingReset = false;
        resetLocal();
        state.activeId = state.lessons[0].id;
        EC.store.set(ACTIVE_KEY, state.activeId);
        state.scrollToReader = true;
        EC.navigate("lessons", { lesson: state.activeId });
        break;
      case "hint":
        concept = node.getAttribute("data-concept");
        hintConcept(concept, parseInt(node.getAttribute("data-total"), 10) || 0);
        draw(); break;
      case "hide-concept":
        hideConcept(node.getAttribute("data-concept"));
        draw(); break;
      case "term":
        toggleTerm(node.getAttribute("data-concept"), parseInt(node.getAttribute("data-index"), 10),
          parseInt(node.getAttribute("data-total"), 10) || 0);
        draw(); break;
      case "reset-terms":
        resetTerms(state.byId[state.activeId]);
        draw(); break;
      case "option":
        state.selectedOption = parseInt(node.getAttribute("data-index"), 10);
        draw(); break;
      case "clear-option":
        state.selectedOption = null; draw(); break;
      case "word":
        word = node.getAttribute("data-word");
        state.word.selectedWord = state.word.selectedWord === word ? null : word;
        draw(); break;
      case "gap":
        gapId = node.getAttribute("data-gap");
        if (state.word.assignments[gapId]) clearGap(gapId);
        else if (state.word.selectedWord) assignWord(gapId, state.word.selectedWord);
        draw(); break;
      case "word-check":
        state.word.checked = true; draw(); break;
      case "word-reset":
        if (state.word.checked) {
          var currentLesson = state.byId[state.activeId];
          var wdRetry = currentLesson ? buildWordDrop(currentLesson) : null;
          if (wdRetry) retryWrongGaps(wdRetry.gaps);
          else resetLocal();
        } else resetLocal();
        draw(); break;
      case "word-clear":
        resetLocal(); draw(); break;
      case "rate":
        rating = node.getAttribute("data-rating");
        id = state.activeId;
        var existing = state.progress[id];
        if (existing && existing.rating === rating) break;
        state.progress[id] = { rating: rating, completedAt: new Date().toISOString() };
        EC.store.set(PROGRESS_KEY, state.progress);
        if (!existing || !existing.rating) {
          EC.addCoins(15);
          fireConfetti();
        }
        draw(); break;
    }
  }

  function onChange(ev) {
    var node = ev.target;
    if (!node || node.getAttribute("data-action") !== "lesson-picker") return;
    selectLesson(node.value);
  }

  function onDragStart(ev) {
    var node = findAction(ev.target);
    if (!node || node.getAttribute("data-action") !== "word") return;
    var word = node.getAttribute("data-word");
    try {
      ev.dataTransfer.setData("text/plain", word);
      ev.dataTransfer.effectAllowed = "move";
    } catch (e) {}
    state.word.selectedWord = word;
  }
  function onDragOver(ev) {
    var node = findAction(ev.target);
    if (!node || node.getAttribute("data-action") !== "gap") return;
    ev.preventDefault();
    clearOver();
    setOver(node, true);
  }
  function onDragLeave(ev) {
    var node = findAction(ev.target);
    if (node && node.getAttribute("data-action") === "gap") setOver(node, false);
  }
  function onDrop(ev) {
    var node = findAction(ev.target);
    if (!node || node.getAttribute("data-action") !== "gap") return;
    ev.preventDefault();
    var word = "";
    try { word = ev.dataTransfer.getData("text/plain"); } catch (e) {}
    clearOver();
    if (word) assignWord(node.getAttribute("data-gap"), word);
    draw();
  }
  function onDragEnd() {
    clearOver();
    if (state.word.selectedWord !== null) {
      state.word.selectedWord = null;
      draw();
    }
  }

  function bind(main) {
    if (state.bound) return;
    main.addEventListener("click", onClick);
    main.addEventListener("change", onChange);
    main.addEventListener("dragstart", onDragStart);
    main.addEventListener("dragover", onDragOver);
    main.addEventListener("dragleave", onDragLeave);
    main.addEventListener("drop", onDrop);
    main.addEventListener("dragend", onDragEnd);
    state.bound = true;
  }

  /* ---------- view entry point ---------- */

  window.EC.register("lessons", {
    title: "Lessons",
    render: function (main, params, name) {
      state.main = main;
      state.token += 1;
      var token = state.token;
      bind(main);
      return EC.load("lessons").then(function (sections) {
        if (token !== state.token) return;
        state.sections = sections || [];
        state.lessons = [];
        state.byId = {};
        state.lessonOrder = [];
        state.progress = EC.store.get(PROGRESS_KEY, {});
        if (!state.progress || typeof state.progress !== "object" || Array.isArray(state.progress)) state.progress = {};
        state.hints = EC.store.get(HINTS_KEY, {});
        if (!state.hints || typeof state.hints !== "object" || Array.isArray(state.hints)) state.hints = {};
        var i, j, l;
        for (i = 0; i < state.sections.length; i++) {
          var s = state.sections[i];
          s.lessons = s.lessons || [];
          for (j = 0; j < s.lessons.length; j++) {
            l = s.lessons[j];
            state.lessons.push(l);
            state.byId[l.id] = l;
            state.lessonOrder.push(l.id);
          }
        }

        var lessonParam = params && params.get ? params.get("lesson") : null;
        var sectionParam = params && params.get ? params.get("section") : null;
        var active = null;
        if (lessonParam && state.byId[lessonParam]) active = state.byId[lessonParam];
        if (!active && sectionParam) active = firstLessonInSection(sectionParam);
        if (!active) {
          var saved = EC.store.get(ACTIVE_KEY, null);
          if (saved && state.byId[saved]) active = state.byId[saved];
        }
        if (!active) active = nextIncomplete();
        state.activeId = active ? active.id : (state.lessons[0] && state.lessons[0].id);
        EC.store.set(ACTIVE_KEY, state.activeId);
        if (state.activeId !== state.lastRenderedId) {
          resetLocal();
          state.lastRenderedId = state.activeId;
        }
        draw();
      });
    }
  });
})();
