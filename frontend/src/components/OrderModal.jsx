import { useState } from 'react'

function OrderModal({ total, onClose, onSubmit }) {
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customerName || !form.phone || !form.address) {
      alert('Please fill all fields')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>🪔 Place Order</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form className="order-form" onSubmit={handleSubmit} id="order-form">
          <div className="form-group">
            <label htmlFor="customerName">Your Name</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.customerName}
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
              placeholder="e.g. 9876543210"
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
              placeholder="Full delivery address..."
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="order-summary-row">
            <span>Order Total</span>
            <span>₹{total}</span>
          </div>
          <button type="submit" className="submit-btn" id="submit-order-btn">
            🎉 Confirm Order
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderModal
