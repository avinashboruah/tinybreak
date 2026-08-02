export default function Categories({ categories, activeCategory, setActiveCategory }) {
  return (
    <section id="categories" className="categories-section">
      <div className="categories-header-container">
        <h2 className="section-heading" style={{ margin: 0 }}>
          Categories
        </h2>
      </div>
      
      <div className="categories-carousel-wrapper">
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
                <CatIcon size={20} strokeWidth={2.2} style={{ color: '#1a1a1a' }} />
                <div className="category-label">
                  {c.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
