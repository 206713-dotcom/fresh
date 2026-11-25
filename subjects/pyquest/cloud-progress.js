// Each student gets a private Firestore document at users/<Firebase Auth UID>.
// The Firebase console must have Cloud Firestore enabled and the supplied rules published.
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
let cloud = null;
let firestore = null;

async function connect() {
  if (cloud) return {cloud, firestore};
  const [{getApp}, api] = await Promise.all([
    import(SDK + 'firebase-app.js'),
    import(SDK + 'firebase-firestore.js')
  ]);
  cloud = api;
  firestore = api.getFirestore(getApp());
  return {cloud, firestore};
}

function reference(api, db, uid) {
  if (!uid || typeof uid !== 'string') throw new Error('Missing account ID.');
  return api.doc(db, 'users', uid);
}

export async function readCloudProgress(uid) {
  const {cloud: api, firestore: db} = await connect();
  // Request the server so an old device cache cannot replace current online progress.
  const snapshot = await api.getDocFromServer(reference(api, db, uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function createCloudProgress(uid, progress) {
  const {cloud: api, firestore: db} = await connect();
  await api.setDoc(reference(api, db, uid), {
    completed: progress.completed,
    questDone: progress.questDone || [],
    quizCorrect: progress.quizCorrect,
    igcseCorrect: progress.igcseCorrect || [],
    drafts: progress.drafts,
    labCode: progress.labCode,
    runs: progress.runs,
    updatedAt: api.serverTimestamp()
  }, {merge: true});
}

export async function applyCloudChanges(uid, changes) {
  const {cloud: api, firestore: db} = await connect();
  const update = {updatedAt: api.serverTimestamp()};
  if (changes.lessons?.length) update.completed = api.arrayUnion(...changes.lessons);
  if (changes.quests?.length) update.questDone = api.arrayUnion(...changes.quests);
  if (changes.quiz?.length) update.quizCorrect = api.arrayUnion(...changes.quiz);
  if (changes.igcse?.length) update.igcseCorrect = api.arrayUnion(...changes.igcse);
  if (changes.drafts && Object.keys(changes.drafts).length) update.drafts = changes.drafts;
  if (changes.labCode !== null && changes.labCode !== undefined) update.labCode = changes.labCode;
  if (changes.runInc) update.runs = api.increment(changes.runInc);
  await api.setDoc(reference(api, db, uid), update, {merge: true});
}

export function explainCloudError(error) {
  if (error?.code === 'permission-denied') return 'Cloud access denied. Publish the Firestore rules in SETUP.md.';
  if (error?.code === 'not-found' || error?.code === 'failed-precondition') return 'Create a Firestore database in Firebase first.';
  if (error?.code === 'unavailable') return 'Offline. Your changes are kept on this Mac until you reconnect.';
  return error?.message || 'Cloud sync failed. Check Firebase setup and connection.';
}
