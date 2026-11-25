// Fresh homepage visuals. Decorative only: no page text, link or the logo is changed.
//
//   1. Setup          shared state and helpers
//   2. Headline       letters of the first words fall into place; the badge counts up
//   3. Ticker         two tapes of subject names and codes, read from the subject cards
//   4. Orbit chips    one chip per subject on three tilted 3D orbits around the logo
//   5. Stage          one WebGL canvas: flowing sky, halo, pulses, grid, pointer light, grain and
//                     particle rings (one layer instead of many see-through ones stacked up)
//   6. Loop           one animation frame drives everything; pauses when mostly scrolled away
//                     and lowers its own quality when frames run slow
//   7. Pointer        parallax, particle push and click ripples
//   8. Directory      heading, group pills, giant count, pointer light and card rims (one canvas),
//                     card tilt and reveal
//
// Everything degrades quietly: without WebGL the CSS background stays, and with
// "reduce motion" switched on a single still frame is drawn.
(() => {
  // ---------- 1. Setup ----------
  const hero = document.querySelector('.fresh-home .hero');
  if (!hero) return;
  const copy = hero.querySelector('.hero-copy');
  const art = hero.querySelector('.hero-art');
  const tile = art && art.querySelector('.art-tile');
  const cards = [...document.querySelectorAll('.grid .card')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const TAU = Math.PI * 2;
  const rad = degrees => degrees * Math.PI / 180;
  const make = (tag, className, parent) => {
    const node = document.createElement(tag);
    node.className = className;
    node.setAttribute('aria-hidden', 'true');
    if (parent) parent.append(node);
    return node;
  };
  const readable = node => {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('br').forEach(lineBreak => lineBreak.replaceWith(' '));
    return clone.textContent.replace(/\s+/g, ' ').trim();
  };
  document.body.classList.add('fx');

  // Orbits, in units of the logo tile's width. `open` is how far each ring is tipped towards the viewer.
  const RINGS = [
    { r: 1.2, open: 31, roll: -17, speed: 0.105, chips: 5 },
    { r: 1.56, open: 25, roll: 21, speed: -0.074, chips: 4 },
    { r: 1.95, open: 19, roll: -5, speed: 0.052, chips: 4 },
  ];
  const CAMERA = 5.5;
  const INTRO_SECONDS = 2.6;
  const view = { width: 1, height: 1, unit: 230, cx: 0, cy: 0, artX: 0, artY: 0, artW: 0, artH: 0, artCX: 0, artCY: 0, fadeFrom: -1, fadeTo: 0, stacked: false };
  const pointer = { x: -9999, y: -9999, mx: 0, my: 0, sx: 0, sy: 0, lx: 0, ly: 0 };
  const pulse = { x: 0, y: 0, at: -100 };

  function measure() {
    const box = hero.getBoundingClientRect();
    view.width = box.width;
    view.height = box.height;
    view.stacked = getComputedStyle(hero).display !== 'grid';
    if (tile && tile.offsetWidth) {
      const artBox = art.getBoundingClientRect();
      view.unit = tile.offsetWidth;
      view.artX = tile.offsetLeft + tile.offsetWidth / 2;
      view.artY = tile.offsetTop + tile.offsetHeight / 2;
      view.cx = artBox.left - box.left + view.artX;
      view.cy = artBox.top - box.top + view.artY;
      view.artW = artBox.width;
      view.artH = artBox.height;
      view.artCX = artBox.left - box.left + artBox.width / 2;
      view.artCY = artBox.top - box.top + artBox.height / 2;
    } else {
      view.unit = Math.min(230, box.width * 0.3);
      view.cx = box.width * 0.72;
      view.cy = box.height * 0.45;
    }
    // Rings fade out before they reach the words so the copy stays easy to read
    if (view.stacked || !copy) {
      view.fadeFrom = -2;
      view.fadeTo = -1;
    } else {
      const words = document.createRange();
      words.selectNodeContents(copy);
      const edge = Math.min(words.getBoundingClientRect().right, copy.getBoundingClientRect().right) - box.left;
      view.fadeFrom = edge - view.unit * 0.15;
      view.fadeTo = edge + view.unit * 0.22;
    }
  }

  // The same projection is used here for the chips and in the dust vertex shader.
  function project(ring, angle, roll, rotX, rotY) {
    let x = Math.cos(angle) * ring.r, y = 0, z = Math.sin(angle) * ring.r;
    const open = rad(ring.open);
    [y, z] = [z * Math.sin(open), z * Math.cos(open)];
    [x, y] = [x * Math.cos(roll) - y * Math.sin(roll), x * Math.sin(roll) + y * Math.cos(roll)];
    [x, z] = [x * Math.cos(rotY) + z * Math.sin(rotY), -x * Math.sin(rotY) + z * Math.cos(rotY)];
    [y, z] = [y * Math.cos(rotX) - z * Math.sin(rotX), y * Math.sin(rotX) + z * Math.cos(rotX)];
    const scale = CAMERA / (CAMERA - z);
    return { x: x * scale, y: y * scale, z, scale };
  }
  const ringRoll = (ring, index, time) => rad(ring.roll + Math.sin(time * 0.11 + index * 2.1) * 5);
  const easeOut = value => 1 - Math.pow(1 - Math.min(1, Math.max(0, value)), 3);
  const smooth = (from, to, value) => {
    const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
    return t * t * (3 - 2 * t);
  };

  // Split a heading's plain words into spans (letters too, when asked) without changing what it says
  function splitWords(heading, letters) {
    heading.setAttribute('aria-label', readable(heading));
    let wordIndex = 0, letterIndex = 0;
    for (const node of [...heading.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE) {
        if (node.nodeType === Node.ELEMENT_NODE) node.setAttribute('aria-hidden', 'true');
        continue;
      }
      const piece = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          piece.append(' ');
          continue;
        }
        const word = make('span', 'word', piece);
        word.style.setProperty('--w', wordIndex++);
        if (!letters) {
          word.textContent = part;
          continue;
        }
        for (const letter of part) {
          const span = make('span', 'ch', word);
          span.textContent = letter;
          span.style.setProperty('--i', letterIndex++);
        }
      }
      node.replaceWith(piece);
    }
    return wordIndex;
  }

  // ---------- 2. Headline ----------
  const heading = hero.querySelector('h1');
  if (heading && !reduceMotion.matches) {
    splitWords(heading, true);
    // Once the entrance has played, drop the animations so nothing keeps extra layers alive
    setTimeout(() => hero.classList.add('is-settled'), 4200);
  }

  const badge = art && art.querySelector('.art-index b');
  const total = badge ? parseInt(badge.textContent, 10) : NaN;
  if (badge && total > 0 && !reduceMotion.matches) {
    const finalText = badge.textContent;
    badge.textContent = '0';
    const startAt = performance.now() + 2000;
    const tick = now => {
      const progress = easeOut((now - startAt) / 1100);
      badge.textContent = progress >= 1 ? finalText : String(Math.round(total * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // The light streak across the button lives in its own clipped holder, so the button itself
  // does not clip and its halo ring can grow outside it (both animate transform and opacity only)
  const button = hero.querySelector('.hero-copy .button');
  if (button) make('i', 'button-sheen', button);

  // ---------- 3. Ticker ----------
  if (cards.length) {
    const ticker = make('div', 'hero-ticker', hero);
    const fill = (className, copies, read) => {
      const track = make('div', 'ticker-track', make('div', `ticker-band ${className}`, ticker));
      for (let copyIndex = 0; copyIndex < copies; copyIndex++) {
        for (const card of cards) {
          make('span', '', track).textContent = read(card);
          make('i', '', track);
        }
      }
    };
    fill('back', 4, card => `${card.querySelector('.code')?.textContent.trim() || ''} ${card.querySelector('.symbol')?.textContent.trim() || ''}`);
    fill('front', 2, card => card.querySelector('h3')?.textContent.trim() || '');
  }

  // ---------- 4. Orbit chips ----------
  const chips = [];
  if (art && cards.length) {
    const orbit = make('div', 'art-orbit', art);
    let ringIndex = 0, slot = 0;
    for (const card of cards) {
      while (ringIndex < RINGS.length - 1 && slot >= RINGS[ringIndex].chips) {
        ringIndex++;
        slot = 0;
      }
      const node = make('span', `orbit-chip ${card.dataset.group || ''}`, orbit);
      node.textContent = card.querySelector('.symbol')?.textContent.trim() || '';
      chips.push({ node, ring: ringIndex, slot: slot++, front: null });
    }
    const perRing = RINGS.map((ring, index) => chips.filter(chip => chip.ring === index).length);
    chips.forEach((chip, order) => {
      chip.offset = (chip.slot / perRing[chip.ring]) * TAU + chip.ring * 1.3;
      chip.delay = 0.9 + order * 0.07;
    });
  }

  function placeChips(time, intro, rotX, rotY) {
    for (const chip of chips) {
      const ring = RINGS[chip.ring];
      const p = project(ring, chip.offset + time * ring.speed, ringRoll(ring, chip.ring, time), rotX, rotY);
      const x = view.artX + p.x * view.unit;
      const y = view.artY + p.y * view.unit;
      const near = smooth(-ring.r, ring.r, p.z);
      const arrive = easeOut((intro * INTRO_SECONDS - chip.delay) / 0.9);
      const fade = view.fadeFrom < 0 ? 1 : smooth(view.fadeFrom, view.fadeTo, x + view.cx - view.artX);
      chip.node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${((0.62 + near * 0.5) * (0.4 + 0.6 * arrive)).toFixed(3)})`;
      chip.node.style.opacity = ((0.38 + near * 0.62) * arrive * fade).toFixed(3);
      const front = p.z > 0;
      if (front !== chip.front) {
        chip.front = front;
        chip.node.style.zIndex = front ? '4' : '1';
      }
    }
  }

  // ---------- 5. Stage ----------
  // One opaque canvas does all the heavy drawing:
  //   a) the sky is painted into a small texture, one horizontal band per frame (it moves
  //      slowly, so nobody can tell) which keeps every frame equally cheap
  //   b) that texture is stretched over the canvas with the pointer light and film grain added
  //   c) the particle rings are drawn on top with additive blending
  const QUAD_VERTEX = 'attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }';

  // a) Sky: slow, folded noise coloured only with the Fresh palette, plus rays from behind the logo
  const SKY_FRAGMENT = `
    precision highp float;
    uniform vec2 uRes, uLogo, uPointer;
    uniform float uTime, uIntro, uStacked;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float value = 0.0, gain = 0.5;
      for (int i = 0; i < 5; i++) { value += gain * noise(p); p = p * 2.03 + vec2(1.7, 9.2); gain *= 0.5; }
      return value;
    }
    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      float aspect = uRes.x / uRes.y;
      vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
      vec2 logo = vec2((uLogo.x - 0.5) * aspect, uLogo.y - 0.5);
      vec2 push = (uPointer - 0.5) * 0.35;
      float t = uTime * 0.045;

      vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t) + push), fbm(p * 1.5 + vec2(5.2, -t * 1.3)));
      vec2 r = vec2(fbm(p * 1.7 + 3.2 * q + vec2(1.7, 9.2) + t * 0.8), fbm(p * 1.7 + 3.2 * q + vec2(8.3, 2.8) - t * 0.6));
      float f = fbm(p * 1.3 + 3.4 * r);

      vec3 deep = vec3(0.040, 0.105, 0.085);
      vec3 forest = vec3(0.125, 0.243, 0.196);
      vec3 moss = vec3(0.282, 0.431, 0.341);
      vec3 lime = vec3(0.894, 0.933, 0.698);
      vec3 peach = vec3(0.965, 0.733, 0.514);

      vec3 colour = mix(deep, forest, smoothstep(0.3, 0.72, f));
      colour = mix(colour, moss, smoothstep(0.62, 1.0, length(q)) * 0.42);
      colour += lime * pow(r.x, 6.0) * 0.9;
      colour += peach * pow(r.y, 4.5) * 0.55 * smoothstep(1.25, 0.15, uv.y + uv.x * 0.45);
      // Thin silk lines riding the folds
      float silk = pow(1.0 - abs(2.0 * fract(f * 5.0 + q.x * 2.0 - t * 2.0) - 1.0), 16.0);
      colour += lime * silk * 0.1 * smoothstep(0.35, 0.75, r.x);

      // Light from behind the logo: a soft core and slowly turning rays
      vec2 d = p - logo;
      float dist = length(d);
      vec2 around = d / max(dist, 0.0001);
      float rays = pow(noise(around * 2.6 + vec2(t * 3.0, -t * 2.0)) * noise(around * 6.5 - vec2(t * 4.0, t * 1.5) + 7.0), 1.4);
      float glow = exp(-dist * dist * 5.5);
      colour += lime * (glow * 0.18 + rays * exp(-dist * 2.4) * 1.5) * uIntro;
      colour += peach * exp(-dist * dist * 22.0) * 0.16 * uIntro;

      // Keep the copy side calm and the corners dark
      colour *= mix(0.62, 1.0, mix(smoothstep(0.02, 0.6, uv.x), smoothstep(0.12, 0.62, uv.y), uStacked));
      colour *= 1.0 - 0.55 * dot(uv - 0.5, uv - 0.5);
      gl_FragColor = vec4(colour, 1.0);
    }`;

  // b) Stretch the sky over the canvas and add, in the same pass, what used to be separate page layers:
  //    the breathing halo and the grid behind the logo, the two pulse rings, the pointer light,
  //    the shade along the bottom edge and a fine grain. Units: canvas pixels, y measured from the bottom.
  const SHOW_FRAGMENT = `
    precision highp float;
    uniform sampler2D uSky;
    uniform vec2 uRes, uSpot, uArtC, uArtHalf, uFrom;
    uniform float uSpotSize, uLevel, uDpr, uTime, uHalo, uPulseR, uShade, uStill;
    const vec3 LIME = vec3(0.894, 0.933, 0.698);
    const vec3 PEACH = vec3(0.965, 0.733, 0.514);
    const vec3 SAGE = vec3(0.435, 0.608, 0.486);
    float ease(float x) { return 1.0 - pow(1.0 - clamp(x, 0.0, 1.0), 3.0); }
    float ring(vec2 p, float t, float delay) {
      float phase = fract(max(t - delay, 0.0) / 5.4) / 0.7;
      if (t < delay || phase > 1.0) return 0.0;
      float e = ease(phase), r = uPulseR * mix(0.7, 3.4, e), width = 0.9 * uDpr;
      return exp(-pow((length(p) - r) / width, 2.0)) * 0.55 * (1.0 - e);
    }
    void main() {
      vec2 px = gl_FragCoord.xy;
      vec3 colour = texture2D(uSky, px / uRes).rgb * uLevel;
      vec2 d = px - uArtC;

      // halo: lime fading to sage, breathing over 5.5 s
      float breath = 0.5 - 0.5 * cos(uTime * 6.2831853 / 5.5);
      float h = length(d) / (uHalo * mix(0.92, 1.06, breath));
      float haloA = h < 0.38 ? mix(0.28, 0.10, h / 0.38) : h < 0.62 ? mix(0.10, 0.08, (h - 0.38) / 0.24) : mix(0.08, 0.0, clamp((h - 0.62) / 0.38, 0.0, 1.0));
      vec3 haloC = h < 0.38 ? LIME : mix(LIME, SAGE, clamp((h - 0.38) / 0.24, 0.0, 1.0));
      colour = mix(colour, haloC, haloA * mix(0.7, 1.0, breath) * uLevel);

      // grid: 28 px squares, strongest around the logo
      vec2 cell = mod(px - uFrom, 28.0 * uDpr);
      float line = max(step(cell.x, uDpr), step(cell.y, uDpr));
      float fade = 1.0 - smoothstep(0.2, 0.85, length(d / uArtHalf));
      colour = mix(colour, vec3(0.608, 0.702, 0.608), line * 0.14 * fade);

      // two rings of light leaving the logo, lime then peach
      float t = uTime * (1.0 - uStill);
      colour += LIME * ring(d, t, 2.0) + PEACH * ring(d, t, 4.7);

      // pointer light, the shade along the bottom and grain
      vec2 away = (px - uSpot) / uSpotSize;
      colour += LIME * exp(-dot(away, away)) * 0.085;
      colour = mix(colour, vec3(0.059, 0.149, 0.125), clamp(1.0 - px.y / uShade, 0.0, 1.0) * 0.8);
      colour += (fract(sin(dot(px, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.035;
      gl_FragColor = vec4(colour, 1.0);
    }`;

  // c) Dust: every particle is moved on the GPU, so thousands cost almost nothing
  const DUST_VERTEX = `
    attribute vec4 aSeed;
    attribute float aKind;
    uniform vec2 uView, uCenter, uPointer, uTilt, uFade;
    uniform vec3 uPulse;
    uniform float uDpr, uTime, uUnit, uIntro;
    uniform float uR[3], uOpen[3], uRoll[3], uSpeed[3];
    varying vec3 vColour;
    varying float vAlpha;
    const float TAU = 6.2831853;
    void main() {
      vec2 pos;
      float size, alpha;
      float twinkle = 0.62 + 0.38 * sin(uTime * (0.8 + aSeed.w * 2.4) + aSeed.x * 40.0);
      float tone = fract(aSeed.w * 7.31 + aSeed.x * 3.7);
      vColour = tone < 0.56 ? vec3(0.894, 0.933, 0.698) : tone < 0.76 ? vec3(0.965, 0.937, 0.847) : tone < 0.92 ? vec3(0.965, 0.733, 0.514) : vec3(0.608, 0.702, 0.608);

      if (aKind < 2.5) {
        // Ring dust: same maths as project() in the script
        int k = int(aKind + 0.5);
        float arrive = clamp(uIntro * 1.7 - aSeed.z * 0.7, 0.0, 1.0);
        arrive = 1.0 - pow(1.0 - arrive, 3.0);
        float onLine = step(0.7, aSeed.w);
        float spread = (aSeed.z - 0.5) * 2.0;
        float radius = uR[k] * (1.0 + spread * spread * spread * 0.11 * (1.0 - onLine)) * mix(0.03, 1.0, arrive);
        float angle = aSeed.y * TAU + uTime * uSpeed[k] * (0.82 + 0.36 * aSeed.x) + (1.0 - arrive) * 5.5;
        vec3 p = vec3(cos(angle) * radius, 0.0, sin(angle) * radius);
        float lift = (aSeed.x - 0.5) * 0.05 * (1.0 - onLine);
        p = vec3(p.x, p.z * sin(uOpen[k]) + lift, p.z * cos(uOpen[k]));
        p = vec3(p.x * cos(uRoll[k]) - p.y * sin(uRoll[k]), p.x * sin(uRoll[k]) + p.y * cos(uRoll[k]), p.z);
        p = vec3(p.x * cos(uTilt.y) + p.z * sin(uTilt.y), p.y, -p.x * sin(uTilt.y) + p.z * cos(uTilt.y));
        p = vec3(p.x, p.y * cos(uTilt.x) - p.z * sin(uTilt.x), p.y * sin(uTilt.x) + p.z * cos(uTilt.x));
        float scale = ${CAMERA.toFixed(1)} / (${CAMERA.toFixed(1)} - p.z);
        pos = uCenter + p.xy * uUnit * scale;

        float near = smoothstep(-uR[k], uR[k], p.z);
        float wave = 0.5 + 0.5 * sin(angle * 3.0 - uTime * 0.7 + float(k) * 2.0);
        size = mix(2.0, 5.2, aSeed.x * aSeed.x) * scale * mix(0.7, 1.3, near);
        alpha = arrive * mix(0.45, 1.0, near) * twinkle * mix(0.45, 1.0, wave) * 1.5;
        if (aSeed.w < 0.03) { size *= 5.0; alpha *= 0.2; }
        alpha *= uFade.x < 0.0 ? 1.0 : smoothstep(uFade.x, uFade.y, pos.x);
      } else {
        // Motes drifting up through the whole banner
        float depth = aSeed.z;
        pos = vec2(aSeed.x * 1.1 - 0.05, fract(aSeed.y - uTime * 0.007 * (0.4 + depth))) * uView;
        pos.x += sin(uTime * 0.21 + aSeed.w * 30.0) * 14.0 * depth;
        pos -= uTilt.yx * vec2(170.0, -170.0) * (depth - 0.2);
        size = mix(1.6, 4.4, depth * depth);
        alpha = (0.16 + 0.6 * depth) * twinkle * smoothstep(0.0, 0.5, uIntro) * smoothstep(0.0, 0.12, pos.y / uView.y) * smoothstep(1.0, 0.86, pos.y / uView.y);
        if (aSeed.w > 0.965) { size *= 7.0; alpha *= 0.2; }
      }

      // Pointer pushes particles aside; a click sends a ripple through them
      vec2 away = pos - uPointer;
      float reach = exp(-dot(away, away) / 14000.0);
      pos += normalize(away + 0.001) * reach * 34.0;
      alpha *= 1.0 + reach * 0.9;
      vec2 fromPulse = pos - uPulse.xy;
      float front = exp(-pow((length(fromPulse) - uPulse.z * 560.0) / 70.0, 2.0)) * exp(-uPulse.z * 1.5);
      pos += normalize(fromPulse + 0.001) * front * 46.0;
      alpha *= 1.0 + front * 2.2;
      size *= 1.0 + front * 0.9;

      vAlpha = alpha;
      gl_PointSize = max(1.5, size * uDpr);
      gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
    }`;
  const DUST_FRAGMENT = `
    precision mediump float;
    varying vec3 vColour;
    varying float vAlpha;
    void main() {
      float edge = 1.0 - smoothstep(0.0, 1.0, length(gl_PointCoord - 0.5) * 2.0);
      gl_FragColor = vec4(vColour * edge * edge * vAlpha, 1.0);
    }`;

  function createProgram(gl, vertexSource, fragmentSource, attributes) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    attributes.forEach((name, slot) => gl.bindAttribLocation(program, slot, name));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return program;
  }
  const uniforms = (gl, program, names) => Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));

  function createStage() {
    const canvas = make('canvas', 'hero-sky');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) return null;

    const skyProgram = createProgram(gl, QUAD_VERTEX, SKY_FRAGMENT, ['aPos']);
    const showProgram = createProgram(gl, QUAD_VERTEX, SHOW_FRAGMENT, ['aPos']);
    const dustProgram = createProgram(gl, DUST_VERTEX, DUST_FRAGMENT, ['aSeed', 'aKind']);
    const skyU = uniforms(gl, skyProgram, ['uRes', 'uLogo', 'uPointer', 'uTime', 'uIntro', 'uStacked']);
    const showU = uniforms(gl, showProgram, ['uSky', 'uRes', 'uSpot', 'uSpotSize', 'uLevel', 'uArtC', 'uArtHalf', 'uFrom', 'uDpr', 'uTime', 'uHalo', 'uPulseR', 'uShade', 'uStill']);
    const dustU = uniforms(gl, dustProgram, ['uView', 'uCenter', 'uPointer', 'uTilt', 'uFade', 'uPulse', 'uDpr', 'uTime', 'uUnit', 'uIntro', 'uR', 'uOpen', 'uRoll', 'uSpeed']);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const perRing = [3200, 3600, 4000];
    const motes = 900;
    const count = perRing.reduce((sum, value) => sum + value, 0) + motes;
    const data = new Float32Array(count * 5);
    let cursor = 0;
    const add = kind => {
      for (let i = 0; i < 4; i++) data[cursor++] = Math.random();
      data[cursor++] = kind;
    };
    // Motes first and rings interleaved, so a slow device can simply draw fewer points
    for (let i = 0; i < motes; i++) add(3);
    for (let i = 0; i < Math.max(...perRing); i++) perRing.forEach((amount, kind) => { if (i < amount) add(kind); });
    const points = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, points);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const target = gl.createFramebuffer();

    const ringR = new Float32Array(RINGS.map(ring => ring.r));
    const ringOpen = new Float32Array(RINGS.map(ring => rad(ring.open)));
    const ringSpeed = new Float32Array(RINGS.map(ring => ring.speed));
    const ringRollNow = new Float32Array(RINGS.length);
    gl.disable(gl.DEPTH_TEST);
    hero.prepend(canvas);

    const stage = {
      canvas,
      dpr: 1,
      maxDpr: 1.5,
      budget: 1.6e6,
      skyScale: 0.5,
      skyBands: 3,
      count,
      skyWidth: 2,
      skyHeight: 2,
      band: -1,
      resize() {
        // as sharp as the screen allows, up to about 1.6 million canvas pixels (the sky is soft, so few are needed)
        stage.dpr = Math.max(0.75, Math.min(window.devicePixelRatio || 1, stage.maxDpr, Math.sqrt(stage.budget / Math.max(1, view.width * view.height))));
        canvas.width = Math.max(2, Math.round(view.width * stage.dpr));
        canvas.height = Math.max(2, Math.round(view.height * stage.dpr));
        stage.skyWidth = Math.max(2, Math.round(view.width * stage.skyScale));
        stage.skyHeight = Math.max(2, Math.round(view.height * stage.skyScale));
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, stage.skyWidth, stage.skyHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        stage.band = -1;
      },
      draw(time, intro, rotX, rotY) {
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.disable(gl.BLEND);

        // a) repaint one band of the sky (all of it the first time, or after a resize)
        const level = easeOut(intro * 1.4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target);
        gl.viewport(0, 0, stage.skyWidth, stage.skyHeight);
        if (stage.band >= 0) {
          const from = Math.floor(stage.skyHeight * stage.band / stage.skyBands);
          const to = Math.ceil(stage.skyHeight * (stage.band + 1) / stage.skyBands);
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(0, from, stage.skyWidth, to - from);
        }
        stage.band = (stage.band + 1) % stage.skyBands;
        gl.useProgram(skyProgram);
        gl.uniform2f(skyU.uRes, stage.skyWidth, stage.skyHeight);
        gl.uniform2f(skyU.uLogo, view.cx / view.width, 1 - view.cy / view.height);
        gl.uniform2f(skyU.uPointer, 0.5 + pointer.lx * 0.5, 0.5 - pointer.ly * 0.5);
        gl.uniform1f(skyU.uTime, time);
        gl.uniform1f(skyU.uIntro, level);
        gl.uniform1f(skyU.uStacked, view.stacked ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.disable(gl.SCISSOR_TEST);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // b) show it
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(showProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(showU.uSky, 0);
        gl.uniform2f(showU.uRes, canvas.width, canvas.height);
        gl.uniform2f(showU.uSpot, pointer.x * stage.dpr, canvas.height - pointer.y * stage.dpr);
        gl.uniform1f(showU.uSpotSize, 300 * stage.dpr);
        gl.uniform1f(showU.uLevel, 0.25 + 0.75 * level);
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const artW = view.artW || view.unit * 1.6, artH = view.artH || view.unit * 1.6;
        gl.uniform2f(showU.uArtC, view.artCX * stage.dpr, canvas.height - view.artCY * stage.dpr);
        gl.uniform2f(showU.uArtHalf, artW * 0.8 * stage.dpr, artH * 0.8 * stage.dpr);
        gl.uniform2f(showU.uFrom, (view.artCX - artW * 0.8) * stage.dpr, canvas.height - (view.artCY + artH * 0.8) * stage.dpr);
        gl.uniform1f(showU.uDpr, stage.dpr);
        gl.uniform1f(showU.uTime, time - TIME_OFFSET);
        gl.uniform1f(showU.uHalo, Math.min(artW * 1.5, 44 * rem) / 2 * stage.dpr);
        gl.uniform1f(showU.uPulseR, (view.stacked ? 9 : 15) * rem / 2 * stage.dpr);
        gl.uniform1f(showU.uShade, 9 * rem * stage.dpr);
        gl.uniform1f(showU.uStill, reduceMotion.matches ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // c) dust
        gl.useProgram(dustProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, points);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 20, 16);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        RINGS.forEach((ring, index) => { ringRollNow[index] = ringRoll(ring, index, time); });
        gl.uniform2f(dustU.uView, view.width, view.height);
        gl.uniform2f(dustU.uCenter, view.cx, view.cy);
        gl.uniform2f(dustU.uPointer, pointer.x, pointer.y);
        gl.uniform2f(dustU.uTilt, rotX, rotY);
        gl.uniform2f(dustU.uFade, view.fadeFrom, view.fadeTo);
        gl.uniform3f(dustU.uPulse, pulse.x, pulse.y, Math.max(0, time - pulse.at));
        gl.uniform1f(dustU.uDpr, stage.dpr);
        gl.uniform1f(dustU.uTime, time);
        gl.uniform1f(dustU.uUnit, view.unit);
        gl.uniform1f(dustU.uIntro, intro);
        gl.uniform1fv(dustU.uR, ringR);
        gl.uniform1fv(dustU.uOpen, ringOpen);
        gl.uniform1fv(dustU.uRoll, ringRollNow);
        gl.uniform1fv(dustU.uSpeed, ringSpeed);
        gl.drawArrays(gl.POINTS, 0, stage.count);
      },
    };
    return stage;
  }

  let stage = null;
  try { stage = createStage(); } catch (error) { stage = null; }
  // Without WebGL the page keeps its CSS halo, grid and shade; the two pulse rings are added here instead
  if (!stage && art) {
    make('i', 'art-pulse', art);
    make('i', 'art-pulse', art);
  }
  if (stage) {
    hero.classList.add('has-stage');
    stage.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      stage.canvas.classList.remove('is-on');
      hero.classList.remove('has-stage');
      stage = null;
    });
  }

  // ---------- 6. Loop ----------
  const TIME_OFFSET = 40; // start mid-flow so the first frame already has shape
  let running = 0, startedAt = 0, lastFrame = 0, onScreen = true;
  let sampleFrames = 0, sampleTime = 0, slowRuns = 0, quality = 0;

  function resize() {
    measure();
    if (stage) stage.resize();
  }

  function render(seconds) {
    const intro = reduceMotion.matches ? 1 : Math.min(1, seconds / INTRO_SECONDS);
    const time = TIME_OFFSET + seconds;
    const rotX = pointer.sy * -0.16;
    const rotY = pointer.sx * 0.24;
    if (stage) stage.draw(time, intro, rotX, rotY);
    placeChips(time, intro, rotX, rotY);
  }

  // Each step trades a little sharpness for speed; the look stays the same
  const QUALITY_STEPS = [
    () => { stage.budget = 1.15e6; stage.skyBands = 4; },
    () => { stage.budget = 0.85e6; stage.skyScale = 0.4; },
    () => { stage.count = Math.round(stage.count * 0.6); stage.skyBands = 6; },
    () => { stage.skyScale = 0.3; stage.count = Math.round(stage.count * 0.7); },
  ];
  // Checked about once a second: two slow seconds in a row move one step down (two steps if very slow)
  function watchSpeed(delta) {
    if (!stage || delta > 250) return;
    sampleFrames++;
    sampleTime += delta;
    if (sampleTime < 1000) return;
    const average = sampleTime / sampleFrames;
    sampleFrames = sampleTime = 0;
    slowRuns = average > 21 ? slowRuns + 1 : 0;
    if (slowRuns < 2 || quality >= QUALITY_STEPS.length) return;
    QUALITY_STEPS[quality++]();
    if (average > 34 && quality < QUALITY_STEPS.length) QUALITY_STEPS[quality++]();
    stage.resize();
    slowRuns = 0;
  }

  function frame(now) {
    if (!startedAt) startedAt = now;
    const delta = lastFrame ? now - lastFrame : 16;
    lastFrame = now;
    pointer.sx += (pointer.mx - pointer.sx) * 0.06;
    pointer.sy += (pointer.my - pointer.sy) * 0.06;
    pointer.lx += (pointer.mx - pointer.lx) * 0.012; // the sky follows the pointer lazily
    pointer.ly += (pointer.my - pointer.ly) * 0.012;
    render((now - startedAt) / 1000);
    if (now - startedAt > 3000) watchSpeed(delta);
    running = requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduceMotion.matches || !onScreen || document.hidden) return;
    lastFrame = 0;
    sampleFrames = sampleTime = 0;
    running = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(running);
    running = 0;
  }
  const still = () => render(reduceMotion.matches || !startedAt ? 6 : (lastFrame - startedAt) / 1000);

  resize();
  render(reduceMotion.matches ? 6 : 0);
  if (stage) stage.canvas.classList.add('is-on');
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      resize();
      if (!running) still();
    }).observe(hero);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting && entry.intersectionRatio >= 0.12;
      hero.classList.toggle('is-away', !onScreen);
      onScreen ? start() : stop();
    }, { threshold: [0, 0.12] }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', () => {
      stop();
      reduceMotion.matches ? still() : start();
    });
  }
  start();

  // ---------- 7. Pointer ----------
  let heroBox = null;
  const forgetBox = () => { heroBox = null; };
  addEventListener('scroll', forgetBox, { passive: true });
  addEventListener('resize', forgetBox);
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduceMotion.matches) return;
    if (!heroBox) heroBox = hero.getBoundingClientRect();
    pointer.x = event.clientX - heroBox.left;
    pointer.y = event.clientY - heroBox.top;
    pointer.mx = (pointer.x / heroBox.width) * 2 - 1;
    pointer.my = (pointer.y / heroBox.height) * 2 - 1;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -9999;
    pointer.mx = pointer.my = 0;
  });
  hero.addEventListener('pointerdown', event => {
    if (reduceMotion.matches || !startedAt) return;
    const box = hero.getBoundingClientRect();
    pulse.x = event.clientX - box.left;
    pulse.y = event.clientY - box.top;
    pulse.at = TIME_OFFSET + (performance.now() - startedAt) / 1000;
  });

  // ---------- 8. Directory ----------
  const directory = document.querySelector('.fresh-home .directory');
  const grid = directory && directory.querySelector('.grid');
  if (!directory || !grid) return;
  const sectionTop = directory.querySelector('.section-top');
  const title = directory.querySelector('h2');
  const counter = directory.querySelector('#count');
  const groupSelect = directory.querySelector('#group');

  // Heading: words rise one after another, the last one picks up the lime-to-peach light
  if (title) {
    const words = splitWords(title, false);
    const last = title.querySelectorAll('.word')[words - 1];
    if (last) last.classList.add('glow');
  }

  // A giant outlined number behind the heading that mirrors the live subject count
  if (sectionTop && counter) {
    const ghost = make('span', 'dir-ghost', sectionTop);
    const mirror = () => {
      const amount = parseInt(counter.textContent, 10);
      const text = Number.isFinite(amount) ? String(amount) : '';
      if (ghost.textContent === text) return;
      ghost.textContent = text;
      for (const node of [ghost, counter]) {
        node.classList.remove('pop');
        void node.offsetWidth;
        node.classList.add('pop');
      }
    };
    mirror();
    new MutationObserver(mirror).observe(counter, { childList: true, characterData: true, subtree: true });
  }

  // Group filter as glowing pills. They drive the original <select>, which search.js still reads.
  if (groupSelect && groupSelect.closest('label')) {
    const nativeLabel = groupSelect.closest('label');
    const labelText = [...nativeLabel.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(' ').trim();
    const pills = document.createElement('div');
    pills.className = 'group-pills';
    pills.setAttribute('role', 'group');
    pills.setAttribute('aria-label', labelText);
    const caption = document.createElement('span');
    caption.textContent = labelText;
    caption.setAttribute('aria-hidden', 'true');
    pills.append(caption);
    const buttons = [...groupSelect.options].map(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `group-pill ${option.value}`;
      button.textContent = option.textContent;
      button.setAttribute('aria-pressed', String(option.value === groupSelect.value));
      button.addEventListener('click', () => {
        groupSelect.value = option.value;
        groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
      });
      pills.append(button);
      return button;
    });
    groupSelect.addEventListener('change', () => {
      buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(groupSelect.options[index].value === groupSelect.value)));
      directory.dataset.group = groupSelect.value;
    });
    nativeLabel.classList.add('group-native');
    nativeLabel.after(pills);
  }

  // Each card gets its own symbol as a huge watermark (text style, never emoji)
  for (const card of cards) {
    const symbol = card.querySelector('.symbol')?.textContent.trim();
    if (symbol) make('span', 'card-ghost', card).textContent = `${symbol}︎`;
  }

  // Reveal on scroll: heading first, then cards in a wave
  const reveal = [sectionTop, directory.querySelector('.filters'), ...cards].filter(Boolean);
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const seen = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, order) => {
        const node = entry.target;
        node.style.setProperty('--wait', `${order * 80}ms`);
        node.classList.add('in');
        seen.unobserve(node);
        setTimeout(() => node.classList.add('done'), 1100 + order * 80);
      });
    }, { rootMargin: '0px 0px -7% 0px' });
    reveal.forEach(node => seen.observe(node));
  } else {
    reveal.forEach(node => node.classList.add('in', 'done'));
  }

  // The pointer light and the lit card rims are drawn into one canvas laid over the section,
  // instead of a large light layer under the cards plus a repainted border on every card.
  // Only the card under the pointer is tilted, and only it keeps its own CSS rim and glow (they tilt with it).
  const REACH = 380;
  const RIM_FADE = 0.72;
  const glow = make('canvas', 'dir-glow', directory);
  const pen = glow.getContext('2d');
  const tints = new Map();
  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  let glowDpr = 1, glowW = 0, glowH = 0, gridQueued = false, gridX = -9999, gridY = -9999, tilted = null, lit = false;

  function sizeGlow() {
    glowDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    glowW = innerWidth;
    glowH = innerHeight;
    glow.width = Math.round(glowW * glowDpr);
    glow.height = Math.round(glowH * glowDpr);
  }
  const tintOf = card => {
    if (!tints.has(card)) tints.set(card, getComputedStyle(card).getPropertyValue('--tint').trim() || '#f6efd8');
    return tints.get(card);
  };
  const withAlpha = (colour, alpha) => {
    const hex = colour.replace('#', '');
    const full = hex.length === 3 ? [...hex].map(c => c + c).join('') : hex.slice(0, 6);
    const n = parseInt(full, 16);
    return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${alpha})`;
  };

  function drawGlow() {
    gridQueued = false;
    pen.setTransform(glowDpr, 0, 0, glowDpr, 0, 0);
    pen.clearRect(0, 0, glowW, glowH);
    if (!lit) return;
    // soft lime light around the pointer
    const light = pen.createRadialGradient(gridX, gridY, 0, gridX, gridY, 23 * rem());
    light.addColorStop(0, 'rgba(228, 238, 178, 0.11)');
    light.addColorStop(0.45, 'rgba(228, 238, 178, 0.04)');
    light.addColorStop(1, 'rgba(228, 238, 178, 0)');
    pen.fillStyle = light;
    pen.fillRect(gridX - 23 * rem(), gridY - 23 * rem(), 46 * rem(), 46 * rem());
    // rims of the cards near the pointer, each in its own group colour
    const radius = 17 * rem(), corner = 1.3 * rem();
    for (const card of cards) {
      if (card.hidden || card === tilted) continue;
      const box = card.getBoundingClientRect();
      if (gridX < box.left - REACH || gridX > box.right + REACH || gridY < box.top - REACH || gridY > box.bottom + REACH) continue;
      if (box.bottom < 0 || box.top > glowH) continue;
      const tint = tintOf(card);
      const rim = pen.createRadialGradient(gridX, gridY, 0, gridX, gridY, radius);
      rim.addColorStop(0, withAlpha(tint, 1));
      rim.addColorStop(RIM_FADE, withAlpha(tint, 0));
      pen.strokeStyle = rim;
      pen.lineWidth = 1.5;
      pen.beginPath();
      pen.roundRect(box.left + 0.75, box.top + 0.75, box.width - 1.5, box.height - 1.5, corner);
      pen.stroke();
    }
  }
  const queueGlow = () => {
    if (!gridQueued) {
      gridQueued = true;
      requestAnimationFrame(drawGlow);
    }
  };

  function tiltCard(card) {
    if (tilted && tilted !== card) {
      delete tilted.dataset.tilted;
      tilted.style.setProperty('--rx', '0deg');
      tilted.style.setProperty('--ry', '0deg');
    }
    tilted = card;
    if (!card) return;
    const box = card.getBoundingClientRect();
    const x = gridX - box.left, y = gridY - box.top;
    card.dataset.tilted = '1';
    card.style.setProperty('--gx', `${x.toFixed(0)}px`);
    card.style.setProperty('--gy', `${y.toFixed(0)}px`);
    card.style.setProperty('--ry', `${((x / box.width - 0.5) * 9).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${((0.5 - y / box.height) * 9).toFixed(2)}deg`);
  }

  if (glow.getContext && pen && typeof pen.roundRect === 'function') {
    sizeGlow();
    addEventListener('resize', () => { sizeGlow(); tints.clear(); queueGlow(); });
    addEventListener('scroll', () => { if (lit) queueGlow(); }, { passive: true });
    directory.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduceMotion.matches) return;
      gridX = event.clientX;
      gridY = event.clientY;
      if (!lit) {
        lit = true;
        directory.classList.add('is-lit');
      }
      tiltCard(event.target.closest && event.target.closest('.grid .card'));
      queueGlow();
    }, { passive: true });
    directory.addEventListener('pointerleave', () => {
      lit = false;
      directory.classList.remove('is-lit');
      tiltCard(null);
      queueGlow();
    });
    // filtering moves cards around, so redraw
    if (counter) new MutationObserver(queueGlow).observe(counter, { childList: true, characterData: true, subtree: true });
  } else {
    glow.remove();
  }

  // The backdrop glow only drifts while the section is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => directory.classList.toggle('is-away', !entry.isIntersecting)).observe(directory);
  }
})();
