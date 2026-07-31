import * as THREE from 'three';
import { Ocean } from './ocean.js';
import { Ship } from './ship.js';
import { World } from './world.js';
import { Treasure } from './treasure.js';
import { Controls } from './controls.js';
import { GameAudio } from './audio.js';
import { HUD } from './hud.js';
import { Crash } from './crash.js';
import { Shark } from './shark.js';
import { Kraken } from './kraken.js';
import { AchievementTracker, ACHIEVEMENTS } from './achievements.js';
import { PowerUp } from './powerup.js';
import { sdk } from './sdk.js';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 3200);

const ocean = new Ocean(scene);
const world = new World(scene);
const ship = new Ship(scene);
const treasure = new Treasure(scene, 7);
const shark = new Shark(scene);
const kraken = new Kraken(scene);
const powerup = new PowerUp(scene);
const controls = new Controls(canvas);
const audio = new GameAudio();
const hud = new HUD();
sdk.init(audio);

// first-person rig mounted on the ship
const rig = new THREE.Group();      // mouse yaw
rig.position.set(0, 4.15, 3.1);
rig.add(camera);
ship.group.add(rig);

let score = 0;
let totalCollected = 0;
let comboCount = 0;
let comboTimer = 0;
const COMBO_WINDOW = 4;
let bestCombo = 0;
let livesLostTotal = 0;
let sawNight = false;
const achievements = new AchievementTracker(a => hud.showAchievement(a));

const seenTutorials = new Set(JSON.parse(sdk.getItem('pirate-tutorials') || '[]'));
function tutorial(id, title, desc) {
  if (seenTutorials.has(id)) return;
  seenTutorials.add(id);
  sdk.setItem('pirate-tutorials', JSON.stringify([...seenTutorials]));
  hud.showTutorial(title, desc);
}

treasure.onCollect = (value, type) => {
  totalCollected++;
  comboCount = comboTimer > 0 ? comboCount + 1 : 1;
  comboTimer = COMBO_WINDOW;
  bestCombo = Math.max(bestCombo, comboCount);
  const bonus = comboCount > 1 ? Math.round(value * (comboCount - 1) * 0.4) : 0;
  score += value + bonus;
  hud.setScore(score);
  hud.addCount(type);
  hud.showCombo(comboCount, bonus, 1);
  audio.pickup();
  achievements.check({ totalCollected, counts: hud.counts, bestCombo, score, surviveTime: t, livesLost: livesLostTotal, sawNight });
};
treasure.init(ship);
shark.mesh.visible = false;
let sharkTimer = 0;
let sharkActive = false;
const SHARK_HIDDEN_DURATION = 30;
const SHARK_HIDDEN_FLOOR = 12;      // fastest the shark can return to, once fully ramped
const SHARK_RAMP_TIME = 300;        // seconds of play to reach full difficulty
function sharkHiddenDuration(surviveTime) {
  const k = Math.min(1, surviveTime / SHARK_RAMP_TIME);
  return SHARK_HIDDEN_DURATION - k * (SHARK_HIDDEN_DURATION - SHARK_HIDDEN_FLOOR);
}
const SHARK_CHASE_DURATION = 20;
const SHARK_CATCH_RADIUS = 9;

let krakenTimer = 0;
let krakenPhase = 'hidden';   // hidden | warning | active
let krakenZoneT = 0;   // time continuously spent inside the danger zone (only counts once surfaced)
const KRAKEN_HIDDEN_DURATION = 40;
const KRAKEN_WARNING_DURATION = 5;
const KRAKEN_ACTIVE_DURATION = 15;
const KRAKEN_ZONE_LIMIT = 5;

let powerupPhase = 'hidden';  // hidden | visible
let powerupTimer = 0;
const POWERUP_HIDDEN_DURATION = 30;
const POWERUP_VISIBLE_DURATION = 12;
const POWERUP_PICKUP_RADIUS = 8;
let armed = false;
let armedT = 0;
const ARMED_DURATION = 40;
const SHARK_KILL_RADIUS = 16;

const MAX_LIVES = 3;
let lives = MAX_LIVES;
let invulnT = 0;
hud.setLives(lives, MAX_LIVES);

let state = 'start';                 // start | playing | crashing | paused | gameover
let started = false;
const GAMEOVER_SPEED = 6;             // strike faster than this and the hull cracks
const SHIP_COLLIDE_RADIUS = 8.5;
let crash = null;
let shakeT = 0;
let gameOverReason = 'wreck';
const flashEl = document.getElementById('flash');

function resetGame() {
  score = 0; totalCollected = 0; comboCount = 0; comboTimer = 0; bestCombo = 0; livesLostTotal = 0; sawNight = false;
  hud.setScore(0);
  hud.counts = { pouch: 0, chest: 0, jeweled: 0, crown: 0 };
  for (const k of Object.keys(hud.counts)) {
    const item = document.querySelector(`.count-item[data-type="${k}"] .count-num`);
    if (item) item.textContent = '0';
  }
  hud.hideCombo();
  lives = MAX_LIVES;
  invulnT = 3;
  hud.setLives(lives, MAX_LIVES);
  ship.pos.set(0, 0, 0);
  ship.heading = 0;
  ship.speed = 0;
  treasure.init(ship);
  sharkActive = false; sharkTimer = 0; shark.mesh.visible = false;
  krakenPhase = 'hidden'; krakenTimer = 0; krakenZoneT = 0; kraken.mesh.visible = false;
  powerupPhase = 'hidden'; powerupTimer = 0; powerup.mesh.visible = false;
  armed = false; armedT = 0; hud.setArmed(false, 0);
  gameOverReason = 'wreck';
}

function play() {
  if (state === 'gameover') {
    sdk.requestAd("midgame", {
      adStarted: () => {
        state = 'paused';
        audio.suspend();
      },
      adFinished: () => {
        audio.resume();
        resetGame();
        controls.lock();
        sdk.gameplayStart();
      },
      adError: (err) => {
        console.warn("CrazyGames SDK Ad Error", err);
        audio.resume();
        resetGame();
        controls.lock();
        sdk.gameplayStart();
      }
    });
    return;
  }
  controls.lock();
}
controls.onLockChange = (locked) => {
  if (locked) {
    state = 'playing';
    if (!started) { audio.start(); started = true; } else audio.resume();
    hud.showStart(false); hud.showPause(false); hud.showHud(true);
    sdk.gameplayStart();
  } else if (state === 'playing') {
    state = 'paused';
    audio.suspend();
    hud.showPause(true);
    sdk.gameplayStop();
  }
};
document.getElementById('start').addEventListener('click', play);
document.getElementById('pause').addEventListener('click', play);
document.getElementById('gameover').addEventListener('click', play);

const achvBtn = document.getElementById('achv-btn');
const achvPanel = document.getElementById('achv-panel');
achvBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const wasLocked = document.pointerLockElement === canvas;
  if (wasLocked) controls.unlock();
  const list = document.getElementById('achv-list');
  list.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = achievements.unlocked.has(a.id);
    return `<div class="achv-row ${unlocked ? '' : 'locked'}">
      <svg class="achv-icon" viewBox="0 0 24 24"><path fill="${unlocked ? '#f0b32c' : '#5a6570'}" d="M17 4h3a1 1 0 0 1 1 1v1c0 2.2-1.6 4-3.7 4.4A5 5 0 0 1 13 14.9V17h2a1 1 0 0 1 1 1v1H8v-1a1 1 0 0 1 1-1h2v-2.1A5 5 0 0 1 6.7 10.4C4.6 10 3 8.2 3 6V5a1 1 0 0 1 1-1h3V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1zM7 6H5c0 1.3 1 2.3 2.2 2.4A6 6 0 0 1 7 7V6zm10 0v1a6 6 0 0 1-.2 1.4C18 8.3 19 7.3 19 6h-2z"/></svg>
      <div class="achv-body"><div class="achv-name">${unlocked ? a.name : '???'}</div><div class="achv-desc">${unlocked ? a.desc : 'Locked'}</div></div>
    </div>`;
  }).join('');
  achvPanel.classList.remove('hidden');
});
document.getElementById('achv-close').addEventListener('click', (e) => {
  e.stopPropagation();
  achvPanel.classList.add('hidden');
});

// settings: sensitivity + volume
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const sensSlider = document.getElementById('sens-slider');
const volSlider = document.getElementById('vol-slider');
sensSlider.value = controls.sensitivity;
document.getElementById('sens-val').textContent = controls.sensitivity.toFixed(1) + 'x';
volSlider.value = audio.volume;
document.getElementById('vol-val').textContent = Math.round(audio.volume * 100) + '%';
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (document.pointerLockElement === canvas) controls.unlock();
  settingsPanel.classList.remove('hidden');
});
document.getElementById('settings-close').addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.add('hidden');
});
sensSlider.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  controls.setSensitivity(v);
  document.getElementById('sens-val').textContent = v.toFixed(1) + 'x';
});
volSlider.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  audio.setVolume(v);
  document.getElementById('vol-val').textContent = Math.round(v * 100) + '%';
});

// touch controls: joystick for steering, buttons for throttle, tap-drag to look (handled in Controls)
const joyBase = document.getElementById('joystick-base');
const joyKnob = document.getElementById('joystick-knob');
let joyId = null;
const JOY_R = 42;
function joyReset() {
  joyKnob.style.transform = 'translate(-50%, -50%)';
  controls.touch.left = false;
  controls.touch.right = false;
}
joyBase.addEventListener('pointerdown', (e) => { joyId = e.pointerId; joyBase.setPointerCapture(e.pointerId); });
joyBase.addEventListener('pointermove', (e) => {
  if (e.pointerId !== joyId) return;
  const rect = joyBase.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx, dy = e.clientY - cy;
  const dist = Math.min(JOY_R, Math.hypot(dx, dy));
  const ang = Math.atan2(dy, dx);
  const kx = Math.cos(ang) * dist, ky = Math.sin(ang) * dist;
  joyKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
  const norm = kx / JOY_R;
  controls.touch.left = norm < -0.25;
  controls.touch.right = norm > 0.25;
});
const joyEnd = (e) => { if (e.pointerId !== joyId) return; joyId = null; joyReset(); };
joyBase.addEventListener('pointerup', joyEnd);
joyBase.addEventListener('pointercancel', joyEnd);
const bindHold = (el, prop) => {
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); controls.touch[prop] = true; });
  el.addEventListener('pointerup', () => { controls.touch[prop] = false; });
  el.addEventListener('pointerleave', () => { controls.touch[prop] = false; });
  el.addEventListener('pointercancel', () => { controls.touch[prop] = false; });
};
bindHold(document.getElementById('btn-accel'), 'forward');
bindHold(document.getElementById('btn-brake'), 'back');
document.getElementById('mobile-pause').addEventListener('click', (e) => {
  e.stopPropagation();
  if (state === 'playing') {
    controls.unlock();
    state = 'paused';
    audio.suspend();
    hud.showPause(true);
  }
});

addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && state === 'playing') {
    controls.unlock();
    state = 'paused';
    audio.suspend();
    hud.showPause(true);
  }
});

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();
let t = 0;
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (state === 'playing' || state === 'start') {
    t += dt;
    const input = state === 'playing' ? controls.input : {};
    const prevX = ship.pos.x, prevZ = ship.pos.z;
    ship.update(dt, t, input);
    ocean.update(t, ship.pos);
    world.update(dt, t, ship.group.position);
    treasure.update(dt, t, ship);
    comboTimer = Math.max(0, comboTimer - dt);
    if (comboTimer <= 0 && comboCount > 0) { comboCount = 0; hud.hideCombo(); }
    else if (comboCount > 1) hud.showCombo(comboCount, 0, comboTimer / COMBO_WINDOW);
    // shark hunt cycle: hidden 30s, chases for 20s, repeat
    if (state === 'playing') {
    sharkTimer += dt;
    if (!sharkActive && sharkTimer >= sharkHiddenDuration(t)) {
      sharkActive = true;
      sharkTimer = 0;
      shark.spawnNear(ship.pos, ship.heading, 140, 220);
      shark.mesh.visible = true;
      tutorial('shark', 'A Shark Approaches', 'It will hunt you for 20 seconds. Steer clear or lose a life.');
    } else if (sharkActive && sharkTimer >= SHARK_CHASE_DURATION) {
      sharkActive = false;
      sharkTimer = 0;
      shark.mesh.visible = false;
    }
    }
    const sharkDist = sharkActive ? shark.update(dt, t, ship.pos) : Infinity;
    invulnT = Math.max(0, invulnT - dt);

    // kraken hazard cycle: hidden 40s -> red warning zone 5s -> tentacles surface for 15s
    if (state === 'playing') {
    krakenTimer += dt;
    if (krakenPhase === 'hidden' && krakenTimer >= KRAKEN_HIDDEN_DURATION) {
      krakenPhase = 'warning';
      krakenTimer = 0;
      krakenZoneT = 0;
      kraken.spawnNear(ship.pos);
      tutorial('kraken', 'Kraken Sighted', 'A red zone marks the danger. Sail out within 5 seconds once it surfaces.');
    } else if (krakenPhase === 'warning' && krakenTimer >= KRAKEN_WARNING_DURATION) {
      krakenPhase = 'active';
      krakenTimer = 0;
      kraken.surface();
    } else if (krakenPhase === 'active' && krakenTimer >= KRAKEN_ACTIVE_DURATION) {
      krakenPhase = 'hidden';
      krakenTimer = 0;
      krakenZoneT = 0;
      kraken.mesh.visible = false;
    }
    }
    let krakenDist = Infinity;
    if (krakenPhase === 'warning') {
      kraken.update(dt, t, true);
      krakenDist = kraken.distanceTo(ship.pos);
    } else if (krakenPhase === 'active') {
      kraken.update(dt, t, false);
      krakenDist = kraken.distanceTo(ship.pos);
      if (krakenDist < kraken.dangerRadius) krakenZoneT += dt; else krakenZoneT = 0;
      hud.setKrakenWarning(krakenDist < kraken.dangerRadius, KRAKEN_ZONE_LIMIT - krakenZoneT);
    } else {
      hud.setKrakenWarning(false, 0);
    }
    if (krakenZoneT >= KRAKEN_ZONE_LIMIT && state === 'playing' && invulnT <= 0) {
      state = 'crashing';
      shakeT = 0.9;
      ship.speed = 0;
      const blastPos = ship.group.position.clone().add(new THREE.Vector3(0, 1, 0));
      crash = new Crash(scene, blastPos);
      audio.crash();
      gameOverReason = 'kraken';
      flashEl.style.transition = 'none';
      flashEl.style.opacity = '0.9';
      requestAnimationFrame(() => {
        flashEl.style.transition = 'opacity 0.6s ease';
        flashEl.style.opacity = '0';
      });
    }
    // powerup: floating cannonball, appears/disappears; arms the ability to sink a shark
    if (state === 'playing') {
    powerupTimer += dt;
    if (powerupPhase === 'hidden' && powerupTimer >= POWERUP_HIDDEN_DURATION) {
      powerupPhase = 'visible';
      powerupTimer = 0;
      powerup.spawnNear(ship.pos, ship.heading);
      tutorial('powerup', 'Cannonball Spotted', 'Grab it to sink the next shark that gets close to you.');
    } else if (powerupPhase === 'visible' && powerupTimer >= POWERUP_VISIBLE_DURATION) {
      powerupPhase = 'hidden';
      powerupTimer = 0;
      powerup.mesh.visible = false;
    }
    }
    if (powerupPhase === 'visible') {
      powerup.update(dt, t);
      if (powerup.distanceTo(ship.pos) < POWERUP_PICKUP_RADIUS) {
        powerupPhase = 'hidden';
        powerupTimer = 0;
        powerup.mesh.visible = false;
        armed = true;
        armedT = ARMED_DURATION;
        audio.armedJingle();
      }
    }
    if (armed) {
      armedT -= dt;
      if (armedT <= 0) armed = false;
      hud.setArmed(armed, armedT / ARMED_DURATION);
    } else hud.setArmed(false, 0);

    if (armed && sharkActive && sharkDist < SHARK_KILL_RADIUS) {
      armed = false;
      sharkActive = false;
      sharkTimer = 0;
      shark.mesh.visible = false;
      score += 5;
      hud.setScore(score);
      const blastPos = shark.mesh.position.clone().add(new THREE.Vector3(0, 1, 0));
      crash = new Crash(scene, blastPos);
      audio.crash();
    }

    // obstacle collision
    const hit = invulnT <= 0 ? world.checkCollision(ship.pos, SHIP_COLLIDE_RADIUS) : null;
    if (hit && state === 'playing') {
      if (ship.speed > GAMEOVER_SPEED) {
        state = 'crashing';
        shakeT = 0.9;
        ship.speed = 0;
        ship.pos.x = prevX; ship.pos.z = prevZ;
        ship.group.position.x = prevX; ship.group.position.z = prevZ;
        const blastPos = ship.group.position.clone().add(new THREE.Vector3(0, 2, -9));
        crash = new Crash(scene, blastPos);
        audio.crash();
        gameOverReason = 'wreck';
        flashEl.style.transition = 'none';
        flashEl.style.opacity = '0.9';
        requestAnimationFrame(() => {
          flashEl.style.transition = 'opacity 0.6s ease';
          flashEl.style.opacity = '0';
        });
      } else {
        ship.pos.x = prevX; ship.pos.z = prevZ;
        ship.group.position.x = prevX; ship.group.position.z = prevZ;
        ship.speed = 0;
      }
    }
    if (sharkActive && sharkDist < SHARK_CATCH_RADIUS && state === 'playing' && invulnT <= 0) {
      state = 'crashing';
      shakeT = 0.9;
      ship.speed = 0;
      const blastPos = ship.group.position.clone().add(new THREE.Vector3(0, 1.5, -6));
      crash = new Crash(scene, blastPos);
      audio.crash();
      gameOverReason = 'devoured';
      flashEl.style.transition = 'none';
      flashEl.style.opacity = '0.9';
      requestAnimationFrame(() => {
        flashEl.style.transition = 'opacity 0.6s ease';
        flashEl.style.opacity = '0';
      });
    }
    // camera: mouse look + gentle bob
    rig.rotation.y = controls.yaw;
    camera.rotation.x = controls.pitch;
    rig.position.y = 4.15 + Math.sin(t * 1.35) * 0.09 + Math.sin(t * 0.62) * 0.06;
    // hud
    hud.setSpeed(ship.speed * 0.9);
    hud.setHeading(ship.heading + controls.yaw);
    ship.setNight(world.nightFactor);
    if (world.nightFactor > 0.6) sawNight = true;
    if (Math.floor(t) % 20 === 0) achievements.check({ totalCollected, counts: hud.counts, bestCombo, score, surviveTime: t, livesLost: livesLostTotal, sawNight });
    hud.drawMap(ship.pos, ship.heading, treasure.chests);
    if (sharkActive) hud.drawShark(ship.pos, ship.heading, shark.pos, sharkDist);
    if (krakenPhase !== 'hidden') hud.drawKraken(ship.pos, ship.heading, kraken.pos, kraken.dangerRadius, krakenZoneT);
    if (powerupPhase === 'visible') hud.drawPowerup(ship.pos, ship.heading, powerup.pos);
    audio.setSpeedFactor(ship.speed / ship.maxSpeed);
  } else if (state === 'crashing') {
    t += dt;
    ocean.update(t, ship.pos);
    world.update(dt, t, ship.group.position);
    if (crash) crash.update(dt);
    shakeT -= dt;
    const s = Math.max(0, shakeT);
    rig.position.set(
      (Math.random() - 0.5) * s * 1.6,
      4.15 + (Math.random() - 0.5) * s * 1.6,
      (Math.random() - 0.5) * s * 1.6,
    );
    camera.rotation.z = (Math.random() - 0.5) * s * 0.12;
    if (shakeT <= 0) {
      camera.rotation.z = 0;
      lives--;
      hud.setLives(lives, MAX_LIVES);
      if (lives <= 0) {
        state = 'gameover';
        controls.unlock();
        audio.suspend();
        hud.showGameOver(true, score, gameOverReason);
        sdk.gameplayStop();
      } else {
        // respawn: clear breathing room around the ship, brief invulnerability
        livesLostTotal++;
        achievements.check({ totalCollected, counts: hud.counts, bestCombo, score, surviveTime: t, livesLost: livesLostTotal, sawNight });
        sharkActive = false;
        sharkTimer = 0;
        shark.mesh.visible = false;
        krakenPhase = 'hidden';
        krakenTimer = 0;
        krakenZoneT = 0;
        kraken.mesh.visible = false;
        invulnT = 2.5;
        state = 'playing';
      }
    }
  }
  renderer.render(scene, camera);
}
frame();
