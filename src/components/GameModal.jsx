import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function GameModal({ game, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      background: '#1a1a1a',
      animation: 'fadeIn 0.2s ease-out',
      overflow: 'hidden'
    }}>
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
      <button
        onClick={onClose}
        className="game-close-btn"
        title="Exit Game (Esc)"
      >
        <X size={20} strokeWidth={3} />
      </button>
    </div>
  );
}

