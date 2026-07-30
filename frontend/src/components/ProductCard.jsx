import { useState } from 'react'

function ProductCard({ product, onAddToCart }) {
  const [weight, setWeight] = useState('250g')
  
  const getPrice = () => {
    if (weight === '500g') return product.price * 1.9 // Slight discount for 500g
    if (weight === '1kg') return product.price * 3.7 // Bulk discount for 1kg
    return product.price
  }

  const currentPrice = Math.round(getPrice())

  return (
    <div className="product-card" data-name={product.slug}>
      <div className="product-emoji-wrap">{product.emoji}</div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="rating-stars">
          {'★'.repeat(Math.floor(product.avgRating || 0))}
          {'☆'.repeat(5 - Math.floor(product.avgRating || 0))}
          <span className="review-count">({product.reviews?.length || 0})</span>
        </div>
        
        <div className="weight-selector">
          {['250g', '500g', '1kg'].map(w => (
            <button 
              key={w} 
              className={`weight-btn ${weight === w ? 'active' : ''}`}
              onClick={() => setWeight(w)}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="product-meta">
          <span className="price">₹{currentPrice}</span>
          <span className="unit-label">for {weight === '1kg' ? '1 kg' : weight}</span>
        </div>
        <button
          className="add-to-cart-btn"
          id={`add-to-cart-${product.slug}`}
          onClick={() => onAddToCart({ ...product, price: currentPrice, selectedWeight: weight })}
          disabled={!product.inStock}
        >
          {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
