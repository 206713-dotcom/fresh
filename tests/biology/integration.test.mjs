import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createRouter,createLessonReward} from '../../subjects/biology/bridge.js';

import {lessons,questions,cards} from '../../subjects/biology/src/content.js';
import {investigations,qualitative} from '../../subjects/biology/src/practicals/data.js';
import {questionBank,mocks} from '../../subjects/biology/src/practicals/assessment.js';
test('classification lessons and assessments are connected',()=>{const ls=lessons.filter(l=>l.id.startsWith('lesson-t01-batch-'));assert.equal(ls.length,9);for(const l of ls){assert.equal(questions.filter(q=>q.lessonId===l.id).length,2);assert.equal(cards.filter(c=>c.lessonId===l.id).length,2)}});
test('practical bank integrity and five 40-mark papers',()=>{assert.ok(investigations.length>=40);assert.equal(new Set(investigations.map(m=>m.id)).size,investigations.length);for(const m of investigations){assert.ok(m.x?m.x.length===m.y.length:qualitative[m.id]?.length,m.id)}assert.equal(new Set(questionBank.map(q=>q.id)).size,questionBank.length);assert.equal(mocks.length,5);for(const p of mocks)assert.equal(p.items.reduce((n,q)=>n+q.max,0),40)});
test('router preserves legacy Biology anchors and ignores unrelated anchors',()=>{const w=new EventTarget();w.location={hash:'#topic-1'};const r=createRouter(w);assert.equal(r.getPath(),'/topics/t03');let count=0;const stop=r.subscribe(()=>count++);r.navigate('/practicals');w.dispatchEvent(new Event('hashchange'));assert.equal(r.getPath(),'/practicals');assert.equal(count,1);w.location.hash='#main';w.dispatchEvent(new Event('hashchange'));assert.equal(r.getPath(),'/practicals');assert.equal(count,1);stop()});
test('lesson awards call existing wallet with stable claim and never mutate storage',async()=>{const claims=new Set();let balance=30;const earn=async(subject,amount,label,claim)=>{assert.equal(subject,'Biology');assert.equal(amount,5);if(claims.has(claim))return false;claims.add(claim);balance+=amount;return true};const reward=createLessonReward(()=>({earn}));assert.equal(await reward('lesson-t05-basics'),true);assert.equal(await reward('lesson-t05-basics'),false);assert.equal(balance,35);assert.equal(await createLessonReward(()=>null)('lesson-t05-basics'),false)});
test('full Fresh static build preserves other assets and copies Biology',()=>{const root=fileURLToPath(new URL('../../',import.meta.url));execFileSync(process.execPath,['build.mjs'],{cwd:root});for(const p of ['index.html','gis-points.js','style.css','subjects/english-language.html','subjects/chemistry.html','subjects/biology/src/index.js','subjects/biology/integration.js']){assert.ok(existsSync(join(root,'dist',p)),p);assert.deepEqual(readFileSync(join(root,'dist',p)),readFileSync(join(root,p)),p)}assert.match(readFileSync(join(root,'dist/subjects/biology.html'),'utf8'),/biology\/integration.js/);});
