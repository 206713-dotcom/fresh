/* Twistor — physics from Key Stage 3 to A-Level.
   Runs after the course data and before the pages are built. The university stages (physics Years 1–4; maths Years 1–4
   and special functions) and the whole maths track (Foundations, A-Level and Further maths) are taken out of every
   registry, so no map, search, planner, flashcard deck or review lists them. A link to one of them inside the notes
   becomes plain text, and an old address that names one goes to the physics map. The competition pages are not in this
   edition either: their addresses go home. */
(function () {
  const WL = (window.WL = window.WL || {});
  const UNI = new Set(['y1', 'y2', 'y3', 'y4', 'm1', 'm2', 'm3', 'm4', 'msf', 'mf', 'ma', 'mfm']);   // every stage that is not school physics
  const stage = {};
  (WL.stubs || []).forEach((n) => (stage[n.id] = n.stage));
  (WL.mstubs || []).forEach((n) => (stage[n.id] = n.stage));
  Object.values(WL.topics || {}).forEach((t) => { if (t && t.id && t.stage) stage[t.id] = t.stage; });
  const dead = new Set(Object.keys(stage).filter((id) => UNI.has(stage[id])));
  const alive = (id) => !dead.has(id);
  WL.edition = { name: 'Twistor', dead, uni: UNI };

  if (Array.isArray(WL.stages)) WL.stages = WL.stages.filter((s) => !UNI.has(s.id));
  if (Array.isArray(WL.mstages)) WL.mstages = WL.mstages.filter((s) => !UNI.has(s.id));
  if (Array.isArray(WL.stubs)) WL.stubs = WL.stubs.filter((n) => alive(n.id));
  if (Array.isArray(WL.mstubs)) WL.mstubs = WL.mstubs.filter((n) => alive(n.id));
  ['order', 'morder'].forEach((k) => { if (Array.isArray(WL[k])) WL[k] = WL[k].filter(alive); });
  ['topics', 'notes', 'derive', 'deep', 'written', 'svideos', 'videos', 'keyterms', 'narr', 'narrMove', 'mathsFor', 'prereq', 'mprereq'].forEach((k) => {
    const R = WL[k]; if (R && typeof R === 'object' && !Array.isArray(R)) dead.forEach((id) => delete R[id]);
  });
  ['prereq', 'mprereq', 'mathsFor'].forEach((k) => { const R = WL[k]; if (R) Object.keys(R).forEach((id) => { if (Array.isArray(R[id])) R[id] = R[id].filter(alive); }); });
  Object.values(WL.topics || {}).forEach((t) => { if (t && Array.isArray(t.ml)) t.ml = t.ml.filter(alive); });
  if (WL.banners) UNI.forEach((s) => delete WL.banners[s]);
  if (Array.isArray(WL.syllabi)) WL.syllabi = WL.syllabi.filter((S) => !UNI.has(S.stage));

  /* the home spotlight: school topics only. Each hook says what the clip shows. */
  WL.spots = [
    { topic: 'al-photons', title: 'One photon at a time', hook: 'Fire light at two slits one photon at a time. Each lands as a single dot in a random place, yet thousands of dots paint the stripes of a wave.' },
    { topic: 'al-cosmology', title: 'Run the universe backwards', hook: 'The further away a galaxy is, the faster it moves away from us. Run that motion backwards and everything was together about 14 billion years ago.' },
    { topic: 'gcse-stars', title: 'How a star ends', hook: 'A star like the Sun swells into a red giant and ends as a white dwarf. One of more than about 8 Suns explodes as a supernova and leaves a neutron star or a black hole.' },
    { topic: 'al-stationary', title: 'Waves that stand still', hook: 'Waves bouncing between the ends of a string interfere. Only the wavelengths that fit, with a node at each end, survive: they are the notes the string can play.' },
    { topic: 'al-spectra', title: 'The barcode of an element', hook: 'An electron dropping between two levels gives out one photon carrying exactly the energy difference. Every element has its own set of lines, which is how we know what stars are made of.' },
    { topic: 'al-polarisation', title: 'Two filters and a dial', hook: 'A polarising filter passes only one direction of the wave. Turn a second filter through θ and the light getting through falls as cos²θ, to nothing at 90°.' },
    { topic: 'al-doppler', title: 'Crests that crowd together', hook: 'A moving source sends out each crest from a new place, so the crests bunch up ahead of it and spread out behind. For light, the shift tells us how fast a galaxy is moving.' },
    { topic: 'al-damping', title: 'Push at the right moment', hook: 'Drive an oscillator near its natural frequency and its swing grows enormously. Damping lowers the peak, which is why bridges and car suspensions are damped on purpose.' },
    { topic: 'gcse-induction', title: 'A magnet, a coil, a voltage', hook: 'Push a magnet into a coil and a voltage appears, but only while the field through the coil is changing. Pull it out and the voltage reverses.' },
    { topic: 'al-decay', title: 'Random, yet predictable', hook: 'Nobody can say when one nucleus will decay. Yet in each half-life half of those left decay, so a large number of them follows a smooth curve.' },
    { topic: 'ks3-tides-eclipses', title: 'Two tides a day', hook: 'The Moon pulls the near ocean a little more than Earth’s centre, and the centre more than the far ocean, so the water bulges on both sides of the Earth.' },
    { topic: 'al-particles', title: 'Inside a neutron', hook: 'In beta-minus decay a down quark turns into an up quark by giving out a W^{−} boson, which becomes an electron and an antineutrino.' },
    { topic: 'ks3-colour', title: 'White is every colour', hook: 'A prism slows each colour by a different amount, so white light fans out into a spectrum: violet bends most and red least.' },
    { topic: 'al-astro', title: 'A star’s colour is its thermometer', hook: 'Hotter stars give out more light at every wavelength and peak at shorter wavelengths, so Wien’s law reads a star’s surface temperature from its colour.' }
  ].filter((s) => alive(s.topic));

  /* old addresses: a university topic or stage goes to its map; removed pages go home */
  const GONE = /^(research|research-.*|rp|inv|lab|lab-new|olympiad|oly-.*|olyproblems|olyp-.*|advanced|adv-.*|admin|compete|compete-.*|cl-.*|cmock-.*|pcompete|pcompete-.*|pl-.*|pmock-.*)$/;
  const MATHS_PAGE = { maths: 'physics', 'maths-stages': 'physics-stages', 'map-maths': 'map', 'level-maths': 'level' };
  WL.routeGuard = (h) => {
    let m = /^(t|tl)-(.+)$/.exec(h);
    if (m && dead.has(m[2])) return 'physics';
    m = /^(m?stage)-(.+)$/.exec(h);
    if (m && (m[1] === 'mstage' || UNI.has(m[2]))) return 'physics';
    if (MATHS_PAGE[h]) return MATHS_PAGE[h];
    if (GONE.test(h)) return 'home';
    return null;
  };

  /* links to removed topics inside notes, derivations and lectures: keep the words, drop the link */
  const target = (href) => {
    const m = /^#(t|tl|stage|mstage)-([^?#]+)/.exec(href || '');
    if (!m) return false;
    return m[1] === 't' || m[1] === 'tl' ? dead.has(decodeURIComponent(m[2])) : UNI.has(m[2]);
  };
  function unlink(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('a[href^="#t-"], a[href^="#tl-"], a[href^="#stage-"], a[href^="#mstage-"]').forEach((a) => {
      if (!target(a.getAttribute('href'))) return;
      const li = a.closest('li');
      if (li && li.children.length === 1 && li.textContent.trim() === a.textContent.trim()) { li.remove(); return; }   // a list entry that was only the link
      const s = document.createElement('span'); s.className = 'tw-gone'; s.innerHTML = a.innerHTML; a.replaceWith(s);
    });
  }
  WL.twUnlink = unlink;
  const start = () => {
    const v = document.getElementById('view'); if (!v || !window.MutationObserver) return;
    let q = 0;
    new MutationObserver(() => { if (q) return; q = requestAnimationFrame(() => { q = 0; unlink(v); }); }).observe(v, { childList: true, subtree: true });
    unlink(document.body);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
/* after the v6 modules have registered their data (key terms, the lecture list), take the university topics out of that too */
window.WL.twPost = function () {
  const WL = window.WL, E = WL.edition; if (!E) return;
  const alive = (id) => !E.dead.has(id);
  if (WL.keyterms) E.dead.forEach((id) => delete WL.keyterms[id]);
  if (Array.isArray(WL.lecMeta)) WL.lecMeta = WL.lecMeta.filter((l) => (l.topics || []).some(alive)).map((l) => Object.assign({}, l, { topics: l.topics.filter(alive), level: String(l.level || '').replace(/\s*→\s*Year \d( maths)?/g, '') }));
};
/* Twistor's own first-visit tours: short, one idea a card, pointing at the real controls */
window.WL.tourSteps = function (h) {
  const NAV = h.NAV;
  const rings = '<svg viewBox="0 0 64 40" width="64" height="40"><defs><linearGradient id="tt-g" x1="0" x2="1"><stop offset="0" stop-color="#5cd6ff"/><stop offset="0.5" stop-color="#9a8cff"/><stop offset="1" stop-color="#ff7fc9"/></linearGradient></defs><circle cx="24" cy="20" r="15" fill="none" stroke="url(#tt-g)" stroke-width="3"/><circle cx="40" cy="20" r="15" fill="none" stroke="url(#tt-g)" stroke-width="3"/></svg>';
  const steps4 = '<span class="tt-steps"><b><i>1</i>Watch</b><b><i>2</i>Read</b><b><i>3</i>Derive</b><b><i>4</i>Practise</b></span>';
  return {
    home: [
      { title: 'Welcome to Twistor', art: rings, body: 'Physics from Key Stage 3 to A-Level. Here is how it works, in a few quick steps.', next: 'Show me' },
      { at: [NAV('physics')], title: 'Choose a topic', body: 'All the physics is here, in three stages: Key Stage 3, GCSE and A-Level. Start with the one you are in.' },
      { at: ['#tw-ask-open'], title: 'Stuck? Ask', body: 'Type a question in your own words. Twistor finds the answer in its own lessons.' },
      { at: [NAV('study')], title: 'A few minutes a day', body: 'Your mistakes and flashcards come back here when they are due. The number shows how many are waiting.' },
      { at: ['#search', '#msearch-btn'], title: 'Find anything', body: 'Type a topic or a formula. On a keyboard, press <kbd>/</kbd> to jump here.' },
      { title: 'Where shall we start?', art: rings, body: 'Not sure? A few quick questions find your stage in about three minutes.', end: [['Find my level', '#level'], ['Choose a stage', '#physics']] }
    ],
    topic: [
      { at: ['.glance ol.study'], title: 'Every topic, four steps', art: steps4, body: 'Go from left to right. Tap a step to jump straight to it.' },
      { at: ['#tt-practice'], title: 'Practise', body: 'Type your answer and it is checked at once. A wrong number gets a hint about what slipped.' },
      { at: ['.glance .ustate'], title: 'Got it? Mark it', body: 'The topic comes back for a quick review in a few days, so it sticks.', last: 'Got it' }
    ]
  };
};
