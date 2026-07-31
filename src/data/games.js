import { 
  Trophy, Compass, Brain, Grid, Layers, Sparkles, Layout, 
  Smile, HelpCircle, Gamepad2, Info, Anchor 
} from 'lucide-react';

export const DATA = {
  featured: [
    { id: 9, title: 'Gold Tide', genre: 'Low Poly', icon: Anchor, cover: 'url(/covers/gold-tide.png)', pattern: '', fatigue: 2, multiplayer: false },
    { id: 1, title: 'Hexa Drift', genre: 'Low Poly', icon: Compass, cover: 'url(/covers/hexa-drift.png)', pattern: '', fatigue: 2, multiplayer: false },
    { id: 10, title: 'Voxel Wings', genre: 'Low Poly', icon: Gamepad2, cover: 'linear-gradient(135deg, #7ec8f2 0%, #0a1526 100%)', pattern: 'pattern-stripes', fatigue: 3, multiplayer: false },
    { id: 2, title: 'Mirror Maze', genre: 'Puzzle', icon: Layers, cover: 'url(/covers/mirror-maze.png)', pattern: '', fatigue: 4, multiplayer: true },
    { id: 3, title: 'Cloud Counter', genre: 'Mind Games', icon: Brain, cover: 'linear-gradient(135deg, #f9cc73 0%, #e6a72e 100%)', pattern: 'pattern-stripes', fatigue: 3, multiplayer: false },
    { id: 4, title: 'Tile Tide', genre: '2D', icon: Grid, cover: 'linear-gradient(135deg, #ac4f98 0%, #7e2d6b 100%)', pattern: 'pattern-dots', fatigue: 5, multiplayer: true },
  ],
  categories: [
    { label: 'All', icon: Layout },
    { label: 'Low Poly', icon: Compass },
    { label: 'Puzzle', icon: Layers },
    { label: 'Mind Games', icon: Brain },
    { label: 'Memory', icon: Sparkles },
    { label: 'Strategy', icon: Trophy },
    { label: 'Casual', icon: Smile },
    { label: '2D', icon: Grid },
  ],
  latest: [
    { id: 10, title: 'Voxel Wings', genre: 'Low Poly', icon: Gamepad2, cover: 'linear-gradient(135deg, #7ec8f2 0%, #0a1526 100%)', pattern: 'pattern-stripes' },
    { id: 9, title: 'Gold Tide', genre: 'Low Poly', icon: Anchor, cover: 'url(/covers/gold-tide.png)', pattern: '' },
    { id: 5, title: 'Knot Logic', genre: 'Mind Games', icon: Brain, cover: 'linear-gradient(135deg, #8584bd 0%, #5d5c95 100%)', pattern: 'pattern-stripes' },
    { id: 6, title: 'Petal Pop', genre: 'Casual', icon: Smile, cover: 'linear-gradient(135deg, #f8c1ba 0%, #e28f85 100%)', pattern: 'pattern-dots' },
    { id: 7, title: 'Grid Ghost', genre: 'Memory', icon: Sparkles, cover: 'linear-gradient(135deg, #b5c995 0%, #859f63 100%)', pattern: 'pattern-grid' },
    { id: 8, title: 'Slope Sheep', genre: 'Low Poly', icon: Compass, cover: 'linear-gradient(135deg, #f9cc73 0%, #e6a72e 100%)', pattern: 'pattern-stripes' },
  ],
  why: [
    { icon: Sparkles, title: 'No installs', text: 'Every game runs right in your browser. Click, play, breathe.', bg: '#f9cc73' },
    { icon: Gamepad2, title: 'Made for breaks', text: 'Sessions of 3–10 minutes. Designed to refresh, not to hook.', bg: '#f8c1ba' },
    { icon: Info, title: 'Calm by design', text: 'No ads mid-game, no timers screaming at you. Just play.', bg: '#b5c995' },
  ],
  journal: [
    { tag: 'Devlog', date: 'Jul 14', title: "How we made Hexa Drift's island float", blurb: 'Three triangles, one sine wave, and a lot of restraint.' },
    { tag: 'Ideas', date: 'Jul 8', title: 'Why fatigue scores beat difficulty ratings', blurb: 'A game can be easy and exhausting. We measure the second thing.' },
    { tag: 'News', date: 'Jul 1', title: 'Four new mind games landed this week', blurb: 'Knot Logic, Grid Ghost, and two more small brain-stretchers.' },
  ],
};
