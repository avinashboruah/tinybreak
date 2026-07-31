import * as THREE from 'three';
import { waveHeight } from './waves.js';

const mat = (c, extra = {}) => new THREE.MeshPhongMaterial({ color: c, flatShading: true, ...extra });

function buildSharkMesh() {
  const g = new THREE.Group();
  const skin = mat(0x5c6b75);
  const belly = mat(0xcfd8dc);
  // body: stretched octahedron-ish via cone+cone
  const bodyGeo = new THREE.CylinderGeometry(0.05, 1.1, 6.5, 8, 1);
  bodyGeo.rotateX(Math.PI / 2);
  bodyGeo.rotateZ(Math.PI);
  const body = new THREE.Mesh(bodyGeo, skin);
  body.scale.set(0.85, 1, 1);
  g.add(body);
  const tailGeo = new THREE.CylinderGeometry(1.1, 0.02, 2.6, 8, 1);
  tailGeo.rotateX(Math.PI / 2);
  tailGeo.rotateZ(Math.PI);
  const tailBase = new THREE.Mesh(tailGeo, skin);
  tailBase.scale.set(0.85, 1, 1);
  tailBase.position.z = 4.55;
  g.add(tailBase);
  // belly underside hint
  const bellyMesh = new THREE.Mesh(new THREE.ConeGeometry(0.7, 6, 4), belly);
  bellyMesh.rotation.x = Math.PI / 2;
  bellyMesh.position.set(0, -0.55, 0);
  bellyMesh.scale.set(0.7, 0.5, 1);
  g.add(bellyMesh);
  // dorsal fin
  const finGeo = new THREE.ConeGeometry(0.85, 1.6, 3);
  const fin = new THREE.Mesh(finGeo, skin);
  fin.position.set(0, 1.15, -0.3);
  fin.rotation.z = Math.PI;
  fin.rotation.x = -0.15;
  g.add(fin);
  // tail fin (vertical)
  const tailFinGeo = new THREE.ConeGeometry(1.4, 2.0, 3);
  const tailFin = new THREE.Mesh(tailFinGeo, skin);
  tailFin.position.set(0, 0.3, 5.6);
  tailFin.rotation.x = Math.PI / 2.1;
  g.add(tailFin);
  // pectoral fins
  for (const side of [-1, 1]) {
    const pec = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 3), skin);
    pec.position.set(side * 0.9, -0.2, 1.4);
    pec.rotation.z = side * 1.1;
    pec.rotation.x = 0.3;
    g.add(pec);
  }
  // eyes
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), mat(0x111111));
    eye.position.set(side * 0.55, 0.15, -2.6);
    g.add(eye);
  }
  g.userData.fin = fin;
  g.userData.tail = tailBase;
  g.userData.tailFin = tailFin;
  return g;
}

export class Shark {
  constructor(scene) {
    this.scene = scene;
    this.mesh = buildSharkMesh();
    scene.add(this.mesh);
    this.pos = new THREE.Vector3();
    this.heading = 0;
    this.speed = 9.5;
    this.state = 'hunting';   // hunting only for now
    this.warnFlash = 0;
  }

  spawnNear(shipPos, shipHeading, minDist = 140, maxDist = 220) {
    const ang = Math.random() * Math.PI * 2;
    const d = minDist + Math.random() * (maxDist - minDist);
    this.pos.set(shipPos.x + Math.sin(ang) * d, 0, shipPos.z + Math.cos(ang) * d);
    this.heading = ang + Math.PI;
  }

  update(dt, t, shipPos) {
    // steer toward ship
    const dx = shipPos.x - this.pos.x, dz = shipPos.z - this.pos.z;
    const targetHeading = Math.atan2(dx, dz);
    let diff = targetHeading - this.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.heading += Math.max(-1.4 * dt, Math.min(1.4 * dt, diff));
    this.pos.x += Math.sin(this.heading) * this.speed * dt;
    this.pos.z += Math.cos(this.heading) * this.speed * dt;
    const h = waveHeight(this.pos.x, this.pos.z, t);
    this.mesh.position.set(this.pos.x, h * 0.75 - 0.35 + Math.sin(t * 2.4) * 0.12, this.pos.z);
    this.mesh.rotation.set(0, this.heading, Math.sin(t * 2.4) * 0.05);
    // swim wiggle
    this.mesh.userData.tail.rotation.y = Math.sin(t * 7) * 0.5;
    this.mesh.userData.tailFin.rotation.z = Math.sin(t * 7) * 0.35;
    this.mesh.userData.fin.position.y = 1.15 + Math.sin(t * 2.4) * 0.05;
    return Math.hypot(dx, dz);
  }
}
