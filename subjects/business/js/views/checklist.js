/* EcBiz syllabus checklist — plain ES5 browser JavaScript, no build step. */
(function () {
  "use strict";
  if (!window.EC) return;

  var EC = window.EC;
  var RATINGS_KEY = "subpoint_ratings_v2";
  var RATING_OPTIONS = [
    { value: "hard", label: "Hard" },
    { value: "moderate", label: "Moderate" },
    { value: "easy", label: "Easy" }
  ];
  var FILTER_OPTIONS = [
    { value: "all", label: "All points" },
    { value: "unrated", label: "Unrated" },
    { value: "hard", label: "Hard" },
    { value: "moderate", label: "Moderate" },
    { value: "easy", label: "Easy" }
  ];

  /* Labels/metadata mirrored from SectionConceptDiagram.tsx. */
  var SECTION_VISUAL_LABELS = {
    "2": "People & Organisation Visuals",
    "3": "Marketing & Strategy Visuals",
    "4": "Operations & Break-Even Visuals",
    "5": "Finance & Accounts Visuals",
    "6": "Economy & Global Trade Visuals"
  };
  /* Exact titles/subtitles from sectionMeta in SectionConceptDiagram.tsx. */
  var SECTION_VISUAL_META = {
    "2": { title: "Section 2: People in Business Visuals", subtitle: "Maslow's Pyramid, Herzberg's Dual Scale, Tall vs Flat Hierarchy & Delayering", icon: "\uD83D\uDC65" },
    "3": { title: "Section 3: Marketing & Strategy Visuals", subtitle: "Product Life Cycle, Extension Strategies, 4Ps Alignment & Boston Matrix", icon: "\uD83D\uDCE3" },
    "4": { title: "Section 4: Operations Management Visuals", subtitle: "Interactive Break-Even Simulator, Margin of Safety & Production Methods", icon: "\uD83C\uDFED" },
    "5": { title: "Section 5: Finance & Accounts Visuals", subtitle: "Short vs Long-Term Sources of Finance, Gearing & Working Capital", icon: "\uD83D\uDCB9" },
    "6": { title: "Section 6: External Influences Visuals", subtitle: "Business Cycle Wave, SPICED vs WPIDEC Exchange Rates & Economic Policies", icon: "\uD83C\uDF0D" }
  };
  /* Sub-tabs from sectionMeta in SectionConceptDiagram.tsx. */
  var SECTION_TABS = {
    "2": [
      { id: "maslow", label: "\uD83D\uDD3A Maslow Pyramid" },
      { id: "herzberg", label: "\u2696\uFE0F Herzberg Two-Factor" },
      { id: "org", label: "\uD83C\uDFE2 Org Hierarchy & Delayering" }
    ],
    "3": [{ id: "plc", label: "\uD83D\uDCC8 Product Life Cycle & Extension" }],
    "4": [{ id: "breakeven", label: "\uD83E\uDDEE Break-Even Simulator" }],
    "5": [{ id: "sources", label: "\uD83D\uDCB0 Sources of Finance Matrix" }],
    "6": [{ id: "cycle", label: "\u3030\uFE0F Business Cycle & SPICED" }]
  };

  /* Core 1.1 — exact FACTORS_DATA from FactorsOfProductionDiagram.tsx (data 24-105). */
  var FACTOR_ORDER = ["land", "labour", "capital", "enterprise"];
  var FACTORS_DATA = {
    land: {
      title: "Land",
      reward: "Rent",
      icon: "\uD83C\uDFDE\uFE0F",
      tagline: "Natural Resources provided by Earth",
      definition: "All natural resources and gifts of nature available for production without human intervention.",
      examples: [
        "Agricultural land and forests",
        "Mineral deposits (iron ore, bauxite, lithium, crude oil)",
        "Water bodies (rivers, oceans for fishing and shipping)",
        "Climate and solar/wind energy sites"
      ],
      rewardExplanation: "Rent is the financial payment made to landowners or resource proprietors for the productive use of natural resources and commercial land plots.",
      examTip: "CIE Warning: In Business Studies, 'Land' is NOT just soil. It includes underground minerals, oceans, and natural atmospheric resources. Capital goods (like tractors or irrigation pipes) are NOT land—they are capital!"
    },
    labour: {
      title: "Labour",
      reward: "Wages & Salaries",
      icon: "\uD83D\uDC77",
      tagline: "Human Physical and Mental Productive Effort",
      definition: "The human intellectual, physical, and technical effort exerted in the manufacturing of goods and delivery of services.",
      examples: [
        "Skilled professionals (surgeons, civil engineers, corporate accountants)",
        "Manual and assembly workers (factory machinists, carpenters, bricklayers)",
        "Service personnel (teachers, pilots, delivery drivers, nurses)",
        "Software engineers and creative designers"
      ],
      rewardExplanation: "Wages (time-rate, piece-rate, or hourly pay) and salaries (fixed monthly compensation) represent the return earned by workers for their productive labor time and human capital.",
      examTip: "Labour is human effort used in production. In a definition, say what the worker does, and name wages as the reward. Do not treat money itself as labour."
    },
    capital: {
      title: "Capital",
      reward: "Interest",
      icon: "\uD83C\uDFED",
      tagline: "Man-Made Goods Used to Produce Other Goods",
      definition: "Man-made physical aids to production used to manufacture finished goods or provide commercial services.",
      examples: [
        "Heavy machinery and automated assembly robots",
        "Commercial delivery fleets (vans, cargo ships, aeroplanes)",
        "Factories, warehouses, and office buildings",
        "Computing servers, telecommunications hardware, and tools"
      ],
      rewardExplanation: "Interest is the financial reward paid to investors or financial institutions for loaning funds used to purchase capital equipment, or the return earned on capital investment capital.",
      examTip: "CIE Warning: MONEY IS NOT A FACTOR OF PRODUCTION. Money facilitates transactions, but money itself cannot produce anything. Capital refers strictly to real physical capital goods (machines, factories, tools)."
    },
    enterprise: {
      title: "Enterprise",
      reward: "Profit",
      icon: "\uD83D\uDE80",
      tagline: "The Catalyst: Risk-Taking, Innovation & Coordination",
      definition: "The special human ability to organize and combine the other three factors of production (Land, Labour, Capital) while bearing the financial risk of business failure.",
      examples: [
        "Entrepreneurs who launch startups and identify market gaps",
        "Corporate innovators introducing new patents and business models",
        "Small business owners who invest personal capital into partnerships or sole proprietorships",
        "Franchisors expanding branded concepts nationwide"
      ],
      rewardExplanation: "Profit is the residual return earned by the entrepreneur after all other costs (Rent for land, Wages for labour, Interest for capital) have been fully paid. It is the reward for successful risk-taking.",
      examTip: "CIE Exam Tip: In Paper 1 (2-mark definitions), always mention both key elements: (1) combining the other 3 factors of production, and (2) taking the financial risk of business failure."
    }
  };

  /* Inline styles for the visual overlays (this plain-JS build has no Tailwind/CSS build step).
   * Utility-style class names from the original React components are also added to the shell
   * for markup parity; the inline styles carry the actual rendering. */
  var VS = {
    overlay: "position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:clamp(.5rem,2vw,1.25rem);overflow-y:auto;",
    panel: "position:relative;background:var(--surface,#FAF9F6);color:var(--surface-text,#16233b);width:100%;max-width:64rem;max-height:92vh;overflow-y:auto;border-radius:1.5rem;box-shadow:0 1.5rem 4rem rgba(0,0,0,.45);margin:auto;border:1px solid rgba(100,116,139,.3);",
    header: "position:sticky;top:0;z-index:20;background:#0F2042;color:#fff;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid rgba(30,58,138,.6);",
    badge: "display:inline-block;font:650 .65rem/1.4 var(--font-mono,monospace);letter-spacing:.07em;text-transform:uppercase;background:#fbbf24;color:#0f172a;border-radius:.35rem;padding:.15rem .5rem;",
    kicker: "font:650 .7rem/1.4 var(--font-mono,monospace);letter-spacing:.06em;text-transform:uppercase;color:#bfdbfe;",
    title: "font:650 clamp(1.1rem,2.4vw,1.5rem)/1.2 var(--font-serif,Georgia,serif);margin:.35rem 0 0;color:#fff;",
    subtitle: "font-size:.82rem;color:#dbeafe;margin:.35rem 0 0;line-height:1.4;",
    close: "background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:.75rem;padding:.5rem;cursor:pointer;line-height:0;",
    body: "padding:1.25rem 1.25rem 1.75rem;display:grid;gap:1.1rem;",
    intro: "background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);border-radius:.85rem;padding:.85rem 1rem;font-size:.85rem;line-height:1.5;",
    card: "background:var(--surface-practice,rgba(255,255,255,.7));border:1px solid rgba(100,116,139,.3);border-radius:.9rem;padding:1rem;",
    cardTitle: "font:650 1rem/1.3 var(--font-serif,Georgia,serif);margin:0 0 .5rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;",
    topicCode: "font:650 .72rem/1 var(--font-mono,monospace);background:#0F2042;color:#fff;border-radius:.35rem;padding:.25rem .4rem;",
    reward: "font:650 .7rem/1.4 var(--font-mono,monospace);letter-spacing:.04em;text-transform:uppercase;background:rgba(245,158,11,.18);color:#92400e;border-radius:.35rem;padding:.15rem .5rem;",
    list: "margin:.5rem 0 0;padding-left:1.25rem;display:grid;gap:.3rem;font-size:.85rem;line-height:1.45;",
    text: "font-size:.85rem;line-height:1.5;margin:.35rem 0;",
    tip: "font-size:.8rem;line-height:1.45;background:rgba(245,158,11,.12);border-left:3px solid #f59e0b;border-radius:.35rem;padding:.55rem .7rem;margin:.6rem 0 0;",
    map: "display:flex;flex-wrap:wrap;gap:.45rem;",
    chip: "font:650 .72rem/1.3 var(--font-mono,monospace);background:rgba(15,32,66,.08);border:1px solid rgba(15,32,66,.18);border-radius:999px;padding:.3rem .65rem;"
  };

  /* Shared style snippets for the restored concept diagrams. */
  var VIS = {
    whiteCard: "background:var(--surface-practice,#fff);border:1px solid rgba(100,116,139,.3);border-radius:1rem;padding:1rem;box-shadow:0 1px 3px rgba(15,23,42,.08);",
    monoLabel: "display:block;font:650 .62rem/1.4 var(--font-mono,monospace);letter-spacing:.06em;text-transform:uppercase;color:#64748b;margin-bottom:.25rem;",
    smallText: "font-size:.78rem;line-height:1.5;color:var(--surface-text,#334155);",
    tinyText: "font-size:.7rem;line-height:1.45;color:#64748b;",
    pill: "border:1px solid rgba(100,116,139,.3);border-radius:.6rem;padding:.45rem .7rem;font:650 .72rem/1 var(--font-mono,monospace);cursor:pointer;background:var(--surface-practice,#fff);color:var(--surface-text,#334155);",
    pillOn: "border:1px solid #0F2042;border-radius:.6rem;padding:.45rem .7rem;font:650 .72rem/1 var(--font-mono,monospace);cursor:pointer;background:#0F2042;color:#fff;box-shadow:0 1px 3px rgba(15,23,42,.2);",
    tagBlue: "font:650 .6rem/1.4 var(--font-mono,monospace);text-transform:uppercase;background:#dbeafe;color:#1e3a8a;border-radius:.3rem;padding:.12rem .45rem;",
    tagGreen: "font:650 .6rem/1.4 var(--font-mono,monospace);text-transform:uppercase;background:#d1fae5;color:#065f46;border-radius:.3rem;padding:.12rem .45rem;",
    tagAmber: "font:650 .6rem/1.4 var(--font-mono,monospace);text-transform:uppercase;background:#fef3c7;color:#92400e;border-radius:.3rem;padding:.12rem .45rem;",
    tipAmber: "font-size:.72rem;line-height:1.45;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.35);border-radius:.6rem;padding:.6rem .7rem;color:#78350f;",
    tipBlue: "font-size:.72rem;line-height:1.45;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);border-radius:.6rem;padding:.6rem .7rem;color:#1e3a8a;",
    tipRed: "font-size:.72rem;line-height:1.45;background:rgba(225,29,72,.08);border:1px solid rgba(225,29,72,.3);border-radius:.6rem;padding:.6rem .7rem;color:#9f1239;",
    tipGreen: "font-size:.72rem;line-height:1.45;background:rgba(5,150,105,.1);border:1px solid rgba(5,150,105,.3);border-radius:.6rem;padding:.6rem .7rem;color:#065f46;",
    grid2: "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem;",
    grid4: "display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;",
    bodyStack: "display:grid;gap:1rem;",
    sectionHeading: "font:650 1rem/1.3 var(--font-serif,Georgia,serif);margin:0 0 .6rem;color:var(--surface-text,#0F2042);"
  };

  var root = null;
  var wired = false;
  var escapeWired = false;
  var allPoints = [];
  var groups = [];
  var byId = {};
  var glossaryTerms = [];
  var state = {
    section: "all",
    filter: "all",
    query: "",
    expanded: { "1.1": true },
    ratings: EC.store.get(RATINGS_KEY, {}),
    drill: null,
    drillAnswer: "",
    drillAnswers: {},
    drillSummary: false,
    visualSection: null,
    showFactors: false,
    /* Visual-overlay interaction state */
    factorTab: "factors",
    selectedFactor: "land",
    visualTab: {},
    maslowTier: 5,
    herzbergMode: "both",
    orgType: "tall",
    orgHighlight: "none",
    plcStage: "maturity",
    plcExtension: true,
    be: { fixedCosts: 20000, sellingPrice: 50, variableCost: 25, currentOutput: 1000 },
    financeTerm: "all",
    financeSource: "overdraft",
    exchangeState: "spiced"
  };

  /* Inline lucide-style icons used by the original React checklist. */
  var ICONS = {
    brain: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    listChecks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
  };

  function icon(name, size) {
    var s = size || 18;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  function fmt(n) { return Number(n).toLocaleString(); }
  function r2(n) { return Math.round(n * 100) / 100; }

  function ratingOf(id) { return state.ratings[id] || "unrated"; }

  function prepare(data) {
    allPoints = (data || []).map(function (p) {
      return {
        id: p.id,
        sectionCode: p.sectionCode,
        sectionTitle: p.sectionTitle,
        topicCode: p.topicCode,
        topicTitle: p.topicTitle,
        subtopicCode: p.subtopicCode,
        subtopicTitle: p.subtopicTitle,
        text: p.text,
        markScheme: p.markScheme || "",
        search: [p.sectionTitle, p.topicCode, p.topicTitle, p.subtopicCode, p.subtopicTitle, p.text].join(" ").toLowerCase()
      };
    });
    byId = {};
    allPoints.forEach(function (p) { byId[p.id] = p; });
    groups = [];
    var sectionIndex = {};
    var topicIndex = {};
    var subtopicIndex = {};
    allPoints.forEach(function (p) {
      var s = sectionIndex[p.sectionCode];
      if (!s) {
        s = { code: p.sectionCode, title: p.sectionTitle, label: p.sectionTitle.replace(/^\d+\.\s*/, ""), topics: [], pointIds: [] };
        sectionIndex[p.sectionCode] = s;
        groups.push(s);
      }
      s.pointIds.push(p.id);
      var tk = p.sectionCode + "/" + p.topicCode;
      var t = topicIndex[tk];
      if (!t) {
        t = { code: p.topicCode, title: p.topicTitle, subtopics: [], points: [] };
        topicIndex[tk] = t;
        s.topics.push(t);
      }
      t.points.push(p);
      var sk = p.sectionCode + "/" + p.subtopicCode;
      var st = subtopicIndex[sk];
      if (!st) {
        st = { code: p.subtopicCode, title: p.subtopicTitle, points: [] };
        subtopicIndex[sk] = st;
        t.subtopics.push(st);
      }
      st.points.push(p);
    });
  }

  function countsFor(list) {
    var out = { all: list.length, unrated: 0, hard: 0, moderate: 0, easy: 0 };
    list.forEach(function (p) { out[ratingOf(p.id)]++; });
    return out;
  }

  function visibleSet() {
    var words = state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var scoped = allPoints.filter(function (p) {
      if (state.section !== "all" && p.sectionCode !== state.section) return false;
      for (var i = 0; i < words.length; i++) if (p.search.indexOf(words[i]) === -1) return false;
      return true;
    });
    var visible = state.filter === "all"
      ? scoped
      : scoped.filter(function (p) { return ratingOf(p.id) === state.filter; });
    return { words: words, scoped: scoped, visible: visible, counts: countsFor(scoped) };
  }

  function button(label, action, cls, extra, disabled) {
    return '<button type="button" class="' + (cls || "checklist-secondary") + '"' +
      (action ? ' data-act="' + action + '"' : "") +
      (disabled ? " disabled" : "") +
      (extra ? " " + extra : "") + ">" + label + "</button>";
  }

  function ratingButtons(id) {
    var current = ratingOf(id);
    var html = '<div class="checklist-rating-buttons" role="group" aria-label="Confidence rating">';
    RATING_OPTIONS.forEach(function (option) {
      html += '<button type="button" data-act="rate" data-id="' + EC.esc(id) + '" data-value="' + option.value +
        '" data-rating="' + option.value + '" aria-pressed="' + (current === option.value) + '"' +
        ' title="Rate as ' + option.label + '"><span aria-hidden="true"></span>' + option.label + "</button>";
    });
    return html + "</div>";
  }

  function sectionOptions() {
    var html = '<option value="all">All sections</option>';
    groups.forEach(function (s) {
      html += '<option value="' + EC.esc(s.code) + '"' + (state.section === s.code ? " selected" : "") + ">" +
        EC.esc(s.title) + "</option>";
    });
    return html;
  }

  function renderSection(section, visibleIds, isSearching) {
    var topics = section.topics.filter(function (topic) {
      return topic.points.some(function (p) { return visibleIds.hasOwnProperty(p.id); });
    });
    if (!topics.length) return "";

    var sectionHeadingId = "checklist-unit-" + EC.esc(section.code);
    var visualLabel = SECTION_VISUAL_LABELS[section.code];
    var html = '<section class="checklist-unit" aria-labelledby="' + sectionHeadingId + '">' +
      '<div class="checklist-unit-heading">' +
        '<h2 id="' + sectionHeadingId + '"><span>' + EC.esc(section.code) + "</span>" + EC.esc(section.label) + "</h2>" +
        (visualLabel
          ? button(icon("image", 16) + " " + EC.esc(visualLabel), "open-visual", "checklist-secondary", 'data-section="' + EC.esc(section.code) + '"')
          : "") +
        button("Practise exam questions " + icon("arrowRight", 15), "practice-section", "checklist-secondary", 'data-section="' + EC.esc(section.code) + '"') +
      "</div>";

    topics.forEach(function (topic) {
      var key = (isSearching ? "filtered-" : "") + topic.code;
      var isOpen = state.expanded.hasOwnProperty(key) ? state.expanded[key] : isSearching;
      var topicRated = topic.points.filter(function (p) { return state.ratings[p.id]; }).length;
      var topicId = "checklist-topic-" + EC.esc(topic.code);
      html += '<div class="checklist-topic"><h3>' +
        '<button type="button" data-act="toggle-topic" data-code="' + EC.esc(key) + '" aria-expanded="' + isOpen + '" aria-controls="' + topicId + '">' +
          '<span class="checklist-topic-code">' + EC.esc(topic.code) + "</span>" +
          "<strong>" + EC.esc(topic.title) + "</strong>" +
          "<small>" + topicRated + "/" + topic.points.length + " rated</small>" +
          icon("chevronRight", 18) +
        "</button></h3>";
      html += '<div id="' + topicId + '" class="checklist-topic-body"' + (isOpen ? "" : " hidden") + ">";
      if (isOpen) {
        html += '<div class="checklist-topic-actions">' +
          (topic.code === "1.1"
            ? button(icon("image", 15) + " Factors of production diagram", "open-factors", "checklist-secondary")
            : "") +
          button("Practise exam questions " + icon("arrowRight", 15), "practice-topic", "checklist-secondary",
            'data-section="' + EC.esc(section.code) + '" data-topic="' + EC.esc(topic.code) + '"') +
        "</div>";
        topic.subtopics.forEach(function (subtopic) {
          var points = subtopic.points.filter(function (p) { return visibleIds.hasOwnProperty(p.id); });
          if (!points.length) return;
          html += '<div class="checklist-subtopic">' +
            "<h4><span>" + EC.esc(subtopic.code) + "</span>" + EC.esc(subtopic.title) + "</h4><ul>";
          points.forEach(function (p) {
            html += '<li class="checklist-point">' +
              "<p>" + EC.esc(p.text) + "</p>" +
              '<div class="checklist-point-actions">' +
                ratingButtons(p.id) +
                button("Recall " + icon("arrowRight", 14), "recall", "checklist-recall-button", 'data-id="' + EC.esc(p.id) + '" aria-label="Recall: ' + EC.esc(p.text) + '"') +
              "</div>" +
            "</li>";
          });
          html += "</ul></div>";
        });
      }
      html += "</div></div>";
    });
    return html + "</section>";
  }

  /* Find a matching glossary term for a point, mirroring SyllabusRevisionChecklist.tsx. */
  function glossaryFor(text) {
    if (!text) return null;
    var term = String(text).toLowerCase();
    for (var i = 0; i < glossaryTerms.length; i++) {
      var name = String(glossaryTerms[i].term || "").toLowerCase();
      if (!name) continue;
      if (name === term || term.indexOf(name) !== -1) return glossaryTerms[i];
    }
    return null;
  }

  /* A model answer built from the glossary and mark-scheme content — phrased as
   * "what a strong answer says" rather than exposing the raw scheme. */
  function exampleAnswer(point) {
    var glossary = glossaryFor(point.text);
    var parts = [];
    if (glossary) {
      if (glossary.definition) parts.push(EC.esc(glossary.definition));
      if (glossary.exampleContext) parts.push("For example: " + EC.esc(glossary.exampleContext));
      if (glossary.examAdvice) parts.push("Exam tip: " + EC.esc(glossary.examAdvice));
    } else if (point.markScheme) {
      parts.push(EC.esc(point.markScheme));
    }
    if (!parts.length) {
      parts.push("Identify the key business concept, explain how it works, and apply it to a relevant business example.");
    }
    return parts.join("<br>");
  }

  function renderSummary() {
    var drill = state.drill;
    var html = '<dialog id="ec-cl-dialog" class="checklist-dialog" aria-labelledby="checklist-recall-title">';
    html += '<div class="checklist-dialog-content"><header>' +
      '<div><p class="checklist-kicker">Active recall · review</p>' +
      '<h2 id="checklist-recall-title">What a strong answer says</h2></div>' +
      button(icon("x", 19), "dialog-close", "checklist-secondary", 'aria-label="Close recall review"') +
      "</header>";
    if (drill && drill.points.length) {
      drill.points.forEach(function (point, ix) {
        var student = state.drillAnswers[point.id] || "";
        var rating = ratingOf(point.id);
        html += '<section style="border-top:1px solid var(--ec-line);padding:12px 0">' +
          "<h3 style=\"font-size:.9rem;margin:0 0 6px\">" + (ix + 1) + ". " + EC.esc(point.text) + "</h3>" +
          '<p style="font-size:.82rem;margin:4px 0"><strong>Your answer:</strong> ' +
            (student ? EC.esc(student) : "<em>Not answered</em>") + "</p>" +
          '<div style="font-size:.82rem;line-height:1.5;margin-top:6px"><strong>What you could have said:</strong><br>' +
            exampleAnswer(point) + "</div>" +
          '<p style="font-size:.74rem;opacity:.75;margin:6px 0 0">Your rating: ' + EC.esc(rating === "unrated" ? "not rated" : rating) + "</p>" +
          "</section>";
      });
    }
    html += "<footer>" +
      button("Retry missed", "dialog-retry-missed", "checklist-primary") +
      button("Back to checklist", "dialog-close", "checklist-secondary") +
      "</footer></div></dialog>";
    return html;
  }

  function renderDialog() {
    var drill = state.drill;
    var html = '<dialog id="ec-cl-dialog" class="checklist-dialog" aria-labelledby="checklist-recall-title">';
    if (state.drillSummary) return renderSummary();
    if (drill && drill.points.length) {
      var index = Math.min(drill.index, drill.points.length - 1);
      var point = drill.points[index];
      var glossary = glossaryFor(point.text);
      var guidance;
      if (glossary) {
        guidance = "<p>" + EC.esc(glossary.definition) + "</p>" +
          (glossary.exampleContext ? "<p>" + EC.esc(glossary.exampleContext) + "</p>" : "") +
          (glossary.examAdvice ? "<p>" + EC.esc(glossary.examAdvice) + "</p>" : "");
      } else if (point.markScheme) {
        guidance = '<div style="white-space:pre-wrap;font-size:.88rem;line-height:1.45;">' + EC.esc(point.markScheme) + "</div>";
      } else {
        guidance = "<p>State the key idea, explain its effect on a business, and support it with a relevant example.</p>";
      }
      html += '<div class="checklist-dialog-content">' +
        "<header>" +
          "<div><p class=\"checklist-kicker\">Active recall · " + (index + 1) + " of " + drill.points.length + "</p>" +
          '<h2 id="checklist-recall-title">' + EC.esc(point.subtopicTitle) + "</h2></div>" +
          button(icon("x", 19), "dialog-close", "checklist-secondary", 'aria-label="Close recall"') +
        "</header>" +
        '<p class="checklist-recall-prompt">Explain what you remember about <strong>' + EC.esc(point.text) + "</strong>.</p>" +
        '<label>Your answer<textarea id="ec-cl-answer" rows="4">' + EC.esc(state.drillAnswer) + "</textarea></label>" +
        '<details key="' + EC.esc(point.id) + '"><summary>Show guidance</summary>' + guidance + "</details>" +
        "<div>" + ratingButtons(point.id) + "</div>" +
        "<footer>" +
          button("Previous", "dialog-prev", "checklist-secondary", "", index === 0) +
          button("Exam practice", "dialog-practice", "checklist-secondary", 'data-section="' + EC.esc(point.sectionCode) + '" data-topic="' + EC.esc(point.topicCode) + '"') +
          button(index + 1 === drill.points.length ? icon("check", 16) + " Finish" : "Next " + icon("arrowRight", 16), "dialog-next", "checklist-primary") +
        "</footer>" +
      "</div>";
    }
    return html + "</dialog>";
  }

  /* ---------------------------------------------------------------------- */
  /* FACTORS OF PRODUCTION VISUAL — exact content from                       */
  /* FactorsOfProductionDiagram.tsx                                           */
  /* ---------------------------------------------------------------------- */

  function factorTabsHtml() {
    var tabs = [{ id: "factors", label: "Factors & Rewards" }, { id: "circular", label: "Flow Diagram" }];
    var html = '<div style="display:inline-flex;flex-wrap:wrap;gap:.15rem;background:rgba(255,255,255,.12);border-radius:.6rem;padding:.25rem;">';
    tabs.forEach(function (t) {
      var on = state.factorTab === t.id;
      html += '<button type="button" data-act="factor-tab" data-tab="' + t.id + '" aria-pressed="' + on + '" style="' +
        (on ? "background:#fff;color:#0F2042;font-weight:700;box-shadow:0 1px 2px rgba(15,23,42,.2);" : "color:#dbeafe;") +
        'border:0;border-radius:.45rem;padding:.45rem .8rem;font:650 .75rem/1 var(--font-mono,monospace);cursor:pointer;">' + EC.esc(t.label) + "</button>";
    });
    return html + "</div>";
  }

  function factorSelectorHtml() {
    var html = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;">';
    FACTOR_ORDER.forEach(function (key) {
      var item = FACTORS_DATA[key];
      var on = state.selectedFactor === key;
      html += '<button type="button" data-act="select-factor" data-factor="' + key + '" aria-pressed="' + on + '" style="' +
        (on
          ? "border:2px solid #0F2042;background:var(--surface-practice,rgba(255,255,255,.8));box-shadow:0 3px 10px rgba(15,23,42,.15);"
          : "border:1px solid rgba(100,116,139,.35);background:var(--surface-practice,rgba(250,249,246,.7));") +
        'border-radius:.85rem;padding:1rem;text-align:left;cursor:pointer;position:relative;overflow:hidden;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;">' +
          '<span style="font-size:1.5rem;">' + item.icon + "</span>" +
          '<span style="' + VIS.tagBlue + '">Reward: ' + EC.esc(item.reward.split(" ")[0]) + "</span>" +
        "</div>" +
        '<h3 style="font:650 1rem/1.3 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">' + EC.esc(item.title) + "</h3>" +
        '<div style="margin-top:.5rem;padding-top:.5rem;border-top:1px solid rgba(100,116,139,.25);display:flex;align-items:center;justify-content:space-between;font-size:.72rem;">' +
          '<span style="font-family:var(--font-mono,monospace);color:#78716c;">Factor Reward:</span>' +
          '<strong style="color:var(--surface-text,#0F2042);">' + EC.esc(item.reward) + "</strong>" +
        "</div>" +
        (on ? '<span aria-hidden="true" style="position:absolute;top:0;right:0;width:.5rem;height:.5rem;background:#0F2042;border-bottom-left-radius:.3rem;"></span>' : "") +
      "</button>";
    });
    return html + "</div>";
  }

  function factorDetailHtml() {
    var c = FACTORS_DATA[state.selectedFactor] || FACTORS_DATA.land;
    var html = '<section style="background:var(--surface-practice,rgba(250,249,246,.9));border:1px solid rgba(100,116,139,.3);border-radius:1rem;padding:1rem 1.1rem;box-shadow:0 1px 2px rgba(15,23,42,.06);">';
    html += '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,20rem);gap:1.25rem;align-items:start;">';

    /* Left detail column */
    html += '<div style="display:grid;gap:.85rem;">';
    html += '<div style="display:flex;align-items:center;gap:.75rem;">' +
      '<span style="font-size:1.8rem;padding:.5rem;border-radius:.75rem;background:var(--surface,#fff);border:1px solid rgba(100,116,139,.3);">' + c.icon + "</span>" +
      "<div>" +
        '<span style="' + VIS.monoLabel + ';color:#059669;">Cambridge Factor of Production</span>' +
        '<h3 style="font:650 1.35rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:.15rem 0;">' +
          EC.esc(c.title) + ' · <span style="color:#2563eb;">Reward: ' + EC.esc(c.reward) + "</span></h3>" +
        '<p style="font-size:.72rem;color:#78716c;margin:0;">' + EC.esc(c.tagline) + "</p>" +
      "</div></div>";

    html += '<div style="' + VIS.whiteCard + '">' +
      '<span style="' + VIS.monoLabel + '">Cambridge Textbook Definition:</span>' +
      '<p style="font:400 .85rem/1.6 var(--font-serif,Georgia,serif);color:var(--surface-text,#1C1917);margin:0;">"' + EC.esc(c.definition) + '"</p>' +
    "</div>";

    html += '<div style="' + VIS.tipGreen + '">' +
      '<div style="font-weight:700;color:#065f46;margin-bottom:.25rem;">💰 Why is the Factor Reward called "' + EC.esc(c.reward) + '"?</div>' +
      '<p style="margin:0;line-height:1.5;">' + EC.esc(c.rewardExplanation) + "</p>" +
    "</div>";

    html += '<div>' +
      '<span style="' + VIS.monoLabel + ';color:var(--surface-text,#0F2042);">Real-World Cambridge Case Examples:</span>' +
      '<div style="' + VIS.grid2 + '">';
    c.examples.forEach(function (ex) {
      html += '<div style="display:flex;align-items:flex-start;gap:.5rem;padding:.6rem;border-radius:.5rem;background:var(--surface,#fff);border:1px solid rgba(100,116,139,.3);font-size:.72rem;line-height:1.45;color:var(--surface-text,#44403c);">' +
        '<span style="color:#059669;font-weight:700;flex-shrink:0;">✓</span><span>' + EC.esc(ex) + "</span></div>";
    });
    html += "</div></div></div>";

    /* Right infographic column */
    html += '<div style="display:grid;gap:.85rem;">';
    html += '<div style="background:var(--surface,#fff);border:1px solid rgba(100,116,139,.3);border-radius:.85rem;padding:1rem;display:flex;flex-direction:column;align-items:center;text-align:center;">' +
      '<div style="width:5.5rem;height:5.5rem;border-radius:999px;background:var(--surface-practice,rgba(241,245,249,.8));display:flex;align-items:center;justify-content:center;font-size:2.25rem;margin-bottom:.6rem;box-shadow:inset 0 2px 6px rgba(15,23,42,.1);">' + c.icon + "</div>" +
      '<span style="font:650 1.1rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);">' + EC.esc(c.title) + "</span>" +
      '<span style="font:650 .68rem/1.4 var(--font-mono,monospace);color:#64748b;margin-top:.15rem;">Yields Factor Payment</span>' +
      '<div style="width:100%;border-top:1px dashed rgba(100,116,139,.4);margin:.75rem 0;"></div>' +
      '<div style="width:100%;padding:.6rem;border-radius:.5rem;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.3);text-align:center;">' +
        '<span style="display:block;font:700 .6rem/1.4 var(--font-mono,monospace);text-transform:uppercase;color:#1d4ed8;">Income Reward to Household</span>' +
        '<span style="font:700 1.2rem/1.2 var(--font-mono,monospace);color:#1e3a8a;">' + EC.esc(c.reward) + "</span>" +
      "</div></div>";
    html += '<div style="' + VIS.tipAmber + '">' +
      '<div style="font-weight:700;color:#92400e;margin-bottom:.25rem;">⚠️ Senior Examiner Advice</div>' +
      '<p style="margin:0;font-size:.68rem;line-height:1.5;">' + EC.esc(c.examTip) + "</p>" +
    "</div></div>";

    html += "</div></section>";
    return html;
  }

  function factorFlowHtml() {
    return '<section style="background:var(--surface-practice,rgba(250,249,246,.9));border:1px solid rgba(100,116,139,.3);border-radius:1rem;padding:1.25rem;box-shadow:0 1px 2px rgba(15,23,42,.06);display:grid;gap:1rem;">' +
      '<div>' +
        '<span style="' + VIS.monoLabel + ';color:#2563eb;">Syllabus 1.1 · Factors and their rewards</span>' +
        '<h3 style="font:650 1.35rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:.2rem 0;">Who supplies each factor, and what they are paid</h3>' +
        '<p style="font-size:.72rem;color:#57534e;line-height:1.5;max-width:44rem;margin:0;">Households supply land, labour, capital and enterprise. Firms use them to produce goods and services, and pay rent, wages, interest and profit.</p>' +
      "</div>" +
      '<div style="background:var(--surface,#fff);border:1px solid rgba(100,116,139,.3);border-radius:1rem;padding:1rem;display:flex;justify-content:center;">' +
        '<svg viewBox="0 0 700 360" style="width:100%;max-width:42rem;height:auto;user-select:none;" role="img" aria-label="Circular flow of factors of production and factor rewards between households and firms">' +
          '<rect x="40" y="110" width="160" height="140" rx="16" fill="#0F2042" stroke="#1d4ed8" stroke-width="2" />' +
          '<text x="120" y="155" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="16" font-family="sans-serif">🏠 HOUSEHOLDS</text>' +
          '<text x="120" y="180" text-anchor="middle" fill="#bfdbfe" font-size="11" font-family="monospace">Owners of Factors</text>' +
          '<text x="120" y="205" text-anchor="middle" fill="#93c5fd" font-size="10">Supply Land, Labour,</text>' +
          '<text x="120" y="222" text-anchor="middle" fill="#93c5fd" font-size="10">Capital &amp; Enterprise</text>' +

          '<rect x="500" y="110" width="160" height="140" rx="16" fill="#065f46" stroke="#059669" stroke-width="2" />' +
          '<text x="580" y="155" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="16" font-family="sans-serif">🏭 FIRMS</text>' +
          '<text x="580" y="180" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">Producers of Goods</text>' +
          '<text x="580" y="205" text-anchor="middle" fill="#6ee7b7" font-size="10">Combine Factors to</text>' +
          '<text x="580" y="222" text-anchor="middle" fill="#6ee7b7" font-size="10">Produce Output</text>' +

          '<path d="M 170 100 Q 350 20 530 100" fill="none" stroke="#2563EB" stroke-width="3" marker-end="url(#ec-arrow-blue)" />' +
          '<rect x="250" y="32" width="200" height="36" rx="8" fill="#eff6ff" stroke="#60a5fa" stroke-width="1" />' +
          '<text x="350" y="54" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="11" font-family="monospace">→ FACTORS OF PRODUCTION →</text>' +

          '<path d="M 530 260 Q 350 340 170 260" fill="none" stroke="#059669" stroke-width="3" marker-end="url(#ec-arrow-green)" />' +
          '<rect x="235" y="292" width="230" height="36" rx="8" fill="#ecfdf5" stroke="#34d399" stroke-width="1" />' +
          '<text x="350" y="314" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="11" font-family="monospace">← FACTOR REWARDS (INCOME) ←</text>' +

          '<g transform="translate(240, 105)">' +
            '<rect width="220" height="150" rx="12" fill="var(--surface-practice,#f8fafc)" stroke="#cbd5e1" stroke-width="1" />' +
            '<text x="110" y="24" text-anchor="middle" fill="#0F2042" font-family="monospace" font-weight="bold" font-size="11">4 Factor Rewards</text>' +
            '<text x="110" y="52" text-anchor="middle" fill="#059669" font-family="monospace" font-size="12" font-weight="bold">🏞️ Land → RENT</text>' +
            '<text x="110" y="78" text-anchor="middle" fill="#2563eb" font-family="monospace" font-size="12" font-weight="bold">👷 Labour → WAGES</text>' +
            '<text x="110" y="104" text-anchor="middle" fill="#d97706" font-family="monospace" font-size="12" font-weight="bold">🏭 Capital → INTEREST</text>' +
            '<text x="110" y="130" text-anchor="middle" fill="#9333ea" font-family="monospace" font-size="12" font-weight="bold">🚀 Enterprise → PROFIT</text>' +
          "</g>" +
          '<defs>' +
            '<marker id="ec-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563EB" /></marker>' +
            '<marker id="ec-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" /></marker>' +
          "</defs>" +
        "</svg>" +
      "</div>" +
    "</section>";
  }

  function factorsVisualContent() {
    var html = '<p style="' + VS.intro + '"><strong>Factors of production</strong> are the inputs used to make goods and provide services. Each factor earns a different reward: rent, wages, interest and profit.</p>';
    if (state.factorTab === "circular") {
      html += factorFlowHtml();
    } else {
      html += factorSelectorHtml();
      html += factorDetailHtml();
    }
    return html;
  }

  /* ---------------------------------------------------------------------- */
  /* SECTION 2–6 CONCEPT DIAGRAMS — from SectionConceptDiagram.tsx           */
  /* ---------------------------------------------------------------------- */

  function activeVisualTab(code) {
    var tabs = SECTION_TABS[code] || [];
    if (!tabs.length) return "";
    var chosen = state.visualTab[code];
    if (chosen && tabs.some(function (t) { return t.id === chosen; })) return chosen;
    return tabs[0].id;
  }

  function visualTabsHtml(code) {
    var tabs = SECTION_TABS[code] || [];
    if (!tabs.length) return "";
    var current = activeVisualTab(code);
    var html = '<div style="display:flex;flex-wrap:wrap;gap:.5rem;padding:.5rem .25rem .25rem;border-bottom:1px solid rgba(100,116,139,.3);">';
    tabs.forEach(function (t) {
      html += '<button type="button" data-act="visual-tab" data-tab="' + EC.esc(t.id) + '" aria-pressed="' + (current === t.id) + '" style="' +
        (current === t.id ? VIS.pillOn : VIS.pill) + '">' + EC.esc(t.label) + "</button>";
    });
    return html + "</div>";
  }

  /* ---- Section 2: Maslow Pyramid ---- */
  var MASLOW_TIERS = [
    {
      level: 5, name: "Self-Actualisation", sub: "Peak of Potential", width: 44, color: "#7e22ce",
      desc: "Reaching one's personal maximum potential, creative fulfillment, and personal development.",
      workplaceExample: "Challenging projects, autonomy to innovate, sabbatical to master a craft, leading strategic initiatives.",
      examTip: "Cambridge Tip: Higher needs only act as motivators once lower needs are satisfied. A bonus will not satisfy self-actualisation."
    },
    {
      level: 4, name: "Esteem Needs", sub: "Status & Recognition", width: 58, color: "#4338ca",
      desc: "Respect from others, feeling valued, having status, self-confidence, and public acknowledgment.",
      workplaceExample: "Prestigious job title, 'Employee of the Month', public praise in meetings, promotion, private office or company car.",
      examTip: "Esteem is a non-financial motivator. Praise and recognition cost the firm nothing but boost retention significantly."
    },
    {
      level: 3, name: "Social / Belonging Needs", sub: "Love & Acceptance", width: 72, color: "#2563eb",
      desc: "Friendship, acceptance by peer groups, belonging to a team, and feeling part of a community.",
      workplaceExample: "Team-working structures, collegial work environment, social events, staff canteen, company sports clubs.",
      examTip: "Taylor's scientific management ignored social needs, treating workers like machines. Maslow proved isolation lowers morale."
    },
    {
      level: 2, name: "Safety & Security Needs", sub: "Protection & Stability", width: 86, color: "#0d9488",
      desc: "Physical safety, financial stability, certainty of employment, and freedom from danger or arbitrary dismissal.",
      workplaceExample: "Permanent employment contract (vs zero-hours), safe protective gear (PPE), pension scheme, clear grievance procedures.",
      examTip: "If a business announces redundancies, employees drop straight back to Safety needs and stop caring about Esteem or Teamwork."
    },
    {
      level: 1, name: "Physiological Needs", sub: "Basic Survival Foundation", width: 100, color: "#059669",
      desc: "The essential physical requirements for human survival: food, water, warmth, shelter, and rest.",
      workplaceExample: "Fair living wage (basic pay), clean drinking water, adequate restroom facilities, heating/ventilation, mandated rest breaks.",
      examTip: "Foundation of the pyramid: if workers cannot afford food or shelter on their basic wage, no other motivator will work."
    }
  ];

  function maslowVisual() {
    var active = MASLOW_TIERS[0];
    MASLOW_TIERS.forEach(function (t) { if (t.level === state.maslowTier) active = t; });
    var html = '<div style="' + VIS.bodyStack + '">';
    html += '<div style="' + VIS.tipBlue + '"><strong>How Maslow\'s Hierarchy Works in Cambridge Business Studies:</strong> ' +
      'Human needs are structured like a pyramid from foundation to peak. <strong>Lower-level needs must be satisfied first</strong>. Once a level is met, it no longer motivates the worker, and they seek the next tier above. Click any tier below to explore.</div>';
    html += '<div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:1rem;align-items:start;">';

    html += '<div style="' + VIS.whiteCard + ';display:flex;flex-direction:column;align-items:center;gap:.45rem;">' +
      '<div style="width:100%;display:flex;justify-content:space-between;font:650 .65rem/1.4 var(--font-mono,monospace);color:#94a3b8;"><span>Peak: Higher-order needs</span><span>▲ Progression</span></div>';
    MASLOW_TIERS.forEach(function (t) {
      var on = t.level === state.maslowTier;
      html += '<button type="button" data-act="maslow-tier" data-level="' + t.level + '" aria-pressed="' + on + '" style="' +
        'width:' + t.width + '%;background:' + t.color + ';color:#fff;border:0;border-radius:.7rem;padding:.6rem .5rem;text-align:center;cursor:pointer;' +
        (on ? "box-shadow:0 0 0 4px #fff,0 0 0 7px #3b82f6;transform:scale(1.02);z-index:1;" : "opacity:.88;") +
        '">' +
        '<span style="display:flex;align-items:center;justify-content:center;gap:.5rem;">' +
          '<span style="width:1.25rem;height:1.25rem;border-radius:999px;background:rgba(255,255,255,.25);display:inline-flex;align-items:center;justify-content:center;font:650 .62rem/1 var(--font-mono,monospace);">' + t.level + "</span>" +
          '<strong style="font-size:.75rem;">' + EC.esc(t.name) + "</strong>" +
        "</span>" +
        '<span style="display:block;font-size:.6rem;opacity:.8;">' + EC.esc(t.sub) + "</span>" +
      "</button>";
    });
    html += '<div style="width:100%;display:flex;justify-content:space-between;font:650 .65rem/1.4 var(--font-mono,monospace);color:#94a3b8;"><span>Base: Fundamental survival needs</span><span>Foundation ▼</span></div></div>';

    html += '<div style="border:1px solid rgba(100,116,139,.3);border-left:4px solid ' + active.color + ';border-radius:.85rem;padding:1rem;display:grid;gap:.65rem;background:var(--surface-practice,rgba(255,255,255,.6));">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="' + VIS.tagBlue + '">Level ' + active.level + ' of 5</span>' +
        '<span style="font-size:.68rem;color:#64748b;">Tier #' + active.level + "</span>" +
      "</div>" +
      '<h4 style="font:650 1.2rem/1.2 var(--font-serif,Georgia,serif);color:' + active.color + ';margin:0;">' + EC.esc(active.name) + "</h4>" +
      '<p style="' + VIS.smallText + ';margin:0;">' + EC.esc(active.desc) + "</p>" +
      '<div style="border-top:1px solid rgba(100,116,139,.3);padding-top:.6rem;">' +
        '<div style="' + VIS.monoLabel + '">🏢 Workplace Solution:</div>' +
        '<p style="' + VIS.smallText + ';background:var(--surface,#fff);border:1px solid rgba(100,116,139,.3);border-radius:.5rem;padding:.6rem;margin:.3rem 0 0;">' + EC.esc(active.workplaceExample) + "</p>" +
      "</div>" +
      '<div style="' + VIS.tipAmber + '"><strong style="display:block;margin-bottom:.2rem;">🎓 Cambridge 0264 Exam Rule:</strong>' + EC.esc(active.examTip) + "</div>" +
    "</div>";

    html += "</div></div>";
    return html;
  }

  /* ---- Section 2: Herzberg Two-Factor ---- */
  function herzbergVisual() {
    var mode = state.herzbergMode;
    var scenarios = [
      { id: "both", label: "Optimal: Good Hygiene + Strong Motivators" },
      { id: "hygieneOnly", label: "Common Mistake: Only Paid Higher Wages" },
      { id: "motivatorOnly", label: "Unstable: Given Responsibility but Poor Pay" }
    ];
    var hygieneItems = ["Salary / Hourly Pay", "Working Conditions & Safety", "Job Security", "Company Policies & Administration", "Relationship with Supervisor"];
    var motivatorItems = ["Sense of Personal Achievement", "Recognition & Meaningful Praise", "Challenging & Fulfilling Work", "Increased Responsibility", "Opportunity for Advancement / Promotion"];
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="' + VIS.tipBlue + '"><strong>Herzberg\'s Key Discovery:</strong> Satisfaction and Dissatisfaction are <strong>NOT opposites</strong>! They are controlled by two entirely different sets of factors: <strong>Hygiene factors</strong> (which only prevent dissatisfaction) and <strong>Motivators</strong> (which create genuine drive).</div>';

    html += '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;">' +
      '<span style="' + VIS.monoLabel + ';display:inline;">Test Scenario:</span>';
    scenarios.forEach(function (s) {
      html += '<button type="button" data-act="herzberg-mode" data-mode="' + s.id + '" aria-pressed="' + (mode === s.id) + '" style="' + (mode === s.id ? VIS.pillOn : VIS.pill) + '">' + EC.esc(s.label) + "</button>";
    });
    html += "</div>";

    html += '<div style="' + VIS.grid2 + '">';

    /* Hygiene card */
    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;">' +
        '<div style="display:flex;align-items:center;gap:.5rem;"><span style="font-size:1.2rem;">🧼</span><div>' +
          '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">Hygiene Factors</h4>' +
          '<p style="' + VIS.tinyText + ';margin:0;">Maintenance / Context Factors</p>' +
        "</div></div>" +
        '<span style="' + VIS.tagBlue + '">' + (mode === "motivatorOnly" ? "❌ Poor (-)" : "✅ Satisfied (0)") + "</span>" +
      "</div>";
    hygieneItems.forEach(function (item) {
      var bad = mode === "motivatorOnly";
      html += '<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;border-radius:.45rem;background:var(--surface-practice,rgba(241,245,249,.6));font-size:.72rem;">' +
        '<span style="color:' + (bad ? "#f43f5e" : "#10b981") + ';">' + (bad ? "✗" : "✓") + "</span><span>" + EC.esc(item) + "</span></div>";
    });
    html += '<div style="background:var(--surface-practice,rgba(241,245,249,.7));border:1px solid rgba(100,116,139,.3);border-radius:.6rem;padding:.6rem;display:grid;gap:.35rem;">' +
      '<div style="display:flex;justify-content:space-between;font:650 .6rem/1.4 var(--font-mono,monospace);color:#64748b;"><span>Severe Dissatisfaction (-5)</span><span>Neutral / Zero (0)</span></div>' +
      '<div style="width:100%;height:.6rem;background:#e2e8f0;border-radius:999px;overflow:hidden;">' +
        '<div style="height:100%;width:' + (mode === "motivatorOnly" ? "20%" : "100%") + ';background:' + (mode === "motivatorOnly" ? "#f43f5e" : "#3b82f6") + ';transition:width .3s;"></div></div>' +
      '<p style="font-size:.68rem;line-height:1.4;color:#475569;margin:0;">' +
        (mode === "motivatorOnly"
          ? "⚠️ Workers are actively complaining, taking sick leave, or striking because pay or safety is inadequate."
          : "✅ Hygiene is sufficient. Workers are NOT dissatisfied, but this alone does NOT inspire peak effort!") +
      "</p></div></div>";

    /* Motivator card */
    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;">' +
        '<div style="display:flex;align-items:center;gap:.5rem;"><span style="font-size:1.2rem;">🚀</span><div>' +
          '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">Motivator Factors</h4>' +
          '<p style="' + VIS.tinyText + ';margin:0;color:#d97706;">Growth / Job Content</p>' +
        "</div></div>" +
        '<span style="' + VIS.tagAmber + '">' + (mode === "hygieneOnly" ? "❌ Absent (0)" : "🌟 Active (+5)") + "</span>" +
      "</div>";
    motivatorItems.forEach(function (item) {
      var absent = mode === "hygieneOnly";
      html += '<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;border-radius:.45rem;background:rgba(245,158,11,.08);font-size:.72rem;">' +
        '<span style="color:' + (absent ? "#94a3b8" : "#d97706") + ';">' + (absent ? "○" : "★") + "</span><span>" + EC.esc(item) + "</span></div>";
    });
    html += '<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.35);border-radius:.6rem;padding:.6rem;display:grid;gap:.35rem;">' +
      '<div style="display:flex;justify-content:space-between;font:650 .6rem/1.4 var(--font-mono,monospace);color:#b45309;"><span>Neutral / No Extra Drive (0)</span><span>High Motivation &amp; Pride (+5)</span></div>' +
      '<div style="width:100%;height:.6rem;background:#e2e8f0;border-radius:999px;overflow:hidden;">' +
        '<div style="height:100%;width:' + (mode === "hygieneOnly" ? "0%" : "100%") + ';background:' + (mode === "hygieneOnly" ? "#94a3b8" : "#f59e0b") + ';transition:width .3s;"></div></div>' +
      '<p style="font-size:.68rem;line-height:1.4;color:#78350f;margin:0;">' +
        (mode === "hygieneOnly"
          ? "⚠️ Workers turn up on time for the paycheck, but will NOT offer initiative, creativity, or overtime."
          : "🌟 Workers take personal pride in quality, innovate solutions, and willingly go beyond basic duties.") +
      "</p></div></div>";

    html += "</div></div>";
    return html;
  }

  /* ---- Section 2: Org Hierarchy ---- */
  function orgNode(text, style, ring) {
    return '<div style="' + style + (ring ? "box-shadow:0 0 0 4px " + ring + ";" : "") + '">' + text + "</div>";
  }

  function orgHierarchyVisual() {
    var type = state.orgType;
    var hl = state.orgHighlight;
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="background:var(--surface-practice,rgba(241,245,249,.7));border:1px solid rgba(100,116,139,.3);border-radius:.75rem;padding:.65rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;">' +
        '<span style="' + VIS.monoLabel + ';display:inline;">Structure:</span>';
    [["tall", "🏢 Tall Structure (4 Levels)"], ["flat", "↔️ Flat Structure (2 Levels)"], ["delayered", "✂️ Delayering (Middle Cut)"]].forEach(function (pair) {
      html += '<button type="button" data-act="org-type" data-type="' + pair[0] + '" aria-pressed="' + (type === pair[0]) + '" style="' + (type === pair[0] ? VIS.pillOn : VIS.pill) + '">' + pair[1] + "</button>";
    });
    html += "</div><div style=\"display:flex;align-items:center;gap:.4rem;\">" +
      '<span style="' + VIS.monoLabel + ';display:inline;">Inspect:</span>' +
      '<button type="button" data-act="org-highlight" data-value="chain" aria-pressed="' + (hl === "chain") + '" style="' +
        (hl === "chain" ? "background:#dc2626;color:#fff;border:1px solid #dc2626;" : "color:#dc2626;border:1px solid #fca5a5;background:var(--surface,#fff);") +
        'border-radius:.4rem;padding:.35rem .5rem;font-size:.68rem;font-weight:600;cursor:pointer;">↓ Chain of Command</button>' +
      '<button type="button" data-act="org-highlight" data-value="span" aria-pressed="' + (hl === "span") + '" style="' +
        (hl === "span" ? "background:#2563eb;color:#fff;border:1px solid #2563eb;" : "color:#2563eb;border:1px solid #93c5fd;background:var(--surface,#fff);") +
        'border-radius:.4rem;padding:.35rem .5rem;font-size:.68rem;font-weight:600;cursor:pointer;">↔ Span of Control</button>' +
    "</div></div>";

    html += '<div style="' + VIS.whiteCard + ';display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:1.25rem;">';
    if (type === "tall") {
      html += '<div style="width:100%;max-width:34rem;display:flex;flex-direction:column;align-items:center;gap:.6rem;">';
      html += orgNode("Managing Director (CEO)", "padding:.5rem 1rem;border-radius:.7rem;text-align:center;font-weight:700;font-size:.72rem;color:#fff;background:#0F2042;", hl === "chain" ? "#ef4444" : "");
      html += '<div style="width:2px;height:.9rem;background:' + (hl === "chain" ? "#ef4444" : "#cbd5e1") + ';"></div>';
      html += '<div style="width:100%;display:flex;justify-content:space-around;">' +
        orgNode("Operations Director", "padding:.4rem .7rem;border-radius:.5rem;text-align:center;font-weight:600;font-size:.68rem;color:#fff;background:#1e40af;", hl === "chain" ? "#ef4444" : "") +
        orgNode("Marketing Director", "padding:.4rem .7rem;border-radius:.5rem;text-align:center;font-weight:600;font-size:.68rem;color:#fff;background:#1e40af;", "") +
      "</div>";
      html += '<div style="width:2px;height:.9rem;background:' + (hl === "chain" ? "#ef4444" : "#cbd5e1") + ';"></div>';
      html += '<div style="width:100%;display:flex;justify-content:space-around;padding:.4rem;border-radius:.7rem;' + (hl === "span" ? "background:rgba(59,130,246,.1);box-shadow:0 0 0 2px #3b82f6;" : "") + ';">';
      ["Factory Mgr A", "Factory Mgr B", "Regional Mgr A", "Regional Mgr B"].forEach(function (mgr, i) {
        html += orgNode(EC.esc(mgr), "padding:.35rem .5rem;border-radius:.4rem;text-align:center;font-size:.62rem;background:var(--surface-practice,rgba(241,245,249,.9));border:1px solid #cbd5e1;color:var(--surface-text,#334155);", (i === 0 && hl === "chain") ? "#ef4444" : "");
      });
      html += "</div>";
      html += '<div style="width:2px;height:.9rem;background:' + (hl === "chain" ? "#ef4444" : "#cbd5e1") + ';"></div>';
      html += '<div style="width:100%;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.25rem;text-align:center;font-size:.58rem;">';
      for (var i = 0; i < 8; i++) {
        html += orgNode("Worker " + (i + 1), "padding:.3rem .1rem;border-radius:.3rem;background:var(--surface-practice,rgba(248,250,252,.9));border:1px solid #e2e8f0;color:#475569;", (i === 0 && hl === "chain") ? "#ef4444" : "");
      }
      html += "</div></div>";
    } else if (type === "flat") {
      html += '<div style="width:100%;max-width:34rem;display:flex;flex-direction:column;align-items:center;gap:.8rem;">';
      html += orgNode("Managing Director (Wide Span of 6 Leads)", "padding:.6rem 1rem;border-radius:.7rem;text-align:center;font-weight:700;font-size:.72rem;color:#fff;background:#065f46;", hl === "chain" ? "#ef4444" : "");
      html += '<div style="width:80%;height:2px;background:#34d399;"></div>';
      html += '<div style="width:100%;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.4rem;padding:.4rem;border-radius:.7rem;' + (hl === "span" ? "background:rgba(59,130,246,.1);box-shadow:0 0 0 2px #3b82f6;" : "") + ';">';
      ["Production", "Sales", "HR", "Finance", "Logistics", "Digital"].forEach(function (dept) {
        html += '<div style="padding:.5rem .25rem;border-radius:.5rem;background:rgba(6,95,70,.08);border:1px solid #6ee7b7;text-align:center;">' +
          '<div style="font-weight:700;font-size:.65rem;color:#065f46;">' + EC.esc(dept) + "</div>" +
          '<div style="font-size:.55rem;color:#64748b;margin-top:.25rem;">Direct to CEO</div></div>';
      });
      html += "</div>";
      html += '<div style="text-align:center;font-size:.68rem;color:#64748b;font-family:var(--font-mono,monospace);">↓ Frontline staff report directly to empowered Department Leads (Only 2 levels!)</div></div>';
    } else {
      html += '<div style="width:100%;max-width:34rem;display:flex;flex-direction:column;align-items:center;gap:.6rem;">';
      html += orgNode("Managing Director", "padding:.5rem 1rem;border-radius:.7rem;text-align:center;font-weight:700;font-size:.72rem;color:#fff;background:#0F2042;", "");
      html += '<div style="width:2px;height:.7rem;background:#cbd5e1;"></div>';
      html += '<div style="width:100%;padding:.6rem;border:2px dashed #fb7185;border-radius:.7rem;background:rgba(255,241,242,.6);display:flex;align-items:center;justify-content:space-between;font-size:.7rem;color:#9f1239;">' +
        '<span style="display:flex;align-items:center;gap:.5rem;"><span style="font-size:1rem;">✂️</span><strong>DELARED LAYER:</strong> Middle Supervisors &amp; Deputy Managers Removed</span>' +
        '<span style="font:650 .58rem/1 var(--font-mono,monospace);background:#fecdd3;padding:.2rem .4rem;border-radius:.3rem;">Wage Overhead Saved ($$$)</span></div>';
      html += '<div style="width:2px;height:.7rem;background:#cbd5e1;"></div>';
      html += '<div style="width:100%;padding:.65rem;border-radius:.7rem;background:var(--surface-practice,rgba(241,245,249,.8));border:1px solid #cbd5e1;text-align:center;font-size:.7rem;color:var(--surface-text,#334155);">' +
        "Remaining Managers now directly supervise wider frontline teams!" +
        '<div style="font:650 .65rem/1.4 var(--font-mono,monospace);color:#2563eb;margin-top:.3rem;">Result: Shorter chain of command + delegation required + risk of managerial overload.</div></div>';
      html += "</div>";
    }
    html += "</div>";

    html += '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;">';
    html += '<div style="' + VIS.whiteCard + '"><strong style="display:block;color:var(--surface-text,#0F2042);">Vertical Chain of Command:</strong>' +
      '<p style="' + VIS.tinyText + ';">' + (type === "tall" ? "Long: 4+ levels. Messages pass slowly and can get distorted before reaching workers." : "Short: 2 levels. Fast direct messages between boardroom and frontline.") + "</p></div>";
    html += '<div style="' + VIS.whiteCard + '"><strong style="display:block;color:var(--surface-text,#0F2042);">Horizontal Span of Control:</strong>' +
      '<p style="' + VIS.tinyText + ';">' + (type === "tall" ? "Narrow (2-3 people). Tight supervision, less employee autonomy." : "Wide (6+ people). Manager cannot micro-manage; delegation is mandatory.") + "</p></div>";
    html += '<div style="' + VIS.whiteCard + '"><strong style="display:block;color:var(--surface-text,#0F2042);">Cambridge Decision Advice:</strong>' +
      '<p style="' + VIS.tinyText + ';">Recommend <strong>Flat</strong> for innovative firms requiring fast responses; recommend <strong>Tall</strong> where strict military/safety protocols must be monitored.</p></div>';
    html += "</div></div>";
    return html;
  }

  /* ---- Section 3: Product Life Cycle ---- */
  var PLC_STAGES = {
    intro: {
      name: "1. Introduction", label: "Introduction",
      sales: "Low and slow growth. Brand is unknown to market.",
      profit: "Negative / Loss. Heavy initial development and launch costs.",
      pricing: "Price Skimming (if novel/unique) OR Penetration (if entering mass market).",
      promo: "High informative advertising to educate potential buyers.",
      tip: "Cash flow is negative. The product is a drain on cash reserves (Boston 'Problem Child')."
    },
    growth: {
      name: "2. Growth", label: "Growth",
      sales: "Rising exponentially as repeat purchases and word-of-mouth kick in.",
      profit: "Turns positive and grows rapidly as economies of scale reduce unit costs.",
      pricing: "Competitive pricing or maintaining skimming price while rivals enter.",
      promo: "Persuasive advertising to build brand loyalty over emerging rivals.",
      tip: "Rivals start copying the product. Distribution channels ('Place') must widen fast."
    },
    maturity: {
      name: "3. Maturity & Saturation", label: "Maturity & Peak",
      sales: "Peak sales. Market is saturated; most potential buyers already own it.",
      profit: "Maximum profitability. Production is efficient and launch costs are paid off.",
      pricing: "Competitive pricing, price wars, or defensive discounts.",
      promo: "Reminder advertising, sales promotions, BOGOF, loyalty cards.",
      tip: "The product is a Boston 'Cash Cow'. Profits earned here should fund new products!"
    },
    decline: {
      name: "4. Decline", label: "Decline",
      sales: "Falling steadily due to changing consumer tastes or obsolete technology.",
      profit: "Shrinking towards zero or loss-making.",
      pricing: "Discounting and promotional markdowns to clear surplus inventory.",
      promo: "Minimal to zero advertising spend; harvest remaining brand equity.",
      tip: "Management must decide: divest/discontinue, or deploy an Extension Strategy!"
    }
  };

  function plcVisual() {
    var current = PLC_STAGES[state.plcStage] || PLC_STAGES.maturity;
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;">' +
        '<div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">' +
          '<span style="display:inline-block;width:.7rem;height:.7rem;border-radius:999px;background:#2563eb;"></span><span style="font-size:.72rem;font-weight:700;">Sales Revenue</span>' +
          '<span style="display:inline-block;width:.7rem;height:.7rem;border-radius:999px;background:#059669;margin-left:.75rem;"></span><span style="font-size:.72rem;font-weight:700;">Net Profit</span>' +
        "</div>" +
        '<button type="button" data-act="plc-extension" aria-pressed="' + state.plcExtension + '" style="' + (state.plcExtension ? "background:#9333ea;color:#fff;box-shadow:0 1px 3px rgba(15,23,42,.2);" : "background:var(--surface-practice,#f1f5f9);color:var(--surface-text,#475569);border:1px solid rgba(100,116,139,.3);") + 'border:0;border-radius:.5rem;padding:.4rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;">' +
          (state.plcExtension ? "✓ Extension Strategy Active" : "+ Show Extension Strategy") + "</button>" +
      "</div>" +
      '<div style="width:100%;max-height:16rem;">' +
        '<svg viewBox="0 0 700 280" style="width:100%;height:auto;" role="img" aria-label="Product life cycle sales and profit curves with extension strategy">' +
          '<line x1="50" y1="230" x2="680" y2="230" stroke="#CBD5E1" stroke-width="2" />' +
          '<line x1="50" y1="20" x2="50" y2="230" stroke="#CBD5E1" stroke-width="2" />' +
          '<line x1="50" y1="180" x2="680" y2="180" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4" />' +
          '<text x="56" y="176" font-size="10" fill="#94a3b8" font-family="monospace">Break-even / Profit = $0</text>' +
          '<line x1="180" y1="20" x2="180" y2="230" stroke="#F1F5F9" stroke-width="2" stroke-dasharray="3 3" />' +
          '<line x1="330" y1="20" x2="330" y2="230" stroke="#F1F5F9" stroke-width="2" stroke-dasharray="3 3" />' +
          '<line x1="490" y1="20" x2="490" y2="230" stroke="#F1F5F9" stroke-width="2" stroke-dasharray="3 3" />' +
          '<path d="M 50 215 C 100 225, 140 210, 200 165 C 280 110, 360 80, 420 85 C 470 95, 520 140, 600 200" fill="none" stroke="#059669" stroke-width="2.5" />' +
          '<path d="M 50 220 C 110 215, 150 180, 240 110 C 310 60, 390 45, 460 50 C 510 60, 560 110, 620 200" fill="none" stroke="#2563EB" stroke-width="3.5" />' +
          (state.plcExtension
            ? '<path d="M 450 50 C 500 40, 560 30, 610 40 C 650 50, 675 80, 690 140" fill="none" stroke="#9333EA" stroke-width="3" stroke-dasharray="5 4" />' +
              '<g transform="translate(540, 25)"><rect x="0" y="0" width="130" height="22" rx="4" fill="#9333EA" /><text x="65" y="15" fill="#FFFFFF" font-size="10" text-anchor="middle" font-weight="bold">Extension Strategy! 🚀</text></g>'
            : "") +
          '<text x="115" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">1. Introduction</text>' +
          '<text x="255" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">2. Growth</text>' +
          '<text x="410" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">3. Maturity</text>' +
          '<text x="560" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">4. Decline</text>' +
        "</svg>" +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4rem;border-top:1px solid rgba(100,116,139,.2);padding-top:.6rem;">';
    ["intro", "growth", "maturity", "decline"].forEach(function (id) {
      html += '<button type="button" data-act="plc-stage" data-stage="' + id + '" aria-pressed="' + (state.plcStage === id) + '" style="' + (state.plcStage === id ? VIS.pillOn : VIS.pill) + '">' + EC.esc(PLC_STAGES[id].label) + "</button>";
    });
    html += "</div></div>";

    html += '<div style="' + VIS.grid2 + '">' +
      '<div style="' + VIS.whiteCard + ';display:grid;gap:.5rem;">' +
        '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">' + EC.esc(current.name) + " Dynamics</h4>" +
        '<div><span style="' + VIS.monoLabel + '">Sales Trend:</span><span style="' + VIS.smallText + '">' + EC.esc(current.sales) + "</span></div>" +
        '<div><span style="' + VIS.monoLabel + '">Profitability:</span><span style="' + VIS.smallText + '">' + EC.esc(current.profit) + "</span></div>" +
      "</div>" +
      '<div style="' + VIS.whiteCard + ';display:grid;gap:.5rem;">' +
        '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">Recommended 4Ps Response</h4>' +
        '<div><span style="' + VIS.monoLabel + '">Pricing Strategy:</span><span style="' + VIS.smallText + '">' + EC.esc(current.pricing) + "</span></div>" +
        '<div><span style="' + VIS.monoLabel + '">Promotion Strategy:</span><span style="' + VIS.smallText + '">' + EC.esc(current.promo) + "</span></div>" +
      "</div></div>";

    html += "</div>";
    return html;
  }

  /* ---- Section 4: Break-Even Simulator (live) ---- */
  function breakEvenCompute() {
    var be = state.be;
    var contribution = Math.max(1, be.sellingPrice - be.variableCost);
    var breakEvenExact = be.fixedCosts / contribution;
    var breakEvenUnits = Math.round(breakEvenExact);
    var marginOfSafety = be.currentOutput - breakEvenUnits;
    var totalRevenue = be.currentOutput * be.sellingPrice;
    var totalCost = be.fixedCosts + be.currentOutput * be.variableCost;
    var profitOrLoss = totalRevenue - totalCost;

    var W = 650, H = 270, padL = 52, padR = 16, padT = 18, padB = 30;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;
    var maxOutput = Math.max(2500, Math.ceil((breakEvenExact * 2.2) / 500) * 500, Math.ceil((be.currentOutput * 1.25) / 500) * 500);
    var maxValue = Math.max(maxOutput * be.sellingPrice, be.fixedCosts + maxOutput * be.variableCost) * 1.1;

    function x(u) { return padL + (u / maxOutput) * innerW; }
    function y(v) { return padT + innerH - (v / maxValue) * innerH; }

    var bepX = x(Math.min(breakEvenExact, maxOutput));
    var bepValue = be.sellingPrice * breakEvenExact;
    var bepY = y(Math.min(bepValue, maxValue));
    var lossPoly = r2(x(0)) + "," + r2(y(be.fixedCosts)) + " " + r2(bepX) + "," + r2(bepY) + " " + r2(x(0)) + "," + r2(y(0));
    var profitPoly = r2(bepX) + "," + r2(bepY) + " " + r2(x(maxOutput)) + "," + r2(y(maxOutput * be.sellingPrice)) + " " + r2(x(maxOutput)) + "," + r2(y(be.fixedCosts + maxOutput * be.variableCost));
    var yTicks = [0.25, 0.5, 0.75, 1].map(function (f) { return maxValue * f; });
    var xTicks = [0, Math.round(maxOutput / 2 / 500) * 500, maxOutput];
    var currentX = x(be.currentOutput);
    var currentProfitDotY = y(be.currentOutput * be.sellingPrice);
    var bracketLeft = x(Math.min(breakEvenExact, be.currentOutput));
    var bracketRight = x(Math.max(breakEvenExact, be.currentOutput));
    var aboveBreakEven = be.currentOutput >= breakEvenExact;

    return {
      be: be, contribution: contribution, breakEvenExact: breakEvenExact, breakEvenUnits: breakEvenUnits,
      marginOfSafety: marginOfSafety, totalRevenue: totalRevenue, totalCost: totalCost, profitOrLoss: profitOrLoss,
      W: W, H: H, padL: padL, padR: padR, padT: padT, padB: padB, maxOutput: maxOutput, maxValue: maxValue,
      x: x, y: y, bepX: bepX, bepY: bepY, lossPoly: lossPoly, profitPoly: profitPoly,
      yTicks: yTicks, xTicks: xTicks, currentX: currentX, currentProfitDotY: currentProfitDotY,
      bracketLeft: bracketLeft, bracketRight: bracketRight, aboveBreakEven: aboveBreakEven
    };
  }

  function breakEvenStatsHtml(d) {
    var be = d.be;
    var mos = d.marginOfSafety;
    var mosText = (mos > 0 ? "+" + fmt(mos) : fmt(mos)) + " units";
    return '<div style="' + VIS.grid4 + '">' +
      '<div style="' + VIS.whiteCard + ';text-align:center;">' +
        '<span style="' + VIS.monoLabel + '">Contribution / Unit</span>' +
        '<span style="font:700 1.15rem/1.2 var(--font-mono,monospace);color:var(--surface-text,#0F2042);">$' + d.contribution + "</span>" +
        '<span style="' + VIS.tinyText + ';display:block;">Price − Variable</span></div>' +
      '<div style="' + VIS.whiteCard + ';text-align:center;">' +
        '<span style="' + VIS.monoLabel + '">Break-Even Output</span>' +
        '<span style="font:700 1.15rem/1.2 var(--font-mono,monospace);color:#dc2626;">' + fmt(d.breakEvenUnits) + " units</span>" +
        '<span style="' + VIS.tinyText + ';display:block;">Fixed ÷ Contribution</span></div>' +
      '<div style="' + VIS.whiteCard + ';text-align:center;">' +
        '<span style="' + VIS.monoLabel + '">Margin of Safety</span>' +
        '<span style="font:700 1.15rem/1.2 var(--font-mono,monospace);color:' + (mos >= 0 ? "#059669" : "#e11d48") + ';">' + mosText + "</span>" +
        '<span style="' + VIS.tinyText + ';display:block;">Current − Break-Even</span></div>' +
      '<div style="' + VIS.whiteCard + ';text-align:center;">' +
        '<span style="' + VIS.monoLabel + '">Profit / (Loss)</span>' +
        '<span style="font:700 1.15rem/1.2 var(--font-mono,monospace);color:' + (d.profitOrLoss >= 0 ? "#059669" : "#e11d48") + ';">$' + fmt(d.profitOrLoss) + "</span>" +
        '<span style="' + VIS.tinyText + ';display:block;">Total Rev − Total Cost</span></div>' +
    "</div>";
  }

  function breakEvenChartHtml(d) {
    var s = "";
    s += '<svg viewBox="0 0 ' + d.W + " " + d.H + '" style="width:100%;height:auto;" role="img" aria-label="Break-even chart. Total cost line starts at $' + fmt(d.be.fixedCosts) + ' fixed costs and rises by $' + d.be.variableCost + ' per unit. Total revenue line rises by $' + d.be.sellingPrice + ' per unit. Break-even at ' + fmt(d.breakEvenUnits) + ' units.">';
    s += '<polygon points="' + d.lossPoly + '" fill="#FEE2E2" opacity="0.75" />';
    s += '<polygon points="' + d.profitPoly + '" fill="#DCFCE7" opacity="0.75" />';
    d.yTicks.forEach(function (tick) {
      s += '<line x1="' + d.padL + '" y1="' + r2(d.y(tick)) + '" x2="' + (d.W - d.padR) + '" y2="' + r2(d.y(tick)) + '" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4" />';
      s += '<text x="' + (d.padL - 6) + '" y="' + r2(d.y(tick) + 3.5) + '" font-size="9" text-anchor="end" fill="#94a3b8" font-family="monospace">$' + fmt(Math.round(tick / 1000)) + "k</text>";
    });
    s += '<line x1="' + d.padL + '" y1="' + r2(d.y(0)) + '" x2="' + (d.W - d.padR) + '" y2="' + r2(d.y(0)) + '" stroke="#94A3B8" stroke-width="2" />';
    s += '<line x1="' + d.padL + '" y1="' + d.padT + '" x2="' + d.padL + '" y2="' + r2(d.y(0)) + '" stroke="#94A3B8" stroke-width="2" />';
    d.xTicks.forEach(function (tick) {
      s += '<text x="' + r2(d.x(tick)) + '" y="' + r2(d.y(0) + 13) + '" font-size="9" text-anchor="middle" fill="#94a3b8" font-family="monospace">' + fmt(tick) + "</text>";
    });
    s += '<text x="' + r2(d.x(d.maxOutput)) + '" y="' + (d.H - 1) + '" font-size="8" text-anchor="end" fill="#94a3b8" font-family="monospace" text-transform="uppercase">Units of output</text>';
    s += '<line x1="' + d.padL + '" y1="' + r2(d.y(d.be.fixedCosts)) + '" x2="' + (d.W - d.padR) + '" y2="' + r2(d.y(d.be.fixedCosts)) + '" stroke="#D97706" stroke-width="2" stroke-dasharray="6 4" />';
    s += '<text x="' + (d.padL + 4) + '" y="' + r2(d.y(d.be.fixedCosts) + 12) + '" font-size="9" font-weight="bold" fill="#D97706">FC (fixed)</text>';
    s += '<line x1="' + r2(d.x(0)) + '" y1="' + r2(d.y(d.be.fixedCosts)) + '" x2="' + r2(d.x(d.maxOutput)) + '" y2="' + r2(d.y(d.be.fixedCosts + d.maxOutput * d.be.variableCost)) + '" stroke="#1E3A8A" stroke-width="2.5" />';
    s += '<line x1="' + r2(d.x(0)) + '" y1="' + r2(d.y(0)) + '" x2="' + r2(d.x(d.maxOutput)) + '" y2="' + r2(d.y(d.maxOutput * d.be.sellingPrice)) + '" stroke="#059669" stroke-width="3" />';
    s += '<text x="' + (d.W - d.padR - 2) + '" y="' + r2(d.y(d.be.fixedCosts + d.maxOutput * d.be.variableCost) - 6) + '" font-size="9" font-weight="bold" fill="#1E3A8A" text-anchor="end">Total Cost</text>';
    s += '<text x="' + (d.W - d.padR - 2) + '" y="' + Math.max(d.padT + 8, r2(d.y(d.maxOutput * d.be.sellingPrice) - 6)) + '" font-size="9" font-weight="bold" fill="#059669" text-anchor="end">Total Revenue</text>';
    s += '<line x1="' + r2(d.bepX) + '" y1="' + r2(d.bepY) + '" x2="' + r2(d.bepX) + '" y2="' + r2(d.y(0)) + '" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7" />';
    s += '<line x1="' + d.padL + '" y1="' + r2(d.bepY) + '" x2="' + r2(d.bepX) + '" y2="' + r2(d.bepY) + '" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7" />';
    s += '<circle cx="' + r2(d.bepX) + '" cy="' + r2(d.bepY) + '" r="5.5" fill="#DC2626" stroke="#ffffff" stroke-width="1.5" />';
    s += '<text x="' + r2(d.bepX) + '" y="' + Math.max(d.padT + 2, r2(d.bepY - 10)) + '" font-size="9.5" font-weight="bold" fill="#DC2626" text-anchor="middle">BEP: ' + fmt(d.breakEvenUnits) + " u</text>";
    s += '<line x1="' + r2(d.currentX) + '" y1="' + d.padT + '" x2="' + r2(d.currentX) + '" y2="' + r2(d.y(0)) + '" stroke="#7C3AED" stroke-width="1.5" stroke-dasharray="2 3" opacity="0.75" />';
    s += '<circle cx="' + r2(d.currentX) + '" cy="' + r2(d.currentProfitDotY) + '" r="4" fill="#7C3AED" stroke="#ffffff" stroke-width="1.5" />';
    var bracketColor = d.aboveBreakEven ? "#2563EB" : "#DC2626";
    s += '<line x1="' + r2(d.bracketLeft) + '" y1="' + r2(d.y(0) + 15) + '" x2="' + r2(d.bracketLeft) + '" y2="' + r2(d.y(0) + 21) + '" stroke="' + bracketColor + '" stroke-width="1.5" />';
    s += '<line x1="' + r2(d.bracketRight) + '" y1="' + r2(d.y(0) + 15) + '" x2="' + r2(d.bracketRight) + '" y2="' + r2(d.y(0) + 21) + '" stroke="' + bracketColor + '" stroke-width="1.5" />';
    s += '<line x1="' + r2(d.bracketLeft) + '" y1="' + r2(d.y(0) + 17.5) + '" x2="' + r2(d.bracketRight) + '" y2="' + r2(d.y(0) + 17.5) + '" stroke="' + bracketColor + '" stroke-width="1.5" />';
    s += '<text x="' + r2((d.bracketLeft + d.bracketRight) / 2) + '" y="' + r2(d.y(0) + 27.5) + '" font-size="8.5" text-anchor="middle" font-weight="bold" fill="' + bracketColor + '">' +
      (d.aboveBreakEven ? "Margin of Safety: " + fmt(d.marginOfSafety) + " u" : "Below break-even by " + fmt(Math.abs(d.marginOfSafety)) + " u") + "</text>";
    s += "</svg>";
    return s;
  }

  function breakEvenSlider(id, label, valueText, min, max, step, value, color) {
    return '<div>' +
      '<div style="display:flex;justify-content:space-between;font-weight:600;margin-bottom:.25rem;">' +
        "<span>" + label + "</span>" +
        '<span data-be-value="' + id + '" style="font-family:var(--font-mono,monospace);color:' + color + ';">' + valueText + "</span>" +
      "</div>" +
      '<input type="range" data-be-slider="' + id + '" aria-label="' + label + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" style="width:100%;cursor:pointer;accent-color:' + color + ';" />' +
    "</div>";
  }

  function breakEvenVisual() {
    var d = breakEvenCompute();
    var be = d.be;
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="background:var(--surface-practice,rgba(241,245,249,.7));border:1px solid rgba(100,116,139,.3);border-radius:.85rem;padding:.85rem;display:grid;gap:.75rem;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;font:700 .68rem/1.4 var(--font-mono,monospace);text-transform:uppercase;color:#64748b;">' +
        "<span>⚙️ Interactive Break-Even Variables (Slide to Test)</span>" +
        '<button type="button" data-act="be-reset" style="color:#2563eb;background:none;border:0;font:700 .7rem/1 var(--font-mono,monospace);cursor:pointer;text-decoration:underline;">Reset</button>' +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;">' +
        breakEvenSlider("fixedCosts", "Fixed Costs:", "$" + fmt(be.fixedCosts), 5000, 40000, 1000, be.fixedCosts, "#2563eb") +
        breakEvenSlider("sellingPrice", "Selling Price / unit:", "$" + be.sellingPrice, 30, 100, 1, be.sellingPrice, "#059669") +
        breakEvenSlider("variableCost", "Variable Cost / unit:", "$" + be.variableCost, 5, be.sellingPrice - 1, 1, be.variableCost, "#d97706") +
        breakEvenSlider("currentOutput", "Current Output:", fmt(be.currentOutput) + " units", 0, Math.max(3000, Math.ceil(d.breakEvenExact * 2.5)), 50, be.currentOutput, "#7c3aed") +
      "</div></div>";

    html += '<div id="ec-be-stats">' + breakEvenStatsHtml(d) + "</div>";

    html += '<div style="' + VIS.whiteCard + ';padding:.85rem;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.4rem;font:650 .65rem/1.4 var(--font-mono,monospace);color:#64748b;">' +
        "<span>● Live chart — drag the sliders and the lines move</span>" +
        "<span>Break-even where Total Revenue = Total Cost</span>" +
      "</div>" +
      '<div id="ec-be-chart">' + breakEvenChartHtml(d) + "</div>" +
    "</div>";

    html += "</div>";
    return html;
  }

  function updateBreakEven() {
    if (!root) return;
    var d = breakEvenCompute();
    var be = d.be;
    var labels = {
      fixedCosts: "$" + fmt(be.fixedCosts),
      sellingPrice: "$" + be.sellingPrice,
      variableCost: "$" + be.variableCost,
      currentOutput: fmt(be.currentOutput) + " units"
    };
    Object.keys(labels).forEach(function (k) {
      var el = root.querySelector('[data-be-value="' + k + '"]');
      if (el) el.textContent = labels[k];
    });
    var vc = root.querySelector('[data-be-slider="variableCost"]');
    if (vc) vc.max = String(Math.max(5, be.sellingPrice - 1));
    var co = root.querySelector('[data-be-slider="currentOutput"]');
    if (co) co.max = String(Math.max(3000, Math.ceil(d.breakEvenExact * 2.5)));
    var stats = root.querySelector("#ec-be-stats");
    if (stats) stats.innerHTML = breakEvenStatsHtml(d);
    var chart = root.querySelector("#ec-be-chart");
    if (chart) chart.innerHTML = breakEvenChartHtml(d);
  }

  /* ---- Section 5: Sources of Finance Matrix ---- */
  var FINANCE_SOURCES = [
    { key: "overdraft", name: "Bank Overdraft", term: "Short-Term (< 1 Year)", origin: "External", cost: "High daily interest rate; repayable immediately if recalled.", control: "No loss of ownership or voting control.", idealFor: "Emergency temporary cash shortages; paying late supplier bills until customers pay." },
    { key: "tradeCredit", name: "Trade Credit (e.g. 30–60 Days)", term: "Short-Term (< 1 Year)", origin: "External", cost: "Interest-free if paid on time, but loses early-settlement discounts.", control: "Zero loss of control.", idealFor: "Purchasing raw materials or retail stock without paying immediate cash upfront." },
    { key: "retainedProfit", name: "Retained Profit", term: "Long-Term", origin: "Internal", cost: "Zero interest to pay, but opportunity cost (shareholders miss dividends).", control: "100% control kept by current owners; zero new debt.", idealFor: "Funding sustainable long-term factory expansions or R&D without gearing risk." },
    { key: "shares", name: "Ordinary Shares (Share Capital)", term: "Permanent Long-Term", origin: "External", cost: "No interest; dividends only paid if profitable, but expensive legal prospectus fees.", control: "Dilutes voting control; risk of hostile takeover if plc.", idealFor: "Massive capital expenditure (e.g. building a new international terminal or factory)." },
    { key: "bankLoan", name: "Long-Term Bank Loan (Mortgage)", term: "Long-Term (5–25 Years)", origin: "External", cost: "Fixed or variable interest rate; requires fixed collateral (security).", control: "No ownership dilution, but bank can seize premises if loan is defaulted.", idealFor: "Purchasing freehold land and buildings with fixed monthly repayments." },
    { key: "leasing", name: "Leasing / Hire Purchase", term: "Medium-Term (2–5 Years)", origin: "External", cost: "Monthly rental fees; more expensive overall than buying outright.", control: "Zero loss of ownership control.", idealFor: "Delivery vans, photocopiers, and high-tech machines that become obsolete quickly." }
  ];

  function financeVisual() {
    var current = FINANCE_SOURCES[0];
    FINANCE_SOURCES.forEach(function (s) { if (s.key === state.financeSource) current = s; });
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="' + VIS.grid2 + '">' +
      '<div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.3);border-radius:.75rem;padding:.75rem;">' +
        '<strong style="display:block;color:#1e3a8a;margin-bottom:.25rem;font-size:.8rem;">⏱️ Short-Term Finance Needs:</strong>' +
        '<p style="' + VIS.smallText + ';margin:0;">Revenue expenditure: Day-to-day bills, inventory stock, staff wages, temporary cash-flow dips. Sources: Overdraft, Trade Credit, Debt Factoring.</p></div>' +
      '<div style="background:rgba(5,150,105,.08);border:1px solid rgba(5,150,105,.3);border-radius:.75rem;padding:.75rem;">' +
        '<strong style="display:block;color:#065f46;margin-bottom:.25rem;font-size:.8rem;">🏗️ Long-Term Finance Needs:</strong>' +
        '<p style="' + VIS.smallText + ';margin:0;">Capital expenditure: Buying fixed non-current assets (factories, machines, acquisitions). Sources: Retained Profit, Share Capital, Long-Term Loans.</p></div>' +
    "</div>";

    html += '<div style="display:flex;flex-wrap:wrap;gap:.4rem;">';
    FINANCE_SOURCES.forEach(function (s) {
      html += '<button type="button" data-act="finance-source" data-source="' + s.key + '" aria-pressed="' + (state.financeSource === s.key) + '" style="' + (state.financeSource === s.key ? VIS.pillOn : VIS.pill) + '">' + EC.esc(s.name) + "</button>";
    });
    html += "</div>";

    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;border-bottom:1px solid rgba(100,116,139,.2);padding-bottom:.5rem;">' +
        '<h4 style="font:650 1.05rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">' + EC.esc(current.name) + "</h4>" +
        '<span style="display:flex;gap:.4rem;">' +
          '<span style="' + VIS.tagBlue + '">' + EC.esc(current.term) + "</span>" +
          '<span style="' + VIS.tagGreen + '">' + EC.esc(current.origin) + "</span>" +
        "</span></div>" +
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;">' +
        '<div style="background:var(--surface-practice,rgba(241,245,249,.7));border-radius:.6rem;padding:.7rem;">' +
          '<span style="' + VIS.monoLabel + '">Cost &amp; Gearing Risk:</span>' +
          '<span style="' + VIS.smallText + '">' + EC.esc(current.cost) + "</span></div>" +
        '<div style="background:var(--surface-practice,rgba(241,245,249,.7));border-radius:.6rem;padding:.7rem;">' +
          '<span style="' + VIS.monoLabel + '">Impact on Ownership &amp; Control:</span>' +
          '<span style="' + VIS.smallText + '">' + EC.esc(current.control) + "</span></div>" +
        '<div style="' + VIS.tipAmber + '">' +
          '<span style="' + VIS.monoLabel + ';color:#92400e;">When to Recommend:</span>' +
          '<span style="' + VIS.smallText + ';color:#78350f;">' + EC.esc(current.idealFor) + "</span></div>" +
      "</div></div>";

    html += "</div>";
    return html;
  }

  /* ---- Section 6: Business Cycle & SPICED ---- */
  function exchangeVisual() {
    var spiced = state.exchangeState === "spiced";
    var html = '<div style="' + VIS.bodyStack + '">';

    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">🌍 The Business Cycle Wave &amp; Business Reactions</h4>' +
      '<div style="width:100%;max-height:12rem;">' +
        '<svg viewBox="0 0 650 180" style="width:100%;height:auto;" role="img" aria-label="The four phases of the business cycle wave">' +
          '<line x1="30" y1="150" x2="620" y2="150" stroke="#CBD5E1" stroke-width="2" />' +
          '<line x1="30" y1="20" x2="30" y2="150" stroke="#CBD5E1" stroke-width="2" />' +
          '<line x1="30" y1="95" x2="620" y2="95" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3" />' +
          '<text x="35" y="90" font-size="9" fill="#94A3B8" font-family="monospace">Long-term Trend Growth</text>' +
          '<path d="M 40 120 C 100 135, 140 70, 200 40 C 260 20, 310 90, 370 130 C 430 160, 480 130, 540 80 C 580 40, 610 30, 620 25" fill="none" stroke="#0F2042" stroke-width="3.5" />' +
          '<circle cx="200" cy="40" r="5" fill="#059669" /><text x="200" y="25" text-anchor="middle" font-size="10" font-weight="bold" fill="#059669">1. Boom 🌟</text>' +
          '<circle cx="310" cy="90" r="5" fill="#D97706" /><text x="310" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#D97706">2. Recession 📉</text>' +
          '<circle cx="430" cy="155" r="5" fill="#DC2626" /><text x="430" y="172" text-anchor="middle" font-size="10" font-weight="bold" fill="#DC2626">3. Slump ⚠️</text>' +
          '<circle cx="540" cy="80" r="5" fill="#2563EB" /><text x="540" y="70" text-anchor="middle" font-size="10" font-weight="bold" fill="#2563EB">4. Recovery 🚀</text>' +
        "</svg>" +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4rem;">' +
        '<div style="' + VIS.tipGreen + '"><strong style="display:block;">1. Boom</strong>High GDP, low unemployment, high wages, risk of inflation. Firms expand.</div>' +
        '<div style="' + VIS.tipAmber + '"><strong style="display:block;">2. Recession</strong>GDP falls for 2 consecutive quarters. Spending drops, firms cut investment.</div>' +
        '<div style="' + VIS.tipRed + '"><strong style="display:block;">3. Slump</strong>Peak unemployment, low consumer confidence. Survival objective for weak firms.</div>' +
        '<div style="' + VIS.tipBlue + '"><strong style="display:block;">4. Recovery</strong>GDP starts climbing again, business confidence revives, hiring resumes.</div>' +
      "</div></div>";

    html += '<div style="' + VIS.whiteCard + ';display:grid;gap:.65rem;">' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;">' +
        '<h4 style="font:650 .95rem/1.2 var(--font-serif,Georgia,serif);color:var(--surface-text,#0F2042);margin:0;">💱 Exchange Rate Movement Simulator (SPICED vs WPIDEC)</h4>' +
        '<span style="display:inline-flex;gap:.15rem;padding:.2rem;border-radius:.5rem;background:var(--surface-practice,rgba(241,245,249,.9));">' +
          '<button type="button" data-act="exchange-state" data-value="spiced" aria-pressed="' + spiced + '" style="' + (spiced ? "background:#2563eb;color:#fff;" : "color:#475569;") + 'border:0;border-radius:.4rem;padding:.35rem .6rem;font-size:.68rem;font-weight:700;cursor:pointer;">SPICED (Currency Appreciates)</button>' +
          '<button type="button" data-act="exchange-state" data-value="wpidec" aria-pressed="' + (!spiced) + '" style="' + (!spiced ? "background:#d97706;color:#fff;" : "color:#475569;") + 'border:0;border-radius:.4rem;padding:.35rem .6rem;font-size:.68rem;font-weight:700;cursor:pointer;">WPIDEC (Currency Depreciates)</button>' +
        "</span></div>";
    if (spiced) {
      html += '<div style="' + VIS.tipBlue + ';display:grid;gap:.5rem;">' +
        '<div style="font-weight:700;color:#1e3a8a;font-family:var(--font-mono,monospace);">🔤 SPICED: Stronger Pound → Imports Cheaper, Exports Dearer</div>' +
        '<div style="' + VIS.grid2 + '">' +
          '<div style="background:var(--surface,#fff);border:1px solid rgba(59,130,246,.3);border-radius:.5rem;padding:.6rem;">' +
            '<span style="display:block;color:#059669;font-weight:700;margin-bottom:.25rem;">🎉 Winners: Importing Businesses</span>' +
            '<p style="' + VIS.smallText + ';margin:0;">Firms buying raw materials or components from abroad pay less in local currency. Costs fall!</p></div>' +
          '<div style="background:var(--surface,#fff);border:1px solid rgba(59,130,246,.3);border-radius:.5rem;padding:.6rem;">' +
            '<span style="display:block;color:#e11d48;font-weight:700;margin-bottom:.25rem;">⚠️ Losers: Exporting Businesses</span>' +
            '<p style="' + VIS.smallText + ';margin:0;">Goods become more expensive for overseas buyers. Sales volumes drop unless prices are slashed.</p></div>' +
        "</div></div>";
    } else {
      html += '<div style="' + VIS.tipAmber + ';display:grid;gap:.5rem;">' +
        '<div style="font-weight:700;color:#92400e;font-family:var(--font-mono,monospace);">🔤 WPIDEC: Weaker Pound → Imports Dearer, Exports Cheaper</div>' +
        '<div style="' + VIS.grid2 + '">' +
          '<div style="background:var(--surface,#fff);border:1px solid rgba(245,158,11,.3);border-radius:.5rem;padding:.6rem;">' +
            '<span style="display:block;color:#059669;font-weight:700;margin-bottom:.25rem;">🎉 Winners: Exporting Businesses</span>' +
            '<p style="' + VIS.smallText + ';margin:0;">Products become cheaper abroad. Competitive edge boosts international sales and foreign revenue!</p></div>' +
          '<div style="background:var(--surface,#fff);border:1px solid rgba(245,158,11,.3);border-radius:.5rem;padding:.6rem;">' +
            '<span style="display:block;color:#e11d48;font-weight:700;margin-bottom:.25rem;">⚠️ Losers: Importing Businesses</span>' +
            '<p style="' + VIS.smallText + ';margin:0;">Imported supplies, oil, and parts cost far more. Cost-push inflation squeezes profit margins.</p></div>' +
        "</div></div>";
    }
    html += "</div>";

    html += "</div>";
    return html;
  }

  /* Build a section-specific interactive concept diagram. */
  function sectionVisualContent(code) {
    if (!SECTION_VISUAL_META[code]) return '<p style="' + VS.intro + '">Visual content is not available for this section.</p>';
    var tab = activeVisualTab(code);
    var html = visualTabsHtml(code);
    html += '<div style="' + VIS.bodyStack + '">';
    if (code === "2") {
      html += tab === "herzberg" ? herzbergVisual() : (tab === "org" ? orgHierarchyVisual() : maslowVisual());
    } else if (code === "3") {
      html += plcVisual();
    } else if (code === "4") {
      html += breakEvenVisual();
    } else if (code === "5") {
      html += financeVisual();
    } else if (code === "6") {
      html += exchangeVisual();
    }
    html += "</div>";
    return html;
  }

  /* Overlay shell shared by all six visuals, with a close button and Escape handling. */
  function renderVisualOverlay() {
    var title, subtitle, badge, iconChar, body, label;
    var shellClass = "ec-cl-visual-overlay z-50 flex items-center justify-center backdrop-blur-sm p-3 sm:p-5";
    var panelClass = "relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF9F6] dark:bg-black border shadow-2xl my-auto";
    if (state.showFactors) {
      title = "The 4 Factors of Production & Factor Rewards";
      subtitle = "Land · Labour · Capital · Enterprise — and the reward each factor earns";
      badge = "Cambridge Syllabus Core 1.1 / Unit 1";
      iconChar = "\uD83C\uDFDB\uFE0F";
      body = factorsVisualContent();
      label = "The 4 Factors of Production & Factor Rewards";
    } else if (state.visualSection) {
      var meta = SECTION_VISUAL_META[state.visualSection] || {};
      title = meta.title || ("Section " + state.visualSection + " Visuals");
      subtitle = meta.subtitle || "";
      badge = "Cambridge 0264 Visual Studio";
      iconChar = meta.icon || "\uD83D\uDCC8";
      body = sectionVisualContent(state.visualSection);
      label = title;
    } else {
      return "";
    }

    return '<div class="' + shellClass + '" role="dialog" aria-modal="true" aria-label="' + EC.esc(label) + '" style="' + VS.overlay + '">' +
      '<div class="' + panelClass + '" style="' + VS.panel + '">' +
        '<header style="' + VS.header + '">' +
          '<div style="min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">' +
              '<span aria-hidden="true" style="font-size:1.5rem;padding:.4rem;border-radius:.75rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);">' + iconChar + "</span>" +
              '<span style="' + VS.badge + '">' + EC.esc(badge) + "</span>" +
              (state.showFactors ? '<span style="' + VS.kicker + ';color:#bfdbfe;">Syllabus 0264</span>' : '<span style="' + VS.kicker + ';color:#bfdbfe;">Section ' + EC.esc(state.visualSection) + "</span>") +
            "</div>" +
            '<h2 style="' + VS.title + '">' + EC.esc(title) + "</h2>" +
            (subtitle ? '<p style="' + VS.subtitle + '">' + EC.esc(subtitle) + "</p>" : "") +
          "</div>" +
          '<div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;">' +
            (state.showFactors ? factorTabsHtml() : "") +
            '<button type="button" data-act="visual-close" aria-label="Close visual" title="Close" style="' + VS.close + '">' + icon("x", 20) + "</button>" +
          "</div>" +
        "</header>" +
        '<div style="' + VS.body + '">' + body + "</div>" +
      "</div>" +
    "</div>";
  }

  function closeVisual() {
    if (!state.showFactors && !state.visualSection) return;
    state.showFactors = false;
    state.visualSection = null;
    rerender(false);
  }

  function renderContent() {
    if (!root) return;
    var info = visibleSet();
    var counts = countsFor(allPoints);
    var rated = counts.all - counts.unrated;
    var percent = counts.all ? Math.round((rated / counts.all) * 100) : 0;
    var weighted = allPoints.reduce(function (sum, p) {
      var r = ratingOf(p.id);
      return sum + (r === "easy" ? 100 : r === "moderate" ? 60 : r === "hard" ? 20 : 0);
    }, 0);
    var mastery = counts.all ? Math.round(weighted / counts.all) : 0;
    var isSearching = info.words.length > 0 || state.filter !== "all";
    var visibleIds = {};
    info.visible.forEach(function (p) { visibleIds[p.id] = true; });
    var topics = [];
    info.visible.forEach(function (p) { if (topics.indexOf(p.topicCode) === -1) topics.push(p.topicCode); });
    var allExpanded = topics.length > 0 && topics.every(function (code) {
      var key = (isSearching ? "filtered-" : "") + code;
      return state.expanded.hasOwnProperty(key) ? state.expanded[key] : isSearching;
    });

    var sectionNav = '<button type="button" data-act="section" data-code="all" aria-pressed="' + (state.section === "all") + '">' +
      icon("listChecks", 17) + "<strong>All sections</strong></button>";
    groups.forEach(function (s) {
      var sectionRated = s.pointIds.filter(function (id) { return state.ratings[id]; }).length;
      sectionNav += '<button type="button" data-act="section" data-code="' + EC.esc(s.code) + '" aria-pressed="' + (state.section === s.code) + '">' +
        '<span class="checklist-section-code">' + EC.esc(s.code) + "</span>" +
        '<span class="checklist-section-label"><strong>' + EC.esc(s.label) + "</strong>" +
        "<small>" + sectionRated + " of " + s.pointIds.length + " rated</small></span></button>";
    });

    var filters = "";
    FILTER_OPTIONS.forEach(function (option) {
      var active = state.filter === option.value;
      filters += '<button type="button" data-act="filter" data-rating="' + option.value + '" data-value="' + option.value + '" aria-pressed="' + active + '">' +
        '<span aria-hidden="true"></span>' + option.label + " <small>" + info.counts[option.value] + "</small></button>";
    });

    var footerActions = "";
    if (topics.length) {
      footerActions += button(allExpanded ? "Collapse topics" : "Expand topics", allExpanded ? "collapse-all" : "expand-all", "checklist-secondary");
    }
    if (rated > 0) footerActions += button(icon("rotateCcw", 15) + " Reset ratings", "reset", "checklist-reset");
    footerActions += button("Export CSV", "export", "checklist-secondary");
    footerActions += button(icon("brain", 17) + " Start recall", "launch", "checklist-primary", "", info.visible.length === 0);

    var list = "";
    if (!info.visible.length) {
      list = '<div class="checklist-empty"><h2>No matching points</h2>' +
        "<p>Try a different search, section or confidence filter.</p>" +
        button("Clear filters", "clear", "checklist-secondary") + "</div>";
    } else {
      groups.forEach(function (section) { list += renderSection(section, visibleIds, isSearching); });
    }

    var html = '<div class="study-page checklist">' +
      '<header class="checklist-hero">' +
        '<div class="checklist-hero-copy">' +
          '<p class="checklist-kicker">Cambridge IGCSE Business · 0264</p>' +
          "<h1>Revision checklist</h1>" +
          "<p>Rate what you remember, then quiz yourself on the points that need more practice.</p>" +
          (counts.hard > 0 ? button(icon("brain", 17) + " Review hard points " + icon("arrowRight", 17), "review-hard", "checklist-hero-action") : "") +
        "</div>" +
        '<div class="checklist-hero-visual">' +
          '<div class="checklist-progress-card">' +
            '<div class="checklist-progress-head">' +
              "<div>" + icon("listChecks", 18) + " Points rated</div>" +
              "<strong>" + (rated > 0 && percent === 0 ? "&lt;1" : percent) + "%</strong>" +
            "</div>" +
            '<progress aria-label="Syllabus points rated" value="' + rated + '" max="' + counts.all + '"></progress>' +
            "<p>" + rated + " of " + counts.all + " syllabus points</p>" +
            "<p>Overall mastery: <strong>" + mastery + "%</strong>" +
              '<span style="opacity:.75;"> (Easy 100 · Moderate 60 · Hard 20)</span></p>' +
          "</div>" +
        "</div>" +
      "</header>" +
      '<div class="checklist-workspace">' +
        '<aside class="checklist-rail" aria-labelledby="checklist-section-title">' +
          '<h2 id="checklist-section-title">Syllabus sections</h2>' +
          '<label class="checklist-scope-label">' +
            '<span class="sr-only">Syllabus section</span>' +
            '<select id="ec-cl-section" aria-label="Syllabus section">' + sectionOptions() + "</select>" +
          "</label>" +
          '<nav class="checklist-section-list" aria-label="Syllabus sections">' + sectionNav + "</nav>" +
        "</aside>" +
        '<div class="checklist-content">' +
          '<div class="checklist-toolbar">' +
            '<label class="checklist-search">' + icon("search", 19) +
              '<input id="ec-cl-search" type="search" aria-label="Search the syllabus" placeholder="Search terms or topic codes" value="' + EC.esc(state.query) + '" />' +
            "</label>" +
            '<div class="checklist-filters" role="group" aria-label="Filter by confidence">' + filters + "</div>" +
            '<div class="checklist-toolbar-footer">' +
              '<p role="status">' + info.visible.length + " matching " + (info.visible.length === 1 ? "point" : "points") + "</p>" +
              "<div>" + footerActions + "</div>" +
            "</div>" +
          "</div>" +
          list +
        "</div>" +
      "</div>" +
      renderDialog() +
    "</div>";
    root.innerHTML = html + renderVisualOverlay();
    if (!wired) { wire(); wired = true; }
    wireDialog();
    var dialog = root.querySelector("#ec-cl-dialog");
    if (dialog && state.drill && typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    if (state.showFactors || state.visualSection) {
      var closeButton = root.querySelector('.ec-cl-visual-overlay [data-act="visual-close"]');
      if (closeButton) closeButton.focus();
    }
  }

  function rerender(focusSearch, caret) {
    renderContent();
    if (focusSearch) {
      var input = root.querySelector("#ec-cl-search");
      if (input) {
        input.focus();
        try { input.setSelectionRange(caret, caret); } catch (e) {}
      }
    }
  }

  function startRecall(points) {
    if (!points || !points.length) return;
    state.drill = { points: points.slice(), index: 0 };
    state.drillAnswer = "";
    state.drillAnswers = {};
    state.drillSummary = false;
    rerender(false);
  }

  function rate(id, value) {
    if (!byId[id]) return;
    if (state.ratings[id] === value) {
      delete state.ratings[id];
    } else {
      state.ratings[id] = value;
      EC.addCoins(5);
    }
    EC.store.set(RATINGS_KEY, state.ratings);
    rerender(false);
  }

  function uniqueTopicCodes(points) {
    var out = [];
    points.forEach(function (p) { if (out.indexOf(p.topicCode) === -1) out.push(p.topicCode); });
    return out;
  }

  function practice(sectionCode, topicCode) {
    EC.navigate("practice", {
      unit: sectionCode || "all",
      q: state.query,
      section: sectionCode || "all",
      topic: topicCode || "",
      source: "checklist"
    });
  }

  function launchPractice() {
    var points = visibleSet().visible;
    var topicCodes = uniqueTopicCodes(points);
    var sectionCodes = [];
    points.forEach(function (p) { if (sectionCodes.indexOf(p.sectionCode) === -1) sectionCodes.push(p.sectionCode); });
    EC.navigate("practice", {
      unit: state.section !== "all" ? state.section : (sectionCodes.length === 1 ? sectionCodes[0] : "all"),
      q: state.query,
      section: state.section !== "all" ? state.section : (sectionCodes.length === 1 ? sectionCodes[0] : "all"),
      topic: topicCodes.length === 1 ? topicCodes[0] : "",
      topics: topicCodes.join(","),
      rating: state.filter === "all" || state.filter === "unrated" ? "" : state.filter,
      source: "checklist",
      points: String(points.length)
    });
  }

  function exportCsv() {
    var rows = [["ID", "Section", "Topic", "Subtopic", "Statement", "Rating", "Note"]];
    allPoints.forEach(function (p) {
      rows.push([p.id, p.sectionTitle, p.topicCode + " " + p.topicTitle, p.subtopicCode + " " + p.subtopicTitle,
        p.text, ratingOf(p.id) === "unrated" ? "" : ratingOf(p.id), ""]);
    });
    var csv = rows.map(function (row) {
      return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");
    try {
      var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "ecbiz-syllabus-checklist.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
    } catch (e) {
      window.alert("CSV export is not available in this browser.");
    }
  }

  function wire() {
    root.addEventListener("click", function (event) {
      var target = event.target;
      while (target && target !== root && !(target.getAttribute && target.getAttribute("data-act"))) target = target.parentNode;
      if (!target || target === root) return;
      var act = target.getAttribute("data-act");
      var id = target.getAttribute("data-id");
      var value = target.getAttribute("data-value");
      if (act === "rate") {
        rate(id, value);
      } else if (act === "recall") {
        if (byId[id]) startRecall([byId[id]]);
      } else if (act === "review-hard") {
        startRecall(allPoints.filter(function (p) { return ratingOf(p.id) === "hard"; }));
      } else if (act === "toggle-topic") {
        var key = target.getAttribute("data-code");
        state.expanded[key] = !state.expanded[key];
        rerender(false);
      } else if (act === "expand-all" || act === "collapse-all") {
        var info = visibleSet();
        var searching = info.words.length > 0 || state.filter !== "all";
        var codes = uniqueTopicCodes(info.visible);
        codes.forEach(function (code) { state.expanded[(searching ? "filtered-" : "") + code] = act === "expand-all"; });
        rerender(false);
      } else if (act === "section") {
        state.section = target.getAttribute("data-code");
        rerender(false);
      } else if (act === "filter") {
        state.filter = value;
        rerender(false);
      } else if (act === "clear") {
        state.query = "";
        state.section = "all";
        state.filter = "all";
        rerender(false);
      } else if (act === "reset") {
        if (!window.confirm("Reset all Business syllabus confidence ratings?")) return;
        allPoints.forEach(function (p) { delete state.ratings[p.id]; });
        EC.store.set(RATINGS_KEY, state.ratings);
        rerender(false);
      } else if (act === "export") {
        exportCsv();
      } else if (act === "launch") {
        launchPractice();
      } else if (act === "practice-section") {
        practice(target.getAttribute("data-section"), "");
      } else if (act === "practice-topic") {
        practice(target.getAttribute("data-section"), target.getAttribute("data-topic"));
      } else if (act === "open-factors") {
        state.visualSection = null;
        state.showFactors = true;
        rerender(false);
      } else if (act === "open-visual") {
        state.showFactors = false;
        state.visualSection = target.getAttribute("data-section");
        rerender(false);
      } else if (act === "visual-close") {
        closeVisual();
      } else if (act === "factor-tab") {
        state.factorTab = target.getAttribute("data-tab") === "circular" ? "circular" : "factors";
        rerender(false);
      } else if (act === "select-factor") {
        var fk = target.getAttribute("data-factor");
        if (FACTORS_DATA[fk]) state.selectedFactor = fk;
        rerender(false);
      } else if (act === "visual-tab") {
        var code = state.visualSection;
        if (code) state.visualTab[code] = target.getAttribute("data-tab");
        rerender(false);
      } else if (act === "maslow-tier") {
        state.maslowTier = Number(target.getAttribute("data-level")) || 5;
        rerender(false);
      } else if (act === "herzberg-mode") {
        state.herzbergMode = target.getAttribute("data-mode") || "both";
        rerender(false);
      } else if (act === "org-type") {
        state.orgType = target.getAttribute("data-type") || "tall";
        rerender(false);
      } else if (act === "org-highlight") {
        var hv = target.getAttribute("data-value");
        state.orgHighlight = state.orgHighlight === hv ? "none" : hv;
        rerender(false);
      } else if (act === "plc-stage") {
        state.plcStage = target.getAttribute("data-stage") || "maturity";
        rerender(false);
      } else if (act === "plc-extension") {
        state.plcExtension = !state.plcExtension;
        rerender(false);
      } else if (act === "be-reset") {
        state.be = { fixedCosts: 20000, sellingPrice: 50, variableCost: 25, currentOutput: 1000 };
        rerender(false);
      } else if (act === "finance-source") {
        state.financeSource = target.getAttribute("data-source") || "overdraft";
        rerender(false);
      } else if (act === "exchange-state") {
        state.exchangeState = target.getAttribute("data-value") === "wpidec" ? "wpidec" : "spiced";
        rerender(false);
      } else if (act === "dialog-close") {
        state.drill = null;
        state.drillSummary = false;
        rerender(false);
      } else if (act === "dialog-prev" && state.drill && state.drill.index > 0) {
        var prevPoint = state.drill.points[state.drill.index];
        state.drillAnswers[prevPoint.id] = state.drillAnswer;
        state.drill.index--;
        state.drillAnswer = state.drillAnswers[state.drill.points[state.drill.index].id] || "";
        rerender(false);
      } else if (act === "dialog-retry-missed" && state.drill) {
        var missed = state.drill.points.filter(function (p) {
          return ratingOf(p.id) !== "easy" || !String(state.drillAnswers[p.id] || "").trim();
        });
        if (!missed.length) missed = state.drill.points.slice();
        state.drill = { points: missed, index: 0 };
        state.drillAnswers = {};
        state.drillAnswer = "";
        state.drillSummary = false;
        rerender(false);
      } else if (act === "dialog-next" && state.drill) {
        var answerPoint = state.drill.points[state.drill.index];
        state.drillAnswers[answerPoint.id] = state.drillAnswer;
        state.drillAnswer = "";
        if (state.drill.index + 1 === state.drill.points.length) {
          state.drillSummary = true;
          rerender(false);
        } else {
          state.drill.index++;
          state.drillAnswer = state.drillAnswers[state.drill.points[state.drill.index].id] || "";
          rerender(false);
        }
      } else if (act === "dialog-practice" && state.drill) {
        var current = state.drill.points[state.drill.index];
        practice(current.sectionCode, current.topicCode);
      }
    });

    root.addEventListener("input", function (event) {
      var target = event.target;
      if (!target || !target.getAttribute) return;
      if (target.id === "ec-cl-search") {
        state.query = target.value;
        rerender(true, target.selectionStart);
      } else if (target.id === "ec-cl-answer") {
        state.drillAnswer = target.value;
        if (state.drill && state.drill.points[state.drill.index]) {
          state.drillAnswers[state.drill.points[state.drill.index].id] = target.value;
        }
      } else if (target.getAttribute("data-be-slider")) {
        var field = target.getAttribute("data-be-slider");
        if (state.be.hasOwnProperty(field)) {
          state.be[field] = Number(target.value);
          updateBreakEven();
        }
      }
    });

    root.addEventListener("change", function (event) {
      var target = event.target;
      if (!target || !target.getAttribute) return;
      if (target.id === "ec-cl-section") {
        state.section = target.value;
        rerender(false);
      }
    });

    if (!escapeWired) {
      document.addEventListener("keydown", function (event) {
        if ((event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) &&
            (state.showFactors || state.visualSection)) {
          event.preventDefault();
          closeVisual();
        }
      });
      escapeWired = true;
    }
  }

  function wireDialog() {
    var dialog = root.querySelector("#ec-cl-dialog");
    if (!dialog) return;
    dialog.addEventListener("close", function () {
      if (!document.body.contains(dialog)) return;
      if (state.drill) {
        state.drill = null;
        rerender(false);
      }
    });
  }

  EC.register("checklist", {
    title: "Revision checklist",
    render: function (main, params) {
      if (root !== main) { root = main; wired = false; }
      if (params) {
        if (params.get("section")) state.section = params.get("section");
        if (params.get("rating")) state.filter = params.get("rating");
        if (params.get("q")) state.query = params.get("q");
      }
      if (!allPoints.length) {
        return EC.load("syllabus-static").then(function (data) {
          prepare(data);
          return EC.load("glossary").then(function (terms) {
            glossaryTerms = terms || [];
          }, function () {
            glossaryTerms = [];
          });
        }).then(function () {
          renderContent();
        });
      }
      renderContent();
    }
  });
})();
