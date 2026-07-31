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
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 32, margin: 0, color: '#f9f5f2' }}>
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
                  className="game-carousel-card card-entrance"
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
                  {/* Premium gradient cover with layered pattern */}
                  <div style={{
                    height: 180,
                    background: g.cover,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderBottom: '2px solid #1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Subtle pattern overlay */}
                    <div className={g.pattern} />
                  </div>

                  <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, margin: 0, color: '#1a1a1a' }}>{g.title}</h3>
                      {g.multiplayer && (
                        <span style={{
                          background: '#f9cc73', border: '1.5px solid #1a1a1a',
                          borderRadius: 999, padding: '3px 10px',
                          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11,
                          fontWeight: 700, whiteSpace: 'nowrap', color: '#1a1a1a',
                          flexShrink: 0,
                        }}>2P</span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: '#61609a',
                    }}>
                      <span>{g.genre}</span>
                      <span style={{ width: 3, height: 3, background: '#61609a', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                      <span>Fatigue {g.fatigue}/10</span>
                    </div>
                    <button
                      style={{
                        background: '#f4ed36', color: '#000',
                        border: '2px solid #1a1a1a', borderRadius: 999,
                        padding: '12px 0', width: '100%',
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
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
        </div>
      )}
    </section>
  );
}
