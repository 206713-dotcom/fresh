/**
 * Google Sheets progress sync.
 *
 * The school forbids external databases, so every piece of student progress is
 * mirrored into the `Progress` tab of the Google Sheet through the Apps Script
 * Web App in `apps-script/Code.gs`.
 *
 * Design notes:
 * - One row per student, keyed by the 6-digit student number (`access_code`).
 * - Requests carry the signed session token, so a row can only be read or
 *   written by the student who owns it.
 * - The whole `ecbiz_*` localStorage surface is snapshotted as JSON into
 *   `progress_json`, so components keep reading localStorage as before and do
 *   not need to know a Sheet exists.
 * - Writes are debounced and flushed when the tab is hidden.
 * - On the first load after signing in, a zeroed `Students` row is created too,
 *   so the teacher sees every student in both tabs instead of empty sheets.
 * - Every save also mirrors coins/streak into `Students`, and a periodic pull
 *   lets a teacher raise coins by editing the Sheet directly.
 * - Sync state is exposed (`getSyncSnapshot`) so the UI can never fail silently.
 */

import { APPS_SCRIPT_URL, postToScript, requestScript } from "./appsScript";
import { clearSession, getSession } from "./auth";

const STORAGE_PREFIX = "ecbiz_";
const DEBOUNCE_MS = 4000;
const RELOAD_FLAG = "ecbiz_sheet_hydrated";
const ROSTER_FLAG = "ecbiz_roster_seeded";
const REFRESH_MS = 60000;

/** Keys that describe the session, not the student's progress. */
const SESSION_KEYS = new Set([
  "ecbiz_student_code",
  "ecbiz_session_token",
  "ecbiz_student_name",
]);

/** Result of asking the Sheet for this student's row. */
export type PullResult = "changed" | "present" | "empty" | "error" | "skip";

export type SyncState = "idle" | "syncing" | "saved" | "error";

export interface SyncSnapshot {
  state: SyncState;
  message?: string;
  lastSyncedAt?: number;
}

let snapshot: SyncSnapshot = { state: "idle" };

export function getSyncSnapshot(): SyncSnapshot {
  return snapshot;
}

function setSyncState(next: SyncSnapshot) {
  snapshot = next;
  try {
    window.dispatchEvent(new CustomEvent("ecbiz_sync_state", { detail: next }));
  } catch {
    /* not in a browser */
  }
}

/**
 * A rejected token means the Sheet refused the request (expired session, or the
 * Apps Script was re-deployed with a new signing secret). The local token still
 * decodes, so without this the app looks signed in while every save fails.
 */
function handleExpiredSession() {
  clearSession();
  setSyncState({
    state: "error",
    message: "Session expired — sign in again to keep saving your progress.",
  });
}

let installed = false;
let hydrated = false;
let dirty = false;
let restoring = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let inFlight = false;
let refreshing = false;


export function getStudentCode(): string | null {
  return getSession()?.code ?? null;
}

function collectSnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      if (SESSION_KEYS.has(key)) continue;
      const value = localStorage.getItem(key);
      if (value !== null) snapshot[key] = value;
    }
  } catch {
    /* storage unavailable */
  }
  return snapshot;
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function writeLocal(key: string, value: string) {
  restoring = true;
  try {
    localStorage.setItem(key, value);
  } finally {
    restoring = false;
  }
}

/** Push the current localStorage snapshot to the `Progress` tab. */
export async function pushProgress(): Promise<boolean> {
  const session = getSession();
  if (!session || !APPS_SCRIPT_URL) return false;
  if (inFlight) {
    dirty = true;
    return false;
  }

  const data = collectSnapshot();
  const payload = {
    action: "progress",
    token: session.token,
    coins: readNumber(data["ecbiz_study_coins"]),
    streak: readNumber(data["ecbiz_study_streak"]),
    unlocked_themes: [
      ...new Set([
        ...parseJson<string[]>(data["ecbiz_study_themes"] ?? null, ["default"]),
        ...parseJson<string[]>(data["ecbiz_unlocked_themes"] ?? null, []),
      ]),
    ],
    progress_json: JSON.stringify(data),
  };

  inFlight = true;
  dirty = false;
  setSyncState({ state: "syncing" });
  try {
    const res = await postToScript(payload);
    if (!res.success) {
      if (res.error === "unauthorized") {
        handleExpiredSession();
        return false;
      }
      dirty = true;
      setSyncState({
        state: "error",
        message: res.error || "Could not save to the Google Sheet.",
      });
      return false;
    }

    // Mirror the headline figures into the `Students` roster row. Best effort:
    // a failure here must not mark the progress save as failed.
    void postToScript({
      action: "student",
      token: session.token,
      access_code: session.code,
      student_id: session.code,
      name: session.name || "Student",
      coins: readNumber(data["ecbiz_study_coins"]),
      streak: readNumber(data["ecbiz_study_streak"]),
      time_spent_sec: readNumber(data["ecbiz_time_spent_sec"]),
      mcq_completed: readNumber(data["ecbiz_mcq_completed"]),
      mcq_errors: parseJson(data["ecbiz_mcq_wrong"] ?? null, []),
    }).then((studentRes) => {
      if (!studentRes.success && studentRes.error === "unauthorized") {
        handleExpiredSession();
      }
    });

    setSyncState({ state: "saved", lastSyncedAt: Date.now() });
    return true;
  } catch (err) {
    dirty = true;
    setSyncState({
      state: "error",
      message: err instanceof Error ? err.message : "Could not save to the Google Sheet.",
    });
    return false;
  } finally {
    inFlight = false;
    if (dirty) scheduleSave();
  }
}

/**
 * Pull the student's row and restore it into localStorage.
 *
 * "empty" means the Sheet answered successfully and there is genuinely no row
 * yet — only then is it safe to overwrite it with local data. A failed request
 * reports "error" so a network hiccup can never wipe a saved record.
 */
export async function pullProgress(): Promise<PullResult> {
  const session = getSession();
  if (!session || !APPS_SCRIPT_URL) return "skip";

  const url = `${APPS_SCRIPT_URL}?action=progress&token=${encodeURIComponent(session.token)}`;
  const json = await requestScript<{ progress_json?: unknown } | null>(url);

  if (!json.success) {
    if (json.error === "unauthorized") {
      handleExpiredSession();
    } else {
      setSyncState({
        state: "error",
        message: json.error || "Could not reach the Google Sheet.",
      });
    }
    return "error";
  }
  if (!json.data) return "empty";

  // Apps Script parses JSON columns, so this may already be an object; older
  // rows may still hold the raw string.
  const raw = json.data.progress_json;
  const remote =
    typeof raw === "string"
      ? parseJson<Record<string, string> | null>(raw, null)
      : (raw as Record<string, string> | null);

  if (!remote || typeof remote !== "object") return "empty";
  if (Object.keys(remote).length === 0) return "empty";

  let changed = false;
  for (const [key, value] of Object.entries(remote)) {
    if (!key.startsWith(STORAGE_PREFIX) || SESSION_KEYS.has(key)) continue;
    if (typeof value !== "string") continue;
    if (localStorage.getItem(key) !== value) {
      writeLocal(key, value);
      changed = true;
    }
  }

  return changed ? "changed" : "present";
}

/**
 * Create the student's `Students` row the first time they open the app.
 *
 * Nothing in the main study app writes that tab — only the demo button on
 * `/dashboard` did — so it stayed permanently empty. The teacher uses it as the
 * class roster, so seed a zeroed row instead of leaving it blank.
 *
 * Runs at most once per tab: a `sessionStorage` flag stops a GET on every page
 * load.
 */
async function ensureStudentRow() {
  const session = getSession();
  if (!session || !APPS_SCRIPT_URL) return;

  const flag = `${ROSTER_FLAG}_${session.code}`;
  try {
    if (sessionStorage.getItem(flag)) return;
  } catch {
    /* storage unavailable — fall through and check anyway */
  }

  const url = `${APPS_SCRIPT_URL}?action=student&token=${encodeURIComponent(
    session.token
  )}`;
  const existing = await requestScript<unknown>(url);

  if (!existing.success) {
    if (existing.error === "unauthorized") handleExpiredSession();
    return;
  }

  // Only create a row when the request succeeded and the row is genuinely gone.
  if (existing.data) {
    try {
      sessionStorage.setItem(flag, "1");
    } catch {
      /* ignore */
    }
    return;
  }

  const created = await postToScript({
    action: "student",
    token: session.token,
    access_code: session.code,
    student_id: session.code,
    name: session.name || "Student",
    coins: 0,
    streak: 0,
    time_spent_sec: 0,
    mcq_completed: 0,
    mcq_errors: [],
    two_mark_scores: [],
    four_mark_scores: [],
    six_mark_scores: [],
    eight_mark_scores: [],
    twelve_mark_scores: [],
    missed_marks_breakdown: [],
    topical_log: {},
    recommended_focus: "General Review",
  });

  if (!created.success) {
    if (created.error === "unauthorized") handleExpiredSession();
    return;
  }

  try {
    sessionStorage.setItem(flag, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Let the teacher raise a student's coins (or streak) by editing either the
 * `Progress` or `Students` tab. Only ever raises the local value, so a stale
 * Sheet row can never take coins away from the student mid-session.
 */
export async function refreshCoinsFromSheet(): Promise<void> {
  const session = getSession();
  if (!session || !APPS_SCRIPT_URL || refreshing) return;
  refreshing = true;

  try {
    const base = `${APPS_SCRIPT_URL}?action=`;
    const token = encodeURIComponent(session.token);
    const [progressRes, studentRes] = await Promise.all([
      requestScript<{
        coins?: unknown;
        streak?: unknown;
        progress_json?: unknown;
      } | null>(`${base}progress&token=${token}`),
      requestScript<{ coins?: unknown; streak?: unknown } | null>(
        `${base}student&token=${token}`
      ),
    ]);

    if (progressRes.error === "unauthorized" || studentRes.error === "unauthorized") {
      handleExpiredSession();
      return;
    }

    let remoteCoins = 0;
    let remoteStreak = 0;

    if (progressRes.success && progressRes.data) {
      remoteCoins = Math.max(remoteCoins, readNumber(progressRes.data.coins));
      remoteStreak = Math.max(remoteStreak, readNumber(progressRes.data.streak));

      const raw = progressRes.data.progress_json;
      const inner =
        typeof raw === "string"
          ? parseJson<Record<string, string> | null>(raw, null)
          : (raw as Record<string, string> | null);
      if (inner && typeof inner === "object") {
        remoteCoins = Math.max(remoteCoins, readNumber(inner["ecbiz_study_coins"]));
        remoteStreak = Math.max(remoteStreak, readNumber(inner["ecbiz_study_streak"]));
      }
    }

    if (studentRes.success && studentRes.data) {
      remoteCoins = Math.max(remoteCoins, readNumber(studentRes.data.coins));
      remoteStreak = Math.max(remoteStreak, readNumber(studentRes.data.streak));
    }

    let changed = false;

    const localCoins = readNumber(
      localStorage.getItem("ecbiz_study_coins") ?? undefined
    );
    if (remoteCoins > localCoins) {
      localStorage.setItem("ecbiz_study_coins", String(remoteCoins));
      window.dispatchEvent(
        new CustomEvent("ecbiz_coins_updated", {
          detail: { coins: remoteCoins },
        })
      );
      changed = true;
    }

    const localStreak = readNumber(
      localStorage.getItem("ecbiz_study_streak") ?? undefined
    );
    if (remoteStreak > localStreak) {
      localStorage.setItem("ecbiz_study_streak", String(remoteStreak));
      changed = true;
    }

    if (changed) flushProgress();
  } finally {
    refreshing = false;
  }
}

function scheduleSave() {
  if (restoring) return;
  if (!hydrated) {
    dirty = true;
    return;
  }
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void pushProgress();
  }, DEBOUNCE_MS);
}

/** Force an immediate save (used when the tab is hidden or study ends). */
export function flushProgress() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  void pushProgress();
}

function patchStorage() {
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (
      this === window.localStorage &&
      key.startsWith(STORAGE_PREFIX) &&
      !SESSION_KEYS.has(key)
    ) {
      scheduleSave();
    }
  };

  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function (key: string) {
    originalRemoveItem.call(this, key);
    if (
      this === window.localStorage &&
      key.startsWith(STORAGE_PREFIX) &&
      !SESSION_KEYS.has(key)
    ) {
      scheduleSave();
    }
  };
}

/**
 * Call once at startup. Restores the signed-in student's data, then keeps it
 * in sync. Does nothing when the visitor is signed out.
 */
export function startSheetSync() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  if (!APPS_SCRIPT_URL) {
    console.info(
      "[EcBiz] VITE_APPS_SCRIPT_URL is not set — progress stays in this browser only."
    );
    hydrated = true;
    return;
  }

  patchStorage();

  // Give the teacher a roster entry in the `Students` tab as soon as the
  // student opens the app, not only after they use the demo dashboard button.
  void ensureStudentRow();

  window.addEventListener("pagehide", () => flushProgress());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushProgress();
  });

  // Let a teacher bump coins in the Sheet and have them show up without the
  // student reloading: check on focus and once a minute while visible.
  window.addEventListener("focus", () => {
    if (document.visibilityState === "visible") void refreshCoinsFromSheet();
  });
  window.setInterval(() => {
    if (document.visibilityState === "visible") void refreshCoinsFromSheet();
  }, REFRESH_MS);

  void (async () => {
    const result = await pullProgress();
    hydrated = true;

    if (result === "changed" && !sessionStorage.getItem(RELOAD_FLAG)) {
      // Components read localStorage during their first render, so refresh
      // once. The session flag guarantees at most one reload per tab.
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
      return;
    }

    // Only seed a row that genuinely does not exist yet.
    if (result === "empty") {
      await pushProgress();
    } else if (result === "present") {
      // A row exists; make sure the roster tab reflects the live figures.
      void refreshCoinsFromSheet();
    }

    if (dirty) scheduleSave();
  })();
}
