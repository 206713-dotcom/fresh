/* EcBiz glossary view — plain JavaScript port of GlossaryView.tsx.
   Owns only this file. No imports, no build step, ES5-compatible.
   Presentation markup mirrors the original React component exactly;
   all presentation classes come from the already-loaded style.css. */
(function () {
  "use strict";
  if (!window.EC) return;

  var EC = window.EC;
  var h = EC.esc;

  var QUIZLET_URL = "https://quizlet.com/user/Jayden_TAN53/folders/business-studies-0264";
  var MASTER_KEY = "glossaryMastered";
  var HIDE_KEY = "glossaryHideMastered";

  // Full unit values match glossary.json exactly; labels match the TSX filter UI.
  var UNITS = [
    ["Unit 1: Understanding business activity", "Unit 1: Business Activity"],
    ["Unit 2: People in business", "Unit 2: People in Business"],
    ["Unit 3: Marketing", "Unit 3: Marketing"],
    ["Unit 4: Operations management", "Unit 4: Operations Management"],
    ["Unit 5: Financial information and decisions", "Unit 5: Financial Decisions"],
    ["Unit 6: External influences on business activity", "Unit 6: External Influences"]
  ];

  // Exact class strings from GlossaryView.tsx (Tailwind + original component classes).
  var CLS = {
    flashOn: "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] border-[#0F2042] dark:border-[#38BDF8]",
    flashOff: "bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-neutral-200 border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800",
    masterIndexOn: "text-xs px-2.5 py-0.5 rounded font-mono transition-colors bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800",
    masterIndexOff: "text-xs px-2.5 py-0.5 rounded font-mono transition-colors text-[#78716C] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white bg-[#F5F5F4] dark:bg-neutral-900",
    masterFlashOn: "px-3 py-1 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300",
    masterFlashOff: "px-3 py-1 rounded text-xs font-semibold bg-[#F5F5F4] dark:bg-neutral-900 text-[#44403C] dark:text-neutral-200 hover:bg-[#E7E5E4] dark:hover:bg-[#334155]",
    prevCard: "flex-1 py-2.5 px-4 bg-white dark:bg-neutral-900 border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors text-[#1C1917] dark:text-neutral-200",
    flipCard: "py-2.5 px-6 bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors text-[#1C1917] dark:text-neutral-200",
    nextCard: "flex-1 py-2.5 px-4 bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors"
  };

  function lower(v) { return String(v == null ? "" : v).toLowerCase(); }

  EC.register("glossary", {
    title: "Glossary",
    render: function (main, params, name) {
      var state = {
        terms: [],
        query: "",
        unit: "all",
        hideMastered: !!EC.store.get(HIDE_KEY, false),
        mastered: {},
        flashcard: false,
        flashIndex: 0,
        flipped: false
      };

      var saved = EC.store.get(MASTER_KEY, []);
      if (!Array.isArray(saved)) saved = [];
      for (var si = 0; si < saved.length; si++) state.mastered[String(saved[si])] = true;

      var searchEl, unitEl, hideEl, countEl, bodyEl, flashBtn;

      function $(sel) { return main.querySelector(sel); }

      function buildShell() {
        var options = '<option value="all">All Syllabus Units (' + state.terms.length + ')</option>';
        for (var i = 0; i < UNITS.length; i++) {
          options += '<option value="' + h(UNITS[i][0]) + '">' + h(UNITS[i][1]) + '</option>';
        }

        main.innerHTML =
          '<div class="study-page">' +
            // Editorial header
            '<div class="mb-8">' +
              '<div class="study-page-heading">' +
                '<div>' +
                  '<h1 class="study-title">Cambridge 0264 Syllabus Glossary</h1>' +
                  '<p class="study-description">Official textbook key terminology, 2-mark definitions, and calculation formulae</p>' +
                '</div>' +
                '<div class="flex flex-wrap items-center gap-2.5">' +
                  '<button type="button" data-act="quickquiz" class="px-3.5 py-2 text-xs font-semibold rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"><span>⚡ Quick Quiz Drill</span></button>' +
                  '<button type="button" data-act="flashtoggle" class="px-4 py-2 text-xs font-semibold rounded-md border transition-colors ' + CLS.flashOff + '">Launch Flashcard Mode 🎴</button>' +
                '</div>' +
              '</div>' +
              // Quizlet folder banner
              '<div class="bg-[#EFF6FF] dark:bg-neutral-900 border border-[#BFDBFE] dark:border-neutral-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">' +
                '<div>' +
                  '<div class="text-xs font-mono font-semibold text-[#1D4ED8] dark:text-[#60A5FA] uppercase tracking-wider mb-1">Official Quizlet Folder Available</div>' +
                  '<p class="text-sm text-[#1E3A8A] dark:text-[#93C5FD]">Study Jayden_TAN53\'s curated Cambridge Business Studies 0264 digital flashcard sets and spaced repetition decks on Quizlet.</p>' +
                '</div>' +
                '<a href="' + QUIZLET_URL + '" target="_blank" rel="noopener noreferrer" class="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5"><span>Open Quizlet 0264 Folder</span><span aria-hidden="true">↗</span></a>' +
              '</div>' +
            '</div>' +
            // Filter and search bar
            '<div class="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-[#E7E5E4] dark:border-neutral-800 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">' +
              '<div class="w-full sm:w-1/2">' +
                '<input class="w-full bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-[#1C1917] dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]" type="text" data-role="search" autocomplete="off" placeholder="Search key terms, definitions, formulas (e.g. Added Value, ROCE, JIT)..." />' +
              '</div>' +
              '<div class="w-full sm:w-auto flex items-center gap-3">' +
                '<select class="w-full sm:w-auto bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 rounded-lg px-3 py-2 text-xs font-medium text-[#1C1917] dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]" data-role="unit">' + options + '</select>' +
                '<label class="text-xs font-mono text-[#78716C] dark:text-neutral-400 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"><input type="checkbox" data-role="hide" /> Hide mastered</label>' +
                '<span class="text-xs font-mono text-[#78716C] dark:text-neutral-400 whitespace-nowrap" data-role="counts"></span>' +
              '</div>' +
            '</div>' +
            '<div data-role="body"></div>' +
          '</div>';

        searchEl = $('[data-role="search"]');
        unitEl = $('[data-role="unit"]');
        hideEl = $('[data-role="hide"]');
        countEl = $('[data-role="counts"]');
        bodyEl = $('[data-role="body"]');
        flashBtn = $('[data-act="flashtoggle"]');

        hideEl.checked = state.hideMastered;
        searchEl.value = state.query;
        unitEl.value = state.unit;

        searchEl.addEventListener("input", function () {
          state.query = searchEl.value;
          state.flashIndex = 0;
          update();
        });
        unitEl.addEventListener("change", function () {
          state.unit = unitEl.value;
          state.flashIndex = 0;
          update();
        });
        hideEl.addEventListener("change", function () {
          state.hideMastered = !!hideEl.checked;
          EC.store.set(HIDE_KEY, state.hideMastered);
          state.flashIndex = 0;
          update();
        });
      }

      function filtered() {
        var q = lower(state.query);
        var out = [];
        for (var i = 0; i < state.terms.length; i++) {
          var t = state.terms[i];
          if (state.unit !== "all" && t.unit !== state.unit) continue;
          if (state.hideMastered && state.mastered[String(t.id)]) continue;
          if (q) {
            var hay = lower(t.term) + " " + lower(t.definition) + " " + lower(t.syllabusRef) +
              " " + lower(t.unit) + " " + lower(t.exampleContext) + " " + lower(t.examAdvice) +
              " " + lower(t.formula);
            if (hay.indexOf(q) < 0) continue;
          }
          out.push(t);
        }
        return out;
      }

      function masteredCount(list) {
        var n = 0;
        for (var i = 0; i < list.length; i++) if (state.mastered[String(list[i].id)]) n++;
        return n;
      }

      function masterButton(t, wide) {
        var done = !!state.mastered[String(t.id)];
        var cls = wide
          ? (done ? CLS.masterFlashOn : CLS.masterFlashOff)
          : (done ? CLS.masterIndexOn : CLS.masterIndexOff);
        return '<button type="button" class="' + cls + '" data-act="master" data-id="' + h(t.id) + '">' +
          (done ? '✓ Mastered' : (wide ? '+ Mark as Mastered' : 'Learn')) + '</button>';
      }

      function cardHtml(t) {
        var html =
          '<div class="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-[#0F2042] dark:hover:border-[#38BDF8] transition-colors">' +
            '<div>' +
              '<div class="flex items-start justify-between gap-2 mb-2">' +
                '<span class="text-[11px] font-mono text-[#78716C] dark:text-neutral-400 uppercase">' + h(t.syllabusRef) + '</span>' +
                masterButton(t, false) +
              '</div>' +
              '<h3 class="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white mb-2.5">' + h(t.term) + '</h3>' +
              '<p class="text-sm text-[#1C1917] dark:text-neutral-200 leading-relaxed mb-4">' + h(t.definition) + '</p>';
        if (t.formula) {
          html += '<div class="mb-4 p-2.5 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-700 rounded-md text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]"><strong>Formula:</strong> ' + h(t.formula) + '</div>';
        }
        html +=
              '<div class="p-3 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-lg text-xs text-[#57534E] dark:text-neutral-400 space-y-1 mb-2">' +
                '<div class="text-[11px]"><span class="font-semibold text-[#8B1E1E] dark:text-[#F87171]">Exam Guidance: </span><span>' + h(t.examAdvice) + '</span></div>';
        if (t.exampleContext) {
          html += '<div class="text-[11px] text-[#78716C] dark:text-neutral-400"><span class="font-semibold">Context Example: </span><span>' + h(t.exampleContext) + '</span></div>';
        }
        html +=
              '</div>' +
            '</div>' +
            '<div class="pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-[11px] text-[#78716C] dark:text-neutral-400">' +
              '<span>' + h(t.unit) + '</span>' +
              '<a href="' + QUIZLET_URL + '" target="_blank" rel="noopener noreferrer" class="text-[#2563EB] dark:text-[#60A5FA] hover:underline">Quizlet Card ↗</a>' +
            '</div>' +
          '</div>';
        return html;
      }

      function renderIndex(list) {
        if (!list.length) {
          bodyEl.innerHTML = '<div class="text-center py-12 text-[#78716C] dark:text-neutral-400">No terms match the selected criteria.</div>';
          return;
        }
        var html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
        for (var i = 0; i < list.length; i++) html += cardHtml(list[i]);
        html += '</div>';
        bodyEl.innerHTML = html;
      }

      function renderFlashcard(list) {
        if (state.flashIndex >= list.length) state.flashIndex = 0;
        if (state.flashIndex < 0) state.flashIndex = 0;
        var t = list[state.flashIndex];
        if (!t) {
          bodyEl.innerHTML = '<div class="text-center py-12 text-[#78716C] dark:text-neutral-400">No terms match the selected criteria.</div>';
          return;
        }
        var html =
          '<div class="max-w-xl mx-auto py-6">' +
            '<div class="space-y-6">' +
              '<div class="flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-neutral-400">' +
                '<span>Card ' + (state.flashIndex + 1) + ' of ' + list.length + '</span>' +
                '<span>Mastered: ' + masteredCount(list) + '</span>' +
              '</div>' +
              '<div class="bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-[#38BDF8] rounded-2xl p-8 min-h-[320px] flex flex-col justify-between shadow-sm cursor-pointer hover:border-[#1E3A8A] dark:hover:border-[#60A5FA] transition-all select-none" data-act="flipcard" role="button" tabindex="0">' +
                '<div>' +
                  '<div class="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-4">' +
                    '<span class="font-mono text-[#0F2042] dark:text-[#38BDF8] uppercase font-bold">' + h(t.syllabusRef) + '</span>' +
                    '<span class="text-[11px] bg-[#FAF9F6] dark:bg-black px-2 py-0.5 rounded border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300">' + (state.flipped ? 'Definition Side' : 'Term Side · Click to Flip') + '</span>' +
                  '</div>';
        if (state.flipped) {
          html +=
                  '<div class="space-y-4">' +
                    '<h3 class="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#38BDF8]">' + h(t.term) + '</h3>' +
                    '<p class="text-base text-[#1C1917] dark:text-neutral-200 leading-relaxed">' + h(t.definition) + '</p>' +
                    (t.formula ? '<div class="p-3 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-700 rounded-lg text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]"><strong>Formula:</strong> ' + h(t.formula) + '</div>' : '') +
                    '<div class="p-3 bg-[#FAF9F6] dark:bg-black rounded-lg border border-[#E7E5E4] dark:border-neutral-800 text-xs text-[#57534E] dark:text-neutral-400"><strong class="text-[#8B1E1E] dark:text-[#F87171] block mb-0.5">Cambridge Exam Tip:</strong>' + h(t.examAdvice) + '</div>' +
                  '</div>';
        } else {
          html +=
                  '<div class="my-8 text-center">' +
                    '<h2 class="font-academic-serif text-3xl sm:text-4xl font-bold text-[#0F2042] dark:text-white mb-3">' + h(t.term) + '</h2>' +
                    '<span class="text-xs text-[#78716C] dark:text-neutral-400">' + h(t.unit) + '</span>' +
                  '</div>';
        }
        html +=
                '</div>' +
                '<div class="pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">' +
                  '<span>Click card to reveal definition</span>' +
                  masterButton(t, true) +
                '</div>' +
              '</div>' +
              '<div class="flex items-center justify-between gap-4">' +
                '<button type="button" class="' + CLS.prevCard + '" data-act="flashprev"' + (state.flashIndex <= 0 ? ' disabled' : '') + '>← Previous Card</button>' +
                '<button type="button" class="' + CLS.flipCard + '" data-act="flip">Flip</button>' +
                '<button type="button" class="' + CLS.nextCard + '" data-act="flashnext"' + (state.flashIndex >= list.length - 1 ? ' disabled' : '') + '>Next Card →</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        bodyEl.innerHTML = html;
      }

      function update() {
        var list = filtered();
        countEl.textContent = 'Showing ' + list.length + ' terms';
        flashBtn.textContent = state.flashcard ? 'Switch to Full Index View' : 'Launch Flashcard Mode 🎴';
        flashBtn.className = 'px-4 py-2 text-xs font-semibold rounded-md border transition-colors ' +
          (state.flashcard ? CLS.flashOn : CLS.flashOff);
        if (state.flashcard) renderFlashcard(list);
        else renderIndex(list);
      }

      function toggleMastered(id) {
        if (state.mastered[id]) delete state.mastered[id];
        else state.mastered[id] = true;
        var arr = [];
        for (var k in state.mastered) {
          if (Object.prototype.hasOwnProperty.call(state.mastered, k)) arr.push(k);
        }
        EC.store.set(MASTER_KEY, arr);
        update();
      }

      function actionFor(event) {
        var node = event.target;
        while (node && node !== main) {
          if (node.getAttribute && node.getAttribute("data-act")) return node;
          node = node.parentNode;
        }
        return null;
      }

      main.addEventListener("click", function (event) {
        var btn = actionFor(event);
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "quickquiz") {
          EC.navigate("quiz");
        } else if (act === "flashtoggle") {
          state.flashcard = !state.flashcard;
          state.flashIndex = 0;
          state.flipped = false;
          update();
        } else if (act === "master") {
          toggleMastered(btn.getAttribute("data-id"));
        } else if (act === "flipcard" || act === "flip") {
          state.flipped = !state.flipped;
          update();
        } else if (act === "flashprev") {
          state.flashIndex = Math.max(0, state.flashIndex - 1);
          state.flipped = false;
          update();
        } else if (act === "flashnext") {
          state.flashIndex = state.flashIndex + 1;
          state.flipped = false;
          update();
        }
      });

      // Enter on the flip card toggles it (keyboard accessibility).
      main.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.keyCode !== 13) return;
        var node = event.target;
        if (node && node.getAttribute && node.getAttribute("data-act") === "flipcard") {
          state.flipped = !state.flipped;
          update();
        }
      });

      return EC.load("glossary").then(function (terms) {
        state.terms = Array.isArray(terms) ? terms : [];
        buildShell();
        update();
      });
    }
  });
})();
