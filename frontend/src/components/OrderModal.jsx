import { useState } from 'react'

function OrderModal({ total, onClose, onSubmit, user }) {
  const [form, setForm] = useState({ 
    customerName: user?.name || '', 
    phone: user?.phone || '', 
    email: user?.email || '',
    address: user?.addresses?.find(a => a.isDefault)?.fullAddress || user?.addresses?.[0]?.fullAddress || '' 
  })
  const [isPaying, setIsPaying] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAddressSelect = (addr) => {
    setForm({ ...form, address: addr })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customerName || !form.phone || !form.address || !form.email) {
      alert('Please fill all fields')
      return
    }
    
    // Simulate Payment Gateway
    setIsPaying(true)
    setTimeout(() => {
      setIsPaying(false)
      onSubmit({ ...form, paymentStatus: 'paid', transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase() })
    }, 2000)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${isPaying ? 'paying' : ''}`}>
        {isPaying ? (
          <div className="payment-simulation">
            <div className="payment-spinner"></div>
            <h3>Securing your payment...</h3>
            <p>Do not refresh this page</p>
            <div className="payment-icons">💳 🏦 📱</div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>🪔 Secure Checkout</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>
            {user?.addresses?.length > 0 && (
              <div className="saved-addresses-selector">
                <p className="selector-label">Deliver to saved address:</p>
                <div className="addr-pills">
                  {user.addresses.map(addr => (
                    <button 
                      key={addr._id} 
                      className={`addr-pill ${form.address === addr.fullAddress ? 'active' : ''}`}
                      onClick={() => handleAddressSelect(addr.fullAddress)}
                      type="button"
                    >
                      {addr.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <form className="order-form" onSubmit={handleSubmit} id="order-form">
              <div className="form-group">
                <label htmlFor="customerName">Name</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Enter your name"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="For order confirmation"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="For delivery updates"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Full address for delivery"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="order-summary-row">
                <span>Amount to Pay</span>
                <span>₹{total}</span>
              </div>
              <button type="submit" className="submit-btn payment-btn" id="submit-order-btn">
                Proceed to Pay ₹{total} →
              </button>
              <p className="payment-security-tip">🔒 Secure encryption by Diwali Store Payments</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderModal
