import * as THREE from 'three';
import { waveHeight } from './waves.js';

const WOOD = 0x8a5a33, WOOD_DK = 0x6e4423, WOOD_LT = 0xa97142;
const mat = (c, extra = {}) => new THREE.MeshPhongMaterial({ color: c, flatShading: true, ...extra });

function wedge(w, h, len) {
  // triangular prism pointing -Z: rectangle at z=0, edge at z=-len
  const g = new THREE.BufferGeometry();
  const hw = w / 2, hh = h / 2;
  const v = [
    // back face corners
    [-hw, -hh, 0], [hw, -hh, 0], [hw, hh, 0], [-hw, hh, 0],
    // front edge (top+bottom point)
    [0, hh, -len], [0, -hh, -len],
  ];
  const idx = [
    0, 2, 1, 0, 3, 2,        // back
    3, 4, 2,                 // top
    0, 1, 5,                 // bottom
    0, 5, 4, 0, 4, 3,        // left
    1, 2, 4, 1, 4, 5,        // right
  ];
  const posArr = [];
  for (const i of idx) posArr.push(...v[i]);
  g.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
  g.computeVertexNormals();
  return g;
}

export class Ship {
  constructor(scene) {
    this.group = new THREE.Group();          // position + heading + rocking
    this.heading = 0;
    this.speed = 0;
    this.maxSpeed = 16;
    this.pos = new THREE.Vector3(0, 0, 0);
    this._pitch = 0; this._roll = 0;
    this.wheel = null;
    scene.add(this.group);
    this.build();
  }

  build() {
    const g = this.group;
    // hull main box: deck top at y=1.15
    const hull = new THREE.Mesh(new THREE.BoxGeometry(7, 2.3, 15), mat(WOOD_DK));
    hull.position.set(0, 0, -2.5);
    g.add(hull);
    // deck planks (lighter top)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 14.6), mat(WOOD_LT));
    deck.position.set(0, 1.18, -2.5);
    g.add(deck);
    // plank grooves
    for (let i = -2; i <= 2; i++) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 14.4), mat(WOOD_DK));
      groove.position.set(i * 1.25, 1.19, -2.5);
      g.add(groove);
    }
    // bow wedge
    const bow = new THREE.Mesh(wedge(7, 2.3, 7), mat(WOOD_DK));
    bow.position.set(0, 0, -10);
    g.add(bow);
    const bowDeck = new THREE.Mesh(wedge(6.6, 0.14, 6.6), mat(WOOD_LT));
    bowDeck.position.set(0, 1.18, -10);
    g.add(bowDeck);
    // bowsprit
    const sprit = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 7, 6), mat(WOOD));
    sprit.rotation.x = -Math.PI / 2 - 0.28;
    sprit.position.set(0, 2.1, -18.5);
    g.add(sprit);
    // bulwarks (side walls) + rails
    const mkSide = (x) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.15, 15), mat(WOOD));
      wall.position.set(x, 1.75, -2.5);
      g.add(wall);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 15), mat(WOOD_LT));
      rail.position.set(x, 2.38, -2.5);
      g.add(rail);
      // angled bow rails
      const brail = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 7.6), mat(WOOD_LT));
      const bwall = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.05, 7.6), mat(WOOD));
      const ang = Math.atan2(3.35, 7) * Math.sign(x);
      brail.rotation.y = ang; bwall.rotation.y = ang;
      brail.position.set(x * 0.52, 2.32, -13.4);
      bwall.position.set(x * 0.52, 1.72, -13.4);
      g.add(brail, bwall);
    };
    mkSide(3.36); mkSide(-3.36);
    // stern rail (behind player)
    const sternWall = new THREE.Mesh(new THREE.BoxGeometry(7, 1.15, 0.28), mat(WOOD));
    sternWall.position.set(0, 1.75, 4.9);
    const sternRail = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.16, 0.46), mat(WOOD_LT));
    sternRail.position.set(0, 2.38, 4.9);
    g.add(sternWall, sternRail);
    // rail posts
    for (let z = -9; z <= 4; z += 2.2) {
      for (const x of [3.36, -3.36]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.1, 0.18), mat(WOOD_DK));
        p.position.set(x, 1.8, z);
        g.add(p);
      }
    }
    // mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 16, 8), mat(WOOD));
    mast.position.set(0, 9, -6);
    g.add(mast);
    const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 9.6, 6), mat(WOOD));
    yard.rotation.z = Math.PI / 2;
    yard.position.set(0, 13.6, -6);
    g.add(yard);
    // sail: curved plane billowing forward
    const sailGeo = new THREE.PlaneGeometry(9, 7.4, 10, 8);
    const sp = sailGeo.attributes.position;
    for (let i = 0; i < sp.count; i++) {
      const x = sp.getX(i), y = sp.getY(i);
      sp.setZ(i, -Math.cos(x / 4.8 * Math.PI / 2) * 1.5 * (0.55 + 0.45 * (1 - Math.abs(y) / 3.7)));
    }
    sailGeo.computeVertexNormals();
    const sail = new THREE.Mesh(sailGeo, new THREE.MeshPhongMaterial({
      color: 0xf3ead6, flatShading: true, side: THREE.DoubleSide,
    }));
    sail.position.set(0, 9.7, -5.6);
    g.add(sail);
    // flag
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.9), new THREE.MeshPhongMaterial({ color: 0xc8402f, side: THREE.DoubleSide, flatShading: true }));
    flag.position.set(1.1, 17.3, -6);
    this.flag = flag;
    g.add(flag);
    // ship's wheel — in front of camera
    const wheel = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.11, 8, 18), mat(WOOD_DK));
    wheel.add(rim);
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.7, 6), mat(WOOD));
      spoke.rotation.z = (i * Math.PI) / 4;
      wheel.add(spoke);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 8), mat(0xc9a227, { emissive: 0x3d2f00 }));
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);
    wheel.position.set(0, 2.75, 1.4);
    this.wheel = wheel;
    g.add(wheel);
    // wheel pedestal
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), mat(WOOD));
    ped.position.set(0, 1.85, 1.4);
    g.add(ped);
    // lantern — post beside the wheel, glass housing, point light for night
    const lanternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 6), mat(0x3a2a1a));
    lanternPost.position.set(-1.6, 2.4, 1.5);
    g.add(lanternPost);
    const lanternGlass = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshPhongMaterial({
      color: 0x3a2a10, emissive: 0xffbb55, emissiveIntensity: 0, transparent: true, opacity: 0.9,
    }));
    lanternGlass.position.set(-1.6, 3.2, 1.5);
    g.add(lanternGlass);
    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.2, 6), mat(0x2a1d10));
    lanternCap.position.set(-1.6, 3.42, 1.5);
    g.add(lanternCap);
    const lanternLight = new THREE.PointLight(0xffb060, 0, 14, 2);
    lanternLight.position.set(-1.6, 3.2, 1.5);
    g.add(lanternLight);
    this.lanternGlass = lanternGlass;
    this.lanternLight = lanternLight;
    // a couple of deck barrels
    for (const [x, z] of [[-2.4, -8.2], [2.5, 2.8], [2.0, -8.6]]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.15, 9), mat(0x9c6b3c));
      b.position.set(x, 1.8, z);
      g.add(b);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.12, 9), mat(0x4a4a4a));
      band.position.set(x, 1.8, z);
      g.add(band);
    }
  }

  update(dt, t, input) {
    // throttle
    const accel = 6;
    if (input.forward) this.speed += accel * dt;
    if (input.back) this.speed -= accel * 1.4 * dt;
    this.speed = Math.max(0, Math.min(this.maxSpeed, this.speed - 0.35 * dt));
    // steering — more effective with speed, but always some
    const turnRate = 0.55 * (0.35 + 0.65 * this.speed / this.maxSpeed);
    let turning = 0;
    if (input.left) turning += 1;
    if (input.right) turning -= 1;
    this.heading += turning * turnRate * dt;
    // move
    const fx = -Math.sin(this.heading), fz = -Math.cos(this.heading);
    this.pos.x += fx * this.speed * dt;
    this.pos.z += fz * this.speed * dt;
    // buoyancy: sample wave field around hull
    const h = waveHeight(this.pos.x, this.pos.z, t);
    const hF = waveHeight(this.pos.x + fx * 8, this.pos.z + fz * 8, t);
    const hB = waveHeight(this.pos.x - fx * 8, this.pos.z - fz * 8, t);
    const rx = -fz, rz = fx;
    const hR = waveHeight(this.pos.x + rx * 4, this.pos.z + rz * 4, t);
    const hL = waveHeight(this.pos.x - rx * 4, this.pos.z - rz * 4, t);
    const targetPitch = Math.atan2(hB - hF, 16) * 0.85;
    const targetRoll = Math.atan2(hL - hR, 8) * 0.7 + turning * -0.05 * (this.speed / this.maxSpeed);
    this._pitch += (targetPitch - this._pitch) * Math.min(1, dt * 2.2);
    this._roll += (targetRoll - this._roll) * Math.min(1, dt * 2.2);
    this.group.position.set(this.pos.x, h * 0.75 + 0.15, this.pos.z);
    this.group.rotation.set(0, this.heading, 0);
    this.group.rotateX(this._pitch);
    this.group.rotateZ(this._roll);
    // wheel spins with steering, drifts back
    this.wheel.rotation.z += turning * 2.4 * dt;
    this.wheel.rotation.z *= 1 - Math.min(1, dt * 0.6);
    // flag flutter
    this.flag.rotation.y = Math.sin(t * 6) * 0.18;
    this.flag.scale.y = 1 + Math.sin(t * 9) * 0.05;
  }

  setNight(nightFactor) {
    const on = THREE.MathUtils.clamp(nightFactor * 1.6, 0, 1);
    this.lanternLight.intensity = on * 2.2;
    this.lanternGlass.material.emissiveIntensity = on * 1.4;
  }
}
