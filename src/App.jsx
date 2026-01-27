import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Home from "./components/Home";
import CakeListing from "./components/CakeListing";
import Cart from "./components/Cart";
import Checkout from "./components/checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import OrderTracking from "./components/OrderTracking";
import Login from "./components/Login";
import CakeDetail from "./components/CakeDetail";

import { LanguageProvider } from "./context/LanguageContext";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);

  /* -------------------- LOCAL STORAGE -------------------- */

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  /* -------------------- HELPERS -------------------- */

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  /* -------------------- CART -------------------- */

  const handleAddToCart = (item) => {
    const existingIndex = cart.findIndex(
      (c) => c.id === item.id && c.weight === item.weight
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
      updated[existingIndex].itemTotal =
        updated[existingIndex].price *
        updated[existingIndex].quantity;
      setCart(updated);
      showToast("Cart updated");
    } else {
      setCart([...cart, item]);
      showToast("Added to cart");
    }
  };

  /* -------------------- CHECKOUT -------------------- */

  const handleCheckout = (orderData) => {
    setOrder(orderData);
    setCart([]);
    localStorage.removeItem("cart");
    setCurrentPage("confirmation");
  };

  /* -------------------- AUTH -------------------- */

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem("adminAuth", "true");
    setCurrentPage("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("adminAuth");
    setCurrentPage("home");
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  /* -------------------- ADMIN -------------------- */

  if (currentPage === "admin-login") {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (currentPage === "admin-dashboard" || isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  /* -------------------- LOGIN -------------------- */

  if (currentPage === "login") {
    return (
      <LanguageProvider>
        <Header
          currentPage={currentPage}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <Login onLogin={handleLogin} />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    );
  }

  /* -------------------- TRACK ORDER -------------------- */

  if (currentPage === "track-order") {
    return (
      <LanguageProvider>
        <Header
          currentPage={currentPage}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <OrderTracking />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    );
  }

  /* -------------------- PRODUCT DETAIL -------------------- */

  if (currentPage === "product-detail" && selectedCake) {
    return (
      <LanguageProvider>
        <Header
          currentPage={currentPage}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <CakeDetail
          cake={selectedCake}
          onAddToCart={handleAddToCart}
          onBack={() => handleNavigate("order")}
        />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    );
  }

  /* -------------------- CHECKOUT PAGE (🔥 FIX) -------------------- */

  if (currentPage === "checkout") {
    return (
      <LanguageProvider>
        <Header
          currentPage={currentPage}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <Checkout cart={cart} onCheckout={handleCheckout} />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    );
  }

  /* -------------------- CONFIRMATION -------------------- */

  if (currentPage === "confirmation" && order) {
    return (
      <LanguageProvider>
        <Header
          currentPage={currentPage}
          cartCount={0}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <OrderConfirmation order={order} onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate} />
      </LanguageProvider>
    );
  }

  /* -------------------- DEFAULT -------------------- */

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow z-50">
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
          {currentPage === "home" && (
            <Home onNavigate={handleNavigate} />
          )}

          {currentPage === "order" && (
            <CakeListing
              onAddToCart={handleAddToCart}
              onCakeClick={(cake) => {
                setSelectedCake(cake);
                setCurrentPage("product-detail");
              }}
            />
          )}

          {currentPage === "cart" && (
            <Cart
              cart={cart}
              onUpdateCart={setCart}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "contact" && <Contact />}
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
    </LanguageProvider>
  );
}

export default App;
