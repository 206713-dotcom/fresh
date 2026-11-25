const purple = '#6045d2';
const muted = '#506078';

function graph(ctx,w,h,{origin,scale,xLabel='x',yLabel='y',curves=[],marks=[],region}) {
  const [ox,oy] = origin;
  const [sx,sy] = scale;
  const x = value => ox + value * sx;
  const y = value => oy - value * sy;
  ctx.strokeStyle = '#e8e4f7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let px=ox % sx;px<w;px+=sx) {
    ctx.moveTo(px,8); ctx.lineTo(px,h-8);
  }
  for (let py=oy % sy;py<h;py+=sy) {
    ctx.moveTo(8,py); ctx.lineTo(w-8,py);
  }
  ctx.stroke();
  ctx.strokeStyle = '#717c91';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(8,oy); ctx.lineTo(w-12,oy); ctx.moveTo(ox,h-8); ctx.lineTo(ox,10); ctx.stroke();
  ctx.fillStyle = muted;
  ctx.font = '16px system-ui';
  ctx.fillText(xLabel,w-77,oy+22);
  ctx.fillText(yLabel,ox+9,25);
  if (region) {
    const [start,end,fn] = region;
    ctx.beginPath(); ctx.moveTo(x(start),oy);
    for (let i=0;i<=100;i++) {
      const t=start+(end-start)*i/100;
      ctx.lineTo(x(t),y(fn(t)));
    }
    ctx.lineTo(x(end),oy); ctx.closePath();
    ctx.fillStyle = '#b9a7f8aa'; ctx.fill();
  }
  ctx.save();
  ctx.beginPath(); ctx.rect(8,8,w-16,h-16); ctx.clip();
  ctx.strokeStyle = purple;
  ctx.lineWidth = 3.5;
  for (const [start,end,fn] of curves) {
    ctx.beginPath();
    for (let i=0;i<=180;i++) {
      const t=start+(end-start)*i/180;
      const px=x(t),py=y(fn(t));
      if (i===0) ctx.moveTo(px,py);
      else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }
  for (const [a,b,label] of marks) {
    ctx.fillStyle = purple;
    ctx.beginPath(); ctx.arc(x(a),y(b),4.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#263354';
    ctx.fillText(label,x(a)+8,y(b)-7);
  }
  ctx.restore();
  return {x,y};
}

function triangle(ctx,{points,sideLabels,corner,angle}) {
  ctx.beginPath();
  points.forEach(([x,y],i)=>i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath(); ctx.fillStyle='#eae2ff'; ctx.fill();
  ctx.lineWidth=3.5; ctx.strokeStyle=purple; ctx.stroke();
  if (corner) {
    const [cx,cy,sx,sy] = corner;
    ctx.beginPath(); ctx.moveTo(cx+sx*20,cy); ctx.lineTo(cx+sx*20,cy+sy*20); ctx.lineTo(cx,cy+sy*20); ctx.stroke();
  }
  ctx.fillStyle='#263354'; ctx.font='20px system-ui';
  for (const [value,x,y] of sideLabels) ctx.fillText(value,x,y);
  if (angle) {
    ctx.beginPath(); ctx.arc(...angle); ctx.stroke();
  }
}

const diagram = {
  coordinates:(ctx,w,h) => graph(ctx,w,h,{origin:[175,258],scale:[48,23],curves:[[-3,8,x=>2*x]],marks:[[1,2,'(1, 2)'],[4,8,'(4, 8)']]}),
  graphs:(ctx,w,h) => graph(ctx,w,h,{origin:[320,147],scale:[57,26],curves:[[-5,5,x=>x*x-4]],marks:[[-2,0,'−2'],[2,0,'2']]}),
  'motion-graphs':(ctx,w,h) => graph(ctx,w,h,{origin:[95,249],scale:[55,15],xLabel:'Time (s)',yLabel:'Speed (m/s)',region:[0,8,x=>1.5*x],curves:[[0,8,x=>1.5*x]],marks:[[8,12,'(8, 12)']]}),
  integration:(ctx,w,h) => graph(ctx,w,h,{origin:[185,246],scale:[121,15],region:[0,2,x=>3*x*x+1],curves:[[-1.6,2.7,x=>3*x*x+1]],marks:[[0,1,'(0, 1)'],[2,13,'(2, 13)']]}),
  pythagoras:ctx => triangle(ctx,{points:[[177,228],[177,48],[252,228]],sideLabels:[['12',140,142],['5',204,257],['13',229,137]],corner:[177,228,1,-1]}),
  'right-trig':ctx => triangle(ctx,{points:[[136,224],[447,224],[447,44]],sideLabels:[['4 m',282,109],['2 m',463,145],['30°',194,209]],corner:[447,224,-1,-1],angle:[136,224,52,-Math.PI/6,0]}),
  'circle-right':ctx => {
    ctx.strokeStyle='#ac91e9'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(315,180,117,0,Math.PI*2); ctx.stroke();
    triangle(ctx,{points:[[198,180],[315,63],[432,180]],sideLabels:[['A',169,186],['P',309,49],['B',444,186],['Diameter',268,208]]});
    ctx.strokeStyle=purple; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(303,75); ctx.lineTo(315,87); ctx.lineTo(327,75); ctx.stroke();
  },
  'circle-coordinates':(ctx,w,h) => {
    const {x,y}=graph(ctx,w,h,{origin:[259,115],scale:[24,24],marks:[[3,-2,'(3, −2)']]});
    ctx.strokeStyle=purple; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(x(3),y(-2),120,0,Math.PI*2); ctx.stroke();
  }
};

export function drawDiagrams() {
  for (const canvas of document.querySelectorAll('canvas[data-diagram]')) {
    const w=640,h=285;
    const density=Math.min(window.devicePixelRatio || 1,2);
    canvas.width=w*density; canvas.height=h*density;
    const ctx=canvas.getContext('2d');
    if (!ctx) continue;
    ctx.scale(density,density);
    diagram[canvas.dataset.diagram]?.(ctx,w,h);
  }
}
