const saveFormat = "vertex-maths-save";
const saveVersion = 1;
const saveFileLimit = 2 * 1024 * 1024;
const savedProblems = new Map(PROBLEMS.map(problem => [problem.id, problem.format]));
const progressMaps = ["completed", "notes", "lessons", "visuals"];
const progressPointers = ["lastProblem", "lastLabTopic"];

function savedRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function validSaveNumber(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function captureVisual(visual, state) {
  if (visual.board) return { cells: [...state.cells], moves: state.moves };
  return Object.fromEntries(visual.controls.map(control => [control.key, state[control.key]]));
}

function validateVisual(visual, data) {
  const state = savedRecord(data);
  if (visual.board) {
    if (!validSaveNumber(state.moves) || !Array.isArray(state.cells) || state.cells.length !== 16
      || state.cells.some(value => !validSaveNumber(value) || value > state.moves)) return null;
    const sums = [0, 0];
    state.cells.forEach((value, index) => { sums[boardColour(index)] += value; });
    if (sums[0] !== state.moves || sums[1] !== state.moves) return null;
    return captureVisual(visual, state);
  }

  for (const control of visual.controls) {
    const value = state[control.key];
    if (control.choices) {
      if (!control.choices.some(([choice]) => value === choice)) return null;
    } else {
      const steps = (value - control.min) / control.step;
      if (!Number.isFinite(value) || value < control.min || value > control.max
        || Math.abs(steps - Math.round(steps)) > 1e-7) return null;
    }
  }
  return captureVisual(visual, state);
}

function normalizeProgress(value) {
  const stored = savedRecord(value);
  const clean = { completed: {}, notes: {}, lessons: {}, visuals: {}, lastProblem: "", lastLabTopic: "" };

  for (const [id, entry] of Object.entries(savedRecord(stored.completed))) {
    const format = savedProblems.get(id);
    if (!format) continue;
    const { status, time } = savedRecord(entry);
    const expected = format === "proof" ? "reviewed" : "solved";
    if (status === expected) clean.completed[id] = { status, time: validSaveNumber(time) ? time : 0 };
  }
  for (const [id, note] of Object.entries(savedRecord(stored.notes))) {
    if (savedProblems.get(id) === "proof" && typeof note === "string") clean.notes[id] = note.slice(0, 8000);
  }
  for (const [skill, time] of Object.entries(savedRecord(stored.lessons))) {
    if (Object.hasOwn(LESSONS, skill) && validSaveNumber(time) && time > 0) clean.lessons[skill] = time;
  }
  for (const [skill, entry] of Object.entries(savedRecord(stored.visuals))) {
    if (!Object.hasOwn(VISUALS, skill)) continue;
    const { state, time } = savedRecord(entry);
    const setup = validateVisual(VISUALS[skill], state);
    if (setup) clean.visuals[skill] = { state: setup, time: validSaveNumber(time) ? time : 0 };
  }

  if (savedProblems.has(stored.lastProblem)) clean.lastProblem = stored.lastProblem;
  if (typeof stored.lastLabTopic === "string" && Object.hasOwn(VISUALS, stored.lastLabTopic)) {
    clean.lastLabTopic = stored.lastLabTopic;
  }
  return clean;
}

// Start from the latest browser copy and apply only changes made in this tab.
function reconcileProgress(baseline, current, latest) {
  for (const category of progressMaps) {
    const before = baseline[category];
    const after = current[category];
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      if (JSON.stringify(before[key]) === JSON.stringify(after[key])) continue;
      if (Object.hasOwn(after, key)) latest[category][key] = after[key];
      else delete latest[category][key];
    }
  }
  for (const key of progressPointers) {
    if (current[key] !== baseline[key]) latest[key] = current[key];
  }
  return latest;
}

function encodeSave(data) {
  return JSON.stringify({
    format: saveFormat,
    version: saveVersion,
    progress: normalizeProgress(data)
  }, null, 2);
}

function decodeSave(text) {
  const backup = savedRecord(JSON.parse(text));
  const data = backup.progress;
  if (backup.format !== saveFormat || backup.version !== saveVersion
    || !data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid Vertex Maths save");
  }
  return normalizeProgress(data);
}

function mergeSave(current, incoming) {
  const progress = structuredClone(current);
  const counts = { problems: 0, lessons: 0, notes: 0, setups: 0, noteConflicts: 0 };

  for (const [id, entry] of Object.entries(incoming.completed)) {
    const existing = progress.completed[id];
    if (!existing) counts.problems++;
    if (!existing || entry.time > existing.time) progress.completed[id] = entry;
  }
  for (const [skill, time] of Object.entries(incoming.lessons)) {
    if (!progress.lessons[skill]) counts.lessons++;
    progress.lessons[skill] = Math.max(time, progress.lessons[skill] ?? 0);
  }
  for (const [id, note] of Object.entries(incoming.notes)) {
    if (!note.trim()) continue;
    const existing = progress.notes[id];
    if (existing?.trim()) {
      if (existing !== note) counts.noteConflicts++;
    } else {
      progress.notes[id] = note;
      counts.notes++;
    }
  }
  for (const [skill, setup] of Object.entries(incoming.visuals)) {
    const existing = progress.visuals[skill];
    if (!existing || setup.time > existing.time) {
      progress.visuals[skill] = setup;
      counts.setups++;
    }
  }
  for (const key of progressPointers) {
    if (!progress[key]) progress[key] = incoming[key];
  }
  return { progress, counts };
}

function renderLocalSaves() {
  const setups = Object.keys(progress.visuals).length;
  return `
    <section class="panel local-save-panel" id="local-saves" aria-labelledby="local-saves-title">
      <div>
        <h2 id="local-saves-title" tabindex="-1">Local saves</h2>
        <p>Download a backup of solved problems, completed lessons, proof notes and Maths Lab setups. Import it to combine your work with the progress in this browser.</p>
        <p class="local-save-detail">${problemCount(setups, "Maths Lab setup")} saved</p>
      </div>
      <div class="actions local-save-actions">
        <button class="button button-solid" id="download-save" type="button">Download save</button>
        <button class="button button-outline" id="import-save" type="button">Import save</button>
        <input id="save-file" type="file" accept=".json,application/json" hidden>
      </div>
      <p class="local-save-feedback" id="local-save-feedback" role="status"></p>
    </section>`;
}

function describeSaveImport(counts) {
  const parts = [
    [counts.problems, "problem"], [counts.lessons, "lesson"],
    [counts.notes, "proof note"], [counts.setups, "Maths Lab setup"]
  ].filter(([count]) => count > 0).map(([count, label]) => problemCount(count, label));
  const summary = parts.length ? `Imported ${new Intl.ListFormat("en").format(parts)}.` : "Save imported. Your progress is up to date.";
  const conflicts = counts.noteConflicts;
  return conflicts ? `${summary} Kept ${problemCount(conflicts, "existing proof note")} where the text differed.` : summary;
}

function bindLocalSaves() {
  const panel = routed.querySelector("#local-saves");
  const feedback = panel.querySelector("#local-save-feedback");
  const fileInput = panel.querySelector("#save-file");
  const importButton = panel.querySelector("#import-save");

  panel.querySelector("#download-save").addEventListener("click", () => {
    refreshSavedProgress();
    const url = URL.createObjectURL(new Blob([encodeSave(progress)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "vertex-maths-save.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.textContent = "Save download started.";
  });

  importButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    if (file.size > saveFileLimit) {
      feedback.textContent = "This file is too large. Choose a Vertex Maths save file.";
      return;
    }

    let incoming;
    importButton.disabled = true;
    try {
      incoming = decodeSave(await file.text());
    } catch {
      feedback.textContent = "Choose a valid save file downloaded from Vertex Maths.";
      return;
    } finally {
      importButton.disabled = false;
    }

    if (!panel.isConnected || getRoute().page !== "progress") return;
    refreshSavedProgress();
    const merged = mergeSave(progress, incoming);
    Object.assign(progress, merged.progress);
    saveProgress();
    const scroll = window.scrollY;
    showRoute(true);
    window.scrollTo(0, scroll);
    routed.querySelector("#import-save").focus({ preventScroll: true });
    const message = describeSaveImport(merged.counts);
    routed.querySelector("#local-save-feedback").textContent = canSave
      ? message
      : `${message} Download a save to keep your work after closing this tab.`;
  });
}
