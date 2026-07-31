import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import FeaturedGames from './components/FeaturedGames.jsx';
import MoodSelector from './components/MoodSelector.jsx';
import AllGamesPage from './components/AllGamesPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import WhyPlay from './components/WhyPlay.jsx';
import Journal from './components/Journal.jsx';
import Footer from './components/Footer.jsx';
import GameModal from './components/GameModal.jsx';
import GameBackground from './components/GameBackground.jsx';
import { DATA } from './data/games.js';

// Import Lucide icons to pass down
import { 
  Trophy, Compass, Brain, Grid, Layers, Sparkles, Layout, 
  Smile, Play, HelpCircle, Gamepad2, Info, Anchor
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [moodMsg, setMoodMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const moods = [
    { label: 'Relax', icon: Sparkles, bg: '#b5c995', pick: () => setMoodMsg('Try Cloud Counter — slow and soft.') },
    { label: 'Focus', icon: Trophy, bg: '#f8c1ba', pick: () => setMoodMsg('Mirror Maze will sharpen you up.') },
    { label: 'Quick Break', icon: Gamepad2, bg: '#f9cc73', pick: () => setMoodMsg('Tile Tide — rounds under 3 minutes.') },
    { label: 'Challenge', icon: HelpCircle, bg: '#f4ed36', pick: () => setMoodMsg('Knot Logic. Good luck.') },
  ];

  const handleRandomGame = () => {
    // Pick a random game from all unique games list
    const randomIndex = Math.floor(Math.random() * allGames.length);
    const randomGame = allGames[randomIndex];
    setSelectedGame(randomGame);
  };

  const matchesSearchOnly = (game) => {
    return game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           game.genre.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredFeatured = DATA.featured.filter(matchesSearchOnly);

  // Deduplicate and assemble all games
  const allGames = [];
  const seenIds = new Set();
  [...DATA.featured, ...DATA.latest].forEach(game => {
    if (!seenIds.has(game.id)) {
      seenIds.add(game.id);
      allGames.push(game);
    }
  });

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero setCurrentView={setCurrentView} />
            <FeaturedGames 
              games={filteredFeatured} 
              onPlayGame={setSelectedGame} 
              setCurrentView={setCurrentView}
            />
            <MoodSelector moods={moods} moodMsg={moodMsg} />
            <WhyPlay items={DATA.why} />
            <Journal posts={DATA.journal} />
          </>
        );
      case 'games':
        return (
          <AllGamesPage 
            games={allGames}
            categories={DATA.categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onPlayGame={setSelectedGame}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'about':
        return (
          <AboutPage 
            setCurrentView={setCurrentView}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a1a', minHeight: '100vh', position: 'relative' }}>
      <GameBackground />
      <Navbar 
        onRandomGame={handleRandomGame} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      {renderContent()}
      
      <Footer setCurrentView={setCurrentView} />
      
      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}
