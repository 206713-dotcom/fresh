const home = document.querySelector("#home-page");
const routed = document.querySelector("#routed-page");
const progressKey = "vertex-maths-progress-v1";
const levels = ["Warm-up", "Intermediate", "Challenge"];
const contestById = Object.fromEntries(CONTESTS.map(contest => [contest.id, contest]));
const tracksByContest = Object.fromEntries(CONTESTS.map(contest => [
  contest.id,
  [...new Set(PROBLEMS.filter(problem => problem.contest === contest.id).map(problem => problem.track))]
]));

let canSave = true;
let activePage = "";
let chosenRegion = "All";
let focusAfterFilter = "";
let stopVisual;
const progress = readProgress();
let storedProgress = structuredClone(progress);

function readStoredProgress() {
  return normalizeProgress(JSON.parse(localStorage.getItem(progressKey) ?? "null"));
}

function readProgress() {
  try {
    return readStoredProgress();
  } catch {
    canSave = false;
    return normalizeProgress();
  }
}

function refreshSavedProgress() {
  try {
    const latest = readStoredProgress();
    const baseline = structuredClone(latest);
    Object.assign(progress, reconcileProgress(storedProgress, progress, latest));
    storedProgress = baseline;
  } catch {
    canSave = false;
  }
}

function saveProgress() {
  refreshSavedProgress();
  try {
    localStorage.setItem(progressKey, JSON.stringify(progress));
    storedProgress = structuredClone(progress);
    canSave = true;
  } catch {
    canSave = false;
  }
}

function practiceUrl({ contest = "", topic = "", skill = "", level = "", track = "", problem = "" } = {}) {
  const search = new URLSearchParams();
  if (topic) search.set("topic", topic);
  if (skill) search.set("skill", skill);
  if (level) search.set("level", level);
  if (track) search.set("track", track);
  if (problem) search.set("problem", problem);
  return `#practice${contest ? "/" + contest : ""}${search.size ? "?" + search : ""}`;
}

function contestUrl(contest) {
  return `#contest/${contest.id}`;
}

function getRoute() {
  const [path, search] = location.hash.slice(1).split("?", 2);
  const [page, slug] = path.split("/", 2);
  const query = new URLSearchParams(search);
  const contest = Object.hasOwn(contestById, slug) ? slug : "";
  const topic = query.get("topic");
  const skill = page === "learn" || page === "lab" ? slug : query.get("skill");
  const level = query.get("level");
  const track = query.get("track");
  return {
    page,
    contest,
    topic: Object.hasOwn(TOPICS, topic) ? topic : "",
    skill: Object.hasOwn(LESSONS, skill) ? skill : "",
    level: levels.includes(level) ? level : "",
    track: tracksByContest[contest]?.includes(track) ? track : "",
    problem: query.get("problem") ?? ""
  };
}

function problemCount(count, singular = "problem") {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function symbol(value) {
  return `<span class="contest-symbol" aria-hidden="true">${value}</span>`;
}

function renderDirectory() {
  const shown = CONTESTS.filter(contest => {
    if (chosenRegion === "All") return true;
    if (chosenRegion === "Other") return ["Canada", "Australia"].includes(contest.region);
    return contest.region === chosenRegion;
  });

  document.querySelector("#contest-grid").innerHTML = shown.map(contest => `
    <a class="contest-card tone-${contest.tone}" href="${contestUrl(contest)}">
      <div class="card-meta">
        ${symbol(contest.symbol)}
        <span class="chip chip-tint">${contest.region}</span>
      </div>
      <h3>${contest.name}</h3>
      <p>${contest.summary}</p>
      <span class="card-bottom">View contest</span>
    </a>`).join("");

  document.querySelector("#contest-filter-status").textContent = `${problemCount(shown.length, "contest")} shown.`;
}

document.querySelector("#contest-filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-region]");
  if (!button) return;
  chosenRegion = button.dataset.region;
  for (const control of document.querySelectorAll("#contest-filters button")) {
    control.setAttribute("aria-pressed", String(control === button));
  }
  renderDirectory();
});

function externalLink([label, url], className = "text-link") {
  return `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function renderContest(contest) {
  const trackLinks = tracksByContest[contest.id].length > 1
    ? tracksByContest[contest.id].map(track => `
      <a class="button button-outline button-small" href="${practiceUrl({ contest: contest.id, track })}">${track}</a>`).join("")
    : "";
  const resources = [contest.source, contest.papers].filter(Boolean);
  return `
    <div class="shell route-shell">
      <a class="back-link" href="#competitions">All competitions</a>
      <section class="detail-head tone-${contest.tone}" aria-labelledby="route-title">
        <div>
          <p class="eyebrow">${contest.region}</p>
          <h1 id="route-title" tabindex="-1">${contest.name}</h1>
          <p class="detail-subtitle">${contest.full}</p>
          <p class="description">${contest.description}</p>
          <div class="actions">
            <a class="button button-solid" href="${practiceUrl({ contest: contest.id })}">Practise ${contest.name} problems</a>
            ${contest.id === "imo" ? '<a class="button button-outline" href="#imo">Open IMO prep</a>' : ""}
          </div>
        </div>
        ${symbol(contest.symbol)}
      </section>
      <dl class="facts">${contest.facts.map(([label, value]) => `
        <div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
      </dl>
      <div class="detail-columns">
        <section class="panel">
          <h2>How to prepare</h2>
          <p>${contest.approach}</p>
          ${trackLinks ? `<div class="actions">${trackLinks}</div>` : ""}
        </section>
        <section class="panel">
          <h2>Official resources</h2>
          <ul class="resource-list">
            ${resources.map(resource => `<li>${externalLink(resource)}</li>`).join("")}
          </ul>
        </section>
      </div>
    </div>`;
}

function renderImo() {
  const imo = contestById.imo;
  return `
    <div class="shell route-shell">
      <section class="imo-banner" aria-labelledby="route-title">
        <p class="eyebrow"><span aria-hidden="true">✦</span> International Mathematical Olympiad</p>
        <h1 id="route-title" tabindex="-1">IMO Prep</h1>
        <p>Build proof-writing skills in four topics. Work through guided problems, then put your reasoning to the test on official IMO papers.</p>
        <div class="actions">
          <a class="button button-accent" href="${practiceUrl({ contest: "imo" })}">Start a proof problem</a>
          <a class="button button-ghost" href="${lessonUrl("proof")}">Learn to write proofs</a>
          ${externalLink(imo.papers, "button button-ghost")}
        </div>
        <div class="hero-art" aria-hidden="true"><img src="assets/orbital-diagram.jpg" width="1050" height="1050" alt=""></div>
      </section>
      <section class="imo-section" aria-labelledby="topics-title">
        <div class="section-head"><h2 id="topics-title">Choose a topic</h2></div>
        <div class="topic-grid">
          ${Object.entries(TOPICS).map(([key, topic]) => {
            const count = PROBLEMS.filter(problem => problem.contest === "imo" && problem.topic === key).length;
            return `<a class="topic-card tone-${topic.tone}" href="${practiceUrl({ contest: "imo", topic: key })}">
              ${symbol(topic.symbol)}
              <h3>${topic.name}</h3>
              <p>${topic.skill}</p>
              <span class="card-bottom">${problemCount(count, "proof problem")}</span>
            </a>`;
          }).join("")}
        </div>
      </section>
      <section class="imo-section" aria-labelledby="prep-plan-title">
        <div class="section-head"><h2 id="prep-plan-title">From practice to past papers</h2></div>
        <div class="prep-steps">
          <article class="panel">
            <h3>Build your toolkit</h3>
            <p>Try a warm-up in each topic. After reviewing the solution, write down the idea that made it work, such as parity or comparing coefficients.</p>
          </article>
          <article class="panel">
            <h3>Write complete arguments</h3>
            <p>Work through an intermediate or challenge proof before opening the hints. Compare your proof line by line with the worked solution and revise any gaps.</p>
          </article>
          <article class="panel">
            <h3>Simulate an IMO day</h3>
            <p>Pick one day from a past paper. Give yourself 4 hours 30 minutes for three problems and write full proofs. Review the problems you left unfinished.</p>
          </article>
        </div>
      </section>
    </div>`;
}

function option(value, label, selected) {
  return `<option value="${value}"${value === selected ? " selected" : ""}>${label}</option>`;
}

function filterField(id, label, options) {
  return `<label class="field" for="${id}">
    <span>${label}</span><span class="select-wrap"><select id="${id}">${options}</select></span>
  </label>`;
}

function contestOptions(filters) {
  const selected = filters.track ? `${filters.contest}/${filters.track}` : filters.contest;
  return option("", "All competitions", selected) + CONTESTS.map(contest => {
    const tracks = tracksByContest[contest.id];
    if (tracks.length < 2) return option(contest.id, contest.name, selected);
    return `<optgroup label="${contest.name}">
      ${option(contest.id, `All ${contest.name} problems`, selected)}
      ${tracks.map(track => option(`${contest.id}/${track}`, track, selected)).join("")}
    </optgroup>`;
  }).join("");
}

function skillsForArea(area) {
  if (!area) return lessonSequence;
  const skills = new Set(PROBLEMS.filter(problem => problem.topic === area).map(problem => problem.skill));
  return lessonSequence.filter(skill => skills.has(skill));
}

function renderPractice(filters) {
  const matches = PROBLEMS.filter(problem =>
    (!filters.contest || problem.contest === filters.contest)
    && (!filters.topic || problem.topic === filters.topic)
    && (!filters.skill || problem.skill === filters.skill)
    && (!filters.level || problem.level === filters.level)
    && (!filters.track || problem.track === filters.track)
  );
  if (filters.skill) matches.sort((a, b) => levels.indexOf(a.level) - levels.indexOf(b.level));
  const selected = matches.find(problem => problem.id === filters.problem) ?? matches[0];

  const filtersHtml = `<div class="practice-filters" role="group" aria-label="Problem filters">
    ${filterField("filter-contest", "Competition", contestOptions(filters))}
    ${filterField("filter-topic", "Area", option("", "All areas", filters.topic)
      + Object.entries(TOPICS).map(([key, topic]) => option(key, topic.name, filters.topic)).join(""))}
    ${filterField("filter-skill", "Topic", option("", "All topics", filters.skill)
      + skillsForArea(filters.topic).map(skill => option(skill, LESSONS[skill].title, filters.skill)).join(""))}
    ${filterField("filter-level", "Difficulty", option("", "All difficulties", filters.level)
      + levels.map(level => option(level, level, filters.level)).join(""))}
  </div>`;

  return {
    selected,
    html: `
      <div class="shell route-shell">
        <div class="route-top">
          <h1 id="route-title" tabindex="-1">Practice problems</h1>
          <p>Find problems by competition, topic or difficulty. Each one has hints and a worked solution.</p>
          ${filters.skill ? `<p><a class="text-link" href="${lessonUrl(filters.skill)}">Open the ${LESSONS[filters.skill].title.toLowerCase()} lesson</a></p>` : ""}
        </div>
        ${filtersHtml}
        ${selected ? `
          <div class="practice-layout">
            ${renderProblem(selected, matches, filters)}
            ${renderProblemList(selected, matches, filters)}
          </div>` : `
          <section class="panel empty-state" role="status">
            <h2>No matching problems</h2>
            <p>Try another combination of competition, topic and difficulty.</p>
            <a class="button button-outline" href="#practice">Clear filters</a>
          </section>`}
      </div>`
  };
}

function renderProblem(problem, matches, filters) {
  const contest = contestById[problem.contest];
  const index = matches.indexOf(problem);
  const solved = progress.completed[problem.id]?.status === "solved";
  const reviewed = progress.completed[problem.id]?.status === "reviewed";
  const isProof = problem.format === "proof";
  const type = { choice: "Multiple choice", integer: "Integer answer", proof: "Written proof" }[problem.format];
  const step = (position, label) => matches[position]
    ? `<a class="button button-outline button-small" href="${practiceUrl({ ...filters, problem: matches[position].id })}">${label}</a>`
    : `<button class="button button-outline button-small" type="button" disabled>${label}</button>`;

  return `
    <article class="panel problem-panel tone-${contest.tone}" aria-labelledby="problem-heading">
      <div class="problem-header">
        <div class="problem-tags">
          <span class="chip chip-tint">${problem.track}</span>
          <a class="chip chip-link" href="${lessonUrl(problem.skill)}" aria-label="Learn ${LESSONS[problem.skill].title.toLowerCase()}">${LESSONS[problem.skill].title}</a>
          <span class="chip">${problem.level}</span>
          <span class="chip">${type}</span>
        </div>
        <span class="problem-position">${index + 1} of ${matches.length}</span>
      </div>
      <h2 id="problem-heading" tabindex="-1">${problem.title}</h2>
      <p class="problem-prompt">${problem.prompt}</p>
      ${isProof ? proofForm() : answerForm(problem, solved)}
      <div class="reveals">
        <details class="reveal">
          <summary>${problem.hints.length === 1 ? "Hint" : "Hints"} </summary>
          ${problem.hints.length === 1 ? `<p>${problem.hints[0]}</p>`
            : `<ol class="hint-list">${problem.hints.map(hint => `<li>${hint}</li>`).join("")}</ol>`}
        </details>
        <details class="reveal">
          <summary>${isProof ? "Worked proof" : "Worked solution"}</summary>
          ${problem.solution.map(paragraph => `<p>${paragraph}</p>`).join("")}
          ${isProof ? `
            <p><strong>Check your proof</strong></p>
            <ul class="proof-checklist">
              <li>Did you justify each step?</li>
              <li>Did you cover all possible cases?</li>
              <li>Did you prove exactly what the question asks?</li>
            </ul>
            <button id="review-proof" class="button button-outline button-small review-action" type="button" aria-pressed="${reviewed}">
              ${reviewed ? "Proof reviewed" : "Mark proof reviewed"}
            </button>
            <span class="sr-only" id="review-status" role="status"></span>` : ""}
        </details>
      </div>
      <div class="problem-controls" aria-label="Problem navigation">
        ${step(index - 1, "Previous problem")}
        ${step(index + 1, "Next problem")}
      </div>
    </article>`;
}

function answerForm(problem, solved) {
  const entry = problem.format === "choice"
    ? `<fieldset class="choice-list"><legend class="sr-only">Choose an answer</legend>
      ${problem.choices.map((choice, index) => `
        <div class="choice-option">
          <input type="radio" id="choice-${index}" name="answer" value="${index}">
          <label for="choice-${index}"><span class="choice-key">${"ABCDE"[index]}</span>${choice}</label>
        </div>`).join("")}
      </fieldset>`
    : `<label class="field answer-field" for="answer-entry">
      <span>${problem.contest === "aime" ? "Your answer (0 to 999)" : "Your integer answer"}</span>
      <input id="answer-entry" name="answer" inputmode="${problem.answer < 0 ? "text" : "numeric"}" autocomplete="off" maxlength="12">
    </label>`;

  return `
    <form class="problem-answer" id="answer-form">
      ${entry}
      <button class="button button-solid" type="submit">Check answer</button>
      <p class="feedback${solved ? " is-correct" : ""}" id="answer-feedback" role="status">${solved ? "You solved this problem." : ""}</p>
    </form>`;
}

function proofForm() {
  return `
    <details class="proof-guide">
      <summary class="text-link">Write proof notes</summary>
      <label class="field proof-notes" for="proof-notes">
        <span>Your notes</span>
        <textarea id="proof-notes" maxlength="8000" placeholder="Start with what is given, then justify each step." aria-describedby="notes-status"></textarea>
      </label>
      <small class="notes-status" id="notes-status"></small>
    </details>`;
}

function renderProblemList(selected, matches, filters) {
  return `
    <nav class="panel problem-list" aria-label="Problem list">
      <div class="problem-list-head">
        <h2>Problem set</h2>
        <span>${problemCount(matches.length)}</span>
      </div>
      <ol>${matches.map((problem, index) => {
        const completed = progress.completed[problem.id];
        return `<li>
          <a href="${practiceUrl({ ...filters, problem: problem.id })}" data-problem="${problem.id}"${problem === selected ? ' aria-current="true"' : ""}>
            <span class="problem-list-index">${completed ? "✓" : index + 1}</span>
            <span class="problem-list-title">
              ${problem.title}
              <small class="problem-list-track">${problem.track}${completed ? ` · ${completed.status === "solved" ? "Solved" : "Reviewed"}` : ""}</small>
            </span>
          </a>
        </li>`;
      }).join("")}</ol>
    </nav>`;
}

function recordCompletion(problem, status) {
  if (progress.completed[problem.id]?.status !== status) {
    progress.completed[problem.id] = { status, time: Date.now() };
  }
  saveProgress();
  const reward = status === "solved" ? 15 : 5;
  void window.FreshPoints.earn("Vertex Maths", reward, status === "solved" ? "Problem solved" : "Proof reviewed", status + ":" + problem.id);
  const row = routed.querySelector(`[data-problem="${problem.id}"]`);
  row.querySelector(".problem-list-index").textContent = "✓";
  row.querySelector(".problem-list-track").textContent =
    `${problem.track} · ${status === "solved" ? "Solved" : "Reviewed"}`;
}

function bindPractice(problem) {
  const filters = routed.querySelector(".practice-filters");
  filters.addEventListener("change", event => {
    const [contest, track] = routed.querySelector("#filter-contest").value.split("/", 2);
    const topic = routed.querySelector("#filter-topic").value;
    const skill = routed.querySelector("#filter-skill").value;
    focusAfterFilter = event.target.id;
    location.hash = practiceUrl({
      contest,
      track,
      topic,
      skill: skillsForArea(topic).includes(skill) ? skill : "",
      level: routed.querySelector("#filter-level").value
    });
  });
  if (!problem) return;

  progress.lastProblem = problem.id;
  saveProgress();
  const list = routed.querySelector(".problem-list ol");
  const current = list.querySelector('[aria-current="true"]');
  if (current.offsetTop + current.offsetHeight > list.offsetTop + list.clientHeight) {
    list.scrollTop = current.offsetTop - list.offsetTop - 18;
  }

  if (problem.format === "proof") {
    const notes = routed.querySelector("#proof-notes");
    const notesStatus = routed.querySelector("#notes-status");
    const review = routed.querySelector("#review-proof");
    notes.value = typeof progress.notes[problem.id] === "string" ? progress.notes[problem.id] : "";
    notesStatus.textContent = canSave ? "Notes stay in this browser." : "Notes are available while this tab is open.";
    notes.addEventListener("input", () => {
      progress.notes[problem.id] = notes.value;
      saveProgress();
      notesStatus.textContent = canSave ? "Notes saved in this browser." : "Notes are available while this tab is open.";
    });
    review.addEventListener("click", () => {
      const reviewed = review.getAttribute("aria-pressed") === "true";
      if (reviewed) return;
      recordCompletion(problem, "reviewed");
      review.textContent = "Proof reviewed";
      review.setAttribute("aria-pressed", "true");
      routed.querySelector("#review-status").textContent = "Proof marked as reviewed.";
    });
    return;
  }

  const form = routed.querySelector("#answer-form");
  const feedback = routed.querySelector("#answer-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const answer = new FormData(form).get("answer")?.trim().replace(/^−/, "-") ?? "";
    const valid = problem.format === "choice" ? Boolean(answer)
      : /^-?\d+$/.test(answer) && (problem.contest !== "aime" || /^\d{1,3}$/.test(answer));
    const correct = valid && Number(answer) === problem.answer;
    feedback.classList.toggle("is-correct", correct);
    if (correct) {
      recordCompletion(problem, "solved");
      feedback.textContent = "Correct. Open the worked solution to compare methods.";
    } else if (!valid) {
      feedback.textContent = problem.format === "choice" ? "Choose an answer first."
        : problem.contest === "aime" ? "Enter an integer from 0 to 999." : "Enter a whole number.";
    } else {
      feedback.textContent = "Try again. Open the hint if you’re stuck.";
    }
  });
}

function renderProgress() {
  const solved = PROBLEMS.filter(problem => progress.completed[problem.id]?.status === "solved");
  const reviewed = PROBLEMS.filter(problem => progress.completed[problem.id]?.status === "reviewed");
  const activity = [...solved, ...reviewed].sort((a, b) => progress.completed[b.id].time - progress.completed[a.id].time);
  const last = PROBLEMS.find(problem => problem.id === progress.lastProblem);
  const continueUrl = last ? practiceUrl({ contest: last.contest, problem: last.id }) : "#practice";
  return `
    <div class="shell route-shell">
      <div class="route-top">
        <h1 id="route-title" tabindex="-1">My progress</h1>
        <p>${canSave ? "Your progress and Maths Lab setups are saved in this browser." : "Your work is available while this tab is open. Download a save to keep a copy."}</p>
      </div>
      <div class="progress-overview">
        <section class="panel"><strong class="progress-value">${solved.length}</strong><h2>Problems solved</h2></section>
        <section class="panel"><strong class="progress-value">${reviewed.length}</strong><h2>Proofs reviewed</h2></section>
        <section class="panel"><strong class="progress-value">${completedLessonCount()}</strong><h2>Lessons completed</h2></section>
      </div>
      ${renderLocalSaves()}
      <div class="progress-columns">
        <section class="panel">
          <h2>By competition</h2>
          <ul class="progress-rows">${CONTESTS.map(contest => {
            const total = PROBLEMS.filter(problem => problem.contest === contest.id).length;
            const complete = activity.filter(problem => problem.contest === contest.id).length;
            return `<li><a href="${practiceUrl({ contest: contest.id })}"><span>${contest.name}</span><span>${complete} of ${total} complete</span></a></li>`;
          }).join("")}</ul>
        </section>
        <section class="panel">
          <h2>Recent activity</h2>
          ${activity.length ? `<ul class="progress-rows">${activity.slice(0, 6).map(problem => `<li>
            <a href="${practiceUrl({ contest: problem.contest, problem: problem.id })}"><span>${problem.title}</span>
            <span>${progress.completed[problem.id].status === "solved" ? "Solved" : "Proof reviewed"}</span></a></li>`).join("")}</ul>`
            : '<p class="progress-empty">Solve a problem or review a proof to see it here.</p>'}
          <div class="actions">
            <a class="button button-solid" href="${continueUrl}">${last ? "Continue practising" : "Start practising"}</a>
            <a class="button button-outline" href="#learn">Learning path</a>
          </div>
        </section>
      </div>
    </div>`;
}

function showRoute(initial = false) {
  stopVisual?.();
  stopVisual = undefined;
  if (!initial) refreshSavedProgress();
  const route = getRoute();
  const isPractice = route.page === "practice";
  const isContest = route.page === "contest" && Boolean(route.contest);
  const isLearning = route.page === "learn";
  const isLab = route.page === "lab";
  const isRouted = isPractice || isContest || isLearning || isLab || route.page === "imo" || route.page === "progress";
  const wasPractice = activePage === "practice";
  activePage = isRouted ? route.page : route.page === "competitions" ? "competitions" : "home";
  const nav = isContest ? "competitions" : activePage;
  for (const item of document.querySelectorAll("[data-nav]")) {
    if (item.dataset.nav === nav) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }

  home.hidden = isRouted;
  routed.hidden = !isRouted;
  const titles = {
    learn: "Learning path",
    lab: "Maths Lab",
    practice: "Practice problems",
    imo: "IMO Prep",
    progress: "My progress",
    competitions: "Competitions",
    home: "Competition maths practice"
  };
  const title = isContest ? contestById[route.contest].name
    : isLearning && route.skill ? LESSONS[route.skill].title : titles[activePage];
  document.title = initial && activePage === "home" ? "Vertex Maths · Competition maths practice" : `${title} · Vertex Maths`;

  if (!isRouted) {
    routed.replaceChildren();
    if (activePage === "competitions") {
      document.querySelector("#competitions").scrollIntoView({ block: "start" });
      if (!initial) document.querySelector("#directory-title").focus({ preventScroll: true });
    } else if (route.page !== "main") {
      window.scrollTo(0, 0);
      if (!initial) document.querySelector("#hero-title").focus({ preventScroll: true });
    }
    return;
  }

  if (isPractice) {
    const view = renderPractice(route);
    routed.innerHTML = view.html;
    bindPractice(view.selected);
  } else if (isContest) {
    routed.innerHTML = renderContest(contestById[route.contest]);
  } else if (isLearning) {
    routed.innerHTML = route.skill ? renderLesson(route.skill) : renderLearningPath();
    if (route.skill) {
      bindLesson(route.skill);
      stopVisual = bindVisual(route.skill);
    }
  } else if (isLab) {
    const skill = route.skill || progress.lastLabTopic || lessonSequence[0];
    if (progress.lastLabTopic !== skill) {
      progress.lastLabTopic = skill;
      saveProgress();
    }
    routed.innerHTML = renderLab(skill);
    stopVisual = bindVisual(skill);
    routed.querySelector("#lab-topic").addEventListener("change", event => {
      focusAfterFilter = "lab-topic";
      location.hash = labUrl(event.target.value);
    });
  } else if (activePage === "imo") {
    routed.innerHTML = renderImo();
  } else {
    routed.innerHTML = renderProgress();
    bindLocalSaves();
  }

  if (focusAfterFilter) {
    routed.querySelector(`#${focusAfterFilter}`)?.focus({ preventScroll: true });
    focusAfterFilter = "";
  } else if (wasPractice && isPractice && routed.querySelector("#problem-heading")) {
    const heading = routed.querySelector("#problem-heading");
    heading.focus({ preventScroll: true });
    const bounds = heading.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight * 0.7) {
      routed.querySelector(".problem-panel").scrollIntoView({ block: "start" });
    }
  } else {
    window.scrollTo(0, 0);
    if (!initial) routed.querySelector("#route-title")?.focus({ preventScroll: true });
  }
}

document.querySelector(".skip-link").addEventListener("click", event => {
  event.preventDefault();
  document.querySelector("#main").focus();
});
window.addEventListener("hashchange", () => showRoute());
renderDirectory();
showRoute(true);
