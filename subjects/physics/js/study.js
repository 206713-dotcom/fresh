/* Twistor — learning science, applied.
   WL.study: confidence calibration, exam date (sets the review gaps), and the #science page that explains
   what the research says, what Twistor does about it, and where the evidence is weaker than the slogan. */
(function () {
  const WL = (window.WL = window.WL || {});
  const uk = (b) => { const A = WL.auth; return b + (A && A.username && !A.isOwner ? ':' + A.username : ''); };
  const get = (k, d) => { try { const v = localStorage.getItem(uk(k)); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(uk(k), JSON.stringify(v)); } catch (e) {} };
  const DAY = 864e5;

  const study = {
    /* confidence before checking: 1 guess, 2 fairly sure, 3 certain */
    calib(c, ok, id) { const L = get('wl-calib', []); L.push({ c, ok: ok ? 1 : 0, id, at: Date.now() }); put('wl-calib', L.slice(-600)); },
    calibStats() { const L = get('wl-calib', []), s = { 1: { n: 0, r: 0 }, 2: { n: 0, r: 0 }, 3: { n: 0, r: 0 } }; L.forEach((x) => { if (s[x.c]) { s[x.c].n++; s[x.c].r += x.ok; } }); return s; },
    examDate() { const d = get('wl-exam', null); return d && d > Date.now() ? d : 0; },
    setExamDate(str) { if (!str) { put('wl-exam', null); return; } const t = new Date(str + 'T09:00:00').getTime(); put('wl-exam', isFinite(t) ? t : null); },
    /* the gap before the next review: the usual expanding gaps, but never more than ~15 % of the time left
       before an exam (the optimal gap is roughly 10–20 % of the retention interval: Cepeda et al. 2008) */
    gap(days) { const e = study.examDate(); if (!e) return days; const left = (e - Date.now()) / DAY; return Math.max(1, Math.min(days, Math.round(left * 0.15))); },
    confNote(c, ok) {
      if (c === 3 && !ok) return 'You were certain, and it was wrong. These are the errors most worth catching: once you see the correction they tend to stick, and this topic comes back for review tomorrow.';
      if (c === 1 && ok) return 'Right, but you were guessing. It comes back soon, so the answer becomes something you know rather than something you hoped.';
      return '';
    }
  };
  WL.study = study;

  /* ---------- #science ---------- */
  const P = [
    { t: 'Test yourself instead of rereading', k: 'Retrieval practice',
      found: 'Pulling an answer out of memory strengthens it more than reading it again. A meta-analysis of 188 articles and 272 effect sizes found practice tests beat restudying and every other comparison condition, in laboratories and in classrooms, with the largest effects when the final test came one to six days later.',
      here: ['Every topic ends in practice, not in a summary.', 'Notes finish with “close the notes and recall”: you write what you remember, then tick it off against the key points.', 'The Review tab is nothing but retrieval.'],
      cav: 'Most studies tested recall of facts and texts; the gain for multi-step problem solving is real but less well measured.', ref: [0, 9] },
    { t: 'Space it out', k: 'Distributed practice',
      found: 'The same study time spread over several sessions beats one long session. The best gap grows with how long you need to remember: in a study of more than 1,350 people it was about 20–40 % of a one-week retention interval but only 5–10 % of a one-year interval.',
      here: ['Topics you mark understood come back after 1, 3, 7, 16, 35 and 80 days; a miss sends a topic back to day one.', 'Set your exam date below and the gaps shrink to about 15 % of the time left, so nothing is scheduled after the exam.'],
      cav: 'The 10–20 % rule comes mainly from memory for facts; nobody knows the optimal schedule for physics problem solving precisely.', ref: [1, 2] },
    { t: 'Mix the topics', k: 'Interleaving',
      found: 'Practising several kinds of problem in a mixed order, rather than in blocks, improves learning: a meta-analysis found a moderate overall effect (Hedges’ g = 0.42) and a smaller one for mathematical tasks (g = 0.34). It works best when the categories look alike, which is exactly the situation in physics problems.',
      here: ['Review rounds mix topics and never put two problems from the same strand next to each other.'],
      cav: 'The effect varies a lot between studies, and for some materials it disappears. Mixing feels harder and less productive than blocking: that feeling is misleading, but it is real.', ref: [3, 8] },
    { t: 'Guess before you learn', k: 'Pretesting',
      found: 'Answering a question before studying the material, even wrongly, improves memory for that material afterwards. A preregistered meta-analysis found a moderate effect for the questioned content (g = 0.54) but almost no benefit for content that was not asked about.',
      here: ['A topic you have not studied opens with one question to guess. The lesson then answers it.'],
      cav: 'The benefit is specific: a guess helps you learn the answer to that question, not the whole topic.', ref: [5, 6] },
    { t: 'Explain each step to yourself', k: 'Self-explanation',
      found: 'Prompting learners to explain why each step follows produced a medium effect across 69 effect sizes (g = 0.55).',
      here: ['Every line of every derivation has a “Why?” that stays closed until you have tried to explain it yourself.'].concat(WL.tutor ? ['Einstein will explain any step in your own language, after you have had a go.'] : []),
      cav: 'Explanations you generate can be wrong; check them against the Why? and the derivation.', ref: [4] },
    { t: 'Know what you know', k: 'Calibration',
      found: 'Learners are often confident when wrong, and judge rereading and blocked practice as more effective than they are. Errors made with high confidence are corrected especially well once feedback arrives.',
      here: ['Before checking an answer you can say how sure you are. Your calibration is shown below, and a confident error brings that topic back for review the next day.'],
      cav: 'Rating confidence takes a second each time; it pays only if you look at your calibration and act on it.', ref: [7, 8] },
    { t: 'Practise the way you will be tested', k: 'Exam-style practice',
      found: 'Memory works best when practice resembles the final test (transfer-appropriate processing). For exams, that means multi-step questions, mark schemes and a clock.',
      here: ['Practice is split into core questions, which check one idea at a time, and exam-style questions with marks' + (WL.ai ? ', a mark scheme, a timer, and marking by Einstein.' : ', a mark scheme and a timer.')].concat(WL.ai ? ['Einstein can write a fresh exam-style question on any topic.'] : []),
      cav: WL.ai ? 'Exam-style questions here are built from each topic’s multi-step problems, or written by an AI; they are not past papers and should be checked like any AI output.' : 'Exam-style questions here are built from each topic’s multi-step problems; they are not past papers.', ref: [10] },
    { t: 'Worked examples first, then fade them', k: 'Worked examples',
      found: 'Beginners learn faster from studying worked examples than from solving problems unaided; as expertise grows the advantage reverses, so support should fade.',
      here: ['Hints reveal a solution one step at a time, so you take only as much help as you need.', 'Notes contain worked examples; practice withdraws them.'],
      cav: 'For experienced students, worked examples can slow them down (the expertise reversal effect).', ref: [11, 12] }
  ];
  const REFS = [
    'Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. <i>Review of Educational Research</i>, 87(3), 659–701.',
    'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. <i>Psychological Bulletin</i>, 132(3), 354–380.',
    'Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. <i>Psychological Science</i>, 19(11), 1095–1102.',
    'Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. <i>Psychological Bulletin</i>, 145(11), 1029–1052.',
    'Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. <i>Educational Psychology Review</i>, 30, 703–725.',
    'St. Hilaire, K. J., Chan, J. C. K., & Ahn, D. (2024). Guessing as a learning intervention: A meta-analytic review of the prequestion effect. <i>Psychonomic Bulletin &amp; Review</i>, 31, 411–441.',
    'Pan, S. C., & Carpenter, S. K. (2023). Prequestioning and pretesting effects: A review of empirical research, theoretical perspectives, and implications for educational practice. <i>Educational Psychology Review</i>, 35, 97.',
    'Butterfield, B., & Metcalfe, J. (2001). Errors committed with high confidence are hypercorrected. <i>Journal of Experimental Psychology: Learning, Memory, and Cognition</i>, 27(6), 1491–1494.',
    'Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the “enemy of induction”? <i>Psychological Science</i>, 19(6), 585–592.',
    'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. <i>Psychological Science in the Public Interest</i>, 14(1), 4–58.',
    'Morris, C. D., Bransford, J. D., & Franks, J. J. (1977). Levels of processing versus transfer appropriate processing. <i>Journal of Verbal Learning and Verbal Behavior</i>, 16(5), 519–533.',
    'Renkl, A., & Atkinson, R. K. (2003). Structuring the transition from example study to problem solving in cognitive skill acquisition. <i>Educational Psychologist</i>, 38(1), 15–22.',
    'Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. <i>Educational Psychologist</i>, 38(1), 23–31.'
  ];
  function render(view) {
    const h = WL.app.h; document.title = 'How Twistor teaches · Twistor';
    const cs = study.calibStats(), ed = study.examDate(), edStr = ed ? new Date(ed).toISOString().slice(0, 10) : '';
    const pct = (x) => (x.n ? Math.round((100 * x.r) / x.n) + ' %' : '–');
    const L = h.LS(), inRot = Object.keys(L.u || {}).filter((id) => h.nodes[id]).length, due = Object.keys(L.r || {}).filter((id) => L.u[id] && L.r[id].due <= Date.now()).length;
    view.innerHTML = `<section class="sci-hero">
        <p class="sci-k">How Twistor teaches</p>
        <h1>We are different.<br>We are maximising your potential.</h1>
        <p class="sci-lede">Not with a slogan: with study methods that controlled experiments keep finding work, built into every page. Here is what the research says, what we do about it, and where the evidence is weaker than it sounds.</p>
      </section>
      <section class="block sci-you" aria-labelledby="you-h"><h2 id="you-h">Your study, right now</h2>
        <div class="sci-cards">
          <div><small>Topics in your review rotation</small><b>${inRot}</b><span>${due ? `${due} due now · <a href="#review">review</a>` : 'none due'}</span></div>
          <div><small>When you said “certain”</small><b>${pct(cs[3])}</b><span>right, from ${cs[3].n} answers</span></div>
          <div><small>When you said “fairly sure”</small><b>${pct(cs[2])}</b><span>right, from ${cs[2].n} answers</span></div>
          <div><small>When you were guessing</small><b>${pct(cs[1])}</b><span>right, from ${cs[1].n} answers</span></div>
        </div>
        <p class="sci-cal">${cs[3].n >= 5 ? (cs[3].r / cs[3].n < 0.8 ? 'You are often wrong when certain: slow down on questions that feel obvious, and check units and limits before answering.' : 'Your “certain” answers are reliable. Spend more time on the ones you rate “fairly sure”.') : 'Rate your confidence before checking a few answers and your calibration will appear here.'}</p>
        <form class="sci-exam" id="sci-exam"><label>Exam date <input type="date" id="sci-ed" value="${edStr}"></label><button class="btn small primary">Save</button>${ed ? '<button type="button" class="btn small ghost" data-noexam>Clear</button>' : ''}
          <span class="muted">${ed ? `Review gaps are capped at about ${Math.max(1, Math.round(((ed - Date.now()) / DAY) * 0.15))} days until then.` : 'With a date, review gaps shrink so every topic comes back before the exam.'}</span></form>
      </section>
      <section class="block"><div class="section-h"><h2>Eight methods, and what we built for each</h2></div>
        <ol class="sci-list">${P.map((p, i) => `<li><div class="sci-h"><span class="sci-n">${i + 1}</span><div><p class="sci-tag">${p.k}</p><h3>${p.t}</h3></div></div>
          <div class="sci-grid"><div><h4>What the research found</h4><p>${p.found} <sup>${p.ref.map((r) => `<a href="#ref-${r + 1}">${r + 1}</a>`).join(',')}</sup></p></div>
          <div><h4>What Twistor does</h4><ul>${p.here.map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div class="sci-cav"><h4>The honest caveat</h4><p>${p.cav}</p></div></div></li>`).join('')}</ol>
      </section>
      <section class="block sci-limits"><h2>What no website can promise</h2>
        <p>Effect sizes are averages over many students and many studies, and they vary widely: a method that helps most people may do little for you. Most of the evidence comes from memory for facts and short texts; physics problem solving has been studied less. And every method here works only if you do the work: the site can schedule a review, but it cannot do it for you.</p>
        <p>The methods that study after study rates low are rereading, highlighting and summarising. They feel productive because the material looks familiar, which is precisely why they mislead.<sup><a href="#ref-10">10</a></sup></p>
      </section>
      <section class="block sci-refs"><h2>References</h2><ol>${REFS.map((r, i) => `<li id="ref-${i + 1}">${r}</li>`).join('')}</ol></section>`;
    view.querySelector('#sci-exam').onsubmit = (e) => { e.preventDefault(); study.setExamDate(view.querySelector('#sci-ed').value); render(view); };
    view.onclick = (e) => { if (e.target.closest('[data-noexam]')) { study.setExamDate(''); render(view); } };
  }
  WL.pages = WL.pages || {};
  WL.pages.science = { match: (h) => h === 'science', nav: '', render: (h, view) => render(view) };
})();
