# The galaxies

Part of Since 1958: Beyond. Opened from the **Galaxies** button on the main page.

## What it does

**The map.** 2,478 galaxies at their real positions, with the Sun at the centre. The floor is the supergalactic plane; rings mark 1, 5, 10, 20 and 30 Mpc. Each galaxy's size, tilt, type and brightness come from the catalogues. A slider hides everything beyond a chosen distance.

**Visiting a galaxy.** Click one and the camera flies there. Up close the galaxy is grown on the spot from 26,000 to 150,000 points (by quality setting), so no star data is downloaded:

- Spiral arms and the patches in irregular galaxies are laid down by **Brownian motion**. A walker moves out along the arm, gets a random kick at every step, is pulled gently back to the arm's centre line, and drops a star where it stands (`js/universe/galaxy.js`).
- The smooth parts use standard light profiles: an exponential disc and a Hernquist bulge.
- The shape follows the catalogued Hubble type: bulge size, how tightly the arms wind, whether there is a bar.
- The same name always grows the same galaxy (the random numbers are seeded from it).

**Supernova.** A Type Ia in the galaxy being visited, following the standard Type Ia light curve (peak absolute magnitude −19.3, 1.1 magnitudes fainter after 15 days), compared live with the galaxy's own catalogued brightness.

**Black hole merger.** GW150914 (36 + 29 solar masses → 62). The orbit shrinks by the Peters (1964) quadrupole formula; background stars and the Milky Way are bent by the point-lens equation; a sheet shows the gravitational waves spreading at the speed of light. The scene has no accretion disc and no flash, because a pair of black holes in empty space gives off no light.

### What is real and what is not

| Real (from data or textbook formulae) | Not real |
| --- | --- |
| Galaxy positions, distances, sizes, tilts, types, brightness | The individual stars inside a galaxy: each point stands for millions of stars |
| Which way a galaxy leans as seen from Earth | Which edge of a tilted galaxy is the near one (not known, so chosen from its name) |
| Supernova light curve, merger masses, timing, frequencies, energy | Galaxy sizes on the wide map: enlarged, or all would be smaller than a pixel |
| Background stars in the merger scene (Hipparcos) | Height of the gravitational-wave ripples: exaggerated |

Known approximations: the Peters formula assumes slow speeds and weak gravity, so the last orbits before the merger are only roughly right. The lens formula is the weak-field one. Speeds shown are Newtonian estimates. Galaxies with no measured size (9 of them) are drawn as small dwarfs, and the panel marks the size "assumed".

## Files

```
index.html
css/universe.css
js/three.js       uses Since 1958's own three.js r187 (../vendor/three/), nothing extra to download
js/core/          renderer with bloom and tone curve, camera, texture loading
js/shaders/sky.js the real night sky (Hipparcos stars and the Milky Way), bent by the black holes
js/solar/         sky coordinate conversion
js/universe/      catalogue.js, field.js, galaxy.js, events.js, physics.js, main.js
data/             galaxies.json (2,478 galaxies), stars.bin (41,411 stars)
textures/         Milky Way glow
tools/            scripts that rebuilt the data files
```

Checked in headless Chrome with software rendering (no console errors). Frame rate on real phones and laptops has not been measured.

## Sources

- **Galaxies within about 11 Mpc:** Karachentsev, Makarov & Kaisina (2013), *Updated Nearby Galaxy Catalog*, AJ 145, 101, the Local Volume Galaxy database (table 1; 1,151 galaxies used).
- **Galaxies from there to 30 Mpc:** Tully, Courtois & Sorce (2016), *Cosmicflows-3*, AJ 152, 50, from the Extragalactic Distance Database (1,327 galaxies used).
- **Types, sizes, position angles, magnitudes:** HyperLEDA, Makarov et al. (2014), A&A 570, A13.
- The three tables were taken as plain text from `gal_data/` in github.com/akleroy/galbase. Rebuild with `python3 tools/build-galaxies.py <folder> data/galaxies.json`.
- **Black hole merger:** Abbott et al. (LIGO and Virgo), 2016, PRL 116, 061102 (GW150914). Orbit decay: Peters (1964), Phys. Rev. 136, B1224.
- **Stars:** Hipparcos catalogue, via the d3-celestial data set (BSD 3-Clause).
