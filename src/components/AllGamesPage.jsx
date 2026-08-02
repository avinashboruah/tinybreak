import Categories from './Categories.jsx';
import { useState, useEffect } from 'react';

export default function AllGamesPage({ games, categories, activeCategory, setActiveCategory, onPlayGame, searchQuery, setSearchQuery }) {
  // Filter games based on category and search
  const filtered = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || g.genre === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Featured games for the billboard slideshow
  const featuredGames = games.filter(g => [9, 1, 10, 2, 3, 4].includes(g.id));
  const [billboardIndex, setBillboardIndex] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setBillboardIndex(prev => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  const activeBillboardGame = featuredGames[billboardIndex] || games[0];

  const getGameDescription = (title) => {
    switch (title) {
      case 'Gold Tide':
        return "Set sail on low-poly voxel waters! Discover hidden treasure chests, navigate the shifting tides, dodge pirate hazards, and escape in this cozy, relaxing exploration adventure.";
      case 'Hexa Drift':
        return "Drift across floating hexagonal islands! Balance your speed, timing, and momentum to stay on the path without falling into the void in this fast-paced low-poly runner.";
      case 'Voxel Wings':
        return "Take flight in a colorful voxel sky! Dodge obstacles, collect rings, and navigate beautiful landscapes in this relaxing high-flying flight simulator.";
      case 'Mirror Maze':
        return "Reflect, rotate, and solve! Guide lasers through a grid of mirrors to light up crystals, solving challenging optical puzzles in a peaceful atmospheric setting.";
      case 'Cloud Counter':
        return "Count the clouds and challenge your mind! A soft, relaxing puzzle game about memory, focus, and finding patterns in the sky.";
      case 'Tile Tide':
        return "A quick, clever tile-matching puzzle game! Place, connect, and clear colorful grid tiles before the tide rises and fills your board.";
      default:
        return "Play our relaxing, hand-crafted low-poly adventure games right in your browser.";
    }
  };

  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      {/* Netflix-style Full Width Billboard Banner */}
      <div className="billboard-container" style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        position: 'relative',
        height: '380px',
        backgroundImage: activeBillboardGame.cover,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: '3px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        overflow: 'hidden',
        transition: 'background-image 0.5s ease-in-out'
      }}>
        {/* Dark overlay gradient to ensure readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(26, 26, 42, 0.95) 0%, rgba(26, 26, 42, 0.6) 50%, rgba(26, 26, 42, 0.1) 100%)',
          zIndex: 1
        }} />
        
        {/* Content Container */}
        <div className="billboard-content">
          <span style={{
            background: '#f4ed36',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '2px 2px 0 #1a1a1a'
          }}>
            Featured: {activeBillboardGame.genre}
          </span>
          
          <h1 className="billboard-title" style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: '36px',
            color: '#f9f5f2',
            margin: 0,
            lineHeight: 1.1,
            textShadow: '2px 2px 0 #1a1a1a'
          }}>
            {activeBillboardGame.title}
          </h1>
          
          <p className="billboard-description" style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '14px',
            color: '#f9f5f2',
            opacity: 0.9,
            maxWidth: '60ch',
            lineHeight: 1.6,
            margin: '4px 0 12px'
          }}>
            {getGameDescription(activeBillboardGame.title)}
          </p>
          
          <button
            onClick={() => onPlayGame(activeBillboardGame)}
            className="pulse-button"
            style={{
              background: '#f4ed36',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              borderRadius: '999px',
              padding: '10px 28px',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #1a1a1a',
              transition: 'transform 200ms'
            }}
          >
            ▶ Play Now
          </button>
        </div>
      </div>

      {/* Main Padded Content Area */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 80px' }}>
        {/* Category selector */}
        <div style={{ marginBottom: 40 }}>
          <Categories 
            categories={categories} 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Search/Filter status bar */}
        {(searchQuery || activeCategory !== 'All') && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'rgba(249, 245, 242, 0.08)',
            border: '2px solid #1a1a1a',
            borderRadius: 16,
            padding: '12px 24px',
            marginBottom: 28,
            color: '#f9f5f2',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14
          }}>
            <div>
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'game' : 'games'} 
              {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
              {searchQuery && <> matching "<strong>{searchQuery}</strong>"</>}
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              style={{
                background: '#f8c1ba',
                border: '2px solid #1a1a1a',
                borderRadius: 999,
                padding: '6px 14px',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #1a1a1a',
                color: '#1a1a1a'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Grid display */}
        {filtered.length === 0 ? (
          <div style={{
            background: 'rgba(249, 245, 242, 0.05)',
            border: '2px dashed #f9f5f2',
            borderRadius: 24,
            padding: '64px',
            textAlign: 'center',
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#f9f5f2',
          }}>
            <h3 style={{ fontSize: 20, margin: '0 0 10px', fontFamily: 'Sora, sans-serif' }}>No games found</h3>
            <p style={{ opacity: 0.7, margin: 0 }}>Try clearing your search query or choosing another category.</p>
          </div>
        ) : (
          <div className="game-icons-grid">
            {filtered.map((g, index) => {
              return (
                <div
                  key={g.title}
                  onClick={() => onPlayGame(g)}
                  className="game-icon-card card-entrance"
                  style={{
                    animationDelay: `${index * 0.04}s`
                  }}
                >
                  {/* Game Icon Box */}
                  <div 
                    className="game-icon-box"
                    style={{
                      background: g.cover,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className={g.pattern} />
                    
                    {/* 2P badge overlay */}
                    {g.multiplayer && (
                      <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        background: '#f9cc73',
                        border: '1.5px solid #1a1a1a',
                        borderRadius: 999,
                        padding: '1px 5px',
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: 9,
                        fontWeight: 800,
                        color: '#1a1a1a',
                        zIndex: 3,
                        boxShadow: '1px 1px 0 #1a1a1a',
                      }}>2P</span>
                    )}
                  </div>

                  {/* Game Title & Genre Info below */}
                  <div>
                    <h3 className="game-icon-title">{g.title}</h3>
                    <div className="game-icon-meta">{g.genre}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
