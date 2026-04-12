import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import ProductGrid from './components/ProductGrid'
import CartModal from './components/CartModal'
import OrderModal from './components/OrderModal'
import Footer from './components/Footer'
import './App.css'

const API = '/api'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({}) // { productId: { product, quantity } }
  const [cartOpen, setCartOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Fetch products
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = search
        ? `${API}/products?search=${encodeURIComponent(search)}`
        : `${API}/products`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setProducts(data.data)
      else throw new Error(data.message)
    } catch (err) {
      setError('Could not load products. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev[product._id]
      return {
        ...prev,
        [product._id]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const updateQty = (productId, delta) => {
    setCart(prev => {
      const item = prev[productId]
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      }
      return { ...prev, [productId]: { ...item, quantity: newQty } }
    })
  }

  const cartCount = Object.values(cart).reduce((acc, i) => acc + i.quantity, 0)
  const cartTotal = Object.values(cart).reduce((acc, i) => acc + i.product.price * i.quantity, 0)

  const placeOrder = async (formData) => {
    const items = Object.values(cart).map(i => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }))
    const payload = { ...formData, items, totalAmount: cartTotal }
    try {
      const res = await fetch(`${API}/orders/order-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        // Handle PDF download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${payload.customerName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setCart({})
        setOrderOpen(false)
        setCartOpen(false)
        setOrderSuccess(true)
        setTimeout(() => setOrderSuccess(false), 5000)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err) {
      alert('Order failed: ' + err.message)
    }
  }

  return (
    <div className="app">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Banner search={search} onSearch={setSearch} />
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={addToCart}
      />
      {cartOpen && (
        <CartModal
          cart={cart}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          onCheckout={() => setOrderOpen(true)}
        />
      )}
      {orderOpen && (
        <OrderModal
          total={cartTotal}
          onClose={() => setOrderOpen(false)}
          onSubmit={placeOrder}
        />
      )}
      {orderSuccess && (
        <div className="order-toast">
          🎉 Order placed! Happy Diwali!
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App
