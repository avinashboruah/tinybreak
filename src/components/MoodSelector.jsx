import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function MoodSelector({ moods, moodMsg }) {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 64px' }}>
      <div 
        className="mood-container-responsive"
        style={{
          background: '#f9f5f2',
          border: '2px solid #1a1a1a',
          borderRadius: 24,
          padding: '36px 40px',
          boxShadow: '0 4px 0 #1a1a1a',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h2 style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700,
            fontSize: 26, margin: '0 0 6px', color: '#1a1a1a',
          }}>
            What's your mood?
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 15, color: '#61609a', fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Pick one — we'll match you with a game.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {moods.map((m) => {
              const MoodIcon = m.icon;
              return (
                <button
                  key={m.label}
                  onClick={m.pick}
                  style={{
                    background: m.bg, color: '#1a1a1a',
                    border: '2px solid #1a1a1a', borderRadius: 999,
                    padding: '12px 26px',
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontWeight: 600, fontSize: 15, cursor: 'pointer',
                    transition: 'transform 200ms, box-shadow 200ms',
                    boxShadow: '0 2px 0 #1a1a1a',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 0 #1a1a1a';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 0 #1a1a1a';
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.96)';
                    e.currentTarget.style.boxShadow = '0 1px 0 #1a1a1a';
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 0 #1a1a1a';
                  }}
                >
                  <MoodIcon size={18} strokeWidth={2.5} style={{ color: '#1a1a1a' }} />
                  {m.label}
                </button>
              );
            })}
            {moodMsg && (
              <div style={{
                alignSelf: 'center',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                animation: 'bounceIn 300ms ease-out',
                background: '#f4ed36',
                border: '2px solid #1a1a1a',
                borderRadius: 999,
                padding: '10px 20px',
                boxShadow: '2px 2px 0 #1a1a1a'
              }}>→ {moodMsg}</div>
            )}
          </div>
        </div>

        {/* Vintage Car Lottie sticker on the empty side */}
        <div 
          className="mood-car-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DotLottieReact
            src="/Vintage Car.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%', maxWidth: 350, maxHeight: 300 }}
          />
        </div>
      </div>
    </section>
  );
}
