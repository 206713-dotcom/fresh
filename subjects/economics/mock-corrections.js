/* Save question-level outcomes alongside the existing mock summaries. */
function mockQuestionDetails(item, key) {
  if (item.mode==='p1') {
    const q=revisionQuestion(key);
    return q?.options?{...q,prompt:q.q,case:q.case}:null;
  }
  const [group,part]=key.split('-').map(Number);
  const source=revisionPaper2Groups(item.paper)?.[group];
  const q=source?.parts[part];
  return q ? {...q,id:revisionPaper2Id(item.paper,group,part),source:{...source,index:group},label:'Question '+(group+1)+String.fromCharCode(97+part)} : null;
}

function hasMockResponse(state,key) {
  return Boolean(state.answers[key]?.trim() || state.images?.[key] || state.drawings?.[key]?.shapes.length);
}

function snapshotMockCorrections(state) {
  if (state.mode==='p1') return state.ids.flatMap(key=>{
    const q=revisionQuestion(key), answer=state.answers[key] ?? '';
    return q && answer!==String(q.answer) ? [{key,score:0,answer}] : [];
  });
  return revisionWrittenItems(state).flatMap(({key,marks})=>{
    const grade=state.grades?.[key], answer=state.answers[key] ?? '';
    const drawing=state.drawings?.[key], image=drawing?.shapes.length ? undefined : state.images?.[key];
    const review=grade && markReviewReason(grade,answer);
    if(grade?.score===marks && !review) return [];
    const entry={key,score:grade?.score ?? (hasMockResponse(state,key)?null:0),answer};
    if (drawing?.shapes.length) entry.drawing=drawing;
    if (image && image.length<=110000) entry.image=image;
    if (state.markErrors?.[key]) entry.error=state.markErrors[key];
    if (grade) {
      const {score,feedback,credits,band,provisional,reviewUnavailable,reviewNote}=grade;
      entry.grade={score,feedback,credits,band,provisional,reviewUnavailable,reviewNote};
    }
    return [entry];
  });
}

function mockCorrectionHref(mock,key) {
  return '#revision-corrections/' + encodeURIComponent(mock.id) + (key ? '~'+encodeURIComponent(key) : '');
}

function correctionPracticeSeen() {
  return new Set([...Object.keys(readPracticeAnswers()),...revisionState('reviewed-questions', []),
    ...mockHistory().flatMap(entry=>entry.ids ?? [])]);
}

function freshCorrectionQuestion(q,seen = correctionPracticeSeen()) {
  return freshTopicQuestion(q.topic,seen,q,Boolean(q.options));
}

function mockCorrectionComparison(item,q,updated) {
  const original=item.grade;
  const score=item.score===null?'Awaiting marking':item.score + '/' + q.marks;
  const answer=view=>view ? '<p class="mark-scheme">'+escapeHtml(view)+'</p>' : '<p class="muted">No written response saved.</p>';
  const column=(title,submission,mark,grade,diagram,image)=>'<section><h3>'+title+' · '+mark+'</h3>'+
    answer(submission)+(diagram||image?'<img class="correction-diagram" alt="'+title+' diagram" src="'+
      escapeHtml(image||ecBizDiagramImage(diagram))+'">':'')+
    (grade?ecbizMarking.feedback({...grade,modelResponse:grade.modelResponse||q.model,diagram:q.diagram},q.marks,submission):'')+'</section>';
  return '<div class="corrections-compare">'+column('Original',item.answer,score,original,item.drawing,item.image) +
    (updated?.grade ? column('Your correction',updated.answer,updated.grade.score+'/'+q.marks,updated.grade,updated.drawing) : '') + '</div>';
}

function correctionGroup(mock) {
  const parts = (mock.corrections ?? []).flatMap(item=>{
    const q=mockQuestionDetails(mock,item.key);
    return q ? [{item,q}] : [];
  });
  return parts.sort((a,b)=>
    (b.q.marks-(b.item.score??b.q.marks))-(a.q.marks-(a.item.score??a.q.marks)));
}

function correctionPage(route) {
  const history=mockHistory();
  const [encodedId,encodedKey]=(route ?? '').split('~');
  const decode=raw=>{try{return decodeURIComponent(raw??'');}catch{return '';}};
  const mock=history.find(entry=>entry.id===decode(encodedId));
  const key=decode(encodedKey);
  if (mock && key) {
    const row=correctionGroup(mock).find(value=>value.item.key===key);
    if (row && !row.q.options) return correctionAttempt(mock,row.item,row.q);
  }
  const groups=mock ? [mock] : history;
  const seen=correctionPracticeSeen(), varied=new Map();
  return revisionHeading('Exam practice','Mock corrections','Start with the questions that cost the most marks. Compare a new answer with the one you submitted.') +
    '<div class="row">'+(mock?link('All corrections','#revision-corrections'):'')+link('Mock exam history','#revision-history')+link('Weak topics','#progress-weak-topics')+'</div>' +
    (groups.length ? groups.map(entry=>{
      const items=correctionGroup(entry);
      const back=mockCorrectionHref(entry);
      const date=entry.at?new Date(entry.at).toLocaleDateString():'Earlier attempt';
      return '<section class="panel mock-corrections-list"><h2>'+revisionMockLabel(entry.mode,entry.paper)+' · '+escapeHtml(date)+'</h2>' +
        (items.length ? '<ol>'+items.map(({item,q})=>{
          const feedback=item.score===null?'Awaiting marking':(q.marks-item.score)+' mark'+(q.marks-item.score===1?'':'s')+' lost';
          const practiceKey=q.topic + '-' + q.marks;
          if(!varied.has(practiceKey))varied.set(practiceKey,freshCorrectionQuestion(q,seen));
          const fresh=varied.get(practiceKey);
          const alternative=fresh?.id===q.id?freshCorrectionQuestion(q,seen):fresh;
          const href=q.options?'#revision-retry/'+encodeURIComponent(q.id):mockCorrectionHref(entry,item.key);
          const status=revisionState('correction-'+entry.id,{})[item.key]?.grade ? '<span>Correction saved</span>' : '';
          return '<li><p><strong>'+escapeHtml(q.label? q.label+' · '+q.prompt:q.prompt)+'</strong></p><p>'+escapeHtml(feedback)+
            (item.error?' · marking failed':item.grade&&ecbizMarking.reviewReason(item.grade,item.answer)?' · review recommended':'')+
            '</p><div class="row">'+link(q.options?'Retry question':'Review and redo',href)+
            (alternative?link('Fresh question on this topic','#practice/question/'+encodeURIComponent(alternative.id),'text-link'):'')+status+'</div></li>';
        }).join('')+'</ol>' : '<p>'+ (entry.corrections ? 'No missed questions or flagged marks in this mock.' :
          'This older mock has topic scores in Mock Exam History. Question-level corrections are available for new submissions.')+'</p>') +
        (!mock&&items.length?link('Focus on this mock',back,'text-link'):'')+'</section>';
    }).join('') : '<p class="panel">Submit a mock to start your corrections queue.</p>');
}

function correctionAttempt(mock,item,q) {
  const saved=revisionState('correction-'+mock.id,{})[item.key] ?? {};
  const canRetry=(item.answer.trim() || item.drawing?.shapes.length || item.image) &&
    (item.score===null || item.grade && ecbizMarking.reviewReason(item.grade,item.answer));
  const fresh=freshCorrectionQuestion(q);
  const pins=mock.evidence?.[q.source.index]?.pins;
  const context=mockCaseSource(q.source,mock,true) + (Object.keys(pins ?? {}).length?
    '<aside class="mock-case-pins">'+mockCasePins(pins)+'</aside>':'');
  return link('← Back to this mock’s corrections',mockCorrectionHref(mock),'text-link') +
    revisionHeading(q.label+' · '+q.marks+' marks','Redo your answer',escapeHtml(q.prompt)) +
    '<section class="panel"><details open><summary>Source and context</summary>'+context+'</details></section>' +
    '<form class="panel mock-correction" id="mock-correction-form" data-mock-id="'+escapeHtml(mock.id)+'" data-question-key="'+
    escapeHtml(item.key)+'"><label class="field">Your new answer<textarea name="answer" maxlength="8000">'+escapeHtml(saved.answer ?? '')+
    '</textarea></label>'+(q.diagram?diagramEditor(item.key):'')+
    '<div class="row"><button class="primary">Mark my correction</button>'+
    (canRetry?'<button type="button" id="retry-archived-mark">Retry original marking</button>':'')+
    (fresh?link('Try a fresh question','#practice/question/'+encodeURIComponent(fresh.id),'text-link'):'')+
    '</div><p id="revision-save-status" role="status"></p></form>'+
    '<section class="panel"><h2>Compare attempts</h2>'+mockCorrectionComparison(item,q,saved) +
    (q.diagram?examDiagramPreview(saved.drawing ?? item.drawing,saved.drawing?null:item.image,q):'')+ecbizMarking.scheme(q)+'</section>';
}

function refreshArchivedMark(mock,item,grade) {
  const current=revisionState('test',null);
  if (current?.attemptId===mock.id) {
    const next={...current,grades:{...current.grades,[item.key]:grade},markErrors:{...current.markErrors}};
    delete next.markErrors[item.key];
    return saveRevisionState('test',next) && archiveMock(next);
  }
  const history=revisionState('mock-history',[]);
  const original=history.find(row=>row.id===mock.id);
  const row=original?.corrections?.find(value=>value.key===item.key);
  if (!row) return false;
  const q=mockQuestionDetails(mock,item.key);
  const change=grade.score-(row.score ?? 0), wasPending=row.score===null;
  const topics={...original.topics}, markTypes={...original.markTypes};
  for (const [bucket,key] of [[topics,q.topic],[markTypes,q.marks]]) {
    const previous=bucket[key] ?? {earned:0,max:0,pending:0};
    bucket[key]={earned:previous.earned+change,max:previous.max+(wasPending?q.marks:0),
      pending:Math.max(0,previous.pending-(wasPending?q.marks:0))};
  }
  const {score,feedback,credits,band,provisional,reviewUnavailable,reviewNote}=grade;
  const updated={...original,topics,markTypes,score:original.score+change,pending:Math.max(0,original.pending-(wasPending?q.marks:0)),
    corrections:original.corrections.map(value=>value===row?{...row,error:undefined,score,
      grade:{score,feedback,credits,band,provisional,reviewUnavailable,reviewNote}}:value)};
  return saveRevisionState('mock-history',history.map(value=>value===original?updated:value));
}

function setupCorrectionPage() {
  const form=document.querySelector('#mock-correction-form');
  if (!form) return;
  const mock=mockHistory().find(entry=>entry.id===form.dataset.mockId);
  const item=mock?.corrections?.find(entry=>entry.key===form.dataset.questionKey);
  if(!item)return;
  const q=mockQuestionDetails(mock,item.key), storage='correction-'+mock.id;
  const status=form.querySelector('[role="status"]#revision-save-status');
  const current=()=>revisionState(storage,{})[item.key] ?? {};
  const save=patch=>saveRevisionState(storage,{...revisionState(storage,{}),[item.key]:{...current(),...patch}});
  setupDiagramEditors(form,{[item.key]:current().drawing},(_key,drawing)=>save({drawing,grade:undefined}));
  const answer=form.elements.answer;
  answer.oninput=()=>save({answer:answer.value,grade:undefined});
  const run=async original=>{
    const button=form.querySelector('button.primary'), retry=form.querySelector('#retry-archived-mark');
    if (button.disabled) return;
    const response=original?item.answer:answer.value.trim();
    const drawing=original?item.drawing:current().drawing;
    const image=ecBizDiagramImage(drawing) || (original?item.image:undefined);
    if (!response && !image) {status.textContent='Write an answer or draw a diagram first.';return;}
    button.disabled=true;
    answer.readOnly=true;
    if (retry) retry.disabled=true;
    const report=message=>{if(status.isConnected)status.textContent=message;};
    report('Marking on this device…');
    try {
      const grade=await ecbizMarking.grade(q.id,response,image,report);
      if (!original && JSON.stringify(drawing)!==JSON.stringify(current().drawing)) {
        report('Your diagram changed during marking. Submit it again for an updated mark.');
        return;
      }
      if(!(original?refreshArchivedMark(mock,item,grade):save({answer:response,drawing,grade}))) {
        report('The mark could not be saved. Check the available browser storage.');
        return;
      }
      if(form.isConnected){render(false);document.querySelector('#revision-save-status').textContent='Mark saved.';}
    } catch(error) {report(error.message);} finally {button.disabled=false;answer.readOnly=false;if(retry)retry.disabled=false;}
  };
  form.onsubmit=event=>{event.preventDefault();void run(false);};
  const retry=form.querySelector('#retry-archived-mark');
  if (retry) retry.onclick=()=>run(true);
}
