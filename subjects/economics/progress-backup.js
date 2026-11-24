/* Versioned, browser-local Economics backups. Import checks each record before it can be restored. */
const schema = 'ecbiz-progress';
const revision = 'ecbiz-revision-';
const practice = 'ecbiz-economics-practice-answers';
const games = 'ecbiz-arcade-v1-';
const keyId = /^[\w.-]{1,130}$/;
const topic = /^[1-6]\.\d{1,2}$/;
const gameKey = /^ecbiz-arcade-v1-(?:island|market|policy|trade|escape)(?:-(?:best(?:-practice|-challenge|-campaign)?|campaign-best))?$/;
const image = value => typeof value==='string' && value.length<=530000 && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
const record = value => value!==null && typeof value==='object' && !Array.isArray(value);
const str = (value,max=16000) => typeof value==='string' && value.length<=max;
const integer = (value,min=0,max=Number.MAX_SAFE_INTEGER) => Number.isInteger(value) && value>=min && value<=max;
const optional = (value,valid) => value==null || valid(value);
const map = (value,valid,key=keyId) => record(value) && Object.entries(value).every(([name,item])=>key.test(name) && valid(item));
const list = (value,valid,max=150) => Array.isArray(value) && value.length<=max && value.every(valid);
const id = value => str(value,130) && keyId.test(value);
const drawing = value => record(value) && str(value.x,40) && str(value.y,40) && list(value.shapes,shape=>
  record(shape) && ['stroke','line','point','label'].includes(shape.kind) &&
  optional(shape.text,text=>str(text,24)) && optional(shape.color,color=>/^#[a-f0-9]{6}$/i.test(color)) &&
  list(shape.points,point=>Array.isArray(point) && point.length===2 && point.every(n=>integer(n,0,640)),100) && shape.points.length>0,36);
const grade = value => record(value) && integer(value.score,0,8) && str(value.feedback) &&
  optional(value.credits,credits=>list(credits,item=>record(item) && str(item.criterion) && optional(item.evidence,str),30)) &&
  optional(value.coaching,coaching=>record(coaching) && Object.values(coaching).every(item=>str(item))) &&
  ['band','nextStep','modelResponse','modelPlan','reviewNote'].every(key=>optional(value[key],item=>str(item)));
const markTotal = value => record(value) && ['earned','max','pending'].every(key=>integer(value[key],0,100));
const correction = value => record(value) && id(value.key) && (value.score===null || integer(value.score,0,8)) &&
  str(value.answer,8000) && optional(value.grade,grade) && optional(value.drawing,drawing) &&
  optional(value.image,image) && optional(value.error,str);
const mock = value => record(value) && id(value.id) && ['p1','p2'].includes(value.mode) &&
  optional(value.paper,n=>integer(n,0,50)) && optional(value.at,integer) &&
  ['score','max','pending'].every(key=>integer(value[key],0,80)) &&
  map(value.topics,markTotal,topic) && map(value.markTypes,markTotal,/^[1-8]$/) &&
  list(value.ids,id,40) && optional(value.corrections,items=>list(items,correction,40)) &&
  optional(value.evidence,items=>map(items,evidence,/^[0-4]$/));
const evidence = value => record(value) && map(value.pins,item=>str(item,5000),/^(?:p\d+|t\d+-\d+-\d+)$/) &&
  map(value.highlights,ranges=>list(ranges,pair=>Array.isArray(pair)&&pair.length===2&&pair.every(n=>integer(n,0,25000)),40),/^p\d+$/);
const test = value => value===null || record(value) && ['p1','p2','custom'].includes(value.mode) &&
  optional(value.attemptId,id) && optional(value.paper,n=>integer(n,0,50)) &&
  typeof value.finished==='boolean' && list(value.ids,id,40) &&
  list(value.selection,n=>integer(n,1,4),3) && map(value.answers,item=>str(item,8000)) &&
  optional(value.images,items=>map(items,image)) && optional(value.drawings,items=>map(items,drawing)) &&
  optional(value.evidence,items=>map(items,evidence,/^[0-4]$/)) && optional(value.grades,items=>map(items,grade)) &&
  optional(value.markErrors,items=>map(items,item=>str(item,1000))) &&
  optional(value.deadline,integer) && optional(value.completedAt,integer);
const points = value => record(value) && integer(value.points,0,4) && str(value.explanation) && topic.test(value.topic) &&
  optional(value.title,title=>str(title,220)) && optional(value.checks,checks=>list(checks,check=>
    record(check) && str(check.label,200) && typeof check.met==='boolean',8)) && optional(value.economy,indicators);
function indicators(value) { return Array.isArray(value) && value.length===5 && value.every(n=>integer(n,-10000,10000)); }
function economyState(value) {
  return record(value) && indicators(value.economy) && Number.isFinite(value.balance) &&
    optional(value.pending,indicators) && optional(value.projects,projects=>map(projects,n=>integer(n,0,100)));
}
function game(value) {
  return value===null || economyState(value) && ['practice','challenge'].includes(value.mode) &&
    ['mixed','0','1','2','3','4','5'].includes(value.unit) && integer(value.round,0,8) && integer(value.seed,0,1000000) &&
    optional(value.version,n=>n===2) && optional(value.feedback,points) && optional(value.before,before=>economyState(before) && Object.keys(before).every(key=>['economy','balance','pending','projects'].includes(key))) &&
    optional(value.draft,draft=>map(draft,text=>str(text,60)&&/^[\w.+-]*$/.test(text))) &&
    list(value.history,points,8);
}

function backupValidator(key) {
  if (key===practice) return entries=>map(entries,item=>record(item) && str(item.answer,8000) &&
    optional(item.score,score=>integer(score,0,8)) && optional(item.feedback,text=>str(text,90000)));
  if (/^ecbiz-economics-flashcard-\d+$/.test(key)) return value=>str(value,6) && /^\d+$/.test(value);
  if (gameKey.test(key)) return key.includes('-best') ? value=>integer(value,0,100) : game;
  if (key===revision+'mock-history') return value=>list(value,mock,150);
  if (key===revision+'test') return test;
  if (key===revision+'flashcard-review') return value=>map(value,item=>record(item) &&
    integer(item.interval,0,90) && integer(item.due) && integer(item.reviewed) && item.due>=item.reviewed,/^\d+-\d+$/);
  if (key===revision+'topic-check-results') return value=>map(value,item=>record(item) && topic.test(item.topic) && integer(item.score,0,1));
  if (key===revision+'free-diagrams') return value=>map(value,drawing);
  if (key===revision+'checklist-0455-workbook' || key===revision+'checklist-0455-2027') return value=>list(value,
    item=>str(item,24)&&/^\d+(?:\.\d+)+(?:[:.-]\d+)?$/.test(item),900);
  if (key.startsWith(revision+'correction-') && keyId.test(key.slice((revision+'correction-').length))) {
    return value=>map(value,item=>record(item)&&optional(item.answer,text=>str(text,8000))&&
      optional(item.grade,grade)&&optional(item.drawing,drawing));
  }
  if (key.startsWith(revision+'writing-') && keyId.test(key.slice((revision+'writing-').length))) {
    return value=>list(value,item=>str(item,8000)||record(item)&&str(item.answer,8000)&&optional(item.grade,grade),12);
  }
}

function parseBackup(raw) {
  const data=JSON.parse(raw,(key,value)=>{
    if (['__proto__','constructor','prototype'].includes(key)) throw new Error('This file contains an unsafe field.');
    return value;
  });
  if (data?.format!==schema || data.version!==1 || !record(data.entries)) throw new Error('Choose a version 1 EcBiz progress backup.');
  const entries=Object.entries(data.entries);
  if (!entries.length || entries.length>5000) throw new Error('This backup has no usable progress entries.');
  for (const [key,value] of entries) {
    const validate=backupValidator(key);
    if(!validate?.(value))throw new Error('This backup has an invalid Economics progress entry.');
    if(key===practice) for (const answer of Object.values(value)) {
      if(answer.feedback) {
        const template=document.createElement('template');
        template.innerHTML=answer.feedback;
        const allowed = new Set(['P','H3','H4','UL','LI','SPAN','STRONG','DETAILS','SUMMARY','SECTION','DIV','MARK','BR','A']);
        const safe = node=>{
          if (node.nodeType===Node.TEXT_NODE) return document.createTextNode(node.textContent);
          const children=[...node.childNodes].map(safe);
          if (!allowed.has(node.nodeName)) {const fragment=document.createDocumentFragment();fragment.append(...children);return fragment;}
          const result=document.createElement(node.nodeName.toLowerCase());
          if (node.nodeName==='A') {
            const href=node.getAttribute('href') || '';
            if (/^(?:#[-\w./]+|https:\/\/www\.cambridgeinternational\.org\/[^\s]+)$/.test(href)) result.setAttribute('href',href);
          }
          const outcome=node.getAttribute('data-outcome');
          if(['correct','incorrect','unanswered','partial'].includes(outcome)) result.dataset.outcome=outcome;
          const className=node.getAttribute('class');
          if(className && /^[a-z0-9 -]+$/i.test(className)) result.className=className;
          result.append(...children);
          return result;
        };
        const body=document.createElement('div');
        body.append(...[...template.content.childNodes].map(safe));
        answer.feedback=body.innerHTML;
      }
    }
  }
  return entries;
}

function exportBackup() {
  const entries={};
  for (const key of Object.keys(localStorage)) {
    const validate=backupValidator(key);
    if(!validate)continue;
    const raw=localStorage.getItem(key);
    const value=key.startsWith('ecbiz-economics-flashcard-')?raw:JSON.parse(raw);
    if(validate(value))entries[key]=value;
  }
  if(!Object.keys(entries).length)throw new Error('Complete some Economics practice to create a backup.');
  const file=new Blob([JSON.stringify({format:schema,version:1,created:new Date().toISOString(),entries})],{type:'application/json'});
  const url=URL.createObjectURL(file), anchor=document.createElement('a');
  anchor.href=url;anchor.download='ecbiz-progress-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
}

function restoreBackup(entries) {
  const applied=[];
  try {
    for (const [key,incoming] of entries) {
      const raw=localStorage.getItem(key);
      const flashcard=key.startsWith('ecbiz-economics-flashcard-');
      const existing=flashcard?raw:JSON.parse(raw);
      let next=existing ?? incoming;
      if(key===revision+'mock-history') {
        const combined=new Map();
        for (const row of [...incoming,...(existing ?? [])]) {
          const previous=combined.get(row.id);
          if(!previous || row.pending<previous.pending || row.pending===previous.pending&&(row.corrections||!previous.corrections))combined.set(row.id,row);
        }
        next=retainMockHistory([...combined.values()].sort((a,b)=>(b.at??0)-(a.at??0)));
      } else if (key===revision+'flashcard-review') {
        next={...existing};
        for (const [id,item] of Object.entries(incoming)) {
          if (!next[id] || item.reviewed>next[id].reviewed) next[id]=item;
        }
      } else if (key===practice || key.startsWith(revision+'correction-') || key===revision+'free-diagrams' ||
        key===revision+'topic-check-results') next={...incoming,...existing};
      else if (key.includes('checklist-0455-')) next=[...new Set([...incoming,...(existing ?? [])])];
      else if (key.startsWith(games)&&key.includes('-best')) next=Math.max(incoming,existing ?? 0);
      const value=flashcard?next:JSON.stringify(next);
      if(value!==raw) {localStorage.setItem(key,value);applied.push([key,raw]);}
    }
  } catch {
    for (const [key] of applied.reverse()) localStorage.removeItem(key);
    for (const [key,raw] of applied) if(raw!==null) localStorage.setItem(key,raw);
    throw new Error('The backup could not be saved. Check available browser storage.');
  }
}

let pending=null;
document.addEventListener('change',async event=>{
  const input=event.target.closest('[data-ecbiz-backup-file]');
  if(!input)return;
  const panel=input.closest('#progress-backup'), restore=panel.querySelector('[data-ecbiz-restore]'), status=panel.querySelector('[role="status"]');
  const file=input.files[0];
  pending=null;restore.disabled=true;
  if(!file)return;
  try {
    if(file.size>15*1024*1024)throw new Error('Choose an EcBiz backup smaller than 15 MB.');
    const entries=parseBackup(await file.text());
    if (!input.isConnected || input.files[0]!==file) return;
    pending={input,entries};restore.disabled=false;
    status.textContent=entries.length+' progress entries ready to restore.';
  } catch(error){if(input.files[0]===file)status.textContent=error.message;}
});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-ecbiz-backup], [data-ecbiz-restore]');
  if(!button)return;
  const panel=button.closest('#progress-backup'), status=panel.querySelector('[role="status"]');
  try {
    if(button.hasAttribute('data-ecbiz-backup')) {
      exportBackup();status.textContent='Economics backup downloaded.';
    } else if(pending?.input.isConnected) {
      restoreBackup(pending.entries);pending=null;render(false);
      const updated=document.querySelector('#progress-backup [role="status"]');
      if(updated)updated.textContent='Economics progress restored.';
    }
  } catch(error){status.textContent=error.message;}
});
