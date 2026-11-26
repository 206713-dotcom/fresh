/* EcBiz paper2 view — Cambridge 0264 Paper 2 case-study simulator (plain ES5, no build). */
(function () {
  'use strict';
  if (!window.EC) return;
  var EC = window.EC;

  /* ------------------------------------------------------------------ *
   * Storage keys (EC.store prefixes every key with "ecbiz_").           *
   * ------------------------------------------------------------------ */
  var K_DRAFTS = 'p2_drafts';      // { scenarioId: { questionIndex: text } }
  var K_MARKS = 'p2_bookmarks';    // { key: true }
  var K_SUBS = 'p2_submissions';   // [ { scenarioId, question, score, ... } ]
  var K_POS = 'p2_position';       // { index, qidx }
  var K_COINS = 'p2_coins_awarded';// { key: true }
  var K_FLAG_IDS = 'flagged_question_ids'; // matches original flags.ts (ecbiz_ prefix added by EC.store)
  var K_FLAG_NOTES = 'question_flags';     // matches original flags.ts
  var K_COMPLETED = 'completed_questions'; // shared done-id list (ecbiz_completed_questions)
  var K_LAYOUT = 'exam_layout';            // shared layout preference (ecbiz_exam_layout)

  var AI_MODEL_LABEL = 'Qwen 3 0.6B';      // short label used by the local-AI engine UI

  var state = {
    data: [],
    index: 0,
    qidx: 0,
    tab: 'main',
    mode: 'step',            // 'step' | 'all'
    filterUnit: '',
    search: '',
    pickerOpen: false,
    onlySaved: false,
    jumpValue: '',
    drafts: {},
    bookmarks: {},
    submissions: [],
    coinsAwarded: {},
    showMS: {},              // question index -> bool
    showMA: {},              // question index -> bool
    showSelf: {},            // question index -> bool
    evals: {},               // question index -> saved assessment record
    overrideScore: {},       // question index -> chosen mark
    reason: {},              // question index -> self-assessment note
    overridePreset: {},      // question index -> chosen preset override reason
    useLocalAI: false,       // marks engine toggle ("Enable local AI" / "Instant Examiner")
    examiner: {},            // question index -> normalised examiner feedback record
    evaluating: {},          // question index -> true while the examiner is running
    layout: 'stacked',       // restored ExamLayoutPicker preference
    completedIds: [],        // canonical ids saved in completed_questions
    flagOpen: -1,            // question index whose local flag dialog is open, -1 = closed
    flagSavedFor: -1,        // question index that just saved a flag ("Flag saved on this device")
    flagReason: 'Typo in question',
    flagConfidence: 'Pretty sure',
    flagNote: '',
    flagIds: [],             // local-only flagged question ids
    flagNotes: [],           // local-only flag reports
    timerSeconds: 0,
    timerRunning: false,
    ready: false
  };

  var mainEl = null;
  var timerId = null;
  var flagScrollPrev = null;   // body overflow restored when the flag dialog closes
  var docKeyHandler = null;    // Escape-to-close listener (installed once per render)
  var aiUnsubscribe = null;    // EC.ai.onChange handle (installed once per render)

  /* ------------------------------------------------------------------ *
   * Small helpers                                                        *
   * ------------------------------------------------------------------ */
  function esc(v) { return EC.esc(v); }
  function s(v) { return String(v == null ? '' : v); }
  function clampI(v, lo, hi) {
    v = parseInt(v, 10);
    if (isNaN(v)) v = lo;
    return Math.max(lo, Math.min(hi, v));
  }
  function fmtTime(secs) {
    var m = Math.floor(secs / 60);
    var r = secs % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function countWords(t) {
    t = s(t).trim();
    return t ? t.split(/\s+/).length : 0;
  }
  function scenario() { return state.data[state.index] || null; }
  function questions() { var sc = scenario(); return sc ? (sc.questions || []) : []; }
  function qAt(i) { return questions()[i] || null; }
  function keyFor(id, num) { return s(id) + '|' + s(num); }
  function draftKey(i) { var q = qAt(i); return q ? q.number : s(i); }
  function caseKey(id) { return 'case|' + s(id); }
  function getDraft(i) {
    var sc = scenario();
    if (!sc) return '';
    var d = state.drafts[sc.scenario_id];
    return d && typeof d[i] === 'string' ? d[i] : '';
  }
  function setDraft(i, val) {
    var sc = scenario();
    if (!sc) return;
    if (!state.drafts[sc.scenario_id]) state.drafts[sc.scenario_id] = {};
    state.drafts[sc.scenario_id][i] = val;
    EC.store.set(K_DRAFTS, state.drafts);
  }
  function idxOfScenario(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].scenario_id === id) return i;
    }
    return -1;
  }
  function caseHasBookmark(sc) {
    if (!sc) return false;
    if (state.bookmarks[caseKey(sc.scenario_id)]) return true;
    var qs = sc.questions || [];
    for (var i = 0; i < qs.length; i++) {
      if (state.bookmarks[keyFor(sc.scenario_id, qs[i].number)]) return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ *
   * Shared helpers (AI status, layout, confetti, case context)           *
   * ------------------------------------------------------------------ */
  function unique(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (typeof list[i] === 'string' && out.indexOf(list[i]) < 0) out.push(list[i]);
    }
    return out;
  }
  function canonicalQuestionId(id) {
    var v = s(id);
    var hyphen = v.lastIndexOf('-');
    return hyphen >= 0 ? v.slice(0, hyphen) + '_' + v.slice(hyphen + 1) : v;
  }
  function clampPct(v) {
    var n = parseInt(v, 10);
    if (isNaN(n)) n = 0;
    return Math.max(0, Math.min(100, n));
  }

  /* Shared ExamLayoutPicker preference (ecbiz_exam_layout, legacy mock_layout). */
  function loadLayout() {
    var v = EC.store.get(K_LAYOUT, null);
    if (v === 'stacked' || v === 'columns') return v;
    var legacy = EC.store.get('mock_layout', null);
    if (legacy === 'stacked' || legacy === 'columns') {
      EC.store.set(K_LAYOUT, legacy);
      EC.store.del('mock_layout');
      return legacy;
    }
    return 'stacked';
  }

  /* Reads the live local-AI state exposed by js/views/ai-marker.js. */
  function aiInfo() {
    var st = {}, ready = false, loading = false, status = '', reason = '';
    try { if (EC.ai && EC.ai.state) st = EC.ai.state() || {}; } catch (e) {}
    try { if (EC.ai && EC.ai.isReady) ready = !!EC.ai.isReady(); } catch (e) {}
    try { if (EC.ai && EC.ai.isLoading) loading = !!EC.ai.isLoading(); } catch (e) {}
    try { if (EC.ai && EC.ai.reason) reason = s(EC.ai.reason()); } catch (e) {}
    status = s(st.status);
    var fileProtocol = !!(window.location && window.location.protocol === 'file:');
    var blocked = fileProtocol || /memory cap|Promise not supported/i.test(status) ||
      /memory cap/i.test(reason) || (/WebGPU hardware adapter unavailable/i.test(reason) && !/wasm/i.test(status));
    var error = !ready && !loading && /unavailable|failed|error/i.test(status) && !blocked;
    var percent = st.percent != null ? clampPct(st.percent) : clampPct(st.progress);
    /* PracticeStudio.tsx:1031 — "Loading local AI" with a live (N%) suffix. */
    var label = ready ? 'Local AI ready'
      : loading ? (percent > 0 ? 'Loading local AI (' + percent + '%)' : 'Loading local AI')
      : blocked ? 'Local AI unavailable'
      : error ? 'Retry local AI'
      : 'Enable local AI';
    return {
      ready: ready, loading: loading, label: label, status: status, reason: reason,
      error: error, blocked: blocked, percent: percent,
      device: s(st.device || 'webgpu')
    };
  }

  /* Zero-dependency confetti for high bands / marks. */
  var confettiCanvas = null, confettiFrame = null;
  function fireConfetti() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var doc = window.document;
      if (!doc || !doc.body || !window.requestAnimationFrame) return;
      if (!confettiCanvas) {
        confettiCanvas = doc.createElement('canvas');
        confettiCanvas.setAttribute('aria-hidden', 'true');
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.inset = '0';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '9999';
      }
      var canvas = confettiCanvas, ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = doc.documentElement.clientWidth || 800;
      canvas.height = doc.documentElement.clientHeight || 600;
      if (!canvas.parentNode) doc.body.appendChild(canvas);
      var colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
      var bits = [], i;
      for (i = 0; i < 60; i++) {
        bits.push({
          x: canvas.width / 2, y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 16,
          vy: -(6 + Math.random() * 11),
          size: 4 + Math.random() * 6,
          rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.3,
          color: colors[i % colors.length], life: 90 + Math.random() * 50
        });
      }
      if (confettiFrame) window.cancelAnimationFrame(confettiFrame);
      var ticks = 0;
      function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var alive = 0;
        for (var b = 0; b < bits.length; b++) {
          var p = bits[b];
          if (p.life <= 0) continue;
          alive++;
          p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.rot += p.spin; p.life--;
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = Math.min(1, p.life / 25);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
        ticks++;
        if (alive && ticks < 180) confettiFrame = window.requestAnimationFrame(step);
        else {
          confettiFrame = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      }
      confettiFrame = window.requestAnimationFrame(step);
    } catch (e) { /* decorative only */ }
  }
  function isHighMark(q, score, level) {
    var label = s(level);
    if (label.indexOf('Level 3') >= 0 || label.indexOf('Band 3') >= 0 || score >= 7) return true;
    return q && q.mark_value === 12 && score >= 9;
  }

  /* Appendix values may be strings or objects; produce readable case text. */
  function appendixTextValue(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v, null, 2); } catch (e) { return s(v); }
  }
  function fullCaseContext(sc) {
    var csi = (sc && sc.case_study_insert) || {};
    var fin = csi.appendix_2_financial_data;
    var finSummary = '';
    if (fin && fin.rows && fin.rows.length) {
      var parts = [];
      for (var i = 0; i < fin.rows.length; i++) {
        var row = fin.rows[i] || [];
        if (row.length) parts.push(row[0] + ' ($' + row[row.length - 1] + 'm)');
      }
      finSummary = parts.join(', ');
    }
    var out = [
      csi.main_stem || '',
      appendixTextValue(csi.appendix_1_marketing_ops),
      finSummary ? ((fin && fin.title) || 'Financials') + ': ' + finSummary : '',
      appendixTextValue(csi.appendix_3_external_environment)
    ];
    var lines = [];
    for (var j = 0; j < out.length; j++) { if (s(out[j]).trim()) lines.push(s(out[j])); }
    return lines.join('\n');
  }

  /* Navigation list honours the unit/section filter and the saved filter. */
  function navList() {
    var out = [];
    for (var i = 0; i < state.data.length; i++) {
      var sc = state.data[i];
      if (state.filterUnit && sc.unit !== state.filterUnit) continue;
      if (state.onlySaved && !caseHasBookmark(sc)) continue;
      out.push(sc);
    }
    return out;
  }
  function filtered() {
    var list = navList();
    var q = s(state.search).trim().toLowerCase();
    if (!q) return list;
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var sc = list[i];
      var stem = sc.case_study_insert ? sc.case_study_insert.main_stem : '';
      if (s(sc.scenario_id).toLowerCase().indexOf(q) >= 0 ||
          s(stem).toLowerCase().indexOf(q) >= 0 ||
          s(sc.unit).toLowerCase().indexOf(q) >= 0) {
        out.push(sc);
      }
    }
    return out;
  }
  function units() {
    var seen = {}, out = [];
    for (var i = 0; i < state.data.length; i++) {
      var u = state.data[i].unit;
      if (u && !seen[u]) { seen[u] = 1; out.push(u); }
    }
    return out;
  }
  function savePosition() {
    EC.store.set(K_POS, { index: state.index, qidx: state.qidx });
  }
  function syncUrl() {
    try {
      history.replaceState(null, '', location.pathname +
        '?open=paper2&case=' + (state.index + 1) + '&q=' + (state.qidx + 1));
    } catch (e) { /* file:// or restricted context */ }
  }

  /* ------------------------------------------------------------------ *
   * Band / level descriptors — self marking                             *
   * ------------------------------------------------------------------ */
  function bandInfo(q, rawScore) {
    var max = q.mark_value;
    var score = clampI(rawScore, 0, max);
    if (max === 12) {
      if (score >= 9) {
        return { label: 'Level 3 (9–12 marks)', cls: 'l3',
          desc: 'Detailed discussion of all options in context with a fully supported recommendation.',
          tags: ['Justified Judgement — Weighs Trade-offs', 'Knowledge & Context Shown', 'Developed Consequence Chain'] };
      }
      if (score >= 5) {
        return { label: 'Level 2 (5–8 marks)', cls: 'l2',
          desc: 'Detailed analysis of advantages/disadvantages of options in business context.',
          tags: ['Contextual Analysis of Options', 'Knowledge & Context Shown', 'Basic Judgement — Weigh Trade-offs'] };
      }
      if (score >= 1) {
        return { label: 'Level 1 (1–4 marks)', cls: 'l1',
          desc: 'Outline of concepts or generic points with limited business application.',
          tags: ['Basic Outline Knowledge', 'Needs Case Context'] };
      }
      return { label: 'Level 0 (0 marks)', cls: 'l0',
        desc: 'No creditable points identified.',
        tags: ['No Creditable Points Identified'] };
    }
    if (score >= 7) {
      return { label: 'Maximum Band (7–8 marks)', cls: 'l3',
        desc: 'Exemplar knowledge, strong application to case facts, and thorough developed analysis.',
        tags: ['Strong Knowledge', 'Applied To Case Facts', 'Developed Analysis'] };
    }
    if (score >= 5) {
      return { label: 'Strong Band (5–6 marks)', cls: 'l2',
        desc: 'Accurate business concepts with applied analytical reasoning.',
        tags: ['Accurate Concepts', 'Applied Reasoning'] };
    }
    if (score >= 3) {
      return { label: 'Moderate Band (3–4 marks)', cls: 'l1',
        desc: 'Basic knowledge with limited contextual application.',
        tags: ['Basic Knowledge', 'Needs Case Context'] };
    }
    if (score >= 1) {
      return { label: 'Basic Band (1–2 marks)', cls: 'l0',
        desc: 'Identification of points without development.',
        tags: ['Points Identified', 'Needs Development'] };
    }
    return { label: '0 marks', cls: 'l0', desc: 'No creditable response.',
      tags: ['No Creditable Response'] };
  }

  /* Numeric AO breakdown, including AO4 for the Levels-based 12-markers. */
  function aoBreakdown(q, rawScore) {
    var max = q.mark_value;
    var score = clampI(rawScore, 0, max);
    var ao1Max = 2, ao2Max = max === 12 ? 3 : 2, ao3Max = 4, ao4Max = max === 12 ? 3 : 0;
    var a1 = Math.min(ao1Max, Math.round(score / max * ao1Max));
    var a2 = Math.min(ao2Max, Math.round(score / max * ao2Max));
    var a3 = Math.min(ao3Max, Math.round(score / max * ao3Max));
    var a4 = max === 12 ? Math.max(0, score - (a1 + a2 + a3)) : 0;
    var out = [
      { name: 'AO1: Knowledge', score: a1, max: ao1Max,
        feedback: 'Knowledge & Understanding self-assessed against 0264 mark scheme (' + a1 + '/' + ao1Max + ').' },
      { name: 'AO2: Application', score: a2, max: ao2Max,
        feedback: 'Contextual application to case scenario verified by student (' + a2 + '/' + ao2Max + ').' },
      { name: 'AO3: Analysis', score: a3, max: ao3Max,
        feedback: 'Chain of cause-and-effect reasoning self-assessed (' + a3 + '/' + ao3Max + ').' }
    ];
    if (max === 12) {
      out.push({ name: 'AO4: Evaluation', score: a4, max: ao4Max,
        feedback: 'Evaluation & justified recommendation self-assessed (' + a4 + '/' + ao4Max + ').' });
    }
    return out;
  }
  function tagClass(tag) {
    if (tag.indexOf('Repeated') === 0 || tag.indexOf('No Credit') === 0 || tag.indexOf('No ') === 0)
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800';
    if (tag.indexOf('Needs') === 0)
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800';
    return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800';
  }
  function tagRow(tags) {
    if (!tags || !tags.length) return '';
    var h = '<div class="flex flex-wrap gap-1.5">';
    for (var i = 0; i < tags.length; i++) {
      h += '<span class="px-2 py-0.5 rounded border text-[10px] font-semibold ' + tagClass(tags[i]) + '">' + esc(tags[i]) + '</span>';
    }
    return h + '</div>';
  }

  /* 12-markers are Levels-based: qualitative diagnostics, never K/App/An/Eval sums. */
  function twelveMarkParagraphTags(p) {
    if (p.is_duplicate) return ['Repeated Point — No Additional Credit'];
    if (p.role === 'conclusion') {
      var ev = p.eval_score != null ? p.eval_score : 0;
      if (ev >= 2) return ['Justified Judgement — Weighs Trade-offs'];
      if (ev === 1) return ['Basic Judgement — Weigh Trade-offs'];
      return ['Needs Contextual Judgement'];
    }
    var tags = [];
    if (p.k_score >= 1 && p.app_score >= 1) tags.push('Knowledge & Context Shown');
    else if (p.k_score >= 1) tags.push('Knowledge Shown — Needs Case Context');
    else tags.push('Needs Knowledge');
    if (p.an_score >= 1) tags.push(p.has_detailed_an ? 'Developed Consequence Chain' : 'Basic Consequence Chain');
    else tags.push('Needs Consequence Chain');
    return tags;
  }
  function twelveTagClass(tag) {
    if (tag.indexOf('Repeated') === 0)
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800';
    if (tag.indexOf('Needs') === 0)
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800';
    return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800';
  }

  /* ------------------------------------------------------------------ *
   * Examiner / local-AI / local flag helpers                            *
   * ------------------------------------------------------------------ */
  function questionInfo(i) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q) return null;
    var csi = sc.case_study_insert || {};
    var keys = q.qwen_marking_keys || {};
    /* Full case context (main stem + Appendix 1 + financial summary + Appendix 3). */
    var fullCase = fullCaseContext(sc);
    return {
      questionId: keyFor(sc.scenario_id, q.number),
      scenarioId: sc.scenario_id,
      paper: 2,
      mark_value: q.mark_value,
      markValue: q.mark_value,
      question_text: q.question_text,
      questionText: q.question_text,
      caseMainStem: fullCase,
      scenario_stem: fullCase,
      case_stem: fullCase,
      model_answer: q.model_answer || '',
      mark_scheme: q.mark_scheme || {},
      qwen_marking_keys: keys,
      validAppWords: keys.valid_app_words || []
    };
  }

  /* Calls the optional window.EC.autoMark hook (sync or promise). */
  function withAutoMark(i, done) {
    var hook = window.EC && window.EC.autoMark;
    var answer = getDraft(i);
    if (!s(answer).trim() || typeof hook !== 'function') { done(null); return; }
    var info = questionInfo(i);
    if (!info) { done(null); return; }
    var r;
    try { r = hook(answer, info); } catch (e) { done(null); return; }
    if (r && typeof r.then === 'function') {
      r.then(function (v) { done(v || null); }, function () { done(null); });
    } else {
      done(r || null);
    }
  }

  /* Deterministic local fallback when the automatic examiner is unavailable. */
  function localExaminerResult(i) {
    var q = qAt(i);
    if (!q) return null;
    var words = countWords(getDraft(i));
    var guess = clampI(Math.round(words / 12), 0, q.mark_value);
    if (guess < 2 && words > 0) guess = Math.min(2, q.mark_value);
    var info = bandInfo(q, guess);
    return {
      local: true,
      totalScore: guess,
      maxMarks: q.mark_value,
      percentage: Math.round(guess / q.mark_value * 100),
      level: info.label,
      levelDescription: info.desc,
      aoBreakdown: aoBreakdown(q, guess),
      strengths: info.tags,
      improvements: ['Use specific case facts and causal connectives to develop AO2/AO3 analysis.'],
      examinerNotes: 'Local offline summary — the automatic examiner is unavailable in this browser.'
    };
  }

  /* Accepts both the ai-marker.js shape (ao1..ao4) and our local (array) shape.
   * All examiner fields are retained: paragraphAudits, AO details, rule
   * enforcement, override metadata, etc. — the eval card renders them all. */
  function normalizeResult(r, q) {
    if (!r) return null;
    var max = q ? q.mark_value : clampI(r.maxMarks, 1, 20);
    var rawMax = r.maxMarks != null ? r.maxMarks : (r.max != null ? r.max : (r.markValue != null ? r.markValue : max));
    var outMax = clampI(rawMax, 0, 20) || max;
    var score = clampI(r.totalScore != null ? r.totalScore : r.score, 0, max);
    var label = s(r.level || (q ? bandInfo(q, score).label : ''));
    var desc = s(r.levelDescription || (q ? bandInfo(q, score).desc : ''));
    var notes = s(r.examinerNotes || r.feedback || r.notes || '');
    var d = {
      score: score,
      max: outMax,
      markValue: outMax,
      percentage: r.percentage != null ? clampI(r.percentage, 0, 100) : Math.round(score / Math.max(1, max) * 100),
      level: label,
      band: label,
      description: desc,
      levelDescription: desc,
      notes: notes,
      examinerNotes: notes,
      breakdown: [],
      aoBreakdown: {},
      strengths: [],
      improvements: [],
      paragraphAudits: Array.isArray(r.paragraphAudits) ? r.paragraphAudits : [],
      ruleEnforcement: r.ruleEnforcement || null,
      appWordsFound: Array.isArray(r.appWordsFound) ? r.appWordsFound : [],
      modelAnswerSnippet: s(r.modelAnswerSnippet || ''),
      requirementToLevel3: s(r.requirementToLevel3 || ''),
      local: !!r.local,
      source: s(r.source || ''),
      isAiEvaluated: !!r.isAiEvaluated,
      originalAiScore: r.originalAiScore != null ? clampI(r.originalAiScore, 0, max) : undefined,
      isManuallyOverridden: !!r.isManuallyOverridden,
      overrideReason: s(r.overrideReason || ''),
      evaluatedAt: s(r.evaluatedAt || ''),
      tags: Array.isArray(r.tags) ? r.tags.slice() : [],
      note: s(r.note || r.overrideReason || ''),
      selfAssessed: !!r.selfAssessed
    };
    var bd = r.aoBreakdown;
    var names = ['AO1: Knowledge', 'AO2: Application', 'AO3: Analysis', 'AO4: Evaluation'];
    var keys = ['ao1', 'ao2', 'ao3', 'ao4'];
    if (Array.isArray(bd) && bd.length) {
      for (var i = 0; i < bd.length; i++) {
        var a = bd[i] || {};
        d.breakdown.push({ name: s(a.name || names[i] || ''), score: a.score, max: a.max, feedback: s(a.feedback) });
        if (keys[i]) d.aoBreakdown[keys[i]] = { score: a.score, max: a.max, feedback: s(a.feedback) };
      }
    } else if (bd) {
      for (var j = 0; j < keys.length; j++) {
        var ao = bd[keys[j]];
        if (ao && ao.max > 0) {
          d.breakdown.push({ name: names[j], score: ao.score, max: ao.max, feedback: s(ao.feedback) });
          d.aoBreakdown[keys[j]] = { score: ao.score, max: ao.max, feedback: s(ao.feedback) };
        }
      }
    }
    var fields = ['strengths', 'improvements'];
    for (var k = 0; k < fields.length; k++) {
      var arr = r[fields[k]];
      if (Array.isArray(arr)) {
        for (var m = 0; m < arr.length; m++) d[fields[k]].push(s(arr[m]));
      } else if (arr) d[fields[k]].push(s(arr));
    }
    return d;
  }

  /* Rebuild a record from the shape written to p2_submissions. */
  function storedResult(rec, q) {
    var d = normalizeResult(rec, q);
    if (d && !d.tags.length && q) d.tags = bandInfo(q, d.score).tags;
    return d;
  }

  /* Adds scenario/question metadata to an examiner result before persisting. */
  function withMeta(i, d) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q || !d) return d;
    d.scenarioId = sc.scenario_id;
    d.unit = sc.unit;
    d.question = q.number;
    d.markValue = d.max;
    d.answer = getDraft(i);
    d.at = new Date().toISOString();
    if (!d.evaluatedAt) d.evaluatedAt = d.at;
    if (!d.tags.length) d.tags = bandInfo(q, d.score).tags;
    if (!d.note) d.note = s(state.reason[i] || '').trim();
    return d;
  }

  function findSubmission(scenarioId, questionNum) {
    for (var i = 0; i < state.submissions.length; i++) {
      var rec = state.submissions[i];
      if (rec && rec.scenarioId === scenarioId && rec.question === questionNum) return rec;
    }
    return null;
  }

  /* Self-assessment marks survive a reload via p2_submissions. */
  function restoreMarksForScenario() {
    state.evals = {}; state.examiner = {}; state.overrideScore = {};
    state.reason = {}; state.overridePreset = {};
    var sc = scenario();
    if (!sc) return;
    var qs = sc.questions || [];
    for (var i = 0; i < qs.length; i++) {
      var saved = findSubmission(sc.scenario_id, qs[i].number);
      if (!saved) continue;
      var rec = storedResult(saved, qs[i]);
      if (!rec) continue;
      state.evals[i] = rec;
      state.examiner[i] = rec;
      state.overrideScore[i] = rec.score;
      state.reason[i] = rec.note || '';
    }
  }

  function markCompleted(i) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q) return;
    var id = canonicalQuestionId(s(sc.scenario_id) + '_' + s(q.number));
    if (state.completedIds.indexOf(id) < 0) {
      state.completedIds.push(id);
      EC.store.set(K_COMPLETED, state.completedIds);
    }
  }

  /* Persist a full evaluator record and remember the canonical completed id. */
  function persistEval(i, rec) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q || !rec) return;
    state.evals[i] = rec;
    state.examiner[i] = rec;
    state.overrideScore[i] = clampI(rec.score, 0, q.mark_value);
    if (rec.note) state.reason[i] = rec.note;
    var subs = [], replaced = false;
    for (var j = 0; j < state.submissions.length; j++) {
      var old = state.submissions[j];
      if (old && old.scenarioId === rec.scenarioId && old.question === rec.question) {
        subs.push(rec); replaced = true;
      } else subs.push(old);
    }
    if (!replaced) subs.push(rec);
    state.submissions = subs;
    EC.store.set(K_SUBS, subs);
    markCompleted(i);
    var key = keyFor(sc.scenario_id, q.number);
    if (!state.coinsAwarded[key]) {
      state.coinsAwarded[key] = true;
      EC.store.set(K_COINS, state.coinsAwarded);
      EC.earnPoints(5, "Paper 2 practice completed", "paper2:" + key);
    }
    savePosition();
  }

  function showExaminer(i, r, source) {
    var q = qAt(i);
    var d = normalizeResult(r, q);
    if (d) d.source = source;
    state.examiner[i] = d;
    renderAll();
  }

  /* Primary "Enable local AI" button: load the model in place, even when the
     answer box is empty. Paper2PracticeView.tsx:674-677 does exactly this —
     setUseLocalAI(true) plus initializeWebLLM(), never a page navigation. */
  function enableLocalAI(i) {
    state.useLocalAI = true;
    if (EC.ai && typeof EC.ai.load === 'function') EC.ai.load();
    /* Keep the immediate marking of an existing answer, but only call it a
       Local AI evaluation once the model is actually ready. */
    if (i >= 0 && s(getDraft(i)).trim()) {
      var aiActive = !!(EC.ai && EC.ai.isReady && EC.ai.isReady());
      withAutoMark(i, function (r) {
        showExaminer(i, r || localExaminerResult(i), aiActive ? 'Local AI' : 'Instant Examiner');
      });
    }
    renderAll();
  }

  function runInstantExaminer(i) {
    if (!s(getDraft(i)).trim()) return;
    state.useLocalAI = false;
    withAutoMark(i, function (r) { showExaminer(i, r || localExaminerResult(i), 'Instant Examiner'); });
    renderAll();
  }

  /* Always re-evaluates — the early "already evaluated" return was the defect. */
  function submitForAssessment(i) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q || !s(getDraft(i)).trim() || state.evaluating[i]) return;
    stopTimer();
    state.evaluating[i] = true;
    renderAll();
    withAutoMark(i, function (r) {
      var d = normalizeResult(r || localExaminerResult(i), q);
      state.evaluating[i] = false;
      if (d) {
        var useLocal = state.useLocalAI && EC.ai && EC.ai.isReady && EC.ai.isReady();
        d.source = useLocal ? 'Local AI' : 'Cambridge Senior Examiner';
        d.isAiEvaluated = r && !r.local ? !!r.isAiEvaluated : false;
        persistEval(i, withMeta(i, d));
        if (isHighMark(q, d.score, d.level)) fireConfetti();
      }
      renderAll();
    });
  }

  function renderExaminer(i) {
    var d = state.examiner[i];
    if (!d) return '';
    var h = '<div class="mt-4 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-3">' +
      '<div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200 dark:border-emerald-800">' +
        '<div class="flex items-center gap-2">' +
          '<span class="p-1.5 rounded-lg bg-emerald-600 text-white">' + ico(ICON.sparkles, 'w-4 h-4') + '</span>' +
          '<div>' +
            '<h4 class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">' + esc(d.source || 'Examiner') + ' · 0264 CIE feedback</h4>' +
            '<p class="text-[11px] text-neutral-600 dark:text-neutral-400">' + esc(d.local ? 'Offline summary (automatic examiner unavailable).' : 'Examiner breakdown generated for this answer.') + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">' + esc(d.score) + ' / ' + esc(d.max) + ' · ' + esc(d.percentage) + '%</span>' +
          '<button type="button" class="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer" data-act="close-examiner" data-q="' + i + '" aria-label="Close examiner feedback">✕</button>' +
        '</div>' +
      '</div>';
    if (d.level) {
      h += '<div class="flex flex-wrap items-center gap-2">' +
        '<span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black">' + esc(d.level) + '</span>' +
        (d.description ? '<span class="text-[11px] text-neutral-600 dark:text-neutral-400">' + esc(d.description) + '</span>' : '') +
      '</div>';
    }
    if (d.breakdown.length) {
      h += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">';
      for (var b = 0; b < d.breakdown.length; b++) {
        var a = d.breakdown[b];
        h += '<div class="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">' +
          '<div class="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">' +
            '<span>' + esc(a.name) + '</span><span class="font-mono text-[#0F2042] dark:text-[#38BDF8]">' + esc(a.score) + ' / ' + esc(a.max) + '</span>' +
          '</div>' +
          (a.feedback ? '<p class="text-[11px] text-neutral-600 dark:text-neutral-400">' + esc(a.feedback) + '</p>' : '') +
        '</div>';
      }
      h += '</div>';
    }
    h += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
      '<div class="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-900"><div class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">Strengths</div>' +
      listField(d.strengths.length ? d.strengths : ['Your response was assessed against the 0264 criteria.']) + '</div>' +
      '<div class="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-900"><div class="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">Improvements</div>' +
      listField(d.improvements.length ? d.improvements : ['Add developed case-specific reasoning to reach the next band.']) + '</div>' +
      '</div>';
    if (d.notes) h += '<p class="text-[11px] italic text-neutral-600 dark:text-neutral-400">' + esc(d.notes) + '</p>';
    h += '<div class="flex flex-wrap items-center gap-2">' +
      '<button type="button" class="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950" data-act="open-ai-marker">Open full AI Marker ↗</button>' +
      '<button type="button" class="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-semibold cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700" data-act="open-self" data-q="' + i + '">✏️ Self-Assess / Grade</button>' +
      '</div>';
    return h + '</div>';
  }

  function questionFlagId(i) {
    var sc = scenario(), q = qAt(i);
    return sc && q ? s(sc.scenario_id) + '_' + s(q.number) : '';
  }
  function isFlagged(i) {
    var id = questionFlagId(i);
    return !!id && state.flagIds.indexOf(id) >= 0;
  }
  /* The original stores flagged ids in one key and full reports in another;
   * the union of both is the source of truth. */
  function loadFlags() {
    var ids = EC.store.get(K_FLAG_IDS, []);
    var notes = EC.store.get(K_FLAG_NOTES, []);
    var merged = [];
    if (Array.isArray(ids)) for (var i = 0; i < ids.length; i++) merged.push(ids[i]);
    state.flagNotes = Array.isArray(notes) ? notes : [];
    for (var j = 0; j < state.flagNotes.length; j++) {
      var note = state.flagNotes[j];
      if (note && note.questionId) merged.push(note.questionId);
    }
    state.flagIds = unique(merged);
  }
  function restoreFlagScroll() {
    if (flagScrollPrev !== null) {
      try { document.body.style.overflow = flagScrollPrev; } catch (e) {}
      flagScrollPrev = null;
    }
  }
  function openFlagDialog(i) {
    state.flagOpen = i;
    if (flagScrollPrev === null) {
      try {
        flagScrollPrev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } catch (e) {}
    }
    renderAll();
  }
  function closeFlagDialog() {
    if (state.flagOpen < 0) { restoreFlagScroll(); return; }
    state.flagOpen = -1;
    restoreFlagScroll();
    renderAll();
  }
  function saveFlag(i) {
    var id = questionFlagId(i);
    if (!id) return;
    var note = s(state.flagNote).trim().slice(0, 240);
    if (state.flagIds.indexOf(id) < 0) state.flagIds.push(id);
    var entry = {
      questionId: id,
      reason: s(state.flagReason),
      confidence: s(state.flagConfidence),
      note: note,
      timestamp: new Date().toISOString()
    };
    var notes = [entry];
    for (var j = 0; j < state.flagNotes.length; j++) {
      if (state.flagNotes[j] && state.flagNotes[j].questionId !== id) notes.push(state.flagNotes[j]);
    }
    state.flagNotes = notes.slice(0, 500);
    EC.store.set(K_FLAG_IDS, state.flagIds);
    EC.store.set(K_FLAG_NOTES, state.flagNotes);
    state.flagSavedFor = i;
    state.flagOpen = -1;
    restoreFlagScroll();
    state.flagNote = '';
    state.flagReason = 'Typo in question';
    state.flagConfidence = 'Pretty sure';
    renderAll();
  }
  function renderFlagButton(i) {
    if (state.flagSavedFor === i && questionFlagId(i)) {
      return '<span class="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">' +
        ico(ICON.check, 'h-3 w-3') + ' Flag saved on this device</span>';
    }
    if (isFlagged(i) || !questionFlagId(i)) {
      return '<span class="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">' +
        ico(ICON.check, 'h-3 w-3') + ' Flagged locally</span>';
    }
    return '<button type="button" class="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--line)] hover:bg-[var(--sheet-surface)] hover:text-[var(--ink)] dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer" data-act="open-flag" data-q="' + i + '" title="Save an issue note on this device" aria-haspopup="dialog" aria-expanded="' + (state.flagOpen === i ? 'true' : 'false') + '">' +
      ico(ICON.flag, 'h-3 w-3') + ' Flag issue</button>';
  }
  function renderFlagDialog() {
    if (state.flagOpen < 0) return '';
    var i = state.flagOpen;
    var id = questionFlagId(i);
    var q = qAt(i);
    var reasons = ['Typo in question', 'Mark scheme issue', 'Wrong unit / tag', 'Other'];
    var confidences = ['Pretty sure', 'Very confident', '100% certain'];
    var h = '<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">' +
      '<button type="button" aria-label="Close report dialog" class="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-pointer" data-act="close-flag"></button>' +
      '<div role="dialog" aria-modal="true" aria-labelledby="flag-question-title" class="relative m-0 w-full max-w-md rounded-t-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:m-4 sm:rounded-2xl">' +
        '<div class="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">' +
          '<h3 id="flag-question-title" class="flex items-center gap-2 font-academic-serif text-base font-bold text-[var(--green)] dark:text-white">' + ico(ICON.flag, 'h-4 w-4') + ' Flag question locally</h3>' +
          '<button type="button" class="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 cursor-pointer" data-act="close-flag" aria-label="Close">✕</button>' +
        '</div>' +
        '<p class="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">' + esc(id) + (q ? ' · Question ' + esc(q.number) : '') + '</p>' +
        '<p class="mt-2 text-xs text-neutral-600 dark:text-neutral-300">This note is saved in this browser for your reference.</p>' +
        '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">What\'s wrong?</legend>' +
          '<div class="mt-1.5 grid grid-cols-2 gap-1.5">';
    for (var a = 0; a < reasons.length; a++) {
      var sel = state.flagReason === reasons[a];
      h += '<label class="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-all ' +
        (sel ? 'border-[var(--green)] bg-[var(--green)] text-white dark:border-[#38BDF8] dark:bg-[#38BDF8] dark:text-[#0F172A]' : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-700') + '" data-act="flag-reason" data-value="' + esc(reasons[a]) + '">' +
        '<input type="radio" name="flag-reason" class="sr-only"' + (sel ? ' checked' : '') + '>' + esc(reasons[a]) + '</label>';
    }
    h += '</div></fieldset>' +
      '<fieldset class="mt-3"><legend class="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">How sure are you?</legend>' +
        '<div class="mt-1.5 inline-flex w-full rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800" role="radiogroup" aria-label="Confidence level">';
    for (var b = 0; b < confidences.length; b++) {
      var csel = state.flagConfidence === confidences[b];
      h += '<button type="button" class="flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all cursor-pointer ' +
        (csel ? 'bg-white text-[var(--green)] shadow-sm dark:bg-neutral-900 dark:text-[#38BDF8]' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200') + '" data-act="flag-confidence" data-value="' + esc(confidences[b]) + '" role="radio" aria-checked="' + csel + '">' + esc(confidences[b]) + '</button>';
    }
    h += '</div></fieldset>' +
      '<label class="mt-3 block text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400" for="flag-note">Note (optional)</label>' +
      '<textarea id="flag-note" data-flag-note="1" rows="2" maxlength="240" placeholder="What exactly is wrong? e.g. option B and the mark scheme disagree about the formula…" class="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[var(--green)] focus:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">' + esc(state.flagNote) + '</textarea>' +
      '<div class="mt-4 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">' +
        '<span class="font-mono text-[10px] text-neutral-400" id="flag-note-count">' + s(state.flagNote).length + '/240</span>' +
        '<div class="flex items-center gap-2">' +
          '<button type="button" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer" data-act="close-flag">Cancel</button>' +
          '<button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--green)] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90 cursor-pointer" data-act="save-flag" data-q="' + i + '">' + ico(ICON.flag, 'h-3.5 w-3.5') + ' Save on this device</button>' +
        '</div>' +
      '</div>' +
      '</div></div>';
    return h;
  }

  /* ------------------------------------------------------------------ *
   * Inline lucide-style icons (static markup, no runtime dependency).    *
   * ------------------------------------------------------------------ */
  function ico(path, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + cls + '" aria-hidden="true">' + path + '</svg>';
  }
  var ICON = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    rows: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/>',
    columns: '<rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'
  };

  /* ------------------------------------------------------------------ *
   * Safe content rendering (every dynamic value passes through EC.esc)  *
   * ------------------------------------------------------------------ */
  function listField(v) {
    if (v == null || v === '') return '';
    var h = '<ul class="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">';
    if (Array.isArray(v)) {
      for (var i = 0; i < v.length; i++) h += '<li>' + esc(v[i]) + '</li>';
    } else {
      h += '<li>' + esc(v) + '</li>';
    }
    return h + '</ul>';
  }

  /* Port of renderAppendix2Content from Paper2PracticeView.tsx. */
  function appendix2Content(data) {
    if (!data) return '<p class="text-sm italic text-neutral-500">No financial data provided.</p>';
    if (typeof data === 'string') {
      return '<p class="text-sm leading-relaxed whitespace-pre-line text-neutral-800 dark:text-neutral-200">' + esc(data) + '</p>';
    }
    var h = '<div class="space-y-3">';
    if (data.title) {
      h += '<h4 class="text-xs font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">' + esc(data.title) + '</h4>';
    }
    if (data.headers && data.rows) {
      h += '<div class="overflow-x-auto rounded-lg border border-[#E7E5E4] dark:border-neutral-800">' +
        '<table class="w-full text-xs text-left"><thead class="bg-[#F5F5F4] dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-bold border-b border-[#E7E5E4] dark:border-neutral-800"><tr>';
      for (var c = 0; c < data.headers.length; c++) {
        h += '<th class="px-3 py-2">' + esc(data.headers[c]) + '</th>';
      }
      h += '</tr></thead><tbody class="divide-y divide-[#E7E5E4] dark:divide-neutral-800 font-mono">';
      for (var r = 0; r < data.rows.length; r++) {
        var row = data.rows[r] || [];
        h += '<tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">';
        for (var j = 0; j < row.length; j++) {
          h += '<td class="px-3 py-2 ' + (j === 0 ? 'font-sans font-medium text-neutral-800 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400') + '">' + esc(row[j]) + '</td>';
        }
        h += '</tr>';
      }
      h += '</tbody></table></div>';
    }
    return h + '</div>';
  }

  /* Case-study block wrapper + appendix body, using the original app's classes. */
  function caseBlock(title, dot, body) {
    return '<div class="space-y-4">' +
      '<div class="flex items-center gap-2">' +
        '<span class="w-2 h-2 rounded-full ' + dot + '"></span>' +
        '<h3 class="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">' + title + '</h3>' +
      '</div>' + body + '</div>';
  }
  function appendixText(value, boxClass) {
    var text = (typeof value === 'string') ? value : JSON.stringify(value, null, 2);
    return '<div class="p-4 rounded-xl ' + boxClass + ' text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-line">' + esc(text) + '</div>';
  }
  var APP1_BOX = 'border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20';
  var APP3_BOX = 'border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20';

  /* ------------------------------------------------------------------ *
   * Mark-scheme / model-answer panels                                    *
   * ------------------------------------------------------------------ */
  function renderMarkScheme(q) {
    var ms = q.mark_scheme || {};
    var max = q.mark_value;
    var is12 = max === 12;
    var h = '<div class="mt-4 p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-indigo-950/30 space-y-4 shadow-sm">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100 dark:border-neutral-800">' +
        '<div class="flex items-center gap-2">' +
          '<span class="p-1.5 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold">0264</span>' +
          '<div>' +
            '<h4 class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">' +
              ico(ICON.shield, 'w-4 h-4 text-indigo-600 dark:text-indigo-400') +
              'Official Cambridge 0264 Paper 2 Mark Scheme &amp; Rubric' +
            '</h4>' +
            '<span class="text-[11px] text-neutral-500 dark:text-neutral-400">Exact mark allocation criteria from 0264 Paper 2 database</span>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">Max: ' + esc(max) + ' Marks</span>' +
        '</div>' +
      '</div>';

    if (is12) {
      var levels = [
        { dot: 'bg-emerald-500', wrap: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30',
          textCls: 'text-emerald-800 dark:text-emerald-300', rangeCls: 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100',
          range: '9–12 marks', title: 'Level 3 (9–12 marks): Comprehensive Evaluation & Supported Justification',
          text: ms.level_3_9_to_12 || 'Detailed discussion of all options in context with a fully supported recommendation.' },
        { dot: 'bg-blue-500', wrap: 'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30',
          textCls: 'text-blue-800 dark:text-blue-300', rangeCls: 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
          range: '5–8 marks', title: 'Level 2 (5–8 marks): Contextual Analysis of Benefits & Drawbacks',
          text: ms.level_2_5_to_8 || 'Detailed discussion of advantages/disadvantages of options in business context.' },
        { dot: 'bg-amber-500', wrap: 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30',
          textCls: 'text-amber-800 dark:text-amber-300', rangeCls: 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100',
          range: '1–4 marks', title: 'Level 1 (1–4 marks): Basic Outline Knowledge',
          text: ms.level_1_1_to_4 || 'Outline points with limited or no application to the business.' }
      ];
      h += '<div class="space-y-3">' +
        '<div class="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Specific Level Criteria for Question ' + esc(q.number) + ' (12 Marks)</div>';
      for (var i = 0; i < levels.length; i++) {
        h += '<div class="p-3.5 rounded-xl border ' + levels[i].wrap + '">' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-xs font-bold ' + levels[i].textCls + ' flex items-center gap-1.5">' +
              '<span class="w-2.5 h-2.5 rounded-full ' + levels[i].dot + '"></span>' + esc(levels[i].title) +
            '</span>' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded ' + levels[i].rangeCls + ' font-bold">' + esc(levels[i].range) + '</span>' +
          '</div>' +
          '<p class="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">' + esc(levels[i].text) + '</p>' +
        '</div>';
      }
      h += '</div>';
    } else {
      h += '<div class="space-y-3">' +
        '<div class="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Specific Mark Allocation for Question ' + esc(q.number) + ' (8 Marks)</div>';
      if (ms.knowledge_max_2) {
        h += '<div class="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-xs font-bold text-indigo-900 dark:text-indigo-300">AO1: Knowledge &amp; Understanding (Max 2 Marks)</span>' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 font-bold">Max 2 marks</span>' +
          '</div>' + listField(ms.knowledge_max_2) + '</div>';
      }
      if (ms.application_analysis_max_6) {
        h += '<div class="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30">' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-xs font-bold text-purple-900 dark:text-purple-300">AO2 &amp; AO3: Application &amp; Analysis (Max 6 Marks)</span>' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 font-bold">Max 6 marks</span>' +
          '</div>' + listField(ms.application_analysis_max_6) + '</div>';
      }
      if (ms.working_marks) {
        h += '<div class="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-xs font-bold text-blue-900 dark:text-blue-300">Method &amp; Working Marks</span>' +
          '</div>' + listField(ms.working_marks) + '</div>';
      }
      h += '</div>';
    }

    /* Cambridge 0264 Assessment Objectives Grid — shown on 8- AND 12-markers. */
    h += '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
      '<div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"><div class="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO1 Knowledge</div><div class="text-[10px] text-neutral-500">Definitions &amp; concepts accurately stated.</div></div>' +
      '<div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"><div class="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO2 Application</div><div class="text-[10px] text-neutral-500">Case facts, products, figures &amp; staff context.</div></div>' +
      '<div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"><div class="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO3 Analysis</div><div class="text-[10px] text-neutral-500">Cause-and-effect chains &amp; financial impacts.</div></div>' +
      '<div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"><div class="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO4 Evaluation</div><div class="text-[10px] text-neutral-500">Justified recommendation &amp; trade-offs weighed.</div></div>' +
    '</div>';

    var words = q.qwen_marking_keys && q.qwen_marking_keys.valid_app_words;
    if (words && words.length) {
      h += '<div class="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">' +
        '<div class="flex items-center justify-between mb-1.5">' +
          '<span class="text-xs font-bold text-neutral-800 dark:text-neutral-200">🎯 Creditable Application Case Facts (AO2 Keywords)</span>' +
          '<span class="text-[10px] text-neutral-500 font-mono">Used by Cambridge Examiners</span>' +
        '</div>' +
        '<p class="text-[11px] text-neutral-600 dark:text-neutral-400 mb-2">To score Level 2 / Level 3, candidates must explicitly reference these specific case metrics or business facts:</p>' +
        '<div class="flex flex-wrap gap-1.5">';
      for (var k = 0; k < words.length; k++) {
        h += '<span class="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">' + esc(words[k]) + '</span>';
      }
      h += '</div></div>';
    }
    return h + '</div>';
  }

  var OVERRIDE_REASONS = ['Valid Alternative', 'Benefit of Doubt', 'Case Context Present', 'Clear Cause & Effect'];

  function renderSelfPanel(q, i) {
    var max = q.mark_value;
    var ev = state.evals[i];
    var sel = state.overrideScore[i];
    if (typeof sel !== 'number') sel = ev ? ev.score : (max === 12 ? 8 : 5);
    sel = clampI(sel, 0, max);
    state.overrideScore[i] = sel;
    var preset = s(state.overridePreset[i] || '');
    var h = '<div class="mt-4 p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 space-y-4">' +
      '<div class="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-800">' +
        '<div class="flex items-center gap-2">' +
          '<span class="p-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs">✏️</span>' +
          '<div>' +
            '<h4 class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">Manual Score Override &amp; Self-Assessment</h4>' +
            '<p class="text-[11px] text-neutral-600 dark:text-neutral-400">If the automated marking was inaccurate, too strict, or missed your context points, select the score you deserve.</p>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer" data-act="close-self" data-q="' + i + '" aria-label="Close">✕</button>' +
      '</div>' +
      '<div>' +
        '<label class="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">Choose Your Overridden Score (0 to ' + esc(max) + ' Marks):</label>' +
        '<div class="grid grid-cols-7 sm:grid-cols-13 gap-1.5">';
    for (var score = 0; score <= max; score++) {
      var isSel = score === sel;
      var isL3 = max === 12 && score >= 9;
      var isL2 = max === 12 && score >= 5 && score <= 8;
      var isL1 = max === 12 && score >= 1 && score <= 4;
      var sbCls = isSel
        ? 'bg-[#0F2042] text-white dark:bg-amber-400 dark:text-black border-[#0F2042] dark:border-amber-400 scale-105 shadow-md'
        : isL3 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
        : isL2 ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:border-blue-400'
        : isL1 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-400'
        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400';
      var mini = max === 12 ? (score >= 9 ? 'L3' : score >= 5 ? 'L2' : score >= 1 ? 'L1' : '0m') : Math.round(score / max * 100) + '%';
      h += '<button type="button" class="py-2 px-1 text-center rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center ' + sbCls +
        '" data-act="set-score" data-q="' + i + '" data-score="' + score + '">' +
        '<span class="text-sm">' + score + '</span><span class="text-[9px] opacity-75 font-sans">' + mini + '</span></button>';
    }
    var pct = Math.round(sel / max * 100);
    var desc = max === 12
      ? (sel >= 9 ? 'Level 3: Comprehensive analysis with fully justified recommendation.'
        : sel >= 5 ? 'Level 2: Good contextual discussion of advantages/disadvantages.'
        : sel >= 1 ? 'Level 1: Outline knowledge with limited or generic business context.'
        : '0 Marks: No valid response.')
      : (sel >= 7 ? 'Maximum Band: Strong knowledge, detailed context and analysis.'
        : sel >= 5 ? 'Strong Band: Good knowledge and contextual application.'
        : sel >= 3 ? 'Moderate Band: Basic knowledge with some application.'
        : 'Basic Band: Points identified.');
    h += '</div></div>' +
      '<div class="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
        '<div>' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-sm font-bold text-neutral-900 dark:text-white">Selected Score: <span class="font-mono text-amber-700 dark:text-amber-400">' + sel + ' / ' + max + ' marks</span></span>' +
            '<span class="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">' + pct + '%</span>' +
          '</div>' +
          '<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">' + esc(desc) + '</p>' +
        '</div>' +
        '<div class="flex items-center gap-2 shrink-0">' +
          '<button type="button" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5" data-act="save-score" data-q="' + i + '">' + ico(ICON.check, 'w-4 h-4') + '<span>Save My Override</span></button>' +
          (ev && typeof ev.originalAiScore === 'number'
            ? '<button type="button" class="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1" data-act="reset-ai" data-q="' + i + '" title="Restore original AI evaluation mark">' + ico(ICON.rotate, 'w-3.5 h-3.5') + '<span>Reset (' + esc(ev.originalAiScore) + 'm)</span></button>'
            : '') +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label class="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Override reason (choose a preset, optional):</label>' +
        '<div class="flex flex-wrap gap-1.5">';
    for (var r = 0; r < OVERRIDE_REASONS.length; r++) {
      var chosen = preset === OVERRIDE_REASONS[r];
      h += '<button type="button" aria-pressed="' + chosen + '" class="px-2 py-1 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer ' +
        (chosen ? 'bg-amber-600 text-white border-amber-600' : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-amber-200 dark:border-amber-800 hover:border-amber-400') +
        '" data-act="override-reason" data-q="' + i + '" data-value="' + esc(OVERRIDE_REASONS[r]) + '">' + esc(OVERRIDE_REASONS[r]) + '</button>';
    }
    h += '</div></div>' +
      '<div>' +
        '<label class="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Self-Assessment Note / Reason for Override (Optional):</label>' +
        '<input type="text" data-note="1" data-q="' + i + '" placeholder="e.g. AI overlooked my application to the 50 cafe branches and 100% recyclable packaging..." value="' + esc(state.reason[i] || '') + '" class="w-full px-3 py-1.5 rounded-lg border border-amber-200 dark:border-neutral-700 bg-white dark:bg-black text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500">' +
      '</div>' +
      (ev && typeof ev.originalAiScore === 'number'
        ? '<p class="text-[11px] text-neutral-500 dark:text-neutral-400">Original AI mark: ' + esc(ev.originalAiScore) + '/' + esc(max) + '. Use “Reset AI” to restore it.</p>'
        : '') +
      (ev ? '<div class="flex items-center gap-2">' +
        '<button type="button" class="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1" data-act="reset-score" data-q="' + i + '">Remove saved mark</button>' +
      '</div>' : '') +
    '</div>';
    return h;
  }

  /* AO2 (zero application) and AO4 (partial/full evaluation) colour semantics. */
  function aoCardClass(a) {
    var name = s(a.name);
    if (name.indexOf('AO2') === 0 && a.score === 0 && a.max > 0)
      return 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900';
    if (name.indexOf('AO4') === 0) {
      if (a.score === 0) return 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900';
      if (a.score < a.max) return 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
      return 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
    }
    return 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800';
  }
  function aoScoreClass(a) {
    var name = s(a.name);
    if (name.indexOf('AO2') === 0 && a.score === 0 && a.max > 0)
      return 'text-rose-600 dark:text-rose-400';
    if (name.indexOf('AO4') === 0) {
      if (a.score === 0) return 'text-rose-600 dark:text-rose-400';
      if (a.score < a.max) return 'text-amber-700 dark:text-amber-400';
      return 'text-emerald-700 dark:text-emerald-400';
    }
    return 'text-[#0F2042] dark:text-[#38BDF8]';
  }

  /* Cambridge 0264 Anti-Halo Paragraph Audit — one card per isolated paragraph. */
  function renderParagraphAudits(ev, is12) {
    var audits = ev.paragraphAudits || [];
    if (!audits.length) return '';
    var h = '<div class="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<h4 class="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 font-mono">Cambridge 0264 Anti-Halo Paragraph Audit</h4>' +
        '<span class="text-[11px] font-mono text-neutral-500">' + (is12 ? 'Qualitative diagnostics only — official mark is the Level score above' : 'Zero carry-over between paragraphs') + '</span>' +
      '</div><div class="space-y-2">';
    for (var n = 0; n < audits.length; n++) {
      var p = audits[n] || {};
      var duplicate = !!p.is_duplicate;
      var zero = !duplicate && (p.subtotal === 0 || p.subtotal === '0');
      var maxSub = p.max_subtotal != null ? p.max_subtotal : 3;
      var full = p.max_subtotal && p.subtotal >= p.max_subtotal;
      var cardCls = (duplicate || zero)
        ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
        : full ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
        : 'bg-[#FAF9F6] dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800';
      h += '<div class="p-3 rounded-lg border space-y-1 text-xs ' + cardCls + '">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<span class="font-mono font-bold text-neutral-900 dark:text-neutral-100">Paragraph ' + esc(p.paragraph_number) + '</span>' +
            '<span class="px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] uppercase">' +
              (p.role === 'conclusion' ? 'Conclusion' : p.role === 'option' ? 'Option' : 'Body Point') +
            '</span>' +
            (duplicate ? '<span class="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/70 text-rose-900 dark:text-rose-200 font-mono text-[10px] font-bold">' +
              (is12 ? 'Repeated Point — No Additional Credit' : 'Duplicate (0 marks)') + '</span>' : '') +
          '</div>';
      if (is12) {
        var tags = twelveMarkParagraphTags(p);
        h += '<div class="flex flex-wrap items-center gap-1.5">';
        for (var t = 0; t < tags.length; t++) {
          h += '<span class="px-2 py-0.5 rounded border text-[10px] font-semibold ' + twelveTagClass(tags[t]) + '">' + esc(tags[t]) + '</span>';
        }
        h += '</div>';
      } else {
        h += '<div class="flex flex-wrap items-center gap-2 font-mono text-[11px]">' +
          (p.role === 'conclusion'
            ? '<span class="text-neutral-700 dark:text-neutral-300">Eval:' + esc(p.eval_score != null ? p.eval_score : 0) + '/' + esc(maxSub) + '</span>'
            : '<span class="text-neutral-700 dark:text-neutral-300">K:' + esc(p.k_score) + ' · App:' + esc(p.app_score) + ' · An:' + esc(p.an_score) + (p.has_detailed_an ? '+' : '') + '</span>') +
          '<span class="px-2 py-0.5 rounded bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black font-bold">' + esc(p.subtotal) + '/' + esc(maxSub) + '</span>' +
        '</div>';
      }
      h += '</div>' +
        (p.isolated_quote ? '<blockquote class="text-[11px] italic text-neutral-600 dark:text-neutral-400 border-l-2 border-neutral-300 dark:border-neutral-700 pl-2.5 line-clamp-3">"' + esc(p.isolated_quote) + '"</blockquote>' : '') +
        '<p class="text-[11px] text-neutral-800 dark:text-neutral-200">' + esc(p.critique) + '</p>' +
      '</div>';
    }
    return h + '</div></div>';
  }

  function renderEval(ev, i) {
    var is12 = (ev.markValue != null ? ev.markValue : ev.max) === 12;
    var max = ev.markValue != null ? ev.markValue : ev.max;
    var bandCls = ev.isManuallyOverridden ? 'bg-amber-500 text-black' : 'bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black';
    var h = '<div class="mt-6 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-5 bg-[#FAF9F6] dark:bg-black/60 space-y-4">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">' +
        '<div class="space-y-1">' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<span class="px-2.5 py-0.5 rounded text-xs font-bold ' + bandCls + '">' + (ev.isManuallyOverridden ? '<span>✏️</span> ' : '') + '<span>' + esc(ev.level || ev.band || '') + '</span></span>' +
            (ev.isManuallyOverridden
              ? '<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">Student Overridden Score</span>'
              : '<span class="text-xs text-neutral-500 font-medium">' + esc(ev.isAiEvaluated ? 'Evaluated with ' + AI_MODEL_LABEL + ' Local AI' : 'Evaluated with Cambridge Senior Examiner') + '</span>') +
            (typeof ev.originalAiScore === 'number' ? '<span class="text-[11px] text-neutral-500 font-mono">(Original AI: ' + esc(ev.originalAiScore) + '/' + esc(max) + ')</span>' : '') +
          '</div>' +
          '<p class="text-xs text-neutral-600 dark:text-neutral-400">' + esc(ev.description || ev.levelDescription || '') + '</p>' +
          (ev.overrideReason || ev.note ? '<div class="text-[11px] text-amber-800 dark:text-amber-300 italic pt-0.5">Override note: "' + esc(ev.overrideReason || ev.note) + '"</div>' : '') +
        '</div>' +
        '<div class="flex items-center gap-3">' +
          '<div class="text-right">' +
            '<div class="text-2xl font-bold font-mono text-[#0F2042] dark:text-[#38BDF8]">' + esc(ev.score) + ' / ' + esc(max) + '</div>' +
            '<div class="text-[11px] text-neutral-500 font-mono font-medium">' + esc(ev.percentage) + '% Mark</div>' +
          '</div>' +
          '<div class="flex flex-col gap-1 shrink-0">' +
            '<button type="button" class="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer flex items-center gap-1" data-act="open-self-force" data-q="' + i + '" title="Override or change this score"><span>✏️ Override</span></button>' +
            (typeof ev.originalAiScore === 'number'
              ? '<button type="button" class="px-2 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1" data-act="reset-ai" data-q="' + i + '" title="Restore AI evaluation mark">' + ico(ICON.rotate, 'w-3 h-3') + '<span>Reset AI</span></button>'
              : '') +
          '</div>' +
        '</div>' +
      '</div>';
    if (!is12) {
      var bd = ev.breakdown || [];
      if (bd.length) {
        h += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">';
        for (var b = 0; b < bd.length; b++) {
          var a = bd[b] || {};
          h += '<div class="p-3 rounded-xl border ' + aoCardClass(a) + '">' +
            '<div class="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">' +
              '<span>' + esc(a.name) + '</span><span class="font-mono ' + aoScoreClass(a) + '">' + esc(a.score) + ' / ' + esc(a.max) + '</span>' +
            '</div>' +
            '<p class="text-xs text-neutral-600 dark:text-neutral-400">' + esc(a.feedback) + '</p>' +
          '</div>';
        }
        h += '</div>';
      }
    } else {
      h += '<p class="text-xs text-neutral-500">Qualitative diagnostics only — the official mark is the Level score above.</p>' + tagRow(ev.tags);
    }
    h += renderParagraphAudits(ev, is12);
    h += '<div class="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">' +
      '<h4 class="text-xs font-bold uppercase tracking-wider text-neutral-500">Senior Examiner Notes &amp; Recommendations</h4>' +
      '<p class="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">' + esc(ev.examinerNotes || ev.notes || '') + '</p>';
    if (ev.improvements && ev.improvements.length) {
      h += '<div class="pt-2 border-t border-neutral-100 dark:border-neutral-800">' +
        '<span class="text-xs font-bold text-amber-700 dark:text-amber-400">Key Next Steps:</span>' +
        '<ul class="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5 mt-1">';
      for (var m = 0; m < ev.improvements.length; m++) h += '<li>' + esc(ev.improvements[m]) + '</li>';
      h += '</ul></div>';
    }
    return h + '</div></div>';
  }

  /* ------------------------------------------------------------------ *
   * Question card                                                        *
   * ------------------------------------------------------------------ */
  function renderQuestion(q, i, first) {
    var sc = scenario();
    var key = keyFor(sc.scenario_id, q.number);
    var draft = getDraft(i);
    var words = countWords(draft);
    var ev = state.evals[i];
    var bm = !!state.bookmarks[key];
    var is12 = q.mark_value === 12;
    var inputId = first ? 'paper-two-response' : 'paper-two-response-' + i;
    var h = '<section class="space-y-4">';
    h += '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5E4] dark:border-neutral-800 pb-3">' +
      '<div class="flex items-center gap-2">' +
        '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black">Question ' + esc(q.number) + '</span>' +
        '<span class="px-2 py-0.5 rounded text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">' + esc(q.mark_value) + ' Marks</span>';
    if (is12) {
      h += '<span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">Level 1–3 Marked</span>';
    }
    h += '<button type="button" class="p-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs cursor-pointer ' + (bm ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700' : 'text-neutral-500') + '" data-act="bookmark-q" data-key="' + esc(key) + '" title="Bookmark this question">' + (bm ? '★' : '☆') + '</button>' +
      renderFlagButton(i) +
      '</div>';
    if (ev) {
      h += '<div class="flex items-center gap-2">' +
        '<span class="px-2.5 py-1 rounded-lg text-xs font-bold ' + (ev.isManuallyOverridden ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300') + ' flex items-center gap-1">' +
          (ev.isManuallyOverridden ? '<span>✏️</span>' : '') +
          '<span>' + (ev.isManuallyOverridden ? 'Self-Assessed: ' : 'Awarded: ') + esc(ev.score) + '/' + esc(ev.markValue || ev.max) + ' marks (' + esc(ev.band || ev.level) + ')</span>' +
        '</span></div>';
    }
    h += '</div>';

    h += '<h2 class="study-prompt">' + esc(q.question_text) + '</h2>';
    h += '<div class="space-y-1.5">' +
      '<div class="study-answer-meta">' +
        '<label for="' + inputId + '">Your response</label>' +
        '<span class="font-mono"><span data-wcount="' + i + '">' + words + '</span> words</span>' +
      '</div>' +
      '<textarea id="' + inputId + '" data-q="' + i + '" rows="7" placeholder="Draft your structured answer here for ' + esc(q.mark_value) + ' marks. Use specific case data and causal connectives..." class="study-response"' + (state.evaluating[i] ? ' disabled' : '') + '>' + esc(draft) + '</textarea>' +
    '</div>';

    h += '<div class="flex flex-wrap items-center justify-between gap-3 pt-2">' +
      '<div class="flex flex-wrap items-center gap-2">' +
        /* Submit for Assessment — always re-evaluates (original behaviour). */
        '<button type="button" class="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm flex items-center gap-2" data-act="submit-assessment" data-q="' + i + '"' + (s(draft).trim() && !state.evaluating[i] ? '' : ' disabled') + '>' +
          (state.evaluating[i]
            ? ico(ICON.sparkles, 'w-4 h-4 animate-spin')
            : ico(ICON.sparkles, 'w-4 h-4')) +
          '<span>' + (state.evaluating[i]
            ? (state.useLocalAI && EC.ai && EC.ai.isReady && EC.ai.isReady() ? 'Assessing with ' + AI_MODEL_LABEL + '…' : 'Assessing with CIE 0264 Examiner…')
            : (ev ? 'Re-evaluate Response' : 'Submit for Assessment')) + '</span>' +
        '</button>' +
        /* ✏️ Self-Assess / Grade — exact original label / variant, aliases open-self. */
        '<button type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ' +
          (state.showSelf[i] ? 'bg-amber-500 text-black border-amber-500 shadow-xs font-bold' : 'border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60') +
          '" data-act="open-self" data-q="' + i + '" title="Override score or self-assess if marking was inaccurate"' + (state.evaluating[i] ? ' disabled' : '') + '>' +
          '<span>✏️</span><span>' + (state.showSelf[i] ? 'Close Override Panel' : ev ? 'Override Score' : 'Self-Assess / Grade') + '</span>' +
        '</button>' +
        '<button type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ' + (state.showMS[i] ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60') + '" data-act="toggle-ms" data-q="' + i + '" title="View exact Cambridge 0264 Paper 2 Mark Scheme Rubric &amp; Level criteria">' +
          ico(ICON.book, 'w-3.5 h-3.5') + '<span>' + (state.showMS[i] ? 'Hide Rubric' : '0264 Mark Scheme Rubric') + '</span>' +
        '</button>' +
        '<button type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5" data-act="toggle-ma" data-q="' + i + '">' +
          ico(ICON.eye, 'w-3.5 h-3.5') + '<span>' + (state.showMA[i] ? 'Hide Model Answer' : 'Reveal Model Answer') + '</span>' +
        '</button>' +
      '</div>';
    if (state.mode === 'step') {
      var qs = questions();
      h += '<div class="flex items-center gap-2">' +
        '<button type="button" class="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1" data-act="prev-q"' + (i === 0 ? ' disabled' : '') + '>' +
          ico(ICON.chevronLeft, 'w-3.5 h-3.5') + '<span>Previous</span>' +
        '</button>' +
        '<button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ' + (ev ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' : 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800') + '" data-act="next-q"' + (i === qs.length - 1 ? ' disabled' : '') + '>' +
          '<span>Next Question</span>' + ico(ICON.chevronRight, 'w-3.5 h-3.5') +
        '</button>' +
      '</div>';
    }
    h += '</div>';

    if (state.showMS[i]) h += renderMarkScheme(q);
    if (state.showMA[i]) {
      h += '<div class="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 space-y-2">' +
        '<div class="flex items-center justify-between">' +
          '<span class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">' +
            ico(ICON.shield, 'w-4 h-4 text-blue-600 dark:text-blue-400') + 'Official Cambridge Mark Scheme Exemplar' +
          '</span>' +
          '<span class="text-[11px] font-mono text-blue-700 dark:text-blue-400">Max: ' + esc(q.mark_value) + ' Marks</span>' +
        '</div>' +
        '<p class="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed font-sans">' + esc(q.model_answer) + '</p>' +
      '</div>';
    }
    h += renderExaminer(i);
    if (state.showSelf[i]) h += renderSelfPanel(q, i);
    if (ev) h += renderEval(ev, i);
    return h + '</section>';
  }

  /* ExamLayoutPicker — restored from ExamLayoutPicker.tsx. */
  function renderLayoutPicker() {
    var l = state.layout === 'columns' ? 'columns' : 'stacked';
    function opt(kind, title, iconPath) {
      var active = l === kind;
      return '<button type="button" aria-pressed="' + active + '" title="' + title + '" aria-label="' + title + '"' +
        ' class="p-1.5 rounded-md cursor-pointer ' + (active ? 'bg-[#0F2042] text-white dark:bg-white dark:text-black' : 'text-[var(--surface-muted)] hover:bg-black/5 dark:hover:bg-white/10') + '"' +
        ' data-act="set-layout" data-layout="' + kind + '">' + ico(iconPath, 'w-3.5 h-3.5') + '</button>';
    }
    return '<div class="flex items-center gap-2">' +
      '<span class="hidden sm:inline text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--surface-muted)]">Layout</span>' +
      '<div role="group" aria-label="Case study layout" class="flex items-center gap-0.5 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-soft)] p-0.5">' +
        opt('stacked', 'Text at top, question below', ICON.rows) +
        opt('columns', 'Text left, question right', ICON.columns) +
      '</div></div>';
  }

  /* Marking engine controls driven by EC.ai (see js/views/ai-marker.js). */
  function renderEngine() {
    var a = aiInfo();
    var localPressed = a.ready && state.useLocalAI ? 'true' : 'false';
    var instantPressed = (!a.ready || !state.useLocalAI) ? 'true' : 'false';
    var h = '<div class="study-paper-two-engine" role="group" aria-label="Marking engine">' +
      '<button type="button" class="study-engine-option" aria-pressed="' + localPressed + '" data-act="enable-local-ai" title="' +
        (a.ready ? esc(AI_MODEL_LABEL + ' ready — local marking active') : 'First use downloads ~650 MB') + '"' +
        (a.loading || a.blocked ? ' disabled' : '') + '>' +
        ico(ICON.cpu, 'w-4 h-4') + '<span>' + esc(a.label) + '</span>' +
        (a.ready ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500" title="' + esc(AI_MODEL_LABEL + ' ready') + '"></span>' : '') +
      '</button>' +
      '<button type="button" class="study-engine-option" aria-pressed="' + instantPressed + '" data-act="instant-examiner" title="Run the 0264 Instant Examiner on the current answer">' +
        '<span>Instant Examiner</span>' +
      '</button>' +
    '</div>';
    if (a.loading) {
      /* Paper2PracticeView.tsx:694-713 (amber) with the sky loading accent
         from PracticeStudio.tsx:1058-1076 when WebGPU is available. */
      var sky = /webgpu/i.test(a.device);
      var wrap = sky
        ? 'p-4 border-x border-sky-200 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/30'
        : 'p-4 border-x border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30';
      var textCls = sky ? 'text-sky-900 dark:text-sky-200' : 'text-amber-800 dark:text-amber-300';
      var barBg = sky ? 'bg-sky-200 dark:bg-sky-900' : 'bg-amber-200 dark:bg-amber-900';
      var barFill = sky ? 'bg-sky-500 dark:bg-sky-400' : 'bg-amber-500 dark:bg-amber-400';
      var footCls = sky ? 'text-sky-800 dark:text-sky-300' : 'text-amber-700 dark:text-amber-400';
      h += '<div class="' + wrap + '" role="status">' +
        '<div class="flex items-center justify-between text-xs font-medium ' + textCls + ' mb-2">' +
          '<span class="flex items-center gap-2">' + ico(ICON.download, 'w-3.5 h-3.5 animate-bounce') +
            'Downloading ' + AI_MODEL_LABEL + ' text-decoder weights into browser cache…</span>' +
          '<span class="font-mono font-bold">' + a.percent + '%</span>' +
        '</div>' +
        '<div class="w-full h-2 ' + barBg + ' rounded-full overflow-hidden">' +
          '<div class="h-full ' + barFill + ' transition-all duration-300" style="width:' + a.percent + '%"></div>' +
        '</div>' +
        '<p class="text-[11px] ' + footCls + ' mt-1.5">Downloading in the background — you can still click Submit anytime to mark immediately with Instant CIE 0264 Examiner!</p>' +
      '</div>';
    }
    if (a.error && !a.loading) {
      h += '<div role="status" class="px-4 py-2.5 border-x border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">' +
        '<span>' + esc(a.status) + ' Instant CIE 0264 Examiner remains active for marking.</span>' +
      '</div>';
    }
    return h;
  }

  /* ------------------------------------------------------------------ *
   * Full view template                                                   *
   * ------------------------------------------------------------------ */
  function renderAll() {
    if (!mainEl || !state.ready) return;
    var sc = scenario();
    if (!sc) { mainEl.innerHTML = '<div class="study-page"><p>No case studies available.</p></div>'; return; }
    var csi = sc.case_study_insert || {};
    var list = navList();
    var navPos = idxOfScenario(list, sc.scenario_id);
    var markedInCase = 0;
    for (var mi = 0; mi < sc.questions.length; mi++) {
      if (state.bookmarks[keyFor(sc.scenario_id, sc.questions[mi].number)]) markedInCase++;
    }

    var h = '';
    h += '<div class="study-page">';
    h += '<header class="study-hero"><div class="study-hero-content">' +
      '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
      '<h1 class="study-title">Paper 2 <span>Case studies</span></h1>' +
      '<p class="study-description">Work through ' + state.data.length + ' case studies with appendices and step-by-step questions.</p>' +
      '</div><div class="study-hero-image" aria-hidden="true"></div></header>';

    /* Navigator */
    h += '<div class="study-studio study-paper-two-toolbar">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
        '<div class="flex items-center gap-2.5 min-w-0">' +
          '<div class="text-xs truncate">' +
            '<span class="font-bold text-[#0F2042] dark:text-white mr-1.5 font-mono">Set ' + (state.index + 1) + '</span>' +
            '<span class="text-neutral-500 dark:text-neutral-400 hidden sm:inline truncate">— ' + esc(s(csi.main_stem).slice(0, 65)) + '...</span>' +
          '</div>' +
        '</div>' +
        '<div class="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">' +
          '<button type="button" class="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95" data-act="prev-case" title="Previous Set (Set 1–100)">← Prev</button>' +
          '<span class="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 text-[#0F2042] dark:text-white min-w-[76px] text-center shadow-2xs">' + (navPos + 1) + ' / ' + list.length + '</span>' +
          '<button type="button" class="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95" data-act="next-case" title="Next Set (Set 1–100)">Next →</button>' +
          '<button type="button" class="px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800/80 bg-purple-50/70 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1" data-act="random-case" title="Jump to a random Case Study Set"><span>🎲 Random</span></button>' +
          '<button type="button" class="p-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-neutral-600 dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer" data-act="open-picker" title="Search and browse all ' + state.data.length + ' sets">' + ico(ICON.search, 'w-4 h-4') + '</button>' +
          renderLayoutPicker() +
          '<span class="text-xs text-neutral-500 dark:text-neutral-400">' + state.submissions.length + ' marks saved · ' + markedInCase + ' bookmarked</span>' +
        '</div>' +
      '</div>' +
    '</div>';

    /* Marking engine — labels, progress and errors follow live EC.ai state. */
    h += '<div data-ai-engine-host>' + renderEngine() + '</div>';

    /* Picker */
    if (state.pickerOpen) {
      h += '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in" data-picker-backdrop="1">' +
        '<div class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" role="dialog" aria-label="Case study sets">' +
          '<div class="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">' +
            '<div>' +
              '<h3 class="font-academic-serif text-xl font-bold text-neutral-900 dark:text-white">Cambridge 0264 Paper 2 Case Studies</h3>' +
              '<p class="text-xs text-neutral-500">Select from ' + state.data.length + ' comprehensive case study sets with full 8-question sequences.</p>' +
            '</div>' +
            '<button type="button" class="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer" data-act="close-picker" aria-label="Close">✕</button>' +
          '</div>' +
          '<div class="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950">' +
            '<div class="relative">' + ico(ICON.search, 'w-4 h-4 absolute left-3 top-3 text-neutral-400') +
              '<input type="text" id="p2-search" value="' + esc(state.search) + '" placeholder="Search case study ID, business type, or scenario keywords..." class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F2042]">' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950">' +
            '<select id="p2-unit" class="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"><option value="">All sections / units</option>';
      var us = units();
      for (var ui = 0; ui < us.length; ui++) {
        h += '<option value="' + esc(us[ui]) + '"' + (us[ui] === state.filterUnit ? ' selected' : '') + '>' + esc(us[ui]) + '</option>';
      }
      h += '</select>' +
        '<label class="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400"><input type="checkbox" id="p2-onlysaved"' + (state.onlySaved ? ' checked' : '') + '> Bookmarked only</label>' +
      '</div>' +
      '<div class="flex flex-wrap items-center gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800">' +
        '<input type="number" id="p2-jump" min="1" max="' + state.data.length + '" placeholder="Jump to set number (1–' + state.data.length + ')" value="' + esc(state.jumpValue) + '" class="flex-1 min-w-[200px] px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">' +
        '<button type="button" class="btn-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer" data-act="jump-go">Jump</button>' +
        '<span class="text-xs text-neutral-500" id="p2-picker-count"></span>' +
      '</div>' +
      '<div class="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3" id="p2-picker-list"></div>' +
      '</div>' +
    '</div>';
    }

    /* Workspace */
    h += '<div class="study-studio study-columns study-paper-two-columns ' + (state.layout === 'stacked' ? 'study-columns-layout-stacked' : 'study-columns-layout-columns') + '">' +
      '<section class="study-paper-two-case" aria-labelledby="paper-two-case-title">' +
        '<div class="study-panel-padding border-b border-line dark:border-neutral-800">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 mb-3">' +
            '<h2 id="paper-two-case-title" class="study-panel-title">Case study insert</h2>' +
            '<a class="study-answer-jump" href="#paper-two-response">Go to your answer ↓</a>' +
            '<button type="button" class="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 underline cursor-pointer" data-act="open-picker">All ' + state.data.length + ' Sets ↗</button>' +
          '</div>' +
          '<div class="grid grid-cols-2 min-[360px]:grid-cols-4 gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-lg">';
    var tabs = [
      ['main', 'Main Stem', 'Main Case Study Scenario'],
      ['app1', 'Appendix 1', 'Appendix 1: Marketing & Operations Data'],
      ['app2', 'Appendix 2', 'Appendix 2: Financial Accounts & Balance Sheet'],
      ['app3', 'Appendix 3', 'Appendix 3: External Environment & Economic Gazette'],
      ['all', 'All sections', 'Show every case-study section together']
    ];
    for (var t = 0; t < tabs.length; t++) {
      var active = state.tab === tabs[t][0];
      h += '<button type="button" aria-pressed="' + active + '" title="' + esc(tabs[t][2]) + '" class="py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ' + (active ? 'bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900') + '" data-act="set-tab" data-tab="' + tabs[t][0] + '">' + tabs[t][1] + '</button>';
    }
    h += '</div></div>' +
      '<div class="study-panel-padding flex-1 overflow-auto space-y-4 text-neutral-800 dark:text-neutral-200">';
    var mainBlock = caseBlock('Primary Business Scenario', 'bg-[#0F2042] dark:bg-[#38BDF8]',
      '<p class="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-line">' + esc(csi.main_stem) + '</p>' +
      '<div class="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">' +
        '<p class="font-bold text-neutral-800 dark:text-neutral-200 mb-1">Examiner Context Reminder:</p>' +
        'Use specific business metrics, product names, monetary sums, and employee details in your answers to score full AO2 Application marks.' +
      '</div>');
    var app1Block = caseBlock('Appendix 1: Marketing &amp; Operations Extract', 'bg-blue-500',
      appendixText(csi.appendix_1_marketing_ops, APP1_BOX));
    var app2Block = caseBlock('Appendix 2: Financial Information &amp; Accounts', 'bg-emerald-500',
      appendix2Content(csi.appendix_2_financial_data));
    var app3Block = caseBlock('Appendix 3: External Environment &amp; Economic Conditions', 'bg-purple-500',
      appendixText(csi.appendix_3_external_environment, APP3_BOX));
    if (state.tab === 'main') h += mainBlock;
    else if (state.tab === 'app1') h += app1Block;
    else if (state.tab === 'app2') h += app2Block;
    else if (state.tab === 'app3') h += app3Block;
    else h += mainBlock + app1Block + app2Block + app3Block;
    h += '</div></section>';

    h += '<div class="study-question-column study-paper-two-editor">' +
      '<section class="study-panel-padding" aria-labelledby="paper-two-questions-title">' +
        '<div class="flex flex-wrap items-center justify-between gap-2 mb-3">' +
          '<h2 id="paper-two-questions-title" class="study-panel-title">Questions</h2>' +
          '<div class="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500">' +
            ico(ICON.clock, 'w-3.5 h-3.5') +
            '<span id="p2-timer-val">' + fmtTime(state.timerSeconds) + '</span>' +
            '<button type="button" class="border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-black rounded-md text-[10px] font-bold px-2 py-0.5 cursor-pointer" data-act="timer-toggle">' + (state.timerRunning ? 'Pause' : 'Start') + '</button>' +
            '<button type="button" class="border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-black rounded-md text-[10px] font-bold px-2 py-0.5 cursor-pointer" data-act="timer-reset">Reset</button>' +
          '</div>' +
        '</div>' +
        '<p class="text-xs text-neutral-600 dark:text-neutral-400 mb-3">Self-assess each answer before moving to the next question.</p>' +
        '<div class="grid grid-cols-2 gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-lg mb-3">' +
          '<button type="button" class="py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ' + (state.mode === 'step' ? 'bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900') + '" data-act="set-mode" data-mode="step">Step by step</button>' +
          '<button type="button" class="py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ' + (state.mode === 'all' ? 'bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900') + '" data-act="set-mode" data-mode="all">All questions</button>' +
        '</div>' +
        '<div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5">';
    var qs = sc.questions || [];
    for (var qi = 0; qi < qs.length; qi++) {
      var q = qs[qi];
      var qkey = keyFor(sc.scenario_id, q.number);
      var qev = state.evals[qi];
      var qSelected = state.mode === 'step' && qi === state.qidx;
      var qCompleted = !!qev;
      var qPartial = qCompleted && qev.score < q.mark_value;
      var qState = qSelected
        ? 'bg-[#0F2042] dark:bg-white text-white dark:text-black border-[#0F2042] dark:border-white shadow-xs'
        : qCompleted
          ? (qev.isManuallyOverridden
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
              : qPartial
                ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800')
          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50';
      h += '<button type="button" aria-pressed="' + qSelected + '" class="py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ' + qState + '" data-act="set-q" data-q="' + qi + '">' +
        '<div class="flex items-center gap-0.5"><span>' + esc(q.number) + '</span>' + (qev && qev.isManuallyOverridden ? '<span class="text-[9px]">✏️</span>' : '') + (state.bookmarks[qkey] ? '<span class="text-[9px]">★</span>' : '') + '</div>' +
        '<span class="text-[10px] opacity-75 font-normal">' + (qev ? esc(qev.score) + '/' + esc(q.mark_value) : esc(q.mark_value) + 'm') + '</span>' +
        '</button>';
    }
    h += '</div></section>' +
      '<div id="p2-answer" class="study-answer space-y-4">';
    if (state.mode === 'all') {
      for (var ai = 0; ai < qs.length; ai++) h += renderQuestion(qs[ai], ai, ai === 0);
    } else {
      h += renderQuestion(qAt(state.qidx), state.qidx, true);
    }
    h += '</div></div>';
    h += '</div></div>';

    /* Local-only "Flag issue" report dialog. */
    h += renderFlagDialog();

    mainEl.innerHTML = h;
    if (state.pickerOpen) refreshPickerList();
    updateTimerDisplay();
  }

  function refreshPickerList() {
    var listEl = mainEl.querySelector('#p2-picker-list');
    if (!listEl) return;
    var list = filtered();
    var max = 60, html = '';
    for (var i = 0; i < Math.min(list.length, max); i++) {
      var sc = list[i];
      var n = idxOfScenario(state.data, sc.scenario_id) + 1;
      var stem = s(sc.case_study_insert && sc.case_study_insert.main_stem).slice(0, 130);
      var currentSc = scenario();
      var isCurrent = !!(currentSc && sc.scenario_id === currentSc.scenario_id);
      var cardCls = isCurrent
        ? 'bg-[#0F2042] text-white border-[#0F2042] shadow-sm'
        : 'bg-white dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400';
      var numCls = isCurrent ? 'text-blue-200' : 'text-[#0F2042] dark:text-[#38BDF8]';
      var snipCls = isCurrent ? 'text-neutral-200' : 'text-neutral-600 dark:text-neutral-400';
      html += '<button type="button" class="p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ' + cardCls + '" data-act="select-case" data-idx="' + idxOfScenario(state.data, sc.scenario_id) + '">' +
        '<div>' +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-[11px] font-mono font-bold ' + numCls + '">Set ' + n + ' (' + n + ' / ' + state.data.length + ') · 8 questions' + (caseHasBookmark(sc) ? ' ★' : '') + '</span>' +
            '<span class="text-[10px] opacity-75 font-mono">8 questions</span>' +
          '</div>' +
          '<p class="text-xs line-clamp-3 leading-relaxed ' + snipCls + '">' + esc(stem) + '...</p>' +
        '</div>' +
      '</button>';
    }
    if (!list.length) html = '<p class="text-xs text-neutral-500">No matching sets.</p>';
    else if (list.length > max) {
      html += '<p class="text-xs text-neutral-500">Showing first ' + max + ' of ' + list.length + ' matching sets. Use “Jump to set number” above for any case.</p>';
    }
    listEl.innerHTML = html;
    var cnt = mainEl.querySelector('#p2-picker-count');
    if (cnt) cnt.textContent = list.length + ' sets';
  }

  /* ------------------------------------------------------------------ *
   * Actions                                                              *
   * ------------------------------------------------------------------ */
  function resetTransientUI() {
    state.showMS = {}; state.showMA = {}; state.showSelf = {};
    state.evaluating = {};
    state.flagOpen = -1;
    state.flagSavedFor = -1;
    restoreFlagScroll();
  }
  function stopTimer() {
    state.timerRunning = false;
    if (timerId) { clearInterval(timerId); timerId = null; }
  }
  function startTimer() {
    state.timerRunning = true;
    if (!timerId) timerId = setInterval(tick, 1000);
  }
  function tick() {
    if (!mainEl || !mainEl.querySelector('#p2-timer-val')) { stopTimer(); return; }
    if (state.timerRunning) { state.timerSeconds++; updateTimerDisplay(); }
  }
  function updateTimerDisplay() {
    var n = mainEl && mainEl.querySelector('#p2-timer-val');
    if (n) n.textContent = fmtTime(state.timerSeconds);
  }
  function selectCase(idx) {
    idx = clampI(idx, 0, state.data.length - 1);
    state.index = idx;
    state.qidx = 0;
    state.tab = 'main';
    resetTransientUI();
    restoreMarksForScenario();
    stopTimer();
    state.timerSeconds = 0;
    state.pickerOpen = false;
    state.search = '';
    savePosition();
    syncUrl();
    renderAll();
  }
  function stepCase(delta) {
    var list = navList();
    var currentSc = scenario();
    if (!list.length || !currentSc) return;
    var pos = idxOfScenario(list, currentSc.scenario_id);
    var next = pos < 0 ? 0 : (pos + delta + list.length) % list.length;
    selectCase(idxOfScenario(state.data, list[next].scenario_id));
  }
  function randomCase() {
    var list = navList();
    var currentSc = scenario();
    if (list.length <= 1 || !currentSc) return;
    var pos = idxOfScenario(list, currentSc.scenario_id);
    var next = Math.floor(Math.random() * list.length);
    if (next === pos) next = (next + 1) % list.length;
    selectCase(idxOfScenario(state.data, list[next].scenario_id));
  }
  function gotoQuestion(i) {
    var qs = questions();
    i = clampI(i, 0, qs.length - 1);
    if (i === state.qidx) return;
    state.qidx = i;
    state.showMS[i] = false; state.showMA[i] = false; state.showSelf[i] = false;
    state.flagOpen = -1;
    state.flagSavedFor = -1;
    restoreFlagScroll();
    if (state.evals[i]) state.overrideScore[i] = state.evals[i].score;
    state.timerSeconds = 0;
    stopTimer();
    savePosition();
    syncUrl();
    renderAll();
  }
  /* Port of handleApplyManualOverride from Paper2PracticeView.tsx. */
  function manualEvalRecord(i, chosen, reasonText) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q) return null;
    var max = q.mark_value;
    var score = clampI(chosen, 0, max);
    var existing = state.evals[i] || state.examiner[i];
    var info = bandInfo(q, score);
    var prev = existing && typeof existing.score === 'number' ? existing.score : null;
    var original = existing && typeof existing.originalAiScore === 'number'
      ? existing.originalAiScore : (prev != null ? prev : undefined);
    var reason = s(reasonText).trim();
    var ao = aoBreakdown(q, score);
    var aoObj = {};
    for (var k = 0; k < ao.length; k++) {
      var keyName = ['ao1', 'ao2', 'ao3', 'ao4'][k];
      aoObj[keyName] = { score: ao[k].score, max: ao[k].max, feedback: ao[k].feedback };
    }
    var notes = '[Student Self-Assessed Override] Awarded ' + score + '/' + max + ' marks (' + info.label + ').';
    if (typeof original === 'number') notes += ' (Original automated AI score: ' + original + '/' + max + ').';
    if (reason) notes += ' Override reason: "' + reason + '".';
    var rec = {
      scenarioId: sc.scenario_id, unit: sc.unit, question: q.number,
      markValue: max, max: max, score: score,
      level: info.label, band: info.label,
      description: info.desc, levelDescription: info.desc,
      percentage: Math.round(score / max * 100),
      breakdown: ao, aoBreakdown: aoObj,
      strengths: existing && existing.strengths && existing.strengths.length
        ? existing.strengths.slice() : ['Self-assessed response aligned with official Cambridge 0264 Paper 2 rubric.'],
      improvements: existing && existing.improvements && existing.improvements.length
        ? existing.improvements.slice() : ['Ensure direct references to case facts and figures under strict exam conditions.'],
      paragraphAudits: existing && Array.isArray(existing.paragraphAudits) ? existing.paragraphAudits.slice() : [],
      notes: notes, examinerNotes: notes,
      tags: info.tags,
      note: reason,
      answer: getDraft(i),
      at: new Date().toISOString(),
      evaluatedAt: new Date().toISOString(),
      selfAssessed: true,
      isManuallyOverridden: true,
      isAiEvaluated: existing ? !!existing.isAiEvaluated : false,
      local: existing ? !!existing.local : false,
      source: existing ? s(existing.source) : '',
      appWordsFound: existing && existing.appWordsFound ? existing.appWordsFound : [],
      ruleEnforcement: existing ? existing.ruleEnforcement : null,
      originalAiScore: original,
      overrideReason: reason
    };
    if (prev != null && score > prev && EC.earnPoints) EC.earnPoints((score - prev) * 5);
    return rec;
  }

  function saveScore(i) {
    var q = qAt(i);
    if (!q) return;
    var preset = s(state.overridePreset[i] || '');
    var note = s(state.reason[i] || '').trim();
    var reason = preset ? (preset + (note ? ': ' + note : '')) : note;
    var rec = manualEvalRecord(i, state.overrideScore[i], reason);
    if (!rec) return;
    persistEval(i, rec);
    state.showSelf[i] = false;
    if (isHighMark(q, rec.score, rec.level)) fireConfetti();
  }

  function resetToAi(i) {
    var ev = state.evals[i];
    if (!ev || typeof ev.originalAiScore !== 'number') return;
    var rec = manualEvalRecord(i, ev.originalAiScore, 'Restored original AI evaluation mark.');
    if (!rec) return;
    persistEval(i, rec);
    state.showSelf[i] = false;
  }

  function removeScore(i) {
    var sc = scenario(), q = qAt(i);
    if (!sc || !q) return;
    var key = keyFor(sc.scenario_id, q.number);
    var subs = [];
    for (var j = 0; j < state.submissions.length; j++) {
      var old = state.submissions[j];
      if (!(old.scenarioId === sc.scenario_id && old.question === q.number)) subs.push(old);
    }
    state.submissions = subs;
    EC.store.set(K_SUBS, subs);
    delete state.evals[i];
    delete state.examiner[i];
    delete state.overrideScore[i];
    delete state.reason[i];
    delete state.overridePreset[i];
    delete state.showSelf[i];
    if (state.coinsAwarded[key]) {
      delete state.coinsAwarded[key];
      EC.store.set(K_COINS, state.coinsAwarded);
    }
  }

  /* ------------------------------------------------------------------ *
   * Event delegation                                                     *
   * ------------------------------------------------------------------ */
  function onClick(e, main) {
    /* Clicking the dimmed backdrop closes the picker. */
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-picker-backdrop')) {
      state.pickerOpen = false; renderAll(); return;
    }
    var n = e.target;
    while (n && n !== main) {
      if (n.getAttribute && n.getAttribute('data-act')) break;
      n = n.parentNode;
    }
    if (!n || n === main) return;
    var act = n.getAttribute('data-act');
    var qi = parseInt(n.getAttribute('data-q'), 10);
    if (isNaN(qi)) qi = state.qidx;

    switch (act) {
      case 'retry-load': if (EC.render) EC.render(); break;
      case 'prev-case': stepCase(-1); break;
      case 'next-case': stepCase(1); break;
      case 'random-case': randomCase(); break;
      case 'open-picker': state.pickerOpen = true; renderAll(); break;
      case 'close-picker': state.pickerOpen = false; renderAll(); break;
      case 'select-case': selectCase(parseInt(n.getAttribute('data-idx'), 10)); break;
      case 'jump-go': {
        var raw = main.querySelector('#p2-jump');
        var num = parseInt(raw ? raw.value : '', 10);
        if (!isNaN(num) && num >= 1 && num <= state.data.length) selectCase(num - 1);
        break;
      }
      case 'set-tab': state.tab = n.getAttribute('data-tab'); renderAll(); break;
      case 'set-mode': state.mode = n.getAttribute('data-mode'); renderAll(); break;
      case 'set-layout': {
        var layout = n.getAttribute('data-layout') === 'columns' ? 'columns' : 'stacked';
        state.layout = layout;
        EC.store.set(K_LAYOUT, layout);
        renderAll(); break;
      }
      case 'set-q': gotoQuestion(qi); break;
      case 'prev-q': gotoQuestion(state.qidx - 1); break;
      case 'next-q': gotoQuestion(state.qidx + 1); break;
      case 'toggle-ms': state.showMS[qi] = !state.showMS[qi]; renderAll(); break;
      case 'toggle-ma': state.showMA[qi] = !state.showMA[qi]; renderAll(); break;
      case 'open-self':
        /* "Close Override Panel" must actually close the panel. */
        if (!s(getDraft(qi)).trim()) return;
        if (state.showSelf[qi]) { state.showSelf[qi] = false; renderAll(); break; }
        state.showSelf[qi] = true;
        if (typeof state.overrideScore[qi] !== 'number') {
          state.overrideScore[qi] = state.evals[qi] ? state.evals[qi].score : (qAt(qi).mark_value === 12 ? 8 : 5);
        }
        renderAll(); break;
      case 'open-self-force':
        if (!s(getDraft(qi)).trim()) return;
        state.showSelf[qi] = true;
        state.overrideScore[qi] = state.evals[qi] ? state.evals[qi].score : state.overrideScore[qi];
        if (typeof state.overrideScore[qi] !== 'number') {
          state.overrideScore[qi] = qAt(qi).mark_value === 12 ? 8 : 5;
        }
        renderAll(); break;
      case 'close-self': state.showSelf[qi] = false; renderAll(); break;
      case 'set-score': state.overrideScore[qi] = parseInt(n.getAttribute('data-score'), 10); renderAll(); break;
      case 'override-reason':
        state.overridePreset[qi] = s(n.getAttribute('data-value'));
        renderAll(); break;
      case 'save-score': saveScore(qi); renderAll(); break;
      case 'reset-ai': resetToAi(qi); renderAll(); break;
      case 'reset-score': removeScore(qi); renderAll(); break;
      case 'enable-local-ai': enableLocalAI(qi); break;
      case 'instant-examiner': runInstantExaminer(qi); break;
      case 'submit-assessment': submitForAssessment(qi); break;
      case 'close-examiner': delete state.examiner[qi]; renderAll(); break;
      case 'open-ai-marker': if (EC.navigate) EC.navigate('ai-marker'); break;
      case 'open-flag': openFlagDialog(qi); break;
      case 'close-flag': closeFlagDialog(); break;
      case 'flag-reason': state.flagReason = s(n.getAttribute('data-value')); renderAll(); break;
      case 'flag-confidence': state.flagConfidence = s(n.getAttribute('data-value')); renderAll(); break;
      case 'save-flag': saveFlag(qi); break;
      case 'bookmark-q': {
        var key = n.getAttribute('data-key');
        if (state.bookmarks[key]) delete state.bookmarks[key]; else state.bookmarks[key] = true;
        EC.store.set(K_MARKS, state.bookmarks);
        renderAll(); break;
      }
      case 'timer-toggle':
        if (state.timerRunning) stopTimer(); else startTimer();
        renderAll(); break;
      case 'timer-reset': stopTimer(); state.timerSeconds = 0; updateTimerDisplay(); renderAll(); break;
      default: break;
    }
  }
  function onInput(e, main) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    if (t.getAttribute('data-flag-note')) {
      state.flagNote = t.value;
      var fc = main.querySelector('#flag-note-count');
      if (fc) fc.textContent = s(t.value).length + '/240';
    } else if (t.tagName === 'TEXTAREA') {
      var i = parseInt(t.getAttribute('data-q'), 10);
      if (isNaN(i)) return;
      setDraft(i, t.value);
      /* The submit button is rendered disabled when the saved draft is empty.
         Re-rendering here would tear down the textarea and lose focus, so keep
         its disabled state in sync directly as the student types. Without this,
         in "Step by step" mode the button stays disabled until some other
         action happens to trigger a re-render. */
      var submitBtn = main.querySelector('[data-act="submit-assessment"][data-q="' + i + '"]');
      if (submitBtn) submitBtn.disabled = !s(t.value).trim() || !!state.evaluating[i];
      var w = main.querySelector('[data-wcount="' + i + '"]');
      if (w) w.textContent = countWords(t.value);
      if (!state.timerRunning && s(t.value).trim()) startTimer();
    } else if (t.getAttribute('id') === 'p2-search') {
      state.search = t.value;
      refreshPickerList();
    } else if (t.getAttribute('id') === 'p2-jump') {
      state.jumpValue = t.value;
    } else if (t.getAttribute('data-note')) {
      state.reason[parseInt(t.getAttribute('data-q'), 10)] = t.value;
    }
  }
  function onChange(e, main) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var id = t.getAttribute('id');
    if (id === 'p2-unit') { state.filterUnit = t.value; refreshPickerList(); renderAll(); }
    else if (id === 'p2-onlysaved') { state.onlySaved = !!t.checked; refreshPickerList(); }
  }
  function bind(main) {
    if (main.__p2Click) main.removeEventListener('click', main.__p2Click);
    if (main.__p2Input) main.removeEventListener('input', main.__p2Input);
    if (main.__p2Change) main.removeEventListener('change', main.__p2Change);
    main.__p2Click = function (e) { onClick(e, main); };
    main.__p2Input = function (e) { onInput(e, main); };
    main.__p2Change = function (e) { onChange(e, main); };
    main.addEventListener('click', main.__p2Click);
    main.addEventListener('input', main.__p2Input);
    main.addEventListener('change', main.__p2Change);

    /* Escape closes the local flag dialog (and the set picker). */
    if (docKeyHandler && document.removeEventListener) document.removeEventListener('keydown', docKeyHandler);
    docKeyHandler = function (e) {
      if (!e || (e.key !== 'Escape' && e.keyCode !== 27)) return;
      if (state.flagOpen >= 0) { e.preventDefault(); closeFlagDialog(); }
      else if (state.pickerOpen) { state.pickerOpen = false; renderAll(); }
    };
    if (document.addEventListener) document.addEventListener('keydown', docKeyHandler);

    /* Keep the engine controls in sync with background model downloads.
       Update only the engine host so an in-progress answer keeps focus. */
    if (typeof aiUnsubscribe === 'function') { aiUnsubscribe(); aiUnsubscribe = null; }
    if (EC.ai && typeof EC.ai.onChange === 'function') {
      aiUnsubscribe = EC.ai.onChange(function () {
        if (!state.ready) return;
        var host = main.querySelector('[data-ai-engine-host]');
        if (host) host.innerHTML = renderEngine();
        else renderAll();
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Registration                                                        *
   * ------------------------------------------------------------------ */
  var loadWatchdog = null;

  function initFromData(main, params, data) {
    state.data = Array.isArray(data) ? data : [];
    if (!state.data.length) {
      main.innerHTML = '<div class="study-page"><h1>Paper 2</h1><p>No case studies available.</p></div>';
      return;
    }
    state.drafts = EC.store.get(K_DRAFTS, {}) || {};
    state.bookmarks = EC.store.get(K_MARKS, {}) || {};
    state.submissions = EC.store.get(K_SUBS, []) || [];
    if (!Array.isArray(state.submissions)) state.submissions = [];
    state.coinsAwarded = EC.store.get(K_COINS, {}) || {};
    var savedDone = EC.store.get(K_COMPLETED, []);
    state.completedIds = Array.isArray(savedDone) ? savedDone : [];
    state.layout = loadLayout();
    loadFlags();
    var pos = EC.store.get(K_POS, null);
    if (pos && typeof pos.index === 'number') state.index = clampI(pos.index, 0, state.data.length - 1);
    if (pos && typeof pos.qidx === 'number') state.qidx = clampI(pos.qidx, 0, 7);

    if (params) {
      var c = parseInt(params.get('case'), 10);
      if (!isNaN(c) && c >= 1 && c <= state.data.length) state.index = c - 1;
      var q = parseInt(params.get('q'), 10);
      if (!isNaN(q) && q >= 1) state.qidx = q - 1;
      var u = params.get('unit');
      if (u) state.filterUnit = u;
      var se = params.get('search');
      if (se) state.search = se;
    }
    resetTransientUI();
    restoreMarksForScenario();
    state.qidx = clampI(state.qidx, 0, Math.max(0, questions().length - 1));
    state.timerSeconds = 0;
    state.timerRunning = false;
    state.ready = true;
    renderAll();
  }

  function showLoading(main) {
    main.innerHTML = '<style>@keyframes p2-spin{to{transform:rotate(360deg)}}</style>' +
      '<div class="study-page" role="status" aria-live="polite">' +
      '<header class="study-hero"><div class="study-hero-content">' +
      '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
      '<h1 class="study-title">Paper 2 <span>Case studies</span></h1>' +
      '<p class="study-description">Loading the 3,000 case studies and appendices…</p>' +
      '</div></div>' +
      '<div class="study-panel" style="display:flex;align-items:center;gap:.75rem;padding:1.25rem">' +
      '<span aria-hidden="true" style="width:1.5rem;height:1.5rem;border:2px solid currentColor;border-top-color:transparent;border-radius:9999px;display:inline-block;animation:p2-spin .8s linear infinite"></span>' +
      '<span>Preparing your case-study workspace…</span>' +
      '</div></div>';
  }

  function showLoadError(main, err) {
    main.innerHTML = '<div class="study-page"><header class="study-hero"><div class="study-hero-content">' +
      '<p class="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>' +
      '<h1 class="study-title">Paper 2 <span>Case studies</span></h1></div></div>' +
      '<div class="study-studio" role="status"><p class="text-sm text-neutral-700 dark:text-neutral-300">Paper 2 case data could not be loaded in this browser.</p>' +
      '<button type="button" class="btn-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer" data-act="retry-load">Retry loading case studies</button>' +
      (err ? '<p class="text-[11px] text-neutral-500">' + esc(s(err && err.message ? err.message : err)) + '</p>' : '') +
      '</div></div>';
  }

  EC.register('paper2', {
    title: 'Paper 2 Case Studies',
    render: function (main, params) {
      mainEl = main;
      if (timerId) { clearInterval(timerId); timerId = null; }
      bind(main);
      showLoading(main);

      var finished = false, resolveDone = null;
      var donePromise = (typeof Promise === 'function')
        ? new Promise(function (resolve) { resolveDone = resolve; }) : null;
      function finish() { if (resolveDone) { resolveDone(); resolveDone = null; } }
      function clearWatchdog() {
        if (loadWatchdog) { clearTimeout(loadWatchdog); loadWatchdog = null; }
      }
      function complete(data, isFallback) {
        if (finished) return;
        if (!Array.isArray(data) || !data.length) {
          if (!isFallback) { freshFetch(); return; }
          showLoadError(main, null); finish(); return;
        }
        finished = true;
        clearWatchdog();
        initFromData(main, params, data);
        finish();
      }
      /* Bypass core.js's module-level EC.load cache: a fetch that stalled during
       * an earlier render (or a rejected cached promise) must not leave this
       * view showing "Loading…" forever. */
      function freshFetch() {
        try {
          if (typeof fetch !== 'function') { showLoadError(main, null); finish(); return; }
          fetch('./data/paper2.json').then(function (r) {
            if (!r.ok) throw new Error('Cannot load paper2.json (' + r.status + ')');
            return r.json();
          }).then(function (data) { complete(data, true); }, function (err) {
            showLoadError(main, err); finish();
          });
        } catch (err) { showLoadError(main, err); finish(); }
      }

      clearWatchdog();
      loadWatchdog = setTimeout(function () { if (!finished) freshFetch(); }, 3000);
      EC.load('paper2').then(function (data) { complete(data, false); }, function () { freshFetch(); });
      return donePromise;
    }
  });
})();
