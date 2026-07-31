import { sdk } from './sdk.js';

export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.touch = { forward: false, back: false, left: false, right: false };
    this.yaw = 0;      // mouse look, relative to ship heading
    this.pitch = 0;
    this.locked = false;
    this.dragging = false;
    this.lastX = 0; this.lastY = 0;
    this.onLockChange = null;
    this.sensitivity = parseFloat(sdk.getItem('pirate-sensitivity') || '1');

    addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement === canvas;
      if (isLocked) {
        this.locked = true;
        if (this.onLockChange) this.onLockChange(true);
      }
    });
    document.addEventListener('pointerlockerror', () => {
      // sandboxed/embedded preview often blocks real pointer lock — fall back to drag-to-look
      this.fallback = true;
      this.locked = true;
      if (this.onLockChange) this.onLockChange(true);
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.locked || this.fallback) return;
      this.yaw -= e.movementX * 0.0022 * this.sensitivity;
      this.pitch -= e.movementY * 0.0022 * this.sensitivity;
      const lim = Math.PI / 2 - 0.08;
      this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
    });
    // fallback drag-to-look, via Pointer Events so it transparently covers touch too
    canvas.addEventListener('pointerdown', (e) => {
      if (!this.locked || !this.fallback) return;
      this.dragging = true;
      this.dragId = e.pointerId;
      this.lastX = e.clientX; this.lastY = e.clientY;
    });
    document.addEventListener('pointermove', (e) => {
      if (!this.dragging || e.pointerId !== this.dragId) return;
      const dx = e.clientX - this.lastX, dy = e.clientY - this.lastY;
      this.lastX = e.clientX; this.lastY = e.clientY;
      this.yaw -= dx * 0.0032 * this.sensitivity;
      this.pitch -= dy * 0.0032 * this.sensitivity;
      const lim = Math.PI / 2 - 0.08;
      this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
    });
    document.addEventListener('pointerup', (e) => { if (e.pointerId === this.dragId) this.dragging = false; });
  }
  setSensitivity(v) {
    this.sensitivity = v;
    sdk.setItem('pirate-sensitivity', String(v));
  }
  lock() {
    if (this.canvas.requestPointerLock) {
      const p = this.canvas.requestPointerLock();
      // some browsers return a Promise that rejects instead of firing pointerlockerror
      if (p && p.catch) p.catch(() => {
        this.fallback = true;
        this.locked = true;
        if (this.onLockChange) this.onLockChange(true);
      });
      // safety timeout: if neither change nor error fires, assume blocked
      setTimeout(() => {
        if (!this.locked) {
          this.fallback = true;
          this.locked = true;
          if (this.onLockChange) this.onLockChange(true);
        }
      }, 400);
    } else {
      this.fallback = true;
      this.locked = true;
      if (this.onLockChange) this.onLockChange(true);
    }
  }
  unlock() {
    this.locked = false;
    if (document.exitPointerLock) document.exitPointerLock();
  }
  get input() {
    return {
      forward: !!this.keys['KeyW'] || this.touch.forward,
      back: !!this.keys['KeyS'] || this.touch.back,
      left: !!this.keys['KeyA'] || this.touch.left,
      right: !!this.keys['KeyD'] || this.touch.right,
    };
  }
}
