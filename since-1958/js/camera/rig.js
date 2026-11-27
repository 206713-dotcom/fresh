// Camera rig: floating origin + view rotation, OrbitControls in two modes, and flights.
//
// Render space = R * (world - O). The origin O and rotation R depend on the mode:
//   orbit  O = body centre,               R = identity (ecliptic north up)
//   site   O = site point on the surface, R = site frame (x east, y up, z south)
//   flight O = camera position,           R = identity
// three.js composes model-view matrices in double precision on the CPU, so keeping O near
// the camera keeps every vertex sent to the GPU small and free of float32 jitter.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { planFlight } from './flight.js';
import { orbitPose, sitePose, liftFor, bodySpheres, WORLD_UP, SITE_ALT_KM, SITE_LOOK_H_KM } from './targets.js';

const Y = new THREE.Vector3(0, 1, 0);

export class CameraRig {
  constructor(camera, dom, eph, clock) {
    this.camera = camera;
    this.eph = eph;
    this.clock = clock;
    this.controls = new OrbitControls(camera, dom);
    Object.assign(this.controls, {
      enableDamping: true, dampingFactor: 0.08, rotateSpeed: 0.55, zoomSpeed: 1.6, enablePan: false,
    });
    this.mode = 'orbit';
    this.bodyId = 'earth';
    this.eq = null;
    this.O = new THREE.Vector3();
    this.R = new THREE.Matrix4();       // world -> render (rotation)
    this.Rinv = new THREE.Matrix4();
    this.qv = new THREE.Quaternion();   // rotation part of R
    this.camWorld = new THREE.Vector3();
    this.camQuatWorld = new THREE.Quaternion();
    this.flight = null;
    this.photo = null;
    this.listeners = { arrive: [], depart: [] };
    this._E = new THREE.Vector3(); this._U = new THREE.Vector3(); this._N = new THREE.Vector3();
    this._m = new THREE.Matrix4();
  }

  on(type, fn) { this.listeners[type].push(fn); }
  emit(type, p) { for (const fn of this.listeners[type]) fn(p); }

  get flying() { return !!this.flight; }

  /** Compute O and R for a mode at the current ephemeris state. */
  computeFrame(mode = this.mode, bodyId = this.bodyId, eq = this.eq) {
    const b = this.eph[bodyId];
    if (mode === 'site' && eq) {
      b.siteFrame(eq.lat, eq.lon, this._E, this._U, this._N);
      b.surfacePoint(eq.lat, eq.lon, SITE_ALT_KM, this.O);
      const south = this._N.clone().negate();
      this.Rinv.makeBasis(this._E, this._U, south);   // render -> world
      this.R.copy(this.Rinv).transpose();
    } else {
      this.O.copy(b.pos);
      this.R.identity(); this.Rinv.identity();
    }
    this.qv.setFromRotationMatrix(this.R);
  }

  toRender(p, out) { return out.copy(p).sub(this.O).applyMatrix4(this.R); }
  toWorld(p, out) { return out.copy(p).applyMatrix4(this.Rinv).add(this.O); }

  /** Place the camera at a world pose for the current mode (used at the end of flights). */
  _applyPose(P1, T1) {
    this.computeFrame();
    this.toRender(P1, this.camera.position);
    this.toRender(T1, this.controls.target);
    this.camera.up.copy(Y);
    this.controls._sphericalDelta.set(0, 0, 0);
    this.controls._panOffset.set(0, 0, 0);
    this.controls._scale = 1;
    this._limits();
    this.controls.update();
  }

  // ---- photo mode: the camera stays where it is and you look around freely (also upward),
  // so the sky, the Earth and the horizon can be framed for a screenshot.
  enterPhoto() {
    this.stopSwing();
    if (this.flight || this.photo) return false;
    this.tween = null;
    const e = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.photo = { yaw: e.y, pitch: e.x, fov0: this.camera.fov, pos0: this.camera.position.clone() };
    this.controls.enabled = false;
    return true;
  }
  exitPhoto() {
    if (!this.photo) return;
    this.camera.fov = this.photo.fov0; this.camera.updateProjectionMatrix();
    this.camera.position.copy(this.photo.pos0);
    this.photo = null;
    this.controls.enabled = true;
    this.controls.update();
  }
  photoLook(dx, dy) {
    const p = this.photo; if (!p) return;
    const k = this.camera.fov / 45 * 0.0032;
    const sgn = p.walk ? -1 : 1;   // walking: drag left turns the view left (first-person style)
    p.yaw += sgn * dx * k; p.pitch = Math.max(-1.55, Math.min(1.55, p.pitch + sgn * dy * k));
  }
  photoZoom(f) {
    if (!this.photo) return;
    this.camera.fov = Math.max(8, Math.min(100, this.camera.fov * f)); this.camera.updateProjectionMatrix();
  }
  // ---- walk mode: first-person astronaut on the surface (crewed landing sites only).
  // Built on photo mode: WASD moves, Space jumps, with the real gravity of the body.
  enterWalk(gravity) {
    if (this.mode !== 'site' || !this.enterPhoto()) return false;
    this.photoStand();
    this.photo.pitch = 0;
    this.camera.fov = 62; this.camera.updateProjectionMatrix();
    this.photo.walk = { vy: 0, g: gravity / 1000, keys: new Set(), air: false, scale: 1 };
    return true;
  }
  _walkTurn(dt) {
    const p = this.photo, K = p.walk.keys;
    p.yaw += ((K.has('arrowleft') ? 1 : 0) - (K.has('arrowright') ? 1 : 0)) * 1.6 * dt;
    p.pitch = Math.max(-1.55, Math.min(1.55, p.pitch + ((K.has('arrowup') ? 1 : 0) - (K.has('arrowdown') ? 1 : 0)) * 1.2 * dt));
  }
  _walkStep(dt) {
    const p = this.photo, w = p.walk, c = this.camera.position, K = w.keys;
    const EYE = 0.0017;
    const f = (K.has('w') ? 1 : 0) - (K.has('s') ? 1 : 0), r = (K.has('d') ? 1 : 0) - (K.has('a') ? 1 : 0);
    if (f || r) {
      const sp = (K.has('shift') ? 0.0042 : 0.0022) * (w.air ? 0.85 : 1) * dt / Math.hypot(f, r);
      const sy = Math.sin(p.yaw), cy = Math.cos(p.yaw);
      c.x += (-sy * f + cy * r) * sp; c.z += (-cy * f - sy * r) * sp;
    }
    // stay near the site, and out of the lander standing at the centre
    const d = Math.hypot(c.x, c.z);
    if (d > 0.6) { c.x *= 0.6 / d; c.z *= 0.6 / d; }
    if (d < 0.0048 && d > 0) { c.x *= 0.0048 / d; c.z *= 0.0048 / d; }
    if (K.has(' ') && !w.air) { w.vy = 0.0026; w.air = true; }
    if (w.air) {
      w.vy -= w.g * dt; c.y += w.vy * dt;
      if (c.y <= EYE) { c.y = EYE; w.vy = 0; w.air = false; }
    } else c.y = EYE;
  }

  /** Site only: put the camera at eye height (1.7 m) where it currently hovers. */
  photoStand() {
    if (!this.photo || this.mode !== 'site') return;
    const c = this.camera.position, t = this.controls.target;
    const dx = c.x - t.x, dz = c.z - t.z, d = Math.hypot(dx, dz) || 1, want = Math.min(Math.max(d, 0.012), 0.03);
    c.set(t.x + dx / d * want, 0.0017, t.z + dz / d * want);
  }
  /** Turn toward a body. In site mode the view is widened so the horizon stays in frame too. */
  photoAim(bodyId) {
    const p = this.photo; if (!p) return;
    this.computeFrame();
    const v = this.toRender(this.eph[bodyId].pos, new THREE.Vector3()).sub(this.camera.position).normalize();
    const el = Math.asin(Math.max(-1, Math.min(1, v.y)));
    p.yaw = Math.atan2(-v.x, -v.z);
    if (this.mode === 'site' && el > 0.05) {
      const deg = el * 180 / Math.PI;
      this.camera.fov = Math.max(40, Math.min(100, deg + 26));
      p.pitch = el / 2 - 0.03;
    } else { p.pitch = el; this.camera.fov = Math.min(this.camera.fov, 45); }
    this.camera.updateProjectionMatrix();
    return el;
  }

  _limits() {
    const R = this.eph[this.bodyId].radius;
    const c = this.controls;
    if (this.mode === 'site') {
      c.minDistance = 0.004; c.maxDistance = R * 1.2;
      c.maxPolarAngle = Math.PI / 2 - 0.02; c.enablePan = true; c.screenSpacePanning = false;
      c.zoomSpeed = 1.4;
    } else {
      c.minDistance = R * 1.12; c.maxDistance = R * 700;
      if (this.eph[this.bodyId].isProbe) { c.minDistance = 0.006; c.maxDistance = 5e7; }   // ride-along: 6 m to far enough to see a whole flyby
      c.maxPolarAngle = Math.PI; c.enablePan = false;
      c.zoomSpeed = 1.6;
    }
  }

  /** Opening shot: orbit view of the Earth, sunlit side turned toward us. */
  /** toward: optional direction (world) the camera should face past the body, e.g. the centre of the Milky Way. */
  /** Where to stand (unit vector from the body) so that `toward` is behind the body and a little to one side. */
  orbitDir(bodyId, toward) {
    const sunDir = this.eph[bodyId].pos.clone().negate().normalize();
    return toward.clone().multiplyScalar(-0.86).addScaledVector(sunDir, 0.44).addScaledVector(WORLD_UP, 0.10).normalize();
  }
  /** Orbit view of a body from a given direction (unit vector from the body) and distance (in body radii). */
  initView(bodyId, dir, distR) {
    this.mode = 'orbit'; this.bodyId = bodyId; this.eq = null; this.swing = null;
    const b = this.eph[bodyId];
    this._applyPose(b.pos.clone().addScaledVector(dir.clone().normalize(), b.radius * distR), b.pos.clone());
  }
  /** Drop whatever the camera is doing and stand at a body again (used by Restart). */
  resetView(bodyId, dir, distR) {
    if (this.photo) this.exitPhoto();
    if (this.flight) { this.flight = null; this.clock.holds = Math.max(0, this.clock.holds - 1); }
    this.tween = null; this.swing = null; this.controls.enabled = true;
    this.initView(bodyId, dir, distR);
  }
  /** The opening move: back away from the body first, then swing smoothly around it to a new direction. */
  swingTo(dir, distR, dur = 5) {
    if (this.mode !== 'orbit' || this.flight || this.photo) return false;
    const p0 = this.camera.position.clone().sub(this.controls.target), R = this.eph[this.bodyId].radius;
    this.swing = { dir0: p0.clone().normalize(), d0: p0.length(), dir1: dir.clone().normalize(), d1: R * distR, t: 0, dur };
    this.controls.enabled = false;
    return true;
  }
  /** Stop the swing where it is and hand the camera back (the visitor grabbed it). */
  stopSwing() { if (!this.swing) return; this.swing = null; this.controls.enabled = true; }

  initOrbit(bodyId, toward) {
    this.mode = 'orbit'; this.bodyId = bodyId; this.eq = null; this.swing = null;
    const b = this.eph[bodyId];
    const sunDir = b.pos.clone().negate().normalize();
    if (toward) {
      // stand so that `toward` is behind the body and a little to one side, with most of the day side in view
      this._applyPose(b.pos.clone().addScaledVector(this.orbitDir(bodyId, toward), b.radius * 3.15), b.pos.clone());
      return;
    }
    const side = new THREE.Vector3().crossVectors(sunDir, WORLD_UP).normalize();
    const d = sunDir.multiplyScalar(0.62).addScaledVector(side, 0.74).addScaledVector(WORLD_UP, 0.22).normalize();
    const P1 = b.pos.clone().addScaledVector(d, b.radius * 3.0);
    this._applyPose(P1, b.pos.clone());
  }

  currentStart() {
    if (this.mode === 'site' && this.eq) {
      const p = sitePose(this.eph, this.eq);
      p.T1 = this.toWorld(this.controls.target, new THREE.Vector3());
      return p;
    }
    if (this.mode === 'orbit') return { kind: 'orbit', bodyId: this.bodyId, T1: this.eph[this.bodyId].pos.clone() };
    return { kind: 'free', T1: this.camWorld.clone().add(new THREE.Vector3(0, 0, -1000).applyQuaternion(this.camQuatWorld)) };
  }

  flyToBody(bodyId) {
    this.eph.update(this.clock.ms);      // the clock may have just jumped
    this.syncWorldPose();
    const dest = orbitPose(this.eph, bodyId, this.camWorld);
    this._fly(dest);
  }

  flyToSite(eq) {
    this.eph.update(this.clock.ms);
    this._fly(sitePose(this.eph, eq));
  }

  /** Recompute the camera's world pose from the current frame (after a time jump the
   *  bodies have moved, and the camera moves with its frame). */
  syncWorldPose() {
    if (this.flight) return;
    this.computeFrame();
    this.camera.updateMatrixWorld();
    this.toWorld(this.camera.position, this.camWorld);
    this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
  }

  _fly(dest) {
    if (this.swing) { this.swing = null; this.controls.enabled = true; }
    if (this.photo) this.exitPhoto();
    if (this.tween) { this.tween = null; this.controls.enabled = true; }
    this.syncWorldPose();
    const start = this.flight ? { kind: 'free', T1: this.flight.lookNow.clone() } : this.currentStart();
    const P0 = this.camWorld.clone(), q0 = this.camQuatWorld.clone();
    const plan = planFlight({
      P0, q0, T0: start.T1,
      lift: start.kind === 'free' ? null : liftFor(this.eph, start, P0),
      cruiseLook: dest.cruiseLook, A: dest.A, P1: dest.P1, T1: dest.T1, upFinal: dest.upFinal, arc: dest.arc,
      bodies: bodySpheres(this.eph), worldUp: WORLD_UP,
    });
    if (!this.flight) this.clock.holds++;
    this.controls.enabled = false;
    this.flight = { plan, dest, t: 0, lookNow: dest.T1.clone() };
    this.emit('depart', dest);
  }

  /** Short glide within the current site to look at one piece of hardware.
   *  targetRender: point in site render space (km); dist: viewing distance (km). */
  /** Put the camera at pos looking at look (both in the site frame, in km). Used by the landing scenes. */
  setLook(pos, look) {
    if (this.mode !== 'site' || this.flight) return;
    const c = this.controls; this.tween = null;
    c.target.copy(look); this.camera.position.copy(pos);
    c._sphericalDelta.set(0, 0, 0); c._panOffset.set(0, 0, 0); c.update();
    this.camera.updateMatrixWorld();
    this.toWorld(this.camera.position, this.camWorld);
    this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
  }
  /** The direction from the orbit target to the camera (site frame). */
  viewDir() { return this.camera.position.clone().sub(this.controls.target); }

  focusLocal(targetRender, dist) {
    if (this.mode !== 'site' || this.flight) return;
    const c = this.controls;
    const t0 = c.target.clone(), p0 = this.camera.position.clone();
    const off0 = p0.clone().sub(t0);
    const d0 = off0.length();
    const dir1 = off0.clone().normalize();
    dir1.y = Math.max(dir1.y, 0.3); dir1.normalize();          // keep a view from above the ground
    this.tween = { t0, t1: targetRender.clone(), dir0: off0.normalize(), dir1, d0, d1: dist, t: 0, dur: 1.4 };
    c.enabled = false;
  }

  update(dt) {
    if (this.swing && !this.flight && this.mode === 'orbit') {
      // first back away (distance eased over the first 45 %), then turn around the body on one smooth arc
      const w = this.swing; w.t += dt;
      const u = Math.min(1, w.t / w.dur);
      const soft = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
      const kd = soft(u / 0.45), ka = soft((u - 0.22) / 0.78);
      const ang = Math.acos(Math.max(-1, Math.min(1, w.dir0.dot(w.dir1)))), sn = Math.sin(ang) || 1;
      const dir = ang < 1e-4 ? w.dir1.clone() : w.dir0.clone().multiplyScalar(Math.sin((1 - ka) * ang) / sn).addScaledVector(w.dir1, Math.sin(ka * ang) / sn).normalize();
      this.computeFrame();
      this.controls.target.set(0, 0, 0);
      this.camera.position.copy(dir).multiplyScalar(w.d0 * Math.pow(w.d1 / w.d0, kd));
      this.camera.up.copy(Y);
      this.controls._sphericalDelta.set(0, 0, 0); this.controls._panOffset.set(0, 0, 0); this.controls._scale = 1;
      this.controls.update();
      if (u >= 1) { this.swing = null; this.controls.enabled = true; }
      this.camera.updateMatrixWorld();
      this.toWorld(this.camera.position, this.camWorld);
      this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
      return;
    }
    if (this.tween && !this.flight) {
      const w = this.tween;
      w.t += dt;
      const u = Math.min(1, w.t / w.dur), e = u * u * (3 - 2 * u);
      this.computeFrame();
      this.controls.target.lerpVectors(w.t0, w.t1, e);
      const dir = w.dir0.clone().lerp(w.dir1, e).normalize();
      const d = w.d0 * Math.pow(w.d1 / w.d0, e);
      this.camera.position.copy(this.controls.target).addScaledVector(dir, d);
      this.controls._sphericalDelta.set(0, 0, 0); this.controls._panOffset.set(0, 0, 0);
      this.controls.update();
      if (u >= 1) { this.tween = null; this.controls.enabled = true; }
      this.camera.updateMatrixWorld();
      this.toWorld(this.camera.position, this.camWorld);
      this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
      return;
    }
    if (this.flight) {
      const f = this.flight;
      f.t += dt;
      const u = Math.min(1, f.t / f.plan.duration);
      f.plan.sample(u, this.camWorld, this.camQuatWorld);
      f.lookNow.copy(this.camWorld).add(new THREE.Vector3(0, 0, -1000).applyQuaternion(this.camQuatWorld));
      this.O.copy(this.camWorld); this.R.identity(); this.Rinv.identity(); this.qv.identity();
      this.camera.position.set(0, 0, 0);
      this.camera.quaternion.copy(this.camQuatWorld);
      this.camera.updateMatrixWorld();
      if (u >= 1) this._finish();
      return;
    }
    this.computeFrame();
    if (this.photo && this.photo.walk) {
      // fast-forward = the same physics played faster (speed and gravity scale together)
      const T = dt * this.photo.walk.scale, n = Math.max(1, Math.ceil(T / 0.02));
      this._walkTurn(dt);
      for (let i = 0; i < n; i++) this._walkStep(T / n);
    }
    if (this.photo) this.camera.quaternion.setFromEuler(new THREE.Euler(this.photo.pitch, this.photo.yaw, 0, 'YXZ'));
    else this.controls.update();
    this.camera.updateMatrixWorld();
    this.toWorld(this.camera.position, this.camWorld);
    this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
  }

  _finish() {
    const { dest } = this.flight;
    this.flight = null;
    this.clock.holds = Math.max(0, this.clock.holds - 1);
    this.mode = dest.kind;
    this.bodyId = dest.bodyId;
    this.eq = dest.kind === 'site' ? dest.eq : null;
    this.controls.enabled = true;
    this._applyPose(dest.P1, dest.T1);
    this.toWorld(this.camera.position, this.camWorld);
    this.camQuatWorld.copy(this.qv).invert().multiply(this.camera.quaternion);
    this.emit('arrive', dest);
  }

  /** Distance from the camera to the focused body's centre / site, in km. */
  focusDistance() {
    if (this.mode === 'site') return this.camera.position.distanceTo(this.controls.target);
    return this.camWorld.distanceTo(this.eph[this.bodyId].pos);
  }
}

export { SITE_LOOK_H_KM };
