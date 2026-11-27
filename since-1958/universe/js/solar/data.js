// Facts and orbital data for every body in the scene.
//
// Sources
//   Orbits: JPL "Approximate Positions of the Planets", Table 1 (Keplerian
//           elements at J2000 and their rates per century, valid 1800-2050).
//           https://ssd.jpl.nasa.gov/planets/approx_pos.html
//   Facts:  NASA Planetary Fact Sheet (metric) and Sun Fact Sheet.
//           https://nssdc.gsfc.nasa.gov/planetary/factsheet/
//   Poles and spin: IAU Working Group on Cartographic Coordinates and
//           Rotational Elements (north pole right ascension/declination, and
//           the prime meridian angle W = W0 + rate * days since J2000).
//
// el / rate = [a (au), e, I (deg), L (deg), longitude of perihelion (deg),
//              longitude of ascending node (deg)]

export const AU_KM = 149597870.7;
export const GM_SUN = 1.32712440018e11;   // km^3 / s^2
export const LIGHT_KM_S = 299792.458;
export const G = 6.674e-11;               // N m^2 / kg^2

export const BODIES = [
  {
    id: 'sun', name: 'Sun', kind: 'Star', colour: '#ffc46b',
    radiusKm: 695700, pole: [286.13, 63.87], spin: [84.176, 14.1844],
    tagline: 'The star at the centre. It holds about 99.8% of the mass of the Solar System.',
    facts: { diameter: 1391400, mass24: 1988400, gravity: 274.0, rotationHours: 609.12, tempLabel: '5,500 °C at the surface' },
    exam: [
      ['IGCSE', 'The Sun is a star of medium size, made mostly of hydrogen and helium.'],
      ['IGCSE', 'It radiates most of its energy as infrared, visible light and ultraviolet.'],
      ['IGCSE', 'Stars are powered by nuclear reactions that release energy. In a stable star like the Sun, hydrogen nuclei fuse into helium.'],
      ['IGCSE', 'The Sun contains most of the mass of the Solar System, so its gravitational attraction keeps the planets in orbit.'],
      ['IGCSE', 'Accretion model: gravity pulled a rotating cloud of gas and dust into a disc. Rocky planets formed near the hot Sun, gas giants further out.'],
    ],
  },
  {
    id: 'mercury', name: 'Mercury', kind: 'Rocky planet', order: 1, colour: '#b9b0a2',
    radiusKm: 2439.7, pole: [281.0103, 61.4155], spin: [329.5988, 6.1385108],
    el: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
    rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    tagline: 'The smallest planet and the fastest. Its stretched orbit makes its speed change the most.',
    facts: { diameter: 4879, mass24: 0.330, gravity: 3.7, rotationHours: 1407.6, dayHours: 4222.6, distance: 57.9, periodDays: 88.0, velocity: 47.4, tilt: 0.034, tempC: 167, moons: 0 },
    exam: [
      ['IGCSE', 'One of the four inner planets: small and rocky.'],
      ['IGCSE', 'Orbits are ellipses with the Sun not at the centre. Mercury moves fastest when it is closest to the Sun, because gravitational potential energy has been transferred to kinetic energy.'],
      ['IGCSE', 'No atmosphere to trap energy, so the night side is far colder than the day side.'],
    ],
  },
  {
    id: 'venus', name: 'Venus', kind: 'Rocky planet', order: 2, colour: '#ecd9a6',
    radiusKm: 6051.8, pole: [272.76, 67.16], spin: [160.20, -1.4813688],
    el: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
    rate: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    tagline: 'Wrapped in thick cloud. It spins backwards, and so slowly that one rotation outlasts its year.',
    facts: { diameter: 12104, mass24: 4.87, gravity: 8.9, rotationHours: -5832.5, dayHours: 2802.0, distance: 108.2, periodDays: 224.7, velocity: 35.0, tilt: 177.4, tempC: 464, moons: 0 },
    exam: [
      ['IGCSE', 'An inner planet: small and rocky, almost the same size as Earth.'],
      ['IGCSE', 'Its orbit is the closest to a perfect circle of any planet, so its orbital speed barely changes.'],
      ['IGCSE', 'The hottest planet even though Mercury is nearer the Sun: its dense carbon dioxide atmosphere traps infrared radiation.'],
    ],
  },
  {
    id: 'earth', name: 'Earth', kind: 'Rocky planet', order: 3, colour: '#6fa8ff',
    radiusKm: 6371.0, pole: [0, 90], spin: [190.4606, 360.9856235],
    el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
    rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    tagline: 'Home. The day and night line you see here is where it really is at the date shown.',
    facts: { diameter: 12756, mass24: 5.97, gravity: 9.8, rotationHours: 23.9, dayHours: 24.0, distance: 149.6, periodDays: 365.2, velocity: 29.8, tilt: 23.4, tempC: 15, moons: 1 },
    exam: [
      ['IGCSE', 'The Earth rotates on its tilted axis once in about 24 hours. This causes day and night and the apparent daily motion of the Sun.'],
      ['IGCSE', 'The Earth orbits the Sun once in about 365 days. The tilt of the axis combined with this orbit causes the seasons.'],
      ['IGCSE', 'Light from the Sun takes about 500 s (8.3 minutes) to reach the Earth.'],
    ],
  },
  {
    id: 'moon', name: 'Moon', kind: 'Natural satellite', parent: 'earth', colour: '#d6d6d2',
    radiusKm: 1737.4, pole: [269.9949, 66.5392], spin: [38.3213, 13.17635815],
    tagline: 'Earth’s natural satellite. It always keeps the same face toward us.',
    facts: { diameter: 3475, mass24: 0.073, gravity: 1.6, rotationHours: 655.7, dayHours: 708.7, distanceFromParent: 0.384, periodDays: 27.3, velocity: 1.0, tilt: 6.7, tempC: -20 },
    exam: [
      ['IGCSE', 'The Moon takes about one month to orbit the Earth. That is why its cycle of phases repeats about once a month.'],
      ['IGCSE', 'The Moon does not make light. We see the part of its sunlit half that faces the Earth, so the phase depends on where it is in its orbit.'],
      ['IGCSE', 'A moon is a natural satellite: an object held in orbit around a planet by gravitational attraction.'],
    ],
  },
  {
    id: 'mars', name: 'Mars', kind: 'Rocky planet', order: 4, colour: '#e0714a',
    radiusKm: 3389.5, pole: [317.68143, 52.88650], spin: [176.630, 350.89198226],
    el: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    tagline: 'The red planet. Rusty dust, polar ice caps and a day only 40 minutes longer than ours.',
    facts: { diameter: 6792, mass24: 0.642, gravity: 3.7, rotationHours: 24.6, dayHours: 24.7, distance: 228.0, periodDays: 687.0, velocity: 24.1, tilt: 25.2, tempC: -65, moons: 2 },
    exam: [
      ['IGCSE', 'The outermost of the four small, rocky inner planets.'],
      ['IGCSE', 'Its axis is tilted by 25.2°, close to Earth’s 23.4°, so Mars has seasons too.'],
      ['IGCSE', 'Further from the Sun than Earth, so the Sun’s gravitational field is weaker there and Mars orbits more slowly.'],
    ],
  },
  {
    id: 'jupiter', name: 'Jupiter', kind: 'Gas giant', order: 5, colour: '#d9b48a',
    radiusKm: 71492, oblate: 0.935, pole: [268.056595, 64.495303], spin: [284.95, 870.5360000],
    el: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    tagline: 'The giant. More than twice the mass of all the other planets put together.',
    facts: { diameter: 142984, mass24: 1898, gravity: 23.1, rotationHours: 9.9, dayHours: 9.9, distance: 778.5, periodDays: 4331, velocity: 13.1, tilt: 3.1, tempC: -110, moons: 95 },
    exam: [
      ['IGCSE', 'One of the four outer planets: large and gaseous.'],
      ['IGCSE', 'The strength of the gravitational field at a planet’s surface depends on the mass of the planet. Jupiter’s is the strongest of any planet.'],
      ['IGCSE', 'The Great Red Spot is a storm wider than the Earth.'],
    ],
  },
  {
    id: 'saturn', name: 'Saturn', kind: 'Gas giant', order: 6, colour: '#ead7a0',
    radiusKm: 60268, oblate: 0.902, pole: [40.589, 83.537], spin: [38.90, 810.7939024],
    el: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    rate: [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    tagline: 'The ringed planet. Its rings are countless pieces of ice and rock, each one in its own orbit.',
    facts: { diameter: 120536, mass24: 568, gravity: 9.0, rotationHours: 10.7, dayHours: 10.7, distance: 1432.0, periodDays: 10747, velocity: 9.7, tilt: 26.7, tempC: -140, moons: 274 },
    exam: [
      ['IGCSE', 'An outer planet: large and gaseous.'],
      ['IGCSE', 'Each piece of a ring is a tiny natural satellite held in orbit by Saturn’s gravity.'],
      ['IGCSE', 'The least dense planet: 687 kg/m³, less than water.'],
    ],
  },
  {
    id: 'uranus', name: 'Uranus', kind: 'Ice giant', order: 7, colour: '#a6e4e8',
    radiusKm: 25559, oblate: 0.977, pole: [257.311, -15.175], spin: [203.81, -501.1600928],
    el: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503],
    rate: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
    tagline: 'Tipped right over. It rolls around the Sun on its side, with faint dark rings.',
    facts: { diameter: 51118, mass24: 86.8, gravity: 8.7, rotationHours: -17.2, dayHours: 17.2, distance: 2867.0, periodDays: 30589, velocity: 6.8, tilt: 97.8, tempC: -195, moons: 28 },
    exam: [
      ['IGCSE', 'An outer planet: large and gaseous.'],
      ['IGCSE', 'Its axis is tilted by 97.8°, so each pole spends about 42 years in sunlight and then 42 in darkness.'],
      ['IGCSE', 'Orbital speed decreases with distance from the Sun: Uranus moves at only 6.8 km/s.'],
    ],
  },
  {
    id: 'neptune', name: 'Neptune', kind: 'Ice giant', order: 8, colour: '#6f95ff',
    radiusKm: 24764, oblate: 0.983, pole: [299.33, 42.95], spin: [249.978, 541.1397757],
    el: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rate: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
    tagline: 'The outermost planet. Deep blue, bitterly cold, and the slowest to circle the Sun.',
    facts: { diameter: 49528, mass24: 102, gravity: 11.0, rotationHours: 16.1, dayHours: 16.1, distance: 4515.0, periodDays: 59800, velocity: 5.4, tilt: 28.3, tempC: -200, moons: 16 },
    exam: [
      ['IGCSE', 'The furthest of the eight planets: large and gaseous.'],
      ['IGCSE', 'The Sun’s gravitational field is weakest here, so Neptune has the lowest orbital speed and the longest orbital period.'],
      ['IGCSE', 'Light from the Sun takes about four hours to arrive.'],
    ],
  },
];

export const byId = Object.fromEntries(BODIES.map(b => [b.id, b]));
