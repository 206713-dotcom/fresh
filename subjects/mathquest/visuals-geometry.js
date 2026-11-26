const purple = '#5b42ad';
const teal = '#14756a';
const ink = '#251c38';
const grid = '#e6deef';
const purpleFill = '#eee5ff';
const tealFill = '#dff0ec';
const radians = degrees => degrees * Math.PI / 180;
const number = value => String(Number(value.toFixed(2))).replace('-', '−');
const degrees = value => number(value) + '°';
const pair = ([x,y]) => '(' + number(x) + ', ' + number(y) + ')';

function line(ctx, points, {stroke=purple, fill, width=3.5, closed=false}={}) {
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  if (closed) ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function label(ctx, value, x, y, {color=ink, size=21, align='left'}={}) {
  ctx.fillStyle = color;
  ctx.font = '600 ' + size + 'px system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value,x,y);
}

function dot(ctx, [x,y], color) {
  ctx.beginPath();
  ctx.arc(x,y,4.8,0,Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function rightAngle(ctx, vertex, sideA, sideB, size=17) {
  const [x,y] = vertex;
  const along = ([px,py]) => {
    const ratio = size / Math.hypot(px-x,py-y);
    return [(px-x)*ratio,(py-y)*ratio];
  };
  const [ax,ay] = along(sideA);
  const [bx,by] = along(sideB);
  line(ctx,[[x+ax,y+ay],[x+ax+bx,y+ay+by],[x+bx,y+by]],{stroke:ink,width:2});
}

const triangle = (ctx, points, stroke=purple, fill=purpleFill) => line(ctx,points,{stroke,fill,closed:true});

function swatch(ctx, color, text, x, y) {
  line(ctx,[[x,y],[x+22,y]],{stroke:color,width:5});
  label(ctx,text,x+34,y);
}

function coordinateGrid(ctx, origin, bounds) {
  const [ox,oy] = origin;
  const [left,right,bottom,top] = bounds;
  const scale = 24;
  const point = ([x,y]) => [ox+x*scale,oy-y*scale];
  for (let x=left; x<=right; x++) {
    line(ctx,[point([x,bottom]),point([x,top])],{stroke:x === 0 ? '#9d90b1' : grid,width:x === 0 ? 1.8 : 1});
  }
  for (let y=bottom; y<=top; y++) {
    line(ctx,[point([left,y]),point([right,y])],{stroke:y === 0 ? '#9d90b1' : grid,width:y === 0 ? 1.8 : 1});
  }
  label(ctx,'x',point([right,0])[0]+10,oy);
  label(ctx,'y',ox+8,point([0,top])[1]-12);
  return point;
}

function arrow(ctx, from, to, color) {
  const [x,y] = to;
  const [fx,fy] = from;
  const distance = Math.hypot(x-fx,y-fy);
  if (!distance) return;
  const ux = (x-fx)/distance;
  const uy = (y-fy)/distance;
  line(ctx,[from,to],{stroke:color,width:2});
  line(ctx,[[x-12*ux-5*uy,y-12*uy+5*ux],to,[x-12*ux+5*uy,y-12*uy-5*ux]],{stroke:color,width:2});
}

export const geometryVisuals = {
  pythagoras: {
    title:'Pythagoras’ theorem in action',
    description:'Change the two shorter sides. Compare the areas of their squares with the area of the square on the hypotenuse.',
    controls:[
      {key:'a',label:'Horizontal side a',min:3,max:12,initial:5},
      {key:'b',label:'Vertical side b',min:3,max:12,initial:12}
    ],
    draw(ctx,{a,b}) {
      const corner = [87,222];
      const horizontal = [87 + a*14,222];
      const vertical = [87,222 - b*14];
      const cSquared = a*a + b*b;
      const c = Math.sqrt(cSquared);
      triangle(ctx,[corner,horizontal,vertical]);
      rightAngle(ctx,corner,horizontal,vertical);
      label(ctx,'a = ' + a,(corner[0]+horizontal[0])/2,248,{align:'center'});
      label(ctx,'b = ' + b,12,(corner[1]+vertical[1])/2);
      label(ctx,'c ' + (Number.isInteger(c) ? '= ' : '≈ ') + number(c),(vertical[0]+horizontal[0])/2+13,(vertical[1]+horizontal[1])/2-20);

      const barX = 341;
      const barWidth = 208;
      const share = a*a/cSquared * barWidth;
      label(ctx,'Areas of the squares',barX,49,{size:23});
      label(ctx,'a² + b²',barX,85);
      ctx.fillStyle = purple;
      ctx.fillRect(barX,103,share,26);
      ctx.fillStyle = teal;
      ctx.fillRect(barX+share,103,barWidth-share,26);
      label(ctx,'c²',barX,153);
      ctx.fillStyle = '#766485';
      ctx.fillRect(barX,171,barWidth,26);
      label(ctx,a*a + ' + ' + b*b + ' = ' + cSquared,barX,225,{size:23});
    },
    readout({a,b}) {
      const cSquared = a*a + b*b;
      const c = Math.sqrt(cSquared);
      return a + '² + ' + b + '² = ' + cSquared + '. The hypotenuse is ' +
        (Number.isInteger(c) ? number(c) : 'about ' + number(c)) + ' units.';
    }
  },
  'right-trig': {
    title:'A ramp that changes angle',
    description:'Change the ramp’s angle or length to see how its vertical rise and horizontal run change.',
    controls:[
      {key:'angle',label:'Ramp angle',min:15,max:70,initial:30,format:degrees},
      {key:'length',label:'Ramp length',min:2,max:8,step:.5,initial:4,format:value=>number(value)+' m'}
    ],
    draw(ctx,{angle,length}) {
      const theta = radians(angle);
      const run = length * Math.cos(theta);
      const rise = length * Math.sin(theta);
      const start = [83,222];
      const foot = [83 + run*25,222];
      const top = [foot[0],222 - rise*25];
      triangle(ctx,[start,foot,top]);
      line(ctx,[start,foot],{stroke:ink});
      line(ctx,[foot,top],{stroke:teal});
      rightAngle(ctx,foot,start,top,Math.min(17,rise*8));
      ctx.beginPath();
      ctx.arc(start[0],start[1],Math.min(40,length*12),-theta,0);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.stroke();
      label(ctx,'θ = ' + degrees(angle),start[0],247);
      swatch(ctx,purple,'Hypotenuse: ' + number(length) + ' m',326,100);
      swatch(ctx,teal,'Opposite: ' + number(rise) + ' m',326,145);
      swatch(ctx,ink,'Adjacent: ' + number(run) + ' m',326,190);
    },
    readout({angle,length}) {
      const theta = radians(angle);
      return 'At ' + degrees(angle) + ' on a ' + number(length) + ' m ramp, rise = ' +
        number(length*Math.sin(theta)) + ' m and horizontal run = ' + number(length*Math.cos(theta)) +
        ' m, rounded to two decimal places.';
    }
  },
  'circle-right': {
    title:'A right angle anywhere on the arc',
    description:'Move P along the semicircle. The two sides change length, but the angle opposite the diameter stays a right angle.',
    controls:[{key:'position',label:'Position of P from B',min:25,max:155,initial:65,format:degrees}],
    draw(ctx,{position}) {
      const center = [232,142];
      const radius = 103;
      const a = [center[0]-radius,center[1]];
      const b = [center[0]+radius,center[1]];
      const dx = Math.cos(radians(position));
      const dy = -Math.sin(radians(position));
      const p = [center[0]+radius*dx,center[1]+radius*dy];
      ctx.beginPath();
      ctx.arc(center[0],center[1],radius,0,Math.PI*2);
      ctx.strokeStyle = '#a38ecf';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      triangle(ctx,[a,p,b]);
      line(ctx,[a,b],{stroke:teal});
      rightAngle(ctx,p,a,b);
      dot(ctx,a,teal);
      dot(ctx,b,teal);
      dot(ctx,p,purple);
      label(ctx,'A',a[0]-20,a[1],{align:'center'});
      label(ctx,'B',b[0]+20,b[1],{align:'center'});
      label(ctx,'P',p[0]+dx*19,p[1]+dy*19,{align:'center'});
      label(ctx,'Diameter AB',center[0],center[1]+28,{align:'center',color:teal});
      label(ctx,'Angle APB',418,108,{color:purple});
      label(ctx,'90°',418,150,{size:46});
    },
    readout({position}) {
      return 'Angle APB is always 90° because AB is a diameter. Angle PAB is ' + degrees(position/2) +
        ' and angle PBA is ' + degrees(90-position/2) + '.';
    }
  },
  transform: {
    title:'Translate a triangle',
    description:'Change the horizontal and vertical movement. Every vertex moves by the same amount, so the shape and orientation stay the same.',
    controls:[
      {key:'dx',label:'Horizontal movement',min:-3,max:5,initial:4,format:number},
      {key:'dy',label:'Vertical movement',min:-3,max:3,initial:-1,format:number}
    ],
    draw(ctx,{dx,dy}) {
      const point = coordinateGrid(ctx,[200,162],[-6,6,-4,5]);
      const original = [[-2,0],[0,0],[-1,2]];
      const image = original.map(([x,y]) => [x+dx,y+dy]);
      triangle(ctx,original.map(point));
      ctx.save();
      ctx.setLineDash([7,4]);
      triangle(ctx,image.map(point),teal,dx || dy ? tealFill : undefined);
      ctx.restore();
      arrow(ctx,point(original[0]),point(image[0]),teal);
      dot(ctx,point(original[0]),purple);
      dot(ctx,point(image[0]),teal);
      swatch(ctx,purple,'Original',391,77);
      swatch(ctx,teal,'Image',391,119);
      label(ctx,'A → A′',391,171,{size:22});
      label(ctx,pair(original[0]) + ' → ' + pair(image[0]),391,207);
    },
    readout({dx,dy}) {
      return 'Translation by ' + pair([dx,dy]) + ' moves A from (−2, 0) to ' + pair([-2+dx,dy]) +
        '. All three vertices move by the same vector.';
    }
  },
  enlarge: {
    title:'Enlarge from a fixed centre',
    description:'Change the scale factor. The dashed line shows that A and its image stay in line with the fixed centre C.',
    controls:[{key:'factor',label:'Scale factor',min:.5,max:2.5,step:.25,initial:1.5,format:number}],
    draw(ctx,{factor}) {
      const point = coordinateGrid(ctx,[141,212],[-4,10,-2,7]);
      const center = [-2,-1];
      const original = [[0,0],[2,0],[0,2]];
      const image = original.map(([x,y]) => [center[0]+factor*(x-center[0]),center[1]+factor*(y-center[1])]);
      triangle(ctx,original.map(point));
      ctx.save();
      ctx.setLineDash([7,4]);
      triangle(ctx,image.map(point),teal,factor === 1 ? undefined : tealFill);
      line(ctx,[point(center),point([4,2])],{stroke:ink,width:1.7});
      ctx.restore();
      dot(ctx,point(original[0]),purple);
      dot(ctx,point(image[0]),teal);
      dot(ctx,point(center),ink);
      label(ctx,'C',point(center)[0]-12,point(center)[1]+14,{align:'center'});
      swatch(ctx,purple,'Original',411,78);
      swatch(ctx,teal,'Image',411,120);
      label(ctx,'A′ = ' + pair(image[0]),411,181,{size:22});
    },
    readout({factor}) {
      const image = [-2 + factor*2,-1 + factor];
      return 'At scale factor ' + number(factor) + ', A at (0, 0) maps to ' + pair(image) +
        ' about C at (−2, −1). Each side is ' + number(factor) + ' times as long.';
    }
  }
};
