function Navbar({ cartCount, onCartOpen }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>🪔 Gauri Godse</h1>
        <span>Homemade Diwali Faral</span>
      </div>
      <p className="navbar-address">
        Ashok Nagar, Bhingardive Mala, Gulmohor Road, Ahilyanagar
      </p>
      <button className="cart-btn" onClick={onCartOpen} id="open-cart-btn">
        🛒 Cart
        {cartCount > 0 && (
          <span className="cart-badge" key={cartCount}>{cartCount}</span>
        )}
      </button>
    </header>
  )
}

export default Navbar
