/* Source annotations and drawing tools shared by mock exams and corrections. */
function caseSourceText(text, ranges) {
  let end = 0, html = '';
  for (const [from,to] of (ranges ?? []).slice().sort((a,b)=>a[0]-b[0])) {
    const start = Math.max(end,from), stop = Math.min(text.length,to);
    if (stop <= start) continue;
    html += escapeHtml(text.slice(end,start)) + '<mark>' + escapeHtml(text.slice(start,stop)) + '</mark>';
    end = stop;
  }
  return html + escapeHtml(text.slice(end));
}

function mockCaseSource(group, state, review) {
  const data = state.evidence?.[group.index] ?? {};
  const tool = (key,text) => '<button type="button" data-case-pin="' + key + '" aria-pressed="' +
    Boolean(data.pins?.[key]) + '" aria-label="' + escapeHtml('Pin ' + text) + '">Pin</button>';
  const paragraphs = group.stimulus.split('\n\n').map((paragraph,i)=>{
    const key='p'+i;
    return '<div class="source-paragraph"><p data-source-key="' + key + '">' +
      caseSourceText(paragraph,data.highlights?.[key]) + '</p>' + (review?'':tool(key,'source paragraph '+(i+1))) + '</div>';
  }).join('');
  const table = ({caption,headers,rows}, index) => '<div class="mock-data-scroll"><table class="mock-data"><caption>' + escapeHtml(caption) +
    '</caption><thead><tr>' + headers.map(value=>'<th scope="col">' + escapeHtml(value) + '</th>').join('') +
    '</tr></thead><tbody>' + rows.map(([heading,...values],row)=>'<tr><th scope="row">' + escapeHtml(heading) + '</th>' +
      values.map((value,col)=>{
        const key='t'+index+'-'+row+'-'+col, title=heading + ' · ' + headers[col+1] + ' · ' + value;
        return '<td><span data-source-key="' + key + '" data-pin-label="' + escapeHtml(title) + '">' +
          escapeHtml(value) + '</span>' + (review?'':tool(key,title)) + '</td>';
      }).join('') + '</tr>').join('') + '</tbody></table></div>';
  return '<div class="mock-source" data-case-source="' + group.index + '">' + paragraphs + (group.tables ?? []).map(table).join('') +
    (review?'':'<div class="row"><button type="button" data-case-highlight>Highlight selection</button>' +
      '<button type="button" data-case-clear>Clear highlights</button></div><p class="muted">Select text within a paragraph to highlight it. Use Pin to keep a paragraph or table figure next to your answers.</p>' +
      '<p data-case-status role="status"></p>') + '</div>';
}

function mockCasePins(pins = {}) {
  const entries = Object.entries(pins);
  return '<h3>Pinned evidence</h3>' + (entries.length ? '<ul>' + entries.map(([,value]) =>
    '<li>' + escapeHtml(value) + '</li>').join('') + '</ul>' : '<p class="muted">Pin evidence from the source to keep it here while you write.</p>');
}

function setupMockCaseNotes(form, state, save) {
  const selected = new WeakMap();
  for (const source of form.querySelectorAll('[data-case-source]')) {
    const group = source.dataset.caseSource;
    const pins = form.querySelector('[data-case-pins="' + group + '"]');
    function readSelection() {
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) return;
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      const paragraph = (node.nodeType===Node.ELEMENT_NODE?node:node.parentElement)?.closest('p[data-source-key]');
      if (!paragraph || !source.contains(paragraph) || !paragraph.contains(range.endContainer)) return;
      const prefix = document.createRange();
      prefix.selectNodeContents(paragraph);
      prefix.setEnd(range.startContainer,range.startOffset);
      return {key:paragraph.dataset.sourceKey, from:prefix.toString().length, length:range.toString().length};
    }
    const remember = () => { const range=readSelection(); if(range) selected.set(source,range); };
    source.addEventListener('pointerup',remember);
    source.addEventListener('keyup',remember);
    source.addEventListener('click', event=>{
      const button=event.target.closest('button');
      if (!button) return;
      const data = state.evidence?.[group] ?? {pins:{},highlights:{}};
      const next = {pins:{...data.pins},highlights:{...data.highlights}};
      const status = source.querySelector('[data-case-status]');
      if (button.hasAttribute('data-case-highlight')) {
        const range=readSelection() ?? selected.get(source);
        if(!range?.length){status.textContent='Select a passage inside one source paragraph.';return;}
        const spans = [...(next.highlights[range.key] ?? []),[range.from,range.from+range.length]].sort((a,b)=>a[0]-b[0]);
        next.highlights[range.key] = spans.reduce((merged,span)=>{
          const last=merged.at(-1);
          if(last && span[0]<=last[1]) last[1]=Math.max(last[1],span[1]); else merged.push([...span]);
          return merged;
        },[]).slice(0,32);
        selected.delete(source);
      } else if (button.hasAttribute('data-case-clear')) {
        next.highlights={};
        selected.delete(source);
      } else if (button.hasAttribute('data-case-pin')) {
        const key=button.dataset.casePin;
        const label = source.querySelector('[data-source-key="' + key + '"]');
        if (Object.hasOwn(next.pins,key)) delete next.pins[key];
        else if (Object.keys(next.pins).length >= 12) {status.textContent='Unpin a source item before pinning another.';return;}
        else next.pins[key]=label.dataset.pinLabel || label.textContent;
      } else return;
      if (!save({evidence:{...state.evidence,[group]:next}})) return;
      for (const paragraph of source.querySelectorAll('p[data-source-key]')) {
        paragraph.innerHTML=caseSourceText(paragraph.textContent,next.highlights[paragraph.dataset.sourceKey]);
      }
      for (const control of source.querySelectorAll('[data-case-pin]')) {
        control.setAttribute('aria-pressed',String(Object.hasOwn(next.pins,control.dataset.casePin)));
      }
      pins.innerHTML=mockCasePins(next.pins);
      status.textContent = button.hasAttribute('data-case-pin') ?
        (Object.hasOwn(next.pins,button.dataset.casePin)?'Evidence pinned.':'Evidence unpinned.') : 'Highlights updated.';
    });
  }
}

const diagramWidth=640, diagramHeight=410;
const emptyDiagram = () => ({x:'',y:'',shapes:[]});
const diagramBounds = {left:68,right:598,top:50,bottom:350};
const diagramPoint = (x,y) => [
  Math.round(diagramBounds.left + (diagramBounds.right-diagramBounds.left)*x/100),
  Math.round(diagramBounds.bottom - (diagramBounds.bottom-diagramBounds.top)*y/100)
];

function drawEcBizDiagram(canvas, diagram) {
  const ctx=canvas.getContext('2d');
  if (!ctx) return;
  const {left,right,top,bottom}=diagramBounds;
  const line=(a,b)=>{ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();};
  ctx.fillStyle='#fff';ctx.fillRect(0,0,diagramWidth,diagramHeight);
  ctx.strokeStyle='#e5edf0'; ctx.lineWidth=1;
  for(let n=0;n<=10;n++){
    line(diagramPoint(n*10,0),diagramPoint(n*10,100));
    line(diagramPoint(0,n*10),diagramPoint(100,n*10));
  }
  ctx.strokeStyle='#183950';ctx.lineWidth=2;
  line([left,top],[left,bottom]);line([left,bottom],[right,bottom]);
  line([left,top],[left-5,top+8]);line([left,top],[left+5,top+8]);
  line([right,bottom],[right-8,bottom-5]);line([right,bottom],[right-8,bottom+5]);
  ctx.fillStyle='#142f43';ctx.font='17px system-ui';ctx.textAlign='left';
  ctx.fillText(diagram.y || 'Vertical axis',left,33,250);
  ctx.textAlign='center';ctx.fillText(diagram.x || 'Horizontal axis',(right+left)/2,bottom+33,430);
  ctx.textAlign='left';
  for (const shape of diagram.shapes) {
    const [first,...rest]=shape.points;
    ctx.strokeStyle=ctx.fillStyle=shape.color || '#236f79';
    ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
    if (shape.kind==='label') {
      ctx.font='16px system-ui';
      ctx.fillText(shape.text,first[0]+4,first[1]-6,100);
    } else if (shape.kind==='point') {
      ctx.beginPath();ctx.arc(...first,4,0,Math.PI*2);ctx.fill();
      if(shape.text)ctx.fillText(shape.text,first[0]+6,first[1]-7,84);
    } else {
      ctx.beginPath(); ctx.moveTo(...first);
      for (const pt of rest) ctx.lineTo(...pt);
      ctx.stroke();
      if(shape.text)ctx.fillText(shape.text,shape.points.at(-1)[0]+5,shape.points.at(-1)[1]-6,84);
    }
  }
}

function ecBizDiagramImage(diagram) {
  if (!diagram?.shapes.length) return undefined;
  const canvas=document.createElement('canvas');
  canvas.width=diagramWidth; canvas.height=diagramHeight;
  drawEcBizDiagram(canvas,diagram);
  return canvas.toDataURL('image/jpeg',.84);
}

function diagramEditor(key) {
  return '<section class="exam-drawing" data-exam-drawing="' + escapeHtml(key) + '"><h3>Draw your diagram</h3>' +
    '<div class="drawing-fields"><label>Horizontal axis<input data-axis="x" maxlength="40" type="text"></label>' +
    '<label>Vertical axis<input data-axis="y" maxlength="40" type="text"></label>' +
    '<label>Tool<select data-sketch-tool><option value="stroke">Freehand curve</option><option value="line">Straight line</option>' +
    '<option value="point">Point</option><option value="label">Label</option></select></label>' +
    '<label>Curve, point or equilibrium label<input data-sketch-label maxlength="24" placeholder="e.g. D₁ or E₂" type="text"></label></div>' +
    '<canvas width="640" height="410" tabindex="0" aria-label="Diagram grid. Use pointer or coordinate controls." data-drawing-surface></canvas>' +
    '<details><summary>Draw with coordinates</summary><p>Coordinates run from 0 to 100 from the origin. For a curve, use the middle coordinates to bend the line.</p>' +
    '<div class="drawing-fields">' + [['x1','Start X',22],['y1','Start Y',24],['x2','End X',76],['y2','End Y',72],['xm','Middle X',48],['ym','Middle Y',68]].map(([key,label,value])=>
      '<label>' + label + '<input type="number" min="0" max="100" data-coordinate="' + key + '" value="' + value + '"></label>').join('') +
    '</div><button type="button" data-drawing-action="add">Add to diagram</button></details>' +
    '<div class="row"><button type="button" data-drawing-action="undo">Undo last</button>' +
    '<button type="button" data-drawing-action="clear">Clear diagram</button></div><p data-drawing-status role="status"></p></section>';
}

function setupDiagramEditors(root, drawings, save) {
  for (const editor of root.querySelectorAll('[data-exam-drawing]')) {
    const key=editor.dataset.examDrawing, canvas=editor.querySelector('canvas'), tool=editor.querySelector('[data-sketch-tool]');
    const label=editor.querySelector('[data-sketch-label]'), status=editor.querySelector('[data-drawing-status]');
    let diagram=drawings?.[key] ?? emptyDiagram(), points=[], pointer=null;
    const axes=[...editor.querySelectorAll('[data-axis]')];
    for (const input of axes) input.value=diagram[input.dataset.axis] ?? '';
    drawEcBizDiagram(canvas,diagram);
    function commit(next) {
      if (save(key,next)) {
        diagram=next;
        status.textContent=diagram.shapes.length ? 'Diagram saved · ' + diagram.shapes.length + ' drawn items.' : 'Diagram cleared.';
      }
      drawEcBizDiagram(canvas,diagram);
    }
    const pointerPoint = e=>{
      const rect=canvas.getBoundingClientRect(), {left,right,top,bottom}=diagramBounds;
      return [Math.max(left,Math.min(right,Math.round((e.clientX-rect.left)*diagramWidth/rect.width))),
        Math.max(top,Math.min(bottom,Math.round((e.clientY-rect.top)*diagramHeight/rect.height)))];
    };
    function paint(list) {
      const kind=tool.value, text=label.value.trim();
      if (kind==='label' && !text) {status.textContent='Enter a label to place it.';return;}
      if (diagram.shapes.length>=36) {status.textContent='Undo an item before adding another.';return;}
      commit({...diagram,shapes:[...diagram.shapes,{kind,points:list,text}]});
    }
    editor.addEventListener('diagram-photo-saved',()=>{
      diagram=emptyDiagram();
      axes.forEach(input=>{input.value='';});
      drawEcBizDiagram(canvas,diagram);
      status.textContent='Uploaded photo will be submitted.';
    });
    canvas.onpointerdown=e=>{
      if (pointer!==null || e.button!==0) return;
      const point=pointerPoint(e);
      if(tool.value==='point'||tool.value==='label') {paint([point]);return;}
      pointer=e.pointerId;
      points=[point];
      canvas.setPointerCapture(pointer);
    };
    canvas.onpointermove=e=>{
      if(pointer!==e.pointerId)return;
      const point=pointerPoint(e);
      if(tool.value==='stroke' && points.length<95) points.push(point);
      drawEcBizDiagram(canvas,{...diagram,shapes:[...diagram.shapes,{kind:'line',points:[...points,point]}]});
    };
    canvas.onpointerup=e=>{
      if(pointer!==e.pointerId)return;
      pointer=null;
      paint([...points,pointerPoint(e)]);
    };
    canvas.onpointercancel=()=>{pointer=null;drawEcBizDiagram(canvas,diagram);};
    editor.addEventListener('input',event=>{
      const axis=event.target.dataset.axis;
      if(axis) commit({...diagram,[axis]:event.target.value.trim()});
    });
    editor.addEventListener('click',event=>{
      const action=event.target.closest('[data-drawing-action]')?.dataset.drawingAction;
      if(action==='clear') commit({...diagram,shapes:[]});
      if(action==='undo') commit({...diagram,shapes:diagram.shapes.slice(0,-1)});
      if(action==='add') {
        const values=Object.fromEntries([...editor.querySelectorAll('[data-coordinate]')].map(input=>[
          input.dataset.coordinate, Math.min(100,Math.max(0,Number(input.value)||0))
        ]));
        const start=diagramPoint(values.x1,values.y1), end=diagramPoint(values.x2,values.y2);
        const mid=diagramPoint(values.xm,values.ym);
        if(tool.value==='stroke'){
          paint(Array.from({length:21},(_,i)=>{
            const t=i/20,u=1-t;
            return start.map((n,j)=>Math.round(u*u*n+2*u*t*mid[j]+t*t*end[j]));
          }));
        } else paint(tool.value==='line'?[start,end]:[start]);
      }
    });
  }
}

function modelDiagram(part, kind='market') {
  const chart = emptyDiagram();
  const shape=(kind,points,text='',color)=>chart.shapes.push({kind,points:points.map(([x,y])=>diagramPoint(x,y)),text,color});
  const line=(a,b,label,color)=>{
    shape('line',[a,b],'',color); shape('label',[b],label,color);
  };
  if(kind==='ppc'){
    chart.x='Consumer goods'; chart.y='Capital goods';
    const ppc=(size,label,color)=>{
      shape('stroke',Array.from({length:27},(_,i)=>{
        const angle=i/26*Math.PI/2;
        return [size*Math.sin(angle),size*Math.cos(angle)];
      }),'',color);
      shape('label',[[size*.72,size*.74]],label,color);
    };
    ppc(69,'PPC₁','#236f79');
    const inward=part.shift==='in';
    ppc(inward?49:88,'PPC₂','#79539b');
    shape('point',[inward?[55,47]:[49,52]],'A','#182d43');
    return chart;
  }
  const scheme=part.scheme.toLowerCase();
  const legacy=scheme.includes('shift of supply');
  const changing = /only the demand curve/.test(scheme) ? 'demand' : 'supply';
  const increase = legacy ? !scheme.includes('leftward') : /curve right/.test(scheme);
  const labor = scheme.includes('wage rate');
  chart.x=labor?'Quantity of labour':'Quantity';chart.y=labor?'Wage rate':'Price';
  const d='#1b6189',s='#257252', shift='#79539b', grey='#607789';
  line([14,86],[82,18],'D₁',d); line([14,18],[82,86],'S₁',s);
  const delta=increase?17:-17;
  const startX=Math.max(0,14+delta), clipped=startX-(14+delta);
  if(changing==='demand') line([startX,86-clipped],[82+delta,18],'D₂',shift);
  else line([startX,18+clipped],[82+delta,86],'S₂',shift);
  const newQ=48+delta/2,newP=52+(changing==='demand'?delta/2:-delta/2);
  shape('line',[[0,newP],[newQ,newP]],'',grey);
  shape('line',[[newQ,0],[newQ,newP]],'',grey);
  shape('point',[[48,52]],'E₁','#142f43');
  shape('point',[[newQ,newP]],'E₂',shift);
  return chart;
}

function examDiagramPreview(drawing, image, part, kind='market') {
  const submitted=image || ecBizDiagramImage(drawing);
  const example=ecBizDiagramImage(modelDiagram(part,kind));
  const figure=(src,label)=>'<figure><figcaption>' + label + '</figcaption><img src="' + escapeHtml(src) +
    '" alt="' + label + '"></figure>';
  return '<div class="mock-diagram-compare">' + (submitted?figure(submitted,'Your diagram'):'') +
    figure(example,'Model diagram') + '</div>';
}

function freeDiagramPractice(id) {
  const loss=id==='loss';
  return revisionHeading('Diagram practice','Draw a production possibility curve',
    loss?'Show a fall in productive capacity after a flood.':'Show an outward shift after an improvement in technology.') +
    '<div class="row">' + link('Growth exercise','#revision-diagram-draw/growth') + link('Capacity loss exercise','#revision-diagram-draw/loss') +
    link('Back to diagram exercises','#revision-diagrams') + '</div><section class="panel" id="free-drawing">' +
    diagramEditor(loss?'loss':'growth') + '<button type="button" id="compare-ppc">Compare with model</button><div id="free-comparison"></div></section>';
}

function setupFreeDiagramPractice(id) {
  const root=document.querySelector('#free-drawing'), key=id==='loss'?'loss':'growth';
  const drawings=revisionState('free-diagrams',{});
  setupDiagramEditors(root,drawings, (id,diagram)=>{
    if(!saveRevisionState('free-diagrams',{...drawings,[id]:diagram}))return false;
    drawings[id]=diagram;return true;
  });
  root.querySelector('#compare-ppc').onclick=()=>{
    root.querySelector('#free-comparison').innerHTML=examDiagramPreview(drawings[key],null,{shift:key==='loss'?'in':'out'},'ppc');
  };
}
