// "Left behind": the card at the end of each featured animation. For the hardware the animation has just shown, it
// tells what each machine is, why it was sent, what science it made possible (and still makes) and why it stayed,
// along with its status today and a way to go and see it. Every fact is from the NASA pages
// listed under each card (most are already in the objects' own stories in equipment.js and probes.js).

export const LEFT_BEHIND = {
  apollo: {
    where: 'Tranquility Base, the Moon', title: 'What Apollo 11 left on the Moon', status: ['eq', 'apollo11'],
    rows: [
      ['What stayed', 'The lower half of the lunar module (the descent stage, with its plaque), a laser mirror, a seismometer, the flag, and the equipment the crew no longer needed.'],
      ['Why it stayed', 'To save weight for the trip home, the descent stage became the launch pad for the top half, and everything else was left behind.'],
      ['What it still does', 'The laser mirror needs no power. Observatories on Earth still bounce lasers off it, and so we know the Moon drifts away from Earth by about 3.8 cm every year.'],
    ],
    buttons: [['Fire a laser at the mirror', 'echo', ''], ['Take it apart in 3D', 'object', 'apollo11'], ['Walk around it', 'walk', 'apollo11']],
    sources: [['NASA: The Apollo experiment that keeps on giving', 'https://www.nasa.gov/solar-system/the-apollo-experiment-that-keeps-on-giving/'], ['NASA NSSDCA: Apollo 11 Lunar Module / EASEP', 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C']],
  },
  voyager: {
    where: 'Interstellar space', title: 'It will never come home', status: ['probe', 'voyager1'],
    rows: [
      ['What is out there', 'Voyager 1 itself, with the Golden Record of pictures and sounds from Earth fixed to its side.'],
      ['Why it cannot come back', 'Its path past Saturn’s moon Titan bent it up and out of the plane of the planets. It has been leaving the Solar System ever since.'],
      ['What it still does', 'On 25 August 2012 it became the first spacecraft in interstellar space, and it still sends back data about it. Its signal now takes almost a whole day to reach us.'],
      ['What comes next', 'In about 40,000 years, long after it has fallen silent, it will pass within 1.6 light-years of the star Gliese 445.'],
    ],
    buttons: [['Ride along with it', 'ride', 'voyager1'], ['Take it apart in 3D', 'object', 'voyager1'], ['Watch its launch film', 'film', 'voyager1']],
    sources: [['NASA Science: Voyager 1', 'https://science.nasa.gov/mission/voyager/voyager-1/'], ['NASA: Hubble provides interstellar road map for Voyagers', 'https://science.nasa.gov/missions/hubble/hubble-provides-interstellar-road-map-for-voyagers-galactic-trek/']],
  },
  percy: {
    where: 'Jezero crater, Mars', title: 'What it dropped on the way down', status: ['eq', 'perseverance'],
    rows: [
      ['What stayed', 'The heat shield, the backshell with its 21.5 m parachute, and the sky-crane descent stage, which flew off and crashed a safe distance away. Later, 10 sealed sample tubes and the Ingenuity helicopter.'],
      ['Why it stayed', 'Each part did its one job during the seven minutes of landing and was then let go, so the next part could work.'],
      ['What it still gives us', 'On 19 April 2022 Ingenuity photographed the backshell and parachute from the air; engineers study such pictures to make future landings safer. The 10 tubes, set down at “Three Forks” by 28 January 2023, are a backup set for a future mission that could bring Mars rocks to Earth.'],
    ],
    buttons: [['Go to the sky crane’s crash site', 'site', 'm2020skycrane'], ['Go to Ingenuity', 'site', 'ingenuity'], ['Go to Perseverance', 'site', 'perseverance']],
    sources: [['NASA JPL: Mars helicopter spots gear that helped Perseverance land', 'https://www.jpl.nasa.gov/news/nasas-mars-helicopter-spots-gear-that-helped-perseverance-rover-land/'], ['NASA Science: WATSON\u2019s photomontage of the Mars sample depot', 'https://science.nasa.gov/resource/watsons-photomontage-of-mars-sample-depot']],
  },
  webb: {
    where: 'L2, 1.5 million km from Earth', title: 'It will stay out there for good', status: ['probe', 'jwst'],
    rows: [
      ['Why no one will go back', 'Astronauts visited Hubble five times to repair it. Webb is about four times farther away than the Moon, so it was built to unfold and work on its own, with no visits ever.'],
      ['What it does', 'It is observing today: it was built to find some of the first galaxies and to study planets around other stars.'],
      ['What comes next', 'It carries fuel to hold its place for significantly more than ten years. When the fuel runs out it can no longer hold its place at L2, and it will stay in space for good, like the retired Kepler telescope before it.'],
    ],
    buttons: [['Ride along with it', 'ride', 'jwst'], ['Visit retired Kepler', 'ride', 'kepler'], ['Watch its launch film', 'film', 'jwst']],
    sources: [['NASA: Webb’s excess fuel likely to extend its lifetime', 'https://science.nasa.gov/blogs/webb/2021/12/29/nasa-says-webbs-excess-fuel-likely-to-extend-its-lifetime-expectations'], ['NASA Science: James Webb Space Telescope', 'https://science.nasa.gov/mission/webb/']],
  },
};
