// Twenty-four short film clips, one for each big moment that does not have a long film of its own.
// Together with the six long films that makes thirty: on average one every two years of the story.
// Each clip is one or two shots built from the film engine's parts. The dates and numbers in the captions
// come from the same NASA sources as the object pages; the staging is ours.
const MIN = 60e3, H = 3600e3;
// shot: [kind, chip, seconds, start, end, title, text, facts, options]
const land = (T, body, o, title, text, facts) => ['retro', 'Landing', 15, T - 150e3, T + 15e3, title, text, facts, { body, ...o }];
const stay = (T, body, o, chip, title, text, facts) => ['still', chip, 10, T + H, T + 3 * H, title, text, facts, { body, ...o }];
const LM = { h0: 110, dist: 23, lookY: 3.4, fy: 1.3, fk: 1.7 };

export function CLIPS({ D, ATLAS }) {
  const mk = (id, kicker, title, extra, shots, finish) => ({ id, kicker, title, rocket: ATLAS, craft: 'lander', clip: true, ...extra, shots, finish });
  const out = {};
  const add = (def) => { out[def.id] = def; };
  let T;

  T = D('1964-07-31T13:25:49Z');
  add(mk('c_ranger7', 'Ranger 7 · 31 July 1964', 'The first close look at the Moon', { shape: 'probe' }, [
    ['impact', 'Impact', 16, T - 17 * MIN, T + MIN, 'Flying straight at the Moon', 'Before anyone could land on the Moon, NASA needed close-up pictures of it. Ranger 7 flew straight in, taking photos until the very last second: 4,308 pictures in its final 17 minutes. It was never meant to survive.', ['4,308 pictures in 17 minutes', 'Last picture: details half a metre across', 'Hit at about 2.6 km per second'], { body: 'moon' }],
  ], { eq: 'ranger7', t: T + 5000 }));

  T = D('1966-06-02T06:17:36Z');
  add(mk('c_surveyor1', 'Surveyor 1 · 2 June 1966', 'Will it sink?', { part: 'surveyor' }, [
    land(T, 'moon', { h0: 60, dist: 11 }, 'A gentle landing', 'Would a spacecraft sink into deep dust on the Moon? Surveyor 1 was sent to find out before astronauts tried. It comes down on its rockets and makes the first US soft landing on another world.', ['First US soft landing on another world']),
    stay(T, 'moon', { dist: 9 }, 'On the Moon', 'It did not sink', 'One of its first pictures showed a footpad sitting firmly on top of the soil. It sent back 11,240 pictures. It was a one-way robot, and it is still there.', ['11,240 pictures', 'Contact kept until 7 January 1967']),
  ], { eq: 'surveyor1', t: T + 5000 }));

  T = D('1969-11-19T06:54:35Z');
  add(mk('c_apollo12', 'Apollo 12 · 19 November 1969', 'A pinpoint landing', { part: 'lmfull' }, [
    land(T, 'moon', LM, 'Landing exactly on target', 'Apollo 12 had to prove that astronauts could land exactly where they planned: within walking distance of the old Surveyor 3 robot. Pete Conrad and Alan Bean did it.', ['Landed within walking distance of Surveyor 3']),
    stay(T, 'moon', { dist: 20, lookY: 3 }, 'Left behind', 'A science station left running', 'They set up the first ALSEP, a science station powered by a small nuclear generator, and left it running on purpose. The lower half of the lander stayed behind as a launch pad.', ['First ALSEP science station']),
  ], { eq: 'apollo12', t: T + 5000 }));

  T = D('1970-04-15T01:09:41Z');
  add(mk('c_sivb', 'Apollo 13 rocket stage · 15 April 1970', 'Space junk becomes an experiment', { shape: 'stage' }, [
    ['impact', 'Impact', 16, T - 10 * MIN, T + MIN, 'A crash on purpose', 'The third stage of Apollo 13\'s rocket was no longer needed, so NASA steered it into the Moon. The seismometer left by Apollo 12, about 135 km away, felt the ground shake. A crash of known size, time and place is a perfect test signal for studying the Moon\'s crust.', ['About 14 tonnes', 'More than 2.5 km per second', 'Felt 135 km away'], { body: 'moon' }],
  ], { eq: 'apollo13sivb', t: T + 5000 }));

  T = D('1971-07-30T22:16:29Z');
  add(mk('c_apollo15', 'Apollo 15 · 30 July 1971', 'The first car on the Moon', { part: 'lmfull' }, [
    land(T, 'moon', LM, 'Landing with a car on board', 'The first of the long missions: almost three days on the surface, between mountains and a deep valley called Hadley Rille. Folded against the side of the lander is the first Lunar Roving Vehicle.', ['Almost three days on the surface', 'The rover was driven about 28 km']),
    stay(T, 'moon', { dist: 20, lookY: 3 }, 'Left behind', 'The car stays', 'The rover could not fly home. It was parked about 150 m from the lunar module, where its TV camera could watch the liftoff. It is still parked there.', ['Parked about 150 m away']),
  ], { eq: 'apollo15', t: T + 5000 }));

  T = D('1972-12-11T19:54:57Z');
  add(mk('c_apollo17', 'Apollo 17 · 11 December 1972', 'The last Apollo landing', { part: 'lmfull' }, [
    land(T, 'moon', LM, 'The last landing of Apollo', 'The last Apollo mission carried the first scientist to the Moon, geologist Harrison Schmitt. He and Gene Cernan stayed about three days, made three moonwalks and drove their rover about 36 km.', ['Three moonwalks', 'Rover driven about 36 km']),
    stay(T, 'moon', { dist: 20, lookY: 3 }, 'Left behind', 'What they left', 'Schmitt spotted orange soil: tiny beads of volcanic glass about 3.6 billion years old. The rover, the descent stage and a plaque stayed behind when the crew left on 14 December 1972.', ['Crew left on 14 December 1972']),
  ], { eq: 'apollo17', t: T + 5000 }));

  T = D('1973-12-04T02:26:00Z');
  add(mk('c_pioneer10', 'Pioneer 10 · 4 December 1973', 'First to Jupiter', { probe: 'pioneer' }, [
    ['flyby', 'Jupiter', 16, T - 12 * H, T + 12 * H, 'The first spacecraft at Jupiter', 'Nobody knew whether a spacecraft could get through the asteroid belt. Pioneer 10 did, and became the first to fly past Jupiter and send home close-up pictures. What it measured of the fierce radiation there shaped the Voyagers that followed.', ['First through the asteroid belt', 'First close-up pictures of Jupiter'], { planet: 'jupiter', dist: 22 }],
  ], { probe: 'pioneer10' }));

  T = D('1976-07-20T11:53:06Z');
  add(mk('c_viking1', 'Viking 1 · 20 July 1976', 'Looking for life on Mars', { part: 'viking' }, [
    land(T, 'mars', { h0: 70, dist: 12 }, 'Down onto the Golden Plain', 'Viking 1 comes down on its rocket engines onto Chryse Planitia, the "Golden Plain". It is the first US spacecraft to land safely on Mars and send back pictures from the surface.', ['First US landing on Mars']),
    stay(T, 'mars', { dist: 10 }, 'On Mars', 'A puzzle in the soil', 'Its arm scooped up soil for three experiments that looked for tiny living things. The soil showed unexpected chemical activity, but no clear evidence of microbes. Viking 1 worked for more than six years.', ['Three life experiments', 'Worked for more than six years']),
  ], { eq: 'viking1', t: T + 5000 }));

  T = D('1979-09-01T16:31:00Z');
  add(mk('c_pioneer11', 'Pioneer 11 · 1 September 1979', 'First to Saturn', { probe: 'pioneer' }, [
    ['flyby', 'Saturn', 16, T - 12 * H, T + 12 * H, 'The first spacecraft at Saturn', 'Pioneer 11 followed its sister ship past Jupiter, then went on to give the first close look at Saturn. There it discovered a narrow new ring, the F ring, and a new moon.', ['First to fly past Saturn', 'Discovered the F ring'], { planet: 'saturn', dist: 22 }],
  ], { probe: 'pioneer11' }));

  T = D('1986-01-24T17:59:00Z');
  add(mk('c_uranus', 'Voyager 2 · 24 January 1986', 'The only visit to Uranus', { probe: 'voyager' }, [
    ['flyby', 'Uranus', 16, T - 12 * H, T + 12 * H, 'A planet on its side', 'Voyager 2 flies past Uranus, a planet tipped over on its side. It discovers 10 new moons and two new rings. No other spacecraft has ever been there.', ['10 new moons, 2 new rings', 'Still the only visit'], { planet: 'uranus' }],
  ], { probe: 'voyager2' }));

  T = D('1989-08-25T03:56:00Z');
  add(mk('c_neptune', 'Voyager 2 · 25 August 1989', 'The only visit to Neptune', { probe: 'voyager' }, [
    ['flyby', 'Neptune', 16, T - 12 * H, T + 12 * H, 'The last planet', 'Voyager 2 flies past Neptune. It discovers five moons, four rings and a "Great Dark Spot", and sees geysers on the frozen moon Triton. Then its path takes it below the planets and out of the Solar System.', ['5 moons, 4 rings', 'Still the only visit'], { planet: 'neptune' }],
  ], { probe: 'voyager2' }));

  T = D('1997-07-04T16:56:55Z');
  add(mk('c_pathfinder', 'Mars Pathfinder · 4 July 1997', 'Bouncing onto Mars', { part: 'pathfinder' }, [
    ['bounce', 'Airbags', 17, T - 30e3, T + 90 * MIN, 'A landing inside airbags', 'Pathfinder tested a cheaper way to land: wrapped in airbags. It hit the ground and bounced at least 15 times before rolling to a stop. Then the airbags went flat and the lander opened like a flower.', ['At least 15 bounces'], {}],
    stay(T, 'mars', { dist: 9, lookY: 0.6 }, 'First rover', 'The first rover on Mars', 'Then Sojourner, a little rover weighing just 10.5 kg, drove off to study the rocks nearby: the first rover ever to drive on Mars. The boulders here were dropped by huge floods long ago.', ['Sojourner: 10.5 kg', 'Last data: 27 September 1997']),
  ], { eq: 'pathfinder', t: T + 5000 }));

  T = D('2001-02-12T20:01:52Z');
  add(mk('c_near', 'NEAR Shoemaker · 12 February 2001', 'The first landing on an asteroid', { probe: 'near' }, [
    ['asteroid', 'Touchdown', 18, T - 4 * H, T + MIN, 'Landing a spacecraft that was not built to land', 'After a year in orbit around the asteroid Eros, NEAR had finished its work. Its team lowered it gently to the surface anyway. It touched down at walking pace, survived, and kept sending data for about two weeks.', ['Touchdown at about 6.4 km per hour', 'Last contact: 28 February 2001', 'The asteroid shown is a simple stand-in'], {}],
  ], { probe: 'near' }));

  T = D('2004-01-25T05:05:00Z');
  add(mk('c_opportunity', 'Opportunity · 25 January 2004', 'A 90-day rover', { part: 'mer' }, [
    ['bounce', 'Airbags', 16, T - 30e3, T + 90 * MIN, 'Into a crater, inside airbags', 'Like Pathfinder, the rover Opportunity arrives inside airbags. It bounces and rolls, and comes to rest inside a small crater, later named Eagle crater.', ['Landed in Eagle crater'], {}],
    stay(T, 'mars', { dist: 8, lookY: 0.8 }, 'On Mars', 'Planned for 90 days', 'It was planned to work for 90 Martian days. It worked for more than 14 years and drove 45.16 km, farther than a marathon. Its "blueberries", tiny round mineral balls, were clues that this place was once wet.', ['Planned: 90 Martian days', 'Drove 45.16 km']),
  ], { eq: 'opportunity', t: T + 5000 }));

  T = D('2004-07-01T02:48:00Z');
  add(mk('c_cassini', 'Cassini · 1 July 2004', 'Into orbit around Saturn', { probe: 'cassini' }, [
    ['flyby', 'Saturn', 17, T - 6 * H, T + 6 * H, 'Braking at Saturn', 'It could not fly straight there: Cassini swung twice past Venus, once past Earth and once past Jupiter to gain speed. Now it fires its engine to slow down and becomes the first spacecraft to orbit Saturn. It will stay for 13 years.', ['First spacecraft to orbit Saturn', 'Launched 15 October 1997'], { planet: 'saturn', burn: true, dist: 30 }],
  ], { probe: 'cassini' }));

  T = D('2008-05-25T23:53:00Z');
  add(mk('c_phoenix', 'Phoenix · 25 May 2008', 'Digging for ice', { part: 'phoenix', partOpts: { intact: true } }, [
    land(T, 'mars', { h0: 70, dist: 12 }, 'Landing in the arctic of Mars', 'Orbiters had found signs of water ice just under the surface of the Martian arctic. Phoenix lands on its rockets, farther north than any spacecraft before it, to dig the ice up and test it.', ['Farthest north of any Mars lander']),
    stay(T, 'mars', { dist: 10 }, 'On Mars', 'Ice, and falling snow', 'It confirmed water ice just below the surface, and its laser saw snow falling from the clouds. As arctic winter arrived there was too little sunlight for its solar panels.', ['Water ice confirmed', 'Last signal: 2 November 2008']),
  ], { eq: 'phoenix', t: T + 5000 }));

  T = D('2009-03-07T03:49:57Z');
  add(mk('c_kepler', 'Kepler · launched 7 March 2009', 'The planet hunter', { probe: 'kepler', tilt: [0.5, 0, 0.9] }, [
    ['scope', 'Kepler', 16, T + 20 * 86400e3, T + 21 * 86400e3, 'Staring at 150,000 stars', 'Kepler leaves the Earth for its own orbit around the Sun. For four years it will stare at the same 150,000 stars, watching for the tiny dip in a star\'s light when a planet passes in front of it. It will find more than 2,600 planets.', ['More than 2,600 planets found', 'Retired in its orbit: 30 October 2018'], { dist: 15, dots: [[0x9ec9ff, 15, 0.05, -0.02]] }],
  ], { probe: 'kepler', t: T + 30 * 86400e3 }));

  T = D('2009-10-09T11:31:19Z');
  add(mk('c_lcross', 'LCROSS · 9 October 2009', 'Is there water on the Moon?', { shape: 'stage' }, [
    ['impact', 'Impact', 16, T - 10 * MIN, T + 4 * MIN, 'A splash in a dark crater', 'Is there ice in craters near the Moon\'s poles that sunlight never reaches? LCROSS aimed its empty rocket stage, about two tonnes, at Cabeus crater, then flew through the cloud it threw up and measured it. The cloud contained water.', ['Rocket stage: about two tonnes', 'Water: about 5.6% of the soil by mass'], { body: 'moon' }],
  ], { eq: 'lcross', t: T + 5000 }));

  T = D('2015-03-06T12:39:00Z');
  add(mk('c_dawn', 'Dawn · 6 March 2015', 'Arriving at a dwarf planet', { probe: 'dawn', tilt: [0.25, 0, 0.1] }, [
    ['scope', 'Ceres', 16, T - 2 * H, T + 2 * H, 'An engine that pushes for years', 'Dawn\'s ion engine pushes very gently, but for years. After 14 months at the giant asteroid Vesta it slips into orbit around Ceres: the first spacecraft to visit a dwarf planet, and the first to orbit two different worlds.', ['First to orbit two worlds', 'Ceres itself is not drawn here'], { dist: 36, ion: true, dots: [[0xfff2c8, 13, 0, 0]] }],
  ], { probe: 'dawn' }));

  T = D('2015-07-14T11:49:00Z');
  add(mk('c_pluto', 'New Horizons · 14 July 2015', 'Pluto, up close at last', { probe: 'newhorizons' }, [
    ['flyby', 'Pluto', 16, T - 6 * H, T + 6 * H, 'Nine years for one day', 'After more than nine years of flight New Horizons passes about 12,500 km above Pluto. It cannot stop: it flies straight past, sending home pictures of rugged ice mountains and flat ice plains, and keeps going.', ['About 7,800 km above the surface', 'A flyby: it could not stop'], { planet: 'pluto', dist: 16 }],
  ], { probe: 'newhorizons' }));

  T = D('2017-09-15T11:55:00Z');
  add(mk('c_finale', 'Cassini · 15 September 2017', 'The Grand Finale', { probe: 'cassini' }, [
    ['flyby', 'Finale', 17, T - 3 * H, T, 'Into Saturn, on purpose', 'After 13 years at Saturn, Cassini\'s operators plunge it into the planet on purpose, to make sure Saturn\'s moons stay pristine. Nothing is left of Cassini itself. What it left behind is the Huygens probe, still sitting on the moon Titan.', ['13 years in orbit', 'Burned up in Saturn\'s atmosphere'], { planet: 'saturn', plunge: true, dist: 30 }],
  ], { probe: 'cassini', t: T - 3 * 86400e3 }));

  T = D('2018-06-10T00:00:00Z');
  add(mk('c_storm', 'Opportunity · 10 June 2018', 'The day the Sun went out', { part: 'mer' }, [
    ['storm', 'Dust storm', 17, T - 10 * 86400e3, T, 'A storm that covered a planet', 'A dust storm covers the whole of Mars and blocks the sunlight this rover\'s solar panels need. Its last signal comes on 10 June 2018. The last thing it sent was a dark, noisy picture of a Sun hidden by dust.', ['Last signal: 10 June 2018', 'More than 14 years of work'], {}],
  ], { eq: 'opportunity', t: T + 5000 }));

  T = D('2018-11-26T19:52:59Z');
  add(mk('c_insight', 'InSight · 26 November 2018', 'Listening to Mars', { part: 'insight' }, [
    land(T, 'mars', { h0: 70, dist: 12 }, 'A lander that listens', 'InSight comes down on its rockets to place the first seismometer directly on the ground of Mars, and listen to the inside of the planet.', ['First seismometer on the ground of Mars']),
    stay(T, 'mars', { dist: 10 }, 'On Mars', '1,319 marsquakes', 'It recorded 1,319 marsquakes and showed that Mars has a liquid core. Dust slowly covered its solar panels until there was not enough power. It last called home on 15 December 2022.', ['1,319 marsquakes', 'Last contact: 15 December 2022']),
  ], { eq: 'insight', t: T + 5000 }));

  T = D('2021-04-19T07:34:00Z');
  add({ id: 'c_ingenuity', kicker: 'Ingenuity · 19 April 2021', title: 'First flight on another planet', rocket: ATLAS, craft: 'capsule', rover: 'm2020', clip: true, shots: [
    ['heli', 'First flight', 18, T - 60e3, T + 60e3, 'Flying in almost no air', 'Could anything fly in the very thin air of Mars? The rover backs away, and the little helicopter Ingenuity lifts off, hovers and lands: the first powered, controlled flight on another planet. Planned for up to five flights, it flew 72 times.', ['72 flights in almost three years', 'Last flight: 18 January 2024'], {}],
  ], finish: { eq: 'ingenuity', t: T + 5000 } });
  return out;
}

// which timeline event starts which clip
export const CLIP_AT = {
  '1964-07-31T13:25:49Z': 'c_ranger7', '1966-06-02T06:17:36Z': 'c_surveyor1', '1969-11-19T06:54:35Z': 'c_apollo12', '1970-04-15T01:09:41Z': 'c_sivb',
  '1971-07-30T22:16:29Z': 'c_apollo15', '1972-12-11T19:54:57Z': 'c_apollo17', '1973-12-04T02:26:00Z': 'c_pioneer10', '1976-07-20T11:53:06Z': 'c_viking1',
  '1979-09-01T16:31:00Z': 'c_pioneer11', '1986-01-24T17:59:00Z': 'c_uranus', '1989-08-25T03:56:00Z': 'c_neptune', '1997-07-04T16:56:55Z': 'c_pathfinder',
  '2001-02-12T20:01:52Z': 'c_near', '2004-01-25T05:05:00Z': 'c_opportunity', '2004-07-01T02:48:00Z': 'c_cassini', '2008-05-25T23:53:00Z': 'c_phoenix',
  '2009-03-07T03:49:57Z': 'c_kepler', '2009-10-09T11:31:19Z': 'c_lcross', '2015-03-06T12:39:00Z': 'c_dawn', '2015-07-14T11:49:00Z': 'c_pluto',
  '2017-09-15T11:55:00Z': 'c_finale', '2018-06-10T00:00:00Z': 'c_storm', '2018-11-26T19:52:59Z': 'c_insight', '2021-04-19T07:34:00Z': 'c_ingenuity',
};
