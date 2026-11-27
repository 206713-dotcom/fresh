// "Message to Voyager". In 2017, for Voyager 1's 40th birthday, NASA invited the public to write it a message of at
// most 60 characters (more than 30,000 were sent) and beamed the winner towards Voyager 1 from the Deep Space Network,
// at Voyager's own 16 bits per second. On 18 November 2026 Voyager 1 becomes the first human-made object one light-day
// from Earth, and NASA asks people to flash it a light. Here anyone can write theirs: it "leaves" at 16 bits per
// second as real bits, and then the page follows it at the speed of light, with the real distance to Voyager 1.
// Nothing is really transmitted, and the page says so. The last message is kept in this browser only.
// Everything here runs on the simulation's clock, like the rest of the app: the distance, the countdown to the
// light-day and the message's trip all follow the date on the clock (paused, sped up or rewound). Before Voyager 1's
// launch there is nothing to write to yet, and the page offers to jump to 2017 or to today.
import { fmtDate, esc } from './format.js';

const C_KM_S = 299792.458, BPS = 16, MAX = 60, KEY = 'anf-vmsg';
// NASA: "On Wednesday, Nov. 18, 2026, at 2:16:07 a.m. PST, Voyager 1 will be 25,902,068,356 km away from Earth"
const LIGHT_DAY = Date.UTC(2026, 10, 18, 10, 16, 7), LIGHT_DAY_KM = 25902068356;
const VGR_NIGHT = Date.UTC(2026, 10, 18, 12);            // NASA's "Shine Bright": after sunset on 17 November
const LAUNCH = Date.UTC(1977, 8, 5, 12, 56), NASA_2017 = Date.UTC(2017, 8, 5, 18);   // Voyager 1's launch; NASA's real #MessageToVoyager day
let simNow = () => Date.now();
/** the simulation's clock: every time on this page is read from it */
export function useClock(fn) { simNow = fn; }
const two = (n) => String(n).padStart(2, '0');
const utc = (ms) => { const d = new Date(ms); return `${fmtDate(ms)}, ${two(d.getUTCHours())}:${two(d.getUTCMinutes())} UTC`; };
const span = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${m} min` : m ? `${m} min ${s % 60} s` : `${s} s`; };
const hms = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 3600)} h ${two(Math.floor((s % 3600) / 60))} min ${two(s % 60)} s`; };
const dhm = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return d > 730 ? `${Math.floor(d / 365.25)} years ${Math.floor(d % 365.25)} d` : d ? `${d} d ${h} h ${m} min` : h ? `${h} h ${m} min` : `${m} min ${s % 60} s`; };
const km = (x) => `${Math.round(x).toLocaleString('en-US')} km`;
const bkm = (x) => `${(x / 1e9).toFixed(2)} billion km`;
const SRC_2017 = '<a href="https://science.nasa.gov/?p=416420" target="_blank" rel="noopener">NASA Science: NASA beamed your #MessageToVoyager</a>';
const SRC_LD = '<a href="https://science.nasa.gov/?p=338314" target="_blank" rel="noopener">NASA Science: Where are Voyager 1 and 2 now?</a>';
const SRC_CS = '<a href="https://www.collectspace.com/news/news-090517c-voyager-40th-anniversary-golden-record.html" target="_blank" rel="noopener">collectSPACE: 16 bits per second, 28 seconds</a>';
const SRC_VGR = '<a href="https://svs.gsfc.nasa.gov/15111" target="_blank" rel="noopener">NASA: Shine Bright for Voyager’s Light-Day</a>';

/** the last message sent from this browser, or null */
export function lastMessage() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
/** the one light-day milestone, before or after it happens */
export function lightDayLine(now = simNow()) {
  const today = `On the clock, ${fmtDate(now)}: `;
  return now < LAUNCH ? `${today}Voyager 1 has not been launched yet. It leaves Earth on 5 September 1977.`
    : now < LIGHT_DAY ? `${today}in ${dhm(LIGHT_DAY - now)}, Voyager 1 becomes the first human-made object one light-day from Earth.`
    : `${today}Voyager 1 is more than one light-day from Earth. No human-made object has ever been this far.`;
}
/** one line for the home panel about the last message: how far it has gone */
export function messageProgress(now = simNow()) {
  const m = lastMessage(); if (!m) return '';
  const T = (m.T || m.dist / C_KM_S) * 1000, done = (now - m.at) / T;
  return done < 0 ? `Your message leaves Earth on ${utc(m.at)}: the clock has not got there yet.`
    : done >= 1 ? `Your message reached Voyager 1 on ${utc(m.at + T)}.` : `Your message is ${(done * 100).toFixed(done < 0.1 ? 2 : 1)}% of the way there · arrives in ${span((T - (now - m.at)) / 1000)} of clock time`;
}
export const homeLines = (now = simNow()) => [lightDayLine(now), messageProgress(now)].filter(Boolean).join('\n');

export function setupVoyagerMessage({ distanceNow, helioNow, onRide, onJump }) {
  const el = document.createElement('div'); el.id = 'vmsg'; el.hidden = true; document.body.appendChild(el);
  const fl = document.createElement('div'); fl.id = 'vgr'; fl.hidden = true; document.body.appendChild(fl);
  let raf = 0, timer = 0, stage = '', flashT = 0;
  const stop = () => { cancelAnimationFrame(raf); raf = 0; clearInterval(timer); timer = 0; };
  const close = () => { stop(); stopFlash(); el.hidden = true; document.body.classList.remove('vm-on'); };
  const banner = (now) => now < LIGHT_DAY
    ? `<div class="vm-ld"><b class="vm-cd">${dhm(LIGHT_DAY - now)}</b><span>On the clock, <b class="vm-date">${utc(now)}</b>: until Voyager 1 becomes the first human-made object <b>one light-day from Earth</b>: ${LIGHT_DAY_KM.toLocaleString('en-US')} km, on ${utc(LIGHT_DAY)} (NASA).</span></div>`
    : `<div class="vm-ld"><b>1 light-day</b><span>On the clock, <b class="vm-date">${utc(now)}</b>: since ${utc(LIGHT_DAY)}, Voyager 1 is farther from Earth than light travels in a whole day. No human-made object has ever been this far (NASA).</span></div>`;

  // ---- 1. the story, and the writing
  const write = () => {
    stop(); stage = 'write';
    const now = simNow();
    if (now < LAUNCH) { notYet(now); return; }
    const age = Math.floor((now - LAUNCH) / (365.25 * 864e5));
    el.innerHTML = `<div class="vm-card">
      <button class="vm-x" data-a="close" title="Close">✕</button>
      <p class="vm-k">Message to Voyager</p>
      <h2>${age >= 1 ? `Still listening, ${age} year${age === 1 ? '' : 's'} after launch` : 'Just launched, and already listening'}</h2>
      ${banner(now)}
      <p class="vm-p">In 2017, for Voyager 1’s 40th birthday, NASA asked people everywhere to write it a short message. <b>More than 30,000 people did.</b> The winning message was beamed towards Voyager 1 by the Deep Space Network, at Voyager’s own speed of 16 bits per second.</p>
      <p class="vm-p vm-us"><b>This is the story that made us build Since 1958.</b> Nobody will ever bring Voyager 1 back, yet tens of thousands of people wrote to it, and for its light-day NASA is asking the whole world to flash it a light. So we put everything NASA left behind on the Moon, on Mars and in space where it really is, and we let you write to the farthest one.</p>
      <div class="vm-stats">
        <div><b>30,000+</b><span>messages sent to NASA in 2017</span></div>
        <div><b>${MAX}</b><span>characters at most, as in NASA’s rules</span></div>
        <div><b>${BPS}</b><span>bits per second: Voyager’s speed</span></div>
        <div><b class="vm-lt">${hms(distanceNow(now) / C_KM_S)}</b><span>for a radio signal to reach it on the clock’s date</span></div>
      </div>
      <div class="vm-in"><input type="text" maxlength="${MAX}" placeholder="Write to Voyager 1…" aria-label="Your message to Voyager 1"><span class="vm-n">0/${MAX}</span></div>
      <div class="vm-row"><button class="vm-go" data-a="send" disabled>Send it with the Deep Space Network</button><button data-a="close">Close</button></div>
      <p class="vm-note">A simulation on the app’s clock: nothing is really transmitted. The distance on the clock’s date and the speed are real, and NASA did this for real on 5 September 2017.
        Sources: ${SRC_2017} · ${SRC_LD} · ${SRC_CS}</p>
    </div>`;
    const inp = el.querySelector('input'), n = el.querySelector('.vm-n'), go = el.querySelector('.vm-go'), lt = el.querySelector('.vm-lt'), cd = el.querySelector('.vm-cd');
    const upd = () => { n.textContent = `${inp.value.length}/${MAX}`; go.disabled = !inp.value.trim(); };
    inp.addEventListener('input', upd);
    inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && inp.value.trim()) send(inp.value.trim()); if (e.key === 'Escape') close(); });
    const dt = el.querySelector('.vm-date');
    timer = setInterval(() => { const t = simNow(); if (t < LAUNCH) { write(); return; } lt.textContent = hms(distanceNow(t) / C_KM_S); if (cd) cd.textContent = dhm(LIGHT_DAY - t); if (dt) dt.textContent = utc(t); }, 250);
    setTimeout(() => inp.focus(), 60);
  };

  // ---- 0. before 5 September 1977 there is no Voyager 1 to write to
  const notYet = (now) => {
    stage = 'write';
    el.innerHTML = `<div class="vm-card">
      <button class="vm-x" data-a="close" title="Close">✕</button>
      <p class="vm-k">Message to Voyager</p>
      <h2>Voyager 1 has not been launched yet</h2>
      <div class="vm-ld"><b class="vm-cd">${dhm(LAUNCH - now)}</b><span>On the clock, <b class="vm-date">${utc(now)}</b>: until Voyager 1 leaves Earth, on 5 September 1977.</span></div>
      <p class="vm-p">Move the clock forward to write to it. In 2017, for Voyager 1’s 40th birthday, NASA asked people everywhere to write it a short message: <b>more than 30,000 people did</b>, and the winner was beamed to it on 5 September 2017.</p>
      <div class="vm-row"><button class="vm-go" data-a="to2017">Go to 5 September 2017</button><button data-a="totoday">Go to today</button><button data-a="close">Close</button></div>
      <p class="vm-note">Sources: ${SRC_2017} · ${SRC_LD}</p>
    </div>`;
    const cd = el.querySelector('.vm-cd'), dt = el.querySelector('.vm-date');
    timer = setInterval(() => { const t = simNow(); if (t >= LAUNCH) { write(); return; } cd.textContent = dhm(LAUNCH - t); dt.textContent = utc(t); }, 250);
  };

  // ---- 2. leaving Earth: the real bits, at 16 per second
  const send = (text) => {
    stop(); stage = 'send';
    const bytes = new TextEncoder().encode(text), bits = [...bytes].map((b) => b.toString(2).padStart(8, '0')).join(''), total = bits.length, secs = total / BPS;
    const away = `${span(distanceNow(simNow()) / C_KM_S)} away at the speed of light`;
    el.innerHTML = `<div class="vm-card vm-tx">
      <p class="vm-k">Deep Space Network → Voyager 1</p>
      <h2>Transmitting…</h2>
      <p class="vm-q">“${esc(text)}”</p>
      <canvas class="vm-cv" width="900" height="220"></canvas>
      <div class="vm-bar"><i></i></div>
      <p class="vm-p vm-c"><b class="vm-bits">0</b> of ${total} bits sent at ${BPS} bits per second · <span class="vm-left">${span(secs)}</span> to go</p>
      <p class="vm-note">Every letter is 8 bits. At Voyager’s speed your ${bytes.length} letters take ${span(secs)}: NASA’s winning message in 2017 took 28 seconds.</p>
      <div class="vm-row"><button data-a="skip">Skip to the end</button></div>
    </div>`;
    const cv = el.querySelector('canvas'), g = cv.getContext('2d'), bar = el.querySelector('.vm-bar i'), nb = el.querySelector('.vm-bits'), left = el.querySelector('.vm-left');
    const stars = Array.from({ length: 140 }, () => [Math.random() * 900, Math.random() * 220, Math.random()]);
    const t0 = performance.now();
    const step = () => {
      const t = (performance.now() - t0) / 1000, k = Math.min(total, Math.floor(t * BPS));
      g.clearRect(0, 0, 900, 220);
      for (const [x, y, b] of stars) { g.fillStyle = `rgba(200,220,255,${0.25 + b * 0.5})`; g.fillRect(x, y, 1.4, 1.4); }
      // the Earth and a dish on the left, Voyager far to the right
      const ge = g.createRadialGradient(60, 110, 4, 70, 110, 48); ge.addColorStop(0, '#9cd2ff'); ge.addColorStop(0.6, '#2d6db3'); ge.addColorStop(1, '#0b2a52');
      g.fillStyle = ge; g.beginPath(); g.arc(70, 110, 46, 0, 7); g.fill();
      g.strokeStyle = '#d3e2ee'; g.lineWidth = 2; g.beginPath(); g.arc(122, 92, 14, Math.PI * 0.15, Math.PI * 1.15); g.stroke(); g.beginPath(); g.moveTo(116, 96); g.lineTo(112, 118); g.stroke();
      g.fillStyle = '#d3e2ee'; g.fillRect(842, 106, 18, 6); g.beginPath(); g.arc(838, 109, 9, Math.PI / 2, Math.PI * 1.5); g.fill(); g.fillRect(860, 108, 26, 1.5);
      g.font = '600 13px system-ui, sans-serif'; g.fillStyle = '#93abc0'; g.fillText('Earth', 50, 180); g.fillText('Voyager 1', 812, 140);
      g.fillStyle = '#5f7488'; g.fillText(away, 450 - g.measureText(away).width / 2, 196);
      // the bits already sent stream out to the right, one by one
      g.font = '600 13px ui-monospace, monospace';
      for (let i = Math.max(0, k - 90); i < k; i++) { const age = t - i / BPS, x = 146 + age * 150; if (x > 800) continue; g.fillStyle = `rgba(146,191,227,${Math.max(0.2, 1 - x / 900)})`; g.fillText(bits[i], x, 114); }
      nb.textContent = k; bar.style.width = `${(k / total) * 100}%`; left.textContent = span(Math.max(0, secs - t));
      if (k >= total) { sent(text); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    el._skip = () => sent(text);
  };

  // ---- 3. on its way: followed live at the speed of light
  const sent = (text) => {
    stop(); stage = 'sent';
    const at = simNow(), d = distanceNow(at);
    const T = distanceNow(at + d / C_KM_S * 1000) / C_KM_S;                     // it moves on while the signal travels
    const v = (helioNow(at + 86400e3) - helioNow(at)) / 86400;                  // its own speed, away from the Sun
    try { localStorage.setItem(KEY, JSON.stringify({ text, at, dist: d, T })); } catch (e) { /* private window: no memory */ }
    document.dispatchEvent(new Event('vmsg-sent'));
    const vgr = at < VGR_NIGHT
      ? 'For the light-day, NASA is inviting everyone to point a light at the sky after sunset on 17 November and flash <b>V‑G‑R</b> in Morse code. Your screen can do it.'
      : 'For the light-day, NASA invited people everywhere to point a light at the sky after sunset on 17 November and flash <b>V‑G‑R</b> in Morse code. Your screen can still do it.';
    el.innerHTML = `<div class="vm-card">
      <button class="vm-x" data-a="close" title="Close">✕</button>
      <p class="vm-k">Message to Voyager</p>
      <h2>Your message is on its way</h2>
      <p class="vm-q">“${esc(text)}”</p>
      <div class="vm-live2"><div class="vm-bar big"><i></i></div><p><b class="vm-tr">0 km</b> travelled at the speed of light · <span class="vm-pc">0%</span></p><p class="vm-clk">On the clock: <b class="vm-date">${utc(at)}</b> · speed the clock up to watch it arrive</p></div>
      <div class="vm-stats two">
        <div><b>${utc(at)}</b><span>left Earth</span></div>
        <div><b>${utc(at + T * 1000)}</b><span>reaches Voyager 1, ${bkm(d)} away, after ${hms(T)}</span></div>
      </div>
      <p class="vm-p">Voyager 1 flies on at about ${v.toFixed(1)} km every second. If it could answer, its reply would need another ${span(T)} to come home: every command NASA sends it today makes this same trip. Voyager cannot read words, but your signal would pass it and go on into interstellar space.</p>
      <div class="vm-vgr"><p>${vgr}</p><button data-a="flash">✦ Flash V‑G‑R</button></div>
      <div class="vm-row"><button class="vm-go" data-a="ride">Ride along with Voyager 1</button><button data-a="again">Write another</button><button data-a="close">Close</button></div>
      <p class="vm-note">A simulation on the app’s clock: nothing is really transmitted. Kept in this browser only, so the home panel can show how far it has gone. Sources: ${SRC_LD} · ${SRC_VGR}</p>
    </div>`;
    const bar = el.querySelector('.vm-bar i'), tr = el.querySelector('.vm-tr'), pc = el.querySelector('.vm-pc');
    const dt = el.querySelector('.vm-date'), clk = el.querySelector('.vm-clk');
    timer = setInterval(() => {
      const now = simNow(), s = (now - at) / 1000, f = Math.max(0, Math.min(1, s / T));
      tr.textContent = km(Math.max(0, Math.min(s, T)) * C_KM_S); pc.textContent = s < 0 ? 'not sent yet on this date' : f >= 1 ? 'arrived ✓' : `${(f * 100).toFixed(4)}%`;
      bar.style.width = `${Math.max(0.4, f * 100)}%`; dt.textContent = utc(now);
      clk.lastChild.textContent = s < 0 ? ' · the clock is before the moment you sent it' : f >= 1 ? ' · it has reached Voyager 1' : ' · speed the clock up to watch it arrive';
    }, 50);
  };

  // ---- V-G-R in Morse code (...- --. .-.), the way NASA asked people to signal for the light-day. Slow on purpose:
  // the shortest flash is 0.3 s, well under three flashes a second.
  const U = 300, MORSE = ['...-', '--.', '.-.'];
  const seq = []; MORSE.forEach((c, i) => { [...c].forEach((s, j) => { seq.push([1, s === '.' ? U : 3 * U]); if (j < c.length - 1) seq.push([0, U]); }); seq.push([0, i < 2 ? 3 * U : 7 * U]); });
  function stopFlash() { clearTimeout(flashT); flashT = 0; fl.hidden = true; fl.classList.remove('on'); }
  function flash() {
    fl.hidden = false; fl.innerHTML = '<p>Point your screen at the sky · <b>V &nbsp;G &nbsp;R</b> · tap to stop</p>';
    let i = 0, rounds = 0;
    const tick = () => {
      if (i >= seq.length) { i = 0; if (++rounds >= 3) { stopFlash(); return; } }
      const [on, ms] = seq[i++]; fl.classList.toggle('on', !!on); flashT = setTimeout(tick, ms);
    };
    tick();
  }
  fl.addEventListener('pointerdown', stopFlash);

  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'close') close();
    else if (a === 'send') { const v = el.querySelector('input').value.trim(); if (v) send(v); }
    else if (a === 'skip') el._skip && el._skip();
    else if (a === 'again') write();
    else if (a === 'flash') flash();
    else if (a === 'ride') { close(); onRide(); }
    else if (a === 'to2017' || a === 'totoday') { onJump && onJump(a === 'to2017' ? NASA_2017 : Date.now()); setTimeout(write, 80); }
  });
  el.addEventListener('pointerdown', (e) => { if (e.target === el) close(); });
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!fl.hidden) stopFlash(); else if (!el.hidden && stage !== 'send') close();
  });
  return {
    open() { el.hidden = false; document.body.classList.add('vm-on'); write(); },
    close, get isOpen() { return !el.hidden; },
  };
}
