/* EcBiz progress view — local dashboard, plain ES5 JavaScript (no build step). */
(function () {
  'use strict';
  if (!window.EC) return;

  var EC = window.EC;
  function e(value) { return EC.esc(value); }

  /* Keys we treat as evidence of submissions, answers or ratings. */
  var SUBMISSION_HINT = /submission|result|response/i;
  var ANSWER_HINT = /answer|draft/i;
  var RATING_HINT = /rating/i;
  var RECORD_FIELDS = [
    'studentAnswer', 'answer', 'questionTitle', 'question', 'prompt',
    'result', 'totalScore', 'aoBreakdown', 'maxMarks', 'marks',
    'wordCount', 'timeSpentSeconds'
  ];
  var AO_META = [
    { key: 'ao1', name: 'Knowledge', desc: 'Vocabulary & Definitions' },
    { key: 'ao2', name: 'Application', desc: 'Case Study Integration' },
    { key: 'ao3', name: 'Analysis', desc: 'Causal Chains of Reasoning' },
    { key: 'ao4', name: 'Evaluation', desc: 'Justified Recommendations' }
  ];

  /* ---------- small helpers ---------- */

  function num(value) {
    var n = (typeof value === 'number') ? value : Number(value);
    return isFinite(n) ? n : 0;
  }

  function has(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }

  function looksLikeRecord(value) {
    if (!value || typeof value !== 'object') return false;
    for (var i = 0; i < RECORD_FIELDS.length; i++) {
      if (has(value, RECORD_FIELDS[i])) return true;
    }
    return false;
  }

  function eachEcKey(fn) {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('ecbiz_') === 0) fn(key);
      }
    } catch (err) { /* storage blocked */ }
  }

  function readRaw(key) {
    try { return localStorage.getItem(key); } catch (err) { return null; }
  }

  function parseValue(raw) {
    try { return JSON.parse(raw); } catch (err) { return raw; }
  }

  function formatTime(value) {
    var total = Math.max(0, Math.floor(num(value)));
    var mins = Math.floor(total / 60);
    var secs = total % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function formatDate(value) {
    if (!value) return '';
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value).slice(0, 10);
    var month = String(d.getUTCMonth() + 1);
    var day = String(d.getUTCDate());
    return d.getUTCFullYear() + '-' + (month.length < 2 ? '0' : '') + month +
      '-' + (day.length < 2 ? '0' : '') + day;
  }

  function gradeFor(percentage) {
    if (percentage >= 80) return { grade: 'A*', label: 'Outstanding (A*)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (percentage >= 70) return { grade: 'A', label: 'Excellent (A)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (percentage >= 60) return { grade: 'B', label: 'Good (B)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (percentage >= 50) return { grade: 'C', label: 'Competent (C)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (percentage >= 40) return { grade: 'D', label: 'Developing (D)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { grade: 'U', label: 'Ungraded (U)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }

  /* ---------- reading and normalising local data ---------- */

  function normalise(raw, sourceKey) {
    var r = (raw && typeof raw === 'object') ? raw : {};
    var result = r.result;
    if (typeof result === 'string') result = parseValue(result);
    if (!result || typeof result !== 'object') result = r;
    var ao = result.aoBreakdown || r.aoBreakdown || {};

    var answer = r.studentAnswer;
    if (answer == null) answer = r.answer;
    if (answer == null && typeof raw === 'string') answer = raw;
    answer = (answer == null) ? '' : String(answer);
    if (answer === '[object Object]') answer = '';

    var words = num(r.wordCount);
    if (!words && answer) {
      var trimmed = answer.replace(/^\s+|\s+$/g, '');
      words = trimmed ? trimmed.split(/\s+/).length : 0;
    }

    var maxMarks = result.maxMarks;
    if (maxMarks == null) maxMarks = r.marks;
    if (maxMarks == null) maxMarks = r.maxMarks;

    var notes = result.examinerNotes;
    if (notes == null) notes = r.examinerNotes;

    var breakdown = {};
    for (var i = 0; i < AO_META.length; i++) {
      var part = ao[AO_META[i].key] || {};
      breakdown[AO_META[i].key] = {
        score: num(part.score),
        max: num(part.max)
      };
    }

    return {
      id: String(r.id || ''),
      questionId: String(r.questionId || ''),
      questionTitle: String(r.questionTitle || r.question || r.title || r.prompt ||
        r.questionId || sourceKey),
      questionText: String(r.questionPrompt || r.questionText || r.scenarioContext || ''),
      paper: (r.paper != null) ? r.paper : (r.paperNumber != null ? r.paperNumber : ''),
      unit: String(r.unit || ''),
      wordCount: words,
      timeSpentSeconds: num(r.timeSpentSeconds),
      timestamp: String(r.timestamp || result.evaluatedAt || ''),
      studentAnswer: answer,
      totalScore: num(result.totalScore != null ? result.totalScore : r.totalScore),
      maxMarks: num(maxMarks),
      examinerNotes: (notes == null) ? '' : String(notes),
      ao: breakdown,
      hasAO: !!(ao.ao1 || ao.ao2 || ao.ao3 || ao.ao4),
      /* Keep the complete EvaluationResult for CSV export, as the original did. */
      fullResult: result,
      marks: num(r.marks != null ? r.marks : maxMarks),
      percentage: num(result.percentage != null ? result.percentage :
        (num(maxMarks) > 0 ? Math.round(num(result.totalScore) / num(maxMarks) * 100) : 0))
    };
  }

  function ratingCount(value) {
    if (!value || typeof value !== 'object') return 0;
    var count = 0;
    Object.keys(value).forEach(function (k) {
      var v = value[k];
      if (v && typeof v === 'object') {
        if (v.rating !== undefined || v.score !== undefined) count++;
      } else if (v === true || (v !== '' && v != null && num(v) > 0)) {
        count++;
      }
    });
    return count;
  }

  function addDraft(item, key, drafts) {
    if (drafts.length >= 60) return;
    var text = '';
    var title = key;
    if (item && typeof item === 'object') {
      text = item.answer != null ? item.answer :
        (item.answerText != null ? item.answerText :
          (item.studentAnswer != null ? item.studentAnswer : (item.text != null ? item.text : '')));
      title = item.questionTitle || item.title || item.question || item.questionId || key;
    } else if (item != null) {
      text = item;
    }
    text = (text == null) ? '' : String(text);
    if (!text.replace(/^\s+|\s+$/g, '')) return;
    drafts.push({ key: String(key), title: String(title), text: text });
  }

  function collectDrafts(value, key, drafts) {
    if (Array.isArray(value)) {
      value.forEach(function (item) { addDraft(item, key, drafts); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (subKey) { addDraft(value[subKey], subKey, drafts); });
    } else {
      addDraft(value, key, drafts);
    }
  }

  function collectData() {
    var records = [];
    var drafts = [];
    var ratings = [];
    var submissionKeys = [];
    var seen = {};

    eachEcKey(function (key) {
      var raw = readRaw(key);
      if (raw === null) return;
      var value = parseValue(raw);
      var added = 0;

      if (RATING_HINT.test(key)) {
        var count = ratingCount(value);
        if (count > 0) ratings.push({ key: key, count: count });
        return;
      }

      function tryRecord(item, sourceKey) {
        if (!looksLikeRecord(item)) return;
        var rec = normalise(item, sourceKey);
        var dedupe = 'r:' + (rec.id || (rec.questionId + '|' + rec.timestamp) || sourceKey);
        if (has(seen, dedupe)) return;
        seen[dedupe] = 1;
        records.push(rec);
        added++;
      }

      if (Array.isArray(value)) {
        value.forEach(function (item) { tryRecord(item, key); });
      } else if (looksLikeRecord(value)) {
        tryRecord(value, key);
      } else if (value && typeof value === 'object') {
        Object.keys(value).forEach(function (subKey) {
          var item = value[subKey];
          if (looksLikeRecord(item)) tryRecord(item, subKey);
        });
      }

      if (added > 0 && SUBMISSION_HINT.test(key) && submissionKeys.indexOf(key) === -1) {
        submissionKeys.push(key);
      }
      if (added === 0 && ANSWER_HINT.test(key)) {
        collectDrafts(value, key, drafts);
      }
    });

    return {
      records: records,
      drafts: drafts,
      ratings: ratings,
      submissionKeys: submissionKeys
    };
  }

  /* ---------- CSV export ---------- */

  function csvCell(value) {
    var text = String(value == null ? '' : value);
    /* Guard against spreadsheet formula injection (mirrors the React exporter). */
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }

  /* The original exporter walked the entire syllabus (254 points) and every
   * lesson, so it needed both data files. EC.load caches each fetch for the
   * page session: start them when the view renders and let the Export handler
   * wait on the shared promise. Plain .then() chains keep this ES5-compatible.
   * A failed load degrades to empty lists rather than breaking the export. */
  var exportPoints = null;   /* flat [{ id, text }, ...] */
  var exportLessons = null;  /* [{ id, title }, ...] in section order */
  var exportDataPromise = null;

  function safeLoad(name) {
    try {
      return EC.load(name).then(function (value) { return value; }, function () { return null; });
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  function prepareCsvData() {
    if (exportDataPromise) return exportDataPromise;
    exportDataPromise = Promise.all([safeLoad('syllabus-static'), safeLoad('lessons')])
      .then(function (loaded) {
        var points = loaded[0];
        exportPoints = Array.isArray(points) ? points : [];

        var lessons = [];
        var sections = loaded[1];
        (Array.isArray(sections) ? sections : []).forEach(function (section) {
          var list = (section && Array.isArray(section.lessons)) ? section.lessons : [];
          list.forEach(function (lesson) {
            if (lesson && lesson.id != null) {
              lessons.push({
                id: String(lesson.id),
                title: lesson.title == null ? '' : String(lesson.title)
              });
            }
          });
        });
        exportLessons = lessons;
      });
    return exportDataPromise;
  }

  function buildCsv(data) {
    var rows = [
      ['Subject', 'Activity', 'Item', 'Status', 'Answer', 'Details', 'Updated at'],
      ['Fresh', 'GIS Points', 'Balance', String(EC.points ? EC.points() : ''), '', '', ''],
      ['Business Studies', 'Quick Quiz', 'MCQs completed', readRaw('ecbiz_mcq_completed') || '0', '', '', '']
    ];

    data.records.forEach(function (rec) {
      rows.push([
        'Business Studies',
        'Exam practice',
        rec.questionId || rec.questionTitle,
        rec.totalScore + '/' + rec.maxMarks,
        rec.studentAnswer,
        rec.questionTitle + '\n' + JSON.stringify(rec.fullResult || {
          totalScore: rec.totalScore,
          maxMarks: rec.maxMarks,
          percentage: rec.maxMarks > 0 ? Math.round(rec.totalScore / rec.maxMarks * 100) : 0,
          examinerNotes: rec.examinerNotes,
          aoBreakdown: rec.ao
        }),
        rec.timestamp
      ]);
    });

    /* Original exporter: every syllabus point, lessons, boss review and
     * completed-question ids are included in the CSV. */
    var ratingValues = parseValue(readRaw('ecbiz_subpoint_ratings_v2') || '{}') || {};
    /* Emit ALL 254 points (not just rated ones), with the stored rating or
     * "Unrated" and the syllabus text in the Details column — the original
     * progress-export.ts:18-27 shape. */
    (exportPoints || []).forEach(function (point) {
      var id = (point && point.id != null) ? String(point.id) : '';
      rows.push([
        'Business Studies', 'Syllabus checklist', id,
        ratingValues[id] || 'Unrated', '',
        (point && point.text != null) ? String(point.text) : '',
        ''
      ]);
    });

    /* Interactive lessons: emit in lesson order with lesson.title in Details
     * (original progress-export.ts:28-32). */
    var lessonTitleById = {};
    (exportLessons || []).forEach(function (lesson) {
      lessonTitleById[lesson.id] = lesson.title;
    });
    var lessonProgress = parseValue(readRaw('ecbiz_interactive_lessons_progress_v1') || '{}') || {};
    (exportLessons || []).forEach(function (lesson) {
      var progress = lessonProgress[lesson.id];
      if (!progress) return;
      rows.push([
        'Business Studies', 'Interactive lesson', lesson.id,
        progress.rating || '', '',
        lessonTitleById[lesson.id] || '',
        progress.completedAt || ''
      ]);
    });
    var bossWrong = parseValue(readRaw('ecbiz_boss_wrong_questions') || '{}') || {};
    Object.keys(bossWrong).forEach(function (id) {
      var r = bossWrong[id] || {};
      rows.push(['Business Studies', 'Boss Battle review', id, (r.missCount || 0) + ' misses', '', (r.question || '') + '\nAnswer: ' + (r.correctAnswer || ''), r.lastMissedAt ? new Date(r.lastMissedAt).toISOString() : '']);
    });
    var completed = parseValue(readRaw('ecbiz_completed_questions') || '[]') || [];
    (Array.isArray(completed) ? completed : []).forEach(function (id) {
      rows.push(['Business Studies', 'Completed question', id, 'Done', '', '', '']);
    });
    data.drafts.forEach(function (draft) {
      rows.push(['Business Studies', 'Answer draft', draft.key, 'In progress', draft.text, '', '']);
    });

    return '\ufeff' + rows.map(function (row) {
      return row.map(csvCell).join(',');
    }).join('\r\n');
  }

  function downloadCsv(filename, text) {
    var URLApi = window.URL || window.webkitURL;
    if (!window.Blob || !URLApi || !URLApi.createObjectURL) {
      throw new Error('Blob downloads are not supported in this browser.');
    }
    var blob = new window.Blob([text], { type: 'text/csv;charset=utf-8' });
    var url = URLApi.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    if (link.remove) link.remove(); else document.body.removeChild(link);
    setTimeout(function () { URLApi.revokeObjectURL(url); }, 1000);
  }

  /* ---------- rendering ---------- */

  /* Class strings mirror ProgressDashboard.tsx verbatim so the markup uses the
     semantic + utility classes already compiled into style.css. */
  var CARD = 'bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-5 shadow-sm';
  var STAT_LABEL = 'text-xs font-mono uppercase text-[#78716C] dark:text-neutral-400';
  var STAT_SUB = 'text-[11px] text-[#57534E] dark:text-neutral-400 mt-1 block';
  var STAT_LINK = 'progress-stat-link';
  var SECTION_CARD = 'bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm';
  var SECTION_TITLE = 'font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white mb-4';
  var AO_BOX = 'p-4 bg-[#FAF9F6] dark:bg-black rounded-lg border border-[#E7E5E4] dark:border-neutral-800';
  var AO_LABEL = 'font-semibold text-[#0F2042] dark:text-[#38BDF8]';
  var AO_NUMBER = 'font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]';
  var AO_TRACK = 'w-full bg-[#E7E5E4] dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden';
  var AO_FILL = 'bg-[#0F2042] dark:bg-[#38BDF8] h-full';
  var AO_FOOT = 'text-[10px] text-[#78716C] dark:text-neutral-400 mt-2 block';

  function statCard(label, valueClass, value, sub, action) {
    return '<div class="' + CARD + '">' +
      '<span class="' + STAT_LABEL + '">' + e(label) + '</span>' +
      '<div class="font-academic-serif text-3xl font-bold ' + valueClass + '">' + e(value) + '</div>' +
      '<span class="' + STAT_SUB + '">' + e(sub) + '</span>' +
      (action || '') +
      '</div>';
  }

  function aoCard(meta, earned, max) {
    var pct = max > 0 ? Math.round(earned / max * 100) : 0;
    return '<div class="' + AO_BOX + '">' +
      '<div class="flex items-center justify-between mb-2">' +
        '<span class="' + AO_LABEL + '">AO' + meta.key.slice(2) + ' ' + e(meta.name) + '</span>' +
        '<span class="' + AO_NUMBER + '">' + pct + '%</span>' +
      '</div>' +
      '<div class="' + AO_TRACK + '">' +
        '<div class="' + AO_FILL + '" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<span class="' + AO_FOOT + '">' + e(earned) + ' / ' + e(max) + ' marks (' + e(meta.desc) + ')</span>' +
      '</div>';
  }

  function recordHtml(rec, index, expandedId) {
    var isExpanded = expandedId === index;
    var bits = [];
    /* The original always rendered date · words · time, and used the stored
     * result.percentage for the grade badge. */
    bits.push(e(rec.timestamp ? formatDate(rec.timestamp) : ''));
    bits.push(e(rec.wordCount) + ' words');
    bits.push('Time: ' + e(formatTime(rec.timeSpentSeconds)));

    var pct = num(rec.percentage);
    var grade = gradeFor(pct);

    var html = '<div class="border border-[#E7E5E4] dark:border-neutral-800 rounded-lg p-4 bg-[#FAF9F6] dark:bg-black text-xs transition-colors">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E5E4] dark:border-neutral-800">' +
        '<div>' +
          '<span class="font-semibold text-[#0F2042] dark:text-white text-sm block">' + e(rec.questionTitle) + '</span>' +
          '<span class="text-[#78716C] dark:text-neutral-400 text-[11px]">' + bits.join(' · ') + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-3">' +
          '<span class="font-mono font-bold text-sm text-[#0F2042] dark:text-[#38BDF8]">' + e(rec.totalScore) + ' / ' + e(rec.marks != null ? rec.marks : rec.maxMarks) + ' marks</span>' +
          (grade ? '<span class="px-2.5 py-0.5 rounded font-mono font-bold ' + grade.color + '">' + e(grade.grade) + '</span>' : '') +
          '<button type="button" class="ec-record-toggle text-xs font-semibold text-[#0F2042] dark:text-[#38BDF8] hover:underline" data-record-index="' + index + '">' +
            (isExpanded ? 'Collapse ▲' : 'Review Answer ▼') +
          '</button>' +
        '</div>' +
      '</div>';

    if (isExpanded) {
      var context = [];
      if (rec.paper !== '' && rec.paper != null) context.push('Paper ' + e(rec.paper));
      if (rec.unit) context.push(e(rec.unit));
      html += '<div class="mt-4 pt-2 space-y-4">';
      if (rec.questionText || context.length) {
        html += '<div class="p-3 bg-white dark:bg-neutral-900 rounded border border-[#E7E5E4] dark:border-neutral-800">' +
          '<span class="font-semibold text-[#0F2042] dark:text-[#38BDF8] block mb-1">Question:</span>' +
          (context.length ? '<p class="text-[#57534E] dark:text-neutral-400 leading-relaxed mb-2">' + context.join(' · ') + '</p>' : '') +
          (rec.questionText ? '<p class="whitespace-pre-wrap text-[#1C1917] dark:text-neutral-200 leading-relaxed">' + e(rec.questionText) + '</p>' : '') +
          '</div>';
      }
      html += '<div class="p-3 bg-white dark:bg-neutral-900 rounded border border-[#E7E5E4] dark:border-neutral-800">' +
        '<span class="font-semibold text-[#44403C] dark:text-neutral-400 block mb-1">Candidate Submission:</span>' +
        '<p class="whitespace-pre-wrap text-[#1C1917] dark:text-neutral-200 leading-relaxed">' +
          (rec.studentAnswer ? e(rec.studentAnswer) : 'No answer text saved.') +
        '</p>' +
        '</div>';
      html += '<div class="p-3 bg-white dark:bg-neutral-900 rounded border border-[#E7E5E4] dark:border-neutral-800">' +
        '<span class="font-semibold text-[#0F2042] dark:text-[#38BDF8] block mb-1">Examiner Assessment:</span>' +
        '<p class="text-[#57534E] dark:text-neutral-400 leading-relaxed mb-2">' + e(rec.examinerNotes) + '</p>' +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E7E5E4] dark:border-neutral-800">' +
          AO_META.map(function (meta) {
            var part = rec.ao[meta.key];
            return '<div>' +
              '<span class="text-[10px] text-[#78716C] dark:text-neutral-400 block">AO' + meta.key.slice(2) + ':</span>' +
              '<span class="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">' + e(part.score) + ' / ' + e(part.max) + '</span>' +
              '</div>';
          }).join('') +
        '</div>' +
        '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function draftHtml(draft) {
    return '<details class="border border-[#E7E5E4] dark:border-neutral-800 rounded-lg p-4 bg-[#FAF9F6] dark:bg-black text-xs">' +
      '<summary class="cursor-pointer font-semibold text-[#0F2042] dark:text-white">' + e(draft.title) + ' — in progress</summary>' +
      '<div class="mt-3 space-y-2">' +
        '<p class="whitespace-pre-wrap text-[#1C1917] dark:text-neutral-200 leading-relaxed">' + e(draft.text) + '</p>' +
        '<p class="text-[10px] text-[#78716C] dark:text-neutral-400">Stored under ' + e(draft.key) + '</p>' +
      '</div>' +
      '</details>';
  }

  window.EC.register('progress', {
    title: 'My progress',
    render: function (main, params, name) {
      if (!main) return;
      /* Kick off the cached syllabus/lesson fetches for CSV export now; the
       * Export button waits on them before building the file. */
      prepareCsvData();
      var data = collectData();
      var records = data.records;
      var graded = records.filter(function (rec) { return rec.maxMarks > 0; });

      var totalEarned = 0;
      var totalMax = 0;
      graded.forEach(function (rec) {
        totalEarned += rec.totalScore;
        totalMax += rec.maxMarks;
      });
      var average = totalMax > 0 ? Math.round(totalEarned / totalMax * 100) : 0;
      var grade = records.length > 0 ? gradeFor(average) : null;

      var aoTotals = {};
      AO_META.forEach(function (meta) { aoTotals[meta.key] = { score: 0, max: 0 }; });
      records.forEach(function (rec) {
        if (!rec.hasAO) return;
        AO_META.forEach(function (meta) {
          aoTotals[meta.key].score += rec.ao[meta.key].score;
          aoTotals[meta.key].max += rec.ao[meta.key].max;
        });
      });

      /* The TSX receives masteredTermsCount/totalTermsCount as props. The static
         equivalent is the locally stored glossary mastery list. */
      var masteredList = EC.store.get('glossaryMastered', []);
      var masteredCount = Array.isArray(masteredList) ? masteredList.length : 0;
      var totalTerms = 275; /* number of terms in data/glossary.json */
      var glossaryPct = Math.round(masteredCount / (totalTerms || 1) * 100);

      var html = '<div class="study-page">' +
        '<div class="study-page-heading">' +
          '<div>' +
            '<h1 class="study-title">My progress</h1>' +
            '<p class="study-description">Progress is saved in this browser. ' +
              'Clearing site data removes it. Use the same browser and device to continue.</p>' +
          '</div>' +
          '<button type="button" class="study-action btn-primary" id="ec-progress-export">Export progress CSV</button>' +
          (records.length > 0
            ? '<button type="button" class="text-xs text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-semibold" id="ec-progress-clear">Clear History</button>'
            : '') +
        '</div>' +
        '<p role="alert" class="mb-4 text-sm text-rose-700 dark:text-rose-300" id="ec-progress-export-error" style="display:none"></p>' +

        '<nav class="progress-shortcuts" aria-label="Progress sections">' +
          '<a href="#progress-summary">Summary</a>' +
          '<a href="#progress-skills">Skills breakdown</a>' +
          '<a href="#progress-history">Saved answers</a>' +
          '<button type="button" id="ec-progress-checklist">Syllabus checklist →</button>' +
        '</nav>' +

        '<section id="progress-summary" tabindex="-1" aria-label="Progress summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">' +
          statCard('Questions Practiced', 'text-[#0F2042] dark:text-white mt-1 tabular-nums', records.length,
            'Across 2, 4, 6, 8, and 12-mark tiers',
            '<a href="#progress-history" class="' + STAT_LINK + '">Review saved answers →</a>') +
          statCard('Average Mark Score', 'text-[#0F2042] dark:text-[#38BDF8] mt-1 tabular-nums', average + '%',
            totalEarned + ' / ' + totalMax + ' total marks earned',
            '<a href="#progress-skills" class="' + STAT_LINK + '">See marks by skill →</a>') +
          statCard('Projected Grade', 'text-[#0F2042] dark:text-white mt-1', grade ? grade.grade : '—',
            grade ? grade.label : 'Complete 1 practice',
            '<button type="button" class="' + STAT_LINK + '" id="ec-progress-practice">Continue exam practice →</button>') +
          statCard('0264 Glossary Mastery', 'text-[#0F2042] dark:text-white mt-1 tabular-nums',
            masteredCount + ' / ' + totalTerms,
            glossaryPct + '% syllabus vocabulary mastered',
            '<button type="button" class="' + STAT_LINK + '" id="ec-progress-glossary">Open glossary →</button>') +
        '</section>' +

        '<section id="progress-skills" tabindex="-1" aria-labelledby="progress-skills-title" class="' + SECTION_CARD + ' mb-10">' +
          '<h2 id="progress-skills-title" class="' + SECTION_TITLE + '">Skills breakdown</h2>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">' +
            AO_META.map(function (meta) {
              return aoCard(meta, aoTotals[meta.key].score, aoTotals[meta.key].max);
            }).join('') +
          '</div>' +
        '</section>' +

        '<section id="progress-history" tabindex="-1" aria-labelledby="progress-history-title" class="' + SECTION_CARD + '">' +
          '<h2 id="progress-history-title" class="' + SECTION_TITLE + '">Saved answers and feedback</h2>';

      if (records.length === 0 && data.drafts.length === 0) {
        html += '<div class="text-center py-12">' +
          '<p class="text-sm text-[#78716C] dark:text-neutral-400 mb-4">No essays or questions completed yet.</p>' +
          '<button type="button" class="bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors" id="ec-progress-start">Start Your First Question</button>' +
          '</div>';
      } else {
        html += '<div class="space-y-4" id="ec-records">' +
          records.map(function (rec, i) { return recordHtml(rec, i, null); }).join('') +
          '</div>';
        if (data.drafts.length > 0) {
          html += '<h3 class="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white mt-6 mb-2">Unmarked answer drafts</h3>' +
            data.drafts.map(draftHtml).join('');
        }
      }

      html += '</section></div>';
      main.innerHTML = html;

      var errorNode = main.querySelector('#ec-progress-export-error');
      var exportButton = main.querySelector('#ec-progress-export');
      if (exportButton) {
        exportButton.addEventListener('click', function () {
          function finish() {
            try {
              downloadCsv(
                'fresh-business-studies-progress-' + new Date().toISOString().slice(0, 10) + '.csv',
                buildCsv(data)
              );
              if (errorNode) errorNode.style.display = 'none';
            } catch (err) {
              if (errorNode) {
                errorNode.textContent = 'This browser could not export your progress. ' +
                  'Check whether site storage and downloads are available.';
                errorNode.style.display = '';
              }
            }
          }
          /* Data may still be in flight if the user clicks immediately. */
          prepareCsvData().then(finish, finish);
        });
      }

      var clearButton = main.querySelector('#ec-progress-clear');
      if (clearButton) {
        clearButton.addEventListener('click', function () {
          if (!window.confirm('Are you sure you want to clear your local submission history?')) return;
          /* The original cleared only ecbiz_submissions (by writing "[]"); do
           * not delete unrelated ...result.../...response... keys. */
          data.submissionKeys.forEach(function (key) {
            try {
              if (key === 'ecbiz_submissions') localStorage.setItem(key, '[]');
              else localStorage.removeItem(key);
            } catch (err) { /* ignore */ }
          });
          EC.render();
        });
      }

      function goTo(view) {
        return function () {
          if (EC.navigate) EC.navigate(view);
          else window.location.href = '?open=' + view;
        };
      }
      var checklistButton = main.querySelector('#ec-progress-checklist');
      if (checklistButton) checklistButton.addEventListener('click', goTo('checklist'));
      var practiceButton = main.querySelector('#ec-progress-practice');
      if (practiceButton) practiceButton.addEventListener('click', goTo('practice'));
      var glossaryButton = main.querySelector('#ec-progress-glossary');
      if (glossaryButton) glossaryButton.addEventListener('click', goTo('glossary'));
      var startButton = main.querySelector('#ec-progress-start');
      if (startButton) startButton.addEventListener('click', goTo('practice'));

      var expandedId = null;
      function wireRecordToggles() {
        main.querySelectorAll('.ec-record-toggle').forEach(function (button) {
          button.addEventListener('click', function () {
            var index = parseInt(button.getAttribute('data-record-index'), 10);
            expandedId = (expandedId === index) ? null : index;
            var list = main.querySelector('#ec-records');
            if (list) {
              list.innerHTML = records.map(function (rec, i) {
                return recordHtml(rec, i, expandedId);
              }).join('');
            }
            wireRecordToggles();
          });
        });
      }
      wireRecordToggles();
    }
  });
})();
