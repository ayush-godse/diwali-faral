import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import ProductGrid from './components/ProductGrid'
import CartModal from './components/CartModal'
import OrderModal from './components/OrderModal'
import AuthModal from './components/AuthModal'
import PolicyModal from './components/PolicyModal'
import AdminDashboard from './components/AdminDashboard'
import UserProfile from './components/UserProfile'
import Footer from './components/Footer'
import './App.css'

const API = import.meta.env.VITE_API_BASE_URL || '/api'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState({}) // { productId: { product, quantity } }
  const [cartOpen, setCartOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState(false)
  const [hasSkippedLanding, setHasSkippedLanding] = useState(sessionStorage.getItem('skippedLanding') === 'true')
  const [activePolicy, setActivePolicy] = useState(null) // 'terms', 'refund', etc.
  const [adminOpen, setAdminOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Fetch products
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      let url = `${API}/products?search=${encodeURIComponent(search)}`
      if (selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }
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
    const cartKey = `${product._id}-${product.selectedWeight}`
    setCart(prev => {
      const existing = prev[cartKey]
      return {
        ...prev,
        [cartKey]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
          selectedWeight: product.selectedWeight
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
    // Require authentication for placing orders
    if (!user) {
      alert('Please sign in to place an order.')
      setAuthOpen(true)
      return
    }
    // Confirm with user before placing order
    const confirmMsg = `Confirm place order for ₹${cartTotal}?`;
    if (!window.confirm(confirmMsg)) return
    const items = Object.values(cart).map(i => ({
      product: i.product._id,
      name: `${i.product.name} (${i.selectedWeight})`,
      price: i.product.price,
      quantity: i.quantity,
    }))
    const payload = { ...formData, items, totalAmount: cartTotal, user: user?._id }
    try {
      const res = await fetch(`${API}/orders/order-success`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
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
      <Navbar 
        cartCount={cartCount} 
        onCartOpen={() => setCartOpen(true)} 
        search={search} 
        onSearch={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        user={user}
        onAuthOpen={() => setAuthOpen(true)}
        onAdminOpen={() => setAdminOpen(true)}
        onProfileOpen={() => setProfileOpen(true)}
        onLogout={() => { 
          setUser(null); 
          localStorage.removeItem('user'); 
          setHasSkippedLanding(false);
          sessionStorage.removeItem('skippedLanding');
        }}
      />
      <Banner />
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
          onCheckout={() => {
            // If not signed in, require sign in before checkout
            if (!user) {
              setPendingCheckout(true)
              setAuthOpen(true)
              return
            }

            // If user has saved addresses and phone, offer quick confirm
            const defaultAddr = user?.addresses?.find(a => a.isDefault)?.fullAddress || user?.addresses?.[0]?.fullAddress
            if (user && defaultAddr && user.phone) {
              const confirmDirect = window.confirm(`Ship to saved address: ${defaultAddr}?`)
              if (confirmDirect) {
                placeOrder({ customerName: user.name, phone: user.phone, address: defaultAddr, email: user.email })
              } else {
                setOrderOpen(true) // Allow editing if they say no
              }
            } else {
              setOrderOpen(true)
            }
          }}
        />
      )}
      {orderOpen && (
        <OrderModal
          total={cartTotal}
          user={user}
          onClose={() => setOrderOpen(false)}
          onSubmit={placeOrder}
        />
      )}
      {(authOpen || (!user && !hasSkippedLanding)) && (
        <AuthModal
          onClose={() => {
            setAuthOpen(false);
            setHasSkippedLanding(true);
            sessionStorage.setItem('skippedLanding', 'true');
            setPendingCheckout(false)
          }}
          onAuthSuccess={(u) => {
            setUser(u)
            // If user came here to checkout, continue flow
            if (pendingCheckout) {
              setPendingCheckout(false)
              // If user has default address and phone, auto-place order
              const defaultAddr = u?.addresses?.find(a => a.isDefault)?.fullAddress || u?.addresses?.[0]?.fullAddress
              if (defaultAddr && u.phone) {
                placeOrder({ customerName: u.name, phone: u.phone, address: defaultAddr, email: u.email })
              } else {
                setOrderOpen(true)
              }
            }
          }}
          forceLanding={!user && !hasSkippedLanding}
        />
      )}
      {activePolicy && (
        <PolicyModal 
          type={activePolicy} 
          onClose={() => setActivePolicy(null)} 
        />
      )}
      {orderSuccess && (
        <div className="order-toast">
          🎉 Order placed! Happy Diwali!
        </div>
      )}
      {adminOpen && user?.isAdmin && (
        <AdminDashboard user={user} onClose={() => setAdminOpen(false)} />
      )}
      {profileOpen && user && (
        <UserProfile 
          user={user} 
          onClose={() => setProfileOpen(false)} 
          onUpdateUser={(updated) => {
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
          }}
        />
      )}
      <Footer onOpenPolicy={setActivePolicy} />
    </div>
  )
}

export default App
