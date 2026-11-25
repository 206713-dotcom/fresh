// Fresh serves the local edition on its public address.
export const localPreview = true;

const prefix = 'pyquest-local-v1:';
const profilesKey = 'profiles';
export const primaryLocalUid = 'local-learner';
export const localRecordKey = key => prefix + key;

export function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(localRecordKey(key));
    return value === null ? fallback : JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(localRecordKey(key), JSON.stringify(value));
  } catch {
    throw new Error('The browser could not save this change. Check its site storage settings.');
  }
}

export function mutateLocal(key, fallback, mutate) {
  // The lock covers the entire read/modify/write across tabs. A thrown mutation
  // leaves the saved record intact.
  return navigator.locks.request(localRecordKey(key), () => {
    const value = readLocal(key, fallback);
    const result = mutate(value);
    writeLocal(key, value);
    return result;
  });
}

export function onLocalChange(key, callback) {
  const listen = event => {
    if (event.storageArea === localStorage && (event.key === localRecordKey(key) || event.key === null)) callback();
  };
  window.addEventListener('storage', listen);
  return () => window.removeEventListener('storage', listen);
}

function storedProfiles() {
  const profiles = readLocal(profilesKey, []);
  return Array.isArray(profiles) ? profiles : [];
}

export function localProfiles() {
  const savedIds = storedProfiles().map(profile => profile?.uid).filter(uid => typeof uid === 'string' && uid.startsWith('local-'));
  const ids = [...new Set([primaryLocalUid, ...savedIds])];
  return ids.map((uid, index) => ({uid, label: index === 0 ? 'Local profile' : `Profile ${index + 1}`}));
}

export function activeLocalProfile() {
  let uid;
  try { uid = sessionStorage.getItem(prefix + 'active-profile'); } catch { /* Use the default profile. */ }
  const profiles = localProfiles();
  return profiles.find(profile => profile.uid === uid) ?? profiles[0];
}

export function selectLocalProfile(uid) {
  const profile = localProfiles().find(item => item.uid === uid);
  if (!profile) throw new Error('Choose an existing local profile.');
  sessionStorage.setItem(prefix + 'active-profile', uid);
  return profile;
}

export function selectTeamProfile(player) {
  if (player === '1') return selectLocalProfile(primaryLocalUid);
  const alternate = localProfiles()[1];
  if (alternate) return selectLocalProfile(alternate.uid);
  const uid = 'local-player-2';
  writeLocal(profilesKey, [...storedProfiles(), {uid}]);
  return selectLocalProfile(uid);
}

export const characterStyleKey = uid => 'character-style:' + uid;

export function readCharacterStyle(uid) {
  return readLocal(characterStyleKey(uid), 'boy') === 'girl' ? 'girl' : 'boy';
}

export function saveCharacterStyle(uid, style) {
  if (style !== 'boy' && style !== 'girl') throw new Error('Choose a character style.');
  writeLocal(characterStyleKey(uid), style);
}

export const localRoomsKey = 'team-rooms';
export function localRoomsFor(uid) {
  return Object.values(readLocal(localRoomsKey, {})).filter(room => room.members.includes(uid));
}
