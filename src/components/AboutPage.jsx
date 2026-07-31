import { ArrowLeft } from 'lucide-react';

export default function AboutPage({ setCurrentView }) {
  return (
    <div style={{ 
      maxWidth: 1040, 
      margin: '0 auto', 
      padding: '70px 40px 40px', 
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('home')}
        style={{
          background: '#f9f5f2',
          border: '2px solid #1a1a1a',
          borderRadius: 999,
          padding: '8px 18px',
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          boxShadow: '2px 2px 0 #1a1a1a',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
          alignSelf: 'flex-start',
          transition: 'transform 150ms'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* Main card */}
      <div style={{
        background: '#f9f5f2',
        border: '3px solid #1a1a1a',
        borderRadius: 24,
        padding: '36px 36px 32px',
        boxShadow: '8px 8px 0 #1a1a1a',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Profile Image container (Center Top) */}
        <div style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          border: '3px solid #1a1a1a',
          background: '#f4ed36',
          boxShadow: '4px 4px 0 #1a1a1a',
          overflow: 'hidden',
          margin: '-106px auto 20px', // Pulls it up into center top position
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}>
          <img 
            src="/me.jpg" // User can drop their image in public/me.jpg
            alt="My Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback smiley/logo
              const fallback = document.createElement('div');
              fallback.style.fontFamily = 'Sora, sans-serif';
              fallback.style.fontSize = '42px';
              fallback.style.fontWeight = '800';
              fallback.style.color = '#1a1a1a';
              fallback.innerText = '😎';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>

        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 800,
          fontSize: 32,
          color: '#1a1a1a',
          margin: '0 0 6px'
        }}>
          Hey, I'm the creator! 👋
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: '#61609a',
          margin: '0 0 28px'
        }}>
          The designer, developer, and gamer behind tinybreak.
        </p>

        {/* Story content splits - 2 columns on desktop to save height */}
        <div 
          className="about-grid-responsive"
          style={{
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: '#1a1a1a'
          }}
        >
          <div style={{
            background: 'rgba(97, 96, 154, 0.05)',
            border: '2px dashed rgba(26, 26, 42, 0.15)',
            borderRadius: 16,
            padding: '20px 24px'
          }}>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              margin: '0 0 8px',
              color: '#1a1a1a'
            }}>
              Who I Am
            </h2>
            <p style={{ margin: 0 }}>
              I am a passionate indie developer and game designer who loves creating minimalist, low-poly aesthetics and quick browser-based gaming experiences. I believe that games should be delightful, accessible, and respectful of your time. I wanted to build a cozy virtual arcade where anyone can drop in, play a clean and beautiful game, and leave feeling refreshed.
            </p>
          </div>

          <div style={{
            background: 'rgba(244, 237, 54, 0.06)',
            border: '2px dashed rgba(26, 26, 42, 0.15)',
            borderRadius: 16,
            padding: '20px 24px'
          }}>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              margin: '0 0 8px',
              color: '#1a1a1a'
            }}>
              How It Started
            </h2>
            <p style={{ margin: 0 }}>
              It all started from a feeling of digital exhaustion. I noticed how easily we fall into the "endless scroll" on social media during our short breaks. Instead of relaxing us, it leaves us more tired. I wanted to build an alternative—a "tiny break." I began coding small, low-poly puzzles that require no setups, contain no flashing ads, and can be completed in under 5 minutes. Today, tinybreak is the home of those quick, relaxing micro-adventures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
