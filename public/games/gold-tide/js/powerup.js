import * as THREE from 'three';
import { waveHeight } from './waves.js';

function glowTex(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, `rgba(${hex},0.9)`);
  g.addColorStop(0.45, `rgba(${hex},0.35)`);
  g.addColorStop(1, `rgba(${hex},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export class PowerUp {
  constructor(scene) {
    this.scene = scene;
    const g = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), new THREE.MeshPhongMaterial({ color: 0x123a5c, flatShading: true, shininess: 80, emissive: 0x1560a8, emissiveIntensity: 0.6 }));
    g.add(ball);
    const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 5), new THREE.MeshPhongMaterial({ color: 0x5a4a30 }));
    fuse.position.y = 1.15;
    g.add(fuse);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 5), new THREE.MeshBasicMaterial({ color: 0x3ea8ff }));
    spark.position.y = 1.42;
    g.add(spark);
    this.spark = spark;
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('62,168,255'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    glow.scale.set(9, 9, 1);
    glow.position.y = 0.6;
    g.add(glow);
    this.glow = glow;
    this.mesh = g;
    this.mesh.visible = false;
    scene.add(g);
    this.pos = new THREE.Vector3();
    this.phase = Math.random() * 6;
  }

  spawnNear(shipPos, heading) {
    const baseA = Math.atan2(-Math.sin(heading), -Math.cos(heading));
    const ang = baseA + (Math.random() - 0.5) * 1.6;
    const d = 60 + Math.random() * 120;
    this.pos.set(shipPos.x + Math.sin(ang) * d, 0, shipPos.z + Math.cos(ang) * d);
    this.mesh.visible = true;
  }

  update(dt, t) {
    const h = waveHeight(this.pos.x, this.pos.z, t);
    this.mesh.position.set(this.pos.x, h * 0.8 + Math.sin(t * 1.6 + this.phase) * 0.3, this.pos.z);
    this.mesh.rotation.y += dt * 0.8;
    this.spark.material.color.setHSL(0.58, 0.9, 0.5 + Math.sin(t * 20) * 0.15);
    this.glow.scale.setScalar(9 + Math.sin(t * 3 + this.phase) * 1.2);
  }

  distanceTo(shipPos) {
    return Math.hypot(this.pos.x - shipPos.x, this.pos.z - shipPos.z);
  }
}
