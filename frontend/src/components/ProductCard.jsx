function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" data-name={product.slug}>
      <div className="product-emoji-wrap">{product.emoji}</div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="product-meta">
          <span className="price">₹{product.price}</span>
          <span className="unit">{product.unit}</span>
        </div>
        <button
          className="add-to-cart-btn"
          id={`add-to-cart-${product.slug}`}
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
