# Since 1958: Beyond

*Most of them are silent. Their achievements are not.*

Since 1958 is an interactive 3D time machine for the machines NASA left on the Moon, on Mars and in deep space.

**Live site: https://gisfresh.me/since-1958/**

It runs in any modern browser, on a laptop or a phone. There is nothing to install and no account to make.

![Team](https://img.shields.io/badge/Team-Concinendial-2f855a?style=flat-square)

## Why we made it

Most of the machines we sent into space never came home. Surveyor 3 is still sitting on the Moon. Spirit is stuck in a sand trap on Mars. The two Voyagers are still flying, 49 years after launch.

When we started looking into them, we found that their stories are spread across catalogues, PDFs and technical archives. If you are 12 and curious, that is a hard place to start. Most people only hear about the missions that are flying right now, so the landers, rovers and probes that first explored the Solar System are mostly forgotten. We wanted one place where you can see all of them and understand what each one did for us.

## What it is

You press Start, and the Solar System runs from 1958 to today. The Sun, the planets and the Moon are where they really were on every date. Each machine shows up on the day it actually arrived, at its real landing site.

From there you can fly down to any of them, watch it land, walk up to it and take it apart in 3D. Every object has a short story in six parts: why it went, what it did, what we learned, why it stayed, where it is now, and its status today. The NASA sources for each one are listed with it.

In total there are 13 sites on the Moon, 11 on Mars and 11 probes in deep space, with 83 events on the timeline.

## If you only have a few minutes

1. Open the site and press Start. A 40-second opening film drops you onto Tranquility Base, then pulls back across the Solar System. A light comes on for every machine that was left behind, and then most of them go grey, because they are silent.
2. Press play on the clock. Time starts running from 1958, and when a machine arrives the view flies there and plays its arrival.
3. Click the Moon, then Apollo 11, then "Fire a laser at its mirror". A pulse leaves Earth, hits the reflector the crew left in 1969, and comes back at the real speed of light over today's real Earth-Moon distance.
4. Open the featured animations and watch Apollo 11. It is the whole flight in 14 scenes, from the launch pad to "The Eagle has landed".
5. Press Exhibition. It is a clean-room hall with 44 exhibits at true size, and you can take any of them apart.
6. Ride along with Voyager 1 and write it a message. You can follow your message out at the speed of light.

Tab skips any film, H hides all the buttons, and "What is real?" in the menu explains what is data and what is not.

## Features

- **A clock from 1958 to today.** You can pause it, speed it up, or jump straight to any of the 83 events.
- **Mission films.** There are 30 short films of the big moments from 1964 to 2022, arrival and "it falls silent" scenes at the landing sites, and four longer animations: Apollo 11, Voyager 1 up close, Perseverance's seven minutes of landing, and how the James Webb Space Telescope works.
- **Walking and driving.** You can walk around the Apollo sites in the Moon's real gravity, and follow Curiosity, Perseverance and Ingenuity along the routes NASA/JPL published.
- **The exhibition hall.** 44 exhibits at true size. You can walk, jump, switch to a third-person view, and take each machine apart.
- **Machines that still work.** For the ones still operating, you can see what they have achieved so far, from Voyager 1's 49 years in flight to Perseverance setting the record for the longest drive on another world.
- **The laser echo.** Observatories still bounce lasers off the mirror Apollo 11 left behind. You can try it yourself and see the pulse come back in about 2.5 seconds.
- **A message to Voyager.** In 2017, more than 30,000 people sent messages to Voyager 1 through NASA. You can write one too and watch how far it gets.
- **News and notes.** The biggest moments are told as short news stories with official NASA, ESA, CSA and STScI photos, and there is a page where we wrote down what we learned while making this.

## The galaxies

The **Galaxies** button (next to Exhibition) opens `universe/`, a second view that leaves the Solar System.

- **Every galaxy with a measured distance within 30 Mpc** (about 98 million light-years): 2,478 of them at their real positions, sizes, tilts and types. Within about 11 Mpc they come from the Local Volume Galaxy database (Karachentsev et al.), beyond that from Cosmicflows-3.
- **Galaxies grown on the spot.** Up close, each galaxy is built from 26,000 to 150,000 points. Spiral arms and patches of young stars are laid down by Brownian motion: a walker moves out along an arm, gets a random kick at every step and drops a star where it stands. No star data is downloaded, so the page stays light.
- **A Type Ia supernova** in the galaxy you are visiting, following the standard light curve.
- **A black hole merger**: GW150914, the first one LIGO detected. The orbit shrinks by the textbook formula for gravitational-wave energy loss, starlight behind the black holes is bent, and the waves spread out at the speed of light.

It uses only standard physics. What is data and what is drawn is listed in its Study panel and in `universe/README.md`.



We wanted an engaging, story-driven way for school-age and casual space fans to learn about NASA hardware that was left behind: what it is, why it was sent, and what science it made possible. These are the things we focused on:

- **Who it is for.** We aimed it at people from about age 10 up. It starts with a short hands-on tutorial that teaches the controls by having you use them.
- **The machine and the science together.** Each part in the 3D viewer says what it was for, and each story connects the hardware to what it helped us discover.
- **How missions worked.** Instead of a list of facts, you watch the landings happen, follow the real rover routes and replay the Apollo 11 flight.
- **A personal connection.** You can walk right up to these machines, watch them fall silent, and send a message to one of them.
- **The Moon, Mars and beyond.** It covers all three.
- **Accuracy.** Sources are listed on every object, and the "What is real?" panel is honest about what we simplified.

The project covers the Apollo lunar module descent stages (Apollo 11, 12 and 14 to 17), the Lunar Roving Vehicles (Apollo 15 to 17), the ALSEP science stations (Apollo 12 and 14 to 17, plus Apollo 11's earlier package), Surveyor 1 and 3, Sojourner, Spirit and Opportunity, Viking 1 and 2, Phoenix and InSight, Ingenuity, Dawn, NEAR Shoemaker, Pioneer 10 and 11, and Kepler.

We also added Ranger 7, the Apollo 13 S-IVB impact, LCROSS, GRAIL, LADEE, Curiosity, Perseverance and its sky crane, Voyager 1 and 2, Cassini, New Horizons, Hubble and James Webb.

## The NASA data we used

The whole simulation is built on NASA data:

- **NASA NSSDCA Master Catalog** for launch, landing and end dates and landing coordinates
- **NASA Science mission pages** for the facts and stories on every object (each object links to its own sources)
- **NASA/JPL rover traverse maps** for the real routes of Curiosity, Perseverance and Ingenuity
- **NASA 3D Resources** for the spacecraft models, including the lunar module, Viking, Spirit and Opportunity, Curiosity, Perseverance, Ingenuity, InSight, Hubble, Webb and Cassini
- **NASA SVS CGI Moon Kit (LRO)** for the detailed Moon
- **NASA SVS star maps** for about 150,000 real stars in their real positions (from the Yale, Hipparcos and Tycho catalogues)
- **The Apollo Lunar Surface Journal and mission reports** for the flight sequence and timings in the Apollo 11 animation
- **NASA Goddard and JPL lunar laser ranging pages** for the round-trip time, mirror size and beam width in the laser echo
- **NASA/JPL Voyager pages** for Voyager 1's real distance (it reaches one light-day from Earth on 18 November 2026) and the 2017 message campaign

The positions of the Sun, Moon and planets for any date are calculated with Astronomy Engine.

## What is real and what is not

Since this is about real machines, we tried hard to keep real data separate from the parts we had to approximate.

**Real data:** the positions of the Sun, planets and Moon on every date, at true size and distance; every landing and impact site; the rover routes; the dates and facts; NASA's own 3D models; and the stars.

**Simplified:** the flight paths of probes between planets (each probe is at the right planet on the right day, but the path in between is smoothed). Some machines have no NASA 3D model, so we built them ourselves to NASA's published sizes: Surveyor, the lunar rover, the Apollo science stations, Pathfinder and Sojourner, Phoenix, New Horizons and Voyager.

**Illustration only:** the fine detail of the Milky Way, the flames and smoke in the films, and the rocks scattered around each site.

The same breakdown is in the "What is real?" panel in the app.

## How we built it

The site is plain JavaScript (ES modules), HTML and CSS, with no framework and no build step. The 3D is done with three.js and our own GLSL shaders for planet lighting, atmospheres, Earth's city lights at night, earthshine on the Moon and eclipses. We used Python and Blender to prepare the NASA data and models, and it is hosted on GitHub Pages.

We also wanted it to work for as many people as possible. It works on phones, with a touch joystick and a smaller layout. It lowers its resolution on slower laptops to stay smooth. It respects reduced-motion settings, has screen reader labels, and has keyboard shortcuts.

To run it yourself, serve the folder with any web server (ES modules will not load from `file://`):

```bash
git clone https://github.com/guembitangerine314-eng/since-1958.git
cd since-1958
python3 -m http.server 8000
```

Then open http://localhost:8000.

**Controls:** drag to look around and scroll to zoom. Click a world or a site, or use "Go to..." and "Find". The clock panel and the timeline control time. Tab skips a film. In the exhibition, W A S D walks, Space jumps, V switches to third person and E takes an exhibit apart. H hides everything except the view.

## Credits

- **Libraries:** three.js and Astronomy Engine (both MIT licence)
- **3D models:** NASA 3D Resources. Surveyor, the lunar rover, the Apollo science stations, Pathfinder and Sojourner, Phoenix, New Horizons, Voyager, Webb, the Saturn V and Launch Complex 39A were built by hand to NASA's published sizes.
- **Planet maps:** Solar System Scope (CC BY 4.0, resized) for Mercury, Venus, Jupiter, Saturn, Uranus, Neptune and the detailed Earth and Mars; the NASA SVS CGI Moon Kit (LRO) for the detailed Moon; NASA 3D Resources for the first Mars map and Pluto; the three.js examples (MIT) for the first Earth and Moon maps
- **Stars:** NASA SVS star maps (Yale, Hipparcos, Tycho)
- **Photos:** official NASA, ESA, CSA and STScI images, credited under each one in the app
- **Fonts:** Archivo Narrow, Cinzel and Newsreader (SIL Open Font License), from Google Fonts
- **Music:** generated live in the browser, with no recordings
- **Use of AI:** we used an AI assistant (Claude) to help write the code and the procedural artwork. We checked every fact against the NASA pages listed on each object. No NASA logos or branding are used or modified.

This is a student project and is not an official NASA website.

## Licence

Our code is released under the [MIT licence](LICENSE). Third-party material (NASA images and models, Solar System Scope maps, fonts and the libraries in `vendor/`) keeps its own licence, as listed in [THIRD_PARTY.md](THIRD_PARTY.md).

## Team Concinendial

1. **Semin Cheon**, Garden International School, 10M (Managing Head)
2. **Ian Lee**, Garden International School, 10M (Team Leader)
3. **Junyi Chai**, Garden International School, 11W (Advisor for mobile experience)
