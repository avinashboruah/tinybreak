import * as THREE from 'three';
import { waveHeight } from './waves.js';

const mat = (c, extra = {}) => new THREE.MeshPhongMaterial({ color: c, flatShading: true, ...extra });

function glowTexture(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, `rgba(${hex},0.9)`);
  g.addColorStop(0.4, `rgba(${hex},0.35)`);
  g.addColorStop(1, `rgba(${hex},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function buildChest() {
  const g = new THREE.Group();
  const wood = mat(0x8a5a33);
  const gold = mat(0xf0b32c, { emissive: 0x8a5c00, shininess: 120 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(3, 1.7, 2.1), wood);
  base.position.y = 0.85;
  g.add(base);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 3, 7, 1, false, 0, Math.PI), wood);
  lid.rotation.z = Math.PI / 2;
  lid.position.y = 1.7;
  g.add(lid);
  for (const x of [-0.95, 0.95]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.78, 2.2), gold);
    band.position.set(x, 0.85, 0);
    g.add(band);
    const bandTop = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.34, 7, 1, false, 0, Math.PI), gold);
    bandTop.rotation.z = Math.PI / 2;
    bandTop.position.set(x, 1.7, 0);
    g.add(bandTop);
  }
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.25), gold);
  lock.position.set(0, 1.55, 1.1);
  g.add(lock);
  return g;
}

function buildPouch() {
  // small coin pile — common, low value
  const g = new THREE.Group();
  const gold = mat(0xf0b32c, { emissive: 0x6a4600 });
  const goldDk = mat(0xc98f1e, { emissive: 0x4a3200 });
  for (let i = 0; i < 6; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.18, 8), i % 2 ? gold : goldDk);
    const a = (i / 6) * Math.PI * 2;
    coin.position.set(Math.cos(a) * 0.5, 0.25 + i * 0.12, Math.sin(a) * 0.5);
    coin.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    g.add(coin);
  }
  const mound = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.7, 8), gold);
  mound.position.y = 0.2;
  g.add(mound);
  return g;
}

function buildJeweledChest() {
  // bigger, gem-studded chest — rare, mid-high value
  const g = buildChest();
  g.scale.setScalar(1.15);
  const gems = [0x36c7d6, 0xc23bd6, 0x3ad67a];
  for (let i = 0; i < 5; i++) {
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), mat(gems[i % gems.length], { emissive: gems[i % gems.length], emissiveIntensity: 0.4, shininess: 150 }));
    gem.position.set(-1.1 + i * 0.55, 1.85, 1.06);
    g.add(gem);
  }
  return g;
}

function buildCrown() {
  // crown on a cushion — rarest, highest value
  const g = new THREE.Group();
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 2.2), mat(0xb02b3c));
  cushion.position.y = 0.5;
  g.add(cushion);
  const gold = mat(0xf5c94a, { emissive: 0x8a5c00, shininess: 160 });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.5, 8), gold);
  band.position.y = 1.15;
  g.add(band);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 4), gold);
    spike.position.set(Math.cos(a) * 0.85, 1.6, Math.sin(a) * 0.85);
    g.add(spike);
  }
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), mat(0xc23bd6, { emissive: 0xc23bd6, emissiveIntensity: 0.5 }));
  gem.position.y = 1.75;
  g.add(gem);
  return g;
}

const TYPES = [
  { name: 'pouch', label: 'Coin Pouch', build: buildPouch, value: 1, glow: '255,215,90', glowScale: 9, weight: 5, swatch: '#f0d060' },
  { name: 'chest', label: 'Chest', build: buildChest, value: 2, glow: '255,200,80', glowScale: 13, weight: 4, swatch: '#c98f1e' },
  { name: 'jeweled', label: 'Jeweled Chest', build: buildJeweledChest, value: 5, glow: '150,90,230', glowScale: 16, weight: 2, swatch: '#9a5ae6' },
  { name: 'crown', label: 'Crown', build: buildCrown, value: 10, glow: '255,120,190', glowScale: 18, weight: 1, swatch: '#f078be' },
];
const TOTAL_WEIGHT = TYPES.reduce((s, t) => s + t.weight, 0);
function pickType() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const t of TYPES) { if ((r -= t.weight) <= 0) return t; }
  return TYPES[0];
}

export { TYPES };
export class Treasure {
  constructor(scene, count = 7) {
    this.scene = scene;
    this.chests = [];
    this.onCollect = null;
    for (let i = 0; i < count; i++) {
      const holder = new THREE.Group();
      holder.userData = { phase: Math.random() * 6, collecting: 0, model: null, glow: null, type: null };
      this.scene.add(holder);
      this.chests.push(holder);
    }
  }

  assignType(chest, type) {
    const u = chest.userData;
    if (u.model) chest.remove(u.model);
    if (u.glow) chest.remove(u.glow);
    const model = type.build();
    chest.add(model);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(type.glow), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    glow.scale.set(type.glowScale, type.glowScale, 1);
    glow.position.y = 1.4;
    chest.add(glow);
    u.model = model; u.glow = glow; u.type = type;
  }

  spawnAhead(chest, ship, first = false) {
    const spread = first ? Math.PI * 2 : 1.4;
    const d = first ? 60 + Math.random() * 260 : 160 + Math.random() * 260;
    const baseA = Math.atan2(-Math.sin(ship.heading), -Math.cos(ship.heading));
    const ang = baseA + (Math.random() - 0.5) * spread;
    chest.position.set(
      ship.pos.x + Math.sin(ang) * d,
      0,
      ship.pos.z + Math.cos(ang) * d,
    );
    chest.rotation.y = Math.random() * Math.PI * 2;
    chest.scale.setScalar(1);
    chest.visible = true;
    chest.userData.collecting = 0;
    this.assignType(chest, pickType());
    chest.userData.glow.material.opacity = 1;
  }

  init(ship) {
    for (const c of this.chests) this.spawnAhead(c, ship, true);
  }

  update(dt, t, ship) {
    for (const chest of this.chests) {
      const u = chest.userData;
      if (u.collecting > 0) {
        u.collecting += dt;
        const k = u.collecting / 0.7;
        chest.position.y += dt * 7;
        chest.rotation.y += dt * 9;
        chest.scale.setScalar(Math.max(0.001, k < 0.4 ? 1 + k : 1.4 - (k - 0.4) * 2.3));
        u.glow.material.opacity = Math.max(0, 1 - k);
        if (k >= 1) this.spawnAhead(chest, ship);
        continue;
      }
      chest.position.y = waveHeight(chest.position.x, chest.position.z, t) * 0.8 + Math.sin(t * 1.3 + u.phase) * 0.25 - 0.3;
      chest.rotation.y += dt * 0.3;
      chest.rotation.z = Math.sin(t * 0.9 + u.phase) * 0.08;
      u.glow.scale.setScalar(u.type.glowScale * (0.92 + Math.sin(t * 2 + u.phase) * 0.12));
      const dx = chest.position.x - ship.pos.x, dz = chest.position.z - ship.pos.z;
      if (dx * dx + dz * dz < 8.5 * 8.5) {
        u.collecting = 0.0001;
        if (this.onCollect) this.onCollect(u.type.value, u.type.name);
      }
    }
  }
}
