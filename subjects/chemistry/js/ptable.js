/* Quilio: Periodic Table data and the interactive table.
   Relative atomic masses are those printed on the Cambridge IGCSE Periodic Table. */
(function () {
  'use strict';
  const RAW = 'H,Hydrogen,1|He,Helium,4|Li,Lithium,7|Be,Beryllium,9|B,Boron,11|C,Carbon,12|N,Nitrogen,14|O,Oxygen,16|F,Fluorine,19|Ne,Neon,20|Na,Sodium,23|Mg,Magnesium,24|Al,Aluminium,27|Si,Silicon,28|P,Phosphorus,31|S,Sulfur,32|Cl,Chlorine,35.5|Ar,Argon,40|K,Potassium,39|Ca,Calcium,40|Sc,Scandium,45|Ti,Titanium,48|V,Vanadium,51|Cr,Chromium,52|Mn,Manganese,55|Fe,Iron,56|Co,Cobalt,59|Ni,Nickel,59|Cu,Copper,64|Zn,Zinc,65|Ga,Gallium,70|Ge,Germanium,73|As,Arsenic,75|Se,Selenium,79|Br,Bromine,80|Kr,Krypton,84|Rb,Rubidium,85|Sr,Strontium,88|Y,Yttrium,89|Zr,Zirconium,91|Nb,Niobium,93|Mo,Molybdenum,96|Tc,Technetium,|Ru,Ruthenium,101|Rh,Rhodium,103|Pd,Palladium,106|Ag,Silver,108|Cd,Cadmium,112|In,Indium,115|Sn,Tin,119|Sb,Antimony,122|Te,Tellurium,128|I,Iodine,127|Xe,Xenon,131|Cs,Caesium,133|Ba,Barium,137|La,Lanthanum,139|Ce,Cerium,140|Pr,Praseodymium,141|Nd,Neodymium,144|Pm,Promethium,|Sm,Samarium,150|Eu,Europium,152|Gd,Gadolinium,157|Tb,Terbium,159|Dy,Dysprosium,163|Ho,Holmium,165|Er,Erbium,167|Tm,Thulium,169|Yb,Ytterbium,173|Lu,Lutetium,175|Hf,Hafnium,178|Ta,Tantalum,181|W,Tungsten,184|Re,Rhenium,186|Os,Osmium,190|Ir,Iridium,192|Pt,Platinum,195|Au,Gold,197|Hg,Mercury,201|Tl,Thallium,204|Pb,Lead,207|Bi,Bismuth,209|Po,Polonium,|At,Astatine,|Rn,Radon,|Fr,Francium,|Ra,Radium,|Ac,Actinium,|Th,Thorium,232|Pa,Protactinium,231|U,Uranium,238|Np,Neptunium,|Pu,Plutonium,|Am,Americium,|Cm,Curium,|Bk,Berkelium,|Cf,Californium,|Es,Einsteinium,|Fm,Fermium,|Md,Mendelevium,|No,Nobelium,|Lr,Lawrencium,|Rf,Rutherfordium,|Db,Dubnium,|Sg,Seaborgium,|Bh,Bohrium,|Hs,Hassium,|Mt,Meitnerium,|Ds,Darmstadtium,|Rg,Roentgenium,|Cn,Copernicium,|Nh,Nihonium,|Fl,Flerovium,|Mc,Moscovium,|Lv,Livermorium,|Ts,Tennessine,|Og,Oganesson,';
  const GAS = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86], LIQ = [35, 80];
  const CATS = {
    alkali: ['Group I · alkali metals', 'metal'], earth: ['Group II · alkaline earth metals', 'metal'], trans: ['Transition elements', 'metal'],
    post: ['Other metals', 'metal'], semi: ['Metalloids', 'between'], non: ['Non-metals', 'non-metal'], halo: ['Group VII · halogens', 'non-metal'],
    noble: ['Group VIII · noble gases', 'non-metal'], lan: ['Lanthanoids', 'metal'], act: ['Actinoids', 'metal'],
  };
  const ROMAN = { 1: 'I', 2: 'II', 13: 'III', 14: 'IV', 15: 'V', 16: 'VI', 17: 'VII', 18: 'VIII' };
  function place(z) { // [row, col] on an 18-column grid; f-block on rows 9 and 10
    if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
    if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8]; if (z <= 18) return [3, z <= 12 ? z - 10 : z];
    if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54]; if (z <= 71) return [9, z - 54]; if (z <= 86) return [6, z - 68];
    if (z <= 88) return [7, z - 86]; if (z <= 103) return [10, z - 86]; return [7, z - 100];
  }
  function cat(z, col) {
    if (z >= 57 && z <= 71) return 'lan'; if (z >= 89 && z <= 103) return 'act';
    if (z === 1) return 'non'; if (col === 1) return 'alkali'; if (col === 2) return 'earth'; if (col >= 3 && col <= 12) return 'trans';
    if (col === 18) return 'noble'; if (col === 17) return 'halo';
    if ([5, 14, 32, 33, 51, 52].includes(z)) return 'semi'; if ([6, 7, 8, 15, 16, 34].includes(z)) return 'non'; return 'post';
  }
  const EL = RAW.split('|').map((s, i) => {
    const p = s.split(','), z = i + 1, [row, col] = place(z), c = cat(z, col);
    return { z, sym: p[0], name: p[1], ar: p[2] ? +p[2] : null, row, col, period: row > 8 ? row - 3 : row, group: row > 8 ? null : col, cat: c,
      state: z > 103 ? 'unknown' : GAS.includes(z) ? 'gas' : LIQ.includes(z) ? 'liquid' : 'solid' };
  });
  const BY = {}; EL.forEach(e => BY[e.sym] = e);
  function shells(z) { if (z > 20) return null; const cap = [2, 8, 8, 2], out = []; let n = z; for (const c of cap) { if (n <= 0) break; out.push(Math.min(c, n)); n -= c; } return out; }
  function spdf(z) {
    if (z > 36) return null; const order = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]], f = {}; let n = z;
    for (const [k, c] of order) { if (n <= 0) break; f[k] = Math.min(c, n); n -= c; }
    if (z === 24) { f['3d'] = 5; f['4s'] = 1; } if (z === 29) { f['3d'] = 10; f['4s'] = 1; }
    const sup = s => String(s).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    return ['1s', '2s', '2p', '3s', '3p', '3d', '4s', '4p'].filter(k => f[k]).map(k => k + sup(f[k])).join(' ');
  }
  // Mr from a typed formula such as CaCO3, Mg(OH)2, CuSO4.5H2O
  function mr(str) {
    const s = String(str).replace(/\s+/g, '').replace(/[₀-₉]/g, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d)); if (!s) return null;
    let total = 0; const parts = [];
    for (const piece of s.split(/[.·•*]/)) {
      if (!piece) return null; const m = /^(\d+)?(.*)$/.exec(piece), mult = m[1] ? +m[1] : 1; let i = 0; const src = m[2]; if (!src) return null;
      const group = () => {
        let sum = 0; const list = [];
        while (i < src.length && src[i] !== ')') {
          if (src[i] === '(') { i++; const g = group(); if (!g || src[i] !== ')') return null; i++; let n = ''; while (/\d/.test(src[i] || '')) n += src[i++]; const k = n ? +n : 1; sum += g.sum * k; g.list.forEach(([e, c]) => list.push([e, c * k])); }
          else { const mm = /^[A-Z][a-z]?/.exec(src.slice(i)); if (!mm || !BY[mm[0]] || BY[mm[0]].ar === null) return null; i += mm[0].length; let n = ''; while (/\d/.test(src[i] || '')) n += src[i++]; const k = n ? +n : 1; sum += BY[mm[0]].ar * k; list.push([mm[0], k]); }
        }
        return { sum, list };
      };
      const g = group(); if (!g || i !== src.length) return null; total += g.sum * mult; g.list.forEach(([e, c]) => parts.push([e, c * mult]));
    }
    const agg = {}; parts.forEach(([e, c]) => agg[e] = (agg[e] || 0) + c);
    return { mr: Math.round(total * 100) / 100, atoms: agg };
  }

  const FILTERS = [['all', 'All'], ['metal', 'Metals'], ['non-metal', 'Non-metals'], ['alkali', 'Group I'], ['earth', 'Group II'], ['trans', 'Transition elements'], ['halo', 'Group VII'], ['noble', 'Group VIII'], ['gas', 'Gases at r.t.p.'], ['liquid', 'Liquids at r.t.p.']];
  const READ = { alkali: [['ci-8-2', 'IGCSE 8.2 Group I properties'], ['k3-6-4', 'KS3 6.4 Patterns and predictions']], halo: [['ci-8-3', 'IGCSE 8.3 Group VII properties'], ['ca-11-1', 'AS 11.1 Group 17']], trans: [['ci-8-4', 'IGCSE 8.4 Transition elements'], ['ca-28-1', 'A Level 28.1 Transition elements']], noble: [['ci-8-5', 'IGCSE 8.5 Noble gases']], earth: [['ca-10-1', 'AS 10.1 Group 2']] };

  function mount(root, opts) {
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    root.classList.add('pt'); if (opts && opts.wide) root.classList.add('pt-wide');
    root.innerHTML = `<div class="pt-filters" role="group" aria-label="Highlight">${FILTERS.map(([k, l], i) => `<button type="button" class="chip${i ? '' : ' is-on'}" data-f="${k}">${l}</button>`).join('')}</div>
      <div class="pt-wrap"><div class="pt-scroll"><div class="pt-grid" role="grid" aria-label="Periodic Table">${
      Array.from({ length: 18 }, (_, k) => k + 1).map(c => `<div class="pt-gh" style="grid-column:${c + 1};grid-row:1"><b>${ROMAN[c] || ''}</b><i>${c}</i></div>`).join('')}${
      [1, 2, 3, 4, 5, 6, 7].map(r => `<div class="pt-ph" style="grid-row:${r + 1};grid-column:1">${r}</div>`).join('')}${
      EL.map(e => `<button type="button" class="pt-el c-${e.cat}" data-z="${e.z}" style="grid-row:${e.row + 1};grid-column:${e.col + 1}" aria-label="${e.name}"><i>${e.z}</i><b>${e.sym}</b><u>${e.ar === null ? '–' : e.ar}</u></button>`).join('')}
      <div class="pt-fb" style="grid-row:7;grid-column:4">57–71</div><div class="pt-fb" style="grid-row:8;grid-column:4">89–103</div>
      <div class="pt-fl" style="grid-row:10;grid-column:1 / span 3">lanthanoids</div><div class="pt-fl" style="grid-row:11;grid-column:1 / span 3">actinoids</div>
      </div></div><aside class="pt-card" aria-live="polite"></aside></div>
      <p class="fig-note">Group numbers are shown the Cambridge IGCSE way (I to VIII) with the 1 to 18 numbering used at A Level beneath. Relative atomic masses are the values printed on the Cambridge IGCSE Periodic Table; a dash means the element has no stable isotopes.</p>`;
    const card = root.querySelector('.pt-card'), cells = [...root.querySelectorAll('.pt-el')];
    function show(z) {
      const e = EL[z - 1], [cl, kind] = CATS[e.cat], sh = shells(z), sp = spdf(z), rd = READ[e.cat] || [];
      cells.forEach(c => c.classList.toggle('is-sel', +c.dataset.z === z));
      const rows = [['Relative atomic mass', e.ar === null ? 'no stable isotopes' : e.ar], ['Period', e.period],
        ['Group', z === 1 ? 'placed on its own' : e.group ? (ROMAN[e.group] ? `${ROMAN[e.group]} <small>(${e.group})</small>` : `<small>${e.group}</small>`) : '–'], ['Type', kind === 'between' ? 'metalloid' : kind],
        ['State at r.t.p.', e.state === 'unknown' ? 'not known: too short-lived' : e.state]];
      rows.unshift(['Family', cl.replace(/^Group [IV]+ · /, '')]);
      if (sh) rows.push(['Electronic configuration', sh.join(',')]);
      if (sp) rows.push(['s, p, d notation', sp]);
      card.innerHTML = `<div class="pt-big c-${e.cat}"><i>${e.z}</i><b>${e.sym}</b><u>${e.ar === null ? '–' : e.ar}</u></div>
        <div class="pt-info"><h3>${esc(e.name)}</h3>${sh ? `<p class="pt-tip">${sh.length} occupied shell${sh.length > 1 ? 's' : ''}: Period ${e.period}. ${z === 1 ? '' : e.group && e.group !== 18 && ROMAN[e.group] ? `${sh[sh.length - 1]} outer electron${sh[sh.length - 1] > 1 ? 's' : ''}: Group ${ROMAN[e.group]}.` : e.group === 18 ? 'Full outer shell: Group VIII.' : ''}</p>` : `<p class="pt-tip">${cl}.</p>`}${rd.length ? `<p class="pt-read">${rd.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}</p>` : ''}</div>
        <dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    }
    function filter(k) {
      root.querySelectorAll('.pt-filters .chip').forEach(b => b.classList.toggle('is-on', b.dataset.f === k));
      cells.forEach(c => { const e = EL[+c.dataset.z - 1]; const on = k === 'all' || e.cat === k || CATS[e.cat][1] === k || e.state === k; c.classList.toggle('is-dim', !on); });
    }
    // the element card closes when you click anywhere that is not the table itself, the card, or the highlight buttons
    function hide() { card.hidden = true; cells.forEach(c => c.classList.remove('is-sel')); }
    root.addEventListener('click', ev => {
      const el = ev.target.closest('.pt-el'); if (el) { card.hidden = false; return show(+el.dataset.z); }
      const f = ev.target.closest('[data-f]'); if (f) filter(f.dataset.f);
    });
    const away = ev => {
      if (!root.isConnected) { document.removeEventListener('click', away, true); document.removeEventListener('keydown', esc1); return; }
      if (card.hidden || ev.target.closest('.pt-el, .pt-card, .pt-filters')) return;
      hide();
    };
    const esc1 = ev => { if (ev.key === 'Escape' && root.isConnected) hide(); };
    document.addEventListener('click', away, true); document.addEventListener('keydown', esc1);
    show((opts && opts.z) || 11);
  }
  window.PT = { EL, BY, CATS, shells, spdf, mr, mount };
})();
