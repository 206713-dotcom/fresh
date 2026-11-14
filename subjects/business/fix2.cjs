const fs = require('fs');
const p = 'C:/Users/jayde/Documents/GitHub/EcBiz/mcq_p1_u4.json';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/\r?\nEOF/g, '');
fs.writeFileSync(p, s);
console.log('done');
// also fix chunk files
for (const f of ['chunk2.json','chunk3.json','chunk4.json','chunk5.json']) {
  const pp = 'C:/Users/jayde/Documents/GitHub/EcBiz/'+f;
  let t = fs.readFileSync(pp,'utf8');
  t = t.replace(/\r?\nEOF/g,'');
  fs.writeFileSync(pp,t);
}
console.log('chunks fixed');