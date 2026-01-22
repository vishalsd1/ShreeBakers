import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import CakeListing from './components/CakeListing'
import Cart from './components/Cart'
import OrderConfirmation from './components/OrderConfirmation'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import OrderTracking from './components/OrderTracking'
import Login from './components/Login'
import CakeDetail from './components/CakeDetail'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cart, setCart] = useState([])
  const [order, setOrder] = useState(null)
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [selectedCake, setSelectedCake] = useState(null)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddToCart = (item) => {
    // Check if item already exists in cart (same cake, same weight)
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.weight === item.weight
    )

    if (existingIndex > -1) {
      // Update quantity and total
      const updatedCart = [...cart]
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + item.quantity,
        itemTotal: updatedCart[existingIndex].price * (updatedCart[existingIndex].quantity + item.quantity)
      }
      setCart(updatedCart)
      showToast(`${item.name} quantity updated!`)
    } else {
      // Add new item
      setCart([...cart, item])
      showToast(`${item.name} added to cart!`)
    }
  }

  const handleCheckout = (orderData) => {
    setOrder(orderData)
    setCart([])
    setCurrentPage('confirmation')
    window.scrollTo(0, 0)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleCakeClick = (cake) => {
    setSelectedCake(cake);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('home');
    showToast(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');
    showToast('Logged out successfully');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
    setCurrentPage('admin-dashboard')
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setCurrentPage('home')
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Render Admin Pages
  if (currentPage === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  if (currentPage === 'admin-dashboard') {
     return <AdminDashboard onLogout={handleAdminLogout} />
  }

  // Render Login Page
  if (currentPage === 'login') {
    return (
      <LanguageProvider>
        <Header currentPage={currentPage} cartCount={cartCount} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
        <Login onLogin={handleLogin} />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    )
  }

  // Render Track Order Page
  if (currentPage === 'track-order') {
    return (
      <LanguageProvider>
        <Header currentPage={currentPage} cartCount={cartCount} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
        <OrderTracking />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    )
  }

  // Render Product Detail Page
  if (currentPage === 'product-detail' && selectedCake) {
    return (
      <LanguageProvider>
        <Header currentPage={currentPage} cartCount={cartCount} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
        <CakeDetail 
          cake={selectedCake} 
          onAddToCart={(item) => {
            handleAddToCart(item);
            // Optionally stay on page or go back
          }}
          onBack={() => handleNavigate('order')}
        />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            {toast}
          </div>
        )}
        
        <Header
          currentPage={currentPage}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />

        <main>
          {currentPage === 'home' && (
            <Home onNavigate={handleNavigate} onAddToCart={handleAddToCart} onCakeClick={handleCakeClick} />
          )}

          {currentPage === 'order' && (
            <CakeListing onAddToCart={handleAddToCart} onCakeClick={handleCakeClick} />
          )}

          {currentPage === 'cart' && (
            <Cart
              cart={cart}
              onUpdateCart={setCart}
              onNavigate={handleNavigate}
              onCheckout={handleCheckout}
              user={user}
            />
          )}

          {currentPage === 'confirmation' && order && (
            <OrderConfirmation order={order} onNavigate={handleNavigate} />
          )}

          {currentPage === 'contact' && (
            <Contact />
          )}
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
    </LanguageProvider>
  )
}

export default App