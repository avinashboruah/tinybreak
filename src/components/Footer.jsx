import { useState } from 'react';

export default function Footer({ setCurrentView }) {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#4d4c80', borderTop: '2px solid #1a1a1a', padding: '52px 40px 36px' }}>
      <div className="footer-grid-responsive" style={{
        maxWidth: 1180, margin: '0 auto', color: '#f9f5f2',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, background: '#f4ed36',
              border: '2px solid #1a1a1a', borderRadius: 10,
              display: 'grid', placeItems: 'center',
              fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 15, color: '#000',
            }}>◳</div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18 }}>tinybreak</span>
          </div>
          <p style={{
            margin: 0, fontSize: 14, lineHeight: 1.6,
            color: '#f9f5f2', opacity: 0.7,
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}>Playful games for quick mental resets.</p>
        </div>

        {/* Quick links */}
        <div>
          <div style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700,
            fontSize: 13, marginBottom: 16, color: '#f9f5f2',
            textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5,
          }}>Quick links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>
            <button
              onClick={() => {
                if (setCurrentView) {
                  setCurrentView('games');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{ background: 'none', border: 'none', font: 'inherit', color: '#f9f5f2', textDecoration: 'none', opacity: 0.75, transition: 'opacity 150ms', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              onMouseEnter={e => e.target.style.opacity = '1'}
              onMouseLeave={e => e.target.style.opacity = '0.75'}
            >
              Games
            </button>
            <a
              href="#journal"
              onClick={() => {
                if (setCurrentView) setCurrentView('home');
              }}
              style={{ color: '#f9f5f2', textDecoration: 'none', opacity: 0.75, transition: 'opacity 150ms' }}
              onMouseEnter={e => e.target.style.opacity = '1'}
              onMouseLeave={e => e.target.style.opacity = '0.75'}
            >
              Journal
            </a>
            <button
              onClick={() => {
                if (setCurrentView) {
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{ background: 'none', border: 'none', font: 'inherit', color: '#f9f5f2', textDecoration: 'none', opacity: 0.75, transition: 'opacity 150ms', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              onMouseEnter={e => e.target.style.opacity = '1'}
              onMouseLeave={e => e.target.style.opacity = '0.75'}
            >
              About
            </button>
          </div>
        </div>

        {/* Social */}
        <div>
          <div style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700,
            fontSize: 13, marginBottom: 16, color: '#f9f5f2',
            textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5,
          }}>Social</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>
            {['Discord', 'YouTube', 'Bluesky'].map((label) => (
              <a
                key={label}
                href="#"
                style={{ color: '#f9f5f2', textDecoration: 'none', opacity: 0.75, transition: 'opacity 150ms' }}
                onMouseEnter={e => e.target.style.opacity = '1'}
                onMouseLeave={e => e.target.style.opacity = '0.75'}
              >{label}</a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700,
            fontSize: 13, marginBottom: 16, color: '#f9f5f2',
            textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5,
          }}>New games, weekly</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, background: 'rgba(249,245,242,0.12)',
                border: '2px solid rgba(249,245,242,0.3)',
                borderRadius: 999, padding: '11px 16px',
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14,
                outline: 'none', color: '#f9f5f2',
                transition: 'border-color 150ms',
              }}
              onFocus={e => e.target.style.borderColor = '#f4ed36'}
              onBlur={e => e.target.style.borderColor = 'rgba(249,245,242,0.3)'}
            />
            <button
              style={{
                background: '#f4ed36', color: '#000',
                border: '2px solid #1a1a1a', borderRadius: 999,
                padding: '11px 22px', fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                transition: 'transform 200ms', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Join</button>
          </div>
        </div>
      </div>

      {/* Divider + copyright */}
      <div style={{
        maxWidth: 1180, margin: '36px auto 0',
        paddingTop: 24, borderTop: '1px solid rgba(249,245,242,0.15)',
        fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12,
        color: '#f9f5f2', opacity: 0.45,
      }}>© 2026 tinybreak · made for five-minute breaks</div>
    </footer>
  );
}
