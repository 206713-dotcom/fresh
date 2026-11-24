/* EcBiz quiz / drill view — plain browser JavaScript, no framework or build step.
 * Port of src/components/DailyQuickQuiz.tsx and DailyWeeklyChallenge.tsx.
 */
(function () {
  "use strict";

  if (!window.EC) return;
  var EC = window.EC;

  var SECTION_LABELS = {
    "1": "Business Activity",
    "2": "People in Business",
    "3": "Marketing",
    "4": "Operations",
    "5": "Finance",
    "6": "External Influences"
  };
  var MASTERY_DAYS_REQUIRED = 2;
  var TIMER_SECONDS = 60;
  var LETTERS = ["A", "B", "C", "D"];

  /* One timer at a time — cleared whenever a view is (re)rendered. */
  var activeTimer = null;
  /* Shared promise for the six section banks. */
  var bankPromise = null;

  /* ---------------------------------------------------------------- */
  /* Small ES5 helpers                                                 */
  /* ---------------------------------------------------------------- */

  function esc(v) { return EC.esc(v); }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function localDayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function todayUTC() { return new Date().toISOString().slice(0, 10); }

  function isoWeekKey() {
    var now = new Date();
    var d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return d.getUTCFullYear() + "-W" + pad2(weekNo);
  }

  function imul(a, b) {
    if (Math.imul) return Math.imul(a, b);
    var ah = (a >>> 16) & 0xffff, al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff, bl = b & 0xffff;
    return ((al * bl) + ((((ah * bl + al * bh) & 0xffff) << 16))) | 0;
  }

  function hashString(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = imul(h, 0x01000193);
    }
    return Math.abs(h);
  }

  function mulberry32(seed) {
    var a = seed;
    return function () {
      var t = (a += 0x6d2b79f5) | 0;
      t = imul(t ^ (t >>> 15), t | 1);
      t ^= t + imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleWith(arr, rng) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function shuffle(arr) { return shuffleWith(arr.slice(), Math.random); }

  function stopTimer() {
    if (activeTimer !== null) { clearInterval(activeTimer); activeTimer = null; }
  }

  /* ---------------------------------------------------------------- */
  /* Quick Quiz draft persistence (ecbiz_quickquiz_state)              */
  /* EC.store prefixes keys with "ecbiz_", so "quickquiz_state"        */
  /* matches the original app's QUICK_QUIZ_KEY.                         */
  /* ---------------------------------------------------------------- */

  var QUICK_QUIZ_KEY = "quickquiz_state";

  function readDraft() {
    try {
      var d = EC.store.get(QUICK_QUIZ_KEY, null);
      return (d && typeof d === "object" && Object.prototype.toString.call(d) !== "[object Array]") ? d : null;
    } catch (e) { return null; }
  }

  function clearDraft() {
    try { EC.store.del(QUICK_QUIZ_KEY); } catch (e) {}
  }

  function saveDraft(st) {
    if (st.completed || !st.questions.length || !st.history.length) return;
    try {
      EC.store.set(QUICK_QUIZ_KEY, {
        questions: st.questions,
        currentIndex: st.index,
        score: st.score,
        streak: st.streak,
        maxStreak: st.maxStreak,
        answersHistory: st.history,
        quizSize: st.size,
        selectedSection: st.section,
        selectedSubTopic: st.chapter
      });
    } catch (e) {}
  }

  function restoreDraft(st) {
    var d = readDraft();
    if (!d) return false;
    if (d.questions && Object.prototype.toString.call(d.questions) === "[object Array]" && d.questions.length) {
      st.questions = d.questions;
    }
    if (typeof d.currentIndex === "number" && d.currentIndex >= 0) st.index = d.currentIndex;
    if (typeof d.score === "number") st.score = d.score;
    if (typeof d.streak === "number") st.streak = d.streak;
    if (typeof d.maxStreak === "number") st.maxStreak = d.maxStreak;
    if (d.answersHistory && Object.prototype.toString.call(d.answersHistory) === "[object Array]") {
      st.history = d.answersHistory;
    }
    if (typeof d.quizSize === "number") st.size = d.quizSize;
    if (typeof d.selectedSection === "string") st.section = d.selectedSection;
    if (typeof d.selectedSubTopic === "string") st.chapter = d.selectedSubTopic;
    return st.questions.length > 0;
  }

  /* Scroll the studio workspace into view after a mode switch, matching
   * the original switchModeAndFocus() behaviour. */
  function focusWorkspace() {
    if (!window.requestAnimationFrame) return;
    window.requestAnimationFrame(function () {
      var el = document.getElementById("quiz-studio-workspace");
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Zero-dependency confetti (canvas-confetti compatible call shape)   */
  /* ---------------------------------------------------------------- */

  var CONFETTI_COLORS = ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"];
  var confettiStyleReady = false;

  function ensureConfettiStyle() {
    if (confettiStyleReady) return;
    confettiStyleReady = true;
    var style = document.createElement("style");
    style.id = "ecbiz-quiz-confetti-style";
    style.textContent =
      "@keyframes ecbizQuizConfettiFall{" +
        "0%{opacity:1;transform:translate3d(0,0,0) rotate(0deg)}" +
        "100%{opacity:0;transform:translate3d(var(--ecbiz-dx,0px),var(--ecbiz-dy,100vh),0) rotate(var(--ecbiz-rot,540deg))}" +
      "}" +
      ".ecbiz-quiz-confetti-particle{" +
        "position:absolute;display:block;width:8px;height:12px;border-radius:1px;opacity:0;" +
        "will-change:transform;animation:ecbizQuizConfettiFall 1.5s ease-out forwards;" +
      "}";
    (document.head || document.documentElement).appendChild(style);
  }

  function celebrate(options) {
    try {
      options = options || {};
      var count = options.particleCount || 50;
      var spread = options.spread || 60;
      var origin = options.origin || {};
      var originX = typeof origin.x === "number" ? origin.x : 0.5;
      var originY = typeof origin.y === "number" ? origin.y : 0.6;
      var colors = options.colors || CONFETTI_COLORS;
      var w = window.innerWidth || document.documentElement.clientWidth || 800;
      var h = window.innerHeight || document.documentElement.clientHeight || 600;
      var span = w * (spread / 100);
      var startX = originX * w;
      var startY = originY * h;
      ensureConfettiStyle();
      var host = document.createElement("div");
      host.className = "ecbiz-quiz-confetti";
      host.setAttribute("aria-hidden", "true");
      host.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:9999;overflow:hidden;";
      for (var i = 0; i < count; i++) {
        var p = document.createElement("i");
        p.className = "ecbiz-quiz-confetti-particle";
        var dx = (Math.random() - 0.5) * span;
        var dy = Math.max(80, h - startY + 60) * (0.7 + Math.random() * 0.5);
        p.style.left = Math.max(0, Math.min(w, startX + dx)) + "px";
        p.style.top = startY + "px";
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--ecbiz-dx", (dx * 0.4).toFixed(1) + "px");
        p.style.setProperty("--ecbiz-dy", dy.toFixed(1) + "px");
        p.style.setProperty("--ecbiz-rot", Math.round((Math.random() - 0.5) * 1080) + "deg");
        p.style.animationDuration = (1300 + Math.random() * 400) + "ms";
        p.style.animationDelay = Math.round(Math.random() * 120) + "ms";
        host.appendChild(p);
      }
      (document.body || document.documentElement).appendChild(host);
      window.setTimeout(function () {
        if (host.parentNode) host.parentNode.removeChild(host);
      }, 1800);
    } catch (e) {}
  }

  /* Inline Lucide-style SVGs mirroring the original React components. */
  var ICONS = {
    arrowRight: { n: "lucide-arrow-right", b: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
    check: { n: "lucide-circle-check-big", b: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>' },
    xcircle: { n: "lucide-circle-x", b: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>' },
    zap: { n: "lucide-zap", b: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>' },
    target: { n: "lucide-target", b: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
    refresh: { n: "lucide-rotate-ccw", b: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
    layers: { n: "lucide-layers", b: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.18-8.58 3.9a2 2 0 0 1-1.66 0L3.18 12.2"/><path d="m22 17.18-8.58 3.9a2 2 0 0 1-1.66 0L3.18 17.2"/>' },
    clipboard: { n: "lucide-clipboard-list", b: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>' },
    headphones: { n: "lucide-headphones", b: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>' },
    award: { n: "lucide-award", b: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>' },
    clock: { n: "lucide-clock", b: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    coins: { n: "lucide-coins", b: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>' },
    timer: { n: "lucide-timer", b: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>' },
    volume2: { n: "lucide-volume-2", b: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>' },
    volumeX: { n: "lucide-volume-x", b: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>' }
  };

  function icon(name, size, extra, hidden, id) {
    var d = ICONS[name];
    if (!d) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"' + (id ? ' id="' + id + '"' : '') +
      ' class="lucide ' + d.n + (extra ? " " + extra : "") + '"' +
      (hidden === false ? "" : ' aria-hidden="true"') + ">" + d.b + "</svg>";
  }

  /* ---------------------------------------------------------------- */
  /* Data loading                                                      */
  /* ---------------------------------------------------------------- */

  function loadBank() {
    if (!bankPromise) {
      var names = ["mcq-section1", "mcq-section2", "mcq-section3",
                   "mcq-section4", "mcq-section5", "mcq-section6"];
      var loads = [];
      for (var i = 0; i < names.length; i++) loads.push(EC.load(names[i]));
      bankPromise = Promise.all(loads).then(function (parts) {
        var out = [];
        for (var j = 0; j < parts.length; j++) {
          var part = parts[j] || [];
          for (var k = 0; k < part.length; k++) out.push(part[k]);
        }
        return out;
      });
    }
    return bankPromise;
  }

  /* ---------------------------------------------------------------- */
  /* Wrong Only bank (localStorage via EC.store)                       */
  /* EC.store prefixes keys with "ecbiz_", so "mcq_wrong" matches the   */
  /* React implementation's ecbiz_mcq_wrong key.                        */
  /* ---------------------------------------------------------------- */

  function readWrong() {
    var raw = EC.store.get("mcq_wrong", {});
    var map = {};
    if (raw && typeof raw === "object") {
      if (Object.prototype.toString.call(raw) === "[object Array]") {
        for (var i = 0; i < raw.length; i++) {
          if (typeof raw[i] === "string") {
            map[raw[i]] = { id: raw[i], correctDates: [], missedAt: Date.now() };
          }
        }
        EC.store.set("mcq_wrong", map);
        return map;
      }
      for (var id in raw) {
        if (!Object.prototype.hasOwnProperty.call(raw, id)) continue;
        var v = raw[id] || {};
        map[id] = {
          id: id,
          correctDates: v.correctDates && Object.prototype.toString.call(v.correctDates) === "[object Array]"
            ? v.correctDates : [],
          missedAt: typeof v.missedAt === "number" ? v.missedAt : Date.now()
        };
      }
    }
    return map;
  }

  function writeWrong(map) { EC.store.set("mcq_wrong", map); }

  function wrongIds() {
    var map = readWrong(), ids = [];
    for (var id in map) if (Object.prototype.hasOwnProperty.call(map, id)) ids.push(id);
    return ids;
  }

  function recordIncorrect(id) {
    if (!id) return;
    var map = readWrong();
    map[id] = { id: id, correctDates: [], missedAt: Date.now() };
    writeWrong(map);
  }

  /* A correct answer counts once per local calendar day; two different
   * days are required before the question leaves the bank. A miss resets. */
  function recordCorrect(id) {
    var result = { mastered: false, days: 0 };
    if (!id) return result;
    var map = readWrong(), entry = map[id];
    if (!entry) return result;
    var dates = entry.correctDates.slice(), today = localDayKey();
    if (dates.indexOf(today) === -1) dates.push(today);
    if (dates.length >= MASTERY_DAYS_REQUIRED) {
      delete map[id];
      writeWrong(map);
      return { mastered: true, days: dates.length };
    }
    entry.correctDates = dates;
    map[id] = entry;
    writeWrong(map);
    return { mastered: false, days: dates.length };
  }

  function bumpCompleted() {
    EC.store.set("mcq_completed", (Number(EC.store.get("mcq_completed", 0)) || 0) + 1);
  }

  /* ---------------------------------------------------------------- */
  /* Challenge history                                                 */
  /* ---------------------------------------------------------------- */

  function readHistory() {
    var h = EC.store.get("challenge_history", {});
    return (h && typeof h === "object" && Object.prototype.toString.call(h) !== "[object Array]") ? h : {};
  }

  /* ---------------------------------------------------------------- */
  /* Shared state + view rendering                                     */
  /* ---------------------------------------------------------------- */

  function renderView(main, params, name) {
    stopTimer();

    var root = document.createElement("div");
    root.className = "study-page";
    main.innerHTML = "";
    main.appendChild(root);

    var st = {
      mode: (name === "drill" || (params && params.get("mode") === "drill")) ? "drill" : "challenge",
      items: [],
      sections: [],
      section: "all",
      chapter: "all",
      size: 3,
      wrongOnly: false,
      questions: [],
      index: 0,
      answered: false,
      selected: null,
      score: 0,
      streak: 0,
      maxStreak: 0,
      history: [],
      completed: false,
      notice: "",
      challengeType: "daily",
      challengeId: "",
      challengeQ: null,
      records: {},
      seconds: TIMER_SECONDS,
      running: false,
      revealed: false,
      submitted: false,
      selectedOption: null,
      sound: true,
      content: null,
      root: root
    };

    root.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== root && (!t.getAttribute || !t.getAttribute("data-action"))) t = t.parentNode;
      if (!t || t === root) return;
      var action = t.getAttribute("data-action");
      handleAction(st, action, t);
    });
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-action") === "chapter") {
        st.chapter = t.value;
        startNewSet(st, st.size, st.section, st.chapter, st.wrongOnly);
      }
    });

    root.innerHTML =
      '<header class="study-hero">' +
        '<div class="study-hero-content">' +
          '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
          '<h1 class="study-title">Quick Quiz <span>&amp; Daily Challenge</span></h1>' +
          '<p class="study-description">Test active recall under 60-second timed exam conditions or drill ' +
            '<span id="qz-hero-count">' + st.items.length.toLocaleString() + '</span>' +
            ' syllabus MCQs across all six Business Studies units.</p>' +
          '<div class="study-hero-actions">' +
            '<button type="button" id="qz-hero-action" class="study-action btn-primary whitespace-nowrap shrink-0" data-action="' +
              (st.mode === "challenge" ? "mode-drill" : "mode-challenge") + '">' +
              icon(st.mode === "challenge" ? "target" : "zap", 16) +
              '<span>' + (st.mode === "challenge" ? "Start Chapter Drill" : "Open 60s Challenge") + '</span>' +
              icon("arrowRight", 16) +
            '</button>' +
            '<button type="button" class="study-action study-secondary-action whitespace-nowrap shrink-0" data-action="open-flashcards">' +
              icon("layers", 16) + '<span>0264 Flashcards</span></button>' +
            '<button type="button" class="study-action study-secondary-action whitespace-nowrap shrink-0" data-action="open-practice">' +
              '<span>Practice Studio</span>' + icon("arrowRight", 15) + '</button>' +
            '<button type="button" class="study-action study-secondary-action whitespace-nowrap shrink-0" data-action="open-review">' +
              icon("clipboard", 16) + '<span>Review Mistakes</span></button>' +
          '</div>' +
          '<p class="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">' +
            '<span id="qz-hero-stats">' + st.items.length.toLocaleString() + ' MCQ questions · ' +
            st.sections.length + ' sections · ' + wrongIds().length + ' in Wrong Only</span></p>' +
        '</div>' +
        '<div class="study-hero-image" aria-hidden="true"></div>' +
      '</header>' +
      '<div id="quiz-studio-workspace" class="study-studio">' +
        '<div class="study-mode-bar" id="qz-modebar"></div>' +
        '<div id="qz-content"><p class="study-panel-padding">Loading question bank…</p></div>' +
      '</div>' +
      '<p class="mx-auto mt-5 max-w-3xl text-center text-[11px] leading-relaxed text-[var(--muted,#4b5c54)] dark:text-neutral-500">' +
        'Active recall questions align with Cambridge IGCSE Business Studies (0264). Wrong Only ' +
        'mistakes are cleared after ' + MASTERY_DAYS_REQUIRED + ' correct answers on different days. Boss ' +
        'Battle mistakes are saved to the review page. Progress and Study Coins stay in this browser.' +
      '</p>';

    st.content = root.querySelector("#qz-content");
    renderModeBar(st);

    loadBank().then(function (items) {
      st.items = items || [];
      var seen = {}, i;
      for (i = 0; i < st.items.length; i++) {
        if (st.items[i] && st.items[i].section) seen[st.items[i].section] = true;
      }
      st.sections = Object.keys(seen).sort(function (a, b) {
        return (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0);
      });
      var restored = restoreDraft(st);
      if (st.mode === "drill") {
        if (restored && st.index < st.questions.length) renderDrill(st);
        else startNewSet(st, st.size, "all", "all", false);
      } else {
        buildChallenge(st);
      }
    })["catch"](function (err) {
      st.content.innerHTML = '<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--sheet-rose)] p-4 text-xs text-[var(--surface-text)]">Could not load the question bank: ' +
        esc(err && err.message ? err.message : err) + '</div>';
    });

    return undefined;
  }

  function renderModeBar(st) {
    var bar = st.root.querySelector("#qz-modebar");
    if (!bar) return;
    var challengeActive = st.mode === "challenge";
    bar.innerHTML =
      '<div role="group" aria-label="Quiz mode" class="study-mode-options max-sm:!grid-cols-2">' +
        '<button type="button" class="study-mode-button max-sm:!flex-row max-sm:!justify-center max-sm:!min-h-[3rem] max-sm:!px-2.5 max-sm:!gap-1.5" ' +
          'data-action="mode-challenge" aria-pressed="' + challengeActive + '">' +
          icon("zap", 17) + '<span>Daily &amp; Weekly Challenge</span>' +
          '<small class="font-mono text-[10px] opacity-70 tabular-nums">60s</small>' +
        '</button>' +
        '<button type="button" class="study-mode-button max-sm:!flex-row max-sm:!justify-center max-sm:!min-h-[3rem] max-sm:!px-2.5 max-sm:!gap-1.5" ' +
          'data-action="mode-drill" aria-pressed="' + (!challengeActive) + '">' +
          icon("target", 17) + '<span>Chapter Active Recall Drills</span>' +
          '<small class="font-mono text-[10px] opacity-70 tabular-nums">' + st.items.length.toLocaleString() + '</small>' +
        '</button>' +
      '</div>' +
      '<div class="py-2 font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted)]">' +
        (challengeActive
          ? 'UTC synchronized · +50 daily / +150 weekly coins'
          : filteredPool(st).length.toLocaleString() + ' matching questions') +
      '</div>';

    var hero = st.root.querySelector("#qz-hero-action");
    if (hero) {
      var toDrill = st.mode === "challenge";
      hero.setAttribute("data-action", toDrill ? "mode-drill" : "mode-challenge");
      hero.innerHTML = icon(toDrill ? "target" : "zap", 16) +
        "<span>" + (toDrill ? "Start Chapter Drill" : "Open 60s Challenge") + "</span>" +
        icon("arrowRight", 16);
    }
    var stats = st.root.querySelector("#qz-hero-stats");
    if (stats) {
      stats.textContent = st.items.length.toLocaleString() + " MCQ questions · " +
        st.sections.length + " sections · " + wrongIds().length + " in Wrong Only";
    }
    var count = st.root.querySelector("#qz-hero-count");
    if (count) count.textContent = st.items.length.toLocaleString();
  }

  function handleAction(st, action, node) {
    switch (action) {
      case "mode-challenge":
        stopTimer(); st.mode = "challenge"; renderModeBar(st); buildChallenge(st); focusWorkspace(); return;
      case "mode-drill":
        stopTimer(); st.mode = "drill"; renderModeBar(st);
        startNewSet(st, st.size, st.section, st.chapter, st.wrongOnly); focusWorkspace(); return;

      case "section":
        startNewSet(st, st.size, node.getAttribute("data-section"), "all", st.wrongOnly); return;
      case "size":
        startNewSet(st, parseInt(node.getAttribute("data-size"), 10) || 3,
          st.section, st.chapter, st.wrongOnly); return;
      case "refresh":
        startNewSet(st, st.size, st.section, st.chapter, st.wrongOnly); return;
      case "shuffle":
        clearDraft();
        st.questions = shuffle(st.questions);
        st.index = 0; st.answered = false; st.selected = null;
        st.score = 0; st.streak = 0; st.maxStreak = 0;
        st.history = []; st.completed = false; st.notice = "";
        renderDrill(st); return;
      case "wrongonly":
        startNewSet(st, st.size, st.section, st.chapter, !st.wrongOnly); return;
      case "answer":
        answerQuestion(st, node.getAttribute("data-letter")); return;
      case "next":
        nextQuestion(st); return;
      case "another":
        startNewSet(st, st.size, st.section, st.chapter, st.wrongOnly); return;
      case "master-drill":
        startNewSet(st, 10, st.section, st.chapter, st.wrongOnly); return;
      case "show-all":
        startNewSet(st, st.size, st.section, st.chapter, false); return;
      case "reset-chapter":
        startNewSet(st, st.size, st.section, "all", st.wrongOnly); return;

      case "challenge-daily":
      case "challenge-weekly":
        stopTimer();
        st.challengeType = action === "challenge-weekly" ? "weekly" : "daily";
        buildChallenge(st); return;
      case "challenge-sound":
        st.sound = !st.sound; renderChallenge(st); return;
      case "challenge-reveal":
        revealChallenge(st); return;
      case "challenge-review":
        st.revealed = true; st.submitted = true;
        var rec = st.records[st.challengeId] || {};
        st.selectedOption = rec.selectedOption && rec.selectedOption !== "TIME_EXPIRED"
          ? rec.selectedOption : null;
        renderChallenge(st); return;
      case "challenge-option":
        submitChallenge(st, node.getAttribute("data-option")); return;

      case "open-flashcards":
        EC.navigate("flashcards"); return;
      case "open-practice":
        EC.navigate("practice"); return;
      case "open-review":
        EC.navigate("review"); return;
      case "open-study-space":
        EC.navigate("study-space"); return;
      default:
        return;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Drill mode                                                        */
  /* ---------------------------------------------------------------- */

  function chaptersFor(st, section) {
    var out = [], seen = {};
    for (var i = 0; i < st.items.length; i++) {
      var q = st.items[i];
      if (q && (section === "all" || q.section === section) && q.chapter && !seen[q.chapter]) {
        seen[q.chapter] = true;
        out.push(q.chapter);
      }
    }
    return out.sort();
  }

  function filteredPool(st) {
    var ids = st.wrongOnly ? wrongIds() : null;
    var idMap = {};
    if (ids) for (var i = 0; i < ids.length; i++) idMap[ids[i]] = true;
    var out = [];
    for (var j = 0; j < st.items.length; j++) {
      var q = st.items[j];
      if (!q) continue;
      if (st.section !== "all" && q.section !== st.section) continue;
      if (st.chapter !== "all" && q.chapter !== st.chapter) continue;
      if (st.wrongOnly && !idMap[q.id]) continue;
      out.push(q);
    }
    return out;
  }

  function buildQuizSet(pool, count) {
    var shuffled = pool.slice().sort(function () { return 0.5 - Math.random(); });
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function startNewSet(st, size, section, chapter, onlyWrong) {
    st.size = size || st.size;
    st.section = section === undefined || section === null ? st.section : section;
    st.chapter = chapter === undefined || chapter === null ? st.chapter : chapter;
    st.wrongOnly = onlyWrong === undefined || onlyWrong === null ? st.wrongOnly : !!onlyWrong;

    clearDraft();

    var chapters = chaptersFor(st, st.section);
    if (st.chapter !== "all" && chapters.indexOf(st.chapter) === -1) st.chapter = "all";

    st.questions = buildQuizSet(filteredPool(st), st.size);
    st.index = 0; st.answered = false; st.selected = null;
    st.score = 0; st.streak = 0; st.maxStreak = 0;
    st.history = []; st.completed = false; st.notice = "";
    renderDrill(st);
  }

  function answerQuestion(st, letter) {
    if (st.answered || st.completed || !st.questions[st.index]) return;
    if (LETTERS.indexOf(letter) === -1) return;
    st.answered = true;
    st.selected = letter;

    var q = st.questions[st.index];
    var correct = letter === q.correctOption;
    bumpCompleted();

    if (correct) {
      st.score++; st.streak++;
      if (st.streak > st.maxStreak) st.maxStreak = st.streak;
      var progress = recordCorrect(q.id);
      if (progress.mastered) {
        st.notice = "Mastered! You answered this correctly on " + MASTERY_DAYS_REQUIRED +
          " different days, so it has left the Wrong Only bank.";
      } else if (progress.days > 0) {
        st.notice = "Mastery progress " + progress.days + "/" + MASTERY_DAYS_REQUIRED +
          " days. Answer it correctly again on a different day to clear it from Wrong Only.";
      }
      EC.addCoins(15);
    } else {
      st.streak = 0;
      recordIncorrect(q.id);
      st.notice = "Added to Wrong Only. Get it right on " + MASTERY_DAYS_REQUIRED +
        " different days to remove it.";
      EC.addCoins(5);
    }

    st.history.push({
      item: q,
      selected: q.options && q.options[letter] ? q.options[letter] : "",
      isCorrect: correct
    });
    renderDrill(st);
  }

  function nextQuestion(st) {
    if (st.index < st.questions.length - 1) {
      st.index++; st.answered = false; st.selected = null; st.notice = "";
      renderDrill(st);
    } else {
      st.completed = true;
      clearDraft();
      EC.addCoins(25);
      var pct = st.questions.length ? Math.round((st.score / st.questions.length) * 100) : 0;
      if (pct >= 70) {
        celebrate({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
      renderDrill(st);
    }
  }

  /* Card / key-cap classes shared by drill and challenge options. */
  function optionPresentation(answered, isCorrect, isSelected) {
    var card = "bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)]";
    var key = "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
    if (answered) {
      if (isCorrect) {
        card = "bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium";
        key = "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
      } else if (isSelected) {
        card = "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)]";
        key = "bg-[#97532b] border-transparent text-white";
      } else {
        card = "opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
      }
    }
    return { card: card, key: key };
  }

  function renderDrill(st) {
    if (st.mode !== "drill" || !st.content) return;
    renderModeBar(st);

    var chapters = chaptersFor(st, st.section);
    var out = [];

    out.push('<div class="study-workspace">');

    /* Left section rail. */
    out.push('<aside class="study-section-rail" aria-label="Syllabus section filter">');
    out.push('<div>');
    out.push('<h2 class="study-panel-kicker">Syllabus sections</h2>');
    out.push('<div role="group" aria-label="Filter drills by syllabus section" class="study-sections">');
    out.push('<button type="button" class="study-section-button" data-action="section" data-section="all" aria-pressed="' +
      (st.section === "all") + '"><span>All</span>' +
      '<strong class="font-semibold text-[12px] leading-tight truncate text-left">All Units</strong></button>');
    for (var s = 0; s < st.sections.length; s++) {
      var sec = st.sections[s];
      out.push('<button type="button" class="study-section-button" data-action="section" data-section="' + esc(sec) +
        '" aria-pressed="' + (st.section === sec) + '"><span>0' + esc(sec) + '</span>' +
        '<strong class="font-semibold text-[12px] leading-tight truncate text-left">' +
        esc(SECTION_LABELS[sec] || ("Section " + sec)) + '</strong></button>');
    }
    out.push('</div></div>');

    out.push('<div class="study-mode-shortcuts">');
    out.push('<button type="button" class="study-shortcut justify-between' +
      (st.wrongOnly ? ' bg-[var(--sheet-rose)] text-[var(--surface-text)] border border-[var(--sheet-rose-line)]' : '') +
      '" data-action="wrongonly" aria-pressed="' + st.wrongOnly + '" ' +
      'title="Practice only questions you previously answered incorrectly. A question leaves Wrong Only after ' +
      MASTERY_DAYS_REQUIRED + ' correct answers on different days.">' +
      '<span class="flex items-center gap-2 min-w-0">' + icon("xcircle", 15, "shrink-0") +
      '<span class="truncate">' + (st.wrongOnly ? "Wrong Only (Active)" : "Wrong Only") + '</span></span>' +
      '<small class="font-mono text-[10px] opacity-75 tabular-nums">' + wrongIds().length + '</small></button>');
    out.push('<button type="button" class="study-shortcut" data-action="open-review">' +
      icon("clipboard", 15) + '<span>Review Mistakes</span></button>');
    out.push('<button type="button" class="study-shortcut" data-action="open-flashcards">' +
      icon("layers", 15) + '<span>0264 Flashcards</span></button>');
    out.push('<button type="button" class="study-shortcut" data-action="open-practice">' +
      icon("arrowRight", 15) + '<span>Practice Studio</span></button>');
    out.push('<button type="button" class="study-shortcut" data-action="open-study-space">' +
      icon("headphones", 15) + '<span>Study Space</span></button>');
    out.push('</div></aside>');

    /* Right main drill stage. */
    out.push('<div class="min-w-0 study-paper-one-editor">');
    out.push('<div class="study-panel-header border-b border-[var(--surface-line)] bg-[var(--surface-soft)]/55">');
    out.push('<div class="min-w-0"><p class="study-panel-kicker">Cambridge Active Recall MCQ Bank</p>' +
      '<h2 class="study-panel-title text-[var(--surface-text)] mt-0.5 truncate">' +
      (st.chapter !== "all" ? esc(st.chapter)
        : st.section === "all" ? "All Syllabus Sub-topics"
        : "Section " + esc(st.section) + ": " + esc(SECTION_LABELS[st.section] || "")) +
      '</h2></div>');
    out.push('<div class="flex flex-wrap items-center gap-2">');
    out.push('<select data-action="chapter" aria-label="Filter by sub-topic" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] text-[var(--surface-text)] max-w-[210px] truncate cursor-pointer">' +
      '<option value="all"' + (st.chapter === "all" ? ' selected' : '') + '>All Sub-topics</option>');
    for (var c = 0; c < chapters.length; c++) {
      out.push('<option value="' + esc(chapters[c]) + '"' +
        (st.chapter === chapters[c] ? ' selected' : '') + '>' + esc(chapters[c]) + '</option>');
    }
    out.push('</select>');
    out.push('<div role="group" aria-label="Number of questions" class="study-engine">');
    var sizes = [3, 5, 10, 20];
    for (var i = 0; i < sizes.length; i++) {
      out.push('<button type="button" class="study-engine-option font-mono tabular-nums" data-action="size" data-size="' +
        sizes[i] + '" aria-pressed="' + (st.size === sizes[i]) + '">' + sizes[i] + 'Q</button>');
    }
    out.push('</div>');
    out.push('<button type="button" class="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap" ' +
      'data-action="refresh" title="Randomize new question set">' + icon("refresh", 13) + '<span>Refresh</span></button>');
    out.push('<button type="button" class="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap" ' +
      'data-action="shuffle" title="Shuffle the current set"><span>Shuffle</span></button>');
    out.push('</div></div>');

    out.push('<div class="study-panel-padding">');
    if (st.questions.length === 0) {
      out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">' +
        '<p class="study-panel-kicker">No Questions Matching Filter</p>' +
        '<h3 class="mt-1 font-[var(--font-serif)] text-xl font-semibold text-[var(--surface-text)]">' +
          (st.wrongOnly ? "You have no flagged mistakes in this selection" : "No MCQs found for this filter") + '</h3>' +
        '<p class="mt-1.5 text-xs sm:text-sm text-[var(--surface-muted)]">' + (st.wrongOnly
          ? "Every question answered wrong goes into Wrong Only until you get it right on " +
            MASTERY_DAYS_REQUIRED + " different days."
          : "Try broadening your section or sub-topic filter to start a drill.") + '</p>' +
        '<div class="mt-5 flex flex-wrap justify-center gap-2">');
      if (st.wrongOnly) out.push('<button type="button" class="study-action btn-primary" data-action="show-all">Show All Matching Questions</button>');
      if (st.chapter !== "all") out.push('<button type="button" class="study-action study-secondary-action" data-action="reset-chapter">Reset Sub-topic Filter</button>');
      out.push('</div></div>');
    } else if (st.completed) {
      out.push(renderResults(st));
    } else {
      out.push(renderQuestion(st));
    }
    out.push('</div></div></div>');

    saveDraft(st);
    st.content.innerHTML = out.join("");
  }

  function renderQuestion(st) {
    var q = st.questions[st.index], out = [];
    var pct = st.questions.length ? Math.round(((st.index + 1) / st.questions.length) * 100) : 0;

    out.push('<div class="space-y-5">');

    /* Progress & score strip. */
    out.push('<div>' +
      '<div class="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--surface-muted)] mb-2 font-mono tabular-nums">' +
        '<div class="flex items-center gap-2">' +
          '<span class="font-bold text-[var(--surface-text)]">Question ' + (st.index + 1) + ' of ' + st.questions.length + '</span>' +
          '<span aria-hidden="true">·</span>' +
          '<span>Score <strong class="text-[var(--surface-accent)]">' + st.score + ' / ' + st.index + '</strong></span>' +
        '</div>' +
        (st.streak >= 2 ? '<span class="font-bold text-[#97532b] dark:text-[#f6bb83]">' + st.streak + ' question streak</span>' : '') +
      '</div>' +
      '<div role="progressbar" aria-label="Quiz progress" aria-valuemin="1" aria-valuemax="' + st.questions.length +
        '" aria-valuenow="' + (st.index + 1) + '" class="w-full h-1.5 rounded-full bg-[var(--surface-line)] overflow-hidden">' +
        '<div class="h-full rounded-full bg-[var(--surface-accent)] transition-[width] duration-300" style="width:' + pct + '%"></div>' +
      '</div></div>');

    /* Question prompt card. */
    out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5">' +
      '<p class="study-panel-kicker mb-2">Question #' + esc(q.questionNumber || q.id) + ' · ' + esc(q.chapter) +
      ' · ' + esc(q.questionType || "Definition") + '</p>' +
      '<h3 class="study-prompt text-[var(--surface-text)]">' + esc(q.question) + '</h3>' +
      '<p class="mt-1.5 text-xs text-[var(--surface-muted)]">' +
      'Select the exact textbook definition or mark scheme answer below.</p></div>');

    /* MCQ options with inline explanations. */
    var explanation = q.explanation || {};
    var distractors = explanation.distractor_reasons || {};
    out.push('<div class="space-y-2.5">');
    for (var i = 0; i < LETTERS.length; i++) {
      var letter = LETTERS[i];
      var optionText = q.options && q.options[letter] ? q.options[letter] : "";
      var isCorrect = letter === q.correctOption;
      var isSelected = st.selected === letter;
      var p = optionPresentation(st.answered, isCorrect, isSelected);
      var reason = isCorrect ? (explanation.correct_reason || "") : (distractors[letter] || "");
      out.push('<button type="button" class="w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ' +
        p.card + ' ' + (st.answered ? "cursor-default" : "cursor-pointer") + '" data-action="answer" data-letter="' +
        letter + '"' + (st.answered ? ' disabled' : '') + '>' +
        '<span class="w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ' + p.key + '">' +
          (st.answered && isCorrect ? icon("check", 14) : st.answered && isSelected ? icon("xcircle", 14) : letter) +
        '</span>' +
        '<div class="flex-1 min-w-0"><span>' + esc(optionText) + '</span>');
      if (st.answered && reason) {
        out.push('<span class="block mt-2 text-[11px] leading-relaxed font-normal ' +
          (isCorrect ? "text-[var(--surface-accent)]" : "text-[#97532b] dark:text-[#f6bb83]") + '">' +
          '<strong class="font-mono font-bold mr-1.5">' + (isCorrect ? "✓ Why correct:" : "✕ Why wrong:") + '</strong>' +
          esc(reason) + '</span>');
      }
      out.push('</div></button>');
    }
    out.push('</div>');

    /* Bottom status banner. */
    if (st.answered) {
      out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs">' +
        '<div class="flex items-center gap-2 font-semibold text-sm text-[var(--surface-text)]">');
      if (st.selected === q.correctOption) {
        out.push(icon("check", 16, "shrink-0 text-[var(--surface-accent)]") + '<span>Correct option selected.</span>');
      } else {
        out.push(icon("xcircle", 16, "shrink-0 text-[#97532b] dark:text-[#f6bb83]") +
          '<span>Incorrect option selected — added to Wrong Only review bank.</span>');
      }
      out.push('</div></div>');
      if (st.notice) {
        out.push('<div role="status" class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-3 text-xs leading-relaxed text-[var(--surface-muted)]">' +
          esc(st.notice) + '</div>');
      }
    }

    /* Bottom action bar. */
    out.push('<div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--surface-line)]">' +
      '<span class="text-xs text-[var(--surface-muted)]">' +
      (st.answered ? "Review the explanations above before moving on." : "Choose one of the four options above.") +
      '</span>');
    if (st.answered) {
      out.push('<button type="button" class="study-action btn-primary whitespace-nowrap" data-action="next"><span>' +
        (st.index < st.questions.length - 1 ? "Next Question" : "Finish Quiz & View Results") +
        '</span>' + icon("arrowRight", 15) + '</button>');
    }
    out.push('</div></div>');
    return out.join("");
  }

  function renderResults(st) {
    var total = st.questions.length;
    var pct = total ? Math.round((st.score / total) * 100) : 0;
    var out = [];
    out.push('<div class="space-y-6">');
    out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">' +
      '<p class="study-panel-kicker">Active Recall Assessment Complete</p>' +
      '<h3 class="mt-2 font-[var(--font-serif)] text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--surface-text)] tabular-nums">' +
        st.score + ' / ' + total + ' (' + pct + '%)</h3>' +
      '<p class="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[var(--surface-muted)] leading-relaxed">' +
        (st.score === total
          ? "100% precision. You nailed every Cambridge definition and avoided every distractor trap."
          : pct >= 70
            ? "Strong performance. You accurately identified the majority of verified syllabus definitions."
            : "Active recall improves rapidly with repetition. Use Wrong Only mode to drill missed items — get each one right on " +
              MASTERY_DAYS_REQUIRED + " different days to clear it.") + '</p>' +
      '<div class="mt-5 flex flex-wrap items-center justify-center gap-2.5">' +
        '<button type="button" class="study-action btn-primary whitespace-nowrap" data-action="another">' +
          icon("refresh", 15) + '<span>Take Another ' + st.size + ' Questions</span></button>' +
        '<button type="button" class="study-action study-secondary-action whitespace-nowrap" data-action="master-drill">' +
          icon("target", 15) + '<span>10-Question Master Drill</span></button>' +
        '<button type="button" class="study-action study-secondary-action whitespace-nowrap" data-action="open-review">' +
          icon("clipboard", 15) + '<span>Review Mistakes</span></button>' +
        '<button type="button" class="study-action study-secondary-action whitespace-nowrap" data-action="open-flashcards">' +
          icon("layers", 15) + '<span>Browse Flashcards</span></button>' +
      '</div></div>');

    out.push('<div><h4 class="font-[var(--font-serif)] text-base font-semibold text-[var(--surface-text)] mb-3">Session answers review</h4>' +
      '<div class="space-y-2.5">');
    for (var i = 0; i < st.history.length; i++) {
      var a = st.history[i];
      out.push('<div class="p-4 rounded-xl border text-xs ' + (a.isCorrect
        ? "bg-[var(--sheet-sage)] border-[var(--sheet-sage-line)]"
        : "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)]") + '">' +
        '<div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">' +
          '<span class="font-mono text-[11px] font-semibold text-[var(--surface-muted)] tabular-nums">Q' + (i + 1) +
            ' · ' + esc(a.item.chapter) + ' · #' + esc(a.item.questionNumber || a.item.id) + '</span>' +
          '<span class="inline-flex items-center gap-1 font-mono text-[11px] font-bold ' +
            (a.isCorrect ? "text-[var(--surface-accent)]" : "text-[#97532b] dark:text-[#f6bb83]") + '">' +
            (a.isCorrect
              ? icon("check", 13) + '<span>Correct (+1)</span>'
              : icon("xcircle", 13) + '<span>Incorrect (0)</span>') +
          '</span>' +
        '</div>' +
        '<strong class="block font-[var(--font-serif)] text-sm text-[var(--surface-text)] mb-2 leading-snug">' +
          esc(a.item.question) + '</strong>' +
        '<div class="space-y-1 text-[var(--surface-text)]">' +
          '<div><strong class="font-mono text-[11px] uppercase tracking-wider text-[var(--surface-accent)]">Exact mark scheme: </strong>' +
            '<span>' + esc(a.item.correctAnswer) + '</span></div>' +
          (a.isCorrect ? '' :
            '<div class="text-[var(--surface-muted)]"><strong class="font-mono text-[11px] uppercase tracking-wider text-[#97532b] dark:text-[#f6bb83]">Your selection: </strong>' +
              '<span>' + esc(a.selected) + '</span></div>') +
        '</div></div>');
    }
    out.push('</div></div></div>');
    return out.join("");
  }

  /* ---------------------------------------------------------------- */
  /* Challenge mode                                                    */
  /* ---------------------------------------------------------------- */

  function buildChallenge(st) {
    st.records = readHistory();
    st.challengeId = st.challengeType === "daily" ? "daily-" + todayUTC() : "weekly-" + isoWeekKey();

    var pool = st.items;
    if (st.challengeType === "weekly") {
      var advanced = [];
      for (var a = 0; a < st.items.length; a++) {
        if (st.items[a].questionType !== "2-Mark") advanced.push(st.items[a]);
      }
      if (advanced.length) pool = advanced;
    }
    if (!pool.length) { st.challengeQ = null; renderChallenge(st); return; }

    var rng = mulberry32(hashString(st.challengeId));
    var target = pool[Math.floor(rng() * pool.length)];
    var others = [];
    for (var b = 0; b < st.items.length; b++) {
      var q = st.items[b];
      if (q.id !== target.id && q.correctAnswer !== target.correctAnswer) others.push(q);
    }
    others.sort(function () { return rng() - 0.5; });
    var distractors = [], i;
    var same = [];
    for (i = 0; i < others.length; i++) if (others[i].chapter === target.chapter) same.push(others[i]);
    for (i = 0; i < Math.min(2, same.length); i++) distractors.push(same[i].correctAnswer);
    for (i = 0; i < others.length && distractors.length < 3; i++) {
      if (distractors.indexOf(others[i].correctAnswer) === -1) distractors.push(others[i].correctAnswer);
    }
    var all = [target.correctAnswer].concat(distractors);
    all.sort(function () { return rng() - 0.5; });
    st.challengeQ = { target: target, options: all, correctAnswer: target.correctAnswer };

    st.seconds = TIMER_SECONDS;
    st.running = false;
    st.revealed = false;
    st.submitted = false;
    st.selectedOption = null;
    renderChallenge(st);
  }

  function beep(freq, duration) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch (e) { /* audio is optional */ }
  }

  function playTone(st, freq, duration) { if (st.sound) beep(freq, duration); }

  function revealChallenge(st) {
    st.revealed = true;
    st.seconds = TIMER_SECONDS;
    st.submitted = false;
    st.selectedOption = null;
    st.running = true;
    playTone(st, 600, 0.1);
    renderChallenge(st);
    stopTimer();
    activeTimer = setInterval(function () {
      /* If the student navigated to another view, stop instead of recording a
         challenge result nobody saw. */
      if (!st.root || !st.root.isConnected) { stopTimer(); return; }
      if (!st.running || st.submitted || st.seconds <= 0) { stopTimer(); return; }
      st.seconds--;
      if (st.seconds <= 0) {
        stopTimer();
        st.running = false;
        st.submitted = true;
        st.selectedOption = "TIME_EXPIRED";
        saveChallengeResult(st, "TIME_EXPIRED", false, 0);
        playTone(st, 300, 0.2);
        renderChallenge(st);
        return;
      }
      if (st.seconds <= 10) playTone(st, 950, 0.05);
      updateTimerDisplay(st);
    }, 1000);
  }

  function saveChallengeResult(st, selected, isCorrect, bonus) {
    st.records[st.challengeId] = {
      challengeId: st.challengeId,
      dateCompleted: new Date().toISOString(),
      isCorrect: !!isCorrect,
      timeRemainingSeconds: st.seconds,
      bonusCoinsEarned: bonus || 0,
      selectedOption: selected
    };
    EC.store.set("challenge_history", st.records);
  }

  function submitChallenge(st, option) {
    if (st.submitted || st.seconds <= 0 || !st.challengeQ) return;
    if (st.records[st.challengeId]) return; /* already completed today / this week */
    stopTimer();
    st.running = false;
    st.submitted = true;
    st.selectedOption = option;
    var correct = option === st.challengeQ.correctAnswer;
    var bonus = correct ? (st.challengeType === "daily" ? 50 : 150) : 0;
    if (correct) {
      EC.addCoins(bonus);
      celebrate({ particleCount: 85, spread: 68, origin: { y: 0.65 } });
      playTone(st, 1200, 0.15);
    }
    else playTone(st, 250, 0.15);
    saveChallengeResult(st, option, correct, bonus);
    renderChallenge(st);
  }

  function timerBarTone(seconds) {
    return seconds > 30 ? "bg-[var(--primary-btn-bg,#e4eeb2)]" : seconds > 10 ? "bg-[#f6bb83]" : "bg-[#ef4444]";
  }

  function timerTextTone(seconds) {
    return seconds > 30 ? "text-[var(--primary-btn-bg,#e4eeb2)]" : seconds > 10 ? "text-[#f6bb83]" : "text-[#fca5a5]";
  }

  function updateTimerDisplay(st) {
    if (!st.content) return;
    var bar = st.content.querySelector("#qz-timer-bar");
    var txt = st.content.querySelector("#qz-timer-text");
    if (bar) {
      bar.style.width = Math.round((st.seconds / TIMER_SECONDS) * 100) + "%";
      bar.className = "h-full transition-[width] duration-1000 " + timerBarTone(st.seconds);
    }
    if (txt) {
      txt.textContent = pad2(Math.floor(st.seconds / 60)) + ":" + pad2(st.seconds % 60);
      txt.className = "font-mono text-lg font-bold tabular-nums px-2.5 py-0.5 rounded-md bg-black/25 " +
        timerTextTone(st.seconds);
    }
    var ico = st.content.querySelector("#qz-timer-icon");
    if (ico) ico.setAttribute("class", "lucide lucide-timer " + timerTextTone(st.seconds));
  }

  function renderChallenge(st) {
    if (st.mode !== "challenge" || !st.content) return;
    renderModeBar(st);
    if (!st.challengeQ) {
      st.content.innerHTML = '<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs text-[var(--surface-text)]">No challenge question is available.</div>';
      return;
    }

    var target = st.challengeQ.target;
    var daily = st.challengeType === "daily";
    var bonus = daily ? 50 : 150;
    var record = st.records[st.challengeId];
    var completed = !!record;
    var wasCorrect = !!(record && record.isCorrect);
    var out = [];

    /* Challenge studio sub-toolbar. */
    out.push('<div class="study-panel-header border-b border-[var(--surface-line)] bg-[var(--surface-soft)]/55">');
    out.push('<div class="min-w-0">' +
      '<p class="study-panel-kicker">Synchronized Global Assessment · Same Question Worldwide Today</p>' +
      '<h2 class="study-panel-title text-[var(--surface-text)] mt-0.5">Daily &amp; Weekly Timed Challenge</h2>' +
      '<p class="mt-1 font-mono text-[11px] text-[var(--surface-muted)] tabular-nums">' +
        (daily ? "Date: " + esc(todayUTC()) : "Week: " + esc(isoWeekKey())) +
        ' · ' + esc(target.chapter) + ' · +' + bonus + ' Study Coins</p></div>');
    out.push('<div class="flex flex-wrap items-center gap-2 shrink-0">');
    out.push('<div role="group" aria-label="Challenge cadence" class="study-engine">' +
      '<button type="button" class="study-engine-option" data-action="challenge-daily" aria-pressed="' + daily + '">' +
        icon("zap", 13) + '<span>Daily Blitz</span><span class="font-mono text-[10px] opacity-75">+50</span></button>' +
      '<button type="button" class="study-engine-option" data-action="challenge-weekly" aria-pressed="' + (!daily) + '">' +
        icon("award", 13) + '<span>Weekly Master</span><span class="font-mono text-[10px] opacity-75">+150</span></button>' +
      '</div>');
    var soundTitle = st.sound ? "Mute timer countdown ticks" : "Enable timer countdown ticks";
    out.push('<button type="button" class="study-pager-button" data-action="challenge-sound" title="' + soundTitle +
      '" aria-label="' + soundTitle + '">' +
      (st.sound ? icon("volume2", 15, "", false) : icon("volumeX", 15, "", false)) + '</button>');
    out.push('</div></div>');

    out.push('<div class="study-panel-padding"><div class="mx-auto max-w-4xl space-y-5">');

    /* 1. Concealed shield. */
    if (!st.revealed && !completed) {
      out.push('<div class="rounded-xl p-7 sm:p-10 text-center" style="background:var(--hero-bg);color:var(--hero-text)">' +
        '<div class="mx-auto max-w-xl flex flex-col items-center">' +
          '<p class="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2" style="color:var(--primary-btn-bg)">' +
            icon("clock", 14) + '<span>1-Minute Active Recall Timer</span></p>' +
          '<h3 class="font-[var(--font-serif)] text-2xl sm:text-3xl font-semibold tracking-tight text-balance">' +
            (daily ? "Today's Global Blitz Challenge" : "This Week's Master Challenge") + '</h3>' +
          '<p class="mt-2.5 text-xs sm:text-sm leading-relaxed opacity-90">Every student worldwide receives this exact ' +
            esc(target.chapter) + ' question. Once you reveal it, you have <strong>exactly 60 seconds</strong> to pick the verified ' +
            'Cambridge mark scheme answer for <span class="font-mono font-semibold">+' + bonus + ' coins</span>.</p>' +
          '<div class="mt-6"><button type="button" class="study-action btn-primary whitespace-nowrap" data-action="challenge-reveal">' +
            icon("zap", 16) + '<span>Reveal Question &amp; Start 60s Clock</span>' + icon("arrowRight", 16) +
          '</button></div>' +
        '</div></div>');
    } else if (!st.revealed && completed) {
      /* 2. Already completed summary. */
      out.push('<div class="rounded-xl border p-5 sm:p-6 ' +
        (wasCorrect ? "bg-[var(--sheet-sage)] border-[var(--sheet-sage-line)]" : "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)]") + '">' +
        '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
          '<div class="flex items-start gap-3">' +
            '<div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ' +
              (wasCorrect ? "bg-[var(--hero-bg)] text-[var(--hero-text)]" : "bg-[#97532b] text-white") + '">' +
              (wasCorrect ? icon("check", 20) : icon("xcircle", 20)) + '</div>' +
            '<div>' +
              '<p class="study-panel-kicker">' + (daily ? "Daily Blitz Complete" : "Weekly Master Complete") + '</p>' +
              '<h3 class="font-[var(--font-serif)] text-lg sm:text-xl font-semibold text-[var(--surface-text)] mt-0.5">' +
                (wasCorrect ? "Challenge completed with full marks" : "Challenge completed — review mark scheme") + '</h3>' +
              '<p class="mt-1 text-xs text-[var(--surface-muted)] tabular-nums">' +
                (wasCorrect
                  ? "Answered with " + esc(record.timeRemainingSeconds) + "s remaining · +" +
                    esc(record.bonusCoinsEarned) + " Study Coins credited"
                  : "Time expired or a distractor was selected. Inspect the official Cambridge mark scheme below.") +
              '</p></div></div>' +
          '<button type="button" class="study-action btn-primary whitespace-nowrap shrink-0 self-start sm:self-center" data-action="challenge-review">' +
            '<span>Review Question &amp; Answer</span>' + icon("arrowRight", 15) + '</button>' +
        '</div></div>');
    }

    /* 3. Active ticking question / completed reveal. */
    if (st.revealed) {
      out.push('<div class="space-y-5">');

      if (!st.submitted) {
        out.push('<div class="rounded-xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-4" style="background:var(--hero-bg);color:var(--hero-text)">' +
          '<div class="flex items-center gap-2">' +
            icon("timer", 18, timerTextTone(st.seconds), true, "qz-timer-icon") +
            '<span class="font-mono text-xs font-semibold uppercase tracking-wider opacity-90">Active Recall Countdown</span>' +
          '</div>' +
          '<div class="flex items-center gap-3">' +
            '<div class="w-32 sm:w-52 h-2 rounded-full bg-white/15 overflow-hidden">' +
              '<div id="qz-timer-bar" class="h-full transition-[width] duration-1000 ' + timerBarTone(st.seconds) +
                '" style="width:' + Math.round((st.seconds / TIMER_SECONDS) * 100) + '%"></div>' +
            '</div>' +
            '<div id="qz-timer-text" class="font-mono text-lg font-bold tabular-nums px-2.5 py-0.5 rounded-md bg-black/25 ' +
              timerTextTone(st.seconds) + '">' + pad2(Math.floor(st.seconds / 60)) + ':' + pad2(st.seconds % 60) +
            '</div></div></div>');
      }

      out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-5">' +
        '<p class="study-panel-kicker mb-2">Question #' + esc(target.questionNumber || target.id) + ' · ' +
          esc(target.questionType || "MCQ") + ' · 1 correct · 3 distractors</p>' +
        '<h3 class="study-prompt text-[var(--surface-text)]">' + esc(target.question) + '</h3></div>');

      out.push('<div class="space-y-2.5">');
      for (var i = 0; i < st.challengeQ.options.length; i++) {
        var option = st.challengeQ.options[i];
        var isAnswer = option === st.challengeQ.correctAnswer;
        var isPicked = st.selectedOption === option;
        var p = optionPresentation(st.submitted, isAnswer, isPicked);
        out.push('<button type="button" class="w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ' +
          p.card + ' ' + (st.submitted ? "cursor-default" : "cursor-pointer") + '" data-action="challenge-option" ' +
          'data-option="' + esc(option) + '"' + (st.submitted ? ' disabled' : '') + '>' +
          '<span class="w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ' +
            p.key + '">' +
            (st.submitted && isAnswer ? icon("check", 14) : st.submitted && isPicked ? icon("xcircle", 14) : LETTERS[i]) +
          '</span>' +
          '<div class="flex-1 min-w-0"><span>' + esc(option) + '</span>');
        if (st.submitted && isAnswer) {
          out.push('<span class="block mt-1 font-mono text-[11px] font-bold text-[var(--surface-accent)]">Exact Cambridge mark scheme answer</span>');
        }
        if (st.submitted && isPicked && !isAnswer) {
          out.push('<span class="block mt-1 font-mono text-[11px] font-bold text-[#97532b] dark:text-[#f6bb83]">Your selection — distractor</span>');
        }
        out.push('</div></button>');
      }
      out.push('</div>');

      if (st.submitted) {
        var isCorrect = st.selectedOption === st.challengeQ.correctAnswer;
        out.push('<div class="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-5 space-y-4">' +
          '<div class="flex items-start gap-3">' +
            (isCorrect ? icon("check", 20, "mt-0.5 shrink-0 text-[var(--surface-accent)]")
                       : icon("xcircle", 20, "mt-0.5 shrink-0 text-[#97532b] dark:text-[#f6bb83]")) +
            '<div>' +
              '<h4 class="font-[var(--font-serif)] text-base sm:text-lg font-semibold text-[var(--surface-text)]">' +
                (isCorrect ? "Senior Examiner Assessment: Full Marks (+" + bonus + " Coins)"
                           : "Senior Examiner Assessment &amp; Mark Scheme") + '</h4>' +
              '<p class="text-xs text-[var(--surface-muted)] mt-0.5">' +
                (isCorrect ? "Flawless active recall under timed conditions. You matched the Cambridge mark scheme."
                           : "Time expired or a distractor was selected. Study the official mark scheme phrasing below.") +
              '</p></div></div>' +
          '<div class="rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] p-4 text-xs sm:text-sm leading-relaxed text-[var(--surface-text)]">' +
            '<span class="block font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--surface-accent)] mb-1">Official Cambridge Mark Scheme</span>' +
            esc(st.challengeQ.correctAnswer) + '</div>' +
          '<div class="flex flex-wrap items-center justify-between gap-3 pt-1">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<button type="button" class="study-action btn-primary whitespace-nowrap" data-action="open-study-space">' +
                icon("headphones", 15) + '<span>Spend Coins in Study Space</span></button>' +
              '<button type="button" class="study-action study-secondary-action whitespace-nowrap" data-action="open-practice">' +
                '<span>More Practice Questions</span>' + icon("arrowRight", 15) + '</button>' +
            '</div>' +
            '<span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--surface-muted)] tabular-nums">' +
              icon("coins", 13) + '<span>Next global challenge unlocks at 00:00 UTC</span></span>' +
          '</div></div>');
      }

      out.push('</div>');
    }

    out.push('</div></div>');
    st.content.innerHTML = out.join("");
  }

  var definitions = {
    quiz: { title: "Quick Quiz & Daily Challenge", render: renderView },
    drill: { title: "Chapter Active Recall Drill", render: renderView }
  };
  window.EC.register("quiz", definitions.quiz);
  window.EC.register("drill", definitions.drill);
})();
