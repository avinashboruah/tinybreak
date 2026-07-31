export default function Categories({ categories, activeCategory, setActiveCategory }) {
  return (
    <section id="categories" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 64px' }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 32, margin: '0 0 28px', color: '#f9f5f2' }}>
        Categories
      </h2>
      <div className="categories-grid-responsive">
        {categories.map((c) => {
          const CatIcon = c.icon;
          const isActive = activeCategory === c.label;
          return (
            <div
              key={c.label}
              onClick={() => setActiveCategory(c.label)}
              className={`category-card ${isActive ? 'active' : ''}`}
            >
              <CatIcon size={26} strokeWidth={2.2} style={{ color: '#1a1a1a' }} />
              <div style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 12, fontWeight: 700, textAlign: 'center',
                color: '#1a1a1a',
              }}>
                {c.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
