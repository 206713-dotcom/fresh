/* EcBiz extras views — destination index, provenance, help, CSV export,
 * flashcards, dashboard and legacy-link aliases.
 * Plain ES5 browser JavaScript: no imports, libraries or build step. */
(function () {
  "use strict";

  if (!window.EC) return;
  var EC = window.EC;

  function h(value) { return EC.esc(value); }

  /* Never replace a view that another script has already registered. */
  function add(name, definition) {
    if (!EC.views[name]) EC.register(name, definition);
  }

  function heading(text) {
    return '<h2 style="font:700 20px Georgia,serif;margin:20px 0 8px">' + h(text) + '</h2>';
  }

  function paragraph(text) {
    return '<p style="max-width:62em;line-height:1.6">' + h(text) + '</p>';
  }

  function bullets(items, ordered) {
    var tag = ordered ? "ol" : "ul", out = ['<' + tag + ' style="max-width:62em;line-height:1.6">'];
    for (var i = 0; i < items.length; i++) {
      out.push('<li>' + h(items[i]) + '</li>');
    }
    out.push('</' + tag + '>');
    return out.join("");
  }

  function internalLink(name, label) {
    return '<a href="?open=' + h(name) + '">' + h(label) + '</a>';
  }

  function externalLink(url, label) {
    return '<a href="' + h(url) + '" target="_blank" rel="noopener noreferrer">' + h(label) + ' ↗</a>';
  }

  /* ---------------------------------------------------------------- */
  /* extras — an index of every other available destination            */
  /* ---------------------------------------------------------------- */

  var VIEW_INFO = {
    overview: ["Overview", "The EcBiz home page: what is here and where to begin."],
    progress: ["My progress", "Questions attempted, AO breakdown, saved answers and local records."],
    dashboard: ["My progress (dashboard)", "The compact progress view opened by older dashboard links."],
    practice: ["Paper 1 studio", "Topical scenarios with command words, mark schemes and model answers."],
    paper1: ["Paper 1 question bank", "Structured Paper 1 practice sets across the six sections."],
    paper2: ["Paper 2 case studies", "Unseen cases, three appendices and 8- / 12-mark questions."],
    lessons: ["Interactive lessons", "24 guided lessons with hints, gap-fills and confidence tracking."],
    checklist: ["Syllabus checklist", "All 255 syllabus statements to triage, note and track."],
    glossary: ["Glossary", "275 key terms with definitions, examples and exam advice."],
    flashcards: ["Flashcards", "Flip through glossary terms for quick recall."],
    compare: ["Advantages &amp; disadvantages", "165 comparison notes organised by section and topic."],
    review: ["Mistake review", "Revisit Boss Battle errors and the matching mark schemes."],
    quiz: ["Quick Quiz", "12,000 MCQs plus the daily and weekly timed challenges."],
    "quick-quiz": ["Quick Quiz (legacy link)", "The MCQ view opened by the React router's ?open=quick-quiz link."],
    challenge: ["Daily challenge", "The timed daily / weekly quiz opened by old challenge links."],
    studyspace: ["Study Space", "The focus widget opened by the ?open=studyspace link."],
    "study-space": ["Study Space", "The draggable focus widget and Pomodoro timer."],
    drill: ["Active recall drills", "Chapter-by-chapter MCQ drills with Wrong Only review."],
    "boss-battle": ["Boss Battle", "The two-dimensional business quiz game with six bosses."],
    boss: ["Boss Battle", "The business quiz game opened by older links."],
    mocks: ["Mock exams", "Timed Paper 1 and Paper 2 practice papers with a review screen."],
    "ai-marker": ["AI marker", "How the local marking engine gives feedback on written answers."],
    misc: ["Miscellaneous", "Additional ported study content."],
    sources: ["Sources &amp; coverage", "What is official, what is practice, and the scope of the course."],
    help: ["Help", "A short guide to using every part of EcBiz."],
    export: ["Export progress", "Download your local study records as a CSV file."],
    signin: ["Old sign-in link", "Account screens were removed; this opens local progress."],
    "sign-in": ["Old sign-in link", "Account screens were removed; this opens local progress."],
    signup: ["Old sign-up link", "Account screens were removed; this opens local progress."],
    "sign-up": ["Old sign-up link", "Account screens were removed; this opens local progress."]
  };

  add("extras", {
    title: "Extras & tools",
    render: function (main) {
      var names = [], i, name, info;
      /* Curated order first, then any view registered elsewhere. */
      for (name in VIEW_INFO) {
        if (Object.prototype.hasOwnProperty.call(VIEW_INFO, name) && EC.views[name] && name !== "extras") {
          names.push(name);
        }
      }
      var all = Object.keys(EC.views);
      for (i = 0; i < all.length; i++) {
        if (all[i] !== "extras" && names.indexOf(all[i]) === -1) names.push(all[i]);
      }

      var out = ['<div class="ec-page">'];
      out.push('<h1>Extras &amp; tools</h1>');
      out.push('<p class="ec-meta">Every destination in the static EcBiz app, in one place</p>');
      out.push('<p style="max-width:62em;line-height:1.6">Use the cards below to jump to any study tool, ' +
        'the source and privacy information, or your local records. Everything runs in this browser, ' +
        'so there is nothing to install and no account to create.</p>');
      out.push('<div class="ec-card-grid">');
      for (i = 0; i < names.length; i++) {
        name = names[i];
        info = VIEW_INFO[name] || [h(name), "Open this EcBiz section."];
        out.push('<a class="ec-card" href="?open=' + h(name) + '">' +
          '<h2>' + info[0] + '</h2><p>' + info[1] + '</p></a>');
      }
      out.push('</div>');
      out.push(heading("About this site"));
      out.push('<p style="max-width:62em;line-height:1.6">' +
        internalLink("sources", "Sources &amp; coverage") + ' · ' +
        internalLink("help", "Help") + ' · ' +
        internalLink("export", "Export progress") + ' · ' +
        externalLink("../../privacy.html", "Privacy notice") + '</p>');
      out.push('</div>');
      main.innerHTML = out.join("");
    }
  });

  /* ---------------------------------------------------------------- */
  /* sources — provenance and coverage, from the README + archive      */
  /* ---------------------------------------------------------------- */

  add("sources", {
    title: "Sources & coverage",
    render: function (main) {
      var sections = [
        "Understanding business activity",
        "People in business",
        "Marketing",
        "Operations management",
        "Financial information and decisions",
        "External influences on business activity"
      ];
      var documents = [
        ["Official 0264 Specimen Paper 1 (2027) — 80 marks, 1 hour 30 minutes",
         "https://www.cambridgeinternational.org/Images/718443-2027-specimen-paper-1.pdf"],
        ["Official 0264 Specimen Paper 1 mark scheme",
         "https://www.cambridgeinternational.org/Images/718522-2027-specimen-paper-1-mark-scheme.pdf"],
        ["Official 0264 Specimen Paper 2 (2027) — case study, 80 marks",
         "https://www.cambridgeinternational.org/Images/718446-2027-specimen-paper-2.pdf"],
        ["Official 0264 Specimen Paper 2 mark scheme",
         "https://www.cambridgeinternational.org/Images/718525-2027-specimen-paper-2-mark-scheme.pdf"],
        ["Official 0264 Specimen Paper 2 case insert",
         "https://www.cambridgeinternational.org/Images/718535-2027-specimen-paper-2-insert.pdf"],
        ["Cambridge IGCSE Business Studies 0264 Syllabus (2027–2029), served locally",
         "./assets/aistudio/718123-2027-2029-syllabus_74cc6921.pdf"],
        ["CAIE IGCSE Business Studies revision guide, served locally",
         "./assets/aistudio/CAIE_-_IGCSE_-_Business_Studies__1__c3cb68cc.pdf"]
      ];

      var out = ['<div class="ec-page">'];
      out.push('<h1>Sources, coverage &amp; provenance</h1>');
      out.push('<p class="ec-meta">Cambridge IGCSE Business Studies · 0264 · Independent student project</p>');
      out.push('<div class="ec-note">EcBiz is an independent, student-built revision platform. It is not ' +
        'affiliated with, endorsed by, or connected to Cambridge International. It is a revision aid, ' +
        'not an official qualification resource. Always check the official syllabus and mark scheme.</div>');

      out.push(heading("What is official and what is practice"));
      out.push(bullets([
        "The verified archive links to inspected Cambridge and Cambridge-branded PDFs and records where each item came from. It holds 189 verified questions and 31 verified case studies, each with syllabus, year, series, paper and question number plus source and mark-scheme status fields. This is the closest thing to the real exam in the app.",
        "The large practice banks — 12,000 MCQs, 6,000 Paper 1 scenario sets and 3,000 Paper 2 cases — are Cambridge-style questions written for revision. They follow the syllabus, command words and mark-scheme shape, but they are not past papers and should not be quoted as official. Most of this content was generated with Gemini using Cambridge model answers as the basis, then structured, checked and edited.",
        "The AI examiner produces practice feedback, not an official grade. It can be harsh, generous or wrong: use the mark scheme, the model answer and your teacher's judgement. Marking and the fixed rule scans run on your device.",
        "Lesson, glossary and chapter-summary material is original teaching copy mapped to the 0264 syllabus and the Sixth Edition textbook sequence. It is a study aid, not a replacement for the textbook or your teacher.",
        "Question flags and notes you add are local notes for you on this device."
      ]));

      out.push(heading("The document archive"));
      out.push(paragraph("The archive gives zero-cost access to official specimen papers, mark schemes, " +
        "the case insert, the current syllabus and a revision guide. Specimen papers link to Cambridge; " +
        "the syllabus and revision guide are served locally."));
      var links = [];
      for (var i = 0; i < documents.length; i++) {
        links.push(externalLink(documents[i][1], documents[i][0]));
      }
      out.push('<ul style="max-width:62em;line-height:1.6"><li>' + links.join('</li><li>') + '</li></ul>');
      out.push('<p style="max-width:62em;line-height:1.6">' +
        externalLink("https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-business-0264/",
          "Cambridge 0264 qualification portal") + '</p>');

      out.push(heading("Scope of the six sections"));
      out.push(paragraph("EcBiz covers the six sections of Cambridge IGCSE Business Studies (0264):"));
      out.push(bullets(sections, true));
      out.push(paragraph("The 255 syllabus statements are the scaffold. Not every statement has its own " +
        "simulation or lesson: the platform is a set of selected learning activities, not a claim of " +
        "complete outcome-level coverage."));

      out.push(heading("Local progress and privacy"));
      out.push(bullets([
        "Business Studies saves answer drafts, submissions, checklist ratings, lessons, quiz history, Boss Battle mistakes, coins and themes in this browser's localStorage.",
        "There is no account and no sync. Clearing site data or using another browser or device starts a separate study record.",
        "The former account screens and Google Sheets connection were removed. Old sign-in, sign-up and dashboard query links now open the local progress page.",
        "You can download your own records with the CSV export, and clear submissions from the progress page.",
        "AI marking runs on the device. The first model download needs an internet connection; after that, essay text is not uploaded by the app.",
        "Privacy notice: " + "see the Fresh privacy page linked in the site footer."
      ]));
      out.push('<p style="max-width:62em;line-height:1.6">' +
        externalLink("../../privacy.html", "Read the full privacy notice") + '</p>');

      out.push(heading("Copyright and feedback"));
      out.push(paragraph("Original source code, interface text and teaching notes are MIT licensed. " +
        "Official Cambridge syllabi, specimen papers and mark schemes remain the property of Cambridge " +
        "International and are used here for reference and revision. If you spot an error or a provenance " +
        "problem, use the feedback link at the top of the project README."));
      out.push('<div class="ec-note">Want the short version of how to use all of this? Open ' +
        internalLink("help", "Help") + '.</div>');
      out.push('</div>');

      main.innerHTML = out.join("");
    }
  });

  /* ---------------------------------------------------------------- */
  /* help — a short usage guide for the whole app                      */
  /* ---------------------------------------------------------------- */

  add("help", {
    title: "Help",
    render: function (main) {
      var out = ['<div class="ec-page">'];
      out.push('<h1>How to use EcBiz</h1>');
      out.push('<p class="ec-meta">A short guide to the revision loop: learn, answer, check, return</p>');

      out.push(heading("1. Start here"));
      out.push(bullets([
        "Open " + "Overview for a map of the app, or jump straight to a tool using the top navigation bar.",
        "Everything is saved in this browser. There is no sign-in; refreshing the page restores your work.",
        "Use the Extras page if you cannot find a destination."
      ]));
      out.push('<p style="max-width:62em;line-height:1.6">' +
        internalLink("extras", "Open the Extras index") + '</p>');

      out.push(heading("2. Learn the topic"));
      out.push(bullets([
        "Lessons: 24 guided reads. Reveal hidden terms gradually with Hint, complete the gap-fill, then rate the question Easy, Moderate or Hard.",
        "Syllabus checklist: triage all 255 statements, add notes, reveal the mark scheme and launch a practice set from the ones you flagged.",
        "Glossary: look up any of the 275 terms with syllabus reference, example and exam advice; mark terms as mastered to shrink the list.",
        "Flashcards: flip through the glossary terms for quick recall, filter by unit, and mark cards you know."
      ]));

      out.push(heading("3. practise writing answers"));
      out.push(bullets([
        "Paper 1: choose a section and topic, read the case, then answer parts (a)–(d). Check the mark-scheme viewer, AO-highlight viewer and model answer. Use Instant marking or the local Qwen model.",
        "Paper 2: read the unseen case and Appendices 1–3, then answer the 8- and 12-mark pairs. Twelve-mark answers use the official Level bands, not point counting.",
        "Mocks: sit a timed Paper 1 or Paper 2 paper with no navigation or widgets, then mark yourself against the model answers.",
        "Compare notes: revision notes in the 'on the one hand / on the other hand' shape that evaluation questions reward."
      ]));

      out.push(heading("4. Drill and revisit"));
      out.push(bullets([
        "Quick Quiz: filter the 12,000 MCQs by section and sub-topic, pick 3/5/10/20 questions, and reshuffle whenever you like.",
        "Wrong Only: missed questions go into a review bank. A question leaves it only after a correct answer on two different days.",
        "Daily Blitz and Weekly Master: the same timed 60-second question for everyone, picked from the UTC date or week, with coin bonuses.",
        "Mistake review: Boss Battle errors can be reviewed against the mark scheme and pushed into MCQ Wrong Only.",
        "Boss Battle: a two-dimensional game with six bosses, filters, spaced repetition and upgrades."
      ]));

      out.push(heading("5. Check your record"));
      out.push(bullets([
        "My progress shows questions attempted, average mark, AO1–AO4 totals, examiner notes and submission history. You can clear submissions there.",
        "Export progress downloads your local records as a CSV from this browser, including submissions, checklist ratings, lessons, quiz history and settings.",
        "Study Coins are earned across quizzes, lessons, challenges and the game; themes are CSS-variable swaps, some unlocked with coins.",
        "The dashboard, sign-in and sign-up links all open the same local progress page — no account is involved."
      ]));

      out.push(heading("6. Good to know"));
      out.push(bullets([
        "Your work never leaves this device. Different browsers and devices have separate records.",
        "The AI marker is a practice tool. If WebGPU is unavailable, the built-in Instant examiner still marks your answer.",
        "The source of every document and question type is explained on the Sources & coverage page.",
        "Found a mistake? Every question view has a Flag button; your note stays on this device."
      ]));

      out.push('<p style="max-width:62em;line-height:1.6">' +
        internalLink("sources", "Sources &amp; coverage") + ' · ' +
        internalLink("export", "Export progress") + ' · ' +
        externalLink("../../privacy.html", "Privacy notice") + '</p>');
      out.push('</div>');
      main.innerHTML = out.join("");
    }
  });

  /* ---------------------------------------------------------------- */
  /* export — download local progress as CSV using a Blob              */
  /* ---------------------------------------------------------------- */

  add("export", {
    title: "Export progress (CSV)",
    render: function (main) {
      var root = document.createElement("div");
      root.className = "ec-page";
      main.innerHTML = "";
      main.appendChild(root);

      function csvCell(value) {
        var text = String(value == null ? "" : value);
        if (/[",\r\n]/.test(text)) text = '"' + text.replace(/"/g, '""') + '"';
        return text;
      }

      function csvRow(cells) {
        var parts = [], i;
        for (i = 0; i < cells.length; i++) parts.push(csvCell(cells[i]));
        return parts.join(",");
      }

      function display(value) {
        if (value == null) return "";
        if (typeof value === "string") return value;
        try { return JSON.stringify(value); } catch (err) { return String(value); }
      }

      function field(obj, names) {
        for (var i = 0; i < names.length; i++) {
          if (obj && obj[names[i]] !== undefined && obj[names[i]] !== null) return obj[names[i]];
        }
        return "";
      }

      function buildRows() {
        var rows = [[ "Category", "Item", "Status", "Question / title", "Detail / value", "Exported at" ]];
        var stamp = new Date().toISOString();
        var keys = EC.store.keys().slice().sort();
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = EC.store.get(key, null);
          if (Object.prototype.toString.call(value) === "[object Array]") {
            for (var j = 0; j < value.length; j++) {
              var item = value[j];
              if (item && typeof item === "object") {
                rows.push(["Saved record", key + " #" + (j + 1),
                  field(item, ["status", "result", "isCorrect", "grade", "level"]),
                  field(item, ["question", "title", "term", "text", "wording", "id"]),
                  display(item), stamp]);
              } else {
                rows.push(["Saved record", key + " #" + (j + 1), "Saved", "", display(item), stamp]);
              }
            }
          } else {
            rows.push(["Local setting", key, "Saved", "", display(value), stamp]);
          }
        }
        if (rows.length === 1) {
          rows.push(["Note", "No local progress yet", "Empty", "",
            "Nothing has been saved in this browser so far.", stamp]);
        }
        return rows;
      }

      function refreshSummary() {
        var node = root.querySelector("#ex-export-summary");
        if (!node) return;
        var count = EC.store.keys().length;
        node.innerHTML = count
          ? 'Ready to download <strong>' + count + '</strong> saved local ' + (count === 1 ? 'record' : 'records') + '.'
          : 'No local records yet — your download will contain a short note instead.';
      }

      function download() {
        var status = root.querySelector("#ex-export-status");
        var rows = buildRows();
        try {
          var csv = "\ufeff" + rows.map(csvRow).join("\r\n");
          var UrlApi = window.URL || window.webkitURL;
          if (!UrlApi || !UrlApi.createObjectURL) throw new Error("Blob URLs are unavailable");
          var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          var url = UrlApi.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "ecbiz-progress-" + new Date().toISOString().slice(0, 10) + ".csv";
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          window.setTimeout(function () { UrlApi.revokeObjectURL(url); }, 1000);
          if (status) status.textContent = "Progress CSV downloaded to this device (" + (rows.length - 1) + " rows).";
        } catch (err) {
          if (status) status.textContent = "This browser could not export your progress. Check that site storage and downloads are available.";
        }
      }

      root.innerHTML =
        '<h1>Export your progress</h1>' +
        '<p class="ec-meta">Local records only · nothing is uploaded</p>' +
        paragraph("Download a CSV of everything saved in this browser: submissions, checklist and lesson " +
          "progress, quiz and challenge history, coins, themes and other local settings. Keep the file if " +
          "you want a record before clearing site data or switching device.") +
        '<div class="ec-question">' +
          '<p id="ex-export-summary" class="ec-meta"></p>' +
          '<div class="ec-toolbar">' +
            '<button type="button" class="ec-btn" data-action="export-csv">Download progress CSV</button>' +
            internalLink("progress", "Back to My progress") +
          '</div>' +
          '<p id="ex-export-status" class="ec-note" role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div class="ec-note">Clearing site data erases these records on this device. The CSV is the only ' +
          'copy you keep. A separate privacy notice is linked in the footer.</div>';

      root.addEventListener("click", function (event) {
        var target = event.target;
        if (!target || !target.getAttribute) return;
        if (target.getAttribute("data-action") === "export-csv") download();
      });

      refreshSummary();
    }
  });

  /* ---------------------------------------------------------------- */
  /* flashcards — only when misc.js (or another file) has not provided  */
  /* ---------------------------------------------------------------- */

  add("flashcards", {
    title: "Flashcards",
    render: function (main, params) {
      var root = document.createElement("div");
      root.className = "ec-page";
      main.innerHTML = "";
      main.appendChild(root);
      root.innerHTML = '<h1>Glossary flashcards</h1><p class="ec-meta">Loading terms…</p>';

      return EC.load("glossary")["then"](function (terms) {
        var KNOWN_KEY = "flashcards_known";
        var saved = EC.store.get(KNOWN_KEY, []);
        var known = {};
        if (Object.prototype.toString.call(saved) === "[object Array]") {
          for (var s = 0; s < saved.length; s++) known[String(saved[s])] = true;
        }

        var state = {
          all: Object.prototype.toString.call(terms) === "[object Array]" ? terms : [],
          index: 0,
          flipped: false,
          unit: "all",
          hideKnown: false,
          known: known,
          pool: []
        };

        var units = [], seen = {}, i;
        for (i = 0; i < state.all.length; i++) {
          var unit = state.all[i] && state.all[i].unit;
          if (unit && !seen[unit]) { seen[unit] = true; units.push(unit); }
        }
        units.sort();

        function repool() {
          state.pool = [];
          for (var i = 0; i < state.all.length; i++) {
            var card = state.all[i];
            if (!card) continue;
            if (state.unit !== "all" && card.unit !== state.unit) continue;
            if (state.hideKnown && state.known[String(card.id)]) continue;
            state.pool.push(card);
          }
          if (state.index >= state.pool.length) state.index = 0;
        }

        function persistKnown() {
          var ids = [];
          for (var id in state.known) {
            if (Object.prototype.hasOwnProperty.call(state.known, id)) ids.push(id);
          }
          EC.store.set(KNOWN_KEY, ids);
        }

        function move(step) {
          if (!state.pool.length) return;
          state.index = (state.index + step + state.pool.length) % state.pool.length;
          state.flipped = false;
          render();
        }

        function shuffle() {
          for (var i = state.pool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = state.pool[i]; state.pool[i] = state.pool[j]; state.pool[j] = tmp;
          }
          state.index = 0;
          state.flipped = false;
          render();
        }

        function toggleKnown() {
          var card = state.pool[state.index];
          if (!card) return;
          var id = String(card.id);
          if (state.known[id]) delete state.known[id]; else state.known[id] = true;
          persistKnown();
          if (state.hideKnown) repool();
          render();
        }

        function render() {
          repool();
          var options = '<option value="all">All units (' + state.all.length + ')</option>';
          for (var i = 0; i < units.length; i++) {
            options += '<option value="' + h(units[i]) + '"' +
              (state.unit === units[i] ? ' selected' : '') + '>' + h(units[i]) + '</option>';
          }
          var html = ['<h1>Glossary flashcards</h1>',
            '<p class="ec-meta">' + state.all.length + ' key terms · Cambridge IGCSE Business Studies 0264</p>',
            '<div class="ec-toolbar">' +
              '<select data-action="unit" aria-label="Filter flashcards by unit">' + options + '</select>' +
              '<button type="button" class="ec-btn' + (state.hideKnown ? '' : ' ghost') +
                '" data-action="hide-known" aria-pressed="' + state.hideKnown + '">' +
                (state.hideKnown ? 'Showing unseen only' : 'Hide known terms') + '</button>' +
              '<button type="button" class="ec-btn ghost" data-action="shuffle">Shuffle</button>' +
              '<span class="ec-meta">Known: ' + Object.keys(state.known).length + '</span>' +
            '</div>'];

          var card = state.pool[state.index];
          if (!card) {
            html.push('<div class="ec-question" style="text-align:center">' +
              '<h2>No cards in this selection</h2>' +
              '<p class="ec-meta" style="text-transform:none;letter-spacing:0">Try another unit or turn off “Hide known terms”.</p></div>');
          } else {
            var id = String(card.id);
            html.push('<div class="ec-question">');
            html.push('<p class="ec-meta">Card ' + (state.index + 1) + ' of ' + state.pool.length +
              (card.syllabusRef ? ' · ' + h(card.syllabusRef) : '') +
              (state.known[id] ? ' · ✓ Known' : '') + '</p>');
            html.push('<h2>' + h(card.term) + '</h2>');
            if (state.flipped) {
              html.push('<p>' + h(card.definition) + '</p>');
              if (card.exampleContext) html.push('<p class="ec-note"><strong>Example:</strong> ' + h(card.exampleContext) + '</p>');
              if (card.examAdvice) html.push('<p class="ec-note"><strong>Exam advice:</strong> ' + h(card.examAdvice) + '</p>');
            } else {
              html.push('<p class="ec-meta" style="text-transform:none;letter-spacing:0">Try to recall the exact definition, then reveal it.</p>');
            }
            html.push('<div class="ec-toolbar" style="justify-content:space-between">' +
              '<button type="button" class="ec-btn ghost" data-action="prev">← Previous</button>' +
              '<button type="button" class="ec-btn" data-action="flip">' +
                (state.flipped ? 'Hide answer' : 'Reveal answer') + '</button>' +
              '<button type="button" class="ec-btn ghost" data-action="next">Next →</button>' +
              '</div>');
            html.push('<button type="button" class="ec-btn ghost" data-action="known">' +
              (state.known[id] ? 'Mark as not known' : 'Mark as known') + '</button>');
            html.push('</div>');
          }
          html.push('<p style="max-width:62em;line-height:1.6">' +
            internalLink("glossary", "Browse the full glossary") + ' · ' +
            internalLink("quiz", "Test yourself with Quick Quiz") + '</p>');
          root.innerHTML = html.join("");
        }

        root.addEventListener("click", function (event) {
          var target = event.target;
          if (!target || !target.getAttribute) return;
          switch (target.getAttribute("data-action")) {
            case "flip": state.flipped = !state.flipped; render(); break;
            case "prev": move(-1); break;
            case "next": move(1); break;
            case "shuffle": shuffle(); break;
            case "known": toggleKnown(); break;
            case "hide-known": state.hideKnown = !state.hideKnown; state.flipped = false; repool(); render(); break;
            default: break;
          }
        });
        root.addEventListener("change", function (event) {
          var target = event.target;
          if (target && target.getAttribute && target.getAttribute("data-action") === "unit") {
            state.unit = target.value;
            state.index = 0;
            state.flipped = false;
            repool();
            render();
          }
        });

        render();
      })["catch"](function (err) {
        root.innerHTML = '<h1>Glossary flashcards</h1>' +
          '<div class="ec-banner">Could not load the glossary: ' +
          h(err && err.message ? err.message : err) + '</div>';
      });
    }
  });

  /* ---------------------------------------------------------------- */
  /* Aliases for legacy query links.                                   */
  /* ---------------------------------------------------------------- */

  function unavailable(title) {
    return function (main) {
      main.innerHTML = '<div class="ec-page"><h1>' + h(title) + '</h1>' +
        '<p class="ec-banner">This section is not available yet.</p>' +
        '<p style="max-width:62em;line-height:1.6">' +
        internalLink("overview", "Go to the overview") + ' · ' +
        internalLink("extras", "Browse all tools") + '</p></div>';
    };
  }

  function delegate(viewName, renderAs, title) {
    return function (main, params) {
      var view = EC.views[viewName];
      if (view && typeof view.render === "function") {
        return view.render(main, params, renderAs || viewName);
      }
      return unavailable(title)(main);
    };
  }

  var progressAlias = delegate("progress", "progress", "My progress");
  var names = ["dashboard", "signin", "sign-in", "signup", "sign-up"];
  for (var i = 0; i < names.length; i++) {
    add(names[i], { title: "My progress", render: progressAlias });
  }

  /* The React router also accepted these names for the same quiz view.
   * quiz.js owns "quiz", so these are aliases and never overwrite it. */
  add("quick-quiz", { title: "Quick Quiz", render: delegate("quiz", "quiz", "Quick Quiz") });
  add("challenge", { title: "Daily challenge", render: delegate("quiz", "quiz", "Quick Quiz") });
  if (!EC.views.drill) {
    add("drill", { title: "Active recall drills", render: delegate("quiz", "quiz", "Quick Quiz") });
  }

  /* ?open=studyspace opened the floating focus widget. misc.js runs before
   * this file, so delegate to its study-space view when one was registered;
   * otherwise show a simple, useful page rather than falling back to the
   * generic overview. Capture the render function now to avoid self-reference. */
  var studyRender = null, studyNames = ["study-space", "studyspace"], s;
  for (s = 0; s < studyNames.length && !studyRender; s++) {
    var studyView = EC.views[studyNames[s]];
    if (studyView && typeof studyView.render === "function") studyRender = studyView.render;
  }
  if (!studyRender && EC.views.misc && /study|space|focus|pomodoro/i.test(String(EC.views.misc.title || ""))) {
    studyRender = EC.views.misc.render;
  }
  add("studyspace", {
    title: "Study Space",
    render: function (main, params) {
      if (studyRender) return studyRender(main, params, "studyspace");
      main.innerHTML = '<div class="ec-page">' +
        '<h1>Study Space</h1>' +
        '<p class="ec-meta">Focus widget · Pomodoro timer · ambient sound</p>' +
        '<div class="ec-note">The draggable focus widget is not part of this static build yet. ' +
        'Your progress and everything you need for revision are still available here.</div>' +
        '<p style="max-width:62em;line-height:1.6">' +
        internalLink("help", "How to use EcBiz") + ' · ' +
        internalLink("quiz", "Quick Quiz") + ' · ' +
        internalLink("extras", "Browse all tools") + '</p></div>';
    }
  });

  /* compare.js normally owns this name — never overwrite it. */
  if (!EC.views.compare) {
    add("compare", { title: "Compare notes", render: unavailable("Compare notes") });
  }
})();
