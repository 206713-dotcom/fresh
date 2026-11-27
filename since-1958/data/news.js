// The biggest moments of the story, told as news. Each one is tied to an event on the timeline (same time stamp).
// Facts come from the NASA pages listed with each machine. Photos are official releases; the credit is shown under each one.
export const NEWS = [
  {
    t: '1969-07-20T20:17:40Z', head: 'People land on the Moon', kicker: 'Moon · Sea of Tranquility',
    lead: '"The Eagle has landed." Apollo 11\'s lunar module touches down, and for the first time people are on another world.',
    body: [
      'Neil Armstrong and Buzz Aldrin spend about two and a half hours walking outside. They collect about 21.5 kg of rock and soil, the first samples ever brought home from another world, and set up science experiments.',
      'To save weight for the trip home, the lower half of the lunar module stays behind as a launch pad, with the experiments and the equipment the crew no longer needs. It is still standing at Tranquility Base.',
      'One of the things they leave is a mirror. It needs no power, and observatories on Earth still bounce lasers off it today to measure the distance to the Moon.',
    ],
    photos: [{ src: 'news/apollo-bootprint.jpg', cap: 'A bootprint in the dust of the Moon, photographed during Apollo 11. With no wind or rain, marks like this last a very long time.', credit: 'NASA' }],
    glb: 'lmfull', eq: 'apollo11', film: 'apollo11',
  },
  {
    t: '1976-07-20T11:53:06Z', head: 'First pictures from the ground on Mars', kicker: 'Mars · Chryse Planitia',
    lead: 'Viking 1 becomes the first US spacecraft to land safely on Mars and send back pictures from the surface.',
    body: [
      'It was sent to look for signs of life. Its robotic arm scoops up soil for three experiments that look for tiny living things.',
      'The results are puzzling: the soil shows unexpected chemical activity, but there is no clear evidence of living microbes.',
      'Viking 1 works for more than six years. It still sits on Chryse Planitia, the "Golden Plain".',
    ],
    glb: 'viking', eq: 'viking1',
  },
  {
    t: '1979-03-05T12:05:00Z', head: 'Volcanoes found on another world', kicker: 'Jupiter · the moon Io',
    lead: 'Voyager 1 flies past Jupiter. On the moon Io, the Voyagers discover erupting volcanoes: the first active volcanoes ever seen anywhere but Earth.',
    body: [
      'At Jupiter, Voyager 1 also finds a faint ring and two new moons.',
      'Io turns out to be covered in volcanic deposits. The dark spots and rings on this map are volcanoes and what they have thrown out.',
      'Voyager 1 does not stop. It uses Jupiter to pick up speed for Saturn, and it is never coming back.',
    ],
    photos: [{ src: 'news/io-map.jpg', cap: 'A map of the whole surface of Io, put together from spacecraft pictures. The spots are volcanoes.', credit: 'NASA / JPL (from NASA 3D Resources)' }],
    glb: 'voyager', probe: 'voyager1', film: 'voyager1',
  },
  {
    t: '1989-08-25T03:56:00Z', head: 'The only visit to Neptune', kicker: 'Neptune · the moon Triton',
    lead: 'Voyager 2 flies past Neptune, the farthest planet. No other spacecraft has ever been there.',
    body: [
      'At Neptune it discovers five moons, four rings and a "Great Dark Spot". On the frozen moon Triton it sees active geysers.',
      'A rare line-up of the outer planets, which happens only about once every 175 years, let this one spacecraft visit all four giant planets: Jupiter, Saturn, Uranus and Neptune.',
      'After Neptune its path takes it below the plane of the planets and out of the Solar System.',
    ],
    photos: [{ src: 'news/triton.jpg', cap: 'Triton, the largest moon of Neptune, in a mosaic of Voyager 2 pictures.', credit: 'NASA / JPL (from NASA 3D Resources)' }],
    glb: 'voyager', probe: 'voyager2',
  },
  {
    t: '1990-02-14T00:00:00Z', head: 'Earth, seen as a pale blue dot', kicker: 'Voyager 1 · beyond the planets',
    lead: 'Voyager 1 turns its cameras around one last time and takes a "family portrait" of six planets. In it, Earth is a pale blue dot.',
    body: [
      'Voyager 1 passed close to Saturn\'s big moon Titan in 1980. That bent its path up and out of the plane in which the planets orbit, and it has been leaving ever since.',
      'It carries a Golden Record of pictures and sounds from Earth.',
    ],
    glb: 'voyager', probe: 'voyager1',
  },
  {
    t: '1993-12-02T09:27:00Z', head: 'Astronauts fix a telescope in orbit', kicker: 'Earth orbit · Hubble',
    lead: 'Hubble\'s first pictures were blurry, because its main mirror had been polished to slightly the wrong shape. Now astronauts fly up to fix it.',
    body: [
      'The edge of the mirror is too flat by about one-fiftieth of the width of a human hair. The astronauts fit a new camera and a set of small corrective mirrors that work like a pair of glasses.',
      'Hubble was the first telescope built to be serviced in space. Astronauts visited it five times between 1993 and 2009. It was never meant to be brought home, and it is still observing.',
    ],
    glb: 'hst', probe: 'hubble', film: 'hubble',
  },
  {
    t: '1997-07-04T16:56:55Z', head: 'The first rover drives on Mars', kicker: 'Mars · Ares Vallis',
    lead: 'Mars Pathfinder lands wrapped in airbags, bouncing at least 15 times. Then Sojourner, a rover weighing just 10.5 kg, drives off to study the rocks.',
    body: [
      'The landing site is a dry channel carved by huge floods long ago. The findings suggest Mars was once warm and wet.',
      'The last data arrives on 27 September 1997. Sojourner was still working when the lander went quiet, and nobody knows exactly where it stopped.',
    ],
    eq: 'pathfinder',
  },
  {
    t: '2012-08-06T05:18:00Z', head: 'A sky crane lowers Curiosity onto Mars', kicker: 'Mars · Gale crater',
    lead: 'A rocket-powered sky crane lowers the car-sized rover Curiosity into Gale crater on a tether.',
    body: [
      'Curiosity was sent to find out whether Mars ever had the right conditions for microbes, tiny living things. Within eight months it finds evidence of a past environment well suited to them.',
      'On Mount Sharp it finds rock that formed as mud at the bottom of ancient lakes, and organic molecules, the building blocks of life.',
      'Curiosity is still working. It has no way home, so one day it too will stay on Mars for good.',
    ],
    glb: 'msl', eq: 'curiosity', film: 'curiosity',
  },
  {
    t: '2012-08-25T00:00:00Z', head: 'Something made by people reaches the stars', kicker: 'Voyager 1 · interstellar space',
    lead: 'Voyager 1 becomes the first spacecraft to enter interstellar space, the space between the stars.',
    body: [
      'It launched in 1977 to study Jupiter and Saturn. It has been flying outward ever since, and no spacecraft has gone farther.',
      'It still sends data home, and it will never come back.',
    ],
    glb: 'voyager', probe: 'voyager1', film: 'voyager1',
  },
  {
    t: '2015-07-14T11:49:00Z', head: 'Pluto, seen up close for the first time', kicker: 'Pluto · Kuiper Belt',
    lead: 'After more than nine years of flight, New Horizons passes about 12,500 km above the surface of Pluto.',
    body: [
      'Its pictures show rugged mountains of ice and flat ice plains.',
      'It is a flyby mission: it passes Pluto without stopping and keeps going, out through the Kuiper Belt.',
    ],
    probe: 'newhorizons',
  },
  {
    t: '2021-02-18T20:55:00Z', head: 'Perseverance lands in an ancient lake', kicker: 'Mars · Jezero crater',
    lead: 'The rover Perseverance lands in Jezero crater, which once held a lake with a river delta. Its sky crane flies away and crashes, as designed.',
    body: [
      'Perseverance looks for signs of ancient life and seals samples of rock in tubes that could one day be brought back to Earth.',
      'It also carries a small helicopter, Ingenuity.',
      'Perseverance is still working. It has no way home, so one day it too will stay on Mars for good.',
    ],
    glb: 'm2020', eq: 'perseverance', film: 'perseverance',
  },
  {
    t: '2021-04-19T07:34:00Z', head: 'First flight on another planet', kicker: 'Mars · Jezero crater',
    lead: 'The helicopter Ingenuity makes the first powered, controlled flight on another planet.',
    body: [
      'The air of Mars is very thin, and nobody knew for sure that anything could fly in it. Planned for up to five flights, Ingenuity flies 72 times over almost three years.',
      'On its last flight, on 18 January 2024, it lands hard and breaks its rotor blades. It still sits in Jezero crater.',
    ],
    glb: 'ingenuity', eq: 'ingenuity',
  },
  {
    t: '2022-07-12T14:30:00Z', head: 'Webb shows the deepest view of the universe', kicker: 'James Webb Space Telescope · L2', top: true,
    lead: 'The first science pictures from the James Webb Space Telescope are released. One of them is the deepest and sharpest infrared view of the distant universe taken up to then.',
    body: [
      'The picture shows a cluster of galaxies called SMACS 0723. Almost every dot and smudge in it is a whole galaxy. Some are so far away that their light has been stretched into infrared on its way to us, which is exactly the kind of light Webb was built to see.',
      'Webb sees this with a mirror 6.5 metres across, made of 18 gold-coated segments, kept cold and dark behind a sunshield the size of a tennis court.',
      'Webb is 1.5 million km from Earth. Nobody can fly out to repair it, and it will never be brought back.',
    ],
    photos: [
      { src: 'news/webb-deep-field.jpg', cap: 'Webb\'s First Deep Field: the galaxy cluster SMACS 0723. The spiky points are nearby stars; everything else is a galaxy.', credit: 'NASA, ESA, CSA, STScI' },
      { src: 'news/hubble-same-field.jpg', cap: 'The same patch of sky as the Hubble Space Telescope sees it. Compare the faint red galaxies with Webb\'s picture.', credit: 'NASA, ESA, STScI' },
      { src: 'news/webb-carina.jpg', cap: 'Also released that day: the "Cosmic Cliffs" of the Carina Nebula, a cloud of gas and dust where stars are being born.', credit: 'NASA, ESA, CSA, STScI' },
    ],
    glb: 'jwst', probe: 'jwst', film: 'jwst',
  },
];
for (const n of NEWS) n.ms = Date.parse(n.t);
