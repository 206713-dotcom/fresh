/* Geodesic — your activity, part 2 (loaded on demand): the #activity page. For this week, month or year (and the ones
   before), it shows how long the site was in active use and where, what was achieved (topics learned, answers checked
   and how many were right, tests, mock papers, olympiad and competition problems, lectures, Feynman chapters,
   practicals, investigations), all-time records, and a brief AI summary of the period. The summary is sent only these
   numbers and topic names, never the account's name or anything else about it. Everything stays in this browser.
   The tracker that collects the usage is src/v6/act-track.js (WL.act). */
(function () {
  const WL = (window.WL = window.WL || {});
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const X = () => WL.act, N = () => (WL.app && WL.app.nodes) || {};
  const DAY = 864e5, MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayT = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  const hm = (s) => { const m = Math.round(s / 60); if (m < 1) return s > 0 ? 'under a minute' : '0 min'; const h = Math.floor(m / 60); return h ? `${h} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}` : `${m} min`; };
  const pct = (x) => Math.round(x * 100) + '%';
  const words = (t) => (String(t || '').trim().match(/\S+/g) || []).length;
  const typeset = (el) => { if (el && WL.lab && WL.lab.typeset) WL.lab.typeset(el); };
  const md = (t) => (WL.tutor && WL.tutor.md ? WL.tutor.md(t) : '<p>' + esc(t).replace(/\n/g, '<br>') + '</p>');

  /* ---------- periods ---------- */
  const KIND = { week: 'week', month: 'month', year: 'year' };
  function period(kind, off) {
    const now = new Date(), P = { kind, off };
    if (kind === 'week') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 7 * off);
      P.start = d.getTime(); const e = new Date(d); e.setDate(e.getDate() + 7); P.end = e.getTime();
      const l = new Date(P.end - DAY), a = d.getDate(), b = l.getDate();
      P.label = d.getMonth() === l.getMonth() ? `${a}–${b} ${MONTH[l.getMonth()]} ${l.getFullYear()}` : `${a} ${MON[d.getMonth()]}${d.getFullYear() !== l.getFullYear() ? ' ' + d.getFullYear() : ''} – ${b} ${MON[l.getMonth()]} ${l.getFullYear()}`;
      P.key = 'W:' + X().day(P.start);
      P.buckets = Array.from({ length: 7 }, (_, i) => { const t = new Date(d); t.setDate(t.getDate() + i); return { a: t.getTime(), b: t.getTime() + DAY, l: WD[i], full: `${WD[i]} ${t.getDate()} ${MON[t.getMonth()]}` }; });
    } else if (kind === 'month') {
      const d = new Date(now.getFullYear(), now.getMonth() + off, 1), e = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      P.start = d.getTime(); P.end = e.getTime(); P.label = `${MONTH[d.getMonth()]} ${d.getFullYear()}`; P.key = `M:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const n = Math.round((P.end - P.start) / DAY);
      P.buckets = Array.from({ length: n }, (_, i) => { const t = new Date(d.getFullYear(), d.getMonth(), i + 1); return { a: t.getTime(), b: new Date(d.getFullYear(), d.getMonth(), i + 2).getTime(), l: String(i + 1), full: `${WD[(t.getDay() + 6) % 7]} ${i + 1} ${MON[t.getMonth()]}` }; });
    } else {
      const y = now.getFullYear() + off; P.start = new Date(y, 0, 1).getTime(); P.end = new Date(y + 1, 0, 1).getTime(); P.label = String(y); P.key = 'Y:' + y;
      P.buckets = MON.map((m, i) => ({ a: new Date(y, i, 1).getTime(), b: new Date(y, i + 1, 1).getTime(), l: m, full: `${MONTH[i]} ${y}` }));
    }
    const t = Date.now(); P.past = P.end <= t; P.current = P.start <= t && t < P.end;
    P.days = Math.round((P.end - P.start) / DAY); P.elapsed = P.current ? Math.floor((t - P.start) / DAY) + 1 : P.past ? P.days : 0;
    P.word = kind === 'week' ? 'week' : kind === 'month' ? 'month' : 'year';
    return P;
  }

  /* ---------- what happened in a period ---------- */
  function usage(P) {
    const s = X().st(), U = { t: 0, n: 0, ai: 0, a: {}, ais: {}, tp: {}, m: {}, days: new Set(), per: P.buckets.map(() => 0) };
    Object.entries(s.d).forEach(([k, D]) => {
      const tk = dayT(k); if (tk < P.start || tk >= P.end) return;
      U.t += D.t || 0; U.n += D.n || 0;
      Object.entries(D.a || {}).forEach(([a, v]) => { U.a[a] = (U.a[a] || 0) + v; });
      Object.entries(D.ai || {}).forEach(([a, v]) => { U.ais[a] = (U.ais[a] || 0) + v; U.ai += v; });
      Object.entries(D.tp || {}).forEach(([id, v]) => { U.tp[id] = (U.tp[id] || 0) + v; });
      Object.entries(D.m || {}).forEach(([m, v]) => { U.m[m] = (U.m[m] || 0) + v; });
      if ((D.t || 0) >= 60 || (D.n || 0) > 0) U.days.add(k);
      const i = P.buckets.findIndex((b) => tk >= b.a && tk < b.b); if (i >= 0) U.per[i] += D.t || 0;
    });
    const L = X().read(X().ukey('wl-learn'), {}) || {};
    (L.days || []).forEach((k) => { const tk = dayT(k); if (tk >= P.start && tk < P.end) U.days.add(k); });
    return U;
  }
  function stores() {
    const R = X().read, K = X().ukey;
    return { L: R(K('wl-learn'), {}) || {}, T: R(K('wl-tests'), {}) || {}, C: R(K('wl-comp'), {}) || {}, lab: R(K('wl-lab'), {}) || {}, adv: R(K('wl-adv'), {}) || {} };
  }
  function achieved(P, U, S) {
    const inP = (t) => t >= P.start && t < P.end, n = N();
    const learned = Object.entries(S.L.u || {}).filter(([, t]) => inP(t)).sort((a, b) => a[1] - b[1]).map(([id]) => id);
    let q = 0, right = 0, exam = 0;
    Object.values(S.L.a || {}).forEach((A) => Object.entries(A || {}).forEach(([k, r]) => {
      if (!r || !inP(r.at || 0) || k === 'pre' || k === 'endless') return;
      if (r.v) { q++; right += r.v === 'correct' ? 1 : r.v === 'partial' ? 0.5 : 0; } else if (r.ticks) exam++;
    }));
    const tests = (S.T.hist || []).filter((h) => inP(h.made || 0));
    const mocks = Object.values(S.C.hist || {}).flat().filter((h) => h && inP(h.at || 0));
    const inv = Object.values(S.lab.P || {}).filter((p) => p && p.kind === 'inv');
    return {
      learned, phys: learned.filter((id) => (n[id] || {}).track !== 'maths').length, maths: learned.filter((id) => (n[id] || {}).track === 'maths').length,
      q, acc: q ? right / q : null, exam,
      tests: tests.length, testAvg: tests.length ? tests.reduce((s, h) => s + (h.pct || 0), 0) / tests.length : null, testBest: tests.length ? Math.max(...tests.map((h) => h.pct || 0)) : null,
      mocks: mocks.length, mockBest: mocks.length ? mocks.reduce((b, h) => (h.score / h.max > b.score / b.max ? h : b)) : null,
      invStart: inv.filter((p) => inP(p.created || 0)).length, invDone: inv.filter((p) => inP(p.updated || 0) && words(p.share && p.share.learnt) >= 5).length,
      advStart: Object.values(S.adv.L || {}).filter((l) => l && inP(l.at || 0)).length, advDone: Object.values(S.adv.L || {}).filter((l) => l && inP(l.done || 0)).length,
      advChecks: Object.values(S.adv.L || {}).reduce((t, l) => t + ((l && l.secs) || []).filter((x) => x && x.check && x.check.v && x.check.v !== 'shown' && inP(x.check.at || 0)).length, 0),
      comp: U.m.comp || 0, olyp: U.m.olyp || 0, oly: U.m.oly || 0, lec: U.m.lec || 0, fey: U.m.fey || 0, prac: U.m.prac || 0, study: U.m.study || 0
    };
  }
  function allDays() {
    const s = X().st(), L = X().read(X().ukey('wl-learn'), {}) || {}, set = new Set(L.days || []);
    Object.entries(s.d).forEach(([k, D]) => { if ((D.t || 0) >= 60 || (D.n || 0) > 0) set.add(k); });
    return set;
  }
  function streaks() {
    const set = allDays(), k = (t) => X().day(t);
    let cur = 0, t = Date.now(); if (!set.has(k(t))) t -= DAY;
    while (set.has(k(t))) { cur++; t -= DAY; }
    const sorted = [...set].sort(); let best = 0, run = 0, prev = null;
    sorted.forEach((d) => { const tk = dayT(d); run = prev != null && Math.round((tk - prev) / DAY) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = tk; });
    return { cur, best, days: set.size };
  }
  function records(S) {
    const s = X().st(), M = X().metrics(), n = N(), TR = (WL.app && WL.app.TR) || {};
    const u = Object.keys(S.L.u || {}), A = []; Object.values(S.L.a || {}).forEach((x) => Object.entries(x || {}).forEach(([k, r]) => { if (r && r.v && k !== 'pre' && k !== 'endless') A.push(r); }));
    const right = A.reduce((t, r) => t + (r.v === 'correct' ? 1 : r.v === 'partial' ? 0.5 : 0), 0), T = S.T.hist || [], mocks = Object.values(S.C.hist || {}).flat().filter(Boolean);
    const inv = Object.values(S.lab.P || {}).filter((p) => p && p.kind === 'inv'), tot = Object.values(s.d).reduce((t, D) => t + (D.t || 0), 0);
    return { phys: u.filter((id) => (n[id] || {}).track !== 'maths').length, maths: u.filter((id) => (n[id] || {}).track === 'maths').length,
      physAll: TR.physics ? TR.physics.order.length : 0, mathsAll: TR.maths ? TR.maths.order.length : 0,
      q: A.length, acc: A.length ? right / A.length : null, tests: T.length, testBest: T.length ? Math.max(...T.map((h) => h.pct || 0)) : null,
      mocks: mocks.length, mockBest: mocks.length ? mocks.reduce((b, h) => (h.score / h.max > b.score / b.max ? h : b)) : null,
      comp: M.comp, olyp: M.olyp, oly: M.oly, lec: M.lec, fey: M.fey, prac: M.prac, inv: inv.length, invDone: inv.filter((p) => words(p.share && p.share.learnt) >= 5).length,
      time: tot, since: s.since };
  }

  /* ---------- the chart: active time per day (or per month in a year), one series ---------- */
  const nice = (v) => { const steps = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 600, 900, 1200, 1800, 2400, 3600]; return steps.find((x) => x >= v) || Math.ceil(v / 600) * 600; };
  function chartHTML(P, U, width) {
    const yr = P.kind === 'year', unit = yr ? 3600 : 60, vals = U.per.map((s) => s / unit);
    const W = Math.round(Math.min(1080, Math.max(320, width || 760))), H = W < 500 ? 200 : 240, ml = 46, mr = 10, mt = 16, mb = 30, base = H - mb;
    const mxv = Math.max(...vals, 0), top = yr ? (mxv <= 1 ? 1 : mxv <= 2 ? 2 : mxv <= 5 ? 5 : Math.ceil(mxv / 5) * 5) : nice(Math.max(mxv, P.kind === 'week' ? 30 : 15));
    const Y = (v) => base - (v / top) * (base - mt), bw = (W - ml - mr) / P.buckets.length, barW = Math.max(3, Math.min(24, bw - 2));
    const now = Date.now(), ti = P.buckets.findIndex((b) => now >= b.a && now < b.b), mx = vals.indexOf(Math.max(...vals));
    let g = '';
    [0, 0.5, 1].forEach((f) => { const v = top * f, y = Y(v); g += `<line x1="${ml}" x2="${W - mr}" y1="${y}" y2="${y}" class="ac-grid"/><text x="${ml - 8}" y="${y + 4}" text-anchor="end" class="ac-t">${yr ? +v.toFixed(1) + ' h' : v >= 60 ? +(v / 60).toFixed(1) + ' h' : Math.round(v) + ' min'}</text>`; });
    P.buckets.forEach((b, i) => {
      const x = ml + i * bw, cx = x + bw / 2, v = vals[i], h = base - Y(v), fut = b.a > now;
      if (v > 0) { const r = Math.min(4, h, barW / 2), x0 = cx - barW / 2, x1 = cx + barW / 2, y0 = base - h; g += `<path d="M${x0} ${base} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${base} Z" class="ac-bar${i === ti ? ' now' : ''}"/>`; }
      const show = P.kind === 'week' || (P.kind === 'year' ? W >= 500 || i % 2 === 0 : i === 0 || (i + 1) % 5 === 0 || i === ti);
      if (show) g += `<text x="${cx}" y="${H - 10}" text-anchor="middle" class="ac-t${i === ti ? ' now' : ''}${fut ? ' fut' : ''}">${esc(b.l)}</text>`;
      if (i === mx && v > 0) g += `<text x="${cx}" y="${Math.max(mt - 2, Y(v) - 6)}" text-anchor="middle" class="ac-v">${esc(hm(U.per[i]))}</text>`;
      g += `<rect x="${x}" y="${mt}" width="${bw}" height="${base - mt}" class="ac-hit" data-i="${i}" data-y="${Y(v).toFixed(1)}" tabindex="0" role="img" aria-label="${esc(b.full)}: ${esc(hm(U.per[i]))}${i === ti ? ' (today)' : ''}"/>`;
    });
    g += `<line x1="${ml}" x2="${W - mr}" y1="${base}" y2="${base}" class="ac-axis"/>`;
    const rows = P.buckets.map((b, i) => `<tr><th scope="row">${esc(b.full)}</th><td>${esc(hm(U.per[i]))}</td></tr>`).join('');
    return `<div class="ac-wrap"><svg class="ac-svg" viewBox="0 0 ${W} ${H}" aria-label="Active time ${yr ? 'per month' : 'per day'}, ${esc(P.label)}">${g}</svg><div class="ac-tip" role="status" hidden></div></div>
      <details class="act-table"><summary>Show as a table</summary><table><thead><tr><th scope="col">${yr ? 'Month' : 'Day'}</th><th scope="col">Active time</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  }

  /* ---------- pieces of the page ---------- */
  const delta = (a, b, fmt, word) => { if (b == null || a === b) return ''; const d = a - b; return `<span class="act-d ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${fmt(Math.abs(d))} ${d > 0 ? 'more' : 'less'} than last ${word}</span>`; };
  function tiles(P, U, A, U0, A0, K) {
    const tile = (l, v, sub) => `<div class="act-tile"><span class="act-tl">${l}</span><b>${v}</b>${sub ? `<span class="act-ts">${sub}</span>` : ''}</div>`;
    return `<div class="act-tiles">
      ${tile('Active time', esc(hm(U.t)), delta(U.t, U0.t, hm, P.word))}
      ${tile('Days active', `${U.days.size}<small> of ${P.current ? P.elapsed : P.days}</small>`, P.current ? `${P.days - P.elapsed} day${P.days - P.elapsed === 1 ? '' : 's'} left` : '')}
      ${tile('Topics learned', String(A.learned.length), A.learned.length ? `${A.phys} physics, ${A.maths} maths` : delta(A.learned.length, A0.learned.length, String, P.word))}
      ${tile('Answers checked', String(A.q), A.q ? `${pct(A.acc)} right` : '')}
      ${tile('AI requests', String(U.ai), U.ai ? `most in ${esc(areaName(top1(U.ais)))}` : '')}
      ${tile('Streak', `${K.cur}<small> day${K.cur === 1 ? '' : 's'}</small>`, `best ${K.best}`)}
    </div>`;
  }
  const areaName = (k) => (X().AREAS.find((a) => a[0] === k) || [k, k])[1];
  const top1 = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map((x) => x[0])[0] || 'other';
  function areasHTML(U) {
    const L = Object.entries(U.a).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    if (!L.length) return '<p class="muted">Nothing yet. Time counts while the page is open and in use.</p>';
    const max = L[0][1];
    return `<ul class="act-areas">${L.map(([k, v]) => `<li><span class="act-an">${esc(areaName(k))}</span><span class="act-ab"><i style="width:${Math.max(2, (v / max) * 100).toFixed(1)}%"></i></span><span class="act-av">${esc(hm(v))}${U.ais[k] ? ` <small>· ${U.ais[k]} AI</small>` : ''}</span></li>`).join('')}</ul>`;
  }
  function achHTML(P, A, A0) {
    const rows = [], add = (l, v, d) => rows.push(`<li><span>${l}</span><b>${v}</b>${d || ''}</li>`), dd = (a, b) => delta(a, b, String, P.word);
    if (A.learned.length) add('Topics learned', A.learned.length, dd(A.learned.length, A0.learned.length));
    if (A.q) add('Practice answers checked', `${A.q} <small>${pct(A.acc)} right</small>`, dd(A.q, A0.q));
    if (A.exam) add('Exam-style answers marked', A.exam);
    if (A.study) add('Study steps ticked off (watched, read, derived)', A.study);
    if (A.tests) add('Timed tests', `${A.tests} <small>average ${Math.round(A.testAvg)}%, best ${A.testBest}%</small>`);
    if (A.comp) add('Competition problems solved', A.comp);
    if (A.mocks) add('Mock competition papers', `${A.mocks} <small>best ${A.mockBest.score} of ${A.mockBest.max}</small>`);
    if (A.olyp) add('Olympiad problem parts solved', A.olyp);
    if (A.oly) add('Olympiad skills answered correctly', A.oly);
    if (A.lec) add('Lectures watched to the end', A.lec);
    if (A.fey) add('Feynman chapters read', A.fey);
    if (A.prac) add('Practicals started on the virtual bench', A.prac);
    if (A.invStart) add('Investigations started', A.invStart);
    if (A.invDone) add('Investigations written up', A.invDone);
    if (A.advStart) add('Advanced lessons started', A.advStart);
    if (A.advDone) add('Advanced lessons finished', A.advDone);
    if (A.advChecks) add('Advanced check questions answered', A.advChecks);
    if (!rows.length) return `<p class="muted">Nothing yet for this ${P.word}. Topics you mark as learned, answers you check, tests and papers you sit, and problems you solve all show up here.</p>`;
    return `<ul class="act-ach">${rows.join('')}</ul>${A.learned.length ? `<p class="act-learned">${A.learned.slice(0, 12).map((id) => `<a href="#t-${id}">${esc((N()[id] || {}).title || id)}</a>`).join('')}${A.learned.length > 12 ? `<span class="muted">and ${A.learned.length - 12} more</span>` : ''}</p>` : ''}`;
  }
  function topicsHTML(U) {
    const L = Object.entries(U.tp).filter(([id, v]) => v >= 60 && N()[id]).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (!L.length) return '';
    return `<section class="act-sec"><h2>Topics you spent most time on</h2><ol class="act-tp">${L.map(([id, v]) => `<li><a href="#t-${id}">${esc(N()[id].title)}</a><span>${esc(hm(v))}</span></li>`).join('')}</ol></section>`;
  }
  function recordsHTML(R, K) {
    const r = (l, v) => `<div class="act-rec"><span>${l}</span><b>${v}</b></div>`;
    return `<div class="act-recs">
      ${r('Physics topics learned', `${R.phys}<small> of ${R.physAll}</small>`)}${r('Maths topics learned', `${R.maths}<small> of ${R.mathsAll}</small>`)}
      ${r('Practice answers checked', R.q ? `${R.q}<small> ${pct(R.acc)} right</small>` : '0')}${r('Timed tests', R.tests ? `${R.tests}<small> best ${R.testBest}%</small>` : '0')}
      ${r('Competition problems solved', R.comp)}${r('Mock papers', R.mocks ? `${R.mocks}<small> best ${R.mockBest.score} of ${R.mockBest.max}</small>` : '0')}
      ${r('Olympiad parts solved', R.olyp)}${r('Lectures watched', R.lec)}${r('Feynman chapters read', R.fey)}${r('Practicals started', R.prac)}
      ${r('Investigations', R.inv ? `${R.inv}<small> ${R.invDone} written up</small>` : '0')}${r('Days studied', K.days)}${r('Longest streak', `${K.best}<small> day${K.best === 1 ? '' : 's'}</small>`)}
      ${r('Active time recorded', `${esc(hm(R.time))}<small> since ${new Date(R.since).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</small>`)}
    </div>`;
  }

  /* ---------- the AI summary ---------- */
  const SYS = `You write a brief summary of one student's activity on Geodesic, an educational physics and maths website, for the period named in the data. Use only the numbers and names in the data; never invent or estimate others. Write three or four short sentences of plain prose, addressed to the student as "you": what they spent most of their time on; their main achievement; one pattern worth noticing, such as their accuracy, how regularly they studied, or a change from the previous period; and one concrete suggestion for the next period that follows from the data. If the period is still in progress, say "so far". If there was little or no activity, say so plainly and suggest one small first step. Praise only what the numbers show, without exaggeration. No headings, lists or emoji. Reply in English.`;
  function payload(P, U, A, U0, A0, K) {
    const mins = (s) => Math.round(s / 60), byArea = {}; Object.entries(U.a).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => { if (v >= 60) byArea[areaName(k)] = mins(v); });
    const ach = {}; [['topicsLearned', A.learned.length], ['practiceAnswersChecked', A.q], ['examAnswersMarked', A.exam], ['studySteps', A.study], ['timedTests', A.tests], ['competitionProblemsSolved', A.comp], ['mockPapers', A.mocks], ['olympiadPartsSolved', A.olyp], ['lecturesWatched', A.lec], ['feynmanChapters', A.fey], ['practicalsStarted', A.prac], ['investigationsStarted', A.invStart], ['investigationsWrittenUp', A.invDone], ['advancedLessonsStarted', A.advStart], ['advancedLessonsFinished', A.advDone], ['advancedChecksAnswered', A.advChecks]].forEach(([k, v]) => { if (v) ach[k] = v; });
    if (A.q) ach.practiceAccuracyPercent = Math.round(A.acc * 100);
    if (A.tests) ach.testAveragePercent = Math.round(A.testAvg);
    if (A.mocks) ach.bestMockPaper = `${A.mockBest.score} of ${A.mockBest.max}`;
    return {
      period: { kind: P.word, label: P.label, inProgress: P.current, daysSoFar: P.current ? P.elapsed : P.days, daysInPeriod: P.days },
      usage: { activeMinutes: mins(U.t), daysActive: U.days.size, pagesOpened: U.n, aiRequests: U.ai, minutesByArea: byArea },
      achievements: ach,
      topicsLearned: A.learned.slice(0, 10).map((id) => (N()[id] || {}).title).filter(Boolean),
      mostTimeOnTopics: Object.entries(U.tp).filter(([id, v]) => v >= 120 && N()[id]).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, v]) => `${N()[id].title} (${mins(v)} min)`),
      previousPeriod: { activeMinutes: mins(U0.t), daysActive: U0.days.size, topicsLearned: A0.learned.length, practiceAnswersChecked: A0.q, practiceAccuracyPercent: A0.q ? Math.round(A0.acc * 100) : null },
      streakDays: K.cur
    };
  }
  /* the same summary written by the page itself, for when the AI cannot answer */
  function localSummary(P, U, A, U0) {
    const so = P.current ? ' so far' : '', L = [], areas = Object.entries(U.a).sort((a, b) => b[1] - a[1]);
    if (!U.t && !A.learned.length && !A.q) return `There is no activity recorded for this ${P.word}${so}. A good first step: open one topic you are studying and check two practice answers.`;
    L.push(`This ${P.word}${so} you were active on ${U.days.size} of ${P.current ? P.elapsed : P.days} days for ${hm(U.t)}${areas.length ? `, mostly on ${areaName(areas[0][0])} (${hm(areas[0][1])})` : ''}.`);
    const got = [A.learned.length ? `marked ${A.learned.length} topic${A.learned.length === 1 ? '' : 's'} as learned` : '', A.q ? `checked ${A.q} practice answer${A.q === 1 ? '' : 's'}, ${pct(A.acc)} of them right` : '', A.tests ? `sat ${A.tests} timed test${A.tests === 1 ? '' : 's'}` : ''].filter(Boolean);
    if (got.length) L.push(`You ${got.join(', ')}.`);
    if (U0.t) L.push(U.t >= U0.t ? `That is ${hm(U.t - U0.t)} more than last ${P.word}.` : `That is ${hm(U0.t - U.t)} less than last ${P.word}.`);
    L.push(A.q && A.acc < 0.6 ? 'Next: go back over the topics where answers were wrong before moving on.' : U.days.size <= 2 ? 'Next: try shorter sessions on more days; spreading practice out helps it stick.' : 'Next: keep the rhythm, and mix in a timed test to check what has stuck.');
    return L.join(' ');
  }
  let sumBusy = null;
  async function summary(view, P, U, A, U0, A0, K, force) {
    const box = $('#act-sum', view); if (!box) return;
    const s = X().st(), c = s.sum[P.key], data = payload(P, U, A, U0, A0, K), sig = JSON.stringify([data.usage, data.achievements]);
    const show = (e) => {
      box.innerHTML = `<div class="act-sh"><h2>Your ${P.word}${P.current ? ' so far' : ''}, in brief</h2>${e && !sumBusy ? `<button type="button" class="linkbtn" data-sum-new>Write it again</button>` : ''}</div>
        ${e ? `<div class="act-st">${md(e.text)}</div><p class="act-sm">${e.local ? 'Written by the page, because the AI could not answer.' : `Written by ${esc(e.who || 'the AI')} from your numbers only`} · ${new Date(e.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}${e.sig !== sig ? ' · your numbers have changed since' : ''}</p>` : `<p class="act-st muted">${sumBusy ? '<span class="dots"><i></i><i></i><i></i></span> Writing your summary' : 'No summary yet.'}</p>`}`;
      typeset(box);
    };
    const empty = !U.t && !U.n && !A.learned.length && !A.q && !A.tests && !A.mocks && !A.advStart;
    if (empty) { show({ text: localSummary(P, U, A, U0), local: 1, at: Date.now(), sig }); return; }
    const stale = !c || force || (c.sig !== sig && (P.current ? Date.now() - c.at > 30 * 60000 : true)) || (c.local && Date.now() - c.at > 5 * 60000);
    if (!stale || sumBusy) { show(c); return; }
    if (!WL.ai) { const e = { text: localSummary(P, U, A, U0), local: 1, at: Date.now(), sig }; X().mutate((o) => { o.sum[P.key] = e; }); show(e); return; }
    sumBusy = new AbortController(); show(c);
    let e;
    try {
      const r = await WL.ai.ask(SYS, [{ role: 'user', content: 'Activity data:\n' + JSON.stringify(data) }], { signal: sumBusy.signal });
      const text = String(r.text || '').trim(); if (!text) throw new Error('empty');
      e = { text, who: r.p ? String(WL.ai.label(r.p)).replace(/\s*\(.*\)\s*$/, '') : '', at: Date.now(), sig };
    } catch (er) { e = { text: localSummary(P, U, A, U0), local: 1, at: Date.now(), sig }; }
    sumBusy = null;
    X().mutate((o) => { o.sum[P.key] = e; Object.keys(o.sum).sort((a, b) => o.sum[b].at - o.sum[a].at).slice(40).forEach((k) => delete o.sum[k]); });
    if (location.hash === '#activity' && view.dataset.key === P.key) show(e);
  }

  /* today's Einstein allowance in tokens (the site owner has no limit) */
  function quotaLine() {
    const q = WL.quota; if (!q || !WL.auth || !WL.auth.entered) return '';
    if (!q.limited()) return `<p class="act-quota">Einstein: no daily limit for you, as the site owner. Everyone else gets ${q.short(q.perDay)} tokens a day.</p>`;
    const left = q.left();
    return `<p class="act-quota${left ? '' : ' out'}">Einstein today: <b>${q.short(left)} of ${q.short(q.perDay)}</b> tokens left${left ? '' : `. They start again at midnight, in ${esc(q.until())}`}.</p>`;
  }
  /* ---------- the page ---------- */
  let kind = 'week', off = 0;
  function render(view) {
    if (!X()) { view.innerHTML = '<section class="act"><p>Activity is not available on this page.</p></section>'; return; }
    X().flush();
    const P = period(kind, off), P0 = period(kind, off - 1), S = stores();
    const U = usage(P), U0 = usage(P0), A = achieved(P, U, S), A0 = achieved(P0, U0, S), K = streaks(), R = records(S);
    view.dataset.key = P.key;
    view.innerHTML = `<section class="act">
      <header class="act-head">
        <h1>Your activity</h1>
        <p class="act-lede">How you have used Geodesic and what you have achieved. It is kept in this browser, for this account.</p>
        ${quotaLine()}
        <div class="act-ctl"><div class="act-tabs" role="tablist" aria-label="Period">${Object.keys(KIND).map((k) => `<button type="button" role="tab" aria-selected="${k === kind}" data-kind="${k}">This ${k}</button>`).join('')}</div>
          <div class="act-nav"><button type="button" class="hbtn" data-shift="-1" aria-label="Previous ${P.word}">‹</button><span class="act-range">${esc(P.label)}</span><button type="button" class="hbtn" data-shift="1" aria-label="Next ${P.word}"${off >= 0 ? ' disabled' : ''}>›</button></div></div>
      </header>
      <section class="act-sum" id="act-sum" aria-live="polite"></section>
      ${tiles(P, U, A, U0, A0, K)}
      <section class="act-sec act-chart"><h2>Active time, ${P.kind === 'year' ? 'month by month' : 'day by day'}</h2>${chartHTML(P, U, (view.clientWidth || 800) - 24)}</section>
      <div class="act-cols">
        <section class="act-sec"><h2>Where your time went</h2>${areasHTML(U)}</section>
        <section class="act-sec"><h2>What you achieved</h2>${achHTML(P, A, A0)}</section>
      </div>
      ${topicsHTML(U)}
      <section class="act-sec"><h2>Your records</h2>${recordsHTML(R, K)}</section>
      <p class="act-note">Time counts while the page is open and in use, or while a film or narration plays. The summary is written by the AI from the numbers on this page and the names of topics, never your name or account. Everything here stays in this browser. <button type="button" class="linkbtn" data-act-clear>Clear the activity record</button></p>
    </section>`;
    typeset(view);
    summary(view, P, U, A, U0, A0, K, false);
    const tip = $('.ac-tip', view), wrap = $('.ac-wrap', view);
    const tipAt = (el) => {
      const i = +el.dataset.i, b = P.buckets[i], r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      tip.textContent = ''; const v = document.createElement('b'); v.textContent = hm(U.per[i]); const l = document.createElement('span'); l.textContent = b.full + (P.kind !== 'year' && Date.now() >= b.a && Date.now() < b.b ? ' · today' : ''); tip.append(v, l);
      tip.hidden = false; const svg = $('.ac-svg', view), sc = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width, by = +el.dataset.y * sc;
      const x = Math.min(Math.max(r.left - w.left + r.width / 2, 60), w.width - 60), up = by - 10 > tip.offsetHeight;
      tip.style.left = x + 'px'; tip.style.top = (up ? by - 8 : by + 8) + 'px'; tip.style.transform = up ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
      $$('.ac-hit', view).forEach((h) => h.classList.toggle('on', h === el));
    };
    const hide = () => { tip.hidden = true; $$('.ac-hit.on', wrap).forEach((h) => h.classList.remove('on')); };
    wrap.addEventListener('pointerover', (e) => { const h = e.target.closest('.ac-hit'); if (h) tipAt(h); });
    wrap.addEventListener('pointerleave', hide);
    wrap.addEventListener('focusin', (e) => { const h = e.target.closest('.ac-hit'); if (h) tipAt(h); });
    wrap.addEventListener('focusout', hide);
    view.onclick = (e) => {
      const t = e.target, at = (q) => t.closest(q); let el;
      if ((el = at('[data-kind]'))) { kind = el.dataset.kind; off = 0; render(view); return; }
      if ((el = at('[data-shift]'))) { off = Math.min(0, off + +el.dataset.shift); render(view); return; }
      if (at('[data-sum-new]')) { summary(view, P, U, A, U0, A0, K, true); return; }
      if (at('[data-act-clear]')) { if (confirm('Clear the record of your activity (time, pages and AI requests) and the summaries? Your progress, answers and tests are kept.')) { X().mutate((o) => { o.d = {}; o.sum = {}; o.since = Date.now(); }); render(view); } return; }
    };
  }
  WL.actPage = (view) => { document.body.dataset.page = 'activity'; document.title = 'Your activity · Geodesic'; render(view); };
  WL.actPage.period = period; WL.actPage.usage = usage; WL.actPage.achieved = achieved; WL.actPage.streaks = streaks; WL.actPage.payload = payload; WL.actPage.localSummary = localSummary;
})();
