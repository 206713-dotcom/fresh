/* EcBiz compare view — Advantages / Disadvantages / Purpose notes + Flashcard Deck (plain ES5, no build). */
(function () {
  "use strict";
  if (!window.EC) return;
  var EC = window.EC;

  var SECTIONS = ["1", "2", "3", "4", "5", "6"];
  var LABELS = {
    "1": "Understanding business activity",
    "2": "People in business",
    "3": "Marketing",
    "4": "Operations management",
    "5": "Financial information and decisions",
    "6": "External influences on business activity"
  };
  var state = {
    section: "1", query: "", topic: "all",
    mode: "notes", cardIndex: 0, flipped: false, hint: false
  };

  /* Presentation class strings, copied verbatim from the source component. */
  var CLS = {
    eyebrow: "text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171] mb-1",
    modeBar: "flex gap-2 mb-4",
    modeBase: "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ",
    modeOn: "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs font-bold",
    modeOff: "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800",
    sectionBar: "flex flex-wrap gap-2 mb-4",
    sectionBase: "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ",
    sectionOn: "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs font-bold",
    sectionOff: "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#44403C] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800",
    label: "text-sm font-semibold text-[#0F2042] dark:text-neutral-200 mb-5",
    filters: "flex flex-col sm:flex-row gap-2 mb-5",
    search: "flex-1 px-3.5 py-2 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-[#1C1917] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]",
    select: "px-3.5 py-2 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-[#1C1917] dark:text-white cursor-pointer",
    count: "text-xs text-[#78716C] dark:text-neutral-500 mb-4",
    groups: "space-y-8",
    group: "space-y-4",
    groupHeading: "border-b border-[#E7E5E4] dark:border-neutral-800 pb-2",
    groupTitle: "font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white",
    summary: "rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xs",
    summaryToggle: "cursor-pointer px-4 py-2.5 text-xs font-semibold text-[#0F2042] dark:text-white hover:text-blue-600 dark:hover:text-sky-300",
    summaryList: "px-4 pb-3.5 space-y-1.5",
    summaryItem: "flex gap-2 text-xs leading-relaxed text-[#44403C] dark:text-neutral-300",
    summaryDot: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F2042] dark:bg-white",
    cards: "space-y-5",
    card: "rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs overflow-hidden",
    cardHeader: "px-5 py-3.5 border-b border-[#E7E5E4] dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 bg-[#FAF9F6] dark:bg-neutral-900/60",
    cardHeaderInner: "flex items-center gap-2.5",
    topicBadge: "text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#0F2042] text-white dark:bg-white dark:text-black",
    cardTitle: "font-academic-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white",
    cardBody: "p-5",
    blocks: "space-y-4",
    blockList: "space-y-2.5",
    blockItem: "flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200",
    blockText: "flex-1 min-w-0",
    uses: "border-t border-[#E7E5E4] dark:border-neutral-800 bg-[#F8F7F4] dark:bg-neutral-900",
    usesToggle: "cursor-pointer px-5 py-3 text-sm font-semibold text-[#0F2042] dark:text-white hover:text-blue-600 dark:hover:text-sky-300",
    usesBody: "px-5 pb-4",
    usesList: "space-y-2",
    usesItem: "flex items-start gap-2 text-sm leading-relaxed text-[#44403C] dark:text-neutral-300",
    usesDot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600",
    empty: "p-8 rounded-2xl border border-dashed border-slate-300 dark:border-neutral-700 text-center",
    emptyText: "text-sm text-[#57534E] dark:text-neutral-400",
    emptyClear: "mt-2 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer",
    bold: "font-semibold text-[#0F2042] dark:text-white"
  };

  var BLOCKS = [
    {
      section: "rounded-xl border border-sky-200 dark:border-sky-900/70 bg-sky-50/70 dark:bg-sky-950/20 p-4 sm:p-5",
      head: "flex items-center justify-between mb-3 border-b border-sky-200/60 dark:border-sky-900/60 pb-2",
      title: "text-sm font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2",
      count: "text-[10px] font-mono text-sky-700 dark:text-sky-400 font-semibold",
      dot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-400",
      icon: "🎯",
      label: "Purpose of"
    },
    {
      section: "rounded-xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/70 dark:bg-emerald-950/20 p-4 sm:p-5",
      head: "flex items-center justify-between mb-3 border-b border-emerald-200/60 dark:border-emerald-900/60 pb-2",
      title: "text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2",
      count: "text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold",
      dot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400",
      icon: "✅",
      label: "Advantages of"
    },
    {
      section: "rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/20 p-4 sm:p-5",
      head: "flex items-center justify-between mb-3 border-b border-rose-200/60 dark:border-rose-900/60 pb-2",
      title: "text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2",
      count: "text-[10px] font-mono text-rose-700 dark:text-rose-400 font-semibold",
      dot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400",
      icon: "⚠️",
      label: "Disadvantages of"
    }
  ];

  /* ------------------------------------------------------------------ *
   * Flashcard Deck: recall ratings, split cards and presentation strings.
   * All class strings and copy below are copied verbatim from
   * CompareNotesView.tsx (the original source of truth).
   * ------------------------------------------------------------------ */
  var RECALL_KEY = "recall_ratings"; /* EC.store prefixes with ecbiz_ */
  var RECALL_COLUMNS = [
    { id: "easy", label: "Easy", hint: "I can recall this", head: "bg-emerald-700 text-white", cell: "bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "medium", label: "Medium", hint: "I remember some of it", head: "bg-amber-600 text-white", cell: "bg-amber-50 dark:bg-amber-950/30" },
    { id: "hard", label: "Hard", hint: "I need to revise this", head: "bg-rose-700 text-white", cell: "bg-rose-50 dark:bg-rose-950/30" }
  ];
  var THEMES = {
    purpose: {
      badge: "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800",
      border: "border-sky-300 dark:border-sky-800",
      bg: "bg-sky-50/70 dark:bg-sky-950/25",
      text: "text-sky-900 dark:text-sky-300",
      dot: "bg-sky-600 dark:bg-sky-400"
    },
    advantages: {
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
      border: "border-emerald-300 dark:border-emerald-800",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/25",
      text: "text-emerald-900 dark:text-emerald-300",
      dot: "bg-emerald-600 dark:bg-emerald-400"
    },
    disadvantages: {
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
      border: "border-rose-300 dark:border-rose-800",
      bg: "bg-rose-50/70 dark:bg-rose-950/25",
      text: "text-rose-900 dark:text-rose-300",
      dot: "bg-rose-600 dark:bg-rose-400"
    }
  };
  var PROMPTS = {
    purpose: "What is the core role, definition, or primary objective of this term in business?",
    advantages: "What are the key benefits, strategic upsides, or cost advantages?",
    disadvantages: "What are the main drawbacks, operational limitations, or financial risks?"
  };
  var F = {
    topBar: "flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-3",
    navGroup: "flex items-center gap-2",
    navBtn: "px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer shadow-2xs",
    counter: "font-mono font-bold text-[#0F2042] dark:text-white px-1",
    topicPill: "font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 font-bold text-[#0F2042] dark:text-[#38BDF8]",
    kindBadge: "text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ",
    shell: "w-full text-left rounded-3xl border transition-all shadow-sm min-h-[320px] p-6 sm:p-8 flex flex-col justify-between",
    shellUnflipped: "border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-[#0F2042] dark:hover:border-[#38BDF8] cursor-pointer",
    frontTop: "flex items-center justify-between gap-2 mb-2",
    recallBadge: "text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8B1E1E] text-white",
    frontTopic: "text-[10px] font-mono font-semibold text-[#78716C] dark:text-neutral-400",
    frontCenter: "flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8",
    frontName: "text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1",
    frontTitle: "font-academic-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2042] dark:text-white mt-1 mb-3",
    frontPrompt: "text-xs sm:text-sm text-[#78716C] dark:text-neutral-400 max-w-md leading-relaxed",
    clueBox: "mt-4 p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-left max-w-md w-full shadow-2xs",
    clueHead: "flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 mb-1",
    clueText: "text-xs text-amber-950 dark:text-amber-100 font-medium leading-relaxed",
    clueCount: "text-[10px] text-amber-800 dark:text-amber-300 mt-1",
    frontBottom: "pt-3 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between gap-3",
    hintBtn: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-xs font-mono font-bold text-amber-900 dark:text-amber-200 transition-colors shadow-2xs cursor-pointer",
    flipHint: "text-[11px] font-mono text-[#78716C] dark:text-neutral-500",
    backWrap: "space-y-4",
    backHead: "flex items-start justify-between gap-3 border-b pb-3 border-slate-100 dark:border-neutral-900",
    backBadgeRow: "flex items-center gap-2 mb-1",
    backTopic: "text-[10px] font-mono text-[#78716C] dark:text-neutral-400",
    backTitle: "font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white",
    flipBackBtn: "shrink-0 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer shadow-2xs",
    answerBox: "p-4 sm:p-5 rounded-2xl border ",
    answerHead: "flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/10 pb-2",
    answerTitle: "text-sm font-bold ",
    answerCount: "text-[10px] font-mono opacity-80",
    answerList: "space-y-2.5",
    answerItem: "flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200",
    answerDot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full ",
    rateWrap: "mt-4",
    ratePrompt: "text-sm font-medium text-[#0F2042] dark:text-neutral-200 mb-2",
    rateGrid: "grid grid-cols-3 gap-2 sm:gap-3",
    rateBtn: "px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs text-center ",
    rateLabel: "font-bold",
    rateHint: "block text-[10px] font-normal opacity-90 mt-0.5",
    tableWrap: "mt-8 overflow-x-auto max-w-2xl mx-auto",
    tableHeadRow: "flex items-center justify-between mb-2",
    tableTitle: "font-academic-serif text-base font-bold text-[#0F2042] dark:text-white",
    tableMeta: "text-xs font-mono text-[#78716C] dark:text-neutral-400",
    table: "w-full border-collapse text-sm rounded-xl overflow-hidden border border-[#E7E5E4] dark:border-neutral-800",
    th: "px-3.5 py-2.5 text-left font-semibold ",
    thInner: "flex items-center justify-between",
    thCount: "text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white font-bold",
    tr: "align-top",
    td: "px-3.5 py-3 border border-[#E7E5E4] dark:border-neutral-800 ",
    none: "text-xs text-[#78716C] dark:text-neutral-500 italic",
    cardList: "space-y-1.5",
    cardLink: "text-left text-xs font-medium text-[#0F2042] dark:text-white hover:underline cursor-pointer block leading-snug"
  };

  var flipOnEnter = null;
  var enterBound = false;

  function isSection(v) {
    return v === "1" || v === "2" || v === "3" || v === "4" || v === "5" || v === "6";
  }

  function displayName(name) {
    var s = String(name == null ? "" : name);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* Render **bold** markers as <strong>, escaping every text fragment. */
  function rich(text) {
    var parts = String(text == null ? "" : text).split(/(\*\*[^*]+\*\*)/g);
    var out = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.length > 4 && p.slice(0, 2) === "**" && p.slice(-2) === "**") {
        out += '<strong class="' + CLS.bold + '">' + EC.esc(p.slice(2, -2)) + "</strong>";
      } else {
        out += EC.esc(p);
      }
    }
    return out;
  }

  /** Return roughly the first quarter of the words in an answer point. */
  function firstQuarterHint(text) {
    var plain = String(text == null ? "" : text).replace(/\*\*/g, "").trim();
    if (!plain) return "";
    var words = plain.split(/\s+/);
    var count = Math.max(1, Math.ceil(words.length * 0.25));
    return words.slice(0, count).join(" ");
  }

  function loadRatings() {
    var parsed = EC.store.get(RECALL_KEY, {});
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  }

  /**
   * Deconstruct each topic note into 3 focused flashcards:
   * Purpose, Advantages and Disadvantages (3 cards per note).
   */
  function buildSplitFlashcards(notes) {
    var cards = [];
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var title = displayName(note.name);
      var defs = [
        { kind: "purpose", suffix: "purpose", label: "Purpose", prefix: "Purpose of", items: note.purpose },
        { kind: "advantages", suffix: "advantages", label: "Advantages", prefix: "Advantages of", items: note.advantages },
        { kind: "disadvantages", suffix: "disadvantages", label: "Disadvantages", prefix: "Disadvantages of", items: note.disadvantages }
      ];
      for (var d = 0; d < defs.length; d++) {
        var def = defs[d];
        cards.push({
          id: note.id + "-" + def.suffix,
          noteId: note.id,
          section: note.section,
          topic: note.topic,
          name: note.name,
          kind: def.kind,
          questionTitle: def.prefix + " " + title,
          kindLabel: def.label,
          theme: THEMES[def.kind],
          items: def.items || []
        });
      }
    }
    return cards;
  }

  function blockHtml(cfg, title, items) {
    var list = items || [];
    var html = '<section class="' + cfg.section + '">' +
      '<div class="' + cfg.head + '">' +
        '<h4 class="' + cfg.title + '"><span>' + EC.esc(cfg.icon) + "</span>" +
        "<span>" + EC.esc(cfg.label) + " " + EC.esc(title) + "</span></h4>" +
        '<span class="' + cfg.count + '">' + list.length + " " +
        (list.length === 1 ? "point" : "points") + "</span>" +
      "</div>" +
      '<ul class="' + CLS.blockList + '">';
    for (var i = 0; i < list.length; i++) {
      html += '<li class="' + CLS.blockItem + '">' +
        '<span class="' + cfg.dot + '"></span>' +
        '<div class="' + CLS.blockText + '">' + rich(list[i]) + "</div></li>";
    }
    return html + "</ul></section>";
  }

  function cardHtml(note) {
    var title = displayName(note.name);
    var html = '<article class="' + CLS.card + '">' +
      '<header class="' + CLS.cardHeader + '">' +
        '<div class="' + CLS.cardHeaderInner + '">' +
          '<span class="' + CLS.topicBadge + '">Topic ' + EC.esc(note.topic) + "</span>" +
          '<h3 class="' + CLS.cardTitle + '">' + EC.esc(title) + "</h3>" +
        "</div>" +
      "</header>" +
      '<div class="' + CLS.cardBody + '"><div class="' + CLS.blocks + '">' +
        blockHtml(BLOCKS[0], title, note.purpose) +
        blockHtml(BLOCKS[1], title, note.advantages) +
        blockHtml(BLOCKS[2], title, note.disadvantages) +
      "</div></div>";
    if (note.uses && note.uses.length) {
      html += '<details class="' + CLS.uses + '">' +
        '<summary class="' + CLS.usesToggle + '">How to recommend and justify ' +
          EC.esc(title) + " (Exam Technique)</summary>" +
        '<div class="' + CLS.usesBody + '"><ul class="' + CLS.usesList + '">';
      for (var i = 0; i < note.uses.length; i++) {
        html += '<li class="' + CLS.usesItem + '">' +
          '<span class="' + CLS.usesDot + '"></span>' +
          '<div class="' + CLS.blockText + '">' + rich(note.uses[i]) + "</div></li>";
      }
      html += "</ul></div></details>";
    }
    return html + "</article>";
  }

  function groupHtml(topicCode, list, summary) {
    var heading = "Topic " + EC.esc(topicCode) +
      (summary && summary.title ? ": " + EC.esc(summary.title) : "");
    var html = '<section class="' + CLS.group + '">' +
      '<div class="' + CLS.groupHeading + '">' +
        '<h2 class="' + CLS.groupTitle + '">' + heading + "</h2>" +
      "</div>";
    if (summary && summary.points && summary.points.length) {
      html += '<details class="' + CLS.summary + '">' +
        '<summary class="' + CLS.summaryToggle + '">Topic ' + EC.esc(topicCode) +
          " Syllabus Summary Overview</summary>" +
        '<ul class="' + CLS.summaryList + '">';
      for (var p = 0; p < summary.points.length; p++) {
        html += '<li class="' + CLS.summaryItem + '">' +
          '<span class="' + CLS.summaryDot + '"></span>' +
          "<span>" + EC.esc(summary.points[p]) + "</span></li>";
      }
      html += "</ul></details>";
    }
    html += '<div class="' + CLS.cards + '">';
    for (var i = 0; i < list.length; i++) html += cardHtml(list[i]);
    return html + "</div></section>";
  }

  function haystack(note) {
    var parts = [note.name, note.topic];
    var keys = ["purpose", "advantages", "disadvantages", "uses"];
    for (var k = 0; k < keys.length; k++) {
      var arr = note[keys[k]] || [];
      for (var i = 0; i < arr.length; i++) parts.push(arr[i]);
    }
    return parts.join(" ").toLowerCase();
  }

  function sectionButtonClass(code) {
    return CLS.sectionBase + (code === state.section ? CLS.sectionOn : CLS.sectionOff);
  }

  function modeButtonClass(active) {
    return CLS.modeBase + (active ? CLS.modeOn : CLS.modeOff);
  }

  function build(main, notes, summaries) {
    function filterSection() {
      var out = [];
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].section === state.section) out.push(notes[i]);
      }
      return out;
    }
    var sectionNotes = filterSection();
    var summaryMap = {};
    for (var s = 0; s < summaries.length; s++) {
      summaryMap[summaries[s].section + "|" + summaries[s].topic] = summaries[s];
    }

    var ratings = loadRatings();
    var cards = buildSplitFlashcards(sectionNotes);

    var sectionButtons = "";
    for (var b = 0; b < SECTIONS.length; b++) {
      sectionButtons += '<button type="button" class="' + sectionButtonClass(SECTIONS[b]) +
        '" data-section="' + SECTIONS[b] + '">Section ' + SECTIONS[b] + "</button>";
    }

    main.innerHTML = '<div class="study-page">' +
      '<div class="study-page-heading"><div>' +
        '<p class="' + CLS.eyebrow + '">Cambridge 0264 Revision</p>' +
        '<h1 class="study-title">Advantages, Disadvantages, and Purpose</h1>' +
        '<p class="study-description">Follow the Cambridge 0264 syllabus specification. ' +
          "In Notes mode, review the full untruncated purpose, advantages, and disadvantages for each syllabus topic. " +
          "In Flashcards mode, practice single-concept recall (Purpose, Advantages, and Disadvantages split individually) with prompt clues and self-assessment tracking.</p>" +
      "</div></div>" +
      '<div class="' + CLS.modeBar + '">' +
        '<button type="button" class="' + CLS.modeBase + CLS.modeOn +
          '" data-cmp="fullnotes">' + EC.esc("📖 Full Notes") + "</button>" +
        '<button type="button" class="' + CLS.modeBase + CLS.modeOff +
          '" data-cmp="flashcards">' + EC.esc("🎴 Flashcard Deck") + "</button>" +
      "</div>" +
      '<div class="' + CLS.sectionBar + '" data-cmp="sections">' + sectionButtons + "</div>" +
      '<p class="' + CLS.label + '" data-cmp="label">Section ' + state.section + ": " +
        EC.esc(LABELS[state.section] || "") + "</p>" +
      '<div data-cmp="body"></div>' +
    "</div>";

    var root = main.querySelector(".study-page");
    var fullNotesBtn = root.querySelector('[data-cmp="fullnotes"]');
    var flashcardsBtn = root.querySelector('[data-cmp="flashcards"]');
    var sectionBar = root.querySelector('[data-cmp="sections"]');
    var label = root.querySelector('[data-cmp="label"]');
    var body = root.querySelector('[data-cmp="body"]');
    var secBtns = sectionBar.querySelectorAll("button[data-section]");

    /* ---------------------------- Notes mode --------------------------- */
    function paint() {
      var results = body.querySelector('[data-cmp="results"]');
      if (!results) return;
      var q = state.query.trim().toLowerCase();
      var visible = [];
      for (var j = 0; j < sectionNotes.length; j++) {
        var note = sectionNotes[j];
        if (state.topic !== "all" && note.topic !== state.topic) continue;
        if (q && haystack(note).indexOf(q) === -1) continue;
        visible.push(note);
      }

      var html = '<p class="' + CLS.count + '">' + visible.length + " " +
        (visible.length === 1 ? "entry" : "entries") + " in Section " + state.section + "</p>";
      if (visible.length === 0) {
        var what = state.query ? "“" + EC.esc(state.query) + "”" : "these filters";
        html += '<div class="' + CLS.empty + '"><p class="' + CLS.emptyText + '">No notes match ' +
          what + " in Section " + state.section + '.</p>' +
          '<button type="button" class="' + CLS.emptyClear + '" data-cmp="clear">' +
          "Clear search filters</button></div>";
      } else {
        var map = {}, order = [];
        for (var v = 0; v < visible.length; v++) {
          var item = visible[v];
          if (!map[item.topic]) { map[item.topic] = []; order.push(item.topic); }
          map[item.topic].push(item);
        }
        html += '<div class="' + CLS.groups + '">';
        for (var g = 0; g < order.length; g++) {
          html += groupHtml(order[g], map[order[g]], summaryMap[state.section + "|" + order[g]]);
        }
        html += "</div>";
      }
      results.innerHTML = html;

      var clear = results.querySelector('[data-cmp="clear"]');
      if (clear) {
        clear.addEventListener("click", function () {
          state.query = ""; state.topic = "all";
          var s = body.querySelector('[data-cmp="search"]');
          var t = body.querySelector('[data-cmp="topic"]');
          if (s) s.value = "";
          if (t) t.value = "all";
          paint();
        });
      }
    }

    function renderNotes() {
      var seen = {}, topics = [];
      for (var j = 0; j < sectionNotes.length; j++) {
        var t = sectionNotes[j].topic;
        if (!seen[t]) { seen[t] = true; topics.push(t); }
      }
      var options = '<option value="all">All topics in Section ' + state.section + "</option>";
      for (var k = 0; k < topics.length; k++) {
        options += '<option value="' + EC.esc(topics[k]) + '">Topic ' + EC.esc(topics[k]) + "</option>";
      }
      body.innerHTML = '<div class="' + CLS.filters + '">' +
        '<input class="' + CLS.search + '" type="search" data-cmp="search" aria-label="Search notes" ' +
          'placeholder="Search a concept, method, or key term..." value="' + EC.esc(state.query) + '">' +
        '<select class="' + CLS.select + '" data-cmp="topic" aria-label="Filter by topic">' + options + "</select>" +
      "</div>" +
      '<div data-cmp="results"></div>';

      var search = body.querySelector('[data-cmp="search"]');
      var topicSel = body.querySelector('[data-cmp="topic"]');
      var valid = state.topic === "all" || topics.indexOf(state.topic) !== -1;
      topicSel.value = valid ? state.topic : "all";
      state.topic = topicSel.value;

      search.addEventListener("input", function () {
        state.query = this.value;
        paint();
      });
      topicSel.addEventListener("change", function () {
        state.topic = this.value;
        paint();
      });
      paint();
    }

    /* -------------------------- Flashcard mode ------------------------- */
    function cardTopHtml(card) {
      return '<div class="' + F.topBar + '">' +
        '<div class="' + F.navGroup + '">' +
          '<button type="button" data-cmp="prev" class="' + F.navBtn + '">← Prev</button>' +
          '<span class="' + F.counter + '">Card ' + (state.cardIndex + 1) + " of " + cards.length + "</span>" +
          '<button type="button" data-cmp="next" class="' + F.navBtn + '">Next →</button>' +
        "</div>" +
        '<div class="' + F.navGroup + '">' +
          '<span class="' + F.topicPill + '">Topic ' + EC.esc(card.topic) + "</span>" +
          '<span class="' + F.kindBadge + card.theme.badge + '">' + EC.esc(card.kindLabel) + "</span>" +
        "</div>" +
      "</div>";
    }

    function cardShellHtml(card) {
      var theme = card.theme;
      var shellClass = F.shell + " " + (state.flipped
        ? theme.border + " bg-white dark:bg-neutral-950"
        : F.shellUnflipped);
      var html = '<div data-cmp="shell" class="' + shellClass + '">';
      if (!state.flipped) {
        var clue = "";
        if (state.hint) {
          var first = card.items.length ? firstQuarterHint(card.items[0]) : "";
          clue = '<div class="' + F.clueBox + '">' +
            '<div class="' + F.clueHead + '"><span>💡</span><span>First Point Clue</span></div>' +
            '<p class="' + F.clueText + '">Starts with: &ldquo;' + EC.esc(first) + '…&rdquo;</p>' +
            '<p class="' + F.clueCount + '">(' + card.items.length + " total points on back of card)</p>" +
          "</div>";
        }
        html += '<div class="' + F.frontTop + '">' +
            '<span class="' + F.recallBadge + '">Recall This Term</span>' +
            '<span class="' + F.frontTopic + '">Topic ' + EC.esc(card.topic) + "</span>" +
          "</div>" +
          '<div class="' + F.frontCenter + '">' +
            '<span class="' + F.frontName + '">' + EC.esc(card.name) + "</span>" +
            '<h2 class="' + F.frontTitle + '">' + EC.esc(card.questionTitle) + "</h2>" +
            '<p class="' + F.frontPrompt + '">' + EC.esc(PROMPTS[card.kind]) + "</p>" +
            clue +
          "</div>" +
          '<div class="' + F.frontBottom + '">' +
            '<button type="button" data-cmp="hint" class="' + F.hintBtn +
              '" title="Reveal a clue before flipping"><span>💡</span><span>' +
              (state.hint ? "Hide Hint" : "Hint") + "</span></button>" +
            '<span class="' + F.flipHint + '">Tap anywhere on card to flip ↵</span>' +
          "</div>";
      } else {
        html += '<div class="' + F.backWrap + '">' +
          '<div class="' + F.backHead + '">' +
            "<div>" +
              '<div class="' + F.backBadgeRow + '">' +
                '<span class="' + F.kindBadge + theme.badge + '">' + EC.esc(card.kindLabel) + "</span>" +
                '<span class="' + F.backTopic + '">Topic ' + EC.esc(card.topic) + "</span>" +
              "</div>" +
              '<h2 class="' + F.backTitle + '">' + EC.esc(card.questionTitle) + "</h2>" +
            "</div>" +
            '<button type="button" data-cmp="flipback" class="' + F.flipBackBtn +
              '">Flip back</button>' +
          "</div>" +
          '<div class="' + F.answerBox + theme.border + " " + theme.bg + '">' +
            '<div class="' + F.answerHead + '">' +
              '<h3 class="' + F.answerTitle + theme.text + '">Key ' + EC.esc(card.kindLabel) + " Points</h3>" +
              '<span class="' + F.answerCount + '">' + card.items.length + " " +
                (card.items.length === 1 ? "point" : "points") + "</span>" +
            "</div>" +
            '<ul class="' + F.answerList + '">';
        for (var i = 0; i < card.items.length; i++) {
          html += '<li class="' + F.answerItem + '">' +
            '<span class="' + F.answerDot + theme.dot + '"></span>' +
            '<div class="' + CLS.blockText + '">' + rich(card.items[i]) + "</div>" +
          "</li>";
        }
        html += "</ul></div></div>";
      }
      return html + "</div>";
    }

    function rateHtml(card) {
      var prompt = state.flipped
        ? "How well did you remember " + card.questionTitle + "?"
        : "Turn the card over, then rate how well you remembered it:";
      var html = '<div class="' + F.rateWrap + '">' +
        '<p class="' + F.ratePrompt + '">' + EC.esc(prompt) + "</p>" +
        '<div class="' + F.rateGrid + '">';
      for (var c = 0; c < RECALL_COLUMNS.length; c++) {
        var col = RECALL_COLUMNS[c];
        html += '<button type="button" data-cmp="rate" data-rating="' + col.id + '"' +
          (state.flipped ? "" : " disabled") +
          ' class="' + F.rateBtn + col.head + '">' +
          '<div class="' + F.rateLabel + '">' + EC.esc(col.label) + "</div>" +
          '<span class="' + F.rateHint + '">' + EC.esc(col.hint) + "</span>" +
        "</button>";
      }
      return html + "</div></div>";
    }

    function progressHtml() {
      var html = '<div class="' + F.tableWrap + '">' +
        '<div class="' + F.tableHeadRow + '">' +
          '<h3 class="' + F.tableTitle + '">Your Revision Progress</h3>' +
          '<span class="' + F.tableMeta + '">Section ' + state.section + " · " + cards.length +
            " Total Flashcards</span>" +
        "</div>" +
        '<table class="' + F.table + '"><thead><tr>';
      for (var c = 0; c < RECALL_COLUMNS.length; c++) {
        var col = RECALL_COLUMNS[c];
        var count = 0;
        for (var i = 0; i < cards.length; i++) if (ratings[cards[i].id] === col.id) count++;
        html += '<th class="' + F.th + col.head + '">' +
          '<div class="' + F.thInner + '"><span>' + EC.esc(col.label) + "</span>" +
          '<span class="' + F.thCount + '">' + count + "</span></div></th>";
      }
      html += '</tr></thead><tbody><tr class="' + F.tr + '">';
      for (var c2 = 0; c2 < RECALL_COLUMNS.length; c2++) {
        var col2 = RECALL_COLUMNS[c2];
        html += '<td class="' + F.td + col2.cell + '">';
        var matching = [];
        for (var j = 0; j < cards.length; j++) {
          if (ratings[cards[j].id] === col2.id) matching.push(cards[j]);
        }
        if (matching.length === 0) {
          html += '<p class="' + F.none + '">None yet</p>';
        } else {
          html += '<ul class="' + F.cardList + '">';
          for (var m = 0; m < matching.length; m++) {
            html += '<li><button type="button" data-cmp="opencard" data-card="' +
              EC.esc(matching[m].id) + '" class="' + F.cardLink + '">' +
              EC.esc(matching[m].questionTitle) + "</button></li>";
          }
          html += "</ul>";
        }
        html += "</td>";
      }
      return html + "</tr></tbody></table></div>";
    }

    function renderCards() {
      if (!cards.length) {
        body.innerHTML = '<div class="' + CLS.empty + '"><p class="' + CLS.emptyText +
          '">No flashcards available in Section ' + state.section + ".</p></div>";
        return;
      }
      if (state.cardIndex < 0 || state.cardIndex >= cards.length) state.cardIndex = 0;
      var card = cards[state.cardIndex];
      body.innerHTML = "<div>" +
        '<div class="max-w-2xl mx-auto">' +
          cardTopHtml(card) + cardShellHtml(card) + rateHtml(card) +
        "</div>" +
        progressHtml() +
      "</div>";

      var shell = body.querySelector('[data-cmp="shell"]');
      if (shell) {
        shell.addEventListener("click", function () {
          if (!state.flipped) { state.flipped = true; renderCards(); }
        });
      }
      var hint = body.querySelector('[data-cmp="hint"]');
      if (hint) {
        hint.addEventListener("click", function (e) {
          if (e && e.stopPropagation) e.stopPropagation();
          state.hint = !state.hint;
          renderCards();
        });
      }
      var back = body.querySelector('[data-cmp="flipback"]');
      if (back) {
        back.addEventListener("click", function () {
          state.flipped = false; state.hint = false; renderCards();
        });
      }
      var prev = body.querySelector('[data-cmp="prev"]');
      if (prev) {
        prev.addEventListener("click", function () {
          state.cardIndex = state.cardIndex > 0 ? state.cardIndex - 1 : cards.length - 1;
          state.flipped = false; state.hint = false; renderCards();
        });
      }
      var next = body.querySelector('[data-cmp="next"]');
      if (next) {
        next.addEventListener("click", function () {
          state.cardIndex = (state.cardIndex + 1) % cards.length;
          state.flipped = false; state.hint = false; renderCards();
        });
      }
      var rateBtns = body.querySelectorAll('[data-cmp="rate"]');
      for (var r = 0; r < rateBtns.length; r++) {
        (function (btn) {
          btn.addEventListener("click", function () {
            if (!state.flipped) return;
            var level = btn.getAttribute("data-rating");
            ratings[card.id] = level;
            EC.store.set(RECALL_KEY, ratings);
            state.flipped = false; state.hint = false;
            state.cardIndex = (state.cardIndex + 1) % Math.max(cards.length, 1);
            renderCards();
          });
        })(rateBtns[r]);
      }
      var links = body.querySelectorAll('[data-cmp="opencard"]');
      for (var o = 0; o < links.length; o++) {
        (function (link) {
          link.addEventListener("click", function () {
            var id = link.getAttribute("data-card");
            for (var p = 0; p < cards.length; p++) {
              if (cards[p].id === id) {
                state.cardIndex = p;
                state.flipped = true; state.hint = false;
                renderCards();
                return;
              }
            }
          });
        })(links[o]);
      }
    }

    flipOnEnter = function (e) {
      if (state.mode !== "cards" || state.flipped) return;
      if (!e || e.key !== "Enter") return;
      var t = e.target;
      if (t && t.tagName && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(String(t.tagName).toUpperCase())) return;
      state.flipped = true;
      renderCards();
    };

    function renderBody() {
      if (state.mode === "cards") renderCards();
      else renderNotes();
    }
    function paintModeButtons() {
      fullNotesBtn.className = modeButtonClass(state.mode === "notes");
      flashcardsBtn.className = modeButtonClass(state.mode === "cards");
    }

    /* -------------------------- Static controls ------------------------ */
    for (var c = 0; c < secBtns.length; c++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var code = btn.getAttribute("data-section");
          if (!isSection(code) || code === state.section) return;
          state.section = code;
          state.topic = "all";
          state.cardIndex = 0;
          state.flipped = false;
          state.hint = false;
          sectionNotes = filterSection();
          cards = buildSplitFlashcards(sectionNotes);
          history.replaceState(null, "", location.pathname + "?open=compare&section=" + code);
          for (var j = 0; j < secBtns.length; j++) {
            secBtns[j].className = sectionButtonClass(SECTIONS[j]);
          }
          label.textContent = "Section " + code + ": " + (LABELS[code] || "");
          renderBody();
        });
      })(secBtns[c]);
    }

    fullNotesBtn.addEventListener("click", function () {
      state.mode = "notes";
      paintModeButtons();
      renderBody();
    });
    flashcardsBtn.addEventListener("click", function () {
      state.mode = "cards";
      paintModeButtons();
      renderBody();
    });

    paintModeButtons();
    renderBody();
  }

  if (typeof document !== "undefined" && !enterBound) {
    enterBound = true;
    document.addEventListener("keydown", function (e) {
      if (flipOnEnter) flipOnEnter(e);
    });
  }

  window.EC.register("compare", {
    title: "Advantages, Disadvantages, and Purpose",
    render: function (main, params, name) {
      var requested = params && typeof params.get === "function" ? params.get("section") : null;
      state.section = isSection(requested) ? requested : "1";
      state.topic = "all";
      state.mode = "notes";
      state.cardIndex = 0;
      state.flipped = false;
      state.hint = false;

      return EC.load("compare-notes-static").then(function (notes) {
        return EC.load("revision-summaries").then(
          function (summaries) { return { notes: notes, summaries: summaries }; },
          function () { return { notes: notes, summaries: [] }; }
        );
      }).then(function (data) {
        build(main, data.notes || [], data.summaries || []);
      });
    }
  });
})();
