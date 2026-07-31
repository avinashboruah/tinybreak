import { sdk } from './sdk.js';

export class HUD {
  constructor() {
    this.scoreEl = document.getElementById('score');
    this.speedEl = document.getElementById('speed');
    this.needle = document.getElementById('compass-rose');
    this.pauseEl = document.getElementById('pause');
    this.startEl = document.getElementById('start');
    this.bestEl = document.getElementById('best');
    this.hudEl = document.getElementById('hud');
    this.mapCtx = document.getElementById('map-canvas').getContext('2d');
    this.best = parseInt(sdk.getItem('pirate-best') || '0', 10);
    this.score = 0;
    this.counts = { pouch: 0, chest: 0, jeweled: 0, crown: 0 };
    this.renderBest();
  }
  setLives(n, max) {
    const panel = document.getElementById('lives-panel');
    panel.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const s = document.createElement('span');
      s.innerHTML = '<svg viewBox="0 0 24 24"><path fill="#e35b5b" d="M12 21s-7.6-4.6-10.2-9.3C.2 8.6 1.7 5 5.2 5c2 0 3.4 1.1 4.2 2.4C10.2 6.1 11.6 5 13.6 5c3.5 0 5 3.6 3.4 6.7C19.6 16.4 12 21 12 21z"/></svg>';
      if (i >= n) s.firstChild.classList.add('lost');
      panel.appendChild(s);
    }
  }
  addCount(type) {
    this.counts[type] = (this.counts[type] || 0) + 1;
    const item = document.querySelector(`.count-item[data-type="${type}"]`);
    if (!item) return;
    item.querySelector('.count-num').textContent = this.counts[type];
    item.classList.remove('pop');
    void item.offsetWidth;
    item.classList.add('pop');
  }
  setScore(n) {
    this.score = n;
    this.scoreEl.textContent = n;
    if (n > this.best) {
      this.best = n;
      sdk.setItem('pirate-best', String(n));
      this.renderBest();
    }
    this.scoreEl.parentElement.classList.remove('pop');
    void this.scoreEl.parentElement.offsetWidth;
    this.scoreEl.parentElement.classList.add('pop');
  }
  renderBest() { this.bestEl.textContent = this.best > 0 ? `best ${this.best}` : ''; }
  setSpeed(knots) { this.speedEl.textContent = knots.toFixed(1); }
  setHeading(rad) {
    // rose rotates so ship heading reads at top
    const deg = ((rad * 180) / Math.PI) % 360;
    this.needle.style.transform = `rotate(${deg}deg)`;
  }
  showStart(v) { this.startEl.classList.toggle('hidden', !v); }
  showPause(v) { this.pauseEl.classList.toggle('hidden', !v); }
  showHud(v) { this.hudEl.classList.toggle('hidden', !v); }
  showGameOver(v, score, reason) {
    if (v) {
      document.getElementById('finalscore').textContent = score;
      const h1 = document.querySelector('#gameover h1');
      const sub = document.querySelector('#gameover .sub');
      if (reason === 'devoured') {
        h1.textContent = 'Devoured';
        sub.innerHTML = 'A shark caught your ship in open water. Treasure collected: <strong id="finalscore">' + score + '</strong>';
      } else if (reason === 'kraken') {
        h1.textContent = 'Dragged Under';
        sub.innerHTML = 'The kraken pulled your ship into the deep. Treasure collected: <strong id="finalscore">' + score + '</strong>';
      } else {
        h1.textContent = 'Shipwrecked';
        sub.innerHTML = 'You struck at full speed and the hull gave out. Treasure collected: <strong id="finalscore">' + score + '</strong>';
      }
    }
    document.getElementById('gameover').classList.toggle('hidden', !v);
  }

  drawMap(shipPos, heading, chests) {
    const ctx = this.mapCtx, W = 150, range = 260;
    ctx.clearRect(0, 0, W, W);
    ctx.save();
    ctx.translate(W / 2, W / 2);
    ctx.rotate(heading); // rotate world so ship's forward always points up
    // range rings
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    for (const r of [0.35, 0.7, 1]) { ctx.beginPath(); ctx.arc(0, 0, (W / 2) * r, 0, Math.PI * 2); ctx.stroke(); }
    // chests
    for (const c of chests) {
      if (c.userData.collecting > 0) continue;
      const dx = c.position.x - shipPos.x, dz = c.position.z - shipPos.z;
      const dist = Math.hypot(dx, dz);
      const k = Math.min(1, dist / range);
      const px = (dx / range) * (W / 2) * 0.92, py = (dz / range) * (W / 2) * 0.92;
      const clampedDist = Math.hypot(px, py);
      const maxR = W / 2 - 6;
      let fx = px, fy = py;
      if (clampedDist > maxR) { fx = (px / clampedDist) * maxR; fy = (py / clampedDist) * maxR; }
      ctx.beginPath();
      ctx.arc(fx, fy, clampedDist > maxR ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = k < 1 ? c.userData.type.swatch : 'rgba(240,179,44,0.55)';
      ctx.fill();
    }
    ctx.restore();
    // ship marker (fixed, pointing up)
    ctx.save();
    ctx.translate(W / 2, W / 2);
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(5, 6); ctx.lineTo(0, 3); ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }

  drawShark(shipPos, heading, sharkPos, sharkDist) {
    const ctx = this.mapCtx, W = 150, range = 300;
    ctx.save();
    ctx.translate(W / 2, W / 2);
    ctx.rotate(heading);
    const dx = sharkPos.x - shipPos.x, dz = sharkPos.z - shipPos.z;
    const px = (dx / range) * (W / 2) * 0.92, py = (dz / range) * (W / 2) * 0.92;
    const clampedDist = Math.hypot(px, py);
    const maxR = W / 2 - 6;
    let fx = px, fy = py;
    if (clampedDist > maxR) { fx = (px / clampedDist) * maxR; fy = (py / clampedDist) * maxR; }
    const pulse = 4 + Math.sin(performance.now() * 0.008) * 1.4;
    ctx.beginPath();
    ctx.arc(fx, fy, pulse, 0, Math.PI * 2);
    ctx.fillStyle = sharkDist < 60 ? '#ff2e2e' : '#e04545';
    ctx.fill();
    if (sharkDist < 100) {
      ctx.strokeStyle = 'rgba(255,40,40,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(fx, fy, pulse + 4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  drawKraken(shipPos, heading, krakenPos, dangerRadius, warnT) {
    const ctx = this.mapCtx, W = 150, range = 300;
    ctx.save();
    ctx.translate(W / 2, W / 2);
    ctx.rotate(heading);
    const dx = krakenPos.x - shipPos.x, dz = krakenPos.z - shipPos.z;
    const px = (dx / range) * (W / 2) * 0.92, py = (dz / range) * (W / 2) * 0.92;
    const rr = (dangerRadius / range) * (W / 2) * 0.92;
    const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.08;
    const alpha = warnT > 0 ? 0.18 + Math.sin(performance.now() * 0.02) * 0.08 : 0.12;
    ctx.beginPath();
    ctx.arc(px, py, rr * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,20,30,${alpha})`;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,40,50,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  drawPowerup(shipPos, heading, powerupPos) {
    const ctx = this.mapCtx, W = 150, range = 260;
    ctx.save();
    ctx.translate(W / 2, W / 2);
    ctx.rotate(heading);
    const dx = powerupPos.x - shipPos.x, dz = powerupPos.z - shipPos.z;
    const px = (dx / range) * (W / 2) * 0.92, py = (dz / range) * (W / 2) * 0.92;
    const clampedDist = Math.hypot(px, py);
    const maxR = W / 2 - 6;
    let fx = px, fy = py;
    if (clampedDist > maxR) { fx = (px / clampedDist) * maxR; fy = (py / clampedDist) * maxR; }
    const pulse = 4.5 + Math.sin(performance.now() * 0.01) * 1.2;
    ctx.beginPath();
    ctx.arc(fx, fy, pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#3ea8ff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(62,168,255,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(fx, fy, pulse + 3, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  showCombo(count, bonus, windowFrac) {
    const el = document.getElementById('combo');
    if (count <= 1) { el.classList.remove('show'); return; }
    el.classList.add('show');
    el.querySelector('.combo-x').textContent = `x${count}`;
    el.querySelector('.combo-bonus').textContent = bonus > 0 ? `+${bonus} combo bonus` : '';
    el.querySelector('.combo-bar-fill').style.transform = `scaleX(${Math.max(0, windowFrac)})`;
  }
  hideCombo() { document.getElementById('combo').classList.remove('show'); }

  setArmed(v, frac) {
    const el = document.getElementById('armed-badge');
    el.classList.toggle('show', v);
    if (v) el.querySelector('.armed-bar-fill').style.transform = `scaleX(${Math.max(0, frac)})`;
  }
  showAchievement(a) {
    const wrap = document.getElementById('achievements');
    const el = document.createElement('div');
    el.className = 'achv-toast';
    el.innerHTML = `<div><div class="achv-title">Achievement Unlocked</div><div class="achv-name">${a.name}</div><div class="achv-desc">${a.desc}</div></div>`;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 4000);
  }

  setKrakenWarning(active, remaining) {
    const el = document.getElementById('kraken-warning');
    el.classList.toggle('show', active);
    if (active) el.querySelector('.kw-num').textContent = Math.max(0, remaining).toFixed(1);
  }
  showTutorial(title, desc) {
    const wrap = document.getElementById('tutorial-banner');
    wrap.innerHTML = `<div class="tut-title">${title}</div><div class="tut-desc">${desc}</div>`;
    wrap.classList.add('show');
    clearTimeout(this._tutTimer);
    this._tutTimer = setTimeout(() => wrap.classList.remove('show'), 6000);
  }
}
