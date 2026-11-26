/* Twistor — A-Level topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw;
  const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);

  WL.topic({
    id: 'al-projectile', stage: 'alevel', strand: 'M', title: 'Projectile Motion',
    summary: 'Split the motion into two independent straight lines, and a parabola falls out.',
    maths: [['Resolving vectors', 'v cos θ and v sin θ'], ['SUVAT in two directions', 'x and y handled separately'], ['Double-angle identity', 'sin 2θ = 2 sin θ cos θ'], ['Quadratics', 'Roots of y(x) = 0']],
    idea: 'Gravity only pulls down. So horizontally the projectile coasts at constant speed, while vertically it is just a ball thrown straight up. Combine the two clocks and you get a <em>parabola</em>.',
    anim: {
      duration: 13, alt: 'A projectile following a parabola with its horizontal and vertical velocity components drawn.',
      params: [{ id: 'v0', label: 'Launch speed v₀', unit: 'm/s', min: 5, max: 30, step: 0.5, value: 22 }, { id: 'th', label: 'Angle θ', unit: '°', min: 10, max: 80, step: 1, value: 55 }],
      beats: [[0, 'Launch at speed v₀ and angle θ.'], [3, 'Horizontal velocity (green) never changes: no horizontal force.'], [6, 'Vertical velocity (red) falls by g = 9.81 m/s every second.'], [9, 'Result: a parabola. Range R = v₀² sin 2θ / g. The dashed grey path at 90° − θ lands in the same place.']],
      draw(s, t) {
        const v0 = s.p.v0, th = (s.p.th * Math.PI) / 180, g = 9.81, vx = v0 * Math.cos(th), vy0 = v0 * Math.sin(th);
        const T = (2 * vy0) / g, Rg = (v0 * v0 * Math.sin(2 * th)) / g, Hm = (vy0 * vy0) / (2 * g);
        const A = s.axes({ x0: 80, y0: 480, w: 800, h: 380, xr: [0, 95], yr: [0, 45.125], xt: [0, 90, 10], yt: [0, 40, 10], xl: 'x / m', yl: 'y / m' });
        A.draw(s.in(t, 0, 1.2));
        const path = (x) => x * Math.tan(th) - (g * x * x) / (2 * vx * vx);
        s.alpha(s.in(t, 9, 1), () => {
          const th2 = Math.PI / 2 - th, vx2 = v0 * Math.cos(th2);
          A.fn((x) => x * Math.tan(th2) - (g * x * x) / (2 * vx2 * vx2), 0, Rg, { c: C.grey, w: 2, dash: [6, 7] });
          A.fn(path, 0, Rg, { c: C.yellow, w: 2, dash: [4, 6], a: 0.6 });
          s.line(A.X(Rg), A.Y(0) - 12, A.X(Rg), A.Y(0) + 12, { c: C.yellow, w: 3 });
          s.txt('R = ' + f1(Rg) + ' m', A.X(Rg), A.Y(0) - 26, { c: C.yellow, size: 18, align: 'center' });
          s.line(A.X(Rg / 2), A.Y(Hm), A.X(Rg / 2), A.Y(0), { c: C.dim, w: 1.5, dash: [3, 5] });
          s.txt('H = ' + f1(Hm) + ' m', A.X(Rg / 2) + 8, A.Y(Hm) - 16, { c: C.dim, size: 16 });
        });
        const tau = t < 1 ? 0 : WL.cyc(t - 1, T, 1.2);
        const px = vx * tau, py = vy0 * tau - 0.5 * g * tau * tau, vy = vy0 - g * tau, bx = A.X(px), by = A.Y(Math.max(0, py));
        s.alpha(1 - 0.7 * s.in(t, 3, 1), () => {
          s.arrow(A.X(0), A.Y(0), A.X(0) + vx * 4.2, A.Y(0) - vy0 * 4.2, { c: C.ink, w: 2.5 });
          s.math('v_0', A.X(0) + vx * 4.2 + 8, A.Y(0) - vy0 * 4.2 - 8, { c: C.ink, size: 22 });
          const pts = []; for (let i = 0; i <= 20; i++) { const a = (th * i) / 20; pts.push([A.X(0) + 34 * Math.cos(a), A.Y(0) - 34 * Math.sin(a)]); }
          s.poly(pts, { c: C.ink, w: 1.5 }); s.math('θ', A.X(0) + 44, A.Y(0) - 14, { c: C.ink, size: 18 });
        });
        A.fn(path, 0, px, { c: C.yellow, w: 3 });
        s.dot(bx, by, { c: C.ink, r: 8 });
        s.alpha(s.in(t, 3, 1), () => { s.arrow(bx, by, bx + vx * 4, by, { c: C.green, w: 3 }); s.math('v_x', bx + vx * 4 + 6, by + 14, { c: C.green, size: 18 }); });
        s.alpha(s.in(t, 6, 1), () => { s.arrow(bx, by, bx, by - vy * 4, { c: C.red, w: 3 }); s.math('v_y', bx - 30, by - vy * 2, { c: C.red, size: 18 }); });
        s.txt(`horizontal velocity ${f1(vx)} m/s (constant)`, 900, 60, { c: C.green, size: 18, align: 'right', a: s.in(t, 3, 1) });
        s.txt(`vertical velocity ${f1(vy)} m/s`, 900, 88, { c: C.red, size: 18, align: 'right', a: s.in(t, 6, 1) });
        s.txt(`flight time T = 2v₀ sin θ / g = ${f2(T)} s`, 900, 116, { c: C.ink, size: 18, align: 'right', a: s.in(t, 9, 1) });
      }
    },
    steps: [
      { say: 'Resolve the launch velocity into components.', tex: R`u_x = v_0\cos\theta, \qquad u_y = v_0\sin\theta`, why: 'Velocity is a vector: draw it as the hypotenuse of a right-angled triangle. The adjacent side is v cos θ, the opposite side v sin θ.' },
      { say: 'Horizontally there is no force, so no acceleration.', tex: R`x = v_0\cos\theta\; t`, why: 'Ignoring air resistance, the only force is gravity, which is vertical. Newton’s first law: horizontal velocity stays constant.' },
      { say: 'Vertically the acceleration is −g.', tex: R`y = v_0\sin\theta\; t - \tfrac12 g t^2`, why: 's = ut + ½at² with u = v₀ sin θ and a = −g (taking up as positive).' },
      { say: 'Eliminate t to get the shape of the path.', tex: R`t = \frac{x}{v_0\cos\theta} \;\Longrightarrow\; y = x\tan\theta - \frac{g}{2v_0^2\cos^2\theta}\,x^2`, why: 'From the horizontal equation, t = x/(v₀ cos θ). Substitute into y. sin θ / cos θ = tan θ. y = (constant)x − (constant)x² is a downward parabola.' },
      { say: 'It lands when y = 0 again (x ≠ 0).', tex: R`x\left(\tan\theta - \frac{g\,x}{2v_0^2\cos^2\theta}\right) = 0 \;\Longrightarrow\; R = \frac{2v_0^2\sin\theta\cos\theta}{g}`, why: 'Factor out x. The root x = 0 is the launch; the other root is the landing point. tan θ · cos²θ = sin θ cos θ.' },
      { say: 'Use the double-angle identity.', tex: R`R = \frac{v_0^2\sin 2\theta}{g}, \qquad R_{\max} \text{ at } \theta = 45^\circ`, why: 'sin 2θ = 2 sin θ cos θ. It is largest (= 1) when 2θ = 90°. Because sin 2θ = sin(180° − 2θ), the angles θ and 90° − θ give the same range.' }
    ],
    result: R`y = x\tan\theta - \frac{g x^2}{2v_0^2\cos^2\theta}, \qquad R = \frac{v_0^2\sin 2\theta}{g}`,
    assumptions: ['No air resistance. Real drag (∝ v²) couples the x and y motions: the path is no longer a parabola and the best angle drops below 45°.', 'Launch and landing at the same height. Otherwise solve the full quadratic for the landing time.', 'Uniform g and a flat Earth: fine over a few kilometres. A long-range missile actually follows part of a Kepler ellipse.']
  });

  WL.topic({
    id: 'al-circular', stage: 'alevel', strand: 'M', title: 'Circular Motion',
    summary: 'Constant speed but changing direction means acceleration. Here is why it points to the centre and equals v²/r.',
    maths: [['Radians & arc length', 's = rθ'], ['Small-angle approximation', 'sin x ≈ x for small x'], ['Vector subtraction', 'Δv = v₂ − v₁'], ['Limits', 'Δt → 0 turns ratios into derivatives']],
    idea: 'Velocity is a vector. Even if its length stays the same, turning it requires a change Δv. Put the two velocity arrows tail-to-tail and Δv <em>points to the centre</em>.',
    anim: {
      duration: 13, alt: 'A particle moving in a circle with its velocity at two moments and the velocity change pointing inward.',
      params: [{ id: 'dth', label: 'Gap Δθ', unit: '°', min: 4, max: 90, step: 1, value: 40 }, { id: 'w', label: 'Angular speed ω', unit: 'rad/s', min: 0.2, max: 1.5, step: 0.05, value: 0.5 }],
      beats: [[0, 'Constant speed round a circle, but the direction keeps changing.'], [3, 'Compare the velocity at two moments, Δθ apart.'], [6, 'Put the arrows tail-to-tail: the change Δv points toward the centre.'], [9, 'Shrink Δθ: |Δv| → vΔθ, so a = vω = v²/r, pointing inward.']],
      draw(s, t) {
        const dth = (s.p.dth * Math.PI) / 180, w = s.p.w, cx = 280, cy = 285, r = 170, V = 120, phi = w * t;
        const P = (a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)], D = (a) => [-Math.sin(a), -Math.cos(a)];
        s.circle(cx, cy, r, { c: C.dim, w: 2, dash: [5, 7], p: s.in(t, 0, 1.2) }); s.dot(cx, cy, { c: C.dim, r: 4 });
        const p1 = P(phi), d1 = D(phi), p2 = P(phi + dth), d2 = D(phi + dth);
        s.line(cx, cy, p1[0], p1[1], { c: C.dim, w: 1.5 });
        s.dot(p1[0], p1[1], { c: C.ink, r: 9 });
        s.arrow(p1[0], p1[1], p1[0] + V * d1[0], p1[1] + V * d1[1], { c: C.blue, w: 3.5 });
        s.math('v_1', p1[0] + V * d1[0] + 10 * d1[0] - 8, p1[1] + V * d1[1] + 12 * d1[1], { c: C.blue, size: 20 });
        const a3 = s.in(t, 3, 1);
        s.alpha(a3, () => {
          s.line(cx, cy, p2[0], p2[1], { c: C.dim, w: 1.5 });
          const pts = []; for (let i = 0; i <= 20; i++) { const a = phi + (dth * i) / 20; pts.push([cx + 40 * Math.cos(a), cy - 40 * Math.sin(a)]); }
          s.poly(pts, { c: C.yellow, w: 2 }); const am = phi + dth / 2; s.math('Δθ', cx + 62 * Math.cos(am) - 10, cy - 62 * Math.sin(am), { c: C.yellow, size: 18 });
          s.dot(p2[0], p2[1], { c: C.ink, r: 7, a: 0.6 });
          s.arrow(p2[0], p2[1], p2[0] + V * d2[0], p2[1] + V * d2[1], { c: C.teal, w: 3.5 });
          s.math('v_2', p2[0] + V * d2[0] + 8, p2[1] + V * d2[1] - 8, { c: C.teal, size: 20 });
        });
        const ox = 720, oy = 230, a6 = s.in(t, 6, 1.2);
        s.alpha(a3, () => {
          s.txt('velocity diagram', ox, 70, { c: C.dim, size: 16, align: 'center', sans: true });
          s.dot(ox, oy, { c: C.dim, r: 3 });
          s.arrow(ox, oy, ox + V * d1[0], oy + V * d1[1], { c: C.blue, w: 3.5 });
          s.arrow(ox, oy, ox + V * d2[0], oy + V * d2[1], { c: C.teal, w: 3.5 });
        });
        const dvx = V * (d2[0] - d1[0]), dvy = V * (d2[1] - d1[1]);
        s.arrow(ox + V * d1[0], oy + V * d1[1], ox + V * d2[0], oy + V * d2[1], { c: C.yellow, w: 3.5, p: a6 });
        s.alpha(a6, () => {
          s.math('Δv', ox + V * (d1[0] + d2[0]) / 2 + 14, oy + V * (d1[1] + d2[1]) / 2, { c: C.yellow, size: 20 });
          const pm = P(phi + dth / 2); s.arrow(pm[0], pm[1], pm[0] + dvx, pm[1] + dvy, { c: C.yellow, w: 2.5, dash: [6, 5] });
        });
        const a9 = s.in(t, 9, 1);
        s.alpha(a9, () => { s.arrow(p1[0], p1[1], p1[0] + (cx - p1[0]) * 0.42, p1[1] + (cy - p1[1]) * 0.42, { c: C.red, w: 4 }); s.math('a', p1[0] + (cx - p1[0]) * 0.25 + 10, p1[1] + (cy - p1[1]) * 0.25 - 12, { c: C.red, size: 22 }); });
        const chord = 2 * Math.sin(dth / 2), arc = dth;
        s.txt(`|Δv| / v = 2 sin(Δθ/2) = ${chord.toFixed(3)}`, 560, 420, { c: C.ink, size: 19, a: a6 });
        s.txt(`Δθ (radians) = ${arc.toFixed(3)}`, 560, 452, { c: C.ink, size: 19, a: a6 });
        s.txt(`ratio = ${(chord / arc).toFixed(4)}  → 1 as Δθ → 0`, 560, 484, { c: C.yellow, size: 19, a: a9 });
      }
    },
    steps: [
      { say: 'Angular speed and linear speed.', tex: R`\omega = \frac{d\theta}{dt}, \qquad v = r\omega`, why: 'Arc length s = rθ when θ is in radians. Divide both sides by time.' },
      { say: 'In a time Δt the velocity turns through Δθ but keeps its length.', tex: R`|\vec v_1| = |\vec v_2| = v, \qquad \angle(\vec v_1, \vec v_2) = \Delta\theta`, why: 'Velocity is always tangent, so always perpendicular to the radius. When the radius turns by Δθ, the tangent turns by the same Δθ.' },
      { say: 'Δv is the base of an isosceles triangle.', tex: R`|\Delta\vec v| = 2v\sin\frac{\Delta\theta}{2}`, why: 'With v₁ and v₂ tail-to-tail, split the triangle down the middle into two right-angled triangles, each with hypotenuse v and angle Δθ/2.' },
      { say: 'For small angles the chord equals the arc.', tex: R`\sin\frac{\Delta\theta}{2} \approx \frac{\Delta\theta}{2} \;\Longrightarrow\; |\Delta\vec v| \approx v\,\Delta\theta`, why: 'For small x in radians, sin x ≈ x (Taylor: x − x³/6 + …). Shrink Δθ in the animation and watch the ratio go to 1.' },
      { say: 'Divide by Δt and take the limit.', tex: R`a = \lim_{\Delta t\to0}\frac{|\Delta\vec v|}{\Delta t} = v\,\frac{d\theta}{dt} = v\omega = \frac{v^2}{r} = \omega^2 r`, why: 'dθ/dt = ω, and ω = v/r from the first step.' },
      { say: 'As Δθ → 0, Δv becomes perpendicular to v, pointing inward.', tex: R`\vec a = -\omega^2\,\vec r, \qquad F = \frac{mv^2}{r}\ \text{(towards the centre)}`, why: 'Newton’s second law then says something real (tension, gravity, friction) must supply this inward force.' }
    ],
    result: R`a = \frac{v^2}{r} = \omega^2 r \quad \text{directed towards the centre}`,
    assumptions: ['Uniform circular motion: constant speed. If the speed changes there is also a tangential acceleration dv/dt.', '“Centrifugal force” does not exist in an inertial frame. It appears only if you analyse the motion from the rotating frame, as a fictitious force.', 'The geometric limit is the same as differentiating r(cos ωt, sin ωt) twice: a = −ω²r.']
  });

  WL.topic({
    id: 'al-shm', stage: 'alevel', strand: 'M', title: 'Simple Harmonic Motion',
    summary: 'A mass on a spring moves exactly like the shadow of a point going round a circle.',
    maths: [['Differentiating sin & cos', 'd/dt cos ωt = −ω sin ωt'], ['Second-order ODEs', 'ẍ = −ω²x'], ['Radians & angular frequency', 'ω = 2π/T'], ['Identity sin² + cos² = 1', 'For v in terms of x']],
    idea: 'A point moving round a circle has acceleration −ω²r towards the centre. Its shadow therefore has acceleration −ω²x: exactly what a spring produces.',
    anim: {
      duration: 13, alt: 'A rotating point, its shadow, a mass on a spring and the resulting cosine graph.',
      params: [{ id: 'w', label: 'Angular frequency ω', unit: 'rad/s', min: 0.5, max: 3, step: 0.1, value: 1.5 }, { id: 'A', label: 'Amplitude A', unit: 'm', min: 0.4, max: 1.2, step: 0.05, value: 1 }],
      beats: [[0, 'A point goes round a circle at constant angular speed ω.'], [3, 'Its shadow moves up and down along a line.'], [6, 'A mass on a spring follows the shadow exactly.'], [9, 'Record it over time: x(t) = A cos ωt.']],
      draw(s, t) {
        const w = s.p.w, A = s.p.A * 100, cx = 170, cy = 280, ang = w * t, x = A * Math.cos(ang);
        const qx = cx + A * Math.sin(ang), qy = cy - x, ym = cy - x;
        s.line(40, cy, 940, cy, { c: C.dim, w: 1.5, dash: [5, 7] });
        s.circle(cx, cy, A, { c: C.blue, w: 2, p: s.in(t, 0, 1.2) });
        s.line(cx, cy, qx, qy, { c: C.blue, w: 2 }); s.dot(cx, cy, { c: C.dim, r: 3 });
        s.dot(qx, qy, { c: C.yellow, r: 8 });
        s.math('ωt', cx + 18, cy - 30, { c: C.blue, size: 18 });
        const a3 = s.in(t, 3, 1);
        s.alpha(a3, () => { s.line(qx, qy, 520, ym, { c: C.yellow, w: 1.5, dash: [4, 6] }); s.dot(330, ym, { c: C.yellow, r: 6 }); s.line(330, cy - 125, 330, cy + 125, { c: C.dim, w: 2 }); });
        const a6 = s.in(t, 6, 1);
        s.alpha(a6, () => {
          s.line(380, 40, 460, 40, { c: C.dim, w: 3 });
          s.spring(420, 40, 420, ym - 25, { c: C.ink, coils: 12, amp: 12 });
          s.rect(395, ym - 25, 50, 50, { c: C.red, fill: C.red, fa: 0.35, w: 3 });
          const vel = -A * w * Math.sin(ang), acc = -w * w * x;
          s.arrow(470, ym, 470, ym - vel * 0.6, { c: C.green, w: 3 }); s.math('v', 480, ym - vel * 0.3, { c: C.green, size: 18 });
          s.arrow(370, ym, 370, ym - acc * 0.35, { c: C.red, w: 3 }); s.math('a', 350, ym - acc * 0.18, { c: C.red, size: 18 });
        });
        const a9 = s.in(t, 9, 1);
        s.alpha(a9, () => {
          const pts = []; for (let k = 0; k <= 240; k++) { const tau = t - (k / 240) * 6; pts.push([520 + (t - tau) * 68, cy - A * Math.cos(w * tau)]); }
          s.poly(pts, { c: C.yellow, w: 3 });
          s.txt('paper moves →  (6 s shown)', 930, cy + 150, { c: C.dim, size: 14, align: 'right', sans: true });
          s.txt(`T = 2π/ω = ${f2((2 * Math.PI) / w)} s`, 930, 104, { c: C.ink, size: 19, align: 'right' });
        });
      }
    },
    steps: [
      { say: 'Hooke’s law: the restoring force is proportional to displacement.', tex: R`F = -kx`, why: 'Stretch a spring by x and it pulls back with kx. The minus sign means “towards equilibrium”.' },
      { say: 'Newton’s second law.', tex: R`m\ddot x = -kx \;\Longrightarrow\; \ddot x = -\omega^2 x, \qquad \omega^2 \equiv \frac{k}{m}`, why: 'ẍ means d²x/dt². Divide by m and call the positive constant k/m “ω²”. It will turn out to be the angular frequency.' },
      { say: 'Recognise circular motion: the shadow of a rotating point obeys the same equation.', tex: R`x(t) = A\cos(\omega t + \phi)`, why: 'A point on a circle has acceleration −ω²r towards the centre. Project onto a diameter and the shadow has acceleration −ω²x. Same equation, so same motion.' },
      { say: 'Check by differentiating twice.', tex: R`\dot x = -A\omega\sin(\omega t+\phi), \quad \ddot x = -A\omega^2\cos(\omega t+\phi) = -\omega^2 x \;\checkmark`, why: 'Chain rule: d/dt cos(ωt) = −ω sin(ωt) and d/dt sin(ωt) = ω cos(ωt).' },
      { say: 'The period does not depend on amplitude.', tex: R`T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{m}{k}}`, why: 'The circle repeats when ωT = 2π. A doesn’t appear: big and small oscillations take the same time (isochronism).' },
      { say: 'Speed as a function of position.', tex: R`v = \pm\,\omega\sqrt{A^2 - x^2}`, why: 'sin² + cos² = 1 gives (ẋ/Aω)² + (x/A)² = 1. Maximum speed Aω at x = 0, zero at the turning points.' }
    ],
    result: R`\ddot x = -\omega^2 x \;\Longrightarrow\; x = A\cos(\omega t + \phi), \quad T = 2\pi\sqrt{m/k}`,
    assumptions: ['The force must be linear in x. A pendulum is SHM only for small angles (sin θ ≈ θ); at large amplitude its period grows.', 'No damping. Real oscillators lose energy: ẍ + γẋ + ω²x = 0 gives decaying oscillations.', 'Why the “guess” is legitimate: a second-order linear ODE has a two-parameter family of solutions, and A cos(ωt + φ) has two free constants, so it is the general solution.']
  });

  WL.topic({
    id: 'al-capacitors', stage: 'alevel', strand: 'E', title: 'Capacitor Discharge',
    summary: 'The less charge is left, the slower it leaves. That single idea produces exponential decay.',
    maths: [['Exponential function', 'eˣ and its graph'], ['Natural logarithm', 'ln(e^x) = x'], ['Separation of variables', '∫dQ/Q = −∫dt/RC'], ['Tangent to a curve', 'Initial gradient −Q₀/RC']],
    idea: 'Current is driven by the capacitor’s voltage, which is proportional to its remaining charge. So the drain rate is proportional to what is left: <em>exponential decay</em>.',
    anim: {
      duration: 13, alt: 'A capacitor discharging through a resistor beside its exponential charge graph.',
      params: [{ id: 'tau', label: 'Time constant τ = RC', unit: 's', min: 0.5, max: 4, step: 0.1, value: 2 }],
      beats: [[0, 'A charged capacitor. The switch closes at t = 0.'], [3, 'Current is set by the remaining charge: I = V/R = Q/RC.'], [6, 'Lots of charge: fast drain. Little charge: slow drain. The tangent at t = 0 hits zero at τ.'], [9, 'After one time constant τ = RC, e⁻¹ ≈ 37% remains.']],
      draw(s, t) {
        const tau = s.p.tau, ph = t % 15, tp = Math.max(0, ph - 1), q = Math.exp(-tp / tau), I = q / tau, closed = ph >= 1;
        const path = [[90, 268], [90, 140], [400, 140], [400, 420], [90, 420], [90, 292]];
        s.poly([[90, 268], [90, 140], [225, 140]], { c: C.ink, w: 3 }); s.poly([[275, 140], [400, 140], [400, 420], [90, 420], [90, 292]], { c: C.ink, w: 3 });
        if (closed) s.line(225, 140, 275, 140, { c: C.ink, w: 3 }); else s.line(225, 140, 270, 112, { c: C.ink, w: 3 });
        s.dot(225, 140, { c: C.ink, r: 4 }); s.dot(275, 140, { c: C.ink, r: 4 });
        s.line(55, 268, 125, 268, { c: C.ink, w: 4 }); s.line(55, 292, 125, 292, { c: C.ink, w: 4 });
        s.rect(387, 240, 26, 80, { c: C.teal, fill: C.bg, fa: 1, w: 3 }); s.txt('R', 425, 280, { c: C.teal, size: 20, italic: true });
        s.txt('C', 30, 280, { c: C.blue, size: 20, italic: true });
        const n = Math.round(10 * q);
        for (let i = 0; i < n; i++) { const x = 60 + (i + 0.5) * 6; s.txt('+', x, 256, { c: C.red, size: 13, align: 'center' }); s.txt('−', x, 305, { c: C.blue, size: 13, align: 'center' }); }
        if (closed) { const L = WL.util.plen(path), sp = 34, off = (I * 70 * tp) % sp; for (let d = off; d < L; d += sp) { const p = WL.util.along(path, d); s.dot(p[0], p[1], { c: C.yellow, r: 4.5, a: Math.min(1, q * 3) }); } }
        s.txt(closed ? 'switch closed' : 'switch open', 250, 96, { c: C.dim, size: 14, align: 'center', sans: true });
        s.txt(`Q = Q₀e^(−t/RC) = ${f2(q)} Q₀`, 60, 470, { c: C.ink, size: 20, a: s.in(t, 1, 1) });
        s.txt(`I = Q/RC = ${f2(I)} (Q₀/s)`, 60, 505, { c: C.yellow, size: 20, a: s.in(t, 3, 1) });
        const A = s.axes({ x0: 490, y0: 460, w: 420, h: 330, xr: [0, 12], yr: [0, 1.1], xt: [0, 12, 2], yt: [0, 1, 0.5], xl: 't / s', yl: 'Q/Q_0' });
        A.draw(s.in(t, 0.3, 1.2));
        s.alpha(s.in(t, 6, 1), () => { s.line(A.X(0), A.Y(1), A.X(tau), A.Y(0), { c: C.yellow, w: 2, dash: [6, 6] }); s.txt('tangent at t = 0', A.X(tau) + 8, A.Y(0) - 18, { c: C.yellow, size: 14, sans: true }); });
        s.alpha(s.in(t, 9, 1), () => {
          s.line(A.X(tau), A.Y(0), A.X(tau), A.Y(Math.exp(-1)), { c: C.red, w: 2, dash: [3, 5] });
          s.line(A.X(0), A.Y(Math.exp(-1)), A.X(tau), A.Y(Math.exp(-1)), { c: C.red, w: 2, dash: [3, 5] });
          s.txt('0.37', A.X(0) - 10, A.Y(Math.exp(-1)), { c: C.red, size: 15, align: 'right', sans: true });
          s.txt('τ = ' + f1(tau) + ' s', A.X(tau), A.Y(0) + 38, { c: C.red, size: 16, align: 'center' });
        });
        A.fn((x) => Math.exp(-x / tau), 0, Math.min(tp, 12), { c: C.blue, w: 4 });
        s.dot(A.X(Math.min(tp, 12)), A.Y(q), { c: C.red, r: 6 });
      }
    },
    steps: [
      { say: 'Definition of capacitance.', tex: R`Q = CV_C \;\Longrightarrow\; V_C = \frac{Q}{C}`, why: 'C is charge stored per volt. More charge on the plates means a bigger voltage across them.' },
      { say: 'Kirchhoff’s voltage law around the loop.', tex: R`V_C = IR`, why: 'With no battery, the capacitor is the only source. Its voltage drives the current through R.' },
      { say: 'The current is the rate at which charge leaves the plates.', tex: R`I = -\frac{dQ}{dt}`, why: 'Q is decreasing, so dQ/dt < 0 while I > 0. The minus sign makes the signs agree.' },
      { say: 'Combine the three.', tex: R`-R\frac{dQ}{dt} = \frac{Q}{C} \;\Longrightarrow\; \frac{dQ}{dt} = -\frac{Q}{RC}`, why: 'Rate of loss is proportional to the amount left: the defining property of exponential decay (the same equation as radioactive decay).' },
      { say: 'Separate the variables and integrate.', tex: R`\int_{Q_0}^{Q}\frac{dQ'}{Q'} = -\frac{1}{RC}\int_0^t dt' \;\Longrightarrow\; \ln\frac{Q}{Q_0} = -\frac{t}{RC}`, why: 'Put everything with Q on one side and t on the other. The integral of 1/Q is ln Q.' },
      { say: 'Exponentiate both sides.', tex: R`Q(t) = Q_0\,e^{-t/RC}, \qquad \tau \equiv RC`, why: 'At t = τ, Q = Q₀/e ≈ 0.37 Q₀. Also the initial slope is −Q₀/τ, so if the current stayed at its starting value the capacitor would empty in exactly τ.' }
    ],
    result: R`Q = Q_0 e^{-t/RC}, \qquad V = V_0 e^{-t/RC}, \qquad I = I_0 e^{-t/RC}`,
    assumptions: ['Ideal components: no leakage through the dielectric, R independent of current and temperature.', 'Quasi-static circuit: the current is the same everywhere at each instant. Valid when the circuit is much smaller than c × τ.', 'Mathematically Q never reaches zero. Physically, after about 5τ less than 1% remains and noise dominates.']
  });

  WL.topic({
    id: 'al-photoelectric', stage: 'alevel', strand: 'Q', title: 'The Photoelectric Effect',
    summary: 'Why brighter red light frees no electrons but dim ultraviolet does, and how this measures Planck’s constant.',
    maths: [['Straight-line graphs', 'y = mx + c, gradient and intercept'], ['eV ↔ J conversion', '1 eV = 1.60 × 10⁻¹⁹ J'], ['Standard form', 'h = 6.63 × 10⁻³⁴ J s'], ['Rearranging', 'f₀ = φ/h']],
    idea: 'Light delivers energy in packets of size hf, and one electron absorbs one packet. Intensity changes <em>how many</em> packets arrive, not how big each one is.',
    anim: {
      duration: 13, stateful: true, alt: 'Photons hitting a sodium plate and freeing electrons only above a threshold frequency.',
      params: [{ id: 'f', label: 'Frequency f', unit: '×10¹⁴ Hz', min: 3, max: 15, step: 0.1, value: 8 }, { id: 'I', label: 'Intensity', unit: '', min: 1, max: 10, step: 1, value: 5 }],
      beats: [[0, 'Light arrives as photons, each carrying energy E = hf.'], [3, 'Lower f below f₀ ≈ 5.5 × 10¹⁴ Hz: no electrons, however bright.'], [6, 'Above f₀, one photon frees one electron. Brighter light = more electrons, not faster ones.'], [9, 'KE_max = hf − φ: a straight line whose gradient is h.']],
      setup(s) { s.state.ph = []; s.state.el = []; s.state.fl = []; s.state.acc = 0; },
      step(s, dt) {
        const st = s.state, f = s.p.f, E = 0.41357 * f, phi = 2.28;
        st.acc += s.p.I * 2.4 * dt;
        while (st.acc >= 1) { st.acc -= 1; st.ph.push({ x: 30, y: 140 + Math.random() * 280 }); }
        st.ph.forEach((p) => (p.x += 330 * dt));
        st.ph = st.ph.filter((p) => {
          if (p.x < 556) return true;
          if (E > phi) { const ke = (E - phi) * (0.15 + 0.85 * Math.random()), sp = 120 * Math.sqrt(ke), a = (Math.random() - 0.5) * 1.1; st.el.push({ x: 604, y: p.y, vx: sp * Math.cos(a), vy: sp * Math.sin(a) }); }
          else st.fl.push({ y: p.y, life: 0.35 });
          return false;
        });
        st.el.forEach((e) => { e.x += e.vx * dt; e.y += e.vy * dt; });
        st.el = st.el.filter((e) => e.x < 980 && e.y > -20 && e.y < 560);
        st.fl.forEach((q) => (q.life -= dt)); st.fl = st.fl.filter((q) => q.life > 0);
      },
      draw(s, t) {
        const f = s.p.f, E = 0.41357 * f, phi = 2.28, f0 = phi / 0.41357, col = WL.specColour(f), st = s.state;
        s.rect(556, 120, 44, 320, { c: C.dim, fill: C.grey, fa: 0.35, w: 2 });
        s.txt('sodium', 578, 460, { c: C.dim, size: 15, align: 'center', sans: true }); s.txt('φ = 2.28 eV', 578, 482, { c: C.dim, size: 15, align: 'center' });
        const lamd = 70 * (4 / f);
        st.ph.forEach((p) => { const pts = []; for (let i = 0; i <= 24; i++) { const dx = (i / 24) * 40; pts.push([p.x - 40 + dx, p.y + 6 * Math.sin((2 * Math.PI * dx) / lamd)]); } s.poly(pts, { c: col, w: 2.5 }); });
        st.fl.forEach((q) => s.circle(556, q.y, 6 + (0.35 - q.life) * 40, { c: col, w: 2, a: q.life / 0.35 }));
        st.el.forEach((e) => s.dot(e.x, e.y, { c: C.blue, r: 5 }));
        s.txt('photons, E = hf', 40, 110, { c: col, size: 18 });
        s.txt('electrons', 640, 110, { c: C.blue, size: 18, a: E > phi ? 1 : 0.35 });
        s.txt(`hf = ${f2(E)} eV`, 40, 470, { c: C.ink, size: 21 });
        s.txt(E > phi ? `KE_max = hf − φ = ${f2(E - phi)} eV` : 'hf < φ: no electrons escape', 40, 505, { c: E > phi ? C.yellow : C.red, size: 21 });
        const A = s.axes({ x0: 670, y0: 505, w: 250, h: 150, xr: [0, 15], yr: [0, 4.2], xt: [0, 15, 5], yt: [0, 4, 2], xl: 'f', yl: 'KE_{max}', lc: C.dim });
        s.alpha(s.in(t, 9, 1), () => {
          A.draw(1); A.fn((x) => 0.41357 * x - phi, f0, 15, { c: C.yellow, w: 3 });
          s.dot(A.X(f), A.Y(Math.max(0, E - phi)), { c: E > phi ? C.yellow : C.red, r: 6 });
          s.txt('f₀', A.X(f0), A.Y(0) + 18, { c: C.dim, size: 14, align: 'center' });
          s.txt('gradient = h', A.X(10), A.Y(3.6), { c: C.yellow, size: 15, align: 'center' });
        });
      }
    },
    steps: [
      { say: 'Einstein’s hypothesis (1905): light energy comes in quanta.', tex: R`E_\gamma = hf`, why: 'This is the hypothesis being tested. A classical wave would deliver energy continuously, at a rate set by its intensity.' },
      { say: 'One photon is absorbed by one electron.', tex: R`\text{energy given to the electron} = hf`, why: 'The interaction is one-to-one: an electron cannot save up energy from several photons. (Multi-photon absorption exists, but only at enormous laser intensities.)' },
      { say: 'Escaping the metal costs at least the work function φ.', tex: R`\tfrac12 m v_{\max}^2 = hf - \phi`, why: 'φ is the minimum energy needed to remove an electron from the surface. Electrons deeper in lose more on the way out, so hf − φ is the maximum kinetic energy.' },
      { say: 'No emission below the threshold frequency.', tex: R`KE_{\max} = 0 \;\Longrightarrow\; f_0 = \frac{\phi}{h}`, why: 'Below f₀, hf < φ, so no single photon can free an electron, however many photons (intensity) arrive.' },
      { say: 'Measure KE_max with a stopping potential.', tex: R`eV_s = hf - \phi \;\Longrightarrow\; V_s = \frac{h}{e}\,f - \frac{\phi}{e}`, why: 'A reverse voltage V_s just stops the fastest electrons: their kinetic energy becomes electrical potential energy eV_s. Plotting V_s against f gives a straight line of gradient h/e for every metal. Millikan measured h this way in 1916.' }
    ],
    result: R`hf = \phi + KE_{\max}`,
    assumptions: ['Intensity sets the number of photons (the current), not KE_max. This is exactly where the classical wave picture fails.', 'Emission starts within nanoseconds even at very low intensity; a classical wave would need time to accumulate energy.', 'Critical point: the photoelectric effect alone does not prove light is made of photons. A semiclassical model (quantised atoms, classical light) also gives KE = hf − φ (Lamb & Scully, 1969). Stronger evidence comes from Compton scattering and photon antibunching (Kimble, Dagenais & Mandel, 1977).']
  });

  WL.topic({
    id: 'al-gravfields', stage: 'alevel', strand: 'S', title: 'Orbits & Kepler’s Third Law',
    summary: 'Newton’s inverse-square gravity explains why outer planets take so much longer: T² ∝ r³.',
    maths: [['Inverse-square laws', 'F ∝ 1/r²'], ['Circular motion', 'a = ω²r'], ['Powers & proportionality', 'T ∝ r^{3/2}'], ['Log graphs', 'Gradient 3/2 on log T vs log r']],
    idea: 'Gravity provides exactly the centripetal force needed for an orbit. Farther out, gravity is weaker, so the planet must go slower <em>and</em> it has a longer path. Together: T² ∝ r³.',
    anim: {
      duration: 13, alt: 'Planets orbiting the Sun at different speeds beside a graph of T squared against r cubed.',
      params: [{ id: 'r', label: 'Your planet’s orbit r', unit: 'AU', min: 0.5, max: 4, step: 0.05, value: 2.2 }],
      beats: [[0, 'Planets orbit the Sun. Time is sped up: 1 year = 2.5 s.'], [4, 'Gravity (red) weakens as 1/r²; orbital speed (blue) falls as 1/√r.'], [8, 'Plot T² against r³ in years and AU: every planet lies on the line T² = r³.']],
      draw(s, t) {
        const rT = s.p.r, cx = 270, cy = 275, sc = 58, yrs = 2.5;
        const pl = [[0.723, 'Venus', C.teal], [1, 'Earth', C.blue], [1.524, 'Mars', C.red], [2.77, 'Ceres', C.grey]];
        const ang = (r, ph) => ((2 * Math.PI) / yrs) * Math.pow(r, -1.5) * t + ph;
        s.circle(cx, cy, 14, { c: C.orange, fill: C.yellow, fa: 0.9, w: 2 });
        pl.forEach(([r, name, col], i) => { s.circle(cx, cy, r * sc, { c: col, w: 1, a: 0.35 }); const a = ang(r, i * 1.7); const x = cx + r * sc * Math.cos(a), y = cy - r * sc * Math.sin(a); s.dot(x, y, { c: col, r: 6 }); s.txt(name, x + 9, y - 10, { c: col, size: 13, sans: true }); });
        s.circle(cx, cy, rT * sc, { c: C.yellow, w: 1.5, dash: [4, 6] });
        const a = ang(rT, 0.6), x = cx + rT * sc * Math.cos(a), y = cy - rT * sc * Math.sin(a);
        s.dot(x, y, { c: C.yellow, r: 9 });
        s.alpha(s.in(t, 4, 1), () => {
          const gl = Math.min(110, 60 / (rT * rT)); s.arrow(x, y, x + ((cx - x) / (rT * sc)) * gl, y + ((cy - y) / (rT * sc)) * gl, { c: C.red, w: 3 });
          const vl = 70 / Math.sqrt(rT); s.arrow(x, y, x - Math.sin(a) * vl, y - Math.cos(a) * vl, { c: C.blue, w: 3 });
        });
        const T = Math.pow(rT, 1.5);
        s.txt(`r = ${f2(rT)} AU   T = ${f2(T)} years`, 40, 515, { c: C.yellow, size: 19 });
        const A = s.axes({ x0: 600, y0: 470, w: 320, h: 360, xr: [0, 64], yr: [0, 64], xt: [0, 60, 20], yt: [0, 60, 20], xl: 'r^3', yl: 'T^2' });
        s.alpha(s.in(t, 8, 1), () => {
          A.draw(1); A.fn((v) => v, 0, 64, { c: C.yellow, w: 2, dash: [6, 6] });
          pl.forEach(([r, n, col]) => s.dot(A.X(r ** 3), A.Y(r ** 3), { c: col, r: 6 }));
          s.dot(A.X(rT ** 3), A.Y(rT ** 3), { c: C.yellow, r: 8 });
          s.txt('AU³', 900, 500, { c: C.dim, size: 13, sans: true }); s.txt('years²', 610, 92, { c: C.dim, size: 13, sans: true });
          s.txt('T² = r³', A.X(40), A.Y(52), { c: C.yellow, size: 22 });
        });
      }
    },
    steps: [
      { say: 'Newton’s law of gravitation.', tex: R`F = \frac{GMm}{r^2}`, why: 'Force is proportional to both masses and falls off as 1/r², the way anything spreading over a sphere of area 4πr² dilutes.' },
      { say: 'In a circular orbit, gravity supplies the centripetal force.', tex: R`\frac{GMm}{r^2} = m\omega^2 r`, why: 'From circular motion, the inward force needed is mω²r. Gravity is the only force acting, so the two are equal.' },
      { say: 'The planet’s mass cancels.', tex: R`\omega^2 = \frac{GM}{r^3}`, why: 'Divide both sides by mr. The orbit does not depend on the orbiting body’s mass: an astronaut and the space station orbit together.' },
      { say: 'Use ω = 2π/T.', tex: R`\frac{4\pi^2}{T^2} = \frac{GM}{r^3} \;\Longrightarrow\; T^2 = \frac{4\pi^2}{GM}\,r^3`, why: 'Rearrange. The constant 4π²/GM is the same for everything orbiting the same star: Kepler’s third law. In years and AU for the Sun, the constant is 1.' },
      { say: 'Orbital speed.', tex: R`v = \omega r = \sqrt{\frac{GM}{r}}`, why: 'Outer planets move more slowly as well as having farther to go.' },
      { say: 'Escape speed from energy conservation.', tex: R`\tfrac12 m v_{\text{esc}}^2 - \frac{GMm}{r} = 0 \;\Longrightarrow\; v_{\text{esc}} = \sqrt{\frac{2GM}{r}} = \sqrt2\,v_{\text{orbit}}`, why: 'Gravitational potential energy is −GMm/r (zero at infinity). Just escaping means arriving at infinity with zero kinetic energy.' }
    ],
    result: R`T^2 = \frac{4\pi^2}{GM}\,r^3`,
    assumptions: ['M ≫ m. Exactly, both bodies orbit their common centre of mass and T² = 4π²r³/[G(M + m)].', 'Circular orbits. For ellipses, replace r with the semi-major axis a: the law still holds.', 'Point masses or spheres (shell theorem). Newtonian gravity fails near very compact objects and cannot explain the extra 43″ per century of Mercury’s perihelion precession, which general relativity does.']
  });
})();
