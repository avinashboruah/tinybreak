import { sdk } from './sdk.js';

export const ACHIEVEMENTS = [
  { id: 'first_treasure', name: 'First Plunder', desc: 'Collect your first treasure', check: s => s.totalCollected >= 1 },
  { id: 'treasure_10', name: 'Seasoned Looter', desc: 'Collect 10 treasures', check: s => s.totalCollected >= 10 },
  { id: 'treasure_25', name: 'Hoarder', desc: 'Collect 25 treasures', check: s => s.totalCollected >= 25 },
  { id: 'crown_collector', name: 'Fit for a King', desc: 'Collect a crown', check: s => s.counts.crown >= 1 },
  { id: 'jeweled_collector', name: 'Gem Eye', desc: 'Collect a jeweled chest', check: s => s.counts.jeweled >= 1 },
  { id: 'combo_5', name: 'On a Roll', desc: 'Reach a x5 combo', check: s => s.bestCombo >= 5 },
  { id: 'combo_10', name: 'Unstoppable', desc: 'Reach a x10 combo', check: s => s.bestCombo >= 10 },
  { id: 'score_100', name: 'Century Club', desc: 'Score 100 points', check: s => s.score >= 100 },
  { id: 'survivor_3', name: 'Sea Legs', desc: 'Survive 3 minutes', check: s => s.surviveTime >= 180 },
  { id: 'battle_scarred', name: 'Battle Scarred', desc: 'Survive a hit and keep sailing', check: s => s.livesLost >= 1 },
  { id: 'pouch_collector', name: 'Penny Pincher', desc: 'Collect 5 coin pouches', check: s => s.counts.pouch >= 5 },
  { id: 'chest_collector', name: 'Treasure Hauler', desc: 'Collect 5 chests', check: s => s.counts.chest >= 5 },
  { id: 'full_cargo', name: 'Full Cargo', desc: 'Collect one of every treasure type', check: s => s.counts.pouch >= 1 && s.counts.chest >= 1 && s.counts.jeweled >= 1 && s.counts.crown >= 1 },
  { id: 'score_250', name: 'Legendary Plunderer', desc: 'Score 250 points', check: s => s.score >= 250 },
  { id: 'combo_15', name: 'Frenzy', desc: 'Reach a x15 combo', check: s => s.bestCombo >= 15 },
  { id: 'survivor_5', name: 'Old Salt', desc: 'Survive 5 minutes', check: s => s.surviveTime >= 300 },
  { id: 'untouchable', name: 'Untouchable', desc: 'Score 50 points without losing a life', check: s => s.score >= 50 && s.livesLost === 0 },
  { id: 'night_sailor', name: 'Night Sailor', desc: 'Sail through a night at sea', check: s => s.sawNight },
];

export class AchievementTracker {
  constructor(onUnlock) {
    this.onUnlock = onUnlock;
    this.unlocked = new Set(JSON.parse(sdk.getItem('pirate-achievements') || '[]'));
  }
  check(state) {
    for (const a of ACHIEVEMENTS) {
      if (this.unlocked.has(a.id)) continue;
      if (a.check(state)) {
        this.unlocked.add(a.id);
        sdk.setItem('pirate-achievements', JSON.stringify([...this.unlocked]));
        this.onUnlock(a);
      }
    }
  }
}
