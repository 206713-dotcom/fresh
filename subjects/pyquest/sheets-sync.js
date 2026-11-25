// Best-effort ONE-WAY mirror of verified Firebase student progress into the
// Google Sheets teacher report. Firestore remains the student's source of truth.
// No passwords, student IDs, code drafts, chat messages or friend lists are sent.
import {sheetsSyncConfig} from './sheets-config.js';

const allowedUrl = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/;
let queuedTimer = null;
let activePromise = null;
let waiting = null;

export const sheetsSyncConfigured = allowedUrl.test(String(sheetsSyncConfig.webAppUrl || '').trim());

export function queueSheetsSync(user, progress) {
  if (!sheetsSyncConfigured || !user || !progress) return;
  waiting = {
    user,
    progress: {
      completed: [...(progress.completed || [])],
      questDone: [...(progress.questDone || [])],
      quizCorrect: [...(progress.quizCorrect || [])]
    }
  };
  clearTimeout(queuedTimer);
  queuedTimer = setTimeout(() => { void drain(); }, 1400);
}

async function drain() {
  if (activePromise || !waiting) return;
  const payload = waiting;
  waiting = null;
  activePromise = (async () => {
    try {
      const idToken = await payload.user.getIdToken();
      // Apps Script verifies the Firebase ID token server-side before writing.
      // no-cors avoids browser CORS preflights but makes the response opaque:
      // a completed fetch is NOT proof Sheets accepted the update.
      await fetch(sheetsSyncConfig.webAppUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        redirect: 'follow',
        headers: {'Content-Type': 'text/plain;charset=utf-8'},
        body: JSON.stringify({idToken, ...payload.progress})
      });
    } catch (_) {
      // Do not interfere with normal Firestore progress saving.
      // Next sign-in or successful Firestore save retries a full snapshot.
    }
  })();
  try { await activePromise; } finally {
    activePromise = null;
    if (waiting) {clearTimeout(queuedTimer);queuedTimer=setTimeout(()=>{void drain();},1400);}
  }
}
