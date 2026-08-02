import Categories from './Categories.jsx';

export default function AllGamesPage({ games, categories, activeCategory, setActiveCategory, onPlayGame, searchQuery, setSearchQuery }) {
  // Filter games based on category and search
  const filtered = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || g.genre === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 40px 80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        <h1 className="explore-heading">
          Explore Games
        </h1>
        <p style={{ fontSize: 16, color: '#f9f5f2', opacity: 0.8, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Explore our hand-crafted low-poly adventures and relaxing puzzle games.
        </p>
      </div>

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
                  
                  {/* Central Badge containing the Lucide icon */}
                  <div className="game-icon-badge">
                    {g.icon ? <g.icon size={22} color="#1a1a1a" strokeWidth={2.5} /> : null}
                  </div>

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
  );
}
