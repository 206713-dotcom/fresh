/* Geodesic — University Year 1 and Year 2 topics */
(function () {
  const WL = window.WL, C = WL.C, R = String.raw;
  const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);

  /* ------------------------------------------------------------ Y1 */
  WL.topic({
    id: 'y1-wave-eq', stage: 'y1', strand: 'W', title: 'The Wave Equation',
    summary: 'Newton’s second law applied to a tiny piece of string gives ∂²y/∂t² = v² ∂²y/∂x², with v = √(T/μ).',
    maths: [['Partial derivatives', '∂y/∂x is the slope, ∂²y/∂x² the curvature'], ['Small-angle approximation', 'sin θ ≈ tan θ'], ['Taylor expansion', 'g(x + dx) − g(x) ≈ g′(x) dx'], ['Chain rule', 'For f(x − vt)']],
    idea: 'A curved bit of string feels a net force because the tension pulls at slightly different angles at its two ends. Net force ∝ <em>curvature</em>; Newton turns that into the wave equation.',
    anim: {
      duration: 15, alt: 'A string element with tension vectors, and two pulses passing through each other.',
      params: [{ id: 'T', label: 'Tension T', unit: 'N', min: 1, max: 10, step: 0.5, value: 4 }, { id: 'mu', label: 'Mass per length μ', unit: 'kg/m', min: 0.01, max: 0.1, step: 0.005, value: 0.04 }],
      beats: [[0, 'Zoom in on a short piece of string. Tension T pulls on both ends.'], [4, 'The ends have different slopes, so the vertical pulls don’t cancel.'], [8, 'Net force ∝ curvature. Newton II on the piece gives the wave equation.'], [11, 'Any shape f(x − vt) + g(x + vt) solves it: two pulses pass straight through each other.']],
      draw(s, t) {
        const v = Math.sqrt(s.p.T / s.p.mu), y0 = 160, Am = 60, k = (2 * Math.PI) / 460;
        const Y = (x) => y0 - Am * Math.sin(k * (x - 60) - 0.5 * t), dY = (x) => -Am * k * Math.cos(k * (x - 60) - 0.5 * t);
        const pts = []; for (let x = 60; x <= 900; x += 4) pts.push([x, Y(x)]);
        s.alpha(1 - 0.6 * s.in(t, 11, 1), () => {
          s.poly(pts, { c: C.blue, w: 3, p: s.in(t, 0, 1.2) });
          const xa = 430, xb = 530, seg = []; for (let x = xa; x <= xb; x += 2) seg.push([x, Y(x)]);
          s.poly(seg, { c: C.yellow, w: 7 });
          const tens = (x, dir) => { const sl = dY(x), nrm = Math.hypot(1, sl); return [(dir * 80) / nrm, (dir * 80 * sl) / nrm]; };
          const ta = tens(xa, -1), tb = tens(xb, 1), a1 = s.in(t, 1, 1), a4 = s.in(t, 4, 1);
          s.arrow(xa, Y(xa), xa + ta[0], Y(xa) + ta[1], { c: C.red, w: 3, p: a1 }); s.arrow(xb, Y(xb), xb + tb[0], Y(xb) + tb[1], { c: C.red, w: 3, p: a1 });
          s.math('T', xa + ta[0] - 18, Y(xa) + ta[1], { c: C.red, size: 20, a: a1 }); s.math('T', xb + tb[0] + 6, Y(xb) + tb[1], { c: C.red, size: 20, a: a1 });
          s.alpha(a4, () => {
            s.line(xa + ta[0], Y(xa), xa + ta[0], Y(xa) + ta[1], { c: C.red, w: 2, dash: [4, 4] }); s.line(xb + tb[0], Y(xb), xb + tb[0], Y(xb) + tb[1], { c: C.red, w: 2, dash: [4, 4] });
            s.math('θ_1', xa - 70, Y(xa) - 28, { c: C.ink, size: 18 }); s.math('θ_2', xb + 40, Y(xb) - 28, { c: C.ink, size: 18 });
          });
          const net = ta[1] + tb[1], xm = (xa + xb) / 2;
          s.alpha(s.in(t, 8, 1), () => { s.arrow(xm, Y(xm), xm, Y(xm) + net * 2.2, { c: C.green, w: 4 }); s.txt('net force ∝ curvature', xm + 14, Y(xm) + net * 1.1 + 4, { c: C.green, size: 16, sans: true }); });
        });
        const y2 = 430, vp = 8 * v, L = 840, wrap = (d) => ((((d + L / 2) % L) + L) % L) - L / 2;
        const c1 = 60 + ((((200 + vp * t) % L) + L) % L), c2 = 60 + ((((700 - vp * t) % L) + L) % L);
        const F = (x) => 70 * Math.exp(-(wrap(x - c1) ** 2) / (2 * 26 * 26)), G = (x) => 45 * Math.exp(-(wrap(x - c2) ** 2) / (2 * 36 * 36));
        s.alpha(0.3 + 0.7 * s.in(t, 11, 1), () => {
          s.line(60, y2, 900, y2, { c: C.dim, w: 1.5, dash: [5, 7] });
          const pf = [], pg = [], ps = [];
          for (let x = 60; x <= 900; x += 3) { pf.push([x, y2 - F(x)]); pg.push([x, y2 - G(x)]); ps.push([x, y2 - F(x) - G(x)]); }
          s.poly(pf, { c: C.blue, w: 1.5, a: 0.7 }); s.poly(pg, { c: C.teal, w: 1.5, a: 0.7 }); s.poly(ps, { c: C.yellow, w: 3.5 });
          s.txt('f(x − vt) →', 70, 330, { c: C.blue, size: 18 }); s.txt('← g(x + vt)', 890, 330, { c: C.teal, size: 18, align: 'right' });
          s.txt('sum (yellow)', 480, 330, { c: C.yellow, size: 18, align: 'center' });
        });
        s.txt(`v = √(T/μ) = ${f1(v)} m/s`, 900, 40, { c: C.ink, size: 20, align: 'right', a: s.in(t, 8, 1) });
      }
    },
    steps: [
      { say: 'Take a piece of string of length dx and mass μ dx. Tension T acts at each end, at angles θ₁ and θ₂.', tex: R`F_y = T\sin\theta_2 - T\sin\theta_1`, why: 'Tension acts along the string, so its vertical component at each end is T sin θ. At the left end it points backwards, hence the minus sign.' },
      { say: 'Small slopes: sin θ ≈ tan θ = ∂y/∂x.', tex: R`F_y \approx T\left[\frac{\partial y}{\partial x}\Big|_{x+dx} - \frac{\partial y}{\partial x}\Big|_{x}\right]`, why: 'For small θ, sin θ ≈ θ ≈ tan θ, and tan θ is the slope. The horizontal components T cos θ ≈ T cancel, so the piece doesn’t move sideways: consistent with a purely transverse wave.' },
      { say: 'Taylor-expand the difference of slopes.', tex: R`F_y \approx T\,\frac{\partial^2 y}{\partial x^2}\,dx`, why: 'g(x + dx) − g(x) ≈ g′(x) dx with g = ∂y/∂x. Net force is proportional to curvature: a straight string feels no net force, however tilted.' },
      { say: 'Apply Newton’s second law to the piece.', tex: R`(\mu\,dx)\,\frac{\partial^2 y}{\partial t^2} = T\,\frac{\partial^2 y}{\partial x^2}\,dx`, why: 'Mass × vertical acceleration = net vertical force. dx cancels from both sides.' },
      { say: 'The one-dimensional wave equation.', tex: R`\frac{\partial^2 y}{\partial t^2} = v^2\,\frac{\partial^2 y}{\partial x^2}, \qquad v = \sqrt{\frac{T}{\mu}}`, why: 'T/μ has units of N/(kg/m) = m²/s², so call it v². The next step shows it really is the speed.' },
      { say: 'd’Alembert’s general solution.', tex: R`y(x,t) = f(x - vt) + g(x + vt)`, why: 'Let ξ = x − vt. By the chain rule, ∂²f/∂t² = v² f″(ξ) and ∂²f/∂x² = f″(ξ), so the equation holds for any shape f. Same for g(x + vt). The equation is linear, so the sum works too: pulses pass through each other unchanged.' }
    ],
    result: R`\frac{\partial^2 y}{\partial t^2} = v^2\frac{\partial^2 y}{\partial x^2}, \qquad v = \sqrt{T/\mu}`,
    assumptions: ['Small amplitude, |∂y/∂x| ≪ 1. Large amplitudes make the equation nonlinear.', 'Uniform, constant tension. Stretching the string changes T at second order, which we dropped.', 'A perfectly flexible string with no damping. Bending stiffness adds a ∂⁴y/∂x⁴ term and makes waves dispersive; that is why piano overtones are slightly sharp (inharmonicity).']
  });

  WL.topic({
    id: 'y1-gauss', stage: 'y1', strand: 'E', title: 'Gauss’s Law',
    summary: 'The total electric flux out of any closed surface equals the enclosed charge divided by ε₀, whatever the surface’s size or shape.',
    maths: [['Surface integrals & flux', '∮ E · dA'], ['Dot product', 'E · dA = E dA cos α'], ['Solid angle', 'dΩ = r̂ · dA / r²'], ['Divergence theorem', '∮ F · dA = ∫ ∇ · F dV']],
    idea: 'Field strength falls as 1/r², but a sphere’s area grows as r². The two cancel exactly, so the flux through any surface around a charge is the same: <em>count the field lines crossing it</em>.',
    anim: {
      duration: 13, alt: 'A point charge with radial field lines crossing a wobbling closed surface the same number of times.',
      params: [{ id: 'q', label: 'Charge q', unit: '', min: -3, max: 3, step: 1, value: 2 }, { id: 'r', label: 'Surface size', unit: 'px', min: 60, max: 210, step: 5, value: 130 }, { id: 'wob', label: 'Shape distortion', unit: '', min: 0, max: 1, step: 0.05, value: 0 }],
      beats: [[0, 'A point charge and its radial field lines.'], [3, 'Wrap a closed surface around it.'], [6, 'Bigger surface: E falls as 1/r² while area grows as r².'], [9, 'Flux = q/ε₀, whatever the size or shape. Every line crosses once.']],
      draw(s, t) {
        const q = s.p.q, R0 = s.p.r, wob = s.p.wob, cx = 320, cy = 280, n = Math.abs(q) * 8, sg = Math.sign(q);
        const rr = (a) => R0 * (1 + wob * (0.28 * Math.sin(3 * a + 0.5 * t) + 0.12 * Math.cos(5 * a - 0.3 * t)));
        const a0 = s.in(t, 0, 1.5);
        for (let i = 0; i < n; i++) {
          const a = (2 * Math.PI * i) / n + 0.13, ca = Math.cos(a), sa = -Math.sin(a);
          s.line(cx + 18 * ca, cy + 18 * sa, cx + 330 * ca, cy + 330 * sa, { c: C.blue, w: 1.5, p: a0, a: 0.7 });
          [95, 255].forEach((d) => { const p1 = sg > 0 ? d : d + 14, p2 = sg > 0 ? d + 14 : d; s.arrow(cx + p1 * ca, cy + p1 * sa, cx + p2 * ca, cy + p2 * sa, { c: C.blue, w: 1.5, head: 9, a: a0 * 0.8 }); });
        }
        s.circle(cx, cy, 16, { c: q >= 0 ? C.red : C.blue, fill: q >= 0 ? C.red : C.blue, fa: 0.6, w: 2 });
        s.txt(q > 0 ? '+' : q < 0 ? '−' : '0', cx, cy + 1, { c: C.ink, size: 22, align: 'center' });
        const a3 = s.in(t, 3, 1.2);
        const pts = []; for (let i = 0; i <= 240; i++) { const a = (2 * Math.PI * i) / 240; pts.push([cx + rr(a) * Math.cos(a), cy - rr(a) * Math.sin(a)]); }
        s.poly(pts, { c: C.yellow, w: 3, fill: C.yellow, fa: 0.07, p: a3 });
        s.alpha(s.in(t, 6, 1), () => {
          for (let i = 0; i < n; i++) {
            const a = (2 * Math.PI * i) / n + 0.13, r = rr(a), x = cx + r * Math.cos(a), y = cy - r * Math.sin(a), len = Math.max(6, Math.min(90, 40 * Math.abs(q) * (110 / r) ** 2 / 2));
            s.dot(x, y, { c: C.yellow, r: 4 }); s.arrow(x, y, x + sg * len * Math.cos(a), y - sg * len * Math.sin(a), { c: C.red, w: 2.5, head: 9 });
          }
        });
        const bx = 650, base = 400, a6 = s.in(t, 6, 1);
        s.alpha(a6, () => {
          const e = Math.min(200, 100 * (130 / R0) ** 2), A = Math.min(200, 100 * (R0 / 130) ** 2);
          const bar = (x, h, col, lab) => { s.rect(x, base - h, 54, h, { c: col, fill: col, fa: 0.4, w: 2 }); s.txt(lab, x + 27, base + 22, { c: col, size: 15, align: 'center', sans: true }); };
          bar(bx, e * Math.abs(q) / 2, C.red, '|E|'); bar(bx + 90, A, C.yellow, 'area'); bar(bx + 180, 100 * Math.abs(q) / 2, C.green, 'E × A');
          s.txt('(sphere of the same mean size)', bx + 117, base + 46, { c: C.dim, size: 13, align: 'center', sans: true });
        });
        s.txt(`lines crossing the surface: ${n}`, 640, 70, { c: C.yellow, size: 20, a: a3 });
        s.txt(q === 0 ? 'no charge inside: Φ = 0' : `Φ = q/ε₀  (∝ ${q})`, 640, 104, { c: C.green, size: 22, a: s.in(t, 9, 1) });
      }
    },
    steps: [
      { say: 'The field of a point charge (Coulomb).', tex: R`\vec E = \frac{q}{4\pi\varepsilon_0 r^2}\,\hat r`, why: 'Force per unit positive test charge: radial and inverse-square.' },
      { say: 'Flux through a sphere of radius r centred on the charge.', tex: R`\Phi = \oint \vec E\cdot d\vec A = E(r)\cdot 4\pi r^2`, why: 'On such a sphere E is parallel to dA everywhere and has the same size, so the integral is just E × area.' },
      { say: 'The radius cancels.', tex: R`\Phi = \frac{q}{4\pi\varepsilon_0 r^2}\cdot 4\pi r^2 = \frac{q}{\varepsilon_0}`, why: 'This is the heart of it: the 1/r² of the field exactly cancels the r² of the area. This works only for an inverse-square law.' },
      { say: 'Any shape: write each patch’s contribution as a solid angle.', tex: R`\vec E\cdot d\vec A = \frac{q}{4\pi\varepsilon_0}\,\frac{\hat r\cdot d\vec A}{r^2} = \frac{q}{4\pi\varepsilon_0}\,d\Omega`, why: 'r̂ · dA / r² is the solid angle dΩ the patch subtends at the charge. A tilted or distant patch subtends the same solid angle as its projection onto a sphere.' },
      { say: 'A closed surface around q covers every direction once.', tex: R`\oint \vec E\cdot d\vec A = \frac{q}{4\pi\varepsilon_0}\oint d\Omega = \frac{q}{4\pi\varepsilon_0}\cdot 4\pi = \frac{q}{\varepsilon_0}`, why: 'The total solid angle is 4π. For a charge outside the surface, every cone of directions enters and leaves, contributing +dΩ and −dΩ, so the net flux is zero.' },
      { say: 'Superposition gives Gauss’s law; the divergence theorem gives its local form.', tex: R`\oint_S \vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0} \quad\Longleftrightarrow\quad \nabla\cdot\vec E = \frac{\rho}{\varepsilon_0}`, why: 'Fields from many charges add, so fluxes add. ∮E · dA = ∫∇ · E dV for every volume, so the integrands must be equal.' }
    ],
    result: R`\oint_S \vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0}, \qquad \nabla\cdot\vec E = \frac{\rho}{\varepsilon_0}`,
    assumptions: ['It rests on the exact inverse-square law. Null experiments bound a deviation 1/r^{2+δ} to |δ| ≲ 10⁻¹⁶ (Williams, Faller & Hill, 1971). A nonzero photon mass would break it.', 'The surface must be closed and the charge not on it (otherwise the integral is ill-defined).', 'Gauss’s law is always true, but it only lets you find E when symmetry makes E constant over a surface.', 'For a very wiggly surface a field line can cross three or five times; it still crosses outward one more time than inward, so the net count is unchanged.']
  });

  WL.topic({
    id: 'y1-sr', stage: 'y1', strand: 'S', title: 'Time Dilation',
    summary: 'If the speed of light is the same for everyone, moving clocks must tick slowly. A light clock and Pythagoras show it.',
    maths: [['Pythagoras', 'a² + b² = c²'], ['Algebraic rearrangement', 'Solving for Δt'], ['Binomial approximation', '(1 − x)^{−1/2} ≈ 1 + x/2'], ['Graphs of functions', 'γ(β) blows up as β → 1']],
    idea: 'In a moving light clock, light has to travel a diagonal. If c is the same for every observer, a longer path means <em>a longer tick</em>.',
    anim: {
      duration: 14, alt: 'A stationary light clock and a moving light clock whose photon traces a zig-zag path.',
      params: [{ id: 'beta', label: 'Speed β = v/c', unit: '', min: 0, max: 0.95, step: 0.01, value: 0.6 }],
      beats: [[0, 'A light clock: one tick = light goes up to the mirror and back.'], [4, 'Now watch a clock moving at speed v from the ground. Its light follows a zig-zag.'], [8, 'Same speed c, longer path: each tick takes longer.'], [11, 'Δt = γΔτ with γ = 1/√(1 − v²/c²). Moving clocks run slow.']],
      draw(s, t) {
        const b = s.p.beta, c = 180, L = 140, T0 = (2 * L) / c, g = 1 / Math.sqrt(1 - b * b), T = g * T0, v = b * c;
        const top = 140, bot = top + L, tri = (tt, P) => { const ph = (((tt % P) + P) % P) / P; return bot - L * (1 - Math.abs(2 * ph - 1)); };
        const mir = (x, a) => { s.line(x - 32, top, x + 32, top, { c: C.ink, w: 5, a }); s.line(x - 32, bot, x + 32, bot, { c: C.ink, w: 5, a }); s.line(x - 32, top, x - 32, bot, { c: C.dim, w: 1, a }); s.line(x + 32, top, x + 32, bot, { c: C.dim, w: 1, a }); };
        mir(130, s.in(t, 0, 1)); s.dot(130, tri(t, T0), { c: C.yellow, r: 7 });
        s.txt('clock at rest', 130, 100, { c: C.ink, size: 18, align: 'center', sans: true });
        const a4 = s.in(t, 4, 1), W = 540, x0 = 360;
        s.alpha(a4, () => {
          s.txt(`moving clock (v = ${f2(b)}c), seen from the ground`, 630, 100, { c: C.ink, size: 18, align: 'center', sans: true });
          const off = v > 0 ? (v * t) % W : 0, tw = v > 0 ? t - off / v : 0, xc = x0 + off;
          const trail = []; const t1 = Math.max(tw, t - 6); for (let i = 0; i <= 200; i++) { const tt = t1 + ((t - t1) * i) / 200; trail.push([x0 + v * (tt - tw), tri(tt, T)]); }
          s.poly(trail, { c: C.yellow, w: 2, a: 0.8 });
          mir(xc, 1); s.dot(xc, tri(t, T), { c: C.yellow, r: 7 });
          if (v > 0) s.arrow(xc - 30, bot + 26, xc + 30, bot + 26, { c: C.green, w: 2, head: 8 });
          const a8 = s.in(t, 8, 1);
          if (v > 0 && a8 > 0) {
            const hp = T / 2, k = Math.floor(t / hp), ta = k * hp;
            if (ta >= tw) {
              const xa = x0 + v * (ta - tw), ya = tri(ta + 1e-6, T), yb = ya > (top + bot) / 2 ? top : bot, xb = xa + v * hp;
              if (xb < 930) s.alpha(a8, () => {
                s.line(xa, ya, xa, yb, { c: C.blue, w: 2.5 }); s.line(xa, yb, xb, yb, { c: C.green, w: 2.5 }); s.line(xa, ya, xb, yb, { c: C.red, w: 2.5, dash: [6, 5] });
                s.math('L', xa - 20, (ya + yb) / 2, { c: C.blue, size: 18 }); s.txt('vΔt/2', (xa + xb) / 2, yb + (yb === top ? -16 : 18), { c: C.green, size: 16, align: 'center' });
                s.txt('cΔt/2', (xa + xb) / 2 + 22, (ya + yb) / 2, { c: C.red, size: 16 });
              });
            }
          }
        });
        const n0 = Math.floor(t / T0), n1 = Math.floor(t / T);
        s.txt(`rest clock: ${n0} ticks`, 50, 360, { c: C.ink, size: 20 });
        s.txt(`moving clock: ${n1} ticks`, 50, 394, { c: C.ink, size: 20, a: a4 });
        s.txt(`γ = ${g.toFixed(3)}`, 50, 440, { c: C.yellow, size: 22, a: s.in(t, 11, 1) });
        s.txt('Δt = γ Δτ', 50, 480, { c: C.yellow, size: 26, a: s.in(t, 11, 1) });
        const A = s.axes({ x0: 580, y0: 510, w: 320, h: 160, xr: [0, 1], yr: [1, 5], xt: [0, 1, 0.5], yt: [1, 5, 2], xl: 'β', yl: 'γ' });
        s.alpha(s.in(t, 8, 1), () => { A.draw(1); A.fn((x) => 1 / Math.sqrt(1 - x * x), 0, 0.97, { c: C.yellow, w: 2.5 }); s.dot(A.X(b), A.Y(Math.min(5, g)), { c: C.red, r: 6 }); });
      }
    },
    steps: [
      { say: 'The two postulates of special relativity.', tex: R`\text{(i) the laws of physics are the same in every inertial frame;}\quad \text{(ii) light travels at } c \text{ in every inertial frame}`, why: 'These are the only inputs. (ii) is tested to extraordinary precision: modern optical-cavity experiments limit any direction dependence of c to around 1 part in 10¹⁷.' },
      { say: 'In the clock’s own frame, light goes straight up and back.', tex: R`\Delta\tau = \frac{2L}{c}`, why: 'Δτ is the proper time: the time measured by a clock at rest relative to where the ticks happen.' },
      { say: 'From the ground, the clock moves at v, so the light travels a diagonal.', tex: R`\left(\frac{c\,\Delta t}{2}\right)^2 = L^2 + \left(\frac{v\,\Delta t}{2}\right)^2`, why: 'In half a tick (Δt/2) the clock moves vΔt/2 sideways, and the light, still at c by postulate (ii), covers cΔt/2 along the hypotenuse. L is the same for both observers: lengths perpendicular to the motion cannot change, or two observers could disagree about which of two passing rulers is longer, breaking postulate (i).' },
      { say: 'Solve for Δt.', tex: R`\Delta t^2\,(c^2 - v^2) = 4L^2 \;\Longrightarrow\; \Delta t = \frac{2L/c}{\sqrt{1 - v^2/c^2}}`, why: 'Multiply out by 4, gather the Δt² terms, take the positive square root.' },
      { say: 'Time dilation.', tex: R`\Delta t = \gamma\,\Delta\tau, \qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}} \ge 1`, why: 'This must hold for every kind of clock, not just light clocks. Otherwise a light clock and a mechanical clock riding together would drift apart, revealing absolute motion and breaking postulate (i).' },
      { say: 'At everyday speeds the effect is tiny.', tex: R`\gamma \approx 1 + \frac{v^2}{2c^2}`, why: 'Binomial expansion of (1 − x)^{−1/2} with x = v²/c². For an airliner (≈ 250 m/s) the fractional effect is about 3 × 10⁻¹³, yet atomic clocks measured it (Hafele–Keating, 1971, together with the gravitational shift).' }
    ],
    result: R`\Delta t = \gamma\,\Delta\tau, \qquad \gamma = \left(1 - v^2/c^2\right)^{-1/2}`,
    assumptions: ['Perpendicular lengths are invariant. This is a genuine assumption, justified by the symmetry argument in step 3.', 'Inertial frames only. Accelerating clocks are handled by integrating dτ = dt/γ along the path, which resolves the twin paradox.', 'Each observer sees the other’s clock run slow. There is no contradiction because simultaneity is frame-dependent (Lorentz transformation).']
  });

  /* ------------------------------------------------------------ Y2 */
  const actionMemo = {};
  function action(n, e) {
    const g = 10, N = 400; let S = 0;
    for (let i = 0; i <= N; i++) {
      const tt = (2 * i) / N, y = 10 * tt - 5 * tt * tt + e * Math.sin((n * Math.PI * tt) / 2), yd = 10 - 10 * tt + e * ((n * Math.PI) / 2) * Math.cos((n * Math.PI * tt) / 2);
      const L = 0.5 * yd * yd - g * y, wgt = i === 0 || i === N ? 1 : i % 2 ? 4 : 2; S += wgt * L;
    }
    return (S * (2 / N)) / 3;
  }
  WL.topic({
    id: 'y2-lagrangian', stage: 'y2', strand: 'M', title: 'The Principle of Stationary Action',
    summary: 'Of all paths between two fixed events, nature picks the one where the action S = ∫(T − V)dt doesn’t change to first order. That condition is the Euler–Lagrange equation.',
    maths: [['Calculus of variations', 'Functionals S[q]'], ['Integration by parts', '∫u v′ = [uv] − ∫u′ v'], ['Partial derivatives', '∂L/∂q and ∂L/∂q̇'], ['First-order expansion', 'S(ε) = S(0) + ε S′(0) + …']],
    idea: 'Wiggle the true path by ε η(t), keeping the endpoints fixed. The action changes only at order ε², never at order ε: the true path sits at the bottom of a valley in “path space”.',
    anim: {
      duration: 13, alt: 'A ball’s true path and wiggled paths between fixed endpoints, with the action plotted against the wiggle size.',
      params: [{ id: 'n', label: 'Wiggle shape η', unit: '', min: 1, max: 3, step: 1, value: 1 }, { id: 'amp', label: 'Wiggle size', unit: 'm', min: 0, max: 3, step: 0.1, value: 2 }],
      beats: [[0, 'A ball thrown up: fix the start (0 s, 0 m) and end (2 s, 0 m).'], [3, 'Every path gets a number: S = ∫(½mẏ² − mgy) dt (m = 1 kg).'], [6, 'Wiggle the path by εη(t). The endpoints stay fixed.'], [9, 'S(ε) is flat at ε = 0: dS/dε = 0. The true path makes S stationary.']],
      draw(s, t) {
        const n = s.p.n, amp = s.p.amp, eps = amp * Math.sin(0.9 * t) * s.in(t, 6, 1);
        const yT = (x) => 10 * x - 5 * x * x, eta = (x) => Math.sin((n * Math.PI * x) / 2);
        const A = s.axes({ x0: 70, y0: 470, w: 460, h: 390, xr: [0, 2], yr: [-3, 8], xt: [0, 2, 0.5], yt: [-2, 8, 2], xl: 't / s', yl: 'y / m' });
        A.draw(s.in(t, 0, 1));
        s.alpha(s.in(t, 6, 1) * 0.35, () => [-1, -0.5, 0.5, 1].forEach((k) => A.fn((x) => yT(x) + k * amp * eta(x), 0, 2, { c: C.grey, w: 1.5 })));
        A.fn(yT, 0, 2, { c: C.green, w: 4, p: s.in(t, 0.5, 1.5) });
        s.alpha(s.in(t, 6, 1), () => A.fn((x) => yT(x) + eps * eta(x), 0, 2, { c: C.yellow, w: 3 }));
        s.dot(A.X(0), A.Y(0), { c: C.ink, r: 7 }); s.dot(A.X(2), A.Y(0), { c: C.ink, r: 7 });
        s.txt('true path', A.X(1), A.Y(5) - 18, { c: C.green, size: 17, align: 'center', sans: true });
        if (!actionMemo[n]) { const S0 = action(n, 0), pts = []; for (let i = 0; i <= 80; i++) { const e = -3 + (6 * i) / 80; pts.push([e, action(n, e) - S0]); } actionMemo[n] = { S0, pts }; }
        const M = actionMemo[n], top = 9 * (n * n * Math.PI * Math.PI) / 8;
        const B = s.axes({ x0: 640, y0: 470, w: 280, h: 300, xr: [-3, 3], yr: [-0.05 * top, top * 1.05], xt: [-3, 3, 1], xl: 'ε', yl: 'S − S_0' });
        const a3 = s.in(t, 3, 1);
        s.alpha(a3, () => { B.draw(1); s.poly(M.pts.map(([e, d]) => [B.X(e), B.Y(d)]), { c: C.blue, w: 3 }); });
        const Se = action(n, eps) - M.S0, slope = (2 * n * n * Math.PI * Math.PI * eps) / 8;
        s.alpha(s.in(t, 6, 1), () => {
          s.dot(B.X(eps), B.Y(Se), { c: C.yellow, r: 7 });
          const de = 0.7; s.line(B.X(eps - de), B.Y(Se - slope * de), B.X(eps + de), B.Y(Se + slope * de), { c: C.yellow, w: 2 });
        });
        s.txt(`S₀ = ${f2(M.S0)} J s`, 640, 90, { c: C.green, size: 19, a: a3 });
        s.txt(`ε = ${f2(eps)} m   S − S₀ = ${f2(Se)} J s`, 640, 122, { c: C.yellow, size: 18, a: s.in(t, 6, 1) });
        s.txt('dS/dε = 0 at ε = 0', 640, 156, { c: C.ink, size: 20, a: s.in(t, 9, 1) });
      }
    },
    steps: [
      { say: 'Define the action of any path q(t) between fixed endpoints.', tex: R`S[q] = \int_{t_1}^{t_2} L(q,\dot q,t)\,dt, \qquad L = T - V`, why: 'S is a functional: feed it an entire path and it returns one number. Hamilton’s principle, the postulate here, says the real path makes S stationary.' },
      { say: 'Vary the path while keeping the endpoints fixed.', tex: R`q(t)\to q(t) + \varepsilon\,\eta(t), \qquad \eta(t_1) = \eta(t_2) = 0`, why: 'η is any smooth wiggle that vanishes at both ends, exactly like the yellow paths in the animation.' },
      { say: 'Differentiate S with respect to ε at ε = 0.', tex: R`\frac{dS}{d\varepsilon}\Big|_{0} = \int_{t_1}^{t_2}\left(\frac{\partial L}{\partial q}\,\eta + \frac{\partial L}{\partial \dot q}\,\dot\eta\right)dt`, why: 'Chain rule inside the integral: L depends on ε through q = q₀ + εη and through q̇ = q̇₀ + εη̇.' },
      { say: 'Integrate the second term by parts.', tex: R`\int \frac{\partial L}{\partial \dot q}\,\dot\eta\,dt = \Big[\frac{\partial L}{\partial \dot q}\,\eta\Big]_{t_1}^{t_2} - \int \frac{d}{dt}\!\left(\frac{\partial L}{\partial \dot q}\right)\eta\,dt`, why: '∫u v′ dt = [uv] − ∫u′ v dt. The boundary term vanishes because η = 0 at both ends. That is precisely why the endpoints must be fixed.' },
      { say: 'Require it to vanish for every η.', tex: R`\int_{t_1}^{t_2}\left(\frac{\partial L}{\partial q} - \frac{d}{dt}\frac{\partial L}{\partial \dot q}\right)\eta\,dt = 0\ \ \forall\,\eta \;\Longrightarrow\; \frac{d}{dt}\frac{\partial L}{\partial \dot q} = \frac{\partial L}{\partial q}`, why: 'Fundamental lemma of the calculus of variations: if the bracket were nonzero anywhere, you could choose η peaked right there and make the integral nonzero.' },
      { say: 'Check with the ball: L = ½mẏ² − mgy.', tex: R`\frac{d}{dt}(m\dot y) = -mg \;\Longrightarrow\; \ddot y = -g`, why: '∂L/∂ẏ = mẏ and ∂L/∂y = −mg. Newton’s law falls out.' }
    ],
    result: R`\frac{d}{dt}\frac{\partial L}{\partial \dot q} - \frac{\partial L}{\partial q} = 0`,
    assumptions: ['“Least” action is a misnomer: S is stationary, not always minimal. Here S is a minimum (the second variation ½∫mη̇² dt > 0), but for an oscillator followed past half a period the true path becomes a saddle point.', 'Holonomic constraints and forces derivable from a potential (or a velocity-dependent generalised potential, like the magnetic force). Friction needs extensions such as Rayleigh’s dissipation function.', 'Action fixes both endpoints (a boundary-value problem); Newton fixes position and velocity at the start (an initial-value problem). They agree on which paths are physical, not on how you specify them.']
  });

  WL.topic({
    id: 'y2-em-waves', stage: 'y2', strand: 'E', title: 'Electromagnetic Waves from Maxwell',
    summary: 'In empty space Maxwell’s equations combine into a wave equation whose speed is 1/√(μ₀ε₀) = c. Light is an electromagnetic wave.',
    maths: [['Divergence & curl', '∇ · E, ∇ × E'], ['Vector identity', '∇ × (∇ × A) = ∇(∇ · A) − ∇²A'], ['Partial derivatives commute', '∇ × ∂/∂t = ∂/∂t ∇ ×'], ['Wave equation', '∇²f = (1/v²) ∂²f/∂t²']],
    idea: 'A changing B field makes a curling E field; a changing E field makes a curling B field. Each regenerates the other and the pair travels off at a speed fixed by two lab constants.',
    anim: {
      duration: 14, alt: 'A plane electromagnetic wave with perpendicular oscillating electric and magnetic field vectors.',
      params: [{ id: 'lam', label: 'Wavelength λ', unit: 'px', min: 140, max: 420, step: 10, value: 260 }],
      beats: [[0, 'The electric field E oscillates along y.'], [4, 'The magnetic field B oscillates along z, in phase and at right angles.'], [8, 'Each field’s change sustains the other: a self-propagating wave along x.'], [11, 'Its speed is fixed by electric and magnetic constants: c = 1/√(μ₀ε₀).']],
      draw(s, t) {
        const lam = s.p.lam, c = 110, k = (2 * Math.PI) / lam, w = k * c, A0 = 110, O = [110, 300];
        const P = (x, y, z) => [O[0] + x - 0.55 * z, O[1] - y + 0.36 * z];
        const ax = (a, b, col, lab) => { const p = P(...a), q = P(...b); s.arrow(p[0], p[1], q[0], q[1], { c: col, w: 2, head: 10 }); s.txt(lab, q[0] + 8, q[1] - 8, { c: col, size: 18, italic: true }); };
        ax([0, 0, 0], [800, 0, 0], C.dim, 'x'); ax([0, 0, 0], [0, 150, 0], C.yellow, 'y (E)'); ax([0, 0, 0], [0, 0, 190], C.blue, 'z (B)');
        const xs = []; for (let x = 0; x <= 760; x += 19) xs.push(x);
        const a4 = s.in(t, 4, 1);
        s.alpha(a4, () => { const env = []; xs.forEach((x) => { const B = 0.85 * A0 * Math.sin(k * x - w * t), p = P(x, 0, 0), q = P(x, 0, B); s.arrow(p[0], p[1], q[0], q[1], { c: C.blue, w: 1.8, head: 7 }); }); for (let x = 0; x <= 760; x += 4) env.push(P(x, 0, 0.85 * A0 * Math.sin(k * x - w * t))); s.poly(env, { c: C.blue, w: 2 }); });
        const a0 = s.in(t, 0, 1.2);
        s.alpha(a0, () => { const env = []; xs.forEach((x) => { const E = A0 * Math.sin(k * x - w * t), p = P(x, 0, 0), q = P(x, E, 0); s.arrow(p[0], p[1], q[0], q[1], { c: C.yellow, w: 1.8, head: 7 }); }); for (let x = 0; x <= 760; x += 4) env.push(P(x, A0 * Math.sin(k * x - w * t), 0)); s.poly(env, { c: C.yellow, w: 2.5 }); });
        s.alpha(s.in(t, 8, 1), () => { s.txt('∇ × E = −∂B/∂t', 620, 70, { c: C.blue, size: 21 }); s.txt('∇ × B = μ₀ε₀ ∂E/∂t', 620, 102, { c: C.yellow, size: 21 }); });
        s.txt('c = 1/√(μ₀ε₀) ≈ 2.998 × 10⁸ m/s', 480, 505, { c: C.ink, size: 24, align: 'center', a: s.in(t, 11, 1) });
      }
    },
    steps: [
      { say: 'Maxwell’s equations in vacuum: no charges, no currents.', tex: R`\nabla\cdot\vec E = 0,\quad \nabla\cdot\vec B = 0,\quad \nabla\times\vec E = -\frac{\partial\vec B}{\partial t},\quad \nabla\times\vec B = \mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}`, why: 'Gauss for E and B, Faraday, and Ampère with Maxwell’s displacement-current term. That last term is Maxwell’s addition; without it there would be no waves.' },
      { say: 'Take the curl of Faraday’s law.', tex: R`\nabla\times(\nabla\times\vec E) = -\frac{\partial}{\partial t}\left(\nabla\times\vec B\right)`, why: 'Space and time derivatives commute, so the curl can move inside ∂/∂t.' },
      { say: 'Use the curl-of-curl identity and Ampère–Maxwell.', tex: R`\nabla(\nabla\cdot\vec E) - \nabla^2\vec E = -\mu_0\varepsilon_0\,\frac{\partial^2\vec E}{\partial t^2}`, why: '∇ × (∇ × E) = ∇(∇ · E) − ∇²E (the “BAC − CAB” rule). On the right, replace ∇ × B by μ₀ε₀ ∂E/∂t.' },
      { say: 'In vacuum ∇ · E = 0.', tex: R`\nabla^2\vec E = \mu_0\varepsilon_0\,\frac{\partial^2\vec E}{\partial t^2}`, why: 'The gradient term vanishes. Compare the wave equation ∇²f = (1/v²) ∂²f/∂t². The same steps starting from Ampère give the identical equation for B.' },
      { say: 'Read off the speed.', tex: R`c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} \approx 2.998\times10^{8}\ \text{m/s}`, why: 'Maxwell computed this from purely electrical measurements (Weber & Kohlrausch) and found it matched the measured speed of light. Conclusion: light is an electromagnetic wave.' },
      { say: 'Structure of a plane wave.', tex: R`\vec E = E_0\,\hat y\cos(kx - \omega t), \quad \vec B = \frac{E_0}{c}\,\hat z\cos(kx - \omega t), \quad \omega = ck`, why: '∇ · E = 0 forces E to be perpendicular to the direction of travel (transverse). Faraday’s law, ∂B_z/∂t = −∂E_y/∂x, then makes B perpendicular to E, in phase, with magnitude E/c.' }
    ],
    result: R`\nabla^2\vec E = \frac{1}{c^2}\frac{\partial^2\vec E}{\partial t^2}, \qquad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}`,
    assumptions: ['Vacuum. In a medium ε₀ → ε and μ₀ → μ, giving v = c/n; frequency-dependent ε gives dispersion.', 'Classically the fields superpose exactly. Quantum electrodynamics predicts tiny light-by-light scattering, observed in heavy-ion collisions (ATLAS, 2017).', 'Since the 2019 SI redefinition, c is exact and μ₀ is measured, but μ₀ε₀c² = 1 still holds exactly.', 'The animation shows B scaled up for visibility: in SI units |B| = |E|/c is tiny compared with |E|.']
  });

  WL.topic({
    id: 'y2-boltzmann', stage: 'y2', strand: 'T', title: 'The Boltzmann Distribution',
    summary: 'Share energy at random among many particles and an exponential appears: n(E) ∝ e^{−E/k_BT}.',
    maths: [['Combinatorics', 'Multinomial coefficient N!/∏nᵢ!'], ['Stirling’s approximation', 'ln N! ≈ N ln N − N'], ['Lagrange multipliers', 'Maximising with constraints'], ['Logarithms', 'Turning products into sums']],
    idea: 'Most ways of sharing energy look the same: lots of particles with a little energy, a few with a lot. The overwhelmingly most likely distribution is exponential.',
    anim: {
      duration: 14, stateful: true, alt: 'A grid of 400 particles exchanging energy quanta and a histogram converging to an exponential.',
      params: [{ id: 'q', label: 'Mean energy (quanta)', unit: '', min: 1, max: 5, step: 1, value: 3 }, { id: 'rate', label: 'Exchanges per frame', unit: '', min: 20, max: 2000, step: 20, value: 300 }],
      beats: [[0, '400 particles, each starting with exactly the same energy.'], [4, 'Pick two at random and pass one quantum from one to the other. Repeat.'], [8, 'Total energy never changes, yet the distribution settles into a fixed shape.'], [11, 'That shape is exponential: n(E) ∝ e^{−E/k_BT}. Yellow = theory.']],
      setup(s) { s.state.E = new Int32Array(400).fill(Math.round(s.p.q)); s.state.n = 0; },
      step(s, dt) {
        if (s.t < 2) return;
        const E = s.state.E, m = Math.max(1, Math.round(s.p.rate * dt * 60));
        for (let k = 0; k < m; k++) { const i = (Math.random() * 400) | 0, j = (Math.random() * 400) | 0; if (i !== j && E[i] > 0) { E[i]--; E[j]++; } }
        s.state.n += m;
      },
      draw(s, t) {
        const E = s.state.E, q = Math.round(s.p.q), x = q / (1 + q), N = 400;
        for (let i = 0; i < N; i++) { const r = (i / 20) | 0, c = i % 20, e = Math.min(1, E[i] / (3 * q)); s.rect(48 + c * 17, 90 + r * 17, 15, 15, { fill: `hsl(${200 - 160 * e},${55 + 30 * e}%,${16 + 46 * e}%)`, fa: 1, stroke: false }); }
        s.txt('each square = one particle (brighter = more energy)', 48, 66, { c: C.dim, size: 14, sans: true });
        let tot = 0; for (let i = 0; i < N; i++) tot += E[i];
        s.txt(`total energy: ${tot} quanta (conserved)`, 48, 460, { c: C.ink, size: 18 });
        s.txt(`exchanges so far: ${s.state.n.toLocaleString()}`, 48, 492, { c: C.dim, size: 16, sans: true });
        const counts = new Array(16).fill(0); for (let i = 0; i < N; i++) if (E[i] < 16) counts[E[i]]++;
        const ymax = Math.max(150, 1.3 * N * (1 - x));
        const A = s.axes({ x0: 470, y0: 470, w: 440, h: 360, xr: [-0.6, 15.6], yr: [0, ymax], xt: [0, 15, 3], yt: [0, Math.floor(ymax / 50) * 50, 50], xl: 'E', yl: 'n(E)' });
        A.draw(s.in(t, 0, 1));
        counts.forEach((cn, e) => { const h = Math.min(cn, ymax); s.rect(A.X(e - 0.4), A.Y(h), A.X(e + 0.4) - A.X(e - 0.4), A.Y(0) - A.Y(h), { c: C.blue, fill: C.blue, fa: 0.45, w: 1.5 }); if (cn > ymax) s.txt(cn + ' ↑', A.X(e), A.Y(ymax) - 10, { c: C.blue, size: 14, align: 'center', sans: true }); });
        s.alpha(s.in(t, 11, 1), () => {
          A.fn((e) => N * (1 - x) * Math.pow(x, e), 0, 15, { c: C.yellow, w: 2.5 });
          for (let e = 0; e <= 15; e++) s.dot(A.X(e), A.Y(N * (1 - x) * Math.pow(x, e)), { c: C.yellow, r: 4 });
          s.txt('n(E) = N(1 − x)xᴱ,  x = exp(−ε/kT)', 905, 120, { c: C.yellow, size: 18, align: 'right' });
        });
      }
    },
    steps: [
      { say: 'N particles, energy levels Eᵢ, occupation numbers nᵢ. Count the microstates.', tex: R`\Omega(\{n_i\}) = \frac{N!}{\prod_i n_i!}`, why: 'The number of ways to assign N distinguishable particles so that nᵢ sit in level i is the multinomial coefficient.' },
      { say: 'Two constraints.', tex: R`\sum_i n_i = N, \qquad \sum_i n_i E_i = U`, why: 'Fixed particle number and fixed total energy (an isolated system). The animation conserves both exactly.' },
      { say: 'Use Stirling’s approximation.', tex: R`\ln\Omega \approx N\ln N - \sum_i n_i\ln n_i`, why: 'ln n! ≈ n ln n − n for large n. The −N and +Σnᵢ cancel because Σnᵢ = N.' },
      { say: 'Maximise ln Ω subject to the constraints (Lagrange multipliers α, β).', tex: R`\frac{\partial}{\partial n_j}\Big[\ln\Omega - \alpha\sum_i n_i - \beta\sum_i n_i E_i\Big] = -\ln n_j - 1 - \alpha - \beta E_j = 0`, why: 'The most probable distribution is the one with the most microstates. The multipliers enforce the two constraints while maximising.' },
      { say: 'Solve for nⱼ.', tex: R`n_j = e^{-1-\alpha}\,e^{-\beta E_j} = \frac{N}{Z}\,e^{-\beta E_j}, \qquad Z = \sum_i e^{-\beta E_i}`, why: 'The prefactor is fixed by Σnⱼ = N, which defines the partition function Z.' },
      { say: 'Identify β with temperature.', tex: R`\beta = \frac{1}{k_B T}`, why: 'With S = k_B ln Ω, one finds ∂S/∂U = k_B β. Thermodynamics defines 1/T = ∂S/∂U.' }
    ],
    result: R`n_j = \frac{N}{Z}\,e^{-E_j/k_BT}, \qquad Z = \sum_i e^{-E_i/k_BT}`,
    assumptions: ['Stirling needs every nᵢ to be large, which fails for the sparsely occupied high levels. The rigorous route is the canonical ensemble (a small system in contact with a large reservoir), which gives the same answer without that assumption.', 'Distinguishable, classical particles. Indistinguishable quantum particles give Bose–Einstein or Fermi–Dirac statistics; Boltzmann is their dilute limit.', 'Equal a priori probability of microstates is assumed, not derived. The animation’s random exchange satisfies detailed balance, so it samples microstates uniformly.', 'With equally spaced levels (quanta of size ε) the exponential is the geometric distribution N(1 − x)xᴱ. For finite N the exact distribution differs slightly.']
  });

  WL.topic({
    id: 'y2-infinite-well', stage: 'y2', strand: 'Q', title: 'Particle in a Box',
    summary: 'Trap a quantum particle between impenetrable walls and only certain energies are allowed: Eₙ ∝ n².',
    maths: [['Second-order ODEs', 'ψ″ = −k²ψ'], ['Boundary conditions', 'ψ(0) = ψ(L) = 0'], ['Normalisation integrals', '∫sin² = L/2'], ['Complex exponentials', 'e^{−iEt/ħ}']],
    idea: 'ψ has to vanish at both walls, so only a whole number of half-wavelengths fits. Fixed wavelengths mean fixed momenta, and fixed momenta mean <em>quantised energies</em>.',
    anim: {
      duration: 13, alt: 'Wavefunctions of a particle in a box with real and imaginary parts rotating and the probability density below.',
      params: [{ id: 'n', label: 'Quantum number n', unit: '', min: 1, max: 6, step: 1, value: 2 }, { id: 'sup', label: 'Superpose with n + 1', toggle: true, value: 0 }],
      beats: [[0, 'A particle trapped between infinitely high walls.'], [3, 'ψ must be zero at the walls: only whole half-wavelengths fit.'], [7, 'λ = 2L/n ⇒ p = nh/2L ⇒ Eₙ = n²E₁.'], [10, 'A single level: |ψ|² never moves. Switch on the superposition to see it slosh.']],
      draw(s, t) {
        const n = s.p.n, sup = s.p.sup, m = n + 1, w0 = 0.35, x0 = 100, Lp = 480, y1 = 210, A1 = 85, y2 = 480, A2 = 120;
        const ps = (k, u) => Math.sin(k * Math.PI * u), an = n * n * w0 * t, am = m * m * w0 * t;
        const re = (u) => (sup ? (ps(n, u) * Math.cos(an) + ps(m, u) * Math.cos(am)) / Math.SQRT2 : ps(n, u) * Math.cos(an));
        const im = (u) => (sup ? -(ps(n, u) * Math.sin(an) + ps(m, u) * Math.sin(am)) / Math.SQRT2 : -ps(n, u) * Math.sin(an));
        const sc2 = A2 / (sup ? 2 : 1);
        s.rect(x0 - 16, 50, 16, 450, { c: C.dim, fill: C.grey, fa: 0.35, w: 2 }); s.rect(x0 + Lp, 50, 16, 450, { c: C.dim, fill: C.grey, fa: 0.35, w: 2 });
        s.txt('V = ∞', x0 - 8, 36, { c: C.dim, size: 15, align: 'center' }); s.txt('V = ∞', x0 + Lp + 8, 36, { c: C.dim, size: 15, align: 'center' });
        s.line(x0, y1, x0 + Lp, y1, { c: C.dim, w: 1.2, dash: [5, 6] }); s.line(x0, y2, x0 + Lp, y2, { c: C.dim, w: 1.2 });
        const P = (f, y0, sc) => { const pts = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push([x0 + u * Lp, y0 - f(u) * sc]); } return pts; };
        const a0 = s.in(t, 0, 1.2);
        s.poly(P(im, y1, A1), { c: C.purple, w: 2, dash: [6, 5], p: a0 });
        s.poly(P(re, y1, A1), { c: C.blue, w: 3, p: a0 });
        const den = P((u) => re(u) ** 2 + im(u) ** 2, y2, sc2);
        s.poly([[x0, y2], ...den, [x0 + Lp, y2]], { c: C.yellow, w: 2.5, fill: C.yellow, fa: 0.3, p: a0 });
        s.txt('Re ψ', x0 + Lp + 30, y1 - 20, { c: C.blue, size: 18 }); s.txt('Im ψ', x0 + Lp + 30, y1 + 6, { c: C.purple, size: 18 }); s.txt('|ψ|²', x0 + Lp + 30, y2 - 40, { c: C.yellow, size: 18 });
        s.alpha(s.in(t, 3, 1) * (sup ? 0.25 : 1), () => { for (let i = 0; i < n; i++) { const xa = x0 + (i * Lp) / n, xb = x0 + ((i + 1) * Lp) / n; s.arrow(xa + 3, 70, xb - 3, 70, { c: C.teal, w: 2, both: true, head: 8 }); s.txt('λ/2', (xa + xb) / 2, 54, { c: C.teal, size: 15, align: 'center' }); } });
        const ex = 720, base = 490, k = 9;
        s.line(ex - 20, base, ex + 170, base, { c: C.dim, w: 1.5 }); s.txt('energy levels', ex + 75, 30, { c: C.dim, size: 14, align: 'center', sans: true });
        for (let j = 1; j <= 7; j++) { const y = base - j * j * k, on = j === n || (sup && j === m); s.line(ex, y, ex + 150, y, { c: on ? (j === n ? C.yellow : C.teal) : C.dim, w: on ? 3.5 : 1.5 }); s.txt(`n=${j}`, ex - 8, y, { c: on ? C.ink : C.dim, size: 13, align: 'right', sans: true }); s.txt(`${j * j}E₁`, ex + 158, y, { c: on ? C.ink : C.dim, size: 13, sans: true }); }
      }
    },
    steps: [
      { say: 'Inside the box V = 0, so the time-independent Schrödinger equation is:', tex: R`-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} = E\,\psi, \qquad 0 < x < L`, why: 'Separating variables, Ψ(x, t) = ψ(x) e^{−iEt/ħ}, turns the time-dependent equation into this eigenvalue equation for ψ.' },
      { say: 'Infinite walls force ψ to vanish there.', tex: R`\psi(0) = \psi(L) = 0`, why: 'Where V = ∞ any nonzero ψ would cost infinite energy, so ψ = 0 outside. ψ must be continuous, so it is zero at the walls. ψ′ is allowed to jump only because V is infinite.' },
      { say: 'General solution inside.', tex: R`\psi(x) = A\sin kx + B\cos kx, \qquad k = \frac{\sqrt{2mE}}{\hbar}`, why: 'ψ″ = −k²ψ is the SHM equation, in space instead of time.' },
      { say: 'Apply the boundary conditions.', tex: R`\psi(0)=0 \Rightarrow B = 0, \qquad \psi(L) = 0 \Rightarrow \sin kL = 0 \Rightarrow k_n = \frac{n\pi}{L}`, why: 'A = 0 would give ψ ≡ 0: no particle at all. So sin kL = 0 with n = 1, 2, 3, …; n = 0 is trivial and negative n give the same states.' },
      { say: 'Quantised energies.', tex: R`E_n = \frac{\hbar^2 k_n^2}{2m} = \frac{n^2\pi^2\hbar^2}{2mL^2}`, why: 'Energy grows as n². Equivalently, fit n half-wavelengths: λ = 2L/n, p = h/λ, E = p²/2m.' },
      { say: 'Normalise.', tex: R`\int_0^L |A|^2\sin^2\!\frac{n\pi x}{L}\,dx = 1 \;\Longrightarrow\; A = \sqrt{\frac{2}{L}}`, why: 'sin² averages ½ over whole half-periods, so the integral is |A|²L/2.' }
    ],
    result: R`\psi_n(x) = \sqrt{\tfrac{2}{L}}\sin\frac{n\pi x}{L}, \qquad E_n = \frac{n^2\pi^2\hbar^2}{2mL^2}`,
    assumptions: ['Infinite walls are an idealisation. A finite well lets ψ leak out in exponential tails and lowers every Eₙ.', 'Stationary states have time-independent |ψ|²; motion appears only in superpositions, which slosh at angular frequency (E_{n+1} − Eₙ)/ħ.', 'An energy eigenstate does not have a sharp momentum: sin kx = (e^{ikx} − e^{−ikx})/2i is a mix of ±ħk, and the finite box broadens the momentum distribution further. “p = h/λ” is a heuristic shortcut.']
  });
})();
