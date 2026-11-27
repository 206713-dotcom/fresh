// "What we learned": the team's own notes on what building Since 1958 taught us, about the machines, about NASA's
// data, about building it, and about telling the story. Each lesson that happened in a place in the app has a
// button that takes you there, and a link to the NASA page it comes from.
const L = {
  machines: {
    tab: 'The machines',
    lead: 'We started out thinking of these machines as junk left in space. Reading NASA’s records for every one of them changed that.',
    cards: [
      { k: 'Still at work', t: 'Some of them are still working for us', x: 'The mirror Apollo 11 left on the Moon in 1969 still reflects laser pulses sent from Earth. Timing them shows the Moon moving away from us by about 3.8 cm a year, about as fast as fingernails grow.', go: ['echo'], see: 'Fire the laser', src: ['NASA: The Apollo experiment that keeps on giving', 'https://www.nasa.gov/solar-system/the-apollo-experiment-that-keeps-on-giving/'] },
      { k: 'Far means slow', t: 'Talking to Voyager 1 takes a day', x: 'On 18 November 2026 Voyager 1 becomes the first human-made object one light-day from Earth. A command sent today arrives tomorrow, and the answer takes another day to come back. Commands still go up to it at only 16 bits per second.', go: ['vmsg'], see: 'Write to Voyager 1', src: ['NASA Science: Where are Voyager 1 and 2 now?', 'https://science.nasa.gov/?p=338314'] },
      { k: 'Left on purpose', t: 'Leaving things behind can be the plan', x: 'Perseverance set down ten sealed tubes at a spot called Three Forks: eight of rock and dust, one of Martian air and one “witness” tube. They wait there, on purpose, for a future mission to collect them.', go: ['site', 'perseverance'], see: 'Go to Perseverance', src: ['NASA: Perseverance shows off its collection of Mars samples', 'https://www.nasa.gov/?p=320652'] },
      { k: 'Old helps new', t: 'An old machine became a science sample', x: 'In 1969 the Apollo 12 crew landed about 160 m from Surveyor 3, walked over, and cut off its TV camera and other parts, about 10 kg in all, so that scientists could see what two and a half years on the Moon had done to them.', go: ['site', 'surveyor3'], see: 'Go to Surveyor 3', src: ['NASA Science: Surveyor 3', 'https://science.nasa.gov/mission/surveyor-3/'] },
      { k: 'No way back', t: 'Some can never be visited again', x: 'Astronauts repaired Hubble five times between 1993 and 2009. Webb works 1.5 million km away, at a point called L2, farther than people have ever travelled: whatever happens to it, nobody can go and fix it.', go: ['probe', 'jwst'], see: 'Ride with Webb', src: ['NASA Science: James Webb Space Telescope', 'https://science.nasa.gov/mission/webb/'] },
      { k: 'Silent, not gone', t: 'Silence is not the end of the story', x: 'Pioneer 10’s last faint signal reached Earth in January 2003, more than 30 years after launch. It has said nothing since, but it is still out there, still flying away from the Sun.', go: ['probe', 'pioneer10', '2003-01-23T00:00:00Z'], see: 'Ride with Pioneer 10', src: ['NASA Science: Pioneer 10 sends last signal', 'https://science.nasa.gov/missions/pioneer/pioneer-10-sends-last-signal/'] },
    ],
  },
  data: {
    tab: 'NASA’s data',
    lead: 'Accuracy turned out to be most of the work. These are the mistakes we caught, and what each one taught us to check.',
    cards: [
      { k: 'Units', t: 'Check the unit before the number', x: 'One page says New Horizons flew 12,500 km above Pluto, another says 7,800. Both are right: the second is in miles. We now write down the unit of every figure we copy.', src: ['NASA Science: 10 things, looking back at Pluto', 'https://science.nasa.gov/missions/new-horizons/10-things-looking-back-at-pluto/'] },
      { k: 'Time zones', t: 'Every time needs its time zone', x: 'Dawn was captured by Ceres at 4:39 a.m. Pacific time, which is 12:39 UTC. Mixing the two would put the event eight hours early. Every time in the app is in UTC.', src: ['NASA Science: Dawn', 'https://science.nasa.gov/mission/dawn/'] },
      { k: 'The record', t: 'Go back to the catalogue', x: 'We nearly changed Sojourner’s mass because another page gave a different number. NASA’s own catalogue says 10.5 kg, so it stayed. When two pages disagree, we go back to NSSDCA.', src: ['NASA NSSDCA: Mars Pathfinder', 'https://nssdc.gsfc.nasa.gov/planetary/mesur.html'] },
      { k: 'From where?', t: 'A distance is always from somewhere', x: 'Our first version timed Voyager’s radio signal from the Sun. A friend testing the site pointed out that the signal comes to Earth, so we measure it from Earth now.', go: ['probe', 'voyager1'], see: 'Ride with Voyager 1', src: ['NASA Science: Voyager 1', 'https://science.nasa.gov/mission/voyager/voyager-1/'] },
      { k: 'Calibrate', t: 'A good model can still be off', x: 'Our Voyager 1 path was about 34 million km off, close to two minutes of light. We set it so that it reaches one light-day from Earth at the exact second NASA gives: 18 November 2026, 10:16:07 UTC.', go: ['vmsg'], see: 'See the countdown', src: ['NASA Science: Where are Voyager 1 and 2 now?', 'https://science.nasa.gov/?p=338314'] },
      { k: 'Be honest', t: 'Say what is simplified', x: 'Some things we could not make exact, like the paths of probes between planets. Instead of hiding that, a “What is real?” page lists every simplification, and Message to Voyager says plainly that nothing is really sent.', go: ['about'], see: 'Open “What is real?”' },
    ],
  },
  build: {
    tab: 'Building it',
    lead: 'None of us had built anything this big in a browser before. Most problems were problems of scale.',
    cards: [
      { k: 'Scale', t: 'From billions of kilometres to one footstep', x: 'Neptune is about 4.5 billion km from the Sun; an astronaut’s eyes are 1.7 m above the ground. A computer cannot hold both in one set of numbers, so space is drawn in kilometres around the camera, and each landing site in metres of its own.', go: ['site', 'apollo11'], see: 'Walk at Apollo 11' },
      { k: 'Real time, real sky', t: 'The Sun has to be in the right place', x: 'Positions come from Astronomy Engine for the exact date. A friend noticed that Perseverance landed in the dark in our first version; on Mars it was afternoon. Now every site is lit for its real date and hour, and the lunar day has a black sky.', go: ['site', 'perseverance'], see: 'Go to Perseverance' },
      { k: 'NASA models', t: 'Real models need real work', x: 'Most 3D models come from NASA 3D Resources, but they arrive in different formats and sizes. Curiosity’s file stored its wheels turned and tilted, so we straightened them. Where NASA has no model, we built one to the real size.', go: ['object', 'curiosity'], see: 'Take Curiosity apart' },
      { k: 'Time', t: 'Time must stand still while you fly', x: 'Testers found that the clock kept running while the camera flew to a planet. Now the clock stops during every flight and time travel, so you arrive on the day you asked for.' },
      { k: 'Phones', t: 'It has to work on a phone', x: 'Judges and students may not have a gaming computer. The picture adjusts its own resolution when frames slow down, and on touch screens walking uses an on-screen joystick.' },
    ],
  },
  story: {
    tab: 'Telling the story',
    lead: 'The hardest question was not how to draw a rover, but how to make a 12-year-old care about one.',
    cards: [
      { k: 'Time and place', t: 'Start with when and where, not with a list', x: 'Instead of a table of missions, you run the clock and each machine arrives on its real day, at its real place. The story is told in the order it happened.' },
      { k: 'Why it stayed', t: 'Every machine answers the same questions', x: 'Why it went, what it did, what we learned, why it stayed, where it is now, and its status today. Asking the same six questions of every machine made the differences between them easy to see.' },
      { k: 'Watch people', t: 'Test with real people, early', x: 'Friends who tried the site found the bugs we could not see ourselves: the Voyager distance, the dark landing, time running during flights, a menu that would not open. The tutorial now waits until you have really used each control.', go: ['tutorial'], see: 'Start the tutorial' },
      { k: 'A feeling', t: 'One real event beats ten facts', x: 'Writing a message to Voyager 1, and watching it leave at 16 bits per second, makes the distance felt in a way a number never did for us. NASA did the same with the public in 2017.', go: ['vmsg'], see: 'Write to Voyager 1', src: ['NASA Science: NASA beamed your #MessageToVoyager', 'https://science.nasa.gov/?p=416420'] },
    ],
  },
  next: {
    tab: 'What’s next',
    lead: 'What we would do with more time.',
    cards: [
      { k: 'More objects', t: 'All of NASA’s list', x: 'NASA’s 2012 catalogue of material on the Moon lists hundreds of objects, down to tools and cameras. We show the big ones; we would like to place the rest.', src: ['NASA: Catalogue of manmade material on the Moon', 'https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf'] },
      { k: 'More people', t: 'Translations and narration', x: 'A voice that reads the story aloud, and translations, so that a student anywhere can use it.' },
      { k: 'New missions', t: 'Artemis', x: 'New hardware will be left on the Moon by the Artemis missions. A time machine that ends today should keep growing.' },
    ],
  },
};
const ORDER = ['machines', 'data', 'build', 'story', 'next'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function setupLearned({ run }) {
  const el = document.createElement('div'); el.id = 'learned'; el.hidden = true; document.body.appendChild(el);
  let cur = 'machines';
  const render = () => {
    const s = L[cur];
    el.innerHTML = `<div class="ab-page lr-page" role="dialog" aria-label="What we learned"><button class="ab-x" aria-label="Close">✕</button>
      <p class="lr-k">Team Concinendial</p><h2>What we learned making Since 1958</h2>
      <div class="lr-tabs">${ORDER.map((id) => `<button data-tab="${id}" class="${id === cur ? 'on' : ''}">${L[id].tab}</button>`).join('')}</div>
      <p class="lr-lead">${esc(s.lead)}</p>
      <div class="lr-grid">${s.cards.map((c, i) => `<article class="lr-card"><span class="lr-n">${String(i + 1).padStart(2, '0')} · ${esc(c.k)}</span><h3>${esc(c.t)}</h3><p>${esc(c.x)}</p>
        <div class="lr-row">${c.go ? `<button class="lr-go" data-i="${i}">${esc(c.see)} →</button>` : ''}${c.src ? `<a href="${c.src[1]}" target="_blank" rel="noopener">${esc(c.src[0])}</a>` : ''}</div></article>`).join('')}</div>
    </div>`;
    el.querySelector('.ab-page').scrollTop = 0;
  };
  el.addEventListener('click', (e) => {
    if (e.target === el || e.target.closest('.ab-x')) { el.hidden = true; return; }
    const t = e.target.closest('[data-tab]'); if (t) { cur = t.dataset.tab; render(); return; }
    const g = e.target.closest('.lr-go'); if (g) { const c = L[cur].cards[+g.dataset.i]; el.hidden = true; run(...c.go); }
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.hidden) { el.hidden = true; e.stopImmediatePropagation(); } }, true);
  return { open(tab) { if (tab) cur = tab; render(); el.hidden = false; }, get isOpen() { return !el.hidden; } };
}
