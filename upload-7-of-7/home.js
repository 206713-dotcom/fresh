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

// ---------------------------------------------------------------------------
// Since 1958 feature band
// A live starfield, a real Moon and Earth drawn with WebGL from the app's own
// maps (with a probe on a tilted orbit), a clock that runs from 1958 to today,
// and a launch button that warps into the experience.
// ---------------------------------------------------------------------------
(() => {
  const band = document.querySelector('.s58');
  if (!band) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
  const TEX = 'since-1958/textures/';
  let visible = false;

  // ---------------------------------------------------------------- stars
  const sky = band.querySelector('.s58-sky');
  const sg = sky.getContext('2d');
  let stars = [];
  const sizeSky = () => {
    const r = band.getBoundingClientRect(), d = DPR();
    sky.width = Math.round(r.width * d);
    sky.height = Math.round(r.height * d);
    const n = Math.round(Math.min(900, r.width * r.height / 1400));
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    stars = Array.from({ length: n }, () => {
      const m = Math.pow(rnd(), 3.2);                         // most stars faint, a few bright
      const tint = rnd();
      return {
        x: rnd(), y: rnd(), z: 0.25 + rnd() * 0.75,
        r: (0.35 + m * 1.6) * d, a: 0.25 + m * 0.75,
        c: tint < 0.12 ? '246,187,131' : tint < 0.25 ? '228,238,178' : '246,239,216',
        tw: rnd() * 6.28, sp: 0.6 + rnd() * 2.2,
      };
    });
  };
  const drawSky = (t, px, py) => {
    const W = sky.width, H = sky.height;
    sg.clearRect(0, 0, W, H);
    // a faint band of Milky Way across the top corner
    const mw = sg.createLinearGradient(W * 0.1, 0, W * 0.75, H);
    mw.addColorStop(0, 'rgba(246,239,216,0)');
    mw.addColorStop(0.45, 'rgba(228,238,178,0.035)');
    mw.addColorStop(0.55, 'rgba(246,187,131,0.03)');
    mw.addColorStop(1, 'rgba(246,239,216,0)');
    sg.fillStyle = mw;
    sg.fillRect(0, 0, W, H);
    for (const s of stars) {
      const x = ((s.x + px * 0.012 * s.z + t * 0.0016 * s.z) % 1 + 1) % 1 * W;
      const y = (s.y + py * 0.01 * s.z) * H;
      const a = s.a * (0.7 + 0.3 * Math.sin(t * s.sp + s.tw));
      sg.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
      sg.beginPath();
      sg.arc(x, y, s.r, 0, 6.2832);
      sg.fill();
      if (s.r > 1.5 * DPR()) {                                  // the brightest get a soft cross
        sg.fillStyle = `rgba(${s.c},${(a * 0.18).toFixed(3)})`;
        sg.fillRect(x - s.r * 5, y - 0.5, s.r * 10, 1);
        sg.fillRect(x - 0.5, y - s.r * 5, 1, s.r * 10);
      }
    }
  };

  // ---------------------------------------------------------------- Moon and Earth (WebGL)
  const art = band.querySelector('.s58-art');
  const globe = band.querySelector('.s58-globe');
  const fx = band.querySelector('.s58-fx');
  const fg = fx.getContext('2d');
  const gl = globe.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  let prog = null, U = {}, texMoon = null, texEarth = null, texCloud = null, ready = 0;

  const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const FRAG = `
precision highp float;
uniform sampler2D uMap; uniform sampler2D uCloud;
uniform vec3 uC;        // centre x, y and radius, in device pixels
uniform float uRot, uTilt, uKind, uTime;
uniform vec3 uL;        // direction to the Sun, view space
vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
void main(){
  vec2 d = (gl_FragCoord.xy - uC.xy) / uC.z;
  float r = length(d);
  float edge = 1.5 / uC.z;
  if (r > 1.0 - edge * 0.5) {
    if (uKind < 0.5 || r > 1.22) discard;
    // Earth's thin blue air, lit on the sunward limb
    vec3 n = normalize(vec3(d / r, 0.0));
    float lit = smoothstep(-0.35, 0.6, dot(n, uL));
    float g = exp(-(r - 1.0) * 26.0) * lit;
    vec3 c = vec3(0.32, 0.58, 1.0) * g * 0.9;
    gl_FragColor = vec4(c, g * 0.9);
    return;
  }
  vec3 n = vec3(d, sqrt(max(0.0, 1.0 - r * r)));
  float ct = cos(uTilt), st = sin(uTilt);
  vec3 q = vec3(n.x, ct * n.y - st * n.z, st * n.y + ct * n.z);
  float lon = atan(q.x, q.z) + uRot;
  float lat = asin(clamp(q.y, -1.0, 1.0));
  vec2 uv = vec2(0.5 + lon / 6.2831853, 0.5 + lat / 3.1415927);
  vec3 alb = lin(texture2D(uMap, uv).rgb);
  float mu = max(dot(n, uL), 0.0);
  vec3 col;
  if (uKind < 0.5) {
    // the Moon: Lommel-Seeliger, so the full disc stays bright to the edge
    float ls = mu > 0.0 ? 2.0 * mu / (mu + n.z + 1e-3) : 0.0;
    col = alb * mix(mu, ls, 0.75) * 1.35;
    col += alb * 0.012;                                   // a little earthshine on the night side
  } else {
    float cl = texture2D(uCloud, uv + vec2(uTime * 0.0006, 0.0)).r;
    vec3 base = mix(alb, vec3(0.92), cl * 0.85);
    float water = step(alb.b, alb.r * 0.9 + 0.02) < 0.5 ? 1.0 : 0.0;
    vec3 h = normalize(uL + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, h), 0.0), 60.0) * water * (1.0 - cl) * 0.5;
    col = base * mu * 1.25 + vec3(1.0, 0.95, 0.85) * spec;
    float rim = pow(1.0 - n.z, 3.0);
    col = mix(col, vec3(0.35, 0.6, 1.0) * smoothstep(-0.2, 0.5, dot(n, uL)), rim * 0.6);
  }
  col = col / (1.0 + col * 0.35);                         // gentle shoulder
  col = pow(col, vec3(1.0 / 2.2));
  float a = 1.0 - smoothstep(1.0 - edge, 1.0, r);
  gl_FragColor = vec4(col * a, a);
}`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const texture = (src, onload) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([40, 40, 40, 255]));
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);                       // every map here is a power of two wide and high
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
      if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
      onload && onload(t);
      if (!visible) frame(performance.now(), true);
    };
    img.src = src;
    return t;
  };
  const setupGL = () => {
    if (!gl || prog) return !!prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) {
      console.warn('Since 1958 globe:', e);
      prog = null;
      return false;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uMap', 'uCloud', 'uC', 'uRot', 'uTilt', 'uKind', 'uTime', 'uL']) U[n] = gl.getUniformLocation(prog, n);
    gl.uniform1i(U.uMap, 0);
    gl.uniform1i(U.uCloud, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    texMoon = texture(TEX + 'moon.jpg', () => {
      ready |= 1;
      // a sharper Moon once the small one is up
      const big = texture(TEX + 'moon_4k.jpg', () => { texMoon = big; });
    });
    texEarth = texture(TEX + 'earth_day.jpg', () => { ready |= 2; });
    texCloud = texture(TEX + 'earth_clouds.jpg');
    art.classList.add('has-gl');
    return true;
  };
  const sizeArt = () => {
    const r = art.getBoundingClientRect(), d = DPR();
    for (const c of [globe, fx]) { c.width = Math.round(r.width * d); c.height = Math.round(r.height * d); }
    if (gl) gl.viewport(0, 0, globe.width, globe.height);
  };
  // Light from the upper left: a fat crescent on both worlds, like a NASA photo.
  const SUN = (() => { const v = [-0.78, 0.36, 0.52], l = Math.hypot(...v); return v.map(x => x / l); })();
  const drawBody = (kind, tex, cx, cy, R, rot, tilt, t) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texCloud || tex);
    gl.uniform3f(U.uC, cx, globe.height - cy, R);
    gl.uniform1f(U.uRot, rot);
    gl.uniform1f(U.uTilt, tilt);
    gl.uniform1f(U.uKind, kind);
    gl.uniform1f(U.uTime, t);
    gl.uniform3f(U.uL, SUN[0], SUN[1], SUN[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // The probe on its tilted orbit round the Moon, with a fading trail.
  const drawProbe = (t, mx, my, mR) => {
    const W = fx.width, H = fx.height;
    fg.clearRect(0, 0, W, H);
    const a = 1.32, inc = 1.18, node = -0.42;               // orbit radius (Moon radii), tilt, turn
    const P = th => {
      const x = Math.cos(th) * a, z = Math.sin(th) * a;
      const y = -z * Math.sin(inc), z2 = z * Math.cos(inc);
      const xr = x * Math.cos(node) - y * Math.sin(node), yr = x * Math.sin(node) + y * Math.cos(node);
      return [mx + xr * mR, my - yr * mR, z2];
    };
    const hidden = ([x, y, z]) => z < 0 && Math.hypot(x - mx, y - my) < mR * 1.01;
    const th0 = t * 0.55;
    // faint full orbit
    fg.lineWidth = Math.max(1, mR * 0.006);
    for (let i = 0; i < 160; i++) {
      const p = P((i / 160) * 6.2832), q = P(((i + 1) / 160) * 6.2832);
      if (hidden(p) || hidden(q)) continue;
      fg.strokeStyle = p[2] < 0 ? 'rgba(228,238,178,0.10)' : 'rgba(228,238,178,0.22)';
      fg.beginPath(); fg.moveTo(p[0], p[1]); fg.lineTo(q[0], q[1]); fg.stroke();
    }
    // trail
    fg.lineWidth = Math.max(1.5, mR * 0.014);
    for (let i = 0; i < 40; i++) {
      const p = P(th0 - i * 0.018), q = P(th0 - (i + 1) * 0.018);
      if (hidden(p) || hidden(q)) continue;
      fg.strokeStyle = `rgba(246,187,131,${(0.75 * (1 - i / 40)).toFixed(3)})`;
      fg.beginPath(); fg.moveTo(p[0], p[1]); fg.lineTo(q[0], q[1]); fg.stroke();
    }
    const p = P(th0);
    if (!hidden(p)) {
      const g = fg.createRadialGradient(p[0], p[1], 0, p[0], p[1], mR * 0.09);
      g.addColorStop(0, 'rgba(255,253,243,1)');
      g.addColorStop(0.25, 'rgba(246,187,131,0.65)');
      g.addColorStop(1, 'rgba(246,187,131,0)');
      fg.fillStyle = g;
      fg.beginPath(); fg.arc(p[0], p[1], mR * 0.09, 0, 6.2832); fg.fill();
    }
  };

  // ---------------------------------------------------------------- the 1958 → today clock
  const NOW = new Date().getUTCFullYear() + new Date().getUTCMonth() / 12;
  const EVENTS = [
    [1958.8, 'NASA is founded'],
    [1966.4, 'Surveyor 1 lands on the Moon'],
    [1969.55, 'Apollo 11 lands on the Moon'],
    [1971.58, 'First rover drive on the Moon'],
    [1972.95, 'Apollo 17, the last crew on the Moon'],
    [1976.55, 'Viking 1 lands on Mars'],
    [1977.7, 'Voyager 1 sets off'],
    [1990.3, 'Hubble reaches orbit'],
    [1997.5, 'Sojourner rolls onto Mars'],
    [2004.05, 'Spirit and Opportunity land on Mars'],
    [2012.6, 'Curiosity lands; Voyager 1 leaves the heliosphere'],
    [2018.9, 'InSight lands on Mars'],
    [2021.15, 'Perseverance and Ingenuity land on Mars'],
    [2021.98, 'James Webb launches'],
  ];
  const track = band.querySelector('.s58-track');
  const yearEl = band.querySelector('[data-s58-year]');
  const eventEl = band.querySelector('[data-s58-event]');
  const SPAN = NOW - 1958;
  const dots = EVENTS.map(([y]) => {
    const i = document.createElement('i');
    i.style.setProperty('--x', ((y - 1958) / SPAN).toFixed(4));
    track.append(i);
    return i;
  });
  let shownEvent = -1;
  const setClock = f => {
    band.style.setProperty('--s58-t', f.toFixed(4));
    const year = 1958 + f * SPAN;
    yearEl.textContent = Math.min(Math.floor(year), Math.floor(NOW));
    let k = 0;
    EVENTS.forEach(([y], i) => { const on = y <= year; dots[i].classList.toggle('is-on', on); if (on) k = i; });
    if (k !== shownEvent) {
      shownEvent = k;
      eventEl.classList.add('is-swap');
      setTimeout(() => { eventEl.textContent = EVENTS[k][1]; eventEl.classList.remove('is-swap'); }, 180);
    }
  };
  const CLOCK_RUN = 11, CLOCK_HOLD = 3.5;

  // ---------------------------------------------------------------- stats count up
  const counts = [...band.querySelectorAll('[data-s58-count]')];
  let countStart = 0;

  // ---------------------------------------------------------------- loop
  let raf = 0, t0 = 0, px = 0, py = 0, tpx = 0, tpy = 0;
  function frame(now, once) {
    if (!once) raf = visible && !document.hidden && !reduce.matches ? requestAnimationFrame(frame) : 0;
    if (!t0) t0 = now;
    const t = reduce.matches ? 40 : (now - t0) / 1000;
    px += (tpx - px) * 0.06;
    py += (tpy - py) * 0.06;
    drawSky(t, px, py);
    // clock
    const cyc = t % (CLOCK_RUN + CLOCK_HOLD);
    const f = reduce.matches ? 1 : Math.min(1, cyc / CLOCK_RUN);
    setClock(f * f * (3 - 2 * f) * 0.2 + f * 0.8);
    // counters
    if (countStart) {
      const k = Math.min(1, (now - countStart) / 1400);
      counts.forEach(b => { b.textContent = Math.round(+b.dataset.s58Count * (1 - Math.pow(1 - k, 3))); });
      if (k >= 1) countStart = 0;
    }
    if (!prog || !ready) return;
    const W = globe.width, H = globe.height;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Earth far behind on the upper left, the Moon close in front on the lower right
    const eR = W * 0.15, ex = W * (0.3 + px * 0.012), ey = H * (0.3 + py * 0.012);
    const mR = W * 0.3, mx = W * (0.6 - px * 0.02), my = H * (0.6 - py * 0.02);
    if (ready & 2) drawBody(1, texEarth, ex, ey, eR, 2.3 + t * 0.05, 0.25, t);
    if (ready & 1) drawBody(0, texMoon, mx, my, mR, -0.4 + t * 0.03, 0.12, t);
    drawProbe(t, mx, my, mR);
  }
  const start = () => { if (!raf && visible && !reduce.matches) raf = requestAnimationFrame(frame); };

  const resize = () => { sizeSky(); sizeArt(); frame(performance.now(), true); };
  addEventListener('resize', () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 120); });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) {
      if (!prog) { setupGL(); resize(); }
      if (!band.classList.contains('is-in')) {
        band.classList.add('is-in');
        if (!reduce.matches) countStart = performance.now();
      }
      start();
    }
  }, { rootMargin: '200px 0px' }) : null;
  if (io) io.observe(band);
  else { visible = true; setupGL(); resize(); band.classList.add('is-in'); start(); }
  document.addEventListener('visibilitychange', start);
  if (reduce.addEventListener) reduce.addEventListener('change', () => { start(); frame(performance.now(), true); });

  // pointer parallax over the whole band, and a small tilt on the button
  const launch = band.querySelector('[data-s58-launch]');
  band.addEventListener('pointermove', e => {
    if (!fine.matches || reduce.matches) return;
    const r = band.getBoundingClientRect();
    tpx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tpy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    band.style.setProperty('--s58-px', tpx.toFixed(3));
    band.style.setProperty('--s58-py', tpy.toFixed(3));
  });
  launch.addEventListener('pointermove', e => {
    if (!fine.matches || reduce.matches) return;
    const r = launch.getBoundingClientRect();
    launch.style.setProperty('--s58-bx', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2));
    launch.style.setProperty('--s58-by', (-((e.clientY - r.top) / r.height - 0.5) * 14).toFixed(2));
  });
  launch.addEventListener('pointerleave', () => { launch.style.setProperty('--s58-bx', 0); launch.style.setProperty('--s58-by', 0); });

  // ---------------------------------------------------------------- the warp
  let warp = null;
  const onLaunch = e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (reduce.matches) return;                               // plain navigation
    e.preventDefault();
    const href = e.currentTarget.href;
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    warp = document.createElement('div');
    warp.className = 's58-warp';
    warp.innerHTML = '<canvas></canvas><p><small>Launching</small>Since 1958:<em>Beyond</em></p>';
    document.body.append(warp);
    const c = warp.querySelector('canvas'), g = c.getContext('2d'), d = DPR();
    c.width = innerWidth * d; c.height = innerHeight * d;
    const W = c.width, H = c.height, N = 520;
    const pts = Array.from({ length: N }, () => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random(), c: Math.random() }));
    const begin = performance.now();
    requestAnimationFrame(() => warp.classList.add('is-on'));
    const step = now => {
      if (!warp || gone) return;
      // (a frame's timestamp can be a little earlier than the click itself)
      const s = Math.max(0, (now - begin) / 1000);
      const speed = 0.15 + Math.pow(s, 2.2) * 2.6;
      g.fillStyle = 'rgba(3,8,6,0.35)';
      g.fillRect(0, 0, W, H);
      g.lineCap = 'round';
      for (const p of pts) {
        const z0 = p.z;
        p.z -= speed * 0.016;
        if (p.z <= 0.02) { p.x = (Math.random() - 0.5) * 2; p.y = (Math.random() - 0.5) * 2; p.z = 1; continue; }
        const k0 = 0.5 / z0, k1 = 0.5 / p.z;
        const x0 = W / 2 + p.x * k0 * W * 0.5, y0 = H / 2 + p.y * k0 * W * 0.5;
        const x1 = W / 2 + p.x * k1 * W * 0.5, y1 = H / 2 + p.y * k1 * W * 0.5;
        const a = Math.min(1, (1 - p.z) * 1.4);
        g.strokeStyle = p.c < 0.15 ? `rgba(246,187,131,${a})` : p.c < 0.3 ? `rgba(228,238,178,${a})` : `rgba(246,239,216,${a})`;
        g.lineWidth = (1 - p.z) * 2.6 * d;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      }
      if (s > 1.05) {                                          // the flash on arrival
        const k = Math.min(1, (s - 1.05) / 0.35);
        g.fillStyle = `rgba(246,239,216,${k * 0.9})`;
        g.fillRect(0, 0, W, H);
      }
      if (s > 1.45) go(); else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(go, 2200);                                       // in case frames are throttled
  };
  for (const el of document.querySelectorAll('[data-s58-launch], [data-space-warp]')) el.addEventListener('click', onLaunch);

  // coming back with the Back button: clear the warp
  addEventListener('pageshow', e => { if (e.persisted && warp) { warp.remove(); warp = null; } });
})();

// ---------------------------------------------------------------------------
// "Explore space" button in the hero: a little window onto space, with stars
// that stream past faster while the pointer is on it.
// ---------------------------------------------------------------------------
(() => {
  const cta = document.querySelector('.space-cta');
  if (!cta) return;
  const c = cta.querySelector('.space-cta-sky'), g = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let W = 0, H = 0, stars = [], speed = 0.06, target = 0.06, raf = 0, on = true, last = 0;
  const size = () => {
    const r = cta.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = c.width = Math.round(r.width * d); H = c.height = Math.round(r.height * d);
    stars = Array.from({ length: Math.round(r.width * r.height / 170) }, () => ({ x: Math.random() * W, y: Math.random() * H, z: 0.2 + Math.random() * 0.8, t: Math.random() * 6.3 }));
  };
  const draw = now => {
    raf = on && !reduce.matches ? requestAnimationFrame(draw) : 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    speed += (target - speed) * Math.min(1, dt * 4);
    g.clearRect(0, 0, W, H);
    const d = Math.min(devicePixelRatio || 1, 2);
    for (const s of stars) {
      s.x -= speed * s.z * W * dt;
      if (s.x < -20) { s.x = W + Math.random() * 20; s.y = Math.random() * H; }
      const a = (0.35 + 0.65 * s.z) * (0.75 + 0.25 * Math.sin(now / 400 + s.t));
      const len = Math.max(0, speed - 0.1) * s.z * s.z * 70 * d;
      g.strokeStyle = g.fillStyle = s.z > 0.85 ? `rgba(246,187,131,${a})` : s.z > 0.7 ? `rgba(228,238,178,${a})` : `rgba(246,239,216,${a})`;
      if (len > 1) { g.globalAlpha = 0.75; g.lineWidth = s.z * 1.3 * d; g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(s.x + len, s.y); g.stroke(); g.globalAlpha = 1; }
      else { g.beginPath(); g.arc(s.x, s.y, s.z * 1.1 * d, 0, 6.2832); g.fill(); }
    }
  };
  const start = () => { if (!raf && on && !reduce.matches) { last = 0; raf = requestAnimationFrame(draw); } };
  size(); draw(performance.now());
  addEventListener('resize', () => { size(); draw(performance.now()); });
  cta.addEventListener('pointerenter', () => { target = 0.9; });
  cta.addEventListener('pointerleave', () => { target = 0.06; cta.style.setProperty('--sx', 0); cta.style.setProperty('--sy', 0); });
  cta.addEventListener('pointermove', e => {
    if (reduce.matches || e.pointerType !== 'mouse') return;
    const r = cta.getBoundingClientRect();
    cta.style.setProperty('--sx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(2));
    cta.style.setProperty('--sy', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(2));
  });
  cta.addEventListener('focus', () => { target = 0.9; });
  cta.addEventListener('blur', () => { target = 0.06; });
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { on = e.isIntersecting; start(); }).observe(cta);
  document.addEventListener('visibilitychange', () => { on = !document.hidden; start(); });
  start();
})();
