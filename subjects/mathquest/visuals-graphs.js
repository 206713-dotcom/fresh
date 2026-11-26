const purple = '#5b42ad';
const teal = '#14756a';
const ink = '#251c38';
const bounds = {left:52,right:570,top:40,bottom:244};
const labelFont = '20px system-ui, sans-serif';

function number(value, digits = 4) {
  return String(Number(value.toFixed(digits))).replace('-', '−');
}

const pair = (x,y) => '(' + number(x) + ', ' + number(y) + ')';
const signed = value => value === 0 ? '' : (value < 0 ? ' − ' : ' + ') + number(Math.abs(value));
const equation = (gradient,intercept) => gradient === 0 ? 'y = ' + number(intercept)
  : 'y = ' + (gradient === 1 ? '' : gradient === -1 ? '−' : number(gradient)) + 'x' + signed(intercept);

function legend(ctx,entries) {
  let x = bounds.left;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  for (const [name,color] of entries) {
    ctx.fillStyle = color;
    ctx.fillText(name,x,20);
    x += ctx.measureText(name).width + 26;
  }
}

function plot(ctx,{xRange,yRange,xStep = 1,yStep = 1,labels},draw) {
  const {left,right,top,bottom} = bounds;
  const [xMin,xMax] = xRange;
  const [yMin,yMax] = yRange;
  const x = value => left + (value - xMin) * (right - left) / (xMax - xMin);
  const y = value => bottom - (value - yMin) * (bottom - top) / (yMax - yMin);
  ctx.fillStyle = '#fbf9ff';
  ctx.fillRect(0,0,600,280);
  ctx.font = labelFont;
  legend(ctx,labels);
  ctx.strokeStyle = '#e4dff0';
  ctx.fillStyle = ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.textAlign = 'center';
  for (let tick = Math.ceil(xMin / xStep) * xStep; tick <= xMax; tick += xStep) {
    ctx.moveTo(x(tick),top);
    ctx.lineTo(x(tick),bottom);
    ctx.fillText(number(tick),x(tick),264);
  }
  ctx.textAlign = 'right';
  for (let tick = Math.ceil(yMin / yStep) * yStep; tick <= yMax; tick += yStep) {
    ctx.moveTo(left,y(tick));
    ctx.lineTo(right,y(tick));
    ctx.fillText(number(tick),left - 8,y(tick));
  }
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillText('x',588,264);
  ctx.fillText('y',30,20);
  ctx.strokeStyle = '#847b90';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x(0),top);
  ctx.lineTo(x(0),bottom);
  ctx.moveTo(left,y(0));
  ctx.lineTo(right,y(0));
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(left,top,right - left,bottom - top);
  ctx.clip();
  draw({ctx,x,y,xMin,xMax,yMin,yMax});
  ctx.restore();
}

function path({ctx,x,y},points,{color = purple,width = 3,dashed = false,fill} = {}) {
  ctx.beginPath();
  ctx.moveTo(x(points[0][0]),y(points[0][1]));
  for (const [a,b] of points.slice(1)) ctx.lineTo(x(a),y(b));
  if (fill) {
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    return;
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  if (dashed) ctx.setLineDash([8,5]);
  ctx.stroke();
  if (dashed) ctx.setLineDash([]);
}

function sample(fn,start,end) {
  return Array.from({length:121},(_,index) => {
    const x = start + (end - start) * index / 120;
    return [x,fn(x)];
  });
}

function curve(chart,fn,style) {
  path(chart,sample(fn,chart.xMin,chart.xMax),style);
}

function line(chart,slope,intercept,style) {
  path(chart,[chart.xMin,chart.xMax].map(x => [x,slope * x + intercept]),style);
}

function dot({ctx,x,y},a,b,color = purple) {
  ctx.beginPath();
  ctx.arc(x(a),y(b),5.8,0,Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fbf9ff';
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

const parabolaEquation = (h,k,orientation = 1) =>
  'y = ' + (orientation < 0 ? '−' : '') + (h ? '(x' + signed(-h) + ')²' : 'x²') + signed(k);
const stationaryFn = x => (x ** 3 - 3 * x) / 2;
const stationarySlope = x => (3 * x ** 2 - 3) / 2;
const integrationFn = x => 3 * x ** 2 + 1;
const antiderivative = x => x ** 3 + x;
const square = x => x ** 2;

function intersection(first,second) {
  const x = (first - second) / 3;
  return {x,y:first - x};
}

export const graphVisuals = {
  coordinates:{
    title:'Change the gradient and intercept',
    description:'Move the sliders and compare how far the line rises or falls when x increases by one.',
    controls:[
      {key:'m',label:'Gradient',min:-2,max:2,step:0.5,initial:2,format:number},
      {key:'c',label:'y-intercept',min:-2,max:2,initial:0,format:number}
    ],
    draw(ctx,{m,c}) {
      plot(ctx,{xRange:[-10,10],yRange:[-4.5,4.5],xStep:2,labels:[[equation(m,c),purple],['One unit across',teal]]},chart => {
        line(chart,m,c);
        path(chart,[[0,c],[1,c],[1,m + c]],{color:teal,dashed:true,width:2.5});
        dot(chart,0,c,teal);
        dot(chart,1,m + c);
      });
    },
    readout({m,c}) {
      const change = m === 0 ? 'stays at ' + number(c) : (m > 0 ? 'rises' : 'falls') + ' by ' + number(Math.abs(m));
      return equation(m,c) + '. The line crosses the y-axis at ' + pair(0,c) + '. When x increases from 0 to 1, y ' + change + '.';
    }
  },
  graphs:{
    title:'Slide a parabola through the x-axis',
    description:'Change the vertical shift and look for points where the curve meets the x-axis.',
    controls:[{key:'shift',label:'Vertical shift',min:-4,max:4,initial:-4,format:number}],
    draw(ctx,{shift}) {
      plot(ctx,{xRange:[-5,5],yRange:[-5,9],xStep:2,yStep:2,labels:[[parabolaEquation(0,shift),purple],['x-intercepts',teal]]},chart => {
        curve(chart,x => square(x) + shift);
        dot(chart,0,shift,shift === 0 ? teal : purple);
        if (shift < 0) {
          const root = Math.sqrt(-shift);
          dot(chart,-root,0,teal);
          dot(chart,root,0,teal);
        }
      });
    },
    readout({shift}) {
      const prefix = parabolaEquation(0,shift) + ' has its lowest point at ' + pair(0,shift) + '. ';
      if (shift === 0) return prefix + 'The curve touches the x-axis at x = 0.';
      if (shift > 0) return prefix + 'The whole curve lies above the x-axis, so there are no real roots.';
      const root = Math.sqrt(-shift);
      const roots = Number.isInteger(root) ? 'x = ' + number(-root) + ' and x = ' + number(root) : 'x = ±√' + number(-shift) + ', about ±' + number(root,2);
      return prefix + 'The x-intercepts solve x² = ' + number(-shift) + ', giving ' + roots + '.';
    }
  },
  'graph-transforms':{
    title:'Translate and reflect a parabola',
    description:'Shift the graph in either direction or turn it upside down. The dashed curve shows the original.',
    controls:[
      {key:'h',label:'Horizontal shift',min:-3,max:3,initial:2,format:number},
      {key:'k',label:'Vertical shift',min:-3,max:3,initial:-1,format:number},
      {key:'orientation',label:'Vertical orientation',min:-1,max:1,step:2,initial:1,format:value => value === 1 ? 'Upright' : 'Reflected'}
    ],
    draw(ctx,{h,k,orientation}) {
      plot(ctx,{xRange:[-7,7],yRange:[-8,8],xStep:2,yStep:2,labels:[['y = x² · dashed',ink],[parabolaEquation(h,k,orientation),purple]]},chart => {
        curve(chart,x => orientation * square(x - h) + k);
        curve(chart,square,{color:ink,dashed:true,width:2});
        dot(chart,h,k,teal);
      });
    },
    readout({h,k,orientation}) {
      return parabolaEquation(h,k,orientation) + '. The original vertex ' + pair(0,0) + ' moves to ' + pair(h,k) + '. The new parabola opens ' + (orientation < 0 ? 'downwards' : 'upwards') + '.';
    }
  },
  'linear-systems':{
    title:'Find where two lines meet',
    description:'Change either intercept. The dot is the point with the same x and y on both lines.',
    controls:[
      {key:'first',label:'First y-intercept',min:6,max:12,initial:9},
      {key:'second',label:'Second y-intercept',min:-6,max:0,initial:-3,format:number}
    ],
    draw(ctx,{first,second}) {
      const {x,y} = intersection(first,second);
      plot(ctx,{xRange:[-1,9],yRange:[-2,12],xStep:2,yStep:2,labels:[[equation(-1,first),purple],[equation(2,second),teal]]},chart => {
        line(chart,-1,first);
        line(chart,2,second,{color:teal,dashed:true});
        dot(chart,x,y,ink);
      });
    },
    readout({first,second}) {
      const {x,y} = intersection(first,second);
      const result = Number.isInteger(x) ? pair(x,y) : 'approximately ' + pair(x,y);
      return equation(-1,first) + ' and ' + equation(2,second) + ' meet at ' + result + '. Setting the expressions for y equal gives 3x = ' + number(first - second) + '.';
    }
  },
  'derivative-rules':{
    title:'Bring a secant towards a tangent',
    description:'Move the two points closer together to see how the secant gradient approaches the tangent gradient.',
    controls:[
      {key:'a',label:'First point x',min:-2,max:2,step:0.5,initial:1,format:number},
      {key:'h',label:'Gap to second point',min:-1.5,max:1.5,step:0.25,initial:1,format:number}
    ],
    draw(ctx,{a,h}) {
      plot(ctx,{xRange:[-4,4],yRange:[-3,15],xStep:2,yStep:3,labels:[['y = x²',purple],['Tangent',teal],...(h ? [['Secant · dashed',ink]] : [])]},chart => {
        curve(chart,square);
        line(chart,2 * a,-square(a),{color:teal});
        if (h !== 0) {
          line(chart,2 * a + h,square(a) - (2 * a + h) * a,{color:ink,dashed:true,width:2});
          dot(chart,a + h,square(a + h),ink);
        }
        dot(chart,a,square(a),teal);
      });
    },
    readout({a,h}) {
      const prefix = 'At x = ' + number(a) + ', the tangent to y = x² has gradient ' + number(2 * a) + '. ';
      return prefix + (h === 0 ? 'The two points coincide. The tangent gives the limiting gradient.'
        : 'The second point is ' + pair(a + h,square(a + h)) + '. The secant gradient is ' + number(2 * a + h) + '.');
    }
  },
  stationary:{
    title:'Explore tangents, normals and stationary points',
    description:'Slide the marked point along the cubic. The dashed normal meets the solid tangent at a right angle.',
    controls:[{key:'a',label:'Point x',min:-2,max:2,step:0.25,initial:-1,format:number}],
    draw(ctx,{a}) {
      const slope = stationarySlope(a);
      const y = stationaryFn(a);
      const yLimit = 1.4;
      const xLimit = yLimit * (bounds.right - bounds.left) / (bounds.bottom - bounds.top);
      plot(ctx,{xRange:[-xLimit,xLimit],yRange:[-yLimit,yLimit],yStep:0.5,labels:[['y = (x³ − 3x)/2',purple],['Tangent',teal],['Normal · dashed',ink]]},chart => {
        curve(chart,stationaryFn);
        line(chart,slope,y - slope * a,{color:teal});
        if (slope) {
          const normal = -1 / slope;
          line(chart,normal,y - normal * a,{color:ink,dashed:true,width:2});
        } else {
          path(chart,[[a,chart.yMin],[a,chart.yMax]],{color:ink,dashed:true,width:2});
        }
        dot(chart,a,y,teal);
      });
    },
    readout({a}) {
      const slope = stationarySlope(a);
      const prefix = 'At ' + pair(a,stationaryFn(a)) + ' the tangent gradient is ' + number(slope) + '. ';
      if (slope === 0) return prefix + 'This is a local ' + (a < 0 ? 'maximum' : 'minimum') + '. The normal is the vertical line x = ' + number(a) + '.';
      return prefix + 'The normal gradient is the negative reciprocal, approximately ' + number(-1 / slope) + '.';
    }
  },
  integration:{
    title:'Measure area under a curve',
    description:'Move either endpoint to change the shaded region and compare it with the definite integral.',
    controls:[
      {key:'lower',label:'Lower limit',min:0,max:2.5,step:0.25,initial:0},
      {key:'upper',label:'Upper limit',min:0,max:3,step:0.25,initial:2}
    ],
    draw(ctx,{lower,upper}) {
      const start = Math.min(lower,upper);
      const end = Math.max(lower,upper);
      plot(ctx,{xRange:[-0.5,3.5],yRange:[-2,31],yStep:5,labels:[['y = 3x² + 1',purple],['Shaded area',teal]]},chart => {
        path(chart,[[start,0],...sample(integrationFn,start,end),[end,0]],{fill:'#14756a35'});
        path(chart,[[lower,0],[lower,integrationFn(lower)]],{color:teal,dashed:true,width:2});
        path(chart,[[upper,0],[upper,integrationFn(upper)]],{color:teal,dashed:true,width:2});
        curve(chart,integrationFn);
        dot(chart,lower,integrationFn(lower),teal);
        dot(chart,upper,integrationFn(upper),teal);
      });
    },
    readout({lower,upper}) {
      const integral = antiderivative(upper) - antiderivative(lower);
      const prefix = 'From x = ' + number(lower) + ' to x = ' + number(upper) + ', the definite integral is ' + number(integral,6) + '. ';
      if (integral === 0) return prefix + 'The limits coincide, so the shaded area is zero.';
      return prefix + 'The shaded area is ' + number(Math.abs(integral),6) + ' square units.' +
        (integral < 0 ? ' The reversed limits make the definite integral negative.' : '');
    }
  }
};
