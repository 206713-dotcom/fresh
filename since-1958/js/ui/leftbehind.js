// The "Left behind" card: shown at the end of each featured animation (and after the Apollo 11 film). It answers what
// was left, why, what it still gives us, and its state today, with buttons to go and see it. Data: data/leftbehind.js.
import { LEFT_BEHIND } from '../../data/leftbehind.js';
import { EQUIPMENT, STATES, stateAt } from '../../data/equipment.js';
import { PROBES } from '../../data/probes.js';
import { esc, fmtDate } from './format.js';

/** { html, buttons } for a featured animation's id ('apollo', 'voyager', 'percy', 'webb'), or null */
export function leftBehind(id, now = Date.now()) {
  const d = LEFT_BEHIND[id];
  if (!d) return null;
  const [kind, oid] = d.status;
  const obj = kind === 'eq' ? EQUIPMENT.find((q) => q.id === oid) : PROBES.find((p) => p.id === oid);
  const st = obj ? stateAt(obj, now) : null, s = st ? STATES[st.state] : null;
  const html = `<div class="lb">
    <p class="lb-k"><span>Left behind</span> · ${esc(d.where)}</p>
    <h2>${esc(d.title)}</h2>
    ${s ? `<p class="lb-now"><span class="lb-nk">Today, ${fmtDate(now)}</span><span class="pill" style="--sc:${s.color}">${s.label}</span> ${esc(obj.name)}: ${esc(st.label)}.</p>` : ''}
    <dl class="lb-rows">${d.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <p class="lb-src">Sources: ${d.sources.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join(' · ')}</p>
  </div>`;
  return { html, buttons: d.buttons };
}
