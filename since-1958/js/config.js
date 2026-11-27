// Global constants. All distances are in kilometres unless a name says otherwise.

export const AU_KM = 149597870.7;
export const DEG = Math.PI / 180;

// Mean radii (km). Sources: IAU WGCCRE / NASA fact sheets.
export const BODIES = {
  sun:   { id: 'sun',   name: 'Sun',   radius: 695700.0, color: '#ffd27a', orbitView: 6 },
  earth: { id: 'earth', name: 'Earth', radius: 6371.0,   color: '#78b8ff', orbitView: 3.1 },
  moon:  { id: 'moon',  name: 'Moon',  radius: 1737.4,   color: '#d3dae6', orbitView: 3.4 },
  mars:  { id: 'mars',  name: 'Mars',  radius: 3389.5,   color: '#ef8a5a', orbitView: 3.3 },
  // The other planets (and Pluto): places the probes flew past. period = orbit in days.
  mercury: { id: 'mercury', name: 'Mercury', radius: 2439.7,  color: '#b5ada3', orbitView: 3.4, period: 87.969,   tex: 'mercury.jpg' },
  venus:   { id: 'venus',   name: 'Venus',   radius: 6051.8,  color: '#e8c98a', orbitView: 3.2, period: 224.701,  tex: 'venus_clouds.jpg' },
  jupiter: { id: 'jupiter', name: 'Jupiter', radius: 69911.0, color: '#d8b58a', orbitView: 3.4, period: 4332.59,  tex: 'jupiter.jpg' },
  saturn:  { id: 'saturn',  name: 'Saturn',  radius: 58232.0, color: '#e2c98e', orbitView: 5.2, period: 10759.22, tex: 'saturn.jpg', ring: [74500, 137000] },
  uranus:  { id: 'uranus',  name: 'Uranus',  radius: 25362.0, color: '#9fd6dc', orbitView: 3.4, period: 30688.5,  tex: 'uranus.jpg' },
  neptune: { id: 'neptune', name: 'Neptune', radius: 24622.0, color: '#7f9ff0', orbitView: 3.4, period: 60182.0,  tex: 'neptune.jpg' },
  pluto:   { id: 'pluto',   name: 'Pluto',   radius: 1188.3,  color: '#c9b29a', orbitView: 3.6, period: 90560.0,  tex: 'pluto.jpg' },
};
BODIES.earth.period = 365.256; BODIES.mars.period = 686.98;

// Bodies added on top of the original Sun / Earth / Moon / Mars set.
export const EXTRA_IDS = ['mercury', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
export const WORLD_IDS = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

// Simulation speed presets: k = simulated seconds per real second.
export const SPEEDS = [
  { k: 1,          label: 'real time' },
  { k: 60,         label: '1 min / s' },
  { k: 600,        label: '10 min / s' },
  { k: 1800,       label: '30 min / s' },
  { k: 3600,       label: '1 hour / s' },
  { k: 21600,      label: '6 hours / s' },
  { k: 86400,      label: '1 day / s' },
  { k: 604800,     label: '1 week / s' },
  { k: 2592000,    label: '30 days / s' },        // the top speed (90 days / s was dropped: the Earth whirled too fast)
];
export const DEFAULT_SPEED_INDEX = 3;          // 30 min/s: Earth turns once every ~48 s

export const START_TIME = Date.UTC(1958, 9, 1, 12, 0, 0);   // NASA's first day
export const TIME_MIN   = Date.UTC(1957, 0, 1);
export const TIME_MAX   = Date.UTC(2035, 11, 31, 23, 59, 59);
export const YEAR_MIN = 1957, YEAR_MAX = 2035;

// Above this many simulated seconds per real second the Earth's true spin would be too fast to watch comfortably
// (more than a quarter turn a second, at 6 hours / s), so the spin is shown as a calm time-lapse instead.
export const SPIN_ALIAS_LIMIT = 0.25 * 86164 * 1.02;   // ~2.2e4 s/s

// Auto-slow near events: start braking when the event is this many real seconds away
// at the user's speed, never go slower than APPROACH_FLOOR while braking.
export const APPROACH_WINDOW_S = 1.0;      // start braking this many real seconds (at full speed) before an event ...
export const APPROACH_TAU_S = 0.45;        // ... and arrive quickly: the slow part belongs to the event, not to the wait before it
export const APPROACH_FLOOR = 3600;
