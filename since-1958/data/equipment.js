// NASA hardware left on the Moon and Mars.
//
// STATUS (14 Nov 2026): every story sentence of an object marked verified: true was checked
// against the NASA pages listed in that object's `sources` (NSSDCA, science.nasa.gov, nasa.gov
// history pages, JPL news). Moon coordinates: LROC team measurements (Wagner et al. 2017).
// Viking coordinates: NSSDCA (planetocentric). Objects still marked verified: false show a
// "Draft text" warning in the panel.
//
// lat/lon: degrees, planetocentric, east-positive. parts[].e / .n: metres east / north of the
// site point (offsets derived from the same coordinate list, so they are consistent).

const LROC = { label: 'LROC: coordinates of spacecraft on the Moon (2016)', url: 'https://www.lroc.asu.edu/images/938' };
const NASA_CAT = { label: 'NASA: catalogue of manmade material on the Moon', url: 'https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf' };
const MARS_LIST = { label: 'List of artificial objects on Mars (check against NSSDCA)', url: 'https://en.wikipedia.org/wiki/List_of_artificial_objects_on_Mars' };
const NSSDCA = { label: 'NSSDCA Master Catalog (search the mission)', url: 'https://nssdc.gsfc.nasa.gov/nmc/' };

export const CHAPTER_TITLES = ['Why it went', 'What it did', 'What we learned', 'Why it stayed', 'Where it is now', 'Its status'];   // the sixth is built from the state timeline, not written

export const STATES = {
  'active':  { label: 'Operating',      color: '#7ee0a1' },
  'in-use':  { label: 'Still in use',   color: '#6fd6ff' },
  'silent':  { label: 'Silent',         color: '#ffc861' },
  'ended':   { label: 'Mission ended',  color: '#a9b1bd' },
  'left':    { label: 'Left behind',    color: '#a9b1bd' },
  'impact':  { label: 'Impact site',    color: '#ff8a6a' },
};

export const EQUIPMENT = [
  // ------------------------------------------------------------------ MOON
  {
    id: 'ranger7', body: 'moon', name: 'Ranger 7', short: 'Impact site in Mare Cognitum', mission: 'Ranger 7',
    lat: -10.6340, lon: -20.6770, arrival: '1964-07-31T13:25:49Z',
    timeline: [{ t: '1964-07-31T13:25:49Z', state: 'impact', label: 'Crashed on purpose after sending its pictures' }],
    parts: [{ type: 'impact', crater: 13 }], view: { dist: 55, el: 35 },
    chapters: [
      "Before anyone could land on the Moon, NASA needed close-up pictures of its surface. Ranger 7 was built to fly straight at the Moon and take photos until the very last second. Six Rangers before it had failed.",
      "In its final 17 minutes it sent back 4,308 pictures, each one closer than the last.",
      "The final picture showed details only about half a metre across. For the first time, people could see what the Moon's surface looks like up close, just what the Apollo planners needed.",
      "It was never meant to survive: it hit the Moon at about 2.6 km per second and made its own small crater.",
      "The area was named Mare Cognitum, \"the Sea that has become known\". The Lunar Reconnaissance Orbiter (LRO) later found Ranger 7's crater.",
    ],
    sources: [{ label: "NASA NSSDCA: Ranger 7", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A" }, { label: "NASA History: 60 years ago, Ranger 7 photographs the Moon", url: "https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/" }, LROC], verified: true,
  },
  {
    id: 'surveyor1', body: 'moon', name: 'Surveyor 1', short: 'Lander in Oceanus Procellarum', mission: 'Surveyor 1',
    lat: -2.4745, lon: -43.3398, arrival: '1966-06-02T06:17:36Z',
    timeline: [
      { t: '1966-06-02T06:17:36Z', state: 'active', label: 'First US soft landing on the Moon' },
      { t: '1967-01-07T00:00:00Z', state: 'silent', label: 'Last contact' },
    ],
    parts: [{ type: 'surveyor' }], view: { dist: 14, el: 20 },
    chapters: [
      "Could a spacecraft land gently on the Moon, or would it sink into deep dust? Surveyor 1 was sent to find out before astronauts tried.",
      "It made the first US soft landing on another world and sent back 11,240 pictures of the ground around it.",
      "One of its first pictures showed a footpad sitting firmly on top of the soil. It had not sunk into deep dust.",
      "It was a one-way robot. Engineers kept in contact with it until 7 January 1967.",
      "It still stands where it landed; LRO has photographed it from orbit.",
    ],
    sources: [{ label: "NASA Science: Surveyor 1", url: "https://science.nasa.gov/mission/surveyor-1/" }, { label: "NASA NSSDCA: Surveyor 1", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A" }, LROC], verified: true,
  },
  {
    id: 'surveyor3', body: 'moon', name: 'Surveyor 3', short: 'Lander visited by Apollo 12', mission: 'Surveyor 3',
    lat: -3.0162, lon: -23.4180, arrival: '1967-04-20T00:04:53Z',
    timeline: [
      { t: '1967-04-20T00:04:53Z', state: 'active', label: 'Landed (after bouncing)' },
      { t: '1967-05-04T00:00:00Z', state: 'silent', label: 'Last contact' },
      { t: '1969-11-19T06:54:35Z', state: 'left', label: 'Apollo 12 lands next to it' },
    ],
    parts: [{ type: 'surveyor', scoop: true, visited: true }], view: { dist: 14, el: 20 },
    chapters: [
      "Surveyor 3 carried a small scoop on an arm so it could dig into the lunar soil.",
      "Its engines did not shut off on time, so it bounced twice before settling. Then it dug trenches up to 18 cm deep and took 6,326 pictures.",
      "The digging showed that the surface was solid enough to hold an Apollo lunar module.",
      "Its last data arrived on 4 May 1967, and it was left where it landed.",
      "In 1969 Apollo 12 landed about 160 m away. The astronauts walked over and cut off its TV camera and other parts, about 10 kg in all, to bring home for study.",
    ],
    sources: [{ label: "NASA Science: Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" }, { label: "NASA NSSDCA: Surveyor 3", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A" }, LROC], verified: true,
  },
  {
    id: 'apollo11', body: 'moon', name: 'Apollo 11', short: 'Tranquility Base, Sea of Tranquility', mission: 'Apollo 11',
    lat: 0.67416, lon: 23.47314, arrival: '1969-07-20T20:17:40Z',
    timeline: [
      { t: '1969-07-20T20:17:40Z', state: 'active', label: 'The Eagle has landed' },
      { t: '1969-07-21T17:54:00Z', state: 'in-use', label: 'Crew left; the retroreflector is still used today' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true },
      { type: 'flag', e: -7, n: 3, fallen: true },
      { type: 'lrrr', e: -1.2, n: -21.5 },
      { type: 'easep', e: 0.3, n: -28.5, label: 'Seismometer' },
    ],
    view: { dist: 38, el: 18 }, keepOut: 32,
    chapters: [
      "In 1961 the United States set a goal: land people on the Moon and bring them home safely before 1970.",
      "Neil Armstrong and Buzz Aldrin spent about two and a half hours walking outside, collected about 21.5 kg of rock and soil, and set up science experiments.",
      "They brought home the first samples ever collected on another world. Their mirror experiment lets scientists bounce lasers off the Moon and measure its distance very precisely: the Moon is drifting away from Earth by about 3.8 cm every year.",
      "To save weight for the trip home, the lower half of the lunar module stayed behind as a launch pad, along with the experiments and the equipment the crew no longer needed.",
      "The descent stage still stands at Tranquility Base. The laser reflector needs no power, so observatories on Earth still use it today.",
    ],
    sources: [{ label: "NASA NSSDCA: Apollo 11 Lunar Module / EASEP", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C" }, { label: "NASA: Apollo 11 mission overview", url: "https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/" }, { label: "NASA: The Apollo experiment that keeps on giving (laser ranging)", url: "https://www.nasa.gov/solar-system/the-apollo-experiment-that-keeps-on-giving/" }, LROC], verified: true,
  },
  {
    id: 'apollo12', body: 'moon', name: 'Apollo 12', short: 'Intrepid, Ocean of Storms', mission: 'Apollo 12',
    lat: -3.0128, lon: -23.4219, arrival: '1969-11-19T06:54:35Z',
    timeline: [
      { t: '1969-11-19T06:54:35Z', state: 'active', label: 'Landed next to Surveyor 3' },
      { t: '1969-11-20T14:25:47Z', state: 'active', label: 'Crew left; the science station keeps sending data' },
      { t: '1977-09-30T00:00:00Z', state: 'left', label: 'Science stations switched off' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true }, { type: 'flag', e: -6, n: -4 },
      { type: 'alsep', kit: 12, e: -91, n: 90 },
      { type: 'surveyor', scoop: true, visited: true, e: 118, n: -103, label: 'Surveyor 3, 160 m away' },
    ],
    view: { dist: 48, el: 20 }, keepOut: 20,
    chapters: [
      "Apollo 12 had to prove astronauts could land exactly where they planned: right next to the old Surveyor 3 robot.",
      "Pete Conrad and Alan Bean landed within walking distance of Surveyor 3 and set up the first ALSEP, a science station powered by a small nuclear generator.",
      "When the empty ascent stage was crashed back into the Moon, the seismometer recorded the Moon vibrating for nearly an hour. Signals like this let scientists study the inside of the Moon.",
      "The descent stage stayed as a launch pad, and the science station was left running on purpose.",
      "NASA switched off all the Apollo science stations on 30 September 1977. The hardware is still there, and LRO can see it.",
    ],
    sources: [{ label: "NASA History: Apollo 12 makes a pinpoint landing", url: "https://www.nasa.gov/history/55-years-ago-apollo-12-makes-a-pinpoint-landing-on-the-moon/" }, { label: "NASA NTRS: History and status of ALSEP", url: "https://ntrs.nasa.gov/search.jsp?R=20180008613" }, LROC], verified: true,
  },
  {
    id: 'apollo13sivb', body: 'moon', name: 'Apollo 13 S-IVB', short: 'Rocket stage impact site', mission: 'Apollo 13',
    lat: -2.5550, lon: -27.8875, arrival: '1970-04-15T01:09:41Z',
    timeline: [{ t: '1970-04-15T01:09:41Z', state: 'impact', label: 'Crashed on purpose as a seismic experiment' }],
    parts: [{ type: 'impact', crater: 35 }], view: { dist: 120, el: 40 },
    chapters: [
      "The third stage of the Saturn V rocket was no longer needed once it had sent Apollo 13 toward the Moon, so NASA steered it into the Moon on purpose.",
      "About 14 tonnes of rocket stage hit the Moon at more than 2.5 km per second. The Apollo 12 seismometer, about 135 km away, felt it.",
      "A crash of known size, time and place is a perfect test signal: it helped scientists study the Moon's crust.",
      "Turning space junk into an experiment: nobody was going to bring an empty rocket stage home.",
      "Apollo 13 itself never landed because an oxygen tank exploded on the way; the crew got home safely. LRO has photographed the crater the rocket stage made.",
    ],
    sources: [{ label: "NASA Goddard: Apollo 13 S-IVB impact site", url: "https://gms.gsfc.nasa.gov/13537" }, { label: "NASA NSSDCA: Apollo 13", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1970-029A" }, LROC], verified: true,
  },
  {
    id: 'apollo14', body: 'moon', name: 'Apollo 14', short: 'Antares, Fra Mauro highlands', mission: 'Apollo 14',
    lat: -3.64589, lon: -17.47194, arrival: '1971-02-05T09:18:11Z',
    timeline: [
      { t: '1971-02-05T09:18:11Z', state: 'active', label: 'Landed at Fra Mauro' },
      { t: '1971-02-06T18:48:42Z', state: 'active', label: 'Crew left; the science station keeps sending data' },
      { t: '1977-09-30T00:00:00Z', state: 'in-use', label: 'Station off; the retroreflector is still used' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true }, { type: 'flag', e: 6, n: -5 },
      { type: 'alsep', kit: 14, e: -174, n: 52 },
      { type: 'lrrr', e: -225, n: 33 },
    ],
    view: { dist: 40, el: 20 }, keepOut: 20,
    chapters: [
      "Fra Mauro was the target Apollo 13 never reached: hills thought to be made of rock thrown out by the giant impact that made the Imbrium Basin.",
      "Alan Shepard and Edgar Mitchell pulled a two-wheeled cart to carry tools and rocks, collected about 42 kg of samples, and Shepard famously hit two golf balls.",
      "Most of the rocks were breccias: broken pieces stuck back together. Scientists wanted them to work out when the Imbrium impact happened.",
      "The descent stage, the cart, the golf balls and the science station stayed behind.",
      "The science station was switched off in 1977, but the laser reflector left here is still used today.",
    ],
    sources: [{ label: "NASA NSSDCA: Apollo 14 Lunar Module / ALSEP", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C" }, { label: "NASA History: Apollo 14 summary (SP-4029)", url: "https://history.nasa.gov/SP-4029/Apollo_14a_Summary.htm" }, { label: "NASA ILRS: Lunar laser ranging", url: "https://ilrs.gsfc.nasa.gov/science/scienceContributions/lunar.html" }, LROC], verified: true,
  },
  {
    id: 'apollo15', body: 'moon', name: 'Apollo 15', short: 'Falcon and the first Lunar Rover, Hadley–Apennine', mission: 'Apollo 15',
    lat: 26.13239, lon: 3.63330, arrival: '1971-07-30T22:16:29Z',
    timeline: [
      { t: '1971-07-30T22:16:29Z', state: 'active', label: 'Landed beside the Apennine mountains' },
      { t: '1971-08-02T17:11:22Z', state: 'active', label: 'Crew left; the science station keeps sending data' },
      { t: '1977-09-30T00:00:00Z', state: 'in-use', label: 'Station off; the retroreflector is still used' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true }, { type: 'flag', e: -8, n: 4 },
      { type: 'lrv', e: 128.8, n: -19.7, heading: 180 },
      { type: 'alsep', kit: 15, e: -92, n: 50.6 },
      { type: 'lrrr', e: -149.5, n: 33.7, big: true },
    ],
    view: { dist: 48, el: 20 }, keepOut: 20,
    chapters: [
      "The first of the long \"J missions\": almost three days on the surface, a car, and a target between mountains and a deep valley called Hadley Rille.",
      "Dave Scott and Jim Irwin drove the first Lunar Roving Vehicle about 28 km. Scott dropped a hammer and a falcon feather at the same time: with no air, they hit the ground together.",
      "They found the \"Genesis Rock\", a piece of the Moon's ancient crust more than 4 billion years old.",
      "The rover could not fly home. It was parked about 165 m from the lunar module, where its TV camera could watch the liftoff.",
      "The rover, the descent stage and a laser reflector are still there; the reflector is still used.",
    ],
    sources: [{ label: "NASA NSSDCA: Apollo 15 Lunar Module / ALSEP", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C" }, { label: "NASA History: Apollo 15 on the Moon at Hadley-Apennine", url: "https://www.nasa.gov/history/50-years-ago-apollo-15-on-the-moon-at-hadley-apennine/" }, { label: "NASA Science: The Apollo 15 hammer-feather drop", url: "https://science.nasa.gov/resource/the-apollo-15-hammer-feather-drop/" }, LROC], verified: true,
  },
  {
    id: 'apollo16', body: 'moon', name: 'Apollo 16', short: 'Orion, Descartes Highlands', mission: 'Apollo 16',
    lat: -8.9734, lon: 15.5011, arrival: '1972-04-21T02:23:35Z',
    timeline: [
      { t: '1972-04-21T02:23:35Z', state: 'active', label: 'Landed in the highlands (about 6 h late)' },
      { t: '1972-04-24T01:25:47Z', state: 'active', label: 'Crew left; the science station keeps sending data' },
      { t: '1977-09-30T00:00:00Z', state: 'left', label: 'Science stations switched off' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true }, { type: 'flag', e: 7, n: 6 },
      { type: 'lrv', e: 77.9, n: 15, heading: 180 },
      { type: 'alsep', kit: 16, e: -74.9, n: -75.8 },
    ],
    view: { dist: 48, el: 20 }, keepOut: 20,
    chapters: [
      "The only Apollo landing in the Moon's central highlands. Many scientists expected to find volcanic rocks there.",
      "John Young and Charlie Duke explored with the second lunar rover and made three moonwalks lasting more than 20 hours in total.",
      "Surprise: almost all the rocks were breccias made by impacts, not volcanoes. The highlands were shaped by bombardment.",
      "The rover, the descent stage and the science station stayed behind.",
      "All still there. The landing was about six hours late because of a problem with the main engine of the spacecraft waiting in orbit, so the Sun stood higher in the sky than planned: you can check the Sun angle in this simulation.",
    ],
    sources: [{ label: "NASA History: Apollo 16 on the Moon at Descartes", url: "https://www.nasa.gov/history/50-years-ago-apollo-16-on-the-moon-at-descartes/" }, { label: "NASA NSSDCA: Apollo 16", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031A" }, { label: "NASA Apollo Lunar Surface Journal: Apollo 16 summary", url: "https://history.nasa.gov/alsj/a16/a16.summary.html" }, LROC], verified: true,
  },
  {
    id: 'apollo17', body: 'moon', name: 'Apollo 17', short: 'Challenger, Taurus–Littrow valley', mission: 'Apollo 17',
    lat: 20.1911, lon: 30.7723, arrival: '1972-12-11T19:54:57Z',
    timeline: [
      { t: '1972-12-11T19:54:57Z', state: 'active', label: 'Landed in a valley of Taurus–Littrow' },
      { t: '1972-12-14T22:54:37Z', state: 'active', label: 'Last humans leave the Moon' },
      { t: '1977-09-30T00:00:00Z', state: 'left', label: 'Science stations switched off' },
    ],
    parts: [
      { type: 'lm' }, { type: 'lmfull', exhibitOnly: true }, { type: 'flag', e: -9, n: 3 },
      { type: 'lrv', e: 130.9, n: -45.5, heading: 180 },
      { type: 'alsep', kit: 17, e: -193.5, n: 36 },
    ],
    view: { dist: 48, el: 20 }, keepOut: 20,
    chapters: [
      "The last Apollo mission went to a deep valley and carried the first scientist to the Moon, geologist Harrison Schmitt.",
      "Gene Cernan and Schmitt stayed about three days, made three moonwalks and drove the rover about 36 km.",
      "Schmitt spotted orange soil at Shorty crater. It turned out to be tiny beads of volcanic glass, sprayed out by eruptions about 3.6 billion years ago.",
      "The rover, the descent stage and a plaque stayed behind when the crew left on 14 December 1972. The rover was parked about 158 m away so its TV camera could film the liftoff.",
      "No human has stood on the Moon since. Everything left here is still in place.",
    ],
    sources: [{ label: "NASA History: Apollo 17 lands at Taurus-Littrow", url: "https://www.nasa.gov/history/50-years-ago-apollo-17-lands-at-taurus-littrow/" }, { label: "NASA History: Apollo 17 summary (SP-4029)", url: "https://history.nasa.gov/SP-4029/Apollo_17a_Summary.htm" }, { label: "NASA JSC Curation: orange soil sample 74220", url: "https://curator.jsc.nasa.gov/lunar/lsc/74220.pdf" }, LROC], verified: true,
  },
  {
    id: 'lcross', body: 'moon', name: 'LCROSS', short: 'Impact into Cabeus crater near the south pole', mission: 'LCROSS',
    lat: -84.6796, lon: -48.7093, arrival: '2009-10-09T11:31:19Z',
    timeline: [{ t: '2009-10-09T11:31:19Z', state: 'impact', label: 'Rocket stage hit Cabeus, probe followed minutes later' }],
    parts: [{ type: 'impact', crater: 25 }], view: { dist: 90, el: 40 }, dark: true,
    chapters: [
      "Is there water ice hiding in craters near the Moon's poles that sunlight never reaches? LCROSS was sent to splash some up and look.",
      "It aimed its empty Centaur rocket stage (about two tonnes) at Cabeus crater. Four minutes later the shepherding probe flew through the debris cloud, measured it, and crashed too.",
      "The cloud contained water: about 5.6 percent of the soil by mass, give or take about 3, plus other frozen chemicals such as methane and ammonia.",
      "The crash was the experiment. Both spacecraft were designed to end here.",
      "Two impact sites in permanent shadow. This simulation lights the scene artificially so you can see it; in reality the Sun never shines here.",
    ],
    sources: [{ label: "NASA Science: LCROSS", url: "https://science.nasa.gov/mission/lcross/" }, { label: "NASA SVS: Modeling the LCROSS impact site", url: "https://svs.gsfc.nasa.gov/3654/" }, { label: "NASA NTRS: LCROSS water result (5.6 \u00b1 2.9 %)", url: "https://ntrs.nasa.gov/api/citations/20160000929/downloads/20160000929.pdf" }, LROC], verified: true,
  },
  {
    id: 'grail', body: 'moon', name: 'GRAIL Ebb & Flow', short: 'Sally Ride Impact Site', mission: 'GRAIL',
    lat: 75.6088, lon: -26.5940, arrival: '2012-12-17T22:28:51Z',
    timeline: [{ t: '2012-12-17T22:28:51Z', state: 'impact', label: 'Twin probes crashed into a mountain on purpose' }],
    parts: [{ type: 'impact', crater: 5 }], view: { dist: 30, el: 35 },
    chapters: [
      "GRAIL measured the Moon's gravity in detail to see what lies under the surface.",
      "Twin spacecraft, Ebb and Flow, each about the size of a washing machine, flew one behind the other and measured tiny changes in the distance between them. Middle-school students used their MoonKAM cameras to take more than 115,000 pictures of the Moon.",
      "They made the most detailed gravity map of any world. It revealed things hidden under the surface, such as ancient rift valleys that were once flooded with lava.",
      "Flying too low and almost out of fuel, they were steered into the side of a mountain near the north pole, less than half a minute apart.",
      "NASA named the place after Sally Ride, the first American woman in space, who led the MoonKAM program. LRO later photographed the two small craters.",
    ],
    sources: [{ label: "NASA JPL: GRAIL lunar impact site named for astronaut Sally Ride", url: "https://www.jpl.nasa.gov/news/nasas-grail-lunar-impact-site-named-for-astronaut-sally-ride/" }, { label: "NASA Science: GRAIL (Ebb and Flow)", url: "https://science.nasa.gov/mission/grail/" }, { label: "NASA Science: GRAIL impact sites (LROC images)", url: "https://science.nasa.gov/resource/grail-impact-sites/" }], verified: true,
  },
  {
    id: 'ladee', body: 'moon', name: 'LADEE', short: 'Impact site on the far side', mission: 'LADEE',
    lat: 11.8494, lon: -93.2494, arrival: '2014-04-18T04:30:00Z',
    timeline: [{ t: '2014-04-18T04:30:00Z', state: 'impact', label: 'Contact lost behind the Moon; planned impact within the hour' }],
    parts: [{ type: 'impact', crater: 3 }, { type: 'ladee', exhibitOnly: true, hall: true }], view: { dist: 22, el: 35 },
    chapters: [
      "The Moon has an extremely thin \"atmosphere\" and dust lifted above the ground. LADEE flew very low to sample them.",
      "It also tested laser communication from the Moon, sending data to Earth at a record 622 megabits per second.",
      "It found a thin cloud of dust around the Moon, kicked up by tiny meteoroids hitting the surface.",
      "Its low orbit could not last, so the team chose where it would end: the rim of Sundman V crater on the far side, away from the Apollo landing sites.",
      "Rotate to the far side to find it. LRO found the small new crater by comparing before and after pictures, and NASA announced it in October 2014.",
    ],
    sources: [{ label: "NASA Science: LADEE in depth", url: "https://science.nasa.gov/mission/ladee/in-depth/" }, { label: "NASA: LRO captures images of LADEE's impact crater", url: "https://www.nasa.gov/solar-system/nasas-lro-spacecraft-captures-images-of-ladees-impact-crater/" }, { label: "NASA Science: What we learned from LADEE", url: "https://science.nasa.gov/mission/ladee/outcome/" }, { label: "NASA: Lunar Laser Communications Demonstration", url: "https://www.nasa.gov/mission/lunar-laser-communications-demonstration-llcd/" }], verified: true,
  },

  // ------------------------------------------------------------------ MARS
  {
    id: 'viking1', body: 'mars', name: 'Viking 1 Lander', short: 'Thomas Mutch Memorial Station, Chryse Planitia', mission: 'Viking 1',
    lat: 22.27, lon: -47.95, arrival: '1976-07-20T11:53:06Z',
    timeline: [
      { t: '1976-07-20T11:53:06Z', state: 'active', label: 'First NASA landing on Mars' },
      { t: '1982-11-11T00:00:00Z', state: 'silent', label: 'Last transmission; contact lost after a faulty command' },
    ],
    parts: [{ type: 'viking' }], view: { dist: 11, el: 18 },
    chapters: [
      "NASA's first Mars landers went to look for signs of life in the soil.",
      "Viking 1 was the first US spacecraft to land safely on Mars and send back pictures from the surface. Its robotic arm scooped up soil for three experiments that looked for tiny living things.",
      "The results were puzzling: the soil showed unexpected chemical activity, but there was no clear evidence of living microbes.",
      "It worked for more than six years, until a faulty command sent from Earth in November 1982 cut it off.",
      "Renamed the Thomas Mutch Memorial Station, it still sits on Chryse Planitia, the \"Golden Plain\".",
    ],
    sources: [{ label: "NASA Science: Viking 1", url: "https://science.nasa.gov/mission/viking-1/" }, { label: "NASA NSSDCA: Viking 1 Lander", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C" }, { label: "NASA Science: Viking Project", url: "https://science.nasa.gov/mission/viking/" }], verified: true,
  },
  {
    id: 'viking2', body: 'mars', name: 'Viking 2 Lander', short: 'Gerald Soffen Memorial Station, Utopia Planitia', mission: 'Viking 2',
    lat: 47.6673, lon: 134.2809, arrival: '1976-09-03T22:58:20Z',
    timeline: [
      { t: '1976-09-03T22:58:20Z', state: 'active', label: 'Landed in Utopia Planitia' },
      { t: '1980-04-11T00:00:00Z', state: 'silent', label: 'Batteries failed' },
    ],
    parts: [{ type: 'viking' }], view: { dist: 11, el: 18 },
    chapters: [
      "A second, identical lander was sent much farther north to repeat the search for life somewhere different.",
      "It came to rest with one leg on a rock, tilted by about 8 degrees. It photographed a rocky plain and, each winter, a thin layer of water frost on the ground.",
      "Its life experiments gave results similar to Viking 1's, and it kept watching the weather through two Martian winters.",
      "Its batteries failed, and its last data reached Earth on 11 April 1980.",
      "Now called the Gerald Soffen Memorial Station, it still sits on the plains of Utopia Planitia.",
    ],
    sources: [{ label: "NASA NSSDCA: Viking 2 Lander", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C" }, { label: "NASA Science: Viking 2", url: "https://science.nasa.gov/mission/viking/viking-2/" }, { label: "NASA JPL: Viking Lander 2 mission concluded", url: "https://www.jpl.nasa.gov/news/viking-lander-2-mission-concluded/" }], verified: true,
  },
  {
    id: 'pathfinder', body: 'mars', name: 'Mars Pathfinder & Sojourner', short: 'Carl Sagan Memorial Station, Ares Vallis', mission: 'Mars Pathfinder',
    lat: 19.33, lon: -33.55, arrival: '1997-07-04T16:56:55Z',
    timeline: [
      { t: '1997-07-04T16:56:55Z', state: 'active', label: 'Bounced down on airbags' },
      { t: '1997-09-27T10:23:00Z', state: 'silent', label: 'Last contact' },
    ],
    parts: [{ type: 'pathfinder' }], view: { dist: 10, el: 22 },
    chapters: [
      "Pathfinder tested a cheaper way to land on Mars, wrapped in airbags, and carried the first rover ever to drive on Mars.",
      "It hit the ground and bounced at least 15 times before rolling to a stop. Then Sojourner, a little rover weighing just 10.5 kg, drove off to study nearby rocks.",
      "The landing site is a dry channel carved by huge floods long ago; the boulders around the lander were probably dropped by them. The findings suggest Mars was once warm and wet.",
      "The last data arrived on 27 September 1997. Nobody knows for sure why, but the lander's battery had most likely worn out.",
      "Sojourner was still working when the lander went quiet. It was programmed to head back to the lander or circle it, but nobody knows exactly where it stopped. The lander is now named the Carl Sagan Memorial Station.",
    ],
    sources: [{ label: "NASA Science: Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" }, { label: "NASA JPL: Mars Pathfinder winds down after phenomenal mission", url: "https://www.jpl.nasa.gov/news/mars-pathfinder-winds-down-after-phenomenal-mission/" }, { label: "NASA NSSDCA: Mars Pathfinder project information", url: "https://nssdc.gsfc.nasa.gov/planetary/mesur.html" }, { label: "NASA PDS: Mars Pathfinder mission description", url: "https://planetarydata.jpl.nasa.gov/img/data/mpf/rover/mprv_0001/document/mission.htm" }], verified: true,
  },
  {
    id: 'spirit', body: 'mars', name: 'Spirit Rover', short: 'Landing site in Gusev crater', mission: 'Spirit (MER-A)',
    lat: -14.5718, lon: 175.4785, arrival: '2004-01-04T04:35:00Z',
    timeline: [
      { t: '2004-01-04T04:35:00Z', state: 'active', label: 'Landed in Gusev crater' },
      { t: '2010-03-22T00:00:00Z', state: 'silent', label: 'Last contact' },
      { t: '2011-05-25T00:00:00Z', state: 'ended', label: 'Mission declared complete' },
    ],
    parts: [{ type: 'mer' }], view: { dist: 8, el: 20 },
    away: 'You are at the landing site. Spirit drove 7.73 km from here and rests in a sand trap nicknamed "Troy", beside Home Plate.',
    chapters: [
      "From orbit, Gusev crater looked like a dried-up lake bed: a good place to look for signs of ancient water.",
      "Planned to last 90 Martian days, it worked for more than six years, drove 7.73 km and became the first robot to climb to the top of a hill on another planet.",
      "Dragging a broken wheel, it scraped up almost pure silica, evidence of ancient hot springs or steam vents.",
      "In April 2009 its wheels broke through a crust into soft sand, and it could not tilt its solar panels toward the Sun for winter. It last called home on 22 March 2010.",
      "This marker shows where it landed. Its final resting place, a sand trap nicknamed \"Troy\", is elsewhere in the crater beside a low plateau called Home Plate.",
    ],
    sources: [{ label: "NASA JPL: Spirit rover completes mission on Mars", url: "https://www.jpl.nasa.gov/news/nasas-spirit-rover-completes-mission-on-mars/" }, { label: "NASA NSSDCA: Mars Exploration Rover Spirit", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A" }, { label: "NASA JPL: Trapped Mars rover finds evidence of subsurface water", url: "https://jpl.nasa.gov/news/news.php?release=2010-355" }], verified: true,
  },
  {
    id: 'opportunity', body: 'mars', name: 'Opportunity Rover', short: 'Landing site on Meridiani Planum', mission: 'Opportunity (MER-B)',
    lat: -1.9462, lon: 354.4734, arrival: '2004-01-25T05:05:00Z',
    timeline: [
      { t: '2004-01-25T05:05:00Z', state: 'active', label: 'Landed in Eagle crater' },
      { t: '2018-06-10T00:00:00Z', state: 'silent', label: 'Planet-wide dust storm' },
      { t: '2019-02-13T00:00:00Z', state: 'ended', label: 'Mission declared complete' },
    ],
    parts: [{ type: 'mer' }], view: { dist: 8, el: 20 },
    away: 'You are at the landing site. Opportunity drove 45.16 km from here and rests in Perseverance Valley, on the rim of Endeavour crater.',
    chapters: [
      "Scientists chose this flat plain because it looked like a place where liquid water had once existed.",
      "It landed inside a small crater, later named Eagle crater. Planned for 90 Martian days, it worked for more than 14 years and drove 45.16 km, farther than a marathon. That stayed the record for driving on another world until Perseverance passed it on 11 October 2026.",
      "Its \"blueberries\", tiny round mineral balls, were among the clues that this place was once wet, a place where microbes might have been able to live.",
      "A dust storm covering the whole planet blocked the sunlight its solar panels needed. Its last signal came on 10 June 2018.",
      "It rests in Perseverance Valley on the rim of Endeavour crater, far from this landing site. The last thing it sent was a dark, noisy picture of a Sun hidden by dust.",
    ],
    sources: [{ label: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" }, { label: "NASA: Opportunity's final traverse map", url: "https://www.nasa.gov/image-article/opportunitys-final-traverse-map/" }, { label: "NASA Science: Opportunity's last message", url: "https://science.nasa.gov/resource/opportunitys-last-message/" }, { label: "NASA Astrobiology: Opportunity rover mission comes to an end", url: "https://astrobiology.nasa.gov/news/opportunity-rover-mission-comes-to-an-end/" }, { label: "NASA Science: Perseverance passes Opportunity's driving record", url: "https://science.nasa.gov/blogs/perseverance-mars-rover/2026/10/12/nasas-perseverance-sets-off-world-record-for-total-distance-driven/" }], verified: true,
  },
  {
    id: 'phoenix', body: 'mars', name: 'Phoenix Lander', short: 'Green Valley on the arctic plains', mission: 'Phoenix',
    lat: 68.22, lon: -125.7, arrival: '2008-05-25T23:53:00Z',
    timeline: [
      { t: '2008-05-25T23:53:00Z', state: 'active', label: 'Landed in the Martian arctic' },
      { t: '2008-11-02T00:00:00Z', state: 'silent', label: 'Last signal as winter began' },
      { t: '2008-11-10T00:00:00Z', state: 'ended', label: 'NASA announces the lander has stopped working' },
    ],
    parts: [{ type: 'phoenix' }], view: { dist: 12, el: 22 },
    chapters: [
      "Orbiters had found signs of water ice just under the surface of the Martian arctic. Phoenix went to dig it up and test it.",
      "It landed farther north than any spacecraft before it. Its robotic arm dug trenches and fed samples to onboard ovens and a wet chemistry lab, and its laser saw snow falling from clouds.",
      "It confirmed water ice just below the surface. Its biggest surprise was perchlorate, a salt that some microbes on Earth can eat.",
      "As arctic winter arrived, there was too little sunlight for its solar panels. Its last signal came on 2 November 2008.",
      "Pictures from orbit in 2010 showed damage: the weight of winter dry ice had most likely broken at least one of its solar panels.",
    ],
    sources: [{ label: "NASA JPL: Mars Phoenix Lander finishes successful work on Red Planet", url: "https://www.jpl.nasa.gov/news/mars-phoenix-lander-finishes-successful-work-on-red-planet/" }, { label: "NASA JPL: Phoenix Mars Lander is silent, new image shows damage", url: "https://www.jpl.nasa.gov/news/phoenix-mars-lander-is-silent-new-image-shows-damage/" }, { label: "NASA History: Phoenix Mars Lander", url: "https://www.nasa.gov/history/15-years-ago-phoenix-mars-lander-launches-to-the-red-planet/" }], verified: true,
  },
  {
    id: 'insight', body: 'mars', name: 'InSight Lander', short: 'Elysium Planitia', mission: 'InSight',
    lat: 4.5024, lon: 135.6234, arrival: '2018-11-26T19:52:59Z',
    timeline: [
      { t: '2018-11-26T19:52:59Z', state: 'active', label: 'Landed on Elysium Planitia' },
      { t: '2022-12-15T00:00:00Z', state: 'silent', label: 'Last contact' },
      { t: '2022-12-21T00:00:00Z', state: 'ended', label: 'Mission declared ended' },
    ],
    parts: [{ type: 'insight' }], view: { dist: 13, el: 22 },
    chapters: [
      "InSight went to listen to the inside of Mars, placing the first seismometer directly on the Martian ground.",
      "It recorded 1,319 marsquakes. Its heat probe, \"the mole\", was meant to dig several metres down but only got about 40 cm into the soil.",
      "It showed that Mars has a liquid core, and its seismometer even felt meteoroids hitting the planet.",
      "Dust slowly covered its solar panels until there was not enough power to keep going. It last called home on 15 December 2022.",
      "NASA declared the mission over on 21 December 2022. The lander still sits on Elysium Planitia.",
    ],
    sources: [{ label: "NASA: NASA retires InSight Mars lander mission after years of science", url: "https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/" }, { label: "NASA NSSDCA: InSight Lander", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A" }, { label: "NASA JPL Education: How InSight revealed the heart of Mars", url: "https://www.jpl.nasa.gov/edu/resources/teachable-moment/how-insight-revealed-the-heart-of-mars/" }], verified: true,
  },
  {
    id: 'm2020skycrane', body: 'mars', name: 'Perseverance Sky Crane', short: 'Descent stage crash site, Jezero crater', mission: 'Mars 2020',
    lat: 18.4457, lon: 77.4508, arrival: '2021-02-18T20:55:00Z',
    timeline: [{ t: '2021-02-18T20:55:00Z', state: 'left', label: 'Flew away and crashed, as designed' }],
    parts: [{ type: 'skycrane' }], view: { dist: 40, el: 30 },
    chapters: [
      "The Perseverance rover was set down on Mars by a rocket-powered descent stage, in a manoeuvre called the sky crane.",
      "About 20 metres above the ground it lowered the rover on cables about 6.4 m long. As soon as the wheels touched down, the rover cut the cables and the descent stage flew off to crash a safe distance away.",
      "On 19 April 2022 the Ingenuity helicopter photographed the rover's parachute and backshell from the air. Engineers study such pictures to help make future landings safer.",
      "It was built to be used once and left behind.",
      "From orbit its crash site shows as a dark V-shaped pattern of debris (the exact position here is approximate). One of the rover's cameras even caught the smoke rising from it.",
    ],
    sources: [{ label: "NASA Science: Perseverance touching down on Mars", url: "https://science.nasa.gov/resource/perseverance-touching-down-on-mars-illustration/?site=insight" }, { label: "NASA Science: Images of EDL debris", url: "https://science.nasa.gov/blog/images-of-edl-debris/" }, { label: "NASA JPL: Mars helicopter spots gear that helped Perseverance land", url: "https://www.jpl.nasa.gov/news/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/" }, { label: "NASA Science (APOD): Perseverance landing site from orbit", url: "https://science.nasa.gov/image-article/apod-2021-february-27-perseverance-landing-site-from-mars-reconnaissance-orbiter/" }], verified: true,
  },
  {
    id: 'curiosity', body: 'mars', name: 'Curiosity Rover', short: 'Still driving on Mount Sharp, Gale crater', mission: 'Mars Science Laboratory',
    lat: -4.589467, lon: 137.441633, arrival: '2012-08-06T05:18:00Z', route: 'curiosity',
    timeline: [
      { t: '2012-08-06T05:18:00Z', state: 'active', label: 'Lowered onto Mars by a sky crane' },
    ],
    parts: [{ type: 'msl' }], view: { dist: 9, el: 18 }, keepOut: 4,
    chapters: [
      "Did Mars ever have the right conditions to support microbes, tiny living things? Curiosity was sent to Gale crater to find out.",
      "It landed on 6 August 2012 at a spot named Bradbury Landing, near the foot of Mount Sharp. Then it drove to the mountain, reached its base in September 2014 and started to climb.",
      "Within its first eight months it found evidence of a past environment well suited to microbial life. On Mount Sharp it found rock that formed as mud at the bottom of ancient lakes, and organic molecules, the building blocks of life.",
      "Curiosity is still working, but it has already left a trail on Mars: its heat shield, about 1.5 km from where it landed; its parachute and back shell, about 615 m away; and the sky crane that lowered it, which flew off and crashed about 650 m away. It has no way home, so one day the rover too will stay on Mars for good.",
      "The line on the ground is its real route, from NASA's own map of the rover's drives: more than 38 km so far.",
    ],
    sources: [{ label: "NASA Science: Fact sheet, Mars Science Laboratory (Curiosity)", url: "https://science.nasa.gov/resource/fact-sheet-mars-science-laboratory-curiosity/" }, { label: "NASA Science: Curiosity science highlights", url: "https://science.nasa.gov/mission/msl-curiosity/science-highlights/" }, { label: "NASA/JPL: Curiosity waypoints (route data)", url: "https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json" }, { label: "NASA: Orbiter images NASA's latest additions to the Martian landscape", url: "https://www.nasa.gov/?p=415033" }, { label: "NASA Science: Changes in scars from the 2012 Mars landing", url: "https://science.nasa.gov/?p=978967" }], verified: true,
  },
  {
    id: 'perseverance', body: 'mars', name: 'Perseverance Rover', short: 'Still driving, Jezero crater', mission: 'Mars 2020',
    lat: 18.44462715, lon: 77.45088572, arrival: '2021-02-18T20:55:00Z', route: 'perseverance',
    timeline: [
      { t: '2021-02-18T20:55:00Z', state: 'active', label: 'Landed in Jezero crater' },
    ],
    parts: [{ type: 'm2020' }], view: { dist: 9, el: 18 }, keepOut: 4,
    chapters: [
      "Did life ever exist on Mars? Perseverance was sent to look for signs of ancient life, and to collect samples of rock that could one day be brought back to Earth.",
      "It landed on 18 February 2021 in Jezero crater, a crater that once held a lake, with an ancient river delta. It also carried the Ingenuity helicopter.",
      "It studies the rocks of the crater and seals samples of rock and broken rock in tubes. On 11 October 2026 it passed Opportunity's record of 45.16 km: no vehicle has driven farther on another world.",
      "Perseverance is still working, but it has already left a trail on Mars: its heat shield, its parachute and back shell, the sky crane that lowered it, the Ingenuity helicopter, and ten sealed tubes set down on purpose at 'Three Forks' (eight of rock and dust, one of Martian air and one 'witness' tube), waiting for a future mission to collect them. It has no way home, so one day the rover too will stay on Mars for good.",
      "The line on the ground is its real route, from NASA's own map of the rover's drives: more than 45 km so far.",
    ],
    sources: [{ label: "NASA Science: Perseverance location map", url: "https://science.nasa.gov/mission/mars-2020-perseverance/location-map/" }, { label: "NASA Science: Perseverance science objectives", url: "https://science.nasa.gov/mission/mars-2020-perseverance/science-objectives/" }, { label: "NASA/JPL: Perseverance waypoints (route data)", url: "https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json" }, { label: "NASA: Perseverance shows off its collection of Mars samples", url: "https://www.nasa.gov/?p=320652" }, { label: "NASA JPL: Mars helicopter spots gear that helped Perseverance land", url: "https://www.jpl.nasa.gov/news/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/" }], verified: true,
  },
  {
    id: 'ingenuity', body: 'mars', name: 'Ingenuity Helicopter', short: 'First aircraft on another planet, Jezero crater', mission: 'Mars 2020',
    lat: 18.49727, lon: 77.32254, arrival: '2021-04-03T00:00:00Z', route: 'ingenuity',
    timeline: [
      { t: '2021-04-03T00:00:00Z', state: 'active', label: 'Dropped onto the surface' },
      { t: '2021-04-19T07:34:00Z', state: 'active', label: 'First powered, controlled flight on another planet' },
      { t: '2024-01-18T00:00:00Z', state: 'active', label: 'Final flight: rotor blades damaged' },
      { t: '2024-01-25T00:00:00Z', state: 'ended', label: 'Flight mission ended' },
    ],
    parts: [{ type: 'ingenuity' }], view: { dist: 4, el: 16 }, keepOut: 3,
    chapters: [
      "Could anything fly in the very thin air of Mars? Ingenuity was a test to find out.",
      "It made the first powered, controlled flight on another planet on 19 April 2021. Planned for up to five flights, it flew 72 times over almost three years and covered about 17 km.",
      "Powered, controlled flight works on Mars, just as the Wright brothers proved it works on Earth. Future missions can use aircraft too.",
      "On its last flight, on 18 January 2024, it was flying over smooth sand ripples with nothing for its camera to track. It landed hard and broke its rotor blades.",
      "It sits in Jezero crater at a spot its team nicknamed \"Valinor Hills\". The line on the ground joins all its landing places, from NASA's flight data. Even grounded, it kept sending weather data to the Perseverance rover.",
    ],
    sources: [{ label: "NASA: After three years on Mars, Ingenuity helicopter mission ends", url: "https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/" }, { label: "NASA JPL: First aircraft accident investigation on another world", url: "https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/" }, { label: "NASA Science: Ingenuity Mars Helicopter", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" }, { label: "NASA/JPL: Ingenuity waypoints (route data)", url: "https://mars.nasa.gov/mmgis-maps/M20/Layers/json/m20_heli_waypoints.json" }], verified: true,
  },
];

export function stateAt(eq, ms) {
  let s = null;
  for (const e of eq.timeline) if (Date.parse(e.t) <= ms) s = e;
  return s;
}
