/* Geodesic — KS3 and GCSE topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw;
  const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);
  function ticks(lo, hi, n = 5) {
    const raw = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    const st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
    return [Math.ceil(lo / st) * st, Math.floor(hi / st) * st, st];
  }
  function along(pts, d) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    d = ((d % L) + L) % L;
    for (let i = 1; i < pts.length; i++) { if (d <= seg[i - 1]) { const f = d / seg[i - 1]; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; } d -= seg[i - 1]; }
    return pts[0];
  }
  const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  WL.util = { ticks, along, plen };

  /* ------------------------------------------------------------ KS3 */
  WL.topic({
    id: 'ks3-speed', stage: 'ks3', strand: 'M', title: 'Speed & Motion Graphs',
    summary: 'Speed is distance covered per second. On a distance–time graph it is the slope of the line.',
    maths: [['Dividing & rearranging', 'v = d/t ⇔ d = vt ⇔ t = d/v'], ['Straight-line graphs', 'y = mx + c: m is the gradient'], ['Gradient', 'rise ÷ run between two points'], ['Unit conversion', '1 m/s = 3.6 km/h']],
    idea: 'If something covers the same distance every second, plotting distance against time gives a straight line. The steeper the line, the faster it goes, so <em>speed is the gradient</em>.',
    anim: {
      duration: 13, alt: 'A car moving at constant speed above a distance–time graph that draws a straight line.',
      params: [{ id: 'v', label: 'Speed v', unit: 'm/s', min: 1, max: 6, step: 0.5, value: 4 }],
      beats: [[0, 'A car moves at a constant speed v.'], [3, 'Every second it covers the same distance: the yellow marks are evenly spaced.'], [6.5, 'Plot distance against time and you get a straight line.'], [10, 'Gradient = Δd ÷ Δt = speed. Change v and watch the slope change.']],
      draw(s, t) {
        const v = s.p.v, tc = t < 12 ? Math.min(t, 10) : WL.cyc(t - 12, 10, 2);
        const x0 = 70, sx = 820 / 60, ry = 118;
        s.line(x0, ry + 22, 890, ry + 22, { c: C.dim, w: 2, p: s.in(t, 0, 1) });
        for (let m = 0; m <= 60; m += 10) { const X = x0 + m * sx; s.line(X, ry + 17, X, ry + 27, { c: C.dim, w: 1.5 }); s.txt(m + ' m', X, ry + 44, { c: C.dim, size: 13, align: 'center', sans: true }); }
        const n = Math.floor(tc + 1e-6);
        s.alpha(s.in(t, 3, 1), () => { for (let k = 1; k <= n; k++) { const X = x0 + v * k * sx; s.dot(X, ry + 22, { c: C.yellow, r: 5 }); s.txt(k + ' s', X, ry - 34, { c: C.yellow, size: 13, align: 'center', sans: true }); } });
        const cx = x0 + v * tc * sx;
        s.rect(cx - 30, ry - 12, 56, 20, { c: C.blue, fill: C.blue, fa: 0.35, w: 2 });
        s.poly([[cx - 20, ry - 12], [cx - 12, ry - 26], [cx + 10, ry - 26], [cx + 18, ry - 12]], { c: C.blue, w: 2 });
        s.circle(cx - 18, ry + 12, 7, { c: C.ink, w: 2, fill: C.bg }); s.circle(cx + 14, ry + 12, 7, { c: C.ink, w: 2, fill: C.bg });
        const A = s.axes({ x0: 110, y0: 490, w: 740, h: 250, xr: [0, 10], yr: [0, 60], xt: [0, 10, 2], yt: [0, 60, 20], xl: 't / s', yl: 'd / m' });
        A.draw(s.in(t, 0.5, 1.5));
        s.alpha(s.in(t, 3, 1), () => { for (let k = 1; k <= n; k++) { s.line(A.X(k), A.Y(0), A.X(k), A.Y(v * k), { c: C.yellow, w: 1, dash: [3, 5], a: 0.5 }); s.dot(A.X(k), A.Y(v * k), { c: C.yellow, r: 4 }); } });
        A.fn((x) => v * x, 0, tc, { c: C.blue, w: 4 });
        s.dot(A.X(tc), A.Y(v * tc), { c: C.red, r: 7 });
        const g = s.in(t, 10, 1);
        if (g > 0) {
          const X1 = A.X(2), X2 = A.X(6), Y1 = A.Y(2 * v), Y2 = A.Y(6 * v);
          s.line(X1, Y1, X2, Y1, { c: C.green, w: 3, p: g });
          s.line(X2, Y1, X2, Y2, { c: C.red, w: 3, p: s.in(t, 10.6, 0.8) });
          s.txt('Δt = 4 s', (X1 + X2) / 2, Y1 + 20, { c: C.green, size: 18, align: 'center', p: g });
          s.txt('Δd = ' + f1(4 * v) + ' m', X2 + 12, (Y1 + Y2) / 2, { c: C.red, size: 18, p: s.in(t, 10.6, 0.8) });
          s.txt('gradient = Δd ÷ Δt = ' + f1(v) + ' m/s', 860, 214, { c: C.yellow, size: 22, align: 'right', p: s.in(t, 11.2, 1) });
        }
      }
    },
    steps: [
      { say: 'Speed is defined as distance travelled per unit time.', tex: R`\text{speed} = \frac{\text{distance}}{\text{time}} \quad\Longrightarrow\quad v = \frac{d}{t}`, why: 'This is a definition, not something we prove. “Per” means “divided by”: metres per second = metres ÷ seconds.' },
      { say: 'At constant speed, each second adds the same distance v.', tex: R`d(1) = v,\quad d(2) = 2v,\quad d(3) = 3v,\ \dots \;\Longrightarrow\; d = v\,t`, why: 'Constant speed means equal distances in equal times. Adding v once per second, t times over, gives vt.' },
      { say: 'Compare with the equation of a straight line.', tex: R`y = m\,x + c \quad\longleftrightarrow\quad d = v\,t + 0`, why: 'd plays the role of y and t plays x. The car starts at d = 0, so c = 0 and the line passes through the origin.' },
      { say: 'So the gradient of the distance–time graph is the speed.', tex: R`\text{gradient} = \frac{\Delta d}{\Delta t} = \frac{v t_2 - v t_1}{t_2 - t_1} = \frac{v\,(t_2 - t_1)}{t_2 - t_1} = v`, why: 'Gradient = rise ÷ run. Factor v out of the top and (t₂ − t₁) cancels. It does not matter which two points you choose; that is exactly what makes the line straight.' },
      { say: 'If the speed changes, use the average speed.', tex: R`\bar v = \frac{\text{total distance}}{\text{total time}}`, why: 'When the line curves, its steepness differs from place to place. Total ÷ total gives one constant speed that would cover the same distance in the same time.' }
    ],
    result: R`v = \frac{d}{t} = \text{gradient of the } d\text{–}t \text{ graph}`,
    assumptions: ['Speed is a scalar: direction is ignored. Velocity (GCSE) adds direction, and its graph can slope downwards.', 'A curved d–t graph means the speed is changing; the slope of the tangent at a point is the instantaneous speed. This is the seed of calculus (v = dd/dt).', 'Real cars accelerate from rest, so perfectly constant speed from t = 0 is an idealisation.']
  });

  WL.topic({
    id: 'ks3-moments', stage: 'ks3', strand: 'M', title: 'Moments',
    summary: 'A force can turn things. Its turning effect, the moment, is force × distance from the pivot.',
    maths: [['Multiplication & units', 'N × m = N m'], ['Solving simple equations', 'm₁d₁ = m₂d₂ ⇒ d₂ = m₁d₁/m₂'], ['Inverse proportion', 'Double the distance, halve the mass needed']],
    idea: 'A small child far from the pivot can balance a large adult close to it. What matters is not just the force, but <em>force × distance</em>.',
    anim: {
      duration: 13, alt: 'A seesaw beam with two hanging masses tipping or balancing.',
      params: [{ id: 'm1', label: 'Left mass m₁', unit: 'kg', min: 0.5, max: 5, step: 0.5, value: 2 }, { id: 'd1', label: 'Left distance d₁', unit: 'm', min: 0.5, max: 3, step: 0.25, value: 2.5 }, { id: 'm2', label: 'Right mass m₂', unit: 'kg', min: 0.5, max: 5, step: 0.5, value: 4 }, { id: 'd2', label: 'Right distance d₂', unit: 'm', min: 0.5, max: 3, step: 0.25, value: 1.5 }],
      beats: [[0, 'A beam resting on a pivot, with a weight hanging on each side.'], [3, 'Each weight has a turning effect: moment = force × distance.'], [7, 'Remove the supports: the larger moment wins.'], [10, 'Balanced only when m₁d₁ = m₂d₂. Try setting d₂ = 1.25 m.']],
      setup(s) { s.state.th = 0; },
      draw(s, t, dt) {
        const { m1, d1, m2, d2 } = s.p, g = 10, px = 480, py = 290, sc = 112;
        const Ma = m1 * g * d1, Mc = m2 * g * d2, net = Mc - Ma, free = s.in(t, 7, 0.6);
        const target = free * 0.22 * Math.tanh(net / 25);
        if (dt === 0) s.state.th = target; else s.state.th += (target - s.state.th) * Math.min(1, dt * 4);
        const th = s.state.th, cs = Math.cos(th), sn = Math.sin(th), nx = -sn, ny = cs;
        const P = (d) => [px + d * sc * cs, py + d * sc * sn];
        s.line(px - 140, py + 72, px + 140, py + 72, { c: C.dim, w: 2 });
        s.poly([[px, py + 6], [px - 34, py + 72], [px + 34, py + 72]], { c: C.dim, fill: C.grey, fa: 0.4, close: true, w: 2 });
        s.alpha(1 - free, () => { s.rect(px - 3.2 * sc - 14, py + 6, 28, 66, { c: C.dim, fill: C.grey, fa: 0.3, w: 2 }); s.rect(px + 3.2 * sc - 14, py + 6, 28, 66, { c: C.dim, fill: C.grey, fa: 0.3, w: 2 }); });
        const a = P(-3.2), b = P(3.2);
        s.line(a[0], a[1], b[0], b[1], { c: C.ink, w: 10, p: s.in(t, 0, 1) });
        for (let d = -3; d <= 3.001; d += 0.5) { const q = P(d); s.line(q[0] - nx * 5, q[1] - ny * 5, q[0] + nx * 5, q[1] + ny * 5, { c: C.bg, w: 2 }); }
        const hang = (d, m, col, lab) => {
          const q = P(d), sz = 26 + 9 * Math.sqrt(m);
          s.line(q[0], q[1], q[0], q[1] + 36, { c: C.dim, w: 2 });
          s.rect(q[0] - sz / 2, q[1] + 36, sz, sz, { c: col, fill: col, fa: 0.3, w: 2.5 });
          s.txt(m + ' kg', q[0], q[1] + 36 + sz / 2, { c: C.ink, size: 15, align: 'center', sans: true });
          s.math(lab, q[0], q[1] + 50 + sz, { c: col, size: 20, align: 'center' });
        };
        s.alpha(s.in(t, 0.8, 1), () => { hang(-d1, m1, C.blue, 'm_1'); hang(d2, m2, C.red, 'm_2'); });
        s.alpha(s.in(t, 1.5, 1), () => {
          const o = -34, L0 = P(0), La = P(-d1), Rb = P(d2);
          s.arrow(L0[0] + nx * o, L0[1] + ny * o, La[0] + nx * o, La[1] + ny * o, { c: C.blue, w: 2, both: true, head: 9 });
          s.arrow(L0[0] + nx * o, L0[1] + ny * o, Rb[0] + nx * o, Rb[1] + ny * o, { c: C.red, w: 2, both: true, head: 9 });
          s.txt('d₁ = ' + d1 + ' m', (L0[0] + La[0]) / 2, (L0[1] + La[1]) / 2 + ny * o - 16, { c: C.blue, size: 17, align: 'center' });
          s.txt('d₂ = ' + d2 + ' m', (L0[0] + Rb[0]) / 2, (L0[1] + Rb[1]) / 2 + ny * o - 16, { c: C.red, size: 17, align: 'center' });
        });
        const am = s.in(t, 3, 1.2);
        s.arcArrow(px, py, 70, -Math.PI / 2 - 0.15, -Math.PI + 0.25, { c: C.blue, w: 3, p: am });
        s.arcArrow(px, py, 70, -Math.PI / 2 + 0.15, -0.25, { c: C.red, w: 3, p: am });
        s.txt('Anticlockwise moment', 40, 58, { c: C.blue, size: 18, sans: true, p: am });
        s.txt(`m₁ g d₁ = ${m1} × ${g} × ${d1} = ${f1(Ma)} N m`, 40, 86, { c: C.ink, size: 20, p: am });
        s.txt('Clockwise moment', 920, 58, { c: C.red, size: 18, sans: true, align: 'right', p: am });
        s.txt(`m₂ g d₂ = ${m2} × ${g} × ${d2} = ${f1(Mc)} N m`, 920, 86, { c: C.ink, size: 20, align: 'right', p: am });
        const vd = s.in(t, 10, 1);
        const msg = Math.abs(net) < 1e-9 ? 'Balanced: the moments are equal' : net > 0 ? 'Clockwise moment is bigger: the right side drops' : 'Anticlockwise moment is bigger: the left side drops';
        s.txt(msg, 480, 500, { c: Math.abs(net) < 1e-9 ? C.green : C.yellow, size: 22, align: 'center', a: vd });
      }
    },
    steps: [
      { say: 'The turning effect of a force about a pivot is its moment.', tex: R`M = F \times d`, why: 'd is the perpendicular distance from the pivot to the line of the force. A door is easiest to push far from the hinge: the turning effect grows with both F and d.' },
      { say: 'A hanging mass pulls down with its weight.', tex: R`F = m\,g, \qquad g \approx 10\ \text{N/kg}`, why: 'On Earth every kilogram is pulled down with about 10 newtons (more precisely 9.8 N).' },
      { say: 'The left mass turns the beam anticlockwise, the right mass clockwise.', tex: R`M_{\text{anti}} = m_1 g\,d_1, \qquad M_{\text{clock}} = m_2 g\,d_2`, why: 'Imagine only the left mass: the left end drops, so the beam rotates anticlockwise. Only the right mass: clockwise.' },
      { say: 'The beam stays still when the moments cancel: the principle of moments.', tex: R`m_1 g\,d_1 = m_2 g\,d_2`, why: 'If one moment were bigger there would be an overall turning effect and the beam would start to rotate.' },
      { say: 'g appears on both sides, so it cancels.', tex: R`m_1 d_1 = m_2 d_2 \;\Longrightarrow\; d_2 = \frac{m_1 d_1}{m_2}`, why: 'Divide both sides by g. That is why a balance gives the same answer on the Moon.' }
    ],
    result: R`\sum M_{\text{clockwise}} = \sum M_{\text{anticlockwise}}`,
    assumptions: ['The beam’s own weight is ignored. If the pivot is at the beam’s centre, its weight acts through the pivot and has zero moment, so this is exact.', 'The pivot also pushes up on the beam, but that force acts through the pivot (d = 0), so it has no moment. This hidden force is why a balanced beam does not fall.', 'When the beam tilts by θ, each perpendicular distance becomes d cos θ. Both sides gain the same factor, so balance does not depend on the tilt.']
  });

  WL.topic({
    id: 'ks3-waves', stage: 'ks3', strand: 'W', title: 'Waves & Sound',
    summary: 'Waves carry energy without carrying matter. Their speed, frequency and wavelength are linked by v = fλ.',
    maths: [['Reciprocals', 'f = 1/T'], ['Rearranging v = fλ', 'λ = v/f, f = v/λ'], ['Standard form', 'Light: 3 × 10⁸ m/s'], ['Reading wave graphs', 'Crests, troughs, amplitude']],
    idea: 'Each bit of the rope only moves up and down, yet the pattern travels along. In one period the pattern moves exactly one wavelength.',
    anim: {
      duration: 14, alt: 'A transverse wave on a rope, with one particle oscillating and the wavelength marked.',
      params: [{ id: 'f', label: 'Frequency f', unit: 'Hz', min: 0.5, max: 2, step: 0.1, value: 1 }, { id: 'v', label: 'Wave speed v', unit: 'm/s', min: 1, max: 4, step: 0.1, value: 2 }],
      beats: [[0, 'A wave travels along a rope.'], [3, 'Watch the red bead: it only moves up and down. Energy moves along, the rope does not.'], [6, 'Wavelength λ: the distance between neighbouring crests.'], [9, 'In one period T, each crest moves forward exactly one λ.'], [12, 'So v = λ/T = fλ. Raise f: λ shrinks, because v is set by the rope.']],
      draw(s, t) {
        const f = s.p.f, v = s.p.v, lam = v / f, T = 1 / f, A = 70, y0 = 230, sx = 100, x0 = 60, xM = 8.5;
        const X = (x) => x0 + x * sx, yv = (x) => A * Math.sin(2 * Math.PI * (x / lam - f * t));
        s.line(x0, y0, X(xM), y0, { c: C.dim, w: 1.5, dash: [6, 6] });
        const pts = []; for (let x = 0; x <= xM + 1e-9; x += 0.02) pts.push([X(x), y0 - yv(x)]);
        s.poly(pts, { c: C.blue, w: 3, p: s.in(t, 0, 1.5) });
        s.alpha(s.in(t, 1, 1), () => { for (let x = 0; x <= xM + 1e-9; x += 0.25) s.dot(X(x), y0 - yv(x), { c: C.blue, r: 3.5 }); });
        s.alpha(s.in(t, 3, 1), () => {
          s.arrow(X(2) - 18, y0 + A, X(2) - 18, y0 - A, { c: C.red, w: 1.5, both: true, head: 8, a: 0.7 });
          s.dot(X(2), y0 - yv(2), { c: C.red, r: 8 });
        });
        const xc = 0.5 + ((((lam * (0.25 + f * t) - 0.5) % lam) + lam) % lam);
        s.alpha(s.in(t, 6, 1), () => {
          s.poly([[X(xc), y0 - A - 12], [X(xc) - 8, y0 - A - 26], [X(xc) + 8, y0 - A - 26]], { c: C.yellow, fill: C.yellow, fa: 1, close: true, w: 1 });
          let xa = xc, xb = xc + lam; if (xb > xM) { xa = xc - lam; xb = xc; }
          if (xa >= 0) { s.arrow(X(xa), y0 - A - 44, X(xb), y0 - A - 44, { c: C.yellow, w: 2, both: true, head: 10 }); s.txt('λ = ' + f2(lam) + ' m', (X(xa) + X(xb)) / 2, y0 - A - 66, { c: C.yellow, size: 20, align: 'center' }); }
        });
        s.alpha(s.in(t, 9, 1), () => {
          const tin = t % T, xs = xc - v * tin;
          if (xs >= 0) {
            s.line(X(xs), y0 + A + 24, X(xs), y0 + A + 56, { c: C.green, w: 1.5 });
            s.arrow(X(xs), y0 + A + 40, X(xc), y0 + A + 40, { c: C.green, w: 3, head: 10 });
          }
          s.txt('distance moved this period: ' + f2(v * tin) + ' m of ' + f2(lam) + ' m', 480, y0 + A + 78, { c: C.green, size: 18, align: 'center', sans: true });
        });
        s.txt(`f = ${f1(f)} Hz     T = 1/f = ${f2(T)} s     λ = ${f2(lam)} m`, 480, 438, { c: C.ink, size: 21, align: 'center', a: s.in(t, 1.5, 1) });
        s.txt(`v = fλ = ${f1(f)} × ${f2(lam)} = ${f1(v)} m/s`, 480, 484, { c: C.yellow, size: 26, align: 'center', a: s.in(t, 12, 1) });
      }
    },
    steps: [
      { say: 'Period T is the time for one full oscillation; frequency f is oscillations per second.', tex: R`f = \frac{1}{T}`, why: 'If one oscillation takes T seconds, then one second contains 1/T of them. T = 0.5 s gives 2 per second, so f = 2 Hz.' },
      { say: 'Wavelength λ is the length of one complete repeat of the pattern in space.', tex: R`\lambda = \text{crest-to-crest distance}`, why: 'λ is to space what T is to time: the size of one repeat.' },
      { say: 'After one period the pattern looks identical, so each crest has moved exactly one λ.', tex: R`\text{in time } T:\quad \text{crest moves } \lambda`, why: 'After a full oscillation every bead is back where it started. The only way the whole pattern can look the same while moving forward is if it moved by a whole wavelength. Watch the green arrow in the animation.' },
      { say: 'Speed = distance ÷ time for a crest.', tex: R`v = \frac{\lambda}{T}`, why: 'This is the same speed = distance/time from the motion topic, applied to a crest.' },
      { say: 'Replace 1/T with f.', tex: R`v = f\lambda`, why: 'λ/T = λ × (1/T) = λ × f.' }
    ],
    result: R`v = f\lambda`,
    assumptions: ['Wave speed is set by the medium (string tension, air temperature), not by f. So raising f shortens λ. Try it with the sliders.', 'In a dispersive medium v depends on f (light in glass), which is why a prism splits white light into colours.', 'Sound in air is longitudinal: the air moves back and forth along the direction of travel. The relation v = fλ is the same.']
  });

  /* ------------------------------------------------------------ GCSE */
  WL.topic({
    id: 'gcse-suvat', stage: 'gcse', strand: 'M', title: 'Equations of Motion (SUVAT)',
    summary: 'For constant acceleration, five quantities (s, u, v, a, t) are tied together by four equations, all read straight off a velocity–time graph.',
    maths: [['Gradient & area under a graph', 'Gradient of v–t = a, area = s'], ['Areas of rectangles & triangles', 'Trapezium = rectangle + triangle'], ['Substitution & elimination', 'Remove t between two equations'], ['Difference of two squares', '(v + u)(v − u) = v² − u²']],
    idea: 'The <em>gradient</em> of a velocity–time graph is acceleration and the <em>area</em> under it is displacement. Every SUVAT equation is just geometry of that one straight line.',
    anim: {
      duration: 14, alt: 'A ball accelerating along a track while its velocity–time graph fills with area.',
      params: [{ id: 'u', label: 'Initial velocity u', unit: 'm/s', min: 0, max: 8, step: 0.5, value: 2 }, { id: 'a', label: 'Acceleration a', unit: 'm/s²', min: -1.5, max: 3, step: 0.25, value: 1.5 }],
      beats: [[0, 'Constant acceleration: velocity rises by the same amount each second.'], [4, 'The gradient of the v–t graph is the acceleration a.'], [7, 'The area under the v–t graph is the displacement s.'], [10, 'Split it: rectangle ut plus triangle ½at² gives s = ut + ½at².']],
      draw(s, t) {
        const u = s.p.u, a = s.p.a, T = 8, tc = t < 14 ? Math.min(t, T) : WL.cyc(t - 14, T, 2);
        const vv = (x) => u + a * x, sx = (x) => u * x + 0.5 * a * x * x;
        let smin = 0, smax = 0; for (let x = 0; x <= T; x += 0.1) { smin = Math.min(smin, sx(x)); smax = Math.max(smax, sx(x)); }
        const SX = (q) => 110 + ((q - smin) / (smax - smin || 1)) * 740;
        s.line(90, 86, 870, 86, { c: C.dim, w: 2 });
        s.line(SX(0), 76, SX(0), 96, { c: C.dim, w: 2 }); s.txt('s = 0', SX(0), 112, { c: C.dim, size: 13, align: 'center', sans: true });
        s.alpha(s.in(t, 1, 1), () => { for (let k = 0; k <= Math.floor(tc + 1e-6); k++) s.dot(SX(sx(k)), 86, { c: C.yellow, r: 4 }); });
        const bx = SX(sx(tc)); s.dot(bx, 70, { c: C.red, r: 10 });
        s.arrow(bx, 70, bx + Math.max(-90, Math.min(90, vv(tc) * 7)), 70, { c: C.green, w: 3, head: 9 });
        const vT = vv(T), lo = Math.min(0, u, vT), hi = Math.max(u, vT, 2), pad = (hi - lo) * 0.12;
        const yr = [lo < 0 ? lo - pad : 0, hi + pad], tk = ticks(yr[0], yr[1], 5);
        const A = s.axes({ x0: 90, y0: 500, w: 520, h: 330, xr: [0, 8], yr, xt: [0, 8, 2], yt: tk, xl: 't / s', yl: 'v / m s^{-1}' });
        A.draw(s.in(t, 0.3, 1.2));
        const vc = vv(tc), split = s.in(t, 10, 1);
        s.alpha(s.in(t, 7, 1) * (1 - split), () => s.poly([[A.X(0), A.Y(0)], [A.X(0), A.Y(u)], [A.X(tc), A.Y(vc)], [A.X(tc), A.Y(0)]], { fill: C.teal, fa: 0.35, stroke: false }));
        s.alpha(split, () => {
          s.poly([[A.X(0), A.Y(0)], [A.X(0), A.Y(u)], [A.X(tc), A.Y(u)], [A.X(tc), A.Y(0)]], { fill: C.blue, fa: 0.35, stroke: false });
          s.poly([[A.X(0), A.Y(u)], [A.X(tc), A.Y(u)], [A.X(tc), A.Y(vc)]], { fill: a >= 0 ? C.yellow : C.red, fa: 0.4, stroke: false });
          if (u > 0.6) s.txt('ut', A.X(tc / 2), A.Y(u / 2), { c: C.ink, size: 22, align: 'center', italic: true });
          if (Math.abs(a) * tc > 1) s.txt('½at²', A.X(tc * 0.72), A.Y(u + a * tc * 0.42), { c: C.ink, size: 20, align: 'center' });
        });
        A.fn(vv, 0, tc, { c: C.blue, w: 4 });
        s.dot(A.X(tc), A.Y(vc), { c: C.red, r: 6 });
        s.alpha(s.in(t, 4, 1) * (1 - s.in(t, 9.5, 0.8)), () => {
          const X1 = A.X(1), X2 = A.X(3); s.line(X1, A.Y(vv(1)), X2, A.Y(vv(1)), { c: C.green, w: 2.5 }); s.line(X2, A.Y(vv(1)), X2, A.Y(vv(3)), { c: C.red, w: 2.5 });
          s.txt('Δt', (X1 + X2) / 2, A.Y(vv(1)) + 18, { c: C.green, size: 18, align: 'center', italic: true });
          s.txt('Δv', X2 + 10, (A.Y(vv(1)) + A.Y(vv(3))) / 2, { c: C.red, size: 18, italic: true });
        });
        const rx = 650, a2 = s.in(t, 1, 1);
        s.txt('t = ' + f1(tc) + ' s', rx, 170, { c: C.dim, size: 18, sans: true, a: a2 });
        s.txt(`v = u + at = ${f1(vc)} m/s`, rx, 210, { c: C.ink, size: 21, a: a2 });
        s.txt(`a = Δv/Δt = ${f2(a)} m/s²`, rx, 250, { c: C.ink, size: 21, a: s.in(t, 4, 1) });
        s.txt(`s = area = ${f1(sx(tc))} m`, rx, 290, { c: C.teal, size: 21, a: s.in(t, 7, 1) });
        s.txt(`  = ${f1(u * tc)} + ${f1(0.5 * a * tc * tc)} m`, rx, 376, { c: C.yellow, size: 20, a: split });
      }
    },
    steps: [
      { say: 'Constant acceleration means velocity changes by a every second.', tex: R`a = \frac{v - u}{t} \;\Longrightarrow\; v = u + at`, why: 'Velocity starts at u and grows by a each second. After t seconds it has grown by at.' },
      { say: 'Displacement is the area under the v–t graph.', tex: R`s = \text{area under the } v\text{–}t \text{ graph}`, why: 'For constant velocity, s = vt, which is height × width of a rectangle. Chop any v–t graph into thin strips: each strip is nearly a rectangle, so total displacement = total area.' },
      { say: 'Split the trapezium into a rectangle and a triangle.', tex: R`s = \underbrace{u\,t}_{\text{rectangle}} + \underbrace{\tfrac12 (v-u)\,t}_{\text{triangle}}`, why: 'The rectangle has width t and height u. The triangle on top has base t and height v − u, and a triangle’s area is ½ × base × height.' },
      { say: 'Substitute v − u = at from the first equation.', tex: R`s = ut + \tfrac12 a t^2`, why: '½(v − u)t = ½(at)t = ½at².' },
      { say: 'Or treat it as a trapezium: average velocity × time.', tex: R`s = \frac{u + v}{2}\,t`, why: 'A trapezium’s area is the average of its parallel sides times its width. This only equals average velocity because v changes linearly.' },
      { say: 'Eliminate t to get the time-free equation.', tex: R`t = \frac{v-u}{a} \;\Rightarrow\; s = \frac{(v+u)(v-u)}{2a} \;\Rightarrow\; v^2 = u^2 + 2as`, why: 'Substitute t into the trapezium equation. (v + u)(v − u) = v² − u² (difference of two squares). Then multiply both sides by 2a.' }
    ],
    result: R`v = u + at,\quad s = ut + \tfrac12at^2,\quad s = \tfrac{u+v}{2}t,\quad v^2 = u^2 + 2as`,
    assumptions: ['Every SUVAT equation assumes a is constant. With drag or springs, a changes and they fail; you need calculus: v = ∫a dt, s = ∫v dt.', 's is displacement along a line, not distance. If the object turns back (set a negative), s can be less than the distance travelled.', 'Pick a positive direction and keep it: with up as positive, g enters as −9.8 m/s².']
  });

  WL.topic({
    id: 'gcse-energy', stage: 'gcse', strand: 'M', title: 'Kinetic & Potential Energy',
    summary: 'Where ½mv² and mgh come from, and why a swinging pendulum trades one for the other without losing any.',
    maths: [['Squares & square roots', 'v = √(2gh)'], ['Rearranging with powers', 'Making v the subject of ½mv²'], ['Substitution', 'Using v² = u² + 2as'], ['Percentages', 'Efficiency = useful ÷ total']],
    idea: 'Work done by a force becomes energy. Lifting stores it as <em>mgh</em>; speeding up stores it as <em>½mv²</em>. Without friction, the total never changes.',
    anim: {
      duration: 14, stateful: true, alt: 'A pendulum swinging with bars showing potential, kinetic and total energy.',
      params: [{ id: 'th0', label: 'Release angle', unit: '°', min: 10, max: 80, step: 1, value: 50 }],
      beats: [[0, 'Released from rest: all its energy is gravitational potential energy, mgh.'], [4, 'As it falls, GPE turns into kinetic energy.'], [8, 'At the bottom h = 0, so speed and KE are greatest.'], [11, 'The total stays constant: mgh = ½mv² ⇒ v = √(2gh).']],
      setup(s) { s.state.th = (s.p.th0 * Math.PI) / 180; s.state.om = 0; s.state.trail = []; },
      step(s, dt) {
        if (s.t < 1.5) return;
        const g = 9.8, L = 3, f = (th, om) => [om, -(g / L) * Math.sin(th)];
        const n = 6, h = dt / n; let { th, om } = s.state;
        for (let i = 0; i < n; i++) {
          const k1 = f(th, om), k2 = f(th + (h / 2) * k1[0], om + (h / 2) * k1[1]), k3 = f(th + (h / 2) * k2[0], om + (h / 2) * k2[1]), k4 = f(th + h * k3[0], om + h * k3[1]);
          th += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); om += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        }
        s.state.th = th; s.state.om = om; s.state.trail.push(th); if (s.state.trail.length > 90) s.state.trail.shift();
      },
      draw(s, t) {
        const g = 9.8, L = 3, sc = 100, px = 300, py = 60, { th, om, trail } = s.state, th0 = (s.p.th0 * Math.PI) / 180;
        const bx = px + L * sc * Math.sin(th), by = py + L * sc * Math.cos(th), yb = py + L * sc;
        s.line(px - 110, py, px + 110, py, { c: C.dim, w: 3 });
        for (let i = -100; i <= 100; i += 20) s.line(px + i, py, px + i - 10, py - 10, { c: C.dim, w: 1.5 });
        s.line(120, yb, 500, yb, { c: C.dim, w: 1.5, dash: [6, 6] }); s.txt('h = 0', 505, yb, { c: C.dim, size: 14, sans: true });
        trail.forEach((q, i) => s.dot(px + L * sc * Math.sin(q), py + L * sc * Math.cos(q), { c: C.blue, r: 2.5, a: (i / trail.length) * 0.6 }));
        s.line(px, py, bx, by, { c: C.ink, w: 2.5 });
        s.circle(bx, by, 16, { c: C.blue, fill: C.blue, fa: 0.5, w: 3 });
        const vlin = L * om; s.arrow(bx, by, bx + vlin * 22 * Math.cos(th), by - vlin * 22 * Math.sin(th), { c: C.green, w: 3 });
        const hgt = L * (1 - Math.cos(th));
        s.alpha(s.in(t, 0.5, 1), () => { s.arrow(560, yb, 560, by, { c: C.yellow, w: 2, both: true, head: 8 }); s.txt('h = ' + f2(hgt) + ' m', 572, (yb + by) / 2, { c: C.yellow, size: 18 }); });
        const Et = g * L * (1 - Math.cos(th0)), Ep = g * hgt, Ek = 0.5 * vlin * vlin, base = 470, Hh = 300, k = Hh / Et;
        const bar = (x, val, col, lab) => { s.rect(x, base - val * k, 60, val * k, { c: col, fill: col, fa: 0.45, w: 2 }); s.txt(lab, x + 30, base + 22, { c: col, size: 17, align: 'center', sans: true }); s.txt(f1(val) + ' J', x + 30, base - val * k - 16, { c: C.ink, size: 16, align: 'center', sans: true }); };
        s.line(650, base, 910, base, { c: C.dim, w: 2 });
        bar(660, Ep, C.blue, 'GPE'); bar(750, Ek, C.red, 'KE'); bar(840, Ep + Ek, C.ink, 'Total');
        s.txt('mass m = 1 kg, g = 9.8 N/kg, length 3 m', 660, 520, { c: C.dim, size: 13, sans: true });
        s.alpha(s.in(t, 11, 1), () => { s.txt('predicted speed at bottom: ' + f2(Math.sqrt(2 * g * L * (1 - Math.cos(th0)))) + ' m/s', 40, 505, { c: C.ink, size: 17, sans: true }); });
      }
    },
    steps: [
      { say: 'Work done = force × distance moved in the direction of the force.', tex: R`W = F\,s`, why: 'Work is energy transferred by a force. Push with 10 N through 2 m and you transfer 20 J.' },
      { say: 'Lifting at steady speed needs a force equal to the weight.', tex: R`\Delta E_p = W = (mg)\,h = mgh`, why: 'To lift without speeding up, your force must balance the weight mg. Over a height h, the work you do is stored as gravitational potential energy.' },
      { say: 'Now speed something up from rest with a constant net force.', tex: R`W = F s = (ma)\,s`, why: 'Newton’s second law: net force F = ma. All of this work goes into motion.' },
      { say: 'Use v² = u² + 2as with u = 0.', tex: R`v^2 = 2as \;\Longrightarrow\; as = \tfrac12 v^2`, why: 'From the SUVAT topic. Starting from rest, u = 0.' },
      { say: 'Substitute to get kinetic energy.', tex: R`E_k = m\,(as) = \tfrac12 m v^2`, why: 'F and s have both disappeared: kinetic energy depends only on the final speed, not on how you got there.' },
      { say: 'No friction: all lost GPE becomes KE.', tex: R`mgh = \tfrac12 m v^2 \;\Longrightarrow\; v = \sqrt{2gh}`, why: 'm cancels, so a heavy bob and a light bob reach the same speed at the bottom.' }
    ],
    result: R`E_k = \tfrac12 mv^2, \qquad E_p = mgh, \qquad E_k + E_p = \text{const}`,
    assumptions: ['Step 3 assumed a constant force. With calculus the result holds for any force: ∫F dx = ∫m v dv = ½mv² (work–energy theorem).', 'mgh assumes g is constant: fine near the ground, wrong for satellites, where you need −GMm/r.', 'For a pendulum, the string tension does no work because it is always perpendicular to the motion. That hidden fact is why energy alone gives the speed.', 'The animation integrates the full equation θ¨ = −(g/L) sin θ numerically, so the total bar stays level only because energy is genuinely conserved.']
  });

  WL.topic({
    id: 'gcse-circuits', stage: 'gcse', strand: 'E', title: 'Resistors in Series & Parallel',
    summary: 'Why resistances add in series but their reciprocals add in parallel.',
    maths: [['Rearranging V = IR', 'I = V/R, R = V/I'], ['Fractions & reciprocals', '1/R = 1/R₁ + 1/R₂'], ['Adding fractions', 'Common denominators'], ['Ratio', 'Sharing voltage in series']],
    idea: 'Two rules do all the work: charge is conserved (currents add at junctions) and energy is conserved (voltages add around loops).',
    anim: {
      duration: 13, alt: 'A series and a parallel circuit side by side with moving charges showing current.',
      params: [{ id: 'R1', label: 'R₁', unit: 'Ω', min: 1, max: 10, step: 0.5, value: 2 }, { id: 'R2', label: 'R₂', unit: 'Ω', min: 1, max: 10, step: 0.5, value: 6 }, { id: 'V', label: 'Battery V', unit: 'V', min: 1.5, max: 12, step: 0.5, value: 6 }],
      beats: [[0, 'The same battery, connected two different ways.'], [3, 'Series: one path, so the same current flows through both resistors.'], [7, 'Parallel: the current splits, and each branch gets the full battery voltage.'], [10, 'Series: R = R₁ + R₂.   Parallel: 1/R = 1/R₁ + 1/R₂.']],
      draw(s, t) {
        const { R1, R2, V } = s.p, Is = V / (R1 + R2), I1 = V / R1, I2 = V / R2, Rp = 1 / (1 / R1 + 1 / R2), k = 16, sp = 30;
        const S = [[80, 420], [80, 140], [420, 140], [420, 420], [80, 420]];
        const PA = [[540, 420], [540, 140], [700, 140], [700, 420], [540, 420]], PB = [[540, 420], [540, 140], [880, 140], [880, 420], [540, 420]];
        const cr = s.in(t, 0, 1.5);
        s.poly(S, { c: C.ink, w: 3, p: cr }); s.poly(PA, { c: C.ink, w: 3, p: cr }); s.poly(PB, { c: C.ink, w: 3, p: cr });
        const dots = (P, I, col, a) => { const L = WL.util.plen(P), off = (I * k * t) % sp; for (let d = off; d < L; d += sp) { const q = WL.util.along(P, d); s.dot(q[0], q[1], { c: col, r: 4.5, a }); } };
        s.alpha(s.in(t, 1.5, 1), () => { dots(S, Is, C.yellow, 1); dots(PA, I1, C.yellow, 0.9); dots(PB, I2, C.orange, 0.9); });
        const res = (x, y, vert, lab, col) => { const w = vert ? 26 : 80, h = vert ? 80 : 26; s.rect(x - w / 2, y - h / 2, w, h, { c: col, fill: C.bg, fa: 1, w: 3 }); };
        const bat = (x, y) => { s.rect(x - 24, y - 12, 48, 24, { fill: C.bg, fa: 1, stroke: false }); s.line(x - 22, y - 8, x + 22, y - 8, { c: C.ink, w: 3 }); s.line(x - 11, y + 8, x + 11, y + 8, { c: C.ink, w: 6 }); s.txt('+', x - 34, y - 10, { c: C.red, size: 20, align: 'center' }); s.txt(V + ' V', x + 30, y, { c: C.ink, size: 17, sans: true }); };
        res(250, 140, false, 'R₁', C.blue); res(420, 280, true, 'R₂', C.teal); bat(80, 280);
        res(700, 280, true, 'R₁', C.blue); res(880, 280, true, 'R₂', C.teal); bat(540, 280);
        s.txt('Series', 250, 70, { c: C.ink, size: 26, align: 'center', a: s.in(t, 0.5, 1) });
        s.txt('Parallel', 710, 70, { c: C.ink, size: 26, align: 'center', a: s.in(t, 0.5, 1) });
        s.txt(`R₁ = ${R1} Ω`, 250, 108, { c: C.blue, size: 17, align: 'center' }); s.txt(`R₂ = ${R2} Ω`, 440, 280, { c: C.teal, size: 17 });
        s.txt(`R₁ = ${R1} Ω`, 690, 280, { c: C.blue, size: 17, align: 'right' }); s.txt(`R₂ = ${R2} Ω`, 870, 228, { c: C.teal, size: 17, align: 'right' });
        const a3 = s.in(t, 3, 1), a7 = s.in(t, 7, 1);
        s.txt(`I = ${f2(Is)} A everywhere`, 250, 448, { c: C.yellow, size: 18, align: 'center', a: a3 });
        s.txt(`V₁ = IR₁ = ${f2(Is * R1)} V`, 250, 176, { c: C.blue, size: 16, align: 'center', a: a3 });
        s.txt(`V₂ = ${f2(Is * R2)} V`, 405, 340, { c: C.teal, size: 16, align: 'right', a: a3 });
        s.txt(`I₁ = ${f2(I1)} A`, 690, 336, { c: C.yellow, size: 16, align: 'right', a: a7 });
        s.txt(`I₂ = ${f2(I2)} A`, 870, 336, { c: C.orange, size: 16, align: 'right', a: a7 });
        s.txt(`I = I₁ + I₂ = ${f2(I1 + I2)} A`, 710, 448, { c: C.ink, size: 18, align: 'center', a: a7 });
        s.txt(`V across each branch = ${V} V`, 710, 112, { c: C.dim, size: 15, align: 'center', sans: true, a: a7 });
        const a10 = s.in(t, 10, 1);
        s.txt(`R = R₁ + R₂ = ${f2(R1 + R2)} Ω`, 250, 500, { c: C.yellow, size: 22, align: 'center', a: a10 });
        s.txt(`1/R = 1/R₁ + 1/R₂ ⇒ R = ${f2(Rp)} Ω`, 710, 500, { c: C.yellow, size: 22, align: 'center', a: a10 });
      }
    },
    steps: [
      { say: 'Resistance is defined by Ohm’s relation.', tex: R`V = IR`, why: 'R is defined as V/I. For an ohmic conductor at fixed temperature, R is constant, so I ∝ V.' },
      { say: 'Series: there is only one path, so the current is the same everywhere.', tex: R`I_1 = I_2 = I`, why: 'Charge cannot pile up or disappear inside a wire, so whatever flows into R₁ must flow out of it and into R₂.' },
      { say: 'Series: the battery’s voltage is shared between the resistors.', tex: R`V = V_1 + V_2 = IR_1 + IR_2 = I\,(R_1 + R_2)`, why: 'Voltage is energy per coulomb. The energy each coulomb gains from the battery equals the energy it gives up in R₁ plus R₂ (energy conservation).' },
      { say: 'So the total series resistance is the sum.', tex: R`R_{\text{series}} = \frac{V}{I} = R_1 + R_2`, why: 'Divide by I. One longer path is harder to push charge through.' },
      { say: 'Parallel: both branches connect the same two points, and the current splits.', tex: R`V_1 = V_2 = V, \qquad I = I_1 + I_2`, why: 'Same two end points means the same potential difference. Charge conservation at the junction means the currents add (Kirchhoff’s first law).' },
      { say: 'Write each branch current with Ohm’s law and divide by V.', tex: R`I = \frac{V}{R_1} + \frac{V}{R_2} \;\Longrightarrow\; \frac{1}{R_{\text{par}}} = \frac{I}{V} = \frac{1}{R_1} + \frac{1}{R_2}`, why: 'Each new branch is an extra path, so the total resistance falls. R_{par} is always smaller than the smallest branch.' }
    ],
    result: R`R_{\text{series}} = R_1 + R_2, \qquad \frac{1}{R_{\text{par}}} = \frac{1}{R_1} + \frac{1}{R_2}`,
    assumptions: ['Wires and the battery have no resistance. A real battery has internal resistance r, so its terminal voltage is ε − Ir.', 'Ohmic components only. A filament lamp heats up and its R rises: V = IR still defines R, but R is no longer constant.', 'The dots show conventional current (+ to −). Electrons actually drift the other way, typically less than a millimetre per second.']
  });
})();
