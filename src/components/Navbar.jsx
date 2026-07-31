import { Search } from 'lucide-react';

export default function Navbar({ onRandomGame, searchQuery, setSearchQuery, currentView, setCurrentView }) {
  return (
    <nav className="navbar-container" style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#61609a',
      borderBottom: '2px solid #1a1a1a'
    }}>
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Clickable Brand Logo */}
        <div 
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 34, height: 34, background: '#f4ed36',
            border: '2px solid #1a1a1a', borderRadius: 10,
            display: 'grid', placeItems: 'center',
            fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 16,
            color: '#1a1a1a'
          }}>◳</div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 19, color: '#f9f5f2' }}>tinybreak</span>
        </div>

        {/* Search bar inside navigation */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{
            position: 'absolute', left: 14, color: '#1a1a1a', opacity: 0.6,
            pointerEvents: 'none'
          }} />
          <input
            id="nav-search-input"
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto route to games search view if not already there
              if (currentView !== 'games') {
                setCurrentView('games');
              }
            }}
            style={{
              background: '#f9f5f2',
              border: '2px solid #1a1a1a',
              borderRadius: 999,
              padding: '8px 16px 8px 40px',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 14,
              width: 220,
              outline: 'none',
              transition: 'width 200ms ease, box-shadow 200ms ease',
              boxShadow: '0 2px 0 #1a1a1a',
            }}
            onFocus={(e) => {
              e.target.style.width = '280px';
              e.target.style.boxShadow = '0 4px 0 #1a1a1a';
            }}
            onBlur={(e) => {
              e.target.style.width = '220px';
              e.target.style.boxShadow = '0 2px 0 #1a1a1a';
            }}
          />
        </div>
      </div>

      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: 28, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 500 }}>
        {/* Navigation Buttons/Links */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="nav-link"
          style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentView('games')}
          className="nav-link"
          style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          Games
        </button>
        <a
          href="#journal"
          onClick={() => setCurrentView('home')}
          className="nav-link"
        >
          Journal
        </a>
        <button
          onClick={() => {
            setCurrentView('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="nav-link"
          style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          About
        </button>

        <button
          onClick={() => {
            onRandomGame();
            if (currentView !== 'games') {
              setCurrentView('games');
            }
          }}
          className="pulse-button"
          style={{
            background: '#f4ed36', color: '#000',
            border: '2px solid #1a1a1a', borderRadius: 999,
            padding: '10px 22px', fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600, fontSize: 15, cursor: 'pointer',
            transition: 'transform 200ms, box-shadow 200ms'
          }}
        >🎲 Random Game</button>
      </div>
    </nav>
  );
}
