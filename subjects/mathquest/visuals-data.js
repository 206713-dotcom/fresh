const ink = '#251c38';
const purple = '#5b42ad';
const teal = '#14756a';
const muted = '#524965';
const grid = '#ddd5ec';
const faint = '#ece6f6';

function text(ctx, value, x, y, {color=ink, size=23, align='center'}={}) {
  ctx.fillStyle = color;
  ctx.font = '600 ' + size + 'px system-ui';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value,x,y);
}

function line(ctx, x1, y1, x2, y2, color, width=2) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function dot(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x,y,radius,0,2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

const format = value => Number(value.toFixed(2)).toLocaleString('en');
const percent = value => format(100 * value) + '%';

function drawTree(ctx, reds, replace) {
  const blues = 10 - reds;
  const second = replace ? 10 : 9;
  const same = replace ? 0 : 1;
  const start = [63,151], upper = [223,91], lower = [223,204];
  const ends = [[485,56],[485,116],[485,181],[485,242]];
  const branch = (from,to,value) => {
    line(ctx,...from,...to,grid,3);
    const x = (from[0] + to[0]) / 2, y = (from[1] + to[1]) / 2;
    ctx.fillStyle = '#faf8ff';
    ctx.fillRect(x - 24,y - 13,48,26);
    text(ctx,value,x,y,{color:muted,size:20});
  };
  const node = ([x,y], letter, color) => {
    dot(ctx,x,y,17,color);
    text(ctx,letter,x,y,{color:'white',size:20});
  };
  text(ctx,'First draw',223,27);
  text(ctx,'Second draw',485,27);
  branch(start,upper,reds + '/10');
  branch(start,lower,blues + '/10');
  branch(upper,ends[0],(reds - same) + '/' + second);
  branch(upper,ends[1],blues + '/' + second);
  branch(lower,ends[2],reds + '/' + second);
  branch(lower,ends[3],(blues - same) + '/' + second);
  dot(ctx,...start,8,ink);
  node(upper,'R','#a93451');
  node(lower,'B','#2d6292');
  ends.forEach((point,i) => node(point,i % 2 ? 'B' : 'R',i % 2 ? '#2d6292' : '#a93451'));
}

function treeVisual(replace) {
  return {
    title: replace ? 'Follow a probability tree' : 'See how removing a counter changes the odds',
    description: replace ? 'Adjust the mix of red and blue counters. The first counter goes back before the second draw.'
      : 'Adjust the mix of red and blue counters. Keep the first counter out and watch the odds change on the second draw.',
    controls:[{key:'reds',label:'Red counters in the bag',min:1,max:9,initial:4}],
    draw(ctx,{reds}) { drawTree(ctx,reds,replace); },
    readout({reds}) {
      const next = replace ? reds : reds - 1, total = replace ? 10 : 9;
      return 'After drawing red first, ' + next + ' of ' + total + ' counters are red. P(red then red) = ' +
        reds + '/10 × ' + next + '/' + total + ' = ' + percent(reds * next / (10 * total)) + '.';
    }
  };
}

export const dataVisuals = {
  probability: {
    title:'Count the outcomes',
    description:'Change how many counters are purple. Each of the 12 counters has the same chance of being picked.',
    controls:[{key:'selected',label:'Purple counters',min:0,max:12,initial:5}],
    draw(ctx,{selected}) {
      text(ctx,'12 equally likely counters',300,42,{size:25});
      for (let i=0;i<12;i++) {
        const x = 108 + (i % 6) * 77;
        const y = 105 + Math.floor(i / 6) * 70;
        dot(ctx,x,y,26,i < selected ? purple : faint);
        if (i < selected) text(ctx,'✓',x,y,{color:'white',size:24});
      }
      text(ctx,selected + ' purple',175,235,{color:purple});
      text(ctx,(12 - selected) + ' other',425,235,{color:muted});
    },
    readout({selected}) {
      return 'P(purple) = ' + selected + '/12, about ' + percent(selected / 12) +
        '. P(not purple) = ' + (12 - selected) + '/12. The two probabilities add to 1.';
    }
  },
  frequency: {
    title:'Predict how often an event happens',
    description:'Change the number of trials or the chance of success to see how the expected frequency changes.',
    controls:[
      {key:'trials',label:'Number of trials',min:10,max:200,step:10,initial:80},
      {key:'chance',label:'Chance of success',min:0,max:100,step:5,initial:35,format:value=>value + '%'}
    ],
    draw(ctx,{trials,chance}) {
      const start = 56, width = 488;
      text(ctx,trials + ' trials in total',300,65,{size:26});
      ctx.fillStyle = faint;
      ctx.fillRect(start,113,width,58);
      ctx.fillStyle = teal;
      ctx.fillRect(start,113,width * chance / 100,58);
      ctx.strokeStyle = grid;
      ctx.lineWidth = 2;
      ctx.strokeRect(start,113,width,58);
      text(ctx,'Expected successes: ' + format(trials * chance / 100),300,220,{color:teal,size:25});
    },
    readout({trials,chance}) {
      return 'Expected successes = ' + trials + ' × ' + chance + '/100 = ' + format(trials * chance / 100) +
        '. The actual number in an experiment can be different.';
    }
  },
  'combined-prob':treeVisual(true),
  conditional:treeVisual(false),
  averages: {
    title:'Move a value and compare averages',
    description:'Move the fifth data value. Watch how the mean and median respond.',
    controls:[{key:'outlier',label:'Fifth data value',min:8,max:20,initial:12}],
    draw(ctx,{outlier}) {
      const x = value => 61 + value * 24;
      const mean = (20 + outlier) / 5;
      const median = 6;
      line(ctx,x(0),137,x(20),137,grid,3);
      for (let i=0;i<=20;i+=2) {
        line(ctx,x(i),132,x(i),143,muted,2);
        text(ctx,i,x(i),166,{color:muted,size:20});
      }
      for (const value of [2,4,6,8]) dot(ctx,x(value),116,9,purple);
      dot(ctx,x(outlier),84,12,purple);
      text(ctx,outlier,x(outlier),54,{color:purple});
      line(ctx,x(mean),191,x(mean),211,teal,3);
      line(ctx,x(median),228,x(median),248,purple,3);
      text(ctx,'Mean ' + format(mean),x(mean)+14,200,{color:teal,align:'left'});
      text(ctx,'Median 6',x(median)+14,238,{color:purple,align:'left'});
    },
    readout({outlier}) {
      return 'Data: 2, 4, 6, 8 and ' + outlier + '. Mean = (20 + ' + outlier + ')/5 = ' +
        format((20 + outlier) / 5) + '. The middle value stays 6, so the median stays 6.';
    }
  },
  histograms: {
    title:'See how area represents frequency',
    description:'Change the frequency in the widest class. Compare its width, height and area with the other bars.',
    controls:[{key:'middle',label:'Frequency in the 10 to 30 class',min:0,max:60,step:2,initial:18}],
    draw(ctx,{middle}) {
      const x = value => 88 + value * 11.2;
      const y = value => 220 - value * 54;
      text(ctx,'Frequency density',x(0),29,{align:'left'});
      for (let tick=0;tick<=3;tick++) {
        line(ctx,x(0),y(tick),x(40),y(tick),grid);
        text(ctx,tick,x(0)-25,y(tick),{color:muted,size:20});
      }
      const bars = [[0,10,12,purple],[10,30,middle,teal],[30,40,10,purple]];
      for (const [lo,hi,count,color] of bars) {
        const height = y(0) - y(count / (hi - lo));
        ctx.fillStyle = color;
        ctx.fillRect(x(lo),y(0) - height,x(hi)-x(lo),height);
        ctx.strokeStyle = '#faf8ff';
        ctx.strokeRect(x(lo),y(0) - height,x(hi)-x(lo),height);
      }
      line(ctx,x(0),y(0),x(40),y(0),ink);
      line(ctx,x(0),y(0),x(0),y(3),ink);
      for (const tick of [0,10,30,40]) text(ctx,tick,x(tick),243,{color:muted,size:20});
    },
    readout({middle}) {
      return 'The 10 to 30 class is 20 units wide. Its frequency density is ' + middle + ' ÷ 20 = ' +
        format(middle / 20) + '. Width × height gives the frequency, ' + middle + '.';
    }
  }
};
