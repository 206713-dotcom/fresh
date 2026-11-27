// "What it has achieved so far": a short record of the main achievements of every machine that is
// still working. It is shown in the object viewer, below "What it is". Every line comes from a NASA
// page; the pages are listed under each machine and are added to its sources in the side panel.
// first: true marks a world first. next: true marks something that has not happened yet.

import { PROBES } from './probes.js';
import { EQUIPMENT } from './equipment.js';

const S = (label, url) => ({ label, url });

export const ACHIEVEMENTS = {
  voyager1: {
    since: 'launch', verb: 'Working for',
    items: [
      { y: '1977', t: 'Launched on 5 September 1977 to visit Jupiter and Saturn.' },
      { y: '1979', t: 'At Jupiter it found a faint ring and two new moons. The Voyagers also found erupting volcanoes on the moon Io: the first active volcanoes ever seen on another world.', first: true },
      { y: '1980', t: 'At Saturn it found five new moons and a new ring. Its close pass by the moon Titan then bent its path up and out of the plane of the planets.' },
      { y: '1990', t: 'On 14 February it turned around and took a "family portrait" of six planets. Earth, in that picture, is the Pale Blue Dot.' },
      { y: '1998', t: 'On 17 February it passed Pioneer 10 and became the most distant object ever made by humans. It still is.', first: true },
      { y: '2012', t: 'On 25 August it became the first spacecraft to enter interstellar space, the space between the stars.', first: true },
      { y: '2026', t: 'On 18 November 2026 it reaches one light-day from Earth: a radio message will take a whole day to get there.', next: true },
    ],
    sources: [S('NASA Science: Voyager 1', 'https://science.nasa.gov/mission/voyager/voyager-1/'), S('NASA Science: Voyager 1, most distant human-made object', 'https://science.nasa.gov/missions/voyager-program/voyager-1-now-most-distant-human-made-object-in-space/')],
  },
  voyager2: {
    since: 'launch', verb: 'Working for',
    items: [
      { y: '1977', t: 'Launched on 20 August 1977, two weeks before Voyager 1, on a "Grand Tour" made possible by a line-up of the outer planets that happens about once every 175 years.' },
      { y: '1979', t: 'Flew past Jupiter, then used its gravity like a slingshot to reach Saturn in 1981.' },
      { y: '1986', t: 'The first and only spacecraft to visit Uranus: it found 10 new moons and two new rings.', first: true },
      { y: '1989', t: 'The first and only spacecraft to visit Neptune: five new moons, four rings, a "Great Dark Spot", and geysers on the frozen moon Triton.', first: true },
      { y: '2018', t: 'On 5 November it reached interstellar space. It is still the only spacecraft to have visited all four giant planets.' },
    ],
    sources: [S('NASA Science: Voyager 2', 'https://science.nasa.gov/mission/voyager/voyager-2/'), S('NASA Science: Voyager mission overview', 'https://science.nasa.gov/mission/voyager/mission-overview/')],
  },
  newhorizons: {
    since: 'launch', verb: 'Working for',
    items: [
      { y: '2006', t: 'Made the fastest launch on record, on 19 January 2006.', first: true },
      { y: '2007', t: 'Flew past Jupiter and used its gravity to pick up speed toward Pluto.' },
      { y: '2015', t: 'On 14 July it became the first spacecraft to explore Pluto, flying about 12,500 km above it. It showed mountains of ice and wide, flat plains of ice.', first: true },
      { y: '2019', t: 'On 1 January it flew past Arrokoth, the most distant object ever explored up close.', first: true },
      { y: 'Now', t: 'Still flying outward through the Kuiper Belt and sending data home.' },
    ],
    sources: [S('NASA Science: New Horizons', 'https://science.nasa.gov/mission/new-horizons/'), S('NASA Science: 10 things, looking back at Pluto', 'https://science.nasa.gov/missions/new-horizons/10-things-looking-back-at-pluto/')],
  },
  hubble: {
    since: 'launch', verb: 'Working for',
    items: [
      { y: '1990', t: 'Carried into orbit by the space shuttle Discovery on 24 April and released the next day.' },
      { y: '1993', t: 'Astronauts fitted corrective optics, like a pair of glasses, and its blurry pictures came out sharp.' },
      { y: '1995', t: 'The Hubble Deep Field: it stared at one tiny, empty-looking patch of sky for ten days and found it full of galaxies, some seen as they were more than 10 billion years ago.' },
      { y: '2009', t: 'The fifth and last visit by astronauts. In all it has now worked more than twice as long as planned.' },
      { y: '2011', t: 'Its measurements of exploding stars helped show that the universe is not only growing but growing faster and faster, a discovery that won the 2011 Nobel Prize in Physics.' },
      { y: 'So far', t: 'More than 1.7 million observations, and more than 23,000 science papers written from its data.' },
    ],
    sources: [S('NASA Science: Hubble by the numbers', 'https://science.nasa.gov/mission/hubble/overview/hubble-by-the-numbers/'), S('NASA Science: Discovering a runaway universe', 'https://science.nasa.gov/mission/hubble/science/science-highlights/discovering-a-runaway-universe'), S('NASA Science: Farthest supernova ever seen (Hubble Deep Field)', 'https://science.nasa.gov/missions/hubble/blast-from-the-past-farthest-supernova-ever-seen-sheds-light-on-dark-universe')],
  },
  jwst: {
    since: 'launch', verb: 'Working for',
    items: [
      { y: '2021', t: 'Launched on 25 December, folded up inside an Ariane 5 rocket.' },
      { y: '2022', t: 'In space it unfolded a sunshield the size of a tennis court and a gold mirror 6.5 m across, then reached its place 1.5 million km from Earth on 24 January.' },
      { y: '2022', t: 'On 12 July its first science pictures included the deepest and sharpest infrared view of the distant universe taken up to then.' },
      { y: '2022', t: 'It found the first clear evidence of carbon dioxide in the air of a planet outside our solar system, the gas giant WASP-39 b.', first: true },
      { y: '2024', t: 'It confirmed a galaxy seen as it was only about 290 million years after the big bang: the most distant galaxy known at that time.' },
    ],
    sources: [S('NASA Science: Webb finds most distant known galaxy', 'https://science.nasa.gov/?p=485552'), S('NASA: Webb detects carbon dioxide in exoplanet atmosphere', 'https://www.jpl.nasa.gov/news/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/'), S('NASA Science: Webb mission timeline', 'https://science.nasa.gov/mission/webb/webb-mission-timeline/')],
  },
  curiosity: {
    since: 'arrival', verb: 'On Mars for',
    items: [
      { y: '2012', t: 'Lowered onto Mars by a rocket-powered sky crane on 6 August, in Gale crater.' },
      { y: '2013', t: 'Within its first eight months it found what it was sent to look for: evidence that ancient Mars had an environment well suited to microbial life.', first: true },
      { y: '2014', t: 'Reached the foot of Mount Sharp and started to climb it, reading the mountain\'s layers like pages of Mars\'s history.' },
      { y: '2018', t: 'Found organic molecules, the building blocks of life, in 3-billion-year-old rock from an old lake bed, and a rise and fall of methane in the air that repeats every Martian year.' },
      { y: '2024', t: 'Drove over a rock, cracked it open and found yellow crystals of pure sulfur: the first ever seen on Mars.', first: true },
      { y: 'So far', t: 'More than 38 km driven, from NASA\'s own map of its route.' },
    ],
    sources: [S('NASA/JPL: Ancient organic material and mysterious methane on Mars', 'https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars'), S('NASA: Curiosity discovers a surprise in a Martian rock', 'https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasas-curiosity-rover-discovers-a-surprise-in-a-martian-rock')],
  },
  perseverance: {
    since: 'arrival', verb: 'On Mars for',
    items: [
      { y: '2021', t: 'Landed on 18 February in Jezero crater, which once held a lake.' },
      { y: '2021', t: 'The Ingenuity helicopter it carried made the first powered, controlled flight on another planet, on 19 April. Built for up to five test flights, it made 72.', first: true },
      { y: '2021', t: 'Its MOXIE experiment made oxygen from the Martian air for the first time. By its last run in 2023 it had made 122 grams, about what a small dog breathes in 10 hours.', first: true },
      { y: '2023', t: 'Finished setting down ten sealed sample tubes at "Three Forks", for a future mission to pick up. NASA called the depot humanity\'s first collection of samples on another planet.' },
      { y: '2024', t: 'Drilled a sample called "Sapphire Canyon" from a spotted rock. In 2025 NASA said it may hold a potential biosignature: a possible sign of ancient life that still needs more study.' },
      { y: '2025', t: 'By September 2025 it had sealed 27 rock cores in their tubes.' },
      { y: '2026', t: 'On 11 October 2026 it passed the record of the silent Opportunity rover: 45.22 km, farther than any vehicle has driven on another world.', first: true },
    ],
    sources: [S('NASA Science: Ingenuity Mars Helicopter', 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/'), S('NASA/JPL: MOXIE completes Mars mission', 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/'), S('NASA: Mars rover discovered potential biosignature', 'https://www.nasa.gov/news-release/nasa-says-mars-rover-discovered-potential-biosignature-last-year/'), S('NASA Science: Perseverance sets off-world record for total distance driven', 'https://science.nasa.gov/blogs/perseverance-mars-rover/2026/10/12/nasas-perseverance-sets-off-world-record-for-total-distance-driven/')],
  },
};

// the side panel lists every source of a record: add these pages to it once
for (const q of [...PROBES, ...EQUIPMENT]) {
  const a = ACHIEVEMENTS[q.id]; if (!a || !q.sources) continue;
  for (const s of a.sources) if (!q.sources.some((x) => x.url === s.url)) q.sources.push(s);
}

/** "49 years, 71 days": how long a machine has been working, from the real date today. */
export function onTheJob(q, now = Date.now()) {
  const a = ACHIEVEMENTS[q.id]; if (!a) return '';
  const from = Date.parse(a.since === 'arrival' ? q.arrival : q.launch);
  const d = new Date(from), n = new Date(now);
  let years = n.getUTCFullYear() - d.getUTCFullYear();
  const anniv = Date.UTC(n.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  if (now < anniv) years -= 1;
  const last = Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate());
  const days = Math.floor((now - last) / 864e5);
  return `${a.verb} ${years} years, ${days} day${days === 1 ? '' : 's'}`;
}
