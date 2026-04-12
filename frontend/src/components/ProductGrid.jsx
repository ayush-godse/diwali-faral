import ProductCard from './ProductCard'

function ProductGrid({ products, loading, error, onAddToCart }) {
  if (loading) {
    return (
      <section className="products-section">
        <div className="loading-wrap">
          <div className="spinner"></div>
          <p>Loading faral...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="error-wrap">
          <p>⚠️ {error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="products-section">
        <div className="empty-wrap">
          <p>🔍 No faral found. Try a different search!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="products-section">
      <h2>Our Special Faral</h2>
      <p>{products.length} item{products.length !== 1 ? 's' : ''} available</p>
      <div className="product-grid" id="productGrid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductGrid
