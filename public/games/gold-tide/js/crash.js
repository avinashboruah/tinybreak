import * as THREE from 'three';

const woodMat = new THREE.MeshPhongMaterial({ color: 0x8a5a33, flatShading: true });
const darkMat = new THREE.MeshPhongMaterial({ color: 0x5a3f2a, flatShading: true });

function smokeTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  g.addColorStop(0, 'rgba(90,80,70,0.85)');
  g.addColorStop(1, 'rgba(90,80,70,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const SMOKE_TEX = null;

export class Crash {
  constructor(scene, pos) {
    this.scene = scene;
    this.t = 0;
    this.duration = 1.4;
    this.done = false;
    this.group = new THREE.Group();
    this.group.position.copy(pos);
    scene.add(this.group);

    // wood debris
    this.debris = [];
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.5 + Math.random() * 0.7, 0.15, 0.9 + Math.random()), Math.random() > 0.5 ? woodMat : darkMat);
      const ang = Math.random() * Math.PI * 2, spd = 6 + Math.random() * 9;
      m.userData.vel = new THREE.Vector3(Math.cos(ang) * spd, 6 + Math.random() * 7, Math.sin(ang) * spd);
      m.userData.spin = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
      m.position.set(0, 1.5, 0);
      this.group.add(m);
      this.debris.push(m);
    }
    // smoke puffs
    const tex = smokeTexture();
    this.smoke = [];
    const smat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.NormalBlending });
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Sprite(smat.clone());
      s.scale.setScalar(3 + Math.random() * 2);
      const ang = Math.random() * Math.PI * 2, r = Math.random() * 2;
      s.position.set(Math.cos(ang) * r, 1 + Math.random(), Math.sin(ang) * r);
      s.userData.vel = new THREE.Vector3(Math.cos(ang) * 1.5, 3 + Math.random() * 2, Math.sin(ang) * 1.5);
      this.group.add(s);
      this.smoke.push(s);
    }
    // flash flare
    const flareMat = new THREE.SpriteMaterial({ map: tex, color: 0xffdd88, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const flare = new THREE.Sprite(flareMat);
    flare.scale.setScalar(1);
    flare.position.set(0, 1.5, 0);
    this.group.add(flare);
    this.flare = flare;
  }

  update(dt) {
    this.t += dt;
    const k = this.t / this.duration;
    for (const d of this.debris) {
      d.userData.vel.y -= 18 * dt;
      d.position.addScaledVector(d.userData.vel, dt);
      d.rotation.x += d.userData.spin.x * dt;
      d.rotation.y += d.userData.spin.y * dt;
      d.rotation.z += d.userData.spin.z * dt;
    }
    for (const s of this.smoke) {
      s.position.addScaledVector(s.userData.vel, dt);
      s.userData.vel.multiplyScalar(1 - dt * 0.6);
      s.scale.setScalar((3 + (1 - Math.pow(1 - Math.min(1, this.t), 2)) * 4));
      s.material.opacity = Math.max(0, 0.8 * (1 - k * 1.1));
    }
    this.flare.scale.setScalar(1 + k * 14);
    this.flare.material.opacity = Math.max(0, 1 - k * 3.2);
    if (k >= 1) {
      this.done = true;
      this.scene.remove(this.group);
    }
  }
}
