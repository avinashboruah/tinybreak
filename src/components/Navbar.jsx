import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar({ onRandomGame, searchQuery, setSearchQuery, currentView, setCurrentView }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            setIsMobileMenuOpen(false);
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
        <div className="nav-search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{
            position: 'absolute', left: 14, color: '#1a1a1a', opacity: 0.6,
            pointerEvents: 'none'
          }} />
          <input
            id="nav-search-input"
            className="nav-search-input"
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
          className="pulse-button nav-random-btn"
        >🎲 Random Game</button>
      </div>

      {/* Hamburger menu button */}
      <button 
        className="nav-hamburger-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <button 
            onClick={() => { 
              setCurrentView('home'); 
              setIsMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }} 
            className="mobile-menu-link"
          >
            Home
          </button>
          <button 
            onClick={() => { 
              setCurrentView('games'); 
              setIsMobileMenuOpen(false); 
            }} 
            className="mobile-menu-link"
          >
            Games
          </button>
          <a 
            href="#journal" 
            onClick={() => { 
              setCurrentView('home'); 
              setIsMobileMenuOpen(false); 
            }} 
            className="mobile-menu-link"
          >
            Journal
          </a>
          <button 
            onClick={() => { 
              setCurrentView('about'); 
              setIsMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }} 
            className="mobile-menu-link"
          >
            About
          </button>
          <button
            onClick={() => {
              onRandomGame();
              setIsMobileMenuOpen(false);
              if (currentView !== 'games') {
                setCurrentView('games');
              }
            }}
            className="pulse-button nav-random-btn"
            style={{ width: '100%', marginTop: 8 }}
          >
            🎲 Random Game
          </button>
        </div>
      )}
    </nav>
  );
}
