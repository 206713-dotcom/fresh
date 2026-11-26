const ink = "#183328";
const grid = "#d5e2d4";
const mutedInk = "#4c6758";
const green = "#26704d";
const lime = "#b8e780";
const pale = "#e5eee2";
const blue = "#a9d9eb";
const peach = "#f6be9f";
const red = "#bf493f";
const darkBlue = "#226290";

function diagramLine(ctx, x1, y1, x2, y2, color = ink, width = 1.5) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function diagramText(ctx, text, x, y, options = {}) {
  const { align = "center", color = ink, size = 15, weight = 650 } = options;
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function diagramDot(ctx, x, y, size, fill, outline) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function fillShape(ctx, points, fill, outline) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function fillBox(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawRatio({ ctx, width, height }, { redParts, blueParts }) {
  const parts = redParts + blueParts;
  const start = 20;
  const partWidth = (width - 2 * start) / parts;
  const top = height / 2 - 20;
  diagramText(ctx, `${parts} equal parts`, width / 2, top - 28);
  for (let index = 0; index < parts; index++) {
    const x = start + index * partWidth;
    const isRed = index < redParts;
    fillBox(ctx, x + 1, top, partWidth - 2, 46, isRed ? peach : blue);
    if (partWidth >= 15) {
      diagramText(ctx, isRed ? "R" : "B", x + partWidth / 2, top + 23, { size: 14 });
    }
  }
  diagramText(ctx, `Red · ${redParts}`, start, top + 72, { align: "left", color: "#893b2c" });
  diagramText(ctx, `Blue · ${blueParts}`, width - start, top + 72, { align: "right", color: darkBlue });
}

function drawFactors({ ctx, width, height }, { a, b }, { shared }) {
  const start = 20;
  const scale = (width - 2 * start) / Math.max(a, b);
  const rows = [
    { value: a, y: height / 2 - 39, color: lime, caption: "First number" },
    { value: b, y: height / 2 + 32, color: blue, caption: "Second number" }
  ];
  for (const { value, y, color, caption } of rows) {
    diagramText(ctx, `${caption} · ${value}`, start, y - 16, { align: "left" });
    for (let index = 0; index < value / shared; index++) {
      const x = start + index * shared * scale;
      const w = shared * scale;
      fillBox(ctx, x + 0.6, y, w - 1.2, 27, color);
      if (w > 24) diagramText(ctx, shared, x + w / 2, y + 13.5, { size: 14 });
    }
  }
}

function drawEquation({ ctx, width, height }, { cost }, { leftTotal, target, fee }) {
  const start = 18;
  const scale = (width - 2 * start) / Math.max(leftTotal, target);
  const leftY = height / 2 - 33;
  const rightY = height / 2 + 36;
  diagramText(ctx, `3x + ${fee} = ${leftTotal}`, start, leftY - 17, { align: "left" });
  for (let index = 0; index < 3; index++) {
    if (cost) fillBox(ctx, start + index * cost * scale, leftY, cost * scale - 1, 27, lime);
  }
  fillBox(ctx, start + 3 * cost * scale, leftY, fee * scale, 27, peach);
  diagramText(ctx, `Target · ${target}`, start, rightY - 17, { align: "left" });
  fillBox(ctx, start, rightY, target * scale, 27, blue);
  diagramLine(ctx, start + target * scale, leftY + 29, start + target * scale, rightY + 28, darkBlue);
}

function drawSimilarity({ ctx, width, height }, { scale }) {
  const maxScale = 2.5;
  const unit = Math.min((width - 58) / (4 * maxScale), (height - 50) / (3 * maxScale));
  const x = (width - 4 * maxScale * unit) / 2;
  const y = (height + 3 * maxScale * unit) / 2;
  const triangle = k => [[x, y], [x + 4 * k * unit, y], [x, y - 3 * k * unit]];
  fillShape(ctx, triangle(scale), lime, green);

  ctx.save();
  ctx.setLineDash([6, 4]);
  fillShape(ctx, triangle(1), null, darkBlue);
  ctx.restore();

  const mark = Math.min(13, 2 * unit);
  const rightAngle = [[x, y - mark], [x + mark, y - mark], [x + mark, y]];
  for (let index = 1; index < rightAngle.length; index++) {
    diagramLine(ctx, ...rightAngle[index - 1], ...rightAngle[index], green);
  }
  diagramText(ctx, "A", x - 13, y + 6);
  diagramText(ctx, "B′", x + 4 * scale * unit + 11, y + 6);
  diagramText(ctx, "C′", x - 13, y - 3 * scale * unit);
}

function drawSequence({ ctx, width, height }, _, { terms }) {
  const left = 21;
  const bottom = height - 37;
  const step = (width - 2 * left) / terms.length;
  const scale = (height - 72) / Math.max(...terms);
  diagramLine(ctx, left, bottom, width - left, bottom, mutedInk);
  terms.forEach((value, index) => {
    const center = left + (index + 0.5) * step;
    const barHeight = Math.max(2, value * scale);
    const top = bottom - barHeight;
    fillBox(ctx, center - step * 0.32, top, step * 0.64, barHeight, index === terms.length - 1 ? green : lime);
    diagramText(ctx, index + 1, center, bottom + 15, { color: mutedInk, size: 14 });
    if (step >= 40 || value < 100 || index === terms.length - 1) {
      diagramText(ctx, displayNumber(value), center, top - 13, { size: 14 });
    }
  });
}

function drawModular({ ctx, width, height }, { modulus }, { remainder }) {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(x, y) - 32;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = grid;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let index = 0; index < modulus; index++) {
    const angle = 2 * Math.PI * index / modulus - Math.PI / 2;
    const dx = x + r * Math.cos(angle);
    const dy = y + r * Math.sin(angle);
    const isRemainder = index === remainder;
    diagramDot(ctx, dx, dy, isRemainder ? 16 : 12, isRemainder ? green : pale, isRemainder ? green : grid);
    diagramText(ctx, index, dx, dy, { size: 14, color: isRemainder ? "#fff" : ink });
  }
  diagramText(ctx, remainder, x, y - 6, { size: 36, weight: 800 });
  diagramText(ctx, "remainder", x, y + 25, { size: 14, color: mutedInk });
}

function drawSector({ ctx, width, height }, { radius, angle }) {
  const x = width / 2;
  const y = height / 2;
  const r = (Math.min(x, y) - 22) * radius / 12;
  const start = -Math.PI / 2;
  const end = start + angle * Math.PI / 180;
  diagramDot(ctx, x, y, r, pale, mutedInk);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, start, end);
  ctx.closePath();
  ctx.fillStyle = lime;
  ctx.fill();

  if (angle < 360) {
    diagramLine(ctx, x, y, x, y - r, green);
    diagramLine(ctx, x, y, x + r * Math.cos(end), y + r * Math.sin(end), green);
  }
  diagramDot(ctx, x, y, 3, green);
  diagramText(ctx, `${angle}°`, x, Math.min(height - 13, y + r + 16), { size: 14 });
}

function drawPairs({ ctx, width, height }, { items, ordered }) {
  const size = Math.min((width - 52) / items, (height - 52) / items, 34);
  const left = (width - size * items) / 2 + 9;
  const top = (height - size * items) / 2 + 8;
  for (let row = 0; row < items; row++) {
    diagramText(ctx, row + 1, left - 13, top + (row + 0.5) * size, { size: 14 });
    diagramText(ctx, row + 1, left + (row + 0.5) * size, top - 14, { size: 14 });
    for (let col = 0; col < items; col++) {
      const x = left + col * size;
      const y = top + row * size;
      const included = row < col || (row > col && ordered === "yes");
      fillBox(ctx, x + 1, y + 1, size - 2, size - 2, included ? lime : pale);
      if (row === col) diagramText(ctx, "×", x + size / 2, y + size / 2, { color: mutedInk, size: 14 });
      if (included) diagramDot(ctx, x + size / 2, y + size / 2, 2.45, green);
    }
  }
}

function drawProbability({ ctx, width, height }, { redCount, blueCount }, { secondRed, replace }) {
  const maxBalls = redCount + blueCount;
  const step = Math.min((width - 32) / maxBalls, 35);
  const size = Math.min(step * 0.39, 12);
  const rows = [
    { red: redCount, y: height / 2 - 46, title: "Before the first draw" },
    { red: secondRed, y: height / 2 + 44, title: replace ? "After returning the red marble" : "After removing a red marble" }
  ];
  for (const row of rows) {
    const balls = row.red + blueCount;
    const start = (width - (balls - 1) * step) / 2;
    diagramText(ctx, row.title, width / 2, row.y - 28, { size: 14 });
    for (let index = 0; index < balls; index++) {
      const isRed = index < row.red;
      const x = start + index * step;
      const ballColor = isRed ? red : darkBlue;
      diagramDot(ctx, x, row.y, size, ballColor);
      if (size >= 8) {
        diagramText(ctx, isRed ? "R" : "B", x, row.y, { color: "#fff", size: 12 });
      }
    }
  }
}

function graphLayout(width, height, range) {
  const { xMin, xMax, yMin, yMax, equalUnits } = range;
  const plotWidth = width - 54;
  const plotHeight = height - 54;
  let xUnit = plotWidth / (xMax - xMin);
  let yUnit = plotHeight / (yMax - yMin);
  if (equalUnits) xUnit = yUnit = Math.min(xUnit, yUnit);
  const left = (width - xUnit * (xMax - xMin)) / 2 + 5;
  const top = (height - yUnit * (yMax - yMin)) / 2 - 2;
  const right = left + xUnit * (xMax - xMin);
  const bottom = top + yUnit * (yMax - yMin);
  return {
    left, right, top, bottom,
    x: value => left + (value - xMin) * xUnit,
    y: value => bottom - (value - yMin) * yUnit,
    gridX: x => xMin + (x - left) / xUnit,
    gridY: y => yMin + (bottom - y) / yUnit
  };
}

function drawAxes({ ctx, width, height }, range) {
  const plot = graphLayout(width, height, range);
  const { left, top, right, bottom, x, y } = plot;
  for (let value = range.xMin; value <= range.xMax; value += range.xGrid) {
    diagramLine(ctx, x(value), top, x(value), bottom, grid, 1);
    if (value % range.xLabel === 0) diagramText(ctx, value, x(value), bottom + 15, { size: 13, color: mutedInk });
  }
  for (let value = range.yMin; value <= range.yMax; value += range.yGrid) {
    diagramLine(ctx, left, y(value), right, y(value), grid, 1);
    if (value % range.yLabel === 0) {
      diagramText(ctx, value, left - 6, y(value), { align: "right", size: 13, color: mutedInk });
    }
  }
  diagramLine(ctx, left, y(0), right, y(0), mutedInk);
  diagramLine(ctx, x(0), top, x(0), bottom, mutedInk);
  diagramText(ctx, "x", right + 11, y(0), { size: 14, color: mutedInk });
  diagramText(ctx, "y", x(0) + 9, top - 10, { size: 14, color: mutedInk });
  return plot;
}

const coordinateRange = {
  xMin: -8, xMax: 8, yMin: -4, yMax: 12, xGrid: 1, yGrid: 1, xLabel: 4, yLabel: 4, equalUnits: true
};
const pointA = { x: -1, y: 2 };

function coordinatesFromPointer(x, y, width, height) {
  const plot = graphLayout(width, height, coordinateRange);
  if (x < plot.left - 12 || x > plot.right + 12 || y < plot.top - 12 || y > plot.bottom + 12) return null;
  return {
    x: Math.max(coordinateRange.xMin, Math.min(coordinateRange.xMax, Math.round(plot.gridX(x)))),
    y: Math.max(coordinateRange.yMin, Math.min(coordinateRange.yMax, Math.round(plot.gridY(y))))
  };
}

function drawCoordinates(scene, pointB) {
  const { ctx } = scene;
  const { x, y } = drawAxes(scene, coordinateRange);
  const aX = x(pointA.x), aY = y(pointA.y);
  const bX = x(pointB.x), bY = y(pointB.y);
  ctx.save();
  ctx.setLineDash([5, 4]);
  diagramLine(ctx, aX, aY, bX, aY, "#9b572b", 2);
  diagramLine(ctx, bX, aY, bX, bY, "#9b572b", 2);
  ctx.restore();
  diagramLine(ctx, aX, aY, bX, bY, green, 2.25);
  diagramDot(ctx, aX, aY, 5, darkBlue);
  if (aX === bX && aY === bY) {
    diagramText(ctx, "A = B", aX, aY - 16, { size: 14 });
    return;
  }
  diagramDot(ctx, bX, bY, 6.5, green, "#f7faf5");
  diagramText(ctx, "A", aX - 11, aY - 12, { size: 14 });
  diagramText(ctx, "B", bX + 10, bY - 12, { size: 14 });
}

const polynomialRange = {
  xMin: -8, xMax: 8, yMin: -40, yMax: 40, xGrid: 2, yGrid: 10, xLabel: 4, yLabel: 20
};

function drawPolynomial(scene, { a }) {
  const { ctx } = scene;
  const plot = drawAxes(scene, polynomialRange);
  const { x, y, left, top, right, bottom } = plot;
  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, right - left, bottom - top);
  ctx.clip();
  ctx.beginPath();
  for (let n = 0; n <= 160; n++) {
    const value = -8 + n / 10;
    const px = x(value), py = y(value * value - a * a);
    if (n === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = green;
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.restore();

  for (const root of a ? [-a, a] : [0]) {
    diagramDot(ctx, x(root), y(0), 5, peach, "#9b572b");
  }
}

function drawRectangle({ ctx, width, height }, { side }, { otherSide }) {
  const unit = Math.min((width - 80) / 19, (height - 58) / 19);
  const x = width / 2 - side * unit / 2;
  const y = height / 2 - otherSide * unit / 2 - 4;
  const w = side * unit;
  const h = otherSide * unit;
  fillBox(ctx, x, y, w, h, lime);
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  diagramText(ctx, side, x + w / 2, y + h + 16, { size: 14 });
  diagramText(ctx, otherSide, x - 9, y + h / 2, { align: "right", size: 14 });
}

function drawInduction({ ctx, width, height }, { stage }) {
  const size = Math.min((width - 46) / 10, (height - 47) / 10);
  const left = (width - size * stage) / 2;
  const top = (height - size * stage) / 2 - 6;
  for (let row = 0; row < stage; row++) {
    for (let col = 0; col < stage; col++) {
      const isNew = row === stage - 1 || col === stage - 1;
      fillBox(ctx, left + col * size, top + row * size, size - 2, size - 2, isNew ? lime : blue);
    }
  }
  diagramText(ctx, `${stage} × ${stage}`, width / 2, top + size * stage + 17, { size: 14 });
}
