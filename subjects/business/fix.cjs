const fs = require('fs');
const p = 'C:/Users/jayde/Documents/GitHub/EcBiz/mcq_p1_u4.json';
let s = fs.readFileSync(p, 'utf8');
const bad = '}}}\n,"' + '<rfl:parameter name="oldString">\n]{"question_id":"P1_U4_MCQ_022"';
const good = '}}},\n{"question_id":"P1_U4_MCQ_022"';
if (s.includes(bad)) { s = s.replace(bad, good); console.log('fixed bad'); }
else { console.log('bad not found, trying regex'); s = s.replace(/}}}\r?\n,"[^"]*\r?\n\]\{"question_id":"P1_U4_MCQ_022"/g, '}}},\n{"question_id":"P1_U4_MCQ_022"'); }
fs.writeFileSync(p, s);
console.log('written');