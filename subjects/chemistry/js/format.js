/* Quilio text formatter: markdown with chemistry and maths typeset by KaTeX.
   Taken out of pauling.js (the AI tutor, which this copy does not have) because the training course uses it. */
(function () {
  'use strict';
  const GC = () => window.GC || {};
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- markdown with chemistry and maths typeset by KaTeX ---------- */
  function md(text) {
    const keep = [], hold = h => { keep.push(h); return '\u0000' + (keep.length - 1) + '\u0000'; }, tex = (s, d) => (GC().tex ? GC().tex(s.trim(), d) : esc(s));
    let t = String(text || '').replace(/```[\s\S]*?(```|$)/g, m => hold('<pre><code>' + esc(m.replace(/^```[^\n]*\n?/, '').replace(/```$/, '')) + '</code></pre>'));
    t = t.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (m, a, b) => '\n\n' + hold('<div class="eq">' + tex(a || b, true) + '</div>') + '\n\n');
    t = t.replace(/\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g, (m, a, b) => hold(tex(a || b, false)));
    t = esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<i>$2</i>').replace(/`([^`\n]+)`/g, '<code>$1</code>');
    const html = t.trim().split(/\n{2,}/).map(b => {
      const s = b.trim(), L = s.split('\n'); if (!s) return '';
      if (/^\u0000\d+\u0000$/.test(s)) return s;
      if (/^(-{3,}|\*{3,})$/.test(s)) return '<hr>';
      const h = /^(#{1,6})\s+(.*)$/.exec(L[0]);
      if (h) return `<h${Math.min(6, h[1].length + 2)}>${h[2]}</h${Math.min(6, h[1].length + 2)}>` + (L.length > 1 ? md.rest(L.slice(1)) : '');
      return md.rest(L);
    }).join('');
    return html.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
  }
  md.rest = L => {
    if (L.every(l => /^\s*[-*•]\s+/.test(l))) return '<ul>' + L.map(l => '<li>' + l.replace(/^\s*[-*•]\s+/, '') + '</li>').join('') + '</ul>';
    if (L.every(l => /^\s*\d+[.)]\s+/.test(l))) return '<ol>' + L.map(l => '<li>' + l.replace(/^\s*\d+[.)]\s+/, '') + '</li>').join('') + '</ol>';
    return '<p>' + L.join('<br>') + '</p>';
  };
  window.QuilioFormat = { md };
})();
