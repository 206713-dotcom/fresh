/* Geodesic landing: a Schwarzschild black hole with a thin accretion disk, ray-traced live on the GPU.
   Units G = c = M = 1 (horizon r = 2, photon sphere r = 3, innermost stable circular orbit r = 6).
   Every pixel follows its light ray backwards along a null geodesic. A ray stays in the plane through the hole that
   contains it, where u = 1/r obeys   d²u/dφ² + u = 3u²   (integrated with RK4 in φ). The camera is a static observer
   at radius r_c, so a ray leaving at angle α from the outward radial direction has impact parameter
   b = r_c sin α / √(1 − 2/r_c). A ray ends at the horizon (u = ½), escapes (u → 0: the sky is sampled in its final
   direction), or is cut off after a few turns near the photon sphere. Where it crosses the equatorial plane between
   r = 6 and r_out it collects disk light: flux F ∝ r⁻³(1 − √(6/r)) (zero torque at the inner edge), temperature ∝ F^¼,
   frequency ratio g = (1 − 2/r_c)^(−½) √(1 − 3/r) / (1 − Ωλ) with Ω = r^(−3/2) and λ = L/E of the photon about the
   disk axis, observed temperature gT and intensity ∝ g⁴.
   API: WL.bh.start(canvas, { intro: ms }) -> { supported, outro(done, ms), stop() }; intro flies the camera in from afar                                                  */
(function () {
  const WL = (window.WL = window.WL || {});
  const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

  const COMMON = `
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec4 h43(vec3 p){ vec4 q = fract(vec4(p.xyzx) * vec4(.1031, .1030, .0973, .1099)); q += dot(q, q.wzxy + 33.33); return fract((q.xxyz + q.yzzw) * q.zywx); }
float h13(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
/* value noise that repeats every P cells along y (the disk's azimuth) */
float vnp(vec2 p, float P){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); float y0 = mod(i.y, P), y1 = mod(i.y + 1., P);
  return mix(mix(h12(vec2(i.x, y0)), h12(vec2(i.x + 1., y0)), f.x), mix(h12(vec2(i.x, y1)), h12(vec2(i.x + 1., y1)), f.x), f.y); }
vec3 blackbody(float T){                       /* sRGB colour of a black body, made linear */
  T = clamp(T, 900., 40000.) / 100.;
  float r = T <= 66. ? 1. : clamp(1.29293618606 * pow(T - 60., -.1332047592), 0., 1.);
  float g = T <= 66. ? clamp(.390081578769 * log(T) - .631841443788, 0., 1.) : clamp(1.12989086089 * pow(T - 60., -.0755148492), 0., 1.);
  float b = T >= 66. ? 1. : (T <= 19. ? 0. : clamp(.543206789110 * log(T - 10.) - 1.19625408914, 0., 1.));
  return pow(vec3(r, g, b), vec3(2.2));
}
vec3 chroma(float T){ vec3 c = blackbody(T); return c / max(dot(c, vec3(.2126, .7152, .0722)), 1e-4); }
`;

  const SCENE_FS = `#version 300 es
precision highp float;
uniform vec2 u_res, u_shift;
uniform vec3 u_cam, u_R, u_U, u_F;
uniform float u_tanf, u_t, u_gobs, u_rin, u_rout, u_T0, u_Fn, u_exp, u_tone;
uniform int u_steps;
out vec4 o;
${COMMON}
const float PI = 3.14159265, TAU = 6.2831853;
vec2 fd(vec2 s){ return vec2(s.y, -s.x + 3. * s.x * s.x); }
float hermite(float u0, float v0, float u1, float v1, float t, float h){
  float t2 = t * t, t3 = t2 * t;
  return (2. * t3 - 3. * t2 + 1.) * u0 + (t3 - 2. * t2 + t) * h * v0 + (-2. * t3 + 3. * t2) * u1 + (t3 - t2) * h * v1;
}
/* disk light: turbulence carried round at the local orbital speed, two layers so the shear never piles up */
float diskTex(float r, float psi){
  float Om = pow(r, -1.5), lr = log(r) * 6.5;
  float P = 100., a = fract(u_t / P), w = 1. - abs(2. * a - 1.);
  float s1 = 0., s2 = 0.;
  { float ps = psi + Om * a * P; float y = ps / TAU * 14.; float amp = .6, per = 14.; vec2 q = vec2(lr, y);
    for (int k = 0; k < 3; k++){ s1 += amp * vnp(q, per); q = vec2(q.x * 2.11 + 3.1, q.y * 2.); per *= 2.; amp *= .45; } }
  { float ps = psi + Om * fract(a + .5) * P; float y = ps / TAU * 14.; float amp = .6, per = 14.; vec2 q = vec2(lr + 17.3, y + 5.);
    for (int k = 0; k < 3; k++){ s2 += amp * vnp(q, per); q = vec2(q.x * 2.11 + 3.1, q.y * 2.); per *= 2.; amp *= .45; } }
  float n = mix(s2, s1, w) / .99;
  return .22 + 1.7 * pow(clamp(n, 0., 1.), 2.1);
}
vec3 sky(vec3 d){
  vec3 c = vec3(0.);
  /* a faint galactic band with dust */
  vec3 gp = normalize(vec3(.32, .9, -.28));
  float lat = dot(d, gp), band = exp(-lat * lat / .045);
  float dn = vn3(d * 5.) * .5 + vn3(d * 11. + 3.) * .3 + vn3(d * 23. - 7.) * .2;
  float dust = smoothstep(.42, .75, vn3(d * 7. + 11.) * .6 + vn3(d * 17.) * .4);
  c += band * (.012 + .03 * dn) * (1. - .85 * dust * band) * vec3(.55, .62, 1.);
  c += exp(-lat * lat / .006) * .02 * dn * vec3(1., .78, .62) * (1. - dust);
  /* stars on a cube sphere */
  vec3 a3 = abs(d); vec2 uv; float face;
  if (a3.x >= a3.y && a3.x >= a3.z) { face = d.x > 0. ? 0. : 1.; uv = d.yz / a3.x; }
  else if (a3.y >= a3.z) { face = d.y > 0. ? 2. : 3.; uv = d.xz / a3.y; }
  else { face = d.z > 0. ? 4. : 5.; uv = d.xy / a3.z; }
  vec2 g = (uv * .5 + .5) * 230.; vec2 cl = floor(g);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 cc = cl + vec2(i, j); vec4 h = h43(vec3(cc, face * 97.));
    if (h.x > .1) continue;
    vec2 pos = cc + .15 + .7 * h.yz; float dd = length(g - pos);
    float mag = pow(h.w, 14.) * 9. + pow(h.w, 3.) * .5 + .06;
    float sg = .1 + .05 * h.w;
    float T = 3000. + 9000. * fract(h.w * 37.13);
    c += chroma(T) * mag * exp(-dd * dd / (2. * sg * sg)) * .55;
  }
  return c;
}
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
void main(){
  vec2 p = (gl_FragCoord.xy - .5 * u_res) / (.5 * u_res.y) - u_shift;
  vec3 d = normalize(u_F + (p.x * u_R + p.y * u_U) * u_tanf);
  float rc = length(u_cam); vec3 rh = u_cam / rc;
  float ca = dot(d, rh); vec3 tv = d - ca * rh; float sa = length(tv);
  vec3 col = vec3(0.); float A = 0.;
  bool esc = false; vec3 dinf = rh;
  if (sa < 1e-5) { esc = ca > 0.; dinf = rh; }
  else {
    vec3 e1 = rh, e2 = tv / sa;
    float b = rc * sa / sqrt(1. - 2. / rc);
    float u = 1. / rc, k = 1. / (b * b) - u * u * (1. - 2. * u);
    float v = (ca > 0. ? -1. : 1.) * sqrt(max(k, 0.));
    float lam = -b * dot(cross(e1, e2), vec3(0., 1., 0.));
    float Ry = length(vec2(e1.y, e2.y));
    float phc = mod(atan(e2.y, e1.y) + .5 * PI, PI); if (phc < 1e-4) phc += PI;
    float phi = 0., h = .045;
    for (int i = 0; i < 420; i++) {
      if (i >= u_steps) break;
      vec2 s = vec2(u, v);
      vec2 k1 = fd(s), k2 = fd(s + .5 * h * k1), k3 = fd(s + .5 * h * k2), k4 = fd(s + h * k3);
      vec2 sn = s + h / 6. * (k1 + 2. * k2 + 2. * k3 + k4);
      float phn = phi + h;
      if (Ry > 1e-6 && phc <= phn) {
        float tt = (phc - phi) / h, uc = hermite(u, v, sn.x, sn.y, tt, h);
        if (uc > 0.) {
          float r = 1. / uc;
          if (r > u_rin && r < u_rout) {
            vec3 P = r * (cos(phc) * e1 + sin(phc) * e2);
            float psi = atan(P.z, P.x);
            float Om = pow(r, -1.5);
            float g = u_gobs * sqrt(1. - 3. / r) / (1. - Om * lam);
            float F = (1. - sqrt(u_rin / r)) / (r * r * r) / u_Fn;
            float m = diskTex(r, psi);
            float Tem = u_T0 * pow(max(F, 0.), .25);
            float I = F * m * g * g * g * g;
            float al = smoothstep(u_rin, u_rin + .35, r) * (1. - smoothstep(u_rout - 7., u_rout, r));
            al *= clamp(.55 + .6 * m, 0., 1.);
            col += (1. - A) * al * chroma(g * Tem) * I * u_exp;
            A += (1. - A) * al;
          }
        }
        phc += PI;
      }
      if (sn.x <= 0.) { float tz = u / (u - sn.x); float pz = phi + tz * h; dinf = cos(pz) * e1 + sin(pz) * e2; esc = true; break; }
      if (sn.x >= .5 || A > .992) break;
      u = sn.x; v = sn.y; phi = phn;
    }
  }
  if (esc) col += (1. - A) * sky(dinf);
  if (u_tone > .5) col = pow(aces(col * .9), vec3(1. / 2.2));
  o = vec4(col, 1.);
}`;

  /* bloom: 13-tap downsample (the first one keeps only what is bright), tent upsample added back up the chain */
  const DOWN_FS = `#version 300 es
precision highp float; uniform sampler2D u_src; uniform vec2 u_px; uniform float u_first, u_thr; out vec4 o;
vec3 s(vec2 uv){ return texture(u_src, uv).rgb; }
void main(){
  vec2 t = u_px, uv = gl_FragCoord.xy * 2. / vec2(textureSize(u_src, 0));
  vec3 a = s(uv + t * vec2(-2, 2)), b = s(uv + t * vec2(0, 2)), c = s(uv + t * vec2(2, 2));
  vec3 d = s(uv + t * vec2(-2, 0)), e = s(uv), f = s(uv + t * vec2(2, 0));
  vec3 g = s(uv + t * vec2(-2, -2)), h = s(uv + t * vec2(0, -2)), i = s(uv + t * vec2(2, -2));
  vec3 j = s(uv + t * vec2(-1, 1)), k = s(uv + t * vec2(1, 1)), l = s(uv + t * vec2(-1, -1)), m = s(uv + t * vec2(1, -1));
  vec3 r = e * .125 + (a + c + g + i) * .03125 + (b + d + f + h) * .0625 + (j + k + l + m) * .125;
  if (u_first > .5) { float br = max(r.r, max(r.g, r.b)); float q = clamp(br - u_thr + .5, 0., 1.); q = q * q * .5; r *= max(q, br - u_thr) / max(br, 1e-4); }
  o = vec4(r, 1.);
}`;
  const UP_FS = `#version 300 es
precision highp float; uniform sampler2D u_src; uniform vec2 u_px; uniform vec2 u_dst; uniform float u_k; out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy / u_dst; vec2 t = u_px;
  vec3 c = texture(u_src, uv).rgb * 4.;
  c += (texture(u_src, uv + vec2(-t.x, 0)).rgb + texture(u_src, uv + vec2(t.x, 0)).rgb + texture(u_src, uv + vec2(0, -t.y)).rgb + texture(u_src, uv + vec2(0, t.y)).rgb) * 2.;
  c += texture(u_src, uv + vec2(-t.x, -t.y)).rgb + texture(u_src, uv + vec2(t.x, -t.y)).rgb + texture(u_src, uv + vec2(-t.x, t.y)).rgb + texture(u_src, uv + vec2(t.x, t.y)).rgb;
  o = vec4(c / 16. * u_k, 1.);
}`;
  const COMP_FS = `#version 300 es
precision highp float; uniform sampler2D u_scene, u_bloom; uniform vec2 u_out; uniform float u_bk, u_t, u_fade; out vec4 o;
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_out;
  vec3 c = texture(u_scene, uv).rgb + texture(u_bloom, uv).rgb * u_bk;
  float l = dot(c, vec3(.2126, .7152, .0722)); c = max(mix(vec3(l), c, 1.18), 0.);
  c = aces(c * .92);
  vec2 q = uv - .5; c *= 1. - .35 * dot(q, q) * 1.6;
  c = pow(c, vec3(1. / 2.2));
  c += (h12(gl_FragCoord.xy + fract(u_t) * 913.) - .5) / 255. * 1.5;
  o = vec4(c * u_fade, 1.);
}`;

  function sh(gl, type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const m = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(m); } return s; }
  function prog(gl, fs) {
    const p = gl.createProgram(); gl.attachShader(p, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const U = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); U[a.name] = gl.getUniformLocation(p, a.name); }
    return { p, U };
  }
  const NOPE = { supported: false, outro: (d) => d && d(), stop() {} };

  function start(canvas, opts) {
    opts = opts || {};
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    if (!gl) return NOPE;
    const hdr = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
    let P;
    try { P = { scene: prog(gl, SCENE_FS), down: hdr && prog(gl, DOWN_FS), up: hdr && prog(gl, UP_FS), comp: hdr && prog(gl, COMP_FS) }; }
    catch (e) { console.warn('bh shader', e); return NOPE; }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    /* flux normalisation: F(r) = r⁻³(1 − √(6/r)) peaks at r = 49/6 */
    const RIN = 6, ROUT = 19, Fpk = (1 - Math.sqrt(RIN / (49 / 6))) / Math.pow(49 / 6, 3);
    const st = {
      t: 380, inc: 1.43, az: 0.6, rc: 38, fov: 0.30, q: coarse ? 0.5 : 0.72, steps: coarse ? 230 : 320,
      drag: null, vAz: 0, vInc: 0, outro: null, running: true, fade: 1, lastT: performance.now(), slow: 0, fast: 0, frames: 0
    };
    /* arrival: the camera starts far out and slows as it comes to rest, a little above the disk, settling to its usual view */
    if (opts.intro && !reduced) { st.intro = { t0: performance.now(), dur: +opts.intro || 3000, rc0: 150, rc1: st.rc, inc0: 1.18, inc1: st.inc }; st.rc = 150; st.inc = 1.18; }
    let W = 0, H = 0, SW = 0, SH = 0, tex = [], fbo = [], sizes = [];
    function mkTarget(w, h) {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok ? { t, f, w, h } : null;
    }
    let useHdr = hdr;
    function resize() {
      const cw = canvas.clientWidth || innerWidth, ch = canvas.clientHeight || innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(cw * dpr)), h = Math.max(2, Math.round(ch * dpr));
      const sc = Math.min(1, st.q * Math.min(1.5, dpr) / dpr);
      const sw = Math.max(2, Math.round(w * sc)), sh2 = Math.max(2, Math.round(h * sc));
      if (w === W && h === H && sw === SW && sh2 === SH) return;
      W = w; H = h; SW = sw; SH = sh2; canvas.width = W; canvas.height = H;
      tex.forEach((x) => { if (x) { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.f); } }); tex = [];
      if (useHdr) {
        tex.push(mkTarget(SW, SH));
        let w2 = SW, h2 = SH; for (let i = 0; i < 5; i++) { w2 = Math.max(1, w2 >> 1); h2 = Math.max(1, h2 >> 1); tex.push(mkTarget(w2, h2)); }
        if (tex.some((x) => !x)) { useHdr = false; tex.forEach((x) => { if (x) { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.f); } }); tex = []; }
      }
    }
    /* camera: inclination from the disk axis, azimuth, distance; the hole is placed off-centre for the page layout */
    function camera() {
      const si = Math.sin(st.inc), ci = Math.cos(st.inc), sa = Math.sin(st.az), ca = Math.cos(st.az);
      const pos = [st.rc * si * ca, st.rc * ci, st.rc * si * sa];
      const F = [-pos[0] / st.rc, -pos[1] / st.rc, -pos[2] / st.rc];
      let up = [0, 1, 0]; const dp = F[0] * up[0] + F[1] * up[1] + F[2] * up[2];
      up = [up[0] - dp * F[0], up[1] - dp * F[1], up[2] - dp * F[2]]; const ul = Math.hypot(up[0], up[1], up[2]) || 1; up = up.map((x) => x / ul);
      const R = [F[1] * up[2] - F[2] * up[1], F[2] * up[0] - F[0] * up[2], F[0] * up[1] - F[1] * up[0]];
      return { pos, F, U: up, R };
    }
    function layout() {
      const aspect = W / H;
      /* portrait screens: keep the disk's width on screen; landscape: the hole sits right of the headline */
      if (aspect < 0.9) return { shift: [0, -0.12], tanf: Math.max(st.fov, 0.3 / aspect) };
      return { shift: [aspect > 1.45 ? 0.2 : 0.1, 0.26], tanf: st.fov };
    }
    function drawScene(target, tone) {
      const S = P.scene, U = S.U, c = camera(), L = layout();
      gl.useProgram(S.p);
      if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, target.w, target.h); gl.uniform2f(U.u_res, target.w, target.h); }
      else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.uniform2f(U.u_res, W, H); }
      gl.uniform2f(U.u_shift, L.shift[0], L.shift[1]);
      gl.uniform3fv(U.u_cam, c.pos); gl.uniform3fv(U.u_R, c.R); gl.uniform3fv(U.u_U, c.U); gl.uniform3fv(U.u_F, c.F);
      gl.uniform1f(U.u_tanf, L.tanf); gl.uniform1f(U.u_t, st.t); gl.uniform1f(U.u_gobs, 1 / Math.sqrt(1 - 2 / st.rc));
      gl.uniform1f(U.u_rin, RIN); gl.uniform1f(U.u_rout, ROUT); gl.uniform1f(U.u_T0, 5200); gl.uniform1f(U.u_Fn, Fpk);
      gl.uniform1f(U.u_exp, 0.72 * (st.outro ? 1 + 0.6 * st.outro.e : 1)); gl.uniform1f(U.u_tone, tone ? 1 : 0); gl.uniform1i(U.u_steps, st.steps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function frame() {
      if (!useHdr) { drawScene(null, true); return; }
      drawScene(tex[0], false);
      /* down */
      gl.useProgram(P.down.p);
      for (let i = 1; i < tex.length; i++) {
        const s = tex[i - 1], d = tex[i]; gl.bindFramebuffer(gl.FRAMEBUFFER, d.f); gl.viewport(0, 0, d.w, d.h);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, s.t); gl.uniform1i(P.down.U.u_src, 0);
        gl.uniform2f(P.down.U.u_px, 1 / s.w, 1 / s.h); gl.uniform1f(P.down.U.u_first, i === 1 ? 1 : 0); gl.uniform1f(P.down.U.u_thr, 0.85);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      /* up, adding each level into the one above */
      gl.useProgram(P.up.p); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      for (let i = tex.length - 1; i > 1; i--) {
        const s = tex[i], d = tex[i - 1]; gl.bindFramebuffer(gl.FRAMEBUFFER, d.f); gl.viewport(0, 0, d.w, d.h);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, s.t); gl.uniform1i(P.up.U.u_src, 0);
        gl.uniform2f(P.up.U.u_px, 1 / s.w, 1 / s.h); gl.uniform2f(P.up.U.u_dst, d.w, d.h); gl.uniform1f(P.up.U.u_k, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      gl.disable(gl.BLEND);
      /* composite */
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.useProgram(P.comp.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[0].t); gl.uniform1i(P.comp.U.u_scene, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[1].t); gl.uniform1i(P.comp.U.u_bloom, 1);
      gl.uniform2f(P.comp.U.u_out, W, H); gl.uniform1f(P.comp.U.u_bk, 0.8); gl.uniform1f(P.comp.U.u_t, st.t); gl.uniform1f(P.comp.U.u_fade, st.fade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* drag to look round the hole */
    const pt = (ev) => (ev.touches && ev.touches[0] ? ev.touches[0] : ev);
    const onDown = (ev) => { if (st.outro || st.intro) return; const p = pt(ev); st.drag = { x: p.clientX, y: p.clientY, t: performance.now() }; };
    const onMove = (ev) => {
      if (!st.drag || st.outro) return; const p = pt(ev), now = performance.now();
      const dx = p.clientX - st.drag.x, dy = p.clientY - st.drag.y, dt = Math.max(8, now - st.drag.t);
      const k = 2.6 / Math.max(320, canvas.clientHeight || 600);
      st.az -= dx * k; st.inc = Math.min(Math.PI - 0.06, Math.max(0.06, st.inc - dy * k));
      st.vAz = -dx * k / dt * 1000; st.vInc = -dy * k / dt * 1000; st.drag = { x: p.clientX, y: p.clientY, t: now };
    };
    const onUp = () => { st.drag = null; };
    canvas.addEventListener('pointerdown', onDown); window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onUp);
    const onVis = () => { if (!document.hidden) st.lastT = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    let raf = 0;
    function loop(now) {
      if (!st.running) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(0.1, (now - st.lastT) / 1000); st.lastT = now;
      /* adapt the resolution of the ray tracing to the machine */
      if (st.frames++ > 20 && !st.outro) {
        if (dt > 0.026) { st.slow++; st.fast = 0; } else if (dt < 0.014) { st.fast++; st.slow = 0; } else { st.slow = Math.max(0, st.slow - 1); st.fast = Math.max(0, st.fast - 1); }
        if (st.slow > 24 && st.q > 0.3) { st.q = Math.max(0.3, st.q * 0.84); st.steps = Math.max(170, st.steps - 25); st.slow = 0; resize(); }
        else if (st.fast > 150 && st.q < 0.95) { st.q = Math.min(0.95, st.q * 1.08); st.fast = 0; resize(); }
      }
      st.t += dt * 15;
      if (!st.drag) {
        st.az += st.vAz * dt + dt * 0.012; st.inc += st.vInc * dt; st.vAz *= Math.pow(0.12, dt); st.vInc *= Math.pow(0.12, dt);
        if (!st.outro) st.inc += (1.43 + 0.03 * Math.sin(st.t * 0.004) - st.inc) * Math.min(1, dt * 0.08);
        st.inc = Math.min(Math.PI - 0.06, Math.max(0.06, st.inc));
      }
      if (st.intro && !st.outro) {
        const o = st.intro, u = Math.min(1, (now - o.t0) / o.dur), e = 1 - Math.pow(1 - u, 3);
        st.rc = o.rc0 + (o.rc1 - o.rc0) * e; st.inc = o.inc0 + (o.inc1 - o.inc0) * e;
        if (u >= 1) st.intro = null;
      }
      if (st.outro) {
        const o = st.outro, u = Math.min(1, (now - o.t0) / o.dur), e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        o.e = e; st.rc = o.rc0 + (9.2 - o.rc0) * e; st.inc = o.inc0 + (1.5 - o.inc0) * e; st.fov = o.fov0 + (0.46 - o.fov0) * e;
        st.fade = u > 0.82 ? Math.max(0, 1 - (u - 0.82) / 0.18) : 1;
        if (u >= 1 && !o.fired) { o.fired = true; o.done(); }
      }
      resize(); frame();
    }
    resize();
    if (reduced) { frame(); } else raf = requestAnimationFrame(loop);
    const onResize = () => { if (reduced) { resize(); frame(); } };
    window.addEventListener('resize', onResize);
    return {
      supported: true,
      outro(done, dur = 3600) {
        if (st.outro) return;
        if (reduced) { done && done(); return; }
        st.intro = null; st.drag = null; st.vAz = 0.05; st.outro = { t0: performance.now(), dur, done: done || (() => {}), rc0: st.rc, inc0: st.inc, fov0: st.fov, e: 0, fired: false };
      },
      stop() {
        st.running = false; cancelAnimationFrame(raf);
        canvas.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
        window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
        try { const lc = gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); } catch (e) {}
      },
      _state: st
    };
  }
  WL.bh = { start };
})();
