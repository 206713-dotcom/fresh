export const curveRatios = [[3,2],[5,4],[5,6]];

let dispose = () => {};

export function mountHeroCurve(paused) {
  dispose();
  const canvas = document.querySelector('[data-hero-curve]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const [a,b] = curveRatios[Number(canvas.dataset.heroCurve)] ?? curveRatios[0];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  const stars = Array.from({length:86},(_,i)=>[Math.sin(i*437.13)**2,Math.sin(i*173.57+1)**2,i%7===0 ? 1.2 : .6]);
  let frame = 0, last = -Infinity, visible = true, w = 0, h = 0, density = 1;
  const point = (t, phase) => {
    const x = Math.sin(a*t + phase), y = Math.sin(b*t);
    const angle = -.3;
    return [w*.51 + (x*Math.cos(angle)-y*Math.sin(angle))*w*.36,h*.49+(x*Math.sin(angle)+y*Math.cos(angle))*h*.33];
  };
  function size() {
    const box = canvas.getBoundingClientRect();
    w = box.width; h = box.height;
    density = Math.min(devicePixelRatio || 1,1.7);
    canvas.width = Math.round(w*density);
    canvas.height = Math.round(h*density);
  }
  function draw(time) {
    if (!w || !h) return;
    ctx.setTransform(density,0,0,density,0,0);
    ctx.clearRect(0,0,w,h);
    for (const [x,y,r] of stars) {
      ctx.fillStyle = r>1 ? '#d9caff87' : '#b6b9ff66';
      ctx.fillRect(x*w,y*h,r,r);
    }
    const phase = Math.PI/2;
    const gradient = ctx.createLinearGradient(w*.08,h*.17,w*.84,h*.82);
    gradient.addColorStop(0,'#6359ec');
    gradient.addColorStop(.47,'#b49aff');
    gradient.addColorStop(1,'#ffe19f');
    for (let strand=0;strand<13;strand++) {
      const offset = (strand-6)*.032;
      ctx.beginPath();
      for (let i=0;i<=360;i++) {
        const [x,y] = point(i*tau/360,phase+offset);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.globalAlpha = strand===6 ? .9 : .16;
      ctx.lineWidth = strand===6 ? 1.65 : .73;
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }
    ctx.fillStyle = '#f1deff';
    for (let i=0;i<410;i++) {
      const [x,y] = point(i*2.399963,phase+Math.sin(i*3.117)*.17);
      ctx.globalAlpha = i%11===0 ? .74 : .28;
      ctx.fillRect(x,y,i%11===0 ? 1.6 : .85,i%11===0 ? 1.6 : .85);
    }
    ctx.globalAlpha = 1;
    for (let i=0;i<3;i++) {
      const t = time/2300 + i*tau/3;
      for (let j=0;j<30;j++) {
        const [x,y] = point(t-j*.006,phase);
        ctx.globalAlpha = (30-j)/42;
        ctx.beginPath(); ctx.arc(x,y,2.6-j*.052,0,tau);
        ctx.fillStyle = i===1 ? '#c2aeff' : '#ffe5aa';
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function tick(time) {
    frame = 0;
    if (!visible || document.hidden || reduce.matches || paused) return;
    if (time-last>32) { draw(time); last=time; }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    draw(paused || reduce.matches ? 750 : performance.now());
    if (visible && !document.hidden && !reduce.matches && !paused) frame = requestAnimationFrame(tick);
  }
  const resize = new ResizeObserver(()=>{size();sync();});
  const intersection = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  resize.observe(canvas);
  intersection.observe(canvas);
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener?.('change',sync);
  size(); sync();
  dispose=()=>{
    if (frame) cancelAnimationFrame(frame);
    resize.disconnect();
    intersection.disconnect();
    document.removeEventListener('visibilitychange',sync);
    reduce.removeEventListener?.('change',sync);
  };
}
