import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

export default function GameModal({ game, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!game) return null;

  // We resolve the game path safely. 
  // If game title is 'Hexa Drift', path is '/games/hexa-drift/index.html'
  const gamePath = `/games/${game.title.toLowerCase().replace(/\s+/g, '-')}/index.html`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(26, 26, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Modal Container */}
      <div style={{
        background: '#f9f5f2',
        border: '3px solid #1a1a1a',
        borderRadius: 24,
        width: isFullscreen ? '96vw' : '880px',
        height: isFullscreen ? '94vh' : '640px',
        maxWidth: '96vw',
        maxHeight: '94vh',
        boxShadow: '8px 8px 0 #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Modal Header */}
        <div style={{
          background: '#61609a',
          borderBottom: '3px solid #1a1a1a',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#f9f5f2'
        }}>
          <div>
            <span style={{
              background: '#f4ed36',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              borderRadius: '999px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: 700,
              marginRight: '12px',
              textTransform: 'uppercase'
            }}>{game.genre}</span>
            <span style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '18px'
            }}>{game.title}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid #1a1a1a',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                color: '#f9f5f2',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#f8c1ba',
                border: '2px solid #1a1a1a',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                color: '#1a1a1a',
                transition: 'all 0.2s',
                boxShadow: '1px 1px 0 #1a1a1a'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '1px 1px 0 #1a1a1a';
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Modal Iframe Wrapper */}
        <div style={{ flex: 1, position: 'relative', background: '#1a1a1a' }}>
          <iframe
            src={gamePath}
            title={game.title}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
