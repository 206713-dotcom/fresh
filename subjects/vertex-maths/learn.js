const LEARNING_STAGES = [
  {
    name: "Build foundations",
    description: "Use ratios, factors, equations and diagrams to solve your first contest problems.",
    topics: ["ratios", "divisibility", "equations", "similarity"]
  },
  {
    name: "Solve contest problems",
    description: "Build techniques for AMC 10/12, AIME, UKMT Senior and similar contests.",
    topics: ["sequences", "modular", "circles", "counting", "probability", "coordinates"]
  },
  {
    name: "Write olympiad proofs",
    description: "Practise explaining why a claim holds, with methods you can use in IMO prep.",
    topics: ["polynomials", "inequalities", "invariants", "proof"]
  }
];

const LESSONS = {
  ratios: {
    title: "Fractions, ratios & percentages",
    summary: "Split a total into parts and work with percentage changes.",
    symbol: "%", tone: "lime",
    method: "Add the ratio parts to find how many equal parts make up the total. Find the value of one part before scaling up. For a percentage change, multiply by the scale factor for that change.",
    example: "Red and blue paint are mixed in the ratio 2 : 5. How much red paint is in 350 mL of the mixture?",
    steps: ["The mixture has 2 + 5 = 7 equal parts, each worth 350/7 = 50 mL.", "Red paint makes up 2 parts, so there are 2 × 50 = 100 mL."],
    video: { id: "GO5ajwbFqVQ", title: "Solving a proportion with an unknown variable", creator: "Khan Academy", focus: "Set up a proportion and solve for its missing value." }
  },
  divisibility: {
    title: "Factors, multiples & primes",
    summary: "Use prime factors to find common divisors and multiples.",
    symbol: "×", tone: "peach",
    method: "Break each number into its prime factors. For the greatest common divisor, take the smaller exponent for each prime. For the least common multiple, take the larger exponent. Treat a missing prime as exponent zero.",
    example: "Find the greatest common divisor and least common multiple of 18 and 24.",
    steps: ["Factor the numbers as 18 = 2 × 3² and 24 = 2³ × 3.", "The smaller exponents give 2 × 3 = 6. The larger exponents give 2³ × 3² = 72."],
    video: { id: "ZKKDTfHcsG0", title: "Prime factorization", creator: "Khan Academy", focus: "Break a composite number into a product of primes." }
  },
  equations: {
    title: "Linear equations",
    summary: "Turn written conditions into equations and solve for an unknown.",
    symbol: "ƒ", tone: "sky",
    method: "Define what your variable represents, then write an equation using the quantities in the problem. Apply each operation to both sides, and substitute your answer back to check it.",
    example: "Three identical notebooks and a $4 delivery fee cost $19. What does one notebook cost?",
    steps: ["Let x be the price of one notebook in dollars. Then 3x + 4 = 19.", "Subtract 4 from both sides and divide by 3 to get x = 5. Three $5 notebooks plus delivery cost $19."],
    video: { id: "tuVd355R-OQ", title: "Example: two-step equations", creator: "Khan Academy", focus: "Use inverse operations to solve an equation one step at a time." }
  },
  similarity: {
    title: "Angles & similarity",
    summary: "Match angles and scale corresponding sides and areas.",
    symbol: "△", tone: "lilac",
    method: "Two triangles are similar if two pairs of corresponding angles are equal. Write the vertices in matching order. If lengths scale by k, areas scale by k².",
    example: "Triangles ABC and DEF are similar in that order. If AB = 6, DE = 9 and BC = 8, find EF.",
    steps: ["AB corresponds to DE, so lengths in DEF are 9/6 = 3/2 times those in ABC.", "EF corresponds to BC, so EF = 8 × 3/2 = 12."],
    video: { id: "BI-rtfZVXy0", title: "Similar triangles", creator: "Khan Academy", focus: "Identify matching angles and corresponding sides in similar triangles." }
  },
  sequences: {
    title: "Sequences & series",
    summary: "Find terms and sums in arithmetic and geometric patterns.",
    symbol: "∑", tone: "lime",
    method: "An arithmetic sequence adds a fixed amount each time. A geometric sequence multiplies by a fixed ratio. There are n − 1 steps from the first term to the nth. In an arithmetic sum, pair terms from opposite ends.",
    example: "Find the sum of the first 12 terms of 4, 7, 10, … .",
    steps: ["The twelfth term is 4 + 11 × 3 = 37.", "Pairing first with last makes six pairs, each equal to 4 + 37 = 41. The sum is 6 × 41 = 246."],
    video: { id: "cYw4MFWsB6c", title: "Arithmetic series intro", creator: "Khan Academy", focus: "Find the sum of an arithmetic sequence by pairing terms." }
  },
  modular: {
    title: "Modular arithmetic",
    summary: "Use remainders and repeating cycles to simplify large numbers.",
    symbol: "≡", tone: "peach",
    method: "Two integers are congruent modulo m if their difference is a multiple of m. You can reduce the numbers to their remainders before adding or multiplying. For high powers, look for a repeating remainder.",
    example: "What is the remainder when 17 × 23 is divided by 5?",
    steps: ["17 has remainder 2 and 23 has remainder 3 modulo 5.", "Their product has the same remainder as 2 × 3 = 6. The remainder is 1."],
    video: { id: "M42uDLGRSpI", title: "Modular Arithmetic (Part 1)", creator: "Neso Academy", focus: "Use a repeating cycle to understand remainders and congruences." }
  },
  circles: {
    title: "Areas & circles",
    summary: "Find sectors, compare areas and use tangent radii.",
    symbol: "π", tone: "sky",
    method: "A sector with central angle θ has fraction θ/360° of the circle’s area. For compound shapes, split them into parts you can measure. A radius to a point of tangency is perpendicular to the tangent line.",
    example: "Find the area of a 90° sector of a circle of radius 8.",
    steps: ["The full circle has area π × 8² = 64π.", "A right angle is a quarter of a full turn, so the sector has area 16π."],
    video: { id: "J_B5vbvIMnU", title: "Area of a sector", creator: "Khan Academy India", focus: "Use the central angle to turn the full circle area into a sector area." }
  },
  counting: {
    title: "Counting & combinations",
    summary: "Count arrangements, selections and cases without double-counting.",
    symbol: "▦", tone: "lilac",
    method: "For choices made in sequence, multiply the available choices at each step. If only the group matters, divide the ordered count by the number of orders per group. Separate disjoint cases or count the complement when it is simpler.",
    example: "How many teams of two can be chosen from five people?",
    steps: ["There are 5 × 4 = 20 ways to pick one person and then another.", "Each team is counted in both orders. Dividing by 2 gives 10 teams."],
    video: { id: "iKy-d5_erhI", title: "Introduction to combinations", creator: "Khan Academy", focus: "Count selections when the order of the chosen items does not matter." }
  },
  probability: {
    title: "Probability",
    summary: "Build a sample space and account for dependent events.",
    symbol: "½", tone: "pink",
    method: "If outcomes are equally likely, divide the count of favourable outcomes by the count of possible ones. A condition can narrow that set. For events in sequence, multiply the probability of the first by the conditional probability of the next.",
    example: "A bag has three red and two blue counters. Two are drawn without replacement. Find the probability of red then blue.",
    steps: ["Red comes first with probability 3/5. After that, two of the four remaining counters are blue.", "The probability of the whole sequence is (3/5)(2/4) = 3/10."],
    video: { id: "VjLEoo3hIoM", title: "Dependent probability introduction", creator: "Khan Academy", focus: "See how the first outcome changes the probability of the next one." }
  },
  coordinates: {
    title: "Coordinate geometry",
    summary: "Use horizontal and vertical changes to find distances and slopes.",
    symbol: "⊥", tone: "mint",
    method: "Draw a right triangle using the horizontal and vertical changes between two points. Its hypotenuse is their distance, and the vertical change divided by the horizontal change gives the slope when the denominator is nonzero. A reflection across an axis reverses the perpendicular coordinate.",
    example: "Find the distance and slope between (−1, 2) and (5, 10).",
    steps: ["Moving from the first point to the second changes x by 6 and y by 8.", "The distance is √(6² + 8²) = 10, and the slope is 8/6 = 4/3."],
    video: { id: "nyZuite17Pc", title: "Distance formula", creator: "Khan Academy", focus: "Derive the distance formula from the Pythagorean theorem." }
  },
  polynomials: {
    title: "Polynomials & identities",
    summary: "Factor expressions and use their roots or coefficients.",
    symbol: "x²", tone: "lime",
    method: "Check for a common factor or a familiar identity before expanding. For a monic quadratic x² + bx + c, the roots sum to −b and multiply to c. For an identity that holds for every x, compare coefficients of the same power on both sides.",
    example: "Factor x³ − 9x and find its real roots.",
    steps: ["Take out the common factor x to get x(x² − 9).", "Factor the difference of squares to get x(x − 3)(x + 3). The roots are −3, 0 and 3."],
    video: { id: "TK-U1p9O6Nc", title: "Factoring a difference of squares", creator: "Khan Academy", focus: "Recognise and factor a difference of squares." }
  },
  inequalities: {
    title: "Inequalities",
    summary: "Prove bounds and explain when equality is possible.",
    symbol: "≥", tone: "peach",
    method: "For positive x and y, (x + y)/2 ≥ √(xy), with equality when x = y. You can also subtract the smaller side and look for nonnegative terms. Check every condition needed to make equality hold.",
    example: "Prove x + 4/x ≥ 4 for x > 0 and find when equality holds.",
    steps: ["The two positive terms x and 4/x have product 4, so their arithmetic mean is at least √4 = 2.", "Equality requires x = 4/x, and the positive solution is x = 2."],
    video: { id: "br05-gIAk2s", title: "The AM–GM inequality", creator: "Art of Problem Solving", focus: "Learn the arithmetic mean–geometric mean inequality and how it bounds expressions." }
  },
  invariants: {
    title: "Parity & invariants",
    summary: "Find a quantity that stays fixed when the problem allows moves.",
    symbol: "±", tone: "lilac",
    method: "Choose a quantity such as parity, a remainder or the difference between two colour counts. Show that every legal move preserves it. If the start and target have different values, the target is impossible.",
    example: "Nine coins start heads up. Each move flips two coins. Can exactly four coins end heads up?",
    steps: ["One move changes the number of heads by −2, 0 or 2, so its parity stays fixed.", "The starting count is odd. Four is even, so it cannot be reached."],
    video: { id: "6zCyobhPc4c", title: "Invariance principle", creator: "Cheenta Academy", focus: "Use a checkerboard colouring to prove when a domino tiling is impossible." }
  },
  proof: {
    title: "Induction & proof",
    summary: "Prove a starting case and justify why the result keeps holding.",
    symbol: "⇒", tone: "sky",
    method: "State the claim for n, prove its first case, then assume the claim for k and use it to prove the claim for k + 1. For strong induction, you may use any earlier cases that you have proved.",
    example: "Show that 2 + 4 + ⋯ + 2n = n(n + 1) for each positive integer n.",
    steps: ["For n = 1, both sides equal 2.", "Assume the sum to 2k is k(k + 1). Adding 2(k + 1) gives (k + 1)(k + 2), which is the required formula for k + 1."],
    video: { id: "gzD5f_AT2Yw", title: "Mathematical induction", creator: "Khan Academy India", focus: "Write a base case and an inductive step for a sum formula." }
  }
};

const lessonSequence = LEARNING_STAGES.flatMap(stage => stage.topics);

function lessonUrl(skill = "") {
  return skill ? `#learn/${skill}` : "#learn";
}

function completedLessonCount() {
  return lessonSequence.filter(skill => Boolean(progress.lessons[skill])).length;
}

function renderLearningPath() {
  const completed = completedLessonCount();
  const next = lessonSequence.find(skill => !progress.lessons[skill]);
  const actionLabel = completed ? "Continue learning" : "Start with fractions and ratios";
  return `
    <div class="shell route-shell">
      <section class="learn-banner" aria-labelledby="route-title">
        <div class="learn-banner-copy">
          <h1 id="route-title" tabindex="-1">Learning path</h1>
          <p>Watch a lesson, explore the maths with an interactive diagram and practise the technique. Follow the stages or jump to a topic.</p>
          <div class="actions">
            <a class="button button-accent" href="${next ? lessonUrl(next) : "#practice"}">${next ? actionLabel : "Keep practising"}</a>
            <a class="button button-ghost" href="#lab">Open Maths Lab</a>
          </div>
        </div>
        <div class="learn-status">
          <label for="learning-progress">Lessons completed</label>
          <strong>${completed} <small>of ${lessonSequence.length}</small></strong>
          <progress id="learning-progress" value="${completed}" max="${lessonSequence.length}"></progress>
        </div>
      </section>
      ${LEARNING_STAGES.map((stage, index) => `
        <section class="learning-stage" aria-labelledby="stage-${index}">
          <div class="section-head">
            <div><h2 id="stage-${index}">${stage.name}</h2><p>${stage.description}</p></div>
          </div>
          <div class="lesson-grid" data-count="${stage.topics.length}">${stage.topics.map(renderLessonCard).join("")}</div>
        </section>
      `).join("")}
    </div>`;
}

function renderLessonCard(skill) {
  const lesson = LESSONS[skill];
  const total = PROBLEMS.filter(problem => problem.skill === skill).length;
  return `
    <a class="topic-card lesson-card tone-${lesson.tone}" href="${lessonUrl(skill)}">
      <div class="card-meta">
        ${symbol(lesson.symbol)}
        ${progress.lessons[skill] ? '<span class="chip lesson-complete-chip">Completed</span>' : ""}
      </div>
      <h3>${lesson.title}</h3>
      <p>${lesson.summary}</p>
      <span class="card-bottom">${problemCount(total)}</span>
    </a>`;
}

function renderLesson(skill) {
  const lesson = LESSONS[skill];
  const { video } = lesson;
  const stage = LEARNING_STAGES.find(item => item.topics.includes(skill));
  const position = lessonSequence.indexOf(skill);
  const last = lessonSequence[position - 1];
  const next = lessonSequence[position + 1];
  const total = PROBLEMS.filter(problem => problem.skill === skill).length;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  return `
    <div class="shell route-shell">
      <a class="back-link" href="#learn">Learning path</a>
      <section class="lesson-header detail-head tone-${lesson.tone}" aria-labelledby="route-title">
        <div>
          <p class="eyebrow">${stage.name}</p>
          <h1 id="route-title" tabindex="-1">${lesson.title}</h1>
          <p class="description">${lesson.summary}</p>
          <div class="actions">
            <button class="button button-solid" type="button" id="jump-to-visual" aria-controls="topic-visual">Visualise this topic</button>
            <a class="button button-outline" href="${practiceUrl({ skill })}">Practise this topic</a>
            <button class="button button-outline" id="lesson-complete" type="button">${progress.lessons[skill] ? "Mark incomplete" : "Mark lesson complete"}</button>
          </div>
          <p class="lesson-feedback" id="lesson-feedback" role="status">${progress.lessons[skill] ? "Lesson completed." : ""}</p>
        </div>
        ${symbol(lesson.symbol)}
      </section>
      <div class="lesson-layout tone-${lesson.tone}">
        <section class="panel lesson-technique" aria-labelledby="method-title">
          <h2 id="method-title">How to use it</h2>
          <p>${lesson.method}</p>
          <div class="lesson-example">
            <h3>Worked example</h3>
            <p>${lesson.example}</p>
            <ol>${lesson.steps.map(step => `<li>${step}</li>`).join("")}</ol>
          </div>
        </section>
        <section class="panel lesson-video" aria-labelledby="video-title">
          <h2 id="video-title">Watch the lesson</h2>
          <div class="video-stage" id="video-stage">
            <span class="video-symbol" aria-hidden="true">${lesson.symbol}</span>
            <button class="video-trigger" id="play-lesson" type="button"><span class="play-icon" aria-hidden="true"></span>Play video</button>
          </div>
          <h3>${video.title}</h3>
          <p class="video-author">${video.creator}</p>
          <p>${video.focus}</p>
          ${externalLink(["Watch on YouTube", watchUrl])}
        </section>
      </div>
      ${visualPanel(skill)}
      <nav class="lesson-pagination" aria-label="Learning path navigation">
        ${last ? lessonStep("Previous topic", last) : '<a class="lesson-step" href="#learn"><strong>All topics</strong></a>'}
        <p>${problemCount(total)} for this topic</p>
        ${next ? lessonStep("Next topic", next) : '<a class="lesson-step" href="#imo"><strong>Explore IMO prep</strong></a>'}
      </nav>
    </div>`;
}

function lessonStep(label, skill) {
  return `<a class="lesson-step" href="${lessonUrl(skill)}"><span>${label}</span><strong>${LESSONS[skill].title}</strong></a>`;
}

function bindLesson(skill) {
  routed.querySelector("#jump-to-visual").addEventListener("click", () => {
    const visual = routed.querySelector("#topic-visual");
    visual.scrollIntoView({ block: "start" });
    visual.querySelector("h2").focus({ preventScroll: true });
  });

  const complete = routed.querySelector("#lesson-complete");
  const feedback = routed.querySelector("#lesson-feedback");
  complete.addEventListener("click", () => {
    if (progress.lessons[skill]) {
      delete progress.lessons[skill];
    } else {
      progress.lessons[skill] = Date.now();
    }
    saveProgress();
    const done = Boolean(progress.lessons[skill]);
    if (done) void window.FreshPoints.earn("Vertex Maths", 10, "Lesson completed", "lesson:" + skill);
    complete.textContent = done ? "Mark incomplete" : "Mark lesson complete";
    feedback.textContent = done ? "Lesson completed." : "Lesson marked incomplete.";
  });

  routed.querySelector("#play-lesson").addEventListener("click", () => {
    const { video } = LESSONS[skill];
    const player = document.createElement("iframe");
    player.title = video.title;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    player.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;
    routed.querySelector("#video-stage").replaceChildren(player);
    player.focus();
  });
}
