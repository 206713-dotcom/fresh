/* Twistor: "See it like Feynman" sections, ks3. Original text; see src/v6/fey.js. */
(function () { const WL = window.WL; if (!WL || !WL.fy) return;
WL.fy('ks3-circuits', [
  'Flick a switch and the lamp lights at once, yet the electrons in the wire drift at well under a millimetre a second. How can the light come on instantly?',
  'The wire is already full of free electrons, the way a hose is already full of water. The cell pushes on all of them at once through the **electric field**, which spreads round the loop at nearly the speed of light, so every electron starts moving together. The lamp lights because the electrons already inside it move.',
  'Charge cannot pile up anywhere in a steady circuit: any build-up would push back on the charge arriving until it stopped. So the same current flows through every part of a series loop. The **voltage** is the energy each coulomb picks up in the cell and hands over round the loop, and energy conservation makes the gains equal the losses.',
  'A current of 0.5 A in copper wire 1 mm² in cross-section, with about 8.5 × 10²⁸ free electrons per m³: the drift speed is v = I/(nAe) = 0.5/(8.5×10²⁸ × 10⁻⁶ × 1.6×10⁻¹⁹) ≈ 4 × 10⁻⁵ m/s, about 13 cm an hour.',
  'The water picture misses where the energy really travels: in the electric and magnetic fields around the wire, not inside it. It also hides the few nanoseconds the current takes to settle after the switch closes.'
]);
WL.fy('ks3-climate', [
  'Clear winter nights are colder than cloudy ones, and deserts swing from hot days to freezing nights. Something in the air holds heat in.',
  'Sunlight comes through the air mostly as visible light and warms the ground. The warm ground glows in **infrared**, and molecules such as carbon dioxide and water vapour absorb that infrared and send part of it back down: a blanket that lets light in but slows the heat getting out.',
  'Over the years the Earth must radiate away as much energy as it absorbs, or it would keep warming. If the air hides part of the ground’s glow, the ground has to get warmer until enough escapes. More absorbing gas means the radiation that escapes comes from higher, colder air, so the surface warms further to keep the balance.',
  'With no greenhouse gases the balance would be σT⁴ = (1 − 0.3) × 1361/4 W/m², giving T ≈ 255 K, about −18 °C. The measured average is about 288 K, so the blanket is worth about 33 °C.',
  'Clouds, ice and oceans change how much sunlight is reflected and where the heat goes. The simple balance gives the average for the whole planet, not the weather or any one region’s climate.'
]);
WL.fy('ks3-colour', [
  'A glass prism fans white light into a rainbow, and a red shirt looks black under blue light. Colour seems to live in the light as much as in the shirt.',
  'White light is a mixture of all visible wavelengths. Glass slows short (blue) wavelengths a little more than long (red) ones, so they bend by different amounts at each surface and spread apart. A red shirt absorbs most wavelengths and sends back the red; under pure blue light there is no red to send back, so it looks dark.',
  'Light slows in glass because it shakes the electrons in the glass, and the light they re-emit combines with the original. The electrons respond more strongly the closer the light’s frequency is to their own natural frequencies, which lie in the ultraviolet, so blue is slowed more than red. Different slowing means different bending: **dispersion**.',
  'Crown glass has a refractive index of about 1.51 for red and 1.53 for violet. Through a 60° prism that small difference spreads the colours over about 2°: a band roughly 3 cm wide on a wall a metre away.',
  'The eye does not measure wavelength. It has three kinds of colour cell, so a mixture of red and green light looks yellow even though no yellow wavelength is present.'
]);
WL.fy('ks3-density', [
  'A steel ship floats but a steel bolt sinks. An ice cube floats with about a tenth of it above the water.',
  'Water pushes up on anything in it with a force equal to the weight of the water it pushes aside: the **upthrust**. A solid bolt pushes aside only a little water, far lighter than itself, so it sinks. A hull encloses a lot of air, so the ship can push aside its own weight of water before it is all under.',
  'Picture the water that would fill the space the object takes up. That water is in balance, so the water around it must push up on it with exactly its weight. Put the object there instead: the surrounding water cannot tell the difference, so the same upward push acts. An object floats if that push reaches its weight before it is completely under.',
  'Ice is 917 kg/m³ and seawater about 1025 kg/m³, so the fraction of an iceberg under water is 917/1025 ≈ 0.89. About 11 % shows.',
  'Whether a floating object stays upright is a separate question: it depends on where its weight acts compared with where the upthrust acts, which is why ships carry heavy cargo low.'
]);
WL.fy('ks3-earth', [
  'The east coast of South America and the west coast of Africa fit together like jigsaw pieces, and the same fossils are found on both. Mountain tops hold the shells of sea creatures.',
  'The Earth’s outer shell is broken into rigid **plates** riding on hot rock that flows extremely slowly, like very stiff toffee. Heat from inside drives slow **convection** in the mantle, which helps carry the plates apart at mid-ocean ridges and together where mountains rise.',
  'The interior is hot, partly left over from the Earth’s formation and partly from radioactive decay, and that heat has to get out. Hot rock is a little less dense, so it rises while cooler rock sinks; over millions of years even solid rock creeps, so convection is the efficient way out.',
  'Plates move a few centimetres a year, about as fast as fingernails grow. At 3 cm a year for 100 million years a plate travels 3 × 10⁸ cm, which is 3000 km: the width of a young ocean.',
  'Real mantle flow is not a neat set of loops, plates are also pulled by their own sinking edges, and what happens deep in the mantle is still debated.'
]);
WL.fy('ks3-energy', [
  'A bouncing ball never comes back to the height it was dropped from, and each bounce is lower than the last. Where does the energy go?',
  'Energy is a number you can work out for the ball from its height and speed, and the total stays the same once you include everything it touches. Each bounce squashes the ball and the floor; their molecules jiggle a little more, so some energy ends up as a slight warming and a sound, spread out where it cannot easily be used again.',
  'In every process anyone has measured, from bouncing balls to nuclear reactions, careful accounting gives the same total before and after: energy is **conserved**. Dissipation means spreading out. Once energy is shared among countless jiggling molecules, the chance of it all gathering back into the ball is vanishingly small.',
  'A 60 g ball dropped from 1 m has mgh = 0.06 × 9.8 × 1 ≈ 0.6 J. If it rebounds to 0.7 m, about 0.18 J went into the ball and the floor. Spread through the ball alone, that would warm it by roughly 0.18/(0.06 × 2000) ≈ 0.0015 °C: far too little to feel.',
  'Conservation of energy does not tell you what happens next. For that you need forces, and the second law of thermodynamics, which explains why energy spreads out and does not come back.'
]);
WL.fy('ks3-forces', [
  'On the Moon, Apollo 15’s David Scott dropped a hammer and a feather and they landed together. On Earth the feather drifts down. Is gravity unfair to feathers?',
  'Gravity pulls each piece of matter in proportion to its mass, so heavy and light things gain speed at the same rate. Air is a crowd of molecules a falling object has to shove aside: the faster it falls and the more surface it has for its weight, the harder the air pushes back.',
  'A heavier object feels a bigger pull, but it also needs a bigger push to speed up, by exactly the same factor. So every object accelerates at the same rate, about 9.8 m/s² near the ground. **Air resistance** does not grow with weight, so it matters far more for a feather than for a hammer.',
  'A 75 kg skydiver with about 0.7 m² facing the air stops speeding up when the drag ½ρCAv² equals the weight: v ≈ √(2mg/(ρCA)) = √(2 × 75 × 9.8/(1.2 × 0.7 × 0.7)) ≈ 50 m/s, about 180 km/h.',
  'Weight and mass are different: weight changes on the Moon and mass does not. And on the scale of planets, "gravity pulls down" becomes "gravity pulls towards the centre".'
]);
WL.fy('ks3-heat', [
  'On a cold morning a metal railing feels much colder than a wooden bench, though both are at the same temperature.',
  '**Temperature** measures how hard the particles of a thing are jiggling on average. Your hand is warmer than both. Metal has free electrons that carry energy away from your skin quickly, so your skin cools fast and you feel cold; wood carries energy away slowly.',
  'Energy flows from hotter to colder because random jiggling, shared through collisions, evens out: there are vastly more ways for energy to be spread evenly than bunched up. What your skin senses is the rate at which it loses heat, not the temperature of the thing it touches.',
  'Steel conducts heat at about 50 W/(m K) and wood at about 0.15 W/(m K): roughly 300 times less. That ratio is why the railing drains your fingers so much faster.',
  'Conduction is only one way for heat to move. Convection (moving air or water) and radiation (infrared) also carry it, and in a draughty room convection usually wins.'
]);
WL.fy('ks3-light', [
  'A mirror seems to swap left and right but never top and bottom. Why would it treat the two directions differently?',
  'A flat mirror actually reverses front and back. Each point of you is matched by a point the same distance behind the glass, and light from your face bounces off at the same angle it arrived, so it seems to come from that point behind the mirror.',
  'The rule that the angle of incidence equals the angle of reflection follows from light taking the quickest route between two points by way of the mirror: any other point on the glass makes the path longer. The "left–right swap" is front–back reversal; we call it left–right because we imagine turning round to stand where the image is.',
  'To see your whole body in a flat mirror you need a mirror only half your height, at any distance: an 80 cm mirror for a 1.6 m person, its top level with a point halfway between your eyes and the top of your head.',
  'Rays are an approximation. Light is a wave, and through very narrow gaps or past very small objects it spreads out (diffracts) in a way ray diagrams cannot show.'
]);
WL.fy('ks3-magnets', [
  'Cut a bar magnet in half and you do not get a north piece and a south piece. You get two smaller magnets, each with both poles.',
  'Each iron atom is a tiny magnet, made by its spinning electrons. In a magnet, huge numbers of them line up in regions called **domains** that point the same way. Cutting the bar just divides the lined-up atoms, so each piece still has a north end and a south end.',
  'Magnetic field lines never start or end: they always close into loops. So there is no isolated north pole to cut out. Every magnet, down to a single atom, behaves like a loop of current, with a north side and a south side.',
  'The Earth’s field at the surface is about 50 μT. A fridge magnet gives a few millitesla near its face, roughly a hundred times more; a strong neodymium magnet about 1 T; a hospital MRI scanner 1.5 to 3 T.',
  'Why neighbouring iron atoms line up, while copper’s do not, is a quantum effect (the exchange interaction). No everyday picture explains it.'
]);
WL.fy('ks3-moments', [
  'A door is easy to open if you push near the handle and very hard if you push near the hinges. A see-saw balances a child against an adult if the adult sits nearer the middle.',
  'The turning effect of a force, its **moment**, depends on how hard you push and how far from the pivot: double either and you double the turning. A see-saw balances when the clockwise and anticlockwise moments are equal.',
  'Let the see-saw tip a tiny amount. The adult’s end moves a short distance and the child’s end a long one, in proportion to their distances from the pivot. If it is balanced, no energy is gained or lost in that tiny tip, so force × distance moved must match on each side. That makes force × distance from the pivot match: the principle of moments.',
  'A 30 kg child sitting 2 m from the pivot balances a 75 kg adult sitting 30 × 2 / 75 = 0.8 m from it.',
  'A real plank bends, and the pivot pushes up with the combined weight. The moments rule tells you about balance, not whether the plank is strong enough.'
]);
WL.fy('ks3-parallel', [
  'Switch on more appliances at home and each still gets the same mains voltage, but the current from the supply goes up. In an old string of fairy lights, one dead bulb blacks out the whole string.',
  'In **parallel**, each branch connects straight across the supply, so each gets the full voltage and draws its own current; the supply current is the sum of them. In **series**, all the charge passes through every bulb, so one break stops the current everywhere.',
  'Voltage is the energy per coulomb between two points. Points joined by bare wire are, in effect, the same point, so every branch connected between the same two points has the same voltage across it. Charge is not made or lost at a junction, so the current in equals the current out.',
  'Two 6 Ω bulbs on a 6 V battery: in parallel each draws 1 A and the battery supplies 2 A, 12 W in all. In series the 12 Ω loop draws 0.5 A and the total is 3 W, a quarter as much.',
  'Real batteries have internal resistance, so each branch you add pulls the battery’s voltage down a little; and a filament’s resistance rises as it heats up.'
]);
WL.fy('ks3-particles', [
  'A smell spreads across a room, a drop of ink spreads through still water, and a balloon left in the sun swells. All three are explained if everything is made of tiny moving particles.',
  'In a solid the particles are packed close and vibrate in place. In a liquid they are just as close but free to slide past one another. In a gas they are far apart, flying freely and colliding with each other and with the walls. Heating makes them all move faster.',
  'The densities fit the picture. A solid and its liquid have almost the same density, because the particles touch in both. Steam at 100 °C is about 1600 times less dense than water, so its particles must be about ∛1600 ≈ 12 times further apart.',
  'Air molecules move at about 500 m/s, yet a smell takes minutes to cross a room: each molecule collides billions of times a second, so it wanders at random instead of flying straight.',
  'The particles are not hard little balls. They attract each other when near and repel when very close, which is why liquids hold together, and they obey quantum rules.'
]);
WL.fy('ks3-pressure', [
  'You can push a drawing pin into wood with your thumb, but not the wrong way round. Snowshoes stop you sinking. Your ears pop in a fast lift or a descending plane.',
  '**Pressure** is force spread over area. The pin’s point concentrates your push on a tiny area; snowshoes spread your weight over a large one. In a liquid or gas, the weight of everything above presses on whatever is below, and the push acts in every direction.',
  'A thin column of water is held up by the pressure underneath it, so the pressure must rise by the weight of each extra layer: p = ρgh. It acts in all directions because a fluid cannot resist being sheared: if the sideways push were smaller, the fluid would flow until it was not.',
  'A 50 N push on a pin point of 0.1 mm² is 50/10⁻⁷ = 5 × 10⁸ Pa, about 5000 atmospheres. The same push on the 1 cm² head is 5 × 10⁵ Pa, a thousand times less.',
  'Air can be squashed, so air pressure does not fall in a straight line with height the way water pressure rises with depth: it roughly halves for every 5.5 km you climb.'
]);
WL.fy('ks3-solar-system', [
  'The Sun and the Moon look almost exactly the same size in the sky, which is why total eclipses happen. Yet the Sun is about 400 times wider than the Moon.',
  'The Sun is also about 400 times further away, so the two cover nearly the same angle. The stars are suns so distant that they look like points, and the Milky Way is our edge-on view of a flat disc of a few hundred billion of them.',
  'What you see as size in the sky is an angle: width divided by distance. Equal ratios give equal angles. It is a coincidence of our time, because the Moon is slowly drifting away.',
  'Sunlight takes 1.5 × 10¹¹ m ÷ 3 × 10⁸ m/s = 500 s, about 8 minutes 20 seconds, to reach us. Light from the nearest other star takes 4.2 years.',
  '"Stars are distant suns" hides a huge range: some are a hundred times the Sun’s mass and burn out in a few million years, while most are small red dwarfs that will shine for trillions of years.'
]);
WL.fy('ks3-sound', [
  'You see lightning before you hear the thunder, and an echo from a cliff comes back a moment after you shout. Sound takes time to travel.',
  'Sound is a pressure ripple. A vibrating object pushes on the air next to it, which pushes on the next layer, and so on. The air itself only shuffles back and forth a tiny distance; it is the push that travels.',
  'The speed is set by how springy the medium is against how heavy it is: stiffer or lighter means faster. That is why sound travels faster in warm air than in cold, and about four times faster in water than in air.',
  'Count the seconds between flash and thunder and divide by 3 to get the distance in kilometres: sound covers about 340 m every second.',
  'Loudness as we hear it is not simply the size of the pressure ripple. The ear responds roughly to its logarithm, which is why sound levels are measured in decibels.'
]);
WL.fy('ks3-space', [
  'The International Space Station is only about 400 km up, where gravity is still about 90 % as strong as on the ground. Yet the astronauts float. Why?',
  'The station and everyone inside it are falling all the time, together, so nothing presses on anything else. They also move sideways so fast, about 7.7 km/s, that as they fall the curved Earth falls away beneath them. An **orbit** is a fall that keeps missing the ground.',
  'Newton’s cannonball: fire a ball sideways from a high mountain, faster and faster. It lands further away each time, until the ground curves away as fast as the ball falls. With no air to slow it, it keeps going round.',
  'Near the surface a dropped object falls about 5 m in the first second, and the Earth’s surface curves down by 5 m over about 8 km. So skimming the ground in orbit would take about 8 km/s, and one lap about 2π × 6400 km ÷ 8 km/s ≈ 5000 s, roughly 85 minutes.',
  'The station flies through very thin air, which slowly drags it lower, so it has to be boosted every so often. "Weightless" means not feeling your weight, not having no gravity.'
]);
WL.fy('ks3-speed', [
  'A speedometer can read 50 km/h at an instant. But speed is distance divided by time, and in an instant no distance is covered. What does speed at an instant mean?',
  'It is the slope of the distance–time graph at that point. Zoom in on any smooth curve and it looks straight; the slope of that tiny straight piece is the speed at that moment.',
  'Over a short interval the average speed is distance ÷ time. As the interval shrinks, these averages settle down to a definite value, and that limit is the instantaneous speed: exactly the idea Newton invented calculus to handle.',
  'Usain Bolt’s 9.58 s for 100 m averages 10.4 m/s, but his fastest 10 m took about 0.81 s, about 12.3 m/s.',
  'Speed has no direction; velocity does. A car going round a roundabout at a steady 30 km/h has a constant speed but a changing velocity.'
]);
WL.fy('ks3-tides-eclipses', [
  'Most coasts get two high tides a day, not one, even though the Moon passes overhead only once a day. The second bulge is on the side of the Earth facing away from the Moon.',
  'The Moon pulls the near side of the Earth more strongly than the centre, and the centre more strongly than the far side. Compared with the centre, the near ocean is pulled towards the Moon and the far ocean is left behind: two bulges, with the Earth turning beneath them.',
  'Tides come from the difference in the Moon’s pull across the Earth, not the pull itself. That difference falls off as 1/distance³, which is why the Sun, though far heavier, raises tides only about half as strong as the Moon’s.',
  'The Moon’s stretching pull at the Earth’s surface is 2GMR/d³ ≈ 1.1 × 10⁻⁶ m/s², about a ten-millionth of g. That is enough to lift the open ocean by about half a metre.',
  'Real tides are shaped by coastlines and by whole ocean basins sloshing back and forth: some places get only one tide a day, and the Bay of Fundy in Canada gets 15 m.'
]);
WL.fy('ks3-waves', [
  'A cork on a pond bobs up and down as ripples pass, but it does not travel with them. Something moves outwards, but it is not the water.',
  'A wave is a pattern of disturbance handed on from each bit of the medium to the next. Each bit only oscillates about its own place; the energy and the shape travel.',
  'Each bit of water tugs on its neighbours as it moves, and that coupling passes the motion on, a little later each time. The rule speed = frequency × wavelength is just counting: each second, f crests pass a point, each one wavelength behind the last.',
  'Middle C (262 Hz) in air at 340 m/s has a wavelength of 340/262 ≈ 1.3 m. Sound waves are the size of people, which is why sound bends round doorways while light, with a wavelength of half a micrometre, does not.',
  'Water waves are neither purely up-and-down nor purely back-and-forth: each bit of water moves in a small circle, and the speed of deep-water waves depends on their wavelength.'
]);
})();
