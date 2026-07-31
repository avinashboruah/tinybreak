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
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 42, color: '#f9f5f2', margin: 0 }}>
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
        <div className="grid-responsive-4">
          {filtered.map((g, index) => {
            return (
              <div
                key={g.title}
                onClick={() => onPlayGame(g)}
                className="card-entrance"
                style={{
                  background: '#f9f5f2',
                  border: '2px solid #1a1a1a',
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'transform 200ms, box-shadow 200ms',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #1a1a1a',
                  animationDelay: `${index * 0.05}s`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 10px 0 #1a1a1a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 0 #1a1a1a';
                }}
              >
                {/* Game Card Cover */}
                <div style={{
                  height: 140,
                  background: g.cover,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderBottom: '2px solid #1a1a1a',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div className={g.pattern} />
                </div>

                {/* Game Card Footer Info */}
                <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, margin: 0, color: '#1a1a1a' }}>{g.title}</h3>
                    {g.multiplayer && (
                      <span style={{
                        background: '#f9cc73', border: '1.5px solid #1a1a1a',
                        borderRadius: 999, padding: '2px 9px',
                        fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11,
                        fontWeight: 700, whiteSpace: 'nowrap', color: '#1a1a1a',
                        flexShrink: 0,
                      }}>2P</span>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#61609a',
                  }}>
                    <span>{g.genre}</span>
                    <span style={{ width: 3, height: 3, background: '#61609a', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    <span>Fatigue {g.fatigue || 3}/10</span>
                  </div>
                  <button
                    style={{
                      background: '#f4ed36', color: '#000',
                      border: '2px solid #1a1a1a', borderRadius: 999,
                      padding: '10px 0', width: '100%',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      transition: 'transform 200ms', marginTop: 4,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >Play</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
