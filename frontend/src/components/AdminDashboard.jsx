import { useState, useEffect } from 'react'
import './AdminDashboard.css'

function AdminDashboard({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  }

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'products') fetchProducts()
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { headers })
      const data = await res.json()
      if (data.success) setOrders(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) setProducts(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers
      })
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id))
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const productData = {
      name: formData.get('name'),
      slug: formData.get('slug') || formData.get('name').toLowerCase().replace(/\s+/g, '-'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      emoji: formData.get('emoji'),
      description: formData.get('description'),
      inStock: true
    }

    const method = editingProduct ? 'PUT' : 'POST'
    const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products'

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(productData)
      })
      const data = await res.json()
      if (data.success) {
        if (editingProduct) {
          setProducts(products.map(p => p._id === editingProduct._id ? data.data : p))
        } else {
          setProducts([data.data, ...products])
        }
        setShowProductForm(false)
        setEditingProduct(null)
      }
    } catch (err) {
      alert('Save failed')
    }
  }

  return (
    <div className="admin-dashboard-overlay">
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h2>👨‍💼 Admin Control Center</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-tabs">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        </div>

        <div className="admin-content">
          {loading && <div className="loading">Loading...</div>}

          {activeTab === 'orders' && (
            <div className="orders-panel">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>{order.customerName}<br/><small>{order.phone}</small></td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-panel">
              <button className="add-btn" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                + Add New Product
              </button>

              {showProductForm && (
                <div className="product-form-container">
                  <form onSubmit={handleProductSubmit}>
                    <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <div className="form-grid">
                      <input name="name" placeholder="Product Name" defaultValue={editingProduct?.name} required />
                      <input name="slug" placeholder="Slug (optional)" defaultValue={editingProduct?.slug} />
                      <input name="category" placeholder="Category (Sweets/Snacks)" defaultValue={editingProduct?.category} required />
                      <input name="price" type="number" placeholder="Base Price (250g)" defaultValue={editingProduct?.price} required />
                      <input name="emoji" placeholder="Emoji (e.g. 🥧)" defaultValue={editingProduct?.emoji} required />
                      <textarea name="description" placeholder="Description" defaultValue={editingProduct?.description} required />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn">Save Product</button>
                      <button type="button" className="cancel-btn" onClick={() => setShowProductForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td style={{ fontSize: '2rem' }}>{product.emoji}</td>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <button className="edit-btn" onClick={() => { setEditingProduct(product); setShowProductForm(true); }}>Edit</button>
                          <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
