/* Geodesic: deeper lesson content for KS3 topics (key ideas, worked example, common mistakes, exam-style practice). */
(function () {
  const D = (window.WL = window.WL || {}).deep = window.WL.deep || {};
  Object.assign(D, {
    'ks3-speed': {
      keys: [
        'Speed is distance covered per second: $v = d/t$, in m/s (or km/h). To convert, 1 m/s = 3.6 km/h.',
        'On a distance–time graph the gradient is the speed. A straight sloping line means constant speed, a horizontal line means stationary, a curve getting steeper means speeding up.',
        'Average speed = total distance ÷ total time, including any stops. It is not the average of the separate speeds unless each part lasts the same time.',
        'Speed is always measured relative to something: the road, the platform, another car.'
      ],
      worked: [{ q: 'A cyclist rides 3.0 km in 10 minutes, rests for 5 minutes, then rides 1.5 km in 5 minutes. Find the average speed for the whole trip in m/s.',
        steps: ['Total distance = 3.0 + 1.5 = 4.5 km = 4500 m.', 'Total time = 10 + 5 + 5 = 20 min = 1200 s. The rest counts: the clock keeps running.', '$\\bar v = 4500/1200 = 3.75$ m/s.'], ans: '3.75 m/s (13.5 km/h).' }],
      mistakes: [['Averaging the speeds of the parts: (5 + 0 + 5)/3 = 3.3 m/s.', 'Divide the total distance by the total time; longer parts count for more.'],
        ['Dividing km by minutes and calling it m/s.', 'Convert to metres and seconds first.'],
        ['Reading the speed as the height of a distance–time line.', 'Speed is the gradient (rise ÷ run), not the value of d.']],
      exam: [{ q: 'A train travels 120 km in 1 h 30 min. (a) Calculate its average speed in km/h. (b) Convert this to m/s.', marks: 3,
        sol: ['(a) t = 1.5 h, so $\\bar v = 120/1.5 = 80$ km/h.', '(b) 80 ÷ 3.6 = 22.2 m/s.'] },
      { q: 'A distance–time graph is a straight line from (0 s, 0 m) to (40 s, 100 m), then horizontal until 60 s. Describe the motion and give the speed in each part.', marks: 3,
        sol: ['0–40 s: constant speed; gradient = 100/40 = 2.5 m/s.', '40–60 s: horizontal line, so stationary (speed 0).', 'Average over the whole 60 s: 100/60 ≈ 1.7 m/s.'] }]
    },
    'ks3-moments': {
      keys: [
        'A moment is the turning effect of a force: $M = F\\times d$, where d is the perpendicular distance from the pivot to the line of the force. Unit: N m.',
        'An object balances when the total clockwise moment equals the total anticlockwise moment about the pivot (the principle of moments).',
        'Long spanners, door handles far from the hinge and crowbars all increase d, so the same force gives a bigger moment.',
        'For a balanced beam the forces must also balance: the pivot pushes up with a force equal to the total weight.'
      ],
      worked: [{ q: 'A 400 N child sits 1.5 m from the pivot of a see-saw. Where must a 600 N adult sit on the other side to balance?',
        steps: ['Anticlockwise moment = 400 × 1.5 = 600 N m.', 'Clockwise moment = 600 × d.', 'Balance: 600 d = 600, so d = 1.0 m.'], ans: '1.0 m from the pivot.' }],
      mistakes: [['Using the distance along a beam when the force is at an angle.', 'Use the perpendicular distance from the pivot to the line of the force.'],
        ['Mixing cm and m in one balance equation.', 'Either unit works, as long as both sides use the same one.'],
        ['Using mass in kg instead of weight in N.', 'Moments use forces, W = mg (though g cancels when every force is a weight).']],
      exam: [{ q: 'A uniform 2.0 m plank of weight 80 N is balanced on a pivot at its centre. A 30 N weight hangs 0.80 m to the left of the pivot. What downward force 0.60 m to the right of the pivot balances it? Why does the plank’s own weight not appear?', marks: 3,
        sol: ['The plank’s weight acts at its centre, which is at the pivot, so its moment is zero.', 'Anticlockwise: 30 × 0.80 = 24 N m.', 'Clockwise: F × 0.60 = 24, so F = 40 N.'] },
      { q: 'Explain, using moments, why a door is easier to open by pushing near the handle than near the hinge.', marks: 2,
        sol: ['Turning the door needs a certain moment, M = F × d.', 'Near the handle d is large, so a smaller force gives the same moment.'] }]
    },
    'ks3-waves': {
      keys: [
        'A wave transfers energy and information without transferring matter: the medium only oscillates about fixed positions.',
        'Transverse waves (light, ripples, waves on a string) oscillate at right angles to the direction of travel; longitudinal waves (sound) oscillate along it, making compressions and rarefactions.',
        'Amplitude is the maximum displacement from rest; wavelength λ is the length of one cycle; frequency f is the number of waves per second (Hz); period $T = 1/f$.',
        'Wave speed $v = f\\lambda$. In one medium v is fixed, so a higher frequency means a shorter wavelength.'
      ],
      worked: [{ q: 'A sound of frequency 680 Hz travels at 340 m/s in air. Find its wavelength and period.',
        steps: ['$\\lambda = v/f = 340/680 = 0.50$ m.', '$T = 1/f = 1/680 = 1.5\\times10^{-3}$ s.'], ans: 'λ = 0.50 m, T ≈ 1.5 ms.' }],
      mistakes: [['Measuring wavelength from a crest to the next trough.', 'That is half a wavelength; measure crest to crest.'],
        ['Taking the amplitude as the crest-to-trough height.', 'Amplitude is from the rest position to a crest: half of that height.'],
        ['Saying a higher-pitched sound travels faster.', 'In the same medium all frequencies travel at the same speed; only λ changes.']],
      exam: [{ q: 'Water waves pass a post: 12 crests pass in 4.0 s and the crests are 1.5 m apart. Calculate (a) the frequency, (b) the wave speed.', marks: 3,
        sol: ['(a) f = 12/4.0 = 3.0 Hz.', '(b) v = fλ = 3.0 × 1.5 = 4.5 m/s.'] },
      { q: 'Describe how air particles move as a sound wave passes and explain why sound cannot cross a vacuum.', marks: 3,
        sol: ['The particles vibrate back and forth along the direction of travel (longitudinal), making compressions and rarefactions.', 'Each particle passes the vibration to its neighbours; the particles themselves do not travel with the wave.', 'A vacuum has no particles to pass the vibration on.'] }]
    },
    'ks3-light': {
      keys: [
        'Light travels in straight lines at $3\\times10^8$ m/s in a vacuum, far faster than sound: you see lightning before you hear the thunder.',
        'Law of reflection: angle of incidence = angle of reflection, both measured from the normal (the line at 90° to the surface).',
        'A plane mirror forms a virtual image: same size, upright, left–right reversed, and as far behind the mirror as the object is in front.',
        'Rough surfaces scatter light in many directions (diffuse reflection); smooth ones give an image (specular reflection). Both obey i = r at every tiny piece of surface.'
      ],
      worked: [{ q: 'A ray strikes a plane mirror at 25° to the mirror surface. Find the angles of incidence and reflection and the angle through which the ray is turned.',
        steps: ['The angle to the normal is 90° − 25° = 65°, so i = 65°.', 'By the law of reflection, r = 65°.', 'The ray turns through 180° − (i + r) = 180° − 130° = 50°.'], ans: 'i = r = 65°; deviation 50°.' }],
      mistakes: [['Measuring angles from the mirror surface.', 'Always measure from the normal.'],
        ['Drawing the image on the mirror surface.', 'The image is as far behind the mirror as the object is in front.'],
        ['Thinking a virtual image can be caught on a screen.', 'No light actually reaches a virtual image; the rays only appear to come from it.']],
      exam: [{ q: 'A girl stands 2.0 m in front of a plane mirror. (a) How far is she from her image? (b) She walks 0.5 m towards the mirror. How far is she from her image now?', marks: 2,
        sol: ['(a) The image is 2.0 m behind the mirror, so 4.0 m from her.', '(b) She is 1.5 m from the mirror and so is the image: 3.0 m.'] },
      { q: 'Explain why you can see a sheet of paper from anywhere in a room, but your reflection in a mirror only from certain places.', marks: 2,
        sol: ['Paper is rough: each point scatters light in many directions, so some reaches your eye wherever you stand.', 'A mirror is smooth: each ray reflects in one direction only (i = r), so only certain positions receive the rays that form the image.'] }]
    },
    'ks3-circuits': {
      keys: [
        'Current is the rate of flow of charge, in amperes (A), measured with an ammeter in series. In a series circuit it is the same everywhere.',
        'Potential difference (voltage) is energy transferred per coulomb, in volts (V), measured with a voltmeter connected across a component.',
        'In series the supply p.d. is shared ($V = V_1 + V_2$); in parallel each branch has the full p.d. and the branch currents add.',
        'Power is energy per second: $P = VI$, in watts. A 12 W lamp on 12 V draws 1 A.'
      ],
      worked: [{ q: 'Two identical lamps are in series with a 6.0 V battery and the current is 0.30 A. Find the p.d. across each lamp, the power of each, and the energy one lamp transfers in 2 minutes.',
        steps: ['Identical lamps share the p.d. equally: 3.0 V each.', 'P = VI = 3.0 × 0.30 = 0.90 W each.', 'E = Pt = 0.90 × 120 = 108 J.'], ans: '3.0 V; 0.90 W; 108 J.' }],
      mistakes: [['Connecting a voltmeter in series.', 'Voltmeters go across (in parallel with) the component.'],
        ['Saying the bulb uses up the current.', 'The same current returns to the cell; energy is what the bulb transfers.'],
        ['Adding the p.d.s of parallel branches.', 'Each parallel branch has the same p.d. as the supply.']],
      exam: [{ q: 'A 230 V kettle draws 10 A. (a) Calculate its power. (b) How much energy does it transfer in 3 minutes?', marks: 3,
        sol: ['(a) P = VI = 230 × 10 = 2300 W.', '(b) E = Pt = 2300 × 180 = 414 000 J = 414 kJ.'] },
      { q: 'Two lamps are in parallel with a 6 V cell. One carries 0.2 A, the other 0.3 A. What does an ammeter next to the cell read, and what is the p.d. across each lamp?', marks: 2,
        sol: ['The branch currents add: 0.2 + 0.3 = 0.5 A.', 'Each lamp is connected directly across the cell, so each has 6 V.'] }]
    },
    'ks3-particles': {
      keys: [
        'Matter is made of particles. In solids they vibrate about fixed positions; in liquids they touch but slide past each other; in gases they are far apart and move fast and randomly.',
        'Density = mass ÷ volume, $\\rho = m/V$, in kg/m³ or g/cm³. Water is 1000 kg/m³ = 1 g/cm³.',
        'Changing state changes the spacing, not the particles: mass is conserved when ice melts, but the density changes.',
        'An object floats in a liquid if its average density is less than the liquid’s.'
      ],
      worked: [{ q: 'A block measures 2.0 cm × 3.0 cm × 5.0 cm and has a mass of 81 g. Find its density in g/cm³ and kg/m³. Will it float in water?',
        steps: ['V = 2.0 × 3.0 × 5.0 = 30 cm³.', 'ρ = 81/30 = 2.7 g/cm³ = 2700 kg/m³ (aluminium).', '2.7 g/cm³ is more than water’s 1.0 g/cm³, so it sinks.'], ans: '2.7 g/cm³ = 2700 kg/m³; it sinks.' }],
      mistakes: [['Saying the particles themselves get bigger when heated.', 'They stay the same size; they move faster and spread out.'],
        ['Converting g/cm³ to kg/m³ by multiplying by 100.', '1 g/cm³ = 1000 kg/m³.'],
        ['Saying heavy things sink and light things float.', 'Density decides, not mass: a steel ship floats because its average density is low.']],
      exam: [{ q: 'A stone of mass 150 g is lowered into a measuring cylinder; the water level rises from 40.0 cm³ to 100.0 cm³. Calculate its density.', marks: 2,
        sol: ['Volume = 100.0 − 40.0 = 60.0 cm³ (displacement).', 'ρ = 150/60.0 = 2.5 g/cm³.'] },
      { q: 'Use the particle model to explain why gases are easy to compress but liquids are not.', marks: 2,
        sol: ['Gas particles are far apart with lots of empty space, so they can be pushed closer.', 'Liquid particles already touch, so there is almost no space to squeeze into.'] }]
    },
    'ks3-pressure': {
      keys: [
        'Pressure is force per unit area: $p = F/A$, in pascals (1 Pa = 1 N/m²). The same force on a smaller area gives a bigger pressure (pins, knives); on a bigger area a smaller one (snowshoes).',
        'Pressure in a liquid grows with depth: $p = \\rho g h$. It acts equally in all directions and does not depend on the width or shape of the container.',
        'Atmospheric pressure, about 100 kPa at sea level, comes from the weight of the air above and falls with altitude.',
        'Hydraulic machines pass pressure through a liquid: a small force on a small piston gives a large force on a large piston, $F_1/A_1 = F_2/A_2$.'
      ],
      worked: [{ q: 'Find the pressure due to the water at the bottom of a 3.0 m deep pool, and the total pressure there. (ρ = 1000 kg/m³, g = 9.8 N/kg, atmospheric pressure 101 kPa)',
        steps: ['p = ρgh = 1000 × 9.8 × 3.0 = 29 400 Pa ≈ 29 kPa.', 'Total = 101 + 29 = 130 kPa.'], ans: '≈ 29 kPa from the water; ≈ 130 kPa in total.' }],
      mistakes: [['Using cm² with N and calling the answer pascals.', 'Convert to m² (1 cm² = 10⁻⁴ m²) or give the unit as N/cm².'],
        ['Thinking a wider tank has more pressure at the bottom.', 'Pressure depends only on depth and density.'],
        ['Forgetting the atmosphere presses on the surface too.', 'Total pressure = p_{atm} + ρgh.']],
      exam: [{ q: 'A 600 N person stands on one foot of area 150 cm². Calculate the pressure on the floor in Pa.', marks: 2,
        sol: ['A = 150 cm² = 0.0150 m².', 'p = F/A = 600/0.0150 = 40 000 Pa (40 kPa).'] },
      { q: 'In a hydraulic jack a 50 N force acts on a piston of area 2.0 cm². The load piston has area 100 cm². What force does it exert?', marks: 2,
        sol: ['Pressure = 50/2.0 = 25 N/cm², the same throughout the liquid.', 'F = 25 × 100 = 2500 N.'] }]
    },
    'ks3-space': {
      keys: [
        'Weight is the force of gravity on a mass: $W = mg$, with g ≈ 9.8 N/kg on Earth and 1.6 N/kg on the Moon. Mass (kg) stays the same everywhere; weight does not.',
        'The Earth spins once a day (day and night) and orbits the Sun once a year; its tilted axis causes the seasons.',
        'Gravity keeps moons and satellites in orbit: a satellite falls all the time, but moves sideways so fast that the ground curves away beneath it.',
        'The Solar System: the Sun, eight planets with their moons, dwarf planets, asteroids and comets. Planets further out take longer to orbit.'
      ],
      worked: [{ q: 'An 80 kg astronaut: what is her weight on Earth (9.8 N/kg) and on the Moon (1.6 N/kg)? What is her mass on the Moon?',
        steps: ['Earth: W = 80 × 9.8 = 784 N.', 'Moon: W = 80 × 1.6 = 128 N.', 'Mass is the amount of matter: still 80 kg.'], ans: '784 N; 128 N; 80 kg.' }],
      mistakes: [['Saying there is no gravity on the ISS.', 'At 400 km gravity is still about 90% of its surface value; astronauts float because they are in free fall with the station.'],
        ['Giving weight in kilograms.', 'Weight is a force, measured in newtons.'],
        ['Blaming the seasons on the Earth’s distance from the Sun.', 'They come from the tilt of the axis; Earth is closest to the Sun in January.']],
      exam: [{ q: 'A 2.0 kg rock weighs 7.4 N on Mars. Calculate the gravitational field strength on Mars.', marks: 2, sol: ['g = W/m = 7.4/2.0 = 3.7 N/kg.'] },
      { q: 'Explain why astronauts on the ISS seem weightless although gravity acts on them.', marks: 2,
        sol: ['Gravity gives the astronauts and the station the same acceleration towards Earth.', 'They fall together (free fall), so nothing presses on the astronauts and they feel weightless.'] }]
    }
  });
})();
