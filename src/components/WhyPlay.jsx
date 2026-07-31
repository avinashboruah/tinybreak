export default function WhyPlay({ items }) {
  return (
    <section id="about" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 64px' }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 32, margin: '0 0 28px', color: '#f9f5f2' }}>
        Why tinybreak?
      </h2>
      <div className="grid-responsive-3">
        {items.map((w) => {
          const WhyIcon = w.icon;
          return (
            <div
              key={w.title}
              style={{
                background: w.bg,
                border: '2px solid #1a1a1a',
                borderRadius: 24,
                padding: '32px 28px',
                boxShadow: '0 4px 0 #1a1a1a',
                transition: 'transform 200ms, box-shadow 200ms',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 0 #1a1a1a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #1a1a1a';
              }}
            >
              {/* Premium Lucide icon placement inside cards */}
              <div style={{
                background: '#f9f5f2',
                border: '2px solid #1a1a1a',
                borderRadius: 16,
                width: 54,
                height: 54,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '2px 2px 0 #1a1a1a'
              }}>
                <WhyIcon size={26} strokeWidth={2.5} style={{ color: '#1a1a1a' }} />
              </div>
              
              <h3 style={{
                fontFamily: 'Sora, sans-serif', fontWeight: 700,
                fontSize: 20, margin: '0 0 10px', color: '#1a1a1a',
              }}>{w.title}</h3>
              <p style={{
                margin: 0, fontSize: 14, lineHeight: 1.6,
                color: '#1a1a1a', opacity: 0.75,
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}>{w.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
