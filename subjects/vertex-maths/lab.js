const labNumber = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

function displayNumber(value) {
  return labNumber.format(value);
}

function commonDivisor(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function reducedFraction(numerator, denominator) {
  const divisor = commonDivisor(numerator, denominator);
  const n = numerator / divisor * Math.sign(denominator);
  const d = Math.abs(denominator / divisor);
  return d === 1 ? String(n) : `${n}/${d}`;
}

function factorsOf(value) {
  const factors = [];
  for (let factor = 2; factor <= value; factor++) {
    while (value % factor === 0) {
      factors.push(factor);
      value /= factor;
    }
  }
  return factors.join(" × ");
}

function slider(key, label, min, max, value, step = 1, unit = "") {
  return { key, label, min, max, value, step, unit };
}

function picker(key, label, value, choices) {
  return { key, label, value, choices };
}

const VISUALS = {
  ratios: {
    title: "Split a total into ratio parts",
    instruction: "Change the ratio or the total amount. Each block represents one equal part.",
    controls: [
      slider("redParts", "Red parts", 1, 8, 2),
      slider("blueParts", "Blue parts", 1, 8, 5),
      slider("total", "Total volume", 100, 600, 350, 10, " mL")
    ],
    read({ redParts, blueParts, total }) {
      const parts = redParts + blueParts;
      const unit = total / parts;
      return {
        stats: [["One part", `${displayNumber(unit)} mL`], ["Red", `${displayNumber(unit * redParts)} mL`], ["Blue", `${displayNumber(unit * blueParts)} mL`]],
        note: `Red takes ${reducedFraction(redParts, parts)} of the whole, or about ${displayNumber(redParts / parts * 100)}%.`
      };
    },
    paint: drawRatio
  },
  divisibility: {
    title: "Find the largest shared group",
    instruction: "Change both numbers and look for the largest block size that fits exactly into both rows.",
    controls: [slider("a", "First number", 2, 36, 18), slider("b", "Second number", 2, 36, 24)],
    read({ a, b }) {
      const shared = commonDivisor(a, b);
      return {
        shared,
        stats: [["Greatest common divisor", shared], ["Least common multiple", a * b / shared]],
        note: `${a} = ${factorsOf(a)}. ${b} = ${factorsOf(b)}. Each block represents ${shared}.`
      };
    },
    paint: drawFactors
  },
  equations: {
    title: "Balance 3x + 4 = 19",
    instruction: "Change the price of one notebook. The green blocks are three notebooks, and the peach block is the delivery fee.",
    controls: [slider("cost", "Notebook price", 0, 10, 3, 1, " dollars")],
    read({ cost }) {
      const fee = 4;
      const target = 19;
      const leftTotal = 3 * cost + fee;
      const gap = leftTotal - target;
      const note = gap === 0 ? `Both totals match at $19. The solution is x = ${cost}.`
        : `The notebook total is $${Math.abs(gap)} ${gap < 0 ? "below" : "above"} the target.`;
      return { fee, target, leftTotal, stats: [["3x + 4", `$${leftTotal}`], ["Target", "$19"]], note };
    },
    paint: drawEquation
  },
  similarity: {
    title: "Scale a triangle",
    instruction: "Change the scale factor. The dashed outline is the original triangle and the green triangle is the scaled one.",
    controls: [slider("scale", "Length scale factor", 0.5, 2.5, 1.5, 0.25, "×")],
    read({ scale }) {
      return {
        stats: [["Base", 4 * scale], ["Height", 3 * scale], ["Area scale factor", `${scale * scale}×`]],
        note: `The area changes from 6 to ${6 * scale * scale} square units. The angles stay the same.`
      };
    },
    paint: drawSimilarity
  },
  sequences: {
    title: "Watch a sequence grow",
    instruction: "Start at 4. Compare adding the same difference each time with multiplying by the same ratio.",
    controls: [
      picker("pattern", "Pattern", "arithmetic", [["arithmetic", "Arithmetic"], ["geometric", "Geometric"]]),
      slider("count", "Number of terms", 3, 8, 6),
      slider("step", "Difference or ratio", 1, 3, 3)
    ],
    read({ pattern, count, step }) {
      const arithmetic = pattern === "arithmetic";
      const terms = Array.from({ length: count }, (_, index) => arithmetic ? 4 + index * step : 4 * step ** index);
      const sum = terms.reduce((total, value) => total + value, 0);
      return {
        terms,
        stats: [["Last term", displayNumber(terms.at(-1))], ["Sum", displayNumber(sum)]],
        note: `${arithmetic ? "Add" : "Multiply by"} ${step} each time. Terms are ${terms.map(displayNumber).join(", ")}.`
      };
    },
    paint: drawSequence
  },
  modular: {
    title: "Step around a remainder wheel",
    instruction: "Choose an integer and a modulus. A full turn returns you to the same remainder.",
    controls: [slider("number", "Integer", -24, 60, 17), slider("modulus", "Modulus", 3, 12, 5)],
    read({ number, modulus }) {
      const quotient = Math.floor(number / modulus);
      const remainder = number - quotient * modulus;
      return {
        remainder,
        stats: [["Quotient", quotient], ["Remainder", remainder]],
        note: `${number} = (${quotient} × ${modulus}) + ${remainder}. The highlighted position is the remainder.`
      };
    },
    paint: drawModular
  },
  circles: {
    title: "Shade a circle sector",
    instruction: "Change the radius or angle. The shaded sector is the chosen fraction of a full turn.",
    controls: [slider("radius", "Radius", 3, 12, 8), slider("angle", "Central angle", 15, 360, 90, 15, "°")],
    read({ radius, angle }) {
      return {
        stats: [
          ["Fraction of a turn", reducedFraction(angle, 360)],
          ["Sector area", `${reducedFraction(radius * radius * angle, 360)} π`],
          ["Full circle area", `${radius * radius} π`]
        ],
        note: `Multiply the circle area by ${angle}° ÷ 360° to find the shaded area.`
      };
    },
    paint: drawSector
  },
  counting: {
    title: "See which pairs are counted",
    instruction: "The row gives the first item and the column gives the second. Switch between ordered and unordered pairs.",
    controls: [
      slider("items", "Items to choose from", 3, 8, 5),
      picker("ordered", "Does order matter?", "no", [["no", "No · unordered"], ["yes", "Yes · ordered"]])
    ],
    read({ items, ordered }) {
      const before = items * (items - 1);
      const total = ordered === "yes" ? before : before / 2;
      return {
        stats: [["Possible pairs", total], ["Calculation", `${items} × ${items - 1}${ordered === "no" ? " ÷ 2" : ""}`]],
        note: ordered === "yes"
          ? "Both orientations count. Choosing the same item twice is excluded."
          : "Each pair appears above and below the diagonal. Keep just one of those two cells."
      };
    },
    paint: drawPairs
  },
  probability: {
    title: "Draw two red marbles",
    instruction: "Change the bag, then compare the second draw with and without returning the first red marble.",
    controls: [
      slider("redCount", "Red marbles", 1, 6, 4),
      slider("blueCount", "Blue marbles", 1, 6, 3),
      picker("replacement", "After the first draw", "remove", [["remove", "Keep the marble out"], ["return", "Return the marble"]])
    ],
    read({ redCount, blueCount, replacement }) {
      const replace = replacement === "return";
      const total = redCount + blueCount;
      const secondRed = replace ? redCount : redCount - 1;
      const secondTotal = secondRed + blueCount;
      const n = redCount * secondRed;
      const d = total * secondTotal;
      return {
        replace, secondRed,
        stats: [
          ["First red", reducedFraction(redCount, total)],
          ["Second red given first red", reducedFraction(secondRed, secondTotal)],
          ["Both red", reducedFraction(n, d)]
        ],
        note: `Multiply ${redCount}/${total} by ${secondRed}/${secondTotal}. The chance of two reds is about ${displayNumber(n / d * 100)}%.`
      };
    },
    paint: drawProbability
  },
  coordinates: {
    title: "Move a point on the grid",
    instruction: "Move B with the sliders or select a position on the grid. The dashed segments show the horizontal and vertical changes.",
    controls: [slider("x", "B’s x-coordinate", -8, 8, 5), slider("y", "B’s y-coordinate", -4, 12, 10)],
    read({ x, y }) {
      const dx = x - pointA.x;
      const dy = y - pointA.y;
      const squareDistance = dx * dx + dy * dy;
      const distance = Math.sqrt(squareDistance);
      return {
        stats: [
          ["Horizontal change", dx],
          ["Vertical change", dy],
          ["Distance", Number.isInteger(distance) ? distance : `√${squareDistance} ≈ ${displayNumber(distance)}`],
          ["Slope", dx ? reducedFraction(dy, dx) : "Undefined"]
        ],
        note: `A = (${pointA.x}, ${pointA.y}) and B = (${x}, ${y}). The distance squared is ${squareDistance}.`
      };
    },
    paint: drawCoordinates,
    point: coordinatesFromPointer
  },
  polynomials: {
    title: "Move the roots of a quadratic",
    instruction: "Vary a in y = x² − a². The marked points show where the graph meets the x-axis.",
    controls: [slider("a", "Value of a", 0, 6, 3)],
    read({ a }) {
      return {
        stats: [["Factorisation", a ? `(x − ${a})(x + ${a})` : "x²"], ["Roots", a ? `−${a} and ${a}` : "0 (double root)"]],
        note: a ? `The curve crosses the x-axis at both roots. Its lowest point is (0, −${a * a}).`
          : "Both roots meet at 0. The curve touches the x-axis at its lowest point."
      };
    },
    paint: drawPolynomial
  },
  inequalities: {
    title: "Maximise the area with a fixed perimeter",
    instruction: "Change one side of the rectangle. The two side lengths always add up to 20.",
    controls: [slider("side", "First side", 1, 19, 6)],
    read({ side }) {
      const otherSide = 20 - side;
      const area = side * otherSide;
      return {
        otherSide,
        stats: [["Second side", otherSide], ["Area", area], ["Maximum area", 100]],
        note: area === 100 ? "The area reaches 100 when both sides are 10."
          : `The area is ${100 - area} below the maximum. The gap equals (${side} − 10)².`
      };
    },
    paint: drawRectangle
  },
  invariants: {
    title: "Keep a checkerboard in balance",
    instruction: "Select a square, then one that shares its edge. Each move adds 1 to both squares.",
    controls: [],
    board: true,
    read({ cells, selection, message, moves }) {
      const sums = [0, 0];
      cells.forEach((value, index) => { sums[boardColour(index)] += value; });
      const [dark, light] = sums;
      return {
        stats: [["Dark sum", dark], ["Light sum", light], ["Difference", dark - light], ["Moves", moves]],
        note: message || (selection === null
          ? "Every move adds 1 to each colour’s sum. Their difference stays at zero."
          : "Choose a square that shares an edge with the selected one.")
      };
    }
  },
  proof: {
    title: "Build a square from odd numbers",
    instruction: "Increase n one step at a time. The new row and column are highlighted.",
    controls: [slider("stage", "Side length n", 1, 10, 4)],
    read({ stage }) {
      const before = (stage - 1) ** 2;
      const added = 2 * stage - 1;
      return {
        stats: [["Previous square", before], ["New tiles", added], ["Total tiles", stage ** 2]],
        note: `${before} + ${added} = ${stage ** 2}. This is how the next odd number builds the next square.`
      };
    },
    paint: drawInduction
  }
};

function labUrl(skill = "") {
  return skill ? `#lab/${skill}` : "#lab";
}

function renderLab(skill) {
  return `
    <div class="shell route-shell">
      <section class="learn-banner lab-banner" aria-labelledby="route-title">
        <div class="learn-banner-copy">
          <h1 id="route-title" tabindex="-1">Maths Lab</h1>
          <p>Change the values and see how the maths responds. Choose a topic from the learning path to explore.</p>
        </div>
        ${filterField("lab-topic", "Choose a topic", LEARNING_STAGES.map(stage =>
          `<optgroup label="${stage.name}">${stage.topics.map(key => option(key, LESSONS[key].title, skill)).join("")}</optgroup>`
        ).join(""))}
      </section>
      ${visualPanel(skill)}
      <div class="actions lab-links">
        <a class="button button-outline" href="${lessonUrl(skill)}">Open this lesson</a>
        <a class="button button-solid" href="${practiceUrl({ skill })}">Practise this topic</a>
      </div>
    </div>`;
}

function boardColour(index) {
  return (Math.floor(index / 4) + index % 4) % 2;
}

function boardMarkup() {
  return `<div class="lab-board" aria-label="Checkerboard" role="group">
    ${Array.from({ length: 16 }, (_, index) => `
      <button type="button" class="lab-square ${boardColour(index) ? "is-light" : "is-dark"}"
        data-square="${index}" aria-pressed="false">0</button>
    `).join("")}
  </div>`;
}

function visualPanel(skill) {
  const visual = VISUALS[skill];
  const state = savedVisualState(skill);
  const reading = visual.read(state);
  return `
    <section class="panel visual-panel tone-${LESSONS[skill].tone}" aria-labelledby="visual-title" id="topic-visual">
      <div class="visual-head">
        <div>
          <h2 id="visual-title" tabindex="-1">${visual.title}</h2>
          <p>${visual.instruction}</p>
        </div>
        <button type="button" class="button button-outline button-small" id="visual-reset">Reset</button>
      </div>
      <div class="visual-layout${visual.board ? " visual-layout-board" : ""}">
        <figure class="visual-figure">
          ${visual.board ? boardMarkup() : `
            <canvas class="visual-canvas${visual.point ? " is-draggable" : ""}" width="640" height="300"
              role="img" aria-labelledby="visual-title" aria-describedby="visual-caption">
              Use the controls and read the values below to explore this visual.
            </canvas>`}
          <figcaption id="visual-caption" aria-live="polite">${reading.note}</figcaption>
        </figure>
        ${visual.controls.length ? `
          <div class="visual-controls" role="group" aria-label="Visual settings">
            ${visual.controls.map(control => renderVisualControl({ ...control, value: state[control.key] })).join("")}
          </div>` : ""}
      </div>
      <dl class="visual-stats" aria-label="Calculated values">
        ${reading.stats.map(([label, value]) => `
          <div class="visual-stat"><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
      </dl>
      <div class="visual-save-row">
        <p id="visual-save-status" role="status">${visualSaveStatus(skill)}</p>
        <a class="text-link" href="#progress">Local saves</a>
      </div>
    </section>`;
}

function renderVisualControl(control) {
  const { key, label, choices, value, min, max, step, unit } = control;
  const id = `visual-${key}`;
  if (choices) {
    return filterField(id, label, choices.map(([value, title]) => option(value, title, control.value)).join(""));
  }
  return `
    <div class="visual-slider">
      <div class="visual-slider-label">
        <label for="${id}">${label}</label>
        <output for="${id}">${displayNumber(value)}${unit}</output>
      </div>
      <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">
    </div>`;
}

function initialVisualState(visual) {
  if (visual.board) return { cells: Array(16).fill(0), selection: null, message: "", moves: 0 };
  return Object.fromEntries(visual.controls.map(control => [control.key, control.value]));
}

function savedVisualState(skill) {
  const state = initialVisualState(VISUALS[skill]);
  const saved = progress.visuals[skill]?.state;
  return saved ? Object.assign(state, structuredClone(saved)) : state;
}

function visualSaveStatus(skill) {
  if (!canSave) return "This setup is available while this tab is open.";
  return progress.visuals[skill] ? "Setup saved in this browser." : "Changes save in this browser.";
}

function moveOnBoard(state, index) {
  state.message = "";
  const selected = state.selection;
  if (selected === index) {
    state.selection = null;
  } else if (selected === null) {
    state.selection = index;
  } else {
    const rowDifference = Math.abs(Math.floor(selected / 4) - Math.floor(index / 4));
    const columnDifference = Math.abs(selected % 4 - index % 4);
    if (rowDifference + columnDifference === 1) {
      state.cells[selected]++;
      state.cells[index]++;
      state.moves++;
      state.selection = null;
    } else {
      state.message = "Choose a square that shares an edge. Diagonal squares do not count.";
    }
  }
}

function paintVisual(canvas, context, visual, state, reading) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width < 1 || height < 1) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  visual.paint({ ctx: context, width, height }, state, reading);
}

function bindVisual(skill) {
  const panel = routed.querySelector("#topic-visual");
  const visual = VISUALS[skill];
  let state = savedVisualState(skill);
  let saveTimer;
  const saveStatus = panel.querySelector("#visual-save-status");
  const caption = panel.querySelector("#visual-caption");
  const stats = panel.querySelectorAll(".visual-stat dd");
  const canvas = panel.querySelector("canvas");
  const context = canvas?.getContext("2d");
  const board = panel.querySelector(".lab-board");
  const squares = board?.querySelectorAll("[data-square]");
  const controls = visual.controls.map(control => ({
    ...control,
    input: panel.querySelector(`#visual-${control.key}`),
    output: panel.querySelector(`output[for="visual-${control.key}"]`)
  }));

  function clearSaveTimer() {
    window.clearTimeout(saveTimer);
    saveTimer = undefined;
  }

  function flushSave() {
    if (saveTimer === undefined) return;
    clearSaveTimer();
    saveProgress();
    const status = visualSaveStatus(skill);
    if (saveStatus.textContent !== status) saveStatus.textContent = status;
  }

  function queueSave() {
    progress.visuals[skill] = { state: captureVisual(visual, state), time: Date.now() };
    progress.lastLabTopic = skill;
    clearSaveTimer();
    saveTimer = window.setTimeout(flushSave, 160);
  }

  function render() {
    const reading = visual.read(state);
    if (caption.textContent !== reading.note) caption.textContent = reading.note;
    stats.forEach((item, index) => { item.textContent = reading.stats[index][1]; });
    controls.forEach(({ key, input, output, unit }) => {
      input.value = String(state[key]);
      if (output) {
        output.textContent = `${displayNumber(state[key])}${unit}`;
        input.setAttribute("aria-valuetext", output.textContent);
      }
    });
    squares?.forEach((button, index) => {
      const value = state.cells[index];
      const colour = boardColour(index) ? "Light" : "Dark";
      button.textContent = value;
      button.setAttribute("aria-label", `${colour} square, row ${Math.floor(index / 4) + 1}, column ${index % 4 + 1}, value ${value}`);
      button.setAttribute("aria-pressed", String(state.selection === index));
    });
    if (context) paintVisual(canvas, context, visual, state, reading);
  }

  controls.forEach(({ key, input, choices }) => {
    input.addEventListener(choices ? "change" : "input", () => {
      const value = choices ? input.value : Number(input.value);
      if (state[key] === value) return;
      state[key] = value;
      render();
      queueSave();
    });
  });

  board?.addEventListener("click", event => {
    const button = event.target.closest("[data-square]");
    if (button) {
      const moves = state.moves;
      moveOnBoard(state, Number(button.dataset.square));
      render();
      if (state.moves !== moves) queueSave();
    }
  });

  if (visual.point && context) {
    const movePoint = event => {
      const rect = canvas.getBoundingClientRect();
      const point = visual.point(event.clientX - rect.left, event.clientY - rect.top, canvas.clientWidth, canvas.clientHeight);
      if (!point) return false;
      if (state.x !== point.x || state.y !== point.y) {
        Object.assign(state, point);
        render();
        queueSave();
      }
      return true;
    };
    canvas.addEventListener("pointerdown", event => {
      if (event.button === 0 && movePoint(event) && event.pointerType !== "touch") {
        canvas.setPointerCapture(event.pointerId);
      }
    });
    canvas.addEventListener("pointermove", event => {
      if (canvas.hasPointerCapture(event.pointerId)) movePoint(event);
    });
  }

  panel.querySelector("#visual-reset").addEventListener("click", () => {
    clearSaveTimer();
    refreshSavedProgress();
    delete progress.visuals[skill];
    progress.lastLabTopic = skill;
    state = initialVisualState(visual);
    saveProgress();
    render();
    saveStatus.textContent = canSave ? "Default setup restored." : visualSaveStatus(skill);
  });

  render();
  let observer;
  if (context) {
    observer = new ResizeObserver(() => paintVisual(canvas, context, visual, state, visual.read(state)));
    observer.observe(canvas);
  }
  window.addEventListener("pagehide", flushSave);
  return () => {
    flushSave();
    window.removeEventListener("pagehide", flushSave);
    observer?.disconnect();
  };
}
