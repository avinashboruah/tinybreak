import * as THREE from 'three';
import { waveHeight } from './waves.js';

const mat = (c, extra = {}) => new THREE.MeshPhongMaterial({ color: c, flatShading: true, ...extra });
const wrap = (obj, ship, R) => {
  // keep decor within a square of half-size R around the ship
  let dx = obj.position.x - ship.x, dz = obj.position.z - ship.z;
  if (dx > R) obj.position.x -= 2 * R; else if (dx < -R) obj.position.x += 2 * R;
  if (dz > R) obj.position.z -= 2 * R; else if (dz < -R) obj.position.z += 2 * R;
};
const DAY_TOP = new THREE.Color(0x3f9fe0), DAY_BOT = new THREE.Color(0xd4eef8);
const NIGHT_TOP = new THREE.Color(0x030512), NIGHT_BOT = new THREE.Color(0x0e1730);
const DAY_FOG = new THREE.Color(0xd4eef8), NIGHT_FOG = new THREE.Color(0x0a0f22);
const CYCLE = 100; // seconds for a full day+night loop

export class World {
  constructor(scene) {
    this.scene = scene;
    scene.fog = new THREE.FogExp2(0xd4eef8, 0.00115);

    // sky dome gradient
    const skyGeo = new THREE.SphereGeometry(1500, 20, 12);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(0x3f9fe0) }, bottom: { value: new THREE.Color(0xd4eef8) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(vP.y/700.0, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.75)), 1.0); }',
    });
    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.sky.frustumCulled = false;
    scene.add(this.sky);

    // lights
    this.hemi = new THREE.HemisphereLight(0xcfe8ff, 0x3a7ca8, 0.85);
    scene.add(this.hemi);
    const sunLight = new THREE.DirectionalLight(0xfff2d8, 1.35);
    scene.add(sunLight);
    this.sunLight = sunLight;
    this.moonLight = new THREE.DirectionalLight(0x9fb6ff, 0);
    scene.add(this.moonLight);

    // visible sun & moon
    this.sun = new THREE.Mesh(new THREE.SphereGeometry(55, 14, 10), new THREE.MeshBasicMaterial({ color: 0xfff4c8, fog: false }));
    scene.add(this.sun);
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(38, 14, 10), new THREE.MeshBasicMaterial({ color: 0xd8e0ff, fog: false, transparent: true }));
    scene.add(this.moon);

    // stars
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 1400, th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.85);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.9 + 60;
      starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 3, transparent: true, opacity: 0, fog: false, depthWrite: false });
    this.stars = new THREE.Points(starGeo, this.starMat);
    this.stars.frustumCulled = false;
    scene.add(this.stars);

    this.cycleT = 18; // start mid-morning
    this.nightFactor = 0;

    this.clouds = [];
    this.islands = [];
    this.rocks = [];
    this.flocks = [];
    this.buildClouds();
    this.buildIslands();
    this.buildRocks();
    this.buildBirds();
  }

  cloudTexture() {
    if (this._cloudTex) return this._cloudTex;
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const blobs = [
      [128, 150, 90], [80, 140, 62], [176, 140, 62], [50, 160, 46], [206, 160, 46],
      [100, 110, 55], [156, 110, 55], [128, 105, 60],
    ];
    for (const [x, y, r] of blobs) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.6, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    this._cloudTex = tex;
    return tex;
  }

  buildClouds() {
    const tex = this.cloudTexture();
    for (let i = 0; i < 18; i++) {
      const c = new THREE.Group();
      const n = 4 + Math.floor(Math.random() * 4);
      const shade = 0.86 + Math.random() * 0.14;
      const col = new THREE.Color(shade, shade, shade * 1.02);
      const baseMat = new THREE.SpriteMaterial({
        map: tex, color: col, transparent: true, depthWrite: false, opacity: 0.95, fog: true,
      });
      for (let j = 0; j < n; j++) {
        const s = 22 + Math.random() * 30;
        const sp = new THREE.Sprite(baseMat.clone());
        sp.scale.set(s * 1.7, s, 1);
        sp.position.set(
          (j - n / 2) * s * 0.85 + (Math.random() - 0.5) * s * 0.4,
          (Math.random() - 0.5) * s * 0.35,
          (Math.random() - 0.5) * s * 0.5,
        );
        // slightly dim underside puffs for volume
        if (Math.random() > 0.6) sp.material.color.multiplyScalar(0.9);
        c.add(sp);
      }
      c.position.set((Math.random() - 0.5) * 1600, 80 + Math.random() * 90, (Math.random() - 0.5) * 1600);
      const sc = 0.8 + Math.random() * 1.1;
      c.scale.setScalar(sc);
      c.userData.drift = 1.0 + Math.random() * 1.4;
      this.clouds.push(c);
      this.scene.add(c);
    }
  }

  buildIslands() {
    for (let i = 0; i < 9; i++) {
      const g = new THREE.Group();
      const r = 35 + Math.random() * 55;
      const sand = new THREE.Mesh(new THREE.ConeGeometry(r, r * 0.42, 7), mat(0xd9c07f));
      sand.position.y = r * 0.1;
      g.add(sand);
      const hill = new THREE.Mesh(new THREE.ConeGeometry(r * 0.62, r * 0.55, 6), mat(0x5da55a));
      hill.position.set(r * 0.12, r * 0.35, -r * 0.08);
      g.add(hill);
      if (Math.random() > 0.5) {
        const hill2 = new THREE.Mesh(new THREE.ConeGeometry(r * 0.4, r * 0.42, 6), mat(0x6fb765));
        hill2.position.set(-r * 0.35, r * 0.28, r * 0.2);
        g.add(hill2);
      }
      const a = Math.random() * Math.PI * 2, d = 550 + Math.random() * 380;
      g.position.set(Math.cos(a) * d, -2, Math.sin(a) * d);
      g.userData.collideRadius = r * 0.62;
      this.islands.push(g);
      this.scene.add(g);
    }
  }

  buildRocks() {
    for (let i = 0; i < 12; i++) {
      const s = 2.5 + Math.random() * 5;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(0x7d8a91));
      const a = Math.random() * Math.PI * 2, d = 130 + Math.random() * 380;
      rock.position.set(Math.cos(a) * d, -s * 0.3, Math.sin(a) * d);
      rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      rock.userData.collideRadius = s * 0.85;
      this.rocks.push(rock);
      this.scene.add(rock);
    }
  }

  buildBirds() {
    const bodyMat = mat(0xf5f5f2);
    const wingMat = mat(0xd8d8d4, { side: THREE.DoubleSide });
    const tipMat = mat(0x2e2e2e, { side: THREE.DoubleSide });
    const beakMat = mat(0xe8a63c);

    const wingShape = () => {
      // tapered kite: wide at shoulder, pointed tip, slight back sweep
      const g = new THREE.BufferGeometry();
      const v = [
        0, 0, 0,      // shoulder
        3.0, 0, -0.5, // tip (swept back)
        1.3, 0, 0.55, // trailing inner
      ];
      g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      g.setIndex([0, 1, 2]);
      g.computeVertexNormals();
      return g;
    };
    const tipShape = () => {
      const g = new THREE.BufferGeometry();
      const v = [1.3, 0, -0.35, 3.0, 0, -0.5, 1.3, 0, 0.05];
      g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      g.setIndex([0, 1, 2]);
      g.computeVertexNormals();
      return g;
    };

    const buildBird = () => {
      const bird = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 6, 5), bodyMat);
      body.scale.set(1.9, 0.85, 1);
      bird.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 5), bodyMat);
      head.position.set(0.62, 0.08, 0);
      bird.add(head);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 4), beakMat);
      beak.rotation.z = -Math.PI / 2;
      beak.position.set(0.82, 0.06, 0);
      bird.add(beak);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 4), bodyMat);
      tail.rotation.z = Math.PI / 2;
      tail.position.set(-0.62, 0, 0);
      tail.scale.set(1, 0.4, 1.6);
      bird.add(tail);

      const shoulderL = new THREE.Group(); shoulderL.position.set(0.05, 0.06, 0.12);
      const shoulderR = new THREE.Group(); shoulderR.position.set(0.05, 0.06, -0.12);
      const wL = new THREE.Mesh(wingShape(), wingMat); wL.rotation.y = 0;
      const wLtip = new THREE.Mesh(tipShape(), tipMat);
      const wR = new THREE.Mesh(wingShape(), wingMat); wR.scale.z = -1;
      const wRtip = new THREE.Mesh(tipShape(), tipMat); wRtip.scale.z = -1;
      shoulderL.add(wL, wLtip);
      shoulderR.add(wR, wRtip);
      bird.add(shoulderL, shoulderR);
      bird.userData = { wL: shoulderL, wR: shoulderR, phase: Math.random() * 6 };
      return bird;
    };

    for (let f = 0; f < 3; f++) {
      const flock = new THREE.Group();
      const birds = [];
      const n = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const bird = buildBird();
        bird.scale.setScalar(2.2 + Math.random() * 0.6);
        bird.position.set((i % 3) * 4 - 4, (Math.random() - 0.5) * 3, Math.floor(i / 3) * 4 + (i % 3) * 2);
        flock.add(bird);
        birds.push(bird);
      }
      flock.userData = {
        birds, angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * 90, height: 22 + Math.random() * 20,
        speed: 0.12 + Math.random() * 0.08,
        center: new THREE.Vector3((Math.random() - 0.5) * 300, 0, (Math.random() - 0.5) * 300),
      };
      this.flocks.push(flock);
      this.scene.add(flock);
    }
  }

  update(dt, t, shipPos) {
    this.sky.position.copy(shipPos).setY(0);
    this.stars.position.copy(shipPos).setY(0);

    this.cycleT += dt;
    const phase = (this.cycleT % CYCLE) / CYCLE;              // 0..1
    const angle = phase * Math.PI * 2;
    const sunDir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), -0.35).normalize();
    const elevation = sunDir.y;                                 // -1..1
    this.nightFactor = THREE.MathUtils.clamp(-elevation / 0.35 + 0.5, 0, 1);
    const dayK = 1 - this.nightFactor;

    this.sun.position.copy(shipPos).add(sunDir.clone().multiplyScalar(1350));
    this.sun.material.opacity = THREE.MathUtils.clamp((elevation + 0.05) * 4, 0, 1);
    this.sun.visible = elevation > -0.12;
    const moonDir = sunDir.clone().multiplyScalar(-1);
    this.moon.position.copy(shipPos).add(moonDir.clone().multiplyScalar(1350));
    this.moon.material.opacity = THREE.MathUtils.clamp(this.nightFactor * 1.4, 0, 1);
    this.moon.visible = moonDir.y > -0.12;

    this.sunLight.position.copy(shipPos).add(sunDir.clone().multiplyScalar(120));
    this.sunLight.target.position.copy(shipPos);
    this.sunLight.target.updateMatrixWorld();
    this.sunLight.intensity = 1.35 * THREE.MathUtils.clamp((elevation + 0.15) * 2.2, 0, 1);
    this.moonLight.position.copy(shipPos).add(moonDir.clone().multiplyScalar(120));
    this.moonLight.target.position.copy(shipPos);
    this.moonLight.target.updateMatrixWorld();
    this.moonLight.intensity = 0.35 * this.nightFactor;
    this.hemi.intensity = 0.3 + dayK * 0.55;

    this.starMat.opacity = this.nightFactor * 0.9;

    const top = DAY_TOP.clone().lerp(NIGHT_TOP, this.nightFactor);
    const bot = DAY_BOT.clone().lerp(NIGHT_BOT, this.nightFactor);
    this.sky.material.uniforms.top.value.copy(top);
    this.sky.material.uniforms.bottom.value.copy(bot);
    this.scene.fog.color.copy(DAY_FOG.clone().lerp(NIGHT_FOG, this.nightFactor));

    for (const c of this.clouds) {
      c.position.x += c.userData.drift * dt;
      wrap(c, shipPos, 850);
    }
    for (const isl of this.islands) wrap(isl, shipPos, 950);
    for (const r of this.rocks) {
      wrap(r, shipPos, 480);
      r.position.y = -r.geometry.parameters.radius * 0.3 + waveHeight(r.position.x, r.position.z, t) * 0.15;
    }
    for (const flock of this.flocks) {
      const u = flock.userData;
      u.angle += u.speed * dt;
      u.center.lerp(shipPos, dt * 0.02);
      flock.position.set(
        u.center.x + Math.cos(u.angle) * u.radius,
        u.height + Math.sin(t * 0.4 + u.radius) * 3,
        u.center.z + Math.sin(u.angle) * u.radius,
      );
      flock.rotation.y = -u.angle - Math.PI / 2;
      for (const b of u.birds) {
        const flap = Math.sin(t * 7 + b.userData.phase) * 0.7;
        b.userData.wL.rotation.z = flap;
        b.userData.wR.rotation.z = -flap;
      }
      wrap(flock, shipPos, 600);
    }
  }

  // returns the first obstacle whose radius overlaps the ship's collider, or null
  checkCollision(shipPos, shipRadius) {
    for (const obj of this.islands) {
      const dx = obj.position.x - shipPos.x, dz = obj.position.z - shipPos.z;
      const minDist = obj.userData.collideRadius + shipRadius;
      if (dx * dx + dz * dz < minDist * minDist) return obj;
    }
    for (const obj of this.rocks) {
      const dx = obj.position.x - shipPos.x, dz = obj.position.z - shipPos.z;
      const minDist = obj.userData.collideRadius + shipRadius;
      if (dx * dx + dz * dz < minDist * minDist) return obj;
    }
    return null;
  }
}
