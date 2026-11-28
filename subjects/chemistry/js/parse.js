/* Quilio: reads lecture text files into records.
   A file holds many lectures. Each starts with "== id" and has: S: first look; <<< notes >>>; F: formulas; W: watch-outs;
   M: mark-scheme wording; C: multiple choice; N: numeric; Q: written (+ marking points, A: model answer).
   Used by the page and by the build check, so both read the text the same way. */
(function (root) {
  'use strict';
  function parseNotes(lines, id, warn) {
    const B = []; let i = 0;
    while (i < lines.length) {
      const L = lines[i];
      if (!L.trim()) { i++; continue; }
      if (L.startsWith('### ')) { B.push(['h3', L.slice(4).trim()]); i++; continue; }
      if (L.startsWith('## ')) { B.push(['h2', L.slice(3).trim()]); i++; continue; }
      if (L.startsWith('- ')) { const items = []; while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2).trim()); i++; } B.push(['ul', items]); continue; }
      if (L.startsWith('|')) {
        const rows = [];
        while (i < lines.length && lines[i].startsWith('|')) { const s = lines[i].trim().replace(/^\|/, '').replace(/\|$/, ''); rows.push(s.split('|').map(c => c.trim())); i++; }
        if (warn && rows.some(r => r.length !== rows[0].length)) warn.push(id + ': ragged table "' + rows[0].join(' / ') + '"');
        B.push(['tb', rows]); continue;
      }
      if (/^\$\$.*\$\$\s*$/.test(L)) { B.push(['eq', L.trim().slice(2, -2).trim()]); i++; continue; }
      if (L.startsWith('!mol')) { const cap = L.slice(4).trim(), body = []; i++; while (i < lines.length && lines[i].trim() !== '!end') { body.push(lines[i].replace(/\s+$/, '')); i++; } i++; B.push(['mol', cap, body.join('\n')]); continue; }
      if (L.startsWith('!def ')) { const s = L.slice(5), k = s.indexOf('|'); B.push(['def', s.slice(0, k).trim(), s.slice(k + 1).trim()]); i++; continue; }
      const m = /^!(key|warn|exam|note|analogy)\s+(.*)$/.exec(L);
      if (m) { B.push([m[1], m[2].trim()]); i++; continue; }
      if (warn && L.startsWith('!')) warn.push(id + ': unknown block ' + L.slice(0, 30));
      B.push(['p', L.trim()]); i++;
    }
    return B;
  }
  function parseGuides(text, G, warn) {
    const lines = String(text).replace(/\r\n?/g, '\n').split('\n'); let cur = null, i = 0, lastQ = null, m;
    while (i < lines.length) {
      const L = lines[i];
      if ((m = /^==\+?\s+(\S+)/.exec(L))) { cur = G[m[1]] || (G[m[1]] = { id: m[1], s: '', b: [], f: [], w: [], m: [], c: [], n: [], q: [] }); if (L[2] === '+' && !cur.base) cur.base = { c: cur.c.length, n: cur.n.length, q: cur.q.length }; lastQ = null; i++; continue; }
      if (!cur) { i++; continue; }
      if (L.trim() === '<<<') { const body = []; i++; while (i < lines.length && lines[i].trim() !== '>>>') { body.push(lines[i]); i++; } i++; cur.b = cur.b.concat(parseNotes(body, cur.id, warn)); continue; }
      if (L.startsWith('S: ')) cur.s = L.slice(3).trim();
      else if (L.startsWith('F: ')) { const p = L.slice(3).split(' :: '); cur.f.push([p[0].trim().replace(/^\$/, '').replace(/\$$/, ''), (p[1] || '').trim()]); }
      else if (L.startsWith('W: ')) cur.w.push(L.slice(3).trim());
      else if (L.startsWith('M: ')) { const k = L.indexOf(' :: '); if (k < 0) { if (warn) warn.push(cur.id + ': M without ::'); } else cur.m.push([L.slice(3, k).trim(), L.slice(k + 4).trim()]); }
      else if (L.startsWith('C: ')) {
        const mm = /^C:\s*\[(\d+)\]\s*(.*)$/.exec(L);
        if (mm) { const parts = mm[2].split(' | ').map(s => s.trim()), opts = parts.slice(1, 5), ans = opts.findIndex(o => o.startsWith('*'));
          if (opts.length !== 4 || ans < 0 || opts.filter(o => o.startsWith('*')).length !== 1) { if (warn) warn.push(cur.id + ': bad multiple choice "' + parts[0].slice(0, 50) + '"'); }
          else cur.c.push({ q: parts[0], o: opts.map(o => o.replace(/^\*/, '')), a: ans, y: parts.slice(5).join(' | ') }); }
      } else if (L.startsWith('N: ')) {
        const mm = /^N:\s*\[(\d+)\]\s*(.*?)\s*=>\s*(.*)$/.exec(L);
        if (mm) { const parts = mm[3].split(' | ').map(s => s.trim()), forms = parts[0].replace(/\{[^}]*\}/g, '').trim().split(' ~ ').map(s => s.trim()).filter(Boolean); cur.n.push({ k: +mm[1], q: mm[2], a: forms, st: parts.slice(1) }); }
        else if (warn) warn.push(cur.id + ': bad N');
      } else if (L.startsWith('Q: ')) { const mm = /^Q:\s*\[(\d+)\]\s*(.*)$/.exec(L); if (mm) { lastQ = { k: +mm[1], q: mm[2], p: [], a: '' }; cur.q.push(lastQ); } }
      else if (L.startsWith('+ ') && lastQ) { const k = L.indexOf(' :: '); lastQ.p.push(k < 0 ? [L.slice(2).trim(), ''] : [L.slice(2, k).trim(), L.slice(k + 4).trim()]); }
      else if (L.startsWith('A: ') && lastQ) lastQ.a = L.slice(3).trim();
      i++;
    }
    return G;
  }
  // Small additions that state a syllabus point in words where the notes show it only as a drawing.
  const PATCH = [
    { id: 'ci-11-8', after: b => b[0] === 'mol' && /structure of a protein/i.test(b[1]), add: ['p', 'Written on one line, an amino acid is H₂N–CHR–COOH, and the repeating pattern of a protein chain is –NH–CHR–CO–.'] },
  ];
  function patch(G, warn) { for (const p of PATCH) { const g = G[p.id]; if (!g) continue; if (g.b.some(b => b[0] === 'p' && b[1] === p.add[1])) continue; const k = g.b.findIndex(p.after); if (k < 0) { if (warn) warn.push(p.id + ': patch anchor not found'); } else g.b.splice(k + 1, 0, p.add); } return G; }
  const api = { parseGuides, parseNotes, patch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Guide = api;
})(typeof window !== 'undefined' ? window : globalThis);
