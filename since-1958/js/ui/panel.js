// Right-hand panel: list of hardware on a body, a five-chapter story for one object,
// or the Earth mission log. Time-dependent bits are refreshed from the simulation clock.

import { EQUIPMENT, CHAPTER_TITLES, STATES, stateAt } from '../../data/equipment.js';
import { EVENTS } from '../../data/events.js';
import { fmtDate, fmtDateTime, fmtLatLon, fmtDist, esc } from './format.js';
import { PROBES, WORLD_NOTES } from '../../data/probes.js';
import { BODIES, WORLD_IDS } from '../config.js';
import { scenesFor } from '../scene/scenes.js';
import { homeLines } from './voyagermsg.js';

const NAMES = { moon: 'The Moon', mars: 'Mars', earth: 'Earth' };
const PART_LABELS = {
  lm: 'Descent stage', lrv: 'Lunar Roving Vehicle', alsep: 'Science station', lrrr: 'Laser retroreflector',
  flag: 'Flag', easep: 'Seismometer', surveyor: 'Surveyor', msl: 'Curiosity', m2020: 'Perseverance',
};
/** Parts worth a button: everything with a label except tiny decorations. */
function partList(q) {
  return (q.parts || []).map((p, i) => ({ i, label: p.exhibitOnly ? null : (p.label || PART_LABELS[p.type]) })).filter((p) => p.label);
}
const COLORS = { moon: 'var(--moon)', mars: 'var(--mars)', earth: 'var(--earth)', space: 'var(--deep)' };
const PLACE = { earth: 'Earth', moon: 'Moon', mars: 'Mars', space: 'Deep space' };

// The only places where people have landed and walked: the six Apollo landings.
export const CREWED = new Set(['apollo11', 'apollo12', 'apollo14', 'apollo15', 'apollo16', 'apollo17']);

/** the machine search box: on the home panel and on every world's panel */
const SEARCH = '<div class="psearch"><input type="search" class="ps-in" placeholder="Search a machine: Apollo 11, Voyager, Curiosity…" aria-label="Search a machine" autocomplete="off"><div class="ps-out"></div></div>';

export class Panel {
  constructor(el, handlers) {
    this.el = el;
    this.h = handlers;           // { onSelect(eq), onBody(bodyId), onClose(), onJump(ms, eq?) }
    this.view = null;            // { kind: 'body'|'eq'|'log', bodyId, eq, chapter }
    this.key = '';
    el.addEventListener('click', (e) => this._click(e));
    el.addEventListener('input', (e) => { if (e.target.matches('.ps-in')) this._search(e.target); });
    el.addEventListener('keydown', (e) => { if (e.target.matches('.ps-in')) { e.stopPropagation(); if (e.key === 'Enter') { const b = e.target.parentElement.querySelector('[data-act="obj3d"]'); if (b) b.click(); } } });
  }

  get open() { return !this.el.hidden; }

  /** Closing a view returns to the travel list: the panel is always there as the way to get around. */
  hide() { this.showHome(this.lastMs ?? 0); }

  showHome(ms) {
    this.view = { kind: 'home', bodyId: 'home' };
    this.render(ms, null, true);
  }

  showBody(bodyId, ms) {
    this.view = { kind: 'body', bodyId };
    this.render(ms, null, true);
  }

  showEquipment(eq, ms, eph) {
    const same = this.view && this.view.kind === 'eq' && this.view.eq === eq;
    this.view = { kind: 'eq', bodyId: eq.body, eq, chapter: same ? this.view.chapter : 0 };
    this.render(ms, eph, true);
  }

  /** A probe in flight: same five-chapter story, plus ride-along and flyby buttons. */
  showProbe(def, ms, eph) {
    const same = this.view && this.view.kind === 'probe' && this.view.eq === def;
    this.view = { kind: 'probe', bodyId: 'space', eq: def, chapter: same ? this.view.chapter : 0 };
    this.render(ms, eph, true);
  }

  /** A world with no NASA hardware on it: a short note and the probes that came by. */
  showPlanet(id, ms, eph) {
    this.view = { kind: 'planet', bodyId: 'space', world: id };
    this.render(ms, eph, true);
  }

  showLog(ms) {
    this.view = { kind: 'log', bodyId: 'earth' };
    this.render(ms, null, true);
  }

  /** Re-render only when something visible has changed. */
  refresh(ms, eph) {
    if (!this.view) return;
    this.render(ms, eph, false);
  }

  render(ms, eph, force) {
    const v = this.view;
    if (!v) return;
    this.lastMs = ms;
    if (eph) this.lastEph = eph;
    eph = eph || this.lastEph;
    let key, html;
    if (v.kind === 'body') {
      const list = EQUIPMENT.filter((q) => q.body === v.bodyId);
      const here = list.filter((q) => Date.parse(q.arrival) <= ms);
      key = `body|${v.bodyId}|${here.map((q) => q.id + (stateAt(q, ms)?.state || '')).join(',')}|${Math.floor(ms / 3.6e6)}`;
      if (!force && key === this.key) return;
      html = this._bodyHTML(v.bodyId, list, here, ms);
    } else if (v.kind === 'eq') {
      const st = stateAt(v.eq, ms);
      const sun = eph ? eph[v.eq.body].sunElevation(v.eq.lat, v.eq.lon) : null;
      key = `eq|${v.eq.id}|${v.chapter}|${st ? st.t : ''}|${sun == null ? '' : Math.round(sun)}|${Math.floor(ms / 6e4)}`;
      if (!force && key === this.key) return;
      html = this._eqHTML(v.eq, st, ms, sun, v.chapter);
    } else if (v.kind === 'home') {
      const next = EVENTS.find((e) => e.ms > ms);
      const counts = ['moon', 'mars'].map((b) => EQUIPMENT.filter((q) => q.body === b && Date.parse(q.arrival) <= ms).length);
      key = `home|${counts}|${next ? next.t : ''}|${PROBES.map((p) => (ms >= p.launchMs ? (p.endMs && ms >= p.endMs ? 2 : 1) : 0)).join('')}`;
      if (!force && key === this.key) return;
      html = this._homeHTML(ms, next, counts);
    } else if (v.kind === 'probe') {
      const st = stateAt(v.eq, ms);
      key = `probe|${v.eq.id}|${v.chapter}|${st ? st.t : ''}|${Math.floor(ms / 3.6e6)}`;
      if (!force && key === this.key) return;
      html = this._probeHTML(v.eq, st, ms, eph, v.chapter);
    } else if (v.kind === 'planet') {
      key = `planet|${v.world}|${Math.floor(ms / 8.64e7)}`;
      if (!force && key === this.key) return;
      html = this._planetHTML(v.world, ms, eph);
    } else {
      const past = EVENTS.filter((e) => e.ms <= ms);
      key = `log|${past.length}`;
      if (!force && key === this.key) return;
      html = this._logHTML(past.slice().reverse(), ms);
    }
    this.key = key;
    const scroll = this.el.scrollTop, si = this.el.querySelector('.ps-in'), sv = si ? si.value : '', sf = si && document.activeElement === si;
    this.el.dataset.body = v.bodyId;
    this.el.innerHTML = html;
    { const ni = this.el.querySelector('.ps-in'); if (ni && sv) { ni.value = sv; this._search(ni); } if (ni && sf) ni.focus(); }
    this.el.hidden = false;
    if (!force) this.el.scrollTop = scroll;
  }

  _top(back) {
    return `<div class="p-top"><span class="p-crumbs"><button class="p-back" data-act="home">All places</button>${back ? `<button class="p-back" data-act="back">${esc(back.replace('Back to ', ''))}</button>` : ''}</span>
      <button class="p-close" data-act="close" aria-label="Back to all places">×</button></div>`;
  }

  /** The travel list: every world and probe one click away, and a jump to the next event. */
  _homeHTML(ms, next, counts) {
    const dot = (c) => `<i style="background:${c}"></i>`;
    const world = (id) => { const n = id === 'moon' ? counts[0] : id === 'mars' ? counts[1] : 0; return `<button data-act="world" data-id="${id}">${dot(BODIES[id].color)}<span>${BODIES[id].name}</span>${n ? `<b>${n}</b>` : ''}</button>`; };
    const main = ['earth', 'moon', 'mars'], rest = WORLD_IDS.filter((id) => !main.includes(id));
    const probe = (p) => { const pre = ms < p.launchMs, gone = p.endMs && ms >= p.endMs; return `<button data-act="world" data-id="${p.id}" class="${pre || gone ? 'dim' : ''}">${dot(p.color)}<span>${esc(p.name)}</span>${pre ? `<em>${new Date(p.launchMs).getUTCFullYear()}</em>` : gone ? '<em>ended</em>' : ''}</button>`; };
    const feat = [['apollo', '1', 'Apollo 11', 'The whole flight, as a film · start here'], ['voyager', '2', 'Voyager 1, up close', 'In its real materials'], ['percy', '3', 'Perseverance', 'Seven minutes to land'], ['webb', '4', 'James Webb', 'How it works']];
    return `<div class="home">
      <h3 class="home-h">Home</h3>
      <p class="home-sum"><span><b>${EQUIPMENT.length}</b>sites on the Moon and Mars</span><span><b>${PROBES.length}</b>probes</span><span><b>${this.exhibitCount || 44}</b>exhibits</span><span><b>${this.filmCount || 30}</b>films</span></p>
      <div class="featbox"><p class="fb-h">Featured animations</p><div class="fb-grid">${feat.map(([id, n, t, s]) => `<button data-act="feat" data-id="${id}" class="new${id === 'apollo' ? ' first' : ''}"><i>${n}</i><b>${t}</b><span>${s}</span></button>`).join('')}</div></div>
      <div class="vmbox"><p class="vm-h">✉️ Message to Voyager</p><b>In 2017, more than 30,000 people wrote to Voyager 1 through NASA. Write yours today, and follow it out at the speed of light.</b><span class="vm-live">${esc(homeLines())}</span><button class="btn" data-act="vmsg">Write to Voyager 1 →</button><a class="vm-sb" href="https://svs.gsfc.nasa.gov/15111" target="_blank" rel="noopener"><i>✦</i><span><b>Shine Bright for Voyager’s Light-Day</b>NASA asks everyone to flash V‑G‑R in Morse code at the sky after sunset on 17 November 2026.</span></a></div>
      <button class="filmsbtn" data-act="films"><b>🎞️ All ${this.filmCount || 30} films</b><span>Every big moment from 1964 to 2022, as a short film</span></button>
      <button class="filmsbtn lrbtn" data-act="learned"><b>🧭 What we learned making this</b><span>About the machines, NASA’s data, building it and telling the story</span></button>
      ${next ? `<div class="nextbox"><span class="nb-k">Nearest future event</span><b class="nb-t">${esc(next.title)}</b><button class="btn go" data-act="nextev">Jump to ${fmtDate(next.ms)} →</button></div>` : ''}
      <h3>Find a machine</h3>
      ${SEARCH}
      <h3>Travel to</h3>
      <div class="travel big">${main.map(world).join('')}</div>
      <div class="travel">${rest.map(world).join('')}</div>
      <h3>Ride a probe</h3>
      <div class="travel two">${PROBES.map(probe).join('')}</div>
      <h3>All events</h3>
      <ul class="list evall">${EVENTS.map((e, i) => `<li><button data-act="event" data-i="${i}" class="${next && e === next ? 'isnext' : ''}">
        <span class="n">${esc(e.title)}</span><span class="y">${new Date(e.ms).getUTCFullYear()}</span>
        <span class="s">${fmtDate(e.ms)}${next && e === next ? ' · next' : ''}</span></button></li>`).join('')}</ul>
    </div>`;
  }

  _bodyHTML(bodyId, list, here, ms) {
    const later = list.filter((q) => !here.includes(q)).sort((a, b) => Date.parse(a.arrival) - Date.parse(b.arrival));
    here = here.slice().sort((a, b) => Date.parse(a.arrival) - Date.parse(b.arrival));
    const item = (q, future) => {
      const st = stateAt(q, ms);
      const s = st ? STATES[st.state] : null;
      return `<li><button data-act="${future ? 'jump' : 'select'}" data-id="${q.id}">
        <span class="n">${esc(q.name)}</span><span class="y">${new Date(q.arrival).getUTCFullYear()}</span>
        <span class="s">${future ? `<span class="jump">Go to ${fmtDate(Date.parse(q.arrival))} and watch it arrive</span>`
          : `<span class="pill" style="--sc:${s.color}">${s.label}</span> ${esc(q.short)}`}</span></button>
        ${q.id === 'apollo11' ? `<div class="pick"><button data-act="landing" data-id="apollo11">1. Watch the landing</button><button data-act="film">2. Watch the film</button><button data-act="echo" class="laser">3. Fire a laser at its mirror</button></div>` : ''}</li>`;
    };
    const first = later[0];
    const jump = first ? `<div class="nextbox"><span class="nb-k">Nearest future event here</span><b class="nb-t">${esc(first.name)} arrives</b><button class="btn go" data-act="jump" data-id="${first.id}">Jump to ${fmtDate(Date.parse(first.arrival))} →</button></div>` : '';
    return `${this._top(null)}
      <h2>${NAMES[bodyId]}</h2>
      <p class="sub">${here.length} ${here.length === 1 ? 'site' : 'sites'} with NASA hardware on ${fmtDate(ms)}</p>
      ${SEARCH}
      ${jump}
      <ul class="list">${here.map((q) => item(q, false)).join('')}${later.map((q) => item(q, true)).join('')}</ul>`;
  }

  _eqHTML(q, st, ms, sun, chapter) {
    const arrived = Date.parse(q.arrival) <= ms;
    const s = st ? STATES[st.state] : null;
    const sunText = sun == null ? '' : sun > 0.3 ? `Sun ${sun.toFixed(1)}° above the horizon here` : sun > -0.3 ? 'Sun on the horizon here' : 'Night here: the Sun is below the horizon';
    const chapters = CHAPTER_TITLES.map((t, i) => `<button data-act="ch" data-i="${i}" aria-current="${i === chapter}" aria-label="Chapter ${i + 1}: ${t}">${i + 1}</button>`).join('');
    const now = chapter === 5 ? this._statusHTML(q, st, ms, arrived, 'arrived') : '';
    return `${this._top(`Back to ${NAMES[q.body]}`)}
      <h2>${esc(q.name)}</h2>
      <p class="sub">${esc(q.short)}</p>
      ${q.away && arrived ? `<p class="away"><b>Not here today</b>${esc(q.away)}</p>` : ''}
      <div class="meta">${arrived && s ? `<span class="pill" style="--sc:${s.color}">${s.label}</span>` : ''}
        <span>${arrived ? 'Arrived' : 'Arrives'} ${fmtDate(Date.parse(q.arrival))}</span><span>${fmtLatLon(q.lat, q.lon)}</span></div>
      <div class="row big-acts"><button class="btn obj big" data-act="object">View object in 3D</button>
        ${arrived ? `<button class="btn walk big" data-act="walk" title="${CREWED.has(q.id) ? 'Astronauts really walked here' : 'Nobody has ever walked here: this is what it would be like'}">Walk here</button>` : ''}</div>
      <div class="row wrap">${arrived ? '' : `<button class="btn go" data-act="jump" data-id="${q.id}">Go to ${fmtDate(Date.parse(q.arrival))}</button>`}
        ${q.id === 'curiosity' || q.id === 'perseverance' ? `<button class="btn filmb" data-act="film" data-id="${q.id}">Watch its film</button>` : ''}
        ${arrived && q.route ? `<button class="btn drive" data-act="drive" title="Follow its real route, from NASA's map of its ${q.route === 'ingenuity' ? 'flights' : 'drives'}">▶︎ ${q.route === 'ingenuity' ? 'Fly' : 'Drive'} its route</button>` : ''}
        ${sun != null && sun < 2 && !q.dark && arrived ? '<button class="btn" data-act="sunrise" title="' + sunText + '">Skip to sunrise here</button>' : ''}</div>
      ${arrived && partList(q).length > 1 ? `<div class="here"><span>Look at</span>${partList(q).map((p) => `<button class="chip" data-act="part" data-i="${p.i}">${esc(p.label)}</button>`).join('')}</div>` : ''}
      ${arrived ? this._sceneButtons(q) : ''}
      ${q.verified ? '' : '<p class="draft">Draft text: the team still has to check every fact against NASA sources.</p>'}
      <div class="chapters" role="tablist" aria-label="Story chapters">${chapters}</div>
      <div class="ch-title">${CHAPTER_TITLES[chapter]}</div>
      ${chapter < 5 ? `<p class="ch-text">${esc(q.chapters[chapter])}</p>` : ''}
      ${now}
      <div class="ch-nav">
        <button class="btn" data-act="ch" data-i="${chapter - 1}" ${chapter === 0 ? 'disabled style="visibility:hidden"' : ''}>Previous</button>
        <button class="btn" data-act="ch" data-i="${chapter + 1}" ${chapter === 5 ? 'disabled style="visibility:hidden"' : ''}>Next: ${CHAPTER_TITLES[Math.min(5, chapter + 1)]}</button>
      </div>
      <div class="sources">Sources
        ${q.sources.map((s2) => `<a href="${s2.url}" target="_blank" rel="noopener">${esc(s2.label)}</a>`).join('')}
      </div>`;
  }

  /** Chapter 6: what the machine is doing on the simulation's date, and every change of state NASA recorded. */
  _statusHTML(q, st, ms, started, verb) {
    const s = st ? STATES[st.state] : null, tl = q.timeline || [], last = tl[tl.length - 1];
    const head = started && st
      ? `<div class="stt-now"><span class="stt-k">On ${fmtDate(ms)}</span><span class="pill big" style="--sc:${s.color}">${s.label}</span><p>${esc(st.label)}.</p></div>`
      : `<div class="stt-now"><span class="stt-k">On ${fmtDate(ms)}</span><p>It has not ${verb} yet.${q.launchMs || q.arrival ? ` That happens on <b>${fmtDate(q.launchMs || Date.parse(q.arrival))}</b>.` : ''}</p></div>`;
    const rows = tl.map((e) => {
      const at = Date.parse(e.t), cur = st && e === st, later = at > ms, c = STATES[e.state];
      return `<li class="${cur ? 'cur' : ''}${later ? ' later' : ''}"><time>${fmtDate(at)}</time><span class="pill" style="--sc:${c.color}">${c.label}</span><span class="stt-l">${esc(e.label)}</span></li>`;
    }).join('');
    const latest = last && st !== last ? `<p class="stt-last">Latest state in NASA's record: <span class="pill" style="--sc:${STATES[last.state].color}">${STATES[last.state].label}</span> since ${fmtDate(Date.parse(last.t))}. Move the clock forward to get there.</p>` : '';
    return `${head}${tl.length ? `<div class="stt-k stt-h">Every change of state</div><ol class="stt-list">${rows}</ol>` : ''}${latest}`;
  }

  _sceneButtons(q) {
    const sc = scenesFor(q);
    if (!sc.land && !sc.end) return '';
    return `<div class="here scenes"><span>Watch</span>${sc.land ? '<button class="chip play" data-act="scene" data-i="0">The arrival</button>' : ''}${
      sc.end ? `<button class="chip play" data-act="scene" data-i="${sc.end.i}">${sc.end.label.replace('Watch ', '').replace(/^./, (c) => c.toUpperCase()).replace(/^It fall /, 'It falls ')}</button>` : ''}</div>`;
  }

  _probeHTML(q, st, ms, eph, chapter) {
    const launched = ms >= q.launchMs, gone = q.endMs && ms >= q.endMs;
    const s = st ? STATES[st.state] : null;
    const b = eph && eph[q.id];
    // distance from the Sun for the line above; the radio signal travels from the probe to the Earth, so that time uses the Earth distance
    const km = b ? b.pos.length() : 0, kmE = b && eph.earth ? b.pos.distanceTo(eph.earth.pos) : km, mins = kmE / 299792.458 / 60;
    const secs = mins * 60, light = secs < 1 ? `${secs.toFixed(2)} s` : secs < 90 ? `${Math.round(secs)} s` : mins < 90 ? `${Math.round(mins)} min` : `${Math.floor(Math.round(mins) / 60)} h ${Math.round(mins) % 60} min`;
    const chapters = CHAPTER_TITLES.map((t, i) => `<button data-act="ch" data-i="${i}" aria-current="${i === chapter}" aria-label="Chapter ${i + 1}: ${t}">${i + 1}</button>`).join('');
    const now = chapter === 5 ? this._statusHTML(q, st, ms, launched, 'launched') : '';
    const flybys = q.fly.map((f, i) => `<button class="chip play" data-act="flyby" data-id="${q.id}" data-i="${i}" title="Go to ${fmtDate(f.t)} and watch ${esc(q.name)} arrive at ${BODIES[f.body].name}">▶︎ Arrive at ${BODIES[f.body].name} · ${new Date(f.t).getUTCFullYear()}</button>`).join('');
    return `${this._top(null)}
      <h2>${esc(q.name)}</h2>
      <p class="sub">${esc(q.short)}</p>
      <div class="meta">${launched && s ? `<span class="pill" style="--sc:${s.color}">${s.label}</span>` : '<span>Not launched yet</span>'}
        <span>${launched ? 'Launched' : 'Launches'} ${fmtDate(q.launchMs)}</span></div>
      ${launched && !gone ? `<div class="meta"><span>${fmtDist(km)} from the Sun</span><span>A radio signal takes ${light} to reach the Earth</span></div>` : ''}
      <div class="row wrap"><button class="btn go" data-act="ride" data-id="${q.id}">${launched && !gone ? 'Ride along' : gone ? 'Ride its last weeks' : `Go to ${fmtDate(q.launchMs)}`}</button>
        <button class="btn obj big" data-act="object">View object in 3D</button>
        ${['voyager1', 'hubble', 'jwst'].includes(q.id) ? `<button class="btn filmb" data-act="film" data-id="${q.id}">Watch its film</button>` : ''}</div>
      ${q.fly.length ? `<div class="here scenes"><span>Jump to an arrival</span>${flybys}</div>` : ''}
      ${q.verified ? '' : '<p class="draft">Draft text: check every fact against NASA sources. The flight path between planets is simplified.</p>'}
      <div class="chapters" role="tablist" aria-label="Story chapters">${chapters}</div>
      <div class="ch-title">${CHAPTER_TITLES[chapter].replace('Why it stayed', 'Why it never came back')}</div>
      ${chapter < 5 ? `<p class="ch-text">${esc(q.chapters[chapter])}</p>` : ''}
      ${now}
      <div class="ch-nav">
        <button class="btn" data-act="ch" data-i="${chapter - 1}" ${chapter === 0 ? 'disabled style="visibility:hidden"' : ''}>Previous</button>
        <button class="btn" data-act="ch" data-i="${chapter + 1}" ${chapter === 5 ? 'disabled style="visibility:hidden"' : ''}>Next: ${CHAPTER_TITLES[Math.min(5, chapter + 1)].replace('Why it stayed', 'Why it never came back')}</button>
      </div>
      <div class="sources">Sources
        ${q.sources.map((s2) => `<a href="${s2.url}" target="_blank" rel="noopener">${esc(s2.label)}</a>`).join('')}
      </div>`;
  }

  _planetHTML(id, ms, eph) {
    const def = BODIES[id], b = eph && eph[id];
    const visits = [];
    for (const p of PROBES) p.fly.forEach((f, i) => { if (f.body === id) visits.push({ p, f, i }); });
    visits.sort((a, c) => a.f.t - c.f.t);
    return `${this._top(null)}
      <h2>${esc(def.name)}</h2>
      <p class="sub">${id === 'sun' ? 'Our star' : 'No NASA hardware rests here'}</p>
      ${SEARCH}
      <div class="meta"><span>Radius ${Math.round(def.radius).toLocaleString('en-US')} km</span>${b && id !== 'sun' ? `<span>${fmtDist(b.pos.length())} from the Sun on ${fmtDate(ms)}</span>` : ''}</div>
      <p class="ch-text">${esc(WORLD_NOTES[id] || '')}</p>
      ${visits.length ? `<div class="ch-title">Probes that flew past</div><ul class="list">${visits.map(({ p, f, i }) => `<li><button data-act="flyby" data-id="${p.id}" data-i="${i}">
        <span class="n">${esc(p.name)}</span><span class="y">${new Date(f.t).getUTCFullYear()}</span>
        <span class="s"><span class="jump">Ride ${esc(p.name)} past ${esc(def.name)}</span></span></button></li>`).join('')}</ul>` : ''}`;
  }

  _logHTML(past, ms) {
    return `${this._top(null)}
      <h2>Earth</h2>
      <p class="sub">Every machine in this story left from here. Mission log up to ${fmtDate(ms)}:</p>
      ${SEARCH}
      <ul class="log">${past.map((e) => `<li><div class="d">${fmtDateTime(e.ms)}</div>
        <div class="t" style="--c2:${COLORS[e.body]}"><i>${PLACE[e.body]}</i>, ${esc(e.title)}</div></li>`).join('')}</ul>`;
  }

  /** the search box: every machine whose name (or mission, or place) matches, each with its three ways in */
  _search(input) {
    const out = input.parentElement.querySelector('.ps-out'), w = input.value.trim().toLowerCase();
    if (!w) { out.innerHTML = ''; return; }
    const ALL = [...EQUIPMENT, ...PROBES], score = (q) => { const n = q.name.toLowerCase(); return n.startsWith(w) ? 0 : n.includes(w) ? 1 : 2; };
    const hits = ALL.filter((q) => [q.name, q.mission, q.short, q.isProbe ? 'probe' : q.body].some((t) => t && String(t).toLowerCase().includes(w))).sort((a, b) => score(a) - score(b)).slice(0, 6);
    out.innerHTML = hits.length ? hits.map((q) => {
      const when = q.isProbe ? q.launchMs : Date.parse(q.arrival), where = q.isProbe ? 'Probe' : q.body === 'moon' ? 'The Moon' : 'Mars';
      return `<div class="ps-card"><b>${esc(q.name)}</b><span>${where} · ${q.isProbe ? 'launched' : 'arrived'} ${fmtDate(when)}</span><i>${esc(q.short || '')}</i>
        <div class="ps-row"><button data-act="obj3d" data-id="${q.id}">View in 3D</button><button data-act="objgo" data-id="${q.id}">Go to ${q.isProbe ? 'its launch' : 'its landing'} →</button><button data-act="objprof" data-id="${q.id}">Profile</button></div></div>`;
    }).join('') : '<p class="ps-none">Nothing by that name. Try "Apollo", "Mars" or "Voyager".</p>';
  }

  _click(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    const v = this.view;
    if (act === 'close' || act === 'home') { this.hide(); this.h.onClose && this.h.onClose(); }
    else if (act === 'world') this.h.onBody(b.dataset.id);
    else if (act === 'obj3d' || act === 'objgo' || act === 'objprof') { const q = [...EQUIPMENT, ...PROBES].find((x) => x.id === b.dataset.id); if (q && this.h.onObj) this.h.onObj(act, q); }
    else if (act === 'nextev') this.h.onNextEvent();
    else if (act === 'echo') this.h.onEcho && this.h.onEcho();
    else if (act === 'feat') this.h.onFeatured && this.h.onFeatured(b.dataset.id);
    else if (act === 'vmsg') this.h.onMessage && this.h.onMessage();
    else if (act === 'films') this.h.onFilms && this.h.onFilms();
    else if (act === 'learned') this.h.onLearned && this.h.onLearned();
    else if (act === 'event') this.h.onEvent(EVENTS[+b.dataset.i]);
    else if (act === 'walk' && v && v.eq) this.h.onWalk(v.eq);
    else if (act === 'drive' && v && v.eq) this.h.onDrive(v.eq);
    else if (act === 'object' && v && v.eq) this.h.onObject(v.eq);
    else if (act === 'back' && v) this.h.onBody(v.bodyId);
    else if (act === 'select') this.h.onSelect(EQUIPMENT.find((q) => q.id === b.dataset.id));
    else if (act === 'sunrise' && v && v.eq) this.h.onSunrise(v.eq);
    else if (act === 'part' && v && v.eq) this.h.onPart(v.eq, v.eq.parts[+b.dataset.i]);
    else if (act === 'landing') this.h.onLanding(b.dataset.id);
    else if (act === 'film') this.h.onFilm(b.dataset.id);
    else if (act === 'jump') { const q = EQUIPMENT.find((x) => x.id === b.dataset.id); this.h.onJump(Date.parse(q.arrival), q); }
    else if (act === 'scene' && v && v.eq) this.h.onScene(v.eq, +b.dataset.i);
    else if (act === 'ride') this.h.onRide(PROBES.find((x) => x.id === b.dataset.id));
    else if (act === 'flyby') this.h.onFlyby(PROBES.find((x) => x.id === b.dataset.id), +b.dataset.i);
    else if (act === 'ch' && v && (v.kind === 'eq' || v.kind === 'probe')) {
      const i = +b.dataset.i;
      if (i >= 0 && i <= 5) { v.chapter = i; this.render(this.lastMs ?? Date.now(), this.lastEph, true); }
    }
  }
}
