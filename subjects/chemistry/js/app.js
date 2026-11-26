/* Quilio: shell, router and views. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PHYSICS_URL = '../physics/index.html#coverage-0625';   // Geodesic Physics on Fresh
  const FRESH_HOME = '../../';
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  const view = $('#view'), bar = $('#bar'), startEl = $('#start');
  let IDX = null, ALL = [], BY = {}, STAGE = {}, TOPIC = {}, SEARCH = [], files = {}, CUR = null, cleanups = [];
  const done = new Set(store.get('gc.done', []));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const hue = S => `--hue:var(--${S.id})`;
  const LOGO = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12.6" stroke="#0a2440" stroke-width="1.6"/><path d="M4.6 20.5c6.2-9.4 15.2-12.6 23.4-9.2" stroke="#f09a2e" stroke-width="2.1" stroke-linecap="round"/><path d="M6.4 24.4c6.8-7.3 13.9-9.4 20.6-8.3" stroke="#1673dc" stroke-width="2.1" stroke-linecap="round"/></svg>';
  const TICK = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.4 5 8.8l4.5-5.4"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ico = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    state: '<circle cx="7" cy="16.5" r="3"/><circle cx="14" cy="16.5" r="3"/><circle cx="10.5" cy="10.4" r="3"/><circle cx="18.6" cy="6" r="1.7"/>',
    atom: '<circle cx="12" cy="12" r="1.7" fill="currentColor"/><ellipse cx="12" cy="12" rx="9.6" ry="3.9"/><ellipse cx="12" cy="12" rx="9.6" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.6" ry="3.9" transform="rotate(120 12 12)"/>',
    mole: '<path d="M12 4v15.5M7 20h10M5 7.5h14"/><path d="M5 7.5 2.6 13.5h4.8zM19 7.5l-2.4 6h4.8z"/>',
    echem: '<path d="M4.5 9.5V20h15V9.5"/><path d="M9 4v11M15 4v11M7.4 4h3.2M13.4 4h3.2"/>',
    energ: '<path d="M3.5 20V4M3.5 20h17"/><path d="M5.5 14.5c4 0 4-8.5 7-8.5s3.5 11.5 8 11.5"/>',
    rate: '<circle cx="12" cy="13.5" r="7.3"/><path d="M12 13.5V9.2M10 3.4h4M12 3.4v2.8"/>',
    equil: '<path d="M4 9h15.5L16 5.5M20 15H4.5L8 18.5"/>',
    acid: '<path d="M12 3.5c3.6 4.6 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6 6-10.6z"/><path d="M9.3 14.4a2.8 2.8 0 0 0 2.4 2.7"/>',
    ptable: '<rect x="3.5" y="4.5" width="4.3" height="4.3" rx=".8"/><rect x="16.2" y="4.5" width="4.3" height="4.3" rx=".8"/><rect x="3.5" y="10.8" width="4.3" height="4.3" rx=".8"/><rect x="9.85" y="10.8" width="4.3" height="4.3" rx=".8"/><rect x="16.2" y="10.8" width="4.3" height="4.3" rx=".8"/><rect x="3.5" y="17.1" width="4.3" height="3.4" rx=".8"/><rect x="9.85" y="17.1" width="4.3" height="3.4" rx=".8"/><rect x="16.2" y="17.1" width="4.3" height="3.4" rx=".8"/>',
    metal: '<path d="M12 3.2 20 7.6v8.8l-8 4.4-8-4.4V7.6z"/><path d="M12 12l8-4.4M12 12 4 7.6M12 12v8.8"/>',
    env: '<path d="M7.2 18a4 4 0 0 1-.6-7.95A5.6 5.6 0 0 1 17.2 9.4 4.3 4.3 0 0 1 17.6 18z"/>',
    org: '<path d="M12 3.4 19.4 7.7v8.6L12 20.6 4.6 16.3V7.7z"/><circle cx="12" cy="12" r="3.5"/>',
    lab: '<path d="M9.3 3.5h5.4M10.4 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 19l-5.4-9.5v-6"/><path d="M7.6 15.5h8.8"/>',
    bond: '<circle cx="6.8" cy="12" r="3.6"/><circle cx="17.2" cy="12" r="3.6"/><path d="M10.4 12h3.2"/>',
    inorg: '<path d="M12 3.5 19 9l-7 11.5L5 9z"/><path d="M5 9h14M12 3.5 9.5 9l2.5 11.5L14.5 9z"/>',
    anal: '<path d="M3.5 19.5h17"/><path d="M6 19.5V11M10 19.5v-5M14 19.5V5M18 19.5v-7.5"/>',
  };
  const icon = d => ico(ICON[d] || ICON[d.replace(/[b-g]$/, '')] || ICON.lab);

  /* ---------- text ---------- */
  // If the KaTeX script could not load (a blocked network), equations are still shown, in a simpler form.
  function plainTex(src) {
    let s = esc(src); const grp = '\\{((?:[^{}]|\\{[^{}]*\\})*)\\}';
    for (let k = 0; k < 4; k++) s = s.replace(new RegExp('\\\\[dt]?frac' + grp + grp, 'g'), '($1) ÷ ($2)').replace(new RegExp('\\\\(?:mathrm|text|mathbf|mathit)' + grp, 'g'), '$1').replace(new RegExp('\\\\sqrt' + grp, 'g'), '√($1)').replace(new RegExp('\\\\overset' + grp + grp, 'g'), '$2');
    const MAP = { rightarrow: '→', rightleftharpoons: '⇌', times: '×', Delta: 'Δ', delta: 'δ', sum: 'Σ', ominus: '⦵', bullet: '•', cdot: '·', propto: '∝', ll: '≪', div: '÷', log: 'log', qquad: '   ', left: '', right: '', '%': '%' };
    s = s.replace(/\\([a-zA-Z]+|%)/g, (m, c) => MAP[c] !== undefined ? MAP[c] : c).replace(/\\[ ,;]/g, ' ');
    s = s.replace(new RegExp('_' + grp, 'g'), '<sub>$1</sub>').replace(new RegExp('\\^' + grp, 'g'), '<sup>$1</sup>').replace(/_(\w)/g, '<sub>$1</sub>').replace(/\^([\w+\-−])/g, '<sup>$1</sup>').replace(/[{}]/g, '');
    return `<span class="ptex">${s}</span>`;
  }
  function tex(src, display) { if (!window.katex) return plainTex(src); try { return katex.renderToString(src, { displayMode: !!display, throwOnError: false, strict: false }); } catch (e) { return plainTex(src); } }
  // \mathrm{A + B \rightarrow C} becomes \mathrm{A} + \mathrm{B} \rightarrow \mathrm{C}, so a long equation in a sentence can wrap on a phone
  function splitRm(src) {
    const m = /^\\mathrm\{([\s\S]*)\}$/.exec(src.trim()); if (!m) return src;
    const inner = m[1], ops = [' + ', ' \\rightarrow ', ' \\rightleftharpoons ', ' = '], parts = []; let depth = 0, cur = '', i = 0;
    while (i < inner.length) {
      const ch = inner[i]; if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth < 0) return src; }
      if (depth === 0) { const op = ops.find(o => inner.startsWith(o, i)); if (op) { parts.push(cur, op); cur = ''; i += op.length; continue; } }
      cur += ch; i++;
    }
    if (depth !== 0 || !parts.length) return src; parts.push(cur);
    return parts.map((p, k) => k % 2 ? p : `\\mathrm{${p}}`).join('');
  }
  function inline(s) {
    if (!s) return ''; const math = [];
    s = String(s).replace(/\$([^$]+)\$/g, (m, t) => { math.push(t); return '\u0001' + (math.length - 1) + '\u0002'; });
    s = esc(s).replace(/\^\(((?:[^()]|\([^()]*\))*)\)/g, '<sup>$1</sup>').replace(/([A-Za-zΔδ\])])_(?:\{([^{}]+)\}|([A-Za-z0-9]+))/g, (m, a, b, c) => a + '<sub>' + (b || c) + '</sub>').replace(/\^(δ[+−-]|[−-]?[A-Za-z0-9]+)/g, '<sup>$1</sup>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, '$1<em>$2</em>');
    return s.replace(/\u0001(\d+)\u0002/g, (m, i) => tex(splitRm(math[+i]), false));
  }
  const plain = s => String(s || '').replace(/\$([^$]+)\$/g, '$1').replace(/\*\*/g, '').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}_^]/g, '');
  const LBL = { key: 'Key idea', warn: 'Watch out', exam: 'Exam tip', note: 'Note', analogy: 'Picture it' };
  function table(rows) {
    const head = rows[0], body = rows.slice(1), rh = head[0] === '';
    return `<div class="tb-wrap"><table class="${rh ? 'rowhead' : ''}"><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function blocks(B) {
    let h = '', sec = 0;
    for (const b of B) {
      switch (b[0]) {
        case 'h2': sec++; h += `<h2 id="sec-${sec}" data-secno="${sec}"><i>${sec}</i><span>${inline(b[1])}</span></h2>`; break;
        case 'h3': h += `<h3>${inline(b[1])}</h3>`; break;
        case 'p': h += `<p>${inline(b[1])}</p>`; break;
        case 'ul': h += `<ul>${b[1].map(x => `<li>${inline(x)}</li>`).join('')}</ul>`; break;
        case 'tb': h += table(b[1]); break;
        case 'eq': h += `<div class="eq">${tex(b[1], true)}</div>`; break;
        case 'def': h += `<div class="call def"><span class="lbl">Definition</span><b class="term">${inline(b[1])}</b>${inline(b[2])}</div>`; break;
        case 'mol': h += `<figure class="mol"><pre>${esc(b[2])}</pre><figcaption>${inline(b[1])}</figcaption></figure>`; break;
        default: h += `<div class="call ${b[0]}"><span class="lbl">${LBL[b[0]] || 'Note'}</span>${inline(b[1])}</div>`;
      }
    }
    return h;
  }

  /* ---------- data ---------- */
  // The lecture text of a stage lives in a few text files. They are fetched and read the first time the stage is needed.
  function stageData(S) {
    return files[S.id] || (files[S.id] = Promise.all(S.files.map(f => fetch(f).then(r => { if (!r.ok) throw new Error(f + ' ' + r.status); return r.text(); }))).then(texts => {
      const G = {}; texts.forEach(t => Guide.parseGuides(t, G)); Guide.patch(G);
      S.all.forEach(L => { const g = G[L.id]; if (!g) return; L.secs = g.b.filter(b => b[0] === 'h2').map(b => b[1]); L.defs = g.b.filter(b => b[0] === 'def').map(b => [b[1], b[2]]);
        L.secs.forEach(x => SEARCH.push({ L, t: x, k: 1, hay: plain(x).toLowerCase() })); L.defs.forEach(d => SEARCH.push({ L, t: d[0], k: 2, hay: plain(d[0]).toLowerCase() })); });
      return G;
    }).catch(e => { delete files[S.id]; throw e; }));
  }
  const here = h => decodeURIComponent(location.hash.slice(1)) === h;
  const stageDone = S => S.all.filter(l => done.has(l.id)).length;
  const pc = (a, b) => b ? Math.round(a / b * 100) : 0;

  /* ---------- start screen ---------- */
  let orb = null, orbTimer = 0, orbHold = 0;
  function orbLabel(id, o) {
    $('#orbName').innerHTML = `<b>${o.label}${o.sub ? `<sub>${o.sub}</sub>` : ''} orbital</b>${esc(o.say)}`;
    $$('#orbChips button').forEach(b => b.classList.toggle('is-on', b.dataset.v === id));
  }
  function orbCycle() { clearTimeout(orbTimer); if (!orb || orb.reduce) return; orbTimer = setTimeout(() => { if (startEl.hidden) return; if (Date.now() > orbHold && !orb.drag) orb.next(); orbCycle(); }, 8500); }
  function startShow() {
    startEl.hidden = false; bar.hidden = true; view.hidden = true; view.innerHTML = ''; startEl.scrollTop = 0; homeMore();
    if (!orb) {
      const wide = window.innerWidth >= 980;
      orb = new Orbital.View($('#orb'), { n: window.innerWidth < 700 ? 12000 : 24000, zoom: wide ? 1.95 : 1.5, centre: wide ? [0.38, 0.07] : [0, 0.6], onChange: orbLabel });
      $('#orbN').textContent = orb.N.toLocaleString('en-GB');
      $('#orbChips').innerHTML = Orbital.ORDER.map(k => `<button type="button" data-v="${k}">${Orbital.ORBS[k].label}${Orbital.ORBS[k].sub ? `<sub>${Orbital.ORBS[k].sub}</sub>` : ''}</button>`).join('');
      $('#orbChips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; orbHold = Date.now() + 40000; orb.set(b.dataset.v); Snd.tick(); });
      orb.set('2p', true);
      const note = $('.live-note'); note.addEventListener('toggle', () => { if (note.open) note.scrollIntoView({ block: 'end', behavior: orb.reduce ? 'auto' : 'smooth' }); });
    }
    orb.start(); orbCycle();
  }
  function startHide() { if (filmKill) { filmKill(); filmKill = null; } startEl.hidden = true; bar.hidden = false; view.hidden = false; if (orb) orb.stop(); clearTimeout(orbTimer); }

  /* ---------- home: everything the site does, live, under the orbital ---------- */
  const LAB = [['states', 'States of matter', 'ci-1-1'], ['ph', 'The pH scale', 'ci-7-1'], ['rate', 'Rates of reaction', 'ci-6-2'], ['equilibrium', 'Equilibrium', 'ci-6-3'], ['electrolysis', 'Electrolysis', 'ci-4-1'], ['boltzmann', 'Boltzmann curve', 'ca-8-2']];
  let homeBuilt = false, labAt = 0, hmQ = null, filmAt = 'ionic', filmKill = null;
  function filmMount() {
    const host = $('#hmFilm'); if (!host) return; if (filmKill) filmKill();
    host.innerHTML = '<div></div>'; filmKill = Films.mount(host.firstChild, filmAt);
    $('#hmFilmLink').innerHTML = 'In the lectures: ' + Films.lectures(filmAt).filter(id => BY[id]).map(id => `<a href="#${id}">${BY[id].stage.label} ${BY[id].code}</a>`).join(' · ');
    $$('#hmFilmTabs button').forEach(b => b.classList.toggle('is-on', b.dataset.filmpick === filmAt));
  }
  function labMount() {
    const host = $('#hmFig'); if (!host) return; const [name, , lid] = LAB[labAt], L = BY[lid];
    host.innerHTML = '<div></div>'; Widgets.mount(name, host.firstChild);
    $('#hmFigLink').innerHTML = L ? `This model lives in <a href="#${L.id}">${L.stage.label} ${L.code} · ${esc(L.title)}</a>, with the notes that explain it.` : '';
    $$('#hmLabTabs button').forEach((b, i) => b.classList.toggle('is-on', i === labAt));
  }
  function hmElement() {
    const pool = PT.EL.filter(e => e.z <= 36), e = pool[Math.random() * pool.length | 0], c = PT.CATS[e.cat];
    $('#hmEl').innerHTML = `<div class="hm-el-tile c-${e.cat}"><small>${e.z}</small><b>${e.sym}</b><i>${e.ar}</i></div><div class="hm-el-facts"><h3>${e.name}</h3><p>${c[0]} · ${e.state} at room temperature</p><p class="cfg">${PT.spdf(e.z) || ''}</p><p>Period ${e.period}${e.group ? ', Group ' + e.group : ''}. ${e.z} proton${e.z === 1 ? '' : 's'} and ${e.z} electron${e.z === 1 ? '' : 's'} in a neutral atom.</p></div>`;
  }
  async function hmQuestion() {
    const box = $('#hmQ'); if (!box) return; box.innerHTML = '<p class="def-wait">Finding a question…</p>';
    const last = BY[store.get('gc.last', '')], S = (last && last.stage) || STAGE.igcse || IDX.stages[0];
    try {
      const G = await stageData(S), pool = S.all.filter(l => G[l.id] && G[l.id].c.length), L = pool[Math.random() * pool.length | 0], rec = G[L.id], i = Math.random() * rec.c.length | 0, q = rec.c[i];
      hmQ = { L, q };
      box.innerHTML = `<p class="hm-q-from" style="${hue(S)}">${S.label} ${L.code} · ${esc(L.title)}</p><p class="hm-q-text">${inline(q.q)}</p><div class="opts">${q.o.map((o, k) => `<button type="button" data-hmo="${k}">${inline(o)}</button>`).join('')}</div><div class="fb" hidden></div>`;
    } catch (e) { box.innerHTML = '<p class="def-wait">The question did not load. Check your connection.</p>'; }
  }
  function homeMore() {
    const host = $('#homeMore'); if (!IDX) return;
    if (homeBuilt) { labMount(); homeProgress(); return; }
    homeBuilt = true;
    const nT = IDX.stages.reduce((a, s) => a + s.topics.length, 0), nS = ALL.reduce((a, l) => a + l.ns, 0), nQ = ALL.reduce((a, l) => a + l.q, 0);
    host.innerHTML = `
      <section class="hm-strip" aria-label="The site in numbers">${[[ALL.length, 'lectures'], [nT, 'topics, in syllabus order'], [nS, 'concepts explained'], [nQ, 'questions, marked here'], [Films.count, 'short films'], [16, 'live models']].map(f => `<div><b>${f[0].toLocaleString('en-GB')}</b><span>${f[1]}</span></div>`).join('')}</section>
      <section class="hm-sec" id="hm-lab"><header><p class="kicker">Live models</p><h2>Do not just read about it. Change it.</h2><p>Every model below is running now. Move a control and watch what the particles do.</p></header>
        <div class="seg" id="hmLabTabs" role="group" aria-label="Choose a live model">${LAB.map((l, i) => `<button type="button" data-lab="${i}">${l[1]}</button>`).join('')}</div>
        <div id="hmFig"></div><p class="hm-note" id="hmFigLink"></p></section>
      <section class="hm-sec hm-two">
        <div class="hm-card panel"><header><p class="kicker">One question</p><h2>Can you get this one?</h2></header><div id="hmQ"></div><div class="hm-row"><button type="button" class="chip" data-hm="q">Another question</button></div></div>
        <div class="hm-card panel"><header><p class="kicker">One element</p><h2>Meet an element.</h2></header><div id="hmEl" class="hm-el"></div><div class="hm-row"><button type="button" class="chip" data-hm="el">Another element</button><a class="chip" href="#periodic-table">Open the Periodic Table</a></div></div>
      </section>
      <section class="hm-sec">
        <div class="hm-card panel hm-olympiad"><header><p class="kicker">Olympiad</p><h2>Ready for the Chemistry Olympiad?</h2><p>A ${window.Training ? Training.count : 13}-module training course with worked examples, problem ladders and spaced review; the competitions from C3L6 to the IChO; the IChO syllabus mapped onto these lectures; ${Olympiad.count} original problems with worked solutions; and every free past-paper archive.</p></header>
          <div class="hm-row"><a class="chip" href="#olympiad-competitions">Competitions</a><a class="chip" href="#olympiad-syllabus">IChO syllabus</a><a class="chip" href="#olympiad-practice">Practice problems</a><a class="chip" href="#olympiad-papers">Past papers</a></div><div class="hm-row"><a class="btn small" href="#olympiad-train">Start training ${ARROW}</a></div></div>
      </section>
      <section class="hm-sec"><header><p class="kicker">Inside every lecture</p><h2>How a lecture works.</h2></header>
        <ol class="hm-how">${[['First look', 'The whole lecture in a few sentences, before any detail.'], ['Notes', 'Every concept the syllabus asks for, numbered the way your syllabus numbers it.'], ['Live figure', 'A model you can change, on the lectures marked Live.'], ['What earns the marks', 'The wording mark schemes reward, with a mode that hides the answers.'], ['Check yourself', 'Original exam-style questions, marked here on your device.']].map((x, i) => `<li><b>${i + 1}</b><h3>${x[0]}</h3><p>${x[1]}</p></li>`).join('')}</ol></section>
      <section class="hm-sec"><header><p class="kicker">Four stages, one straight path</p><h2>Start where you are.</h2></header><div id="hmResume"></div>
        <div class="hm-stages" id="hmStages"></div></section>
      <footer class="hm-foot"><a href="#chemistry">All lectures</a><a href="#periodic-table">Periodic Table</a><a href="#definitions">Definitions</a><a href="#olympiad">Olympiad</a><a href="#about-us">About this site</a><a href="#developers">Developers</a><a href="${PHYSICS_URL}">Geodesic Physics</a>${window.GEO_HOME ? `<a href="${window.GEO_HOME}">ΦΥΣΙΣ home</a>` : ''}</footer>`;
    host.addEventListener('click', e => {
      const lab = e.target.closest('[data-lab]'); if (lab) { labAt = +lab.dataset.lab; Widgets.clear(); labMount(); Snd.tick(); return; }
      const hm = e.target.closest('[data-hm]'); if (hm) { if (hm.dataset.hm === 'q') hmQuestion(); else hmElement(); Snd.tick(); return; }
      const o = e.target.closest('[data-hmo]'); if (o && hmQ) {
        const q = hmQ.q, pick = +o.dataset.hmo, ok = pick === q.a, fb = $('#hmQ .fb');
        $$('#hmQ .opts button').forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('is-right'); else if (k === pick) b.classList.add('is-wrong'); });
        fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${inline(q.y)} <a href="#${hmQ.L.id}">Read the lecture ${ARROW}</a>`; Snd.tick(ok);
      }
    });
    labMount(); hmElement(); hmQuestion(); homeProgress();
  }
  function homeProgress() {
    const last = BY[store.get('gc.last', '')];
    $('#hmResume').innerHTML = last ? `<div class="resume panel" style="${hue(last.stage)}"><div><span class="kicker">Carry on where you stopped</span><b>${last.stage.label} ${last.code} · ${esc(last.title)}</b></div><a class="btn small" href="#${last.id}">Open lecture ${ARROW}</a></div>` : '';
    $('#hmStages').innerHTML = IDX.stages.map(S => { const d = stageDone(S); return `<a class="hm-stage panel" href="#${S.hash}" style="${hue(S)}"><b>${S.label}</b><span>${S.years} · ${esc(S.spec)}</span><div class="meter"><i style="--v:${pc(d, S.all.length)}%"></i></div><small>${plural(S.topics.length, 'topic')} · ${plural(S.all.length, 'lecture')} · ${d} done</small></a>`; }).join('');
  }

  /* ---------- views ---------- */
  function crumbs(parts) { return `<nav class="crumbs" aria-label="Breadcrumb">${parts.map((p, i) => i === 0 ? `<a href="${p[0]}">${p[1]}</a>` : `<span>${p[0] ? `<a href="${p[0]}">${p[1]}</a>` : esc(p[1])}</span>`).join('')}</nav>`; }

  function vHub() {
    const nT = IDX.stages.reduce((a, s) => a + s.topics.length, 0);
    view.innerHTML = `<div class="hub">
      <header class="hub-head"><h1>${LOGO}Geodesic &amp; Quilio</h1><p>Two sites, made by students for our CCA: Geodesic for physics, Quilio for chemistry. Choose where to go.</p></header>
      <div class="tiles">
        <a class="tile" href="#start"><div class="tile-art" style="background:linear-gradient(180deg,#58a9ee,#cfe9ff)"><canvas id="hubOrb" aria-hidden="true"></canvas></div><div class="tile-body"><small>Subject</small><h2>Chemistry</h2><p>KS3, IGCSE, AS and A Level. ${nT} topics and ${ALL.length} lectures, in syllabus order.</p><span class="go">Open Chemistry ${ARROW}</span></div></a>
        <a class="tile" href="${PHYSICS_URL}"><div class="tile-art" style="background:#060b16"><svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="#fff"><circle cx="24" cy="30" r="1"/><circle cx="70" cy="150" r=".9"/><circle cx="262" cy="26" r="1.1"/><circle cx="238" cy="160" r=".8"/><circle cx="120" cy="22" r=".7"/><circle cx="282" cy="96" r=".9"/><circle cx="40" cy="98" r=".7"/><circle cx="196" cy="174" r=".8"/></g><ellipse cx="150" cy="100" rx="118" ry="18" fill="none" stroke="#f0a850" stroke-width="7" opacity=".85"/><ellipse cx="150" cy="100" rx="96" ry="13" fill="none" stroke="#ffe2b0" stroke-width="2" opacity=".8"/><circle cx="150" cy="95" r="42" fill="#000"/><circle cx="150" cy="95" r="44" fill="none" stroke="#f6c888" stroke-width="2.4"/><path d="M33 104a118 18 0 0 0 234 0" fill="none" stroke="#f0a850" stroke-width="7" opacity=".9"/></svg></div><div class="tile-body"><small>Subject</small><h2>Physics</h2><p>Geodesic Physics, built by Ian. From KS3 to quantum field theory.</p><span class="go">Open Physics ${ARROW}</span></div></a>
        <a class="tile" href="#about-us"><div class="tile-art" style="background:linear-gradient(180deg,#bfe2ff,#f3faff)"><svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M36 146C92 150 96 62 150 96s64-70 116-54" fill="none" stroke="#0a2440" stroke-width="1.6" stroke-dasharray="2 6" stroke-linecap="round"/><g font-family="Jost, sans-serif" font-size="12" font-weight="500" text-anchor="middle" fill="#0a2440"><circle cx="36" cy="146" r="9" fill="#0c9a8a"/><text x="36" y="172">KS3</text><circle cx="112" cy="104" r="9" fill="#1673dc"/><text x="112" y="130">IGCSE</text><circle cx="190" cy="82" r="9" fill="#5b55df"/><text x="190" y="108">AS</text><circle cx="266" cy="42" r="9" fill="#b0388c"/><text x="266" y="68">A Level</text></g></svg></div><div class="tile-body"><small>Project</small><h2>About us</h2><p>What Quilio is, how it is organised and what each lecture contains.</p><span class="go">Read about us ${ARROW}</span></div></a>
        <a class="tile" href="#developers"><div class="tile-art" style="background:linear-gradient(180deg,#d6ecff,#fbfdff)"><svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g fill="none" stroke="#0a2440" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M92 66 58 95l34 29M208 66l34 29-34 29"/></g><circle cx="134" cy="95" r="25" fill="#f09a2e"/><circle cx="168" cy="95" r="25" fill="#1673dc" stroke="#fff" stroke-width="3"/><g font-family="Jost, sans-serif" font-size="19" font-weight="500" text-anchor="middle" fill="#fff"><text x="130" y="102">I</text><text x="168" y="102">S</text></g></svg></div><div class="tile-body"><small>Project</small><h2>Developers</h2><p>The students who build Geodesic and Quilio, and how the site is made.</p><span class="go">Meet the developers ${ARROW}</span></div></a>
      </div></div>`;
    const c = $('#hubOrb');
    if (c && window.Orbital) { const v = new Orbital.View(c, { n: 7000, zoom: 2.5 }); v.set('3dz2', true); v.start(); cleanups.push(() => v.destroy()); }
  }

  function vAbout() {
    const nT = IDX.stages.reduce((a, s) => a + s.topics.length, 0), nS = ALL.reduce((a, l) => a + l.ns, 0), nQ = ALL.reduce((a, l) => a + l.q, 0);
    view.innerHTML = `<div class="page">${crumbs([['#home', 'Homepage'], ['', 'About us']])}
      <header class="page-head"><h1>About us</h1><p>Quilio is a chemistry learning site made by students, for the students in our CCA. The idea: the shortest honest route through the subject, with nothing skipped.</p></header>
      <div class="facts" style="margin-bottom:26px">${[[IDX.stages.length, 'stages, KS3 to A Level'], [nT, 'topics in syllabus order'], [ALL.length, 'lectures'], [nS, 'concepts explained']].map(f => `<div class="fact panel"><b>${f[0].toLocaleString('en-GB')}</b><span>${f[1]}</span></div>`).join('')}</div>
      <div class="prose">
        <h2>Two subjects, one project</h2>
        <p><a href="${PHYSICS_URL}">Geodesic</a>, the physics site, is built by Ian. Quilio, the chemistry site you are in now, is built by Semin. They are separate sites that share a look and a promise: every idea in order, and every step explained.</p>
        <h2>How Chemistry is organised</h2>
        <ul>${IDX.stages.map(s => `<li><a href="#${s.hash}"><strong>${s.label}</strong></a> (${s.years}): ${s.sub}. ${plural(s.topics.length, 'topic')}, ${plural(s.all.length, 'lecture')}.</li>`).join('')}</ul>
        <p>Every stage is a list of numbered topics. Every topic is a list of numbered lectures. Every lecture is a list of numbered concepts. The numbers match the syllabus, so the number in your school notes is the number here.</p>
        <h2>What is inside a lecture</h2>
        <ul><li><strong>First look:</strong> the whole lecture in a few sentences.</li><li><strong>Notes:</strong> every concept the syllabus asks for, with tables, equations and drawn structures.</li><li><strong>Films:</strong> a short animated film at the top of the lectures marked Film, with captions and a script you can read.</li><li><strong>Live figures:</strong> models you can change, on the lectures marked Live.</li><li><strong>Formulas to know</strong> and <strong>Watch out:</strong> what to memorise and what people get wrong.</li><li><strong>What earns the marks:</strong> the wording that mark schemes reward, with a mode that hides the answers so you can test yourself.</li><li><strong>Check yourself:</strong> ${nQ.toLocaleString('en-GB')} questions across the site, marked on your own device.</li></ul>
        <h2>Honest notes</h2>
        <ul><li>The IGCSE lectures were checked point by point against the Cambridge IGCSE Chemistry 0620 syllabus for exams in 2026 to 2028. AS and A Level follow Cambridge 9701 for 2025 to 2027. KS3 follows the National Curriculum for England.</li><li>The questions are original, written in the Cambridge style. They are not past-paper questions.</li><li>The drifting specks behind every page are air: 39 nitrogen molecules, 10 oxygen molecules and 1 argon atom, close to the real mix. Carbon dioxide is about 1 molecule in 2400, so you will not see one.</li><li>Your ticks for finished lectures are saved in this browser only. There are no accounts.</li><li>Found a mistake? Tell one of the <a href="#developers">developers</a>.</li></ul>
      </div></div>`;
  }

  function vDevs() {
    view.innerHTML = `<div class="page">${crumbs([['#home', 'Homepage'], ['', 'Developers']])}
      <header class="page-head"><h1>Developers</h1><p>Geodesic and Quilio are built by two students at Garden International School.</p></header>
      <div class="cols-2" style="margin-bottom:28px">
        <div class="person panel" style="--hue:var(--sun)"><div class="avatar">I</div><h3>Ian Lee</h3><p><strong>Geodesic Physics.</strong> Physics and mathematics, from KS3 to quantum field theory.</p><a class="go" href="${PHYSICS_URL}">Open Geodesic Physics</a></div>
        <div class="person panel" style="--hue:var(--igcse)"><div class="avatar">S</div><h3>Semin Cheon</h3><p><strong>Quilio.</strong> Chemistry from KS3 to A Level, in syllabus order.</p><a class="go" href="#chemistry">Open Quilio ${ARROW}</a></div>
      </div>
      <div class="prose">
        <h2>How Chemistry is made</h2>
        <ul><li>Plain HTML, CSS and JavaScript. No framework, no accounts, no tracking.</li><li>The atom on the start screen is drawn with WebGL: thousands of dots sampled from the wavefunctions of hydrogen.</li><li>Equations are typeset with KaTeX. The typefaces are Jost and Source Serif 4.</li><li>The lectures are stored as text, one file for each stage, and loaded only when you open that stage.</li></ul>
        <h2>The syllabuses we follow</h2>
        <ul>${IDX.stages.map(s => `<li><strong>${s.label}:</strong> ${esc(s.source)}</li>`).join('')}</ul>
      </div></div>`;
  }

  function vChem() {
    const last = BY[store.get('gc.last', '')];
    view.innerHTML = `<div class="page">
      <header class="page-head"><p class="kicker">Quilio</p><h1>Four stages, one straight path.</h1><p>Pick a stage, then a topic, then a lecture. Everything is numbered the way your syllabus numbers it.</p></header>
      ${last ? `<div class="resume panel" style="${hue(last.stage)}"><div><span class="kicker">Carry on where you stopped</span><b>${last.stage.label} ${last.code} · ${esc(last.title)}</b></div><a class="btn small" href="#${last.id}">Open lecture ${ARROW}</a></div>` : ''}
      <div class="board">${IDX.stages.map(S => { const d = stageDone(S); return `<section class="col panel" style="${hue(S)}" aria-label="${S.label}">
        <div class="col-head"><h2><a href="#${S.hash}">${S.label}</a></h2><p>${S.years} · ${esc(S.spec)}${S.code === 'KS3' ? '' : ' ' + S.code}</p></div>
        <div class="meter"><i style="--v:${pc(d, S.all.length)}%"></i></div>
        <div class="col-stat"><span>${plural(S.topics.length, 'topic')} · ${plural(S.all.length, 'lecture')}</span><span>${d} done</span></div>
        <ol>${S.topics.map(T => `<li><a href="#${T.hash}"><b>${T.n}</b><span>${esc(T.title)}</span><i>${T.lectures.length}</i></a></li>`).join('')}</ol></section>`; }).join('')}</div>
      <div class="toolrow"><a class="toolcard panel" href="#start"><b>Chemistry home</b><span>Live models, a question and an element, on one page.</span></a><a class="toolcard panel" href="#periodic-table"><b>Periodic Table</b><span>All 118 elements. Click one for its numbers, family and electronic configuration.</span></a><a class="toolcard panel" href="#definitions"><b>Definitions</b><span>Every definition from every lecture, in one searchable list.</span></a><a class="toolcard panel" href="#olympiad"><b>Olympiad</b><span>Competitions, the IChO syllabus, practice problems and past papers.</span></a></div>
    </div>`;
  }

  const lectRow = l => `<li><a href="#${l.id}" class="${done.has(l.id) ? 'is-done' : ''}"><span class="tick">${TICK}</span><b>${l.code}</b><span>${esc(l.title)}</span><i>${Films.has(l.id) ? '<span class="film-dot">Film</span>' : Widgets.has(l.id) ? '<span class="live-dot">Live</span>' : `${l.mins} min`}</i></a></li>`;
  function vStage(S) {
    const d = stageDone(S);
    view.innerHTML = `<div class="page" style="${hue(S)}">${crumbs([['#chemistry', 'Chemistry'], ['', S.label]])}
      <div class="stage-head"><header class="page-head" style="margin:0"><p class="kicker">${S.years}</p><h1>${S.label} Chemistry</h1><p>${esc(S.sub)}. ${esc(S.source)}</p></header>
        <div class="stage-meta"><span>${d} of ${S.all.length} lectures done</span><div class="meter"><i style="--v:${pc(d, S.all.length)}%"></i></div><span>${plural(S.topics.length, 'topic')} · ${S.all.reduce((a, l) => a + l.ns, 0)} concepts · ${S.all.reduce((a, l) => a + l.q, 0)} questions</span></div></div>
      ${S.topics.map(T => `<section class="topic panel"><div class="topic-no"><b>${T.n}</b>${icon(T.domain)}</div><div class="topic-main"><h2><a href="#${T.hash}">${esc(T.title)}</a><small>${plural(T.lectures.length, 'lecture')}</small></h2><ol class="lect-list">${T.lectures.map(lectRow).join('')}</ol></div></section>`).join('')}
    </div>`;
  }

  function vTopic(T) {
    const S = T.stage, i = S.topics.indexOf(T), prev = S.topics[i - 1], next = S.topics[i + 1];
    view.innerHTML = `<div class="page" style="${hue(S)}">${crumbs([['#chemistry', 'Chemistry'], ['#' + S.hash, S.label], ['', 'Topic ' + T.n]])}
      <header class="page-head"><p class="kicker">${S.label} · Topic ${T.n}</p><h1>${esc(T.title)}</h1><p>${plural(T.lectures.length, 'lecture')} and ${T.lectures.reduce((a, l) => a + l.ns, 0)} concepts. Work through them in order.</p></header>
      <div class="cards">${T.lectures.map(l => `<a class="lcard panel" href="#${l.id}"><div class="lcard-top"><b>${l.code}</b>${done.has(l.id) ? `<span class="tick is-done">${TICK}</span>` : Films.has(l.id) ? '<span class="film-dot">Film</span>' : Widgets.has(l.id) ? '<span class="live-dot">Live</span>' : ''}</div><h3>${esc(l.title)}</h3><p>${esc(l.blurb)}</p><ul data-secs="${l.id}">${(l.secs || []).map(x => `<li>${inline(x)}</li>`).join('')}</ul><div class="lcard-foot"><span>${l.mins} min read</span><span>${plural(l.ns, 'concept')}</span><span>${plural(l.q, 'question')}</span></div></a>`).join('')}</div>
      <nav class="lect-nav" aria-label="Topics">${prev ? `<a href="#${prev.hash}"><small>Previous topic</small><b>${prev.n} · ${esc(prev.title)}</b></a>` : '<span></span>'}${next ? `<a href="#${next.hash}"><small>Next topic</small><b>${next.n} · ${esc(next.title)}</b></a>` : '<span></span>'}</nav>
    </div>`;
    stageData(S).then(() => { if (here(T.hash)) $$('[data-secs]', view).forEach(ul => { const l = BY[ul.dataset.secs]; if (l && l.secs && !ul.children.length) ul.innerHTML = l.secs.map(x => `<li>${inline(x)}</li>`).join(''); }); }).catch(() => { });
  }

  function quizHtml(rec) {
    let h = '';
    rec.c.forEach((q, i) => { h += `<div class="q" data-k="c" data-i="${i}"><div class="q-top"><p>${inline(q.q)}</p><i>1 mark</i></div><div class="opts">${q.o.map((o, k) => `<button type="button" data-o="${k}">${inline(o)}</button>`).join('')}</div><div class="fb" hidden></div></div>`; });
    rec.n.forEach((q, i) => { h += `<div class="q" data-k="n" data-i="${i}"><div class="q-top"><p>${inline(q.q)}</p><i>${plural(q.k, 'mark')}</i></div><div class="q-in"><input id="qn-${i}" type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer, as a number" placeholder="your answer"><button type="button" class="btn small" data-act="check">Check</button><button type="button" class="chip" data-act="work">Show working</button></div><div class="fb" hidden></div></div>`; });
    rec.q.forEach((q, i) => { h += `<div class="q" data-k="q" data-i="${i}"><div class="q-top"><p>${inline(q.q)}</p><i>${plural(q.k, 'mark')}</i></div><textarea id="qq-${i}" aria-label="Your answer" placeholder="Write your answer, then have it marked."></textarea><div class="q-in"><button type="button" class="btn small" data-act="mark">Mark my answer</button><button type="button" class="chip" data-act="model">Show mark scheme</button></div><div class="fb" hidden></div></div>`; });
    return h;
  }

  async function vLecture(L) {
    const S = L.stage, T = L.topic, k = S.all.indexOf(L), prev = S.all[k - 1], next = S.all[k + 1]; store.set('gc.last', L.id); CUR = null;
    const side = `<aside class="rail side" aria-label="Lectures in this topic"><div class="rail-box panel"><h4>${S.label} · Topic ${T.n}</h4>${T.lectures.map(l => `<a href="#${l.id}" class="${l === L ? 'is-on' : ''}${done.has(l.id) ? ' is-done' : ''}"><b>${l.code}</b><span>${esc(l.title)}</span></a>`).join('')}<h4 style="margin-top:10px">Go to</h4><a href="#${T.hash}" style="grid-template-columns:1fr">Topic ${T.n} overview</a><a href="#${S.hash}" style="grid-template-columns:1fr">All ${S.label} topics</a></div></aside>`;
    view.innerHTML = `<div class="lecture" style="${hue(S)}">${side}<article class="sheet">${crumbs([['#chemistry', 'Chemistry'], ['#' + S.hash, S.label], ['#' + T.hash, `${T.n} ${T.title}`], ['', L.code]])}
      <header class="lect-head" style="margin-top:14px"><div class="lect-tags"><span class="tag">${S.label} ${L.code}</span><span>${L.mins} min read</span><span>${plural(L.ns, 'concept')}</span><span>${plural(L.q, 'question')}</span>${Films.has(L.id) ? '<span class="film-dot">Film</span>' : ''}${Widgets.has(L.id) ? '<span class="live-dot">Live</span>' : ''}</div><h1>${esc(L.title)}</h1><div class="first-look" id="firstLook"><span class="lbl">First look</span>Loading the lecture…</div></header><div id="lectBody"></div></article>
      <aside class="rail toc" aria-label="In this lecture"><div class="rail-box panel" id="tocBox"><h4>In this lecture</h4></div></aside></div>`;
    let rec;
    try { rec = (await stageData(S))[L.id]; } catch (e) { rec = null; }
    if (!here(L.id)) return;
    if (!rec) { $('#firstLook').innerHTML = '<span class="lbl">Could not load</span>This lecture did not load. Check your connection and <a href="#' + L.id + '" data-act="retry">try again</a>.'; return; }
    CUR = { L, rec }; window.dispatchEvent(new Event('gc-view'));
    $('#tocBox').innerHTML = '<h4>In this lecture</h4>' + L.secs.map((x, i) => `<a href="#${L.id}" data-sec="${i + 1}"><span>${i + 1}. ${inline(x)}</span></a>`).join('');
    $('#firstLook').innerHTML = `<span class="lbl">First look</span>${inline(rec.s)}`;
    const figs = Widgets.list(L.id), isDone = done.has(L.id);
    $('#lectBody').innerHTML = `
      <div class="sec-chips" role="group" aria-label="Jump to a concept">${L.secs.map((s, i) => `<button type="button" class="chip" data-sec="${i + 1}">${i + 1}. ${esc(plain(s))}</button>`).join('')}</div>
      ${Films.of(L.id).map(n => `<div data-film="${n}"></div>`).join('')}
      ${figs.map(f => `<div class="fig" data-fig="${f}"></div>`).join('')}
      <div class="notes">${blocks(rec.b)}</div>
      ${rec.f.length ? `<section class="block"><h2>Formulas to know</h2><div class="formulas">${rec.f.map(f => `<div><span>${tex(f[0], false)}</span><span>${inline(f[1])}</span></div>`).join('')}</div></section>` : ''}
      ${rec.w.length ? `<section class="block"><h2>Watch out</h2><ul class="watch">${rec.w.map(w => `<li>${inline(w)}</li>`).join('')}</ul></section>` : ''}
      ${rec.m.length ? `<section class="block"><h2>What earns the marks <button type="button" class="chip" data-act="test" aria-pressed="false">Test yourself</button></h2><p class="sub">The wording that mark schemes reward. The highlighted words are the ones that score.</p><dl class="ms">${rec.m.map(m => `<div><dt>${inline(m[0])}</dt><dd>${inline(m[1])}</dd></div>`).join('')}</dl></section>` : ''}
      ${L.q ? `<section class="block"><h2>Check yourself</h2><p class="sub">Original questions in the exam style, marked here on your device.</p><div class="quiz">${quizHtml(rec)}</div></section>` : ''}
      <div class="done-row"><p>${isDone ? 'You have finished this lecture.' : 'Read it, tried the questions, understood it?'}</p><button type="button" class="btn small${isDone ? ' ghost' : ''}" data-act="done">${isDone ? 'Done ✓ (undo)' : 'Mark as done'}</button></div>
      <nav class="lect-nav" aria-label="Lectures">${prev ? `<a href="#${prev.id}"><small>Previous</small><b>${prev.code} · ${esc(prev.title)}</b></a>` : '<span></span>'}${next ? `<a href="#${next.id}"><small>Next</small><b>${next.code} · ${esc(next.title)}</b></a>` : `<a href="#${S.hash}"><small>End of ${S.label}</small><b>Back to all topics</b></a>`}</nav>`;
    $$('[data-fig]', view).forEach(el => Widgets.mount(el.dataset.fig, el));
    $$('[data-film]', view).forEach(el => cleanups.push(Films.mount(el, el.dataset.film)));
    if (window.IntersectionObserver) {
      const links = $$('.rail.toc a'), io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { const n = e.target.dataset.secno; links.forEach(a => a.classList.toggle('is-on', a.dataset.sec === n)); } }); }, { rootMargin: '-80px 0px -70% 0px' });
      $$('.notes h2').forEach(h => io.observe(h)); cleanups.push(() => io.disconnect());
    }
  }

  function vPT() {
    view.innerHTML = `<div class="page">${crumbs([['#chemistry', 'Chemistry'], ['', 'Periodic Table']])}<header class="page-head"><h1>Periodic Table</h1><p>Click an element to see its proton number, relative atomic mass, family and electronic configuration. Use the buttons to light up one part of the table at a time.</p></header><div class="panel" style="padding:20px"><div id="ptHost"></div></div></div>`;
    PT.mount($('#ptHost'), { wide: true });
  }

  function vDefs() {
    const fid = 'defFilter';
    view.innerHTML = `<div class="page">${crumbs([['#chemistry', 'Chemistry'], ['', 'Definitions']])}<header class="page-head"><h1>Definitions</h1><p>Every definition from every lecture. These are the ones worth learning word for word.</p></header>
      <div class="filterbar"><input id="${fid}" type="search" placeholder="Filter definitions" aria-label="Filter definitions" autocomplete="off">${IDX.stages.map(S => `<a class="chip" href="#definitions" data-jump="defs-${S.id}" style="${hue(S)}">${S.label}</a>`).join('')}</div>
      <div class="defs">${IDX.stages.map(S => { const n = S.all.reduce((a, l) => a + l.nd, 0); return n ? `<section id="defs-${S.id}" style="${hue(S)}"><h2>${S.label} <small style="font-size:14px;color:var(--ink-3)">${n}</small></h2><div class="def-list" data-defs="${S.id}"><p class="def-wait">Loading the ${S.label} definitions…</p></div></section>` : ''; }).join('')}</div></div>`;
    const input = $('#' + fid), apply = () => { const q = input.value.trim().toLowerCase(); $$('.def-item').forEach(a => a.hidden = !!q && !a.dataset.t.includes(q)); $$('.defs section').forEach(x => x.hidden = !!q && !$$('.def-item:not([hidden])', x).length); };
    input.addEventListener('input', apply);
    IDX.stages.forEach(S => { const box = $(`[data-defs="${S.id}"]`); if (!box) return; stageData(S).then(() => { if (!here('definitions') || !box.isConnected) return; box.innerHTML = S.all.flatMap(l => (l.defs || []).map(d => `<a class="def-item panel" href="#${l.id}" data-t="${esc((plain(d[0]) + ' ' + plain(d[1])).toLowerCase())}"><b>${inline(d[0])}</b><span>${inline(d[1])}</span><i>${S.label} ${l.code} · ${esc(l.title)}</i></a>`)).join(''); apply(); }).catch(() => { box.innerHTML = '<p class="def-wait">These definitions did not load. Check your connection and open this page again.</p>'; }); });
  }

  /* ---------- marking ---------- */
  function num(s) {
    const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻';
    s = String(s).replace(/[−–]/g, '-').replace(/,/g, '').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^' + [...m].map(c => SUP.indexOf(c) === 10 ? '-' : SUP.indexOf(c)).join('')).replace(/(\d(?:\.\d+)?)\s*[×x*]\s*10\s*\^?\s*\(?(-?\d+)\)?/i, '$1e$2');
    const m = /-?\d*\.?\d+(e-?\d+)?/i.exec(s); return m ? parseFloat(m[0]) : NaN;
  }
  const norm = s => ' ' + String(s).toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim() + ' ';
  function hit(text, keys) {
    if (!keys) return false;
    return keys.split(' & ').every(grp => { grp = grp.trim(); const neg = grp[0] === '!'; if (neg) grp = grp.slice(1);
      const any = grp.split('|').some(k => { k = k.trim(); const whole = k[0] === '='; if (whole) k = k.slice(1); const kn = norm(k).trim(); return kn && (whole ? text.includes(' ' + kn + ' ') : text.includes(kn)); });
      return neg ? !any : any; });
  }
  function onQuiz(e) {
    const qEl = e.target.closest('.q'); if (!qEl || !CUR) return false; const kind = qEl.dataset.k, i = +qEl.dataset.i, fb = $('.fb', qEl), rec = CUR.rec;
    const o = e.target.closest('[data-o]'), act = e.target.closest('[data-act]');
    if (kind === 'c' && o) {
      const q = rec.c[i], pick = +o.dataset.o, ok = pick === q.a; $$('.opts button', qEl).forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('is-right'); else if (k === pick) b.classList.add('is-wrong'); });
      fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${inline(q.y)}`; Snd.tick(ok); return true;
    }
    if (kind === 'n' && act) {
      const q = rec.n[i], steps = `<ol class="steps">${q.st.map(s => `<li>${inline(s.replace(/^[A-Z]\d\s+/, ''))}</li>`).join('')}</ol>`;
      if (act.dataset.act === 'work') { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = `<b>Working</b>${steps}<b>Answer: ${esc(q.a[0])}</b>`; return true; }
      const u = num($('input', qEl).value); if (isNaN(u)) { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = 'Type a number first, for example 0.25 or 2.4 × 10^3.'; return true; }
      const ok = q.a.some(a => { const v = num(a); return Math.abs(u - v) <= Math.abs(v) * 0.011 + 1e-12; });
      fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = ok ? `<b>Correct: ${esc(q.a[0])}.</b> ${plural(q.k, 'mark')}.${steps}` : `<b>Not yet.</b> Check your working and the sign, then try again, or press Show working.`; Snd.tick(ok); return true;
    }
    if (kind === 'q' && act) {
      const q = rec.q[i], txt = $('textarea', qEl).value.trim(), model = `<p style="margin-top:8px"><b>Model answer.</b> ${inline(q.a)}</p>`;
      if (act.dataset.act === 'model' || !txt) { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = `<b>Mark scheme${q.p.length > q.k ? `: any ${q.k} from` : ''}</b><ul class="pts">${q.p.map(p => `<li>${inline(p[0])}</li>`).join('')}</ul>${model}`; return true; }
      const t = norm(txt), hits = q.p.map(p => hit(t, p[1])), score = Math.min(q.k, hits.filter(Boolean).length);
      fb.hidden = false; fb.className = 'fb ' + (score === q.k ? 'ok' : score ? '' : 'no'); fb.innerHTML = `<b>${score} out of ${q.k}.</b>${q.p.length > q.k ? ` Any ${q.k} of these points score.` : ''}<ul class="pts">${q.p.map((p, k) => `<li class="${hits[k] ? 'hit' : 'miss'}">${inline(p[0])}</li>`).join('')}</ul>${model}<p style="margin-top:6px;color:var(--ink-3);font-size:14px">Marked by looking for key words, so check your answer against the model as well.</p>`; Snd.tick(score === q.k); return true;
    }
    return false;
  }

  startEl.addEventListener('click', e => { const j = e.target.closest('[data-jump]'); if (!j) return; e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  /* ---------- clicks inside the view ---------- */
  view.addEventListener('click', e => {
    const sec = e.target.closest('[data-sec]');
    if (sec) { e.preventDefault(); const h = $('#sec-' + sec.dataset.sec); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const jump = e.target.closest('[data-jump]'); if (jump) { e.preventDefault(); const t = document.getElementById(jump.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (onQuiz(e)) return;
    const act = e.target.closest('[data-act]'); if (!act) { const dd = e.target.closest('.ms.is-test dd'); if (dd) dd.classList.add('is-open'); return; }
    if (act.dataset.act === 'retry') { e.preventDefault(); route(); }
    if (act.dataset.act === 'test') { const ms = $('.ms', view), on = !ms.classList.contains('is-test'); ms.classList.toggle('is-test', on); $$('dd', ms).forEach(d => d.classList.remove('is-open')); act.textContent = on ? 'Show all answers' : 'Test yourself'; act.setAttribute('aria-pressed', on); act.classList.toggle('is-on', on); }
    if (act.dataset.act === 'done' && CUR) { const id = CUR.L.id; if (done.has(id)) done.delete(id); else done.add(id); store.set('gc.done', [...done]); const on = done.has(id); act.textContent = on ? 'Done ✓ (undo)' : 'Mark as done'; act.classList.toggle('ghost', on); act.previousElementSibling.textContent = on ? 'You have finished this lecture.' : 'Read it, tried the questions, understood it?'; $$('.rail.side a').forEach(a => { if (a.getAttribute('href') === '#' + id) a.classList.toggle('is-done', on); }); Snd.tick(on); }
  });

  /* ---------- router ---------- */
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    Widgets.clear(); cleanups.forEach(f => { try { f(); } catch (e) { } }); cleanups = []; CUR = null; closeSearch(); Olympiad.leave(view); if (window.LevelTest) LevelTest.leave(); document.title = 'Quilio';
    if (h === 'enter') { try { history.replaceState(null, '', '#start'); } catch (e) { } }
    window.dispatchEvent(new Event('gc-view'));
    if (!h || h === 'start' || h === 'enter') return startShow();
    startHide(); let st = null;
    if (h === 'home') vHub(); else if (h === 'chemistry') vChem(); else if (h === 'about-us') vAbout(); else if (h === 'developers') vDevs(); else if (h === 'periodic-table') vPT(); else if (h === 'definitions') vDefs(); else if (h.startsWith('olympiad')) Olympiad.render(view, h); else if (h === 'level-test' && window.LevelTest) LevelTest.render(view);
    else if (STAGE[h]) { vStage(STAGE[h]); st = h; } else if (TOPIC[h]) { vTopic(TOPIC[h]); st = TOPIC[h].stage.hash; } else if (BY[h]) { vLecture(BY[h]); st = BY[h].stage.hash; } else vChem();
    $$('#tabs a').forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + st));
    $$('.bar .tool[data-tool]').forEach(a => a.classList.toggle('is-on', a.dataset.tool === (h.startsWith('olympiad') ? 'olympiad' : h)));
    window.scrollTo(0, 0);
  }

  /* ---------- search ---------- */
  const qIn = $('#q'), resEl = $('#results');
  function closeSearch() { resEl.hidden = true; resEl.innerHTML = ''; }
  function search() {
    const toks = qIn.value.toLowerCase().split(/\s+/).filter(Boolean); if (!toks.length) return closeSearch();
    const out = SEARCH.filter(x => toks.every(t => x.hay.includes(t))).sort((a, b) => a.k - b.k || a.hay.indexOf(toks[0]) - b.hay.indexOf(toks[0])).slice(0, 12);
    resEl.hidden = false;
    resEl.innerHTML = out.length ? out.map((x, i) => `<a href="#${x.L.id}" class="${i ? '' : 'is-on'}" style="${hue(x.L.stage)}"><b>${x.L.stage.label} ${x.L.code}</b><span>${esc(plain(x.t))}${x.k ? `<em>${x.k === 2 ? 'definition' : 'concept'} in ${esc(x.L.title)}</em>` : ''}</span></a>`).join('') : '<div class="none">Nothing matches. Try a single word, such as “mole” or “alkene”.</div>';
  }
  qIn.addEventListener('input', search); qIn.addEventListener('focus', search);
  qIn.addEventListener('keydown', e => { if (e.key === 'Escape') { qIn.value = ''; closeSearch(); qIn.blur(); } if (e.key === 'Enter') { const a = $('a', resEl); if (a) { location.hash = a.getAttribute('href'); qIn.value = ''; closeSearch(); qIn.blur(); } } });
  resEl.addEventListener('click', () => { qIn.value = ''; setTimeout(closeSearch, 0); });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !bar.hidden) { e.preventDefault(); qIn.focus(); } });

  /* ---------- sound: off until asked for ---------- */
  const Snd = {
    on: false, ctx: null, master: null, nodes: [], timer: 0,
    toggle() { if (this.on) this.stop(); else this.start(); $$('.snd').forEach(b => b.setAttribute('aria-pressed', String(this.on))); },
    start() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const c = this.ctx = this.ctx || new AC(); if (c.resume) c.resume();
        const m = this.master = c.createGain(); m.gain.setValueAtTime(0, c.currentTime); m.gain.linearRampToValueAtTime(0.5, c.currentTime + 1.6); m.connect(c.destination);
        this.nodes = [174.61, 220, 261.63, 329.63].map((f, i) => { const o = c.createOscillator(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.028; l.frequency.value = 0.05 + i * 0.023; lg.gain.value = 0.018; l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(m); o.start(); l.start(); return [o, l]; });
        this.on = true;
        const bubble = () => { if (!this.on) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = [392, 440, 523.25, 587.33, 659.25, 783.99][Math.random() * 6 | 0]; o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.09); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17); o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.2); this.timer = setTimeout(bubble, 600 + Math.random() * 2400); };
        bubble();
      } catch (e) { this.on = false; }
    },
    stop() { this.on = false; clearTimeout(this.timer); try { const c = this.ctx, m = this.master, ns = this.nodes; m.gain.cancelScheduledValues(c.currentTime); m.gain.setValueAtTime(m.gain.value, c.currentTime); m.gain.linearRampToValueAtTime(0, c.currentTime + 0.4); setTimeout(() => { ns.forEach(p => p.forEach(o => { try { o.stop(); } catch (e) { } })); try { m.disconnect(); } catch (e) { } }, 500); } catch (e) { } },
    tick(good) { if (!this.on) return; try { const c = this.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(good === false ? 220 : good ? 880 : 660, t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.16); } catch (e) { } },
  };
  document.addEventListener('click', e => { if (e.target.closest('.snd')) Snd.toggle(); });

  /* ---------- the air behind every page: 39 N2, 10 O2, 1 Ar ---------- */
  function air() {
    const c = $('#air'), g = c.getContext('2d'), still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, M = []; let W = 0, H = 0, last = 0;
    const kinds = Array(39).fill('N').concat(Array(10).fill('O'), ['A']);
    function size() { const d = Math.min(window.devicePixelRatio || 1, 1.5); W = window.innerWidth; H = window.innerHeight; c.width = Math.round(W * d); c.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0); }
    size(); kinds.forEach(k => M.push({ k, x: Math.random() * W, y: Math.random() * H, a: Math.random() * 6.283, va: (Math.random() - .5) * .5, vx: (Math.random() - .5) * 16, vy: (Math.random() - .5) * 11, z: .55 + Math.random() * .95 }));
    function draw(dt) {
      g.clearRect(0, 0, W, H);
      for (const m of M) {
        m.x += m.vx * dt * m.z; m.y += m.vy * dt * m.z; m.a += m.va * dt; if (m.x < -30) m.x = W + 30; if (m.x > W + 30) m.x = -30; if (m.y < -30) m.y = H + 30; if (m.y > H + 30) m.y = -30;
        const r = (m.k === 'A' ? 7.5 : m.k === 'O' ? 5.8 : 6.2) * m.z, al = .2 + .22 * m.z; g.fillStyle = m.k === 'O' ? `rgba(255,238,214,${al})` : m.k === 'A' ? `rgba(236,226,255,${al + .1})` : `rgba(255,255,255,${al})`;
        if (m.k === 'A') { g.beginPath(); g.arc(m.x, m.y, r, 0, 6.283); g.fill(); } else { const dx = Math.cos(m.a) * r * .82, dy = Math.sin(m.a) * r * .82; g.beginPath(); g.arc(m.x - dx, m.y - dy, r, 0, 6.283); g.arc(m.x + dx, m.y + dy, r, 0, 6.283); g.fill(); }
      }
    }
    function frame(t) { requestAnimationFrame(frame); if (document.hidden || !startEl.hidden || t - last < 33) return; const dt = Math.min(.1, (t - last) / 1000); last = t; draw(dt); }
    window.addEventListener('resize', () => { size(); draw(0); }); draw(0); if (!still) requestAnimationFrame(frame);
  }

  /* ---------- Homepage menu: a small bar that drops under the Homepage button ---------- */
  const hpMenu = document.createElement('nav'); hpMenu.className = 'hp-menu'; hpMenu.hidden = true; hpMenu.setAttribute('aria-label', 'Homepage menu');
  hpMenu.innerHTML = `<a href="${FRESH_HOME}"><b>Fresh</b><span>All subjects</span></a><a href="${window.GEO_HOME || '#home'}"><b>Home</b><span>Physics and Chemistry, side by side</span></a><a href="${PHYSICS_URL}"><b>Geodesic</b><span>The physics site</span></a><a href="#start"><b>Chemistry site</b><span>The chemistry home screen</span></a><a href="#olympiad"><b>Olympiad</b><span>Competitions and practice</span></a><a href="#level-test"><b>Level Test</b><span>30 questions to find where to start</span></a><a href="#about-us"><b>About this site</b><span>How it is organised</span></a><a href="#developers"><b>Developer</b><span>Who builds it</span></a>`;
  document.body.append(hpMenu);
  document.addEventListener('click', e => {
    const b = e.target.closest('.hp');
    if (!b) { hpMenu.hidden = true; return; }
    e.preventDefault(); if (!hpMenu.hidden) { hpMenu.hidden = true; return; }
    const r = b.getBoundingClientRect(); hpMenu.style.left = Math.max(8, r.left) + 'px'; hpMenu.style.top = (r.bottom + 8) + 'px'; hpMenu.hidden = false;
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hpMenu.hidden = true; });

  // shown inside the ΦΥΣΙΣ home page's frame: "Home" and the address are the outer page's to change
  if (window.GEO_EMBED) {
    const tell = m => { try { window.parent.postMessage(m, location.origin); } catch (e) { } };
    document.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; const h = a.getAttribute('href') || ''; if (h === window.GEO_HOME) { e.preventDefault(); tell({ gc: 'home' }); } else if (h.startsWith('https://claude.ai/') && !a.target) { e.preventDefault(); try { window.parent.location.href = h; } catch (er) { location.href = h; } } }, true);
    window.addEventListener('hashchange', () => tell({ gc: 'hash', h: location.hash.slice(1) }));
  }
  window.GC = { tex, inline, plain, esc, store, done, ALL, BY, cur: () => CUR, stageData, get IDX() { return IDX; } };

  /* ---------- boot ---------- */
  async function boot() {
    try { const r = await fetch('data/tree.json'); if (!r.ok) throw new Error(r.status); IDX = await r.json(); }
    catch (e) { startEl.hidden = true; view.hidden = false; view.innerHTML = '<div class="page"><div class="panel" style="padding:26px"><h1 style="font-size:28px;margin-bottom:8px">The lecture list did not load</h1><p>Check your connection, then reload the page.</p></div></div>'; window.dispatchEvent(new Event('fresh-science-error')); return; }
    IDX.stages.forEach(S => { STAGE[S.hash] = S; S.all = []; S.topics.forEach(T => { T.stage = S; T.hash = `${S.hash}-t${T.n}`; TOPIC[T.hash] = T; T.lectures.forEach(L => { L.stage = S; L.topic = T; BY[L.id] = L; S.all.push(L); ALL.push(L); SEARCH.push({ L, t: L.title, k: 0, hay: `${L.code} ${L.title} ${S.label}`.toLowerCase() }); }); }); });
    $('#stagePick').innerHTML = IDX.stages.map(S => `<a href="#${S.hash}" style="${hue(S)}"><b>${S.label}</b><i>${S.years}</i><i>${plural(S.all.length, 'lecture')}</i></a>`).join('');
    $('#tabs').innerHTML = IDX.stages.map(S => `<a href="#${S.hash}" style="${hue(S)}">${S.label}</a>`).join('');
    air(); window.addEventListener('hashchange', route); route();
    window.dispatchEvent(new Event('fresh-science-ready'));   // hides Fresh's loading screen and starts the entrance film
    // fetch the remaining stages quietly, one after another, so that search and the definitions list cover everything
    setTimeout(() => IDX.stages.reduce((p, S) => p.then(() => stageData(S)).catch(() => { }), Promise.resolve()), 1800);
  }
  boot();
})();
