// Two small helpers for first-time visitors: a five-stop guided tour, and the "What is real?" panel.
const TOUR = [
  { eq: 'apollo11', t: '1969-07-21T18:30:00Z', head: 'Moon, 1969 · Apollo 11',
    text: 'Two people walked here for about two and a half hours. To save weight for the trip home they left the lower half of their lander behind, with their experiments. It is still standing.',
    try: 'Try: click a part of the lander, or press "Walk here".' },
  { eq: 'viking1', t: '1976-07-21T12:00:00Z', head: 'Mars, 1976 · Viking 1',
    text: 'The first US spacecraft to land safely on Mars. Its arm scooped up soil to look for tiny living things. It worked for more than six years, and it still sits on Chryse Planitia, the "Golden Plain".',
    try: 'Try: "View object in 3D" to see what each part was for.' },
  { probe: 'voyager1', t: '2012-08-26T00:00:00Z', head: 'Deep space, 2012 · Voyager 1',
    text: 'Launched in 1977, it flew past Jupiter and Saturn and kept going. In August 2012 it became the first thing made by people to reach the space between the stars. It will never come back, and it still sends data.',
    try: 'Try: drag to look around. You are riding with it.' },
  { eq: 'opportunity', t: '2018-06-11T00:00:00Z', head: 'Mars, 2018 · Opportunity',
    text: 'This rover was planned to work for 90 Martian days. It lasted more than 14 years and drove 45.16 km. Then a dust storm covered the whole planet and hid the Sun from its solar panels. Its last signal came on 10 June 2018.',
    try: 'Try: the numbered chapters in the panel on the right.' },
  { eq: 'perseverance', t: '2024-06-01T00:00:00Z', head: 'Mars, today · Perseverance',
    text: 'This one is still working. The line on the ground is its real route, from NASA\'s own map of its drives. It has no way home, so one day it too will be left here.',
    try: 'Try: "Drive its route". Then press play on the clock and watch 65 years of machines arrive.' },
];

const ABOUT = `
<h2>What is real here?</h2>
<p class="ab-lead">Accuracy matters in a story about real machines. This is what comes from data, what is simplified, and what is only a picture.</p>
<div class="ab-cols">
<section><h3><i class="ab-dot real"></i>Real data</h3><ul>
<li><b>Where everything is.</b> The Sun, the planets and the Moon are computed for every moment, at true size and distance.</li>
<li><b>Landing sites.</b> Every lander, rover and impact sits at its real latitude and longitude.</li>
<li><b>Rover routes.</b> Curiosity, Perseverance and Ingenuity follow NASA/JPL's published waypoints.</li>
<li><b>Dates and facts.</b> From NASA mission pages and NASA's NSSDCA catalogue. The sources are listed on every object.</li>
<li><b>Spacecraft models.</b> From NASA 3D Resources, wherever NASA has published one (Voyager is the one exception, see Simplified).</li>
<li><b>Stars.</b> About 150,000 real stars at their real places, read from NASA's Yale, Hipparcos and Tycho star maps.</li>
<li><b>News photos.</b> Official NASA, ESA, CSA and STScI pictures, credited under each one.</li></ul></section>
<section><h3><i class="ab-dot simple"></i>Simplified</h3><ul>
<li><b>Hand-built models.</b> NASA offers no 3D model of Surveyor, the lunar rover, the Apollo science stations and flags, Pathfinder and Sojourner, Phoenix or New Horizons. Those are built by hand to their real sizes.</li>
<li><b>Voyager.</b> Built by hand, part by part, from the sizes and materials NASA has published (dish 3.66 m, bus 1.78 m, boom 13 m, antennas 10 m) and from NASA photographs, so that each part can show what it is really made of. The placing of small fittings is our best reading of the photographs.</li>
<li><b>Featured animations.</b> Webb, the Saturn V, Launch Complex 39A with its tower, and the Perseverance sky crane, capsule and parachute are built by hand to NASA's published sizes and materials; the lunar module, the Apollo spacecraft after docking and the rover are NASA's own models. Small fittings (bolts, cables, pipes, handrails) are placed by eye from NASA photographs. Webb is lit from above so that it can be seen: in reality that side is always dark. The stars in its sky and in its gold mirror are a picture, brighter and denser than the real sky. The clouds over the Earth in the Apollo film are drawn by the computer, as are the flames and smoke. The parachute's pattern is ours, not the coded message on the real one.</li>
<li><b>Flight paths.</b> A probe is at the right planet on the right day; the path in between is a smooth guess. Webb's trip is drawn as a straight line.</li>
<li><b>Dawn, NEAR Shoemaker and Kepler</b> follow simple orbits. Ceres, Vesta and Eros themselves are not drawn.</li>
<li><b>The ground at each site.</b> The colour comes from the real map; the rocks are scattered at random.</li>
<li><b>Films and arrival scenes.</b> Times and numbers in the captions are real. The staging is ours, the rockets (except the shuttle) are simple models, and Webb's unfolding is simplified.</li>
<li><b>Star brightness.</b> Ranked from the maps, exact only for the 22 brightest.</li></ul></section>
<section><h3><i class="ab-dot art"></i>Illustration, not data</h3><ul>
<li><b>The Milky Way and the four galaxies.</b> Painted by a noise formula. Their place, size and tilt on the sky are real; the fine detail is not.</li>
<li><b>Venus's clouds, the sky of Mars, the surface of the Sun.</b> Drawn to match how they look, not taken from a measurement.</li>
<li><b>Music.</b> Made live by your browser. No recording is used.</li></ul></section>
</div>
<p class="ab-foot"><b>Made with</b> three.js and astronomy-engine (both MIT licence), NASA 3D Resources, NASA Scientific Visualization Studio star maps, and NASA mission pages. <b>Planet maps:</b> Solar System Scope (CC BY 4.0, resized) for Mercury, Venus, Jupiter, Saturn, Uranus, Neptune and the detailed Earth and Mars; the NASA SVS CGI Moon Kit (LRO) for the detailed Moon; NASA 3D Resources for the first Mars map and Pluto; the three.js examples (MIT licence) for the first Earth and Moon maps. <b>Fonts:</b> Archivo Narrow, Cinzel and Newsreader (SIL Open Font License). <b>AI help:</b> code and the procedural artwork were written with an AI assistant (Claude); the facts were checked against the NASA pages listed on each object. A full list of sources is on our project page. This is a student team project: it is not made, approved or endorsed by NASA.</p>`;

export function setupGuide({ $, clock, goSite, goProbe, eqById, probeById, busy, onFinale }) {
  // (the old "More" toggle is gone: every button sits in the ☰ menu)

  // ---- tour
  const el = $('tour'); let i = -1;
  const show = (k) => {
    i = k; const s = TOUR[k];
    el.innerHTML = `<p class="t-step">Tour · ${k + 1} of ${TOUR.length}</p><h3>${s.head}</h3><p>${s.text}</p><p class="t-try">${s.try}</p>
      <div class="t-row"><button data-a="back" ${k ? '' : 'disabled'}>‹ Back</button><button data-a="next" class="primary">${k < TOUR.length - 1 ? 'Next stop ›' : 'Finale: fire a laser at the Moon ›'}</button><button data-a="end" class="t-x" title="End the tour">✕</button></div>`;
    el.hidden = false;
    clock.paused = true; clock.jumpTo(Date.parse(s.t));
    if (s.eq) goSite(eqById(s.eq)); else goProbe(probeById(s.probe));
  };
  const end = () => { el.hidden = true; i = -1; };
  $('goTour').addEventListener('click', () => { if (busy()) return; $('goTour').classList.remove('pulse'); if (i >= 0) end(); else show(0); });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]'); if (!b || busy()) return;
    if (b.dataset.a === 'end') end(); else if (b.dataset.a === 'back') show(Math.max(0, i - 1)); else if (i < TOUR.length - 1) show(i + 1); else { end(); if (onFinale) onFinale(); }
  });

  // ---- what is real?
  const ab = $('about');
  ab.innerHTML = `<div class="ab-page" role="dialog" aria-label="What is real in this simulation"><button class="ab-x" aria-label="Close">✕</button>${ABOUT}</div>`;
  $('goAbout').addEventListener('click', () => { ab.hidden = false; });
  ab.addEventListener('click', (e) => { if (e.target === ab || e.target.closest('.ab-x')) ab.hidden = true; });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ab.hidden) { ab.hidden = true; e.stopImmediatePropagation(); } }, true);
  return { tourOpen: () => i >= 0, endTour: end };
}
