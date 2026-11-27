// NASA probes that left for the outer Solar System. They are not "left on" a world: they are
// still travelling (or, for Cassini, ended inside Saturn), so they get their own list.
//
// STATUS: DRAFT, like equipment.js. Dates are mission event times; closest-approach distances
// (ca, km from the planet's centre) are rounded. Check every fact against a NASA source.
//
// The flight path is SIMPLIFIED: each probe is at the right planet on the right day and at the
// right distance from the Sun later on, but the curve in between is interpolated, not integrated.
//   flybys: [planet id, time, closest approach in km from the centre]
//   dist:   [time, distance from the Sun in AU] after the last flyby
//   lonF/latF: ecliptic direction (deg) the probe ends up travelling in

const VOY = { label: 'NASA: Voyager mission', url: 'https://science.nasa.gov/mission/voyager/' };
const NSSDCA = { label: 'NSSDCA Master Catalog (search the mission)', url: 'https://nssdc.gsfc.nasa.gov/nmc/' };

export const PROBES = [
  {
    id: 'pioneer10', name: 'Pioneer 10', short: 'First spacecraft through the asteroid belt and first past Jupiter', model: 'pioneer', color: '#f0b541',
    launch: '1972-03-03T01:49:00Z',
    flybys: [['jupiter', '1973-12-04T02:26:00Z', 203000]],
    dist: [['1983-06-13T00:00:00Z', 30.3], ['2003-01-23T00:00:00Z', 80.2], ['2026-11-18T00:00:00Z', 140]],
    lonF: 79, latF: 3,
    timeline: [
      { t: '1972-03-03T01:49:00Z', state: 'active', label: 'Launched toward Jupiter' },
      { t: '1973-12-04T02:26:00Z', state: 'active', label: 'Flew past Jupiter and kept going' },
      { t: '2003-01-23T00:00:00Z', state: 'silent', label: 'Last faint signal received on Earth' },
    ],
    chapters: [
      "Pioneer 10 was NASA's first mission to the outer planets. Nobody knew whether a spacecraft could get through the asteroid belt to reach Jupiter.",
      "It became the first spacecraft to fly through the asteroid belt, taking fewer hits than expected, and on 4 December 1973 the first to fly past Jupiter. It sent home the first close-up pictures of the giant planet.",
      "Its measurements of the intense radiation around Jupiter were crucial for designing the Voyager spacecraft that followed.",
      "After Jupiter it was on a path out of the Solar System, the first spacecraft ever sent on one. It was never meant to return.",
      "Its last, very weak signal reached Earth on 23 January 2003. It coasts on silently toward the red star Aldebaran in Taurus, a journey of more than two million years, carrying a metal plaque that shows where it came from.",
    ],
    sources: [{ label: "NASA Science: Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" }, { label: "NASA Science: Pioneer 10 sends last signal", url: "https://science.nasa.gov/missions/pioneer/pioneer-10-sends-last-signal/" }], verified: true,
  },
  {
    id: 'pioneer11', name: 'Pioneer 11', short: 'First spacecraft to visit Saturn', model: 'pioneer', color: '#e47a4b',
    launch: '1973-04-06T02:11:00Z',
    flybys: [['jupiter', '1974-12-03T05:22:00Z', 114000], ['saturn', '1979-09-01T16:31:00Z', 80000]],
    dist: [['1995-09-30T00:00:00Z', 44.7], ['2026-11-18T00:00:00Z', 117]],
    lonF: 283, latF: 15,
    timeline: [
      { t: '1973-04-06T02:11:00Z', state: 'active', label: 'Launched toward Jupiter' },
      { t: '1974-12-03T05:22:00Z', state: 'active', label: 'Flew past Jupiter, heading for Saturn' },
      { t: '1979-09-01T16:31:00Z', state: 'active', label: 'Flew past Saturn and kept going' },
      { t: '1995-09-30T00:00:00Z', state: 'silent', label: 'Last contact' },
    ],
    chapters: [
      "Pioneer 11 followed its sister ship to Jupiter, then went on to give the first close look at Saturn.",
      "On 3 December 1974 it passed Jupiter three times closer than Pioneer 10. On 1 September 1979 it became the first spacecraft to fly past Saturn.",
      "At Saturn it discovered a narrow new ring, the F ring, and a new moon.",
      "Like Pioneer 10, it is on a path that takes it out of the Solar System.",
      "Last contact was on 30 September 1995. It carries the same kind of plaque as its sister ship.",
    ],
    sources: [{ label: "NASA Science: Pioneer 11", url: "https://science.nasa.gov/mission/pioneer-11/" }, { label: "NASA Science: 10 facts about the Pioneer spacecraft", url: "https://science.nasa.gov/missions/pioneer/pioneer-11/10-things-about-pioneer-spacecraft/" }], verified: true,
  },
  {
    id: 'voyager1', name: 'Voyager 1', short: 'The most distant thing humans have ever built', model: 'voyager', color: '#7ee0a1',
    launch: '1977-09-05T12:56:00Z',
    flybys: [['jupiter', '1979-03-05T12:05:00Z', 349000], ['saturn', '1980-11-12T23:46:00Z', 184000]],
    dist: [['1990-02-14T00:00:00Z', 40.5], ['2012-08-25T00:00:00Z', 121.7], ['2026-11-18T10:16:07Z', 172.3791]],
    lonF: 255, latF: 35,
    timeline: [
      { t: '1977-09-05T12:56:00Z', state: 'active', label: 'Launched toward Jupiter and Saturn' },
      { t: '1979-03-05T12:05:00Z', state: 'active', label: 'Flew past Jupiter' },
      { t: '1980-11-12T23:46:00Z', state: 'active', label: 'Flew past Saturn and left the plane of the planets' },
      { t: '2012-08-25T00:00:00Z', state: 'in-use', label: 'In interstellar space, still sending data' },
    ],
    chapters: [
      "Voyager 1 was sent to study Jupiter and Saturn, Saturn's rings and the larger moons of both planets up close.",
      "At Jupiter in 1979 it found a faint ring and two new moons, and the Voyagers discovered erupting volcanoes on the moon Io: the first active volcanoes ever seen on another world. At Saturn in 1980 it found five new moons and a new ring.",
      "On 14 February 1990 it turned its cameras around and took a \"family portrait\" of six planets. Earth, in that picture, is the famous Pale Blue Dot.",
      "Its path was planned to pass close to Saturn's big moon Titan. That bent it up and out of the plane in which the planets orbit, and it has been leaving ever since.",
      "On 25 August 2012 it became the first spacecraft to enter interstellar space. It still sends data, and it carries a Golden Record of pictures and sounds from Earth.",
    ],
    sources: [{ label: "NASA Science: Voyager 1", url: "https://science.nasa.gov/mission/voyager/voyager-1/" }, { label: "NASA Science: Voyager fact sheet", url: "https://science.nasa.gov/mission/voyager/fact-sheet/" }, { label: "NASA Science: Voyager 1, most distant human-made object", url: "https://science.nasa.gov/missions/voyager-program/voyager-1-now-most-distant-human-made-object-in-space/" }], verified: true,
  },
  {
    id: 'voyager2', name: 'Voyager 2', short: 'The only spacecraft to visit Uranus and Neptune', model: 'voyager', color: '#6fd6ff',
    launch: '1977-08-20T14:29:00Z',
    flybys: [['jupiter', '1979-07-09T22:29:00Z', 650000], ['saturn', '1981-08-26T01:21:00Z', 161000], ['uranus', '1986-01-24T17:59:00Z', 107000], ['neptune', '1989-08-25T03:56:00Z', 29700]],
    dist: [['2018-11-05T00:00:00Z', 119.0], ['2026-11-18T00:00:00Z', 145.0]],
    lonF: 290, latF: -37,
    timeline: [
      { t: '1977-08-20T14:29:00Z', state: 'active', label: 'Launched on the "Grand Tour"' },
      { t: '1979-07-09T22:29:00Z', state: 'active', label: 'Flew past Jupiter' },
      { t: '1981-08-26T01:21:00Z', state: 'active', label: 'Flew past Saturn' },
      { t: '1986-01-24T17:59:00Z', state: 'active', label: 'Flew past Uranus' },
      { t: '1989-08-25T03:56:00Z', state: 'active', label: 'Flew past Neptune and headed out' },
      { t: '2018-11-05T00:00:00Z', state: 'in-use', label: 'In interstellar space, still sending data' },
    ],
    chapters: [
      "A rare line-up of the outer planets, which happens only about once every 175 years, let one spacecraft visit all four giant planets. Voyager 2 is the only one that ever has.",
      "It used the gravity of each planet like a slingshot to reach the next: Jupiter in 1979, Saturn in 1981, Uranus in 1986 and Neptune in 1989.",
      "At Uranus it discovered 10 new moons and two new rings. At Neptune it discovered five moons, four rings and a \"Great Dark Spot\", and on its frozen moon Triton it saw active geysers. It is still the only spacecraft to have visited either planet.",
      "After Neptune its course took it below the plane of the planets and out of the Solar System.",
      "It reached interstellar space on 5 November 2018 and still sends data home.",
    ],
    sources: [{ label: "NASA Science: Voyager 2", url: "https://science.nasa.gov/mission/voyager/voyager-2/" }, { label: "NASA Science: Voyager mission overview", url: "https://science.nasa.gov/mission/voyager/mission-overview/" }, { label: "NASA Science: Voyager celebrates its 10th anniversary", url: "https://science.nasa.gov/missions/voyager-program/voyager-celebrates-its-10th-anniversary/" }], verified: true,
  },
  {
    id: 'cassini', name: 'Cassini', short: 'Burned up in Saturn; its Huygens lander is still on Titan', model: 'cassini', color: '#e2c98e',
    launch: '1997-10-15T08:43:00Z', end: '2017-09-15T11:55:00Z', orbit: { body: 'saturn', from: '2004-07-01T02:48:00Z', radius: 350000, periodDays: 12 },
    flybys: [['venus', '1998-04-26T13:45:00Z', 6336], ['venus', '1999-06-24T20:30:00Z', 6655], ['earth', '1999-08-18T03:28:00Z', 7542], ['jupiter', '2000-12-30T10:05:00Z', 9700000], ['saturn', '2004-07-01T02:48:00Z', 350000]],
    dist: [['2017-09-15T00:00:00Z', 10.0]], lonF: 0, latF: 0,
    timeline: [
      { t: '1997-10-15T08:43:00Z', state: 'active', label: 'Launched toward Saturn' },
      { t: '1998-04-26T13:45:00Z', state: 'active', label: 'First Venus flyby for a speed boost' },
      { t: '1999-06-24T20:30:00Z', state: 'active', label: 'Second Venus flyby' },
      { t: '1999-08-18T03:28:00Z', state: 'active', label: 'Flew past Earth' },
      { t: '2000-12-30T10:05:00Z', state: 'active', label: 'Flew past Jupiter' },
      { t: '2004-07-01T02:48:00Z', state: 'active', label: 'In orbit around Saturn' },
      { t: '2005-01-14T11:38:11Z', state: 'active', label: 'Its Huygens probe landed on Titan' },
      { t: '2017-09-15T11:55:00Z', state: 'ended', label: 'Plunged into Saturn, on purpose' },
    ],
    chapters: [
      "Three spacecraft had flown past Saturn. Cassini was sent to stay in orbit and study the planet, its rings and its moons.",
      "Launched on 15 October 1997, it could not fly straight there. It swung twice past Venus, once past Earth and once past Jupiter, gaining speed each time. On 1 July 2004 it became the first spacecraft to orbit Saturn.",
      "It carried the European-built Huygens probe, which parachuted down to the moon Titan on 14 January 2005, the most distant landing ever made. On Titan, Cassini found methane rivers running to a methane sea. On the moon Enceladus it found jets of ice and gas blasting into space from an ocean of liquid water.",
      "In 2017 its operators plunged it into Saturn on purpose, to make sure Saturn's moons stay pristine.",
      "Its mission ended on 15 September 2017, inside the planet it had studied. Nothing is left of Cassini itself. What it left behind is Huygens, still sitting on the surface of Titan.",
    ],
    sources: [{ label: "NASA Science: Cassini", url: "https://science.nasa.gov/mission/cassini/" }, { label: "NASA Science: Saturn exploration", url: "https://science.nasa.gov/saturn/exploration/" }, { label: "NASA Science: Cassini timeline", url: "https://science.nasa.gov/mission/cassini/the-journey/timeline/" }, { label: "NASA Science: Huygens", url: "https://science.nasa.gov/mission/cassini-huygens/" }, { label: "NASA History: Cassini-Huygens begins its journey", url: "https://www.nasa.gov/history/25-years-ago-cassini-huygens-begins-its-journey-to-reveal-saturns-secrets/" }], verified: true,
  },
  {
    id: 'newhorizons', name: 'New Horizons', short: 'Gave the world its first real look at Pluto', model: 'nh', color: '#d9a6ff',
    launch: '2006-01-19T19:00:00Z',
    flybys: [['jupiter', '2007-02-28T05:43:00Z', 2300000], ['pluto', '2015-07-14T11:49:00Z', 13700]],
    dist: [['2019-01-01T05:33:00Z', 43.4], ['2026-11-18T00:00:00Z', 66]],
    lonF: 288, latF: 2,
    timeline: [
      { t: '2006-01-19T19:00:00Z', state: 'active', label: 'Launched toward Pluto' },
      { t: '2007-02-28T05:43:00Z', state: 'active', label: 'Flew past Jupiter for a speed boost' },
      { t: '2015-07-14T11:49:00Z', state: 'in-use', label: 'Flew past Pluto, now exploring the Kuiper Belt' },
    ],
    chapters: [
      "No spacecraft had ever visited Pluto. New Horizons was sent to explore it and its moons up close for the first time.",
      "It made the fastest launch on record in January 2006, picked up more speed at Jupiter in 2007, and on 14 July 2015 flew about 12,500 km above the surface of Pluto.",
      "Its pictures showed rugged mountains of ice and flat ice plains. On 1 January 2019 it also flew past Arrokoth, the most distant object ever explored up close.",
      "It is a flyby mission: it passed Pluto without stopping and kept going.",
      "It is still flying outward through the Kuiper Belt and sending data.",
    ],
    sources: [{ label: "NASA Science: New Horizons", url: "https://science.nasa.gov/mission/new-horizons/" }, { label: "NASA Science: 10 things, looking back at Pluto", url: "https://science.nasa.gov/missions/new-horizons/10-things-looking-back-at-pluto/" }, { label: "NASA Science: New Horizons wakes from hibernation", url: "https://science.nasa.gov/missions/new-horizons/nasas-new-horizons-spacecraft-wakes-from-hibernation-in-good-health/" }], verified: true,
  },
  {
    id: 'near', name: 'NEAR Shoemaker', short: 'Resting on the asteroid Eros since 2001', model: 'near', color: '#c9a36b',
    launch: '1996-02-17T20:43:27Z', flybys: [['earth', '1998-01-23T07:23:00Z', 7000]],
    dist: [['2000-02-14T15:33:00Z', 1.5], ['2035-12-31T00:00:00Z', 1.46]], lonF: 0, latF: 0, turns: 21.5,
    timeline: [
      { t: '1996-02-17T20:43:27Z', state: 'active', label: 'Launched toward the asteroid Eros' },
      { t: '1997-06-27T00:00:00Z', state: 'active', label: 'Flew past the asteroid Mathilde' },
      { t: '1998-01-23T07:23:00Z', state: 'active', label: 'Flew past Earth for a gravity assist' },
      { t: '2000-02-14T15:33:00Z', state: 'active', label: 'In orbit around Eros' },
      { t: '2001-02-12T20:01:52Z', state: 'active', label: 'Touched down on Eros' },
      { t: '2001-02-28T00:00:00Z', state: 'silent', label: 'Last contact, from the surface of Eros' },
    ],
    chapters: [
      "Asteroids are leftovers from the time the planets formed. NEAR was sent to study one up close for a whole year: Eros, an asteroid about 33 km long that comes near the Earth.",
      "It launched on 17 February 1996, flew past the asteroid Mathilde and then past Earth for a gravity assist, and on 14 February 2000 became the first spacecraft ever to orbit an asteroid.",
      "It sent back about 160,000 pictures, ten times more data than planned. It found that Eros has no magnetic field and is about as dense as the Earth's crust.",
      "NEAR was not built to land. When its work was done, its team lowered it gently onto Eros anyway, on 12 February 2001: the first landing on an asteroid. It survived and kept sending data for about two weeks.",
      "Its last signal came on 28 February 2001. It is still there, riding Eros around the Sun about once every 1.8 years.",
    ],
    sources: [{ label: "NASA Science: NEAR Shoemaker", url: "https://science.nasa.gov/mission/near-shoemaker/" }, { label: "NSSDCA: NEAR Shoemaker", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A" }, { label: "NASA Science: 433 Eros", url: "https://science.nasa.gov/solar-system/asteroids/433-eros/" }], verified: true,
  },
  {
    id: 'dawn', name: 'Dawn', short: 'Silent, still circling the dwarf planet Ceres', model: 'dawn', color: '#8fd3ff',
    launch: '2007-09-27T11:34:00Z', flybys: [['mars', '2009-02-18T00:27:58Z', 3932]],
    dist: [['2011-07-16T00:00:00Z', 2.2], ['2012-09-05T06:26:00Z', 2.5], ['2015-03-06T12:39:00Z', 2.86], ['2035-12-31T00:00:00Z', 2.77]], lonF: 0, latF: 0, turns: 5.9,
    timeline: [
      { t: '2007-09-27T11:34:00Z', state: 'active', label: 'Launched toward the asteroid belt' },
      { t: '2009-02-18T00:27:58Z', state: 'active', label: 'Flew past Mars for a gravity assist' },
      { t: '2011-07-16T00:00:00Z', state: 'active', label: 'In orbit around the giant asteroid Vesta' },
      { t: '2012-09-05T06:26:00Z', state: 'active', label: 'Left Vesta for Ceres' },
      { t: '2015-03-06T12:39:00Z', state: 'active', label: 'In orbit around the dwarf planet Ceres' },
      { t: '2018-10-31T00:00:00Z', state: 'silent', label: 'Out of fuel; left in orbit around Ceres' },
    ],
    chapters: [
      "Vesta and Ceres are the two biggest objects in the asteroid belt between Mars and Jupiter: baby planets that never finished growing. Dawn was sent to study both, to learn how the Solar System formed.",
      "It launched on 27 September 2007 and flew with an ion engine, which pushes very gently but for years. That let it do something no spacecraft had done: go into orbit around one world, leave, and go into orbit around another.",
      "It spent 14 months at Vesta from July 2011, then reached Ceres on 6 March 2015: the first spacecraft to visit a dwarf planet. On Ceres it found bright spots that turned out to be salts left by briny water coming up from inside.",
      "On 31 October 2018 it ran out of the fuel it used to point itself, so it could no longer turn its antenna to Earth.",
      "Dawn was left where it is on purpose, in an orbit that will not hit Ceres for at least 20 years. It is still there: a silent, new moon of Ceres.",
    ],
    sources: [{ label: "NASA Science: Dawn", url: "https://science.nasa.gov/mission/dawn/" }, { label: "NASA Science: Dawn, end of mission", url: "https://science.nasa.gov/mission/dawn/toolkit/end-of-mission/" }, { label: "NSSDCA: Dawn", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A" }, { label: "NASA: 15 years ago, Dawn begins its voyage", url: "https://www.nasa.gov/history/15-years-ago-dawn-begins-voyage-to-asteroid-vesta-and-dwarf-planet-ceres/" }], verified: true,
  },
  {
    id: 'kepler', name: 'Kepler Space Telescope', short: 'A retired planet hunter, drifting behind the Earth', model: 'kepler', color: '#f2e27a',
    launch: '2009-03-07T03:49:57Z', trail: { periodDays: 372.5 }, flybys: [], dist: [['2035-01-01T00:00:00Z', 1.0]], lonF: 0, latF: 0,
    timeline: [
      { t: '2009-03-07T03:49:57Z', state: 'active', label: 'Launched into its own orbit around the Sun' },
      { t: '2009-05-13T00:00:00Z', state: 'active', label: 'Began watching 150,000 stars' },
      { t: '2018-10-30T00:00:00Z', state: 'silent', label: 'Out of fuel; retired in its orbit' },
    ],
    chapters: [
      "When Kepler was planned, nobody knew of a single planet around another star. Kepler was sent to find out how common planets are.",
      "It launched in March 2009 into its own orbit around the Sun, away from the Earth. For four years it stared at the same 150,000 stars in the constellation Cygnus, watching for the tiny dip in a star's light when a planet passes in front of it.",
      "It found more than 2,600 planets, and showed that our galaxy holds more planets than stars. It was the first mission to find Earth-size planets at a distance from their stars where water could be liquid.",
      "After nine years in space it ran out of fuel. On 30 October 2018 NASA retired it in its orbit.",
      "It is still there, switched off, following the Earth around the Sun and slowly falling farther behind.",
    ],
    sources: [{ label: "NASA Science: Kepler / K2", url: "https://science.nasa.gov/mission/kepler/" }, { label: "NASA: Kepler retired (30 October 2018)", url: "https://www.nasa.gov/news-release/nasa-retires-kepler-space-telescope-passes-planet-hunting-torch/" }, { label: "NASA Science: Kepler in depth", url: "https://science.nasa.gov/mission/kepler/in-depth/" }], verified: true,
  },
  {
    id: 'hubble', name: 'Hubble Space Telescope', short: 'Still at work, and never coming home', model: 'hst', color: '#9fe0c4',
    launch: '1990-04-24T12:33:51Z', orbit: { body: 'earth', from: '1990-04-24T12:33:51Z', radius: 6371 + 520, periodDays: 95 / 1440 },
    flybys: [], dist: [['2035-01-01T00:00:00Z', 1.0]], lonF: 0, latF: 0,
    timeline: [
      { t: '1990-04-24T12:33:51Z', state: 'active', label: 'Launched on the space shuttle Discovery' },
      { t: '1990-04-25T12:00:00Z', state: 'active', label: 'Released into orbit' },
      { t: '1993-12-02T00:00:00Z', state: 'active', label: 'Astronauts corrected its blurry vision' },
      { t: '2009-05-11T00:00:00Z', state: 'in-use', label: 'Serviced for the last time; still observing' },
    ],
    chapters: [
      "The air above us blurs starlight and blocks some kinds of light completely. A telescope above the atmosphere gets a clear view, and can see ultraviolet and infrared light that never reaches the ground.",
      "The space shuttle Discovery carried Hubble into orbit on 24 April 1990 and released it the next day. It circles the Earth about once every 95 minutes, 15 times a day, collecting light with a mirror 2.4 metres across.",
      "Its first pictures were blurry: the edge of the main mirror had been ground too flat, by a fraction of the width of a human hair. In December 1993 astronauts fitted corrective optics, like a pair of glasses, and the pictures came out sharp.",
      "Hubble was built to be repaired in orbit, not to be brought home. Astronauts visited it five times between 1993 and 2009, replacing batteries, gyroscopes and instruments.",
      "It has worked for more than twice as long as planned and is still observing. Nobody is flying to it any more, so it stays in orbit.",
    ],
    sources: [{ label: "NASA Science: The history of Hubble", url: "https://science.nasa.gov/mission/hubble/overview/the-history-of-hubble/" }, { label: "NASA Science: Hubble observatory", url: "https://science.nasa.gov/mission/hubble/observatory/" }, { label: "NASA Science: Hubble's mirror flaw", url: "https://science.nasa.gov/mission/hubble/observatory/design/optics/hubbles-mirror-flaw/" }, { label: "NASA: STS-31", url: "https://www.nasa.gov/mission/sts-31/" }], verified: true,
  },
  {
    id: 'jwst', name: 'James Webb Space Telescope', short: 'Too far to visit: it will stay out there for good', model: 'jwst', color: '#ffd166',
    launch: '2021-12-25T12:20:00Z', l2: { arrive: '2022-01-24T19:00:00Z', km: 1500000 },
    flybys: [], dist: [['2035-01-01T00:00:00Z', 1.01]], lonF: 0, latF: 0,
    timeline: [
      { t: '2021-12-25T12:20:00Z', state: 'active', label: 'Launched on an Ariane 5 rocket' },
      { t: '2022-01-24T19:00:00Z', state: 'active', label: 'Arrived at its place 1.5 million km from Earth' },
      { t: '2022-07-12T14:30:00Z', state: 'in-use', label: 'First science pictures released; observing' },
    ],
    chapters: [
      "Light from the first galaxies has been stretched into infrared on its long way to us. To see it, a telescope must be very large and very cold. Webb was built to find those first galaxies and to study planets around other stars.",
      "It launched on 25 December 2021 from French Guiana, folded up inside an Ariane 5 rocket. In the two weeks after launch it unfolded a sunshield the size of a tennis court and a mirror 6.5 metres across, made of 18 gold-coated segments.",
      "Its first science pictures, released on 12 July 2022, included the deepest and sharpest infrared view of the distant universe taken up to then.",
      "It does not circle the Earth like Hubble. It orbits the Sun 1.5 million km from Earth, at a point called L2: farther than people have ever travelled. It cannot be visited or repaired.",
      "It is observing today. Its five-layer sunshield keeps the telescope in permanent shade and cold enough to work.",
    ],
    sources: [{ label: "NASA Science: James Webb Space Telescope", url: "https://science.nasa.gov/mission/webb/" }, { label: "NASA Science: Webb mission timeline", url: "https://science.nasa.gov/mission/webb/webb-mission-timeline/" }, { label: "NASA Science: Webb's deployment", url: "https://science.nasa.gov/mission/webb/deployment/" }, { label: "NSSDCA: James Webb Space Telescope", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2021-130A" }], verified: true,
  },
];

for (const p of PROBES) { p.isProbe = true; p.launchMs = Date.parse(p.launch); p.endMs = p.end ? Date.parse(p.end) : null; }

// One paragraph per world for the "Go to" panel of places nobody has landed NASA hardware on.
export const WORLD_NOTES = {
  sun: 'The star at the centre. Every position in this simulation is measured from here.',
  mercury: 'The planet closest to the Sun.',
  venus: 'The second planet from the Sun.',
  jupiter: 'The largest planet. Pioneer 10 was the first spacecraft to fly past it, in December 1973.',
  saturn: 'The ringed planet, sixth from the Sun and the second largest. Pioneer 11 and both Voyagers flew past it, and Cassini studied it from orbit for 13 years.',
  uranus: 'A planet tipped over on its side. Voyager 2 flew past in 1986. It is still the only spacecraft that has visited Uranus.',
  neptune: 'Voyager 2 flew past in 1989 and found active geysers on its largest moon, Triton. It is still the only spacecraft that has visited Neptune.',
  pluto: 'A dwarf planet in the Kuiper Belt. New Horizons made the first close exploration in July 2015.',
};
