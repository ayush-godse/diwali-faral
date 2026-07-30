function CartModal({ cart, total, onClose, onRemove, onUpdateQty, onCheckout }) {
  const cartEntries = Object.entries(cart)

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>🛒 Your Cart</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {cartEntries.length === 0 ? (
          <p className="cart-empty">Your cart is empty 🪔<br/>Add some faral!</p>
        ) : (
          <>
            <ul className="cart-items" id="cartItems">
              {cartEntries.map(([key, { product, quantity, selectedWeight }]) => (
                <li className="cart-item" key={key}>
                  <span className="cart-item-emoji">{product.emoji}</span>
                  <div className="cart-item-info">
                    <strong>{product.name} ({selectedWeight})</strong>
                    <span>₹{product.price} × {quantity} = ₹{product.price * quantity}</span>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => onUpdateQty(key, -1)}>−</button>
                    <span className="qty">{quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(key, +1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(key)} title="Remove">❌</button>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="checkout-btn" id="checkout-btn" onClick={onCheckout}>
              Place Order →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CartModal
