export default function LatestGames({ games, onPlayGame }) {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 64px' }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 32, margin: '0 0 28px', color: '#f9f5f2' }}>
        Latest games
      </h2>

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
          No new games match your search query or selected category.
        </div>
      ) : (
        <div className="grid-responsive-4">
          {games.map((g, index) => {
            const GameIcon = g.icon;
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
                  animationDelay: `${index * 0.08}s`
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
                {/* Premium gradient cover with patterns */}
                <div style={{
                  height: 120,
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
                  <div className={g.pattern} />
                </div>

                <div style={{
                  padding: '14px 16px 16px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 8,
                }}>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: '#1a1a1a' }}>{g.title}</h3>
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#61609a', fontWeight: 500 }}>{g.genre}</div>
                  </div>
                  <span 
                    className="new-badge-pulse"
                    style={{
                      background: '#f8c1ba', border: '1.5px solid #1a1a1a',
                      borderRadius: 999, padding: '3px 10px',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: 11, fontWeight: 700, color: '#1a1a1a',
                      flexShrink: 0,
                      display: 'inline-block'
                    }}
                  >New</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
