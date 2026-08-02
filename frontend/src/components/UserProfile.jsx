import { useState, useEffect } from 'react'
import './UserProfile.css'
import { apiUrl } from '../api'

function UserProfile({ user, onClose, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState(user.addresses || [])
  const [loading, setLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/users/profile'), { headers })
      const data = await res.json()
      if (data.success) {
        setOrders(data.data.orders)
        setAddresses(data.data.user.addresses)
        onUpdateUser({ ...user, addresses: data.data.user.addresses })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addAddress = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newAddr = {
      label: formData.get('label'),
      fullAddress: formData.get('fullAddress'),
      isDefault: formData.get('isDefault') === 'on'
    }

    try {
      const res = await fetch(apiUrl('/users/addresses'), {
        method: 'POST',
        headers,
        body: JSON.stringify(newAddr)
      })
      const data = await res.json()
      if (data.success) {
        setAddresses(data.data)
        onUpdateUser({ ...user, addresses: data.data })
        setShowAddressForm(false)
      }
    } catch (err) {
      alert('Failed to add address')
    }
  }

  const deleteAddress = async (id) => {
    try {
      const res = await fetch(apiUrl(`/users/addresses/${id}`), {
        method: 'DELETE',
        headers
      })
      const data = await res.json()
      if (data.success) {
        setAddresses(data.data)
        onUpdateUser({ ...user, addresses: data.data })
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <div className="profile-header">
          <div className="user-persona">
            <div className="avatar">{user.name[0]}</div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.phone}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="profile-tabs">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Order History</button>
          <button className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>📍 Saved Addresses</button>
        </div>

        <div className="profile-content">
          {loading && <div className="loading-spinner">✨ Loading your treasures...</div>}

          {activeTab === 'orders' && (
            <div className="orders-history">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet? Time to celebrate Diwali! 🪔</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="order-history-card">
                    <div className="order-main">
                      <div className="order-info-mini">
                        <span className="order-id">{order.orderId}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-status-badge" data-status={order.status}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-items-list">
                      {order.items.map(item => (
                        <span key={item._id}>{item.name} x {item.quantity}</span>
                      ))}
                    </div>
                    <div className="order-footer">
                      <strong>Total: ₹{order.totalAmount}</strong>
                      <span className="pay-status">{order.paymentStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-list">
              <button className="add-address-btn" onClick={() => setShowAddressForm(true)}>
                + Add New Address
              </button>

              {showAddressForm && (
                <div className="address-form-box">
                  <form onSubmit={addAddress}>
                    <h3>New Address</h3>
                    <input name="label" placeholder="Label (e.g. Home, Office)" required />
                    <textarea name="fullAddress" placeholder="Full Address with Landmark" required />
                    <label className="checkbox-label">
                      <input type="checkbox" name="isDefault" /> Set as default address
                    </label>
                    <div className="form-btns">
                      <button type="submit" className="save-btn">Save</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="saved-addresses">
                {addresses.map(addr => (
                  <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                    <div className="addr-header">
                      <strong>{addr.label}</strong>
                      {addr.isDefault && <span className="default-tag">Default</span>}
                    </div>
                    <p>{addr.fullAddress}</p>
                    <button className="delete-addr-btn" onClick={() => deleteAddress(addr._id)}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
