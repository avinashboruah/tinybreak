import * as THREE from 'three';
import { waveHeight } from './waves.js';

const SIZE = 1300, SEGS = 110;
const CELL = SIZE / SEGS;
const DEEP = new THREE.Color(0x0c4f7a);
const MID = new THREE.Color(0x1d9ed8);
const CREST = new THREE.Color(0x6fd8ec);
const FOAM = new THREE.Color(0xf2fbff);

export class Ocean {
  constructor(scene) {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2);
    this.base = geo.attributes.position.array.slice();
    const n = geo.attributes.position.count;
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    this.mat = new THREE.MeshPhongMaterial({
      vertexColors: true, shininess: 130, specular: 0xdff6ff,
      transparent: true, opacity: 0.96,
    });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }
  update(t, shipPos) {
    // snap to grid so vertices don't swim as the plane follows the ship
    const ox = Math.round(shipPos.x / CELL) * CELL;
    const oz = Math.round(shipPos.z / CELL) * CELL;
    this.mesh.position.set(ox, 0, oz);
    const pos = this.mesh.geometry.attributes.position;
    const col = this.mesh.geometry.attributes.color;
    const arr = pos.array, base = this.base, carr = col.array;
    const c = new THREE.Color();
    for (let i = 0; i < arr.length; i += 3) {
      const h = waveHeight(base[i] + ox, base[i + 2] + oz, t);
      arr[i + 1] = h;
      const k = THREE.MathUtils.clamp((h + 1.6) / 3.4, 0, 1);
      if (k < 0.55) c.copy(DEEP).lerp(MID, k / 0.55);
      else if (k < 0.85) c.copy(MID).lerp(CREST, (k - 0.55) / 0.3);
      else c.copy(CREST).lerp(FOAM, (k - 0.85) / 0.15);
      const ci = i;
      carr[ci] = c.r; carr[ci + 1] = c.g; carr[ci + 2] = c.b;
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }
}
