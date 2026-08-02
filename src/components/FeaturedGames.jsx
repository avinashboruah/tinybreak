import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedGames({ games, onPlayGame, setCurrentView }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="games" style={{ maxWidth: 1380, margin: '0 auto', padding: '24px 40px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="section-heading" style={{ margin: 0 }}>
          Featured games
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {games.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                style={{
                  background: '#f9f5f2', border: '2px solid #1a1a1a', borderRadius: '50%',
                  width: 38, height: 38, display: 'grid', placeItems: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 0 #1a1a1a',
                  transition: 'transform 100ms, box-shadow 100ms'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
                onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <ChevronLeft size={18} color="#1a1a1a" />
              </button>
              <button 
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                style={{
                  background: '#f9f5f2', border: '2px solid #1a1a1a', borderRadius: '50%',
                  width: 38, height: 38, display: 'grid', placeItems: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 0 #1a1a1a',
                  transition: 'transform 100ms, box-shadow 100ms'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
                onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <ChevronRight size={18} color="#1a1a1a" />
              </button>
            </div>
          )}
          
          <button
            onClick={() => setCurrentView('games')}
            style={{ 
              fontFamily: "'IBM Plex Sans', sans-serif", 
              fontSize: 15, 
              fontWeight: 600, 
              color: '#f9f5f2', 
              opacity: 0.8, 
              transition: 'opacity 150ms',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 4px'
            }}
            onMouseEnter={e => e.target.style.opacity = '1'}
            onMouseLeave={e => e.target.style.opacity = '0.8'}
          >See all →</button>
        </div>
      </div>

      {games.length === 0 ? (
        <div style={{
          background: 'rgba(249, 245, 242, 0.1)',
          border: '2px dashed #f9f5f2',
          borderRadius: 20,
          padding: '48px',
          textAlign: 'center',
          fontFamily: "'IBM Plex Sans', sans-serif",
          color: '#f9f5f2',
          fontSize: 16
        }}>
          No featured games match your search query or selected category.
        </div>
      ) : (
        <div className="game-carousel-container">
          <div className="game-carousel" ref={carouselRef}>
            {games.map((g, index) => {
              return (
                <div
                  key={g.title}
                  onClick={() => onPlayGame(g)}
                  className="game-carousel-icon-card game-icon-card card-entrance"
                  style={{
                    animationDelay: `${index * 0.05}s`
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
        </div>
      )}
    </section>
  );
}
