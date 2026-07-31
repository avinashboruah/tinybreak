import * as THREE from 'three';
import { waveHeight } from './waves.js';

function tentacleColor(k) {
  // base -> tip gradient, deep violet to fleshy pink underside hint
  const base = new THREE.Color(0x2c1a42);
  const tip = new THREE.Color(0x6b3f6e);
  return base.clone().lerp(tip, k);
}

function buildTentacle(segCount, len, baseR) {
  const g = new THREE.Group();
  const segs = [];
  let parent = g;
  for (let i = 0; i < segCount; i++) {
    const segLen = len / segCount;
    const k0 = i / segCount, k1 = (i + 1) / segCount;
    const r0 = baseR * (1 - k0 * 0.88);
    const r1 = baseR * (1 - k1 * 0.88);
    const geo = new THREE.CylinderGeometry(Math.max(r1, 0.04), Math.max(r0, 0.07), segLen, 7, 1);
    geo.translate(0, segLen / 2, 0);
    const skin = new THREE.MeshPhongMaterial({ color: tentacleColor(k0), flatShading: true, shininess: 60, specular: 0x554466 });
    const mesh = new THREE.Mesh(geo, skin);
    const pivot = new THREE.Group();
    pivot.position.y = i === 0 ? 0 : segLen;
    pivot.add(mesh);
    // sucker rings on the underside, every other segment, skip tip
    if (i % 2 === 0 && i < segCount - 1) {
      const sucker = new THREE.Mesh(new THREE.TorusGeometry(Math.max(r0 * 0.55, 0.05), r0 * 0.16, 5, 8), new THREE.MeshPhongMaterial({ color: 0xd9a8c4, flatShading: true }));
      sucker.rotation.x = Math.PI / 2;
      sucker.position.y = segLen * 0.5;
      pivot.add(sucker);
    }
    parent.add(pivot);
    segs.push(pivot);
    parent = pivot;
  }
  g.userData.segs = segs;
  return g;
}

function buildKraken() {
  const g = new THREE.Group();
  const n = 6;
  const tentacles = [];
  for (let i = 0; i < n; i++) {
    const len = 15 + Math.random() * 5;
    const t = buildTentacle(8, len, 0.95 + Math.random() * 0.3);
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.35;
    const r = 4 + Math.random() * 2.5;
    t.position.set(Math.cos(a) * r, -1, Math.sin(a) * r);
    t.rotation.y = -a + Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    t.userData.phase = Math.random() * 10;
    t.userData.len = len;
    tentacles.push(t);
    g.add(t);
  }
  const foam = new THREE.Mesh(new THREE.CircleGeometry(9, 20), new THREE.MeshBasicMaterial({
    color: 0x241333, transparent: true, opacity: 0.5,
  }));
  foam.rotation.x = -Math.PI / 2;
  foam.position.y = 0.05;
  g.add(foam);
  // rising bubbles during warning phase
  const bubbleGeo = new THREE.SphereGeometry(0.3, 6, 5);
  const bubbles = [];
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(bubbleGeo, new THREE.MeshPhongMaterial({ color: 0xbfe8f0, transparent: true, opacity: 0.55 }));
    const a = Math.random() * Math.PI * 2, r = Math.random() * 8;
    b.position.set(Math.cos(a) * r, 0.2, Math.sin(a) * r);
    b.scale.setScalar(0.4 + Math.random() * 0.8);
    b.userData = { phase: Math.random() * 5, speed: 0.6 + Math.random() * 0.6, baseY: b.position.y };
    bubbles.push(b);
    g.add(b);
  }
  g.userData.tentacles = tentacles;
  g.userData.foam = foam;
  g.userData.bubbles = bubbles;
  return g;
}

export class Kraken {
  constructor(scene) {
    this.scene = scene;
    this.mesh = buildKraken();
    this.mesh.visible = false;
    this.mesh.userData.tentacles.forEach(t => t.visible = false);
    scene.add(this.mesh);
    this.pos = new THREE.Vector3();
    this.dangerRadius = 100;
    this.riseT = 0;
  }

  spawnNear(shipPos, minDist = 45, maxDist = 95) {
    const a = Math.random() * Math.PI * 2;
    const d = minDist + Math.random() * (maxDist - minDist);
    this.pos.set(shipPos.x + Math.sin(a) * d, 0, shipPos.z + Math.cos(a) * d);
    this.riseT = 0;
    this.mesh.userData.tentacles.forEach(t => t.visible = false);
  }

  // called once when the warning ends and the tentacles should surface
  surface() {
    this.riseT = 0.0001;
    this.mesh.userData.tentacles.forEach(t => t.visible = true);
  }

  update(dt, t, warningOnly) {
    const h = waveHeight(this.pos.x, this.pos.z, t);
    this.mesh.position.set(this.pos.x, h * 0.7, this.pos.z);
    this.mesh.visible = true;

    for (const b of this.mesh.userData.bubbles) {
      const u = b.userData;
      b.position.y = u.baseY + ((t * u.speed + u.phase) % 2.2);
      b.material.opacity = Math.max(0, 0.55 * (1 - (b.position.y - u.baseY) / 2.2));
    }
    this.mesh.userData.foam.material.opacity = 0.35 + Math.sin(t * 2) * 0.1;

    if (warningOnly) return;

    this.riseT = Math.min(1, this.riseT + dt / 1.1);
    const rise = 1 - Math.pow(1 - this.riseT, 3); // ease-out emerge

    for (const tent of this.mesh.userData.tentacles) {
      const segs = tent.userData.segs;
      const sway = 0.5 + Math.sin(t * 0.8 + tent.userData.phase) * 0.5;
      tent.position.y = -tent.userData.len * (1 - rise) + sway * 1.2 * rise;
      tent.visible = true;
      for (let i = 0; i < segs.length; i++) {
        const travel = t * 1.8 - i * 0.55 + tent.userData.phase;
        const amp = (0.08 + i * 0.045) * rise;
        segs[i].rotation.z = Math.sin(travel) * amp;
        segs[i].rotation.x = Math.cos(travel * 0.8) * amp * 0.7;
      }
    }
  }

  distanceTo(shipPos) {
    return Math.hypot(this.pos.x - shipPos.x, this.pos.z - shipPos.z);
  }
}
