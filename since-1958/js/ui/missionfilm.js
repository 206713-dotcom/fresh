// Mission films: Voyager 1, Curiosity and Perseverance, shot by shot, from the launch pad on.
//
// Dates, times, speeds, heights and sizes in the captions are from NASA: the NSSDCA mission
// records, NASA Science mission pages, the Mars Science Laboratory launch and landing press kits
// and the Mars 2020 landing press kit. The spacecraft are NASA 3D Resources models. Everything
// else in the picture is a staging of ours: the rockets, the capsule, the parachute, the descent
// stage, flames, smoke and the camera work. Each film is a pure function of time, so it can be
// scrubbed. It has its own renderer and runs only while open.

import * as THREE from 'three';
import { Cine, dressEarth, rimLight } from './cine.js';
import { loadGLB, buildPart } from '../scene/models.js';
import { buildModel } from '../scene/probes.js';
import { CLIPS } from './clips.js';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const seg = (u, a, b) => clamp((u - a) / (b - a));
const pad = (n) => String(Math.floor(n)).padStart(2, '0');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const D = (s) => Date.parse(s);
const RAD = { earth: 6371, mars: 3389.5, jupiter: 69911, saturn: 58232, moon: 1737.4, uranus: 25362, neptune: 24622, pluto: 1188.3 };
const GEN = (def) => def.craft === 'telescope' || def.craft === 'lander';      // one spacecraft model, no capsule or rover
const SUN = new THREE.Vector3(0.6, 0.55, 0.55).normalize();
const Yax = new THREE.Vector3(0, 1, 0);

const ATLAS = { coreH: 32.5, coreR: 1.9, coreColor: 0xb0703c, srb: { n: 4, h: 20, r: 0.8 }, centH: 11, centR: 1.5, fairH: 25.5, fairR: 2.7 };      // 58 m with payload
const TITAN = { coreH: 29, coreR: 1.52, coreColor: 0xdfe2e6, srb: { n: 2, h: 26, r: 1.52 }, centH: 9, centR: 1.5, fairH: 19, fairR: 2.15 };

// Ariane 5 ECA (the rocket that launched Webb) and the space shuttle stack, which uses NASA's 3D model.
const ARIANE = { coreH: 30.5, coreR: 2.7, coreColor: 0xe6dfcf, srb: { n: 2, h: 29, r: 1.52 }, centH: 4.7, centR: 2.7, fairH: 17, fairR: 2.7 };
const SHUTTLE = { shuttle: true, coreH: 47, coreR: 4.2, coreColor: 0xb5652a, srb: { n: 2, h: 45, r: 1.85 }, centH: 0, centR: 1, fairH: 1, fairR: 1 };

// ---- the films. Shot: [kind, chip, seconds of film, start, end (UTC), title, text, facts, options]
const launchShots = (L, name, rocket, site, liftText, facts, upperName = 'Centaur upper stage') => [
  ['liftoff', 'Lift-off', 13, L - 6000, L + 22000, 'Lift-off', liftText, facts],
  ['boosters', 'Climb', 11, L + 30000, L + 130000, 'Climbing out of the atmosphere', `The ${rocket} leans over toward the east as it climbs, and the sky turns from blue to black. In this picture the solid rocket boosters burn out and drop away.`, [site]],
  ['fairing', 'Fairing', 12, L + 200000, L + 290000, 'The nose fairing opens', `Above the air there is nothing left to protect the spacecraft from, so the nose fairing splits and falls away. The first stage drops off and the ${upperName} takes over.`, [`${name} rides on top of the ${upperName}`]],
];
const edl = (E, rover, chuteM, cableM, extra) => [
  ['entry', 'Entry', 13, E - 600000, E + 200000, 'Into the atmosphere of Mars', `Ten minutes before entry the capsule lets go of its cruise stage. It meets the top of the atmosphere about 125 km up, at about 5,900 metres per second. Friction with the thin air does most of the braking, and the heat shield glows.`, ['Entry: about 125 km high', 'About 5,900 m/s (13,200 mph)', 'Heat shield 4.5 m across']],
  ['chute', 'Parachute', 13, E + 240000, E + 350000, 'Parachute and heat shield', extra.chute, extra.chuteFacts],
  ['powered', 'Rockets', 12, E + 350000, E + 395000, 'Powered descent', `About 1.6 km up, still falling at about 80 metres per second, the descent stage and ${rover} drop out of the back shell. Eight rocket engines fire and slow the fall to 0.75 metres per second.`, ['Back shell separation: about 1.6 km', 'Eight landing engines']],
  ['skycrane', 'Sky crane', 16, E + 395000, E + 420000, 'The sky crane', extra.crane, extra.craneFacts, { cable: cableM }],
];

export const FILMS = {
  voyager1: (() => {
    const L = D('1977-09-05T12:56:01Z');
    return {
      id: 'voyager1', kicker: 'Voyager 1 · launched 5 September 1977', title: 'The farthest spacecraft', rocket: TITAN, craft: 'voyager',
      shots: [
        ...launchShots(L, 'Voyager 1', 'Titan IIIE-Centaur', 'Launch Complex 41, Cape Canaveral', 'At 12:56:01 UTC a Titan IIIE-Centaur rocket lifts Voyager 1 off Launch Complex 41 at Cape Canaveral, Florida: 8:56 in the morning, local time. Its twin, Voyager 2, left 16 days earlier.', ['5 September 1977, 12:56:01 UTC', 'Rocket: Titan IIIE-Centaur']),
        ['depart', 'Departure', 13, L + 600000, L + 3600000, 'On its way', 'The Centaur fires and sets Voyager 1 free on a faster, shorter path than its twin. Voyager 1 weighs 721.9 kg. Three nuclear generators on a boom give it power, far from the Sun where solar panels would not work.', ['Mass 721.9 kg', 'Antenna 3.66 m across', '3 radioisotope generators']],
        ['dots', 'Looking back', 11, D('1977-09-18T12:00:00Z'), D('1977-09-19T12:00:00Z'), 'Earth and Moon in one picture', 'Two weeks after launch, from 7.25 million miles away, Voyager 1 turns its camera back and takes the first picture ever to show the Earth and the Moon together in a single frame.', ['7.25 million miles (11.7 million km) from home'], { dots: [[0x9ec9ff, 15, 0, 0], [0xcfcfcf, 7, 0.05, 0.016]] }],
        ['flyby', 'Jupiter', 15, D('1979-03-04T12:00:00Z'), D('1979-03-06T12:00:00Z'), 'Jupiter', 'Voyager 1 passes closest to Jupiter on 5 March 1979. It finds a faint ring and two new moons, and sees volcanoes erupting on the moon Io: the first active volcanoes ever seen on another world.', ['Closest approach 5 Mar 1979, 12:05 UTC'], { planet: 'jupiter' }],
        ['flyby', 'Saturn', 15, D('1980-11-11T23:00:00Z'), D('1980-11-13T23:00:00Z'), 'Saturn and Titan', 'On 12 November 1980 it flies past Saturn, after passing 4,033 miles from the centre of the big moon Titan. That path bends it up and out of the plane of the planets. It will never visit another planet.', ['Closest approach 12 Nov 1980, 23:46 UTC'], { planet: 'saturn' }],
        ['dots', 'Pale Blue Dot', 12, D('1990-02-14T00:00:00Z'), D('1990-02-14T12:00:00Z'), 'The Pale Blue Dot', 'On 14 February 1990 Voyager 1 turns its cameras around one last time and takes a family portrait of the planets: 60 pictures. In one of them, Earth is a pale blue dot.', ['14 February 1990', '60 images, 6 planets'], { dots: [[0xfff2c8, 46, 0, 0], [0x9ec9ff, 5, 0.085, 0.03]] }],
        ['dots', 'Interstellar', 13, D('2012-08-25T00:00:00Z'), D('2012-08-26T00:00:00Z'), 'Interstellar space', 'In August 2012 Voyager 1 crosses into interstellar space, the space between the stars. It is the first thing made by people to get there, and no spacecraft has gone farther. It will never come back.', ['August 2012', 'Still sending data'], { dots: [[0xfff2c8, 12, 0, 0]], slow: true }],
      ],
      finish: { probe: 'voyager1' },
    };
  })(),
  curiosity: (() => {
    const L = D('2011-11-26T15:02:00Z'), LAND = D('2012-08-06T05:18:00Z'), E = LAND - 416000;
    return {
      id: 'curiosity', kicker: 'Curiosity · Mars Science Laboratory', title: 'Earth to Gale crater', rocket: ATLAS, craft: 'capsule', rover: 'msl',
      shots: [
        ...launchShots(L, 'Curiosity', 'Atlas V 541', 'Launch Complex 41, Cape Canaveral', 'At 15:02 UTC, 10:02 in the morning in Florida, an Atlas V 541 rocket lifts off from Launch Complex 41 at Cape Canaveral. On top, folded inside a capsule, is the rover Curiosity.', ['26 November 2011, 15:02 UTC', 'Atlas V 541: 58 m tall with payload']),
        ['depart', 'Departure', 12, L + 2400000, L + 2800000, 'Leaving Earth', 'A second burn of the Centaur, nearly eight minutes long, throws the spacecraft out of Earth orbit toward Mars. Three minutes and 43 seconds after the engine stops, springs push the spacecraft free.', ['Earth to Mars at launch: 204 million km']],
        ['cruise', 'Cruise', 12, L + 86400000, E - 600000, 'Eight months to Mars', 'The rover travels folded inside its capsule, between a heat shield and a back shell. A cruise stage on the back steers and powers it. Three course corrections are made on the way, and a last one eight days before landing.', ['Cruise: about 8 months']],
        ...edl(E, 'Curiosity', 16, 7.5, {
          chute: 'About 254 seconds after entry, 11 km up and still at about 405 metres per second, the parachute opens. It is almost 16 metres across. Twenty-four seconds later, at 8 km, the heat shield drops away and the radar can see the ground.',
          chuteFacts: ['Parachute: about 11 km, 405 m/s', 'Heat shield off: about 8 km, 125 m/s'],
          crane: 'A rover this heavy cannot land on airbags. About 20 metres up, the descent stage lowers Curiosity on nylon cords 7.5 metres long. The wheels pop into place, the rover touches down at 0.75 metres per second, the cords are cut, and the descent stage flies off to crash 650 metres away.',
          craneFacts: ['Rover lowered from about 20 m', 'Bridle 7.5 m long', 'Touchdown 6 Aug 2012, 05:18 UTC'],
        }),
        ['parts', 'The rover', 14, LAND + 60000, LAND + 86400000, 'A laboratory on wheels', 'Curiosity landed in Gale crater at 4.59° south, 137.44° east. It carries ten science instruments, with a robot arm that can drill into rock, scoop up soil and deliver samples to the laboratory instruments inside its body.', ['10 instruments, 75 kg', 'Mast Camera · ChemCam · SAM · CheMin', 'APXS · MAHLI · MARDI · DAN · RAD · REMS'], { explode: 0.35 }],
      ],
      finish: { eq: 'curiosity', t: LAND + 5000 },
    };
  })(),
  perseverance: (() => {
    const L = D('2020-07-30T11:50:00Z'), LAND = D('2021-02-18T20:55:00Z'), E = LAND - 410000;
    return {
      id: 'perseverance', kicker: 'Perseverance · Mars 2020', title: 'Earth to Jezero crater', rocket: ATLAS, craft: 'capsule', rover: 'm2020',
      shots: [
        ...launchShots(L, 'Perseverance', 'Atlas V 541', 'Space Launch Complex 41, Cape Canaveral', 'At 11:50 UTC, 7:50 in the morning in Florida, an Atlas V 541 rocket lifts off from Space Launch Complex 41 at Cape Canaveral. Inside the capsule on top are the Perseverance rover and, strapped to its belly, the Ingenuity helicopter.', ['30 July 2020, 11:50 UTC', 'Rocket: Atlas V 541, two stages']),
        ['depart', 'Departure', 12, L + 2700000, L + 3500000, 'Leaving Earth', 'The Centaur upper stage sends the spacecraft out of Earth orbit and lets it go. Earth and Mars line up like this only every two years: had the launch missed its window, the rover would have waited two years in storage.', ['Distance to travel: 471 million km']],
        ['cruise', 'Cruise', 12, L + 86400000, E - 600000, 'Six and a half months to Mars', 'The rover and the helicopter travel folded inside the capsule. The spacecraft launched on 30 July 2020 and reaches Mars on 18 February 2021.', ['Arrival: 18 February 2021']],
        ...edl(E, 'Perseverance', 21.5, 6.4, {
          chute: 'About 240 seconds after entry, 11 km up and at about 1,512 km/h, the parachute opens. It is 21.5 metres across. Twenty seconds later the heat shield drops away, uncovering a radar and the cameras of a new system, Terrain-Relative Navigation: the spacecraft photographs the ground, works out where it is, and can move its landing point by up to 600 metres to avoid danger.',
          chuteFacts: ['Parachute: 21.5 m across', 'Terrain-Relative Navigation: 4.2 to 2.2 km up'],
          crane: 'Jezero crater has cliffs, sand dunes and boulder fields: the hardest place a Mars landing has ever aimed for. About 20 metres above the ground the descent stage lowers the rover on cables about 6.4 metres long. When the wheels touch, the cables are cut and the descent stage flies away to crash at a safe distance.',
          craneFacts: ['Same sky crane system as Curiosity', 'Touchdown 18 Feb 2021'],
        }),
        ['parts', 'Instruments', 20, LAND + 60000, LAND + 86400000 * 3, 'What Perseverance is made of', 'Seven science instruments and 19 cameras. Two instruments on the mast study rocks from a distance. Two on the end of the robot arm study them up close and help choose where to drill. One, inside the body, makes oxygen from the air of Mars.', ['7 instruments', '19 cameras on the rover', 'Positions of the labels are approximate'], { explode: 0.5, labels: [
          ['SuperCam and Mastcam-Z · top of the mast', [-0.43, 2.12, 1.0]], ['MEDA weather sensors · on the mast', [-0.43, 1.45, 1.0]], ['PIXL, SHERLOC and WATSON · end of the robot arm', [0.45, 0.8, 1.35]],
          ['MOXIE oxygen experiment · inside the body', [0.55, 0.95, 0.35]], ['RIMFAX ground radar · bottom rear', [0, 0.5, -1.15]], ['Ingenuity helicopter · under the belly', [0, 0.42, 0.15]]] }],
        ['heli', 'Ingenuity', 16, D('2021-04-19T07:33:00Z'), D('2021-04-19T07:35:00Z'), 'The first flight on another planet', 'The rover sets the helicopter down and drives off to watch from a distance. On 19 April 2021 at 07:34 UTC, Ingenuity rises, hovers 3 metres above the ground for 30 seconds, and lands again. The flight lasts 39.1 seconds. Nothing had ever made a powered, controlled flight on another planet before.', ['19 April 2021, 07:34 UTC', '39.1 seconds, 3 m high', 'Planned for up to 5 flights; it flew 72']],
      ],
      finish: { eq: 'perseverance', t: LAND + 5000 },
    };
  })(),
  hubble: (() => {
    const L = D('1990-04-24T12:33:51Z');
    return {
      id: 'hubble', kicker: 'Hubble Space Telescope · launched 24 April 1990', title: 'A telescope above the air', rocket: SHUTTLE, craft: 'telescope', model: 'hst', tilt: [0.35, 0, 0.5],
      shots: [
        ['liftoff', 'Lift-off', 13, L - 6000, L + 22000, 'Lift-off', 'At 12:33:51 UTC, 8:33 in the morning in Florida, the space shuttle Discovery lifts off from Launch Pad 39B at Kennedy Space Center. The mission is called STS-31. Folded into its payload bay is the Hubble Space Telescope.', ['24 April 1990, 12:33:51 UTC', 'Space shuttle Discovery, mission STS-31']],
        ['boosters', 'Boosters', 11, L + 30000, L + 130000, 'The boosters fall away', 'The shuttle leans over as it climbs and the sky turns from blue to black. The two solid rocket boosters burn out and drop away. The orbiter climbs on with its three main engines, fed from the big external tank.', ['Launch Pad 39B, Kennedy Space Center']],
        ['tank', 'Tank', 11, L + 500000, L + 560000, 'The external tank is released', 'When the main engines shut down, the empty external tank is let go. Discovery carries on to an orbit about 380 miles (roughly 610 km) above the Earth, unusually high for a space shuttle.', ['Orbit: about 380 miles up']],
        ['deploy', 'Release', 15, D('1990-04-25T18:00:00Z'), D('1990-04-25T20:00:00Z'), 'Hubble is set free', 'The next day, 25 April 1990, the shuttle\'s robot arm lifts Hubble out of the payload bay and lets it go. Hubble is 13.2 metres long, about as long as a school bus.', ['Released 25 April 1990', 'Length 13.2 m']],
        ['scope', 'How it sees', 15, D('1990-05-20T00:00:00Z'), D('1990-05-20T01:35:00Z'), 'How Hubble sees', 'Light comes in at the front and falls on the main mirror, 2.4 metres across. It bounces to a small second mirror and back through a hole in the middle to the instruments. Hubble collects about 40,000 times more light than a human eye, and circles the Earth once every 95 minutes or so.', ['Main mirror 2.4 m across, 828 kg', 'Second mirror 30.5 cm', '15 orbits a day'], { alt: 600, dist: 26, labels: [['Aperture door: light comes in here', [0, 6.4, 0]], ['Main mirror, 2.4 m (inside)', [0, -1.0, 1.3]], ['Science instruments (inside)', [0, -4.6, 1.6]], ['Solar arrays', [5.2, 0.2, 0]]] }],
        ['scope', 'Blurry', 12, D('1990-06-27T00:00:00Z'), D('1990-06-27T12:00:00Z'), 'The first pictures are blurry', 'On 27 June 1990 NASA announces why. The main mirror was polished to slightly the wrong shape: its edge is too flat by about one-fiftieth of the width of a human hair. Starlight does not come to a sharp point.', ['Announced 27 June 1990', 'Error: about 1/50 of a human hair'], { dist: 30, star: [150, 150] }],
        ['deploy', 'Repair', 15, D('1993-12-02T09:27:00Z'), D('1993-12-13T05:00:00Z'), 'Astronauts fix it in orbit', 'Hubble is the first telescope built to be serviced in space. In December 1993 astronauts catch it, stand it in a shuttle\'s payload bay and fit a new camera and a set of small corrective mirrors that work like a pair of glasses. Then they let it go again.', ['Servicing Mission 1: 2 to 13 December 1993', 'New camera (WFPC2) and corrective optics (COSTAR)'], { service: true, star: [150, 150] }],
        ['scope', 'Today', 13, D('2009-05-11T00:00:00Z'), D('2009-05-24T00:00:00Z'), 'Sharp, and still at work', 'After the repair the pictures are sharp. Astronauts visited Hubble five times, the last time in May 2009. Nobody flies to it any more, and it was never meant to come home. It is still observing.', ['Serviced 5 times, 1993 to 2009', 'Still observing today'], { alt: 540, dist: 30, star: [150, 12] }],
      ],
      finish: { probe: 'hubble', t: D('1990-04-26T00:00:00Z') },
    };
  })(),
  jwst: (() => {
    const L = D('2021-12-25T12:20:00Z');
    return {
      id: 'jwst', kicker: 'James Webb Space Telescope · launched 25 December 2021', title: 'Unfolding a telescope in space', rocket: ARIANE, craft: 'telescope', model: 'jwst', fold: [0.34, 0.2], stackY: 3.2, site: [5.2, -52.8], tilt: [0.1, 0.55, -0.06],
      shots: [
        ...launchShots(L, 'Webb', 'Ariane 5', 'ELA-3 launch pad, Kourou, French Guiana', 'At 12:20 UTC on 25 December 2021 an Ariane 5 rocket lifts off from Europe\'s Spaceport near Kourou in French Guiana, South America. Inside the nose, folded up, is the James Webb Space Telescope: a joint mission of NASA, the European Space Agency and the Canadian Space Agency.', ['25 December 2021, 12:20 UTC', 'Rocket: Ariane 5'], 'upper stage'),
        ['depart', 'Separation', 13, L + 960000, L + 1800000, 'On its own', 'Twenty-seven minutes after lift-off, about 1,400 km above the Earth, Webb separates from the upper stage. A few minutes later its solar array unfolds and it is running on its own power. It is still folded, as it was inside the rocket.', ['Separation: 27 minutes after launch', 'About 1,400 km up', 'Mass 6,500 kg']],
        ['scope', 'Unfolding', 17, D('2021-12-28T12:00:00Z'), D('2022-01-08T18:17:00Z'), 'Unfolding in space', 'Webb is too big for any rocket, so it was built to unfold. Three days after launch the two halves of the sunshield fold down, front and back. Then booms pull its five layers out sideways and each layer is pulled tight. The second mirror swings out on its tripod, and the two side wings of the main mirror lock into place. On 8 January 2022 Webb is fully unfolded.', ['Sunshield: 28 Dec 2021 to 4 Jan 2022', 'Second mirror: 5 Jan · mirror wings: 7 and 8 Jan', 'The unfolding is shown simplified'], { dist: 44, unfold: true, dots: [[0x9ec9ff, 9, 0.02, -0.02]] }],
        ['scope', 'Parts', 17, D('2022-01-09T00:00:00Z'), D('2022-01-09T06:00:00Z'), 'How Webb sees', 'Light from the sky lands on the 18 gold-coated segments of the main mirror, bounces to the small second mirror out in front, and comes back through the middle into four science instruments. The sunshield keeps all of it in the dark and very cold, which an infrared telescope needs.', ['Main mirror 6.5 m across', 'Sunshield: 5 layers, 21 m long, like a tennis court', '4 science instruments'], { dist: 40, labels: [['Main mirror: 18 gold-coated segments', [0, 7.7, 1.6]], ['Second mirror', [0, 3.4, 8.4]], ['Science instruments (behind the mirror)', [1.3, 1.5, -1.2]], ['Sunshield: five layers', [5.3, 0.4, -6]], ['Spacecraft bus and solar array (sunny side)', [0, -3.0, 1.6]]] }],
        ['dots', 'L2', 12, D('2022-01-24T00:00:00Z'), D('2022-01-24T19:00:00Z'), '1.5 million km from home', 'On 24 January 2022, a month after launch, Webb arrives at its place. It does not circle the Earth. It circles the Sun, 1.5 million km farther out than the Earth, around a point called L2. From there the Sun, the Earth and the Moon are all on the same side, behind the sunshield.', ['Arrived 24 January 2022', '1.5 million km from Earth'], { dots: [[0xfff2c8, 30, 0, 0], [0x9ec9ff, 6, 0.05, 0.012]], slow: true }],
        ['scope', 'First light', 13, D('2022-07-12T14:30:00Z'), D('2022-07-12T20:30:00Z'), 'The first pictures', 'On 12 July 2022 Webb\'s first science pictures are released. One of them is the deepest and sharpest infrared view of the distant universe taken up to then. Nobody can fly out to Webb to repair it, and it will never be brought back. It is observing today.', ['First pictures: 12 July 2022', 'Cannot be visited or repaired'], { dist: 46, dots: [[0xffe9c0, 4, -0.12, 0.05], [0xc8d8ff, 3, 0.1, -0.04]] }],
      ],
      finish: { probe: 'jwst', t: D('2022-01-24T19:00:00Z') },
    };
  })(),
};

Object.assign(FILMS, CLIPS({ D, ATLAS }));

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
function groundTexture(mars) {
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const g = c.getContext('2d');
  let s = mars ? 7 : 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const moon = mars === 'moon'; if (moon) mars = false;
  g.fillStyle = moon ? '#77767a' : mars ? '#a9714a' : '#5f6f57'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * 1024, y = rnd() * 1024, r = 2 + rnd() * rnd() * 30;
    const gv = Math.round(58 + rnd() * 92);
    g.fillStyle = moon ? `rgba(${gv},${gv},${gv + 2},${0.10 + rnd() * 0.2})` : mars ? `rgba(${90 + rnd() * 60},${45 + rnd() * 30},${25 + rnd() * 20},${0.12 + rnd() * 0.2})` : `rgba(${40 + rnd() * 50},${70 + rnd() * 50},${50 + rnd() * 30},0.25)`;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export class MissionFilm {
  constructor(def) { this.def = def; this.isOpen = false; this.t = 0; this.speed = 1; this.playing = true; }

  open() {
    if (this.isOpen) return;
    const def = this.def, SH = def.shots;
    this.isOpen = true; this.t = 0; this.playing = true; this.speed = 1; this.ready = false; this._shown = -1; this.endT = 0;
    this._w = this._h = this._dpr = 0;   // a fresh canvas every time: size it and build the cinema layer again
    const root = this.root = document.createElement('div'); root.id = 'a11';
    root.innerHTML = `<canvas></canvas><div class="a-labs"></div>
      <header class="a-top"><div><p class="a-kicker">${def.kicker}</p><h2>${def.title}</h2></div>
        <span class="a-right"><button class="a-skip" data-act="skip" title="Skip the film ( Tab )">Skip</button><button class="a-exit" data-act="close" aria-label="Close the film" title="Close ( Esc )">✕</button></span></header>
      <button class="a-capx" data-act="cap" aria-label="Hide the text" title="Hide the text ( T )">×</button><section class="a-cap"><button class="a-capx in" data-act="cap" aria-label="Hide the text" title="Hide the text ( T )">×</button><p class="a-clock"><b class="a-get"></b><span class="a-utc"></span></p><h3></h3><p class="a-text"></p><ul class="a-facts"></ul></section>
      <footer class="a-bar">
        <div class="a-ctl"><button data-act="prev" title="Previous scene ( ← )">⏮︎</button><button data-act="play" class="a-play" title="Play or pause ( Space )">⏸︎</button><button data-act="next" title="Next scene ( → )">⏭︎</button>
          <button data-act="speed" class="a-speed" title="Film speed">1×</button><span class="a-load">Loading the NASA models…</span></div>
        <div class="a-chips">${SH.map((s, i) => `<button data-act="go" data-i="${i}">${i + 1}. ${s[1]}</button>`).join('')}</div>
        <div class="a-prog"><i></i></div>
      </footer>`;
    document.body.appendChild(root);
    try { if (localStorage.getItem('anf-nocap') === '1') root.classList.add('nocap'); } catch (er) { /* ignore */ }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'cap') { this.root.classList.toggle('nocap'); try { localStorage.setItem('anf-nocap', this.root.classList.contains('nocap') ? '1' : '0'); } catch (er) { /* ignore */ } return; } if (a === 'close') this.close(); else if (a === 'skip') this._finish(); else if (a === 'play') this._toggle(); else if (a === 'prev') this._jump(-1); else if (a === 'next') this._jump(1);
      else if (a === 'go') this._seek(this.starts[+b.dataset.i]); else if (a === 'speed') { this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 0.5 : 1; b.textContent = `${this.speed}×`; }
    });
    root.querySelector('.a-prog').addEventListener('pointerdown', (e) => { const r = e.currentTarget.getBoundingClientRect(); this._seek(clamp((e.clientX - r.left) / r.width) * this.total); });
    this._key = (e) => {
      if (!this.isOpen) return;
      const k = e.key;
      if (k === 't' || k === 'T') { this.root.classList.toggle('nocap'); } else if (k === 'Escape') this.close(); else if (k === ' ') this._toggle(); else if (k === 'ArrowRight') this._jump(1); else if (k === 'ArrowLeft') this._jump(-1); else return;
      e.preventDefault(); e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', this._key, true);
    this.starts = []; let acc = 0; for (const s of SH) { this.starts.push(acc); acc += s[2]; } this.total = acc;
    this._build();
    let last = performance.now();
    const loop = (now) => {
      if (!this.isOpen) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (this.ready && this.playing) this.t = Math.min(this.total - 0.001, this.t + dt * this.speed);
      if (this.ready && this.playing && this.t >= this.total - 0.002) { this.endT += dt; if (this.endT > 2.5) { this._finish(); return; } } else this.endT = 0;
      this._frame(now / 1000);
    };
    this.raf = requestAnimationFrame(loop);
  }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false; cancelAnimationFrame(this.raf); window.removeEventListener('keydown', this._key, true);
    for (const sc of [this.fg, this.bg]) sc.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    if (this.cine) { this.cine.dispose(); this.cine = null; }
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer = null;
    this.root.remove();
    if (this.onClose) this.onClose();
  }
  _finish() { const f = this.onFinish; this.close(); if (f) f(this.def); }
  _toggle() { this.playing = !this.playing; if (this.t >= this.total - 0.01 && this.playing) this.t = 0; this.root.querySelector('.a-play').textContent = this.playing ? '⏸︎' : '▶︎'; }
  _seek(t) { this.t = clamp(t, 0, this.total - 0.001); }
  _jump(d) { const i = this._index(); this._seek(this.starts[clamp(d > 0 ? i + 1 : (this.t - this.starts[i] > 1.5 ? i : i - 1), 0, this.def.shots.length - 1)]); }
  _index() { let i = this.def.shots.length - 1; while (i > 0 && this.t < this.starts[i]) i--; return i; }

  // ------------------------------------------------------------------ the set
  _build() {
    const def = this.def, canvas = this.root.querySelector('canvas');
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    r.autoClear = false; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    const bg = this.bg = new THREE.Scene(); bg.background = new THREE.Color(0);
    this.bgCam = new THREE.PerspectiveCamera(50, 1, 0.5, 4e7);
    const fg = this.fg = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(50, 1, 0.3, 60000);
    const tl = new THREE.TextureLoader(), tex = (u) => { const t = tl.load(u); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
    this.planets = {};
    for (const [k, file] of [['earth', 'earth_day'], ['mars', 'mars'], ['jupiter', 'jupiter'], ['saturn', 'saturn'], ['moon', 'moon'], ['uranus', 'uranus'], ['neptune', 'neptune'], ['pluto', 'pluto']]) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(RAD[k], 128, 64), new THREE.MeshLambertMaterial({ map: tex(`textures/${file}.jpg`) })); m.visible = false; bg.add(m); this.planets[k] = m;
    }
    { const site = def.site || [28.6, -80.6], la = site[0] * Math.PI / 180, lo = site[1] * Math.PI / 180;       // the launch site straight "up" under the pad
      this.planets.earth.quaternion.setFromUnitVectors(new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)), Yax); }
    dressEarth(this.planets.earth, RAD.earth, SUN); rimLight(this.planets.mars, RAD.mars, SUN, [0.95, 0.55, 0.32], 0.9);
    this.air = new THREE.Mesh(new THREE.SphereGeometry(RAD.earth * 1.012, 96, 48), new THREE.MeshBasicMaterial({ color: 0x6fb0ff, transparent: true, opacity: 0.22, side: THREE.BackSide, depthWrite: false })); bg.add(this.air);
    { const rings = new THREE.Group(); rings.rotation.x = -Math.PI / 2 + 0.42;
      for (const [a, b, o] of [[74500, 92000, 0.35], [92000, 117500, 0.75], [122000, 136800, 0.5]]) rings.add(new THREE.Mesh(new THREE.RingGeometry(a, b, 160), new THREE.MeshBasicMaterial({ color: 0xd9c9a3, transparent: true, opacity: o, side: THREE.DoubleSide, depthWrite: false })));
      this.planets.saturn.add(rings); }
    const sunB = new THREE.DirectionalLight(0xffffff, 3.2); sunB.position.copy(SUN); bg.add(sunB); bg.add(new THREE.AmbientLight(0xffffff, 0.06));
    const sp = new Float32Array(2600 * 3); let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.2832, q = Math.sqrt(1 - u * u); sp[i * 3] = q * Math.cos(a); sp[i * 3 + 1] = u; sp[i * 3 + 2] = q * Math.sin(a); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, depthTest: false })); this.stars.scale.setScalar(2e7); this.stars.renderOrder = -2; bg.add(this.stars);
    const glow = this.glow = glowTexture();
    this.dots = [0, 1].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthTest: false, sizeAttenuation: false, toneMapped: false, blending: THREE.AdditiveBlending })); s.visible = false; bg.add(s); return s; });
    this.sunF = new THREE.DirectionalLight(0xfff6e8, 3.0); fg.add(this.sunF); fg.add(this.sunF.target);
    this.hemi = new THREE.HemisphereLight(0xbfd4ff, 0x39342c, 0.55); fg.add(this.hemi);
    const L = (color, o = {}) => new THREE.MeshLambertMaterial({ color, ...o });
    const add = (parent, geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
    // ---- launch pad
    this.padGround = add(fg, new THREE.CircleGeometry(30000, 64), L(0xffffff, { map: groundTexture(false) })); this.padGround.material.map.repeat.set(60, 60); this.padGround.rotation.x = -Math.PI / 2;
    this.padDeck = add(fg, new THREE.CylinderGeometry(60, 80, 10, 8), L(0x9a9a96));
    this.tower = new THREE.Group(); fg.add(this.tower);
    { const m = L(0x8a8f99); for (const [x, z] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) add(this.tower, new THREE.BoxGeometry(0.9, 62, 0.9), m, x, 31, z); for (let y = 5; y <= 60; y += 8) add(this.tower, new THREE.BoxGeometry(9, 0.7, 9), m, 0, y, 0); }
    this.marsGround = add(fg, new THREE.CircleGeometry(40000, 64), L(0xffffff, { map: groundTexture(true) })); this.marsGround.material.map.repeat.set(220, 220); this.marsGround.rotation.x = -Math.PI / 2;
    this.moonGround = add(fg, new THREE.CircleGeometry(40000, 64), L(0xffffff, { map: groundTexture('moon') })); this.moonGround.material.map.repeat.set(260, 260); this.moonGround.rotation.x = -Math.PI / 2;
    // ---- flames, smoke, dust
    this.flames = [];
    const flame = (parent, len, rad, color, y = 0) => {
      const g = new THREE.Group(); g.position.y = y;
      for (const [k, c, o] of [[1, color, 0.55], [0.55, 0xffffff, 0.8]]) {
        const m = add(g, new THREE.ConeGeometry(rad * k, len * (k === 1 ? 1 : 0.6), 18, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
        m.rotation.x = Math.PI; m.position.y = -len * (k === 1 ? 1 : 0.6) / 2;
      }
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); s.scale.setScalar(rad * 5); g.add(s);
      parent.add(g); this.flames.push(g); return g;
    };
    const N = 420, pp = new Float32Array(N * 3); this.seed = []; for (let i = 0; i < N; i++) this.seed.push([rnd() * 6.2832, 0.35 + rnd() * 0.65, rnd(), rnd()]);
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    this.smoke = new THREE.Points(pg, new THREE.PointsMaterial({ map: glow, color: 0xe9e4dc, size: 45, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false })); this.smoke.frustumCulled = false; fg.add(this.smoke);
    // ---- the rocket (our own simple model)
    const R = def.rocket, white = L(0xeceef1), dark = L(0x30343c);
    const stack = this.stack = new THREE.Group(); fg.add(stack);
    const first = this.first = new THREE.Group(); stack.add(first);
    const upper = this.upper = new THREE.Group(); stack.add(upper);
    this.srbs = [];
    if (R.shuttle) {
      // the shuttle stack is NASA's model, sorted into boosters, tank and orbiter when it has loaded
      this.fMain = flame(upper, 34, 2.6, 0xaecbff, 3.5); this.fMain.position.z = 4.2;
      const g = new THREE.Group(), f = new THREE.Group();
      for (const x of [-6.05, 6.05]) { const c = flame(f, 78, 3.0, 0xffd9a0, -0.5); c.position.x = x; this.flames.pop(); }
      g.add(f); this.flames.push(f); g.userData = { a: 0, x: 0, z: 0, f }; first.add(g); this.srbs.push(g);
    } else {
    add(first, new THREE.CylinderGeometry(R.coreR, R.coreR, R.coreH, 28), L(R.coreColor), 0, R.coreH / 2, 0);
    add(first, new THREE.CylinderGeometry(R.coreR * 0.5, R.coreR * 0.85, 2.4, 18, 1, true), dark, 0, -1.0, 0);
    this.fMain = flame(first, 70, R.coreR * 1.5, 0xffb060, -1.5);
    }
    for (let k = 0; k < (R.shuttle ? 0 : R.srb.n); k++) {
      const a = (k + 0.5) / R.srb.n * Math.PI * 2, g = new THREE.Group(), d = R.coreR + R.srb.r + 0.05;
      add(g, new THREE.CylinderGeometry(R.srb.r, R.srb.r, R.srb.h, 18), white, 0, R.srb.h / 2, 0);
      add(g, new THREE.ConeGeometry(R.srb.r, R.srb.r * 2.6, 18), white, 0, R.srb.h + R.srb.r * 1.3, 0);
      g.userData = { a, x: Math.cos(a) * d, z: Math.sin(a) * d, f: flame(g, 60, R.srb.r * 1.7, 0xffd9a0, -0.5) };
      first.add(g); this.srbs.push(g);
    }
    if (!R.shuttle) {
      add(upper, new THREE.CylinderGeometry(R.centR, R.centR, R.centH, 24), L(0xd8dadd), 0, R.coreH + 1 + R.centH / 2, 0);
      add(upper, new THREE.CylinderGeometry(0.35, 0.8, 1.6, 14, 1, true), dark, 0, R.coreH + 0.2, 0);
    }
    this.fCent = flame(upper, 22, 1.3, 0x9fc8ff, R.coreH);
    this.mount = new THREE.Group(); this.mount.position.y = R.coreH + 1 + R.centH + 0.3; upper.add(this.mount);
    this.fair = (R.shuttle ? [] : [0, 1]).map((k) => {
      const g = new THREE.Group(), m = L(0xf1f2f4, { side: THREE.DoubleSide }), hc = R.fairH * 0.7, hn = R.fairH * 0.3;
      add(g, new THREE.CylinderGeometry(R.fairR, R.fairR, hc, 20, 1, true, k * Math.PI, Math.PI), m, 0, R.coreH + hc / 2, 0);
      add(g, new THREE.CylinderGeometry(0.15, R.fairR, hn, 20, 1, true, k * Math.PI, Math.PI), m, 0, R.coreH + hc + hn / 2, 0);
      g.userData.s = k ? -1 : 1; stack.add(g); return g;
    });
    // ---- the spacecraft
    this.craft = new THREE.Group(); fg.add(this.craft);
    if (def.craft === 'capsule') {
      this.cruise = new THREE.Group(); this.craft.add(this.cruise);
      add(this.cruise, new THREE.CylinderGeometry(1.9, 1.9, 0.5, 28), L(0xcfd2d6), 0, -0.3, 0);
      add(this.cruise, new THREE.RingGeometry(0.9, 1.85, 28), L(0x1d2c55, { side: THREE.DoubleSide }), 0, -0.56, 0).rotation.x = Math.PI / 2;
      this.shell = new THREE.Group(); this.craft.add(this.shell);
      add(this.shell, new THREE.CylinderGeometry(2.25, 0.75, 2.3, 32, 1, true), L(0xe9e6df, { side: THREE.DoubleSide }), 0, 1.15, 0);
      add(this.shell, new THREE.CircleGeometry(0.75, 24), L(0xe9e6df, { side: THREE.DoubleSide }), 0, 0, 0).rotation.x = Math.PI / 2;
      this.heat = add(this.craft, new THREE.SphereGeometry(2.25, 32, 10, 0, Math.PI * 2, 0, Math.PI / 2), L(0xb98a5a, { side: THREE.DoubleSide }), 0, 2.3, 0); this.heat.scale.y = 0.3;
      this.entryGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xff9a4a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); this.entryGlow.position.y = 3.2; this.craft.add(this.entryGlow);
      this.fTrail = flame(this.craft, 46, 2.6, 0xff8a3a, 2.2);
      // parachute: canopy on lines, above the back shell
      this.chute = new THREE.Group(); this.shell.add(this.chute);
      this.canopy = add(this.chute, new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), L(0xf4f1ea, { side: THREE.DoubleSide }), 0, -34, 0); this.canopy.rotation.x = Math.PI;
      const lp = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.2832; lp.push(0, 0, 0, Math.cos(a), -34, Math.sin(a)); }
      const lgeo = new THREE.BufferGeometry(); lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
      this.lines = new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.6 })); this.chute.add(this.lines);
      // descent stage and rover
      this.lander = new THREE.Group(); fg.add(this.lander);
      this.dstage = new THREE.Group(); this.lander.add(this.dstage);
      add(this.dstage, new THREE.CylinderGeometry(1.5, 1.5, 0.55, 6), L(0xc9a24a), 0, 0, 0);
      this.fEng = [];
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, x = Math.cos(a) * 1.9, z = Math.sin(a) * 1.9; add(this.dstage, new THREE.BoxGeometry(0.7, 0.5, 0.7), L(0x8d9099), x, 0, z); const f = flame(this.dstage, 5, 0.42, 0xffc890, -0.25); f.position.x = x; f.position.z = z; f.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); this.fEng.push(f); }
      this.rover = new THREE.Group(); this.lander.add(this.rover);
      const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(18), 3));
      this.cables = new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0xf2f2f2 })); this.cables.frustumCulled = false; this.lander.add(this.cables);
      this.dust = new THREE.Points(pg.clone(), new THREE.PointsMaterial({ map: glow, color: 0xc99a70, size: 6, sizeAttenuation: true, transparent: true, opacity: 0.35, depthWrite: false })); this.dust.frustumCulled = false; fg.add(this.dust);
      this.heli = new THREE.Group(); fg.add(this.heli);
      this.disc = add(this.heli, new THREE.CircleGeometry(0.6, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }), 0, 0.47, 0); this.disc.rotation.x = -Math.PI / 2;
    }
    if (GEN(def)) {
      // extras for the short clips: a landing engine, an ion engine, a flash, airbags, a lumpy asteroid, dust
      this.fLand = flame(this.craft, 5, 0.55, 0xffc890, 0.4); this.fIon = flame(this.craft, 9, 0.35, 0x7fd0ff, 0);
      this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xfff1d0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); this.flash.visible = false; fg.add(this.flash);
      this.bags = new THREE.Group(); fg.add(this.bags);
      { const bm = L(0xe8dcc0); for (const [x, y, z] of [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1], [0, 0, 1.55], [0, 0, -1.55], [1.55, 0, 0], [-1.55, 0, 0], [0, 1.55, 0], [0, -1.55, 0]]) add(this.bags, new THREE.SphereGeometry(1.25, 20, 14), bm, x * 0.95, y * 0.95, z * 0.95); }
      { const rg = new THREE.IcosahedronGeometry(1, 6), rp = rg.attributes.position, v = new THREE.Vector3(); this.rockR = 420;
        const nz = (x, y, z) => Math.sin(x * 3.1 + y * 1.7) * Math.cos(z * 2.3 - x * 1.1) + 0.5 * Math.sin(y * 7.3 + z * 5.1) * Math.cos(x * 6.7);
        for (let i = 0; i < rp.count; i++) { v.fromBufferAttribute(rp, i); const top = Math.max(0, Math.min(1, (v.y - 0.86) / 0.12)); v.multiplyScalar(1 + 0.11 * nz(v.x, v.y, v.z) * (1 - top)); rp.setXYZ(i, v.x * this.rockR, v.y * this.rockR, v.z * this.rockR); }
        rg.computeVertexNormals(); this.rock = add(fg, rg, L(0x7d746a)); this.rock.visible = false; }
      if (!this.dust) { this.dust = new THREE.Points(pg.clone(), new THREE.PointsMaterial({ map: glow, color: 0xc99a70, size: 6, sizeAttenuation: true, transparent: true, opacity: 0.35, depthWrite: false })); this.dust.frustumCulled = false; fg.add(this.dust); }
      if (def.shape) {      // a simple stand-in for craft we have no model of: a rocket stage, or a small probe
        const sm = L(def.shape === 'stage' ? 0xe9e9e6 : 0xcfd3d8), sh = new THREE.Group();
        if (def.shape === 'stage') { add(sh, new THREE.CylinderGeometry(3.3, 3.3, 17.8, 24), sm, 0, 0, 0); add(sh, new THREE.CylinderGeometry(1.0, 2.0, 2.6, 18, 1, true), L(0x30343c), 0, -10, 0); }
        else { add(sh, new THREE.CylinderGeometry(0.75, 0.75, 1.6, 6), sm, 0, 0, 0); add(sh, new THREE.ConeGeometry(0.5, 1.5, 12), sm, 0, 1.5, 0); for (const q of [-1, 1]) add(sh, new THREE.BoxGeometry(2.0, 0.05, 0.75), L(0x243a7a), q * 1.75, -0.2, 0); }
        this._shape = sh;
      }
      // the shuttle's robot arm (a plain line) for the release shots
      const ag = new THREE.BufferGeometry(); ag.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
      this.arm = new THREE.Line(ag, new THREE.LineBasicMaterial({ color: 0xf4f4f4 })); this.arm.frustumCulled = false; this.arm.visible = false; fg.add(this.arm);
    }
    const jobs = GEN(def) ? [this._shape ? Promise.resolve(this._shape) : def.part ? Promise.resolve(buildPart({ type: def.part, ...(def.partOpts || {}) }, Math.random)) : def.probe ? Promise.resolve(buildModel(def.probe)) : loadGLB(def.model), R.shuttle ? loadGLB('shuttle') : Promise.resolve(null)] : def.craft === 'voyager' ? [Promise.resolve(buildModel('voyager'))] : [loadGLB(def.rover), def.rover === 'm2020' ? loadGLB('ingenuity') : Promise.resolve(null)];
    Promise.all(jobs).then(([a, b]) => {
      if (!this.isOpen) return;
      if (def.craft === 'voyager') { this.model = a; this.craft.add(a); }
      else if (GEN(def)) {
        this.model = a; this.craft.add(a);
        if (b) {
          // stand the shuttle stack upright (its nose is along -z in the file) at its real height of 56 m
          const sc = 56.1 / 41.9, box = new THREE.Box3(), parts = [];
          b.updateWorldMatrix(true, true);
          b.traverse((o) => { if (o.isMesh) parts.push(o); });
          const mk = (color) => new THREE.MeshLambertMaterial({ color });
          const mats = { srb: mk(0xf1f1ee), tank: mk(0xb5652a), orb: mk(0xeeeeec) };
          const holder = (parent) => { const g = new THREE.Group(); g.rotation.x = Math.PI / 2; g.scale.setScalar(sc); g.position.y = 28.82 * sc; parent.add(g); return g; };
          const hs = { srb: holder(this.srbs[0]), tank: holder(this.first), orb: holder(this.upper) };
          for (const o of parts) {
            box.setFromObject(o); const w = box.max.x - box.min.x;
            const k = w > 13 ? 'srb' : (box.min.y < -1.2 || box.min.z < -3 ? 'tank' : 'orb');
            const m = o.matrixWorld.clone(); o.material = mats[k]; hs[k].add(o); m.decompose(o.position, o.quaternion, o.scale);
          }
        }
      } else {
        this.rover.add(a); if (b) this.heli.add(b);
        // remember where every piece of the rover sits, so the film can pull it apart and put it back
        a.updateWorldMatrix(true, true);
        const all = new THREE.Box3().setFromObject(a), C = all.getCenter(new THREE.Vector3()), w = new THREE.Vector3(), w2 = new THREE.Vector3();
        this.roverH = all.max.y; this.pieces = [];
        a.traverse((o) => {
          if (!o.isMesh || !o.parent) return;
          if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
          o.geometry.boundingBox.getCenter(w).applyMatrix4(o.matrixWorld); w2.copy(w).sub(C).add(w);
          o.userData.p0 = o.position.clone(); o.userData.d = o.parent.worldToLocal(w2.clone()).sub(o.parent.worldToLocal(w.clone()));
          this.pieces.push(o);
        });
      }
      this.ready = true; this.root.querySelector('.a-load').remove();
    }).catch((e) => { console.warn('film: models failed', e); const l = this.root.querySelector('.a-load'); if (l) l.textContent = 'The 3D models could not be loaded.'; });
  }

  // ------------------------------------------------------------------ one frame
  _frame(now) {
    const canvas = this.renderer.domElement, w = canvas.clientWidth, h = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    if (w && h && (this._w !== w || this._h !== h || this._dpr !== dpr)) {
      this._w = w; this._h = h; this._dpr = dpr;
      this.renderer.setPixelRatio(Math.max(1, Math.min(dpr, Math.sqrt(2.6e6 / (w * h))))); this.renderer.setSize(w, h, false);
      if (!this.cine) this.cine = new Cine(this.renderer, this.root, this.bg, this.bgCam, this.fg, this.cam);
      this.cine.setSize(w, h, this.renderer.getPixelRatio());
      for (const c of [this.cam, this.bgCam]) { c.aspect = w / h; if (w > 900) c.setViewOffset(w, h, -w * 0.11, 0, w, h); else c.clearViewOffset(); c.updateProjectionMatrix(); }
    }
    const SH = this.def.shots, i = this._index(), shot = SH[i], u = clamp((this.t - this.starts[i]) / shot[2]);
    const $ = (s) => this.root.querySelector(s);
    if (this._shown !== i) {
      this._shown = i;
      { const cp = this.root.querySelector('.a-cap'); cp.classList.remove('swap'); void cp.offsetWidth; cp.classList.add('swap'); if (this.cine) this.cine.cut(); }
      $('.a-cap h3').textContent = shot[5]; $('.a-text').textContent = shot[6]; $('.a-facts').innerHTML = (shot[7] || []).map((f) => `<li>${f.replace(/</g, '&lt;')}</li>`).join('');
      this.root.querySelectorAll('.a-chips button').forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
      const labs = (shot[8] && shot[8].labels) || [];
      $('.a-labs').innerHTML = labs.map((l) => `<span>${l[0]}</span>`).join('');
    }
    const ms = lerp(shot[3], shot[4], u), d = new Date(ms);
    $('.a-get').textContent = `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    $('.a-utc').textContent = shot[4] - shot[3] > 20 * 86400000 ? '' : `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
    $('.a-prog i').style.width = `${(this.t / this.total * 100).toFixed(2)}%`;
    if (this.ready) this._stage(shot, u, (ms - SH[0][3] - 6000) / 1000, now);
    const kd = shot[0], sh = kd === 'liftoff' ? Math.min(1, Math.max(0, (u - 0.2) * 4)) * (1 - u * 0.5) : kd === 'boosters' ? 0.22 : (kd === 'entry' || kd === 'powered') ? 0.12 : kd === 'skycrane' ? 0.05 : kd === 'retro' ? (u < 0.74 ? 0.07 : 0) : kd === 'impact' ? (u > 0.5 && u < 0.66 ? 1 - (u - 0.5) / 0.16 : 0) : 0;
    if (this.cine) this.cine.render(this.ready, sh);
    // labels follow their part of the rover
    const labs = this.ready && shot[8] && shot[8].labels;
    if (labs) {
      const els = $('.a-labs').children, v = new THREE.Vector3();
      labs.forEach((l, k) => {
        const el = els[k]; if (!el) return;
        v.set(l[1][0], l[1][1], l[1][2]).applyMatrix4((this.rover || this.model).matrixWorld).project(this.cam);
        const on = u > 0.08 + k * 0.1 && u < 0.97 && v.z < 1;
        el.style.opacity = on ? 1 : 0; el.style.left = `${((v.x * 0.5 + 0.5) * w).toFixed(1)}px`; el.style.top = `${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px`;
      });
    }
  }

  /** Everything in its place for this shot at fraction u. s = seconds since lift-off (launch shots only). */
  _stage(shot, u, s, now) {
    const kind = shot[0], opt = shot[8] || {}, def = this.def, R = def.rocket, cam = this.cam, cap = def.craft === 'capsule';
    const fl = 0.9 + 0.1 * Math.sin(now * 47) + 0.06 * Math.sin(now * 91);
    const burn = (f, k = 1) => { f.visible = k > 0.01; f.scale.set(0.9 + 0.1 * fl, Math.max(0.01, k) * fl, 0.9 + 0.1 * fl); };
    // ---- defaults
    for (const f of this.flames) f.visible = false;
    const { stack, first, upper, craft } = this;
    stack.visible = false; stack.position.set(0, 0, 0); stack.rotation.set(0, 0, 0);
    first.visible = true; first.position.set(0, 0, 0); first.rotation.set(0, 0, 0); upper.position.set(0, 0, 0);
    for (const g of this.srbs) { g.visible = true; g.position.set(g.userData.x, 0.5, g.userData.z); g.rotation.set(0, 0, 0); }
    for (const g of this.fair) { g.visible = true; g.position.set(0, 0, 0); g.rotation.set(0, 0, 0); }
    this.padGround.visible = this.padDeck.visible = this.tower.visible = this.marsGround.visible = this.moonGround.visible = this.smoke.visible = false;
    for (const k in this.planets) this.planets[k].visible = false;
    for (const dsp of this.dots) dsp.visible = false;
    if (craft.parent !== this.fg) this.fg.add(craft);
    craft.visible = false; craft.position.set(0, 0, 0); craft.quaternion.identity(); craft.scale.setScalar(1);
    if (cap) {
      this.cruise.visible = this.shell.visible = this.heat.visible = true; this.cruise.position.set(0, 0, 0); this.shell.position.set(0, 0, 0); this.shell.rotation.set(0, 0, 0); this.heat.position.set(0, 2.3, 0); this.heat.rotation.set(0, 0, 0);
      this.chute.visible = false; this.entryGlow.visible = false;
      this.lander.visible = false; this.lander.position.set(0, 0, 0); this.lander.rotation.set(0, 0, 0); this.dstage.visible = true; this.dstage.position.set(0, 0, 0); this.dstage.rotation.set(0, 0, 0);
      this.rover.position.set(0, -(this.roverH + 0.35), 0); this.rover.rotation.set(0, 0, 0); this.cables.visible = false; this.dust.visible = false; this.heli.visible = false; this.disc.visible = false;
      for (const p of this.pieces) p.position.copy(p.userData.p0);
    }
    let body = 'earth', P = new THREE.Vector3(0, RAD.earth, 0), th = 0, tilt = 0, camPos = new THREE.Vector3(0, 30, 200), look = new THREE.Vector3(0, 25, 0), fov = 48, sky = 0, tan = 0;
    const orbitAt = (altKm, a, b = 'earth') => { body = b; th = a; P.set(Math.sin(a), Math.cos(a), 0).multiplyScalar(RAD[b] + altKm); };
    const onStack = () => { stack.visible = true; this.mount.add(craft); craft.visible = cap; };
    const tele = GEN(def);
    let dim = 0;                                                   // 0..1: a dust storm hiding the Sun
    if (tele) { this.flash.visible = false; this.bags.visible = false; this.rock.visible = false; this.dust.visible = false; this.fLand.position.set(0, 0.4, 0); }
    const ground = (b, y) => { const g = b === 'moon' ? this.moonGround : this.marsGround; g.visible = true; g.position.y = y; orbitAt(0.03, 0.5, b); tan = b === 'mars' ? 1 : 0; this.dust.material.color.setHex(b === 'moon' ? 0xb9b6b0 : 0xc99a70); };
    let starDir = null;
    const farDotsSky = (st, u2) => { const sp = this.dots[1]; sp.visible = true; sp.material.color.setHex(0xfff4d8); sp.scale.setScalar(lerp(st[0], st[1], ease(seg(u2, 0.3, 0.75))) / 600); starDir = sp; };
    if (tele) { this.arm.visible = false; this.upper.visible = true; const f = def.fold; this.model.scale.set(f ? f[0] : 1, 1, f ? f[1] : 1); this.model.position.y = 0; }
    // a far-away backdrop: the spacecraft sits at P, bright dots (Sun, Earth, stars) are put behind it
    const farDots = (list, dist, side) => {
      body = 'none'; P.set(1e6, 2e5, 3e5); th = 0; behind(dist, dist * 0.18, side);
      const n = P.clone().normalize().negate(), sd = new THREE.Vector3().crossVectors(Yax, n).normalize();
      (list || []).forEach((dd, i) => { const sp = this.dots[i]; if (!sp) return; sp.visible = true; sp.material.color.setHex(dd[0]); sp.scale.setScalar(dd[1] / 600 * (0.9 + 0.1 * Math.sin(now * 2 + i))); sp.userData.dir = n.clone().addScaledVector(sd, dd[2] + 0.06).addScaledVector(Yax, dd[3] + 0.05).normalize(); });
    };
    const top = R.coreH + 1 + R.centH;
    // camera that keeps a far planet behind the spacecraft: the spacecraft is at P, the planet at the origin
    const behind = (dist, up, side) => { const n = P.clone().normalize(), t = new THREE.Vector3().crossVectors(Yax, n).normalize(); camPos.copy(n).multiplyScalar(dist).addScaledVector(t, side).add(new THREE.Vector3(0, up, 0)); look.set(0, 0, 0); };

    if (kind === 'liftoff') {
      onStack(); const t = Math.max(0, s), alt = 0.5 * 3.4 * t * t; sky = 1;
      this.padGround.visible = this.padDeck.visible = this.tower.visible = true;
      this.padGround.position.y = -alt - 10; this.padDeck.position.y = -alt - 5; this.tower.position.set(-R.coreR - R.srb.r * 2 - 9, -alt, 0);
      const k = s < -2.5 ? 0 : clamp((s + 2.5) / 2.5) * lerp(0.25, 1, clamp(alt / 160));
      burn(this.fMain, k); for (const g of this.srbs) burn(g.userData.f, s < 0 ? 0 : lerp(0.3, 1, clamp(alt / 160)));
      this._smoke(s + 3, -alt - 8);
      const a = ease(u); camPos.set(lerp(140, 300, a), lerp(-alt + 8, 30, a), lerp(190, 250, a)); look.set(0, lerp(28, 20, a), 0); fov = lerp(46, 40, a);
      P.set(0, RAD.earth + alt / 1000, 0);
    } else if (kind === 'boosters') {
      onStack(); const alt = lerp(9, 52, u); stack.rotation.z = -lerp(0.15, 0.75, ease(u)); orbitAt(alt, u * 0.01); sky = clamp(1 - (alt - 12) / 30);
      burn(this.fMain, 1.3 + u * 0.6);
      const sp = seg(u, 0.42, 1);
      for (const g of this.srbs) { burn(g.userData.f, u < 0.38 ? 1.2 : 0); const a = g.userData.a; g.position.set(g.userData.x + Math.cos(a) * sp * 55, 0.5 - sp * sp * 260, g.userData.z + Math.sin(a) * sp * 55); g.rotation.set(Math.sin(a) * sp * 0.9, 0, -Math.cos(a) * sp * 0.9); }
      if (R.shuttle) { const g = this.srbs[0]; g.position.set(0, -sp * sp * 230, -sp * 26); g.rotation.set(sp * 0.35, 0, 0); }
      camPos.set(lerp(110, 170, u), lerp(-70, -20, u), lerp(190, 160, u)); look.set(lerp(12, 0, sp), lerp(22, 0, sp), 0); fov = 44;
    } else if (kind === 'fairing') {
      onStack(); stack.rotation.z = -1.25; orbitAt(lerp(110, 170, u), 0.03 + u * 0.01);
      const o = seg(u, 0.1, 0.55), d = seg(u, 0.6, 1);
      for (const g of this.srbs) g.visible = false;
      for (const g of this.fair) { const q = g.userData.s; g.position.set(0, -o * o * 90, q * o * 46); g.rotation.x = q * o * 1.1; g.visible = o < 0.995; }
      if (!cap) craft.visible = o > 0.55;
      if (tele) this.model.position.y = def.stackY || 0;
      burn(this.fMain, u < 0.56 ? 1.6 * (1 - seg(u, 0.5, 0.56)) : 0);
      first.position.y = -d * d * 240; first.rotation.z = d * 0.25;
      burn(this.fCent, seg(u, 0.7, 0.78));
      const a = seg(u, 0, 1); camPos.set(lerp(40, 70, a), lerp(70, 55, a), lerp(60, 70, a)); look.set(top * 0.9, 12, 0); fov = 46;
    } else if (kind === 'depart') {
      onStack(); first.visible = false; for (const g of this.fair) g.visible = false; craft.visible = true;
      if (tele) this.model.position.y = def.stackY || 0;
      stack.rotation.z = -Math.PI / 2; const k = ease(u); orbitAt(lerp(190, 5200, k * k), 0.7 + k * 1.3);
      burn(this.fCent, seg(u, 0.04, 0.1) * (1 - seg(u, 0.4, 0.46)));
      const sp = ease(seg(u, 0.56, 1));
      craft.position.y = sp * 34; upper.position.y = -sp * 14;
      if (cap) craft.rotation.y = now * 0.21;
      const cx = top + 3 + sp * 34;
      camPos.set(cx + lerp(-34, 16, k), lerp(16, 9, k), lerp(46, cap ? 24 : 40, k)); look.set(lerp(top - 3, cx, seg(u, 0.4, 0.8)), 0, 0); fov = 48;
    } else if (kind === 'tank') {
      // the shuttle after its engines stop: the tank drifts away below
      onStack(); stack.rotation.z = -1.35; orbitAt(lerp(108, 116, u), 0.3 + u * 0.02);
      for (const g of this.srbs) g.visible = false;
      burn(this.fMain, 1.2 * (1 - seg(u, 0.12, 0.2)));
      const d = ease(seg(u, 0.3, 1)); first.position.set(0, -d * 30, -d * 46); first.rotation.x = d * 0.5;
      camPos.set(lerp(70, 96, u), lerp(52, 40, u), lerp(96, 120, u)); look.set(26, lerp(4, -4, d), 0); fov = 46;
    } else if (kind === 'deploy') {
      // the orbiter with its payload bay to the sky; the telescope is lifted out on the arm and let go
      stack.visible = true; first.visible = false; for (const g of this.srbs) g.visible = false;
      stack.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2));
      orbitAt(opt.service ? 590 : 612, 0.4 + u * 0.5);
      craft.visible = true; this.model.scale.set(1, 1, 1);
      const bayX = 21, bayY = 6.4;
      if (opt.service) {
        const go = ease(seg(u, 0.62, 1)); craft.position.set(13 + go * 6, bayY + 6.7 + go * go * 46, go * 8); craft.rotation.set(0, u * 0.4, go * 0.25);
      } else {
        const up = ease(seg(u, 0.05, 0.5)), go = ease(seg(u, 0.6, 1));
        craft.position.set(bayX - 2, bayY + 2.6 + up * 13 + go * go * 40, go * 10); craft.rotation.set(go * 0.3, 0, -Math.PI / 2 + up * 0.5 + go * 0.4);
        this.arm.visible = go < 0.02;
        const a = this.arm.geometry.attributes.position; a.setXYZ(0, bayX + 13, bayY - 0.4, 2.2); a.setXYZ(1, bayX + 6, bayY + 4 + up * 7, 3.2); a.setXYZ(2, craft.position.x + 1.5, craft.position.y - 1.6, 1.6); a.needsUpdate = true;
      }
      const a = -0.55 + u * 0.8; camPos.set(bayX - 6 + Math.sin(a) * 74, lerp(22, 30, u), Math.cos(a) * 74); look.set(bayX - 6, bayY + 3 + ease(seg(u, 0.55, 1)) * 9, 0); fov = 46;
      if (opt.star) { farDotsSky(opt.star, u); }
    } else if (kind === 'scope') {
      // the telescope by itself: over the Earth (opt.alt) or far out in space, with labels or a simple unfolding
      craft.visible = true; const dist = opt.dist || 30;
      { const tl = def.tilt || [0.3, 0, 0.2]; craft.rotation.set(tl[0], tl[1] + 0.5 + u * (opt.labels ? 0.5 : 0.9), tl[2]); }
      if (opt.unfold) { const f = def.fold, kz = ease(seg(u, 0.08, 0.4)), kx = ease(seg(u, 0.42, 0.78)); this.model.scale.set(lerp(f[0], 1, kx), 1, lerp(f[1], 1, kz)); }
      else this.model.scale.set(1, 1, 1);
      if (opt.alt) {
        orbitAt(opt.alt, 0.3 + u * 0.6); const a = -0.5 + u * 1.0;
        camPos.set(Math.sin(a) * dist, dist * 0.42, Math.cos(a) * dist); look.set(0, 0, 0); fov = 44;
      } else { farDots(opt.dots, dist, lerp(-dist * 0.4, dist * 0.4, u)); fov = 44; }
      if (opt.star) farDotsSky(opt.star, u);
      if (opt.ion) { this.fIon.position.set(0, -1.2, 0); burn(this.fIon, 0.8 + 0.2 * Math.sin(now * 3)); }
    } else if (kind === 'retro' || kind === 'still') {
      // a lander comes down on its rockets (retro), then a slow look around it where it stands (still)
      const B = opt.body || 'mars', D = opt.dist || 13;
      if (kind === 'retro') {
        const k = ease(seg(u, 0, 0.74)), alt = lerp(opt.h0 || 80, 0, k), down = u >= 0.74;
        ground(B, -alt); craft.visible = true;
        this.fLand.position.y = opt.fy == null ? 0.5 : opt.fy; burn(this.fLand, down ? 0 : (0.75 + 0.35 * (1 - k)) * (opt.fk || 1));
        this._dust(-alt, clamp(1 - alt / 24) * (1 - seg(u, 0.76, 0.95)), now, B === 'moon' ? 0.75 : 0.5);
        craft.rotation.z = Math.sin(u * 9) * 0.035 * (1 - k); craft.rotation.x = Math.cos(u * 7) * 0.03 * (1 - k);
        const a = lerp(1.0, 0.3, ease(u)); camPos.set(Math.sin(a) * D, lerp(D * 0.55, D * 0.17, k), Math.cos(a) * D); look.set(0, opt.lookY == null ? 1.2 : opt.lookY, 0); fov = 46;
      } else {
        ground(B, 0); craft.visible = true;
        const a = 0.3 + u * 1.5; camPos.set(Math.sin(a) * D, D * 0.2 + Math.sin(u * 3) * 0.4, Math.cos(a) * D); look.set(0, opt.lookY == null ? 1.2 : opt.lookY, 0); fov = 44;
      }
    } else if (kind === 'bounce') {
      // airbags: hit, bounce, roll, then deflate and open
      const r = 2.7, ub = seg(u, 0, 0.66), h = 17 * Math.abs(Math.cos(ub * Math.PI * 4.5)) * Math.pow(1 - ub, 1.5), open = ease(seg(u, 0.68, 0.86));
      ground('mars', -h * (1 - open));
      this.bags.visible = open < 0.98; this.bags.position.set(0, lerp(r, 0.25, open), 0); this.bags.scale.set(1 - open * 0.25, 1 - open * 0.93, 1 - open * 0.25);
      this.bags.rotation.set(ub * 6.5 * (1 - open), 0, -ub * 13 * (1 - open));
      craft.visible = open > 0.35; craft.scale.setScalar(lerp(0.7, 1, seg(open, 0.35, 1)));
      this._dust(-h, h < 1.6 && ub < 0.99 ? 0.85 : 0, now, 0.6);
      camPos.set(lerp(30, 12, open), lerp(8, 3.4, open), lerp(38, 14, open)); look.set(0, lerp(r + h * 0.4, 1.0, open), 0); fov = 46;
    } else if (kind === 'impact') {
      // on purpose, at full speed: a glint in the sky, a flash, and a cloud of dust that hangs in the low gravity
      const hit = 0.5, k = seg(u, 0, hit), after = seg(u, hit, 1), p = 1 - k * k;
      ground(opt.body || 'moon', 0);
      craft.visible = u < hit; craft.position.set(-p * 560, p * 330 + 1.5, -p * 170); craft.rotation.set(0.3, 0, 1.05 + u);
      const f = this.flash; f.visible = true; f.material.color.setHex(u < hit ? 0xfff6e0 : 0xffe2a8);
      if (u < hit) { f.position.copy(craft.position); f.scale.setScalar(9 + 5 * Math.sin(now * 30)); f.material.opacity = 0.9; }
      else { f.position.set(0, 6, 0); f.scale.setScalar(lerp(40, 260, Math.pow(after, 0.35))); f.material.opacity = Math.pow(1 - after, 2.2); }
      { // the plume: dust thrown up and outward
        const a = this.dust.geometry.attributes.position, tt = after * 9; this.dust.visible = after > 0;
        for (let i = 0; i < this.seed.length; i++) { const [ang, sp, ph, hh] = this.seed[i], rr = (6 + sp * 34) * tt * (0.4 + ph), y = Math.max(0, (18 + hh * 46) * tt - 1.3 * tt * tt * (0.6 + sp)); a.setXYZ(i, Math.cos(ang) * rr, y, Math.sin(ang) * rr); }
        a.needsUpdate = true; this.dust.material.opacity = 0.42 * (1 - after * 0.8); this.dust.material.size = 4 + after * 9;
      }
      camPos.set(lerp(95, 120, u), lerp(20, 34, after), lerp(150, 190, after)); look.set(lerp(-60, 0, seg(u, 0.15, hit)), lerp(70, 14, seg(u, 0.15, hit)) + after * 26, 0); fov = 50;
    } else if (kind === 'storm') {
      ground('mars', 0); craft.visible = true; dim = ease(seg(u, 0.12, 0.85));
      this._dust(0, 0.5 + dim * 0.5, now, 1.5 + dim * 2.5); this.dust.material.size = 9 + dim * 22; this.dust.material.opacity = 0.25 + dim * 0.4;
      const a = 0.6 + u * 0.7; camPos.set(Math.sin(a) * 9, 2.6, Math.cos(a) * 9); look.set(0, 1.0, 0); fov = 46;
    } else if (kind === 'asteroid') {
      // a slow fall onto a small world with almost no gravity
      body = 'none'; P.set(1e6, 2e5, 3e5); th = 0; craft.visible = true;
      const k = ease(seg(u, 0, 0.8)), alt = lerp(opt.h0 || 260, 0.9, k);
      this.rock.visible = true; this.rock.position.set(0, -alt - this.rockR, 0); this.rock.rotation.y = 0.4 + u * 0.05;
      const a = 0.5 + u * 0.6, D = lerp(46, 15, k); camPos.set(Math.sin(a) * D, lerp(16, 4.2, k), Math.cos(a) * D); look.set(0, lerp(-alt * 0.35, 0.6, k), 0); fov = 46;
      const sp = this.dots[0]; sp.visible = true; sp.material.color.setHex(0xfff2c8); sp.scale.setScalar(22 / 600); sp.userData.dir = SUN.clone();
    } else if (kind === 'dots' || kind === 'flyby') {
      craft.visible = true; body = 'none';
      craft.rotation.set(0.5, opt.slow ? now * 0.02 : 0.6 + u * 0.4, 0.15);
      if (kind === 'flyby') {
        const Rp = RAD[opt.planet], k = ease(u); body = opt.planet;
        P.set(lerp(-3.4, 2.4, k) * Rp, lerp(0.35, 1.0, k) * Rp, lerp(2.6, 1.7, Math.sin(Math.PI * k)) * Rp); th = 0;
        if (opt.plunge) {      // no way back: it dives into the planet and burns up like a meteor
          P.set(lerp(-2.6, -0.75, k) * Rp, lerp(0.9, 0.55, k) * Rp, lerp(2.4, 0.45, k) * Rp);
          const g = seg(u, 0.55, 0.9); this.flash.visible = g > 0.01; this.flash.position.set(0, 0, 0); this.flash.material.color.setHex(0xffa860); this.flash.material.opacity = g; this.flash.scale.setScalar(5 + g * 34);
          craft.scale.setScalar(1 - ease(seg(u, 0.86, 1)));
        }
        if (opt.burn && tele) { this.fLand.position.set(0, -1.5, 0); burn(this.fLand, seg(u, 0.22, 0.3) * (1 - seg(u, 0.74, 0.82)) * 1.4); }
        behind(opt.dist || 34, 7, lerp(-10, 10, u)); fov = 50;
      } else {
        P.set(1e6, 2e5, 3e5); th = 0; behind(opt.slow ? lerp(30, 44, u) : 34, 6, lerp(-12, 12, u)); fov = 46;
        const n = P.clone().normalize().negate(), side = new THREE.Vector3().crossVectors(Yax, n).normalize();
        (opt.dots || []).forEach((dd, i) => { const sp = this.dots[i]; sp.visible = true; sp.material.color.setHex(dd[0]); sp.scale.setScalar(dd[1] / 600 * (0.9 + 0.1 * Math.sin(now * 2 + i))); sp.userData.dir = n.clone().addScaledVector(side, dd[2] + 0.06).addScaledVector(Yax, dd[3] + 0.05).normalize(); });
      }
    } else if (kind === 'cruise') {
      craft.visible = true; body = 'mars'; const k = ease(u);
      P.set(lerp(-90000, -14000, k), lerp(9000, 2600, k), lerp(16000, 4200, k)); th = 0;
      craft.quaternion.setFromUnitVectors(Yax, P.clone().normalize().negate()).multiply(new THREE.Quaternion().setFromAxisAngle(Yax, now * 0.21));
      behind(17, 5, lerp(-7, 7, u)); look.set(0, 0.8, 0); fov = 46;
    } else if (kind === 'entry') {
      craft.visible = true; orbitAt(lerp(200, 28, u * u), lerp(1.0, 0.55, u), 'mars'); tan = seg(u, 0.75, 1) * 0.25;
      craft.rotation.z = -(Math.PI / 2 + lerp(0.1, 0.45, u));
      const cs = seg(u, 0.06, 0.4); this.cruise.position.y = -cs * 70; this.cruise.visible = cs < 0.99;
      const g = seg(u, 0.5, 0.68) * (1 - seg(u, 0.93, 1));
      this.entryGlow.visible = g > 0.01; this.entryGlow.scale.setScalar(4 + g * 13); this.entryGlow.material.opacity = g;
      burn(this.fTrail, g * 0.5); this.fTrail.position.y = 0.4;
      camPos.set(lerp(-16, -9, u), lerp(9, 5, u), lerp(26, 20, u)); look.set(1, 0, 0); fov = 48;
    } else if (kind === 'chute') {
      craft.visible = true; const alt = lerp(11000, 1700, u); orbitAt(alt / 1000, 0.5, 'mars'); tan = 0.55;
      this.cruise.visible = false; craft.rotation.set(Math.PI + Math.sin(now * 1.3) * 0.05, 0, Math.sin(now * 0.9) * 0.06);
      const o = ease(seg(u, 0.02, 0.2)), rr = (def.rover === 'm2020' ? 21.5 : 16) / 2;
      this.chute.visible = o > 0.01; this.canopy.scale.set(rr * o + 0.3, rr * 0.75 * o + 0.3, rr * o + 0.3); this.lines.scale.set(rr * o + 0.3, 1, rr * o + 0.3);
      const hs = seg(u, 0.4, 1); this.heat.position.set(hs * 30, 2.3 + hs * hs * 700, 0); this.heat.rotation.z = hs * 2.5;
      this.lander.visible = hs > 0; this.lander.position.set(0, -0.9, 0); this.rover.position.y = -(this.roverH + 0.1);
      this.lander.scale.setScalar(0.62);      // folded inside the capsule
      this.marsGround.visible = true; this.marsGround.position.y = -alt;
      camPos.set(lerp(20, 13, u), lerp(-13, -9, u), lerp(34, 24, u)); look.set(0, lerp(10, -1, seg(u, 0.25, 0.6)), 0); fov = 52;
    } else if (kind === 'powered') {
      const alt = lerp(1600, 24, ease(u)); orbitAt(alt / 1000, 0.5, 'mars'); tan = lerp(0.6, 0.9, u);
      const b = seg(u, 0.02, 0.4);
      craft.visible = b < 0.99; this.cruise.visible = this.heat.visible = false; craft.rotation.x = Math.PI; craft.position.set(-b * 160, 2.6 + b * 260, b * 40);
      this.chute.visible = true; const rr = (def.rover === 'm2020' ? 21.5 : 16) / 2; this.canopy.scale.set(rr, rr * 0.75, rr); this.lines.scale.set(rr, 1, rr);
      this.lander.visible = true; this.lander.scale.setScalar(1); this.lander.rotation.z = lerp(0.3, 0, ease(u)) * Math.sin(u * 5);
      for (const f of this.fEng) burn(f, u > 0.06 ? 1 : 0);
      const gy = -alt - (this.roverH + 0.35); this.marsGround.visible = true; this.marsGround.position.y = gy;
      camPos.set(lerp(13, 10, u), lerp(-5, 1, u), lerp(17, 14, u)); look.set(0, -1.4, 0); fov = 50;
    } else if (kind === 'skycrane') {
      orbitAt(0.02, 0.5, 'mars'); tan = 1; this.lander.visible = true; this.lander.scale.setScalar(1);
      const Lc = opt.cable || 7.5, l = ease(seg(u, 0.08, 0.45)) * Lc, z = lerp(20, 0, ease(seg(u, 0, 0.68))), down = u >= 0.68, fa = seg(u, 0.76, 1);
      const ry = -(this.roverH + 0.35) - l; this.rover.position.y = ry;
      this.marsGround.visible = true; this.marsGround.position.y = ry - z;
      this.dstage.position.set(fa * fa * 260, fa * 150, -fa * 40); this.dstage.rotation.z = -fa * 0.5;
      for (let k = 0; k < 4; k++) burn(this.fEng[k], 1);
      for (let k = 1; k < 4; k += 2) this.fEng[k].visible = u < 0.1;                      // four of the eight engines shut off before the rover is lowered
      this.cables.visible = l > 0.05 && u < 0.73;
      if (this.cables.visible) { const a = this.cables.geometry.attributes.position, yt = ry + this.roverH * 0.62; [[0.5, 0.5], [-0.5, 0.5], [0, -0.6]].forEach(([x, zz], k) => { a.setXYZ(k * 2, x * 0.6, -0.25, zz * 0.6); a.setXYZ(k * 2 + 1, x, yt, zz); }); a.needsUpdate = true; }
      this._dust(ry - z, clamp(1 - z / 16) * (1 - seg(u, 0.8, 0.95)), now);
      const cy = ry + 1.2; camPos.set(lerp(15, 11, ease(u)) + fa * 8, lerp(cy + 6, cy + 0.6, ease(seg(u, 0, 0.7))) + fa * 5, lerp(22, 15, ease(u))); look.set(fa * 6, lerp(cy + 3, cy, seg(u, 0.3, 0.7)) + fa * 5, 0); fov = 48;
    } else if (kind === 'parts' || kind === 'heli') {
      orbitAt(0.002, 0.5, 'mars'); tan = 1; this.lander.visible = true; this.lander.scale.setScalar(1); this.dstage.visible = false;
      this.rover.position.y = 0; this.marsGround.visible = true; this.marsGround.position.y = 0;
      if (kind === 'parts') {
        const e = Math.sin(Math.PI * seg(u, 0.3, 0.98)) ** 2 * (opt.explode || 0.4);
        for (const p of this.pieces) p.position.copy(p.userData.p0).addScaledVector(p.userData.d, e);
        const a = 0.5 + u * 2.6; camPos.set(Math.sin(a) * 7.4, 3.0 + Math.sin(u * 3) * 0.6, Math.cos(a) * 7.4); look.set(0, 1.0, 0); fov = 44;
      } else {
        const back = ease(seg(u, 0.14, 0.42)) * 9, up = ease(seg(u, 0.5, 0.62)) * (1 - ease(seg(u, 0.88, 0.99))) * 3;
        this.rover.position.z = -back; this.heli.visible = true; this.heli.position.set(0, up, 0.15); this.heli.rotation.y = 0.6;
        this.disc.visible = u > 0.46; this.disc.material.opacity = 0.1 + 0.14 * Math.abs(Math.sin(now * 30));
        this._dust(0, up > 0.01 && up < 1.2 ? 0.5 : 0, now, 0.25);
        const a = 0.9 - u * 0.9; camPos.set(Math.sin(a) * lerp(6.5, 4.6, u), lerp(1.6, 1.3, u) + up * 0.5, Math.cos(a) * lerp(6.5, 4.6, u)); look.set(0, 0.35 + up, lerp(-1.2, 0.15, seg(u, 0, 0.45))); fov = 42;
      }
    }
    if (cap && kind !== 'chute') this.lander.scale.setScalar(1);
    // ---- cameras
    cam.position.copy(camPos); cam.fov = fov; cam.lookAt(look); cam.updateProjectionMatrix();
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -th).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tilt));
    const bc = this.bgCam; bc.fov = fov;
    bc.position.copy(camPos).multiplyScalar(0.001).applyQuaternion(q).add(P);
    bc.quaternion.copy(q).multiply(cam.quaternion);
    const dist = bc.position.length(), Rb = RAD[body] || 0;
    bc.near = Math.max(0.0005, (dist - Rb) * 0.25); bc.far = Math.max(1e5, dist * 4 + Rb * 4); bc.updateProjectionMatrix();
    if (this.planets[body]) this.planets[body].visible = tan < 0.97;
    this.air.visible = body === 'earth' && sky < 0.999;
    const sunL = SUN.clone().applyQuaternion(q.clone().invert());
    this.sunF.position.copy(sunL).multiplyScalar(1000); this.sunF.target.position.set(0, 0, 0);
    // sky: blue on Earth's ground, butterscotch near the ground of Mars, black in space
    this.bg.background.setRGB(0.36 * sky + 0.62 * tan, 0.6 * sky + 0.47 * tan, 0.92 * sky + 0.33 * tan).multiplyScalar(1 - 0.8 * dim);
    this.sunF.intensity = 3.0 * (1 - 0.88 * dim);
    this.stars.material.opacity = clamp(1 - sky - tan * 1.2); this.stars.position.copy(bc.position);
    if (starDir) starDir.userData.dir = new THREE.Vector3(-0.42, 0.3, -1).normalize().applyQuaternion(bc.quaternion);      // upper left of the picture
    for (const sp of this.dots) if (sp.visible) sp.position.copy(bc.position).addScaledVector(sp.userData.dir, bc.near * 3);
    this.hemi.intensity = 0.5 + 0.4 * sky + 0.35 * tan + (tele ? 0.45 : 0) - 0.5 * dim;
  }

  _smoke(t, y) {
    const on = t > 1.5; this.smoke.visible = on; if (!on) return;
    const a = this.smoke.geometry.attributes.position, tt = t - 1.5;
    for (let i = 0; i < this.seed.length; i++) { const [ang, sp, ph, hh] = this.seed[i], age = Math.max(0, tt - ph * 4), r = 14 + sp * 130 * Math.pow(age, 0.55); a.setXYZ(i, Math.cos(ang) * r, y + 6 + hh * 18 * Math.pow(age, 0.6), Math.sin(ang) * r); }
    a.needsUpdate = true; this.smoke.material.opacity = clamp(tt / 3) * 0.5; this.smoke.material.size = 45 + tt * 4;
  }
  _dust(y, k, now, scale = 1) {
    this.dust.visible = k > 0.02; if (!this.dust.visible) return;
    const a = this.dust.geometry.attributes.position;
    for (let i = 0; i < this.seed.length; i++) { const [ang, sp, ph] = this.seed[i], r = (2 + ((now * (0.6 + sp) + ph * 9) % 1) * 30 * sp) * scale; a.setXYZ(i, Math.cos(ang) * r, y + 0.15 + r * 0.02, Math.sin(ang) * r); }
    a.needsUpdate = true; this.dust.material.opacity = 0.34 * k; this.dust.material.size = 6 * scale;
  }
}
