export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n) => String(n).padStart(2, '0');

export function parts(ms) {
  const d = new Date(ms);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() };
}

export function fmtDate(ms) {
  const p = parts(ms);
  return `${p.d} ${MONTHS[p.m]} ${p.y}`;
}

export function fmtDateTime(ms) {
  const p = parts(ms);
  return `${p.d} ${MONTHS[p.m]} ${p.y}, ${pad(p.h)}:${pad(p.mi)} UTC`;
}

export function fmtHM(ms) {
  const p = parts(ms);
  return `${pad(p.h)}:${pad(p.mi)}`;
}

/** A simulated time span in seconds, two largest units. */
export function fmtSpan(s) {
  s = Math.max(0, s);
  const Y = 365.25 * 86400;
  if (s >= Y) { const y = Math.floor(s / Y); const d = Math.floor((s - y * Y) / 86400); return `${y} yr ${d} d`; }
  if (s >= 86400) { const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600); return `${d} d ${h} h`; }
  if (s >= 3600) { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${h} h ${m} min`; }
  if (s >= 60) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s)} s`;
}

export function fmtDist(km) {
  if (km >= 1.0e7) return `${(km / 149597870.7).toFixed(2)} AU`;
  if (km >= 1000) return `${Math.round(km).toLocaleString('en-US')} km`;
  if (km >= 1) return `${km.toFixed(1)} km`;
  return `${Math.round(km * 1000)} m`;
}

export function daysInMonth(y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); }

export function fmtLatLon(lat, lon) {
  const la = `${Math.abs(lat).toFixed(3)}°${lat >= 0 ? 'N' : 'S'}`;
  let l = ((lon + 540) % 360) - 180;
  const lo = `${Math.abs(l).toFixed(3)}°${l >= 0 ? 'E' : 'W'}`;
  return `${la}, ${lo}`;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
