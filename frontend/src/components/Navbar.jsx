function Navbar({ cartCount, onCartOpen, search, onSearch, selectedCategory, onCategoryChange, user, onAuthOpen, onLogout, onAdminOpen, onProfileOpen }) {
  const categories = ['All', 'Sweets', 'Snacks', 'Gift Boxes', 'Combo Packs'];

  return (
    <header className="navbar amazon-style">
      <div className="navbar-top">
        <div className="navbar-brand" onClick={() => onCategoryChange('All')}>
          <div className="brand-main">
            <h1>🪔 Gauri Godse</h1>
            <span className="brand-tagline">Homemade Diwali Faral</span>
          </div>
        </div>

        <div className="navbar-search">
          <select 
            className="category-select" 
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Search for homemade delicacies..." 
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-user">
          {user?.isAdmin && (
            <button className="admin-btn" onClick={onAdminOpen}>
              🛠️ Control
            </button>
          )}
          {user ? (
              <div className="user-info" onClick={onProfileOpen} style={{ cursor: 'pointer' }}>
              <span className="user-name">Hello, {user.name}</span>
              <button className="logout-btn" onClick={(e) => { 
                e.stopPropagation(); 
                const ok = window.confirm('Are you sure you want to logout?');
                if (ok) onLogout();
              }}>Logout</button>
            </div>
          ) : (
            <button className="login-link" onClick={onAuthOpen}>
              Sign In
            </button>
          )}

          <button className="cart-btn" onClick={onCartOpen} id="open-cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge" key={cartCount}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
      <div className="navbar-bottom">
        <nav className="navbar-links">
          {categories.map(c => (
            <a 
              key={c} 
              href="#" 
              className={selectedCategory === c ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onCategoryChange(c); }}
            >
              {c}
            </a>
          ))}
        </nav>
        <span className="navbar-address-mini">
          Ahilyanagar, Maharashtra
        </span>
      </div>
    </header>
  )
}

export default Navbar
