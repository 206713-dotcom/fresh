const purple = '#5b42ad';
const teal = '#14756a';
const ink = '#251c38';
const muted = '#5d536e';
const grid = '#ded7ef';
const empty = '#eee8fa';
const surface = '#faf8ff';

function numberLabel(value) {
  return String(value).replace(/^-/, '−');
}

function rounded(value, places = 2) {
  const result = Number(value.toFixed(places));
  return {label:numberLabel(result), approximate:Math.abs(value - result) > 1e-9};
}

function money(value) {
  return 'RM' + (Number.isInteger(value) ? value : value.toFixed(2));
}

function signedPercent(value) {
  return (value > 0 ? '+' : '') + numberLabel(value) + '%';
}

function resetSurface(ctx) {
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, 600, 280);
}

function label(ctx, text, x, y, {size = 22, color = ink, bold = false, align = 'left'} = {}) {
  ctx.fillStyle = color;
  ctx.font = (bold ? '700 ' : '500 ') + size + 'px system-ui';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function dot(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function equalParts(ctx, count, x, y, width, colorAt) {
  const gap = 4;
  const pieceWidth = (width - gap * (count - 1)) / count;
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colorAt(i);
    ctx.fillRect(x + i * (pieceWidth + gap), y, pieceWidth, 44);
  }
}

const canvasValue = value => (value.approximate ? '≈ ' : '= ') + value.label;
const spokenValue = value => (value.approximate ? 'about ' : '') + value.label;
const amountWithUnit = value => spokenValue(rounded(value)) + ' mL';

export const numberVisuals = {
  fractions: {
    title:'Build a fraction',
    description:'Change the numerator and denominator. Each whole has the same number of equal pieces.',
    controls:[
      {key:'numerator', label:'Numerator', min:0, max:12, initial:3},
      {key:'denominator', label:'Denominator', min:2, max:12, initial:8}
    ],
    draw(ctx, {numerator, denominator}) {
      resetSurface(ctx);
      const value = numerator / denominator;
      const whole = Math.floor(value);
      const remaining = numerator % denominator;
      const decimal = rounded(value, 4);
      const percent = rounded(value * 100);
      label(ctx, numerator + '/' + denominator + ' ' + canvasValue(decimal) + ' ' + canvasValue(percent) + '%', 34, 54, {size:29, bold:true});
      label(ctx, 'Whole bars completed: ' + whole, 34, 106, {bold:true});
      label(ctx, 'Fraction of the next bar', 34, 159, {color:muted});
      equalParts(ctx, denominator, 34, 174, 532, i => i < remaining ? purple : empty);
      label(ctx, remaining + ' of ' + denominator + ' equal pieces filled', 34, 253, {color:muted});
    },
    readout({numerator, denominator}) {
      const value = numerator / denominator;
      const whole = Math.floor(value);
      const remaining = numerator % denominator;
      const bar = whole === 1 ? 'whole bar' : 'whole bars';
      return numerator + '/' + denominator + ' is ' + spokenValue(rounded(value, 4)) + ' as a decimal and ' +
        spokenValue(rounded(value * 100)) + ' percent. It fills ' + whole + ' ' + bar + ' and ' + remaining +
        ' of ' + denominator + ' equal pieces in the next bar.';
    }
  },
  ratio: {
    title:'Share in a ratio',
    description:'Change the total or the ratio. Every coloured block represents one equal part.',
    controls:[
      {key:'first', label:'Parts for share A', min:1, max:6, initial:2},
      {key:'second', label:'Parts for share B', min:1, max:6, initial:3},
      {key:'total', label:'Total volume', min:20, max:180, step:10, initial:120, format:value => value + ' mL'}
    ],
    draw(ctx, {first, second, total}) {
      resetSurface(ctx);
      const parts = first + second;
      const part = total / parts;
      label(ctx, total + ' ÷ ' + parts + ' ' + canvasValue(rounded(part)) + ' mL per part', 34, 57, {size:28, bold:true});
      equalParts(ctx, parts, 34, 87, 532, i => i < first ? purple : teal);
      for (const [name,count,color,x] of [['A',first,purple,34],['B',second,teal,315]]) {
        dot(ctx, x + 8, 176, 7, color);
        label(ctx, 'Share ' + name + ' · ' + count + (count === 1 ? ' part' : ' parts'), x + 25, 184, {color, bold:true});
        const share = rounded(count * part);
        label(ctx, (share.approximate ? '≈ ' : '') + share.label + ' mL', x + 25, 225, {size:27, bold:true});
      }
    },
    readout({first, second, total}) {
      const parts = first + second;
      const part = total / parts;
      return 'Split ' + total + ' mL in the ratio ' + first + ' to ' + second + '. Each of the ' + parts +
        ' parts is ' + amountWithUnit(part) + '. Share A gets ' + amountWithUnit(first * part) +
        ' and share B gets ' + amountWithUnit(second * part) + '.';
    }
  },
  'percent-change': {
    title:'Change a price by a percentage',
    description:'Set the original price and use a negative percentage for a discount or a positive one for an increase.',
    controls:[
      {key:'price', label:'Original price', min:20, max:200, step:10, initial:100, format:money},
      {key:'change', label:'Percentage change', min:-50, max:50, step:5, initial:-20, format:signedPercent}
    ],
    draw(ctx, {price, change}) {
      resetSurface(ctx);
      const factor = 1 + change / 100;
      const result = price * (100 + change) / 100;
      const barWidth = value => value / 300 * 520;
      label(ctx, 'Original price · ' + money(price), 40, 43, {bold:true});
      ctx.fillStyle = purple;
      ctx.fillRect(40, 55, barWidth(price), 30);
      label(ctx, 'New price · ' + money(result), 40, 122, {bold:true});
      ctx.fillStyle = teal;
      ctx.fillRect(40, 134, barWidth(result), 30);
      label(ctx, money(price) + ' × ' + factor.toFixed(2) + ' = ' + money(result), 40, 212, {size:25, bold:true});
      line(ctx, 40, 234, 560, 234, grid);
      for (const value of [0, 100, 200, 300]) {
        const x = 40 + barWidth(value);
        line(ctx, x, 230, x, 241, muted, 1.5);
        label(ctx, String(value), x, 264, {color:muted, size:20, align:'center'});
      }
    },
    readout({price, change}) {
      const factor = 1 + change / 100;
      const result = price * (100 + change) / 100;
      const adjustment = change ? 'A ' + Math.abs(change) + '% ' + (change < 0 ? 'decrease' : 'increase') : 'A 0% change';
      return adjustment + ' uses a multiplier of ' + factor.toFixed(2) + '. ' + money(price) +
        ' times ' + factor.toFixed(2) + ' gives ' + money(result) + '.';
    }
  },
  growth: {
    title:'See compound growth and decay',
    description:'Start with 100. Each period applies the same percentage to the latest amount.',
    controls:[
      {key:'rate', label:'Change per period', min:-25, max:25, step:5, initial:10, format:signedPercent},
      {key:'periods', label:'Number of periods', min:1, max:8, initial:5}
    ],
    draw(ctx, {rate, periods}) {
      resetSurface(ctx);
      const factor = 1 + rate / 100;
      const samples = Array.from({length:periods + 1}, (_, period) => 100 * factor ** period);
      const result = samples.at(-1);
      const ceiling = Math.max(160, Math.ceil(result / 100) * 100);
      const x = period => 82 + period * 58;
      const y = value => 220 - value / ceiling * 150;
      label(ctx, 'Final amount: ' + rounded(result).label, 34, 42, {size:29, bold:true});
      for (let tick = 0; tick <= 4; tick++) {
        const value = tick * ceiling / 4;
        line(ctx, x(0), y(value), x(8), y(value), grid);
        label(ctx, String(value), x(0) - 12, y(value) + 6, {size:20, color:muted, align:'right'});
      }
      for (let period = 0; period <= 8; period++) {
        line(ctx, x(period), y(0), x(period), y(0) + 6, muted, 1.5);
        label(ctx, String(period), x(period), 249, {size:20, color:muted, align:'center'});
      }
      label(ctx, 'Periods', x(4), 271, {size:20, color:muted, align:'center'});
      ctx.strokeStyle = purple;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x(0), y(samples[0]));
      samples.slice(1).forEach((value, index) => ctx.lineTo(x(index + 1), y(value)));
      ctx.stroke();
      samples.forEach((value, index) => dot(ctx, x(index), y(value), index === periods ? 7 : 4.5, index === periods ? teal : purple));
    },
    readout({rate, periods}) {
      const factor = 1 + rate / 100;
      const result = rounded(100 * factor ** periods);
      const interval = periods === 1 ? 'period' : 'periods';
      return 'Starting at 100, apply a ' + signedPercent(rate) + ' change each period. Multiply by ' +
        factor.toFixed(2) + ' for each of ' + periods + ' ' + interval + '. The final amount is ' + spokenValue(result) + '.';
    }
  },
  operations: {
    title:'Add a signed number',
    description:'Start anywhere on the number line. A positive addition moves right and a negative addition moves left.',
    controls:[
      {key:'start', label:'Starting number', min:-8, max:8, initial:-3, format:numberLabel},
      {key:'change', label:'Number to add', min:-8, max:8, initial:5, format:numberLabel}
    ],
    draw(ctx, {start, change}) {
      resetSurface(ctx);
      const result = start + change;
      const x = value => 300 + value * 15.75;
      const addend = change < 0 ? '(' + numberLabel(change) + ')' : numberLabel(change);
      label(ctx, numberLabel(start) + ' + ' + addend + ' = ' + numberLabel(result), 300, 50, {size:32, bold:true, align:'center'});
      line(ctx, x(-16), 153, x(16), 153, muted, 2.5);
      for (let value = -16; value <= 16; value += 4) {
        line(ctx, x(value), 145, x(value), 161, muted, 2);
        label(ctx, numberLabel(value), x(value), 192, {size:20, color:muted, align:'center'});
      }
      dot(ctx, x(start), 153, 8, purple);
      if (change) {
        const direction = Math.sign(change);
        line(ctx, x(start), 112, x(start), 144, grid);
        line(ctx, x(result), 112, x(result), 144, grid);
        line(ctx, x(start), 110, x(result), 110, teal, 3);
        line(ctx, x(result), 110, x(result) - direction * 9, 103, teal, 3);
        line(ctx, x(result), 110, x(result) - direction * 9, 117, teal, 3);
      }
      dot(ctx, x(result), 153, change ? 7 : 4, teal);
      dot(ctx, 89, 235, 7, purple);
      label(ctx, 'Start at ' + numberLabel(start), 106, 243, {color:purple, bold:true});
      dot(ctx, 347, 235, 7, teal);
      label(ctx, 'Result: ' + numberLabel(result), 364, 243, {color:teal, bold:true});
    },
    readout({start, change}) {
      const distance = Math.abs(change);
      const movement = change ? 'Move ' + distance + (distance === 1 ? ' place ' : ' places ') +
        (change < 0 ? 'left' : 'right') + '.' : 'Adding zero leaves the starting number unchanged.';
      return 'Start at ' + numberLabel(start) + '. ' + movement + ' The result is ' + numberLabel(start + change) + '.';
    }
  }
};
