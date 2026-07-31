import { sdk } from './sdk.js';

// Procedural WebAudio — no assets needed.
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.volume = parseFloat(sdk.getItem('pirate-volume') ?? '0.8');
    this.muted = false;
  }

  start() {
    if (this.ctx) { this.ctx.resume(); return; }
    const ctx = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;
    this.master.connect(ctx.destination);
    this.noiseBuf = this.makeNoise();
    this.startOcean();
    this.startWind();
    this.scheduleGulls();
    this.startMusic();
  }
  suspend() { if (this.ctx) this.ctx.suspend(); }
  resume() { if (this.ctx) this.ctx.resume(); }
  setMute(mute) {
    this.muted = mute;
    this.updateMasterGain();
  }
  updateMasterGain() {
    if (this.master && this.ctx) {
      const v = this.muted ? 0 : this.volume;
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
    }
  }
  setVolume(v) {
    this.volume = v;
    sdk.setItem('pirate-volume', String(v));
    this.updateMasterGain();
  }

  makeNoise() {
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  loopNoise() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf; s.loop = true; s.start();
    return s;
  }

  startOcean() {
    const ctx = this.ctx;
    const src = this.loopNoise();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 420;
    const g = ctx.createGain(); g.gain.value = 0.13;
    // slow swell
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.06;
    lfo.connect(lfoG).connect(g.gain); lfo.start();
    src.connect(lp).connect(g).connect(this.master);
  }

  startWind() {
    const ctx = this.ctx;
    const src = this.loopNoise();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 750; bp.Q.value = 0.6;
    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0.02;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const lfoG = ctx.createGain(); lfoG.gain.value = 180;
    lfo.connect(lfoG).connect(bp.frequency); lfo.start();
    src.connect(bp).connect(this.windGain).connect(this.master);
  }
  setSpeedFactor(f) {
    if (this.windGain) this.windGain.gain.setTargetAtTime(0.02 + f * 0.06, this.ctx.currentTime, 0.4);
  }

  gull(time) {
    const ctx = this.ctx;
    const n = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const t0 = time + i * 0.28;
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1350 + Math.random() * 200, t0);
      o.frequency.exponentialRampToValueAtTime(900, t0 + 0.16);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.045, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.2);
      o.connect(g).connect(this.master);
      o.start(t0); o.stop(t0 + 0.25);
    }
  }
  scheduleGulls() {
    const loop = () => {
      if (this.ctx.state === 'running') this.gull(this.ctx.currentTime + 0.1);
      this._gullTimer = setTimeout(loop, 6000 + Math.random() * 10000);
    };
    this._gullTimer = setTimeout(loop, 3500);
  }

  pluck(freq, t0, dur = 0.5, vol = 0.06, type = 'triangle') {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0004, t0 + dur);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600;
    o.connect(lp).connect(g).connect(this.master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  pickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => this.pluck(f, t + i * 0.07, 0.5, 0.08, 'sine'));
    this.pluck(1567.98, t + 0.3, 0.7, 0.045, 'sine');
  }

  armedJingle() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99];
    notes.forEach((f, i) => this.pluck(f, t + i * 0.06, 0.35, 0.06, 'square'));
  }

  crash() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    // low thud
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.5);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    o.connect(og).connect(this.master); o.start(t); o.stop(t + 0.65);
    // crack noise burst
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.5;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.6, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    src.connect(bp).connect(ng).connect(this.master);
    src.start(t); src.stop(t + 0.4);
  }

  startMusic() {
    // calm 3/4 sea-shanty lilt in D — lookahead scheduler
    const bpm = 88, beat = 60 / bpm;
    const D = 293.66, E = 329.63, Fs = 369.99, G = 392, A = 440, B = 493.88, d2 = 587.33;
    // [beat, freq, durBeats]
    const melody = [
      [0, D, 1.6], [2, Fs, 0.9], [3, A, 1.6], [5, Fs, 0.9],
      [6, G, 1.6], [8, Fs, 0.9], [9, E, 2.6],
      [12, D, 1.6], [14, Fs, 0.9], [15, A, 1.6], [17, B, 0.9],
      [18, d2, 1.6], [20, A, 0.9], [21, Fs, 2.6],
    ];
    const bass = [[0, D / 2], [3, A / 2], [6, G / 2], [9, A / 4], [12, D / 2], [15, Fs / 2], [18, G / 2], [21, D / 2]];
    const LOOP = 24;
    let nextLoopStart = this.ctx.currentTime + 1;
    const schedule = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      while (nextLoopStart < now + 3) {
        for (const [b, f, dur] of melody) this.pluck(f, nextLoopStart + b * beat, dur * beat * 1.1, 0.038);
        for (const [b, f] of bass) this.pluck(f, nextLoopStart + b * beat, beat * 2.6, 0.042, 'sine');
        nextLoopStart += LOOP * beat;
      }
      this._musicTimer = setTimeout(schedule, 800);
    };
    schedule();
  }
}
