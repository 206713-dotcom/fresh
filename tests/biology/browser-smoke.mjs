import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,execFileSync} from 'node:child_process';

const dir=fileURLToPath(new URL('../../',import.meta.url));
let server,browser;
try{
 execFileSync(process.execPath,['build.mjs'],{cwd:dir});
 server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{cwd:join(dir,'dist'),stdio:'ignore'});
 const origin='http://127.0.0.1:8765';
 for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,150))}
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin);
 await page.locator('a[href="subjects/biology.html"]').first().click();
 await page.locator('#biology-section').locator('.bio-root').waitFor();
 assert.ok(page.url().includes('/subjects/biology.html'));
 assert.equal(await page.locator('[data-gisp-count]').count(),1);
 await page.goto(origin+'/subjects/biology.html#/learn/lesson-t05-basics');
 await page.getByRole('button',{name:'Mark as read',exact:true}).click();
 await page.waitForFunction(()=>window.FreshPoints.balance()===10);
 await page.getByRole('button',{name:'Marked read ✓',exact:true}).click();
 await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>window.FreshPoints.balance()),10);
 await page.goto(origin+'/subjects/english-language.html');
 await page.waitForFunction(()=>window.FreshPoints?.balance()===10);
 assert.equal(await page.locator('[data-gisp-count]').textContent(),'10');
 await page.goto(origin+'/subjects/biology.html#topic-1');
 await page.locator('#biology-section h1').waitFor();
 // Check the unique page-level heading, not the identically named lesson card.
 await page.getByRole('heading',{level:1,name:'Cell transport',exact:true}).waitFor();
 assert.equal(await page.locator('#biology-section h1').textContent(),'Cell transport');
 await page.getByRole('heading',{level:3,name:'Cell transport',exact:true}).waitFor();
 await page.goto(origin+'/subjects/biology.html#/practicals/virtual?lab=osmosis');
 await page.locator('#ph-measure').click();
 const reading=await page.locator('#ph-reading').textContent();
 assert.match(reading,/Simulated reading: /);
 await page.locator('#ph-enter').fill(reading.split(': ')[1]);
 await page.locator('#ph-record').click();
 assert.match(await page.locator('#ph-records').textContent(),/Mean results/);
 await page.goto(origin+'/subjects/biology.html#/practicals/mocks');
 await page.getByRole('button',{name:'Start 60-minute mock'}).first().click();
 await page.locator('#timer').waitFor();
 assert.match(await page.locator('#timer').textContent(),/remaining/);
 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/subjects/biology.html#/topics');
 await page.locator('#biology-section h1').waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true);
 assert.deepEqual(errors,[]);
 console.log('Browser smoke passed: real Fresh homepage, Biology route, same wallet across subjects, duplicate claim, legacy deep link, lab data, timed mock and mobile overflow.');
}finally{await browser?.close();server?.kill();}
