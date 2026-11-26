const prefix = 'fresh-english-0500:';
const session = new Map();

export function read(key) {
  try { return localStorage.getItem(prefix + key) ?? session.get(key); }
  catch { return session.get(key); }
}

export function write(key, value, messageTarget = null) {
  session.set(key, value);
  try {
    localStorage.setItem(prefix + key, value);
    if (messageTarget) messageTarget.textContent = 'Saved on this device';
  } catch {
    if (messageTarget) messageTarget.textContent = 'Storage unavailable. Changes last for this session.';
  }
}
