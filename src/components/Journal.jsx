export default function Journal({ posts }) {
  return (
    <section id="journal" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 80px' }}>
      <h2 className="section-heading">
        From the journal
      </h2>
      <div className="grid-responsive-3">
        {posts.map((j) => (
          <div
            key={j.title}
            style={{
              background: '#f9f5f2',
              border: '2px solid #1a1a1a',
              borderRadius: 20,
              padding: '26px 24px',
              cursor: 'pointer',
              transition: 'transform 200ms, box-shadow 200ms',
              boxShadow: '0 2px 0 #1a1a1a',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 0 #1a1a1a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 0 #1a1a1a';
            }}
          >
            <div style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 12, fontWeight: 700,
              color: '#ac4f98', marginBottom: 10,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {j.tag} · {j.date}
            </div>
            <h3 style={{
              fontFamily: 'Sora, sans-serif', fontWeight: 700,
              fontSize: 18, margin: '0 0 10px', color: '#1a1a1a', lineHeight: 1.3,
            }}>{j.title}</h3>
            <p style={{
              margin: 0, fontSize: 14, lineHeight: 1.6,
              color: '#61609a',
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}>{j.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
