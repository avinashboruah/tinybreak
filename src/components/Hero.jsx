import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Hero({ setCurrentView }) {
  return (
    <section className="hero-grid-responsive" style={{
      maxWidth: 1380,
      margin: '0 auto',
    }}>
      <div>

        <h1 style={{
          fontFamily: 'Sora, sans-serif', fontWeight: 800,
          fontSize: 62, lineHeight: 1.12, margin: '0 0 24px',
          color: '#f9f5f2',
        }}>
          Escape the scroll. Play something <span style={{ color: '#f4ed36' }}>refreshing</span>.
        </h1>

        <p style={{
          fontSize: 20, lineHeight: 1.7, color: '#f9f5f2',
          opacity: 0.9, margin: '0 0 44px', maxWidth: '44ch',
        }}>Low-poly adventures, tiny puzzles, relaxing games, and quick browser experiences.</p>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => setCurrentView('games')}
            style={{
              background: '#f4ed36', color: '#000',
              border: '2px solid #1a1a1a', borderRadius: 999,
              padding: '16px 36px', fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600, fontSize: 18, cursor: 'pointer', transition: 'transform 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1.05)'}
          >Play Now</button>
          <button
            onClick={() => {
              setCurrentView('games');
              setTimeout(() => {
                document.getElementById('nav-search-input')?.focus();
              }, 50);
            }}
            style={{
              background: '#f9f5f2', color: '#000',
              border: '2px solid #1a1a1a', borderRadius: 999,
              padding: '16px 36px', fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600, fontSize: 18, cursor: 'pointer', transition: 'transform 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >Browse Games</button>
        </div>
      </div>

      {/* Lottie animation — fixed sizing */}
      <div className="hero-lottie-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 520,
      }}>
        <DotLottieReact
          src="/game lucky.lottie"
          loop
          autoplay
          style={{ width: '100%', maxWidth: 460, aspectRatio: '1 / 1' }}
        />
      </div>
    </section>
  );
}
