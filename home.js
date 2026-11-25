// Fresh homepage visuals. Decorative only: no page text, link or the logo is changed.
//
//   1. Setup          shared state and helpers
//   2. Headline       letters of the first words fall into place
//   3. Ticker         two tapes of subject names and codes, read from the subject cards
//   4. Orbit chips    one chip per subject on three tilted 3D orbits around the logo
//   5. Sky            WebGL flowing light in the Fresh greens, lime and peach
//   6. Dust           WebGL particle rings that share the orbits, plus drifting motes
//   7. Loop           one animation frame drives sky, dust and chips; pauses when unseen
//   8. Pointer        parallax, spotlight, particle push and click ripples
//   9. Directory      cards rise in on scroll and tilt towards the pointer
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
  document.body.classList.add('fx');

  // Orbits, in units of the logo tile's width. `open` is how far each ring is tipped towards the viewer.
  const RINGS = [
    { r: 1.2, open: 31, roll: -17, speed: 0.105, chips: 5 },
    { r: 1.56, open: 25, roll: 21, speed: -0.074, chips: 4 },
    { r: 1.95, open: 19, roll: -5, speed: 0.052, chips: 4 },
  ];
  const CAMERA = 5.5;
  const INTRO_SECONDS = 2.6;
  const view = {
    width: 1, height: 1, unit: 230, cx: 0, cy: 0, artX: 0, artY: 0, fadeFrom: -1, fadeTo: 0,
    tileHalf: 115, tileAngle: rad(-11), stacked: false,
  };
  const pointer = { x: -9999, y: -9999, mx: 0, my: 0, sx: 0, sy: 0 };
  const pulse = { x: 0, y: 0, at: -100 };

  function measure() {
    const box = hero.getBoundingClientRect();
    view.width = box.width;
    view.height = box.height;
    view.stacked = getComputedStyle(hero).display !== 'grid';
    if (tile && tile.offsetWidth) {
      const artBox = art.getBoundingClientRect();
      view.unit = tile.offsetWidth;
      view.tileHalf = tile.offsetWidth / 2;
      view.artX = tile.offsetLeft + tile.offsetWidth / 2;
      view.artY = tile.offsetTop + tile.offsetHeight / 2;
      view.cx = artBox.left - box.left + view.artX;
      view.cy = artBox.top - box.top + view.artY;
    } else {
      view.unit = Math.min(230, box.width * 0.3);
      view.cx = box.width * 0.72;
      view.cy = box.height * 0.45;
    }
    // Rings fade out before they reach the copy so the words stay easy to read
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

  // ---------- 2. Headline ----------
  const heading = hero.querySelector('h1');
  if (heading && !reduceMotion.matches) {
    // Screen readers get the whole sentence in one piece (the line break counts as a space)
    const spoken = heading.cloneNode(true);
    spoken.querySelectorAll('br').forEach(lineBreak => lineBreak.replaceWith(' '));
    heading.setAttribute('aria-label', spoken.textContent.replace(/\s+/g, ' ').trim());
    let index = 0;
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
        for (const letter of part) {
          const span = make('span', 'ch', word);
          span.textContent = letter;
          span.style.setProperty('--i', index++);
        }
      }
      node.replaceWith(piece);
    }
  }

  // Count the subject badge up to its own number
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

  // ---------- 3. Ticker ----------
  if (cards.length) {
    const ticker = make('div', 'hero-ticker', hero);
    const fill = (className, read) => {
      const track = make('div', 'ticker-track', make('div', `ticker-band ${className}`, ticker));
      for (let copyIndex = 0; copyIndex < 4; copyIndex++) {
        for (const card of cards) {
          make('span', '', track).textContent = read(card);
          make('i', '', track);
        }
      }
    };
    fill('back', card => `${card.querySelector('.code')?.textContent.trim() || ''} ${card.querySelector('.symbol')?.textContent.trim() || ''}`);
    fill('front', card => card.querySelector('h3')?.textContent.trim() || '');
  }

  // ---------- 4. Orbit chips ----------
  const chips = [];
  if (art && cards.length) {
    make('i', 'art-pulse', art);
    make('i', 'art-pulse', art);
    const orbit = make('div', 'art-orbit', art);
    let ringIndex = 0, slot = 0;
    for (const card of cards) {
      while (ringIndex < RINGS.length - 1 && slot >= RINGS[ringIndex].chips) {
        ringIndex++;
        slot = 0;
      }
      const node = make('span', `orbit-chip ${card.dataset.group || ''}`, orbit);
      node.textContent = card.querySelector('.symbol')?.textContent.trim() || '';
      chips.push({ node, ring: ringIndex, slot: slot++ });
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
      chip.node.style.zIndex = p.z > 0 ? '4' : '1';
    }
  }

  // ---------- 5 and 6. WebGL layers ----------
  function createProgram(gl, vertexSource, fragmentSource) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return program;
  }
  const uniforms = (gl, program, names) => Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));

  // 5. Sky: slow, folded noise coloured only with the Fresh palette, plus rays from behind the logo
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
      colour *= mix(0.25, 1.0, uIntro);
      gl_FragColor = vec4(colour, 1.0);
    }`;

  function createSky() {
    const canvas = make('canvas', 'hero-sky');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const program = createProgram(gl, 'attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }', SKY_FRAGMENT);
    const u = uniforms(gl, program, ['uRes', 'uLogo', 'uPointer', 'uTime', 'uIntro', 'uStacked']);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const corner = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(corner);
    gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);
    hero.prepend(canvas);
    const sky = {
      canvas,
      scale: 0.5,
      resize() {
        canvas.width = Math.max(2, Math.round(view.width * sky.scale));
        canvas.height = Math.max(2, Math.round(view.height * sky.scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw(time, intro) {
        gl.uniform2f(u.uRes, canvas.width, canvas.height);
        gl.uniform2f(u.uLogo, view.cx / view.width, 1 - view.cy / view.height);
        gl.uniform2f(u.uPointer, 0.5 + pointer.sx * 0.5, 0.5 - pointer.sy * 0.5);
        gl.uniform1f(u.uTime, time);
        gl.uniform1f(u.uIntro, intro);
        gl.uniform1f(u.uStacked, view.stacked ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
    return sky;
  }

  // 6. Dust: every particle is moved on the GPU, so thousands cost almost nothing
  const DUST_VERTEX = `
    attribute vec4 aSeed;
    attribute float aKind;
    uniform vec2 uView, uCenter, uPointer, uTilt, uFade, uTile;
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

        // The logo tile hides what passes behind it and dims what passes in front
        vec2 fromTile = pos - uCenter;
        fromTile = vec2(fromTile.x * cos(uTile.y) + fromTile.y * sin(uTile.y), -fromTile.x * sin(uTile.y) + fromTile.y * cos(uTile.y));
        float overTile = 1.0 - smoothstep(uTile.x - 6.0, uTile.x + 10.0, max(abs(fromTile.x), abs(fromTile.y)));
        alpha *= p.z < 0.0 ? 1.0 - overTile : 1.0 - 0.6 * overTile;
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
      float alpha = edge * edge * vAlpha;
      gl_FragColor = vec4(vColour * alpha, alpha);
    }`;

  function createDust() {
    const canvas = make('canvas', 'hero-dust');
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return null;
    const program = createProgram(gl, DUST_VERTEX, DUST_FRAGMENT);
    const u = uniforms(gl, program, ['uView', 'uCenter', 'uPointer', 'uTilt', 'uFade', 'uTile', 'uPulse', 'uDpr', 'uTime', 'uUnit', 'uIntro', 'uR', 'uOpen', 'uRoll', 'uSpeed']);
    const perRing = [3200, 3600, 4000];
    const motes = 900;
    const count = perRing.reduce((sum, value) => sum + value, 0) + motes;
    const data = new Float32Array(count * 5);
    let cursor = 0;
    const add = kind => {
      for (let i = 0; i < 4; i++) data[cursor++] = Math.random();
      data[cursor++] = kind;
    };
    // Motes first, so a slow device can simply draw fewer ring particles
    for (let i = 0; i < motes; i++) add(3);
    for (let i = 0; i < Math.max(...perRing); i++) perRing.forEach((amount, kind) => { if (i < amount) add(kind); });
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.useProgram(program);
    const seed = gl.getAttribLocation(program, 'aSeed');
    const kind = gl.getAttribLocation(program, 'aKind');
    gl.enableVertexAttribArray(seed);
    gl.vertexAttribPointer(seed, 4, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(kind);
    gl.vertexAttribPointer(kind, 1, gl.FLOAT, false, 20, 16);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    hero.append(canvas);
    const dust = {
      canvas,
      count,
      dpr: 1,
      resize() {
        dust.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.max(2, Math.round(view.width * dust.dpr));
        canvas.height = Math.max(2, Math.round(view.height * dust.dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw(time, intro, rotX, rotY) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.uView, view.width, view.height);
        gl.uniform2f(u.uCenter, view.cx, view.cy);
        gl.uniform2f(u.uPointer, pointer.x, pointer.y);
        gl.uniform2f(u.uTilt, rotX, rotY);
        gl.uniform2f(u.uFade, view.fadeFrom, view.fadeTo);
        gl.uniform2f(u.uTile, tile && tile.offsetWidth ? view.tileHalf : 0, view.tileAngle);
        gl.uniform3f(u.uPulse, pulse.x, pulse.y, Math.max(0, time - pulse.at));
        gl.uniform1f(u.uDpr, dust.dpr);
        gl.uniform1f(u.uTime, time);
        gl.uniform1f(u.uUnit, view.unit);
        gl.uniform1f(u.uIntro, intro);
        gl.uniform1fv(u.uR, RINGS.map(ring => ring.r));
        gl.uniform1fv(u.uOpen, RINGS.map(ring => rad(ring.open)));
        gl.uniform1fv(u.uRoll, RINGS.map((ring, index) => ringRoll(ring, index, time)));
        gl.uniform1fv(u.uSpeed, RINGS.map(ring => ring.speed));
        gl.drawArrays(gl.POINTS, 0, dust.count);
      },
    };
    return dust;
  }

  let sky = null, dust = null;
  try { sky = createSky(); } catch (error) { sky = null; }
  try { dust = createDust(); } catch (error) { dust = null; }
  make('div', 'hero-spot', hero);
  make('div', 'hero-grain', hero);
  for (const layer of [sky, dust]) {
    if (!layer) continue;
    layer.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      layer.canvas.style.display = 'none';
      if (layer === sky) sky = null; else dust = null;
    });
  }

  // ---------- 7. Loop ----------
  const TIME_OFFSET = 40; // start mid-flow so the first frame already has shape
  let running = 0, startedAt = 0, lastFrame = 0, onScreen = true, slowFrames = 0, measured = 0;

  function resize() {
    measure();
    if (sky) sky.resize();
    if (dust) dust.resize();
  }

  function render(seconds) {
    const intro = reduceMotion.matches ? 1 : Math.min(1, seconds / INTRO_SECONDS);
    const time = TIME_OFFSET + seconds;
    const rotX = pointer.sy * -0.16;
    const rotY = pointer.sx * 0.24;
    if (sky) sky.draw(time, easeOut(intro * 1.4));
    if (dust) dust.draw(time, intro, rotX, rotY);
    placeChips(time, intro, rotX, rotY);
  }

  function frame(now) {
    if (!startedAt) startedAt = now;
    const delta = lastFrame ? now - lastFrame : 16;
    lastFrame = now;
    pointer.sx += (pointer.mx - pointer.sx) * 0.06;
    pointer.sy += (pointer.my - pointer.sy) * 0.06;
    render((now - startedAt) / 1000);

    // If the device struggles, lower the sky resolution first, then thin the dust
    if (delta < 200 && ++measured > 45) {
      slowFrames += delta > 30 ? 1 : -0.5;
      slowFrames = Math.max(0, slowFrames);
      if (slowFrames > 40) {
        slowFrames = 0;
        measured = 0;
        if (sky && sky.scale > 0.26) {
          sky.scale *= 0.7;
          sky.resize();
        } else if (dust && dust.count > 3500) {
          dust.count = Math.round(dust.count * 0.65);
        }
      }
    }
    running = requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduceMotion.matches || !onScreen || document.hidden) return;
    lastFrame = 0;
    running = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(running);
    running = 0;
  }

  resize();
  render(reduceMotion.matches ? 6 : 0);
  if (sky) sky.canvas.classList.add('is-on');
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      resize();
      if (!running) render(reduceMotion.matches ? 6 : (lastFrame - startedAt) / 1000 || 6);
    }).observe(hero);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? start() : stop();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', () => {
      stop();
      reduceMotion.matches ? render(6) : start();
    });
  }
  start();

  // ---------- 8. Pointer ----------
  let pointerQueued = false;
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduceMotion.matches) return;
    const box = hero.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.mx = (pointer.x / box.width) * 2 - 1;
    pointer.my = (pointer.y / box.height) * 2 - 1;
    if (pointerQueued) return;
    pointerQueued = true;
    requestAnimationFrame(() => {
      hero.style.setProperty('--px', `${pointer.x.toFixed(0)}px`);
      hero.style.setProperty('--py', `${pointer.y.toFixed(0)}px`);
      hero.style.setProperty('--mx', pointer.mx.toFixed(3));
      hero.style.setProperty('--my', pointer.my.toFixed(3));
      pointerQueued = false;
    });
  });
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

  // ---------- 9. Directory ----------
  const sectionTop = document.querySelector('.directory .section-top');
  const reveal = [sectionTop, ...cards].filter(Boolean);
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const seen = new IntersectionObserver(entries => {
      const arriving = entries.filter(entry => entry.isIntersecting);
      arriving.forEach((entry, order) => {
        const node = entry.target;
        node.style.setProperty('--wait', `${order * 70}ms`);
        node.classList.add('in');
        seen.unobserve(node);
        setTimeout(() => node.style.removeProperty('--wait'), 900 + order * 70);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(node => seen.observe(node));
  } else {
    reveal.forEach(node => node.classList.add('in'));
  }
  for (const card of cards) {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduceMotion.matches) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }
})();
